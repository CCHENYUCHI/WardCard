// Illustration specs for common words still undrawn in batches 0025, 0026 and 0027 (see server/scripts/lexicon/art.js)
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
  avanzado: [
    ground(),
    s('rect', { x: 24, y: 112, width: 20, height: 24, rx: 3 }, 'green'),
    s('rect', { x: 52, y: 92, width: 20, height: 44, rx: 3 }, 'green'),
    s('rect', { x: 80, y: 72, width: 20, height: 64, rx: 3 }, 'green'),
    s('rect', { x: 108, y: 50, width: 20, height: 86, rx: 3 }, 'orange', { accent: true }),
    s('path', { d: star(118, 30, 14) }, 'yellow'),
    arrow('M30 96l60-50M76 46h14v14', 'navy', 5)
  ],
  abarcar: [
    s('circle', { cx: 80, cy: 32, r: 14 }, 'skin'),
    s('rect', { x: 60, y: 48, width: 40, height: 92, rx: 12 }, 'blue'),
    s('rect', { x: 44, y: 102, width: 36, height: 32, rx: 3 }, 'tan'),
    s('circle', { cx: 100, cy: 114, r: 18 }, 'red', { accent: true }),
    s('rect', { x: 60, y: 72, width: 40, height: 28, rx: 3 }, 'green'),
    s('path', { d: 'M62 58Q24 88 40 134h22M98 58q38 30 22 76h-22', ...SW(10) }, 'skin', { stroke: true })
  ],
  camioneta: [
    ground(134),
    s('path', { d: 'M20 90h52V64h30l14 26h22a4 4 0 0 1 4 4v26H20z' }, 'red', { accent: true }),
    s('path', { d: 'M80 70h18l11 20H80z' }, 'sky'),
    s('path', { d: 'M20 90h52', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[44, 120], [114, 120]], 13) }, 'dark'),
    s('path', { d: dots([[44, 120], [114, 120]], 5) }, 'gray'),
    s('rect', { x: 132, y: 96, width: 8, height: 7, rx: 2 }, 'yellow')
  ],
  cerebral: [
    s('path', { d: 'M38 96q-16-8-12-28q4-16 18-20q4-18 24-18q12-8 26-2q18-4 28 12q16 6 14 26q6 18-8 28q-4 16-22 16H54q-16 0-16-14z' }, 'pink', { accent: true }),
    s('path', { d: 'M80 32v76M52 56q12 4 8 18M108 54q-12 6-6 18M46 88q14-8 20 4M114 88q-14-8-20 4', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M74 110h14l-2 26h-10z' }, 'pink'),
    s('path', { d: sparkle(136, 24, 12) + sparkle(22, 30, 8) }, 'yellow')
  ],
  coco: [
    ground(),
    s('circle', { cx: 60, cy: 96, r: 38 }, 'brown', { accent: true }),
    s('path', { d: dots([[48, 82], [72, 82], [60, 102]], 6) }, 'dark'),
    s('path', { d: 'M96 106h48a24 24 0 0 1-48 0z' }, 'brown'),
    s('ellipse', { cx: 120, cy: 106, rx: 21, ry: 6 }, 'white'),
    s('path', { d: 'M96 106h48', ...SW(3) }, 'dark', { stroke: true })
  ],
  'conspiración': [
    backdrop('navy'),
    s('path', { d: busts([42, 80, 118], 146, 36, 46) }, 'purple'),
    s('path', { d: dots([[42, 92], [80, 84], [118, 92]], 16) }, 'purple'),
    s('path', { d: dots([[42, 94], [80, 86], [118, 94]], 10) }, 'dark'),
    s('path', { d: dots([[38, 93], [46, 93], [76, 85], [84, 85], [114, 93], [122, 93]], 2.5) }, 'yellow'),
    s('rect', { x: 72, y: 120, width: 16, height: 26, rx: 2 }, 'cream'),
    s('path', { d: drop(80, 112, 6) }, 'orange', { accent: true })
  ],
  coordinador: [
    s('path', { d: 'M80 80L34 34M80 80L126 34M80 80L34 126M80 80L126 126', ...DASH(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[34, 34], [126, 34], [34, 126], [126, 126]], 18) }, 'sky'),
    s('path', { d: dots([[34, 28], [126, 28], [34, 120], [126, 120]], 6) + busts([34, 126], 46, 16, 12) + busts([34, 126], 138, 16, 12) }, 'navy'),
    s('circle', { cx: 80, cy: 80, r: 28 }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 72, r: 9 }, 'skin'),
    s('path', { d: busts([80], 100, 26, 16) }, 'white')
  ],
  corregir: [
    ...paper(26, 18, 88, 120),
    s('path', { d: 'M40 40h60M40 62h60M40 84h44', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: ells([[70, 62, 34, 11]]) + 'M42 110l10 10 22-24', ...SW(4) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M140 34l-42 62', ...SW(10) }, 'red', { stroke: true }),
    s('path', { d: 'M96 92l-6 14 11-8z' }, 'dark')
  ],
  curva: [
    backdrop('mint'),
    s('path', { d: 'M40 146V104q0-36 40-38t40-38V14', ...SW(30, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 146V104q0-36 40-38t40-38V14', ...DASH(3, '8 8') }, 'white', { stroke: true }),
    s('path', { d: 'M118 82l24 24-24 24-24-24z' }, 'yellow', { accent: true }),
    s('path', { d: 'M112 118v-10q0-8 8-8h6M122 94l6 6-6 6', ...SW(4) }, 'dark', { stroke: true })
  ],
  delincuencia: [
    ground(),
    ...person(52, 136, 'navy'),
    s('path', { d: 'M38 96h28M38 110h28M38 124h28', ...SW(4, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('rect', { x: 40, y: 72, width: 24, height: 8, rx: 3 }, 'black'),
    s('path', { d: 'M86 136q-10 0-10-14q0-22 18-28l-4-8h16l-4 8q18 6 18 28q0 14-10 14z' }, 'tan'),
    s('path', { d: 'M110 44v-8a10 10 0 0 1 10-10v18z' }, 'red', { accent: true }),
    s('path', { d: 'M120 26a10 10 0 0 1 10 10v8h-10z' }, 'blue'),
    s('rect', { x: 104, y: 44, width: 32, height: 6, rx: 2 }, 'dark'),
    s('path', { d: 'M102 30l-8-6M138 30l8-6M100 40h-8M140 40h8', ...SW(3) }, 'orange', { stroke: true })
  ],
  deriva: [
    backdrop('sky'),
    s('path', { d: 'M14 104q12-8 24 0t24 0 24 0 24 0 24 0 12 0V146H14z' }, 'blue'),
    s('path', { d: 'M76 100h48l-8 14H84z', transform: 'rotate(-12 100 106)' }, 'brown', { accent: true }),
    s('path', { d: 'M30 48q20-24 40-4t-6 30q-20 4-14-14', ...DASH(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M28 128l26-8', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M96 28q10-6 20 0t20 0M100 42q10-6 20 0t16 0', ...SW(3) }, 'white', { stroke: true })
  ],
  desnudo: [
    s('ellipse', { cx: 80, cy: 138, rx: 58, ry: 8 }, 'sky'),
    s('ellipse', { cx: 80, cy: 112, rx: 28, ry: 26 }, 'skin', { accent: true }),
    s('path', { d: 'M56 98q-18 4-22-10M104 98q18 4 22-10M66 134v4M94 134v4', ...SW(10) }, 'skin', { stroke: true }),
    s('circle', { cx: 80, cy: 60, r: 26 }, 'skin'),
    s('path', { d: 'M66 54l7 4M94 54l-7 4', ...SW(3) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 80, cy: 72, rx: 7, ry: 6 }, 'red'),
    s('path', { d: drop(62, 68, 3) + drop(98, 68, 3) }, 'blue')
  ],
  dividir: [
    s('path', { d: 'M72 40a40 40 0 0 0 0 80z' }, 'orange', { accent: true }),
    s('path', { d: 'M88 40a40 40 0 0 1 0 80z' }, 'orange'),
    s('path', { d: 'M72 46a34 34 0 0 0 0 68zM88 46a34 34 0 0 1 0 68z' }, 'yellow'),
    s('path', { d: 'M80 18v124', ...DASH(3) }, 'gray', { stroke: true }),
    arrow('M60 140H28m8-8-8 8 8 8M100 140h32m-8-8 8 8-8 8', 'navy', 4)
  ],
  emitir: [
    ground(),
    s('path', { d: 'M80 52L58 136M80 52l22 84M66 106h28M72 82h16', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 44, r: 9 }, 'red', { accent: true }),
    s('path', { d: 'M62 28a24 24 0 0 0 0 32M98 28a24 24 0 0 1 0 32M46 16a42 42 0 0 0 0 56M114 16a42 42 0 0 1 0 56', ...SW(5) }, 'orange', { stroke: true })
  ],
  ende: [
    s('circle', { cx: 40, cy: 50, r: 18 }, 'yellow'),
    s('path', { d: rays(40, 50, 24, 32, 8), ...SW(4) }, 'orange', { stroke: true }),
    arrow('M66 80h26M84 72l8 8-8 8', 'navy', 5),
    s('path', { d: 'M104 92l14 44 14-44z' }, 'tan'),
    s('path', { d: 'M100 92a18 18 0 0 1 36 0q0 6-6 4q-4 10-8 0q-6 8-10 0q-6 6-12-4z' }, 'pink', { accent: true }),
    s('path', { d: drop(104, 110, 4) + drop(136, 116, 3) }, 'pink')
  ],
  enhorabuena: [
    s('path', { d: 'M24 140l28-74 46 46z' }, 'orange', { accent: true }),
    s('path', { d: 'M52 66l46 46', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[100, 42], [126, 72], [82, 28], [138, 106]], 5) }, 'red'),
    s('path', { d: 'M112 20l6 10M64 34l-2 12M118 52l12-4M142 80l-4 12', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M78 88q18-30 52-34M90 100q24-10 34 6', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: star(132, 30, 10) + star(106, 128, 8) }, 'yellow')
  ],
  establecido: [
    s('path', { d: 'M24 136h112v10H24zM34 124h92v12H34z' }, 'gray'),
    s('path', { d: 'M46 50h68v74H46z' }, 'cream'),
    s('path', { d: 'M58 56v62M72 56v62M88 56v62M102 56v62', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M36 50l44-30 44 30z' }, 'brown', { accent: true }),
    s('rect', { x: 40, y: 50, width: 80, height: 8 }, 'tan')
  ],
  exitoso: [
    ground(),
    s('path', { d: rects([[24, 108, 20, 28], [52, 92, 20, 44], [80, 76, 20, 60]]) }, 'green'),
    s('rect', { x: 108, y: 94, width: 28, height: 42, rx: 2 }, 'navy'),
    s('path', { d: 'M108 34h28v12q0 20-14 22q-14-2-14-22z' }, 'yellow', { accent: true }),
    s('path', { d: 'M108 40h-6q0 14 10 16M136 40h6q0 14-10 16M122 68v14M112 88h20', ...SW(4) }, 'orange', { stroke: true }),
    arrow('M26 92l56-44M70 46h14v14', 'red', 5)
  ],
  'exploración': [
    backdrop('navy'),
    s('path', { d: 'M14 112q30-14 60-4t72-6V146H14z' }, 'orange'),
    s('path', { d: dots([[30, 30], [126, 24], [90, 40], [140, 64]], 2) }, 'white'),
    s('rect', { x: 52, y: 80, width: 52, height: 20, rx: 4 }, 'gray', { accent: true }),
    s('path', { d: 'M92 80V62M84 62h16', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[60, 108], [78, 108], [96, 108]], 8) }, 'dark'),
    s('rect', { x: 58, y: 70, width: 24, height: 10, rx: 2 }, 'sky')
  ],
  explorar: [
    ground(),
    ...person(74, 136, 'green', { w: 34, h: 50, r: 14 }),
    s('path', { d: 'M54 66h40l-4-10H58z' }, 'tan'),
    s('rect', { x: 40, y: 92, width: 18, height: 34, rx: 6 }, 'brown'),
    s('path', { d: 'M86 76h22', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: rects([[106, 66, 10, 16], [118, 66, 10, 16]]) }, 'dark', { accent: true }),
    s('path', { d: 'M132 74l10-4M132 80l10 4', ...SW(3) }, 'orange', { stroke: true })
  ],
  filtro: [
    s('path', { d: 'M34 22h92l-36 52v14H70V74z' }, 'gray'),
    s('path', { d: 'M40 28h80l-12 18H52z' }, 'brown'),
    s('path', { d: dots([[60, 36], [80, 34], [98, 38]], 4) }, 'tan'),
    s('path', { d: 'M56 56h48', ...DASH(3, '4 4') }, 'white', { stroke: true }),
    s('path', { d: drop(80, 104, 5) }, 'blue', { accent: true }),
    s('path', { d: 'M56 116h48l-4 30H60z' }, 'sky'),
    s('path', { d: 'M59 128h42l-2 18H61z' }, 'blue')
  ],
  financiar: [
    ground(),
    s('path', { d: 'M24 136q-6-34 18-46l-6-10h24l-6 10q24 12 18 46z' }, 'tan'),
    s('path', { d: dots([[48, 116]], 10) }, 'yellow', { accent: true }),
    arrow('M76 104h18M88 96l8 8-8 8', 'green', 5),
    s('rect', { x: 102, y: 76, width: 40, height: 60 }, 'blue'),
    s('path', { d: 'M98 78l24-22 24 22z' }, 'red'),
    s('path', { d: rects([[108, 86, 10, 10], [126, 86, 10, 10], [116, 114, 12, 22]]) }, 'sky'),
    s('path', { d: dots([[110, 40], [124, 30]], 5) }, 'yellow')
  ],
  'fotógrafo': [
    ...person(68, 146, 'green', { w: 48, h: 56, r: 20 }),
    s('rect', { x: 62, y: 56, width: 46, height: 30, rx: 5 }, 'dark'),
    s('circle', { cx: 92, cy: 71, r: 10 }, 'sky', { accent: true }),
    s('rect', { x: 66, y: 50, width: 12, height: 8, rx: 2 }, 'dark'),
    s('path', { d: 'M84 116l14-24', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: burst(130, 38, 16, 7, 8) }, 'yellow')
  ],
  funeral: [
    ground(),
    ...person(30, 136, 'black', { w: 24, h: 50, r: 11 }),
    ...person(130, 136, 'black', { w: 24, h: 50, r: 11 }),
    s('path', { d: 'M54 124v12M106 124v12', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 102h64l8 11-8 11H48l-8-11z' }, 'brown', { accent: true }),
    s('path', { d: dots([[66, 98], [80, 95], [94, 98]], 7) }, 'pink'),
    s('path', { d: dots([[73, 92], [87, 92]], 5) }, 'white')
  ],
  'gobernación': [
    ground(),
    s('rect', { x: 30, y: 88, width: 100, height: 48 }, 'cream'),
    s('path', { d: 'M24 80h112v10H24z' }, 'gray'),
    s('path', { d: 'M50 80a30 30 0 0 1 60 0z' }, 'blue', { accent: true }),
    s('rect', { x: 75, y: 40, width: 10, height: 12 }, 'gray'),
    s('path', { d: 'M80 40V16M44 96v36M60 96v36M100 96v36M116 96v36', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 16h22l-5 6 5 6H80z' }, 'red'),
    s('path', { d: 'M70 136v-24h20v24z' }, 'brown')
  ],
  gubernamental: [
    ...paper(28, 14, 88, 120),
    s('path', { d: 'M56 40l16-12 16 12zM56 42h32v4H56zM56 62h32v4H56z' }, 'navy'),
    s('path', { d: 'M61 47v14M72 47v14M83 47v14', ...SW(4, { 'stroke-linecap': 'butt' }) }, 'navy', { stroke: true }),
    s('path', { d: 'M42 84h60M42 98h60M42 112h36', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 128l-6 18 10-6 6 8 2-18zM124 128l6 18-10-6-6 8-2-18z' }, 'red'),
    s('circle', { cx: 116, cy: 120, r: 16 }, 'red', { accent: true }),
    s('path', { d: ring(116, 120, 10), ...SW(3) }, 'yellow', { stroke: true })
  ],
  guinea: [
    ground(),
    s('path', { d: ells([[40, 128, 24, 7], [40, 118, 24, 7], [40, 108, 24, 7]]) }, 'orange'),
    s('ellipse', { cx: 40, cy: 100, rx: 24, ry: 7 }, 'yellow'),
    s('circle', { cx: 102, cy: 78, r: 40 }, 'yellow', { accent: true }),
    s('path', { d: ring(102, 78, 33), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M84 92V70l9 8 9-14 9 14 9-8v22z' }, 'orange')
  ],
  horizonte: [
    backdrop('sky'),
    s('path', { d: 'M14 90h132v44a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'blue'),
    s('path', { d: 'M48 90a32 32 0 0 1 64 0z' }, 'orange', { accent: true }),
    s('path', { d: 'M14 90h132', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M58 104h44M68 116h24M74 128h12', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: birds([[36, 40], [126, 32]]), ...SW(3) }, 'dark', { stroke: true })
  ],
  incertidumbre: [
    backdrop('mint'),
    s('path', { d: 'M80 146V100L34 40M80 100l46-60', ...SW(22) }, 'tan', { stroke: true }),
    s('path', { d: 'M80 128V44', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M78 48H50l-10 8 10 8h28zM82 72h28l10 8-10 8H82z' }, 'orange', { accent: true }),
    s('circle', { cx: 112, cy: 116, r: 10 }, 'skin'),
    s('path', { d: busts([112], 146, 24, 20) }, 'blue'),
    s('path', { d: dots([[32, 100], [44, 92], [56, 100]], 3) }, 'navy')
  ],
  'infección': [
    s('path', { d: rays(66, 82, 34, 44, 10), ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: dots(around(66, 82, 46, 10), 5) }, 'green'),
    s('circle', { cx: 66, cy: 82, r: 34 }, 'green', { accent: true }),
    s('path', { d: dots([[54, 72], [78, 76], [62, 96]], 6) }, 'mint'),
    s('path', { d: rays(124, 36, 10, 18, 8) + rays(126, 124, 10, 18, 8), ...SW(4) }, 'purple', { stroke: true }),
    s('path', { d: dots([[124, 36], [126, 124]], 11) }, 'purple')
  ],
  injusticia: [
    ground(),
    s('path', { d: 'M80 50v86M60 136h40', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M32 66L128 34M32 66l-16 38M32 66l16 38M128 34l-16 38M128 34l16 38', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M12 104h40a20 9 0 0 1-40 0zM108 72h40a20 9 0 0 1-40 0z' }, 'gray'),
    s('path', { d: ells([[24, 98, 8, 4], [40, 98, 8, 4], [32, 92, 8, 4], [32, 86, 8, 4]]) }, 'yellow', { accent: true }),
    s('path', { d: heart(128, 60, 10) }, 'red'),
    s('circle', { cx: 80, cy: 50, r: 6 }, 'dark')
  ],
  inmenso: [
    backdrop('sky'),
    s('path', { d: 'M14 146L74 22l72 124z' }, 'gray'),
    s('path', { d: 'M62 46l12-24 14 28-8-4-6 6-6-8z' }, 'white'),
    s('path', { d: 'M14 136h132v10H14z' }, 'green'),
    s('circle', { cx: 124, cy: 122, r: 4 }, 'skin'),
    s('rect', { x: 120, y: 126, width: 8, height: 12, rx: 3 }, 'red', { accent: true })
  ],
  'inspección': [
    s('rect', { x: 26, y: 24, width: 72, height: 112, rx: 6 }, 'brown'),
    s('rect', { x: 34, y: 36, width: 56, height: 92, rx: 2 }, 'white'),
    s('rect', { x: 48, y: 18, width: 28, height: 12, rx: 3 }, 'gray'),
    s('path', { d: 'M40 56l5 5 9-10M40 80l5 5 9-10M40 104l5 5 9-10', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M62 56h20M62 80h20M62 104h20', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 108, cy: 96, r: 20 }, 'sky', { flatOnly: true }),
    s('path', { d: ring(108, 96, 22) + 'M124 112l18 18', ...SW(8) }, 'navy', { stroke: true, accent: true })
  ],
  inspirado: [
    ...person(80, 146, 'purple', { w: 46, h: 52, r: 20 }),
    s('path', { d: 'M18 44q14-16 28-4t14 12q8 4 8 12', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: star(112, 30, 16) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(140, 58, 8) + sparkle(84, 22, 6) }, 'orange'),
    s('path', { d: 'M72 76q8 6 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  invisible: [
    s('path', { d: ring(80, 64, 18), ...DASH(3) }, 'gray', { stroke: true }),
    s('rect', { x: 58, y: 88, width: 44, height: 54, rx: 14, ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 44h56v6H52zM64 44V20h32v24z' }, 'dark'),
    s('rect', { x: 64, y: 36, width: 32, height: 6 }, 'red', { accent: true }),
    s('path', { d: ring(71, 64, 7) + ring(89, 64, 7) + 'M78 64h4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(128, 92, 9) + sparkle(30, 112, 7) }, 'sky')
  ],
  juguete: [
    s('path', { d: dots([[56, 34], [104, 34]], 12) }, 'brown'),
    s('ellipse', { cx: 80, cy: 112, rx: 34, ry: 32 }, 'brown'),
    s('path', { d: ells([[48, 140, 14, 8], [112, 140, 14, 8], [46, 102, 10, 14], [114, 102, 10, 14]]) }, 'brown'),
    s('circle', { cx: 80, cy: 56, r: 28 }, 'brown', { accent: true }),
    s('path', { d: ells([[80, 66, 12, 9], [80, 114, 18, 20]]) }, 'tan'),
    s('path', { d: dots([[70, 50], [90, 50], [80, 62]], 3.5) }, 'dark'),
    s('path', { d: 'M66 84l14 6 14-6v12l-14-6-14 6z' }, 'red')
  ],
  junior: [
    ground(),
    ...person(54, 136, 'gray', { w: 36, h: 58, r: 15 }),
    s('path', { d: 'M54 80l-4 6 4 24 4-24z' }, 'navy'),
    ...person(110, 136, 'orange', { w: 26, h: 32, r: 11, accent: true }),
    s('path', { d: star(110, 64, 9) }, 'yellow')
  ],
  lente: [
    s('path', { d: 'M16 50h56l60 30M16 80h116M16 110h56l60-30', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M80 22q24 58 0 116q-24-58 0-116z' }, 'sky', { accent: true }),
    s('path', { d: 'M80 22q24 58 0 116q-24-58 0-116z', ...SW(3) }, 'navy', { stroke: true }),
    s('circle', { cx: 134, cy: 80, r: 6 }, 'red')
  ],
  masacre: [
    backdrop('navy'),
    s('circle', { cx: 116, cy: 46, r: 16 }, 'red', { accent: true }),
    s('path', { d: 'M14 104h132v30a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'dark'),
    s('path', { d: busts([32, 58, 84, 110, 134], 116, 14, 20) }, 'gray'),
    s('path', { d: busts([44, 70, 96, 122], 140, 18, 26) }, 'gray'),
    s('path', { d: 'M44 124v8M70 124v8M96 124v8M122 124v8', ...SW(3) }, 'dark', { stroke: true })
  ],
  metropolitano: [
    ground(140),
    s('path', { d: rects([[20, 40, 24, 72], [48, 22, 22, 90], [74, 54, 20, 58], [98, 30, 26, 82], [128, 58, 18, 54]]) }, 'navy'),
    s('path', { d: rects([[26, 50, 5, 6], [34, 64, 5, 6], [54, 32, 5, 6], [60, 48, 5, 6], [104, 40, 5, 6], [114, 56, 5, 6], [134, 68, 5, 6]]) }, 'yellow'),
    s('rect', { x: 16, y: 100, width: 128, height: 32, rx: 10 }, 'red', { accent: true }),
    s('path', { d: rects([[26, 106, 20, 12], [54, 106, 20, 12], [82, 106, 20, 12], [110, 106, 20, 12]]) }, 'sky'),
    s('path', { d: dots([[36, 134], [64, 134], [96, 134], [124, 134]], 5) }, 'dark')
  ],
  nativo: [
    s('rect', { x: 14, y: 70, width: 132, height: 76, rx: 12 }, 'brown'),
    s('path', { d: 'M14 70h132', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M80 72v44M80 86l-22 18M80 92l20 20M80 104l-14 24M80 110l12 20', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M80 70V30', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 50, -150, 34, 11) + leaflet(80, 40, -30, 34, 11) }, 'green', { accent: true }),
    s('circle', { cx: 128, cy: 32, r: 12 }, 'yellow')
  ],
  nelson: [
    ...person(80, 146, 'blue', { w: 50, h: 60, r: 22 }),
    s('path', { d: 'M58 98l44 26M102 98l-44 26', ...SW(11) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M46 50q-8 12 0 24M36 44q-12 18 0 36M114 50q8 12 0 24M124 44q12 18 0 36', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M72 74h16M70 54l6 3M90 54l-6 3', ...SW(3) }, 'dark', { stroke: true })
  ],
  perteneciente: [
    s('rect', { x: 18, y: 50, width: 98, height: 92, rx: 6 }, 'blue'),
    s('path', { d: 'M62 54v38M22 96h40', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M66 96h12a6 6 0 0 1 12 0h12v38H66z' }, 'white'),
    s('path', { d: 'M104 22h12a6 6 0 0 1 12 0h12v38h-36z' }, 'orange', { accent: true }),
    arrow('M112 68q-4 16-20 20M90 80l2 8 8-2', 'navy', 4)
  ],
  proveniente: [
    s('circle', { cx: 44, cy: 46, r: 28 }, 'sky'),
    s('path', { d: 'M24 38q12 2 18-6 10 2 12 12-8 10-18 4-10 2-12-10zM36 60q10-2 14 6-4 6-12 2z' }, 'green'),
    s('path', { d: 'M70 46q48-6 50 50', ...DASH(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M112 90l8 10 8-10', ...SW(4) }, 'orange', { stroke: true }),
    s('rect', { x: 92, y: 108, width: 54, height: 36, rx: 2 }, 'tan', { accent: true }),
    s('path', { d: 'M119 108v36M92 118h54', ...SW(3) }, 'brown', { stroke: true })
  ],
  reclamo: [
    s('rect', { x: 14, y: 110, width: 132, height: 36, rx: 4 }, 'brown'),
    ...person(58, 110, 'blue', { w: 40, h: 44, r: 16 }),
    s('path', { d: 'M74 78l14-28', ...SW(10) }, 'blue', { stroke: true }),
    s('circle', { cx: 90, cy: 44, r: 8 }, 'skin'),
    s('path', { d: burst(124, 40, 22, 13, 8) }, 'red', { accent: true }),
    s('path', { d: 'M48 42l8 4M68 42l-8 4M52 58q6-4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 102h36l-4 8H92z' }, 'white'),
    s('path', { d: 'M96 102h36l-4 8H92z', ...SW(2) }, 'gray', { stroke: true })
  ],
  'reparación': [
    s('path', { d: 'M14 50h132', ...SW(22, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('rect', { x: 66, y: 34, width: 28, height: 32, rx: 3 }, 'dark'),
    s('path', { d: drop(80, 80, 4) + drop(80, 96, 3) }, 'blue'),
    s('path', { d: 'M36 140l62-38', ...SW(11) }, 'orange', { stroke: true, accent: true }),
    s('circle', { cx: 106, cy: 97, r: 15 }, 'orange'),
    s('rect', { x: 108, y: 86, width: 12, height: 14, transform: 'rotate(-32 114 93)' }, 'white')
  ],
  robot: [
    s('path', { d: 'M80 18v12', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 16, r: 5 }, 'red'),
    s('path', { d: 'M44 88H28v24M116 88h16v24M64 124v18M96 124v18', ...SW(8) }, 'gray', { stroke: true }),
    s('rect', { x: 50, y: 30, width: 60, height: 42, rx: 8 }, 'gray'),
    s('path', { d: dots([[66, 48], [94, 48]], 7) }, 'sky'),
    s('rect', { x: 68, y: 60, width: 24, height: 5, rx: 2 }, 'dark'),
    s('rect', { x: 44, y: 76, width: 72, height: 48, rx: 8 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 100, r: 9 }, 'yellow')
  ],
  salio: [
    ...person(74, 142, 'brown', { w: 40, h: 56, r: 16 }),
    s('path', { d: 'M56 66q0-24 18-26q18 2 18 26z' }, 'gray'),
    s('path', { d: 'M74 64v12', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M114 142V58', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M114 60q20-8 24 10q-2 14-24 8z' }, 'gray'),
    s('circle', { cx: 56, cy: 108, r: 24 }, 'red', { accent: true }),
    s('circle', { cx: 56, cy: 108, r: 7 }, 'yellow')
  ],
  'satélite': [
    s('path', { d: 'M16 132q22-100 128-98', ...DASH(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 44, cy: 118, r: 30 }, 'blue'),
    s('path', { d: 'M24 104q10-6 18 0t14 6q-2 10-14 8t-18-14zM40 128q10-2 14 8-8 4-14-8z' }, 'green'),
    s('path', { d: rects([[72, 46, 26, 14], [122, 46, 24, 14]]) }, 'navy'),
    s('path', { d: 'M98 53h24M110 42v-10', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 100, y: 42, width: 20, height: 22, rx: 3 }, 'yellow', { accent: true }),
    s('circle', { cx: 110, cy: 30, r: 4 }, 'red')
  ],
  titulado: [
    ...person(80, 146, 'navy', { w: 52, h: 56, r: 20 }),
    s('path', { d: 'M62 52v10q18 8 36 0V52z' }, 'black'),
    s('path', { d: 'M44 48l36-16 36 16-36 16z' }, 'black'),
    s('path', { d: 'M114 48v20', ...SW(3) }, 'yellow', { stroke: true }),
    s('rect', { x: 62, y: 102, width: 52, height: 14, rx: 7, transform: 'rotate(-15 88 109)' }, 'cream'),
    s('rect', { x: 84, y: 102, width: 7, height: 14, transform: 'rotate(-15 88 109)' }, 'red', { accent: true })
  ],
  trigo: [
    s('path', { d: 'M80 146V86M80 146L62 92M80 146l18-54', ...SW(4) }, 'tan', { stroke: true }),
    ...[-20, 0, 20].map((r, i) => s('path', { d: [0, 1, 2, 3].map(k => leaflet(80, 52 + 11 * k, -125, 17, 5) + leaflet(80, 52 + 11 * k, -55, 17, 5)).join('') + leaflet(80, 50, -90, 18, 5), transform: `rotate(${r} 80 146)` }, 'yellow', i === 1 ? { accent: true } : {})),
    s('path', { d: 'M40 146h80', ...SW(4) }, 'brown', { stroke: true })
  ],
  uds: [
    s('path', { d: dots([[66, 62], [102, 56], [134, 62]], 12) }, 'skin'),
    s('path', { d: busts([66, 102, 134], 132, 26, 48) }, 'blue', { accent: true }),
    s('path', { d: 'M14 100h22v18H14z' }, 'orange'),
    s('path', { d: 'M36 100h6l20-4a3 3 0 0 1 0 7l-14 2v13H36z' }, 'skin'),
    s('path', { d: 'M50 134h96', ...SW(4) }, 'gray', { stroke: true })
  ],
  vanguardia: [
    ground(),
    s('path', { d: busts([28, 52], 136, 18, 40) + dots([[28, 88], [52, 88]], 9) }, 'gray'),
    ...person(96, 136, 'red', { accent: true }),
    s('path', { d: 'M116 136V22', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M104 104l12-8', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M116 24h28l-6 10 6 10h-28z' }, 'orange')
  ],
  vertical: [
    ground(),
    s('rect', { x: 34, y: 20, width: 22, height: 116, rx: 3 }, 'brown'),
    s('path', { d: 'M76 20h36M94 20v84', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 104h16l-8 18z' }, 'red', { accent: true }),
    arrow('M132 30v96M124 40l8-10 8 10M124 116l8 10 8-10', 'navy', 4)
  ],
  'agrupación': [
    s('path', { d: ring(80, 82, 64), ...DASH(4) }, 'purple', { stroke: true }),
    s('path', { d: dots([[60, 66], [100, 66]], 11) }, 'skin'),
    s('path', { d: busts([60, 100], 106, 28, 28) }, 'blue'),
    s('path', { d: dots([[42, 92], [80, 90], [118, 92]], 11) }, 'skin'),
    s('path', { d: busts([42, 80, 118], 132, 28, 30) }, 'orange', { accent: true })
  ],
  altar: [
    s('path', { d: 'M20 136h120v10H20zM30 126h100v10H30z' }, 'gray'),
    s('rect', { x: 36, y: 80, width: 88, height: 46 }, 'cream'),
    outline({ x: 36, y: 80, width: 88, height: 46 }),
    s('path', { d: 'M32 80h96v14H32z' }, 'red', { accent: true }),
    s('path', { d: rects([[42, 48, 10, 32], [108, 48, 10, 32]]) }, 'tan'),
    s('path', { d: drop(47, 40, 4) + drop(113, 40, 4) }, 'orange'),
    s('path', { d: 'M68 50h24q0 16-12 18q-12-2-12-18zM78 68h4v6h-4zM70 74h20v6H70z' }, 'yellow')
  ],
  'atracción': [
    s('path', { d: 'M76 40H52a28 28 0 0 0 0 56h24', ...SW(18, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M64 40h14M64 96h14', ...SW(18, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M88 52q6 0 10-4M88 84q6 0 10 4M90 68h10', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: dots([[116, 46], [132, 70], [114, 94]], 8) }, 'dark'),
    s('path', { d: 'M130 44h12M142 66h4M128 96h12', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 136q44-24 88 0', ...SW(5) }, 'blue', { stroke: true })
  ],
  bla: [
    s('path', { d: bubble(16, 18, 92, 54) }, 'sky'),
    s('path', { d: 'M28 46q6-10 12 0t12 0 12 0 12 0 12 0', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: bubble(50, 80, 94, 52), transform: 'translate(194 0) scale(-1 1)' }, 'yellow', { accent: true }),
    s('path', { d: 'M64 106q6-10 12 0t12 0 12 0 12 0 12 0', ...SW(4) }, 'dark', { stroke: true })
  ],
  borracho: [
    ground(),
    ...lean(80, 136, -12, 'blue', { w: 34, h: 52, r: 16 }),
    s('circle', { cx: 70, cy: 70, r: 4 }, 'red'),
    s('path', { d: spiral(48, 36) + spiral(78, 30), ...SW(3) }, 'purple', { stroke: true }),
    s('path', { d: 'M90 102l14 4', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M104 128v-24q0-6 5-8V84h6v12q5 2 5 8v24z' }, 'green', { accent: true })
  ],
  cagar: [
    s('path', { d: ells([[80, 124, 46, 14], [80, 104, 34, 12], [80, 86, 22, 10]]) }, 'brown', { accent: true }),
    s('path', { d: 'M74 78q4-12 14-14q-2 8 2 14z' }, 'brown'),
    s('path', { d: dots([[70, 104], [90, 104]], 6) }, 'white'),
    s('path', { d: dots([[71, 105], [91, 105]], 3) }, 'dark'),
    s('path', { d: 'M40 60q-6-8 0-16t0-16M120 60q-6-8 0-16t0-16', ...SW(4) }, 'green', { stroke: true })
  ],
  capitalista: [
    ...person(58, 142, 'dark', { w: 44, h: 58, r: 16 }),
    s('path', { d: 'M40 50h36v5H40zM46 50V24h24v26z' }, 'black'),
    s('rect', { x: 46, y: 42, width: 24, height: 5 }, 'red', { accent: true }),
    s('path', { d: 'M50 84h16l-8 16z' }, 'white'),
    s('path', { d: 'M90 142q-8-30 14-40l-6-8h22l-6 8q22 10 14 40z' }, 'tan'),
    s('circle', { cx: 109, cy: 122, r: 9 }, 'yellow'),
    s('path', { d: ells([[134, 138, 10, 4], [134, 131, 10, 4], [134, 124, 10, 4]]) }, 'yellow')
  ],
  coincidencia: [
    ground(),
    ...person(42, 136, 'green', { w: 30, h: 46, r: 14 }),
    ...person(118, 136, 'green', { w: 30, h: 46, r: 14 }),
    s('path', { d: 'M28 66h28l-6-18H34zM104 66h28l-6-18h-16z' }, 'red', { accent: true }),
    s('path', { d: dots([[42, 108], [118, 108]], 5) }, 'yellow'),
    s('path', { d: burst(80, 70, 16, 7, 8) }, 'yellow'),
    s('path', { d: 'M66 54l-6-8M94 54l6-8', ...SW(3) }, 'orange', { stroke: true })
  ],
  cotidiano: [
    s('path', { d: 'M90 60a26 26 0 0 1 52 0z' }, 'yellow'),
    s('path', { d: halfRays(116, 60, 32, 42, 5), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M24 60h56', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 92h14a12 12 0 0 1 0 24h-14', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M56 80h48v50a10 10 0 0 1-10 10H66a10 10 0 0 1-10-10z' }, 'red', { accent: true }),
    s('path', { d: 'M68 70q-6-8 0-14t0-14M88 70q-6-8 0-14t0-14', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 140v-30q0-12 13-12q13 0 13 12v30z' }, 'tan')
  ],
  'cuán': [
    s('circle', { cx: 80, cy: 82, r: 58 }, 'yellow', { accent: true }),
    s('path', { d: dots([[58, 68], [102, 68]], 12) }, 'white'),
    s('path', { d: dots([[58, 70], [102, 70]], 6) }, 'dark'),
    s('path', { d: 'M42 44q14-10 28-2M90 42q14-8 28 2', ...SW(4) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 80, cy: 114, rx: 13, ry: 17 }, 'dark'),
    s('path', { d: sparkle(138, 22, 9) + sparkle(22, 24, 7) }, 'orange')
  ],
  derivado: [
    backdrop('mint'),
    s('path', { d: 'M34 14q6 40 36 60t40 72', ...SW(20, { 'stroke-linecap': 'butt' }) }, 'blue', { stroke: true }),
    s('path', { d: 'M72 76q34-2 58-34', ...SW(10) }, 'sky', { stroke: true, accent: true }),
    s('path', { d: 'M120 40l12-2-2 12', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: 'M28 116l9-18 9 18zM120 92l8-16 8 16zM96 34l8-16 8 16z' }, 'green')
  ],
  diosa: [
    backdrop('sky'),
    s('path', { d: ring(80, 50, 26), ...SW(5) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M66 70h28l24 76H42z' }, 'cream'),
    s('path', { d: 'M62 52q0-22 18-22t18 22v34H90V58H70v28h-8z' }, 'brown'),
    s('circle', { cx: 80, cy: 54, r: 14 }, 'skin'),
    s('path', { d: 'M66 46q14-14 28 0', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: sparkle(28, 30, 8) + sparkle(130, 104, 7) + sparkle(130, 30, 6) }, 'white')
  ],
  doctorado: [
    ground(),
    s('rect', { x: 28, y: 96, width: 104, height: 40, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M28 108h104M28 124h104', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M40 76q0-28 40-30q40 2 40 30q-40 10-80 0z' }, 'black'),
    s('path', { d: 'M46 76h68v14q-34 8-68 0z' }, 'navy'),
    s('path', { d: 'M112 64q16 6 16 26', ...SW(3) }, 'yellow', { stroke: true }),
    s('circle', { cx: 128, cy: 92, r: 4 }, 'yellow')
  ],
  especialidad: [
    s('ellipse', { cx: 80, cy: 118, rx: 64, ry: 20 }, 'gray'),
    s('ellipse', { cx: 80, cy: 114, rx: 52, ry: 14 }, 'white'),
    s('path', { d: 'M48 114q0-24 32-26q32 2 32 26z' }, 'brown'),
    s('path', { d: leaflet(62, 96, -60, 18, 6) + leaflet(66, 96, -110, 16, 5) }, 'green'),
    s('path', { d: star(80, 46, 26) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(124, 54, 8) + sparkle(36, 56, 7) }, 'orange')
  ],
  exponer: [
    backdrop('cream'),
    s('rect', { x: 42, y: 24, width: 76, height: 60 }, 'brown'),
    s('rect', { x: 50, y: 32, width: 60, height: 44 }, 'sky'),
    s('path', { d: 'M50 76l18-22 14 14 10-10 18 18z' }, 'green'),
    s('circle', { cx: 98, cy: 44, r: 5 }, 'yellow'),
    s('path', { d: 'M28 140V102M132 140V102', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 104q52 24 104 0', ...SW(5) }, 'red', { stroke: true, accent: true })
  ],
  extenso: [
    s('rect', { x: 26, y: 46, width: 118, height: 52 }, 'cream'),
    s('rect', { x: 26, y: 46, width: 118, height: 52, ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M48 62h84M48 72h84M48 82h60', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 16, y: 38, width: 20, height: 68, rx: 10 }, 'brown'),
    arrow('M20 126h120M30 118l-10 8 10 8M130 118l10 8-10 8', 'orange', 5),
    s('path', { d: 'M26 106h118', ...SW(1) }, 'tan', { stroke: true, accent: true })
  ],
  'extracción': [
    s('path', { d: 'M14 124q66-14 132 0v22H14z' }, 'pink'),
    s('ellipse', { cx: 80, cy: 124, rx: 16, ry: 5 }, 'red'),
    s('path', { d: 'M56 56q-2-16 12-16q6 0 12 4q6-4 12-4q14 0 12 16q-2 14-6 28q-2 22-8 22q-4 0-6-14q-2-8-4 0q-2 14-6 14q-6 0-8-22q-4-14-6-28z' }, 'white'),
    s('path', { d: 'M56 56q-2-16 12-16q6 0 12 4q6-4 12-4q14 0 12 16q-2 14-6 28q-2 22-8 22q-4 0-6-14q-2-8-4 0q-2 14-6 14q-6 0-8-22q-4-14-6-28z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 52l-8-38M102 52l8-38', ...SW(8) }, 'dark', { stroke: true }),
    arrow('M134 104V62M126 70l8-8 8 8', 'orange', 5),
    s('path', { d: 'M54 52h52', ...SW(5) }, 'gray', { stroke: true, accent: true })
  ],
  fallecimiento: [
    ground(),
    s('rect', { x: 36, y: 72, width: 26, height: 64, rx: 3 }, 'cream'),
    outline({ x: 36, y: 72, width: 26, height: 64, rx: 3 }),
    s('path', { d: drop(49, 60, 6) }, 'orange', { accent: true }),
    s('path', { d: 'M110 136V96q0-22-18-26', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots(around(92, 80, 9, 5, 30), 7) }, 'purple'),
    s('circle', { cx: 92, cy: 80, r: 5 }, 'tan'),
    s('path', { d: 'M100 120q-8-10-18-8', ...SW(4) }, 'green', { stroke: true })
  ],
  'fantástico': [
    s('path', { d: 'M20 124a60 60 0 0 1 120 0', ...SW(9) }, 'red', { stroke: true }),
    s('path', { d: 'M30 124a50 50 0 0 1 100 0', ...SW(9) }, 'yellow', { stroke: true }),
    s('path', { d: 'M40 124a40 40 0 0 1 80 0', ...SW(9) }, 'sky', { stroke: true }),
    s('path', { d: 'M40 142l46-46', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: star(92, 88, 18) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(122, 40, 10) + sparkle(46, 36, 8) + sparkle(130, 98, 7) }, 'purple')
  ],
  flaco: [
    ground(),
    s('circle', { cx: 80, cy: 30, r: 12 }, 'skin'),
    s('path', { d: 'M75 50l-13 32M85 50l13 32', ...SW(4) }, 'skin', { stroke: true }),
    s('rect', { x: 74, y: 44, width: 12, height: 48, rx: 4 }, 'sky'),
    s('path', { d: 'M60 90h40l-4 46h-10l-6-34-6 34H64z' }, 'navy'),
    s('path', { d: 'M58 92h44', ...SW(4) }, 'brown', { stroke: true, accent: true }),
    arrow('M26 70h22M40 62l8 8-8 8M134 70h-22M120 62l-8 8 8 8', 'orange', 4)
  ],
  foco: [
    s('path', { d: halfRays(80, 60, 40, 48, 7), ...SW(4) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 60, r: 32 }, 'yellow', { accent: true }),
    s('rect', { x: 64, y: 80, width: 32, height: 26 }, 'yellow'),
    s('path', { d: 'M72 90V70l8 7 8-7v20', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M62 106h36v8H62zM64 118h32v8H64z' }, 'gray'),
    s('path', { d: 'M72 134h16', ...SW(7) }, 'dark', { stroke: true })
  ],
  franquicia: [
    ground(),
    s('path', { d: rects([[16, 80, 38, 56], [61, 80, 38, 56], [106, 80, 38, 56]]) }, 'cream'),
    s('path', { d: rects([[16, 80, 38, 56], [61, 80, 38, 56], [106, 80, 38, 56]]), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 70h42l-4 14H18zM59 70h42l-4 14H63zM104 70h42l-4 14h-34z' }, 'red', { accent: true }),
    s('path', { d: rects([[29, 106, 12, 30], [74, 106, 12, 30], [119, 106, 12, 30]]) }, 'brown'),
    s('path', { d: 'M35 62v8M80 62v8M125 62v8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[35, 52], [80, 52], [125, 52]], 10) }, 'yellow')
  ],
  gala: [
    s('path', { d: 'M40 146l14-24h52l14 24z' }, 'red'),
    s('path', { d: 'M70 30q0-14 10-14t10 14z' }, 'brown'),
    s('circle', { cx: 80, cy: 40, r: 13 }, 'skin'),
    s('path', { d: 'M71 56h18l4 14-4 6 28 62H43l28-62-4-6z' }, 'purple', { accent: true }),
    s('path', { d: 'M72 60q8 6 16 0', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: sparkle(30, 40, 10) + sparkle(130, 34, 9) + sparkle(126, 92, 7) + sparkle(34, 98, 7) }, 'yellow')
  ],
  historiador: [
    ...person(56, 146, 'brown', { w: 44, h: 56, r: 18 }),
    s('path', { d: ring(50, 70, 5) + ring(64, 70, 5) + 'M55 70h4', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 96q14-6 28 0q14-6 28 0v32q-14-6-28 0q-14-6-28 0z' }, 'cream'),
    s('path', { d: 'M56 96v32', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M104 72h32M104 138h32', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 76h24l-12 29 12 29h-24l12-29z' }, 'sky'),
    s('path', { d: 'M112 132h16l-8-14zM113 82h14l-7 12z' }, 'yellow', { accent: true })
  ],
  inocencia: [
    backdrop('mint'),
    s('path', { d: 'M62 112v24M76 114v24M94 114v24M106 112v24', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[60, 86], [76, 78], [96, 78], [112, 86], [102, 102], [80, 106], [60, 102]], 16) }, 'white'),
    s('ellipse', { cx: 40, cy: 80, rx: 14, ry: 17 }, 'cream'),
    s('path', { d: ells([[28, 70, 10, 5]]) }, 'tan'),
    s('circle', { cx: 38, cy: 78, r: 3 }, 'dark'),
    s('path', { d: heart(108, 38, 14) }, 'pink', { accent: true })
  ],
  'ironía': [
    s('path', { d: 'M54 66q-16-18 0-38q2 14 10 14q0-18 14-28q2 18 12 22q4-8 2-16q18 18 4 46z' }, 'orange'),
    s('path', { d: 'M64 66q-6-12 4-22q4 8 10 8q2-10 10-14q0 12 6 14q4 8-2 14z' }, 'yellow'),
    s('path', { d: 'M88 64h22l8 18', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 68, y: 52, width: 20, height: 14 }, 'dark'),
    s('rect', { x: 56, y: 64, width: 44, height: 78, rx: 14 }, 'red', { accent: true }),
    s('rect', { x: 62, y: 90, width: 32, height: 22, rx: 3 }, 'white')
  ],
  lastimar: [
    s('path', { d: 'M14 110L78 70L114 132h24', ...SW(22) }, 'skin', { stroke: true }),
    s('path', { d: 'M12 96l30-18 14 26-34 18z' }, 'blue'),
    s('rect', { x: 66, y: 62, width: 26, height: 14, rx: 5, transform: 'rotate(-32 79 69)' }, 'tan'),
    s('path', { d: dots([[76, 70], [83, 66]], 1.6) }, 'brown'),
    s('path', { d: 'M78 46V30M60 52l-10-10M96 52l10-10M108 66h14', ...SW(4) }, 'red', { stroke: true, accent: true })
  ],
  leal: [
    ground(),
    ...person(36, 136, 'blue', { w: 30, h: 60, r: 14 }),
    s('path', { d: 'M124 132q16-4 14-22', ...SW(5) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 104, cy: 114, rx: 22, ry: 24 }, 'tan'),
    s('circle', { cx: 90, cy: 80, r: 15 }, 'tan'),
    s('ellipse', { cx: 76, cy: 86, rx: 9, ry: 7 }, 'tan'),
    s('path', { d: ells([[100, 80, 6, 12]]) + dots([[70, 84], [88, 76]], 3) }, 'brown'),
    s('path', { d: 'M84 96h22', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: heart(74, 32, 14) }, 'pink')
  ],
  mascota: [
    ground(),
    s('path', { d: 'M48 130q-22-2-18-32', ...SW(6) }, 'orange', { stroke: true }),
    s('ellipse', { cx: 70, cy: 110, rx: 26, ry: 28 }, 'orange'),
    s('path', { d: 'M54 64l2-24 14 12zM86 64l-2-24-14 12z' }, 'orange'),
    s('circle', { cx: 70, cy: 68, r: 20 }, 'orange', { accent: true }),
    s('path', { d: dots([[62, 66], [78, 66]], 3) + 'M66 76h8l-4 4z' }, 'dark'),
    s('path', { d: 'M56 88h28', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M100 136l-6-16h44l-6 16z' }, 'blue')
  ],
  'movilización': [
    ground(),
    s('path', { d: 'M20 34h92V20l30 26-30 26V58H20z' }, 'orange', { accent: true }),
    s('path', { d: dots([[28, 94], [56, 90], [84, 94], [112, 90], [136, 94]], 10) }, 'skin'),
    s('path', { d: busts([28, 56, 84, 112, 136], 136, 22, 30) }, 'navy'),
    s('path', { d: 'M56 106l8-22M112 106l8-22', ...SW(4) }, 'skin', { stroke: true })
  ],
  parroquia: [
    ground(),
    s('path', { d: 'M14 136v-26l14-12 14 12v26zM118 136v-26l14-12 14 12v26z' }, 'tan'),
    s('rect', { x: 48, y: 86, width: 46, height: 50 }, 'gray'),
    s('path', { d: 'M44 88l27-22 27 22z' }, 'red', { accent: true }),
    s('rect', { x: 92, y: 46, width: 22, height: 90 }, 'gray'),
    s('path', { d: 'M88 48l15-28 15 28z' }, 'navy'),
    s('path', { d: 'M98 68a5 5 0 0 1 10 0v8H98z' }, 'yellow'),
    s('path', { d: 'M62 136v-18a9 9 0 0 1 18 0v18z' }, 'brown')
  ],
  pe: [
    s('path', { d: 'M38 30q20-12 42 0q18 12 18 34l10 14-8 4q4 10 2 18q4 4 0 8q2 14-12 16H72v18H30v-26q-14-14-12-40q2-34 20-46z' }, 'skin'),
    s('path', { d: 'M30 34q16-16 44-10q-12 4-16 16q-12-4-28-6z' }, 'brown'),
    s('circle', { cx: 74, cy: 58, r: 4 }, 'dark'),
    s('path', { d: 'M100 100h-14', ...SW(5) }, 'pink', { stroke: true }),
    s('path', { d: dots([[122, 88], [136, 100], [122, 112]], 7) }, 'sky', { accent: true }),
    s('path', { d: 'M108 94l6-3M108 106l6 3', ...SW(3) }, 'blue', { stroke: true })
  ],
  pila: [
    s('path', { d: rects([[32, 112, 84, 24], [40, 84, 84, 24], [26, 56, 84, 24]]) }, 'dark'),
    s('path', { d: rects([[96, 112, 20, 24], [104, 84, 20, 24], [90, 56, 20, 24]]) }, 'orange', { accent: true }),
    s('path', { d: rects([[116, 119, 6, 10], [124, 91, 6, 10], [110, 63, 6, 10]]) }, 'gray'),
    s('path', { d: 'M58 22l-10 18h12l-8 16 22-22H62l8-12z' }, 'yellow'),
    ground(140)
  ],
  portero: [
    ground(),
    s('rect', { x: 18, y: 24, width: 60, height: 112 }, 'brown'),
    s('path', { d: rects([[26, 32, 44, 44], [26, 84, 44, 44]]) }, 'tan'),
    s('circle', { cx: 68, cy: 84, r: 4 }, 'yellow'),
    ...person(112, 136, 'navy', { w: 36, h: 58, r: 15 }),
    s('path', { d: 'M96 52q16-12 32 0v6H96z' }, 'navy'),
    s('path', { d: 'M96 52h32v5H96z' }, 'red', { accent: true }),
    s('path', { d: dots([[112, 94], [112, 108], [112, 122]], 3) }, 'yellow')
  ],
  'párrafo': [
    ...paper(30, 16, 100, 128),
    s('rect', { x: 38, y: 66, width: 84, height: 38, rx: 4 }, 'yellow', { accent: true }),
    s('path', { d: 'M54 34h62M42 44h74M42 54h50M54 116h62M42 126h46', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M54 76h62M42 86h74M42 96h56', ...SW(4) }, 'dark', { stroke: true })
  ],
  reflexionar: [
    ...person(56, 146, 'green', { w: 46, h: 54, r: 20 }),
    s('path', { d: 'M70 116q14-16 0-36', ...SW(9) }, 'skin', { stroke: true }),
    s('path', { d: 'M46 68h6M62 68h6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[86, 52]], 4) + dots([[98, 42]], 6) }, 'gray'),
    s('path', { d: ells([[114, 32, 14, 12], [130, 28, 14, 14], [136, 42, 10, 9], [118, 44, 14, 9]]) }, 'sky', { accent: true }),
    s('path', { d: spiral(122, 36), ...SW(3) }, 'navy', { stroke: true })
  ],
  residuo: [
    ground(),
    s('path', { d: 'M62 54q-6-16 6-24q12 8 4 24z' }, 'yellow'),
    s('path', { d: dots([[92, 48]], 12) }, 'white'),
    s('path', { d: ring(92, 48, 12) + 'M86 42l10 4M88 54l8-6', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M42 60h76l-8 76H50z' }, 'green', { accent: true }),
    s('rect', { x: 36, y: 54, width: 88, height: 10, rx: 3 }, 'dark'),
    s('path', { d: 'M62 74v52M80 74v52M98 74v52', ...SW(4) }, 'dark', { stroke: true })
  ],
  restante: [
    s('path', { d: ring(80, 84, 56), ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: wedge(80, 84, 56, -90, -30) }, 'tan'),
    s('path', { d: wedge(80, 84, 48, -90, -30) }, 'yellow', { accent: true }),
    s('path', { d: dots([[96, 56], [86, 66], [106, 72]], 5) }, 'red'),
    s('path', { d: dots([[50, 110], [66, 124], [100, 118], [44, 80]], 2.5) }, 'tan')
  ],
  sostenible: [
    s('path', { d: 'M80 24a56 56 0 0 1 48.5 84M80 136a56 56 0 0 1-48.5-84', ...SW(8) }, 'green', { stroke: true }),
    s('path', { d: 'M136.3 112.5L120.7 103.5L122.5 118.4zM39.3 56.5L23.7 47.5L37.5 41.6z', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M136.3 112.5L120.7 103.5L122.5 118.4zM39.3 56.5L23.7 47.5L37.5 41.6z' }, 'green'),
    s('path', { d: leaflet(60, 104, -45, 58, 18) }, 'green', { accent: true }),
    s('path', { d: 'M60 104l36-36', ...SW(3) }, 'mint', { stroke: true })
  ],
  sugerencia: [
    s('path', { d: 'M66 22h28v58H66z' }, 'white'),
    s('path', { d: 'M66 22h28v58H66zM72 32h16M72 42h16M72 52h10', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 32, y: 74, width: 96, height: 66, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 56, y: 72, width: 48, height: 7, rx: 3 }, 'dark'),
    s('circle', { cx: 80, cy: 104, r: 12 }, 'yellow'),
    s('path', { d: 'M74 118h12v8H74z' }, 'gray')
  ],
  'sustitución': [
    ground(),
    ...person(36, 136, 'red', { w: 28, h: 46, r: 13, accent: true }),
    ...person(124, 136, 'blue', { w: 28, h: 46, r: 13 }),
    arrow('M40 48q40-30 80 0M108 46l12 2 2-12', 'green', 5),
    arrow('M106 104H56M64 96l-8 8 8 8', 'orange', 5)
  ],
  tributo: [
    s('path', { d: 'M54 50V24l13 12 13-18 13 18 13-12v26z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[54, 22], [80, 16], [106, 22]], 4) }, 'red'),
    arrow('M80 76V60M72 66l8-8 8 8', 'orange', 4),
    s('path', { d: 'M42 92q6-16 20-12q8-12 20-6q10-10 22 0q12-2 14 18z' }, 'yellow'),
    s('rect', { x: 40, y: 90, width: 80, height: 46, rx: 4 }, 'brown'),
    s('path', { d: 'M40 108h80', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 74, y: 102, width: 12, height: 14, rx: 2 }, 'yellow')
  ],
  'turístico': [
    ground(),
    s('path', { d: dots([[40, 54], [64, 50], [88, 54], [112, 50]], 9) }, 'skin'),
    s('path', { d: busts([40, 64, 88, 112], 72, 18, 14) }, 'green'),
    s('rect', { x: 16, y: 66, width: 128, height: 60, rx: 10 }, 'orange', { accent: true }),
    s('path', { d: rects([[26, 80, 22, 18], [56, 80, 22, 18], [86, 80, 22, 18], [116, 80, 18, 18]]) }, 'sky'),
    s('path', { d: dots([[42, 126], [118, 126]], 10) }, 'dark'),
    s('rect', { x: 104, y: 40, width: 16, height: 12, rx: 2 }, 'dark')
  ],
  uruguayo: [
    s('path', { d: 'M44 80q-20 20-10 46q8 16 30 16t30-16q10-26-10-46z' }, 'brown', { accent: true }),
    s('ellipse', { cx: 64, cy: 80, rx: 20, ry: 6 }, 'tan'),
    s('ellipse', { cx: 64, cy: 80, rx: 15, ry: 4 }, 'green'),
    s('path', { d: 'M66 84l18-54h10', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 110, y: 50, width: 28, height: 92, rx: 6 }, 'gray'),
    s('path', { d: 'M114 50V38h20v12z' }, 'dark'),
    s('path', { d: 'M110 70h28', ...SW(3) }, 'dark', { stroke: true })
  ],
  visa: [
    s('rect', { x: 24, y: 18, width: 80, height: 112, rx: 6 }, 'navy'),
    s('path', { d: ring(64, 62, 20) + 'M44 62h40M64 42v40', ...SW(3) }, 'yellow', { stroke: true }),
    s('rect', { x: 78, y: 70, width: 58, height: 68, rx: 3, transform: 'rotate(8 107 104)' }, 'white'),
    s('rect', { x: 78, y: 70, width: 58, height: 68, rx: 3, transform: 'rotate(8 107 104)', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: ells([[107, 104, 20, 14]]) + 'M98 104l6 6 12-12', ...SW(4) }, 'red', { stroke: true, accent: true })
  ],
  acordar: [
    s('path', { d: 'M14 94h36v26H14z' }, 'blue', { accent: true }),
    s('path', { d: 'M146 94h-36v26h36z' }, 'orange'),
    s('path', { d: 'M48 92q20-10 34 0l20 6q10 4 8 12q-2 8-12 6l-20-2q-16 8-30 4z' }, 'skin'),
    s('path', { d: 'M68 102l12 8M76 96l14 10M92 106l8 4', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: sparkle(80, 50, 14) + sparkle(56, 62, 7) + sparkle(106, 62, 7) }, 'yellow')
  ],
  acudir: [
    ground(),
    ...lean(52, 136, 18, 'orange', { w: 28, h: 44, r: 13, accent: true }),
    s('path', { d: 'M14 92h16M18 106h14M14 120h18', ...SW(4) }, 'gray', { stroke: true }),
    ...person(122, 136, 'blue', { w: 26, h: 42, r: 12 }),
    s('path', { d: 'M132 98l8-32', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 141, cy: 62, r: 5 }, 'skin'),
    s('path', { d: 'M132 54l-6-6M128 64h-8', ...SW(3) }, 'red', { stroke: true })
  ],
  agricultor: [
    s('rect', { x: 14, y: 118, width: 132, height: 28, rx: 4 }, 'brown'),
    s('path', { d: 'M30 132v-10M50 132v-10M120 132v-10M138 132v-10', ...SW(4) }, 'green', { stroke: true }),
    ...person(68, 118, 'blue', { w: 34, h: 48, r: 15 }),
    s('path', { d: 'M54 44q0-20 14-20t14 20z' }, 'yellow'),
    s('path', { d: 'M38 46q30-8 60 0q-30 6-60 0z' }, 'yellow', { accent: true }),
    s('path', { d: 'M104 120V28', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M104 30l16 10', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: 'M82 92l22-6', ...SW(6) }, 'skin', { stroke: true })
  ],
  almirante: [
    backdrop('sky'),
    s('path', { d: busts([80], 146, 100, 56) }, 'navy'),
    s('circle', { cx: 80, cy: 72, r: 22 }, 'skin'),
    s('path', { d: 'M48 54q32-26 64 0v8H48z' }, 'white'),
    s('path', { d: 'M54 60h52v7H54z' }, 'black'),
    s('path', { d: 'M80 34v14M75 38h10M74 44q6 7 12 0', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: rects([[32, 96, 24, 8], [104, 96, 24, 8]]) }, 'yellow', { accent: true }),
    s('path', { d: dots([[66, 124], [80, 124]], 4) }, 'red')
  ],
  bando: [
    s('path', { d: 'M80 20v120', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 108V30M136 108V30', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 30h28l-6 9 6 9H24z' }, 'red'),
    s('path', { d: 'M136 30h-28l6 9-6 9h28z' }, 'blue'),
    s('path', { d: dots([[34, 100], [58, 104], [102, 104], [126, 100]], 10) }, 'skin'),
    s('path', { d: busts([34, 58], 140, 22, 30) }, 'red', { accent: true }),
    s('path', { d: busts([102, 126], 140, 22, 30) }, 'blue')
  ],
  boludo: [
    s('circle', { cx: 80, cy: 88, r: 52 }, 'skin'),
    s('path', { d: 'M52 46q28-26 56 0z' }, 'red', { accent: true }),
    s('path', { d: 'M80 34v-14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: ells([[70, 18, 10, 3], [90, 18, 10, 3]]) }, 'blue'),
    s('path', { d: dots([[60, 78], [100, 78]], 12) }, 'white'),
    s('path', { d: dots([[67, 80], [93, 80]], 5) }, 'dark'),
    s('path', { d: 'M56 108q24 16 48 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M76 112h16v10a8 8 0 0 1-16 0z' }, 'pink')
  ],
  complejidad: [
    s('rect', { x: 20, y: 20, width: 120, height: 120, rx: 6 }, 'cream'),
    s('path', { d: 'M20 20h120v120H20zM20 44h72M116 20v48M44 68h48v24M68 92v24h48M140 116h-24M44 92v48M92 44v24M116 92v-24h-12', ...SW(5) }, 'navy', { stroke: true }),
    s('circle', { cx: 32, cy: 32, r: 6 }, 'red', { accent: true }),
    s('circle', { cx: 128, cy: 128, r: 6 }, 'green')
  ],
  comunismo: [
    ...person(36, 104, 'red', { w: 28, h: 36, r: 13 }),
    ...person(80, 104, 'red', { w: 28, h: 36, r: 13, accent: true }),
    ...person(124, 104, 'red', { w: 28, h: 36, r: 13 }),
    s('rect', { x: 14, y: 102, width: 132, height: 12, rx: 3 }, 'brown'),
    s('path', { d: 'M24 114v28M136 114v28', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M26 100a10 7 0 0 0 20 0zM70 100a10 7 0 0 0 20 0zM114 100a10 7 0 0 0 20 0z' }, 'yellow')
  ],
  continuamente: [
    s('path', { d: 'M80 80C62 52 20 52 20 80C20 108 62 108 80 80C98 52 140 52 140 80C140 108 98 108 80 80z', ...SW(10) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M110 49l10 10-10 10', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M50 111l-10-10 10-10', ...SW(6) }, 'orange', { stroke: true })
  ],
  cosecha: [
    s('path', { d: 'M40 92q40-70 80 0', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: dots([[46, 84], [112, 82]], 14) }, 'red'),
    s('ellipse', { cx: 78, cy: 80, rx: 22, ry: 17 }, 'orange', { accent: true }),
    s('path', { d: 'M78 64v-8M48 70q4-8 10-8M112 68q4-8 10-8', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M24 90h112l-12 50H36z' }, 'brown'),
    s('path', { d: 'M30 106h100M34 122h92', ...SW(3) }, 'tan', { stroke: true })
  ],
  credibilidad: [
    s('path', { d: 'M80 16l48 16v34q0 38-48 60q-48-22-48-60V32z' }, 'blue', { accent: true }),
    s('path', { d: 'M58 70l16 16 30-32', ...SW(9) }, 'white', { stroke: true }),
    s('path', { d: star(48, 138, 8) + star(80, 138, 8) + star(112, 138, 8) }, 'yellow')
  ],
  cualidad: [
    s('path', { d: 'M44 46h72l24 26-60 70-60-70z' }, 'sky', { accent: true }),
    s('path', { d: 'M44 46h72l24 26-60 70-60-70zM20 72h120M44 46l20 26 16-26 16 26 20-26M64 72l16 70 16-70', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: sparkle(130, 28, 10) + sparkle(28, 32, 7) }, 'yellow')
  ],
  'decoración': [
    s('path', { d: 'M14 26q66 24 132 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M22 31h18l-9 18zM70 37h20l-10 18zM118 33h18l-9 18z' }, 'red'),
    s('path', { d: 'M46 35h18l-9 18zM94 35h18l-9 18z' }, 'yellow'),
    s('path', { d: 'M80 104V70M80 100l-18-26M80 100l18-22', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: dots([[80, 70], [62, 74], [98, 78]], 9) }, 'pink'),
    s('path', { d: 'M64 140q-12-20 2-38h28q14 18 2 38z' }, 'blue', { accent: true })
  ],
  delantero: [
    ground(),
    s('path', { d: 'M64 116l28 8', ...SW(9) }, 'skin', { stroke: true }),
    ...lean(56, 136, -6, 'red', { w: 30, h: 46, r: 14, accent: true }),
    s('circle', { cx: 112, cy: 120, r: 14 }, 'white'),
    s('path', { d: ring(112, 120, 14), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M107 115h10l3 7-8 5-8-5z' }, 'dark'),
    s('path', { d: 'M134 108h10M136 120h10M134 132h10', ...SW(3) }, 'gray', { stroke: true })
  ],
  'denominación': [
    s('path', { d: 'M40 60h56v72a8 8 0 0 1-8 8H48a8 8 0 0 1-8-8z' }, 'sky'),
    s('path', { d: 'M44 86h48v44a6 6 0 0 1-6 6H50a6 6 0 0 1-6-6z' }, 'yellow'),
    s('rect', { x: 36, y: 46, width: 64, height: 16, rx: 4 }, 'red'),
    s('path', { d: 'M96 54q16 2 20 16', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M106 80l10-10 10 10v40h-20z' }, 'orange', { accent: true }),
    s('circle', { cx: 116, cy: 78, r: 2.5 }, 'white'),
    s('path', { d: 'M111 90v22M120 90v14', ...SW(3) }, 'white', { stroke: true })
  ],
  densidad: [
    s('rect', { x: 16, y: 44, width: 58, height: 72, rx: 4 }, 'sky'),
    s('rect', { x: 86, y: 44, width: 58, height: 72, rx: 4 }, 'sky'),
    s('path', { d: dots([[32, 62], [58, 84], [36, 102]], 5) }, 'navy'),
    s('path', { d: dots(Array.from({ length: 20 }, (_, k) => [96 + (k % 4) * 12.6, 54 + Math.floor(k / 4) * 13]), 5) }, 'red', { accent: true })
  ],
  diariamente: [
    s('rect', { x: 20, y: 30, width: 84, height: 96, rx: 6 }, 'white'),
    outline({ x: 20, y: 30, width: 84, height: 96, rx: 6 }),
    s('rect', { x: 20, y: 30, width: 84, height: 24, rx: 6 }, 'red', { accent: true }),
    s('path', { d: 'M40 22v16M84 22v16', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 62, cy: 90, r: 16 }, 'yellow'),
    s('path', { d: 'M134 104a20 20 0 1 1-6-14', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M120 84l10 6 2-12', ...SW(5) }, 'green', { stroke: true })
  ],
  'donación': [
    s('rect', { x: 34, y: 86, width: 92, height: 56, rx: 4 }, 'tan'),
    s('path', { d: 'M58 84h44v6H58z' }, 'dark'),
    s('path', { d: heart(80, 50, 20) }, 'red', { accent: true }),
    s('path', { d: 'M80 74v6', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: heart(80, 112, 10) }, 'pink'),
    s('circle', { cx: 122, cy: 50, r: 10 }, 'yellow')
  ],
  exigencia: [
    ground(),
    ...person(36, 136, 'navy', { w: 30, h: 54, r: 14 }),
    s('path', { d: 'M48 96l24-14', ...SW(8) }, 'navy', { stroke: true }),
    s('path', { d: 'M72 82l14-4', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: rects([[94, 116, 44, 20], [98, 96, 40, 20], [92, 76, 44, 20], [96, 56, 42, 20], [94, 36, 44, 20]]) }, 'white'),
    s('path', { d: rects([[94, 116, 44, 20], [98, 96, 40, 20], [92, 76, 44, 20], [96, 56, 42, 20], [94, 36, 44, 20]]), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M20 46l6 6M32 42v8M44 46l-6 6', ...SW(3) }, 'red', { stroke: true, accent: true })
  ],
  funcional: [
    s('path', { d: 'M42 80L26 30q22 10 34 50z' }, 'gray'),
    s('path', { d: 'M112 80l22-44', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M84 80l6-28h8l-4 28z' }, 'gray'),
    s('rect', { x: 26, y: 76, width: 108, height: 32, rx: 16 }, 'red', { accent: true }),
    s('path', { d: dots([[44, 92], [116, 92]], 4) }, 'gray'),
    s('path', { d: 'M54 92h52', ...SW(3) }, 'pink', { stroke: true })
  ],
  'geográfico': [
    s('path', { d: 'M16 40l40-12 48 12 40-12v92l-40 12-48-12-40 12z' }, 'mint'),
    s('path', { d: 'M56 28v92M104 40v92', ...SW(2) }, 'green', { stroke: true }),
    s('path', { d: 'M16 96q30-10 48 4t80-18', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M28 80l12-20 12 20zM66 70l10-16 10 16z' }, 'brown'),
    s('path', { d: sparkle(118, 72, 18) }, 'red', { accent: true }),
    s('circle', { cx: 118, cy: 72, r: 3 }, 'white')
  ],
  gota: [
    s('path', { d: 'M14 36h70', ...SW(16, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M82 36q16 0 16 18', ...SW(16, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 18h24M78 18v10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: drop(98, 98, 14) }, 'blue', { accent: true }),
    s('ellipse', { cx: 98, cy: 138, rx: 32, ry: 6 }, 'sky'),
    s('path', { d: 'M74 130l-6-6M122 130l6-6', ...SW(3) }, 'blue', { stroke: true })
  ],
  hincha: [
    ...person(80, 146, 'red', { w: 48, h: 56, r: 20, accent: true }),
    s('path', { d: 'M62 96L40 48M98 96l22-48', ...SW(9) }, 'red', { stroke: true }),
    s('path', { d: 'M30 30h100v16H30z' }, 'blue'),
    s('path', { d: 'M46 30v16M62 30v16M78 30v16M94 30v16M110 30v16', ...SW(4, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('path', { d: 'M30 46v8M36 46v8M124 46v8M130 46v8', ...SW(2) }, 'blue', { stroke: true }),
    s('ellipse', { cx: 80, cy: 76, rx: 7, ry: 6 }, 'dark')
  ],
  involucrado: [
    ...person(80, 140, 'green', { w: 40, h: 60, r: 18 }),
    s('path', { d: 'M22 72q56-12 116 6q-50 14-106 10q62 4 104 22q-52 10-98 4q52 0 76 26', ...SW(5) }, 'tan', { stroke: true, accent: true }),
    s('path', { d: drop(108, 44, 4) }, 'sky'),
    s('path', { d: 'M72 66q8-4 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  line: [
    ground(),
    ...person(52, 136, 'blue', { w: 28, h: 44, r: 12 }),
    ...person(108, 136, 'blue', { w: 28, h: 44, r: 12 }),
    s('path', { d: 'M72 60l-4-28M88 60l4-28', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 66, y: 56, width: 28, height: 44, rx: 9 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 44, r: 11 }, 'skin'),
    s('ellipse', { cx: 80, cy: 22, rx: 12, ry: 8 }, 'brown')
  ],
  'mediterráneo': [
    backdrop('tan'),
    s('path', { d: 'M14 72q20-8 40 0t36-4 30 6 26-4v22q-20 10-30 24t-44 8-38-8-20-14z' }, 'blue', { accent: true }),
    s('path', { d: dots([[60, 88], [100, 90]], 4) }, 'tan'),
    s('circle', { cx: 124, cy: 36, r: 12 }, 'yellow'),
    s('path', { d: 'M24 130l10-18 10 18zM120 136l8-14 8 14z' }, 'green'),
    s('path', { d: 'M74 100h14l-2 4H76z', ...SW(3) }, 'white', { stroke: true })
  ],
  normativa: [
    s('rect', { x: 24, y: 28, width: 72, height: 100, rx: 4 }, 'navy', { accent: true }),
    s('path', { d: 'M30 30v96', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M60 50v40M44 56h32M44 56l-6 14h12zM76 56l-6 14h12zM50 90h20', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M96 136h46v8H96z' }, 'brown'),
    s('path', { d: 'M110 98l24 30', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 96, y: 78, width: 36, height: 18, rx: 4, transform: 'rotate(-40 114 87)' }, 'tan')
  ],
  off: [
    backdrop('dark'),
    s('path', { d: 'M80 14l-34 112h68z' }, 'cream'),
    s('path', { d: 'M14 126h132v20H14z' }, 'brown'),
    s('circle', { cx: 44, cy: 82, r: 10 }, 'skin'),
    s('circle', { cx: 48, cy: 80, r: 2.5 }, 'dark'),
    s('path', { d: 'M14 14h34q-10 60 4 132H14zM146 14h-34q6 60-6 132h40z' }, 'red', { accent: true })
  ],
  partidario: [
    ...person(80, 146, 'green', { w: 44, h: 52, r: 18 }),
    s('path', { d: 'M112 120V50', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M96 104l16-10', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 84, y: 16, width: 56, height: 38, rx: 4 }, 'white'),
    outline({ x: 84, y: 16, width: 56, height: 38, rx: 4 }),
    s('path', { d: heart(112, 30, 12) }, 'red', { accent: true })
  ],
  proceder: [
    ground(),
    s('rect', { x: 20, y: 24, width: 28, height: 72, rx: 6 }, 'dark'),
    s('path', { d: dots([[34, 40], [34, 60]], 8) }, 'gray'),
    s('circle', { cx: 34, cy: 80, r: 8 }, 'green', { accent: true }),
    s('path', { d: 'M34 96v40', ...SW(5) }, 'dark', { stroke: true }),
    ...lean(100, 136, 10, 'blue'),
    arrow('M76 36h56M122 26l10 10-10 10', 'green', 6)
  ],
  provisional: [
    ground(),
    s('path', { d: 'M88 136V64M136 136V64M84 66l28-26 28 26', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M16 136l40-70 40 70z' }, 'orange', { accent: true }),
    s('path', { d: 'M44 136l12-36 12 36z' }, 'brown'),
    s('path', { d: 'M56 66v-10', ...SW(3) }, 'dark', { stroke: true })
  ],
  'radiación': [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'yellow', { accent: true }),
    s('path', { d: wedge(80, 80, 50, -120, -60) + wedge(80, 80, 50, 0, 60) + wedge(80, 80, 50, 120, 180) }, 'black'),
    s('circle', { cx: 80, cy: 80, r: 16 }, 'yellow'),
    s('circle', { cx: 80, cy: 80, r: 9 }, 'black')
  ],
  republicano: [
    s('path', { d: 'M66 26h28v48H66z' }, 'white'),
    s('path', { d: 'M66 26h28v48H66z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M72 46l6 6 10-12', ...SW(4) }, 'green', { stroke: true }),
    s('rect', { x: 30, y: 76, width: 100, height: 64, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 56, y: 72, width: 48, height: 8, rx: 3 }, 'dark'),
    s('path', { d: 'M30 96h100', ...SW(3) }, 'navy', { stroke: true })
  ],
  ritual: [
    s('ellipse', { cx: 80, cy: 122, rx: 64, ry: 20 }, 'purple'),
    s('path', { d: rects([[28, 96, 10, 26], [52, 108, 10, 26], [98, 108, 10, 26], [122, 96, 10, 26]]) }, 'cream'),
    s('path', { d: drop(33, 88, 4) + drop(57, 100, 4) + drop(103, 100, 4) + drop(127, 88, 4) }, 'orange'),
    s('path', { d: 'M66 112h28a14 10 0 0 1-28 0z' }, 'brown', { accent: true }),
    s('path', { d: 'M80 104q-10-14 0-28t0-30q-8-10 0-20', ...SW(4) }, 'gray', { stroke: true })
  ],
  secuencia: [
    ground(),
    ...[70, 45, 25, 10, 0].map((r, k) => s('rect', { x: 26 + 24 * k, y: 92, width: 12, height: 44, rx: 2, transform: `rotate(${r} ${38 + 24 * k} 136)` }, k % 2 ? 'dark' : 'navy', k === 0 ? { accent: true } : {})),
    arrow('M30 40h96M116 30l10 10-10 10', 'orange', 5)
  ],
  semanal: [
    s('rect', { x: 16, y: 28, width: 128, height: 108, rx: 6 }, 'white'),
    outline({ x: 16, y: 28, width: 128, height: 108, rx: 6 }),
    s('rect', { x: 16, y: 28, width: 128, height: 20, rx: 6 }, 'red'),
    s('rect', { x: 19, y: 73, width: 122, height: 22, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: rects([0, 1, 2, 3].flatMap(r => Array.from({ length: 7 }, (_, i) => [23 + i * 17, 56 + r * 20, 12, 12]))) }, 'gray')
  ],
  sentar: [
    s('path', { d: 'M114 40v96', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M70 96h44', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M74 100v36M108 100v36', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 82, y: 48, width: 26, height: 44, rx: 8 }, 'blue', { accent: true }),
    s('circle', { cx: 95, cy: 34, r: 12 }, 'skin'),
    s('path', { d: 'M90 88H58v44', ...SW(11) }, 'navy', { stroke: true }),
    arrow('M30 36v44M20 70l10 10 10-10', 'orange', 5)
  ],
  sorteo: [
    s('path', { d: 'M50 136l30-50 30 50', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 66, r: 44 }, 'sky'),
    s('path', { d: dots([[64, 84], [96, 88]], 9) }, 'red', { accent: true }),
    s('path', { d: dots([[80, 96], [62, 64]], 9) }, 'yellow'),
    s('path', { d: dots([[98, 68]], 9) }, 'green'),
    s('path', { d: ring(80, 66, 44) + 'M80 22v88M36 66h88M124 66h16v18', ...SW(4) }, 'navy', { stroke: true }),
    s('circle', { cx: 130, cy: 128, r: 10 }, 'orange')
  ],
  sumar: [
    s('path', { d: dots([[28, 40], [52, 40]], 12) }, 'red'),
    s('circle', { cx: 122, cy: 40, r: 12 }, 'green'),
    s('path', { d: 'M88 30v20M78 40h20', ...SW(5) }, 'navy', { stroke: true }),
    arrow('M40 62l18 26M122 62l-18 26', 'orange', 5),
    s('path', { d: dots([[64, 104], [96, 104]], 12) }, 'red'),
    s('circle', { cx: 80, cy: 96, r: 12 }, 'green'),
    s('path', { d: 'M40 108h80l-10 34H50z' }, 'brown', { accent: true })
  ],
  'temática': [
    s('rect', { x: 16, y: 24, width: 128, height: 108, rx: 6 }, 'tan'),
    s('rect', { x: 16, y: 24, width: 128, height: 108, rx: 6, ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M41 45L80 78M119 45L80 78M41 111L80 78M119 111L80 78', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: rects([[26, 34, 30, 22], [104, 34, 30, 22], [26, 100, 30, 22], [104, 100, 30, 22]]) }, 'white'),
    s('rect', { x: 54, y: 58, width: 52, height: 40, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: dots([[41, 38], [119, 38], [41, 104], [119, 104], [80, 62]], 4) }, 'red')
  ],
  'trámite': [
    s('path', { d: rects([[14, 34, 36, 48], [62, 34, 36, 48], [110, 34, 36, 48]]) }, 'white'),
    s('path', { d: rects([[14, 34, 36, 48], [62, 34, 36, 48], [110, 34, 36, 48]]) + 'M20 46h24M20 56h24M20 66h16M68 46h24M68 56h24M68 66h16M116 46h24M116 56h16', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 58h8M100 58h8', ...SW(3) }, 'navy', { stroke: true }),
    s('circle', { cx: 132, cy: 72, r: 10 }, 'red', { accent: true }),
    s('path', { d: 'M32 112h96', ...DASH(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[32, 112], [80, 112]], 8) }, 'green'),
    s('circle', { cx: 128, cy: 112, r: 8 }, 'orange')
  ],
  valorar: [
    s('path', { d: halfRays(80, 70, 40, 50, 7), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: heart(80, 72, 26) }, 'red', { accent: true }),
    s('path', { d: 'M22 96q0 40 58 40t58-40q-10-4-20 8q-12 14-38 14t-38-14q-10-12-20-8z' }, 'skin'),
    s('path', { d: 'M60 120q20 6 40 0', ...SW(3) }, 'tan', { stroke: true })
  ],
  viajero: [
    ground(),
    s('path', { d: 'M84 104l20-22', ...SW(6) }, 'skin', { stroke: true }),
    ...lean(70, 136, 6, 'blue', { w: 30, h: 50, r: 14 }),
    s('rect', { x: 42, y: 88, width: 18, height: 34, rx: 6, transform: 'rotate(6 70 136)' }, 'orange', { accent: true }),
    s('path', { d: 'M106 100V82h10', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 100, y: 100, width: 34, height: 30, rx: 4 }, 'red'),
    s('path', { d: dots([[106, 134], [128, 134]], 3) }, 'dark')
  ],
  abiertamente: [
    backdrop('navy'),
    s('rect', { x: 46, y: 30, width: 68, height: 116 }, 'yellow', { accent: true }),
    s('path', { d: 'M114 30l22-8v120l-22 4z' }, 'brown'),
    s('path', { d: 'M62 104L44 84M98 104l18-20', ...SW(7) }, 'dark', { stroke: true }),
    ...person(80, 146, 'dark', { w: 30, h: 50, r: 14 })
  ],
  abordar: [
    s('path', { d: 'M14 122h132v24H14z' }, 'blue'),
    s('rect', { x: 14, y: 116, width: 26, height: 30 }, 'tan'),
    s('rect', { x: 96, y: 62, width: 40, height: 30 }, 'white'),
    outline({ x: 96, y: 62, width: 40, height: 30 }),
    s('path', { d: 'M64 92h82v14q-6 16-24 16H76z' }, 'red', { accent: true }),
    s('path', { d: 'M36 118L68 92', ...SW(5) }, 'brown', { stroke: true }),
    ...person(52, 104, 'green', { w: 14, h: 22, r: 7 })
  ],
  accesible: [
    ground(),
    s('rect', { x: 98, y: 36, width: 48, height: 100 }, 'sky'),
    s('rect', { x: 110, y: 76, width: 24, height: 44 }, 'brown'),
    s('path', { d: 'M14 136L98 120v16z' }, 'gray'),
    s('path', { d: ring(54, 112, 13), ...SW(4) }, 'navy', { stroke: true }),
    s('circle', { cx: 52, cy: 72, r: 8 }, 'skin'),
    s('path', { d: 'M52 84v22h18l4 14', ...SW(8) }, 'blue', { stroke: true, accent: true })
  ],
  'acompañado': [
    s('ellipse', { cx: 60, cy: 106, rx: 48, ry: 18 }, 'gray'),
    s('ellipse', { cx: 60, cy: 102, rx: 40, ry: 13 }, 'white'),
    s('ellipse', { cx: 60, cy: 96, rx: 26, ry: 12 }, 'brown'),
    s('path', { d: 'M100 80h44a22 18 0 0 1-44 0z' }, 'blue', { accent: true }),
    s('path', { d: 'M104 80q6-14 18-10q10-8 18 10z' }, 'green'),
    s('path', { d: dots([[114, 72], [130, 74]], 5) }, 'red')
  ],
  acusar: [
    ...person(112, 140, 'gray', { w: 36, h: 50, r: 16 }),
    s('path', { d: dots([[106, 70], [118, 70]], 2.5) }, 'dark'),
    s('ellipse', { cx: 112, cy: 80, rx: 4, ry: 5 }, 'dark'),
    s('path', { d: 'M100 46l-4-8M112 42v-8M124 46l4-8', ...SW(3) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M14 72h26v22H14z' }, 'navy'),
    s('path', { d: 'M40 72h8l28-6a4 4 0 0 1 0 8l-16 3v15H40z' }, 'skin')
  ],
  ajeno: [
    s('rect', { x: 102, y: 50, width: 12, height: 50 }, 'brown'),
    s('circle', { cx: 108, cy: 46, r: 32 }, 'green'),
    s('path', { d: dots([[96, 36], [120, 30], [114, 58], [90, 56]], 6) }, 'red', { accent: true }),
    s('path', { d: rects(Array.from({ length: 8 }, (_, i) => [16 + i * 17, 84, 12, 52])) }, 'tan'),
    s('path', { d: 'M14 96h132M14 120h132', ...SW(5) }, 'brown', { stroke: true }),
    s('circle', { cx: 42, cy: 72, r: 13 }, 'skin'),
    s('path', { d: dots([[46, 70], [54, 70]], 2.5) }, 'dark')
  ],
  allende: [
    backdrop('sky'),
    s('path', { d: 'M14 146l50-90 40 70 10-14 32 34z' }, 'gray'),
    s('path', { d: 'M54 74l10-18 10 18-10-4z' }, 'white'),
    s('path', { d: 'M120 136v-14l10-8 10 8v14z' }, 'red', { accent: true }),
    s('path', { d: 'M24 128Q50 0 128 104', ...DASH(4) }, 'orange', { stroke: true }),
    s('circle', { cx: 24, cy: 134, r: 5 }, 'navy')
  ],
  amparo: [
    s('path', { d: 'M24 30l-4 10M44 18l-4 10M116 18l-4 10M136 30l-4 10M20 100l-4 10M140 100l-4 10M30 80l-4 10M138 72l-4 10', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M24 82a56 44 0 0 1 112 0q-9-8-19 0q-9-8-18 0q-10-8-19 0q-9-8-19 0q-9-8-18 0q-10-8-19 0z' }, 'red', { accent: true }),
    s('path', { d: 'M80 82v40q0 8-8 8', ...SW(4) }, 'dark', { stroke: true }),
    ...person(60, 146, 'yellow', { w: 24, h: 30, r: 11 })
  ],
  'animación': [
    s('rect', { x: 14, y: 40, width: 132, height: 80 }, 'dark'),
    s('path', { d: rects(Array.from({ length: 8 }, (_, k) => [20 + 16 * k, 44, 8, 6]).concat(Array.from({ length: 8 }, (_, k) => [20 + 16 * k, 110, 8, 6]))) }, 'white'),
    s('path', { d: rects([[20, 54, 36, 52], [62, 54, 36, 52], [104, 54, 36, 52]]) }, 'sky'),
    s('path', { d: dots([[38, 94], [80, 70], [122, 94]], 8) }, 'red', { accent: true }),
    s('path', { d: 'M24 104h28M66 104h28M108 104h28', ...SW(2) }, 'navy', { stroke: true })
  ],
  animar: [
    ...person(80, 146, 'red', { w: 40, h: 52, r: 18, accent: true }),
    s('path', { d: 'M64 98L42 54M96 98l22-44', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: burst(40, 46, 18, 9, 12) + burst(120, 46, 18, 9, 12) }, 'yellow'),
    s('path', { d: 'M72 78q8 6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(80, 26, 9) }, 'orange')
  ],
  'automóvil': [
    ground(134),
    s('path', { d: 'M16 112q0-16 16-18l18-22h54l22 22q18 2 18 18v10H16z' }, 'blue', { accent: true }),
    s('path', { d: 'M56 78h20v16H44zM82 78h20l14 16H82z' }, 'sky'),
    s('path', { d: dots([[46, 122], [114, 122]], 13) }, 'dark'),
    s('path', { d: dots([[46, 122], [114, 122]], 5) }, 'gray'),
    s('rect', { x: 132, y: 100, width: 10, height: 6, rx: 2 }, 'yellow')
  ],
  ayudante: [
    ground(),
    ...person(44, 136, 'blue', { w: 36, h: 56, r: 15 }),
    ...person(116, 136, 'green', { w: 28, h: 40, r: 12, accent: true }),
    s('path', { d: 'M104 112l-18-6', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 66, y: 92, width: 20, height: 26, rx: 2 }, 'brown'),
    s('rect', { x: 69, y: 97, width: 14, height: 18 }, 'white')
  ],
  benito: [
    s('path', { d: 'M50 74q0-34 30-36q30 2 30 36l14 72H36z' }, 'black'),
    s('circle', { cx: 80, cy: 68, r: 16 }, 'skin'),
    s('path', { d: 'M56 104h48M90 104v24', ...SW(4) }, 'tan', { stroke: true }),
    s('rect', { x: 64, y: 110, width: 24, height: 20, rx: 2 }, 'red', { accent: true }),
    s('path', { d: dots([[62, 120], [90, 120]], 5) }, 'skin'),
    s('path', { d: dots([[74, 66], [86, 66]], 2) }, 'dark')
  ],
  'bibliografía': [
    ground(),
    s('rect', { x: 18, y: 112, width: 72, height: 24, rx: 2 }, 'red', { accent: true }),
    s('rect', { x: 24, y: 88, width: 64, height: 24, rx: 2 }, 'blue'),
    s('rect', { x: 14, y: 64, width: 70, height: 24, rx: 2 }, 'green'),
    s('path', { d: 'M80 118v12M82 94v12M76 70v12', ...SW(3) }, 'cream', { stroke: true }),
    ...paper(100, 28, 44, 108),
    s('path', { d: dots([[108, 44], [108, 62], [108, 80], [108, 98], [108, 116]], 2.5) + 'M114 44h22M114 62h22M114 80h22M114 98h22M114 116h16', ...SW(3) }, 'gray', { stroke: true })
  ],
  bloquear: [
    s('rect', { x: 96, y: 20, width: 42, height: 120 }, 'red', { accent: true }),
    s('path', { d: 'M96 44h42M96 68h42M96 92h42M96 116h42M117 20v24M106 44v24M127 44v24M117 68v24M106 92v24M127 92v24M117 116v24', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M18 80h58M64 66l14 14-14 14', ...SW(8) }, 'blue', { stroke: true }),
    s('path', { d: burst(88, 80, 14, 6, 8) }, 'yellow')
  ],
  bote: [
    s('path', { d: 'M14 112q12-8 24 0t24 0 24 0 24 0 24 0 12 0V146H14z' }, 'blue'),
    s('path', { d: 'M44 82l-24 40M116 82l24 40', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: ells([[20, 122, 6, 11], [140, 122, 6, 11]]) }, 'tan'),
    s('circle', { cx: 80, cy: 60, r: 12 }, 'skin'),
    s('path', { d: busts([80], 96, 28, 24) }, 'yellow'),
    s('path', { d: 'M28 92h104q-8 26-30 26H58q-22 0-30-26z' }, 'red', { accent: true })
  ],
  bronca: [
    ground(),
    ...person(36, 136, 'red', { w: 30, h: 48, r: 14 }),
    ...person(124, 136, 'blue', { w: 30, h: 48, r: 14 }),
    s('path', { d: 'M28 64l8 4M44 64l-8 4M116 64l8 4M132 64l-8 4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: burst(80, 50, 28, 14, 9) }, 'yellow', { accent: true }),
    s('path', { d: 'M84 84l-10 16h12l-8 16', ...SW(4) }, 'orange', { stroke: true })
  ],
  'centímetro': [
    s('rect', { x: 14, y: 70, width: 132, height: 44, rx: 4 }, 'yellow', { accent: true }),
    s('path', { d: Array.from({ length: 13 }, (_, i) => `M${20 + i * 10} 70v${i % 5 === 0 ? 20 : 11}`).join(''), ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 40, y: 70, width: 20, height: 44 }, 'orange'),
    s('path', { d: Array.from({ length: 3 }, (_, i) => `M${40 + i * 10} 70v${i === 0 ? 20 : 11}`).join(''), ...SW(2) }, 'dark', { stroke: true }),
    arrow('M42 52h16M48 46l-6 6 6 6M52 46l6 6-6 6', 'red', 3)
  ],
  coincidir: [
    ground(),
    ...person(36, 136, 'blue', { w: 28, h: 44, r: 13 }),
    ...person(124, 136, 'orange', { w: 28, h: 44, r: 13 }),
    s('path', { d: dots([[46, 64], [114, 64]], 3) + dots([[52, 54], [108, 54]], 4) }, 'gray'),
    s('path', { d: ells([[48, 34, 24, 18], [112, 34, 24, 18]]) }, 'sky'),
    s('path', { d: star(48, 34, 12) + star(112, 34, 12) }, 'yellow', { accent: true }),
    s('path', { d: 'M74 34h12', ...DASH(3, '3 4') }, 'navy', { stroke: true })
  ],
  cole: [
    ground(),
    s('rect', { x: 28, y: 66, width: 104, height: 70 }, 'red', { accent: true }),
    s('path', { d: 'M20 70l60-38 60 38z' }, 'brown'),
    s('circle', { cx: 80, cy: 56, r: 9 }, 'white'),
    s('path', { d: 'M80 50v6h5', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: rects([[38, 80, 18, 16], [104, 80, 18, 16], [38, 106, 18, 16], [104, 106, 18, 16]]) }, 'sky'),
    s('path', { d: 'M68 136v-30h24v30z' }, 'brown')
  ],
  comisario: [
    backdrop('sky'),
    s('path', { d: busts([80], 146, 96, 54) }, 'navy'),
    s('circle', { cx: 80, cy: 74, r: 22 }, 'skin'),
    s('path', { d: 'M50 58q30-26 60 0v6H50z' }, 'navy'),
    s('path', { d: 'M54 62h52v7H54z' }, 'black'),
    s('path', { d: star(80, 50, 6) }, 'yellow'),
    s('path', { d: star(60, 118, 11) }, 'yellow', { accent: true }),
    s('path', { d: 'M70 84q10-5 20 0', ...SW(4) }, 'brown', { stroke: true })
  ],
  convivencia: [
    s('path', { d: 'M20 74l60-50 60 50v66H20z' }, 'cream'),
    s('path', { d: 'M20 74l60-50 60 50v66H20z', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: dots([[48, 96], [80, 92], [112, 96]], 10) }, 'skin'),
    s('path', { d: busts([48], 140, 22, 30) }, 'blue'),
    s('path', { d: busts([80], 140, 22, 34) }, 'green'),
    s('path', { d: busts([112], 140, 22, 30) }, 'orange'),
    s('path', { d: heart(80, 58, 11) }, 'red', { accent: true })
  ],
  disparar: [
    s('circle', { cx: 116, cy: 80, r: 30 }, 'red'),
    s('circle', { cx: 116, cy: 80, r: 20 }, 'white'),
    s('circle', { cx: 116, cy: 80, r: 10 }, 'red', { accent: true }),
    s('path', { d: 'M22 80h90', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M22 80l-8-8M22 80l-8 8M30 80l-8-8M30 80l-8 8', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M40 62h24M46 98h24', ...SW(3) }, 'gray', { stroke: true })
  ],
  economista: [
    ...person(42, 146, 'navy', { w: 40, h: 58, r: 16 }),
    s('path', { d: 'M42 90l-4 6 4 22 4-22z' }, 'red', { accent: true }),
    s('rect', { x: 76, y: 22, width: 66, height: 62, rx: 3 }, 'white'),
    outline({ x: 76, y: 22, width: 66, height: 62, rx: 3 }),
    s('path', { d: 'M86 72l16-16 12 8 20-24', ...SW(5) }, 'green', { stroke: true }),
    s('circle', { cx: 112, cy: 116, r: 14 }, 'yellow'),
    s('path', { d: ring(112, 116, 9), ...SW(3) }, 'orange', { stroke: true })
  ],
  'económicamente': [
    s('path', { d: 'M44 120v16M108 120v16M58 124v14M94 124v14', ...SW(9) }, 'pink', { stroke: true }),
    s('ellipse', { cx: 76, cy: 96, rx: 48, ry: 34 }, 'pink', { accent: true }),
    s('path', { d: 'M50 70l4-18 14 12z' }, 'pink'),
    s('ellipse', { cx: 124, cy: 96, rx: 10, ry: 12 }, 'red'),
    s('path', { d: 'M62 64h28', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 104, cy: 84, r: 4 }, 'dark'),
    s('circle', { cx: 76, cy: 36, r: 14 }, 'yellow'),
    s('path', { d: ring(76, 36, 9), ...SW(3) }, 'orange', { stroke: true })
  ],
  ego: [
    ground(),
    s('ellipse', { cx: 112, cy: 72, rx: 30, ry: 46 }, 'brown'),
    s('ellipse', { cx: 112, cy: 72, rx: 22, ry: 38 }, 'sky'),
    s('circle', { cx: 112, cy: 66, r: 12 }, 'skin'),
    ...person(46, 136, 'purple', { w: 32, h: 50, r: 15 }),
    s('path', { d: 'M34 58V44l6 6 6-10 6 10 6-6v14z' }, 'yellow', { accent: true }),
    s('path', { d: sparkle(80, 30, 8) + sparkle(112, 44, 5) }, 'orange')
  ],
  'fanático': [
    ...person(66, 146, 'pink', { w: 44, h: 52, r: 20 }),
    s('path', { d: heart(58, 68, 5) + heart(74, 68, 5) }, 'red'),
    s('ellipse', { cx: 66, cy: 84, rx: 6, ry: 5 }, 'dark'),
    s('path', { d: 'M86 108L112 64', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M112 64l18-34', ...SW(12) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: heart(128, 74, 9) + heart(30, 40, 7) }, 'pink'),
    s('path', { d: sparkle(106, 26, 7) }, 'orange')
  ],
  fragmento: [
    ground(132),
    s('path', { d: 'M28 70l40-18 8 34-38 12z' }, 'sky', { accent: true }),
    s('path', { d: 'M86 48l40 12-6 34-30-18z' }, 'sky'),
    s('path', { d: 'M46 104l30 2-6 22-26-6zM96 102l24 4-8 20-20-8z' }, 'blue'),
    s('path', { d: 'M28 70l40-18 8 34-38 12zM86 48l40 12-6 34-30-18z', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M80 30v-12M64 34l-6-10M96 34l6-10', ...SW(3) }, 'gray', { stroke: true })
  ],
  hueco: [
    s('rect', { x: 14, y: 76, width: 132, height: 70, rx: 10 }, 'green'),
    s('ellipse', { cx: 80, cy: 108, rx: 46, ry: 16 }, 'black', { accent: true }),
    s('path', { d: 'M34 108a46 16 0 0 0 92 0', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 76q16-30 34 0z' }, 'brown'),
    s('path', { d: 'M130 72L112 22', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: 'M116 72l18-6 4 14-18 6z' }, 'gray')
  ],
  'imbécil': [
    ground(),
    s('path', { d: 'M102 20v116', ...SW(8) }, 'gray', { stroke: true }),
    ...lean(76, 136, 10, 'orange', { accent: true }),
    s('path', { d: star(102, 54, 8) + star(76, 46, 7) + star(124, 66, 6) }, 'yellow'),
    s('path', { d: spiral(80, 76), ...SW(2) }, 'dark', { stroke: true })
  ],
  imperial: [
    s('path', { d: 'M24 122q56-22 112 0l-6 20H30z' }, 'purple'),
    s('path', { d: dots([[28, 138], [132, 138]], 5) }, 'yellow'),
    s('path', { d: 'M46 114V66l17 18 17-28 17 28 17-18v48z' }, 'yellow', { accent: true }),
    s('path', { d: 'M46 104h68', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: dots([[80, 88]], 7) + dots([[58, 92], [102, 92]], 5) }, 'red'),
    s('path', { d: sparkle(130, 40, 9) + sparkle(30, 44, 7) }, 'orange')
  ],
  incapacidad: [
    ground(),
    s('rect', { x: 66, y: 82, width: 28, height: 42, rx: 9 }, 'blue'),
    s('circle', { cx: 80, cy: 66, r: 13 }, 'skin'),
    s('path', { d: 'M70 88l-12 26M90 88l12 26M70 124l-6 12M90 124l6 12', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M18 116h124', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: rects([[18, 92, 14, 44], [128, 92, 14, 44]]) }, 'red', { accent: true }),
    s('path', { d: drop(62, 54, 3) + drop(100, 52, 3) }, 'sky'),
    s('path', { d: 'M72 72q8-4 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  incrementar: [
    s('path', { d: 'M24 120h28v16H24zM66 104h28v32H66z' }, 'blue'),
    s('path', { d: 'M108 86h28v50h-28z' }, 'blue', { accent: true }),
    s('path', { d: 'M22 76v60h32V76M64 76v60h32V76M106 76v60h32V76', ...SW(3) }, 'gray', { stroke: true }),
    arrow('M28 56L126 22M112 18l14 4-6 13', 'orange', 6)
  ],
  intendente: [
    s('rect', { x: 18, y: 50, width: 124, height: 70 }, 'cream'),
    s('path', { d: 'M14 52l66-32 66 32z' }, 'gray'),
    s('path', { d: 'M30 60v52M46 60v52M114 60v52M130 60v52', ...SW(4) }, 'tan', { stroke: true }),
    ...person(80, 146, 'navy', { w: 46, h: 56, r: 18 }),
    s('path', { d: 'M60 94l40 46', ...SW(9) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 90, cy: 124, r: 6 }, 'yellow')
  ],
  irlanda: [
    s('rect', { x: 18, y: 104, width: 84, height: 30, rx: 4 }, 'green', { accent: true }),
    s('rect', { x: 24, y: 76, width: 76, height: 28, rx: 4 }, 'mint'),
    s('rect', { x: 20, y: 50, width: 80, height: 26, rx: 4 }, 'cream'),
    s('path', { d: 'M18 120h84M24 90h76M20 63h80', ...DASH(2, '4 4') }, 'gray', { stroke: true }),
    s('path', { d: dots([[116, 106], [128, 100], [140, 106], [128, 112]], 9) }, 'white'),
    s('path', { d: dots([[116, 106], [128, 100], [140, 106], [128, 112]], 9), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M120 118v14M136 118v14', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 108, cy: 96, r: 6 }, 'dark')
  ],
  joya: [
    s('path', { d: ring(80, 106, 32), ...SW(10) }, 'yellow', { stroke: true }),
    s('path', { d: 'M62 52h36l12 14-30 24-30-24z' }, 'sky', { accent: true }),
    s('path', { d: 'M62 52h36l12 14-30 24-30-24zM50 66h60M72 52l-6 14 14 24 14-24-6-14', ...SW(2) }, 'blue', { stroke: true }),
    s('path', { d: sparkle(124, 40, 10) + sparkle(36, 48, 7) }, 'orange')
  ],
  licenciado: [
    s('path', { d: 'M80 12l-30 14M80 12l30 14', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 22, y: 26, width: 116, height: 90, rx: 3 }, 'brown'),
    s('rect', { x: 30, y: 34, width: 100, height: 74 }, 'cream'),
    s('path', { d: 'M50 50h60M44 64h72M44 76h56', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 98l-6 22 9-6 5 9 3-22zM120 98l6 22-9-6-5 9-3-22z' }, 'red'),
    s('circle', { cx: 112, cy: 94, r: 12 }, 'red', { accent: true })
  ],
  minero: [
    backdrop('dark'),
    s('path', { d: 'M66 52l80-20v44z' }, 'cream'),
    ...person(60, 146, 'orange', { w: 44, h: 54, r: 18 }),
    s('path', { d: 'M40 70q0-26 20-26t20 26z' }, 'yellow', { accent: true }),
    s('path', { d: 'M36 70h48', ...SW(5) }, 'yellow', { stroke: true }),
    s('circle', { cx: 66, cy: 56, r: 6 }, 'white'),
    s('path', { d: 'M90 142L118 76', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 76q18-14 38 4', ...SW(7) }, 'gray', { stroke: true })
  ],
  'narcotráfico': [
    s('rect', { x: 20, y: 76, width: 120, height: 62, rx: 6 }, 'brown', { accent: true }),
    s('path', { d: 'M64 76v-10h32v10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: rects([[30, 86, 30, 20], [65, 86, 30, 20], [100, 86, 30, 20], [46, 110, 30, 20], [84, 110, 30, 20]]) }, 'white'),
    s('path', { d: rects([[30, 86, 30, 20], [65, 86, 30, 20], [100, 86, 30, 20], [46, 110, 30, 20], [84, 110, 30, 20]]), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 52l112-36', ...SW(8) }, 'red', { stroke: true }),
    s('path', { d: ring(80, 36, 20), ...SW(6) }, 'red', { stroke: true })
  ],
  nene: [
    s('circle', { cx: 80, cy: 86, r: 48 }, 'skin'),
    s('path', { d: 'M32 80q0-48 48-48t48 48q-48-14-96 0z' }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 30, r: 7 }, 'sky'),
    s('path', { d: 'M58 92q6 5 12 0M90 92q6 5 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[54, 106], [106, 106]], 6) }, 'pink'),
    s('ellipse', { cx: 80, cy: 116, rx: 14, ry: 7 }, 'pink'),
    s('path', { d: ring(80, 126, 6), ...SW(3) }, 'red', { stroke: true })
  ],
  nocturno: [
    backdrop('navy'),
    s('circle', { cx: 118, cy: 40, r: 18 }, 'yellow'),
    s('circle', { cx: 128, cy: 34, r: 15 }, 'navy'),
    s('path', { d: dots([[30, 30], [70, 24], [96, 60], [136, 76]], 2) }, 'white'),
    s('path', { d: 'M14 126h132', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 92q0-34 24-34t24 34q0 30-24 30t-24-30zM42 62l4-10 8 8zM86 62l-4-10-8 8z' }, 'brown', { accent: true }),
    s('path', { d: dots([[54, 80], [74, 80]], 9) }, 'white'),
    s('path', { d: dots([[54, 80], [74, 80]], 4) + 'M60 90h8l-4 6z' }, 'dark')
  ],
  out: [
    s('circle', { cx: 34, cy: 40, r: 14 }, 'white'),
    s('path', { d: ring(34, 40, 14), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M26 30q6 10 0 20M42 30q-6 10 0 20', ...SW(2) }, 'red', { stroke: true, accent: true }),
    ...person(76, 146, 'dark', { w: 46, h: 56, r: 18 }),
    s('path', { d: 'M60 70q0-18 16-18t16 18zM88 66h12v4H88z' }, 'black'),
    s('path', { d: 'M96 100l20-52', ...SW(9) }, 'dark', { stroke: true }),
    s('circle', { cx: 118, cy: 42, r: 9 }, 'skin')
  ],
  panel: [
    s('circle', { cx: 34, cy: 34, r: 14 }, 'yellow'),
    s('path', { d: rays(34, 34, 18, 24, 8), ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M80 118v22M60 140h40', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 72h96l16 46H18z' }, 'navy', { accent: true }),
    s('path', { d: 'M28 88h108M22 104h120M68 72l-6 46M100 72l4 46', ...SW(2) }, 'sky', { stroke: true })
  ],
  plenamente: [
    s('path', { d: 'M44 28h72l-8 112H52z' }, 'sky'),
    s('path', { d: 'M46 34h68l-7 102H53z' }, 'blue', { accent: true }),
    s('path', { d: 'M44 28h72l-8 112H52z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: drop(124, 50, 4) + drop(36, 60, 3) }, 'blue'),
    s('path', { d: 'M60 50v60', ...SW(4) }, 'sky', { stroke: true })
  ],
  precedente: [
    s('path', { d: 'M60 146q-10-50 20-80t10-52', ...SW(40) }, 'tan', { stroke: true }),
    s('path', { d: ells([[70, 120, 4, 7], [62, 104, 4, 7], [76, 88, 4, 7], [86, 72, 4, 7], [84, 54, 4, 7], [94, 40, 4, 7], [88, 24, 4, 7]]) }, 'brown', { accent: true }),
    ...person(40, 146, 'green', { w: 20, h: 28, r: 9 })
  ],
  provecho: [
    s('path', { d: 'M14 128h132', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M28 82h92a46 44 0 0 1-92 0z' }, 'orange', { accent: true }),
    s('ellipse', { cx: 74, cy: 82, rx: 46, ry: 8 }, 'tan'),
    s('path', { d: 'M56 70q-8-10 0-20t0-20M76 70q-8-10 0-20t0-20M96 70q-8-10 0-20t0-20', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 80l30-36', ...SW(5) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 140, cy: 40, rx: 6, ry: 9, transform: 'rotate(40 140 40)' }, 'gray')
  ],
  recorte: [
    ...paper(16, 40, 92, 80),
    s('path', { d: 'M16 80h92', ...DASH(3, '6 5') }, 'dark', { stroke: true }),
    s('path', { d: 'M24 52h60M24 64h48M24 96h60M24 108h40', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 80l-30-7M104 80l-30 7', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 80l18-12M104 80l18 12', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: ring(128, 62, 9) + ring(128, 98, 9), ...SW(5) }, 'red', { stroke: true, accent: true })
  ],
  rector: [
    s('path', { d: rects([[18, 30, 12, 106], [130, 30, 12, 106]]) }, 'gray'),
    s('path', { d: 'M14 30h132', ...SW(6) }, 'gray', { stroke: true }),
    ...person(80, 146, 'black', { w: 52, h: 60, r: 20 }),
    s('path', { d: 'M56 54q24-20 48 0z' }, 'navy'),
    s('path', { d: 'M62 90q18 26 36 0', ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 116, r: 8 }, 'yellow', { accent: true })
  ],
  'respiración': [
    s('path', { d: 'M80 18v42M80 60l-14 12M80 60l14 12', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 66q-34 6-36 52q0 24 20 22q20-2 20-24z' }, 'pink', { accent: true }),
    s('path', { d: 'M94 66q34 6 36 52q0 24-20 22q-20-2-20-24z' }, 'pink'),
    s('path', { d: 'M56 90l-8 14M104 90l8 14', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M30 24q12 6 0 16t0 16M130 24q-12 6 0 16t0 16', ...SW(4) }, 'sky', { stroke: true })
  ],
  'romántico': [
    s('path', { d: 'M14 128h132', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 36, y: 72, width: 18, height: 56, rx: 3 }, 'cream'),
    outline({ x: 36, y: 72, width: 18, height: 56, rx: 3 }),
    s('path', { d: drop(45, 62, 6) }, 'orange'),
    s('path', { d: 'M104 128V84', ...SW(4) }, 'green', { stroke: true }),
    s('circle', { cx: 104, cy: 78, r: 13 }, 'red', { accent: true }),
    s('path', { d: heart(76, 40, 14) + heart(122, 30, 9) }, 'pink')
  ],
  seno: [
    s('path', { d: 'M18 80h126M28 24v112', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 80C40 26 52 26 64 80S88 134 100 80S124 26 136 80', ...SW(6) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: dots([[46, 40], [82, 120], [118, 40]], 5) }, 'orange')
  ],
  separar: [
    s('path', { d: rects([[16, 88, 36, 50]]) }, 'blue', { accent: true }),
    s('path', { d: rects([[62, 88, 36, 50]]) }, 'green'),
    s('path', { d: rects([[108, 88, 36, 50]]) }, 'yellow'),
    s('path', { d: 'M12 84h44M58 84h44M104 84h44', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 30h12v6l3 6v26H25V42l3-6z' }, 'sky'),
    s('path', { d: leaflet(70, 66, -60, 30, 10) }, 'green'),
    s('path', { d: 'M114 40h24v30h-24z', ...SW(3) }, 'gray', { stroke: true })
  ],
  suelta: [
    s('path', { d: 'M18 116q24-8 40 6q10 8 22 8q12 0 22-8q16-14 40-6q-10 24-62 28q-52-4-62-28z' }, 'skin'),
    s('path', { d: 'M56 70q16-24 40-16q-10 4-12 12l22 4q-18 16-38 6z' }, 'sky', { accent: true }),
    s('path', { d: 'M78 64q10-30 34-34q-6 18-24 30z' }, 'blue'),
    s('circle', { cx: 64, cy: 66, r: 2.5 }, 'dark'),
    s('path', { d: 'M50 74l-8 2M56 90l-8 8M80 96l-2 10', ...SW(3) }, 'gray', { stroke: true })
  ],
  'supervisión': [
    s('path', { d: 'M24 52q56-44 112 0q-56 44-112 0z' }, 'white'),
    s('path', { d: 'M24 52q56-44 112 0q-56 44-112 0z', ...SW(4) }, 'navy', { stroke: true }),
    s('circle', { cx: 80, cy: 52, r: 16 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 52, r: 7 }, 'black'),
    s('path', { d: 'M70 76l-26 34M90 76l26 34', ...DASH(2, '4 4') }, 'gray', { stroke: true }),
    s('path', { d: dots([[40, 116], [80, 112], [120, 116]], 9) }, 'skin'),
    s('path', { d: busts([40, 80, 120], 146, 22, 22) }, 'orange'),
    s('path', { d: 'M30 110a10 10 0 0 1 20 0zM70 106a10 10 0 0 1 20 0zM110 110a10 10 0 0 1 20 0z' }, 'yellow')
  ],
  tirado: [
    s('rect', { x: 14, y: 112, width: 132, height: 34, rx: 8 }, 'green'),
    s('circle', { cx: 30, cy: 100, r: 13 }, 'skin'),
    s('rect', { x: 44, y: 90, width: 62, height: 22, rx: 10 }, 'blue', { accent: true }),
    s('path', { d: 'M104 102h34', ...SW(10) }, 'navy', { stroke: true }),
    s('path', { d: 'M24 98h5M34 98h5', ...SW(2) }, 'dark', { stroke: true }),
    s('circle', { cx: 120, cy: 38, r: 14 }, 'yellow'),
    s('path', { d: 'M32 54q4-8 10 0t10 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  'tripulación': [
    s('path', { d: 'M20 40h112l12-12v24H20q-8-6 0-12zM70 40l16-22h12l-6 22zM70 52l16 18h12l-6-18z' }, 'gray'),
    ...person(40, 144, 'navy', { w: 28, h: 46, r: 13 }),
    ...person(80, 144, 'navy', { w: 28, h: 46, r: 13, accent: true }),
    ...person(120, 144, 'navy', { w: 28, h: 46, r: 13 }),
    s('path', { d: 'M28 78h24v-6H28zM68 78h24v-6H68zM108 78h24v-6h-24z' }, 'white'),
    s('path', { d: 'M28 78h24M68 78h24M108 78h24', ...SW(3) }, 'yellow', { stroke: true })
  ],
  vegetal: [
    s('path', { d: 'M30 50l26 90 14-86z' }, 'orange', { accent: true }),
    s('path', { d: 'M46 52l-8-26M54 52l4-28M62 52l12-22', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M102 136l-4-40h16l-4 40z' }, 'mint'),
    s('path', { d: dots([[92, 76], [106, 66], [122, 76], [100, 92], [116, 92]], 13) }, 'green'),
    s('circle', { cx: 132, cy: 124, r: 12 }, 'red')
  ],
  abc: [
    ground(),
    s('rect', { x: 22, y: 92, width: 44, height: 44, rx: 4 }, 'red', { accent: true }),
    s('rect', { x: 94, y: 92, width: 44, height: 44, rx: 4 }, 'blue'),
    s('rect', { x: 58, y: 48, width: 44, height: 44, rx: 4 }, 'yellow'),
    s('circle', { cx: 44, cy: 114, r: 12 }, 'white'),
    s('path', { d: 'M116 102l12 22h-24z' }, 'white'),
    s('rect', { x: 70, y: 60, width: 20, height: 20 }, 'orange')
  ],
  agregado: [
    ground(),
    s('rect', { x: 18, y: 56, width: 64, height: 80 }, 'gray'),
    s('path', { d: 'M14 58l36-24 36 24z' }, 'dark'),
    s('path', { d: rects([[28, 70, 14, 14], [58, 70, 14, 14], [40, 104, 20, 32]]) }, 'sky'),
    s('path', { d: 'M96 136V22', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 22h28l-6 9 6 9H96z' }, 'green'),
    ...person(122, 136, 'navy', { w: 26, h: 44, r: 12 }),
    s('rect', { x: 102, y: 112, width: 22, height: 16, rx: 2 }, 'brown', { accent: true })
  ],
  asilo: [
    ground(),
    s('rect', { x: 26, y: 70, width: 80, height: 66 }, 'cream'),
    outline({ x: 26, y: 70, width: 80, height: 66 }),
    s('path', { d: 'M14 74l52-44 52 44z' }, 'red', { accent: true }),
    s('path', { d: 'M54 136v-30h24v30z' }, 'brown'),
    s('path', { d: heart(66, 56, 8) }, 'white'),
    ...person(128, 136, 'purple', { w: 24, h: 42, r: 11 }),
    s('path', { d: 'M142 136v-36q0-6-6-6', ...SW(3) }, 'brown', { stroke: true })
  ],
  'biología': [
    s('path', { d: 'M60 18c0 30 40 32 40 62s-40 32-40 62', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M100 18c0 30-40 32-40 62s40 32 40 62', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M66 30h28M74 44h12M74 66h12M66 92h28M74 116h12M66 132h28', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: leaflet(116, 140, -60, 30, 9) }, 'green')
  ],
  'bélgico': [
    s('rect', { x: 24, y: 40, width: 104, height: 84, rx: 12 }, 'orange', { accent: true }),
    s('path', { d: 'M24 61h104M24 82h104M24 103h104M50 40v84M76 40v84M102 40v84', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: ells([[80, 46, 22, 12], [80, 36, 12, 8]]) }, 'white'),
    s('path', { d: drop(118, 44, 9) }, 'red'),
    s('path', { d: 'M114 30l4 6 4-6', ...SW(3) }, 'green', { stroke: true })
  ],
  capitular: [
    backdrop('sky'),
    s('path', { d: 'M100 136V22', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 24q18-8 40 0v34q-22-8-40 0z' }, 'white', { accent: true }),
    s('path', { d: 'M100 24q18-8 40 0v34q-22-8-40 0z', ...SW(2) }, 'gray', { stroke: true }),
    ...person(54, 146, 'gray', { w: 32, h: 48, r: 14 }),
    s('path', { d: 'M42 104L32 66M66 104l10-38', ...SW(7) }, 'skin', { stroke: true })
  ],
  centrar: [
    s('circle', { cx: 80, cy: 80, r: 40 }, 'red'),
    s('circle', { cx: 80, cy: 80, r: 27 }, 'white'),
    s('circle', { cx: 80, cy: 80, r: 14 }, 'red', { accent: true }),
    arrow('M18 18l30 30M48 34v14H34M142 18l-30 30M112 34v14h14M18 142l30-30M48 126v-14H34M142 142l-30-30M112 126v-14h14', 'navy', 5)
  ],
  'compensación': [
    s('path', { d: 'M18 96h40l-4 34H26z' }, 'sky'),
    s('path', { d: 'M22 80l14-6 6 14zM44 74l12 4-4 12z' }, 'sky'),
    s('path', { d: 'M22 104l10 8M44 100l-6 14', ...SW(3) }, 'blue', { stroke: true }),
    arrow('M68 96h24M84 88l8 8-8 8', 'green', 5),
    s('path', { d: ells([[120, 128, 20, 6], [120, 118, 20, 6], [120, 108, 20, 6]]) }, 'orange'),
    s('ellipse', { cx: 120, cy: 100, rx: 20, ry: 6 }, 'yellow', { accent: true }),
    s('circle', { cx: 120, cy: 70, r: 14 }, 'yellow'),
    s('path', { d: ring(120, 70, 9), ...SW(3) }, 'orange', { stroke: true })
  ],
  'competición': [
    s('path', { d: rects([[58, 90, 44, 50]]) }, 'yellow', { accent: true }),
    s('path', { d: rects([[16, 106, 42, 34]]) }, 'gray'),
    s('path', { d: rects([[102, 116, 42, 24]]) }, 'orange'),
    s('path', { d: dots([[37, 76], [80, 58], [123, 86]], 10) }, 'skin'),
    s('path', { d: busts([37], 106, 22, 18) + busts([80], 90, 22, 18) + busts([123], 116, 22, 18) }, 'blue'),
    s('path', { d: star(80, 26, 12) }, 'yellow')
  ],
  concejo: [
    s('path', { d: dots([[34, 84], [126, 84], [56, 48], [104, 48], [56, 120], [104, 120]], 14) }, 'navy'),
    s('ellipse', { cx: 80, cy: 84, rx: 46, ry: 26 }, 'brown', { accent: true }),
    s('path', { d: dots([[34, 84], [126, 84], [56, 46], [104, 46], [56, 122], [104, 122]], 8) }, 'skin'),
    s('path', { d: rects([[54, 74, 14, 18], [92, 76, 14, 18]]) }, 'white'),
    s('path', { d: 'M76 80l10 10', ...SW(4) }, 'tan', { stroke: true })
  ],
  consiguiente: [
    s('path', { d: 'M14 128h132', ...SW(5) }, 'blue', { stroke: true }),
    s('ellipse', { cx: 112, cy: 104, rx: 26, ry: 18 }, 'tan', { accent: true }),
    s('circle', { cx: 128, cy: 76, r: 12 }, 'tan'),
    s('path', { d: 'M138 74l10 4-10 4z' }, 'orange'),
    s('path', { d: ells([[70, 114, 12, 9], [42, 116, 11, 8]]) + dots([[78, 100], [49, 103]], 7) }, 'yellow'),
    s('path', { d: 'M84 98l6 2-6 3zM55 101l5 2-5 3z' }, 'orange'),
    s('path', { d: dots([[130, 74], [80, 99], [51, 102]], 1.8) }, 'dark')
  ],
  contactar: [
    s('path', { d: 'M30 60q-8-30 18-36l8 22-12 8q6 22 22 34l10-10 22 10q-4 26-34 18q-28-12-34-46z' }, 'green', { accent: true }),
    s('path', { d: 'M92 40a20 20 0 0 1 20 20M92 22a38 38 0 0 1 38 38', ...SW(5) }, 'orange', { stroke: true }),
    s('rect', { x: 86, y: 96, width: 56, height: 38, rx: 3 }, 'white'),
    s('path', { d: 'M86 96h56v38H86zM86 98l28 20 28-20', ...SW(3) }, 'blue', { stroke: true })
  ],
  'contratación': [
    ...paper(22, 18, 80, 112),
    s('path', { d: 'M34 36h56M34 50h56M34 64h40', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 104q6-14 12-2t10-4 10 6 8-4', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M136 46l-46 64', ...SW(8) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M90 110l-4 12 10-6z' }, 'dark'),
    s('rect', { x: 108, y: 100, width: 34, height: 44, rx: 4 }, 'orange'),
    s('circle', { cx: 125, cy: 116, r: 7 }, 'skin'),
    s('path', { d: 'M116 134h18', ...SW(3) }, 'white', { stroke: true })
  ],
  'demostración': [
    s('rect', { x: 62, y: 18, width: 82, height: 62, rx: 4 }, 'navy'),
    s('path', { d: 'M74 66h10V50H74zM90 66h10V40H90zM106 66h10V30h-10z' }, 'yellow', { accent: true }),
    s('path', { d: 'M103 80v20M90 100h26', ...SW(4) }, 'gray', { stroke: true }),
    ...person(36, 146, 'green', { w: 34, h: 52, r: 15 }),
    s('path', { d: 'M48 104l22-34', ...SW(6) }, 'skin', { stroke: true })
  ],
  'demócrata': [
    s('path', { d: 'M40 100V56M80 96V48M120 100V56', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: dots([[40, 52], [80, 44], [120, 52]], 7) }, 'skin'),
    s('path', { d: dots([[28, 112], [80, 108], [132, 112]], 13) }, 'skin'),
    s('path', { d: busts([28, 132], 146, 30, 24) }, 'blue'),
    s('path', { d: busts([80], 146, 30, 28) }, 'orange', { accent: true })
  ],
  descendiente: [
    s('path', { d: 'M80 34v24M44 58h72M44 58v28M116 58v28M44 86l-20 26M44 86l20 26M116 86l-20 26M116 86l20 26', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 28, r: 14 }, 'brown'),
    s('path', { d: dots([[44, 86], [116, 86]], 12) }, 'orange'),
    s('path', { d: dots([[24, 120], [64, 120], [96, 120], [136, 120]], 10) }, 'green', { accent: true }),
    arrow('M80 132v10M74 138l6 6 6-6', 'navy', 3)
  ],
  'diplomático': [
    ...person(36, 112, 'navy', { w: 30, h: 40, r: 13 }),
    ...person(124, 112, 'dark', { w: 30, h: 40, r: 13 }),
    s('rect', { x: 14, y: 106, width: 132, height: 12, rx: 3 }, 'brown'),
    s('path', { d: 'M24 118v26M136 118v26M68 106V76M92 106V76', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M68 76h-16l4 6-4 6h16z' }, 'green', { accent: true }),
    s('path', { d: 'M92 76h16l-4 6 4 6H92z' }, 'purple')
  ],
  directorio: [
    s('rect', { x: 28, y: 20, width: 88, height: 120, rx: 6 }, 'red', { accent: true }),
    s('rect', { x: 36, y: 28, width: 74, height: 104, rx: 2 }, 'white'),
    s('path', { d: dots([[46, 44], [46, 62], [46, 80], [46, 98], [46, 116]], 4) }, 'skin'),
    s('path', { d: 'M56 44h44M56 62h44M56 80h44M56 98h44M56 116h30', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: rects([[116, 30, 14, 18]]) }, 'yellow'),
    s('path', { d: rects([[116, 54, 14, 18]]) }, 'green'),
    s('path', { d: rects([[116, 78, 14, 18]]) }, 'blue')
  ],
  elaborado: [
    s('ellipse', { cx: 80, cy: 138, rx: 56, ry: 7 }, 'gray'),
    s('rect', { x: 32, y: 104, width: 96, height: 32, rx: 4 }, 'pink'),
    s('rect', { x: 46, y: 74, width: 68, height: 30, rx: 4 }, 'cream'),
    s('rect', { x: 60, y: 48, width: 40, height: 26, rx: 4 }, 'pink', { accent: true }),
    s('path', { d: 'M32 110q8 8 16 0t16 0 16 0 16 0 16 0 16 0M46 80q8 8 17 0t17 0 17 0 17 0', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: dots([[40, 124], [64, 124], [96, 124], [120, 124], [72, 92], [88, 92]], 4) }, 'red'),
    s('path', { d: 'M80 48V30', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: drop(80, 24, 4) }, 'orange')
  ],
  escaso: [
    s('path', { d: 'M40 40h80v88a12 12 0 0 1-12 12H52a12 12 0 0 1-12-12z' }, 'sky'),
    s('rect', { x: 36, y: 28, width: 88, height: 14, rx: 4 }, 'gray'),
    s('circle', { cx: 70, cy: 128, r: 9 }, 'tan', { accent: true }),
    s('path', { d: dots([[92, 134], [100, 130]], 2.5) }, 'brown'),
    s('path', { d: 'M40 40h80v88a12 12 0 0 1-12 12H52a12 12 0 0 1-12-12z', ...SW(3) }, 'blue', { stroke: true })
  ],
  excepcional: [
    ground(),
    s('path', { d: 'M26 136V104M50 136V104M110 136V104M134 136V104M80 136V86', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots([[26, 98], [50, 98], [110, 98], [134, 98]], 9) }, 'gray'),
    s('path', { d: star(80, 62, 28) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(124, 34, 9) + sparkle(36, 38, 7) }, 'orange')
  ],
  'exhibición': [
    s('path', { d: 'M80 14l-34 42h68z' }, 'cream'),
    s('rect', { x: 54, y: 104, width: 52, height: 40 }, 'gray'),
    s('rect', { x: 48, y: 98, width: 64, height: 8 }, 'dark'),
    s('path', { d: 'M68 98q-14-18 4-32h16q18 14 4 32z' }, 'blue', { accent: true }),
    s('path', { d: 'M72 66v-8h16v8', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M50 98V44h60v54', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M20 140V112M140 140V112M20 114q16 10 26 0M140 114q-16 10-26 0', ...SW(3) }, 'red', { stroke: true })
  ],
  experimentado: [
    ...person(60, 146, 'brown', { w: 44, h: 56, r: 18 }),
    s('path', { d: 'M46 74q14 26 28 0v8q-14 20-28 0z' }, 'white'),
    s('path', { d: 'M42 66q2-22 18-22t18 22q-4-12-18-12t-18 12z' }, 'gray'),
    s('path', { d: 'M86 120l30-30', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 108, y: 74, width: 26, height: 14, rx: 3, transform: 'rotate(-45 121 81)' }, 'gray'),
    s('path', { d: star(100, 30, 9) + star(122, 26, 9) }, 'yellow', { accent: true })
  ],
  fauna: [
    s('rect', { x: 14, y: 120, width: 132, height: 26, rx: 8 }, 'green'),
    s('path', { d: ells([[38, 70, 5, 16], [50, 70, 5, 16]]) }, 'gray'),
    s('ellipse', { cx: 44, cy: 108, rx: 18, ry: 16 }, 'gray'),
    s('circle', { cx: 44, cy: 88, r: 11 }, 'gray'),
    s('path', { d: 'M86 120q0-26 24-26t24 26z' }, 'green', { accent: true }),
    s('path', { d: 'M90 104l-8-4 2 8zM134 112q8-2 10 6' }, 'mint'),
    s('ellipse', { cx: 100, cy: 42, rx: 14, ry: 10 }, 'blue'),
    s('path', { d: 'M100 38q-10-16-24-12q10 8 18 14zM112 40l8-2-6 6z' }, 'sky'),
    s('path', { d: dots([[40, 86], [104, 40]], 2) }, 'dark')
  ],
  flash: [
    s('path', { d: burst(84, 42, 30, 14, 12) }, 'yellow', { accent: true }),
    s('rect', { x: 66, y: 50, width: 36, height: 22, rx: 3 }, 'gray'),
    s('rect', { x: 72, y: 72, width: 24, height: 14 }, 'dark'),
    s('rect', { x: 30, y: 86, width: 100, height: 54, rx: 8 }, 'dark'),
    s('circle', { cx: 80, cy: 113, r: 18 }, 'sky'),
    s('path', { d: ring(80, 113, 18), ...SW(4) }, 'gray', { stroke: true })
  ],
  'helicóptero': [
    s('path', { d: 'M24 28h112', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 28v14', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M90 76h46', ...SW(9) }, 'red', { stroke: true }),
    s('path', { d: 'M136 64v24', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M38 74q0-32 34-32h16q18 0 18 32q0 22-26 22H58q-20 0-20-22z' }, 'red', { accent: true }),
    s('path', { d: 'M44 70q2-20 24-20v20z' }, 'sky'),
    s('path', { d: 'M54 96v14M90 96v14M38 112h70', ...SW(4) }, 'gray', { stroke: true })
  ],
  heredero: [
    ground(),
    ...person(48, 136, 'purple', { w: 36, h: 58, r: 15 }),
    s('path', { d: 'M38 58q10 16 20 0v8q-10 12-20 0z' }, 'white'),
    ...person(118, 136, 'blue', { w: 26, h: 36, r: 12 }),
    s('path', { d: 'M104 66V52l7 6 7-10 7 10 7-6v14z' }, 'yellow', { accent: true }),
    arrow('M66 40q30-20 48 4M106 36l8 8 2-11', 'orange', 4),
    s('path', { d: 'M62 100l14-8', ...SW(6) }, 'skin', { stroke: true })
  ],
  lidiar: [
    ...person(80, 146, 'green', { w: 40, h: 52, r: 18 }),
    s('path', { d: 'M62 100L44 84M98 100l18-16', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M44 70q36-70 72 0', ...DASH(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 44, cy: 70, r: 9 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 24, r: 9 }, 'blue'),
    s('circle', { cx: 116, cy: 70, r: 9 }, 'yellow'),
    s('rect', { x: 52, y: 34, width: 18, height: 14, rx: 2, transform: 'rotate(-20 61 41)' }, 'orange'),
    s('path', { d: drop(100, 62, 3) }, 'sky')
  ],
  miserable: [
    s('path', { d: 'M40 50a14 14 0 0 1 8-24a20 20 0 0 1 36-6a16 16 0 0 1 30 10a12 12 0 0 1 0 20z' }, 'gray'),
    s('path', { d: 'M54 60l-4 10M74 60l-4 10M94 60l-4 10M112 60l-4 10', ...SW(3) }, 'blue', { stroke: true }),
    ...person(80, 146, 'navy', { w: 40, h: 50, r: 18 }),
    s('path', { d: 'M70 100q10-8 20 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M70 90l6-2M90 90l-6-2', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: drop(68, 104, 3) }, 'sky', { accent: true })
  ],
  montaje: [
    s('rect', { x: 22, y: 76, width: 70, height: 56, rx: 2 }, 'tan'),
    s('rect', { x: 22, y: 60, width: 70, height: 16, rx: 2 }, 'brown'),
    s('rect', { x: 100, y: 40, width: 18, height: 70, rx: 2, transform: 'rotate(18 109 75)' }, 'tan', { accent: true }),
    s('path', { d: dots([[32, 86], [82, 86], [32, 122], [82, 122]], 3) }, 'dark'),
    s('path', { d: 'M138 112l-22 18', ...SW(7) }, 'red', { stroke: true }),
    s('path', { d: 'M116 130l-10 8', ...SW(3) }, 'gray', { stroke: true }),
    arrow('M60 34h28M80 26l8 8-8 8', 'green', 4)
  ],
  normalidad: [
    s('rect', { x: 14, y: 30, width: 132, height: 90, rx: 8 }, 'dark'),
    s('path', { d: 'M22 80h28l8-20 10 40 10-20h12l8-20 10 40 8-20h20', ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M60 120v16M100 120v16M48 136h64', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 128, cy: 44, r: 6 }, 'green')
  ],
};
