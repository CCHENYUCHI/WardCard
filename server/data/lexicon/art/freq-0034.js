// Illustration specs for words still undrawn in batches 0032–0035 (see server/scripts/lexicon/art.js)
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

// A horse seen from the side, facing right (body centred near 76, 84)
const horse = (color, mane = 'brown', opts = {}) => [
  s('path', { d: 'M50 96v40M62 98v38M92 98v38M104 96v40', ...SW(8) }, color, { stroke: true }),
  s('path', { d: 'M34 80q-14 10-10 36', ...SW(7) }, mane, { stroke: true }),
  s('path', { d: ells([[76, 84, 44, 20]]) + 'M98 76l12-38 18 4-8 40z' }, color, opts),
  s('ellipse', { cx: 130, cy: 46, rx: 16, ry: 9, transform: 'rotate(35 130 46)' }, color),
  s('path', { d: 'M110 36l-8 32', ...SW(6) }, mane, { stroke: true })
];

module.exports = {
  adolescencia: [
    ground(),
    ...person(46, 136, 'green', { h: 30, w: 22, r: 10 }),
    ...person(110, 136, 'blue', { h: 52, w: 28, r: 13, accent: true }),
    s('path', { d: 'M95 70a15 15 0 0 1 30 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[95, 72], [125, 72]], 5) }, 'red'),
    arrow('M76 116V56M66 66l10-10 10 10', 'orange', 5)
  ],
  ajedrez: [
    s('rect', { x: 20, y: 96, width: 120, height: 40 }, 'cream'),
    s('path', { d: checker(20, 96, 6, 2, 20) }, 'brown'),
    s('rect', { x: 20, y: 96, width: 120, height: 40, ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 92h40l-4-10H64z' }, 'dark'),
    s('path', { d: 'M68 82l6-28h12l6 28z' }, 'dark', { accent: true }),
    s('rect', { x: 66, y: 50, width: 28, height: 6, rx: 3 }, 'dark'),
    s('circle', { cx: 80, cy: 38, r: 13 }, 'dark')
  ],
  alfa: [
    ground(140),
    s('rect', { x: 58, y: 88, width: 44, height: 52 }, 'yellow', { accent: true }),
    s('rect', { x: 16, y: 108, width: 42, height: 32 }, 'gray'),
    s('rect', { x: 102, y: 118, width: 42, height: 22 }, 'tan'),
    ...person(80, 88, 'red', { h: 34, w: 24, r: 11 }),
    s('path', { d: star(80, 22, 12) }, 'orange'),
    s('path', { d: dots([[37, 124]], 7) + dots([[123, 129]], 5) }, 'white')
  ],
  aplauso: [
    s('rect', { x: 50, y: 38, width: 28, height: 76, rx: 13, transform: 'rotate(-16 64 114)' }, 'skin'),
    s('rect', { x: 82, y: 38, width: 28, height: 76, rx: 13, transform: 'rotate(16 96 114)' }, 'tan'),
    s('rect', { x: 54, y: 112, width: 52, height: 30, rx: 6 }, 'blue'),
    s('path', { d: 'M38 46L24 34M34 66H18M122 46l14-12M126 66h16', ...SW(5) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: sparkle(80, 22, 10) }, 'yellow')
  ],
  bancario: [
    s('path', { d: 'M18 54l42-30 42 30z' }, 'gray'),
    s('path', { d: rects([[24, 58, 8, 40], [44, 58, 8, 40], [68, 58, 8, 40], [88, 58, 8, 40], [18, 98, 84, 8]]) }, 'gray'),
    s('rect', { x: 52, y: 86, width: 92, height: 58, rx: 8 }, 'blue', { accent: true }),
    s('rect', { x: 52, y: 98, width: 92, height: 10 }, 'navy'),
    s('rect', { x: 64, y: 116, width: 18, height: 14, rx: 3 }, 'yellow'),
    s('circle', { cx: 128, cy: 126, r: 8 }, 'orange')
  ],
  callado: [
    s('circle', { cx: 80, cy: 80, r: 58 }, 'skin'),
    s('path', { d: dots([[60, 66], [100, 66]], 6) }, 'dark'),
    s('path', { d: 'M52 104h56', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 104h44', ...SW(3, { 'stroke-dasharray': '3 4' }) }, 'dark', { stroke: true }),
    s('rect', { x: 104, y: 96, width: 10, height: 18, rx: 3 }, 'yellow', { accent: true })
  ],
  cazador: [
    ground(),
    ...person(58, 136, 'green', { h: 50, w: 30, r: 13 }),
    s('path', { d: 'M38 52h40M46 52q2-16 12-16t12 16', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 46q30 34 0 76', ...SW(5) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M100 46v76', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M72 84h60M126 78l8 6-8 6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M72 84l-6-5v10z' }, 'red')
  ],
  celeste: [
    backdrop('sky'),
    s('path', { d: ells([[54, 62, 26, 14], [76, 52, 20, 16], [96, 64, 22, 12]]) }, 'white'),
    s('circle', { cx: 120, cy: 36, r: 12 }, 'yellow'),
    s('path', { d: 'M28 116q30-18 60 0t44 0', ...SW(12) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M100 136l20-28', ...SW(6) }, 'brown', { stroke: true })
  ],
  'compasión': [
    s('path', { d: heart(80, 80, 20) }, 'red', { accent: true }),
    s('path', { d: 'M18 98q8 40 62 40q54 0 62-40l-16-6q-8 28-46 28t-46-28z' }, 'skin'),
    s('path', { d: 'M18 98l8-12 18 8M142 98l-8-12-18 8', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: drop(122, 44, 6) }, 'blue'),
    s('path', { d: 'M62 58q4-8 12-8', ...SW(3) }, 'white', { stroke: true })
  ],
  'computación': [
    s('rect', { x: 26, y: 28, width: 108, height: 74, rx: 6 }, 'dark'),
    s('rect', { x: 34, y: 36, width: 92, height: 58, rx: 2 }, 'sky'),
    s('path', { d: 'M14 112h132l-10 18H24z' }, 'gray'),
    s('rect', { x: 66, y: 114, width: 28, height: 5, rx: 2 }, 'dark'),
    ...gear(80, 65, 13, 8, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 65, r: 5 }, 'sky')
  ],
  conversar: [
    s('rect', { x: 38, y: 120, width: 84, height: 8, rx: 3 }, 'brown'),
    s('circle', { cx: 32, cy: 88, r: 14 }, 'skin'),
    s('path', { d: busts([32], 140, 32, 36) }, 'red'),
    s('circle', { cx: 128, cy: 88, r: 14 }, 'skin'),
    s('path', { d: busts([128], 140, 32, 36) }, 'green'),
    s('path', { d: bubble(16, 18, 60, 40) }, 'sky', { accent: true }),
    s('path', { d: 'M144 30h-50v26h10v10l12-10h28z' }, 'mint'),
    s('path', { d: dots([[34, 38], [46, 38], [58, 38], [108, 43], [120, 43], [132, 43]], 3) }, 'navy')
  ],
  cooperativa: [
    s('path', { d: 'M16 70l64-46 64 46', ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('path', { d: dots([[46, 84], [80, 78], [114, 84]], 12) }, 'skin'),
    s('path', { d: busts([46, 114], 136, 30, 36) }, 'blue'),
    s('path', { d: busts([80], 136, 32, 42) }, 'green'),
    s('path', { d: 'M56 112h48', ...SW(6) }, 'skin', { stroke: true }),
    ground(138)
  ],
  debatir: [
    s('path', { d: 'M18 98h40l-4 40H22z' }, 'brown'),
    s('path', { d: 'M102 98h40l-4 40h-32z' }, 'brown'),
    s('circle', { cx: 38, cy: 72, r: 13 }, 'skin'),
    s('circle', { cx: 122, cy: 72, r: 13 }, 'skin'),
    s('path', { d: busts([38, 122], 98, 30, 12) }, 'navy'),
    s('path', { d: bubble(20, 14, 52, 34) }, 'red', { accent: true }),
    s('path', { d: 'M140 14H96a8 8 0 0 0-8 8v14a8 8 0 0 0 8 8h24l10 10V44h10z' }, 'blue'),
    s('path', { d: 'M78 64l6-10h-6l6-10', ...SW(3) }, 'orange', { stroke: true })
  ],
  ecuatoriano: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'blue'),
    s('path', { d: 'M52 34q20-6 28 8q-2 14-14 18q4 16-4 34q-6 18-2 30q-22-18-20-46q-8-26 12-44z' }, 'green'),
    s('path', { d: 'M96 56q22-6 30 10q-4 20-20 18q-10-10-10-28z' }, 'green'),
    s('path', { d: 'M20 80q60 18 120 0', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M54 82l8-14 8 14z' }, 'white')
  ],
  estafa: [
    s('path', { d: 'M80 14v24', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 38v26a12 12 0 0 1-24 0v-8l-6 6', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 50, y: 82, width: 60, height: 50, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M50 100h60M80 82v50', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M80 82q-14-14-22-4q4 6 22 4q14-14 22-4q-4 6-22 4', ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 128, cy: 120, r: 14 }, 'yellow'),
    s('circle', { cx: 128, cy: 120, r: 8 }, 'orange'),
    s('path', { d: sparkle(124, 40, 12) + sparkle(34, 60, 8) }, 'yellow')
  ],
  excesivo: [
    s('path', { d: 'M18 136q30-12 62-6t62 6z' }, 'sky'),
    s('path', { d: 'M54 40h52l-6 90H60z' }, 'blue', { accent: true }),
    s('path', { d: 'M54 40h52l-6 90H60z', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M50 42q-6 0-8 14t-6 40M110 42q6 0 8 14t6 40', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: ells([[80, 38, 30, 8]]) }, 'blue'),
    s('path', { d: drop(30, 112, 5) + drop(132, 108, 5) + drop(80, 22, 4) }, 'blue')
  ],
  favorecer: [
    s('path', { d: 'M80 32v96M56 136h48', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 70l104-26', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M28 70l-12 26M28 70l12 26M132 44l-12 26M132 44l12 26', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M12 96h32a16 10 0 0 1-32 0zM116 70h32a16 10 0 0 1-32 0z' }, 'gray'),
    s('path', { d: heart(28, 84, 12) }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 32, r: 6 }, 'yellow')
  ],
  flora: [
    ...flower(42, 66, 'pink'),
    s('path', { d: 'M80 136V60M80 112q-14-10-20-26M80 96q14-8 20-24M80 76q-10-8-10-20', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M108 136V84', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M96 70q0 18 12 18t12-18l-6 6-6-10-6 10z' }, 'red'),
    s('path', { d: 'M128 136q-8-26 4-48q12 22 4 48z' }, 'mint')
  ],
  ignorante: [
    s('path', { d: 'M14 136q30-40 66-40t66 40z' }, 'tan'),
    s('ellipse', { cx: 54, cy: 70, rx: 36, ry: 26 }, 'dark', { accent: true }),
    s('path', { d: 'M24 66q-10-6-8-18q8 6 12 4', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 94l-4 38M64 94l6 38', ...SW(5) }, 'pink', { stroke: true }),
    s('path', { d: 'M86 62q30-10 22 54', ...SW(9) }, 'pink', { stroke: true }),
    s('path', { d: 'M86 124q22-26 44 0z' }, 'tan')
  ],
  incidencia: [
    s('path', { d: ells([[80, 112, 64, 20]]) }, 'sky'),
    s('path', { d: ells([[80, 112, 44, 13]]) + ells([[80, 112, 24, 7]]), ...SW(4) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: drop(80, 52, 14) }, 'blue'),
    s('path', { d: drop(48, 92, 4) + drop(114, 90, 4) }, 'blue'),
    s('path', { d: 'M74 50q2-8 6-10', ...SW(3) }, 'white', { stroke: true })
  ],
  insultar: [
    s('circle', { cx: 34, cy: 96, r: 18 }, 'skin'),
    s('path', { d: busts([34], 146, 38, 26) }, 'red'),
    s('ellipse', { cx: 44, cy: 104, rx: 5, ry: 4 }, 'dark'),
    s('path', { d: 'M22 86l10 4M38 90l10-4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: burst(84, 46, 34, 22, 9) }, 'yellow', { accent: true }),
    s('path', { d: 'M70 40l8 8 6-10 6 10 8-8M72 56h24', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 126, cy: 102, r: 16 }, 'skin'),
    s('path', { d: busts([126], 146, 34, 24) }, 'blue'),
    s('path', { d: 'M118 112q8-6 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  intimidad: [
    s('rect', { x: 36, y: 16, width: 88, height: 128, rx: 4 }, 'brown'),
    s('rect', { x: 46, y: 26, width: 68, height: 50, rx: 3 }, 'tan'),
    s('circle', { cx: 108, cy: 90, r: 5 }, 'yellow'),
    s('path', { d: 'M56 82q14-14 28 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 86h44v46H48z' }, 'purple', { accent: true }),
    s('circle', { cx: 70, cy: 96, r: 7 }, 'brown'),
    s('path', { d: 'M74 108a12 12 0 1 0 6 16a10 10 0 0 1-6-16z' }, 'yellow')
  ],
  'matrícula': [
    s('path', { d: 'M20 112V64q0-14 14-16l16-20h60l16 20q14 2 14 16v48z' }, 'red'),
    s('path', { d: 'M54 34h52l12 16H42z' }, 'sky'),
    s('path', { d: rects([[28, 110, 20, 22], [112, 110, 20, 22]]) }, 'dark'),
    s('rect', { x: 50, y: 82, width: 60, height: 26, rx: 4 }, 'white', { accent: true }),
    s('rect', { x: 50, y: 82, width: 60, height: 26, rx: 4, ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: rects([[58, 89, 8, 12], [70, 89, 8, 12], [82, 89, 8, 12], [94, 89, 8, 12]]) }, 'navy'),
    s('path', { d: rects([[26, 62, 18, 10], [116, 62, 18, 10]]) }, 'yellow')
  ],
  palomo: [
    s('path', { d: 'M46 132l6-20M62 132l-2-20', ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: 'M18 74q30-6 54 6q24 30-6 36q-36 4-62-34z' }, 'gray'),
    s('path', { d: 'M86 52q34 6 22 52q-14 16-38 10q-24-18 16-62z' }, 'purple', { accent: true }),
    s('path', { d: 'M78 74q22 8 34 2', ...SW(6) }, 'mint', { stroke: true }),
    s('circle', { cx: 104, cy: 46, r: 18 }, 'gray'),
    s('path', { d: 'M120 42l16 6-16 4z' }, 'dark'),
    s('circle', { cx: 108, cy: 42, r: 4 }, 'orange'),
    s('path', { d: 'M28 84q20 4 40 16', ...SW(3) }, 'dark', { stroke: true })
  ],
  preservar: [
    s('rect', { x: 46, y: 20, width: 68, height: 18, rx: 4 }, 'red'),
    s('path', { d: 'M46 26h68M58 20v18M70 20v18M82 20v18M94 20v18M106 20v18', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M50 40h60q12 8 12 24v62q0 12-12 12H50q-12 0-12-12V64q0-16 12-24z' }, 'sky'),
    s('path', { d: dots([[64, 108], [88, 116], [96, 92], [70, 84], [62, 128], [102, 128]], 11) }, 'red', { accent: true }),
    s('path', { d: 'M50 40h60q12 8 12 24v62q0 12-12 12H50q-12 0-12-12V64q0-16 12-24z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 66v40', ...SW(4) }, 'white', { stroke: true })
  ],
  procesamiento: [
    s('rect', { x: 14, y: 110, width: 132, height: 10, rx: 5 }, 'dark'),
    s('rect', { x: 52, y: 40, width: 56, height: 68, rx: 6 }, 'gray'),
    ...gear(80, 70, 14, 8, 'orange', { accent: true }),
    s('path', { d: dots([[24, 100], [38, 100]], 7) }, 'green'),
    s('path', { d: rects([[114, 90, 18, 18]]) }, 'brown'),
    s('path', { d: dots([[40, 132], [80, 132], [120, 132]], 4) }, 'gray'),
    arrow('M116 60h20M128 52l8 8-8 8', 'blue', 4)
  ],
  pulso: [
    s('rect', { x: 14, y: 28, width: 132, height: 104, rx: 10 }, 'dark'),
    s('path', { d: 'M22 84h30l8-16 10 40 12-62 10 52 6-14h40', ...SW(5) }, 'green', { stroke: true, accent: true }),
    s('path', { d: heart(124, 46, 12) }, 'red'),
    s('path', { d: 'M22 120h116', ...SW(2, { 'stroke-dasharray': '4 6' }) }, 'gray', { stroke: true })
  ],
  quemado: [
    s('path', { d: 'M36 142V70q-12-4-12-18q0-22 56-22t56 22q0 14-12 18v72z' }, 'brown'),
    s('path', { d: 'M46 132V76q-10-4-10-14q0-18 44-18t44 18q0 10-10 14v56z' }, 'black', { accent: true }),
    s('path', { d: 'M60 30q-8-8 0-16M80 28q-8-8 0-16M100 30q-8-8 0-16', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 96l6 6M92 84l4 6M80 112l6-4', ...SW(3) }, 'dark', { stroke: true })
  ],
  seda: [
    s('path', { d: 'M18 40q34-24 64 4t62 0v36q-30 26-62 0t-64 4z' }, 'pink', { accent: true }),
    s('path', { d: 'M18 76q34-24 64 4t62 0', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M30 54q24-14 48 4', ...SW(3) }, 'cream', { stroke: true }),
    s('ellipse', { cx: 56, cy: 118, rx: 26, ry: 16 }, 'cream'),
    s('path', { d: 'M38 112q18 8 36 0M38 122q18 8 36 0', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M82 118q22-4 44 6', ...SW(3) }, 'pink', { stroke: true }),
    s('path', { d: dots([[110, 120], [118, 122], [126, 124]], 4) }, 'gray')
  ],
  sereno: [
    backdrop('navy'),
    s('rect', { x: 14, y: 92, width: 132, height: 54, rx: 0 }, 'blue'),
    s('circle', { cx: 80, cy: 58, r: 20 }, 'cream', { accent: true }),
    s('path', { d: 'M64 104h32M70 116h20M76 126h8', ...SW(4) }, 'cream', { stroke: true }),
    s('path', { d: dots([[32, 34], [124, 30], [130, 70], [36, 72]], 2) }, 'white'),
    s('path', { d: 'M14 92h132', ...SW(2) }, 'sky', { stroke: true })
  ],
  seriedad: [
    s('path', { d: busts([80], 150, 96, 34) }, 'dark'),
    s('path', { d: 'M74 118h12l4 32H70z' }, 'navy'),
    s('circle', { cx: 80, cy: 74, r: 36 }, 'skin'),
    s('path', { d: 'M44 64q0-30 36-30t36 30q-8-14-36-14t-36 14z' }, 'gray'),
    s('path', { d: ring(64, 76, 10) + ring(96, 76, 10) + 'M74 76h12', ...SW(3) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: 'M54 60l18 4M106 60l-18 4M68 98h24', ...SW(4) }, 'dark', { stroke: true })
  ],
  soltero: [
    ground(),
    ...person(52, 136, 'blue', { h: 50, w: 30, r: 13, accent: true }),
    s('path', { d: 'M108 70a12 12 0 1 0 0.1 0M108 96v40', ...DASH(3, '5 5') }, 'gray', { stroke: true }),
    s('path', { d: heart(80, 30, 12) }, 'red'),
    s('path', { d: 'M62 58l8-14', ...SW(3) }, 'pink', { stroke: true })
  ],
  sudeste: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'cream'),
    s('path', { d: ring(80, 80, 62), ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 26l8 46 46 8-46 8-8 46-8-46-46-8 46-8z' }, 'gray'),
    s('path', { d: 'M80 80l44 44-34-50z' }, 'red', { accent: true }),
    s('path', { d: 'M80 80l-44-44 34 50z' }, 'navy'),
    s('circle', { cx: 80, cy: 80, r: 5 }, 'dark')
  ],
  superficial: [
    s('rect', { x: 14, y: 64, width: 132, height: 82, rx: 4 }, 'navy'),
    s('path', { d: 'M56 64l14-30 10 10 12-14 14 34z' }, 'white', { accent: true }),
    s('path', { d: 'M56 64l14-30 10 10 12-14 14 34z', ...SW(2) }, 'sky', { stroke: true }),
    s('path', { d: 'M44 64l-10 34 24 40h52l18-46-20-28z' }, 'sky'),
    s('path', { d: 'M14 64h132', ...SW(4) }, 'blue', { stroke: true })
  ],
  temporalmente: [
    ground(),
    s('path', { d: 'M14 136l40-74 40 74z' }, 'orange', { accent: true }),
    s('path', { d: 'M44 136l10-24 10 24z' }, 'brown'),
    s('path', { d: 'M54 62l-4-10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 40h32M108 112h32M112 40q0 30 12 36q12-6 12-36M112 112q0-30 12-36q12 6 12 36', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M116 106q8-10 16 0zM118 48h12l-6 14z' }, 'yellow')
  ],
  'transacción': [
    s('circle', { cx: 40, cy: 50, r: 22 }, 'yellow', { accent: true }),
    s('circle', { cx: 40, cy: 50, r: 13 }, 'orange'),
    s('rect', { x: 98, y: 92, width: 44, height: 40, rx: 4 }, 'brown'),
    s('path', { d: 'M98 104h44M120 92v12', ...SW(3) }, 'tan', { stroke: true }),
    arrow('M66 46q50-10 62 34M120 70l8 10 8-10', 'blue', 6),
    arrow('M94 122q-50 10-62-34M40 98l-8-10-8 10', 'green', 6)
  ],
  'táctico': [
    s('rect', { x: 14, y: 22, width: 132, height: 116, rx: 6 }, 'green'),
    s('path', { d: 'M80 22v116' + ring(80, 80, 18), ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: dots([[38, 50], [38, 110], [58, 80]], 7) }, 'red', { accent: true }),
    s('path', { d: dots([[110, 46], [118, 100], [130, 74]], 7) }, 'blue'),
    s('path', { d: 'M44 50q40-20 52 8M64 84q30 16 40 30', ...DASH(3, '5 4') }, 'yellow', { stroke: true }),
    s('path', { d: 'M92 52l6 8 4-10M98 108l8 8 2-10', ...SW(3) }, 'yellow', { stroke: true })
  ],
  'valentía': [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'orange'),
    s('path', { d: around(80, 80, 54, 12).map(([x, y]) => `M${x} ${y}`).join('') + rays(80, 80, 44, 62, 12, 15), ...SW(10) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 84, r: 38 }, 'yellow', { accent: true }),
    s('path', { d: dots([[66, 76], [94, 76]], 5) }, 'dark'),
    s('path', { d: 'M72 94h16l-8 8z' }, 'brown'),
    s('path', { d: 'M80 102v8M70 112q10 6 20 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  variar: [
    s('rect', { x: 18, y: 18, width: 124, height: 124, rx: 12 }, 'dark'),
    s('path', { d: 'M44 34v92M80 34v92M116 34v92', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 32, y: 92, width: 24, height: 14, rx: 4 }, 'green'),
    s('rect', { x: 68, y: 46, width: 24, height: 14, rx: 4 }, 'yellow', { accent: true }),
    s('rect', { x: 104, y: 74, width: 24, height: 14, rx: 4 }, 'red'),
    arrow('M80 76v24M74 94l6 6 6-6M80 30v0', 'sky', 3)
  ],
  vestuario: [
    s('path', { d: rects([[16, 22, 40, 116], [104, 22, 40, 116]]) }, 'blue'),
    s('rect', { x: 60, y: 22, width: 40, height: 116 }, 'navy'),
    s('path', { d: 'M24 34h24M24 40h24M112 34h24M112 40h24', ...SW(2) }, 'sky', { stroke: true }),
    s('path', { d: 'M80 52l-10 8h20z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 60l12 6h12l12-6 4 16-8 2v44H66V78l-8-2z' }, 'red', { accent: true }),
    s('path', { d: dots([[48, 82], [112, 82]], 3) }, 'gray')
  ],
  viola: [
    s('path', { d: 'M78 18h10l-2 52h-6z' }, 'dark'),
    s('path', { d: 'M82 62c-22 0-28 10-24 24q4 8-2 14c-10 10-8 34 26 34s36-24 26-34q-6-6-2-14c4-14-2-24-24-24z' }, 'brown', { accent: true }),
    s('path', { d: 'M72 98q-6 4 0 8M92 98q6 4 0 8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 70v54', ...SW(2) }, 'cream', { stroke: true }),
    s('rect', { x: 72, y: 118, width: 20, height: 6, rx: 2 }, 'dark'),
    s('path', { d: 'M28 128L136 36', ...SW(3) }, 'tan', { stroke: true })
  ],
  violar: [
    s('path', { d: 'M22 40v96M138 40v96', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M22 56l46 8M138 56l-42 8', ...SW(10) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M30 57l8 1.5M48 60.5l8 1.5M130 57l-8 1.5M112 60.5l-8 1.5', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'black', { stroke: true }),
    s('path', { d: 'M68 64l6 10M96 64l-6 10', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: ells([[66, 126, 8, 13], [94, 100, 8, 13]]) }, 'red'),
    s('path', { d: ells([[80, 140, 6, 4]]) }, 'gray')
  ],
  acercamiento: [
    ground(),
    ...person(34, 136, 'red', { h: 46, w: 28, r: 12 }),
    ...person(126, 136, 'blue', { h: 46, w: 28, r: 12 }),
    arrow('M54 70h18M64 62l8 8-8 8', 'orange', 5),
    arrow('M106 70H88M96 62l-8 8 8 8', 'orange', 5),
    s('path', { d: heart(80, 100, 12) }, 'pink', { accent: true })
  ],
  adecuadamente: [
    s('path', { d: 'M18 30h56v18a10 10 0 1 0 0 20v18H18z' }, 'blue'),
    s('path', { d: 'M18 86h56v54H18zM74 30h68v56H74z' }, 'sky'),
    s('path', { d: 'M86 86h56v54H74v-16a10 10 0 1 0 0-20V86z' }, 'green', { accent: true }),
    s('path', { d: 'M18 30h124v110H18zM18 86h124M74 30v110', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M96 40l10 10 22-22', ...SW(6) }, 'navy', { stroke: true })
  ],
  alternativo: [
    s('path', { d: 'M80 140V82L40 40M80 82l40-42', ...SW(16) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 140V82L40 40', ...DASH(3, '6 6') }, 'white', { stroke: true }),
    s('path', { d: 'M80 82l40-42', ...DASH(3, '6 6') }, 'yellow', { stroke: true, accent: true }),
    arrow('M30 54L22 22M14 30l8-8 8 6', 'blue', 5),
    arrow('M130 54l8-32M130 28l8-6 8 8', 'orange', 5),
    s('path', { d: dots([[80, 112]], 6) }, 'red')
  ],
  atravesar: [
    s('rect', { x: 14, y: 96, width: 132, height: 44 }, 'dark'),
    s('path', { d: rects([[22, 100, 16, 36], [46, 100, 16, 36], [70, 100, 16, 36], [94, 100, 16, 36], [118, 100, 16, 36]]) }, 'white'),
    s('circle', { cx: 56, cy: 36, r: 11 }, 'skin'),
    s('path', { d: 'M56 50l4 22M60 72l-12 20M60 72l14 18M58 56l-14 10M58 56l16 6', ...SW(7) }, 'red', { stroke: true, accent: true }),
    arrow('M90 60h40M120 50l10 10-10 10', 'orange', 5)
  ],
  capturar: [
    s('path', { d: 'M28 140l46-58', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M74 82q-10-40 28-56q40-8 40 30q-18 36-68 26z' }, 'white'),
    s('path', { d: 'M74 82q-10-40 28-56q40-8 40 30q-18 36-68 26zM84 40l46 40M100 28l36 30M80 60l30 26M90 30l-8 50M112 28l-16 56M130 34l-20 50', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M102 56q-14-16-22-2q8 10 22 2q14 16 22 2q-8-10-22-2z' }, 'orange', { accent: true }),
    s('path', { d: 'M102 48v16', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M74 82q-10-40 28-56q40-8 40 30q-18 36-68 26z', ...SW(5) }, 'dark', { stroke: true })
  ],
  confiable: [
    s('path', { d: 'M80 16l54 18v38q0 44-54 72q-54-28-54-72V34z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 30l40 13v30q0 34-40 56z' }, 'navy'),
    s('path', { d: 'M54 80l18 18 36-38', ...SW(10) }, 'white', { stroke: true })
  ],
  consola: [
    s('path', { d: 'M40 52h80q24 0 26 30t-12 38q-12 6-24-12l-6-8H56l-6 8q-12 18-24 12t-12-38t26-30z' }, 'dark'),
    s('path', { d: 'M38 74h24M50 62v24', ...SW(8) }, 'gray', { stroke: true }),
    s('circle', { cx: 112, cy: 66, r: 6 }, 'green'),
    s('circle', { cx: 124, cy: 78, r: 6 }, 'red', { accent: true }),
    s('circle', { cx: 100, cy: 78, r: 6 }, 'blue'),
    s('circle', { cx: 112, cy: 90, r: 6 }, 'yellow'),
    s('path', { d: 'M72 74h6M84 74h6', ...SW(4) }, 'gray', { stroke: true })
  ],
  correspondencia: [
    s('rect', { x: 18, y: 26, width: 92, height: 62, rx: 4 }, 'cream'),
    s('path', { d: 'M18 30l46 32 46-32', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 50, y: 72, width: 92, height: 62, rx: 4 }, 'white'),
    s('rect', { x: 50, y: 72, width: 92, height: 62, rx: 4, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 76l44 32 44-32', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 118, y: 80, width: 16, height: 18, rx: 2 }, 'red', { accent: true }),
    s('rect', { x: 86, y: 34, width: 16, height: 18, rx: 2 }, 'blue')
  ],
  cortado: [
    s('ellipse', { cx: 80, cy: 134, rx: 46, ry: 8 }, 'gray'),
    s('path', { d: 'M50 44h60l-8 88H58z' }, 'sky'),
    s('path', { d: 'M54 76h52l-4 56H58z' }, 'brown', { accent: true }),
    s('path', { d: 'M52 58h56l-2 18H54z' }, 'cream'),
    s('path', { d: 'M50 44h60l-8 88H58z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 36q-6-8 0-16M90 36q-6-8 0-16', ...SW(3) }, 'gray', { stroke: true })
  ],
  cuidadosamente: [
    s('ellipse', { cx: 80, cy: 66, rx: 22, ry: 28 }, 'cream', { accent: true }),
    s('ellipse', { cx: 80, cy: 66, rx: 22, ry: 28, ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M20 96q6 42 60 42t60-42l-18-4q-6 28-42 28t-42-28z' }, 'skin'),
    s('path', { d: 'M22 96l6-16 16 10M138 96l-6-16-16 10', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(124, 40, 10) + sparkle(36, 44, 7) }, 'yellow'),
    s('path', { d: 'M70 52q4-6 10-6', ...SW(3) }, 'white', { stroke: true })
  ],
  desconfianza: [
    s('circle', { cx: 70, cy: 84, r: 54 }, 'skin'),
    s('path', { d: 'M34 76h28M80 76h28', ...SW(8) }, 'white', { stroke: true }),
    s('path', { d: dots([[56, 76], [102, 76]], 5) }, 'dark'),
    s('path', { d: 'M32 60l30 6M80 64l30-8M52 110q14-6 28 0', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 126, cy: 116, r: 16 }, 'sky', { accent: true }),
    s('path', { d: ring(126, 116, 16) + 'M138 128l10 10', ...SW(5) }, 'brown', { stroke: true })
  ],
  doloroso: [
    s('path', { d: 'M18 140v-40q0-12 12-12h42q12 0 12 12v40z' }, 'skin'),
    s('rect', { x: 52, y: 54, width: 24, height: 42, rx: 12 }, 'skin'),
    s('ellipse', { cx: 64, cy: 58, rx: 12, ry: 10 }, 'red', { accent: true }),
    s('path', { d: 'M96 44l38-24', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 80, y: 30, width: 34, height: 18, rx: 3, transform: 'rotate(-32 97 39)' }, 'gray'),
    s('path', { d: 'M52 28l-8-10M64 22V12M78 28l6-10M36 44l-10-4', ...SW(4) }, 'orange', { stroke: true })
  ],
  equidad: [
    s('path', { d: rects([[16, 60, 128, 6], [16, 76, 128, 6]]) + rects([[24, 54, 6, 82], [130, 54, 6, 82]]) }, 'brown'),
    s('rect', { x: 92, y: 106, width: 28, height: 30 }, 'tan'),
    s('rect', { x: 50, y: 120, width: 28, height: 16 }, 'tan'),
    ...person(36, 136, 'blue', { h: 46, w: 20, r: 10 }),
    ...person(64, 120, 'green', { h: 36, w: 20, r: 10 }),
    ...person(106, 106, 'red', { h: 26, w: 18, r: 9, accent: true }),
    ground()
  ],
  'etcétera': [
    s('circle', { cx: 32, cy: 60, r: 16 }, 'red'),
    s('rect', { x: 64, y: 44, width: 32, height: 32, rx: 3 }, 'blue'),
    s('path', { d: 'M128 44l18 32h-36z' }, 'green'),
    s('path', { d: dots([[46, 112], [80, 112], [114, 112]], 9) }, 'orange', { accent: true })
  ],
  experimentar: [
    s('path', { d: 'M62 18h36M68 18v38l-34 64q-6 16 10 16h72q16 0 10-16L92 56V18', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 92h64l18 30q4 10-6 10H36q-10 0-6-10z' }, 'green', { accent: true }),
    s('path', { d: dots([[64, 112], [90, 104], [78, 122]], 5) }, 'mint'),
    s('path', { d: dots([[86, 72], [74, 54], [92, 40]], 4) }, 'green'),
    s('path', { d: sparkle(126, 36, 10) + sparkle(30, 50, 7) }, 'yellow')
  ],
  'extrañar': [
    s('circle', { cx: 44, cy: 70, r: 22 }, 'skin'),
    s('path', { d: busts([44], 146, 56, 46) }, 'blue'),
    s('path', { d: 'M36 66q4 4 8 0M50 66q4 4 8 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: drop(40, 82, 4) }, 'sky'),
    s('rect', { x: 88, y: 50, width: 52, height: 62, rx: 4 }, 'brown'),
    s('rect', { x: 96, y: 58, width: 36, height: 46 }, 'cream'),
    s('path', { d: heart(114, 80, 12) }, 'red', { accent: true })
  ],
  fabricante: [
    s('path', { d: 'M14 136V80l30-20v20l30-20v20l30-20v76z' }, 'gray'),
    s('path', { d: rects([[108, 34, 14, 102], [128, 50, 12, 86]]) }, 'red', { accent: true }),
    s('path', { d: rects([[24, 96, 14, 14], [50, 96, 14, 14], [76, 96, 14, 14]]) }, 'yellow'),
    s('path', { d: ells([[118, 24, 12, 7], [132, 14, 8, 5]]) }, 'gray'),
    s('rect', { x: 14, y: 120, width: 126, height: 16 }, 'dark'),
    ground()
  ],
  formalmente: [
    s('rect', { x: 46, y: 22, width: 68, height: 54, rx: 4 }, 'black'),
    s('rect', { x: 30, y: 70, width: 100, height: 12, rx: 6 }, 'black'),
    s('rect', { x: 46, y: 60, width: 68, height: 10 }, 'red'),
    s('path', { d: 'M80 116l-36-20v40zM80 116l36-20v40z' }, 'navy', { accent: true }),
    s('circle', { cx: 80, cy: 116, r: 8 }, 'navy')
  ],
  'ganadería': [
    s('path', { d: 'M14 64h132M14 84h132M24 52v84M136 52v84', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M48 110v26M60 110v26M102 110v26M114 110v26', ...SW(8) }, 'white', { stroke: true, lineColor: 'dark' }),
    s('rect', { x: 40, y: 74, width: 84, height: 44, rx: 18 }, 'white'),
    s('path', { d: ells([[62, 90, 12, 9], [100, 100, 10, 8]]) }, 'dark'),
    s('rect', { x: 40, y: 74, width: 84, height: 44, rx: 18, ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 34, cy: 80, rx: 16, ry: 18 }, 'white'),
    s('ellipse', { cx: 30, cy: 92, rx: 12, ry: 8 }, 'pink', { accent: true }),
    s('path', { d: 'M24 64l-6-8M42 64l6-8', ...SW(4) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 34, cy: 80, rx: 16, ry: 18, ...SW(3) }, 'gray', { stroke: true })
  ],
  golpear: [
    s('path', { d: 'M110 14v18', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 88, y: 32, width: 44, height: 98, rx: 20 }, 'red', { accent: true }),
    s('path', { d: 'M88 56h44M88 106h44', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 34, y: 62, width: 44, height: 36, rx: 14 }, 'blue'),
    s('rect', { x: 14, y: 70, width: 24, height: 20, rx: 4 }, 'skin'),
    s('path', { d: 'M74 50l-8-12M80 108l-6 10M84 80h0', ...SW(4) }, 'orange', { stroke: true })
  ],
  indiferencia: [
    ...person(80, 140, 'gray', { h: 50, w: 34, r: 18, accent: true }),
    s('path', { d: 'M64 104l-26-8-8-14M96 104l26-8 8-14', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M22 80l8 2M138 80l-8 2', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M70 70h6M86 70h6M72 82h16', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 50l6 2M96 50l-6 2', ...SW(3) }, 'dark', { stroke: true })
  ],
  inmueble: [
    ground(),
    s('path', { d: 'M18 78l48-40 48 40z' }, 'red'),
    s('rect', { x: 28, y: 76, width: 76, height: 60 }, 'cream'),
    s('path', { d: rects([[40, 88, 18, 16], [72, 96, 20, 40]]) }, 'brown'),
    s('circle', { cx: 120, cy: 58, r: 16 }, 'yellow', { accent: true }),
    s('circle', { cx: 120, cy: 58, r: 6 }, 'cream'),
    s('path', { d: 'M120 74v52M120 108h12M120 118h10', ...SW(7) }, 'yellow', { stroke: true })
  ],
  'inundación': [
    s('path', { d: 'M28 70l40-34 40 34z' }, 'red'),
    s('rect', { x: 36, y: 68, width: 64, height: 50 }, 'cream'),
    s('rect', { x: 50, y: 80, width: 16, height: 14 }, 'sky'),
    s('path', { d: 'M14 98q11-8 22 0t22 0 22 0 22 0 22 0 22 0V146H14z' }, 'blue', { accent: true }),
    s('path', { d: 'M24 116q8-6 16 0M74 126q8-6 16 0M114 112q8-6 16 0', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M116 20l-4 10M128 26l-4 10M140 18l-4 10M104 36l-4 10', ...SW(3) }, 'blue', { stroke: true })
  ],
  irregularidad: [
    s('path', { d: rects([[16, 70, 20, 20], [42, 70, 20, 20], [68, 70, 20, 20], [124, 70, 20, 20]]) }, 'blue'),
    s('rect', { x: 92, y: 88, width: 22, height: 22, rx: 2, transform: 'rotate(20 103 99)' }, 'red', { accent: true }),
    s('path', { d: 'M96 76l18 14', ...DASH(2, '3 3') }, 'gray', { stroke: true }),
    s('circle', { cx: 110, cy: 98, r: 30, ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M132 120l14 14', ...SW(8) }, 'dark', { stroke: true })
  ],
  'irónico': [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'yellow', { accent: true }),
    s('path', { d: 'M48 64q10-8 20 0M92 54l22 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[58, 74]], 6) }, 'dark'),
    s('path', { d: 'M92 70q12 4 20 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 104q30 8 48-12', ...SW(5) }, 'dark', { stroke: true })
  ],
  licenciatura: [
    s('path', { d: 'M80 28l62 22-62 22-62-22z' }, 'black', { accent: true }),
    s('path', { d: 'M48 62v22q32 18 64 0V62l-32 10z' }, 'dark'),
    s('path', { d: 'M136 52v30', ...SW(3) }, 'yellow', { stroke: true }),
    s('circle', { cx: 136, cy: 86, r: 5 }, 'yellow'),
    s('rect', { x: 30, y: 104, width: 100, height: 26, rx: 13 }, 'cream'),
    s('rect', { x: 30, y: 104, width: 100, height: 26, rx: 13, ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M80 104v26', ...SW(8) }, 'red', { stroke: true })
  ],
  mapuche: [
    ground(),
    s('path', { d: 'M14 136l38-60 18 22 22-30 54 68z' }, 'gray'),
    s('path', { d: 'M100 60v76', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: 'M70 70q30-30 60 0zM76 90q24-20 48 0zM82 108q18-14 36 0z' }, 'green', { accent: true }),
    s('path', { d: 'M74 52q26-26 52 0z' }, 'green'),
    s('circle', { cx: 36, cy: 34, r: 12 }, 'yellow')
  ],
  mediano: [
    ground(138),
    s('path', { d: 'M18 112h28l-4 26H22z' }, 'gray'),
    s('path', { d: 'M58 84h40l-5 54H63z' }, 'orange', { accent: true }),
    s('path', { d: 'M108 56h40l-6 82h-28z' }, 'gray'),
    s('path', { d: 'M58 84h40', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M78 76V60', ...SW(3) }, 'red', { stroke: true })
  ],
  millonario: [
    s('rect', { x: 34, y: 18, width: 40, height: 32, rx: 3 }, 'black'),
    s('rect', { x: 24, y: 48, width: 60, height: 8, rx: 4 }, 'black'),
    s('circle', { cx: 54, cy: 70, r: 15 }, 'skin'),
    s('path', { d: busts([54], 140, 48, 54) }, 'navy'),
    s('path', { d: 'M104 92q-18 8-18 28q0 18 28 18t28-18q0-20-18-28l6-12h-32z' }, 'tan', { accent: true }),
    s('circle', { cx: 114, cy: 118, r: 10 }, 'yellow'),
    s('path', { d: 'M104 92h20', ...SW(4) }, 'brown', { stroke: true })
  ],
  perjuicio: [
    ground(138),
    s('path', { d: 'M54 30h40l-4 12q22 18 18 52q-4 30-28 40H68q-24-10-28-40q-4-34 18-52z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 42l-8 22 14 14-10 20 8 16-6 20', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M118 130l12-14 8 16zM26 132l10-10 6 12z' }, 'blue'),
    arrow('M132 22v40M122 52l10 10 10-10', 'red', 6)
  ],
  planear: [
    s('rect', { x: 18, y: 24, width: 124, height: 112, rx: 6 }, 'sky'),
    s('path', { d: 'M18 64l40 10 30-18 54 16M18 110l46-8 40 18 38-10', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M34 116q20-40 50-30t30-44', ...DASH(4, '7 6') }, 'red', { stroke: true }),
    s('circle', { cx: 34, cy: 116, r: 7 }, 'green'),
    s('path', { d: 'M114 44V18', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M114 18h22l-6 7 6 7h-22z' }, 'orange', { accent: true })
  ],
  pluma: [
    s('path', { d: 'M40 136l70-110', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M118 16q22 20-8 70q-16 20-34 26q-6-18 4-44q14-40 38-52z' }, 'blue', { accent: true }),
    s('path', { d: 'M118 16L62 112', ...SW(3) }, 'cream', { stroke: true }),
    s('path', { d: 'M86 70l-12-6M98 52l-10-6M80 86l16 2M92 66l14 4', ...SW(2) }, 'sky', { stroke: true }),
    s('path', { d: 'M40 136l-4 10 12-6z' }, 'dark')
  ],
  pretexto: [
    s('circle', { cx: 42, cy: 52, r: 18 }, 'skin'),
    s('path', { d: busts([42], 140, 46, 70) }, 'green'),
    s('path', { d: 'M58 92l26 12', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M34 54q8 4 16 0M36 44h4M46 44h4', ...SW(3) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 116, cy: 118, rx: 26, ry: 16 }, 'brown'),
    s('circle', { cx: 112, cy: 92, r: 15 }, 'brown'),
    s('path', { d: 'M100 84l-6 16M122 84l8 14', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M92 100h26l-4 12H96z' }, 'white', { accent: true })
  ],
  'recopilación': [
    s('path', { d: 'M24 72h44l8 10h60v54H24z' }, 'orange', { accent: true }),
    s('path', { d: rects([[38, 52, 30, 36], [62, 46, 30, 40], [90, 54, 30, 36]]) }, 'white'),
    s('path', { d: rects([[38, 52, 30, 36], [62, 46, 30, 40], [90, 54, 30, 36]]), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 90h112v46H24z' }, 'yellow'),
    arrow('M24 18l18 22M80 12v24M136 18l-18 22', 'blue', 4)
  ],
  sanitario: [
    s('path', { d: 'M30 24h50v14H44v14', ...SW(10) }, 'gray', { stroke: true }),
    s('path', { d: drop(44, 72, 5) + drop(44, 92, 4) }, 'blue'),
    s('path', { d: 'M28 140q-4-30 16-34h40q18 4 16 34z' }, 'skin'),
    s('path', { d: dots([[60, 104], [76, 96], [92, 106]], 7) }, 'white'),
    s('path', { d: ring(60, 104, 7) + ring(76, 96, 7) + ring(92, 106, 7), ...SW(2) }, 'sky', { stroke: true }),
    s('rect', { x: 108, y: 30, width: 36, height: 36, rx: 6 }, 'white'),
    s('path', { d: 'M126 36v24M114 48h24', ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('rect', { x: 108, y: 30, width: 36, height: 36, rx: 6, ...SW(2) }, 'gray', { stroke: true })
  ],
  seleccionado: [
    s('path', { d: dots([[24, 120], [52, 120], [108, 120], [136, 120]], 12) }, 'green'),
    s('circle', { cx: 80, cy: 66, r: 16 }, 'red', { accent: true }),
    s('path', { d: 'M80 50v-8', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: ring(80, 66, 26), ...DASH(3, '5 5') }, 'orange', { stroke: true }),
    s('path', { d: star(80, 22, 10) }, 'yellow'),
    arrow('M80 116V100M72 106l8-8 8 8', 'gray', 4)
  ],
  sentimental: [
    s('circle', { cx: 64, cy: 88, r: 48 }, 'skin'),
    s('path', { d: 'M42 80q6 6 12 0M72 80q6 6 12 0M52 108q10-6 20 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: drop(46, 98, 5) + drop(82, 100, 5) }, 'sky'),
    s('path', { d: heart(118, 116, 18) }, 'pink', { accent: true }),
    s('path', { d: heart(124, 46, 10) + heart(100, 30, 7) }, 'red')
  ],
  situar: [
    s('rect', { x: 14, y: 70, width: 132, height: 70, rx: 4 }, 'mint'),
    s('path', { d: 'M14 92h132M14 116h132M46 70v70M80 70v70M114 70v70', ...SW(2) }, 'green', { stroke: true }),
    s('path', { d: 'M86 78l12-10 12 10v14H86z' }, 'red', { accent: true }),
    s('path', { d: 'M86 92h24v20H86z', ...DASH(2, '3 3') }, 'dark', { stroke: true }),
    s('path', { d: 'M88 58q-4-22 12-30h20q6 6 0 12h-8l10 6q6 6-2 10z' }, 'skin'),
    arrow('M70 50v24M64 68l6 6 6-6', 'orange', 4)
  ],
  vecindario: [
    ground(),
    s('path', { d: 'M14 90l22-22 22 22zM58 80l22-26 22 26zM102 90l22-22 22 22z' }, 'red', { accent: true }),
    s('path', { d: rects([[20, 90, 32, 46], [106, 90, 32, 46]]) }, 'cream'),
    s('rect', { x: 62, y: 80, width: 36, height: 56 }, 'yellow'),
    s('path', { d: rects([[30, 112, 12, 24], [74, 112, 12, 24], [116, 112, 12, 24]]) }, 'brown'),
    s('path', { d: rects([[28, 96, 10, 10], [118, 96, 10, 10], [74, 90, 12, 12]]) }, 'sky'),
    s('path', { d: dots([[38, 36], [124, 40]], 12) }, 'green')
  ],
  vincular: [
    s('rect', { x: 20, y: 60, width: 64, height: 40, rx: 20, ...SW(12) }, 'blue', { stroke: true, accent: true }),
    s('rect', { x: 76, y: 60, width: 64, height: 40, rx: 20, ...SW(12) }, 'gray', { stroke: true }),
    s('path', { d: 'M76 70v20', ...SW(12) }, 'blue', { stroke: true })
  ],
  'viña': [
    s('rect', { x: 14, y: 14, width: 132, height: 60 }, 'sky'),
    s('path', { d: 'M14 70q66-24 132 0v76H14z' }, 'green'),
    s('path', { d: 'M24 82q56-16 112 0M18 106q62-18 124 0M14 132q66-18 132 0', ...SW(6) }, 'mint', { stroke: true }),
    s('path', { d: dots([[72, 108], [80, 108], [88, 108], [76, 116], [84, 116], [80, 124]], 5) }, 'purple', { accent: true }),
    s('path', { d: 'M80 104l4-8q8-2 12 4', ...SW(3) }, 'brown', { stroke: true }),
    s('circle', { cx: 120, cy: 36, r: 12 }, 'yellow')
  ],
  'árbitro': [
    s('circle', { cx: 70, cy: 44, r: 16 }, 'skin'),
    s('rect', { x: 50, y: 62, width: 40, height: 56, rx: 12 }, 'white'),
    s('path', { d: 'M58 62v56M70 62v56M82 62v56', ...SW(5) }, 'black', { stroke: true }),
    s('path', { d: 'M90 70l24-26', ...SW(8) }, 'skin', { stroke: true }),
    s('rect', { x: 106, y: 16, width: 20, height: 28, rx: 2, transform: 'rotate(12 116 30)' }, 'yellow', { accent: true }),
    s('path', { d: 'M56 118v20M84 118v20', ...SW(8) }, 'black', { stroke: true }),
    s('rect', { x: 50, y: 62, width: 40, height: 56, rx: 12, ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 74, cy: 54, r: 4 }, 'gray')
  ],
  'ópera': [
    s('path', { d: 'M14 14h40q-6 60-40 70zM146 14h-40q6 60 40 70z' }, 'red'),
    s('rect', { x: 14, y: 132, width: 132, height: 14 }, 'brown'),
    ...lady(80, 132, 'purple', { accent: true }),
    s('ellipse', { cx: 80, cy: 74, rx: 4, ry: 5 }, 'dark'),
    ...note(118, 52, 'navy')
  ],
  'óptica': [
    s('path', { d: ring(46, 84, 26) + ring(114, 84, 26) + 'M72 80q8-8 16 0M20 78l-6-12M140 78l6-12', ...SW(7) }, 'dark', { stroke: true }),
    s('circle', { cx: 46, cy: 84, r: 22 }, 'sky', { accent: true }),
    s('circle', { cx: 114, cy: 84, r: 22 }, 'sky'),
    s('path', { d: 'M36 76l12-10M104 76l12-10', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M46 50L36 24M114 50l10-26M80 50V24', ...SW(3) }, 'yellow', { stroke: true })
  ],
  'admisión': [
    s('path', { d: 'M74 136V36q0-8 8-8h52q8 0 8 8v100z' }, 'brown'),
    s('path', { d: 'M84 136V40h48v96z' }, 'yellow'),
    s('path', { d: 'M18 64h40l4 8-4 8 4 8-4 8H18l4-8-4-8 4-8z' }, 'red', { accent: true }),
    s('path', { d: 'M34 64v32', ...DASH(2, '3 3') }, 'white', { stroke: true }),
    arrow('M40 116h56M84 104l12 12-12 12', 'green', 6),
    ground()
  ],
  aluminio: [
    s('rect', { x: 22, y: 34, width: 50, height: 96, rx: 10 }, 'gray', { accent: true }),
    s('rect', { x: 26, y: 26, width: 42, height: 10, rx: 4 }, 'dark'),
    s('path', { d: 'M32 48v66', ...SW(5) }, 'white', { stroke: true }),
    s('rect', { x: 80, y: 82, width: 66, height: 30, rx: 4 }, 'navy'),
    s('path', { d: 'M86 112l-8 26h60l8-26z' }, 'gray'),
    s('path', { d: 'M90 120l30 12', ...SW(3) }, 'white', { stroke: true }),
    s('ellipse', { cx: 94, cy: 97, rx: 6, ry: 15 }, 'gray')
  ],
  'apelación': [
    s('rect', { x: 20, y: 120, width: 72, height: 14, rx: 4 }, 'brown'),
    s('rect', { x: 34, y: 112, width: 44, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M40 94l40-40', ...SW(8) }, 'tan', { stroke: true }),
    s('rect', { x: 62, y: 30, width: 40, height: 22, rx: 6, transform: 'rotate(45 82 41)' }, 'brown', { accent: true }),
    arrow('M124 136V28M108 44l16-16 16 16', 'green', 8)
  ],
  'araña': [
    s('path', { d: 'M80 14v40' + ring(80, 80, 50).replace(/^M/, 'M') , ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 80h100M80 30v100M45 45l70 70M115 45l-70 70' + ring(80, 80, 28), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 80l-26-16-8 10M70 88l-28 0-6 12M72 94l-20 16-2 12M90 80l26-16 8 10M90 88l28 0 6 12M88 94l20 16 2 12M72 72l-14-20-12-2M88 72l14-20 12-2', ...SW(4) }, 'black', { stroke: true }),
    s('ellipse', { cx: 80, cy: 90, rx: 14, ry: 16 }, 'black', { accent: true }),
    s('circle', { cx: 80, cy: 70, r: 9 }, 'black'),
    s('path', { d: dots([[76, 68], [84, 68]], 2) }, 'red')
  ],
  armenio: [
    s('path', { d: 'M14 136l40-62 14 14 18-26 60 74z' }, 'gray'),
    s('path', { d: 'M48 84l6-10 6 8zM80 72l6-10 8 10z' }, 'white'),
    s('path', { d: 'M100 136V24', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 100, y: 24, width: 44, height: 12 }, 'red', { accent: true }),
    s('rect', { x: 100, y: 36, width: 44, height: 12 }, 'blue'),
    s('rect', { x: 100, y: 48, width: 44, height: 12 }, 'orange'),
    s('circle', { cx: 34, cy: 118, r: 10 }, 'orange')
  ],
  arsenal: [
    ground(),
    s('path', { d: dots([[34, 124], [58, 124], [82, 124], [46, 104], [70, 104], [58, 84]], 11) }, 'dark', { accent: true }),
    s('path', { d: dots([[30, 120], [54, 120], [78, 120], [42, 100], [66, 100], [54, 80]], 3) }, 'gray'),
    s('rect', { x: 98, y: 92, width: 46, height: 44, rx: 3 }, 'green'),
    s('path', { d: 'M98 92l46 44M144 92l-46 44', ...SW(4) }, 'navy', { stroke: true }),
    s('rect', { x: 104, y: 46, width: 34, height: 46, rx: 3 }, 'green'),
    s('path', { d: 'M104 62h34M104 76h34', ...SW(3) }, 'navy', { stroke: true })
  ],
  bachillerato: [
    s('path', { d: 'M18 72l48-34 48 34z' }, 'red'),
    s('rect', { x: 26, y: 72, width: 80, height: 64 }, 'cream'),
    s('path', { d: rects([[36, 84, 16, 14], [80, 84, 16, 14], [56, 106, 20, 30]]) }, 'brown'),
    s('circle', { cx: 66, cy: 56, r: 7 }, 'yellow'),
    s('rect', { x: 92, y: 106, width: 54, height: 22, rx: 11, transform: 'rotate(-30 119 117)' }, 'white'),
    s('rect', { x: 92, y: 106, width: 54, height: 22, rx: 11, transform: 'rotate(-30 119 117)', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M114 106l10 22', ...SW(7) }, 'blue', { stroke: true, accent: true })
  ],
  bendecir: [
    s('path', { d: halfRays(80, 70, 50, 66, 7) }, 'yellow', { accent: true }),
    s('path', { d: halfRays(80, 70, 50, 66, 7), ...SW(5) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 100, r: 20 }, 'skin'),
    s('path', { d: busts([80], 148, 56, 30) }, 'purple'),
    s('path', { d: 'M60 66q20-18 40 0l-4 6H64z' }, 'skin'),
    s('path', { d: 'M100 66l20-18', ...SW(10) }, 'blue', { stroke: true }),
    s('path', { d: sparkle(42, 70, 8) + sparkle(118, 82, 7) }, 'yellow')
  ],
  boliviano: [
    s('path', { d: 'M14 136l30-48 18 20 26-40 22 30 14-12 22 50z' }, 'gray'),
    s('path', { d: 'M78 84l10-16 10 14z' }, 'white'),
    s('path', { d: 'M28 136V20', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 28, y: 20, width: 66, height: 14 }, 'red', { accent: true }),
    s('rect', { x: 28, y: 34, width: 66, height: 14 }, 'yellow'),
    s('rect', { x: 28, y: 48, width: 66, height: 14 }, 'green')
  ],
  brevemente: [
    s('rect', { x: 70, y: 14, width: 20, height: 12, rx: 3 }, 'dark'),
    s('circle', { cx: 80, cy: 86, r: 54 }, 'gray'),
    s('circle', { cx: 80, cy: 86, r: 44 }, 'white'),
    s('path', { d: wedge(80, 86, 44, -90, -50) }, 'orange', { accent: true }),
    s('path', { d: 'M80 86V48', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 86, r: 5 }, 'dark')
  ],
  bruja: [
    backdrop('navy'),
    s('circle', { cx: 112, cy: 48, r: 22 }, 'yellow'),
    s('path', { d: 'M24 112l112-30', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M120 86l20-10 4 14-20 4z' }, 'tan'),
    s('path', { d: 'M48 108l6-34 24-4 10 30z' }, 'black'),
    s('circle', { cx: 64, cy: 64, r: 10 }, 'mint'),
    s('path', { d: 'M48 58h34M56 58l14-34 8 30z' }, 'purple', { accent: true }),
    s('path', { d: 'M46 58h36', ...SW(5) }, 'purple', { stroke: true })
  ],
  cabina: [
    s('rect', { x: 46, y: 18, width: 68, height: 124, rx: 6 }, 'red', { accent: true }),
    s('rect', { x: 42, y: 14, width: 76, height: 14, rx: 4 }, 'red'),
    s('path', { d: rects([[54, 36, 24, 26], [82, 36, 24, 26], [54, 66, 24, 26], [82, 66, 24, 26], [54, 96, 24, 26], [82, 96, 24, 26]]) }, 'sky'),
    s('rect', { x: 86, y: 70, width: 12, height: 20, rx: 2 }, 'dark'),
    ground(142)
  ],
  'certificación': [
    s('rect', { x: 18, y: 26, width: 124, height: 90, rx: 4 }, 'cream'),
    s('rect', { x: 26, y: 34, width: 108, height: 74, rx: 2, ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M40 52h80M40 66h60M40 80h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 104l-8 34 12-8 6 12 6-34z' }, 'red'),
    s('circle', { cx: 112, cy: 96, r: 18 }, 'red', { accent: true }),
    s('path', { d: star(112, 96, 10) }, 'yellow')
  ],
  chip: [
    s('path', { d: 'M54 36v-16M70 36v-16M90 36v-16M106 36v-16M54 124v16M70 124v16M90 124v16M106 124v16M36 54H20M36 70H20M36 90H20M36 106H20M124 54h16M124 70h16M124 90h16M124 106h16', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 36, y: 36, width: 88, height: 88, rx: 8 }, 'dark'),
    s('rect', { x: 58, y: 58, width: 44, height: 44, rx: 4 }, 'green', { accent: true }),
    s('path', { d: 'M58 80h44M80 58v44', ...SW(2) }, 'mint', { stroke: true }),
    s('circle', { cx: 46, cy: 46, r: 4 }, 'gray')
  ],
  'complicación': [
    s('path', { d: 'M20 120q20 0 30-20t-10-40 30-30 40 20-20 50 10 40 40-30-10-50-40 0-20 40 30 60 30 20', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M40 40q40 60 80 10M30 90q50-40 100 30M60 130q-10-60 60-90', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M14 120h8M128 140l8 6', ...SW(6) }, 'red', { stroke: true })
  ],
  comunitario: [
    ground(),
    s('path', { d: 'M80 104V60', ...SW(8) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 48, r: 30 }, 'green', { accent: true }),
    s('path', { d: dots([[24, 100], [52, 96], [108, 96], [136, 100]], 10) }, 'skin'),
    s('path', { d: busts([24, 136], 136, 24, 26) }, 'red'),
    s('path', { d: busts([52, 108], 136, 24, 30) }, 'blue'),
    s('path', { d: 'M30 118h16M58 116h44M114 118h16', ...SW(5) }, 'skin', { stroke: true }),
    s('rect', { x: 66, y: 112, width: 28, height: 24, rx: 4 }, 'tan')
  ],
  confundir: [
    s('circle', { cx: 80, cy: 90, r: 50 }, 'skin'),
    s('path', { d: spiral(56, 82) + spiral(92, 82), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 116q8-8 16 0t16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 30q20-16 40 0t40 0', ...SW(5) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M112 20a8 8 0 1 1 8 8', ...SW(4) }, 'orange', { stroke: true })
  ],
  conjuntamente: [
    ground(),
    ...person(34, 136, 'red', { h: 46, w: 28, r: 12 }),
    ...person(126, 136, 'blue', { h: 46, w: 28, r: 12 }),
    s('rect', { x: 40, y: 82, width: 80, height: 34, rx: 4 }, 'brown', { accent: true }),
    s('path', { d: 'M40 94h80', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M46 100h8M106 100h8', ...SW(8) }, 'skin', { stroke: true })
  ],
  conllevar: [
    s('path', { d: 'M14 128h132', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 86, y: 70, width: 58, height: 44, rx: 6 }, 'red', { accent: true }),
    s('rect', { x: 120, y: 50, width: 18, height: 22, rx: 2 }, 'red'),
    s('rect', { x: 18, y: 78, width: 54, height: 36, rx: 4 }, 'orange'),
    s('path', { d: 'M72 104h14', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[32, 118], [58, 118], [100, 118], [130, 118]], 8) }, 'dark')
  ],
  consistente: [
    s('path', { d: 'M22 80h116q-4 52-58 58q-54-6-58-58z' }, 'blue'),
    s('ellipse', { cx: 80, cy: 80, rx: 58, ry: 12 }, 'brown', { accent: true }),
    s('path', { d: dots([[60, 78], [96, 82]], 5) }, 'orange'),
    s('path', { d: 'M82 76L96 16', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 80q-2 8 10 4', ...SW(3) }, 'tan', { stroke: true })
  ],
  convocar: [
    s('path', { d: 'M22 70h14l40-24v64L36 86H22z' }, 'red', { accent: true }),
    s('rect', { x: 30, y: 86, width: 10, height: 24, rx: 3 }, 'dark'),
    s('path', { d: 'M86 60q8 18 0 36M96 52q12 26 0 52', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: dots([[122, 50], [132, 84], [122, 118]], 10) }, 'skin'),
    s('path', { d: busts([122], 76, 22, 14) + busts([132], 110, 22, 14) + busts([122], 144, 22, 14) }, 'blue')
  ],
  copiar: [
    ...paper(18, 30, 54, 70),
    s('path', { d: 'M28 46h34M28 58h34M28 70h22', ...SW(4) }, 'blue', { stroke: true }),
    s('rect', { x: 88, y: 60, width: 54, height: 70, rx: 3 }, 'cream', { accent: true }),
    s('rect', { x: 88, y: 60, width: 54, height: 70, rx: 3, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M98 76h34M98 88h34M98 100h22', ...SW(4) }, 'blue', { stroke: true }),
    arrow('M50 112q4 20 30 12M70 116l10 8-10 6', 'orange', 5)
  ],
  crucero: [
    s('path', { d: 'M14 120q11-6 22 0t22 0 22 0 22 0 22 0 22 0V146H14z' }, 'blue'),
    s('path', { d: 'M16 98h128l-16 24H30z' }, 'navy', { accent: true }),
    s('rect', { x: 34, y: 78, width: 92, height: 20, rx: 3 }, 'white'),
    s('rect', { x: 48, y: 60, width: 64, height: 18, rx: 3 }, 'white'),
    s('path', { d: 'M34 78h92v20H34zM48 60h64v18H48z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: dots([[46, 88], [62, 88], [78, 88], [94, 88], [110, 88], [60, 69], [76, 69], [92, 69]], 3) }, 'sky'),
    s('path', { d: rects([[86, 38, 14, 22]]) }, 'red')
  ],
  culpar: [
    s('rect', { x: 14, y: 78, width: 18, height: 36, rx: 4 }, 'blue'),
    s('rect', { x: 30, y: 80, width: 34, height: 32, rx: 10 }, 'skin', { accent: true }),
    s('rect', { x: 52, y: 80, width: 46, height: 12, rx: 6 }, 'skin'),
    s('path', { d: 'M40 102h18M40 110h16', ...SW(3) }, 'tan', { stroke: true }),
    s('circle', { cx: 126, cy: 62, r: 16 }, 'skin'),
    s('path', { d: busts([126], 140, 32, 56) }, 'gray'),
    s('path', { d: 'M118 72q8-6 16 0M120 56l4 2M132 58l4-2', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: drop(140, 40, 4) }, 'sky')
  ],
  curiosamente: [
    s('circle', { cx: 70, cy: 70, r: 44 }, 'sky', { accent: true }),
    s('ellipse', { cx: 70, cy: 70, rx: 24, ry: 16 }, 'white'),
    s('circle', { cx: 74, cy: 70, r: 11 }, 'brown'),
    s('circle', { cx: 76, cy: 68, r: 5 }, 'black'),
    s('path', { d: ring(70, 70, 44), ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M102 102l36 36', ...SW(14) }, 'brown', { stroke: true }),
    s('path', { d: sparkle(130, 30, 10) }, 'yellow')
  ],
  'cárdeno': [
    s('path', { d: 'M80 140V92M80 120q-22-6-28-24q22 2 28 24zM80 112q22-6 28-24q-22 2-28 24z', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M56 80q0-20 24-20t24 20l-8 14H64z' }, 'green'),
    s('path', { d: 'M58 66l-6-12M66 60l-4-10M94 60l4-10M102 66l6-12', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M58 64q-6-30 4-44l6 16 6-20 6 18 6-20 6 20 6-16q10 14 4 46z' }, 'purple', { accent: true }),
    s('path', { d: 'M66 50l2-10M80 48V36M94 50l-2-10', ...SW(3) }, 'navy', { stroke: true })
  ],
  efectividad: [
    s('circle', { cx: 74, cy: 86, r: 56 }, 'red'),
    s('circle', { cx: 74, cy: 86, r: 40 }, 'white'),
    s('circle', { cx: 74, cy: 86, r: 24 }, 'red'),
    s('circle', { cx: 74, cy: 86, r: 9 }, 'yellow', { accent: true }),
    s('path', { d: 'M76 84l60-60', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M128 20l14-4-4 14-10 2zM138 30l4 4', ...SW(2) }, 'blue', { stroke: true })
  ],
  elevar: [
    s('path', { d: 'M30 140V20h70', ...SW(8) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M30 34l14-14M30 60l26-26M30 86l26-26', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M96 20v50', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M88 70h16', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 76, y: 74, width: 40, height: 34, rx: 3 }, 'brown'),
    arrow('M132 120V80M124 88l8-8 8 8', 'green', 5),
    ground(140)
  ],
  enojo: [
    s('circle', { cx: 80, cy: 88, r: 52 }, 'red', { accent: true }),
    s('path', { d: 'M50 74l22 8M110 74l-22 8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[62, 88], [98, 88]], 5) }, 'dark'),
    s('path', { d: 'M62 118q18-14 36 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M38 30q-6-8 0-14M122 30q6-8 0-14', ...SW(5) }, 'gray', { stroke: true })
  ],
  expuesto: [
    s('path', { d: 'M20 14l24 36M140 14l-24 36', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 50h72l20 60H24z' }, 'cream', { accent: true }),
    s('rect', { x: 52, y: 110, width: 56, height: 34, rx: 3 }, 'gray'),
    s('path', { d: 'M66 110q-12-20 0-36h28q12 16 0 36z' }, 'blue'),
    s('path', { d: 'M48 62h64v48H48z', ...SW(2) }, 'sky', { stroke: true }),
    s('path', { d: sparkle(102, 72, 7) }, 'yellow')
  ],
  'hipocresía': [
    s('circle', { cx: 56, cy: 80, r: 40 }, 'skin'),
    s('path', { d: 'M30 74l14 4M38 104q10-8 20 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 112l14 30', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M70 50q32-12 58 0q8 34-10 60q-20 12-38 0q-18-26-10-60z' }, 'yellow', { accent: true }),
    s('path', { d: 'M82 70q6-6 12 0M106 70q6-6 12 0M86 90q14 14 28 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M72 54l-12-10M124 54l12-10', ...SW(3) }, 'pink', { stroke: true })
  ],
  'indignación': [
    s('path', { d: ells([[64, 30, 22, 14], [90, 26, 24, 16], [112, 32, 18, 12]]) }, 'gray'),
    s('path', { d: 'M92 40l-10 16h10l-8 14', ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 86, r: 18 }, 'skin'),
    s('path', { d: busts([80], 146, 46, 40) }, 'red', { accent: true }),
    s('path', { d: 'M58 118h44', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M70 80l8 3M90 80l-8 3M72 96q8-6 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  informal: [
    s('path', { d: 'M46 30l20-6q14 10 28 0l20 6 22 22-16 14-12-10v76H52V56L40 66 24 52z' }, 'green', { accent: true }),
    s('path', { d: 'M66 24q14 14 28 0', ...SW(3) }, 'mint', { stroke: true }),
    s('circle', { cx: 80, cy: 74, r: 10 }, 'yellow'),
    s('path', { d: 'M18 134q0-14 16-14h12l8 14zM106 134q0-14 16-14h12l8 14z' }, 'orange')
  ],
  inminente: [
    s('path', { d: 'M14 112h132v34H14z' }, 'tan'),
    s('path', { d: 'M14 112V64q20-50 76-40q-34 10-34 34q0 26 30 30q-12 10-14 24z' }, 'blue', { accent: true }),
    s('path', { d: 'M56 58q-4-24 30-34', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M96 112V92h8v-8h8v8h8v-8h8v8h8v20z' }, 'orange'),
    s('path', { d: 'M112 84V70l12 6-12 6', ...SW(2) }, 'red', { stroke: true })
  ],
  intermedio: [
    s('path', { d: 'M18 136V108h40V80h40V52h44v84z' }, 'gray'),
    s('rect', { x: 58, y: 80, width: 40, height: 56 }, 'orange', { accent: true }),
    ...person(78, 80, 'blue', { h: 32, w: 22, r: 11 }),
    s('path', { d: 'M28 96h20M114 40h20', ...DASH(3, '4 4') }, 'dark', { stroke: true })
  ],
  invento: [
    s('path', { d: 'M80 18a38 38 0 0 0-22 70q4 6 4 14h36q0-8 4-14a38 38 0 0 0-22-70z' }, 'yellow', { accent: true }),
    s('path', { d: rects([[62, 106, 36, 8], [64, 118, 32, 8]]) }, 'gray'),
    s('rect', { x: 72, y: 128, width: 16, height: 8, rx: 3 }, 'dark'),
    ...gear(80, 58, 12, 7, 'orange'),
    s('path', { d: 'M30 30l-12-12M130 30l12-12M24 60H12M136 60h12', ...SW(4) }, 'orange', { stroke: true })
  ],
  irregular: [
    s('path', { d: 'M30 52l26-26 18 18 30-20 10 34 28 8-18 26 14 30-34 8-12 22-24-18-30 8 2-30-24-16 18-20z' }, 'purple', { accent: true }),
    s('path', { d: 'M52 70l18 16-10 22 26-6 18 16', ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: dots([[100, 60], [60, 120]], 5) }, 'pink')
  ],
  'jubilación': [
    s('path', { d: 'M38 136q32 10 84 0', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M46 132l10-34M110 132l-6-34M40 54l16 44h50', ...SW(7) }, 'brown', { stroke: true }),
    s('circle', { cx: 66, cy: 56, r: 14 }, 'skin'),
    s('path', { d: 'M52 50q14-14 28 0', ...SW(5) }, 'white', { stroke: true, lineColor: 'gray' }),
    s('rect', { x: 54, y: 70, width: 26, height: 30, rx: 9 }, 'purple', { accent: true }),
    s('path', { d: 'M74 98h28v22', ...SW(9) }, 'navy', { stroke: true }),
    s('path', { d: 'M124 92v40M124 92q0-10 8-10', ...SW(4) }, 'tan', { stroke: true })
  ],
  localizar: [
    s('rect', { x: 14, y: 30, width: 112, height: 100, rx: 6 }, 'mint'),
    s('path', { d: 'M14 70q40-10 60 10t52-6M60 30q-6 50 10 100', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M70 92c-12-12-14-17-14-23a14 14 0 0 1 28 0c0 6-2 11-14 23z' }, 'red', { accent: true }),
    s('circle', { cx: 70, cy: 69, r: 5 }, 'white'),
    s('path', { d: ring(76, 74, 32) + 'M100 98l30 30', ...SW(7) }, 'dark', { stroke: true })
  ],
  mentiroso: [
    s('circle', { cx: 52, cy: 80, r: 40 }, 'skin'),
    s('path', { d: 'M24 56q8-36 48-26q-30 0-48 26z' }, 'brown'),
    s('path', { d: 'M84 74h56q6 4 0 10H84z' }, 'tan', { accent: true }),
    s('path', { d: dots([[54, 66], [74, 66]], 5) }, 'dark'),
    s('path', { d: 'M46 102q14 8 24-2', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M118 74q2-14 14-12q-2 12-14 12z' }, 'green')
  ],
  monarca: [
    s('path', { d: 'M18 146q0-42 62-42t62 42z' }, 'purple'),
    s('path', { d: 'M44 118q36 18 72 0', ...SW(8) }, 'white', { stroke: true, lineColor: 'gray' }),
    s('circle', { cx: 80, cy: 76, r: 26 }, 'skin'),
    s('path', { d: 'M54 50V20l13 14 13-20 13 20 13-14v30z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[67, 42], [93, 42]], 3) + dots([[80, 42]], 4) }, 'red'),
    s('path', { d: 'M70 86q10 6 20 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  monetario: [
    s('rect', { x: 14, y: 40, width: 96, height: 54, rx: 4 }, 'green'),
    s('rect', { x: 22, y: 48, width: 80, height: 38, rx: 3, ...SW(2) }, 'mint', { stroke: true }),
    s('circle', { cx: 62, cy: 67, r: 13 }, 'mint'),
    s('path', { d: ells([[110, 128, 28, 7], [110, 116, 28, 7], [110, 104, 28, 7]]) }, 'orange'),
    s('ellipse', { cx: 110, cy: 92, rx: 28, ry: 7 }, 'yellow', { accent: true }),
    s('circle', { cx: 46, cy: 120, r: 16 }, 'yellow'),
    s('circle', { cx: 46, cy: 120, r: 9 }, 'orange')
  ],
  'narración': [
    ...openBook(56, 92, 'white', 'brown'),
    s('path', { d: 'M12 104h36M12 114h36M64 104h36M64 114h28', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: bubble(64, 14, 82, 64) }, 'sky', { accent: true }),
    s('path', { d: 'M76 60l18-24 14 16 8-10 14 18z' }, 'green'),
    s('path', { d: 'M110 30l12-8v18z' }, 'red')
  ],
  nobleza: [
    s('path', { d: 'M36 48h88v40q0 36-44 52q-44-16-44-52z' }, 'navy', { accent: true }),
    s('path', { d: 'M80 48v92M36 88h88', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M48 46V20l11 10 10-16 11 14 11-14 10 16 11-10v26z' }, 'yellow'),
    s('path', { d: dots([[58, 68], [102, 112]], 8) }, 'white'),
    s('path', { d: 'M20 56q-6 40 20 72M140 56q6 40-20 72', ...SW(5) }, 'green', { stroke: true })
  ],
  'obsesión': [
    s('circle', { cx: 46, cy: 104, r: 26 }, 'skin'),
    s('path', { d: spiral(34, 100) + spiral(54, 100), ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: dots([[72, 76], [82, 64]], 5) }, 'gray'),
    s('path', { d: ells([[108, 42, 38, 30]]) }, 'gray'),
    s('path', { d: heart(92, 34, 9) + heart(122, 34, 9) + heart(108, 54, 9) }, 'red', { accent: true })
  ],
  orlar: [
    s('rect', { x: 18, y: 18, width: 124, height: 124, rx: 6 }, 'purple', { accent: true }),
    s('rect', { x: 34, y: 34, width: 92, height: 92, rx: 2 }, 'cream'),
    s('path', { d: dots([[26, 26], [26, 54], [26, 80], [26, 106], [26, 134], [134, 26], [134, 54], [134, 80], [134, 106], [134, 134], [54, 26], [80, 26], [106, 26], [54, 134], [80, 134], [106, 134]], 5) }, 'yellow'),
    s('path', { d: 'M88 46l-30 60M58 106l-8 6 2-10', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 120q20-20 40 0t40 0', ...SW(3, { 'stroke-dasharray': '2 6' }) }, 'red', { stroke: true })
  ],
  patada: [
    ground(),
    s('circle', { cx: 46, cy: 40, r: 13 }, 'skin'),
    s('rect', { x: 32, y: 56, width: 28, height: 42, rx: 9 }, 'blue', { accent: true }),
    s('path', { d: 'M40 96v40M54 94l34 18', ...SW(9) }, 'dark', { stroke: true }),
    s('path', { d: 'M84 104l14 6-4 10-14-4z' }, 'red'),
    s('circle', { cx: 120, cy: 112, r: 16 }, 'white'),
    s('path', { d: ring(120, 112, 16) + 'M112 104l8 4 8-4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M136 88l8-8M140 104h8M100 86l-4-8', ...SW(4) }, 'orange', { stroke: true })
  ],
  permanencia: [
    s('path', { d: 'M24 134l56-74 56 74z' }, 'tan', { accent: true }),
    s('path', { d: 'M80 60l56 74H96z' }, 'brown'),
    ground(136),
    s('path', { d: 'M24 52a62 62 0 0 1 112 0', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 24, cy: 52, r: 10 }, 'yellow'),
    s('path', { d: 'M136 42a10 10 0 1 0 6 18a8 8 0 0 1-6-18z' }, 'navy'),
    s('path', { d: dots([[80, 22]], 6) }, 'orange')
  ],
  pinto: [
    ...horse('tan', 'dark', { accent: true }),
    s('path', { d: ells([[60, 80, 14, 10], [94, 90, 10, 8]]) + 'M108 50l10-4 6 8-12 8z' }, 'white'),
    s('path', { d: ells([[76, 72, 8, 6], [44, 92, 8, 6]]) }, 'brown'),
    s('circle', { cx: 132, cy: 42, r: 2.5 }, 'dark')
  ],
  polla: [
    s('path', { d: 'M64 120l-4 18M86 120l2 18', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M28 70q-6 50 46 54q40 0 44-36z' }, 'tan', { accent: true }),
    s('path', { d: 'M40 84q18 16 46 6', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 106, cy: 66, r: 20 }, 'tan'),
    s('path', { d: 'M100 46q4-10 10-4q6-6 8 6z' }, 'red'),
    s('path', { d: 'M124 64l12 6-12 4z' }, 'orange'),
    s('circle', { cx: 112, cy: 62, r: 3 }, 'dark'),
    s('path', { d: 'M28 70q-8-8-6-18q8 4 12 14', ...SW(4) }, 'brown', { stroke: true })
  ],
  producido: [
    s('path', { d: rects([[22, 98, 36, 36], [62, 98, 36, 36], [102, 98, 36, 36], [42, 60, 36, 36], [82, 60, 36, 36]]) }, 'brown'),
    s('path', { d: 'M22 110h36M62 110h36M102 110h36M42 72h36M82 72h36', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 62, y: 22, width: 36, height: 36 }, 'orange', { accent: true }),
    s('path', { d: 'M62 34h36', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: sparkle(116, 32, 10) + sparkle(42, 38, 7) }, 'yellow'),
    ground(136)
  ],
  protegido: [
    s('path', { d: 'M24 70a56 50 0 0 1 112 0q-8-8-18 0q-10-8-19 0q-10-8-19 0q-10-8-19 0q-10-8-19 0q-10-8-18 0z' }, 'red', { accent: true }),
    s('path', { d: 'M80 22v-6M80 70v54q0 10-10 10', ...SW(4) }, 'dark', { stroke: true }),
    ...person(98, 136, 'yellow', { h: 34, w: 22, r: 11 }),
    s('path', { d: 'M20 90l-4 10M30 110l-4 10M140 86l-4 10M134 112l-4 10M24 130l-3 8M140 132l-3 8', ...SW(3) }, 'blue', { stroke: true })
  ],
  'reelección': [
    s('rect', { x: 40, y: 70, width: 80, height: 66, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 62, y: 80, width: 36, height: 6, rx: 3 }, 'navy'),
    s('rect', { x: 66, y: 46, width: 28, height: 36, rx: 2 }, 'white'),
    s('path', { d: 'M72 60l6 6 10-12', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M28 60a52 52 0 0 1 98-14M132 100a52 52 0 0 1-98 14', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M126 30v18h-18M34 132v-18h18', ...SW(5) }, 'orange', { stroke: true })
  ],
  reinado: [
    s('path', { d: 'M46 24h68v76H46z' }, 'red', { accent: true }),
    s('path', { d: 'M38 96h84v14H38zM44 110v28M116 110v28' }, 'brown'),
    s('path', { d: 'M44 110v28M116 110v28', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M54 34h52v54H54z' }, 'purple'),
    s('path', { d: 'M62 72V50l9 8 9-14 9 14 9-8v22z' }, 'yellow'),
    s('path', { d: 'M40 20h80', ...SW(8) }, 'yellow', { stroke: true })
  ],
  remoto: [
    s('rect', { x: 14, y: 20, width: 132, height: 80 }, 'sky'),
    s('rect', { x: 14, y: 96, width: 132, height: 44 }, 'blue'),
    s('path', { d: 'M100 98q12-12 24 0z' }, 'tan', { accent: true }),
    s('path', { d: 'M112 98q2-14 0-22M112 76q-8-4-12 2M112 76q8-4 12 2', ...SW(2) }, 'green', { stroke: true }),
    s('path', { d: 'M24 128q8-6 16 0M56 116q8-6 16 0', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: birds([[54, 46]]), ...SW(2) }, 'dark', { stroke: true })
  ],
  'retórica': [
    s('rect', { x: 18, y: 108, width: 54, height: 30, rx: 2 }, 'gray'),
    s('circle', { cx: 44, cy: 58, r: 14 }, 'skin'),
    s('path', { d: 'M28 108V84q0-12 16-12q16 0 16 12v24z' }, 'white'),
    s('path', { d: 'M28 108V84q0-12 16-12l16 36z' }, 'cream'),
    s('path', { d: 'M58 80l18-18', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: bubble(80, 18, 66, 46) }, 'purple', { accent: true }),
    s('path', { d: 'M94 38q8-8 16 0t16 0', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: sparkle(130, 82, 8) + sparkle(104, 92, 6) }, 'yellow')
  ],
  sucesor: [
    ground(),
    ...lean(42, 136, 12, 'blue', { h: 44, w: 26, r: 12 }),
    ...lean(118, 136, 14, 'green', { h: 44, w: 26, r: 12, accent: true }),
    s('path', { d: 'M58 102l22-6M100 96l-14 0', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M76 90l14 8', ...SW(8) }, 'orange', { stroke: true }),
    arrow('M98 52h28M118 44l8 8-8 8', 'orange', 4)
  ],
  sureste: [
    s('rect', { x: 18, y: 18, width: 124, height: 124, rx: 8 }, 'mint'),
    s('path', { d: 'M80 18v124M18 80h124', ...SW(3) }, 'green', { stroke: true }),
    s('rect', { x: 80, y: 80, width: 62, height: 62, rx: 0 }, 'yellow', { accent: true }),
    arrow('M44 44L118 118M118 94v24H94', 'red', 8),
    s('circle', { cx: 44, cy: 44, r: 8 }, 'navy')
  ],
  tiroteo: [
    s('rect', { x: 14, y: 70, width: 30, height: 66, rx: 3 }, 'brown'),
    s('rect', { x: 116, y: 70, width: 30, height: 66, rx: 3 }, 'brown'),
    s('path', { d: 'M48 60h64M48 92h64M48 124h64', ...DASH(4, '8 10') }, 'dark', { stroke: true }),
    s('path', { d: burst(44, 60, 14, 6, 7) + burst(116, 92, 14, 6, 7) + burst(44, 124, 12, 5, 7) }, 'orange', { accent: true }),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 70V40M136 70V40', ...SW(3) }, 'tan', { stroke: true })
  ],
  trasladar: [
    ground(140),
    s('rect', { x: 14, y: 58, width: 84, height: 60, rx: 4 }, 'orange', { accent: true }),
    s('path', { d: 'M98 74h24l18 22v22H98z' }, 'red'),
    s('path', { d: 'M104 80h16l12 14h-28z' }, 'sky'),
    s('path', { d: dots([[36, 124], [118, 124]], 12) }, 'dark'),
    s('path', { d: rects([[26, 34, 26, 24], [56, 40, 24, 18]]) }, 'brown'),
    arrow('M22 92h52M64 82l10 10-10 10', 'white', 5)
  ],
  trastorno: [
    s('path', { d: 'M40 140v-26q-20-14-20-46q0-48 52-50q50 0 58 44l14 28-14 4v18q0 10-14 10h-16v18z' }, 'gray'),
    s('path', { d: 'M48 64q10-24 32-8t26-2q10 20-12 26t-26-12-20 18q6 16 30 6', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M64 48l12 30 10-30 8 30', ...SW(3) }, 'purple', { stroke: true })
  ],
  trayecto: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 8 }, 'cream'),
    s('path', { d: 'M38 124q-10-40 40-46t42-46', ...DASH(5, '8 7') }, 'blue', { stroke: true, accent: true }),
    s('circle', { cx: 38, cy: 124, r: 9 }, 'green'),
    s('path', { d: 'M120 36c-10-10-12-14-12-20a12 12 0 0 1 24 0c0 6-2 10-12 20z' }, 'red'),
    s('circle', { cx: 120, cy: 16, r: 4 }, 'white'),
    s('path', { d: 'M28 40q10-8 20 0M100 120q10-8 20 0', ...SW(4) }, 'tan', { stroke: true })
  ],
  ubicar: [
    s('rect', { x: 16, y: 120, width: 128, height: 10, rx: 3 }, 'brown'),
    s('rect', { x: 78, y: 82, width: 40, height: 38, rx: 2, ...DASH(3, '5 4') }, 'gray', { stroke: true }),
    s('rect', { x: 26, y: 82, width: 40, height: 38, rx: 2 }, 'blue'),
    s('rect', { x: 74, y: 24, width: 40, height: 36, rx: 2 }, 'orange', { accent: true }),
    s('path', { d: 'M74 36h40', ...SW(3) }, 'tan', { stroke: true }),
    arrow('M126 34v40M118 66l8 8 8-8', 'green', 4)
  ],
  accionista: [
    s('circle', { cx: 46, cy: 66, r: 16 }, 'skin'),
    s('path', { d: busts([46], 140, 50, 56) }, 'navy'),
    s('path', { d: 'M62 102l18-6', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: wedge(106, 74, 34, -90, 200) }, 'gray'),
    s('path', { d: wedge(112, 68, 34, 200, 270) }, 'green', { accent: true }),
    arrow('M100 136l14-14 8 6 18-20M128 108h12v12', 'green', 4)
  ],
  anexo: [
    ...paper(22, 22, 84, 112),
    s('path', { d: 'M34 42h60M34 56h60M34 70h40', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 78, y: 70, width: 60, height: 74, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M88 92h40M88 104h40M88 116h26', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M100 80V52a8 8 0 0 1 16 0v40a5 5 0 0 1-10 0V60', ...SW(4) }, 'dark', { stroke: true })
  ],
  antena: [
    s('path', { d: 'M24 136l56-30 56 30z' }, 'red'),
    s('path', { d: 'M80 108V34', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 48h52M60 62h40M66 76h28', ...SW(5) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: 'M104 22q10 10 0 20M114 14q18 18 0 36M56 22q-10 10 0 20M46 14q-18 18 0 36', ...SW(4) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 32, r: 5 }, 'red')
  ],
  asesinar: [
    backdrop('dark'),
    s('path', { d: 'M80 22l12 14v62H68V36z' }, 'gray', { accent: true }),
    s('path', { d: 'M80 30v64', ...SW(2) }, 'white', { stroke: true }),
    s('rect', { x: 54, y: 98, width: 52, height: 10, rx: 4 }, 'yellow'),
    s('rect', { x: 72, y: 108, width: 16, height: 26, rx: 4 }, 'brown'),
    s('path', { d: drop(110, 72, 5) + drop(122, 92, 4) }, 'red')
  ],
  avisar: [
    s('path', { d: 'M80 22q-34 0-34 40v30l-12 16h92l-12-16V62q0-40-34-40z' }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 118, r: 10 }, 'orange'),
    s('circle', { cx: 80, cy: 20, r: 6 }, 'orange'),
    s('path', { d: 'M30 40q-10 16 0 34M18 30q-16 26 0 54M130 40q10 16 0 34M142 30q16 26 0 54', ...SW(5) }, 'red', { stroke: true })
  ],
  cabecera: [
    s('path', { d: 'M18 140V36q0-14 14-14h8q14 0 14 14v104z' }, 'brown', { accent: true }),
    s('rect', { x: 52, y: 92, width: 92, height: 26 }, 'blue'),
    s('path', { d: 'M136 118v22M30 140v0', ...SW(8) }, 'brown', { stroke: true }),
    s('rect', { x: 56, y: 76, width: 36, height: 18, rx: 8 }, 'white'),
    s('rect', { x: 56, y: 76, width: 36, height: 18, rx: 8, ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 18, y: 118, width: 126, height: 10 }, 'tan'),
    s('circle', { cx: 36, cy: 44, r: 6 }, 'yellow')
  ],
  calibre: [
    s('path', { d: 'M14 54h132v20H14z' }, 'gray', { accent: true }),
    s('path', { d: 'M24 54v8M36 54v12M48 54v8M60 54v12M72 54v8M84 54v12M96 54v8M108 54v12M120 54v8M132 54v12', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 74h20v60l-20-24z' }, 'gray'),
    s('path', { d: 'M78 48h28v32H96v54l-18-24z' }, 'blue'),
    s('circle', { cx: 92, cy: 40, r: 7 }, 'dark'),
    s('path', { d: 'M14 30h132', ...DASH(2, '4 4') }, 'gray', { stroke: true })
  ],
  calvo: [
    s('path', { d: busts([80], 150, 92, 30) }, 'green'),
    s('circle', { cx: 80, cy: 76, r: 44 }, 'skin', { accent: true }),
    s('path', { d: 'M38 84q-4-22 6-30M122 84q4-22-6-30', ...SW(9) }, 'brown', { stroke: true }),
    s('path', { d: dots([[64, 82], [96, 82]], 5) }, 'dark'),
    s('path', { d: 'M68 100q12 8 24 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 44q10-8 22-8', ...SW(5) }, 'white', { stroke: true, lineColor: 'gray' }),
    s('path', { d: sparkle(116, 30, 9) }, 'yellow')
  ],
  'cartón': [
    s('path', { d: 'M26 64l54-20 54 20v62l-54 20-54-20z' }, 'tan', { accent: true }),
    s('path', { d: 'M80 84v62l54-20V64z' }, 'brown'),
    s('path', { d: 'M26 64l54 20 54-20', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M26 64l-12-22 54-16 12 18zM134 64l12-22-54-16-12 18z' }, 'tan'),
    s('path', { d: 'M40 100l24 9', ...SW(3) }, 'brown', { stroke: true })
  ],
  chofer: [
    s('rect', { x: 14, y: 22, width: 132, height: 80, rx: 8 }, 'sky'),
    s('circle', { cx: 80, cy: 66, r: 20 }, 'skin'),
    s('path', { d: 'M56 54q24-16 48 0v-8q-24-14-48 0zM56 54h52' }, 'navy'),
    s('path', { d: 'M54 52h54', ...SW(6) }, 'navy', { stroke: true }),
    s('path', { d: busts([80], 120, 56, 30) }, 'navy'),
    s('path', { d: ring(80, 124, 30), ...SW(9) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: 'M50 124h60M80 124v28', ...SW(6) }, 'dark', { stroke: true })
  ],
  colapso: [
    ground(),
    s('path', { d: 'M28 136V64h36v72z' }, 'gray'),
    s('path', { d: 'M76 136l4-46 26-4 10 50z' }, 'tan', { accent: true }),
    s('path', { d: rects([[36, 74, 8, 10], [50, 74, 8, 10], [36, 96, 8, 10], [50, 96, 8, 10]]) }, 'sky'),
    s('path', { d: 'M96 36h22v18H96zM118 64l16 10-10 14-16-10zM84 60l14 4-4 12-14-4z' }, 'tan'),
    s('path', { d: ells([[64, 124, 12, 8], [128, 126, 14, 9]]) }, 'gray'),
    s('path', { d: 'M100 30l-6-8M126 56l8-6', ...SW(3) }, 'dark', { stroke: true })
  ],
  'comercialización': [
    s('rect', { x: 14, y: 116, width: 132, height: 10, rx: 3 }, 'brown'),
    s('path', { d: halfRays(80, 70, 48, 62, 5), ...SW(4) }, 'yellow', { stroke: true }),
    s('rect', { x: 52, y: 60, width: 56, height: 56, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: star(80, 88, 14) }, 'yellow'),
    s('path', { d: 'M106 70l24-8 12 12-8 24-24 6-12-12z' }, 'orange'),
    s('circle', { cx: 128, cy: 74, r: 4 }, 'white'),
    s('path', { d: 'M126 70q-10-14-24-10', ...SW(2) }, 'dark', { stroke: true })
  ],
  complemento: [
    s('path', { d: 'M24 84h60l-6 50H30z' }, 'red', { accent: true }),
    s('path', { d: 'M36 84q0-26 18-26t18 26', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M96 34q22 34 44 0', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[118, 51]], 7) }, 'blue'),
    s('path', { d: ells([[104, 112, 14, 11], [136, 112, 14, 11]]) }, 'dark'),
    s('path', { d: 'M118 110h4M90 106l-4-6M150 106l-4-6', ...SW(3) }, 'dark', { stroke: true })
  ],
  comprador: [
    ...person(54, 136, 'purple', { h: 50, w: 30, r: 13 }),
    s('path', { d: 'M68 96h20', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M82 100h44l6 38H76z' }, 'orange', { accent: true }),
    s('path', { d: 'M94 100q0-16 10-16t10 16', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M14 112h26l4 26H18z' }, 'green'),
    ground(140)
  ],
  cordillera: [
    s('rect', { x: 14, y: 20, width: 132, height: 110, rx: 6 }, 'sky'),
    s('path', { d: 'M14 130l26-58 18 26 26-62 22 44 14-20 26 70z' }, 'gray', { accent: true }),
    s('path', { d: 'M84 36l-9 21 9-5 9 6zM40 72l-7 15 7-3 7 4zM120 60l-6 13 6-3 6 3z' }, 'white'),
    s('path', { d: 'M14 130l22-34 22 34zM96 130l22-36 28 36z' }, 'green')
  ],
  demora: [
    s('circle', { cx: 52, cy: 56, r: 38 }, 'white'),
    s('path', { d: ring(52, 56, 38) + 'M52 56V32M52 56l16 10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 136h86q8 0 8-8l12-24-10-2-8 14q-18-30-44-30t-36 24q-12 10-8 26z' }, 'mint'),
    s('circle', { cx: 82, cy: 112, r: 22 }, 'orange', { accent: true }),
    s('path', { d: 'M82 112a8 8 0 1 1 8-8m-8 8a14 14 0 1 0 14-14', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M138 104l-4-14M144 102l2-14', ...SW(2) }, 'dark', { stroke: true })
  ],
  dominar: [
    s('rect', { x: 36, y: 18, width: 88, height: 10, rx: 4 }, 'brown', { accent: true }),
    s('path', { d: 'M48 28l18 46M80 28v34M112 28l-18 46', ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 72, r: 12 }, 'skin'),
    s('rect', { x: 66, y: 86, width: 28, height: 34, rx: 8 }, 'red'),
    s('path', { d: 'M66 90l-6 0M94 90l6 0M72 120l-4 18M88 120l4 18', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M54 72l12 18M106 72l-12 18', ...SW(2) }, 'gray', { stroke: true })
  ],
  elector: [
    s('rect', { x: 70, y: 84, width: 72, height: 54, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 90, y: 82, width: 32, height: 6, rx: 3 }, 'navy'),
    s('rect', { x: 94, y: 50, width: 24, height: 36, rx: 2 }, 'white'),
    s('rect', { x: 94, y: 50, width: 24, height: 36, rx: 2, ...SW(2) }, 'gray', { stroke: true }),
    ...person(40, 138, 'green', { h: 52, w: 30, r: 13 }),
    s('path', { d: 'M54 96l36-30', ...SW(7) }, 'skin', { stroke: true })
  ],
  'estratégico': [
    s('rect', { x: 14, y: 22, width: 132, height: 116, rx: 6 }, 'tan'),
    s('path', { d: 'M60 100l26-40 30 40z' }, 'brown'),
    s('path', { d: 'M86 60V30', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 30h20l-6 7 6 7H86z' }, 'red', { accent: true }),
    s('path', { d: 'M24 128q10-40 40-36M136 128q-6-20-26-26', ...DASH(4, '6 5') }, 'blue', { stroke: true }),
    s('path', { d: dots([[24, 128], [136, 128]], 6) }, 'blue')
  ],
  forzado: [
    ground(),
    ...lean(58, 136, -22, 'yellow', { h: 46, w: 28, r: 12, accent: true }),
    s('path', { d: 'M68 104H146', ...SW(5) }, 'brown', { stroke: true }),
    arrow('M104 84h34M128 74l10 10-10 10', 'red', 6),
    s('path', { d: 'M64 104h8', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M22 130l-8 4M30 124l-12 2M68 136l-10 0', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: drop(28, 44, 4) }, 'sky')
  ],
  freno: [
    s('circle', { cx: 74, cy: 84, r: 54 }, 'gray'),
    s('path', { d: dots(around(74, 84, 38, 8), 4) }, 'dark'),
    s('circle', { cx: 74, cy: 84, r: 18 }, 'dark'),
    s('path', { d: 'M110 40q30 10 32 44t-32 44l-6-14q22-10 20-30t-20-30z' }, 'red', { accent: true }),
    s('circle', { cx: 74, cy: 84, r: 6 }, 'gray')
  ],
  fu: [
    s('path', { d: 'M22 126q-4-50 30-62q30-10 50 0q30 12 22 62z' }, 'orange', { accent: true }),
    s('path', { d: 'M30 126v-14M110 126v-14', ...SW(8) }, 'orange', { stroke: true }),
    s('path', { d: 'M22 100q-10-20 0-40', ...SW(7) }, 'orange', { stroke: true }),
    s('circle', { cx: 112, cy: 64, r: 22 }, 'orange'),
    s('path', { d: 'M96 50l2-18 12 12zM124 46l8-14 4 18z' }, 'orange'),
    s('path', { d: 'M100 62l8 3M124 62l-8 3M104 74l8 6 8-6M80 26l-6 6M84 50l-8 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 64l-4-10M60 60l-2-12M76 62l2-10', ...SW(3) }, 'brown', { stroke: true })
  ],
  incorporar: [
    s('path', { d: dots([[44, 70], [70, 56], [44, 100], [70, 114], [86, 86]], 16) }, 'blue'),
    s('circle', { cx: 126, cy: 86, r: 16 }, 'green', { accent: true }),
    arrow('M106 86h-6M108 74l-10 12 10 12', 'orange', 5),
    s('path', { d: ring(64, 85, 52), ...DASH(3, '6 6') }, 'gray', { stroke: true })
  ],
  instinto: [
    s('rect', { x: 14, y: 14, width: 132, height: 58 }, 'sky'),
    s('path', { d: 'M14 72h132v24q-30 10-66 0t-66 0z' }, 'blue'),
    s('path', { d: 'M14 96q36-10 66 0t66 0v50H14z' }, 'tan'),
    s('ellipse', { cx: 80, cy: 120, rx: 18, ry: 13 }, 'green', { accent: true }),
    s('path', { d: 'M64 112l-10-6M96 112l10-6M66 130l-8 6M94 130l8 6M80 107v-8', ...SW(6) }, 'mint', { stroke: true }),
    s('circle', { cx: 120, cy: 36, r: 12 }, 'yellow')
  ],
  navegar: [
    s('path', { d: 'M14 116q11-8 22 0t22 0 22 0 22 0 22 0 22 0V146H14z' }, 'blue'),
    s('path', { d: 'M30 104h100l-14 18H44z' }, 'brown'),
    s('path', { d: 'M80 104V22', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M84 26q34 30 34 72H84z' }, 'white', { accent: true }),
    s('path', { d: 'M84 26q34 30 34 72H84z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M76 34q-30 26-30 64h30z' }, 'red')
  ],
  'obtención': [
    s('path', { d: star(80, 46, 30) }, 'yellow', { accent: true }),
    s('path', { d: 'M54 140v-30q0-12 10-14l2-14q4-4 8 0v10l2-14q4-4 8 0v14l2-10q4-4 8 0v12q12 4 10 20l-6 26z' }, 'skin'),
    s('rect', { x: 50, y: 136, width: 52, height: 10, rx: 3 }, 'blue'),
    s('path', { d: sparkle(126, 30, 9) + sparkle(30, 64, 7) }, 'orange')
  ],
  'pabellón': [
    ground(),
    s('path', { d: 'M18 82l62-46 62 46z' }, 'red', { accent: true }),
    s('path', { d: 'M40 66l40-30-14 46zM120 66l-40-30 14 46z' }, 'white'),
    s('rect', { x: 26, y: 82, width: 108, height: 54 }, 'cream'),
    s('path', { d: 'M62 136v-34q18-12 36 0v34z' }, 'brown'),
    s('path', { d: 'M80 36V16', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 16h18l-5 5 5 5H80z' }, 'blue'),
    s('path', { d: 'M18 82l62-46 62 46', ...SW(3) }, 'dark', { stroke: true })
  ],
  pausa: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'blue', { accent: true }),
    s('path', { d: rects([[56, 50, 16, 60], [88, 50, 16, 60]]) }, 'white'),
    s('path', { d: ring(80, 80, 66), ...SW(3) }, 'sky', { stroke: true })
  ],
  perfume: [
    s('rect', { x: 40, y: 64, width: 64, height: 74, rx: 14 }, 'pink', { accent: true }),
    s('rect', { x: 62, y: 46, width: 20, height: 18 }, 'yellow'),
    s('rect', { x: 56, y: 32, width: 32, height: 16, rx: 4 }, 'dark'),
    s('path', { d: 'M50 80v40', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: dots([[104, 34], [116, 26], [118, 42], [130, 34], [132, 18], [140, 46]], 3) }, 'purple')
  ],
  plantel: [
    ground(),
    s('path', { d: dots([[28, 66], [80, 66], [132, 66], [54, 82], [106, 82]], 11) }, 'skin'),
    s('path', { d: busts([28, 80, 132], 110, 26, 30) }, 'red', { accent: true }),
    s('path', { d: busts([54, 106], 136, 28, 40) }, 'red'),
    s('path', { d: 'M54 108v12M106 108v12', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M28 92v8M80 92v8M132 92v8', ...SW(4) }, 'white', { stroke: true })
  ],
  plural: [
    s('circle', { cx: 30, cy: 80, r: 14 }, 'gray'),
    arrow('M52 80h18M62 72l8 8-8 8', 'orange', 5),
    s('path', { d: dots([[96, 46], [126, 46], [86, 80], [116, 80], [96, 114], [126, 114], [140, 80]], 13) }, 'red', { accent: true }),
    s('path', { d: dots([[92, 42], [122, 42], [82, 76], [112, 76], [92, 110], [122, 110], [136, 76]], 3) }, 'white')
  ],
  'psicológico': [
    s('path', { d: 'M40 140v-26q-20-14-20-46q0-48 52-50q50 0 58 44l14 28-14 4v18q0 10-14 10h-16v18z' }, 'sky'),
    s('path', { d: ells([[66, 62, 26, 20], [88, 58, 20, 16]]) }, 'pink', { accent: true }),
    s('path', { d: 'M52 58q8-8 14 0M74 50q6 8 14 2M70 70q10-6 20 0', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: heart(76, 92, 10) }, 'red')
  ],
  pulgada: [
    s('rect', { x: 14, y: 92, width: 132, height: 34, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M26 92v14M38 92v8M50 92v14M62 92v8M74 92v18M86 92v8M98 92v14M110 92v8M122 92v14M134 92v8', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M50 88V40q0-16 16-16t16 16v48z' }, 'skin'),
    s('path', { d: 'M56 46q0-14 10-14t10 14v6H56z' }, 'pink'),
    arrow('M48 136h36M54 130l-6 6 6 6M78 130l6 6-6 6', 'red', 3)
  ],
  raya: [
    s('path', { d: 'M80 30q50 20 64 56q-30 24-64 30q-34-6-64-30q14-36 64-56z' }, 'gray', { accent: true }),
    s('path', { d: 'M80 116q4 14 0 30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[68, 64], [92, 64]], 4) }, 'dark'),
    s('path', { d: dots([[60, 86], [80, 94], [100, 86], [80, 76]], 3) }, 'white'),
    s('path', { d: 'M30 82q50 18 100 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  reaccionar: [
    s('path', { d: burst(110, 56, 30, 14, 10) }, 'yellow', { accent: true }),
    s('path', { d: 'M110 86q-6 20 4 50', ...SW(2) }, 'dark', { stroke: true }),
    s('circle', { cx: 40, cy: 66, r: 16 }, 'skin'),
    s('rect', { x: 26, y: 84, width: 28, height: 36, rx: 9 }, 'blue'),
    s('path', { d: 'M28 92l-12-20M52 92l14-20M32 120l-6 16M48 120l6 16', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M18 40l-4-8M40 36v-10M62 40l4-8', ...SW(3) }, 'orange', { stroke: true }),
    s('circle', { cx: 40, cy: 72, r: 4 }, 'dark')
  ],
  reducido: [
    s('rect', { x: 20, y: 20, width: 120, height: 120, rx: 6, ...DASH(3, '6 6') }, 'gray', { stroke: true }),
    s('rect', { x: 58, y: 58, width: 44, height: 44, rx: 4 }, 'blue', { accent: true }),
    arrow('M28 28l22 22M50 36v14H36M132 28l-22 22M110 36v14h14M28 132l22-22M36 110h14v14M132 132l-22-22M124 110h-14v14', 'orange', 4)
  ],
  relleno: [
    s('path', { d: 'M18 98q0-50 62-50t62 50z' }, 'tan'),
    s('path', { d: 'M18 98h124', ...SW(14) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M18 106h124q0 30-62 30t-62-30z' }, 'tan'),
    s('path', { d: 'M40 70q8-6 16 0M80 62q8-6 16 0M108 76q8-6 16 0', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: drop(64, 118, 5) + drop(98, 120, 5) }, 'red')
  ],
  remate: [
    s('path', { d: 'M86 30h58v104', ...SW(6) }, 'white', { stroke: true, lineColor: 'gray' }),
    s('path', { d: 'M86 30h58v104', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M92 38h46v96M92 58h46M92 82h46M92 106h46M106 38v96M122 38v96', ...SW(1.5) }, 'gray', { stroke: true }),
    s('circle', { cx: 118, cy: 72, r: 15 }, 'white'),
    s('path', { d: ring(118, 72, 15) + 'M110 64l8 4 8-4', ...SW(3) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: 'M24 118q40-4 72-40', ...DASH(4, '6 6') }, 'orange', { stroke: true }),
    ground()
  ],
  renacimiento: [
    ground(),
    s('path', { d: 'M36 136v-34h20l6 10 10-8h20v32z' }, 'brown'),
    s('path', { d: 'M50 102l-6 10M80 104l8 10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M72 104V60', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(72, 68, -140, 34, 12) + leaflet(72, 60, -40, 36, 12) }, 'green', { accent: true }),
    s('circle', { cx: 122, cy: 40, r: 14 }, 'yellow'),
    s('path', { d: rays(122, 40, 18, 26, 8), ...SW(3) }, 'yellow', { stroke: true })
  ],
  sendero: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 8 }, 'mint'),
    s('path', { d: 'M60 146q-30-40 30-60t-4-66', ...SW(16) }, 'tan', { stroke: true, accent: true }),
    s('path', { d: 'M28 40l12-24 12 24zM110 70l14-28 14 28zM110 120l12-24 12 24zM20 98l12-24 12 24z' }, 'green'),
    s('path', { d: 'M40 40v8M124 70v8M122 120v8M32 98v8', ...SW(4) }, 'brown', { stroke: true })
  ],
  soltar: [
    s('path', { d: 'M36 140v-30l-14-14 10-6 16 10V82q4-6 10 0v18l8-14q6-2 8 4l-6 18 10-12q6 0 6 6l-14 24v14z' }, 'skin'),
    s('path', { d: 'M100 52q8-14 26-12q-6 6-4 10q16 0 22 10q-16 4-26 2q-4 14-20 10q6-10 2-20z' }, 'sky', { accent: true }),
    s('path', { d: 'M82 76q-6-6-2-14M66 70l-6-8', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 132, cy: 50, r: 2.5 }, 'dark'),
    s('path', { d: 'M144 54l6 2-6 2z' }, 'orange')
  ],
  suspender: [
    s('rect', { x: 18, y: 18, width: 124, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M50 28l30 48M110 28L80 76', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 54, y: 76, width: 52, height: 44, rx: 4 }, 'orange', { accent: true }),
    s('path', { d: 'M54 90h52', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 128v14M70 134v8M90 134v8', ...DASH(2, '2 4') }, 'gray', { stroke: true })
  ],
  suyas: [
    ...lady(40, 136, 'purple'),
    ...lady(84, 136, 'green'),
    s('path', { d: 'M108 100h36l-4 36h-28z' }, 'pink', { accent: true }),
    s('path', { d: 'M116 100q0-14 10-14t10 14', ...SW(4) }, 'brown', { stroke: true }),
    arrow('M96 94l10 4', 'orange', 4)
  ],
  'teología': [
    s('path', { d: halfRays(80, 70, 30, 56, 7), ...SW(5) }, 'yellow', { stroke: true }),
    ...openBook(80, 74, 'cream', 'purple'),
    s('path', { d: 'M40 92h28M40 104h28M92 92h28M92 104h28', ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 52, r: 10 }, 'yellow', { accent: true })
  ],
  trozo: [
    s('path', { d: 'M18 76h86v56H18z' }, 'tan'),
    s('path', { d: 'M18 76q43-24 86 0z' }, 'cream'),
    s('path', { d: 'M18 100h86', ...SW(6) }, 'pink', { stroke: true }),
    s('path', { d: 'M112 70l34 10v52l-34-10z' }, 'tan', { accent: true }),
    s('path', { d: 'M112 94l34 10', ...SW(6) }, 'pink', { stroke: true }),
    s('circle', { cx: 60, cy: 64, r: 8 }, 'red'),
    ground(136)
  ],
  valenciano: [
    s('path', { d: ells([[80, 112, 64, 18]]) }, 'dark'),
    s('path', { d: ells([[80, 108, 56, 14]]) }, 'yellow', { accent: true }),
    s('path', { d: dots([[56, 106], [96, 104], [76, 112], [110, 110]], 5) }, 'red'),
    s('path', { d: dots([[66, 102], [88, 112], [46, 110]], 3) }, 'green'),
    s('circle', { cx: 112, cy: 50, r: 24 }, 'orange'),
    s('path', { d: leaflet(112, 28, -150, 26, 8) }, 'green')
  ],
  vergonzoso: [
    s('circle', { cx: 80, cy: 80, r: 52 }, 'skin'),
    s('path', { d: ells([[54, 96, 14, 9], [106, 96, 14, 9]]) }, 'pink', { accent: true }),
    s('path', { d: 'M24 136l20-58h18l-6 58zM136 136l-20-58H98l6 58z' }, 'skin'),
    s('path', { d: 'M44 78h18M98 78h18', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M70 112q10 6 20 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 44q-4-8 0-14', ...SW(3) }, 'sky', { stroke: true })
  ],
  vigilar: [
    s('path', { d: 'M18 22v40', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 42h20', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 30l84 22-10 28-80-24z' }, 'white'),
    s('path', { d: 'M36 30l84 22-10 28-80-24z', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 116, cy: 66, r: 10 }, 'dark', { accent: true }),
    s('path', { d: 'M110 80l-24 60h60z' }, 'yellow'),
    s('circle', { cx: 50, cy: 46, r: 4 }, 'red')
  ],
  adonde: [
    ...person(40, 136, 'blue', { h: 46, w: 28, r: 12 }),
    ground(),
    s('path', { d: 'M56 96q40-6 64-52', ...DASH(4, '6 6') }, 'orange', { stroke: true }),
    s('path', { d: 'M120 64c-14-14-16-20-16-28a16 16 0 0 1 32 0c0 8-2 14-16 28z' }, 'red', { accent: true }),
    s('circle', { cx: 120, cy: 36, r: 6 }, 'white')
  ],
  alias: [
    s('circle', { cx: 80, cy: 80, r: 52 }, 'skin'),
    s('path', { d: 'M28 64q0-40 52-40t52 40z' }, 'dark'),
    s('path', { d: ring(62, 82, 13) + ring(98, 82, 13) + 'M75 82h10', ...SW(6) }, 'black', { stroke: true }),
    s('path', { d: 'M74 92l6 14h-8', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M56 114q12-10 24-2q12-8 24 2q-12 6-24 0q-12 6-24 0z' }, 'brown', { accent: true })
  ],
  amado: [
    s('path', { d: heart(80, 96, 32) }, 'red', { accent: true }),
    s('path', { d: 'M20 120l120-80', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M140 40l-14 0 4 10zM20 120l-6 10 10 0' }, 'yellow'),
    s('path', { d: 'M30 114l-8-4M28 124l-10 0', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M54 66q6-12 18-12', ...SW(4) }, 'white', { stroke: true })
  ],
  amazona: [
    ...horse('brown', 'dark'),
    s('circle', { cx: 78, cy: 34, r: 11 }, 'skin'),
    s('path', { d: 'M68 30q0 26-8 32', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M68 46h20l2 30H66z' }, 'red', { accent: true }),
    s('path', { d: 'M86 54l24-6', ...SW(4) }, 'skin', { stroke: true })
  ],
  apetecer: [
    s('circle', { cx: 52, cy: 100, r: 40 }, 'skin'),
    s('path', { d: 'M34 92q4-6 8 0M60 92q4-6 8 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M38 112q14 12 30 0', ...SW(3) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 64, cy: 118, rx: 6, ry: 5 }, 'pink'),
    s('path', { d: ells([[112, 50, 34, 28]]) + dots([[78, 84], [86, 76]], 4) }, 'gray'),
    s('path', { d: 'M100 56h24l-12 26z' }, 'tan'),
    s('circle', { cx: 112, cy: 48, r: 13 }, 'pink', { accent: true })
  ],
  aplicado: [
    s('rect', { x: 14, y: 112, width: 132, height: 10, rx: 3 }, 'brown'),
    s('circle', { cx: 56, cy: 66, r: 16 }, 'skin'),
    s('path', { d: busts([56], 112, 40, 28) }, 'green'),
    s('path', { d: 'M38 96l28 4 28-4v18l-28 4-28-4z' }, 'red', { accent: true }),
    s('path', { d: 'M40 92q13-2 26 4v16q-13-6-26-4zM92 92q-13-2-26 4v16q13-6 26-4z' }, 'white'),
    s('path', { d: 'M128 112V60l-16-12', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 44l16-6 6 16z' }, 'yellow')
  ],
  ausente: [
    ground(),
    ...person(34, 112, 'blue', { h: 30, w: 24, r: 11 }),
    ...person(126, 112, 'red', { h: 30, w: 24, r: 11 }),
    s('path', { d: 'M18 112h32M110 112h32M24 112v24M44 112v24M116 112v24M136 112v24', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M64 112h32M70 112v24M90 112v24M68 112V80', ...SW(5) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M80 50a10 10 0 1 0 0.1 0M68 108V74h24v34', ...DASH(3, '4 4') }, 'gray', { stroke: true })
  ],
  'batallón': [
    ground(),
    s('path', { d: 'M18 50a12 12 0 0 1 24 0zM50 50a12 12 0 0 1 24 0zM82 50a12 12 0 0 1 24 0zM114 50a12 12 0 0 1 24 0z' }, 'green', { accent: true }),
    s('path', { d: dots([[30, 56], [62, 56], [94, 56], [126, 56]], 9) }, 'skin'),
    s('path', { d: rects([[20, 66, 20, 42], [52, 66, 20, 42], [84, 66, 20, 42], [116, 66, 20, 42]]) }, 'green'),
    s('path', { d: 'M24 108v28M36 108v28M56 108v28M68 108v28M88 108v28M100 108v28M120 108v28M132 108v28', ...SW(5) }, 'dark', { stroke: true })
  ],
  callar: [
    s('circle', { cx: 74, cy: 80, r: 56 }, 'skin'),
    s('path', { d: 'M48 72q6-6 12 0M88 72q6-6 12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 74, cy: 106, rx: 10, ry: 6 }, 'red'),
    s('rect', { x: 68, y: 82, width: 12, height: 56, rx: 6 }, 'tan', { accent: true }),
    s('path', { d: 'M118 60q12 10 0 20M128 52q18 18 0 36', ...SW(4) }, 'gray', { stroke: true })
  ],
  camarada: [
    ground(),
    ...person(56, 136, 'blue', { h: 50, w: 30, r: 13 }),
    ...person(104, 136, 'green', { h: 50, w: 30, r: 13, accent: true }),
    s('path', { d: 'M66 92q14-14 30-8', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M50 60q6 5 12 0M98 60q6 5 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: heart(80, 22, 9) }, 'red')
  ],
  cansancio: [
    s('circle', { cx: 62, cy: 82, r: 46 }, 'skin'),
    s('path', { d: 'M38 74h16M70 74h16', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M38 82q8 6 16 0M70 82q8 6 16 0', ...SW(3) }, 'purple', { stroke: true }),
    s('ellipse', { cx: 62, cy: 106, rx: 8, ry: 10 }, 'dark'),
    s('rect', { x: 114, y: 50, width: 26, height: 56, rx: 4, ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 122, y: 42, width: 10, height: 8, rx: 2 }, 'dark'),
    s('rect', { x: 118, y: 92, width: 18, height: 10, rx: 2 }, 'red', { accent: true })
  ],
  captar: [
    s('circle', { cx: 62, cy: 96, r: 40 }, 'skin'),
    s('path', { d: dots([[48, 92], [76, 92]], 5) }, 'dark'),
    s('path', { d: 'M50 112q12 8 24 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 56V30', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 62, cy: 26, r: 7 }, 'red', { accent: true }),
    s('path', { d: 'M86 30q10 0 12 10M88 14q24 2 26 26M102 2q26 6 30 38', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: sparkle(130, 70, 9) }, 'yellow')
  ],
  chef: [
    s('path', { d: 'M52 58a16 16 0 0 1 4-30a20 20 0 0 1 36-4a16 16 0 0 1 14 34z' }, 'white'),
    s('path', { d: 'M52 58a16 16 0 0 1 4-30a20 20 0 0 1 36-4a16 16 0 0 1 14 34z', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 54, y: 52, width: 52, height: 12, rx: 2 }, 'white'),
    s('circle', { cx: 80, cy: 82, r: 20 }, 'skin'),
    s('path', { d: 'M68 92q6-6 12 0q6-6 12 0', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: busts([80], 148, 70, 44) }, 'red', { accent: true }),
    s('path', { d: 'M54 64h52', ...SW(3) }, 'gray', { stroke: true })
  ],
  'cocaína': [
    s('path', { d: 'M80 144V30M80 120l-36-30M80 96l36-30M80 70L50 46', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(80, 120, -140, 46, 14) + leaflet(80, 96, -40, 46, 14) + leaflet(80, 70, -130, 40, 12) + leaflet(80, 34, -90, 30, 10) }, 'green', { accent: true }),
    s('path', { d: leaflet(80, 108, -20, 40, 12) + leaflet(80, 84, -160, 40, 12) }, 'mint'),
    s('path', { d: dots([[96, 46], [104, 52]], 4) }, 'red')
  ],
  competente: [
    ground(),
    ...person(60, 136, 'blue', { h: 50, w: 30, r: 13, accent: true }),
    s('path', { d: 'M46 52q14-20 28 0z' }, 'yellow'),
    s('path', { d: 'M74 92l24-24', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M96 70l18-18m-4-8a8 8 0 1 0 10 10', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: star(122, 104, 14) }, 'orange')
  ],
  conceder: [
    s('path', { d: 'M14 104h30l20-12h8q4 4 0 8H58', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M146 70h-30l-14 10', ...SW(10) }, 'tan', { stroke: true }),
    s('rect', { x: 60, y: 46, width: 46, height: 58, rx: 3, transform: 'rotate(-10 83 75)' }, 'white'),
    s('rect', { x: 60, y: 46, width: 46, height: 58, rx: 3, transform: 'rotate(-10 83 75)', ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 90, cy: 86, r: 10 }, 'red', { accent: true }),
    s('path', { d: 'M68 60l28-5M70 70l20-4', ...SW(3) }, 'gray', { stroke: true })
  ],
  'convicción': [
    s('path', { d: 'M14 140l18-34h96l18 34z' }, 'gray'),
    s('path', { d: 'M60 106V24', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 24h66l-12 18 12 18H62z' }, 'red', { accent: true }),
    s('path', { d: 'M54 106l6-10 6 10', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: heart(92, 40, 9) }, 'white')
  ],
  'cívico': [
    ground(),
    ...person(50, 136, 'blue', { h: 50, w: 30, r: 13 }),
    s('path', { d: 'M62 92l26-10', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M96 92h40l-6 44h-28z' }, 'green', { accent: true }),
    s('rect', { x: 92, y: 84, width: 48, height: 8, rx: 3 }, 'dark'),
    s('path', { d: 'M108 102v26M120 102v26', ...SW(3) }, 'mint', { stroke: true }),
    s('rect', { x: 94, y: 62, width: 14, height: 12, rx: 2, transform: 'rotate(20 101 68)' }, 'tan')
  ],
  delta: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 8 }, 'green'),
    s('path', { d: 'M14 112q66-20 132 0v34H14z' }, 'blue'),
    s('path', { d: 'M80 14q-6 30 0 50M80 64q-26 20-42 54M80 64q-4 26-2 52M80 64q26 20 40 52M60 86q-24 10-34 30', ...SW(6) }, 'sky', { stroke: true, accent: true }),
    s('path', { d: 'M80 64q14 6 20 26', ...SW(4) }, 'sky', { stroke: true })
  ],
  despedido: [
    s('rect', { x: 92, y: 20, width: 52, height: 116, rx: 3 }, 'brown'),
    s('rect', { x: 100, y: 28, width: 36, height: 108 }, 'cream'),
    ...person(58, 136, 'gray', { h: 50, w: 30, r: 13 }),
    s('rect', { x: 34, y: 86, width: 48, height: 30, rx: 3 }, 'tan', { accent: true }),
    s('path', { d: 'M44 86V74h10v12M64 86l4-14 8 4', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M52 62q6-4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    ground()
  ],
  detallado: [
    s('path', { d: 'M24 120q0-80 90-96q10 90-90 96z' }, 'green'),
    s('path', { d: 'M24 120l78-84M46 96l-6-20M46 96l22 2M64 76l-4-22M64 76l24 0M82 56l2-14M82 56l16 2', ...SW(2) }, 'mint', { stroke: true }),
    s('circle', { cx: 92, cy: 92, r: 30 }, 'sky', { accent: true }),
    s('path', { d: 'M76 102l20-22M84 92l-8-8', ...SW(4) }, 'mint', { stroke: true }),
    s('path', { d: ring(92, 92, 30) + 'M114 114l24 24', ...SW(7) }, 'dark', { stroke: true })
  ],
  'divulgación': [
    s('circle', { cx: 80, cy: 44, r: 6 }, 'red', { accent: true }),
    s('path', { d: ells([[80, 44, 28, 10]]) + 'M60 24q20 10 40 40M100 24q-20 10-40 40', ...SW(3) }, 'blue', { stroke: true }),
    arrow('M64 72l-22 22M80 76v20M96 72l22 22', 'orange', 4),
    s('path', { d: dots([[34, 106], [80, 108], [126, 106]], 9) }, 'skin'),
    s('path', { d: busts([34, 80, 126], 142, 24, 26) }, 'green')
  ],
  'décimo': [
    s('path', { d: dots([[24, 56], [52, 56], [80, 56], [108, 56], [136, 56], [24, 100], [52, 100], [80, 100], [108, 100]], 11) }, 'gray'),
    s('circle', { cx: 136, cy: 100, r: 13 }, 'orange', { accent: true }),
    s('path', { d: ring(136, 100, 20), ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: star(136, 100, 7) }, 'white')
  ],
  'espía': [
    s('circle', { cx: 80, cy: 64, r: 28 }, 'skin'),
    s('rect', { x: 58, y: 56, width: 44, height: 12, rx: 6 }, 'black'),
    s('path', { d: 'M40 46h80M54 46q0-26 26-26t26 26z' }, 'brown'),
    s('path', { d: 'M36 46h88', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M24 146q0-56 56-56t56 56z' }, 'tan', { accent: true }),
    s('path', { d: 'M56 96l24 50 24-50', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 50, y: 80, width: 60, height: 12, rx: 4 }, 'tan')
  ],
  'fracción': [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'cream'),
    s('path', { d: wedge(80, 80, 56, -90, 0) }, 'orange', { accent: true }),
    s('path', { d: 'M80 24v112M24 80h112' + ring(80, 80, 56), ...SW(4) }, 'brown', { stroke: true })
  ],
  frontal: [
    s('rect', { x: 26, y: 40, width: 108, height: 40, rx: 12 }, 'sky'),
    s('path', { d: 'M18 120V86q0-14 14-14h96q14 0 14 14v34z' }, 'blue', { accent: true }),
    s('rect', { x: 34, y: 46, width: 92, height: 26, rx: 6 }, 'sky'),
    s('circle', { cx: 38, cy: 94, r: 9 }, 'yellow'),
    s('circle', { cx: 122, cy: 94, r: 9 }, 'yellow'),
    s('rect', { x: 58, y: 100, width: 44, height: 12, rx: 3 }, 'dark'),
    s('path', { d: rects([[24, 120, 20, 16], [116, 120, 20, 16]]) }, 'dark'),
    s('path', { d: 'M34 46q10-12 46-12t46 12', ...SW(4) }, 'navy', { stroke: true })
  ],
  generoso: [
    s('path', { d: 'M14 112h34l22-10', ...SW(12) }, 'skin', { stroke: true }),
    s('path', { d: 'M146 112h-34l-12-6', ...SW(12) }, 'tan', { stroke: true }),
    s('rect', { x: 54, y: 62, width: 52, height: 40, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M80 62v40M54 78h52', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M80 62q-16-16-24-6q6 8 24 6q16-16 24-6q-6 8-24 6', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: heart(80, 26, 10) + heart(118, 40, 7) + heart(42, 40, 7) }, 'pink')
  ],
  grandeza: [
    ground(),
    s('rect', { x: 68, y: 70, width: 24, height: 66 }, 'brown'),
    s('circle', { cx: 80, cy: 52, r: 40 }, 'green', { accent: true }),
    s('path', { d: dots([[60, 40], [100, 40], [80, 66]], 14) }, 'mint'),
    ...person(122, 136, 'red', { h: 14, w: 10, r: 5 })
  ],
  'ideológico': [
    s('path', { d: dots([[28, 104], [80, 104], [132, 104]], 12) }, 'skin'),
    s('path', { d: busts([28, 80, 132], 144, 26, 26) }, 'blue'),
    s('path', { d: ells([[80, 40, 44, 22]]) + dots([[34, 80], [126, 80], [80, 72]], 4) }, 'gray'),
    s('path', { d: 'M28 92l50-30M132 92L82 62M80 92V64', ...DASH(2, '3 4') }, 'gray', { stroke: true }),
    s('path', { d: star(80, 40, 14) }, 'yellow', { accent: true })
  ],
  'indemnización': [
    ...person(46, 136, 'gray', { h: 50, w: 30, r: 13 }),
    s('path', { d: 'M38 130l-8 6h16zM40 110v26', ...SW(10) }, 'white', { stroke: true, lineColor: 'gray' }),
    s('path', { d: 'M36 112h20M36 120h20', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M146 80h-34', ...SW(12) }, 'tan', { stroke: true }),
    s('rect', { x: 72, y: 66, width: 44, height: 28, rx: 3 }, 'green', { accent: true }),
    s('circle', { cx: 94, cy: 80, r: 8 }, 'mint'),
    ground()
  ],
  innumerable: [
    backdrop('navy'),
    s('path', { d: star(40, 40, 10) + star(110, 36, 8) + star(80, 70, 12) + star(126, 96, 9) + star(36, 112, 8) }, 'yellow', { accent: true }),
    s('path', { d: dots([[24, 30], [60, 26], [92, 22], [134, 24], [56, 54], [100, 56], [26, 76], [56, 92], [104, 92], [136, 66], [76, 112], [116, 126], [28, 136], [58, 130], [96, 136], [140, 136], [64, 76]], 2.5) }, 'white'),
    s('path', { d: dots([[88, 44], [44, 66], [120, 74], [90, 120], [20, 98]], 4) }, 'cream')
  ],
  'librería': [
    s('path', { d: 'M14 40h132l-8 22H22z' }, 'red', { accent: true }),
    s('path', { d: 'M22 62q8 8 16 0t16 0 16 0 16 0 16 0 16 0 16 0', ...SW(3) }, 'red', { stroke: true }),
    s('rect', { x: 22, y: 62, width: 116, height: 76 }, 'brown'),
    s('path', { d: rects([[30, 72, 8, 26], [40, 76, 8, 22], [50, 70, 10, 28], [62, 74, 8, 24], [94, 104, 8, 26], [104, 108, 10, 22], [116, 102, 8, 28]]) }, 'blue'),
    s('path', { d: rects([[72, 70, 8, 28], [82, 76, 10, 22], [30, 106, 10, 24], [42, 102, 8, 28], [126, 106, 8, 24]]) }, 'yellow'),
    s('path', { d: 'M22 100h116M22 132h116', ...SW(4) }, 'tan', { stroke: true })
  ],
  manipular: [
    s('rect', { x: 14, y: 104, width: 52, height: 34, rx: 6 }, 'gray'),
    s('path', { d: 'M40 104V78', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 40, cy: 72, r: 9 }, 'red', { accent: true }),
    s('path', { d: 'M66 124h18M90 136V80l30-30 16 20', ...SW(8) }, 'orange', { stroke: true }),
    s('path', { d: dots([[90, 80], [120, 50]], 7) }, 'dark'),
    s('path', { d: 'M130 72l4 10M142 66l-4 10', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 124, y: 84, width: 22, height: 20, rx: 2 }, 'blue'),
    ground(138)
  ],
  mercurio: [
    s('path', { d: 'M66 104V30a14 14 0 0 1 28 0v74', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 116, r: 22 }, 'gray', { accent: true }),
    s('path', { d: 'M80 116V50', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M94 40h10M94 56h6M94 72h10M94 88h6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: ells([[122, 130, 10, 6], [138, 120, 6, 4], [28, 130, 8, 5]]) }, 'gray'),
    s('path', { d: 'M72 110a8 8 0 0 1 8-8M118 128a3 3 0 0 1 4-2', ...SW(3) }, 'white', { stroke: true })
  ],
  milenio: [
    backdrop('navy'),
    s('path', { d: rays(52, 54, 8, 30, 12), ...SW(4) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: rays(112, 48, 6, 24, 10, 10), ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: rays(92, 98, 6, 20, 8), ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: 'M14 146v-22h20v-14h18v14h16v-24h22v24h16v-12h20v12h14v22z' }, 'dark'),
    s('path', { d: dots([[52, 54], [112, 48]], 4) }, 'white')
  ],
  molino: [
    ground(),
    s('path', { d: 'M64 136l6-70h20l6 70z' }, 'cream'),
    s('path', { d: 'M62 70l18-18 18 18z' }, 'red'),
    s('path', { d: 'M80 62l-36-36 8-8 36 36zM80 62l36-36 8 8-36 36zM80 62l-36 36-8-8 36-36zM80 62l36 36-8 8-36-36z' }, 'brown', { accent: true }),
    s('rect', { x: 74, y: 112, width: 12, height: 24, rx: 4 }, 'brown'),
    s('circle', { cx: 80, cy: 62, r: 5 }, 'dark')
  ],
  muelle: [
    s('path', { d: 'M14 104q11-6 22 0t22 0 22 0 22 0 22 0 22 0V146H14z' }, 'blue'),
    s('rect', { x: 14, y: 84, width: 92, height: 12 }, 'brown', { accent: true }),
    s('path', { d: 'M24 96v44M56 96v44M88 96v44', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: 'M32 84V74M64 84V74', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M106 92h40l-8 14h-26z' }, 'red'),
    s('path', { d: 'M124 92V60l14 26z' }, 'white'),
    s('path', { d: 'M124 92V60l14 26z', ...SW(2) }, 'gray', { stroke: true })
  ],
  'ortografía': [
    ...paper(20, 20, 104, 120),
    s('path', { d: 'M34 44h50M34 64h70M34 84h34M34 104h60', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M74 92q4-6 8 0t8 0 8 0', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M138 40l-36 70', ...SW(10) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M102 110l-4 12 10-6z' }, 'dark'),
    s('path', { d: 'M138 40l4-8', ...SW(10) }, 'pink', { stroke: true })
  ],
  prenda: [
    s('path', { d: 'M80 16a8 8 0 1 1 8 8l-8 8', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 52l50-20 50 20', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M54 44l26 12 26-12 26 18-8 40-14-6v44H50V96l-14 6-8-40z' }, 'purple', { accent: true }),
    s('path', { d: 'M64 100h32M64 112h32M64 124h32', ...SW(3) }, 'pink', { stroke: true }),
    s('path', { d: 'M70 46q10 12 20 0', ...SW(4) }, 'pink', { stroke: true })
  ],
  rastro: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 8 }, 'tan'),
    s('path', { d: ells([[34, 128, 7, 10], [52, 112, 7, 10], [58, 86, 7, 10], [78, 74, 7, 10], [86, 50, 7, 10], [106, 40, 7, 10]]) }, 'brown', { accent: true }),
    s('path', { d: dots([[34, 114], [52, 98], [58, 72], [78, 60], [86, 36], [106, 26]], 3) }, 'brown'),
    s('path', { d: ring(118, 112, 16) + 'M130 124l10 10', ...SW(5) }, 'dark', { stroke: true })
  ],
  relacionar: [
    s('path', { d: 'M40 40L80 80l40-44M80 80l-44 46M80 80l46 40M40 40l80-4M36 126l90-6', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 16 }, 'orange', { accent: true }),
    s('circle', { cx: 40, cy: 40, r: 12 }, 'blue'),
    s('circle', { cx: 120, cy: 36, r: 12 }, 'green'),
    s('circle', { cx: 36, cy: 126, r: 12 }, 'red'),
    s('circle', { cx: 126, cy: 120, r: 12 }, 'purple')
  ],
  relatar: [
    s('circle', { cx: 40, cy: 62, r: 16 }, 'skin'),
    s('path', { d: 'M24 56q16-22 32 0', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: busts([40], 140, 44, 60) }, 'brown'),
    s('path', { d: dots([[100, 98], [132, 98]], 11) }, 'skin'),
    s('path', { d: busts([100, 132], 140, 24, 30) }, 'blue'),
    s('path', { d: bubble(58, 14, 70, 44) }, 'cream', { accent: true }),
    s('path', { d: 'M72 46l12-16 10 10 6-6 12 12zM100 26l6-4v8z' }, 'green')
  ],
  sustituir: [
    s('circle', { cx: 36, cy: 70, r: 13 }, 'skin'),
    s('rect', { x: 22, y: 86, width: 28, height: 40, rx: 9 }, 'red'),
    s('circle', { cx: 124, cy: 70, r: 13 }, 'skin'),
    s('rect', { x: 110, y: 86, width: 28, height: 40, rx: 9 }, 'blue', { accent: true }),
    arrow('M56 50q24-26 48 0M96 40l8 10-12 2', 'green', 5),
    arrow('M104 120q-24 26-48 0M64 130l-8-10 12-2', 'red', 5)
  ],
  teatral: [
    s('path', { d: 'M18 30q26-10 52 0q4 40-26 56q-30-16-26-56z' }, 'yellow', { accent: true }),
    s('path', { d: 'M32 48q4-4 8 0M50 48q4-4 8 0M34 64q10 10 20 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M88 60q26-10 52 0q4 40-26 56q-30-16-26-56z' }, 'blue'),
    s('path', { d: 'M100 80q4 4 8 0M120 80q4 4 8 0M104 100q10-10 20 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 86q10 30 40 40', ...SW(4) }, 'red', { stroke: true }),
    s('rect', { x: 14, y: 134, width: 132, height: 10 }, 'brown')
  ],
  tributario: [
    ...paper(18, 22, 76, 100),
    s('path', { d: 'M30 42h52M30 56h52M30 70h36M30 98h28', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 92h20v14H62z' }, 'red', { accent: true }),
    s('path', { d: ells([[116, 130, 26, 7], [116, 118, 26, 7], [116, 106, 26, 7]]) }, 'orange'),
    s('ellipse', { cx: 116, cy: 94, rx: 26, ry: 7 }, 'yellow'),
    arrow('M116 40v38M108 70l8 8 8-8', 'green', 4)
  ],
  vaina: [
    s('path', { d: 'M18 64q60-30 124 4q-6 34-62 40q-56-6-62-44z' }, 'green', { accent: true }),
    s('path', { d: dots([[46, 80], [70, 84], [94, 84], [118, 78]], 11) }, 'mint'),
    s('path', { d: 'M18 64q60-6 124 4', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M142 68q8-4 6-14', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: dots([[60, 128], [86, 132]], 9) }, 'green')
  ],
  vial: [
    s('path', { d: 'M54 146l16-120h20l16 120z' }, 'dark'),
    s('path', { d: 'M80 34v14M80 62v18M80 94v20M80 128v18', ...SW(4) }, 'white', { stroke: true }),
    s('rect', { x: 118, y: 28, width: 24, height: 60, rx: 6 }, 'dark'),
    s('path', { d: 'M130 88v52', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 130, cy: 42, r: 7 }, 'red'),
    s('circle', { cx: 130, cy: 58, r: 7 }, 'yellow'),
    s('circle', { cx: 130, cy: 74, r: 7 }, 'green', { accent: true })
  ],
  voluntariamente: [
    ground(),
    s('path', { d: dots([[30, 92], [130, 92]], 11) }, 'skin'),
    s('path', { d: busts([30, 130], 136, 26, 32) }, 'gray'),
    ...person(80, 136, 'orange', { h: 44, w: 30, r: 13, accent: true }),
    s('path', { d: 'M92 96l14-60', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(124, 28, 9) }, 'yellow')
  ],
  zorro: [
    s('path', { d: 'M48 120q-30 6-34-20q-2-22 18-22q8 16 30 20z' }, 'orange'),
    s('path', { d: 'M14 100q4 16 20 16', ...SW(6) }, 'white', { stroke: true, lineColor: 'gray' }),
    s('ellipse', { cx: 78, cy: 104, rx: 30, ry: 20 }, 'orange', { accent: true }),
    s('path', { d: 'M62 120v16M92 120v16', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 92l2-36 14 18h12l14-18 2 36-20 22z' }, 'orange'),
    s('path', { d: 'M104 90l16 22 16-22-16 6z' }, 'white'),
    s('path', { d: dots([[110, 82], [130, 82]], 3) + dots([[120, 110]], 4) }, 'dark')
  ],
  'águila': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'sky'),
    s('path', { d: 'M80 70q-30-30-66-20q30 2 42 26q-20-2-30 12q30-6 54 2zM80 70q30-30 66-20q-30 2-42 26q20-2 30 12q-30-6-54 2z' }, 'brown', { accent: true }),
    s('path', { d: 'M70 86h20l-4 30h-12z' }, 'brown'),
    s('path', { d: 'M74 116l6 12 6-12z' }, 'white'),
    s('circle', { cx: 80, cy: 64, r: 11 }, 'white'),
    s('path', { d: 'M78 66l10 4-8 4z' }, 'yellow')
  ],
  'adicción': [
    s('rect', { x: 66, y: 18, width: 52, height: 90, rx: 8 }, 'dark'),
    s('rect', { x: 72, y: 26, width: 40, height: 70, rx: 3 }, 'sky'),
    s('path', { d: 'M92 108q-6 14-22 18M60 128q-20 4-28-6', ...SW(5, { 'stroke-dasharray': '8 4' }) }, 'gray', { stroke: true }),
    s('circle', { cx: 30, cy: 118, r: 16 }, 'dark', { accent: true }),
    s('path', { d: heart(92, 58, 10) }, 'red'),
    s('path', { d: 'M124 30l10-6M126 46h12', ...SW(3) }, 'orange', { stroke: true })
  ],
  aplicable: [
    s('rect', { x: 92, y: 40, width: 50, height: 80, rx: 8 }, 'white'),
    s('rect', { x: 92, y: 40, width: 50, height: 80, rx: 8, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 70v18M126 70v18', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 50, y: 60, width: 30, height: 40, rx: 6 }, 'blue', { accent: true }),
    s('path', { d: 'M80 70h12M80 88h12', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M50 80H14', ...SW(6) }, 'dark', { stroke: true }),
    arrow('M60 120h24M76 112l8 8-8 8', 'green', 4)
  ],
  atribuir: [
    ...person(100, 140, 'blue', { h: 50, w: 32, r: 14 }),
    s('path', { d: 'M88 50l12 24 12-24', ...SW(4) }, 'red', { stroke: true }),
    s('circle', { cx: 100, cy: 98, r: 12 }, 'yellow', { accent: true }),
    s('path', { d: star(100, 98, 6) }, 'orange'),
    s('path', { d: 'M14 40h30l12 10', ...SW(10) }, 'skin', { stroke: true }),
    arrow('M30 70q20 30 54 28M74 90l10 8-12 6', 'orange', 4)
  ],
  autoestima: [
    s('rect', { x: 86, y: 18, width: 56, height: 110, rx: 26 }, 'sky'),
    s('rect', { x: 86, y: 18, width: 56, height: 110, rx: 26, ...SW(5) }, 'brown', { stroke: true }),
    s('circle', { cx: 114, cy: 64, r: 13 }, 'skin'),
    s('path', { d: busts([114], 124, 28, 40) }, 'green'),
    s('path', { d: heart(114, 96, 8) }, 'red', { accent: true }),
    ...person(44, 140, 'green', { h: 50, w: 30, r: 13 })
  ],
  borrador: [
    ...paper(14, 30, 132, 100),
    s('path', { d: 'M28 60h104M28 84h40', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M28 108h20', ...SW(4) }, 'blue', { stroke: true }),
    s('rect', { x: 70, y: 82, width: 60, height: 30, rx: 5, transform: 'rotate(-20 100 97)' }, 'pink', { accent: true }),
    s('rect', { x: 70, y: 82, width: 24, height: 30, rx: 5, transform: 'rotate(-20 100 97)' }, 'blue'),
    s('path', { d: dots([[60, 116], [70, 122], [54, 126]], 3) }, 'pink')
  ],
  'bárbaro': [
    s('circle', { cx: 70, cy: 78, r: 30 }, 'skin'),
    s('path', { d: 'M40 72q0-34 30-34t30 34z' }, 'gray', { accent: true }),
    s('path', { d: 'M42 58q-18-6-20-30q12 8 24 18M98 58q18-6 20-30q-12 8-24 18' }, 'cream'),
    s('path', { d: 'M44 86q4 30 26 32t26-32q-12 14-26 14t-26-14z' }, 'orange'),
    s('path', { d: dots([[60, 82], [80, 82]], 4) }, 'dark'),
    s('path', { d: 'M120 140l10-80', ...SW(8) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 132, cy: 50, rx: 12, ry: 22 }, 'brown')
  ],
  calificado: [
    ...person(62, 140, 'orange', { h: 54, w: 34, r: 14 }),
    s('path', { d: 'M46 66a16 16 0 0 1 32 0z' }, 'yellow', { accent: true }),
    s('rect', { x: 42, y: 64, width: 40, height: 5, rx: 2 }, 'yellow'),
    s('rect', { x: 54, y: 96, width: 16, height: 20, rx: 2 }, 'white'),
    s('circle', { cx: 116, cy: 66, r: 20 }, 'green'),
    s('path', { d: 'M106 66l8 8 14-16', ...SW(5) }, 'white', { stroke: true })
  ],
  casual: [
    ground(),
    ...lean(56, 136, 8, 'blue', { h: 44, w: 28, r: 12 }),
    ...lean(104, 136, -8, 'red', { h: 44, w: 28, r: 12 }),
    s('path', { d: burst(80, 50, 16, 7, 8) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(122, 30, 8) + sparkle(36, 30, 7) }, 'orange')
  ],
  colgado: [
    s('path', { d: 'M18 30v110M142 30v110', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M18 40q62 22 124 0', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 48l10-2 8 6 8-4 10 4 8 4-4 10-6-2v34H34V62l-6 2z' }, 'red', { accent: true }),
    s('path', { d: 'M86 54h28v16l-4 40h-8l-2-30-2 30h-8l-4-40z' }, 'blue'),
    s('path', { d: 'M118 46h16v20h-16z' }, 'yellow'),
    s('path', { d: 'M40 46v-6M60 50v-6M92 52v-6M110 52v-6M126 46v-6', ...SW(4) }, 'tan', { stroke: true })
  ],
  'comúnmente': [
    s('rect', { x: 18, y: 26, width: 124, height: 112, rx: 8 }, 'white'),
    s('rect', { x: 18, y: 26, width: 124, height: 26, rx: 8 }, 'red', { accent: true }),
    s('rect', { x: 18, y: 26, width: 124, height: 112, rx: 8, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[34, 68], [58, 68], [82, 68], [106, 68], [130, 68], [34, 92], [58, 92], [82, 92], [106, 92], [130, 92], [34, 116], [58, 116], [82, 116], [106, 116]], 7) }, 'blue'),
    s('path', { d: 'M48 20v12M112 20v12', ...SW(5) }, 'dark', { stroke: true })
  ],
  cono: [
    s('rect', { x: 26, y: 124, width: 108, height: 14, rx: 3 }, 'orange'),
    s('path', { d: 'M68 22h24l30 102H38z' }, 'orange', { accent: true }),
    s('path', { d: 'M60 52h40l7 24H53zM49 90h62l6 20H43z' }, 'white'),
    s('path', { d: 'M60 52h40l7 24H53zM49 90h62l6 20H43z', ...SW(2) }, 'gray', { stroke: true })
  ],
  contemplar: [
    s('rect', { x: 14, y: 14, width: 132, height: 92 }, 'orange'),
    s('circle', { cx: 100, cy: 92, r: 24 }, 'yellow', { accent: true }),
    s('rect', { x: 14, y: 100, width: 132, height: 46 }, 'blue'),
    s('path', { d: 'M86 112h28M92 122h16', ...SW(3) }, 'yellow', { stroke: true }),
    s('circle', { cx: 42, cy: 70, r: 12 }, 'dark'),
    s('path', { d: 'M28 108q0-26 14-26t14 26z' }, 'dark'),
    s('path', { d: 'M20 108h44', ...SW(6) }, 'brown', { stroke: true })
  ],
  crueldad: [
    s('path', { d: heart(80, 80, 40) }, 'red', { accent: true }),
    s('path', { d: 'M18 50q40 40 62 0t62 40M18 110q40-40 62 0t62-40', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M34 58l-6-8M58 68l4-10M102 56l-4-10M126 80l8-6M40 102l-8 4M100 104l4 10M124 96l8 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: drop(80, 128, 5) }, 'red')
  ],
  'cómplice': [
    ...person(46, 136, 'dark', { h: 50, w: 30, r: 14 }),
    ...person(114, 136, 'dark', { h: 50, w: 30, r: 14 }),
    s('path', { d: rects([[32, 62, 28, 8], [100, 62, 28, 8]]) }, 'black'),
    s('path', { d: dots([[40, 66], [52, 66], [108, 66], [120, 66]], 2.5) }, 'white'),
    s('path', { d: 'M62 100h36', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M66 100q14-30 28 0q4 30-14 30t-14-30z' }, 'tan', { accent: true }),
    ground()
  ],
  'doméstico': [
    ground(),
    s('path', { d: 'M18 74l62-52 62 52z' }, 'red'),
    s('rect', { x: 30, y: 72, width: 100, height: 64 }, 'cream'),
    s('rect', { x: 44, y: 86, width: 30, height: 26, rx: 2 }, 'sky'),
    s('path', { d: 'M98 136v-14q0-12 12-12t12 12v14z' }, 'orange', { accent: true }),
    s('path', { d: 'M100 112v-12l6 6h8l6-6v12z' }, 'orange'),
    s('path', { d: 'M122 132q12-2 10-16', ...SW(4) }, 'orange', { stroke: true })
  ],
  'dramático': [
    s('path', { d: 'M50 14h60l26 126H24z' }, 'cream'),
    s('path', { d: 'M14 14h30q-6 70-30 110zM146 14h-30q6 70 30 110z' }, 'red'),
    s('circle', { cx: 80, cy: 62, r: 13 }, 'skin'),
    s('path', { d: 'M66 136l4-56h20l4 56z' }, 'purple', { accent: true }),
    s('path', { d: 'M88 84l6-30-12 2M70 86l-16 10', ...SW(6) }, 'purple', { stroke: true }),
    s('rect', { x: 14, y: 136, width: 132, height: 10 }, 'brown')
  ],
  enmienda: [
    ...paper(18, 18, 110, 124),
    s('path', { d: 'M32 42h80M32 62h80M32 82h40M32 102h80M32 122h50', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M76 82h36', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M72 92l8-10 8 10M80 82V70', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M150 44l-40 64', ...SW(10) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M110 108l-4 12 10-6z' }, 'dark')
  ],
  estructural: [
    s('path', { d: 'M14 120h132M14 70h132', ...SW(7) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M14 120L36 70l22 50 22-50 22 50 22-50 22 50', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M24 120v20M136 120v20', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 140q66-8 132 0v6H14z' }, 'blue'),
    s('path', { d: dots([[36, 70], [80, 70], [124, 70], [58, 120], [102, 120]], 4) }, 'dark')
  ],
  fascista: [
    ground(),
    s('path', { d: 'M64 136v-12q0-4 4-6q4-10 12-4q8-6 12 4q4 2 4 6v12z' }, 'pink'),
    s('path', { d: 'M76 136l4-14 4 14', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M54 14h44v62q30 2 34 22v10H50z' }, 'black', { accent: true }),
    s('rect', { x: 46, y: 104, width: 90, height: 8, rx: 3 }, 'dark'),
    s('path', { d: 'M24 120l14 4M126 120l-12 4', ...SW(3) }, 'gray', { stroke: true })
  ],
  forro: [
    s('path', { d: 'M50 22l30 14 30-14 26 20-6 98H30L24 42z' }, 'navy'),
    s('path', { d: 'M58 30l22 10 22-10 6 110H52z' }, 'red', { accent: true }),
    s('path', { d: 'M62 50l18 20 18-20M64 90q16 6 32 0M64 112q16 6 32 0', ...SW(2) }, 'pink', { stroke: true }),
    s('path', { d: 'M50 22l30 46v72M110 22L80 68', ...SW(4) }, 'blue', { stroke: true })
  ],
  gen: [
    s('path', { d: 'M50 14q60 22 0 44t0 44 0 44', ...SW(7) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M110 14q-60 22 0 44t0 44 0 44', ...SW(7) }, 'red', { stroke: true }),
    s('path', { d: 'M62 22h36M78 36h4M62 50h36M62 72h36M78 80h4M62 94h36M62 116h36M62 138h36', ...SW(4) }, 'gray', { stroke: true })
  ],
  gradualmente: [
    s('path', { d: rects([[18, 118, 18, 18], [42, 106, 18, 30], [66, 92, 18, 44], [90, 74, 18, 62], [114, 52, 18, 84]]) }, 'green'),
    s('path', { d: 'M18 110q50-6 104-74', ...DASH(3, '4 5') }, 'orange', { stroke: true }),
    s('path', { d: 'M114 34l14-6 2 14z' }, 'orange', { accent: true }),
    ground(136)
  ],
  gremio: [
    s('path', { d: 'M18 30h124v18l-62 10-62-10z' }, 'navy', { accent: true }),
    s('path', { d: dots([[34, 84], [80, 80], [126, 84]], 12) }, 'skin'),
    s('path', { d: 'M22 80a12 12 0 0 1 24 0zM68 76a12 12 0 0 1 24 0zM114 80a12 12 0 0 1 24 0z' }, 'yellow'),
    s('path', { d: busts([34, 80, 126], 138, 30, 38) }, 'orange'),
    s('path', { d: 'M54 104l10-22M100 104l10-22', ...SW(4) }, 'gray', { stroke: true }),
    ground(138)
  ],
  hembra: [
    s('path', { d: 'M18 120q62 30 124 0l-10-18q-52 18-104 0z' }, 'brown'),
    s('path', { d: ells([[56, 104, 10, 13], [80, 106, 10, 13], [104, 104, 10, 13]]) }, 'cream'),
    s('ellipse', { cx: 76, cy: 66, rx: 38, ry: 24 }, 'tan', { accent: true }),
    s('circle', { cx: 112, cy: 46, r: 16 }, 'tan'),
    s('path', { d: 'M126 44l12 4-12 4z' }, 'orange'),
    s('circle', { cx: 116, cy: 42, r: 3 }, 'dark'),
    s('path', { d: 'M48 64q20 12 40 0', ...SW(3) }, 'brown', { stroke: true })
  ],
  inesperado: [
    s('rect', { x: 34, y: 96, width: 72, height: 44, rx: 3 }, 'red'),
    s('path', { d: 'M34 96l-16-20h72l16 20z' }, 'orange'),
    s('path', { d: 'M70 96q-14-8 0-16t0-16 0-16', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 70, cy: 34, r: 20 }, 'yellow', { accent: true }),
    s('path', { d: dots([[63, 30], [77, 30]], 3) + dots([[70, 42]], 5) }, 'dark'),
    s('path', { d: 'M106 96l26-30', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M100 24l12-8M106 40h14M40 18l-10-8', ...SW(3) }, 'orange', { stroke: true })
  ],
  'infantería': [
    ground(),
    s('path', { d: 'M20 64a14 14 0 0 1 28 0zM64 64a14 14 0 0 1 28 0zM108 64a14 14 0 0 1 28 0z' }, 'green', { accent: true }),
    s('path', { d: dots([[36, 72], [80, 72], [124, 72]], 9) }, 'skin'),
    s('path', { d: rects([[24, 82, 22, 30], [68, 82, 22, 30], [112, 82, 22, 30]]) }, 'green'),
    s('path', { d: rects([[16, 84, 8, 22], [60, 84, 8, 22], [104, 84, 8, 22]]) }, 'brown'),
    s('path', { d: 'M30 112l-6 24M40 112l8 24M74 112l-6 24M84 112l8 24M118 112l-6 24M128 112l8 24', ...SW(6) }, 'dark', { stroke: true })
  ],
  invertido: [
    s('path', { d: 'M44 52h52l-8 64H52z' }, 'sky'),
    s('path', { d: 'M52 116h36l8-64H44z', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 64h44l-2 16H50z' }, 'blue', { accent: true }),
    s('path', { d: 'M110 40a40 40 0 0 1 10 60M118 102l2-8-8 2', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M30 120a40 40 0 0 1-8-56M24 60l-2 8 8-2', ...SW(5) }, 'orange', { stroke: true })
  ],
  'licitación': [
    s('rect', { x: 46, y: 90, width: 68, height: 50, rx: 4 }, 'gray'),
    s('rect', { x: 64, y: 88, width: 32, height: 6, rx: 3 }, 'dark'),
    s('path', { d: 'M62 40h36v26H62z' }, 'white', { accent: true }),
    s('path', { d: 'M62 40l18 14 18-14', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 40h36v26H62z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M20 30h30v22H20zM110 26h30v22h-30z' }, 'cream'),
    arrow('M36 60l20 22M124 56l-20 26M80 70v14', 'orange', 3)
  ],
  'mediático': [
    s('rect', { x: 16, y: 30, width: 80, height: 58, rx: 6 }, 'dark'),
    s('rect', { x: 22, y: 36, width: 68, height: 46, rx: 2 }, 'sky', { accent: true }),
    s('path', { d: 'M44 88l-8 12M68 88l8 12', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 26, y: 104, width: 70, height: 38, rx: 3 }, 'white'),
    s('path', { d: 'M26 104h70v38H26zM34 116h54M34 128h40', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 114, y: 40, width: 20, height: 36, rx: 10 }, 'gray'),
    s('path', { d: 'M108 64q16 26 32 0M124 82v54', ...SW(4) }, 'dark', { stroke: true })
  ],
  monumental: [
    s('path', { d: 'M62 112l6-90h24l6 90z' }, 'gray', { accent: true }),
    s('path', { d: 'M68 22l12-10 12 10z' }, 'gray'),
    s('rect', { x: 46, y: 112, width: 68, height: 24 }, 'tan'),
    s('path', { d: 'M80 34v70', ...SW(3) }, 'white', { stroke: true }),
    ...person(130, 136, 'red', { h: 14, w: 10, r: 5 }),
    ground()
  ],
  mortalidad: [
    s('path', { d: 'M22 20v114h120', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 36q30 6 40 40t50 40', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M104 132V102q0-14 14-14t14 14v30z' }, 'gray'),
    s('path', { d: 'M118 98v18M110 106h16', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M46 132q0-10 8-14M56 120q6 0 6 6', ...SW(3) }, 'brown', { stroke: true })
  ],
  observatorio: [
    backdrop('navy'),
    s('path', { d: 'M34 98a46 46 0 0 1 92 0z' }, 'white', { accent: true }),
    s('path', { d: 'M76 54l6-2 14 46H84z' }, 'dark'),
    s('rect', { x: 34, y: 98, width: 92, height: 34 }, 'gray'),
    s('path', { d: 'M88 60l22-30', ...SW(9) }, 'gray', { stroke: true }),
    s('path', { d: star(124, 28, 7) + star(34, 40, 5) + star(56, 22, 4) }, 'yellow')
  ],
  oliva: [
    s('path', { d: 'M18 50q60 0 126 70', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(44, 50, -40, 36, 9) + leaflet(70, 56, 30, 34, 9) + leaflet(98, 72, -30, 36, 9) + leaflet(118, 92, 50, 30, 8) }, 'green'),
    s('path', { d: ells([[56, 76, 11, 15], [88, 90, 11, 15], [120, 120, 10, 14]]) }, 'green', { accent: true }),
    s('path', { d: ells([[110, 58, 10, 14]]) }, 'purple')
  ],
  oportuno: [
    ground(),
    s('rect', { x: 20, y: 62, width: 82, height: 54, rx: 10 }, 'yellow', { accent: true }),
    s('path', { d: rects([[30, 72, 20, 18], [56, 72, 20, 18]]) }, 'sky'),
    s('path', { d: dots([[38, 118], [84, 118]], 10) }, 'dark'),
    ...person(128, 136, 'blue', { h: 40, w: 24, r: 11 }),
    s('circle', { cx: 124, cy: 32, r: 18 }, 'white'),
    s('path', { d: ring(124, 32, 18) + 'M124 32V22M124 32l8 4', ...SW(3) }, 'dark', { stroke: true })
  ],
  pagado: [
    s('path', { d: 'M38 14h84v132l-10-8-11 8-10-8-11 8-10-8-11 8-10-8-11 8z' }, 'white'),
    s('path', { d: 'M38 14h84v132l-10-8-11 8-10-8-11 8-10-8-11 8-10-8-11 8z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M50 34h60M50 48h40M50 62h52', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 92, cy: 100, r: 24 }, 'green', { accent: true }),
    s('path', { d: 'M80 100l8 8 16-16', ...SW(5) }, 'white', { stroke: true })
  ],
  preocupado: [
    s('circle', { cx: 80, cy: 82, r: 56 }, 'skin'),
    s('path', { d: 'M50 58l16-8M110 58l-16-8M60 116q20-14 40 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[62, 76], [98, 76]], 6) }, 'dark'),
    s('path', { d: drop(128, 50, 7) }, 'sky', { accent: true }),
    s('path', { d: 'M66 22l4 8M80 18v10M94 22l-4 8', ...SW(3) }, 'gray', { stroke: true })
  ],
  procurador: [
    s('circle', { cx: 56, cy: 48, r: 16 }, 'skin'),
    s('path', { d: busts([56], 130, 50, 62) }, 'black'),
    s('path', { d: 'M50 68h12l-6 30z' }, 'white'),
    s('rect', { x: 92, y: 96, width: 48, height: 36, rx: 4 }, 'brown', { accent: true }),
    s('path', { d: 'M106 96v-8h20v8', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 104l16 4', ...SW(7) }, 'skin', { stroke: true }),
    ground(136)
  ],
  recogida: [
    s('path', { d: 'M30 92h100l-12 46H42z' }, 'brown', { accent: true }),
    s('path', { d: 'M30 92q50-50 100 0', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: dots([[54, 88], [76, 84], [98, 88], [66, 76]], 11) }, 'red'),
    s('path', { d: 'M40 108h80M44 122h72', ...SW(3) }, 'tan', { stroke: true }),
    s('circle', { cx: 124, cy: 30, r: 11 }, 'red'),
    arrow('M120 46l-14 20M104 56l2 10 10-2', 'green', 4)
  ],
  regimiento: [
    s('path', { d: 'M24 14v52', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M26 16h40l-8 12 8 12H26z' }, 'red', { accent: true }),
    s('path', { d: dots([[40, 76], [64, 76], [88, 76], [112, 76], [136, 76], [40, 100], [64, 100], [88, 100], [112, 100], [136, 100], [40, 124], [64, 124], [88, 124], [112, 124], [136, 124]], 9) }, 'green'),
    s('path', { d: dots([[40, 78], [64, 78], [88, 78], [112, 78], [136, 78], [40, 102], [64, 102], [88, 102], [112, 102], [136, 102], [40, 126], [64, 126], [88, 126], [112, 126], [136, 126]], 4) }, 'navy'),
    s('path', { d: 'M24 140h120', ...SW(4) }, 'gray', { stroke: true })
  ],
  republicar: [
    s('path', { d: rects([[30, 112, 70, 16], [36, 96, 64, 16], [30, 80, 70, 16]]) }, 'blue'),
    s('path', { d: rects([[30, 80, 70, 4], [36, 96, 64, 4], [30, 112, 70, 4]]) }, 'cream'),
    s('rect', { x: 34, y: 60, width: 62, height: 20, rx: 2 }, 'red', { accent: true }),
    s('path', { d: 'M110 70a32 32 0 1 1 -20-42M86 18l6 10-12 4', ...SW(5) }, 'green', { stroke: true }),
    ground(130)
  ],
  reservado: [
    s('rect', { x: 14, y: 96, width: 132, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M28 106v34M132 106v34', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M56 96l14-40h20l14 40z' }, 'red', { accent: true }),
    s('path', { d: 'M70 74h20M68 84h24', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: ells([[32, 92, 14, 4], [128, 92, 14, 4]]) }, 'white'),
    s('path', { d: ells([[32, 92, 14, 4], [128, 92, 14, 4]]), ...SW(2) }, 'gray', { stroke: true })
  ],
  ruego: [
    s('path', { d: 'M80 30q-12 4-14 20l-6 56 20 10z' }, 'skin', { accent: true }),
    s('path', { d: 'M80 30q12 4 14 20l6 56-20 10z' }, 'tan'),
    s('path', { d: 'M56 104l-6 40h60l-6-40z' }, 'blue'),
    s('path', { d: 'M80 34v80', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: sparkle(124, 36, 10) + sparkle(36, 40, 8) }, 'yellow')
  ],
  secuestrado: [
    s('circle', { cx: 80, cy: 46, r: 18 }, 'skin'),
    s('path', { d: 'M70 44q4-4 8 0M84 44q4-4 8 0M72 58q8-6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 60, y: 66, width: 40, height: 56, rx: 12 }, 'blue'),
    s('path', { d: 'M56 78l48 10M56 94l48 10M56 110l48-6', ...SW(5) }, 'tan', { stroke: true, accent: true }),
    s('path', { d: 'M50 122h60M56 122v20M104 122v20', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 110, y: 96, width: 24, height: 20, rx: 3 }, 'yellow'),
    s('path', { d: 'M114 96v-6a8 8 0 0 1 16 0v6', ...SW(4) }, 'gray', { stroke: true })
  ],
  significativamente: [
    s('path', { d: rects([[22, 112, 22, 24], [52, 106, 22, 30]]) }, 'gray'),
    s('rect', { x: 92, y: 40, width: 30, height: 96 }, 'green', { accent: true }),
    arrow('M30 96l30-6 30-56M78 34h12v12', 'orange', 6),
    s('path', { d: burst(126, 28, 14, 6, 8) }, 'yellow'),
    ground(136)
  ],
  'sociología': [
    s('path', { d: dots([[40, 60], [80, 48], [120, 60], [56, 100], [104, 100]], 10) }, 'skin'),
    s('path', { d: busts([40, 80, 120], 84, 20, 18) }, 'blue'),
    s('path', { d: busts([56, 104], 126, 20, 18) }, 'orange'),
    s('path', { d: 'M48 76l24-12M88 64l24 12M48 84l8 8M112 84l-8 8M66 112h28', ...DASH(2, '3 3') }, 'gray', { stroke: true }),
    s('path', { d: ring(80, 84, 64), ...SW(3) }, 'purple', { stroke: true, accent: true })
  ],
  tablero: [
    s('path', { d: 'M14 120V70q0-30 66-30t66 30v50z' }, 'dark'),
    s('circle', { cx: 52, cy: 84, r: 24 }, 'white'),
    s('circle', { cx: 108, cy: 84, r: 24 }, 'white'),
    s('path', { d: 'M52 84l14-14M108 84l-8 16', ...SW(4) }, 'red', { stroke: true, accent: true }),
    s('path', { d: halfRays(52, 84, 16, 22, 5) + halfRays(108, 84, 16, 22, 5), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: dots([[72, 112], [80, 112], [88, 112]], 3) }, 'green')
  ],
  tronco: [
    ground(),
    s('path', { d: 'M40 136q16-10 16-40V60h28v36q0 30 16 40z' }, 'brown', { accent: true }),
    s('circle', { cx: 70, cy: 40, r: 32 }, 'green'),
    s('path', { d: 'M62 82q4 20-2 38M76 74q2 24 6 46', ...SW(3) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 124, cy: 122, rx: 16, ry: 14 }, 'tan'),
    s('path', { d: ring(124, 122, 8), ...SW(2) }, 'brown', { stroke: true })
  ],
  vago: [
    s('path', { d: 'M22 30v110M138 30v110', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M22 70q58 50 116 0', ...SW(10) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 44, cy: 76, r: 12 }, 'skin'),
    s('path', { d: 'M56 86q30 14 66-4', ...SW(14) }, 'blue', { stroke: true }),
    s('path', { d: 'M40 74h8', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 40q8-4 4-10M78 30q8-4 4-10', ...SW(3) }, 'gray', { stroke: true })
  ]
};
