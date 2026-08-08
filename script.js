import { db } from "./firebase-config.js";

import {
   collection,
   addDoc
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
   
   const ticketID =
      "TICKET-" +
      Math.floor(100000 + Math.random() * 900000);
   
   
   const ticket = {
      
      ticketID: ticketID,
      
      name: document.getElementById("name").value.trim(),
      
      email: document.getElementById("email").value.trim(),
      
      phone: document.getElementById("phone").value.trim(),
      
      event: document.getElementById("event").value,
      
      date: new Date().toLocaleString()
      
   };
   
   
   try {
      
      await addDoc(
         collection(db, "bookings"),
         ticket
      );
      
      
      message.innerHTML =
         "✅ Booking Successful!";
      
      
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
      
      
      ticketBox.style.display = "block";
      
      
      qrbox.innerHTML = "";
      
      
      new QRCode(qrbox, {
         
         text: ticket.ticketID,
         
         width: 180,
         
         height: 180
         
      });
      
      
      form.reset();
      
   }
   
   catch (error) {
      
      console.error(error);
      
      message.innerHTML =
         "❌ Booking failed: " + error.message;
      
   }
   
   finally {
      
      bookButton.disabled = false;
      
   }
   
});
