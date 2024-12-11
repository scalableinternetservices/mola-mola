import React, { useState, useEffect, useContext } from 'react';
import { getReceivedInvites, getSentInvites, acceptInvitation, declineInvitation } from '../api';  // Import API helper functions
import { AuthContext } from '../context/AuthContext';

const NotificationList = () => {
  const [receivedInvitations, setReceivedInvitations] = useState([]);
  const [sentInvitations, setSentInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);
  const { token, user } = auth || {};

  // Function to fetch received invitations
  const fetchReceivedInvitations = async () => {
    try {
      const response = await getReceivedInvites(user.id, token); // Call the getReceivedInvites function
      setReceivedInvitations(response);
    } catch (err) {
      setError('Failed to fetch received invitations');
    }
  };

  // Function to fetch sent invitations
  const fetchSentInvitations = async () => {
    try {
      const response = await getSentInvites(user.id, token); // Call the getSentInvites function
      setSentInvitations(response);
    } catch (err) {
      setError('Failed to fetch sent invitations');
    }
  };

  // Function to handle accepting an invitation
  const handleAccept = async (id) => {
    setError(null); // Reset error state before making the API call
    try {
      const response = await acceptInvitation(id, token);  // Call the acceptInvitation function
      if (response.status === 'success') {
        setReceivedInvitations((prevInvitations) =>
          prevInvitations.map((invitation) =>
            invitation.id === id ? { ...invitation, status: 'accepted' } : invitation
          )
        );
      } else {
        setError('Failed to accept invitation');
      }
    } catch (err) {
      setError('Failed to accept invitation');
    }
  };

  // Function to handle declining an invitation
  const handleDecline = async (id) => {
    setError(null); // Reset error state before making the API call
    try {
      const response = await declineInvitation(id, token);  // Call the declineInvitation function
      if (response.status === 'success') {
        setReceivedInvitations((prevInvitations) =>
          prevInvitations.map((invitation) =>
            invitation.id === id ? { ...invitation, status: 'declined' } : invitation
          )
        );
      } else {
        setError('Failed to decline invitation');
      }
    } catch (err) {
      setError('Failed to decline invitation');
    }
  };

  // Fetch both received and sent invitations on mount
  useEffect(() => {
    setLoading(true);  // Start loading
    fetchReceivedInvitations();
    fetchSentInvitations();
    setLoading(false);  // End loading
  }, []);

  if (loading) {
    return <div>Loading invitations...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Your Invitations</h2>

      {/* Received Invitations Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Received Invitations</h3>
        <div className="space-y-4">
          {receivedInvitations.map((invitation) => (
            <div
              key={invitation.id}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md"
            >
              <div>
                <h4 className="text-lg font-medium">{invitation.name}</h4>
                <p className="text-sm text-gray-500">Status: {invitation.status}</p>
              </div>
              <div className="flex space-x-2">
                {invitation.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleAccept(invitation.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecline(invitation.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                    >
                      Decline
                    </button>
                  </>
                ) : (
                  <p className="text-sm font-medium text-gray-400">
                    {invitation.status === 'accepted' ? 'Accepted' : 'Declined'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Partition between received and sent invites */}
      <hr className="my-6 border-t-2 border-gray-200" />

      {/* Sent Invitations Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Sent Invitations</h3>
        <div className="space-y-4">
          {sentInvitations.map((invitation) => (
            <div
              key={invitation.id}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md"
            >
              <div>
                <h4 className="text-lg font-medium">Event ID: {invitation.event_id}</h4>
                <p className="text-sm text-gray-500">Invitee ID: {invitation.invitee_id}</p>
                <p className="text-sm text-gray-500">Status: {invitation.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationList;
