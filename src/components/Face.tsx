import React from 'react';
import {C} from '../theme';

/** Eye centres in Face-local units (head centre = 0,0). */
export const EYE_DX = 72;
export const EYE_Y = -8;
/** Iris travel in Face-local units for gaze = ±1. */
export const IRIS_X = 24;
export const IRIS_Y = 9;

type Ghost = {x: number; y: number; o: number};

const EYE_SHAPE = 'M -50 0 C -30 -31 30 -31 50 0 C 30 25 -30 25 -50 0 Z';

const Eye: React.FC<{id: string; cx: number; side: -1 | 1; gx: number; gy: number; blink: number; ghosts: Ghost[]; iris: string}> = ({
  id,
  cx,
  side,
  gx,
  gy,
  blink,
  ghosts,
  iris,
}) => {
  const ix = gx * IRIS_X;
  const iy = gy * IRIS_Y + 2;
  return (
    <g transform={`translate(${cx} ${EYE_Y})`}>
      <g transform={`scale(1 ${1 - 0.92 * blink})`}>
        <path d={EYE_SHAPE} fill={`url(#${id}-ew)`} />
        <g clipPath={`url(#${id}-ec)`}>
          {ghosts.map((g, i) => (
            <circle key={i} cx={g.x * IRIS_X} cy={g.y * IRIS_Y + 2} r={21} fill={C.blue} opacity={g.o * 0.42} />
          ))}
          <circle cx={ix} cy={iy} r={21} fill={`url(#${id}-ir)`} />
          <circle cx={ix} cy={iy} r={21} fill="none" stroke="#0a1a36" strokeWidth={2.4} opacity={0.65} />
          <circle cx={ix} cy={iy} r={9.5} fill="#060a16" />
          <circle cx={ix + 6} cy={iy - 7} r={4.6} fill="#fff" opacity={0.95} />
          <circle cx={ix - 6.5} cy={iy + 6} r={2} fill="#fff" opacity={0.55} />
          <ellipse cx={0} cy={-24} rx={58} ry={13} fill="#6b3b33" opacity={0.28} />
        </g>
        <path d="M -52 1 C -31 -32 31 -32 52 1" fill="none" stroke={C.ink} strokeWidth={6.5} strokeLinecap="round" />
        <path d={`M ${46 * side} -9 Q ${58 * side} -13 ${64 * side} -22`} fill="none" stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
        <path d="M -42 9 C -24 21 24 21 42 9" fill="none" stroke="#9a5a48" strokeWidth={2.2} opacity={0.5} />
      </g>
      <path d="M -44 -36 C -20 -46 20 -46 44 -36" fill="none" stroke="#c98063" strokeWidth={3} opacity={0.35 * (1 - blink)} />
    </g>
  );
};

export type FaceProps = {
  id: string;
  gx: number;
  gy?: number;
  blink?: number;
  variant?: 'hero' | 'friend';
  ghosts?: Ghost[];
  body?: boolean;
};

/**
 * CurioVector character head (front view). Local units: head centre at (0,0),
 * head ≈ 350 × 450, shoulders reach y ≈ 420. Key light warm from left, cyan rim on right.
 */
