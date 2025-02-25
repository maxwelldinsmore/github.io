(function() {

    async function ShowOpportunities() {

        let keys = Object.keys(localStorage);
        let volunteer = null;
        if (sessionStorage.getItem("user")) {
            volunteer = new Volunteer();
            volunteer.deserialize(sessionStorage.getItem("user"));
        }

        const opportunitiesList = document.getElementById('OpportunitiesList');
        for (const key of keys) {
            if (key.startsWith("event_")) {
                let eventData = localStorage.getItem(key);
                let event = new Event();
                console.log(eventData);
                event.deserialize(eventData);
                console.log(event);
                if (event.eventType === "Cleanup" ) {
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

                    if (volunteer) {
                        if (event.volunteersSignedUp.includes(volunteer.emailAddress)) {
                            joinEventBtn.textContent = "Joined";
                            joinEventBtn.disabled = true;
                            joinEventBtn.classList.remove('btn-primary');
                            joinEventBtn.classList.add('btn-success');
                        } else {
                            joinEventBtn.addEventListener('click', function() {
                                event.volunteersSignedUp.push(volunteer.emailAddress);
                                localStorage.setItem(key, event.serialize());
                                joinEventBtn.textContent = "Joined";
                                joinEventBtn.disabled = true;
                                joinEventBtn.classList.remove('btn-primary');
                                joinEventBtn.classList.add('btn-success');
                            });
                        }
                    } else {
                        joinEventBtn.addEventListener('click', function() {
                            location.href = "login-page.html";
                        });
                    }
                }
            }
        }
    }

    /*
    * Updates opportunities page with upcoming opportunities
    * and a modal tied to the sign up button for each opportunities
    */
    function DisplayOpportunitiesPage() {
        console.log("Calling DisplayOpportunitiesPage()...");

        ShowOpportunities();
    }

    async function Start() {
        DisplayOpportunitiesPage(); 
    }
    
    window.addEventListener("load", Start);
}());