// src/pages/EventDetails.jsx
import React, { useContext,useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  createRSVP,
  deleteRSVP,
  deleteEvent
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
  const { events, updateEventInState, removeEventFromState} = useContext(EventsContext);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const navigate = useNavigate();

  // Find the event from the context
  const event = events.find((event) => event.id === parseInt(id));

  if (!event) {
    return <div>Event not found or you need to log in to view event details.</div>;
  }

  console.log(event.categories);

  const isHost = user && event.host_id === user.id;
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

  const handleDelete = async () => {
    try {
      await deleteEvent(event.id, token);
      // Remove the event from the EventsContext
      removeEventFromState(event.id);
      alert('Event deleted successfully.');
      // Redirect to events list or home page
      navigate('/events');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
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
      {/* Event Title  and Share Buttons */}
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

      <div className="flex justify-between items-center">
      <p className="text-gray-600 mt-2">
        📅 {new Date(event.date).toLocaleDateString()} at{' '}
        {new Date(event.date).toLocaleTimeString()}
      </p>

        {isHost && (
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => navigate(`/events/${event.id}/edit`)}
              className="px-4 py-2 rounded-md bg-yellow-500 text-white"
            >
              Edit
            </button>
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="px-4 py-2 rounded-md bg-red-500 text-white"
            >
              Delete
            </button>
          </div>
        )}

        {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-md">
          <p className="mb-4">Are you sure you want to delete this event?</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="px-4 py-2 rounded-md bg-gray-500 text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-md bg-red-500 text-white"
            >
              Confirm Delete
            </button>
          </div>
        </div>
        </div>
        )}
      </div>
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

