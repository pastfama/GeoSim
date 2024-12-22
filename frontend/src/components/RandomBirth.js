import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/styles.css';

function RandomBirth() {
  const [newborn, setNewborn] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false); // Track if map is loaded

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.id = 'google-maps-script';
      script.onload = () => {
        console.log('Google Maps script loaded successfully');
        setMapLoaded(true);
      };
      script.onerror = () => {
        console.error('Error loading Google Maps script');
        setError('Error loading Google Maps. Please try again.');
      };
      document.head.appendChild(script);
    }
  }, []);

  const fetchNewborn = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/person/create-character');
      console.log('API Response:', response.data); // Check the API response

      const { firstName, lastName, sex, happiness, health, smarts, looks, age, hospitalName, father, mother, siblings } = response.data.person;

      const newbornData = {
        firstName,
        lastName,
        sex,
        happiness,
        health,
        smarts,
        looks,
        age: 0, // Set age to 0
        hospitalName,
        fatherName: father ? `${father.firstName} ${father.lastName}` : 'Unknown',
        motherName: mother ? `${mother.firstName} ${mother.lastName}` : 'Unknown',
        siblings: siblings || [],
      };

      window.newbornData = newbornData;

      // Get coordinates for the hospital
      await geocodeHospital(hospitalName);

      setNewborn(newbornData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching newborn data. Please try again.');
      setLoading(false);
    }
  };

  const geocodeHospital = async (hospitalName) => {
    try {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(hospitalName)}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
      const geocodeResponse = await axios.get(geocodeUrl);
      const location = geocodeResponse.data.results[0]?.geometry?.location;

      if (location) {
        console.log('Hospital coordinates:', location.lat, location.lng);
        window.newbornData.hospitalLatitude = location.lat;
        window.newbornData.hospitalLongitude = location.lng;
      } else {
        console.error('Coordinates not found for hospital:', hospitalName);
      }
    } catch (error) {
      console.error('Error fetching hospital coordinates:', error);
    }
  };

  useEffect(() => {
    fetchNewborn(); // Fetch newborn data when component mounts
  }, []);

  useEffect(() => {
    if (mapLoaded && window.newbornData?.hospitalLatitude && window.newbornData?.hospitalLongitude) {
      console.log('Initializing map with coordinates:', window.newbornData.hospitalLatitude, window.newbornData.hospitalLongitude);
      
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: {
          lat: window.newbornData.hospitalLatitude,
          lng: window.newbornData.hospitalLongitude,
        },
        zoom: 10, // Zoom into the hospital location
      });

      new window.google.maps.Marker({
        position: {
          lat: window.newbornData.hospitalLatitude,
          lng: window.newbornData.hospitalLongitude,
        },
        map,
        title: window.newbornData.hospitalName,
      });
    }
  }, [mapLoaded, newborn]); // Trigger map initialization once coordinates are ready

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
            <div id="map" style={{ height: '400px', width: '100%' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RandomBirth;
