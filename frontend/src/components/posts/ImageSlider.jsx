import React from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ImageSlider = ({ imageUrls, currentIndex, onNext, onPrev }) => {
    if (imageUrls.length === 1) {
      return (
        <img
          src={imageUrls[0].url}
          alt={`${currentIndex}`}
          className="w-full h-auto object-contain"
        />
      );
  }
  return (
    <div className="relative w-full max-w-lg p-4">
      {currentIndex > 0 && (
        <button onClick={onPrev} className="absolute left-0 top-1/2 transform -translate-y-1/2">
          <ArrowBackIosNewIcon />
        </button>
      )}
      <img
        src={imageUrls[currentIndex].url}
        alt={`${currentIndex}`}
        className="w-full h-auto object-contain"
      />

      {currentIndex < imageUrls.length - 1 && (
        <button onClick={onNext} className="absolute right-0 top-1/2 transform -translate-y-1/2">
          <ArrowForwardIosIcon />
        </button>
      )}
    </div>
    
  );
};

export default ImageSlider;
