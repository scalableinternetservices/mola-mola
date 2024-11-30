// src/context/EventsContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchAllEvents } from '../api';
import { AuthContext } from './AuthContext';

export const EventsContext = createContext();
export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    console.log('Auth token changed:', auth?.token);
    const loadEvents = async () => {
      if (!auth?.token) {
        setEvents([]); // Clear events when logged out
        return;
      }
      setIsLoading(true);
      setError('');
      try {
        const eventsData = await fetchAllEvents(auth.token);
        console.log('Fetched events data:', eventsData); // Add this log
        setEvents(eventsData);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setError('Failed to fetch events');
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, [auth?.token]);

  const updateEventInState = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const removeEventFromState = (eventId) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
  };  

  const addEvent = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const removeEvent = (eventId) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
  };

  return (
    <EventsContext.Provider
      value={{
        events,
        setEvents,
        isLoading,
        error,
        updateEventInState, // Ensure this is exposed
        removeEventFromState, // Ensure this is exposed
        addEvent,
        removeEvent,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};
