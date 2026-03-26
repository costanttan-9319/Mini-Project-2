import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import CSS files for styling
import './index.css'; // Global foundation
import './App.css';   // Layout shell

// Import Components
import Navbar from './Components/Navbar';

// Import Pages
import Home from './Pages/Home';
import Login from './Pages/Login';
import TopPicks from './Pages/TopPicks';

function App() {
  return (
    <Router>
      {/* 1. Global Container: Defined in App.css */}
      <div className="app-container">
        
        <Navbar />

        {/* 2. Content Area: Keeps everything centered and padded */}
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            {/* Path updated to match Navbar link exactly */}
            <Route path="/toppicks" element={<TopPicks />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;