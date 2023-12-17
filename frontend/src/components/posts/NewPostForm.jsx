import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewPostForm = () => {
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('published')

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/v1/themes`)
      .then(response => {
        setThemes(response.data);
      })
      .catch(error => {
        console.error('Error fetching themes:', error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const postData = {
      post: {
        theme_id: selectedTheme,
        content: content,
        status: status
      }
    };

    const token = sessionStorage.getItem('accesstoken');
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

    axios.post(`${process.env.REACT_APP_API_URL}/api/v1/posts`, postData, config)
      .then(response => {
        console.log(response.data);
        setSelectedTheme('');
        setContent('');
      })
      .catch(error => {
        console.error('There was an error', error);
      });
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4 pt-16">
          <label htmlFor="theme" className="block text-gray-700 text-sm font-bold mb-2 text-left">
            テーマ
          </label>
          <select
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="theme"
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
          >
            <option value="">テーマを選択</option>
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
        <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2 text-left">
          エピソード
        </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="content"
            placeholder="エピソードを入力してください"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="mb-4">
        <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2 text-left">
          ステータス
        </label>
        <select
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="published">公開</option>
          <option value="restricted">非公開</option>
        </select>
      </div>
        <div className="flex items-center justify-center">
          <button className="mr-4 inline-flex text-white bg-custom-turquoise hover:bg-custom-hover-turquoise border-0 py-2 px-6 focus:outline-none rounded text-lg">
            投稿する
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPostForm;