// src/components/Comments.jsx
import React, { useState } from 'react';

function Comments({ eventId }) {
  const [comments, setComments] = useState([
    // Mock comments data
    { id: 1, text: 'Looking forward to this event!', author: 'Alice' },
    { id: 2, text: 'Can’t wait!', author: 'Bob' },
  ]);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim() === '') return;

    const comment = {
      id: comments.length + 1,
      text: newComment,
      author: 'Anonymous', // Replace with actual user when integrating authentication
    };
    setComments([...comments, comment]);
    setNewComment('');
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Comments</h3>
      {comments.map((comment) => (
        <div key={comment.id} className="mb-4">
          <p className="text-gray-800">{comment.text}</p>
          <p className="text-gray-600 text-sm">- {comment.author}</p>
        </div>
      ))}
      <div className="mt-6">
        <textarea
          className="w-full border border-gray-300 rounded-md p-3"
          rows="3"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <button
          onClick={handleAddComment}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Post Comment
        </button>
      </div>
    </div>
  );
}

export default Comments;
