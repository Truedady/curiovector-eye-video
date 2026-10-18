import React from 'react';
import {Cam, Filters, Hi, Stage, Tag} from '../components/core';
import {BigEye, PIC_POI, ScanPath, ScenePicture} from '../components/Props';
import {CUE, SCENES} from '../timeline';
import {C} from '../theme';
import {eInOut, Fix, fixations, fixIndex, gaze, Key, lerp, pr, useLayout, win} from '../lib';

const S = SCENES[2];
const SCAN_A = 25.0;
const SCAN_B = 27.3;
const P_ = PIC_POI;
export const S3_FIX: Fix[] = [
  {t: 28.4, ...P_[0]},
  {t: 28.8, ...P_[1]},
  {t: 29.2, ...P_[2]},
  {t: 29.63, ...P_[3]},
  {t: 30.06, ...P_[4]},
  ...fixations('s3', 30.45, S.end + 0.5, P_, 0.33, 30),
];
const toGaze = (px: number, py: number) => ({x: ((px - 500) / 500) * 0.85, y: ((py - 320) / 320) * 0.9});
const KEYS: Key[] = S3_FIX.map((f) => ({t: f.t, ...toGaze(f.x, f.y)}));

export const S3Saccades: React.FC<{t: number}> = ({t}) => {
  const {pick} = useLayout();
  const pic = pick({x: 300, y: 40, w: 1040, h: 666}, {x: 0, y: -450, w: 960, h: 614});
  const eye = pick({x: -580, y: 40, s: 0.92}, {x: 0, y: 330, s: 1.3});
  const tagPos = pick({x: 300, y: 440}, {x: 0, y: -60});
  const titlePos = pick({x: 300, y: -400}, {x: 0, y: -60});
  const drift = lerp(1, 1.03, pr(t, S.start, S.end - S.start, eInOut));
  const enter = pr(t, S.start, 0.9);

  const toW = (px: number, py: number) => ({x: pic.x + ((px - 500) * pic.w) / 1000, y: pic.y + ((py - 320) * pic.h) / 640});

  // Smooth scan (what eyes do NOT do), then saccadic fixations.
  const scanK = eInOut(Math.min(1, Math.max(0, (t - SCAN_A) / (SCAN_B - SCAN_A))));
  const scanning = t >= SCAN_A && t < CUE.rapidJumps;
  const scanPx = 70 + 860 * scanK;
  let g = {x: 0, y: 0};
  if (t < CUE.rapidJumps) g = scanning ? toGaze(scanPx, 320) : {x: 0, y: 0};
  else g = gaze(t, KEYS, 0.05);

  const idx = fixIndex(S3_FIX, t);
  const cur = idx >= 0 ? toW(S3_FIX[idx].x, S3_FIX[idx].y) : null;
  const pupil = {x: eye.x + g.x * 120 * eye.s, y: eye.y + g.y * 42 * eye.s};
  const cross = win(t, SCAN_B, CUE.rapidJumps + 0.2, 0.25, 0.3);
  const video = pr(t, CUE.watchVideo - 0.2, 0.6);

  return (
    <>
      <Stage>
        <Filters />
        <Cam s={drift}>
          <g opacity={enter} transform={`translate(${pic.x} ${pic.y}) scale(${lerp(0.94, 1, enter)}) translate(${-pic.x} ${-pic.y})`}>
            <rect x={pic.x - pic.w / 2 - 14} y={pic.y - pic.h / 2 - 14} width={pic.w + 28} height={pic.h + 28} rx={30} fill="#050B1D" filter="url(#shadow)" />
            <g clipPath="url(#s3clip)">
              <ScenePicture id="s3p" w={pic.w} h={pic.h} x={pic.x - pic.w / 2} y={pic.y - pic.h / 2} />
            </g>
            <defs>
              <clipPath id="s3clip">
                <rect x={pic.x - pic.w / 2} y={pic.y - pic.h / 2} width={pic.w} height={pic.h} rx={20} />
              </clipPath>
            </defs>
            <rect x={pic.x - pic.w / 2} y={pic.y - pic.h / 2} width={pic.w} height={pic.h} rx={20} fill="none" stroke={C.blue} strokeWidth={3} opacity={0.35} />
            {video > 0 && (
              <g opacity={video}>
                <rect x={pic.x - pic.w / 2 - 14} y={pic.y - pic.h / 2 - 14} width={pic.w + 28} height={pic.h + 28} rx={30} fill="none" stroke="#2B3B66" strokeWidth={14} />
                <rect x={pic.x - pic.w / 2 + 30} y={pic.y + pic.h / 2 - 40} width={pic.w - 60} height={8} rx={4} fill="#fff" opacity={0.3} />
                <rect
                  x={pic.x - pic.w / 2 + 30}
                  y={pic.y + pic.h / 2 - 40}
                  width={(pic.w - 60) * Math.min(1, (t - CUE.watchVideo + 0.2) / 5)}
                  height={8}
                  rx={4}
                  fill={C.orange}
                />
              </g>
            )}
            {scanning && (
              <g>
                <rect x={toW(scanPx, 0).x - 40} y={pic.y - pic.h / 2} width={80} height={pic.h} fill={C.blue} opacity={0.16} />
                <line x1={toW(scanPx, 0).x} y1={pic.y - pic.h / 2} x2={toW(scanPx, 0).x} y2={pic.y + pic.h / 2} stroke={C.blue} strokeWidth={4} filter="url(#glow)" />
              </g>
            )}
            {cross > 0 && (
              <g opacity={cross} transform={`translate(${pic.x} ${pic.y}) scale(${lerp(1.3, 1, cross)})`}>
                <path d="M -90 -90 L 90 90 M 90 -90 L -90 90" stroke={C.orange} strokeWidth={22} strokeLinecap="round" filter="url(#glow)" />
              </g>
            )}
            <ScanPath fx={S3_FIX} t={t} keep={6} scale={1.2} map={toW} />
          </g>
          {cur && <line x1={pupil.x} y1={pupil.y} x2={cur.x} y2={cur.y} stroke={C.blue} strokeWidth={2} strokeDasharray="8 10" opacity={0.3} />}
          <g transform={`translate(${eye.x} ${eye.y}) scale(${eye.s * lerp(1.25, 1, enter)})`} opacity={enter}>
            <BigEye id="s3e" gx={g.x} gy={g.y} />
          </g>
        </Cam>
      </Stage>
      <Tag x={tagPos.x * drift} y={tagPos.y * drift} o={win(t, SCAN_B, CUE.rapidJumps + 0.1, 0.3, 0.3)}>
        Not a <Hi>smooth</Hi> scan
      </Tag>
      <Tag x={titlePos.x * drift} y={titlePos.y * drift} o={win(t, CUE.saccades, CUE.constantly - 0.05, 0.35, 0.3)} variant="title" sub="RAPID EYE JUMPS">
        SACCADES
      </Tag>
      <Tag x={tagPos.x * drift} y={tagPos.y * drift} o={win(t, CUE.constantly + 0.1, S.end + 0.3, 0.4, 0.3)}>
        ≈ <Hi>3 jumps</Hi> every second
      </Tag>
    </>
  );
};
