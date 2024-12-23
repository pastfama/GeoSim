import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/RBstyles.css';

function RandomBirth() {
  const [newborn, setNewborn] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const navigate = useNavigate(); // useNavigate hook for navigation

  // Log any uncaught errors to help with debugging
  useEffect(() => {
    const handleError = (error) => {
      console.error('Unhandled error:', error);
      setError('An unexpected error occurred. Please try again later.');
    };

    window.addEventListener('error', handleError);
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

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
      setNewborn({}); // Reset newborn data to clear the UI
  
      // First, make a request to drop the collection in the backend
      await axios.post('http://localhost:5000/api/person/drop-collection');
  
      // Then, create a new character
      const response = await axios.get('http://localhost:5000/api/person/create-character');
      console.log('API Response for Newborn:', response.data);
  
      const { uuid, firstName, lastName, sex, happiness, health, smarts, looks, age, hospitalName, father, mother, siblings } = response.data.person;
  
      const newbornData = {
        uuid, // Store the UUID here
        firstName,
        lastName,
        sex,
        happiness,
        health,
        smarts,
        looks,
        age: 0, // Set age to 0
        hospitalName,
        fatherUuid: father ? father.uuid : null,
        motherUuid: mother ? mother.uuid : null,
        siblings: siblings || [],
      };
  
      window.newbornData = newbornData; // Store globally if necessary
      setNewborn(newbornData); // Update state with the newborn data
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

  const loadParentData = async (parentUuid, relation) => {
    if (parentUuid) {
      try {
        const response = await axios.get(`http://localhost:5000/api/person/load-person/${parentUuid}`);
        console.log(`${relation} data:`, response.data);
        window.newbornData[`${relation}Name`] = `${response.data.firstName} ${response.data.lastName}`;
        setNewborn(prevState => ({ ...prevState, [`${relation}Name`]: `${response.data.firstName} ${response.data.lastName}` }));
      } catch (error) {
        console.error(`Error fetching ${relation} data:`, error);
      }
    }
  };

  const loadSiblingData = async (siblings) => {
    if (siblings && siblings.length > 0) {
      const siblingDetails = [];
      for (let sibling of siblings) {
        try {
          const response = await axios.get(`http://localhost:5000/api/person/load-person/${sibling.uuid}`);
          console.log('Sibling data:', response.data);
          siblingDetails.push({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            age: response.data.age,
          });
        } catch (error) {
          console.error('Error fetching sibling data:', error);
        }
      }
      window.newbornData.siblings = siblingDetails;
      setNewborn(prevState => ({ ...prevState, siblings: siblingDetails }));
    }
  };

  const handleAccept = async () => {
    try {
      // Send a POST request to save the game state (e.g., new character data)
      const response = await axios.post(`http://localhost:5000/api/person/save-game/${window.newbornData.uuid}`);
      console.log('Game saved:', response.data);
      
      // Once game is saved, navigate to main menu
      navigate('/main-menu');
    } catch (error) {
      console.error('Error saving the game:', error);
      setError('Error saving the game. Please try again later.');
    }
  };

  const handleNextClick = () => {
    console.log('Next button clicked');
    setLoading(true);
    setError(null);
    setNewborn({}); // Reset newborn data
    fetchNewborn(); // Re-fetch newborn data
  };

  useEffect(() => {
    fetchNewborn();
  }, []);

  useEffect(() => {
    if (mapLoaded && window.newbornData?.hospitalLatitude && window.newbornData?.hospitalLongitude) {
      console.log('Initializing map with coordinates:', window.newbornData.hospitalLatitude, window.newbornData.hospitalLongitude);

      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: {
          lat: window.newbornData.hospitalLatitude,
          lng: window.newbornData.hospitalLongitude,
        },
        zoom: 10,
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
  }, [mapLoaded, newborn]);

  return (
    <div className="random-birth-container">
      {loading ? (
        <p>Loading newborn's attributes...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="content-container">
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
            <div className="button-container">
              <button className="next-button" onClick={handleNextClick} style={{ backgroundColor: 'red' }}>Next</button>
              <button className="accept-button" onClick={handleAccept} style={{ backgroundColor: 'green' }}>Accept</button>
            </div>
          </div>
          <div className="right-block">
            <div id="map" style={{ height: '400px', width: '100%' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RandomBirth;
