// src/components/RegistrationModal.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function RegisterModal({ onClose }) {
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });
      alert('Registration successful!');
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-md p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Create an Account</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded mb-2"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded mb-2"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded mb-2"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded mb-4"
          />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
            Register
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-2 bg-gray-500 text-white py-2 rounded"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterModal;