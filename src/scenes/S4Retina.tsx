import React from 'react';
import {Cam, Filters, Hi, Stage, Tag} from '../components/core';
import {EyeSection, ScenePicture} from '../components/Props';
import {CUE, SCENES} from '../timeline';
import {C} from '../theme';
import {eInOut, gaze, Key, lerp, pr, Pt, useLayout, win} from '../lib';
import {random} from 'remotion';

const S = SCENES[3];
const R = 230;
const E = {x: 200, y: 0};
const TREE_TOP = {x: -560, y: -125};
const TREE_BASE = {x: -560, y: 110};

export const S4_KEYS: Key[] = (() => {
  const k: Key[] = [
    {t: S.start, x: 0},
    {t: CUE.eyesJump, x: 22},
    {t: CUE.retinaSweep, x: -18},
    {t: 45.33, x: 16},
    {t: 46.15, x: -12},
  ];
  let i = 0;
  for (let tt = CUE.ifExperienced; tt < S.end + 0.5; tt += 0.42) {
    k.push({t: tt, x: (random(`s4-${i}`) - 0.5) * 44});
    i++;
  }
  return k;
})();

const rot = (p: Pt, deg: number): Pt => {
  const a = (deg * Math.PI) / 180;
  return {x: p.x * Math.cos(a) - p.y * Math.sin(a), y: p.x * Math.sin(a) + p.y * Math.cos(a)};
};
/** Where a ray from P through the (rotated) lens hits the retina sphere. */
const hit = (P: Pt, lens: Pt): Pt => {
  const dx = lens.x - P.x;
  const dy = lens.y - P.y;
  const n = Math.hypot(dx, dy);
  const d = {x: dx / n, y: dy / n};
  const o = {x: lens.x - E.x, y: lens.y - E.y};
  const b = o.x * d.x + o.y * d.y;
  const rr = R * 0.9;
  const s = -b + Math.sqrt(b * b - (o.x * o.x + o.y * o.y) + rr * rr);
  return {x: lens.x + d.x * s, y: lens.y + d.y * s};
};

const DUR = 0.11;

