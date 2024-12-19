import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch data from backend
    fetch('http://localhost:5000/')
      .then(response => response.text())
      .then(data => setMessage(data));

    // Load the Google Maps API if it's not already loaded
    if (!document.getElementById("google-maps-script")) {
      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="App">
      <Helmet>
        <title>GeoSim Game</title>
      </Helmet>
      <h1>{message}</h1>

      {/* Example of how to display a map */}
      <div id="map" style={{ width: '100%', height: '500px' }}></div>

      {/* Add more content here, such as buttons or interactions */}
    </div>
  );
}

export default App;
