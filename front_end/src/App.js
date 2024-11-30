// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Only import Router here
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Account from './pages/Account';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import NotFound from './pages/NotFound';
import Notifications from './pages/Notifications';
import PrivateRoute from './components/PrivateRoute';
import EditEvent from './pages/EditEvent';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/account" element={<Account />} />
      <Route path="/notifications" element={<Notifications />} />

        {/* <Route path="/groups" element={<Groups />} /> */}
        <Route path="/events" element={<Events />} />
        {/* Add more routes as needed */}
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/events/create" element={<PrivateRoute><CreateEvent /></PrivateRoute>} />
        <Route path="/events/:id/edit" element={<EditEvent />} />

        {/* Everything else goes here */}
        <Route path="*" element={<NotFound />} /> 
      </Routes>
    </Router>
  );
}

export default App;
