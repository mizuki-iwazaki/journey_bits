# journey_bits

## サービス概要
友人等とのトーク内容や体験談から場所を登録・共有するサービスです。
直近の思い出だけでなく、「この話は印象に残っている」といった出来事を振り返ってもらうことで、思い出を鮮明に残していくサービスです。

## ユーザー層について
旅行やお出かけが好きな方で、過去の経験やエピソードを共有したいと思う方。
自身の思い出を1つのサービス内で管理していきたい方。

## サービスの利用イメージ
登録するというアクションをする時点で、「〜に行った」という場所自体は覚えているものと思われます。
そこの場所で起きた出来事やエピソードなどから記録していきます。
またはその逆に遠い過去の出来事で、印象深いエピソード自体は覚えているが...といった場合には、思い出すアクションをすることで、良き思い出を振り返ってもらう。

## ユーザーの獲得について
SNSや記事作成にてサービスの拡散を考えています。

## サービスの差別化ポイント・推しポイント
思い出という観点では写真が挙げられますが、体験談等を場所と紐づけて記録できる点です。

本サービスでは、テーマに沿ったエピソードを思い出してもらい、そこから関連する場所を登録するという手順を踏むことを想定しています。
イメージとしては、アルバムサービス, X, Instagram等のSNSが思い出として真新しい直近の出来事に関して投稿するのに対して、時期を問わず思い出せる内容で記載してもらう形です。
アルバムサービスやSNSでは写真を主軸にするのに対して、本サービスでは思い出エピソードや体験談を主軸に、場所を登録するという点が異なるポイントと考えています。
また投稿のステータスを公開 or 非公開を選べることで自身の記録用としても使用できます。

## サービスコンセプト
旅行などの外出時には一般的に写真が思い出となることが多いが、他に思い出として残せるものは何か？を考えました。自身の体験談を記録していくことで、フリートークなどの話題提供としても機能するのではと考えたことが、本サービスを作成するきっかけとなりました。

友人と出かけた時のトーク内容や訪問場所での体験談を記録・共有することで思い出として記録することができると思い、本サービスを作成するきっかけとなりました。

``体験したエピソードを主軸に、訪問した場所を登録する``という点が他の旅行系アプリとの差別化ポイントとなります。

観光地などの複数の投稿がされやすい場所では、自分とは違う体験やエピソードを見ることができることも楽しめるポイントの1つです。

例）初めて〇〇した話, ちょっと良い話等の規定しているテーマ
  テーマ選択 → エピソード内容の登録 → 関連する場所の登録　→ 投稿


## 実装を予定している機能
### MVP
* ログインしていない状態では投稿の閲覧のみ可能とする。
* ユーザー管理
  * ユーザー登録
  * ログイン
* 投稿関連
  * 投稿一覧
  * 投稿 (公開 or 非公開の選択)
  * テーマ選択(規定のテーマから選択)
  * エピソード内容(必須)
  * 画像(任意)
    * CarrierWave、MiniMagickを利用予定。(リサイズとファイル容量)
  * 場所登録
* 自身の登録した場所をMap上でピン表示(Map機能)
* いいね機能
* ブックマーク
* フリーワード検索
  * テーマ, エピソード内容, 場所カラムから検索
* アルバム機能


### その後の実装予定
* レコメンド機能
  過去の投稿や閲覧記録から関連するエピソードを推薦。
  ↑検討中です。
* 思い出すというアクションに焦点を当てる(素案です)
  エピソードを読み込ませて、その適した思い出すための質問を提示？

## 機能の実装方針予定
* バックエンド
  * Ruby(3.2.2)
  * Rails(7.1.1)
      基本的にはv7系で実装予定ですが、状況によってはv6系(最新)での実装も検討しています。

  * その他のgem
    * Google Maps Platform
      React使用予定のため、npmでinstallするかもしれません

* 利用予定の高度な技術
  * Google Maps Platform
  * Amazon Personalize, GCP Recommendations AIか検討中です。

* フロントエンド
  * React(最新ver)使用予定ですが、候補となっている状態です。

* デプロイ先
  * Herokuを検討中です。

* 画面遷移図
  * Figma
  * https://www.figma.com/file/ff5QsZEaNQnqq7jeKcKERm/Untitled?type=design&node-id=0%3A1&mode=design&t=9iFCA1qiQfvr6ban-1

* ER図
  * https://gyazo.com/fb60740572d8925ceb374df2fcfdf1ce