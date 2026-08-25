ASA Motion Demo / Cute Motion PASS 2

今回の狙い:
「画像を揺らしている」から「小さいキャラが反応している」に寄せる。

主な修正:
- motion rigを3階層化
  pos / physics / breathe を分離し、CSS transformの競合・ガクつきを解消。
- 画像切替の前に必ず軽い「ため」を入れ、切替後にspring settle。
- ウィンクは全身素材に固定。欠損・急ズームを防止。
- serious / charm の半身素材はメインキャラに使用しない。
  小さなreaction cut-inとしてのみ表示し、全身サイズを一切変えない。
- ダンスは1フレームにつきASAは必ず1人だけ。
  約0.92秒/拍で、着地・横重心・影・足元の小さなdustを同期。
- 呼吸は別レイヤーで常時ごく小さく動かす。
- 影がジャンプ/着地/ダンスの重さに追従。
- バイバイは常時高速揺れではなく、2回だけbody beatを入れる。
- ハートは「ため→ぽん→静止」を作り、ポーズを見せる時間を確保。
- ASA / 30 SECOND MOTIONはflex + gapで重なり防止。

GitHub:
`asa-chibi-motion-demo/` フォルダをこのフォルダの中身で丸ごと差し替えてください。
