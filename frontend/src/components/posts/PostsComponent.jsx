import React, { useState, useEffect, useContext } from 'react'; 
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../user/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';

const PostsComponent = () => {
  const [posts, setPosts] = useState([]);
  const { token } = useContext(AuthContext);

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
        // 応答データからposts配列を抽出する
        const postsData = response.data.data.map(item => {
          const themeId = item.relationships.theme.data.id;
          const userId = item.relationships.user.data.id;
            return {
              id: item.id,
              theme: themes[themeId],
              user: users[userId],
              content: item.attributes.content,
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
    if (window.confirm('投稿を削除しますか？')) {
      const token = sessionStorage.getItem('accesstoken');
      if (token) {
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
    }
  }

  return (
    <div className="px-4 py-8 pt-20">
      {/* 投稿一覧 */}
      <div className="form-container mx-auto px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map(post => (
            <div key={post.id} className="max-w-sm rounded overflow-hidden shadow-lg bg-white flex flex-col justify-between">
              <div className="px-6 py-4">
                <div className="font-bold text-xs mb-4 text-left">{post.user}</div>
                <div className="font-bold text-sl mb-2 text-left">テーマ：{post.theme}</div>
                <p className="text-gray-700 text-left">{post.content}</p>
              </div>
              <div className="flex justify-between items-center px-6 py-2">
                <div>
                  {/* "いいね"と"ブックマーク"アイコンはここに配置 */}
                  <ThumbUpOffAltIcon />
                  <BookmarkAddOutlinedIcon />
                </div>
                <div>
                  {/* 編集と削除のボタンはこの中に */}
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