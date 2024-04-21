import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GoogleMap, Marker } from '@react-google-maps/api';
import AuthContext from '../user/AuthContext';
import ImageSlider from '../posts/ImageSlider';
import CloseIcon from '@mui/icons-material/Close';
import Select from 'react-select';

const MapWithPins = () => {
  const { token } = useContext(AuthContext);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [posts, setPosts] = useState([]);
  const [themes, setThemes] = useState([]);
  const [tags, setTags] = useState([]);

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
            const fetchedThemes = response.data.included
              .filter(includedItem => includedItem.type === 'theme')
              .map(theme => ({
                label: theme.attributes.name,
                value: theme.id
              }));
            setThemes(fetchedThemes);

            const fetchedTags = response.data.data.flatMap(post => post.attributes.tags)
            .map(tag => ({ label: tag.name, value: tag.id }));
            setTags(fetchedTags);

            const postsWithFullImageUrls = response.data.data.map(post => ({
              ...post,
              attributes: {
                ...post.attributes,
                theme: fetchedThemes.find(t => t.value === post.relationships.theme.data.id)?.label,
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

  const handleThemeChange = selectedOption => {
    setSelectedTheme(selectedOption ? selectedOption.value : '');
  };
  
  const handleTagChange = selectedOption => {
    setSelectedTag(selectedOption ? selectedOption.value : '');
  };

  const isPostVisible = post => {
    const themeMatch = selectedTheme ? themes.find(theme => theme.value === selectedTheme)?.label === post.attributes.theme_name : true;
    const tagMatch = !selectedTag || post.attributes.tags.some(tag => tag.id === selectedTag);
    return themeMatch && tagMatch;
  };

  function onMarkerClick(post) {
    setSelectedPost(post);
  }

  return (
    <>
      <div style={{ height: 'calc(100vh - 3rem)', width: '100%', position: 'relative' }}>
        <GoogleMap
          id="example-map"
          mapContainerStyle={{ width: '100%', height: '100%' }}
          zoom={4.5}
          center={{ lat: 37.9121356, lng: 139.0613719 }} 
        >
          {posts.filter(post => isPostVisible(post)).map(post => {
            const latitude = parseFloat(post.attributes.location.latitude);
            const longitude = parseFloat(post.attributes.location.longitude);
            const isValidLat = !isNaN(latitude);
            const isValidLng = !isNaN(longitude);

            return (
              isValidLat && isValidLng && (
                <Marker
                  key={post.id}
                  position={{
                    lat: latitude,
                    lng: longitude
                  }}
                  onClick={() => onMarkerClick(post)}
                />
              )
            );
          })}

          {selectedPost && (
            <>
            {/* オーバーレイの背景 */}
            <div className="overlay" onClick={() => setSelectedPost(null)} />

            {/* モーダルウィンドウ */}
            <div className="modal">
              <div className="modal-content">
                <h3 className="text-left text-lg font-bold">テーマ：{selectedPost.attributes.theme}</h3>
                <p className="text-left text-xm">{selectedPost.attributes.content}</p>
                {selectedPost.attributes.image_urls.length > 0 && (
                  <ImageSlider
                    imageUrls={selectedPost.attributes.image_urls}
                    currentIndex={currentImageIndices[selectedPost.id] || 0}
                    onNext={() => handleNextImage(selectedPost.id)}
                    onPrev={() => handlePrevImage(selectedPost.id)}
                  />
                )}
                {selectedPost.attributes.tags.map(tag => (
                  <span
                    key={tag.id}
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                    style={{ cursor: 'pointer' }}
                  >
                    #{tag.name}
                  </span>
                ))}
                <button onClick={() => setSelectedPost(null)} className="close-button"><CloseIcon /></button>
                </div>
              </div>
            </>
          )}
        </GoogleMap>
      </div>
      <div style={{ 
        position: 'absolute',
        top: '35%',
        transform: 'translateY(-50%)',
        right: '10px',
        width: '200px',
        padding: '10px',
        zIndex: '11',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ 
          marginBottom: '10px',
          fontWeight: 'bold',
          fontSize: '16px',
          textAlign: 'center'
        }}>
          フィルタリング
        </div>
      <Select
        options={themes}
        onChange={handleThemeChange}
        placeholder="テーマ"
        isClearable={true}
        className="mb-2"
      />

      <Select
          options={tags}
          onChange={handleTagChange}
          placeholder="タグ"
          isClearable={true}
        />
      </div>
    </>
  );
};

export default MapWithPins;