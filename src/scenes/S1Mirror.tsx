import React from 'react';
import {Cam, Filters, Hi, Ring, Stage, Tag} from '../components/core';
import {EYE_DX, EYE_Y, Face, IRIS_X} from '../components/Face';
import {Mirror, MirrorRoom} from '../components/Props';
import {CUE} from '../timeline';
import {C} from '../theme';
import {eInOut, gaze, Key, lerp, pr, useLayout, win} from '../lib';

const L = -0.62;
const R = 0.62;
/** Reflection gaze — snaps in a single frame: in the mirror it "looks instant". */
export const S1_KEYS: Key[] = [
  {t: 0, x: 0.1},
  {t: 1.95, x: L},
  {t: 4.2, x: R},
  {t: 5.2, x: L},
  {t: 5.65, x: R},
  {t: 6.1, x: L},
  {t: 6.55, x: R},
  {t: 8.92, x: L},
  {t: 9.7, x: R},
  {t: 10.45, x: L},
  {t: 11.2, x: R},
];

export const S1Mirror: React.FC<{t: number}> = ({t}) => {
  const {pick, P} = useLayout();
  const fs = pick(1.0, 1.25);
  const M = pick({x: 170, y: 10, w: 760, h: 980}, {x: 0, y: -40, w: 960, h: 1560});
  const head = {x: M.x, y: M.y + pick(-40, -170)};
  const eyes = {x: head.x, y: head.y + EYE_Y * fs};

  // Camera: wide → push-in to both eyes → ease back slightly before the phone scene.
  const kIn = pr(t, 0.1, 2.2, eInOut);
  const kOut = pr(t, 11.2, 1.2, eInOut);
  const wide = pick({x: -40, y: 0, s: 1}, {x: 0, y: 0, s: 1});
  const close = pick(3.5, 2.7);
  const mid = pick({x: M.x, y: eyes.y + 60, s: 1.7}, {x: 0, y: eyes.y + 80, s: 1.6});
  const cam = {
    x: lerp(lerp(wide.x, eyes.x, kIn), mid.x, kOut),
    y: lerp(lerp(wide.y, eyes.y + 6, kIn), mid.y, kOut),
    s: lerp(lerp(wide.s, close, kIn), mid.s, kOut),
  };
  const sc = (wx: number, wy: number) => ({x: (wx - cam.x) * cam.s, y: (wy - cam.y) * cam.s});

  const g = gaze(t, S1_KEYS, 1 / 30);
  const blink = t > 7.6 && t < 7.75 ? Math.sin(((t - 7.6) / 0.15) * Math.PI) : 0;

  const eyeL = {x: head.x - EYE_DX * fs, y: eyes.y};
  const eyeR = {x: head.x + EYE_DX * fs, y: eyes.y};
  const ringL = win(t, CUE.leftEye, CUE.rightEye + 0.1, 0.25, 0.2) + (t > 5.2 && t < 6.5 && g.x < 0 ? 1 : 0);
  const ringR = win(t, CUE.rightEye, CUE.backAndForth + 0.05, 0.2, 0.15) + (t > 5.2 && t < 6.5 && g.x > 0 ? 1 : 0);

  // "It looks instant": ghost start/end positions with a dashed, unseen path.
  const ghostO = win(t, CUE.jumpInstantly, 12.0, 0.3, 0.5);
  const unseen = pr(t, CUE.neverCatch, 0.8);

  // Foreground silhouette (viewer's own head) — slides away as the camera dollies in.
  const sil = pick({x: -640, y: 360, s: 1.35}, {x: -330, y: 800, s: 1.35});
  const silO = 1 - pr(t, 0.6, 1.4);

  const eyeS = sc(eyeL.x, eyeL.y);
  const eyeS2 = sc(eyeR.x, eyeR.y);

  return (
    <>
      <Stage>
        <Filters />
        <Cam x={cam.x} y={cam.y} s={cam.s}>
          {/* wall + lamp */}
          <rect x={-2000} y={-2400} width={4000} height={4800} fill="#0C1A3C" />
          {Array.from({length: 14}).map((_, i) => (
            <rect key={i} x={-1800 + i * 280} y={-2400} width={6} height={4800} fill="#fff" opacity={0.025} />
          ))}
          <circle cx={M.x - M.w / 2 - 120} cy={M.y - M.h * 0.28} r={260} fill={C.orange} opacity={0.14} filter="url(#softglow)" />
          <rect x={M.x - M.w / 2 - 136} y={M.y - M.h * 0.28 - 40} width={32} height={80} rx={14} fill="#FFC08A" />
          <rect x={M.x - M.w / 2 - 128} y={M.y - M.h * 0.28 + 30} width={16} height={60} fill="#7a3d1c" />
          <g transform={`translate(${M.x} ${M.y})`}>
            <Mirror id="s1m" w={M.w} h={M.h}>
              <MirrorRoom w={M.w} h={M.h} />
              <g transform={`translate(0 ${head.y - M.y}) scale(${fs})`}>
                <Face id="s1f" gx={g.x} gy={0.05} blink={blink} />
              </g>
            </Mirror>
          </g>
          <Ring x={eyeL.x} y={eyeL.y} r={64 * fs} o={Math.min(1, ringL)} t={t} width={4 / Math.max(1, cam.s / 2)} />
          <Ring x={eyeR.x} y={eyeR.y} r={64 * fs} o={Math.min(1, ringR)} t={t} width={4 / Math.max(1, cam.s / 2)} />
          {ghostO > 0 &&
            [eyeL, eyeR].map((e, i) => {
              const a = {x: e.x + L * IRIS_X * fs, y: e.y + 2 * fs};
              const b = {x: e.x + R * IRIS_X * fs, y: e.y + 2 * fs};
              return (
                <g key={i} opacity={ghostO}>
                  <circle cx={a.x} cy={a.y} r={21 * fs} fill="none" stroke={C.white} strokeWidth={1.6} strokeDasharray="4 3" opacity={0.8} />
                  <circle cx={b.x} cy={b.y} r={21 * fs} fill="none" stroke={C.white} strokeWidth={1.6} strokeDasharray="4 3" opacity={0.8} />
                  <path
                    d={`M ${a.x} ${a.y - 26 * fs} Q ${e.x} ${e.y - 52 * fs} ${b.x} ${b.y - 26 * fs}`}
                    fill="none"
                    stroke={C.blue}
                    strokeWidth={2.4}
                    strokeDasharray="5 5"
                    opacity={1 - unseen * 0.75}
                  />
                  <text x={e.x} y={e.y - 44 * fs} fill={C.orange} fontSize={18 * fs} fontWeight={800} textAnchor="middle" fontFamily="Montserrat" opacity={unseen}>
                    ?
                  </text>
                </g>
              );
            })}
        </Cam>
        {silO > 0 && (
          <g
            transform={`translate(${(P ? 540 : 960) + sil.x - kIn * 500} ${(P ? 960 : 540) + sil.y + kIn * 420}) scale(${sil.s * (1 + kIn * 0.6)})`}
            opacity={silO}
          >
            <path d="M -320 400 C -310 260 -190 220 -80 210 L 80 210 C 190 220 310 260 320 400 Z" fill="#050B1D" />
            <ellipse cx={0} cy={-20} rx={190} ry={230} fill="#050B1D" />
            <path d="M 150 -170 C 210 -100 206 60 150 140" fill="none" stroke={C.blue} strokeWidth={6} opacity={0.45} />
          </g>
        )}
      </Stage>
      <Tag x={eyeS.x} y={eyeS.y + pick(150, 170)} o={win(t, CUE.leftEye + 0.05, CUE.rightEye, 0.3, 0.25)}>
        Left eye
      </Tag>
      <Tag x={eyeS2.x} y={eyeS2.y + pick(150, 170)} o={win(t, CUE.rightEye + 0.05, CUE.backAndForth + 0.2, 0.3, 0.25)}>
        Right eye
      </Tag>
      <Tag x={pick(0, 0)} y={pick(-330, -560)} o={win(t, CUE.noticeWeird, CUE.jumpInstantly - 0.2, 0.35, 0.3)} variant="glyph">
        ?
      </Tag>
      <Tag x={0} y={pick(330, 520)} o={win(t, CUE.jumpInstantly + 0.1, CUE.neverCatch - 0.05, 0.35, 0.25)}>
        It looks <Hi>instant</Hi>
      </Tag>
      <Tag x={0} y={pick(330, 520)} o={win(t, CUE.neverCatch + 0.05, 12.3, 0.35, 0.3)}>
        You never see them <Hi>move</Hi>
      </Tag>
    </>
  );
};
