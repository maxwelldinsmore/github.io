import { Event } from "../event.js";
export function DisplayCreateEventPage() {
    // Check if user is logged in and is admin
    const userData = sessionStorage.getItem("user");
    if (!userData) {
        console.warn("[WARN] User not logged in");
        location.hash = "#/login-page";
        return;
    }
    const form = document.getElementById('createEventForm');
    if (!form) {
        console.error("[ERROR] Create event form not found");
        return;
    }
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        // Get form values
        const eventName = document.getElementById('eventName').value;
        const eventDate = document.getElementById('eventDate').value;
        const eventType = document.getElementById('eventType').value;
        const eventLocation = document.getElementById('eventLocation').value;
        const eventDescription = document.getElementById('eventDescription').value;
        const eventContact = document.getElementById('eventContact').value;
        const volunteerPositions = parseInt(document.getElementById('volunteerPositions').value);
        // Create new event
        const newEvent = new Event(eventName, eventDate, eventLocation, eventType, eventDescription, eventContact, volunteerPositions);
        // Generate unique key for the event
        const timestamp = new Date().getTime();
        const eventKey = `event_${timestamp}`;
        // Serialize and save to localStorage
        const eventData = newEvent.serialize();
        if (eventData) {
            localStorage.setItem(eventKey, eventData);
            console.log("[INFO] Event created successfully:", eventKey);
            // Show success message
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-success mt-3';
            alertDiv.role = 'alert';
            alertDiv.textContent = 'Event created successfully!';
            form.appendChild(alertDiv);
            // Reset form
            form.reset();
            // Remove success message after 3 seconds
            setTimeout(() => {
                alertDiv.remove();
                // Redirect to events page
                location.hash = "#/events";
            }, 3000);
        }
        else {
            console.error("[ERROR] Failed to serialize event");
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-danger mt-3';
            alertDiv.role = 'alert';
            alertDiv.textContent = 'Failed to create event. Please try again.';
            form.appendChild(alertDiv);
        }
    });
    // Add date input validation
    const dateInput = document.getElementById('eventDate');
    if (dateInput) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
}
