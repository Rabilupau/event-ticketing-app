const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event) {
event.preventDefault();

const username = document.getElementById("username").value.trim();
const password = document.getElementById("password").value;

// Dashboard login details
const correctUsername = "Rabilupau";
const correctPassword = "Rabilu@123";

if (username === correctUsername && password === correctPassword) {
    localStorage.setItem("dashboardLoggedIn", "true");

    window.location.href = "dashboard.html";
} else {
    document.getElementById("error").textContent =
        "Incorrect username or password.";
}

});
