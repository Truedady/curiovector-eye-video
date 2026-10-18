import React from 'react';
import {C, FONT} from '../theme';
import {Fix, fixIndex, pr} from '../lib';

/** Arched mirror. Centered at origin; children are clipped to the glass. */
export const Mirror: React.FC<{id: string; w: number; h: number; glow?: number; shimmer?: number; children?: React.ReactNode}> = ({
  id,
  w,
  h,
  glow = 0,
  shimmer = -1,
  children,
}) => {
  const r = Math.min(w / 2, h * 0.45);
  const glass = `M ${-w / 2} ${h / 2} L ${-w / 2} ${-h / 2 + r} A ${w / 2} ${r} 0 0 1 ${w / 2} ${-h / 2 + r} L ${w / 2} ${h / 2} Z`;
  const sx = shimmer * (w + h) - (w + h) / 2;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-fr`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFD3A0" />
          <stop offset="0.35" stopColor={C.orange} />
          <stop offset="0.7" stopColor="#A9531F" />
          <stop offset="1" stopColor="#FFB878" />
        </linearGradient>
        <linearGradient id={`${id}-gl`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#1C3F72" />
          <stop offset="1" stopColor="#0B1A3C" />
        </linearGradient>
        <clipPath id={`${id}-cl`}>
          <path d={glass} />
        </clipPath>
      </defs>
      {glow > 0 && <path d={glass} fill="none" stroke={C.orange} strokeWidth={46} opacity={glow * 0.55} filter="url(#softglow)" />}
      <path d={glass} fill={`url(#${id}-gl)`} filter="url(#shadow)" />
      <g clipPath={`url(#${id}-cl)`}>
        {children}
        <polygon points={`${-w * 0.5},${-h * 0.1} ${-w * 0.1},${-h * 0.5} ${w * 0.02},${-h * 0.5} ${-w * 0.5},${h * 0.04}`} fill="#fff" opacity={0.07} />
        <polygon points={`${-w * 0.5},${h * 0.12} ${w * 0.15},${-h * 0.5} ${w * 0.2},${-h * 0.5} ${-w * 0.5},${h * 0.18}`} fill="#fff" opacity={0.05} />
        {shimmer >= 0 && shimmer <= 1 && (
          <rect x={sx - 60} y={-h} width={120} height={h * 2} fill="#fff" opacity={0.18} transform={`rotate(25 ${sx} 0)`} filter="url(#softglow)" />
        )}
      </g>
      <path d={glass} fill="none" stroke={`url(#${id}-fr)`} strokeWidth={24} />
      <path d={glass} fill="none" stroke="#FFE2C2" strokeWidth={2.5} opacity={0.6} transform={`scale(${1 - 24 / w} ${1 - 24 / h})`} />
      <rect x={-w / 2 - 34} y={h / 2 - 6} width={w + 68} height={22} rx={11} fill="#A9531F" />
      <rect x={-w / 2 - 34} y={h / 2 - 6} width={w + 68} height={7} rx={3.5} fill="#FFC08A" opacity={0.8} />
    </g>
  );
};

/** Reflected room behind the character inside a mirror. */
export const MirrorRoom: React.FC<{w: number; h: number}> = ({w, h}) => (
  <g>
    <rect x={-w} y={-h} width={w * 2} height={h * 2} fill="#10254D" />
    <rect x={-w * 0.42} y={-h * 0.4} width={w * 0.28} height={h * 0.38} rx={10} fill="#183563" />
    <rect x={-w * 0.4} y={-h * 0.38} width={w * 0.24} height={h * 0.34} rx={6} fill="#24497F" opacity={0.7} />
    <circle cx={w * 0.33} cy={-h * 0.3} r={w * 0.22} fill={C.orange} opacity={0.12} filter="url(#softglow)" />
  </g>
);

