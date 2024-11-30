// src/pages/EventDetails.jsx
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  createRSVP,
  deleteRSVP,
} from '../api';
import { AuthContext } from '../context/AuthContext';
import { EventsContext } from '../context/EventsContext';
import Comments from '../components/Comments';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from 'react-share';

function EventDetails() {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const { token, user } = auth || {};
  const { events, updateEventInState } = useContext(EventsContext);

  // Find the event from the context
  const event = events.find((event) => event.id === parseInt(id));

  if (!event) {
    return <div>Event not found or you need to log in to view event details.</div>;
  }

  const shareUrl = `${window.location.origin}/events/${event.id}`;
  const title = event.title;

  // User's RSVP status
  const rsvpStatus = event.rsvp_status;
  const hasResponded = rsvpStatus === 'accepted' || rsvpStatus === 'declined';

  const handleAccept = async () => {
    if (!user || !token) {
      alert('Please log in to respond to events.');
      return;
    }
    try {
      await createRSVP({ event_id: event.id, status: 'accepted' }, token);
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
      await createRSVP({ event_id: event.id, status: 'declined' }, token);
      updateEventInState({ ...event, rsvp_status: 'declined' });
    } catch (error) {
      console.error('Failed to decline event:', error);
    }
  };

  const handleCancel = async () => {
    if (!user || !token) {
      alert('Please log in.');
      return;
    }
    try {
      await deleteRSVP({ event_id: event.id }, token);
      updateEventInState({ ...event, rsvp_status: null });
    } catch (error) {
      console.error('Failed to cancel RSVP:', error);
    }
  };

  const imageUrl = event.image
  ? `https://mola.zcy.moe/${event.image}`
  : '/images/default-event-image.jpg'; // Use your default image path

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Event Image */}
      <img
        src={imageUrl}
        alt={event.title}
        className="w-full h-96 object-cover rounded-md mb-6"
      />
      {/* Event Title and Share Buttons */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">{event.title}</h2>
        <div className="flex space-x-2">
          <FacebookShareButton url={shareUrl} quote={title}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton url={shareUrl} title={title}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <LinkedinShareButton url={shareUrl}>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
        </div>
      </div>
      <p className="text-gray-600 mt-2">
        📅 {new Date(event.date).toLocaleDateString()} at{' '}
        {new Date(event.date).toLocaleTimeString()}
      </p>
      <p className="text-gray-600">📍 {event.location}</p>
      {/* Categories */}
      <div className="mt-4">
        {event.categories && event.categories.map((category, index) => (
          <span
            key={index}
            className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full mr-2 mb-2"
          >
            {category}
          </span>
        ))}
      </div>
      {/* Event Description */}
      <p className="mt-6 text-gray-700">{event.description}</p>
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
              Cancel Response
            </button>
          )}
        </div>
      )}
      {/* Followed Users Attending */}
      {event.followed_users && event.followed_users.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">
            People you follow attending this event:
          </h3>
          <ul>
            {event.followed_users.map((userId) => (
              <li key={userId} className="text-gray-800">
                User ID: {userId}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Comments Section */}
      <Comments eventId={event.id} />
    </div>
  );
}

export default EventDetails;
