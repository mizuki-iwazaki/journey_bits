import React, { useState, useContext, useEffect } from 'react';
import { Tabs, Tab } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from './user/AuthContext';

const MainTabsComponent = () => {
  const { isGuest } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(0);

  useEffect(() => {
    const path = location.pathname;
    // URLに応じてタブの状態を設定
    if (path.includes('/posts')) {
      setValue(0);
    } else if (path.includes('/albums')) {
      setValue(1);
    } else if (path.includes('/maps')) {
      setValue(2);
    } else if (path.includes('/mypage')) {
      setValue(3);
    }
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    if (isGuest && [1, 2, 3].includes(newValue)) {
      alert('この機能を使用するにはログインが必要です。');
      navigate('/login');
      return;
    }

    setValue(newValue);

    switch (newValue) {
      case 0:
        navigate('/posts');
        break;
      case 1:
        navigate('/albums');
        break;
      case 2:
        navigate('/maps');
        break;
      case 3:
        navigate('/mypage');
        break;
      default:
        break;
    }
  };

  return (
    <div className="pt-12">
      <Tabs value={value} onChange={handleChange} aria-label="Main tabs">
        <Tab label="投稿一覧" />
        <Tab label="アルバム機能" />
        <Tab label="Map機能" />
        <Tab label="マイページ" />
      </Tabs>
    </div>
  );
};

export default MainTabsComponent;