export const S4Retina: React.FC<{t: number}> = ({t}) => {
  const {pick} = useLayout();
  const D = pick({x: -300, y: -10, s: 0.95}, {x: 60, y: -470, s: 0.8});
  const panel = pick({x: 600, y: 0, w: 600, h: 400}, {x: 0, y: 300, w: 940, h: 560});
  const drift = lerp(1, 1.025, pr(t, S.start, S.end - S.start, eInOut));
  const enter = pr(t, S.start, 0.8);

  const th = gaze(t, S4_KEYS, DUR).x;
  const thPrev = gaze(t - 1 / 30, S4_KEYS, DUR).x;
  const thTail = gaze(t - 0.16, S4_KEYS, DUR).x;
  const vel = Math.abs(th - thPrev);

  const lens = {x: E.x + rot({x: -0.66 * R, y: 0}, th).x, y: E.y + rot({x: -0.66 * R, y: 0}, th).y};
  const hT = hit(TREE_TOP, lens);
  const hB = hit(TREE_BASE, lens);
  const mid = {x: (hT.x + hB.x) / 2, y: (hT.y + hB.y) / 2};
  const phiNow = (Math.atan2(mid.y - E.y, mid.x - E.x) * 180) / Math.PI - th;
  const phiTail = phiNow + (th - thTail);
  const sweepO = Math.min(1, Math.abs(th - thTail) / 6);

  const sim = t >= CUE.ifExperienced;
  const simK = pr(t, CUE.ifExperienced, 0.5);
  const blur = Math.min(34, vel * (sim ? 5 : 3.4));
  const shakeY = sim ? Math.sin(t * 41) * 7 * simK : 0;
  const dx = th * (panel.w / 70);
  const rays = pr(t, S.start + 0.4, 0.8);

  const toS = (p: Pt) => ({x: (D.x + p.x * D.s) * drift, y: (D.y + p.y * D.s) * drift});
  const retinaLabel = toS({x: E.x + R * 0.75, y: E.y - R * 0.95});

  return (
    <>
      <Stage>
        <Filters />
        <defs>
          <filter id="s4blur" x="-20%" y="-5%" width="140%" height="110%">
            <feGaussianBlur stdDeviation={`${blur} 0`} />
          </filter>
          <clipPath id="s4clip">
            <rect x={-panel.w / 2} y={-panel.h / 2} width={panel.w} height={panel.h} rx={24} />
          </clipPath>
        </defs>
        <Cam s={drift}>
          <g transform={`translate(${D.x} ${D.y}) scale(${D.s})`} opacity={enter}>
            {/* object in the world */}
            <g>
              <ellipse cx={-560} cy={115} rx={90} ry={14} fill="#000" opacity={0.25} />
              <rect x={-572} y={-40} width={24} height={152} rx={6} fill="#5A3E4E" />
              <circle cx={-560} cy={-70} r={62} fill="#1D6A73" />
              <circle cx={-592} cy={-50} r={40} fill="#22808A" />
              <circle cx={-536} cy={-96} r={38} fill="#2A97A0" />
              <circle cx={-560} cy={-125} r={8} fill={C.orange} />
            </g>
            {/* light rays */}
            <g opacity={rays} filter="url(#glow)">
              <polyline points={`${TREE_TOP.x},${TREE_TOP.y} ${lens.x},${lens.y} ${hT.x},${hT.y}`} fill="none" stroke={C.blue} strokeWidth={3.5} opacity={0.8} />
              <polyline points={`${TREE_BASE.x},${TREE_BASE.y} ${lens.x},${lens.y} ${hB.x},${hB.y}`} fill="none" stroke={C.blue} strokeWidth={3.5} opacity={0.8} />
            </g>
            <g transform={`translate(${E.x} ${E.y})`}>
              <EyeSection id="s4es" r={R} rot={th} sweep={[phiTail, phiNow]} sweepO={sweepO} />
            </g>
            {/* inverted image on the retina */}
            <g opacity={rays}>
              <line x1={hB.x} y1={hB.y} x2={hT.x} y2={hT.y} stroke={C.orangeSoft} strokeWidth={6} strokeLinecap="round" />
              <circle cx={lerp(hB.x, hT.x, 0.78)} cy={lerp(hB.y, hT.y, 0.78)} r={14} fill={C.orange} />
            </g>
          </g>
          {/* retinal image panel */}
          <g transform={`translate(${panel.x} ${panel.y})`} opacity={pr(t, S.start + 0.6, 0.7)}>
            <rect x={-panel.w / 2 - 12} y={-panel.h / 2 - 12} width={panel.w + 24} height={panel.h + 24} rx={32} fill="#050B1D" filter="url(#shadow)" />
            <g clipPath="url(#s4clip)">
              <g transform={`translate(${dx} ${shakeY})`} filter="url(#s4blur)">
                <ScenePicture id="s4pic" w={panel.w * 1.6} h={panel.h * 1.6} />
              </g>
              {sim &&
                [-1, 1].map((sgn) => (
                  <g key={sgn} transform={`translate(${dx + sgn * (14 + blur * 1.6)} ${-shakeY})`} opacity={0.28 * simK}>
                    <ScenePicture id={`s4g${sgn}`} w={panel.w * 1.6} h={panel.h * 1.6} />
                  </g>
                ))}
            </g>
            <rect x={-panel.w / 2} y={-panel.h / 2} width={panel.w} height={panel.h} rx={24} fill="none" stroke={sim ? C.orange : C.blue} strokeWidth={3} opacity={0.6} />
          </g>
        </Cam>
      </Stage>
      <Tag x={retinaLabel.x} y={retinaLabel.y} o={win(t, S.start + 0.8, S.end, 0.5, 0.3)} variant="label">
        Retina
      </Tag>
      <Tag x={panel.x * drift} y={(panel.y - panel.h / 2) * drift - 46} o={pr(t, S.start + 0.8, 0.6)} variant="label">
        {sim ? 'Simulation' : 'Image on the retina'}
      </Tag>
      <Tag x={panel.x * drift} y={(panel.y + panel.h / 2) * drift + pick(60, -60)} o={win(t, CUE.retinaSweep + 0.1, CUE.ifExperienced - 0.1, 0.3, 0.3)}>
        It <Hi>sweeps</Hi> at high speed
      </Tag>
      <Tag x={panel.x * drift} y={(panel.y + panel.h / 2) * drift + pick(60, -60)} o={win(t, CUE.ifExperienced + 0.1, S.end + 0.3, 0.35, 0.3)}>
        If you saw <Hi>every</Hi> sweep…
      </Tag>
    </>
  );
};
