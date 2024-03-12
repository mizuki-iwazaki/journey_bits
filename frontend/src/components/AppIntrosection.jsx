import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from './user/AuthContext';

// 他の機能アイコンのパスを追加

const AppIntroSection = () => {
  const { guestLogin } = useContext(AuthContext);

  return (
    <div className="form-container">
      {/* イントロダクションセクション */}
      <section className="text-black bg-white min-h-screen body-font">
        <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
          <div className="text-center lg:w-2/3 w-full">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-center">
              Jouney Bits で思い出を振り返りませんか？
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-left px-6">
              思い出を振り返り、場所を共有する。Journey Bitsで、あなたの思い出を鮮明に記録していきましょう。
            </p>
            <div className="flex justify-center">
              <Link to="/signup" className="inline-flex text-white bg-custom-turquoise hover:bg-custom-hover-turquoise border-0 py-2 px-6 focus:outline-none rounded text-lg">
                今すぐ始める（会員登録）
              </Link>
              <button onClick={guestLogin} className="ml-4 inline-flex text-white bg-custom-gray hover:bg-custom-hover-gray border-0 py-2 px-6 focus:outline-none rounded text-lg">
                お試し（ゲストログイン）
              </button>
            </div>
            <p className="text-lg leading-relaxed text-center py-4">
              ※ゲストログインでは、投稿の閲覧と検索が可能です。
            </p>
          </div>
        </div>
      
      {/* 機能紹介セクション */}
      <section className="bg-gray-100 py-10">
        <div className="container mx-auto">
          <h2 className="text-3xl font-medium text-center mb-8">主要な機能</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 text-center">
            {/* 各機能の紹介 */}
            <div className="feature-item">
              <h3 className="text-xl font-semibold mb-2">投稿</h3>
              <p className="text-left">投稿一覧では他ユーザーの投稿を閲覧できます。<br />新規投稿で自身の思い出を共有できます。</p>
              <div className="px-2 grid grid-cols-2 gap-1">
                <img src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/h_200,c_scale/v1709134445/mfu5jukk6jc6v96dwbc3.png`} alt="Default" />
                <img src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/h_200,c_scale/v1709134445/ncdwnlvy6tkatftcwbm8.png`} alt="Default" />
              </div>
            </div>
            <div className="feature-item">
              <h3 className="text-xl font-semibold mb-2">ユーザー管理</h3>
              <p className="text-left">プロフィールの編集と投稿を管理できます。<br />非公開の投稿はこちらで確認できます。</p>
              <img src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/h_200,c_scale/v1709134445/fo9ntjbdktwsduggszz8.png`} alt="Default" />
            </div>
            <div className="feature-item">
              <h3 className="text-xl font-semibold mb-2">Map機能</h3>
              <p className="text-left">投稿した思い出の登録地点をピン表示できます。<br />ピンを選択することで投稿を確認できます。</p>
              <img src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/h_200,c_scale/v1709134445/k1qebhrucxvntb3h3eda.png`} alt="Default" />
            </div>
            <div className="feature-item">
              <h3 className="text-xl font-semibold mb-2">アルバム機能</h3>
              <p className="text-left">投稿した画像を確認できます。<br />画像をクリックして、投稿を確認できます。</p>
              <img src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/w_500,c_scale/v1709134445/lgrrr8546gm5smaeyeia.png`} alt="Default" />
            </div>
            {/* 他の機能紹介アイテム */}
          </div>
        </div>
      </section>
      </section>
    </div>
  );
};

export default AppIntroSection;
