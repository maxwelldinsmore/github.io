// INFT 2202 - Assignment 2
// Maxwell Dinsmore
// 100955317
// 2025-02-19


import { Volunteer } from "./volunteer.js";
import { Event } from "./event.js";
import { Router } from "./router.js";
import { AuthGuard } from "./authguard.js";
import { DisplayCreateEventPage } from "./pageSpecific/createEvent.js";
import { DisplayStatsPage } from "./pageSpecific/stats.js";
import { DisplayEventsPage } from "./pageSpecific/event-page.js";
import { ShowOpportunities } from "./pageSpecific/opportunity-page.js";
import { loadHeaderBar } from "./router.js";
import {DisplayNewsPage} from "./pageSpecific/news.js";
import {DisplayFeedbackPage} from "./pageSpecific/feedback.js";

//IIFE - Immediately Invoked Functional Expression
"use strict";
(function() {

    interface RouteMap {
        [path: string]: {
            title: string;
            handler: () => void;
            SPAUrl: string;
        }
    }

    //#region Helper Functions
    const routes: RouteMap = {
        "/": { title: "Volunteer Connect", handler: DisplayHomePage, SPAUrl: "views/pages/home.html" },
        "/home": { title: "Volunteer Connect", handler: DisplayHomePage, SPAUrl: "views/pages/home.html" },
        "/about": { title: "About", handler: DisplayAboutPage, SPAUrl: "views/pages/about.html" },
        "/contact-us": { title: "Contact Us", handler: DisplayContactPage, SPAUrl: "views/pages/contact-us.html" },
        "/donate": { title: "Donate", handler: DisplayDonatePage, SPAUrl: "views/pages/donate.html" },
        "/events": { title: "Events", handler: DisplayEventsPage, SPAUrl: "views/pages/events.html" },
        "/opportunities": { title: "Opportunities", handler: DisplayOpportunitiesPage, SPAUrl: "views/pages/opportunities.html" },
        "/tos": { title: "Terms of Service", handler: DisplayTermsPage, SPAUrl: "views/pages/tos.html" },
        "/privacyPolicy": { title: "Privacy Policy", handler: DisplayPrivacyPage, SPAUrl: "views/pages/privacyPolicy.html" },
        "/feedback": { title: "Feedback", handler: DisplayFeedbackPage, SPAUrl: "views/pages/feedback.html" },
        "/login-page": { title: "Login", handler: DisplayLoginPage, SPAUrl: "views/pages/login-page.html" },
        "/register": { title: "Become a volunteer!", handler: DisplayRegisterPage, SPAUrl: "views/pages/register.html" },
        "/news": { title: "News", handler: DisplayNewsPage, SPAUrl: "views/pages/news.html" },
        "/createEvent": { title: "Create Event", handler: DisplayCreateEventPage, SPAUrl: "views/pages/createEvent.html" },
        "/stats": { title: "Statistics", handler: DisplayStatsPage, SPAUrl: "views/pages/stats.html" },
        "/404": { title: "Page Not Found", handler: () => { }, SPAUrl: "views/pages/404.html" }
        
    };
    const router = new Router(routes);

    /**
     * Add Sample Data
     * 
     */
    function AddSampleData() {
        fetch('../sampleData.json')
            .then(response => response.json())
            .then(data => {
                // Load events into local storage
                for (const [key, value] of Object.entries(data.events)) {
                    // To prevent duplicate data
                    // if (localStorage.getItem(`event_${key}`)) {
                    //     console.log("[INFO] Event already exists in storage:", key);
                    //     continue;
                    // }

                    const event = new Event(
                        (value as any).eventName,
                        (value as any).eventDate,
                        (value as any).eventLocation,
                        (value as any).eventType,
                        (value as any).eventDescription,
                        (value as any).eventContact,
                        (value as any).volunteerPositions,
                        (value as any).volunteersSignedUp || []
                    );

                    const eventData = event.serialize();
                    if (eventData) {
                        localStorage.setItem(`event_${key}`, eventData);
                        console.log("[INFO] Added event to storage:", key);
                    }
                }

                // Load volunteers into local storage
                for (const [key, value] of Object.entries(data.volunteers)) {
                    if (localStorage.getItem(`volunteer_${key}`)) {
                        console.log("[INFO] Volunteer already exists in storage:", key);
                        continue;
                    }

                    const volunteer = new Volunteer(
                        (value as any).firstName,
                        (value as any).lastName,
                        (value as any).emailAddress,
                        (value as any).password,
                        (value as any).admin || false,
                        (value as any).websiteVisits || 0,
                        (value as any).eventsAttended || []
                    );

                    const volunteerData = volunteer.serialize();
                    if (volunteerData) {
                        localStorage.setItem(`volunteer_${key}`, volunteerData);
                        console.log("[INFO] Added volunteer to storage:", key);
                    }
                }
            })
            .catch(error => console.error('[ERROR] Failed to load sample data:', error));
    }

    
    function DisplayLoginPage() {
        console.log("Calling DisplayLoginPage()...");
        let keys = Object.keys(localStorage);
        
        let loginBtn = document.getElementById("loginBtn");
        if (!loginBtn) {
            console.error("[ERROR] Unable to find loginBtn");
            return;
        }
        loginBtn.addEventListener("click", function(event) {
            event.preventDefault();
            let email = document.getElementById("email") as HTMLInputElement;
    
            let password = document.getElementById("password")  as HTMLInputElement;
    
            for (const key of keys) {
                if (key.startsWith("volunteer_")) {
                    let volunteerData = localStorage.getItem(key);
                    console.log(volunteerData);
                    if (volunteerData) {
                        let volunteer = new Volunteer()
                        volunteer.deserialize(volunteerData);
    
                        if (volunteer.emailAddress === email.value && volunteer.password === password.value) {
                            const volunteerData = volunteer.serialize();
                            if (volunteerData) {
                                volunteer.websiteVisits++;
                                const updatedData = volunteer.serialize();
                                if (updatedData) {
                                    localStorage.setItem(key, updatedData);
                                }
                                sessionStorage.setItem("user", volunteerData);
                            } else {
                                console.error("[ERROR] Unable to serialize volunteer data");
                            }
                            router.loadRoute("/");
                            return;
                        }
                    }
                }
            }
            let loginError = document.getElementById("loginError");
            if (loginError) {
                loginError.style.display = "block";
                loginError.innerHTML = "Invalid email or password. Please try again.";
            }
    
        });
        let cancelBtn = document.getElementById("cancelBtn");
        if (!cancelBtn) {
            console.error("[ERROR] Unable to find cancelBtn");
            return;
        }
        cancelBtn.addEventListener("click", function(event) {
            event.preventDefault();
            router.loadRoute("/");
        });
    
    }
    

    function verifyLogin() {
        console.log("Checking whether user is logged in...");

        const loginNav = document.getElementById("loginButton") as HTMLAnchorElement;

        if(!loginNav) {
            console.warn("lognav element not found, skipping verifyLogin().");
            return;
        }
        const userSession = sessionStorage.getItem("user");
        if (!userSession) {
            return;
        }
        let user = new Volunteer();
        user.deserialize(userSession);
        if (userSession) {
            loginNav.innerHTML = `Hi ${user.firstName}, <i class="fa-solid fa-sign-out-alt"></i> Logout`;
            loginNav.href = "#";

            loginNav.addEventListener("click", (event: MouseEvent) => {
                event.preventDefault();
                sessionStorage.removeItem("user");
                router.loadRoute("/");
            });
        }
    }


    

    function AddVolunteer(volunteer: Volunteer) {
        
        if (volunteer.serialize()) {
            // key is primary key kind of for the contact
            let key = `volunteer_${Date.now()}`;
            const volunteerData = volunteer.serialize();
            if (volunteerData) {
                localStorage.setItem(key, volunteerData);
            }
        } else {
            console.error("[ERROR]Volunteer serialization failed");
        }
    }
//#endregion


//#region Page Specific Functions

    /**
     * Displays home Page and sign up button link
     */
    function DisplayHomePage() {
     
        console.log("Calling DisplayHomePage()...");

        let SignUpBtn = document.getElementById("SignUpBtn");
        if (!SignUpBtn) {
            console.error("[ERROR] Unable to find SignUpBtn");
            return;
        }
        SignUpBtn.addEventListener("click", function() {
            router.loadRoute("opportunities");
        });
    }

    /*
    * When about page is displayed this function is called
    */
    function DisplayAboutPage() {
        console.log("Calling DisplayAboutPage()...");
    }

    /*
    * When contact button is clicked after the form is filled out,
    * a modal confirming the submission will appear
    */
    function DisplayContactPage() {
        console.log("Calling DisplayContactPage()...");

        let ContactForm = document.getElementById("ContactForm");
        if (!ContactForm) {
            console.error("[ERROR] Unable to find ContactForm");
            return;
        }
        // Prevents form from submitting
        ContactForm.addEventListener("submit", function(event) {
            event.preventDefault();
        });

        const ConfirmationModal = document.getElementById('ConfirmationModal')

        if (!ConfirmationModal) {
            console.error("[ERROR] Unable to find ConfirmationModal");
            return;
        }

        let ContactBtn = document.getElementById("ContactBtn");
        console.log("Calling DisplayContactPage()...");
        let ConfirmBtn = document.getElementById("ConfirmBtn");

        if (!ContactBtn || !ConfirmBtn) {
            console.error("[ERROR] Contact or Confirm button not found");
            return;
        }
        ContactBtn.addEventListener("click", function() {
            if ((document.getElementById("name") as HTMLInputElement).value != "" 
            && (document.getElementById("email") as HTMLInputElement).value != "" 
            && (document.getElementById("subject") as HTMLInputElement).value != "") {
                ConfirmationModal.style.display = "block";
            } 
        });

        // Redirected after confirm button is clicked on contact form    
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
                router.loadRoute("/");
            }, 5000);
        });
        // Hides Modal
        let CancelBtn = document.getElementById("CancelBtn");
        if (!CancelBtn) {
            console.error("[ERROR] Unable to find CancelBtn");
            return;
        }
        CancelBtn.addEventListener("click", function() {
            ConfirmationModal.style.display = "none";

        });
        // Hides Modal
        let CloseBtn = document.getElementById("CloseBtn");
        if (!CloseBtn) {
            console.error("[ERROR] Unable to find CloseBtn");
            return;
        }
        CloseBtn.addEventListener("click", function() {
            ConfirmationModal.style.display = "none";
        });
    
    }
    
    /*
    *   When Donate Page is loaded this function is called
    */
    function DisplayDonatePage() {
        console.log("Calling DisplayDonatePage()...");
    }



    /*
    * Moved to its own file due to length of code
    */
    function DisplayOpportunitiesPage() {
        console.log("Calling DisplayOpportunitiesPage()...");
        ShowOpportunities();
    }

    /* 
    * When TOS page is loaded this is called
    */
    function DisplayTermsPage() {
        console.log("Calling DisplayTermsPage()...");
    }

    /*
    * When Privacy Policy page is loaded this is called
    */
    function DisplayPrivacyPage() {
        console.log("Calling DisplayPrivacyPage()...");
    }


    function DisplayRegisterPage() {
        console.log("Calling DisplayRegisterPage()...");
        const registerBtn = document.getElementById('submitButton');
        if (!registerBtn) {
            console.error("[ERROR] Unable to find registerBtn");
            return;
        }
        registerBtn.addEventListener('click', function(event) {
            event.preventDefault();
            const firstName = (document.getElementById('firstName') as HTMLInputElement)?.value;
            const lastName = (document.getElementById('lastName') as HTMLInputElement)?.value;
            const email = (document.getElementById('emailAddress') as HTMLInputElement)?.value;
            const password = (document.getElementById('password') as HTMLInputElement)?.value;
            const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement)?.value;
            console.log(firstName, lastName, email, password, confirmPassword);
            if (firstName && lastName && email && password) {
                if (password === confirmPassword) {
                    console.log('Passwords match');
                    AddVolunteer(new Volunteer(firstName, lastName, email, password));
                    router.loadRoute("/");                   
                } else {
                    console.error('Passwords do not match. Please try again.');
                }
            } else {
                console.error('Please fill out all fields.');
            }
        });
    }

  

