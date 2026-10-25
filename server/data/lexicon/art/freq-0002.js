// Illustration specs for common words, batch 0002 (plus leftovers of 0001) (see server/scripts/lexicon/art.js)
const { s } = require('../../../scripts/lexicon/art');

const SW = (w, extra = {}) => ({ fill: 'none', 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra });
const ground = (y = 136) => s('path', { d: `M14 ${y}h132`, ...SW(4) }, 'gray', { stroke: true });
// A standing person: round head and rounded body, feet at y = foot
const person = (cx, foot, color, { h = 44, w = 30, r = 12, accent = false } = {}) => [
  s('circle', { cx, cy: foot - h - r - 2, r }, 'skin'),
  s('rect', { x: cx - w / 2, y: foot - h, width: w, height: h, rx: w / 3 }, color, accent ? { accent: true } : {})
];
// A person in a dress (triangle skirt) with a bow
const lady = (cx, foot, color, { accent = false } = {}) => [
  s('circle', { cx, cy: foot - 62, r: 12 }, 'skin'),
  s('path', { d: `M${cx - 8} ${foot - 50}h16l14 50h-44z` }, color, accent ? { accent: true } : {}),
  s('path', { d: `M${cx + 6} ${foot - 74}l10-6v12z` }, 'red')
];
const arrow = (d, color = 'orange', w = 6) => s('path', { d, ...SW(w) }, color, { stroke: true });
const note = (x, y, color) => [
  s('ellipse', { cx: x, cy: y, rx: 8, ry: 6 }, color, { accent: true }),
  s('path', { d: `M${x + 7} ${y}v-28l12 6`, ...SW(4) }, color, { stroke: true })
];
const flower = (cx, cy, color) => [
  s('path', { d: `M${cx} ${cy + 10}v${136 - cy - 10}`, ...SW(4) }, 'green', { stroke: true }),
  s('circle', { cx: cx - 9, cy, r: 8 }, color), s('circle', { cx: cx + 9, cy, r: 8 }, color),
  s('circle', { cx, cy: cy - 9, r: 8 }, color), s('circle', { cx, cy: cy + 9, r: 8 }, color),
  s('circle', { cx, cy, r: 6 }, 'yellow', { accent: true })
];
// Path data: several filled circles in one path
const dots = (pts, r) => pts.map(([x, y]) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`).join('');
// Path data: a five-pointed star
const star = (cx, cy, R, r = R * 0.45) => Array.from({ length: 10 }, (_, i) => {
  const a = (-90 + i * 36) * Math.PI / 180, d = i % 2 ? r : R;
  return `${i ? 'L' : 'M'}${(cx + d * Math.cos(a)).toFixed(1)} ${(cy + d * Math.sin(a)).toFixed(1)}`;
}).join('') + 'z';
// Path data: rounded arch bodies (shoulders) standing on y = foot
const busts = (xs, foot, w = 22, h = 22) => xs.map(x => `M${x - w / 2} ${foot}v${-(h - w / 2)}a${w / 2} ${w / 2} 0 0 1 ${w} 0v${h - w / 2}z`).join('');

module.exports = {
  zona: [
    s('rect', { x: 14, y: 30, width: 132, height: 100, rx: 10 }, 'mint'),
    s('rect', { x: 38, y: 52, width: 84, height: 56, rx: 4 }, 'yellow', { accent: true }),
    s('rect', { x: 38, y: 52, width: 84, height: 56, rx: 4, ...SW(4, { 'stroke-dasharray': '8 7' }) }, 'red', { stroke: true }),
    s('path', { d: 'M31 60l7-18 7 18zM115 60l7-18 7 18zM31 116l7-18 7 18zM115 116l7-18 7 18z' }, 'orange')
  ],
  'línea': [
    s('path', { d: 'M24 126 110 56', ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('circle', { cx: 24, cy: 126, r: 8 }, 'dark'),
    s('rect', { x: 120, y: 46, width: 30, height: 12, transform: 'rotate(-39 110 52)' }, 'yellow'),
    s('path', { d: 'M110 52l10-6v12z', transform: 'rotate(-39 110 52)' }, 'tan'),
    s('rect', { x: 148, y: 46, width: 8, height: 12, rx: 2, transform: 'rotate(-39 110 52)' }, 'pink')
  ],
  mundial: [
    s('path', { d: 'M30 70a50 50 0 0 0 100 0', ...SW(5) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 70, r: 44 }, 'sky'),
    s('path', { d: 'M56 34c10 4 14 14 8 24s6 18 12 22-4 18-18 20c-12-8-20-24-18-40 2-12 8-20 16-26zM98 30c14 4 24 14 26 28-10 4-20 0-26-8s-4-14 0-20zM100 92c8-2 16 4 14 14-6 6-12 8-18 8 0-8 0-18 4-22z' }, 'green', { accent: true }),
    s('path', { d: 'M80 120v10', ...SW(6) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 80, cy: 134, rx: 28, ry: 6 }, 'brown')
  ],
  obra: [
    ground(),
    s('rect', { x: 40, y: 28, width: 14, height: 108 }, 'yellow', { accent: true }),
    s('path', { d: 'M40 40l14 14M54 54 40 68M40 82l14 14M54 96l-14 14M40 124l14 12', ...SW(2) }, 'orange', { stroke: true }),
    s('rect', { x: 20, y: 22, width: 124, height: 10 }, 'yellow'),
    s('rect', { x: 20, y: 32, width: 16, height: 12 }, 'gray'),
    s('path', { d: 'M124 32v40', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 112, y: 72, width: 24, height: 16, rx: 2 }, 'brown'),
    s('path', { d: 'M86 136v-30h52v30M86 120h52', ...SW(4) }, 'red', { stroke: true })
  ],
  'atención': [
    s('path', { d: 'M80 22 144 132H16z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 22 144 132H16z', ...SW(6) }, 'orange', { stroke: true }),
    s('rect', { x: 74, y: 56, width: 12, height: 44, rx: 6 }, 'dark'),
    s('circle', { cx: 80, cy: 116, r: 7 }, 'dark')
  ],
  respecto: [
    s('path', { d: 'M24 24h80a10 10 0 0 1 10 10v44a10 10 0 0 1-10 10H58l-18 16 2-16H24a10 10 0 0 1-10-10V34a10 10 0 0 1 10-10z' }, 'sky'),
    s('circle', { cx: 64, cy: 56, r: 16 }, 'red'),
    s('path', { d: 'M84 74q24 12 30 34', ...SW(3, { 'stroke-dasharray': '5 6' }) }, 'dark', { stroke: true }),
    s('circle', { cx: 122, cy: 124, r: 16 }, 'red', { accent: true }),
    s('path', { d: 'M14 140h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  capital: [
    s('rect', { x: 14, y: 30, width: 132, height: 100, rx: 10 }, 'mint'),
    s('path', { d: 'M14 104q40-24 70-6t62-10M64 30v100', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: dots([[38, 56], [118, 112], [34, 116]], 6) }, 'gray'),
    s('circle', { cx: 104, cy: 64, r: 22 }, 'yellow'),
    s('path', { d: star(104, 65, 17) }, 'red', { accent: true })
  ],
  'población': [
    s('path', { d: 'M14 104V60h20V44h18v24h16V34h22v32h16V48h20v24h20v32z' }, 'gray'),
    s('path', { d: dots([[26, 84], [48, 84], [70, 84], [92, 84], [114, 84], [136, 84]], 9) }, 'skin'),
    s('path', { d: busts([26, 48, 70, 92, 114, 136], 118, 20, 22) }, 'blue'),
    s('path', { d: dots([[37, 108], [60, 108], [83, 108], [106, 108], [129, 108]], 10) }, 'skin'),
    s('path', { d: busts([37, 60, 83, 106, 129], 142, 22, 22) }, 'orange', { accent: true })
  ],
  'relación': [
    s('circle', { cx: 62, cy: 86, r: 30, ...SW(12) }, 'blue', { stroke: true, accent: true }),
    s('circle', { cx: 98, cy: 86, r: 30, ...SW(12) }, 'pink', { stroke: true }),
    s('path', { d: 'M85 105.3A30 30 0 0 1 74.2 113.4', ...SW(12, { 'stroke-linecap': 'butt' }) }, 'blue', { stroke: true }),
    s('path', { d: 'M80 44c-12-8-15-15-10-20 3-3 8-2 10 2 2-4 7-5 10-2 5 5 2 12-10 20z' }, 'red')
  ],
  vario: [
    s('path', { d: 'M58 92 46 34M72 92l-4-64M88 92l6-62M102 92l14-52', ...SW(10) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 92 46 34', ...SW(10) }, 'red', { stroke: true }),
    s('path', { d: 'M72 92l-4-64', ...SW(10) }, 'yellow', { stroke: true }),
    s('path', { d: 'M88 92l6-62', ...SW(10) }, 'green', { stroke: true }),
    s('path', { d: 'M102 92l14-52', ...SW(10) }, 'purple', { stroke: true }),
    s('path', { d: 'M44 86h72l-8 50H52z' }, 'blue', { accent: true })
  ],
  'músico': [
    ground(),
    ...person(54, 136, 'navy'),
    s('path', { d: 'M74 112 118 72', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 64, cy: 120, r: 16 }, 'orange', { accent: true }),
    s('circle', { cx: 76, cy: 106, r: 12 }, 'orange'),
    s('circle', { cx: 69, cy: 114, r: 5 }, 'dark'),
    ...note(118, 52, 'purple')
  ],
  rey: [
    ground(),
    ...person(76, 136, 'purple', { w: 38, h: 48 }),
    s('rect', { x: 60, y: 86, width: 32, height: 9, rx: 4 }, 'white'),
    s('path', { d: 'M62 66l-2-20 9 9 7-13 7 13 9-9-2 20z' }, 'yellow', { accent: true }),
    s('path', { d: 'M94 106h18', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M114 136V66', ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 114, cy: 62, r: 7 }, 'red')
  ],
  vos: [
    ground(),
    ...person(70, 136, 'sky', { w: 34, accent: true }),
    s('path', { d: 'M62 94v40M78 94v40', ...SW(6, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('path', { d: 'M86 102l18-24', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 106, cy: 72, r: 8 }, 'skin'),
    s('path', { d: 'M118 56q6 8 0 16M128 48q11 16 0 32', ...SW(3) }, 'orange', { stroke: true })
  ],
  apoyo: [
    s('path', { d: 'M18 86q4 34 34 46h28v-22H58q-10 0-16-8l-12-18q-6-8-12 2z' }, 'skin'),
    s('path', { d: 'M142 86q-4 34-34 46H80v-22h22q10 0 16-8l12-18q6-8 12 2z' }, 'skin'),
    s('path', { d: 'M80 112v20', ...SW(2) }, 'brown', { stroke: true }),
    s('rect', { x: 44, y: 130, width: 72, height: 12, rx: 4 }, 'blue'),
    s('path', { d: 'M80 104c-26-16-32-32-22-42 8-8 18-6 22 4 4-10 14-12 22-4 10 10 4 26-22 42z' }, 'red', { accent: true })
  ],
  dado: [
    s('rect', { x: 36, y: 62, width: 64, height: 64, rx: 4 }, 'white'),
    s('path', { d: 'M36 62l24-22h64l-24 22z' }, 'cream'),
    s('path', { d: 'M100 62l24-22v64l-24 22z' }, 'gray'),
    s('path', { d: 'M36 62h64v64H36zM36 62l24-22h64l-24 22M100 62l24-22v64l-24 22', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 68, cy: 94, r: 10 }, 'red', { accent: true }),
    s('path', { d: dots([[107, 74], [117, 96], [80, 51]], 4) }, 'dark')
  ],
  fuerza: [
    ground(),
    ...person(80, 136, 'red', { w: 34 }),
    s('path', { d: 'M66 98 54 58M94 98l12-40', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M40 50q-6-16 10-24 12-12 30-8 18-8 32 4 16 6 10 24-6 10-22 10H54q-12 0-14-6z' }, 'gray', { accent: true }),
    s('path', { d: 'M40 50q-6-16 10-24 12-12 30-8 18-8 32 4 16 6 10 24-6 10-22 10H54q-12 0-14-6z', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 34l10 6M94 30l8 8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 80q-6 8 0 10M130 80q6 8 0 10', ...SW(3) }, 'sky', { stroke: true })
  ],
  oficial: [
    s('rect', { x: 22, y: 26, width: 116, height: 96, rx: 4 }, 'cream'),
    s('rect', { x: 22, y: 26, width: 116, height: 96, rx: 4, ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 48h80M40 64h80M40 80h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M98 104l-8 34 12-6 6 12 4-36zM118 104l8 34-12-6-6 12-4-36z' }, 'red'),
    s('circle', { cx: 108, cy: 100, r: 18 }, 'yellow', { accent: true }),
    s('path', { d: star(108, 101, 10) }, 'orange')
  ],
  propio: [
    s('circle', { cx: 50, cy: 62, r: 22, ...SW(10) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M72 62h64M118 62v18M132 62v14', ...SW(10) }, 'yellow', { stroke: true }),
    s('path', { d: 'M40 82l-6 24', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 14, y: 104, width: 40, height: 34, rx: 6 }, 'sky'),
    s('circle', { cx: 34, cy: 115, r: 6 }, 'navy'),
    s('path', { d: 'M24 134a10 10 0 0 1 20 0z' }, 'navy')
  ],
  chile: [
    s('path', { d: 'M42 52c-6 34 6 66 38 80 18 8 40 6 38-2-2-6-20-6-34-20-14-16-18-38-16-58z' }, 'red', { accent: true }),
    s('path', { d: 'M56 44q-2-16 14-26', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M38 56q17-14 34 0q-6-12-17-12t-17 12z' }, 'green'),
    s('ellipse', { cx: 54, cy: 82, rx: 4, ry: 14, opacity: 0.5 }, 'white', { flatOnly: true })
  ],
  control: [
    s('rect', { x: 54, y: 16, width: 52, height: 128, rx: 14 }, 'dark'),
    s('circle', { cx: 80, cy: 38, r: 9 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 74, r: 17 }, 'gray'),
    s('circle', { cx: 80, cy: 74, r: 6 }, 'dark'),
    s('path', { d: 'M66 102h10v8H66zM84 102h10v8H84zM66 118h10v8H66zM84 118h10v8H84z' }, 'gray')
  ],
  serie: [
    s('rect', { x: 14, y: 44, width: 132, height: 72, rx: 4 }, 'dark'),
    s('path', { d: [20, 38, 56, 74, 92, 110, 128].map(x => `M${x} 49h10v6H${x}zM${x} 105h10v6H${x}z`).join('') }, 'white'),
    s('rect', { x: 22, y: 62, width: 34, height: 36, rx: 2 }, 'sky'),
    s('rect', { x: 63, y: 62, width: 34, height: 36, rx: 2 }, 'yellow', { accent: true }),
    s('rect', { x: 104, y: 62, width: 34, height: 36, rx: 2 }, 'pink'),
    s('path', { d: 'M74 70v20l16-10z' }, 'red')
  ],
  futuro: [
    s('path', { d: 'M48 138l8-24h48l8 24z' }, 'brown'),
    s('circle', { cx: 80, cy: 70, r: 46 }, 'purple', { accent: true }),
    s('ellipse', { cx: 62, cy: 52, rx: 10, ry: 16, opacity: 0.5, transform: 'rotate(30 62 52)' }, 'white', { flatOnly: true }),
    s('path', { d: star(92, 80, 14) }, 'yellow'),
    s('path', { d: star(132, 24, 7) + star(28, 30, 5) }, 'yellow')
  ],
  justicia: [
    s('rect', { x: 50, y: 118, width: 80, height: 18, rx: 4 }, 'brown'),
    s('rect', { x: 64, y: 54, width: 74, height: 12, rx: 4, transform: 'rotate(-30 70 60)' }, 'tan'),
    s('rect', { x: 40, y: 28, width: 30, height: 64, rx: 6, transform: 'rotate(-30 70 60)' }, 'brown', { accent: true }),
    s('rect', { x: 36, y: 24, width: 38, height: 10, rx: 3, transform: 'rotate(-30 70 60)' }, 'tan'),
    s('rect', { x: 36, y: 86, width: 38, height: 10, rx: 3, transform: 'rotate(-30 70 60)' }, 'tan'),
    s('path', { d: 'M34 126H20M38 110l-12-8M60 104l-6-12', ...SW(3) }, 'orange', { stroke: true })
  ],
  libertad: [
    s('path', { d: 'M22 136V82a30 30 0 0 1 60 0v54', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M37 136V58M52 136V52M67 136V58', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 18, y: 130, width: 68, height: 10, rx: 3 }, 'dark'),
    s('path', { d: 'M82 96l22-10v34l-22 10', ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 116, cy: 52, rx: 18, ry: 11 }, 'blue', { accent: true }),
    s('path', { d: 'M112 48 104 22l20 22z' }, 'sky'),
    s('path', { d: 'M133 48l10 3-10 5z' }, 'orange')
  ],
  pesar: [
    s('rect', { x: 30, y: 92, width: 100, height: 44, rx: 8 }, 'gray'),
    s('circle', { cx: 80, cy: 114, r: 15 }, 'white'),
    s('path', { d: 'M80 114l9-9', ...SW(3) }, 'red', { stroke: true }),
    s('rect', { x: 22, y: 82, width: 116, height: 10, rx: 4 }, 'dark'),
    s('path', { d: 'M52 82l6-34h44l6 34z' }, 'navy', { accent: true }),
    s('path', { d: 'M68 48a12 12 0 0 1 24 0', ...SW(6) }, 'navy', { stroke: true })
  ],
  'allá': [
    s('path', { d: 'M14 82l26-26 20 18 22-28 28 30 18-14 18 20z' }, 'purple'),
    s('rect', { x: 14, y: 82, width: 132, height: 54 }, 'mint'),
    s('path', { d: 'M36 136 76 82h8l40 54z' }, 'gray'),
    s('path', { d: 'M80 132v-10M80 112v-8M80 96v-6', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M126 136V96', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M108 76h22l10 9-10 9h-22z' }, 'orange', { accent: true })
  ],
  cantidad: [
    s('path', { d: 'M46 30h64l-6 106H52z' }, 'white'),
    s('path', { d: 'M49 76h58l-3 60H52z' }, 'blue', { accent: true }),
    s('path', { d: 'M46 30h64l-6 106H52z', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 50h14q8 0 8 10v28q0 10-10 10h-14', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 50h14M52 66h10M52 82h14M52 98h10M52 114h14', ...SW(3) }, 'dark', { stroke: true })
  ],
  existir: [
    s('path', { d: 'M64 20h32l42 116H22z', opacity: 0.45 }, 'yellow'),
    s('rect', { x: 58, y: 12, width: 44, height: 12, rx: 4 }, 'dark'),
    s('ellipse', { cx: 80, cy: 134, rx: 54, ry: 8 }, 'yellow'),
    ...person(80, 132, 'purple', { accent: true }),
    s('path', { d: 'M46 68l-8-4M114 68l8-4M50 92H40M110 92h10', ...SW(3) }, 'orange', { stroke: true })
  ],
  imagen: [
    s('rect', { x: 52, y: 36, width: 40, height: 18, rx: 4 }, 'dark'),
    s('rect', { x: 18, y: 48, width: 124, height: 84, rx: 12 }, 'dark'),
    s('circle', { cx: 80, cy: 90, r: 30 }, 'gray'),
    s('circle', { cx: 80, cy: 90, r: 19 }, 'sky', { accent: true }),
    s('circle', { cx: 73, cy: 83, r: 5 }, 'white'),
    s('rect', { x: 114, y: 58, width: 18, height: 10, rx: 2 }, 'yellow')
  ],
  'político': [
    s('circle', { cx: 80, cy: 50, r: 14 }, 'skin'),
    s('path', { d: 'M54 96V80q0-14 26-14t26 14v16z' }, 'navy'),
    s('path', { d: 'M80 66v22', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M68 92 62 74M92 92l6-18', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[62, 72], [98, 72]], 5) }, 'dark'),
    s('path', { d: 'M46 138l6-46h56l6 46z' }, 'brown'),
    s('circle', { cx: 80, cy: 114, r: 11 }, 'yellow', { accent: true })
  ],
  principal: [
    s('path', { d: star(80, 84, 50, 22) }, 'yellow', { accent: true }),
    s('path', { d: star(80, 84, 50, 22), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: star(26, 30, 10) + star(134, 30, 10) + star(24, 132, 10) + star(136, 132, 10) }, 'gray')
  ],
  vista: [
    s('path', { d: 'M34 38h28v20H34zM98 38h28v20H98z' }, 'gray'),
    s('rect', { x: 26, y: 54, width: 44, height: 72, rx: 16 }, 'dark'),
    s('rect', { x: 90, y: 54, width: 44, height: 72, rx: 16 }, 'dark'),
    s('rect', { x: 66, y: 64, width: 28, height: 22, rx: 4 }, 'gray'),
    s('circle', { cx: 48, cy: 108, r: 15 }, 'sky', { accent: true }),
    s('circle', { cx: 112, cy: 108, r: 15 }, 'sky'),
    s('path', { d: 'M42 102l6-4M106 102l6-4', ...SW(3) }, 'white', { stroke: true })
  ],
  actual: [
    s('rect', { x: 24, y: 34, width: 112, height: 102, rx: 8 }, 'white'),
    s('rect', { x: 24, y: 34, width: 112, height: 102, rx: 8, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M32 34h96a8 8 0 0 1 8 8v20H24V42a8 8 0 0 1 8-8z' }, 'red'),
    s('path', { d: 'M52 24v18M108 24v18', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: [44, 68, 92, 116].flatMap(x => [80, 100, 120].map(y => `M${x - 5} ${y - 5}h10v10h-10z`)).join('') }, 'gray'),
    s('circle', { cx: 92, cy: 100, r: 13 }, 'orange', { accent: true })
  ],
  ambos: [
    ground(),
    ...person(80, 136, 'green'),
    s('path', { d: 'M66 100 46 80M94 100l20-20', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M46 80 40 54M114 80l6-26', ...SW(2) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 38, cy: 36, rx: 16, ry: 20 }, 'red', { accent: true }),
    s('ellipse', { cx: 122, cy: 36, rx: 16, ry: 20 }, 'red')
  ],
  'elección': [
    s('path', { d: 'M80 146v-46L42 42M80 100l38-58', ...SW(18) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 140v-36', ...SW(3, { 'stroke-dasharray': '6 6' }) }, 'white', { stroke: true }),
    s('path', { d: 'M24 16l16 16M40 16 24 32', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M114 24l8 8 16-16', ...SW(6) }, 'green', { stroke: true, accent: true }),
    ...person(30, 136, 'orange', { h: 30, w: 20, r: 9 })
  ],
  estudio: [
    s('path', { d: 'M16 116c24-6 48-4 64 4 16-8 40-10 64-4v8H16z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 114c-16-8-40-10-60-6V58c20-4 44-2 60 6zM80 114c16-8 40-10 60-6V58c-20-4-44-2-60 6z' }, 'cream'),
    s('path', { d: 'M80 114c-16-8-40-10-60-6V58c20-4 44-2 60 6zM80 114c16-8 40-10 60-6V58c-20-4-44-2-60 6z', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M32 74q20-2 36 4M32 90q20-2 36 4M92 78q16-6 36-4M92 94q16-6 36-4', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 52 128 16', ...SW(6) }, 'orange', { stroke: true })
  ],
  media: [
    s('path', { d: 'M46 18h34v76l30 22c10 8 8 24-6 24H70c-14 0-24-10-24-24z' }, 'pink', { accent: true }),
    s('rect', { x: 46, y: 18, width: 34, height: 12 }, 'red'),
    s('path', { d: 'M46 52h34M46 68h34', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M96 140h8c14 0 16-16 6-24l-6-4', ...SW(0) }, 'red'),
    s('path', { d: 'M100 116l10 8c6 6 4 16-6 16h-8', ...SW(6) }, 'red', { stroke: true })
  ],
  mira: [
    s('circle', { cx: 80, cy: 80, r: 54 }, 'sky'),
    s('circle', { cx: 80, cy: 80, r: 54, ...SW(8) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 26, ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 30v36M80 94v36M30 80h36M94 80h36', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 6 }, 'red', { accent: true })
  ],
  modo: [
    s('rect', { x: 24, y: 28, width: 112, height: 104, rx: 14 }, 'dark'),
    s('rect', { x: 40, y: 44, width: 80, height: 30, rx: 15 }, 'green', { accent: true }),
    s('circle', { cx: 105, cy: 59, r: 11 }, 'white'),
    s('rect', { x: 40, y: 86, width: 80, height: 30, rx: 15 }, 'gray'),
    s('circle', { cx: 55, cy: 101, r: 11 }, 'white')
  ],
  plan: [
    s('rect', { x: 18, y: 18, width: 124, height: 100, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: 'M34 34h92v68H34zM80 34v36M34 70h28M104 102V74h22', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M62 70a18 18 0 0 1 18 18', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M112 134l28-28', ...SW(10) }, 'yellow', { stroke: true }),
    s('path', { d: 'M103 143l4-13 9 9z' }, 'tan')
  ],
  'región': [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'mint'),
    s('path', { d: 'M30 108l26-42 20 28 18-24 36 38z' }, 'green', { accent: true }),
    s('path', { d: 'M56 66l-8 13 8-3 6 5zM94 70l-6 8 7-2 5 4z' }, 'white'),
    s('path', { d: 'M38 124q26-12 46-2t40-4', ...SW(6) }, 'blue', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 60, ...SW(3, { 'stroke-dasharray': '8 6' }) }, 'dark', { stroke: true })
  ],
  comunidad: [
    ground(),
    s('rect', { x: 18, y: 98, width: 36, height: 38 }, 'tan'),
    s('path', { d: 'M12 100l24-22 24 22z' }, 'red'),
    s('rect', { x: 106, y: 98, width: 36, height: 38 }, 'tan'),
    s('path', { d: 'M100 100l24-22 24 22z' }, 'blue'),
    s('path', { d: 'M80 136v-32', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 84, r: 22 }, 'green', { accent: true }),
    s('path', { d: 'M30 136v-14h12v14M118 136v-14h12v14' }, 'brown')
  ],
  'investigación': [
    s('rect', { x: 36, y: 124, width: 88, height: 12, rx: 4 }, 'dark'),
    s('path', { d: 'M100 124V96q0-28-22-40', ...SW(10) }, 'gray', { stroke: true }),
    s('rect', { x: 50, y: 96, width: 54, height: 8, rx: 2 }, 'gray'),
    s('rect', { x: 54, y: 28, width: 20, height: 56, rx: 4, transform: 'rotate(-25 64 56)' }, 'blue', { accent: true }),
    s('rect', { x: 52, y: 18, width: 24, height: 12, rx: 3, transform: 'rotate(-25 64 56)' }, 'dark'),
    s('rect', { x: 62, y: 92, width: 26, height: 4 }, 'sky')
  ],
  partir: [
    ground(),
    s('path', { d: 'M20 124h30M34 112h22', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M76 80l-14 28h14l26-28z', transform: 'rotate(-22 80 80)' }, 'navy'),
    s('rect', { x: 34, y: 72, width: 100, height: 18, rx: 9, transform: 'rotate(-22 80 80)' }, 'blue', { accent: true }),
    s('path', { d: 'M40 74l-6-22h12l14 22z', transform: 'rotate(-22 80 80)' }, 'navy'),
    s('path', { d: dots([[90, 80], [102, 80], [114, 80]], 3), transform: 'rotate(-22 80 80)' }, 'white')
  ],
  'república': [
    s('circle', { cx: 80, cy: 80, r: 34 }, 'brown', { accent: true }),
    s('circle', { cx: 132, cy: 80, r: 13 }, 'blue'), s('circle', { cx: 106, cy: 125, r: 13 }, 'red'),
    s('circle', { cx: 54, cy: 125, r: 13 }, 'green'), s('circle', { cx: 28, cy: 80, r: 13 }, 'yellow'),
    s('circle', { cx: 54, cy: 35, r: 13 }, 'purple'), s('circle', { cx: 106, cy: 35, r: 13 }, 'orange'),
    s('path', { d: dots([[132, 80], [106, 125], [54, 125], [28, 80], [54, 35], [106, 35]], 7) }, 'skin'),
    s('rect', { x: 68, y: 70, width: 24, height: 20, rx: 2 }, 'white')
  ],
  resto: [
    s('circle', { cx: 80, cy: 82, r: 52, ...SW(3, { 'stroke-dasharray': '6 7' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 82V30a52 52 0 0 1 45 26z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 30a52 52 0 0 1 45 26', ...SW(8) }, 'tan', { stroke: true }),
    s('path', { d: dots([[94, 52], [104, 66]], 6) }, 'red'),
    s('path', { d: 'M44 104l4 4M58 120l-3 3M100 112l4-2', ...SW(3) }, 'tan', { stroke: true })
  ],
  vuelta: [
    s('path', { d: 'M110 42A46 46 0 1 0 125 86', ...SW(8) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M112 80l13 8 8-13', ...SW(8) }, 'green', { stroke: true }),
    s('circle', { cx: 72, cy: 76, r: 16 }, 'yellow'),
    s('circle', { cx: 88, cy: 92, r: 16 }, 'orange'),
    s('circle', { cx: 88, cy: 92, r: 9, ...SW(3) }, 'yellow', { stroke: true })
  ],
  consejo: [
    ground(),
    ...person(40, 136, 'brown'),
    s('path', { d: 'M28 78a12 12 0 0 1 24 0', ...SW(5) }, 'gray', { stroke: true }),
    ...person(120, 136, 'sky', { h: 36, w: 26, r: 11 }),
    s('path', { d: 'M54 18h60a10 10 0 0 1 10 10v24a10 10 0 0 1-10 10H74l-16 12 2-12h-6a10 10 0 0 1-10-10V28a10 10 0 0 1 10-10z' }, 'cream'),
    s('path', { d: 'M54 18h60a10 10 0 0 1 10 10v24a10 10 0 0 1-10 10H74l-16 12 2-12h-6a10 10 0 0 1-10-10V28a10 10 0 0 1 10-10z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 40l8 8 16-16', ...SW(6) }, 'green', { stroke: true, accent: true })
  ],
  llamado: [
    s('path', { d: 'M32 132l12-50h72l12 50z' }, 'red', { accent: true }),
    s('path', { d: 'M28 70q0-28 52-28t52 28l-4 12h-20l-4-10H56l-4 10H32z' }, 'dark'),
    s('circle', { cx: 80, cy: 108, r: 16 }, 'white'),
    s('circle', { cx: 80, cy: 108, r: 6 }, 'red'),
    s('path', { d: 'M22 42l-8-8M138 42l8-8M80 30V18', ...SW(4) }, 'orange', { stroke: true })
  ],
  movimiento: [
    ground(),
    s('path', { d: 'M18 134q20-90 44 0q18-60 36-6', ...SW(4, { 'stroke-dasharray': '6 6' }) }, 'blue', { stroke: true }),
    s('path', { d: 'M90 92h-16M94 104H70M98 116H82', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 120, cy: 104, r: 22 }, 'orange', { accent: true }),
    s('path', { d: 'M100 98q20-6 40 0M120 82q-8 22 0 44', ...SW(3) }, 'dark', { stroke: true })
  ],
  simplemente: [
    s('path', { d: 'M122 22c-34 4-66 40-74 92 28-10 68-44 74-92z' }, 'sky', { accent: true }),
    s('path', { d: 'M40 138Q78 86 122 22', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: 'M84 72l-14 2M98 52l-12 0M70 94l-12 6M104 64l6 8M90 86l8 6', ...SW(3) }, 'white', { stroke: true })
  ],
  aun: [
    s('path', { d: 'M80 10v18', ...SW(10) }, 'skin', { stroke: true }),
    s('rect', { x: 72, y: 30, width: 16, height: 12, rx: 2 }, 'dark'),
    s('path', { d: 'M112 52l8-8', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 90, r: 46 }, 'white'),
    s('circle', { cx: 80, cy: 90, r: 46, ...SW(7) }, 'blue', { stroke: true }),
    s('path', { d: 'M80 90V58', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M80 52v6M80 122v6M42 90h6M112 90h6', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 90, r: 5 }, 'dark')
  ],
  cargo: [
    ground(),
    ...person(64, 136, 'green'),
    s('rect', { x: 74, y: 40, width: 58, height: 46, rx: 3 }, 'tan', { accent: true }),
    s('path', { d: 'M74 63h58M103 40v46', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M76 100q14-2 16-14', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M38 64q-4 6 0 9', ...SW(3) }, 'sky', { stroke: true })
  ],
  ellas: [
    ground(),
    ...lady(52, 136, 'pink', { accent: true }),
    ...lady(108, 136, 'purple')
  ],
  experiencia: [
    s('path', { d: 'M14 136 70 42l22 34 16-20 38 80z' }, 'gray'),
    s('path', { d: 'M70 42 56 66l8-4 6 6 8-8 6 2z' }, 'white'),
    s('path', { d: 'M40 130l34-10-20-14 30-12-16-12 10-12', ...SW(3, { 'stroke-dasharray': '5 5' }) }, 'orange', { stroke: true }),
    s('path', { d: 'M70 42V16', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M70 16h22l-6 7 6 7H70z' }, 'red', { accent: true })
  ],
  miembro: [
    ground(),
    ...person(80, 136, 'blue', { w: 40, h: 52 }),
    s('path', { d: 'M68 84l12 22 12-22', ...SW(3) }, 'red', { stroke: true }),
    s('rect', { x: 68, y: 104, width: 24, height: 28, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: star(80, 118, 7) }, 'red')
  ],
  pena: [
    s('circle', { cx: 80, cy: 80, r: 54 }, 'yellow', { accent: true }),
    s('path', { d: dots([[62, 74], [98, 74]], 5) }, 'dark'),
    s('path', { d: 'M50 60l16-6M110 60l-16-6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 114q22-18 44 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M102 86q-7 11 0 15 7-4 0-15z' }, 'blue')
  ],
  'producción': [
    ground(),
    s('path', { d: 'M18 136V86l28 16V86l28 16V86l28 16V52h12V38h12v14h6v84z' }, 'gray'),
    s('path', { d: 'M28 112h12v10H28zM56 112h12v10H56zM84 112h12v10H84z' }, 'yellow', { accent: true }),
    s('rect', { x: 112, y: 104, width: 18, height: 32 }, 'blue'),
    s('path', { d: dots([[124, 26], [136, 18]], 7) }, 'gray')
  ],
  cabo: [
    s('rect', { x: 14, y: 112, width: 132, height: 26, rx: 4 }, 'blue'),
    s('path', { d: 'M14 138V94q20-8 44-6l32 26-4 24z' }, 'green'),
    s('path', { d: 'M36 92l4-50h16l4 50z' }, 'red', { accent: true }),
    s('path', { d: 'M38 78h20M39 60h18', ...SW(6, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('rect', { x: 40, y: 30, width: 16, height: 12 }, 'yellow'),
    s('path', { d: 'M37 30l11-10 11 10z' }, 'dark'),
    s('path', { d: 'M60 36l60-16v32z', opacity: 0.5 }, 'yellow'),
    s('path', { d: 'M96 124q8-6 16 0t16 0', ...SW(3) }, 'white', { stroke: true })
  ],
  'común': [
    ground(),
    ...person(48, 136, 'blue', { h: 34, w: 22, r: 10 }),
    ...person(80, 136, 'green', { h: 34, w: 22, r: 10 }),
    ...person(112, 136, 'red', { h: 34, w: 22, r: 10 }),
    s('path', { d: 'M80 70v10', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 72a56 38 0 0 1 112 0q-9-8-18 0-10-8-19 0-10-8-19 0-10-8-19 0-10-8-19 0-9-8-18 0z' }, 'purple', { accent: true }),
    s('path', { d: 'M30 22l-3 6M64 16l-3 6M100 18l-3 6M132 24l-3 6', ...SW(3) }, 'sky', { stroke: true })
  ],
  'economía': [
    s('path', { d: 'M32 86q-14-4-6-14', ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: 'M52 118v18M98 118v18', ...SW(10) }, 'pink', { stroke: true }),
    s('ellipse', { cx: 76, cy: 94, rx: 46, ry: 32 }, 'pink', { accent: true }),
    s('path', { d: 'M90 66l10-18 8 22z' }, 'pink'),
    s('ellipse', { cx: 124, cy: 96, rx: 10, ry: 12 }, 'red'),
    s('path', { d: dots([[121, 96], [127, 96], [104, 84]], 2.5) }, 'dark'),
    s('path', { d: 'M64 64h22', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 75, cy: 38, r: 13 }, 'yellow'),
    s('circle', { cx: 75, cy: 38, r: 7, ...SW(3) }, 'orange', { stroke: true })
  ],
  espacio: [
    s('circle', { cx: 80, cy: 80, r: 64 }, 'navy'),
    s('circle', { cx: 104, cy: 56, r: 20 }, 'orange'),
    s('ellipse', { cx: 104, cy: 56, rx: 34, ry: 8, transform: 'rotate(-20 104 56)', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M46 112l-10 14h12zM70 112l10 14H68z' }, 'red'),
    s('path', { d: 'M58 66q14 14 14 48H44q0-34 14-48z' }, 'white', { accent: true }),
    s('circle', { cx: 58, cy: 92, r: 6 }, 'sky'),
    s('path', { d: 'M52 116l6 14 6-14z' }, 'orange'),
    s('path', { d: dots([[36, 50], [64, 34], [128, 104], [110, 126], [30, 86]], 2) }, 'white')
  ],
  oportunidad: [
    s('rect', { x: 52, y: 22, width: 68, height: 114 }, 'yellow', { accent: true }),
    s('path', { d: 'M52 136h68l26 10H26z', opacity: 0.6 }, 'yellow'),
    s('rect', { x: 52, y: 22, width: 68, height: 114, ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M52 22 28 34v108l24-6z' }, 'brown'),
    s('circle', { cx: 36, cy: 90, r: 4 }, 'yellow'),
    s('path', { d: 'M86 52v20M76 62h20', ...SW(4) }, 'white', { stroke: true })
  ],
  'organización': [
    s('path', { d: 'M80 46v18M32 64h96M32 64v14M80 64v14M128 64v14M32 104v14M128 104v14', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 58, y: 18, width: 44, height: 28, rx: 6 }, 'blue', { accent: true }),
    s('rect', { x: 14, y: 78, width: 36, height: 26, rx: 6 }, 'green'),
    s('rect', { x: 62, y: 78, width: 36, height: 26, rx: 6 }, 'orange'),
    s('rect', { x: 110, y: 78, width: 36, height: 26, rx: 6 }, 'purple'),
    s('path', { d: 'M20 118h24v18H20zM116 118h24v18h-24z' }, 'sky')
  ],
  resultado: [
    s('path', { d: 'M50 14h22l16 56H68z' }, 'blue'),
    s('path', { d: 'M110 14H88L72 70h20z' }, 'red'),
    s('circle', { cx: 80, cy: 102, r: 34 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 102, r: 24, ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: star(80, 103, 14) }, 'orange')
  ],
  santo: [
    s('ellipse', { cx: 80, cy: 28, rx: 26, ry: 8, ...SW(6) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M80 46c-8 6-22 40-22 62v22h22zM80 46c8 6 22 40 22 62v22H80z' }, 'skin'),
    s('path', { d: 'M80 50v78', ...SW(2) }, 'brown', { stroke: true }),
    s('rect', { x: 50, y: 126, width: 60, height: 16, rx: 4 }, 'purple'),
    s('path', { d: 'M40 48l-10-6M120 48l10-6M38 76H24M122 76h14', ...SW(3) }, 'yellow', { stroke: true })
  ],
  'acción': [
    s('rect', { x: 28, y: 66, width: 104, height: 70, rx: 4 }, 'dark'),
    s('path', { d: 'M40 92h80M40 112h80', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 28, y: 46, width: 104, height: 16, transform: 'rotate(-14 28 62)' }, 'white'),
    s('path', { d: 'M46 46h14l-8 16H38zM78 46h14l-8 16H70zM110 46h14l-8 16h-14z', transform: 'rotate(-14 28 62)' }, 'black', { accent: true }),
    s('rect', { x: 28, y: 46, width: 104, height: 16, transform: 'rotate(-14 28 62)', ...SW(2) }, 'dark', { stroke: true }),
    s('circle', { cx: 28, cy: 63, r: 4 }, 'gray')
  ],
  'condición': [
    s('rect', { x: 22, y: 46, width: 104, height: 68, rx: 10 }, 'white'),
    s('rect', { x: 22, y: 46, width: 104, height: 68, rx: 10, ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 126, y: 66, width: 12, height: 28, rx: 3 }, 'dark'),
    s('path', { d: 'M34 58h18v44H34zM56 58h18v44H56zM78 58h18v44H78z' }, 'green', { accent: true })
  ],
  u: [
    s('circle', { cx: 42, cy: 86, r: 28 }, 'orange', { accent: true }),
    s('path', { d: 'M42 58q8-12 20-8-6 12-20 8z' }, 'green'),
    s('path', { d: 'M92 50 72 120', ...SW(6) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 120, cy: 88, rx: 22, ry: 30 }, 'white'),
    s('ellipse', { cx: 120, cy: 88, rx: 22, ry: 30, ...SW(3) }, 'gray', { stroke: true })
  ],
  valor: [
    s('path', { d: 'M40 64l18-24h44l18 24-40 60z' }, 'blue', { accent: true }),
    s('path', { d: 'M40 64h80M58 40l-4 24M102 40l4 24M54 64l26 60M106 64l-26 60', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M132 28v14M125 35h14M28 104v10M23 109h10', ...SW(3) }, 'yellow', { stroke: true })
  ],
  vivo: [
    s('path', { d: 'M80 94c-34-22-44-42-30-58 10-10 24-8 30 4 6-12 20-14 30-4 14 16 4 36-30 58z' }, 'red', { accent: true }),
    s('ellipse', { cx: 62, cy: 50, rx: 5, ry: 9, opacity: 0.5 }, 'white', { flatOnly: true }),
    s('path', { d: 'M14 124h40l8-14 10 26 10-34 8 22h56', ...SW(5) }, 'green', { stroke: true })
  ],
  calidad: [
    s('rect', { x: 14, y: 56, width: 132, height: 48, rx: 24 }, 'navy'),
    s('path', { d: [32, 56, 80, 104, 128].map(x => star(x, 81, 12)).join('') }, 'yellow', { accent: true }),
    s('path', { d: 'M44 124h72', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M60 36l6 8M100 36l-6 8M80 30v10', ...SW(3) }, 'orange', { stroke: true })
  ],
  causa: [
    ground(),
    s('rect', { x: 26, y: 80, width: 16, height: 56, rx: 2, transform: 'rotate(32 42 136)' }, 'red', { accent: true }),
    s('rect', { x: 58, y: 80, width: 16, height: 56, rx: 2, transform: 'rotate(14 74 136)' }, 'dark'),
    s('rect', { x: 90, y: 80, width: 16, height: 56, rx: 2 }, 'dark'),
    s('rect', { x: 122, y: 80, width: 16, height: 56, rx: 2 }, 'dark'),
    s('path', { d: dots([[98, 96], [98, 120], [130, 96], [130, 120]], 3) }, 'white'),
    arrow('M18 64q14-20 32-14m-10-6 10 6-6 10', 'orange', 4)
  ],
  central: [
    s('path', { d: [21, 63, 105].flatMap(x => [21, 63, 105].map(y => `M${x} ${y}h34v34h-34z`)).join('') }, 'gray'),
    s('rect', { x: 63, y: 63, width: 34, height: 34 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 7 }, 'white'),
    s('path', { d: 'M80 8v8M80 144v8M8 80h8M144 80h8', ...SW(4) }, 'orange', { stroke: true })
  ],
  director: [
    ground(),
    ...person(52, 136, 'navy'),
    s('ellipse', { cx: 50, cy: 68, rx: 15, ry: 6 }, 'red'),
    s('path', { d: 'M66 72h8l34-16v48l-34-16h-8z' }, 'orange', { accent: true }),
    s('path', { d: 'M66 104l10-14', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M118 64l12-6M120 80h14M118 96l12 6', ...SW(3) }, 'gray', { stroke: true })
  ],
  duda: [
    s('path', { d: 'M22 142a34 28 0 0 1 68 0z' }, 'sky'),
    s('circle', { cx: 56, cy: 90, r: 28 }, 'skin'),
    s('path', { d: dots([[48, 86], [66, 86]], 3.5) }, 'dark'),
    s('path', { d: 'M48 104h16', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M98 38a17 17 0 1 1 24 16c-6 3-7 8-7 14', ...SW(8) }, 'orange', { stroke: true, accent: true }),
    s('circle', { cx: 115, cy: 88, r: 6 }, 'orange'),
    s('path', { d: 'M82 70q8-4 4-14', ...SW(7) }, 'skin', { stroke: true })
  ],
  civil: [
    ground(),
    ...person(40, 136, 'blue'),
    ...lady(120, 136, 'pink'),
    ...person(80, 136, 'yellow', { h: 28, w: 20, r: 9, accent: true }),
    s('path', { d: 'M54 106q8 6 16 4M106 106q-8 6-16 4', ...SW(5) }, 'skin', { stroke: true })
  ],
  local: [
    ground(),
    s('rect', { x: 26, y: 70, width: 108, height: 66 }, 'tan'),
    s('path', { d: 'M20 66h120v14q-10 8-20 0-10 8-20 0-10 8-20 0-10 8-20 0-10 8-20 0-10 8-20 0z' }, 'green'),
    s('rect', { x: 38, y: 94, width: 44, height: 28, rx: 2 }, 'sky'),
    s('rect', { x: 94, y: 94, width: 28, height: 42 }, 'brown'),
    s('path', { d: 'M80 58c-10-14-16-20-16-28a16 16 0 0 1 32 0c0 8-6 14-16 28z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 30, r: 6 }, 'white')
  ],
  acerca: [
    s('rect', { x: 34, y: 22, width: 96, height: 116, rx: 6 }, 'blue'),
    s('rect', { x: 34, y: 22, width: 16, height: 116, rx: 4 }, 'navy'),
    s('circle', { cx: 92, cy: 84, r: 24 }, 'red', { accent: true }),
    s('path', { d: 'M92 62q0-10 8-14', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M96 56q8-10 18-6-6 10-18 6z' }, 'green'),
    s('path', { d: 'M64 122h52', ...SW(4) }, 'white', { stroke: true })
  ],
  'acá': [
    ground(),
    ...person(50, 136, 'orange'),
    s('path', { d: 'M64 100l22 12', ...SW(6) }, 'skin', { stroke: true }),
    arrow('M112 60v40m-10-10 10 10 10-10', 'orange', 5),
    s('path', { d: 'M102 116l20 14M122 116l-20 14', ...SW(6) }, 'red', { stroke: true, accent: true })
  ],
  alrededor: [
    s('path', { d: 'M22 82a58 26 0 0 1 116 0', ...SW(4, { 'stroke-dasharray': '7 6' }) }, 'gray', { stroke: true }),
    s('rect', { x: 62, y: 44, width: 36, height: 66, rx: 3 }, 'red', { accent: true }),
    s('circle', { cx: 90, cy: 80, r: 3.5 }, 'yellow'),
    s('path', { d: 'M138 82a58 26 0 0 1-116 0', ...SW(4, { 'stroke-dasharray': '7 6' }) }, 'orange', { stroke: true }),
    s('path', { d: 'M40 98l-14-6 4 14', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M56 110h48', ...SW(4) }, 'brown', { stroke: true })
  ],
  'campaña': [
    s('path', { d: 'M14 30q66 26 132 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 33h18l-9 18zM66 42h18l-9 18zM114 38h18l-9 18z' }, 'red'),
    s('path', { d: 'M42 38h18l-9 18zM90 42h18l-9 18z' }, 'blue'),
    s('path', { d: 'M68 118l-8 24 10-4 6 8 6-28zM92 118l8 24-10-4-6 8-6-28z' }, 'blue'),
    s('circle', { cx: 80, cy: 102, r: 26 }, 'yellow'),
    s('circle', { cx: 80, cy: 102, r: 16 }, 'red', { accent: true })
  ],
  carrera: [
    ground(),
    s('path', { d: 'M128 136V40', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 102, y: 40, width: 26, height: 18 }, 'white'),
    s('path', { d: 'M102 40h6.5v6h-6.5zM115 40h6.5v6H115zM108.5 46h6.5v6h-6.5zM121.5 46h6.5v6h-6.5zM102 52h6.5v6h-6.5zM115 52h6.5v6H115z' }, 'black'),
    s('circle', { cx: 62, cy: 50, r: 11 }, 'skin'),
    s('rect', { x: 52, y: 64, width: 20, height: 36, rx: 7, transform: 'rotate(20 62 82)' }, 'red', { accent: true }),
    s('path', { d: 'M56 98l-14 20H32M62 98l20 14 2 20M52 72 38 84M70 70l14-8', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M18 66h14M14 82h16', ...SW(3) }, 'gray', { stroke: true })
  ],
  'ejército': [
    ground(),
    ...person(40, 136, 'green', { h: 40, w: 24, r: 11 }),
    ...person(80, 136, 'green', { h: 40, w: 24, r: 11, accent: true }),
    ...person(120, 136, 'green', { h: 40, w: 24, r: 11 }),
    s('path', { d: 'M26 84a14 14 0 0 1 28 0zM66 84a14 14 0 0 1 28 0zM106 84a14 14 0 0 1 28 0z' }, 'dark'),
    s('path', { d: 'M56 136V82M96 136V82M136 136V82', ...SW(3) }, 'brown', { stroke: true })
  ],
  'interés': [
    ground(),
    s('rect', { x: 22, y: 108, width: 28, height: 28 }, 'yellow'),
    s('rect', { x: 66, y: 86, width: 28, height: 50 }, 'yellow'),
    s('rect', { x: 110, y: 62, width: 28, height: 74 }, 'yellow', { accent: true }),
    s('path', { d: 'M22 120h28M66 98h28M66 112h28M66 124h28M110 74h28M110 88h28M110 100h28M110 112h28M110 124h28', ...SW(2) }, 'orange', { stroke: true }),
    arrow('M24 90l40-26 20 6 40-46m-14 0h14v14', 'green', 5)
  ],
  objetivo: [
    s('circle', { cx: 72, cy: 88, r: 52 }, 'red'),
    s('circle', { cx: 72, cy: 88, r: 38 }, 'white'),
    s('circle', { cx: 72, cy: 88, r: 24 }, 'red', { accent: true }),
    s('circle', { cx: 72, cy: 88, r: 10 }, 'white'),
    s('path', { d: 'M72 88 134 26', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M130 30h12M130 30V18M122 38h12M122 38V26', ...SW(4) }, 'orange', { stroke: true })
  ],
  principio: [
    s('rect', { x: 14, y: 110, width: 132, height: 28, rx: 4 }, 'mint'),
    s('path', { d: 'M40 110a40 40 0 0 1 80 0z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 58V40M50 70 38 56M110 70l12-14M32 96H16M128 96h16', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M14 110h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  provincia: [
    s('path', { d: 'M30 40l50-14v56H24z' }, 'green'),
    s('path', { d: 'M80 26l52 12-6 46-46-2z' }, 'yellow'),
    s('path', { d: 'M80 82l46 2 10 40-52 10z' }, 'orange', { accent: true }),
    s('path', { d: 'M24 82h56l4 52-48-8z' }, 'sky'),
    s('path', { d: 'M30 40l50-14 52 12-6 46 10 40-52 10-48-8-12-44zM80 26v56M24 82l102 2M80 82l4 52', ...SW(3) }, 'dark', { stroke: true })
  ],
  recurso: [
    s('path', { d: 'M80 16c-14 20-20 30-20 40a20 20 0 0 0 40 0c0-10-6-20-20-40z' }, 'blue', { accent: true }),
    s('rect', { x: 14, y: 100, width: 58, height: 30, rx: 4 }, 'brown'),
    s('ellipse', { cx: 72, cy: 115, rx: 9, ry: 15 }, 'tan'),
    s('path', { d: 'M72 108a6 6 0 1 0 0.1 0', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M88 132l8-24h40l8 24z' }, 'yellow'),
    s('path', { d: 'M100 116h22', ...SW(3) }, 'white', { stroke: true })
  ],
  red: [
    s('path', { d: 'M104 104l36 36', ...SW(9) }, 'brown', { stroke: true }),
    s('path', { d: 'M28.4 46h83.2M22 70h96M28.4 94h83.2M46 28.4v83.2M70 22v96M94 28.4v83.2', ...SW(3) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 70, cy: 70, r: 48, ...SW(6) }, 'dark', { stroke: true })
  ],
  ah: [
    s('circle', { cx: 80, cy: 68, r: 32 }, 'yellow', { accent: true }),
    s('path', { d: 'M62 88h36l-4 20H66z' }, 'yellow'),
    s('path', { d: 'M72 78l4-12 4 12 4-12 4 12', ...SW(3) }, 'orange', { stroke: true }),
    s('rect', { x: 66, y: 106, width: 28, height: 20, rx: 4 }, 'gray'),
    s('path', { d: 'M68 112h24M68 119h24', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 28V16M46 36l-8-8M114 36l8-8M40 68H26M120 68h14', ...SW(4) }, 'orange', { stroke: true }),
    s('ellipse', { cx: 68, cy: 58, rx: 6, ry: 10, opacity: 0.6 }, 'white', { flatOnly: true })
  ],
  aquellos: [
    ground(),
    s('path', { d: 'M74 112q36-30 72-12v12z' }, 'mint'),
    ...person(30, 136, 'blue'),
    s('path', { d: 'M44 100l24-18', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: dots([[100, 82], [116, 78], [132, 82]], 5) }, 'skin'),
    s('path', { d: [100, 116, 132].map((x, i) => `M${x - 5} ${i === 1 ? 104 : 108}v-14a5 5 0 0 1 10 0v14z`).join('') }, 'red', { accent: true }),
    s('path', { d: 'M74 70q10-10 18-2', ...SW(3, { 'stroke-dasharray': '4 5' }) }, 'gray', { stroke: true })
  ],
  'compañía': [
    ground(),
    s('rect', { x: 36, y: 22, width: 56, height: 114 }, 'navy', { accent: true }),
    s('path', { d: [46, 60, 74].flatMap(x => [34, 52, 70, 88, 106].map(y => `M${x} ${y}h8v10h-8z`)).join('') }, 'sky'),
    s('rect', { x: 92, y: 62, width: 40, height: 74 }, 'blue'),
    s('path', { d: [102, 116].flatMap(x => [74, 92, 110].map(y => `M${x} ${y}h8v10h-8z`)).join('') }, 'white'),
    s('rect', { x: 56, y: 118, width: 16, height: 18 }, 'yellow')
  ],
  tratar: [
    s('rect', { x: 14, y: 56, width: 34, height: 52, rx: 8 }, 'blue'),
    s('rect', { x: 40, y: 62, width: 96, height: 40, rx: 20 }, 'skin'),
    s('rect', { x: 58, y: 62, width: 50, height: 40, rx: 10, transform: 'rotate(-25 83 82)' }, 'tan', { accent: true }),
    s('rect', { x: 72, y: 70, width: 22, height: 24, rx: 3, transform: 'rotate(-25 83 82)' }, 'cream'),
    s('path', { d: dots([[64, 76], [66, 88], [100, 76], [102, 88]], 1.8), transform: 'rotate(-25 83 82)' }, 'brown'),
    s('path', { d: 'M118 38q8-14 20-6M126 128q10 6 18-4', ...SW(3) }, 'pink', { stroke: true })
  ]
};
