import React, { useRef, useCallback } from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

const LocationInput = ({ onLocationSelect }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const autocompleteRef = useRef(null);

  const handlePlaceChanged = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      onLocationSelect(place.name, place.geometry.location.lat(), place.geometry.location.lng(), place.formatted_address);
    }
  }, [onLocationSelect]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <label htmlFor="location-input" className="block text-gray-700 text-sm font-bold mb-2 text-left">
        場所
      </label>
      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlaceChanged}
      >
      <input
          id="location-input"
          type="text"
          placeholder="施設名または住所"
          className="form-input shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          aria-label="Location"
      />
      </Autocomplete>
    </>
  );
};

export default LocationInput;
