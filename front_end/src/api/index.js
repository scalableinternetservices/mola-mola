const API_BASE_URL = 'http://localhost:3000/api';

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

    // If the response status is not ok (i.e., not 2xx), throw an error
    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (error) {
        // If the response can't be parsed as JSON, just throw the raw status
        errorData = { error: 'Something went wrong' };
      }
      throw new Error(errorData.error || `Error: ${response.status}`);
    }

    // Handle 204 No Content (no body to parse)
    if (response.status === 204) {
      return response;  // Return response without parsing, as there's no content
    }

    // Parse and return the response as JSON if there is a body
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
export const getTotalEvents = async (url, token) => {
    if (!token) {
        throw new Error('Authentication token is required to get a presigned URL.');
    }
    return apiRequest(url, 'GET',null, token);
};


// Invitation API
export const inviteUser = async (inviteData, token) => {
      if (!token) {
        throw new Error('Authentication token is required to create a follow.');
      }
  return apiRequest('/invites', 'POST', {invite: inviteData}, token);
};

export const getSentInvites = async (id, token) => {
  if (!token) {
      throw new Error('Authentication token is required to get sent invites.');
  }
  return apiRequest(`/users/${id}/invites/sent`, 'GET', null, token);
};

export const getReceivedInvites = async (id, token) => {
  if (!token) {
        throw new Error('Authentication token is required to get received invites.');
  }
  return apiRequest(`/users/${id}/invites/received`, 'GET', null, token);
};

export const acceptInvitation = async (id, token) => {
  if (!token) {
        throw new Error('Authentication token is required to get a presigned URL.');
    }
  return apiRequest(`/invites/${id}/accept`, 'POST', null, token);
};

export const declineInvitation = async (id, token) => {
  if (!token) {
        throw new Error('Authentication token is required to get a presigned URL.');
    }
  return apiRequest(`/invites/${id}/decline`, 'POST', null, token);
};

export const cancelSentInvite = async (body, token) => {
  if (!token) {
        throw new Error('Authentication token is required to delete invite.');
    }
  return apiRequest('/invites/delete_by_keys', 'DELETE', body, token);
};

// Event API
export const getEvent = async (url) => {
  return apiRequest(url, 'GET');
};

// Follow API
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

// Fetch all events (token required)
// export const fetchAllEvents = async (token) => {
//     if (!token) {
//       throw new Error('Authentication token is required to fetch events.');
//     }
//     return apiRequest('/events', 'GET', null, token);
// };

export const fetchAllEvents = async (token, page = 1) => {
  if (!token) {
    throw new Error('Authentication token is required to fetch events.');
  }
  // Add the page parameter to the URL
  return apiRequest(`/events?page=${page}`, 'GET', null, token);
};

// pagination API
export const getTotalEventCount = async() =>{
  return apiRequest('/events/total_count', 'GET');
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
    if (!token) {
        throw new Error('Authentication token is required to get a presigned URL.');
      }
    return apiRequest('/rsvps', 'POST', rsvpData, token);
};
  
// Modify RSVP
export const modifyRSVP = async (rsvpData, token) => {
    if (!token) {
        throw new Error('Authentication token is required to get a presigned URL.');
      }
    return apiRequest('/rsvps', 'PUT', rsvpData, token);
};

// Delete RSVP
export const deleteRSVP = async (rsvpData, token) => {
    if (!token) {
        throw new Error('Authentication token is required to get a presigned URL.');
      }
    return apiRequest('/rsvps', 'DELETE', rsvpData, token);
};

// Get Presigned URL for Image Upload
export const getPresignedUrl = async (token) => {
    if (!token) {
      throw new Error('Authentication token is required to get a presigned URL.');
    }
    return apiRequest('/upload', 'POST', null, token);
  };
  
// Create Event API
export const createEvent = async (eventData, token) => {
    if (!token) {
      throw new Error('Authentication token is required to create an event.');
    }
    return apiRequest('/events/', 'POST', { event: eventData }, token);
};

// Delete Event API
export const deleteEvent = async (eventId, token) => {
    if (!token) {
      throw new Error('Authentication token is required to delete an event.');
    }
    return apiRequest(`/events/${eventId}`, 'DELETE', null, token);
  };
  

// Update Event API
export const updateEvent = async (eventId, eventData, token) => {
    if (!token) {
      throw new Error('Authentication token is required to update an event.');
    }
    return apiRequest(`/events/${eventId}`, 'PUT', { event: eventData }, token);
  };

// Update User API
export const updateUser = async (userId, userData, token) => {
    if (!token) {
      throw new Error('Authentication token is required to update a user.');
    }
    return apiRequest(`/users/${userId}`, 'PUT', { user: userData }, token);
};


// Comments API
export const getCommentsForEvent = async (eventId) => {
  return apiRequest(`/events/${eventId}/comments`, 'GET');
};

export const createCommentForEvent = async (eventId, content, token) => {
  if (!token) {
    throw new Error('Authentication token is required to create a comment.');
  }
  return apiRequest(`/events/${eventId}/comments`, 'POST', { comment: { content } }, token);
};

export const updateCommentForEvent = async (eventId, commentId, content, token) => {
  if (!token) {
    throw new Error('Authentication token is required to update a comment.');
  }
  return apiRequest(`/events/${eventId}/comments/${commentId}`, 'PUT', { comment: { content } }, token);
};

export const deleteCommentForEvent = async (eventId, commentId, token) => {
  if (!token) {
    throw new Error('Authentication token is required to delete a comment.');
  }
  return apiRequest(`/events/${eventId}/comments/${commentId}`, 'DELETE', null, token);
};

