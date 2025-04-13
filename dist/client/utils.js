import { createContact, updateContact } from "./api/index.js";
import { Contact } from "./contact.js";
export const VALIDATION_RULES = {
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
export function validateInput(fieldID) {
    const field = document.getElementById(fieldID);
    const errorElement = document.getElementById(`${fieldID}-error`);
    const rule = VALIDATION_RULES[fieldID];
    if (!field || !errorElement || !rule) {
        console.warn(`[WARN] Validation rule not found for ${fieldID}`);
        return false;
    }
    if (field.value.trim() === "") {
        errorElement.textContent = rule.errorMessage;
        errorElement.style.display = "block";
        return false;
    }
    if (!rule.regex.test(field.value)) {
        errorElement.textContent = rule.errorMessage;
        errorElement.style.display = "block";
        return false;
    }
    errorElement.textContent = "";
    errorElement.style.display = "none";
    return true;
}
export function validateForm() {
    return (validateInput("fullName") &&
        validateInput("contactNumber") &&
        validateInput("emailAddress"));
}
export function addEventListenerOnce(elementID, event, handler) {
    const element = document.getElementById(elementID);
    if (element) {
        element.removeEventListener(event, handler);
        element.addEventListener(event, handler, { once: true });
    }
    else {
        console.warn(`[WARN] Element with ID '${elementID}' not found`);
    }
}
export function attachValidationListener() {
    console.log("Attaching validation listener to object");
    Object.keys(VALIDATION_RULES).forEach((fieldID) => {
        const field = document.getElementById(fieldID);
        if (!field) {
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
export async function DisplayWeather() {
    const apiKey = "f67c8bf3435ac4efdc3f5ef9d5bf6500";
    const city = "Oshawa";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch weather data from openweathermap.org");
        }
        const data = await response.json();
        console.log("Weather API Response", data);
        const weatherDataElement = document.getElementById("weather-data");
        if (weatherDataElement === null) {
            console.error("[Error)Element not found: weather-data");
            return;
        }
        weatherDataElement.innerHTML = `<strong>City:</strong> ${data.name}<br>
        <strong>Temperature: </strong> ${data.main.temp} <br>
        <strong>Weather: </strong> ${data.weather[0].description} <br>`;
    }
    catch (error) {
        console.error("Error fetching weather data", error);
        document.getElementById("weather-data").innerHTML = "Unable to fetch weather data at the moment";
    }
}
export async function AddContact(fullName, contactNumber, emailAddress, router) {
    console.log("[DEBUG] AddContact() called");
    if (!validateForm()) {
        alert("Form contains errors. Cannot add contact");
        return;
    }
    try {
        const newContact = { fullName, contactNumber, emailAddress };
        await createContact(newContact);
        router.navigate("/contact-list");
    }
    catch (err) {
        console.error("[ERROR] Failed to add contact", err);
    }
}
export function handleCancelClick(router) {
    router.navigate("/contact-list");
}
export async function handleEditClick(event, contactID, router) {
    event.preventDefault();
    if (!validateForm()) {
        alert("Form is invalid. Check the form");
        return;
    }
    const fullName = document.getElementById("fullName").value;
    const contactNumber = document.getElementById("contactNumber").value;
    const emailAddress = document.getElementById("emailAddress").value;
    try {
        await updateContact(contactID, { fullName, contactNumber, emailAddress });
        router.navigate("/contact-list");
    }
    catch (err) {
        console.error("[ERROR] Failed to update contact", err);
    }
}
export function handleAddClick(event, router) {
    event.preventDefault();
    if (!validateForm()) {
        console.error("Form is invalid. Cannot add contact");
        return;
    }
    const fullName = document.getElementById("fullName").value;
    const contactNumber = document.getElementById("contactNumber").value;
    const emailAddress = document.getElementById("emailAddress").value;
    AddContact(fullName, contactNumber, emailAddress, router);
    router.navigate("/contact-list");
}
// To be later removed
export function saveToStorage(key, value) {
    try {
        let storageValue;
        if (key.startsWith("contact_") && value instanceof Contact) {
            const serializedContact = value.serialize();
            if (serializedContact) {
                console.error("[ERROR] Unable to serialize contact object");
                return;
            }
            else {
                storageValue = serializedContact;
                localStorage.setItem(key, storageValue);
            }
        }
    }
    catch (error) {
        console.error(`[ERROR] Unable to save contact to local storage ${key}`, error);
    }
}
export function getFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        if (!data) {
            return null;
        }
        if (key.startsWith("contact_")) {
            const contact = new Contact();
            contact.deserialize(data);
            return contact; // cast Contact to generic type T
        }
        return JSON.parse(data);
    }
    catch (error) {
        console.error(`[ERROR] Unable to get storage value for key ${key}`, error);
        return null; // returns null instead of crashing
    }
}
export function deleteFromStorage(key) {
    try {
        if (localStorage.getItem(key) !== null) {
            localStorage.removeItem(key);
            console.log(`[INFO] Key: ${key} successfully deleted`);
        }
        else {
            console.warn(`[WARNING] Key: ${key} not found in storage`);
        }
    }
    catch (error) {
        console.error(`[ERROR] Unable to delete storage value for key ${key}`, error);
    }
}
