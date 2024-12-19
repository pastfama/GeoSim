const express = require("express");
const router = express.Router();
const { getRandomHospital, getEventByStage, getStreetView } = require("../controllers/gameController");

router.get("/random-birth", getRandomHospital);
router.get("/event/:stage", getEventByStage);
router.get("/streetview", getStreetView); // Add this route

module.exports = router;
