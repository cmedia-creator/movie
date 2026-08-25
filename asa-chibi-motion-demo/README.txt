ASA Motion Demo / Radical Rebuild

今回の方針
- 最小修正をやめ、首元黒化を前提から作り直し
- 表情差分（smile / wink / serious / charm）は idle の共通ボディを使い、
  顔・頭まわりだけを差し替えてボディを共通化
- アクション差分（wave / heart / kiss / dance）は、
  idle の首元 / ふわ襟パッチを素材自体へ焼き込んで共通化
- 切替はクロスフェードなし、単一画像 + 短いフラッシュ
- モーションは CSS の動き中心に再設計し、差分切替回数を減らした
- 画面中央 / キャラ大きめ / TikTok前提

内容
- assets/: 11枚
- index.html
- README.txt

反映:
`asa-chibi-motion-demo/` をこのフォルダで丸ごとアップしてください。
