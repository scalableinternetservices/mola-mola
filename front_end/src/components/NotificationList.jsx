// src/components/NotificationList.jsx
import React, { useState } from 'react';

const NotificationList = () => {
  // Sample invitations data. In a real app, this might come from an API or a parent component's state.
  const [invitations, setInvitations] = useState([
    { id: 1, name: "Event A", status: "pending" },
    { id: 2, name: "Event B", status: "pending" },
    { id: 3, name: "Event C", status: "pending" },
  ]);

  // Function to handle accepting an invitation
  const acceptInvitation = (id) => {
    setInvitations((prevInvitations) =>
      prevInvitations.map((invitation) =>
        invitation.id === id ? { ...invitation, status: "accepted" } : invitation
      )
    );
  };

  // Function to handle declining an invitation
  const declineInvitation = (id) => {
    setInvitations((prevInvitations) =>
      prevInvitations.map((invitation) =>
        invitation.id === id ? { ...invitation, status: "declined" } : invitation
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Your Invitations</h2>
      <div className="space-y-4">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md"
          >
            <div>
              <h3 className="text-lg font-medium">{invitation.name}</h3>
              <p className="text-sm text-gray-500">Status: {invitation.status}</p>
            </div>
            <div className="flex space-x-2">
              {invitation.status === "pending" ? (
                <>
                  <button
                    onClick={() => acceptInvitation(invitation.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => declineInvitation(invitation.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                  >
                    Decline
                  </button>
                </>
              ) : (
                <p className="text-sm font-medium text-gray-400">
                  {invitation.status === "accepted" ? "Accepted" : "Declined"}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationList;

