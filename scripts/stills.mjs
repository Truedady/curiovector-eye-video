// Renders a handful of QA stills from both compositions with a single bundle.
// Usage: node scripts/stills.mjs <outDir> <sec,sec,...>
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const [outDir = 'out/stills', secs = '1,9.5,18.5,31,44.5,61,79,104,113.5'] = process.argv.slice(2);
const browserExecutable = process.env.REMOTION_BROWSER || null;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
for (const id of ['CurioVectorLandscape', 'CurioVectorShorts']) {
  const composition = await selectComposition({serveUrl, id, browserExecutable});
  for (const s of secs.split(',').map(Number)) {
    const frame = Math.min(composition.durationInFrames - 1, Math.round(s * 30));
    const output = path.join(outDir, `${id}_${String(s).padStart(6, '0')}.jpg`);
    await renderStill({serveUrl, composition, frame, output, imageFormat: 'jpeg', jpegQuality: 80, scale: 0.5, browserExecutable});
    console.log('ok', output);
  }
}
