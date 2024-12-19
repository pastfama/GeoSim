import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Menu from './Menu'; // Import the Menu component
import RandomBirth from './components/RandomBirth'; // Updated path to RandomBirth component
import App from './App'; // Keep this if App is still being used for general content

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Define routes for the application */}
        <Route path="/" element={<Menu />} /> {/* Menu as the default route */}
        <Route path="/random-birth" element={<RandomBirth />} /> {/* RandomBirth route */}
        <Route path="/app" element={<App />} /> {/* Example route for App */}
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
