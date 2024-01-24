import React from 'react';
import ThumbUpOffAltSharpIcon from '@mui/icons-material/ThumbUpOffAltSharp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

const LikeButton = ({ postId, liked, onLike }) => {
  return (
    <button onClick={() => onLike(postId)}>
      {liked ? (
        <ThumbUpOffAltSharpIcon className="text-blue-500" />
      ) : (
        <ThumbUpOffAltIcon className="text-gray-700" />
      )}
    </button>
  );
};

export default LikeButton;
