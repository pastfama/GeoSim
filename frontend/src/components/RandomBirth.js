import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/styles.css';  // Adjust the path if your folder structure is different


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
          hospitalName, hospitalLongitude, hospitalLatitude, father, mother, siblings
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
          hospitalLongitude,
          hospitalLatitude,
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
    <div className="container">
      {loading ? (
        <p>Loading newborn's attributes...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div className="content">
          <div className="person-info">
            <h1>Newborn's Attributes</h1>
            <p><strong>Name:</strong> {newborn.firstName} {newborn.lastName}</p>
            <p><strong>Gender:</strong> {newborn.sex}</p>
            <p><strong>Age:</strong> {newborn.age}</p>
            <p><strong>Happiness:</strong> {newborn.happiness}</p>
            <p><strong>Health:</strong> {newborn.health}</p>
            <p><strong>Smarts:</strong> {newborn.smarts}</p>
            <p><strong>Looks:</strong> {newborn.looks}</p>

            {/* Display Hospital Info */}
            <h3>Born at: {newborn.hospitalName}</h3>

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

          <div className="hospital-map">
            <h3>Explore Hospital</h3>
            <iframe 
              width="600" 
              height="400" 
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCY7my4zQaU1_qJEAS8cZpqhnfrsToOvPg&q=${newborn.hospitalLatitude},${newborn.hospitalLongitude}`} 
              allowFullScreen>
            </iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default RandomBirth;
