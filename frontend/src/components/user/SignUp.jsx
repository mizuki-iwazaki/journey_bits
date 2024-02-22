import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [name, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [avatar, setAvatar] = useState(null)
  const navigate = useNavigate();

  const handleAvatarChange = (event) => {
    setAvatar(event.target.files[0]);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== passwordConfirmation) {
      alert('パスワードが一致していません')
    }

    const formData = new FormData();
    formData.append('user[name]', name);
    formData.append('user[email]', email);
    formData.append('user[password]', password);
    formData.append('user[password_confirmation]', passwordConfirmation);
    if (avatar) {
      formData.append('user[avatar]', avatar);
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/registration`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, 
      });
      console.log(response.data);
      navigate('/login');
    } catch (error) {
      console.error('エラーが発生しました!', error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20">
        <div className="mb-4 text-left">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            名前:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            name="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(event) => setUserName(event.target.value)}
            autoComplete="name"
          />
        </div>
        <div className="mb-4 text-left">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Eメール:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            name="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="mb-4 text-left">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            パスワード:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="mb-4 text-left">
          <label htmlFor="passwordConfirmation" className="block text-gray-700 text-sm font-bold mb-2">
            パスワード確認:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="passwordConfirmation"
            name="password"
            type="password"
            placeholder="Confirm Password"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
          />
        </div>
        <div className="mb-4 text-left">
          <label htmlFor="avatar" className="block text-gray-700 text-sm font-bold mb-2">
            アバター:
          </label>
          <input
            className="w-full py-2 px-3 text-gray-700 leading-tight"
            id="avatar"
            name="avatar"
            type="file"
            onChange={handleAvatarChange}
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
