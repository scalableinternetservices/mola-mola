import React, { useState,useContext } from 'react';
import { EventsContext } from '../context/EventsContext';
import { Link } from 'react-router-dom';
import EventList from '../components/EventList';
import { eventsData } from '../mockdata/eventsData';
import { AuthContext } from '../context/AuthContext';

function Events() {
    const { events } = useContext(EventsContext);
     //only those who logged in can create events
    const {auth} = useContext(AuthContext); 
    const {user} = auth;
     //TODO: Implement the search logic

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Events</h2>
        {/* Create Event Button */}
        {user && (
          <Link to="/events/create" className="bg-green-500 text-white px-4 py-2 rounded-md">
            Create Event
          </Link>
        )}
      </div>
      {/* EventList component to display events */}
      <EventList events={events} />
    </div>
  );
}

export default Events;
