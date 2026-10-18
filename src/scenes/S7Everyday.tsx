import React from 'react';
import {random} from 'remotion';
import {Cam, Filters, Hi, Stage, Tag} from '../components/core';
import {Face} from '../components/Face';
import {Card, Mirror, MirrorRoom, PIC_POI, ScanPath, ScenePicture} from '../components/Props';
import {CUE, SCENES} from '../timeline';
import {C, FONT} from '../theme';
import {eBack, eInOut, Fix, fixations, fixIndex, gaze, Key, lerp, pr, useLayout} from '../lib';

const S = SCENES[6];

// Illustrations are drawn in a 600 × 400 box (origin top-left).
const BOOK_LINES = Array.from({length: 7}).map((_, j) => 110 + j * 32);
const readingFix = (start: number): Fix[] => {
  const out: Fix[] = [];
  let tt = start;
  for (const page of [0, 1]) {
    for (const y of BOOK_LINES) {
      for (let k = 0; k < 4; k++) {
        out.push({t: tt, x: (page ? 330 : 70) + k * 58 + (random(`rd${tt}`) - 0.5) * 16, y: y + (page ? 4 : 0)});
        tt += 0.22;
      }
    }
  }
  return out;
};
const SCREEN_POI = PIC_POI.map((p) => ({x: 70 + (p.x / 1000) * 460, y: 50 + (p.y / 640) * 280}));
const ROOM_POI = [
  {x: 135, y: 130},
  {x: 300, y: 115},
  {x: 490, y: 150},
  {x: 440, y: 300},
  {x: 250, y: 290},
  {x: 90, y: 330},
];

const PANELS = [
  {id: 'read', label: 'Reading', start: CUE.read - 0.6, fx: readingFix(CUE.read)},
  {id: 'watch', label: 'Watching', start: CUE.watchVideos - 0.35, fx: fixations('s7w', CUE.watchVideos, S.end + 0.5, SCREEN_POI, 0.3, 14)},
  {id: 'room', label: 'Looking around', start: CUE.lookAround - 0.35, fx: fixations('s7r', CUE.lookAround, S.end + 0.5, ROOM_POI, 0.34, 14)},
];

const Book: React.FC = () => (
  <g>
    <path d="M 30 70 L 300 92 L 570 70 L 570 352 L 300 374 L 30 352 Z" fill="#0A1430" opacity={0.6} transform="translate(0 12)" />
    <path d="M 40 60 L 296 80 L 296 362 L 40 342 Z" fill="#EEF2FA" />
    <path d="M 304 80 L 560 60 L 560 342 L 304 362 Z" fill="#F8FAFF" />
    <path d="M 270 78 L 296 80 L 296 362 L 270 360 Z" fill="#C9D3E6" />
    <path d="M 304 80 L 330 78 L 330 360 L 304 362 Z" fill="#DCE3F0" />
    {BOOK_LINES.map((y, j) => (
      <g key={j}>
        <rect x={62} y={y - 6} width={200 - (j % 3) * 14} height={10} rx={5} fill="#5B6E96" opacity={0.6} />
        <rect x={322} y={y - 2} width={206 - ((j + 1) % 3) * 16} height={10} rx={5} fill="#5B6E96" opacity={0.6} />
      </g>
    ))}
  </g>
);
const Screen: React.FC = () => (
  <g>
    <rect x={250} y={330} width={100} height={40} fill="#22325C" />
    <rect x={190} y={366} width={220} height={14} rx={7} fill="#2B3B66" />
    <rect x={56} y={36} width={488} height={308} rx={18} fill="#050B1D" stroke="#3A4F80" strokeWidth={4} />
    <ScenePicture id="s7pic" w={460} h={280} x={70} y={50} />
  </g>
);
const Room: React.FC = () => (
  <g>
    <rect x={0} y={0} width={600} height={400} fill="#1A3466" />
    <path d="M 0 300 L 600 280 L 600 400 L 0 400 Z" fill="#132850" />
    <rect x={70} y={60} width={130} height={150} rx={8} fill="#2C66A6" stroke="#E8D7C4" strokeWidth={8} />
    <line x1={135} y1={60} x2={135} y2={210} stroke="#E8D7C4" strokeWidth={6} />
    <line x1={70} y1={135} x2={200} y2={135} stroke="#E8D7C4" strokeWidth={6} />
    <rect x={250} y={80} width={100} height={72} rx={6} fill={C.orangeDeep} stroke="#E8D7C4" strokeWidth={6} />
    <circle cx={300} cy={116} r={18} fill={C.orangeSoft} />
    <path d="M 160 250 h 180 a 20 20 0 0 1 20 20 v 50 h -220 v -50 a 20 20 0 0 1 20 -20 Z" fill="#2B4E8E" />
    <rect x={150} y={290} width={220} height={36} rx={12} fill="#3A62A8" />
    <line x1={490} y1={160} x2={490} y2={310} stroke="#8EA6CF" strokeWidth={6} />
    <path d="M 450 160 L 530 160 L 510 115 L 470 115 Z" fill={C.orangeSoft} />
    <circle cx={490} cy={170} r={70} fill={C.orange} opacity={0.15} />
    <rect x={420} y={300} width={40} height={40} rx={6} fill={C.orangeDeep} />
    <circle cx={440} cy={285} r={26} fill="#1D6A73" />
    <circle cx={425} cy={268} r={18} fill="#2A97A0" />
  </g>
);
const ILLUS: Record<string, React.FC> = {read: Book, watch: Screen, room: Room};

