// src/components/UpcomingEvents.jsx
import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EventsContext } from '../context/EventsContext';
import { AuthContext } from '../context/AuthContext';

function UpcomingEvents() {
  const { events, isLoading, error} = useContext(EventsContext);
  const { auth } = useContext(AuthContext);

  // Get the current date
  const currentDate = new Date();

  // Filter events to get only upcoming events
  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= currentDate)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5); // Limit to 5 events
  

  if (upcomingEvents.length === 0) {
    return <p>No upcoming events available.</p>;
  }

  if(!auth?.token) {
    return <p>Please log in.</p>;
  }

  return (
    <div>
      {upcomingEvents.map((event) => (
        <Link to={`/events/${event.id}`} key={event.id}>
          <div className="mb-4 bg-white shadow-md rounded-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {/* Event Image */}
            <img
              src={event.image
                ? `https://mola.zcy.moe/${event.image}`
                : '/images/default-event-image.jpg'}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              {/* Event Title */}
              <h3 className="text-xl font-bold">{event.title}</h3>
              {/* Event Date and Time */}
              <p className="text-gray-600 mt-1">
                📅 {new Date(event.date).toLocaleDateString()} at{' '}
                {new Date(event.date).toLocaleTimeString()}
              </p>
              {/* Event Location */}
              <p className="text-gray-600 mt-1">📍 {event.location}</p>
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
