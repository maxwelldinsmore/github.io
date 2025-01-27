// INFT 2202 - Assignment 1
// Maxwell Dinsmore
// 100955317
// 2025-01-26

//IIFE - Immediately Invoked Functional Expression
"use strict";
(function() {

    // Displays home Page and sign up button link
    function DisplayHomePage() {
     
        console.log("Calling DisplayHomePage()...");

        let SignUpBtn = document.getElementById("SignUpBtn");
            SignUpBtn.addEventListener("click", function() {
            location.href="opportunities.html";
        });
    }
    // When About Page is loaded calls this function to update nav bar and highlight about icon
    function DisplayAboutPage() {
        console.log("Calling DisplayAboutPage()...");

        // Updates nav bar to show current page
        let AboutNav = document.getElementById("AboutNav");
        AboutNav.setAttribute("class", "nav-link active");
        AboutNav.setAttribute("aria-current", "page");
    }

    // When contact button is clicked after the form is filled out,
    // a modal confirming the submission will appear
    function DisplayContactPage() {
        
        // Updates nav bar to show current page
        let ContactNav = document.getElementById("ContactNav");
        ContactNav.setAttribute("class", "nav-link active");
        ContactNav.setAttribute("aria-current", "page");

        const ConfirmationModal = document.getElementById('ConfirmationModal')

        console.log("Calling DisplayContactPage()...");
        let ContactBtn = document.getElementById("ContactBtn");
        ContactBtn.addEventListener("click", function() {
            ConfirmationModal.style.display = "block";
        });

        // Redirected after confirm button is clicked on contact form
        let ConfirmBtn = document.getElementById("ConfirmBtn");
        ConfirmBtn.preventDefault();
        ConfirmBtn.addEventListener("click", function() {
            // Display "Thank You" message for 5 seconds before redirecting to Home Page
            const ThankYouMessage = document.createElement('div');
            ThankYouMessage.setAttribute('id', 'ThankYouMessage');
            ThankYouMessage.setAttribute('class', 'alert alert-success');
            ThankYouMessage.textContent = "Thank you for contacting us! Redirecting to Home Page...";
            document.body.appendChild(ThankYouMessage);
            ConfirmationModal.style.display = "none";
            setTimeout(function() {
                ThankYouMessage.style.display = 'none';
                location.href = "index.html";
            }, 5000);
        });
        // Hides Modal
        let CancelBtn = document.getElementById("CancelBtn");
        CancelBtn.addEventListener("click", function() {
            ConfirmationModal.style.display = "none";

        });
        // Hides Modal
        let CloseBtn = document.getElementById("CloseBtn");
        CloseBtn.addEventListener("click", function() {
            ConfirmationModal.style.display = "none";
        });
    
    }
    
    
    // When Donate Page is loaded calls this function to update nav bar and highlight Donate icon
    function DisplayDonatePage() {
        console.log("Calling DisplayDonatePage()...");

        // Updates nav bar to show current page
        let DonateNav = document.getElementById("DonateNav");
        DonateNav.setAttribute("class", "nav-link active");
        DonateNav.setAttribute("aria-current", "page");

    }

    // When Events Page is loaded calls this function to update nav bar and highlight about events
    function DisplayEventsPage() {
        console.log("Calling DisplayEventsPage()...");

        // Checkboxes for filtering events
        let CheckBoxFundraisers = document.getElementById("CheckBoxFundraisers");
            // Array of Upcoming Events
    let UpcomingEvents = [ 
        ["0", "1", "Bake Sale", "2025-01-10", "Bake Sale to raise money for the local animal shelter."],
        ["2", "1", "Car Wash", "2025-01-01","Car Wash to raise money for the local animal shelter."],
        ["1", "1", "Building a Community WorkShop", "2025-01-23", "Building a Community WorkShop to raise money for the local animal shelter."],
        ["2", "1", "Post Parade Cleaning", "2025-01-25", "Cleaning up downtown after the parade."],
    ];

        // Events Listeners for checkboxes adds to filtered events array if seen
        // if unchecked removes from array
        CheckBoxFundraisers.addEventListener("change", function() {
            if (CheckBoxFundraisers.checked) {
                for (let i = 0; i < UpcomingEvents.length; i++) {
                    if (UpcomingEvents[i][0] == "0") {
                        UpcomingEvents[i][1] = "1";
                    }
                }
            } else {
                for (let i = 0; i < UpcomingEvents.length; i++) {
                    if (UpcomingEvents[i][0] == "0") {
                        UpcomingEvents[i][1] = "0";
                        console.log(UpcomingEvents[i][1]);
                    }
                }
            }
            DisplayUpcomingEvents(UpcomingEvents)
        }); // Same but Different
        let CheckBoxWorkshops = document.getElementById("CheckBoxWorkshops");
        CheckBoxWorkshops.addEventListener("change", function() {
            if (CheckBoxWorkshops.checked) {
                for (let i = 0; i < UpcomingEvents.length; i++) {
                    if (UpcomingEvents[i][0] == "1") {
                        UpcomingEvents[i][1] = "1";
                    }
                }
            } else {
                for (let i = 0; i < UpcomingEvents.length; i++) {
                    if (UpcomingEvents[i][0] == "1") {
                        UpcomingEvents[i][1] = "0";
                    }
                }
            }
            DisplayUpcomingEvents(UpcomingEvents)
        }); // Same but Different
        let CheckBoxCleanups = document.getElementById("CheckBoxCleanups");
        CheckBoxCleanups.addEventListener("change", function() {
            if (CheckBoxCleanups.checked) {
                for (let i = 0; i < UpcomingEvents.length; i++) {
                    if (UpcomingEvents[i][0] == "2") {
                        UpcomingEvents[i][1] = "1";
                    }
                }
            } else {
                for (let i = 0; i < UpcomingEvents.length; i++) {
                    if (UpcomingEvents[i][0] == "2") {
                        UpcomingEvents[i][1] = "0";
                    }
                }
            }
            DisplayUpcomingEvents(UpcomingEvents)
        });

        // Updates nav bar to show current page
        let EventsNav = document.getElementById("EventsNav");
        EventsNav.setAttribute("class", "nav-link active");
        EventsNav.setAttribute("aria-current", "page");

        // Calendar Functionality added
        let MonthInformation = document.getElementById("MonthInformation");
        MonthInformation.innerHTML = moment().format('MMMM') + 
        `<br><span style="font-size:18px">`+ moment().format('YYYY');
        let StartOfMonth = moment().startOf('month').format('d');
        let DaysInMonth = moment().daysInMonth();
        
        let CalendarDays = document.getElementById("CalendarDay"); // Add days of month to calendar
        for (let i = 0; i <= DaysInMonth; i++) {
                let li = document.createElement("li");
            if (i >= StartOfMonth) {
                li.textContent = i;
            } else {
                li.textContent = ``;
            }
            CalendarDays.appendChild(li);

        }
        DisplayUpcomingEvents(UpcomingEvents);
    }

    // Displays Upcoming events on the events page based on the filters
    function DisplayUpcomingEvents(UpcomingEvents) {
        let EventList = document.getElementById("EventList");
        EventList.innerHTML = "";
        for (let i = 0; i < UpcomingEvents.length; i++) {
            if (UpcomingEvents[i][1] == "1") {
            EventList.innerHTML += `
            <div class="card mt-3">
                <div class="card-body">
                    <h5 class="card-title">${UpcomingEvents[i][2]}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${UpcomingEvents[i][3]}</h6>
                    <p class="card-text">${UpcomingEvents[i][4]}</p>
                </div>
            </div>
            `;
            }
        }
    }

    // When About Opportunities is loaded calls this function to update nav bar and highlight about icon
    function DisplayOpportunitiesPage() {
        console.log("Calling DisplayOpportunitiesPage()...");

        // Updates nav bar to show current page
        let OpportunitiesNav = document.getElementById("OpportunitiesNav");
        OpportunitiesNav.setAttribute("class", "nav-link active");
        OpportunitiesNav.setAttribute("aria-current", "page");

        // Array of Upcoming Opportunities
        const opportunities = [
            ["Parade Cleanup", "Help clean up the local beach.", "2025-02-01 10:00 AM"],
            ["Bake Sale", "Assist in running a bake sale for the homeless.", "2025-02-05 09:00 AM"],
            ["Tree Planting", "Join us in planting trees in the community park.", "2025-01-10 08:00 AM"]
          ];
        
        const opportunitiesList = document.getElementById('OpportunitiesList');
    
        for (let i = 0; i < opportunities.length; i++) {
        const Opportunity = document.createElement('div');
        Opportunity.className = 'col-md-4 mb-4';
        Opportunity.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${opportunities[i][0]}</h5>
                    <p class="card-text">${opportunities[i][1]}</p>
                    <p class="card-text"><small class="text-muted">${opportunities[i][2]}</small></p>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#SignUpModal">Sign Up</button>
                </div>
            </div>
        `;
        opportunitiesList.appendChild(Opportunity);
        }

        const SignUpForm = document.getElementById('SignUpForm');
        const confirmationMessage = document.getElementById('ConfirmationMessage');
        SignUpForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const role = document.getElementById('role').value;
        
            if (name && email && role) {
            confirmationMessage.style.display = 'block';
            SignUpForm.reset();
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('SignUpModal'));
                modal.style.display = "none";
            }, 2000);
            }
        });
    }

    // When TOS page is loaded this is called
    function DisplayTermsPage() {
        console.log("Calling DisplayTermsPage()...");
    }

    // When Privacy Policy page is loaded this is called
    function DisplayPrivacyPage() {
        console.log("Calling DisplayPrivacyPage()...");
    }

    // When Program Starts and runs this script this function is called
    function Start() {
        console.log("Starting...");

        // Adding nav link to donate page dynamically
        let NavList = document.getElementById("navbarNavDropdown");
        let DonateNavItem = document.createElement("li");
        DonateNavItem.setAttribute("class", "nav-item");
        DonateNavItem.innerHTML = `<a class="nav-link" href="donate.html" id="DonateNav">Donate</a>`;
        // So it doesnt appear after the dropdown which i want at the end
        NavList.insertBefore(DonateNavItem, NavList.lastElementChild);

        // Footer
        let body = document.body;
        body.innerHTML += `
        <footer>
            <hr>
            <div>
                <div class="col text-center">
                    <a href="privacyPolicy.html">Privacy Policy</a> | 
                    <a href="tos.html">Terms of Service</a>
                </div>
            </div>
        </footer>`

        // Goes to top of the screen
        // Based on this https://www.w3schools.com/howto/howto_js_scroll_to_top.asp
        let GoToTopBtn = document.createElement("button");
        GoToTopBtn.setAttribute("id", "GoToTopBtn");
        GoToTopBtn.setAttribute("class", "btn btn-secondary");
        GoToTopBtn.textContent = "Go to Top";
        GoToTopBtn.style.position = "fixed";
        GoToTopBtn.style.bottom = "20px";
        GoToTopBtn.style.right = "30px";
        GoToTopBtn.style.display = "none";
        document.body.appendChild(GoToTopBtn);

        // Checks if user is at bottom of screen is so displays button else hides it
        window.addEventListener("scroll", function() {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                GoToTopBtn.style.display = "block";
            } else {
                GoToTopBtn.style.display = "none";
            }
        });
        // Goes to top of screen
        GoToTopBtn.addEventListener("click", function() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        });


        // Like done is class runs the function of specific page when loaded
        switch(document.title) {
            case "Volunteer Connect": 
                DisplayHomePage();
                break;
            case "About":
                DisplayAboutPage();
                break;
            case "Contact Us":
                DisplayContactPage();
                break;
            case "Donate":
                DisplayDonatePage();
                break;
            case "Events":
                DisplayEventsPage();
                break;
            case "Opportunities":
                DisplayOpportunitiesPage();
                break;
            case "Terms of Service":
                DisplayTermsPage();
                break;
            case "Privacy Policy":
                DisplayPrivacyPage();
                break;
            case "Donate":
                DisplayDonatePage();
                break;   
        }



    }window.addEventListener("load", Start);
})()
// Last two brackets makes the function immediately call itself

