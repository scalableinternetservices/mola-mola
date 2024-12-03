// src/components/EventCard.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { EventsContext } from '../context/EventsContext';
import { AuthContext } from '../context/AuthContext';
import { createRSVP, modifyRSVP, deleteRSVP } from '../api';

function EventCard({ event }) {
  const { auth } = useContext(AuthContext);
  const { user, token } = auth || {};
  const { updateEventInState } = useContext(EventsContext);
  
  // User's RSVP status
  const rsvpStatus = event.rsvp_status; // "accepted", "declined", or null
  const hasResponded = rsvpStatus === 'accepted' || rsvpStatus === 'declined';

  const handleAccept = async () => {
    if (!user || !token) {
      alert('Please log in to respond to events.');
      return;
    }
    try {
      // Create or modify RSVP to 'accepted'
      await createRSVP({ event_id: event.id, status: 'accepted' }, token);
      // Update event's rsvp_status locally
      updateEventInState({ ...event, rsvp_status: 'accepted' });
    } catch (error) {
      console.error('Failed to accept event:', error);
    }
  };

  const handleDecline = async () => {
    if (!user || !token) {
      alert('Please log in to respond to events.');
      return;
    }
    try {
      // Create or modify RSVP to 'declined'
      await createRSVP({ event_id: event.id, status: 'declined' }, token);
      // Update event's rsvp_status locally
      updateEventInState({ ...event, rsvp_status: 'declined' });
    } catch (error) {
      console.error('Failed to decline event:', error);
    }
  };

  const handleCancel = async () => {
    if (!user || !token) {
      alert('Please log in to respond to events.');
      return;
    }
    try {
      // Delete RSVP
      await deleteRSVP({ event_id: event.id }, token);
      // Update event's rsvp_status locally
      updateEventInState({ ...event, rsvp_status: null });
    } catch (error) {
      console.error('Failed to cancel response:', error);
    }
  };

  const imageUrl = event.image
  ? `https://mola.zcy.moe/${event.image}`
  : '/images/default-event-image.jpg'; // Use your default image path

  return (
    <div className="mb-6 bg-white shadow-md rounded-md overflow-hidden">
      <Link to={`/events/${event.id}`}>
        <img
          src={imageUrl}
          alt={event.title}
          className="w-full h-64 object-cover"
        />
      </Link>
      <div className="p-4">
        <h3 className="text-2xl font-bold">
          <Link to={`/events/${event.id}`}>{event.title}</Link>
        </h3>
        <p className="text-gray-600 mt-2">
          📅 {new Date(event.date).toLocaleDateString()} at{' '}
          {new Date(event.date).toLocaleTimeString()}
        </p>
        <p className="text-gray-600">📍 {event.location}</p>
         {/* RSVP Buttons */}
         {token && (
          <div className="mt-4 flex space-x-2">
            {!hasResponded ? (
              <>
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 rounded-md bg-blue-500 text-white"
                >
                  Accept
                </button>
                <button
                  onClick={handleDecline}
                  className="px-4 py-2 rounded-md bg-gray-500 text-white"
                >
                  Decline
                </button>
              </>
            ) : (
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-md bg-red-500 text-white"
              >
                {rsvpStatus === 'accepted' ? 'Cancel Accept' : 'Cancel Decline'}
              </button>
            )}
          </div>
        )}
        {/* Display Followed Users Attending */}
        {event.followed_users && event.followed_users.length > 0 && (
          <div className="mt-4">
            <p className="text-gray-700">
              People you follow are attending this event.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventCard;
