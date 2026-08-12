Event Ticketing App

About

Event Ticketing App is a simple web application designed to make event booking and ticket verification easier for local events.

Users can view available events, enter their details, select an event, and make a booking. The system generates ticket information and a QR code that can be used for ticket verification and check-in.

Bookings are stored securely in Firebase Firestore and can be managed through the Admin Dashboard.

Problem Context

Many local events still rely on manual registration and paper-based ticketing. This can make it difficult to manage bookings, verify tickets, and track attendance.

This project provides a simple digital solution for event booking, ticket generation, QR verification, and event management.

Core Features

User Features

- View available events
- Select an event
- Enter booking details
- Submit an online booking
- Receive ticket/booking information
- Generate QR code for ticket verification

Ticket Verification

- Verify tickets using Ticket ID
- Verify tickets using QR Code
- Check ticket status
- Check attendees in
- Prevent already checked-in tickets from being checked in again

Admin Dashboard

- Protected admin login
- Total bookings statistics
- Total tickets statistics
- Checked-in and not checked-in statistics
- Event-based booking statistics
- View people who booked each event
- Search bookings
- View booking details
- Export bookings to CSV
- Manage events
- Refresh dashboard
- Logout

Technologies Used

- HTML5
- CSS3
- JavaScript
- Firebase Firestore
- QR Code technology
- GitHub
- GitHub Pages

Project Structure

- "index.html" — Main event booking page
- "firebase-config.js" — Firebase configuration
- "script.js" — Booking and Firebase functionality
- "dashboard.html" — Admin dashboard
- "verify.html" — Ticket verification and QR scanner
- "style.css" — Application styling
- "login.html" — Admin login page
- "login.js" — Dashboard login functionality
- "README.md" — Project documentation

How It Works

1. A user opens the Event Ticketing App.
2. The user selects an available event.
3. The user enters the required booking information.
4. The booking is saved to Firebase Firestore.
5. Ticket information and a QR code are generated.
6. An administrator can verify the ticket using the Ticket ID or QR Code.
7. After successful verification, the attendee can be checked in.
8. The Admin Dashboard displays booking and attendance statistics.

Admin Dashboard

The Admin Dashboard provides tools for managing and monitoring event bookings.

It includes:

- Booking statistics
- Event statistics
- Ticket verification
- Check-in tracking
- Booking search
- CSV export
- Event management

The dashboard is protected by an admin login system.

Database

The application uses Firebase Firestore to store booking information.

The database allows the application to retrieve and display bookings in the Admin Dashboard and update ticket/check-in information.

Deployment

The project is deployed using GitHub Pages.

Deployed application:

https://rabilupau.github.io/event-ticketing-app/

Future Improvements

Possible future improvements include:

- Firebase Authentication for stronger admin security
- Online payment integration
- Email ticket delivery
- SMS notifications
- Multiple admin accounts
- More advanced event management
- Improved ticket design
- Production-ready security rules

Capstone Project

Event Ticketing App

Developed as a capstone project to provide a simple digital ticketing solution for local events.

Project Goal

The goal of this project is to simplify event registration, ticket management, QR-based ticket verification, and attendee check-in through a single web application.
