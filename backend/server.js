const dotenv = require("dotenv");
const connectDB = require("./src/config/db"); // Import the database connection
const express = require("express"); // Ensure express is required
const cors = require("cors"); // Import the CORS middleware
const helmet = require("helmet"); // Import the helmet middleware for security headers
const app = express(); // Initialize express
const Person = require("./src/models/person"); // Import the Person class

// Load environment variables
dotenv.config();

// Use CORS middleware (this should be before defining routes)
app.use(cors({
  origin: "http://localhost:3000", // React app is running here
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow common methods
  credentials: true, // Enable cookies if needed
}));

// Use helmet middleware for security headers, including CSP
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "default-src": ["'self'"], // Allow loading resources only from the same origin
      "script-src": ["'self'", "'unsafe-inline'"], // Allow inline scripts
      "img-src": ["'self'", "http://localhost:5000"], // Allow images from localhost
      "style-src": ["'self'", "'unsafe-inline'"], // Allow inline styles
      "connect-src": ["'self'", "http://localhost:5000"], // Allow connections to the backend
      "font-src": ["'self'"],
      "frame-src": ["'self'"],
      // Add other directives as necessary based on what you're trying to allow
    },
  })
);

// Connect to MongoDB
connectDB();

// Define the /random-person route to generate a random person
app.get("/random-person", (req, res) => {
  try {
    // Generate a random person using the static method from the Person class
    const person = Person.createRandomPerson();

    // Send the random person's data in the response
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
      hospitalStreetViewUrl: person.hospitalStreetViewUrl,
      father: { firstName: person.father.firstName, lastName: person.father.lastName },
      mother: { firstName: person.mother.firstName, lastName: person.mother.lastName }
    });
  } catch (error) {
    console.error("Error generating random person:", error);
    res.status(500).send("Error generating random person");
  }
});

// Define the /random-location route (if still needed)
app.get("/random-location", (req, res) => {
  res.json({ message: "Random location generated!" });
});

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
