// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Account from './pages/Account'
// import Groups from './pages/Groups';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import NotFound from './pages/NotFound';
import FollowPage from './pages/FollowPage';
import Notifications from './pages/Notifications';
import PrivateRoute from './components/PrivateRoute';


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

      <Route path="/account" element={<Account />} />
      <Route path="/followed" element={<FollowPage />} />
      <Route path="/notifications" element={<Notifications />} />

        {/* <Route path="/groups" element={<Groups />} /> */}
        <Route path="/events" element={<Events />} />
        {/* Add more routes as needed */}
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/events/create" element={<PrivateRoute><CreateEvent /></PrivateRoute>} />
        {/* Everything else goes here */}
        <Route path="*" element={<NotFound />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