export const S7Everyday: React.FC<{t: number}> = ({t}) => {
  const {pick} = useLayout();
  const card = pick({w: 560, h: 760}, {w: 940, h: 480});
  const pos = pick(
    [
      {x: -610, y: 10},
      {x: 0, y: 10},
      {x: 610, y: 10},
    ],
    [
      {x: 0, y: -600},
      {x: 0, y: -80},
      {x: 0, y: 440},
    ],
  );
  const ill = pick({x: 0, y: -110, s: 520 / 600}, {x: 150, y: 0, s: 1});
  const badge = pick({x: 0, y: 200, r: 100}, {x: -320, y: -30, r: 110});
  const labelOff = pick({x: 0, y: 330}, {x: -320, y: 140});
  const counter = pick({x: card.w / 2 - 30, y: -card.h / 2 + 50}, {x: -320, y: 185});
  const drift = lerp(1, 1.03, pr(t, S.start, S.end - S.start, eInOut));

  const intro = pr(t, S.start, 0.6) * (1 - pr(t, 94.1, 0.6, eInOut));

  return (
    <>
      <Stage>
        <Filters />
        <Cam s={drift}>
          {intro > 0 && (
            <g opacity={intro} transform={`translate(0 ${pick(-40, -80)}) scale(${lerp(0.7, 1, intro)})`}>
              <Mirror id="s7m" w={pick(340, 460)} h={pick(460, 620)}>
                <MirrorRoom w={pick(340, 460)} h={pick(460, 620)} />
                <g transform={`translate(0 ${pick(10, 20)}) scale(${pick(0.5, 0.66)})`}>
                  <Face id="s7mf" gx={gaze(t, [{t: 0, x: 0.6}, {t: 90.6, x: -0.6}, {t: 91.6, x: 0.6}, {t: 92.6, x: -0.6}, {t: 93.4, x: 0.6}], 1 / 30).x} />
                </g>
              </Mirror>
            </g>
          )}
          {PANELS.map((pn, i) => {
            const k = pr(t, pn.start, 0.7, eBack);
            if (k <= 0) return null;
            const p = pos[i];
            const idx = fixIndex(pn.fx, t);
            const keys: Key[] = pn.fx.map((q) => ({t: q.t, x: ((q.x - 300) / 300) * 0.8, y: ((q.y - 200) / 200) * 0.7 + (pn.id === 'read' ? 0.35 : 0)}));
            const g = idx >= 0 ? gaze(t, keys, 0.05) : {x: 0, y: 0.3};
            const glow = idx >= 0 ? 1 - pr(t, pn.fx[idx].t, 0.25) : 0;
            const Ill = ILLUS[pn.id];
            return (
              <g key={pn.id} transform={`translate(${p.x} ${p.y + (1 - k) * 80}) scale(${lerp(0.9, 1, Math.min(1, k))})`} opacity={Math.min(1, k)}>
                <Card id={`s7c${i}`} w={card.w} h={card.h} glow={glow * 0.5}>
                  <circle cx={ill.x} cy={ill.y} r={300} fill={C.blue} opacity={0.06} />
                  <g transform={`translate(${ill.x} ${ill.y}) scale(${ill.s}) translate(-300 -200)`}>
                    <Ill />
                    <ScanPath fx={pn.fx} t={t} keep={5} scale={1} />
                  </g>
                  <g transform={`translate(${badge.x} ${badge.y})`}>
                    <clipPath id={`s7bc${i}`}>
                      <circle r={badge.r} />
                    </clipPath>
                    <circle r={badge.r} fill="#10254D" />
                    <g clipPath={`url(#s7bc${i})`}>
                      <g transform={`translate(0 ${badge.r * 0.22}) scale(${badge.r / 230})`}>
                        <Face id={`s7f${i}`} gx={g.x} gy={g.y} />
                      </g>
                    </g>
                    <circle r={badge.r} fill="none" stroke={C.blue} strokeWidth={3} opacity={0.6} />
                  </g>
                  <text x={labelOff.x} y={labelOff.y} fill={C.muted} fontFamily={FONT} fontSize={pick(28, 24)} fontWeight={700} letterSpacing={pick('0.2em', '0.1em')} textAnchor="middle">
                    {pn.label.toUpperCase()}
                  </text>
                  <text x={counter.x} y={counter.y} fill={C.blue} fontFamily={FONT} fontSize={22} fontWeight={700} letterSpacing="0.12em" textAnchor={pick('end', 'middle')} opacity={0.85}>
                    SACCADES {String(Math.max(0, idx + 1)).padStart(3, '0')}
                  </text>
                </Card>
              </g>
            );
          })}
        </Cam>
      </Stage>
      <Tag x={0} y={pick(330, 340)} o={pr(t, CUE.notOnlyMirrors, 0.4) * (1 - pr(t, 94.0, 0.5))}>
        Not just <Hi>mirrors</Hi>
      </Tag>
    </>
  );
};
