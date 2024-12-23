const Person = require("../models/person"); // Importing the Person model

// Create and save a new character
exports.createCharacter = async (req, res) => {
  try {
    // Create and save a random person
    const savedPerson = await Person.createRandomPerson();  // Static method is being called here
    
    res.status(201).json({
      message: 'Character created and saved successfully!',
      person: savedPerson,
    });
  } catch (error) {
    console.error('Error in createCharacter:', error);
    res.status(500).json({
      error: 'Failed to create character.',
      errorMessage: error.message,
    });
  }
};

// Load a person by ID
exports.loadPerson = async (req, res) => {
  try {
    const personId = req.params.id;
    const person = await Person.findById(personId);

    if (!person) {
      return res.status(404).json({ message: 'Person not found.' });
    }

    res.status(200).json(person);
  } catch (error) {
    console.error("Error in loadPerson:", error);
    res.status(500).json({ error: 'Failed to load person.' });
  }
};

// Update a person by ID
exports.savePerson = async (req, res) => {
  try {
    const personId = req.params.id;
    const updatedData = req.body;

    const updatedPerson = await Person.findByIdAndUpdate(personId, updatedData, { new: true });

    if (!updatedPerson) {
      return res.status(404).json({ message: 'Person not found for update.' });
    }

    res.status(200).json({
      message: 'Person updated successfully!',
      person: updatedPerson,
    });
  } catch (error) {
    console.error("Error in savePerson:", error);
    res.status(500).json({ error: 'Failed to update person.' });
  }
};
