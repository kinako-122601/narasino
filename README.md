# ふなばし満腹案内所

船橋の大盛り・食べ放題スポットを探したり、お店やレビューを投稿したりできるサイトです。投稿は Supabase を通じて閲覧者全員に共有されます。

## セットアップ

1. Supabase プロジェクトを作成します。
2. Supabase の SQL Editor で [`supabase-schema.sql`](./supabase-schema.sql) を実行します。すでにテーブルを作成済みの場合も、住所・営業時間・電話番号の列を追加し、初期掲載店の情報を更新するため、更新したSQLをもう一度実行してください。固定IDの4店舗は最新の掲載内容に更新され、レビューは保持されます。
3. Project Settings の API から Project URL と anon public key を取得し、[`supabase-config.js`](./supabase-config.js) の `url` と `anonKey` に設定します。anon public key はブラウザーから利用する公開キーです。`service_role` キーは絶対に設定しないでください。
4. `main` ブランチへ push すると GitHub Actions が GitHub Pages に公開します。サイトのURLは `https://kinako-122601.github.io/narasino/` です。ローカルで試す場合は `python3 -m http.server 8000` を実行し、`http://localhost:8000` を開きます。

## 投稿データとアクセス制御

投稿データは Supabase の共有データベースに保存されます。匿名ユーザーが閲覧・追加できるよう Row Level Security を設定しています。投稿の編集・削除やログイン機能はありません。匿名投稿を許可するため、公開前にスパム対策が必要な場合は認証やレート制限を追加してください。

初期掲載店は「二葉海神 第一支店」「福徳食堂」「大乃家食堂」「ビッグテキサス 船橋店」です。住所・営業時間・電話番号を公開情報をもとに掲載し、店舗情報の出典リンクを表示しています。営業時間や価格は変更されることがあるため、来店前に店舗へご確認ください。

## 写真

サイト内の料理写真は Wikimedia Commons の CC0（パブリックドメイン）写真を使用しています。掲載店の実際の料理写真ではなく、参考イメージです。

- ラーメン: [Ramen-2.jpg](https://commons.wikimedia.org/wiki/File:Ramen-2.jpg)
- カツカレー: [Chicken katsu curry.jpg](https://commons.wikimedia.org/wiki/File:Chicken_katsu_curry.jpg)
- チキンカツ: [Chicken Cutlet 001.jpg](https://commons.wikimedia.org/wiki/File:Chicken_Cutlet_001.jpg)
- 海鮮丼: [Seafood bowl.jpg](https://commons.wikimedia.org/wiki/File:Seafood_bowl.jpg)
- リブステーキ: [Ikinari Steak rib eye steak.jpg](https://commons.wikimedia.org/wiki/File:Ikinari_Steak_rib_eye_steak.jpg)