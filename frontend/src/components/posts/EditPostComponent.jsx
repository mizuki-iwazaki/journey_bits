import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../user/AuthContext';
import CloseIcon from '@mui/icons-material/Close';
import LocationInput from './LocationInput';

const EditPostComponent = ({ id, redirectPath = '/posts', onUpdate, onClose }) => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState([]);
  const [initialLocation, setInitialLocation] = useState({});
  const [imageUrls, setImageUrls] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const [status, setStatus] = useState('published');
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const themesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/themes`);
        setThemes(themesResponse.data);
      } catch (error) {
        console.error('Error fetching themes:', error);
      }
    };

    const fetchPostDetails = async () => {
      if (token) {
        try {
          const config = {
            headers: { Authorization: `Bearer ${token}` },
          };
          const postResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/posts/${id}`, config);
          const postData = postResponse.data.data;
          setSelectedTheme(postData.relationships.theme.data.id);
          setContent(postData.attributes.content);
          setStatus(postData.attributes.status);
          const locationData = {
            name: postData.attributes.location.name,
            latitude: postData.attributes.location.latitude,
            longitude: postData.attributes.location.longitude,
            address: postData.attributes.location.address,
          };
          setLocation(locationData);
          setInitialLocation(locationData);

          if (postData.attributes.image_urls) {
            const loadedImageUrls = postData.attributes.image_urls.map(image => ({
              id: image.id, // 画像のIDを追加
              url: new URL(image.url, process.env.REACT_APP_API_URL).href,
            }));
            setImageUrls(loadedImageUrls);
          }
        } catch (error) {
          console.error('Error fetching the post details:', error);
          if (error.response && error.response.status === 403) {
            navigate(redirectPath);
          }
        }
      }
    };

    fetchThemes();
    fetchPostDetails();
  }, [id, token, navigate, redirectPath]);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newImageUrls = files.map(file => ({
      url: URL.createObjectURL(file),
      filename: file.name,
      id: `temp-${Date.now()}-${file.name}`,
    }));
    setNewImages(prevNewImages => [...prevNewImages, ...files]);
    setImageUrls(prevImageUrls => [...prevImageUrls, ...newImageUrls]);
  };

  const handleRemoveImage = (imageId, event) => {
    event.preventDefault();
  
    const imageIdStr = String(imageId);
    if (imageIdStr.startsWith('temp-')) {
      const filename = imageIdStr.split('-').slice(2).join('-');
      setNewImages(prevNewImages => prevNewImages.filter(file => file.name !== filename));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      setRemoveImages(prev => [...prev, imageIdStr]);
    }
    setImageUrls(prev => prev.filter(image => image.id.toString() !== imageIdStr));
  };

    const handleLocationSelect = (name, latitude, longitude, address) => {
      setLocation({ name, latitude, longitude, address });
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      const formData = new FormData();
      formData.append('post[theme_id]', selectedTheme);
      formData.append('post[content]', content);
      formData.append('post[status]', status);

      const locationChanged = initialLocation.name !== location.name ||
      initialLocation.latitude !== location.latitude ||
      initialLocation.longitude !== location.longitude ||
      initialLocation.address !== location.address;

      formData.append('post[location_attributes][name]', location.name);
      formData.append('post[location_attributes][latitude]', locationChanged ? location.latitude : initialLocation.latitude);
      formData.append('post[location_attributes][longitude]', locationChanged ? location.longitude : initialLocation.longitude);
      formData.append('post[location_attributes][address]', location.address);

      newImages.forEach((file) => {
        formData.append('post[image_file][]', file);
      });

      removeImages.forEach((imageId) => {
        formData.append('post[remove_image_ids][]', imageId);
      });

      if (token) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        axios.put(`${process.env.REACT_APP_API_URL}/api/v1/posts/${id}`, formData, config)
          .then(response => {
            console.log('Updated successfully:', response.data);
            navigate(redirectPath);
            onUpdate();
            onClose();
          })
          .catch(error => {
            console.error('There was an error updating the post:', error);
          });
      }
    };

    return (
      <div className="form-container">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4 pt-16">
            <label htmlFor="theme" className="block text-gray-700 text-sm font-bold mb-2 text-left">
              テーマ
            </label>
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="theme"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
            >
              <option value="">テーマを選択</option>
              {themes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2 text-left">
              エピソード
            </label>
            <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="content"
                placeholder="エピソードを入力してください"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <LocationInput
            onLocationSelect={handleLocationSelect}
            initialValue={{
              name: location.name,
              latitude: location.latitude,
              longitude: location.longitude,
              address: location.address
            }}
          />

          <label htmlFor="images" className="block text-gray-700 text-sm font-bold mb-2 text-left">
            画像を追加
          </label>
          <input
            type="file"
            id="images"
            multiple
            onChange={handleImageChange}
            ref={fileInputRef}
          />
          <div className="image-preview-container">
          {imageUrls && imageUrls.map((image, index) => (
            <div key={`${image.filename}-${index}`} className="mb-4 relative image-preview-item">
              <img src={image.url} alt={`${index}`} className="w-full" />
              <button type="button" onClick={(e) => handleRemoveImage(image.id, e)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1">
                <CloseIcon />
              </button>
            </div>
            ))}
          </div>
          <div className="mb-4">
          <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2 text-left">
            ステータス
          </label>
          <select
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="published">公開</option>
            <option value="restricted">非公開</option>
          </select>
        </div>
          <div className="flex items-center justify-center">
            <button className="mr-4 inline-flex text-white bg-custom-turquoise hover:bg-custom-hover-turquoise border-0 py-2 px-6 focus:outline-none rounded text-lg">
              更新する
            </button>
          </div>
        </form>
      </div>
    );
  };

export default EditPostComponent;
