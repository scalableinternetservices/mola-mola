const API_BASE_URL = 'http://localhost:3000/api';

// Helper function for making API requests
const apiRequest = async (url, method, body = null, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      // Parse error response
      const errorData = await response.json();
      throw new Error(errorData.error || 'Something went wrong');
    }

    // Parse and return response JSON
    return response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw new Error(error.message || 'An unknown error occurred');
  }
};

// Exported APIs

// Register API
export const registerUser = async (userData) => {
  return apiRequest('/register', 'POST', { user: userData });
};

// Login API
export const loginUser = async (credentials) => {
  return apiRequest('/login', 'POST', { user: credentials });
};

// Heatmap API
export const getTotalEvents = async (url) => {
  return apiRequest(url, 'GET');
};

// Invitation API
export const getInvites = async (url) => {
  return apiRequest(url, 'GET');
};

// Event API
export const getEvent = async (url) => {
  return apiRequest(url, 'GET');
};

// Invite API
export const followUser = async (followData) => {
  return apiRequest('/follows', 'POST', { follow: followData });
};

// User by id API
export const getUserByID = async (url) => {
  return apiRequest('/users/'+url, 'GET');
};

export const getUsersByName = async (url) => {
  return apiRequest('/users?keyword='+url, 'GET');
};

export const getUsers = async (url) => {
  return apiRequest('/users', 'GET');
};