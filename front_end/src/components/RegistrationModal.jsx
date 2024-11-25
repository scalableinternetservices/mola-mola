// src/components/RegisterModal.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function RegisterModal({ onClose }) {
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    //non-empty check
    if (!email || !username || !password || !confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }
    
    // Perform registration (for now, just update the context)
    register({ email, username, password });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-md p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Create an Account</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-2">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Username:</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Confirm Password:</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md p-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
            Register
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-2 bg-gray-500 text-white py-2 rounded-md"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterModal;
