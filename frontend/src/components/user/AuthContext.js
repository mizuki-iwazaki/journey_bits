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
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // コンポーネントがマウントされたときにセッションストレージからトークンを取得して状態にセットする
    const storedToken = sessionStorage.getItem('accesstoken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, [token]);

  const login = (newToken) => {
    setToken(newToken); // トークンの状態を更新
    sessionStorage.setItem('accesstoken', newToken); // トークンをセッションストレージに保存
  };

  const logout = () => {
    setToken(null); // トークンの状態をnullに更新
    sessionStorage.removeItem('accesstoken'); // トークンをセッションストレージから削除
    axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/authentication`)
      .then(() => {
      navigate('/'); // ホーム画面に遷移
    });
  };

  const contextValue = {
    isLoggedIn: !!token, // !!を使ってtokenがnullかどうかをチェック
    token, // tokenの値をそのまま使う
    login, // login関数をそのまま使う
    logout, // logout関数をそのまま使う
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
