import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PasswordReset() {
  const location = useLocation();
  const userId = location.state?.userId;
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== passwordConfirmation) {
      setErrorMessage("パスワードが一致しません。");
      return;
    }

    try {
      axios.post(`${process.env.REACT_APP_API_URL}/api/v1/password_resets/reset`, {
        user_id: userId,
        password: password,
        password_confirmation: passwordConfirmation,
      });
      navigate('/login');
    } catch {
      setErrorMessage("パスワードリセットに失敗しました。");
    }
  };

  return (
    <div className="py-16">
      <div className="form-container mx-auto max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="新しいパスワード"
              name="password"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="新しいパスワード（確認）"
              name="password"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-custom-turquoise hover:bg-custom-hover-turquoise focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            パスワードをリセット
          </button>
        </form>
      </div>
    </div>
  );
}