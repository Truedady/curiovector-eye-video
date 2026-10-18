import React from 'react';
import {Composition} from 'remotion';
import {Episode} from './Episode';
import {DURATION_FRAMES, FPS} from './timeline';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="CurioVectorLandscape" component={Episode} durationInFrames={DURATION_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="CurioVectorShorts" component={Episode} durationInFrames={DURATION_FRAMES} fps={FPS} width={1080} height={1920} />
  </>
);
