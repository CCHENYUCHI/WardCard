// Illustration specs for common words, batch 0015 (plus leftovers of 0008, 0013, 0014 and 0016) (see server/scripts/lexicon/art.js)
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
const bricks = rects(Array.from({ length: 5 }, (_, j) => {
  const y = 38 + j * 20;
  return j % 2 ? [[20, y, 12, 16], [35, y, 28, 16], [66, y, 28, 16], [97, y, 28, 16], [128, y, 12, 16]]
    : [[20, y, 28, 16], [51, y, 28, 16], [82, y, 28, 16], [113, y, 27, 16]];
}).flat());
// Calendar cells: 4 rows x 5 cols
const cells = Array.from({ length: 20 }, (_, k) => [32 + (k % 5) * 20, 64 + Math.floor(k / 5) * 18, 16, 12]);

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
// Go board grid: 6 x 6 lines from 30 to 130
const goGrid = Array.from({ length: 6 }, (_, i) => `M${30 + i * 20} 30v100M30 ${30 + i * 20}h100`).join('');

module.exports = {
  carretero: [
    ground(),
    s('path', { d: 'M114 100l32 10', ...SW(5) }, 'tan', { stroke: true }),
    s('circle', { cx: 66, cy: 46, r: 11 }, 'skin'),
    s('path', { d: 'M54 38h24l-3-9H57z' }, 'dark'),
    s('rect', { x: 54, y: 58, width: 24, height: 30, rx: 8 }, 'green'),
    s('rect', { x: 26, y: 86, width: 90, height: 26, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: ring(48, 120, 14) + ring(96, 120, 14) + 'M48 106v28M34 120h28M96 106v28M82 120h28', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M76 70l20-6M96 64l16-40q12 6 16 22', ...SW(3) }, 'dark', { stroke: true })
  ],
  convenir: [
    ground(),
    ...person(42, 136, 'red'),
    ...person(118, 136, 'blue'),
    s('path', { d: 'M56 104l22-6M104 104l-22-6', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 80, cy: 97, r: 7 }, 'skin'),
    s('circle', { cx: 80, cy: 40, r: 20 }, 'green', { accent: true }),
    s('path', { d: 'M70 40l7 7 13-14', ...SW(5) }, 'white', { stroke: true })
  ],
  quitar: [
    ground(),
    ...person(56, 136, 'sky'),
    s('path', { d: 'M70 100l22-20', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M96 56h30l14 18-8 6-6-8v44H96V72l-6 8-8-6z' }, 'brown', { accent: true }),
    s('path', { d: 'M111 58v56', ...SW(2) }, 'tan', { stroke: true }),
    arrow('M100 34h36m-8-8l8 8-8 8')
  ],
  urgente: [
    s('path', { d: 'M80 14v16M42 32l10 12M118 32l-10 12M22 72h16M122 72h16', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M50 112V80a30 30 0 0 1 60 0v32z' }, 'red', { accent: true }),
    s('rect', { x: 62, y: 70, width: 8, height: 34, rx: 4 }, 'pink'),
    s('rect', { x: 40, y: 110, width: 80, height: 22, rx: 4 }, 'dark'),
    s('rect', { x: 32, y: 132, width: 96, height: 8, rx: 3 }, 'gray')
  ],
  verdaderamente: [
    ground(),
    ...person(80, 136, 'blue'),
    s('path', { d: heart(82, 102, 12) }, 'red', { accent: true }),
    s('path', { d: 'M66 116q4-16 18-16', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M72 78q3-3 6 0M82 78q3-3 6 0M74 85q6 4 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(36, 50, 12) + sparkle(124, 50, 12) + sparkle(130, 96, 8) + sparkle(30, 96, 8) }, 'yellow')
  ],
  virtual: [
    s('path', { d: busts([80], 148, 70, 40) }, 'purple'),
    s('circle', { cx: 80, cy: 80, r: 30 }, 'skin'),
    s('rect', { x: 42, y: 60, width: 76, height: 30, rx: 10 }, 'dark', { accent: true }),
    s('path', { d: 'M54 70h52', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M72 102q8 6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M20 30l12-6 12 6v14l-12 6-12-6zM116 26l12-6 12 6v14l-12 6-12-6z' }, 'sky'),
    s('path', { d: sparkle(130, 100, 9) + sparkle(28, 98, 9) }, 'mint')
  ],
  'álbum': [
    s('rect', { x: 14, y: 34, width: 132, height: 96, rx: 6 }, 'brown', { accent: true }),
    s('path', { d: rects([[20, 40, 58, 84], [82, 40, 58, 84]]) }, 'cream'),
    s('path', { d: rects([[26, 48, 46, 32], [88, 48, 46, 32], [30, 88, 38, 28], [92, 88, 38, 28]]) }, 'sky'),
    s('path', { d: 'M26 80l14-16 10 10 8-8 14 14zM92 116l12-14 12 14z' }, 'green'),
    s('path', { d: dots([[120, 60]], 6) + heart(49, 100, 8) }, 'red'),
    s('path', { d: 'M80 36v96', ...SW(3) }, 'tan', { stroke: true })
  ],
  'árabe': [
    backdrop('navy'),
    s('path', { d: 'M14 112q34-18 66-2t66-4v28a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'tan'),
    s('circle', { cx: 112, cy: 42, r: 16 }, 'yellow'),
    s('circle', { cx: 120, cy: 36, r: 14 }, 'navy'),
    s('path', { d: 'M28 80l84-12 12 16-84 12z' }, 'red', { accent: true }),
    s('path', { d: 'M38 84l74-10', ...DASH(3, '5 4') }, 'yellow', { stroke: true }),
    s('path', { d: 'M28 80l-6 4M40 96l-6 4M112 68l6-4M124 84l6-4', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: star(40, 36, 5) + star(66, 54, 4) + star(80, 28, 3) }, 'white')
  ],
  aborto: [
    ground(),
    ...lady(56, 136, 'purple'),
    s('path', { d: 'M46 102q10 6 20 0', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: heart(114, 52, 20) }, 'pink', { accent: true }),
    s('path', { d: 'M114 26l-6 12 10 8-8 12 6 14', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: drop(62, 78, 3) }, 'sky')
  ],
  borde: [
    backdrop('sky'),
    s('path', { d: 'M98 124h48v10a12 12 0 0 1-12 12H98z' }, 'blue'),
    s('path', { d: 'M14 70h84l-6 24 8 20-6 32H26a12 12 0 0 1-12-12z' }, 'green'),
    s('path', { d: 'M84 70h14l-6 24 8 20-6 32H84z' }, 'brown'),
    ...person(70, 70, 'red', { h: 30, w: 20, r: 9 }),
    s('path', { d: 'M100 24v40', ...DASH(4, '6 5') }, 'red', { stroke: true, accent: true })
  ],
  canto: [
    ground(),
    ...person(52, 136, 'green'),
    s('ellipse', { cx: 57, cy: 82, rx: 4, ry: 5 }, 'dark'),
    s('path', { d: 'M90 100h56v10h-46v26H90z' }, 'brown'),
    s('path', { d: burst(78, 114, 14, 6, 8) }, 'yellow'),
    ...note(90, 50, 'purple'),
    ...note(120, 70, 'blue')
  ],
  consciente: [
    s('path', { d: rays(80, 76, 50, 64, 12, -90), ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 76, r: 40 }, 'skin'),
    s('path', { d: ells([[64, 72, 10, 12], [96, 72, 10, 12]]) }, 'white'),
    s('path', { d: dots([[64, 74], [96, 74]], 6) }, 'blue', { accent: true }),
    s('path', { d: 'M52 54l16-4M108 54l-16-4M70 96q10 6 20 0', ...SW(4) }, 'dark', { stroke: true })
  ],
  curioso: [
    s('path', { d: 'M50 60l-4-32 24 14zM110 60l4-32-24 14z' }, 'orange'),
    s('circle', { cx: 80, cy: 76, r: 34 }, 'orange'),
    s('path', { d: ells([[66, 72, 9, 11], [94, 72, 9, 11]]) }, 'white'),
    s('path', { d: dots([[68, 74], [96, 74]], 5) }, 'dark'),
    s('path', { d: 'M80 88l-4-4h8zM40 88l20 2M40 96l20-2M120 88l-20 2M120 96l-20-2', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 22, y: 106, width: 116, height: 34, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: 'M22 106l-8-12h34l8 12zM138 106l8-12h-34l-8 12z' }, 'tan'),
    s('path', { d: 'M58 106a6 6 0 0 1 12 0zM90 106a6 6 0 0 1 12 0z' }, 'orange')
  ],
  dama: [
    ground(),
    s('path', { d: 'M104 106l22-16a26 26 0 0 1 6 24z' }, 'red'),
    s('path', { d: 'M88 98l18 8', ...SW(5) }, 'skin', { stroke: true }),
    ...lady(80, 136, 'purple', { accent: true }),
    s('ellipse', { cx: 80, cy: 64, rx: 26, ry: 5 }, 'pink'),
    s('path', { d: 'M68 64a12 10 0 0 1 24 0z' }, 'pink'),
    s('path', { d: dots([[73, 89], [76.5, 91.5], [80, 92.5], [83.5, 91.5], [87, 89]], 2.5) }, 'white')
  ],
  destruir: [
    ground(),
    s('path', { d: burst(80, 108, 30, 14, 10) }, 'orange'),
    s('path', { d: 'M44 136l8-18 14 4 6-14 14 10 12-6 10 24z' }, 'gray'),
    s('path', { d: 'M22 132l8-12 8 10zM120 130l10-10 6 12zM50 92l6-8 6 6zM110 86l8-4 2 8z' }, 'brown'),
    s('path', { d: 'M80 65L104 16', ...SW(8) }, 'brown', { stroke: true }),
    s('rect', { x: 58, y: 54, width: 44, height: 22, rx: 3, transform: 'rotate(26 80 65)' }, 'dark', { accent: true }),
    s('path', { d: 'M118 40l12-4M122 54h14', ...SW(3) }, 'gray', { stroke: true })
  ],
  duque: [
    ground(),
    s('path', { d: 'M62 86h36l20 50H42z' }, 'red'),
    ...person(80, 136, 'navy'),
    s('path', { d: 'M66 64V50l7 7 7-10 7 10 7-7v14z' }, 'yellow', { accent: true }),
    s('path', { d: 'M66 94l14 12 14-12', ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 110, r: 5 }, 'red')
  ],
  editor: [
    s('rect', { x: 26, y: 18, width: 84, height: 116, rx: 4 }, 'white'),
    outline({ x: 26, y: 18, width: 84, height: 116, rx: 4 }),
    s('path', { d: 'M38 38h60M38 54h52M38 70h60M38 86h44M38 102h56M38 118h36', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 54h60M84 80q8-12 16 0t-8 10M40 116l20 6', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M144 44l-38 52', ...SW(10) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M101 93l-7 17 13-10z' }, 'dark')
  ],
  educativo: [
    s('rect', { x: 50, y: 16, width: 96, height: 66, rx: 4 }, 'brown'),
    s('rect', { x: 56, y: 22, width: 84, height: 54, rx: 2 }, 'green', { accent: true }),
    s('path', { d: ring(78, 44, 11) + 'M100 56l12-22 12 22zM68 66h60', ...SW(3) }, 'white', { stroke: true }),
    ground(),
    ...person(30, 136, 'purple'),
    s('path', { d: 'M42 104l20-30', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M62 74l12-14', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: busts([96, 128], 136, 24, 26) }, 'blue'),
    s('path', { d: dots([[96, 100], [128, 100]], 10) }, 'skin')
  ],
  entregar: [
    ground(),
    ...person(36, 136, 'green'),
    ...person(124, 136, 'navy'),
    s('path', { d: 'M50 102l22-8M110 102l-18-6', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 68, y: 72, width: 26, height: 32, rx: 2, transform: 'rotate(-8 81 88)' }, 'yellow', { accent: true }),
    s('path', { d: 'M74 82h14M74 90h14M74 98h10', ...SW(2), transform: 'rotate(-8 81 88)' }, 'orange', { stroke: true }),
    arrow('M60 50h40m-8-8l8 8-8 8')
  ],
  equivalente: [
    s('path', { d: 'M80 30v100M56 134h48', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 46h112', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M36 46l-16 40M36 46l16 40M124 46l-16 40M124 46l16 40', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M16 86h40a20 10 0 0 1-40 0zM104 86h40a20 10 0 0 1-40 0z' }, 'gray'),
    s('circle', { cx: 36, cy: 73, r: 13 }, 'red', { accent: true }),
    s('rect', { x: 113, y: 62, width: 22, height: 24, rx: 2 }, 'blue'),
    s('circle', { cx: 80, cy: 28, r: 6 }, 'yellow')
  ],
  femenino: [
    s('circle', { cx: 80, cy: 58, r: 30, ...SW(12) }, 'pink', { stroke: true, accent: true }),
    s('path', { d: 'M80 94v44M60 118h40', ...SW(12) }, 'pink', { stroke: true }),
    s('path', { d: dots([[72, 58], [88, 58], [80, 50], [80, 66]], 7) }, 'purple'),
    s('circle', { cx: 80, cy: 58, r: 5 }, 'yellow')
  ],
  'ficción': [
    s('path', { d: 'M14 108l66 12 66-12v20l-66 12-66-12z' }, 'blue', { accent: true }),
    s('path', { d: 'M20 104l60 10 60-10v18l-60 10-60-10z' }, 'cream'),
    s('path', { d: 'M52 104V68h8v8h8v-8h8v8h8v-8h8v8h8v-8h8v36z' }, 'purple'),
    s('path', { d: 'M72 68V44l8-12 8 12v24z' }, 'pink'),
    s('path', { d: 'M74 104V92a6 6 0 0 1 12 0v12z' }, 'dark'),
    s('path', { d: sparkle(34, 52, 10) + sparkle(126, 46, 12) + sparkle(122, 86, 7) + sparkle(36, 88, 6) }, 'yellow')
  ],
  'fué': [
    ground(),
    s('rect', { x: 112, y: 52, width: 32, height: 84, rx: 2 }, 'brown'),
    s('rect', { x: 118, y: 58, width: 20, height: 78 }, 'dark'),
    ...lean(78, 136, 10, 'orange', { accent: true }),
    s('path', { d: 'M24 84h20M18 100h24M26 116h18', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: prints([[40, 132], [54, 126]]) }, 'tan')
  ],
  genio: [
    s('path', { d: 'M30 128h58q14 0 20-12h22q-6 8-14 8-6 16-28 16H36z' }, 'yellow', { accent: true }),
    s('path', { d: 'M52 128q-6-24 14-30', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M110 116q-10-20 6-32t0-30', ...SW(10) }, 'sky', { stroke: true }),
    s('path', { d: 'M100 70q-4-30 16-34 20 4 16 34z' }, 'blue'),
    s('circle', { cx: 116, cy: 28, r: 12 }, 'blue'),
    s('path', { d: dots([[112, 26], [121, 26]], 2) + 'M112 32q4 3 8 0' }, 'dark'),
    s('path', { d: 'M100 48l-18-8M132 48l14-10', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: sparkle(40, 40, 12) + sparkle(64, 70, 7) }, 'yellow')
  ],
  hija: [
    ground(),
    ...person(54, 136, 'blue', { h: 56, r: 13 }),
    s('circle', { cx: 108, cy: 98, r: 10 }, 'skin'),
    s('path', { d: 'M100 108h16l10 28H90z' }, 'pink', { accent: true }),
    s('path', { d: 'M112 86l8-5v10z' }, 'red'),
    s('path', { d: 'M68 108q18 10 30 6', ...SW(4) }, 'skin', { stroke: true }),
    s('path', { d: heart(82, 50, 10) }, 'red')
  ],
  'lástima': [
    ground(),
    s('path', { d: 'M50 136q-6-16 14-18 4-12 20-8 16-4 20 10 14 2 10 16z' }, 'pink', { accent: true }),
    s('path', { d: 'M66 120h32l-16-58z' }, 'tan'),
    s('path', { d: 'M72 104l16-16M76 116l18-18M76 92l12 12M72 110l14 10', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: drop(124, 66, 9) }, 'sky'),
    s('path', { d: drop(32, 90, 6) }, 'sky')
  ],
  manga: [
    s('path', { d: 'M56 34l-30 70 14 6 22-48z' }, 'blue'),
    s('path', { d: 'M56 34h48l6 102H50z' }, 'blue'),
    s('path', { d: 'M104 34l30 70-14 6-22-48z' }, 'red', { accent: true }),
    s('path', { d: 'M121 104l13 6', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M68 34l12 14 12-14', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: dots([[80, 64], [80, 84], [80, 104]], 3) }, 'white')
  ],
  mediados: [
    s('rect', { x: 22, y: 30, width: 116, height: 110, rx: 8 }, 'white'),
    outline({ x: 22, y: 30, width: 116, height: 110, rx: 8 }),
    s('path', { d: 'M22 54V38a8 8 0 0 1 8-8h100a8 8 0 0 1 8 8v16z' }, 'red'),
    s('path', { d: 'M50 22v16M110 22v16', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: rects(cells.filter((_, k) => k < 7 || k > 12)) }, 'gray'),
    s('path', { d: rects(cells.filter((_, k) => k >= 7 && k <= 12)) }, 'orange', { accent: true })
  ],
  necesariamente: [
    ground(),
    s('rect', { x: 22, y: 86, width: 12, height: 50, rx: 2, transform: 'rotate(60 34 136)' }, 'dark'),
    s('rect', { x: 52, y: 86, width: 12, height: 50, rx: 2, transform: 'rotate(40 64 136)' }, 'dark'),
    s('rect', { x: 82, y: 86, width: 12, height: 50, rx: 2, transform: 'rotate(20 94 136)' }, 'dark'),
    s('rect', { x: 112, y: 86, width: 12, height: 50, rx: 2 }, 'red', { accent: true }),
    arrow('M28 44q50-24 100 0m-12-8l12 8-12 6')
  ],
  'orientación': [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'gray'),
    s('circle', { cx: 80, cy: 80, r: 50 }, 'cream'),
    s('path', { d: rays(80, 80, 40, 48, 4, -90) + rays(80, 80, 44, 48, 8, -67.5), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 34l12 46H68z' }, 'red', { accent: true }),
    s('path', { d: 'M80 126l12-46H68z' }, 'navy'),
    s('circle', { cx: 80, cy: 80, r: 6 }, 'yellow')
  ],
  'patrón': [
    s('rect', { x: 50, y: 34, width: 60, height: 74, rx: 10 }, 'brown'),
    ...person(80, 106, 'navy'),
    s('path', { d: 'M80 62l-4 6 4 22 4-22z' }, 'red', { accent: true }),
    s('rect', { x: 16, y: 100, width: 128, height: 36, rx: 4 }, 'tan'),
    s('rect', { x: 16, y: 100, width: 128, height: 8, rx: 3 }, 'brown'),
    s('path', { d: 'M26 96h26M120 96V80l12-6', ...SW(4) }, 'dark', { stroke: true })
  ],
  quinto: [
    ground(),
    s('path', { d: busts([24, 52, 80, 108], 136, 24, 32) }, 'gray'),
    s('path', { d: busts([136], 136, 24, 32) }, 'orange', { accent: true }),
    s('path', { d: dots([[24, 94], [52, 94], [80, 94], [108, 94], [136, 94]], 10) }, 'skin'),
    arrow('M136 36v30m-8-8l8 8 8-8')
  ],
  rendimiento: [
    s('path', { d: 'M24 104A56 56 0 0 1 52 55.5', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true }),
    s('path', { d: 'M52 55.5A56 56 0 0 1 108 55.5', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'yellow', { stroke: true }),
    s('path', { d: 'M108 55.5A56 56 0 0 1 136 104', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'green', { stroke: true, accent: true }),
    s('rect', { x: 18, y: 112, width: 124, height: 18, rx: 6 }, 'gray'),
    s('path', { d: 'M80 104L118 66', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 104, r: 8 }, 'dark')
  ],
  reto: [
    s('rect', { x: 34, y: 14, width: 92, height: 132, rx: 6 }, 'gray'),
    s('path', { d: dots([[48, 128], [110, 116], [56, 98], [108, 80], [64, 34], [112, 28]], 5) }, 'red'),
    s('path', { d: dots([[94, 132], [46, 70], [90, 104]], 5) }, 'blue'),
    s('path', { d: 'M100 14v38', ...SW(2) }, 'yellow', { stroke: true }),
    s('path', { d: 'M76 66l-10-20M90 66l12-12M78 96l-14 16M88 96l8 12', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 84, cy: 54, r: 10 }, 'skin'),
    s('rect', { x: 72, y: 64, width: 22, height: 34, rx: 7 }, 'orange', { accent: true })
  ],
  sentado: [
    s('path', { d: 'M100 46v90M48 100h52M52 100v36', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 66, y: 60, width: 28, height: 40, rx: 9 }, 'blue', { accent: true }),
    s('circle', { cx: 78, cy: 46, r: 12 }, 'skin'),
    s('path', { d: 'M72 94H44v38', ...SW(12) }, 'navy', { stroke: true }),
    s('path', { d: 'M38 134h14', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M70 72l-8 20h12', ...SW(5) }, 'skin', { stroke: true })
  ],
  'típico': [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'cream'),
    s('circle', { cx: 80, cy: 80, r: 60, ...SW(5) }, 'blue', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 44, ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: dots(around(80, 80, 26, 8), 8) }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 10 }, 'yellow'),
    s('path', { d: dots(around(80, 80, 52, 16), 3) }, 'orange')
  ],
  ud: [
    ground(),
    ...lean(46, 136, 30, 'blue'),
    s('path', { d: 'M62 110l22-6', ...SW(5) }, 'skin', { stroke: true }),
    ...person(116, 136, 'gray', { accent: true }),
    s('path', { d: 'M104 76a12 12 0 0 1 24 0', ...SW(4) }, 'white', { stroke: true, lineColor: 'gray' }),
    s('path', { d: 'M136 104v32', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: heart(92, 52, 8) }, 'pink')
  ],
  unir: [
    s('rect', { x: 22, y: 60, width: 72, height: 40, rx: 20, ...SW(12) }, 'gray', { stroke: true }),
    s('rect', { x: 66, y: 60, width: 72, height: 40, rx: 20, ...SW(12) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M94 80a20 20 0 0 1-20 20', ...SW(12) }, 'gray', { stroke: true }),
    arrow('M18 34h30m-8-8l8 8-8 8M142 126h-30m8-8l-8 8 8 8', 'blue', 5)
  ],
  valiente: [
    ground(),
    s('path', { d: 'M96 136V74q0-44 25-44t25 44v62z' }, 'purple'),
    s('path', { d: dots([[112, 66], [130, 66]], 5) }, 'yellow'),
    s('path', { d: 'M108 88l6 6 6-6 6 6 6-6', ...SW(3) }, 'white', { stroke: true }),
    ...person(46, 136, 'blue'),
    s('path', { d: 'M56 88h28v18q0 16-14 22-14-6-14-22z' }, 'red', { accent: true }),
    s('path', { d: star(70, 104, 8) }, 'yellow')
  ],
  verga: [
    s('path', { d: 'M80 112V20', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 38h80l6 60H34z' }, 'white'),
    s('path', { d: 'M40 38h80l6 60H34z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M32 36h96', ...SW(7) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M80 20l18 6-18 6z' }, 'red'),
    s('path', { d: 'M20 108h120l-16 26H36z' }, 'brown'),
    s('path', { d: 'M14 140q11-6 22 0t22 0 22 0 22 0 22 0 22 0', ...SW(3) }, 'blue', { stroke: true })
  ],
  vicepresidente: [
    ground(),
    s('path', { d: 'M86 136V28', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 86, y: 28, width: 28, height: 18 }, 'blue'),
    ...person(52, 136, 'navy', { h: 52, r: 13 }),
    ...person(118, 136, 'black', { h: 42, accent: true }),
    s('path', { d: star(60, 102, 6) }, 'yellow'),
    s('path', { d: star(124, 112, 5) }, 'gray'),
    s('path', { d: 'M52 84v16M118 94v14', ...SW(4) }, 'red', { stroke: true })
  ],
  acusado: [
    ground(),
    ...person(110, 120, 'gray'),
    s('path', { d: drop(126, 52, 4) }, 'sky'),
    s('rect', { x: 76, y: 98, width: 68, height: 38, rx: 3 }, 'brown'),
    s('path', { d: 'M14 72h22', ...SW(16) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 46, cy: 72, r: 11 }, 'skin'),
    s('path', { d: 'M52 67h22', ...SW(6) }, 'skin', { stroke: true })
  ],
  analizar: [
    s('path', { d: rects([[24, 96, 16, 40], [46, 76, 16, 60], [68, 88, 16, 48], [90, 60, 16, 76]]) }, 'blue'),
    s('path', { d: 'M18 136h110', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 104, cy: 52, r: 24 }, 'sky', { accent: true, opacity: 0.6 }),
    s('circle', { cx: 104, cy: 52, r: 24, ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M121 69l20 20', ...SW(10) }, 'dark', { stroke: true })
  ],
  app: [
    s('rect', { x: 26, y: 18, width: 84, height: 84, rx: 22 }, 'purple', { accent: true }),
    s('path', { d: star(68, 60, 24) }, 'white'),
    s('path', { d: ring(104, 100, 12) + ring(104, 100, 22), ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M136 138L108 104', ...SW(16) }, 'skin', { stroke: true }),
    s('path', { d: 'M136 138l8 8', ...SW(18) }, 'blue', { stroke: true })
  ],
  arco: [
    s('path', { d: 'M56 20q60 60 0 120', ...SW(7) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M56 20L36 80l20 60', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 80h100', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M144 80l-12-7v14z' }, 'gray'),
    s('path', { d: 'M38 80l-8-8M38 80l-8 8M46 80l-8-8M46 80l-8 8', ...SW(3) }, 'red', { stroke: true })
  ],
  asesino: [
    ground(),
    s('path', { d: 'M76 26c-22 0-32 22-32 44v66h64V70c0-22-10-44-32-44z' }, 'dark'),
    s('ellipse', { cx: 76, cy: 66, rx: 16, ry: 18 }, 'black'),
    s('path', { d: dots([[69, 64], [83, 64]], 3) }, 'white'),
    s('path', { d: 'M118 76l14-38 5 3-11 38z' }, 'gray', { accent: true }),
    s('path', { d: 'M110 78l22 7', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M119 82l-4 16', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M108 96l-14 12', ...SW(8) }, 'dark', { stroke: true })
  ],
  asiento: [
    s('path', { d: rects([[18, 50, 34, 50], [16, 96, 40, 14], [108, 50, 34, 50], [104, 96, 40, 14]]) }, 'gray'),
    s('path', { d: rects([[63, 50, 34, 50], [60, 96, 40, 14]]) }, 'blue', { accent: true }),
    s('path', { d: 'M36 110v26M80 110v26M124 110v26M20 136h120', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(80, 28, 13) }, 'yellow'),
    s('path', { d: 'M30 60h10M120 60h10', ...SW(3) }, 'white', { stroke: true })
  ],
  asumir: [
    ground(),
    ...person(80, 136, 'green'),
    s('path', { d: 'M66 96l-12-34M94 96l12-34', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 36, y: 20, width: 88, height: 42, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: 'M80 20v42', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: drop(104, 80, 4) + drop(56, 84, 3) }, 'sky')
  ],
  calma: [
    s('circle', { cx: 126, cy: 36, r: 12 }, 'yellow'),
    s('rect', { x: 14, y: 114, width: 132, height: 28, rx: 8 }, 'sky'),
    s('path', { d: 'M28 128h24M70 132h30M112 124h20', ...SW(3) }, 'white', { stroke: true }),
    s('ellipse', { cx: 80, cy: 106, rx: 40, ry: 11 }, 'gray'),
    s('ellipse', { cx: 80, cy: 86, rx: 30, ry: 10 }, 'tan'),
    s('ellipse', { cx: 80, cy: 69, rx: 21, ry: 8 }, 'gray'),
    s('ellipse', { cx: 80, cy: 55, rx: 13, ry: 6 }, 'green', { accent: true })
  ],
  capa: [
    ground(),
    ...person(70, 136, 'blue'),
    s('path', { d: 'M58 90h24q34 16 56 22l-18 24H44z' }, 'red', { accent: true }),
    s('path', { d: dots([[60, 92], [80, 92]], 4) }, 'yellow'),
    s('path', { d: 'M16 60h28M24 74h22M108 70h30M118 84h24', ...SW(3) }, 'gray', { stroke: true })
  ],
  cuento: [
    ground(),
    ...person(40, 136, 'brown'),
    s('path', { d: 'M28 76a12 12 0 0 1 24 0', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M32 82q8 16 16 0z' }, 'white'),
    ...person(110, 136, 'yellow', { h: 30, w: 22, r: 10 }),
    s('path', { d: 'M66 18h68a8 8 0 0 1 8 8v28a8 8 0 0 1-8 8H82l-14 12 2-12h-4a8 8 0 0 1-8-8V26a8 8 0 0 1 8-8z' }, 'sky'),
    s('path', { d: star(86, 40, 11) + star(118, 40, 8) }, 'yellow', { accent: true })
  ],
  cumbre: [
    backdrop('sky'),
    s('path', { d: 'M24 146L76 44l60 102z' }, 'gray'),
    s('path', { d: 'M76 44l-14 26 8-4 6 8 6-8 8 4z' }, 'white'),
    s('path', { d: 'M76 44V20', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M76 20l18 6-18 6z' }, 'red', { accent: true }),
    s('path', { d: ells([[38, 102, 22, 9], [120, 108, 24, 9], [72, 116, 22, 8]]) }, 'white')
  ],
  desaparecido: [
    ground(),
    s('circle', { cx: 64, cy: 64, r: 13, ...DASH(4, '5 5') }, 'gray', { stroke: true }),
    s('rect', { x: 48, y: 82, width: 32, height: 50, rx: 10, ...DASH(4, '5 5') }, 'gray', { stroke: true }),
    s('path', { d: prints([[100, 126], [112, 114], [124, 126], [136, 112]]) }, 'brown'),
    s('circle', { cx: 112, cy: 48, r: 18, ...SW(6) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M125 61l14 14', ...SW(8) }, 'navy', { stroke: true })
  ],
  embajador: [
    ground(),
    s('path', { d: 'M30 136V40M130 136V40', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 30, y: 40, width: 30, height: 20 }, 'blue'),
    s('rect', { x: 30, y: 47, width: 30, height: 6 }, 'white'),
    s('rect', { x: 100, y: 40, width: 30, height: 20 }, 'red'),
    s('rect', { x: 100, y: 47, width: 30, height: 6 }, 'yellow'),
    ...person(80, 136, 'black'),
    s('path', { d: 'M68 94l24 38', ...SW(6) }, 'red', { stroke: true, accent: true })
  ],
  equilibrio: [
    s('path', { d: 'M20 100v40M140 100v40', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M14 100h132', ...SW(3) }, 'dark', { stroke: true }),
    ...person(80, 100, 'red', { h: 36, w: 22, r: 10 }),
    s('path', { d: 'M22 80q58-16 116 0', ...SW(5) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M36 120l-8 8M124 120l8 8', ...SW(3) }, 'gray', { stroke: true })
  ],
  equivocado: [
    s('path', { d: 'M30 136l10-50h80l10 50z' }, 'green'),
    s('circle', { cx: 80, cy: 110, r: 18 }, 'white'),
    s('path', { d: dots(around(80, 110, 11, 8), 3) }, 'dark'),
    s('path', { d: 'M24 72q0-16 16-16h80q16 0 16 16v8h-24v-8H48v8H24z' }, 'dark'),
    s('circle', { cx: 122, cy: 32, r: 18 }, 'red', { accent: true }),
    s('path', { d: 'M114 24l16 16M130 24l-16 16', ...SW(5) }, 'white', { stroke: true })
  ],
  excusa: [
    ground(),
    ...person(56, 136, 'orange'),
    s('path', { d: 'M42 100l-14-10-4-12M70 100l14-10 4-12', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M48 74l6 2M64 74l-6 2M50 86q6-3 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 112h18l-3 6 3 6-3 6 3 6H96z' }, 'white'),
    s('path', { d: 'M122 108h20v28h-20l3-6-3-6 3-6-3-6z' }, 'white'),
    s('path', { d: 'M96 112h18l-3 6 3 6-3 6 3 6H96zM122 108h20v28h-20l3-6-3-6 3-6-3-6z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 120h8M100 128h8M128 116h10M128 124h10', ...SW(2) }, 'blue', { stroke: true, accent: true })
  ],
  exigir: [
    ground(),
    ...person(46, 136, 'navy'),
    s('path', { d: 'M38 72l6 3M54 72l-6 3', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 100l26-16M86 84l8-4', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M100 34l-8-8M136 34l8-8', ...SW(7) }, 'dark', { stroke: true }),
    s('circle', { cx: 118, cy: 62, r: 26 }, 'red', { accent: true }),
    s('circle', { cx: 118, cy: 62, r: 20 }, 'white'),
    s('path', { d: 'M118 48v14l10 6', ...SW(4) }, 'dark', { stroke: true })
  ],
  'expansión': [
    s('rect', { x: 44, y: 44, width: 72, height: 72, rx: 6, ...DASH(3, '6 5') }, 'gray', { stroke: true }),
    arrow('M80 56V18m-9 9l9-9 9 9M80 104v38m-9-9l9 9 9-9M56 80H18m9-9l-9 9 9 9M104 80h38m-9-9l9 9-9 9', 'blue', 6),
    s('rect', { x: 60, y: 60, width: 40, height: 40, rx: 4 }, 'orange', { accent: true })
  ],
  identificar: [
    s('rect', { x: 18, y: 38, width: 112, height: 76, rx: 8 }, 'sky'),
    s('rect', { x: 28, y: 50, width: 36, height: 44, rx: 4 }, 'white'),
    s('circle', { cx: 46, cy: 64, r: 8 }, 'skin'),
    s('path', { d: 'M34 94v-6a12 12 0 0 1 24 0v6z' }, 'blue'),
    s('path', { d: 'M74 58h44M74 72h44M74 86h30', ...SW(5) }, 'navy', { stroke: true }),
    s('circle', { cx: 124, cy: 112, r: 20 }, 'green', { accent: true }),
    s('path', { d: 'M114 112l7 7 13-14', ...SW(5) }, 'white', { stroke: true })
  ],
  lector: [
    ground(),
    ...person(80, 136, 'purple'),
    s('path', { d: ring(75, 78, 4) + ring(86, 78, 4), ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 96l32 6 32-6v30l-32 6-32-6z' }, 'red', { accent: true }),
    s('path', { d: 'M52 98l28 5 28-5v24l-28 5-28-5z' }, 'cream'),
    s('path', { d: 'M80 103v24M58 108l16 3M58 116l16 3M86 111l16-3M86 119l16-3', ...SW(2) }, 'gray', { stroke: true })
  ],
  mecanismo: [
    ...gear(58, 64, 26, 10, 'gray'),
    ...gear(108, 104, 20, 8, 'orange', { accent: true }),
    s('path', { d: dots([[58, 64], [108, 104]], 7) }, 'dark')
  ],
  negativa: [
    ground(),
    ...person(48, 136, 'gray'),
    s('path', { d: 'M30 72q-6 6 0 12M66 72q6 6 0 12', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M78 18h56a8 8 0 0 1 8 8v36a8 8 0 0 1-8 8H94l-16 14 4-14h-4a8 8 0 0 1-8-8V26a8 8 0 0 1 8-8z' }, 'white'),
    s('path', { d: 'M78 18h56a8 8 0 0 1 8 8v36a8 8 0 0 1-8 8H94l-16 14 4-14h-4a8 8 0 0 1-8-8V26a8 8 0 0 1 8-8z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 30l20 20M116 30l-20 20', ...SW(7) }, 'red', { stroke: true, accent: true })
  ],
  orto: [
    s('path', { d: halfRays(80, 104, 50, 64, 9), ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M38 104a42 42 0 0 1 84 0z' }, 'yellow', { accent: true }),
    s('rect', { x: 14, y: 104, width: 132, height: 36, rx: 6 }, 'blue'),
    s('path', { d: 'M30 118h30M80 126h40M50 132h20', ...SW(3) }, 'sky', { stroke: true })
  ],
  parado: [
    ground(),
    ...person(56, 136, 'blue'),
    s('path', { d: 'M114 136V70', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: poly(around(114, 52, 26, 8, 22.5)) }, 'red', { accent: true }),
    s('path', { d: 'M102 52h24', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M48 136v-4M64 136v-4', ...SW(4) }, 'dark', { stroke: true })
  ],
  poderoso: [
    ground(),
    ...person(80, 136, 'red', { w: 36 }),
    s('path', { d: 'M62 100l-22-6-4-22M98 100l22-6 4-22', ...SW(9) }, 'skin', { stroke: true }),
    s('path', { d: dots([[36, 68], [124, 68]], 9) + ells([[50, 92, 8, 6], [110, 92, 8, 6]]) }, 'skin'),
    s('path', { d: star(80, 112, 10) }, 'yellow', { accent: true }),
    s('path', { d: 'M28 44l-8-8M132 44l8-8M80 56V44', ...SW(4) }, 'orange', { stroke: true })
  ],
  portada: [
    s('rect', { x: 42, y: 22, width: 88, height: 124, rx: 4 }, 'gray'),
    s('rect', { x: 34, y: 16, width: 88, height: 124, rx: 4 }, 'red', { accent: true }),
    s('rect', { x: 42, y: 24, width: 72, height: 14, rx: 2 }, 'white'),
    s('rect', { x: 42, y: 46, width: 72, height: 70, rx: 2 }, 'sky'),
    s('circle', { cx: 78, cy: 74, r: 14 }, 'skin'),
    s('path', { d: 'M54 116v-8a24 18 0 0 1 48 0v8z' }, 'yellow'),
    s('path', { d: 'M42 128h50', ...SW(5) }, 'white', { stroke: true })
  ],
  puebla: [
    ground(),
    s('path', { d: 'M86 136V64l11-14 11 14v72z' }, 'gray'),
    s('path', { d: 'M97 50V34M91 40h12', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M20 136V98h34v38zM56 136v-28h28v28zM110 136v-32h32v32z' }, 'tan'),
    s('path', { d: 'M14 100l23-22 23 22zM52 110l18-18 18 18zM106 106l20-20 20 20z' }, 'red', { accent: true }),
    s('path', { d: rects([[31, 118, 12, 18], [65, 122, 10, 14], [120, 118, 12, 18], [92, 114, 10, 22]]) }, 'brown'),
    s('circle', { cx: 97, cy: 72, r: 5 }, 'yellow')
  ],
  rechazo: [
    s('path', { d: 'M40 146v-30', ...SW(22) }, 'blue', { stroke: true }),
    s('rect', { x: 26, y: 70, width: 40, height: 46, rx: 12 }, 'skin'),
    s('path', { d: 'M32 74V48M42 74V42M52 74V44M61 76V54', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M64 98l12-12', ...SW(8) }, 'skin', { stroke: true }),
    s('rect', { x: 96, y: 78, width: 44, height: 40, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M118 78v40M96 96h44', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M118 78q-12-14-4-16t4 16q12-14 4-16t-4 16', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M82 70l10-6M82 100h10M82 128l10 6', ...SW(3) }, 'gray', { stroke: true })
  ],
  'reflexión': [
    ground(),
    s('rect', { x: 84, y: 20, width: 58, height: 112, rx: 26 }, 'brown'),
    s('rect', { x: 90, y: 26, width: 46, height: 100, rx: 20 }, 'sky', { accent: true }),
    s('circle', { cx: 113, cy: 64, r: 10 }, 'skin'),
    s('rect', { x: 101, y: 76, width: 24, height: 40, rx: 8 }, 'pink'),
    s('path', { d: 'M98 44l10-10M98 58l16-16', ...SW(3) }, 'white', { stroke: true }),
    ...person(46, 136, 'purple')
  ],
  rescate: [
    s('path', { d: 'M14 112q16-10 33 0t33 0 33 0 33 0v24a10 10 0 0 1-10 10H24a10 10 0 0 1-10-10z' }, 'blue'),
    s('path', { d: 'M114 76q24-30 30-60', ...SW(3) }, 'tan', { stroke: true }),
    s('circle', { cx: 80, cy: 76, r: 34, ...SW(20) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 76, r: 34, ...SW(20, { 'stroke-linecap': 'butt', 'stroke-dasharray': '26.7 26.7' }) }, 'white', { stroke: true }),
    s('path', { d: ring(80, 76, 44) + ring(80, 76, 24), ...SW(2) }, 'gray', { stroke: true })
  ],
  situado: [
    s('path', { d: 'M14 52l40-12 52 12 40-12v84l-40 12-52-12-40 12z' }, 'mint'),
    s('path', { d: 'M54 40v84M106 52v84', ...SW(2) }, 'green', { stroke: true }),
    s('path', { d: 'M24 112q30-30 60-10t56-30', ...DASH(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M80 100c-14-18-22-28-22-42a22 22 0 0 1 44 0c0 14-8 24-22 42z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 58, r: 8 }, 'white')
  ],
  tesis: [
    s('rect', { x: 26, y: 70, width: 100, height: 60, rx: 2 }, 'cream'),
    s('path', { d: 'M30 82h92M30 94h92M30 106h92M30 118h92', ...SW(2) }, 'tan', { stroke: true }),
    s('rect', { x: 26, y: 70, width: 100, height: 60, rx: 2, ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 22, y: 58, width: 108, height: 16, rx: 3 }, 'navy', { accent: true }),
    s('rect', { x: 22, y: 126, width: 108, height: 12, rx: 3 }, 'navy'),
    s('path', { d: 'M104 74v26l6-6 6 6V74z' }, 'red'),
    s('path', { d: 'M96 44l40-28', ...SW(7) }, 'dark', { stroke: true }),
    s('rect', { x: 56, y: 62, width: 40, height: 8, rx: 2 }, 'yellow')
  ],
  votante: [
    ground(),
    ...person(40, 136, 'green'),
    s('path', { d: 'M54 100l38-26', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 90, y: 46, width: 22, height: 32, rx: 2 }, 'white'),
    s('rect', { x: 90, y: 46, width: 22, height: 32, rx: 2, ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M95 62l4 4 8-9', ...SW(3) }, 'green', { stroke: true }),
    s('rect', { x: 70, y: 86, width: 66, height: 50, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 86, y: 84, width: 34, height: 5, rx: 2 }, 'dark'),
    s('path', { d: 'M92 110l8 8 14-16', ...SW(5) }, 'white', { stroke: true })
  ],
  'órgano': [
    s('path', { d: rects([[26, 60, 12, 56], [42, 46, 12, 70], [58, 34, 12, 82], [74, 24, 12, 92], [90, 34, 12, 82], [106, 46, 12, 70], [122, 60, 12, 56]]) }, 'yellow', { accent: true }),
    s('path', { d: rects([[29, 96, 6, 6], [45, 96, 6, 6], [61, 96, 6, 6], [77, 96, 6, 6], [93, 96, 6, 6], [109, 96, 6, 6], [125, 96, 6, 6]]) }, 'dark'),
    s('rect', { x: 18, y: 112, width: 124, height: 28, rx: 3 }, 'brown'),
    s('rect', { x: 28, y: 118, width: 104, height: 10 }, 'white'),
    s('path', { d: 'M38 118v10M50 118v10M62 118v10M74 118v10M86 118v10M98 118v10M110 118v10M122 118v10', ...SW(2) }, 'dark', { stroke: true })
  ],
  ala: [
    s('path', { d: 'M38 100l-22-12v28z' }, 'blue'),
    s('ellipse', { cx: 70, cy: 102, rx: 36, ry: 16 }, 'blue'),
    s('circle', { cx: 108, cy: 92, r: 13 }, 'blue'),
    s('path', { d: 'M120 90l16 4-16 4z' }, 'orange'),
    s('circle', { cx: 112, cy: 89, r: 3 }, 'white'),
    s('path', { d: 'M48 98C40 60 60 30 100 16c-2 22-8 36-18 48 14-10 30-16 50-16-12 28-38 46-84 50z' }, 'sky', { accent: true }),
    s('path', { d: 'M58 92q8-30 34-60M64 94q18-20 50-34', ...SW(3) }, 'navy', { stroke: true })
  ],
  atender: [
    ...person(80, 112, 'purple'),
    s('path', { d: 'M74 58q6 4 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 18, y: 96, width: 124, height: 42, rx: 4 }, 'brown'),
    s('rect', { x: 14, y: 90, width: 132, height: 8, rx: 3 }, 'tan'),
    s('path', { d: 'M106 88a12 12 0 0 1 24 0z' }, 'yellow', { accent: true }),
    s('path', { d: 'M102 89h32', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 118, cy: 74, r: 3 }, 'yellow'),
    s('path', { d: 'M30 82l-6-6M38 76l-2-8', ...SW(3) }, 'orange', { stroke: true })
  ],
  'autonomía': [
    s('path', { d: 'M24 70a56 56 0 0 1 112 0', ...DASH(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 24, cy: 70, r: 10 }, 'yellow'),
    s('circle', { cx: 136, cy: 66, r: 9 }, 'navy'),
    s('circle', { cx: 140, cy: 62, r: 8 }, 'white'),
    s('rect', { x: 56, y: 44, width: 48, height: 96, rx: 8 }, 'dark'),
    s('rect', { x: 61, y: 54, width: 38, height: 76, rx: 3 }, 'sky'),
    s('rect', { x: 68, y: 74, width: 24, height: 40, rx: 3 }, 'white'),
    s('path', { d: rects([[71, 78, 18, 7], [71, 87, 18, 7], [71, 96, 18, 7], [71, 105, 18, 7]]) + rects([[76, 70, 8, 4]]) }, 'green', { accent: true })
  ],
  campeonato: [
    s('path', { d: 'M20 32h12v32H20M32 48h10M20 96h12v32H20M32 112h10M42 48v64M42 80h8M140 32h-12v32h12M128 48h-10M140 96h-12v32h12M128 112h-10M118 48v64M118 80h-8', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[20, 32], [20, 64], [20, 96], [20, 128], [140, 32], [140, 64], [140, 96], [140, 128]], 5) }, 'blue'),
    s('path', { d: 'M64 62q-12 0-10 10t12 6M96 62q12 0 10 10t-12 6', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M62 54h36v10a18 20 0 0 1-36 0z' }, 'yellow', { accent: true }),
    s('rect', { x: 76, y: 82, width: 8, height: 14 }, 'yellow'),
    s('rect', { x: 66, y: 96, width: 28, height: 10, rx: 2 }, 'brown'),
    s('path', { d: star(80, 66, 6) }, 'orange')
  ],
  cerro: [
    backdrop('sky'),
    s('circle', { cx: 122, cy: 40, r: 12 }, 'yellow'),
    s('path', { d: 'M14 118q40-70 90-40t42 20v36a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green', { accent: true }),
    s('path', { d: 'M60 80V64', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 60, cy: 56, r: 11 }, 'mint'),
    s('path', { d: ells([[36, 40, 14, 6], [70, 30, 12, 5]]) }, 'white')
  ],
  ciertamente: [
    s('rect', { x: 30, y: 76, width: 26, height: 58, rx: 4 }, 'blue'),
    s('path', { d: 'M72 74V32', ...SW(18) }, 'skin', { stroke: true }),
    s('rect', { x: 56, y: 70, width: 58, height: 64, rx: 14 }, 'skin'),
    s('path', { d: 'M86 88h28M86 104h28M86 120h24', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: sparkle(126, 36, 14) + sparkle(104, 20, 7) }, 'yellow', { accent: true })
  ],
  'composición': [
    s('rect', { x: 22, y: 20, width: 96, height: 120, rx: 4 }, 'cream'),
    outline({ x: 22, y: 20, width: 96, height: 120, rx: 4 }),
    s('path', { d: 'M32 40h76M32 48h76M32 56h76M32 64h76M32 72h76M32 92h76M32 100h76M32 108h76M32 116h76M32 124h76', ...SW(1.5) }, 'gray', { stroke: true }),
    s('path', { d: ells([[46, 64, 5, 4], [64, 56, 5, 4], [82, 48, 5, 4], [52, 116, 5, 4], [72, 108, 5, 4]]) }, 'dark'),
    s('path', { d: 'M51 64V42M69 56V34M87 48V28M57 116V94M77 108V86', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M144 50l-30 52', ...SW(10) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M109 98l-3 15 11-9z' }, 'dark')
  ],
  concha: [
    s('ellipse', { cx: 80, cy: 138, rx: 56, ry: 6 }, 'tan'),
    s('path', { d: 'M80 128L28 72a52 52 0 0 1 104 0z' }, 'pink', { accent: true }),
    s('path', { d: 'M80 128L44 40M80 128L62 30M80 128V26M80 128L98 30M80 128L116 40M80 128L34 58M80 128L126 58', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M62 134l18-10 18 10-4 6H66z' }, 'orange')
  ],
  condena: [
    s('rect', { x: 70, y: 18, width: 70, height: 70, rx: 4 }, 'dark'),
    s('path', { d: 'M84 18v70M98 18v70M112 18v70M126 18v70', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 18, y: 124, width: 60, height: 12, rx: 3 }, 'tan'),
    s('path', { d: 'M74 76L42 120', ...SW(7) }, 'brown', { stroke: true }),
    s('rect', { x: 58, y: 60, width: 36, height: 20, rx: 3, transform: 'rotate(36 76 70)' }, 'brown', { accent: true }),
    s('path', { d: 'M30 104l-10-6M38 96l-6-10', ...SW(3) }, 'orange', { stroke: true })
  ],
  constituir: [
    ground(),
    s('path', { d: rects([[30, 108, 32, 28], [64, 108, 32, 28], [98, 108, 32, 28]]) }, 'blue'),
    s('path', { d: rects([[46, 78, 32, 28], [80, 78, 32, 28]]) }, 'yellow'),
    s('path', { d: 'M46 76l33-30 33 30z' }, 'red', { accent: true }),
    s('rect', { x: 114, y: 22, width: 24, height: 20, rx: 2, transform: 'rotate(15 126 32)' }, 'green'),
    s('path', { d: 'M126 50v14m-6-6l6 6 6-6', ...SW(3) }, 'gray', { stroke: true })
  ],
  continuo: [
    s('path', { d: 'M80 80C64 56 24 56 24 80S64 104 80 80 120 56 136 80 96 104 80 80', ...SW(10) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M110 56l12 6-8 10M50 104l-12-6 8-10', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: sparkle(80, 40, 8) + sparkle(80, 122, 8) }, 'yellow')
  ],
  creciente: [
    backdrop('navy', 34, 92),
    s('circle', { cx: 36, cy: 76, r: 14 }, 'yellow'),
    s('circle', { cx: 30, cy: 72, r: 13 }, 'navy'),
    s('circle', { cx: 76, cy: 76, r: 18 }, 'yellow'),
    s('circle', { cx: 66, cy: 70, r: 15 }, 'navy'),
    s('circle', { cx: 120, cy: 76, r: 22 }, 'yellow', { accent: true }),
    s('path', { d: 'M30 112h96m-8-7l8 7-8 7', ...SW(4) }, 'white', { stroke: true })
  ],
  criterio: [
    s('path', { d: 'M20 20v116h124', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[30, 64, 20, 72], [90, 58, 20, 78]]) }, 'green', { accent: true }),
    s('path', { d: rects([[60, 100, 20, 36], [120, 92, 20, 44]]) }, 'gray'),
    s('path', { d: 'M22 80h124', ...DASH(4, '8 6') }, 'red', { stroke: true }),
    s('path', { d: 'M32 46l6 6 12-12M92 40l6 6 12-12', ...SW(4) }, 'green', { stroke: true })
  ],
  data: [
    s('rect', { x: 28, y: 34, width: 80, height: 100, rx: 2 }, 'cream'),
    s('path', { d: 'M40 54h56M40 66h56M40 78h40M40 90h50', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M22 34h92M22 134h92', ...SW(10) }, 'tan', { stroke: true }),
    s('circle', { cx: 88, cy: 114, r: 10 }, 'red'),
    s('rect', { x: 98, y: 20, width: 46, height: 46, rx: 4 }, 'white'),
    s('rect', { x: 98, y: 20, width: 46, height: 46, rx: 4, ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M98 34V24a4 4 0 0 1 4-4h38a4 4 0 0 1 4 4v10z' }, 'red', { accent: true }),
    s('path', { d: dots([[108, 44], [121, 44], [134, 44], [108, 56], [134, 56]], 3) }, 'gray'),
    s('path', { d: ring(121, 56, 6), ...SW(3) }, 'red', { stroke: true })
  ],
  definir: [
    s('path', { d: 'M36 64C40 30 100 24 120 46S140 112 96 122 30 108 36 64z' }, 'mint'),
    s('path', { d: 'M96 122C52 132 30 108 36 64', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 64C40 30 100 24 120 46S140 112 96 122', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: dots([[64, 70], [86, 88], [76, 100]], 6) }, 'green'),
    s('path', { d: 'M101 117l34 22', ...SW(10) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M97 114l-2 10 9-3z' }, 'dark')
  ],
  'emoción': [
    s('circle', { cx: 74, cy: 84, r: 44 }, 'yellow', { accent: true }),
    s('path', { d: 'M50 76q8-8 16 0M82 76q8-8 16 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 96h44a22 20 0 0 1-44 0z' }, 'dark'),
    s('path', { d: drop(42, 94, 5) + drop(106, 94, 5) }, 'sky'),
    s('path', { d: heart(124, 34, 12) + heart(136, 66, 7) }, 'red')
  ],
  espiritual: [
    s('path', { d: rays(80, 66, 30, 42, 10, -90), ...SW(3) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 66, r: 22, ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M38 132q42-30 84 0q-42 10-84 0z' }, 'purple'),
    s('rect', { x: 66, y: 82, width: 28, height: 42, rx: 10 }, 'purple', { accent: true }),
    s('path', { d: 'M68 96l-18 26M92 96l18 26', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 80, cy: 66, r: 12 }, 'skin'),
    s('path', { d: 'M74 66q3 2 5 0M81 66q3 2 5 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  fiel: [
    ground(),
    ...person(40, 136, 'blue'),
    s('path', { d: 'M126 122q14-6 10-22', ...SW(5) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 110, cy: 118, rx: 20, ry: 18 }, 'brown'),
    s('circle', { cx: 98, cy: 90, r: 14 }, 'brown', { accent: true }),
    s('path', { d: 'M104 80l8 18-12-4z' }, 'dark'),
    s('path', { d: dots([[85, 92]], 4) + dots([[94, 86]], 2) }, 'dark'),
    s('path', { d: heart(72, 44, 12) }, 'red')
  ],
  fortuna: [
    s('path', { d: 'M60 66q14 30 0 66', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: dots([[46, 50], [74, 50], [46, 78], [74, 78]], 15) }, 'green', { accent: true }),
    s('path', { d: 'M60 40v52M34 64h52', ...SW(2) }, 'mint', { stroke: true }),
    s('path', { d: ells([[120, 128, 22, 8], [120, 116, 22, 8], [120, 104, 22, 8]]) }, 'yellow'),
    s('path', { d: 'M98 128a22 8 0 0 0 44 0M98 116a22 8 0 0 0 44 0M98 104a22 8 0 0 0 44 0', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: sparkle(120, 50, 12) + sparkle(140, 80, 7) }, 'yellow')
  ],
  gabinete: [
    s('path', { d: 'M80 44V16', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 80, y: 16, width: 26, height: 16 }, 'red'),
    s('path', { d: busts([40, 80, 120], 96, 26, 30) }, 'navy'),
    s('path', { d: dots([[40, 58], [80, 58], [120, 58]], 12) }, 'skin'),
    s('rect', { x: 14, y: 92, width: 132, height: 14, rx: 4 }, 'brown', { accent: true }),
    s('path', { d: 'M28 106v30M132 106v30', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: rects([[30, 88, 18, 5], [72, 88, 18, 5], [112, 88, 18, 5]]) }, 'white')
  ],
  go: [
    s('rect', { x: 18, y: 18, width: 124, height: 124, rx: 6 }, 'tan'),
    s('path', { d: goGrid, ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: dots([[50, 50], [70, 70], [90, 50], [70, 110], [110, 110]], 9) }, 'black', { accent: true }),
    s('path', { d: dots([[70, 50], [90, 70], [110, 90], [50, 90]], 9) }, 'white'),
    s('path', { d: ring(70, 50, 9) + ring(90, 70, 9) + ring(110, 90, 9) + ring(50, 90, 9), ...SW(2) }, 'gray', { stroke: true })
  ],
  huelga: [
    s('path', { d: 'M50 92V48M110 92V48', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 24, y: 20, width: 52, height: 32, rx: 3 }, 'red', { accent: true }),
    s('rect', { x: 84, y: 20, width: 52, height: 32, rx: 3 }, 'yellow'),
    ...gear(110, 36, 6, 6, 'dark'),
    s('path', { d: 'M98 26l24 20', ...SW(4) }, 'red', { stroke: true }),
    ...person(50, 136, 'green'),
    ...person(110, 136, 'blue')
  ],
  manual: [
    s('rect', { x: 32, y: 18, width: 96, height: 124, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 42, y: 28, width: 76, height: 62, rx: 3 }, 'white'),
    s('path', { d: 'M60 76l24-24', ...SW(8) }, 'gray', { stroke: true }),
    s('circle', { cx: 90, cy: 46, r: 11 }, 'gray'),
    s('circle', { cx: 95, cy: 41, r: 5 }, 'white'),
    s('path', { d: 'M46 102h68M46 114h68M46 126h44', ...SW(4) }, 'sky', { stroke: true })
  ],
  mate: [
    s('path', { d: 'M92 72L118 20', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M118 20l8-3', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 70q-12 30 4 56q12 14 32 14t32-14q16-26 4-56z' }, 'brown', { accent: true }),
    s('ellipse', { cx: 84, cy: 70, rx: 36, ry: 8 }, 'dark'),
    s('ellipse', { cx: 84, cy: 70, rx: 30, ry: 5 }, 'green'),
    s('path', { d: 'M44 88q40 10 80 0', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M90 72l2-4', ...SW(5) }, 'gray', { stroke: true })
  ],
  muchacho: [
    ground(),
    ...person(70, 136, 'green', { h: 38, w: 28, r: 13 }),
    s('path', { d: 'M57 82a13 13 0 0 1 26 0z' }, 'red', { accent: true }),
    s('path', { d: 'M80 81h14', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M64 90q6 4 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('circle', { cx: 120, cy: 124, r: 12 }, 'white'),
    s('circle', { cx: 120, cy: 124, r: 12, ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M120 119l5 4-2 6h-6l-2-6z' }, 'dark')
  ],
  negativo: [
    s('path', { d: rects([[34, 60, 16, 76], [60, 78, 16, 58], [86, 92, 16, 44], [112, 112, 16, 24]]) }, 'pink'),
    s('path', { d: 'M24 20v116h120', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M32 40l26 22 22-10 26 36 24 22', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M140 126l-4-20-14 14z' }, 'red')
  ],
  'oración': [
    s('path', { d: rays(80, 66, 46, 58, 9, -90), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M80 24c-6 0-10 6-12 16l-14 50q-4 14 6 22l8 8h24l8-8q10-8 6-22l-14-50c-2-10-6-16-12-16z' }, 'skin', { accent: true }),
    s('path', { d: 'M80 28v90', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M54 116l-12 24h32l4-16zM106 116l12 24H86l-4-16z' }, 'blue')
  ],
  orgulloso: [
    ground(),
    ...person(80, 136, 'blue'),
    s('path', { d: 'M72 76q3-3 6 0M82 76q3-3 6 0M74 84q6 4 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 100l-12 12 12 10M94 100l12 12-12 10', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M72 92l8 14 8-14', ...SW(4) }, 'red', { stroke: true }),
    s('circle', { cx: 80, cy: 110, r: 8 }, 'yellow', { accent: true }),
    s('path', { d: sparkle(36, 52, 10) + sparkle(124, 48, 10) }, 'yellow')
  ],
  parcial: [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'cream'),
    s('circle', { cx: 80, cy: 80, r: 56, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 80V136M80 80H24', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 74V18a56 56 0 0 1 56 56z' }, 'orange', { accent: true })
  ],
  respectivamente: [
    s('path', { d: 'M48 40l60 80', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M48 80l60-40', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M48 120l60-40', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: dots([[36, 40]], 13) + rects([[108, 108, 26, 26]]) }, 'red', { accent: true }),
    s('path', { d: dots([[36, 80]], 13) + rects([[108, 28, 26, 26]]) }, 'blue'),
    s('path', { d: dots([[36, 120]], 13) + rects([[108, 68, 26, 26]]) }, 'orange')
  ],
  'ridículo': [
    s('path', { d: dots([[40, 70], [36, 92], [120, 70], [124, 92]], 14) }, 'orange'),
    s('circle', { cx: 80, cy: 86, r: 40 }, 'skin'),
    s('path', { d: 'M80 18l-20 32h40z' }, 'purple'),
    s('circle', { cx: 80, cy: 18, r: 6 }, 'yellow'),
    s('path', { d: dots([[64, 76], [96, 76]], 5) }, 'dark'),
    s('circle', { cx: 80, cy: 90, r: 10 }, 'red', { accent: true }),
    s('path', { d: 'M58 104q22 22 44 0', ...SW(5) }, 'red', { stroke: true })
  ],
  sabio: [
    ground(),
    s('path', { d: 'M60 72h40l14 64H46z' }, 'navy'),
    s('circle', { cx: 80, cy: 58, r: 14 }, 'skin'),
    s('path', { d: 'M66 60q14 8 28 0q2 30-14 46-16-16-14-46z' }, 'white'),
    s('path', { d: 'M66 60q14 8 28 0q2 30-14 46-16-16-14-46z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 52l8 2M90 52l-8 2', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 98, y: 96, width: 30, height: 22, rx: 2 }, 'red', { accent: true }),
    s('path', { d: sparkle(122, 40, 12) }, 'yellow')
  ],
  seguimiento: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'dark'),
    s('path', { d: ring(80, 80, 40) + ring(80, 80, 20) + 'M20 80h120M80 20v120', ...SW(2) }, 'green', { stroke: true }),
    s('path', { d: 'M80 80V20A60 60 0 0 1 132 50z' }, 'green', { accent: true, opacity: 0.6 }),
    s('path', { d: dots([[60, 112], [72, 100], [84, 90], [100, 72]], 3) }, 'mint'),
    s('circle', { cx: 110, cy: 60, r: 6 }, 'yellow')
  ],
  tira: [
    s('rect', { x: 14, y: 52, width: 132, height: 56, rx: 4 }, 'white'),
    s('path', { d: 'M58 52v56M102 52v56', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: busts([36, 80, 124], 108, 20, 18) }, 'blue'),
    s('path', { d: dots([[36, 82], [80, 82], [124, 82]], 9) }, 'skin'),
    s('ellipse', { cx: 48, cy: 62, rx: 7, ry: 5 }, 'sky'),
    s('path', { d: burst(132, 64, 10, 5, 8) }, 'yellow', { accent: true }),
    s('rect', { x: 14, y: 52, width: 132, height: 56, rx: 4, ...SW(3) }, 'dark', { stroke: true })
  ],
  'transformación': [
    s('path', { d: dots([[20, 116], [32, 112], [44, 116], [56, 112]], 8) }, 'green'),
    s('circle', { cx: 66, cy: 106, r: 9 }, 'green'),
    s('circle', { cx: 69, cy: 103, r: 2 }, 'dark'),
    arrow('M60 84q12-30 34-34m-10-6l10 6-8 8'),
    s('path', { d: 'M118 60c-10-26-34-24-30-6s20 14 30 6zM118 60c10-26 34-24 30-6s-20 14-30 6z' }, 'purple', { accent: true }),
    s('path', { d: 'M118 62c-6 16-24 18-22 6s14-8 22-6zM118 62c6 16 24 18 22 6s-14-8-22-6z' }, 'pink'),
    s('path', { d: 'M118 44v34M116 44l-6-10M120 44l6-10', ...SW(4) }, 'dark', { stroke: true })
  ],
  'académico': [
    s('path', { d: 'M50 64v22q30 16 60 0V64l-30 10z' }, 'dark'),
    s('path', { d: 'M80 30l62 22-62 22-62-22z' }, 'black', { accent: true }),
    s('path', { d: 'M80 52l40 6v30', ...SW(3) }, 'yellow', { stroke: true }),
    s('circle', { cx: 120, cy: 92, r: 5 }, 'yellow'),
    s('rect', { x: 30, y: 108, width: 92, height: 18, rx: 9, transform: 'rotate(-10 76 117)' }, 'cream'),
    s('rect', { x: 30, y: 108, width: 92, height: 18, rx: 9, transform: 'rotate(-10 76 117)', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 70, y: 106, width: 10, height: 22, transform: 'rotate(-10 76 117)' }, 'red')
  ],
  actriz: [
    s('path', { d: 'M14 14h40q-4 60 10 120H14zM146 14h-40q4 60-10 120h50z' }, 'red', { accent: true }),
    s('rect', { x: 14, y: 14, width: 132, height: 12, rx: 2 }, 'purple'),
    s('rect', { x: 14, y: 132, width: 132, height: 10, rx: 2 }, 'brown'),
    s('path', { d: 'M88 92l16-22', ...SW(5) }, 'skin', { stroke: true }),
    ...lady(80, 132, 'yellow'),
    s('path', { d: sparkle(110, 54, 8) }, 'yellow')
  ],
  'actualización': [
    s('path', { d: 'M27.4 60.8A56 56 0 0 1 99.2 27.4M89 18l10 9.4-12 6M132.6 99.2A56 56 0 0 1 60.8 132.6M71 142l-10-9.4 12-6', ...SW(6) }, 'orange', { stroke: true, accent: true }),
    s('rect', { x: 56, y: 36, width: 48, height: 88, rx: 8 }, 'dark'),
    s('rect', { x: 61, y: 46, width: 38, height: 66, rx: 3 }, 'sky'),
    arrow('M80 100V62m-10 10l10-10 10 10', 'green', 6)
  ],
  adicional: [
    s('path', { d: rects([[18, 100, 36, 36], [58, 100, 36, 36]]) }, 'blue'),
    s('rect', { x: 104, y: 72, width: 36, height: 36, rx: 2 }, 'orange', { accent: true }),
    s('path', { d: 'M122 20v36M104 38h36', ...SW(10) }, 'green', { stroke: true }),
    s('path', { d: 'M112 116v12M132 116v12', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 140h124', ...SW(4) }, 'gray', { stroke: true })
  ],
  aprovechar: [
    s('path', { d: 'M62 148l12-58', ...SW(18) }, 'blue', { stroke: true }),
    s('path', { d: star(84, 52, 28) }, 'yellow', { accent: true }),
    s('circle', { cx: 76, cy: 84, r: 15 }, 'skin'),
    s('path', { d: 'M66 78h20M66 86h20', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: sparkle(126, 34, 10) + sparkle(36, 40, 8) + sparkle(124, 92, 7) }, 'orange')
  ],
  basa: [
    s('rect', { x: 46, y: 18, width: 68, height: 14, rx: 2 }, 'gray'),
    s('rect', { x: 58, y: 32, width: 44, height: 78 }, 'cream'),
    s('path', { d: 'M58 32h44v78H58zM69 36v70M80 36v70M91 36v70', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 110h56l6 12H46zM40 122h80v14H40z' }, 'orange', { accent: true }),
    arrow('M142 128h-14m6-6l-6 6 6 6', 'red', 4)
  ],
  bravo: [
    s('path', { d: 'M52 50q-30-4-34-30 14 16 36 18zM108 50q30-4 34-30-14 16-36 18z' }, 'tan'),
    s('path', { d: 'M48 54l-20 8 20 8zM112 54l20 8-20 8z' }, 'black'),
    s('path', { d: 'M48 44h64l-8 54q-4 30-24 30t-24-30z' }, 'black', { accent: true }),
    s('path', { d: 'M58 66l14 6M102 66l-14 6', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: dots([[66, 78], [94, 78]], 4) }, 'red'),
    s('ellipse', { cx: 80, cy: 110, rx: 18, ry: 12 }, 'dark'),
    s('path', { d: ring(80, 124, 7), ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M54 124q-12 4-20 0M106 124q12 4 20 0', ...SW(4) }, 'gray', { stroke: true })
  ],
  'catalán': [
    s('path', { d: 'M30 140V24', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 30, cy: 22, r: 5 }, 'gray'),
    s('rect', { x: 32, y: 26, width: 108, height: 72 }, 'yellow', { accent: true }),
    s('path', { d: rects([[32, 34, 108, 8], [32, 50, 108, 8], [32, 66, 108, 8], [32, 82, 108, 8]]) }, 'red')
  ],
  'coalición': [
    s('circle', { cx: 80, cy: 56, r: 36 }, 'red', { opacity: 0.8 }),
    s('circle', { cx: 58, cy: 96, r: 36 }, 'blue', { opacity: 0.8 }),
    s('circle', { cx: 102, cy: 96, r: 36 }, 'yellow', { opacity: 0.8 }),
    s('path', { d: star(80, 82, 12) }, 'white', { accent: true })
  ],
  combatir: [
    s('path', { d: burst(80, 70, 22, 10, 8) }, 'yellow'),
    s('rect', { x: 16, y: 50, width: 50, height: 54, rx: 22 }, 'red', { accent: true }),
    s('ellipse', { cx: 54, cy: 90, rx: 10, ry: 14 }, 'red'),
    s('rect', { x: 22, y: 102, width: 34, height: 18, rx: 3 }, 'gray'),
    s('rect', { x: 94, y: 50, width: 50, height: 54, rx: 22 }, 'blue'),
    s('ellipse', { cx: 106, cy: 90, rx: 10, ry: 14 }, 'blue'),
    s('rect', { x: 104, y: 102, width: 34, height: 18, rx: 3 }, 'gray'),
    s('path', { d: 'M54 78q-6 10 0 22M106 78q6 10 0 22', ...SW(2) }, 'dark', { stroke: true })
  ],
  'coordinación': [
    s('path', { d: 'M14 120q11-6 22 0t22 0 22 0 22 0 22 0 22 0v14a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6z' }, 'sky'),
    s('path', { d: 'M50 92l-28 34M84 92l-28 34M118 92l-28 34', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: busts([46, 80, 114], 104, 20, 24) }, 'orange'),
    s('path', { d: dots([[46, 74], [80, 74], [114, 74]], 9) }, 'skin'),
    s('path', { d: 'M18 104h124l-14 16H32z' }, 'brown', { accent: true })
  ],
  culto: [
    s('rect', { x: 22, y: 112, width: 76, height: 14, rx: 2 }, 'red', { accent: true }),
    s('rect', { x: 28, y: 98, width: 70, height: 14, rx: 2 }, 'blue'),
    s('rect', { x: 18, y: 84, width: 72, height: 14, rx: 2 }, 'green'),
    s('path', { d: ring(40, 74, 9) + ring(66, 74, 9) + 'M49 74h8M31 72l-8-4M75 72l8-4', ...SW(3) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 122, cy: 128, rx: 24, ry: 5 }, 'gray'),
    s('path', { d: 'M104 98h36v14a18 14 0 0 1-36 0z' }, 'purple'),
    s('path', { d: 'M140 102a7 7 0 0 1 0 14', ...SW(4) }, 'purple', { stroke: true }),
    s('path', { d: 'M114 90q-4-8 0-14M128 90q-4-8 0-14', ...SW(3) }, 'gray', { stroke: true })
  ],
  'depresión': [
    ground(),
    ...lean(76, 136, 12, 'gray'),
    s('path', { d: 'M82 87q6-4 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 70l-4 10M76 66l-4 10M96 70l-4 10M110 66l-4 10', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M40 44a16 16 0 0 1 22-14 22 22 0 0 1 40 4 14 14 0 0 1 8 26H44a14 14 0 0 1-4-16z' }, 'dark', { accent: true })
  ],
  efectivamente: [
    s('circle', { cx: 72, cy: 88, r: 50 }, 'red'),
    s('circle', { cx: 72, cy: 88, r: 36 }, 'white'),
    s('circle', { cx: 72, cy: 88, r: 22 }, 'red'),
    s('circle', { cx: 72, cy: 88, r: 9 }, 'yellow', { accent: true }),
    s('path', { d: 'M72 88L130 30', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M124 28l8-12M132 36l12-8M130 30l10-14M130 30l14-10', ...SW(3) }, 'gray', { stroke: true })
  ],
  esencial: [
    s('path', { d: rects([[26, 30, 48, 48], [74, 30, 48, 48], [26, 78, 48, 48]]) }, 'blue'),
    s('path', { d: 'M74 30v48M26 78h48', ...SW(3) }, 'white', { stroke: true }),
    s('rect', { x: 74, y: 78, width: 48, height: 48, ...DASH(3, '5 4') }, 'gray', { stroke: true }),
    s('path', { d: rects([[96, 96, 46, 46]]) + dots([[96, 119]], 8) + dots([[119, 96]], 8) }, 'orange', { accent: true })
  ],
  espada: [
    s('path', { d: 'M80 16l9 12v76H71V28z' }, 'gray'),
    s('path', { d: 'M80 26v74', ...SW(2) }, 'white', { stroke: true }),
    s('rect', { x: 48, y: 104, width: 64, height: 10, rx: 4 }, 'yellow', { accent: true }),
    s('rect', { x: 74, y: 114, width: 12, height: 22, rx: 3 }, 'brown'),
    s('circle', { cx: 80, cy: 139, r: 6 }, 'yellow')
  ],
  flujo: [
    s('path', { d: 'M14 46q22-14 44 0t44 0 44 0v26q-22 14-44 0t-44 0-44 0z' }, 'sky'),
    s('path', { d: 'M14 90q22-14 44 0t44 0 44 0v26q-22 14-44 0t-44 0-44 0z' }, 'blue', { accent: true }),
    arrow('M30 60h80m-10-10l10 10-10 10M50 104h80m-10-10l10 10-10 10', 'white', 5),
    s('path', { d: drop(126, 26, 5) + drop(40, 136, 4) }, 'sky')
  ],
  'galería': [
    ground(),
    s('path', { d: rects([[18, 28, 44, 52], [70, 22, 40, 34], [118, 28, 28, 52]]) }, 'brown'),
    s('rect', { x: 24, y: 34, width: 32, height: 40 }, 'sky', { accent: true }),
    s('path', { d: 'M24 74l12-18 8 8 12-14v24z' }, 'green'),
    s('rect', { x: 76, y: 28, width: 28, height: 22 }, 'yellow'),
    s('circle', { cx: 90, cy: 39, r: 6 }, 'orange'),
    s('rect', { x: 124, y: 34, width: 16, height: 40 }, 'pink'),
    ...person(86, 136, 'navy')
  ],
  'garantía': [
    s('rect', { x: 20, y: 40, width: 76, height: 92, rx: 4 }, 'tan'),
    s('path', { d: 'M20 60h76M58 40v20', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M96 96l-10 44 14-8 8 12 8-34M120 96l10 44-14-8-8 12-8-34' }, 'red'),
    s('path', { d: burst(108, 84, 30, 24, 16) }, 'yellow', { accent: true }),
    s('circle', { cx: 108, cy: 84, r: 18 }, 'orange'),
    s('path', { d: 'M98 84l7 7 13-14', ...SW(5) }, 'white', { stroke: true })
  ],
  gasolina: [
    s('rect', { x: 34, y: 34, width: 56, height: 100, rx: 6 }, 'red', { accent: true }),
    s('rect', { x: 42, y: 44, width: 40, height: 24, rx: 3 }, 'cream'),
    s('path', { d: drop(62, 100, 9) }, 'yellow'),
    s('rect', { x: 26, y: 130, width: 72, height: 10, rx: 3 }, 'dark'),
    s('path', { d: 'M90 112q24 0 24-24V66', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M104 46h18l8 8v14h-10v-8h-16z' }, 'dark')
  ],
  habano: [
    s('path', { d: 'M28 108l88-30', ...SW(18) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M44 95l6 17', ...SW(8, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true }),
    s('path', { d: 'M118 77l8-3', ...SW(18) }, 'gray', { stroke: true }),
    s('path', { d: dots([[132, 72]], 4) }, 'orange'),
    s('path', { d: 'M134 58q-8-10 0-18t0-18', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 132h96', ...SW(4) }, 'tan', { stroke: true })
  ],
  hilo: [
    s('rect', { x: 46, y: 46, width: 44, height: 68 }, 'red', { accent: true }),
    s('path', { d: 'M46 60h44M46 76h44M46 92h44', ...SW(2) }, 'pink', { stroke: true }),
    s('rect', { x: 38, y: 34, width: 60, height: 12, rx: 3 }, 'tan'),
    s('rect', { x: 38, y: 114, width: 60, height: 12, rx: 3 }, 'tan'),
    s('path', { d: 'M90 100q34 12 30-22t12-46', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M128 18l14 54', ...SW(4) }, 'gray', { stroke: true })
  ],
  interesado: [
    ground(),
    ...person(44, 136, 'purple'),
    s('path', { d: dots([[39, 76], [51, 76]], 4) }, 'yellow'),
    s('path', { d: 'M58 100l28-8', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M108 72h20l-6 10q24 14 20 40-2 12-24 12h-4q-22 0-24-12-4-26 20-40z' }, 'tan', { accent: true }),
    s('path', { d: 'M106 80h24', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 118, cy: 110, r: 9 }, 'yellow'),
    s('path', { d: sparkle(80, 50, 10) + sparkle(146, 70, 6) }, 'yellow')
  ],
  propietario: [
    ground(),
    s('path', { d: 'M24 136V90h48v46z' }, 'tan'),
    s('path', { d: 'M16 92l32-28 32 28z' }, 'red'),
    s('path', { d: 'M40 136v-26h16v26z' }, 'brown'),
    ...person(112, 136, 'green'),
    s('path', { d: 'M126 98l8-26', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: ring(136, 40, 9) + 'M136 49v24M136 62h6M136 70h6', ...SW(5) }, 'yellow', { stroke: true, accent: true })
  ],
  protagonista: [
    s('path', { d: 'M70 14L36 136h88L90 14z' }, 'yellow', { opacity: 0.4 }),
    s('ellipse', { cx: 80, cy: 136, rx: 44, ry: 8 }, 'yellow'),
    s('path', { d: busts([24, 136], 140, 22, 36) }, 'gray'),
    s('path', { d: dots([[24, 106], [136, 106]], 10) }, 'gray'),
    ...person(80, 136, 'red', { accent: true }),
    s('path', { d: star(80, 46, 10) }, 'orange')
  ],
  'químico': [
    s('path', { d: 'M52 96h56l18 28q2 8-8 8H42q-10 0-8-8z' }, 'green', { accent: true }),
    s('path', { d: 'M64 24h32M70 24v38L36 122q-4 14 10 14h68q14 0 10-14L90 62V24', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: dots([[66, 116], [86, 108], [96, 122]], 4) }, 'mint'),
    s('path', { d: dots([[86, 48], [76, 36], [92, 22]], 5) }, 'mint')
  ],
  revelar: [
    s('rect', { x: 40, y: 112, width: 80, height: 24, rx: 3 }, 'brown'),
    s('path', { d: star(80, 84, 26) }, 'yellow', { accent: true }),
    s('path', { d: 'M100 46q28-26 46-8-10 10-6 30-22-8-40-22z' }, 'red'),
    s('path', { d: 'M90 56l-12 10M100 70l-10 4', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: sparkle(36, 60, 10) + sparkle(128, 96, 8) + sparkle(48, 96, 6) }, 'orange')
  ],
  sirio: [
    s('path', { d: 'M24 140V18', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 26, y: 24, width: 116, height: 24 }, 'green'),
    s('rect', { x: 26, y: 48, width: 116, height: 24 }, 'white'),
    s('rect', { x: 26, y: 72, width: 116, height: 24 }, 'black'),
    s('path', { d: star(58, 60, 9) + star(84, 60, 9) + star(110, 60, 9) }, 'red', { accent: true }),
    s('rect', { x: 26, y: 24, width: 116, height: 72, ...SW(2) }, 'gray', { stroke: true })
  ],
  totalidad: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'mint'),
    s('path', { d: busts([66, 94], 96, 22, 22) }, 'orange'),
    s('path', { d: dots([[66, 64], [94, 64]], 9) }, 'skin'),
    s('path', { d: busts([52, 80, 108], 124, 22, 22) }, 'blue'),
    s('path', { d: dots([[52, 92], [80, 92], [108, 92]], 9) }, 'skin'),
    s('path', { d: busts([38, 122], 96, 22, 22) }, 'purple'),
    s('path', { d: dots([[38, 64], [122, 64]], 9) }, 'skin'),
    s('circle', { cx: 80, cy: 80, r: 62, ...SW(5) }, 'green', { stroke: true, accent: true })
  ],
  tratado: [
    s('rect', { x: 34, y: 20, width: 92, height: 118, rx: 4 }, 'cream'),
    s('rect', { x: 34, y: 20, width: 92, height: 118, rx: 4, ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 40h68M46 52h68M46 64h68M46 76h50', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 106l-4 14 6-4 4 6 2-14M86 106l4 14-6-4-4 6-2-14' }, 'red'),
    s('circle', { cx: 80, cy: 98, r: 10 }, 'red', { accent: true }),
    s('path', { d: 'M42 126q6-10 10 0t10 0 8-4M96 126q6-10 10 0t10 0', ...SW(2) }, 'navy', { stroke: true }),
    s('path', { d: 'M146 64l-28 40', ...SW(5) }, 'dark', { stroke: true })
  ],
  'violación': [
    ground(),
    ...person(80, 136, 'gray'),
    s('path', { d: 'M18 60v76M142 80v56', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M18 70l124 20', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'yellow', { stroke: true }),
    s('path', { d: 'M18 70l124 20', ...SW(14, { 'stroke-linecap': 'butt', 'stroke-dasharray': '10 10' }) }, 'black', { stroke: true }),
    s('path', { d: ring(126, 34, 16) + 'M115 23l22 22', ...SW(5) }, 'red', { stroke: true, accent: true })
  ],
  'alimentación': [
    s('circle', { cx: 80, cy: 82, r: 50 }, 'white'),
    s('path', { d: ring(80, 82, 50) + ring(80, 82, 38), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: dots([[64, 70], [56, 80], [70, 80]], 8) }, 'green', { accent: true }),
    s('path', { d: 'M86 100l24-24 4 4-24 24z' }, 'orange'),
    s('ellipse', { cx: 92, cy: 68, rx: 14, ry: 9 }, 'brown'),
    s('path', { d: ells([[66, 100, 10, 6]]) }, 'yellow'),
    s('path', { d: 'M22 64v72M16 40v20q0 8 6 8t6-8V40M22 40v24', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M138 136V40q10 20 0 40', ...SW(4) }, 'gray', { stroke: true })
  ],
  'británico': [
    s('rect', { x: 14, y: 40, width: 132, height: 80, rx: 2 }, 'navy'),
    s('path', { d: 'M14 40h16L146 110v10h-16L14 50zM146 40h-16L14 110v10h16L146 50z' }, 'white'),
    s('path', { d: 'M14 40l66 40M146 120L80 80M146 40l-66 40M14 120l66-40', ...SW(4, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true }),
    s('path', { d: 'M80 40v80M14 80h132', ...SW(24, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('path', { d: 'M80 40v80M14 80h132', ...SW(13, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true, accent: true })
  ],
  'combinación': [
    s('path', { d: 'M52 76V54a28 28 0 0 1 56 0v22', ...SW(10) }, 'gray', { stroke: true }),
    s('rect', { x: 34, y: 72, width: 92, height: 68, rx: 10 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 106, r: 24 }, 'dark'),
    s('circle', { cx: 80, cy: 106, r: 14 }, 'gray'),
    s('path', { d: rays(80, 106, 17, 22, 12), ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M80 78v8', ...SW(4) }, 'yellow', { stroke: true })
  ],
  carrero: [
    ground(),
    s('path', { d: 'M90 76l28-14 22 10-6 18H92z' }, 'orange'),
    s('rect', { x: 84, y: 88, width: 60, height: 24, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: ring(114, 120, 14) + 'M114 106v28M100 120h28', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M84 96L56 104', ...SW(5) }, 'tan', { stroke: true }),
    ...lean(38, 136, 14, 'blue'),
    s('path', { d: 'M48 98l10 6', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 132, cy: 30, r: 12 }, 'yellow')
  ],
  aprobado: [
    s('rect', { x: 22, y: 18, width: 84, height: 116, rx: 4 }, 'white'),
    outline({ x: 22, y: 18, width: 84, height: 116, rx: 4 }),
    s('path', { d: 'M34 36h60M34 50h60M34 64h44M34 78h60M34 92h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 112l8 8 14-16', ...SW(4) }, 'green', { stroke: true }),
    s('circle', { cx: 108, cy: 108, r: 28 }, 'red', { accent: true, opacity: 0.85 }),
    s('circle', { cx: 108, cy: 108, r: 21, ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M96 108l8 8 16-17', ...SW(6) }, 'white', { stroke: true })
  ],
  hermana: [
    ground(),
    ...lady(52, 136, 'pink', { accent: true }),
    ...lady(108, 136, 'purple'),
    s('path', { d: 'M64 104q16 8 32 0', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 40, 12) }, 'red')
  ],
  cultivo: [
    s('circle', { cx: 126, cy: 32, r: 14 }, 'yellow'),
    s('path', { d: 'M14 74h132l-0 66H14z' }, 'brown'),
    s('path', { d: 'M14 90h132M14 108h132M14 126h132', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M30 88v-10M60 88v-10M90 88v-10M120 88v-10M30 106v-10M60 106v-10M90 106v-10M120 106v-10M30 124v-10M60 124v-10M90 124v-10M120 124v-10', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: ells([[26, 76, 5, 3], [56, 76, 5, 3], [86, 76, 5, 3], [116, 76, 5, 3], [26, 94, 5, 3], [56, 94, 5, 3], [86, 94, 5, 3], [116, 94, 5, 3], [26, 112, 5, 3], [56, 112, 5, 3], [86, 112, 5, 3], [116, 112, 5, 3]]) }, 'green', { accent: true })
  ],
  'cuántas': [
    ...lady(36, 136, 'pink'),
    ...lady(80, 136, 'purple', { accent: true }),
    ...lady(124, 136, 'orange'),
    s('path', { d: dots([[60, 28], [80, 28], [100, 28]], 6) }, 'blue')
  ],
  'célula': [
    s('path', { d: 'M80 20c34 0 62 22 60 58s-26 62-62 60-62-26-60-60 28-58 62-58z' }, 'mint'),
    s('path', { d: 'M80 20c34 0 62 22 60 58s-26 62-62 60-62-26-60-60 28-58 62-58z', ...SW(4) }, 'green', { stroke: true }),
    s('circle', { cx: 74, cy: 76, r: 22 }, 'purple', { accent: true }),
    s('circle', { cx: 70, cy: 72, r: 8 }, 'pink'),
    s('path', { d: ells([[114, 60, 10, 5], [110, 108, 12, 6], [44, 112, 9, 5]]) }, 'orange'),
    s('path', { d: dots([[40, 56], [104, 36], [126, 86], [76, 120]], 4) }, 'green')
  ],
  'césar': [
    s('path', { d: busts([80], 146, 76, 46) }, 'red'),
    s('path', { d: 'M56 108l48 30', ...SW(10) }, 'white', { stroke: true, lineColor: 'gray' }),
    s('circle', { cx: 80, cy: 72, r: 26 }, 'skin'),
    s('path', { d: 'M54 66q26-30 52 0', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: ells([[58, 62, 7, 4], [66, 52, 7, 4], [78, 48, 7, 4], [92, 50, 7, 4], [102, 60, 7, 4]]) }, 'green', { accent: true }),
    s('path', { d: dots([[71, 76], [89, 76]], 3) }, 'dark')
  ],
  desconocido: [
    s('rect', { x: 26, y: 22, width: 108, height: 116, rx: 10 }, 'sky'),
    s('circle', { cx: 80, cy: 66, r: 22 }, 'gray'),
    s('path', { d: 'M38 138v-18a42 32 0 0 1 84 0v18z' }, 'gray', { accent: true }),
    s('rect', { x: 26, y: 22, width: 108, height: 116, rx: 10, ...SW(4) }, 'blue', { stroke: true })
  ],
  embajada: [
    ground(),
    s('path', { d: 'M80 54V16', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 80, y: 16, width: 32, height: 20 }, 'red', { accent: true }),
    s('rect', { x: 80, y: 22, width: 32, height: 8 }, 'white'),
    s('path', { d: 'M24 72l56-20 56 20z' }, 'gray'),
    s('rect', { x: 30, y: 72, width: 100, height: 54 }, 'cream'),
    s('path', { d: 'M30 72h100v54H30z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: rects([[40, 82, 14, 16], [106, 82, 14, 16]]) }, 'sky'),
    s('path', { d: 'M70 126v-28h20v28z' }, 'brown'),
    s('path', { d: 'M14 136v-12M26 136v-12M134 136v-12M146 136v-12M14 126h12M134 126h12', ...SW(3) }, 'dark', { stroke: true })
  ],
  'específico': [
    s('path', { d: dots([[32, 40], [64, 40], [96, 40], [128, 40], [32, 80], [64, 80], [128, 80], [32, 120], [64, 120], [96, 120], [128, 120]], 10) }, 'gray'),
    s('circle', { cx: 96, cy: 80, r: 11 }, 'red', { accent: true }),
    s('path', { d: ring(96, 80, 22) + 'M96 50v12M96 98v12M66 80h12M114 80h12', ...SW(3) }, 'dark', { stroke: true })
  ],
  fijo: [
    s('rect', { x: 18, y: 24, width: 124, height: 112, rx: 6 }, 'tan'),
    s('rect', { x: 40, y: 46, width: 80, height: 70, rx: 2, transform: 'rotate(-4 80 81)' }, 'yellow'),
    s('path', { d: 'M52 72h56M52 86h56M52 100h40', ...SW(3), transform: 'rotate(-4 80 81)' }, 'orange', { stroke: true }),
    s('path', { d: 'M48 50l-6 10M112 46l6 10', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[48, 48], [112, 44]], 9) }, 'red', { accent: true })
  ],
  formal: [
    ground(),
    ...person(80, 136, 'black'),
    s('path', { d: 'M70 92l10 22 10-22z' }, 'white'),
    s('path', { d: 'M70 94l10 4-10 4zM90 94l-10 4 10 4z' }, 'red', { accent: true }),
    s('path', { d: dots([[80, 112], [80, 124]], 2.5) }, 'gray'),
    s('path', { d: 'M66 64h28l-4-14H70z' }, 'black'),
    s('path', { d: 'M60 64h40', ...SW(4) }, 'black', { stroke: true })
  ],
  'gráfico': [
    s('rect', { x: 14, y: 22, width: 132, height: 104, rx: 6 }, 'white'),
    outline({ x: 14, y: 22, width: 132, height: 104, rx: 6 }),
    s('circle', { cx: 56, cy: 74, r: 32 }, 'blue'),
    s('path', { d: 'M56 74V42a32 32 0 0 1 30.4 41.9z' }, 'yellow', { accent: true }),
    s('path', { d: 'M56 74l30.4 9.9A32 32 0 0 1 37.2 99.9z' }, 'red'),
    s('path', { d: rects([[104, 54, 30, 8], [104, 72, 30, 8], [104, 90, 30, 8]]) }, 'gray'),
    s('path', { d: 'M60 126l-10 16M100 126l10 16', ...SW(4) }, 'gray', { stroke: true })
  ],
  guarda: [
    ground(),
    ...person(64, 136, 'navy'),
    s('path', { d: 'M51 70q0-16 13-16t13 16z' }, 'navy'),
    s('path', { d: 'M50 70h30', ...SW(4) }, 'black', { stroke: true }),
    s('path', { d: star(72, 106, 7) }, 'yellow', { accent: true }),
    s('path', { d: 'M110 136V40M140 136V40M110 60h30M110 100h30', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M78 104l18-14', ...SW(5) }, 'skin', { stroke: true })
  ],
  incluido: [
    s('path', { d: 'M46 66l-14 18h44l14-18zM114 66l14 18H84l-14-18z' }, 'tan'),
    s('path', { d: dots([[60, 66], [80, 58], [98, 68]], 12) }, 'orange'),
    s('path', { d: star(80, 46, 10) }, 'yellow'),
    s('rect', { x: 36, y: 72, width: 88, height: 64, rx: 3 }, 'brown', { accent: true }),
    s('circle', { cx: 122, cy: 118, r: 18 }, 'green'),
    s('path', { d: 'M113 118l6 6 12-13', ...SW(5) }, 'white', { stroke: true })
  ],
  ira: [
    s('circle', { cx: 80, cy: 88, r: 46 }, 'red', { accent: true }),
    s('path', { d: 'M50 70l22 10M110 70l-22 10', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[64, 88], [96, 88]], 5) }, 'dark'),
    s('path', { d: 'M62 116q18-14 36 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 36q-8-8 0-16M120 36q8-8 0-16M80 32q-6-8 0-16', ...SW(5) }, 'gray', { stroke: true })
  ],
  jean: [
    s('path', { d: 'M44 18h72l8 122H90l-10-80-10 80H36z' }, 'blue', { accent: true }),
    s('path', { d: 'M44 30h72', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M80 30v30M54 40q8 10 18 4M106 40q-8 10-18 4', ...DASH(2, '3 3') }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 24, r: 3 }, 'yellow')
  ],
  juvenil: [
    s('path', { d: 'M40 120h80', ...SW(6) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: dots([[52, 128], [108, 128]], 6) }, 'dark'),
    ...lean(80, 114, -10, 'green', { h: 40, w: 26, r: 11 }),
    s('path', { d: 'M72 88l-22-16M90 88l20-18', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M24 132h20M118 132h20M30 100h14', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: sparkle(124, 40, 10) }, 'yellow')
  ],
  literalmente: [
    s('rect', { x: 22, y: 22, width: 116, height: 116, rx: 4 }, 'white'),
    outline({ x: 22, y: 22, width: 116, height: 116, rx: 4 }),
    s('rect', { x: 32, y: 60, width: 96, height: 14, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M38 44h84M38 67h84M38 90h84M38 106h60', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 96v40', ...SW(14) }, 'skin', { stroke: true }),
    s('path', { d: 'M70 82v14', ...SW(8) }, 'skin', { stroke: true })
  ],
  'matemático': [
    s('path', { d: 'M20 132V40l80 92z' }, 'sky', { accent: true }),
    s('path', { d: 'M34 112V72l34 40z' }, 'white'),
    s('path', { d: 'M86 74a44 44 0 0 1 60 0z' }, 'yellow', { opacity: 0.9 }),
    s('path', { d: 'M116 74v-10M100 66l-4-8M132 66l4-8', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M116 18l-14 44M116 18l14 44', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 116, cy: 18, r: 4 }, 'gray')
  ],
  ordenar: [
    s('rect', { x: 18, y: 50, width: 20, height: 20, rx: 2, transform: 'rotate(20 28 60)' }, 'red'),
    s('rect', { x: 30, y: 82, width: 20, height: 20, rx: 2, transform: 'rotate(-25 40 92)' }, 'blue'),
    s('rect', { x: 14, y: 110, width: 20, height: 20, rx: 2, transform: 'rotate(10 24 120)' }, 'yellow'),
    arrow('M60 90h22m-8-8l8 8-8 8', 'gray', 5),
    s('path', { d: 'M98 136V30M142 136V30M98 64h44M98 98h44M98 132h44', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: rects([[104, 42, 20, 20], [104, 76, 20, 20], [104, 110, 20, 20]]) }, 'green', { accent: true })
  ],
  pago: [
    s('rect', { x: 64, y: 34, width: 62, height: 102, rx: 10 }, 'dark'),
    s('rect', { x: 72, y: 44, width: 46, height: 26, rx: 3 }, 'mint'),
    s('path', { d: dots([[80, 86], [95, 86], [110, 86], [80, 100], [95, 100], [110, 100], [80, 114], [95, 114], [110, 114]], 4) }, 'gray'),
    s('rect', { x: 20, y: 70, width: 64, height: 40, rx: 5, transform: 'rotate(-20 52 90)' }, 'blue', { accent: true }),
    s('rect', { x: 30, y: 80, width: 14, height: 10, rx: 2, transform: 'rotate(-20 52 90)' }, 'yellow'),
    s('path', { d: 'M86 58l6 6 12-12', ...SW(4) }, 'green', { stroke: true })
  ],
  pesca: [
    s('path', { d: 'M14 112q11-6 22 0t22 0 22 0 22 0 22 0 22 0v28H14z' }, 'sky'),
    s('path', { d: 'M24 120L110 22', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M110 22q18 30 16 60', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M126 82c-14 0-24 10-26 18 2 8 12 18 26 18 8 0 14-6 16-10l6 8v-32l-6 8c-2-4-8-10-16-10z', transform: 'rotate(90 124 100)' }, 'orange', { accent: true }),
    s('circle', { cx: 120, cy: 112, r: 2.5 }, 'dark')
  ],
  pinta: [
    s('ellipse', { cx: 80, cy: 124, rx: 56, ry: 10 }, 'gray'),
    s('path', { d: 'M40 120V84l80-20v56z' }, 'cream'),
    s('path', { d: 'M40 84l80-20v14l-80 20z' }, 'pink'),
    s('path', { d: 'M40 120V84l80-20v56z', ...SW(2) }, 'tan', { stroke: true }),
    s('circle', { cx: 92, cy: 60, r: 10 }, 'red', { accent: true }),
    s('path', { d: sparkle(32, 52, 10) + sparkle(130, 40, 12) + sparkle(130, 92, 6) }, 'yellow')
  ],
  'posesión': [
    s('path', { d: 'M20 120q20 20 60 20t60-20l-10-14q-20 12-50 12t-50-12z' }, 'skin'),
    s('path', { d: 'M34 104q-6-18 4-24M126 104q6-18-4-24', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M60 66l20-26 20 26-20 36z' }, 'sky', { accent: true }),
    s('path', { d: 'M60 66h40M80 40v62', ...SW(2) }, 'blue', { stroke: true }),
    s('path', { d: heart(80, 22, 7) }, 'red')
  ],
  prioridad: [
    s('path', { d: rects([[28, 96, 84, 16], [28, 120, 84, 16]]) }, 'gray'),
    s('rect', { x: 28, y: 48, width: 84, height: 30, rx: 4 }, 'red', { accent: true }),
    s('path', { d: star(46, 63, 9) }, 'yellow'),
    s('path', { d: 'M62 63h40', ...SW(4) }, 'white', { stroke: true }),
    arrow('M130 120V30m-9 9l9-9 9 9', 'orange', 6)
  ],
  reglamento: [
    s('rect', { x: 30, y: 24, width: 82, height: 112, rx: 4 }, 'navy', { accent: true }),
    s('rect', { x: 40, y: 34, width: 62, height: 92, rx: 2 }, 'cream'),
    s('path', { d: 'M54 50h40M54 70h40M54 90h40M54 110h30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[46, 50], [46, 70], [46, 90], [46, 110]], 3) }, 'red'),
    s('rect', { x: 106, y: 30, width: 16, height: 110, rx: 2, transform: 'rotate(12 114 85)' }, 'yellow'),
    s('path', { d: 'M108 40h6M108 50h4M108 60h6M108 70h4M108 80h6M108 90h4M108 100h6M108 110h4M108 120h6', ...SW(2), transform: 'rotate(12 114 85)' }, 'dark', { stroke: true })
  ],
  respetar: [
    s('rect', { x: 14, y: 96, width: 132, height: 44, rx: 4 }, 'dark'),
    s('path', { d: rects([[30, 100, 12, 36], [52, 100, 12, 36], [74, 100, 12, 36], [96, 100, 12, 36]]) }, 'white'),
    ...person(64, 118, 'red', { h: 36, w: 24, r: 10, accent: true }),
    s('path', { d: 'M110 132v-14q0-4 4-4h6l8-12h16v30z' }, 'blue'),
    s('path', { d: dots([[126, 130]], 5) }, 'black'),
    s('path', { d: 'M104 112v14', ...SW(3) }, 'red', { stroke: true })
  ],
  salsa: [
    s('path', { d: 'M22 84h116q-4 50-58 50T22 84z' }, 'orange'),
    s('ellipse', { cx: 80, cy: 84, rx: 58, ry: 10 }, 'red', { accent: true }),
    s('path', { d: dots([[60, 82], [92, 86], [110, 80]], 3) }, 'green'),
    s('circle', { cx: 120, cy: 46, r: 16 }, 'red'),
    s('path', { d: 'M120 30l-4-8M120 30l6-6', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M40 62q10-30 34-34q-10 14-26 38z' }, 'red'),
    s('path', { d: 'M72 28l6-6', ...SW(3) }, 'green', { stroke: true })
  ],
  'separación': [
    s('path', { d: 'M66 36a44 44 0 0 0 0 88z' }, 'red', { accent: true }),
    s('path', { d: 'M94 36a44 44 0 0 1 0 88z' }, 'blue'),
    s('path', { d: 'M80 30v100', ...DASH(3) }, 'gray', { stroke: true }),
    arrow('M50 80H18m8-8l-8 8 8 8M110 80h32m-8-8l8 8-8 8', 'white', 5)
  ],
  tesoro: [
    s('path', { d: 'M26 72q0-30 54-30t54 30z' }, 'brown'),
    s('path', { d: ells([[56, 72, 12, 6], [80, 66, 12, 6], [104, 72, 12, 6]]) }, 'yellow', { accent: true }),
    s('rect', { x: 26, y: 74, width: 108, height: 62, rx: 4 }, 'brown'),
    s('path', { d: 'M26 74h108M48 74v62M112 74v62', ...SW(5) }, 'yellow', { stroke: true }),
    s('rect', { x: 72, y: 84, width: 16, height: 20, rx: 3 }, 'yellow'),
    s('path', { d: sparkle(36, 36, 9) + sparkle(126, 32, 11) }, 'yellow')
  ],
  toledo: [
    s('rect', { x: 92, y: 24, width: 40, height: 56, rx: 6 }, 'white'),
    s('path', { d: 'M38 80h96q0 30-30 36l4 20H64l4-20q-30-6-30-36z' }, 'white'),
    s('path', { d: 'M92 24h40v56H92zM38 80h96q0 30-30 36l4 20H64l4-20q-30-6-30-36z', ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 86, cy: 80, rx: 46, ry: 8 }, 'sky', { accent: true }),
    s('path', { d: 'M110 36h14', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M26 136h108', ...SW(4) }, 'gray', { stroke: true })
  ],
  tonelada: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M64 48a16 16 0 0 1 32 0', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 50h64l22 86H26z' }, 'dark', { accent: true }),
    s('path', { d: 'M20 130l-6-8M140 130l6-8M30 120l-12-4M130 120l12-4', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M60 76h40', ...SW(5) }, 'gray', { stroke: true })
  ],
  'ética': [
    ground(),
    s('path', { d: 'M80 136V30', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M82 36h44l12 12-12 12H82z' }, 'green', { accent: true }),
    s('path', { d: 'M78 70H34L22 82l12 12h44z' }, 'red'),
    s('path', { d: 'M98 48l6 6 12-12', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M44 76l12 12M56 76L44 88', ...SW(4) }, 'white', { stroke: true })
  ],
  acero: [
    s('path', { d: 'M24 40h112v14H90v52h46v14H24v-14h46V54H24z' }, 'gray', { accent: true }),
    s('path', { d: 'M24 54h112M24 106h112', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: dots([[36, 47], [124, 47], [36, 113], [124, 113]], 3) }, 'dark'),
    s('path', { d: 'M30 44l12-2M100 112l20-2', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: sparkle(80, 28, 8) + sparkle(130, 132, 7) }, 'sky')
  ],
  aparato: [
    s('path', { d: 'M56 46L40 18M104 46l16-28', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 22, y: 46, width: 116, height: 84, rx: 10 }, 'gray'),
    s('rect', { x: 32, y: 56, width: 56, height: 40, rx: 4 }, 'dark'),
    s('path', { d: 'M38 84l10-14 10 8 12-18 12 10', ...SW(3) }, 'green', { stroke: true, accent: true }),
    s('path', { d: dots([[112, 66], [112, 96]], 10) }, 'navy'),
    s('path', { d: dots([[40, 114], [56, 114], [72, 114]], 5) }, 'red'),
    s('path', { d: 'M22 136h116', ...SW(4) }, 'dark', { stroke: true })
  ],
  armado: [
    ground(),
    s('path', { d: 'M110 136V24', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M110 14l7 14h-14z' }, 'gray'),
    ...person(70, 136, 'gray'),
    s('path', { d: 'M56 76a14 14 0 0 1 28 0v6H56z' }, 'dark'),
    s('path', { d: 'M40 92h34v20q0 18-17 24-17-6-17-24z' }, 'blue', { accent: true }),
    s('path', { d: 'M84 104l26-6', ...SW(5) }, 'skin', { stroke: true })
  ],
  barra: [
    s('rect', { x: 14, y: 72, width: 132, height: 12, rx: 3 }, 'brown', { accent: true }),
    s('rect', { x: 22, y: 84, width: 116, height: 32, rx: 2 }, 'tan'),
    s('path', { d: 'M44 116v24M80 116v24M116 116v24M34 140h20M70 140h20M106 140h20', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 40h16l-2 32H42z' }, 'green'),
    s('path', { d: 'M44 30h8v10h-8z' }, 'green'),
    s('path', { d: 'M76 48h20l-4 18h-12z' }, 'yellow'),
    s('path', { d: 'M86 66v6M110 52h18l-9 12z M119 64v8', ...SW(3) }, 'gray', { stroke: true })
  ],
  casualidad: [
    ground(),
    ...lean(46, 136, 10, 'orange'),
    ...lean(114, 136, -10, 'blue'),
    s('path', { d: burst(80, 62, 16, 8, 8) }, 'yellow', { accent: true }),
    s('path', { d: 'M18 90h14M16 104h12M128 90h14M132 104h12', ...SW(3) }, 'gray', { stroke: true })
  ],
  cinta: [
    s('path', { d: 'M80 70q-40-36-52-12 0 22 52 12zM80 70q40-36 52-12 0 22-52 12z' }, 'pink', { accent: true }),
    s('path', { d: 'M76 74q-20 30-38 60l14-2 6 12q14-30 24-60M84 74q20 30 38 60l-14-2-6 12q-14-30-24-60' }, 'pink'),
    s('circle', { cx: 80, cy: 70, r: 10 }, 'red'),
    s('path', { d: 'M38 60q16 4 30 8M122 60q-16 4-30 8', ...SW(2) }, 'red', { stroke: true })
  ],
  'cirugía': [
    s('path', { d: 'M60 18h40l10 14H50z' }, 'gray'),
    s('path', { d: 'M80 32v6', ...SW(3) }, 'gray', { stroke: true }),
    ...person(70, 140, 'green', { accent: true }),
    s('path', { d: 'M56 80a14 10 0 0 1 28 0z' }, 'mint'),
    s('rect', { x: 61, y: 84, width: 18, height: 10, rx: 3 }, 'mint'),
    s('path', { d: 'M84 108l22-14', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M106 94l20-14', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 92, y: 118, width: 54, height: 10, rx: 3 }, 'sky')
  ],
  coca: [
    s('path', { d: 'M30 136Q80 100 136 26', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: ells([[58, 96, 16, 8], [96, 74, 16, 8], [114, 50, 14, 7]]) }, 'green', { accent: true }),
    s('path', { d: ells([[70, 128, 16, 8], [110, 92, 16, 8], [132, 62, 12, 6]]) }, 'green'),
    s('path', { d: dots([[78, 108], [98, 90], [122, 42]], 5) }, 'red')
  ],
  domicilio: [
    ground(),
    s('path', { d: 'M24 136V82h60v54z' }, 'tan'),
    s('path', { d: 'M16 84l38-34 38 34z' }, 'red'),
    s('path', { d: 'M46 136v-28h16v28z' }, 'brown'),
    s('path', { d: 'M118 136V96', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 96V82a12 12 0 0 1 12-12h12a12 12 0 0 1 12 12v14z' }, 'blue', { accent: true }),
    s('path', { d: 'M136 82v-16h10v8h-10', ...SW(3) }, 'red', { stroke: true }),
    s('rect', { x: 106, y: 76, width: 20, height: 12, rx: 1 }, 'white')
  ],
  dominicano: [
    s('path', { d: 'M24 140V18', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: rects([[26, 24, 50, 30], [88, 56, 54, 30]]) }, 'navy'),
    s('path', { d: rects([[88, 24, 54, 30], [26, 56, 50, 30]]) }, 'red', { accent: true }),
    s('path', { d: 'M82 24v62M26 55h116', ...SW(4, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('circle', { cx: 82, cy: 55, r: 6 }, 'green'),
    s('rect', { x: 26, y: 24, width: 116, height: 62, ...SW(2) }, 'gray', { stroke: true })
  ],
  esclavo: [
    s('path', { d: 'M30 112h28v20H30zM102 112h28v20h-28z' }, 'dark'),
    s('path', { d: 'M58 122q8-10 14-4M88 118q6-6 14 4', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: burst(80, 116, 16, 7, 8) }, 'yellow', { accent: true }),
    ...person(80, 104, 'tan', { h: 34, w: 30, r: 13 }),
    s('path', { d: 'M66 90l-22 24M94 90l22 24', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(30, 40, 9) + sparkle(130, 40, 9) }, 'yellow')
  ],
  existente: [
    ground(),
    s('rect', { x: 52, y: 92, width: 16, height: 44, rx: 3 }, 'brown'),
    s('path', { d: dots([[46, 70], [74, 70], [60, 50], [38, 90], [82, 90]], 20) }, 'green', { accent: true }),
    s('circle', { cx: 120, cy: 54, r: 20 }, 'green'),
    s('path', { d: 'M110 54l7 7 13-14', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M52 112l-10 10M68 116l10 8', ...SW(4) }, 'brown', { stroke: true })
  ],
  'explosión': [
    s('path', { d: burst(80, 82, 64, 30, 12) }, 'red'),
    s('path', { d: burst(80, 82, 44, 22, 10) }, 'orange', { accent: true }),
    s('path', { d: burst(80, 82, 24, 12, 8) }, 'yellow'),
    s('path', { d: rects([[22, 28, 8, 8], [130, 120, 8, 8], [128, 30, 6, 6], [24, 124, 6, 6]]) }, 'dark')
  ],
  falla: [
    ...gear(66, 90, 30, 10, 'gray'),
    s('path', { d: 'M56 64l14 18-10 10 16 18', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M92 50q-10-12 2-20t2-16M108 56q-8-10 2-18', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M118 74l24 42H94z' }, 'yellow', { accent: true }),
    s('path', { d: 'M118 88v12', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 118, cy: 108, r: 3 }, 'dark')
  ],
  fan: [
    ground(),
    ...person(70, 136, 'pink'),
    s('path', { d: 'M56 98l-14-30M84 98l14-30', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(70, 42, 16) }, 'red', { accent: true }),
    s('path', { d: 'M108 70l22-40', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: sparkle(132, 70, 9) + sparkle(24, 94, 8) }, 'yellow'),
    s('path', { d: 'M62 84q8 8 16 0z' }, 'dark')
  ],
  gil: [
    s('circle', { cx: 80, cy: 84, r: 48 }, 'skin'),
    s('path', { d: 'M52 76a8 8 0 1 1 8 8M100 76a8 8 0 1 0 -8 8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 106q24 16 48 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M76 112q6 14 12 0z' }, 'pink'),
    s('path', { d: dots([[52, 26], [80, 18], [108, 26]], 6) }, 'yellow', { accent: true }),
    s('path', { d: 'M40 30l6 6M120 30l-6 6', ...SW(3) }, 'orange', { stroke: true })
  ],
  guardar: [
    s('rect', { x: 30, y: 40, width: 92, height: 96, rx: 6 }, 'gray'),
    s('rect', { x: 40, y: 50, width: 72, height: 76, rx: 3 }, 'dark'),
    s('path', { d: 'M122 46l20-10v96l-20 4z' }, 'gray', { accent: true }),
    s('circle', { cx: 132, cy: 86, r: 5 }, 'dark'),
    s('path', { d: 'M60 104h32v18H60zM68 96h16v8H68z' }, 'yellow'),
    arrow('M76 18v30m-8-8l8 8 8-8', 'orange', 5)
  ],
  inocente: [
    s('path', { d: 'M52 120v18M100 120v18M60 120v16M92 120v16', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[50, 92], [66, 82], [84, 82], [100, 92], [58, 108], [80, 112], [100, 106]], 18) }, 'white'),
    s('path', { d: ring(50, 92, 18) + ring(66, 82, 18) + ring(84, 82, 18) + ring(100, 92, 18) + ring(58, 108, 18) + ring(80, 112, 18) + ring(100, 106, 18), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: dots([[50, 92], [66, 82], [84, 82], [100, 92], [58, 108], [80, 112], [100, 106]], 16.5) }, 'white'),
    s('ellipse', { cx: 120, cy: 72, rx: 16, ry: 20 }, 'skin', { accent: true }),
    s('path', { d: 'M108 60l-10-8M132 60l10-8', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: dots([[114, 70], [126, 70]], 2.5) }, 'dark'),
    s('ellipse', { cx: 120, cy: 40, rx: 14, ry: 4, ...SW(3) }, 'yellow', { stroke: true })
  ],
  palma: [
    s('ellipse', { cx: 80, cy: 138, rx: 44, ry: 6 }, 'tan'),
    s('path', { d: 'M78 136q-6-50 6-90', ...SW(10) }, 'brown', { stroke: true }),
    s('path', { d: 'M84 46q-30-16-56 6 26-6 56-6zM84 46q30-16 56 6-26-6-56-6zM84 46q-24 0-40 30 18-20 40-30zM84 46q24 0 40 30-18-20-40-30zM84 46q-4-20 14-30-8 14-14 30z' }, 'green', { accent: true }),
    s('path', { d: dots([[78, 52], [90, 52]], 5) }, 'brown'),
    s('circle', { cx: 130, cy: 24, r: 9 }, 'yellow')
  ],
  poema: [
    s('rect', { x: 28, y: 22, width: 86, height: 116, rx: 4 }, 'cream'),
    outline({ x: 28, y: 22, width: 86, height: 116, rx: 4 }),
    s('path', { d: 'M40 42h52M48 54h36M40 66h52M48 78h36M40 100h52M48 112h36M40 124h44', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 112C110 70 130 40 148 26c-6 30-24 60-44 82z' }, 'purple', { accent: true }),
    s('path', { d: 'M104 108l-6 16', ...SW(3) }, 'dark', { stroke: true })
  ],
  promesa: [
    s('rect', { x: 14, y: 80, width: 30, height: 30, rx: 4 }, 'blue'),
    s('rect', { x: 116, y: 80, width: 30, height: 30, rx: 4 }, 'red'),
    s('rect', { x: 40, y: 72, width: 34, height: 44, rx: 12 }, 'skin'),
    s('rect', { x: 86, y: 72, width: 34, height: 44, rx: 12 }, 'skin'),
    s('path', { d: 'M70 80q14-10 14 4M90 92q-14 10-14-4', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M50 84h14M50 96h14M96 96h14M96 108h14', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: heart(80, 40, 14) }, 'red', { accent: true })
  ],
  queja: [
    ground(),
    ...person(44, 136, 'orange'),
    s('path', { d: 'M36 72l6 3M52 72l-6 3M38 86q6-4 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 98l12-26', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 71, cy: 68, r: 7 }, 'skin'),
    s('path', { d: 'M84 20l10 8 12-10 6 12 16-4-2 14 14 6-12 10 8 12-16 2-2 14-12-8-10 10-6-14-14 2 4-14-12-8 12-8-4-14 14 2z' }, 'red', { accent: true }),
    s('path', { d: 'M112 36l-8 14h8l-6 14', ...SW(4) }, 'yellow', { stroke: true })
  ],
  quinta: [
    s('path', { d: 'M14 100q30-24 66-10t66-6v52H14z' }, 'green'),
    s('path', { d: 'M48 116V82h64v34z' }, 'cream'),
    s('path', { d: 'M48 82h64v34H48z', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M40 84l40-28 40 28z' }, 'red', { accent: true }),
    s('path', { d: rects([[56, 92, 10, 10], [94, 92, 10, 10]]) }, 'sky'),
    s('path', { d: 'M74 116v-18h12v18z' }, 'brown'),
    s('path', { d: dots([[26, 84], [134, 80]], 12) }, 'green'),
    s('path', { d: 'M26 96v20M134 92v24M14 128h132M24 120v16M44 120v16M116 120v16M136 120v16', ...SW(3) }, 'brown', { stroke: true })
  ],
  pendejo: [
    ground(),
    ...lean(76, 136, -50, 'blue'),
    s('path', { d: 'M74 134q10-6 20 0', ...SW(5) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M110 92l12-8M114 104h14M108 80l6-12', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: sparkle(38, 46, 8) + sparkle(58, 30, 6) }, 'yellow'),
    s('path', { d: 'M120 130q8-14 20-4v10h-20z' }, 'brown')
  ],
  'quiénes': [
    ground(),
    s('path', { d: busts([36, 80, 124], 136, 32, 44) }, 'gray'),
    s('path', { d: dots([[36, 80], [80, 80], [124, 80]], 14) }, 'gray'),
    s('path', { d: dots([[28, 44], [36, 44], [44, 44], [72, 44], [80, 44], [88, 44], [116, 44], [124, 44], [132, 44]], 3) }, 'blue', { accent: true }),
    s('path', { d: 'M18 34h36v20H18zM62 34h36v20H62zM106 34h36v20h-36z', ...SW(2) }, 'blue', { stroke: true })
  ],
  'reproducción': [
    s('rect', { x: 18, y: 46, width: 46, height: 62, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M26 60h30M26 72h30M26 84h20', ...SW(3) }, 'orange', { stroke: true }),
    arrow('M70 78h16m-6-6l6 6-6 6', 'gray', 4),
    s('rect', { x: 100, y: 26, width: 42, height: 56, rx: 3 }, 'yellow'),
    s('rect', { x: 94, y: 88, width: 42, height: 56, rx: 3 }, 'yellow'),
    s('path', { d: 'M107 38h28M107 50h28M107 62h18M101 100h28M101 112h28M101 124h18', ...SW(3) }, 'orange', { stroke: true })
  ],
  sanidad: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'mint'),
    s('path', { d: 'M66 26h28v40h40v28H94v40H66V94H26V66h40z' }, 'green', { accent: true }),
    s('path', { d: heart(80, 80, 14) }, 'white'),
    s('path', { d: 'M62 78h10l4-8 6 14 4-6h12', ...SW(3) }, 'red', { stroke: true })
  ],
  sindicato: [
    ground(),
    ...person(36, 136, 'orange'),
    ...person(80, 136, 'blue', { accent: true }),
    ...person(124, 136, 'orange'),
    s('path', { d: 'M22 76a14 12 0 0 1 28 0zM66 76a14 12 0 0 1 28 0zM110 76a14 12 0 0 1 28 0z' }, 'yellow'),
    s('path', { d: 'M50 104h16M94 104h16M136 100l6-36', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 142, cy: 60, r: 6 }, 'skin')
  ],
  'soberanía': [
    s('path', { d: 'M14 124q22-8 44 0t44 0 44 0v16H14z' }, 'sky'),
    s('path', { d: 'M28 124q14-40 52-44t52 44z' }, 'green'),
    s('path', { d: 'M80 82V34', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 80, y: 34, width: 36, height: 24 }, 'red'),
    s('path', { d: 'M28 34V18l9 8 9-12 9 12 9-8v16z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[37, 28], [55, 28]], 2) }, 'red')
  ],
  terrorista: [
    s('circle', { cx: 70, cy: 92, r: 38 }, 'dark', { accent: true }),
    s('rect', { x: 84, y: 46, width: 18, height: 14, rx: 2, transform: 'rotate(30 93 53)' }, 'gray'),
    s('path', { d: 'M98 46q10-20 26-16', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: burst(126, 28, 11, 5, 8) }, 'orange'),
    s('path', { d: 'M52 76q6-10 16-12', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: ring(118, 110, 20) + 'M104 96l28 28', ...SW(6) }, 'red', { stroke: true })
  ],
  testimonio: [
    s('rect', { x: 20, y: 102, width: 80, height: 36, rx: 3 }, 'brown'),
    ...person(60, 112, 'navy'),
    s('path', { d: 'M46 72l-8-30', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 37, cy: 38, r: 7 }, 'skin'),
    s('path', { d: 'M94 22h46a6 6 0 0 1 6 6v30a6 6 0 0 1-6 6h-28l-14 12 2-12h-6a6 6 0 0 1-6-6V28a6 6 0 0 1 6-6z' }, 'sky', { accent: true }),
    s('path', { d: 'M100 36h36M100 48h26', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M74 116h18', ...SW(3) }, 'tan', { stroke: true })
  ],
  transparencia: [
    s('rect', { x: 30, y: 30, width: 100, height: 104, rx: 6 }, 'sky'),
    s('circle', { cx: 80, cy: 90, r: 22 }, 'red'),
    s('path', { d: 'M80 68q4-12 14-12', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M40 58l26-20M40 76l40-32M96 128l28-22', ...SW(4) }, 'white', { stroke: true }),
    s('rect', { x: 30, y: 30, width: 100, height: 104, rx: 6, ...SW(4) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M24 140h112', ...SW(4) }, 'gray', { stroke: true })
  ],
  uniforme: [
    s('path', { d: 'M80 22v10M70 22a10 8 0 0 1 20 0', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 34L30 50l2 8 48-14 48 14 2-8z' }, 'gray'),
    s('path', { d: 'M52 46h56l12 10-8 20-6-6v66H54V70l-6 6-8-20z' }, 'navy', { accent: true }),
    s('path', { d: 'M80 48v84', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: dots([[86, 70], [86, 90], [86, 110]], 3) }, 'yellow'),
    s('path', { d: star(66, 68, 6) }, 'yellow'),
    s('path', { d: 'M52 50l-8 10M108 50l8 10', ...SW(4) }, 'yellow', { stroke: true })
  ],
  adolescente: [
    ground(),
    ...person(70, 136, 'purple', { h: 42 }),
    s('path', { d: 'M56 80a14 14 0 0 1 28 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[57, 82, 4, 6], [83, 82, 4, 6]]) }, 'red', { accent: true }),
    s('rect', { x: 86, y: 100, width: 12, height: 20, rx: 2 }, 'dark'),
    s('path', { d: 'M84 112h4', ...SW(5) }, 'skin', { stroke: true }),
    arrow('M124 130V40m-8 8l8-8 8 8', 'green', 5),
    s('path', { d: 'M112 130h24M116 100h16M120 70h8', ...SW(3) }, 'gray', { stroke: true })
  ],
};
