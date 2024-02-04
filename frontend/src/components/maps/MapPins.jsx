import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import AuthContext from '../user/AuthContext';
import ImageSlider from '../posts/ImageSlider';

const MapWithPins = () => {
  const { token } = useContext(AuthContext);
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  // 画像インデックスをポストIDにマッピングするオブジェクト
  const [currentImageIndices, setCurrentImageIndices] = useState({});

  // 選択されたポストの画像を次へ進める
  const handleNextImage = (postId) => {
    setCurrentImageIndices(prevIndices => ({
      ...prevIndices,
      [postId]: (prevIndices[postId] + 1) % posts.find(post => post.id === postId).attributes.image_urls.length,
    }));
  };

  // 選択されたポストの画像を前へ戻す
  const handlePrevImage = (postId) => {
    setCurrentImageIndices(prevIndices => {
      const post = posts.find(post => post.id === postId);
      const totalImages = post.attributes.image_urls.length;
      const newIndex = prevIndices[postId] - 1 >= 0 ? prevIndices[postId] - 1 : totalImages - 1;
      return {
        ...prevIndices,
        [postId]: newIndex,
      };
    });
  };

  useEffect(() => {
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      axios.get(`${process.env.REACT_APP_API_URL}/api/v1/maps`, config)
        .then(response => {
          if (response.data && Array.isArray(response.data.data)) {
            const themes = response.data.included
              .filter(includedItem => includedItem.type === 'theme')
              .reduce((acc, theme) => {
                acc[theme.id] = theme.attributes.name;
                return acc;
            }, {});

            const postsWithFullImageUrls = response.data.data.map(post => ({
              ...post,
              attributes: {
                ...post.attributes,
                theme: themes[post.relationships.theme.data.id],
                image_urls: post.attributes.image_urls.map(imageObj => ({
                  id: imageObj.id,
                  url: new URL(imageObj.url, process.env.REACT_APP_API_URL).href,
                })),
              },
            }));
            setPosts(postsWithFullImageUrls);
            
            // 画像インデックスの初期化
            const initialIndices = postsWithFullImageUrls.reduce((acc, post) => {
              acc[post.id] = 0;
              return acc;
            }, {});
            setCurrentImageIndices(initialIndices);
          } else {
            console.error('Expected an array of posts, but got:', response.data);
          }
        })
        .catch(error => {
          console.error('Error fetching data: ', error);
        });
    }
  }, [token]);

  function onMarkerClick(post) {
    setSelectedPost(post);
  }

  return (
    <div className="pt-12" style={{ height: 'calc(100vh - 3rem)', width: '100%' }}>
      <GoogleMap
        id="example-map"
        mapContainerStyle={{ width: '100%', height: '100%' }}
        zoom={4.5}
        center={{ lat: 37.9121356, lng: 139.0613719 }} 
      >
        {posts.map(post => (
          <Marker
            key={post.id}
            position={{
              lat: post.attributes.location.latitude,
              lng: post.attributes.location.longitude
            }}
            onClick={() => onMarkerClick(post)}
          />
        ))}

        {selectedPost && (
          <InfoWindow
            position={{
              lat: selectedPost.attributes.location.latitude,
              lng: selectedPost.attributes.location.longitude
            }}
            onCloseClick={() => setSelectedPost(null)}
          >
          <div className="relative">
            <div className="w-full max-w-lg p-4">
              <div style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'left' }}>
                テーマ： {selectedPost.attributes.theme}
              </div>
              <div style={{ fontSize: '10px', textAlign: 'left' }}>
                {selectedPost.attributes.content}
              </div>
              {selectedPost.attributes.image_urls.length > 0 && (
                <ImageSlider
                  imageUrls={selectedPost.attributes.image_urls}
                  currentIndex={currentImageIndices[selectedPost.id] || 0}
                  onNext={() => handleNextImage(selectedPost.id)}
                  onPrev={() => handlePrevImage(selectedPost.id)}
                />
              )}
            </div>
          </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapWithPins;