/** Horizontal smartphone. Centered at origin; children are drawn in screen space (centre = 0,0). */
export const Phone: React.FC<{
  id: string;
  w: number;
  h: number;
  mode: 'rec' | 'play' | 'off';
  t: number;
  recStart?: number;
  progress?: number;
  children?: React.ReactNode;
}> = ({id, w, h, mode, t, recStart = 0, progress = 0, children}) => {
  const bz = Math.max(16, h * 0.045);
  const sw = w - bz * 2;
  const sh = h - bz * 2;
  const secs = Math.max(0, t - recStart);
  const timer = `00:${String(Math.floor(secs)).padStart(2, '0')}`;
  const blinkOn = Math.floor(t * 2) % 2 === 0;
  const ui = Math.max(22, h * 0.06);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-bd`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3A4F80" />
          <stop offset="0.5" stopColor="#0B1229" />
          <stop offset="1" stopColor="#43C5F5" stopOpacity="0.6" />
        </linearGradient>
        <clipPath id={`${id}-sc`}>
          <rect x={-sw / 2} y={-sh / 2} width={sw} height={sh} rx={h * 0.08} />
        </clipPath>
      </defs>
      <rect x={-w * 0.18} y={-h / 2 - 7} width={w * 0.1} height={10} rx={5} fill="#2B3B66" />
      <rect x={w * 0.05} y={-h / 2 - 7} width={w * 0.06} height={10} rx={5} fill="#2B3B66" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h * 0.12} fill="#070C1E" stroke={`url(#${id}-bd)`} strokeWidth={5} filter="url(#shadow)" />
      <g clipPath={`url(#${id}-sc)`}>
        <rect x={-sw / 2} y={-sh / 2} width={sw} height={sh} fill="#0B1733" />
        {children}
        <rect x={-sw / 2} y={-sh / 2} width={sw} height={sh * 0.5} fill="#fff" opacity={0.04} />
      </g>
      <circle cx={-w / 2 + bz * 0.55} cy={0} r={bz * 0.22} fill="#1d2848" />
      {mode === 'rec' && (
        <g fontFamily={FONT} fontWeight={700}>
          <circle cx={-sw / 2 + ui * 1.4} cy={-sh / 2 + ui * 1.3} r={ui * 0.36} fill={C.orange} opacity={blinkOn ? 1 : 0.35} />
          <text x={-sw / 2 + ui * 2.1} y={-sh / 2 + ui * 1.62} fontSize={ui} fill={C.white}>
            REC {timer}
          </text>
          {[
            [-1, -1],
            [1, -1],
            [-1, 1],
            [1, 1],
          ].map(([sx, sy], i) => (
            <path
              key={i}
              d={`M ${sx * (sw / 2 - ui * 0.8)} ${sy * (sh / 2 - ui * 2.2)} L ${sx * (sw / 2 - ui * 0.8)} ${sy * (sh / 2 - ui * 0.8)} L ${sx * (sw / 2 - ui * 2.2)} ${sy * (sh / 2 - ui * 0.8)}`}
              fill="none"
              stroke={C.white}
              strokeWidth={3}
              opacity={0.7}
            />
          ))}
        </g>
      )}
      {mode === 'play' && (
        <g fontFamily={FONT} fontWeight={700}>
          <rect x={-sw / 2} y={sh / 2 - ui * 2.3} width={sw} height={ui * 2.3} fill="#000" opacity={0.35} clipPath={`url(#${id}-sc)`} />
          <path d={`M ${-sw / 2 + ui} ${sh / 2 - ui * 1.6} l ${ui * 0.8} ${ui * 0.45} l ${-ui * 0.8} ${ui * 0.45} Z`} fill={C.white} />
          <rect x={-sw / 2 + ui * 2.4} y={sh / 2 - ui * 1.22} width={sw - ui * 3.6} height={ui * 0.22} rx={ui * 0.11} fill="#fff" opacity={0.3} />
          <rect x={-sw / 2 + ui * 2.4} y={sh / 2 - ui * 1.22} width={(sw - ui * 3.6) * progress} height={ui * 0.22} rx={ui * 0.11} fill={C.orange} />
          <circle cx={-sw / 2 + ui * 2.4 + (sw - ui * 3.6) * progress} cy={sh / 2 - ui * 1.11} r={ui * 0.32} fill={C.white} />
          <text x={-sw / 2 + ui} y={-sh / 2 + ui * 1.6} fontSize={ui * 0.85} fill={C.blue} letterSpacing="0.15em">
            PLAYBACK
          </text>
        </g>
      )}
    </g>
  );
};

