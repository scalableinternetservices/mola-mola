// src/components/UpcomingEvents.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function UpcomingEvents() {
  const events = [
    {
      id: 1,
      title: 'Music Concert',
      date: '2023-10-01',
      time: '7:00 PM',
      place: 'City Hall',
      description: 'An evening of classical music.',
      image: './images/logo512.png',
    },
    {
      id: 2,
      title: 'Art Exhibition',
      date: '2023-10-05',
      time: '5:00 PM',
      place: 'Art Gallery',
      description: 'Showcasing modern art.',
      image: './images/logo512.png',
    },
  ];

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
