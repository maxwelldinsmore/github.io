"use strict";

// Import the Volunteer class if not in the same file
import { Volunteer } from './volunteer.js';

export class Event {
    private _eventName: string;
    private _eventDate: string;
    private _eventType: string;
    private _eventLocation: string;
    private _eventDescription: string;
    private _eventContact: string;
    private _volunteerPositions: number;
    private _volunteersSignedUp: string[];

    constructor(
        eventName: string = "", 
        eventDate: string = "", 
        eventLocation: string = "", 
        eventType: string = "",
        eventDescription: string = "", 
        eventContact: string = "", 
        volunteerPositions: number = -1, 
        volunteersSignedUp: string[] = []
    ) {
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


    public addVolunteer(volunteerEmail: string): void {
        if (!this.CheckIfSignedUp(volunteerEmail)) {
            this._volunteersSignedUp.push(volunteerEmail);
        }
    }

    public AmountOfAvailablePositions(): number {
        return this._volunteerPositions - this._volunteersSignedUp.length;
    }

    public CheckIfSignedUp(email: string): boolean {
        return this._volunteersSignedUp.includes(email);
    }

    public toString(): string {
        return `Event Name: ${this._eventName}
        Event Date: ${this._eventDate}
        Event Type: ${this._eventType}
        Event Location: ${this._eventLocation}
        Event Description: ${this._eventDescription}
        Event Contact: ${this._eventContact}
        Volunteer Positions: ${this._volunteerPositions}
        Volunteers Signed Up: ${this._volunteersSignedUp.join(", ")}`;
    }

    public serialize(): string | null {
        if (this._eventName !== "" && this._eventDate !== "" &&
            this._eventType !== "" && this._eventLocation !== "" &&
            this._eventDescription !== "" && this._eventContact !== "" &&
            this._volunteerPositions !== -1) {
            
            return `${this._eventName},${this._eventDate},${this._eventType},${this._eventLocation},${this._eventDescription},${this._eventContact},${this._volunteerPositions},${this._volunteersSignedUp.join(";")}`;
        }
        console.error("Unable to serialize Event");
        return null;
    }

    public deserialize(data: string): void {
        try {
            const propertyArray: string[] = data.split(',');
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
            } else {
                this._volunteersSignedUp = [];
            }

        } catch (error) {
            console.error("Error deserializing Event:", error);
            throw error;
        }
    }
}