/** Hand gripping the right end of a horizontal phone (fingers behind = first, thumb in front = second). */
export const HandBack: React.FC<{w: number; h: number}> = ({w, h}) => (
  <g transform={`translate(${w / 2 - 30} ${h * 0.05})`}>
    <path d={`M 0 ${-h * 0.42} C 70 ${-h * 0.46} 130 ${-h * 0.3} 150 ${-h * 0.05} L 260 ${h * 0.25} L 260 ${h * 0.9} L 40 ${h * 0.9} C 20 ${h * 0.6} 10 ${h * 0.4} 0 ${h * 0.3} Z`} fill={C.skinShade} />
    <path d={`M 150 ${-h * 0.05} L 260 ${h * 0.25}`} stroke={C.blue} strokeWidth={4} opacity={0.4} />
  </g>
);
export const HandThumb: React.FC<{w: number; h: number}> = ({w, h}) => (
  <g transform={`translate(${w / 2} ${h * 0.5})`}>
    <path d={`M -70 ${h * 0.02} C -60 ${-h * 0.16} -10 ${-h * 0.2} 30 ${-h * 0.1} L 90 ${h * 0.1} L 40 ${h * 0.45} Z`} fill={C.skin} />
    <path d={`M -62 ${-h * 0.02} C -50 ${-h * 0.13} -20 ${-h * 0.14} 0 ${-h * 0.1}`} fill="none" stroke="#fff" strokeWidth={4} opacity={0.3} strokeLinecap="round" />
  </g>
);

/** Points of interest in ScenePicture native coords (1000 × 640). */
export const PIC_POI = [
  {x: 255, y: 385},
  {x: 430, y: 150},
  {x: 800, y: 140},
  {x: 690, y: 290},
  {x: 885, y: 470},
  {x: 520, y: 555},
  {x: 205, y: 470},
];

/** Illustrated landscape (house, tree, sun, bird) used as "the world" across scenes. Native 1000×640. */
export const ScenePicture: React.FC<{id: string; w: number; h: number; vb?: string; x?: number; y?: number}> = ({id, w, h, vb = '0 0 1000 640', x, y}) => (
  <svg x={x ?? -w / 2} y={y ?? -h / 2} width={w} height={h} viewBox={vb} preserveAspectRatio="xMidYMid slice" overflow="hidden">
    <defs>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#123068" />
        <stop offset="0.6" stopColor="#2C66A6" />
        <stop offset="1" stopColor="#F2A266" />
      </linearGradient>
      <radialGradient id={`${id}-sun`}>
        <stop offset="0" stopColor="#FFE6C4" />
        <stop offset="0.45" stopColor={C.orange} />
        <stop offset="1" stopColor={C.orange} stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect x={-200} y={-200} width={1400} height={1040} fill={`url(#${id}-sky)`} />
    <circle cx={800} cy={140} r={150} fill={`url(#${id}-sun)`} opacity={0.75} />
    <circle cx={800} cy={140} r={46} fill="#FFD7A8" />
    <path d="M 120 120 q 40 -40 90 -10 q 40 -30 80 10 q 30 0 30 22 h -220 q -10 -22 20 -22 Z" fill="#fff" opacity={0.18} />
    <path d="M 560 90 q 30 -28 70 -6 q 30 -18 56 8 h -140 Z" fill="#fff" opacity={0.14} />
    <path d="M -200 420 C 100 300 300 360 500 330 C 700 300 850 340 1200 300 L 1200 840 L -200 840 Z" fill="#1F4A86" />
    <path d="M -200 480 C 150 420 420 470 640 430 C 820 400 980 440 1200 420 L 1200 840 L -200 840 Z" fill="#1A5F78" />
    <path d="M -200 560 C 250 510 600 560 1200 520 L 1200 840 L -200 840 Z" fill="#134A62" />
    {/* house */}
    <g>
      <rect x={160} y={330} width={190} height={170} fill="#E8D7C4" />
      <rect x={250} y={330} width={100} height={170} fill="#C9B3A0" />
      <path d="M 140 340 L 255 240 L 370 340 Z" fill={C.orangeDeep} />
      <path d="M 255 240 L 370 340 L 330 340 Z" fill="#A9461C" />
      <rect x={225} y={355} width={60} height={56} rx={6} fill="#FFD59A" />
      <rect x={225} y={355} width={60} height={56} rx={6} fill="none" stroke="#7a4a2a" strokeWidth={5} />
      <rect x={185} y={430} width={40} height={70} rx={4} fill="#5C3A2A" />
    </g>
    {/* tree */}
    <g>
      <rect x={678} y={300} width={24} height={200} fill="#3A2A3A" />
      <circle cx={690} cy={280} r={90} fill="#1D6A73" />
      <circle cx={640} cy={310} r={60} fill="#1A5C66" />
      <circle cx={740} cy={300} r={64} fill="#22808A" />
      <circle cx={700} cy={240} r={52} fill="#2A97A0" />
    </g>
    {/* bird */}
    <path d="M 405 150 q 14 -16 26 0 q 12 -16 26 0" fill="none" stroke="#0B1733" strokeWidth={6} strokeLinecap="round" />
    {/* sign */}
    <rect x={880} y={440} width={10} height={90} fill="#3A2A3A" />
    <rect x={845} y={430} width={86} height={42} rx={6} fill={C.blue} />
    {/* flowers */}
    {[480, 510, 545, 575].map((fx, i) => (
      <circle key={i} cx={fx} cy={555 + (i % 2) * 14} r={11} fill={i % 2 ? C.orange : C.orangeSoft} />
    ))}
  </svg>
);

