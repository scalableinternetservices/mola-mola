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

// Fetch all events (token required)
export const fetchAllEvents = async (token) => {
    if (!token) {
      throw new Error('Authentication token is required to fetch events.');
    }
    return apiRequest('/events', 'GET', null, token);
};
  
  // Fetch a single event by ID (token required)
export const fetchEventById = async (id, token) => {
    if (!token) {
      throw new Error('Authentication token is required to fetch event details.');
    }
    return apiRequest(`/events/${id}`, 'GET', null, token);
};  

// Create RSVP
export const createRSVP = async (rsvpData, token) => {
    return apiRequest('/rsvps', 'POST', rsvpData, token);
  };
  
// Modify RSVP
export const modifyRSVP = async (rsvpData, token) => {
return apiRequest('/rsvps', 'PUT', rsvpData, token);
};

// Delete RSVP
export const deleteRSVP = async (rsvpData, token) => {
return apiRequest('/rsvps', 'DELETE', rsvpData, token);
};