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

  const login = (newToken, newUserId) => {
    setToken(newToken); // トークンの状態を更新
    setUserId(newUserId);
    sessionStorage.setItem('accesstoken', newToken);
    sessionStorage.setItem('userId', newUserId);
  };

  const logout = () => {
    setToken(null); // トークンの状態をnullに更新
    setUserId(null);
    sessionStorage.removeItem('accesstoken'); // トークンをセッションストレージから削除
    sessionStorage.removeItem('userId');
    axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/authentication`)
      .then(() => {
      navigate('/'); // ホーム画面に遷移
    });
  };

  const contextValue = {
    isLoggedIn: !!token,
    token, 
    userId,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;