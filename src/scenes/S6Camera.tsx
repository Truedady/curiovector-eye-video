import React from 'react';
import {Cam, Filters, Hi, Stage, Tag} from '../components/core';
import {EYE_DX, EYE_Y, Face} from '../components/Face';
import {Mirror, MirrorRoom, Phone} from '../components/Props';
import {CUE, SCENES} from '../timeline';
import {C, FONT} from '../theme';
import {eInOut, gaze, Key, lerp, pr, trail, useLayout, win} from '../lib';

const S = SCENES[5];
const alt = (from: number, to: number, every: number, amp = 0.62): Key[] => {
  const k: Key[] = [{t: S.start, x: amp}];
  let x = -amp;
  for (let tt = from; tt < to; tt += every) {
    k.push({t: tt, x});
    x = -x;
  }
  return k;
};
const FRIEND = alt(77.6, S.end, 0.55);
const SELF = alt(80.1, S.end, 0.7);
const PHONE = alt(83.8, S.end + 0.5, 0.6);
const DUR = 0.13;

export const S6Camera: React.FC<{t: number}> = ({t}) => {
  const {pick} = useLayout();
  const fr = pick({x: -470, y: 10, r: 370, fs: 0.92}, {x: 0, y: -520, r: 320, fs: 0.82});
  const M = pick({x: 470, y: 10, w: 620, h: 800, fs: 0.8, hy: -60}, {x: 0, y: 260, w: 820, h: 600, fs: 0.7, hy: 0});
  const F = pick({x: 0, y: -60, w: 900, h: 470}, {x: 0, y: -330, w: 960, h: 500});
  const strip = pick({y: 330, fw: 220, fh: 132, gap: 240}, {y: 250, fw: 176, fh: 110, gap: 190});
  const badgeY = pick(-390, 20);
  const drift = lerp(1, 1.03, pr(t, S.start, S.end - S.start, eInOut));

  const kB = pr(t, CUE.andPhone - 0.1, 0.7, eInOut);
  const aO = 1 - kB;
  const gF = gaze(t, FRIEND, DUR);
  const gS = gaze(t, SELF, 1 / 30);
  const gP = gaze(t, PHONE, DUR);
  const ghostsF = trail(t, FRIEND, DUR, 5, 0.03);
  const ghostsP = trail(t, PHONE, DUR, 5, 0.03);
  const vanish = win(t, CUE.ownVanish, CUE.andPhone, 0.3, 0.3);
  const vanishFade = pr(t, CUE.vanish, 0.8);
  const ss = (0.84 * (F.w - 40)) / ((EYE_DX + 52) * 2);

  return (
    <>
      <Stage>
        <Filters />
        <defs>
          <radialGradient id="s6bg">
            <stop offset="0" stopColor="#2A4F8E" />
            <stop offset="1" stopColor="#0D1C42" />
          </radialGradient>
          <clipPath id="s6fc">
            <circle r={fr.r} />
          </clipPath>
        </defs>
        <Cam s={drift}>
          {aO > 0 && (
            <g opacity={aO}>
              <g transform={`translate(${fr.x} ${fr.y}) scale(${1 - kB * 0.1})`}>
                <circle r={fr.r + 10} fill="#050B1D" filter="url(#shadow)" />
                <g clipPath="url(#s6fc)">
                  <circle r={fr.r} fill="url(#s6bg)" />
                  <circle cx={-fr.r * 0.5} cy={-fr.r * 0.5} r={fr.r * 0.6} fill={C.orange} opacity={0.12} filter="url(#softglow)" />
                  <g transform={`translate(0 ${fr.r * 0.08}) scale(${fr.fs})`}>
                    <Face id="s6fr" variant="friend" gx={gF.x} gy={0.05} ghosts={ghostsF} />
                    {[-EYE_DX, EYE_DX].map((ex, i) => (
                      <path
                        key={i}
                        d={`M ${ex - 28} ${EYE_Y + 42} L ${ex + 28} ${EYE_Y + 42} M ${ex - 28} ${EYE_Y + 42} l 8 -6 M ${ex - 28} ${EYE_Y + 42} l 8 6 M ${ex + 28} ${EYE_Y + 42} l -8 -6 M ${ex + 28} ${EYE_Y + 42} l -8 6`}
                        stroke={C.blue}
                        strokeWidth={3.5}
                        strokeLinecap="round"
                        fill="none"
                        opacity={pr(t, CUE.dart, 0.4)}
                        filter="url(#glow)"
                      />
                    ))}
                  </g>
                </g>
                <circle r={fr.r} fill="none" stroke={C.blue} strokeWidth={4} opacity={0.5} />
              </g>
              <g transform={`translate(${M.x} ${M.y}) scale(${1 - kB * 0.1})`}>
                <Mirror id="s6m" w={M.w} h={M.h}>
                  <MirrorRoom w={M.w} h={M.h} />
                  <g transform={`translate(0 ${M.hy}) scale(${M.fs})`}>
                    <Face id="s6s" gx={gS.x} gy={0.05} />
                    {vanish > 0 &&
                      [-EYE_DX, EYE_DX].map((ex, i) => (
                        <g key={i} opacity={vanish * (1 - vanishFade * 0.85)}>
                          {[-0.31, 0, 0.31].map((gx, j) => (
                            <circle key={j} cx={ex + gx * 24} cy={EYE_Y + 2} r={21} fill="none" stroke={C.white} strokeWidth={2} strokeDasharray="4 4" />
                          ))}
                        </g>
                      ))}
                  </g>
                </Mirror>
              </g>
            </g>
          )}
          {kB > 0 && (
            <g opacity={kB}>
              <g transform={`translate(${F.x} ${F.y + (1 - kB) * 120}) scale(${lerp(0.9, 1, kB)})`}>
                <Phone id="s6p" w={F.w} h={F.h} mode="rec" t={t} recStart={CUE.andPhone}>
                  <rect x={-F.w} y={-F.h} width={F.w * 2} height={F.h * 2} fill="#10254D" />
                  <g transform={`scale(${ss}) translate(0 ${-EYE_Y - 6})`}>
                    <Face id="s6pf" gx={gP.x} gy={0.05} ghosts={ghostsP} body={false} />
                  </g>
                </Phone>
              </g>
              {/* film strip: frame-by-frame record of one eye movement */}
              <g transform={`translate(0 ${strip.y})`}>
                {(() => {
                  const n = 5;
                  const total = strip.gap * (n - 1) + strip.fw + 60;
                  const so = pr(t, CUE.records - 0.4, 0.5);
                  return (
                    <g opacity={so}>
                      <rect x={-total / 2} y={-strip.fh / 2 - 34} width={total} height={strip.fh + 68} rx={14} fill="#050B1D" />
                      {Array.from({length: Math.round(total / 34)}).map((_, i) => (
                        <g key={i}>
                          <rect x={-total / 2 + 12 + i * 34} y={-strip.fh / 2 - 24} width={16} height={12} rx={3} fill="#22325C" />
                          <rect x={-total / 2 + 12 + i * 34} y={strip.fh / 2 + 12} width={16} height={12} rx={3} fill="#22325C" />
                        </g>
                      ))}
                      {Array.from({length: n}).map((_, i) => {
                        const fo = pr(t, CUE.records + i * 0.14, 0.3);
                        const gx = -0.62 + (1.24 * i) / (n - 1);
                        const fsc = strip.fw / 250;
                        return (
                          <g key={i} transform={`translate(${-strip.gap * 2 + i * strip.gap} 0)`} opacity={fo}>
                            <clipPath id={`s6clip${i}`}>
                              <rect x={-strip.fw / 2} y={-strip.fh / 2} width={strip.fw} height={strip.fh} rx={8} />
                            </clipPath>
                            <g clipPath={`url(#s6clip${i})`}>
                              <rect x={-strip.fw / 2} y={-strip.fh / 2} width={strip.fw} height={strip.fh} fill="#10254D" />
                              <g transform={`scale(${fsc}) translate(0 ${-EYE_Y - 4})`}>
                                <Face id={`s6ff${i}`} gx={gx} gy={0.05} body={false} />
                              </g>
                            </g>
                            <rect x={-strip.fw / 2} y={-strip.fh / 2} width={strip.fw} height={strip.fh} rx={8} fill="none" stroke={i === 2 ? C.orange : C.blue} strokeWidth={3} opacity={0.8} />
                            <text x={-strip.fw / 2 + 10} y={-strip.fh / 2 + 26} fill={C.white} fontFamily={FONT} fontSize={18} fontWeight={700} opacity={0.8}>
                              {i + 1}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  );
                })()}
              </g>
            </g>
          )}
        </Cam>
      </Stage>
      <Tag x={fr.x * drift} y={(fr.y + fr.r) * drift + pick(70, 50)} o={win(t, CUE.friendsEyes, CUE.andPhone, 0.35, 0.3)}>
        A friend: <Hi>visible</Hi> motion
      </Tag>
      <Tag x={M.x * drift} y={(M.y + M.h / 2) * drift + pick(70, 60)} o={win(t, CUE.ownVanish, CUE.andPhone, 0.35, 0.3)}>
        Your own: <Hi>vanishes</Hi>
      </Tag>
      <Tag x={0} y={badgeY * drift} o={win(t, CUE.noFiltering, S.end + 0.3, 0.4, 0.3)}>
        No visual <Hi>filtering</Hi>
      </Tag>
      <Tag x={0} y={(strip.y + strip.fh / 2 + 80) * drift} o={win(t, CUE.records + 0.3, S.end + 0.3, 0.4, 0.3)} variant="label">
        Frame by frame
      </Tag>
    </>
  );
};
