import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import ImageSlider from './ImageSlider';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// 投稿を文字数で区切る関数
const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return { truncated: true, text: text.substring(0, maxLength) + '...' };
  }
  return { truncated: false, text };
};

const PostCard = ({ post, onToggleExpand, onDeletePost, onLike, onBookmark, onNextImage, onPrevImage, isExpanded, currentImageIndex, loggedInUserId }) => {
  const { truncated, text } = truncateText(post.content, 50);

  return (
    <div className="max-w-lg rounded overflow-hidden shadow-lg bg-white flex flex-col justify-between">
      <div className="px-6 py-4">
        <div className="font-bold text-xs mb-4 text-left">{post.user}</div>
        <div className="font-bold text-sl mb-2 text-left">テーマ：{post.theme}</div>
        <p className="text-gray-700 text-left">
          {isExpanded ? post.content : text}
          {truncated && (
            <button onClick={() => onToggleExpand(post.id)} className="text-blue-500">
              {isExpanded ? '隠す' : '続きを読む'}
            </button>
          )}
        </p>
        <div className="relative">
          {post.imageUrls.length === 0 && (
            <img src={`${process.env.REACT_APP_API_URL}/uploads/image/image_file/default.jpg`} alt="Default" />
          )}
          {post.imageUrls.length > 0 && (
            <ImageSlider
              imageUrls={post.imageUrls}
              currentIndex={currentImageIndex}
              onNext={() => onNextImage(post.id)}
              onPrev={() => onPrevImage(post.id)}
            />
          )}
        </div>
      </div>
      <div className="flex items-left px-6 py-2">
        <LocationOnIcon />
        <p className="text-gray-700">{post.location.name}</p>
      </div>
      <div className="flex justify-between items-center px-6 py-2">
        <div className="grid grid-cols-2 gap-3 items-center">
          <div className="relative">
            <ThumbUpAltOutlinedIcon />
            {post.likes_count}
          </div>
          <div className="relative">
            <BookmarkAddOutlinedIcon />
            {post.bookmarks_count}
          </div>
        </div>
        <div className="flex items-center">
          {loggedInUserId === post.userId && (
            <>
              <button onClick={() => onDeletePost(post.id)} className="button-shared-style icon-button bg-red-500 text-white">
                <DeleteIcon />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
