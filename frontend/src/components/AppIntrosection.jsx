import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from './user/AuthContext';

const AppIntrosection = () => {
  const { guestLogin } = useContext(AuthContext);

  return (
    <div className="form-container">
      <section className="text-black bg-white min-h-screen body-font">
        <div className="container mx-auto flex px-2 py-24 items-center justify-center flex-col">
          <div className="text-center lg:w-2/3 w-full">
            <h1 className="title-font sm:text-2xl text-xs mb-4 font-medium text-left">
              Jouney Bitsで写真、場所、思い出を、1つのアプリケーションで管理しませんか？
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-left px-6">
              テーマに沿って記憶に残るエピソードを投稿・共有できます。<br />
              投稿ではエピソードのほか、関係する場所や画像も管理できます。<br />
              投稿する際に思い出を振り返ることで、より鮮明に記録・記憶していくことを補助するサービスです。<br />
              ※投稿はステータスを選択する事で、他のユーザーに非表示にすることができます。
            </p>
            <h2 className="font-medium mb-2 text-left">特長:</h2>
            <ul className="mb-8 text-xl list-disc list-inside leading-relaxed text-left px-6">
              <li>テーマに沿って記憶に残るエピソードを投稿・共有できます。</li>
              <li>投稿ではエピソードのほか、関係する場所や画像も管理できます。</li>
              <li>
                投稿する際に思い出を振り返ることで、より鮮明に記録・記憶していくことを補助するサービスです。<br />
                ※投稿はステータスを選択する事で、他のユーザーに非表示にすることができます。
              </li>
            </ul>
            <div className="flex justify-center">
              <button className="mr-4 inline-flex text-white bg-custom-turquoise hover:bg-custom-hover-turquoise border-0 py-2 px-6 focus:outline-none rounded text-lg">
                <Link to="/signup">
                  今すぐ始める<br />(会員登録)
                </Link>
              </button>
              <button onClick={guestLogin} className="mr-4 inline-flex text-white bg-custom-gray hover:bg-custom-hover-gray border-0 py-2 px-6 focus:outline-none rounded text-lg">
                お試し<br />(ゲストログイン)
              </button>
            </div>
            <div className="flex justify-center py-2">
              <p className="mb-8 text-xl leading-relaxed text-left">
                ※ゲストログインは投稿の閲覧と検索のみ実行可能です。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppIntrosection;
