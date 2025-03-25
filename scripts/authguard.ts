"use strict";
import { Router } from "./router.js";


export function AuthGuard() {
    console.log("[AUTHGUARD] Checking whether user is logged in");
    const user = sessionStorage.getItem("user");
    const protectedRoutes = [
        "/createEvent",
        "/stats"
    ];
    console.log(location.hash.slice(1));
    if (!user && protectedRoutes.includes(location.hash.slice(1))) {
        console.log("[AUTHGUARD] unauthorized access detected. Redirecting to login page.");
        location.hash = "#/login-page";

    } 
}

