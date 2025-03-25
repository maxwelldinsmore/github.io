import { Event } from "./event.js";
import { Volunteer } from "./volunteer.js";
export async function ShowOpportunities() {
    let keys = Object.keys(localStorage);
    let volunteer = null;
    if (sessionStorage.getItem("user")) {
        volunteer = new Volunteer();
        const userData = sessionStorage.getItem("user");
        if (userData) {
            volunteer.deserialize(userData);
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
                const Opportunity = document.createElement('div');
                Opportunity.className = 'col-md-4 mb-4';
                const buttonId = `joinEventBtn_${key}`; // Create unique button ID
                Opportunity.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${event.eventName}</h5>
                            <p class="card-text">${event.eventDescription}</p>
                            <p class="card-text">${event.AmountOfAvailablePositions()} positions left!</p>
                            <p class="card-text"><small class="text-muted">${event.eventDate}</small></p>
                            <button class="btn btn-primary" id="${buttonId}">Join Us</button>
                        </div>
                    </div>
                `;
                opportunitiesList.appendChild(Opportunity);
                let joinEventBtn = Opportunity.querySelector(`#${buttonId}`);
                if (volunteer && joinEventBtn) {
                    if (event.CheckIfSignedUp(volunteer.emailAddress)) {
                        joinEventBtn.textContent = "Joined";
                        joinEventBtn.disabled = true;
                        joinEventBtn.classList.remove('btn-primary');
                        joinEventBtn.classList.add('btn-success');
                    }
                    else {
                        joinEventBtn.addEventListener('click', function () {
                            event.volunteersSignedUp.push(volunteer);
                            const eventData = event.serialize();
                            if (eventData) {
                                localStorage.setItem(key, eventData);
                            }
                            else {
                                console.error("[ERROR] Unable to serialize event and add it to storage");
                            }
                            joinEventBtn.textContent = "Joined";
                            joinEventBtn.disabled = true;
                            joinEventBtn.classList.remove('btn-primary');
                            joinEventBtn.classList.add('btn-success');
                        });
                    }
                }
                else {
                    // TODO: Fix
                    // joinEventBtn.addEventListener('click', function() {
                    //     location.href = "login-page.html";
                    // });
                }
            }
        }
    }
}
