const express = require("express");
const axios = require("axios");
const Person = require("../models/person"); // Import the Person class
const router = express.Router();

// Helper function to get hospital data (latitude and longitude)
async function getHospitalGeoData(hospitalName) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY; // Fetch from backend environment
  const address = encodeURIComponent(hospitalName); // Ensure the name is encoded for use in a URL
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    
    // Check if results exist
    if (!response.data.results || response.data.results.length === 0) {
      throw new Error("No geodata found for the given hospital name.");
    }
    
    const result = response.data.results[0]; // Take the first result from the geocode response
    const location = result.geometry.location;

    // Return latitude and longitude
    return {
      latitude: location.lat,
      longitude: location.lng
    };
  } catch (error) {
    console.error("Error fetching hospital geo data:", error);
    throw new Error("Could not fetch hospital geo data. Please check the hospital name.");
  }
}

// Define the /random-person route to generate a random person
router.get("/random-person", async (req, res) => {
  try {
    // Generate a random person using the static method from the Person class
    const person = Person.createRandomPerson();

    // Get the hospital geo data (latitude and longitude) for the hospital
    const hospitalGeoData = await getHospitalGeoData(person.hospitalName);

    // Include random siblings in the response
    const siblings = person.siblings.length > 0 ? person.siblings.map(sibling => ({
      firstName: sibling.firstName,
      lastName: sibling.lastName,
      age: sibling.age, // Include the sibling's age
      sex: sibling.sex,
    })) : null;

    // Send the random person's data in the response, including hospital geo data
    res.json({
      firstName: person.firstName,
      lastName: person.lastName,
      sex: person.sex,
      happiness: person.happiness,
      health: person.health,
      smarts: person.smarts,
      looks: person.looks,
      age: person.age,
      hospitalName: person.hospitalName,
      hospitalGeoData: hospitalGeoData, // Send latitude and longitude instead of StreetView URL
      father: { firstName: person.father.firstName, lastName: person.father.lastName },
      mother: { firstName: person.mother.firstName, lastName: person.mother.lastName },
      siblings: siblings,  // Include siblings if any
      otherRelatives: person.otherRelatives // Other relatives
    });
  } catch (error) {
    console.error("Error generating random person:", error);
    res.status(500).send("Error generating random person: " + error.message);
  }
});

module.exports = router;
