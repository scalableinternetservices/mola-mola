import React, { useState, useContext, useEffect } from 'react';
import { EventsContext } from '../context/EventsContext';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function CreateEvent() {
  const { addEvent } = useContext(EventsContext);
  const { auth } = useContext(AuthContext);
  const { user } = auth;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      alert('Please log in to create an event.');
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Form state variables
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate and submit the form data
    if (!title || !description || !date || !time || !location) {
        alert('Please fill in all required fields.');
        return;
    }

  let imageUrl = '/images/placeholder.png'; // Default placeholder image

  if (image) {
    try {
      // Use your pre-signed URL directly
      const presignedUrl = 'https://d3d21c0763b9959ef86ba901e8162914.r2.cloudflarestorage.com/mola-mola/6/a897f3d311e7738eebfa35d4e6ce13c5?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=febfb292745b023ed44af6c360d10ffc%2F20241124%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20241124T083437Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=893cf527898cec259045d8a33d878c3925ab168575e94dafc367220b8cb96e26'; // Replace with your pre-signed URL

      // Upload the image directly to S3
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: image,
        headers: {
          'Content-Type': image.type, // Set the content type of the file
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image.');
      }

      // Construct the image URL (remove query parameters)
      imageUrl = presignedUrl.split('?')[0];

    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Using placeholder image.');
    }
  }

    const newEvent = {
      id: Date.now(), // Unique ID
      title,
      description,
      date,
      time,
      location,
      image: imageUrl,
      categories: selectedTags,
      rsvp: false,
      rsvps: [],
    };

    // For now, log the event data
    addEvent(newEvent);
    console.log('Event Created:', newEvent);
    alert('Event created successfully!');
    // Reset the form
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setLocation('');
    setImage(null);
    setCategories('');
    setTags([]);
    setSelectedTags([]);
    // Redirect to the event details page    
    navigate(`/events/${newEvent.id}`);
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
        {/* Event Image */}
        <div className="mb-6">
          <label className="block text-gray-700">Event Image:</label>
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full"
            onChange={(e) => setImage(e.target.files[0])}
          />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Event Preview"
              className="mt-4 w-full h-64 object-cover rounded-md"
            />
          )}
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition duration-200"
        >
          Create Event
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;
