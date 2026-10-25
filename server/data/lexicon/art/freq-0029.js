// Illustration specs for common words still undrawn in batches 0028 and 0029 (see server/scripts/lexicon/art.js)
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



module.exports = {
  suelto: [
    ground(134),
    s('path', { d: 'M22 124V92q0-8 8-8h20l16 14q24 4 48 10q18 4 18 16z' }, 'red', { accent: true }),
    s('rect', { x: 18, y: 122, width: 120, height: 10, rx: 5 }, 'dark'),
    s('path', { d: 'M46 88l10 8M54 86l10 8', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M66 98q-8 18-24 24M66 98q12 14 6 32', ...SW(4) }, 'yellow', { stroke: true })
  ],
  belga: [
    s('ellipse', { cx: 80, cy: 122, rx: 64, ry: 14 }, 'gray'),
    s('rect', { x: 30, y: 42, width: 100, height: 76, rx: 10 }, 'tan', { accent: true }),
    s('path', { d: 'M55 42v76M80 42v76M105 42v76M30 67h100M30 92h100', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: ells([[70, 44, 18, 10], [88, 40, 14, 9]]) }, 'white'),
    s('path', { d: dots([[60, 34], [100, 36]], 8) }, 'red')
  ],
  'parámetro': [
    s('rect', { x: 22, y: 24, width: 116, height: 112, rx: 10 }, 'dark'),
    s('path', { d: 'M48 40v80M80 40v80M112 40v80', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[38, 90, 20, 12], [70, 50, 20, 12], [102, 72, 20, 12]]) }, 'orange', { accent: true }),
    s('path', { d: 'M48 102v18M80 62v58M112 84v36', ...SW(4) }, 'green', { stroke: true })
  ],
  pirata: [
    s('circle', { cx: 80, cy: 86, r: 36 }, 'skin'),
    s('path', { d: 'M26 66q54-62 108 0q-54-16-108 0z' }, 'black', { accent: true }),
    s('path', { d: 'M46 74Q74 82 116 76', ...SW(3) }, 'black', { stroke: true }),
    s('circle', { cx: 66, cy: 84, r: 9 }, 'black'),
    s('circle', { cx: 96, cy: 84, r: 4 }, 'dark'),
    s('path', { d: 'M66 104q14 10 28 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ring(46, 100, 5), ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M80 34l-5 8h10z' }, 'white')
  ],
  planeado: [
    s('rect', { x: 18, y: 26, width: 124, height: 108, rx: 6 }, 'mint'),
    s('path', { d: 'M58 26v108M100 26v108', ...SW(2) }, 'green', { stroke: true }),
    s('path', { d: 'M36 116q30-6 34-36t50-30', ...DASH(4) }, 'red', { stroke: true }),
    s('circle', { cx: 36, cy: 116, r: 7 }, 'blue'),
    s('path', { d: 'M120 52V28', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M120 28h18l-6 7 6 7h-18z' }, 'red', { accent: true })
  ],
  racista: [
    ground(),
    ...person(36, 136, 'blue'),
    s('circle', { cx: 124, cy: 78, r: 12 }, 'brown'),
    s('rect', { x: 109, y: 92, width: 30, height: 44, rx: 10 }, 'green'),
    s('rect', { x: 64, y: 50, width: 32, height: 86 }, 'red', { accent: true }),
    s('path', { d: 'M64 72h32M64 94h32M64 116h32M80 50v22M72 72v22M88 72v22M80 94v22M72 116v20M88 116v20', ...SW(3) }, 'white', { stroke: true })
  ],
  rancho: [
    s('path', { d: 'M14 110h132v28H14z' }, 'green'),
    s('path', { d: 'M28 112V68l30-24 30 24v44z' }, 'red', { accent: true }),
    s('rect', { x: 46, y: 82, width: 24, height: 30 }, 'cream'),
    s('path', { d: 'M46 82l24 30M70 82l-24 30', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M100 92v26M118 92v26M136 92v26M96 100h44M96 110h44', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 124, cy: 38, r: 13 }, 'yellow')
  ],
  rechazar: [
    s('path', { d: 'M92 64V32M102 62V24M112 62V26M122 66V36', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M90 88l-16-14', ...SW(10) }, 'skin', { stroke: true }),
    s('rect', { x: 86, y: 58, width: 42, height: 52, rx: 14 }, 'skin'),
    s('rect', { x: 92, y: 106, width: 30, height: 34, rx: 4 }, 'blue'),
    s('circle', { cx: 30, cy: 88, r: 13 }, 'red', { accent: true }),
    arrow('M70 88H48M56 80l-8 8 8 8')
  ],
  reforzar: [
    ground(),
    s('path', { d: 'M80 64L34 136M80 64l46 72', ...SW(8) }, 'orange', { stroke: true, accent: true }),
    s('rect', { x: 66, y: 28, width: 28, height: 108, rx: 2 }, 'tan'),
    s('path', { d: rects([[62, 46, 36, 8], [62, 94, 36, 8]]) }, 'gray'),
    s('circle', { cx: 80, cy: 66, r: 5 }, 'dark'),
    s('path', { d: 'M24 34h16M32 26v16', ...SW(5) }, 'green', { stroke: true })
  ],
  resistir: [
    ground(),
    s('path', { d: 'M14 52h40M20 72h40M14 92h34', ...SW(5) }, 'sky', { stroke: true }),
    ...lean(96, 134, -18, 'blue', { accent: true }),
    s('path', { d: 'M84 136h26', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: leaflet(26, 116, -20, 14, 5) + leaflet(40, 36, 10, 14, 5) }, 'green')
  ],
  respectivo: [
    ...person(36, 100, 'red', { h: 34, w: 22, r: 10 }),
    ...person(80, 100, 'blue', { h: 34, w: 22, r: 10, accent: true }),
    ...person(124, 100, 'green', { h: 34, w: 22, r: 10 }),
    s('rect', { x: 22, y: 112, width: 28, height: 22, rx: 3 }, 'red'),
    s('rect', { x: 66, y: 112, width: 28, height: 22, rx: 3 }, 'blue'),
    s('rect', { x: 110, y: 112, width: 28, height: 22, rx: 3 }, 'green')
  ],
  salina: [
    s('path', { d: rects([[16, 98, 62, 18], [82, 98, 62, 18], [16, 120, 62, 18], [82, 120, 62, 18]]) }, 'sky'),
    s('path', { d: 'M28 94l16-24 16 24zM94 94l18-28 18 28z' }, 'white'),
    s('path', { d: 'M28 94l16-24 16 24zM94 94l18-28 18 28z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 95h132', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 78, cy: 34, r: 13 }, 'yellow', { accent: true }),
    s('path', { d: rays(78, 34, 18, 26, 8), ...SW(3) }, 'orange', { stroke: true })
  ],
  sexualidad: [
    s('path', { d: ring(62, 72, 24), ...SW(8) }, 'pink', { stroke: true, accent: true }),
    s('path', { d: 'M62 96v36M48 116h28', ...SW(8) }, 'pink', { stroke: true }),
    s('path', { d: ring(98, 62, 24), ...SW(8) }, 'blue', { stroke: true }),
    s('path', { d: 'M115 45l22-22M122 23h15v15', ...SW(8) }, 'blue', { stroke: true })
  ],
  socorro: [
    s('circle', { cx: 76, cy: 88, r: 14 }, 'skin'),
    s('path', { d: 'M88 96l18-42', ...SW(9) }, 'skin', { stroke: true }),
    s('circle', { cx: 108, cy: 48, r: 7 }, 'skin'),
    s('path', { d: 'M14 100q11-8 22 0t22 0 22 0 22 0 22 0 22 0V146H14z' }, 'blue'),
    s('path', { d: ring(36, 62, 15), ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M120 38l10-8M122 52h12', ...SW(3) }, 'orange', { stroke: true })
  ],
  tropical: [
    s('path', { d: 'M14 120q33-6 66 0t66 0V140H14z' }, 'sky'),
    s('ellipse', { cx: 72, cy: 120, rx: 44, ry: 12 }, 'tan'),
    s('path', { d: 'M72 118q-4-40 12-74', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(84, 44, -160, 42, 9) + leaflet(84, 44, -20, 42, 9) + leaflet(84, 44, 150, 38, 8) + leaflet(84, 44, 30, 38, 8) + leaflet(84, 44, -90, 30, 7) }, 'green', { accent: true }),
    s('path', { d: dots([[78, 52], [90, 52]], 5) }, 'brown'),
    s('circle', { cx: 130, cy: 30, r: 12 }, 'yellow')
  ],
  'varón': [
    ground(),
    s('rect', { x: 56, y: 72, width: 48, height: 64, rx: 16 }, 'blue', { accent: true }),
    s('path', { d: 'M80 74l-5 6 5 24 5-24z' }, 'red'),
    s('circle', { cx: 80, cy: 48, r: 20 }, 'skin'),
    s('path', { d: 'M60 46q0-24 20-24t20 24q-6-12-20-12t-20 12z' }, 'dark'),
    s('path', { d: dots([[73, 48], [87, 48]], 2.5) }, 'dark'),
    s('path', { d: 'M70 58q5-5 10 0q5-5 10 0q-5 4-10 1q-5 3-10-1z' }, 'brown')
  ],
  vestir: [
    ground(),
    s('path', { d: 'M26 50l16-10 16 10M42 40v-6a5 5 0 1 1 5-5', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 50l8-4q6 6 12 0l8 4 12 12-8 8-6-6v38H28V64l-6 6-8-8z' }, 'red', { accent: true }),
    arrow('M76 86h18M86 78l8 8-8 8'),
    ...person(120, 136, 'sky')
  ],
  'vocación': [
    ground(),
    ...person(80, 136, 'purple'),
    s('path', { d: heart(80, 112, 10) }, 'red', { accent: true }),
    s('path', { d: star(80, 30, 14) }, 'yellow'),
    s('path', { d: rays(80, 30, 19, 27, 8), ...SW(3) }, 'orange', { stroke: true })
  ],
  alivio: [
    s('circle', { cx: 72, cy: 84, r: 48 }, 'skin'),
    s('path', { d: 'M46 78q9 7 18 0M80 78q9 7 18 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 104q10 8 20 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[118, 110, 12, 9], [134, 98, 10, 8], [138, 82, 7, 6]]) }, 'sky', { accent: true }),
    s('path', { d: drop(104, 50, 6) }, 'blue')
  ],
  almacenamiento: [
    s('rect', { x: 40, y: 40, width: 80, height: 80 }, 'blue', { accent: true }),
    s('ellipse', { cx: 80, cy: 120, rx: 40, ry: 12 }, 'blue'),
    s('ellipse', { cx: 80, cy: 40, rx: 40, ry: 12 }, 'sky'),
    s('path', { d: 'M40 66a40 12 0 0 0 80 0M40 93a40 12 0 0 0 80 0', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: dots([[104, 82], [104, 109], [104, 55]], 4) }, 'green')
  ],
  atento: [
    s('circle', { cx: 74, cy: 82, r: 46 }, 'skin'),
    s('path', { d: dots([[58, 74], [90, 74]], 10) }, 'white'),
    s('path', { d: dots([[60, 75], [92, 75]], 5) }, 'dark'),
    s('path', { d: 'M48 56l16-4M84 52l16 4M66 104q8 4 16 0', ...SW(4) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 124, cy: 84, rx: 11, ry: 19 }, 'tan', { accent: true }),
    s('path', { d: 'M140 70q7 14 0 28', ...SW(4) }, 'blue', { stroke: true })
  ],
  'atlántico': [
    s('path', { d: 'M14 100q11-8 22 0t22 0 22 0 22 0 22 0 22 0V140H14z' }, 'blue', { accent: true }),
    s('path', { d: 'M24 118q8-6 16 0M80 126q8-6 16 0M112 114q8-6 16 0', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M50 90h60l-10 14H60z' }, 'brown'),
    s('path', { d: 'M80 90V30', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M83 34q26 24 0 50zM77 40q-24 20 0 44z' }, 'cream'),
    s('path', { d: 'M83 34q26 24 0 50zM77 40q-24 20 0 44z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: birds([[34, 42], [52, 32]]), ...SW(3) }, 'dark', { stroke: true })
  ],
  'bendición': [
    s('circle', { cx: 80, cy: 80, r: 42 }, 'cream'),
    s('path', { d: rays(80, 80, 48, 64, 12), ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M80 40q-20 30-22 60l-6 18h28z' }, 'skin'),
    s('path', { d: 'M80 40q20 30 22 60l6 18H80z' }, 'tan'),
    s('rect', { x: 48, y: 114, width: 64, height: 26, rx: 6 }, 'purple', { accent: true })
  ],
  bruto: [
    ground(),
    s('path', { d: 'M120 28q14 0 12 16l-12 62-8-2 0-62q0-14 8-14z' }, 'tan'),
    s('rect', { x: 46, y: 72, width: 60, height: 64, rx: 18 }, 'brown', { accent: true }),
    s('path', { d: dots([[60, 96], [82, 116], [92, 88]], 4) }, 'dark'),
    s('path', { d: 'M100 86l14 14', ...SW(10) }, 'skin', { stroke: true }),
    s('circle', { cx: 76, cy: 52, r: 18 }, 'skin'),
    s('path', { d: 'M64 46l8 4M88 46l-8 4M70 62h12', ...SW(3) }, 'dark', { stroke: true })
  ],
  cancelar: [
    s('path', { d: 'M22 46h116v24a10 10 0 0 0 0 20v24H22V90a10 10 0 0 0 0-20z' }, 'yellow'),
    s('path', { d: 'M104 46v68', ...DASH(3, '5 5') }, 'dark', { stroke: true }),
    s('path', { d: 'M44 56l48 48M92 56l-48 48', ...SW(10) }, 'red', { stroke: true, accent: true })
  ],
  canciller: [
    backdrop('sky'),
    s('circle', { cx: 80, cy: 44, r: 14 }, 'skin'),
    s('rect', { x: 60, y: 60, width: 40, height: 44, rx: 12 }, 'navy'),
    s('path', { d: 'M64 64l32 30', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M46 96h68l-8 44H54z' }, 'brown', { accent: true }),
    s('path', { d: 'M70 96l-6-14', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 116, r: 8 }, 'yellow')
  ],
  carecer: [
    s('rect', { x: 24, y: 24, width: 112, height: 112, rx: 6 }, 'blue', { accent: true }),
    s('path', { d: 'M80 24v56M24 80h56M80 80v56M80 80h56', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M84 84h18a8 8 0 1 1 14 0h18v50H84v-18a8 8 0 1 0 0-14z' }, 'white'),
    s('path', { d: 'M84 84h18a8 8 0 1 1 14 0h18v50H84v-18a8 8 0 1 0 0-14z', ...DASH(3, '5 4') }, 'gray', { stroke: true })
  ],
  'cañón': [
    backdrop('sky'),
    s('circle', { cx: 80, cy: 34, r: 10 }, 'yellow'),
    s('path', { d: 'M14 30h38l6 30-8 30 10 56H14z' }, 'orange', { accent: true }),
    s('path', { d: 'M146 30h-40l-8 34 10 30-10 52h48z' }, 'brown'),
    s('path', { d: 'M60 146l-4-24h46l-4 24z' }, 'blue'),
    s('path', { d: 'M14 60h40M14 98h40M106 64h40M108 102h38', ...SW(3) }, 'brown', { stroke: true })
  ],
  chihuahua: [
    ground(),
    s('ellipse', { cx: 92, cy: 110, rx: 30, ry: 16 }, 'tan'),
    s('path', { d: 'M74 118v18M86 122v14M102 122v14M114 118v18M120 104q14-10 8-22', ...SW(6) }, 'tan', { stroke: true }),
    s('path', { d: 'M46 74l-12-34 24 20zM70 66l10-32 6 36z' }, 'tan', { accent: true }),
    s('path', { d: 'M44 64l-6-16 10 10zM74 60l5-16 2 16z' }, 'pink'),
    s('circle', { cx: 60, cy: 80, r: 18 }, 'tan'),
    s('path', { d: dots([[54, 78], [66, 78]], 3.5) + dots([[60, 88]], 3) }, 'dark')
  ],
  concretamente: [
    s('circle', { cx: 74, cy: 86, r: 52 }, 'red', { accent: true }),
    s('circle', { cx: 74, cy: 86, r: 38 }, 'white'),
    s('circle', { cx: 74, cy: 86, r: 24 }, 'red'),
    s('circle', { cx: 74, cy: 86, r: 10 }, 'white'),
    s('path', { d: 'M74 86L134 26', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M126 22l14-6-6 14zM134 34l10-4-4 10z' }, 'orange')
  ],
  'configuración': [
    ...gear(64, 64, 26, 8, 'gray'),
    s('circle', { cx: 64, cy: 64, r: 10 }, 'white'),
    s('rect', { x: 76, y: 104, width: 60, height: 30, rx: 15 }, 'green', { accent: true }),
    s('circle', { cx: 121, cy: 119, r: 11 }, 'white'),
    s('rect', { x: 24, y: 112, width: 40, height: 14, rx: 7 }, 'gray'),
    s('circle', { cx: 32, cy: 119, r: 9 }, 'dark')
  ],
  conquistar: [
    s('path', { d: 'M14 140Q74 50 146 140z' }, 'green'),
    s('path', { d: 'M78 96V26', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M78 26h36l-8 10 8 10H78z' }, 'red', { accent: true }),
    ...person(104, 104, 'blue', { h: 28, w: 18, r: 9 }),
    s('path', { d: 'M110 86l12-14', ...SW(5) }, 'skin', { stroke: true })
  ],
  'contraseña': [
    s('rect', { x: 16, y: 92, width: 128, height: 36, rx: 8 }, 'white'),
    outline({ x: 16, y: 92, width: 128, height: 36, rx: 8 }),
    s('path', { d: dots([[36, 110], [54, 110], [72, 110], [90, 110], [108, 110]], 6) }, 'dark'),
    s('path', { d: 'M126 100v20', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M68 54V42a12 12 0 0 1 24 0v12', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 58, y: 52, width: 44, height: 32, rx: 5 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 66, r: 4 }, 'dark')
  ],
  controversia: [
    ...person(36, 136, 'blue'),
    ...person(124, 136, 'green'),
    s('path', { d: burst(48, 38, 22, 14, 9) }, 'orange', { accent: true }),
    s('path', { d: burst(112, 38, 22, 14, 9) }, 'red'),
    s('path', { d: 'M84 64l-8 14h10l-8 14', ...SW(4) }, 'dark', { stroke: true })
  ],
  'corrección': [
    ...paper(26, 20, 84, 120),
    s('path', { d: 'M38 42h44M38 62h52M38 82h40M38 102h48', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M88 38l6 8 12-16M84 76l12 12M96 76l-12 12', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M140 64L110 120', ...SW(12) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M107 125l-4 11', ...SW(4) }, 'dark', { stroke: true })
  ],
  criatura: [
    s('ellipse', { cx: 80, cy: 136, rx: 40, ry: 6 }, 'gray'),
    s('path', { d: 'M64 54l-10-24M96 54l10-24', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots([[54, 30], [106, 30]], 6) }, 'pink'),
    s('path', { d: 'M40 132q-6-80 40-82t40 82q-10-8-20 0-10-8-20 0-10-8-20 0-10-8-20 0z' }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 82, r: 16 }, 'white'),
    s('circle', { cx: 82, cy: 84, r: 8 }, 'dark'),
    s('path', { d: 'M68 108q12 10 24 0', ...SW(4) }, 'dark', { stroke: true })
  ],
  crudo: [
    s('rect', { x: 16, y: 118, width: 128, height: 16, rx: 6 }, 'brown'),
    s('path', { d: 'M28 76q4-36 52-38q52 0 54 40q2 42-50 44q-60 0-56-46z' }, 'red', { accent: true }),
    s('path', { d: 'M40 60q40-22 84 0', ...SW(8) }, 'white', { stroke: true }),
    s('path', { d: 'M52 92q12-8 20 0M86 104q10-6 18 2', ...SW(4) }, 'pink', { stroke: true }),
    s('circle', { cx: 100, cy: 80, r: 9 }, 'cream')
  ],
  'desesperación': [
    ground(),
    s('path', { d: ells([[58, 34, 20, 14], [82, 28, 22, 16], [104, 36, 18, 12]]) }, 'dark'),
    s('path', { d: 'M60 58l-4 10M80 56l-4 10M100 58l-4 10', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M56 136v-30q0-18 24-18t24 18v30z' }, 'navy', { accent: true }),
    s('circle', { cx: 80, cy: 86, r: 13 }, 'skin'),
    s('path', { d: 'M62 106q-6-16 8-24M98 106q6-16-8-24', ...SW(7) }, 'skin', { stroke: true })
  ],
  'designación': [
    ground(),
    ...person(64, 136, 'navy'),
    s('path', { d: star(70, 104, 10) }, 'yellow', { accent: true }),
    s('path', { d: 'M148 66L112 84', ...SW(12) }, 'gray', { stroke: true }),
    s('circle', { cx: 104, cy: 88, r: 8 }, 'skin'),
    s('path', { d: sparkle(96, 60, 9) }, 'orange')
  ],
  deterioro: [
    ground(),
    s('path', { d: 'M36 136V48l14 8 10-14 12 10 10-6 12 12 16-6v84z' }, 'tan', { accent: true }),
    s('path', { d: rects([[46, 66, 14, 14], [76, 66, 14, 14], [46, 96, 14, 14], [76, 96, 14, 14]]) }, 'dark'),
    s('path', { d: 'M66 54l6 16-6 12 8 14M100 66l-6 14 6 10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: rects([[112, 128, 12, 8], [126, 128, 12, 8], [118, 120, 12, 8]]) }, 'brown')
  ],
  'diseñador': [
    s('path', { d: 'M48 140l18-40M112 140l-18-40M80 140V100', ...SW(5) }, 'brown', { stroke: true }),
    ...paper(28, 22, 104, 80),
    s('circle', { cx: 56, cy: 52, r: 14 }, 'blue'),
    s('path', { d: 'M82 78l18-32 18 32z' }, 'orange', { accent: true }),
    s('rect', { x: 42, y: 74, width: 22, height: 18 }, 'red'),
    s('path', { d: 'M114 120l26-26', ...SW(8) }, 'yellow', { stroke: true })
  ],
  distinguir: [
    backdrop('mint'),
    s('path', { d: 'M24 104v14M40 104v14M68 104v14M84 104v14M112 104v14M128 104v14', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[32, 92, 18, 14], [120, 92, 18, 14]]) }, 'white'),
    s('ellipse', { cx: 76, cy: 92, rx: 18, ry: 14 }, 'black', { accent: true }),
    s('path', { d: dots([[50, 84], [94, 84], [138, 84]], 7) }, 'dark')
  ],
  'diámetro': [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'sky', { accent: true }),
    s('path', { d: ring(80, 80, 56), ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M30 80h100M38 72l-8 8 8 8M122 72l8 8-8 8', ...SW(5) }, 'navy', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 5 }, 'red')
  ],
  ente: [
    s('ellipse', { cx: 80, cy: 136, rx: 40, ry: 6 }, 'gray'),
    s('path', { d: 'M80 34l44 22-44 22-44-22z' }, 'sky'),
    s('path', { d: 'M36 56l44 22v50l-44-22z' }, 'blue', { accent: true }),
    s('path', { d: 'M124 56l-44 22v50l44-22z' }, 'navy'),
    s('path', { d: sparkle(130, 30, 10) + sparkle(28, 40, 7) }, 'yellow')
  ],
  entrenar: [
    ground(),
    s('path', { d: 'M70 104l-8 32M90 104l8 32', ...SW(8) }, 'navy', { stroke: true }),
    s('path', { d: 'M64 64H36M96 64h28', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: rects([[24, 50, 10, 28], [126, 50, 10, 28]]) }, 'dark'),
    s('rect', { x: 64, y: 56, width: 32, height: 48, rx: 10 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 40, r: 13 }, 'skin'),
    s('path', { d: drop(104, 30, 5) }, 'sky')
  ],
  'escaño': [
    s('path', { d: rects([[32, 72, 16, 40], [112, 72, 16, 40]]) }, 'brown'),
    s('rect', { x: 46, y: 26, width: 68, height: 70, rx: 12 }, 'green', { accent: true }),
    s('path', { d: dots([[64, 48], [96, 48], [64, 72], [96, 72], [80, 60]], 3) }, 'mint'),
    s('rect', { x: 40, y: 88, width: 80, height: 22, rx: 6 }, 'green'),
    s('path', { d: 'M46 110v26M114 110v26', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M44 94h72', ...SW(3) }, 'mint', { stroke: true })
  ],
  especializado: [
    s('circle', { cx: 68, cy: 92, r: 42 }, 'gray'),
    s('circle', { cx: 68, cy: 92, r: 34 }, 'white'),
    ...gear(68, 92, 12, 8, 'orange'),
    s('circle', { cx: 68, cy: 92, r: 12 }, 'orange', { accent: true }),
    s('path', { d: 'M136 22L84 82M146 32L90 86', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M136 22l10 10', ...SW(6) }, 'dark', { stroke: true })
  ],
  estacionamiento: [
    backdrop('dark'),
    s('path', { d: 'M24 26v84M60 26v84M96 26v84M132 26v84', ...SW(4) }, 'white', { stroke: true }),
    s('rect', { x: 30, y: 38, width: 24, height: 50, rx: 8 }, 'red', { accent: true }),
    s('rect', { x: 102, y: 38, width: 24, height: 50, rx: 8 }, 'blue'),
    s('path', { d: rects([[33, 48, 18, 10], [105, 48, 18, 10]]) }, 'sky'),
    s('path', { d: 'M36 128h84M108 120l12 8-12 8', ...SW(4) }, 'yellow', { stroke: true })
  ],
  estatuto: [
    s('rect', { x: 36, y: 30, width: 88, height: 100 }, 'cream'),
    s('path', { d: 'M36 30v100M124 30v100', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 52h64M48 66h64M48 80h50M48 94h40', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 28, y: 20, width: 104, height: 14, rx: 7 }, 'tan'),
    s('rect', { x: 28, y: 124, width: 104, height: 14, rx: 7 }, 'tan'),
    s('path', { d: 'M98 112l-4 18M110 112l4 18', ...SW(5) }, 'red', { stroke: true }),
    s('circle', { cx: 104, cy: 104, r: 12 }, 'red', { accent: true })
  ],
  'expulsión': [
    ground(),
    s('rect', { x: 18, y: 30, width: 46, height: 106 }, 'brown'),
    s('rect', { x: 24, y: 36, width: 34, height: 100 }, 'dark'),
    s('path', { d: 'M64 112h14M64 98h10', ...SW(3) }, 'gray', { stroke: true }),
    ...lean(102, 130, 30, 'red', { h: 36, w: 24, r: 10, accent: true }),
    arrow('M56 60q32-24 70 2M118 52l8 10-12 4')
  ],
  fino: [
    s('path', { d: 'M38 130L124 34', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M117 43l4-5', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M120 40q24 18-8 40t-40 50q-8 12 6 18', ...SW(3) }, 'red', { stroke: true, accent: true }),
    s('path', { d: sparkle(54, 50, 12) + sparkle(30, 82, 7) }, 'yellow')
  ],
  finca: [
    s('path', { d: 'M14 100h132v40H14z' }, 'green'),
    s('path', { d: 'M14 112h132M14 124h132M14 136h132', ...SW(3) }, 'mint', { stroke: true }),
    s('rect', { x: 36, y: 64, width: 56, height: 36 }, 'tan'),
    s('path', { d: 'M30 66l34-26 34 26z' }, 'red', { accent: true }),
    s('rect', { x: 58, y: 80, width: 12, height: 20 }, 'brown'),
    s('path', { d: 'M120 100V74', ...SW(5) }, 'brown', { stroke: true }),
    s('circle', { cx: 120, cy: 62, r: 17 }, 'green')
  ],
  forestal: [
    ground(),
    s('path', { d: rects([[34, 120, 8, 16], [76, 120, 8, 16], [118, 120, 8, 16]]) }, 'brown'),
    s('path', { d: 'M18 122l20-60 20 60zM100 122l22-62 22 62z' }, 'mint'),
    s('path', { d: 'M48 124l32-104 32 104z' }, 'green', { accent: true }),
    s('path', { d: 'M62 80l18-10 18 10M56 102l24-12 24 12', ...SW(3) }, 'mint', { stroke: true })
  ],
  hierba: [
    s('path', { d: 'M14 126h132v12H14z' }, 'brown'),
    s('path', { d: 'M26 126q-4-30-10-42M32 126q2-36 12-52M38 126q6-28 18-36M50 126q0-20 8-28M60 126q-2-24-12-32', ...SW(5) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M108 126V52', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(108, 110, -150, 24, 8) + leaflet(108, 110, -30, 24, 8) + leaflet(108, 86, -150, 22, 7) + leaflet(108, 86, -30, 22, 7) + leaflet(108, 60, -90, 20, 7) }, 'green')
  ],
  homosexual: [
    ground(),
    ...person(50, 136, 'blue'),
    ...person(110, 136, 'purple'),
    s('path', { d: 'M64 108h32', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 40, 14) }, 'red', { accent: true })
  ],
  inspector: [
    ground(),
    ...person(58, 136, 'navy', { accent: true }),
    s('path', { d: 'M44 72q14-20 28 0h6v4H44z' }, 'navy'),
    s('rect', { x: 74, y: 90, width: 26, height: 34, rx: 3 }, 'brown'),
    s('rect', { x: 78, y: 96, width: 18, height: 24 }, 'white'),
    s('circle', { cx: 118, cy: 58, r: 13 }, 'sky'),
    s('path', { d: ring(118, 58, 14), ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 68l-12 12', ...SW(6) }, 'dark', { stroke: true })
  ],
  jazz: [
    s('path', { d: 'M68 26v70q0 30 26 30t24-24', ...SW(14) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M110 104l8-22h18l-6 22z' }, 'orange'),
    s('path', { d: 'M68 26l-8-10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[68, 50], [68, 64], [68, 78]], 4) }, 'dark'),
    ...note(32, 72, 'navy'),
    ...note(118, 42, 'purple')
  ],
  'justificación': [
    ...person(36, 136, 'green'),
    s('path', { d: bubble(56, 18, 88, 70) }, 'cream'),
    s('path', { d: bubble(56, 18, 88, 70), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 30v46M86 76h28M78 40h44M78 40l-10 16M78 40l10 16M122 40l-10 16M122 40l10 16', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 56a12 8 0 0 0 24 0zM110 56a12 8 0 0 0 24 0z' }, 'yellow', { accent: true })
  ],
  'latín': [
    s('path', { d: 'M36 66q44-60 92 0l-8 4q-38-44-76 0z' }, 'red', { accent: true }),
    s('path', { d: 'M40 104q0-54 44-54t44 54z' }, 'yellow'),
    s('path', { d: 'M56 102v30l18-8v-22z' }, 'yellow'),
    s('path', { d: 'M36 104h96', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: dots([[60, 80], [84, 70], [108, 80]], 4) }, 'orange')
  ],
  listado: [
    s('rect', { x: 30, y: 22, width: 100, height: 120, rx: 8 }, 'brown'),
    s('rect', { x: 40, y: 36, width: 80, height: 98, rx: 3 }, 'white'),
    s('rect', { x: 62, y: 16, width: 36, height: 14, rx: 4 }, 'gray'),
    s('path', { d: rects([[48, 48, 12, 12], [48, 74, 12, 12], [48, 100, 12, 12]]), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M49 53l5 5 9-12M49 79l5 5 9-12', ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M70 54h40M70 80h40M70 106h40', ...SW(4) }, 'gray', { stroke: true })
  ],
  lucro: [
    s('path', { d: 'M54 62q-30 28-24 58q4 18 40 18t40-18q6-30-24-58z' }, 'tan'),
    s('path', { d: 'M62 62l-8-18h32l-8 18z' }, 'tan'),
    s('path', { d: 'M58 62h24', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: ells([[128, 132, 14, 5], [128, 124, 14, 5], [128, 116, 14, 5]]) }, 'yellow'),
    s('path', { d: ells([[128, 132, 14, 5], [128, 124, 14, 5], [128, 116, 14, 5]]), ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M128 100V30M116 42l12-12 12 12', ...SW(6) }, 'green', { stroke: true, accent: true })
  ],
  madurez: [
    s('path', { d: 'M34 80v-8M80 78v-8M122 70v-8', ...SW(4) }, 'green', { stroke: true }),
    s('circle', { cx: 34, cy: 96, r: 16 }, 'green'),
    s('circle', { cx: 80, cy: 96, r: 18 }, 'orange'),
    s('circle', { cx: 122, cy: 92, r: 22 }, 'red', { accent: true }),
    s('path', { d: 'M30 132h92M112 124l10 8-10 8', ...SW(4) }, 'gray', { stroke: true })
  ],
  monopolio: [
    s('path', { d: rects([[38, 72, 20, 24], [66, 64, 24, 32], [100, 72, 20, 24]]) }, 'blue'),
    s('path', { d: 'M34 74l14-12 14 12zM62 66l16-14 16 14zM96 74l14-12 14 12z' }, 'red'),
    s('path', { d: 'M18 94q0 44 62 44t62-44z' }, 'skin', { accent: true }),
    s('path', { d: 'M138 98q12-20-2-34', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M40 112q40 14 80 0', ...SW(3) }, 'tan', { stroke: true })
  ],
  noroeste: [
    s('circle', { cx: 80, cy: 80, r: 58 }, 'navy'),
    s('circle', { cx: 80, cy: 80, r: 48 }, 'cream'),
    s('path', { d: rays(80, 80, 40, 48, 8, -90), ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M48 48L85.7 74.3L74.3 85.7z' }, 'red', { accent: true }),
    s('path', { d: 'M112 112L85.7 74.3L74.3 85.7z' }, 'gray'),
    s('circle', { cx: 80, cy: 80, r: 4 }, 'white')
  ],
  noruego: [
    backdrop('sky'),
    s('path', { d: 'M14 110L50 40l20 30 22-44 54 84z' }, 'navy'),
    s('path', { d: 'M50 40l-9 18 9-5 6 6zM92 26l-11 22 11-6 8 8z' }, 'white'),
    s('path', { d: 'M14 110h132v36H14z' }, 'blue'),
    s('ellipse', { cx: 86, cy: 126, rx: 22, ry: 9 }, 'orange', { accent: true }),
    s('path', { d: 'M66 126l-14-9v18z' }, 'orange')
  ],
  operador: [
    s('rect', { x: 48, y: 70, width: 48, height: 44, rx: 14 }, 'blue'),
    s('circle', { cx: 72, cy: 48, r: 20 }, 'skin'),
    s('path', { d: 'M52 48a20 20 0 0 1 40 0', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 46, y: 42, width: 10, height: 16, rx: 4 }, 'dark'),
    s('path', { d: 'M52 58q4 16 20 14', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 22, y: 104, width: 116, height: 34, rx: 6 }, 'gray'),
    s('path', { d: dots([[44, 121], [62, 121]], 5) }, 'green', { accent: true }),
    s('path', { d: dots([[98, 121], [116, 121]], 5) }, 'red')
  ],
  palestino: [
    s('path', { d: 'M14 138q66-40 132 0z' }, 'tan'),
    s('path', { d: 'M80 128q-6-30 4-50M82 92l-16-14', ...SW(9) }, 'brown', { stroke: true }),
    s('path', { d: ells([[58, 66, 24, 16], [100, 62, 28, 18], [80, 46, 26, 16]]) }, 'green', { accent: true }),
    s('path', { d: dots([[50, 72], [70, 56], [96, 70], [112, 56], [88, 40]], 4) }, 'dark'),
    s('circle', { cx: 130, cy: 30, r: 10 }, 'yellow')
  ],
  plantilla: [
    s('path', { d: 'M80 18c22 0 30 20 28 44-2 20-10 30-8 50 2 18-6 30-20 30s-22-12-20-30c2-20-8-34-8-54 0-24 10-40 28-40z' }, 'tan', { accent: true }),
    s('path', { d: 'M80 18c22 0 30 20 28 44-2 20-10 30-8 50 2 18-6 30-20 30s-22-12-20-30c2-20-8-34-8-54 0-24 10-40 28-40z', ...SW(3) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 80, cy: 122, rx: 12, ry: 12 }, 'sky'),
    s('path', { d: dots([[72, 40], [88, 40], [80, 52], [72, 64], [88, 64]], 2.5) }, 'brown')
  ],
  ranking: [
    ground(),
    s('rect', { x: 60, y: 70, width: 40, height: 66 }, 'yellow', { accent: true }),
    s('rect', { x: 20, y: 92, width: 40, height: 44 }, 'gray'),
    s('rect', { x: 100, y: 106, width: 40, height: 30 }, 'orange'),
    s('path', { d: star(80, 46, 16) }, 'yellow'),
    s('path', { d: dots([[40, 78], [120, 92]], 7) }, 'brown')
  ],
  'recaudación': [
    s('path', { d: 'M36 72l12-14h64l12 14z' }, 'sky'),
    s('rect', { x: 36, y: 72, width: 88, height: 64, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: 'M68 65h24', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[80, 42], [54, 30], [106, 26]], 9) }, 'yellow'),
    s('path', { d: ring(80, 42, 9) + ring(54, 30, 9) + ring(106, 26, 9), ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M50 100h60M50 112h60', ...SW(3) }, 'sky', { stroke: true })
  ],
  regularmente: [
    s('rect', { x: 24, y: 30, width: 112, height: 104, rx: 8 }, 'white'),
    outline({ x: 24, y: 30, width: 112, height: 104, rx: 8 }),
    s('path', { d: 'M24 52V38a8 8 0 0 1 8-8h96a8 8 0 0 1 8 8v14z' }, 'red'),
    s('path', { d: 'M50 22v16M110 22v16', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([40, 80, 100, 120].flatMap(x => [68, 90, 112].map(y => [x, y])), 4) }, 'gray'),
    s('path', { d: dots([[60, 68], [60, 90], [60, 112]], 8) }, 'green', { accent: true })
  ],
  reportaje: [
    ground(),
    ...person(48, 136, 'red'),
    s('path', { d: 'M62 106l16-12', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M78 94l8-10', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 88, cy: 80, r: 6 }, 'dark'),
    s('path', { d: 'M122 78l-12 58M122 78l12 58M122 78v58', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 104, y: 54, width: 38, height: 26, rx: 4 }, 'dark'),
    s('circle', { cx: 102, cy: 67, r: 9 }, 'gray'),
    s('circle', { cx: 134, cy: 60, r: 3 }, 'red', { accent: true })
  ],
  respectar: [
    ground(),
    s('path', { d: 'M50 136v-28', ...SW(14) }, 'green', { stroke: true }),
    s('path', { d: 'M50 108l30-20', ...SW(20) }, 'green', { stroke: true }),
    s('circle', { cx: 94, cy: 86, r: 11 }, 'skin'),
    ...person(118, 136, 'blue', { accent: true }),
    s('path', { d: heart(92, 50, 8) }, 'pink')
  ],
  'tontería': [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'yellow', { accent: true }),
    s('path', { d: spiral(52, 64) + spiral(94, 64), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M76 106h18v12a9 9 0 0 1-18 0z' }, 'pink'),
    s('path', { d: 'M52 100q28 18 56 0', ...SW(4) }, 'dark', { stroke: true })
  ],
  'túnel': [
    s('path', { d: 'M14 130L60 40l20 18 22-30 44 102z' }, 'green', { accent: true }),
    s('path', { d: 'M50 130v-26a30 30 0 0 1 60 0v26', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M56 130v-26a24 24 0 0 1 48 0v26z' }, 'dark'),
    s('path', { d: dots([[70, 116], [90, 116]], 4) }, 'yellow'),
    s('path', { d: 'M56 130h48l22 16H34z' }, 'gray'),
    s('path', { d: 'M80 132v14', ...DASH(3, '4 4') }, 'yellow', { stroke: true })
  ],
  valioso: [
    s('ellipse', { cx: 80, cy: 128, rx: 54, ry: 12 }, 'red'),
    s('path', { d: 'M44 56l16-20h40l16 20z' }, 'sky'),
    s('path', { d: 'M44 56h72l-36 64z' }, 'blue', { accent: true }),
    s('path', { d: 'M60 36l8 20 12-20 12 20 8-20M68 56l12 64 12-64', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: sparkle(128, 34, 12) + sparkle(30, 96, 9) + sparkle(124, 96, 8) }, 'yellow')
  ],
  'valoración': [
    s('rect', { x: 14, y: 52, width: 132, height: 56, rx: 12 }, 'navy'),
    s('path', { d: star(32, 80, 12) + star(56, 80, 12) + star(80, 80, 12) + star(104, 80, 12) }, 'yellow', { accent: true }),
    s('path', { d: star(128, 80, 12) }, 'gray')
  ],
  'élite': [
    s('path', { d: dots([[128, 8], [112, 6], [96, 4]].flatMap(([y, n]) => Array.from({ length: n }, (_, i) => [80 + (i - (n - 1) / 2) * 16, y])), 7) }, 'gray'),
    ...person(80, 86, 'yellow', { h: 26, w: 20, r: 10, accent: true }),
    s('path', { d: star(80, 28, 9) }, 'orange')
  ],
  activamente: [
    s('ellipse', { cx: 80, cy: 138, rx: 22, ry: 4 }, 'gray'),
    s('path', { d: 'M72 90l-12 22M88 90l12 22', ...SW(8) }, 'navy', { stroke: true }),
    s('path', { d: 'M68 58L50 30M92 58l18-28', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 66, y: 50, width: 28, height: 42, rx: 9 }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 34, r: 12 }, 'skin'),
    s('path', { d: 'M40 70H24M120 70h16M44 92H30M116 92h14', ...SW(4) }, 'gray', { stroke: true })
  ],
  agradecimiento: [
    s('path', { d: heart(80, 70, 26) }, 'red', { accent: true }),
    s('path', { d: 'M22 92q8 34 58 38v-14q-36-2-46-28z' }, 'skin'),
    s('path', { d: 'M138 92q-8 34-58 38v-14q36-2 46-28z' }, 'tan'),
    s('path', { d: sparkle(36, 40, 9) + sparkle(126, 36, 9) }, 'yellow')
  ],
  aguante: [
    ground(),
    s('rect', { x: 40, y: 18, width: 64, height: 26, rx: 4 }, 'gray'),
    s('path', { d: 'M60 70V44M84 70V44', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M64 112l-6 24M80 112l6 24', ...SW(8) }, 'navy', { stroke: true }),
    s('rect', { x: 58, y: 70, width: 28, height: 42, rx: 9 }, 'red', { accent: true }),
    s('circle', { cx: 72, cy: 57, r: 11 }, 'skin'),
    s('path', { d: drop(46, 62, 4) + drop(98, 66, 4) }, 'blue'),
    s('path', { d: 'M116 90h26l-13 18 13 18h-26l13-18z' }, 'orange')
  ],
  'artillería': [
    ground(),
    s('rect', { x: 30, y: 70, width: 80, height: 22, rx: 8, transform: 'rotate(-20 70 81)' }, 'dark'),
    s('path', { d: dots([[118, 128], [134, 128], [126, 117]], 7) }, 'dark'),
    s('circle', { cx: 62, cy: 112, r: 22 }, 'brown'),
    s('circle', { cx: 62, cy: 112, r: 7 }, 'dark'),
    s('path', { d: burst(116, 60, 13, 6, 8) }, 'orange', { accent: true }),
    s('path', { d: ells([[126, 42, 14, 11], [140, 30, 8, 8]]) }, 'gray')
  ],
  'asunción': [
    backdrop('navy'),
    s('path', { d: rays(80, 64, 40, 62, 12), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M80 54l-26 66h52z' }, 'sky', { accent: true }),
    s('path', { d: 'M80 54l-20 66h8l12-54 12 54h8z' }, 'blue'),
    s('circle', { cx: 80, cy: 44, r: 12 }, 'skin'),
    s('path', { d: 'M66 28a14 5 0 1 0 28 0a14 5 0 1 0-28 0', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: ells([[50, 124, 22, 12], [80, 128, 26, 13], [112, 124, 22, 12]]) }, 'white')
  ],
  autorizado: [
    s('path', { d: 'M56 14l20 40M104 14l-20 40', ...SW(6) }, 'blue', { stroke: true }),
    s('rect', { x: 44, y: 50, width: 72, height: 90, rx: 8 }, 'white'),
    outline({ x: 44, y: 50, width: 72, height: 90, rx: 8 }),
    s('rect', { x: 70, y: 46, width: 20, height: 10, rx: 3 }, 'gray'),
    s('path', { d: 'M62 104a18 14 0 0 1 36 0z' }, 'blue'),
    s('circle', { cx: 80, cy: 80, r: 11 }, 'skin'),
    s('circle', { cx: 104, cy: 124, r: 12 }, 'green', { accent: true }),
    s('path', { d: 'M98 124l4 5 8-9', ...SW(3) }, 'white', { stroke: true })
  ],
  brillo: [
    s('path', { d: 'M20 112q0-20 16-24l22-4q12 0 22 8l30 8q30 6 30 22v6H20z' }, 'black', { accent: true }),
    s('rect', { x: 18, y: 126, width: 124, height: 8, rx: 3 }, 'dark'),
    s('path', { d: 'M40 96q18-6 32 0M92 106q18 2 32 10', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: sparkle(60, 56, 14) + sparkle(112, 72, 9) + sparkle(32, 66, 7) }, 'yellow')
  ],
  canadiense: [
    s('path', { d: poly([[80, 18], [88, 40], [98, 34], [96, 60], [112, 48], [116, 56], [132, 52], [126, 68], [136, 74], [110, 94], [114, 104], [86, 100], [84, 112], [76, 112], [74, 100], [46, 104], [50, 94], [24, 74], [34, 68], [28, 52], [44, 56], [48, 48], [64, 60], [62, 34], [72, 40]]) }, 'red', { accent: true }),
    s('path', { d: 'M80 100v36', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M80 98V44M80 88L54 70M80 88l26-18', ...SW(2) }, 'white', { stroke: true })
  ],
  centenario: [
    s('path', { d: 'M66 92l-12 46 12-8 8 10 4-46zM94 92l12 46-12-8-8 10-4-46z' }, 'red'),
    s('path', { d: laurel(80, 68, 44) }, 'green'),
    s('circle', { cx: 80, cy: 68, r: 30 }, 'yellow', { accent: true }),
    s('path', { d: ring(80, 68, 24), ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: star(80, 68, 14) }, 'orange')
  ],
  cobarde: [
    ground(),
    s('path', { d: 'M88 136v-28q0-16 20-16t20 16v28z' }, 'yellow', { accent: true }),
    s('circle', { cx: 108, cy: 80, r: 13 }, 'skin'),
    s('path', { d: dots([[103, 78], [113, 78]], 2.5) }, 'dark'),
    s('path', { d: 'M82 90l-8-4M80 104h-8M134 90l8-4M136 104h8', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 128q-10-4-12 6', ...SW(2) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 40, cy: 128, rx: 14, ry: 8 }, 'gray'),
    s('circle', { cx: 48, cy: 120, r: 5 }, 'pink')
  ],
  cobro: [
    s('rect', { x: 34, y: 40, width: 60, height: 98, rx: 10 }, 'dark'),
    s('rect', { x: 42, y: 50, width: 44, height: 26, rx: 3 }, 'mint'),
    s('path', { d: dots([50, 64, 78].flatMap(x => [92, 106, 120].map(y => [x, y])), 4) }, 'gray'),
    s('rect', { x: 92, y: 62, width: 50, height: 32, rx: 4, transform: 'rotate(-15 117 78)' }, 'blue', { accent: true }),
    s('rect', { x: 92, y: 68, width: 50, height: 6, transform: 'rotate(-15 117 78)' }, 'navy'),
    s('path', { d: 'M106 34q8 8 0 16M116 28q14 14 0 28', ...SW(3) }, 'blue', { stroke: true })
  ],
  conformidad: [
    ...person(36, 136, 'blue', { h: 36, w: 24, r: 10 }),
    ...person(80, 136, 'orange'),
    ...person(124, 136, 'purple', { h: 36, w: 24, r: 10 }),
    s('circle', { cx: 80, cy: 36, r: 16 }, 'green', { accent: true }),
    s('path', { d: 'M72 36l6 6 10-12', ...SW(4) }, 'white', { stroke: true })
  ],
  'conversión': [
    s('rect', { x: 18, y: 60, width: 40, height: 40, rx: 4 }, 'blue'),
    s('circle', { cx: 122, cy: 80, r: 22 }, 'orange', { accent: true }),
    s('path', { d: 'M48 46q32-28 64 0M102 36l10 10-13 3M112 114q-32 28-64 0M58 124l-10-10 13-3', ...SW(5) }, 'green', { stroke: true })
  ],
  cristianismo: [
    ground(),
    s('rect', { x: 32, y: 86, width: 96, height: 50 }, 'tan'),
    s('path', { d: 'M28 88l38-18M132 88l-38-18', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 66, y: 44, width: 28, height: 92 }, 'cream'),
    s('path', { d: 'M62 46l18-22 18 22z' }, 'red', { accent: true }),
    s('path', { d: 'M80 10v16M74 16h12', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M72 136v-16a8 8 0 0 1 16 0v16z' }, 'brown'),
    s('circle', { cx: 80, cy: 64, r: 6 }, 'sky')
  ],
  cuadra: [
    backdrop('gray'),
    s('path', { d: rects([[24, 24, 50, 50], [86, 24, 50, 50], [24, 86, 50, 50]]) }, 'tan'),
    s('rect', { x: 86, y: 86, width: 50, height: 50 }, 'orange', { accent: true }),
    s('path', { d: rects([[92, 92, 16, 16], [114, 92, 16, 16], [92, 114, 16, 16], [114, 114, 16, 16]]) }, 'red'),
    s('path', { d: 'M80 18v124M18 80h124', ...DASH(3, '6 6') }, 'white', { stroke: true }),
    s('path', { d: dots([[38, 38], [60, 60], [38, 60], [100, 40], [122, 58], [40, 104], [60, 122]], 7) }, 'green')
  ],
  delegado: [
    s('path', { d: busts([28, 54, 106, 132], 126, 22, 22) }, 'gray'),
    s('path', { d: dots([[28, 96], [54, 96], [106, 96], [132, 96]], 9) }, 'skin'),
    ...person(80, 140, 'navy', { h: 50, w: 34, r: 14, accent: true }),
    s('rect', { x: 84, y: 100, width: 12, height: 14, rx: 2 }, 'white'),
    s('path', { d: 'M74 90l10 10 10-10', ...SW(2) }, 'red', { stroke: true })
  ],
  despido: [
    ground(),
    ...person(66, 136, 'gray'),
    s('path', { d: 'M62 96V80', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: leaflet(62, 82, -130, 14, 5) + leaflet(62, 82, -50, 14, 5) }, 'green'),
    s('rect', { x: 72, y: 82, width: 12, height: 16 }, 'sky'),
    s('rect', { x: 48, y: 94, width: 44, height: 28 }, 'brown', { accent: true }),
    arrow('M106 70h32M128 60l10 10-10 10')
  ],
  'dragón': [
    s('path', { d: 'M42 102q-22 4-26 26', ...SW(10) }, 'green', { stroke: true }),
    s('path', { d: 'M14 126l-2 12 10-6z' }, 'green'),
    s('path', { d: 'M60 110v24M88 110v24', ...SW(10) }, 'green', { stroke: true }),
    s('path', { d: 'M60 82l-12-52 18 12 10-14 12 36z' }, 'orange'),
    s('ellipse', { cx: 72, cy: 96, rx: 32, ry: 20 }, 'green', { accent: true }),
    s('path', { d: 'M92 88q12-24 24-34', ...SW(14) }, 'green', { stroke: true }),
    s('ellipse', { cx: 118, cy: 50, rx: 15, ry: 10 }, 'green'),
    s('circle', { cx: 122, cy: 46, r: 2.5 }, 'dark'),
    s('path', { d: 'M133 54l12-6-3 7 6 4-15 0z' }, 'red')
  ],
  editar: [
    s('rect', { x: 14, y: 40, width: 132, height: 40, rx: 2 }, 'dark'),
    s('path', { d: rects([[22, 50, 24, 20], [52, 50, 24, 20], [84, 50, 24, 20], [114, 50, 24, 20]]) }, 'sky'),
    s('path', { d: 'M80 32v56', ...DASH(3, '4 4') }, 'red', { stroke: true }),
    s('path', { d: 'M66 92l28 32M94 92l-28 32', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: ring(60, 132, 8) + ring(100, 132, 8), ...SW(4) }, 'red', { stroke: true, accent: true })
  ],
  emplear: [
    s('path', { d: 'M14 60h34', ...SW(18) }, 'navy', { stroke: true }),
    s('path', { d: 'M146 60h-34', ...SW(18) }, 'blue', { stroke: true }),
    s('path', { d: 'M44 50q20-8 36-2l26 6q6 8-2 12l-30 10q-20 0-28-10z' }, 'skin', { accent: true }),
    s('path', { d: 'M68 56l10 12M80 54l10 12M92 56l8 10', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M70 102v-8h20v8', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 50, y: 100, width: 60, height: 38, rx: 4 }, 'brown')
  ],
  'exclusión': [
    s('circle', { cx: 62, cy: 84, r: 46 }, 'mint'),
    s('path', { d: ring(62, 84, 46), ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: busts([44, 80], 96, 20, 18) + busts([62], 124, 20, 18) }, 'blue'),
    s('path', { d: dots([[44, 70], [80, 70], [62, 98]], 8) }, 'skin'),
    s('path', { d: busts([134], 130, 20, 20) }, 'gray', { accent: true }),
    s('circle', { cx: 134, cy: 102, r: 8 }, 'skin')
  ],
  franja: [
    s('path', { d: 'M50 30l14-6q16 12 32 0l14 6 24 24-14 14-10-8v66H50V60l-10 8-14-14z' }, 'white'),
    s('rect', { x: 50, y: 64, width: 60, height: 22 }, 'red', { accent: true }),
    s('rect', { x: 50, y: 92, width: 60, height: 7 }, 'blue'),
    s('path', { d: 'M50 30l14-6q16 12 32 0l14 6 24 24-14 14-10-8v66H50V60l-10 8-14-14z', ...SW(3) }, 'gray', { stroke: true })
  ],
  'freír': [
    s('path', { d: 'M110 94h36', ...SW(10) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 64, cy: 94, rx: 52, ry: 26 }, 'dark'),
    s('ellipse', { cx: 64, cy: 92, rx: 44, ry: 20 }, 'gray'),
    s('path', { d: ells([[58, 92, 22, 13], [72, 88, 14, 10]]) }, 'white'),
    s('circle', { cx: 64, cy: 90, r: 8 }, 'yellow', { accent: true }),
    s('path', { d: dots([[40, 50], [98, 46], [70, 38]], 3) }, 'orange'),
    s('path', { d: 'M44 64l-4-8M96 62l4-8M70 56v-8', ...SW(3) }, 'orange', { stroke: true })
  ],
  'físicamente': [
    s('path', { d: 'M24 112h52', ...SW(26) }, 'skin', { stroke: true }),
    s('path', { d: 'M76 112l20-54', ...SW(22) }, 'skin', { stroke: true }),
    s('ellipse', { cx: 58, cy: 98, rx: 22, ry: 16 }, 'skin'),
    s('path', { d: 'M40 92q18-18 38 0', ...SW(3) }, 'tan', { stroke: true }),
    s('circle', { cx: 98, cy: 48, r: 16 }, 'skin'),
    s('rect', { x: 14, y: 94, width: 22, height: 36, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M122 68l14-6M122 84h16M120 100l14 6', ...SW(4) }, 'orange', { stroke: true })
  ],
  higiene: [
    s('path', { d: 'M24 24h48v16', ...SW(10) }, 'gray', { stroke: true }),
    s('path', { d: 'M72 46v22', ...SW(6) }, 'sky', { stroke: true }),
    s('ellipse', { cx: 70, cy: 92, rx: 28, ry: 14, transform: 'rotate(-20 70 92)' }, 'skin'),
    s('ellipse', { cx: 90, cy: 98, rx: 28, ry: 14, transform: 'rotate(20 90 98)' }, 'tan'),
    s('path', { d: ring(36, 80, 9) + ring(126, 70, 7) + ring(118, 120, 10) + ring(46, 124, 6) + ring(132, 98, 5), ...SW(3) }, 'blue', { stroke: true, accent: true }),
    s('rect', { x: 64, y: 128, width: 36, height: 14, rx: 5 }, 'pink')
  ],
  'ilustración': [
    s('path', { d: 'M80 46q-30-12-62-6v88q32-6 62 6zM80 46q30-12 62-6v88q-32-6-62 6z' }, 'white'),
    s('path', { d: 'M80 46q-30-12-62-6v88q32-6 62 6zM80 46q30-12 62-6v88q-32-6-62 6z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 60h38M30 74h38M30 88h30M30 102h38', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 92, y: 54, width: 40, height: 44 }, 'sky'),
    s('path', { d: 'M92 98l14-22 10 12 6-6 10 16z' }, 'green', { accent: true }),
    s('circle', { cx: 122, cy: 66, r: 5 }, 'yellow')
  ],
  'importación': [
    s('path', { d: 'M14 112h132v28H14z' }, 'blue'),
    s('path', { d: 'M24 92h100l-12 20H36z' }, 'red', { accent: true }),
    s('path', { d: rects([[32, 74, 20, 18], [54, 74, 20, 18], [76, 74, 20, 18]]) }, 'orange'),
    s('path', { d: rects([[42, 58, 20, 16], [64, 58, 20, 16]]) }, 'green'),
    s('rect', { x: 102, y: 66, width: 14, height: 26 }, 'gray'),
    arrow('M146 36H104M114 26l-10 10 10 10', 'navy', 5)
  ],
  lejano: [
    s('path', { d: 'M14 90h132v50H14z' }, 'green'),
    s('path', { d: 'M46 90l16-16 10 8 14-14 26 22z' }, 'navy', { accent: true }),
    s('path', { d: 'M56 140l22-50h4l22 50z' }, 'gray'),
    s('path', { d: 'M80 134v-8M80 118v-6M80 104v-4', ...SW(2) }, 'white', { stroke: true }),
    s('circle', { cx: 120, cy: 56, r: 8 }, 'orange'),
    s('path', { d: birds([[40, 46], [56, 38]]), ...SW(3) }, 'dark', { stroke: true })
  ],
  levantamiento: [
    s('path', { d: 'M40 118L46 62M72 118l6-56M108 118l6-56M140 118l4-54', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: dots([[46, 60], [78, 60], [114, 60], [144, 62]], 7) }, 'skin'),
    s('path', { d: busts([30, 98], 140, 26, 26) }, 'blue'),
    s('path', { d: busts([62, 130], 140, 26, 26) }, 'red', { accent: true }),
    s('path', { d: dots([[30, 102], [62, 102], [98, 102], [130, 102]], 10) }, 'skin')
  ],
  'maestría': [
    s('path', { d: 'M50 56v20q30 14 60 0V56l-30 12z' }, 'dark'),
    s('path', { d: 'M80 24l60 22-60 22-60-22z' }, 'black', { accent: true }),
    s('path', { d: 'M136 46v28', ...SW(3) }, 'yellow', { stroke: true }),
    s('rect', { x: 132, y: 72, width: 8, height: 12, rx: 2 }, 'yellow'),
    s('rect', { x: 32, y: 104, width: 96, height: 24, rx: 12 }, 'cream'),
    s('rect', { x: 32, y: 104, width: 96, height: 24, rx: 12, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 104v24', ...SW(6) }, 'red', { stroke: true })
  ],
  mayormente: [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'gray'),
    s('path', { d: wedge(80, 80, 56, -90, 200) }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 22 }, 'white')
  ],
  misil: [
    s('path', { d: 'M40 74l-24 6 24 6z', transform: 'rotate(-35 80 80)' }, 'orange'),
    s('path', { d: 'M46 70l-10-14h18l8 14zM46 90l-10 14h18l8-14z', transform: 'rotate(-35 80 80)' }, 'red'),
    s('rect', { x: 40, y: 70, width: 74, height: 20, rx: 4, transform: 'rotate(-35 80 80)' }, 'gray'),
    s('path', { d: 'M114 70q24 10 0 20z', transform: 'rotate(-35 80 80)' }, 'red', { accent: true }),
    s('rect', { x: 88, y: 70, width: 6, height: 20, transform: 'rotate(-35 80 80)' }, 'dark'),
    s('path', { d: ells([[28, 126, 10, 8], [16, 138, 6, 5]]) }, 'gray')
  ],
  'muñeco': [
    s('path', { d: 'M72 104v28M88 104v28', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M64 74l-18 20M96 74l18 20', ...SW(8) }, 'skin', { stroke: true }),
    s('rect', { x: 62, y: 66, width: 36, height: 42, rx: 8 }, 'blue', { accent: true }),
    s('path', { d: dots([[80, 80], [80, 94]], 3) }, 'white'),
    s('circle', { cx: 80, cy: 46, r: 20 }, 'skin'),
    s('path', { d: 'M58 46q-2-26 22-26t22 26q-6-14-22-14t-22 14z' }, 'orange'),
    s('path', { d: dots([[73, 46], [87, 46]], 3.5) }, 'dark'),
    s('path', { d: 'M72 56q8 6 16 0', ...DASH(2, '2 2') }, 'red', { stroke: true })
  ],
  'máscara': [
    s('path', { d: leaflet(32, 62, -110, 42, 8) + leaflet(38, 60, -80, 36, 7) }, 'pink'),
    s('path', { d: 'M124 96l14 40', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M20 64q30-14 60 2q30-16 60-2q2 30-22 34q-20 2-38-14q-18 16-38 14q-24-4-22-34z' }, 'purple', { accent: true }),
    s('path', { d: ells([[52, 76, 12, 8], [108, 76, 12, 8]]) }, 'white'),
    s('circle', { cx: 80, cy: 68, r: 4 }, 'yellow')
  ],
  parlamentario: [
    s('path', { d: 'M18 120h124', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots(seats(58, 11), 6) }, 'navy', { accent: true }),
    s('path', { d: dots(seats(40, 8), 6) }, 'sky'),
    s('path', { d: dots(seats(24, 5), 5) }, 'blue'),
    s('rect', { x: 68, y: 112, width: 24, height: 26, rx: 2 }, 'brown'),
    s('circle', { cx: 80, cy: 104, r: 7 }, 'skin')
  ],
  potable: [
    s('path', { d: 'M18 30h52v12', ...SW(12) }, 'gray', { stroke: true }),
    s('rect', { x: 36, y: 14, width: 18, height: 8, rx: 3 }, 'gray'),
    s('path', { d: 'M70 50v42', ...SW(6) }, 'sky', { stroke: true }),
    s('path', { d: 'M51 94h38l-5 42H56z' }, 'blue', { accent: true }),
    s('path', { d: 'M48 76h44l-6 62H54z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M106 76l10 10 22-26', ...SW(7) }, 'green', { stroke: true })
  ],
  'prestación': [
    s('path', { d: 'M30 22l-4 10M60 16l-4 10M102 16l-4 10M132 22l-4 10', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M24 70a56 40 0 0 1 112 0q-14-8-28 0q-14-8-28 0q-14-8-28 0q-14-8-28 0z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 30v-6', ...SW(4) }, 'dark', { stroke: true }),
    ...person(80, 138, 'orange'),
    s('path', { d: dots([[40, 120], [122, 116]], 9) }, 'yellow'),
    s('path', { d: ring(40, 120, 9) + ring(122, 116, 9), ...SW(2) }, 'orange', { stroke: true })
  ],
  racional: [
    s('path', { d: 'M58 136v-24q-22-16-20-44q4-40 46-42q38 2 40 40l10 18-10 4q2 16-20 18v30z' }, 'sky'),
    ...gear(80, 64, 14, 8, 'navy'),
    s('circle', { cx: 80, cy: 64, r: 14 }, 'navy', { accent: true }),
    s('circle', { cx: 80, cy: 64, r: 5 }, 'sky')
  ],
  rescatar: [
    s('path', { d: 'M30 18h80M70 18v8M138 30v20', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M98 40h40', ...SW(6) }, 'red', { stroke: true }),
    s('ellipse', { cx: 70, cy: 42, rx: 30, ry: 18 }, 'red', { accent: true }),
    s('ellipse', { cx: 56, cy: 40, rx: 12, ry: 9 }, 'sky'),
    s('path', { d: 'M48 66h44M56 60v6M84 60v6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M76 66v40', ...SW(3) }, 'brown', { stroke: true }),
    s('rect', { x: 70, y: 118, width: 18, height: 24, rx: 6 }, 'orange'),
    s('path', { d: 'M72 120l4-14M86 120l-10-14', ...SW(4) }, 'skin', { stroke: true }),
    s('circle', { cx: 79, cy: 112, r: 8 }, 'skin')
  ],
  'revelación': [
    s('rect', { x: 14, y: 14, width: 132, height: 126 }, 'dark'),
    s('path', { d: rays(80, 80, 34, 46, 8), ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: star(80, 80, 28) }, 'yellow', { accent: true }),
    s('path', { d: 'M14 14h132v12H14zM14 14h40q-12 60 6 126H14zM146 14h-40q12 60-6 126h46z' }, 'red')
  ],
  segmento: [
    s('circle', { cx: 66, cy: 84, r: 46 }, 'orange'),
    s('circle', { cx: 66, cy: 84, r: 40 }, 'cream'),
    s('path', { d: [1, 2, 3, 4, 5, 6, 7].map(i => wedge(66, 84, 36, i * 45 - 20, i * 45 + 20)).join('') }, 'orange'),
    s('path', { d: wedge(96, 84, 38, -20, 20) }, 'orange', { accent: true }),
    s('path', { d: wedge(96, 84, 38, -20, 20), ...SW(2) }, 'red', { stroke: true })
  ],
  sencillamente: [
    s('path', { d: 'M30 136h100', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 90V44', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 72, -30, 24, 7) }, 'green'),
    s('path', { d: 'M66 88h28l-4 48H70z' }, 'sky', { accent: true }),
    s('circle', { cx: 80, cy: 38, r: 11 }, 'pink'),
    s('circle', { cx: 80, cy: 38, r: 4 }, 'yellow')
  ],
  singular: [
    s('path', { d: 'M80 104q-10 16 4 36', ...SW(2) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 80, cy: 60, rx: 30, ry: 36 }, 'red', { accent: true }),
    s('path', { d: 'M76 95h8l-4 9z' }, 'red'),
    s('ellipse', { cx: 68, cy: 46, rx: 6, ry: 11 }, 'pink')
  ],
  tradicionalmente: [
    s('path', { d: 'M80 24l-20-12M80 24l20-12', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 22, y: 24, width: 116, height: 112, rx: 6 }, 'brown', { accent: true }),
    s('rect', { x: 34, y: 36, width: 92, height: 88 }, 'cream'),
    s('path', { d: busts([62, 98], 124, 30, 30) }, 'tan'),
    s('path', { d: dots([[62, 80], [98, 80]], 13) }, 'skin'),
    s('path', { d: 'M50 76a12 12 0 0 1 24 0M86 76a12 12 0 0 1 24 0', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 98, cy: 62, r: 6 }, 'gray')
  ],
  turco: [
    s('path', { d: 'M60 58q-6-10 0-18t0-18', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M76 76l44-22', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M46 66h32l-4 12q16 20 10 52H40q-6-32 10-52z' }, 'orange', { accent: true }),
    s('path', { d: 'M46 66l-8-6', ...SW(5) }, 'orange', { stroke: true }),
    s('ellipse', { cx: 117, cy: 134, rx: 22, ry: 4 }, 'gray'),
    s('path', { d: 'M100 108h34l-5 26h-24z' }, 'red'),
    s('path', { d: 'M104 116h26', ...SW(3) }, 'yellow', { stroke: true })
  ],
  vaticano: [
    ground(),
    s('rect', { x: 24, y: 96, width: 112, height: 40 }, 'tan'),
    s('path', { d: 'M36 100v36M52 100v36M68 100v36M92 100v36M108 100v36M124 100v36', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 52, y: 76, width: 56, height: 20 }, 'tan'),
    s('path', { d: 'M50 78a30 34 0 0 1 60 0z' }, 'sky', { accent: true }),
    s('rect', { x: 76, y: 36, width: 8, height: 10 }, 'tan'),
    s('path', { d: 'M80 16v20M74 22h12', ...SW(3) }, 'dark', { stroke: true })
  ],
  veneno: [
    s('rect', { x: 66, y: 18, width: 28, height: 14, rx: 3 }, 'brown'),
    s('path', { d: 'M64 30h32v20l14 16v66H50V66l14-16z' }, 'purple', { accent: true }),
    s('circle', { cx: 80, cy: 90, r: 14 }, 'white'),
    s('rect', { x: 73, y: 98, width: 14, height: 12, rx: 2 }, 'white'),
    s('path', { d: dots([[75, 89], [85, 89]], 3.5) }, 'dark'),
    s('path', { d: 'M76 104v6M80 104v6M84 104v6', ...SW(1.5) }, 'dark', { stroke: true }),
    s('path', { d: drop(124, 112, 5) + drop(132, 128, 4) }, 'green')
  ],
  aceptable: [
    s('circle', { cx: 32, cy: 72, r: 18 }, 'red'),
    s('circle', { cx: 128, cy: 72, r: 18 }, 'green'),
    s('circle', { cx: 80, cy: 72, r: 22 }, 'yellow', { accent: true }),
    s('path', { d: ring(80, 72, 29), ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: dots([[26, 66], [38, 66], [73, 65], [87, 65], [122, 66], [134, 66]], 2.5) }, 'dark'),
    s('path', { d: 'M24 82q8-6 16 0M70 82h20M120 78q8 6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M68 122l8 8 16-18', ...SW(6) }, 'green', { stroke: true })
  ],
  'admiración': [
    s('circle', { cx: 80, cy: 84, r: 52 }, 'yellow', { accent: true }),
    s('path', { d: star(60, 74, 13) + star(100, 74, 13) }, 'orange'),
    s('ellipse', { cx: 80, cy: 110, rx: 10, ry: 12 }, 'dark'),
    s('path', { d: sparkle(138, 26, 10) + sparkle(22, 30, 8) }, 'orange')
  ],
  afueras: [
    s('path', { d: rects([[34, 44, 16, 50], [52, 30, 18, 64], [72, 50, 14, 44], [88, 36, 16, 58], [106, 52, 14, 42]]) }, 'gray'),
    s('path', { d: 'M14 94q66-14 132 0v46H14z' }, 'green'),
    s('path', { d: 'M60 140q10-24 20-46', ...SW(6) }, 'cream', { stroke: true }),
    s('path', { d: rects([[28, 110, 22, 18], [102, 106, 24, 20]]) }, 'tan'),
    s('path', { d: 'M24 112l15-12 15 12zM98 108l16-12 16 12z' }, 'red', { accent: true }),
    s('path', { d: dots([[72, 112], [136, 124], [16, 124]], 8) }, 'mint')
  ],
  'almacén': [
    ground(),
    s('rect', { x: 22, y: 60, width: 116, height: 76 }, 'gray'),
    s('path', { d: 'M14 64l66-40 66 40z' }, 'red'),
    s('rect', { x: 38, y: 76, width: 84, height: 60 }, 'dark'),
    s('path', { d: rects([[44, 112, 24, 24], [70, 112, 24, 24], [96, 112, 22, 24], [56, 88, 24, 24], [84, 90, 22, 22]]) }, 'tan', { accent: true }),
    s('path', { d: 'M44 124h24M70 124h24M96 124h22M56 100h24M84 101h22', ...SW(2) }, 'brown', { stroke: true })
  ],
  arrancar: [
    s('path', { d: 'M14 116h132v24H14z' }, 'brown'),
    s('ellipse', { cx: 80, cy: 118, rx: 16, ry: 5 }, 'dark'),
    s('path', { d: 'M80 88l-6 14M80 88l6 16M80 88v20M74 102l-8 6', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M80 44v44', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 72, -150, 24, 8) + leaflet(80, 72, -30, 24, 8) }, 'green'),
    s('path', { d: 'M88 30l34-14', ...SW(12) }, 'blue', { stroke: true }),
    s('circle', { cx: 82, cy: 36, r: 11 }, 'skin'),
    s('path', { d: 'M126 104V58M116 68l10-10 10 10', ...SW(5) }, 'orange', { stroke: true, accent: true })
  ],
  arrestado: [
    s('path', { d: ring(72, 60, 7) + ring(88, 60, 7), ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ring(50, 96, 26), ...SW(10) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: ring(110, 96, 26), ...SW(10) }, 'gray', { stroke: true }),
    s('path', { d: rects([[50, 64, 16, 10], [94, 64, 16, 10]]) }, 'dark')
  ],
  auxilio: [
    s('path', { d: 'M62 52V38h36v14', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 24, y: 50, width: 112, height: 84, rx: 10 }, 'red', { accent: true }),
    s('path', { d: 'M80 72v40M60 92h40', ...SW(12, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('path', { d: 'M24 62h112', ...SW(3) }, 'pink', { stroke: true })
  ],
  cabildo: [
    backdrop('sky'),
    s('rect', { x: 66, y: 44, width: 28, height: 36 }, 'white'),
    s('path', { d: 'M62 46l18-16 18 16z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 60, r: 5 }, 'yellow'),
    s('rect', { x: 20, y: 80, width: 120, height: 66 }, 'white'),
    s('rect', { x: 18, y: 76, width: 124, height: 8 }, 'red'),
    s('path', { d: [32, 56, 80, 104, 128].map(x => `M${x - 8} 146v-22a8 8 0 0 1 16 0v22z`).join('') + rects([[26, 92, 12, 14], [50, 92, 12, 14], [74, 92, 12, 14], [98, 92, 12, 14], [122, 92, 12, 14]]) }, 'brown')
  ],
  casino: [
    s('rect', { x: 22, y: 50, width: 54, height: 54, rx: 8 }, 'white'),
    outline({ x: 22, y: 50, width: 54, height: 54, rx: 8 }),
    s('path', { d: dots([[36, 64], [62, 64], [49, 77], [36, 90], [62, 90]], 5) }, 'dark'),
    s('rect', { x: 84, y: 62, width: 48, height: 48, rx: 8, transform: 'rotate(15 108 86)' }, 'red', { accent: true }),
    s('path', { d: dots([[96, 74], [120, 98], [108, 86]], 5), transform: 'rotate(15 108 86)' }, 'white'),
    s('path', { d: ells([[56, 132, 24, 7], [56, 124, 24, 7]]) }, 'green'),
    s('path', { d: 'M44 124h6M62 124h6', ...SW(3) }, 'white', { stroke: true })
  ],
  checo: [
    s('path', { d: 'M14 116h132v24H14z' }, 'blue'),
    s('path', { d: 'M14 82h132v34h-12a14 14 0 0 0-28 0h-12a14 14 0 0 0-28 0h-12a14 14 0 0 0-28 0h-12z' }, 'tan', { accent: true }),
    s('path', { d: 'M70 82V66M110 82V66M130 82V66', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 18, y: 36, width: 30, height: 46 }, 'dark'),
    s('path', { d: 'M14 38l19-24 19 24z' }, 'black'),
    s('path', { d: rects([[24, 48, 6, 10], [36, 48, 6, 10]]) }, 'yellow')
  ],
  colorado: [
    s('circle', { cx: 80, cy: 80, r: 52 }, 'skin'),
    s('path', { d: ells([[52, 94, 14, 9], [108, 94, 14, 9]]) }, 'red', { accent: true }),
    s('path', { d: 'M56 72q8-6 16 0M88 72q8-6 16 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M72 106q8 6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M118 22l-4 12M132 32l-8 8M30 26l4 10', ...SW(3) }, 'red', { stroke: true })
  ],
  comprometido: [
    s('path', { d: 'M34 88l8-48h76l8 48z' }, 'red'),
    s('path', { d: 'M44 84l6-38h60l6 38z' }, 'pink'),
    s('rect', { x: 30, y: 88, width: 100, height: 44, rx: 6 }, 'red'),
    s('ellipse', { cx: 80, cy: 92, rx: 36, ry: 8 }, 'pink'),
    s('path', { d: ring(80, 84, 14), ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M72 66l8-10 8 10-8 8z' }, 'sky', { accent: true }),
    s('path', { d: sparkle(102, 54, 8) }, 'white')
  ],
  perseguir: [
    ground(),
    s('path', { d: 'M14 70h18M18 86h16M14 102h14', ...SW(4) }, 'gray', { stroke: true }),
    ...lean(52, 136, 22, 'blue', { accent: true }),
    ...lean(118, 136, 22, 'red'),
    s('path', { d: 'M78 76l14-6', ...SW(6) }, 'skin', { stroke: true })
  ],
  'confederación': [
    s('path', { d: 'M80 80L36 40M80 80l44-40M80 80l-44 44M80 80l44 44', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 36, cy: 40, r: 16 }, 'red'),
    s('circle', { cx: 124, cy: 40, r: 16 }, 'green'),
    s('circle', { cx: 36, cy: 124, r: 16 }, 'orange'),
    s('circle', { cx: 124, cy: 124, r: 16 }, 'purple'),
    s('circle', { cx: 80, cy: 80, r: 24 }, 'blue', { accent: true }),
    s('path', { d: star(80, 80, 13) }, 'yellow')
  ],
  consuelo: [
    ground(),
    ...person(54, 136, 'green'),
    ...person(106, 136, 'sky'),
    s('path', { d: 'M66 102q20-20 30-6', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: drop(112, 84, 4) }, 'blue'),
    s('path', { d: heart(80, 44, 12) }, 'pink', { accent: true })
  ],
  cordero: [
    backdrop('mint'),
    s('path', { d: 'M54 106v24M68 108v22M96 108v22M110 106v24', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[54, 86], [70, 78], [88, 78], [104, 86], [62, 100], [82, 102], [100, 98]], 16) }, 'white', { accent: true }),
    s('ellipse', { cx: 120, cy: 70, rx: 14, ry: 12 }, 'dark'),
    s('path', { d: 'M110 64l-8-4', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M118 82q-10 10-24 8', ...SW(4) }, 'red', { stroke: true }),
    s('circle', { cx: 124, cy: 68, r: 2.5 }, 'white')
  ],
  curar: [
    s('path', { d: heart(80, 74, 40) }, 'pink'),
    s('rect', { x: 30, y: 60, width: 100, height: 34, rx: 17, transform: 'rotate(-35 80 77)' }, 'tan', { accent: true }),
    s('rect', { x: 64, y: 64, width: 32, height: 26, rx: 4, transform: 'rotate(-35 80 77)' }, 'cream'),
    s('path', { d: dots([[72, 72], [80, 78], [88, 72], [76, 84], [86, 82]], 2) }, 'tan'),
    s('path', { d: sparkle(130, 30, 10) + sparkle(28, 120, 8) }, 'yellow')
  ],
  desafortunadamente: [
    ground(),
    s('path', { d: 'M44 136q-10-14 14-20q30-6 50 4q14 10 0 16z' }, 'pink', { accent: true }),
    s('path', { d: 'M96 58l18 6-30 52z' }, 'tan'),
    s('path', { d: 'M100 70l10 4M94 82l10 4', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: drop(64, 108, 4) }, 'sky'),
    s('path', { d: ells([[56, 44, 16, 11], [76, 38, 18, 13], [94, 46, 14, 10]]) }, 'gray'),
    s('path', { d: 'M54 64l-3 8M74 62l-3 8M94 64l-3 8', ...SW(3) }, 'blue', { stroke: true })
  ],
  encargar: [
    ground(),
    ...person(34, 136, 'blue'),
    ...person(126, 136, 'orange'),
    s('path', { d: 'M48 100h20M112 100H92', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 62, y: 82, width: 36, height: 30, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: 'M80 82v30', ...SW(4) }, 'tan', { stroke: true }),
    arrow('M60 52h40M90 42l10 10-10 10')
  ],
  enviado: [
    ground(),
    ...person(58, 136, 'navy', { accent: true }),
    s('path', { d: 'M48 100l-10 4', ...SW(3) }, 'red', { stroke: true }),
    s('rect', { x: 66, y: 108, width: 28, height: 22, rx: 3 }, 'brown'),
    s('path', { d: 'M74 108v-6h12v6', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M104 44l40-14-12 30-8-10z' }, 'sky'),
    s('path', { d: 'M104 44l40-14-16 20', ...SW(2) }, 'blue', { stroke: true })
  ],
  fachada: [
    ground(),
    s('rect', { x: 30, y: 24, width: 100, height: 112 }, 'cream'),
    s('path', { d: 'M24 24h112v10H24z' }, 'brown'),
    s('path', { d: rects([[42, 44, 18, 24], [71, 44, 18, 24], [100, 44, 18, 24], [42, 80, 18, 24], [100, 80, 18, 24]]) }, 'sky'),
    s('path', { d: 'M38 72h26M67 72h26M96 72h26M38 108h26M96 108h26', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M68 136v-30a12 12 0 0 1 24 0v30z' }, 'red', { accent: true }),
    s('rect', { x: 30, y: 24, width: 100, height: 112, ...SW(3) }, 'tan', { stroke: true })
  ],
  fianza: [
    s('path', { d: ells([[100, 128, 26, 8], [100, 118, 26, 8], [100, 108, 26, 8]]) }, 'yellow'),
    s('path', { d: ells([[100, 128, 26, 8], [100, 118, 26, 8], [100, 108, 26, 8]]), ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: ring(46, 54, 18), ...SW(10) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M59 67l36 36M80 88l8-8M88 96l8-8', ...SW(9) }, 'orange', { stroke: true }),
    s('path', { d: 'M24 98l14 26 22-10-4-24z' }, 'red'),
    s('path', { d: 'M36 92l-4-14h12z' }, 'red')
  ],
  frenar: [
    ground(),
    s('path', { d: 'M14 124h40M18 132h36', ...SW(4) }, 'dark', { stroke: true }),
    ...car(56, 102, 'blue'),
    s('circle', { cx: 130, cy: 52, r: 14 }, 'red', { accent: true }),
    s('rect', { x: 118, y: 30, width: 24, height: 44, rx: 6, ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 96l-8-6M44 110h-10', ...SW(3) }, 'orange', { stroke: true })
  ],
  ingrediente: [
    s('rect', { x: 18, y: 120, width: 124, height: 16, rx: 6 }, 'brown'),
    s('circle', { cx: 44, cy: 98, r: 22 }, 'red', { accent: true }),
    s('path', { d: star(44, 78, 7) }, 'green'),
    s('path', { d: 'M86 120l-14-50 18 6z' }, 'orange'),
    s('path', { d: 'M78 68l-6-14M80 70l6-14', ...SW(4) }, 'green', { stroke: true }),
    s('ellipse', { cx: 120, cy: 104, rx: 16, ry: 18 }, 'cream'),
    s('ellipse', { cx: 120, cy: 104, rx: 16, ry: 18, ...SW(2) }, 'tan', { stroke: true })
  ],
  'legítimo': [
    s('path', { d: 'M64 96l-12 44 14-8 8 10 4-44zM96 96l12 44-14-8-8 10-4-44z' }, 'blue'),
    s('path', { d: burst(80, 70, 50, 42, 18) }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 70, r: 34 }, 'white'),
    s('path', { d: 'M64 70l12 12 22-24', ...SW(8) }, 'green', { stroke: true })
  ],
  leve: [
    s('path', { d: 'M40 132Q70 100 124 26', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M54 116q-10-40 30-70q24-18 40-20q-4 30-26 56q-20 24-44 34z' }, 'sky', { accent: true }),
    s('path', { d: 'M66 96l-14-6M76 82l-16-8M88 68l-16-10M80 92l14 2M92 76l14 2', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M120 112q8-6 16 0M22 60q8-6 16 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  'magnífico': [
    backdrop('navy'),
    s('path', { d: rays(56, 56, 10, 34, 12), ...SW(4) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: rays(112, 76, 8, 26, 10), ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: rays(70, 110, 6, 20, 8), ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: dots([[56, 56], [112, 76], [70, 110]], 5) }, 'white'),
    s('path', { d: sparkle(124, 32, 8) + sparkle(30, 120, 6) }, 'white')
  ],
  marchar: [
    ground(),
    s('circle', { cx: 80, cy: 30, r: 13 }, 'skin'),
    s('path', { d: 'M70 22h20l-2-16h-16z' }, 'red'),
    s('path', { d: 'M74 92l-18 40M86 92l10 20-12 20', ...SW(9) }, 'navy', { stroke: true }),
    s('path', { d: 'M68 54l-12 22M92 54l16 18', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 64, y: 44, width: 32, height: 50, rx: 10 }, 'red', { accent: true }),
    s('path', { d: 'M66 54l28 30', ...SW(4) }, 'white', { stroke: true }),
    arrow('M112 120h28M132 112l8 8-8 8')
  ],
  marino: [
    s('path', { d: 'M14 124q11-8 22 0t22 0 22 0 22 0 22 0 22 0V146H14z' }, 'blue'),
    s('path', { d: ring(80, 32, 10), ...SW(6) }, 'navy', { stroke: true }),
    s('path', { d: 'M80 42v74M60 58h40', ...SW(8) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M40 86q4 30 40 30t40-30', ...SW(8) }, 'navy', { stroke: true }),
    s('path', { d: 'M32 92l8-10 8 10M112 92l8-10 8 10', ...SW(6) }, 'navy', { stroke: true })
  ],
  molestia: [
    s('circle', { cx: 70, cy: 86, r: 50 }, 'skin'),
    s('path', { d: 'M44 66l18 6M96 66l-18 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[56, 80], [84, 80]], 4) }, 'dark'),
    s('path', { d: 'M54 112q16-10 32 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 40q20-20 30 0t10 30', ...DASH(2, '3 4') }, 'gray', { stroke: true }),
    s('path', { d: ells([[134, 72, 8, 5]]) }, 'dark', { accent: true }),
    s('path', { d: ells([[130, 64, 6, 4], [140, 64, 6, 4]]) }, 'sky')
  ]
};
