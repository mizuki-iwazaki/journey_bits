import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from './user/AuthContext';
import { useLoading } from './LoadingProvider';
import MapModal from './MapModal';

const Recommendations = ({ isMapsLoaded }) => {
  const { token } = useContext(AuthContext);
  const [recommendations, setRecommendations] = useState([]);
  const { loading, setLoading } = useLoading();
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);


  const handleMapOpen = (location) => {
    setSelectedLocation(location);
    setMapModalOpen(true);
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (token) {
        setLoading(true);
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/recommendations`, config);
          setRecommendations(response.data);
        } catch (error) {
          console.error('Recommendations fetch error:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchRecommendations();
  }, [token, setLoading]);

  if (loading) {
    return null;
  }

  return (
    <div className="grid-container">
      {recommendations.length ? (
        recommendations.map((recommendation, index) => (
          <div key={index} className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
            <div className="px-4 pt-8 pb-4">
              <div className="font-bold text-xl mb-2 text-left">{recommendation.name}</div>
              {recommendation.photo_urls && recommendation.photo_urls.map((url, imgIndex) => (
                <img key={imgIndex} src={url} alt={`${recommendation.name}の景色${imgIndex + 1}`} className="w-full object-cover" style={{ height: '200px' }} />
              ))}
              <p className="text-gray-500 text-left">Rating: {recommendation.rating || 'N/A'}</p>
              <p className="text-gray-500 text-left">レビュー数: {recommendation.user_ratings_total.toLocaleString()}件</p>
              <p className="text-blue-500 underline text-left cursor-pointer" onClick={() => handleMapOpen(recommendation)}>
              {recommendation.address}
            </p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center col-span-3">
          <p>おすすめ表示をするために、投稿をお試しください。</p>
        </div>
      )}
      {selectedLocation && (
      <MapModal
        isOpen={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        location={selectedLocation}
        isLoaded={isMapsLoaded}
      />
    )}
    </div>
  );
};

export default Recommendations;
