// Illustration specs for common words, batch 0017 (plus leftovers of 0015 and 0016) (see server/scripts/lexicon/art.js)
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

// Path data: a spiky burst (n points) around cx, cy
const burst = (cx, cy, R, r, n = 10) => Array.from({ length: 2 * n }, (_, i) => {
  const a = (-90 + i * 180 / n) * Math.PI / 180, d = i % 2 ? r : R;
  return `${i ? 'L' : 'M'}${(cx + d * Math.cos(a)).toFixed(1)} ${(cy + d * Math.sin(a)).toFixed(1)}`;
}).join('') + 'z';
// Path data: rectangles [x, y, w, h]
const rects = list => list.map(([x, y, w, h]) => `M${x} ${y}h${w}v${h}h${-w}z`).join('');


// Path data: a heart with its bottom tip at (cx, cy + r) and lobes of radius r / 2
const heart = (cx, cy, r) => `M${cx} ${cy + r}c${-1.4 * r}-${0.85 * r}-${1.6 * r}-${1.5 * r}-${1.6 * r}-${1.9 * r}a${0.8 * r} ${0.8 * r} 0 0 1 ${1.6 * r}-${0.4 * r}a${0.8 * r} ${0.8 * r} 0 0 1 ${1.6 * r} ${0.4 * r}c0 ${0.4 * r}-${0.2 * r} ${1.05 * r}-${1.6 * r} ${1.9 * r}z`;
// A cog: tooth ring (dashed stroke) and body
const gear = (cx, cy, r, teeth, color, opts = {}) => {
  const c = 2 * Math.PI * (r + 4), p = c / teeth;
  return [
    s('circle', { cx, cy, r: r + 4, ...SW(12, { 'stroke-linecap': 'butt', 'stroke-dasharray': `${(p / 2).toFixed(2)} ${(p / 2).toFixed(2)}` }) }, color, { stroke: true }),
    s('circle', { cx, cy, r }, color, opts)
  ];
};
// A wine glass tilted by rot degrees around its foot
const glass = (cx, rot, accent) => {
  const t = { transform: `rotate(${rot} ${cx} 112)` };
  return [
    s('path', { d: `M${cx - 16} 52h32q-2 18-16 20q-14-2-16-20z`, ...t }, 'red', accent ? { accent: true } : {}),
    s('path', { d: `M${cx - 17} 34h34q0 36-17 38q-17-2-17-38zM${cx} 72v38M${cx - 14} 112h28`, ...t, ...SW(4) }, 'gray', { stroke: true })
  ];
};
const backdrop = (color, y = 14, h = 132) => s('rect', { x: 14, y, width: 132, height: h, rx: 12 }, color);
const outline = (attrs, color = 'gray', w = 3) => s(attrs.r ? 'circle' : 'rect', { ...attrs, ...SW(w) }, color, { stroke: true });
// A leaning person: body rotated deg (clockwise) around its feet, head follows
const lean = (cx, foot, deg, color, { h = 44, w = 30, r = 12, accent = false } = {}) => {
  const a = deg * Math.PI / 180, d = h + r + 2;
  return [
    s('circle', { cx: +(cx + d * Math.sin(a)).toFixed(1), cy: +(foot - d * Math.cos(a)).toFixed(1), r }, 'skin'),
    s('rect', { x: cx - w / 2, y: foot - h, width: w, height: h, rx: w / 3, transform: `rotate(${deg} ${cx} ${foot})` }, color, accent ? { accent: true } : {})
  ];
};


// Path data: a closed circle drawn as two arcs (for strokes)
const ring = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
const DASH = (w, d = '6 6') => SW(w, { 'stroke-dasharray': d });

// Path data: n radial strokes between radii r1 and r2 around (cx, cy)
const rays = (cx, cy, r1, r2, n, off = 0) => Array.from({ length: n }, (_, i) => {
  const a = (off + i * 360 / n) * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a);
  return `M${(cx + r1 * c).toFixed(1)} ${(cy + r1 * sn).toFixed(1)}L${(cx + r2 * c).toFixed(1)} ${(cy + r2 * sn).toFixed(1)}`;
}).join('');
// Points on a circle (n of them)
const around = (cx, cy, r, n, off = 0) => Array.from({ length: n }, (_, i) => {
  const a = (off + i * 360 / n) * Math.PI / 180;
  return [+(cx + r * Math.cos(a)).toFixed(1), +(cy + r * Math.sin(a)).toFixed(1)];
});
// Four-pointed sparkle
const sparkle = (x, y, r) => `M${x} ${y - r}l${r * 0.25} ${r * 0.75} ${r * 0.75} ${r * 0.25}-${r * 0.75} ${r * 0.25}-${r * 0.25} ${r * 0.75}-${r * 0.25}-${r * 0.75}-${r * 0.75}-${r * 0.25} ${r * 0.75}-${r * 0.25}z`;
// Brick wall rows (x 18..142, rows of 16 high)
// Path data: ellipses [cx, cy, rx, ry]
const ells = list => list.map(([cx, cy, rx, ry]) => `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0z`).join('');
// Path data: a teardrop of half-width r centred at (x, y)
const drop = (x, y, r) => `M${x} ${y - 1.6 * r}q${r} ${1.2 * r} ${r} ${1.6 * r}a${r} ${r} 0 0 1 ${-2 * r} 0q0 ${-0.4 * r} ${r} ${-1.6 * r}z`;

// Path data: a closed polygon through points
const poly = pts => 'M' + pts.map(p => p.join(' ')).join('L') + 'z';
// Path data: radial strokes over the upper half only (from 180° to 360°)
const halfRays = (cx, cy, r1, r2, n) => Array.from({ length: n }, (_, i) => {
  const a = Math.PI * (1 + i / (n - 1)), c = Math.cos(a), sn = Math.sin(a);
  return `M${(cx + r1 * c).toFixed(1)} ${(cy + r1 * sn).toFixed(1)}L${(cx + r2 * c).toFixed(1)} ${(cy + r2 * sn).toFixed(1)}`;
}).join('');

