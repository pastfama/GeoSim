const express = require("express");
const router = express.Router();
const personController = require("../controllers/personController");
const mongoose = require("mongoose");

// Middleware to validate the ID format
const validateId = (req, res, next) => {
  const personId = req.params.id;
  console.log(`Validating ID: ${personId}`); // Debugging: log the ID being validated
  
  if (!mongoose.Types.ObjectId.isValid(personId)) {
    console.error(`Invalid ID format: ${personId}`); // Debugging: log invalid ID
    return res.status(400).json({ error: "Invalid ID format." });
  }

  next(); // If the ID is valid, proceed to the next middleware/controller function
};

// Route to create a new character
router.get("/create-character", async (req, res) => {
  console.log('Received request to create a new character'); // Debugging: log the route access

  try {
    await personController.createCharacter(req, res);
  } catch (error) {
    console.error('Error in create-character route:', error); // Debugging: log any error in the route
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to load a person by ID
router.get("/load-person/:id", validateId, async (req, res) => {
  const personId = req.params.id;
  console.log(`Received request to load person with ID: ${personId}`); // Debugging: log the request and ID
  
  try {
    await personController.loadPerson(req, res);
  } catch (error) {
    console.error('Error in load-person route:', error); // Debugging: log any error in the route
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to update/save a person by ID
router.put("/save-person/:id", validateId, async (req, res) => {
  const personId = req.params.id;
  console.log(`Received request to update person with ID: ${personId}`); // Debugging: log the request and ID
  
  try {
    await personController.savePerson(req, res);
  } catch (error) {
    console.error('Error in save-person route:', error); // Debugging: log any error in the route
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
