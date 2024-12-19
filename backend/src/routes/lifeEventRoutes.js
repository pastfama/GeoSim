const express = require("express");
const router = express.Router();

// Mock life events data
const lifeEvents = [
    { id: 1, description: "You made your first friend in kindergarten." },
    { id: 2, description: "You joined the school's soccer team." },
    { id: 3, description: "Your family moved to a new city." },
];

// Endpoint to get all life events
router.get("/", (req, res) => {
    res.json(lifeEvents);
});

// Export the router
module.exports = router;
