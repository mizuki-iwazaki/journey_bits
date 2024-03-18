import React, { useState, useContext } from 'react';
import { Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthContext from './user/AuthContext';
import PostsComponent from './posts/PostsComponent';
import ImageGallery from './posts/ImageGallery';
import MapWithPins from './maps/MapWithPins';
import MyPage from './user/MyPage';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
};

const MainTabsComponent = () => {
  const [value, setValue] = useState(0);
  const { isGuest } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    const protectedTabs = [1, 2, 3];
    if (protectedTabs.includes(newValue) && isGuest) {
      alert('この機能を使用するにはログインが必要です。');
      navigate('/signup');
    } else {
      setValue(newValue);
    }
  };

  return (
    <div className="py-12">
      <Tabs value={value} onChange={handleChange} aria-label="Main tabs">
        <Tab label="投稿一覧" />
        <Tab label="アルバム機能" />
        <Tab label="Map機能" />
        <Tab label="マイページ" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <PostsComponent />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ImageGallery />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <MapWithPins />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <MyPage />
      </TabPanel>
    </div>
  );
};

export default MainTabsComponent;
