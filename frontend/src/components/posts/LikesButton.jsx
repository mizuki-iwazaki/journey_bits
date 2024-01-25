import React from 'react';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

const LikeButton = ({ postId, liked, onLike }) => {
  return (
    <button onClick={() => onLike(postId)}>
      {liked ? (
        <ThumbUpAltIcon className="text-blue-500" />
    ) : (
        <ThumbUpAltOutlinedIcon className="text-gray-700" />
      )}
    </button>
  );
};

export default LikeButton;
