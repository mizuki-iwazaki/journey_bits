import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../user/AuthContext';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function ThemeList() {
  const [themes, setThemes] = useState([]);
  const { token } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const fetchThemes = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/themes`, config);
          setThemes(response.data);
          setIsLoading(false);
        } catch (error) {
          setError('テーマの読み込みに失敗しました。' + (error.response?.data?.message || ''));
          setIsLoading(false);
        }
      };

      fetchThemes();
    }
  }, [token]);

  const handleDelete = async (themeId) => {
    if (token && window.confirm('このテーマを削除してよろしいですか？')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/themes/${themeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setThemes(themes.filter(theme => theme.id !== themeId));
      } catch (error) {
        setError('テーマの削除に失敗しました。');
      }
    }
  };

  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="py-16">
      <div className="form-container">
      <h2 className="text-left font-bold text-xl">テーマリスト</h2>
        {themes.length > 0 ? (
          <ul>
            {themes.map((theme) => (
              <li key={theme.id} className="flex justify-between items-center mb-2">
              <span className="flex-grow">{theme.name}</span>
                <div className="flex-shrink-0 flex gap-2">
                  <Link to={`/themes/${theme.id}/edit`} className="button-shared-style icon-button bg-green-500 text-white">
                    <EditIcon />
                  </Link>
                  <button onClick={() => handleDelete(theme.id)} className="button-shared-style icon-button bg-red-500 text-white">
                    <DeleteIcon />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
        <p>テーマがありません。</p>
        )}
      </div>
    </div>
  );
}

export default ThemeList;
