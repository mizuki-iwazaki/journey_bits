import React, { useState, useEffect, useContext } from 'react'; 
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../user/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const PostsComponent = () => {
  const [posts, setPosts] = useState([]);
  const { token } = useContext(AuthContext);
  const [currentImageIndices, setCurrentImageIndices] = useState({});


  useEffect(() => {
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

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
              users[item.id] = item.attributes.name;
            }
          });
        }
        const initialIndices = response.data.data.reduce((acc, item) => {
          acc[item.id] = 0; // 各投稿の初期インデックスを0に設定
          return acc;
        }, {});
        setCurrentImageIndices(initialIndices);
        
        // 応答データからposts配列を抽出する
        const postsData = response.data.data.map(item => {
          const themeId = item.relationships.theme.data.id;
          const userId = item.relationships.user.data.id;
          const imageUrls = item.attributes.image_urls ? item.attributes.image_urls.map(imageObj => ({
            id: imageObj.id,
            url: new URL(imageObj.url, process.env.REACT_APP_API_URL).href
          })) : [];

          return {
            id: item.id,
            theme: themes[themeId],
            user: users[userId],
            content: item.attributes.content,
            imageUrls: imageUrls,
            status: item.attributes.status,
          };
        });
        setPosts(postsData);
        })
        .catch(error => {
          console.error('Error fetching posts:', error);
        });
    } else {
      console.log('トークンが取得できません。');
    }
  }, [token]);

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
    <div className="px-4 py-8">
      {/* 投稿一覧 */}
      <div className="form-container mx-auto px-4">
        <div className="grid-container">
          {posts.map(post => (
            <div key={post.id} className="max-w-lg rounded overflow-hidden shadow-lg bg-white flex flex-col justify-between">
              <div className="px-6 py-4">
                <div className="font-bold text-xs mb-4 text-left">{post.user}</div>
                <div className="font-bold text-sl mb-2 text-left">テーマ：{post.theme}</div>
                <p className="text-gray-700 text-left">{post.content}</p>
                <div className="relative">
                  {post.imageUrls.length === 0 && (
                    // 画像がない場合にデフォルト画像を表示
                    <img src={`${process.env.REACT_APP_API_URL}/uploads/image/image_file/default.jpg`} alt="Default" />
                  )}
                  {post.imageUrls.length === 1 && (
                    // 画像が1枚の場合にその画像を表示
                    <img src={post.imageUrls[0].url} alt={`Post ${post.id}`} />
                  )}
                  {post.imageUrls.length > 1 && (
                    <>
                      {/* 前の画像に移動するボタン */}
                      {currentImageIndices[post.id] > 0 && (
                        <button onClick={() => handlePrevImage(post.id)} className="absolute left-0 top-1/2 transform -translate-y-1/2">
                          <ArrowBackIosNewIcon />
                        </button>
                      )}
                      {/* 現在の画像 */}
                      <img src={post.imageUrls[currentImageIndices[post.id] || 0].url} alt={`Post ${post.id}`} />
                      {/* 次の画像に移動するボタン */}
                      {currentImageIndices[post.id] < post.imageUrls.length - 1 && (
                        <button onClick={() => handleNextImage(post.id)} className="absolute right-0 top-1/2 transform -translate-y-1/2">
                          <ArrowForwardIosIcon />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center px-6 py-2">
                <div>
                  <ThumbUpOffAltIcon />
                  <BookmarkAddOutlinedIcon />
                </div>
                <div>
                  <Link to={`/posts/${post.id}`} className="inline-block bg-blue-500 rounded px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">
                    詳細
                  </Link>
                  <Link to={`/posts/${post.id}/edit`} className="inline-block bg-green-500 rounded px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">
                    <EditIcon />
                  </Link>
                  <button onClick={() => deletePost(post.id)} className="inline-block bg-red-500 rounded px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostsComponent;