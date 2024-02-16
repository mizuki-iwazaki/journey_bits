import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import EditUserModal from './EditUserModal';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import PostCard from '../posts/PostCard';
import LikedPost from '../posts/LikedPost';
import BookmarkedPosts from '../posts/BookmarkedPost';

const MyPage = () => {
  const apiBaseUrl = process.env.REACT_APP_API_URL;
  const { token } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [currentImageIndices, setCurrentImageIndices] = useState({});

  useEffect(() => {
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
          .map(post => {
            const themeId = post.relationships.theme.data.id;
            const postUserId = post.relationships.user.data.id;
            const location = post.attributes.location ? {
              name: post.attributes.location.name,
              latitude: post.attributes.location.latitude,
              longitude: post.attributes.location.longitude,
              address: post.attributes.location.address
            } : null;
            const imageUrls = post.attributes.image_urls ? post.attributes.image_urls.map(imageObj => ({
              id: imageObj.id,
              url: new URL(imageObj.url, process.env.REACT_APP_API_URL).href
            })) : [];

            return {
              id: post.id,
              theme: themes[themeId],
              user: users[postUserId],
              userId: postUserId,
              content: post.attributes.content,
              location,
              imageUrls,
              likes_count: post.attributes.likes_count,
              bookmarks_count: post.attributes.bookmarks_count,
            };
          });
          setPosts(postsData);

          const initialIndices = postsData.reduce((acc, post) => {
            acc[post.id] = 0;
            return acc;
          }, {});
          setCurrentImageIndices(initialIndices);
        })
        .catch(error => console.error("There was an error!", error));
      }
}, [token]);

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
    console.log('Profile updated successfully', response.data);
    setUserData(response.data);
    setEditModalOpen(false);
  } catch (error) {
    console.error('Error updating profile:', error);
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
      .catch(error => {
        console.error('Error delete post:', error);
      });
  } else {
    console.log('トークンが取得できません');
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

  return (
    <div className="py-14">
  <div className="avatar-container" style={{ textAlign: 'center' }}>
    {userData ? (
      <>
        <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
          {userData.data.attributes.name}
        </div>
        <div style={{ marginTop: '10px', display: 'inline-block' }}>
          {userData.data.attributes.avatar ? (
            <img
              src={`${apiBaseUrl}${userData.data.attributes.avatar}`}
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
        <div style={{ marginTop: '10px', fontSize: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
      <Tabs>
        <TabList>
          <Tab>過去の投稿</Tab>
          <Tab>いいねリスト</Tab>
          <Tab>ブックマークリスト</Tab>
        </TabList>
          <TabPanel>
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
                    currentImageIndex={currentImageIndices[post.id]}
                    onNextImage={handleNextImage}
                    onPrevImage={handlePrevImage}
                    loggedInUserId={userData.data.id}
                  />
                ))}
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <LikedPost />
          </TabPanel>
          <TabPanel>
            <BookmarkedPosts />
          </TabPanel>
      </Tabs>
    </div>
  );
};

export default MyPage;
