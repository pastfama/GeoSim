import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RandomBirth from "./components/RandomBirth"; // Adjust path as needed

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Welcome to GeoSim!</div>} />
        <Route path="/random-birth" element={<RandomBirth />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
};

export default App;
