/**
 * SHARED MASTER TIMELINE — CurioVector Ep.02 "You've Never Seen Your Own Eyes Move"
 *
 * Source of truth: public/eyes_voiceover.mp3 (114.05 s, mono 44.1 kHz).
 * Word timings were produced once by forced alignment of eyes_script.txt against the
 * recording (pocketsphinx, see timing/eyes_word_alignment.json). Every value below is
 * in SECONDS and is consumed identically by BOTH compositions (16:9 and 9:16).
 */
export const FPS = 30;
export const AUDIO_SECONDS = 114.050563;
export const DURATION_FRAMES = Math.ceil(AUDIO_SECONDS * FPS); // 3422

export type SceneId = 'mirror' | 'phone' | 'saccades' | 'retina' | 'suppression' | 'camera' | 'everyday' | 'reveal';

/** Scene boundaries (start of each scene ≈ 0.2 s before its first spoken word). */
export const SCENES: {id: SceneId; start: number; end: number}[] = [
  {id: 'mirror', start: 0, end: 12.2},
  {id: 'phone', start: 12.2, end: 23.8},
  {id: 'saccades', start: 23.8, end: 40.45},
  {id: 'retina', start: 40.45, end: 53.0},
  {id: 'suppression', start: 53.0, end: 76.0},
  {id: 'camera', start: 76.0, end: 89.75},
  {id: 'everyday', start: 89.75, end: 101.1},
  {id: 'reveal', start: 101.1, end: AUDIO_SECONDS},
];

/** Crossfade length between scenes (seconds). */
export const XFADE = 0.4;

/** Word-level cues for important visual reveals (seconds, from alignment). */
export const CUE = {
  // 1 — mirror
  leftEye: 1.91,
  rightEye: 4.15,
  backAndForth: 5.18,
  noticeWeird: 6.55,
  jumpInstantly: 8.88,
  neverCatch: 10.37,
  // 2 — phone
  record: 12.9,
  phone: 15.57,
  playBack: 16.4,
  thereTheyAre: 17.59,
  movingWholeTime: 18.72,
  whyMirrorHide: 21.22,
  // 3 — saccades
  smoothCamera: 24.76,
  rapidJumps: 28.33,
  pointsOfInterest: 29.63,
  saccades: 32.75,
  constantly: 34.65,
  watchVideo: 36.42,
  hop: 38.11,
  // 4 — retina
  problem: 40.62,
  eyesJump: 42.97,
  retinaSweep: 44.37,
  ifExperienced: 47.22,
  shakySmeared: 50.95,
  // 5 — suppression
  cleverResponse: 53.2,
  fastMovements: 56.62,
  sensitivityDrops: 57.98,
  dropsSharply: 60.46,
  saccadicSuppression: 62.56,
  notBlind: 64.47,
  brainStitches: 66.55,
  before: 70.06,
  after: 70.82,
  stable: 75.17,
  // 6 — friend / camera
  friendsEyes: 76.79,
  dart: 78.16,
  ownVanish: 79.91,
  vanish: 81.71,
  andPhone: 83.39,
  noFiltering: 84.72,
  records: 88.17,
  // 7 — everyday
  strangest: 89.96,
  notOnlyMirrors: 91.74,
  read: 95.54,
  watchVideos: 96.21,
  lookAround: 97.37,
  constantlyMoving: 98.8,
  // 8 — reveal
  rawRecording: 101.31,
  rawWord: 102.94,
  smoothVersion: 105.83,
  brainConstructs: 107.97,
  mirrorFinal: 109.82,
  hidingAnything: 110.61,
  visualSystem: 111.92,
  end: AUDIO_SECONDS,
} as const;

/** Sound-design events, shared by both formats. */
export const SFX: {t: number; src: 'whoosh' | 'tick' | 'chime'; vol: number}[] = [
  ...SCENES.slice(1).map((s) => ({t: s.start - 0.15, src: 'whoosh' as const, vol: 0.22})),
  {t: 1.95, src: 'tick', vol: 0.25},
  {t: 4.2, src: 'tick', vol: 0.25},
  {t: CUE.record, src: 'tick', vol: 0.3},
  {t: CUE.playBack, src: 'tick', vol: 0.3},
  {t: CUE.thereTheyAre, src: 'chime', vol: 0.16},
  {t: CUE.saccades, src: 'chime', vol: 0.16},
  {t: CUE.eyesJump, src: 'whoosh', vol: 0.14},
  {t: CUE.saccadicSuppression, src: 'chime', vol: 0.16},
  {t: CUE.smoothVersion, src: 'chime', vol: 0.14},
  {t: CUE.visualSystem, src: 'chime', vol: 0.18},
];
