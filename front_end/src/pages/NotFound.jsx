// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-4xl font-bold text-center mb-4">404 - Page Not Found</h1>
      <p className="text-center text-lg">Oops! The page you're looking for doesn't exist.</p>
      <div className="flex justify-center mt-6">
        <Link
          to="/"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Go back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;

