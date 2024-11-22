import React, { useState, useEffect,useContext } from 'react';
import { useParams } from 'react-router-dom';
import { eventsData } from '../mockdata/eventsData'; // Use real data when integrating backend
import { usersData } from '../mockdata/usersData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
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

// // Place below the RSVP button
// <Comments eventId={event.id} />

function EventDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [followedUsersAttending, setFollowedUsersAttending] = useState([]);
  const [isRSVPed, setIsRSVPed] = useState(false);

  useEffect(() => {
    // Fetch event data
    const foundEvent = eventsData.find((e) => e.id === parseInt(id));
    setEvent(foundEvent);


    if (foundEvent && user) {
      // Get followed user IDs
      const followedUserIds = user.followedUsers;
      // Get RSVP user IDs
      const eventRSVPUserIds = foundEvent.rsvps;
      // Find mutual users
      const mutualUserIds = followedUserIds.filter((userId) =>
        eventRSVPUserIds.includes(userId)
      );
      // Get user details
      const mutualUsers = usersData.filter((u) =>
        mutualUserIds.includes(u.id)
      );
      setFollowedUsersAttending(mutualUsers);
    }
  }, [id, user]);

    if (!event) {
    return (
        <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold">Event Not Found</h2>
        <p>The event you are looking for does not exist.</p>
        </div>
    );
    }

    const shareUrl = `${window.location.origin}/events/${event.id}`;
    const title = event.title;

    const handleRSVP = () => {
    setIsRSVPed(!isRSVPed);
    // Update RSVP status in backend or global state when integrated
    };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Event Image */}
      <img src={event.image} alt={event.title} className="w-full h-96 object-cover rounded-md mb-6" />
      {/* Event Title and Share Button */}
      <div className="flex space-x-2 mt-4">
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
      {/* Event Date and Time */}
      <p className="text-gray-600 mt-2">
        📅 {event.date} at {event.time}
      </p>
      {/* Event Location */}
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
        {/* RSVP Button */}
            <button
        onClick={handleRSVP}
        className={`mt-4 px-4 py-2 rounded-md ${
        isRSVPed ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
        }`}
        >
        {isRSVPed ? 'Cancel RSVP' : 'RSVP'}
        </button>

      {/* Implement RSVP functionality if needed */}

      {user && followedUsersAttending.length > 0 && (
  <div className="mt-8">
    <h3 className="text-xl font-bold mb-4">
      People you follow attending this event:
    </h3>
    <ul>
      {followedUsersAttending.map((u) => (
        <li key={u.id} className="text-gray-800">
          {u.username}
        </li>
      ))}
    </ul>
  </div>
)}
    </div>
  );
}

export default EventDetails;
