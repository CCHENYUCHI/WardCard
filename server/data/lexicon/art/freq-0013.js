// Illustration specs for common words, batch 0013 (plus leftovers of 0008 and 0012) (see server/scripts/lexicon/art.js)
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

module.exports = {
  caber: [
    s('circle', { cx: 80, cy: 78, r: 26 }, 'red', { accent: true }),
    s('rect', { x: 52, y: 84, width: 56, height: 52, rx: 3 }, 'tan'),
    s('path', { d: 'M52 84L32 70M108 84l20-14', ...SW(6) }, 'brown', { stroke: true }),
    arrow('M80 16v24m-9-9l9 9 9-9', 'blue'),
    s('path', { d: 'M116 30l7 7 13-15', ...SW(5) }, 'green', { stroke: true })
  ],
  financiero: [
    s('path', { d: 'M14 58L66 28l52 30z' }, 'navy', { accent: true }),
    s('path', { d: rects([[18, 58, 96, 8], [16, 114, 100, 12]]) }, 'gray'),
    s('path', { d: rects([[26, 70, 10, 42], [50, 70, 10, 42], [74, 70, 10, 42], [98, 70, 10, 42]]) }, 'gray'),
    s('rect', { x: 114, y: 96, width: 32, height: 36 }, 'yellow'),
    s('ellipse', { cx: 130, cy: 132, rx: 16, ry: 6 }, 'yellow'),
    s('ellipse', { cx: 130, cy: 96, rx: 16, ry: 6 }, 'orange'),
    s('path', { d: 'M114 108q16 6 32 0M114 120q16 6 32 0', ...SW(2) }, 'orange', { stroke: true })
  ],
  obligado: [
    ground(),
    ...person(66, 136, 'blue'),
    s('path', { d: 'M48 98q18 8 36 0M48 114q18 8 36 0', ...SW(5) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M84 106q24 4 50-14', ...SW(5) }, 'brown', { stroke: true }),
    s('circle', { cx: 136, cy: 90, r: 7 }, 'skin'),
    arrow('M100 66l30-14m-11-1l11 1-4 10', 'orange', 5),
    s('path', { d: drop(44, 72, 4) }, 'sky')
  ],
  periodismo: [
    ground(),
    ...person(48, 136, 'navy'),
    s('path', { d: 'M60 104l18-16', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M78 90l8-12', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 88, cy: 74, r: 7 }, 'red', { accent: true }),
    s('path', { d: 'M121 76l-12 60M121 76v60M121 76l12 60', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 106, y: 52, width: 32, height: 24, rx: 3 }, 'dark'),
    s('circle', { cx: 104, cy: 64, r: 9 }, 'gray'),
    s('circle', { cx: 132, cy: 58, r: 3 }, 'red')
  ],
  portal: [
    s('rect', { x: 20, y: 28, width: 120, height: 108, rx: 2 }, 'cream'),
    s('rect', { x: 14, y: 20, width: 132, height: 12, rx: 2 }, 'brown'),
    s('path', { d: rects([[26, 40, 16, 20], [118, 40, 16, 20], [26, 96, 16, 20], [118, 96, 16, 20]]) }, 'sky'),
    s('path', { d: 'M54 136V88a26 26 0 0 1 52 0v48z' }, 'brown', { accent: true }),
    s('path', { d: 'M80 64v72', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: dots([[46, 78], [114, 78]], 5) }, 'yellow'),
    s('path', { d: rects([[46, 130, 68, 6], [40, 136, 80, 6]]) }, 'gray')
  ],
  postura: [
    ground(),
    ...lean(46, 136, 18, 'gray'),
    s('path', { d: 'M112 18v118', ...DASH(2, '4 5') }, 'green', { stroke: true }),
    ...person(112, 136, 'blue', { accent: true }),
    s('path', { d: 'M126 32l6 6 12-14', ...SW(5) }, 'green', { stroke: true })
  ],
  'preocupación': [
    s('path', { d: 'M68 100l-6-22M92 100l6-22', ...SW(6) }, 'skin', { stroke: true }),
    ...person(80, 136, 'purple'),
    s('path', { d: dots([[64, 74], [96, 74]], 6) }, 'skin'),
    s('path', { d: dots([[75, 77], [85, 77]], 2) + 'M74 87q6-4 12 0' }, 'dark'),
    s('path', { d: 'M56 44c10-20 30 4 14 10s-6-24 16-20 14 22-2 18-10-18 10-20 20 12 10 18', ...SW(3) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: drop(108, 70, 4) }, 'sky')
  ],
  'preparación': [
    s('rect', { x: 18, y: 80, width: 100, height: 52, rx: 8 }, 'tan'),
    s('path', { d: dots([[34, 112], [50, 118], [38, 124]], 7) }, 'orange'),
    s('path', { d: 'M64 116l38-6q4 4 0 8z' }, 'orange'),
    s('path', { d: 'M102 110l8-6M102 114h10', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M60 88h44q-4 8-14 8H60z' }, 'gray'),
    s('rect', { x: 34, y: 88, width: 26, height: 8, rx: 3 }, 'dark'),
    s('path', { d: 'M118 104h30a15 22 0 0 1-30 0z' }, 'blue', { accent: true }),
    s('path', { d: dots([[126, 99], [140, 99]], 7) }, 'red')
  ],
  productor: [
    s('rect', { x: 18, y: 70, width: 80, height: 60, rx: 3 }, 'dark'),
    s('path', { d: 'M24 70l8 10M44 70l8 10M64 70l8 10M84 70l8 10', ...SW(5) }, 'white', { stroke: true }),
    s('rect', { x: 18, y: 50, width: 80, height: 12, rx: 2, transform: 'rotate(-14 18 62)' }, 'white'),
    s('path', { d: 'M28 50l8 12M48 50l8 12M68 50l8 12M88 50l6 10', ...SW(5), transform: 'rotate(-14 18 62)' }, 'dark', { stroke: true }),
    s('path', { d: 'M28 98h58M28 114h38', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 122, cy: 106, r: 22 }, 'gray'),
    s('path', { d: dots([[122, 94], [112, 112], [132, 112]], 5) }, 'dark'),
    s('path', { d: star(122, 44, 16) }, 'yellow', { accent: true })
  ],
  so: [
    s('path', { d: 'M14 104h132v30a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'blue'),
    s('path', { d: 'M14 54h132v50h-16v-8a50 34 0 0 0-100 0v8H14z' }, 'brown'),
    s('path', { d: 'M14 50h132', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M80 100V70l20 28z' }, 'yellow'),
    s('path', { d: 'M56 102h48l-8 12H64z' }, 'red', { accent: true }),
    s('path', { d: 'M30 126q8-6 16 0q8 6 16 0M98 132q8-6 16 0q8 6 16 0', ...SW(3) }, 'white', { stroke: true })
  ],
  sueldo: [
    s('rect', { x: 46, y: 34, width: 72, height: 40, rx: 3, transform: 'rotate(-8 82 54)' }, 'green'),
    s('circle', { cx: 82, cy: 50, r: 8 }, 'mint'),
    s('rect', { x: 28, y: 62, width: 104, height: 66, rx: 4 }, 'tan'),
    s('path', { d: 'M28 64l52 34 52-34', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: dots([[116, 128], [132, 118]], 10) }, 'yellow', { accent: true }),
    s('path', { d: ring(116, 128, 10) + ring(132, 118, 10), ...SW(2) }, 'orange', { stroke: true })
  ],
  'tensión': [
    ground(),
    ...lean(48, 136, -18, 'blue'),
    ...lean(112, 136, 18, 'red', { accent: true }),
    s('path', { d: 'M38 108q42 4 84 0', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M78 110h4v16l-12-6z' }, 'yellow'),
    s('path', { d: 'M70 94l-4-10M90 94l4-10M80 92V80', ...SW(3) }, 'orange', { stroke: true })
  ],
  'tránsito': [
    s('rect', { x: 14, y: 100, width: 132, height: 40, rx: 4 }, 'dark'),
    s('path', { d: 'M22 120h16M54 120h16M86 120h16M118 120h16', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M126 100V72', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 114, y: 18, width: 24, height: 56, rx: 6 }, 'dark'),
    s('path', { d: dots([[126, 30], [126, 46]], 6) }, 'gray'),
    s('circle', { cx: 126, cy: 62, r: 6 }, 'green', { accent: true }),
    s('path', { d: 'M20 112v-10q0-4 4-4h8l8-10h18l8 10h4q4 0 4 4v10z' }, 'red'),
    s('path', { d: 'M70 134v-10q0-4 4-4h8l8-10h18l8 10h4q4 0 4 4v10z' }, 'blue'),
    s('path', { d: dots([[32, 112], [62, 112], [82, 134], [112, 134]], 5) }, 'black')
  ],
  boda: [
    backdrop('pink'),
    s('path', { d: 'M96 64q-12 30-6 60l14-50z' }, 'cream'),
    ...person(56, 136, 'black'),
    s('path', { d: 'M48 94l8 4-8 4zM64 94l-8 4 8 4z' }, 'white'),
    ...lady(104, 136, 'white'),
    s('path', { d: heart(80, 34, 14) }, 'red', { accent: true })
  ],
  'clasificación': [
    s('rect', { x: 16, y: 100, width: 36, height: 36, rx: 3 }, 'blue', { accent: true }),
    s('rect', { x: 62, y: 100, width: 36, height: 36, rx: 3 }, 'red'),
    s('rect', { x: 108, y: 100, width: 36, height: 36, rx: 3 }, 'yellow'),
    s('circle', { cx: 34, cy: 38, r: 12 }, 'blue'),
    s('path', { d: 'M80 24l14 24H66z' }, 'red'),
    s('rect', { x: 114, y: 26, width: 24, height: 24, rx: 2 }, 'yellow'),
    s('path', { d: 'M34 60v26m-7-7l7 7 7-7M80 60v26m-7-7l7 7 7-7M126 60v26m-7-7l7 7 7-7', ...SW(4) }, 'gray', { stroke: true })
  ],
  'coño': [
    s('circle', { cx: 60, cy: 94, r: 36 }, 'skin'),
    s('path', { d: dots([[42, 106], [78, 106]], 6) }, 'pink'),
    s('path', { d: 'M40 80l14 6M80 80l-14 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[48, 92], [72, 92]], 3.5) }, 'dark'),
    s('ellipse', { cx: 60, cy: 114, rx: 9, ry: 6 }, 'dark'),
    s('path', { d: 'M96 18h44a6 6 0 0 1 6 6v34a6 6 0 0 1-6 6h-28l-14 12 2-12h-4a6 6 0 0 1-6-6V24a6 6 0 0 1 6-6z' }, 'white'),
    s('path', { d: 'M96 18h44a6 6 0 0 1 6 6v34a6 6 0 0 1-6 6h-28l-14 12 2-12h-4a6 6 0 0 1-6-6V24a6 6 0 0 1 6-6z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M124 24l-12 18h10l-6 16 16-22h-10l6-12z' }, 'orange', { accent: true })
  ],
  cumplimiento: [
    s('rect', { x: 24, y: 24, width: 84, height: 116, rx: 6 }, 'brown'),
    s('rect', { x: 32, y: 36, width: 68, height: 96, rx: 3 }, 'white'),
    s('rect', { x: 50, y: 18, width: 32, height: 12, rx: 4 }, 'gray'),
    s('path', { d: 'M40 52h12v12H40zM40 78h12v12H40zM40 104h12v12H40zM62 58h28M62 84h28M62 110h28', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M41 56l5 5 10-12M41 82l5 5 10-12M41 108l5 5 10-12', ...SW(4) }, 'green', { stroke: true }),
    s('circle', { cx: 118, cy: 110, r: 24 }, 'green', { accent: true }),
    s('path', { d: 'M106 110l8 8 16-18', ...SW(6) }, 'white', { stroke: true })
  ],
  definitivo: [
    s('rect', { x: 30, y: 118, width: 72, height: 16, rx: 4 }, 'brown'),
    s('ellipse', { cx: 66, cy: 118, rx: 36, ry: 6 }, 'tan'),
    s('path', { d: 'M68 92L92 32', ...SW(9) }, 'tan', { stroke: true }),
    s('rect', { x: 40, y: 82, width: 56, height: 26, rx: 6, transform: 'rotate(-20 68 95)' }, 'brown', { accent: true }),
    s('path', { d: 'M52 82v26M84 82v26', ...SW(4), transform: 'rotate(-20 68 95)' }, 'yellow', { stroke: true }),
    s('path', { d: 'M26 108l-10-6M24 120H12M110 108l10-6M112 120h14', ...SW(3) }, 'orange', { stroke: true })
  ],
  'destrucción': [
    ground(),
    s('path', { d: 'M70 136V100l10-8-8-10 8-8V56h60v80z' }, 'gray'),
    s('path', { d: rects([[96, 66, 12, 14], [116, 66, 12, 14], [96, 96, 12, 14], [116, 96, 12, 14]]) }, 'sky'),
    s('path', { d: 'M80 92l10 6-4 10 10 6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: burst(66, 84, 20, 10, 8) }, 'orange'),
    s('path', { d: rects([[78, 40, 10, 8], [86, 112, 8, 8], [60, 112, 8, 6]]) }, 'brown'),
    s('path', { d: 'M100 14L56 70', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 48, cy: 82, r: 18 }, 'dark', { accent: true })
  ],
  dirigir: [
    ground(),
    ...person(56, 136, 'black'),
    s('path', { d: 'M68 98l20-28M44 98l-14-14', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M88 70l14-24', ...SW(3) }, 'dark', { stroke: true }),
    ...note(116, 96, 'purple'),
    ...note(128, 54, 'blue')
  ],
  fama: [
    s('rect', { x: 30, y: 128, width: 100, height: 10, rx: 3 }, 'red'),
    ...person(80, 128, 'purple'),
    s('path', { d: star(80, 34, 20) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(32, 58, 14) + sparkle(128, 58, 14) + sparkle(28, 104, 10) + sparkle(132, 104, 10) }, 'orange')
  ],
  herido: [
    ground(),
    ...person(72, 136, 'blue'),
    s('path', { d: 'M60 72q12-8 24 0', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M58 98l28 20', ...SW(10) }, 'cream', { stroke: true }),
    s('path', { d: 'M106 136V84M98 84h16M102 108h8', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M124 26h8v10h10v8h-10v10h-8V44h-10v-8h10z' }, 'red', { accent: true })
  ],
  inmigrante: [
    ground(),
    s('path', { d: 'M86 20v116', ...DASH(3) }, 'gray', { stroke: true }),
    ...person(42, 136, 'green'),
    s('rect', { x: 58, y: 106, width: 20, height: 28, rx: 3 }, 'brown'),
    s('path', { d: 'M63 106v-6h10v6', ...SW(3) }, 'dark', { stroke: true }),
    arrow('M94 62h30m-9-9l9 9-9 9'),
    s('path', { d: 'M100 136V102l20-18 20 18v34z' }, 'red', { accent: true }),
    s('rect', { x: 114, y: 116, width: 12, height: 20 }, 'brown')
  ],
  jurado: [
    s('path', { d: busts([44, 80, 116], 86, 26, 26) }, 'purple'),
    s('path', { d: busts([30, 63, 97, 130], 108, 26, 26) }, 'blue'),
    s('path', { d: dots([[44, 48], [80, 48], [116, 48], [30, 72], [63, 72], [97, 72], [130, 72]], 10) }, 'skin'),
    s('rect', { x: 14, y: 100, width: 132, height: 38, rx: 3 }, 'brown', { accent: true }),
    s('rect', { x: 12, y: 96, width: 136, height: 8, rx: 3 }, 'tan'),
    s('path', { d: 'M58 110v20M102 110v20', ...SW(4) }, 'tan', { stroke: true })
  ],
  paquete: [
    s('path', { d: 'M24 66l56 22v54l-56-22z' }, 'tan'),
    s('path', { d: 'M80 88l56-22v54l-56 22z' }, 'brown'),
    s('path', { d: 'M24 66l56-22 56 22-56 22z' }, 'cream'),
    s('path', { d: 'M52 55l56 22v54', ...SW(8, { 'stroke-linecap': 'butt' }) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M34 92l28 11v16l-28-11z' }, 'white')
  ],
  propaganda: [
    s('path', { d: 'M80 64v74', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M76 46v12l-40 16V30z' }, 'red', { accent: true }),
    s('path', { d: 'M84 46v12l40 16V30z' }, 'red'),
    s('rect', { x: 72, y: 42, width: 16, height: 20, rx: 3 }, 'dark'),
    s('path', { d: 'M30 34q-8 18 0 36M22 28q-12 24 0 48M130 34q8 18 0 36M138 28q12 24 0 48', ...SW(3) }, 'orange', { stroke: true }),
    s('rect', { x: 24, y: 100, width: 24, height: 30, rx: 2, transform: 'rotate(-15 36 115)' }, 'yellow'),
    s('rect', { x: 112, y: 100, width: 24, height: 30, rx: 2, transform: 'rotate(15 124 115)' }, 'sky')
  ],
  'ramón': [
    ground(),
    s('path', { d: 'M72 136l4-50h8l4 50z' }, 'brown'),
    s('path', { d: dots([[50, 62], [80, 44], [110, 62], [64, 82], [96, 82], [80, 64]], 24) }, 'green'),
    s('path', { d: dots([[56, 70], [92, 52], [112, 76], [76, 88], [100, 96], [44, 90]], 6) }, 'yellow', { accent: true })
  ],
  rango: [
    s('path', { d: 'M36 24h88v70q0 30-44 44q-44-14-44-44z' }, 'navy'),
    s('path', { d: 'M36 24h88v70q0 30-44 44q-44-14-44-44z', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M50 64l30-18 30 18M50 84l30-18 30 18M50 104l30-18 30 18', ...SW(8) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: star(80, 120, 8) }, 'white')
  ],
  retiro: [
    s('circle', { cx: 126, cy: 36, r: 14 }, 'yellow'),
    s('path', { d: 'M48 58v66M48 98h48v26M36 128q44 14 80-4', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 64, cy: 56, r: 12 }, 'skin'),
    s('path', { d: 'M52 54a12 12 0 0 1 24 0z' }, 'gray'),
    s('rect', { x: 54, y: 70, width: 24, height: 30, rx: 8 }, 'green', { accent: true }),
    s('rect', { x: 58, y: 88, width: 40, height: 12, rx: 6 }, 'navy'),
    s('path', { d: 'M94 96v24h8', ...SW(9) }, 'navy', { stroke: true })
  ],
  ronda: [
    backdrop('mint'),
    s('ellipse', { cx: 80, cy: 128, rx: 62, ry: 10 }, 'gray'),
    s('path', { d: 'M48 86q12 0 12 12q0 12-12 12M88 80q12 0 12 12q0 12-12 12M128 86q12 0 12 12q0 12-12 12', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: rects([[24, 76, 24, 46], [64, 70, 24, 52], [104, 76, 24, 46]]) }, 'yellow', { accent: true }),
    s('path', { d: dots([[28, 74], [36, 70], [44, 74], [68, 68], [76, 64], [84, 68], [108, 74], [116, 70], [124, 74]], 7) }, 'white')
  ],
  rumbo: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'navy'),
    s('circle', { cx: 80, cy: 80, r: 50 }, 'cream'),
    s('path', { d: rays(80, 80, 42, 50, 8), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 36l12 44H68z', transform: 'rotate(30 80 80)' }, 'red', { accent: true }),
    s('path', { d: 'M80 124l12-44H68z', transform: 'rotate(30 80 80)' }, 'gray'),
    s('circle', { cx: 80, cy: 80, r: 5 }, 'dark')
  ],
  solar: [
    backdrop('sky'),
    s('path', { d: 'M14 92h132v42a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green'),
    s('path', { d: 'M40 100h80l14 32H26z' }, 'brown', { accent: true }),
    s('path', { d: 'M40 100l-14 32h108l-14-32zM40 100v-10M120 100v-10M26 132v-10M134 132v-10', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M124 92V56', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 104, y: 36, width: 38, height: 26, rx: 3 }, 'white'),
    s('path', { d: 'M114 56v-8l9-7 9 7v8z' }, 'red'),
    s('path', { d: 'M24 60v32M24 70l-6 6M24 66l6 4', ...SW(3) }, 'dark', { stroke: true })
  ],
  sombra: [
    s('circle', { cx: 30, cy: 32, r: 12 }, 'yellow'),
    s('path', { d: rays(30, 32, 16, 22, 8), ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M14 112h132v22a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'mint'),
    s('path', { d: 'M66 136h28l34-14-6-6z' + ells([[136, 116, 9, 5]]) }, 'dark', { accent: true }),
    ...person(78, 136, 'blue')
  ],
  'símbolo': [
    s('path', { d: rects([[20, 20, 56, 56], [84, 20, 56, 56], [20, 84, 56, 56], [84, 84, 56, 56]]) }, 'sky'),
    s('path', { d: heart(48, 46, 18) }, 'red', { accent: true }),
    s('path', { d: star(112, 50, 20) }, 'yellow'),
    s('circle', { cx: 48, cy: 112, r: 14, ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M112 94l18 32H94z' }, 'purple')
  ],
  vigilancia: [
    s('path', { d: 'M46 48L14 128h60z', opacity: 0.6 }, 'yellow'),
    s('rect', { x: 120, y: 20, width: 20, height: 30, rx: 3 }, 'dark'),
    s('path', { d: 'M124 40l-20 14', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 46, y: 44, width: 66, height: 26, rx: 6, transform: 'rotate(20 80 57)' }, 'gray'),
    s('circle', { cx: 48, cy: 45, r: 9 }, 'black'),
    s('circle', { cx: 96, cy: 64, r: 4 }, 'red', { accent: true })
  ],
  agenda: [
    s('rect', { x: 30, y: 20, width: 100, height: 122, rx: 6 }, 'red', { accent: true }),
    s('rect', { x: 40, y: 28, width: 84, height: 106, rx: 3 }, 'cream'),
    s('path', { d: 'M28 40h18M28 64h18M28 88h18M28 112h18', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 48, y: 34, width: 68, height: 8, rx: 2 }, 'blue'),
    s('path', { d: rects(Array.from({ length: 12 }, (_, k) => [52 + (k % 3) * 22, 52 + Math.floor(k / 3) * 20, 16, 12])) }, 'gray'),
    s('rect', { x: 74, y: 72, width: 16, height: 12 }, 'orange'),
    s('rect', { x: 120, y: 60, width: 8, height: 60, rx: 3, transform: 'rotate(15 124 90)' }, 'navy')
  ],
  asesinado: [
    backdrop('dark'),
    s('path', { d: 'M40 40a12 12 0 1 0 24 0a12 12 0 1 0 -24 0M44 56h18q6 0 6 6v40q0 6-6 6h-18q-6 0-6-6V62q0-6 6-6zM68 64l24 14M38 64l-14 18M46 108l-6 26M60 108l14 24', ...SW(4), transform: 'translate(24 0)' }, 'white', { stroke: true }),
    s('path', { d: 'M14 120L146 88', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M14 120L146 88', ...SW(14, { 'stroke-linecap': 'butt', 'stroke-dasharray': '8 10' }) }, 'black', { stroke: true })
  ],
  atacar: [
    s('path', { d: 'M78 46h56v40q0 28-28 44q-28-16-28-44z' }, 'blue'),
    s('path', { d: 'M106 46v84', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: burst(86, 62, 20, 9, 8) }, 'orange', { accent: true }),
    s('path', { d: 'M34 114L88 60', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 100l16 16', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M36 112L22 126', ...SW(7) }, 'brown', { stroke: true }),
    s('circle', { cx: 20, cy: 128, r: 5 }, 'yellow'),
    s('path', { d: 'M28 70l14 4M36 50l12 10', ...SW(3) }, 'gray', { stroke: true })
  ],
  caribe: [
    backdrop('sky'),
    s('circle', { cx: 122, cy: 38, r: 14 }, 'yellow'),
    s('path', { d: 'M14 96h132v38a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'blue'),
    s('path', { d: 'M30 102q40-24 80 0z' }, 'tan'),
    s('path', { d: 'M70 96q-4-30 8-52', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M78 44q-20-10-34 4q18-4 34-4zM78 44q20-12 34 2q-18-2-34-2zM78 44q-10 16-24 22q14-10 24-22zM78 44q12 14 24 20q-10-12-24-20z' }, 'green', { accent: true }),
    s('path', { d: 'M30 122q8-6 16 0q8 6 16 0M92 128q8-6 16 0q8 6 16 0', ...SW(3) }, 'white', { stroke: true })
  ],
  carro: [
    s('path', { d: 'M14 130h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M16 112v-18q0-8 8-8h18l16-22h46l18 22h14q8 0 8 8v18z' }, 'red', { accent: true }),
    s('path', { d: 'M62 70h20v16H50zM90 70h14l12 16H90z' }, 'sky'),
    s('path', { d: dots([[44, 114], [116, 114]], 15) }, 'dark'),
    s('path', { d: dots([[44, 114], [116, 114]], 6) }, 'gray'),
    s('circle', { cx: 138, cy: 96, r: 4 }, 'yellow')
  ],
  che: [
    ground(),
    ...person(52, 136, 'blue'),
    s('path', { d: 'M64 98l18-30', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 84, cy: 64, r: 7 }, 'skin'),
    s('path', { d: 'M94 50q8 10 4 24M102 42q12 14 6 34', ...SW(3) }, 'orange', { stroke: true }),
    s('ellipse', { cx: 56, cy: 82, rx: 4, ry: 3 }, 'dark'),
    s('path', { d: 'M120 98l10-22', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 136q-12-4-12-20q0-14 14-16h8q14 2 14 16q0 16-12 20z' }, 'brown', { accent: true }),
    s('ellipse', { cx: 114, cy: 101, rx: 10, ry: 3 }, 'green')
  ],
  'concepción': [
    ground(),
    s('circle', { cx: 64, cy: 38, r: 15 }, 'brown'),
    s('circle', { cx: 70, cy: 40, r: 14 }, 'skin'),
    s('path', { d: 'M60 58h20q6 0 8 10l4 20q24 8 24 30q0 18-22 18H60q-6 0-6-6V64q0-6 6-6z' }, 'pink'),
    s('path', { d: 'M66 76q10 14 24 30', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(100, 112, 10) }, 'red', { accent: true })
  ],
  concreto: [
    s('rect', { x: 30, y: 78, width: 72, height: 58 }, 'gray'),
    s('path', { d: 'M102 78l24-20v58l-24 20z' }, 'dark'),
    s('path', { d: 'M30 78l24-20h72l-24 20z' }, 'white'),
    s('path', { d: 'M30 78l24-20h72l-24 20zM30 78v58h72V78', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[42, 94], [60, 112], [84, 92], [48, 124], [90, 122], [72, 100]], 2.5) }, 'dark'),
    s('path', { d: 'M78 68V44', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 78, cy: 34, r: 12 }, 'red', { accent: true })
  ],
  'conservación': [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'mint'),
    s('ellipse', { cx: 80, cy: 96, rx: 36, ry: 10 }, 'brown'),
    s('path', { d: 'M30 92q4 36 50 40q46-4 50-40q-10 4-18 4q-6 20-32 20q-26 0-32-20q-8 0-18-4z' }, 'skin'),
    s('path', { d: 'M80 92V58', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M80 70q-24-4-30-22q22-2 30 22zM80 62q22-6 30-26q-24 0-30 26z' }, 'green', { accent: true })
  ],
  constantemente: [
    s('rect', { x: 44, y: 24, width: 24, height: 8, rx: 3 }, 'dark'),
    s('path', { d: 'M56 32v8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M20 40h60q14 0 14 14v10H78v-6q0-4-4-4H20z' }, 'gray'),
    s('path', { d: drop(86, 82, 6) + drop(86, 104, 6) + drop(86, 126, 4) }, 'blue', { accent: true }),
    s('ellipse', { cx: 86, cy: 138, rx: 26, ry: 5 }, 'sky'),
    arrow('M138 86a16 16 0 1 1-6-22m-2-10l2 10-10 2', 'orange', 4)
  ],
  detenido: [
    s('path', { d: 'M14 90l34 8v22l-34-8zM146 90l-34 8v22l34-8z' }, 'navy'),
    s('path', { d: dots([[58, 108], [102, 108]], 10) }, 'skin'),
    s('path', { d: ring(52, 109, 12) + ring(108, 109, 12), ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M64 109h32', ...DASH(4, '5 3') }, 'gray', { stroke: true }),
    s('path', { d: star(80, 46, 26) }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 48, r: 8 }, 'orange')
  ],
  dirigente: [
    s('rect', { x: 50, y: 110, width: 60, height: 26, rx: 3 }, 'brown'),
    s('path', { d: 'M96 92V28', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 28h30l-6 10 6 10H96z' }, 'blue'),
    ...person(76, 110, 'red', { accent: true }),
    s('path', { d: 'M88 84l8-8', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: busts([24, 46, 114, 136], 140, 22, 22) }, 'gray'),
    s('path', { d: dots([[24, 116], [46, 116], [114, 116], [136, 116]], 9) }, 'brown')
  ],
  electricidad: [
    s('path', { d: 'M58 140v-28', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 74V50M68 74V50', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 36, y: 72, width: 44, height: 42, rx: 8 }, 'dark'),
    s('path', { d: 'M124 18l-22 42h16l-12 38 30-48h-16l14-32z' }, 'yellow', { accent: true }),
    s('path', { d: 'M38 40l-8-8M32 56H20M56 32l-2-12', ...SW(3) }, 'orange', { stroke: true })
  ],
  episodio: [
    s('rect', { x: 20, y: 22, width: 120, height: 76, rx: 8 }, 'dark'),
    s('rect', { x: 28, y: 30, width: 104, height: 60, rx: 4 }, 'sky'),
    s('path', { d: 'M70 42l22 14-22 14z' }, 'red', { accent: true }),
    s('path', { d: 'M36 80h88', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M36 80h40', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: rects([[20, 110, 34, 24], [106, 110, 34, 24]]) }, 'gray'),
    s('rect', { x: 63, y: 106, width: 34, height: 30, rx: 2 }, 'orange')
  ],
  humo: [
    s('rect', { x: 96, y: 80, width: 20, height: 44 }, 'brown'),
    s('rect', { x: 92, y: 74, width: 28, height: 8, rx: 2 }, 'dark'),
    s('path', { d: 'M20 136L80 96l60 40z' }, 'red'),
    s('path', { d: dots([[106, 60]], 9) + dots([[96, 42]], 11) + dots([[112, 30]], 13) + dots([[92, 22]], 8) }, 'gray', { accent: true })
  ],
  'instrucción': [
    s('path', { d: 'M14 40q32-10 66 0v96q-34-10-66 0zM80 40q34-10 66 0v96q-32-10-66 0z' }, 'white'),
    s('path', { d: 'M14 40q32-10 66 0v96q-34-10-66 0zM80 40q34-10 66 0v96q-32-10-66 0z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[26, 50], [92, 50]], 5) }, 'orange'),
    s('path', { d: rects([[24, 62, 22, 14], [52, 96, 22, 14]]) }, 'blue'),
    arrow('M38 82l14 10', 'orange', 4),
    s('path', { d: rects([[100, 74, 28, 14], [100, 90, 28, 14]]) }, 'blue', { accent: true }),
    s('path', { d: 'M100 118l6 6 12-12', ...SW(4) }, 'green', { stroke: true })
  ],
  'integración': [
    s('path', { d: 'M80 30h50v50H80z' + dots([[105, 80]], 9) }, 'red'),
    s('path', { d: 'M30 80h50v50H30z' + dots([[80, 105]], 9) }, 'green'),
    s('path', { d: 'M30 30h50v50H30z' + dots([[80, 55], [55, 80]], 9) }, 'blue'),
    s('path', { d: 'M88 88h50v50H88z' }, 'yellow', { accent: true }),
    s('path', { d: 'M136 70l10-10M144 82l4-4', ...SW(3) }, 'gray', { stroke: true })
  ],
  'judío': [
    backdrop('navy'),
    s('path', { d: 'M80 126V60M80 100q-40 0-40-40M80 100q40 0 40-40M80 92q-26 0-26-32M80 92q26 0 26-32M80 84q-12 0-12-24M80 84q12 0 12-24', ...SW(5) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M56 136h48l-8-10H64z' }, 'yellow'),
    s('path', { d: [40, 54, 68, 80, 92, 106, 120].map(x => drop(x, 50, 4)).join('') }, 'orange')
  ],
  levantar: [
    ground(),
    ...person(80, 136, 'blue'),
    s('path', { d: 'M68 98L60 52M92 98l8-46', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 50, y: 22, width: 60, height: 30, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: 'M80 22v30', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M30 80V50m-7 7l7-7 7 7M130 80V50m-7 7l7-7 7 7', ...SW(4) }, 'green', { stroke: true })
  ],
  leyenda: [
    s('path', { d: 'M14 112q34-12 66 0q32-12 66 0v24q-34-12-66 0q-32-12-66 0z' }, 'brown'),
    s('path', { d: 'M20 108q30-10 60 2q30-12 60-2v20q-30-10-60 2q-30-12-60-2z' }, 'cream'),
    s('path', { d: 'M50 108V64h8v-8h8v8h8V48h12v16h8v-8h8v8h8v44z' }, 'purple', { accent: true }),
    s('path', { d: 'M74 108v-14a6 6 0 0 1 12 0v14z' }, 'navy'),
    s('path', { d: sparkle(30, 46, 10) + sparkle(130, 40, 12) + sparkle(124, 80, 7) }, 'yellow')
  ],
  link: [
    s('rect', { x: 22, y: 70, width: 64, height: 32, rx: 16, ...SW(10), transform: 'rotate(-30 54 86)' }, 'blue', { stroke: true, accent: true }),
    s('rect', { x: 64, y: 46, width: 64, height: 32, rx: 16, ...SW(10), transform: 'rotate(-30 96 62)' }, 'sky', { stroke: true }),
    s('path', { d: 'M106 92v40l10-10 8 16 8-4-8-16h14z' }, 'dark')
  ],
  oficialmente: [
    s('rect', { x: 24, y: 40, width: 80, height: 100, rx: 4 }, 'cream'),
    s('path', { d: 'M24 40h80v100H24zM34 54h60M34 66h60M34 78h40', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 78, cy: 112, r: 16 }, 'red', { accent: true }),
    s('path', { d: star(78, 112, 8) }, 'white'),
    s('path', { d: 'M118 20h20v8l-4 4v20h12v12h-36V52h12V32l-4-4z' }, 'brown'),
    s('rect', { x: 110, y: 64, width: 36, height: 6, rx: 2 }, 'red')
  ],
  paciencia: [
    s('path', { d: 'M46 28h36q0 30-14 46q14 16 14 46H46q0-30 14-46q-14-16-14-46z' }, 'sky'),
    s('path', { d: 'M54 52h20q-4 14-10 20q-6-6-10-20zM50 120q14-22 28 0z' }, 'yellow', { accent: true }),
    s('path', { d: 'M64 74v34', ...SW(2) }, 'yellow', { stroke: true }),
    s('path', { d: 'M40 24v100M88 24v100', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M34 24h60M34 124h60', ...SW(8) }, 'brown', { stroke: true }),
    s('rect', { x: 100, y: 126, width: 46, height: 8, rx: 4 }, 'tan'),
    s('path', { d: 'M140 128l4-14', ...SW(4) }, 'tan', { stroke: true }),
    s('circle', { cx: 120, cy: 116, r: 14 }, 'orange'),
    s('path', { d: 'M114 116a6 6 0 1 1 6 6', ...SW(3) }, 'brown', { stroke: true })
  ],
  patio: [
    s('rect', { x: 14, y: 30, width: 132, height: 84 }, 'cream'),
    s('path', { d: 'M14 30h132l-6-12H20z' }, 'orange'),
    s('path', { d: 'M22 114V70a12 12 0 0 1 24 0v44zM114 114V70a12 12 0 0 1 24 0v44z' }, 'brown'),
    s('rect', { x: 14, y: 114, width: 132, height: 26 }, 'tan'),
    s('path', { d: 'M80 118V86', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: dots([[72, 86], [88, 86], [80, 80]], 4) }, 'sky'),
    s('path', { d: 'M50 116h60q-4 16-30 16q-26 0-30-16z' }, 'blue', { accent: true }),
    s('path', { d: dots([[34, 108], [126, 108]], 10) }, 'green')
  ],
  perdido: [
    ground(),
    s('path', { d: 'M120 136V40', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M98 44h38l8 7-8 7H98zM142 68h-38l-8 7 8 7h38z' }, 'tan'),
    ...person(52, 136, 'green'),
    s('path', { d: 'M30 90l14-6 14 6 14-6v26l-14 6-14-6-14 6z' }, 'cream', { accent: true }),
    s('path', { d: 'M44 84v26M58 90v26', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 52q8-10 16 0q2 8-8 10', ...SW(3) }, 'purple', { stroke: true })
  ],
  pico: [
    s('path', { d: 'M24 132h106', ...SW(6) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 62, cy: 96, rx: 24, ry: 34 }, 'black'),
    s('circle', { cx: 68, cy: 60, r: 18 }, 'black'),
    s('circle', { cx: 72, cy: 76, r: 11 }, 'cream'),
    s('circle', { cx: 74, cy: 56, r: 5 }, 'sky'),
    s('path', { d: 'M82 48q46-6 60 18q-30 6-60 6z' }, 'orange', { accent: true }),
    s('path', { d: 'M128 52q10 6 14 14h-14z' }, 'red')
  ],
  pm: [
    backdrop('sky'),
    s('path', { d: 'M14 120h132v14a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green'),
    s('path', { d: 'M24 120a56 56 0 0 1 112 0', ...DASH(3) }, 'white', { stroke: true }),
    s('circle', { cx: 120, cy: 80, r: 14 }, 'orange', { accent: true }),
    s('circle', { cx: 40, cy: 44, r: 18 }, 'white'),
    s('circle', { cx: 40, cy: 44, r: 18, ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M40 44h10M40 44V32', ...SW(3) }, 'dark', { stroke: true })
  ],
  presidencial: [
    s('path', { d: 'M30 136V24M130 136V24', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 26h28v30H30zM130 26h-28v30h28z' }, 'blue'),
    s('path', { d: 'M30 36h28M30 46h28M102 36h28M102 46h28', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M52 72h56l-6 64H58z' }, 'brown', { accent: true }),
    s('circle', { cx: 80, cy: 98, r: 14 }, 'yellow'),
    s('path', { d: star(80, 98, 7) }, 'navy'),
    s('path', { d: 'M74 72l-6-14M86 72l6-14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[67, 56], [93, 56]], 4) }, 'dark')
  ],
  saco: [
    s('path', { d: 'M56 46q-4 10 4 14q-32 24-28 54q4 22 48 22q44 0 48-22q4-30-28-54q8-4 4-14q-24 6-48 0z' }, 'tan', { accent: true }),
    s('path', { d: 'M56 46l6-10 8 8 10-10 10 10 8-8 6 10z' }, 'tan'),
    s('path', { d: 'M58 60h44', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 64, y: 96, width: 22, height: 18, rx: 2, transform: 'rotate(-8 75 105)' }, 'brown'),
    s('path', { d: dots([[122, 132], [134, 128], [140, 136]], 5) }, 'yellow')
  ],
  urbano: [
    backdrop('navy'),
    s('circle', { cx: 122, cy: 34, r: 10 }, 'cream'),
    s('path', { d: rects([[22, 70, 26, 76], [74, 50, 26, 96], [120, 80, 20, 66]]) }, 'purple'),
    s('path', { d: rects([[44, 40, 32, 106], [98, 64, 26, 82]]) }, 'blue'),
    s('path', { d: rects([[50, 50, 6, 8], [64, 50, 6, 8], [50, 66, 6, 8], [64, 82, 6, 8], [50, 98, 6, 8], [64, 114, 6, 8], [104, 74, 6, 8], [114, 90, 6, 8], [104, 106, 6, 8], [28, 80, 6, 8], [28, 104, 6, 8], [82, 60, 6, 8], [126, 94, 6, 8]]) }, 'yellow', { accent: true })
  ],
  acontecimiento: [
    s('path', { d: rays(118, 30, 5, 18, 10), ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: rays(42, 30, 4, 14, 8), ...SW(3) }, 'orange', { stroke: true }),
    s('rect', { x: 28, y: 56, width: 104, height: 84, rx: 6 }, 'white'),
    s('rect', { x: 28, y: 56, width: 104, height: 84, rx: 6, ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 28, y: 56, width: 104, height: 18, rx: 6 }, 'blue'),
    s('path', { d: rects(Array.from({ length: 12 }, (_, k) => [38 + (k % 4) * 24, 82 + Math.floor(k / 4) * 18, 16, 12])) }, 'gray'),
    s('path', { d: ring(94, 106, 13), ...SW(4) }, 'red', { stroke: true, accent: true })
  ],
  adecuado: [
    s('rect', { x: 20, y: 84, width: 120, height: 48, rx: 6 }, 'brown'),
    s('path', { d: 'M34 98h22v22H34z' + dots([[80, 109]], 11) + 'M114 98l12 22h-24z' }, 'dark'),
    s('rect', { x: 33, y: 46, width: 24, height: 24, rx: 2 }, 'blue', { accent: true }),
    arrow('M45 74v14m-6-6l6 6 6-6', 'green', 4),
    s('path', { d: 'M104 44l8 8 16-18', ...SW(6) }, 'green', { stroke: true })
  ],
  'aparición': [
    backdrop('navy'),
    s('path', { d: 'M44 130V74a36 36 0 0 1 72 0v56l-12-10-12 10-12-10-12 10-12-10-12 10z' }, 'white', { accent: true }),
    s('path', { d: dots([[68, 76], [92, 76]], 6) }, 'dark'),
    s('ellipse', { cx: 80, cy: 98, rx: 6, ry: 8 }, 'dark'),
    s('path', { d: sparkle(28, 40, 10) + sparkle(132, 36, 12) + sparkle(130, 110, 8) }, 'yellow')
  ],
  'autorización': [
    s('path', { d: 'M56 74V50a22 22 0 0 1 44 0v4', ...SW(10) }, 'gray', { stroke: true }),
    s('rect', { x: 40, y: 72, width: 80, height: 62, rx: 8 }, 'yellow'),
    s('path', { d: dots([[80, 96]], 7) + 'M76 98h8l2 18h-12z' }, 'dark'),
    s('circle', { cx: 126, cy: 40, r: 16 }, 'green', { accent: true }),
    s('path', { d: 'M118 40l6 6 10-11', ...SW(5) }, 'white', { stroke: true })
  ],
  avenida: [
    s('path', { d: 'M14 50h132v84a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'mint'),
    s('path', { d: 'M66 50h28l52 96H14z' }, 'gray'),
    s('path', { d: 'M78 50h4l8 96H70z' }, 'green'),
    s('path', { d: 'M30 104v20M130 104v20M48 72v12M112 72v12', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: dots([[30, 94], [130, 94]], 12) + dots([[48, 64], [112, 64]], 8) }, 'green', { accent: true })
  ],
  aventura: [
    backdrop('sky'),
    s('path', { d: 'M14 130L58 56l24 34 22-44 42 84z' }, 'gray'),
    s('path', { d: 'M14 120h132v14a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green'),
    s('path', { d: 'M40 146q30-10 20-30q-8-18 26-28q16-8 18-36', ...DASH(3, '4 6') }, 'white', { stroke: true }),
    s('path', { d: 'M104 46V22', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M104 22h18l-5 6 5 6h-18z' }, 'red', { accent: true })
  ],
  'básico': [
    ground(),
    s('path', { d: rects([[26, 102, 34, 34], [63, 102, 34, 34], [100, 102, 34, 34]]) }, 'navy', { accent: true }),
    s('path', { d: rects([[44, 65, 34, 34], [82, 65, 34, 34]]) }, 'blue'),
    s('rect', { x: 63, y: 28, width: 34, height: 34 }, 'sky')
  ],
  cobertura: [
    s('rect', { x: 30, y: 40, width: 52, height: 96, rx: 8 }, 'dark'),
    s('rect', { x: 36, y: 50, width: 40, height: 74, rx: 3 }, 'sky'),
    s('path', { d: rects([[42, 104, 6, 10], [52, 96, 6, 18], [62, 86, 6, 28]]) }, 'green', { accent: true }),
    s('path', { d: 'M96 60q14 12 0 24M108 50q22 22 0 44M120 40q30 32 0 64', ...SW(5) }, 'blue', { stroke: true })
  ],
  colombiano: [
    s('rect', { x: 14, y: 20, width: 132, height: 56, rx: 6 }, 'yellow'),
    s('rect', { x: 14, y: 76, width: 132, height: 28 }, 'blue'),
    s('path', { d: 'M14 104h132v22a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6z' }, 'red'),
    s('path', { d: 'M98 96q14 0 14 10q0 10-14 10', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M54 88h44v24q0 18-22 18q-22 0-22-18z' }, 'white'),
    s('ellipse', { cx: 76, cy: 88, rx: 22, ry: 5 }, 'brown', { accent: true }),
    s('path', { d: 'M68 76q-6-8 0-16M84 76q-6-8 0-16', ...SW(3) }, 'brown', { stroke: true })
  ],
  conforme: [
    s('rect', { x: 98, y: 76, width: 16, height: 46, rx: 3 }, 'blue', { accent: true }),
    s('rect', { x: 50, y: 72, width: 52, height: 52, rx: 12 }, 'skin'),
    s('rect', { x: 52, y: 28, width: 18, height: 54, rx: 9 }, 'skin'),
    s('path', { d: 'M72 88h26M72 100h26M72 112h26', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M114 36l8 8 16-18', ...SW(6) }, 'green', { stroke: true })
  ],
  desgracia: [
    s('ellipse', { cx: 110, cy: 64, rx: 28, ry: 38 }, 'sky'),
    s('path', { d: 'M110 64l-14-22M110 64l18-14M110 64l-6 30M110 64l20 18M110 64l-24 6', ...SW(2) }, 'white', { stroke: true }),
    s('ellipse', { cx: 110, cy: 64, rx: 28, ry: 38, ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M74 130q16 0 12-20', ...SW(5) }, 'black', { stroke: true }),
    s('path', { d: 'M30 136q-4-40 22-54q26 14 22 54z' }, 'black'),
    s('path', { d: dots([[52, 72]], 14) + 'M40 66l2-18 10 10zM64 66l-2-18-10 10z' }, 'black'),
    s('path', { d: dots([[46, 72], [58, 72]], 3) }, 'yellow', { accent: true })
  ],
  detener: [
    s('path', { d: 'M80 102v36', ...SW(6) }, 'gray', { stroke: true }),
    s('polygon', { points: '120.6,78.8 96.8,102.6 63.2,102.6 39.4,78.8 39.4,45.2 63.2,21.4 96.8,21.4 120.6,45.2' }, 'red', { accent: true }),
    s('polygon', { points: '115.1,76.5 94.5,97.1 65.5,97.1 44.9,76.5 44.9,47.5 65.5,26.9 94.5,26.9 115.1,47.5', ...SW(3) }, 'white', { stroke: true }),
    s('rect', { x: 66, y: 52, width: 28, height: 32, rx: 8 }, 'white'),
    s('path', { d: 'M70 54V38M78 52V34M86 52V36M92 56V44M68 72l-8-8', ...SW(6) }, 'white', { stroke: true })
  ],
  enfoque: [
    s('path', { d: 'M24 46V24h22M136 46V24h-22M24 114v22h22M136 114v22h-22', ...SW(5) }, 'dark', { stroke: true }),
    ...flower(80, 64, 'pink')
  ],
  entrenador: [
    ground(),
    ...person(66, 136, 'red'),
    s('path', { d: 'M54 74a12 12 0 0 1 24 0h10v4H54z' }, 'navy'),
    s('path', { d: 'M58 92l8 12 8-12', ...SW(2) }, 'white', { stroke: true }),
    s('rect', { x: 60, y: 102, width: 14, height: 8, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M80 106h16', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 94, y: 84, width: 32, height: 40, rx: 3 }, 'brown'),
    s('rect', { x: 98, y: 90, width: 24, height: 30, rx: 2 }, 'cream'),
    s('path', { d: 'M102 98h16M102 106h16M102 114h10', ...SW(2) }, 'gray', { stroke: true })
  ],
  'evaluación': [
    s('rect', { x: 16, y: 44, width: 128, height: 72, rx: 8 }, 'white'),
    s('rect', { x: 16, y: 44, width: 128, height: 72, rx: 8, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: [36, 58, 80, 102].map(x => star(x, 70, 11)).join('') }, 'yellow', { accent: true }),
    s('path', { d: star(124, 70, 11) }, 'gray'),
    s('path', { d: 'M30 100h100', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 100h80', ...SW(6) }, 'green', { stroke: true })
  ],
  'explotación': [
    s('path', { d: 'M14 136V80q30-50 66-50q36 0 66 50v56z' }, 'brown'),
    s('path', { d: 'M50 136V92a30 30 0 0 1 60 0v44z' }, 'dark'),
    s('path', { d: 'M52 136V92M108 136V92M48 90h64', ...SW(6) }, 'tan', { stroke: true }),
    s('path', { d: dots([[68, 104], [80, 100], [92, 104]], 7) }, 'yellow', { accent: true }),
    s('path', { d: 'M58 106h44l-6 22H64z' }, 'gray'),
    s('path', { d: dots([[68, 130], [92, 130]], 5) }, 'black')
  ],
  habitual: [
    arrow('M38 80a42 42 0 0 1 72-30M106 38l4 12-12-4', 'blue', 6),
    arrow('M122 80a42 42 0 0 1-72 30M62 114l-12-4 4 12', 'blue', 6),
    s('path', { d: 'M64 70h32v18q0 14-16 14q-16 0-16-14z' }, 'brown', { accent: true }),
    s('path', { d: 'M96 76q8 0 8 6q0 6-8 6', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M74 62q-4-6 0-12M86 62q-4-6 0-12', ...SW(3) }, 'gray', { stroke: true })
  ],
  'identificación': [
    s('rect', { x: 16, y: 36, width: 128, height: 88, rx: 8 }, 'white'),
    s('rect', { x: 16, y: 36, width: 128, height: 88, rx: 8, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M16 52v-8a8 8 0 0 1 8-8h112a8 8 0 0 1 8 8v8z' }, 'navy', { accent: true }),
    s('rect', { x: 28, y: 62, width: 40, height: 50, rx: 4 }, 'sky'),
    s('circle', { cx: 48, cy: 82, r: 9 }, 'skin'),
    s('path', { d: 'M34 112v-6a14 14 0 0 1 28 0v6z' }, 'blue'),
    s('path', { d: 'M80 70h52M80 84h52M80 98h36', ...SW(5) }, 'gray', { stroke: true })
  ],
  incremento: [
    s('path', { d: 'M18 136h126', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: rects([[28, 106, 20, 30], [56, 88, 20, 48], [84, 68, 20, 68]]) }, 'blue'),
    s('rect', { x: 112, y: 44, width: 20, height: 92 }, 'orange'),
    arrow('M22 90L66 62l18 10 44-46m-16 0h16v16', 'green', 6)
  ],
  limpieza: [
    s('path', { d: 'M32 88q23-30 46 0', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 90h50l-6 46H36z' }, 'blue'),
    s('rect', { x: 26, y: 84, width: 58, height: 8, rx: 3 }, 'navy'),
    s('path', { d: 'M122 24L102 118', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M86 116h34l6 20H80z' }, 'gray'),
    s('path', { d: sparkle(56, 40, 12) + sparkle(30, 58, 7) + sparkle(138, 108, 8) }, 'yellow', { accent: true })
  ],
  mencionar: [
    ground(),
    ...person(44, 136, 'orange'),
    s('ellipse', { cx: 50, cy: 82, rx: 4, ry: 3 }, 'dark'),
    s('path', { d: 'M76 22h60a8 8 0 0 1 8 8v40a8 8 0 0 1-8 8h-40l-14 14 2-14h-8a8 8 0 0 1-8-8V30a8 8 0 0 1 8-8z' }, 'sky', { accent: true }),
    s('circle', { cx: 106, cy: 40, r: 9 }, 'skin'),
    s('path', { d: busts([106], 72, 24, 20) }, 'purple')
  ],
  na: [
    s('path', { d: ring(80, 30, 13), ...DASH(3, '4 4') }, 'gray', { stroke: true }),
    s('path', { d: 'M64 100l-20-6-6-14M96 100l20-6 6-14', ...SW(6) }, 'skin', { stroke: true }),
    ...person(80, 136, 'green', { accent: true }),
    s('path', { d: dots([[38, 76], [122, 76]], 7) }, 'skin'),
    s('path', { d: 'M74 84h12', ...SW(2) }, 'dark', { stroke: true })
  ],
  nave: [
    backdrop('navy'),
    s('path', { d: dots([[30, 36], [124, 30], [132, 74], [28, 96], [120, 124], [36, 132]], 2.5) }, 'white'),
    s('path', { d: 'M64 96h32l-16 36z' }, 'orange'),
    s('path', { d: 'M58 76l-16 26h16zM102 76l16 26h-16z' }, 'red', { accent: true }),
    s('path', { d: 'M80 20q24 24 22 76H58q-2-52 22-76z' }, 'white'),
    s('circle', { cx: 80, cy: 60, r: 9 }, 'sky')
  ],
  'obligación': [
    s('rect', { x: 34, y: 18, width: 80, height: 112, rx: 4 }, 'cream'),
    s('path', { d: 'M34 18h80v112H34zM46 34h56M46 46h56M46 58h40M46 116q6-8 12 0q6 8 12 0', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 100L142 72', ...DASH(8, '10 6') }, 'dark', { stroke: true }),
    s('path', { d: 'M70 82v-8a10 10 0 0 1 20 0v8', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 64, y: 80, width: 32, height: 26, rx: 4 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 92, r: 4 }, 'dark')
  ],
  observar: [
    backdrop('navy'),
    s('path', { d: 'M80 80l-24 56M80 80v56M80 80l24 56', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 40, y: 62, width: 80, height: 20, rx: 4, transform: 'rotate(-30 80 72)' }, 'white'),
    s('rect', { x: 110, y: 58, width: 14, height: 28, rx: 3, transform: 'rotate(-30 80 72)' }, 'red', { accent: true }),
    s('path', { d: star(126, 30, 8) + star(36, 36, 6) + star(132, 108, 5) }, 'yellow')
  ],
  pacto: [
    s('rect', { x: 46, y: 16, width: 68, height: 84, rx: 4 }, 'cream'),
    s('path', { d: 'M46 16h68v84H46zM56 32h48M56 44h48M56 56h32', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 100, cy: 82, r: 8 }, 'red', { accent: true }),
    s('path', { d: 'M14 112l30-10 8 22-30 10z' }, 'blue'),
    s('path', { d: 'M146 112l-30-10-8 22 30 10z' }, 'navy'),
    s('path', { d: 'M44 104q36-14 72 0l-6 22q-30 10-60 0z' }, 'skin'),
    s('path', { d: 'M66 104v18M78 102v20M90 104v18', ...SW(3) }, 'tan', { stroke: true })
  ],
  preso: [
    backdrop('gray'),
    ...person(80, 136, 'orange', { accent: true }),
    s('path', { d: 'M72 90q8-4 16 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M34 14v132M58 14v132M102 14v132M126 14v132M14 56h132', ...SW(6) }, 'dark', { stroke: true })
  ],
  profundidad: [
    backdrop('sky'),
    s('rect', { x: 14, y: 40, width: 132, height: 50 }, 'blue'),
    s('path', { d: 'M14 90h132v44a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'navy'),
    s('path', { d: 'M46 30h40l-6 10H52z' }, 'brown'),
    s('path', { d: 'M66 40v70', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M66 110v20M56 122q10 12 20 0M60 112h12', ...SW(4) }, 'cream', { stroke: true }),
    s('path', { d: 'M120 46v86m-8-8l8 8 8-8M112 46h16', ...SW(4) }, 'yellow', { stroke: true, accent: true })
  ],
  prohibido: [
    s('circle', { cx: 80, cy: 80, r: 54 }, 'white'),
    s('path', { d: dots([[80, 52]], 10) + 'M76 66h8q8 0 8 8v28q0 8-8 8h-8q-8 0-8-8V74q0-8 8-8z' }, 'dark'),
    s('circle', { cx: 80, cy: 80, r: 54, ...SW(12) }, 'red', { stroke: true }),
    s('path', { d: 'M42 42l76 76', ...SW(12) }, 'red', { stroke: true, accent: true })
  ],
  'realización': [
    s('path', { d: dots([[42, 42]], 24) + dots([[28, 74]], 6) + dots([[22, 88]], 4) }, 'sky'),
    s('path', { d: star(42, 42, 14), ...DASH(2.5, '3 3') }, 'purple', { stroke: true }),
    arrow('M66 64q20-10 26 12', 'orange', 5),
    s('path', { d: 'M94 82h-8q0 14 12 16M134 82h8q0 14-12 16', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M92 76h44v14q0 22-22 22q-22 0-22-22z' }, 'yellow', { accent: true }),
    s('path', { d: 'M110 110h8v12h10v8h-28v-8h10z' }, 'orange'),
    s('path', { d: star(114, 90, 7) }, 'orange')
  ],
  renuncia: [
    s('path', { d: 'M56 92q-16-22 0-36q12 18 0 36zM62 92q4-26 22-28q-2 20-22 28z' }, 'green'),
    s('rect', { x: 84, y: 66, width: 20, height: 28, rx: 2, transform: 'rotate(10 94 80)' }, 'navy'),
    s('path', { d: 'M38 92h72l-6 44H44z' }, 'tan', { accent: true }),
    s('rect', { x: 104, y: 24, width: 40, height: 28, rx: 3 }, 'white'),
    s('path', { d: 'M104 24h40v28h-40zM104 26l20 14 20-14', ...SW(3) }, 'gray', { stroke: true }),
    arrow('M96 46l-14 10', 'orange', 3)
  ],
  'revisión': [
    s('rect', { x: 20, y: 20, width: 84, height: 116, rx: 4 }, 'cream'),
    s('path', { d: 'M20 20h84v116H20zM32 38h60M32 52h60M32 66h60M32 80h40M32 94h60M32 108h50', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 96, cy: 86, r: 22, opacity: 0.7 }, 'sky'),
    s('path', { d: 'M86 86l7 7 12-14', ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('circle', { cx: 96, cy: 86, r: 22, ...SW(8) }, 'navy', { stroke: true }),
    s('path', { d: 'M112 102l24 24', ...SW(10) }, 'navy', { stroke: true })
  ],
  'transición': [
    s('path', { d: dots([[24, 118], [36, 114], [48, 118]], 8) }, 'green'),
    s('circle', { cx: 60, cy: 110, r: 9 }, 'green'),
    s('circle', { cx: 63, cy: 107, r: 2.5 }, 'dark'),
    arrow('M64 90q12-22 30-20', 'orange', 5),
    s('path', { d: 'M112 70q-24-30-28-6q2 12 28 6zM112 70q24-30 28-6q-2 12-28 6z' }, 'purple', { accent: true }),
    s('path', { d: 'M112 72q-18 2-18 16q8 6 18-14zM112 72q18 2 18 16q-8 6-18-14z' }, 'pink'),
    s('path', { d: 'M112 58v28M112 58l-6-10M112 58l6-10', ...SW(3) }, 'dark', { stroke: true })
  ],
  alerta: [
    s('path', { d: 'M80 40V22M44 56l-12-12M116 56l12-12M30 86H14M130 86h16', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M54 106V82a26 26 0 0 1 52 0v24z' }, 'red', { accent: true }),
    s('path', { d: 'M66 84a14 14 0 0 1 10-14', ...SW(4) }, 'pink', { stroke: true }),
    s('rect', { x: 46, y: 106, width: 68, height: 20, rx: 4 }, 'dark')
  ],
  aprendizaje: [
    s('path', { d: 'M18 136V112h30V88h30V64h30V40h30v96z' }, 'tan'),
    ...person(63, 88, 'green', { h: 28, w: 20, r: 9 }),
    s('path', { d: 'M110 40l14-6 14 6v-14l-14-6-14 6z' }, 'blue'),
    s('circle', { cx: 36, cy: 46, r: 14 }, 'yellow', { accent: true }),
    s('rect', { x: 30, y: 58, width: 12, height: 10, rx: 2 }, 'gray'),
    s('path', { d: 'M36 26v-8M18 34l-4-4M54 34l4-4', ...SW(3) }, 'orange', { stroke: true })
  ],
  'básicamente': [
    s('circle', { cx: 44, cy: 40, r: 9 }, 'red'),
    s('path', { d: 'M72 22l10 18H62z' }, 'blue'),
    s('rect', { x: 96, y: 28, width: 16, height: 16 }, 'yellow'),
    s('path', { d: 'M30 60h100l-38 40v22H68v-22z' }, 'gray'),
    s('path', { d: 'M30 60h100', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 136, r: 8 }, 'green', { accent: true })
  ],
  pai: [
    ground(),
    ...person(56, 136, 'navy', { h: 52 }),
    s('path', { d: 'M42 56h28v4H42zM48 56V36h16v20z' }, 'dark'),
    s('path', { d: 'M48 50h16', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M70 104q14 6 24 10', ...SW(5) }, 'skin', { stroke: true }),
    ...person(104, 136, 'orange', { h: 28, w: 20, r: 9 }),
    s('path', { d: heart(84, 66, 9) }, 'red', { accent: true })
  ],
  'eléctrico': [
    s('path', { d: 'M80 28V16M54 40l-8-8M106 40l8-8M44 64H32M116 64h12', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M66 92q-16-10-16-28a30 30 0 0 1 60 0q0 18-16 28z' }, 'yellow', { accent: true }),
    s('path', { d: 'M86 44l-12 18h12l-10 18', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: rects([[66, 92, 28, 8], [68, 102, 24, 8]]) }, 'gray'),
    s('path', { d: 'M72 112h16l-4 8h-8z' }, 'dark')
  ],
  previo: [
    s('path', { d: rects([[66, 52, 32, 40], [110, 52, 32, 40]]) }, 'gray'),
    s('rect', { x: 18, y: 46, width: 40, height: 52, rx: 3 }, 'blue', { accent: true }),
    s('circle', { cx: 126, cy: 72, r: 6 }, 'red'),
    arrow('M132 30H32m10-10L32 30l10 10', 'orange', 5),
    s('path', { d: 'M20 118h122', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[38, 118], [82, 118], [126, 118]], 5) }, 'dark')
  ],
  carmen: [
    backdrop('sky'),
    s('path', { d: 'M14 118q66-14 132 0v16a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green'),
    s('path', { d: dots([[40, 76], [62, 70]], 15) }, 'green'),
    s('path', { d: dots([[34, 72], [46, 80], [58, 66], [68, 76]], 3.5) }, 'orange'),
    s('rect', { x: 84, y: 58, width: 46, height: 28 }, 'white'),
    s('path', { d: 'M80 60l27-18 27 18z' }, 'orange', { accent: true }),
    s('rect', { x: 22, y: 84, width: 116, height: 40, rx: 2 }, 'white'),
    s('path', { d: 'M44 124v-16a8 8 0 0 1 16 0v16zM100 64h10v12h-10z' }, 'brown')
  ],
  casado: [
    s('circle', { cx: 64, cy: 92, r: 28, ...SW(9) }, 'yellow', { stroke: true, accent: true }),
    s('circle', { cx: 96, cy: 92, r: 28, ...SW(9) }, 'orange', { stroke: true }),
    s('path', { d: 'M88 60l8-10 8 10-8 8z' }, 'sky'),
    s('path', { d: heart(80, 34, 10) }, 'red')
  ],
  caza: [
    s('path', { d: 'M40 24q44 56 0 112', ...SW(6) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M40 24v112', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 80h80', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M114 72l14 8-14 8z' }, 'gray'),
    s('path', { d: 'M34 80l-8-8M34 80l-8 8', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: prints([[106, 128], [118, 128], [126, 110], [138, 110]]) }, 'tan')
  ],
  combustible: [
    s('path', { d: 'M92 70q24 0 24 30v18', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 36, y: 30, width: 56, height: 106, rx: 6 }, 'red', { accent: true }),
    s('rect', { x: 46, y: 42, width: 36, height: 24, rx: 3 }, 'sky'),
    s('path', { d: 'M48 84h32M48 96h32', ...SW(4) }, 'white', { stroke: true }),
    s('rect', { x: 30, y: 128, width: 68, height: 10, rx: 3 }, 'dark'),
    s('path', { d: 'M108 116h16l8-8 5 5-9 11h-20z' }, 'dark'),
    s('path', { d: drop(130, 60, 9) }, 'orange')
  ],
  curiosidad: [
    s('path', { d: 'M26 84l-10-16M134 84l10-16', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: dots([[80, 82]], 26) + 'M58 70V40l22 16zM102 70V40L80 56z' }, 'orange'),
    s('path', { d: dots([[70, 74], [90, 74]], 7) }, 'white'),
    s('path', { d: dots([[71, 75], [91, 75]], 3.5) }, 'dark'),
    s('rect', { x: 26, y: 84, width: 108, height: 54, rx: 3 }, 'tan'),
    s('path', { d: sparkle(124, 36, 11) + sparkle(36, 44, 7) }, 'yellow', { accent: true })
  ],
  deportivo: [
    s('path', { d: 'M20 116V84q0-4 4-4h14q6 12 20 12l30 8q18 4 22 16z' }, 'blue', { accent: true }),
    s('rect', { x: 16, y: 114, width: 98, height: 10, rx: 4 }, 'gray'),
    s('path', { d: 'M44 92l8-6M52 96l8-6M60 98l8-6', ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 122, cy: 58, r: 20 }, 'white'),
    s('circle', { cx: 122, cy: 58, r: 20, ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M122 50l8 6-3 9h-10l-3-9z' }, 'dark')
  ],
  describir: [
    s('rect', { x: 24, y: 22, width: 96, height: 116, rx: 4 }, 'white'),
    s('rect', { x: 24, y: 22, width: 96, height: 116, rx: 4, ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 34, y: 32, width: 76, height: 40, rx: 3 }, 'sky'),
    s('path', { d: 'M34 72l22-24 16 16 10-10 28 18z' }, 'green'),
    s('circle', { cx: 98, cy: 42, r: 5 }, 'yellow'),
    s('path', { d: 'M36 86h70M36 98h70M36 110h50', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 118, y: 64, width: 10, height: 62, rx: 3, transform: 'rotate(25 123 95)' }, 'orange', { accent: true })
  ],
  diversidad: [
    s('path', { d: busts([26], 136, 24, 40) }, 'red', { accent: true }),
    s('path', { d: busts([53], 136, 24, 48) }, 'blue'),
    s('path', { d: busts([80], 136, 24, 44) }, 'yellow'),
    s('path', { d: busts([107], 136, 24, 50) }, 'green'),
    s('path', { d: busts([134], 136, 24, 38) }, 'purple'),
    s('path', { d: dots([[26, 84], [107, 74]], 11) }, 'skin'),
    s('path', { d: dots([[53, 76], [134, 86]], 11) }, 'tan'),
    s('circle', { cx: 80, cy: 80, r: 11 }, 'brown')
  ],
  ejercer: [
    ground(),
    ...person(54, 136, 'navy'),
    s('rect', { x: 22, y: 106, width: 22, height: 18, rx: 3 }, 'brown'),
    s('path', { d: 'M28 106v-4h10v4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M114 136V48M98 136h32M90 56h48', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M90 56l-8 20M90 56l8 20M138 56l-8 20M138 56l8 20', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 76h20a10 6 0 0 1-20 0zM128 76h20a10 6 0 0 1-20 0z' }, 'yellow', { accent: true })
  ],
  emperador: [
    ground(),
    s('path', { d: 'M60 90h40l16 46H44z' }, 'red'),
    ...person(80, 136, 'purple', { accent: true }),
    s('path', { d: 'M66 66V48l7 8 7-12 7 12 7-8v18z' }, 'yellow'),
    s('rect', { x: 62, y: 90, width: 36, height: 8, rx: 4 }, 'white'),
    s('path', { d: 'M100 116l14-44', ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 116, cy: 66, r: 6 }, 'red')
  ],
  ensayo: [
    backdrop('navy'),
    s('path', { d: 'M80 14l-36 110h72z', opacity: 0.35 }, 'yellow'),
    s('rect', { x: 14, y: 122, width: 132, height: 24, rx: 4 }, 'brown'),
    ...person(80, 124, 'blue'),
    s('rect', { x: 92, y: 84, width: 18, height: 24, rx: 2 }, 'white'),
    s('path', { d: 'M14 28h24q-4 50 6 94H14zM146 28h-24q4 50-6 94h30z' }, 'red', { accent: true }),
    s('rect', { x: 14, y: 14, width: 132, height: 14, rx: 4 }, 'red')
  ],
  escapar: [
    s('path', { d: 'M30 132V70a30 30 0 0 1 60 0v26M30 132h18M45 132V50M60 132V40M75 132V50M60 40V26', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M90 96l20-6v34l-20 8', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 24, y: 130, width: 72, height: 8, rx: 3 }, 'brown'),
    s('ellipse', { cx: 122, cy: 58, rx: 13, ry: 9 }, 'blue', { accent: true }),
    s('path', { d: 'M120 56l-8-18 18 12z' }, 'sky'),
    s('path', { d: 'M134 54l9 3-9 4z' }, 'orange'),
    s('path', { d: 'M104 74l-10 4M106 84l-10 2', ...SW(3) }, 'gray', { stroke: true })
  ],
  estabilidad: [
    ground(),
    s('ellipse', { cx: 80, cy: 122, rx: 48, ry: 14 }, 'gray'),
    s('ellipse', { cx: 80, cy: 96, rx: 36, ry: 12 }, 'tan'),
    s('ellipse', { cx: 80, cy: 74, rx: 26, ry: 10 }, 'gray'),
    s('ellipse', { cx: 80, cy: 56, rx: 15, ry: 8 }, 'orange', { accent: true }),
    s('path', { d: 'M80 16v28', ...DASH(3, '4 5') }, 'green', { stroke: true })
  ],
  exclusivamente: [
    s('path', { d: 'M30 132V74M130 132V74', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: rects([[20, 130, 20, 8], [120, 130, 20, 8]]) + dots([[30, 72], [130, 72]], 7) }, 'orange'),
    s('path', { d: 'M30 80q50 40 100 0', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M56 56V28l12 12 12-18 12 18 12-12v28z' }, 'yellow'),
    s('path', { d: dots([[68, 48], [80, 46], [92, 48]], 3) }, 'red')
  ],
  expresar: [
    s('circle', { cx: 66, cy: 96, r: 38 }, 'skin'),
    s('path', { d: 'M46 88q6-8 12 0M74 88q6-8 12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 104h36q0 20-18 20q-18 0-18-20z' }, 'dark'),
    s('path', { d: heart(112, 34, 13) }, 'red', { accent: true }),
    s('path', { d: star(134, 74, 11) }, 'yellow'),
    s('path', { d: sparkle(88, 26, 9) }, 'orange')
  ],
  fallo: [
    s('circle', { cx: 66, cy: 88, r: 46 }, 'red', { accent: true }),
    s('circle', { cx: 66, cy: 88, r: 33 }, 'white'),
    s('circle', { cx: 66, cy: 88, r: 20 }, 'red'),
    s('circle', { cx: 66, cy: 88, r: 8 }, 'white'),
    s('path', { d: burst(126, 40, 12, 6, 7) }, 'gray'),
    s('path', { d: 'M126 40L144 22', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M138 16l10-2-2 10z' }, 'blue')
  ],
  fundador: [
    ground(),
    s('path', { d: 'M86 22l26-16 26 16v26H86z', ...DASH(3, '5 4') }, 'blue', { stroke: true }),
    ...person(48, 136, 'navy'),
    s('path', { d: 'M60 100l18-4', ...SW(6) }, 'skin', { stroke: true }),
    s('ellipse', { cx: 110, cy: 136, rx: 26, ry: 10 }, 'brown'),
    s('path', { d: 'M72 76l20 50', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: 'M86 122l14-6 6 14q-8 6-14 2z' }, 'gray', { accent: true })
  ],
  garantizar: [
    s('path', { d: sparkle(30, 34, 9) + sparkle(132, 40, 7) }, 'yellow'),
    s('path', { d: 'M80 18l48 16v38q0 40-48 62q-48-22-48-62V34z' }, 'green', { accent: true }),
    s('path', { d: 'M80 30l36 12v30q0 30-36 48q-36-18-36-48V42z', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: 'M60 76l14 14 28-30', ...SW(8) }, 'white', { stroke: true })
  ],
  hondura: [
    backdrop('sky'),
    s('path', { d: 'M62 60h36l10 86H52z' }, 'black'),
    s('path', { d: 'M14 60h50l-8 86H26a12 12 0 0 1-12-12zM146 60H96l8 86h30a12 12 0 0 0 12-12z' }, 'brown'),
    s('path', { d: 'M14 60h50M96 60h50', ...SW(6) }, 'green', { stroke: true }),
    s('circle', { cx: 80, cy: 84, r: 6 }, 'gray', { accent: true }),
    s('path', { d: 'M80 98v32m-7-7l7 7 7-7', ...SW(3) }, 'white', { stroke: true })
  ],
  incendio: [
    s('path', { d: dots([[120, 34]], 12) + dots([[134, 20]], 8) }, 'gray'),
    s('rect', { x: 30, y: 60, width: 76, height: 76 }, 'gray'),
    s('path', { d: rects([[40, 76, 16, 16], [80, 76, 16, 16], [40, 108, 16, 16]]) }, 'sky'),
    s('rect', { x: 80, y: 108, width: 16, height: 16 }, 'orange'),
    s('path', { d: 'M44 64q-12-22 6-40q0 16 10 18q2-18 18-26q-4 20 8 32q6-10 4-18q18 18 2 34z' }, 'orange', { accent: true }),
    s('path', { d: 'M58 64q-4-12 6-20q2 8 8 8q2-8 8-12q4 14-2 24z' }, 'red'),
    s('path', { d: 'M84 110q-6-10 4-20q2 8 6 8q2-6 6-10q4 14-4 22z' }, 'red')
  ],
  investigador: [
    ground(),
    ...person(46, 136, 'white'),
    outline({ x: 31, y: 92, width: 30, height: 44, rx: 10 }),
    s('path', { d: 'M38 76h16', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 92, y: 128, width: 44, height: 8, rx: 3 }, 'dark'),
    s('path', { d: 'M128 128V88q0-14-14-14M98 108h32', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 102, y: 46, width: 13, height: 44, rx: 3, transform: 'rotate(-20 108 68)' }, 'blue', { accent: true }),
    s('path', { d: 'M60 104l24 -4', ...SW(6) }, 'skin', { stroke: true })
  ],
  investigar: [
    s('path', { d: prints([[24, 132], [40, 122], [30, 104], [46, 94]]) }, 'brown'),
    s('circle', { cx: 100, cy: 70, r: 28, opacity: 0.7 }, 'sky'),
    s('path', { d: ells([[100, 64, 8, 12]]) + dots([[100, 84]], 5) }, 'brown', { accent: true }),
    s('circle', { cx: 100, cy: 70, r: 28, ...SW(8) }, 'navy', { stroke: true }),
    s('path', { d: 'M120 90l22 22', ...SW(10) }, 'navy', { stroke: true })
  ],
  'manifestación': [
    s('path', { d: 'M40 96V50M80 92V44M120 96V50', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: rects([[22, 26, 36, 26], [102, 26, 36, 26]]) }, 'yellow'),
    s('rect', { x: 60, y: 16, width: 40, height: 28 }, 'red', { accent: true }),
    s('path', { d: busts([24, 52, 80, 108, 136], 140, 24, 26) }, 'blue'),
    s('path', { d: dots([[24, 103], [52, 103], [80, 103], [108, 103], [136, 103]], 10) }, 'skin')
  ],
  originalmente: [
    s('rect', { x: 64, y: 18, width: 72, height: 90, rx: 4 }, 'gray'),
    s('rect', { x: 46, y: 32, width: 72, height: 90, rx: 4 }, 'cream'),
    s('rect', { x: 46, y: 32, width: 72, height: 90, rx: 4, ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 26, y: 48, width: 72, height: 90, rx: 4 }, 'orange', { accent: true }),
    s('rect', { x: 34, y: 56, width: 56, height: 74, rx: 2 }, 'sky'),
    s('path', { d: 'M34 130v-26l18-18 14 14 10-8 14 14v24z' }, 'green'),
    s('circle', { cx: 76, cy: 72, r: 7 }, 'yellow')
  ],
  paja: [
    s('rect', { x: 18, y: 72, width: 86, height: 64, rx: 8 }, 'yellow', { accent: true }),
    s('path', { d: 'M26 88h70M26 104h70M26 120h70', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M44 72v64M78 72v64', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M126 112L140 46', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M126 112L140 46', ...SW(5, { 'stroke-dasharray': '5 5', 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('path', { d: 'M110 82h32l-4 54h-24z', opacity: 0.8 }, 'sky')
  ],
  palo: [
    s('ellipse', { cx: 80, cy: 136, rx: 52, ry: 5 }, 'gray'),
    s('path', { d: 'M86 76l16 6', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 82q14-6 22 6q-12 8-22-6z' }, 'green'),
    s('path', { d: 'M28 124L132 30', ...SW(14) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M44 116l10-10M70 92l8-8M108 58l8-8', ...SW(2) }, 'tan', { stroke: true })
  ],
  radical: [
    s('ellipse', { cx: 80, cy: 140, rx: 26, ry: 5 }, 'dark'),
    s('path', { d: 'M80 40v42', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M80 64q-24-6-28-28q22 0 28 28zM80 56q20-8 26-30q-22 2-26 30z' }, 'green'),
    s('ellipse', { cx: 80, cy: 88, rx: 18, ry: 10 }, 'brown'),
    s('path', { d: 'M80 96v32M80 104l-14 14M80 108l14 14M70 116l-8 12M90 118l8 10', ...SW(3) }, 'tan', { stroke: true, accent: true }),
    s('path', { d: 'M126 120V40m-9 9l9-9 9 9', ...SW(5) }, 'orange', { stroke: true })
  ],
  relato: [
    backdrop('navy'),
    s('path', { d: dots([[30, 30], [124, 26], [138, 54], [70, 22]], 2) }, 'white'),
    s('path', { d: 'M62 132l36-10M62 122l36 10', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 124q-18-6-12-28q6 8 10 8q-2-16 10-28q2 20 10 26q8 16-10 22z' }, 'orange', { accent: true }),
    s('path', { d: 'M80 122q-8-4-4-14q4 4 6 4q2-6 6-8q4 12-4 18z' }, 'yellow'),
    s('path', { d: busts([34], 140, 26, 34) }, 'blue'),
    s('path', { d: busts([126], 140, 26, 34) }, 'purple'),
    s('path', { d: dots([[34, 94], [126, 94]], 11) }, 'skin')
  ],
  requisito: [
    s('rect', { x: 18, y: 34, width: 36, height: 26, rx: 3 }, 'blue'),
    s('path', { d: dots([[28, 45]], 5) + 'M38 44h10M38 52h10' }, 'white'),
    s('rect', { x: 64, y: 28, width: 30, height: 36, rx: 2 }, 'sky'),
    s('path', { d: dots([[79, 40]], 6) + busts([79], 64, 18, 14) }, 'purple'),
    s('rect', { x: 106, y: 28, width: 32, height: 38, rx: 2 }, 'cream'),
    s('path', { d: 'M106 28h32v38h-32zM112 40h20M112 50h20M26 92h20v20H26zM70 92h20v20H70zM112 92h20v20h-20z', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 102l6 6 8-12M74 102l6 6 8-12', ...SW(4) }, 'green', { stroke: true, accent: true })
  ],
  revisar: [
    ground(),
    ...person(40, 136, 'purple'),
    s('path', { d: 'M52 100l24-14', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 90, cy: 72, r: 14, opacity: 0.7 }, 'sky'),
    s('path', { d: ring(90, 72, 14) + 'M80 82l-6 6', ...SW(5) }, 'navy', { stroke: true }),
    s('rect', { x: 100, y: 102, width: 40, height: 34, rx: 3 }, 'tan', { accent: true }),
    s('path', { d: 'M120 102v34', ...SW(5) }, 'brown', { stroke: true })
  ],
  roca: [
    s('ellipse', { cx: 80, cy: 136, rx: 64, ry: 5 }, 'gray'),
    s('path', { d: 'M22 136q-4-40 22-62q20-26 52-18q34 6 42 40q6 22-4 40z' }, 'gray', { accent: true }),
    s('path', { d: 'M48 82q14-14 30-14', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M96 70l-6 18 10 10M58 112l14 8', ...SW(3) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 140, cy: 132, rx: 7, ry: 5 }, 'tan')
  ],
  salto: [
    s('ellipse', { cx: 80, cy: 136, rx: 20, ry: 4 }, 'gray'),
    s('path', { d: 'M74 82l-8 14 8 8M86 82l10 12-4 10', ...SW(7) }, 'navy', { stroke: true }),
    s('path', { d: 'M70 54l-14-14M90 54l14-14', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 68, y: 48, width: 24, height: 36, rx: 8 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 34, r: 11 }, 'skin'),
    s('path', { d: 'M58 114v10M80 112v14M102 114v10', ...SW(3) }, 'gray', { stroke: true })
  ],
  universitario: [
    s('path', { d: 'M46 68v24q34 16 68 0V68l-34 14z' }, 'dark'),
    s('path', { d: 'M80 30l62 26-62 26-62-26z' }, 'black'),
    s('path', { d: 'M80 56l40 14v26', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M116 96h8l2 14h-12z' }, 'yellow', { accent: true }),
    s('rect', { x: 34, y: 116, width: 92, height: 18, rx: 9 }, 'cream'),
    s('rect', { x: 34, y: 116, width: 92, height: 18, rx: 9, ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 74, y: 114, width: 12, height: 22 }, 'red')
  ],
  abuso: [
    ground(),
    ...person(80, 136, 'blue', { h: 28, w: 22, r: 9 }),
    s('path', { d: 'M80 12v20', ...SW(22, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 30h80v26q0 12-12 12H52q-12 0-12-12z' }, 'gray'),
    s('path', { d: 'M60 44v18M80 44v18M100 44v18', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 72v20m-6-6l6 6 6-6M130 72v20m-6-6l6 6 6-6', ...SW(4) }, 'red', { stroke: true, accent: true })
  ],
  ambiental: [
    s('circle', { cx: 74, cy: 86, r: 48 }, 'blue'),
    s('path', { d: 'M48 62q14-10 24 2q6 12-6 18q-12 4-10 18q-14-6-16-22q0-10 8-16zM90 100q14-6 22 6q-2 14-16 18q-10-10-6-24z' }, 'green'),
    s('path', { d: 'M108 50q4-30 36-36q2 34-36 36z' }, 'green', { accent: true }),
    s('path', { d: 'M110 48l26-26', ...SW(2) }, 'mint', { stroke: true })
  ],
  asco: [
    s('path', { d: 'M44 28q6-6 0-12M80 24q6-6 0-12M116 28q6-6 0-12', ...SW(3) }, 'green', { stroke: true }),
    s('circle', { cx: 80, cy: 88, r: 48 }, 'mint'),
    s('circle', { cx: 80, cy: 88, r: 48, ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M54 72l14 6-14 6M106 72l-14 6 14 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 110q0 18 9 18q9 0 9-18z' }, 'pink', { accent: true }),
    s('path', { d: 'M56 108q6-6 12 0q6 6 12 0q6-6 12 0q6 6 12 0', ...SW(4) }, 'dark', { stroke: true })
  ],
  'bolívar': [
    s('rect', { x: 14, y: 40, width: 128, height: 74, rx: 6 }, 'orange', { accent: true }),
    s('rect', { x: 20, y: 46, width: 116, height: 62, rx: 4, ...SW(2) }, 'cream', { stroke: true }),
    s('path', { d: ells([[50, 77, 20, 24]]) }, 'cream'),
    s('path', { d: busts([50], 100, 26, 16) }, 'navy'),
    s('circle', { cx: 50, cy: 72, r: 9 }, 'brown'),
    s('path', { d: 'M86 62h40M86 76h40M86 90h24', ...SW(4) }, 'cream', { stroke: true }),
    s('circle', { cx: 128, cy: 120, r: 16 }, 'yellow'),
    s('circle', { cx: 128, cy: 120, r: 16, ...SW(2) }, 'orange', { stroke: true })
  ],
  cartel: [
    s('rect', { x: 18, y: 36, width: 124, height: 100 }, 'brown'),
    s('path', { d: bricks }, 'tan'),
    s('rect', { x: 42, y: 24, width: 76, height: 104, rx: 2 }, 'white'),
    s('rect', { x: 50, y: 32, width: 60, height: 54 }, 'purple'),
    s('path', { d: star(80, 59, 16) }, 'yellow'),
    s('path', { d: 'M52 100h56M52 112h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 26l12 6M124 26l-12 6', ...SW(7) }, 'yellow', { stroke: true, accent: true })
  ],
  castigo: [
    s('path', { d: 'M20 20l60 30v90H20z' }, 'cream'),
    s('path', { d: 'M140 20l-60 30v90h60z' }, 'tan'),
    s('path', { d: 'M66 140v-18M94 140v-18M58 122h44', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: busts([80], 122, 30, 32) }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'brown'),
    s('path', { d: dots([[67, 82], [93, 82]], 3) }, 'skin')
  ],
  ceremonia: [
    s('path', { d: 'M24 136V60M136 136V60', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 68q56 16 112 0', ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M80 76l-16-12v24zM80 76l16-12v24zM80 76l-8 22M80 76l8 22' }, 'red'),
    s('path', { d: 'M70 112l24-30M70 112l30-18', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: ring(62, 120, 7) + ring(56, 108, 7), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: dots([[40, 30], [120, 28], [100, 44], [58, 42]], 4) }, 'blue'),
    s('path', { d: dots([[80, 24], [130, 46], [32, 48]], 4) }, 'yellow')
  ],
  chileno: [
    s('path', { d: 'M14 136l34-46 18 22 26-38 24 34 14-14 16 18v24z' }, 'gray'),
    s('path', { d: 'M40 30v106', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 40, y: 30, width: 92, height: 28 }, 'white'),
    s('rect', { x: 40, y: 58, width: 92, height: 28 }, 'red', { accent: true }),
    s('rect', { x: 40, y: 30, width: 30, height: 28 }, 'blue'),
    s('path', { d: star(55, 44, 8) }, 'white'),
    s('rect', { x: 40, y: 30, width: 92, height: 56, ...SW(2) }, 'gray', { stroke: true })
  ],
  computadora: [
    s('rect', { x: 22, y: 22, width: 116, height: 78, rx: 6 }, 'dark'),
    s('rect', { x: 30, y: 30, width: 100, height: 62, rx: 2 }, 'sky', { accent: true }),
    s('path', { d: rects([[38, 38, 40, 26], [84, 38, 38, 10], [84, 54, 38, 10], [38, 70, 84, 14]]) }, 'white'),
    s('path', { d: 'M80 100v14M56 116h48', ...SW(7) }, 'dark', { stroke: true }),
    s('rect', { x: 26, y: 124, width: 108, height: 14, rx: 3 }, 'gray'),
    s('path', { d: 'M34 131h92', ...DASH(4, '6 3') }, 'white', { stroke: true })
  ],
  conducta: [
    s('rect', { x: 18, y: 28, width: 124, height: 104, rx: 6 }, 'cream'),
    s('path', { d: 'M18 28h124v104H18zM18 80h124M56 28v104M98 28v104', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[37, 54], [77, 54], [120, 54], [37, 106], [77, 106]], 13) }, 'yellow', { accent: true }),
    s('path', { d: dots([[32, 50], [42, 50], [72, 50], [82, 50], [115, 50], [125, 50], [32, 102], [42, 102], [72, 102], [82, 102]], 2) }, 'dark'),
    s('path', { d: 'M31 58q6 6 12 0M71 58q6 6 12 0M114 58q6 6 12 0M31 110q6 6 12 0M71 110q6 6 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: star(120, 106, 14) }, 'orange')
  ],
  confiar: [
    s('path', { d: heart(80, 38, 16) }, 'red'),
    s('rect', { x: 10, y: 98, width: 18, height: 30, rx: 3 }, 'navy'),
    s('path', { d: 'M24 100q16-6 30-6h34q12 2 18 14l28-6q10-2 12 4q2 6-6 10l-40 14q-36 8-76-4z' }, 'skin'),
    s('path', { d: ring(64, 84, 10) + 'M74 84h34M100 84v9M108 84v9', ...SW(6) }, 'yellow', { stroke: true, accent: true })
  ],
  cortar: [
    s('rect', { x: 16, y: 72, width: 100, height: 64, rx: 3 }, 'sky'),
    s('path', { d: 'M18 104h90', ...DASH(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M110 104L78 92M110 104L78 116', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 104l10-8M110 104l10 8' + ring(128, 90, 9) + ring(128, 118, 9), ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M40 48l6-12M60 40l2-14M82 46l8-10', ...SW(3) }, 'orange', { stroke: true })
  ],
  cubierta: [
    s('rect', { x: 36, y: 22, width: 92, height: 118, rx: 4 }, 'cream'),
    s('rect', { x: 32, y: 18, width: 90, height: 118, rx: 4 }, 'navy', { accent: true }),
    s('rect', { x: 32, y: 18, width: 14, height: 118, rx: 4 }, 'blue'),
    s('circle', { cx: 84, cy: 64, r: 20, ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: star(84, 64, 11) }, 'yellow'),
    s('path', { d: 'M62 102h44M70 114h28', ...SW(4) }, 'yellow', { stroke: true })
  ],
  derrota: [
    ground(),
    s('path', { d: 'M60 136V24', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M60 26q20-8 40 0q20 8 40 0v40q-20 8-40 0q-20-8-40 0z' }, 'white', { accent: true }),
    s('path', { d: 'M60 26q20-8 40 0q20 8 40 0v40q-20 8-40 0q-20-8-40 0z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 130l26-6M98 130l30-2', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 120v18', ...SW(6) }, 'orange', { stroke: true })
  ],
  dieta: [
    s('circle', { cx: 70, cy: 76, r: 50 }, 'white'),
    s('circle', { cx: 70, cy: 76, r: 50, ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 70, cy: 76, r: 36 }, 'mint'),
    s('path', { d: dots([[58, 66], [78, 62], [66, 86], [86, 84], [52, 84]], 11) }, 'green'),
    s('path', { d: dots([[60, 98], [84, 70], [70, 72]], 6) }, 'red', { accent: true }),
    s('path', { d: 'M136 30v94M130 30v18q0 8 6 8q6 0 6-8V30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M16 140q60-14 128-4', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'yellow', { stroke: true }),
    s('path', { d: 'M16 140q60-14 128-4', ...SW(10, { 'stroke-linecap': 'butt', 'stroke-dasharray': '2 8' }) }, 'dark', { stroke: true })
  ],
  establecimiento: [
    s('rect', { x: 22, y: 40, width: 116, height: 96 }, 'cream'),
    s('rect', { x: 18, y: 28, width: 124, height: 14, rx: 3 }, 'brown'),
    s('path', { d: 'M22 54h116l-6 20H28z' }, 'red', { accent: true }),
    s('path', { d: 'M38 54h12l-1 20H37zM62 54h12v20H62zM86 54h12l1 20H86zM110 54h12l2 20h-12z' }, 'white'),
    s('rect', { x: 34, y: 88, width: 48, height: 34, rx: 2 }, 'sky'),
    s('rect', { x: 94, y: 88, width: 30, height: 48, rx: 2 }, 'brown'),
    s('rect', { x: 18, y: 134, width: 124, height: 6, rx: 2 }, 'gray')
  ],
  'fórmula': [
    s('path', { d: 'M70 24v40L36 124q-4 12 8 12h72q12 0 8-12L90 64V24z' }, 'white'),
    s('path', { d: 'M52 96h56l16 28q4 12-8 12H44q-12 0-8-12z' }, 'purple', { accent: true }),
    s('path', { d: 'M70 24v40L36 124q-4 12 8 12h72q12 0 8-12L90 64V24M64 24h32', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[64, 112], [90, 118], [78, 104]], 4) }, 'white'),
    s('path', { d: dots([[82, 50], [74, 34], [114, 30], [124, 48]], 4) }, 'pink')
  ],
  gracioso: [
    s('circle', { cx: 80, cy: 82, r: 52 }, 'skin'),
    s('path', { d: 'M52 70q8-10 16 0M92 70q8-10 16 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 88h64q0 36-32 36q-32 0-32-36z' }, 'dark'),
    s('path', { d: 'M64 114q16-12 32 0q-16 10-32 0z' }, 'red'),
    s('path', { d: drop(36, 86, 6) + drop(124, 86, 6) }, 'sky', { accent: true })
  ],
  'ilusión': [
    ground(),
    ...person(52, 136, 'green'),
    s('path', { d: 'M64 100l8-6', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M108 70q-8 18-36 26', ...SW(2) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 108, cy: 46, rx: 20, ry: 24 }, 'red', { accent: true }),
    s('path', { d: 'M108 70l-4 6h8z' }, 'red'),
    s('path', { d: sparkle(70, 30, 10) + sparkle(140, 80, 7) + sparkle(138, 20, 6) }, 'yellow')
  ],
  instante: [
    s('rect', { x: 66, y: 22, width: 20, height: 12, rx: 3 }, 'navy'),
    s('circle', { cx: 76, cy: 88, r: 48 }, 'navy'),
    s('circle', { cx: 76, cy: 88, r: 38 }, 'white'),
    s('path', { d: 'M76 88V50a38 38 0 0 1 14 3z' }, 'sky'),
    s('path', { d: 'M76 88l8-30', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M138 18l-14 24h10l-8 22 20-28h-10l8-18z' }, 'yellow', { accent: true })
  ],
  lanzar: [
    ground(),
    ...lean(52, 136, -10, 'blue'),
    s('path', { d: 'M48 98l-14-26', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M64 30q40-20 70 10', ...DASH(3, '5 5') }, 'gray', { stroke: true }),
    s('path', { d: 'M100 40l36 24', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M136 64l-12-2 6-8z' }, 'dark', { accent: true }),
    s('path', { d: 'M84 46l-10 6M88 58l-12 4', ...SW(3) }, 'orange', { stroke: true })
  ],
  'lágrima': [
    s('circle', { cx: 72, cy: 86, r: 48 }, 'skin'),
    s('path', { d: 'M48 70l14 4M96 70l-14 4', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[58, 84], [86, 84]], 4) }, 'dark'),
    s('path', { d: 'M58 116q14-12 28 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: drop(124, 96, 14) }, 'blue', { accent: true }),
    s('path', { d: drop(92, 104, 6) }, 'sky')
  ],
  mama: [
    ground(),
    ...lady(70, 136, 'pink'),
    s('ellipse', { cx: 86, cy: 98, rx: 20, ry: 12 }, 'cream'),
    s('circle', { cx: 100, cy: 94, r: 8 }, 'skin'),
    s('path', { d: 'M62 100q14 12 40 6', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: heart(118, 50, 12) }, 'red', { accent: true })
  ],
  medalla: [
    s('path', { d: 'M50 14h22l18 50H68zM110 14H88L70 64h22z' }, 'blue'),
    s('path', { d: 'M70 14h20l-10 30z' }, 'red'),
    s('circle', { cx: 80, cy: 98, r: 38 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 98, r: 28, ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: star(80, 98, 16) }, 'orange')
  ],
  multitud: [
    s('path', { d: busts([20, 44, 68, 92, 116, 140], 96, 22, 22) }, 'purple'),
    s('path', { d: dots([[20, 66], [44, 66], [68, 66], [92, 66], [116, 66], [140, 66]], 9) }, 'tan'),
    s('path', { d: busts([32, 56, 80, 104, 128], 118, 22, 22) }, 'blue', { accent: true }),
    s('path', { d: dots([[32, 88], [56, 88], [80, 88], [104, 88], [128, 88]], 9) }, 'skin'),
    s('path', { d: busts([20, 44, 68, 92, 116, 140], 140, 22, 22) }, 'red'),
    s('path', { d: dots([[20, 110], [44, 110], [68, 110], [92, 110], [116, 110], [140, 110]], 9) }, 'brown')
  ],
  nuclear: [
    s('ellipse', { cx: 80, cy: 80, rx: 62, ry: 22, ...SW(4) }, 'blue', { stroke: true }),
    s('ellipse', { cx: 80, cy: 80, rx: 62, ry: 22, transform: 'rotate(60 80 80)', ...SW(4) }, 'blue', { stroke: true }),
    s('ellipse', { cx: 80, cy: 80, rx: 62, ry: 22, transform: 'rotate(-60 80 80)', ...SW(4) }, 'blue', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'red', { accent: true }),
    s('path', { d: dots([[142, 80], [49, 26.3], [49, 133.7]], 6) }, 'orange')
  ],
  numerar: [
    s('path', { d: rects([[16, 52, 36, 50], [62, 52, 36, 50], [108, 52, 36, 50]]) }, 'cream'),
    s('path', { d: 'M16 52h36v50H16zM62 52h36v50H62zM108 52h36v50h-36z', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 34, cy: 77, r: 6 }, 'red', { accent: true }),
    s('path', { d: dots([[72, 68], [88, 86]], 6) }, 'blue'),
    s('path', { d: dots([[118, 66], [126, 77], [134, 88]], 6) }, 'green'),
    arrow('M24 122h110m-10-8l10 8-10 8', 'orange', 5)
  ],
  'ocupación': [
    s('path', { d: 'M28 76a32 32 0 0 1 64 0z' }, 'yellow', { accent: true }),
    s('rect', { x: 20, y: 74, width: 80, height: 10, rx: 4 }, 'orange'),
    s('path', { d: 'M60 44v30', ...SW(4) }, 'orange', { stroke: true }),
    s('rect', { x: 36, y: 100, width: 64, height: 40, rx: 5 }, 'brown'),
    s('path', { d: 'M56 100v-8h24v8M36 116h64', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M112 136l24-60', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M130 74a12 12 0 1 1 16 8l-6-4z' }, 'gray')
  ],
  organizar: [
    s('rect', { x: 20, y: 18, width: 120, height: 122, rx: 4 }, 'brown'),
    s('path', { d: rects([[26, 24, 108, 34], [26, 64, 108, 34], [26, 104, 108, 30]]) }, 'cream'),
    s('path', { d: rects([[30, 30, 10, 28], [42, 30, 10, 28], [54, 30, 10, 28]]) }, 'red', { accent: true }),
    s('path', { d: rects([[66, 30, 10, 28], [78, 30, 10, 28], [90, 30, 10, 28]]) }, 'blue'),
    s('path', { d: rects([[30, 74, 30, 24], [66, 74, 30, 24], [102, 74, 28, 24]]) }, 'tan'),
    s('path', { d: rects([[30, 110, 46, 24], [82, 110, 48, 24]]) }, 'green')
  ],
  'pacífico': [
    backdrop('sky'),
    s('path', { d: 'M14 108h132v26a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'blue'),
    s('path', { d: 'M30 122q10-4 20 0M90 128q10-4 20 0', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M50 66q20-8 40 2l22-26q2 22-14 36q10 2 20-4q-8 16-30 14q-22 4-38-22z' }, 'white', { accent: true }),
    s('path', { d: 'M52 66l-12 2 10 4z' }, 'orange'),
    s('path', { d: 'M44 72q-12 8-16 18M38 80l-8-2M34 86l-8 2', ...SW(3) }, 'green', { stroke: true })
  ],
  pelota: [
    s('ellipse', { cx: 86, cy: 138, rx: 26, ry: 4 }, 'gray'),
    s('circle', { cx: 86, cy: 82, r: 42 }, 'white'),
    s('path', { d: 'M86 40a42 42 0 0 1 36 20L86 82z' }, 'red', { accent: true }),
    s('path', { d: 'M122 104a42 42 0 0 1-36 20V82zM50 104a42 42 0 0 1 0-42L86 82z' }, 'blue'),
    s('path', { d: 'M50 62a42 42 0 0 1 36-22v42zM86 124a42 42 0 0 1-36-20L86 82zM122 60a42 42 0 0 1 0 44L86 82z' }, 'yellow'),
    s('circle', { cx: 86, cy: 82, r: 42, ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 60h-12M28 80H14M30 100h-12', ...SW(3) }, 'gray', { stroke: true })
  ],
  pendiente: [
    s('path', { d: 'M20 96h88l8 40H12z' }, 'gray'),
    s('rect', { x: 30, y: 60, width: 70, height: 40, rx: 2, transform: 'rotate(-6 65 80)' }, 'white'),
    s('rect', { x: 30, y: 60, width: 70, height: 40, rx: 2, transform: 'rotate(-6 65 80)', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 26, y: 76, width: 76, height: 30, rx: 2 }, 'cream'),
    s('circle', { cx: 120, cy: 46, r: 24 }, 'orange', { accent: true }),
    s('circle', { cx: 120, cy: 46, r: 18 }, 'white'),
    s('path', { d: 'M120 46V34M120 46l8 6', ...SW(3) }, 'dark', { stroke: true })
  ],
  porno: [
    s('rect', { x: 18, y: 26, width: 110, height: 80, rx: 6 }, 'dark'),
    s('path', { d: rects([[26, 34, 24, 21], [74, 34, 24, 21], [50, 55, 24, 21], [98, 55, 22, 21], [26, 76, 24, 22], [74, 76, 24, 22]]) }, 'pink'),
    s('path', { d: rects([[50, 34, 24, 21], [98, 34, 22, 21], [26, 55, 24, 21], [74, 55, 24, 21], [50, 76, 24, 22], [98, 76, 22, 22]]) }, 'purple'),
    s('path', { d: 'M73 106v14M50 124h46', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M126 104v-8a12 12 0 0 1 24 0v8', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 120, y: 102, width: 28, height: 24, rx: 4 }, 'red', { accent: true })
  ],
  pre: [
    s('path', { d: 'M30 74a40 36 0 0 1 80 0z' }, 'green', { accent: true }),
    s('rect', { x: 22, y: 72, width: 96, height: 10, rx: 4 }, 'dark'),
    s('path', { d: 'M90 86q-30 0-36 26q-4 26 30 26q34 0 30-26q-6-26-24-26z' }, 'tan'),
    s('path', { d: 'M74 94h24', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: dots([[124, 122], [136, 112], [138, 130]], 8) }, 'yellow'),
    s('path', { d: ring(124, 122, 8) + ring(136, 112, 8) + ring(138, 130, 8), ...SW(2) }, 'orange', { stroke: true })
  ],
  previamente: [
    s('circle', { cx: 80, cy: 84, r: 46 }, 'white'),
    s('circle', { cx: 80, cy: 84, r: 46, ...SW(5) }, 'navy', { stroke: true }),
    s('path', { d: 'M80 84V56M80 84l-18 10', ...SW(4) }, 'dark', { stroke: true }),
    arrow('M40 30a60 60 0 0 1 80 0M32 18l8 12-14 4', 'orange', 6),
    s('path', { d: 'M80 84V38a46 46 0 0 0-32 13z', opacity: 0.6 }, 'sky', { accent: true })
  ],
  quita: [
    s('rect', { x: 26, y: 18, width: 76, height: 120, rx: 4 }, 'white'),
    s('path', { d: 'M26 18h76v120H26zM38 34h52M38 50h52', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 66h52M38 82h52M38 98h30M38 118h52', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M66 64h40v40H66z', }, 'white'),
    s('rect', { x: 98, y: 62, width: 26, height: 44, rx: 4, transform: 'rotate(35 111 84)' }, 'pink', { accent: true }),
    s('path', { d: 'M110 110l14 8M104 118l10 10', ...SW(3) }, 'gray', { stroke: true })
  ],
  ramo: [
    s('path', { d: 'M80 140V80M80 140l-18-56M80 140l18-56', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots([[60, 52], [100, 52]], 16) }, 'pink'),
    s('path', { d: dots([[80, 40]], 18) + dots([[50, 80], [110, 80]], 12) }, 'red'),
    s('path', { d: dots([[60, 52], [100, 52], [80, 40], [50, 80], [110, 80]], 5) }, 'yellow'),
    s('path', { d: 'M52 96h56l-20 40h-16z' }, 'purple', { accent: true }),
    s('path', { d: 'M80 112l-14-8v16zM80 112l14-8v16z' }, 'yellow')
  ],
  recomendar: [
    ground(),
    ...person(46, 136, 'orange'),
    s('path', { d: 'M58 100l26-14', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 92, y: 84, width: 38, height: 52, rx: 3 }, 'blue', { accent: true }),
    s('path', { d: 'M100 98h22M100 108h16', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: [92, 111, 130].map(x => star(x, 54, 9)).join('') }, 'yellow'),
    s('path', { d: 'M88 72l8-6M134 72l-8-6', ...SW(3) }, 'orange', { stroke: true })
  ],
  'recuperación': [
    s('path', { d: heart(66, 90, 30) }, 'red'),
    s('rect', { x: 36, y: 72, width: 60, height: 20, rx: 8, transform: 'rotate(-30 66 82)' }, 'tan'),
    s('path', { d: dots([[58, 82], [66, 82], [74, 82]], 2.5), transform: 'rotate(-30 66 82)' }, 'brown'),
    s('path', { d: 'M132 128V44m-12 12l12-12 12 12', ...SW(7) }, 'green', { stroke: true, accent: true })
  ],
  rueda: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'black'),
    s('circle', { cx: 80, cy: 80, r: 40 }, 'gray', { accent: true }),
    s('path', { d: rays(80, 80, 10, 38, 5, -90), ...SW(6) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'dark'),
    s('circle', { cx: 80, cy: 80, r: 62, ...DASH(4, '3 9') }, 'dark', { stroke: true })
  ],
  soledad: [
    backdrop('navy'),
    s('circle', { cx: 120, cy: 38, r: 14 }, 'cream'),
    s('path', { d: 'M14 128h132v6a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'dark'),
    s('path', { d: 'M48 128v-18M112 128v-18', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 40, y: 104, width: 80, height: 8, rx: 3 }, 'brown'),
    s('path', { d: busts([80], 104, 24, 30) }, 'purple', { accent: true }),
    s('circle', { cx: 80, cy: 68, r: 11 }, 'skin')
  ],
  sorprender: [
    s('path', { d: burst(80, 50, 34, 16, 12) }, 'yellow', { accent: true }),
    s('rect', { x: 36, y: 82, width: 88, height: 56, rx: 3 }, 'red'),
    s('path', { d: 'M74 82h12v56H74z' }, 'yellow'),
    s('rect', { x: 26, y: 60, width: 60, height: 14, rx: 3, transform: 'rotate(-25 30 74)' }, 'red'),
    s('path', { d: dots([[22, 30], [138, 34], [130, 70]], 4) }, 'blue'),
    s('path', { d: dots([[30, 52], [118, 20], [142, 54]], 4) }, 'green')
  ],
  supuestamente: [
    s('path', { d: busts([44], 140, 36, 44) }, 'blue'),
    s('circle', { cx: 44, cy: 80, r: 16 }, 'skin'),
    s('path', { d: busts([116], 140, 36, 44) }, 'green'),
    s('circle', { cx: 116, cy: 80, r: 16 }, 'skin'),
    s('path', { d: 'M58 86l8-4', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M50 18h60a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8H86l-8 10-4-10H50a8 8 0 0 1-8-8V26a8 8 0 0 1 8-8z', ...DASH(3, '5 4') }, 'purple', { stroke: true, accent: true }),
    s('path', { d: dots([[66, 36], [80, 36], [94, 36]], 4) }, 'gray')
  ],
  temor: [
    s('path', { d: 'M20 60l-6 8 6 8-6 8M140 60l6 8-6 8 6 8', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 82, r: 50 }, 'sky'),
    s('path', { d: dots([[62, 72], [98, 72]], 11) }, 'white'),
    s('path', { d: dots([[62, 74], [98, 74]], 5) }, 'dark'),
    s('path', { d: 'M58 108q6-6 11 0q6 6 11 0q6-6 11 0q6 6 11 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: drop(126, 52, 7) }, 'blue', { accent: true })
  ],
  ubicado: [
    s('path', { d: 'M14 46l40-14 52 14 40-14v86l-40 14-52-14-40 14z' }, 'mint'),
    s('path', { d: 'M54 32v86M106 46v86', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M20 100q40-30 60 0t60-10', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M80 98q-26-28-26-46a26 26 0 0 1 52 0q0 18-26 46z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 52, r: 10 }, 'white')
  ],
};
