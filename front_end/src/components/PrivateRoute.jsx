// src/components/PrivateRoute.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const { auth } = useContext(AuthContext);
  const { user } = auth;

  return user ? children : <Navigate to="/home" />;
}

export default PrivateRoute;
