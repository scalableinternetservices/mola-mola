import React, { createContext, useState, useEffect } from 'react';
import { registerUser, loginUser } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    // Initialize state with data from localStorage if available
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return {
      token: token || null,
      user: user ? JSON.parse(user) : null,
    };
  });

  // Persist to localStorage whenever `auth` state changes
  useEffect(() => {
    if (auth.token) {
      localStorage.setItem('token', auth.token);
      localStorage.setItem('user', JSON.stringify(auth.user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [auth]);

  const register = async (userData) => {
    const response = await registerUser(userData);
    setAuth({
      token: response.token,
      user: response.user,
    });
  };

  const login = async (credentials) => {
    const response = await loginUser(credentials);
    setAuth({
      token: response.token,
      user: response.user,
    });
    
    console.log('Auth after login:', auth); // Add this log
    return {
      token: response.token,
      user: response.user,
    };
  };

  const logout = () => {
    setAuth({
      token: null,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};