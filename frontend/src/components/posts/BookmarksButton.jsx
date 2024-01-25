import React from 'react';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const BookmarkButton = ({ postId, bookmarked, onBookmark }) => {
  return (
    <button onClick={() => onBookmark(postId)}>
      {bookmarked ? (
        <BookmarkIcon className="text-green-500" />
    ) : (
        <BookmarkAddOutlinedIcon className="text-gray-700" />
      )}
    </button>
  );
};

export default BookmarkButton;
