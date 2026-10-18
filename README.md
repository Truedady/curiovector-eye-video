# CurioVector Ep.02 — "You've Never Seen Your Own Eyes Move"

A Remotion project with two native compositions. Both are driven by one shared timeline in `src/timeline.ts`.

| Composition | Size | Output |
|---|---|---|
| `CurioVectorLandscape` | 1920×1080, 30 fps | `out/CurioVector_Eyes_16x9.mp4` |
| `CurioVectorShorts` | 1080×1920, 30 fps | `out/CurioVector_Eyes_9x16.mp4` |

Inputs: `eyes_script.txt` (narration script) and `public/eyes_voiceover.mp3` (master audio, 114.05 s).
Word timings come from a single forced alignment of the script against the audio, stored in `timing/eyes_word_alignment.json`.
Sound effects in `public/sfx/` were synthesised with ffmpeg; they are original and royalty-free.

```bash
npm install
npm run studio                 # preview
npm run render:landscape
npm run render:shorts
# in a container without Remotion's browser download, add:
#   --browser-executable=/path/to/chrome-headless-shell
```

See `CURIOVECTOR_STYLE.md` for the reusable visual style guide.
