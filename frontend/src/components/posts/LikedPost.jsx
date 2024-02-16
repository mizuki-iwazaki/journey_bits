import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../user/AuthContext';
import PostCard from './PostCard';

const LikedPosts = () => {
  const { token, userId } = useContext(AuthContext);
  const [posts, setPosts] = useState([])
  const [currentImageIndices, setCurrentImageIndices] = useState({});
  const [likedPosts, setLikedPosts] = useState([]);
  const [likes, setLikes] = useState({});
  const [bookmarks, setBookmarks] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({});
  const handleToggleExpand = (postId) => {
    setExpandedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  useEffect(() => {
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      axios.get(`${process.env.REACT_APP_API_URL}/api/v1/posts/liked_posts`, config)
        .then(response => {
          const themes = {};
          const users = {};
          if (response.data.included) {
            response.data.included.forEach(item => {
              if (item.type === 'theme') {
                themes[item.id] = item.attributes.name;
              }
              if (item.type === 'user') {
                users[item.id] = item.attributes.name;
              }
            });
          }

          const initialImageIndices = {};

          const initialLikes = {};
          response.data.data.forEach(post => {
            initialLikes[post.id] = post.attributes.liked_by_user;
          });
          setLikes(initialLikes);

          const initialBookmarks ={};
          response.data.data.forEach(post => {
            initialBookmarks[post.id] = post.attributes.bookmarked_by_user;
          });
          setBookmarks(initialBookmarks);
          const postsData = response.data.data.map(item => {
            const themeId = item.relationships.theme.data.id;
            const postUserId = item.relationships.user.data.id;
            const location = item.attributes.location ? {
              name: item.attributes.location.name,
              latitude: item.attributes.location.latitude,
              longitude: item.attributes.location.longitude,
              address: item.attributes.location.address
            } : null;
            const imageUrls = item.attributes.image_urls ? item.attributes.image_urls.map(imageObj => ({
              id: imageObj.id,
              url: new URL(imageObj.url, process.env.REACT_APP_API_URL).href
            })) : [];
            initialImageIndices[item.id] = 0;


            return {
              id: item.id,
              theme: themes[themeId],
              user: users[postUserId],
              userId: postUserId,
              content: item.attributes.content,
              location: location,
              imageUrls: imageUrls,
              liked: initialLikes[item.id],
              bookmarked: initialBookmarks[item.id],
            };
          });
          setLikedPosts(postsData);
          setCurrentImageIndices(initialImageIndices);
        })
        .catch(error => {
          console.error('Error fetching liked posts:', error);
        });
    }
  }, [token, userId]);

  const handleLike = (postId) => {
    const currentLikeStatus = likes[postId];

    const updateLikeStatus = (newLikeStatus) => {
      setLikes(prevLikes => ({
          ...prevLikes,
          [postId]: newLikeStatus
      }));
    };
    if (currentLikeStatus) {
      axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/posts/${postId}/likes`, {
          headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        console.log('Like removed', response);
        updateLikeStatus(response.data.data.attributes.liked_by_user);
      })
      .catch(error => {
        console.error('Error removing like:', error);
      });
    } else {
      axios.post(`${process.env.REACT_APP_API_URL}/api/v1/posts/${postId}/likes`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
          console.log('Like added', response);
          updateLikeStatus(response.data.data.attributes.liked_by_user);
      })
      .catch(error => {
          console.error('Error adding like:', error);
      });
    }
  };
  
  const handleBookmark = (postId) => {
    const currentBookmarkStatus = bookmarks[postId];

    const updateBookmarkStatus = (newBookmarkStatus) => {
      setBookmarks(prevBookmarks => ({
        ...prevBookmarks,
        [postId]: newBookmarkStatus
      }));
    };
  if (currentBookmarkStatus) {
    axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/posts/${postId}/bookmarks`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      console.log('Bookmark removed', response);
      updateBookmarkStatus(response.data.data.attributes.bookmarked_by_user);
    })
    .catch(error => {
      console.error('Error removing bookmark:', error);
    });
  } else {
    axios.post(`${process.env.REACT_APP_API_URL}/api/v1/posts/${postId}/bookmarks`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
        console.log('Bookmark added', response);
        updateBookmarkStatus(response.data.data.attributes.bookmarked_by_user);
    })
    .catch(error => {
        console.error('Error adding bookmark:', error);
    });
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
      [postId]: prevIndices[postId] + 1 < likedPosts.find(post => post.id === postId).imageUrls.length ? prevIndices[postId] + 1 : 0
    }));
  };
  
  const handlePrevImage = (postId) => {
    setCurrentImageIndices(prevIndices => ({
      ...prevIndices,
      [postId]: prevIndices[postId] - 1 >= 0 ? prevIndices[postId] - 1 : likedPosts.find(post => post.id === postId).imageUrls.length - 1
    }));
  };

  return (
    <div className="form-container mx-auto">
        <div className="grid-container">
          {likedPosts.length > 0 && likedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDeletePost={deletePost}
              isExpanded={expandedPosts[post.id]}
              onToggleExpand={handleToggleExpand}
              currentImageIndex={currentImageIndices[post.id]}
              onNextImage={handleNextImage}
              onPrevImage={handlePrevImage}
              onLike={handleLike}
              liked={likes}
              onBookmark={handleBookmark}
              bookmarked={bookmarks}
              loggedInUserId={userId}
            />
          ))}
        </div>
      </div>
  );
};

export default LikedPosts;
