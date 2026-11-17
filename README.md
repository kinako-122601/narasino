# ふなばし満腹案内所

船橋の大盛り・食べ放題スポットを探したり、お店やレビューを投稿したりできるサイトです。投稿は Supabase を通じて閲覧者全員に共有されます。

## セットアップ

1. Supabase プロジェクトを作成します。
2. Supabase の SQL Editor で [`supabase-schema.sql`](./supabase-schema.sql) を実行します。
3. Project Settings の API から Project URL と anon public key を取得し、[`supabase-config.js`](./supabase-config.js) の `url` と `anonKey` に設定します。anon public key はブラウザーから利用する公開キーです。`service_role` キーは絶対に設定しないでください。
4. `main` ブランチへ push すると GitHub Actions が GitHub Pages に公開します。サイトのURLは `https://kinako-122601.github.io/narasino/` です。ローカルで試す場合は `python3 -m http.server 8000` を実行し、`http://localhost:8000` を開きます。

## 投稿データとアクセス制御

投稿データは Supabase の共有データベースに保存されます。匿名ユーザーが閲覧・追加できるよう Row Level Security を設定しています。投稿の編集・削除やログイン機能はありません。匿名投稿を許可するため、公開前にスパム対策が必要な場合は認証やレート制限を追加してください。