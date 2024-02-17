import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="form-container">
      <section className="text-black bg-white min-h-screen body-font">
        <div className="container mx-auto px-5 py-14">
          <div className="text-left">
            <h1 className="text-3xl font-bold mb-2">お客様から取得する情報</h1>
            <p className="mb-4">当社は、お客様から以下の情報を取得します。</p>
            <ul className="list-disc pl-5 mb-6">
              <li>氏名(ニックネームやペンネームも含む)</li>
              <li>メールアドレス</li>
              <li>Cookie(クッキー)を用いて生成された識別情報</li>
            </ul>

            <h1 className="text-3xl font-bold mb-2">お客様の情報を利用する目的</h1>
            <p className="mb-4">お客様から取得した情報を、以下の目的のために利用します。</p>
            <ul className="list-disc pl-5 mb-6">
              <li>サービスに関する登録の受付、お客様の本人確認、認証のため</li>
              <li>サービスにおけるお客様の行動履歴を分析し、サービスの維持改善に役立てるため</li>
              <li>以上の他、サービスの提供、維持、保護及び改善のため</li>
            </ul>

            <h1 className="text-3xl font-bold mb-2">アクセス解析ツール</h1>
            <p className="mb-4">お客様のアクセス解析のために、「Googleアナリティクス」を利用しています。Googleアナリティクスは、トラフィックデータの収集のためにCookieを使用しています。トラフィックデータは匿名で収集されており、個人を特定するものではありません。Cookieを無効にすれば、これらの情報の収集を拒否することができます。詳しくはお使いのブラウザの設定をご確認ください。</p>
            <p className="mb-4">Googleアナリティクスについて、詳しくは以下からご確認ください。<br /><a href="https://marketingplatform.google.com/about/analytics/terms/jp/" className="text-blue-500">https://marketingplatform.google.com/about/analytics/terms/jp/</a></p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default React.memo(PrivacyPolicy);
