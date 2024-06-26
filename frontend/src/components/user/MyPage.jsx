import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import EditUserModal from './EditUserModal';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Tabs, Tab, Box } from '@mui/material';
import PostCard from './PostCard';
import LikedPost from './LikedPost';
import BookmarkedPosts from './BookmarkedPost';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MyPage = () => {
  const { token } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [currentImageIndices, setCurrentImageIndices] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchPosts = useCallback(() => {
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      axios.get(`${process.env.REACT_APP_API_URL}/api/v1/mypage`, config)
      .then(response => {
        setUserData(response.data);

        const themes = response.data.included
        .filter(item => item.type === 'theme')
        .reduce((acc, theme) => ({ ...acc, [theme.id]: theme.attributes.name }), {});
        const users = response.data.included
        .filter(item => item.type === 'user')
        .reduce((acc, user) => ({ ...acc, [user.id]: user.attributes.name }), {});

        const postsData = response.data.included
        .filter(item => item.type === 'post')
        .map(post => ({
          id: post.id,
          theme: themes[post.relationships.theme.data.id],
          user: users[post.relationships.user.data.id],
          userId: post.relationships.user.data.id,
          content: post.attributes.content,
          location: post.attributes.location ? {
            name: post.attributes.location.name,
            latitude: post.attributes.location.latitude,
            longitude: post.attributes.location.longitude,
            address: post.attributes.location.address
          } : null,
          imageUrls: post.attributes.image_urls ? post.attributes.image_urls.map(imageObj => ({
            id: imageObj.id,
            url: new URL(imageObj.url, process.env.REACT_APP_API_URL).href
          })) : [],
          likes_count: post.attributes.likes_count,
          bookmarks_count: post.attributes.bookmarks_count,
          created_at: post.attributes.created_at, // created_atを加工
        }))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // ここでソート
  
        setPosts(postsData);
      })
      .catch(error => console.error("There was an error!", error));
    }
  }, [token]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleToggleExpand = (postId) => {
    setExpandedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleSave = async (editData) => {
    const formData = new FormData();
    formData.append('user[name]', editData.name);
    if (editData.avatarChanged) {
      if (editData.removeAvatar) {
        formData.append('user[remove_avatar]', 'true');
      }
      else if (editData.avatar) {
        formData.append('user[avatar]', editData.avatar);
      }
    }

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/v1/registration`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
      setEditModalOpen(false);
    } catch {
      alert('プロフィール更新時にエラーが発生しました');
    }
  };

  const deletePost = (postId) => {
    if (window.confirm('投稿を削除しますか？') && token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/posts/${postId}`, config)
      .then(() => {
        setPosts(posts.filter(post => post.id !== postId));
      })
      .catch(() => {
        alert('投稿の削除に失敗しました。');
      });
    }
  };

  const handleNextImage = (postId) => {
    setCurrentImageIndices(prevIndices => ({
      ...prevIndices,
      [postId]: prevIndices[postId] + 1 < posts.find(post => post.id === postId).imageUrls.length ? prevIndices[postId] + 1 : 0
    }));
  };

  const handlePrevImage = (postId) => {
    setCurrentImageIndices(prevIndices => ({
      ...prevIndices,
      [postId]: prevIndices[postId] - 1 >= 0 ? prevIndices[postId] - 1 : posts.find(post => post.id === postId).imageUrls.length - 1
    }));
  };

  const onUpdate = () => {
    fetchPosts();
    setEditModalOpen(false);
  };

  return (
    <div className="py-2">
      <div className="avatar-container" style={{ textAlign: 'center' }}>
        {userData ? (
          <>
            <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
              {userData.data.attributes.name}
            </div>
            <div style={{ marginTop: '10px', display: 'inline-block' }}>
              {userData.data.attributes.avatar ? (
                <img
                  src={userData.data.attributes.avatar}
                  alt="User Avatar"
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <AccountCircleIcon style={{ fontSize: '100px' }} />
              )}
            </div>
            <div style={{ marginTop: '10px', marginBottom: '10px', fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              ユーザー情報を編集
              <EditIcon style={{ marginLeft: '10px', color: 'rgba(0, 0, 0, 0.54)', cursor: 'pointer' }} onClick={() => setEditModalOpen(true)} />
            </div>
          </>
        ) : null}
        <EditUserModal
          open={editModalOpen}
          handleClose={() => setEditModalOpen(false)}
          userData={userData}
          handleSave={handleSave}
        />
      </div>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
            <Tab label="過去の投稿" />
            <Tab label="いいねリスト" />
            <Tab label="ブックマークリスト" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
            <div className="form-container mx-auto">
              <div className="grid-container">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={{
                      ...post,
                      likes_count: post.likes_count,
                      bookmarks_count: post.bookmarks_count,
                    }}
                    isExpanded={expandedPosts[post.id]}
                    onToggleExpand={handleToggleExpand}
                    onDeletePost={deletePost}
                    currentIndex={currentImageIndices[post.id]}
                    onNextImage={handleNextImage}
                    onPrevImage={handlePrevImage}
                    loggedInUserId={userData.data.id}
                    onUpdate={onUpdate}
                    onClose={() => setEditModalOpen(false)}
                  />
                ))}
              </div>
            </div>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <LikedPost />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <BookmarkedPosts />
          </TabPanel>
      </Box>
    </div>
  );
};

export default MyPage;