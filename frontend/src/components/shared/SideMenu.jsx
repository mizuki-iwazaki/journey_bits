import React from 'react';
// import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

const SideMenu = ({ isOpen, toggleMenu, logout }) => {
  const menuClasses = `side-menu ${isOpen ? 'active' : ''}`;
  
  return (
    <div className={menuClasses}>
      <button onClick={toggleMenu} className="text-white p-2 absolute top-0 right-0">
        <CloseIcon />
      </button>
      {/* サイドメニューのリンクとアクション */}
      <ul className="pt-10">
        <li className="p-2">マイページ</li>
        <li className="p-2">ブックマーク一覧</li>
        <li className="p-2">マッピング</li>
        <li className="p-2">アルバム</li>
        <li className="p-2">
          <button onClick={logout}>ログアウト</button>
        </li>
      </ul>
    </div>
  );
};

export default SideMenu;
