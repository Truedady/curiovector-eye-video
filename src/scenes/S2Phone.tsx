import React from 'react';
import {Filters, Hi, Ring, Stage, Tag, Cam} from '../components/core';
import {EYE_DX, EYE_Y, Face} from '../components/Face';
import {HandBack, HandThumb, Mirror, MirrorRoom, Phone} from '../components/Props';
import {CUE, SCENES} from '../timeline';
import {C} from '../theme';
import {eBack, eInOut, gaze, Key, lerp, pr, trail, useLayout, win} from '../lib';

const S = SCENES[1];
export const S2_KEYS: Key[] = (() => {
  const k: Key[] = [{t: S.start, x: 0.62}];
  let x = -0.62;
  for (let tt = 13.1; tt < 24; tt += 0.85) {
    k.push({t: tt, x});
    x = -x;
  }
  return k;
})();

export const S2Phone: React.FC<{t: number}> = ({t}) => {
  const {pick} = useLayout();
  const M = pick({x: -470, y: 0, w: 640, h: 840, fs: 0.82, hy: -60}, {x: 0, y: -430, w: 840, h: 760, fs: 0.84, hy: -30});
  const F = pick({x: 440, y: 40, w: 820, h: 430, rot: -3}, {x: 0, y: 330, w: 940, h: 480, rot: -2});
  const drift = lerp(1, 1.03, pr(t, S.start, S.end - S.start, eInOut));

  const gm = gaze(t, S2_KEYS, 1 / 30);
  const playing = t >= CUE.playBack;
  const dur = 0.2;
  const gp = gaze(t, S2_KEYS, dur);
  const ghosts = playing ? trail(t, S2_KEYS, dur, 5, 0.035) : [];

  const phoneIn = pr(t, CUE.record - 0.25, 0.8, eBack);
  const focusMirror = pr(t, CUE.whyMirrorHide, 0.6);
  const reveal = win(t, CUE.thereTheyAre, 23.6, 0.3, 0.4);
  const phoneOffset = pick({x: (1 - phoneIn) * 900, y: 0}, {x: 0, y: (1 - phoneIn) * 900});

  // Screen framing: eyes fill the phone screen.
  const ss = (0.84 * (F.w - 40)) / ((EYE_DX + 52) * 2);
  const progress = playing ? Math.min(1, (t - CUE.playBack) / (S.end - CUE.playBack)) : 0;

  return (
    <>
      <Stage>
        <Filters />
        <Cam s={drift}>
          <g transform={`translate(${M.x} ${M.y}) scale(${1 + focusMirror * 0.04})`}>
            <Mirror id="s2m" w={M.w} h={M.h} glow={focusMirror}>
              <MirrorRoom w={M.w} h={M.h} />
              <g transform={`translate(0 ${M.hy}) scale(${M.fs})`}>
                <Face id="s2f" gx={gm.x} gy={0.05} />
              </g>
            </Mirror>
          </g>
          <g
            transform={`translate(${F.x + phoneOffset.x} ${F.y + phoneOffset.y}) rotate(${F.rot}) scale(${1 - focusMirror * 0.04})`}
            opacity={(phoneIn > 0 ? 1 : 0) * (1 - focusMirror * 0.6)}
          >
            <HandBack w={F.w} h={F.h} />
            <Phone id="s2p" w={F.w} h={F.h} mode={playing ? 'play' : 'rec'} t={t} recStart={CUE.record} progress={progress}>
              <rect x={-F.w} y={-F.h} width={F.w * 2} height={F.h * 2} fill="#10254D" />
              <g transform={`scale(${ss}) translate(0 ${-EYE_Y - 6})`}>
                <Face id="s2pf" gx={gp.x} gy={0.05} ghosts={ghosts} body={false} />
                {reveal > 0 && (
                  <>
                    <Ring x={-EYE_DX} y={EYE_Y} r={62} o={reveal} t={t} width={2} />
                    <Ring x={EYE_DX} y={EYE_Y} r={62} o={reveal} t={t} width={2} />
                    {[-EYE_DX, EYE_DX].map((ex, i) => (
                      <g key={i} opacity={reveal}>
                        <path d={`M ${ex - 26} ${EYE_Y + 44} L ${ex + 26} ${EYE_Y + 44}`} stroke={C.blue} strokeWidth={3} strokeLinecap="round" filter="url(#glow)" />
                        <path d={`M ${ex - 26} ${EYE_Y + 44} l 7 -5 M ${ex - 26} ${EYE_Y + 44} l 7 5 M ${ex + 26} ${EYE_Y + 44} l -7 -5 M ${ex + 26} ${EYE_Y + 44} l -7 5`} stroke={C.blue} strokeWidth={3} strokeLinecap="round" />
                      </g>
                    ))}
                  </>
                )}
              </g>
            </Phone>
            <HandThumb w={F.w} h={F.h} />
          </g>
        </Cam>
      </Stage>
      <Tag x={M.x * drift} y={(M.y - M.h / 2) * drift - pick(50, 45)} o={pr(t, S.start + 0.3, 0.6)} variant="label">
        Mirror
      </Tag>
      <Tag x={M.x * drift} y={(M.y + M.h / 2 - 70) * drift} o={win(t, 13.4, CUE.whyMirrorHide, 0.4, 0.3)}>
        Looks <Hi>instant</Hi>
      </Tag>
      <Tag x={F.x * drift + phoneOffset.x} y={(F.y - F.h / 2) * drift - pick(60, 48)} o={phoneIn * (1 - focusMirror * 0.6)} variant="label">
        Phone camera
      </Tag>
      <Tag x={F.x * drift} y={(F.y + F.h / 2) * drift + pick(80, 70)} o={win(t, CUE.thereTheyAre + 0.15, CUE.whyMirrorHide, 0.35, 0.3)}>
        Movement <Hi>revealed</Hi>
      </Tag>
      <Tag x={pick(M.x + M.w / 2 - 40, M.w / 2 - 90)} y={pick(-M.h / 2 + 90, M.y - M.h / 2 + 120)} o={win(t, CUE.whyMirrorHide + 0.2, 24.2, 0.4, 0.3)} variant="glyph" size={pick(200, 180)}>
        ?
      </Tag>
    </>
  );
};
