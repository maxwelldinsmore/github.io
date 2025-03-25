"use strict";
// import path from 'path';

// Type definition for RouteMap
interface RouteMap {
    [path: string]: {
        title: string;
        handler: () => void;
        SPAUrl: string;
    }
}

interface Route {
    path: string;
    title: string;
    handler: () => void;
}

export class Router {

    private routes: RouteMap;

    constructor(routes: RouteMap) {
        this.routes = routes;
        this.init();
    }

    init() {
        window.addEventListener("DOMContentLoaded", () => {
            const path = location.hash.slice(1) || "/";
            this.loadRoute(path);
            console.log(`[INFO] initial page load: ${path}`);

        });

        // popstate fires when user clicks forward or backwards page button
        window.addEventListener('popstate', () => {
            this.loadRoute(location.hash.slice(1));

        });
    }

    navigate(path: string): void {
        location.hash = path;
    }

    loadRoute(path: string) : void{
        // get base path
        const basePath = path.split('#')[0];

        if (!this.routes[basePath]) {
            console.warn('[WARNING] Route not found');
            location.hash = '/404';
            path = '/404';
            return;
        }

        fetch(this.routes[basePath].SPAUrl)
            .then(response => {
                if (!response.ok) throw new Error(`Unable to load route: ${this.routes[basePath].SPAUrl}`);
                return response.text();
            })
            .then(html => {
                const mainElement = document.querySelector('main');
                if (mainElement) {
                    mainElement.innerHTML = html;
                } else {
                    console.error("[ERROR] main element not found");
                }
                // ensures header is reloaded every page change
                loadHeaderBar().then(() => {
                    this.updateActiveLink();
                    document.dispatchEvent(new CustomEvent('routeLoaded', { detail: basePath }));
                });
            })
            .catch(error => console.error("[ERROR] error loading page: ", error));
            
    }

    /**
     * Updates the active link with the active class
     * Moved Into Router Class because it was easier to referenece
     * the routes type
    */
    updateActiveLink() {
        const currentPage = document.title.trim();
        const path = location.hash.slice(1) || "/";
        const navLinks = document.querySelectorAll('nav a');

        navLinks.forEach((link) => {
            if (path === link.getAttribute('href')?.replace('#', '')) {
                link.classList.add('active');
                link.setAttribute("aria-current", "page");
            } else {
                link.classList.remove('active');
                link.removeAttribute("aria-current");
            }
        });
    }
}

   /**
   * Dynamically loads the header bar from the header.html file
   */
export async function loadHeaderBar() {
    return fetch("./views/components/header.html")        
        .then(response => response.text())
        .then(data => {
            const headerElement = document.querySelector('header');
            if (!headerElement) {
                console.error("Header element not found.");
                return;
            }
            headerElement.innerHTML = data;
            if (sessionStorage.getItem("user")) {
                const loginLink = document.getElementById('loginButton');
                if (loginLink) {
                    loginLink.textContent = "Logout";
                    loginLink.addEventListener('click', () => {
                        sessionStorage.removeItem("user");
                        location.hash = "#/login-page";
                    });
                }
                // Adds create event and stats link to the header
                let nav = document.getElementById('navbarNavDropdown');
                if (nav) {
                    nav.insertAdjacentHTML('beforeend', '<a class="nav-link" href="#/createEvent">Create Event</a>');
                    nav.insertAdjacentHTML('beforeend', '<a class="nav-link" href="#/stats">Stats</a>');
                }

            }
        })
        .catch(error => {console.error("Unable to load header.", error)});
    }

    