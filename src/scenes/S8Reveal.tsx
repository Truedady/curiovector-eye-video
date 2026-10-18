import React from 'react';
import {random} from 'remotion';
import {Cam, Filters, Stage, Tag} from '../components/core';
import {EYE_DX, EYE_Y, Face} from '../components/Face';
import {Brain, Mirror, MirrorRoom, ScenePicture} from '../components/Props';
import {CUE, SCENES} from '../timeline';
import {C} from '../theme';
import {bez, eInOut, gaze, lerp, pr, useLayout, win} from '../lib';

const S = SCENES[7];
const COLS = 4;
const ROWS = 3;

export const S8Reveal: React.FC<{t: number}> = ({t}) => {
  const {pick} = useLayout();
  const raw = pick({x: -600, y: 20, w: 440, h: 280}, {x: 0, y: -560, w: 720, h: 330});
  const brain = pick({x: 0, y: 0, s: 0.8}, {x: 0, y: -165, s: 0.62});
  const out = pick({x: 600, y: 20, w: 480, h: 300}, {x: 0, y: 290, w: 900, h: 420});
  const M = pick({x: 0, y: 10, w: 740, h: 960, fs: 1.0, hy: -50}, {x: 0, y: -40, w: 960, h: 1500, fs: 1.25, hy: -170});

  const kB = pr(t, CUE.mirrorFinal - 0.35, 0.7, eInOut);
  const aO = pr(t, S.start, 0.6) * (1 - kB);
  const camS = lerp(1, 1.1, pr(t, CUE.mirrorFinal - 0.3, S.end - CUE.mirrorFinal + 0.3, eInOut));
  const drift = lerp(1, 1.03, pr(t, S.start, 8, eInOut));

  // Raw input: jittery, smeared frames (changes every 3 video frames).
  const block = Math.floor(t * 10);
  const rawFrames = [0, 1, 2].map((i) => ({
    dx: (random(`r${block}-${i}x`) - 0.5) * 60,
    dy: (random(`r${block}-${i}y`) - 0.5) * 30,
    r: (random(`r${block}-${i}r`) - 0.5) * 8,
    vx: random(`r${block}-${i}v`) * 900,
  }));
  const rawO = pr(t, CUE.rawRecording, 0.5);

  const pathA = {p0: {x: raw.x, y: raw.y}, p3: {x: brain.x, y: brain.y}};
  const pathB = {p0: {x: brain.x, y: brain.y}, p3: {x: out.x, y: out.y}};
  const pulse = (a: {x: number; y: number}, b: {x: number; y: number}, u: number) => bez(a, a, b, b, u);
  const construct = pr(t, CUE.brainConstructs, 0.6);
  const brainGlow = Math.max(pr(t, CUE.smoothVersion, 0.6) * 0.6, construct) * (0.85 + 0.15 * Math.sin(t * 7));

  // Final mirror
  const g = gaze(t, [{t: 0, x: -0.6}, {t: 110.9, x: 0.6}, {t: 112.6, x: -0.6}, {t: 113.4, x: 0.6}], 1 / 30);
  const shimmer = (t - CUE.hidingAnything) / 1.0;
  const vis = pr(t, CUE.visualSystem, 0.9);
  const ph = (t * 0.9) % 1;

  return (
    <>
      <Stage>
        <Filters />
        <defs>
          <filter id="s8blur" x="-20%" y="-10%" width="140%" height="120%">
            <feGaussianBlur stdDeviation="9 1" />
          </filter>
          <clipPath id="s8rc">
            <rect x={-raw.w / 2} y={-raw.h / 2} width={raw.w} height={raw.h} rx={16} />
          </clipPath>
        </defs>
        {aO > 0 && (
          <Cam s={drift}>
            <g opacity={aO}>
              {[pathA, pathB].map((p, i) => (
                <g key={i}>
                  <line x1={p.p0.x} y1={p.p0.y} x2={p.p3.x} y2={p.p3.y} stroke={i ? C.orange : C.blue} strokeWidth={3} strokeDasharray="10 12" opacity={0.35} />
                  {Array.from({length: 4}).map((_, j) => {
                    const q = pulse(p.p0, p.p3, (t * 0.6 + j / 4) % 1);
                    return <circle key={j} cx={q.x} cy={q.y} r={8} fill={i ? C.orange : C.blue} opacity={i ? construct * 0.9 : 0.8 * rawO} filter="url(#glow)" />;
                  })}
                </g>
              ))}
              <g transform={`translate(${raw.x} ${raw.y})`} opacity={rawO}>
                <rect x={-raw.w / 2 - 10} y={-raw.h / 2 - 10} width={raw.w + 20} height={raw.h + 20} rx={22} fill="#050B1D" filter="url(#shadow)" />
                <g clipPath="url(#s8rc)">
                  {rawFrames.map((f, i) => (
                    <g key={i} transform={`translate(${f.dx} ${f.dy}) rotate(${f.r})`} opacity={i === 0 ? 1 : 0.35} filter="url(#s8blur)">
                      <ScenePicture id={`s8r${i}`} w={raw.w * 1.3} h={raw.h * 1.3} vb={`${f.vx * 0.3} 60 700 448`} />
                    </g>
                  ))}
                </g>
                <rect x={-raw.w / 2} y={-raw.h / 2} width={raw.w} height={raw.h} rx={16} fill="none" stroke={C.blue} strokeWidth={3} opacity={0.6} />
              </g>
              <g transform={`translate(${brain.x} ${brain.y}) scale(${brain.s})`} opacity={pr(t, S.start + 0.3, 0.6)}>
                <Brain id="s8b" glow={brainGlow} activity={0.4 + construct * 0.5} />
              </g>
              <g transform={`translate(${out.x} ${out.y})`}>
                <rect x={-out.w / 2 - 12} y={-out.h / 2 - 12} width={out.w + 24} height={out.h + 24} rx={24} fill={C.orange} opacity={0.4 * construct} filter="url(#softglow)" />
                {Array.from({length: COLS * ROWS}).map((_, i) => {
                  const c = i % COLS;
                  const r = Math.floor(i / COLS);
                  const k = pr(t, CUE.smoothVersion + 0.1 + i * 0.11, 0.6, eInOut);
                  if (k <= 0) return null;
                  const tw = out.w / COLS;
                  const th = out.h / ROWS;
                  const fx = lerp(brain.x - out.x, -out.w / 2 + c * tw, k);
                  const fy = lerp(brain.y - out.y, -out.h / 2 + r * th, k);
                  return (
                    <svg key={i} x={fx} y={fy} width={tw + 0.6} height={th + 0.6} viewBox={`${(c * 1000) / COLS} ${110 + (r * 500) / ROWS} ${1000 / COLS} ${500 / ROWS}`} opacity={k} overflow="hidden">
                      <ScenePicture id={`s8t${i}`} w={1000} h={640} x={0} y={0} />
                    </svg>
                  );
                })}
                <rect x={-out.w / 2} y={-out.h / 2} width={out.w} height={out.h} rx={14} fill="none" stroke={C.orange} strokeWidth={4} opacity={pr(t, CUE.smoothVersion, 0.5)} />
              </g>
            </g>
          </Cam>
        )}
        {kB > 0 && (
          <Cam y={lerp(0, M.y + (M.hy + EYE_Y) * M.fs, (camS - 1) * 3)} s={camS}>
            <g opacity={kB} transform={`translate(${M.x} ${M.y})`}>
              <Mirror id="s8m" w={M.w} h={M.h} glow={vis * 0.8} shimmer={shimmer}>
                <MirrorRoom w={M.w} h={M.h} />
                <g transform={`translate(0 ${M.hy}) scale(${M.fs})`}>
                  <Face id="s8f" gx={g.x} gy={0.05} />
                  {vis > 0 && (
                    <g opacity={vis}>
                      <path
                        d="M -6 -230 C -70 -236 -140 -200 -146 -140 C -150 -90 -110 -66 -56 -70 C -24 -72 -6 -90 -6 -110 Z M 6 -230 C 70 -236 140 -200 146 -140 C 150 -90 110 -66 56 -70 C 24 -72 6 -90 6 -110 Z"
                        fill={C.blue}
                        fillOpacity={0.12}
                        stroke={C.blue}
                        strokeWidth={3}
                        filter="url(#glow)"
                      />
                      {[-1, 1].map((sd) => (
                        <path
                          key={sd}
                          d={`M ${sd * EYE_DX * 0.7} ${EYE_Y - 6} Q ${sd * 30} ${-40} 0 ${-62} Q ${-sd * 40} ${-90} ${-sd * 90} ${-150}`}
                          fill="none"
                          stroke={C.blue}
                          strokeWidth={4}
                          strokeLinecap="round"
                          pathLength={1}
                          strokeDasharray="1 1"
                          strokeDashoffset={1 - vis}
                          filter="url(#glow)"
                        />
                      ))}
                      <circle cx={0} cy={-150} r={46 + ph * 30} fill="none" stroke={C.orange} strokeWidth={3} opacity={(1 - ph) * vis} />
                      <circle cx={0} cy={-150} r={34} fill={C.orange} opacity={0.35 * vis} filter="url(#softglow)" />
                      <circle cx={0} cy={-150} r={12} fill={C.orange} opacity={vis} />
                    </g>
                  )}
                </g>
              </Mirror>
            </g>
          </Cam>
        )}
      </Stage>
      <Tag x={raw.x * drift} y={(raw.y - raw.h / 2) * drift - 48} o={win(t, CUE.rawWord - 0.2, CUE.mirrorFinal - 0.3, 0.4, 0.4)} variant="label">
        Raw input
      </Tag>
      <Tag x={out.x * drift} y={(out.y - out.h / 2) * drift - 48} o={win(t, CUE.smoothVersion, CUE.mirrorFinal - 0.3, 0.4, 0.4)} variant="label">
        What you experience
      </Tag>
      <Tag x={0} y={pick(495, 640)} o={pr(t, 112.9, 0.6)} variant="label" size={pick(26, 30)}>
        CurioVector
      </Tag>
    </>
  );
};
