import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../user/AuthContext';

function EditTheme() {
  const { id: themeId } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTheme = async () => {
      if (token) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/themes/${themeId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setName(response.data.name); // テーマの名前をセット
        } catch (error) {
          setError('テーマの読み込みに失敗しました。');
        }
      }
    };

    fetchTheme();
  }, [themeId, token]);

  const handleSave = async () => {
    if (!token) {
      setError('認証トークンが見つかりません。');
      return;
    }

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/v1/themes/${themeId}`, {
        theme: { name },
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/themes'); // 編集成功後にテーマ一覧ページにリダイレクト
    } catch (error) {
      setError('テーマの更新に失敗しました。' + (error.response?.data?.message || ''));
    }
  };

  return (
    <div className="py-16">
      <div className="form-container">
        {error && <p>{error}</p>}
        <input
          type="text"
          name="themeName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button className="mt-4 inline-flex text-white bg-custom-turquoise hover:bg-custom-hover-turquoise border-0 py-2 px-6 focus:outline-none rounded text-lg" onClick={handleSave}>
          保存
        </button>
      </div>
    </div>
  );
}

export default EditTheme;
