const dotenv = require("dotenv");
const connectDB = require("./src/config/db"); // Import the database connection
const express = require("express"); // Ensure express is required
const cors = require("cors"); // Import the CORS middleware
const helmet = require("helmet"); // Import the helmet middleware for security headers
const app = express(); // Initialize express
const personRoutes = require("./src/routes/personRoutes"); // Import the person routes

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

// Use personRoutes for handling person-related routes
app.use("/api/person", personRoutes);

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
