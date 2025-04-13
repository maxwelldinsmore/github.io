//IIFE - Immediately Invoked Functional Expression
"use strict";
import { loadHeaderBar } from "./header.js";
import { Router } from "./router.js";
import { loadFooterBar } from "./footer.js";
import { AuthGuard } from "./authguard.js";
import { Contact } from "./contact.js";
import { VALIDATION_RULES, validateForm, addEventListenerOnce, 
         attachValidationListener, DisplayWeather, AddContact, 
         handleAddClick, handleCancelClick, handleEditClick, 
         getFromStorage, deleteFromStorage,
         saveToStorage
       } from "./utils.js";
import { fetchContacts, fetchContact, deleteContact } from "./api/index.js";

interface PageTitles {
    [key: string]: string;
}
interface Routes {
    [key: string]: string;
}

const PageTitles: PageTitles = {
    "/": "Home",
    "/home": "Home",
    "/about": "About Us",
    "/products": "Products",
    "/services": "Services",
    "/contact": "Contact Us",
    "/contact-list": "Contact List",
    "/edit": "Edit Contact",
    "/login": "Login",
    "/register": "Register",
    "/404": "Page Not Found"
};

const routes: Routes = {
    "/": "views/pages/home.html",
    "/home": "views/pages/home.html",
    "/about": "views/pages/about.html",
    "/products": "views/pages/products.html",
    "/services": "views/pages/services.html",
    "/contact": "views/pages/contact.html",
    "/contact-list": "views/pages/contact-list.html",
    "/edit": "views/pages/edit.html",
    "/login": "views/pages/login.html",
    "/register": "views/pages/register.html",
    "/404": "views/pages/404.html"
};

const router = new Router(routes);

