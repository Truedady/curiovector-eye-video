import React from 'react';
import {Cam, Filters, Hi, Stage, Tag} from '../components/core';
import {Brain, EyeSection, ScenePicture} from '../components/Props';
import {CUE, SCENES} from '../timeline';
import {C, FONT} from '../theme';
import {bez, clamp, eInOut, gaze, Key, lerp, pr, Pt, useLayout, win} from '../lib';

const S = SCENES[4];
/** Saccade moments in the pipeline animation. */
const SACC = [CUE.fastMovements, 59.2, 61.9, 64.0, 67.6, 70.4, 73.3];
const KEYS: Key[] = [{t: S.start, x: 0}, ...SACC.map((s, i) => ({t: s, x: i % 2 ? -14 : 14}))];
/** Schematic visual sensitivity: dips (not to zero) around each saccade. */
const sens = (t: number) => {
  let d = 0;
  for (const s of SACC) d += Math.exp(-(((t - s - 0.03) / 0.13) ** 2));
  return clamp(1 - 0.68 * d, 0.3, 1);
};
// Graph (schematic, one saccade): τ ∈ [-0.3, 0.5] s
const Sg = (tau: number) => 1 - 0.66 * Math.exp(-(((tau - 0.03) / 0.075) ** 2));

export const S5Suppression: React.FC<{t: number}> = ({t}) => {
  const {pick} = useLayout();
  const eye = pick({x: -700, y: -210, r: 110}, {x: -320, y: -600, r: 92});
  const brain = pick({x: 470, y: -200, s: 0.9}, {x: 250, y: -610, s: 0.62});
  const p0 = {x: eye.x + eye.r * 1.55, y: eye.y};
  const p3 = {x: brain.x + 125 * brain.s, y: brain.y + 30 * brain.s};
  const p1 = pick({x: -250, y: -120}, {x: -90, y: -500});
  const p2 = pick({x: 150, y: -40}, {x: 120, y: -470});
  const G = pick({x: 0, y: 300, w: 1300, h: 300}, {x: 0, y: 180, w: 920, h: 520});
  const titleY = pick(55, -330);
  const tiles = pick(
    {a: {x: -560, y: 300}, b: {x: -180, y: 300}, tw: 340, th: 215, out: {x: 380, y: 300, w: 640, h: 320}},
    {a: {x: -235, y: -10}, b: {x: 235, y: -10}, tw: 420, th: 265, out: {x: 0, y: 330, w: 900, h: 330}},
  );
  const drift = lerp(1, 1.03, pr(t, S.start, S.end - S.start, eInOut));
  const enter = pr(t, S.start, 0.8);
  const rot = gaze(t, KEYS, 0.1).x;
  const sv = sens(t);

  // Graph
  const gO = win(t, CUE.fastMovements - 0.3, CUE.brainStitches + 0.3, 0.5, 0.5);
  const X = (tau: number) => -G.w / 2 + 70 + ((tau + 0.3) / 0.8) * (G.w - 120);
  const Y = (v: number) => G.h / 2 - 40 - v * (G.h - 110);
  let curve = '';
  for (let i = 0; i <= 80; i++) {
    const tau = -0.3 + (i / 80) * 0.8;
    curve += `${i ? 'L' : 'M'} ${X(tau).toFixed(1)} ${Y(Sg(tau)).toFixed(1)} `;
  }
  const curveK = pr(t, CUE.sensitivityDrops, 2.6, eInOut);
  const band = pr(t, CUE.fastMovements, 0.4);
  const dipO = pr(t, CUE.dropsSharply, 0.4);
  const notOff = pr(t, CUE.notBlind, 0.5);

  // Stitching before/after views
  const tA = pr(t, CUE.before - 0.1, 0.5);
  const tB = pr(t, CUE.after - 0.1, 0.5);
  const merge = pr(t, 72.3, 1.2, eInOut);
  const outO = pr(t, 72.9, 0.8);
  const brainGlow = Math.max(pr(t, CUE.brainStitches, 0.6) * 0.6, outO) * (0.8 + 0.2 * Math.sin(t * 6));

  const pulses = Array.from({length: 9}).map((_, i) => {
    const u = (t * 0.42 + i / 9) % 1;
    return bez(p0, p1, p2, p3, u);
  });
  const tileOf = (from: Pt, side: -1 | 1, k: number) => {
    const to = {x: tiles.out.x + side * tiles.out.w * 0.22, y: tiles.out.y};
    return {x: lerp(from.x, to.x, merge), y: lerp(from.y, to.y, merge), o: k * (1 - outO)};
  };
  const A = tileOf(tiles.a, -1, tA);
  const B = tileOf(tiles.b, 1, tB);

  return (
    <>
      <Stage>
        <Filters />
        <Cam s={drift}>
          <g opacity={enter}>
            <path d={`M ${p0.x} ${p0.y} C ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`} fill="none" stroke="#C9907A" strokeWidth={16} strokeLinecap="round" opacity={0.85} />
            <path d={`M ${p0.x} ${p0.y} C ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`} fill="none" stroke={C.blue} strokeWidth={3} opacity={0.35} />
            <g transform={`translate(${brain.x} ${brain.y}) scale(${brain.s})`}>
              <Brain id="s5b" glow={brainGlow} activity={sv * 0.6} />
            </g>
            {pulses.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={10 * (0.6 + 0.4 * sv)} fill={C.blue} opacity={0.25 + 0.75 * sv * sv} filter="url(#glow)" />
            ))}
            <g transform={`translate(${eye.x} ${eye.y})`}>
              <EyeSection id="s5es" r={eye.r} rot={rot} />
            </g>
          </g>
          {/* sensitivity graph */}
          {gO > 0 && (
            <g transform={`translate(${G.x} ${G.y})`} opacity={gO} fontFamily={FONT}>
              <rect x={-G.w / 2} y={-G.h / 2} width={G.w} height={G.h} rx={28} fill="#0A1838" opacity={0.85} stroke={C.blue} strokeOpacity={0.2} strokeWidth={2} />
              <rect x={X(0)} y={-G.h / 2 + 18} width={X(0.05) - X(0)} height={G.h - 58} fill={C.orange} opacity={0.25 * band} />
              <text x={X(0.025)} y={-G.h / 2 + 48} fill={C.orange} fontSize={pick(22, 26)} fontWeight={700} textAnchor="middle" opacity={band}>
                EYE JUMP
              </text>
              <line x1={X(-0.3)} y1={Y(0)} x2={X(0.5)} y2={Y(0)} stroke={C.muted} strokeWidth={2} strokeDasharray="8 8" opacity={0.6} />
              <line x1={X(-0.3)} y1={Y(0) + 0} x2={X(-0.3)} y2={Y(1.12)} stroke={C.muted} strokeWidth={3} />
              <text x={X(-0.3) + 16} y={Y(1.12) + 6} fill={C.blue} fontSize={pick(24, 28)} fontWeight={700} letterSpacing="0.12em">
                SENSITIVITY
              </text>
              <text x={X(0.5)} y={Y(0) + 32} fill={C.muted} fontSize={pick(22, 26)} fontWeight={700} textAnchor="end" letterSpacing="0.12em">
                TIME →
              </text>
              <path d={curve} fill="none" stroke={C.blue} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - curveK} filter="url(#glow)" />
              {dipO > 0 && (
                <g opacity={dipO}>
                  <circle cx={X(0.03)} cy={Y(Sg(0.03))} r={12} fill={C.orange} />
                  <path d={`M ${X(0.03) + 70} ${Y(0.95)} Q ${X(0.03) + 60} ${Y(0.55)} ${X(0.03) + 18} ${Y(Sg(0.03)) - 10}`} fill="none" stroke={C.orange} strokeWidth={4} strokeLinecap="round" />
                </g>
              )}
              {notOff > 0 && (
                <g opacity={notOff}>
                  <line x1={X(0.03) - 40} y1={Y(0)} x2={X(0.03) - 40} y2={Y(Sg(0.03))} stroke={C.white} strokeWidth={4} />
                  <line x1={X(0.03) - 52} y1={Y(0)} x2={X(0.03) - 28} y2={Y(0)} stroke={C.white} strokeWidth={4} />
                  <line x1={X(0.03) - 52} y1={Y(Sg(0.03))} x2={X(0.03) - 28} y2={Y(Sg(0.03))} stroke={C.white} strokeWidth={4} />
                </g>
              )}
            </g>
          )}
          {/* before / after views stitched into one stable view */}
          {[
            {p: A, vb: '0 120 560 354', label: 'BEFORE'},
            {p: B, vb: '440 120 560 354', label: 'AFTER'},
          ].map(({p, vb, label}) =>
            p.o > 0 ? (
              <g key={label} transform={`translate(${p.x} ${p.y})`} opacity={p.o}>
                <rect x={-tiles.tw / 2 - 8} y={-tiles.th / 2 - 8} width={tiles.tw + 16} height={tiles.th + 16} rx={20} fill="#050B1D" filter="url(#shadow)" />
                <ScenePicture id={`s5${label}`} w={tiles.tw} h={tiles.th} vb={vb} />
                <rect x={-tiles.tw / 2} y={-tiles.th / 2} width={tiles.tw} height={tiles.th} rx={14} fill="none" stroke={C.blue} strokeWidth={3} opacity={0.7} />
                <text x={0} y={-tiles.th / 2 - 22} fill={C.muted} fontFamily={FONT} fontSize={pick(24, 28)} fontWeight={700} textAnchor="middle" letterSpacing="0.2em">
                  {label}
                </text>
              </g>
            ) : null,
          )}
          {outO > 0 && (
            <g transform={`translate(${tiles.out.x} ${tiles.out.y}) scale(${lerp(0.94, 1, outO)})`} opacity={outO}>
              <rect x={-tiles.out.w / 2 - 10} y={-tiles.out.h / 2 - 10} width={tiles.out.w + 20} height={tiles.out.h + 20} rx={26} fill={C.orange} opacity={0.35} filter="url(#softglow)" />
              <ScenePicture id="s5out" w={tiles.out.w} h={tiles.out.h} vb="0 110 1000 500" />
              <rect x={-tiles.out.w / 2} y={-tiles.out.h / 2} width={tiles.out.w} height={tiles.out.h} rx={18} fill="none" stroke={C.orange} strokeWidth={4} />
            </g>
          )}
        </Cam>
      </Stage>
      <Tag x={0} y={titleY * drift} o={win(t, CUE.saccadicSuppression, CUE.brainStitches + 0.2, 0.35, 0.4)} variant="title" size={pick(84, 62)}>
        SACCADIC SUPPRESSION
      </Tag>
      <Tag
        x={(G.x + X(0.03) + pick(330, 0)) * drift}
        y={(G.y + pick(-10, -G.h / 2 - 50)) * drift}
        o={win(t, CUE.notBlind + 0.1, CUE.brainStitches + 0.2, 0.35, 0.4)}
      >
        Reduced — <Hi>not</Hi> switched off
      </Tag>
      <Tag x={tiles.out.x * drift} y={(tiles.out.y + pick(-tiles.out.h / 2 - 60, tiles.out.h / 2 + 60)) * drift} o={win(t, 74.3, S.end + 0.3, 0.4, 0.3)}>
        A <Hi>stable</Hi> view
      </Tag>
    </>
  );
};
