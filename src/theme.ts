import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

/** CurioVector brand palette (see CURIOVECTOR_STYLE.md). */
export const C = {
  navy: '#08132F',
  navy2: '#0D1C42',
  navy3: '#15295A',
  navy4: '#1E3A78',
  blue: '#43C5F5',
  blueDeep: '#1F7FC0',
  muted: '#8EA6CF',
  orange: '#FF923E',
  orangeSoft: '#FFC08A',
  orangeDeep: '#D9662A',
  white: '#F8FAFF',
  skin: '#F3BE98',
  skinShade: '#D58C69',
  ink: '#1A1430',
};

export const FONT = 'Montserrat';

for (const weight of ['500', '700', '800']) {
  loadFont({family: FONT, url: staticFile(`fonts/montserrat-latin-${weight}-normal.woff2`), weight});
}
