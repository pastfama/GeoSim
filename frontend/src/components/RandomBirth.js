import React, { useState, useEffect } from "react";
import axios from "axios";

const RandomBirth = () => {
  const [hospital, setHospital] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch a random hospital from the backend
    const fetchHospital = async () => {
      try {
        const response = await axios.get("/api/game/random-birth");
        setHospital(response.data.hospital);
      } catch (err) {
        setError("Failed to fetch hospital data. Please try again.");
        console.error(err);
      }
    };

    fetchHospital();
  }, []);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!hospital) {
    return <div>Loading...</div>;
  }

  const { name, city, state, latitude, longitude } = hospital;

  // Google Street View Embed URL
  const streetViewUrl = `https://www.google.com/maps/embed/v1/streetview?key=${process.env.REACT_APP_GOOGLE_API_KEY}&location=${latitude},${longitude}&heading=210&pitch=10&fov=75`;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Welcome to the World!</h1>
      <h2>You were born at:</h2>
      <p>
        <strong>{name}</strong>
        <br />
        {city}, {state}
      </p>
      <div style={{ margin: "20px 0" }}>
        <iframe
          title="Google Street View"
          src={streetViewUrl}
          width="600"
          height="400"
          style={{ border: "0" }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
      <button
        onClick={() => alert("Continue to the next stage!")}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Continue
      </button>
    </div>
  );
};

export default RandomBirth;
