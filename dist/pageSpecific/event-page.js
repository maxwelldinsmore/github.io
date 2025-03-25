"use strict";
const { DateTime } = luxon;
import { Event } from '../event.js';
async function HighlightEventDate(event) {
    const eventDate = DateTime.fromISO(event.eventDate);
    const eventMonth = eventDate.toFormat('MMMM');
    const eventDay = eventDate.toFormat('d');
    const eventYear = eventDate.toFormat('yyyy');
    const MonthInformation = document.getElementById("currentMonth")?.innerHTML;
    const YearInformation = document.getElementById("currentYear")?.innerHTML;
    if (YearInformation === eventYear && MonthInformation === eventMonth) {
        console.log("Highlighting Event Date");
        const CalendarDays = document.getElementById("CalendarDay")?.getElementsByTagName("li");
        if (!CalendarDays)
            return;
        Array.from(CalendarDays).forEach(day => {
            if (day.textContent === eventDay) {
                day.classList.add("btn-primary", "btn", "text-white");
                day.addEventListener("click", function () {
                    console.log("Event Date Clicked");
                    const eventCards = document.querySelectorAll('.card');
                    eventCards.forEach(card => {
                        card.classList.remove('bg-light', 'border-primary');
                        const cardTextElement = card.querySelector('.card-text');
                        if (!cardTextElement)
                            return;
                        const cardDate = DateTime.fromISO(cardTextElement.textContent || '').toFormat('d');
                        if (cardDate === eventDay) {
                            card.classList.add('bg-light', 'border-primary');
                            card.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center'
                            });
                        }
                    });
                });
            }
        });
    }
}
async function DisplayCalendar(month, year) {
    const MonthInformation = document.getElementById("currentMonth");
    const YearInformation = document.getElementById("currentYear");
    if (!MonthInformation || !YearInformation)
        return;
    MonthInformation.innerHTML = month;
    YearInformation.innerHTML = year;
    const currentDate = DateTime.fromFormat(`${month} ${year}`, 'MMMM yyyy');
    let StartOfMonth = currentDate.startOf('month').weekday; // Luxon uses 1 (Monday) to 7 (Sunday)
    const DaysInMonth = currentDate.daysInMonth;
    if (StartOfMonth === 7) {
        StartOfMonth = 0; // Adjust to match Sunday as the first day
    }
    const CalendarDays = document.getElementById("CalendarDay");
    if (!CalendarDays)
        return;
    CalendarDays.innerHTML = "";
    if (DaysInMonth) {
        for (let i = 1; i < (DaysInMonth + StartOfMonth); i++) {
            const li = document.createElement("li");
            li.textContent = i >= StartOfMonth ? String(i - StartOfMonth + 1) : '';
            CalendarDays.appendChild(li);
        }
    }
}
async function DisplayUpcomingEvents() {
    const EventList = document.getElementById("EventList");
    const CheckBoxFundraisers = document.getElementById("CheckBoxFundraisers");
    const CheckBoxWorkshops = document.getElementById("CheckBoxWorkshops");
    const CheckBoxCleanups = document.getElementById("CheckBoxCleanups");
    if (!EventList || !CheckBoxFundraisers || !CheckBoxWorkshops || !CheckBoxCleanups)
        return;
    const keys = Object.keys(localStorage);
    EventList.innerHTML = "";
    for (const key of keys) {
        if (key.startsWith("event_")) {
            const eventData = localStorage.getItem(key);
            if (!eventData)
                continue;
            const event = new Event();
            event.deserialize(eventData);
            if ((event.eventType === "Fundraiser" && CheckBoxFundraisers.checked) ||
                (event.eventType === "Workshop" && CheckBoxWorkshops.checked) ||
                (event.eventType === "Cleanup" && CheckBoxCleanups.checked)) {
                EventList.innerHTML += `
                <div class="card mt-3">
                    <div class="card-body">
                        <h5 class="card-title">${event.eventName}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${event.eventDescription}</h6>
                        <p class="card-text">${event.eventDate}</p>
                    </div>
                </div>`;
                await HighlightEventDate(event);
            }
        }
    }
}
export async function DisplayEventsPage() {
    console.log("Calling DisplayEventsPage()...");
    const checkboxes = {
        fundraisers: document.getElementById("CheckBoxFundraisers"),
        workshops: document.getElementById("CheckBoxWorkshops"),
        cleanups: document.getElementById("CheckBoxCleanups")
    };
    if (!checkboxes.fundraisers || !checkboxes.workshops || !checkboxes.cleanups)
        return;
    Object.values(checkboxes).forEach(checkbox => {
        checkbox.addEventListener("change", () => DisplayUpcomingEvents());
    });
    const now = DateTime.now();
    await DisplayCalendar(now.toFormat('MMMM'), now.toFormat('yyyy'));
    const nextMonth = document.getElementById("nextMonth");
    const prevMonth = document.getElementById("prevMonth");
    if (nextMonth && prevMonth) {
        nextMonth.addEventListener("click", async function () {
            const MonthInformation = document.getElementById("currentMonth");
            const YearInformation = document.getElementById("currentYear");
            if (!MonthInformation || !YearInformation)
                return;
            const currentMonth = DateTime.fromFormat(MonthInformation.innerHTML, 'MMMM');
            let currentYear = parseInt(YearInformation.innerHTML);
            const nextDate = currentMonth.plus({ months: 1 });
            if (nextDate.month === 1) {
                currentYear += 1;
            }
            await DisplayCalendar(nextDate.toFormat('MMMM'), String(currentYear));
            await DisplayUpcomingEvents();
        });
        prevMonth.addEventListener("click", async function () {
            const MonthInformation = document.getElementById("currentMonth");
            const YearInformation = document.getElementById("currentYear");
            if (!MonthInformation || !YearInformation)
                return;
            const currentMonth = DateTime.fromFormat(MonthInformation.innerHTML, 'MMMM');
            let currentYear = parseInt(YearInformation.innerHTML);
            const prevDate = currentMonth.minus({ months: 1 });
            if (prevDate.month === 12) {
                currentYear -= 1;
            }
            await DisplayCalendar(prevDate.toFormat('MMMM'), String(currentYear));
            await DisplayUpcomingEvents();
        });
    }
    await DisplayUpcomingEvents();
}
