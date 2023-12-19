import React from 'react';
/* import { Link } from 'react-router-dom'; 機能実装後にコメントイン */

const Footer = React.memo(() => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4">
      <div className="container max-w-full flex justify-between items-center">
        <nav className="w-full">
          <ul className="flex justify-end items-center">
            <li className="ml-4">
              {/* 作成後にリンクへ変更 */}
              利用規約
            </li>
            <li className="ml-4">
              {/* 作成後にリンクへ変更 */}
              プライバシー<br />ポリシー
            </li>
            <li className="ml-4">
              {/* 作成後にリンクへ変更 */}
              お問い合わせ
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
});

export default Footer;