/** Large illustrated eye (front close-up) for scientific scenes. ~560 × 300 units. */
export const BigEye: React.FC<{id: string; gx: number; gy: number; glow?: number}> = ({id, gx, gy, glow = 1}) => {
  const shape = 'M -280 0 C -170 -175 170 -175 280 0 C 170 140 -170 140 -280 0 Z';
  const ix = gx * 120;
  const iy = gy * 42;
  return (
    <g>
      <defs>
        <clipPath id={`${id}-c`}>
          <path d={shape} />
        </clipPath>
        <radialGradient id={`${id}-w`} cx="50%" cy="45%" r="60%">
          <stop offset="0.55" stopColor="#F4F7FF" />
          <stop offset="1" stopColor="#9FB0D3" />
        </radialGradient>
        <radialGradient id={`${id}-i`}>
          <stop offset="0.25" stopColor="#B5ECFF" />
          <stop offset="0.7" stopColor={C.blueDeep} />
          <stop offset="1" stopColor="#0B2448" />
        </radialGradient>
      </defs>
      <path d="M -330 10 C -200 -250 200 -250 330 10 C 200 200 -200 200 -330 10 Z" fill={C.skinShade} opacity={0.9} />
      <path d="M -300 -40 C -170 -230 170 -230 300 -40" fill="none" stroke="#b8704f" strokeWidth={10} opacity={0.6} />
      <path d={shape} fill={`url(#${id}-w)`} />
      <g clipPath={`url(#${id}-c)`}>
        <circle cx={ix} cy={iy} r={92} fill={`url(#${id}-i)`} />
        {Array.from({length: 28}).map((_, i) => {
          const a = (i / 28) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={ix + Math.cos(a) * 42}
              y1={iy + Math.sin(a) * 42}
              x2={ix + Math.cos(a) * 86}
              y2={iy + Math.sin(a) * 86}
              stroke="#E6F8FF"
              strokeWidth={2}
              opacity={0.28}
            />
          );
        })}
        <circle cx={ix} cy={iy} r={92} fill="none" stroke="#06152e" strokeWidth={6} opacity={0.7} />
        <circle cx={ix} cy={iy} r={38} fill="#050913" />
        <circle cx={ix + 30} cy={iy - 32} r={17} fill="#fff" opacity={0.95} />
        <circle cx={ix - 26} cy={iy + 26} r={7} fill="#fff" opacity={0.5} />
        <ellipse cx={0} cy={-120} rx={300} ry={60} fill="#5a3030" opacity={0.25} />
      </g>
      <path d="M -284 2 C -170 -178 170 -178 284 2" fill="none" stroke={C.ink} strokeWidth={14} strokeLinecap="round" />
      {Array.from({length: 9}).map((_, i) => {
        const u = 0.15 + (i / 8) * 0.7;
        const x = -280 + u * 560;
        const y = -Math.sin(u * Math.PI) * 132;
        return <path key={i} d={`M ${x} ${y} q ${(u - 0.5) * 30} -26 ${(u - 0.5) * 60} -34`} fill="none" stroke={C.ink} strokeWidth={6} strokeLinecap="round" />;
      })}
      <path d={shape} fill="none" stroke={C.blue} strokeWidth={4} opacity={0.55 * glow} filter="url(#glow)" />
    </g>
  );
};

