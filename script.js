import { db } from "./firebase-config.js";

import {
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("bookingForm");
const message = document.getElementById("message");
const qrbox = document.getElementById("qrcode");
const ticketBox = document.getElementById("ticket");
const bookButton = document.getElementById("bookButton");

form.addEventListener("submit", async function(e) {

e.preventDefault();

message.innerHTML = "⏳ Booking...";

bookButton.disabled = true;

/*
CREATE UNIQUE TICKET ID
*/

const ticketID =
"TICKET-" +
Math.floor(100000 + Math.random() * 900000);

/*
CREATE BOOKING DATA
*/

const ticket = {

  ticketID: ticketID,

  name:
     document.getElementById("name").value.trim(),

  email:
     document.getElementById("email").value.trim(),

  phone:
     document.getElementById("phone").value.trim(),

  event:
     document.getElementById("event").value,

  date:
     new Date().toLocaleString(),

  checkedIn: false,

  checkInTime: ""

};

try {

  /*
  SAVE BOOKING TO FIRESTORE

  Ticket ID is used as the document ID.
  */

  await setDoc(
     doc(db, "bookings", ticketID),
     ticket
  );


  /*
  SUCCESS MESSAGE
  */

  message.innerHTML =
     "✅ Booking Successful!";


  /*
  SHOW TICKET INFORMATION
  */

  document.getElementById("ticketName").textContent =
     ticket.name;

  document.getElementById("ticketEmail").textContent =
     ticket.email;

  document.getElementById("ticketPhone").textContent =
     ticket.phone;

  document.getElementById("ticketEvent").textContent =
     ticket.event;

  document.getElementById("ticketNumber").textContent =
     ticket.ticketID;

  document.getElementById("ticketDate").textContent =
     ticket.date;


  ticketBox.style.display =
     "block";


  /*
  GENERATE QR CODE

  QR contains Ticket ID only.
  */

  qrbox.innerHTML = "";


  new QRCode(
     qrbox,
     {
        text: ticket.ticketID,

        width: 180,

        height: 180
     }
  );


  /*
  CLEAR BOOKING FORM
  */

  form.reset();

}

catch(error) {

  console.error(
     "Booking Error:",
     error
  );


  message.innerHTML =
     "❌ Booking failed: " +
     error.message;

}

finally {

  bookButton.disabled =
     false;

}

});
