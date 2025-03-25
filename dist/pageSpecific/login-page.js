import { Volunteer } from "../volunteer";
export function DisplayLoginPage(router) {
    console.log("Calling DisplayLoginPage()...");
    let keys = Object.keys(localStorage);
    let loginBtn = document.getElementById("loginBtn");
    if (!loginBtn) {
        console.error("[ERROR] Unable to find loginBtn");
        return;
    }
    loginBtn.addEventListener("click", function (event) {
        event.preventDefault();
        let email = document.getElementById("email");
        let password = document.getElementById("password");
        for (const key of keys) {
            if (key.startsWith("volunteer_")) {
                let volunteerData = localStorage.getItem(key);
                console.log(volunteerData);
                if (volunteerData) {
                    let volunteer = new Volunteer();
                    volunteer.deserialize(volunteerData);
                    if (volunteer.emailAddress === email.value && volunteer.password === password.value) {
                        const volunteerData = volunteer.serialize();
                        if (volunteerData) {
                            sessionStorage.setItem("user", volunteerData);
                        }
                        else {
                            console.error("[ERROR] Unable to serialize volunteer data");
                        }
                        router.loadRoute("/");
                        return;
                    }
                }
            }
        }
        let loginError = document.getElementById("loginError");
        if (loginError) {
            loginError.style.display = "block";
            loginError.innerHTML = "Invalid email or password. Please try again.";
        }
    });
    let cancelBtn = document.getElementById("cancelBtn");
    if (!cancelBtn) {
        console.error("[ERROR] Unable to find cancelBtn");
        return;
    }
    cancelBtn.addEventListener("click", function (event) {
        event.preventDefault();
        router.loadRoute("/");
    });
}