/** Eye cross-section (light enters from −x). Rotates about centre by `rot` degrees. */
export const EyeSection: React.FC<{id: string; r: number; rot: number; sweep?: [number, number] | null; sweepO?: number}> = ({
  id,
  r,
  rot,
  sweep,
  sweepO = 0,
}) => {
  const rr = r * 0.9;
  const arc = (a0: number, a1: number, rad: number) => {
    const p0 = {x: Math.cos((a0 * Math.PI) / 180) * rad, y: Math.sin((a0 * Math.PI) / 180) * rad};
    const p1 = {x: Math.cos((a1 * Math.PI) / 180) * rad, y: Math.sin((a1 * Math.PI) / 180) * rad};
    return `M ${p0.x} ${p0.y} A ${rad} ${rad} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 1 : 0} ${p1.x} ${p1.y}`;
  };
  return (
    <g transform={`rotate(${rot})`}>
      <defs>
        <radialGradient id={`${id}-v`} cx="40%" cy="45%" r="65%">
          <stop offset="0" stopColor="#1B3B70" />
          <stop offset="1" stopColor="#0C1C40" />
        </radialGradient>
      </defs>
      <path d={`M ${r * 0.9} ${-r * 0.12} L ${r * 1.55} ${-r * 0.16} L ${r * 1.55} ${r * 0.16} L ${r * 0.9} ${r * 0.12} Z`} fill="#C9907A" />
      <path d={`M ${r * 0.9} 0 L ${r * 1.55} 0`} stroke={C.blue} strokeWidth={3} opacity={0.5} strokeDasharray="10 8" />
      <circle r={r} fill={`url(#${id}-v)`} stroke="#E9EEF8" strokeWidth={r * 0.035} />
      <path d={arc(-75, 75, rr)} fill="none" stroke={C.blue} strokeWidth={r * 0.045} filter="url(#glow)" />
      {Array.from({length: 23}).map((_, i) => {
        const a = ((-70 + (i * 140) / 22) * Math.PI) / 180;
        return (
          <line key={i} x1={Math.cos(a) * rr * 0.93} y1={Math.sin(a) * rr * 0.93} x2={Math.cos(a) * rr} y2={Math.sin(a) * rr} stroke="#BFEFFF" strokeWidth={r * 0.012} opacity={0.8} />
        );
      })}
      {sweep && sweepO > 0 && <path d={arc(sweep[0], sweep[1], rr * 0.965)} fill="none" stroke={C.orange} strokeWidth={r * 0.05} opacity={sweepO} strokeLinecap="round" filter="url(#glow)" />}
      <circle cx={rr} cy={0} r={r * 0.04} fill={C.orange} />
      <path d={`M ${-r * 0.82} ${-r * 0.56} A ${r * 0.62} ${r * 0.62} 0 0 0 ${-r * 0.82} ${r * 0.56}`} fill="#9FD9F5" fillOpacity={0.18} stroke="#E9EEF8" strokeWidth={r * 0.025} />
      <rect x={-r * 0.8} y={-r * 0.56} width={r * 0.05} height={r * 0.32} fill={C.blueDeep} />
      <rect x={-r * 0.8} y={r * 0.24} width={r * 0.05} height={r * 0.32} fill={C.blueDeep} />
      <ellipse cx={-r * 0.66} cy={0} rx={r * 0.11} ry={r * 0.27} fill="#E4F6FF" fillOpacity={0.35} stroke="#F8FAFF" strokeWidth={r * 0.015} />
    </g>
  );
};

