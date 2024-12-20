const express = require("express");
const router = express.Router();
const Person = require("../models/person");
const PersonModel = require("../models/personSchema"); // Assuming you have the Person schema defined

// Route to create a random person (already present)
router.post("/create-random", async (req, res) => {
  try {
    const randomPerson = Person.createRandomPerson();
    await randomPerson.saveToDatabase();
    res.status(201).json({ message: "Random person created successfully!", person: randomPerson });
  } catch (error) {
    res.status(500).json({ error: "Failed to create random person." });
  }
});

// Route to retrieve all persons (already present)
router.get("/", async (req, res) => {
  try {
    const persons = await PersonModel.find();
    res.status(200).json(persons);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve persons." });
  }
});

// New route to save newborn data to MongoDB
router.post("/save-newborn", async (req, res) => {
  try {
    // Receive the newborn data from the request body
    const newbornData = req.body;

    // Create a new Person instance with the newborn data
    const newborn = new PersonModel({
      firstName: newbornData.firstName,
      lastName: newbornData.lastName,
      sex: newbornData.sex,
      happiness: newbornData.happiness,
      health: newbornData.health,
      smarts: newbornData.smarts,
      looks: newbornData.looks,
      age: newbornData.age,
      hospitalName: newbornData.hospitalName,
      hospitalStreetViewUrl: newbornData.hospitalStreetViewUrl,
      fatherName: newbornData.fatherName,
      motherName: newbornData.motherName,
      siblings: newbornData.siblings,
    });

    // Save the newborn data to MongoDB
    await newborn.save();

    // Send a success response
    res.status(200).json({ message: "Newborn saved successfully!", newborn });
  } catch (error) {
    // Handle any errors and send an error response
    res.status(500).json({ error: "Error saving newborn data" });
  }
});

module.exports = router;