//#endregion

    document.addEventListener("routeLoaded", (event) => {
        const newPath = (event as CustomEvent).detail;
        console.log("[INFO] Route Loaded: ", newPath);

        handlePageLogic(newPath);

    });

    document.addEventListener("sessionExpired", () => {
        console.warn("[SESSION] Session has expired.");
        router.navigate("/login");
    });

    function handlePageLogic(path: string) {
        
        document.title = routes[path].title || "Untitled Page";
        console.log(` Current page title: ${document.title}`);
        const protectedRoutes = [
            "/createEvent",
            "/stats"
        ];
        if (protectedRoutes.includes(path)) {
            AuthGuard();
        }

        const pageFunction = routes[path].handler;
        if (pageFunction && typeof pageFunction === 'function') {
            pageFunction();  // Call the corresponding function
        } else {
            console.error("No matching title found or the matched item is not a function");
        }
    }

    /*
    * When this program is loaded Start is called and does js setup
    * For the website pages
    */
    async function Start() {
        console.log("Starting...");
        // Footer
        let body = document.body;
        body.innerHTML += `
        <footer class="footer">
            <hr>
            <div>
                <div class="col text-center ">
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
                // lead navbar
        await loadHeaderBar().then( () => {
            verifyLogin();

        });
        
        // Adding nav link to donate page dynamically
        let NavList = document.getElementById("navbarNavDropdown");
        let DonateNavItem = document.createElement("li");

        DonateNavItem.setAttribute("class", "nav-item");
        DonateNavItem.innerHTML = ``;
        // So it doesnt appear after the dropdown which i want at the end
        if (NavList) {
            NavList.insertBefore(DonateNavItem, NavList.lastElementChild);
        }
        
        const currentPath = location.hash.slice(1) || "/";
        router.loadRoute(currentPath);


        AddSampleData();

    }window.addEventListener("load", Start);
})()
// Last two brackets makes the function immediately call itself

