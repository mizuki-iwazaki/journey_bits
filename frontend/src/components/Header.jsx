import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900 text-white p-4">
      <div className="container max-w-full flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold">
          Journey Bits
        </Link>
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
      </div>
    </header>
  );
};

export default Header;
