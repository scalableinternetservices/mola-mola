// src/context/EventsContext.js
import React, { createContext, useState } from 'react';
import { eventsData as initialEventsData } from '../mockdata/eventsData';

export const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState(initialEventsData);

  // Function to handle RSVP
  const toggleRSVP = (eventId, userId) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          const isRSVPed = event.rsvps.includes(userId);
          let updatedRSVPs = event.rsvps;
          let updatedDeclines = event.declines;

          if (isRSVPed) {
            // Cancel RSVP
            updatedRSVPs = event.rsvps.filter((id) => id !== userId);
          } else {
            // Add RSVP and remove from declines if present
            updatedRSVPs = [...event.rsvps, userId];
            updatedDeclines = event.declines.filter((id) => id !== userId);
          }

          return { ...event, rsvps: updatedRSVPs, declines: updatedDeclines };
        }
        return event;
      })
    );
  };

  // Function to handle Decline
  const toggleDecline = (eventId, userId) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          const isDeclined = event.declines.includes(userId);
          let updatedRSVPs = event.rsvps;
          let updatedDeclines = event.declines;

          if (isDeclined) {
            // Cancel Decline
            updatedDeclines = event.declines.filter((id) => id !== userId);
          } else {
            // Add to declines and remove from RSVPs if present
            updatedDeclines = [...event.declines, userId];
            updatedRSVPs = event.rsvps.filter((id) => id !== userId);
          }

          return { ...event, rsvps: updatedRSVPs, declines: updatedDeclines };
        }
        return event;
      })
    );
  };

  return (
    <EventsContext.Provider value={{ events, toggleRSVP, toggleDecline }}>
      {children}
    </EventsContext.Provider>
  );
};
