import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { message, Spin, Input, List, Button, Radio } from 'antd';
import { getUserByID, getUsersByName, followUser } from '../api';

const { Search } = Input;

function FollowPage() {
  const { auth } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [searchedUser, setSearchedUser] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchMode, setSearchMode] = useState('id'); // Default to search by ID

  useEffect(() => {
    if (auth.token) {
      setLoading(false);
    }
  }, [auth.token]);

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

  // Handle follow action
  const handleFollow = async (userId) => {
    try {
      const followData = { follow: { event_id: 1, followee_id: userId } };
      await followUser(followData);
      message.success('Follow request sent successfully');
    } catch (error) {
      message.error('Failed to send follow request');
    }
  };

  if (loading || searchLoading) {
    return (
      <div className="loading-container" style={{ textAlign: 'center', marginTop: '20px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '80px 20px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Follow Page</h2>

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

      {searchedUser && searchedUser.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3>{searchMode === 'id' ? 'User Found' : 'Users Found'}:</h3>
          <List
            itemLayout="horizontal"
            dataSource={searchedUser} // Now supports multiple users for search by name
            renderItem={(user) => (
              <List.Item
                actions={[
                  <Button onClick={() => handleFollow(user.id)}>
                    Follow
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={user.username}
                  description={`Followers: ${user.followers_count}`}
                />
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
}

export default FollowPage;
