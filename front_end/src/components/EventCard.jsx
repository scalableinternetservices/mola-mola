// src/components/EventCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function EventCard({ event }) {
  const [isRSVPed, setIsRSVPed] = useState(event.rsvp);

  const handleRSVP = () => {
    setIsRSVPed(!isRSVPed);
    // In a real application, you would also update the backend or global state
  };

  return (
    <div className="mb-6 bg-white shadow-md rounded-md overflow-hidden">
      <Link to={`/events/${event.id}`}>
        {/* Event Image */}
        <img src={event.image} alt={event.title} className="w-full h-64 object-cover" />
      </Link>
      <div className="p-4">
        {/* Event Title */}
        <h3 className="text-2xl font-bold">
          <Link to={`/events/${event.id}`}>{event.title}</Link>
        </h3>
        {/* Event Date and Time */}
        <p className="text-gray-600 mt-2">
          📅 {event.date} at {event.time}
        </p>
        {/* Event Location */}
        <p className="text-gray-600 mt-1">📍 {event.location}</p>
        {/* Event Description */}
        <p className="mt-4 text-gray-700">{event.description}</p>
        {/* Categories */}
        <div className="mt-4">
          {event.categories.map((category, index) => (
            <span
              key={index}
              className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full mr-2 mb-2"
            >
              {category}
            </span>
          ))}
        </div>
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
