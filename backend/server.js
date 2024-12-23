const dotenv = require("dotenv");
const connectDB = require("./config/db"); // Import the database connection
const express = require("express"); // Ensure express is required
const cors = require("cors"); // Import the CORS middleware
const helmet = require("helmet"); // Import the helmet middleware for security headers
const app = express(); // Initialize express
const personRoutes = require("./src/routes/personRoutes"); // Import the person routes
const mongoose = require("mongoose"); // Import mongoose for MongoDB interaction

// Load environment variables
dotenv.config();

// Debug: Log environment variables
console.log("Environment Variables Loaded:", process.env);

// Use CORS middleware (this should be before defining routes)
app.use(cors({
  origin: "http://localhost:3000", // React app is running here
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow common methods
  credentials: true, // Enable cookies if needed
}));

// Debug: Log that CORS middleware is being used
console.log("CORS Middleware Enabled");

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

// Debug: Log that helmet middleware is being used
console.log("Helmet Middleware Enabled");

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Use personRoutes for handling person-related routes
app.use("/api/person", personRoutes);

// Debug: Log that person routes are being used
console.log("Person Routes Middleware Enabled");

// Route to drop the collection
app.post('/api/person/drop-collection', async (req, res) => {
  try {
    const collection = mongoose.connection.collection('people');  // Replace with your actual collection name
    await collection.drop();
    console.log('Collection dropped successfully');
    res.status(200).send('Collection dropped successfully.');
  } catch (error) {
    console.error('Error dropping collection:', error);
    res.status(500).send('Error dropping collection.');
  }
});

// Debug: Log when the server starts
console.log(`Server is starting...`);

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