(function() {

    function DisplayHomePage() {
        console.log("Calling DisplayHomePage()...");
        
        const AboutUsBtn = document.getElementById("AboutUsBtn");
        if (AboutUsBtn) {
            AboutUsBtn.addEventListener("click", () => {
                router.navigate("/about");
            });
        }
        
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
        let subscribeCheckbox = document.getElementById("subscribeCheckbox") as HTMLInputElement;

        if (!sendButton || !subscribeCheckbox) {
            console.error("Send button or subscribe checkbox not found");
            return;
        }
        sendButton.addEventListener("click", function(event) {
            event.preventDefault();

            if (!validateForm()) {
                console.error("Form is invalid. Fix your errors before resubmitting");
                return;
            }
            if (subscribeCheckbox.checked) {
                AddContact(
                    (document.getElementById("fullName") as HTMLInputElement).value,
                    (document.getElementById("contactNumber") as HTMLInputElement).value,
                    (document.getElementById("emailAddress") as HTMLInputElement).value,
                    router
                );
            }
            alert("Form submitted successfully");
        });

        const contactListButton = document.getElementById("contactListButton");
        if (contactListButton) {
            contactListButton.addEventListener("click", function(event) {
                event.preventDefault();
                router.navigate("/contact-list");
            });
        }
    }

    async function DisplayContactList() {
        console.log("Calling DisplayContactList()...");
        let contactList = document.getElementById("contactList");
        if (!contactList) {
            console.error("[ERROR] Contact List element not found");
            return;
        }

        try {

            const contacts = await fetchContacts();
            let data = "";
            contacts.forEach((contact) => {
                    data += `<tr>
                    <th scope ="row" class="text-center"> 
                            <td>${contact.fullName}</td> 
                            <td>${contact.contactNumber}</td> 
                            <td>${contact.emailAddress}</td> 
                            <td>
                                <button value="${contact.id}" class="btn btn-warning btn-sm edit">
                                <i class="fa-solid fa-user-pen"></i>Edit
                                </button>                            
                            </td>
                            <td>
                                <button value="${contact.id}" class="btn btn-danger btn-sm delete">
                                <i class="fa-solid fa-user-minus"></i>
                                Delete</button>  
                            </td>
                        </th>
                    </tr>`;
            });
           
            contactList.innerHTML = data;
            const addButton = document.getElementById("addButton");
            if (addButton) {
                addButton.addEventListener("click", function() {
                    router.navigate("/edit#add");
                });
            }

            document.querySelectorAll("button.delete").forEach((button) => {
                button.addEventListener("click",  async function(event) {
                    const targetButton = event.target as HTMLButtonElement;
                    const contactId = targetButton.value;
                    if (confirm("Delete contact? Please confirm")) {
                        try {
                            await deleteContact(contactId);
                            DisplayContactList();
                        } catch (error) {
                            console.error("[ERROR] Unable to delete contact", error);
                        }
                    }
                });
            });

            document.querySelectorAll("button.edit").forEach((button) => {
                button.addEventListener("click", function(this: HTMLButtonElement) {
                    router.navigate(`/edit#${this.value}`);
                });
            });
        } catch (error) {
            console.error("[ERROR] Unable to display contact list", error);
        }
    }

    async function DisplayEditPage() {
        const hashParts = location.hash.split("#");

        const page: string = hashParts.length > 2 ? hashParts[2] : "";

        
        const cancelButton = document.getElementById("cancelButton") as HTMLButtonElement | null;
        const pageTitle = document.querySelector("main > h1") as HTMLHeadingElement | null;
        const editButton = document.getElementById("editButton") as HTMLButtonElement | null;

        if (!editButton || !cancelButton || !pageTitle) {
            console.error("[ERROR] component not found");
            return;
        }


        if (page === "add") {
            pageTitle.textContent = "Add Contact";
            editButton.innerHTML = `<i class="fa-solid fa-user-pen"> Add Contact`;
            editButton.classList.remove("btn-primary");
            editButton.classList.add("btn-success");
            addEventListenerOnce("cancelButton", "click", (event) => handleCancelClick(router));
            addEventListenerOnce("editButton", "click", (event) => handleAddClick(event, router));
        } else {
                try {
                    const contactData = await fetchContact(page);
                    (document.getElementById("fullName") as HTMLInputElement).value = contactData.fullName;
                    (document.getElementById("contactNumber") as HTMLInputElement).value = contactData.contactNumber;
                    (document.getElementById("emailAddress") as HTMLInputElement).value = contactData.emailAddress;
               
                    
                } catch (error) {
                    console.error("[ERROR] Unable to fetch contact data", error);
                }
                
      

                if (editButton) {
                    (editButton as HTMLButtonElement).innerHTML = `<i class="fa-solid fa-user-pen"> Edit Contact`;
                    (editButton as HTMLButtonElement).classList.remove("btn-primary");
                    (editButton as HTMLButtonElement).classList.add("btn-success");
                }

                addEventListenerOnce("editButton", "click", (event) => {
                    handleEditClick(event, page, router);
                });

                addEventListenerOnce("cancelButton", "click", () => handleCancelClick(router));
                if (cancelButton) {
                    cancelButton.addEventListener("click", (event) => {
                        router.navigate("/contact-list");
                    });
                }
            
        }
        
    }

    function DisplayLoginPage() {
        console.log("DisplayLoginPage called...");

        if (getFromStorage("user")) {
            router.navigate("/contact-list");
            return;
        }

        const messageArea = document.getElementById("messageArea") as HTMLElement | null;
        const loginButton = document.getElementById("loginButton") as HTMLElement | null;
        const cancelButton = document.getElementById("cancelButton") as HTMLElement | null;
        const loginForm = document.getElementById("loginForm") as HTMLFormElement | null;

        if (!messageArea) {
            console.error("[ERROR] Message Area not found");
            return;
        }
        messageArea.style.display = "none";

        if (!loginButton) {
            console.error("Login Button not found");
            return;
        }

        loginButton.addEventListener("click", async (event) => {
            event.preventDefault();

            const username = (document.getElementById("username") as HTMLInputElement).value.trim();
            const password = (document.getElementById("password") as HTMLInputElement).value.trim();

            try {
                const response = await fetch("/users");

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                const jsonData = await response.json();
                const users = jsonData.users;
                console.log(users);

                if (!Array.isArray(users)) {
                    throw new Error(`Unable to load users.`);
                }
                let success = false;
                let authenticatedUser = users.find((user: any) => user.Username === username && user.Password === password);
                if (authenticatedUser) {
                    success = true;
                } 
                console.log("Authenticated User: ", authenticatedUser);
                console.log("Success: ", success);
                if (success) {
                    sessionStorage.setItem("user", JSON.stringify(authenticatedUser));
                    // alternatively, update saveToStorage() to accept a storage type parameter
                    messageArea.classList.remove("alert", "alert-danger");
                    messageArea.style.display = "none";
                    
                    loadHeaderBar().then(() => {
                        router.navigate("/contact-list");
                    });
                } else {
                    if (messageArea) {
                        messageArea.classList.add("alert", "alert-danger");
                        messageArea.textContent = "Invalid user or password, please try again.";
                    } else {
                        console.error("Message area element not found.");
                    }
                    messageArea.style.display = "block";

                    (document.getElementById("username") as HTMLInputElement).focus();
                    (document.getElementById("username") as HTMLInputElement).select();
                }
            } catch (error) {
                console.error("Login failed.", error);
            }
        });
        if (cancelButton && loginForm) {
            cancelButton.addEventListener("click", (event) => {
                loginForm.reset();
                router.navigate("/");
            });
        } else {
            console.warn("[WARNING] Cancel button or login form not found.");
        }
    }

    function DisplayRegisterPage() {
        console.log("DisplayRegisterPage called...");
    }

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
        // This is what google told me to do
        document.title = PageTitles[path as keyof typeof PageTitles] || "Untitled Page";
        console.log(` Current page title: ${document.title}`);
        const protectedRoutes = [
            "/contact-list",
            "/edit"
        ];
        if (protectedRoutes.includes(path)) {
            AuthGuard();
        }

        switch (path) {
            case "/":
            case "/home":
                DisplayHomePage();
                break;
            case "/about":
                DisplayAbout();
                break;
            case "/products":
                DisplayProducts();
                break;
            case "/services":
                DisplayServices();
                break;
            case "/contact":
                DisplayContact();
                break;
            case "/contact-list":
                DisplayContactList();
                break;
            case "/edit":
                DisplayEditPage();
                break;
            case "/login":
                DisplayLoginPage();
                break;
            case "/register":
                DisplayRegisterPage();
                break;
            default:
                console.error("No matching path found");
                break;
        }
    }

    async function Start() {
        console.log("Starting...");
        console.log(`Current document title: ${document.title}`);

        // await loadHeaderBar();
        await loadFooterBar();

        const currentPath = location.hash.slice(1) || "/";
        router.loadRoute(currentPath);
    }

    window.addEventListener("DOMContentLoaded", () => {
        console.log("DOM fully loaded and parsed");
        Start();
    });
})();
