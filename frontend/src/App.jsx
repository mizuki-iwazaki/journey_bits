import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useJsApiLoader } from '@react-google-maps/api';
import { AuthProvider } from './components/user/AuthContext';
import Header from './components/shared/Header';
import SignUp from './components/user/SignUp';
import Login from './components/user/Login';
import AppIntrosection from './components/AppIntrosection';
import Footer from './components/shared/Footer';
import PostsComponent from './components/posts/PostsComponent';
import NewPostForm from './components/posts/NewPostForm';
import EditPostComponent from './components/posts/EditPostComponent';
import MyPage from './components/user/MyPage';
import MapWithPins from './components/maps/MapWithPins';

import './App.css';
import ImageGallery from './components/posts/ImageGallery';

const libraries = ['places'];

const App = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
    language: 'ja',
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return (
    <AuthProvider>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<AppIntrosection />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/posts" element={<PostsComponent />} />
          <Route path="/posts/create" element={<NewPostForm />} />
          <Route path="/posts/:id/edit" element={<EditPostComponent />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/albums" element={<ImageGallery />} />
          <Route path="/maps" element={<MapWithPins />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;
