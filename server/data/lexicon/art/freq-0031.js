// Illustration specs for common words still undrawn in batches 0029–0031 (see server/scripts/lexicon/art.js)
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

// Path data: a pie wedge of radius r from angle a1 to a2 (degrees, clockwise)
const wedge = (cx, cy, r, a1, a2) => {
  const [p, q] = [a1, a2].map(a => [(cx + r * Math.cos(a * Math.PI / 180)).toFixed(1), (cy + r * Math.sin(a * Math.PI / 180)).toFixed(1)]);
  return `M${cx} ${cy}L${p[0]} ${p[1]}A${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${q[0]} ${q[1]}z`;
};

// Path data: laurel leaves up both sides of a circle of radius R around (cx, cy)
const laurel = (cx, cy, R, L = 16, w = 5) => [
  ...[120, 145, 170, 195, 220].map(a => [a, a + 90]),
  ...[60, 35, 10, -15, -40].map(a => [a, a - 90])
].map(([a, dir]) => { const [x, y] = around(cx, cy, R, 1, a)[0]; return leaflet(x, y, dir, L, w); }).join('');
// Rectangles for the dark squares of a checkerboard
const checker = (x, y, cols, rows, size, odd = 1) => rects(Array.from({ length: cols * rows }, (_, k) => [x + (k % cols) * size, y + Math.floor(k / cols) * size, size, size, (k % cols + Math.floor(k / cols)) % 2]).filter(q => q[4] === odd).map(q => q.slice(0, 4)));
// Path data: a small spiral (eye of a dizzy face)
const spiral = (x, y) => `M${x} ${y}a3 3 0 0 1 6 0a6 6 0 0 1-12 0a9 9 0 0 1 18 0`;
// Path data: flying birds (gull shapes)
const birds = pts => pts.map(([x, y]) => `M${x - 10} ${y - 2}q5-7 10 0q5-7 10 0`).join('');


// An open book seen from the front (two pages) centred on cx, top y
const openBook = (cx, y, color = 'white', cover = 'brown') => [
  s('path', { d: `M${cx - 56} ${y + 6}l56 8 56-8v52l-56 8-56-8z` }, cover),
  s('path', { d: `M${cx - 52} ${y}q26-4 52 8v52q-26-12-52-8zM${cx + 52} ${y}q-26-4-52 8v52q26-12 52-8z` }, color),
  s('path', { d: `M${cx} ${y + 8}v52`, ...SW(2) }, 'gray', { stroke: true })
];

