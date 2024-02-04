import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Autocomplete } from '@react-google-maps/api';

const LocationInput = ({ onLocationSelect, initialValue }) => {
  const autocompleteRef = useRef(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (initialValue && initialValue.name) {
      setInputValue(initialValue.name);
    }
  }, [initialValue]);

  const handlePlaceChanged = useCallback(() => {
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry) {
      console.log("Returned place contains no geometry");
      return;
    }
    onLocationSelect(place.name, place.geometry.location.lat(), place.geometry.location.lng(), place.formatted_address);
    setInputValue(place.name);
  }, [onLocationSelect]);

  return (
    <>
      <label htmlFor="location-input" className="block text-gray-700 text-sm font-bold mb-2 text-left">
        場所
      </label>
      <Autocomplete
        onLoad={(autocomplete) => { autocompleteRef.current = autocomplete; }}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          id="location-input"
          type="text"
          placeholder="施設名または住所"
          className="form-input shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          aria-label="Location"
          value={inputValue} // 入力フィールドの値として inputValue を使用
          onChange={(e) => setInputValue(e.target.value)}
        />
      </Autocomplete>
    </>
  );
};

export default LocationInput;
