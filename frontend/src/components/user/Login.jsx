import React, { useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/authentication`, { email, password });
      const token = response.headers['accesstoken'];
      const userId = response.data.data.id;
      const role = response.data.data.attributes.role;
      if (token && userId) {
        login(token, userId, role);
        navigate('/posts');
        
      } else {
        console.error('トークンまたはユーザーIDがレスポンスに含まれていません。');
      }
    } catch (error) {
      console.error('ログインエラー', error);
      if (error.response) {
        console.error('詳細なエラー情報:', error.response);
      }
    }
  };


  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20">
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:online-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            autoComplete="email"
          />
        </div>
        {/* Password input */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Password:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        {/* Submit button */}
        <div className="flex justify-center">
          <button className="mr-4 inline-flex text-white bg-custom-turquoise hover:bg-custom-hover-turquoise border-0 py-2 px-6 focus:outline-none rounded text-lg">
            ログイン
          </button>
        </div>
      </form>
    </div>
  );
};
