import { Event } from "../event.js";
import { Volunteer } from "../volunteer.js";

export async function ShowOpportunities() {
    let keys = Object.keys(localStorage);
    let volunteerEmail: string | null = null;
    
    if (sessionStorage.getItem("user")) {
        const volunteer = new Volunteer();
        const userData = sessionStorage.getItem("user");
        if (userData) {
            volunteer.deserialize(userData);
            volunteerEmail = volunteer.emailAddress;
        }
    }

    const opportunitiesList = document.getElementById('OpportunitiesList');
    if (!opportunitiesList) {
        console.error("[ERROR] Unable to find OpportunitiesList");
        return;
    }

    for (const key of keys) {
        if (key.startsWith("event_")) {
            let eventData = localStorage.getItem(key);
            let event = new Event();
            if (eventData) {
                event.deserialize(eventData);
            }

            if (event.eventType === "Cleanup") {
                const getUser = sessionStorage.getItem("user");
                const user = new Volunteer();
                if (getUser) {
                    user.deserialize(getUser);
                }
                let adminAccess = user.adminStatus;
                console.log("users admin status" + adminAccess);
                const Opportunity = document.createElement('div');
                Opportunity.className = 'col-md-4 mb-4';
                const buttonId = `joinEventBtn_${key}`;
                let volunteerList = '';
                if (adminAccess) {
                    volunteerList = event.volunteersSignedUp.length > 0 
                    ? `<div class="mt-2">
                        <h6>Signed Up Volunteers:</h6>
                        <ul class="list-group">
                            ${event.volunteersSignedUp.map(email => 
                                `<li class="list-group-item small">${email}</li>`
                            ).join('')}
                        </ul>
                       </div>`
                    : '<p class="text-muted small mt-2">No volunteers signed up yet</p>';
                } 
                Opportunity.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${event.eventName}</h5>
                        <p class="card-text">${event.eventDescription}</p>
                        <p class="card-text">${event.AmountOfAvailablePositions()} positions left!</p>
                        <p class="card-text"><small class="text-muted">${event.eventDate}</small></p>
                        <button class="btn btn-primary" id="${buttonId}">Join Us</button>
                        ${volunteerList}
                    </div>
                </div>
            `;
                
                opportunitiesList.appendChild(Opportunity);
                let joinEventBtn = Opportunity.querySelector(`#${buttonId}`) as HTMLButtonElement;
                
                if (volunteerEmail && joinEventBtn) {
                    if (event.CheckIfSignedUp(volunteerEmail)) {
                        joinEventBtn.textContent = "Joined";
                        joinEventBtn.disabled = true;
                        joinEventBtn.classList.remove('btn-primary');
                        joinEventBtn.classList.add('btn-success');
                    } else {
                        joinEventBtn.addEventListener('click', function() {
                            event.addVolunteer(volunteerEmail);
                            const eventData = event.serialize();
                            if (eventData) {
                                localStorage.setItem(key, eventData);
                            } else {
                                console.error("[ERROR] Unable to serialize event and add it to storage");
                            }
                            joinEventBtn.textContent = "Joined";
                            joinEventBtn.disabled = true;
                            joinEventBtn.classList.remove('btn-primary');
                            joinEventBtn.classList.add('btn-success');
                        });
                    }
                } else {
                    joinEventBtn.addEventListener('click', function() {
                        location.hash = "#/login-page";
                    });
                }
            }
        }
    }
}
