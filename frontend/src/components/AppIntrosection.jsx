import React from 'react';
/* import { Link } from 'react-router-dom'; */

const AppIntrosection = () => {
  return (
    <section className="text-black bg-white min-h-screen body-font">
      <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
        <div className="text-center lg:w-2/3 w-full">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-black">
          記憶を綴る、思い出を編む
          </h1>
          <p className="mb-8 leading-relaxed">
            JourneyBitsでは、過去の出来事や、記憶に残る話をテーマに沿って綴って投稿します。<br />
            エピソードから場所を振り返ることで、思い出をより鮮明に記録するサービスです。
          </p>
          <div className="flex justify-center">
            <button className="mr-4 inline-flex text-white bg-custom-turquoise hover:bg-custom-hover-turquoise border-0 py-2 px-6 focus:outline-none rounded text-lg">
              {/* 会員登録ページへのリンク */}
              今すぐ始める
            </button>
            <button className="mr-4 inline-flex text-white bg-custom-gray hover:bg-custom-hover-gray border-0 py-2 px-6 focus:outline-none rounded text-lg">
              お試し
            </button>
          </div>
          {/* 機能作成後に画像もしくはGIFを追加して何ができるかをわかりやすく */}
        </div>
      </div>
    </section>
  );
};

export default AppIntrosection;