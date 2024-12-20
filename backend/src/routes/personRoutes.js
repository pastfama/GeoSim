const express = require("express");
const router = express.Router();
const Person = require("../models/person");

// Route to create a random person
router.post("/create-random", async (req, res) => {
  try {
    const randomPerson = Person.createRandomPerson();
    await randomPerson.saveToDatabase();
    res.status(201).json({ message: "Random person created successfully!", person: randomPerson });
  } catch (error) {
    res.status(500).json({ error: "Failed to create random person." });
  }
});

// Route to retrieve all persons (assuming a PersonModel is defined)
router.get("/", async (req, res) => {
  try {
    const PersonModel = require("../models/personSchema");
    const persons = await PersonModel.find();
    res.status(200).json(persons);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve persons." });
  }
});

module.exports = router;
