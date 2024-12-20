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

  // Fetch a random person on mount
  useEffect(() => {
    const fetchNewborn = async () => {
      try {
        const response = await axios.get('http://localhost:5000/random-person');
        const {
          firstName, lastName, sex, happiness, health, smarts, looks, age,
          hospitalName, hospitalGeoData, father, mother, siblings,
        } = response.data;

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
          hospitalLatitude: hospitalGeoData.latitude,
          hospitalLongitude: hospitalGeoData.longitude,
          fatherName: `${father.firstName} ${father.lastName}`,
          motherName: `${mother.firstName} ${mother.lastName}`,
          siblings: siblings || [],
        });
        setLoading(false);
      } catch (error) {
        setError('Error fetching newborn data. Please try again.');
        setLoading(false);
      }
    };

    fetchNewborn();
  }, []);

  // Initialize the Google Map
  useEffect(() => {
    if (mapsLoaded && newborn.hospitalLatitude && newborn.hospitalLongitude) {
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
  }, [mapsLoaded, newborn]);

  // Handle Next button click (reloads the page)
  const handleNext = () => {
    window.location.reload();
  };

  // Handle Accept button click (saves newborn data and redirects)
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
              <button className="next-button" onClick={handleNext}>Next</button>
            </div>
          </div>

          {/* Right Block (Google Map) */}
          <div className="right-block">
            <div id="map" style={{ height: '200px', width: '100%' }}></div>
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
