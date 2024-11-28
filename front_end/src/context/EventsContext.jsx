// src/context/EventsContext.js
import React, { createContext, useState, useEffect } from 'react';
import { fetchAllEvents, rsvpEvent, declineEvent } from '../api';

export const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  // Fetch events when the component mounts
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventsData = await fetchAllEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };
    loadEvents();
  }, []);

  // Function to handle RSVP
  const toggleRSVP = async (eventId, token) => {
    try {
      const updatedEvent = await rsvpEvent(eventId, token);
      setEvents((prevEvents) =>
        prevEvents.map((event) => (event.id === eventId ? updatedEvent : event))
      );
    } catch (error) {
      console.error('Failed to RSVP:', error);
    }
  };

  // Function to handle Decline
  const toggleDecline = async (eventId, token) => {
    try {
      const updatedEvent = await declineEvent(eventId, token);
      setEvents((prevEvents) =>
        prevEvents.map((event) => (event.id === eventId ? updatedEvent : event))
      );
    } catch (error) {
      console.error('Failed to decline event:', error);
    }
  };

  return (
    <EventsContext.Provider value={{ events, toggleRSVP, toggleDecline }}>
      {children}
    </EventsContext.Provider>
  );
};
