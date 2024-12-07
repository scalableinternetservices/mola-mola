import React, { useContext, useState, useEffect } from 'react';
import { CommentsContext } from '../context/CommentsContext';
import { AuthContext } from '../context/AuthContext';
import { getUserByID } from '../api';

function Comments({ eventId }) {
  const { auth } = useContext(AuthContext);
  const { getCommentsByEventId, fetchCommentsForEvent, addComment, updateComment, deleteComment } = useContext(CommentsContext);

  const [content, setContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  // Map of user_id -> username
  const [usernames, setUsernames] = useState({});

  const eventComments = getCommentsByEventId(eventId);

  useEffect(() => {
    // Fetch comments when component mounts or eventId changes
    fetchCommentsForEvent(eventId);
  }, [eventId, fetchCommentsForEvent]);

  useEffect(() => {
    // Once we have comments, find user_ids we don't have usernames for
    const missingUserIds = eventComments
      .map((c) => c.user_id)
      .filter((userId) => !(userId in usernames));

    // Remove duplicates
    const uniqueMissingUserIds = [...new Set(missingUserIds)];

    if (uniqueMissingUserIds.length > 0) {
      // Fetch usernames for these missing user_ids
      Promise.all(
        uniqueMissingUserIds.map(async (userId) => {
          try {
            const user = await getUserByID(userId);
            return { userId, username: user.username };
          } catch (error) {
            // If we can't find the user or get an error, use 'anonymous'
            return { userId, username: 'anonymous' };
          }
        })
      ).then((results) => {
        const newEntries = {};
        for (let { userId, username } of results) {
          newEntries[userId] = username;
        }
        setUsernames((prev) => ({ ...prev, ...newEntries }));
      });
    }
  }, [eventComments, usernames]);

  const handleAddCommentSubmit = async (e) => {
    e.preventDefault();
    if (!auth?.user) {
      alert('Please log in to add a comment.');
      return;
    }
    if (content.trim() === '') {
      alert('Comment cannot be empty.');
      return;
    }
    try {
      await addComment(eventId, content.trim(), auth.token);
      setContent('');
    } catch (error) {
      alert('Failed to add comment. Please try again.');
    }
  };

  const handleEditClick = (comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    if (!auth?.user) {
      alert('Please log in to edit a comment.');
      return;
    }
    if (editingContent.trim() === '') {
      alert('Comment cannot be empty.');
      return;
    }
    try {
      await updateComment(eventId, editingCommentId, editingContent.trim(), auth.token);
      setEditingCommentId(null);
      setEditingContent('');
    } catch (error) {
      alert('Failed to update comment. Please try again.');
    }
  };

  const handleDeleteClick = async (comment) => {
    if (!auth?.user) {
      alert('Please log in to delete a comment.');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this comment?');
    if (!confirmed) return;

    try {
      await deleteComment(eventId, comment.id, auth.token);
    } catch (error) {
      alert('Failed to delete comment. Please try again.');
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Comments</h3>
      {eventComments.length > 0 ? (
        eventComments.map((comment) => {
          const isOwner = auth?.user && auth.user.id === comment.user_id;
          const displayUsername = usernames[comment.user_id] || 'anonymous';

          if (editingCommentId === comment.id) {
            // Editing mode
            return (
              <div key={comment.id} className="mb-4">
                <form onSubmit={handleUpdateComment}>
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                  ></textarea>
                  <div className="mt-2 flex space-x-2">
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                      Save
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-500 text-white rounded-md"
                      onClick={() => {
                        setEditingCommentId(null);
                        setEditingContent('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            );
          } else {
            // Normal mode
            return (
              <div key={comment.id} className="mb-4">
                <p className="text-gray-800">
                  <strong>{displayUsername}</strong>: {comment.content}
                </p>
                {isOwner && (
                  <div className="flex space-x-2 mt-1">
                    <button
                      onClick={() => handleEditClick(comment)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(comment)}
                      className="px-2 py-1 bg-red-500 text-white rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          }
        })
      ) : (
        <p>No comments yet. Be the first to comment!</p>
      )}

      {/* Comment Form */}
      {auth?.user ? (
        <form onSubmit={handleAddCommentSubmit} className="mt-4">
          <textarea
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Add a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md">
            Post Comment
          </button>
        </form>
      ) : (
        <p className="text-red-500 mt-4">Please log in to post a comment.</p>
      )}
    </div>
  );
}

export default Comments;
