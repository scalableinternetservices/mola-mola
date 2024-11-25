// src/context/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Mock registration function
  const register = ({ email, username, password }) => {
    const newUser = {
      id: Date.now(),
      email,
      username,
      followedUsers: [],
    };
    setUser(newUser);
  };

  // Mock login function (for completeness)
  const login = (email, password) => {
    // Implement login logic here
    setUser({ email, username: "Test", followedUsers: [2, 3], id: 5 }); // Mock user
  };

  // Mock logout function
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