module.exports = {
  mero: [
    s('ellipse', { cx: 80, cy: 128, rx: 62, ry: 10 }, 'gray'),
    s('circle', { cx: 80, cy: 80, r: 54 }, 'white'),
    s('path', { d: ring(80, 80, 54), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ring(80, 80, 38), ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 7 }, 'green', { accent: true })
  ],
  designar: [
    s('path', { d: busts([40, 120], 140, 26, 34) }, 'gray'),
    s('path', { d: dots([[40, 98], [120, 98]], 11) }, 'skin'),
    s('path', { d: busts([80], 140, 30, 42) }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 86, r: 13 }, 'skin'),
    s('path', { d: star(80, 40, 16) }, 'yellow'),
    arrow('M30 30q20-12 32 4M54 30l8 4-1 9', 'orange', 5)
  ],
  chupar: [
    s('circle', { cx: 62, cy: 86, r: 44 }, 'skin'),
    s('path', { d: 'M38 74q8 6 16 0M68 74q8 6 16 0', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 92, cy: 104, r: 7 }, 'red'),
    s('path', { d: 'M97 100l22-22', ...SW(5) }, 'white', { stroke: true, lineColor: 'gray' }),
    s('circle', { cx: 126, cy: 60, r: 20 }, 'pink', { accent: true }),
    s('path', { d: 'M126 60a4 4 0 0 1 8 0a8 8 0 0 1-16 0a12 12 0 0 1 24 0', ...SW(3) }, 'white', { stroke: true })
  ],
  'energético': [
    s('rect', { x: 26, y: 46, width: 100, height: 68, rx: 10 }, 'dark'),
    s('rect', { x: 126, y: 66, width: 12, height: 28, rx: 3 }, 'dark'),
    s('rect', { x: 34, y: 54, width: 84, height: 52, rx: 5 }, 'green'),
    s('path', { d: 'M86 52L58 84h18l-8 26 30-36H80z' }, 'yellow', { accent: true })
  ],
  enterar: [
    s('circle', { cx: 56, cy: 86, r: 42 }, 'skin'),
    s('path', { d: 'M24 70q2-34 34-38q30-2 38 24q-22-12-46-6q-14 4-26 20z' }, 'brown'),
    s('ellipse', { cx: 96, cy: 88, rx: 9, ry: 14 }, 'tan'),
    s('path', { d: bubble(104, 18, 44, 38) }, 'sky', { accent: true }),
    s('path', { d: dots([[116, 37], [126, 37], [136, 37]], 3) }, 'navy'),
    arrow('M118 64q-2 16-14 20M104 76l0 8 8 2', 'orange', 4),
    s('path', { d: 'M40 86h6M62 86h6', ...SW(4) }, 'dark', { stroke: true })
  ],
  monitor: [
    s('rect', { x: 18, y: 26, width: 124, height: 84, rx: 6 }, 'dark'),
    s('rect', { x: 26, y: 34, width: 108, height: 68, rx: 2 }, 'sky', { accent: true }),
    s('path', { d: 'M72 110h16l4 18H68z' }, 'gray'),
    s('rect', { x: 50, y: 126, width: 60, height: 8, rx: 4 }, 'gray'),
    s('path', { d: 'M40 86l18-20 14 12 22-28 26 36z' }, 'blue')
  ],
  morar: [
    ground(),
    s('rect', { x: 102, y: 34, width: 14, height: 30 }, 'brown'),
    s('path', { d: 'M24 76l56-46 56 46z' }, 'red', { accent: true }),
    s('rect', { x: 34, y: 76, width: 92, height: 60 }, 'cream'),
    s('rect', { x: 46, y: 92, width: 26, height: 22, rx: 2 }, 'yellow'),
    s('circle', { cx: 59, cy: 106, r: 6 }, 'skin'),
    s('rect', { x: 88, y: 100, width: 24, height: 36, rx: 2 }, 'brown'),
    s('path', { d: 'M110 28q-8-6 0-12t0-12', ...SW(4) }, 'gray', { stroke: true })
  ],
  'músculo': [
    s('rect', { x: 14, y: 92, width: 26, height: 34, rx: 6 }, 'red', { accent: true }),
    s('path', { d: 'M36 112h56', ...SW(28) }, 'skin', { stroke: true }),
    s('path', { d: 'M96 112l12-56', ...SW(24) }, 'skin', { stroke: true }),
    s('ellipse', { cx: 66, cy: 98, rx: 24, ry: 18 }, 'skin'),
    s('circle', { cx: 110, cy: 46, r: 17 }, 'skin'),
    s('path', { d: 'M58 74l-4-10M70 72l2-11M82 76l7-9', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M54 94q12-8 24 0', ...SW(3) }, 'tan', { stroke: true })
  ],
  pesadilla: [
    backdrop('navy'),
    s('rect', { x: 22, y: 104, width: 116, height: 26, rx: 6 }, 'brown'),
    s('ellipse', { cx: 40, cy: 98, rx: 18, ry: 9 }, 'white'),
    s('circle', { cx: 46, cy: 88, r: 13 }, 'skin'),
    s('path', { d: 'M56 96h80v14H56z' }, 'blue'),
    s('path', { d: ells([[92, 46, 26, 16], [114, 40, 18, 14], [72, 50, 14, 10]]) }, 'purple'),
    s('path', { d: 'M100 52l-10 16h10l-8 16 20-22h-10l6-10z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[56, 72], [64, 64]], 3) }, 'gray')
  ],
  plomo: [
    s('rect', { x: 30, y: 16, width: 100, height: 10, rx: 4 }, 'brown'),
    s('path', { d: 'M80 26v34', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 60h28l10 24-24 54-24-54z' }, 'gray', { accent: true }),
    s('path', { d: 'M66 60h28l2 6H64z' }, 'dark'),
    s('path', { d: 'M72 76l-4 10 12 30', ...SW(3) }, 'white', { stroke: true })
  ],
  postal: [
    s('rect', { x: 14, y: 34, width: 132, height: 92, rx: 6 }, 'cream'),
    s('path', { d: 'M14 40a6 6 0 0 1 6-6h52v92H20a6 6 0 0 1-6-6z' }, 'sky'),
    s('path', { d: 'M14 108l22-30 16 18 10-10 10 10v30H20a6 6 0 0 1-6-6z' }, 'green'),
    s('circle', { cx: 52, cy: 56, r: 8 }, 'yellow'),
    s('rect', { x: 114, y: 42, width: 24, height: 28, rx: 2 }, 'red', { accent: true }),
    s('path', { d: 'M84 84h44M84 98h44M84 112h30', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ring(106, 62, 12), ...DASH(2, '3 3') }, 'dark', { stroke: true })
  ],
  prado: [
    s('rect', { x: 14, y: 20, width: 132, height: 70, rx: 8 }, 'sky'),
    s('path', { d: 'M14 84q66-12 132 0v52H14z' }, 'green'),
    s('circle', { cx: 120, cy: 44, r: 12 }, 'yellow'),
    s('path', { d: 'M22 96l2 8M44 110l2 8M70 98l-2 8M96 114l2 8M120 100l-2 8M134 120l2 8M30 124l2 8', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: dots([[34, 100], [80, 108], [124, 116], [56, 124]], 4) }, 'yellow', { accent: true }),
    s('path', { d: dots([[58, 98], [104, 98], [100, 128], [24, 116]], 4) }, 'pink')
  ],
  residir: [
    s('path', { d: 'M22 70l58-44 58 44M34 62v74h92V62', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M48 136v-34q0-8 8-8h48q8 0 8 8v34z' }, 'purple'),
    s('circle', { cx: 80, cy: 76, r: 11 }, 'skin'),
    s('rect', { x: 66, y: 88, width: 28, height: 30, rx: 9 }, 'blue'),
    s('rect', { x: 56, y: 114, width: 48, height: 12, rx: 4 }, 'purple'),
    s('path', { d: 'M80 54c-10-10-12-14-12-20a12 12 0 0 1 24 0c0 6-2 10-12 20z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 34, r: 4 }, 'white')
  ],
  'salvación': [
    s('path', { d: 'M14 112q11-8 22 0t22 0 22 0 22 0 22 0 22 0V140H14z' }, 'blue'),
    s('path', { d: ring(80, 82, 38), ...SW(20) }, 'red', { stroke: true, accent: true }),
    s('path', { d: ring(80, 82, 38), ...SW(20, { 'stroke-linecap': 'butt', 'stroke-dasharray': '14.9 44.8', 'stroke-dashoffset': '7' }) }, 'white', { stroke: true }),
    s('path', { d: 'M80 36q-30-14-48 4', ...SW(4) }, 'tan', { stroke: true })
  ],
  'síntesis': [
    s('circle', { cx: 30, cy: 40, r: 14 }, 'red'),
    s('circle', { cx: 30, cy: 80, r: 14 }, 'blue'),
    s('circle', { cx: 30, cy: 120, r: 14 }, 'yellow'),
    arrow('M48 44l30 26M48 80h28M48 116l30-26', 'gray', 4),
    s('path', { d: wedge(112, 80, 30, -90, 30) }, 'red', { accent: true }),
    s('path', { d: wedge(112, 80, 30, 30, 150) }, 'yellow'),
    s('path', { d: wedge(112, 80, 30, 150, 270) }, 'blue')
  ],
  'sólido': [
    s('path', { d: 'M36 56l44-22 44 22-44 22z' }, 'sky'),
    s('path', { d: 'M36 56l44 22v52l-44-22z' }, 'blue', { accent: true }),
    s('path', { d: 'M124 56l-44 22v52l44-22z' }, 'navy'),
    s('ellipse', { cx: 80, cy: 138, rx: 50, ry: 6 }, 'gray')
  ],
  tinta: [
    s('path', { d: 'M18 134q4-14 30-12t58 4q20 2 10 10z' }, 'navy'),
    s('rect', { x: 54, y: 40, width: 24, height: 16, rx: 3 }, 'dark'),
    s('path', { d: 'M48 56h36q10 0 10 10v44q0 8-8 8H46q-8 0-8-8V66q0-10 10-10z' }, 'navy', { accent: true }),
    s('rect', { x: 46, y: 76, width: 40, height: 24, rx: 3 }, 'cream'),
    s('path', { d: 'M100 120l30-90', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 122l-4 12 10-8z' }, 'dark')
  ],
  transformar: [
    s('path', { d: dots([[22, 112], [34, 106], [46, 104], [58, 108]], 8) }, 'green'),
    s('circle', { cx: 66, cy: 100, r: 9 }, 'mint'),
    arrow('M80 80h20M92 72l8 8-8 8'),
    s('path', { d: ells([[110, 70, 15, 13], [142, 70, 15, 13]]) }, 'purple', { accent: true }),
    s('path', { d: ells([[114, 96, 11, 10], [138, 96, 11, 10]]) }, 'pink'),
    s('path', { d: 'M126 62v42M124 62l-6-12M128 62l6-12', ...SW(4) }, 'dark', { stroke: true })
  ],
  vano: [
    s('path', { d: 'M82 14v58', ...DASH(6, '8 6') }, 'blue', { stroke: true }),
    s('path', { d: 'M42 66h80l-10 58H52z' }, 'gray', { accent: true }),
    s('ellipse', { cx: 82, cy: 66, rx: 40, ry: 8 }, 'dark'),
    s('circle', { cx: 82, cy: 108, r: 6 }, 'dark'),
    s('path', { d: drop(82, 128, 4) + drop(74, 142, 3) + drop(92, 140, 3) }, 'blue')
  ],
  'variación': [
    s('rect', { x: 14, y: 66, width: 26, height: 26 }, 'red'),
    s('rect', { x: 46, y: 60, width: 32, height: 32, rx: 8 }, 'orange'),
    s('rect', { x: 84, y: 54, width: 38, height: 38, rx: 16 }, 'yellow', { accent: true }),
    s('circle', { cx: 134, cy: 76, r: 12 }, 'green'),
    s('path', { d: 'M18 116q16-12 30 0t30 0 30 0 30 0', ...SW(5) }, 'purple', { stroke: true })
  ],
  afiliado: [
    s('rect', { x: 18, y: 36, width: 124, height: 88, rx: 10 }, 'blue', { accent: true }),
    s('rect', { x: 28, y: 50, width: 42, height: 52, rx: 4 }, 'white'),
    s('circle', { cx: 49, cy: 70, r: 10 }, 'skin'),
    s('path', { d: busts([49], 102, 26, 20) }, 'navy'),
    s('path', { d: 'M82 62h46M82 78h46M82 94h30', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: star(124, 104, 10) }, 'yellow')
  ],
  ahorro: [
    s('path', { d: 'M56 120v14M98 120v14', ...SW(10) }, 'pink', { stroke: true }),
    s('ellipse', { cx: 78, cy: 96, rx: 50, ry: 36 }, 'pink', { accent: true }),
    s('path', { d: 'M52 66l4-16 14 12z' }, 'pink'),
    s('ellipse', { cx: 128, cy: 96, rx: 8, ry: 12 }, 'red'),
    s('path', { d: dots([[100, 88]], 4) }, 'dark'),
    s('rect', { x: 64, y: 62, width: 26, height: 5, rx: 2 }, 'dark'),
    s('circle', { cx: 77, cy: 36, r: 14 }, 'yellow'),
    s('circle', { cx: 77, cy: 36, r: 8 }, 'orange')
  ],
  alimentar: [
    s('circle', { cx: 56, cy: 86, r: 42 }, 'skin'),
    s('path', { d: 'M24 56q30-30 62-2q-30-12-62 2z' }, 'brown'),
    s('path', { d: 'M38 80q6-6 12 0M64 80q6-6 12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 62, cy: 108, rx: 12, ry: 10 }, 'red'),
    s('path', { d: 'M88 104l52-30', ...SW(6) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 82, cy: 106, rx: 14, ry: 9, transform: 'rotate(-30 82 106)' }, 'gray'),
    s('path', { d: ells([[82, 100, 8, 5]]) }, 'orange', { accent: true })
  ],
  arabio: [
    s('circle', { cx: 128, cy: 30, r: 12 }, 'yellow'),
    s('path', { d: 'M14 136q30-26 64-10t68-6v16H14z' }, 'tan'),
    s('path', { d: 'M58 106v28M68 106v28M100 106v28M110 106v28', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M46 108q0-20 18-22q14-28 34-4q14 2 16 26z' }, 'brown', { accent: true }),
    s('path', { d: 'M110 98q12-10 14-36', ...SW(10) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 132, cy: 60, rx: 12, ry: 7 }, 'brown'),
    s('path', { d: 'M46 104q-8 6-6 16', ...SW(3) }, 'brown', { stroke: true })
  ],
  'asiático': [
    s('rect', { x: 14, y: 30, width: 132, height: 100, rx: 8 }, 'sky'),
    s('path', { d: 'M22 48q14-8 28 0q4 14-8 22q-2 14-8 20q-12-12-12-24q-6-8 0-18z' }, 'gray'),
    s('path', { d: 'M40 96q8-4 12 4q-2 14-8 22q-6-10-4-26z' }, 'gray'),
    s('path', { d: 'M60 52q10-8 18-2q-2 8-10 10l6 6q6 18-6 28q-12-6-10-22q-6-10 2-20z' }, 'gray'),
    s('path', { d: 'M82 42q30-12 54 2q4 14-10 22q-4 12-14 14q-8-6-14 0q-10-4-12-14q-10-10-4-24z' }, 'orange', { accent: true }),
    s('path', { d: 'M114 102q12-4 20 4q-2 10-14 10q-8-6-6-14z' }, 'gray'),
    s('path', { d: 'M108 70c-8-8-10-12-10-17a10 10 0 0 1 20 0c0 5-2 9-10 17z' }, 'red'),
    s('circle', { cx: 108, cy: 53, r: 3.5 }, 'white')
  ],
  auge: [
    s('path', { d: 'M22 30v106h122', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: rects([[34, 112, 18, 22], [58, 96, 18, 38], [82, 76, 18, 58], [106, 52, 18, 82]]) }, 'green'),
    arrow('M34 100L66 80l20 6 38-56M108 30h16v16', 'orange', 6),
    s('path', { d: star(130, 20, 9) }, 'yellow', { accent: true })
  ],
  'biografía': [
    s('rect', { x: 34, y: 18, width: 92, height: 124, rx: 6 }, 'purple', { accent: true }),
    s('rect', { x: 34, y: 18, width: 12, height: 124, rx: 4 }, 'navy'),
    s('rect', { x: 58, y: 34, width: 56, height: 64, rx: 4 }, 'cream'),
    s('circle', { cx: 86, cy: 58, r: 12 }, 'skin'),
    s('path', { d: busts([86], 98, 34, 24) }, 'brown'),
    s('path', { d: 'M62 112h48M68 124h36', ...SW(4) }, 'yellow', { stroke: true })
  ],
  citar: [
    ...openBook(64, 84, 'white', 'brown'),
    s('path', { d: 'M18 98h36M18 108h36M18 118h28', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: bubble(76, 14, 70, 46) }, 'sky', { accent: true }),
    s('path', { d: 'M88 30h46M88 42h32', ...SW(4) }, 'navy', { stroke: true }),
    arrow('M40 92q4-36 34-46', 'orange', 4)
  ],
  col: [
    s('circle', { cx: 80, cy: 84, r: 56 }, 'green'),
    s('circle', { cx: 80, cy: 88, r: 38 }, 'mint', { accent: true }),
    s('path', { d: 'M80 52q-24 16-18 66M80 52q26 18 16 66M80 52v70', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M30 74q-10 30 14 56M130 74q10 30-14 56', ...SW(4) }, 'mint', { stroke: true })
  ],
  comunicar: [
    s('circle', { cx: 34, cy: 110, r: 16 }, 'skin'),
    s('path', { d: busts([34], 148, 34, 18) }, 'red'),
    s('circle', { cx: 126, cy: 110, r: 16 }, 'skin'),
    s('path', { d: busts([126], 148, 34, 18) }, 'blue'),
    s('path', { d: bubble(14, 16, 74, 46) }, 'sky', { accent: true }),
    s('path', { d: 'M146 46h-58v32h48v10l12-10z' }, 'mint'),
    s('path', { d: 'M28 32h44M28 44h28M100 58h36', ...SW(4) }, 'navy', { stroke: true })
  ],
  conformar: [
    s('rect', { x: 30, y: 30, width: 48, height: 48, rx: 4 }, 'red'),
    s('rect', { x: 82, y: 30, width: 48, height: 48, rx: 4 }, 'blue'),
    s('rect', { x: 30, y: 82, width: 48, height: 48, rx: 4 }, 'green'),
    s('rect', { x: 96, y: 96, width: 48, height: 48, rx: 4 }, 'yellow', { accent: true }),
    s('path', { d: dots([[78, 54], [54, 78], [106, 78]], 8) }, 'white'),
    arrow('M100 102l-10-10M90 102v-10h10', 'dark', 4)
  ],
  construido: [
    ground(),
    s('rect', { x: 42, y: 50, width: 76, height: 86 }, 'tan', { accent: true }),
    s('path', { d: rects([[52, 62, 14, 14], [94, 62, 14, 14], [52, 88, 14, 14], [94, 88, 14, 14]]) }, 'sky'),
    s('rect', { x: 72, y: 110, width: 16, height: 26 }, 'brown'),
    s('path', { d: 'M80 50V18', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 18h24l-6 7 6 7H80z' }, 'red'),
    s('path', { d: 'M36 50h88', ...SW(6) }, 'brown', { stroke: true })
  ],
  contabilidad: [
    s('rect', { x: 18, y: 24, width: 98, height: 116, rx: 6 }, 'green', { accent: true }),
    s('rect', { x: 26, y: 32, width: 84, height: 100, rx: 3 }, 'cream'),
    s('path', { d: 'M26 52h84M26 72h84M26 92h84M26 112h84M76 32v100', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 42h16M86 62h12M86 82h18M86 102h10', ...SW(4) }, 'blue', { stroke: true }),
    s('circle', { cx: 124, cy: 118, r: 18 }, 'yellow'),
    s('circle', { cx: 124, cy: 118, r: 11 }, 'orange')
  ],
  contador: [
    s('rect', { x: 18, y: 26, width: 124, height: 108, rx: 6 }, 'brown'),
    s('rect', { x: 28, y: 36, width: 104, height: 88 }, 'cream'),
    s('path', { d: 'M28 58h104M28 80h104M28 102h104', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[40, 58], [52, 58], [100, 58], [112, 58], [124, 58]], 6) }, 'red', { accent: true }),
    s('path', { d: dots([[40, 80], [52, 80], [64, 80], [112, 80], [124, 80]], 6) }, 'blue'),
    s('path', { d: dots([[40, 102], [88, 102], [100, 102], [112, 102], [124, 102]], 6) }, 'green')
  ],
  'cátedra': [
    ground(140),
    s('path', { d: 'M46 140V30q0-12 34-16q34 4 34 16v110', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M54 34q26-12 52 0v52H54z' }, 'red', { accent: true }),
    s('rect', { x: 38, y: 86, width: 84, height: 14, rx: 4 }, 'brown'),
    s('rect', { x: 50, y: 98, width: 60, height: 10, rx: 3 }, 'red'),
    s('path', { d: 'M40 100v40M120 100v40', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: star(80, 54, 10) }, 'yellow')
  ],
  debut: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 4 }, 'navy'),
    s('path', { d: 'M56 14L36 136h88L104 14z' }, 'cream'),
    ...person(80, 136, 'purple', { accent: true }),
    s('path', { d: 'M14 14h40q-10 40 6 122H14zM146 14h-40q10 40-6 122h46z' }, 'red'),
    s('rect', { x: 14, y: 14, width: 132, height: 12 }, 'red')
  ],
  'decepción': [
    s('circle', { cx: 64, cy: 82, r: 48 }, 'skin'),
    s('path', { d: 'M38 66l14 6M90 66l-14 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[46, 82], [82, 82]], 5) }, 'dark'),
    s('path', { d: 'M46 112q18-14 36 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M122 118q-10-12-2-30q14-10 18 6q4 16-16 24z' }, 'red', { accent: true }),
    s('path', { d: 'M122 118q-6 12 2 24', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: drop(92, 98, 5) }, 'sky')
  ],
  deportista: [
    ground(),
    s('path', { d: 'M66 96L46 60M94 96l20-36', ...SW(10) }, 'skin', { stroke: true }),
    ...person(80, 136, 'green'),
    s('rect', { x: 67, y: 68, width: 26, height: 5, rx: 2 }, 'red'),
    s('path', { d: 'M70 92l10 16 10-16', ...SW(3) }, 'red', { stroke: true }),
    s('circle', { cx: 80, cy: 112, r: 8 }, 'yellow', { accent: true })
  ],
  desagradable: [
    s('circle', { cx: 62, cy: 70, r: 44 }, 'skin'),
    s('path', { d: 'M38 58l12 6-12 6M86 58l-12 6 12 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 92q18-10 36 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 94q6 16 12 0z' }, 'pink'),
    s('path', { d: 'M110 136l6-28h24l6 28z' }, 'gray'),
    s('path', { d: 'M116 102q-6-8 0-14t0-14M130 104q-6-8 0-14t0-14', ...SW(4) }, 'green', { stroke: true, accent: true })
  ],
  desorden: [
    s('rect', { x: 22, y: 92, width: 46, height: 30, rx: 3, transform: 'rotate(-18 45 107)' }, 'blue'),
    s('rect', { x: 82, y: 98, width: 52, height: 14, rx: 3, transform: 'rotate(12 108 105)' }, 'red', { accent: true }),
    s('path', { d: 'M96 34h18v26q10 2 10 12t-12 10H96z', transform: 'rotate(30 108 58)' }, 'green'),
    s('path', { d: 'M20 34h34v40H20z', transform: 'rotate(14 37 54)' }, 'white'),
    s('path', { d: 'M20 34h34v40H20z', transform: 'rotate(14 37 54)', ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 70, cy: 66, r: 10 }, 'orange'),
    s('path', { d: 'M40 136q20-16 34 0t36-2', ...SW(5) }, 'purple', { stroke: true })
  ],
  desprecio: [
    s('circle', { cx: 72, cy: 66, r: 44, transform: 'rotate(-12 72 66)' }, 'skin'),
    s('path', { d: 'M44 52q10-8 20-2M84 46q10-8 20 2', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M46 64h16M86 60h16', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 92q14 2 26-10', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M94 66q20 30 24 50', ...DASH(3) }, 'gray', { stroke: true }),
    ...person(126, 140, 'orange', { h: 18, w: 14, r: 7, accent: true })
  ],
  disponibilidad: [
    s('rect', { x: 18, y: 26, width: 124, height: 112, rx: 8 }, 'cream'),
    s('path', { d: 'M18 34a8 8 0 0 1 8-8h108a8 8 0 0 1 8 8v14H18z' }, 'red'),
    s('path', { d: 'M48 18v16M112 18v16', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: rects([[28, 58, 22, 20], [56, 58, 22, 20], [110, 58, 22, 20], [28, 84, 22, 20], [84, 84, 22, 20], [56, 110, 22, 20], [84, 110, 22, 20], [110, 110, 22, 20]]) }, 'mint'),
    s('path', { d: rects([[84, 58, 22, 20], [56, 84, 22, 20], [110, 84, 22, 20], [28, 110, 22, 20]]) }, 'gray'),
    s('path', { d: 'M90 116l5 5 9-9M34 64l5 5 9-9', ...SW(3) }, 'green', { stroke: true, accent: true })
  ],
  elaborar: [
    s('rect', { x: 30, y: 122, width: 100, height: 16, rx: 4 }, 'gray'),
    s('ellipse', { cx: 80, cy: 120, rx: 46, ry: 6 }, 'dark'),
    s('path', { d: 'M62 118q-14-22 4-44q-4-12 2-20h24q6 8 2 20q18 22 4 44z' }, 'orange', { accent: true }),
    s('path', { d: 'M24 100q14-10 34-14', ...SW(12) }, 'skin', { stroke: true }),
    s('path', { d: 'M136 100q-14-10-34-14', ...SW(12) }, 'skin', { stroke: true }),
    s('path', { d: 'M68 70h24', ...SW(3) }, 'brown', { stroke: true })
  ],
  emocionante: [
    s('path', { d: 'M14 120q20-90 44-40t40 20 48-70', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M28 136V104M58 136V82M98 136V100M126 136V52', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 72l26-22 8 10-26 22z' }, 'blue', { accent: true }),
    s('path', { d: dots([[94, 62], [106, 52]], 6) }, 'skin'),
    s('path', { d: 'M92 56l-6-12M104 46l-4-12', ...SW(4) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(40, 30, 10) + sparkle(130, 108, 8) }, 'yellow')
  ],
  estrictamente: [
    s('circle', { cx: 70, cy: 76, r: 44 }, 'skin'),
    s('path', { d: 'M40 48q26-20 60 0V36q-30-18-60 0z' }, 'dark'),
    s('path', { d: 'M44 64l18 6M96 64l-18 6', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: ring(54, 78, 10) + ring(86, 78, 10) + 'M64 78h12', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M56 102h28', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 120, y: 20, width: 16, height: 120, rx: 2 }, 'yellow', { accent: true }),
    s('path', { d: 'M120 32h8M120 46h5M120 60h8M120 74h5M120 88h8M120 102h5M120 116h8', ...SW(2) }, 'dark', { stroke: true })
  ],
  evangelio: [
    s('path', { d: rays(80, 66, 34, 56, 10, -90), ...SW(5) }, 'yellow', { stroke: true }),
    ...openBook(80, 70, 'cream', 'brown'),
    s('path', { d: 'M80 30v28M70 40h20', ...SW(5) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M86 128v12l4-4 4 4v-14', ...SW(3) }, 'red', { stroke: true })
  ],
  furia: [
    s('circle', { cx: 80, cy: 90, r: 50 }, 'red', { accent: true }),
    s('path', { d: 'M46 72l24 12M114 72l-24 12', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[60, 90], [100, 90]], 5) }, 'dark'),
    s('rect', { x: 56, y: 108, width: 48, height: 16, rx: 4 }, 'white'),
    s('path', { d: 'M56 116h48M68 108v16M80 108v16M92 108v16', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: ells([[36, 30, 14, 10], [26, 40, 10, 7], [124, 30, 14, 10], [134, 40, 10, 7]]) }, 'gray')
  ],
  gallo: [
    s('path', { d: 'M66 104q-20-10-30-50q20 8 26 24q-2-30 12-44q4 26-2 50z' }, 'green'),
    s('ellipse', { cx: 84, cy: 100, rx: 34, ry: 26 }, 'orange'),
    s('path', { d: 'M96 92q10-26 6-46', ...SW(18) }, 'orange', { stroke: true }),
    s('circle', { cx: 106, cy: 42, r: 15 }, 'orange'),
    s('path', { d: 'M94 30q2-14 8-6q4-12 10-2q8-8 8 6z' }, 'red', { accent: true }),
    s('path', { d: 'M120 40l14 5-14 5z' }, 'yellow'),
    s('path', { d: drop(118, 60, 4) }, 'red'),
    s('path', { d: 'M76 124v14M92 124v14M70 138h12M86 138h12', ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 110, cy: 40, r: 3 }, 'dark')
  ],
  'gastronomía': [
    s('path', { d: 'M48 48q-14-2-12-16q4-12 16-8q4-12 16-10q8-8 16 0q12-2 16 10q12-4 16 8q2 14-12 16z' }, 'white'),
    s('path', { d: 'M48 48q-14-2-12-16q4-12 16-8q4-12 16-10q8-8 16 0q12-2 16 10q12-4 16 8q2 14-12 16zM48 48v10h56V48', ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 80, cy: 108, rx: 46, ry: 26 }, 'white'),
    s('ellipse', { cx: 80, cy: 108, rx: 46, ry: 26, ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 74, cy: 106, rx: 22, ry: 12 }, 'brown', { accent: true }),
    s('path', { d: leaflet(92, 104, -40, 18, 6) + leaflet(92, 104, 10, 16, 5) }, 'green'),
    s('path', { d: 'M20 86v44M16 86v12q4 6 8 0V86M140 86v44M140 86q-8 10 0 24', ...SW(3) }, 'dark', { stroke: true })
  ],
  'genética': [
    s('path', { d: 'M56 18q48 31 0 62t0 62', ...SW(7) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M104 18q-48 31 0 62t0 62', ...SW(7) }, 'red', { stroke: true }),
    s('path', { d: 'M66 30h28M76 46h8M66 64h28M66 96h28M76 112h8M66 130h28', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M62 38h36M62 122h36', ...SW(5) }, 'yellow', { stroke: true })
  ],
  gimnasia: [
    ground(140),
    ...lady(60, 140, 'purple', { accent: true }),
    s('path', { d: 'M66 90l24-40', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M90 50l4-8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M94 42q30-26 40 6t-24 30 14 40', ...SW(5) }, 'pink', { stroke: true })
  ],
  'guión': [
    ...paper(22, 26, 74, 104),
    s('path', { d: 'M34 44h40M44 58h40M34 72h50M44 86h30M34 100h44M44 114h36', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 82, y: 90, width: 60, height: 44, rx: 3 }, 'dark'),
    s('path', { d: 'M80 74l58-14 4 14-58 14z' }, 'dark'),
    s('path', { d: 'M90 72l6 12M104 68l6 12M118 65l6 12', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M82 100h60', ...SW(3) }, 'yellow', { stroke: true, accent: true })
  ],
  'históricamente': [
    ground(140),
    s('path', { d: 'M26 140V62l6-6h28l6 6v78z' }, 'gray'),
    s('path', { d: 'M36 70v66M46 70v66M56 70v66', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M22 56l12-10h10l-6 10z' }, 'gray'),
    s('path', { d: 'M90 34h44M90 138h44', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M96 36q0 28 16 50q16-22 16-50zM96 136q0-28 16-50q16 22 16 50z' }, 'sky'),
    s('path', { d: 'M100 136q12-22 24 0zM106 52h12l-6 30z' }, 'yellow', { accent: true })
  ],
  honestidad: [
    s('path', { d: 'M14 112q30-10 52-6l10 14H14z' }, 'skin'),
    s('path', { d: 'M146 112q-30-10-52-6l-10 14h62z' }, 'tan'),
    s('rect', { x: 14, y: 116, width: 26, height: 22 }, 'blue'),
    s('rect', { x: 120, y: 116, width: 26, height: 22 }, 'green'),
    s('rect', { x: 52, y: 84, width: 56, height: 34, rx: 6 }, 'brown', { accent: true }),
    s('path', { d: 'M52 96h56', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: heart(80, 58, 14) }, 'red')
  ],
  humildad: [
    ground(),
    ...lean(60, 136, 26, 'blue', { accent: true }),
    s('path', { d: 'M112 136v-20', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(112, 120, -150, 16, 6) + leaflet(112, 116, -30, 16, 6) }, 'green'),
    s('circle', { cx: 112, cy: 110, r: 6 }, 'pink')
  ],
  'hígado': [
    s('path', { d: 'M18 64q10-26 50-28q40-2 66 2q14 4 8 18q-10 22-44 40q-30 16-56 24q-14 2-18-14q-10-26-6-42z' }, 'red', { accent: true }),
    s('path', { d: 'M92 40q-12 30-20 82', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: drop(82, 108, 9) }, 'green'),
    s('path', { d: 'M40 58q12-10 30-10', ...SW(4) }, 'pink', { stroke: true })
  ],
  'iluminación': [
    s('path', { d: 'M80 14v30', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 140l-4-2 16-80h24l16 80-4 2z' }, 'cream'),
    s('path', { d: 'M54 66q0-22 26-22t26 22z' }, 'navy'),
    s('ellipse', { cx: 80, cy: 68, rx: 10, ry: 6 }, 'yellow', { accent: true }),
    s('path', { d: 'M46 74l-14 4M114 74l14 4M44 60l-14-6M116 60l14-6', ...SW(4) }, 'yellow', { stroke: true }),
    s('ellipse', { cx: 80, cy: 140, rx: 48, ry: 6 }, 'yellow')
  ],
  imprescindible: [
    ground(),
    s('path', { d: 'M24 136V90q0-56 56-56t56 56v46h-24V90q0-32-32-32T48 90v46z' }, 'gray'),
    s('path', { d: 'M48 90q0-20 12-28M112 90q0-20-12-28M30 74l18 6M130 74l-18 6', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M68 32h24l-4 28H72z' }, 'orange', { accent: true }),
    s('path', { d: sparkle(110, 22, 9) + sparkle(50, 22, 6) }, 'yellow')
  ],
  indicador: [
    s('path', { d: 'M20 112a60 60 0 0 1 120 0z' }, 'dark'),
    s('path', { d: 'M32 112a48 48 0 0 1 14-34', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true }),
    s('path', { d: 'M46 78a48 48 0 0 1 68 0', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'yellow', { stroke: true }),
    s('path', { d: 'M114 78a48 48 0 0 1 14 34', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'green', { stroke: true }),
    s('path', { d: 'M80 110l30-38', ...SW(5) }, 'orange', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 110, r: 7 }, 'white'),
    s('rect', { x: 20, y: 112, width: 120, height: 12, rx: 4 }, 'gray')
  ],
  indonesio: [
    backdrop('sky', 18, 124),
    s('path', { d: 'M20 112q12-10 30-6q8 8-6 12q-14 2-24-6zM100 120q16-10 34-2q-2 10-18 10t-16-8zM72 92q10-6 18 0q-2 8-10 8t-8-8z' }, 'green'),
    s('path', { d: 'M28 84q22-30 44-8q-20 14-44 8z' }, 'green'),
    s('path', { d: 'M50 76V34', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 52, y: 34, width: 36, height: 12 }, 'red', { accent: true }),
    s('rect', { x: 52, y: 46, width: 36, height: 12 }, 'white'),
    s('path', { d: 'M52 34h36v24H52z', ...SW(1.5) }, 'gray', { stroke: true })
  ],
  juramento: [
    s('path', { d: 'M48 70V34M58 66V26M68 66V28M78 70V38', ...SW(9) }, 'skin', { stroke: true }),
    s('rect', { x: 42, y: 60, width: 40, height: 40, rx: 12 }, 'skin'),
    s('rect', { x: 48, y: 96, width: 28, height: 44 }, 'navy'),
    s('rect', { x: 90, y: 104, width: 54, height: 34, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M117 110v22M110 118h14', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M96 102q14-14 36-4', ...SW(10) }, 'skin', { stroke: true })
  ],
  legislador: [
    s('path', { d: dots(seats(58, 9), 7) + dots(seats(40, 6), 7) }, 'gray'),
    s('rect', { x: 62, y: 104, width: 36, height: 36, rx: 4 }, 'brown'),
    s('circle', { cx: 80, cy: 78, r: 11 }, 'skin'),
    s('rect', { x: 68, y: 89, width: 24, height: 18, rx: 6 }, 'blue', { accent: true }),
    s('path', { d: 'M88 104l8-12', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 140h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  libertador: [
    s('path', { d: 'M24 136V70q0-26 28-26t28 26v66', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 136V48M52 136V44M66 136V48', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 136h68', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 76l26 -10', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 42q-12-20-26-8q14 2 18 14q-14-4-22 6q16 0 30-2q16-2 24-14q-8 4-16 6q8-10 4-22q-6 12-12 20z' }, 'blue', { accent: true }),
    s('path', { d: 'M132 42l8-2-6 6z' }, 'orange'),
    s('path', { d: birds([[120, 96], [138, 82]]), ...SW(3) }, 'sky', { stroke: true })
  ],
  liceo: [
    ground(),
    s('rect', { x: 22, y: 64, width: 116, height: 72 }, 'tan'),
    s('path', { d: 'M14 66l66-34 66 34z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 54, r: 8 }, 'white'),
    s('path', { d: rects([[32, 78, 18, 16], [110, 78, 18, 16], [32, 106, 18, 16], [110, 106, 18, 16]]) }, 'sky'),
    s('rect', { x: 66, y: 100, width: 28, height: 36 }, 'brown'),
    s('path', { d: 'M80 54v-4M80 54h4', ...SW(2) }, 'dark', { stroke: true })
  ],
  mandado: [
    ground(),
    ...lean(66, 136, 8, 'blue'),
    s('path', { d: 'M90 82l-16 10', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M86 80h44l-6 50H92z' }, 'tan', { accent: true }),
    s('path', { d: 'M96 82l12-32', ...SW(8) }, 'orange', { stroke: true }),
    s('path', { d: leaflet(116, 80, -80, 26, 7) + leaflet(118, 80, -50, 20, 6) }, 'green'),
    s('path', { d: 'M24 70h18M18 86h18', ...SW(4) }, 'gray', { stroke: true })
  ],
  manifestante: [
    ground(),
    s('path', { d: 'M78 136V24', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 34, y: 18, width: 88, height: 52, rx: 4 }, 'yellow', { accent: true }),
    s('path', { d: 'M48 34h60M48 50h40', ...SW(5) }, 'orange', { stroke: true }),
    ...person(80, 136, 'red', { h: 40 }),
    s('path', { d: 'M68 104l8-16M92 104l-10-16', ...SW(8) }, 'skin', { stroke: true })
  ],
  marcador: [
    s('path', { d: 'M24 128q40-14 80-4', ...SW(14) }, 'yellow', { stroke: true }),
    s('path', { d: 'M46 108l64-64 18 18-64 64z' }, 'yellow', { accent: true }),
    s('path', { d: 'M100 54l18-18 18 18-18 18z' }, 'dark'),
    s('path', { d: 'M46 108l18 18-14 4-8-8z' }, 'dark'),
    s('path', { d: 'M62 104l40-40', ...SW(4) }, 'white', { stroke: true })
  ],
  meme: [
    s('rect', { x: 36, y: 14, width: 88, height: 132, rx: 12 }, 'dark'),
    s('rect', { x: 44, y: 28, width: 72, height: 104, rx: 3 }, 'sky'),
    s('path', { d: 'M56 66l4-22 14 12h12l14-12 4 22q4 34-24 34t-24-34z' }, 'orange', { accent: true }),
    s('path', { d: dots([[70, 72], [90, 72]], 4) }, 'dark'),
    s('path', { d: 'M72 86q8 8 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: rects([[52, 34, 56, 8], [52, 116, 56, 8]]) }, 'white')
  ],
  nasa: [
    backdrop('sky'),
    s('path', { d: 'M14 120q30-8 66 0t66 0v26H14z' }, 'tan'),
    s('path', { d: 'M72 54q38 2 64 30q-26 28-64 30q-8-30 0-60z' }, 'brown', { accent: true }),
    s('path', { d: 'M86 56q-6 28 0 56M104 62q-4 22 0 44M122 72q-2 12 0 24M72 70q34 6 60 14M72 98q34-6 60-14', ...SW(3) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 72, cy: 84, rx: 8, ry: 30 }, 'navy'),
    s('path', { d: fishes([[38, 76], [44, 104]]) }, 'orange')
  ],
  noreste: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'gray'),
    s('circle', { cx: 80, cy: 80, r: 54 }, 'white'),
    s('path', { d: 'M80 32v10M80 118v10M32 80h10M118 80h10', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 80l-8-8 44-24z' }, 'red', { accent: true }),
    s('path', { d: 'M80 80l8 8-44 24z' }, 'navy'),
    s('circle', { cx: 80, cy: 80, r: 6 }, 'dark')
  ],
  patricio: [
    s('path', { d: 'M40 146q0-56 40-56t40 56z' }, 'white'),
    s('path', { d: 'M40 146q0-56 40-56t40 56zM58 96q24 20 48 48', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 98l14 48h6q-2-34-20-48z' }, 'purple', { accent: true }),
    s('circle', { cx: 80, cy: 62, r: 24 }, 'skin'),
    s('path', { d: laurel(80, 60, 26, 14, 4) }, 'green'),
    s('path', { d: dots([[72, 62], [88, 62]], 3) }, 'dark'),
    s('path', { d: 'M74 74q6 4 12 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  poblado: [
    s('path', { d: 'M14 104q66-26 132 0v36H14z' }, 'green'),
    s('rect', { x: 70, y: 40, width: 20, height: 46 }, 'cream'),
    s('path', { d: 'M66 42l14-22 14 22z' }, 'red', { accent: true }),
    s('path', { d: rects([[22, 92, 34, 28], [104, 92, 34, 28], [56, 104, 30, 26], [90, 110, 26, 22]]) }, 'cream'),
    s('path', { d: 'M18 94l21-18 21 18zM100 94l21-18 21 18zM52 106l19-16 19 16zM86 112l17-14 17 14z' }, 'orange'),
    s('path', { d: rects([[34, 102, 10, 10], [116, 102, 10, 10], [66, 114, 10, 16], [98, 118, 10, 14]]) }, 'brown')
  ],
  'porción': [
    s('circle', { cx: 70, cy: 86, r: 52 }, 'orange'),
    s('circle', { cx: 70, cy: 86, r: 44 }, 'yellow'),
    s('path', { d: wedge(70, 86, 56, -60, 0) }, 'white'),
    s('path', { d: dots([[50, 70], [84, 112], [44, 108], [70, 96], [96, 90]], 6) }, 'red'),
    s('path', { d: 'M90 70L146 52Q150 78 132 100z' }, 'yellow', { accent: true }),
    s('path', { d: 'M146 52Q150 78 132 100', ...SW(7) }, 'orange', { stroke: true }),
    s('path', { d: dots([[124, 72], [134, 86]], 5) }, 'red')
  ],
  progresista: [
    s('path', { d: 'M14 136h30v-24h30V88h30V64h30v72z' }, 'gray'),
    ...person(90, 88, 'green', { h: 34, w: 24, r: 10, accent: true }),
    arrow('M34 50q40-34 92-28M114 14l12 8-10 10', 'orange', 6)
  ],
  'prostitución': [
    backdrop('navy'),
    s('path', { d: 'M54 136V60', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 60q0-20 22-20', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 58, r: 26, opacity: 0.35 }, 'red', { flatOnly: true }),
    s('path', { d: 'M70 44h20l-4 26h-12z' }, 'red', { accent: true }),
    s('path', { d: 'M92 128q10-2 14-14q6 6 20 8q8 2 6 8H100v12z' }, 'red'),
    s('rect', { x: 14, y: 136, width: 132, height: 10 }, 'dark')
  ],
  protector: [
    s('path', { d: 'M80 16l52 18q2 70-52 108q-54-38-52-108z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 30l40 14q0 54-40 84q-40-30-40-84z', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M62 80l12 14 26-28', ...SW(8) }, 'yellow', { stroke: true })
  ],
  proveer: [
    s('path', { d: 'M14 112q16-8 40-6l14 14H14z' }, 'skin'),
    s('rect', { x: 46, y: 66, width: 60, height: 46, rx: 3 }, 'tan', { accent: true }),
    s('path', { d: 'M46 80h60M76 66v14', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M54 66V44h12v22z' }, 'sky'),
    s('path', { d: 'M74 66q2-22 22-20q6 10-4 20z' }, 'orange'),
    arrow('M112 84h22M126 76l8 8-8 8'),
    s('path', { d: 'M146 116q-16-6-34-4', ...SW(10) }, 'tan', { stroke: true })
  ],
  reemplazar: [
    s('circle', { cx: 40, cy: 72, r: 22 }, 'gray'),
    s('rect', { x: 32, y: 92, width: 16, height: 16, rx: 3 }, 'dark'),
    s('circle', { cx: 120, cy: 72, r: 22 }, 'yellow', { accent: true }),
    s('rect', { x: 112, y: 92, width: 16, height: 16, rx: 3 }, 'dark'),
    s('path', { d: rays(120, 72, 28, 36, 6, -150).split('M').filter((_, i) => i !== 0).slice(0, 4).map(x => 'M' + x).join(''), ...SW(4) }, 'orange', { stroke: true }),
    arrow('M60 46q20-16 40 0M92 38l8 8-10 4', 'green', 5),
    arrow('M100 124q-20 16-40 0M68 132l-8-8 10-4', 'red', 5)
  ],
  relieve: [
    s('rect', { x: 20, y: 22, width: 120, height: 116, rx: 6 }, 'tan'),
    s('rect', { x: 30, y: 32, width: 100, height: 96, rx: 3 }, 'cream'),
    s('path', { d: 'M38 122l28-44 18 26 14-18 24 36z' }, 'tan', { accent: true }),
    s('path', { d: 'M40 124l28-44 18 26 14-18 24 36', ...SW(3) }, 'brown', { stroke: true }),
    s('circle', { cx: 94, cy: 54, r: 12 }, 'tan'),
    s('path', { d: 'M96 56a12 12 0 0 0 10-10', ...SW(3) }, 'brown', { stroke: true })
  ],
  'soñar': [
    s('rect', { x: 14, y: 112, width: 132, height: 22, rx: 6 }, 'blue'),
    s('ellipse', { cx: 36, cy: 106, rx: 20, ry: 10 }, 'white'),
    s('circle', { cx: 44, cy: 96, r: 14 }, 'skin'),
    s('path', { d: 'M38 96q4 4 8 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[64, 80], [74, 70]], 4) + ells([[106, 46, 38, 26]]) }, 'sky'),
    s('path', { d: star(96, 46, 12) }, 'yellow', { accent: true }),
    s('path', { d: 'M126 32a12 12 0 1 0 0 24a10 10 0 0 1 0-24z' }, 'yellow')
  ],
  tardar: [
    ground(),
    s('path', { d: 'M24 134q4-14 24-14h64q8 0 10 14z' }, 'mint'),
    s('circle', { cx: 74, cy: 102, r: 26 }, 'orange', { accent: true }),
    s('path', { d: 'M74 102a6 6 0 0 1 6 6a12 12 0 0 1-18-6a18 18 0 0 1 30-12', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M112 122l6-26M124 122l2-24', ...SW(3) }, 'mint', { stroke: true }),
    s('circle', { cx: 112, cy: 40, r: 24 }, 'white'),
    s('path', { d: ring(112, 40, 24) + 'M112 26v14l10 6', ...SW(4) }, 'dark', { stroke: true })
  ],
  tic: [
    s('circle', { cx: 74, cy: 84, r: 54 }, 'skin'),
    s('path', { d: 'M40 76q10-8 20 0', ...SW(5) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 96, cy: 76, rx: 12, ry: 6 }, 'white'),
    s('circle', { cx: 96, cy: 76, r: 5 }, 'dark'),
    s('path', { d: 'M56 112q16 6 32-2', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M118 52l10-8M124 70l14 0M120 90l10 8', ...SW(4) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M82 60l6-6 6 6 6-6 6 6', ...SW(3) }, 'dark', { stroke: true })
  ],
  trimestre: [
    s('circle', { cx: 80, cy: 80, r: 58 }, 'gray'),
    s('path', { d: wedge(80, 80, 58, -90, 0) }, 'orange', { accent: true }),
    s('path', { d: 'M80 22v116M22 80h116', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M80 80L80 22M80 80l50-29M80 80l58 0', ...SW(2) }, 'cream', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 8 }, 'dark')
  ],
  'técnicamente': [
    s('rect', { x: 18, y: 22, width: 124, height: 116, rx: 6 }, 'navy'),
    s('path', { d: 'M28 40h104M28 60h104M28 80h104M28 100h104M28 120h104M40 32v100M60 32v100M80 32v100M100 32v100M120 32v100', ...SW(1) }, 'blue', { stroke: true }),
    ...gear(68, 80, 22, 10, 'sky'),
    s('circle', { cx: 68, cy: 80, r: 8 }, 'navy'),
    s('path', { d: 'M96 112l28-28', ...SW(9) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M118 74a12 12 0 1 0 16 16l-8-2-6-6z' }, 'orange')
  ],
  abundante: [
    s('path', { d: dots([[46, 70], [70, 60]], 18) }, 'red'),
    s('path', { d: dots([[96, 64]], 18) }, 'orange'),
    s('path', { d: ells([[118, 76, 12, 18]]) }, 'yellow'),
    s('path', { d: dots([[58, 44], [86, 40], [114, 52], [34, 50]], 8) }, 'purple'),
    s('path', { d: leaflet(76, 22, -30, 18, 5) }, 'green'),
    s('path', { d: 'M22 82h116l-14 54H36z' }, 'brown', { accent: true }),
    s('path', { d: 'M28 98h104M34 116h92', ...SW(3) }, 'tan', { stroke: true })
  ],
  actualizar: [
    s('rect', { x: 44, y: 14, width: 72, height: 132, rx: 10 }, 'dark'),
    s('rect', { x: 52, y: 26, width: 56, height: 104, rx: 3 }, 'white'),
    s('path', { d: 'M80 106a22 22 0 1 1 20-30', ...SW(6) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M92 60l10 16 8-14z' }, 'green'),
    s('path', { d: 'M80 70v26M70 86l10 10 10-10', ...SW(5) }, 'blue', { stroke: true }),
    s('rect', { x: 58, y: 118, width: 44, height: 6, rx: 3 }, 'gray'),
    s('rect', { x: 58, y: 118, width: 30, height: 6, rx: 3 }, 'blue')
  ],
  adjunto: [
    ...paper(34, 26, 80, 108),
    s('path', { d: 'M48 64h52M48 80h52M48 96h52M48 112h34', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 112V30a12 12 0 0 1 24 0v76a18 18 0 0 1-36 0V42', ...SW(6) }, 'blue', { stroke: true, accent: true })
  ],
  aduana: [
    s('path', { d: 'M24 136V40h112v96h-18V58H42v78z' }, 'gray'),
    s('rect', { x: 24, y: 40, width: 112, height: 18 }, 'navy'),
    s('circle', { cx: 80, cy: 49, r: 5 }, 'red'),
    s('rect', { x: 14, y: 124, width: 132, height: 14, rx: 4 }, 'dark'),
    s('rect', { x: 56, y: 82, width: 48, height: 42, rx: 6 }, 'red', { accent: true }),
    s('path', { d: 'M68 82v-8h24v8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M46 70h68', ...DASH(3, '4 4') }, 'green', { stroke: true })
  ],
  afrontar: [
    s('path', { d: 'M74 136q-10-70 30-100q40-12 44 16q-30-10-36 16q-6 30 8 68z' }, 'blue'),
    s('path', { d: 'M104 36q40-12 44 16q-30-10-36 16', ...SW(5) }, 'white', { stroke: true }),
    ground(),
    ...person(40, 136, 'red', { accent: true }),
    s('path', { d: 'M54 104l12-10', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M24 136h34', ...SW(6) }, 'dark', { stroke: true })
  ],
  alejado: [
    s('rect', { x: 14, y: 14, width: 132, height: 64 }, 'sky'),
    s('path', { d: 'M14 78h132v62H14z' }, 'green'),
    s('path', { d: 'M74 78h12l46 62H28z' }, 'gray'),
    s('path', { d: 'M80 84v6M80 98v10M80 118v16', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M74 78V68h12v10z' }, 'cream'),
    s('path', { d: 'M72 69l8-8 8 8z' }, 'red', { accent: true }),
    s('path', { d: 'M30 78l10-24 10 24zM112 78l12-30 12 30z' }, 'dark')
  ],
  arranque: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'gray'),
    s('circle', { cx: 80, cy: 80, r: 52 }, 'dark'),
    s('circle', { cx: 80, cy: 80, r: 42 }, 'red', { accent: true }),
    s('path', { d: 'M64 62a24 24 0 1 0 32 0', ...SW(7) }, 'white', { stroke: true }),
    s('path', { d: 'M80 50v26', ...SW(7) }, 'white', { stroke: true }),
    s('path', { d: sparkle(138, 24, 10) + sparkle(22, 136, 8) }, 'yellow')
  ],
  'asignación': [
    s('path', { d: 'M18 64h80v56H18z' }, 'cream'),
    s('path', { d: 'M18 64l40 30 40-30', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M18 64h80v56H18z', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 30, y: 38, width: 56, height: 30, rx: 3 }, 'green', { accent: true }),
    s('circle', { cx: 58, cy: 52, r: 8 }, 'mint'),
    arrow('M104 92h14M112 86l6 6-6 6'),
    ...person(134, 128, 'purple', { h: 30, w: 20, r: 9 })
  ],
  augusto: [
    s('path', { d: 'M24 128q0-24 56-24t56 24q0 12-56 12t-56-12z' }, 'red'),
    s('path', { d: dots([[30, 132], [130, 132]], 5) }, 'yellow'),
    s('path', { d: 'M38 100l-6-52 26 24 22-40 22 40 26-24-6 52z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[32, 46], [80, 30], [128, 46]], 7) }, 'orange'),
    s('path', { d: dots([[58, 88], [102, 88]], 6) }, 'blue'),
    s('circle', { cx: 80, cy: 86, r: 8 }, 'red')
  ],
  auxiliar: [
    ground(),
    ...person(58, 136, 'navy', { h: 50, w: 34, r: 14 }),
    ...person(114, 136, 'orange', { h: 34, w: 24, r: 10, accent: true }),
    s('rect', { x: 92, y: 98, width: 22, height: 28, rx: 2 }, 'brown'),
    s('rect', { x: 95, y: 102, width: 16, height: 20 }, 'white'),
    s('path', { d: 'M98 108h10M98 114h8', ...SW(2) }, 'gray', { stroke: true })
  ],
  bo: [
    s('circle', { cx: 70, cy: 100, r: 30 }, 'skin'),
    s('path', { d: busts([70], 150, 60, 20) }, 'sky'),
    s('path', { d: 'M56 96q4-4 8 0M76 96q4-4 8 0M58 112q12 10 24 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 62V36M110 60V30M120 62V34M130 68V44', ...SW(8) }, 'skin', { stroke: true }),
    s('rect', { x: 96, y: 54, width: 38, height: 34, rx: 12 }, 'skin', { accent: true }),
    s('path', { d: 'M88 30q-8 10-4 24M146 40q4 12-2 24', ...SW(4) }, 'orange', { stroke: true })
  ],
  brecha: [
    s('path', { d: 'M14 34h56l-8 22 10 18-14 20 8 18-6 28H14z' }, 'red', { accent: true }),
    s('path', { d: 'M146 34H92l8 22-10 18 12 20-6 18 8 28h42z' }, 'red'),
    s('path', { d: 'M14 54h50M14 76h56M14 98h42M14 120h50M34 34v20M48 54v22M30 76v22M40 98v22M98 54h48M92 76h54M104 98h42M100 120h46M120 34v20M112 54v22M128 76v22M124 98v22', ...SW(3) }, 'cream', { stroke: true }),
    s('path', { d: 'M62 140l8-6 8 6zM86 140l6-8 8 8z' }, 'gray')
  ],
  cal: [
    s('path', { d: 'M14 20h70v120H14z' }, 'tan'),
    s('path', { d: 'M14 20h50v120H14z' }, 'white'),
    s('path', { d: 'M14 20h50v120H14z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 92h44l-6 46h-32z' }, 'gray'),
    s('ellipse', { cx: 118, cy: 92, rx: 22, ry: 6 }, 'white'),
    s('path', { d: 'M90 58l14-30', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 62, y: 54, width: 30, height: 20, rx: 3, transform: 'rotate(24 77 64)' }, 'orange', { accent: true })
  ],
  celda: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 6 }, 'gray'),
    s('rect', { x: 50, y: 30, width: 60, height: 40, rx: 3 }, 'sky'),
    s('path', { d: 'M65 30v40M80 30v40M95 30v40', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 24, y: 104, width: 62, height: 14, rx: 3 }, 'orange', { accent: true }),
    s('path', { d: 'M28 118v20M82 118v20', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 146V14M146 146V14', ...SW(6) }, 'dark', { stroke: true })
  ],
  cemento: [
    ground(140),
    s('path', { d: 'M28 140l20-38M92 140l-20-38', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 50l70-22q22 6 26 34t-14 38l-74 14q-14-30-8-64z' }, 'orange', { accent: true }),
    s('path', { d: 'M54 42q-6 34 4 68M80 34q-6 40 4 74', ...SW(5) }, 'yellow', { stroke: true }),
    s('ellipse', { cx: 30, cy: 82, rx: 10, ry: 32 }, 'dark'),
    s('path', { d: 'M100 140q4-22 20-22t22 22z' }, 'gray')
  ],
  cesar: [
    s('path', { d: 'M56 20h48l34 34v52l-34 34H56L22 106V54z' }, 'red', { accent: true }),
    s('path', { d: 'M60 30h40l28 28v44l-28 28H60L32 102V58z', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M64 76V50M74 72V44M84 72V46M94 78V54', ...SW(7) }, 'white', { stroke: true }),
    s('rect', { x: 60, y: 70, width: 40, height: 40, rx: 14 }, 'white')
  ],
  cintura: [
    s('path', { d: 'M44 18h72l-10 54q-26 6-52 0z' }, 'blue'),
    s('path', { d: 'M54 72q26 6 52 0q8 30 16 70H38q8-40 16-70z' }, 'skin'),
    s('path', { d: 'M50 76q30 14 60 0l2 12q-32 14-64 0z' }, 'yellow', { accent: true }),
    s('path', { d: 'M60 84v6M72 86v6M84 86v6M96 84v6', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M112 86q16 6 14 24', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M76 112q4 4 8 0', ...SW(3) }, 'tan', { stroke: true })
  ],
  cojones: [
    s('path', { d: burst(80, 80, 66, 46, 12) }, 'orange', { accent: true }),
    s('path', { d: burst(80, 80, 50, 36, 12) }, 'yellow'),
    s('path', { d: ells([[70, 74, 22, 14], [92, 70, 18, 14]]) }, 'dark'),
    s('path', { d: 'M86 82l-12 18h10l-6 14 18-22h-10l6-10z' }, 'yellow'),
    s('path', { d: 'M52 46l8 8M108 46l-8 8', ...SW(4) }, 'red', { stroke: true })
  ],
  colina: [
    s('rect', { x: 14, y: 14, width: 132, height: 124, rx: 8 }, 'sky'),
    s('path', { d: 'M14 138V112q40-80 132-18v44z' }, 'green', { accent: true }),
    s('path', { d: 'M76 58V40', ...SW(5) }, 'brown', { stroke: true }),
    s('circle', { cx: 76, cy: 34, r: 12 }, 'green'),
    s('path', { d: ells([[34, 34, 14, 7], [116, 28, 16, 8]]) }, 'white'),
    s('path', { d: 'M40 120q20-30 50-46', ...SW(3) }, 'mint', { stroke: true })
  ],
  comisionado: [
    ground(),
    ...person(66, 136, 'navy', { h: 50, w: 34, r: 14, accent: true }),
    s('path', { d: 'M66 88l-6 10 6 22 6-22z' }, 'red'),
    s('rect', { x: 96, y: 104, width: 40, height: 30, rx: 4 }, 'brown'),
    s('path', { d: 'M108 104v-6h16v6', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 72, y: 92, width: 12, height: 14, rx: 2 }, 'yellow'),
    s('path', { d: 'M84 104l14 2', ...SW(7) }, 'skin', { stroke: true })
  ],
  concejal: [
    ground(),
    s('rect', { x: 34, y: 66, width: 112, height: 70 }, 'cream'),
    s('rect', { x: 76, y: 30, width: 28, height: 40 }, 'tan'),
    s('path', { d: 'M72 32l18-18 18 18z' }, 'navy'),
    s('circle', { cx: 90, cy: 46, r: 8 }, 'white'),
    s('path', { d: 'M90 41v5h4M50 82v32M68 82v32M112 82v32M130 82v32', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: 'M30 66h120', ...SW(5) }, 'tan', { stroke: true }),
    ...person(34, 136, 'green', { h: 36, w: 24, r: 10, accent: true })
  ],
  'confesión': [
    ground(),
    s('path', { d: 'M54 136V46q0-26 32-26t32 26v90z' }, 'brown', { accent: true }),
    s('rect', { x: 66, y: 54, width: 40, height: 40, rx: 3 }, 'tan'),
    s('path', { d: 'M66 64h40M66 74h40M66 84h40M76 54v40M86 54v40M96 54v40', ...SW(2) }, 'brown', { stroke: true }),
    s('circle', { cx: 34, cy: 82, r: 11 }, 'skin'),
    s('path', { d: 'M22 136v-22q0-16 14-16h6q8 0 8 10v28z' }, 'blue')
  ],
  considerablemente: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 22, y: 112, width: 26, height: 24, rx: 3 }, 'sky'),
    s('rect', { x: 92, y: 26, width: 48, height: 110, rx: 4 }, 'blue', { accent: true }),
    arrow('M44 92q20-50 40-56M72 30l12 6-6 12', 'orange', 6)
  ],
  consumir: [
    s('rect', { x: 96, y: 52, width: 40, height: 84, rx: 4 }, 'red'),
    s('path', { d: 'M104 52l18-36', ...SW(5) }, 'white', { stroke: true, lineColor: 'gray' }),
    s('path', { d: 'M22 84q0-30 38-30t38 30z' }, 'orange', { accent: true }),
    s('path', { d: 'M22 96h76', ...SW(8) }, 'green', { stroke: true }),
    s('rect', { x: 20, y: 98, width: 80, height: 14, rx: 3 }, 'brown'),
    s('path', { d: 'M22 116h76q0 16-20 16H42q-20 0-20-16z' }, 'orange'),
    s('circle', { cx: 96, cy: 72, r: 14 }, 'white')
  ],
  convencional: [
    ground(),
    s('path', { d: rects([[18, 90, 32, 46], [64, 90, 32, 46], [110, 90, 32, 46]]) }, 'tan'),
    s('path', { d: 'M14 92l20-24 20 24zM60 92l20-24 20 24zM106 92l20-24 20 24z' }, 'gray'),
    s('path', { d: 'M60 92l20-24 20 24z' }, 'blue', { accent: true }),
    s('path', { d: rects([[28, 112, 12, 24], [74, 112, 12, 24], [120, 112, 12, 24]]) }, 'brown'),
    s('path', { d: rects([[24, 96, 8, 8], [70, 96, 8, 8], [116, 96, 8, 8]]) }, 'sky')
  ],
  corporal: [
    s('circle', { cx: 80, cy: 28, r: 14 }, 'skin'),
    s('path', { d: 'M62 50h36l16 36M62 50l-16 36', ...SW(10) }, 'skin', { stroke: true }),
    s('rect', { x: 62, y: 44, width: 36, height: 50, rx: 10 }, 'skin'),
    s('path', { d: 'M70 92l-6 48M90 92l6 48', ...SW(12) }, 'skin', { stroke: true }),
    s('rect', { x: 62, y: 88, width: 36, height: 18, rx: 4 }, 'blue'),
    s('path', { d: heart(74, 62, 8) }, 'red', { accent: true })
  ],
  cuna: [
    s('path', { d: 'M26 126q54 22 108 0', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M28 64h104v46q0 16-16 16H44q-16 0-16-16z' }, 'tan'),
    s('path', { d: 'M44 64v60M60 64v62M76 64v62M92 64v62M108 64v62M122 64v58', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M28 64h104', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 58, cy: 54, r: 14 }, 'skin'),
    s('path', { d: 'M68 50q30-10 60 4v10H68z' }, 'pink', { accent: true }),
    s('path', { d: 'M52 54q3 3 6 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  desacuerdo: [
    s('circle', { cx: 34, cy: 112, r: 16 }, 'skin'),
    s('path', { d: busts([34], 148, 34, 18) }, 'red'),
    s('circle', { cx: 126, cy: 112, r: 16 }, 'skin'),
    s('path', { d: busts([126], 148, 34, 18) }, 'blue'),
    s('path', { d: 'M24 58a26 22 0 1 1 26 22l-14 10 4-12q-16-8-16-20z' }, 'mint'),
    s('path', { d: 'M136 58a26 22 0 1 0-26 22l14 10-4-12q16-8 16-20z' }, 'pink'),
    s('path', { d: 'M86 40l-10 24h10l-8 22 20-28H88l8-18z' }, 'orange', { accent: true }),
    s('circle', { cx: 50, cy: 56, r: 9 }, 'green'),
    s('rect', { x: 102, y: 48, width: 16, height: 16 }, 'red')
  ],
  desgraciadamente: [
    ground(),
    s('path', { d: 'M40 136q-6-16 16-18q8-10 24-6q22-8 28 8q18 2 16 16z' }, 'pink', { accent: true }),
    s('path', { d: 'M66 116l16-60 16 60z' }, 'tan'),
    s('path', { d: 'M66 116l16-60 16 60zM74 86l16 14M90 86l-16 14', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: drop(40, 106, 5) + drop(124, 110, 5) }, 'pink'),
    s('path', { d: ells([[30, 44, 14, 9], [46, 40, 14, 10], [120, 36, 16, 10], [136, 42, 10, 7]]) }, 'gray'),
    s('path', { d: drop(36, 64, 3) + drop(128, 58, 3) }, 'blue')
  ],
  detectar: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'dark'),
    s('path', { d: ring(80, 80, 44) + ring(80, 80, 24) + 'M80 18v124M18 80h124', ...SW(2) }, 'green', { stroke: true }),
    s('path', { d: wedge(80, 80, 60, -90, -40) }, 'green', { opacity: 0.6 }),
    s('path', { d: 'M80 80V20', ...SW(4) }, 'mint', { stroke: true }),
    s('circle', { cx: 108, cy: 50, r: 7 }, 'red', { accent: true }),
    s('path', { d: ring(108, 50, 13), ...SW(2) }, 'red', { stroke: true })
  ],
  docena: [
    s('path', { d: 'M14 82h132l-10 44H24z' }, 'gray'),
    s('path', { d: ells([[30, 84, 9, 12], [50, 84, 9, 12], [70, 84, 9, 12], [90, 84, 9, 12], [110, 84, 9, 12], [130, 84, 9, 12]]) }, 'cream'),
    s('path', { d: ells([[30, 60, 9, 12], [50, 60, 9, 12], [70, 60, 9, 12], [90, 60, 9, 12], [110, 60, 9, 12], [130, 60, 9, 12]]) }, 'tan', { accent: true }),
    s('path', { d: 'M14 72h132', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 126l-6-20M136 126l6-20', ...SW(3) }, 'dark', { stroke: true })
  ],
  esconder: [
    ground(),
    s('path', { d: 'M18 136q-8-30 18-40q-4-34 32-36q14-30 44-12q30-4 32 28q22 10 10 40q-2 12-6 20z' }, 'green', { accent: true }),
    s('path', { d: dots([[66, 72], [88, 72]], 9) }, 'white'),
    s('path', { d: dots([[68, 74], [90, 74]], 4) }, 'dark'),
    s('path', { d: 'M40 108q10-8 18 0M104 102q10-8 18 0M70 122q10-8 18 0', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: 'M110 44q4-14 16-14', ...SW(4) }, 'brown', { stroke: true })
  ],
  esencialmente: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'sky'),
    s('circle', { cx: 80, cy: 80, r: 44 }, 'blue'),
    s('circle', { cx: 80, cy: 80, r: 28 }, 'navy'),
    s('circle', { cx: 80, cy: 80, r: 14 }, 'yellow', { accent: true }),
    s('path', { d: rays(80, 80, 17, 22, 8), ...SW(3) }, 'yellow', { stroke: true })
  ],
  grueso: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 22, y: 36, width: 70, height: 100, rx: 4 }, 'red', { accent: true }),
    s('rect', { x: 30, y: 40, width: 58, height: 92, rx: 2 }, 'cream'),
    s('path', { d: 'M30 52h58M30 64h58M30 76h58M30 88h58M30 100h58M30 112h58M30 124h58', ...SW(1.5) }, 'tan', { stroke: true }),
    s('rect', { x: 22, y: 36, width: 8, height: 100, rx: 3 }, 'red'),
    s('rect', { x: 112, y: 36, width: 10, height: 100, rx: 2 }, 'blue'),
    arrow('M18 26h78M26 20l-8 6 8 6M88 20l8 6-8 6', 'dark', 3)
  ],
  habitualmente: [
    s('path', { d: 'M80 22a58 58 0 1 1-56 44', ...SW(7) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M12 70l12-18 14 16z' }, 'green'),
    s('path', { d: 'M54 72h44v30q0 20-22 20t-22-20z' }, 'red'),
    s('path', { d: 'M98 80q14 0 12 12t-14 10', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M66 50q-6-8 0-14M82 50q-6-8 0-14', ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 76, cy: 126, rx: 32, ry: 5 }, 'gray')
  ],
  honestamente: [
    s('circle', { cx: 50, cy: 96, r: 36 }, 'skin'),
    s('path', { d: 'M18 86q-2-36 34-36q30 0 32 30q-18-16-48-10z' }, 'dark'),
    s('path', { d: dots([[40, 96], [62, 96]], 4) }, 'dark'),
    s('path', { d: 'M42 112q10 8 20 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: bubble(80, 18, 66, 56) }, 'cream'),
    s('path', { d: bubble(80, 18, 66, 56), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: heart(113, 50, 14) }, 'red', { accent: true })
  ],
  indispensable: [
    s('path', { d: 'M14 80h34', ...SW(14) }, 'gray', { stroke: true }),
    s('rect', { x: 20, y: 64, width: 44, height: 32, rx: 16, ...SW(9) }, 'gray', { stroke: true }),
    s('rect', { x: 96, y: 64, width: 44, height: 32, rx: 16, ...SW(9) }, 'gray', { stroke: true }),
    s('rect', { x: 52, y: 58, width: 56, height: 44, rx: 20, ...SW(11) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: sparkle(80, 30, 12) + sparkle(110, 124, 8) + sparkle(46, 124, 7) }, 'yellow')
  ],
  insistir: [
    s('rect', { x: 18, y: 18, width: 64, height: 124, rx: 3 }, 'brown'),
    s('circle', { cx: 70, cy: 84, r: 5 }, 'yellow'),
    s('path', { d: 'M86 52a16 16 0 0 1 0 28M86 92a16 16 0 0 1 0 28M92 46a24 24 0 0 1 0 40', ...SW(4) }, 'orange', { stroke: true }),
    s('rect', { x: 92, y: 58, width: 34, height: 30, rx: 10 }, 'skin', { accent: true }),
    s('path', { d: 'M126 74h20', ...SW(14) }, 'blue', { stroke: true }),
    s('rect', { x: 92, y: 98, width: 34, height: 30, rx: 10 }, 'skin'),
    s('path', { d: 'M126 114h20', ...SW(14) }, 'blue', { stroke: true })
  ],
  islam: [
    ground(),
    s('rect', { x: 24, y: 86, width: 96, height: 50 }, 'cream'),
    s('path', { d: 'M38 88q0-40 34-40t34 40z' }, 'green', { accent: true }),
    s('path', { d: 'M72 48v-10', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M76 26a8 8 0 1 0 0 12a6 6 0 0 1 0-12z' }, 'yellow'),
    s('rect', { x: 124, y: 40, width: 14, height: 96 }, 'cream'),
    s('path', { d: 'M120 42l11-20 11 20z' }, 'green'),
    s('path', { d: 'M62 136v-22q10-12 20 0v22zM34 104h14v14H34zM96 104h14v14H96z' }, 'sky')
  ],
  juntar: [
    s('path', { d: 'M18 86q4 50 62 50t62-50q-20 4-30 22H48q-10-18-30-22z' }, 'skin'),
    s('path', { d: dots([[60, 96], [100, 96]], 11) }, 'red', { accent: true }),
    s('path', { d: dots([[80, 98], [70, 78]], 11) }, 'blue'),
    s('path', { d: dots([[92, 78]], 11) }, 'yellow'),
    s('path', { d: dots([[26, 40], [134, 44]], 9) }, 'green'),
    arrow('M38 48l18 16M122 52l-18 14', 'orange', 4)
  ],
  karma: [
    s('path', { d: 'M36 112q30-80 100-70q-10 70-100 70', ...DASH(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 56l24-28 24 16', ...SW(13) }, 'orange', { stroke: true, accent: true }),
    ...person(30, 140, 'blue', { h: 34, w: 24, r: 10 }),
    arrow('M50 106l-8 8 2-12', 'gray', 3)
  ],
  lata: [
    s('rect', { x: 46, y: 30, width: 68, height: 104, rx: 10 }, 'red', { accent: true }),
    s('ellipse', { cx: 80, cy: 32, rx: 34, ry: 9 }, 'gray'),
    s('ellipse', { cx: 80, cy: 32, rx: 26, ry: 6 }, 'white'),
    s('path', { d: 'M74 30h14', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 70q34 14 68-8', ...SW(10) }, 'white', { stroke: true }),
    s('rect', { x: 54, y: 40, width: 6, height: 84, rx: 3 }, 'pink'),
    s('ellipse', { cx: 80, cy: 134, rx: 32, ry: 6 }, 'gray')
  ],
  'maratón': [
    ground(),
    s('path', { d: 'M110 136V40M150 40v96', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 74q20 6 40 0', ...SW(4) }, 'red', { stroke: true }),
    ...lean(66, 136, 18, 'orange', { accent: true }),
    s('rect', { x: 70, y: 98, width: 16, height: 12, rx: 2, transform: 'rotate(18 66 136)' }, 'white'),
    s('path', { d: 'M18 64h24M14 84h22M22 104h18', ...SW(4) }, 'gray', { stroke: true }),
    ...person(44, 136, 'sky', { h: 30, w: 20, r: 9 }).map(x => ({ ...x, color: x.color === 'skin' ? 'tan' : 'sky' }))
  ],
  materno: [
    ground(),
    ...lady(70, 136, 'pink'),
    s('ellipse', { cx: 88, cy: 98, rx: 18, ry: 12 }, 'yellow', { accent: true }),
    s('circle', { cx: 100, cy: 92, r: 9 }, 'skin'),
    s('path', { d: 'M66 104q14 14 34 4', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: heart(118, 40, 12) }, 'red')
  ],
  matriz: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'pink'),
    s('circle', { cx: 80, cy: 80, r: 48 }, 'cream'),
    s('circle', { cx: 84, cy: 62, r: 15 }, 'skin'),
    s('path', { d: 'M70 74q-6 26 12 34q22 6 26-14q2-18-16-22z' }, 'skin'),
    s('path', { d: 'M80 62q3 3 6 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M118 48q14 28-4 62', ...SW(4) }, 'red', { stroke: true, accent: true })
  ],
  molestar: [
    s('circle', { cx: 70, cy: 90, r: 46 }, 'skin'),
    s('path', { d: 'M44 74l16 6M96 74l-16 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[54, 88], [86, 88]], 4) }, 'dark'),
    s('path', { d: 'M56 114q14-8 28 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M104 36q-30-20-50 0t-26 30', ...DASH(3, '4 5') }, 'gray', { stroke: true }),
    s('path', { d: ells([[118, 26, 9, 6], [128, 30, 9, 6]]) }, 'sky'),
    s('ellipse', { cx: 120, cy: 38, rx: 9, ry: 7 }, 'black', { accent: true })
  ],
  prejuicio: [
    ground(),
    ...person(54, 136, 'gray'),
    s('rect', { x: 46, y: 104, width: 20, height: 14, rx: 2 }, 'red', { accent: true }),
    s('path', { d: 'M86 52h34', ...SW(14) }, 'brown', { stroke: true }),
    s('rect', { x: 94, y: 22, width: 18, height: 30, rx: 6 }, 'brown'),
    s('rect', { x: 82, y: 60, width: 42, height: 10, rx: 2 }, 'red'),
    s('path', { d: 'M48 64q4-6 8 0M60 64q4-6 8 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  'problemática': [
    s('path', { d: 'M40 60q30-40 70 0t-40 50q-50-10-20-60q40-20 70 30t-50 30q-40-10-20-40q30-30 60 10', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M30 100q20-60 80-40t-10 60q-40 10-50-20', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M110 120q10 20 30 16M30 60q-10-20-14-34', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M100 120q-10 14 4 22', ...SW(5) }, 'blue', { stroke: true })
  ],
  'proteína': [
    s('ellipse', { cx: 80, cy: 128, rx: 62, ry: 10 }, 'gray'),
    s('path', { d: 'M42 116q-28-10-20-46q14-30 50-22q24 8 22 34q-6 18-22 22z' }, 'brown', { accent: true }),
    s('path', { d: 'M64 104l18 14', ...SW(9) }, 'white', { stroke: true, lineColor: 'gray' }),
    s('path', { d: dots([[86, 114], [90, 124]], 6) }, 'white'),
    s('ellipse', { cx: 118, cy: 104, rx: 24, ry: 20 }, 'white'),
    s('ellipse', { cx: 118, cy: 104, rx: 24, ry: 20, ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 116, cy: 104, r: 10 }, 'yellow')
  ],
  rapidez: [
    s('circle', { cx: 92, cy: 86, r: 50 }, 'white'),
    s('path', { d: ring(92, 86, 50), ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('rect', { x: 84, y: 24, width: 16, height: 12, rx: 2 }, 'red'),
    s('path', { d: 'M92 86l22-26', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M92 50v6M128 86h-6M92 122v-6M56 86h6', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 64h26M18 86h20M14 108h26', ...SW(5) }, 'orange', { stroke: true })
  ],
  reparar: [
    s('rect', { x: 18, y: 96, width: 124, height: 42, rx: 6 }, 'red', { accent: true }),
    s('path', { d: 'M58 96v-10h44v10', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 112h124', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 84l60-60', ...SW(9) }, 'gray', { stroke: true }),
    s('path', { d: 'M94 16a14 14 0 1 0 18 18l-8-2-8-8z' }, 'gray'),
    s('path', { d: 'M118 84L66 32', ...SW(8) }, 'brown', { stroke: true }),
    s('rect', { x: 46, y: 16, width: 34, height: 18, rx: 3, transform: 'rotate(45 63 25)' }, 'dark')
  ],
  serrano: [
    s('rect', { x: 14, y: 14, width: 132, height: 124, rx: 8 }, 'sky'),
    s('path', { d: 'M14 138V96l30-40 22 26 30-50 50 70v36z' }, 'green'),
    s('path', { d: 'M86 48l10-16 10 16-10-4z' }, 'white'),
    s('path', { d: 'M60 76q8-6 14 2q22-4 22 22q-2 28-24 36q-18 4-22-18q-4-24 10-42z' }, 'red', { accent: true }),
    s('path', { d: 'M62 84q-2 20 14 40', ...SW(5) }, 'cream', { stroke: true }),
    s('path', { d: 'M64 74l-4-12', ...SW(4) }, 'brown', { stroke: true })
  ],
  'sinónimo': [
    s('path', { d: bubble(14, 22, 62, 52) }, 'sky'),
    s('path', { d: 'M146 22H90a8 8 0 0 0-8 8v36a8 8 0 0 0 8 8h34l12 12V74h2a8 8 0 0 0 8-8V30a8 8 0 0 0-8-8z' }, 'mint'),
    s('path', { d: star(45, 46, 14) + star(114, 46, 14) }, 'yellow', { accent: true }),
    s('path', { d: 'M62 112h36M62 126h36', ...SW(6) }, 'dark', { stroke: true })
  ],
  soto: [
    s('path', { d: 'M14 116q40-14 66 0t66-4v22q-36 10-66 0t-66 6z' }, 'blue'),
    s('path', { d: 'M14 104h132v12q-36-10-66 4t-66-4z' }, 'mint'),
    s('path', { d: 'M40 104V78M80 104V70M118 104V80', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: dots([[40, 66], [118, 66]], 20) }, 'green', { accent: true }),
    s('path', { d: dots([[80, 52], [62, 80], [100, 82]], 18) }, 'green'),
    s('path', { d: dots([[30, 100], [134, 100]], 8) }, 'green')
  ],
  terrestre: [
    backdrop('navy'),
    s('circle', { cx: 80, cy: 82, r: 50 }, 'blue', { accent: true }),
    s('path', { d: 'M44 58q14-14 30-6q4 14-8 20q-2 16-14 18q-12-14-8-32zM92 46q20 0 30 18q-8 6-16 2q-4 14-14 6q-8-14 0-26zM84 100q16-4 24 8q-6 14-18 12q-10-8-6-20z' }, 'green'),
    s('path', { d: dots([[24, 28], [136, 30], [30, 134], [132, 128], [118, 20]], 2) }, 'white'),
    s('circle', { cx: 136, cy: 132, r: 7 }, 'gray')
  ],
  vacuna: [
    s('path', { d: 'M38 122l58-58', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 66, y: 44, width: 22, height: 70, rx: 3, transform: 'rotate(45 77 79)' }, 'sky', { accent: true }),
    s('rect', { x: 70, y: 74, width: 14, height: 36, rx: 2, transform: 'rotate(45 77 79)' }, 'blue'),
    s('path', { d: 'M104 56l18-18M112 30l18 18M116 64l14-14', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 100, y: 96, width: 26, height: 40, rx: 4 }, 'white'),
    s('path', { d: 'M100 96h26v40h-26z', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 102, y: 88, width: 22, height: 10, rx: 2 }, 'red')
  ],
  verso: [
    s('rect', { x: 26, y: 18, width: 84, height: 124, rx: 4 }, 'cream'),
    s('path', { d: 'M38 36h50M38 48h40M38 60h52M38 72h34M38 94h48M38 106h40M38 118h52M38 130h30', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 116q4-60 40-96q6 40-34 90z' }, 'purple', { accent: true }),
    s('path', { d: 'M96 124q12-38 34-82', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M96 124l4-12', ...SW(3) }, 'dark', { stroke: true })
  ],
  volante: [
    s('path', { d: ring(80, 80, 54), ...SW(16) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 72h104M80 80v52', ...SW(12) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 18 }, 'gray', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 8 }, 'red'),
    s('path', { d: 'M40 40q20-16 44-16', ...SW(4) }, 'gray', { stroke: true })
  ],
  acogido: [
    s('path', { d: 'M20 70l60-46 60 46', ...SW(9) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M18 136q-4-42 22-42q8 14 0 42zM142 136q4-42-22-42q-8 14 0 42z' }, 'skin'),
    ...person(80, 136, 'yellow', { h: 30, w: 22, r: 10 }),
    s('path', { d: heart(80, 62, 9) }, 'pink'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  'afición': [
    s('path', { d: dots([[30, 86], [62, 80], [96, 80], [130, 86]], 13) }, 'skin'),
    s('path', { d: busts([30, 62, 96, 130], 140, 28, 40) }, 'blue'),
    s('path', { d: 'M20 66q-6-30 4-46M52 58l-4-34M108 60l6-34M140 66q6-30-4-46', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M24 22q40 14 80-2t40 4', ...SW(10) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M48 22q12 6 24 2M96 18q12 4 20 6', ...SW(4) }, 'white', { stroke: true })
  ],
  aislado: [
    backdrop('sky'),
    s('path', { d: 'M14 108q66-12 132 0v38H14z' }, 'blue'),
    s('ellipse', { cx: 80, cy: 110, rx: 30, ry: 10 }, 'tan', { accent: true }),
    s('path', { d: 'M78 108q-4-28 8-50', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(86, 58, -160, 30, 8) + leaflet(86, 58, -20, 30, 8) + leaflet(86, 58, 150, 26, 7) + leaflet(86, 58, 30, 26, 7) }, 'green'),
    s('path', { d: birds([[124, 40]]), ...SW(3) }, 'dark', { stroke: true })
  ],
  alojamiento: [
    s('rect', { x: 14, y: 70, width: 132, height: 44, rx: 6 }, 'blue', { accent: true }),
    s('rect', { x: 14, y: 46, width: 14, height: 90, rx: 4 }, 'brown'),
    s('rect', { x: 132, y: 80, width: 14, height: 56, rx: 4 }, 'brown'),
    s('rect', { x: 30, y: 54, width: 36, height: 18, rx: 8 }, 'white'),
    s('path', { d: 'M30 54h36v18H30z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: ring(110, 34, 10) + 'M118 40l14 14M126 48l4-4', ...SW(5) }, 'yellow', { stroke: true }),
    s('rect', { x: 14, y: 112, width: 132, height: 8 }, 'navy')
  ],
  'anónimo': [
    s('path', { d: 'M28 146q0-46 52-46t52 46z' }, 'dark'),
    s('path', { d: 'M40 98q-6-70 40-70t40 70q-10 14-40 14T40 98z' }, 'dark', { accent: true }),
    s('ellipse', { cx: 80, cy: 82, rx: 26, ry: 30 }, 'black'),
    s('path', { d: dots([[70, 80], [90, 80]], 4) }, 'white'),
    s('path', { d: 'M54 132l6-20M106 132l-6-20', ...SW(3) }, 'gray', { stroke: true })
  ],
  aula: [
    s('rect', { x: 26, y: 16, width: 108, height: 56, rx: 4 }, 'brown'),
    s('rect', { x: 32, y: 22, width: 96, height: 44, rx: 2 }, 'green', { accent: true }),
    s('path', { d: 'M42 36h40M42 50h26', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: rects([[18, 96, 36, 8], [62, 96, 36, 8], [106, 96, 36, 8], [26, 124, 36, 8], [98, 124, 36, 8]]) }, 'tan'),
    s('path', { d: 'M22 104v14M50 104v14M66 104v14M94 104v14M110 104v14M138 104v14M30 132v10M58 132v10M102 132v10M130 132v10', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: dots([[36, 86], [80, 86], [124, 86]], 8) }, 'skin')
  ],
  'automático': [
    s('rect', { x: 14, y: 22, width: 132, height: 16, rx: 3 }, 'gray'),
    s('circle', { cx: 80, cy: 30, r: 4 }, 'green', { accent: true }),
    s('rect', { x: 18, y: 38, width: 40, height: 100 }, 'sky'),
    s('rect', { x: 102, y: 38, width: 40, height: 100 }, 'sky'),
    s('path', { d: 'M18 38h40v100H18zM102 38h40v100h-40z', ...SW(3) }, 'gray', { stroke: true }),
    arrow('M54 88H34M42 80l-8 8 8 8M106 88h20M118 80l8 8-8 8', 'blue', 5),
    s('rect', { x: 14, y: 136, width: 132, height: 6, rx: 3 }, 'dark')
  ],
  bot: [
    s('path', { d: 'M80 34V20', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 18, r: 6 }, 'red'),
    s('rect', { x: 34, y: 34, width: 92, height: 72, rx: 18 }, 'gray', { accent: true }),
    s('rect', { x: 46, y: 50, width: 68, height: 36, rx: 12 }, 'navy'),
    s('path', { d: dots([[66, 66], [94, 66]], 6) }, 'sky'),
    s('rect', { x: 26, y: 60, width: 8, height: 20, rx: 3 }, 'dark'),
    s('rect', { x: 126, y: 60, width: 8, height: 20, rx: 3 }, 'dark'),
    s('path', { d: bubble(70, 108, 72, 38) }, 'mint'),
    s('path', { d: dots([[94, 122], [106, 122], [118, 122]], 3) }, 'green')
  ],
  boxeo: [
    s('path', { d: 'M34 70q0-36 34-36q28 0 28 30v28q0 14-14 14H48q-14 0-14-14z' }, 'red', { accent: true }),
    s('path', { d: 'M40 74q-12-10-2-22q8-4 16 4', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 44, y: 104, width: 40, height: 26, rx: 4 }, 'white'),
    s('path', { d: 'M44 104h40v26H44z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 80q0-30 26-30q22 0 22 24v22q0 12-12 12H98q-12 0-12-12z' }, 'blue'),
    s('rect', { x: 92, y: 106, width: 34, height: 22, rx: 4 }, 'navy')
  ],
  'béisbol': [
    s('path', { d: 'M26 136l84-96', ...SW(10) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 52l26-30', ...SW(16) }, 'brown', { stroke: true }),
    s('circle', { cx: 104, cy: 108, r: 26 }, 'white'),
    s('path', { d: ring(104, 108, 26), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 90q10 18 0 36M122 90q-10 18 0 36', ...DASH(3, '3 3') }, 'red', { stroke: true, accent: true })
  ],
  calcular: [
    s('rect', { x: 34, y: 16, width: 92, height: 128, rx: 10 }, 'dark'),
    s('rect', { x: 44, y: 28, width: 72, height: 26, rx: 3 }, 'mint', { accent: true }),
    s('path', { d: rects([[44, 64, 16, 14], [66, 64, 16, 14], [88, 64, 16, 14], [44, 86, 16, 14], [66, 86, 16, 14], [88, 86, 16, 14], [44, 108, 16, 14], [66, 108, 16, 14], [88, 108, 16, 14]]) }, 'gray'),
    s('rect', { x: 108, y: 64, width: 10, height: 58, rx: 3 }, 'orange'),
    s('path', { d: 'M96 36v10M90 41h12', ...SW(3) }, 'dark', { stroke: true })
  ],
  ceniza: [
    s('path', { d: 'M22 136q10-30 58-32t58 32z' }, 'gray', { accent: true }),
    s('path', { d: 'M40 124q20-10 40-6M78 112q24-2 40 10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[62, 120], [96, 118], [80, 128]], 4) }, 'orange'),
    s('path', { d: 'M56 96q-12-14 0-28t0-28M84 96q-12-14 0-28t0-28M110 96q-10-12 0-24', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 134l26-10M88 126l28 8', ...SW(5) }, 'dark', { stroke: true })
  ],
  comarca: [
    s('path', { d: 'M18 30l40-10 44 10 40-10v110l-40 10-44-10-40 10z' }, 'mint'),
    s('path', { d: 'M58 20v110M102 30v110', ...SW(2) }, 'green', { stroke: true }),
    s('path', { d: 'M46 58q20-14 46-4q22 6 20 30q-4 24-30 24q-30-2-38-22q-8-16 2-28z' }, 'yellow', { accent: true }),
    s('path', { d: 'M46 58q20-14 46-4q22 6 20 30q-4 24-30 24q-30-2-38-22q-8-16 2-28z', ...DASH(3, '5 4') }, 'orange', { stroke: true }),
    s('path', { d: 'M18 116q30-10 50 4t74-8', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M78 82l10-12 10 12z' }, 'brown')
  ],
  comodidad: [
    s('rect', { x: 34, y: 34, width: 92, height: 70, rx: 18 }, 'purple'),
    s('rect', { x: 18, y: 72, width: 30, height: 52, rx: 12 }, 'purple', { accent: true }),
    s('rect', { x: 112, y: 72, width: 30, height: 52, rx: 12 }, 'purple'),
    s('rect', { x: 44, y: 90, width: 72, height: 30, rx: 8 }, 'pink'),
    s('path', { d: 'M28 124v12M132 124v12', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 58, y: 56, width: 44, height: 30, rx: 10 }, 'yellow')
  ],
  'conducción': [
    s('rect', { x: 14, y: 96, width: 132, height: 44 }, 'dark'),
    s('path', { d: 'M18 120h20M58 120h20M98 120h20M138 120h8', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M44 74l14-24h36l18 24z' }, 'sky'),
    s('circle', { cx: 74, cy: 64, r: 8 }, 'skin'),
    s('rect', { x: 26, y: 72, width: 108, height: 26, rx: 8 }, 'blue', { accent: true }),
    s('path', { d: dots([[50, 98], [110, 98]], 11) }, 'black'),
    s('path', { d: dots([[50, 98], [110, 98]], 4) }, 'gray')
  ],
  'confirmación': [
    s('circle', { cx: 80, cy: 80, r: 58 }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 46, ...SW(4) }, 'mint', { stroke: true }),
    s('path', { d: 'M54 82l18 18 34-38', ...SW(12) }, 'white', { stroke: true })
  ],
  'cortesía': [
    ground(),
    s('rect', { x: 18, y: 36, width: 40, height: 100 }, 'brown'),
    s('path', { d: 'M58 36l22 8v84l-22 8z' }, 'tan'),
    ...lean(98, 136, 22, 'navy'),
    s('path', { d: 'M88 104l-10-20', ...SW(7) }, 'skin', { stroke: true }),
    ...person(134, 136, 'pink', { h: 36, w: 22, r: 10, accent: true })
  ],
  'célebre': [
    s('path', { d: 'M52 140l-4-90h64l-4 90z' }, 'red'),
    ...person(80, 124, 'purple', { accent: true }),
    s('path', { d: star(80, 30, 14) }, 'yellow'),
    s('rect', { x: 14, y: 70, width: 24, height: 18, rx: 3 }, 'dark'),
    s('rect', { x: 122, y: 60, width: 24, height: 18, rx: 3 }, 'dark'),
    s('path', { d: sparkle(26, 56, 10) + sparkle(134, 46, 10) }, 'yellow')
  ],
  'cúpula': [
    ground(),
    s('rect', { x: 26, y: 94, width: 108, height: 42 }, 'cream'),
    s('path', { d: 'M38 98v34M56 98v34M74 98v34M86 98v34M104 98v34M122 98v34', ...SW(5) }, 'tan', { stroke: true }),
    s('rect', { x: 40, y: 84, width: 80, height: 12 }, 'tan'),
    s('path', { d: 'M44 84q0-44 36-44t36 44z' }, 'sky', { accent: true }),
    s('path', { d: 'M80 40v44M62 50q-6 16-6 34M98 50q6 16 6 34', ...SW(2) }, 'blue', { stroke: true }),
    s('rect', { x: 74, y: 22, width: 12, height: 18, rx: 2 }, 'cream'),
    s('path', { d: 'M80 22v-8', ...SW(3) }, 'dark', { stroke: true })
  ],
  'diputación': [
    s('path', { d: dots([[40, 64], [80, 64], [120, 64]], 13) }, 'skin'),
    s('path', { d: busts([40, 80, 120], 104, 30, 28) }, 'navy'),
    s('rect', { x: 14, y: 100, width: 132, height: 40, rx: 4 }, 'brown', { accent: true }),
    s('path', { d: rects([[30, 106, 20, 8], [70, 106, 20, 8], [110, 106, 20, 8]]) }, 'white'),
    s('path', { d: 'M48 100l8-14M88 100l8-14M128 100l8-14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 20v24', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 20h22v14H80z' }, 'green')
  ],
  estudiantil: [
    s('rect', { x: 36, y: 40, width: 88, height: 102, rx: 22 }, 'blue', { accent: true }),
    s('path', { d: 'M56 40q0-24 24-24t24 24', ...SW(6) }, 'navy', { stroke: true }),
    s('rect', { x: 50, y: 88, width: 60, height: 40, rx: 8 }, 'sky'),
    s('path', { d: 'M50 102h60', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M48 52v-6h10M102 52v-6h-10', ...SW(4) }, 'navy', { stroke: true }),
    s('rect', { x: 74, y: 62, width: 12, height: 16, rx: 3 }, 'yellow')
  ],
  eternidad: [
    backdrop('navy'),
    s('path', { d: 'M80 80c-14-18-40-24-40 0s26 18 40 0 40-24 40 0-26 18-40 0z', ...SW(12) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: sparkle(30, 36, 8) + sparkle(130, 124, 8) + sparkle(124, 34, 5) }, 'yellow'),
    s('path', { d: dots([[40, 124], [80, 30], [100, 132]], 2) }, 'white')
  ],
  expresidente: [
    ground(),
    s('rect', { x: 56, y: 76, width: 48, height: 60, rx: 16 }, 'navy'),
    s('path', { d: 'M60 80l40 50', ...SW(10) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 54, r: 18 }, 'skin'),
    s('path', { d: 'M62 52q0-20 18-20t18 20q-4-10-18-10t-18 10z' }, 'white'),
    s('path', { d: 'M62 52q0-20 18-20t18 20', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M114 136V96q0-8 8-8', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: dots([[73, 56], [87, 56]], 2.5) }, 'dark')
  ],
  'filósofo': [
    ground(),
    s('rect', { x: 34, y: 110, width: 56, height: 26, rx: 4 }, 'gray'),
    s('rect', { x: 46, y: 72, width: 32, height: 42, rx: 10 }, 'cream'),
    s('circle', { cx: 62, cy: 56, r: 14 }, 'skin'),
    s('path', { d: 'M50 60q12 26 24 0z' }, 'white'),
    s('path', { d: 'M50 60q12 26 24 0', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 100l2-26', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: dots([[94, 42], [104, 32]], 4) + ells([[124, 24, 18, 12]]) }, 'sky', { accent: true }),
    s('circle', { cx: 124, cy: 24, r: 5 }, 'yellow')
  ],
  fundamento: [
    s('path', { d: 'M40 70l40-34 40 34z' }, 'red'),
    s('rect', { x: 48, y: 70, width: 64, height: 40 }, 'cream'),
    s('rect', { x: 72, y: 84, width: 16, height: 26 }, 'brown'),
    s('rect', { x: 18, y: 110, width: 124, height: 32 }, 'gray', { accent: true }),
    s('path', { d: 'M18 126h124M48 110v16M80 110v16M112 110v16M34 126v16M64 126v16M96 126v16M128 126v16', ...SW(3) }, 'dark', { stroke: true })
  ],
  ginebra: [
    s('rect', { x: 34, y: 54, width: 50, height: 86, rx: 8 }, 'sky'),
    s('rect', { x: 50, y: 22, width: 18, height: 34, rx: 3 }, 'sky'),
    s('rect', { x: 48, y: 16, width: 22, height: 10, rx: 2 }, 'red'),
    s('rect', { x: 40, y: 84, width: 38, height: 28, rx: 3 }, 'cream'),
    s('path', { d: dots([[54, 96], [64, 98]], 4) }, 'navy'),
    s('path', { d: 'M96 88h44l-6 52h-32z' }, 'mint'),
    s('circle', { cx: 132, cy: 88, r: 12 }, 'green', { accent: true }),
    s('path', { d: 'M96 88h44l-6 52h-32z', ...SW(2) }, 'gray', { stroke: true })
  ],
  iris: [
    s('path', { d: 'M14 80q66-66 132 0q-66 66-132 0z' }, 'white'),
    s('path', { d: 'M14 80q66-66 132 0q-66 66-132 0z', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 30 }, 'green', { accent: true }),
    s('path', { d: rays(80, 80, 14, 28, 16), ...SW(2) }, 'mint', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'black'),
    s('circle', { cx: 90, cy: 70, r: 5 }, 'white')
  ],
  jeje: [
    s('circle', { cx: 74, cy: 84, r: 54 }, 'yellow', { accent: true }),
    s('path', { d: 'M40 70q10-10 20 0M88 70q10-10 20 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 92h60q-4 34-30 34t-30-34z' }, 'dark'),
    s('path', { d: 'M58 116q16-10 32 0q-14 10-32 0z' }, 'red'),
    s('path', { d: 'M132 50l12-8M136 70h14M132 90l12 8', ...SW(4) }, 'orange', { stroke: true })
  ],
  legitimidad: [
    ...paper(22, 18, 98, 120),
    s('path', { d: 'M36 40h70M36 56h70M36 72h56M36 88h64', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 118l-8 28 14-8 10 10 2-28z' }, 'red'),
    s('circle', { cx: 112, cy: 112, r: 20 }, 'red', { accent: true }),
    s('path', { d: burst(112, 112, 14, 10, 10) }, 'yellow')
  ],
  'lingüística': [
    s('path', { d: bubble(14, 18, 92, 64) }, 'sky'),
    s('path', { d: 'M28 38h64M28 52h48M28 66h56', ...SW(4) }, 'navy', { stroke: true }),
    s('circle', { cx: 100, cy: 98, r: 26 }, 'white', { flatOnly: true }),
    s('path', { d: ring(100, 98, 26), ...SW(8) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M120 118l22 22', ...SW(12) }, 'purple', { stroke: true }),
    s('path', { d: 'M88 92h24M88 104h16', ...SW(4) }, 'gray', { stroke: true })
  ],
  magdalena: [
    s('path', { d: 'M38 88h84l-12 50H50z' }, 'yellow', { accent: true }),
    s('path', { d: 'M52 90l4 46M66 90l2 46M80 90v46M94 90l-2 46M108 90l-4 46', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M32 92q-6-30 22-36q6-20 26-20t26 20q28 6 22 36z' }, 'tan'),
    s('path', { d: 'M50 70q14-8 24 0M86 62q14-6 24 4', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: dots([[64, 56], [96, 50], [80, 76]], 3) }, 'white')
  ],
  maldad: [
    s('path', { d: 'M38 56l-12-38 30 22zM122 56l12-38-30 22z' }, 'red'),
    s('circle', { cx: 80, cy: 86, r: 50 }, 'purple', { accent: true }),
    s('path', { d: 'M50 70l22 12M110 70l-22 12', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[62, 90], [98, 90]], 6) }, 'yellow'),
    s('path', { d: 'M54 108q26 22 52 0q-26 10-52 0z' }, 'white'),
    s('path', { d: 'M54 108q26 22 52 0', ...SW(4) }, 'dark', { stroke: true })
  ],
  maltrato: [
    s('ellipse', { cx: 92, cy: 138, rx: 52, ry: 6 }, 'gray'),
    s('path', { d: 'M24 136V40q0-20 24-20t24 20v96z', opacity: 0.25 }, 'dark', { flatOnly: true }),
    s('circle', { cx: 92, cy: 92, r: 14 }, 'skin'),
    s('path', { d: 'M74 136q-4-30 18-30t22 30z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 116q12 10 26 0', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: drop(104, 96, 4) }, 'sky'),
    s('path', { d: ells([[100, 40, 22, 12], [120, 34, 16, 10]]) }, 'gray'),
    s('path', { d: 'M86 92q3-3 6 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  matanza: [
    s('ellipse', { cx: 70, cy: 96, rx: 46, ry: 30 }, 'pink', { accent: true }),
    s('circle', { cx: 110, cy: 86, r: 18 }, 'pink'),
    s('ellipse', { cx: 124, cy: 90, rx: 7, ry: 6 }, 'red'),
    s('path', { d: 'M100 70l4-14 8 12z' }, 'pink'),
    s('path', { d: 'M44 122v16M90 122v16', ...SW(8) }, 'pink', { stroke: true }),
    s('rect', { x: 24, y: 22, width: 40, height: 26, rx: 3 }, 'gray'),
    s('path', { d: 'M64 34h30', ...SW(9) }, 'brown', { stroke: true }),
    s('path', { d: 'M28 64q-6 8-2 12M22 74q12-8 6 16', ...SW(3) }, 'brown', { stroke: true })
  ],
  misericordia: [
    s('path', { d: 'M146 30q-30 4-46 30l-14 26 10 6 18-20q14-12 32-14z' }, 'skin'),
    s('path', { d: 'M146 18v24', ...SW(14) }, 'blue', { stroke: true }),
    s('circle', { cx: 50, cy: 96, r: 12 }, 'skin'),
    s('path', { d: 'M30 136q0-26 20-26q16 0 18 18v8z' }, 'orange'),
    s('path', { d: 'M60 110l28-22', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: heart(68, 50, 14) }, 'red', { accent: true }),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  'moción': [
    s('rect', { x: 14, y: 110, width: 132, height: 16, rx: 4 }, 'brown'),
    s('path', { d: dots([[40, 82], [120, 82]], 11) }, 'skin'),
    s('path', { d: busts([40, 120], 112, 26, 18) }, 'gray'),
    s('circle', { cx: 80, cy: 78, r: 12 }, 'skin'),
    s('path', { d: busts([80], 112, 28, 22) }, 'blue'),
    s('path', { d: 'M92 94l12-50', ...SW(8) }, 'skin', { stroke: true }),
    s('rect', { x: 98, y: 18, width: 30, height: 36, rx: 2 }, 'yellow', { accent: true }),
    s('path', { d: 'M104 28h18M104 38h14', ...SW(3) }, 'orange', { stroke: true })
  ],
  naval: [
    s('path', { d: 'M14 112q11-8 22 0t22 0 22 0 22 0 22 0 22 0V146H14z' }, 'blue'),
    s('path', { d: 'M18 94h124l-16 26H32z' }, 'gray', { accent: true }),
    s('path', { d: 'M46 94V76h50v18zM62 76V60h22v16z' }, 'gray'),
    s('path', { d: rects([[52, 82, 8, 6], [66, 82, 8, 6], [80, 82, 8, 6]]) }, 'navy'),
    s('path', { d: 'M100 82h30', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M73 60V30', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M73 30h20l-5 6 5 6H73z' }, 'red'),
    s('path', { d: 'M18 106h124', ...SW(3) }, 'navy', { stroke: true })
  ],
  'niñez': [
    ground(),
    ...person(54, 136, 'yellow', { h: 40, w: 30, r: 15, accent: true }),
    s('path', { d: dots([[110, 104], [100, 96], [120, 96]], 9) }, 'brown'),
    s('ellipse', { cx: 110, cy: 124, rx: 14, ry: 12 }, 'brown'),
    s('path', { d: dots([[106, 102], [114, 102]], 2) }, 'dark'),
    s('circle', { cx: 84, cy: 126, r: 10 }, 'red'),
    s('path', { d: 'M78 120l12 12', ...SW(3) }, 'white', { stroke: true })
  ],
  nostalgia: [
    s('rect', { x: 26, y: 20, width: 92, height: 104, rx: 3, transform: 'rotate(-8 72 72)' }, 'cream'),
    s('rect', { x: 34, y: 28, width: 76, height: 70, transform: 'rotate(-8 72 72)' }, 'tan'),
    s('path', { d: 'M48 84l16-20 16 20zM52 84h24v16H52z', transform: 'rotate(-8 72 72)' }, 'brown'),
    s('circle', { cx: 92, cy: 48, r: 8, transform: 'rotate(-8 72 72)' }, 'orange'),
    s('rect', { x: 26, y: 20, width: 92, height: 104, rx: 3, transform: 'rotate(-8 72 72)', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: heart(122, 118, 16) }, 'red', { accent: true })
  ],
  'notificación': [
    s('rect', { x: 34, y: 18, width: 78, height: 126, rx: 12 }, 'dark'),
    s('rect', { x: 42, y: 30, width: 62, height: 100, rx: 3 }, 'sky'),
    s('path', { d: 'M60 92q0-30 14-32t14 32l6 6H54z' }, 'yellow'),
    s('circle', { cx: 74, cy: 104, r: 5 }, 'yellow'),
    s('circle', { cx: 112, cy: 26, r: 16 }, 'red', { accent: true }),
    s('path', { d: 'M112 18v10M112 33v1', ...SW(4) }, 'white', { stroke: true })
  ],
  protestar: [
    s('path', { d: dots([[30, 88], [68, 92], [106, 88]], 12) }, 'skin'),
    s('path', { d: busts([30, 68, 106], 140, 30, 38) }, 'green'),
    s('path', { d: 'M24 70V40M100 70V40', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: dots([[24, 36], [100, 36]], 9) }, 'skin'),
    s('path', { d: 'M76 76l20-26 6 34z' }, 'red', { accent: true }),
    s('path', { d: 'M122 56q8 8 0 18M130 50q12 14 0 30', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: busts([142], 140, 22, 30) }, 'blue')
  ],
  santuario: [
    s('path', { d: 'M14 140h132v-10H14z' }, 'gray'),
    s('path', { d: 'M26 130h108v-10H26z' }, 'gray'),
    s('path', { d: 'M32 58l48-34 48 34z' }, 'cream', { accent: true }),
    s('path', { d: 'M32 58l48-34 48 34z', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M44 62v58M64 62v58M96 62v58M116 62v58', ...SW(9) }, 'cream', { stroke: true }),
    s('path', { d: 'M80 104v16', ...SW(5) }, 'white', { stroke: true, lineColor: 'gray' }),
    s('path', { d: drop(80, 98, 4) }, 'orange'),
    s('circle', { cx: 80, cy: 98, r: 14, opacity: 0.4 }, 'yellow', { flatOnly: true })
  ],
  sarmiento: [
    s('path', { d: 'M18 120q30-20 50-4t48-30q14-20 28-14', ...SW(7) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M68 116q4-26-12-44M110 82q10 10 6 26', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M56 72a6 6 0 1 1-8-8a10 10 0 1 0 14 6', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M96 46l14-12 14 12-4 18-10 6-10-6z' }, 'green'),
    s('path', { d: dots([[112, 116], [124, 116], [118, 126], [106, 106], [118, 106], [130, 106]], 6) }, 'purple')
  ],
  serbio: [
    s('path', { d: 'M30 140V18', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 32, y: 22, width: 104, height: 24 }, 'red', { accent: true }),
    s('rect', { x: 32, y: 46, width: 104, height: 24 }, 'blue'),
    s('rect', { x: 32, y: 70, width: 104, height: 24 }, 'white'),
    s('path', { d: 'M32 22h104v72H32z', ...SW(2) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 30, cy: 140, rx: 16, ry: 5 }, 'gray')
  ],
  'simultáneamente': [
    ground(140),
    ...person(48, 100, 'red', { h: 34, w: 24, r: 11, accent: true }),
    ...person(112, 100, 'blue', { h: 34, w: 24, r: 11 }),
    s('path', { d: 'M14 52h132', ...DASH(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M40 112l-4 12M56 112l4 12M104 112l-4 12M120 112l4 12', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 140h24M100 140h24', ...SW(4) }, 'dark', { stroke: true })
  ],
  tope: [
    s('rect', { x: 18, y: 18, width: 124, height: 14, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M18 32l10 8M48 32l10 8M78 32l10 8M108 32l10 8', ...SW(3) }, 'red', { stroke: true }),
    s('rect', { x: 58, y: 44, width: 44, height: 98, rx: 6 }, 'gray'),
    s('rect', { x: 62, y: 48, width: 36, height: 90, rx: 4 }, 'green'),
    arrow('M80 124V58M70 68l10-10 10 10', 'white', 6)
  ],
  traductor: [
    s('path', { d: bubble(14, 18, 70, 50) }, 'sky'),
    s('path', { d: dots([[32, 38], [48, 38], [64, 38]], 5) }, 'navy'),
    s('path', { d: 'M146 92a8 8 0 0 0-8-8H84a8 8 0 0 0-8 8v34a8 8 0 0 0 8 8h36l12 12v-12h6a8 8 0 0 0 8-8z' }, 'mint'),
    s('path', { d: rects([[90, 100, 10, 10], [106, 100, 10, 10], [122, 100, 10, 10]]) }, 'green'),
    arrow('M100 30q30 4 32 40M124 62l8 8 8-8', 'orange', 5),
    arrow('M60 130q-30-4-32-40M36 98l-8-8-8 8', 'purple', 5),
    s('circle', { cx: 80, cy: 80, r: 4 }, 'orange', { accent: true })
  ],
  transcurso: [
    s('rect', { x: 14, y: 14, width: 132, height: 110, rx: 8 }, 'sky'),
    s('path', { d: 'M26 110q54-110 108 0', ...DASH(4) }, 'orange', { stroke: true }),
    s('circle', { cx: 34, cy: 92, r: 10 }, 'orange'),
    s('circle', { cx: 80, cy: 46, r: 14 }, 'yellow', { accent: true }),
    s('path', { d: 'M132 82a10 10 0 1 0 6 18a8 8 0 0 1-6-18z' }, 'navy'),
    s('rect', { x: 14, y: 110, width: 132, height: 30, rx: 4 }, 'green')
  ],
  urna: [
    s('rect', { x: 30, y: 62, width: 100, height: 78, rx: 4 }, 'sky', { accent: true }),
    s('path', { d: 'M30 62h100v78H30z', ...SW(3) }, 'blue', { stroke: true }),
    s('rect', { x: 60, y: 58, width: 40, height: 8, rx: 2 }, 'navy'),
    s('rect', { x: 64, y: 22, width: 32, height: 42, rx: 2, transform: 'rotate(-8 80 43)' }, 'white'),
    s('path', { d: 'M70 30l20-3M71 40l18-2', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 50l6 6 12-12', ...SW(3) }, 'green', { stroke: true }),
    s('rect', { x: 46, y: 96, width: 28, height: 30, rx: 2, transform: 'rotate(10 60 111)' }, 'white')
  ],
  verbo: [
    s('path', { d: bubble(14, 14, 132, 120) }, 'cream'),
    s('path', { d: bubble(14, 14, 132, 120), ...SW(3) }, 'orange', { stroke: true }),
    ...lean(76, 112, 20, 'red', { h: 36, w: 24, r: 11, accent: true }),
    s('path', { d: 'M66 112l-10 0M84 112l12-6', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 60h20M34 76h14M28 92h18', ...SW(4) }, 'gray', { stroke: true })
  ],
  vicio: [
    s('rect', { x: 18, y: 104, width: 82, height: 14, rx: 3 }, 'white'),
    s('path', { d: 'M18 104h82v14H18z', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 18, y: 104, width: 24, height: 14, rx: 3 }, 'orange'),
    s('rect', { x: 98, y: 104, width: 8, height: 14 }, 'red', { accent: true }),
    s('path', { d: 'M104 96q-10-12 0-24t0-26', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 112, y: 30, width: 34, height: 34, rx: 6, transform: 'rotate(12 129 47)' }, 'red'),
    s('path', { d: dots([[120, 40], [130, 48], [140, 56]], 3.5), transform: 'rotate(12 129 47)' }, 'white')
  ],
  'volcán': [
    s('path', { d: 'M14 140l46-74h40l46 74z' }, 'brown'),
    s('path', { d: 'M60 66h40l-6 14-10-4-6 10-8-10-6 6z' }, 'red', { accent: true }),
    s('path', { d: 'M80 66q-8-20 0-30M70 60q-14-14-12-30M90 60q14-12 16-28', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: ells([[80, 24, 18, 10], [62, 20, 12, 8], [100, 20, 12, 8]]) }, 'gray'),
    s('path', { d: dots([[46, 44], [116, 42]], 4) }, 'red')
  ],
  activista: [
    ground(),
    ...person(56, 136, 'green', { accent: true }),
    s('path', { d: 'M68 92l14-8', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M76 82l40-18v40l-40-14z' }, 'orange'),
    s('rect', { x: 70, y: 80, width: 10, height: 12, rx: 2 }, 'dark'),
    s('path', { d: 'M124 70q8 14 0 28M134 62q14 22 0 44', ...SW(4) }, 'orange', { stroke: true })
  ],
  adelantado: [
    ground(),
    ...lean(120, 136, 16, 'red', { accent: true }),
    ...person(36, 136, 'gray', { h: 32, w: 22, r: 10 }),
    ...person(68, 136, 'gray', { h: 32, w: 22, r: 10 }),
    arrow('M86 50h40M118 42l8 8-8 8', 'orange', 5)
  ],
  administrar: [
    s('rect', { x: 58, y: 18, width: 44, height: 26, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: 'M80 44v16M34 60h92M34 60v16M80 60v16M126 60v16', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: rects([[16, 76, 36, 22], [62, 76, 36, 22], [108, 76, 36, 22]]) }, 'sky'),
    s('path', { d: 'M34 98v14M126 98v14', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: rects([[18, 112, 32, 20], [110, 112, 32, 20]]) }, 'mint'),
    s('circle', { cx: 80, cy: 31, r: 7 }, 'white')
  ],
  alimentario: [
    s('path', { d: 'M20 136V80l12-14h24l12 14v56z' }, 'white'),
    s('path', { d: 'M20 136V80l12-14h24l12 14v56zM20 80h48', ...SW(3) }, 'blue', { stroke: true }),
    s('rect', { x: 26, y: 92, width: 36, height: 22, rx: 3 }, 'sky'),
    s('path', { d: 'M74 136q-6-30 18-52q20-12 44-4q10 16-8 30q-20 26-54 26z' }, 'tan', { accent: true }),
    s('path', { d: 'M96 102l8 8M108 92l8 8M118 82l6 6', ...SW(3) }, 'brown', { stroke: true }),
    s('circle', { cx: 120, cy: 126, r: 16 }, 'red'),
    s('path', { d: 'M120 110q2-8 8-10', ...SW(3) }, 'green', { stroke: true })
  ],
  aria: [
    ground(),
    ...lady(62, 136, 'red', { accent: true }),
    s('path', { d: 'M54 92l-16-26M70 92l16-26', ...SW(6) }, 'skin', { stroke: true }),
    s('ellipse', { cx: 62, cy: 80, rx: 3, ry: 4 }, 'dark'),
    ...note(108, 58, 'purple'),
    ...note(130, 96, 'blue').map(x => ({ ...x, accent: false }))
  ],
  brigada: [
    ground(),
    ...person(36, 136, 'orange'),
    ...person(80, 136, 'orange', { accent: true }),
    ...person(124, 136, 'orange'),
    s('path', { d: 'M22 70q0-16 14-16t14 16zM66 70q0-16 14-16t14 16zM110 70q0-16 14-16t14 16z' }, 'yellow'),
    s('path', { d: 'M22 108h28M66 108h28M110 108h28', ...SW(4) }, 'yellow', { stroke: true })
  ],
  'caballería': [
    s('path', { d: 'M48 104v32M60 104v32M98 104v32M110 104v32', ...SW(7) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 80, cy: 96, rx: 40, ry: 18 }, 'brown', { accent: true }),
    s('path', { d: 'M104 92l14-30', ...SW(16) }, 'brown', { stroke: true }),
    s('path', { d: 'M110 58l20-4 6 12-18 6z' }, 'brown'),
    s('path', { d: 'M40 92q-14 4-18 26', ...SW(5) }, 'dark', { stroke: true }),
    ...person(80, 82, 'gray', { h: 30, w: 22, r: 10 }),
    s('path', { d: 'M90 70l50-50', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 56l-6 -12 10 2z' }, 'red')
  ],
  campana: [
    s('path', { d: 'M80 18v10', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M48 110q4-80 32-80t32 80h12v10H36v-10z' }, 'yellow', { accent: true }),
    s('path', { d: 'M60 60q4-16 14-20', ...SW(4) }, 'cream', { stroke: true }),
    s('circle', { cx: 80, cy: 126, r: 9 }, 'orange'),
    s('path', { d: 'M26 60q-8 16 0 34M134 60q8 16 0 34M16 52q-12 24 0 48M144 52q12 24 0 48', ...SW(4) }, 'orange', { stroke: true })
  ],
  ceder: [
    s('path', { d: 'M18 30h124L80 136z' }, 'red', { accent: true }),
    s('path', { d: 'M40 42h80L80 112z' }, 'white'),
    s('path', { d: 'M80 136v8', ...SW(6) }, 'gray', { stroke: true })
  ],
  celo: [
    s('path', { d: 'M80 140q-52-20-46-62q6-28 30-54q0 26 16 34q2-20 20-36q26 30 22 64q-6 40-42 54z' }, 'orange'),
    s('path', { d: 'M80 140q-32-14-30-42q4-20 18-34q2 18 12 22q4-14 16-22q18 22 14 44q-4 24-30 32z' }, 'yellow'),
    s('path', { d: heart(80, 116, 16) }, 'red', { accent: true })
  ],
  clan: [
    s('path', { d: 'M80 18v30', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 18h32l-8 8 8 8H80z' }, 'purple', { accent: true }),
    s('path', { d: dots([[34, 84], [58, 76], [80, 70], [102, 76], [126, 84]], 11) }, 'skin'),
    s('path', { d: busts([34, 58, 80, 102, 126], 132, 22, 34) }, 'purple'),
    s('path', { d: dots([[46, 116], [114, 116]], 9) }, 'skin'),
    s('path', { d: busts([46, 114], 140, 18, 18) }, 'pink')
  ],
  'comisaría': [
    ground(),
    s('rect', { x: 24, y: 58, width: 112, height: 78 }, 'navy'),
    s('rect', { x: 66, y: 34, width: 28, height: 24, rx: 4 }, 'gray'),
    s('rect', { x: 72, y: 38, width: 16, height: 16, rx: 3 }, 'blue', { accent: true }),
    s('path', { d: 'M62 38l-10-6M98 38l10-6', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: star(80, 82, 14) }, 'yellow'),
    s('path', { d: rects([[34, 104, 22, 18], [104, 104, 22, 18]]) }, 'sky'),
    s('rect', { x: 68, y: 106, width: 24, height: 30 }, 'white')
  ],
  componer: [
    s('rect', { x: 14, y: 28, width: 132, height: 92, rx: 4 }, 'cream'),
    s('path', { d: 'M24 50h112M24 62h112M24 74h112M24 86h112M24 98h112', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: ells([[44, 92, 7, 5], [66, 80, 7, 5], [88, 68, 7, 5]]) }, 'dark'),
    s('path', { d: 'M51 92V60M73 80V48M95 68V40', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 112l30-60', ...SW(6) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M108 112l-4 12 9-8z' }, 'dark')
  ],
  consulado: [
    ground(),
    s('rect', { x: 18, y: 66, width: 92, height: 70 }, 'cream'),
    s('path', { d: 'M14 68l50-26 50 26z' }, 'gray'),
    s('path', { d: 'M32 74v54M50 74v54M78 74v54M96 74v54', ...SW(6) }, 'tan', { stroke: true }),
    s('path', { d: 'M64 42V18', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 18h22v14H64z' }, 'blue'),
    s('rect', { x: 112, y: 92, width: 34, height: 46, rx: 4 }, 'navy', { accent: true }),
    s('circle', { cx: 129, cy: 110, r: 8, ...SW(2) }, 'yellow', { stroke: true })
  ],
  desplazamiento: [
    s('rect', { x: 18, y: 64, width: 40, height: 40, rx: 4, ...DASH(3, '5 4') }, 'gray', { stroke: true }),
    s('rect', { x: 102, y: 64, width: 40, height: 40, rx: 4 }, 'orange', { accent: true }),
    arrow('M64 84h30M86 76l8 8-8 8', 'blue', 5),
    s('path', { d: 'M18 120h124', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 128v-8M122 128v-8', ...SW(3) }, 'dark', { stroke: true })
  ],
  educar: [
    s('rect', { x: 26, y: 104, width: 108, height: 18, rx: 3 }, 'blue'),
    s('rect', { x: 32, y: 122, width: 96, height: 16, rx: 3 }, 'red'),
    s('path', { d: 'M80 28l56 22-56 22-56-22z' }, 'dark', { accent: true }),
    s('path', { d: 'M54 60v22q26 14 52 0V60l-26 10z' }, 'dark'),
    s('path', { d: 'M130 52v30', ...SW(3) }, 'yellow', { stroke: true }),
    s('circle', { cx: 130, cy: 86, r: 5 }, 'yellow')
  ],
  emprender: [
    s('path', { d: 'M80 16q24 22 18 70H62q-6-48 18-70z' }, 'white'),
    s('path', { d: 'M80 16q24 22 18 70H62q-6-48 18-70z', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 48, r: 9 }, 'sky'),
    s('path', { d: 'M62 66l-16 24h16zM98 66l16 24H98z' }, 'red', { accent: true }),
    s('path', { d: 'M66 88q14 50 28 0z' }, 'orange'),
    s('path', { d: ells([[48, 132, 22, 10], [80, 136, 22, 10], [112, 132, 22, 10]]) }, 'gray')
  ],
  enojado: [
    s('circle', { cx: 74, cy: 86, r: 52 }, 'skin'),
    s('path', { d: 'M42 64l24 10M106 64l-24 10', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[56, 86], [92, 86]], 5) }, 'dark'),
    s('path', { d: 'M54 118q20-14 40 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M114 30l8 10M134 34l-8 8M136 56l-10-6M116 56l6-8', ...SW(5) }, 'red', { stroke: true, accent: true })
  ],
  feminismo: [
    ground(),
    ...lady(66, 136, 'purple', { accent: true }),
    s('path', { d: 'M74 92l20-30', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 96, cy: 56, r: 8 }, 'skin'),
    s('path', { d: ring(116, 112, 14) + 'M116 126v14M108 134h16', ...SW(5) }, 'pink', { stroke: true })
  ],
  fijar: [
    ...paper(28, 40, 96, 100),
    s('path', { d: 'M42 74h68M42 90h68M42 106h50', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M76 48l-4 14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 22l24 6-4 12 4 10-26-6 6-8z' }, 'red', { accent: true }),
    s('ellipse', { cx: 77, cy: 22, rx: 14, ry: 6, transform: 'rotate(14 77 22)' }, 'red')
  ],
  futbolista: [
    ground(),
    s('path', { d: 'M62 124l34-6', ...SW(10) }, 'navy', { stroke: true }),
    ...person(54, 136, 'blue', { accent: true }),
    s('circle', { cx: 118, cy: 116, r: 16 }, 'white'),
    s('path', { d: ring(118, 116, 16) + 'M112 108l8-2 6 6-4 8h-8l-4-6z', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M138 104h8M140 116h6', ...SW(3) }, 'gray', { stroke: true })
  ],
  gallego: [
    s('path', { d: 'M80 140L24 66q4-46 56-46t56 46z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 140L36 40M80 140L58 26M80 140V22M80 140l22-114M80 140l44-100', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M62 140l18-12 18 12z' }, 'orange')
  ],
  'incómodo': [
    s('rect', { x: 34, y: 112, width: 92, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M40 122v20M120 122v20', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M44 112l6-10 6 10 6-10 6 10 6-10 6 10 6-10 6 10 6-10 6 10 6-10 6 10' }, 'gray'),
    ...person(80, 104, 'red', { h: 40, accent: true }),
    s('path', { d: drop(104, 40, 5) + drop(58, 46, 4) }, 'sky'),
    s('path', { d: 'M74 56q6-4 12 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  informativo: [
    s('rect', { x: 14, y: 24, width: 132, height: 96, rx: 8 }, 'dark'),
    s('rect', { x: 22, y: 32, width: 116, height: 80, rx: 3 }, 'sky'),
    s('circle', { cx: 60, cy: 64, r: 12 }, 'skin'),
    s('path', { d: busts([60], 100, 34, 22) }, 'navy'),
    s('rect', { x: 22, y: 96, width: 116, height: 16 }, 'red', { accent: true }),
    s('path', { d: 'M30 104h60', ...SW(3) }, 'white', { stroke: true }),
    s('rect', { x: 92, y: 42, width: 38, height: 30, rx: 3 }, 'blue'),
    s('path', { d: 'M60 120l-8 16h56l-8-16', ...SW(4) }, 'gray', { stroke: true })
  ],
  'israelí': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 8 }, 'sky'),
    s('circle', { cx: 120, cy: 40, r: 14 }, 'yellow'),
    s('path', { d: 'M14 70q30-20 60-6t72-10v20H14z' }, 'tan'),
    s('path', { d: 'M14 84h132v62H14z' }, 'mint'),
    s('circle', { cx: 60, cy: 98, r: 10 }, 'skin'),
    s('path', { d: 'M68 102h52', ...SW(12) }, 'blue', { stroke: true, accent: true }),
    s('rect', { x: 72, y: 82, width: 24, height: 16, rx: 2, transform: 'rotate(-10 84 90)' }, 'red'),
    s('path', { d: 'M24 124q16-6 32 0M96 128q16-6 32 0', ...SW(3) }, 'white', { stroke: true })
  ],
  legalidad: [
    s('path', { d: 'M80 22v108M50 136h60M40 40h80', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 40L24 82M40 40l16 42M120 40l-16 42M120 40l16 42', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 82h44q-4 18-22 18T18 82z' }, 'yellow', { accent: true }),
    s('path', { d: 'M98 82h44q-4 18-22 18T98 82z' }, 'yellow'),
    s('circle', { cx: 80, cy: 22, r: 7 }, 'orange')
  ],
  maniobra: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 6 }, 'dark'),
    s('path', { d: 'M54 14v60M106 14v60M14 74h132', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: rects([[20, 22, 28, 44], [112, 22, 28, 44]]) }, 'gray'),
    s('rect', { x: 100, y: 92, width: 28, height: 44, rx: 6, transform: 'rotate(60 114 114)' }, 'red', { accent: true }),
    arrow('M92 106q-16-6-14-40M70 74l8-8 8 8', 'yellow', 5)
  ],
  marea: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 8 }, 'navy'),
    s('path', { d: 'M126 22a14 14 0 1 0 8 26a12 12 0 0 1-8-26z' }, 'yellow'),
    s('path', { d: 'M14 146V100q66 6 132-24v70z' }, 'tan'),
    s('path', { d: 'M14 108q30-6 46 0t44-10 42-16v18q-30 14-54 18t-42 0-36 2z' }, 'blue', { accent: true }),
    s('path', { d: 'M14 92q40 6 70-6t62-24', ...DASH(3) }, 'sky', { stroke: true }),
    arrow('M40 74v-20M32 60l8-8 8 8', 'sky', 3)
  ],
  'metodología': [
    s('circle', { cx: 80, cy: 26, r: 12 }, 'green'),
    s('rect', { x: 58, y: 54, width: 44, height: 24, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: 'M80 88l20 14-20 14-20-14z' }, 'orange'),
    s('rect', { x: 58, y: 124, width: 44, height: 22, rx: 11 }, 'red'),
    s('path', { d: 'M80 38v14M80 78v8M80 116v6M100 102h26V66h-22', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M104 66l6-4v8z' }, 'dark')
  ],
  nido: [
    s('path', { d: 'M14 120l132-14', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: ells([[80, 82, 13, 12], [100, 84, 12, 11]]) }, 'yellow'),
    s('path', { d: 'M72 80l-8 0 8 4zM108 80l8 0-8 4z' }, 'orange'),
    s('path', { d: dots([[76, 78], [104, 80]], 2) }, 'dark'),
    s('path', { d: 'M28 92q52 10 104 0q-4 30-52 30t-52-30z' }, 'brown', { accent: true }),
    s('path', { d: 'M34 98q46 12 92 0M40 108q40 10 80 0', ...SW(3) }, 'tan', { stroke: true })
  ],
  pardo: [
    backdrop('navy'),
    s('path', { d: 'M118 22a12 12 0 1 0 8 22a10 10 0 0 1-8-22z' }, 'yellow'),
    s('path', { d: 'M48 136q-6-40 26-44q30-2 34 32v12z' }, 'brown', { accent: true }),
    s('circle', { cx: 78, cy: 76, r: 22 }, 'brown'),
    s('path', { d: 'M60 66l2-24 14 14zM96 66l-2-24-14 14z' }, 'brown'),
    s('path', { d: ells([[70, 76, 4, 6], [86, 76, 4, 6]]) }, 'yellow'),
    s('path', { d: 'M108 128q24 4 22-24', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: 'M66 54l4 8M90 54l-4 8', ...SW(3) }, 'tan', { stroke: true })
  ],
  'partícula': [
    s('path', { d: dots([[24, 30], [40, 120], [130, 130], [26, 82], [136, 30], [60, 22]], 3) }, 'gray'),
    s('circle', { cx: 74, cy: 72, r: 42 }, 'white'),
    s('path', { d: ring(74, 72, 42), ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M104 104l32 32', ...SW(12) }, 'dark', { stroke: true }),
    s('path', { d: dots([[62, 60], [84, 56], [70, 84], [92, 80]], 8) }, 'blue', { accent: true }),
    s('path', { d: dots([[52, 78], [80, 98], [96, 62]], 5) }, 'red')
  ],
  pija: [
    ground(),
    ...lady(66, 136, 'pink'),
    s('path', { d: 'M54 72h24', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 88q10 8 20 0', ...SW(3) }, 'white', { stroke: true, lineColor: 'gray' }),
    s('path', { d: 'M96 100q0-14 12-14t12 14', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 92, y: 100, width: 32, height: 26, rx: 4 }, 'purple', { accent: true }),
    s('path', { d: sparkle(124, 54, 9) + sparkle(30, 60, 6) }, 'yellow')
  ],
  poblador: [
    ground(),
    s('path', { d: 'M74 90l36-30 36 30z' }, 'brown'),
    s('path', { d: rects([[80, 90, 60, 46]]) }, 'tan', { accent: true }),
    s('path', { d: 'M80 102h60M80 114h60M80 126h60', ...SW(3) }, 'brown', { stroke: true }),
    s('rect', { x: 102, y: 108, width: 16, height: 28 }, 'brown'),
    ...person(40, 136, 'green'),
    s('path', { d: 'M50 104l14-30', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M58 72l12 6 2-10z' }, 'gray')
  ],
  potente: [
    s('path', { d: 'M18 50h124', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 14, y: 30, width: 18, height: 40, rx: 4 }, 'red', { accent: true }),
    s('rect', { x: 128, y: 30, width: 18, height: 40, rx: 4 }, 'red'),
    s('circle', { cx: 80, cy: 76, r: 12 }, 'skin'),
    s('path', { d: 'M68 92l-20-38M92 92l20-38', ...SW(9) }, 'skin', { stroke: true }),
    s('rect', { x: 64, y: 88, width: 32, height: 36, rx: 10 }, 'blue'),
    s('path', { d: 'M70 124l-6 16M90 124l6 16', ...SW(9) }, 'navy', { stroke: true })
  ],
  'recolección': [
    s('path', { d: 'M60 140V70', ...SW(10) }, 'brown', { stroke: true }),
    s('path', { d: ells([[60, 52, 46, 36]]) }, 'green'),
    s('path', { d: dots([[40, 50], [62, 36], [80, 58], [52, 70]], 7) }, 'red'),
    s('path', { d: 'M96 112h48l-6 28h-36z' }, 'tan', { accent: true }),
    s('path', { d: dots([[108, 108], [122, 106], [134, 110]], 7) }, 'red'),
    s('path', { d: 'M96 120h48', ...SW(2) }, 'brown', { stroke: true })
  ],
  sindical: [
    s('path', { d: 'M80 80L36 40M80 80l44-40M80 80v54', ...SW(18) }, 'skin', { stroke: true }),
    s('path', { d: 'M36 40L22 26M124 40l14-14M80 134v12', ...SW(18) }, 'blue', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 18 }, 'orange', { accent: true }),
    s('path', { d: ring(80, 80, 30), ...DASH(3, '4 6') }, 'gray', { stroke: true })
  ],
  soberano: [
    s('path', { d: 'M38 140V44q0-14 14-14h56q14 0 14 14v96z' }, 'red'),
    s('rect', { x: 52, y: 102, width: 56, height: 38, rx: 4 }, 'purple', { accent: true }),
    s('circle', { cx: 80, cy: 66, r: 14 }, 'skin'),
    s('path', { d: 'M66 54l-2-14 8 8 8-12 8 12 8-8-2 14z' }, 'yellow'),
    s('path', { d: busts([80], 112, 34, 30) }, 'purple'),
    s('path', { d: 'M108 112V70', ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 108, cy: 66, r: 6 }, 'yellow')
  ],
  sobretodo: [
    s('path', { d: 'M80 14v10M80 24l-40 20h80z', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 40h44l24 16 6 66h-18l-4-50v74H50V72l-4 50H28l6-66z' }, 'tan', { accent: true }),
    s('path', { d: 'M58 40l22 36 22-36M80 76v66', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: dots([[90, 92], [90, 108], [90, 124]], 3) }, 'brown'),
    s('rect', { x: 50, y: 100, width: 60, height: 7 }, 'brown')
  ],
  'séptimo': [
    s('path', { d: 'M14 108h132', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[22, 92], [40, 92], [58, 92], [76, 92], [94, 92], [112, 92]], 8) }, 'sky'),
    s('circle', { cx: 134, cy: 88, r: 12 }, 'red', { accent: true }),
    s('path', { d: star(134, 50, 12) }, 'yellow'),
    arrow('M134 70v4', 'orange', 4)
  ],
  taco: [
    s('path', { d: 'M18 116q0-62 62-62t62 62z' }, 'yellow', { accent: true }),
    s('path', { d: 'M30 106q-2-30 26-40q24-6 46 0q28 10 26 40z' }, 'green'),
    s('path', { d: dots([[54, 82], [80, 76], [104, 84]], 8) }, 'red'),
    s('path', { d: 'M40 100q20-14 40-4t40 0', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M18 116q0-62 62-62t62 62', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: dots([[66, 96], [96, 96]], 4) }, 'cream')
  ],
  torta: [
    s('ellipse', { cx: 80, cy: 132, rx: 60, ry: 8 }, 'gray'),
    s('rect', { x: 30, y: 82, width: 100, height: 48, rx: 6 }, 'pink', { accent: true }),
    s('path', { d: 'M30 92q12 10 25 0t25 0 25 0 25 0V86H30z' }, 'cream'),
    s('path', { d: 'M30 110h100', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M56 82V58M80 82V54M104 82V58', ...SW(6) }, 'sky', { stroke: true }),
    s('path', { d: drop(56, 46, 4) + drop(80, 42, 4) + drop(104, 46, 4) }, 'orange')
  ],
  traidor: [
    ground(),
    ...person(40, 136, 'blue'),
    ...person(110, 136, 'dark', { accent: true }),
    s('path', { d: 'M52 104h46', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M126 110l12 10', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M136 118l10-24 4 2-8 24z' }, 'gray'),
    s('path', { d: 'M104 72l6 2M116 72l-6 2', ...SW(3) }, 'dark', { stroke: true })
  ],
  vientre: [
    s('path', { d: 'M48 18h64q4 30 0 44H48q-4-14 0-44z' }, 'green'),
    s('path', { d: 'M48 62h64q22 36 2 68H46q-20-32 2-68z' }, 'skin'),
    s('circle', { cx: 80, cy: 100, r: 3 }, 'tan'),
    s('path', { d: 'M100 74q20 12 14 34', ...SW(14) }, 'skin', { stroke: true }),
    s('rect', { x: 46, y: 128, width: 68, height: 14, rx: 3 }, 'blue', { accent: true }),
    s('path', { d: 'M58 82q22 12 44 0', ...SW(2) }, 'tan', { stroke: true })
  ],
  africano: [
    s('rect', { x: 14, y: 22, width: 132, height: 116, rx: 8 }, 'sky'),
    s('path', { d: 'M38 44q30-14 62-4q4 10 16 12q8 4 12 14q-10 16-22 22q-6 22-14 38q-12 6-18-6q-4-20-4-34q-14-2-30-14q-10-14-2-28z' }, 'orange', { accent: true }),
    s('path', { d: 'M114 100q8-4 8 6q-4 12-8 8z' }, 'orange'),
    s('path', { d: 'M36 34q20-8 50-6q-10 6-30 8z' }, 'gray'),
    s('path', { d: 'M80 82c-8-8-10-12-10-17a10 10 0 0 1 20 0c0 5-2 9-10 17z' }, 'red'),
    s('circle', { cx: 80, cy: 65, r: 3.5 }, 'white')
  ],
  angustia: [
    s('rect', { x: 14, y: 20, width: 26, height: 120 }, 'gray'),
    s('rect', { x: 120, y: 20, width: 26, height: 120 }, 'gray'),
    arrow('M44 80h10M50 74l6 6-6 6M116 80h-10M110 74l-6 6 6 6', 'red', 4),
    s('circle', { cx: 80, cy: 66, r: 16 }, 'skin'),
    s('path', { d: 'M66 58l-6-8M94 58l6-8', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 66, y: 84, width: 28, height: 52, rx: 9 }, 'purple', { accent: true }),
    s('path', { d: 'M72 74q8-6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: drop(100, 40, 4) }, 'sky')
  ],
  anualmente: [
    s('path', { d: ring(80, 80, 50), ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M118 46l12-12 4 16z' }, 'gray'),
    s('circle', { cx: 80, cy: 30, r: 14 }, 'yellow', { accent: true }),
    s('path', { d: leaflet(122, 86, -140, 26, 9) }, 'orange'),
    s('path', { d: 'M80 118v26M69 125l22 12M69 137l22-12', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: dots([[38, 72], [30, 82], [40, 90], [46, 80]], 6) }, 'pink')
  ],
  bautista: [
    s('path', { d: 'M36 72q20-40 56-34q-6 30-46 44z' }, 'cream', { accent: true }),
    s('path', { d: 'M40 76q18-30 48-34M48 66l-4-16M58 60l2-18M70 54l8-14', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: drop(58, 90, 4) + drop(70, 100, 4) + drop(62, 108, 3) }, 'blue'),
    s('ellipse', { cx: 84, cy: 128, rx: 50, ry: 12 }, 'sky'),
    s('circle', { cx: 80, cy: 118, r: 14 }, 'skin'),
    s('path', { d: 'M74 118q3 3 6 0M84 118q3 3 6 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  boleto: [
    s('path', { d: 'M18 46h124v24a10 10 0 0 0 0 20v24H18V90a10 10 0 0 0 0-20z' }, 'orange', { accent: true }),
    s('path', { d: 'M108 50v60', ...DASH(3, '5 5') }, 'white', { stroke: true }),
    s('path', { d: 'M34 66h56M34 80h40M34 94h50', ...SW(4) }, 'cream', { stroke: true }),
    s('path', { d: star(126, 80, 9) }, 'yellow')
  ],
  celebrado: [
    s('path', { d: 'M54 26h52v30q0 26-26 26T54 56z' }, 'yellow', { accent: true }),
    s('path', { d: 'M54 34H38q0 22 18 24M106 34h16q0 22-18 24', ...SW(5) }, 'yellow', { stroke: true }),
    s('rect', { x: 74, y: 80, width: 12, height: 24 }, 'orange'),
    s('rect', { x: 56, y: 102, width: 48, height: 14, rx: 3 }, 'brown'),
    s('path', { d: 'M20 120q12-10 22 0M118 120q12-10 22 0', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M26 24l6 6M136 24l-6 6M28 66h8M124 66h8M30 102l4-6M130 102l-4-6', ...SW(4) }, 'red', { stroke: true })
  ],
  clausura: [
    s('rect', { x: 14, y: 22, width: 132, height: 118, rx: 4 }, 'dark'),
    s('path', { d: 'M30 22v118M54 22v118M78 22v118M102 22v118M126 22v118', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 70q66 30 132 0', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M68 84v-10a12 12 0 0 1 24 0v10', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 62, y: 84, width: 36, height: 30, rx: 4 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 98, r: 4 }, 'dark')
  ],
  comuna: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'mint'),
    s('circle', { cx: 80, cy: 80, r: 16 }, 'green', { accent: true }),
    s('path', { d: rects([[68, 22, 24, 20], [68, 118, 24, 20], [22, 70, 24, 20], [114, 70, 24, 20]]) }, 'cream'),
    s('path', { d: 'M66 24l14-12 14 12zM66 120l14-12 14 12zM20 72l14-12 14 12zM112 72l14-12 14 12z' }, 'red'),
    s('path', { d: 'M80 42v22M80 96v22M46 80h18M96 80h18', ...DASH(3, '4 4') }, 'brown', { stroke: true })
  ],
  creativo: [
    s('circle', { cx: 80, cy: 66, r: 38 }, 'yellow', { accent: true }),
    s('rect', { x: 64, y: 102, width: 32, height: 22, rx: 4 }, 'gray'),
    s('path', { d: 'M64 112h32', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[66, 56]], 9) }, 'red'),
    s('path', { d: dots([[92, 52]], 9) }, 'blue'),
    s('path', { d: dots([[80, 78]], 9) }, 'green'),
    s('path', { d: rays(80, 66, 46, 58, 7, -165).split('M').slice(1, 6).map(x => 'M' + x).join(''), ...SW(4) }, 'orange', { stroke: true })
  ],
  'dedicación': [
    s('rect', { x: 14, y: 14, width: 52, height: 52, rx: 4 }, 'navy'),
    s('path', { d: 'M44 26a10 10 0 1 0 6 18a8 8 0 0 1-6-18z' }, 'yellow'),
    s('rect', { x: 14, y: 110, width: 132, height: 10, rx: 3 }, 'brown'),
    ...person(84, 112, 'blue', { h: 34, w: 28, r: 12, accent: true }),
    s('path', { d: 'M126 110V70l-16-8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 66l14-18 14 10z' }, 'green'),
    s('path', { d: 'M48 102h30l-2 8H50z' }, 'white', { lineColor: 'gray' }),
    s('path', { d: 'M20 120v20M140 120v20', ...SW(5) }, 'brown', { stroke: true })
  ],
  delicado: [
    s('path', { d: 'M52 22h56q2 50-28 56q-30-6-28-56z' }, 'sky', { accent: true }),
    s('path', { d: 'M80 78v44M58 126h44', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 22h56q2 50-28 56q-30-6-28-56z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M92 24l-8 14 8 8-10 14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M124 92q22-10 22 14q-4 18-30 28q8-12 2-24z' }, 'white'),
    s('path', { d: 'M124 92q22-10 22 14q-4 18-30 28q8-12 2-24zM116 134l20-34', ...SW(2) }, 'gray', { stroke: true })
  ],
  divisa: [
    s('rect', { x: 18, y: 30, width: 76, height: 44, rx: 4 }, 'green', { accent: true }),
    s('circle', { cx: 56, cy: 52, r: 12 }, 'mint'),
    s('rect', { x: 66, y: 86, width: 76, height: 44, rx: 4 }, 'purple'),
    s('circle', { cx: 104, cy: 108, r: 12 }, 'pink'),
    arrow('M112 30q24 4 22 40M126 62l8 8 8-8', 'orange', 5),
    arrow('M48 130q-24-4-22-40M34 98l-8-8-8 8', 'orange', 5)
  ],
  esposa: [
    ground(),
    s('path', { d: 'M62 30q-24 30-26 106h88q-2-76-26-106z' }, 'cream'),
    s('circle', { cx: 80, cy: 46, r: 13 }, 'skin'),
    s('path', { d: 'M72 60h16l22 76H50z' }, 'white'),
    s('path', { d: 'M72 60h16l22 76H50z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: dots([[66, 34], [80, 30], [94, 34]], 4) }, 'pink'),
    s('path', { d: ells([[80, 94, 12, 8]]) }, 'pink', { accent: true }),
    s('path', { d: dots([[74, 92], [86, 92], [80, 98]], 4) }, 'red')
  ],
  experimental: [
    s('path', { d: 'M66 22h28M70 22v40l-34 64q-4 12 10 12h68q14 0 10-12L90 62V22' }, 'white'),
    s('path', { d: 'M52 94h56l18 32q4 12-10 12H44q-14 0-10-12z' }, 'green', { accent: true }),
    s('path', { d: 'M66 22h28M70 22v40l-34 64q-4 12 10 12h68q14 0 10-12L90 62V22', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[70, 114], [92, 106], [84, 124]], 5) + dots([[86, 80], [76, 64]], 4) }, 'mint'),
    s('path', { d: ells([[100, 30, 10, 7], [116, 20, 12, 8]]) }, 'purple')
  ],
  horizontal: [
    s('path', { d: 'M14 120h132', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 16, y: 64, width: 128, height: 32, rx: 6 }, 'yellow', { accent: true }),
    s('rect', { x: 58, y: 70, width: 44, height: 20, rx: 10 }, 'mint'),
    s('circle', { cx: 80, cy: 80, r: 6 }, 'white'),
    s('path', { d: 'M68 70v20M92 70v20', ...SW(2) }, 'dark', { stroke: true }),
    arrow('M30 40h100M40 32l-10 8 10 8M120 32l10 8-10 8', 'blue', 5)
  ],
  imprimir: [
    ...paper(46, 16, 68, 40),
    s('rect', { x: 18, y: 50, width: 124, height: 58, rx: 10 }, 'gray', { accent: true }),
    s('circle', { cx: 124, cy: 66, r: 5 }, 'green'),
    s('rect', { x: 46, y: 92, width: 68, height: 50, rx: 2 }, 'white'),
    s('path', { d: 'M46 92h68v50H46z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M56 108h48M56 120h48M56 132h30', ...SW(3) }, 'blue', { stroke: true }),
    s('rect', { x: 34, y: 88, width: 92, height: 6, rx: 2 }, 'dark')
  ],
  inconsciente: [
    s('path', { d: 'M14 130h132', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 60, y: 102, width: 72, height: 26, rx: 10 }, 'blue', { accent: true }),
    s('circle', { cx: 42, cy: 108, r: 20 }, 'skin'),
    s('path', { d: spiral(32, 104) + spiral(48, 104), ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M38 120h8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: star(28, 66, 8) + star(56, 60, 8) + star(42, 50, 6) }, 'yellow')
  ],
  mago: [
    s('path', { d: 'M54 66h52V24H54z' }, 'black'),
    s('rect', { x: 40, y: 64, width: 80, height: 8, rx: 3 }, 'black'),
    s('rect', { x: 54, y: 54, width: 52, height: 8 }, 'red'),
    s('circle', { cx: 80, cy: 90, r: 18 }, 'skin'),
    s('path', { d: busts([80], 146, 52, 38) }, 'purple', { accent: true }),
    s('path', { d: 'M110 124l26-30', ...SW(6) }, 'black', { stroke: true }),
    s('path', { d: 'M132 98l6-6', ...SW(6) }, 'white', { stroke: true, lineColor: 'gray' }),
    s('path', { d: sparkle(130, 70, 10) + sparkle(144, 92, 6) + sparkle(28, 40, 8) }, 'yellow')
  ],
  medieval: [
    ground(),
    s('rect', { x: 30, y: 70, width: 100, height: 66 }, 'gray'),
    s('path', { d: rects([[18, 40, 30, 96], [112, 40, 30, 96]]) }, 'gray', { accent: true }),
    s('path', { d: rects([[18, 32, 8, 8], [29, 32, 8, 8], [40, 32, 8, 8], [112, 32, 8, 8], [123, 32, 8, 8], [134, 32, 8, 8], [48, 62, 8, 8], [64, 62, 8, 8], [88, 62, 8, 8], [104, 62, 8, 8]]) }, 'gray'),
    s('path', { d: 'M64 136v-26a16 16 0 0 1 32 0v26z' }, 'brown'),
    s('path', { d: 'M30 60v-8M130 60v-8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M33 22v-14l14 6-14 6M127 22v-14l14 6-14 6', ...SW(2) }, 'red', { stroke: true }),
    s('path', { d: rects([[28, 60, 10, 14], [122, 60, 10, 14]]) }, 'dark')
  ],
  'mercancía': [
    ground(140),
    s('rect', { x: 20, y: 96, width: 56, height: 42, rx: 2 }, 'tan'),
    s('rect', { x: 84, y: 96, width: 56, height: 42, rx: 2 }, 'tan'),
    s('rect', { x: 52, y: 52, width: 56, height: 44, rx: 2 }, 'tan', { accent: true }),
    s('path', { d: 'M48 96v42M112 96v42M80 52v44M20 108h56M84 108h56M52 64h56', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M30 20h100l-6 22H36z' }, 'blue'),
    s('path', { d: 'M80 42v10', ...SW(3) }, 'dark', { stroke: true })
  ],
  misterioso: [
    backdrop('navy'),
    s('path', { d: 'M24 146V70l12-30 12 30v76zM112 146V60l14-34 14 34v86z' }, 'black'),
    s('path', { d: ells([[80, 120, 60, 14], [50, 104, 30, 10], [110, 108, 34, 10]]) }, 'purple'),
    s('path', { d: ells([[68, 80, 7, 9], [92, 80, 7, 9]]) }, 'yellow', { accent: true }),
    s('path', { d: dots([[70, 82], [94, 82]], 3) }, 'black'),
    s('path', { d: 'M64 68l10 4M96 68l-10 4', ...SW(3) }, 'yellow', { stroke: true })
  ],
  'noción': [
    s('path', { d: 'M40 146v-28q-20-16-20-44q0-48 50-50q44 0 46 40l14 20h-12v20q0 10-10 10H92v32z' }, 'sky'),
    s('circle', { cx: 60, cy: 62, r: 12 }, 'red', { accent: true }),
    s('rect', { x: 80, y: 48, width: 22, height: 22, rx: 2 }, 'blue'),
    s('path', { d: 'M70 82l14 24H56z' }, 'yellow'),
    s('path', { d: dots([[126, 46], [136, 34]], 3) }, 'gray')
  ],
  parecido: [
    s('circle', { cx: 44, cy: 76, r: 30 }, 'skin'),
    s('circle', { cx: 116, cy: 76, r: 30 }, 'skin'),
    s('path', { d: 'M14 70q0-38 30-38t30 38q-12-18-30-18T14 70zM86 70q0-38 30-38t30 38q-12-18-30-18t-30 18z' }, 'brown'),
    s('path', { d: dots([[34, 78], [54, 78], [106, 78], [126, 78]], 4) }, 'dark'),
    s('path', { d: 'M36 92q8 6 16 0M108 92q8 6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: busts([44, 116], 146, 46, 32) }, 'orange', { accent: true }),
    s('path', { d: ring(126, 78, 8) + ring(106, 78, 8), ...SW(2) }, 'dark', { stroke: true })
  ],
  pascua: [
    s('path', { d: 'M22 96h116l-12 44H34z' }, 'brown'),
    s('path', { d: 'M28 96q52-80 104 0', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: ells([[52, 90, 14, 18]]) }, 'pink', { accent: true }),
    s('path', { d: ells([[80, 86, 14, 18]]) }, 'sky'),
    s('path', { d: ells([[108, 90, 14, 18]]) }, 'yellow'),
    s('path', { d: 'M40 88q12-6 24 0M68 84l6-6 6 6 6-6 6 6M96 90q12 6 24 0', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M22 104h116', ...SW(3) }, 'tan', { stroke: true })
  ],
  pasto: [
    s('path', { d: 'M14 140h132v-10H14z' }, 'brown'),
    s('path', { d: 'M20 132q4-60 10-90q2 40 12 90zM44 132q0-50 22-82q-12 40-6 82zM70 132q4-70 14-104q4 50 0 104zM96 132q-4-50 18-80q-6 40-4 80zM118 132q2-40 22-70q-8 36-8 70z' }, 'green', { accent: true }),
    s('path', { d: 'M32 132q2-30 8-50q0 30 2 50zM88 132q2-30 6-46q2 26 2 46zM60 132q0-20 4-36q2 20 4 36z' }, 'mint')
  ],
  payaso: [
    s('circle', { cx: 80, cy: 84, r: 44 }, 'white'),
    s('path', { d: ring(80, 84, 44), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: dots([[38, 60], [30, 80], [122, 60], [130, 80]], 14) }, 'orange'),
    s('path', { d: 'M56 32l24-24 24 24z' }, 'blue'),
    s('circle', { cx: 80, cy: 88, r: 11 }, 'red', { accent: true }),
    s('path', { d: dots([[64, 72], [96, 72]], 4) }, 'dark'),
    s('path', { d: 'M56 104q24 24 48 0', ...SW(6) }, 'red', { stroke: true })
  ],
  pegado: [
    ...paper(22, 40, 64, 80),
    s('rect', { x: 70, y: 56, width: 64, height: 80, rx: 3, transform: 'rotate(8 102 96)' }, 'yellow'),
    s('path', { d: 'M70 70q8 6 16 0', ...SW(5) }, 'cream', { stroke: true }),
    s('rect', { x: 102, y: 18, width: 26, height: 40, rx: 6 }, 'orange', { accent: true }),
    s('path', { d: 'M110 18l5-8 5 8z' }, 'white', { lineColor: 'gray' }),
    s('path', { d: drop(96, 74, 5) }, 'white', { lineColor: 'gray' })
  ],
  pino: [
    s('rect', { x: 72, y: 116, width: 16, height: 26 }, 'brown'),
    s('path', { d: 'M80 16l26 36H90l30 32h-18l32 34H26l32-34H40l30-32H54z' }, 'green', { accent: true }),
    s('path', { d: 'M62 94l18-6 18 6M66 62l14-4 14 4', ...SW(3) }, 'mint', { stroke: true })
  ],
  profeta: [
    s('path', { d: 'M14 140q60-50 132 0z' }, 'tan'),
    s('path', { d: halfRays(80, 50, 24, 36, 7), ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 50, r: 13 }, 'skin'),
    s('path', { d: 'M70 54q10 22 20 0z' }, 'white', { lineColor: 'gray' }),
    s('path', { d: 'M66 136V82q0-14 14-14t14 14v54z' }, 'brown', { accent: true }),
    s('path', { d: 'M108 136V40q0-6 6-6', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M94 84l14-6', ...SW(6) }, 'skin', { stroke: true })
  ],
  prosperidad: [
    s('path', { d: 'M14 140h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[22, 120, 30, 8], [22, 110, 30, 8], [64, 120, 30, 8], [64, 110, 30, 8], [64, 100, 30, 8], [64, 90, 30, 8], [106, 120, 30, 8], [106, 110, 30, 8], [106, 100, 30, 8], [106, 90, 30, 8], [106, 80, 30, 8], [106, 70, 30, 8]]) }, 'yellow', { accent: true }),
    s('rect', { x: 18, y: 128, width: 122, height: 10 }, 'orange'),
    s('path', { d: 'M121 70V44', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(121, 50, -150, 20, 7) + leaflet(121, 44, -40, 20, 7) }, 'green'),
    s('path', { d: sparkle(40, 80, 10) + sparkle(80, 56, 7) }, 'yellow')
  ],
  quejarse: [
    s('circle', { cx: 52, cy: 98, r: 36 }, 'skin'),
    s('path', { d: 'M32 84l14 6M72 84l-14 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M38 114l8-4 6 4 6-4 8 4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M78 18h62l-6 14 8 12-10 12 6 14H96l-14 12 2-14H76l6-14-8-12 8-12z' }, 'gray', { accent: true }),
    s('path', { d: 'M92 36l10 10-10 10M112 36l14 14M126 36l-14 14', ...SW(4) }, 'dark', { stroke: true })
  ],
  quiebra: [
    s('path', { d: 'M24 98q0-34 36-38l6 20-8 14 10 16-4 22q-38-4-40-34z' }, 'pink', { accent: true }),
    s('path', { d: 'M70 60q50 0 56 38q-2 30-44 34l4-22-10-16 8-14z' }, 'pink'),
    s('path', { d: 'M34 70l4-14 12 8z' }, 'pink'),
    s('ellipse', { cx: 132, cy: 98, rx: 7, ry: 10 }, 'red'),
    s('path', { d: 'M66 80l-8 14 10 16-4 22', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[60, 146], [92, 144]], 6) }, 'gray'),
    s('path', { d: 'M28 134l-6 8M96 134l6 8', ...SW(3) }, 'gray', { stroke: true })
  ],
  renovar: [
    s('rect', { x: 14, y: 30, width: 132, height: 110, rx: 4 }, 'gray'),
    s('rect', { x: 14, y: 30, width: 70, height: 110, rx: 4 }, 'sky'),
    s('rect', { x: 64, y: 16, width: 48, height: 22, rx: 6 }, 'blue', { accent: true }),
    s('path', { d: 'M112 27h12v24H90v40', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(40, 70, 10) + sparkle(56, 110, 7) }, 'white'),
    s('rect', { x: 84, y: 90, width: 12, height: 40, rx: 4 }, 'brown')
  ],
  ribera: [
    s('path', { d: 'M14 14h132v132H14z' }, 'green'),
    s('path', { d: 'M90 14q-30 40 10 66t-6 66h52V14z' }, 'blue', { accent: true }),
    s('path', { d: 'M98 40q6-4 12 0M110 80q6-4 12 0M106 120q6-4 12 0', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M62 130V80M72 130V70M82 130V86M54 130V92', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: ells([[72, 66, 3, 8], [62, 76, 3, 8], [82, 82, 3, 8], [54, 88, 3, 8]]) }, 'brown'),
    s('path', { d: dots([[30, 40], [40, 50]], 5) }, 'yellow')
  ],
  sargento: [
    s('path', { d: 'M30 140V60q0-26 50-26t50 26v80z' }, 'green', { accent: true }),
    s('path', { d: 'M46 66l34 20 34-20M46 84l34 20 34-20M46 102l34 20 34-20', ...SW(7) }, 'yellow', { stroke: true }),
    s('path', { d: 'M30 140h100', ...SW(4) }, 'dark', { stroke: true })
  ],
  sometido: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 66q0-20 20-24h60q16 4 16 22v12H38z' }, 'skin'),
    s('path', { d: 'M118 42h28V26', ...SW(14) }, 'blue', { stroke: true }),
    s('path', { d: 'M50 76v-6M66 76v-6M82 76v-6M98 76v-6', ...SW(3) }, 'tan', { stroke: true }),
    s('circle', { cx: 80, cy: 98, r: 11 }, 'skin'),
    s('path', { d: 'M62 136q0-28 18-28t18 28z' }, 'orange', { accent: true }),
    arrow('M30 40v26M22 58l8 8 8-8', 'red', 4)
  ],
  subsidio: [
    s('path', { d: 'M18 64h68M24 64v44M42 64v44M60 64v44M78 64v44M14 112h76', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 62l38-26 38 26z' }, 'gray'),
    arrow('M92 74q22-6 30 20M114 88l8 8 4-10', 'orange', 4),
    s('circle', { cx: 112, cy: 52, r: 11 }, 'yellow', { accent: true }),
    s('circle', { cx: 130, cy: 42, r: 9 }, 'yellow'),
    ...person(126, 140, 'purple', { h: 26, w: 20, r: 9 })
  ],
  suicida: [
    s('path', { d: 'M38 128h84l-8 18H46z' }, 'brown'),
    s('path', { d: 'M80 128V78q0-20 22-30', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M102 48q14 10 10 28q-12-4-16-12q-6 8-16 8q2-14 22-24z' }, 'gray', { accent: true }),
    s('path', { d: leaflet(80, 104, -150, 22, 7) }, 'green'),
    s('path', { d: ells([[56, 30, 18, 10], [74, 24, 14, 10]]) }, 'dark'),
    s('path', { d: drop(60, 52, 3) + drop(72, 60, 3) }, 'sky')
  ],
  validez: [
    ...paper(24, 18, 84, 112),
    s('path', { d: 'M38 40h56M38 54h56M38 68h40M38 82h50', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 106, cy: 110, r: 30 }, 'green', { accent: true }),
    s('path', { d: ring(106, 110, 24), ...SW(2) }, 'mint', { stroke: true }),
    s('path', { d: 'M94 110l8 8 16-16', ...SW(6) }, 'white', { stroke: true })
  ],
  vena: [
    s('path', { d: 'M14 104q60-14 132-20', ...SW(46) }, 'skin', { stroke: true }),
    s('path', { d: 'M20 108q40-10 70-8q20-2 50-18M90 100q16-16 44-24M56 104q14-12 30-16', ...SW(5) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M14 122q60-12 132-18', ...SW(4) }, 'tan', { stroke: true })
  ],
  viral: [
    s('path', { d: 'M80 80L32 32M80 80l48-48M80 80L28 112M80 80l52 32M80 80v58', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[32, 32], [128, 32], [28, 112], [132, 112], [80, 138]], 10) }, 'sky'),
    s('path', { d: burst(80, 80, 32, 24, 12) }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 18 }, 'pink'),
    s('path', { d: 'M74 70l14 10-14 10z' }, 'white')
  ],
  'válido': [
    s('rect', { x: 26, y: 26, width: 108, height: 108, rx: 12 }, 'white'),
    s('path', { d: 'M26 38a12 12 0 0 1 12-12h84a12 12 0 0 1 12 12v84a12 12 0 0 1-12 12H38a12 12 0 0 1-12-12z', ...SW(8) }, 'blue', { stroke: true }),
    s('path', { d: 'M48 80l22 22 44-46', ...SW(14) }, 'green', { stroke: true, accent: true })
  ],
  abundancia: [
    s('path', { d: 'M18 46q10 60 72 70l20-50q-60 2-80-26z' }, 'tan', { accent: true }),
    s('path', { d: 'M28 60q30 14 66 14M40 86q26 12 58 10', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: dots([[112, 72], [128, 96]], 13) }, 'red'),
    s('path', { d: dots([[104, 104], [114, 120], [128, 124]], 7) }, 'purple'),
    s('path', { d: ells([[136, 70, 9, 14]]) }, 'yellow'),
    s('path', { d: dots([[96, 132], [140, 140]], 8) }, 'orange'),
    s('path', { d: leaflet(112, 58, -60, 18, 6) }, 'green')
  ],
};
