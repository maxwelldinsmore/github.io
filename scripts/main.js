// INFT 2202 - Assignment 2
// Maxwell Dinsmore
// 100955317
// 2025-02-19

//IIFE - Immediately Invoked Functional Expression
"use strict";
(function() {

//#region Helper Functions



    /**
     * Add Sample Data
     * 
     */
    function AddSampleData() {
            fetch('./sampleData.json')
        .then(response => response.json())
        .then(data => {
            // Load events into local storage
            for (const [key, value] of Object.entries(data.events)) {
                if (localStorage.getItem(`event_${key}`)) {
                    console.log("SampleData already loaded.");
                    return;
                }
                const csvValue = Object.values(value).join(',');
                localStorage.setItem(`event_${key}`, csvValue);
                
            }

            // Load volunteers into local storage
            for (const [key, value] of Object.entries(data.volunteers)) {
                const csvValue = Object.values(value).join(',');
                localStorage.setItem(`volunteer_${key}`, csvValue);
            }
        })
    }

   /**
   * Dynamically loads the header bar from the header.html file
   */
    async function loadHeaderBar() {
        return fetch("./tools/header.html")
            .then(response => response.text())
            .then(data => {
                document.querySelector('header').innerHTML = data;
                updateActiveLink();
            })
            .catch(error => {console.error("Unable to load header.", error)});
    }

    function verifyLogin() {
        console.log("Checking whether user is logged in...");

        const loginNav = document.getElementById("loginButton");

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

            loginNav.addEventListener("click", (event) => {
                event.preventDefault();
                sessionStorage.removeItem("user");
                location.href = "login-page.html";
            });
        }
    }

    /**
     * Updates the active link with the active class
    */
    function updateActiveLink() {
        const currentPage = document.title.trim();
        const navLinks = document.querySelectorAll('nav a');

        navLinks.forEach((link) => {
            if (link.textContent === currentPage) {
                link.classList.add('active');
                link.setAttribute("aria-current", "page");
            } else {
                link.classList.remove('active');
                link.removeAttribute("aria-current");
            }
        });
    }
    

    function AddVolunteer(volunteer) {
        
        if (volunteer.serialize()) {
            // key is primary key kind of for the contact
            let key = `volunteer_${Date.now()}`;
            localStorage.setItem(key, volunteer.serialize());
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
            SignUpBtn.addEventListener("click", function() {
            location.href="opportunities.html";
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
        // Prevents form from submitting
        ContactForm.addEventListener("submit", function(event) {
            event.preventDefault();
        });

        const ConfirmationModal = document.getElementById('ConfirmationModal')

        let ContactBtn = document.getElementById("ContactBtn");
        console.log("Calling DisplayContactPage()...");
        let ConfirmBtn = document.getElementById("ConfirmBtn");
        ContactBtn.addEventListener("click", function() {
            if (document.getElementById("name").value != "" && document.getElementById("email").value != "" && document.getElementById("subject").value != "") {
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
    
    /*
    *   When Donate Page is loaded this function is called
    */
    function DisplayDonatePage() {
        console.log("Calling DisplayDonatePage()...");
    }

    /*
    * moved content to event-page.js due to length of code
    */
    function DisplayEventsPage() {
        console.log("Calling DisplayEventsPage()...");
    }

    /*
    * Moved to its own file due to length of code
    */
    function DisplayOpportunitiesPage() {
        console.log("Calling DisplayOpportunitiesPage()...");
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

    /*
    * When Feedback page is loaded this function is called
    */
    function DisplayFeedbackPage() {
        console.log("Calling DisplayFeedbackPage()...");

        let FeedbackForm = document.getElementById("FeedbackForm");
        const ConfirmationModal = document.getElementById('ConfirmationModal');

        // Prevents form from submitting normally
        FeedbackForm.addEventListener("submit", function(event) {
            event.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                subject: document.getElementById("subject").value,
                message: document.getElementById("message").value
            };

            new Promise((resolve) => {
                resolve(formData) // Simulate network delay
            })
            .then(data => {
                // Update modal content with submitted data
                document.querySelector(".modal-title").textContent = "Confirm Your Submission";
                document.querySelector(".modal-body").innerHTML = `
                    <p><strong>Name:</strong> ${data.name}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Subject:</strong> ${data.subject}</p>
                    <p><strong>Message:</strong> ${data.message}</p>
                    <p>Are you sure you want to submit this feedback?</p>
                `;
                
                // Show the modal
                ConfirmationModal.style.display = "block";
            });
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

    function DisplayRegisterPage() {
        console.log("Calling DisplayRegisterPage()...");
        const registerBtn = document.getElementById('submitButton');
        registerBtn.addEventListener('click', function(event) {
            event.preventDefault();
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('emailAddress').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            console.log(firstName, lastName, email, password, confirmPassword);
            if (firstName && lastName && email && password) {
                if (password === confirmPassword) {
                    console.log('Passwords match');
                    AddVolunteer(new Volunteer(firstName, lastName, email, password));
                    location.href = "index.html";                   
                } else {
                    console.error('Passwords do not match. Please try again.');
                }
            } else {
                console.error('Please fill out all fields.');
            }
        });
    }

    function DisplayLoginPage() {
        console.log("Calling DisplayLoginPage()...");
        let keys = Object.keys(localStorage);
        
        let loginBtn = document.getElementById("loginBtn");
        loginBtn.addEventListener("click", function(event) {
            event.preventDefault();
            let email = document.getElementById("email");
            let password = document.getElementById("password");
            for (const key of keys) {
                if (key.startsWith("volunteer_")) {
                    let volunteerData = localStorage.getItem(key);
                    console.log(volunteerData);
                    if (volunteerData) {
                        let volunteer = new Volunteer()
                        volunteer.deserialize(volunteerData);
                        console.log(volunteer.toString());
                        console.log(email.value, password.value);
                        console.log(volunteer.emailAddress, volunteer.password);
                        if (volunteer.emailAddress === email.value && volunteer.password === password.value) {
                            sessionStorage.setItem("user", volunteer.serialize());
                            location.href = "index.html";
                            return;
                        }
                    }
                }
            }
            let loginError = document.getElementById("loginError");
            loginError.style.display = "block";
            loginError.innerHTML = "Invalid email or password. Please try again.";
        });
        let cancelBtn = document.getElementById("cancelBtn");
        cancelBtn.addEventListener("click", function(event) {
            event.preventDefault();
            location.href = "index.html";
        });

    }

    /*
    * Loads news from the news API
    */
    function DisplayNewsPage() {
        console.log("Calling DisplayNewsPage()...");
        const API_KEY = "d4392d8160b24f7b9678647eab03b02d";
        const newsContainer = document.getElementById('newsContainer');

        // Fetch news about Oshawa
        fetch(`https://newsapi.org/v2/everything?q=Oshawa&sortBy=publishedAt&apiKey=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                if (data.articles && data.articles.length > 0) {
                    newsContainer.innerHTML = ''; // Clear existing content
                    
                    data.articles.slice(0, 18).forEach(article => { // Display first 9 articles
                        const articleElement = document.createElement('div');
                        articleElement.className = 'col-md-4 mb-4';
                        articleElement.innerHTML = `
                            <div class="card h-100">
                                <div class="card-body">
                                    <h5 class="card-title">${article.title}</h5>
                                    <p class="card-text">${article.description || ''}</p>
                                    <p class="card-text">
                                        <small class="text-muted">
                                            Published On: ${new Date(article.publishedAt).toLocaleDateString()}
                                        </small>
                                    </p>
                                    <a href="${article.url}" class="btn btn-primary" target="_blank">
                                        Click To Read More
                                    </a>
                                </div>
                            </div>
                        `;
                        newsContainer.appendChild(articleElement);
                    });
                } else {
                    newsContainer.innerHTML = `
                        <div class="alert alert-info" role="alert">
                            No news articles found for Oshawa at this time.
                        </div>
                    `;
                }
            })
            .catch(error => {
                console.error('Error fetching news:', error);
                newsContainer.innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        Error loading news. Please try again later.
                    </div>
                `;
            });
    }

//#endregion

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
        DonateNavItem.innerHTML = `<a class="nav-link" href="donate.html" id="DonateNav">Donate</a>`;
        // So it doesnt appear after the dropdown which i want at the end
        NavList.insertBefore(DonateNavItem, NavList.lastElementChild);
        const cases = [
            ["Volunteer Connect", DisplayHomePage],
            ["About", DisplayAboutPage],
            ["Contact Us", DisplayContactPage],
            ["Donate", DisplayDonatePage],
            ["Events", DisplayEventsPage],
            ["Opportunities", DisplayOpportunitiesPage],
            ["Terms of Service", DisplayTermsPage],
            ["Privacy Policy", DisplayPrivacyPage],
            ["Feedback", DisplayFeedbackPage],
            ["Login", DisplayLoginPage],
            ["Become a volunteer!", DisplayRegisterPage],
            ["News", DisplayNewsPage]
        ];

        const match = cases.find(([key]) => key === document.title);
        if (match) {
            match[1](); // Call the corresponding function
            
        } else {
            console.error("No matching title found");
        }

        AddSampleData();

    }window.addEventListener("load", Start);
})()
// Last two brackets makes the function immediately call itself

