const dotenv = require("dotenv");
const connectDB = require("./src/db"); // Import the database connection
const app = require("./src/app"); // Import the Express app

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
