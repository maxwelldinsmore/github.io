//IIFE - Immediately Invoked Functional Expression
"use strict";

(function() {


    function verifyLogin() {
        console.log("Checking whether user is logged in...");

        const loginNav = document.getElementById("loginNav");

        if(!loginNav) {
            console.warn("lognav element not found, skipping verifyLogin().");
            return;
        }
        const userSession = sessionStorage.getItem("user");

        if (userSession) {
            loginNav.innerHTML = `<i class="fa-solid fa-sign-out-alt"></i> Logout`;
            loginNav.href = "#";

            loginNav.addEventListener("click", (event) => {
                event.preventDefault();
                sessionStorage.removeItem("user");
                location.href = "login.html";
            })
        }
    }


    async function loadHeaderBar() {
        return fetch("header.html")
            .then(response => response.text())
            .then(data => {
                document.querySelector('header').innerHTML = data;
                updateActiveLink();
            })
            .catch(error => {console.error("Unable to load header.", error)});
    }

    function updateActiveLink() {
        console.log("updateActiveLink....");

        const currentPage = document.title.trim();
        const navLinks = document.querySelectorAll('nav a');

        navLinks.forEach((link) => {
            if(link.textContent === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    
    /**
     * Redirects user back to contact list page
     */
    function handleCancelClick() {
        location.href = "contactlist.html";
    }
    
    // Processes event of editing a contact
    function handleEditCLick(event, contact, page) {
        event.preventDefault();

        if(!validateForm()) {
            alert("Form is invalid. Check the form");
            return;
        }
        // Get updated values from the form
        const fullName = document.getElementById("fullName").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const emailAddress = document.getElementById("emailAddress").value;

        // Updates the contact instance
        contact.fullName = fullName;
        contact.contactNumber = contactNumber;
        contact.emailAddress = emailAddress;

        // Saves the updated contact to local storage in a csv format
        localStorage.setItem(page, contact.serialize());

        location.href = "contact-list.html";
    }

    // Handles the process of adding a contact

    function handleAddClick(event) {
        event.preventDefault();

        if (!validateForm()) {
            console.error("Form is invalid. Cannot add contact");
            return;
        }

        const fullName = document.getElementById("fullName").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const emailAddress = document.getElementById("emailAddress").value;

        AddContact(fullName, contactNumber, emailAddress);

        //redirect to contact list page
        location.href = "contact-list.html";

    }

    function addEventListenerOnce(elementID, event, handler) {
        // retrieve element from the DOM
        const element = document.getElementById(elementID);
        if (element) {
            element.removeEventListener(event, handler);
            element.addEventListener(event, handler, {once: true});
        } else {
            console.warn(`[WARN] Element with ID '${elementID}' not found`);
        }
    }

    // Validates the entire form
    // @return {boolean} - false if any field is invalid
    function validateForm() {
        return (
            validateInput("fullName") && 
            validateInput("contactNumber") && 
            validateInput("emailAddress")
        );
    }


    /*
    * General Validation rules and error messages
    */
    const VALIDATION_RULES = {
        fullName: {
            regex: /^[a-zA-Z\s]+$/,
            errorMessage: "Full Name must contain only letters and spaces"
            },
        contactNumber: {
            regex: /^\d{3}-\d{3}-\d{4}$/,
            errorMessage: "Contact Number must be in the format 123-456-7890"
            },
        emailAddress: {
            regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            errorMessage: "Email Address must be in the format start@company.someurl i.e johndoe@gmail.com"
        }
    };

    function validateInput(fieldID) {
        const field = document.getElementById(fieldID);
        const errorElement = document.getElementById(`${fieldID}-error`);
        const rule = VALIDATION_RULES[fieldID];

        if (!field || !errorElement || !rule) { 
            console.warn(`[WARN] Validation rule not found for ${fieldID}`);
            return false;
        }
        if(field.value.trim() === "") {
            errorElement.textContent = rule.errorMessage;
            errorElement.style.display = "block";
            return false;
        }
        if (!rule.regex.test(field.value)) {
            errorElement.textContent = rule.errorMessage;
            errorElement.style.display = "block";
            return false;
        }
        // Clear the error message if valid
        errorElement.textContent = "";
        errorElement.style.display = "none";
        return true;

    }        

    function attachValidationListener() {
        console.log("Attaching validation listener to object");
        Object.keys(VALIDATION_RULES).forEach((fieldID) => {
            
            const field = document.getElementById(fieldID);
            if (!fieldID) {
                console.warn(`[WARNING] Field '${fieldID}' not found. Skipping validation listener`);
                return;
            }
            addEventListenerOnce("contactForm", "submit", (event) => {
                if (!validateForm()) {
                    event.preventDefault();
                }
            });
        });
    }

    function AddContact(fullName, contactNumber, emailAddress) {
        console.log("[DEBUG] AddContact() called");
        if (!validateForm()) {
            alert("Form contains errors. Cannot add contact");
            return;
        }
        let contact = new core.Contact(
            fullName,
            contactNumber,
            emailAddress
        );
        if (contact.serialize()) {
            // key is primary key kind of for the contact
            let key = `contact_${Date.now()}`;
            localStorage.setItem(key, contact.serialize());
        } else {
            console.error("[ERROR]Contact serialization failed");
        }
    }
    async function DisplayWeather() {
        
        const apiKey = "f67c8bf3435ac4efdc3f5ef9d5bf6500"
        const city = "Oshawa";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);

            // 200 means OK
            if(!response.ok) {
                throw new Error("Failed to fetch weather data from openweathermap.org");
            }

            const data = await response.json();
            console.log("Weather API Response", data);
        
            const weatherDataElement = document.getElementById("weather-data");
            weatherDataElement.innerHTML = `<strong>City:</strong> ${data.name}<br>
            <strong>Temperature: </strong> ${data.main.temp} <br>
            <strong>Weather: </strong> ${data.weather[0].description} <br>`;
        } catch(error) {

            console.error("Error fetching weather data", error);
            document.getElementById("weather-data").innerHTML = "Unable to fetch weather data at the moment";
        }
    }

    function DisplayHomePage() {
        console.log("Calling DisplayHomePage()...");

        let AboutUsBtn = document.getElementById("AboutUsBtn");
        // Arrow function notation
        AboutUsBtn.addEventListener("click", () => {
            location.href="about.html";
        });

        // Adds basic paragraph to the main content
        document.querySelector("main").insertAdjacentHTML("beforeend",
            `<p id="mainParagraph" class="mt-3">This is a simple paragraph</Article>`
        );
        
        // Adds article to main body
        document.body.insertAdjacentHTML(
            "beforeend",
            `<article class="container">
                <p id="ArticleParagraph" class="mt-3">This is my article paragraph...</p>
            </article>`
        );
        // Calls Display weather to use OpenWeather API
        DisplayWeather();
    }
    function DisplayAbout() {
        console.log("Calling DisplayAbout()...");
    }
    function DisplayProducts() {
        console.log("Calling DisplayProducts()...");
    }
    function DisplayServices() {
        console.log("Calling DisplayServices()...");
    }

    function DisplayContact() {
        console.log("Calling DisplayContact()...");
        
        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");

        sendButton.addEventListener("click", function() {
            event.preventDefault();

            if (!validateForm()) {
                console.error("Form is invalid. Fix your errors before resubmitting");
                return;
            }
            if (subscribeCheckbox.checked) {
                AddContact(
                    document.getElementById("fullName").value,
                    document.getElementById("contactNumber").value,
                    document.getElementById("emailAddress").value
                );
            }
            alert("Form submitted successfully");
        });
    }
    function DisplayContactList() {
        console.log("Calling DisplayContactList()...");
        let contactList = document.getElementById("contactList");
        let data = "";



        let keys = Object.keys(localStorage);

        for (const key of keys) {
            if (key.startsWith("contact_")) {
                let contactData = localStorage.getItem(key);
                try {
                    console.log(contactData);

                    let contact = new core.Contact();
                    contact.deserialize(contactData);
                    data += `<tr>
                    <th scope ="row" class="text-center"> 
                            <td>${contact.fullName}</td> 
                            <td>${contact.contactNumber}</td> 
                            <td>${contact.emailAddress}</td> 
                            <td>
                                <button value="${key}" class="btn btn-warning btn-sm edit">
                                <i class="fa-solid fa-user-pen"></i>Edit
                                </button>                            
                            </td>
                            <td>
                                <button value="${key}" class="btn btn-danger btn-sm edit">
                                <i class="fa-solid fa-user-minus"></i>
                                Delete</button>  
                            </td>
                        </th>
                    </tr>`;
                    contactList.innerHTML += data;
                } catch(error) {
                    console.error("Error: Contact data is invalid");
                    return;
                }
                
            }
        }
        const addButton = document.getElementById("addButton");
        if(addButton) {
            addButton.addEventListener("click", function() {
                location.href = "edit.html#add";
            }
        );
        }
        const deleteButtons = document.querySelectorAll("button.delete");
        deleteButtons.forEach( (button) => {
            button.addEventListener("click", () => {
                if(confirm("delete contact? please confirm")) {
                    localStorage.removeItem(button.value);
                    location.href = "contact-list.html";
                }
            });
        });

        const editButtons = document.querySelectorAll("button.edit");
        editButtons.forEach((button) => {
            button.addEventListener("click", function() {
                // concatenate the value from the edit line to the edit.html
                location.href = "edit.html#" + this.value;
            });
        })
    }

    function DisplayEditPage() {
        const page = location.hash.substring(1);
        const editButton = document.getElementById("editButton");
        const cancelButton = document.getElementById("cancelButton");

        switch(page) {
            case "add":
                document.title="Add Contact";
                const heading = document.querySelector("h1");
                heading.textContent = "Add Contact";                
                if(editButton) {
                    editButton.innerHTML = `<i class="fa-solid fa-user-pen"> Add Contact`;
                    editButton.classList.remove("btn-primary");
                    editButton.classList.add("btn-success");
                }
                addEventListenerOnce("cancelButton", "click", handleCancelClick);
                addEventListenerOnce("editButton", "click", handleAddClick);
                
                break;


            default:
                // Edit contact
                const contact = new core.Contact();
                const contactData = localStorage.getItem(page);
                if(contactData) {
                    contact.deserialize(contactData);
                }
                
                document.getElementById("fullName").value = contact.fullName;
                document.getElementById("contactNumber").value = contact.contactNumber;
                document.getElementById("emailAddress").value = contact.emailAddress;

                if(editButton) {
                    editButton.innerHTML = `<i class="fa-solid fa-user-pen"> Edit Contact`;
                    editButton.classList.remove("btn-primary");
                    editButton.classList.add("btn-success");
                }

                addEventListenerOnce("editButton", "click", (event) => {
                    handleEditCLick(event, contact, page);
                });

                addEventListenerOnce("cancelButton", "click", handleCancelClick);
                if (cancelButton) {
                    cancelButton.addEventListener("click", (event) => {
                        location.href = "contact-list.html";
                    })
                }
                break;
        }  
    }

    function DisplayLoginPage() {
        console.log("DisplayLoginPage called...");

        const messageArea = document.getElementById("messageArea");
        const loginButton = document.getElementById("loginButton");
        const cancelButton = document.getElementById("cancelButton");

        messageArea.style.display = "none";

        if (!loginButton) {
            console.error("Login Button not found")
            return;
        }

        loginButton.addEventListener("click", async(event) => {
            event.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            try {
                const response = await fetch("/users.json");

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }
                // Getting json data
                const jsonData = await response.json(); 
                const users = jsonData.users;
                console.log(users);

                if (!Array.isArray(users)) {
                    throw new Error(`Unable to load users.`);
                }
                let success = false;
                let authenticateUser = null;

                for (const user of users) {
                    if (user.username === username && user.password === password) {
                        success = true;
                        authenticateUser = user;
                        break;
                    }
                }
                if (success) {
                    sessionStorage.setItem("user", JSON.stringify({
                        DisplayName: authenticateUser.displayName,
                        EmailAddress: authenticateUser.emailAddress,
                        Username: authenticateUser.username,
                    }));
                    messageArea.classList.remove("alert", "alert-danger");
                    messageArea.style.display = "none";
                    location.href = "contact-list.html";
                } else {
                    if (messageArea) {
                        messageArea.classList.add("alert", "alert-danger");
                        messageArea.textContent = "Invalid user or password, please try again.";
                    } else {
                        console.error("Message area element not found.");
                    }
                    messageArea.style.display = "block";

                    document.getElementById("username").focus();
                    document.getElementById("username").select();
                }
            } catch(error) {
                console.error("Login failed.", error);
            }
        });

        cancelButton.addEventListener("click", (event) => {
            document.getElementById("loginForm").reset();
            location.href = "index.html";
        });
    }

    function DisplayRegisterPage() {
        console.log("DisplayRegisterPage called...");
    }



    async function Start() {
        console.log("Starting...");
        console.log(`current document title: ${document.title}`);

        // lead navbar
        await loadHeaderBar().then( () => {
            verifyLogin();

        });
        
        switch(document.title) {
            case "Home": 
                DisplayHomePage();
                break;
            case "About":
                DisplayAbout();
                break;
            case "Products":
                DisplayProducts();
                break;
            case "Services":
                DisplayServices();
                break;
            case "Contact":
                attachValidationListener();
                DisplayContact();
                break;
            case "Contact List":
                DisplayContactList();
                break;
            case "Edit Contact":
                attachValidationListener();
                DisplayEditPage();
                break;
            case "Login":
                DisplayLoginPage();
                break;
            case "Register":
                DisplayRegisterPage();
                break;
            default:
                console.error("No matching case for page title");
                break;
        }
    }window.addEventListener("DOMContentLoaded", () => {
        console.log("DOM fully loaded and parsed");
        Start();
    });
})()
// Last two brackets makes the function immediately call itself
