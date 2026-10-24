// Illustration specs for common words still undrawn in batches 0023, 0024 and 0025 (see server/scripts/lexicon/art.js)
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
  denominar: [
    backdrop('mint'),
    ...person(80, 146, 'blue', { w: 56, h: 70, r: 22 }),
    s('rect', { x: 60, y: 92, width: 40, height: 28, rx: 3 }, 'white'),
    s('rect', { x: 60, y: 92, width: 40, height: 10, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M67 112h26', ...SW(3) }, 'dark', { stroke: true }),
    outline({ x: 60, y: 92, width: 40, height: 28, rx: 3 })
  ],
  'auténtico': [
    s('path', { d: 'M62 96l-14 44 18-8 8 14 10-42zM98 96l14 44-18-8-8 14-10-42z' }, 'red'),
    s('path', { d: burst(80, 70, 52, 44, 16) }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 70, r: 36 }, 'orange'),
    s('path', { d: 'M62 70l12 13 24-26', ...SW(9) }, 'white', { stroke: true })
  ],
  baby: [
    s('path', { d: 'M44 62a36 36 0 0 1 72 0v38q0 40-36 44q-36-4-36-44z' }, 'sky', { accent: true }),
    s('circle', { cx: 80, cy: 64, r: 26 }, 'skin'),
    s('path', { d: 'M74 40q2-10 12-6', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M66 62q5 5 10 0M84 62q5 5 10 0', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 7 }, 'pink'),
    s('path', { d: 'M48 104q32 16 64-6', ...SW(4) }, 'white', { stroke: true })
  ],
  brindar: [
    ...glass(58, 14, true),
    ...glass(102, -14, false),
    s('path', { d: sparkle(80, 20, 10) }, 'yellow'),
    s('path', { d: 'M64 20l-8-6M96 20l8-6', ...SW(3) }, 'orange', { stroke: true })
  ],
  capilla: [
    ground(),
    s('rect', { x: 70, y: 34, width: 20, height: 30 }, 'cream'),
    s('path', { d: 'M66 36l14-12 14 12z' }, 'red'),
    s('path', { d: 'M80 12v12M74 17h12', ...SW(3) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 46, r: 5 }, 'yellow'),
    s('rect', { x: 40, y: 84, width: 80, height: 52 }, 'tan'),
    s('path', { d: 'M32 88l48-34 48 34z' }, 'red', { accent: true }),
    s('path', { d: 'M70 136v-22a10 10 0 0 1 20 0v22z' }, 'brown'),
    s('circle', { cx: 80, cy: 74, r: 7 }, 'sky')
  ],
  chat: [
    s('rect', { x: 44, y: 14, width: 72, height: 132, rx: 12 }, 'dark'),
    s('rect', { x: 50, y: 28, width: 60, height: 104, rx: 4 }, 'cream'),
    s('path', { d: bubble(54, 36, 44, 28) }, 'sky'),
    s('path', { d: bubble(62, 82, 44, 28), transform: 'translate(168 0) scale(-1 1)' }, 'green', { accent: true }),
    s('path', { d: dots([[66, 50], [76, 50], [86, 50]], 3) }, 'dark'),
    s('path', { d: dots([[74, 96], [84, 96], [94, 96]], 3) }, 'white')
  ],
  comparar: [
    s('circle', { cx: 44, cy: 104, r: 24 }, 'red'),
    s('path', { d: 'M44 80q2-10 8-12', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M116 70q10 0 10 16q14 10 14 26a24 24 0 0 1-48 0q0-16 14-26q0-16 10-16z' }, 'yellow'),
    s('path', { d: 'M69 104h22M74 98l-6 6 6 6M86 98l6 6-6 6', ...SW(4) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: ring(80, 36, 16), ...SW(5) }, 'navy', { stroke: true }),
    s('path', { d: 'M91 47l12 12', ...SW(7) }, 'brown', { stroke: true })
  ],
  condado: [
    s('path', { d: 'M24 46l30-20 40 8 36-10 12 34-10 30 8 32-34 18-44-6-30 12-14-40 10-26z' }, 'mint'),
    s('path', { d: 'M62 56l34 4 10 32-26 18-28-14z' }, 'orange', { accent: true }),
    s('path', { d: 'M54 26l8 30-28 26M96 60l34-36M106 92l36 4M80 110l2 34', ...DASH(3, '5 5') }, 'green', { stroke: true }),
    s('path', { d: 'M24 46l30-20 40 8 36-10 12 34-10 30 8 32-34 18-44-6-30 12-14-40 10-26z', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M72 92V80l9-8 9 8v12z' }, 'brown')
  ],
  constituyente: [
    ground(),
    s('path', { d: rects([[32, 104, 31, 32]]) }, 'blue'),
    s('path', { d: rects([[65, 104, 30, 32]]) }, 'yellow'),
    s('path', { d: rects([[97, 104, 31, 32]]) }, 'green'),
    s('path', { d: rects([[48, 70, 31, 32]]) }, 'red'),
    s('path', { d: rects([[81, 70, 31, 32]]) }, 'orange', { accent: true }),
    s('path', { d: 'M48 68l32-34 32 34z' }, 'purple')
  ],
  cruce: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'green'),
    s('path', { d: rects([[60, 14, 40, 132], [14, 60, 132, 40]]) }, 'gray'),
    s('path', { d: 'M80 18v36M80 106v36M18 80h36M106 80h36', ...DASH(3, '6 6') }, 'white', { stroke: true }),
    s('rect', { x: 84, y: 110, width: 12, height: 20, rx: 3 }, 'red', { accent: true }),
    s('rect', { x: 110, y: 64, width: 20, height: 12, rx: 3 }, 'blue')
  ],
  determinado: [
    s('path', { d: dots([[24, 100], [52, 100], [80, 100], [136, 100]], 11) }, 'gray'),
    s('circle', { cx: 108, cy: 100, r: 12 }, 'red', { accent: true }),
    s('path', { d: ring(108, 100, 20), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M108 26v42M97 58l11 12 11-12', ...SW(6) }, 'navy', { stroke: true })
  ],
  disparo: [
    s('path', { d: burst(50, 80, 36, 16, 12) }, 'orange', { accent: true }),
    s('path', { d: burst(50, 80, 20, 10, 10) }, 'yellow'),
    s('path', { d: 'M100 72h24a8 8 0 0 1 0 16h-24z' }, 'dark'),
    s('path', { d: 'M84 70h10M80 80h14M84 90h10', ...SW(3) }, 'gray', { stroke: true })
  ],
  dorado: [
    ground(),
    s('path', { d: 'M28 132l8-24h36l8 24zM80 132l8-24h36l8 24zM54 106l8-24h36l8 24z' }, 'yellow', { accent: true }),
    s('path', { d: 'M38 112h32M90 112h32M64 86h32', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: sparkle(38, 60, 12) + sparkle(124, 56, 10) + sparkle(82, 40, 8) }, 'orange')
  ],
  esclavitud: [
    s('path', { d: 'M40 146L64 88M120 146L96 88', ...SW(20) }, 'skin', { stroke: true }),
    s('path', { d: dots([[64, 80], [96, 80]], 13) }, 'skin'),
    s('rect', { x: 46, y: 96, width: 28, height: 16, rx: 3, transform: 'rotate(22 60 104)' }, 'dark', { accent: true }),
    s('rect', { x: 86, y: 96, width: 28, height: 16, rx: 3, transform: 'rotate(-22 100 104)' }, 'dark', { accent: true }),
    s('path', { d: ells([[74, 116, 6, 4], [80, 120, 6, 4], [86, 116, 6, 4]]), ...SW(3) }, 'gray', { stroke: true })
  ],
  eta: [
    backdrop('sky'),
    s('path', { d: 'M20 54l60-30 60 30z' }, 'tan', { accent: true }),
    s('rect', { x: 24, y: 54, width: 112, height: 10 }, 'tan'),
    s('path', { d: rects([[28, 64, 8, 60], [44, 64, 8, 60], [60, 64, 8, 60], [76, 64, 8, 60], [92, 64, 8, 60], [108, 64, 8, 60], [124, 64, 8, 60]]) }, 'white'),
    s('rect', { x: 20, y: 124, width: 120, height: 10 }, 'tan')
  ],
  experimento: [
    s('path', { d: 'M52 96h56l16 28q4 8-6 8H42q-10 0-6-8z' }, 'green', { accent: true }),
    s('path', { d: dots([[70, 112], [90, 108], [82, 122]], 4) }, 'white'),
    s('path', { d: dots([[80, 80], [86, 66], [78, 50]], 4) }, 'green'),
    s('path', { d: 'M66 20h28M72 20v38L38 122q-6 14 10 14h64q16 0 10-14L88 58V20', ...SW(5) }, 'gray', { stroke: true })
  ],
  factura: [
    s('path', { d: 'M36 14h80v124l-10-8-10 8-10-8-10 8-10-8-10 8-10-8-10 8z' }, 'white'),
    s('path', { d: 'M36 14h80v124l-10-8-10 8-10-8-10 8-10-8-10 8-10-8-10 8z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 34h56M48 50h40M48 66h48M48 82h36', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 102h56', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 80, y: 108, width: 24, height: 8, rx: 2 }, 'red', { accent: true }),
    s('circle', { cx: 122, cy: 122, r: 16 }, 'yellow'),
    s('path', { d: ring(122, 122, 10), ...SW(3) }, 'orange', { stroke: true })
  ],
  globo: [
    s('path', { d: 'M80 110q-6 14 4 22t-4 14', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 106c-24-4-38-24-38-48a38 38 0 0 1 76 0c0 24-14 44-38 48z' }, 'red', { accent: true }),
    s('path', { d: 'M74 113l6-8 6 8z' }, 'red'),
    s('ellipse', { cx: 64, cy: 46, rx: 7, ry: 12, transform: 'rotate(20 64 46)' }, 'white', { flatOnly: true })
  ],
  homicidio: [
    backdrop('dark'),
    s('path', { d: ring(56, 42, 10) + 'M58 52l8 30M63 64l-22 6M63 62l24-6M66 82l-14 30M66 82l22 26', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M14 116L146 74', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M14 116L146 74', ...SW(14, { 'stroke-linecap': 'butt', 'stroke-dasharray': '8 12' }) }, 'black', { stroke: true })
  ],
  incapaz: [
    ground(),
    ...person(80, 136, 'blue', { h: 40 }),
    s('path', { d: 'M68 104l-6 16M92 104l6 16', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M74 88q6-4 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 120h104', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: rects([[24, 98, 14, 38], [122, 98, 14, 38]]) }, 'dark', { accent: true }),
    s('path', { d: drop(56, 62, 4) + drop(106, 58, 4) }, 'sky')
  ],
  ingle: [
    s('path', { d: 'M57 76l-4 58M103 76l4 58', ...SW(24) }, 'skin', { stroke: true }),
    s('path', { d: 'M44 24h72l6 54H86l-6-20-6 20H38z' }, 'blue'),
    s('path', { d: ells([[50, 140, 15, 6], [110, 140, 15, 6]]) }, 'dark'),
    s('path', { d: burst(78, 82, 15, 6, 8) }, 'red', { accent: true })
  ],
  instalar: [
    s('rect', { x: 22, y: 22, width: 116, height: 80, rx: 6 }, 'dark'),
    s('rect', { x: 28, y: 28, width: 104, height: 68, rx: 2 }, 'sky'),
    s('path', { d: 'M70 102h20l4 20h16v8H50v-8h16z' }, 'gray'),
    s('path', { d: 'M80 36v26M68 52l12 12 12-12', ...SW(6) }, 'navy', { stroke: true }),
    s('rect', { x: 42, y: 74, width: 76, height: 10, rx: 5 }, 'white'),
    s('rect', { x: 42, y: 74, width: 46, height: 10, rx: 5 }, 'green', { accent: true })
  ],
  integrar: [
    s('path', { d: rects([[28, 28, 44, 44]]) + dots([[72, 50], [50, 72]], 7) }, 'blue'),
    s('path', { d: rects([[72, 28, 44, 44]]) + dots([[94, 72]], 7) }, 'green'),
    s('path', { d: rects([[28, 72, 44, 44]]) + dots([[72, 94]], 7) }, 'yellow'),
    s('rect', { x: 72, y: 72, width: 44, height: 44, ...DASH(3, '5 5') }, 'gray', { stroke: true }),
    s('path', { d: rects([[98, 98, 44, 44]]) }, 'orange', { accent: true }),
    s('path', { d: 'M96 112l-10-10M86 110v-8h8', ...SW(3) }, 'dark', { stroke: true })
  ],
  'interacción': [
    ...person(40, 136, 'blue'),
    ...person(120, 136, 'orange', { accent: true }),
    s('path', { d: 'M48 54q32-30 64 0M104 46l8 8-10 4', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M104 112q-24 18-48 0M56 120l0-8 10 0', ...SW(5) }, 'purple', { stroke: true })
  ],
  maquillaje: [
    s('rect', { x: 30, y: 84, width: 28, height: 52, rx: 3 }, 'dark'),
    s('rect', { x: 35, y: 64, width: 18, height: 22 }, 'gray'),
    s('path', { d: 'M37 64V42l14-10v32z' }, 'red', { accent: true }),
    s('circle', { cx: 106, cy: 106, r: 32 }, 'pink'),
    s('circle', { cx: 106, cy: 106, r: 23 }, 'tan'),
    s('path', { d: 'M132 18l-20 30', ...SW(6) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 106, cy: 58, rx: 9, ry: 14, transform: 'rotate(34 106 58)' }, 'dark')
  ],
  mentalidad: [
    s('path', { d: 'M56 140v-22q-24-10-24-44a46 46 0 0 1 92-6l12 22-10 4v14q0 12-14 12h-12v20z' }, 'skin'),
    ...gear(76, 70, 16, 8, 'orange', { accent: true }),
    s('circle', { cx: 76, cy: 70, r: 6 }, 'skin')
  ],
  micro: [
    s('circle', { cx: 80, cy: 48, r: 28 }, 'gray'),
    s('path', { d: 'M58 38h44M56 52h48M60 64h40M68 26v44M80 22v52M92 26v44', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 58, y: 72, width: 44, height: 10, rx: 3 }, 'dark'),
    s('path', { d: 'M62 82h36l-8 58H70z' }, 'black'),
    s('rect', { x: 66, y: 96, width: 28, height: 6 }, 'red', { accent: true })
  ],
  musicar: [
    ...paper(28, 18, 88, 120),
    s('path', { d: 'M36 44h72M36 52h72M36 60h72M36 92h72M36 100h72M36 108h72', ...SW(1.5) }, 'gray', { stroke: true }),
    ...note(54, 60, 'dark'),
    ...note(84, 108, 'navy'),
    s('rect', { x: 116, y: 40, width: 12, height: 64, transform: 'rotate(30 122 72)' }, 'yellow'),
    s('path', { d: 'M116 104h12l-6 14z', transform: 'rotate(30 122 72)' }, 'tan')
  ],
  'mágico': [
    s('path', { d: 'M38 134L94 66', ...SW(9) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 76l8-10', ...SW(9, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true, flatOnly: true }),
    s('path', { d: star(104, 52, 22) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(132, 28, 10) + sparkle(64, 38, 8) + sparkle(134, 88, 8) + sparkle(110, 104, 6) }, 'purple')
  ],
  nacionalismo: [
    s('path', { d: 'M14 146q66-60 132 0z' }, 'green'),
    s('path', { d: 'M80 122V22', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 22h50v34H82z' }, 'purple', { accent: true }),
    s('path', { d: star(107, 39, 10) }, 'yellow'),
    s('path', { d: busts([30, 56, 104, 130], 146, 22, 26) }, 'blue'),
    s('path', { d: dots([[30, 112], [56, 112], [104, 112], [130, 112]], 9) }, 'skin')
  ],
  narrativa: [
    s('path', { d: 'M14 112q34-10 66 6q32-16 66-6v22q-34-10-66 6q-32-16-66-6z' }, 'brown'),
    s('path', { d: 'M20 108q30-10 60 6q30-16 60-6v20q-30-10-60 6q-30-16-60-6z' }, 'cream'),
    s('path', { d: 'M80 114v20', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 112q-30-14 0-30t14-24', ...SW(6) }, 'tan', { stroke: true }),
    s('path', { d: 'M92 62V48l10-9 10 9v14z' }, 'red', { accent: true }),
    s('circle', { cx: 50, cy: 70, r: 12 }, 'green'),
    s('path', { d: 'M50 82v12', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 120, cy: 30, r: 10 }, 'yellow')
  ],
  neta: [
    s('path', { d: bubble(24, 24, 112, 84) }, 'white'),
    s('path', { d: bubble(24, 24, 112, 84), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 64l18 18 38-38', ...SW(12) }, 'green', { stroke: true, accent: true })
  ],
  obrero: [
    ground(140),
    ...person(80, 140, 'orange', { w: 40, h: 56, r: 16 }),
    s('path', { d: 'M60 62a20 20 0 0 1 40 0h6v6H54v-6z' }, 'yellow', { accent: true }),
    s('path', { d: 'M60 104h40M60 118h40', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M98 96l22-4', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M122 40v76', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M112 114h20v10q-10 14-20 0z' }, 'gray')
  ],
  privilegio: [
    s('path', { d: 'M68 30h24l20 110H48z' }, 'red', { accent: true }),
    s('path', { d: 'M24 82v52M50 82v52M110 82v52M136 82v52', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[24, 80], [50, 80], [110, 80], [136, 80]], 5) }, 'yellow'),
    s('path', { d: 'M24 86q13 16 26 0M110 86q13 16 26 0', ...SW(5) }, 'purple', { stroke: true }),
    s('path', { d: sparkle(36, 34, 10) + sparkle(124, 30, 8) }, 'orange')
  ],
  realista: [
    s('rect', { x: 14, y: 112, width: 132, height: 34, rx: 6 }, 'brown'),
    s('path', { d: 'M66 112V72M94 112V72', ...SW(14) }, 'blue', { stroke: true }),
    s('path', { d: ells([[58, 112, 16, 8], [102, 112, 16, 8]]) }, 'dark', { accent: true }),
    s('path', { d: 'M40 54a14 14 0 0 1 22-18a18 18 0 0 1 34 0a14 14 0 0 1 22 18z' }, 'sky'),
    s('path', { d: 'M58 24l44 30M102 24l-44 30', ...SW(6) }, 'red', { stroke: true })
  ],
  'reseña': [
    s('rect', { x: 14, y: 34, width: 132, height: 96, rx: 10 }, 'white'),
    outline({ x: 14, y: 34, width: 132, height: 96, rx: 10 }),
    s('path', { d: star(32, 64, 12) + star(56, 64, 12) + star(80, 64, 12) + star(104, 64, 12) }, 'yellow', { accent: true }),
    s('path', { d: star(128, 64, 12) }, 'gray'),
    s('path', { d: 'M30 96h100M30 112h64', ...SW(5) }, 'gray', { stroke: true })
  ],
  sumamente: [
    s('path', { d: wedge(80, 112, 64, 180, 288) }, 'green'),
    s('path', { d: wedge(80, 112, 64, 288, 324) }, 'yellow'),
    s('path', { d: wedge(80, 112, 64, 324, 360) }, 'red', { accent: true }),
    s('path', { d: wedge(80, 112, 40, 180, 360) }, 'white'),
    s('path', { d: 'M80 112L130 88', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 112, r: 9 }, 'dark'),
    s('path', { d: 'M16 112h128', ...SW(3) }, 'gray', { stroke: true })
  ],
  tabaco: [
    s('path', { d: leaflet(70, 132, -105, 104, 22) }, 'green'),
    s('path', { d: leaflet(70, 132, -140, 80, 18) + leaflet(70, 132, -70, 84, 18) }, 'green'),
    s('path', { d: 'M70 132l-26-90M70 132L18 82M70 132l30-80', ...SW(2) }, 'mint', { stroke: true }),
    s('rect', { x: 78, y: 112, width: 64, height: 14, rx: 7, transform: 'rotate(-18 110 119)' }, 'brown', { accent: true }),
    s('rect', { x: 120, y: 112, width: 8, height: 14, transform: 'rotate(-18 110 119)' }, 'red')
  ],
  tender: [
    ground(),
    s('path', { d: 'M24 40v96M136 40v96', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M24 46q56 16 112 0', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 54h36l12 14-10 6v36H54V74l-10-6z' }, 'blue', { accent: true }),
    s('path', { d: 'M104 52h14v30l10 8v10h-20l-4-6z' }, 'red'),
    s('path', { d: rects([[58, 46, 4, 12], [108, 44, 4, 12]]) }, 'yellow')
  ],
  uh: [
    s('circle', { cx: 74, cy: 80, r: 54 }, 'yellow', { accent: true }),
    s('path', { d: 'M48 70h16M84 70h16M46 56l16-6M102 56l-16-6', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 108q18-12 36 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: ells([[124, 118, 10, 7], [140, 128, 6, 5]]) }, 'sky')
  ],
  verificar: [
    ...paper(24, 18, 76, 100),
    s('path', { d: 'M36 38h52M36 52h52M36 66h36', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 90l10 10 20-20', ...SW(6) }, 'green', { stroke: true, accent: true }),
    s('circle', { cx: 106, cy: 96, r: 22, opacity: 0.5 }, 'sky'),
    s('path', { d: ring(106, 96, 22), ...SW(7) }, 'navy', { stroke: true }),
    s('path', { d: 'M123 113l18 18', ...SW(10) }, 'brown', { stroke: true })
  ],
  'vínculo': [
    s('path', { d: heart(44, 84, 16) }, 'red', { accent: true }),
    s('path', { d: heart(116, 84, 16) }, 'pink'),
    s('path', { d: 'M60 78q20 30 40 0', ...SW(4) }, 'purple', { stroke: true }),
    s('circle', { cx: 80, cy: 92, r: 6 }, 'purple')
  ],
  aficionado: [
    ...person(80, 140, 'red', { w: 36, h: 50, r: 15, accent: true }),
    s('path', { d: 'M66 98L46 52M94 98l20-46', ...SW(8) }, 'skin', { stroke: true }),
    s('rect', { x: 34, y: 34, width: 92, height: 16, rx: 2 }, 'blue'),
    s('path', { d: rects([[48, 34, 10, 16], [74, 34, 10, 16], [100, 34, 10, 16]]) }, 'white'),
    s('circle', { cx: 80, cy: 78, r: 4 }, 'dark'),
    s('circle', { cx: 128, cy: 126, r: 14 }, 'white'),
    outline({ cx: 128, cy: 126, r: 14 }, 'dark'),
    s('path', { d: 'M123 121h10l3 8-8 6-8-6z' }, 'dark')
  ],
  'algodón': [
    backdrop('sky'),
    s('path', { d: 'M80 146V108', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(80, 130, 200, 28, 8) + leaflet(80, 130, -20, 28, 8) }, 'green'),
    s('path', { d: 'M54 102q26 22 52 0l-6 14q-20 10-40 0z' }, 'brown'),
    s('path', { d: dots([[80, 62], [60, 78], [100, 78], [68, 96], [92, 96], [80, 82]], 18) }, 'white', { accent: true })
  ],
  anciano: [
    ground(),
    ...lean(70, 136, 8, 'purple', { accent: true }),
    s('path', { d: 'M66 76a12 12 0 0 1 24 0', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M84 104l20-4', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M106 136V98q0-10 10-10', ...SW(5) }, 'brown', { stroke: true })
  ],
  arresto: [
    s('path', { d: halfRays(80, 48, 30, 40, 5), ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M62 52a18 18 0 0 1 36 0v8H62z' }, 'red', { accent: true }),
    s('rect', { x: 54, y: 58, width: 52, height: 9, rx: 2 }, 'dark'),
    s('path', { d: ring(52, 110, 20) + ring(108, 110, 20), ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M72 110h16', ...SW(5) }, 'dark', { stroke: true })
  ],
  'atlético': [
    s('path', { d: 'M28 112h70', ...SW(30) }, 'skin', { stroke: true }),
    s('path', { d: 'M100 112l10-56', ...SW(26) }, 'skin', { stroke: true }),
    s('circle', { cx: 112, cy: 44, r: 18 }, 'skin'),
    s('ellipse', { cx: 64, cy: 96, rx: 24, ry: 16 }, 'skin'),
    s('path', { d: 'M48 106q16 6 32 0', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 14, y: 90, width: 24, height: 44, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M52 70l-4-10M66 66V54M80 70l4-10', ...SW(3) }, 'orange', { stroke: true })
  ],
  'boletín': [
    ...paper(24, 22, 112, 116),
    s('rect', { x: 34, y: 32, width: 92, height: 14, rx: 2 }, 'navy'),
    s('rect', { x: 34, y: 52, width: 44, height: 8, rx: 2 }, 'red', { accent: true }),
    s('rect', { x: 34, y: 68, width: 42, height: 36, rx: 2 }, 'sky'),
    s('path', { d: 'M84 72h42M84 84h42M84 96h34M34 114h92M34 126h70', ...SW(4) }, 'gray', { stroke: true })
  ],
  carbono: [
    s('path', { d: poly(around(80, 80, 40, 6, -90)) + rays(80, 80, 40, 58, 6, -90), ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: dots(around(80, 80, 40, 6, -90), 11) }, 'black', { accent: true }),
    s('path', { d: dots(around(80, 80, 61, 6, -90), 7) }, 'gray')
  ],
  'climático': [
    s('circle', { cx: 32, cy: 32, r: 12 }, 'yellow'),
    s('circle', { cx: 64, cy: 90, r: 44 }, 'blue'),
    s('path', { d: 'M36 72q10-14 26-8t8 18-14 10-20-6zM74 108q14-8 22 4t-8 18-16-8z' }, 'green'),
    s('rect', { x: 112, y: 20, width: 18, height: 96, rx: 9 }, 'white'),
    s('rect', { x: 112, y: 20, width: 18, height: 96, rx: 9, ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 117, y: 50, width: 8, height: 70, rx: 4 }, 'red'),
    s('circle', { cx: 121, cy: 122, r: 14 }, 'red', { accent: true })
  ],
  corredor: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 8 }, 'cream'),
    s('path', { d: 'M14 146l46-42h40l46 42z' }, 'brown'),
    s('path', { d: 'M14 14l46 40h40l46-40z' }, 'tan'),
    s('rect', { x: 60, y: 54, width: 40, height: 50 }, 'sky'),
    s('path', { d: 'M24 126V44l18 14v58zM136 126V44l-18 14v58z' }, 'blue', { accent: true }),
    s('path', { d: 'M74 104h12l12 42H62z' }, 'red')
  ],
  desfile: [
    ground(),
    ...person(36, 136, 'red', { h: 36, w: 24, r: 10 }),
    ...person(80, 136, 'blue', { h: 36, w: 24, r: 10 }),
    ...person(124, 136, 'green', { h: 36, w: 24, r: 10 }),
    s('path', { d: 'M48 116V40', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 40h30l-8 10 8 10H48z' }, 'yellow', { accent: true }),
    s('rect', { x: 68, y: 112, width: 24, height: 16, rx: 4 }, 'orange')
  ],
  ejecutar: [
    ...gear(56, 104, 24, 10, 'gray'),
    s('circle', { cx: 98, cy: 62, r: 40 }, 'green', { accent: true }),
    s('path', { d: 'M86 42v40l32-20z' }, 'white')
  ],
  esfera: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'blue', { accent: true }),
    s('path', { d: 'M80 140a60 60 0 0 0 60-60q-8 46-60 60z' }, 'navy', { flatOnly: true }),
    s('ellipse', { cx: 80, cy: 80, rx: 60, ry: 18, ...SW(3) }, 'sky', { stroke: true }),
    s('ellipse', { cx: 80, cy: 80, rx: 22, ry: 60, ...SW(3) }, 'sky', { stroke: true }),
    s('ellipse', { cx: 56, cy: 50, rx: 12, ry: 8, transform: 'rotate(-30 56 50)' }, 'white', { flatOnly: true })
  ],
  estupidez: [
    s('circle', { cx: 80, cy: 80, r: 58 }, 'yellow', { accent: true }),
    s('path', { d: spiral(56, 64) + spiral(98, 64), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 102q26 14 52 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M78 106q-2 18 10 18t10-20z' }, 'pink')
  ],
  exclusivo: [
    s('rect', { x: 16, y: 38, width: 128, height: 84, rx: 10 }, 'black'),
    s('rect', { x: 30, y: 60, width: 26, height: 20, rx: 3 }, 'yellow'),
    s('path', { d: 'M38 60v20M30 70h26', ...SW(1.5) }, 'orange', { stroke: true }),
    s('path', { d: 'M92 94l-4-30 14 12 10-20 10 20 14-12-4 30z' }, 'yellow', { accent: true }),
    s('path', { d: 'M30 104h50', ...SW(4) }, 'gray', { stroke: true })
  ],
  'extinción': [
    ground(),
    s('path', { d: 'M90 96q16-34 30-46M42 102q-18 4-24 22M52 112v24M64 116v20M82 116v20M94 112v24', ...SW(9) }, 'green', { stroke: true }),
    s('ellipse', { cx: 70, cy: 102, rx: 34, ry: 18 }, 'green'),
    s('ellipse', { cx: 126, cy: 46, rx: 11, ry: 7 }, 'green'),
    s('path', { d: 'M48 30l30-16M46 42l28-8', ...SW(5) }, 'yellow', { stroke: true }),
    s('circle', { cx: 38, cy: 40, r: 13 }, 'orange', { accent: true })
  ],
  ficha: [
    s('path', { d: 'M22 100h56v28a28 9 0 0 1-56 0z' }, 'blue'),
    s('path', { d: 'M22 110a28 9 0 0 0 56 0M22 120a28 9 0 0 0 56 0', ...SW(2) }, 'sky', { stroke: true }),
    s('ellipse', { cx: 50, cy: 100, rx: 28, ry: 9 }, 'sky'),
    s('circle', { cx: 102, cy: 68, r: 40 }, 'red', { accent: true }),
    s('circle', { cx: 102, cy: 68, r: 32, ...SW(9, { 'stroke-dasharray': '10.05 10.05', 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('circle', { cx: 102, cy: 68, r: 18, ...SW(3) }, 'white', { stroke: true })
  ],
  honesto: [
    s('rect', { x: 60, y: 110, width: 40, height: 36, rx: 4 }, 'blue'),
    s('path', { d: 'M62 66V32M75 62V22M88 62V24M100 66V36M58 98L40 80', ...SW(11) }, 'skin', { stroke: true }),
    s('rect', { x: 54, y: 58, width: 52, height: 56, rx: 16 }, 'skin'),
    s('path', { d: heart(80, 86, 12) }, 'red', { accent: true })
  ],
  huella: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'tan'),
    s('path', { d: ells([[54, 118, 12, 20], [104, 64, 12, 20]]) }, 'brown', { accent: true }),
    s('path', { d: dots([[42, 94], [48, 89], [55, 87], [62, 89], [67, 94], [92, 40], [98, 35], [105, 33], [112, 35], [117, 40]], 4) }, 'brown')
  ],
  'huracán': [
    backdrop('sky'),
    s('path', { d: 'M74 80a6 6 0 0 1 12 0a14 14 0 0 1-28 0a24 24 0 0 1 48 0a36 36 0 0 1-72 0a50 50 0 0 1 100 0', ...SW(9) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M30 122l-6 12M46 126l-6 12M122 126l-6 12', ...SW(4) }, 'blue', { stroke: true })
  ],
  infinito: [
    s('path', { d: 'M80 80c-14-20-24-28-38-28a28 28 0 0 0 0 56c14 0 24-8 38-28s24-28 38-28a28 28 0 0 1 0 56c-14 0-24-8-38-28z', ...SW(14) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: sparkle(80, 34, 10) }, 'yellow'),
    s('path', { d: sparkle(80, 126, 8) }, 'orange')
  ],
  jugada: [
    s('rect', { x: 20, y: 76, width: 120, height: 60 }, 'cream'),
    s('path', { d: checker(20, 76, 6, 3, 20) }, 'brown'),
    s('rect', { x: 100, y: 76, width: 20, height: 20 }, 'green', { accent: true }),
    s('path', { d: 'M20 76h120v60H20z', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M38 112h24v-8h-6l-2-20h-8l-2 20h-6z' + dots([[50, 74]], 9) }, 'dark'),
    s('path', { d: 'M60 64q26-36 50 10M100 68l10 8 4-12', ...SW(5) }, 'orange', { stroke: true })
  ],
  lateral: [
    s('rect', { x: 14, y: 30, width: 132, height: 100, rx: 4 }, 'green'),
    s('path', { d: 'M24 40h112v80H24zM80 40v80' + ring(80, 80, 14), ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M24 120h112', ...SW(8) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M42 110h66M98 102l10 8-10 8', ...SW(5) }, 'orange', { stroke: true }),
    s('circle', { cx: 32, cy: 110, r: 7 }, 'red')
  ],
  'limitación': [
    s('path', { d: ring(64, 92, 50), ...DASH(3, '6 6') }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M64 92v-34', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 92L104 92', ...SW(3) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 118, cy: 96, rx: 18, ry: 11 }, 'tan'),
    s('circle', { cx: 104, cy: 82, r: 10 }, 'tan'),
    s('path', { d: 'M110 104v14M126 104v14', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: 'M98 74l-6 10 8 2z' }, 'brown')
  ],
  manifestar: [
    s('path', { d: 'M34 120V52M86 120V40M126 120V54', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: rects([[14, 34, 40, 26], [108, 36, 36, 26]]) }, 'white'),
    s('path', { d: rects([[14, 34, 40, 26], [108, 36, 36, 26]]), ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 66, y: 20, width: 40, height: 26 }, 'yellow', { accent: true }),
    s('path', { d: busts([26, 52, 78, 104, 130], 146, 22, 28) }, 'blue'),
    s('path', { d: dots([[26, 108], [52, 108], [78, 108], [104, 108], [130, 108]], 9) }, 'skin')
  ],
  mega: [
    s('rect', { x: 26, y: 20, width: 58, height: 116, rx: 10 }, 'dark'),
    s('rect', { x: 32, y: 32, width: 46, height: 90, rx: 2 }, 'sky'),
    s('path', { d: rects([[38, 96, 9, 18], [51, 82, 9, 32], [64, 66, 9, 48]]) }, 'green', { accent: true }),
    s('path', { d: 'M106 82V36M96 46l10-10 10 10', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M132 50v46M122 86l10 10 10-10', ...SW(6) }, 'orange', { stroke: true })
  ],
  'migración': [
    backdrop('sky'),
    s('circle', { cx: 36, cy: 38, r: 12 }, 'yellow'),
    s('path', { d: birds([[120, 72], [100, 60], [80, 48], [100, 86], [80, 98], [60, 36], [60, 110]]), ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 130h90M110 122l10 8-10 8', ...SW(5) }, 'orange', { stroke: true, accent: true })
  ],
  nacionalista: [
    ground(),
    s('path', { d: 'M96 136V24', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M96 26q12-8 24 0t24 0v34q-12 8-24 0t-24 0z' }, 'purple', { accent: true }),
    s('path', { d: star(120, 43, 9) }, 'yellow'),
    ...person(58, 136, 'blue'),
    s('path', { d: 'M70 100l24-28', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M52 82q6 6 12 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  nobel: [
    s('path', { d: 'M58 14l22 56M102 14L80 70', ...SW(12) }, 'red', { stroke: true }),
    s('path', { d: laurel(80, 100, 44) }, 'green'),
    s('circle', { cx: 80, cy: 100, r: 30 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 100, r: 23 }, 'orange'),
    s('path', { d: 'M76 120v-8q-10-4-10-14a12 12 0 0 1 24-2l4 8-4 2v6h-6v8z' }, 'yellow')
  ],
  pos: [
    ground(),
    ...lean(108, 136, 16, 'blue'),
    ...lean(52, 136, 16, 'orange', { accent: true }),
    s('path', { d: 'M76 92l18-4', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M16 90h16M20 106h14M20 122h12', ...SW(3) }, 'gray', { stroke: true })
  ],
  prestigio: [
    s('path', { d: rays(80, 80, 54, 66, 16), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: laurel(80, 84, 40) }, 'green'),
    s('path', { d: star(80, 80, 28) }, 'yellow', { accent: true }),
    s('path', { d: star(80, 80, 14) }, 'orange')
  ],
  productivo: [
    ...gear(80, 40, 14, 8, 'orange'),
    s('path', { d: rects([[22, 74, 26, 26], [66, 74, 26, 26], [110, 74, 26, 26]]) }, 'tan', { accent: true }),
    s('path', { d: 'M35 74v10M79 74v10M123 74v10', ...SW(3) }, 'brown', { stroke: true }),
    s('rect', { x: 14, y: 100, width: 132, height: 14, rx: 7 }, 'dark'),
    s('path', { d: dots([[24, 107], [52, 107], [80, 107], [108, 107], [136, 107]], 3.5) }, 'gray'),
    s('path', { d: 'M30 114v24M130 114v24', ...SW(5) }, 'gray', { stroke: true })
  ],
  prohibir: [
    s('path', { d: 'M58 62l6-8h16l6 8z' }, 'dark'),
    s('rect', { x: 44, y: 62, width: 72, height: 48, rx: 6 }, 'dark'),
    s('circle', { cx: 80, cy: 86, r: 15 }, 'gray'),
    s('path', { d: ring(80, 80, 58) + 'M39 39l82 82', ...SW(12) }, 'red', { stroke: true, accent: true })
  ],
  'práctico': [
    s('path', { d: 'M40 92L24 50', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 86q-6-10 0-16t0-16t0-16', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M106 92L138 40q6 4 2 14L118 96z' }, 'gray'),
    s('rect', { x: 28, y: 84, width: 104, height: 34, rx: 17 }, 'red', { accent: true }),
    s('path', { d: dots([[46, 101], [114, 101]], 4) }, 'gray'),
    s('path', { d: 'M74 94v14M67 101h14', ...SW(4) }, 'white', { stroke: true })
  ],
  reconocido: [
    s('rect', { x: 16, y: 16, width: 128, height: 128, rx: 8 }, 'dark'),
    s('path', { d: star(80, 74, 48) }, 'pink', { accent: true }),
    s('circle', { cx: 80, cy: 78, r: 13 }, 'orange'),
    s('path', { d: 'M48 130h64', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: sparkle(32, 32, 8) + sparkle(130, 34, 7) }, 'white')
  ],
  recurrir: [
    s('path', { d: 'M118 52q18-4 22-36', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M14 96q16-8 33 0t33 0 33 0 33 0v50H14z' }, 'blue'),
    s('circle', { cx: 54, cy: 92, r: 12 }, 'skin'),
    s('path', { d: 'M62 100L84 66', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: ring(98, 52, 20), ...SW(12) }, 'red', { stroke: true, accent: true }),
    s('path', { d: ring(98, 52, 20), ...SW(12, { 'stroke-dasharray': '15.7 15.7', 'stroke-linecap': 'butt' }) }, 'white', { stroke: true })
  ],
  retraso: [
    s('circle', { cx: 60, cy: 56, r: 40 }, 'white'),
    s('path', { d: ring(60, 56, 40), ...SW(5) }, 'navy', { stroke: true }),
    s('path', { d: 'M60 56V30M60 56l18 10', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 70, y: 124, width: 76, height: 12, rx: 6 }, 'tan'),
    s('path', { d: 'M140 124l2-16M134 124l-2-14', ...SW(3) }, 'tan', { stroke: true }),
    s('circle', { cx: 106, cy: 108, r: 20 }, 'orange', { accent: true }),
    s('path', { d: spiral(102, 108), ...SW(3) }, 'brown', { stroke: true })
  ],
  seguido: [
    s('path', { d: 'M22 48l28 32-28 32', ...SW(12) }, 'blue', { stroke: true }),
    s('path', { d: 'M62 48l28 32-28 32', ...SW(12) }, 'green', { stroke: true }),
    s('path', { d: 'M102 48l28 32-28 32', ...SW(12) }, 'orange', { stroke: true, accent: true })
  ],
  sospecha: [
    backdrop('dark'),
    s('path', { d: 'M26 82h46q-23 18-46 0zM88 82h46q-23 18-46 0z' }, 'white'),
    s('path', { d: dots([[62, 87], [124, 87]], 6) }, 'black'),
    s('path', { d: 'M26 64l44 10M90 74l44-10', ...SW(6) }, 'yellow', { stroke: true, accent: true })
  ],
  'síndrome': [
    s('circle', { cx: 74, cy: 80, r: 54 }, 'skin'),
    s('path', { d: dots([[46, 96], [56, 104], [98, 100], [90, 108], [66, 50], [104, 58], [40, 70]], 4) }, 'red', { accent: true }),
    s('path', { d: 'M50 72q6-6 12 0M84 72q6-6 12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 114q6-6 12 0t12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 112L128 84', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M120 89l10-6', ...SW(8) }, 'red', { stroke: true }),
    s('path', { d: drop(132, 40, 7) }, 'sky')
  ],
  'telecomunicación': [
    s('path', { d: 'M80 40L56 140M80 40l24 100M66 100h28M62 118h36M71 76h18M66 100l32 18M94 100l-32 18', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 36, r: 7 }, 'red', { accent: true }),
    s('path', { d: 'M62 22q-10 14 0 28M50 14q-16 22 0 44M98 22q10 14 0 28M110 14q16 22 0 44', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M26 140h108', ...SW(4) }, 'dark', { stroke: true })
  ],
  'telefónico': [
    s('path', { d: 'M32 136l12-50h72l12 50z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 112, r: 16 }, 'cream'),
    s('path', { d: dots(around(80, 112, 10, 8, 0), 2.5) }, 'gray'),
    s('path', { d: 'M26 66q0-28 54-28t54 28v6q0 8-10 8h-14q-8 0-8-8v-4q-22-6-44 0v4q0 8-8 8H36q-10 0-10-8z' }, 'dark')
  ],
  testamento: [
    s('rect', { x: 28, y: 24, width: 84, height: 108 }, 'cream'),
    s('path', { d: rects([[22, 16, 96, 12], [22, 128, 96, 12]]) }, 'tan'),
    s('path', { d: 'M40 44h60M40 58h60M40 72h48M40 86h56', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 92, cy: 108, r: 12 }, 'red', { accent: true }),
    s('path', { d: 'M146 20q-30 8-36 50l6 2q22-18 30-52z' }, 'white'),
    s('path', { d: 'M146 20q-30 8-36 50l6 2q22-18 30-52zM112 72l-6 20', ...SW(2) }, 'gray', { stroke: true })
  ],
  tolerancia: [
    ground(),
    ...person(50, 136, 'blue', { h: 50 }),
    ...person(110, 136, 'orange', { h: 38, w: 34, r: 13 }),
    s('path', { d: 'M64 112l16 4 14-4', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 44, 14) }, 'pink', { accent: true })
  ],
  transparente: [
    s('path', { d: 'M52 30h78v78H52zM34 48l18-18M112 48l18-18M112 126l18-18M34 126l18-18', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 86, r: 22 }, 'red', { accent: true }),
    s('rect', { x: 34, y: 48, width: 78, height: 78, opacity: 0.45 }, 'sky'),
    s('rect', { x: 34, y: 48, width: 78, height: 78, ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M44 60l14-0M44 68l8 0', ...SW(3) }, 'white', { stroke: true, flatOnly: true })
  ],
  'ángulo': [
    s('path', { d: wedge(28, 128, 52, 315, 360) }, 'yellow'),
    s('path', { d: 'M80 128A52 52 0 0 0 64.8 91.2', ...SW(5) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M28 128h112M28 128L116 40', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 28, cy: 128, r: 6 }, 'dark')
  ],
  acercar: [
    ground(),
    ...person(34, 136, 'blue'),
    s('path', { d: 'M46 104h18', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 66, y: 96, width: 40, height: 40, rx: 3 }, 'tan'),
    s('path', { d: 'M66 112h40', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M114 106h18M116 120h14', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M112 80H70M80 70l-10 10 10 10', ...SW(6) }, 'orange', { stroke: true, accent: true })
  ],
  armar: [
    ground(),
    s('rect', { x: 26, y: 40, width: 14, height: 96 }, 'tan'),
    s('rect', { x: 40, y: 96, width: 100, height: 14 }, 'tan'),
    s('path', { d: dots([[33, 103], [33, 60]], 3) }, 'brown'),
    s('rect', { x: 90, y: 24, width: 16, height: 40, rx: 6, transform: 'rotate(35 98 44)' }, 'red', { accent: true }),
    s('path', { d: 'M86 60L70 84', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[66, 90]], 4) }, 'dark')
  ],
  arroyo: [
    backdrop('mint'),
    s('path', { d: 'M70 14h22q-24 30 2 60t-6 72H50q24-40 0-72t20-60z' }, 'blue', { accent: true }),
    s('path', { d: 'M72 40q4-4 8 0M64 100q6-4 12 0M60 128q6-4 12 0', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: ells([[36, 60, 10, 7], [122, 96, 12, 8], [118, 40, 8, 6]]) }, 'gray'),
    s('path', { d: 'M30 124l-4-12M36 124v-14M42 124l4-12M122 136l-4-12M128 136v-14', ...SW(3) }, 'green', { stroke: true })
  ],
  avanzada: [
    s('path', { d: 'M14 146q66-50 132 0z' }, 'green'),
    s('path', { d: 'M60 128L70 60M100 128L90 60M64 104h32M67 82h26', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 58, y: 42, width: 44, height: 20, rx: 2 }, 'brown'),
    s('path', { d: 'M52 44l28-16 28 16z' }, 'red'),
    s('path', { d: 'M80 30V12', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 12h20l-6 6 6 6H80z' }, 'orange', { accent: true })
  ],
  bono: [
    s('path', { d: 'M16 48h128v22a10 10 0 0 0 0 20v22H16V90a10 10 0 0 0 0-20z' }, 'orange', { accent: true }),
    s('path', { d: 'M108 54v52', ...DASH(3, '4 5') }, 'white', { stroke: true }),
    s('path', { d: star(62, 80, 20) }, 'white'),
    s('path', { d: 'M118 72h14M118 88h14', ...SW(3) }, 'cream', { stroke: true })
  ],
  burgo: [
    ground(),
    s('path', { d: 'M38 98V70l12-10 12 10v28zM70 98V58l12-10 12 10v40zM102 98V68l12-10 12 10v30z' }, 'pink'),
    s('path', { d: 'M36 72l14-14 14 14zM68 60l14-14 14 14zM100 70l14-14 14 14z' }, 'red'),
    s('path', { d: 'M18 136V96h124v40z' + rects([[18, 88, 12, 10], [40, 88, 12, 10], [62, 88, 12, 10], [84, 88, 12, 10], [106, 88, 12, 10], [128, 88, 14, 10]]) }, 'tan', { accent: true }),
    s('path', { d: 'M68 136v-18a12 12 0 0 1 24 0v18z' }, 'dark')
  ],
  'calificación': [
    ...paper(28, 16, 88, 120),
    s('path', { d: 'M40 62h46M40 82h46M40 102h46', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M94 58l4 4 8-10M94 78l4 4 8-10M94 98l4 4 8-10', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: ring(96, 36, 12), ...SW(4) }, 'red', { stroke: true, accent: true }),
    s('path', { d: star(120, 122, 18) }, 'yellow')
  ],
  centavo: [
    s('circle', { cx: 116, cy: 116, r: 24 }, 'yellow'),
    s('path', { d: ring(116, 116, 18), ...SW(2) }, 'orange', { stroke: true }),
    s('circle', { cx: 68, cy: 72, r: 48 }, 'orange', { accent: true }),
    s('path', { d: ring(68, 72, 40), ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: star(68, 72, 22) }, 'yellow')
  ],
  'concesión': [
    s('path', { d: wedge(56, 76, 40, 60, 360) }, 'tan'),
    s('path', { d: wedge(56, 76, 34, 60, 360) }, 'yellow'),
    s('path', { d: wedge(56, 76, 40, 0, 60), transform: 'translate(40 26)' }, 'orange', { accent: true }),
    s('path', { d: 'M98 68q26 0 32 26', ...DASH(4, '6 6') }, 'gray', { stroke: true })
  ],
  concluir: [
    s('path', { d: 'M38 146V18', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 40, y: 20, width: 96, height: 64 }, 'white'),
    s('path', { d: checker(40, 20, 6, 4, 16, 0) }, 'black', { accent: true }),
    s('rect', { x: 40, y: 20, width: 96, height: 64, ...SW(2) }, 'gray', { stroke: true })
  ],
  constancia: [
    s('path', { d: 'M14 14h132v6q-30 8-50 2l-16 8-16-8q-20 6-50-2z' }, 'brown'),
    s('path', { d: drop(80, 46, 7) + drop(80, 74, 5) }, 'blue', { accent: true }),
    s('path', { d: 'M20 140l10-30q20-16 50-12q34-4 50 12l10 30z' }, 'gray'),
    s('ellipse', { cx: 80, cy: 110, rx: 12, ry: 5 }, 'dark'),
    s('path', { d: 'M58 112q22 10 44 0', ...SW(2) }, 'sky', { stroke: true })
  ],
  decente: [
    s('path', { d: 'M36 146v-50q0-26 28-30h32q28 4 28 30v50z' }, 'navy'),
    s('path', { d: 'M64 66h32l-16 54z' }, 'white'),
    s('path', { d: 'M76 68h8l-1 6 5 30-8 10-8-10 5-30z' }, 'red', { accent: true }),
    s('path', { d: 'M64 66l12 34M96 66l-12 34', ...SW(3) }, 'sky', { stroke: true }),
    s('circle', { cx: 80, cy: 42, r: 20 }, 'skin'),
    s('path', { d: 'M60 40a20 20 0 0 1 40 0q-20-10-40 0z' }, 'brown')
  ],
  despedida: [
    s('path', { d: 'M14 26q66 24 132 0', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 31h12l-6 12zM72 38h12l-6 12zM120 32h12l-6 12z' }, 'red'),
    s('path', { d: 'M48 36h12l-6 12zM96 37h12l-6 12z' }, 'yellow'),
    ...person(54, 136, 'green'),
    ...person(108, 136, 'blue', { accent: true }),
    s('path', { d: 'M42 100L28 70M120 100l14-30', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M18 70q2-8 8-10M134 60q6 2 8 8', ...SW(3) }, 'gray', { stroke: true })
  ],
  empate: [
    s('path', { d: 'M50 114v26M110 114v26', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 16, y: 30, width: 128, height: 84, rx: 8 }, 'dark'),
    s('rect', { x: 26, y: 44, width: 46, height: 56, rx: 4 }, 'red'),
    s('rect', { x: 88, y: 44, width: 46, height: 56, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: dots([[41, 72], [57, 72], [103, 72], [119, 72]], 6) }, 'yellow'),
    s('path', { d: 'M76 66h8M76 78h8', ...SW(3) }, 'white', { stroke: true })
  ],
  entendimiento: [
    s('path', { d: busts([36, 124], 146, 40, 30) }, 'blue'),
    s('path', { d: dots([[36, 100], [124, 100]], 18) }, 'skin'),
    s('path', { d: dots([[48, 72], [58, 60], [112, 72], [102, 60]], 4) }, 'gray'),
    s('path', { d: halfRays(80, 40, 22, 28, 5), ...SW(3) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 40, r: 16 }, 'yellow', { accent: true }),
    s('rect', { x: 73, y: 54, width: 14, height: 10, rx: 2 }, 'gray')
  ],
  exilio: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('circle', { cx: 110, cy: 86, r: 14 }, 'orange', { accent: true }),
    s('path', { d: 'M14 86h132v48a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'brown'),
    s('path', { d: 'M74 146l12-60h4l22 60z' }, 'tan'),
    s('path', { d: 'M90 98a6 6 0 1 0 0.1 0z' + rects([[86, 104, 10, 18]]) }, 'black'),
    s('path', { d: 'M94 108l10-12', ...SW(2) }, 'black', { stroke: true }),
    s('circle', { cx: 105, cy: 95, r: 4 }, 'black')
  ],
  film: [
    s('circle', { cx: 64, cy: 64, r: 48 }, 'dark'),
    s('path', { d: dots(around(64, 64, 26, 6, 30), 10) }, 'white'),
    s('circle', { cx: 64, cy: 64, r: 6 }, 'gray'),
    s('rect', { x: 70, y: 108, width: 76, height: 32 }, 'black'),
    s('path', { d: rects([[80, 116, 18, 16], [104, 116, 18, 16], [128, 116, 14, 16]]) }, 'sky', { accent: true }),
    s('path', { d: 'M74 111h72M74 137h72', ...DASH(2, '3 4') }, 'white', { stroke: true })
  ],
  introducir: [
    s('rect', { x: 30, y: 76, width: 100, height: 66, rx: 8 }, 'gray'),
    s('rect', { x: 54, y: 22, width: 52, height: 66, rx: 5 }, 'blue', { accent: true }),
    s('rect', { x: 64, y: 34, width: 14, height: 10, rx: 2 }, 'yellow'),
    s('rect', { x: 46, y: 84, width: 68, height: 8, rx: 3 }, 'dark'),
    s('path', { d: dots([[54, 112], [68, 112], [82, 112], [54, 126], [68, 126], [82, 126]], 4) }, 'white'),
    s('path', { d: 'M124 22v40M116 52l8 10 8-10', ...SW(5) }, 'orange', { stroke: true })
  ],
  lema: [
    s('path', { d: 'M44 56h72v32q0 34-36 50q-36-16-36-50z' }, 'blue'),
    s('path', { d: star(80, 94, 16) }, 'yellow'),
    s('path', { d: 'M14 36l14-6v26l-14 6 8-14zM146 36l-14-6v26l14 6-8-14z' }, 'orange'),
    s('path', { d: 'M26 26q54-14 108 0v26q-54-14-108 0z' }, 'red', { accent: true }),
    s('path', { d: 'M44 36q36-8 72 0', ...SW(3) }, 'cream', { stroke: true })
  ],
  liberar: [
    s('rect', { x: 20, y: 136, width: 72, height: 8, rx: 2 }, 'brown'),
    s('path', { d: 'M28 136V64M42 136V54M56 136V50M70 136V54M84 136V64M24 66q32-34 64 0', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M84 92l22 10v34l-22-6z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M90 74l10-8M96 84l12-6', ...SW(3) }, 'sky', { stroke: true }),
    s('ellipse', { cx: 118, cy: 52, rx: 15, ry: 10 }, 'yellow', { accent: true }),
    s('path', { d: 'M110 50l6-20 10 18zM132 48l10 4-10 4z' }, 'orange'),
    s('circle', { cx: 126, cy: 48, r: 2 }, 'dark')
  ],
  literal: [
    ...paper(16, 30, 54, 100),
    ...paper(90, 30, 54, 100),
    s('path', { d: 'M26 50h34M26 70h34M26 90h34M26 110h34M100 50h34M100 70h34M100 90h34M100 110h34', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 50h26M86 44l6 6-6 6M66 70h26M86 64l6 6-6 6M66 90h26M86 84l6 6-6 6', ...SW(3) }, 'orange', { stroke: true, accent: true })
  ],
  'localización': [
    s('path', { d: 'M16 56l42-12 44 12 42-12v84l-42 12-44-12-42 12z' }, 'mint'),
    s('path', { d: 'M58 44v84M102 56v84', ...SW(2) }, 'green', { stroke: true }),
    s('path', { d: 'M22 112q40-30 60-6t58-30', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M90 92q-26-30-26-48a26 26 0 0 1 52 0q0 18-26 48z' }, 'red', { accent: true }),
    s('circle', { cx: 90, cy: 44, r: 9 }, 'white')
  ],
  logo: [
    s('path', { d: 'M56 58v-12a24 24 0 0 1 48 0v12', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M32 56h96l8 88H24z' }, 'navy'),
    s('circle', { cx: 80, cy: 100, r: 24 }, 'yellow', { accent: true }),
    s('path', { d: 'M66 106q14 12 30-14', ...SW(6) }, 'navy', { stroke: true })
  ],
  lord: [
    s('path', { d: 'M40 146l12-64h56l12 64z' }, 'red', { accent: true }),
    s('path', { d: 'M48 80h64l-6 20H54z' }, 'white'),
    s('path', { d: dots([[62, 90], [80, 92], [98, 90]], 2.5) }, 'black'),
    s('circle', { cx: 80, cy: 60, r: 18 }, 'skin'),
    s('path', { d: 'M62 44l4-16 7 8 7-10 7 10 7-8 4 16z' }, 'yellow'),
    s('path', { d: 'M72 68q8 4 16 0', ...SW(3) }, 'brown', { stroke: true })
  ],
  lady: [
    s('path', { d: 'M70 62h20l28 80H42z' }, 'purple', { accent: true }),
    s('path', { d: 'M70 70l-14 30M90 70l14 30', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 80, cy: 44, r: 16 }, 'skin'),
    s('path', { d: 'M64 44a16 16 0 0 1 32 0q-6-12-16-12t-16 12z' }, 'brown'),
    s('path', { d: 'M70 26l4-10 6 6 6-6 4 10z' }, 'yellow'),
    s('path', { d: 'M72 66q8 8 16 0', ...SW(2) }, 'white', { stroke: true })
  ],
  may: [
    s('rect', { x: 28, y: 30, width: 104, height: 106, rx: 8 }, 'white'),
    outline({ x: 28, y: 30, width: 104, height: 106, rx: 8 }),
    s('rect', { x: 28, y: 30, width: 104, height: 24, rx: 8 }, 'green'),
    s('path', { d: 'M52 22v16M108 22v16', ...SW(5) }, 'dark', { stroke: true }),
    ...flower(80, 86, 'pink')
  ],
  opositor: [
    ground(),
    s('path', { d: 'M146 70H112V52L82 86l30 34v-18h34z' }, 'blue'),
    ...lean(44, 136, 20, 'orange', { accent: true }),
    s('path', { d: 'M56 102l24-12M54 112l26-14', ...SW(6) }, 'skin', { stroke: true })
  ],
  orilla: [
    s('path', { d: 'M14 14h132v60q-20 10-40 4t-40 6-52-4z' }, 'blue', { accent: true }),
    s('path', { d: 'M14 74q22 8 52 4t40-6 40-4v78H14z' }, 'tan'),
    s('path', { d: 'M14 74q22 8 52 4t40-6 40-4', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M96 50h24l-4 8h-16z' }, 'brown'),
    s('path', { d: 'M108 22v26h-14z' }, 'white'),
    s('path', { d: 'M30 132v-22M36 132v-28M42 132v-20', ...SW(3) }, 'green', { stroke: true })
  ],
  'oxígeno': [
    s('path', { d: 'M70 80h20', ...SW(10) }, 'gray', { stroke: true }),
    s('path', { d: dots([[48, 80], [112, 80]], 25) }, 'red', { accent: true }),
    s('path', { d: ells([[40, 70, 7, 5], [104, 70, 7, 5]]) }, 'white', { flatOnly: true }),
    s('path', { d: dots([[30, 132], [128, 30], [132, 128], [28, 32], [80, 132]], 6) }, 'sky')
  ],
  paco: [
    backdrop('mint'),
    s('path', { d: 'M48 112v28M62 114v26M84 114v26M98 112v28', ...SW(8) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 72, cy: 98, rx: 38, ry: 22 }, 'cream', { accent: true }),
    s('rect', { x: 92, y: 40, width: 20, height: 62, rx: 10 }, 'cream'),
    s('ellipse', { cx: 108, cy: 40, rx: 16, ry: 12 }, 'cream'),
    s('path', { d: 'M96 32l2-14 6 10zM112 30l4-14 4 12z' }, 'cream'),
    s('path', { d: dots([[114, 38]], 2.5) + ells([[124, 44, 3, 2]]) }, 'dark')
  ],
  pintor: [
    ground(),
    s('path', { d: 'M100 136l12-96M138 136l-12-96', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 96, y: 48, width: 46, height: 40 }, 'sky'),
    s('path', { d: 'M96 88q23-22 46 0z' }, 'green'),
    ...person(50, 136, 'blue', { h: 48 }),
    s('path', { d: 'M36 72q14-16 28-2z' }, 'red', { accent: true }),
    s('path', { d: 'M62 104l24-22', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M86 82l10-12', ...SW(3) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 28, cy: 112, rx: 13, ry: 9 }, 'tan')
  ],
  pistola: [
    s('rect', { x: 22, y: 50, width: 112, height: 24, rx: 4 }, 'gray'),
    s('rect', { x: 130, y: 54, width: 8, height: 12 }, 'dark'),
    s('path', { d: 'M36 74h30l-10 62H24z' }, 'dark', { accent: true }),
    s('path', { d: 'M68 74v14q0 10-12 10M62 76v8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 56v12M104 56v12M112 56v12', ...SW(2) }, 'dark', { stroke: true })
  ],
  polo: [
    s('path', { d: 'M80 14v134', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 84, r: 52 }, 'blue'),
    s('path', { d: 'M48 74q14-12 24 2t-6 24-18-6zM92 96q16-10 26 2t-8 24-18-8z' }, 'green'),
    s('path', { d: 'M48 43a52 52 0 0 1 64 0q-32 14-64 0z' }, 'white', { accent: true }),
    s('path', { d: 'M44 24q36-14 72 0M108 16l8 8-10 4', ...SW(4) }, 'orange', { stroke: true })
  ],
  racismo: [
    s('path', { d: busts([30, 60], 146, 26, 32) }, 'green'),
    s('circle', { cx: 30, cy: 102, r: 11 }, 'skin'),
    s('circle', { cx: 60, cy: 102, r: 11 }, 'tan'),
    s('rect', { x: 80, y: 40, width: 16, height: 106 }, 'red', { accent: true }),
    s('path', { d: 'M80 62h16M80 84h16M80 106h16M80 128h16M88 40v22M88 84v22', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: busts([124], 146, 26, 32) }, 'purple'),
    s('circle', { cx: 124, cy: 102, r: 11 }, 'brown'),
    s('path', { d: 'M118 106q6-4 12 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  'rebelión': [
    s('path', { d: 'M44 112L50 64M116 112l-6-48', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M50 70V46M110 70V46', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: drop(50, 36, 9) + drop(110, 36, 9) }, 'orange', { accent: true }),
    s('path', { d: drop(50, 40, 4) + drop(110, 40, 4) }, 'yellow'),
    s('path', { d: busts([28, 56, 84, 112, 136], 146, 24, 28) }, 'navy'),
    s('path', { d: dots([[28, 108], [56, 108], [84, 108], [112, 108], [136, 108]], 9) }, 'skin')
  ],
  reclamar: [
    s('path', { d: bubble(52, 16, 92, 60) }, 'red', { accent: true }),
    s('path', { d: 'M64 46l10-10 10 10 10-10 10 10 10-10 10 10', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M78 102q18 0 18 14t-18 14', ...SW(6) }, 'sky', { stroke: true }),
    s('rect', { x: 26, y: 90, width: 54, height: 52, rx: 6 }, 'sky'),
    s('path', { d: 'M46 90l8 14-8 10 10 14', ...SW(3) }, 'dark', { stroke: true })
  ],
  relativo: [
    s('path', { d: dots(around(48, 80, 24, 6), 11) }, 'gray'),
    s('path', { d: dots(around(120, 80, 16, 8), 4) }, 'gray'),
    s('path', { d: dots([[48, 80], [120, 80]], 9) }, 'orange', { accent: true })
  ],
  ron: [
    s('path', { d: 'M50 30h20v24q16 8 16 26v52q0 6-6 6H40q-6 0-6-6V80q0-18 16-26z' }, 'brown', { accent: true }),
    s('rect', { x: 50, y: 18, width: 20, height: 14, rx: 2 }, 'tan'),
    s('rect', { x: 38, y: 90, width: 44, height: 30, rx: 3 }, 'cream'),
    s('path', { d: 'M46 112q7-8 14 0t14 0M60 108V96l8 4', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M98 116h36l-2 20h-32z' }, 'orange'),
    s('path', { d: 'M96 98h40l-4 40h-32z', ...SW(3) }, 'gray', { stroke: true })
  ],
  secundario: [
    s('rect', { x: 60, y: 84, width: 40, height: 52 }, 'tan'),
    s('rect', { x: 22, y: 100, width: 38, height: 36 }, 'blue', { accent: true }),
    s('rect', { x: 100, y: 112, width: 38, height: 24 }, 'tan'),
    s('path', { d: dots([[80, 104]], 4) + dots([[112, 124], [119, 124], [126, 124]], 3) }, 'brown'),
    s('path', { d: dots([[34, 120], [48, 120]], 4) }, 'white'),
    ...person(41, 100, 'green', { h: 28, w: 22, r: 9 }),
    s('path', { d: 'M36 72l5 10 5-10', ...SW(2) }, 'red', { stroke: true }),
    s('circle', { cx: 41, cy: 86, r: 5 }, 'gray')
  ],
  seriamente: [
    s('circle', { cx: 80, cy: 84, r: 54 }, 'skin'),
    s('path', { d: 'M28 72a52 52 0 0 1 104 0q-52-30-104 0z' }, 'dark'),
    s('path', { d: 'M46 62l24 8M114 62l-24 8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: ring(60, 84, 13) + ring(100, 84, 13) + 'M73 84h14', ...SW(4) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M64 116h32', ...SW(5) }, 'dark', { stroke: true })
  ],
  tercio: [
    s('path', { d: wedge(76, 84, 58, 30, 270) }, 'sky'),
    s('path', { d: wedge(76, 84, 58, -90, 30), transform: 'translate(8 -4)' }, 'orange', { accent: true }),
    s('path', { d: 'M76 84V26M76 84l50 29', ...SW(3) }, 'white', { stroke: true })
  ],
  'uña': [
    s('path', { d: 'M48 146V62a32 32 0 0 1 64 0v84z' }, 'skin'),
    s('path', { d: 'M58 72V56a22 22 0 0 1 44 0v16q-22 8-44 0z' }, 'pink', { accent: true }),
    s('path', { d: 'M66 54q2-10 10-12', ...SW(3) }, 'white', { stroke: true, flatOnly: true }),
    s('path', { d: 'M62 112q18 6 36 0M64 124q16 4 32 0', ...SW(3) }, 'tan', { stroke: true })
  ],
  'énfasis': [
    ...paper(20, 22, 98, 116),
    s('rect', { x: 28, y: 68, width: 84, height: 16, rx: 2 }, 'yellow', { accent: true }),
    s('path', { d: 'M34 46h72M34 60h56M34 76h70M34 96h64M34 112h48', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 112, y: 64, width: 18, height: 56, rx: 4, transform: 'rotate(35 121 92)' }, 'green'),
    s('path', { d: 'M114 64h14l-4 -10h-6z', transform: 'rotate(35 121 92)' }, 'yellow')
  ],
  acorde: [
    s('rect', { x: 14, y: 60, width: 132, height: 42 }, 'brown'),
    s('path', { d: 'M42 60v42M72 60v42M102 60v42M132 60v42', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 65h132M14 71h132M14 78h132M14 84h132M14 91h132M14 97h132', ...SW(1.5) }, 'cream', { stroke: true }),
    s('path', { d: dots([[57, 71], [87, 84], [87, 91]], 6) }, 'red', { accent: true }),
    ...note(52, 46, 'purple'),
    ...note(102, 48, 'blue'),
    s('path', { d: 'M36 118q10 14 24 0M76 118q10 14 24 0', ...SW(4) }, 'skin', { stroke: true })
  ],
  acostumbrado: [
    s('rect', { x: 40, y: 34, width: 80, height: 64, rx: 14 }, 'green', { accent: true }),
    s('rect', { x: 34, y: 86, width: 92, height: 24, rx: 8 }, 'mint'),
    s('path', { d: rects([[24, 70, 18, 44], [118, 70, 18, 44]]) }, 'green'),
    s('path', { d: 'M38 114v12M122 114v12', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: ells([[62, 136, 14, 6], [98, 136, 14, 6]]) }, 'red'),
    s('path', { d: ells([[56, 134, 6, 4], [92, 134, 6, 4]]) }, 'pink')
  ],
  advertencia: [
    s('path', { d: 'M40 30l-10-6M38 50H24M120 30l10-6M122 50h14', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 56, y: 18, width: 46, height: 66, rx: 4, transform: 'rotate(8 79 51)' }, 'yellow', { accent: true }),
    s('rect', { x: 66, y: 124, width: 28, height: 22, rx: 3 }, 'black'),
    s('path', { d: 'M80 118v8', ...SW(20) }, 'skin', { stroke: true }),
    s('rect', { x: 62, y: 80, width: 34, height: 40, rx: 12 }, 'skin'),
    s('path', { d: 'M70 92h22M70 104h22', ...SW(2) }, 'tan', { stroke: true })
  ],
  afortunadamente: [
    s('path', { d: 'M80 80q10 40 30 62', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: heart(80, 62, 18) }, 'green'),
    s('path', { d: heart(80, 62, 18), transform: 'rotate(90 80 80)' }, 'green'),
    s('path', { d: heart(80, 62, 18), transform: 'rotate(180 80 80)' }, 'green'),
    s('path', { d: heart(80, 62, 18), transform: 'rotate(270 80 80)' }, 'green'),
    s('path', { d: sparkle(130, 30, 10) + sparkle(28, 126, 8) }, 'yellow', { accent: true })
  ],
  agarrar: [
    s('path', { d: dots([[66, 88], [94, 88]], 7) }, 'brown'),
    s('circle', { cx: 80, cy: 104, r: 19 }, 'brown', { accent: true }),
    s('circle', { cx: 80, cy: 110, r: 7 }, 'tan'),
    s('path', { d: 'M80 12v30', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 64, y: 40, width: 32, height: 16, rx: 4 }, 'dark'),
    s('path', { d: 'M68 54q-24 22-6 56M92 54q24 22 6 56', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 140h124', ...SW(4) }, 'sky', { stroke: true })
  ],
  arar: [
    s('rect', { x: 14, y: 100, width: 132, height: 46, rx: 4 }, 'brown'),
    s('path', { d: 'M14 112h132M14 124h132M14 136h132', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M56 98l32-36M74 78H50', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 94l14 8-18 4z' }, 'gray'),
    ...person(110, 100, 'green', { h: 36, w: 24, r: 10 }),
    s('path', { d: 'M90 46h40M100 46q10-16 20 0', ...SW(5) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M100 74l-12-10', ...SW(6) }, 'skin', { stroke: true })
  ],
  arquitecto: [
    s('rect', { x: 14, y: 24, width: 118, height: 100, rx: 4 }, 'blue'),
    s('path', { d: 'M36 104V70l30-22 30 22v34zM56 104V84h20v20', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M24 114h96', ...DASH(2, '4 4') }, 'sky', { stroke: true }),
    s('path', { d: 'M96 140V72l50 68zM104 128V96l22 32z' }, 'yellow', { accent: true })
  ],
  arzobispo: [
    s('path', { d: 'M124 146V40q0-18-16-16q-10 2-8 12', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M42 146l10-66h56l10 66z' }, 'purple', { accent: true }),
    s('path', { d: 'M72 82v64M88 82v64', ...SW(6) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 66, r: 14 }, 'skin'),
    s('path', { d: 'M64 56V34q16-26 32 0v22z' }, 'white'),
    s('path', { d: 'M64 56V34q16-26 32 0v22zM80 22v34M64 46h32', ...SW(3) }, 'yellow', { stroke: true })
  ],
  atleta: [
    ground(),
    s('path', { d: 'M16 74q24 2 44-8M104 62q20 10 40 10', ...SW(4) }, 'red', { stroke: true }),
    ...lean(80, 136, 12, 'blue', { accent: true }),
    s('path', { d: 'M92 96l18-36M84 96L66 62', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 76, y: 104, width: 16, height: 12, rx: 2, transform: 'rotate(12 80 136)' }, 'white')
  ],
  bestia: [
    s('path', { d: 'M52 54q-30-6-32-36M108 54q30-6 32-36', ...SW(8) }, 'tan', { stroke: true }),
    s('path', { d: 'M50 62l-18 4 16 8zM110 62l18 4-16 8z' }, 'brown'),
    s('path', { d: 'M50 50q30-10 60 0l-4 50q-4 30-26 34q-22-4-26-34z' }, 'brown', { accent: true }),
    s('ellipse', { cx: 80, cy: 116, rx: 20, ry: 14 }, 'tan'),
    s('path', { d: dots([[72, 116], [88, 116]], 3.5) }, 'dark'),
    s('path', { d: 'M60 74l12 6M100 74l-12 6', ...SW(5) }, 'black', { stroke: true }),
    s('path', { d: 'M50 132q-8 4-10 12M110 132q8 4 10 12', ...SW(3) }, 'gray', { stroke: true })
  ],
  'caña': [
    s('path', { d: 'M58 30h44l-6 106H64z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[72, 90], [86, 70], [78, 112], [90, 120]], 2.5) }, 'white'),
    s('path', { d: 'M54 36q0-14 14-12q6-10 16-4q14-6 18 6q8 0 6 10z' }, 'white'),
    s('path', { d: 'M54 36q0-14 14-12q6-10 16-4q14-6 18 6q8 0 6 10z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 36l6 100h32l6-100', ...SW(3) }, 'gray', { stroke: true })
  ],
  comando: [
    ...person(80, 146, 'green', { w: 56, h: 52, r: 22 }),
    s('path', { d: ells([[66, 112, 8, 5], [94, 124, 9, 5], [70, 134, 6, 4], [98, 104, 6, 4]]) }, 'dark'),
    s('path', { d: 'M54 66a26 26 0 0 1 52 0h4v8H50v-8z' }, 'dark', { accent: true }),
    s('path', { d: 'M66 80h10M84 80h10', ...SW(4) }, 'green', { stroke: true })
  ],
  consultar: [
    ...person(46, 136, 'white'),
    s('rect', { x: 31, y: 92, width: 30, height: 44, rx: 10, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 94v10q6 8 12 0V94', ...SW(2) }, 'dark', { stroke: true }),
    ...person(118, 136, 'orange', { accent: true }),
    s('path', { d: bubble(70, 16, 60, 36) }, 'sky'),
    s('path', { d: dots([[88, 34], [100, 34], [112, 34]], 3.5) }, 'navy')
  ],
  'cristóbal': [
    s('path', { d: 'M72 146l4-50h8l4 50z' }, 'brown', { accent: true }),
    s('path', { d: dots([[56, 62], [80, 46], [104, 62], [68, 82], [94, 82]], 24) }, 'green'),
    s('circle', { cx: 124, cy: 128, r: 16 }, 'orange'),
    s('path', { d: ring(124, 128, 10) + ring(124, 128, 4), ...SW(2) }, 'brown', { stroke: true })
  ],
  discapacidad: [
    s('path', { d: 'M54 72v38h50l12 22M44 72h10', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: ring(64, 110, 28), ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 118, cy: 134, r: 7 }, 'dark'),
    s('circle', { cx: 72, cy: 44, r: 12 }, 'skin'),
    s('rect', { x: 62, y: 58, width: 22, height: 42, rx: 8 }, 'blue', { accent: true }),
    s('path', { d: 'M70 98h32l4 26', ...SW(11) }, 'blue', { stroke: true })
  ],
  disminuir: [
    s('rect', { x: 22, y: 22, width: 116, height: 116, ...DASH(3, '6 6') }, 'gray', { stroke: true }),
    s('rect', { x: 66, y: 66, width: 28, height: 28, rx: 4 }, 'orange', { accent: true }),
    s('path', { d: 'M30 30l26 26M130 30l-26 26M30 130l26-26M130 130l-26-26M56 42v14H42M104 42v14h14M56 118v-14H42M104 118v-14h14', ...SW(6) }, 'blue', { stroke: true })
  ],
  'distinción': [
    s('path', { d: 'M48 36q-22 0-18 20t22 14M112 36q22 0 18 20t-22 14', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M48 24h64v22q0 34-32 40q-32-6-32-40z' }, 'yellow', { accent: true }),
    s('rect', { x: 72, y: 84, width: 16, height: 24 }, 'orange'),
    s('rect', { x: 52, y: 106, width: 56, height: 14, rx: 3 }, 'brown'),
    s('rect', { x: 44, y: 120, width: 72, height: 14, rx: 3 }, 'dark'),
    s('path', { d: star(80, 50, 13) }, 'white')
  ],
  divorcio: [
    s('path', { d: heart(80, 68, 24) }, 'red', { accent: true }),
    s('path', { d: 'M80 30l-8 14 10 12-8 14 6 12', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: ring(42, 124, 12) + ring(118, 124, 12), ...SW(5) }, 'yellow', { stroke: true })
  ],
  encantado: [
    s('path', { d: 'M14 100L52 86', ...SW(26, { 'stroke-linecap': 'butt' }) }, 'blue', { stroke: true }),
    s('path', { d: 'M146 100L108 86', ...SW(26, { 'stroke-linecap': 'butt' }) }, 'orange', { stroke: true }),
    s('ellipse', { cx: 80, cy: 84, rx: 32, ry: 17 }, 'skin'),
    s('path', { d: 'M70 76v16M80 74v18M90 76v16', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: sparkle(46, 44, 12) + sparkle(114, 38, 10) + sparkle(82, 26, 7) }, 'yellow', { accent: true }),
    s('path', { d: heart(80, 126, 8) }, 'pink')
  ],
  envidia: [
    s('circle', { cx: 56, cy: 80, r: 38 }, 'green', { accent: true }),
    s('path', { d: 'M36 72h18M62 72h18', ...SW(7) }, 'white', { stroke: true }),
    s('path', { d: dots([[50, 72], [76, 72]], 3) }, 'black'),
    s('path', { d: 'M36 60l16 4M64 64l16-4M46 100q10-6 20 0', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 100, y: 92, width: 40, height: 36, rx: 2 }, 'red'),
    s('path', { d: 'M120 92v36M100 108h40M120 92q-10-14-16-4t16 4q10-14 16-4t-16 4', ...SW(4) }, 'yellow', { stroke: true })
  ],
  estatus: [
    s('path', { d: 'M14 136v-18h28v-18h28v-18h28V64h48v72z' }, 'blue'),
    ...person(122, 64, 'orange', { h: 26, w: 20, r: 9, accent: true }),
    s('path', { d: star(96, 32, 10) }, 'yellow'),
    s('path', { d: 'M110 30l-4-6M138 30l4-6', ...SW(3) }, 'yellow', { stroke: true })
  ],
  favorable: [
    s('rect', { x: 28, y: 72, width: 26, height: 54, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: 'M58 74L66 30a10 10 0 0 1 18 4l-4 40z' }, 'skin'),
    s('rect', { x: 52, y: 70, width: 56, height: 58, rx: 12 }, 'skin'),
    s('path', { d: 'M74 84h32M74 98h32M74 112h30', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: sparkle(124, 40, 10) + sparkle(110, 20, 6) }, 'yellow')
  ],
  fi: [
    s('path', { d: 'M70 44q-22-6-26 22M90 44q22-6 26 22', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 20h28v8q-4 4-4 10q30 12 30 46q0 30-22 46h-36q-22-16-22-46q0-34 30-46q0-6-4-10z' }, 'orange', { accent: true }),
    s('path', { d: 'M42 84h76', ...SW(6) }, 'black', { stroke: true }),
    s('path', { d: 'M46 100h68M46 68h68', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 62, y: 130, width: 36, height: 10, rx: 2 }, 'dark')
  ],
  fibra: [
    s('path', { d: 'M18 142q30-40 52-52', ...SW(16) }, 'dark', { stroke: true }),
    s('path', { d: 'M70 90q20-10 40-40M70 90q24-4 54-22M70 90q24 4 58 0M70 90q14-20 20-56', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: dots([[110, 50], [124, 68], [128, 90], [90, 34]], 5) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(136, 34, 8) }, 'yellow')
  ],
  granja: [
    ground(),
    s('rect', { x: 104, y: 58, width: 30, height: 78 }, 'gray'),
    s('path', { d: 'M104 60a15 15 0 0 1 30 0z' }, 'gray'),
    s('path', { d: 'M28 136V78l34-32 34 32v58z' }, 'red', { accent: true }),
    s('rect', { x: 48, y: 104, width: 28, height: 32 }, 'white'),
    s('path', { d: 'M48 104l28 32M76 104l-28 32', ...SW(3) }, 'red', { stroke: true }),
    s('rect', { x: 54, y: 72, width: 16, height: 12 }, 'white')
  ],
  grano: [
    s('path', { d: 'M56 146V36', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: leaflet(56, 52, -125, 20, 6) + leaflet(56, 52, -55, 20, 6) + leaflet(56, 68, -125, 20, 6) + leaflet(56, 68, -55, 20, 6) + leaflet(56, 84, -125, 20, 6) + leaflet(56, 84, -55, 20, 6) + leaflet(56, 42, -90, 18, 6) }, 'yellow', { accent: true }),
    s('path', { d: 'M86 140q26-44 56 0z' }, 'orange'),
    s('path', { d: ells([[100, 128, 4, 3], [114, 120, 4, 3], [126, 130, 4, 3], [112, 134, 4, 3]]) }, 'tan')
  ],
  'hábito': [
    s('path', { d: 'M40 80a40 40 0 1 1 12 28', ...SW(8) }, 'green', { stroke: true }),
    s('path', { d: 'M42 98L60 102L46 116z' }, 'green'),
    s('path', { d: 'M58 102L98 62', ...SW(10) }, 'blue', { stroke: true, accent: true }),
    s('rect', { x: 92, y: 42, width: 28, height: 12, rx: 3, transform: 'rotate(-45 106 48)' }, 'white'),
    s('rect', { x: 92, y: 42, width: 28, height: 12, rx: 3, transform: 'rotate(-45 106 48)', ...SW(2) }, 'gray', { stroke: true })
  ],
  impulsar: [
    s('path', { d: drop(80, 118, 12), transform: 'rotate(180 80 118)' }, 'orange'),
    s('path', { d: drop(80, 112, 6), transform: 'rotate(180 80 112)' }, 'yellow'),
    s('path', { d: 'M80 14q22 20 22 60v28H58V74q0-40 22-60z' }, 'white'),
    s('path', { d: 'M80 14q22 20 22 60v28H58V74q0-40 22-60z', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 56, r: 9 }, 'sky'),
    s('path', { d: 'M58 80l-16 24h16zM102 80l16 24h-16z' }, 'red', { accent: true })
  ],
  injusto: [
    s('path', { d: 'M80 34v100M54 136h52', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 44L130 76', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 44l-12 30M30 44l12 30M130 76l-12 30M130 76l12 30', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M16 74h28q-14 16-28 0zM116 106h28q-14 16-28 0z' }, 'yellow', { accent: true }),
    s('rect', { x: 120, y: 86, width: 20, height: 20, rx: 2 }, 'dark'),
    s('circle', { cx: 30, cy: 70, r: 4 }, 'orange')
  ],
  mafia: [
    s('path', { d: 'M34 146v-30q0-26 30-30h32q30 4 30 30v30z' }, 'black'),
    s('path', { d: 'M68 86h24l-12 30z' }, 'gray'),
    s('path', { d: 'M78 88h4l2 20-4 6-4-6z' }, 'red'),
    s('circle', { cx: 80, cy: 62, r: 22 }, 'skin'),
    s('path', { d: 'M46 48h68v6H46zM60 48q0-26 20-26t20 26z' }, 'dark', { accent: true }),
    s('path', { d: 'M60 44h40', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M62 60h14v6a7 7 0 0 1-14 0zM84 60h14v6a7 7 0 0 1-14 0zM76 62h8' }, 'black')
  ],
  migrante: [
    ground(),
    s('path', { d: 'M104 20v116', ...DASH(4, '8 6') }, 'gray', { stroke: true }),
    ...person(56, 136, 'green', { accent: true }),
    s('path', { d: 'M76 108v-6h14v6', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 70, y: 108, width: 26, height: 24, rx: 3 }, 'brown'),
    s('path', { d: 'M70 50h56M116 40l10 10-10 10', ...SW(5) }, 'orange', { stroke: true })
  ],
  monstruo: [
    s('path', { d: 'M50 40l-8-24 18 14zM110 40l8-24-18 14z' }, 'tan'),
    s('path', { d: 'M36 146V72a44 44 0 0 1 88 0v74l-11-10-11 10-11-10-11 10-11-10-11 10-11-10z' }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 62, r: 16 }, 'white'),
    s('circle', { cx: 80, cy: 64, r: 7 }, 'black'),
    s('path', { d: 'M54 94h52q-26 26-52 0z' }, 'dark'),
    s('path', { d: 'M60 94l5 8 5-8zM90 94l5 8 5-8z' }, 'white')
  ],
  moro: [
    s('rect', { x: 20, y: 20, width: 120, height: 120, rx: 4 }, 'tan'),
    s('path', { d: 'M56 140V96A30 30 0 1 1 104 96V140z' }, 'navy'),
    s('path', { d: 'M51 98A34 34 0 1 1 109 98', ...SW(8, { 'stroke-dasharray': '8 8', 'stroke-linecap': 'butt' }) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M20 132h120', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: star(80, 30, 6) }, 'blue')
  ],
  movilidad: [
    s('path', { d: 'M14 92h16M18 106h12', ...SW(3) }, 'gray', { stroke: true }),
    ...person(66, 122, 'orange', { h: 38, w: 24, r: 10, accent: true }),
    s('path', { d: 'M76 94l32-36', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M38 126h70L118 54', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: 'M106 54h22', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[42, 134], [110, 134]], 10) }, 'black')
  ],
  nombramiento: [
    s('rect', { x: 16, y: 20, width: 56, height: 40, rx: 3 }, 'cream'),
    s('rect', { x: 16, y: 20, width: 56, height: 40, rx: 3, ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M26 32h36M26 42h24', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 60, cy: 50, r: 6 }, 'red'),
    s('path', { d: 'M50 66q10 26 26 32', ...SW(4) }, 'orange', { stroke: true }),
    ...person(104, 140, 'blue', { w: 40, h: 56, r: 16 }),
    s('path', { d: 'M88 88l32 46', ...SW(9) }, 'red', { stroke: true }),
    s('path', { d: star(98, 100, 9) }, 'yellow', { accent: true })
  ],
  ofensiva: [
    s('rect', { x: 122, y: 30, width: 22, height: 106 }, 'gray'),
    s('path', { d: 'M122 54h22M122 78h22M122 102h22M133 30v24M133 78v24', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M16 42h60V32l28 18-28 18V58H16zM16 106h60V96l28 18-28 18v-10H16z' }, 'red', { accent: true }),
    s('path', { d: 'M28 74h60V64l28 18-28 18V90H28z' }, 'orange')
  ],
  open: [
    s('path', { d: 'M66 90v44', ...SW(10), transform: 'rotate(-30 66 56)' }, 'dark', { stroke: true }),
    s('ellipse', { cx: 66, cy: 56, rx: 28, ry: 36, transform: 'rotate(-30 66 56)' }, 'mint'),
    s('path', { d: 'M50 29v54M58 24v64M66 22v68M74 24v64M82 29v54M45 36h42M41 46h50M40 56h52M41 66h50M45 76h42', ...SW(1.5), transform: 'rotate(-30 66 56)' }, 'gray', { stroke: true }),
    s('ellipse', { cx: 66, cy: 56, rx: 28, ry: 36, ...SW(7), transform: 'rotate(-30 66 56)' }, 'orange', { stroke: true, accent: true }),
    s('circle', { cx: 118, cy: 114, r: 15 }, 'yellow'),
    s('path', { d: 'M105 106q13 10 26 2', ...SW(2) }, 'white', { stroke: true })
  ],
  'oído': [
    s('path', { d: 'M70 136q-10 0-14-10t-2-22q-24-18-24-48a40 40 0 0 1 80 0q0 20-14 34-8 8-8 22t-18 24z' }, 'skin'),
    s('path', { d: 'M54 58a16 16 0 0 1 32 0q0 12-10 18-6 4-6 14', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: 'M118 46q8 14 0 28M132 36q14 24 0 48', ...SW(5) }, 'blue', { stroke: true, accent: true })
  ],
  parcialmente: [
    s('rect', { x: 20, y: 50, width: 108, height: 60, rx: 8 }, 'white'),
    s('rect', { x: 128, y: 68, width: 12, height: 24, rx: 3 }, 'dark'),
    s('path', { d: rects([[30, 60, 20, 40], [54, 60, 20, 40]]) }, 'green', { accent: true }),
    s('path', { d: rects([[78, 60, 20, 40], [102, 60, 20, 40]]), ...DASH(2, '4 4') }, 'gray', { stroke: true }),
    s('rect', { x: 20, y: 50, width: 108, height: 60, rx: 8, ...SW(5) }, 'dark', { stroke: true })
  ],
  'proyección': [
    s('path', { d: 'M108 104L84 24v58z', opacity: 0.6 }, 'yellow'),
    s('rect', { x: 14, y: 20, width: 76, height: 64 }, 'white'),
    s('rect', { x: 14, y: 20, width: 76, height: 64, ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 20, y: 26, width: 64, height: 52 }, 'sky'),
    s('path', { d: 'M20 78l20-26 14 16 10-10 20 20z' }, 'green'),
    s('path', { d: 'M96 130h50', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 102, y: 100, width: 42, height: 28, rx: 4 }, 'dark', { accent: true }),
    s('circle', { cx: 110, cy: 114, r: 8 }, 'gray')
  ],
  recinto: [
    backdrop('mint'),
    s('rect', { x: 26, y: 40, width: 108, height: 90, ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 26, y: 40, width: 108, height: 90, ...SW(10, { 'stroke-dasharray': '4 14', 'stroke-linecap': 'butt' }) }, 'brown', { stroke: true }),
    s('rect', { x: 60, y: 92, width: 40, height: 24 }, 'cream'),
    s('path', { d: 'M54 94l26-34 26 34z' }, 'red', { accent: true }),
    s('path', { d: 'M80 60V48', ...SW(3) }, 'dark', { stroke: true })
  ],
  recorrer: [
    s('path', { d: 'M30 120q-14-60 40-80t60 30-30 50-70 0z', ...SW(5, { 'stroke-dasharray': '1 11' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 52q-12-14-12-22a12 12 0 0 1 24 0q0 8-12 22zM126 86q-12-14-12-22a12 12 0 0 1 24 0q0 8-12 22zM98 132q-12-14-12-22a12 12 0 0 1 24 0q0 8-12 22z' }, 'red', { accent: true }),
    s('path', { d: dots([[48, 30], [126, 64], [98, 110]], 4) }, 'white'),
    ...person(34, 136, 'blue', { h: 24, w: 16, r: 8 })
  ],
  relevancia: [
    s('rect', { x: 14, y: 20, width: 132, height: 112, rx: 6 }, 'tan'),
    s('rect', { x: 14, y: 20, width: 132, height: 112, rx: 6, ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: rects([[26, 34, 28, 24], [108, 96, 26, 24], [24, 96, 28, 24]]) }, 'white'),
    s('rect', { x: 60, y: 46, width: 50, height: 52, transform: 'rotate(-6 85 72)' }, 'yellow', { accent: true }),
    s('path', { d: 'M68 70h34M68 82h26', ...SW(4), transform: 'rotate(-6 85 72)' }, 'orange', { stroke: true }),
    s('circle', { cx: 84, cy: 50, r: 7 }, 'red')
  ],
  rendir: [
    backdrop('sky'),
    ...person(60, 146, 'green', { h: 50 }),
    s('path', { d: 'M72 106l24-42M48 106L36 70', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M98 66V18', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M98 20h36q-6 10 0 20H98z' }, 'white', { accent: true })
  ],
  'restauración': [
    s('path', { d: rects([[18, 60, 30, 18], [50, 60, 30, 18], [82, 60, 30, 18], [114, 60, 28, 18], [18, 80, 14, 18], [34, 80, 30, 18], [98, 80, 30, 18], [130, 80, 12, 18], [18, 100, 30, 18], [50, 100, 30, 18], [82, 100, 30, 18], [114, 100, 28, 18], [18, 120, 14, 18], [34, 120, 30, 18], [66, 120, 30, 18], [98, 120, 30, 18], [130, 120, 12, 18]]) }, 'red'),
    s('rect', { x: 66, y: 36, width: 30, height: 18, transform: 'rotate(-10 81 45)' }, 'orange', { accent: true }),
    s('path', { d: 'M104 30l14-14 14 14-14 14z' }, 'gray'),
    s('path', { d: 'M126 22l12-8', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M74 70v6M86 70v6', ...SW(3) }, 'gray', { stroke: true })
  ],
  ruptura: [
    s('path', { d: 'M18 34h58l-6 14 8 12-8 12 8 14-6 14 4 22H18z', transform: 'rotate(-8 48 80)' }, 'sky'),
    s('circle', { cx: 48, cy: 70, r: 10, transform: 'rotate(-8 48 80)' }, 'skin'),
    s('rect', { x: 38, y: 82, width: 20, height: 34, rx: 6, transform: 'rotate(-8 48 80)' }, 'blue', { accent: true }),
    s('path', { d: 'M90 34h52v92H90l4-22-6-14 8-14-8-12 8-12z', transform: 'rotate(8 116 80)' }, 'sky'),
    s('circle', { cx: 116, cy: 70, r: 10, transform: 'rotate(8 116 80)' }, 'skin'),
    s('rect', { x: 106, y: 82, width: 20, height: 34, rx: 6, transform: 'rotate(8 116 80)' }, 'pink')
  ],
  saldo: [
    s('path', { d: 'M36 92q-12-6-6-14', ...SW(3) }, 'pink', { stroke: true }),
    s('path', { d: rects([[52, 118, 12, 20], [96, 118, 12, 20]]) + 'M106 72l8-16 8 16z' }, 'pink'),
    s('ellipse', { cx: 80, cy: 98, rx: 44, ry: 32 }, 'pink', { accent: true }),
    s('ellipse', { cx: 124, cy: 98, rx: 10, ry: 12 }, 'pink'),
    s('path', { d: 'M68 70h24', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[106, 88]], 3) + dots([[122, 96], [127, 96]], 2) }, 'dark'),
    s('circle', { cx: 80, cy: 36, r: 14 }, 'yellow'),
    s('path', { d: ring(80, 36, 9), ...SW(2) }, 'orange', { stroke: true })
  ],
  tanque: [
    ground(),
    s('path', { d: 'M96 70h46', ...SW(8) }, 'green', { stroke: true }),
    s('path', { d: 'M52 84q2-24 28-24t28 24z' }, 'green'),
    s('path', { d: 'M24 104l10-20h92l10 20z' }, 'green', { accent: true }),
    s('rect', { x: 18, y: 102, width: 124, height: 32, rx: 16 }, 'dark'),
    s('path', { d: dots([[36, 118], [58, 118], [80, 118], [102, 118], [124, 118]], 7) }, 'gray')
  ],
  vigencia: [
    ...paper(18, 18, 82, 112),
    s('path', { d: 'M30 38h58M30 52h58M30 66h40', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 60, cy: 100, r: 15 }, 'green', { accent: true }),
    s('path', { d: 'M53 100l5 5 10-10', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M112 64h28l-12 34 12 34h-28l12-34z' }, 'sky'),
    s('path', { d: 'M116 128h20l-10-20z' }, 'yellow'),
    s('path', { d: 'M108 64h36M108 132h36', ...SW(5) }, 'brown', { stroke: true })
  ],
  viudo: [
    s('rect', { x: 98, y: 22, width: 44, height: 54, rx: 3 }, 'brown'),
    s('rect', { x: 104, y: 28, width: 32, height: 42 }, 'cream'),
    s('path', { d: heart(120, 50, 10) }, 'pink'),
    ...person(56, 140, 'black', { w: 34, h: 54, r: 14 }),
    s('path', { d: 'M44 66a12 12 0 0 1 24 0', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 114l20-26', ...SW(3) }, 'green', { stroke: true }),
    s('circle', { cx: 96, cy: 86, r: 7 }, 'red', { accent: true }),
    s('circle', { cx: 74, cy: 114, r: 5 }, 'skin')
  ],
  wifi: [
    s('path', { d: 'M63 105A24 24 0 0 1 97 105M46 88A48 48 0 0 1 114 88M29 71A72 72 0 0 1 131 71', ...SW(12) }, 'blue', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 124, r: 9 }, 'blue'),
    s('path', { d: sparkle(128, 118, 8) + sparkle(32, 118, 6) }, 'yellow')
  ],
  abarca: [
    s('path', { d: 'M80 16q30 0 30 40t-8 50q-4 36-22 36t-22-36q-8-10-8-50t30-40z' }, 'tan'),
    s('path', { d: 'M80 16q30 0 30 40t-8 50q-4 36-22 36t-22-36q-8-10-8-50t30-40z', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M52 50h56M50 72h60M56 108h48', ...SW(10) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M80 50v58', ...SW(4) }, 'brown', { stroke: true })
  ],
  aislamiento: [
    s('circle', { cx: 80, cy: 82, r: 42 }, 'sky'),
    s('path', { d: ring(80, 82, 42), ...DASH(3, '6 6') }, 'navy', { stroke: true }),
    ...person(80, 112, 'orange', { h: 30, w: 22, r: 10, accent: true }),
    ...person(22, 146, 'gray', { h: 20, w: 14, r: 7 }),
    ...person(138, 146, 'gray', { h: 20, w: 14, r: 7 }),
    s('path', { d: 'M80 130v14', ...SW(3) }, 'gray', { stroke: true })
  ],
  'alcaldía': [
    ground(),
    s('rect', { x: 68, y: 28, width: 24, height: 30 }, 'tan'),
    s('circle', { cx: 80, cy: 40, r: 8 }, 'white'),
    s('path', { d: 'M80 40v-5M80 40h4M80 28V14', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 14h14v8H80z' }, 'red', { accent: true }),
    s('rect', { x: 22, y: 72, width: 116, height: 64 }, 'tan'),
    s('path', { d: 'M18 74l62-22 62 22z' }, 'brown'),
    s('path', { d: rects([[32, 82, 8, 46], [50, 82, 8, 46], [102, 82, 8, 46], [120, 82, 8, 46]]) }, 'white'),
    s('rect', { x: 70, y: 100, width: 20, height: 36 }, 'dark')
  ],
  buque: [
    s('rect', { x: 112, y: 38, width: 10, height: 18 }, 'red'),
    s('rect', { x: 104, y: 54, width: 30, height: 44 }, 'white'),
    s('rect', { x: 104, y: 54, width: 30, height: 44, ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 64h22M108 76h22', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: rects([[28, 80, 22, 18], [76, 80, 22, 18], [52, 62, 22, 18]]) }, 'red'),
    s('path', { d: rects([[52, 80, 22, 18], [28, 62, 22, 18]]) }, 'orange'),
    s('path', { d: 'M16 98h128l-14 30H30z' }, 'navy', { accent: true }),
    s('path', { d: 'M14 128q11-6 22 0t22 0 22 0 22 0 22 0 22 0v18H14z' }, 'blue')
  ],
  burla: [
    ...person(42, 136, 'orange', { accent: true }),
    s('path', { d: 'M36 80q6 10 12 0z' }, 'dark'),
    s('path', { d: 'M54 102l34-8', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M22 64l-6-4M20 76h-6M26 54l-4-6', ...SW(3) }, 'gray', { stroke: true }),
    ...person(122, 136, 'blue'),
    s('path', { d: 'M116 86q6-5 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: drop(132, 82, 3) }, 'sky')
  ],
  conectado: [
    s('rect', { x: 18, y: 50, width: 50, height: 64, rx: 8 }, 'white'),
    s('rect', { x: 18, y: 50, width: 50, height: 64, rx: 8, ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 26, y: 64, width: 34, height: 34, rx: 6 }, 'dark'),
    s('path', { d: 'M60 82q34 0 46-24', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: halfRays(116, 40, 24, 32, 5), ...SW(4) }, 'orange', { stroke: true }),
    s('circle', { cx: 116, cy: 40, r: 18 }, 'yellow', { accent: true }),
    s('rect', { x: 108, y: 56, width: 16, height: 10, rx: 2 }, 'gray')
  ],
  conectar: [
    s('rect', { x: 88, y: 40, width: 52, height: 72, rx: 8 }, 'white'),
    s('rect', { x: 88, y: 40, width: 52, height: 72, rx: 8, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M106 66v16M122 66v16', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 66h18M60 82h18', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 28, y: 56, width: 34, height: 36, rx: 6 }, 'blue', { accent: true }),
    s('path', { d: 'M28 74q-12 0-14 40', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M50 36h26M68 28l8 8-8 8', ...SW(4) }, 'orange', { stroke: true })
  ],
  'contemporáneo': [
    s('rect', { x: 18, y: 22, width: 124, height: 104, rx: 2 }, 'dark'),
    s('rect', { x: 26, y: 30, width: 108, height: 88 }, 'cream'),
    s('rect', { x: 36, y: 88, width: 48, height: 14 }, 'blue'),
    s('path', { d: 'M86 108l22-44 22 44z' }, 'yellow'),
    s('circle', { cx: 60, cy: 62, r: 18 }, 'red', { accent: true }),
    s('path', { d: 'M40 138h80', ...SW(4) }, 'gray', { stroke: true })
  ],
  dominante: [
    backdrop('sky'),
    s('path', { d: 'M30 88L14 70v36z' }, 'orange'),
    s('ellipse', { cx: 70, cy: 88, rx: 44, ry: 30 }, 'orange', { accent: true }),
    s('path', { d: 'M114 88l-18-6v12z' }, 'dark'),
    s('circle', { cx: 92, cy: 76, r: 4 }, 'dark'),
    s('path', { d: fishes([[126, 50]]) }, 'yellow'),
    s('path', { d: dots([[108, 120], [118, 110], [128, 126]], 3) }, 'white')
  ],
  espectro: [
    backdrop('dark'),
    s('path', { d: 'M14 100L66 76', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M80 36l32 60H48z' }, 'sky', { accent: true }),
    s('path', { d: 'M96 72L146 46', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M97 76L146 60', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M98 80L146 74', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M99 84L146 88', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M100 88L146 102', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M101 92L146 116', ...SW(6) }, 'purple', { stroke: true })
  ],
  eventualmente: [
    s('rect', { x: 22, y: 66, width: 58, height: 58, rx: 10 }, 'white'),
    s('rect', { x: 22, y: 66, width: 58, height: 58, rx: 10, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[36, 80], [51, 95], [66, 110]], 5) }, 'dark'),
    s('rect', { x: 84, y: 36, width: 54, height: 54, rx: 10, transform: 'rotate(15 111 63)' }, 'red', { accent: true }),
    s('path', { d: dots([[98, 50], [124, 50], [111, 63], [98, 76], [124, 76]], 5), transform: 'rotate(15 111 63)' }, 'white')
  ],
  fatal: [
    s('path', { d: 'M66 30h28v14q22 10 22 34v50q0 8-8 8H52q-8 0-8-8V78q0-24 22-34z' }, 'purple', { accent: true }),
    s('rect', { x: 68, y: 16, width: 24, height: 16, rx: 3 }, 'tan'),
    s('rect', { x: 52, y: 78, width: 56, height: 46, rx: 3 }, 'cream'),
    s('path', { d: 'M66 116l28-8M66 108l28 8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[80, 94]], 12) + rects([[73, 98, 14, 10]]) }, 'dark'),
    s('path', { d: dots([[75, 93], [85, 93]], 3.5) }, 'cream')
  ],
  fundamentalmente: [
    s('rect', { x: 14, y: 96, width: 132, height: 50, rx: 4 }, 'brown'),
    s('rect', { x: 32, y: 96, width: 96, height: 36 }, 'gray', { accent: true }),
    s('path', { d: 'M32 108h96M32 120h96M56 96v12M88 96v12M120 96v12M40 108v12M72 108v12M104 108v12M56 120v12M88 120v12', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 46, y: 60, width: 68, height: 36 }, 'tan'),
    s('path', { d: 'M38 62l42-34 42 34z' }, 'red'),
    s('rect', { x: 72, y: 74, width: 16, height: 22 }, 'brown')
  ],
  'fusión': [
    s('circle', { cx: 60, cy: 80, r: 36 }, 'red'),
    s('circle', { cx: 100, cy: 80, r: 36 }, 'blue'),
    s('path', { d: 'M80 50.1A36 36 0 0 1 80 109.9A36 36 0 0 1 80 50.1z' }, 'purple', { accent: true }),
    s('path', { d: sparkle(80, 28, 9) + sparkle(80, 134, 7) }, 'yellow')
  ],
  golf: [
    s('path', { d: 'M14 132h132', ...SW(8) }, 'green', { stroke: true }),
    s('path', { d: 'M72 108h16l-6 6v18h-4v-18z' }, 'tan'),
    s('circle', { cx: 80, cy: 94, r: 14 }, 'white'),
    outline({ cx: 80, cy: 94, r: 14 }),
    s('path', { d: dots([[75, 90], [84, 88], [80, 98], [88, 96]], 1.6) }, 'gray'),
    s('path', { d: 'M132 16L106 104', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 100h22q4 8-4 14H96z' }, 'navy', { accent: true })
  ],
  green: [
    s('ellipse', { cx: 80, cy: 110, rx: 66, ry: 30 }, 'green', { accent: true }),
    s('ellipse', { cx: 80, cy: 110, rx: 50, ry: 20 }, 'mint', { flatOnly: true }),
    s('ellipse', { cx: 98, cy: 110, rx: 8, ry: 4 }, 'dark'),
    s('path', { d: 'M98 110V26', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M98 26l32 11-32 11z' }, 'red'),
    s('circle', { cx: 52, cy: 116, r: 6 }, 'white'),
    outline({ cx: 52, cy: 116, r: 6 }, 'gray', 2)
  ],
  hallar: [
    s('path', { d: halfRays(80, 76, 44, 62, 7), ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M38 78l10-30h64l10 30z' }, 'brown'),
    s('path', { d: dots([[54, 78], [70, 74], [86, 76], [102, 78], [62, 82], [96, 82]], 8) }, 'yellow', { accent: true }),
    s('rect', { x: 34, y: 80, width: 92, height: 52, rx: 4 }, 'brown'),
    s('path', { d: 'M34 100h92', ...SW(4) }, 'yellow', { stroke: true }),
    s('rect', { x: 74, y: 94, width: 12, height: 14, rx: 2 }, 'yellow')
  ],
  implementar: [
    s('rect', { x: 20, y: 26, width: 80, height: 112, rx: 6 }, 'brown'),
    s('rect', { x: 28, y: 36, width: 64, height: 96 }, 'white'),
    s('rect', { x: 44, y: 20, width: 32, height: 14, rx: 3 }, 'gray'),
    s('path', { d: 'M36 56l5 5 9-10M36 80l5 5 9-10M36 104l5 5 9-10', ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M56 56h28M56 80h28M56 104h28', ...SW(4) }, 'gray', { stroke: true }),
    ...gear(118, 110, 16, 8, 'orange'),
    s('circle', { cx: 118, cy: 110, r: 6 }, 'white')
  ],
  'incorporación': [
    ...person(30, 136, 'blue', { h: 36, w: 24, r: 10 }),
    ...person(62, 136, 'blue', { h: 36, w: 24, r: 10 }),
    s('path', { d: 'M108 112H84M92 104l-8 8 8 8', ...SW(4) }, 'orange', { stroke: true }),
    ...person(126, 136, 'orange', { h: 36, w: 24, r: 10, accent: true }),
    s('path', { d: 'M126 30v24M114 42h24', ...SW(6) }, 'green', { stroke: true })
  ],
  insulto: [
    ...person(36, 136, 'red', { accent: true }),
    s('circle', { cx: 40, cy: 82, r: 4 }, 'dark'),
    s('path', { d: burst(88, 46, 32, 20, 9) }, 'dark'),
    s('path', { d: 'M74 46l6-8 6 12 6-12 6 8', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M108 66l8 10-6 2 10 10', ...SW(3) }, 'orange', { stroke: true }),
    ...person(126, 136, 'blue'),
    s('path', { d: 'M120 86q6-5 12 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  intervenir: [
    ...person(26, 136, 'red', { w: 24 }),
    ...person(134, 136, 'blue', { w: 24 }),
    s('circle', { cx: 80, cy: 74, r: 12 }, 'skin'),
    s('rect', { x: 66, y: 88, width: 28, height: 48, rx: 9 }, 'white'),
    s('path', { d: 'M73 90v44M80 88v48M87 90v44', ...SW(3) }, 'black', { stroke: true, accent: true }),
    s('rect', { x: 66, y: 88, width: 28, height: 48, rx: 9, ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 98L44 90M94 98l22-8', ...SW(6) }, 'skin', { stroke: true })
  ],
  latinoamericano: [
    backdrop('sky'),
    s('path', { d: 'M22 22q20 0 34 8l6 16q4 10 14 14l8 10q6 4 14 4l6 10 22 8q18 6 14 22l-14 16q-6 16-20 22l-8 18q-6 10-8 0l-4-18q-4-18-14-30l-6-14q-8-8-4-18l6-6-8-6q-12-4-16-12l-14-14q-10-10-12-30z' }, 'green', { accent: true }),
    s('circle', { cx: 124, cy: 34, r: 11 }, 'yellow')
  ],
  lazo: [
    s('path', { d: 'M76 74l-22 50 14-4 8 12 8-50zM84 74l22 50-14-4-8 12-8-50z' }, 'red'),
    s('path', { d: 'M80 70q-40-36-56-14t56 14zM80 70q40-36 56-14t-56 14z' }, 'red', { accent: true }),
    s('path', { d: 'M76 66q-26-16-38-6M84 66q26-16 38-6', ...SW(3) }, 'pink', { stroke: true }),
    s('circle', { cx: 80, cy: 70, r: 10 }, 'pink')
  ],
  modalidad: [
    s('rect', { x: 14, y: 58, width: 132, height: 44, rx: 22 }, 'gray'),
    s('rect', { x: 58, y: 62, width: 44, height: 36, rx: 18 }, 'blue', { accent: true }),
    s('rect', { x: 24, y: 68, width: 26, height: 18, rx: 2 }, 'dark'),
    s('path', { d: 'M37 86v6M30 92h14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[80, 72]], 6) + busts([80], 94, 18, 14) }, 'white'),
    s('path', { d: 'M112 92V76l11-9 11 9v16z' }, 'dark')
  ],
  monasterio: [
    s('path', { d: 'M14 146q20-50 66-50t66 50z' }, 'green'),
    s('rect', { x: 106, y: 40, width: 20, height: 72 }, 'tan'),
    s('path', { d: 'M102 42l14-16 14 16z' }, 'red'),
    s('path', { d: 'M112 64v-6a4 4 0 0 1 8 0v6z' }, 'dark'),
    s('rect', { x: 30, y: 76, width: 76, height: 36 }, 'tan'),
    s('path', { d: 'M26 78h84l-6-10H32z' }, 'red', { accent: true }),
    s('path', { d: 'M38 112v-14a6 6 0 0 1 12 0v14zM56 112v-14a6 6 0 0 1 12 0v14zM74 112v-14a6 6 0 0 1 12 0v14zM92 112v-14a5 5 0 0 1 10 0v14z' }, 'dark')
  ],
  opinar: [
    ...person(36, 136, 'purple', { accent: true }),
    s('path', { d: bubble(58, 18, 86, 56) }, 'white'),
    s('path', { d: bubble(58, 18, 86, 56), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M72 46l7 7 13-14', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M110 38l14 14M124 38l-14 14', ...SW(5) }, 'red', { stroke: true })
  ],
  orquesta: [
    s('path', { d: 'M28 136V100M132 136V100', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M16 98h24l-4-16H20zM120 98h24l-4-16h-16z' }, 'dark'),
    s('rect', { x: 58, y: 118, width: 44, height: 18 }, 'brown'),
    ...person(80, 118, 'black', { h: 40, w: 28, r: 11 }),
    s('path', { d: 'M92 86l14-20M68 86L56 70', ...SW(5) }, 'skin', { stroke: true }),
    ...note(40, 52, 'purple'),
    ...note(120, 38, 'blue')
  ],
  papi: [
    ground(),
    ...person(58, 136, 'blue', { h: 54, w: 34, r: 14 }),
    ...person(110, 136, 'orange', { h: 28, w: 20, r: 9, accent: true }),
    s('path', { d: 'M75 110l25 4', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: heart(88, 40, 10) }, 'pink')
  ],
  pedido: [
    s('path', { d: 'M30 76l16-16h70l-16 16z' }, 'cream'),
    s('path', { d: 'M100 76l16-16v60l-16 16z' }, 'brown'),
    s('rect', { x: 30, y: 76, width: 70, height: 60 }, 'tan', { accent: true }),
    s('path', { d: 'M60 76v20M38 68h70', ...SW(5) }, 'brown', { stroke: true }),
    ...paper(98, 16, 44, 58),
    s('path', { d: 'M106 32l3 3 6-6M106 46l3 3 6-6M106 60l3 3 6-6', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M120 32h14M120 46h14M120 60h14', ...SW(3) }, 'gray', { stroke: true })
  ],
  'políticamente': [
    s('rect', { x: 64, y: 22, width: 32, height: 46 }, 'white'),
    s('rect', { x: 64, y: 22, width: 32, height: 46, ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 44l6 6 12-12', ...SW(4) }, 'green', { stroke: true }),
    s('rect', { x: 34, y: 70, width: 92, height: 66, rx: 4 }, 'navy', { accent: true }),
    s('rect', { x: 56, y: 66, width: 48, height: 8, rx: 3 }, 'dark'),
    s('path', { d: star(80, 104, 12) }, 'white')
  ],
  preferencia: [
    s('path', { d: 'M24 96l12 40 12-40zM68 96l12 40 12-40zM112 96l12 40 12-40z' }, 'tan'),
    s('circle', { cx: 36, cy: 88, r: 14 }, 'pink'),
    s('circle', { cx: 80, cy: 86, r: 16 }, 'yellow'),
    s('circle', { cx: 124, cy: 88, r: 14 }, 'mint'),
    s('path', { d: heart(80, 44, 14) }, 'red', { accent: true })
  ],
  rata: [
    s('path', { d: 'M44 108q-28 4-24 28', ...SW(4) }, 'pink', { stroke: true }),
    s('ellipse', { cx: 76, cy: 100, rx: 38, ry: 24 }, 'gray', { accent: true }),
    s('path', { d: 'M100 84q34 6 42 20q-16 12-40 6z' }, 'gray'),
    s('circle', { cx: 106, cy: 80, r: 10 }, 'pink'),
    s('path', { d: dots([[122, 92]], 3) }, 'dark'),
    s('path', { d: dots([[142, 104]], 4) + ells([[60, 124, 7, 4], [92, 124, 7, 4]]) }, 'pink')
  ],
  recompensa: [
    s('path', { d: 'M58 52q-30 30-30 56q0 30 52 30t52-30q0-26-30-56z' }, 'tan', { accent: true }),
    s('path', { d: 'M62 50l-8-20h52l-8 20z' }, 'tan'),
    s('path', { d: 'M58 52h44', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 102, r: 18 }, 'yellow'),
    s('path', { d: ring(80, 102, 12), ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: sparkle(28, 40, 10) + sparkle(132, 46, 8) + sparkle(134, 126, 6) }, 'yellow')
  ],
  'rehabilitación': [
    ground(),
    s('path', { d: 'M18 96h124M24 96v40M136 96v40', ...SW(5) }, 'gray', { stroke: true }),
    ...person(80, 136, 'blue', { h: 46, accent: true }),
    s('path', { d: 'M66 100L44 96M94 100l22-4', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M28 64l6 6 10-12M116 64l6 6 10-12', ...SW(4) }, 'green', { stroke: true })
  ],
  rollo: [
    s('path', { d: 'M48 98h66l26 38H74z' }, 'cream'),
    s('path', { d: 'M48 98h66l26 38H74z', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 46, y: 42, width: 70, height: 56 }, 'cream', { accent: true }),
    s('path', { d: 'M46 42h70M46 98h70', ...SW(2) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 46, cy: 70, rx: 14, ry: 28 }, 'tan'),
    s('path', { d: 'M46 70m-3 0a3 6 0 0 1 6 0a6 12 0 0 1-12 0a9 18 0 0 1 18 0', ...SW(2) }, 'brown', { stroke: true })
  ],
  romance: [
    s('path', { d: 'M80 74q-6 36 4 72', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(82, 110, 200, 30, 9) + leaflet(82, 124, -20, 28, 9) }, 'green'),
    s('circle', { cx: 80, cy: 52, r: 24 }, 'red', { accent: true }),
    s('path', { d: 'M80 52m-6 0a6 6 0 0 1 12 0a10 10 0 0 1-20 0a14 14 0 0 1 28 0', ...SW(3) }, 'pink', { stroke: true }),
    s('path', { d: heart(32, 40, 9) + heart(130, 64, 11) + heart(120, 120, 7) }, 'pink')
  ],
  ruina: [
    ground(),
    s('rect', { x: 18, y: 126, width: 124, height: 10 }, 'tan'),
    s('path', { d: 'M28 126V70l6-6 4 6 6-4v60zM70 126V44h18v82zM110 126V94l6-4 4 6 6-6v36z' }, 'tan', { accent: true }),
    s('rect', { x: 64, y: 36, width: 30, height: 8 }, 'tan'),
    s('path', { d: 'M34 70v52M79 44v78M116 96v26', ...SW(2) }, 'brown', { stroke: true }),
    s('rect', { x: 90, y: 112, width: 28, height: 12, rx: 2, transform: 'rotate(-12 104 118)' }, 'gray'),
    s('path', { d: ells([[54, 122, 6, 4], [136, 122, 5, 4]]) }, 'gray')
  ],
  set: [
    s('rect', { x: 16, y: 40, width: 128, height: 88, rx: 8 }, 'navy', { accent: true }),
    s('circle', { cx: 52, cy: 84, r: 28 }, 'white'),
    s('path', { d: ring(52, 84, 18), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 56v58M90 56v12q6 6 12 0V56M132 70v44', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 114V56q8 6 8 24h-4v34z' }, 'gray'),
    s('ellipse', { cx: 132, cy: 62, rx: 6, ry: 9 }, 'gray')
  ],
  sospechoso: [
    backdrop('sky'),
    s('path', { d: 'M14 40h132M14 60h132M14 80h132M14 100h132M14 120h132', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: busts([80], 146, 64, 50) + dots([[80, 70]], 20) }, 'dark'),
    s('rect', { x: 54, y: 110, width: 52, height: 24, rx: 2 }, 'orange', { accent: true })
  ],
  'sucesión': [
    ground(),
    s('rect', { x: 20, y: 76, width: 14, height: 60, rx: 2, transform: 'rotate(55 34 136)' }, 'dark'),
    s('rect', { x: 46, y: 76, width: 14, height: 60, rx: 2, transform: 'rotate(38 60 136)' }, 'dark'),
    s('rect', { x: 74, y: 76, width: 14, height: 60, rx: 2, transform: 'rotate(20 88 136)' }, 'dark'),
    s('rect', { x: 106, y: 76, width: 14, height: 60, rx: 2 }, 'red', { accent: true }),
    s('path', { d: 'M40 56q20-20 44-10M94 56q8-6 18 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  sustancia: [
    s('path', { d: 'M38 74h20v40a10 10 0 0 1-20 0z' }, 'green'),
    s('path', { d: 'M70 52h20v62a10 10 0 0 1-20 0z' }, 'purple', { accent: true }),
    s('path', { d: 'M102 88h20v26a10 10 0 0 1-20 0z' }, 'orange'),
    s('path', { d: 'M38 26v88a10 10 0 0 0 20 0V26M70 26v88a10 10 0 0 0 20 0V26M102 26v88a10 10 0 0 0 20 0V26', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 22, y: 96, width: 116, height: 12, rx: 2 }, 'brown'),
    s('path', { d: 'M30 108v30M130 108v30', ...SW(5) }, 'brown', { stroke: true })
  ],
  tramo: [
    backdrop('mint'),
    s('path', { d: 'M66 14h28l48 132H18z' }, 'gray'),
    s('path', { d: 'M49.3 60h61.4l13.1 36H36.2z' }, 'orange', { accent: true }),
    s('path', { d: 'M80 18v124', ...DASH(3, '8 8') }, 'white', { stroke: true }),
    s('path', { d: 'M114 60h10M128 96h12', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: dots([[124, 60], [140, 96]], 5) }, 'red')
  ],
  trasero: [
    ground(),
    s('path', { d: 'M28 100l18-30h56l22 30z' }, 'sky'),
    s('path', { d: 'M76 70v30', ...SW(4) }, 'blue', { stroke: true }),
    s('rect', { x: 16, y: 98, width: 128, height: 26, rx: 8 }, 'blue'),
    s('path', { d: 'M78 74h22l18 26H78z' }, 'orange', { accent: true }),
    s('path', { d: dots([[44, 124], [116, 124]], 12) }, 'dark'),
    s('path', { d: 'M96 24v30M86 44l10 10 10-10', ...SW(5) }, 'red', { stroke: true })
  ],
  agujero: [
    s('path', { d: 'M18 30q31-10 62 0t62 0v100q-31 10-62 0t-62 0z' }, 'sky'),
    s('path', { d: ells([[76, 82, 24, 18]]) }, 'dark', { accent: true }),
    s('path', { d: ells([[76, 82, 28, 22]]), ...DASH(3, '4 4') }, 'navy', { stroke: true }),
    s('path', { d: 'M108 36l26 26', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M114 42q-14 20 -2 38', ...SW(2) }, 'red', { stroke: true })
  ],
  aparente: [
    s('rect', { x: 14, y: 14, width: 132, height: 58, rx: 10 }, 'sky'),
    s('rect', { x: 14, y: 70, width: 132, height: 76, rx: 10 }, 'navy'),
    s('path', { d: 'M58 72l14-34 10 10 10-18 14 42z' }, 'white', { accent: true }),
    s('path', { d: 'M58 72l-24 36 22 30h50l26-36-26-30z' }, 'sky', { flatOnly: false }),
    s('path', { d: 'M14 72h132', ...SW(3) }, 'blue', { stroke: true })
  ],
  barro: [
    s('path', { d: 'M20 118q4-20 40-20q20-10 50-2q34 4 30 24q-6 18-56 18q-62 0-64-20z' }, 'brown', { accent: true }),
    s('path', { d: ells([[56, 116, 10, 4], [104, 124, 8, 3]]) }, 'tan'),
    s('path', { d: 'M74 30h26v54h20q10 0 10 10v8H70z' }, 'yellow'),
    s('path', { d: 'M70 102h60v6H70z' }, 'dark'),
    s('path', { d: drop(52, 84, 4) + drop(132, 80, 3) }, 'brown')
  ],
  bici: [
    s('path', { d: ring(40, 112, 24) + ring(120, 112, 24), ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 112l22-36h36l22 36M62 76l20 36H40M82 112l16-36', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M96 70l4-12h10', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 52, y: 38, width: 24, height: 34, rx: 8, transform: 'rotate(20 64 72)' }, 'green'),
    s('circle', { cx: 80, cy: 30, r: 11 }, 'skin'),
    s('path', { d: 'M74 50l26 10M64 72l14 26', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M14 70h12M16 84h10', ...SW(3) }, 'gray', { stroke: true })
  ],
};
