import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FONT} from '../theme';
import {useLayout} from '../lib';

/** World-space camera: (x, y) is the world point placed at frame centre, s = zoom. */
export const Cam: React.FC<{x?: number; y?: number; s?: number; children: React.ReactNode}> = ({x = 0, y = 0, s = 1, children}) => {
  const {W, H} = useLayout();
  return <g transform={`translate(${W / 2} ${H / 2}) scale(${s}) translate(${-x} ${-y})`}>{children}</g>;
};

/** Full-frame SVG whose user units equal output pixels. */
export const Stage: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {W, H} = useLayout();
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      {children}
    </svg>
  );
};

/** Orange keyword highlight inside a Tag. */
export const Hi: React.FC<{children: React.ReactNode}> = ({children}) => <span style={{color: C.orange}}>{children}</span>;

type TagVariant = 'chip' | 'title' | 'label' | 'glyph';

/** HTML text overlay positioned in screen px relative to frame centre. */
export const Tag: React.FC<{
  x: number;
  y: number;
  o: number;
  variant?: TagVariant;
  size?: number;
  sub?: React.ReactNode;
  children: React.ReactNode;
}> = ({x, y, o, variant = 'chip', size, sub, children}) => {
  const {W, H, P} = useLayout();
  if (o <= 0.001) return null;
  const base: React.CSSProperties = {
    position: 'absolute',
    left: W / 2 + x,
    top: H / 2 + y,
    transform: `translate(-50%, -50%) translateY(${(1 - o) * 16}px) scale(${0.94 + 0.06 * o})`,
    opacity: o,
    fontFamily: FONT,
    whiteSpace: 'nowrap',
    textAlign: 'center',
    color: C.white,
  };
  const s = size ?? (variant === 'title' ? (P ? 92 : 96) : variant === 'label' ? (P ? 30 : 26) : variant === 'glyph' ? 220 : P ? 46 : 40);
  const styles: Record<TagVariant, React.CSSProperties> = {
    chip: {
      fontSize: s,
      fontWeight: 700,
      padding: '0.38em 0.95em',
      borderRadius: 999,
      background: 'rgba(8,19,47,0.82)',
      border: `2.5px solid rgba(67,197,245,0.55)`,
      boxShadow: '0 0 34px rgba(67,197,245,0.25), 0 10px 30px rgba(0,0,0,0.35)',
      letterSpacing: '0.01em',
    },
    title: {
      fontSize: s,
      fontWeight: 800,
      letterSpacing: '0.04em',
      color: C.orange,
      textShadow: '0 0 40px rgba(255,146,62,0.55), 0 6px 18px rgba(0,0,0,0.5)',
    },
    label: {
      fontSize: s,
      fontWeight: 700,
      letterSpacing: '0.22em',
      color: C.muted,
      textTransform: 'uppercase',
      textShadow: '0 2px 10px rgba(0,0,0,0.6)',
    },
    glyph: {
      fontSize: s,
      fontWeight: 800,
      color: C.orange,
      lineHeight: 1,
      textShadow: '0 0 60px rgba(255,146,62,0.6)',
    },
  };
  return (
    <div style={{...base, ...styles[variant]}}>
      {children}
      {sub ? (
        <div style={{fontSize: s * 0.3, fontWeight: 600, letterSpacing: '0.2em', color: C.muted, marginTop: '0.3em', textShadow: 'none'}}>{sub}</div>
      ) : null}
    </div>
  );
};

/** Shared navy environment with slow drifting light (subtle parallax depth). */
export const Backdrop: React.FC<{t: number}> = ({t}) => {
  const {P} = useLayout();
  const a = 30 + Math.sin(t * 0.13) * 12;
  const b = 70 + Math.cos(t * 0.11) * 10;
  return (
    <AbsoluteFill
      style={{
        background: [
          `radial-gradient(ellipse ${P ? '90% 45%' : '55% 70%'} at ${a}% ${P ? 22 : 30}%, rgba(67,197,245,0.10), transparent 70%)`,
          `radial-gradient(ellipse ${P ? '80% 40%' : '50% 60%'} at ${b}% ${P ? 80 : 75}%, rgba(255,146,62,0.07), transparent 70%)`,
          `radial-gradient(ellipse 120% 100% at 50% 45%, ${C.navy2} 0%, ${C.navy} 70%, #050C20 100%)`,
        ].join(','),
      }}
    />
  );
};

/** Common SVG filters (one copy per Stage). */
export const Filters: React.FC = () => (
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" result="b" />
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="softglow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="14" />
    </filter>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="18" stdDeviation="22" floodColor="#02060f" floodOpacity="0.55" />
    </filter>
  </defs>
);

/** Pulsing focus ring used to mark gaze targets / discoveries. */
export const Ring: React.FC<{x: number; y: number; r: number; o: number; t: number; color?: string; width?: number}> = ({
  x,
  y,
  r,
  o,
  t,
  color = C.orange,
  width = 4,
}) => {
  if (o <= 0) return null;
  const ph = (t * 1.4) % 1;
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth={width} filter="url(#glow)" />
      <circle cx={x} cy={y} r={r * (1 + ph * 0.35)} fill="none" stroke={color} strokeWidth={width * 0.6} opacity={(1 - ph) * 0.6} />
    </g>
  );
};
