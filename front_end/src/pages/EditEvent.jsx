// src/pages/EditEvent.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EventsContext } from '../context/EventsContext';
import { AuthContext } from '../context/AuthContext';
import { updateEvent, getPresignedUrl } from '../api';

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { user, token } = auth || {};
  const { events, updateEventInState } = useContext(EventsContext);

  const event = events.find((event) => event.id === parseInt(id));

  useEffect(() => {
    if (!user || !token) {
      alert('Please log in to edit an event.');
      navigate('/login');
    } else if (!event) {
      alert('Event not found.');
      navigate('/events');
    } else if (event.host_id !== user.id) {
      alert('You are not authorized to edit this event.');
      navigate(`/events/${id}`);
    }
  }, [user, token, event, navigate, id]);

  // Form state variables initialized with event data
  const [title, setTitle] = useState(event ? event.title : '');
  const [description, setDescription] = useState(event ? event.description : '');
  const [date, setDate] = useState(event ? event.date.split('T')[0] : '');
  const [time, setTime] = useState(event ? event.date.split('T')[1].slice(0, 5) : '');
  const [location, setLocation] = useState(event ? event.location : '');
  const [selectedTags, setSelectedTags] = useState(event && event.categories ? event.categories : []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image upload state variables
  const [imageFile, setImageFile] = useState(null);
  const [imageKey, setImageKey] = useState(event ? event.image : null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    event && event.image ? `https://mola.zcy.moe/${event.image}` : null
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleTagSelection = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      alert('Please select an image to upload.');
      return;
    }

    setIsUploadingImage(true);

    try {
      // Get presigned URL and key
      const uploadData = await getPresignedUrl(token);
      const presignedUrl = uploadData.url;
      const uploadedImageKey = uploadData.key;

      // Upload the image using the presigned URL
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: imageFile,
        headers: {
          'Content-Type': imageFile.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image.');
      }

      // Image uploaded successfully
      setImageKey(uploadedImageKey);
      alert('Image uploaded successfully.');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log(selectedTags)
    // Validate required fields
    if (!title || !description || !date || !time || !location ) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    // Combine date and time into an ISO string
    const eventDateTime = new Date(`${date}T${time}`);
    if (isNaN(eventDateTime)) {
      alert('Invalid date or time.');
      setIsSubmitting(false);
      return;
    }

    // Prepare event data with fields to be updated
    const eventData = {
      // Only include fields that have changed
      ...(title !== event.title && { title }),
      ...(description !== event.description && { description }),
      ...(eventDateTime.toISOString() !== event.date && { date: eventDateTime.toISOString() }),
      ...(location !== event.location && { location }),
      ...(selectedTags !== event.categories && { categories: selectedTags }),
      ...(imageKey !== event.image && { image: imageKey }),
    };

    if (Object.keys(eventData).length === 0) {
      alert('No changes made to the event.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Update the event via API
      const updatedEvent = await updateEvent(event.id, eventData, token);

      // Manually set rsvp_status and followed_users to their previous values
      updatedEvent.rsvp_status = event.rsvp_status;
      updatedEvent.followed_users = event.followed_users;

      // Update the event in the EventsContext
      updateEventInState(updatedEvent);

      alert('Event updated successfully!');
      // Redirect to the event details page
      navigate(`/events/${event.id}`);
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Edit Event</h2>
      <form onSubmit={handleSubmit}>
        {/* Event Title */}
        <div className="mb-4">
          <label className="block text-gray-700">Event Title:</label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md p-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter event title"
          />
        </div>
        {/* Event Description */}
        <div className="mb-4">
          <label className="block text-gray-700">Event Description:</label>
          <textarea
            className="mt-1 block w-full border border-gray-300 rounded-md p-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Describe your event"
          />
        </div>
        {/* Event Date */}
        <div className="mb-4">
          <label className="block text-gray-700">Event Date:</label>
          <input
            type="date"
            className="mt-1 block w-full border border-gray-300 rounded-md p-3"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        {/* Event Time */}
        <div className="mb-4">
          <label className="block text-gray-700">Event Time:</label>
          <input
            type="time"
            className="mt-1 block w-full border border-gray-300 rounded-md p-3"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        {/* Event Location */}
        <div className="mb-4">
          <label className="block text-gray-700">Event Location:</label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md p-3"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            placeholder="Enter event location"
          />
        </div>
        {/* Event Categories */}
        <div className="mb-4">
          <label className="block text-gray-700">Event Categories:</label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md p-3"
            value={selectedTags.join(', ')}
            onChange={(e) =>
              setSelectedTags(e.target.value.split(',').map((tag) => tag.trim()))
            }
            placeholder="Enter categories separated by commas"
          />
        </div>
        {/* Event Image Upload */}
        <div className="mb-6">
          <label className="block text-gray-700">Event Image:</label>
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full"
            onChange={handleImageChange}
          />
          {imagePreviewUrl && (
            <img
              src={imagePreviewUrl}
              alt="Event Preview"
              className="mt-4 w-full h-64 object-cover rounded-md"
            />
          )}
          <button
            type="button"
            onClick={handleImageUpload}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
            disabled={isUploadingImage || !imageFile}
          >
            {isUploadingImage ? 'Uploading Image...' : 'Upload Image'}
          </button>
          {imageKey && imageKey !== event.image && (
            <p className="text-green-600 mt-2">Image uploaded successfully.</p>
          )}
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-yellow-500 text-white py-3 rounded-md hover:bg-yellow-600 transition duration-200"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating Event...' : 'Update Event'}
        </button>
      </form>
    </div>
  );
}

export default EditEvent;
