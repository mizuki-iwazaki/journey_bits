import React, { useEffect, useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useJsApiLoader } from '@react-google-maps/api';
import AuthContext from './components/user/AuthContext';
import Header from './components/shared/Header';
import SignUp from './components/user/SignUp';
import Login from './components/user/Login';
import PasswordResetRequest from './components/user/PasswrResetRequest';
import PasswordReset from './components/user/PasswordReset';
import AppIntrosection from './components/AppIntrosection';
import Footer from './components/shared/Footer';
import TermsOfService from './components/shared/TermsOfService';
import PrivacyPolicy from './components/shared/PrivacyPolicy';
import InquiryForm from './components/shared/InquiryForm';
import MainTabsComponent from './components/MainTabs';
import PostsComponent from './components/posts/PostsComponent';
import NewPostForm from './components/posts/NewPostForm';
import EditPostComponent from './components/posts/EditPostComponent';
import MyPage from './components/user/MyPage';
import MapWithPins from './components/maps/MapWithPins';
import Recommendation from './components/Recommendation';
import { LoadingProvider, useLoading } from './components/LoadingProvider';

import './App.css';
import ImageGallery from './components/posts/ImageGallery';
import ThemeList from './components/themes/ThemeList';
import ThemeForm from './components/themes/ThemeForm';
import EditTheme from './components/themes/EditTheme';
import InquiryList from './components/shared/InquiryList';
import ProtectedRoute from './ProtectedRoute';

const usePageTracking = () => {
  const location = useLocation();
  const { setLoading } = useLoading();

  useEffect(() => {
    // Google Analytics のページビュー追跡コード
    const currentPage = location.pathname + location.search;
    window.gtag('config', process.env.REACT_APP_GOOGLE_ANALYTICS_ID, {
      page_path: currentPage,
    });
  }, [location, setLoading]);
};

const libraries = ['places'];

const App = () => {
  const { isLoggedIn } = useContext(AuthContext);
  usePageTracking();
  const { loading, setLoading } = useLoading();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
    language: 'ja',
  });

  if (loadError) {
    setLoading(false);
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    setLoading(true);
    return null;
  }

  return (
    <LoadingProvider>
      {loading ? (
        <div className="loading-screen">Loading...</div>
      ) : (
        <div className="App">
          <Header />
          <div>
          {isLoggedIn && <MainTabsComponent />}
            <Routes>
              <Route path="/" element={<AppIntrosection />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/password-reset-request" element={<PasswordResetRequest />} />
              <Route path="/password-reset" element={<PasswordReset />} />
              <Route path="/posts" element={<PostsComponent />} />
              <Route path="/posts/create" element={<ProtectedRoute><NewPostForm /></ProtectedRoute> } />
              <Route path="/posts/:id/edit" element={<EditPostComponent />} />
              <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute> } />
              <Route path="/albums" element={<ProtectedRoute><ImageGallery /></ProtectedRoute> } />
              <Route path="/maps" element={<ProtectedRoute><MapWithPins /></ProtectedRoute> } />
              <Route path="/recommendations" element={<ProtectedRoute>  <Recommendation isMapsLoaded={isLoaded} mapsLoadError={loadError} /></ProtectedRoute>} />
              <Route path="/legal/terms_of_service" element={<TermsOfService />} />
              <Route path="/legal/privacy_policy" element={<PrivacyPolicy />} />
              <Route path="themes" element={<ThemeList />} />
              <Route path="/themes/:id/edit" element={<EditTheme />} />
              <Route path="/theme/create" element={<ThemeForm />} />
              <Route path="/inquiry/create" element={<InquiryForm />} />
              <Route path="/inquiries" element={<InquiryList/>} />
            </Routes>
          </div>
          <Footer />
        </div>
      )}
    </LoadingProvider>
  );
};

export default App;
