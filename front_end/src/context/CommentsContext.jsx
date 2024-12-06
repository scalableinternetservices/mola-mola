import React, { createContext, useState, useCallback } from 'react';
import { getCommentsForEvent, createCommentForEvent, updateCommentForEvent, deleteCommentForEvent } from '../api';

export const CommentsContext = createContext();

export const CommentsProvider = ({ children }) => {
  const [commentsByEvent, setCommentsByEvent] = useState({});

  const fetchCommentsForEvent = useCallback(async (eventId) => {
    try {
      const comments = await getCommentsForEvent(eventId);
      setCommentsByEvent((prev) => ({ ...prev, [eventId]: comments }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, []);

  const addComment = async (eventId, content, token) => {
    try {
      const newComment = await createCommentForEvent(eventId, content, token);
      setCommentsByEvent((prev) => {
        const existingComments = prev[eventId] || [];
        return { ...prev, [eventId]: [...existingComments, newComment] };
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  // Update an existing comment
  const updateComment = async (eventId, commentId, content, token) => {
    try {
      const updatedComment = await updateCommentForEvent(eventId, commentId, content, token);
      setCommentsByEvent((prev) => {
        const existingComments = prev[eventId] || [];
        const updatedComments = existingComments.map((c) => (c.id === commentId ? updatedComment : c));
        return { ...prev, [eventId]: updatedComments };
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  };

  // Delete a comment
  const deleteComment = async (eventId, commentId, token) => {
    try {
      await deleteCommentForEvent(eventId, commentId, token);
      setCommentsByEvent((prev) => {
        const existingComments = prev[eventId] || [];
        const updatedComments = existingComments.filter((c) => c.id !== commentId);
        return { ...prev, [eventId]: updatedComments };
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  };

  const getCommentsByEventId = (eventId) => {
    return commentsByEvent[eventId] || [];
  };

  return (
    <CommentsContext.Provider value={{ getCommentsByEventId, fetchCommentsForEvent, addComment, updateComment, deleteComment }}>
      {children}
    </CommentsContext.Provider>
  );
};
