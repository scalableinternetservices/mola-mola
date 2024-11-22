// src/components/EventCard.jsx
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { EventsContext } from '../context/EventsContext';
import { AuthContext } from '../context/AuthContext';

//problem: the toggle RSVP logic doesn't work properly on the EventCard component
function EventCard({ event }) {
    const { user } = useContext(AuthContext);
    const { toggleRSVP } = useContext(EventsContext);
    const isRSVPed = event.rsvps.includes(user?.id);
  
    const handleRSVP = () => {
      if (user) {
        toggleRSVP(event.id, user.id);
      } else {
        alert('Please log in to RSVP.');
      }
    };
  
    return (
      <div className="mb-6 bg-white shadow-md rounded-md overflow-hidden">
        <Link to={`/events/${event.id}`}>
          <img src={event.image} alt={event.title} className="w-full h-64 object-cover" />
        </Link>
        <div className="p-4">
          <h3 className="text-2xl font-bold">
            <Link to={`/events/${event.id}`}>{event.title}</Link>
          </h3>
          <p className="text-gray-600 mt-2">
            📅 {event.date} at {event.time}
          </p>
          <p className="text-gray-600">📍 {event.location}</p>
          {/* RSVP Button */}
          <button
            onClick={handleRSVP}
            className={`mt-4 px-4 py-2 rounded-md ${
              isRSVPed ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
            }`}
          >
            {isRSVPed ? 'Cancel RSVP' : 'RSVP'}
          </button>
        </div>
      </div>
    );
  }  

export default EventCard;
