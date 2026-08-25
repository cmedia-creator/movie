ASA Motion Demo fixed

What changed
- Removed sprite-atlas 방식 and switched to single clean PNG swaps.
- Each asset is re-masked to keep only the main character, so stray hearts / notes / speech-bubble-like fragments are removed.
- No more adjacent 2nd / 3rd ASA appearing when moving.
- Dance section slowed down to reduce visual awkwardness.

How to use
- Replace the contents of your existing `asa-chibi-motion-demo/` folder with the contents of this folder.
- Root TOP `index.html` can stay as-is if it already links to `./asa-chibi-motion-demo/`.
