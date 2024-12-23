const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Middleware to validate the ID format (for validating the UUID)
const validateId = (req, res, next) => {
  const personId = req.params.id;
  console.log(`Validating ID: ${personId}`);
  
  if (!mongoose.Types.ObjectId.isValid(personId)) {
    console.error(`Invalid ID format: ${personId}`);
    return res.status(400).json({ error: "Invalid ID format." });
  }

  next(); // Proceed if the ID is valid
};

// Route to create a new character (game save)
router.get("/create-character", async (req, res) => {
  console.log('Received request to create a new character');
  
  try {
    await personController.createCharacter(req, res);
  } catch (error) {
    console.error('Error in create-character route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to load a person (load game)
router.get("/load-person/:id", validateId, async (req, res) => {
  const personId = req.params.id;
  console.log(`Received request to load game for person with ID: ${personId}`);
  
  try {
    await personController.loadPerson(req, res);
  } catch (error) {
    console.error('Error in load-person route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to save a character’s state (save game)
router.put("/save-person/:id", validateId, async (req, res) => {
  const personId = req.params.id;
  console.log(`Received request to save game for person with ID: ${personId}`);
  
  try {
    // Assuming personController has a method to save a person's game state
    await personController.savePerson(req, res);
  } catch (error) {
    console.error('Error in save-person route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to save character data to a save game collection (UUID-based)
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const personController = require('./personController'); // Ensure correct path to personController

// Define a proper SaveGame Schema for consistent data storage
const saveGameSchema = new mongoose.Schema({
  uuid: { type: String, required: true },
  characterData: { type: Object, required: true },
  timestamp: { type: Date, default: Date.now },
});

const SaveGame = mongoose.model('SaveGame', saveGameSchema);

router.post('/save-game/:uuid', async (req, res) => {
  const { uuid } = req.params;
  console.log(`Received request to save game for character with UUID: ${uuid}`);

  try {
    // Retrieve character data by UUID
    const characterData = await personController.getCharacterDataByUuid(uuid);

    if (!characterData) {
      return res.status(404).json({ error: 'Character not found.' });
    }

    // Create a new SaveGame document
    const saveGameData = new SaveGame({
      uuid: uuid,
      characterData: characterData, // Store the full character data
    });

    // Save the new save game data to the database
    await saveGameData.save();
    console.log(`Game saved for character with UUID: ${uuid}`);
    
    res.status(200).json({ message: 'Game saved successfully.' });
  } catch (error) {
    console.error('Error in save-game route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to load the game from the save file
router.get("/load-game/:uuid", async (req, res) => {
  const { uuid } = req.params;
  console.log(`Received request to load game for UUID: ${uuid}`);

  try {
    // Assume SaveGame collection is where game saves are stored
    const SaveGame = mongoose.model('SaveGame');
    
    const savedGame = await SaveGame.findOne({ uuid });

    if (!savedGame) {
      return res.status(404).json({ error: 'Save game not found.' });
    }

    res.status(200).json(savedGame.characterData); // Return the character data from the save game
  } catch (error) {
    console.error('Error in load-game route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
