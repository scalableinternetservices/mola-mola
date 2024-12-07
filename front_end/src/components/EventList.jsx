import React from 'react';
import EventCard from './EventCard';

function EventList({ events }) {
    
if (events.length === 0) {
    return <p>No events found or not authorized to view events, please login.</p>;
    }

  return (
    <div>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export default EventList;
