import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext'; // Make sure to import AuthContext
import { message, Spin, Input, List, Button } from 'antd'; // Import Ant Design components
import { getUserByID, followUser } from '../api'; // Make sure the correct API methods are imported

const { Search } = Input; // Destructure Search component from Input

function FollowPage() {
  const { auth } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [searchedUser, setSearchedUser] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (auth.token) {
      setLoading(false);
    }
  }, [auth.token]);

  const handleSearch = async (value) => {
    if (!value) {
      message.error('Please enter a valid user ID');
      return;
    }
    setSearchLoading(true);
    try {
      const response = await getUserByID(value);
      setSearchedUser(response);
    } catch (error) {
      message.error('Failed to find user');
      setSearchedUser(null);
    }
    setSearchLoading(false);
  };

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
        <Search
          placeholder="Enter user ID"
          enterButton="Search"
          size="large"
          onSearch={handleSearch}
        />
      </div>

      {searchedUser && (
        <div style={{ marginBottom: '30px' }}>
          <h3>User Found:</h3>
          <List
            itemLayout="horizontal"
            dataSource={[searchedUser]} // Wrap the searched user in an array
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
