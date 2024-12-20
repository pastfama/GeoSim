import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/styles.css';

function RandomBirth() {
  const [newborn, setNewborn] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);

  // Load the Google Maps API script
  useEffect(() => {
    if (!window.google && !mapsLoaded) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapsLoaded(true);
      script.onerror = () => console.error('Google Maps script failed to load');
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [mapsLoaded]);

  // Fetch a random person on mount
  useEffect(() => {
    const generateRandomBirth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/random-person');
        const { firstName, lastName, sex, happiness, health, smarts, looks, age, hospitalName, hospitalGeoData, father, mother, siblings } = response.data;

        const randomNewborn = {
          firstName,
          lastName,
          sex,
          happiness,
          health,
          smarts,
          looks,
          age,
          hospitalName,
          hospitalLatitude: hospitalGeoData.latitude,
          hospitalLongitude: hospitalGeoData.longitude,
          fatherName: `${father.firstName} ${father.lastName}`,
          motherName: `${mother.firstName} ${mother.lastName}`,
          siblings: siblings || [],
        };

        setNewborn(randomNewborn);
        setLoading(false);
      } catch (error) {
        setError('Error generating random birth. Please try again.');
        setLoading(false);
      }
    };

    generateRandomBirth();
  }, []);

  // Initialize the Google Map
  const initMap = () => {
    if (newborn.hospitalLatitude && newborn.hospitalLongitude && window.google) {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: 39.8283, lng: -98.5795 }, // Center of the US
        zoom: 3, // Zoom out more to show all of North America
      });

      new window.google.maps.Marker({
        position: { lat: newborn.hospitalLatitude, lng: newborn.hospitalLongitude },
        map,
        title: newborn.hospitalName,
      });
    }
  };

  useEffect(() => {
    if (mapsLoaded && newborn.hospitalLatitude && newborn.hospitalLongitude) {
      initMap();
    }
  }, [mapsLoaded, newborn]);

  const handleNext = () => {
    window.location.reload();
  };

  const handleAccept = async () => {
    try {
      await axios.post('http://localhost:5000/save-newborn', newborn);
      window.location.href = '/main-menu';
    } catch (error) {
      setError('Error saving newborn data. Please try again.');
    }
  };

  return (
    <div className="random-birth-container">
      {loading ? (
        <p>Loading newborn's attributes...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="content-container">
          {/* Left Block (Newborn Info) */}
          <div className="left-block">
            <h1>Newborn's Attributes</h1>
            <table className="newborn-table">
              <tbody>
                <tr><td><strong>Name:</strong></td><td>{newborn.firstName} {newborn.lastName}</td></tr>
                <tr><td><strong>Gender:</strong></td><td>{newborn.sex}</td></tr>
                <tr><td><strong>Age:</strong></td><td>{newborn.age}</td></tr>
                <tr><td><strong>Happiness:</strong></td><td>{newborn.happiness}</td></tr>
                <tr><td><strong>Health:</strong></td><td>{newborn.health}</td></tr>
                <tr><td><strong>Smarts:</strong></td><td>{newborn.smarts}</td></tr>
                <tr><td><strong>Looks:</strong></td><td>{newborn.looks}</td></tr>
                <tr><td><strong>Born at:</strong></td><td>{newborn.hospitalName}</td></tr>
              </tbody>
            </table>
            <h3>Parents</h3>
            <p><strong>Father:</strong> {newborn.fatherName}</p>
            <p><strong>Mother:</strong> {newborn.motherName}</p>

            {newborn.siblings.length > 0 && (
              <div>
                <h3>Siblings</h3>
                {newborn.siblings.map((sibling, index) => (
                  <p key={index}>{sibling.firstName} {sibling.lastName} (Age: {sibling.age})</p>
                ))}
              </div>
            )}

            {/* Next Button (Red) */}
            <div className="button-container">
              <button className="next-button" onClick={handleNext}>Next</button>
            </div>
          </div>

          {/* Right Block (Google Map) */}
          <div className="right-block">
            <div id="map" style={{ height: '100%', width: '100%' }}></div>
            {/* Accept Button (Green) */}
            <div className="button-container">
              <button className="accept-button" onClick={handleAccept}>Accept</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RandomBirth;
