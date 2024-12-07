// src/pages/Events.jsx
import React, { useContext } from 'react';
import { EventsContext } from '../context/EventsContext';
import { Link } from 'react-router-dom';
import EventList from '../components/EventList';
import { AuthContext } from '../context/AuthContext';

function Events() {
  const { events, isLoading, error, page, fetchEvents, totalPages } = useContext(EventsContext);
  const { auth } = useContext(AuthContext);
  const { user } = auth;

  const handleNext = () => {
    if (page < totalPages) {
      fetchEvents(page + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      fetchEvents(page - 1);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Events</h2>
        {user && (
          <Link to="/events/create" className="bg-green-500 text-white px-4 py-2 rounded-md">
            Create Event
          </Link>
        )}
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && <EventList events={events} />}

      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-2 mt-4">
        {page > 1 && (
          <button onClick={handlePrev} className="px-3 py-1 bg-gray-300 rounded">
            Prev
          </button>
        )}
        <span>Page {page} of {totalPages}</span>
        {page < totalPages && (
          <button onClick={handleNext} className="px-3 py-1 bg-gray-300 rounded">
            Next
          </button>
        )}
      </div>
    </div>
  );
}


export default Events;
