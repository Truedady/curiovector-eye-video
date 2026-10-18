# CurioVector — Visual Style Guide

The reusable reference for every CurioVector episode. It covers how things look and move, not what any one episode says. Code references point to the Remotion implementation in `src/`.

---

## 1. Brand colors

| Token | Hex | Use |
|---|---|---|
| Deep Navy | `#08132F` | Base background, outer vignette |
| Navy 2 / 3 / 4 | `#0D1C42` / `#15295A` / `#1E3A78` | Depth layers, cards, panels, interior fills |
| Electric Blue | `#43C5F5` | Scientific processes: signals, rays, scan paths, rim light, outlines |
| Blue Deep | `#1F7FC0` | Irises, secondary diagram fills |
| Muted Blue | `#8EA6CF` | Secondary labels, axes, captions |
| Warm Orange | `#FF923E` | Discoveries, key highlights, focus rings, keywords, hero frames |
| Orange Soft / Deep | `#FFC08A` / `#D9662A` | Warm surfaces (frames, roofs, lamps), shading of orange objects |
| White | `#F8FAFF` | Primary text, specular highlights |
| Skin / Skin Shade | `#F3BE98` / `#D58C69` | Characters |

Rules:
- Blue explains a process and orange marks what matters. Never use orange for routine motion.
- Each frame has at most one orange focal point at a time.
- Backgrounds are never flat. Use a navy radial gradient plus two slow-drifting glows: cyan at the upper left, orange at the lower right.

## 2. Typography

- Family: **Montserrat** (500 / 700 / 800), loaded locally from `public/fonts`.
- **Title**: 800, uppercase, orange, soft orange glow. Use it once per concept, for the name of a phenomenon.
- **Chip**: 700, white text on a translucent navy pill with a cyan hairline border. Highlight one keyword in orange (`<Hi>`).
- **Label**: 700, uppercase, muted blue, letter-spacing 0.2em. Use it to name objects and panels.
- **Glyph**: a single huge orange character (for example "?") for moments of puzzlement.
- Size: chips 40 px (16:9) / 46 px (9:16). Titles about 96 px (16:9) and no wider than 80 % of the frame in 9:16.
- Keep text short (2–5 words). Never transcribe the narration, and never show the same headline twice.

## 3. Illustration style

- Hand-built SVG vector illustration with clean silhouettes and rounded geometry.
- Layer every object: base fill, gradient body, a shadow side at about 17 % navy-violet overlay, a specular highlight, and a cyan rim light on the right edge.
- Characters have large readable eyes, a warm key light from the left, a cyan rim light from the right, and an orange collar accent.
- A recurring world motif (house, tree, sun, bird) is reused as "the world" so viewers recognise it across scenes.
- Drop shadows: soft, offset downward (`#shadow` filter), about 55 % opacity.

## 4. Lighting and shading

- Warm key light from the upper left, cool cyan rim light from the right.
- Glow (`#glow`, a 6 px blur merge) is only for live signals: rays, pulses, scan paths, rings.
- Soft glow (`#softglow`, a 14 px blur) is for halos behind discoveries such as a lamp, the visual cortex, or a stable output.
- Glass and screens get one or two diagonal white sheens at 5–7 % opacity.

## 5. Scientific diagrams

- Cross-sections use navy fills, a white outline, cyan functional parts (retina, nerve signals), and an orange point of interest (fovea, active region).
- Signals are glowing cyan dots that travel along paths. Their brightness and size show signal strength.
- Graphs sit in a rounded navy panel with muted axes, a cyan curve drawn on over time, and an orange event band. A dashed zero line is added when "not zero" matters.
- Simulations are labelled **SIMULATION** and framed in orange so they are never mistaken for real perception.
- Keep diagrams schematic. Simplify, but never contradict the science.

## 6. Transitions

- Scenes crossfade over 0.4 s and are never dipped to black. The shared backdrop persists underneath.
- Elements enter with ease-out (or a slight back-ease for cards) from 0.9–0.94 scale with a 16–120 px offset.
- Camera moves are eased dolly-ins and pull-backs (`Cam` world camera). Each scene also has a constant slow drift of 1.00 → 1.03 for life.
- Parallax: foreground silhouettes move faster than the set, and backdrop glows drift independently.

## 7. Animation timing conventions

- **Audio first**: the narration file is the master clock. All cues live in one shared `timeline.ts` (seconds), and scenes read absolute time `t`.
- A visual reveal lands on, or up to 0.2 s before, the word it illustrates.
- Scene boundaries fall about 0.2 s before the first word of the scene.
- Saccade-style motion goes through `gaze(t, keys, dur)`:
  - "perceived" movement: `dur = 1/30` (a one-frame snap),
  - "recorded" movement: `dur ≈ 0.12–0.2 s` plus `trail()` ghosts.
- Fixation hops run at about 3 per second (`fixations()`), are deterministic (seeded `random`), and are drawn with `ScanPath`.
- Text windows: fade in 0.3–0.4 s, hold at least 1.2 s, fade out 0.3 s.
- All motion is deterministic. There is no `Math.random`, and nothing depends on time outside the frame.

## 8. Landscape (16:9, 1920×1080) layout rules

- Show comparisons side by side (left = cause or natural view, right = result or instrument).
- Pipelines run left to right, with explanatory panels (graphs, results) in the lower band.
- Keep about 80 px side margins. Titles go in the band between the diagram and the panel.
- Cinematic wides are allowed. Push in for detail moments.

## 9. Portrait (9:16, 1080×1920) layout rules

- Recompose natively. Never letterbox a 16:9 frame. Stack comparisons vertically and make subjects larger.
- Important content sits between y ≈ 200 px and y ≈ 1580 px (frame-centre coordinates −760 … +620) to clear the Shorts UI.
- Faces and eyes may fill the frame width. Close-ups are the default for characters.
- Diagrams are rescaled (about 0.8×), with their panels stacked beneath them.
- Multi-item sets become rows: an icon or character on the left and the illustration on the right.
- Every region of the frame has a purpose. The background extends naturally, with no empty half-frames.

## 10. Reusable components (`src/components`)

| Component | Purpose |
|---|---|
| `Stage`, `Cam`, `Filters` | Full-frame SVG with pixel units, world camera, shared glow/shadow filters |
| `Backdrop` | Navy environment with drifting light |
| `Tag`, `Hi` | Text overlays (chip / title / label / glyph) with orange keyword highlight |
| `Ring` | Pulsing focus ring |
| `Face` | Character head (hero/friend variants), gaze, blink, iris ghost trails |
| `Mirror`, `MirrorRoom` | Arched mirror with clipping, glow, shimmer, reflected room |
| `Phone`, `HandBack`, `HandThumb` | Horizontal phone with REC / PLAYBACK UI, holding hand |
| `ScenePicture` | The recurring illustrated world, croppable via `vb` |
| `BigEye` | Large front-view eye for close scientific shots |
| `EyeSection` | Eye cross-section with retina, fovea, sweep arc, rotation |
| `Brain` | Side-view brain with glowing visual cortex |
| `ScanPath` | Fixations and saccade jumps |
| `Card` | Rounded illustration card |

Helpers (`src/lib.ts`): `useLayout().pick(landscape, portrait)`, `pr`, `win`, `gaze`, `trail`, `fixations`, `bez`.
One `Episode` component powers both compositions. Only geometry differs between the formats, chosen with `pick`.
