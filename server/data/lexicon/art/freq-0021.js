// Illustration specs for common words, batches 0018, 0020, 0021 and 0022 (see server/scripts/lexicon/art.js)
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

// A simple car seen from the side: body, cabin, wheels (x = left edge, y = top of body)
const car = (x, y, color, cabin = 'sky', opts = {}) => [
  s('path', { d: `M${x + 12} ${y}l8-14h22l8 14z` }, cabin),
  s('rect', { x, y, width: 60, height: 20, rx: 6 }, color, opts),
  s('path', { d: dots([[x + 14, y + 20], [x + 46, y + 20]], 8) }, 'dark')
];
// A sheet of white paper with a gray outline
const paper = (x, y, w, h) => [
  s('rect', { x, y, width: w, height: h, rx: 3 }, 'white'),
  outline({ x, y, width: w, height: h, rx: 3 })
];

// Points on the upper half of a circle around the chamber centre (80, 118)
const seats = (r, n) => Array.from({ length: n }, (_, i) => around(80, 118, r, 1, 180 + i * 180 / (n - 1))[0]);

// Path data: a pointed leaflet from (x, y) at angle a (degrees), length L, half-width w
const leaflet = (x, y, a, L, w) => {
  const r = a * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r);
  const tx = x + L * c, ty = y + L * sn, mx = x + L * 0.5 * c, my = y + L * 0.5 * sn;
  const f = n => n.toFixed(1);
  return `M${x} ${y}Q${f(mx - w * sn)} ${f(my + w * c)} ${f(tx)} ${f(ty)}Q${f(mx + w * sn)} ${f(my - w * c)} ${x} ${y}z`;
};
// Path data: right-facing fish bodies and tails
const fishes = pts => ells(pts.map(([x, y]) => [x, y, 12, 7])) + pts.map(([x, y]) => `M${x - 10} ${y}l-10-7v14z`).join('');
// Path data: a speech bubble (rounded box with a tail at its lower left)
const bubble = (x, y, w, h) => `M${x + 8} ${y}h${w - 16}a8 8 0 0 1 8 8v${h - 16}a8 8 0 0 1-8 8H${x + 26}l-12 12v-12h-6a8 8 0 0 1-8-8v${-(h - 16)}a8 8 0 0 1 8-8z`;

