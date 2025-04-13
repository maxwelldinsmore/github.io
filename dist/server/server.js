"use strict";
//import need modules and types
import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import contactRoutes from './contactRoutes.js';
//Convert path to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;
// Middleware to parse incoming json payload
app.use(express.json());
// server static assets from node_modules for client-side user and rendering
app.use(express.static(path.join(__dirname, '../..')));
//Server static assets from node_modules for client-side user and rendering
app.use('/node_modules/@fortawesome/fontawesome-free', express.static(path.join(__dirname, '../../node_modules/fortawesome/fontawesome-free')));
app.use('/node_modules/bootstrap', express.static(path.join(__dirname, '../../node_modules/bootstrap')));
// Hosts the express Node stuff to the api/contacts endpoint
// for contacts 
app.use('/api/contacts', contactRoutes);
const users = [
    {
        DisplayName: "admin",
        EmailAddress: "admin@gmail.com",
        Username: "admin1",
        Password: "12345"
    },
    {
        DisplayName: "admin",
        EmailAddress: "admin@gmail.com",
        Username: "admin1",
        Password: "12345"
    },
    {
        DisplayName: "admin",
        EmailAddress: "admin@gmail.com",
        Username: "admin1",
        Password: "12345"
    }
];
// Route to server the home page (index.html)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../", "index.html"));
});
app.get('/users', (req, res) => {
    res.json({ users });
});
async function startServer() {
    try {
        app.listen(port, () => {
            console.log(`[INFO] Server running on http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error("[ERROR] Failed to start server", error);
        process.exit(1);
    }
}
await startServer();
