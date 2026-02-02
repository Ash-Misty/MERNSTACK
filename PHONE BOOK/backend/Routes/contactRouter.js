const express = require('express');
const router = express.Router();
const Contact = require('../Models/Contact');

// ADD CONTACT
router.post('/contact', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        const saved = await contact.save();
        res.json(saved);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET ALL CONTACTS
router.get('/', async (req, res) => {
    const contacts = await Contact.find();
    res.json(contacts);
});

// GET CONTACT BY ID
router.get('/:id', async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    res.json(contact);
});

// UPDATE CONTACT
router.put('/update_contact/:id', async (req, res) => {
    const updated = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(updated);
});

// DELETE CONTACT
router.delete('/delete_contact/:id', async (req, res) => {
    await Contact.findByIdAndDelete(req.params.id);
    res.status(202).send("Contact Deleted Successfully");
});

module.exports = router;
