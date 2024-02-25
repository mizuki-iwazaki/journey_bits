import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './components/user/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isGuest } = useContext(AuthContext);
 
  if ( isGuest ) {
    alert('ユーザー登録が必要です');
    return <Navigate to="/signup" />;
  }
  return children;
};

export default ProtectedRoute;