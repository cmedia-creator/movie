# 推しプロフ MVP

GitHub Pages + Supabase 用のビルド不要版です。

## ファイル構成
- index.html
- assets/style.css
- assets/app.js

## 公開前に必要なSupabase設定
Authentication → Sign In / Providers → Anonymous → Enable Anonymous Sign-Ins をON。

このMVPではプロフィール作成時に匿名ユーザーを作り、同じ端末なら再編集できます。
課金導入時にメール等の永続アカウントへ昇格させる設計です。

## GitHub Pages
フォルダ内のファイルをリポジトリ直下に置き、Pagesを main / root から公開します。

## セキュリティ
app.jsに入っているのはブラウザ公開用のSupabase publishable keyだけです。
Secret key / service_role keyは絶対にGitHubへ置かないでください。
DB側はRLSで本人以外の更新を禁止しています。

## URL
公開プロフィールは `index.html?p=slug` 形式です。
GitHub Pages公開後は `https://.../?p=slug` で共有できます。
