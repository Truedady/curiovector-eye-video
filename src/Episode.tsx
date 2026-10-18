import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import './theme';
import {Backdrop} from './components/core';
import {eInOut, pr} from './lib';
import {FPS, SCENES, SFX, SceneId, XFADE} from './timeline';
import {S1Mirror} from './scenes/S1Mirror';
import {S2Phone} from './scenes/S2Phone';
import {S3Saccades} from './scenes/S3Saccades';
import {S4Retina} from './scenes/S4Retina';
import {S5Suppression} from './scenes/S5Suppression';
import {S6Camera} from './scenes/S6Camera';
import {S7Everyday} from './scenes/S7Everyday';
import {S8Reveal} from './scenes/S8Reveal';

const SCENE_COMPONENTS: Record<SceneId, React.FC<{t: number}>> = {
  mirror: S1Mirror,
  phone: S2Phone,
  saccades: S3Saccades,
  retina: S4Retina,
  suppression: S5Suppression,
  camera: S6Camera,
  everyday: S7Everyday,
  reveal: S8Reveal,
};

/**
 * One episode, two native layouts. Every scene reads absolute time `t` (seconds) and the
 * shared CUE table, so both compositions reveal identical events at identical timestamps;
 * only geometry differs (via useLayout().pick).
 */
export const Episode: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <AbsoluteFill style={{backgroundColor: '#08132F'}}>
      <Backdrop t={t} />
      {SCENES.map((s, i) => {
        const last = i === SCENES.length - 1;
        if (t < s.start || t >= s.end + (last ? 1 : XFADE)) return null;
        const fadeIn = i === 0 ? 1 : pr(t, s.start, XFADE, eInOut);
        const fadeOut = last ? 1 : 1 - pr(t, s.end, XFADE, eInOut);
        const Comp = SCENE_COMPONENTS[s.id];
        return (
          <AbsoluteFill key={s.id} style={{opacity: fadeIn * fadeOut}}>
            <Comp t={t} />
          </AbsoluteFill>
        );
      })}
      <Audio src={staticFile('eyes_voiceover.mp3')} />
      <Audio src={staticFile('sfx/pad.mp3')} volume={0.07} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s.t * FPS))} durationInFrames={30} layout="none">
          <Audio src={staticFile(`sfx/${s.src}.wav`)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
