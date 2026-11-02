import { db, auth } from "./firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const organizerName = document.getElementById("organizerName");
const organizerEmail = document.getElementById("organizerEmail");
const accountStatus = document.getElementById("accountStatus");

const purchasedBox = document.getElementById("purchasedCapacity");
const usedBox = document.getElementById("usedCapacity");
const remainingBox = document.getElementById("remainingCapacity");

const eventForm = document.getElementById("eventForm");
const message = document.getElementById("message");
const eventsList = document.getElementById("eventsList");

const createButton = document.getElementById("createEventButton");

const eventTypeSelect = document.getElementById("eventType");
const otherEventTypeBox = document.getElementById("otherEventTypeBox");
const customEventType = document.getElementById("customEventType");

let currentUser = null;
let organizerData = null;


// Show messages
function showMessage(text, color = "green") {
  message.textContent = text;
  message.style.color = color;
}


// Event Type: Show Other input
eventTypeSelect.addEventListener("change", function () {

  const isOther = eventTypeSelect.value === "Other";

  otherEventTypeBox.classList.toggle("hidden", !isOther);

  customEventType.required = isOther;

  if (!isOther) {
    customEventType.value = "";
  }

});


// Load authenticated organizer
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "./organizer-auth.html";
    return;
  }

  currentUser = user;

  organizerName.textContent = "Loading organizer profile...";
  organizerEmail.textContent = "Email: " + (user.email || "Not available");
  accountStatus.textContent = "Checking account status...";

  try {

    const profileRef = doc(db, "organizers", user.uid);
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) {

      organizerName.textContent = "Organizer profile not found.";
      accountStatus.textContent = "Please contact support.";

      eventForm.style.display = "none";
      eventsList.textContent = "Organizer profile not found.";

      return;
    }

    organizerData = profileSnap.data();

    organizerName.textContent =
      "Name: " +
      (organizerData.name || organizerData.fullName || "Organizer");

    organizerEmail.textContent =
      "Email: " + (user.email || organizerData.email || "Not available");

    accountStatus.textContent =
      "Account status: " + (organizerData.status || "Registered");

    updateCapacity();

    await loadMyEvents();

  } catch (error) {

    console.error("Dashboard loading error:", error);

    organizerName.textContent = "Could not load organizer details.";

    accountStatus.textContent =
      "Error: " + error.message;

    eventsList.textContent =
      "Could not load events. Please check your internet connection and Firestore permissions.";

  }

});


// Update capacity boxes
function updateCapacity() {

  const purchased = Number(organizerData.purchasedCapacity || 0);
  const used = Number(organizerData.usedCapacity || 0);

  const remaining = Math.max(0, purchased - used);

  purchasedBox.textContent = purchased;
  usedBox.textContent = used;
  remainingBox.textContent = remaining;

}


// Load events belonging to this organizer
async function loadMyEvents() {

  eventsList.textContent = "Loading your events...";

  try {

    const eventsQuery = query(
      collection(db, "events"),
      where("organizerId", "==", currentUser.uid)
    );

    const snapshot = await getDocs(eventsQuery);

    eventsList.innerHTML = "";

    if (snapshot.empty) {
      eventsList.textContent = "You have not created any events yet.";
      return;
    }

    snapshot.forEach((eventDoc) => {

      const event = eventDoc.data();

      const box = document.createElement("div");
      box.className = "event";

      const title = document.createElement("h4");
      title.textContent = event.name || "Untitled Event";

      const type = document.createElement("p");
      type.textContent = "Event Type: " + (event.eventType || "Not specified");

      const date = document.createElement("p");
      date.textContent = "Date: " + (event.date || "Not specified");

      const venue = document.createElement("p");
      venue.textContent = "Venue: " + (event.venue || "Not specified");

      const capacity = document.createElement("p");
      capacity.textContent = "Capacity: " + (event.capacity || 0);

      const status = document.createElement("p");
      status.textContent = "Status: " + (event.status || "Not specified");

      box.append(title, type, date, venue, capacity, status);

      eventsList.appendChild(box);

    });

  } catch (error) {

    console.error("Events loading error:", error);

    eventsList.textContent =
      "Unable to load events: " + error.message;

  }

}


// Create new event
eventForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  if (!currentUser || !organizerData) {
    showMessage("Please log in again.", "red");
    return;
  }

  const purchased = Number(organizerData.purchasedCapacity || 0);
  const used = Number(organizerData.usedCapacity || 0);

  const remaining = Math.max(0, purchased - used);

  const capacity = Number(
    document.getElementById("eventCapacity").value
  );

  if (remaining <= 0) {

    showMessage(
      "You have no remaining participant capacity. Purchase capacity first.",
      "red"
    );

    return;
  }

  if (
    !Number.isInteger(capacity) ||
    capacity < 1 ||
    capacity > remaining
  ) {

    showMessage(
      "Event capacity cannot exceed your remaining purchased capacity.",
      "red"
    );

    return;
  }


  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;

  if (endTime <= startTime) {

    showMessage("End time must be later than start time.", "red");

    return;
  }


  const selectedType = eventTypeSelect.value;

  if (!selectedType) {
    showMessage("Please select an event type.", "red");
    return;
  }

  let finalEventType = selectedType;

  if (selectedType === "Other") {

    const customType = customEventType.value.trim();

    if (!customType) {
      showMessage("Please enter your event type.", "red");
      return;
    }

    finalEventType = customType;

  }


  const eventData = {

    name: document.getElementById("eventName").value.trim(),

    eventType: finalEventType,

    description:
      document.getElementById("eventDescription").value.trim(),

    organizerName:
      document.getElementById("organizerDisplayName").value.trim(),

    organizerId: currentUser.uid,

    date: document.getElementById("eventDate").value,

    startTime: startTime,

    endTime: endTime,

    venue: document.getElementById("eventVenue").value.trim(),

    address: document.getElementById("eventAddress").value.trim(),

    contactNumber:
      document.getElementById("eventContact").value.trim(),

    contactEmail:
      document.getElementById("eventEmail").value.trim(),

    image: document.getElementById("eventImage").value.trim(),

    capacity: capacity,

    registrations: 0,

    status: "open",

    createdAt: serverTimestamp()

  };


  createButton.disabled = true;
  createButton.textContent = "Creating...";

  try {

    await addDoc(collection(db, "events"), eventData);

    showMessage("Event created successfully!");

    eventForm.reset();

    otherEventTypeBox.classList.add("hidden");
    customEventType.required = false;

    await loadMyEvents();

  } catch (error) {

    console.error("Event creation error:", error);

    showMessage(
      "Event creation failed: " + error.message,
      "red"
    );

  } finally {

    createButton.disabled = false;
    createButton.textContent = "Create Event";

  }

});


// Logout
document.getElementById("logoutButton").addEventListener("click", async () => {

  try {

    await signOut(auth);

    window.location.href = "./organizer-auth.html";

  } catch (error) {

    alert("Logout failed: " + error.message);

  }

});
