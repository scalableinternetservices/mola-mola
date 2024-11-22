// src/context/EventsContext.js
import React, { createContext, useState, useEffect } from 'react';
import { eventsData as initialEventsData } from '../mockdata/eventsData';

export const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState(initialEventsData);

  // Function to add a new event
  const addEvent = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  // Function to toggle RSVP status
  const toggleRSVP = (eventId, userId) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          const isRSVPed = event.rsvps.includes(userId);
          const updatedRSVPs = isRSVPed
            ? event.rsvps.filter((id) => id !== userId)
            : [...event.rsvps, userId];
          
        //   console.log({ ...event, rsvps: updatedRSVPs });
          return { ...event, rsvps: updatedRSVPs };
        }
        return event;
      })
    );
  };

  return (
    <EventsContext.Provider value={{ events, addEvent, toggleRSVP }}>
      {children}
    </EventsContext.Provider>
  );
};
