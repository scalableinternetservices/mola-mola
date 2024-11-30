// src/pages/CreateEvent.jsx
import React, { useState, useContext, useEffect } from 'react';
import { EventsContext } from '../context/EventsContext';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getPresignedUrl, createEvent } from '../api'; // Import API functions

function CreateEvent() {
  const { addEvent } = useContext(EventsContext);
  const { auth } = useContext(AuthContext);
  const { user, token } = auth || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      alert('Please log in to create an event.');
      navigate('/login');
    }
  }, [user, token, navigate]);

  // Form state variables
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [categories, setCategories] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image upload state variables
  const [imageFile, setImageFile] = useState(null);
  const [imageKey, setImageKey] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleGenerateTags = () => {
    setIsGeneratingTags(true);
    // Simulate AI-generated tags
    setTimeout(() => {
      const generatedTags = ['Music', 'Networking', 'Workshop', 'Art', 'Tech'];
      setTags(generatedTags);
      setIsGeneratingTags(false);
    }, 1000);
  };

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
    } else {
      setImagePreviewUrl(null);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      alert('Please select an image to upload.');
      return;
    }

    setIsUploadingImage(true);

    try {
      // Step 1: Get presigned URL and key
      const uploadData = await getPresignedUrl(token);

      const presignedUrl = uploadData.url;
      const uploadedImageKey = uploadData.key;

      // Step 2: Upload the image using the presigned URL
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: imageFile,
        headers: {
          'Content-Type': imageFile.type, // Set the content type of the file
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
      // Do not set imageKey; the user can try uploading again
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields
    if (!title || !description || !date || !time || !location) {
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

    // Prepare event data
    const eventData = {
      title,
      description,
      date: eventDateTime.toISOString(),
      location,
      categories: selectedTags,
      // Include image only if imageKey is available
      ...(imageKey && { image: imageKey }),
    };

    try {
      // Create the event via API
      const createdEvent = await createEvent(eventData, token);

      // Add default values for missing fields
      createdEvent.rsvp_status = 'pending';
      createdEvent.followed_users = [];

      // Add the new event to the EventsContext
      addEvent(createdEvent);

      // Reset the form
      setTitle('');
      setDescription('');
      setDate('');
      setTime('');
      setLocation('');
      setCategories('');
      setTags([]);
      setSelectedTags([]);
      setImageFile(null);
      setImageKey(null);
      setImagePreviewUrl(null);

      alert('Event created successfully!');
      // Redirect to the event details page
      navigate(`/events/${createdEvent.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Create an Event</h2>
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
        {/* Generate Tags */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGenerateTags}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Generate Tags
          </button>
          {isGeneratingTags && <p className="text-gray-600 mt-2">Generating tags...</p>}
        </div>
        {/* Display Generated Tags */}
        {tags.length > 0 && (
          <div className="mb-4">
            <label className="block text-gray-700">Recommended Tags:</label>
            <div className="mt-2">
              {tags.map((tag, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleTagSelection(tag)}
                  className={`inline-block mr-2 mb-2 px-3 py-1 rounded-full ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
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
          {imageKey && (
            <p className="text-green-600 mt-2">Image uploaded successfully.</p>
          )}
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition duration-200"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Event...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;
