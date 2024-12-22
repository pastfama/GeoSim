const Person = require('../models/person'); // Import the Person model

// Route to create and save a new character (newborn)
exports.createCharacter = async (req, res) => {
  try {
    // Generate a random person (character)
    const person = new Person({
      firstName: "John", // You can customize this as needed
      lastName: "Doe",   // Customize as needed
      sex: "Male", // or "Female"
      hospitalName: "Example Hospital", // You can replace with a random hospital name
    });

    // Save the person to the database
    const savedPerson = await person.save();

    res.status(201).json({
      message: 'Character created and saved successfully!',
      person: savedPerson,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create character.' });
  }
};

// Route to load a person by ID
exports.loadPerson = async (req, res) => {
  try {
    const personId = req.params.id;
    const person = await Person.findById(personId)
      .populate('father mother siblings'); // Populate relationships with other people

    if (!person) {
      return res.status(404).json({ message: 'Person not found.' });
    }

    res.status(200).json(person);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load person.' });
  }
};

// Route to save a person (if any updates are needed)
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
    res.status(500).json({ error: 'Failed to update person.' });
  }
};
