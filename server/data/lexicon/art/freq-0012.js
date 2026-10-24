// Illustration specs for common words, batch 0012 (plus leftovers of 0011) (see server/scripts/lexicon/art.js)
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

module.exports = {
  promover: [
    ...lean(60, 136, 25, 'blue'),
    s('rect', { x: 100, y: 86, width: 40, height: 50, rx: 3 }, 'orange', { accent: true }),
    s('path', { d: 'M100 111h40M120 86v50', ...SW(3) }, 'brown', { stroke: true }),
    arrow('M100 62h36m-10-10l10 10-10 10', 'green'),
    ground()
  ],
  'raíz': [
    backdrop('sky'),
    s('path', { d: 'M14 76h132v58a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'brown'),
    s('path', { d: 'M80 78V44', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M80 52q-22-18-34-4q16 14 34 4zM80 44q20-22 34-8q-16 14-34 8z' }, 'green'),
    s('path', { d: 'M80 76v44M80 86q-14 10-26 12M80 92q14 8 28 8M80 104q-10 10-18 26M80 108q10 12 14 26M54 98q-8 4-10 12M108 100q8 4 10 12', ...SW(4) }, 'tan', { stroke: true, accent: true })
  ],
  repente: [
    s('path', { d: 'M44 96L22 74l6-6 22 22z' }, 'orange'),
    s('rect', { x: 44, y: 96, width: 72, height: 42, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M80 96l-12-6 24-6-24-6 24-6-12-6', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 50, r: 18 }, 'skin'),
    s('path', { d: 'M64 38l16-24 16 24z' }, 'yellow'),
    s('path', { d: dots([[74, 50], [86, 50]], 3) }, 'dark'),
    s('path', { d: 'M50 42l-10-4M110 42l10-4M48 56h-10M112 56h10', ...SW(3) }, 'orange', { stroke: true })
  ],
  rosario: [
    s('path', { d: ring(80, 60, 40) + 'M80 100v8', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: dots(beads, 5) }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 102, r: 6 }, 'pink'),
    s('path', { d: rects([[76, 110, 8, 32], [68, 118, 24, 8]]) }, 'brown'),
    s('path', { d: 'M126 46q-4 14-10 26', ...SW(3) }, 'green', { stroke: true }),
    s('circle', { cx: 130, cy: 28, r: 13 }, 'pink'),
    s('path', { d: 'M130 22a6 6 0 1 1-6 6a3 3 0 0 1 6 0', ...SW(2) }, 'red', { stroke: true })
  ],
  solicitud: [
    s('rect', { x: 30, y: 18, width: 88, height: 122, rx: 4 }, 'white'),
    outline({ x: 30, y: 18, width: 88, height: 122, rx: 4 }),
    s('rect', { x: 90, y: 28, width: 20, height: 24, rx: 2 }, 'sky'),
    s('path', { d: 'M40 34h40M40 46h40M40 66h68M40 80h68', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 96h12v12H40zM40 116h12v12H40zM60 102h40M60 122h30', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M41 101l5 5 9-12', ...SW(4) }, 'green', { stroke: true }),
    s('rect', { x: 120, y: 74, width: 10, height: 56, rx: 3, transform: 'rotate(30 125 102)' }, 'orange', { accent: true })
  ],
  'súper': [
    s('path', { d: dots([[56, 40], [74, 36]], 11) }, 'red'),
    s('rect', { x: 86, y: 18, width: 16, height: 30, rx: 2 }, 'sky'),
    s('rect', { x: 108, y: 14, width: 12, height: 38, rx: 6, transform: 'rotate(20 114 33)' }, 'tan'),
    s('path', { d: 'M30 46h104l-12 50H44z' }, 'blue', { accent: true }),
    s('path', { d: 'M60 46l4 50M86 46v50M112 46l-4 50M36 70h94', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M14 34h14l4 12M44 96l-4 16h86', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[52, 124], [116, 124]], 8) }, 'dark')
  ],
  testigo: [
    s('circle', { cx: 80, cy: 52, r: 12 }, 'skin'),
    s('rect', { x: 65, y: 66, width: 30, height: 40, rx: 10 }, 'blue'),
    s('path', { d: 'M92 76l16-26', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 109, cy: 46, r: 6 }, 'skin'),
    s('rect', { x: 40, y: 94, width: 80, height: 44 }, 'brown', { accent: true }),
    s('rect', { x: 34, y: 88, width: 92, height: 10, rx: 3 }, 'tan'),
    s('path', { d: 'M16 34q18-18 36 0q-18 18-36 0z' }, 'white'),
    s('path', { d: 'M16 34q18-18 36 0q-18 18-36 0z', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 34, cy: 34, r: 6 }, 'navy')
  ],
  'índice': [
    s('path', { d: 'M18 76q31-10 62 0q31-10 62 0v60q-31-10-62 0q-31-10-62 0z' }, 'cream'),
    s('path', { d: 'M80 76v60M18 76q31-10 62 0q31-10 62 0v60q-31-10-62 0q-31-10-62 0z', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M30 92h38M30 106h38M30 120h38M92 92h38M92 120h38', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M92 106h38', ...SW(6) }, 'orange', { stroke: true, accent: true }),
    s('rect', { x: 98, y: 40, width: 12, height: 58, rx: 6 }, 'skin'),
    s('rect', { x: 98, y: 22, width: 34, height: 36, rx: 10 }, 'skin'),
    s('path', { d: 'M112 40h18M112 50h18', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 100, y: 12, width: 30, height: 14, rx: 3 }, 'blue', { accent: true })
  ],
  am: [
    backdrop('sky'),
    s('path', { d: 'M40 40q0-10 12-10q4-8 14-4q10 0 10 10z' }, 'white'),
    s('circle', { cx: 80, cy: 110, r: 30 }, 'orange', { accent: true }),
    s('path', { d: 'M80 70V56M52 82l-10-10M108 82l10-10M42 104H28M118 104h14', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M14 110h132v24a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green')
  ],
  aparentemente: [
    backdrop('sky'),
    s('path', { d: 'M14 70h132v64a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'blue'),
    s('path', { d: 'M46 70h76l14 30-22 36H50l-24-34z' }, 'mint', { accent: true }),
    s('path', { d: 'M56 70l14-30 10 10 12-22 18 42z' }, 'white'),
    s('path', { d: 'M14 70h132', ...SW(3) }, 'white', { stroke: true })
  ],
  culpable: [
    ...person(54, 136, 'green'),
    s('path', { d: dots([[49, 80], [59, 80]], 2) }, 'dark'),
    s('path', { d: 'M48 88q6-4 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M72 58q6 8 0 12q-6-4 0-12z' }, 'sky'),
    s('path', { d: 'M94 136l6-22 12 4-4 18zM116 136l4-26 14 6-2 20zM104 104l10-8 8 8-10 6z' }, 'blue', { accent: true }),
    ground()
  ],
  'democrático': [
    s('path', { d: 'M30 106L24 56M92 100l6-54M130 106l6-50', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: dots([[40, 82], [120, 82], [80, 76]], 12) }, 'skin'),
    s('path', { d: dots([[24, 52], [98, 42], [136, 52]], 7) }, 'skin'),
    s('path', { d: busts([40, 120], 136, 28, 40) }, 'blue'),
    s('path', { d: busts([80], 136, 28, 46) }, 'green', { accent: true })
  ],
  'difusión': [
    s('path', { d: 'M84 40q12 20 0 40M102 28q20 32 0 64M122 18q26 42 0 84', ...DASH(3) }, 'sky', { stroke: true }),
    s('path', { d: dots([[84, 60], [96, 50], [96, 70], [110, 42], [112, 60], [110, 78], [126, 34], [130, 60], [126, 86], [140, 48], [140, 72]], 3.5) }, 'purple'),
    s('rect', { x: 22, y: 78, width: 46, height: 58, rx: 10 }, 'pink', { accent: true }),
    s('rect', { x: 37, y: 66, width: 16, height: 14 }, 'gray'),
    s('rect', { x: 30, y: 52, width: 30, height: 15, rx: 4 }, 'dark'),
    s('rect', { x: 58, y: 55, width: 12, height: 8, rx: 2 }, 'dark')
  ],
  documental: [
    s('rect', { x: 18, y: 22, width: 124, height: 90, rx: 8 }, 'dark'),
    s('rect', { x: 26, y: 30, width: 108, height: 74 }, 'sky'),
    s('path', { d: 'M26 104l34-40 22 22 18-14 34 32z' }, 'green'),
    s('circle', { cx: 112, cy: 48, r: 9 }, 'yellow'),
    s('circle', { cx: 40, cy: 42, r: 6 }, 'red', { accent: true }),
    s('path', { d: 'M80 112v18M56 136h48', ...SW(5) }, 'dark', { stroke: true })
  ],
  drama: [
    s('path', { d: 'M30 46q-12 10-6 26M134 70q12 10 6 26', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M32 40h52q0 44-26 56q-26-12-26-56z', transform: 'rotate(-12 58 70)' }, 'yellow', { accent: true }),
    s('path', { d: 'M40 56q6-6 12 0M64 56q6-6 12 0M44 72q14 14 28 0', transform: 'rotate(-12 58 70)', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M78 64h52q0 44-26 56q-26-12-26-56z', transform: 'rotate(12 104 94)' }, 'blue'),
    s('path', { d: 'M86 80q6 6 12 0M110 80q6 6 12 0M92 104q12-12 24 0', transform: 'rotate(12 104 94)', ...SW(4) }, 'dark', { stroke: true })
  ],
  feria: [
    s('path', { d: 'M28 56v80M132 56v80', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: dots([[29, 56], [43, 56], [57, 56], [71, 56], [85, 56], [99, 56], [113, 56], [127, 56]], 7) }, 'red'),
    s('rect', { x: 22, y: 30, width: 116, height: 26 }, 'red', { accent: true }),
    s('path', { d: rects([[36, 30, 14, 26], [64, 30, 14, 26], [92, 30, 14, 26], [120, 30, 14, 26]]) }, 'white'),
    s('rect', { x: 22, y: 98, width: 116, height: 38, rx: 3 }, 'tan'),
    s('path', { d: dots([[40, 90], [56, 90], [48, 80]], 8) }, 'orange'),
    s('path', { d: dots([[104, 90], [120, 90], [112, 80]], 8) }, 'green')
  ],
  iniciar: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'mint'),
    s('circle', { cx: 80, cy: 80, r: 52 }, 'dark'),
    s('path', { d: 'M58 52a36 36 0 1 0 44 0', ...SW(10) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M80 38v40', ...SW(10) }, 'green', { stroke: true })
  ],
  luca: [
    s('rect', { x: 30, y: 40, width: 100, height: 54, rx: 4, transform: 'rotate(-14 80 67)' }, 'green'),
    s('rect', { x: 30, y: 40, width: 100, height: 54, rx: 4, transform: 'rotate(-4 80 67)' }, 'mint'),
    s('rect', { x: 30, y: 40, width: 100, height: 54, rx: 4, transform: 'rotate(8 80 67)' }, 'green', { accent: true }),
    s('rect', { x: 38, y: 48, width: 84, height: 38, rx: 3, transform: 'rotate(8 80 67)', ...SW(3) }, 'mint', { stroke: true }),
    s('circle', { cx: 80, cy: 67, r: 12 }, 'mint'),
    s('rect', { x: 22, y: 92, width: 116, height: 44, rx: 8 }, 'brown'),
    s('circle', { cx: 122, cy: 114, r: 6 }, 'yellow')
  ],
  magia: [
    s('path', { d: 'M70 60q-6-28 2-30q8 2 4 30zM86 60q2-28 10-28q6 4-2 28z' }, 'white'),
    s('path', { d: 'M70 60q-6-28 2-30q8 2 4 30zM86 60q2-28 10-28q6 4-2 28z', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 50, y: 58, width: 60, height: 62 }, 'dark'),
    s('rect', { x: 50, y: 100, width: 60, height: 12 }, 'red', { accent: true }),
    s('rect', { x: 34, y: 116, width: 92, height: 12, rx: 6 }, 'dark'),
    s('path', { d: 'M100 70L128 36', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M124 41l5-6', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: sparkle(136, 24, 10) + sparkle(28, 44, 9) + sparkle(24, 96, 7) + sparkle(134, 70, 7) }, 'yellow')
  ],
  mantenimiento: [
    ...gear(62, 62, 26, 10, 'gray'),
    s('circle', { cx: 62, cy: 62, r: 10 }, 'white'),
    s('path', { d: 'M54 140L112 82', ...SW(14) }, 'orange', { stroke: true, accent: true }),
    s('circle', { cx: 120, cy: 74, r: 18 }, 'orange'),
    s('rect', { x: 120, y: 48, width: 12, height: 26, transform: 'rotate(45 126 61)' }, 'white')
  ],
  muro: [
    s('rect', { x: 18, y: 36, width: 124, height: 100 }, 'gray'),
    s('path', { d: bricks }, 'red', { accent: true }),
    s('rect', { x: 14, y: 26, width: 132, height: 12, rx: 3 }, 'dark'),
    ground(138)
  ],
  posiblemente: [
    s('rect', { x: 34, y: 50, width: 50, height: 50, rx: 8, transform: 'rotate(-15 59 75)' }, 'white'),
    s('rect', { x: 34, y: 50, width: 50, height: 50, rx: 8, transform: 'rotate(-15 59 75)', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[47, 63], [59, 75], [71, 87]], 5), transform: 'rotate(-15 59 75)' }, 'dark'),
    s('rect', { x: 86, y: 72, width: 46, height: 46, rx: 8, transform: 'rotate(20 109 95)' }, 'red', { accent: true }),
    s('path', { d: dots([[99, 85], [119, 85], [99, 105], [119, 105]], 4.5), transform: 'rotate(20 109 95)' }, 'white'),
    s('path', { d: 'M20 124h22M30 136h22M112 30l10-10M126 40l12-6', ...SW(4) }, 'gray', { stroke: true })
  ],
  relativamente: [
    s('path', { d: 'M14 92h132', ...DASH(3) }, 'blue', { stroke: true }),
    s('circle', { cx: 28, cy: 124, r: 12 }, 'gray'),
    s('circle', { cx: 64, cy: 114, r: 22 }, 'orange', { accent: true }),
    s('circle', { cx: 110, cy: 102, r: 34 }, 'gray'),
    ground()
  ],
  religioso: [
    s('circle', { cx: 80, cy: 78, r: 54 }, 'cream'),
    s('path', { d: 'M80 18v12M48 30l7 9M112 30l-7 9M30 58l10 4M130 58l-10 4', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M80 40q-6 0-8 10l-10 46q-4 14-14 20l10 20h22zM80 40q6 0 8 10l10 46q4 14 14 20l-10 20H80z' }, 'skin'),
    s('path', { d: 'M80 44v86', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 50, y: 126, width: 60, height: 18, rx: 4 }, 'blue', { accent: true })
  ],
  puto: [
    s('path', { d: dots([[26, 52], [34, 42], [134, 52], [126, 42]], 8) }, 'gray'),
    s('circle', { cx: 80, cy: 94, r: 46 }, 'red', { accent: true }),
    s('path', { d: 'M52 76l20 8M108 76l-20 8', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[64, 92], [96, 92]], 5) }, 'dark'),
    s('ellipse', { cx: 80, cy: 118, rx: 14, ry: 9 }, 'dark'),
    s('path', { d: 'M86 14L70 38h12l-8 16 22-26H84l8-14z' }, 'yellow')
  ],
  recorrido: [
    backdrop('mint'),
    s('path', { d: dots([[44, 50], [70, 36], [120, 114], [136, 96]], 10) }, 'green'),
    s('path', { d: 'M30 124Q40 84 70 96T118 62', ...DASH(5, '8 8') }, 'navy', { stroke: true }),
    s('circle', { cx: 30, cy: 124, r: 8 }, 'blue'),
    s('path', { d: 'M118 64q-16-18-16-30a16 16 0 0 1 32 0q0 12-16 30z' }, 'red', { accent: true }),
    s('circle', { cx: 118, cy: 34, r: 6 }, 'white')
  ],
  sabor: [
    s('path', { d: 'M56 88h48l-24 54z' }, 'tan'),
    s('path', { d: 'M64 100h32M70 114h20', ...SW(3) }, 'brown', { stroke: true }),
    s('circle', { cx: 63, cy: 80, r: 19 }, 'pink', { accent: true }),
    s('circle', { cx: 97, cy: 80, r: 19 }, 'brown'),
    s('circle', { cx: 80, cy: 54, r: 19 }, 'mint'),
    s('circle', { cx: 80, cy: 30, r: 6 }, 'red')
  ],
  supremo: [
    s('rect', { x: 20, y: 116, width: 120, height: 20 }, 'navy'),
    s('rect', { x: 40, y: 96, width: 80, height: 20 }, 'blue'),
    s('rect', { x: 60, y: 76, width: 40, height: 20 }, 'sky'),
    s('path', { d: 'M58 76V46l12 12 10-20 10 20 12-12v30z' }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 66, r: 4 }, 'red'),
    s('path', { d: 'M80 16v10M52 26l6 6M108 26l-6 6M40 46h8M120 46h-8', ...SW(3) }, 'orange', { stroke: true })
  ],
  temporal: [
    s('path', { d: 'M48 30h64q0 30-30 50q30 20 30 50H48q0-30 30-50q-30-20-30-50z' }, 'sky'),
    s('path', { d: 'M58 46h44q-6 18-22 30q-16-12-22-30z' }, 'yellow', { accent: true }),
    s('path', { d: 'M54 130q4-22 26-26q22 4 26 26z' }, 'yellow'),
    s('path', { d: 'M80 78v40', ...SW(2) }, 'yellow', { stroke: true }),
    s('path', { d: 'M44 30v100M116 30v100', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: rects([[38, 20, 84, 10], [38, 130, 84, 10]]) }, 'brown')
  ],
  virus: [
    s('path', { d: rays(80, 80, 30, 52, 10), ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: dots(around(80, 80, 54, 10), 7) }, 'red'),
    s('circle', { cx: 80, cy: 80, r: 38 }, 'green', { accent: true }),
    s('path', { d: dots([[66, 70], [92, 66], [86, 94], [64, 96]], 6) }, 'mint')
  ],
  avance: [
    s('path', { d: 'M40 26l18 18-18 18M68 26l18 18-18 18M96 26l18 18-18 18', ...SW(7) }, 'blue', { stroke: true }),
    s('rect', { x: 18, y: 76, width: 124, height: 28, rx: 14 }, 'gray'),
    s('rect', { x: 18, y: 76, width: 88, height: 28, rx: 14 }, 'green', { accent: true }),
    s('path', { d: prints([[34, 126], [56, 120], [78, 126], [100, 120]]) }, 'tan')
  ],
  complicado: [
    s('path', { d: 'M20 120C40 40 120 30 110 80S30 120 50 70 140 50 120 100 40 140 60 90 100 40 140 30', ...SW(6) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M140 124C120 60 40 40 50 90S130 120 110 60 20 60 40 110 120 130 100 80 30 30 24 28', ...SW(6) }, 'orange', { stroke: true }),
    s('circle', { cx: 78, cy: 84, r: 7 }, 'dark')
  ],
  'conclusión': [
    s('path', { d: rects([[24, 64, 40, 40], [64, 64, 40, 40], [24, 104, 40, 40]]) }, 'blue'),
    s('path', { d: dots([[64, 84], [44, 104]], 7) }, 'blue'),
    s('path', { d: 'M64 64v80M24 104h80', ...SW(2) }, 'white', { stroke: true }),
    s('rect', { x: 66, y: 106, width: 36, height: 36, rx: 2, ...DASH(3, '5 5') }, 'gray', { stroke: true }),
    s('rect', { x: 100, y: 18, width: 40, height: 40, rx: 2 }, 'green', { accent: true }),
    s('circle', { cx: 100, cy: 38, r: 7 }, 'green'),
    arrow('M122 64Q122 88 100 100M100 100l3-11M100 100l11 0', 'orange', 4)
  ],
  continente: [
    backdrop('blue'),
    s('path', { d: 'M54 30q30-8 50 8q16 14 8 34q-6 18 10 30q8 22-14 34q-18 10-26-8q-6-16-22-20q-24-4-28-28q-4-22 10-30q-4-14 12-20z' }, 'green', { accent: true }),
    s('path', { d: dots([[128, 40], [134, 52], [28, 120]], 5) }, 'green'),
    s('path', { d: 'M24 136q6-4 12 0t12 0M104 22q6-4 12 0t12 0', ...SW(3) }, 'white', { stroke: true })
  ],
  costumbre: [
    s('path', { d: 'M32 66A50 50 0 0 1 126 62M126 62l2 12M126 62l-11 5M128 94A50 50 0 0 1 34 98M34 98l-2-12M34 98l11-5', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M70 66q-4-6 0-12M86 66q-4-6 0-12', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 78q12 0 10 10t-10 8', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M60 72h36v20q0 16-18 16t-18-16z' }, 'red', { accent: true }),
    s('ellipse', { cx: 78, cy: 110, rx: 26, ry: 5 }, 'gray')
  ],
  destacar: [
    s('rect', { x: 22, y: 20, width: 96, height: 120, rx: 3 }, 'white'),
    outline({ x: 22, y: 20, width: 96, height: 120, rx: 3 }),
    s('path', { d: 'M34 40h72M34 56h72M34 92h72M34 108h72M34 124h46', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 30, y: 66, width: 82, height: 16, rx: 2 }, 'yellow', { accent: true }),
    s('path', { d: 'M34 74h72', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 112, y: 70, width: 18, height: 56, rx: 4, transform: 'rotate(-35 121 98)' }, 'orange'),
    s('rect', { x: 115, y: 60, width: 12, height: 12, transform: 'rotate(-35 121 98)' }, 'yellow')
  ],
  escolar: [
    s('path', { d: 'M66 36q0-16 14-16t14 16', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M38 62q-14 34 0 70M122 62q14 34 0 70', ...SW(6) }, 'navy', { stroke: true }),
    s('rect', { x: 38, y: 34, width: 84, height: 102, rx: 22 }, 'blue', { accent: true }),
    s('path', { d: 'M38 64q0-30 42-30t42 30v12H38z' }, 'navy'),
    s('rect', { x: 52, y: 94, width: 56, height: 32, rx: 8 }, 'sky'),
    s('path', { d: rects([[56, 72, 8, 10], [96, 72, 8, 10]]) }, 'yellow')
  ],
  hacienda: [
    backdrop('sky'),
    s('circle', { cx: 128, cy: 32, r: 10 }, 'yellow'),
    s('path', { d: 'M14 100h132v34a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green'),
    s('path', { d: 'M14 116h132M14 130h132', ...SW(3) }, 'mint', { stroke: true }),
    s('rect', { x: 32, y: 64, width: 96, height: 38 }, 'cream'),
    s('path', { d: 'M26 66l12-18h84l12 18z' }, 'red', { accent: true }),
    s('path', { d: 'M44 102v-16a7 7 0 0 1 14 0v16zM73 102v-16a7 7 0 0 1 14 0v16zM102 102v-16a7 7 0 0 1 14 0v16z' }, 'brown')
  ],
  impresionante: [
    backdrop('navy'),
    s('path', { d: rays(58, 58, 10, 36, 12), ...SW(4) }, 'yellow', { stroke: true, accent: true }),
    s('circle', { cx: 58, cy: 58, r: 6 }, 'yellow'),
    s('path', { d: rays(110, 98, 8, 30, 10, 18), ...SW(4) }, 'pink', { stroke: true }),
    s('circle', { cx: 110, cy: 98, r: 5 }, 'pink'),
    s('path', { d: dots([[118, 34], [130, 52], [32, 112], [52, 130], [84, 120], [136, 136]], 2.5) }, 'white')
  ],
  infierno: [
    backdrop('black'),
    s('path', { d: 'M80 140c-36 0-52-28-40-58 6 14 14 18 18 16-6-24 8-50 26-66-2 22 12 30 18 44 4-10 2-20-2-28 22 16 36 44 26 72-6 14-22 20-46 20z' }, 'red', { accent: true }),
    s('path', { d: 'M80 140c-22 0-32-18-24-36 6 8 10 10 14 8-2-16 6-30 16-40 0 14 8 20 12 28 4-4 4-10 2-16 12 10 18 28 12 42-4 10-14 14-32 14z' }, 'orange'),
    s('path', { d: 'M80 140c-10 0-16-10-10-22 4 4 6 4 8 2 0-10 4-16 8-22 2 10 12 18 8 30-2 8-8 12-14 12z' }, 'yellow'),
    s('path', { d: 'M14 134q20-10 34 0q16-10 34 0q16-10 30 0q18-10 34 0v0a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'brown')
  ],
  informar: [
    s('path', { d: 'M26 60q-8 14 0 28M134 64q8 14 0 28', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 116, r: 9 }, 'orange'),
    s('path', { d: 'M80 26a8 8 0 0 1 8 8q26 8 26 40v22l10 12H36l10-12V74q0-32 26-40a8 8 0 0 1 8-8z' }, 'yellow', { accent: true }),
    s('circle', { cx: 112, cy: 40, r: 12 }, 'red')
  ],
  'liberación': [
    s('path', { d: 'M26 76q32-36 64 0M26 76v56M38 66v66M50 60v72M62 58v74M74 60v72M86 70v62M58 56v-10', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 22, y: 130, width: 72, height: 8, rx: 2 }, 'brown'),
    s('path', { d: 'M90 96l18 8v28l-18-4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M92 100q12-24 14-38', ...DASH(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 116, cy: 50, rx: 18, ry: 12 }, 'yellow', { accent: true }),
    s('path', { d: 'M108 48q6-26 22-22q-6 18-22 22zM134 46l10 4-10 4z' }, 'orange'),
    s('circle', { cx: 126, cy: 46, r: 2.5 }, 'dark')
  ],
  localidad: [
    s('rect', { x: 28, y: 44, width: 60, height: 56, rx: 12 }, 'red', { accent: true }),
    s('rect', { x: 22, y: 94, width: 72, height: 18, rx: 8 }, 'red'),
    s('path', { d: 'M36 112v24M80 112v24', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 92, y: 56, width: 48, height: 30, rx: 3, transform: 'rotate(-15 116 71)' }, 'orange'),
    s('path', { d: 'M126 58v28', transform: 'rotate(-15 116 71)', ...DASH(2, '3 3') }, 'white', { stroke: true }),
    s('circle', { cx: 108, cy: 72, r: 5, transform: 'rotate(-15 116 71)' }, 'yellow')
  ],
  ma: [
    ...lady(66, 140, 'pink'),
    s('ellipse', { cx: 84, cy: 100, rx: 18, ry: 12 }, 'cream'),
    s('circle', { cx: 96, cy: 92, r: 8 }, 'skin'),
    s('path', { d: 'M60 96q16 16 36 4', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(114, 40, 16) }, 'red', { accent: true })
  ],
  manda: [
    s('path', { d: rects([[34, 84, 22, 52], [69, 68, 22, 68], [104, 92, 22, 44]]) }, 'cream'),
    s('path', { d: rects([[34, 84, 22, 52], [69, 68, 22, 68], [104, 92, 22, 44]]), ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M45 82q-8-10 0-20q8 10 0 20zM80 66q-8-10 0-20q8 10 0 20zM115 90q-8-10 0-20q8 10 0 20z' }, 'orange', { accent: true }),
    s('path', { d: heart(80, 26, 10) }, 'red')
  ],
  mandar: [
    s('path', { d: 'M14 128q24 12 46-10', ...DASH(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M20 86l120-50-36 96-24-36z' }, 'sky', { accent: true }),
    s('path', { d: 'M80 96l-6 32 18-20z' }, 'blue'),
    s('path', { d: 'M80 96l60-60', ...SW(3) }, 'navy', { stroke: true })
  ],
  mandato: [
    s('rect', { x: 36, y: 28, width: 88, height: 100 }, 'cream'),
    s('path', { d: rects([[28, 20, 104, 14], [28, 122, 104, 14]]) }, 'tan'),
    s('path', { d: 'M48 48h64M48 62h64M48 76h64M48 90h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M98 112l-6 22 8-4 4 8 4-22z' }, 'red'),
    s('circle', { cx: 104, cy: 104, r: 12 }, 'red', { accent: true }),
    s('circle', { cx: 104, cy: 104, r: 6 }, 'pink')
  ],
  metal: [
    s('path', { d: 'M20 136l8-24h44l8 24zM80 136l8-24h44l8 24z' }, 'gray'),
    s('path', { d: 'M50 110l8-24h44l8 24z' }, 'gray', { accent: true }),
    s('path', { d: 'M34 118h32M94 118h32M64 92h32', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: sparkle(118, 64, 10) + sparkle(36, 84, 7) }, 'yellow')
  ],
  paraguay: [
    s('path', { d: 'M88 112l-8 28h18z' }, 'red'),
    s('path', { d: 'M20 124h120', ...SW(8) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 84, cy: 84, rx: 22, ry: 34, transform: 'rotate(10 84 84)' }, 'green', { accent: true }),
    s('path', { d: 'M92 68q22 10 12 48q-16-20-12-48z' }, 'blue'),
    s('circle', { cx: 74, cy: 46, r: 18 }, 'green'),
    s('path', { d: 'M58 40q-14 2-10 18l10-8z' }, 'orange'),
    s('circle', { cx: 72, cy: 42, r: 3 }, 'dark')
  ],
  pasajero: [
    s('rect', { x: 16, y: 46, width: 128, height: 70, rx: 10 }, 'yellow', { accent: true }),
    s('path', { d: rects([[24, 56, 24, 26], [54, 56, 24, 26], [84, 56, 24, 26], [114, 56, 22, 26]]) }, 'sky'),
    s('path', { d: dots([[36, 72], [66, 70], [96, 72]], 8) }, 'skin'),
    s('path', { d: dots([[44, 118], [116, 118]], 12) }, 'dark'),
    s('path', { d: dots([[44, 118], [116, 118]], 5) }, 'gray'),
    ground(132)
  ],
  polvo: [
    s('rect', { x: 18, y: 88, width: 70, height: 5 }, 'gray'),
    s('rect', { x: 18, y: 92, width: 124, height: 10, rx: 2 }, 'brown'),
    s('path', { d: 'M28 102v34M132 102v34', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: dots([[54, 74], [66, 66], [58, 58], [76, 72], [40, 70]], 7) }, 'gray'),
    s('path', { d: dots([[30, 46], [48, 38], [74, 46], [62, 30], [88, 56]], 2.5) }, 'gray'),
    s('rect', { x: 92, y: 72, width: 36, height: 22, rx: 6, transform: 'rotate(-10 110 83)' }, 'blue', { accent: true })
  ],
  'reducción': [
    s('path', { d: rects([[24, 40, 20, 96], [52, 64, 20, 72], [80, 86, 20, 50], [108, 106, 20, 30]]) }, 'blue'),
    arrow('M30 28L128 92M128 92l-17-1M128 92l-7-15', 'red', 6),
    s('path', { d: 'M24 136h112', ...SW(4) }, 'dark', { stroke: true, accent: true })
  ],
  rivera: [
    backdrop('green'),
    s('path', { d: 'M60 14q-20 30 10 56t-10 76h40q30-40 0-76t-10-56z' }, 'blue', { accent: true }),
    s('path', { d: 'M70 40q4-3 8 0M80 92q4-3 8 0M74 120q4-3 8 0', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: dots([[42, 80], [118, 110], [126, 44]], 7) }, 'gray'),
    s('path', { d: 'M30 120l4-10 4 10M36 44l4-10 4 10M112 80l4-10 4 10', ...SW(3) }, 'mint', { stroke: true })
  ],
  senador: [
    s('path', { d: 'M92 64a18 18 0 0 1 36 0zM84 64h52v8H84zM82 120h56v8H82z' }, 'gray'),
    s('path', { d: 'M110 46V34M90 74v46M102 74v46M118 74v46M130 74v46', ...SW(5) }, 'gray', { stroke: true }),
    ...person(48, 136, 'navy', { accent: true }),
    s('path', { d: 'M40 92h16l-8 10z' }, 'white'),
    s('path', { d: 'M48 98l-4 14 4 8 4-8z' }, 'red'),
    ground()
  ],
  socio: [
    ...person(40, 136, 'blue'),
    ...person(120, 136, 'green'),
    s('path', { d: 'M54 104L78 112M106 104L82 112', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 80, cy: 112, r: 7 }, 'skin'),
    s('path', { d: sparkle(80, 50, 14) }, 'yellow', { accent: true }),
    ground()
  ],
  solidaridad: [
    ...person(36, 136, 'orange', { h: 40, w: 26 }),
    ...person(80, 136, 'purple', { h: 40, w: 26 }),
    ...person(124, 136, 'blue', { h: 40, w: 26 }),
    s('path', { d: 'M48 108h20M92 108h20', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 32, 16) }, 'red', { accent: true }),
    ground()
  ],
  sufrir: [
    s('ellipse', { cx: 80, cy: 48, rx: 46, ry: 26 }, 'gray', { accent: true }),
    s('path', { d: 'M60 38l12 8-4 10M100 34l-6 12', ...SW(3) }, 'dark', { stroke: true }),
    ...person(80, 136, 'blue', { h: 34 }),
    s('path', { d: 'M66 108L56 72M94 108l10-36', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M74 94q6-4 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M46 96q4 6 0 10q-4-4 0-10zM116 98q4 6 0 10q-4-4 0-10z' }, 'sky'),
    ground()
  ],
  templo: [
    s('path', { d: 'M18 54L80 20l62 34z' }, 'tan', { accent: true }),
    s('rect', { x: 22, y: 54, width: 116, height: 10 }, 'tan'),
    s('path', { d: rects([[30, 64, 12, 58], [52, 64, 12, 58], [74, 64, 12, 58], [96, 64, 12, 58], [118, 64, 12, 58]]) }, 'cream'),
    s('path', { d: rects([[30, 64, 12, 58], [52, 64, 12, 58], [74, 64, 12, 58], [96, 64, 12, 58], [118, 64, 12, 58]]), ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: rects([[18, 122, 124, 8], [14, 130, 132, 8]]) }, 'brown'),
    s('circle', { cx: 80, cy: 42, r: 6 }, 'cream')
  ],
  teniente: [
    ...person(80, 140, 'green', { h: 56, w: 52, r: 18 }),
    s('path', { d: 'M60 52q-4-22 20-22t20 22z' }, 'green', { accent: true }),
    s('rect', { x: 58, y: 50, width: 44, height: 6, rx: 3 }, 'dark'),
    s('circle', { cx: 80, cy: 42, r: 4 }, 'yellow'),
    s('path', { d: 'M60 92h12M60 99h12M88 92h12M88 99h12', ...SW(4) }, 'yellow', { stroke: true })
  ],
  terror: [
    backdrop('navy'),
    s('path', { d: 'M90 132V62a26 26 0 0 1 52 0v70l-9-8-9 8-8-8-8 8-9-8z' }, 'white'),
    s('path', { d: dots([[106, 62], [124, 62]], 5) }, 'dark'),
    ...person(44, 140, 'orange', { accent: true }),
    s('circle', { cx: 44, cy: 86, r: 4 }, 'dark'),
    s('path', { d: 'M28 58l-6-8M44 52v-10M60 58l6-8', ...SW(3) }, 'yellow', { stroke: true })
  ],
  top: [
    s('path', { d: 'M62 30v16M98 30v16', ...SW(4) }, 'purple', { stroke: true }),
    s('path', { d: 'M58 44h8q4 12 14 12t14-12h8q6 18 14 26v34H44V70q8-8 14-26z' }, 'pink', { accent: true }),
    s('rect', { x: 44, y: 98, width: 72, height: 8, rx: 2 }, 'purple'),
    s('path', { d: 'M56 30h48', ...SW(3) }, 'gray', { stroke: true })
  ],
  armada: [
    backdrop('sky'),
    s('path', { d: 'M14 104h132v30a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'blue'),
    s('path', { d: 'M18 96h44l-6 10H24zM96 92h48l-6 12h-36zM30 84h16v12H30zM110 78h20v14h-20z' }, 'gray'),
    s('path', { d: 'M30 118h104l-14 20H44z' }, 'navy', { accent: true }),
    s('path', { d: rects([[60, 98, 30, 20], [70, 88, 12, 10]]) }, 'gray'),
    s('path', { d: 'M90 108l26-6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M76 88V72l12 5-12 5' }, 'red')
  ],
  bola: [
    s('ellipse', { cx: 80, cy: 134, rx: 36, ry: 6 }, 'gray'),
    s('circle', { cx: 80, cy: 74, r: 46 }, 'red', { accent: true }),
    s('path', { d: 'M38 56q42 24 84 0M36 96q44 22 88 0', ...SW(6) }, 'white', { stroke: true }),
    s('ellipse', { cx: 62, cy: 44, rx: 8, ry: 5 }, 'pink')
  ],
  cable: [
    s('path', { d: 'M28 34Q64 30 52 70T88 116', ...SW(6) }, 'black', { stroke: true }),
    s('rect', { x: 16, y: 22, width: 22, height: 18, rx: 3 }, 'gray'),
    s('rect', { x: 84, y: 108, width: 10, height: 16, rx: 3 }, 'dark'),
    s('rect', { x: 92, y: 100, width: 32, height: 32, rx: 6 }, 'orange', { accent: true }),
    s('path', { d: 'M124 108h14M124 124h14', ...SW(4) }, 'gray', { stroke: true })
  ],
  comprender: [
    s('path', { d: 'M60 140V112q-22-8-22-40q0-42 44-44q40 0 42 40l10 18-8 4v12q0 10-12 10h-12v28z' }, 'skin'),
    s('circle', { cx: 82, cy: 62, r: 16 }, 'yellow', { accent: true }),
    s('rect', { x: 76, y: 76, width: 12, height: 8, rx: 2 }, 'gray'),
    s('path', { d: 'M82 40v-6M64 48l-5-4M100 48l5-4', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M116 30l6 6 12-14', ...SW(5) }, 'green', { stroke: true })
  ],
  cuarta: [
    s('path', { d: 'M110 136v-18a16 16 0 0 1 32 0v18', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 128L118 34', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M38 130L54 111', ...SW(12) }, 'brown', { stroke: true }),
    s('circle', { cx: 34, cy: 134, r: 6 }, 'brown'),
    s('path', { d: 'M114 38l6-24 16 4-8 22z' }, 'brown', { accent: true })
  ],
  'eléctrica': [
    s('path', { d: 'M14 64q15 10 30-4M116 60q14 14 30 4', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 136L72 30h16l16 106M64 86h32M60 110h40M44 52h72M50 52l22-22M110 52L88 30M60 110l36-24M100 110L64 86M44 52v8M116 52v8', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M120 82l-14 22h12l-8 24 24-30h-12l8-16z' }, 'yellow', { accent: true })
  ],
  escritura: [
    s('rect', { x: 26, y: 34, width: 80, height: 104, rx: 3 }, 'cream'),
    outline({ x: 26, y: 34, width: 80, height: 104, rx: 3 }, 'tan'),
    s('path', { d: 'M38 54q6-6 12 0t12 0t12 0t12 0M38 72q6-6 12 0t12 0t12 0t12 0M38 90q6-6 12 0t12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M140 16q-40 10-56 72l6 2q34-34 50-74z' }, 'sky', { accent: true }),
    s('path', { d: 'M138 20L86 88l-6 14', ...SW(2) }, 'navy', { stroke: true }),
    s('rect', { x: 112, y: 112, width: 28, height: 24, rx: 6 }, 'navy')
  ],
  'estadística': [
    s('rect', { x: 14, y: 20, width: 132, height: 108, rx: 8 }, 'white'),
    outline({ x: 14, y: 20, width: 132, height: 108, rx: 8 }),
    s('circle', { cx: 52, cy: 72, r: 30 }, 'blue'),
    s('path', { d: 'M52 72V42a30 30 0 0 1 28.5 39.3z' }, 'orange', { accent: true }),
    s('path', { d: rects([[96, 84, 10, 30], [112, 66, 10, 48], [128, 48, 10, 66]]) }, 'green'),
    s('path', { d: 'M50 128l-10 14M110 128l10 14', ...SW(4) }, 'gray', { stroke: true })
  ],
  fraude: [
    s('path', { d: 'M80 14v40', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 48, y: 84, width: 64, height: 40, rx: 5, transform: 'rotate(-12 80 104)' }, 'blue', { accent: true }),
    s('rect', { x: 48, y: 92, width: 64, height: 8, transform: 'rotate(-12 80 104)' }, 'dark'),
    s('rect', { x: 56, y: 104, width: 14, height: 10, rx: 2, transform: 'rotate(-12 80 104)' }, 'yellow'),
    s('path', { d: 'M80 54v34a10 10 0 0 1-20 0l4-4', ...SW(4) }, 'dark', { stroke: true })
  ],
  gigante: [
    ...person(64, 140, 'purple', { h: 76, w: 50, r: 22, accent: true }),
    s('path', { d: dots([[56, 40], [72, 40]], 3) }, 'dark'),
    ...person(124, 140, 'orange', { h: 16, w: 12, r: 5 }),
    ground(140)
  ],
  instrumento: [
    s('circle', { cx: 70, cy: 108, r: 30 }, 'orange', { accent: true }),
    s('circle', { cx: 86, cy: 80, r: 22 }, 'orange'),
    s('path', { d: 'M92 74L122 26', ...SW(10) }, 'brown', { stroke: true }),
    s('rect', { x: 120, y: 12, width: 12, height: 18, rx: 3, transform: 'rotate(32 126 21)' }, 'dark'),
    s('circle', { cx: 80, cy: 92, r: 8 }, 'dark'),
    s('rect', { x: 56, y: 114, width: 18, height: 6, transform: 'rotate(-58 65 117)' }, 'dark'),
    s('path', { d: 'M66 118L124 24', ...SW(1.5) }, 'cream', { stroke: true })
  ],
  laboratorio: [
    s('path', { d: 'M72 28v34l-30 58q-4 12 10 12h56q14 0 10-12l-30-58V28z' }, 'white'),
    s('path', { d: 'M50 106l-8 14q-4 12 10 12h56q14 0 10-12l-8-14z' }, 'green', { accent: true }),
    s('path', { d: 'M66 28h28M72 28v34l-30 58q-4 12 10 12h56q14 0 10-12l-30-58V28', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[70, 94], [86, 84], [78, 70]], 4) }, 'mint'),
    s('rect', { x: 120, y: 48, width: 14, height: 66, rx: 7 }, 'sky'),
    s('path', { d: 'M120 84h14v23a7 7 0 0 1-14 0z' }, 'purple')
  ],
  lujo: [
    s('path', { d: ring(80, 102, 30), ...SW(10) }, 'yellow', { stroke: true }),
    s('path', { d: 'M70 66l10 10 10-10', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M62 52l8-14h20l8 14-18 22z' }, 'sky', { accent: true }),
    s('path', { d: 'M62 52h36M70 38l10 14 10-14M80 52v22', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: sparkle(118, 40, 10) + sparkle(40, 64, 7) }, 'yellow')
  ],
  manejar: [
    s('path', { d: ring(80, 84, 50), ...SW(10) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 84v50M80 84L36 72M80 84l44-12', ...SW(8) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 84, r: 14 }, 'red', { accent: true }),
    s('path', { d: dots([[37, 59], [123, 59]], 12) }, 'skin')
  ],
  ocupar: [
    s('path', { d: 'M50 30v80M52 114v24M104 114v24', ...SW(7) }, 'brown', { stroke: true }),
    s('rect', { x: 44, y: 104, width: 68, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M74 78q10-18 20 0', ...SW(4) }, 'red', { stroke: true }),
    s('rect', { x: 64, y: 76, width: 40, height: 28, rx: 6 }, 'red', { accent: true }),
    s('rect', { x: 80, y: 84, width: 8, height: 6, rx: 1 }, 'yellow')
  ],
  'petición': [
    s('rect', { x: 30, y: 24, width: 100, height: 116, rx: 8 }, 'brown'),
    s('rect', { x: 40, y: 38, width: 80, height: 94 }, 'white'),
    s('rect', { x: 62, y: 16, width: 36, height: 16, rx: 4 }, 'gray', { accent: true }),
    s('path', { d: 'M50 52h60', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 74q6-8 10 0t10 0 10-4M52 94q4-8 10 0t12-2M52 114q6-8 12 0t8 0', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M50 80h60M50 100h60M50 120h60', ...SW(2) }, 'gray', { stroke: true })
  ],
  plena: [
    backdrop('sky'),
    s('circle', { cx: 46, cy: 44, r: 12 }, 'yellow'),
    s('path', { d: 'M14 96h132v38a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green', { accent: true }),
    s('path', { d: 'M116 96V74', ...SW(5) }, 'brown', { stroke: true }),
    s('circle', { cx: 116, cy: 66, r: 14 }, 'green'),
    s('path', { d: 'M30 116l3-6 3 6M64 126l3-6 3 6M100 114l3-6 3 6M124 132l3-6 3 6', ...SW(2) }, 'mint', { stroke: true })
  ],
  previa: [
    ...glass(60, 8, true),
    ...glass(100, -8, false),
    s('path', { d: sparkle(80, 22, 10) }, 'yellow'),
    s('path', { d: dots([[24, 40], [136, 46], [30, 92], [132, 96]], 4) }, 'purple'),
    s('path', { d: dots([[40, 24], [120, 26], [22, 66], [140, 70]], 3) }, 'blue')
  ],
  'programación': [
    s('rect', { x: 26, y: 28, width: 108, height: 72, rx: 6 }, 'dark'),
    s('rect', { x: 32, y: 34, width: 96, height: 60 }, 'navy'),
    s('path', { d: 'M40 46h24M48 58h36M48 70h28M40 82h18', ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M70 46h26M90 58h18M82 70h20', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M14 104h132l-10 16H24z' }, 'gray')
  ],
  proponer: [
    ...person(46, 136, 'purple'),
    s('path', { d: 'M58 104L94 94', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 98, cy: 93, r: 6 }, 'skin'),
    s('circle', { cx: 104, cy: 68, r: 14 }, 'yellow', { accent: true }),
    s('rect', { x: 98, y: 80, width: 12, height: 7, rx: 2 }, 'gray'),
    s('path', { d: 'M104 46v-8M84 54l-6-5M124 54l6-5', ...SW(3) }, 'orange', { stroke: true }),
    arrow('M106 120h30m-8-8 8 8-8 8', 'blue', 5)
  ],
  protesta: [
    s('path', { d: 'M40 46v30M120 46v30', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: rects([[18, 18, 44, 30], [98, 18, 44, 30]]) }, 'yellow'),
    s('rect', { x: 26, y: 96, width: 16, height: 22, rx: 3 }, 'dark'),
    s('path', { d: 'M42 96l50-24v68l-50-24z' }, 'red', { accent: true }),
    s('path', { d: 'M56 116l-4 20', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M104 84l14-10M108 106h20M104 128l14 10', ...SW(5) }, 'orange', { stroke: true })
  ],
  robar: [
    s('path', { d: 'M76 104L100 76', ...SW(6) }, 'skin', { stroke: true }),
    ...person(62, 136, 'dark'),
    s('path', { d: 'M50 76a12 12 0 0 1 24 0z' }, 'black'),
    s('rect', { x: 49, y: 77, width: 26, height: 6, rx: 3 }, 'black'),
    s('circle', { cx: 112, cy: 92, r: 22 }, 'tan', { accent: true }),
    s('path', { d: 'M102 72l10 8 10-8', ...SW(4) }, 'brown', { stroke: true }),
    ground()
  ],
  'votación': [
    s('rect', { x: 66, y: 22, width: 28, height: 42, rx: 2 }, 'white'),
    outline({ x: 66, y: 22, width: 28, height: 42, rx: 2 }),
    s('path', { d: 'M72 42l6 6 10-12', ...SW(4) }, 'green', { stroke: true }),
    s('rect', { x: 30, y: 72, width: 100, height: 64, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 24, y: 64, width: 112, height: 12, rx: 3 }, 'navy'),
    s('rect', { x: 58, y: 67, width: 44, height: 5, rx: 2 }, 'dark')
  ],
  'últimamente': [
    s('rect', { x: 22, y: 30, width: 116, height: 108, rx: 8 }, 'white'),
    outline({ x: 22, y: 30, width: 116, height: 108, rx: 8 }),
    s('path', { d: 'M30 30h100a8 8 0 0 1 8 8v16H22V38a8 8 0 0 1 8-8z' }, 'red', { accent: true }),
    s('path', { d: 'M50 22v16M110 22v16', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: rects(cells.slice(0, 16)) }, 'gray'),
    s('path', { d: rects(cells.slice(16, 19)) }, 'orange')
  ],
  abandonar: [
    s('rect', { x: 24, y: 96, width: 44, height: 36, rx: 5 }, 'brown', { accent: true }),
    s('path', { d: 'M38 96v-8h16v8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M36 96v36M56 96v36', ...SW(3) }, 'tan', { stroke: true }),
    ...person(118, 134, 'gray'),
    s('path', { d: 'M96 92h-12M96 106h-16M96 120h-12', ...SW(3) }, 'gray', { stroke: true }),
    ground()
  ],
  agradable: [
    s('circle', { cx: 80, cy: 32, r: 14 }, 'yellow'),
    s('path', { d: 'M28 38q10-6 20 0M110 40q10-6 20 0', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M24 136V60M136 136V60', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M24 70Q80 130 136 70Q80 104 24 70z' }, 'orange', { accent: true }),
    s('circle', { cx: 50, cy: 80, r: 10 }, 'skin'),
    ground()
  ],
  arquitectura: [
    backdrop('navy'),
    s('path', { d: 'M14 46h132M14 78h132M14 110h132M46 14v132M78 14v132M110 14v132', ...SW(1) }, 'blue', { stroke: true }),
    s('path', { d: 'M30 124V72l30-26 30 26v52zM46 124V98h28v26M40 80h40', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M98 132l38-58v58z' }, 'yellow', { accent: true }),
    s('path', { d: 'M116 124l10-16v16z' }, 'navy')
  ],
  'batería': [
    s('path', { d: 'M86 14L68 34h12l-6 14 20-22H82l8-12z' }, 'yellow'),
    s('rect', { x: 22, y: 56, width: 104, height: 64, rx: 10 }, 'dark'),
    s('rect', { x: 126, y: 74, width: 12, height: 28, rx: 3 }, 'dark'),
    s('path', { d: rects([[32, 66, 24, 44], [62, 66, 24, 44], [92, 66, 24, 44]]) }, 'green', { accent: true })
  ],
  brillante: [
    s('path', { d: 'M36 62l18-26h52l18 26-44 72z' }, 'sky', { accent: true }),
    s('path', { d: 'M36 62h88M54 36l12 26 14-26 14 26 12-26M66 62l14 72 14-72', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: sparkle(130, 28, 12) + sparkle(28, 104, 9) + sparkle(130, 104, 8) + sparkle(30, 30, 7) }, 'yellow')
  ],
  comunicado: [
    s('rect', { x: 14, y: 14, width: 132, height: 80, rx: 12 }, 'sky'),
    s('path', { d: 'M70 74l-10-22M90 74l10-22', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[58, 46], [102, 46]], 7) }, 'dark'),
    s('path', { d: 'M54 82h52l-6 54H60z' }, 'brown', { accent: true }),
    s('rect', { x: 46, y: 74, width: 68, height: 10, rx: 3 }, 'tan'),
    s('circle', { cx: 80, cy: 106, r: 10 }, 'yellow')
  ],
  cristiano: [
    backdrop('sky'),
    s('rect', { x: 44, y: 72, width: 72, height: 64 }, 'white'),
    s('path', { d: 'M38 74L80 42l42 32z' }, 'red'),
    s('path', { d: rects([[76, 16, 8, 28], [68, 22, 24, 8]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M70 136v-20a10 10 0 0 1 20 0v20z' }, 'brown'),
    s('circle', { cx: 80, cy: 90, r: 7 }, 'blue')
  ],
  cubrir: [
    s('ellipse', { cx: 80, cy: 124, rx: 60, ry: 10 }, 'white'),
    s('ellipse', { cx: 80, cy: 124, rx: 60, ry: 10, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 106a46 46 0 0 1 92 0z' }, 'gray', { accent: true }),
    s('circle', { cx: 80, cy: 56, r: 6 }, 'dark'),
    s('path', { d: 'M62 74q-8 6-12 16', ...SW(4) }, 'white', { stroke: true }),
    arrow('M22 50v26m-6-8 6 8 6-8M138 50v26m-6-8 6 8 6-8', 'orange', 4)
  ],
  diablo: [
    s('path', { d: 'M48 62l-12-42 30 26zM112 62l12-42-30 26z' }, 'dark'),
    s('circle', { cx: 80, cy: 86, r: 44 }, 'red', { accent: true }),
    s('path', { d: 'M54 72l18 8M106 72l-18 8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[64, 88], [96, 88]], 6) }, 'yellow'),
    s('path', { d: 'M58 104q22 18 44 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M72 126l8 16 8-16z' }, 'dark')
  ],
  'duración': [
    s('rect', { x: 72, y: 18, width: 16, height: 14, rx: 3 }, 'dark'),
    s('rect', { x: 112, y: 32, width: 12, height: 10, rx: 2, transform: 'rotate(45 118 37)' }, 'dark'),
    s('circle', { cx: 80, cy: 88, r: 48 }, 'cream'),
    s('path', { d: 'M80 88V52A36 36 0 0 1 116 88z' }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 88, r: 48, ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 88h30', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 88, r: 5 }, 'dark')
  ],
  encargado: [
    ...person(60, 136, 'navy', { accent: true }),
    s('path', { d: 'M52 92l8 18 8-18', ...SW(3) }, 'red', { stroke: true }),
    s('rect', { x: 54, y: 108, width: 12, height: 14, rx: 2 }, 'white'),
    s('path', { d: ring(112, 70, 12), ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M112 82v40M112 108h10M112 118h8', ...SW(6) }, 'yellow', { stroke: true }),
    ground()
  ],
  financiera: [
    s('path', { d: 'M22 54L80 20l58 34zM24 54h112v10H24zM18 120h124v14H18z' }, 'navy'),
    s('path', { d: 'M36 68v50M58 68v50M102 68v50M124 68v50', ...SW(10) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 92, r: 18 }, 'yellow', { accent: true }),
    s('path', { d: 'M80 82v20', ...SW(4) }, 'orange', { stroke: true })
  ],
  guerrero: [
    s('path', { d: 'M122 22L52 116', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 100l20 16', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: 'M52 116l-12 16', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 38, cy: 135, r: 5 }, 'yellow'),
    s('path', { d: 'M80 34q20 8 40 6v40q0 36-40 54q-40-18-40-54V40q20 2 40-6z' }, 'red', { accent: true }),
    s('path', { d: star(80, 80, 16) }, 'yellow')
  ],
  'héroe': [
    s('path', { d: 'M70 90h20q28 22 34 46H36q6-24 34-46z' }, 'red'),
    ...person(80, 136, 'blue', { accent: true }),
    s('path', { d: 'M66 98l-12 12 10 10M94 98l12 12-10 10', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: star(80, 108, 8) }, 'yellow'),
    s('path', { d: sparkle(40, 40, 8) + sparkle(122, 44, 10) }, 'yellow')
  ],
  idiota: [
    s('circle', { cx: 80, cy: 84, r: 52 }, 'skin'),
    s('path', { d: dots([[62, 72], [98, 72]], 12) }, 'white'),
    s('path', { d: dots([[70, 76], [90, 76]], 5) }, 'dark'),
    s('path', { d: 'M54 108q26 12 52 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M72 112q8 22 16 0z' }, 'red', { accent: true }),
    s('path', { d: star(40, 26, 8) + star(80, 18, 7) + star(120, 26, 8) }, 'orange')
  ],
  meter: [
    s('path', { d: 'M36 84l-14-16h30l14 16zM124 84l14-16h-30l-14 16z' }, 'tan'),
    s('rect', { x: 36, y: 84, width: 88, height: 52, rx: 2 }, 'brown', { accent: true }),
    s('rect', { x: 40, y: 80, width: 80, height: 6, rx: 2 }, 'dark'),
    s('circle', { cx: 80, cy: 34, r: 16 }, 'orange'),
    arrow('M80 56v18m-7-7 7 7 7-7', 'blue', 5)
  ],
  mio: [
    s('path', { d: 'M40 62l6-38 30 24zM120 62l-6-38-30 24z' }, 'orange'),
    s('ellipse', { cx: 80, cy: 86, rx: 48, ry: 42 }, 'orange', { accent: true }),
    s('path', { d: dots([[64, 80], [96, 80]], 5) }, 'dark'),
    s('path', { d: 'M76 92h8l-4 5z' }, 'pink'),
    s('path', { d: 'M72 104q8 8 16 0M24 90h26M24 102l26-4M136 90h-26M136 102l-26-4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M132 22q8 8 0 16M140 16q12 14 0 28', ...SW(3) }, 'gray', { stroke: true })
  ],
  obispo: [
    ...person(78, 140, 'purple', { h: 56, w: 48, r: 16 }),
    s('path', { d: 'M72 84v56M84 84v56', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M62 54q0-26 16-36q16 10 16 36z' }, 'cream'),
    s('path', { d: 'M62 54q0-26 16-36q16 10 16 36z', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: rects([[76, 28, 4, 18], [70, 34, 16, 4]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M124 140V44q0-16-12-14q-8 2-6 10', ...SW(5) }, 'yellow', { stroke: true })
  ],
  jurar: [
    ...person(68, 136, 'navy'),
    s('path', { d: 'M80 100l14-34', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 95, cy: 61, r: 7 }, 'skin'),
    s('path', { d: 'M106 48l6-6M110 62h8M106 76l6 5', ...SW(3) }, 'yellow', { stroke: true }),
    s('rect', { x: 30, y: 102, width: 30, height: 24, rx: 2 }, 'red', { accent: true }),
    s('path', { d: rects([[42, 108, 6, 14], [37, 112, 16, 4]]) }, 'yellow'),
    s('circle', { cx: 56, cy: 110, r: 6 }, 'skin'),
    ground()
  ],
};
