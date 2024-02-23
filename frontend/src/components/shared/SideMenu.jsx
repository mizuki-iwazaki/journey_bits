import React from 'react';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

const SideMenu = ({ isOpen, toggleMenu, logout, isAdmin }) => {
  const menuClasses = `side-menu ${isOpen ? 'active' : ''}`;
  const handleCloseMenu = () => {
    toggleMenu();
  };

  return (
    <div className={menuClasses}>
      <button onClick={toggleMenu} className="text-white p-2 absolute top-0 right-0">
        <CloseIcon />
      </button>
      {/* サイドメニューのリンクとアクション */}
      <ul className="pt-10">
        <li className="p-2">
          <Link to={`/mypage`} onClick={handleCloseMenu}>マイページ</Link>
        </li>
        <li className="p-2">
          <Link to={`/posts`} onClick={handleCloseMenu}>投稿一覧</Link>
        </li>
        <li className="p-2">
          <Link to={`/maps`} onClick={handleCloseMenu}>Mapピン機能</Link>
        </li>
        <li className="p-2">
          <Link to={`/albums`} onClick={handleCloseMenu}>アルバム</Link>
        </li>
        <li className="p-2">
          <button onClick={() => { logout(); toggleMenu(); }}>ログアウト</button>
        </li>
        {/* Adminメニュー */}
        {isAdmin && (
          <>
            <li className="p-2">
              <Link to={`/theme/create`} onClick={handleCloseMenu}>テーマ作成</Link>
            </li>
            <li className="p-2">
              <Link to={`/themes`} onClick={handleCloseMenu}>テーマ一覧</Link>
            </li>

            <li className="p-2">
              <Link to={`/inquiries`} onClick={handleCloseMenu}>問い合わせ一覧</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default SideMenu;
