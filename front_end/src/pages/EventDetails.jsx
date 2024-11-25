import React, { useState, useEffect,useContext } from 'react';
import { useParams } from 'react-router-dom';
import { eventsData } from '../mockdata/eventsData'; // Use real data when integrating backend
import { usersData } from '../mockdata/usersData';
import { EventsContext } from '../context/EventsContext';
import { AuthContext } from '../context/AuthContext';
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
    const { user } = useContext(AuthContext);
    const { events, toggleRSVP, toggleDecline } = useContext(EventsContext);
    const [event, setEvent] = useState(null);
  
    useEffect(() => {
      const foundEvent = events.find((e) => e.id === parseInt(id));
      setEvent(foundEvent);
    }, [id, events]);
  
    if (!event) {
      return <div>Event not found.</div>;
    }
  
    const shareUrl = `${window.location.origin}/events/${event.id}`;
    const title = event.title;
  
    const isRSVPed = event.rsvps.includes(user?.id);
    const isDeclined = event.declines.includes(user?.id);
  
    const handleRSVP = () => {
      if (user) {
        toggleRSVP(event.id, user.id);
      } else {
        alert('Please log in to RSVP.');
      }
    };
  
    const handleDecline = () => {
      if (user) {
        toggleDecline(event.id, user.id);
      } else {
        alert('Please log in to Decline.');
      }
    };
  
    // Determine followed users who have RSVP'd
    const followedUsersAttending = event.rsvps.filter((userId) =>
      user?.followedUsers?.includes(userId)
    );
  
    return (
      <div className="container mx-auto px-4 py-6">
        {/* Event Image */}
        <img src={event.image} alt={event.title} className="w-full h-96 object-cover rounded-md mb-6" />
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
          📅 {event.date} at {event.time}
        </p>
        <p className="text-gray-600">📍 {event.location}</p>
        {/* Categories */}
        <div className="mt-4">
          {event.categories.map((category, index) => (
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
        {/* RSVP and Decline Buttons */}
        <div className="mt-4 flex space-x-2">
          {!isRSVPed && !isDeclined && (
            <>
              <button
                onClick={handleRSVP}
                className="px-4 py-2 rounded-md bg-blue-500 text-white"
              >
                RSVP
              </button>
              <button
                onClick={handleDecline}
                className="px-4 py-2 rounded-md bg-gray-500 text-white"
              >
                Decline
              </button>
            </>
          )}
          {isRSVPed && (
            <button
              onClick={handleRSVP}
              className="px-4 py-2 rounded-md bg-red-500 text-white"
            >
              Cancel RSVP
            </button>
          )}
          {isDeclined && (
            <button
              onClick={handleDecline}
              className="px-4 py-2 rounded-md bg-red-500 text-white"
            >
              Cancel Decline
            </button>
          )}
        </div>
        {/* Followed Users Attending */}
        {user && followedUsersAttending.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">People you follow attending this event:</h3>
            <ul>
              {followedUsersAttending.map((userId) => {
                const attendingUser = usersData.find((u) => u.id === userId);
                return (
                  <li key={userId} className="text-gray-800">
                    {attendingUser?.username || 'Unknown User'}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {/* Comments Section */}
        <Comments eventId={event.id} />
      </div>
    );
  }
  
  export default EventDetails;