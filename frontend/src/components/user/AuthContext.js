import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({
  isLoggedIn: false,
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => sessionStorage.getItem('accesstoken'));
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('isAdmin') === 'true');
  const [isGuest, setIsGuest] = useState(() => sessionStorage.getItem('isGuest') === 'true');

  const navigate = useNavigate();

  useEffect(() => {
    // コンポーネントがマウントされたときにセッションストレージからトークンを取得して状態にセットする
    const storedToken = sessionStorage.getItem('accesstoken');
    if (storedToken) {
      setToken(storedToken);
    }
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const login = (newToken, newUserId, newRole) => {
    const isAdmin = newRole === 'admin';
    const isGuest = newRole === 'guest'
    setToken(newToken);
    setUserId(newUserId);
    setIsAdmin(isAdmin);
    setIsGuest(isGuest);
    sessionStorage.setItem('accesstoken', newToken);
    sessionStorage.setItem('userId', newUserId);
    sessionStorage.setItem('isAdmin', isAdmin.toString());
    sessionStorage.setItem('isGuest', isGuest.toString());
  };

  const logout = () => {
    setToken(null); // トークンの状態をnullに更新
    setUserId(null);
    sessionStorage.removeItem('accesstoken'); // トークンをセッションストレージから削除
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('isAdmin', isAdmin.toString());
    axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/authentication`)
      .then(() => {
      navigate('/'); // ホーム画面に遷移
    });
  };

  const guestLogin = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/api/v1/authentication/guest_login`)
    .then(response => {
      const token = response.headers['accesstoken'];
      login(token, userId, 'guest');
      navigate('/posts');
    })
    .catch(error => {
      console.error("ゲストログインに失敗しました:", error);
    });
  };

  const contextValue = {
    isLoggedIn: !!token,
    token, 
    userId,
    isAdmin,
    isGuest,
    login,
    logout,
    guestLogin,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
