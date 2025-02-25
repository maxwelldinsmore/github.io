"use strict";
class Volunteer {
    // Constructor for the Volunteer class
    constructor(firstName = "", lastName = "", emailAddress = "", password = "", admin = false) {
        this._firstName = firstName;
        this._lastName = lastName;
        this._emailAddress = emailAddress;
        this._password = password;
        this._admin = admin;
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
    //#endregion

    // Returns a string representation of the Volunteer object
    toString() {
        return `Volunteer [FirstName: ${this._firstName}, LastName: ${this._lastName}, EmailAddress: ${this._emailAddress}, Password: ${this._password} Admin: ${this._admin}]`;
    }
    // Serializes the data to comma separated value strings
    serialize() {
        if (this._firstName !== "" && this._lastName !== "" && this._emailAddress !== "" && this._password !== "") {
            return `${this._firstName},${this._lastName},${this._emailAddress},${this._password},${this._admin}`;
        }
        console.error("Unable to serialize");
        return null;
    }

    // Deserializes the data from comma separated value strings
    deserialize(data) {
        let propertyArray = data.split(',');
        this._firstName = propertyArray[0];
        this._lastName = propertyArray[1];
        this._emailAddress = propertyArray[2];
        this._password = propertyArray[3];
        this._admin = propertyArray[4];
    }

    // Converts to JSON format
    toJSON() {
        return {
            FirstName: this._firstName,
            LastName: this._lastName,
            EmailAddress: this._emailAddress,
            Password: this._password,
            Admin: this._admin
        };
    }

    // Converts from JSON format
    fromJSON(data) {
        this._firstName = data.FirstName;
        this._lastName = data.LastName;
        this._emailAddress = data.EmailAddress;
        this._password = data.Password;
        this._admin = data.Admin;
    }
}