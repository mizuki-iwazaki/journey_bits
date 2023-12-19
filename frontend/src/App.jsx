import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/user/AuthContext';
import Header from './components/shared/Header';
import SignUp from './components/user/SignUp';
import Login from './components/user/Login';
import AppIntrosection from './components/AppIntrosection';
import Footer from './components/shared/Footer';

import './App.css';
import PostsComponent from './components/posts/PostsComponent';
import NewPostForm from './components/posts/NewPostForm';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Header />
        <Routes>
          <Route exact path="/" element={<AppIntrosection />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/posts" element={<PostsComponent />} />
          <Route path="/posts/create" element={< NewPostForm />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