export const Face: React.FC<FaceProps> = ({id, gx, gy = 0, blink = 0, variant = 'hero', ghosts = [], body = true}) => {
  const friend = variant === 'friend';
  const hairA = friend ? '#7A3A22' : '#1C2152';
  const hairB = friend ? '#B9603A' : '#33407F';
  const top = friend ? '#C9652E' : '#21477F';
  const topB = friend ? '#8E3E1C' : '#142C57';
  const iris = friend ? '#8a6a2e' : C.blueDeep;
  const head =
    'M -170 -40 C -172 -165 -100 -236 0 -236 C 100 -236 172 -165 170 -40 C 168 62 130 150 62 196 C 30 214 -30 214 -62 196 C -130 150 -168 62 -170 -40 Z';
  return (
    <g>
      <defs>
        <radialGradient id={`${id}-sk`} cx="35%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#FAD2B2" />
          <stop offset="55%" stopColor={C.skin} />
          <stop offset="100%" stopColor={C.skinShade} />
        </radialGradient>
        <linearGradient id={`${id}-rim`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0.55" stopColor={C.blue} stopOpacity="0" />
          <stop offset="1" stopColor={C.blue} stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={`${id}-hr`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={hairB} />
          <stop offset="1" stopColor={hairA} />
        </linearGradient>
        <linearGradient id={`${id}-tp`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={topB} />
        </linearGradient>
        <radialGradient id={`${id}-ew`} cx="50%" cy="45%" r="60%">
          <stop offset="0.6" stopColor="#FBFCFF" />
          <stop offset="1" stopColor="#C9D3E6" />
        </radialGradient>
        <radialGradient id={`${id}-ir`} cx="50%" cy="50%" r="50%">
          <stop offset="0.3" stopColor={friend ? '#d4a85c' : '#8FE0FF'} />
          <stop offset="0.75" stopColor={iris} />
          <stop offset="1" stopColor="#0d2547" />
        </radialGradient>
        <clipPath id={`${id}-ec`}>
          <path d={EYE_SHAPE} />
        </clipPath>
        <clipPath id={`${id}-hc`}>
          <path d={head} />
        </clipPath>
      </defs>
      {body && (
        <>
          <path d="M -290 430 C -280 300 -170 262 -64 252 L 64 252 C 170 262 280 300 290 430 Z" fill={`url(#${id}-tp)`} />
          <path d="M -64 252 C -40 300 40 300 64 252" fill="none" stroke={friend ? C.orangeSoft : C.orange} strokeWidth={9} strokeLinecap="round" />
          <path d="M 200 300 C 255 330 282 380 290 430" fill="none" stroke={C.blue} strokeWidth={4} opacity={0.5} />
          <path d="M -58 160 L -58 262 C -20 285 20 285 58 262 L 58 160 Z" fill={C.skinShade} />
          <path d="M -58 200 C -20 238 20 238 58 200 L 58 170 L -58 170 Z" fill="#b8704f" opacity={0.6} />
        </>
      )}
      {friend && <circle cx={10} cy={-268} r={72} fill={`url(#${id}-hr)`} />}
      <ellipse cx={0} cy={-62} rx={202} ry={226} fill={`url(#${id}-hr)`} />
      <ellipse cx={-168} cy={4} rx={27} ry={46} fill={C.skinShade} />
      <ellipse cx={168} cy={4} rx={27} ry={46} fill={C.skinShade} />
      <ellipse cx={168} cy={4} rx={13} ry={26} fill="#b8704f" opacity={0.6} />
      <path d={head} fill={`url(#${id}-sk)`} />
      <g clipPath={`url(#${id}-hc)`}>
        <path d="M 70 -250 C 205 -160 205 110 40 230 L 320 230 L 320 -250 Z" fill="#2a1d4d" opacity={0.17} />
        <ellipse cx={-98} cy={78} rx={46} ry={26} fill={C.orange} opacity={0.16} />
        <ellipse cx={98} cy={78} rx={46} ry={26} fill={C.orange} opacity={0.12} />
      </g>
      <path d={head} fill="none" stroke={`url(#${id}-rim)`} strokeWidth={7} />
      {/* brows */}
      <path d="M -122 -64 C -96 -82 -60 -84 -34 -72" fill="none" stroke={hairA} strokeWidth={13} strokeLinecap="round" />
      <path d="M 122 -64 C 96 -82 60 -84 34 -72" fill="none" stroke={hairA} strokeWidth={13} strokeLinecap="round" />
      {/* nose */}
      <path d="M 6 6 C 12 40 22 62 18 74 C 12 84 -4 86 -16 80" fill="none" stroke="#b8704f" strokeWidth={5} strokeLinecap="round" opacity={0.75} />
      <ellipse cx={-6} cy={58} rx={14} ry={22} fill="#fff" opacity={0.12} />
      {/* mouth */}
      <path d="M -40 124 C -16 140 16 140 40 124" fill="none" stroke="#9e4a4f" strokeWidth={7} strokeLinecap="round" />
      <path d="M -20 146 C -6 152 6 152 20 146" fill="none" stroke="#c46f60" strokeWidth={4} strokeLinecap="round" opacity={0.6} />
      <Eye id={id} cx={-EYE_DX} side={-1} gx={gx} gy={gy} blink={blink} ghosts={ghosts} iris={iris} />
      <Eye id={id} cx={EYE_DX} side={1} gx={gx} gy={gy} blink={blink} ghosts={ghosts} iris={iris} />
      {/* front hair */}
      {friend ? (
        <path
          d="M -182 -40 C -196 -190 -96 -262 6 -258 C 120 -254 196 -176 182 -40 C 170 -110 120 -160 40 -172 C 0 -150 -60 -140 -120 -150 C -150 -120 -170 -90 -182 -40 Z"
          fill={`url(#${id}-hr)`}
        />
      ) : (
        <path
          d="M -180 -50 C -190 -196 -92 -266 12 -260 C 122 -256 192 -182 180 -54 C 156 -118 98 -160 24 -150 C -36 -178 -118 -154 -180 -50 Z"
          fill={`url(#${id}-hr)`}
        />
      )}
      <path d="M -110 -200 C -60 -238 30 -246 96 -214" fill="none" stroke={friend ? '#E08A55' : '#5767B0'} strokeWidth={7} strokeLinecap="round" opacity={0.7} />
      <path d="M 120 -190 C 165 -150 182 -100 180 -54" fill="none" stroke={C.blue} strokeWidth={4} opacity={0.55} />
    </g>
  );
};
