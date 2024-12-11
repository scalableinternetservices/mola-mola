import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Input, List, Radio, message, Spin } from 'antd';
import { getUserByID, getUsersByName, inviteUser, getSentInvites, cancelSentInvite } from '../api'; // Your API calls
import { AuthContext } from '../context/AuthContext';

const { Search } = Input;

const FollowUsersModal = ({ visible, onClose, eventId }) => {
  const { auth } = useContext(AuthContext);
  const [searchMode, setSearchMode] = useState('id');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchedUser, setSearchedUser] = useState([]);
  const [sentInvites, setSentInvites] = useState([]);
  const [loadingSentInvites, setLoadingSentInvites] = useState(false);

  // Fetch the sent invitations when the modal is opened
  useEffect(() => {
    if (visible) {
      const fetchSentInvitesData = async () => {
        setLoadingSentInvites(true);
        try {
          const response = await getSentInvites(auth?.user?.id, auth?.token);
          setSentInvites(response); // Store the sent invitations
        } catch (error) {
          message.error('Failed to load sent invitations');
        }
        setLoadingSentInvites(false);
      };

      fetchSentInvitesData();
    }
  }, [visible, auth?.user?.id, auth?.token]);

  // Handle search based on the selected mode (ID or Name)
  const handleSearch = async (value) => {
    if (!value) {
      message.error('Please enter a valid input');
      return;
    }

    setSearchLoading(true);
    try {
      let response;
      if (searchMode === 'id') {
        response = await getUserByID(value);
        setSearchedUser([response]); // Wrap the response in an array for consistency
      } else if (searchMode === 'name') {
        response = await getUsersByName(value);
        setSearchedUser(response); // Multiple results are returned here
      }
    } catch (error) {
      message.error('Failed to find user');
      setSearchedUser([]);
    }
    setSearchLoading(false);
  };

  // Handle the invite action
  const handleInvite = async (userId) => {
    const token = auth?.token;
    try {
      const inviteData = { event_id: eventId, invitee_id: userId };
      const response = await inviteUser(inviteData, token);

      if (response.error) {
        message.error(response.error);
      } else {
        message.success('Invite sent successfully');
        
        // Update the sentInvites array to include the new invite
        const newInvite = { invitee_id: userId, event_id: eventId, status: 'pending' };
        setSentInvites((prevSentInvites) => [...prevSentInvites, newInvite]); // Add new invite to the state
      }
    } catch (error) {
      message.error('Failed to send invite');
    }
  };

  const handleCancelInvite = async (userId) => {
  const token = auth?.token;
  const inviteData = {"event_id": eventId, "invitee_id": userId};
  try {
  const response = await cancelSentInvite(inviteData, token);
  // If the response status is 204 (No Content), assume the cancel was successful
  message.success('Invite canceled successfully');
  // Update the sentInvites state locally
  setSentInvites((prevSentInvites) =>
      prevSentInvites.filter((invite) => invite.invitee_id !== userId)
    );
  // Update the searchedUser list to switch the button back to "Invite"
  setSearchedUser((prevSearchedUser) =>
    prevSearchedUser.map((user) =>
      user.id === userId ? { ...user, isInvited: false } : user
     ));
  } catch (error) {
    message.error('Failed to cancel invite');
    console.error('Error canceling invite:', error);
  }
};

  // Check if the current user has already sent an invite to a specific user (based on invitee_id)
  const isInviteSent = (userId) => {
    return sentInvites.some((invite) => invite.invitee_id === userId && invite.status === 'pending');
  };

  // Merge searched users and sent invites to display in one list
  const mergeUserList = () => {
    return searchedUser.map((user) => {
      return {
        ...user,
        isInvited: isInviteSent(user.id), // Check if the user is already invited
      };
    });
  };

  return (
    <Modal
      title="Search and Invite Users"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div style={{ marginBottom: '30px' }}>
        <Radio.Group
          value={searchMode}
          onChange={(e) => setSearchMode(e.target.value)}
          style={{ marginBottom: '20px' }}
        >
          <Radio value="id">Search by ID</Radio>
          <Radio value="name">Search by Name</Radio>
        </Radio.Group>

        <Search
          placeholder={searchMode === 'id' ? 'Enter user ID' : 'Enter username'}
          enterButton="Search"
          size="large"
          onSearch={handleSearch}
        />
      </div>

      {searchLoading ? (
        <Spin size="large" />
      ) : (
        searchedUser.length > 0 && (
          <List
            itemLayout="horizontal"
            dataSource={mergeUserList()} // Merge the search results with the sent invites
            renderItem={(user) => (
              <List.Item
                actions={[
                  user.isInvited ? (
                    <Button onClick={() => handleCancelInvite(user.id)} danger>
                      Cancel
                    </Button>
                  ) : (
                    <Button onClick={() => handleInvite(user.id)}>
                      Invite
                    </Button>
                  ),
                ]}
              >
                <List.Item.Meta title={user.username} />
              </List.Item>
            )}
          />
        )
      )}
    </Modal>
  );
};

export default FollowUsersModal;
