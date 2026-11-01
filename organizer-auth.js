import { db, auth } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let isRegister = true;

const message = document.getElementById("message");
const button = document.getElementById("submitButton");


function showMessage(text, type){

    message.textContent = text;
    message.className = type || "";

}


window.switchForm = function(){

    isRegister = !isRegister;

    document.getElementById("formTitle").textContent =
        isRegister
        ? "Create Organizer Account"
        : "Organizer Login";

    document.getElementById("registerFields")
        .classList.toggle("hidden", !isRegister);

    button.textContent =
        isRegister ? "Create Account" : "Login";

    document.getElementById("switchButton").textContent =
        isRegister
        ? "Already have an account? Login"
        : "Don't have an account? Register";

    document.getElementById("organizerPassword").value = "";

    showMessage("", "");

};


window.submitForm = async function(){

    const email = document
        .getElementById("organizerEmail")
        .value.trim()
        .toLowerCase();

    const password = document
        .getElementById("organizerPassword")
        .value;

    const name = document
        .getElementById("organizerName")
        .value.trim();

    const phone = document
        .getElementById("organizerPhone")
        .value.trim();


    if(!email || !password){

        showMessage("Please enter your email and password.", "error");
        return;

    }

    if(password.length < 8){

        showMessage("Password must contain at least 8 characters.", "error");
        return;

    }

    if(isRegister && (!name || !phone)){

        showMessage("Please enter your name and phone number.", "error");
        return;

    }


    button.disabled = true;

    button.textContent = "Please wait...";


    try{

        if(isRegister){

            // CREATE FIREBASE ACCOUNT

            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = result.user;


            // CREATE ORGANIZER PROFILE

            await setDoc(
                doc(db, "organizers", user.uid),
                {
                    uid: user.uid,
                    name: name,
                    email: email,
                    phone: phone,

                    role: "organizer",
                    status: "active",

                    purchasedCapacity: 0,
                    usedCapacity: 0,
                    remainingCapacity: 0,

                    createdAt: serverTimestamp()
                }
            );


            // SEND EMAIL VERIFICATION

            await sendEmailVerification(user);


            showMessage(
                "Account created successfully! Please check your email and verify your address before logging in.",
                "success"
            );


            await signOut(auth);


            isRegister = false;

            document.getElementById("formTitle").textContent =
                "Organizer Login";

            document.getElementById("registerFields")
                .classList.add("hidden");

            button.textContent = "Login";

            document.getElementById("switchButton").textContent =
                "Don't have an account? Register";

            document.getElementById("organizerPassword").value = "";


        }else{

            // ORGANIZER LOGIN

            const result = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = result.user;


            // REQUIRE EMAIL VERIFICATION

            if(!user.emailVerified){

                await signOut(auth);

                showMessage(
                    "Please verify your email first. Check your inbox or spam folder.",
                    "error"
                );

                return;

            }


            // CHECK ORGANIZER PROFILE

            const organizerDoc = await getDoc(
                doc(db, "organizers", user.uid)
            );


            if(!organizerDoc.exists()){

                await signOut(auth);

                showMessage(
                    "Organizer profile not found. Please contact support.",
                    "error"
                );

                return;

            }


            const organizer = organizerDoc.data();


            if(organizer.role !== "organizer"){

                await signOut(auth);

                showMessage(
                    "This account is not authorized as an Organizer.",
                    "error"
                );

                return;

            }


            if(organizer.status !== "active"){

                await signOut(auth);

                showMessage(
                    "Your Organizer account is not active.",
                    "error"
                );

                return;

            }


            showMessage(
                "Login successful. Opening your dashboard...",
                "success"
            );


            setTimeout(function(){

                window.location.href = "organizer-dashboard.html";

            }, 1000);

        }


    }catch(error){

        console.error("Organizer authentication error:", error);

        let errorMessage = error.message;

        if(error.code === "auth/email-already-in-use"){
            errorMessage = "This email already has an account. Please login.";
        }

        else if(error.code === "auth/invalid-email"){
            errorMessage = "Please enter a valid email address.";
        }

        else if(error.code === "auth/weak-password"){
            errorMessage = "Please choose a stronger password.";
        }

        else if(error.code === "auth/invalid-credential"){
            errorMessage = "Incorrect email or password.";
        }

        showMessage(
            "❌ " + errorMessage,
            "error"
        );

    }

    finally{

        button.disabled = false;

        button.textContent =
            isRegister ? "Create Account" : "Login";

    }

};
