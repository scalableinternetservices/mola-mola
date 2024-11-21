// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
// import Groups from './pages/Groups';
// import Events from './pages/Events';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/groups" element={<Groups />} /> */}
        {/* <Route path="/events" element={<Events />} /> */}
        {/* Add more routes as needed */}
        {/* <Route path="/events/:id" element={<EventDetails />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
