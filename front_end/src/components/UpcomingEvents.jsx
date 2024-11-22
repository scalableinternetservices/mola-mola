// src/components/UpcomingEvents.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { eventsData } from '../mockdata/eventsData';

function UpcomingEvents() {
  const events = eventsData;

  return (
    <div>
      {events.map((event) => (
        <Link to={`/events/${event.id}`} key={event.id}>
          <div className="mb-4 bg-white shadow-md rounded-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {/* Event Image */}
            <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              {/* Event Title */}
              <h3 className="text-xl font-bold">{event.title}</h3>
              {/* Event Date and Time */}
              <p className="text-gray-600 mt-1">
                📅 {event.date} at {event.time}
              </p>
              {/* Event Place */}
              <p className="text-gray-600 mt-1">📍 {event.place}</p>
              {/* Event Description */}
              <p className="mt-2 text-gray-700">{event.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default UpcomingEvents;