module.exports = {
  basar: [
    s('rect', { x: 22, y: 110, width: 116, height: 28, rx: 3 }, 'gray', { accent: true }),
    s('path', { d: 'M22 124h116M50 110v14M80 110v14M110 110v14M36 124v14M66 124v14M96 124v14M124 124v14', ...SW(2) }, 'white', { stroke: true }),
    s('rect', { x: 40, y: 64, width: 80, height: 46 }, 'tan'),
    s('path', { d: 'M30 66L80 26l50 40z' }, 'red'),
    s('rect', { x: 70, y: 82, width: 20, height: 28, rx: 2 }, 'brown'),
    s('path', { d: rects([[48, 76, 14, 12], [98, 76, 14, 12]]) }, 'sky')
  ],
  aldea: [
    s('circle', { cx: 128, cy: 34, r: 14 }, 'yellow'),
    s('path', { d: 'M14 112q66-36 132 0v24H14z' }, 'green'),
    s('path', { d: rects([[26, 94, 26, 22], [68, 80, 26, 22], [108, 94, 26, 22]]) }, 'tan'),
    s('path', { d: 'M22 96l17-16 17 16zM64 82l17-16 17 16zM104 96l17-16 17 16z' }, 'red', { accent: true }),
    s('path', { d: rects([[35, 104, 8, 12], [77, 90, 8, 12], [117, 104, 8, 12]]) }, 'brown'),
    s('path', { d: 'M56 136v-14M100 136v-12', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: dots([[56, 118], [100, 120]], 8) }, 'mint')
  ],
  amante: [
    ground(),
    ...person(48, 136, 'blue'),
    ...person(112, 136, 'pink'),
    s('path', { d: 'M62 106q18 8 36 0', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 40, 20) }, 'red', { accent: true }),
    s('path', { d: heart(118, 26, 7) + heart(42, 28, 6) }, 'pink')
  ],
  asistir: [
    s('rect', { x: 30, y: 16, width: 100, height: 60, rx: 4 }, 'dark'),
    s('rect', { x: 36, y: 22, width: 88, height: 48, rx: 2 }, 'sky', { accent: true }),
    s('path', { d: 'M58 46l14 12 30-24', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: busts([40, 80, 120], 146, 30, 30) }, 'navy'),
    s('path', { d: dots([[40, 106], [80, 106], [120, 106]], 12) }, 'skin'),
    s('path', { d: 'M132 120l10-36', ...SW(6) }, 'skin', { stroke: true })
  ],
  'autónomo': [
    s('path', { d: busts([80], 132, 60, 44) }, 'green'),
    s('circle', { cx: 80, cy: 66, r: 18 }, 'skin'),
    s('rect', { x: 44, y: 90, width: 72, height: 42, rx: 4 }, 'gray', { accent: true }),
    s('circle', { cx: 80, cy: 111, r: 6 }, 'white'),
    s('path', { d: 'M30 132h100v6H30z' }, 'dark'),
    s('rect', { x: 124, y: 110, width: 16, height: 22, rx: 3 }, 'red'),
    s('path', { d: 'M140 116h4a5 5 0 0 1 0 10h-4M128 102q4-6 0-12M136 102q4-6 0-12', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M72 66h4M84 66h4M74 74q6 4 12 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  chiste: [
    s('path', { d: 'M30 24h100a12 12 0 0 1 12 12v56a12 12 0 0 1-12 12H72l-26 26v-26H30a12 12 0 0 1-12-12V36a12 12 0 0 1 12-12z' }, 'sky'),
    s('circle', { cx: 80, cy: 64, r: 30 }, 'yellow', { accent: true }),
    s('path', { d: 'M62 58q6-8 12 0M86 58q6-8 12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 70h36a18 18 0 0 1-36 0z' }, 'dark'),
    s('path', { d: 'M70 82a10 6 0 0 1 20 0q-10 6-20 0z' }, 'pink'),
    s('path', { d: drop(52, 70, 4) + drop(108, 70, 4) }, 'blue')
  ],
  'circulación': [
    s('circle', { cx: 80, cy: 80, r: 64 }, 'gray'),
    s('circle', { cx: 80, cy: 80, r: 28 }, 'green'),
    s('path', { d: ring(80, 80, 46), ...DASH(3, '8 7') }, 'white', { stroke: true }),
    s('rect', { x: 66, y: 22, width: 22, height: 13, rx: 4 }, 'red', { accent: true }),
    s('rect', { x: 118, y: 68, width: 13, height: 22, rx: 4 }, 'blue'),
    s('rect', { x: 72, y: 125, width: 22, height: 13, rx: 4 }, 'yellow'),
    s('rect', { x: 29, y: 70, width: 13, height: 22, rx: 4 }, 'orange'),
    s('path', { d: 'M108 40a46 46 0 0 1 14 18M52 120a46 46 0 0 1-14-18', ...SW(4) }, 'dark', { stroke: true })
  ],
  cometido: [
    ground(),
    s('path', { d: 'M40 120q40-50 80-56', ...DASH(4, '6 7') }, 'gray', { stroke: true }),
    ...person(36, 136, 'blue'),
    s('rect', { x: 40, y: 88, width: 26, height: 22, rx: 2 }, 'brown'),
    s('path', { d: 'M40 99h26M53 88v22', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M122 136V30', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M124 30h22l-6 10 6 10h-22z' }, 'red', { accent: true }),
    s('path', { d: star(100, 40, 8) }, 'yellow')
  ],
  comienzo: [
    s('path', { d: 'M40 84h70', ...DASH(6, '10 10') }, 'gray', { stroke: true }),
    arrow('M104 84h36m-14-14l14 14-14 14', 'orange', 8),
    s('path', { d: 'M28 84V30', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 30h34l-8 12 8 12H30z' }, 'green'),
    s('circle', { cx: 28, cy: 84, r: 16 }, 'green', { accent: true }),
    s('circle', { cx: 28, cy: 84, r: 7 }, 'white'),
    s('path', { d: 'M14 120h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  componente: [
    s('rect', { x: 16, y: 24, width: 128, height: 112, rx: 8 }, 'green'),
    s('path', { d: 'M30 42h30v20M130 50h-24M30 116h30v-20M130 118h-24v-14', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M62 58v-8M74 58v-8M86 58v-8M98 58v-8M62 102v8M74 102v8M86 102v8M98 102v8', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 56, y: 58, width: 48, height: 44, rx: 3 }, 'dark', { accent: true }),
    s('circle', { cx: 120, cy: 84, r: 10 }, 'blue'),
    s('rect', { x: 24, y: 74, width: 22, height: 10, rx: 4 }, 'tan'),
    s('path', { d: 'M30 74v10M38 74v10', ...SW(2) }, 'red', { stroke: true })
  ],
  constar: [
    s('rect', { x: 30, y: 16, width: 90, height: 124, rx: 4 }, 'white'),
    outline({ x: 30, y: 16, width: 90, height: 124, rx: 4 }),
    s('path', { d: 'M44 36h62M44 52h62M44 68h50M44 84h62M44 100h30', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 108, cy: 114, r: 22 }, 'red', { accent: true }),
    s('circle', { cx: 108, cy: 114, r: 15, ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M100 114l6 6 10-12', ...SW(4) }, 'white', { stroke: true })
  ],
  desaparecer: [
    s('circle', { cx: 70, cy: 52, r: 16, ...DASH(3, '5 5') }, 'gray', { stroke: true }),
    s('rect', { x: 50, y: 74, width: 40, height: 58, rx: 13, ...DASH(3, '5 5') }, 'gray', { stroke: true }),
    s('path', { d: dots([[110, 90], [124, 80], [124, 102], [138, 92]], 12) }, 'gray'),
    s('path', { d: dots([[98, 116], [110, 126]], 8) }, 'gray'),
    s('path', { d: sparkle(112, 44, 12) + sparkle(36, 104, 9) }, 'purple', { accent: true }),
    s('path', { d: sparkle(136, 60, 6) + sparkle(30, 40, 6) }, 'yellow')
  ],
  descarga: [
    s('path', { d: 'M44 74a22 22 0 0 1 8-42a28 28 0 0 1 52 2a20 20 0 0 1 12 40z' }, 'sky'),
    s('path', { d: 'M80 50v60', ...SW(10) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M58 92l22 24 22-24z' }, 'blue'),
    s('path', { d: 'M30 116v18h100v-18', ...SW(8) }, 'dark', { stroke: true })
  ],
  dibujo: [
    s('rect', { x: 22, y: 22, width: 116, height: 96, rx: 3 }, 'white'),
    outline({ x: 22, y: 22, width: 116, height: 96, rx: 3 }),
    s('circle', { cx: 112, cy: 46, r: 12 }, 'yellow'),
    s('path', { d: 'M30 108l30-40 22 26 14-14 34 28z' }, 'green'),
    s('path', { d: 'M60 68l-8 11h16z' }, 'white'),
    s('path', { d: 'M64 146l60-34', ...SW(10) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M60 148l4-9 6 9z' }, 'dark')
  ],
  'específicamente': [
    s('path', { d: dots([[30, 104], [56, 104], [82, 104], [108, 104], [30, 130], [56, 130], [108, 130], [134, 130], [134, 104]], 9) }, 'gray'),
    s('circle', { cx: 82, cy: 130, r: 13 }, 'red', { accent: true }),
    s('circle', { cx: 82, cy: 130, r: 19, ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M82 92V24', ...SW(8) }, 'blue', { stroke: true }),
    s('path', { d: 'M66 90l16 18 16-18z' }, 'blue')
  ],
  facilitar: [
    s('path', { d: 'M14 82h36l-6 54H14zM110 82h36v54h-30z' }, 'brown'),
    s('path', { d: 'M44 136q36-30 72 0z' }, 'sky'),
    s('rect', { x: 44, y: 80, width: 72, height: 8, rx: 2 }, 'yellow', { accent: true }),
    s('path', { d: 'M56 88v8M72 88v8M88 88v8M104 88v8', ...SW(3) }, 'tan', { stroke: true }),
    ...person(84, 80, 'red', { h: 30, w: 20, r: 9 }),
    arrow('M108 46h24m-8-8l8 8-8 8', 'green', 5)
  ],
  fila: [
    ground(),
    s('rect', { x: 120, y: 92, width: 26, height: 44, rx: 2 }, 'brown'),
    s('path', { d: busts([30, 58, 86], 136, 22, 40) }, 'blue'),
    s('path', { d: busts([108], 136, 22, 40) }, 'red', { accent: true }),
    s('path', { d: dots([[30, 84], [58, 84], [86, 84], [108, 84]], 10) }, 'skin'),
    s('rect', { x: 124, y: 80, width: 18, height: 12, rx: 2 }, 'dark')
  ],
  futbol: [
    backdrop('green'),
    s('path', { d: 'M26 92V30h108v62', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M44 30v62M62 30v62M80 30v62M98 30v62M116 30v62M26 48h108M26 66h108', ...SW(1.5) }, 'mint', { stroke: true }),
    s('circle', { cx: 80, cy: 104, r: 30 }, 'white'),
    s('circle', { cx: 80, cy: 104, r: 30, ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 92l11 8-4 13H73l-4-13zM58 86l7 4-2 10-9 2zM102 86l-7 4 2 10 9 2zM68 132l4-8h16l4 8z' }, 'dark', { accent: true })
  ],
  grito: [
    s('circle', { cx: 80, cy: 82, r: 40 }, 'skin'),
    s('path', { d: dots([[66, 70], [94, 70]], 8) }, 'white'),
    s('path', { d: dots([[66, 70], [94, 70]], 4) }, 'dark'),
    s('ellipse', { cx: 80, cy: 102, rx: 12, ry: 16 }, 'dark', { accent: true }),
    s('path', { d: 'M40 76q-6 20 6 34M120 76q6 20-6 34', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M28 50l-12-8M24 70H10M30 34l-6-14M132 50l12-8M136 70h14M130 34l6-14', ...SW(4) }, 'orange', { stroke: true })
  ],
  'ideología': [
    s('path', { d: 'M38 66a16 16 0 0 1 4-30a24 24 0 0 1 40-12a24 24 0 0 1 40 6a18 18 0 0 1 2 36z' }, 'sky'),
    s('path', { d: star(80, 44, 16) }, 'yellow', { accent: true }),
    s('path', { d: dots([[60, 80], [72, 88]], 4) + dots([[100, 80], [88, 88]], 4) }, 'sky'),
    s('path', { d: busts([40, 80, 120], 146, 30, 32) }, 'purple'),
    s('path', { d: dots([[40, 106], [80, 106], [120, 106]], 12) }, 'skin')
  ],
  'imaginación': [
    s('path', { d: 'M54 58a18 18 0 0 1 6-34a26 26 0 0 1 46-8a22 22 0 0 1 34 20a18 18 0 0 1-8 30H62z' }, 'sky'),
    s('path', { d: 'M70 64a28 28 0 0 1 56 0', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M78 64a20 20 0 0 1 40 0', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M86 64a12 12 0 0 1 24 0', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: dots([[46, 84], [38, 98]], 5) }, 'sky'),
    s('path', { d: busts([40], 148, 44, 26) }, 'green'),
    s('circle', { cx: 40, cy: 112, r: 16 }, 'skin'),
    s('path', { d: sparkle(76, 32, 6) }, 'white')
  ],
  'inflación': [
    s('path', { d: 'M80 116q-4 14 6 28', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 64, r: 48 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 64, r: 36, ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M74 112h12l-6 6z' }, 'orange'),
    s('path', { d: 'M22 60l10-6 6 10M138 60l-10-6-6 10M30 54q-10 14-6 30M130 54q10 14 6 30', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M66 72l10-10 8 8 12-14', ...SW(5) }, 'orange', { stroke: true })
  ],
  integrante: [
    s('circle', { cx: 80, cy: 86, r: 62, ...DASH(3, '6 6') }, 'gray', { stroke: true }),
    s('path', { d: busts([44, 116], 130, 28, 32) + busts([62, 98], 116, 24, 28) }, 'gray'),
    s('path', { d: busts([80], 138, 30, 36) }, 'red', { accent: true }),
    s('path', { d: dots([[44, 90], [116, 90], [62, 78], [98, 78]], 11) }, 'skin'),
    s('circle', { cx: 80, cy: 90, r: 13 }, 'skin'),
    s('path', { d: star(80, 40, 10) }, 'yellow')
  ],
  misterio: [
    backdrop('navy'),
    s('path', { d: ells([[30, 128, 6, 9], [46, 116, 6, 9], [44, 98, 6, 9], [60, 88, 6, 9]]) }, 'gray'),
    s('path', { d: 'M110 110l26 26', ...SW(12) }, 'brown', { stroke: true }),
    s('circle', { cx: 92, cy: 70, r: 32 }, 'sky'),
    s('circle', { cx: 92, cy: 70, r: 32, ...SW(8) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: ells([[84, 76, 6, 9], [100, 62, 6, 9]]) }, 'dark'),
    s('path', { d: star(30, 34, 5) + star(130, 26, 4) }, 'white')
  ],
  occidente: [
    s('path', { d: 'M14 26h132v68H14z' }, 'orange'),
    s('path', { d: 'M48 94a32 32 0 0 1 64 0z' }, 'yellow', { accent: true }),
    s('path', { d: 'M14 94h132v42H14z' }, 'blue'),
    s('path', { d: 'M40 106h24M88 106h32M60 120h40', ...SW(4) }, 'yellow', { stroke: true }),
    arrow('M120 52H28m14-14L28 52l14 14', 'dark', 6)
  ],
  oscuridad: [
    backdrop('black'),
    s('path', { d: 'M126 24a14 14 0 1 0 6 26a12 12 0 0 1-6-26z' }, 'gray'),
    s('path', { d: ells([[62, 86, 12, 9], [98, 86, 12, 9]]) }, 'white', { accent: true }),
    s('path', { d: dots([[64, 87], [100, 87]], 5) }, 'dark'),
    s('path', { d: dots([[30, 40], [50, 28], [100, 34]], 2) }, 'gray')
  ],
  paisaje: [
    s('rect', { x: 14, y: 22, width: 132, height: 116, rx: 6 }, 'sky'),
    s('circle', { cx: 116, cy: 48, r: 12 }, 'yellow'),
    s('path', { d: 'M14 104l36-50 26 30 20-22 50 42v34H14z' }, 'green', { accent: true }),
    s('path', { d: 'M50 54l-9 12h18zM96 62l-7 9h14z' }, 'white'),
    s('path', { d: 'M70 138q10-14 30-20t46 2v18z' }, 'blue'),
    s('path', { d: 'M34 128v-14', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 34, cy: 110, r: 9 }, 'mint'),
    s('rect', { x: 14, y: 22, width: 132, height: 116, rx: 6, ...SW(5) }, 'brown', { stroke: true })
  ],
  pop: [
    s('path', { d: burst(64, 70, 54, 38, 12) }, 'pink'),
    s('circle', { cx: 64, cy: 58, r: 20 }, 'gray', { accent: true }),
    s('path', { d: 'M52 54h24M54 64h20', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 78v32', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M50 120h28', ...SW(6) }, 'dark', { stroke: true }),
    ...note(118, 60, 'purple'),
    ...note(124, 112, 'blue')
  ],
  'redacción': [
    s('rect', { x: 30, y: 16, width: 92, height: 124, rx: 4 }, 'cream'),
    outline({ x: 30, y: 16, width: 92, height: 124, rx: 4 }, 'tan'),
    s('path', { d: 'M30 40h92M30 58h92M30 76h92M30 94h92M30 112h92', ...SW(1.5) }, 'sky', { stroke: true }),
    s('path', { d: 'M48 34h36M40 52h68M40 70h60M40 88q6-6 12 0t12 0t12 0', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M144 52l-56 54', ...SW(10) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M84 100l-6 14 12-6z' }, 'dark')
  ],
  renunciar: [
    s('rect', { x: 92, y: 26, width: 48, height: 110 }, 'brown'),
    s('path', { d: 'M96 30h40v106H96z' }, 'sky'),
    ground(),
    ...person(66, 136, 'navy'),
    s('rect', { x: 46, y: 96, width: 40, height: 28, rx: 2 }, 'tan', { accent: true }),
    s('path', { d: 'M58 96V82M66 96l6-12', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots([[58, 80], [73, 82]], 5) }, 'green'),
    arrow('M106 70h22m-8-8l8 8-8 8', 'orange', 5)
  ],
  sensible: [
    s('circle', { cx: 80, cy: 70, r: 44 }, 'skin'),
    s('path', { d: ells([[62, 66, 10, 12], [98, 66, 10, 12]]) }, 'dark'),
    s('path', { d: dots([[65, 61], [101, 61]], 4) }, 'white'),
    s('path', { d: 'M70 92q10-6 20 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: drop(56, 92, 6) }, 'blue'),
    s('path', { d: heart(80, 132, 14) }, 'pink', { accent: true })
  ],
  sobrevivir: [
    s('circle', { cx: 122, cy: 36, r: 14 }, 'yellow'),
    s('path', { d: 'M14 136v-30l30-16 32 8 30-12 40 18v32z' }, 'gray'),
    s('path', { d: 'M76 98l4 14-6 10 6 14', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M76 112q0-30 4-56', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M80 70q-26-8-30-26q24 0 30 26zM79 62q20-10 26-30q-22 4-26 30z' }, 'green', { accent: true })
  ],
  suizo: [
    s('rect', { x: 14, y: 14, width: 132, height: 90, rx: 10 }, 'sky'),
    s('path', { d: 'M14 104l40-58 28 34 22-24 42 48z' }, 'gray'),
    s('path', { d: 'M54 46l-12 18 8-2 4 6 4-6 8 2zM104 56l-9 10 9 0 8 0z' }, 'white'),
    s('path', { d: 'M30 140l90-32 14 32z' }, 'yellow', { accent: true }),
    s('path', { d: 'M30 140l90-32 14 32z', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: dots([[70, 132], [104, 126], [118, 134]], 5) + dots([[88, 134]], 3) }, 'orange')
  ],
  tristeza: [
    s('path', { d: 'M44 46a16 16 0 0 1 8-28a22 22 0 0 1 40-4a18 18 0 0 1 22 24a12 12 0 0 1-6 8z' }, 'gray'),
    s('path', { d: 'M60 54l-4 10M80 54l-4 10M100 54l-4 10', ...SW(3) }, 'blue', { stroke: true }),
    s('circle', { cx: 80, cy: 102, r: 38 }, 'sky', { accent: true }),
    s('path', { d: 'M58 92q8-6 14 0M88 92q8-6 14 0M64 124q16-14 32 0', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: drop(62, 108, 5) }, 'blue')
  ],
  administrativo: [
    s('rect', { x: 28, y: 22, width: 64, height: 116, rx: 4 }, 'gray'),
    s('path', { d: rects([[34, 28, 52, 32], [34, 64, 52, 32], [34, 100, 52, 32]]) }, 'white'),
    s('path', { d: 'M50 44h20M50 80h20M50 116h20', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 70h18l6 8h24v58H96z' }, 'yellow'),
    s('path', { d: 'M104 62h34v40h-34z' }, 'white'),
    s('path', { d: 'M110 72h22M110 82h22', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 96, y: 92, width: 48, height: 44, rx: 2 }, 'orange', { accent: true })
  ],
  alquiler: [
    s('rect', { x: 18, y: 30, width: 70, height: 106, rx: 3 }, 'tan'),
    s('path', { d: rects([[28, 42, 16, 14], [62, 42, 16, 14], [28, 68, 16, 14], [62, 68, 16, 14], [28, 94, 16, 14]]) }, 'sky'),
    s('rect', { x: 62, y: 110, width: 16, height: 26 }, 'brown'),
    ground(),
    s('circle', { cx: 116, cy: 56, r: 18 }, 'yellow', { accent: true }),
    s('circle', { cx: 116, cy: 56, r: 7 }, 'white'),
    s('path', { d: 'M116 74v48M116 106h12M116 118h8', ...SW(7) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[136, 120]], 9) }, 'orange')
  ],
  apariencia: [
    s('ellipse', { cx: 80, cy: 76, rx: 46, ry: 60 }, 'brown'),
    s('ellipse', { cx: 80, cy: 76, rx: 36, ry: 50 }, 'sky', { accent: true }),
    s('path', { d: busts([80], 126, 40, 28) }, 'pink'),
    s('circle', { cx: 80, cy: 78, r: 18 }, 'skin'),
    s('path', { d: 'M62 74q0-24 18-24t18 24q-6-12-18-12t-18 12z' }, 'dark'),
    s('path', { d: 'M100 40l10 14', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M64 136h32v8H64z' }, 'brown')
  ],
  banca: [
    s('path', { d: 'M20 56L80 22l60 34z' }, 'gray'),
    s('circle', { cx: 80, cy: 44, r: 9 }, 'yellow', { accent: true }),
    s('rect', { x: 26, y: 58, width: 108, height: 8 }, 'gray'),
    s('path', { d: rects([[34, 70, 12, 50], [60, 70, 12, 50], [88, 70, 12, 50], [114, 70, 12, 50]]) }, 'cream'),
    s('path', { d: rects([[34, 70, 12, 50], [60, 70, 12, 50], [88, 70, 12, 50], [114, 70, 12, 50]]), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M22 122h116v8H22zM16 130h128v8H16z' }, 'gray')
  ],
  caos: [
    s('path', { d: 'M30 90q20-60 50-30t-20 40 60-10-30-50 40 20-40 60-50-20 30-50', ...SW(4) }, 'purple', { stroke: true, accent: true }),
    s('rect', { x: 20, y: 20, width: 30, height: 22, rx: 2, transform: 'rotate(-20 35 31)' }, 'yellow'),
    s('rect', { x: 110, y: 110, width: 30, height: 22, rx: 2, transform: 'rotate(25 125 121)' }, 'sky'),
    s('path', { d: 'M118 20l-10 18h10l-8 18', ...SW(4) }, 'orange', { stroke: true }),
    s('circle', { cx: 32, cy: 124, r: 12 }, 'red'),
    s('path', { d: poly([[120, 72], [140, 80], [128, 94]]) + poly([[22, 64], [36, 70], [26, 80]]) }, 'green')
  ],
  censo: [
    s('path', { d: 'M14 72L52 40l38 32z' }, 'red'),
    s('rect', { x: 22, y: 70, width: 60, height: 66 }, 'tan'),
    s('path', { d: busts([38, 66], 136, 18, 26) }, 'blue'),
    s('path', { d: dots([[38, 104], [66, 104]], 9) + dots([[52, 124]], 7) }, 'skin'),
    s('rect', { x: 94, y: 40, width: 50, height: 74, rx: 4 }, 'brown'),
    s('rect', { x: 100, y: 48, width: 38, height: 60, rx: 2 }, 'white', { accent: true }),
    s('path', { d: 'M106 62l4 4 6-8M106 80l4 4 6-8M106 98l4 4 6-8M122 62h10M122 80h10M122 98h10', ...SW(3) }, 'green', { stroke: true })
  ],
  compuesto: [
    s('path', { d: 'M80 80L40 50M80 80l42-26M80 80l-6 50M40 50L26 98', ...SW(7) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 22 }, 'red', { accent: true }),
    s('circle', { cx: 40, cy: 50, r: 16 }, 'blue'),
    s('circle', { cx: 122, cy: 54, r: 16 }, 'blue'),
    s('circle', { cx: 74, cy: 130, r: 13 }, 'yellow'),
    s('circle', { cx: 26, cy: 100, r: 11 }, 'green'),
    s('path', { d: dots([[74, 72], [34, 44]], 4) }, 'white')
  ],
  'crónica': [
    s('rect', { x: 32, y: 22, width: 96, height: 116 }, 'cream'),
    s('path', { d: 'M24 22h112a8 8 0 0 1 0 16H24a8 8 0 0 1 0-16zM24 122h112a8 8 0 0 1 0 16H24a8 8 0 0 1 0-16z' }, 'tan'),
    s('path', { d: 'M56 48v66', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: dots([[56, 56], [56, 80], [56, 104]], 5) }, 'red', { accent: true }),
    s('path', { d: 'M70 56h40M70 80h32M70 104h44', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 130, cy: 38, r: 18 }, 'white'),
    s('path', { d: ring(130, 38, 18) + 'M130 28v10l7 5', ...SW(3) }, 'dark', { stroke: true })
  ],
  'delegación': [
    ground(),
    s('path', { d: 'M126 136V24', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M128 24h20v22h-20z' }, 'blue', { accent: true }),
    ...person(30, 136, 'navy', { h: 40, w: 24, r: 11 }),
    ...person(64, 136, 'navy', { h: 40, w: 24, r: 11 }),
    ...person(98, 136, 'navy', { h: 40, w: 24, r: 11 }),
    s('path', { d: rects([[38, 112, 14, 12], [72, 112, 14, 12], [106, 112, 14, 12]]) }, 'brown')
  ],
  despacho: [
    s('rect', { x: 18, y: 18, width: 40, height: 64, rx: 2 }, 'brown'),
    s('path', { d: rects([[24, 24, 6, 20], [32, 24, 8, 20], [42, 26, 6, 18], [24, 54, 8, 22], [34, 56, 6, 20]]) }, 'red'),
    s('rect', { x: 70, y: 46, width: 56, height: 38, rx: 3 }, 'dark'),
    s('rect', { x: 75, y: 51, width: 46, height: 28 }, 'sky', { accent: true }),
    s('path', { d: 'M98 84v10M86 96h24', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 14, y: 98, width: 132, height: 10, rx: 2 }, 'brown'),
    s('path', { d: 'M24 108v30M136 108v30M138 98l-6-28', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M124 70l20-6v8z' }, 'yellow')
  ],
  despertar: [
    s('path', { d: 'M38 46a18 18 0 0 1 26-14zM122 46a18 18 0 0 0-26-14z' }, 'yellow'),
    s('circle', { cx: 80, cy: 82, r: 44 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 82, r: 34 }, 'white'),
    s('path', { d: 'M80 82V60M80 82l14 10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 124l-8 12M108 124l8 12', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M22 70l-8-4M20 88h-8M138 70l8-4M140 88h8', ...SW(4) }, 'orange', { stroke: true })
  ],
  docente: [
    s('rect', { x: 50, y: 18, width: 96, height: 70, rx: 4 }, 'brown'),
    s('rect', { x: 56, y: 24, width: 84, height: 58, rx: 2 }, 'green', { accent: true }),
    s('path', { d: 'M68 70l14-20 12 12 16-24 18 32', ...SW(3) }, 'white', { stroke: true }),
    ground(),
    ...person(36, 136, 'orange'),
    s('path', { d: 'M48 102l14-18', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M62 84l16-22', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 18, y: 104, width: 18, height: 22, rx: 2 }, 'blue')
  ],
  'documentación': [
    s('rect', { x: 26, y: 30, width: 80, height: 104, rx: 3, transform: 'rotate(-8 66 82)' }, 'white'),
    outline({ x: 26, y: 30, width: 80, height: 104, rx: 3, transform: 'rotate(-8 66 82)' }),
    s('path', { d: 'M40 50h48M42 66h48M44 82h40', ...SW(3), transform: 'rotate(-8 66 82)' }, 'gray', { stroke: true }),
    s('rect', { x: 74, y: 52, width: 58, height: 80, rx: 5 }, 'navy', { accent: true }),
    s('circle', { cx: 103, cy: 86, r: 14, ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M89 86h28M103 72q-8 14 0 28q8-14 0-28', ...SW(2) }, 'yellow', { stroke: true }),
    s('rect', { x: 30, y: 104, width: 52, height: 34, rx: 4 }, 'sky'),
    s('circle', { cx: 44, cy: 118, r: 7 }, 'skin'),
    s('path', { d: 'M56 114h20M56 124h14', ...SW(3) }, 'blue', { stroke: true })
  ],
  eje: [
    s('path', { d: 'M30 80h100', ...SW(10) }, 'gray', { stroke: true }),
    s('rect', { x: 18, y: 40, width: 24, height: 80, rx: 10 }, 'dark'),
    s('rect', { x: 118, y: 40, width: 24, height: 80, rx: 10 }, 'dark'),
    s('path', { d: dots([[30, 80], [130, 80]], 6) }, 'gray'),
    s('circle', { cx: 80, cy: 80, r: 10 }, 'orange', { accent: true }),
    s('path', { d: 'M62 50a24 24 0 0 1 36 0M98 110a24 24 0 0 1-36 0', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M98 50l-2-10-8 6zM62 110l2 10 8-6z' }, 'blue')
  ],
  finanza: [
    s('rect', { x: 18, y: 18, width: 124, height: 84, rx: 6 }, 'navy'),
    s('path', { d: 'M30 88l26-24 20 12 26-30 24 10', ...SW(5) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M30 30v62h102', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: ells([[48, 136, 18, 6], [48, 126, 18, 6], [48, 116, 18, 6], [100, 136, 18, 6], [100, 126, 18, 6]]) }, 'orange'),
    s('path', { d: ells([[48, 114, 18, 6], [100, 124, 18, 6]]) }, 'yellow')
  ],
  fortaleza: [
    s('path', { d: 'M18 60h28v76H18zM114 60h28v76h-28zM18 50h8v10h-8zM32 50h6v10h-6zM40 50h6v10h-6zM114 50h8v10h-8zM128 50h6v10h-6zM136 50h6v10h-6z' }, 'gray'),
    s('path', { d: 'M46 78h68v58H46zM46 70h8v8h-8zM62 70h8v8h-8zM78 70h8v8h-8zM94 70h8v8h-8zM106 70h8v8h-8z' }, 'gray'),
    s('path', { d: 'M66 136v-26a14 14 0 0 1 28 0v26z' }, 'brown', { accent: true }),
    s('path', { d: rects([[26, 80, 10, 14], [124, 80, 10, 14]]) }, 'dark'),
    s('path', { d: 'M32 50V22M128 50V22', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M34 22h18l-5 7 5 7H34zM130 22h18l-5 7 5 7h-18z' }, 'red')
  ],
  ganancia: [
    s('path', { d: 'M58 54q-12-18 4-24l18 8 18-8q16 6 4 24z' }, 'tan'),
    s('path', { d: 'M58 54q-40 30-30 66q4 18 52 18t52-18q10-36-30-66z' }, 'tan', { accent: true }),
    s('path', { d: 'M56 56h48', ...SW(5) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 100, r: 18 }, 'yellow'),
    s('circle', { cx: 80, cy: 100, r: 11, ...SW(3) }, 'orange', { stroke: true }),
    arrow('M130 70V22m-12 12l12-12 12 12', 'green', 7)
  ],
  integral: [
    s('path', { d: 'M22 120q-8-50 58-56q66 6 58 56z' }, 'brown', { accent: true }),
    s('path', { d: 'M46 84l10 14M70 76l10 16M96 78l10 16', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: dots([[40, 104], [62, 112], [88, 104], [114, 110], [104, 94], [52, 94]], 2.5) }, 'cream'),
    s('path', { d: 'M126 64q4-26 4-50', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: ells([[124, 26, 4, 7], [136, 26, 4, 7], [124, 40, 4, 7], [136, 40, 4, 7], [130, 14, 4, 7]]) }, 'yellow'),
    s('path', { d: 'M14 128h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  invertir: [
    s('path', { d: ells([[80, 136, 30, 8], [80, 124, 30, 8], [80, 112, 30, 8]]) }, 'orange'),
    s('ellipse', { cx: 80, cy: 102, rx: 30, ry: 8 }, 'yellow'),
    s('path', { d: 'M80 100V48', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M80 66q-30 0-36-26q28-4 36 26zM80 56q26-4 34-30q-30-2-34 30z' }, 'green', { accent: true }),
    s('path', { d: dots([[40, 26]], 8) + dots([[124, 66]], 6) }, 'yellow')
  ],
  'inútil': [
    s('path', { d: 'M20 70a60 50 0 0 1 120 0z' }, 'purple', { accent: true }),
    s('path', { d: dots([[46, 54], [80, 44], [110, 58]], 8) }, 'white'),
    s('path', { d: 'M80 70v54a10 10 0 0 1-20 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: drop(46, 82, 4) + drop(80, 30, 4) + drop(110, 86, 4) + drop(46, 106, 4) + drop(112, 112, 4) + drop(30, 30, 4) + drop(130, 30, 4) }, 'blue'),
    s('ellipse', { cx: 80, cy: 140, rx: 52, ry: 6 }, 'sky')
  ],
  legado: [
    ground(),
    ...person(44, 136, 'gray', { h: 48 }),
    s('path', { d: 'M30 70a14 14 0 0 1 28 0q-14-6-28 0z' }, 'white'),
    ...person(116, 136, 'green', { h: 32, w: 24, r: 10 }),
    s('path', { d: 'M56 104h12M104 110h-10', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 66, y: 94, width: 30, height: 24, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M66 104h30', ...SW(3) }, 'orange', { stroke: true })
  ],
  panorama: [
    s('rect', { x: 14, y: 14, width: 132, height: 122, rx: 10 }, 'sky'),
    s('path', { d: 'M14 96l22-26 18 16 24-34 22 28 18-18 28 34v12H14z' }, 'gray'),
    s('path', { d: 'M78 52l-8 11h14zM36 70l-6 7h12z' }, 'white'),
    s('path', { d: 'M14 136v-20q60-20 132 0v20z' }, 'green'),
    ...person(80, 112, 'red', { h: 26, w: 18, r: 8, accent: true }),
    s('path', { d: 'M70 70L30 40M90 70l40-30', ...DASH(2, '4 5') }, 'dark', { stroke: true })
  ],
  pastor: [
    ground(),
    ...person(42, 136, 'brown'),
    s('path', { d: 'M62 136V58a10 10 0 0 0-20 0', ...SW(5) }, 'tan', { stroke: true, accent: true }),
    s('path', { d: dots([[96, 108], [110, 100], [124, 104], [134, 114], [102, 120], [118, 120]], 11) }, 'white'),
    s('path', { d: dots([[96, 108], [110, 100], [124, 104], [134, 114], [102, 120], [118, 120]], 11), ...SW(2) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 88, cy: 98, rx: 8, ry: 11 }, 'dark'),
    s('path', { d: 'M104 126v10M126 126v10', ...SW(4) }, 'dark', { stroke: true })
  ],
  pedazo: [
    s('path', { d: 'M80 80L80 22a58 58 0 1 1-50 87z' }, 'orange'),
    s('path', { d: 'M80 80L80 30a50 50 0 1 1-43 75z' }, 'yellow'),
    s('path', { d: dots([[100, 60], [112, 92], [80, 112], [56, 98], [96, 124]], 7) }, 'red'),
    s('path', { d: 'M74 70L30 52a50 50 0 0 1 36-34z' }, 'yellow', { accent: true }),
    s('path', { d: 'M74 70L30 52a50 50 0 0 1 36-34z', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: dots([[52, 44]], 6) }, 'red')
  ],
  permanecer: [
    s('ellipse', { cx: 80, cy: 128, rx: 50, ry: 10 }, 'gray'),
    s('path', { d: 'M80 128L58 60a24 24 0 1 1 44 0z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 50, r: 10 }, 'white'),
    s('path', { d: 'M20 40a20 20 0 0 1 30-14M140 40a20 20 0 0 0-30-14', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M118 104l18-8M42 104l-18-8', ...SW(3) }, 'gray', { stroke: true })
  ],
  'prevención': [
    s('path', { d: 'M80 20l50 18v34q0 40-50 66q-50-26-50-66V38z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 32l38 14v26q0 30-38 52z' }, 'navy'),
    s('path', { d: 'M58 80l16 16 30-32', ...SW(9) }, 'white', { stroke: true })
  ],
  profundamente: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'navy'),
    s('path', { d: 'M14 34h132V24a10 10 0 0 0-10-10H24a10 10 0 0 0-10 10z' }, 'sky'),
    s('path', { d: 'M30 40v90m-8-10l8 10 8-10', ...SW(4) }, 'sky', { stroke: true }),
    s('ellipse', { cx: 90, cy: 100, rx: 16, ry: 9, transform: 'rotate(70 90 100)' }, 'yellow', { accent: true }),
    s('circle', { cx: 95, cy: 120, r: 9 }, 'skin'),
    s('path', { d: 'M84 84l-6-16 6 2zM96 84l8-14-6 0z' }, 'dark'),
    s('path', { d: dots([[110, 70], [118, 54], [114, 40]], 4) }, 'sky')
  ],
  rama: [
    s('path', { d: 'M14 110q50-6 80-30t52-20', ...SW(10) }, 'brown', { stroke: true }),
    s('path', { d: 'M60 102q10-20 30-26M110 74q14-20 30-20', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: ells([[40, 120, 12, 6], [86, 64, 12, 6], [132, 46, 12, 6], [114, 92, 12, 6]]) }, 'green'),
    s('ellipse', { cx: 80, cy: 82, rx: 18, ry: 14 }, 'blue', { accent: true }),
    s('circle', { cx: 92, cy: 70, r: 10 }, 'blue'),
    s('path', { d: 'M100 70l8 2-8 3z' }, 'orange'),
    s('path', { d: dots([[94, 68]], 2) }, 'white')
  ],
  revolucionario: [
    s('path', { d: 'M66 112q-16 16-6 34q10-10 20-12q10 2 20 12q10-18-6-34z' }, 'orange'),
    s('path', { d: 'M80 14q24 22 22 70l-4 30H62l-4-30q-2-48 22-70z' }, 'white'),
    s('path', { d: 'M80 14q24 22 22 70l-4 30H62l-4-30q-2-48 22-70z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 14q14 12 19 30H61q5-18 19-30z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 64, r: 10 }, 'sky'),
    s('path', { d: 'M58 84l-18 30 22-6zM102 84l18 30-22-6z' }, 'red'),
    s('path', { d: sparkle(30, 40, 10) + sparkle(130, 50, 8) }, 'yellow')
  ],
  roto: [
    s('path', { d: 'M76 26a54 54 0 0 0 0 108l-8-26 12-18-10-20 12-22z', transform: 'rotate(-10 76 134)' }, 'sky', { accent: true }),
    s('path', { d: 'M88 26a54 54 0 0 1 0 108l-8-26 12-18-10-20 12-22z', transform: 'rotate(10 88 134)' }, 'sky'),
    s('path', { d: 'M76 44a36 36 0 0 0 0 72', ...SW(4), transform: 'rotate(-10 76 134)' }, 'blue', { stroke: true }),
    s('path', { d: 'M88 44a36 36 0 0 1 0 72', ...SW(4), transform: 'rotate(10 88 134)' }, 'blue', { stroke: true }),
    s('path', { d: poly([[30, 140], [40, 132], [44, 144]]) + poly([[118, 142], [128, 136], [130, 146]]) }, 'blue'),
    s('path', { d: 'M82 20V8M66 24l-6-8M98 24l6-8', ...SW(3) }, 'orange', { stroke: true })
  ],
  signo: [
    s('path', { d: 'M80 70v68', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 28h86l18 18-18 18H28z' }, 'green', { accent: true }),
    arrow('M44 46h60m-14-12l14 12-14 12', 'white', 6),
    s('path', { d: 'M132 82H50l-14 14 14 14h82z' }, 'blue'),
    s('path', { d: 'M60 96h56', ...DASH(4, '8 6') }, 'white', { stroke: true }),
    s('path', { d: 'M56 138h48', ...SW(6) }, 'dark', { stroke: true })
  ],
  sufrimiento: [
    s('path', { d: 'M40 50a16 16 0 0 1 8-28a24 24 0 0 1 44-4a18 18 0 0 1 24 26a12 12 0 0 1-8 6z' }, 'dark'),
    s('path', { d: 'M86 52l-10 16h10l-8 16', ...SW(4) }, 'yellow', { stroke: true, accent: true }),
    ground(),
    s('path', { d: 'M48 136v-24a24 24 0 0 1 48 0v24z' }, 'gray'),
    s('circle', { cx: 72, cy: 96, r: 14 }, 'skin'),
    s('path', { d: 'M56 98q-4-20 16-20M88 98q4-20-16-20', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M66 102q6-4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M50 64l-4 10M110 60l-4 10M60 70l-3 8', ...SW(3) }, 'blue', { stroke: true })
  ],
  visitante: [
    ground(),
    s('rect', { x: 92, y: 90, width: 26, height: 36, rx: 6 }, 'brown'),
    ...person(70, 136, 'sky'),
    s('path', { d: 'M52 72q18-12 36 0z' }, 'yellow'),
    s('path', { d: 'M46 72h48', ...SW(4) }, 'yellow', { stroke: true }),
    s('rect', { x: 58, y: 100, width: 24, height: 16, rx: 3 }, 'dark', { accent: true }),
    s('circle', { cx: 70, cy: 108, r: 5 }, 'sky'),
    s('path', { d: 'M126 50l14 10M120 34l18-4', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M56 98l14-10 14 10', ...SW(2) }, 'dark', { stroke: true })
  ],
  acabado: [
    s('rect', { x: 24, y: 50, width: 104, height: 60, rx: 8 }, 'white'),
    s('rect', { x: 24, y: 50, width: 104, height: 60, rx: 8, ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 128, y: 68, width: 12, height: 24, rx: 3 }, 'dark'),
    s('rect', { x: 32, y: 58, width: 18, height: 44, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M74 124l-10 18M96 124l8 16M60 40l-6-14M100 40l6-14', ...SW(3) }, 'gray', { stroke: true })
  ],
  articular: [
    s('ellipse', { cx: 62, cy: 80, rx: 46, ry: 32 }, 'red', { accent: true }),
    s('ellipse', { cx: 62, cy: 80, rx: 34, ry: 18 }, 'dark'),
    s('path', { d: 'M34 72h56v-6H34z' }, 'white'),
    s('path', { d: 'M42 94q20-12 40 0q-20 8-40 0z' }, 'pink'),
    s('path', { d: 'M118 62a24 24 0 0 1 0 36M130 50a40 40 0 0 1 0 60M142 40a54 54 0 0 1 0 80', ...SW(5) }, 'blue', { stroke: true })
  ],
  bloque: [
    s('path', { d: 'M28 92l26-14 26 14v32l-26 14-26-14z' }, 'red', { accent: true }),
    s('path', { d: 'M28 92l26 14 26-14-26-14z' }, 'pink'),
    s('path', { d: 'M80 92l26-14 26 14v32l-26 14-26-14z' }, 'blue'),
    s('path', { d: 'M80 92l26 14 26-14-26-14z' }, 'sky'),
    s('path', { d: 'M54 50l26-14 26 14v32l-26 14-26-14z' }, 'yellow'),
    s('path', { d: 'M54 50l26 14 26-14-26-14z' }, 'cream'),
    s('path', { d: 'M54 106v32M106 106v32M80 64v32', ...SW(2) }, 'dark', { stroke: true })
  ],
  campamento: [
    s('path', { d: 'M18 132l46-84 46 84z' }, 'orange', { accent: true }),
    s('path', { d: 'M64 48l-14 84h28z' }, 'brown'),
    s('path', { d: 'M64 48l-4-10M64 48l6-10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M116 132l20-14M116 118l20 14', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M126 122q-14-14 0-34q14 20 0 34z' }, 'red'),
    s('path', { d: 'M126 122q-6-8 0-16q6 8 0 16z' }, 'yellow'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots([[30, 26], [120, 20], [140, 50]], 2) }, 'yellow')
  ],
  'clínico': [
    s('rect', { x: 64, y: 22, width: 76, height: 110, rx: 6 }, 'brown'),
    s('rect', { x: 70, y: 32, width: 64, height: 94, rx: 2 }, 'white'),
    s('path', { d: 'M88 22h28v14H88z' }, 'gray'),
    s('path', { d: 'M78 64l10-12 8 22 8-14 6 4h18M80 92h44M80 108h30', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M24 26v30a18 18 0 0 0 36 0V26M42 74v30a22 22 0 0 0 44 0', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 86, cy: 104, r: 12 }, 'gray', { accent: true }),
    s('path', { d: dots([[24, 24], [60, 24]], 5) }, 'gray')
  ],
  condenado: [
    s('rect', { x: 18, y: 18, width: 124, height: 124, rx: 6 }, 'gray'),
    s('path', { d: busts([80], 142, 60, 46) }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 76, r: 20 }, 'skin'),
    s('path', { d: 'M72 76h4M84 76h4M72 88q8-4 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M36 18v124M58 18v124M80 18v124M102 18v124M124 18v124', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 40h124', ...SW(6) }, 'dark', { stroke: true })
  ],
  convenio: [
    s('rect', { x: 40, y: 92, width: 80, height: 52, rx: 3 }, 'white'),
    outline({ x: 40, y: 92, width: 80, height: 52, rx: 3 }),
    s('path', { d: 'M50 108h60M50 120h60M54 134q8-8 14 0t10 0M88 134q8-8 14 0t10 0', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 56l40 10', ...SW(20) }, 'blue', { stroke: true }),
    s('path', { d: 'M146 56l-40 10', ...SW(20) }, 'green', { stroke: true }),
    s('ellipse', { cx: 80, cy: 68, rx: 28, ry: 16 }, 'skin', { accent: true }),
    s('path', { d: 'M66 60l10 14M78 58l10 14M90 60l6 10', ...SW(2) }, 'tan', { stroke: true })
  ],
  creado: [
    s('path', { d: 'M80 36q24 0 22 20q-2 12 14 26q12 18-4 40q-12 12-32 12t-32-12q-16-22-4-40q16-14 14-26q-2-20 22-20z' }, 'orange', { accent: true }),
    s('path', { d: 'M60 36h40v8H60z' }, 'brown'),
    s('path', { d: 'M52 96q28 10 56 0', ...SW(4) }, 'yellow', { stroke: true }),
    s('rect', { x: 30, y: 134, width: 100, height: 10, rx: 4 }, 'gray'),
    s('path', { d: sparkle(30, 50, 12) + sparkle(130, 42, 10) + sparkle(134, 104, 7) }, 'yellow'),
    s('path', { d: 'M24 90a10 10 0 0 0 10 10', ...SW(3) }, 'gray', { stroke: true })
  ],
  cristal: [
    s('path', { d: 'M50 26h60l28 30-58 82-58-82z' }, 'sky', { accent: true }),
    s('path', { d: 'M22 56h116L80 138z' }, 'blue'),
    s('path', { d: 'M50 26l14 30 16-30 16 30 14-30', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M64 56l16 82 16-82', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: sparkle(124, 26, 10) }, 'yellow')
  ],
  disponer: [
    s('rect', { x: 14, y: 70, width: 132, height: 66, rx: 6 }, 'brown'),
    s('circle', { cx: 80, cy: 98, r: 24 }, 'white', { accent: true }),
    s('circle', { cx: 80, cy: 98, r: 16, ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 76v44M34 76v12q6 6 12 0V76M120 76v44', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M120 76q10 10 0 24' }, 'gray'),
    s('path', { d: 'M80 58v-34m-8 26l8 8 8-8', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M74 18q6-8 12 0z' }, 'skin')
  ],
  'elaboración': [
    s('rect', { x: 14, y: 100, width: 132, height: 12, rx: 2 }, 'brown'),
    s('path', { d: 'M24 112v26M136 112v26', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 100V70h50v30zM36 72l29-26 29 26z' }, 'tan'),
    s('circle', { cx: 65, cy: 82, r: 7 }, 'dark'),
    s('path', { d: 'M122 40l-16 30', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 108, y: 28, width: 32, height: 14, rx: 3, transform: 'rotate(28 124 35)' }, 'gray', { accent: true }),
    s('path', { d: 'M100 92h30l-4-8h-22z' }, 'orange'),
    s('path', { d: 'M96 52l-8-6M102 44l-6-10', ...SW(3) }, 'yellow', { stroke: true })
  ],
  estable: [
    s('path', { d: 'M20 136h120l-30-40H50z' }, 'gray'),
    s('rect', { x: 24, y: 70, width: 112, height: 26, rx: 6 }, 'green', { accent: true }),
    s('rect', { x: 62, y: 76, width: 36, height: 14, rx: 7 }, 'mint'),
    s('circle', { cx: 80, cy: 83, r: 5 }, 'white'),
    s('path', { d: 'M74 76v14M86 76v14', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 50h80', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 44v12M120 44v12', ...SW(3) }, 'gray', { stroke: true })
  ],
  estreno: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'navy'),
    s('path', { d: 'M40 14l-14 80h40zM120 14l14 80H94z' }, 'cream'),
    s('path', { d: 'M66 146l6-62h16l6 62z' }, 'red', { accent: true }),
    s('path', { d: 'M46 146v-44M114 146v-44', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M46 102h68', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: star(80, 50, 18) }, 'yellow')
  ],
  exceso: [
    s('path', { d: 'M48 40h64l-8 96H56z' }, 'sky'),
    s('path', { d: 'M48 40h64l-8 96H56z', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M44 42q4-14 36-14t36 14q6 20-2 40M44 42q-6 24 4 50', ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M30 140h100', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: drop(120, 104, 5) + drop(38, 112, 5) + drop(126, 126, 4) }, 'blue'),
    s('ellipse', { cx: 80, cy: 142, rx: 50, ry: 4 }, 'blue')
  ],
  giro: [
    s('path', { d: 'M40 146V70a40 40 0 0 1 80 0v20', ...SW(28) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 146V70a40 40 0 0 1 80 0v20', ...DASH(3, '8 8') }, 'white', { stroke: true }),
    arrow('M120 96v40m-12-12l12 14 12-14', 'orange', 7),
    s('rect', { x: 30, y: 104, width: 20, height: 30, rx: 5 }, 'red', { accent: true }),
    s('path', { d: 'M34 110h12', ...SW(3) }, 'sky', { stroke: true })
  ],
  gratuito: [
    s('rect', { x: 22, y: 66, width: 84, height: 70, rx: 4 }, 'red', { accent: true }),
    s('rect', { x: 16, y: 52, width: 96, height: 18, rx: 4 }, 'pink'),
    s('path', { d: 'M64 52v84', ...SW(10) }, 'yellow', { stroke: true }),
    s('path', { d: 'M64 50q-20-24-28-6q4 10 28 6zM64 50q20-24 28-6q-4 10-28 6z' }, 'yellow'),
    s('path', { d: 'M110 92l18-18h18v36h-18z' }, 'sky'),
    s('circle', { cx: 130, cy: 92, r: 8 }, 'yellow'),
    s('path', { d: 'M120 106l20-28', ...SW(4) }, 'red', { stroke: true })
  ],
  institucional: [
    s('rect', { x: 30, y: 40, width: 100, height: 96 }, 'gray'),
    s('path', { d: rects([[40, 52, 14, 14], [62, 52, 14, 14], [84, 52, 14, 14], [106, 52, 14, 14], [40, 76, 14, 14], [62, 76, 14, 14], [84, 76, 14, 14], [106, 76, 14, 14], [40, 100, 14, 14], [106, 100, 14, 14]]) }, 'sky'),
    s('rect', { x: 66, y: 104, width: 28, height: 32 }, 'navy', { accent: true }),
    s('path', { d: 'M24 34h112v8H24z' }, 'dark'),
    s('path', { d: 'M80 34V12', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 12h22v14H82z' }, 'green'),
    ground()
  ],
  juzgado: [
    s('rect', { x: 24, y: 118, width: 80, height: 18, rx: 4 }, 'brown'),
    s('path', { d: 'M104 112L54 62', ...SW(8) }, 'tan', { stroke: true }),
    s('rect', { x: 34, y: 28, width: 54, height: 30, rx: 6, transform: 'rotate(-45 61 43)' }, 'brown', { accent: true }),
    s('path', { d: 'M61.6 22.4l20 20M40.4 43.6l20 20', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M116 112l14-6M118 124h16M110 100l8-12', ...SW(3) }, 'orange', { stroke: true })
  ],
  liderazgo: [
    ground(),
    ...person(110, 136, 'red', { accent: true }),
    s('path', { d: busts([30, 58], 136, 22, 36) }, 'gray'),
    s('path', { d: dots([[30, 90], [58, 90]], 10) }, 'skin'),
    s('path', { d: 'M122 102l18-30', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: star(110, 46, 12) }, 'yellow'),
    arrow('M30 62h50m-8-8l8 8-8 8', 'orange', 4)
  ],
  longitud: [
    arrow('M22 60h116M34 48L22 60l12 12M126 48l12 12-12 12', 'red', 6),
    s('rect', { x: 18, y: 84, width: 124, height: 30, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M28 84v10M38 84v6M48 84v10M58 84v6M68 84v10M78 84v6M88 84v10M98 84v6M108 84v10M118 84v6M128 84v10', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M22 40v40M138 40v40', ...SW(3) }, 'gray', { stroke: true })
  ],
  'negociación': [
    s('rect', { x: 34, y: 108, width: 92, height: 10, rx: 2 }, 'brown'),
    s('path', { d: 'M44 118v22M116 118v22', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: busts([24], 120, 28, 36) }, 'navy'),
    s('path', { d: busts([136], 120, 28, 36) }, 'green'),
    s('path', { d: dots([[24, 72], [136, 72]], 12) }, 'skin'),
    s('path', { d: 'M40 20h36a8 8 0 0 1 8 8v14a8 8 0 0 1-8 8H54l-10 10V50h-4a8 8 0 0 1-8-8V28a8 8 0 0 1 8-8z' }, 'sky', { accent: true }),
    s('path', { d: 'M84 54h36a8 8 0 0 1 8 8v14a8 8 0 0 1-8 8h-4v10l-10-10H84a8 8 0 0 1-8-8V62a8 8 0 0 1 8-8z' }, 'yellow'),
    arrow('M50 92h20m-6-6l6 6-6 6M110 98H90m6-6l-6 6 6 6', 'orange', 3)
  ],
  placa: [
    s('path', { d: 'M80 16l54 18q0 70-54 110Q26 104 26 34z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 28l42 14q-2 56-42 88q-40-32-42-88z' }, 'orange'),
    s('path', { d: star(80, 74, 26) }, 'yellow'),
    s('circle', { cx: 80, cy: 76, r: 8 }, 'orange')
  ],
  'recepción': [
    s('rect', { x: 14, y: 90, width: 132, height: 48, rx: 4 }, 'brown', { accent: true }),
    s('rect', { x: 14, y: 84, width: 132, height: 10, rx: 3 }, 'tan'),
    s('path', { d: busts([108], 84, 30, 30) }, 'navy'),
    s('circle', { cx: 108, cy: 42, r: 13 }, 'skin'),
    s('path', { d: 'M38 84a14 14 0 0 1 28 0z' }, 'yellow'),
    s('path', { d: 'M52 70v-6M34 84h36', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M24 26h40v34H24z' }, 'gray'),
    s('path', { d: dots([[34, 36], [44, 36], [54, 36], [34, 50], [44, 50], [54, 50]], 3) }, 'yellow')
  ],
  recoger: [
    ground(),
    s('rect', { x: 108, y: 104, width: 34, height: 32, rx: 2 }, 'brown'),
    ...lean(66, 136, 30, 'green'),
    s('path', { d: 'M88 104l8 24', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 98, cy: 128, r: 8 }, 'red', { accent: true }),
    s('path', { d: 'M18 126h14v10H18z' }, 'blue'),
    s('path', { d: star(40, 128, 8) }, 'yellow'),
    s('path', { d: dots([[114, 100], [126, 98]], 7) }, 'purple')
  ],
  refugio: [
    s('path', { d: 'M14 104l36-50 30 34 26-30 40 46v32H14z' }, 'gray'),
    s('path', { d: 'M50 54l-10 14 10-4 10 4zM106 58l-8 10 8-3 8 3z' }, 'white'),
    s('path', { d: 'M14 136v-24q66-14 132 0v24z' }, 'white'),
    s('path', { d: 'M14 136v-24q66-14 132 0v24z', ...SW(2) }, 'sky', { stroke: true }),
    s('rect', { x: 52, y: 96, width: 56, height: 36 }, 'brown', { accent: true }),
    s('path', { d: 'M44 98l36-26 36 26z' }, 'white'),
    s('rect', { x: 64, y: 108, width: 14, height: 12 }, 'yellow'),
    s('path', { d: 'M98 80q-6-10 2-20t0-20', ...SW(4) }, 'gray', { stroke: true })
  ],
  'represión': [
    s('path', { d: 'M40 132h80', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M50 126l60-8M50 116l60-8M50 106l60-8M50 96l60-8', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 40, y: 74, width: 80, height: 10, rx: 3 }, 'dark'),
    s('path', { d: 'M46 74V44a8 8 0 0 1 16 0v-6a8 8 0 0 1 16 0v-2a8 8 0 0 1 16 0v4a8 8 0 0 1 16 0v34z' }, 'skin', { accent: true }),
    s('path', { d: 'M62 44v16M78 40v20M94 42v18', ...SW(2) }, 'tan', { stroke: true }),
    arrow('M28 20v34m-8-8l8 8 8-8M132 20v34m-8-8l8 8 8-8', 'red', 4)
  ],
  sacerdote: [
    s('rect', { x: 18, y: 26, width: 44, height: 110, rx: 4 }, 'cream'),
    s('path', { d: 'M40 40v40M28 54h24', ...SW(6) }, 'yellow', { stroke: true }),
    ground(),
    s('path', { d: 'M84 136l6-60h36l6 60z' }, 'black'),
    s('circle', { cx: 108, cy: 58, r: 14 }, 'skin'),
    s('rect', { x: 100, y: 74, width: 16, height: 6, rx: 2 }, 'white', { accent: true }),
    s('rect', { x: 76, y: 92, width: 24, height: 18, rx: 2 }, 'red')
  ],
  tele: [
    s('rect', { x: 18, y: 26, width: 124, height: 82, rx: 8 }, 'dark'),
    s('rect', { x: 26, y: 34, width: 108, height: 66, rx: 4 }, 'sky', { accent: true }),
    s('path', { d: 'M26 100l34-34 26 26 18-16 30 24z' }, 'green'),
    s('circle', { cx: 112, cy: 52, r: 8 }, 'yellow'),
    s('path', { d: 'M64 108l-8 16M96 108l8 16', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 106, y: 116, width: 16, height: 28, rx: 5, transform: 'rotate(-30 114 130)' }, 'gray'),
    s('path', { d: 'M126 112l8-6M130 120l10-2', ...SW(2) }, 'orange', { stroke: true })
  ],
  territorial: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'mint'),
    s('path', { d: 'M34 50l40-20 46 16 10 48-30 36-50-8-22-36z' }, 'green'),
    s('path', { d: 'M34 50l40-20 46 16 10 48-30 36-50-8-22-36z', ...DASH(4, '8 6') }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M78 104V58', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 58h24l-6 9 6 9H80z' }, 'red'),
    s('ellipse', { cx: 78, cy: 106, rx: 10, ry: 4 }, 'dark')
  ],
  tragedia: [
    s('path', { d: 'M36 30q44-14 88 0q4 60-44 104q-48-44-44-104z' }, 'purple', { accent: true }),
    s('path', { d: 'M52 62q10 6 20 2M88 64q10 4 20-2' , ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[62, 70, 9, 6], [98, 70, 9, 6]]) }, 'dark'),
    s('path', { d: 'M62 108q18-18 36 0q-18-6-36 0z' }, 'dark'),
    s('path', { d: drop(60, 90, 5) + drop(100, 90, 5) }, 'sky'),
    s('path', { d: 'M36 30l-14 4M124 30l14 4', ...SW(3) }, 'red', { stroke: true })
  ],
  venganza: [
    s('path', { d: burst(80, 66, 50, 38, 14) }, 'orange'),
    s('circle', { cx: 80, cy: 66, r: 36 }, 'red', { accent: true }),
    s('path', { d: 'M58 52l16 8M102 52l-16 8M66 86q14-10 28 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[66, 66], [94, 66]], 4) }, 'dark'),
    s('rect', { x: 58, y: 108, width: 44, height: 36, rx: 12 }, 'skin'),
    s('path', { d: 'M69 108v14M80 108v14M91 108v14', ...SW(2) }, 'tan', { stroke: true })
  ],
  vigente: [
    s('rect', { x: 16, y: 34, width: 112, height: 76, rx: 8 }, 'sky'),
    s('circle', { cx: 44, cy: 66, r: 12 }, 'skin'),
    s('path', { d: busts([44], 96, 26, 16) }, 'blue'),
    s('path', { d: 'M68 58h44M68 72h44M68 86h30', ...SW(4) }, 'white', { stroke: true }),
    s('circle', { cx: 120, cy: 112, r: 24 }, 'green', { accent: true }),
    s('path', { d: 'M108 112l8 8 16-16', ...SW(5) }, 'white', { stroke: true })
  ],
  'ácido': [
    s('path', { d: 'M18 104a46 46 0 0 1 92 0z' }, 'yellow', { accent: true }),
    s('path', { d: 'M26 104a38 38 0 0 1 76 0z' }, 'cream'),
    s('path', { d: 'M64 104V70M64 104L38 82M64 104l26-22M64 104L30 98M64 104l34-6', ...SW(2) }, 'yellow', { stroke: true }),
    s('path', { d: 'M110 46h16M114 46v30l-14 26a6 6 0 0 0 6 8h24a6 6 0 0 0 6-8l-14-26V46', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 96h28l6 10a6 6 0 0 1-6 6h-28a6 6 0 0 1-6-6z' }, 'green'),
    s('path', { d: dots([[120, 32], [128, 22]], 4) + drop(40, 128, 5) + drop(80, 128, 5) }, 'green')
  ],
  afectado: [
    s('rect', { x: 14, y: 50, width: 132, height: 96, rx: 10 }, 'sky'),
    s('path', { d: ring(52, 106, 14) + ring(52, 106, 28) + ring(52, 106, 42), ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 52, cy: 40, r: 10 }, 'gray'),
    s('path', { d: 'M52 54v10M46 60l6 6 6-6', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 108h36q0 16-18 16t-18-16z', transform: 'rotate(-14 118 116)' }, 'yellow', { accent: true }),
    s('circle', { cx: 126, cy: 96, r: 9 }, 'yellow'),
    s('path', { d: 'M134 96l8 2-8 4z' }, 'orange'),
    s('path', { d: 'M108 86l-4-8M118 82v-8', ...SW(2) }, 'dark', { stroke: true })
  ],
  biblia: [
    s('rect', { x: 34, y: 20, width: 92, height: 120, rx: 6 }, 'dark', { accent: true }),
    s('path', { d: 'M120 26h10v108h-10z' }, 'cream'),
    s('path', { d: 'M80 44v56M64 60h32', ...SW(7) }, 'yellow', { stroke: true }),
    s('path', { d: 'M40 20v120', ...SW(3) }, 'black', { stroke: true }),
    s('path', { d: 'M100 140v14l6-5 6 5v-14z' }, 'red')
  ],
  candidatura: [
    ground(),
    ...person(44, 136, 'blue'),
    s('path', { d: 'M38 98l6 6 6-6-6-6z' }, 'red'),
    s('path', { d: 'M40 104l-4 14M48 104l4 14', ...SW(3) }, 'red', { stroke: true }),
    s('rect', { x: 86, y: 86, width: 56, height: 50, rx: 3 }, 'navy', { accent: true }),
    s('path', { d: 'M100 86h28', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 104, y: 54, width: 20, height: 28, rx: 2, transform: 'rotate(10 114 68)' }, 'white'),
    outline({ x: 104, y: 54, width: 20, height: 28, rx: 2, transform: 'rotate(10 114 68)' }),
    s('path', { d: 'M108 66l4 4 8-8', ...SW(3), transform: 'rotate(10 114 68)' }, 'green', { stroke: true })
  ],
  censura: [
    s('rect', { x: 22, y: 18, width: 86, height: 120, rx: 4 }, 'white'),
    outline({ x: 22, y: 18, width: 86, height: 120, rx: 4 }),
    s('path', { d: 'M34 36h62M34 68h40M34 100h62M34 124h30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[34, 46, 62, 12], [80, 62, 18, 12], [34, 80, 52, 12], [70, 118, 28, 12]]) }, 'black', { accent: true }),
    s('path', { d: 'M110 66l34 40M144 66l-34 40', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: ring(110, 114, 9) + ring(144, 114, 9), ...SW(5) }, 'red', { stroke: true })
  ],
  conquista: [
    s('path', { d: 'M14 136L70 46l26 40 14-16 36 66z' }, 'gray'),
    s('path', { d: 'M70 46l-12 20 12-4 10 6z' }, 'white'),
    s('path', { d: 'M70 46V14', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M72 14h30l-8 9 8 9H72z' }, 'red', { accent: true }),
    ...person(44, 104, 'blue', { h: 26, w: 18, r: 8 }),
    s('path', { d: 'M50 84l10-12', ...SW(4) }, 'skin', { stroke: true })
  ],
  cuenca: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'mint'),
    s('path', { d: 'M14 70l30-46 30 46zM86 70l30-46 30 46z' }, 'gray'),
    s('path', { d: 'M30 60q20 30 40 46M130 60q-20 30-40 46M80 46v54', ...SW(5) }, 'blue', { stroke: true }),
    s('ellipse', { cx: 80, cy: 118, rx: 48, ry: 20 }, 'blue', { accent: true }),
    s('path', { d: 'M24 24l14 22H10zM116 24l10 16h-20z' }, 'white'),
    s('path', { d: 'M60 118h20M86 126h14', ...SW(3) }, 'sky', { stroke: true })
  ],
  'desaparición': [
    s('path', { d: 'M54 14h52v10H54z' }, 'red'),
    s('rect', { x: 28, y: 20, width: 104, height: 124, rx: 3 }, 'cream'),
    outline({ x: 28, y: 20, width: 104, height: 124, rx: 3 }, 'tan'),
    s('rect', { x: 42, y: 34, width: 76, height: 64 }, 'gray'),
    s('path', { d: busts([80], 98, 46, 26) + dots([[80, 60]], 14) }, 'dark', { accent: true }),
    s('path', { d: 'M44 112h72M44 126h48', ...SW(5) }, 'tan', { stroke: true }),
    s('circle', { cx: 80, cy: 18, r: 5 }, 'red')
  ],
  dudar: [
    ground(),
    s('path', { d: 'M80 136V40', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M76 34H28l-12 10 12 10h48z' }, 'blue'),
    s('path', { d: 'M84 50h48l12 10-12 10H84z' }, 'green'),
    ...person(110, 136, 'orange', { h: 40, w: 26, r: 11, accent: true }),
    s('path', { d: 'M100 100q-6-14 2-24', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M40 82a8 8 0 1 1 8 8M128 82a8 8 0 1 1 8 8', ...SW(3) }, 'gray', { stroke: true })
  ],
  'emisión': [
    s('path', { d: 'M80 52l-26 88M80 52l26 88M64 104h32M58 124h44', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 46, r: 10 }, 'red', { accent: true }),
    s('path', { d: 'M60 26a28 28 0 0 0 0 40M100 26a28 28 0 0 1 0 40', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M42 14a50 50 0 0 0 0 64M118 14a50 50 0 0 1 0 64', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M40 140h80', ...SW(4) }, 'dark', { stroke: true })
  ],
  extremadamente: [
    s('path', { d: burst(80, 30, 20, 10, 10) }, 'yellow'),
    s('rect', { x: 66, y: 30, width: 28, height: 86, rx: 14 }, 'white'),
    s('rect', { x: 66, y: 30, width: 28, height: 86, rx: 14, ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 116V40', ...SW(12) }, 'red', { stroke: true }),
    s('circle', { cx: 80, cy: 124, r: 20 }, 'red', { accent: true }),
    s('path', { d: 'M100 50h12M100 70h12M100 90h12', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: drop(126, 110, 6) + drop(36, 92, 6) }, 'sky')
  ],
  finalidad: [
    s('circle', { cx: 74, cy: 86, r: 58 }, 'red'),
    s('circle', { cx: 74, cy: 86, r: 42 }, 'white'),
    s('circle', { cx: 74, cy: 86, r: 26 }, 'red'),
    s('circle', { cx: 74, cy: 86, r: 11 }, 'white'),
    s('path', { d: 'M74 86l58-58', ...SW(5) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M128 22l14-6-4 16zM132 32l14 0-10 10z' }, 'yellow')
  ],
  fruto: [
    s('path', { d: 'M18 96h124q-6 44-62 44T18 96z' }, 'brown', { accent: true }),
    s('circle', { cx: 52, cy: 82, r: 22 }, 'red'),
    s('path', { d: 'M104 54q16 0 14 22q12 10 6 24q-8 8-20 8t-20-8q-6-14 6-24q-2-22 14-22z' }, 'green'),
    s('path', { d: dots([[80, 90], [70, 98], [90, 98], [80, 104], [74, 84], [86, 84]], 7) }, 'purple'),
    s('path', { d: 'M52 60v-10M104 54v-10', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M56 52q10-10 18-2q-10 8-18 2z' }, 'green')
  ],
  guitarra: [
    s('path', { d: 'M62 82q-24 6-22 30t40 26q38-2 40-26t-22-30q14-12 6-28t-24-16q-16 0-24 16t6 28z' }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 96, r: 10 }, 'dark'),
    s('path', { d: 'M80 70V14', ...SW(10) }, 'brown', { stroke: true }),
    s('rect', { x: 72, y: 8, width: 16, height: 18, rx: 3 }, 'dark'),
    s('rect', { x: 66, y: 118, width: 28, height: 6, rx: 2 }, 'dark'),
    s('path', { d: 'M77 26v92M83 26v92', ...SW(1) }, 'white', { stroke: true })
  ],
  ignorancia: [
    s('path', { d: 'M90 46a12 12 0 0 1 4-22a18 18 0 0 1 32-4a14 14 0 0 1 14 22a10 10 0 0 1-8 4z' }, 'white'),
    s('path', { d: 'M90 46a12 12 0 0 1 4-22a18 18 0 0 1 32-4a14 14 0 0 1 14 22a10 10 0 0 1-8 4z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[86, 58]], 4) + dots([[80, 66]], 3) }, 'gray'),
    ground(),
    ...person(60, 136, 'yellow', { accent: true }),
    s('path', { d: 'M44 100l-14-10-6-16M76 100l14-10 6-16', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M54 76h4M62 76h4M54 86h12', ...SW(2) }, 'dark', { stroke: true })
  ],
  incidente: [
    s('path', { d: burst(80, 82, 30, 16, 10) }, 'yellow', { accent: true }),
    s('path', { d: 'M18 88l8-18h32l12 18v18H18z', transform: 'rotate(8 44 92)' }, 'red'),
    s('path', { d: 'M142 88l-8-18h-32l-12 18v18h52z', transform: 'rotate(-8 116 92)' }, 'blue'),
    s('path', { d: dots([[30, 112], [56, 114], [104, 114], [130, 112]], 9) }, 'dark'),
    s('path', { d: 'M76 32l-4-12M90 34l6-12M60 38l-8-8', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M14 128h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  independientemente: [
    s('path', { d: 'M30 140l14-60M44 140l2-60M58 140l-10-60', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: ells([[30, 66, 14, 18], [62, 62, 14, 18]]) }, 'blue'),
    s('ellipse', { cx: 46, cy: 76, rx: 14, ry: 18 }, 'yellow'),
    s('path', { d: 'M118 74q-6 20 6 40', ...SW(2) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 116, cy: 52, rx: 16, ry: 20 }, 'red', { accent: true }),
    s('path', { d: 'M114 72l2 4 2-4z' }, 'red'),
    arrow('M138 32l6-14m-10 4l10-4 2 10', 'orange', 3)
  ],
  'inscripción': [
    s('path', { d: 'M24 140V44a42 30 0 0 1 84 0v96z' }, 'gray', { accent: true }),
    s('path', { d: 'M44 60h44M40 78h52M40 96h52M40 114h36', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M118 52l-22 34', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M126 40l-8 12', ...SW(10) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 94l-8 2 2-8M110 100l-4 6', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M14 140h132', ...SW(4) }, 'brown', { stroke: true })
  ],
  'inspiración': [
    s('path', { d: halfRays(80, 50, 40, 52, 7), ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 44, r: 26 }, 'yellow', { accent: true }),
    s('rect', { x: 70, y: 66, width: 20, height: 12, rx: 3 }, 'gray'),
    s('path', { d: 'M72 50l8 8 8-8', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: busts([80], 148, 56, 36) }, 'blue'),
    s('circle', { cx: 80, cy: 100, r: 18 }, 'skin')
  ],
  'invitación': [
    s('path', { d: 'M40 34h80v60H40z' }, 'cream'),
    s('path', { d: 'M40 34h80v60H40z', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: heart(80, 52, 10) }, 'pink'),
    s('path', { d: 'M54 76h52', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M22 70l58 36 58-36v70H22z' }, 'red', { accent: true }),
    s('path', { d: 'M22 140l46-40M138 140l-46-40', ...SW(3) }, 'pink', { stroke: true }),
    s('circle', { cx: 80, cy: 108, r: 9 }, 'yellow')
  ],
  'mención': [
    ground(),
    ...person(36, 136, 'green'),
    s('path', { d: 'M62 22h74a10 10 0 0 1 10 10v44a10 10 0 0 1-10 10H82l-18 16V86h-2a10 10 0 0 1-10-10V32a10 10 0 0 1 10-10z' }, 'sky'),
    s('path', { d: busts([100], 80, 30, 22) }, 'red', { accent: true }),
    s('circle', { cx: 100, cy: 46, r: 10 }, 'skin'),
    s('path', { d: star(128, 36, 7) }, 'yellow')
  ],
  milagro: [
    s('path', { d: 'M38 50a16 16 0 0 1 8-28a22 22 0 0 1 40-6a20 20 0 0 1 32 4a16 16 0 0 1 4 30z' }, 'white'),
    s('path', { d: 'M38 50a16 16 0 0 1 8-28a22 22 0 0 1 40-6a20 20 0 0 1 32 4a16 16 0 0 1 4 30z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M50 52l-24 84h108l-24-84z' }, 'yellow', { accent: true }),
    s('path', { d: sparkle(80, 96, 22) }, 'white'),
    s('path', { d: sparkle(48, 116, 8) + sparkle(114, 72, 8) + sparkle(116, 124, 6) }, 'orange')
  ],
  nena: [
    ground(),
    s('path', { d: 'M80 104l-24 32h48z' }, 'pink', { accent: true }),
    s('path', { d: dots([[60, 66], [100, 66]], 10) }, 'brown'),
    s('circle', { cx: 80, cy: 72, r: 20 }, 'skin'),
    s('path', { d: 'M60 66a20 20 0 0 1 40 0q-20-14-40 0z' }, 'brown'),
    s('path', { d: 'M74 90h12v16H74z' }, 'skin'),
    s('path', { d: dots([[73, 74], [87, 74]], 2.5) }, 'dark'),
    s('path', { d: 'M74 82q6 4 12 0', ...SW(2) }, 'red', { stroke: true }),
    s('path', { d: 'M52 56l8-6v12zM108 56l-8-6v12z' }, 'red')
  ],
  nosotras: [
    ground(),
    ...lady(36, 136, 'pink'),
    ...lady(80, 136, 'purple', { accent: true }),
    ...lady(124, 136, 'orange')
  ],
  notable: [
    s('path', { d: 'M14 136q10-14 0-20M30 136q8-14 2-22M48 136q6-12 0-20M112 136q8-14 2-22M130 136q6-12 0-20M146 136q-6-12 0-20', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M80 136V62', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M80 100q-20-2-24-16q18 0 24 16z' }, 'green'),
    s('path', { d: dots([[68, 46], [92, 46], [80, 34], [80, 58], [70, 56], [90, 56], [70, 36], [90, 36]], 9) }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 46, r: 8 }, 'yellow'),
    s('path', { d: halfRays(80, 46, 30, 40, 5), ...SW(3) }, 'yellow', { stroke: true })
  ],
  'océano': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'sky'),
    s('path', { d: 'M14 70h132v66a10 10 0 0 1-10 10H24a10 10 0 0 1-10-10z' }, 'blue', { accent: true }),
    s('path', { d: 'M14 70q11-8 22 0t22 0 22 0 22 0 22 0 22 0M20 100q10-6 20 0t20 0M90 120q10-6 20 0t20 0', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M70 70q-4-22 12-30q-16 2-24-8q4 14 0 22q4-2 12 16z' }, 'navy'),
    s('path', { d: 'M76 40q6-12 18-12q-4 10-14 14z' }, 'navy'),
    s('circle', { cx: 118, cy: 36, r: 12 }, 'yellow')
  ],
  'regulación': [
    s('rect', { x: 14, y: 26, width: 132, height: 108, rx: 10 }, 'dark'),
    s('path', { d: 'M42 42v76M80 42v76M118 42v76', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 30, y: 58, width: 24, height: 12, rx: 3 }, 'red', { accent: true }),
    s('rect', { x: 68, y: 92, width: 24, height: 12, rx: 3 }, 'yellow'),
    s('rect', { x: 106, y: 70, width: 24, height: 12, rx: 3 }, 'green'),
    s('path', { d: 'M42 70v48M80 104v14M118 82v36', ...SW(5) }, 'sky', { stroke: true })
  ],
  romero: [
    s('path', { d: 'M60 140Q74 80 96 20M70 104q20-20 50-30', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: Array.from({ length: 10 }, (_, i) => { const y = 120 - i * 10, x = 64 + i * 3.4; return `M${x} ${y}l-14-6M${x} ${y}l14-8`; }).join(''), ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M88 96l2-12M100 90l2-12M112 82l4-12M84 104l-4-10M96 98l-2-12', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots([[98, 22], [90, 30], [104, 34]], 4) }, 'purple')
  ],
  'suspensión': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'sky'),
    s('path', { d: 'M14 120h132v16a10 10 0 0 1-10 10H24a10 10 0 0 1-10-10z' }, 'blue'),
    s('path', { d: 'M40 30v80M120 30v80', ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M14 70q26 0 26-40q0 54 40 54t40-54q0 40 26 40', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 92v-28M66 92v-14M80 92v-8M94 92v-14M108 92v-28', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 14, y: 92, width: 132, height: 8 }, 'gray')
  ],
  terrorismo: [
    s('circle', { cx: 72, cy: 92, r: 42 }, 'black', { accent: true }),
    s('rect', { x: 60, y: 42, width: 24, height: 14, rx: 2 }, 'dark'),
    s('path', { d: 'M72 42q4-20 26-20', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: burst(106, 20, 12, 5, 8) }, 'orange'),
    s('path', { d: 'M52 76a24 24 0 0 1 16-12', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M118 64l14-6M120 82h16M110 48l8-10', ...SW(4) }, 'red', { stroke: true })
  ],
  vital: [
    s('path', { d: heart(80, 76, 44) }, 'red', { accent: true }),
    s('path', { d: 'M14 84h36l8-18 12 40 12-50 10 28h54', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M50 50q6-10 16-10', ...SW(4) }, 'pink', { stroke: true })
  ],
  adquirir: [
    s('path', { d: 'M40 58h80l8 84H32z' }, 'orange', { accent: true }),
    s('path', { d: 'M62 58V46a18 18 0 0 1 36 0v12', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 62, y: 36, width: 36, height: 30, rx: 3 }, 'blue'),
    s('path', { d: 'M68 46h24', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: heart(80, 100, 12) }, 'white'),
    arrow('M138 30v40m-10-10l10 10 10-10', 'green', 5)
  ],
  altamente: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'sky'),
    s('path', { d: 'M18 130a14 14 0 0 1 14-14a20 20 0 0 1 36 0a14 14 0 0 1 12 14zM96 110a12 12 0 0 1 12-12a16 16 0 0 1 30 0v12z' }, 'white'),
    s('path', { d: 'M100 24l20 20-20 20-20-20z' }, 'red', { accent: true }),
    s('path', { d: 'M100 64q-30 30-10 50t-40 30', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 24v40M80 44h40', ...SW(2) }, 'yellow', { stroke: true }),
    arrow('M30 90V30m-10 10l10-10 10 10', 'navy', 5)
  ],
  ave: [
    s('ellipse', { cx: 80, cy: 88, rx: 40, ry: 30 }, 'orange'),
    s('circle', { cx: 112, cy: 58, r: 20 }, 'orange'),
    s('path', { d: 'M130 56l16 4-16 6z' }, 'yellow'),
    s('circle', { cx: 116, cy: 54, r: 4 }, 'dark'),
    s('path', { d: 'M40 70q30-50 60-2q-30 34-60 2z' }, 'brown', { accent: true }),
    s('path', { d: 'M42 92l-26 6 24 12z' }, 'brown'),
    s('path', { d: 'M74 116v20M90 116v20M68 136h12M84 136h12', ...SW(3) }, 'yellow', { stroke: true })
  ],
  bordo: [
    s('path', { d: 'M14 120h132v26H14z' }, 'blue'),
    s('path', { d: 'M70 60h76v34q-10 26-40 30H70z' }, 'navy', { accent: true }),
    s('path', { d: 'M70 60h76v8H70z' }, 'red'),
    s('path', { d: dots([[90, 82], [112, 82], [134, 82]], 6) }, 'white'),
    s('path', { d: 'M14 112l58-46', ...SW(6) }, 'tan', { stroke: true }),
    ...person(44, 88, 'orange', { h: 26, w: 18, r: 8 }),
    s('path', { d: 'M20 112l-6 8h20z' }, 'gray')
  ],
  cancha: [
    s('rect', { x: 14, y: 26, width: 132, height: 108, rx: 4 }, 'orange'),
    s('path', { d: 'M18 30h124v100H18zM80 30v100', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: ring(80, 80, 16) + 'M18 56h22v48H18M142 56h-22v48h22', ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 110, cy: 46, r: 12 }, 'red', { accent: true }),
    s('path', { d: 'M98 46h24M110 34v24', ...SW(2) }, 'dark', { stroke: true })
  ],
  causar: [
    s('path', { d: 'M14 128h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 72l8-2 12 58h-10z' }, 'skin'),
    s('rect', { x: 36, y: 74, width: 14, height: 54, rx: 2, transform: 'rotate(18 50 128)' }, 'red', { accent: true }),
    s('path', { d: rects([[62, 74, 14, 54], [86, 74, 14, 54], [110, 74, 14, 54]]) }, 'dark'),
    s('path', { d: dots([[69, 90], [69, 112], [93, 90], [93, 112], [117, 90], [117, 112]], 3) }, 'white'),
    arrow('M64 50h60m-10-10l10 10-10 10', 'orange', 5)
  ],
  circuito: [
    s('path', { d: 'M40 30h80a26 26 0 0 1 0 52H90a14 14 0 0 0 0 28h30a20 20 0 0 1 0 40H40a26 26 0 0 1-26-26V56a26 26 0 0 1 26-26z' }, 'dark'),
    s('path', { d: 'M40 44h80a12 12 0 0 1 0 24H90a28 28 0 0 0 0 56h30a6 6 0 0 1 0 12H40a12 12 0 0 1-12-12V56a12 12 0 0 1 12-12z' }, 'green'),
    s('path', { d: 'M40 37h80a19 19 0 0 1 0 38H90a21 21 0 0 0 0 42h30a13 13 0 0 1 0 26H40a19 19 0 0 1-19-19V56a19 19 0 0 1 19-19z', ...DASH(2, '6 6') }, 'white', { stroke: true }),
    s('rect', { x: 50, y: 136, width: 22, height: 12, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M28 92h12', ...SW(4) }, 'white', { stroke: true })
  ],
  circular: [
    s('path', { d: 'M38 70a44 44 0 0 1 80-24', ...SW(10) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M108 32l20 18-26 6z' }, 'blue'),
    s('path', { d: 'M122 90a44 44 0 0 1-80 24', ...SW(10) }, 'green', { stroke: true }),
    s('path', { d: 'M52 128l-20-18 26-6z' }, 'green'),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'yellow')
  ],
  cobre: [
    s('rect', { x: 34, y: 40, width: 92, height: 80, rx: 8 }, 'orange', { accent: true }),
    s('path', { d: 'M40 50h80M40 62h80M40 74h80M40 86h80M40 98h80M40 110h80', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: ells([[34, 80, 10, 44], [126, 80, 10, 44]]) }, 'brown'),
    s('path', { d: dots([[34, 80], [126, 80]], 5) }, 'tan'),
    s('path', { d: 'M126 110q14 20 0 34', ...SW(4) }, 'orange', { stroke: true })
  ],
  comprobar: [
    s('rect', { x: 20, y: 20, width: 80, height: 112, rx: 4 }, 'white'),
    outline({ x: 20, y: 20, width: 80, height: 112, rx: 4 }),
    s('path', { d: 'M32 42l5 5 9-10M32 72l5 5 9-10M32 102l5 5 9-10', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M54 42h34M54 72h34M54 102h30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M120 112l22 22', ...SW(12) }, 'brown', { stroke: true }),
    s('circle', { cx: 100, cy: 92, r: 26 }, 'sky', { accent: true }),
    s('circle', { cx: 100, cy: 92, r: 26, ...SW(7) }, 'dark', { stroke: true })
  ],
  correa: [
    ground(),
    ...person(40, 136, 'blue'),
    s('path', { d: 'M52 100q30 0 52 4', ...SW(3) }, 'red', { stroke: true, accent: true }),
    s('ellipse', { cx: 116, cy: 116, rx: 22, ry: 12 }, 'brown'),
    s('circle', { cx: 132, cy: 98, r: 11 }, 'brown'),
    s('path', { d: 'M100 124v12M108 126v10M124 126v10M132 124v12M96 112l-10-8M136 92l6-10', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M104 104h20', ...SW(4) }, 'red', { stroke: true })
  ],
  cruel: [
    s('circle', { cx: 64, cy: 74, r: 46 }, 'purple', { accent: true }),
    s('path', { d: 'M38 56l18 10M90 56l-18 10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[50, 74], [78, 74]], 5) }, 'dark'),
    s('path', { d: 'M40 92q24 20 48 0z' }, 'dark'),
    s('path', { d: 'M48 94l4 6 4-6M72 94l4 6 4-6' }, 'white'),
    s('path', { d: heart(124, 116, 18) }, 'red'),
    s('path', { d: 'M124 88l-6 10 8 8-6 14', ...SW(3) }, 'white', { stroke: true })
  ],
  difundir: [
    s('path', { d: 'M24 70h18l40-26v72L42 90H24z' }, 'red', { accent: true }),
    s('rect', { x: 30, y: 90, width: 10, height: 20, rx: 3 }, 'dark'),
    s('path', { d: 'M94 66a20 20 0 0 1 0 28M106 54a36 36 0 0 1 0 52M118 42a52 52 0 0 1 0 76', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: dots([[138, 30], [144, 80], [138, 130], [126, 20], [128, 140]], 4) }, 'blue')
  ],
  'dinámica': [
    s('circle', { cx: 80, cy: 78, r: 56 }, 'dark'),
    s('path', { d: 'M80 78V26a52 52 0 0 1 45 26zM80 78l45 26a52 52 0 0 1-45 26zM80 78v52a52 52 0 0 1-45-26z' }, 'yellow'),
    s('path', { d: 'M80 78l45-26a52 52 0 0 1 0 52zM80 78l-45 26a52 52 0 0 1 0-52z' }, 'pink'),
    s('path', { d: 'M80 78L35 52a52 52 0 0 1 45-26z' }, 'sky'),
    s('circle', { cx: 80, cy: 78, r: 10 }, 'white'),
    s('path', { d: 'M70 140h20l-10-14z' }, 'red', { accent: true }),
    s('path', { d: 'M20 20a76 76 0 0 1 30-8M140 20a76 76 0 0 0-30-8', ...SW(4) }, 'orange', { stroke: true })
  ],
  disciplina: [
    s('rect', { x: 18, y: 24, width: 96, height: 92, rx: 6 }, 'white'),
    outline({ x: 18, y: 24, width: 96, height: 92, rx: 6 }),
    s('rect', { x: 18, y: 24, width: 96, height: 18, rx: 6 }, 'red'),
    s('path', { d: 'M28 56l4 4 6-8M50 56l4 4 6-8M72 56l4 4 6-8M94 56l4 4 6-8M28 78l4 4 6-8M50 78l4 4 6-8M72 78l4 4 6-8M94 78l4 4 6-8M28 100l4 4 6-8M50 100l4 4 6-8', ...SW(3) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M100 136h40', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: rects([[96, 122, 10, 28], [134, 122, 10, 28]]) }, 'dark')
  ],
  'discriminación': [
    ground(),
    s('path', { d: busts([28, 54, 80], 136, 24, 40) }, 'gray'),
    s('path', { d: dots([[28, 84], [54, 84], [80, 84]], 11) }, 'skin'),
    s('path', { d: 'M100 60v76', ...SW(5) }, 'red', { stroke: true }),
    ...person(126, 136, 'purple', { h: 40, w: 24, r: 11, accent: true }),
    s('path', { d: 'M122 84q4-3 8 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  disculpa: [
    ground(),
    ...lean(48, 136, 40, 'blue'),
    s('path', { d: drop(92, 66, 4) }, 'sky'),
    ...person(122, 136, 'orange', { h: 40, w: 24, r: 11 }),
    s('path', { d: heart(104, 54, 12) }, 'pink', { accent: true }),
  ],
  dosis: [
    s('path', { d: 'M18 98l60-20', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 78q6-16 30-18q30 0 30 18q0 18-30 18q-24 0-30-18z' }, 'gray'),
    s('path', { d: 'M82 78q4-10 22-10t22 10q-2 10-22 10t-22-10z' }, 'red', { accent: true }),
    s('path', { d: drop(104, 120, 8) }, 'red'),
    s('path', { d: 'M28 128a8 8 0 0 1 16 0zM44 128a8 8 0 0 1-16 0z' }, 'blue'),
    s('rect', { x: 120, y: 18, width: 28, height: 12, rx: 6, transform: 'rotate(30 134 24)' }, 'yellow')
  ],
  enamorado: [
    s('circle', { cx: 80, cy: 82, r: 50 }, 'yellow', { accent: true }),
    s('path', { d: heart(62, 70, 12) + heart(98, 70, 12) }, 'red'),
    s('path', { d: 'M58 104q22 18 44 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: ells([[46, 96, 8, 5], [114, 96, 8, 5]]) }, 'pink'),
    s('path', { d: heart(128, 28, 8) + heart(30, 30, 6) }, 'pink')
  ],
  enfrentar: [
    s('path', { d: 'M82 136V64q10-44 48-50q-20 18-8 34q10 14 24 8v80z' }, 'blue', { accent: true }),
    s('path', { d: 'M90 70q10-36 36-48M100 100q6-20 20-30M96 124q8-14 22-20', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: dots([[128, 22], [140, 30], [118, 16]], 5) }, 'white'),
    ground(),
    ...person(44, 136, 'red'),
    s('path', { d: 'M56 102l20-12', ...SW(6) }, 'skin', { stroke: true })
  ],
  'escándalo': [
    s('path', { d: burst(110, 46, 30, 14, 10) }, 'yellow'),
    s('rect', { x: 20, y: 70, width: 90, height: 64, rx: 8 }, 'dark', { accent: true }),
    s('path', { d: 'M40 70l8-14h30l8 14z' }, 'dark'),
    s('circle', { cx: 65, cy: 102, r: 22 }, 'gray'),
    s('circle', { cx: 65, cy: 102, r: 12 }, 'navy'),
    s('rect', { x: 88, y: 76, width: 14, height: 8, rx: 2 }, 'white'),
    s('path', { d: 'M126 92l14 6M124 112l14 12M30 52l-8-10', ...SW(3) }, 'orange', { stroke: true })
  ],
  esencia: [
    s('path', { d: 'M38 74h84v52a14 14 0 0 1-14 14H52a14 14 0 0 1-14-14z' }, 'purple', { accent: true }),
    s('path', { d: 'M46 84h68v40a8 8 0 0 1-8 8H54a8 8 0 0 1-8-8z' }, 'pink'),
    s('rect', { x: 66, y: 54, width: 28, height: 20 }, 'yellow'),
    s('rect', { x: 62, y: 38, width: 36, height: 18, rx: 4 }, 'dark'),
    s('path', { d: drop(80, 106, 10) }, 'white'),
    s('path', { d: 'M104 34q10-6 20 0t20 0M110 20q8-4 16 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  expectativa: [
    ground(),
    ...person(44, 136, 'green'),
    s('rect', { x: 46, y: 64, width: 50, height: 14, rx: 4, transform: 'rotate(-30 46 78)' }, 'dark', { accent: true }),
    s('path', { d: 'M56 96l16-16', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: star(124, 32, 14) }, 'yellow'),
    s('path', { d: 'M110 52l-10 6M126 56v8M100 36l-10-2', ...SW(3) }, 'yellow', { stroke: true })
  ],
  facilidad: [
    s('path', { d: 'M28 72h104', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: rects([[18, 50, 18, 44], [124, 50, 18, 44]]) }, 'dark', { accent: true }),
    s('path', { d: 'M80 76v50', ...SW(10) }, 'skin', { stroke: true }),
    s('circle', { cx: 80, cy: 128, r: 12 }, 'skin'),
    s('path', { d: 'M40 30q-4-10 4-14M120 30q4-10-4-14M80 30v-14', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: sparkle(56, 120, 8) + sparkle(110, 116, 6) }, 'yellow')
  ],
  'felicitación': [
    s('path', { d: 'M24 140l26-70 44 44z' }, 'purple', { accent: true }),
    s('path', { d: 'M38 110l14 14M44 92l26 26', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M76 60q8-20 30-16M90 82q20-8 36 6', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: rects([[96, 20, 8, 8], [130, 50, 8, 8], [70, 30, 6, 10], [118, 102, 8, 8]]) }, 'red'),
    s('path', { d: dots([[120, 30], [140, 80], [96, 66]], 4) }, 'green'),
    s('path', { d: star(60, 42, 8) + star(140, 120, 6) }, 'yellow')
  ],
  gesto: [
    s('path', { d: 'M56 144v-28l-20-32a7 7 0 0 1 12-6l14 20V40a7 7 0 0 1 14 0v34-42a7 7 0 0 1 14 0v42-36a7 7 0 0 1 14 0v40-26a7 7 0 0 1 14 0v56q0 22-18 30v8z' }, 'skin', { accent: true }),
    s('path', { d: 'M76 74V58M90 74V58M104 74V62', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M24 52q-6 14 0 28M134 38q8 14 2 30M14 40q-8 24 0 44', ...SW(4) }, 'orange', { stroke: true }),
    s('rect', { x: 54, y: 136, width: 54, height: 12, rx: 3 }, 'blue')
  ],
  grabar: [
    s('rect', { x: 20, y: 50, width: 84, height: 60, rx: 8 }, 'dark', { accent: true }),
    s('path', { d: 'M104 70l34-18v56l-34-18z' }, 'dark'),
    s('circle', { cx: 50, cy: 80, r: 16 }, 'gray'),
    s('circle', { cx: 50, cy: 80, r: 8 }, 'navy'),
    s('circle', { cx: 86, cy: 64, r: 6 }, 'red'),
    s('path', { d: 'M48 110l-10 30M76 110l10 30M62 110v30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[40, 38], [80, 38]], 12) }, 'gray')
  ],
  humilde: [
    ground(),
    ...lean(70, 136, 12, 'green'),
    s('path', { d: 'M74 80h8M86 80h8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M102 104h28l-4 20h-20z' }, 'yellow', { accent: true }),
    s('rect', { x: 110, y: 124, width: 12, height: 12 }, 'yellow'),
    s('path', { d: 'M86 106l18 4', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M36 60q-8 10 0 18M30 50l-6-6', ...SW(3) }, 'pink', { stroke: true })
  ],
  impulso: [
    s('path', { d: 'M24 136V70h24v66', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 132h16l-16-8h16l-16-8h16l-16-8h16l-16-8h16', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 26, y: 92, width: 20, height: 8, rx: 2 }, 'red'),
    s('circle', { cx: 110, cy: 42, r: 18 }, 'blue', { accent: true }),
    s('path', { d: 'M48 96Q60 50 92 46M60 100q16-44 44-38M40 84q10-40 52-50', ...DASH(3, '6 6') }, 'orange', { stroke: true })
  ],
  instancia: [
    s('rect', { x: 20, y: 102, width: 120, height: 36, rx: 4 }, 'brown'),
    s('path', { d: 'M28 102h104v8H28z' }, 'tan'),
    s('rect', { x: 52, y: 22, width: 56, height: 72, rx: 3, transform: 'rotate(6 80 58)' }, 'white'),
    outline({ x: 52, y: 22, width: 56, height: 72, rx: 3, transform: 'rotate(6 80 58)' }),
    s('path', { d: 'M62 40h36M62 52h36M62 64h24', ...SW(3), transform: 'rotate(6 80 58)' }, 'gray', { stroke: true }),
    s('circle', { cx: 94, cy: 80, r: 9 }, 'red', { accent: true }),
    arrow('M30 40v40m-8-8l8 8 8-8', 'green', 4)
  ],
  izquierdo: [
    s('path', { d: 'M106 144v-24l14-30a7 7 0 0 0-12-6l-8 14V44a7 7 0 0 0-14 0v30-38a7 7 0 0 0-14 0v38-32a7 7 0 0 0-14 0v36-24a7 7 0 0 0-14 0v52q0 22 18 30v8z' }, 'skin'),
    s('rect', { x: 52, y: 136, width: 54, height: 12, rx: 3 }, 'blue'),
    arrow('M62 22H16m14-12L16 22l14 12', 'red', 7),
    s('circle', { cx: 120, cy: 30, r: 10 }, 'red', { accent: true })
  ],
  joda: [
    s('path', { d: 'M80 14v18', ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 54, r: 24 }, 'gray', { accent: true }),
    s('path', { d: 'M56 54h48M80 30v48M62 40h36M62 68h36M68 32v44M92 32v44', ...SW(1.5) }, 'white', { stroke: true }),
    s('path', { d: 'M70 80L30 144h20zM90 80l40 64h-20z' }, 'yellow'),
    ...note(28, 52, 'purple'),
    ...note(124, 58, 'pink'),
    s('path', { d: rects([[42, 110, 6, 6], [112, 104, 6, 6]]) }, 'blue')
  ],
  lentamente: [
    s('path', { d: 'M14 128h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 124h96q10 0 10-10l-4-34', ...SW(14) }, 'mint', { stroke: true }),
    s('path', { d: 'M126 80l-6-26M134 80l6-26', ...SW(3) }, 'mint', { stroke: true }),
    s('circle', { cx: 74, cy: 84, r: 36 }, 'brown', { accent: true }),
    s('path', { d: 'M74 84m-6 0a6 6 0 0 1 12 0a12 12 0 0 1-24 0a18 18 0 0 1 36 0a24 24 0 0 1-48 0', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: dots([[120, 54], [140, 54]], 4) }, 'dark')
  ],
  limitado: [
    s('path', { d: 'M20 110a60 60 0 0 1 120 0', ...SW(16, { 'stroke-linecap': 'butt' }) }, 'green', { stroke: true }),
    s('path', { d: 'M116 62a60 60 0 0 1 24 48', ...SW(16, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M80 110l40-36', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 110, r: 10 }, 'dark'),
    s('path', { d: 'M20 130h120', ...SW(5) }, 'gray', { stroke: true })
  ],
  multa: [
    s('rect', { x: 26, y: 18, width: 70, height: 110, rx: 4 }, 'white'),
    outline({ x: 26, y: 18, width: 70, height: 110, rx: 4 }),
    s('rect', { x: 26, y: 18, width: 70, height: 20, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M38 54h46M38 70h46M38 86h30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 108h20', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: dots([[116, 112], [130, 86], [120, 60]], 12) }, 'yellow'),
    s('path', { d: ring(116, 112, 6) + ring(130, 86, 6) + ring(120, 60, 6), ...SW(2) }, 'orange', { stroke: true }),
    arrow('M106 136l30-6m-8-6l8 6-6 8', 'orange', 3)
  ],
  negar: [
    s('path', { d: busts([62], 148, 56, 30) }, 'blue'),
    s('circle', { cx: 62, cy: 82, r: 30 }, 'skin'),
    s('path', { d: 'M52 76h4M68 76h4M54 98q8-6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 64q-8 18 0 36M100 64q8 18 0 36', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M114 112v-60a6 6 0 0 1 12 0v40', ...SW(10) }, 'skin', { stroke: true, accent: true }),
    s('path', { d: 'M108 40q12-16 24 0M108 28q12-16 24 0', ...SW(3) }, 'red', { stroke: true })
  ],
  noble: [
    s('path', { d: 'M24 120q0-20 56-20t56 20q0 16-56 16t-56-16z' }, 'red'),
    s('path', { d: 'M24 124l-8 10M136 124l8 10', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M38 100l-8-56 26 24 24-40 24 40 26-24-8 56z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[30, 44], [80, 28], [130, 44]], 6) }, 'yellow'),
    s('path', { d: dots([[58, 86], [102, 86]], 6) }, 'blue'),
    s('circle', { cx: 80, cy: 82, r: 8 }, 'red')
  ],
  pelear: [
    s('path', { d: burst(80, 76, 22, 10, 8) }, 'yellow'),
    s('path', { d: 'M14 70a26 26 0 0 1 26-26h20a18 18 0 0 1 18 18v28a18 18 0 0 1-18 18H40a26 26 0 0 1-26-26z' }, 'red', { accent: true }),
    s('path', { d: 'M146 70a26 26 0 0 0-26-26h-20a18 18 0 0 0-18 18v28a18 18 0 0 0 18 18h20a26 26 0 0 0 26-26z' }, 'blue'),
    s('path', { d: 'M30 108h26v28H30zM104 108h26v28h-26z' }, 'white'),
    s('path', { d: 'M30 108h26v28H30zM104 108h26v28h-26z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M56 60q-10 10 0 20M104 60q10 10 0 20', ...SW(3) }, 'dark', { stroke: true })
  ],
  'percepción': [
    s('path', { d: 'M16 80q64-70 128 0q-64 70-128 0z' }, 'white'),
    s('path', { d: 'M16 80q64-70 128 0q-64 70-128 0z', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 24 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 11 }, 'black'),
    s('circle', { cx: 88, cy: 72, r: 5 }, 'white'),
    s('path', { d: 'M40 32l-8-12M80 22V8M120 32l8-12M40 128l-8 12M80 138v14M120 128l8 12', ...SW(4) }, 'orange', { stroke: true })
  ],
  plantear: [
    s('rect', { x: 14, y: 112, width: 132, height: 10, rx: 2 }, 'brown'),
    s('path', { d: 'M26 122v20M134 122v20', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: halfRays(96, 58, 30, 40, 5), ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 96, cy: 58, r: 22 }, 'yellow', { accent: true }),
    s('rect', { x: 86, y: 78, width: 20, height: 14, rx: 3 }, 'gray'),
    s('path', { d: 'M74 112h44', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 92h24q14 0 26 8', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M14 84h16v18H14z' }, 'blue')
  ],
  policial: [
    s('path', { d: 'M18 104l12-28h100l12 28v18H18z' }, 'white'),
    s('path', { d: 'M18 104l12-28h100l12 28v18H18z', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 98h124v12H18z' }, 'navy', { accent: true }),
    s('path', { d: 'M44 80h28v14H40zM88 80h28l4 14H88z' }, 'sky'),
    s('path', { d: dots([[46, 124], [114, 124]], 12) }, 'dark'),
    s('rect', { x: 62, y: 62, width: 18, height: 14, rx: 4 }, 'red'),
    s('rect', { x: 80, y: 62, width: 18, height: 14, rx: 4 }, 'blue'),
    s('path', { d: 'M56 52l-8-8M104 52l8-8M80 50V38', ...SW(3) }, 'orange', { stroke: true })
  ],
  prisionero: [
    ground(),
    s('circle', { cx: 60, cy: 64, r: 14 }, 'skin'),
    s('rect', { x: 42, y: 80, width: 36, height: 56, rx: 10 }, 'white'),
    s('rect', { x: 42, y: 80, width: 36, height: 56, rx: 10, ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M42 92h36M42 106h36M42 120h36', ...SW(6) }, 'black', { stroke: true, accent: true }),
    s('path', { d: 'M70 134q20 6 40-4', ...DASH(4, '5 4') }, 'gray', { stroke: true }),
    s('circle', { cx: 118, cy: 122, r: 14 }, 'black')
  ],
  privacidad: [
    s('rect', { x: 20, y: 18, width: 120, height: 100, rx: 4 }, 'brown'),
    s('rect', { x: 28, y: 26, width: 104, height: 84 }, 'navy'),
    s('path', { d: 'M28 26h52v84q-24-30-52-30zM132 26H80v84q24-30 52-30z' }, 'purple'),
    s('path', { d: 'M20 18h120', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M68 110v-12a12 12 0 0 1 24 0v12', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 60, y: 108, width: 40, height: 34, rx: 5 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 124, r: 5 }, 'dark')
  ]
};
