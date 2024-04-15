import React, { useState, useEffect } from 'react';
import Modal from './user/Modal';
import { GoogleMap, Marker } from '@react-google-maps/api';

const MapModal = ({ isOpen, onClose, location, isLoaded }) => {
  const [mapContainerStyle, setMapContainerStyle] = useState({
    width: '100%',
    height: '400px'
  });

  useEffect(() => {
    function updateSize() {
        setMapContainerStyle(prevStyle => ({
            ...prevStyle,
            width: '100%'
        }));
    }

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
}, []);

    if (!isLoaded) return <div>Loading...</div>;
    
    if (!location || location.latitude == null || location.longitude == null) {
      return <div>Location data is not available.</div>;
    }

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
      <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={15}
          center={{ lat: location.latitude, lng: location.longitude }}
      >
          <Marker position={{ lat: location.latitude, lng: location.longitude }} />
      </GoogleMap>
  </Modal>
    );
  };
  
  export default MapModal;