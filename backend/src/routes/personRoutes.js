const express = require("express");
const router = express.Router();
const personController = require("../controllers/personController");

// Route to create a new character
router.get("/create-character", personController.createCharacter);

// Route to load a person by ID
router.get("/load-person/:id", personController.loadPerson);

// Route to update a person
router.put("/save-person/:id", personController.savePerson);

module.exports = router;
