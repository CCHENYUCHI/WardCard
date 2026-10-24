// Illustration specs for common words, batch 0011 (plus leftovers of 0010) (see server/scripts/lexicon/art.js)
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

// Path data: seat dots on a half-ring of radius r around (80, base), split left / middle / right
const hemi = (r, n, base = 118) => Array.from({ length: n }, (_, i) => {
  const a = Math.PI * (1 - i / (n - 1));
  return [+(80 + r * Math.cos(a)).toFixed(1), +(base - r * Math.sin(a)).toFixed(1)];
});
const seats = [...hemi(34, 7), ...hemi(48, 9), ...hemi(62, 11)];


// Path data: a closed circle drawn as two arcs (for strokes)
const ring = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
const DASH = (w, d = '6 6') => SW(w, { 'stroke-dasharray': d });
// Ruler ticks: every 4px, long tick every 20px
const ticks = Array.from({ length: 31 }, (_, i) => `M${20 + i * 4} 84v${i % 5 ? 7 : 14}`).join('');
// Laurel leaves along two arcs
const leaves = [...Array.from({ length: 6 }, (_, i) => 110 + i * 24), ...Array.from({ length: 6 }, (_, i) => 70 - i * 24)]
  .map(deg => [+(80 + 46 * Math.cos(deg * Math.PI / 180)).toFixed(1), +(80 + 46 * Math.sin(deg * Math.PI / 180)).toFixed(1)]);
// Checkered strip: black squares
const checks = rects(Array.from({ length: 24 }, (_, i) => [48 + (i % 8) * 8, 18 + Math.floor(i / 8) * 8, 8, 8])
  .filter((_, i) => (i % 8 + Math.floor(i / 8)) % 2 === 0));
// Footprints (ellipses)
const prints = pts => pts.map(([x, y]) => `M${x - 5} ${y}a5 8 0 1 0 10 0a5 8 0 1 0 -10 0z`).join('');
const flowerPath = (cx, cy) => dots([[cx - 6, cy], [cx + 6, cy], [cx, cy - 6], [cx, cy + 6]], 5);
// Federation: six states around a center
const fed = Array.from({ length: 6 }, (_, i) => [+(80 + 50 * Math.cos(i * Math.PI / 3)).toFixed(1), +(80 + 50 * Math.sin(i * Math.PI / 3)).toFixed(1)]);

// Checkerboard (cream squares) on a 6 x 4 board
const board = rects(Array.from({ length: 24 }, (_, k) => [26 + (k % 6) * 18, 58 + Math.floor(k / 6) * 18, 18, 18])
  .filter((_, k) => (k % 6 + Math.floor(k / 6)) % 2 === 0));
// Saw teeth along the blade's lower edge (54,96) -> (144,112)
const teeth = 'M54 96' + Array.from({ length: 15 }, (_, i) => {
  const x = 54 + 6 * (i + 1), y = 96 + 16 * (6 * (i + 1)) / 90;
  return `L${x - 3} ${(y - 0.5 + 7).toFixed(1)}L${x} ${y.toFixed(1)}`;
}).join('') + 'z';
// Eight small stars in an arc (Venezuelan flag)
const arcStars = Array.from({ length: 8 }, (_, i) => {
  const a = (200 + i * 20) * Math.PI / 180;
  return star(+(83 + 22 * Math.cos(a)).toFixed(1), +(78 + 20 * Math.sin(a)).toFixed(1), 3.5);
}).join('');
// Rosary beads on a ring
const beads = Array.from({ length: 18 }, (_, i) => {
  const a = i * 20 * Math.PI / 180;
  return [+(80 + 40 * Math.sin(a)).toFixed(1), +(60 - 40 * Math.cos(a)).toFixed(1)];
}).filter((_, i) => i !== 9);

