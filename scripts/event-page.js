"use strict";
(function() {
    console.log("Event Page Script Loaded");


    async function HighlightEventDate(event = "") {
        let eventMonth = moment(event.eventDate, 'YYYY-MM-DD').format('MMMM');
        let eventDay = moment(event.eventDate, 'YYYY-MM-DD').format('D');
        let eventYear = moment(event.eventDate, 'YYYY-MM-DD').format('YYYY');
        let MonthInformation = document.getElementById("currentMonth").innerHTML;
        let YearInformation = document.getElementById("currentYear").innerHTML;
        if (YearInformation === eventYear && MonthInformation === eventMonth) {
            console.log("Highlighting Event Date");
            let CalendarDays = document.getElementById("CalendarDay").getElementsByTagName("li");
            for (let i = 0; i < CalendarDays.length; i++) {
                if (CalendarDays[i].textContent === eventDay) {
                    CalendarDays[i].classList.add("btn-primary");
                    CalendarDays[i].classList.add("btn");
                    CalendarDays[i].classList.add("text-white");
                    CalendarDays[i].addEventListener("click", function() {
                        console.log("Event Date Clicked");
                        
                        // Stolen from the internet
                        // Highlights and scrolls down to the event card associated
                        let eventCards = document.querySelectorAll('.card');
                        eventCards.forEach(card => {
                            // Remove any previous highlights
                            card.classList.remove('bg-light', 'border-primary');
                            
                            // Get event date from the card
                            let cardDate = moment(card.querySelector('.card-text').textContent).format('D');
                            
                            // If this card's date matches the clicked day
                            if (cardDate === eventDay) {
                                // Add highlight effect
                                card.classList.add('bg-light', 'border-primary');
                                
                                // Scroll the card into view with smooth animation
                                card.scrollIntoView({ 
                                    behavior: 'smooth',
                                    block: 'center'
                                });
                            }
                        });
                    });
                }
            }
        }
    }

    /* 
    * Displays the calendar for the current month and year
    * @param {String} month - The current month
    * @param {String} year - The current year
    */
    async function DisplayCalendar(month, year) {
        let MonthInformation = document.getElementById("currentMonth");
        let YearInformation = document.getElementById("currentYear");
        MonthInformation.innerHTML = month;
        YearInformation.innerHTML = year;
        let currentMoment = moment(`${month} ${year}`, 'MMMM YYYY');
        let StartOfMonth = parseInt(currentMoment.startOf('month').day()); // Get the day of the week (0-6)
        let DaysInMonth = parseInt(currentMoment.daysInMonth()); 
        // If its sunday make it 7
        if (StartOfMonth === 0) {
            StartOfMonth = 7;
        }
        let CalendarDays = document.getElementById("CalendarDay"); // Add days of month to calendar
        CalendarDays.innerHTML = "";
        for (let i = 1; i < (DaysInMonth + StartOfMonth); i++) {
                let li = document.createElement("li");
            if (i >= StartOfMonth) {
                li.textContent = i - StartOfMonth + 1;
            } else {
                li.textContent = ``;
            }
            CalendarDays.appendChild(li);

        }
    }

    /*
    * generates divs for each of the upcoming events 
    * based on given title, date, and description
    * Gets information from the document to see what filters are active
    */
    async function DisplayUpcomingEvents() {
        // Gets document Information
        let EventList = document.getElementById("EventList");
        let CheckBoxFundraisers = document.getElementById("CheckBoxFundraisers").checked;
        let CheckBoxWorkshops = document.getElementById("CheckBoxWorkshops").checked;
        let CheckBoxCleanups = document.getElementById("CheckBoxCleanups").checked;

        let keys = Object.keys(localStorage);
        EventList.innerHTML = "";
        console.log("test");
        for (const key of keys) {
            if (key.startsWith("event_")) {
                let eventData = localStorage.getItem(key);
                let event = new Event();
                event.deserialize(eventData);
                if ((event.eventType === "Fundraiser" && CheckBoxFundraisers) ||
                    (event.eventType === "Workshop" && CheckBoxWorkshops) ||
                    (event.eventType === "Cleanup" && CheckBoxCleanups)) {
                    EventList.innerHTML += `
                    <div class="card mt-3">
                        <div class="card-body">
                            <h5 class="card-title">${event.eventName}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${event.eventDescription}</h6>
                            <p class="card-text">${event.eventDate}</p>
                        </div>
                    </div>
                    `;

                    // High Lights the date on the event calendar
                    HighlightEventDate(event);

                }

            }
        }

    }

    /*
    * loads information about the upcoming events
    * and ties each event to a filter
    */
    async function DisplayEventsPage() {
        console.log("Calling DisplayEventsPage()...");

        // Checkboxes for filtering events
        let CheckBoxFundraisers = document.getElementById("CheckBoxFundraisers");
        // Events Listeners for checkboxes adds to filtered events array if seen
        // if unchecked removes from array
        CheckBoxFundraisers.addEventListener("change", function() {
            console.log("Fundraiser checkbox changed:", this.checked);
            DisplayUpcomingEvents();
        }); 
        // Same but Different
        let CheckBoxWorkshops = document.getElementById("CheckBoxWorkshops");
        CheckBoxWorkshops.addEventListener("change", function() {
            console.log("Workshop checkbox changed:", this.checked);
            DisplayUpcomingEvents();
        }); 
        // Same but Different
        let CheckBoxCleanups = document.getElementById("CheckBoxCleanups");
        CheckBoxCleanups.addEventListener("change", function() {
            console.log("Cleanup checkbox changed:", this.checked);
            DisplayUpcomingEvents();
        });

        // Displays Calendar with current month and year
        DisplayCalendar(moment().format('MMMM'), moment().format('YYYY'));

        let nextMonth = document.getElementById("nextMonth");
        nextMonth.addEventListener("click", function() {
            console.log("Next Month Clicked");
            let MonthInformation = document.getElementById("currentMonth");
            let YearInformation = document.getElementById("currentYear");

            // Parse the current month and year
            let currentMonth = moment(MonthInformation.innerHTML, 'MMMM');
            let currentYear = parseInt(YearInformation.innerHTML);
            // Add one month to the current month
            
            currentMonth = currentMonth.add(1, 'months');
            if (currentMonth.month() === 0) {
                currentYear = currentYear + 1;
            }
            // Update the calendar with the new month and year
            DisplayCalendar(currentMonth.format('MMMM'), currentYear);
            DisplayUpcomingEvents();
        });

        let prevMonth = document.getElementById("prevMonth");
        prevMonth.addEventListener("click", function() {
            let MonthInformation = document.getElementById("currentMonth");
            let YearInformation = document.getElementById("currentYear");

            // Parse the current month and year
            let currentMonth = moment(MonthInformation.innerHTML, 'MMMM');
            let currentYear = parseInt(YearInformation.innerHTML);
            // Add one month to the current month
            currentMonth = currentMonth.subtract(1, 'months');
            if (currentMonth.month() === 11) {
                currentYear = currentYear -1;
            }
            // Update the calendar with the new month and year
            DisplayCalendar(currentMonth.format('MMMM'), currentYear);
            DisplayUpcomingEvents();
        });

        DisplayUpcomingEvents();

    }


    async function Start() {
        DisplayEventsPage();
        
    }

    window.addEventListener("load", Start);
})()