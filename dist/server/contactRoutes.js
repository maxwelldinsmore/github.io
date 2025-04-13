import express from "express";
import Database from "./database.js";
const router = express.Router();
// Handles get reqiest to retrieve all contacts
router.get('/', async (req, res) => {
    try {
        const db = await Database.getInstance().connect();
        const contacts = await db.collection('contacts').find().toArray();
        res.json(contacts);
    }
    catch (error) {
        console.error("[ERROR] Error retrieving contacts", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// gets a contact by id
router.get('/:id', async (req, res) => {
    try {
        const db = await Database.getInstance().connect();
        const contact = await db.collection('contacts').findOne({ id: req.params.id });
        if (contact) {
            res.json(contact);
        }
        else {
            res.status(404).json({ message: "Contact not found" });
        }
    }
    catch (error) {
        console.error("[ERROR] Error retrieving contact", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post('/', async (req, res) => {
    try {
        const db = await Database.getInstance().connect();
        const contacts = await db.collection('contacts').find().toArray();
        const newID = contacts.length > 0 ? (Math.max(...contacts.map(c => parseInt(c.id))) + 1).toString() : '1';
        const newContact = { id: newID, ...req.body };
        db.collection('contacts').insertOne(newContact);
        res.status(201).json(newContact);
    }
    catch (error) {
        console.error("[ERROR] Error creating contact", error);
        res.status(500).json({ message: "Server Connection err" });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const db = await Database.getInstance().connect();
        const { ...updateData } = req.body;
        const result = await db.collection('contacts').findOneAndUpdate({ id: req.params.id }, { $set: updateData }, { returnDocument: 'after' });
        if (result && result.value) {
            res.json(result.value);
        }
        else {
            const updateContact = await db.collection('contacts').findOne({ id: req.params.id });
            if (updateContact) {
                res.json(updateContact);
            }
            else {
                res.status(404).json({ message: "Contact not found" });
            }
        }
    }
    catch (error) {
        console.error("[ERROR] Error updating contact", error);
        res.status(500).json({ message: "Server Connection Error" });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const db = await Database.getInstance().connect();
        const result = await db.collection('contacts').deleteOne({ id: req.params.id });
        if (result.deletedCount > 0) {
            res.status(204).send();
        }
        else {
            res.status(404).json({ message: "Contact not found" });
        }
    }
    catch (error) {
        console.error("[ERROR] Error deleting contact", error);
        res.status(500).json({ message: "Server Connection Error" });
    }
});
export default router;
