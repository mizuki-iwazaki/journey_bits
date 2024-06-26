import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import LikeButton from '../posts/LikesButton';
import BookmarkButton from '../posts/BookmarksButton';
import ImageSlider from '../posts/ImageSlider';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import EditPostComponent from '../posts/EditPostComponent';
import Modal from './Modal'; // Modal コンポーネントをインポート
import { getBackgroundColorByTheme } from '../posts/PostCardColor';

const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return { truncated: true, text: text.substring(0, maxLength) + '...' };
  }
  return { truncated: false, text };
};

const PostCard = ({ post, onToggleExpand, onDeletePost, onNextImage, onPrevImage, isExpanded, currentIndex, loggedInUserId, onLike, onBookmark, liked, bookmarked, onUpdate, onClose }) => {
  const { truncated, text } = truncateText(post.content, 50);
  const [isEditing, setIsEditing] = useState(false);
  const backgroundColor = getBackgroundColorByTheme(post.theme);

  return (
    <div className="max-w-lg rounded overflow-hidden shadow-lg bg-white flex flex-col justify-between"  style={{ backgroundColor }}>
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
            <img src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/w_800,h_600,c_fill/v1709134445/default.jpeg`} alt="Default" />
          )}
          {post.imageUrls.length > 0 && (
            <ImageSlider
              imageUrls={post.imageUrls}
              currentIndex={currentIndex ?? 0}
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
      <div className="flex justify-between items-center px-4 py-2">
        <div className="grid grid-cols-1 gap-2 items-center">
          <div className="relative">
            {loggedInUserId !== post.userId && (
              <>
                <LikeButton
                  postId={post.id}
                  liked={liked[post.id]}
                  onLike={() => onLike(post.id)}
                />
                <BookmarkButton
                  postId={post.id}
                  bookmarked={bookmarked[post.id]}
                  onBookmark={() => onBookmark(post.id)}
                />
              </>
            )}
            {loggedInUserId === post.userId && (
              <>
                <ThumbUpAltOutlinedIcon />
                  {post.likes_count}
                <BookmarkAddOutlinedIcon />
                  {post.bookmarks_count}
              </>
            )}
          </div>
        </div>
        <div className="flex items-center">
          {loggedInUserId === post.userId && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="button-shared-style icon-button bg-green-500 text-white"
              >
                <EditIcon />
              </button>
              <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
                <EditPostComponent
                  id={post.id}
                  onUpdate={onUpdate}
                  onClose={() => setIsEditing(false)}
                  redirectPath="/mypage"
                />
              </Modal>
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
