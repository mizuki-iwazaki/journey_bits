import React, {useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext  from '../user/AuthContext';
import SideMenu from './SideMenu';
import MenuIcon from '@mui/icons-material/Menu';
import BackButton from './backButton';

const Header = React.memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, logout, isAdmin, isGuest } = useContext(AuthContext);
  const location = useLocation();

  const toggleMenu  = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const showBackButton = location.pathname !== '/'; // ルートページではない場合にtrue

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900 text-white p-4">
      <div className="container max-w-full flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold">
          Journey Bits
        </Link>

        {(isLoggedIn && !isGuest ) && (
          <div className="grid grid-flow-col auto-cols-max gap-4 items-center">
            {showBackButton && (
              <BackButton />
            )}
            <Link to="/posts/create" className="text-xm">
              新規投稿
            </Link>
            <button onClick={toggleMenu} className="text-xl">
              <MenuIcon />
            </button>
            <SideMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} logout={logout} isAdmin={isAdmin} />
          </div>
        )}

        {(!isLoggedIn || isGuest) && (
          <nav>
          <ul className="flex">
            <li className="ml-4">
              <Link to="/signup" className="text-xm">
                新規登録
              </Link>
            </li>
            <li className="ml-4">
              <Link to="/login" className="text-xm">
                ログイン
              </Link>
            </li>
          </ul>
        </nav>
        )}
      </div>
    </header>
  );
});

export default Header;
