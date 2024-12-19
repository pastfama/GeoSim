import React from "react";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();

  const handleNewGame = () => {
    navigate("/random-birth"); // Navigate to the random birth page
  };

  const handleLoadGame = () => {
    // Load saved game data logic (e.g., fetch from API or localStorage)
    alert("Load Game feature is not implemented yet!");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to GeoSim!</h1>
      <button style={styles.button} onClick={handleNewGame}>
        Start New Game
      </button>
      <button style={styles.button} onClick={handleLoadGame}>
        Load Saved Game
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f4f4f9",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1rem",
    color: "#333",
  },
  button: {
    fontSize: "1.2rem",
    margin: "0.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Menu;
