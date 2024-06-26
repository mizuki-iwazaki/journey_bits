import React, { useState, useEffect, useContext, useCallback } from 'react'; 
import axios from 'axios';
import AuthContext from '../user/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import EditPostComponent from './EditPostComponent';
import Modal from '../user/Modal';
import DeleteIcon from '@mui/icons-material/Delete';
import LikeButton from './LikesButton';
import BookmarkButton from './BookmarksButton';
import ImageSlider from './ImageSlider';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchForm from './SearchForm';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getBackgroundColorByTheme } from './PostCardColor';
import StyleIcon from '@mui/icons-material/Style';

// 投稿を文字数で区切る
const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return { truncated: true, text: text.substring(0, maxLength) + '...' };
  }
  return { truncated: false, text };
};

const PostsComponent = () => {
  const [posts, setPosts] = useState([]);
  const { token, userId: loggedInUserId } = useContext(AuthContext);
  const { isGuest } = useContext(AuthContext);
  const [currentImageIndices, setCurrentImageIndices] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({});
  const [likes, setLikes] = useState({}); 
  const [bookmarks, setBookmarks] = useState({});
  const handleToggleExpand = (postId) => {
    setExpandedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };
  const [isEditing, setIsEditing] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);

  const fetchPosts = useCallback((searchParams = {}) => {
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: {}
      };
      // 検索条件の追加
      if (searchParams.searchTerm) {
        config.params['search'] = searchParams.searchTerm;
      }
      if (searchParams.selectedTheme) {
        config.params['theme_id'] = searchParams.selectedTheme;
      }

      // タグの検索
      if (searchParams.tag) {
        config.params['tag'] =searchParams.tag;
      }

      axios.get(`${process.env.REACT_APP_API_URL}/api/v1/posts`, config)
        .then(response => {
          const themes = {};
          const users = {};
          if (response.data.included) {
            response.data.included.forEach(item => {
              if (item.type === 'theme') {
                themes[item.id] = item.attributes.name;
              }
              if (item.type === 'user') {
                users[item.id] = { name: item.attributes.name, avatarUrl: item.attributes.avatar_url || item.attributes.avatar };
              }
            });
          }
          const initialIndices = response.data.data.reduce((acc, item) => {
            acc[item.id] = 0;
            return acc;
          }, {});
          setCurrentImageIndices(initialIndices);

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

          // 応答データからposts配列を抽出
          const postsData = response.data.data.map(item => {
            const themeId = item.relationships.theme.data.id;
            const postUserId = item.relationships.user.data.id;
            const user = users[postUserId];
            let avatarUrl = user.avatarUrl;
            if (avatarUrl && !avatarUrl.startsWith('http')) {
              avatarUrl = `${process.env.REACT_APP_API_URL}${avatarUrl}`;
            }
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
            const tags = item.attributes.tags || [];

          return {
            id: item.id,
            theme: themes[themeId],
            user: {
              id: postUserId,
              ...users[postUserId],
              avatarUrl: avatarUrl,
            },
            content: item.attributes.content,
            location: location,
            imageUrls: imageUrls,
            status: item.attributes.status,
            tags: tags,
            liked: initialLikes[item.id],
            bookmarked: initialBookmarks[item.id],
          };
        });
        setPosts(postsData);
      })
      .catch(() => {
        alert('投稿の取得に失敗しました。')
      });
    }
  }, [token]);

  const handleTagClick = (tag) => {
    fetchPosts({ tag: tag });
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onUpdate = () => {
    fetchPosts();
    setIsEditing(false);
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

  const handleLike = (postId) => {
    if (isGuest) {
      alert('いいねを実行するにはログインが必要です。');
      return;
    }

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
        updateLikeStatus(response.data.data.attributes.liked_by_user);
      })
      .catch(error => {
        alert('いいねの取り消しに失敗しました。')
      });
    } else {
      axios.post(`${process.env.REACT_APP_API_URL}/api/v1/posts/${postId}/likes`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        updateLikeStatus(response.data.data.attributes.liked_by_user);
      })
      .catch(() => {
          alert('いいねの追加に失敗しました。')
      });
    }
  };

  const handleBookmark = (postId) => {
    if (isGuest) {
      alert('を実行するにはログインが必要です。');
      return;
    }

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
      updateBookmarkStatus(response.data.data.attributes.bookmarked_by_user);
    })
    .catch(() => {
      alert('ブックマークの削除に失敗しました。');
    });
  } else {
    axios.post(`${process.env.REACT_APP_API_URL}/api/v1/posts/${postId}/bookmarks`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      updateBookmarkStatus(response.data.data.attributes.bookmarked_by_user);
    })
    .catch(() => {
      alert('ブックマークの追加に失敗しました。');
    });
  }
};

  return (
    <div className="px-4">
      {/* 投稿一覧 */}
      <div className="form-container mx-auto">
        <div className="flex justify-center">
        {/* 検索フォーム */}
        <SearchForm onSearch={fetchPosts} />
        </div>
      </div>
      <div className="form-container mx-auto px-4">
        <div className="grid-container">
          {posts.map(post => {
            const { truncated, text } = truncateText(post.content, 50);
            const isExpanded = expandedPosts[post.id];
            const isCurrentUser = loggedInUserId ? loggedInUserId.toString() === post.user.id.toString() : false;
            const backgroundColor = getBackgroundColorByTheme(post.theme);

            return (
              <div 
                key={post.id} 
                className="max-w-lg rounded overflow-hidden shadow-lg bg-white flex flex-col justify-between"
                style={{ backgroundColor }} // 背景色を動的に適用
              >
                <div className="px-4 py-2">
                  <div className="py-2 font-bold text-xs text-left">{post.user.name}</div>
                    {post.user.avatarUrl ? (
                      <img className="w-10 h-10 rounded-full mr-4" src={post.user.avatarUrl} alt="Avatar" />
                    ) : (
                      <div className="flex items-center">
                        <AccountCircleIcon style={{ fontSize: 50, marginRight: '1rem' }} />
                      </div>
                    )}
                    <div className="font-bold text-sm pt-2 text-left">テーマ：{post.theme}</div>
                    <p className="text-gray-700 text-left text-sm py-2">
                      {isExpanded ? post.content : text}
                      {truncated && (
                        <button onClick={() => handleToggleExpand(post.id)} className="text-blue-500">
                          {isExpanded ? '隠す' : '続きを読む'}
                        </button>
                      )}
                    </p>
                    <div className="relative">
                      {post.imageUrls.length === 0 && (
                        <img src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/w_800,h_600,c_fill/v1709134445/default.jpeg`} alt="Default" />
                      )}
                      {post.imageUrls.length > 0 && (
                        <ImageSlider
                          imageUrls={post.imageUrls}
                          currentIndex={currentImageIndices[post.id] || 0}
                          onNext={() => handleNextImage(post.id)}
                          onPrev={() => handlePrevImage(post.id)}
                        />
                      )}
                    </div>
                  </div>
                  {post.location && post.location.name && (
                    <div className="flex items-left px-2 py-2">
                      <LocationOnIcon />
                      <p className="text-gray-700 text-sm">{post.location.name}</p>
                    </div>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex items-left px-2">
                      <StyleIcon />
                      {post.tags && post.tags.length > 0 && (
                        <div className="px-2">
                          {post.tags.map(tag => (
                            <span
                              key={tag.id}
                              className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                              onClick={() => handleTagClick(tag.name)}
                              style={{ cursor: 'pointer' }}
                            >
                              #{tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex justify-between items-center px-6 py-2">
                    <div className="grid grid-cols-2 gap-3 items-center">
                      {!isCurrentUser && (
                        <>
                          <LikeButton
                            postId={post.id}
                            liked={likes[post.id]}
                            onLike={handleLike}
                          />
                          <BookmarkButton
                            postId={post.id}
                            bookmarked={bookmarks[post.id]}
                            onBookmark={handleBookmark}
                          />
                        </>
                      )}
                    </div>
                    <div className="flex items-center">
                      {isCurrentUser && (
                        <>
                          <button
                            onClick={() => {
                              setIsEditing(true);
                              setEditingPostId(post.id);
                              setIsEditing(true);
                            }}
                            className="button-shared-style icon-button bg-green-500 text-white"
                          >
                            <EditIcon />
                          </button>
                          <Modal isOpen={isEditing && editingPostId === post.id} onClose={() => setIsEditing(false)}>
                            <EditPostComponent
                              id={post.id}
                              redirectPath="/posts"
                              onUpdate={onUpdate}
                              onClose={() => {
                                setIsEditing(false);
                                setEditingPostId(null);
                              }}
                              />
                          </Modal>
                          <button onClick={() => deletePost(post.id)} className="button-shared-style icon-button bg-red-500 text-white">
                            <DeleteIcon />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default PostsComponent;