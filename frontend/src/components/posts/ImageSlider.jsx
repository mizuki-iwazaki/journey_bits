import React from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ImageSlider = ({ imageUrls, currentIndex, onNext, onPrev }) => {
    if (imageUrls.length === 1) {
      return (
        <img src={imageUrls[0].url} alt={`${currentIndex}`} />
      );
  }
  return (
    <div className="relative">
      {currentIndex > 0 && (
        <button onClick={onPrev} className="absolute left-0 top-1/2 transform -translate-y-1/2">
          <ArrowBackIosNewIcon />
        </button>
      )}
      <img src={imageUrls[currentIndex].url} alt={`${currentIndex}`} />

      {currentIndex < imageUrls.length - 1 && (
        <button onClick={onNext} className="absolute right-0 top-1/2 transform -translate-y-1/2">
          <ArrowForwardIosIcon />
        </button>
      )}
    </div>
    
  );
};

export default ImageSlider;
