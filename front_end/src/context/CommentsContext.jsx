// src/context/CommentsContext.js
import React, { createContext, useState } from 'react';
import { mockCommentsData } from '../mockdata/commentsData';

export const CommentsContext = createContext();

export const CommentsProvider = ({ children }) => {
  const [comments, setComments] = useState(mockCommentsData);

  // Function to add a new comment
  const addComment = (eventId, userId, content) => {
    const newComment = {
      id: Date.now(),
      eventId,
      userId,
      content,
      createdAt: new Date().toISOString(),
    };
    setComments((prevComments) => [...prevComments, newComment]);
  };

  // Function to get comments for a specific event
  const getCommentsByEventId = (eventId) => {
    return comments.filter((comment) => comment.eventId === eventId);
  };

  return (
    <CommentsContext.Provider value={{ comments, addComment, getCommentsByEventId }}>
      {children}
    </CommentsContext.Provider>
  );
};
