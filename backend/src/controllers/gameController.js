const hospitals = require("../../config/hospitals.json");
const gameEvents = require("../../config/gameEvents.json");

// Get a random hospital
const getRandomHospital = (req, res) => {
  const randomIndex = Math.floor(Math.random() * hospitals.length);
  const hospital = hospitals[randomIndex];
  res.json({
    hospital: {
      name: hospital.name,
      city: hospital.city,
      state: hospital.state,
      latitude: hospital.latitude,
      longitude: hospital.longitude,
    },
  });
};

// Create a new game state
exports.createGameState = (req, res) => {
    const { playerName, birthLocation } = req.body;
    const gameId = Date.now().toString(); // Generate a unique gameId using timestamp
  
    const newGameState = {
      gameId,
      playerName,
      birthLocation,
      characteristics: { strength: 10, intelligence: 10, charisma: 10 },
      stage: "childhood"
    };
  
    gameStates[gameId] = newGameState;
    res.status(201).json(newGameState);
  };
  
  // Get an existing game state by gameId
  exports.getGameState = (req, res) => {
    const { gameId } = req.params;
    const gameState = gameStates[gameId];
  
    if (gameState) {
      res.json(gameState);
    } else {
      res.status(404).json({ message: "Game state not found" });
    }
  };

// Get an event by stage
const getEventByStage = (req, res) => {
  const { stage } = req.params;
  const events = gameEvents[stage];

  if (!events) {
    return res.status(400).json({ error: "Invalid stage" });
  }

  const randomIndex = Math.floor(Math.random() * events.length);
  const event = events[randomIndex];
  res.json({ event });
};

const getStreetView = (req, res) => {
  const { latitude, longitude } = req.query;
  const apiKey = process.env.GOOGLE_API_KEY; // Use environment variable for API key

  if (!latitude || !longitude) {
    return res.status(400).json({ message: "Latitude and Longitude are required." });
  }

  const streetViewUrl = `https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${latitude},${longitude}`;
  res.json({ streetViewUrl });
};

module.exports = {
  getRandomHospital,
  getEventByStage,
  getStreetView, // Export the new function
};