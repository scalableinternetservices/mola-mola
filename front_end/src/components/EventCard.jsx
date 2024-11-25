// src/components/EventCard.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { EventsContext } from '../context/EventsContext';
import { AuthContext } from '../context/AuthContext';

function EventCard({ event }) {
  const { user } = useContext(AuthContext);
  const { toggleRSVP, toggleDecline } = useContext(EventsContext);

  const isRSVPed = event.rsvps.includes(user?.id);
  const isDeclined = event.declines.includes(user?.id);

  const handleRSVP = () => {
    if (user) {
      toggleRSVP(event.id, user.id);
    } else {
      alert('Please log in to RSVP.');
    }
  };

  const handleDecline = () => {
    if (user) {
      toggleDecline(event.id, user.id);
    } else {
      alert('Please log in to Decline.');
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
        {/* RSVP and Decline Buttons */}
        <div className="mt-4 flex space-x-2">
          {!isRSVPed && !isDeclined && (
            <>
              <button
                onClick={handleRSVP}
                className="px-4 py-2 rounded-md bg-blue-500 text-white"
              >
                RSVP
              </button>
              <button
                onClick={handleDecline}
                className="px-4 py-2 rounded-md bg-gray-500 text-white"
              >
                Decline
              </button>
            </>
          )}
          {isRSVPed && (
            <button
              onClick={handleRSVP}
              className="px-4 py-2 rounded-md bg-red-500 text-white"
            >
              Cancel RSVP
            </button>
          )}
          {isDeclined && (
            <button
              onClick={handleDecline}
              className="px-4 py-2 rounded-md bg-red-500 text-white"
            >
              Cancel Decline
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventCard;
