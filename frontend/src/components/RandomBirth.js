import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RandomBirth() {
  const [newborn, setNewborn] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to simulate random birth attributes
    const generateRandomBirth = async () => {
      try {
        // Fetch random person data from the backend (which now includes hospital and family details)
        const response = await axios.get('http://localhost:5000/random-person');
        const { 
          firstName, lastName, sex, happiness, health, smarts, looks, age, 
          hospitalName, hospitalStreetViewUrl, father, mother, siblings
        } = response.data;

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
          hospitalStreetViewUrl,
          fatherName: `${father.firstName} ${father.lastName}`,
          motherName: `${mother.firstName} ${mother.lastName}`,
          siblings: siblings || [],  // Default to an empty array if siblings are null
        };

        setNewborn(randomNewborn);
        setLoading(false);
      } catch (error) {
        setError('Error generating random birth. Please try again.');
        setLoading(false);
      }
    };

    generateRandomBirth();
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  return (
    <div>
      {loading ? (
        <p>Loading newborn's attributes...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div>
          <h1>Newborn's Attributes</h1>
          <p>Name: {newborn.firstName} {newborn.lastName}</p>
          <p>Gender: {newborn.sex}</p>
          <p>Age: {newborn.age}</p>
          <p>Happiness: {newborn.happiness}</p>
          <p>Health: {newborn.health}</p>
          <p>Smarts: {newborn.smarts}</p>
          <p>Looks: {newborn.looks}</p>
          
          {/* Display Hospital Info */}
          <h3>Born at: {newborn.hospitalName}</h3>
          <a href={newborn.hospitalStreetViewUrl} target="_blank" rel="noopener noreferrer">
            View Hospital Street View
          </a>

          {/* Display Parents */}
          <h3>Parents:</h3>
          <p>Father: {newborn.fatherName}</p>
          <p>Mother: {newborn.motherName}</p>

          {/* Display Siblings */}
          {newborn.siblings && newborn.siblings.length > 0 ? (
            <div>
              <h3>Siblings:</h3>
              {newborn.siblings.map((sibling, index) => (
                <p key={index}>
                  {sibling.firstName} {sibling.lastName} (Age: {sibling.age})
                </p>
              ))}
            </div>
          ) : (
            <p>No sibling data is available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default RandomBirth;
