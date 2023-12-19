import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [name, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== passwordConfirmation) {
      alert('パスワードが一致していません')
    }
    // フォームデータの取得
    const userData = {
      user: {
        name: name,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
      }
    };


  // APIリクエスト
  axios.post(`${process.env.REACT_APP_API_URL}/api/v1/registration`, userData)
  .then(response => {
    // 成功時の処理
    console.log(response.data);
    navigate('/login');
  })
  .catch(error => {
    // エラー処理
    console.error('エラーが発生しました!', error);
  });
};

  // フォームのUI
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
          Name:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(event) => setUserName(event.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
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
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="passwordConfirmation" className="block text-gray-700 text-sm font-bold mb-2">
            Password Confirmation:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="passwordConfirmation"
            type="password"
            placeholder="Confirm Password"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
          />
        </div>
        <div className="flex justify-center">
          <button className="mr-4 inline-flex text-white bg-custom-turquoise hover:bg-custom-hover-turquoise border-0 py-2 px-6 focus:outline-none rounded text-lg">
            新規登録
          </button>
        </div>
      </form>
    </div>
  );
}
