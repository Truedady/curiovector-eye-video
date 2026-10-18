import {Easing, random, useVideoConfig} from 'remotion';

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const eOut = Easing.bezier(0.16, 1, 0.3, 1);
export const eInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const eBack = Easing.bezier(0.34, 1.56, 0.64, 1);

/** Eased 0→1 progress of absolute time `t` over [start, start+dur]. */
export const pr = (t: number, start: number, dur = 0.6, e: (n: number) => number = eOut) => e(clamp((t - start) / dur));
/** Visibility window: fades in at `a`, fades out ending at `b`. */
export const win = (t: number, a: number, b: number, fi = 0.4, fo = 0.4) =>
  Math.min(pr(t, a, fi), 1 - pr(t, b - fo, fo, eInOut));

export type Pt = {x: number; y: number};
export const mix = (a: Pt, b: Pt, k: number): Pt => ({x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k)});
export const bez = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, u: number): Pt => {
  const m = 1 - u;
  return {
    x: m * m * m * p0.x + 3 * m * m * u * p1.x + 3 * m * u * u * p2.x + u * u * u * p3.x,
    y: m * m * m * p0.y + 3 * m * m * u * p1.y + 3 * m * u * u * p2.y + u * u * u * p3.y,
  };
};

/** Layout helper: P = portrait (Shorts). pick(landscape, portrait). */
export const useLayout = () => {
  const {width, height} = useVideoConfig();
  const P = height > width;
  return {W: width, H: height, P, pick: <T,>(l: T, p: T): T => (P ? p : l)};
};

export type Key = {t: number; x: number; y?: number};

/** Saccade-style gaze: holds each key, moving to it over `dur` seconds. */
export const gaze = (t: number, keys: Key[], dur = 0.05) => {
  let idx = -1;
  for (let i = 0; i < keys.length; i++) {
    if (keys[i].t <= t) idx = i;
    else break;
  }
  if (idx < 0) return {x: keys[0].x, y: keys[0].y ?? 0, m: 0};
  const to = keys[idx];
  const from = idx > 0 ? keys[idx - 1] : to;
  const k = eInOut(clamp((t - to.t) / dur));
  return {x: lerp(from.x, to.x, k), y: lerp(from.y ?? 0, to.y ?? 0, k), m: k > 0 && k < 1 ? Math.sin(Math.PI * k) : 0};
};

/** Ghost iris positions trailing a moving gaze (for "camera reveals movement"). */
export const trail = (t: number, keys: Key[], dur: number, n = 4, step = 0.03) => {
  const cur = gaze(t, keys, dur);
  const out: {x: number; y: number; o: number}[] = [];
  for (let i = 1; i <= n; i++) {
    const g = gaze(t - i * step, keys, dur);
    const d = Math.hypot(g.x - cur.x, g.y - cur.y);
    if (d > 0.02) out.push({x: g.x, y: g.y, o: 1 - i / (n + 1)});
  }
  return out;
};

export type Fix = {t: number; x: number; y: number};
/** Deterministic fixation sequence hopping between points of interest. */
export const fixations = (seed: string, start: number, end: number, pts: Pt[], every = 0.33, spread = 18): Fix[] => {
  const out: Fix[] = [];
  let tt = start;
  let last = -1;
  let i = 0;
  while (tt < end) {
    let j = Math.floor(random(`${seed}-p${i}`) * pts.length);
    if (j === last) j = (j + 1) % pts.length;
    out.push({
      t: tt,
      x: pts[j].x + (random(`${seed}-x${i}`) - 0.5) * spread,
      y: pts[j].y + (random(`${seed}-y${i}`) - 0.5) * spread,
    });
    last = j;
    tt += every * (0.75 + 0.5 * random(`${seed}-d${i}`));
    i++;
  }
  return out;
};

/** Index of the current fixation (−1 if none yet). */
export const fixIndex = (fx: Fix[], t: number) => {
  let idx = -1;
  for (let i = 0; i < fx.length; i++) {
    if (fx[i].t <= t) idx = i;
    else break;
  }
  return idx;
};
