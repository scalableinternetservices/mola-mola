// src/components/FollowUsersModal.jsx
import React, { useState, useContext } from 'react';
import { Modal, Button, Input, List, Radio, message, Spin } from 'antd';
import { getUserByID, getUsersByName, inviteUser } from '../api'; // Your API calls
import { AuthContext } from '../context/AuthContext';

const { Search } = Input;

const FollowUsersModal = ({ visible, onClose, eventId }) => {
  const { auth } = useContext(AuthContext);
  const [searchMode, setSearchMode] = useState('id');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchedUser, setSearchedUser] = useState(null);

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
      setSearchedUser(null);
    }
    setSearchLoading(false);
  };

  // Handle invite action
  const handleInvite = async (userId) => {
    const token = auth?.token;
    try {
      const inviteData = {event_id: eventId, followee_id: userId};
      console.log(inviteData)
      const response = await inviteUser(inviteData, token);
      //console.log(inviteData)

      // If the response contains an error, show the error message
      if (response.error) {
        message.error(response.error); // Display the error message from the API
      } else {
        message.success('Invite request sent successfully');
      }
    } catch (error) {
      message.error('Failed to send invite request:', error);
    }
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
        searchedUser && searchedUser.length > 0 && (
          <List
            itemLayout="horizontal"
            dataSource={searchedUser}
            renderItem={(user) => (
              <List.Item
                actions={[
                  <Button onClick={() => handleInvite(user.id)}>
                    Follow
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={user.username}
                />
              </List.Item>
            )}
          />
        )
      )}
    </Modal>
  );
};

export default FollowUsersModal;
