import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {
   
   apiKey: "AIzaSyC-T2k0YrJOfQb7LV5qcUsOPwvWI_edXKM",
   
   authDomain: "event-booking-app-ee02b.firebaseapp.com",
   
   projectId: "event-booking-app-ee02b",
   
   storageBucket: "event-booking-app-ee02b.firebasestorage.app",
   
   messagingSenderId: "526513199259",
   
   appId: "1:526513199259:web:92442ef0079e07a0364e3e",
   
   measurementId: "G-QXSZ66ZFRR"
   
};


const app = initializeApp(firebaseConfig);


const db = getFirestore(app);


export { db };
