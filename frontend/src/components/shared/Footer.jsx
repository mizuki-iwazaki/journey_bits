import React from 'react';
import { Link } from 'react-router-dom';


const Footer = React.memo(() => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-2">
      <div className="container max-w-full flex justify-between items-center">
        <nav className="w-full">
          <ul className="flex justify-end items-center">
            <li className="ml-4">
              <Link to="/legal/terms_of_service">利用規約</Link>
            </li>
            <li className="ml-4">
              {/* 作成後にリンクへ変更 */}
              <Link to="/legal/privacy_policy">プライバシー<br />ポリシー</Link>
            </li>
            <li className="ml-4">
              <Link to="/inquiry/create">お問い合わせ</Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
});

export default Footer;
