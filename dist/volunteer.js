"use strict";
export class Volunteer {
    _firstName;
    _lastName;
    _emailAddress;
    _password;
    _admin;
    _websiteVisits;
    _eventsAttended;
    // Constructor for the Volunteer class
    constructor(firstName = "", lastName = "", emailAddress = "", password = "", admin = false, websiteVisits = 0, eventsAttended = 0) {
        this._firstName = firstName;
        this._lastName = lastName;
        this._emailAddress = emailAddress;
        this._password = password;
        this._admin = admin;
        this._eventsAttended = eventsAttended;
        this._websiteVisits = websiteVisits;
    }
    //#region Getters and Setters
    get adminStatus() {
        return this._admin;
    }
    set adminStatus(admin) {
        this._admin = admin;
    }
    get firstName() {
        return this._firstName;
    }
    set firstName(firstName) {
        this._firstName = firstName;
    }
    get lastName() {
        return this._lastName;
    }
    set lastName(lastName) {
        this._lastName = lastName;
    }
    get emailAddress() {
        return this._emailAddress;
    }
    set emailAddress(emailAddress) {
        this._emailAddress = emailAddress;
    }
    get password() {
        return this._password;
    }
    set password(password) {
        this._password = password;
    }
    set websiteVisits(visits) {
        this._websiteVisits = visits;
    }
    get websiteVisits() {
        return this._websiteVisits;
    }
    set eventsAttended(events) {
        this._eventsAttended = events;
    }
    get eventsAttended() {
        return this._eventsAttended;
    }
    //#endregion
    // Returns a string representation of the Volunteer object
    toString() {
        return `Volunteer [FirstName: ${this._firstName}, LastName: ${this._lastName}, EmailAddress: ${this._emailAddress}, Password: ${this._password}, Admin: ${this._admin}, WebsiteVisits: ${this._websiteVisits}, EventsAttended: ${this._eventsAttended}]`;
    }
    // Serializes the data to comma-separated value strings
    serialize() {
        if (this._firstName !== "" && this._lastName !== "" && this._emailAddress !== "" && this._password !== "") {
            return `${this._firstName},${this._lastName},${this._emailAddress},${this._password},${this._admin},${this._websiteVisits},${this._eventsAttended}`;
        }
        console.error("Unable to serialize");
        return null;
    }
    // Deserializes the data from comma-separated value strings
    deserialize(data) {
        let propertyArray = data.split(',');
        this._firstName = propertyArray[0];
        this._lastName = propertyArray[1];
        this._emailAddress = propertyArray[2];
        this._password = propertyArray[3];
        this._admin = propertyArray[4] === 'true';
        this._websiteVisits = parseInt(propertyArray[5]);
        this._eventsAttended = parseInt(propertyArray[6]);
    }
    // Converts to JSON format
    toJSON() {
        return {
            FirstName: this._firstName,
            LastName: this._lastName,
            EmailAddress: this._emailAddress,
            Password: this._password,
            Admin: this._admin,
            WebsiteVisits: this._websiteVisits,
            EventsAttended: this._eventsAttended
        };
    }
    // Converts from JSON format
    fromJSON(data) {
        this._firstName = data.FirstName;
        this._lastName = data.LastName;
        this._emailAddress = data.EmailAddress;
        this._password = data.Password;
        this._admin = data.Admin;
        this._websiteVisits = data.WebsiteVisits;
        this._eventsAttended = data.EventsAttended;
    }
}
