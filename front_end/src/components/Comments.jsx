// src/components/Comments.jsx
import React, { useContext, useState } from 'react';
import { CommentsContext } from '../context/CommentsContext';
import { AuthContext } from '../context/AuthContext';
import { usersData } from '../mockdata/usersData'; // Assuming you have user data

function Comments({ eventId }) {
  const { comments, addComment, getCommentsByEventId } = useContext(CommentsContext);
  const { auth } = useContext(AuthContext);
  const [content, setContent] = useState('');

  const eventComments = getCommentsByEventId(eventId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!auth.user) {
      alert('Please log in to add a comment.');
      return;
    }
    if (content.trim() === '') {
      alert('Comment cannot be empty.');
      return;
    }
    addComment(eventId, auth.user?.id, content.trim());
    setContent('');
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Comments</h3>
      {eventComments.length > 0 ? (
        eventComments.map((comment) => {
          const commenter = usersData.find((u) => u.id === comment.userId);
          return (
            <div key={comment.id} className="mb-4">
              <p className="text-gray-800">
                <strong>{commenter?.username || 'Unknown User'}</strong>: {comment.content}
              </p>
              <p className="text-gray-500 text-sm">{new Date(comment.createdAt).toLocaleString()}</p>
            </div>
          );
        })
      ) : (
        <p>No comments yet. Be the first to comment!</p>
      )}
      {/* Comment Form */}
      {auth.user ? (
        <form onSubmit={handleSubmit} className="mt-4">
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
