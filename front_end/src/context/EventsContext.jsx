// src/context/EventsContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { fetchAllEvents, getTotalEventCount } from '../api';
import { AuthContext } from './AuthContext';

export const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1); // Track current page
  const { auth } = useContext(AuthContext);
  //pagination related
  const perPage = 20;
  const [totalPages, setTotalPages] = useState(1);

  const fetchEvents = useCallback(
    async (pageNum = 1) => {
      if (!auth?.token) {
        setEvents([]);
        return;
      }
      setIsLoading(true);
      setError('');
      try {
        const eventsData = await fetchAllEvents(auth.token, pageNum);
        setEvents(eventsData);

        // fetch total_count once (or you can cache it)
        const { total_count } = await getTotalEventCount();
        const calculatedPages = Math.ceil(total_count / perPage);
        setTotalPages(calculatedPages);
        setPage(pageNum);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setError('Failed to fetch events');
      } finally {
        setIsLoading(false);
      }
    },
    [auth?.token]
  );

  // Fetch the first page of events whenever the token changes
  useEffect(() => {
    if (auth?.token) {
      fetchEvents(1);
    } else {
      setEvents([]);
    }
  }, [auth?.token, fetchEvents]);

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
        page,
        fetchEvents,
        updateEventInState,
        removeEventFromState,
        addEvent,
        removeEvent,
        totalPages
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};
