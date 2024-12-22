import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/styles.css';

function RandomBirth() {
  const [newborn, setNewborn] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);

  // Define the initMap function
  const initMap = () => {
    if (newborn.hospitalLatitude && newborn.hospitalLongitude) {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: 39.8283, lng: -98.5795 }, // Center of the USA
        zoom: 3, // Zoom out to show all of North America
      });

      new window.google.maps.Marker({
        position: { lat: newborn.hospitalLatitude, lng: newborn.hospitalLongitude },
        map,
        title: newborn.hospitalName,
      });
    }
  };

  // Load the Google Maps API script
  useEffect(() => {
    if (!window.google) {
      if (!document.querySelector('#google-maps-script')) {
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&callback=initMap&loading=async`;
        script.async = true;
        script.defer = true;

        script.onload = () => setMapsLoaded(true);
        script.onerror = () => {
          console.error('Google Maps script failed to load');
          setError('Error loading Google Maps. Please try again.');
        };

        document.head.appendChild(script);
      } else {
        setMapsLoaded(true);
      }
    } else {
      setMapsLoaded(true);
    }
  }, []);

  // Fetch a random person and create the character on mount
  const fetchNewborn = async () => {
    try {
      setLoading(true);
      // Fetch the newborn's details from the backend API
      const response = await axios.get('http://localhost:5000/api/person/create-character');
      
      console.log(response.data);  // Check the API response

      const { firstName, lastName, sex, happiness, health, smarts, looks, age, hospitalName, hospitalGeoData, father, mother, siblings } = response.data.person;

      // Add checks to ensure values are not undefined
      setNewborn({
        firstName,
        lastName,
        sex,
        happiness,
        health,
        smarts,
        looks,
        age,
        hospitalName,
        hospitalLatitude: hospitalGeoData ? hospitalGeoData.latitude : null,
        hospitalLongitude: hospitalGeoData ? hospitalGeoData.longitude : null,
        fatherName: father ? `${father.firstName} ${father.lastName}` : 'Unknown',
        motherName: mother ? `${mother.firstName} ${mother.lastName}` : 'Unknown',
        siblings: siblings || [],
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data from API:", error);  // Log the full error
      setError('Error fetching newborn data. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewborn(); // Fetch a newborn when the component mounts
  }, []);

  // Initialize the Google Map after data is loaded
  useEffect(() => {
    if (mapsLoaded && newborn.hospitalLatitude && newborn.hospitalLongitude) {
      initMap();
    }
  }, [mapsLoaded, newborn]);

  return (
    <div className="random-birth-container">
      {loading ? (
        <p>Loading newborn's attributes...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="content-container">
          {/* Left Block (Newborn Data) */}
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
            <div className="button-container">
              <button className="next-button" onClick={fetchNewborn}>Next</button>
            </div>
          </div>

          {/* Right Block (Google Map) */}
          <div className="right-block">
            <div id="map" style={{ height: '200px', width: '100%' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RandomBirth;
