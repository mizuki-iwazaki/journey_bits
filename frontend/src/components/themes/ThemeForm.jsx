import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../user/AuthContext';

function ThemeForm() {
  const [themeName, setThemeName] = useState('');
  const { token } = useContext(AuthContext);
  const [error, setError] = useState('');
  const navigate = useNavigate('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/themes`, {
        theme: {
          name: themeName,
        },
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      setThemeName('');
      navigate('/themes')
    } catch (error) {
      setError('テーマの作成に失敗しました。');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="py-16">
        <div className="form-container">
        <label htmlFor="themeName" className="block text-gray-700 text-sm font-bold mb-2 text-left">
            テーマ名:
          </label>
          <input
            id="themeName"
            name="themeName"
            type="text"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4" // mb-4で下部にマージンを追加
            />
        </div>
        <button className="mr-4 inline-flex text-white bg-custom-turquoise hover:bg-custom-hover-turquoise border-0 py-2 px-6 focus:outline-none rounded text-lg">
          テーマ作成
        </button>
        {error && <p>{error}</p>}
      </div>
    </form>
  );
}

export default ThemeForm;