module.exports = {
  rayo: [
    backdrop('navy'),
    s('path', { d: ells([[56, 46, 24, 16], [88, 38, 30, 22], [114, 48, 22, 16]]) }, 'gray'),
    s('rect', { x: 34, y: 44, width: 102, height: 22, rx: 11 }, 'gray'),
    s('path', { d: 'M86 64l-22 38h18l-12 40 38-54H88l12-24z' }, 'yellow', { accent: true })
  ],
  vasco: [
    s('ellipse', { cx: 80, cy: 122, rx: 64, ry: 12 }, 'gray'),
    s('path', { d: 'M26 72L134 96v24H26z' }, 'cream', { accent: true }),
    s('path', { d: 'M26 70L134 94', ...SW(10) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 74v46', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M28 120h104', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M120 22v44M112 22v12q0 8 8 8q8 0 8-8V22', ...SW(4) }, 'gray', { stroke: true })
  ],
  visible: [
    s('path', { d: 'M14 80q30-34 60 0q-30 34-60 0z' }, 'white'),
    s('path', { d: 'M14 80q30-34 60 0q-30 34-60 0z', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 44, cy: 80, r: 12 }, 'blue', { accent: true }),
    s('circle', { cx: 44, cy: 80, r: 5 }, 'dark'),
    s('path', { d: 'M80 70L110 58M80 90l30 12', ...DASH(4) }, 'gray', { stroke: true }),
    s('path', { d: star(124, 80, 22) }, 'yellow')
  ],
  'aceptación': [
    ...paper(34, 22, 72, 104),
    s('path', { d: 'M46 42h48M46 56h48M46 70h32', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 108, cy: 108, r: 26 }, 'green', { accent: true }),
    s('path', { d: 'M96 108l8 9 16-18', ...SW(6) }, 'white', { stroke: true })
  ],
  'agustín': [
    ground(),
    s('path', { d: 'M28 136V56M132 136V56', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: ells([[28, 46, 18, 14], [132, 46, 18, 14]]) }, 'green'),
    s('circle', { cx: 80, cy: 28, r: 12 }, 'yellow'),
    s('circle', { cx: 48, cy: 76, r: 10 }, 'skin'),
    s('ellipse', { cx: 84, cy: 84, rx: 28, ry: 9 }, 'blue'),
    s('path', { d: 'M28 70q52 52 104 0q-52 36-104 0z' }, 'orange', { accent: true })
  ],
  apreciar: [
    s('path', { d: sparkle(34, 36, 10) + sparkle(126, 32, 8) + sparkle(134, 88, 6) }, 'yellow'),
    s('path', { d: 'M56 52h48l14 16-38 40-38-40z' }, 'sky', { accent: true }),
    s('path', { d: 'M42 68h76M68 52l-6 16 18 40 18-40-6-16', ...SW(2) }, 'blue', { stroke: true }),
    s('path', { d: ells([[54, 118, 30, 14], [106, 118, 30, 14]]) }, 'skin')
  ],
  atractivo: [
    s('path', { d: 'M44 64v30a36 36 0 0 0 72 0V64', ...SW(20, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M44 48v16M116 48v16', ...SW(20, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('path', { d: heart(50, 26, 9) + heart(110, 24, 9) + heart(80, 38, 7) }, 'pink')
  ],
  'bahía': [
    backdrop('sky'),
    s('path', { d: 'M14 70h132v64a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'blue'),
    s('path', { d: 'M14 80q34 4 36 34q2 22 28 32H26a12 12 0 0 1-12-12zM146 92q-30 2-34 26q-4 20-24 28h46a12 12 0 0 0 12-12z' }, 'green'),
    s('path', { d: 'M120 98l3-38h10l3 38z' }, 'red'),
    s('path', { d: 'M122 84h12M121 72h14', ...SW(4) }, 'white', { stroke: true }),
    s('circle', { cx: 128, cy: 54, r: 6 }, 'yellow', { accent: true }),
    s('path', { d: 'M60 86q6-4 12 0M76 104q6-4 12 0', ...SW(2) }, 'white', { stroke: true })
  ],
  campesino: [
    s('path', { d: 'M14 112h132v24H14z' }, 'brown'),
    s('path', { d: 'M20 120h120M20 129h120', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M100 36v76', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M94 112h16', ...SW(6) }, 'gray', { stroke: true }),
    ...person(66, 112, 'green', { accent: true }),
    s('path', { d: 'M80 82l20-8', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M56 46q0-16 10-16q10 0 10 16z' }, 'tan'),
    s('ellipse', { cx: 66, cy: 46, rx: 22, ry: 5 }, 'tan')
  ],
  capitalismo: [
    ground(),
    s('rect', { x: 26, y: 48, width: 10, height: 36 }, 'dark'),
    s('path', { d: 'M20 136V80l22 14V80l22 14V80l22 14v42z' }, 'gray'),
    s('path', { d: rects([[30, 108, 10, 10], [52, 108, 10, 10], [74, 108, 10, 10]]) }, 'sky'),
    s('path', { d: 'M96 136V96h22v40zM122 136V76h22v60z' }, 'yellow', { accent: true }),
    s('path', { d: 'M96 106h22M96 116h22M96 126h22M122 86h22M122 96h22M122 106h22M122 116h22M122 126h22', ...SW(2) }, 'orange', { stroke: true }),
    s('circle', { cx: 118, cy: 44, r: 16 }, 'yellow'),
    s('circle', { cx: 118, cy: 44, r: 10, ...SW(3) }, 'orange', { stroke: true })
  ],
  cargar: [
    ground(),
    s('path', { d: rects([[62, 40, 36, 26], [66, 16, 28, 24]]) }, 'tan'),
    s('path', { d: 'M80 40v10M80 16v8', ...SW(3) }, 'brown', { stroke: true }),
    ...person(80, 136, 'orange', { accent: true }),
    s('path', { d: 'M68 96L62 64M92 96l6-32', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: drop(112, 76, 4) + drop(120, 92, 3) }, 'sky'),
    s('path', { d: 'M108 112q8-4 12 4M112 124q8-4 12 4', ...SW(3) }, 'gray', { stroke: true })
  ],

  ciar: [
    s('path', { d: 'M14 104q11-8 22 0t22 0t22 0t22 0t22 0t22 0V146H14z' }, 'blue'),
    s('path', { d: 'M70 78L40 118M90 78l30 40', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M24 90h112l-14 22H38z' }, 'brown'),
    ...person(80, 90, 'orange', { h: 26, w: 22, r: 10, accent: true }),
    arrow('M122 30H40m14-14L40 30l14 14', 'red', 6)
  ],
  cometer: [
    ...paper(28, 20, 86, 116),
    s('path', { d: 'M40 44h38M40 72h38M40 100h38', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M88 36l14 14M102 36l-14 14M88 92l14 14M102 92l-14 14', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M86 72l6 6 12-12', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M126 128l14-56', ...SW(9) }, 'yellow', { stroke: true }),
    s('path', { d: 'M124 134l2-6', ...SW(5) }, 'dark', { stroke: true })
  ],
  directivo: [
    s('rect', { x: 52, y: 26, width: 56, height: 78, rx: 10 }, 'dark'),
    ...person(80, 104, 'navy', { w: 40, h: 46 }),
    s('path', { d: 'M72 60l8 8 8-8', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M80 62l-5 6 5 24 5-24z' }, 'red', { accent: true }),
    s('rect', { x: 18, y: 100, width: 124, height: 12, rx: 3 }, 'brown'),
    s('path', { d: rects([[26, 112, 16, 26], [118, 112, 16, 26]]) }, 'brown'),
    s('rect', { x: 100, y: 90, width: 30, height: 10, rx: 2 }, 'yellow')
  ],
  elevado: [
    backdrop('sky'),
    s('path', { d: ells([[38, 74, 18, 9], [124, 92, 18, 9], [118, 40, 14, 7]]) }, 'white'),
    s('path', { d: 'M14 126h132v8a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green'),
    s('rect', { x: 70, y: 56, width: 20, height: 72 }, 'gray'),
    s('rect', { x: 56, y: 50, width: 48, height: 8, rx: 2 }, 'dark'),
    ...person(80, 50, 'red', { h: 20, w: 16, r: 8, accent: true })
  ],
  estimado: [
    s('rect', { x: 16, y: 46, width: 110, height: 76, rx: 4 }, 'cream'),
    s('rect', { x: 16, y: 46, width: 110, height: 76, rx: 4, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M16 50l55 40 55-40', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 71, cy: 92, r: 13 }, 'red', { accent: true }),
    s('path', { d: heart(71, 90, 7) }, 'pink'),
    s('path', { d: 'M108 126q6-64 36-98q0 58-36 98z' }, 'sky'),
    s('path', { d: 'M108 126l28-84', ...SW(2) }, 'navy', { stroke: true })
  ],
  'estrés': [
    ...person(80, 136, 'purple'),
    s('path', { d: 'M66 106L58 82M94 106l8-24', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M73 75l5 3M87 75l-5 3M74 86q6-4 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M46 46c10-24 26 10 34-10s22 14 30-6M48 32c14 20 30-18 44 2s14 0 20 8', ...SW(4) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: drop(54, 74, 5) + drop(108, 70, 5) }, 'sky')
  ],
  federico: [
    s('ellipse', { cx: 80, cy: 86, rx: 50, ry: 56 }, 'mint'),
    s('path', { d: 'M70 32q4-14 10 0q6-14 10 0', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 60, cy: 72, r: 14 }, 'white'),
    s('circle', { cx: 100, cy: 76, r: 8 }, 'white'),
    s('path', { d: dots([[62, 74], [98, 78]], 4) }, 'dark'),
    s('ellipse', { cx: 82, cy: 98, rx: 12, ry: 10 }, 'pink', { accent: true }),
    s('circle', { cx: 104, cy: 106, r: 3 }, 'brown'),
    s('path', { d: 'M54 118q20 12 46-6', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 70, y: 120, width: 8, height: 10, rx: 1 }, 'white')
  ],
  gimnasio: [
    s('rect', { x: 18, y: 118, width: 124, height: 10, rx: 5 }, 'blue'),
    s('path', { d: 'M22 80h116', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: rects([[30, 52, 12, 56], [118, 52, 12, 56]]) }, 'dark'),
    s('path', { d: rects([[44, 60, 10, 40], [106, 60, 10, 40]]) }, 'red', { accent: true })
  ],
  'hectárea': [
    s('rect', { x: 30, y: 34, width: 96, height: 96 }, 'green', { accent: true }),
    s('path', { d: 'M30 58h96M30 82h96M30 106h96', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: 'M30 20h96M30 15v10M126 15v10M140 34v96M135 34h10M135 130h10', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 40, y: 64, width: 14, height: 12 }, 'red'),
    s('path', { d: 'M38 66l9-8 9 8z' }, 'brown')
  ],
  hey: [
    s('rect', { x: 60, y: 116, width: 40, height: 28, rx: 4 }, 'blue'),
    s('path', { d: 'M64 76V46M76 72V38M88 72V40M100 78V50M60 98L44 82', ...SW(12) }, 'skin', { stroke: true }),
    s('rect', { x: 56, y: 70, width: 50, height: 52, rx: 16 }, 'skin', { accent: true }),
    s('path', { d: 'M120 42q10 14 6 32M132 32q16 20 8 48M36 40q-8 10-6 24', ...SW(4) }, 'orange', { stroke: true })
  ],
  jodido: [
    ground(130),
    ...car(18, 98, 'blue', 'sky', { accent: true }),
    s('path', { d: ells([[80, 72, 12, 9], [94, 54, 16, 12], [76, 38, 12, 9]]) }, 'gray'),
    s('path', { d: 'M108 128l18-32 18 32z' }, 'red'),
    s('path', { d: 'M117 123l9-17 9 17z' }, 'white')
  ],
  marketing: [
    s('path', { d: rects([[98, 96, 12, 38], [114, 80, 12, 54], [130, 60, 12, 74]]) }, 'green'),
    s('path', { d: 'M44 94l6 26', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M22 66h16l40-26v80L38 94H22z' }, 'red', { accent: true }),
    s('path', { d: 'M86 60q8 12 0 26M94 48q14 22 0 48', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: star(30, 34, 10) }, 'yellow')
  ],
  milla: [
    backdrop('sky'),
    s('path', { d: 'M14 80h132v54a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green'),
    s('path', { d: 'M74 80h12l40 66H34z' }, 'gray'),
    s('path', { d: 'M80 88v8M80 106v12M80 128v14', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M128 120V62', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 110, y: 42, width: 36, height: 22, rx: 3 }, 'yellow', { accent: true }),
    arrow('M116 53h22m-6-6l6 6-6 6', 'dark', 3)
  ],
  'minería': [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[48, 86, 12, 10], [70, 80, 14, 12], [94, 84, 12, 10], [108, 88, 8, 7]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M28 88h92l-10 36H38z' }, 'dark'),
    s('path', { d: dots([[50, 128], [98, 128]], 8) }, 'gray'),
    s('path', { d: 'M96 70L126 26', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M108 18q20-2 30 16', ...SW(6) }, 'gray', { stroke: true })
  ],
  mini: [
    ground(104),
    s('circle', { cx: 70, cy: 94, r: 30 }, 'sky'),
    s('path', { d: 'M63 92l3-6h12l3 6z' }, 'sky'),
    s('rect', { x: 58, y: 92, width: 24, height: 8, rx: 3 }, 'red', { accent: true }),
    s('path', { d: dots([[64, 100], [76, 100]], 3) }, 'dark'),
    s('path', { d: ring(70, 94, 30), ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M92 116l30 26', ...SW(10) }, 'brown', { stroke: true })
  ],
  'mérito': [
    s('path', { d: 'M62 90l-14 50 14-8 8 12 10-46zM98 90l14 50-14-8-8 12-10-46z' }, 'blue'),
    s('path', { d: burst(80, 66, 46, 38, 16) }, 'yellow'),
    s('circle', { cx: 80, cy: 66, r: 30 }, 'orange', { accent: true }),
    s('path', { d: star(80, 66, 18) }, 'yellow')
  ],
  ocultar: [
    ground(),
    s('rect', { x: 120, y: 112, width: 20, height: 24, rx: 2 }, 'brown'),
    s('path', { d: ells([[48, 104, 32, 30], [104, 104, 32, 30], [76, 82, 36, 34]]) }, 'green'),
    s('path', { d: ells([[66, 80, 7, 8], [88, 80, 7, 8]]) }, 'white'),
    s('path', { d: dots([[68, 82], [90, 82]], 3) }, 'dark', { accent: true })
  ],
  pasaje: [
    s('path', { d: 'M18 50h124v18a12 12 0 0 0 0 24v18H18V92a12 12 0 0 0 0-24z' }, 'orange', { accent: true }),
    s('path', { d: 'M112 54v52', ...DASH(3, '4 5') }, 'white', { stroke: true }),
    s('path', { d: 'M36 80q0-5 8-5h44q8 0 10 5q-2 5-10 5H44q-8 0-8-5zM58 80l12-18h6l-4 18zM58 80l12 18h6l-4-18zM40 76l-4-10h6l6 10z' }, 'white'),
    s('path', { d: 'M124 66v28', ...SW(4) }, 'cream', { stroke: true })
  ],
  po: [
    ...person(40, 136, 'blue'),
    s('path', { d: bubble(54, 24, 92, 54) }, 'yellow', { accent: true }),
    s('path', { d: 'M74 50l10 10 20-20', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M118 38l8-6M120 51h10M118 64l8 6', ...SW(3) }, 'orange', { stroke: true })
  ],
  'renovación': [
    s('rect', { x: 20, y: 24, width: 120, height: 108, rx: 4 }, 'gray'),
    s('path', { d: 'M20 28a4 4 0 0 1 4-4h60v108H24a4 4 0 0 1-4-4z' }, 'sky', { accent: true }),
    s('path', { d: 'M118 40l-8 14 8 10-6 12M126 96l-6 10', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(42, 50, 8) + sparkle(52, 104, 6) }, 'white'),
    s('path', { d: 'M94 62h14v40', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 74, y: 40, width: 20, height: 44, rx: 6 }, 'yellow'),
    s('rect', { x: 102, y: 100, width: 12, height: 32, rx: 4 }, 'red')
  ],
  retorno: [
    ground(),
    s('rect', { x: 20, y: 96, width: 50, height: 40 }, 'tan'),
    s('path', { d: 'M14 98l31-30 31 30z' }, 'red', { accent: true }),
    s('rect', { x: 38, y: 114, width: 14, height: 22 }, 'brown'),
    arrow('M82 122h36q22 0 22-22t-22-22H86m12-12L86 78l12 12', 'orange', 8)
  ],
  semestre: [
    s('rect', { x: 20, y: 30, width: 120, height: 104, rx: 8 }, 'white'),
    s('rect', { x: 20, y: 30, width: 120, height: 104, rx: 8, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M20 52V38a8 8 0 0 1 8-8h104a8 8 0 0 1 8 8v14z' }, 'red'),
    s('path', { d: 'M48 22v16M112 22v16', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: rects([[30, 62, 20, 16], [58, 62, 20, 16], [86, 62, 20, 16], [114, 62, 20, 16], [30, 86, 20, 16], [58, 86, 20, 16]]) }, 'blue', { accent: true }),
    s('path', { d: rects([[86, 86, 20, 16], [114, 86, 20, 16], [30, 110, 20, 16], [58, 110, 20, 16], [86, 110, 20, 16], [114, 110, 20, 16]]) }, 'gray')
  ],
  servidor: [
    s('rect', { x: 44, y: 16, width: 72, height: 128, rx: 6 }, 'dark'),
    s('path', { d: rects([[52, 26, 56, 22], [52, 54, 56, 22], [52, 82, 56, 22], [52, 110, 56, 22]]) }, 'gray'),
    s('path', { d: dots([[60, 37], [60, 65], [60, 93], [60, 121]], 3) }, 'green', { accent: true }),
    s('path', { d: 'M74 37h26M74 65h26M74 93h26M74 121h26', ...SW(3) }, 'dark', { stroke: true })
  ],
  terminal: [
    backdrop('sky'),
    s('rect', { x: 112, y: 44, width: 10, height: 60 }, 'gray'),
    s('path', { d: 'M104 46l4-14h26l4 14z' }, 'orange', { accent: true }),
    s('path', { d: 'M18 136V98q62-22 124 0v38z' }, 'gray'),
    s('path', { d: rects([[26, 106, 108, 12]]) }, 'navy'),
    s('path', { d: 'M24 52q0-5 8-5h36q8 0 10 5q-2 5-10 5H32q-8 0-8-5zM42 52l10-14h6l-4 14zM42 52l10 14h6l-4-14zM28 48l-4-10h6l6 10z' }, 'white'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'dark', { stroke: true })
  ],
  terremoto: [
    s('path', { d: 'M14 120h56l8 10-8 6 10 10H14zM146 120H84l8 10-8 6 6 10h56z' }, 'brown'),
    s('rect', { x: 48, y: 64, width: 58, height: 56, transform: 'rotate(-6 77 120)' }, 'tan'),
    s('path', { d: 'M40 66l38-32 38 32z', transform: 'rotate(-6 77 120)' }, 'red', { accent: true }),
    s('path', { d: 'M82 70l-6 14 8 10-6 14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M26 52q-6 10 0 20M18 46q-8 16 0 32M128 54q6 10 0 20M136 48q8 16 0 32', ...SW(4) }, 'orange', { stroke: true })
  ],
  tony: [
    s('path', { d: ells([[40, 76, 20, 18], [120, 76, 20, 18]]) }, 'orange'),
    s('circle', { cx: 80, cy: 86, r: 40 }, 'cream'),
    s('path', { d: 'M62 50l18-36 18 36z' }, 'purple'),
    s('path', { d: 'M66 66v24M94 66v24', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: dots([[66, 78], [94, 78]], 4) }, 'dark'),
    s('circle', { cx: 80, cy: 92, r: 10 }, 'red', { accent: true }),
    s('path', { d: 'M58 104q22 24 44 0q-22 10-44 0z' }, 'red')
  ],
  trampa: [
    s('rect', { x: 18, y: 98, width: 124, height: 24, rx: 3 }, 'tan'),
    s('path', { d: 'M18 120h124', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 98V56h56v42', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 68, cy: 98, r: 7 }, 'dark'),
    s('path', { d: 'M104 98l28-24v24z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[122, 90]], 3) }, 'orange')
  ],
  tremendo: [
    ground(),
    s('path', { d: 'M80 58q0-12 8-20', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: ells([[54, 98, 28, 38], [106, 98, 28, 38]]) }, 'orange'),
    s('ellipse', { cx: 80, cy: 98, rx: 26, ry: 40 }, 'orange', { accent: true }),
    s('path', { d: 'M66 62q-12 36 0 72M94 62q12 36 0 72', ...SW(3) }, 'brown', { stroke: true }),
    ...person(138, 136, 'blue', { h: 14, w: 10, r: 5 })
  ],
  triple: [
    s('path', { d: 'M60 94h40l-20 48z' }, 'tan'),
    s('path', { d: 'M66 104l22 20M94 104l-22 20', ...SW(2) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 86, r: 20 }, 'pink', { accent: true }),
    s('circle', { cx: 80, cy: 58, r: 18 }, 'brown'),
    s('circle', { cx: 80, cy: 32, r: 16 }, 'yellow')
  ],
  vela: [
    s('circle', { cx: 80, cy: 46, r: 24 }, 'yellow', { flatOnly: true }),
    s('ellipse', { cx: 80, cy: 132, rx: 36, ry: 8 }, 'gray'),
    s('rect', { x: 62, y: 68, width: 36, height: 64, rx: 4 }, 'red'),
    s('path', { d: 'M80 68v-10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: drop(80, 46, 9) }, 'orange', { accent: true }),
    s('path', { d: drop(80, 50, 4.5) }, 'yellow')
  ],
  vuelo: [
    backdrop('sky'),
    s('path', { d: 'M34 118Q80 20 126 100', ...DASH(4, '8 7') }, 'navy', { stroke: true }),
    s('path', { d: 'M34 126q-10-12-10-20a10 10 0 0 1 20 0q0 8-10 20zM126 108q-10-12-10-20a10 10 0 0 1 20 0q0 8-10 20z' }, 'red'),
    s('path', { d: 'M54 66q0-5 8-5h36q8 0 10 5q-2 5-10 5H62q-8 0-8-5zM72 66l10-16h6l-4 16zM72 66l10 16h6l-4-16zM58 62l-4-10h6l6 10z', transform: 'rotate(-12 80 66)' }, 'white', { accent: true })
  ],
  absurdo: [
    s('ellipse', { cx: 80, cy: 112, rx: 54, ry: 16 }, 'white'),
    s('ellipse', { cx: 80, cy: 112, rx: 54, ry: 16, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 50h26v36q0 6 6 8l20 4q10 2 10 12H54q-4 0-4-8z' }, 'brown', { accent: true }),
    s('rect', { x: 50, y: 106, width: 70, height: 6, rx: 3 }, 'dark'),
    s('path', { d: 'M18 76v56M12 70v12q0 8 6 8q6 0 6-8V70', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M142 70q-10 14-8 34h8zM142 104v28', ...SW(4) }, 'gray', { stroke: true })
  ],
  'artístico': [
    s('ellipse', { cx: 80, cy: 82, rx: 62, ry: 50 }, 'tan'),
    s('circle', { cx: 106, cy: 108, r: 10 }, 'white'),
    s('circle', { cx: 50, cy: 64, r: 10 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 52, r: 10 }, 'yellow'),
    s('circle', { cx: 112, cy: 62, r: 10 }, 'blue'),
    s('circle', { cx: 46, cy: 96, r: 10 }, 'green'),
    s('path', { d: 'M74 116l52-78', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M70 122l4-6', ...SW(9) }, 'purple', { stroke: true })
  ],
  ascenso: [
    s('path', { d: 'M14 136v-20h28v-22h28v-22h28v-22h34v86z' }, 'tan'),
    ...person(115, 50, 'red', { h: 22, w: 16, r: 9, accent: true }),
    arrow('M22 86L64 44m-16 0h16v16', 'green', 6)
  ],
  asociado: [
    ground(),
    ...person(48, 136, 'navy'),
    ...person(112, 136, 'purple'),
    s('path', { d: 'M60 100l14-6M100 100l-14-6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M72 98v-6h16v6', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 62, y: 98, width: 36, height: 26, rx: 3 }, 'brown', { accent: true })
  ],
  brutal: [
    s('path', { d: burst(92, 70, 60, 44, 12) }, 'yellow'),
    s('rect', { x: 14, y: 96, width: 26, height: 36, rx: 6 }, 'red', { accent: true }),
    s('path', { d: 'M34 114h62M100 112l8-56', ...SW(24) }, 'skin', { stroke: true }),
    s('ellipse', { cx: 66, cy: 100, rx: 24, ry: 16 }, 'skin'),
    s('circle', { cx: 108, cy: 46, r: 16 }, 'skin'),
    s('path', { d: 'M100 40h14M100 48h14', ...SW(2) }, 'tan', { stroke: true })
  ],
  cartero: [
    ...person(64, 136, 'blue', { accent: true }),
    s('path', { d: 'M51 72a13 13 0 0 1 26 0h8v4H51z' }, 'navy'),
    s('path', { d: 'M52 94l26 30', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 72, y: 112, width: 30, height: 22, rx: 4 }, 'brown'),
    s('path', { d: 'M78 102l22-20', ...SW(7) }, 'skin', { stroke: true }),
    ...paper(96, 58, 40, 28),
    s('path', { d: 'M98 60l18 13 18-13', ...SW(3) }, 'red', { stroke: true })
  ],
  'catálogo': [
    s('path', { d: 'M16 40q32-8 64 4q32-12 64-4v88q-32-8-64 4q-32-12-64-4z' }, 'white'),
    s('path', { d: 'M16 40q32-8 64 4q32-12 64-4v88q-32-8-64 4q-32-12-64-4zM80 44v88', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: rects([[26, 56, 20, 20], [52, 56, 20, 20], [26, 88, 20, 20], [52, 88, 20, 20]]) }, 'sky'),
    s('path', { d: rects([[88, 56, 20, 20], [114, 56, 20, 20], [88, 88, 20, 20], [114, 88, 20, 20]]) }, 'orange', { accent: true }),
    s('path', { d: 'M28 80h10M54 80h10M28 112h10M54 112h10M90 80h10M116 80h10M90 112h10M116 112h10', ...SW(2) }, 'dark', { stroke: true })
  ],
  cementerio: [
    backdrop('navy'),
    s('circle', { cx: 120, cy: 36, r: 12 }, 'cream'),
    s('circle', { cx: 126, cy: 31, r: 11 }, 'navy'),
    s('path', { d: 'M14 116q66-14 132 0v18a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green'),
    s('path', { d: 'M30 124V84a18 18 0 0 1 36 0v40zM90 124V74a22 22 0 0 1 44 0v50z' }, 'gray', { accent: true }),
    s('path', { d: 'M40 92h16M100 86h24M100 96h24', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: dots([[72, 122], [80, 118], [84, 126]], 4) }, 'pink')
  ],
  continental: [
    s('rect', { x: 14, y: 24, width: 132, height: 112, rx: 10 }, 'blue'),
    s('path', { d: 'M30 52q20-18 50-10q24-10 40 6q14 10 8 26q-10 8-6 22q-4 16-20 18q-8 14-22 10q-6-14-20-14q-18-4-22-22q-14-8-8-36z' }, 'green', { accent: true }),
    s('path', { d: ells([[88, 80, 14, 9]]) }, 'tan'),
    s('path', { d: ells([[124, 118, 7, 4], [32, 120, 6, 4]]) }, 'green')
  ],
  convencido: [
    ...person(54, 136, 'orange'),
    s('path', { d: 'M34 70q-6 8 0 16', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[74, 70, 4, 4], [84, 58, 6, 6]]) }, 'gray'),
    s('path', { d: ells([[110, 38, 24, 18], [90, 44, 14, 12], [130, 46, 14, 12]]) }, 'mint'),
    s('path', { d: 'M98 40l8 8 16-16', ...SW(6) }, 'green', { stroke: true, accent: true })
  ],
  corrupto: [
    s('rect', { x: 14, y: 46, width: 132, height: 12, rx: 3 }, 'brown'),
    s('path', { d: 'M24 58v78M136 58v78', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M14 98h36', ...SW(12) }, 'dark', { stroke: true }),
    s('path', { d: 'M146 98h-36', ...SW(12) }, 'navy', { stroke: true }),
    s('rect', { x: 62, y: 86, width: 36, height: 22, rx: 2 }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 97, r: 5 }, 'mint'),
    s('path', { d: ells([[56, 98, 10, 7], [104, 98, 10, 7]]) }, 'skin')
  ],
  crema: [
    s('rect', { x: 96, y: 22, width: 44, height: 12, rx: 4, transform: 'rotate(20 118 28)' }, 'pink'),
    s('rect', { x: 38, y: 78, width: 84, height: 54, rx: 10 }, 'pink', { accent: true }),
    s('rect', { x: 34, y: 70, width: 92, height: 12, rx: 4 }, 'sky'),
    s('path', { d: 'M42 72q0-18 20-18q4-14 18-14q16 0 18 14q20 0 20 18z' }, 'white'),
    s('path', { d: 'M42 72q0-18 20-18q4-14 18-14q16 0 18 14q20 0 20 18zM70 56q10 6 22 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  debilidad: [
    ground(),
    s('rect', { x: 106, y: 20, width: 28, height: 116 }, 'gray'),
    ...lean(80, 136, 12, 'sky'),
    s('path', { d: 'M20 28h46v24H20zM70 36v8', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 25, y: 33, width: 8, height: 14, rx: 1 }, 'red', { accent: true }),
    s('path', { d: drop(62, 60, 4) }, 'sky')
  ],
  denunciar: [
    ground(),
    ...person(36, 136, 'green', { accent: true }),
    s('path', { d: 'M50 102l30-12', ...SW(7) }, 'skin', { stroke: true }),
    ...person(110, 136, 'dark'),
    s('rect', { x: 97, y: 72, width: 26, height: 7, rx: 3 }, 'black'),
    s('path', { d: 'M130 104q14 0 12 18q-2 12-12 12q-12 0-12-12q0-14 12-18z' }, 'tan'),
    s('path', { d: 'M92 52l6 8M110 44v10M128 52l-6 8', ...SW(3) }, 'red', { stroke: true })
  ],
  'detención': [
    s('path', { d: 'M64 62q16-14 32 0', ...DASH(6, '3 5') }, 'dark', { stroke: true }),
    s('path', { d: ring(52, 92, 26) + ring(108, 92, 26), ...SW(10) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: rects([[42, 56, 22, 14], [96, 56, 22, 14]]) }, 'dark')
  ],
  'déficit': [
    s('path', { d: 'M22 70h120M22 24v112', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: rects([[32, 52, 16, 18], [56, 40, 16, 30]]) }, 'green'),
    s('path', { d: rects([[80, 70, 16, 26], [104, 70, 16, 50]]) }, 'red', { accent: true }),
    arrow('M96 30l34 30m0-18v18h-18', 'red', 5)
  ],
  eficiente: [
    ...gear(62, 92, 28, 10, 'blue', { accent: true }),
    s('circle', { cx: 62, cy: 92, r: 11 }, 'white'),
    s('path', { d: 'M118 20l-22 40h16l-10 34 30-46h-16l12-28z' }, 'yellow'),
    s('path', { d: 'M104 122l8 8 18-18', ...SW(6) }, 'green', { stroke: true })
  ],
  entusiasmo: [
    s('ellipse', { cx: 80, cy: 138, rx: 24, ry: 4 }, 'gray'),
    ...person(80, 116, 'orange', { accent: true }),
    s('path', { d: 'M68 80L48 46M92 80l20-34', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: rects([[24, 30, 6, 10], [126, 26, 6, 10], [34, 100, 6, 10], [120, 96, 6, 10]]) }, 'pink'),
    s('path', { d: dots([[30, 66], [132, 62], [80, 24]], 4) }, 'blue'),
    s('path', { d: sparkle(108, 22, 8) + sparkle(46, 22, 6) }, 'yellow')
  ],
  'estúpido': [
    ...person(80, 136, 'gray'),
    s('path', { d: 'M66 70l14-54 14 54z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[75, 79], [86, 81]], 2) }, 'dark'),
    s('path', { d: 'M74 86q6 4 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(46, 62, 8) + sparkle(116, 58, 8) + sparkle(110, 86, 5) }, 'orange')
  ],
  etiqueta: [
    s('path', { d: 'M52 84q-24-30-30-60', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 44h64a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H60l-30-40z' }, 'yellow', { accent: true }),
    s('circle', { cx: 50, cy: 84, r: 6 }, 'white'),
    s('path', { d: 'M74 70h44M74 86h44M74 102h26', ...SW(4) }, 'orange', { stroke: true })
  ],
  fa: [
    s('path', { d: 'M18 50h124M18 66h124M18 82h124M18 98h124M18 114h124', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M26 130h20', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: ells([[36, 130, 7, 5], [58, 122, 7, 5], [80, 114, 7, 5]]) }, 'gray'),
    ...note(106, 106, 'red')
  ],
  filipino: [
    backdrop('blue'),
    s('circle', { cx: 122, cy: 38, r: 12 }, 'yellow'),
    s('path', { d: ells([[48, 54, 22, 10], [94, 72, 14, 7], [56, 96, 18, 9], [108, 110, 26, 11], [40, 126, 10, 5]]) }, 'tan'),
    s('path', { d: ells([[48, 51, 12, 6], [56, 93, 9, 5], [108, 107, 14, 6]]) }, 'green', { accent: true }),
    s('path', { d: 'M74 128l20-2-4 6H78z' }, 'brown'),
    s('path', { d: 'M86 126V110l8 12z' }, 'white')
  ],
  fuertemente: [
    s('path', { d: burst(80, 98, 30, 14, 8) }, 'yellow', { accent: true }),
    s('rect', { x: 20, y: 112, width: 120, height: 22, rx: 3 }, 'brown'),
    s('path', { d: 'M80 112V94M72 94h16', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 66L132 28', ...SW(8) }, 'tan', { stroke: true }),
    s('rect', { x: 66, y: 60, width: 44, height: 20, rx: 3, transform: 'rotate(-43 88 70)' }, 'dark'),
    s('path', { d: 'M40 88l10 6M36 104h12M120 88l-10 6M124 104h-12', ...SW(3) }, 'orange', { stroke: true })
  ],
  'geografía': [
    s('path', { d: 'M80 120a52 52 0 0 1 0-104', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 112v14', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 56, y: 124, width: 48, height: 10, rx: 5 }, 'dark'),
    s('circle', { cx: 80, cy: 68, r: 40 }, 'blue'),
    s('path', { d: 'M56 44q14-8 22 4q-2 12 8 16q2 14-10 20q-12-6-10-18q-12-6-10-22zM94 76q14-4 20 6q-4 14-14 20q-10-8-6-26z' }, 'green', { accent: true })
  ],
  golfo: [
    backdrop('green'),
    s('path', { d: 'M146 34q-56-2-78 26q-22 40 8 66q16 14 70 14z' }, 'blue', { accent: true }),
    s('path', { d: 'M100 70q6-4 12 0M96 100q6-4 12 0M118 86q6-4 12 0', ...SW(2) }, 'white', { stroke: true }),
    s('ellipse', { cx: 40, cy: 112, rx: 8, ry: 3 }, 'dark'),
    s('path', { d: 'M40 112V58', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M40 58l22 9-22 9z' }, 'red')
  ],
  historial: [
    s('path', { d: 'M18 46h40l8 10h66v74H18z' }, 'tan'),
    ...paper(30, 36, 64, 40),
    s('path', { d: 'M18 66h114v64H18z' }, 'orange'),
    s('circle', { cx: 108, cy: 106, r: 24 }, 'sky', { accent: true }),
    s('path', { d: 'M108 92v14l9 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ring(108, 106, 24), ...SW(3) }, 'navy', { stroke: true })
  ],
  intenso: [
    s('path', { d: burst(80, 80, 66, 48, 14) }, 'red'),
    s('path', { d: burst(80, 80, 46, 32, 10) }, 'orange'),
    s('circle', { cx: 80, cy: 80, r: 22 }, 'yellow', { accent: true })
  ],
  jama: [
    s('path', { d: 'M14 118q60-12 132 4', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M36 106q-20 4-20 22M70 106l-6 12M98 106l6 12', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M34 106q10-18 30-18h40q14 0 20 10l-24 10H60q-12 0-26-2z' }, 'green', { accent: true }),
    s('path', { d: 'M66 88l4-8 4 8 4-8 4 8 4-8 4 8 4-8 4 8', ...SW(3) }, 'mint', { stroke: true }),
    s('ellipse', { cx: 120, cy: 96, rx: 15, ry: 10 }, 'green'),
    s('path', { d: 'M110 104q4 14 14 4z' }, 'orange'),
    s('circle', { cx: 125, cy: 93, r: 2.5 }, 'dark')
  ],
  justamente: [
    s('circle', { cx: 72, cy: 88, r: 52 }, 'red'),
    s('circle', { cx: 72, cy: 88, r: 36 }, 'white'),
    s('circle', { cx: 72, cy: 88, r: 20 }, 'red', { accent: true }),
    s('circle', { cx: 72, cy: 88, r: 7 }, 'yellow'),
    s('path', { d: 'M72 88L130 30', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M122 26l10 2 2 10M130 20l8 2 2 8', ...SW(3) }, 'orange', { stroke: true })
  ],
  'líquido': [
    s('path', { d: 'M66 24h28v34l32 64q4 10-8 10H42q-12 0-8-10l32-64z' }, 'white'),
    s('path', { d: 'M48 96h64l14 26q4 10-8 10H42q-12 0-8-10z' }, 'blue', { accent: true }),
    s('path', { d: dots([[70, 114], [90, 108], [82, 122]], 4) }, 'sky'),
    s('path', { d: 'M66 24h28v34l32 64q4 10-8 10H42q-12 0-8-10l32-64z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: drop(122, 42, 8) }, 'blue')
  ],
  medir: [
    s('rect', { x: 30, y: 72, width: 76, height: 58 }, 'tan'),
    s('path', { d: 'M30 86h76M68 72v14', ...SW(3) }, 'brown', { stroke: true }),
    s('rect', { x: 24, y: 38, width: 108, height: 18 }, 'yellow', { accent: true }),
    s('path', { d: 'M34 38v8M44 38v5M54 38v8M64 38v5M74 38v8M84 38v5M94 38v8M104 38v5M114 38v8M124 38v5', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M122 72v58M116 72h12M116 130h12', ...SW(3) }, 'dark', { stroke: true })
  ],
  militante: [
    ...person(60, 136, 'red', { accent: true }),
    s('path', { d: 'M110 62v62', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M72 100l38-6', ...SW(7) }, 'skin', { stroke: true }),
    ...paper(82, 22, 58, 40),
    s('path', { d: 'M94 36h34M94 48h24', ...SW(4) }, 'orange', { stroke: true })
  ],
  mineral: [
    s('path', { d: 'M22 128q8-24 30-26h56q24 2 30 26z' }, 'gray'),
    s('path', { d: 'M34 106l4-28 8-6 8 8-2 26z' }, 'sky'),
    s('path', { d: 'M50 106l6-50 12-12 10 14-4 48zM78 106l10-70 14-10 12 18-10 62zM104 106l10-36 10-6 8 10-6 32z' }, 'purple', { accent: true }),
    s('path', { d: 'M68 44l2 62M102 26l-2 80M124 64l-2 42', ...SW(2) }, 'pink', { stroke: true })
  ],
  miss: [
    s('circle', { cx: 80, cy: 62, r: 12 }, 'skin'),
    s('path', { d: 'M72 74h16l18 62H54z' }, 'pink'),
    s('path', { d: 'M68 52l2-16 6 8 4-12 4 12 6-8 2 16z' }, 'yellow', { accent: true }),
    s('path', { d: 'M72 78l24 46', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: dots([[106, 98], [114, 92], [114, 104]], 5) }, 'red'),
    s('path', { d: sparkle(42, 40, 9) + sparkle(120, 42, 7) }, 'yellow')
  ],
  mito: [
    backdrop('sky'),
    s('path', { d: 'M58 140q-14-40-2-66q8-22 30-28l6 10q-18 6-24 26q-8 22 0 58z' }, 'pink'),
    s('path', { d: 'M62 140q-4-40 8-64q10-26 34-30q18-2 30 14l10 22q2 8-8 10l-22-4q-8 10-12 28q-4 14-4 24z' }, 'white'),
    s('path', { d: 'M62 140q-4-40 8-64q10-26 34-30q18-2 30 14l10 22q2 8-8 10l-22-4q-8 10-12 28q-4 14-4 24', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 48l18-34-2 38z' }, 'yellow', { accent: true }),
    s('circle', { cx: 106, cy: 62, r: 3 }, 'dark'),
    s('path', { d: sparkle(36, 36, 9) + sparkle(130, 108, 7) }, 'white')
  ],
  mortal: [
    s('rect', { x: 68, y: 14, width: 24, height: 14, rx: 3 }, 'brown'),
    s('path', { d: 'M66 26h28v18q22 10 22 36v44q0 12-12 12H56q-12 0-12-12V80q0-26 22-36z' }, 'purple', { accent: true }),
    s('rect', { x: 54, y: 78, width: 52, height: 42, rx: 4 }, 'cream'),
    s('path', { d: 'M70 94a10 10 0 0 1 20 0v6h-4v4H74v-4h-4z' }, 'dark'),
    s('path', { d: dots([[76, 94], [84, 94]], 2.5) }, 'cream'),
    s('path', { d: 'M68 108l24 8M92 108l-24 8', ...SW(3) }, 'dark', { stroke: true })
  ],
  municipalidad: [
    ground(),
    s('rect', { x: 66, y: 30, width: 28, height: 44 }, 'tan'),
    s('path', { d: 'M62 32l18-18 18 18z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 48, r: 9 }, 'white'),
    s('path', { d: 'M80 42v6l4 3', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 20, y: 84, width: 120, height: 52 }, 'tan'),
    s('path', { d: 'M14 86l66-22 66 22z' }, 'brown'),
    s('path', { d: rects([[30, 92, 8, 44], [50, 92, 8, 44], [102, 92, 8, 44], [122, 92, 8, 44]]) }, 'white'),
    s('rect', { x: 70, y: 106, width: 20, height: 30 }, 'brown')
  ],
  osea: [
    s('path', { d: bubble(14, 22, 60, 46) }, 'gray'),
    s('path', { d: 'M24 46q6-12 12 0t12 0t12 0', ...SW(3) }, 'dark', { stroke: true }),
    arrow('M64 84l20 16m-14 4l14-4-2-14', 'orange', 5),
    s('path', { d: bubble(86, 90, 60, 46) }, 'sky', { accent: true }),
    s('circle', { cx: 116, cy: 106, r: 9 }, 'yellow'),
    s('path', { d: 'M112 119h8', ...SW(4) }, 'dark', { stroke: true })
  ],
  pega: [
    s('path', { d: 'M14 120q60-8 132 0', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M58 96L14 126l8 6 48-30z' }, 'navy', { accent: true }),
    s('path', { d: 'M80 106v14M90 106v14', ...SW(3) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 82, cy: 88, rx: 30, ry: 20 }, 'black'),
    s('path', { d: 'M66 98q16 14 38 2q-8-14-38-2z' }, 'white'),
    s('ellipse', { cx: 76, cy: 82, rx: 14, ry: 5 }, 'white'),
    s('circle', { cx: 110, cy: 70, r: 14 }, 'black'),
    s('path', { d: 'M122 66l16 4-16 5z' }, 'dark'),
    s('circle', { cx: 114, cy: 67, r: 2.5 }, 'white')
  ],
  proveedor: [
    ground(),
    s('rect', { x: 96, y: 62, width: 46, height: 74 }, 'mint'),
    s('path', { d: 'M92 50h54v14H92z' }, 'red'),
    s('rect', { x: 110, y: 98, width: 18, height: 38 }, 'brown'),
    s('path', { d: 'M30 40v86h44', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: rects([[36, 92, 34, 32], [38, 60, 30, 30]]) }, 'tan', { accent: true }),
    s('path', { d: 'M53 92v10M53 60v8', ...SW(3) }, 'brown', { stroke: true }),
    s('circle', { cx: 40, cy: 128, r: 8 }, 'dark')
  ],
  'pánico': [
    s('circle', { cx: 80, cy: 80, r: 44 }, 'yellow', { accent: true }),
    s('path', { d: ells([[64, 66, 8, 11], [96, 66, 8, 11]]) }, 'white'),
    s('path', { d: dots([[64, 68], [96, 68]], 3) }, 'dark'),
    s('ellipse', { cx: 80, cy: 104, rx: 10, ry: 14 }, 'dark'),
    s('path', { d: ells([[36, 100, 12, 18], [124, 100, 12, 18]]) }, 'skin'),
    s('path', { d: drop(126, 42, 6) }, 'sky'),
    s('path', { d: 'M30 34l8 8M80 16v12M128 22l-8 8', ...SW(3) }, 'gray', { stroke: true })
  ],
  rebelde: [
    s('path', { d: fishes([[38, 40], [80, 36], [122, 42], [36, 82], [126, 86], [54, 124], [102, 124]]) }, 'blue'),
    s('path', { d: dots([[44, 38], [86, 34], [128, 40], [42, 80], [132, 84], [60, 122], [108, 122]], 2) }, 'white'),
    s('path', { d: ells([[80, 82, 16, 9]]) + 'M94 82l14-9v18z' }, 'orange', { accent: true }),
    s('circle', { cx: 72, cy: 80, r: 2.5 }, 'dark')
  ],
  refugiado: [
    ground(),
    s('path', { d: 'M84 136l30-60 30 60z' }, 'orange'),
    s('path', { d: 'M106 136l8-24 8 24z' }, 'dark'),
    ...person(48, 136, 'blue', { accent: true }),
    s('path', { d: 'M60 102l8 4', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 62, y: 104, width: 22, height: 20, rx: 3 }, 'brown'),
    ...person(22, 136, 'green', { h: 24, w: 16, r: 8 })
  ],
  respaldo: [
    ground(),
    s('rect', { x: 92, y: 28, width: 16, height: 74, rx: 6 }, 'red', { accent: true }),
    s('rect', { x: 38, y: 92, width: 70, height: 14, rx: 4 }, 'brown'),
    s('path', { d: 'M46 106v30M100 106v30', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M114 60h18M114 74h22M114 88h18', ...SW(4) }, 'orange', { stroke: true })
  ],
  romano: [
    backdrop('sky'),
    s('path', { d: 'M14 128h132v6a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green'),
    s('path', { d: 'M20 130V60q60-28 120 0v70z' }, 'tan', { accent: true }),
    s('path', { d: [26, 44, 62, 80, 98, 116].map(x => `M${x} 92v-10a6 6 0 0 1 12 0v10zM${x} 120v-10a6 6 0 0 1 12 0v10z`).join('') }, 'brown'),
    s('path', { d: 'M20 68q60-26 120 0', ...SW(3) }, 'brown', { stroke: true })
  ],
  saludable: [
    s('path', { d: heart(80, 40, 12) }, 'pink', { accent: true }),
    s('path', { d: ells([[44, 84, 16, 12], [70, 76, 18, 14], [98, 78, 18, 12], [120, 86, 14, 10]]) }, 'green'),
    s('path', { d: dots([[58, 82], [106, 80]], 7) }, 'red'),
    s('path', { d: dots([[84, 86]], 6) }, 'mint'),
    s('path', { d: 'M22 88h116q-4 46-58 46t-58-46z' }, 'sky')
  ],
  saque: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    ...person(56, 136, 'green'),
    s('path', { d: 'M66 96l28-40M46 96L36 66', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M94 58l8-14', ...SW(5) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 110, cy: 30, rx: 11, ry: 15, transform: 'rotate(35 110 30)' }, 'sky'),
    s('ellipse', { cx: 110, cy: 30, rx: 11, ry: 15, transform: 'rotate(35 110 30)', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 66, cy: 26, r: 8 }, 'yellow', { accent: true })
  ],
  tocado: [
    s('path', { d: busts([80], 146, 64, 34) }, 'purple'),
    s('circle', { cx: 80, cy: 82, r: 28 }, 'skin'),
    s('path', { d: 'M52 82q-2-34 28-34q30 0 28 34q-6-18-28-20q-22 2-28 20z' }, 'brown'),
    s('path', { d: 'M100 54q18-30 40-36q-8 24-36 42z' }, 'sky'),
    s('path', { d: dots(around(100, 54, 8, 5), 6) }, 'pink'),
    s('circle', { cx: 100, cy: 54, r: 5 }, 'yellow', { accent: true }),
    s('path', { d: dots([[70, 84], [90, 84]], 2.5) }, 'dark'),
    s('path', { d: 'M72 96q8 6 16 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  tuit: [
    s('rect', { x: 24, y: 28, width: 62, height: 108, rx: 10 }, 'dark'),
    s('rect', { x: 30, y: 40, width: 50, height: 84, rx: 2 }, 'sky'),
    s('rect', { x: 36, y: 52, width: 38, height: 24, rx: 6 }, 'white'),
    s('path', { d: 'M42 60h26M42 68h16', ...SW(2) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 116, cy: 62, rx: 16, ry: 12 }, 'yellow', { accent: true }),
    s('path', { d: 'M106 60q8-18 20-4z' }, 'orange'),
    s('path', { d: 'M131 58l10 4-10 4z' }, 'orange'),
    s('circle', { cx: 122, cy: 57, r: 2 }, 'dark')
  ],
  'adaptación': [
    s('path', { d: 'M14 60q18-6 30 2q12-8 30-2v52q-18-6-30 2q-12-8-30-2z' }, 'blue'),
    s('path', { d: 'M44 62v52', ...SW(2) }, 'navy', { stroke: true }),
    arrow('M80 87h16m-7-7l7 7-7 7', 'orange', 5),
    s('circle', { cx: 122, cy: 87, r: 24 }, 'dark', { accent: true }),
    s('path', { d: dots(around(122, 87, 12, 5, -90), 5) }, 'gray'),
    s('circle', { cx: 122, cy: 87, r: 3 }, 'gray')
  ],
  ajuste: [
    s('path', { d: 'M24 44h112M24 80h112M24 116h112', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 60, cy: 44, r: 12 }, 'blue', { accent: true }),
    s('circle', { cx: 106, cy: 80, r: 12 }, 'orange'),
    s('circle', { cx: 44, cy: 116, r: 12 }, 'green')
  ],
  anime: [
    s('path', { d: 'M64 136h32M80 120v16', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 16, y: 22, width: 128, height: 98, rx: 10 }, 'dark'),
    s('rect', { x: 24, y: 30, width: 112, height: 82, rx: 4 }, 'sky'),
    s('path', { d: 'M52 112q-4-26 6-40h44q10 14 6 40z' }, 'purple'),
    s('ellipse', { cx: 80, cy: 82, rx: 22, ry: 24 }, 'skin'),
    s('path', { d: 'M56 82q0-30 24-30t24 30l-8-14-6 8-6-12-6 10-6-10-6 12-6-8z' }, 'purple'),
    s('path', { d: ells([[71, 86, 6, 8], [89, 86, 6, 8]]) }, 'navy', { accent: true }),
    s('path', { d: dots([[73, 83], [91, 83]], 2) }, 'white')
  ],
  asesor: [
    ...person(42, 136, 'navy'),
    s('rect', { x: 54, y: 94, width: 20, height: 26, rx: 2 }, 'brown'),
    s('rect', { x: 58, y: 99, width: 12, height: 16 }, 'white'),
    ...person(118, 136, 'orange'),
    s('path', { d: halfRays(80, 40, 18, 25, 5), ...SW(3) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 40, r: 13 }, 'yellow', { accent: true }),
    s('rect', { x: 74, y: 52, width: 12, height: 9, rx: 2 }, 'gray')
  ],
  atentado: [
    s('path', { d: 'M80 30l42 72H38z' }, 'red', { accent: true }),
    s('path', { d: 'M80 48l27 46H53z' }, 'white'),
    s('path', { d: burst(80, 78, 14, 6, 8) }, 'dark'),
    s('path', { d: 'M14 118l132-20v16L14 134z' }, 'yellow'),
    s('path', { d: 'M30 114l-4 16M54 110l-4 16M78 107l-4 16M102 103l-4 16M126 100l-4 16', ...SW(5) }, 'black', { stroke: true })
  ],
  'automáticamente': [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 20, y: 30, width: 120, height: 106, rx: 4 }, 'gray'),
    s('rect', { x: 28, y: 44, width: 104, height: 92 }, 'cream'),
    s('path', { d: rects([[28, 44, 30, 92], [102, 44, 30, 92]]) }, 'sky', { accent: true }),
    s('path', { d: 'M28 44h30v92H28zM102 44h30v92h-30z', ...SW(2) }, 'navy', { stroke: true }),
    arrow('M74 90H64m6-6l-6 6 6 6M86 90h10m-6-6l6 6-6 6', 'orange', 4),
    s('circle', { cx: 80, cy: 37, r: 4 }, 'red'),
    s('path', { d: 'M72 52q8 6 16 0M68 60q12 9 24 0', ...SW(2) }, 'red', { stroke: true })
  ],
  boy: [
    backdrop('navy'),
    s('path', { d: 'M66 14h28l42 116H24z' }, 'yellow', { flatOnly: true }),
    s('path', { d: 'M14 126h132v8a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'brown'),
    ...person(80, 128, 'skin'),
    s('rect', { x: 65, y: 110, width: 30, height: 18, rx: 4 }, 'black'),
    s('path', { d: 'M70 86l10 5 10-5v12l-10-5-10 5z' }, 'red', { accent: true })
  ],
  campus: [
    s('path', { d: 'M14 122h132v14H14z' }, 'green'),
    s('rect', { x: 34, y: 72, width: 92, height: 50 }, 'tan'),
    s('path', { d: 'M28 74l52-24 52 24z' }, 'brown'),
    s('path', { d: rects([[44, 80, 8, 42], [64, 80, 8, 42], [88, 80, 8, 42], [108, 80, 8, 42]]) }, 'white'),
    s('path', { d: 'M80 14l32 12-32 12-32-12z' }, 'navy', { accent: true }),
    s('path', { d: 'M108 27v13', ...SW(3) }, 'yellow', { stroke: true })
  ],
  caridad: [
    s('rect', { x: 36, y: 78, width: 88, height: 58, rx: 6 }, 'blue'),
    s('path', { d: 'M64 78h32', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: heart(80, 100, 14) }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 56, r: 10 }, 'yellow'),
    s('path', { d: 'M146 30h-30', ...SW(12) }, 'green', { stroke: true }),
    s('ellipse', { cx: 104, cy: 32, rx: 14, ry: 9 }, 'skin')
  ],
  conservador: [
    s('rect', { x: 42, y: 44, width: 76, height: 92, rx: 12 }, 'sky'),
    s('path', { d: dots([[62, 70], [96, 72], [66, 104], [98, 108], [80, 88]], 13) }, 'orange'),
    s('rect', { x: 38, y: 28, width: 84, height: 18, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M38 37h84', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M52 58v62', ...SW(4) }, 'white', { stroke: true, flatOnly: true })
  ],
  contratar: [
    ...paper(34, 16, 70, 86),
    s('path', { d: 'M46 34h46M46 46h46M46 58h30', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 84q6-12 10 0t10 0t10-4', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M92 84l26-38', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 126h44', ...SW(12) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M146 126h-44', ...SW(12) }, 'orange', { stroke: true }),
    s('path', { d: ells([[72, 124, 14, 9], [88, 128, 14, 9]]) }, 'skin')
  ],
  coraje: [
    s('path', { d: 'M124 20L36 132', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M44 112l14 12', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 34, cy: 136, r: 5 }, 'yellow'),
    s('path', { d: 'M36 30h88v38q0 42-44 64q-44-22-44-64z' }, 'blue'),
    s('path', { d: 'M36 30h88v38q0 42-44 64q-44-22-44-64z', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: heart(80, 78, 20) }, 'red', { accent: true })
  ],
  cuerda: [
    s('path', { d: 'M120 92q22 26-4 46', ...SW(10) }, 'tan', { stroke: true }),
    s('path', { d: ring(80, 82, 44) + ring(80, 82, 31) + ring(80, 82, 18), ...SW(11) }, 'tan', { stroke: true, accent: true }),
    s('path', { d: ring(80, 82, 44) + ring(80, 82, 31) + ring(80, 82, 18), ...DASH(2, '3 7') }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 82, r: 8 }, 'brown')
  ],
  'cálculo': [
    s('rect', { x: 36, y: 16, width: 88, height: 128, rx: 10 }, 'dark'),
    s('rect', { x: 46, y: 28, width: 68, height: 26, rx: 3 }, 'mint'),
    s('path', { d: rects([[46, 64, 14, 14], [64, 64, 14, 14], [82, 64, 14, 14], [46, 84, 14, 14], [64, 84, 14, 14], [82, 84, 14, 14], [46, 104, 14, 14], [64, 104, 14, 14], [82, 104, 14, 14], [46, 122, 32, 12], [82, 122, 14, 12]]) }, 'gray'),
    s('path', { d: rects([[100, 64, 14, 14], [100, 84, 14, 14], [100, 104, 14, 30]]) }, 'orange', { accent: true })
  ],
  durar: [
    s('path', { d: 'M44 28v104M116 28v104', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M50 28h60q0 30-24 52q24 22 24 52H50q0-30 24-52q-24-22-24-52z' }, 'sky'),
    s('path', { d: 'M58 46h44q-6 16-22 30q-16-14-22-30z' }, 'yellow', { accent: true }),
    s('path', { d: 'M54 132q4-22 26-30q22 8 26 30z' }, 'yellow'),
    s('path', { d: 'M80 76v28', ...SW(2) }, 'yellow', { stroke: true }),
    s('path', { d: rects([[38, 18, 84, 10], [38, 132, 84, 10]]) }, 'brown')
  ],
  empresarial: [
    ground(),
    s('rect', { x: 22, y: 44, width: 40, height: 92 }, 'navy'),
    s('rect', { x: 66, y: 20, width: 36, height: 116 }, 'blue'),
    s('path', { d: rects([[30, 54, 8, 8], [46, 54, 8, 8], [30, 70, 8, 8], [46, 70, 8, 8], [30, 86, 8, 8], [46, 86, 8, 8], [74, 30, 8, 8], [86, 30, 8, 8], [74, 46, 8, 8], [86, 46, 8, 8], [74, 62, 8, 8], [86, 62, 8, 8], [74, 78, 8, 8]]) }, 'sky'),
    s('path', { d: 'M112 98v-8h18v8', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 98, y: 98, width: 46, height: 36, rx: 4 }, 'brown', { accent: true }),
    s('path', { d: 'M98 112h46', ...SW(2) }, 'tan', { stroke: true })
  ],
  entretenimiento: [
    backdrop('purple'),
    s('path', { d: ells([[56, 48, 14, 12], [76, 40, 14, 12], [98, 44, 14, 12], [66, 60, 14, 10], [90, 58, 14, 10], [110, 54, 10, 10], [48, 60, 10, 8]]) }, 'cream'),
    s('path', { d: 'M42 62h76l-10 76H52z' }, 'white'),
    s('path', { d: 'M56 62l6 76h12l-2-76zM88 62l-2 76h12l6-76z' }, 'red', { accent: true })
  ],
  espacial: [
    backdrop('navy'),
    s('path', { d: dots([[30, 30], [132, 30], [40, 114], [100, 22], [140, 70]], 2) }, 'white'),
    s('circle', { cx: 114, cy: 106, r: 18 }, 'orange'),
    s('ellipse', { cx: 114, cy: 106, rx: 28, ry: 7, transform: 'rotate(-20 114 106)', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M46 100h20l-10 26z' }, 'orange'),
    s('path', { d: 'M40 80l-12 22h12zM72 80l12 22H72z' }, 'red', { accent: true }),
    s('path', { d: 'M56 24q16 16 16 46v30H40V70q0-30 16-46z' }, 'white'),
    s('circle', { cx: 56, cy: 62, r: 7 }, 'sky')
  ],
  esquema: [
    s('path', { d: 'M80 42v14M42 56h76M42 56v16M118 56v16M42 96v22M118 96v22', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 56, y: 18, width: 48, height: 24, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: rects([[20, 72, 44, 24], [96, 72, 44, 24]]) }, 'sky'),
    s('path', { d: rects([[20, 118, 44, 22], [96, 118, 44, 22]]) }, 'orange')
  ],
  'estética': [
    s('path', { d: 'M54 104L36 138', ...SW(10) }, 'brown', { stroke: true }),
    s('circle', { cx: 72, cy: 66, r: 42 }, 'pink', { accent: true }),
    s('circle', { cx: 72, cy: 66, r: 32 }, 'sky'),
    s('path', { d: 'M54 54q8-14 22-16', ...SW(4) }, 'white', { stroke: true }),
    s('rect', { x: 120, y: 98, width: 16, height: 38, rx: 2 }, 'yellow'),
    s('path', { d: 'M122 98V82l12-8v24z' }, 'red'),
    s('path', { d: sparkle(130, 34, 10) }, 'yellow')
  ],
  fallecer: [
    s('path', { d: 'M80 108V72q0-24 22-24q12 2 12 16M80 94q-14 0-20 12', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots(around(114, 74, 9, 5, 90), 7) }, 'pink'),
    s('circle', { cx: 114, cy: 74, r: 6 }, 'brown'),
    s('path', { d: 'M56 106h48l-6 32H62z' }, 'brown'),
    s('ellipse', { cx: 128, cy: 118, rx: 6, ry: 3, transform: 'rotate(25 128 118)' }, 'pink', { accent: true }),
    s('path', { d: 'M100 102q8 6 4 12', ...DASH(2, '3 4') }, 'gray', { stroke: true })
  ],
  financiamiento: [
    s('path', { d: 'M44 58l-8-14h28l-8 14q26 10 26 44q0 24-30 24t-30-24q0-34 22-44z' }, 'tan'),
    s('path', { d: 'M38 58h24', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 50, cy: 98, r: 12 }, 'yellow'),
    arrow('M86 100h18m-7-7l7 7-7 7', 'orange', 5),
    s('path', { d: 'M112 136v-22h30v22z' }, 'yellow'),
    s('path', { d: 'M112 121h30M112 129h30', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M127 114V80', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M127 92q-16-2-18-16q16 0 18 16zM127 86q14-6 16-20q-16 2-16 20z' }, 'green', { accent: true })
  ],
  gama: [
    ...[['red', -45], ['orange', -27], ['yellow', -9], ['green', 9], ['blue', 27], ['purple', 45]].map(([c, a], i) =>
      s('rect', { x: 71, y: 40, width: 18, height: 96, rx: 4, transform: `rotate(${a} 80 128)` }, c, i === 5 ? { accent: true } : {})),
    s('circle', { cx: 80, cy: 128, r: 5 }, 'dark')
  ],
  horror: [
    backdrop('navy'),
    s('circle', { cx: 120, cy: 36, r: 12 }, 'cream'),
    s('path', { d: 'M48 128V72a32 32 0 0 1 64 0v56l-10-10-11 10-11-10-11 10-11-10z' }, 'white', { accent: true }),
    s('path', { d: ells([[68, 74, 5, 8], [92, 74, 5, 8]]) }, 'dark'),
    s('ellipse', { cx: 80, cy: 98, rx: 6, ry: 9 }, 'dark')
  ],
  'inauguración': [
    s('path', { d: 'M66 86l-10 30 10-6 6 8 6-30zM94 86l10 30-10-6-6 8-6-30z' }, 'red'),
    s('path', { d: 'M14 74h132v12H14z' }, 'red', { accent: true }),
    s('path', { d: ells([[66, 80, 14, 10], [94, 80, 14, 10]]) }, 'red'),
    s('circle', { cx: 80, cy: 80, r: 7 }, 'pink'),
    s('path', { d: 'M112 38l22 38M136 38l-22 38', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: ring(110, 30, 8) + ring(138, 30, 8), ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: sparkle(36, 40, 9) + sparkle(50, 120, 6) + sparkle(126, 120, 7) }, 'yellow')
  ],
  'inclusión': [
    s('circle', { cx: 80, cy: 84, r: 62, ...SW(6) }, 'green', { stroke: true, accent: true }),
    s('path', { d: busts([44], 122, 24, 32) }, 'red'),
    s('path', { d: busts([68], 122, 24, 32) }, 'blue'),
    s('path', { d: busts([92], 122, 24, 32) }, 'orange'),
    s('path', { d: busts([116], 122, 24, 32) }, 'purple'),
    s('path', { d: dots([[44, 78], [68, 78], [92, 78], [116, 78]], 10) }, 'skin'),
    s('path', { d: heart(80, 44, 10) }, 'pink')
  ],
  inevitable: [
    ground(),
    ...[[22, 72], [46, 56], [70, 38], [94, 18], [118, 0]].map(([x, a], i) =>
      s('rect', { x, y: 76, width: 12, height: 60, rx: 2, transform: `rotate(${a} ${x + 12} 136)` }, i === 4 ? 'red' : 'dark', i === 4 ? { accent: true } : {})),
    arrow('M40 40q40-24 80-4m-12-10l12 10-14 6', 'orange', 4)
  ],
  inseguridad: [
    backdrop('navy'),
    s('path', { d: 'M100 76V52a20 20 0 0 0-40 0v4', ...SW(8) }, 'gray', { stroke: true }),
    s('rect', { x: 50, y: 76, width: 60, height: 50, rx: 8 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 96, r: 6 }, 'dark'),
    s('path', { d: 'M80 100v12', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[126, 116], [136, 116]], 2.5) }, 'white')
  ],
  justificar: [
    s('path', { d: 'M80 30v96M34 40h92', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 56, y: 124, width: 48, height: 10, rx: 4 }, 'dark'),
    s('path', { d: 'M34 40l-14 40M34 40l14 40M126 40l-14 40M126 40l14 40', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 80a16 8 0 0 0 32 0z' }, 'yellow'),
    s('path', { d: 'M110 80a16 8 0 0 0 32 0z' }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 28, r: 6 }, 'yellow')
  ],
  legalmente: [
    s('rect', { x: 18, y: 100, width: 80, height: 32, rx: 3 }, 'brown'),
    s('path', { d: 'M34 100v32', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M22 104h72', ...SW(2) }, 'cream', { stroke: true }),
    s('rect', { x: 100, y: 118, width: 44, height: 16, rx: 4 }, 'brown'),
    s('path', { d: 'M40 34L108 76', ...SW(6) }, 'tan', { stroke: true }),
    s('rect', { x: 102, y: 60, width: 22, height: 46, rx: 5, transform: 'rotate(-58 113 83)' }, 'navy', { accent: true })
  ],
  libra: [
    ground(),
    s('path', { d: 'M54 92v-8a10 10 0 0 1 20 0v8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 136l10-44h48l10 44z' }, 'dark', { accent: true }),
    s('path', { d: 'M112 110v-6a7 7 0 0 1 14 0v6', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 136l6-26h26l6 26z' }, 'gray'),
    s('path', { d: 'M48 112h32', ...SW(3) }, 'gray', { stroke: true })
  ],
  mantenido: [
    s('rect', { x: 24, y: 66, width: 112, height: 32, rx: 8 }, 'purple'),
    s('rect', { x: 18, y: 94, width: 124, height: 26, rx: 8 }, 'pink'),
    s('path', { d: 'M30 120v12M130 120v12', ...SW(5) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 84, cy: 88, rx: 34, ry: 10 }, 'blue'),
    s('circle', { cx: 42, cy: 84, r: 11 }, 'skin'),
    s('path', { d: 'M146 30h-28', ...SW(12) }, 'green', { stroke: true }),
    s('ellipse', { cx: 108, cy: 32, rx: 11, ry: 8 }, 'skin'),
    s('path', { d: dots([[104, 50], [100, 66]], 6) }, 'yellow', { accent: true })
  ],
  maravilla: [
    s('path', { d: halfRays(80, 76, 44, 64, 7), ...SW(5) }, 'yellow', { stroke: true }),
    s('rect', { x: 44, y: 82, width: 72, height: 52, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M80 82v52', ...SW(8) }, 'yellow', { stroke: true }),
    s('rect', { x: 34, y: 50, width: 84, height: 14, rx: 3, transform: 'rotate(-18 76 57)' }, 'red'),
    s('path', { d: sparkle(80, 50, 12) + sparkle(30, 70, 7) + sparkle(130, 70, 7) }, 'orange')
  ],

  marihuana: [
    s('path', { d: 'M80 112v28', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: [[-90, 86, 10], [-60, 74, 9], [-120, 74, 9], [-30, 58, 8], [-150, 58, 8], [-5, 40, 6], [-175, 40, 6]].map(([a, L, w]) => leaflet(80, 112, a, L, w)).join('') }, 'green', { accent: true }),
    s('path', { d: [-90, -60, -120, -30, -150].map(a => `M80 112L${(80 + 50 * Math.cos(a * Math.PI / 180)).toFixed(1)} ${(112 + 50 * Math.sin(a * Math.PI / 180)).toFixed(1)}`).join(''), ...SW(1.5) }, 'mint', { stroke: true })
  ],
  masivo: [
    s('path', { d: busts([26, 50, 74, 98, 122], 96, 22, 22) }, 'gray'),
    s('path', { d: dots([[26, 66], [50, 66], [74, 66], [98, 66], [122, 66]], 9) }, 'skin'),
    s('path', { d: busts([38, 62, 86, 110, 134], 120, 22, 22) }, 'blue'),
    s('path', { d: dots([[38, 90], [62, 90], [86, 90], [110, 90], [134, 90]], 9) }, 'skin'),
    s('path', { d: busts([26, 50, 74, 98, 122], 144, 22, 22) }, 'orange', { accent: true }),
    s('path', { d: dots([[26, 114], [50, 114], [74, 114], [98, 114], [122, 114]], 9) }, 'skin')
  ],
  naturalmente: [
    backdrop('sky'),
    s('circle', { cx: 118, cy: 40, r: 14 }, 'yellow'),
    s('path', { d: 'M14 110l40-56 30 40 22-24 40 40v24a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green', { accent: true }),
    s('path', { d: 'M54 54l-10 14h20zM106 70l-8 9h16z' }, 'white'),
    s('path', { d: 'M90 146q-14-14 2-24t6-26', ...SW(8) }, 'blue', { stroke: true })
  ],
  navarro: [
    backdrop('sky'),
    s('path', { d: 'M14 96l36-40 30 30 26-22 40 32v38a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green'),
    ...person(80, 138, 'white'),
    s('path', { d: 'M70 94h20l-10 12z' }, 'red', { accent: true }),
    s('path', { d: 'M66 116h28', ...SW(6) }, 'red', { stroke: true })
  ],
  notar: [
    ground(),
    ...person(56, 136, 'blue'),
    s('path', { d: 'M40 52l-6-10M56 48V36M72 52l6-10', ...SW(4) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M70 100l30 12', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(122, 120, 12) }, 'yellow')
  ],
  piano: [
    s('rect', { x: 22, y: 30, width: 116, height: 106, rx: 6 }, 'brown', { accent: true }),
    s('rect', { x: 52, y: 42, width: 56, height: 24, rx: 2 }, 'cream'),
    s('rect', { x: 22, y: 76, width: 116, height: 10 }, 'dark'),
    s('rect', { x: 28, y: 86, width: 104, height: 24 }, 'white'),
    s('path', { d: 'M41 86v24M54 86v24M67 86v24M80 86v24M93 86v24M106 86v24M119 86v24', ...SW(1.5) }, 'gray', { stroke: true }),
    s('path', { d: rects([[37, 86, 8, 14], [50, 86, 8, 14], [76, 86, 8, 14], [89, 86, 8, 14], [102, 86, 8, 14]]) }, 'black'),
    s('path', { d: 'M60 50h40M60 58h28', ...SW(2) }, 'gray', { stroke: true })
  ],
  pinche: [
    s('path', { d: 'M50 100l-16 14M54 108l-12 18M110 100l16 14M106 108l12 18M52 80L38 66M108 80l14-14', ...SW(5) }, 'red', { stroke: true }),
    s('ellipse', { cx: 80, cy: 92, rx: 36, ry: 24 }, 'red', { accent: true }),
    s('path', { d: ells([[34, 56, 14, 14], [126, 56, 14, 14]]) }, 'red'),
    s('path', { d: 'M28 42l10 12-16 0zM132 42l-10 12 16 0z' }, 'white'),
    s('path', { d: 'M70 72v-12M90 72v-12M64 50l10 4M96 50l-10 4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[70, 60], [90, 60]], 4) }, 'dark')
  ],
  preciso: [
    s('path', { d: ring(80, 80, 22), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ring(80, 80, 46), ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 22v36M80 102v36M22 80h36M102 80h36', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 7 }, 'red', { accent: true })
  ],
  retrato: [
    s('rect', { x: 26, y: 16, width: 108, height: 128, rx: 4 }, 'yellow', { accent: true }),
    s('rect', { x: 38, y: 28, width: 84, height: 104 }, 'mint'),
    s('path', { d: busts([80], 132, 56, 34) }, 'navy'),
    s('circle', { cx: 80, cy: 74, r: 20 }, 'skin'),
    s('path', { d: 'M60 74q0-26 20-26t20 26q-6-16-20-16t-20 16z' }, 'brown')
  ],
  'sabiduría': [
    s('rect', { x: 30, y: 114, width: 100, height: 16, rx: 2 }, 'blue'),
    s('rect', { x: 38, y: 98, width: 86, height: 16, rx: 2 }, 'red'),
    s('path', { d: 'M50 54l6-22 14 14zM110 54l-6-22-14 14z' }, 'brown'),
    s('ellipse', { cx: 80, cy: 72, rx: 32, ry: 30 }, 'brown'),
    s('ellipse', { cx: 80, cy: 84, rx: 20, ry: 16 }, 'tan'),
    s('path', { d: dots([[68, 62], [92, 62]], 11) }, 'white'),
    s('path', { d: dots([[68, 62], [92, 62]], 5) }, 'dark'),
    s('path', { d: 'M76 72h8l-4 8z' }, 'orange', { accent: true })
  ],
  suceso: [
    s('path', { d: burst(80, 58, 38, 22, 12) }, 'orange', { accent: true }),
    s('path', { d: burst(80, 58, 18, 10, 8) }, 'yellow'),
    s('path', { d: busts([30, 58, 102, 130], 140, 24, 30) }, 'blue'),
    s('path', { d: dots([[30, 104], [58, 104], [102, 104], [130, 104]], 11) }, 'skin'),
    s('path', { d: 'M40 96l8-6M120 96l-8-6', ...SW(3) }, 'gray', { stroke: true })
  ],
  tarifa: [
    ground(124),
    ...car(50, 96, 'yellow', 'sky', { accent: true }),
    s('rect', { x: 70, y: 74, width: 20, height: 8, rx: 2 }, 'dark'),
    s('circle', { cx: 80, cy: 40, r: 18 }, 'orange'),
    s('circle', { cx: 80, cy: 40, r: 11 }, 'yellow')
  ],
  'traición': [
    s('path', { d: heart(80, 62, 30) }, 'red', { accent: true }),
    s('path', { d: 'M80 34l-8 16 10 12-10 14 8 16', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M24 128q14-12 28 0t28 0t28 0', ...SW(8) }, 'green', { stroke: true }),
    s('ellipse', { cx: 116, cy: 126, rx: 10, ry: 7 }, 'green'),
    s('path', { d: 'M126 126l8-3M126 126l8 3', ...SW(2) }, 'red', { stroke: true }),
    s('circle', { cx: 118, cy: 123, r: 2 }, 'dark')
  ],
  trama: [
    s('path', { d: 'M36 24v112M60 24v112M84 24v112M108 24v112M132 24v112', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'tan', { stroke: true }),
    s('path', { d: 'M22 40h120M22 64h120M22 88h120M22 112h120', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M36 28v108M84 28v108M132 28v108', ...SW(14, { 'stroke-linecap': 'butt', 'stroke-dasharray': '24 24' }) }, 'tan', { stroke: true }),
    s('path', { d: 'M60 52v84M108 52v84', ...SW(14, { 'stroke-linecap': 'butt', 'stroke-dasharray': '24 24' }) }, 'tan', { stroke: true })
  ],
  usado: [
    s('path', { d: 'M22 120V88q0-10 10-10h30l14 14q30 4 52 10q12 4 12 18z' }, 'blue'),
    s('rect', { x: 18, y: 118, width: 126, height: 12, rx: 5 }, 'gray'),
    s('rect', { x: 32, y: 88, width: 22, height: 16, rx: 2, transform: 'rotate(-8 43 96)' }, 'orange', { accent: true }),
    s('path', { d: 'M30 92l4 3M50 86l3 4M70 96l8-6M80 100l8-6', ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 108, cy: 106, r: 4 }, 'dark'),
    s('path', { d: 'M120 112l6-5M128 114l4-4', ...SW(2) }, 'dark', { stroke: true })
  ],
  voluntario: [
    ground(),
    ...person(70, 136, 'green', { accent: true }),
    s('path', { d: 'M82 96l14-40', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 98, cy: 50, r: 8 }, 'skin'),
    s('path', { d: heart(70, 108, 8) }, 'white'),
    s('path', { d: 'M108 40l8-6M110 54h10', ...SW(3) }, 'orange', { stroke: true })
  ],
  'adquisición': [
    s('path', { d: 'M134 80l14-20v40z' }, 'blue'),
    s('ellipse', { cx: 92, cy: 80, rx: 44, ry: 32 }, 'blue'),
    s('path', { d: 'M46 62l34 18-34 18z' }, 'white'),
    s('circle', { cx: 82, cy: 64, r: 4 }, 'dark'),
    s('path', { d: ells([[30, 80, 9, 5]]) + 'M22 80l-8-6v12z' }, 'orange', { accent: true }),
    s('path', { d: 'M104 72q6 8 0 16M116 70q6 10 0 20', ...SW(3) }, 'navy', { stroke: true })
  ],
  'antigüedad': [
    s('ellipse', { cx: 80, cy: 138, rx: 24, ry: 4 }, 'gray'),
    s('path', { d: 'M68 44q-20-2-18 22M92 44q20-2 18 22', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M66 20h28v10q-4 4-4 10q30 14 30 50q0 30-30 44H70q-30-14-30-44q0-36 30-50q0-6-4-10z' }, 'brown', { accent: true }),
    s('path', { d: 'M44 84h72M48 100h64', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M98 54l-8 10 6 8-6 10', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(130, 30, 7) + sparkle(28, 40, 6) }, 'yellow')
  ],
  balance: [
    ...paper(26, 18, 108, 124),
    s('path', { d: 'M80 30v66', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 40h32M38 56h32M38 72h32M38 88h24', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M90 40h32M90 56h32M90 72h20', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M38 110h84M38 118h84', ...SW(3) }, 'dark', { stroke: true, accent: true })
  ],
  beca: [
    s('rect', { x: 24, y: 40, width: 84, height: 44, rx: 4 }, 'cream'),
    s('path', { d: ells([[24, 62, 8, 22], [108, 62, 8, 22]]) }, 'tan'),
    s('path', { d: 'M36 54h60M36 66h44', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 84l-6 24 8-4 6 6 2-26z' }, 'red'),
    s('circle', { cx: 66, cy: 84, r: 10 }, 'red', { accent: true }),
    s('circle', { cx: 116, cy: 114, r: 22 }, 'yellow'),
    s('circle', { cx: 116, cy: 114, r: 14, ...SW(3) }, 'orange', { stroke: true })
  ],
  canario: [
    s('path', { d: 'M36 130V72a44 40 0 0 1 88 0v58M58 130V38M80 130V32M102 130V38M80 32V18', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 28, y: 128, width: 104, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M44 104h72', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M66 94l-14 8 4-12z' }, 'orange'),
    s('ellipse', { cx: 78, cy: 90, rx: 16, ry: 12 }, 'yellow', { accent: true }),
    s('circle', { cx: 92, cy: 76, r: 9 }, 'yellow'),
    s('path', { d: 'M100 75l8 2-8 4z' }, 'orange'),
    s('circle', { cx: 94, cy: 74, r: 2 }, 'dark')
  ],
  casar: [
    ground(),
    ...person(54, 136, 'navy'),
    s('circle', { cx: 106, cy: 74, r: 12 }, 'skin'),
    s('path', { d: 'M98 86h16l14 50H84z' }, 'white'),
    s('path', { d: 'M98 86h16l14 50H84zM96 70q-8 20-14 36', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[98, 104], [106, 100], [104, 110]], 5) }, 'pink'),
    s('path', { d: heart(80, 36, 12) }, 'red', { accent: true })
  ],
  citado: [
    ...paper(28, 18, 84, 120),
    s('rect', { x: 36, y: 62, width: 68, height: 20, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M40 38h60M40 50h60M40 72h60M40 94h60M40 108h60M40 122h40', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M88 14v26l6-5 6 5V14z' }, 'red'),
    arrow('M146 72h-26m8-8l-8 8 8 8', 'orange', 5)
  ],
  considerable: [
    s('path', { d: 'M14 136q20-70 66-80q46 10 66 80z' }, 'yellow', { accent: true }),
    s('path', { d: ring(50, 112, 8) + ring(80, 92, 8) + ring(112, 114, 8) + ring(80, 124, 8) + ring(64, 76, 6) + ring(98, 76, 6), ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: sparkle(80, 34, 10) + sparkle(34, 70, 7) + sparkle(128, 68, 7) }, 'orange')
  ],
  convento: [
    ground(),
    s('rect', { x: 62, y: 30, width: 36, height: 56 }, 'tan'),
    s('path', { d: 'M58 32l22-20 22 20z' }, 'red', { accent: true }),
    s('path', { d: 'M72 64V52a8 8 0 0 1 16 0v12z' }, 'dark'),
    s('path', { d: 'M74 62q0-10 6-10t6 10z' }, 'yellow'),
    s('rect', { x: 20, y: 84, width: 120, height: 52 }, 'tan'),
    s('path', { d: 'M14 86h132l-10-12H24z' }, 'red'),
    s('path', { d: 'M72 136v-20a8 8 0 0 1 16 0v20zM32 98h10v16H32zM118 98h10v16h-10z' }, 'brown')
  ],
  coro: [
    s('path', { d: busts([40, 80, 120], 140, 30, 40) }, 'purple', { accent: true }),
    s('path', { d: dots([[40, 86], [80, 82], [120, 86]], 13) }, 'skin'),
    s('path', { d: ells([[40, 92, 3, 4], [80, 88, 3, 4], [120, 92, 3, 4]]) }, 'dark'),
    ...note(52, 46, 'blue'),
    ...note(100, 38, 'red')
  ],
  decena: [
    s('path', { d: 'M80 18l62 106H18z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[80, 46], [67, 68], [93, 68], [54, 90], [80, 90], [106, 90], [41, 112], [67, 112], [93, 112], [119, 112]], 10) }, 'blue', { accent: true }),
    s('path', { d: dots([[77, 43], [64, 65], [90, 65], [51, 87], [77, 87], [103, 87], [38, 109], [64, 109], [90, 109], [116, 109]], 3) }, 'white')
  ],
  desigualdad: [
    ground(),
    s('path', { d: 'M18 126L142 74', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M70 136l10-36 10 36z' }, 'dark'),
    s('rect', { x: 22, y: 88, width: 34, height: 32, rx: 3, transform: 'rotate(-23 39 120)' }, 'gray'),
    ...person(126, 78, 'orange', { h: 20, w: 14, r: 7, accent: true })
  ],
  disputa: [
    ...person(30, 136, 'blue'),
    ...person(130, 136, 'red', { accent: true }),
    s('rect', { x: 14, y: 24, width: 52, height: 32, rx: 8 }, 'sky'),
    s('rect', { x: 94, y: 24, width: 52, height: 32, rx: 8 }, 'pink'),
    s('path', { d: 'M24 40q6-8 12 0t12 0M104 40q6-8 12 0t12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 54l-14 26h10l-6 22 18-30h-10l8-18z' }, 'yellow')
  ],
  espectacular: [
    backdrop('navy'),
    s('path', { d: rays(50, 50, 8, 28, 12), ...SW(4) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: rays(112, 42, 6, 22, 10), ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: rays(88, 84, 4, 14, 8), ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M14 146V112h18v-14h16v20h14V96h20v22h16v-30h18v24h16v12h14v34z' }, 'dark'),
    s('path', { d: dots([[24, 122], [56, 126], [90, 110], [118, 104], [136, 130]], 2.5) }, 'yellow')
  ],
  evidentemente: [
    s('circle', { cx: 80, cy: 82, r: 40 }, 'yellow', { flatOnly: true }),
    s('circle', { cx: 80, cy: 82, r: 24 }, 'red', { accent: true }),
    arrow('M18 82h26m-10-10l10 10-10 10', 'orange', 6),
    arrow('M142 82h-26m10-10l-10 10 10 10', 'orange', 6),
    arrow('M80 18v26m-10-10l10 10 10-10', 'orange', 6),
    s('path', { d: 'M70 74q4-8 12-8', ...SW(4) }, 'white', { stroke: true })
  ],
  full: [
    backdrop('green'),
    ...[-36, -18, 0, 18, 36].map((a, i) => s('rect', { x: 64, y: 34, width: 32, height: 48, rx: 4, transform: `rotate(${a} 80 124)` }, 'white', i === 4 ? { accent: true } : {})),
    s('path', { d: [-36, -18, 0].map(a => { const r = a * Math.PI / 180; return heart(+(80 + 72 * Math.sin(r)).toFixed(1), +(124 - 72 * Math.cos(r)).toFixed(1), 7); }).join('') }, 'red'),
    s('path', { d: dots([18, 36].map(a => { const r = a * Math.PI / 180; return [+(80 + 76 * Math.sin(r)).toFixed(1), +(124 - 76 * Math.cos(r)).toFixed(1)]; }), 6) }, 'dark')
  ],
  'hipótesis': [
    ...person(46, 136, 'blue'),
    s('path', { d: 'M58 100l8-20', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: ells([[68, 66, 3, 3], [78, 56, 5, 5]]) }, 'gray'),
    s('path', { d: ells([[108, 38, 26, 20], [86, 44, 14, 12], [130, 46, 14, 12]]) }, 'mint'),
    s('path', { d: 'M104 22h10v10l10 18H94l10-18z' }, 'purple', { accent: true })
  ],
  humedad: [
    s('rect', { x: 24, y: 20, width: 112, height: 116 }, 'sky'),
    s('path', { d: drop(46, 44, 5) + drop(60, 100, 6) + drop(104, 42, 4) + drop(116, 112, 6) + drop(98, 98, 4) + drop(44, 120, 4) + drop(122, 58, 5) }, 'blue', { accent: true }),
    s('path', { d: 'M46 50v12M116 118v8M60 106v8', ...SW(2) }, 'blue', { stroke: true }),
    s('path', { d: 'M24 20h112v116H24zM80 20v116M24 78h112', ...SW(6) }, 'brown', { stroke: true })
  ],
  ida: [
    ground(),
    s('rect', { x: 18, y: 106, width: 30, height: 30 }, 'tan'),
    s('path', { d: 'M14 108l19-18 19 18z' }, 'red'),
    arrow('M58 120h50m-12-12l12 12-12 12', 'orange', 6),
    s('path', { d: 'M126 136V60', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M126 60l20 10-20 10z' }, 'green', { accent: true })
  ],
  inicialmente: [
    s('path', { d: 'M48 80H136', ...DASH(5, '2 12') }, 'gray', { stroke: true }),
    s('circle', { cx: 136, cy: 80, r: 8 }, 'gray'),
    s('circle', { cx: 34, cy: 80, r: 20 }, 'green', { accent: true }),
    s('path', { d: 'M28 70l16 10-16 10z' }, 'white'),
    s('path', { d: sparkle(34, 40, 8) }, 'yellow')
  ],
  integridad: [
    s('path', { d: 'M80 80V30a50 50 0 0 1 50 50z' }, 'red'),
    s('path', { d: 'M80 80h50a50 50 0 0 1-50 50z' }, 'blue'),
    s('path', { d: 'M80 80v50a50 50 0 0 1-50-50z' }, 'yellow'),
    s('path', { d: 'M80 80H30a50 50 0 0 1 50-50z' }, 'green', { accent: true }),
    s('path', { d: 'M80 30v100M30 80h100', ...SW(3) }, 'white', { stroke: true })
  ],
  lamentablemente: [
    ground(),
    ...person(48, 136, 'orange', { h: 34, w: 24, r: 11 }),
    s('path', { d: 'M43 95q5-4 10 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: drop(57, 92, 3) }, 'sky'),
    s('path', { d: 'M110 118l26-8-6 14z' }, 'tan'),
    s('path', { d: 'M88 136q0-16 18-16t18 16z' }, 'pink', { accent: true })
  ],
  lealtad: [
    ground(),
    ...person(44, 136, 'blue'),
    s('path', { d: 'M88 110q-10-8-6-18M94 120v16M120 120v16', ...SW(6) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 108, cy: 112, rx: 22, ry: 12 }, 'brown'),
    s('circle', { cx: 124, cy: 92, r: 12 }, 'brown'),
    s('path', { d: 'M116 84q-8 10 0 18', ...SW(5) }, 'tan', { stroke: true }),
    s('circle', { cx: 128, cy: 88, r: 2 }, 'dark'),
    s('path', { d: heart(86, 50, 10) }, 'red', { accent: true })
  ],
  'lesión': [
    ground(),
    s('path', { d: 'M62 114l34-18 14 40', ...SW(12) }, 'blue', { stroke: true }),
    s('rect', { x: 44, y: 76, width: 28, height: 40, rx: 9 }, 'red'),
    s('circle', { cx: 58, cy: 62, r: 12 }, 'skin'),
    s('path', { d: 'M66 92l28 2', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 88, y: 88, width: 16, height: 14, rx: 3, transform: 'rotate(-28 96 95)' }, 'white'),
    s('path', { d: 'M108 74l6-8M116 86l10-2', ...SW(3) }, 'red', { stroke: true, accent: true })
  ],
  libremente: [
    s('path', { d: 'M24 130V84a26 24 0 0 1 52 0v46M37 130V64M50 130V60M63 130V64M76 130l20-8V94l-20 8', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 18, y: 128, width: 64, height: 8, rx: 3 }, 'brown'),
    s('path', { d: 'M82 90q16-14 22-34', ...DASH(2, '4 5') }, 'gray', { stroke: true }),
    s('ellipse', { cx: 116, cy: 46, rx: 14, ry: 9 }, 'sky', { accent: true }),
    s('path', { d: 'M108 44q2-22 18-24q0 16-10 26z' }, 'blue'),
    s('path', { d: 'M129 42l9 3-9 4z' }, 'orange')
  ],
  ligeramente: [
    s('path', { d: 'M130 70q10 20-8 34t-4 30', ...DASH(2, '4 5') }, 'gray', { stroke: true }),
    s('path', { d: 'M44 120q10-60 80-84q-12 64-80 84z' }, 'sky', { accent: true }),
    s('path', { d: 'M40 126q36-40 80-86', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M70 94l-8-10M86 76l-8-12M100 60l-6-12M80 98l12 4M96 80l12 4', ...SW(2) }, 'white', { stroke: true })
  ],
  marta: [
    s('path', { d: 'M14 122h132', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M48 98q-26 4-30 22M64 108v12M100 108v12', ...SW(8) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 80, cy: 98, rx: 36, ry: 14 }, 'brown', { accent: true }),
    s('path', { d: 'M110 76l2-10 7 7zM124 74l5-8 3 9z' }, 'brown'),
    s('circle', { cx: 120, cy: 86, r: 13 }, 'brown'),
    s('ellipse', { cx: 112, cy: 98, rx: 9, ry: 6 }, 'tan'),
    s('path', { d: dots([[122, 83], [132, 89]], 2) }, 'dark')
  ],
  'modificación': [
    s('rect', { x: 18, y: 26, width: 124, height: 100, rx: 4 }, 'blue'),
    s('path', { d: 'M18 56h124M18 86h124M58 26v100M98 26v100', ...SW(1) }, 'sky', { stroke: true }),
    s('path', { d: 'M36 112V82l24-20 24 20v30z', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M96 128l28-34', ...SW(9) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M118 92a14 14 0 1 1 20-18l-10 4-2 8z' }, 'orange')
  ],
  modificar: [
    ...paper(22, 20, 92, 116),
    s('path', { d: 'M34 40h60M34 56h60M34 76h50', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 76h58', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M34 94h40', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M98 122l30-52', ...SW(10) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M128 70l4-6', ...SW(10) }, 'pink', { stroke: true }),
    s('path', { d: 'M96 126l2-4', ...SW(5) }, 'dark', { stroke: true })
  ],
  'monarquía': [
    s('path', { d: 'M24 116q56-20 112 0q4 12-6 16q-50-12-100 0q-10-4-6-16z' }, 'red'),
    s('path', { d: dots([[24, 126], [136, 126]], 4) }, 'yellow'),
    s('path', { d: 'M44 104l-6-50 22 22 20-34 20 34 22-22-6 50z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[38, 52], [80, 40], [122, 52]], 5) }, 'yellow'),
    s('path', { d: dots([[60, 92], [80, 90], [100, 92]], 5) }, 'blue')
  ],
  pilar: [
    s('rect', { x: 18, y: 20, width: 124, height: 14, rx: 2 }, 'brown', { accent: true }),
    s('rect', { x: 50, y: 34, width: 60, height: 10, rx: 2 }, 'gray'),
    s('rect', { x: 60, y: 44, width: 40, height: 78 }, 'gray'),
    s('path', { d: 'M70 48v70M80 48v70M90 48v70', ...SW(2) }, 'white', { stroke: true }),
    s('rect', { x: 48, y: 122, width: 64, height: 14, rx: 2 }, 'gray'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'dark', { stroke: true })
  ],
  posta: [
    ground(),
    ...lean(46, 136, 14, 'blue'),
    ...lean(112, 136, 14, 'orange'),
    s('path', { d: 'M60 102l18-6M104 96h-14', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 76, y: 90, width: 18, height: 7, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M14 84h10M14 98h8', ...SW(3) }, 'gray', { stroke: true })
  ],
  seminario: [
    ...paper(18, 20, 72, 52),
    s('path', { d: 'M34 62V48M48 62V38M62 62V52', ...SW(7) }, 'blue', { stroke: true, accent: true }),
    ...person(112, 106, 'green', { h: 36, w: 24, r: 11 }),
    s('path', { d: 'M102 80L84 62', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: busts([30, 62, 94, 126], 146, 24, 24) }, 'purple'),
    s('path', { d: dots([[30, 113], [62, 113], [94, 113], [126, 113]], 10) }, 'skin')
  ],
  suministro: [
    s('path', { d: 'M30 64l42 50M130 64l-42 50M80 64v50', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 64a50 44 0 0 1 100 0q-12-8-25 0q-13-8-25 0q-12-8-25 0q-13-8-25 0z' }, 'red', { accent: true }),
    s('path', { d: 'M55 64q0-30 25-44M105 64q0-30-25-44', ...SW(2) }, 'white', { stroke: true }),
    s('rect', { x: 62, y: 110, width: 36, height: 30, rx: 2 }, 'brown'),
    s('path', { d: 'M62 110l36 30M98 110l-36 30', ...SW(3) }, 'tan', { stroke: true })
  ],
  tejido: [
    s('rect', { x: 26, y: 46, width: 54, height: 42 }, 'purple'),
    s('path', { d: 'M32 56l5 6 5-6 5 6 5-6 5 6 5-6 5 6 5-6 5 6M32 68l5 6 5-6 5 6 5-6 5 6 5-6 5 6 5-6 5 6M32 80l5 6 5-6 5 6 5-6 5 6 5-6 5 6 5-6 5 6', ...SW(2) }, 'pink', { stroke: true }),
    s('path', { d: 'M20 30l70 58M50 22l26 82', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 104q-14 0-20-16', ...SW(2) }, 'pink', { stroke: true }),
    s('circle', { cx: 110, cy: 106, r: 26 }, 'pink', { accent: true }),
    s('path', { d: 'M88 96q22-10 44 6M86 110q24-10 48 4M98 128q14-12 32-10', ...SW(2) }, 'red', { stroke: true })
  ],
  test: [
    ...paper(24, 16, 88, 124),
    s('path', { d: [36, 58, 80, 102, 124].map(y => [46, 62, 78, 94].map(x => ring(x, y, 5)).join('')).join(''), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: dots([[62, 36], [46, 58], [94, 80], [78, 102], [62, 124]], 5) }, 'navy', { accent: true }),
    s('path', { d: 'M120 132l18-60', ...SW(8) }, 'yellow', { stroke: true }),
    s('path', { d: 'M118 138l2-6', ...SW(4) }, 'dark', { stroke: true })
  ],
  acoso: [
    ...person(80, 136, 'sky', { h: 34, w: 24, r: 11 }),
    s('path', { d: ells([[36, 46, 22, 16], [124, 42, 22, 16], [28, 98, 15, 11], [132, 94, 15, 11]]) }, 'dark'),
    s('path', { d: 'M38 38l-5 8h9l-5 8M126 34l-5 8h9l-5 8M28 92l-3 6h6l-3 6M132 88l-3 6h6l-3 6', ...SW(2) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: drop(96, 82, 4) }, 'sky')
  ],
  aportar: [
    ground(),
    s('path', { d: rects([[62, 116, 40, 20], [62, 96, 40, 20], [62, 76, 40, 20]]) }, 'red'),
    s('path', { d: 'M62 96h40M62 116h40', ...SW(2) }, 'cream', { stroke: true }),
    s('rect', { x: 64, y: 50, width: 36, height: 18, rx: 2 }, 'orange', { accent: true }),
    ...person(30, 136, 'blue'),
    s('path', { d: 'M42 96L64 62', ...SW(7) }, 'skin', { stroke: true }),
    ...person(132, 136, 'green')
  ],
  arreglo: [
    s('path', { d: 'M44 44l64 64', ...SW(12) }, 'gray', { stroke: true }),
    s('circle', { cx: 40, cy: 40, r: 18 }, 'gray'),
    s('rect', { x: 22, y: 33, width: 18, height: 14, transform: 'rotate(45 31 40)' }, 'white'),
    s('path', { d: 'M124 36L80 80', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 80L48 112', ...SW(14) }, 'red', { stroke: true, accent: true })
  ],
  arturo: [
    ...person(66, 136, 'orange', { w: 60, h: 54 }),
    s('ellipse', { cx: 66, cy: 70, rx: 6, ry: 5 }, 'dark'),
    s('path', { d: 'M94 100l14-22', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M108 78l-6 8', ...SW(5) }, 'cream', { stroke: true }),
    s('ellipse', { cx: 116, cy: 66, rx: 13, ry: 10, transform: 'rotate(-50 116 66)' }, 'brown', { accent: true }),
    s('path', { d: ells([[128, 132, 18, 4], [128, 124, 18, 4], [128, 116, 18, 4]]) }, 'sky')
  ],
  autopista: [
    s('path', { d: rects([[14, 14, 16, 132], [130, 14, 16, 132]]) }, 'green'),
    s('rect', { x: 30, y: 14, width: 100, height: 132 }, 'gray'),
    s('path', { d: 'M35 14v132M125 14v132', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M57 14v132M80 14v132M103 14v132', ...DASH(3, '10 10') }, 'white', { stroke: true }),
    s('rect', { x: 40, y: 30, width: 12, height: 22, rx: 3 }, 'blue'),
    s('rect', { x: 86, y: 78, width: 12, height: 22, rx: 3 }, 'red', { accent: true }),
    s('rect', { x: 108, y: 36, width: 12, height: 22, rx: 3 }, 'yellow')
  ],
  azar: [
    s('rect', { x: 20, y: 52, width: 54, height: 54, rx: 10, transform: 'rotate(-12 47 79)' }, 'white'),
    s('rect', { x: 20, y: 52, width: 54, height: 54, rx: 10, transform: 'rotate(-12 47 79)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[33, 66], [47, 79], [61, 92]], 5), transform: 'rotate(-12 47 79)' }, 'dark'),
    s('rect', { x: 84, y: 62, width: 54, height: 54, rx: 10, transform: 'rotate(12 111 89)' }, 'red', { accent: true }),
    s('path', { d: dots([[97, 76], [125, 76], [97, 102], [125, 102]], 5), transform: 'rotate(12 111 89)' }, 'white')
  ],
  center: [
    s('path', { d: 'M138 46v90', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 100, y: 18, width: 44, height: 30, rx: 2 }, 'sky'),
    s('path', { d: 'M108 54l4 14h12l4-14', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 52h28', ...SW(4) }, 'orange', { stroke: true }),
    ...person(66, 136, 'purple', { h: 64, w: 28, r: 12, accent: true }),
    s('path', { d: 'M76 80l16-36', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 94, cy: 36, r: 9 }, 'orange')
  ],
  choque: [
    ground(124),
    ...car(12, 96, 'blue'),
    ...car(86, 96, 'red'),
    s('path', { d: burst(78, 96, 24, 10, 10) }, 'yellow', { accent: true }),
    s('path', { d: 'M70 60l-4-10M80 58V46M90 60l4-10', ...SW(3) }, 'orange', { stroke: true })
  ],
  circo: [
    s('rect', { x: 28, y: 88, width: 104, height: 48 }, 'yellow'),
    s('path', { d: rects([[28, 88, 14, 48], [56, 88, 14, 48], [90, 88, 14, 48], [118, 88, 14, 48]]) }, 'red'),
    s('path', { d: 'M20 92l60-60 60 60z' }, 'red', { accent: true }),
    s('path', { d: 'M80 32L54 92M80 32l26 60', ...SW(8) }, 'white', { stroke: true }),
    s('path', { d: 'M68 136v-26a12 12 0 0 1 24 0v26z' }, 'dark'),
    s('path', { d: 'M80 32V14l14 6-14 6', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 14l12 5-12 5z' }, 'yellow')
  ],
  'colón': [
    s('rect', { x: 14, y: 44, width: 132, height: 72, rx: 6 }, 'green', { accent: true }),
    s('rect', { x: 22, y: 52, width: 116, height: 56, rx: 3, ...SW(3) }, 'mint', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 22 }, 'mint'),
    s('path', { d: 'M64 86h32l-6 8H70z' }, 'brown'),
    s('path', { d: 'M78 62v22H64zM82 66v18h12z' }, 'white'),
    s('path', { d: dots([[34, 64], [126, 96]], 5) }, 'mint')
  ],
  consenso: [
    s('path', { d: 'M30 104L22 70M50 104l6-34M70 104l-6-34M90 104l6-34M110 104l-6-34M130 104l8-34', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: busts([40, 80, 120], 140, 30, 40) }, 'blue'),
    s('path', { d: dots([[40, 86], [80, 86], [120, 86]], 12) }, 'skin'),
    s('path', { d: 'M64 36l10 10 22-22', ...SW(7) }, 'green', { stroke: true, accent: true })
  ],
  'consideración': [
    ground(),
    s('path', { d: drop(30, 30, 4) + drop(60, 22, 4) + drop(132, 26, 4) + drop(22, 70, 4) }, 'sky'),
    ...person(52, 136, 'green', { accent: true }),
    ...person(110, 136, 'orange', { h: 34, w: 24, r: 11 }),
    s('path', { d: 'M104 56L64 98', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M70 58a36 24 0 0 1 72 0z' }, 'red')
  ],
  continuidad: [
    s('path', { d: 'M80 80c-16-24-56-24-56 0s40 24 56 0s56-24 56 0s-40 24-56 0', ...SW(14) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M80 80c-16-24-56-24-56 0s40 24 56 0s56-24 56 0s-40 24-56 0', ...DASH(3, '6 8') }, 'white', { stroke: true }),
    arrow('M118 56l12 6-8 10', 'orange', 4)
  ],
  cueva: [
    s('path', { d: 'M14 136q4-90 66-100q62 10 66 100z' }, 'gray'),
    s('path', { d: 'M44 136q0-56 36-62q36 6 36 62z' }, 'dark', { accent: true }),
    s('path', { d: 'M62 80l4 12 4-12zM90 78l4 14 4-14z' }, 'gray'),
    s('path', { d: 'M80 108q-6-8-14-6q4 4 2 8q-6-2-10 4q8 0 12 4q4-4 10-4q6 0 10 4q4-4 12-4q-4-6-10-4q-2-4 2-8q-8-2-14 6z' }, 'purple'),
    s('path', { d: dots([[77, 110], [83, 110]], 1.5) }, 'yellow')
  ],
  defecto: [
    s('path', { d: 'M100 70h12a14 14 0 0 1 0 28h-12', ...SW(8) }, 'sky', { stroke: true }),
    s('rect', { x: 36, y: 52, width: 66, height: 80, rx: 8 }, 'sky', { accent: true }),
    s('path', { d: 'M78 52l6 10 6-10z' }, 'white'),
    s('path', { d: 'M58 52l8 18-10 14 8 18-6 10', ...SW(3) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 69, cy: 138, rx: 36, ry: 4 }, 'gray')
  ],
  eficiencia: [
    s('path', { d: 'M28 104a52 52 0 0 1 15.2-36.8', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true }),
    s('path', { d: 'M43.2 67.2a52 52 0 0 1 73.6 0', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'yellow', { stroke: true }),
    s('path', { d: 'M116.8 67.2a52 52 0 0 1 15.2 36.8', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M80 104l32-30', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 104, r: 8 }, 'dark'),
    s('rect', { x: 50, y: 120, width: 60, height: 10, rx: 5 }, 'gray')
  ],
  exclusiva: [
    s('path', { d: burst(108, 92, 32, 24, 14) }, 'red', { accent: true }),
    s('path', { d: star(108, 92, 14) }, 'yellow'),
    s('path', { d: 'M54 72v58', ...SW(12) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 54, cy: 48, rx: 20, ry: 26 }, 'gray'),
    s('path', { d: 'M38 42h32M36 54h36', ...SW(2) }, 'dark', { stroke: true })
  ],
  hermandad: [
    ground(),
    ...person(56, 136, 'blue'),
    ...person(104, 136, 'blue'),
    s('path', { d: 'M60 96q20-14 40 0', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 36, 12) }, 'red', { accent: true })
  ],
  'jurisdicción': [
    s('path', { d: 'M24 46q30-30 66-16q40-8 46 26q10 34-18 56q-36 22-70 2q-34-22-24-68z' }, 'mint'),
    s('path', { d: 'M24 46q30-30 66-16q40-8 46 26q10 34-18 56q-36 22-70 2q-34-22-24-68z', ...DASH(4, '8 6') }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M48 70l32-18 32 18z' }, 'brown'),
    s('path', { d: rects([[54, 72, 6, 28], [70, 72, 6, 28], [84, 72, 6, 28], [100, 72, 6, 28]]) }, 'gray'),
    s('rect', { x: 46, y: 100, width: 68, height: 8 }, 'brown')
  ],
  lucir: [
    s('path', { d: rays(80, 76, 50, 64, 12), ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 50, r: 12 }, 'skin'),
    s('path', { d: 'M72 62h16l16 72H56z' }, 'purple', { accent: true }),
    s('path', { d: sparkle(70, 90, 6) + sparkle(90, 108, 6) + sparkle(76, 122, 5) }, 'white'),
    s('path', { d: 'M70 40l2-10 4 5 4-8 4 8 4-5 2 10z' }, 'yellow')
  ],
  majestad: [
    s('path', { d: 'M40 136V40q40-14 80 0v96z' }, 'red'),
    s('path', { d: 'M54 136V70h52v66z' }, 'purple'),
    s('circle', { cx: 80, cy: 62, r: 14 }, 'skin'),
    s('path', { d: 'M62 84h36l8 52H54z' }, 'navy'),
    s('path', { d: 'M66 50l-2-18 8 8 8-14 8 14 8-8-2 18z' }, 'yellow', { accent: true }),
    s('path', { d: 'M68 70q12 18 24 0', ...SW(5) }, 'cream', { stroke: true }),
    s('path', { d: 'M62 86q18 10 36 0', ...SW(5) }, 'white', { stroke: true })
  ],
  maya: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M20 136v-18h120v18zM32 118v-18h96v18zM44 100V82h72v18zM56 82V64h48v18z' }, 'tan'),
    s('path', { d: 'M66 64V44h28v20z' }, 'brown', { accent: true }),
    s('path', { d: 'M72 136V64h16v72z' }, 'brown'),
    s('path', { d: 'M72 74h16M72 86h16M72 98h16M72 110h16M72 122h16', ...SW(2) }, 'tan', { stroke: true }),
    s('rect', { x: 74, y: 50, width: 12, height: 14 }, 'dark')
  ],
  'musulmán': [
    ground(),
    s('rect', { x: 120, y: 30, width: 12, height: 106 }, 'cream'),
    s('path', { d: 'M118 32l8-16 8 16z' }, 'green'),
    s('rect', { x: 30, y: 80, width: 84, height: 56 }, 'cream'),
    s('path', { d: 'M40 82q0-40 32-46q32 6 32 46z' }, 'green', { accent: true }),
    s('path', { d: 'M62 136v-24a10 10 0 0 1 20 0v24zM40 96h10v14H40zM94 96h10v14H94z' }, 'navy'),
    s('path', { d: 'M30 80h84v56H30zM120 30h12v106h-12z', ...SW(2) }, 'gray', { stroke: true })
  ],
  natal: [
    s('path', { d: star(124, 30, 10) }, 'yellow'),
    s('path', { d: 'M30 90h100v20q0 20-20 20H50q-20 0-20-20z' }, 'brown'),
    s('path', { d: 'M36 136l10-10M124 136l-10-10', ...SW(5) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 80, cy: 84, rx: 40, ry: 14 }, 'sky', { accent: true }),
    s('circle', { cx: 52, cy: 76, r: 13 }, 'skin'),
    s('path', { d: 'M48 78q4 3 8 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 70q12-14 24 0', ...SW(4) }, 'pink', { stroke: true })
  ],
  negociar: [
    ...person(30, 136, 'navy'),
    ...person(130, 136, 'red'),
    s('rect', { x: 44, y: 104, width: 72, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M50 114v22M110 114v22', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 26, y: 20, width: 46, height: 30, rx: 8 }, 'sky'),
    s('rect', { x: 88, y: 26, width: 46, height: 30, rx: 8 }, 'yellow', { accent: true }),
    s('path', { d: dots([[49, 35]], 9) + dots([[111, 41]], 9) }, 'orange'),
    arrow('M70 64h20m-6-6l6 6-6 6M90 76H70m6-6l-6 6 6 6', 'gray', 3)
  ],
  'perfección': [
    s('path', { d: star(28, 80, 14) + star(54, 80, 14) + star(80, 80, 14) + star(106, 80, 14) + star(132, 80, 14) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(80, 40, 10) + sparkle(40, 116, 6) + sparkle(120, 116, 6) }, 'orange'),
    s('path', { d: 'M20 106h120', ...SW(3) }, 'gray', { stroke: true })
  ],
  'precisión': [
    s('path', { d: ring(80, 96, 40), ...DASH(3, '6 5') }, 'gray', { stroke: true }),
    s('path', { d: 'M80 96L64 30a40 40 0 0 1 56 6', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M76 22L62 136M84 22l36 104', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 22, r: 8 }, 'red', { accent: true }),
    s('path', { d: 'M120 126l4 10', ...SW(4) }, 'dark', { stroke: true })
  ],
  retirar: [
    s('rect', { x: 32, y: 18, width: 96, height: 118, rx: 6 }, 'gray'),
    s('rect', { x: 44, y: 30, width: 72, height: 36, rx: 3 }, 'sky'),
    s('path', { d: rects([[46, 76, 12, 8], [62, 76, 12, 8], [78, 76, 12, 8], [46, 88, 12, 8], [62, 88, 12, 8], [78, 88, 12, 8]]) }, 'dark'),
    s('rect', { x: 46, y: 108, width: 68, height: 6, rx: 3 }, 'dark'),
    s('rect', { x: 56, y: 110, width: 48, height: 30, rx: 2 }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 126, r: 6 }, 'mint'),
    s('path', { d: 'M96 78h16v16H96z' }, 'red')
  ],
  salamanca: [
    s('path', { d: ells([[60, 42, 14, 10], [88, 30, 16, 12], [106, 46, 12, 9]]) }, 'purple'),
    s('path', { d: 'M40 136l8-10M120 136l-8-10', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 74h100q0 56-50 56t-50-56z' }, 'dark'),
    s('rect', { x: 26, y: 68, width: 108, height: 12, rx: 6 }, 'gray'),
    s('ellipse', { cx: 80, cy: 72, rx: 46, ry: 5 }, 'green', { accent: true }),
    s('path', { d: 'M88 70q10-16 26-10M112 62l10 2M100 66l-4-8M108 64l2-8', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: dots([[64, 66], [76, 60]], 4) }, 'mint')
  ],
  secuestro: [
    ...person(80, 126, 'gray'),
    s('path', { d: 'M30 132V36h100v96M50 36v96M70 36v96M90 36v96M110 36v96', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 24, y: 128, width: 112, height: 10, rx: 3 }, 'dark'),
    s('rect', { x: 24, y: 28, width: 112, height: 10, rx: 3 }, 'dark'),
    s('path', { d: 'M112 86v-8a8 8 0 0 1 16 0v8', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 108, y: 86, width: 24, height: 20, rx: 3 }, 'yellow', { accent: true })
  ],
  sensibilidad: [
    s('path', { d: ring(80, 62, 14) + ring(80, 62, 26) + ring(80, 62, 38), ...SW(3) }, 'sky', { stroke: true }),
    s('circle', { cx: 80, cy: 62, r: 5 }, 'blue', { accent: true }),
    s('path', { d: 'M80 70v50', ...SW(18) }, 'skin', { stroke: true }),
    s('rect', { x: 62, y: 104, width: 36, height: 40, rx: 12 }, 'skin'),
    s('path', { d: 'M74 72q6-4 12 0', ...SW(2) }, 'tan', { stroke: true })
  ],
  sexto: [
    s('path', { d: rects([[16, 66, 18, 30], [38, 66, 18, 30], [60, 66, 18, 30], [82, 66, 18, 30], [104, 66, 18, 30]]) }, 'gray'),
    s('rect', { x: 126, y: 58, width: 20, height: 46, rx: 3 }, 'red', { accent: true }),
    arrow('M136 20v28m-8-8l8 8 8-8', 'orange', 5),
    s('path', { d: 'M16 112h130', ...SW(3) }, 'dark', { stroke: true })
  ],
  suyos: [
    ground(),
    ...person(36, 136, 'blue'),
    ...person(64, 136, 'green'),
    s('path', { d: 'M78 108l20-2', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: rects([[98, 96, 22, 40], [124, 108, 20, 28]]) }, 'orange', { accent: true }),
    s('path', { d: 'M104 96v-6h10v6M128 108v-6h12v6', ...SW(3) }, 'dark', { stroke: true }),
    arrow('M50 48q40-24 70 30m-2-14l2 14-12-6', 'purple', 4)
  ],
  traslado: [
    ground(),
    s('rect', { x: 16, y: 104, width: 34, height: 32 }, 'tan'),
    s('path', { d: 'M12 106l21-20 21 20z' }, 'red'),
    s('rect', { x: 110, y: 104, width: 34, height: 32 }, 'mint'),
    s('path', { d: 'M106 106l21-20 21 20z' }, 'blue'),
    s('rect', { x: 64, y: 108, width: 30, height: 26, rx: 2 }, 'brown', { accent: true }),
    arrow('M44 60q36-30 72 0m-14-2l14 2-2-14', 'orange', 5)
  ],
  truco: [
    s('path', { d: ells([[70, 56, 7, 20], [90, 56, 7, 20]]) }, 'white'),
    s('path', { d: ells([[70, 56, 7, 20], [90, 56, 7, 20]]), ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 82, r: 16 }, 'white'),
    s('path', { d: ring(80, 82, 16), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[74, 80], [86, 80]], 2.5) }, 'dark'),
    s('ellipse', { cx: 80, cy: 98, rx: 52, ry: 10 }, 'dark'),
    s('path', { d: 'M50 98v30q30 10 60 0V98z' }, 'black', { accent: true }),
    s('path', { d: 'M114 60l24-26', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(140, 30, 9) }, 'yellow')
  ],
  tubo: [
    s('path', { d: 'M20 50h60q24 0 24 24v34', ...SW(22, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: 'M20 44h60q30 0 30 30v34', ...SW(3, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('path', { d: rects([[14, 34, 10, 32], [88, 106, 32, 10]]) }, 'dark'),
    s('path', { d: drop(104, 132, 5) }, 'blue')
  ],
  vapor: [
    s('path', { d: 'M60 52q-12-12 0-24t0-24M80 56q-12-12 0-24t0-24M100 52q-12-12 0-24t0-24', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 70h92v48q0 18-18 18H52q-18 0-18-18z' }, 'red', { accent: true }),
    s('rect', { x: 28, y: 62, width: 104, height: 10, rx: 5 }, 'dark'),
    s('path', { d: 'M34 86H18M126 86h16', ...SW(6) }, 'dark', { stroke: true })
  ],
  violento: [
    s('path', { d: 'M30 30h100M42 50h76M54 70h52M64 90h32M72 110h18M80 128h6', ...SW(10) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: 'M40 40h80M52 60h56M62 80h36M70 100h22', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 120l14-6M132 70l14-4M24 70l10 6', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'green', { stroke: true })
  ],
  administrador: [
    s('rect', { x: 70, y: 30, width: 70, height: 48, rx: 4 }, 'dark'),
    s('rect', { x: 76, y: 36, width: 58, height: 36 }, 'sky'),
    ...gear(105, 54, 8, 8, 'navy', { accent: true }),
    s('path', { d: 'M105 78v12M92 92h26', ...SW(4) }, 'dark', { stroke: true }),
    ...person(40, 136, 'green'),
    s('rect', { x: 18, y: 100, width: 128, height: 10, rx: 3 }, 'brown')
  ],
  'afirmación': [
    s('rect', { x: 46, y: 116, width: 50, height: 28, rx: 4 }, 'blue'),
    s('rect', { x: 46, y: 66, width: 58, height: 52, rx: 14 }, 'skin', { accent: true }),
    s('path', { d: 'M62 70L70 30', ...SW(16) }, 'skin', { stroke: true }),
    s('path', { d: 'M100 76h12M100 90h14M100 104h12', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M100 72v42', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: sparkle(34, 40, 8) + sparkle(120, 36, 8) }, 'yellow')
  ],
  'agresión': [
    ground(),
    ...lean(52, 136, 18, 'red', { accent: true }),
    ...lean(108, 136, 24, 'blue'),
    s('path', { d: 'M74 96l16 0', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: burst(92, 92, 14, 6, 8) }, 'yellow'),
    s('path', { d: 'M18 80h12M16 96h14', ...SW(3) }, 'gray', { stroke: true })
  ],
  alba: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('path', { d: 'M14 60h132v40H14z' }, 'purple'),
    s('path', { d: 'M14 84h132v30H14z' }, 'pink'),
    s('circle', { cx: 80, cy: 112, r: 26 }, 'yellow', { accent: true }),
    s('path', { d: 'M14 110h132v24a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'dark'),
    s('path', { d: dots([[30, 30], [120, 34], [70, 24]], 2) }, 'white')
  ],
  artificial: [
    s('path', { d: 'M80 34V20', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 18, r: 6 }, 'red'),
    s('rect', { x: 36, y: 34, width: 88, height: 74, rx: 14 }, 'gray', { accent: true }),
    s('path', { d: rects([[26, 58, 10, 26], [124, 58, 10, 26]]) }, 'dark'),
    s('path', { d: dots([[62, 66], [98, 66]], 10) }, 'sky'),
    s('path', { d: 'M60 90h40', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 50, y: 112, width: 60, height: 30, rx: 8 }, 'blue')
  ],
  bala: [
    s('path', { d: 'M14 64h30M20 80h26M14 96h30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 64h44q36 0 42 16q-6 16-42 16H60z' }, 'orange', { accent: true }),
    s('rect', { x: 52, y: 62, width: 20, height: 36, rx: 2 }, 'yellow'),
    s('path', { d: 'M78 70h20', ...SW(3) }, 'yellow', { stroke: true })
  ],
  barba: [
    s('circle', { cx: 80, cy: 66, r: 36 }, 'skin'),
    s('path', { d: 'M44 60q0 80 36 80t36-80q-6 24-36 24t-36-24z' }, 'brown', { accent: true }),
    s('path', { d: 'M46 54q0-32 34-32t34 32q-8-14-34-14t-34 14z' }, 'brown'),
    s('path', { d: 'M66 96q14-8 28 0', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: dots([[66, 66], [94, 66]], 4) }, 'dark'),
    s('path', { d: 'M76 98q4 4 8 0', ...SW(3) }, 'red', { stroke: true })
  ],
  'cabrón': [
    ground(),
    s('path', { d: 'M56 104v32M72 108v28M104 108v28M118 104v32', ...SW(6) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 88, cy: 96, rx: 40, ry: 22 }, 'cream'),
    s('ellipse', { cx: 88, cy: 96, rx: 40, ry: 22, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 70q-4 24 18 30q14-6 12-24z' }, 'gray'),
    s('path', { d: 'M52 62a14 14 0 1 0-14 16', ...SW(8) }, 'brown', { stroke: true, accent: true }),
    s('circle', { cx: 40, cy: 82, r: 2.5 }, 'dark'),
    s('path', { d: 'M38 98l-2 12', ...SW(3) }, 'gray', { stroke: true })
  ],
  'civilización': [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M14 136l30-48 30 48z' }, 'yellow'),
    s('path', { d: 'M78 74l34-18 34 18z' }, 'brown', { accent: true }),
    s('path', { d: rects([[84, 78, 7, 52], [98, 78, 7, 52], [115, 78, 7, 52], [129, 78, 7, 52]]) }, 'gray'),
    s('rect', { x: 78, y: 128, width: 68, height: 8 }, 'brown'),
    s('path', { d: 'M66 136V46l4-8 4 8v90z' }, 'tan'),
    s('circle', { cx: 120, cy: 30, r: 10 }, 'orange')
  ],
  colocar: [
    s('path', { d: 'M18 110h124', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M34 110l10 26M126 110l-10 26', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M90 106q-12-14 0-30h20q12 16 0 30z', ...DASH(3, '5 4') }, 'gray', { stroke: true }),
    s('path', { d: 'M52 74q-12-14 0-30h20q12 16 0 30z' }, 'blue', { accent: true }),
    s('path', { d: 'M62 44V30q0-8 8-8h34', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M104 22h40', ...SW(14) }, 'orange', { stroke: true }),
    arrow('M80 60q14 4 20 20m-12-2l12 2 2-12', 'orange', 3)
  ],
  consejero: [
    s('path', { d: 'M90 136V84q0-12 12-12h28q12 0 12 12v52z' }, 'red'),
    ...person(116, 128, 'navy', { h: 40, w: 26, r: 11 }),
    s('rect', { x: 92, y: 96, width: 18, height: 22, rx: 2 }, 'cream'),
    s('path', { d: 'M18 136v-30h60v30zM18 106V92h18v14z' }, 'mint'),
    ...person(44, 112, 'orange', { h: 30, w: 22, r: 10, accent: true }),
    s('path', { d: ells([[78, 46, 16, 12], [96, 40, 14, 10]]) }, 'sky')
  ],
  contraste: [
    s('rect', { x: 18, y: 30, width: 62, height: 100 }, 'black', { accent: true }),
    s('rect', { x: 80, y: 30, width: 62, height: 100 }, 'white'),
    s('rect', { x: 18, y: 30, width: 124, height: 100, ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 49, cy: 80, r: 18 }, 'white'),
    s('circle', { cx: 111, cy: 80, r: 18 }, 'black')
  ],
  convencer: [
    ...person(34, 136, 'green', { accent: true }),
    s('path', { d: 'M46 100l18-12', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: bubble(20, 20, 50, 38) }, 'yellow'),
    s('circle', { cx: 45, cy: 36, r: 7 }, 'orange'),
    ...person(122, 136, 'blue'),
    s('path', { d: 'M110 52l8 8 16-16', ...SW(6) }, 'green', { stroke: true }),
    arrow('M74 52q16-4 26 4m-10-10l10 10-12 4', 'orange', 4)
  ],
  correctamente: [
    ...paper(30, 18, 100, 124),
    s('path', { d: rects([[42, 34, 20, 20], [42, 70, 20, 20], [42, 106, 20, 20]]), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M44 44l6 6 14-16M44 80l6 6 14-16M44 116l6 6 14-16', ...SW(5) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M74 44h44M74 80h44M74 116h36', ...SW(4) }, 'gray', { stroke: true })
  ],
  coste: [
    ...paper(24, 18, 64, 108),
    s('path', { d: 'M24 126l8 8 8-8 8 8 8-8 8 8 8-8 8 8 8-8', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 36h44M34 50h30M34 64h44M34 78h30M34 104h44', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 136v-40h44v40z' }, 'yellow', { accent: true }),
    s('path', { d: 'M96 106h44M96 116h44M96 126h44', ...SW(2) }, 'orange', { stroke: true }),
    s('circle', { cx: 118, cy: 72, r: 16 }, 'yellow'),
    s('circle', { cx: 118, cy: 72, r: 10, ...SW(3) }, 'orange', { stroke: true })
  ],
};
