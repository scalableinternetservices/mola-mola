import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { EventsContext } from '../context/EventsContext';
import { fetchAllEvents } from '../api';

function LoginModal({ onClose, onShowRegister }) {
  const { login } = useContext(AuthContext); // Login function from AuthContext
  const { setEvents } = useContext(EventsContext); // setEvents function from EventsContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Perform login
      const userData = await login({ email, password });
      alert('Login successful!');

      // // Use the updated token to fetch events
      // if (userData.token) {
      //   console.log('Fetching events...');
      //   const eventsData = await fetchAllEvents(userData.token); // Pass the token directly
      //   setEvents(eventsData); // Update the EventsContext
      // }

      onClose();
    } catch (err) {
      // Handle errors
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-md shadow-md w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Login</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            ✕
          </button>
        </div>
        {error && (
          <div className="mb-4 text-red-500 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              className="mt-1 block w-full border border-gray-300 rounded-md p-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              className="mt-1 block w-full border border-gray-300 rounded-md p-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Your password"
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {/* Register Link */}
        <p className="mt-4 text-center">
          Not a user?{' '}
          <button onClick={onShowRegister} className="text-blue-500 underline">
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginModal;