module.exports = {
  intelectual: [
    ...person(80, 140, 'navy', { h: 50, w: 44, r: 18 }),
    s('path', { d: ring(72, 70, 7) + ring(88, 70, 7) + 'M79 70h2', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 28, r: 13 }, 'yellow', { accent: true }),
    s('rect', { x: 74, y: 40, width: 12, height: 7, rx: 2 }, 'gray'),
    s('path', { d: 'M58 20l-6-4M102 20l6-4M56 34h-7M104 34h7', ...SW(3) }, 'orange', { stroke: true })
  ],
  lanzamiento: [
    backdrop('sky'),
    s('path', { d: 'M80 18q18 20 18 56v26h-36v-26q0-36 18-56z' }, 'white'),
    s('path', { d: 'M62 78l-14 26h14zM98 78l14 26h-14z' }, 'red'),
    s('circle', { cx: 80, cy: 58, r: 8 }, 'blue'),
    s('path', { d: 'M66 102h28l-14 32z' }, 'orange', { accent: true }),
    s('path', { d: dots([[46, 134], [62, 138], [98, 138], [114, 134]], 9) }, 'gray')
  ],
  paro: [
    ...person(48, 136, 'blue'),
    ...person(112, 136, 'green'),
    s('path', { d: 'M80 58V136', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 42, y: 18, width: 76, height: 42, rx: 6 }, 'red', { accent: true }),
    s('path', { d: rects([[66, 28, 9, 22], [85, 28, 9, 22]]) }, 'white'),
    ground()
  ],
  particularmente: [
    backdrop('navy'),
    s('path', { d: 'M70 14h20l34 116H36z' }, 'cream'),
    s('path', { d: busts([30, 130], 136, 24, 36) + dots([[30, 90], [130, 90]], 10) }, 'gray'),
    ...person(80, 130, 'orange', { accent: true })
  ],
  provincial: [
    s('path', { d: 'M34 44Q62 22 96 30T138 52Q146 84 128 110T80 140Q42 140 28 112T34 44z' }, 'green'),
    s('path', { d: 'M96 30Q120 34 138 52Q146 72 140 86L100 80z' }, 'orange', { accent: true }),
    s('path', { d: 'M62 34L72 80 30 92M72 80h28M72 80l10 58M100 80l36 22M100 80L96 30', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M34 44Q62 22 96 30T138 52Q146 84 128 110T80 140Q42 140 28 112T34 44z', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 120, cy: 60, r: 6 }, 'red')
  ],
  residencia: [
    s('path', { d: 'M24 66L80 24l56 42z' }, 'red'),
    s('rect', { x: 34, y: 64, width: 92, height: 72 }, 'tan'),
    s('rect', { x: 70, y: 100, width: 20, height: 36, rx: 2 }, 'brown', { accent: true }),
    s('path', { d: rects([[44, 74, 18, 16], [98, 74, 18, 16], [44, 106, 18, 16], [98, 106, 18, 16]]) }, 'sky'),
    s('path', { d: dots([[22, 128], [138, 128]], 8) }, 'green'),
    ground()
  ],
  sonrisa: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'yellow', { accent: true }),
    s('path', { d: dots([[58, 64], [102, 64]], 7) }, 'dark'),
    s('path', { d: dots([[44, 90], [116, 90]], 8) }, 'pink'),
    s('path', { d: 'M50 92Q80 122 110 92', ...SW(7) }, 'dark', { stroke: true })
  ],
  'vehículo': [
    s('path', { d: 'M18 112v-20q0-8 8-10l20-4 18-22h40l22 24 12 4q6 2 6 10v18z' }, 'red', { accent: true }),
    s('path', { d: 'M56 78l12-16h16v16zM90 62h14l14 16H90z' }, 'sky'),
    s('path', { d: dots([[48, 114], [110, 114]], 16) }, 'dark'),
    s('path', { d: dots([[48, 114], [110, 114]], 6) }, 'gray'),
    s('circle', { cx: 138, cy: 96, r: 4 }, 'yellow'),
    ground(132)
  ],
  basado: [
    s('rect', { x: 20, y: 110, width: 120, height: 26, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: 'M20 123h120M50 110v13M80 123v13M110 110v13', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 44, y: 62, width: 72, height: 48 }, 'blue'),
    s('path', { d: 'M36 64L80 26l44 38z' }, 'navy'),
    s('rect', { x: 72, y: 82, width: 16, height: 28 }, 'cream'),
    s('path', { d: 'M28 96v10M132 96v10M24 102l4 4 4-4M128 102l4 4 4-4', ...SW(3) }, 'orange', { stroke: true })
  ],
  bello: [
    ...flower(80, 56, 'pink'),
    s('path', { d: 'M80 112q-20-16-32-4q14 14 32 4z' }, 'green'),
    s('path', { d: star(36, 40, 10) + star(126, 72, 8) + star(42, 98, 7) }, 'yellow')
  ],
  californio: [
    backdrop('sky'),
    s('circle', { cx: 116, cy: 44, r: 16 }, 'yellow'),
    s('rect', { x: 14, y: 98, width: 132, height: 24 }, 'blue'),
    s('path', { d: 'M14 120h132v14a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'tan'),
    s('path', { d: 'M54 130Q46 92 62 52', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M62 52Q40 30 18 50Q42 38 62 52zM62 52Q62 26 40 18Q58 30 62 52zM62 52Q80 26 104 32Q80 34 62 52zM62 52Q92 46 100 70Q82 50 62 52z' }, 'green', { accent: true })
  ],
  colonia: [
    s('path', { d: rects([[22, 96, 34, 40], [106, 96, 34, 40]]) }, 'tan'),
    s('path', { d: 'M18 98l21-22 21 22zM102 98l21-22 21 22z' }, 'red'),
    s('rect', { x: 60, y: 84, width: 42, height: 52 }, 'orange', { accent: true }),
    s('path', { d: 'M54 86l27-28 27 28z' }, 'brown'),
    s('path', { d: rects([[34, 116, 10, 20], [118, 116, 10, 20], [74, 112, 14, 24]]) }, 'brown'),
    s('path', { d: 'M81 58V22', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M81 22h22l-6 7 6 7H81z' }, 'green'),
    ground()
  ],
  'cooperación': [
    ...person(44, 136, 'blue', { accent: true }),
    ...person(116, 136, 'green'),
    s('path', { d: 'M54 98l8-38M106 98l-8-38', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 18, y: 50, width: 124, height: 12, rx: 4 }, 'brown'),
    ground()
  ],
  declarar: [
    s('path', { d: 'M24 136V104h44v32z' }, 'brown'),
    ...person(46, 104, 'blue', { h: 34 }),
    s('path', { d: 'M58 88l8-20', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M60 62h8l30-18v40l-30-18h-8z' }, 'orange', { accent: true }),
    s('path', { d: 'M108 50q8 14 0 28M120 42q14 22 0 44', ...SW(5) }, 'gray', { stroke: true }),
    ground()
  ],
  discutir: [
    ...person(40, 136, 'blue'),
    ...person(120, 136, 'green'),
    s('path', { d: 'M22 22h36a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8H48l-8 10v-10H22a8 8 0 0 1-8-8V30a8 8 0 0 1 8-8z' }, 'sky'),
    s('path', { d: 'M102 22h36a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8h-18v10l-8-10h-10a8 8 0 0 1-8-8V30a8 8 0 0 1 8-8z' }, 'pink'),
    s('path', { d: 'M22 40l6-6 6 6 6-6 6 6 6-6 6 6M102 40l6-6 6 6 6-6 6 6 6-6 6 6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 70l-14 22h10l-6 20 16-26h-10z' }, 'red', { accent: true })
  ],
  encuesta: [
    s('rect', { x: 34, y: 22, width: 92, height: 120, rx: 8 }, 'brown', { accent: true }),
    s('rect', { x: 42, y: 34, width: 76, height: 100, rx: 3 }, 'cream'),
    s('rect', { x: 62, y: 16, width: 36, height: 14, rx: 4 }, 'gray'),
    s('path', { d: rects([[50, 48, 14, 14], [50, 76, 14, 14], [50, 104, 14, 14]]), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M72 55h36M72 83h36M72 111h28', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 54l5 6 10-14M52 82l5 6 10-14', ...SW(4) }, 'green', { stroke: true })
  ],
  exacto: [
    s('circle', { cx: 72, cy: 88, r: 54 }, 'red'),
    s('circle', { cx: 72, cy: 88, r: 38 }, 'white'),
    s('circle', { cx: 72, cy: 88, r: 22 }, 'red', { accent: true }),
    s('circle', { cx: 72, cy: 88, r: 8 }, 'white'),
    s('path', { d: 'M72 88L134 26', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M124 22l12 2 2 12 8-8-2-12-12-2z' }, 'orange')
  ],
  extra: [
    s('path', { d: 'M88 44l8-28', ...SW(6) }, 'pink', { stroke: true }),
    s('path', { d: 'M46 50h68l-8 88H54z' }, 'sky'),
    s('path', { d: dots([[64, 124], [80, 128], [94, 122], [72, 110], [88, 108]], 5) }, 'dark'),
    s('rect', { x: 40, y: 42, width: 80, height: 10, rx: 4 }, 'gray'),
    s('circle', { cx: 120, cy: 98, r: 20 }, 'green', { accent: true }),
    s('path', { d: 'M120 88v20M110 98h20', ...SW(5) }, 'white', { stroke: true })
  ],
  franco: [
    s('path', { d: 'M56 80V42M70 80V34M84 80V36M98 80V44', ...SW(13) }, 'skin', { stroke: true }),
    s('path', { d: 'M50 104L34 80', ...SW(13) }, 'skin', { stroke: true }),
    s('path', { d: 'M48 78h56v40q0 22-28 22t-28-22z' }, 'skin'),
    s('path', { d: heart(76, 108, 14) }, 'red', { accent: true }),
    s('path', { d: 'M120 40l12-6M122 60h14M28 50l-12-6', ...SW(4) }, 'orange', { stroke: true })
  ],
  individual: [
    s('path', { d: busts([24, 136], 136, 22, 26) + dots([[24, 102], [136, 102]], 9) }, 'gray'),
    s('circle', { cx: 80, cy: 90, r: 42 }, 'mint'),
    s('path', { d: ring(80, 90, 42), ...DASH(4) }, 'green', { stroke: true }),
    ...person(80, 122, 'orange', { accent: true, h: 36, w: 26, r: 11 })
  ],
  individuo: [
    s('ellipse', { cx: 80, cy: 82, rx: 50, ry: 62 }, 'sky', { accent: true }),
    s('path', { d: 'M50 120Q36 70 60 44Q80 30 100 44Q124 66 110 120M62 128Q48 78 70 56Q86 48 96 60Q110 82 98 128M74 132Q62 84 78 70Q90 70 88 92Q88 112 86 132M40 96Q38 50 66 32Q96 22 116 44Q130 64 124 100', ...SW(5) }, 'navy', { stroke: true })
  ],
  infancia: [
    ...person(66, 136, 'yellow', { h: 30, w: 24, r: 11 }),
    s('path', { d: 'M76 114Q96 92 108 64', ...SW(2) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 110, cy: 44, rx: 16, ry: 20 }, 'red', { accent: true }),
    s('path', { d: 'M107 64l3-4 3 4z' }, 'red'),
    s('circle', { cx: 34, cy: 126, r: 10 }, 'blue'),
    ground()
  ],
  infraestructura: [
    backdrop('sky'),
    s('path', { d: 'M14 116h132v18a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'blue'),
    s('path', { d: rects([[40, 34, 10, 82], [110, 34, 10, 82]]) }, 'gray'),
    s('path', { d: 'M14 74Q30 80 45 34Q80 92 115 34Q130 80 146 74M60 62v22M80 64v20M100 62v22', ...SW(3) }, 'orange', { stroke: true }),
    s('rect', { x: 14, y: 84, width: 132, height: 10 }, 'dark', { accent: true }),
    s('path', { d: 'M20 89h120', ...DASH(2) }, 'yellow', { stroke: true })
  ],
  'ingeniería': [
    s('rect', { x: 18, y: 18, width: 124, height: 84, rx: 6 }, 'blue'),
    s('path', { d: 'M28 86h104M28 86l20-40h64l20 40M48 46l16 40 16-40 16 40 16-40', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M40 128a40 40 0 0 1 80 0z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 90v36', ...SW(6) }, 'orange', { stroke: true }),
    s('rect', { x: 28, y: 124, width: 104, height: 12, rx: 6 }, 'orange')
  ],
  'interpretación': [
    ...person(80, 136, 'purple'),
    s('path', { d: 'M66 78a14 14 0 0 1 28 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: rects([[63, 74, 6, 10], [91, 74, 6, 10]]) }, 'dark'),
    s('path', { d: 'M14 30a10 10 0 0 1 10-10h32a10 10 0 0 1 10 10v16a10 10 0 0 1-10 10H38l-10 10V56h-4a10 10 0 0 1-10-10z' }, 'blue'),
    s('path', { d: dots([[30, 38], [40, 38], [50, 38]], 3) }, 'white'),
    s('path', { d: 'M94 30a10 10 0 0 1 10-10h32a10 10 0 0 1 10 10v16a10 10 0 0 1-10 10h-4v10l-10-10h-18a10 10 0 0 1-10-10z' }, 'green', { accent: true }),
    s('path', { d: rects([[106, 34, 8, 8], [116, 34, 8, 8], [126, 34, 8, 8]]) }, 'white'),
    arrow('M70 38h16M80 32l6 6-6 6', 'orange', 4)
  ],
  'legislación': [
    s('rect', { x: 36, y: 24, width: 88, height: 112 }, 'cream'),
    s('path', { d: 'M36 24v112M124 24v112', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M30 20h100M30 140h100', ...SW(12) }, 'brown', { stroke: true }),
    s('path', { d: 'M48 44h64M48 58h64M48 72h64M48 86h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M94 120l-6 16 8-4 4 6 2-16z' }, 'red'),
    s('circle', { cx: 100, cy: 110, r: 14 }, 'red', { accent: true }),
    s('rect', { x: 26, y: 96, width: 30, height: 14, rx: 3, transform: 'rotate(-30 41 103)' }, 'brown'),
    s('path', { d: 'M46 108l20 22', ...SW(5) }, 'brown', { stroke: true })
  ],
  liberal: [
    s('path', { d: 'M24 136V56h52v24M76 120v16M24 136h52M24 56h52M37 56v80M50 56v80M63 56v80M50 56V42', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M76 80l24-10v44l-24 10M88 75v44', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 70Q90 54 100 50', ...DASH(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 116, cy: 44, rx: 16, ry: 11 }, 'blue', { accent: true }),
    s('path', { d: 'M110 42q10-24 24-16q-6 14-24 16z' }, 'sky'),
    s('path', { d: 'M131 40l9 3-9 4z' }, 'orange')
  ],
  'lógico': [
    s('rect', { x: 56, y: 16, width: 48, height: 26, rx: 6 }, 'blue'),
    s('path', { d: 'M80 42v14M58 76H36v28M102 76h24v28', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M75 52l5 6 5-6zM31 100l5 6 5-6zM121 100l5 6 5-6z' }, 'dark'),
    s('path', { d: 'M80 58l22 18-22 18-22-18z' }, 'orange', { accent: true }),
    s('circle', { cx: 36, cy: 122, r: 16 }, 'green'),
    s('rect', { x: 108, y: 106, width: 36, height: 32, rx: 4 }, 'purple')
  ],
  manejo: [
    s('path', { d: 'M34 64L22 120M126 64l12 56', ...SW(14) }, 'blue', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 52, ...SW(12) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 80L32 72M80 80L128 72M80 80V130', ...SW(10) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 16 }, 'gray'),
    s('circle', { cx: 80, cy: 80, r: 7 }, 'red', { accent: true }),
    s('path', { d: dots([[34, 62], [126, 62]], 12) }, 'skin')
  ],
  partida: [
    s('rect', { x: 20, y: 52, width: 120, height: 84, rx: 6 }, 'brown'),
    s('path', { d: board }, 'cream'),
    s('path', { d: dots([[53, 67], [89, 67], [125, 67]], 7) }, 'red', { accent: true }),
    s('path', { d: dots([[35, 121], [71, 121], [107, 121]], 7) }, 'black'),
    s('rect', { x: 66, y: 14, width: 28, height: 28, rx: 5 }, 'white'),
    outline({ x: 66, y: 14, width: 28, height: 28, rx: 5 }),
    s('path', { d: dots([[73, 21], [80, 28], [87, 35]], 3) }, 'dark')
  ],
  personalmente: [
    ...person(40, 136, 'blue', { accent: true }),
    ...person(120, 136, 'green'),
    s('path', { d: 'M50 100l18-6M110 100l-18-6', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 64, y: 76, width: 32, height: 28, rx: 3 }, 'tan'),
    s('path', { d: 'M80 76v28M64 90h32', ...SW(4) }, 'red', { stroke: true }),
    ground()
  ],
  princesa: [
    s('path', { d: 'M62 62q0-26 18-26t18 26v24H62z' }, 'brown'),
    s('circle', { cx: 80, cy: 58, r: 15 }, 'skin'),
    s('path', { d: 'M70 76h20l26 60H44z' }, 'pink', { accent: true }),
    s('path', { d: 'M66 44l2-18 7 8 5-12 5 12 7-8 2 18z' }, 'yellow'),
    s('path', { d: 'M110 104L124 72', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: star(126, 66, 9) }, 'yellow'),
    ground()
  ],
  progreso: [
    s('path', { d: 'M20 136V112h28V88h28V64h28V40h28v96z' }, 'tan'),
    ...person(34, 112, 'blue', { h: 30, w: 22, r: 10 }),
    arrow('M40 52Q60 26 92 26M84 18l8 8-8 8', 'green', 5),
    s('path', { d: 'M118 40V14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M118 14h20l-6 6 6 6h-20z' }, 'red', { accent: true }),
    ground()
  ],
  puesta: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'orange'),
    s('path', { d: 'M38 96a42 42 0 0 1 84 0z' }, 'yellow', { accent: true }),
    s('path', { d: 'M14 96h132v38a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'navy'),
    s('path', { d: 'M50 108h60M60 120h40M70 132h20', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M36 40q6-6 12 0q6-6 12 0M100 30q5-5 10 0q5-5 10 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  rol: [
    s('path', { d: 'M14 14h22q-4 60 6 122H14zM146 14h-22q4 60-6 122h28z' }, 'red'),
    ...person(66, 136, 'purple'),
    s('path', { d: 'M78 102Q96 96 98 80', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M80 40h36v20q0 22-18 22t-18-22z' }, 'yellow', { accent: true }),
    s('path', { d: 'M88 52q4-4 8 0M100 52q4-4 8 0M90 66q8 8 16 0', ...SW(3) }, 'dark', { stroke: true }),
    ground()
  ],
  sujeto: [
    s('rect', { x: 16, y: 112, width: 40, height: 24, rx: 5 }, 'orange', { accent: true }),
    s('path', { d: rects([[62, 112, 38, 24], [106, 112, 38, 24]]) }, 'gray'),
    ...person(36, 106, 'blue', { h: 32, w: 24, r: 11 }),
    s('path', { d: 'M70 124h22M114 124h22', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M36 30v14M24 36l-6-8M48 36l6-8', ...SW(4) }, 'yellow', { stroke: true })
  ],
  torneo: [
    s('path', { d: 'M18 38h22v28H18M40 52h24M18 94h22v28H18M40 108h24M64 52v56M64 80h24', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[18, 38], [18, 66], [18, 94], [18, 122]], 6) }, 'blue'),
    s('path', { d: 'M96 60h-8q0 16 12 18M136 60h8q0 16-12 18', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M96 54h40v14q0 24-20 26q-20-2-20-26z' }, 'yellow', { accent: true }),
    s('path', { d: 'M112 94h8v14h-8zM102 108h28v10h-28z' }, 'brown')
  ],
  turno: [
    arrow('M28 40h76M94 30l10 10-10 10', 'orange', 5),
    s('path', { d: busts([42, 70], 136, 22, 30) + dots([[42, 96], [70, 96]], 10) }, 'gray'),
    ...person(98, 136, 'orange', { h: 36, w: 24, r: 11 }),
    s('rect', { x: 116, y: 84, width: 30, height: 52, rx: 4 }, 'brown'),
    s('path', { d: 'M131 70v14', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 131, cy: 60, r: 10 }, 'green', { accent: true })
  ],
  venezolano: [
    s('path', { d: 'M26 140V18', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 28, y: 22, width: 110, height: 28 }, 'yellow'),
    s('rect', { x: 28, y: 50, width: 110, height: 28 }, 'blue', { accent: true }),
    s('rect', { x: 28, y: 78, width: 110, height: 28 }, 'red'),
    s('path', { d: arcStars }, 'white')
  ],
  'aprobación': [
    s('rect', { x: 24, y: 40, width: 84, height: 100, rx: 4 }, 'white'),
    outline({ x: 24, y: 40, width: 84, height: 100, rx: 4 }),
    s('path', { d: 'M36 58h56M36 72h56M36 86h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: ring(68, 114, 16) + 'M60 114l6 7 12-14', ...SW(4) }, 'green', { stroke: true }),
    s('circle', { cx: 124, cy: 30, r: 11 }, 'brown'),
    s('rect', { x: 118, y: 38, width: 12, height: 28 }, 'brown'),
    s('rect', { x: 106, y: 64, width: 36, height: 12, rx: 3 }, 'red', { accent: true })
  ],
  'católico': [
    s('path', { d: ring(80, 60, 40) + 'M80 100v16', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: dots(beads, 5) }, 'brown'),
    s('circle', { cx: 80, cy: 102, r: 6 }, 'blue'),
    s('path', { d: rects([[76, 114, 8, 32], [68, 122, 24, 8]]) }, 'yellow', { accent: true })
  ],
  'celebración': [
    s('path', { d: 'M36 136V88q0-12 10-16V48h12v24q10 4 10 16v48z' }, 'green', { accent: true }),
    s('rect', { x: 38, y: 98, width: 28, height: 20 }, 'cream'),
    s('rect', { x: 46, y: 22, width: 12, height: 14, rx: 3, transform: 'rotate(-20 52 29)' }, 'tan'),
    s('path', { d: 'M80 20q10 10 20 0t20 0t20 0', ...SW(4) }, 'purple', { stroke: true }),
    s('path', { d: rects([[96, 40, 6, 10], [120, 52, 6, 10], [100, 80, 6, 10], [132, 96, 6, 10], [110, 118, 6, 10]]) }, 'red'),
    s('path', { d: dots([[86, 56], [134, 36], [124, 74], [92, 104], [136, 126]], 4) }, 'blue'),
    s('path', { d: dots([[64, 40], [74, 30], [70, 48]], 3) }, 'orange')
  ],
  ciclo: [
    s('path', { d: 'M38 66A44 44 0 0 1 122 66M122 94A44 44 0 0 1 38 94', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M114 62h16l-8 14zM30 98h16l-8-14z' }, 'blue'),
    s('circle', { cx: 66, cy: 62, r: 10 }, 'yellow', { accent: true }),
    s('path', { d: dots([[70, 76], [82, 70], [94, 78]], 10) }, 'gray'),
    s('path', { d: 'M72 94l-4 8a4 4 0 0 0 8 0zM88 94l-4 8a4 4 0 0 0 8 0z' }, 'sky')
  ],
  'científico': [
    ...person(56, 136, 'white', { h: 46, w: 34, r: 13 }),
    outline({ x: 39, y: 90, width: 34, height: 46, rx: 11 }),
    s('path', { d: ring(51, 75, 5) + ring(61, 75, 5), ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M70 104l22-6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M104 60h12v18l14 40q2 8-6 8H96q-8 0-6-8l14-40z' }, 'sky'),
    s('path', { d: 'M95 102h30l5 16q2 8-6 8H96q-8 0-6-8z' }, 'green', { accent: true }),
    s('path', { d: dots([[112, 48], [118, 36]], 4) }, 'green'),
    ground()
  ],
  conde: [
    s('path', { d: 'M96 136V40h-6V26h10v8h8v-8h8v8h8v-8h10v14h-6v96z' }, 'gray'),
    s('rect', { x: 108, y: 60, width: 12, height: 18, rx: 6 }, 'dark'),
    s('path', { d: 'M46 76h28l14 60H32z' }, 'purple'),
    s('rect', { x: 48, y: 82, width: 24, height: 54, rx: 6 }, 'navy'),
    s('circle', { cx: 60, cy: 64, r: 12 }, 'skin'),
    s('path', { d: 'M48 54l2-12 5 6 5-8 5 8 5-6 2 12z' }, 'yellow', { accent: true }),
    s('path', { d: 'M54 70q6-4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    ground()
  ],
  criminal: [
    ...person(70, 136, 'dark'),
    s('path', { d: 'M56 102h28M56 114h28M56 126h28', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 74a12 12 0 0 1 24 0z' }, 'black'),
    s('rect', { x: 57, y: 74, width: 26, height: 9, rx: 3 }, 'black'),
    s('path', { d: dots([[65, 78], [75, 78]], 2) }, 'white'),
    s('path', { d: 'M104 136q-14 0-12-18q2-20 18-26l-4-8h16l-4 8q16 6 18 26q2 18-12 18z' }, 'tan', { accent: true }),
    ground()
  ],
  'círculo': [
    s('circle', { cx: 80, cy: 92, r: 46 }, 'sky'),
    s('circle', { cx: 80, cy: 92, r: 46, ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M80 30L80 92M80 30L124 88', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 92, r: 4 }, 'dark'),
    s('circle', { cx: 80, cy: 26, r: 8 }, 'orange', { accent: true })
  ],
  dirigido: [
    s('path', { d: 'M16 68h52V54l28 26-28 26V92H16z' }, 'orange', { accent: true }),
    s('path', { d: ring(122, 80, 24), ...DASH(3, '5 5') }, 'gray', { stroke: true }),
    ...person(122, 118, 'blue', { h: 26, w: 22, r: 10 }),
    ground()
  ],
  evidente: [
    s('path', { d: 'M16 80Q80 20 144 80Q80 140 16 80z' }, 'white'),
    s('path', { d: 'M16 80Q80 20 144 80Q80 140 16 80z', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 24 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 10 }, 'black'),
    s('circle', { cx: 86, cy: 74, r: 4 }, 'white'),
    s('path', { d: 'M80 16V28M40 28l8 10M120 28l-8 10M80 144v-12M40 132l8-10M120 132l-8-10', ...SW(4) }, 'orange', { stroke: true })
  ],
  'excepción': [
    s('path', { d: dots([[40, 40], [80, 40], [120, 40], [40, 80], [120, 80], [40, 120], [80, 120], [120, 120]], 15) }, 'blue'),
    s('path', { d: 'M80 60l20 34H60z' }, 'orange', { accent: true })
  ],
  formato: [
    s('rect', { x: 30, y: 16, width: 100, height: 128, rx: 6 }, 'white'),
    outline({ x: 30, y: 16, width: 100, height: 128, rx: 6 }),
    s('rect', { x: 40, y: 26, width: 80, height: 14, rx: 2 }, 'blue', { accent: true }),
    s('rect', { x: 40, y: 48, width: 38, height: 34, rx: 2 }, 'sky'),
    s('path', { d: 'M42 80l12-16 8 10 6-6 10 12z' }, 'green'),
    s('path', { d: 'M86 52h34M86 64h34M86 76h26M40 96h80M40 108h80M40 120h80M40 132h50', ...SW(4) }, 'gray', { stroke: true })
  ],
  hierro: [
    s('path', { d: 'M18 136l8-18h40l8 18zM78 136l8-18h40l8 18z' }, 'gray'),
    s('path', { d: 'M48 118l8-18h40l8 18z' }, 'gray', { accent: true }),
    s('path', { d: 'M18 136l8-18h40l8 18zM78 136l8-18h40l8 18zM48 118l8-18h40l8 18z', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 66V44a20 20 0 0 1 40 0v22', ...SW(12, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true }),
    s('path', { d: 'M60 62v12M100 62v12', ...SW(12, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 82l-4 8M80 82v10M94 82l4 8', ...SW(3) }, 'dark', { stroke: true })
  ],
  ja: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'yellow', { accent: true }),
    s('path', { d: 'M44 58l14 8-14 8M116 58l-14 8 14 8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 90h72q-4 36-36 36t-36-36z' }, 'dark'),
    s('path', { d: 'M62 116q18-12 36 0q-18 12-36 0z' }, 'red'),
    s('path', { d: 'M30 74q-10 14-2 20q8 0 6-14zM130 74q10 14 2 20q-8 0-6-14z' }, 'sky')
  ],
  juro: [
    s('path', { d: 'M54 98L40 52', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M38 30v12M32 34v10M44 34v10', ...SW(5) }, 'skin', { stroke: true }),
    s('circle', { cx: 39, cy: 48, r: 9 }, 'skin'),
    ...person(66, 136, 'navy'),
    s('path', { d: 'M78 100l18-8', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M100 136h28l-4-38h-20z' }, 'brown'),
    s('path', { d: 'M88 92l26-8 26 8-26 8z' }, 'red', { accent: true }),
    ground()
  ],
  monte: [
    backdrop('sky'),
    s('path', { d: 'M90 136l28-44 28 44z' }, 'mint'),
    s('path', { d: 'M14 136L72 40l64 96z' }, 'green', { accent: true }),
    s('path', { d: 'M58 63l14-23 15 25-8-5-7 7-6-6z' }, 'white'),
    s('path', { d: dots([[102, 38], [114, 34], [124, 40]], 8) }, 'white')
  ],
  olor: [
    s('circle', { cx: 108, cy: 62, r: 30 }, 'skin'),
    s('path', { d: 'M92 56q5 5 10 0M114 56q5 5 10 0M108 62l-6 12h8M100 82q8 4 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 136V104', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: flowerPath(40, 96) }, 'pink'),
    s('circle', { cx: 40, cy: 96, r: 4 }, 'yellow', { accent: true }),
    s('path', { d: 'M52 88q6-10 14-6t14-6t14-6M46 76q6-10 14-6t14-6t12-6', ...SW(3) }, 'purple', { stroke: true })
  ],
  pleno: [
    s('ellipse', { cx: 80, cy: 138, rx: 44, ry: 5 }, 'sky'),
    s('path', { d: 'M46 36h68l-8 100H54z' }, 'blue', { accent: true }),
    s('path', { d: 'M46 36q34-14 68 0zM43 46q-4 8 0 12q4-4 0-12zM117 52q-4 8 0 12q4-4 0-12z' }, 'blue'),
    s('path', { d: 'M58 50l5 70', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: 'M46 36h68l-8 100H54z', ...SW(4) }, 'gray', { stroke: true })
  ],
  porcentaje: [
    s('circle', { cx: 80, cy: 80, r: 58 }, 'blue'),
    s('path', { d: 'M80 80V22A58 58 0 0 1 135.2 97.9z' }, 'orange', { accent: true }),
    s('path', { d: 'M80 80L135.2 97.9A58 58 0 0 1 80 138z' }, 'green'),
    s('path', { d: 'M80 22V80L135.2 97.9M80 80v58', ...SW(3) }, 'white', { stroke: true })
  ],
  posterior: [
    s('circle', { cx: 40, cy: 80, r: 26 }, 'gray'),
    s('circle', { cx: 118, cy: 80, r: 30 }, 'orange', { accent: true }),
    s('path', { d: dots([[40, 80]], 19) + dots([[118, 80]], 22) }, 'white'),
    s('path', { d: 'M40 80V66M40 80h9M118 80V62M118 80l12 10', ...SW(4) }, 'dark', { stroke: true }),
    arrow('M70 80h16M80 72l8 8-8 8', 'green', 5)
  ],
  potencia: [
    s('path', { d: 'M66 98L52 44M94 98l14-54', ...SW(7) }, 'skin', { stroke: true }),
    ...person(80, 136, 'red', { accent: true, w: 32 }),
    s('path', { d: 'M22 44h116', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: rects([[20, 28, 10, 32], [32, 32, 8, 24], [120, 32, 8, 24], [130, 28, 10, 32]]) }, 'black'),
    ground()
  ],
  pretender: [
    s('path', { d: 'M70 98L94 56', ...SW(6) }, 'skin', { stroke: true }),
    ...person(60, 136, 'blue'),
    s('path', { d: 'M100 52l4-4', ...DASH(3, '3 4') }, 'gray', { stroke: true }),
    s('path', { d: star(114, 36, 16) }, 'yellow', { accent: true }),
    s('path', { d: 'M136 18l4-4M140 40h6M96 14l-3-4', ...SW(3) }, 'orange', { stroke: true }),
    ground()
  ],
  riqueza: [
    s('path', { d: 'M64 56l-8-22q24 8 48 0l-8 22q26 16 26 48q0 30-40 30t-40-30q0-32 22-48z' }, 'tan'),
    s('path', { d: 'M62 58h36', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M68 88h24l8 10-20 22-20-22z' }, 'sky'),
    s('path', { d: 'M114 136h30v-8h-30zM114 126h30v-8h-30zM114 116h30v-8h-30z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[30, 128], [22, 112]], 8) }, 'yellow'),
    s('path', { d: 'M114 127h30M114 117h30', ...SW(2) }, 'orange', { stroke: true })
  ],
  salario: [
    s('rect', { x: 40, y: 28, width: 80, height: 44, rx: 4, transform: 'rotate(-8 80 50)' }, 'green'),
    s('circle', { cx: 80, cy: 48, r: 10 }, 'mint'),
    s('rect', { x: 28, y: 60, width: 104, height: 66, rx: 6 }, 'tan', { accent: true }),
    s('path', { d: 'M28 64l52 36 52-36', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: dots([[128, 128], [110, 134]], 10) }, 'yellow')
  ],
  sierra: [
    s('path', { d: teeth }, 'gray'),
    s('path', { d: 'M54 48L144 96V112L54 96z' }, 'gray'),
    s('path', { d: 'M54 48L144 96', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M20 40h36v64H20q-6 0-6-6V46q0-6 6-6z' }, 'brown', { accent: true }),
    s('rect', { x: 24, y: 54, width: 18, height: 34, rx: 6 }, 'white')
  ],
  tabla: [
    s('rect', { x: 16, y: 44, width: 100, height: 84, rx: 10 }, 'brown', { accent: true }),
    s('rect', { x: 108, y: 72, width: 32, height: 26, rx: 9 }, 'brown'),
    s('circle', { cx: 128, cy: 85, r: 5 }, 'white'),
    s('path', { d: 'M28 62q40-6 76 0M28 88q40 6 76 0M28 112q40-6 76 0', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: dots([[52, 78], [74, 84]], 10) }, 'red'),
    s('path', { d: dots([[52, 78], [74, 84]], 5) }, 'pink')
  ],
  vs: [
    s('rect', { x: 14, y: 66, width: 16, height: 30, rx: 4 }, 'dark'),
    s('rect', { x: 130, y: 66, width: 16, height: 30, rx: 4 }, 'dark'),
    s('ellipse', { cx: 50, cy: 80, rx: 24, ry: 28 }, 'red', { accent: true }),
    s('ellipse', { cx: 110, cy: 80, rx: 24, ry: 28 }, 'blue'),
    s('path', { d: 'M44 100q10 8 20-2M116 100q-10 8-20-2', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: burst(80, 80, 16, 7, 8) }, 'yellow'),
    s('path', { d: 'M80 30v14M80 116v14M64 36l4 8M96 36l-4 8', ...SW(4) }, 'orange', { stroke: true })
  ],
  bienestar: [
    s('circle', { cx: 80, cy: 78, r: 60 }, 'mint'),
    s('ellipse', { cx: 80, cy: 120, rx: 40, ry: 12 }, 'blue'),
    s('path', { d: 'M64 116V88q0-12 16-12t16 12v28z' }, 'green', { accent: true }),
    s('path', { d: 'M66 92l-18 22M94 92l18 22', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 80, cy: 60, r: 13 }, 'skin'),
    s('path', { d: heart(80, 30, 8) }, 'red')
  ],
  'concentración': [
    s('path', { d: 'M16 50h46M16 80h46M16 110h46', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M78 50L126 80M78 80H126M78 110L126 80', ...SW(4) }, 'orange', { stroke: true }),
    s('ellipse', { cx: 70, cy: 80, rx: 10, ry: 44 }, 'sky'),
    s('path', { d: burst(130, 80, 17, 9, 8) }, 'orange'),
    s('circle', { cx: 130, cy: 80, r: 7 }, 'red', { accent: true })
  ],
  copia: [
    s('path', { d: rects([[16, 26, 52, 70], [92, 64, 52, 70]]) }, 'white'),
    s('path', { d: rects([[16, 26, 52, 70], [92, 64, 52, 70]]), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 80l12-18 12 18zM100 118l12-18 12 18z' }, 'green', { accent: true }),
    s('path', { d: dots([[54, 44], [130, 82]], 6) }, 'orange'),
    arrow('M44 108q8 22 40 16M74 114l10 10-12 6', 'blue', 5)
  ],
  corona: [
    s('path', { d: 'M20 120q60-24 120 0v10q-60 14-120 0z' }, 'purple'),
    s('path', { d: dots([[22, 132], [138, 132]], 5) }, 'yellow'),
    s('path', { d: 'M36 104l-6-56 26 26 24-40 24 40 26-26-6 56z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[30, 46], [80, 32], [130, 46]], 6) }, 'yellow'),
    s('rect', { x: 36, y: 94, width: 88, height: 12, rx: 3 }, 'orange'),
    s('path', { d: dots([[56, 100], [80, 100], [104, 100]], 4) }, 'red')
  ],
  cristina: [
    s('circle', { cx: 80, cy: 112, r: 30 }, 'skin'),
    s('path', { d: 'M42 100L48 70Q80 54 112 64L118 100Z' }, 'green', { accent: true }),
    s('path', { d: 'M48 86Q80 74 114 84', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: star(60, 88, 6) }, 'yellow'),
    s('path', { d: dots([[70, 118], [90, 118]], 3) }, 'dark'),
    s('path', { d: 'M74 130h12', ...SW(3) }, 'dark', { stroke: true })
  ],
  determinar: [
    s('path', { d: 'M80 140V96L44 52M80 96l36-44', ...SW(14) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 136V100l32-40', ...DASH(3) }, 'white', { stroke: true }),
    s('circle', { cx: 122, cy: 36, r: 15 }, 'green', { accent: true }),
    s('circle', { cx: 38, cy: 36, r: 15 }, 'gray'),
    s('path', { d: 'M115 36l5 6 9-11', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M31 36h14', ...SW(4) }, 'white', { stroke: true })
  ],
  fracaso: [
    s('path', { d: 'M24 20v116h120', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 44l26 16 18-12 22 40 18-6 16 32', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M140 134L137 110L123 118z' }, 'red', { accent: true }),
    s('path', { d: 'M44 120l8-6 4 10zM66 126l6-8 6 8z' }, 'gray')
  ],
  'fábrica': [
    s('path', { d: dots([[126, 42], [136, 30], [124, 20]], 8) }, 'gray'),
    s('path', { d: 'M20 136V80l30 18V80l30 18V80l30 18v38z' }, 'tan'),
    s('rect', { x: 112, y: 50, width: 20, height: 86 }, 'red', { accent: true }),
    s('path', { d: rects([[28, 108, 14, 12], [58, 108, 14, 12], [88, 108, 14, 12]]) }, 'sky'),
    ground()
  ],
  margen: [
    s('rect', { x: 28, y: 16, width: 104, height: 128, rx: 4 }, 'white'),
    s('path', { d: 'M32 16h24v128H32a4 4 0 0 1-4-4V20a4 4 0 0 1 4-4z' }, 'pink', { accent: true }),
    outline({ x: 28, y: 16, width: 104, height: 128, rx: 4 }),
    s('path', { d: 'M56 20v120', ...DASH(3, '5 5') }, 'red', { stroke: true }),
    s('path', { d: 'M64 34h56M64 48h56M64 62h56M64 76h48M64 90h56M64 104h56M64 118h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 80h16M38 76l-4 4 4 4M46 76l4 4-4 4', ...SW(2) }, 'dark', { stroke: true })
  ],
  peligroso: [
    s('path', { d: 'M80 20l64 112H16z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 20l64 112H16z', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 50l-20 40h14l-8 32 26-44H84l10-28z' }, 'black')
  ],
  'secretaría': [
    ...person(80, 112, 'purple', { h: 36 }),
    s('rect', { x: 96, y: 66, width: 38, height: 28, rx: 3 }, 'dark'),
    s('rect', { x: 100, y: 70, width: 30, height: 20, rx: 2 }, 'sky', { accent: true }),
    s('rect', { x: 20, y: 96, width: 120, height: 40, rx: 4 }, 'brown'),
    s('path', { d: 'M24 84h32v12H24z' }, 'blue'),
    s('path', { d: 'M28 80h24v6H28z' }, 'cream'),
    s('path', { d: 'M80 104v32M40 112h20M100 112h20', ...SW(3) }, 'dark', { stroke: true })
  ],
  suficientemente: [
    s('path', { d: 'M24 110A56 56 0 0 1 52 61.5', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true }),
    s('path', { d: 'M52 61.5A56 56 0 0 1 108 61.5', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'yellow', { stroke: true }),
    s('path', { d: 'M108 61.5A56 56 0 0 1 136 110', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'green', { stroke: true }),
    s('rect', { x: 18, y: 116, width: 124, height: 10, rx: 5 }, 'gray'),
    s('path', { d: 'M80 110L120 86', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 110, r: 9 }, 'dark', { accent: true })
  ],
  superar: [
    s('path', { d: 'M22 120Q34 80 60 72', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M56 136V104M104 136V104', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 50, y: 96, width: 60, height: 10, rx: 3 }, 'red', { accent: true }),
    ...lean(84, 84, 30, 'blue'),
    ground()
  ],
  'transmisión': [
    s('path', { d: 'M80 40L56 136M80 40l24 96M64 104h32M68 84h24M72 64h16M60 120l36-16M64 104l28-20M68 84l20-20', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 36, r: 8 }, 'red', { accent: true }),
    s('path', { d: 'M62 20q-10 16 0 32M98 20q10 16 0 32M46 12q-18 24 0 48M114 12q18 24 0 48', ...SW(5) }, 'blue', { stroke: true }),
    ground()
  ],
  'ubicación': [
    backdrop('mint'),
    s('path', { d: 'M14 104L146 70M60 14l30 132', ...SW(10) }, 'white', { stroke: true }),
    s('path', { d: rects([[22, 22, 26, 24], [110, 110, 28, 26]]) }, 'green'),
    s('ellipse', { cx: 80, cy: 110, rx: 12, ry: 4 }, 'dark'),
    s('path', { d: 'M80 30a26 26 0 0 1 26 26c0 22-26 52-26 52s-26-30-26-52a26 26 0 0 1 26-26z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 56, r: 9 }, 'white')
  ],
  antecedente: [
    s('path', { d: 'M18 40h44l8 10h72v86H18z' }, 'tan'),
    s('rect', { x: 28, y: 62, width: 34, height: 40, rx: 3 }, 'sky'),
    s('path', { d: busts([45], 102, 20, 16) + dots([[45, 78], [45, 78]], 8) }, 'navy'),
    s('path', { d: 'M72 70h40M72 84h40M72 98h20', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 120, cy: 114, r: 20 }, 'orange', { accent: true }),
    s('path', { d: 'M120 114v-12M120 114l-8 6', ...SW(4) }, 'white', { stroke: true })
  ],
  anuncio: [
    s('path', { d: 'M50 100v36M110 100v36', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 16, y: 26, width: 128, height: 78, rx: 6 }, 'dark'),
    s('rect', { x: 22, y: 32, width: 116, height: 66, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: burst(56, 65, 26, 15, 10) }, 'red'),
    s('path', { d: 'M94 52h32M94 66h32M94 80h20', ...SW(5) }, 'dark', { stroke: true }),
    ground()
  ],
  aplicar: [
    s('ellipse', { cx: 66, cy: 120, rx: 48, ry: 16 }, 'skin'),
    s('path', { d: 'M100 110q14-12 24-4', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M52 112q6-16 18-8q12-4 12 8z' }, 'mint'),
    s('path', { d: 'M76 96q-4 6-6 8', ...SW(4) }, 'mint', { stroke: true }),
    s('rect', { x: 84, y: 20, width: 28, height: 56, rx: 4, transform: 'rotate(35 98 48)' }, 'blue', { accent: true }),
    s('rect', { x: 90, y: 76, width: 16, height: 10, rx: 2, transform: 'rotate(35 98 48)' }, 'white'),
    s('rect', { x: 84, y: 16, width: 28, height: 6, transform: 'rotate(35 98 48)' }, 'gray')
  ],
  audio: [
    s('path', { d: 'M32 40h96a14 14 0 0 1 14 14v40a14 14 0 0 1-14 14H50l-18 16v-16a14 14 0 0 1-14-14V54a14 14 0 0 1 14-14z' }, 'green', { accent: true }),
    s('path', { d: 'M34 62l18 12-18 12z' }, 'white'),
    s('path', { d: 'M66 72v4M74 66v16M82 58v32M90 68v12M98 62v24M106 70v8M114 60v28M122 68v12M130 72v4', ...SW(4) }, 'white', { stroke: true })
  ],
  broma: [
    s('path', { d: 'M80 96l-12-6 24-6-24-6 24-6-12-6', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 40, y: 96, width: 80, height: 40, rx: 4 }, 'red'),
    s('path', { d: 'M40 96L18 76l4-6 26 22z' }, 'blue'),
    s('path', { d: star(80, 116, 10) }, 'yellow'),
    s('circle', { cx: 80, cy: 52, r: 16 }, 'skin'),
    s('path', { d: 'M66 42l14-28 14 28z' }, 'purple', { accent: true }),
    s('circle', { cx: 80, cy: 56, r: 4 }, 'red'),
    s('path', { d: 'M72 62q8 6 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  castellano: [
    s('path', { d: 'M20 136V58h8v8h8v-8h8v8h8v-8V136zM108 136V58h8v8h8v-8h8v8h8v-8V136z' }, 'gray'),
    s('rect', { x: 52, y: 84, width: 56, height: 52 }, 'gray'),
    s('path', { d: 'M68 136v-22a12 12 0 0 1 24 0v22z' }, 'brown'),
    s('path', { d: 'M60 18h40a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H88l-8 10-8-10H60a8 8 0 0 1-8-8V26a8 8 0 0 1 8-8z' }, 'yellow', { accent: true }),
    s('path', { d: 'M64 30h32M64 40h22', ...SW(4) }, 'dark', { stroke: true }),
    ground()
  ],
  cifra: [
    s('path', { d: 'M24 52h112M24 80h112M24 108h112', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 20, y: 28, width: 120, height: 104, rx: 6, ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: dots([[34, 52], [47, 52], [60, 52], [112, 52], [125, 52]], 6) }, 'red', { accent: true }),
    s('path', { d: dots([[34, 80], [47, 80], [99, 80], [112, 80], [125, 80]], 6) }, 'blue'),
    s('path', { d: dots([[34, 108], [47, 108], [60, 108], [73, 108], [125, 108]], 6) }, 'green')
  ],
  columna: [
    s('rect', { x: 52, y: 40, width: 56, height: 84 }, 'cream'),
    s('path', { d: 'M52 40v84M108 40v84M64 44v76M76 44v76M84 44v76M96 44v76', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 22h84v10q-8 0-8 8H46q0-8-8-8z' }, 'tan', { accent: true }),
    s('path', { d: 'M46 124h68v6h6v8H40v-8h6z' }, 'tan')
  ],
  correspondiente: [
    s('path', { d: 'M44 36L116 82M44 82L116 126M44 118L116 40', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[32, 36], [128, 82]], 12) }, 'blue', { accent: true }),
    s('path', { d: rects([[20, 70, 24, 24], [116, 114, 24, 24]]) }, 'green'),
    s('path', { d: 'M32 104l13 22H19zM128 26l13 22h-26z' }, 'orange')
  ],
  cura: [
    s('rect', { x: 20, y: 62, width: 120, height: 36, rx: 18, transform: 'rotate(45 80 80)' }, 'tan'),
    s('rect', { x: 20, y: 62, width: 120, height: 36, rx: 18, transform: 'rotate(-45 80 80)' }, 'tan', { accent: true }),
    s('rect', { x: 64, y: 64, width: 32, height: 32, rx: 4, transform: 'rotate(45 80 80)' }, 'cream'),
    s('path', { d: dots([[38, 44], [46, 52], [114, 44], [122, 36], [38, 116], [46, 108], [114, 116], [122, 124]], 2) }, 'brown'),
    s('path', { d: 'M80 70v20M70 80h20', ...SW(5) }, 'red', { stroke: true })
  ],
  empresario: [
    ...person(70, 136, 'navy', { h: 50, w: 36, r: 13 }),
    s('path', { d: 'M57 68a13 13 0 0 1 26 0z' }, 'dark'),
    s('path', { d: 'M62 86l8 14 8-14z' }, 'white'),
    s('path', { d: 'M70 92l-4 20 4 6 4-6z' }, 'red', { accent: true }),
    s('path', { d: 'M106 104v-6h16v6', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 94, y: 104, width: 40, height: 30, rx: 4 }, 'brown'),
    ground()
  ],
  habilidad: [
    s('path', { d: 'M48 78Q50 20 80 20T112 78', ...DASH(3) }, 'gray', { stroke: true }),
    ...person(80, 136, 'green'),
    s('path', { d: 'M66 98L48 84M94 98l18-14', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 46, cy: 54, r: 9 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 24, r: 9 }, 'blue'),
    s('circle', { cx: 114, cy: 54, r: 9 }, 'yellow'),
    ground()
  ],
  imaginar: [
    ...person(46, 136, 'blue'),
    s('circle', { cx: 62, cy: 62, r: 4 }, 'sky'),
    s('circle', { cx: 72, cy: 52, r: 6 }, 'sky'),
    s('path', { d: dots([[98, 40], [116, 30], [132, 42], [120, 54], [100, 54]], 16) }, 'sky'),
    s('ellipse', { cx: 116, cy: 42, rx: 22, ry: 6, ...SW(3), transform: 'rotate(-15 116 42)' }, 'orange', { stroke: true }),
    s('circle', { cx: 116, cy: 42, r: 11 }, 'purple', { accent: true }),
    s('path', { d: star(94, 50, 5) }, 'yellow'),
    ground()
  ],
  'enseñanza': [
    s('rect', { x: 46, y: 20, width: 96, height: 68, rx: 4 }, 'brown'),
    s('rect', { x: 52, y: 26, width: 84, height: 56, rx: 2 }, 'green', { accent: true }),
    s('path', { d: 'M64 70l14-30 14 30zM100 70h26' + ring(112, 48, 10), ...SW(3) }, 'white', { stroke: true }),
    ...person(30, 136, 'purple'),
    s('path', { d: 'M42 98L66 66', ...SW(3) }, 'brown', { stroke: true }),
    ground()
  ],
  entidad: [
    s('path', { d: 'M80 24l48 24-48 24-48-24z' }, 'sky'),
    s('path', { d: 'M32 48l48 24v60L32 108z' }, 'blue', { accent: true }),
    s('path', { d: 'M128 48L80 72v60l48-24z' }, 'navy'),
    s('path', { d: 'M80 72v60M32 48l48 24 48-24', ...SW(2) }, 'white', { stroke: true })
  ],
  entrenamiento: [
    s('ellipse', { cx: 80, cy: 140, rx: 30, ry: 4 }, 'gray'),
    s('path', { d: 'M52 102C40 4 120 4 108 102', ...SW(3) }, 'dark', { stroke: true }),
    ...person(80, 126, 'orange', { accent: true }),
    s('path', { d: 'M66 92l-14 10M94 92l14 10', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M52 102v10M108 102v10', ...SW(6) }, 'red', { stroke: true })
  ],
  'espectáculo': [
    s('path', { d: 'M74 30h12l26 74H48z' }, 'yellow'),
    s('path', { d: 'M14 30h22q-4 50 8 86H14zM146 30h-22q4 50-8 86h30z' }, 'red'),
    s('path', { d: 'M14 14h132v18q-16 10-33 0-16 10-33 0-17 10-33 0-17 10-33 0z' }, 'red'),
    s('rect', { x: 14, y: 104, width: 132, height: 14 }, 'brown'),
    ...person(80, 104, 'purple', { accent: true, h: 30, w: 22, r: 10 }),
    s('path', { d: dots([[30, 136], [56, 136], [82, 136], [108, 136], [134, 136]], 10) }, 'black')
  ],
  'fenómeno': [
    backdrop('navy'),
    s('path', { d: dots([[30, 30], [60, 22], [120, 26], [136, 50], [44, 58]], 2) }, 'white'),
    s('path', { d: 'M14 70Q50 30 80 60T146 40v20Q110 70 80 80T14 90z' }, 'green', { accent: true }),
    s('path', { d: 'M14 92Q50 70 80 84T146 66v14Q110 90 80 98T14 104z' }, 'mint'),
    s('path', { d: 'M14 134l30-34 24 22 26-34 34 30 18-14v34a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'dark')
  ],
  funcionamiento: [
    ...gear(58, 92, 24, 10, 'gray'),
    ...gear(100, 65, 16, 8, 'orange', { accent: true }),
    s('path', { d: dots([[58, 92], [100, 65]], 6) }, 'dark'),
    arrow('M118 22Q140 30 142 54M136 48l6 6 4-8', 'blue', 4),
    arrow('M30 136Q14 122 16 100M10 106l6-6 6 6', 'blue', 4)
  ],
  intercambio: [
    ...person(30, 136, 'blue'),
    ...person(130, 136, 'green'),
    arrow('M40 52Q80 22 120 52M110 40l10 12-14 4', 'orange', 5),
    arrow('M120 74Q80 104 40 74M50 86L40 74l14-4', 'purple', 5),
    s('rect', { x: 70, y: 28, width: 20, height: 16, rx: 3 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 96, r: 9 }, 'yellow'),
    ground()
  ],
  'introducción': [
    ...person(36, 136, 'blue'),
    ...person(124, 136, 'green', { accent: true }),
    s('path', { d: 'M48 104L76 100M112 104L84 100', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 80, cy: 100, r: 8 }, 'skin'),
    s('path', { d: 'M22 22h40a8 8 0 0 1 8 8v14a8 8 0 0 1-8 8H48l-8 10v-10H22a8 8 0 0 1-8-8V30a8 8 0 0 1 8-8z' }, 'yellow'),
    s('path', { d: dots([[30, 37], [42, 37], [54, 37]], 3) }, 'dark'),
    s('path', { d: 'M80 74v-10M66 80l-6-6M94 80l6-6', ...SW(3) }, 'orange', { stroke: true }),
    ground()
  ],
  organismo: [
    s('path', { d: 'M40 40Q70 14 104 30Q140 40 136 84Q140 128 96 134Q60 144 34 116Q12 90 24 64Q28 48 40 40z' }, 'mint'),
    s('path', { d: 'M40 40Q70 14 104 30Q140 40 136 84Q140 128 96 134Q60 144 34 116Q12 90 24 64Q28 48 40 40z', ...SW(4) }, 'green', { stroke: true }),
    s('circle', { cx: 86, cy: 78, r: 20 }, 'purple', { accent: true }),
    s('circle', { cx: 90, cy: 74, r: 7 }, 'navy'),
    s('path', { d: dots([[44, 70], [56, 110], [116, 108], [112, 50], [60, 46]], 5) }, 'green'),
    s('path', { d: 'M40 92q8-8 16 0t16 0', ...SW(3) }, 'orange', { stroke: true })
  ],
  organizado: [
    s('rect', { x: 20, y: 18, width: 120, height: 124, rx: 4 }, 'brown'),
    s('path', { d: rects([[26, 24, 108, 52], [26, 82, 108, 54]]) }, 'cream'),
    s('path', { d: rects([[30, 36, 12, 40], [44, 36, 12, 40], [58, 36, 12, 40]]) }, 'red', { accent: true }),
    s('path', { d: rects([[74, 36, 12, 40], [88, 36, 12, 40], [102, 36, 12, 40], [116, 36, 12, 40]]) }, 'blue'),
    s('path', { d: rects([[30, 102, 32, 34], [66, 102, 32, 34], [102, 102, 28, 34]]) }, 'green'),
    s('path', { d: 'M40 112h12M76 112h12M110 112h12', ...SW(4) }, 'white', { stroke: true })
  ],
  pedo: [
    ...person(54, 136, 'blue'),
    s('path', { d: dots([[100, 112], [114, 102], [126, 114], [112, 122]], 11) }, 'green', { accent: true }),
    s('path', { d: dots([[136, 92], [140, 78]], 4) }, 'mint'),
    s('path', { d: 'M74 106h10M74 118h12', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 76q6 4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    ground()
  ],
  poseer: [
    ...person(80, 136, 'purple'),
    s('rect', { x: 50, y: 98, width: 60, height: 36, rx: 4 }, 'brown'),
    s('path', { d: 'M50 98q30-22 60 0z' }, 'orange'),
    s('rect', { x: 74, y: 100, width: 12, height: 14, rx: 2 }, 'yellow', { accent: true }),
    s('path', { d: 'M62 96l-10 14M98 96l10 14', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: star(46, 56, 7) + star(116, 52, 9) }, 'yellow'),
    ground()
  ],
};
