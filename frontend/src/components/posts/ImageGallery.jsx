import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../user/AuthContext';
import ImageSlider from './ImageSlider';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';

const ImageGallery = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postsData, setPostsData] = useState(null);

  const { token } = useContext(AuthContext);
  const [currentImageIndices, setCurrentImageIndices] = useState({});

  const findThemeNameById = (themeId, included) => {
    const theme = included.find(item => item.type === 'theme' && item.id === themeId);
    return theme ? theme.attributes.name : null;
  };

  const findLocationName = (locationId, included) => {
    const location = included.find(item => item.type === 'location' && item.id === locationId);
    return location ? location.attributes.name : null;
  };

  // 選択されたポストの画像を次へ進める
  const handleNextImage = (postId) => {
    const currentPostData = imageUrls.find(image => image.post.id === postId);
    if (!currentPostData) {
      return;
    }
    const newImageIndex = (currentImageIndices[postId] + 1) % currentPostData.post.attributes.image_urls.length;
    setCurrentImageIndices(prevIndices => ({
      ...prevIndices,
      [postId]: newImageIndex,
    }));
  };

  // 選択されたポストの画像を前へ戻す
  const handlePrevImage = (postId) => {
    const currentPostData = imageUrls.find(image => image.post.id === postId);
    if (!currentPostData) {
      return;
    }
    const totalImages = currentPostData.post.attributes.image_urls.length;
    const newImageIndex = (currentImageIndices[postId] - 1 + totalImages) % totalImages;
    setCurrentImageIndices(prevIndices => ({
      ...prevIndices,
      [postId]: newImageIndex,
    }));
  };

  // モーダルウインドウの画像表示
  const handleImageClick = (image) => {
    const themeId = image.post.relationships.theme.data.id;
    const locationId = image.post.relationships.location.data.id;
    const themeName = findThemeNameById(themeId, postsData.included);
    const locationName = findLocationName(locationId, postsData.included);
    const updatedPost = {
      ...image.post,
      attributes: {
        ...image.post.attributes,
        themeName,
        locationName,
        image_urls: image.post.attributes.image_urls.map(imageObj => ({
          ...imageObj,
          url: new URL(imageObj.url, process.env.REACT_APP_API_URL).href,
        })),
      },
    };

    setSelectedPost(updatedPost);
    setCurrentImageIndices({[updatedPost.id]: 0});
  }


  const handleCloseModal = () => {
    setSelectedPost(null);
    setCurrentImageIndices({});
  };

  useEffect(() => {
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      axios.get(`${process.env.REACT_APP_API_URL}/api/v1/albums`, config)
      .then(response => {
        // 応答から画像データを取得してstateに設定
        const images = response.data.data.map(post => 
          post.attributes.image_urls.map(imageObj => ({
            id: imageObj.id,
            url: new URL(imageObj.url, process.env.REACT_APP_API_URL).href,
            post: post
          }))
        ).flat();
        setImageUrls(images);
        setPostsData(response.data);
      })
      .catch(() => {
        alert('エラーが発生しました。');
      });
    }
  }, [token]);

  return (
    <>
      <div className="px-4 py-8">
        <div className="form-container mx-auto">
          <div className="justify-center py-4">
            <div className="album-grid">
              {imageUrls.map((image, index) => (
                <div key={index} className="album-item" onClick={() => handleImageClick(image)}>
                  <img src={image.url} alt={`${index}`} />
                </div>
              ))}

              {selectedPost && (
                <>
                  <div className="overlay" onClick={handleCloseModal} />
                  <div className="modal">
                    <div className="modal-content">
                      <h3 className="text-left text-lg font-bold">テーマ：{selectedPost.attributes.themeName}</h3>
                      <p className="text-left text-xm">{selectedPost.attributes.content}</p>
                      {selectedPost.attributes.image_urls && selectedPost.attributes.image_urls.length > 0 && (
                        <ImageSlider
                          imageUrls={selectedPost.attributes.image_urls}
                          currentIndex={currentImageIndices[selectedPost.id] || 0}
                          onNext={() => handleNextImage(selectedPost.id)}
                          onPrev={() => handlePrevImage(selectedPost.id)}
                        />
                      )}
                      <p className="text-left text-xm">
                        <LocationOnIcon />
                        {selectedPost.attributes.locationName}
                      </p>
                      <button onClick={handleCloseModal} className="close-button"><CloseIcon /></button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageGallery;