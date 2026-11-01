import { auth, db } from "./firebase-config.js";

import {
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const loginForm = document.getElementById("loginForm");
const errorBox = document.getElementById("error");
const loginButton = document.getElementById("loginButton");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    errorBox.textContent = "";
    loginButton.disabled = true;
    loginButton.textContent = "Checking...";

    try {
        const result = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = result.user;

        const adminRef = doc(db, "admins", user.uid);
        const adminSnap = await getDoc(adminRef);

        if (!adminSnap.exists() || adminSnap.data().role !== "admin") {
            await signOut(auth);
            throw new Error("You are not authorized as an administrator.");
        }

        window.location.href = "dashboard.html";

    } catch (error) {
        console.error("Login error:", error);

        errorBox.textContent =
            error.message || "Login failed. Please try again.";

        loginButton.disabled = false;
        loginButton.textContent = "Login";
    }
});
