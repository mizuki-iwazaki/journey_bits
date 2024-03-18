import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../user/AuthContext';
import LocationInput from './LocationInput';
import CloseIcon from '@mui/icons-material/Close';

const NewPostForm = () => {
  const { token } = useContext(AuthContext);
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [status, setStatus] = useState('published')
  const navigate = useNavigate();
  const [location, setLocation] = useState({
    name: '',
    latitude: '',
    longitude: '',
    address: ''
  });

  // handleLocationSelect 関数で位置情報の状態を更新
  const handleLocationSelect = (name, latitude, longitude, address) => {
    setLocation({ name, latitude, longitude, address });
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/v1/themes`)
    .then(response => {
      setThemes(response.data);
    })
  }, []);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newImages = [...images, ...selectedFiles];
    setImages(newImages);
    
    const newImagePreviews = selectedFiles.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setImagePreviews(prevPreviews => [...prevPreviews, ...newImagePreviews]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('post[theme_id]', selectedTheme);
    formData.append('post[content]', content);
    formData.append('post[status]', status);
    formData.append('post[location_attributes][name]', location.name);
    formData.append('post[location_attributes][latitude]', location.latitude);
    formData.append('post[location_attributes][longitude]', location.longitude);
    formData.append('post[location_attributes][address]', location.address);
    images.forEach((image) => {
      formData.append('post[image_file][]', image);
    });

    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      axios.post(`${process.env.REACT_APP_API_URL}/api/v1/posts`, formData, config)
      .then(() => {
        setSelectedTheme('');
        setContent('');
        setImages([]);
        navigate('/posts')
      })
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
        <div className="mb-4">
          <LocationInput onLocationSelect={handleLocationSelect} />
        </div>
        <div className="mb-4">
          <label htmlFor="image-upload" className="block text-gray-700 text-sm font-bold mb-2 text-left">
            画像を選択
          </label>
          <input
            id="image-upload"
            name="image-upload"
            type="file"
            multiple
            onChange={handleImageChange}
            className="form-input"
          />
        </div>
        <div className="image-preview-container">
          {imagePreviews.map((image, index) => (
            <div key={`${image.name}-${index}`} className="mb-4 relative image-preview-item">
              <img src={image.url} alt={`Preview ${index}`} className="w-full" />
              <button onClick={(e) => handleImageChange(image.filename, e)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1">
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
            投稿する
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPostForm;