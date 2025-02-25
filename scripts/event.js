"use strict";
class Event {
    constructor (eventName = "", eventDate = "", eventLocation = "", eventType = "",
        eventDescription = "", eventContact = "", volunteerPositions = "", volunteersSignedUp = "") {
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

    AmountOfAvailablePositions() {
        return parseInt(this._volunteerPositions) - parseInt(this._volunteersSignedUp.length);
    }

    // Basic to string method
    toString() {
        return `Event Name: ${this._eventName}
        \nEvent Date: ${this._eventDate}\nEvent Type: ${this._eventType}
        \nEvent Location: ${this._eventLocation}\nEvent Description: ${this._eventDescription}
        \nEvent Contact: ${this._eventContact}\nVolunteer Positions: ${this._volunteerPositions}
        \nVolunteers Signed Up: ${this._volunteersSignedUp}`;
    }

    // Serializes the data to comma separated value strings
    serialize() {
        if(this._eventName !== "" && this._eventDate !== "" && 
           this._eventType !== "" && this._eventLocation !== "" && 
           this._eventDescription !== "" && this._eventContact !== "" && 
           this._volunteerPositions !== "") {
            return `${this._eventName},${this._eventDate},${this._eventType},${this._eventLocation},${this._eventDescription},${this._eventContact},${this._volunteerPositions},${JSON.stringify(this._volunteersSignedUp)}`;
        }
        console.error("Unable to serialize");
        return null;
    }

    // Deserializes the data from comma separated value strings
    deserialize(data) {
        let propertyArray = data.split(',');
        this._eventName = propertyArray[0];
        this._eventDate = propertyArray[1];
        this._eventType = propertyArray[2];
        this._eventLocation = propertyArray[3];
        this._eventDescription = propertyArray[4];
        this._eventContact = propertyArray[5];
        this._volunteerPositions = propertyArray[6];
        
        // Fix for array deserialization
        if (propertyArray[7].includes('[')) {
            // Handle JSON array format
            try {
                this._volunteersSignedUp = JSON.parse(propertyArray[7]);
            } catch (e) {
                console.error("Error parsing volunteers array:", e);
                this._volunteersSignedUp = [];
            }
        } else {
            // Handle simple string format
            this._volunteersSignedUp = propertyArray[7] ? propertyArray[7].split(';') : [];
        }
    }
}