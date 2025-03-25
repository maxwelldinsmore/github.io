declare const Chart: any;
import { Volunteer } from '../volunteer.js';
export function DisplayStatsPage() {
    console.log("Displaying Stats Page...");

    // Retrieve volunteer data from local storage
    const volunteers: Volunteer[] = [];
    const keys = Object.keys(localStorage);
    let totalWebsiteVisits = 0;

    for (const key of keys) {
        if (key.startsWith("volunteer_")) {
            const volunteerData = localStorage.getItem(key);
            try {
                if (volunteerData) {
                    const volunteer = new Volunteer();
                    volunteer.deserialize(volunteerData); // Use the Volunteer class's deserialize method
                    volunteers.push(volunteer);
                    totalWebsiteVisits += volunteer.websiteVisits; // Use the getter for websiteVisits
                }
            } catch (error) {
                console.error(`[ERROR]Error deserializing volunteer data: ${error}`);
            }
           
        }
    }

    // Display total website visits
    const totalVisitsElement = document.getElementById("totalWebsiteVisits");
    if (totalVisitsElement) {
        totalVisitsElement.textContent = `Total Website Visits: ${totalWebsiteVisits}`;
    }

    // Prepare data for charts
    const labels = volunteers.map(v => `${v.firstName} ${v.lastName}`);
    const websiteVisitsData = volunteers.map(v => v.websiteVisits);
    const eventsAttendedData = volunteers.map(v => v.eventsAttended);

    // Create Website Visits Bar Chart
    const websiteVisitsCanvas = document.getElementById("websiteVisitsChart") as HTMLCanvasElement;
    if (websiteVisitsCanvas) {
        new Chart(websiteVisitsCanvas, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Website Visits',
                    data: websiteVisitsData,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Create Events Attended Bar Chart
    const eventsAttendedCanvas = document.getElementById("eventsAttendedChart") as HTMLCanvasElement;
    if (eventsAttendedCanvas) {
        new Chart(eventsAttendedCanvas, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Events Attended',
                    data: eventsAttendedData,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}