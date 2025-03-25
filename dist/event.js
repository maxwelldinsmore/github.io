"use strict";
export class Event {
    _eventName;
    _eventDate;
    _eventType;
    _eventLocation;
    _eventDescription;
    _eventContact;
    _volunteerPositions;
    _volunteersSignedUp;
    constructor(eventName = "", eventDate = "", eventLocation = "", eventType = "", eventDescription = "", eventContact = "", volunteerPositions = -1, volunteersSignedUp = []) {
        this._eventName = eventName;
        this._eventDate = eventDate;
        this._eventType = eventType;
        this._eventLocation = eventLocation;
        this._eventDescription = eventDescription;
        this._eventContact = eventContact;
        this._volunteerPositions = volunteerPositions;
        this._volunteersSignedUp = volunteersSignedUp;
    }
    //#region Getters and Setters    
    get eventName() {
        return this._eventName;
    }
    set eventName(eventName) {
        this._eventName = eventName;
    }
    get eventDate() {
        return this._eventDate;
    }
    set eventDate(eventDate) {
        this._eventDate = eventDate;
    }
    get eventType() {
        return this._eventType;
    }
    set eventType(eventType) {
        this._eventType = eventType;
    }
    get eventLocation() {
        return this._eventLocation;
    }
    set eventLocation(eventLocation) {
        this._eventLocation = eventLocation;
    }
    get eventDescription() {
        return this._eventDescription;
    }
    set eventDescription(eventDescription) {
        this._eventDescription = eventDescription;
    }
    get eventContact() {
        return this._eventContact;
    }
    set eventContact(eventContact) {
        this._eventContact = eventContact;
    }
    get volunteerPositions() {
        return this._volunteerPositions;
    }
    set volunteerPositions(volunteerPositions) {
        this._volunteerPositions = volunteerPositions;
    }
    get volunteersSignedUp() {
        return this._volunteersSignedUp;
    }
    set volunteersSignedUp(volunteersSignedUp) {
        this._volunteersSignedUp = volunteersSignedUp;
    }
    //#endregion
    addVolunteer(volunteerEmail) {
        if (!this.CheckIfSignedUp(volunteerEmail)) {
            this._volunteersSignedUp.push(volunteerEmail);
        }
    }
    AmountOfAvailablePositions() {
        return this._volunteerPositions - this._volunteersSignedUp.length;
    }
    CheckIfSignedUp(email) {
        return this._volunteersSignedUp.includes(email);
    }
    toString() {
        return `Event Name: ${this._eventName}
        Event Date: ${this._eventDate}
        Event Type: ${this._eventType}
        Event Location: ${this._eventLocation}
        Event Description: ${this._eventDescription}
        Event Contact: ${this._eventContact}
        Volunteer Positions: ${this._volunteerPositions}
        Volunteers Signed Up: ${this._volunteersSignedUp.join(", ")}`;
    }
    serialize() {
        if (this._eventName !== "" && this._eventDate !== "" &&
            this._eventType !== "" && this._eventLocation !== "" &&
            this._eventDescription !== "" && this._eventContact !== "" &&
            this._volunteerPositions !== -1) {
            return `${this._eventName},${this._eventDate},${this._eventType},${this._eventLocation},${this._eventDescription},${this._eventContact},${this._volunteerPositions},${this._volunteersSignedUp.join(";")}`;
        }
        console.error("Unable to serialize Event");
        return null;
    }
    deserialize(data) {
        try {
            const propertyArray = data.split(',');
            if (propertyArray.length < 7) {
                throw new Error("Invalid data format");
            }
            this._eventName = propertyArray[0];
            this._eventDate = propertyArray[1];
            this._eventType = propertyArray[2];
            this._eventLocation = propertyArray[3];
            this._eventDescription = propertyArray[4];
            this._eventContact = propertyArray[5];
            this._volunteerPositions = parseInt(propertyArray[6], 10);
            if (isNaN(this._volunteerPositions)) {
                throw new Error("Invalid volunteer positions number");
            }
            // Handle volunteer emails array
            if (propertyArray.length > 7 && propertyArray[7]) {
                this._volunteersSignedUp = propertyArray[7]
                    .split(';')
                    .map(email => email.trim())
                    .filter(email => email !== '');
            }
            else {
                this._volunteersSignedUp = [];
            }
        }
        catch (error) {
            console.error("Error deserializing Event:", error);
            throw error;
        }
    }
}
