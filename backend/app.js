const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const personRoutes = require("./src/routes/personRoutes");

dotenv.config();

connectDB(); // Connect to MongoDB

const app = express();
app.use(express.json()); // Middleware to parse JSON

// API Routes
app.use("/api/person", personRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