/** Stylised brain, side view (front = −x, visual cortex = +x). ~420 × 320. */
export const Brain: React.FC<{id: string; glow?: number; activity?: number}> = ({id, glow = 0, activity = 0}) => (
  <g>
    <defs>
      <linearGradient id={`${id}-b`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#2A4A8E" />
        <stop offset="1" stopColor="#162C5E" />
      </linearGradient>
    </defs>
    <path d="M 120 110 C 130 160 110 200 90 230 L 60 230 C 70 190 70 150 60 120 Z" fill="#1A3266" stroke={C.blue} strokeWidth={2} strokeOpacity={0.4} />
    <ellipse cx={135} cy={118} rx={62} ry={36} fill="#1D3973" stroke={C.blue} strokeWidth={2.5} strokeOpacity={0.5} />
    <path
      d="M -200 30 C -215 -80 -130 -165 -20 -160 C 60 -190 170 -150 195 -60 C 225 -10 210 70 160 95 C 130 130 60 140 20 120 C -20 145 -100 140 -140 112 C -190 100 -205 70 -200 30 Z"
      fill={`url(#${id}-b)`}
      stroke={C.blue}
      strokeWidth={4}
      strokeOpacity={0.75}
    />
    {[
      'M -150 -60 C -110 -100 -60 -60 -30 -110',
      'M -170 20 C -120 -10 -80 40 -40 0 C -10 -30 30 -10 50 -60',
      'M -120 90 C -80 60 -40 100 0 70 C 40 40 80 80 120 40',
      'M 20 -150 C 30 -100 80 -110 100 -60 C 120 -20 160 -40 180 0',
      'M -60 -150 C -40 -120 -10 -130 0 -90',
    ].map((d, i) => (
      <path key={i} d={d} fill="none" stroke={C.blue} strokeWidth={3} strokeOpacity={0.35 + activity * 0.4} strokeLinecap="round" />
    ))}
    <circle cx={160} cy={20} r={62} fill={C.orange} opacity={glow * 0.55} filter="url(#softglow)" />
    <circle cx={160} cy={20} r={26} fill={C.orange} opacity={glow * 0.8} />
  </g>
);

/** Fixation scan path (cyan jumps, orange current fixation). Coordinates in caller space. */
export const ScanPath: React.FC<{fx: Fix[]; t: number; keep?: number; scale?: number; map?: (x: number, y: number) => {x: number; y: number}}> = ({
  fx,
  t,
  keep = 6,
  scale = 1,
  map = (x, y) => ({x, y}),
}) => {
  const idx = fixIndex(fx, t);
  if (idx < 0) return null;
  const items: React.ReactNode[] = [];
  for (let i = Math.max(0, idx - keep); i <= idx; i++) {
    const age = idx - i;
    const o = 1 - age / (keep + 1);
    const p = map(fx[i].x, fx[i].y);
    if (i > 0 && i > idx - keep) {
      const q = map(fx[i - 1].x, fx[i - 1].y);
      const k = pr(t, fx[i].t, 0.07);
      items.push(
        <line key={`l${i}`} x1={q.x} y1={q.y} x2={q.x + (p.x - q.x) * k} y2={q.y + (p.y - q.y) * k} stroke={C.blue} strokeWidth={4 * scale} strokeLinecap="round" opacity={o * 0.85} filter="url(#glow)" />,
      );
    }
    items.push(<circle key={`d${i}`} cx={p.x} cy={p.y} r={(age === 0 ? 11 : 7) * scale} fill={age === 0 ? C.orange : C.blue} opacity={age === 0 ? 1 : o} />);
  }
  const cur = map(fx[idx].x, fx[idx].y);
  const ph = pr(t, fx[idx].t, 0.35);
  items.push(<circle key="ring" cx={cur.x} cy={cur.y} r={(14 + ph * 26) * scale} fill="none" stroke={C.orange} strokeWidth={3 * scale} opacity={1 - ph} />);
  return <g>{items}</g>;
};

/** Rounded illustration card. Centered at origin. */
export const Card: React.FC<{id: string; w: number; h: number; glow?: number; children?: React.ReactNode}> = ({id, w, h, glow = 0, children}) => (
  <g>
    <defs>
      <linearGradient id={`${id}-cg`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#16305F" />
        <stop offset="1" stopColor="#0B1838" />
      </linearGradient>
      <clipPath id={`${id}-cc`}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={34} />
      </clipPath>
    </defs>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={34} fill={`url(#${id}-cg)`} filter="url(#shadow)" />
    <g clipPath={`url(#${id}-cc)`}>{children}</g>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={34} fill="none" stroke={C.blue} strokeWidth={3} opacity={0.3 + glow * 0.6} />
  </g>
);
