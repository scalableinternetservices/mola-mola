// src/pages/Home.jsx
import React from 'react';
import UpcomingEvents from '../components/UpcomingEvents';

function Home() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
      <UpcomingEvents />
    </div>
  );
}

export default Home;
