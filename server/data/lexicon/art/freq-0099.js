// Illustration specs for words still undrawn in batches 0097–0099 (see server/scripts/lexicon/art.js)
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

// A round face: eyes and a mouth (mood: smile | frown | flat)
const face = (cx, cy, r, color, mood = 'smile', opts = {}) => {
  const k = v => +v.toFixed(1);
  const m = {
    smile: `M${k(cx - r * 0.4)} ${k(cy + r * 0.3)}q${k(r * 0.4)} ${k(r * 0.35)} ${k(r * 0.8)} 0`,
    frown: `M${k(cx - r * 0.4)} ${k(cy + r * 0.5)}q${k(r * 0.4)} ${k(-r * 0.35)} ${k(r * 0.8)} 0`,
    flat: `M${k(cx - r * 0.35)} ${k(cy + r * 0.4)}h${k(r * 0.7)}`
  }[mood];
  return [
    s('circle', { cx, cy, r }, color, opts),
    s('path', { d: dots([[k(cx - r * 0.35), k(cy - r * 0.15)], [k(cx + r * 0.35), k(cy - r * 0.15)]], k(r * 0.1)) }, 'dark'),
    s('path', { d: m, ...SW(Math.max(3, Math.round(r / 10))) }, 'dark', { stroke: true })
  ];
};
// Points on a quadratic curve p0 -> p2 with control p1 (n points, ends excluded)
const qpts = (p0, p1, p2, n) => Array.from({ length: n }, (_, i) => {
  const t = (i + 1) / (n + 1), u = 1 - t;
  return [0, 1].map(j => +(u * u * p0[j] + 2 * u * t * p1[j] + t * t * p2[j]).toFixed(1));
});
// Path data: a jet seen from above, nose up at (x, y - 16)
const jet = (x, y) => `M${x} ${y - 16}l4 10 16 8v5l-16-3v9l6 4v4l-10-3-10 3v-4l6-4v-9l-16 3v-5l16-8z`;
// Path data: a camel facing right (origin-based, place with transform)
const CAMEL = 'M24 92q0-16 14-18q6-16 16-4q10-12 18 2q6 4 6 12l10-26h12l-2 6q-6 0-8 4l-6 30q-2 6-10 6v24h-6v-22H44v22h-6v-26q-14-2-14-10z';
// Scale and move a list of shapes (keeps any transform they already have)
const scaled = (shapes, k, tx, ty) => shapes.map(sh => ({ ...sh, attrs: { ...sh.attrs, transform: `translate(${tx} ${ty}) scale(${k})${sh.attrs.transform ? ' ' + sh.attrs.transform : ''}` } }));
// Path data: a grid of small rectangles (windows)
const grid = (x, y, cols, rows, w, h, dx, dy) => rects(Array.from({ length: cols * rows }, (_, k) => [x + (k % cols) * dx, y + Math.floor(k / cols) * dy, w, h]));

// Path data: a human head in profile facing right (neck at the bottom)
const HEAD = 'M58 136v-22q-26-10-26-44q0-40 44-44q42 0 46 36l12 22-10 4v12q0 12-14 12h-12v24z';
// A leafy tree centred on cx, trunk on ground y 136
const tree = (cx, color = 'green', trunk = 'brown', opts = {}) => [
  s('rect', { x: cx - 7, y: 92, width: 14, height: 44, rx: 3 }, trunk),
  s('path', { d: ells([[cx, 66, 40, 34], [cx - 26, 84, 20, 16], [cx + 26, 84, 20, 16]]) }, color, opts)
];
// Rotate a list of shapes by deg around (cx, cy)
const rot = (shapes, deg, cx, cy) => shapes.map(sh => ({ ...sh, attrs: { ...sh.attrs, transform: `rotate(${deg} ${cx} ${cy})${sh.attrs.transform ? ' ' + sh.attrs.transform : ''}` } }));
// Points for a swarm of bees
const BEES = [[60, 40], [88, 30], [116, 46], [70, 66], [100, 70], [130, 80], [58, 96], [88, 104], [118, 114], [76, 132], [44, 124]];
module.exports = {
  declaratoria: [
    ...paper(36, 18, 88, 120),
    s('path', { d: 'M50 40h60M50 56h60M50 72h60M50 88h40', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 122l-8 22 10-6 6 10 4-24zM112 122l8 22-10-6-6 10-4-24z' }, 'red'),
    s('circle', { cx: 104, cy: 114, r: 16 }, 'red', { accent: true }),
    s('path', { d: star(104, 114, 9) }, 'yellow')
  ],
  derbi: [
    ground(),
    ...person(36, 136, 'red', { accent: true }),
    ...person(124, 136, 'blue'),
    s('circle', { cx: 80, cy: 122, r: 14 }, 'white'),
    s('path', { d: ring(80, 122, 14) + 'M74 116l6-4 6 4-2 7h-8z', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 40l12 12M100 40l-12 12M80 30v14', ...SW(4) }, 'orange', { stroke: true })
  ],
  derretir: [
    s('circle', { cx: 128, cy: 32, r: 16 }, 'yellow'),
    s('path', { d: 'M54 76l26 64 26-64z' }, 'tan'),
    s('path', { d: 'M50 78q-4-34 30-36q34 2 30 36q-6 0-6 14q-4 6-8 0v-10q-6 4-10 0q-4 22-10 0q-6 4-12-2v18q-4 6-8 0q0-16-6-20z' }, 'pink', { accent: true }),
    s('path', { d: drop(66, 120, 4) + drop(100, 108, 4) }, 'pink'),
    s('ellipse', { cx: 80, cy: 146, rx: 30, ry: 3 }, 'pink')
  ],
  deshonesto: [
    s('circle', { cx: 64, cy: 80, r: 40 }, 'skin'),
    s('path', { d: 'M96 76h44q6 4 0 8H96z' }, 'tan', { accent: true }),
    s('path', { d: dots([[52, 66], [76, 66]], 4) }, 'dark'),
    s('path', { d: 'M48 98q14 8 26 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 50q16-26 52-16q4-14 18 2q-10-30-40-26q-34 6-30 40z' }, 'brown'),
    s('path', { d: leaflet(124, 76, -70, 20, 6) }, 'green')
  ],
  diocesano: [
    s('path', { d: 'M18 120q-6-60 40-90q50-20 84 20q14 50-14 86q-60 18-110-16z' }, 'mint'),
    s('path', { d: 'M18 120q-6-60 40-90q50-20 84 20q14 50-14 86q-60 18-110-16z', ...DASH(4) }, 'purple', { stroke: true }),
    s('rect', { x: 52, y: 76, width: 56, height: 50 }, 'cream'),
    s('path', { d: 'M46 78l34-30 34 30z' }, 'red', { accent: true }),
    s('path', { d: 'M80 48V24M72 32h16', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M72 126v-22a8 8 0 0 1 16 0v22z' }, 'brown')
  ],
  edificar: [
    ground(),
    s('path', { d: 'M30 136V24M30 28h104M30 52l30-24', ...SW(6) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M118 28v34', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 106, y: 62, width: 26, height: 12 }, 'red'),
    s('rect', { x: 56, y: 72, width: 70, height: 64 }, 'tan'),
    s('path', { d: grid(64, 82, 4, 3, 10, 10, 16, 18) }, 'sky')
  ],
  'electrificación': [
    ground(),
    s('path', { d: 'M28 136l12-90h12l12 90M34 66h24M30 92h32M24 50h44', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 50q46 30 86 34', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M92 136V96l22-18 22 18v40z' }, 'cream'),
    s('rect', { x: 104, y: 104, width: 20, height: 16 }, 'yellow'),
    s('path', { d: 'M84 18l-16 26h12l-8 24 22-32H82l10-18z' }, 'yellow', { accent: true })
  ],
  embrague: [
    s('rect', { x: 14, y: 100, width: 132, height: 40, rx: 6 }, 'dark'),
    s('rect', { x: 28, y: 82, width: 26, height: 36, rx: 4, transform: 'rotate(20 41 100)' }, 'orange', { accent: true }),
    s('rect', { x: 68, y: 70, width: 26, height: 36, rx: 4 }, 'gray'),
    s('rect', { x: 108, y: 64, width: 18, height: 42, rx: 4 }, 'gray'),
    s('path', { d: 'M16 30q30-6 40 20l4 30q-6 8-24 6l-6-30q-10-6-14-8z' }, 'blue'),
    s('path', { d: 'M28 80q10-6 34 6q2 8-6 10l-30-4z' }, 'black')
  ],
  'emérito': [
    s('path', { d: laurel(80, 94, 50) }, 'green'),
    s('circle', { cx: 80, cy: 50, r: 20 }, 'skin'),
    s('path', { d: 'M58 46q0-26 22-26t22 26q-6-12-22-12t-22 12z' }, 'gray'),
    s('path', { d: 'M48 136v-28q0-30 32-30t32 30v28z' }, 'navy'),
    s('path', { d: 'M72 78l8 24 8-24' }, 'red'),
    s('circle', { cx: 80, cy: 112, r: 9 }, 'yellow', { accent: true })
  ],
  enfermizo: [
    s('circle', { cx: 74, cy: 82, r: 50 }, 'mint', { accent: true }),
    s('path', { d: 'M50 70q8 6 14 0M84 70q8 6 14 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 104q14-8 28 0', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 92, y: 96, width: 56, height: 8, rx: 4, transform: 'rotate(-20 92 100)' }, 'white'),
    s('path', { d: 'M114 92l26-10', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: drop(120, 44, 6) }, 'sky')
  ],
  ensamble: [
    s('path', { d: 'M20 40h40v14a10 10 0 1 0 0 20v14H20z' }, 'blue', { accent: true }),
    s('path', { d: 'M70 40h40v48H70V74a10 10 0 1 1 0-20z' }, 'yellow'),
    s('path', { d: 'M20 98h40v14a10 10 0 1 1 0 20v8H20z' }, 'green'),
    s('path', { d: 'M110 102h30v38h-56v-8a10 10 0 1 0 0-20v-10z' }, 'red'),
  ],
  escaneo: [
    s('path', { d: 'M24 70h76l12 66H24z' }, 'tan'),
    s('path', { d: rects([[34, 90, 4, 34], [42, 90, 2, 34], [48, 90, 6, 34], [58, 90, 2, 34], [64, 90, 4, 34], [72, 90, 2, 34], [78, 90, 6, 34]]) }, 'dark'),
    s('path', { d: 'M116 18l26 10-10 26-26-10z' }, 'gray'),
    s('path', { d: 'M118 46l-6 22 10 4 6-22z' }, 'dark'),
    s('path', { d: 'M110 36L24 96v16L114 48z' }, 'red', { accent: true, }),
  ],
  'escáner': [
    s('rect', { x: 16, y: 82, width: 128, height: 50, rx: 8 }, 'gray'),
    s('path', { d: 'M20 82l20-52h104l-4 52z' }, 'dark'),
    s('rect', { x: 26, y: 90, width: 108, height: 6 }, 'sky', { accent: true }),
    s('path', { d: 'M24 106h112', ...SW(4) }, 'blue', { stroke: true }),
    s('circle', { cx: 128, cy: 120, r: 5 }, 'green')
  ],
  especificidad: [
    s('path', { d: dots([[24, 30], [52, 24], [24, 64], [24, 98], [56, 128], [110, 24], [138, 50], [140, 110], [100, 136], [24, 132], [140, 140]], 7) }, 'gray'),
    s('circle', { cx: 70, cy: 72, r: 34 }, 'sky'),
    s('path', { d: ring(70, 72, 34), ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 98l34 34', ...SW(12) }, 'brown', { stroke: true }),
    s('circle', { cx: 70, cy: 72, r: 12 }, 'red', { accent: true })
  ],
  estafar: [
    ...person(46, 136, 'navy', { h: 48 }),
    s('rect', { x: 32, y: 66, width: 28, height: 8, rx: 4 }, 'black'),
    s('path', { d: 'M100 86q-12 0-14 26q0 22 26 22t26-22q-2-26-14-26z' }, 'yellow', { accent: true }),
    s('path', { d: 'M104 86l-6-10h28l-6 10z' }, 'yellow'),
    s('path', { d: 'M60 104h28', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 112, cy: 112, r: 8 }, 'orange')
  ],
  estorbo: [
    ground(),
    s('path', { d: 'M14 136h132', ...SW(10) }, 'tan', { stroke: true }),
    s('path', { d: 'M76 136q-8-46 24-56q34-6 40 26q4 20-6 30z' }, 'gray', { accent: true }),
    ...person(40, 136, 'blue'),
    s('path', { d: 'M60 60l8-8M62 74l10-2', ...SW(4) }, 'dark', { stroke: true })
  ],
  expositor: [
    s('path', { d: 'M36 136V30h88v106', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M36 64h88M36 100h88', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M48 64V44h16v20zM96 64V40h18v24z' }, 'blue'),
    s('circle', { cx: 80, cy: 52, r: 10 }, 'red', { accent: true }),
    s('path', { d: 'M48 100l12-22 12 22zM90 100V82h22v18z' }, 'yellow'),
    s('path', { d: dots([[52, 124], [80, 124], [108, 124]], 9) }, 'green')
  ],
  factibilidad: [
    s('rect', { x: 18, y: 26, width: 92, height: 112, rx: 6 }, 'sky'),
    s('path', { d: 'M28 48h72M28 70h72M28 92h48M28 26v112', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M60 104l20 20 40-56', ...SW(12) }, 'green', { stroke: true, accent: true }),
    ...gear(122, 38, 14, 8, 'gray')
  ],
  'filarmónica': [
    s('path', { d: busts([30, 56, 104, 130], 140, 24, 30) }, 'navy'),
    s('path', { d: dots([[30, 98], [56, 98], [104, 98], [130, 98]], 10) }, 'skin'),
    ...person(80, 116, 'dark', { accent: false }),
    s('path', { d: 'M94 70l30-34', ...SW(3) }, 'dark', { stroke: true }),
    ...note(40, 40, 'purple')
  ],
  flotilla: [
    backdrop('sky'),
    s('path', { d: 'M14 112q16-8 33 0t33 0 33 0 33 0v34H14z' }, 'blue'),
    s('path', { d: 'M18 98h40l-8 14H26z' + 'M64 88h44l-8 16H72z' + 'M110 100h34l-6 12h-22z' }, 'dark'),
    s('path', { d: 'M38 98V58l18 36zM86 88V36l22 48zM126 100V68l14 28z' }, 'white'),
    s('path', { d: 'M38 98V58M86 88V36M126 100V68', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M86 36l-16 6 16 6z' }, 'red', { accent: true })
  ],
  'formalización': [
    ...paper(30, 18, 80, 108),
    s('path', { d: 'M42 38h56M42 54h56M42 70h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M44 100q10-14 16 0t16-4 12 2', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M100 120l34-60 10 6-34 60-12 6z' }, 'dark'),
    s('circle', { cx: 104, cy: 112, r: 14 }, 'red', { accent: true }),
  ],
  forrar: [
    s('rect', { x: 20, y: 34, width: 76, height: 100, rx: 4 }, 'red'),
    s('path', { d: 'M96 34h20l28 14v100l-28-14H96z' }, 'mint', { accent: true }),
    s('path', { d: dots([[120, 60], [134, 76], [122, 92], [134, 112], [120, 126]], 5) }, 'green'),
    s('path', { d: 'M96 34v100', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 30, y: 52, width: 54, height: 14, rx: 2 }, 'cream')
  ],
  'fortín': [
    s('path', { d: 'M14 140q66-40 132 0z' }, 'green'),
    s('path', { d: 'M44 118V70h10v10h10V70h10v10h12V70h10v10h10V70h10v48z' }, 'gray', { accent: true }),
    s('path', { d: 'M70 118v-18a10 10 0 0 1 20 0v18z' }, 'dark'),
    s('path', { d: 'M80 70V30', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 30h24l-6 8 6 8H82z' }, 'red')
  ],
  grandemente: [
    ground(140),
    s('rect', { x: 22, y: 118, width: 20, height: 20, rx: 3 }, 'sky'),
    s('rect', { x: 66, y: 30, width: 76, height: 108, rx: 8 }, 'blue', { accent: true }),
    s('path', { d: 'M28 104q8-60 34-76', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M52 24l14 2-6 12z' }, 'orange')
  ],
  habitable: [
    s('circle', { cx: 80, cy: 104, r: 52 }, 'blue'),
    s('path', { d: 'M40 70q20 10 30-4q12 18 32 6q16 4 24 0q-8 20 4 40q-20 10-40 2q-20 18-46-4q8-20-4-40z' }, 'green'),
    s('path', { d: 'M62 58V36l18-16 18 16v22z' }, 'cream'),
    s('path', { d: 'M58 38l22-20 22 20', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('rect', { x: 74, y: 42, width: 12, height: 16 }, 'brown')
  ],
  hemeroteca: [
    s('rect', { x: 18, y: 22, width: 124, height: 118, rx: 4 }, 'brown'),
    s('path', { d: rects([[26, 30, 108, 46], [26, 86, 108, 46]]) }, 'cream'),
    s('path', { d: rects([[30, 62, 46, 14], [30, 48, 46, 14], [84, 66, 46, 10], [30, 120, 46, 12], [84, 114, 46, 18]]) }, 'white'),
    s('path', { d: 'M30 48h46v28H30zM84 66h46M84 76h46M30 120h46M84 114h46v18', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 56h46M30 70h46M84 122h46', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 94, y: 36, width: 30, height: 30, rx: 2 }, 'red', { accent: true })
  ],
  higo: [
    s('path', { d: 'M54 26q8-8 14 0q-2 10 6 20q30 30 6 72q-20 24-46 6q-28-30 8-74q12-14 12-24z' }, 'purple', { accent: true }),
    s('path', { d: 'M60 26q-2-10 6-14', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M104 66q30 0 36 40q-2 34-36 34q-34 0-36-34q6-40 36-40z' }, 'purple'),
    s('path', { d: 'M104 74q24 4 28 34q-4 24-28 24t-28-24q4-30 28-34z' }, 'pink'),
    s('path', { d: dots([[96, 96], [112, 96], [104, 110], [92, 116], [116, 116], [104, 124]], 3) }, 'cream')
  ],
  'hospitalización': [
    s('path', { d: 'M18 136V92M142 136v-36', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 18, y: 100, width: 124, height: 18 }, 'sky'),
    s('circle', { cx: 42, cy: 88, r: 12 }, 'skin'),
    s('path', { d: 'M58 84h80v18H58z' }, 'blue', { accent: true }),
    s('path', { d: 'M120 84V20M108 20h24', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 112, y: 24, width: 18, height: 26, rx: 4 }, 'white'),
    s('path', { d: 'M112 24h18v26h-18z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M121 50q0 20-30 34', ...SW(2) }, 'red', { stroke: true })
  ],
  'iconografía': [
    s('rect', { x: 26, y: 16, width: 108, height: 128, rx: 4 }, 'brown'),
    s('rect', { x: 36, y: 26, width: 88, height: 108 }, 'yellow'),
    s('circle', { cx: 80, cy: 58, r: 22 }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 62, r: 14 }, 'skin'),
    s('path', { d: 'M52 134v-34q0-22 28-22t28 22v34z' }, 'blue'),
    s('path', { d: 'M62 134v-34q18-8 36 0v34z' }, 'red')
  ],
  imponible: [
    ground(),
    s('path', { d: 'M84 64l30-22 30 22zM88 128h52v8H88z' }, 'gray'),
    s('path', { d: 'M94 70v54M108 70v54M122 70v54M136 70v54', ...SW(6) }, 'cream', { stroke: true }),
    s('path', { d: ells([[38, 126, 20, 7], [38, 114, 20, 7], [38, 102, 20, 7]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M40 84q16-38 48-30', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M84 46l10 8-12 6z' }, 'orange')
  ],
  'incisión': [
    s('rect', { x: 14, y: 70, width: 132, height: 70, rx: 14 }, 'skin'),
    s('path', { d: 'M30 112q50-20 100 0', ...DASH(3, '5 5') }, 'blue', { stroke: true }),
    s('path', { d: 'M30 112q24-10 50-12', ...SW(4) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M78 98l6-14 60-44 6 6-56 52z' }, 'gray'),
    s('path', { d: 'M118 58l26-18 6 6-24 22z' }, 'dark')
  ],
  incompatibilidad: [
    s('rect', { x: 18, y: 30, width: 56, height: 100, rx: 8 }, 'blue'),
    s('path', { d: rects([[34, 58, 24, 24]]) + 'M34 100h24v12H34z' }, 'navy'),
    s('circle', { cx: 112, cy: 70, r: 26 }, 'orange', { accent: true }),
    s('path', { d: 'M100 108l24 24M124 108l-24 24', ...SW(8) }, 'red', { stroke: true }),
    s('path', { d: 'M76 70h8', ...SW(4) }, 'gray', { stroke: true })
  ],
  indigencia: [
    ground(),
    s('rect', { x: 18, y: 112, width: 70, height: 24, rx: 2 }, 'tan'),
    s('circle', { cx: 52, cy: 62, r: 13 }, 'skin'),
    s('path', { d: 'M34 116v-30q0-14 18-14t18 14v30z' }, 'gray', { accent: true }),
    s('path', { d: 'M100 126h34l-4 10h-26z' }, 'brown'),
    s('path', { d: 'M40 52q12-12 26 0z' }, 'brown'),
    s('path', { d: 'M70 98q20 4 30 22', ...SW(6) }, 'gray', { stroke: true })
  ],
  inframundo: [
    s('rect', { x: 14, y: 14, width: 132, height: 36 }, 'sky'),
    s('rect', { x: 14, y: 50, width: 132, height: 96 }, 'brown'),
    s('path', { d: 'M30 140q0-60 50-66q50 6 50 66z' }, 'black'),
    s('path', { d: 'M56 140q8-30 24-36q16 6 24 36z' }, 'red', { accent: true }),
    s('path', { d: 'M70 140q4-20 10-24q6 4 10 24z' }, 'yellow'),
    ...tree(110).map(sh => ({ ...sh, attrs: { ...sh.attrs, transform: 'translate(33 6) scale(0.5)' } }))
  ],
  'insinuación': [
    ...person(46, 136, 'purple', { accent: true }),
    ...person(118, 136, 'blue'),
    s('path', { d: 'M54 62q8-4 6-14', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M66 58q10-14 20 0t20 0', ...DASH(4, '4 6') }, 'gray', { stroke: true }),
    s('path', { d: 'M104 52l6 6-8 4z' }, 'gray')
  ],
  intencionalidad: [
    s('circle', { cx: 112, cy: 72, r: 34 }, 'red'),
    s('circle', { cx: 112, cy: 72, r: 22 }, 'white'),
    s('circle', { cx: 112, cy: 72, r: 10 }, 'red'),
    s('path', { d: 'M24 136q40-80 84-64', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 76l-30 10-6-6 4-4z' }, 'yellow', { accent: true }),
    s('path', { d: 'M74 86l-12 4 4-12z' }, 'blue')
  ],
  involuntariamente: [
    s('path', { d: 'M28 40h44v36', ...SW(20, { 'stroke-linecap': 'butt' }) }, 'blue'),
    s('path', { d: 'M72 76l36 46', ...SW(16) }, 'skin', { stroke: true }),
    s('path', { d: 'M100 124h26q6 10-4 12h-26z' }, 'dark'),
    s('path', { d: 'M108 52l-30 26', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 100, y: 38, width: 22, height: 14, rx: 6, transform: 'rotate(-40 111 45)' }, 'red', { accent: true }),
    s('path', { d: 'M128 96q10 10 6 24M138 88q16 16 8 36', ...SW(4) }, 'orange', { stroke: true })
  ],
  irremediablemente: [
    ground(),
    s('path', { d: 'M40 136l8-30 18 10 4 20z' }, 'blue', { accent: true }),
    s('path', { d: 'M76 136l4-24 22-6 4 30z' }, 'blue'),
    s('path', { d: 'M112 136l6-18 18 6 2 12z' }, 'blue'),
    s('path', { d: 'M56 70l14-30h20l14 30-14 6-10-8-8 10z' }, 'sky'),
    s('path', { d: 'M64 30l6 8M96 30l-6 8M80 22v10', ...SW(3) }, 'gray', { stroke: true })
  ],
  lepra: [
    s('path', { d: 'M40 146V90q-14-30-6-58q4-10 12-2l6 30V22q0-10 10-10t10 10v30V18q0-10 10-10t10 10v38-28q0-10 10-10t10 10v52q8-10 18-14t10 4q-16 26-26 50v46z' }, 'skin'),
    s('path', { d: ells([[70, 96, 9, 6], [96, 112, 7, 5], [62, 124, 6, 4], [100, 60, 5, 4]]) }, 'tan'),
    s('rect', { x: 38, y: 128, width: 74, height: 16 }, 'white'),
    s('rect', { x: 38, y: 128, width: 74, height: 16, ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: ells([[84, 82, 6, 4]]) }, 'pink', { accent: true })
  ],
  'listón': [
    ground(140),
    s('path', { d: 'M28 140V30M132 140V30', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 140h20M122 140h20', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 22, y: 60, width: 116, height: 10, rx: 3 }, 'orange', { accent: true }),
    s('path', { d: 'M34 60v10M58 60v10M82 60v10M106 60v10M128 60v10', ...SW(4, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('path', { d: 'M60 112q20-60 40-30', ...DASH(3) }, 'blue', { stroke: true })
  ],
  llanamente: [
    s('path', { d: 'M14 112h132v34H14z' }, 'green'),
    s('path', { d: 'M14 112h132', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: bubble(36, 24, 104, 56) }, 'white'),
    s('path', { d: bubble(36, 24, 104, 56), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M54 48h66', ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M112 42l10 6-10 6z' }, 'blue')
  ],
  loable: [
    s('path', { d: 'M30 130q-6-30 14-54l16-14 6 6-8 14 16-6q6 4 0 10l-10 6 10 24q-10 18-44 14z' }, 'skin'),
    s('path', { d: 'M130 130q6-30-14-54l-16-14-6 6 8 14-16-6q-6 4 0 10l10 6-10 24q10 18 44 14z' }, 'skin'),
    s('path', { d: star(80, 46, 26) }, 'yellow', { accent: true }),
    s('path', { d: 'M52 40l-12-10M108 40l12-10', ...SW(4) }, 'orange', { stroke: true })
  ],
  lumbar: [
    s('circle', { cx: 80, cy: 30, r: 16 }, 'skin'),
    s('path', { d: 'M48 146V70q0-22 32-22t32 22v76z' }, 'skin'),
    s('path', { d: 'M80 52v90', ...SW(3, { 'stroke-dasharray': '6 4' }) }, 'tan', { stroke: true }),
    s('circle', { cx: 80, cy: 116, r: 20 }, 'red', { accent: true, }),
    s('path', { d: burst(80, 116, 30, 22, 8), ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M48 146h64v-10H48z' }, 'blue')
  ],
  malandro: [
    s('rect', { x: 14, y: 14, width: 132, height: 126, rx: 10 }, 'gray'),
    s('path', { d: rects([[14, 34, 40, 16], [70, 34, 50, 16], [30, 66, 50, 16], [96, 66, 50, 16]]) }, 'white', { flatOnly: true }),
    s('path', { d: 'M48 140v-44q0-20 32-20t32 20v44z' }, 'dark', { accent: true }),
    s('path', { d: 'M58 74q0-34 22-34t22 34z' }, 'dark'),
    s('circle', { cx: 80, cy: 66, r: 13 }, 'skin'),
    s('path', { d: 'M72 64l6 2M88 64l-6 2', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M112 100l20-30', ...SW(6) }, 'red', { stroke: true })
  ],
  maquinista: [
    ground(140),
    s('rect', { x: 18, y: 72, width: 80, height: 50, rx: 6 }, 'red', { accent: true }),
    s('rect', { x: 92, y: 40, width: 48, height: 82, rx: 4 }, 'navy'),
    s('rect', { x: 102, y: 50, width: 28, height: 26, rx: 3 }, 'sky'),
    s('circle', { cx: 116, cy: 66, r: 8 }, 'skin'),
    s('path', { d: 'M108 60q8-10 16 0z' }, 'blue'),
    s('rect', { x: 32, y: 48, width: 14, height: 26 }, 'dark'),
    s('path', { d: dots([[40, 126], [72, 126], [116, 126]], 12) }, 'dark')
  ],
  marga: [
    s('path', { d: 'M14 40h132v20H14z' }, 'tan'),
    s('path', { d: 'M14 60h132v20H14z' }, 'gray', { accent: true }),
    s('path', { d: 'M14 80h132v20H14z' }, 'cream'),
    s('path', { d: 'M14 100h132v20H14z' }, 'gray'),
    s('path', { d: 'M14 120h132v20H14z' }, 'tan'),
    s('path', { d: 'M14 40q30-20 66-10t66 0v10z' }, 'green'),
    s('path', { d: dots([[34, 70], [90, 92], [120, 70], [60, 130], [110, 112]], 3) }, 'white')
  ],
  multicultural: [
    s('circle', { cx: 80, cy: 80, r: 34 }, 'blue'),
    s('path', { d: 'M60 62q10 10 20 0q10 18 24 8q-2 16 4 26q-16 8-30 0q-10 10-22-4q4-16 4-30z' }, 'green'),
    ...[[80, 22, 'skin'], [138, 80, 'brown'], [80, 138, 'tan'], [22, 80, 'brown']].map(([x, y, c]) => s('circle', { cx: x, cy: y, r: 11 }, c)),
    s('path', { d: ring(80, 80, 58), ...DASH(3) }, 'orange', { stroke: true, accent: true })
  ],
  multitudinario: [
    s('path', { d: busts([24, 52, 80, 108, 136], 146, 26, 22) }, 'blue', { accent: true }),
    s('path', { d: dots([[24, 114], [52, 114], [80, 114], [108, 114], [136, 114]], 10) }, 'skin'),
    s('path', { d: busts([38, 66, 94, 122], 98, 24, 20) }, 'red'),
    s('path', { d: dots([[38, 70], [66, 70], [94, 70], [122, 70]], 9) }, 'tan'),
    s('path', { d: busts([24, 52, 80, 108, 136], 54, 22, 18) }, 'green'),
    s('path', { d: dots([[24, 28], [52, 28], [80, 28], [108, 28], [136, 28]], 8) }, 'skin')
  ],
  'mutilación': [
    s('rect', { x: 46, y: 126, width: 68, height: 18, rx: 2 }, 'gray'),
    s('circle', { cx: 80, cy: 34, r: 16 }, 'cream'),
    s('path', { d: 'M62 126l4-50q-2-20 14-24q16 4 14 24l4 50z' }, 'cream'),
    s('path', { d: 'M94 66l18 30', ...SW(9) }, 'cream', { stroke: true }),
    s('path', { d: 'M66 64l-6 6 4 4 4-6z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M56 70l-14 8 4 8 16-6', ...SW(3) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M62 126l4-50q-2-20 14-24q16 4 14 24l4 50zM96 66l16 28', ...SW(2) }, 'gray', { stroke: true })
  ],
  nuera: [
    ground(),
    s('path', { d: 'M50 54q-26 10-20 82h40z' }, 'white'),
    s('path', { d: 'M50 54q-26 10-20 82h40', ...SW(2) }, 'gray', { stroke: true }),
    ...lady(56, 136, 'pink', { accent: true }),
    ...lady(112, 136, 'purple'),
    s('path', { d: heart(84, 30, 12) }, 'red')
  ],
  nuncio: [
    s('path', { d: 'M44 146v-48q0-24 36-24t36 24v48z' }, 'purple', { accent: true }),
    s('circle', { cx: 80, cy: 52, r: 20 }, 'skin'),
    s('path', { d: 'M62 44a18 14 0 0 1 36 0z' }, 'purple'),
    s('path', { d: 'M98 104h38v28H98z' }, 'cream'),
    s('path', { d: 'M98 104l19 14 19-14', ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 117, cy: 120, r: 6 }, 'red'),
    s('path', { d: 'M80 74v40', ...SW(4) }, 'yellow', { stroke: true })
  ],
  ojeada: [
    s('path', { d: 'M18 56q42-44 84 0q-42 44-84 0z' }, 'white'),
    s('path', { d: 'M18 56q42-44 84 0q-42 44-84 0z', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 74, cy: 56, r: 14 }, 'blue', { accent: true }),
    s('circle', { cx: 78, cy: 56, r: 6 }, 'black'),
    ...paper(84, 86, 58, 56),
    s('path', { d: 'M94 100h38M94 112h38M94 124h26', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 70l12 14', ...DASH(3, '4 4') }, 'orange', { stroke: true })
  ],
  oportunismo: [
    s('circle', { cx: 92, cy: 34, r: 18 }, 'yellow', { accent: true }),
    s('path', { d: 'M86 26v16M98 26v16', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M64 14l-4 16M124 14l2 16M110 8l-2 12', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 146V96q0-16 10-22V58q0-8 8-8t8 8v16l8-10q6-4 10 2v22l8-4q8 2 4 10l-18 28v18z' }, 'skin'),
    s('rect', { x: 56, y: 132, width: 52, height: 14 }, 'blue')
  ],
  oratorio: [
    s('path', { d: 'M40 146l8-60h64l8 60z' }, 'brown'),
    s('circle', { cx: 80, cy: 46, r: 14 }, 'skin'),
    s('path', { d: 'M62 86v-14q0-12 18-12t18 12v14z' }, 'navy'),
    s('path', { d: 'M64 88h32l-4-14z' }, 'dark'),
    s('path', { d: 'M108 40q8 8 0 16M118 32q14 16 0 32M128 24q20 24 0 48M52 40q-8 8 0 16M42 32q-14 16 0 32M32 24q-20 24 0 48', ...SW(4) }, 'orange', { stroke: true, accent: true })
  ],
  'pacificación': [
    s('circle', { cx: 80, cy: 80, r: 64 }, 'sky'),
    s('path', { d: 'M40 92q10-30 46-26l30-28q4 18-14 34q20 2 26 14q-30 12-58 10q-14 0-30-4z' }, 'white', { accent: true }),
    s('path', { d: 'M40 92q10-30 46-26l30-28q4 18-14 34q20 2 26 14q-30 12-58 10q-14 0-30-4z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 84l14 6-10 8z' }, 'yellow'),
    s('path', { d: 'M30 92q-8 20-6 36', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(28, 104, 200, 14, 4) + leaflet(26, 116, -20, 14, 4) + leaflet(25, 126, 200, 12, 4) }, 'green')
  ],
  panqueque: [
    s('ellipse', { cx: 80, cy: 132, rx: 64, ry: 10 }, 'gray'),
    s('path', { d: ells([[80, 118, 50, 10], [80, 104, 50, 10], [80, 90, 50, 10], [80, 76, 50, 10]]) }, 'tan'),
    s('ellipse', { cx: 80, cy: 72, rx: 48, ry: 8 }, 'orange', { accent: true }),
    s('path', { d: 'M40 74q-2 14 4 22M120 76q2 10-2 20', ...SW(5) }, 'orange', { stroke: true }),
    s('rect', { x: 70, y: 56, width: 20, height: 14, rx: 3 }, 'yellow')
  ],
  'persuasión': [
    ...person(40, 136, 'orange', { accent: true }),
    ...person(122, 136, 'blue'),
    s('path', { d: bubble(54, 22, 54, 40) }, 'white'),
    s('path', { d: bubble(54, 22, 54, 40), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: heart(81, 30, 12) }, 'red'),
    s('path', { d: 'M110 52l8 6 12-16', ...SW(5) }, 'green', { stroke: true })
  ],
  'pizzería': [
    s('rect', { x: 20, y: 52, width: 120, height: 88 }, 'cream'),
    s('path', { d: 'M16 40h128v18H16z' }, 'red'),
    s('path', { d: 'M24 40v18M40 40v18M56 40v18M72 40v18M88 40v18M104 40v18M120 40v18M136 40v18', ...SW(8, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('rect', { x: 30, y: 82, width: 34, height: 58 }, 'brown'),
    s('path', { d: 'M78 76h52l-26 52z' }, 'yellow', { accent: true }),
    s('path', { d: 'M78 76h52v-6H78z' + dots([[94, 88], [112, 88], [104, 106]], 5) }, 'red')
  ],
  planchar: [
    s('path', { d: 'M18 140l8-60h22l8-10h48l8 10h22l8 60z' }, 'sky'),
    s('path', { d: 'M40 120q2-30 34-30h46l6 30z' }, 'gray', { accent: true }),
    s('path', { d: 'M64 90q0-18 18-18h22v18', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 60q-6-10 0-20t0-20M74 60q-6-10 0-20t0-20', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 120h86v6H38z' }, 'dark')
  ],
  postulante: [
    s('rect', { x: 18, y: 92, width: 30, height: 6 }, 'brown'),
    ...person(52, 136, 'navy', { accent: true }),
    ...paper(72, 50, 54, 70),
    s('circle', { cx: 88, cy: 68, r: 8 }, 'tan'),
    s('path', { d: 'M100 64h18M100 74h14M82 90h36M82 102h36', ...SW(3) }, 'gray', { stroke: true })
  ],
  presagio: [
    s('path', { d: 'M28 54a20 20 0 0 1 22-26a28 28 0 0 1 52 2a20 20 0 0 1 22 24z' }, 'dark'),
    s('path', { d: 'M72 54l-10 22h12l-8 20', ...SW(5) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M14 120q60-12 132 0', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M96 118q-6-20 10-28q4-14 18-10l8 6-8 2q4 18-10 28z' }, 'black'),
    s('circle', { cx: 120, cy: 86, r: 2 }, 'yellow')
  ],
  renegar: [
    ...person(80, 136, 'red', { accent: true }),
    s('path', { d: 'M56 112h48', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M74 62l4 2M86 62l-4 2M74 74q6-4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 30q4-14 18-12q4-10 16-4q14-4 16 10q12 4 6 14H52q-8-2 0-8z' }, 'gray'),
    s('path', { d: 'M62 30l8 6 6-8 8 8 6-6 8 6', ...SW(3) }, 'dark', { stroke: true })
  ],
  resiliencia: [
    s('rect', { x: 14, y: 100, width: 132, height: 44 }, 'gray'),
    s('path', { d: 'M70 100l8 14-6 10 10 20', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M78 112q2-40 0-60', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(78, 76, -150, 34, 12) + leaflet(78, 64, -30, 36, 12) }, 'green', { accent: true }),
    s('circle', { cx: 78, cy: 46, r: 9 }, 'yellow')
  ],
  respetuosamente: [
    ground(),
    s('circle', { cx: 52, cy: 82, r: 12 }, 'skin'),
    s('rect', { x: 26, y: 70, width: 30, height: 44, rx: 10, transform: 'rotate(-70 41 112)' }, 'navy', { accent: true }),
    s('path', { d: 'M30 112v24M46 112v24', ...SW(9) }, 'navy', { stroke: true }),
    ...person(118, 136, 'green', { h: 50 })
  ],
  revocatorio: [
    s('path', { d: 'M24 26h50l-8 22 10 20-8 22 6 26-4 20H24z' }, 'white'),
    s('path', { d: 'M86 26h50v110H90l6-20-6-26 8-22-10-20z' }, 'white'),
    s('path', { d: 'M24 26h50l-8 22 10 20-8 22 6 26-4 20H24zM86 26h50v110H90l6-20-6-26 8-22-10-20z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 44h26M34 60h28M100 44h26M100 60h24', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 148q32 10 64-6', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M40 138l8 10-12 2z' }, 'red')
  ],
  riba: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'sky'),
    s('path', { d: 'M14 70q50 10 70 40q20 26 62 30v6H14z' }, 'blue', { accent: true }),
    s('path', { d: 'M14 70q50 10 70 40q20 26 62 30V14H14z' }, 'green'),
    s('path', { d: 'M14 70q50 10 70 40q20 26 62 30', ...SW(8) }, 'tan', { stroke: true }),
    s('path', { d: 'M100 70v-14M108 72v-18M116 76v-14', ...SW(3) }, 'mint', { stroke: true })
  ],
  rizo: [
    s('circle', { cx: 80, cy: 88, r: 34 }, 'skin'),
    s('path', { d: dots([[50, 54], [66, 42], [84, 38], [102, 42], [116, 56], [42, 74], [120, 76]], 14) }, 'brown', { accent: true }),
    s('path', { d: spiral(44, 52) + spiral(76, 36) + spiral(108, 46) + spiral(38, 80) + spiral(114, 78), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[68, 92], [92, 92]], 4) }, 'dark'),
    s('path', { d: 'M70 106q10 8 20 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  ronco: [
    s('circle', { cx: 70, cy: 52, r: 30 }, 'skin'),
    s('path', { d: 'M52 146v-40q0-22 18-22t18 22v40z' }, 'blue'),
    s('path', { d: 'M56 82q14 10 28 0', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M58 90h24', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M104 56l8-8 6 10 8-12 6 14 8-8', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 62q12-8 24 0', ...SW(4) }, 'dark', { stroke: true })
  ],
  ruin: [
    ...person(60, 136, 'dark', { h: 52, w: 36, r: 14 }),
    s('path', { d: 'M52 54l6 2M68 54l-6 2M52 66q8-4 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 92q-12 0-12 22t22 22t22-22t-12-22z' }, 'yellow', { accent: true }),
    s('path', { d: 'M88 92l-6-10h26l-6 10z' }, 'yellow'),
    s('path', { d: 'M46 110h40', ...SW(8) }, 'skin', { stroke: true })
  ],
  rutinario: [
    s('path', { d: ring(80, 80, 60), ...SW(8) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M132 46l8 26-24-6z' }, 'blue'),
    s('circle', { cx: 80, cy: 80, r: 40 }, 'white'),
    s('path', { d: ring(80, 80, 40), ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 56v24l16 10', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 4 }, 'red')
  ],
  saciedad: [
    s('circle', { cx: 80, cy: 34, r: 16 }, 'skin'),
    s('path', { d: 'M70 30q4-4 8 0M84 30q4-4 8 0M72 40q8 6 16 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 136V70q0-16 24-16t24 16v66z' }, 'green'),
    s('ellipse', { cx: 82, cy: 100, rx: 36, ry: 30 }, 'green', { accent: true }),
    s('path', { d: 'M60 92q14 8 30 4', ...SW(8) }, 'skin', { stroke: true }),
    s('ellipse', { cx: 132, cy: 132, rx: 16, ry: 5 }, 'gray')
  ],
  saldar: [
    ...paper(22, 18, 76, 104),
    s('path', { d: 'M34 38h52M34 54h52M34 70h36', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 94l14 14 30-30', ...SW(8) }, 'green', { stroke: true, accent: true }),
    s('path', { d: ells([[118, 132, 22, 8], [118, 120, 22, 8], [118, 108, 22, 8]]) }, 'yellow'),
    s('path', { d: 'M96 132q0-6 22-6M96 120q0-6 22-6', ...SW(2) }, 'orange', { stroke: true })
  ],
  sensei: [
    backdrop('tan'),
    s('circle', { cx: 80, cy: 40, r: 16 }, 'skin'),
    s('path', { d: 'M50 146V76q0-18 30-18t30 18v70z' }, 'white'),
    s('path', { d: 'M66 60l14 30 14-30', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 50, y: 98, width: 60, height: 10 }, 'black', { accent: true }),
    s('path', { d: 'M76 108l-8 22M84 108l8 22', ...SW(6) }, 'black', { stroke: true }),
    s('path', { d: 'M64 26q16-14 32 0', ...SW(5) }, 'dark', { stroke: true })
  ],
  'simbólicamente': [
    s('path', { d: 'M18 112q62-30 124 0l-6 28H24z' }, 'red'),
    s('path', { d: 'M24 112l-6 8M136 112l6 8', ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 46, cy: 74, r: 22 }, 'yellow', { accent: true }),
    s('circle', { cx: 46, cy: 74, r: 9 }, 'red'),
    s('path', { d: 'M68 74h70v10M120 74v14M104 74v10', ...SW(9, { 'stroke-linecap': 'butt' }) }, 'yellow', { stroke: true }),
    s('path', { d: sparkle(116, 34, 12) }, 'orange')
  ],
  'sistémico': [
    s('path', { d: 'M80 80L36 36M80 80l44-44M80 80l-44 44M80 80l44 44M36 36h88M36 124h88M36 36v88M124 36v88', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 20 }, 'blue', { accent: true }),
    s('path', { d: dots([[36, 36], [124, 36], [36, 124], [124, 124]], 14) }, 'orange'),
    s('path', { d: dots([[80, 36], [80, 124], [36, 80], [124, 80]], 8) }, 'green')
  ],
  sociocultural: [
    s('path', { d: busts([40, 80, 120], 146, 32, 36) }, 'purple'),
    s('path', { d: dots([[40, 96], [80, 96], [120, 96]], 14) }, 'skin'),
    s('path', { d: 'M28 20h44v20q0 18-22 18T28 40z' }, 'yellow', { accent: true }),
    s('path', { d: 'M88 28h44v20q0 18-22 18T88 48z' }, 'sky'),
    s('path', { d: 'M38 46q12-8 24 0M98 54q12 8 24 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[42, 34], [58, 34], [102, 40], [118, 40]], 3) }, 'dark')
  ],
  solsticio: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'sky'),
    s('path', { d: 'M14 120h132v26H14z' }, 'green'),
    s('path', { d: 'M22 120Q80-20 138 120', ...DASH(3) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 50, r: 16 }, 'yellow', { accent: true }),
    s('path', { d: rays(80, 50, 22, 30, 8), ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M80 120V72', ...SW(4) }, 'dark', { stroke: true })
  ],
  'subdirección': [
    s('path', { d: 'M80 44v24M40 68h80M40 68v20M120 68v20M40 112v16', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 56, y: 16, width: 48, height: 28, rx: 5 }, 'navy'),
    s('rect', { x: 18, y: 88, width: 44, height: 26, rx: 5 }, 'orange', { accent: true }),
    s('rect', { x: 98, y: 88, width: 44, height: 26, rx: 5 }, 'sky'),
    s('rect', { x: 22, y: 128, width: 36, height: 18, rx: 4 }, 'gray'),
    s('path', { d: star(40, 101, 8) }, 'white')
  ],
  'subordinación': [
    ground(),
    ...person(52, 136, 'navy', { h: 60, w: 36, r: 16 }),
    s('circle', { cx: 112, cy: 110, r: 10 }, 'skin'),
    s('rect', { x: 98, y: 116, width: 28, height: 20, rx: 8 }, 'green', { accent: true }),
    s('path', { d: 'M72 48h22', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M100 60v34', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M92 88l8 10 8-10z' }, 'orange')
  ],
  termal: [
    s('path', { d: 'M14 104q4-14 20-12q10-14 26-4q20-8 30 4q20-10 30 2q20-6 26 10v40H14z' }, 'gray'),
    s('ellipse', { cx: 80, cy: 116, rx: 54, ry: 18 }, 'sky', { accent: true }),
    s('path', { d: 'M50 84q-8-12 0-24t0-24M80 84q-8-12 0-24t0-24M110 84q-8-12 0-24t0-24', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 72, cy: 110, r: 10 }, 'skin'),
    s('path', { d: 'M64 104h16v-6h-16z' }, 'white')
  ],
  testimonial: [
    s('rect', { x: 30, y: 98, width: 70, height: 48, rx: 4 }, 'brown'),
    ...person(64, 98, 'blue', { h: 34, accent: true }),
    s('path', { d: 'M78 74l10-30', ...SW(8) }, 'skin', { stroke: true }),
    s('rect', { x: 82, y: 26, width: 14, height: 18, rx: 6 }, 'skin'),
    s('path', { d: 'M108 110h30v30h-30z' }, 'dark'),
    s('path', { d: 'M114 116h18', ...SW(3) }, 'yellow', { stroke: true })
  ],
  tocador: [
    s('ellipse', { cx: 80, cy: 52, rx: 30, ry: 38 }, 'brown'),
    s('ellipse', { cx: 80, cy: 52, rx: 24, ry: 32 }, 'sky', { accent: true }),
    s('path', { d: 'M66 36l12-8M66 52l22-16', ...SW(4) }, 'white', { stroke: true }),
    s('rect', { x: 22, y: 90, width: 116, height: 14, rx: 3 }, 'brown'),
    s('path', { d: 'M28 104v38M132 104v38', ...SW(8) }, 'brown', { stroke: true }),
    s('rect', { x: 34, y: 76, width: 10, height: 14, rx: 2 }, 'pink'),
    s('rect', { x: 112, y: 70, width: 12, height: 20, rx: 4 }, 'purple')
  ],
  tranquilizar: [
    ground(),
    ...person(56, 136, 'blue', { h: 56, w: 34, r: 15 }),
    s('circle', { cx: 104, cy: 92, r: 11 }, 'skin'),
    s('rect', { x: 92, y: 104, width: 24, height: 32, rx: 8 }, 'yellow', { accent: true }),
    s('path', { d: 'M66 96q22-14 36 6', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: drop(112, 96, 3) }, 'sky'),
    s('path', { d: heart(80, 44, 10) }, 'pink')
  ],
  traste: [
    s('rect', { x: 14, y: 54, width: 132, height: 52, rx: 4 }, 'brown'),
    s('path', { d: 'M38 54v52M62 54v52M86 54v52M110 54v52M134 54v52', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 54v52', ...SW(5) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M14 64h132M14 76h132M14 88h132M14 98h132', ...SW(1.5) }, 'cream', { stroke: true }),
    s('ellipse', { cx: 74, cy: 82, rx: 10, ry: 14 }, 'skin'),
    s('path', { d: 'M70 96q-6 30 4 50', ...SW(14) }, 'skin', { stroke: true })
  ],
  'trébol': [
    s('path', { d: 'M80 96q10 26 30 48', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: heart(80, 72, 16) }, 'green', { accent: true }),
    s('path', { d: heart(80, 72, 16), transform: 'rotate(120 80 88)' }, 'green'),
    s('path', { d: heart(80, 72, 16), transform: 'rotate(240 80 88)' }, 'green'),
    s('path', { d: 'M80 88l0-24M80 88l20 12M80 88l-20 12', ...SW(2) }, 'mint', { stroke: true })
  ],
  uniformidad: [
    ground(),
    s('path', { d: dots([[28, 74], [62, 74], [96, 74], [130, 74]], 10) }, 'skin'),
    s('path', { d: rects([[16, 86, 24, 50], [50, 86, 24, 50], [84, 86, 24, 50], [118, 86, 24, 50]]) }, 'blue', { accent: true }),
    s('path', { d: 'M18 64h20M52 64h20M86 64h20M120 64h20', ...SW(6) }, 'navy', { stroke: true })
  ],
  vendimia: [
    s('path', { d: 'M24 96h112l-10 44H34z' }, 'brown'),
    s('path', { d: 'M24 96h112', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: dots([[60, 30], [76, 30], [92, 30], [68, 44], [84, 44], [76, 58], [100, 44], [52, 44]], 9) }, 'purple', { accent: true }),
    s('path', { d: dots([[44, 90], [58, 86], [72, 90], [90, 88], [104, 90], [118, 86]], 9) }, 'purple'),
    s('path', { d: 'M76 22q2-10 10-12', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 18, -20, 26, 9) }, 'green')
  ],
  'versátil': [
    s('path', { d: 'M40 70L22 34', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 70l6-44 8 2-4 42z' }, 'gray'),
    s('path', { d: 'M110 70l26-30', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M126 52l18-10', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 20, y: 70, width: 120, height: 40, rx: 20 }, 'red', { accent: true }),
    s('path', { d: 'M74 84h12v-6h6v6h6v6h-6v6h-6v-6h-12z' }, 'white')
  ],
  'versículo': [
    ...openBook(80, 46, 'cream', 'navy'),
    s('path', { d: 'M34 58h40M34 70h40M86 64h40M86 76h40M86 88h40', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M32 82h44', ...SW(8) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M80 22v-8M68 26l-4-6M92 26l4-6', ...SW(3) }, 'orange', { stroke: true })
  ],
  zafra: [
    ground(140),
    s('path', { d: 'M30 140V30M48 140V22M66 140V36', ...SW(8) }, 'green', { stroke: true }),
    s('path', { d: 'M24 60h12M42 50h12M60 64h12M24 96h12M42 90h12M60 104h12', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: 'M86 126l52-30M90 136l52-30M84 116l52-30', ...SW(7) }, 'tan', { stroke: true, accent: true }),
    s('path', { d: 'M106 104l6 12', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(48, 22, -120, 30, 8) + leaflet(30, 30, -60, 26, 7) }, 'green')
  ],
  'úlcera': [
    s('path', { d: 'M60 18q-6 30 10 40q20 12 38-6q30-12 36 24q2 40-36 52q-36 10-58-8q-18-14-8-38q10-14 2-28q-6-14 0-36z' }, 'pink'),
    s('circle', { cx: 100, cy: 92, r: 12 }, 'red', { accent: true }),
    s('path', { d: burst(100, 92, 22, 16, 8), ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M54 18h12', ...SW(6) }, 'pink', { stroke: true }),
    s('path', { d: 'M48 104q4 30 26 40', ...SW(10) }, 'pink', { stroke: true })
  ],
  acometer: [
    ground(),
    ...lean(52, 136, 25, 'orange', { accent: true }),
    s('path', { d: 'M40 136l-10-14M60 136l14-16', ...SW(7) }, 'orange', { stroke: true }),
    s('path', { d: 'M14 70h20M14 86h26M14 102h16', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 104, y: 62, width: 40, height: 74, rx: 4 }, 'brown'),
    s('path', { d: 'M100 56l-8-10M98 70h-10', ...SW(3) }, 'red', { stroke: true })
  ],
  afiche: [
    s('rect', { x: 14, y: 14, width: 132, height: 132 }, 'tan'),
    s('rect', { x: 34, y: 22, width: 92, height: 116 }, 'navy', { accent: true }),
    s('path', { d: 'M34 120l28-40 20 24 14-16 30 32v18H34z' }, 'green'),
    s('circle', { cx: 100, cy: 52, r: 12 }, 'yellow'),
    s('path', { d: 'M28 30l14-14M118 16l14 14M28 130l14 14M118 144l14-14', ...SW(8) }, 'cream', { stroke: true })
  ],
  'agregación': [
    s('path', { d: dots([[22, 26], [138, 30], [20, 134], [140, 130], [80, 18], [80, 144]], 8) }, 'sky'),
    s('path', { d: 'M30 34l22 22M130 38l-22 20M28 126l24-22M132 122l-22-20M80 28v18M80 134v-18', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[72, 72], [88, 72], [80, 86], [66, 88], [94, 88], [80, 60]], 9) }, 'blue', { accent: true })
  ],
  anguila: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'sky'),
    s('path', { d: 'M22 100q20-40 40-10t40 0 32-30', ...SW(16) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: 'M22 100q20-40 40-10t40 0 32-30', ...SW(4, { 'stroke-dasharray': '2 14' }) }, 'gray', { stroke: true }),
    s('circle', { cx: 130, cy: 62, r: 3 }, 'white'),
    s('path', { d: dots([[110, 34], [118, 22]], 4) }, 'white')
  ],
  aniquilar: [
    s('path', { d: burst(80, 80, 62, 34, 12) }, 'orange', { accent: true }),
    s('path', { d: burst(80, 80, 38, 22, 10) }, 'yellow'),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'white'),
    s('path', { d: 'M20 24l10 10M140 24l-10 10M20 136l10-10M140 136l-10-10', ...SW(5) }, 'dark', { stroke: true })
  ],
  apasionadamente: [
    s('path', { d: 'M80 14q12 20 6 30q14-6 14-22q22 22 6 46H54q-18-26 8-46q-2 14 6 22q-2-18 12-30z' }, 'orange'),
    s('path', { d: heart(80, 100, 32) }, 'red', { accent: true }),
    s('path', { d: 'M56 80q-8 6-6 16', ...SW(5) }, 'pink', { stroke: true })
  ],
  apresurar: [
    ground(),
    ...lean(70, 136, 20, 'blue', { accent: true }),
    s('path', { d: 'M62 136l-18-14M80 136l18-12', ...SW(8) }, 'blue', { stroke: true }),
    s('path', { d: 'M18 70h22M14 90h24M22 110h16', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 120, cy: 40, r: 20 }, 'white'),
    s('path', { d: ring(120, 40, 20) + 'M120 28v12l8 6', ...SW(4) }, 'red', { stroke: true })
  ],
  arcaico: [
    ground(),
    s('path', { d: 'M18 30h124v14H18z' }, 'tan'),
    s('path', { d: 'M28 44h20v92H28zM70 44h20v40l-6 8 6 6H70zM112 44h20v92h-20z' }, 'cream', { accent: true }),
    s('path', { d: 'M34 48v84M42 48v84M76 48v36M84 48v30M118 48v84M126 48v84', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M66 136l8-24 22 6 4 18z' }, 'cream'),
    s('path', { d: 'M18 30l20-12h84l20 12', ...SW(4) }, 'tan', { stroke: true })
  ],
  arepa: [
    s('ellipse', { cx: 80, cy: 118, rx: 62, ry: 14 }, 'gray'),
    s('path', { d: 'M24 96q0-50 56-50t56 50z' }, 'yellow', { accent: true }),
    s('path', { d: 'M28 100q52-14 104 0', ...SW(12) }, 'red', { stroke: true }),
    s('path', { d: 'M30 108q50 22 100 0q-6 10-50 12t-50-12z' }, 'yellow'),
    s('path', { d: 'M40 102q10-8 20 0t20 0 20 0 20 0', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: ells([[56, 70, 6, 4], [92, 62, 7, 4], [110, 80, 5, 3], [74, 84, 6, 3]]) }, 'brown')
  ],
  'armónico': [
    s('path', { d: 'M48 20v52q0 18 16 18t16-18V20', ...SW(10) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: 'M64 90v50', ...SW(10) }, 'gray', { stroke: true }),
    s('path', { d: 'M92 50q8-16 16 0t16 0 16 0', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M92 70q8-16 16 0t16 0 16 0', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M20 50q4-8 8 0t8 0', ...SW(4) }, 'purple', { stroke: true })
  ],
  atropellar: [
    ground(),
    ...car(14, 100, 'red', 'sky', { accent: true }),
    s('path', { d: 'M104 136l12-36 12 36z', transform: 'rotate(50 116 128)' }, 'orange'),
    s('path', { d: 'M90 76l8-10M104 74l-2-14M80 74l-6-10', ...SW(4) }, 'dark', { stroke: true })
  ],
  aunar: [
    s('path', { d: 'M18 30q40 0 52 50', ...SW(10) }, 'red', { stroke: true }),
    s('path', { d: 'M18 80h52', ...SW(10) }, 'yellow', { stroke: true }),
    s('path', { d: 'M18 130q40 0 52-50', ...SW(10) }, 'blue', { stroke: true }),
    s('path', { d: 'M70 80h48', ...SW(22) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M118 58l28 22-28 22z' }, 'green')
  ],
  autista: [
    s('circle', { cx: 80, cy: 80, r: 64 }, 'mint'),
    s('path', { d: ring(80, 80, 64), ...DASH(3) }, 'green', { stroke: true }),
    ...person(80, 130, 'blue', { h: 42, r: 14 }),
    s('path', { d: 'M62 60q0-24 18-24t18 24', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: rects([[58, 54, 8, 14], [94, 54, 8, 14]]) }, 'orange', { accent: true }),
    s('path', { d: rects([[28, 118, 12, 12], [42, 118, 12, 12], [106, 118, 12, 12], [120, 118, 12, 12]]) }, 'red')
  ],
  banal: [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'gray', { accent: true }),
    s('path', { d: 'M52 66h18M90 66h18', ...SW(5) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 80, cy: 104, rx: 12, ry: 16 }, 'dark'),
    s('path', { d: 'M120 30q8-4 10 4t10 4M124 20q6-2 8 2', ...SW(3) }, 'gray', { stroke: true })
  ],
  beato: [
    s('ellipse', { cx: 80, cy: 26, rx: 24, ry: 7 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 50, r: 18 }, 'skin'),
    s('path', { d: 'M70 50q4 3 8 0M84 50q4 3 8 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 146v-48q0-26 36-26t36 26v48z' }, 'brown'),
    s('path', { d: 'M80 90l-12 30h24z' }, 'skin'),
    s('path', { d: 'M80 90v30', ...SW(2) }, 'tan', { stroke: true })
  ],
  boicotear: [
    s('path', { d: 'M36 60h88l-8 80H44z' }, 'orange'),
    s('path', { d: 'M60 60q0-26 20-26t20 26', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: ring(80, 92, 56) + 'M40 52l80 80', ...SW(10) }, 'red', { stroke: true, accent: true })
  ],
  'básquetbol': [
    s('path', { d: 'M96 18h44v32H96z' }, 'white'),
    s('path', { d: 'M96 18h44v32H96zM108 30h20v14', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 50h36', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M102 52l6 22h20l6-22', ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 60, cy: 100, r: 38 }, 'orange', { accent: true }),
    s('path', { d: 'M22 100h76M60 62v76M33 73q20 27 0 54M87 73q-20 27 0 54', ...SW(3) }, 'dark', { stroke: true })
  ],
  calamar: [
    s('path', { d: 'M80 14l24 36q6 20-6 44H62q-12-24-6-44z' }, 'pink', { accent: true }),
    s('path', { d: 'M66 94q-10 30-30 44M74 94q-4 30-14 50M86 94q4 30 14 50M94 94q10 30 30 44M80 94v50', ...SW(6) }, 'pink', { stroke: true }),
    s('path', { d: dots([[70, 80], [90, 80]], 6) }, 'white'),
    s('path', { d: dots([[71, 81], [89, 81]], 3) }, 'dark'),
    s('path', { d: 'M56 50h-18l18-16M104 50h18l-18-16' }, 'pink')
  ],
  caries: [
    s('path', { d: 'M40 30q20-16 40-4q20-12 40 4q16 22 2 50q-4 60-16 62q-10 0-14-40q-6-8-12 0q-4 40-14 40q-12-2-16-62q-14-28-10-50z' }, 'white'),
    s('path', { d: 'M40 30q20-16 40-4q20-12 40 4q16 22 2 50q-4 60-16 62q-10 0-14-40q-6-8-12 0q-4 40-14 40q-12-2-16-62q-14-28-10-50z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M88 40q16-4 18 12q0 14-14 16q-12-2-10-14z' }, 'dark', { accent: true }),
    s('path', { d: 'M58 44q-6 6-4 16', ...SW(4) }, 'sky', { stroke: true })
  ],
  catastro: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 6 }, 'cream'),
    s('path', { d: 'M14 60h132M60 14v132M100 60v86M60 104h86M14 100l46-6', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 60h46v44h-46z' }, 'mint', { accent: true }),
    s('path', { d: 'M110 96V80l13-10 13 10v16z' }, 'red'),
    s('path', { d: 'M22 30h28M70 30h60', ...DASH(3, '4 4') }, 'gray', { stroke: true })
  ],
  catecismo: [
    s('rect', { x: 34, y: 20, width: 92, height: 120, rx: 6 }, 'navy', { accent: true }),
    s('rect', { x: 120, y: 26, width: 10, height: 108 }, 'cream'),
    s('path', { d: 'M80 44v56M62 62h36', ...SW(8) }, 'yellow', { stroke: true }),
    s('path', { d: 'M50 120h60', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M100 140v12l6-4 6 4v-12z' }, 'red')
  ],
  chamba: [
    ground(),
    s('circle', { cx: 64, cy: 52, r: 14 }, 'skin'),
    s('path', { d: 'M46 50q0-22 18-22t18 22z' }, 'yellow', { accent: true }),
    s('rect', { x: 48, y: 68, width: 32, height: 46, rx: 8 }, 'orange'),
    s('path', { d: 'M52 114v22M76 114v22', ...SW(8) }, 'navy', { stroke: true }),
    s('path', { d: 'M78 80l40 50', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M112 124l20 6-6 16-18-10z' }, 'gray')
  ],
  circunstancial: [
    s('path', { d: ells([[34, 120, 7, 11], [56, 96, 7, 11], [44, 70, 7, 11], [70, 46, 7, 11]]) }, 'brown'),
    s('circle', { cx: 96, cy: 72, r: 28 }, 'sky'),
    s('path', { d: ring(96, 72, 28), ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M116 92l26 30', ...SW(10) }, 'dark', { stroke: true }),
    s('path', { d: ells([[96, 72, 6, 10]]) }, 'brown', { accent: true })
  ],
  clivar: [
    s('path', { d: 'M30 140l10-60 30-20 6 80z' }, 'purple', { accent: true }),
    s('path', { d: 'M88 140l-4-80 30 18 16 62z' }, 'purple'),
    s('path', { d: 'M40 80l30-20M84 60l30 18', ...SW(2) }, 'pink', { stroke: true }),
    s('path', { d: 'M78 52V14', ...DASH(3, '5 4') }, 'gray', { stroke: true }),
    s('path', { d: 'M88 32l38-12', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 118, y: 6, width: 16, height: 30, rx: 3, transform: 'rotate(-18 126 21)' }, 'gray')
  ],
  cogida: [
    ground(),
    s('path', { d: 'M20 136V108q0-28 30-32h30q20 0 26 18l6 20-14 6-8-16v42h-10v-30H40v30H30z' }, 'dark'),
    s('path', { d: 'M100 92q14-14 10-30M88 86q0-20-8-28', ...SW(6) }, 'cream', { stroke: true }),
    s('path', { d: 'M100 40l30-24 16 20-34 20z' }, 'red', { accent: true }),
    s('path', { d: 'M96 30l-6-8M86 42l-10-2', ...SW(3) }, 'orange', { stroke: true })
  ],
  coito: [
    s('path', { d: heart(64, 90, 26) }, 'pink'),
    s('path', { d: heart(96, 90, 26) }, 'red', { accent: true }),
    s('path', { d: sparkle(126, 30, 9) + sparkle(30, 34, 7) }, 'yellow')
  ],
  'comodín': [
    s('rect', { x: 32, y: 16, width: 96, height: 128, rx: 10 }, 'white'),
    s('rect', { x: 32, y: 16, width: 96, height: 128, rx: 10, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 76q10-34 32-30q22-4 32 30l-16-12-16 14-16-14z' }, 'purple', { accent: true }),
    s('path', { d: dots([[48, 76], [112, 76], [80, 44]], 6) }, 'yellow'),
    s('circle', { cx: 80, cy: 96, r: 18 }, 'skin'),
    s('path', { d: 'M70 102q10 8 20 0', ...SW(3) }, 'red', { stroke: true })
  ],
  concertar: [
    s('rect', { x: 70, y: 18, width: 66, height: 60, rx: 6 }, 'white'),
    outline({ x: 70, y: 18, width: 66, height: 60, rx: 6 }),
    s('path', { d: 'M70 36h66', ...SW(12, { 'stroke-linecap': 'butt' }) }, 'red'),
    s('path', { d: grid(78, 48, 4, 2, 10, 8, 14, 13), }, 'gray'),
    s('rect', { x: 106, y: 61, width: 10, height: 8 }, 'green', { accent: true }),
    s('path', { d: 'M14 118l32-18 20 6 14 0-20 16q-12 8-26 0z' }, 'skin'),
    s('path', { d: 'M146 118l-32-18-20 6 18 16q12 8 26 0z' }, 'tan')
  ],
  conciso: [
    s('path', { d: 'M18 40h124M18 60h124M18 80h124', ...DASH(5, '10 6') }, 'gray', { stroke: true }),
    s('path', { d: 'M18 120h50', ...SW(8) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M86 128l40-60M86 68l40 60', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: ells([[80, 136, 10, 8], [132, 136, 10, 8]]) }, 'red')
  ],
  'contaduría': [
    s('rect', { x: 18, y: 50, width: 80, height: 96, rx: 4 }, 'cream'),
    s('path', { d: 'M18 70h80M18 90h80M18 110h80M18 130h80M50 50v96', ...SW(2) }, 'green', { stroke: true }),
    s('rect', { x: 84, y: 18, width: 58, height: 80, rx: 8 }, 'dark'),
    s('rect', { x: 92, y: 26, width: 42, height: 16, rx: 2 }, 'mint', { accent: true }),
    s('path', { d: grid(92, 50, 3, 3, 10, 10, 16, 15) }, 'gray')
  ],
  contrabandista: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'navy'),
    s('circle', { cx: 120, cy: 38, r: 12 }, 'cream'),
    s('circle', { cx: 64, cy: 48, r: 14 }, 'skin'),
    s('path', { d: 'M46 44h36l-6-18H52z' }, 'black'),
    s('path', { d: 'M40 146l8-80h32l8 80z' }, 'brown'),
    s('path', { d: 'M62 70h36l6 48H62z' }, 'tan', { accent: true }),
    s('path', { d: 'M62 86h42M62 102h44', ...SW(2) }, 'brown', { stroke: true })
  ],
  convicto: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 6 }, 'gray'),
    s('circle', { cx: 80, cy: 66, r: 16 }, 'skin'),
    s('path', { d: 'M48 146v-40q0-20 32-20t32 20v40z' }, 'orange', { accent: true }),
    s('path', { d: 'M32 14v132M58 14v132M102 14v132M128 14v132', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 30h132', ...SW(8) }, 'dark', { stroke: true })
  ],
  cualitativo: [
    s('path', { d: 'M40 62l20-24h40l20 24-40 54z' }, 'sky', { accent: true }),
    s('path', { d: 'M40 62h80M60 38l10 24 10 54 10-54 10-24', ...SW(2) }, 'blue', { stroke: true }),
    s('path', { d: star(124, 120, 14) + star(36, 120, 10) + star(80, 140, 8) }, 'yellow'),
    s('path', { d: sparkle(124, 30, 10) }, 'yellow')
  ],
  curvatura: [
    s('path', { d: 'M14 120Q80 10 146 120', ...SW(8) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M80 140V66', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 140h80', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M56 120a28 28 0 0 1 48 0', ...SW(4) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 65, r: 6 }, 'red')
  ],
  delatar: [
    ground(),
    s('rect', { x: 92, y: 30, width: 50, height: 106, rx: 4 }, 'brown'),
    s('circle', { cx: 96, cy: 64, r: 10 }, 'skin'),
    s('rect', { x: 86, y: 76, width: 14, height: 40, rx: 5 }, 'gray'),
    ...person(36, 136, 'red', { accent: true }),
    s('path', { d: 'M48 102l30-24', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M80 62l-4-10M88 58l2-12', ...SW(3) }, 'orange', { stroke: true })
  ],
  desamor: [
    s('path', { d: heart(80, 92, 36) }, 'red', { accent: true }),
    s('path', { d: 'M80 46l-10 22 14 14-10 18 8 14', ...SW(8) }, 'white', { stroke: true }),
    s('path', { d: drop(36, 130, 6) + drop(124, 130, 6) }, 'sky')
  ],
  'desocupación': [
    ground(),
    s('path', { d: 'M108 136V40h34v96' }, 'gray'),
    s('rect', { x: 116, y: 50, width: 18, height: 30 }, 'dark'),
    ...person(64, 136, 'navy'),
    s('path', { d: 'M38 96h52l-6 24H44z' }, 'tan', { accent: true }),
    s('path', { d: 'M48 96V84h10v12M64 96l6-14 6 6-2 8', ...SW(3) }, 'green', { stroke: true })
  ],
  despojo: [
    ground(),
    s('path', { d: 'M24 136V70l20-14 8 20 10-8v68z' }, 'gray', { accent: true }),
    s('path', { d: 'M96 136V84l18-6 4 18 14 4v36z' }, 'gray'),
    s('path', { d: 'M56 136l10-20 18 4 8 16z' }, 'brown'),
    s('path', { d: 'M36 90h10v14H36z' }, 'dark'),
    s('path', { d: 'M40 40q10-10 6-22M108 52q10-10 4-20', ...SW(6) }, 'gray', { stroke: true })
  ],
  detonante: [
    s('circle', { cx: 60, cy: 96, r: 40 }, 'black'),
    s('rect', { x: 50, y: 46, width: 20, height: 14, rx: 2 }, 'gray'),
    s('path', { d: 'M60 46q0-20 24-24t28-6', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: burst(120, 18, 16, 7, 8) }, 'orange', { accent: true }),
    s('circle', { cx: 120, cy: 18, r: 5 }, 'yellow'),
    s('path', { d: 'M40 84q4-14 16-18', ...SW(5) }, 'gray', { stroke: true })
  ],
  difamar: [
    s('rect', { x: 78, y: 18, width: 66, height: 84, rx: 4 }, 'brown'),
    s('rect', { x: 86, y: 26, width: 50, height: 68 }, 'cream'),
    s('circle', { cx: 111, cy: 52, r: 12 }, 'skin'),
    s('path', { d: 'M93 94q0-26 18-26t18 26z' }, 'blue'),
    s('path', { d: ells([[100, 46, 8, 6], [122, 74, 10, 7], [106, 86, 6, 4]]) + drop(124, 40, 4) }, 'brown', { accent: true }),
    ...person(36, 136, 'dark', { h: 44 }),
    s('path', { d: 'M50 74q20-10 34-20', ...DASH(4, '4 6') }, 'brown', { stroke: true })
  ],
  difuso: [
    s('circle', { cx: 80, cy: 80, r: 64 }, 'cream'),
    s('circle', { cx: 80, cy: 80, r: 50 }, 'yellow', { opacity: 0.35 }),
    s('circle', { cx: 80, cy: 80, r: 36 }, 'yellow', { opacity: 0.5 }),
    s('circle', { cx: 80, cy: 80, r: 22 }, 'yellow', { accent: true }),
    s('path', { d: dots([[30, 40], [128, 46], [120, 128], [40, 118], [80, 22], [140, 90]], 4) }, 'orange', { opacity: 0.6 })
  ],
  efigie: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'yellow', { accent: true }),
    s('path', { d: ring(80, 80, 52), ...SW(3, { 'stroke-dasharray': '3 5' }) }, 'orange', { stroke: true }),
    s('path', { d: HEAD, transform: 'translate(36 36) scale(0.55)' }, 'orange'),
    s('path', { d: 'M54 50q20-18 40-8', ...SW(5) }, 'brown', { stroke: true })
  ],
  errar: [
    s('circle', { cx: 92, cy: 84, r: 44 }, 'red'),
    s('circle', { cx: 92, cy: 84, r: 30 }, 'white'),
    s('circle', { cx: 92, cy: 84, r: 15 }, 'red'),
    s('path', { d: 'M18 120L136 22', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M136 22l-14 2 6 6zM20 118l-4 8 10-2-6-6z' }, 'blue', { accent: true }),
    s('path', { d: 'M142 40l4 8M126 12l-6-6', ...SW(3) }, 'gray', { stroke: true })
  ],
  espejismo: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'cream'),
    s('circle', { cx: 120, cy: 38, r: 14 }, 'orange'),
    s('path', { d: 'M14 110q40-20 80-6t52-4v46H14z' }, 'tan'),
    s('path', { d: 'M48 86q22-10 44 0q-22 10-44 0z' }, 'sky', { accent: true, opacity: 0.8 }),
    s('path', { d: 'M74 84V58M74 58q-12-6-18 4M74 58q12-8 18 2M74 58q-4-12-14-10M74 58q6-12 14-8', ...SW(4) }, 'green', { stroke: true, opacity: 0.6 }),
    s('path', { d: 'M40 74q6-4 12 0t12 0M90 72q6-4 12 0t12 0', ...SW(2) }, 'orange', { stroke: true })
  ],
  esperanto: [
    s('circle', { cx: 80, cy: 88, r: 54 }, 'sky'),
    s('path', { d: 'M48 64q14 8 26-4q10 18 30 8q2 18 12 26q-20 14-34 2q-16 16-36-4q6-12 2-28z' }, 'mint'),
    s('path', { d: star(80, 86, 30) }, 'green', { accent: true }),
    s('path', { d: bubble(16, 14, 40, 30) }, 'white'),
    s('path', { d: bubble(16, 14, 40, 30) + 'M104 22h40v24h-34l-8 8z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 22h40v24h-34l-8 8z' }, 'white')
  ],
  espiritualmente: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'purple', { opacity: 0.25 }),
    s('circle', { cx: 80, cy: 50, r: 14 }, 'skin'),
    s('path', { d: 'M62 108V80q0-14 18-14t18 14v28z' }, 'purple', { accent: true }),
    s('path', { d: 'M34 116q46-20 92 0q-46 14-92 0z' }, 'purple'),
    s('path', { d: 'M64 84l-16 22M96 84l16 22', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(80, 22, 10) + sparkle(40, 50, 6) + sparkle(120, 50, 6) }, 'yellow')
  ],
  estaca: [
    s('rect', { x: 14, y: 110, width: 132, height: 36 }, 'brown'),
    s('path', { d: 'M66 50h28v64l-14 20-14-20z' }, 'tan', { accent: true }),
    s('path', { d: 'M74 54v56M86 54v56', ...SW(2) }, 'brown', { stroke: true }),
    s('rect', { x: 52, y: 22, width: 56, height: 24, rx: 6 }, 'dark'),
    s('path', { d: 'M108 34h32', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M46 62l-10 6M114 62l10 6', ...SW(3) }, 'orange', { stroke: true })
  ],
  estampado: [
    s('path', { d: 'M24 34l28-16h56l28 16-12 30-14-6v84H50V58l-14 6z' }, 'sky', { accent: true }),
    s('path', { d: dots([[66, 46], [94, 46], [80, 70], [62, 96], [98, 96], [80, 122], [66, 140], [96, 138]], 5) }, 'pink'),
    s('path', { d: dots([[80, 46], [66, 70], [94, 70], [80, 96], [66, 122], [94, 122]], 3) }, 'yellow'),
    s('path', { d: 'M66 18q14 14 28 0', ...SW(4) }, 'navy', { stroke: true })
  ],
  estructurar: [
    ground(140),
    s('path', { d: 'M30 140V40h100v100M30 40l100 100M130 40L30 140M30 90h100', ...SW(6) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: dots([[30, 40], [130, 40], [30, 90], [130, 90], [80, 90], [30, 140], [130, 140]], 6) }, 'dark'),
    s('rect', { x: 66, y: 18, width: 28, height: 16, rx: 2 }, 'blue')
  ],
  'etíope': [
    s('path', { d: 'M54 140q-30-10-26-40q4-24 30-30V44h20v26q26 6 30 30q4 30-26 40z' }, 'dark', { accent: true }),
    s('path', { d: 'M78 60l30-28', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 46h20', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 116h34v10q0 14-17 14t-17-14z' }, 'white'),
    s('path', { d: 'M100 116h34v10q0 14-17 14t-17-14z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: ells([[26, 132, 5, 4], [36, 140, 5, 4], [130, 100, 5, 4]]) }, 'brown'),
    s('path', { d: 'M112 106q-4-8 0-14M122 106q-4-8 0-14', ...SW(3) }, 'gray', { stroke: true })
  ],
  excremento: [
    s('path', { d: 'M28 136q-8-20 20-22q-10-18 14-24q-6-18 18-22q2-14 14-18q-2 16 10 24q20 4 12 22q22 4 14 24q22 2 14 16z' }, 'brown', { accent: true }),
    s('path', { d: 'M44 114q30 6 72 0M56 90q20 6 48 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 40q8-8 0-16M130 46q-8-8 0-16', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[40, 32], [124, 26]], 4) }, 'dark')
  ],
  exhortar: [
    ground(),
    ...person(36, 136, 'red', { accent: true }),
    s('path', { d: 'M50 70l26-14v32l-26-12z' }, 'orange'),
    s('path', { d: 'M84 58q6 14 0 28M94 50q12 22 0 44', ...SW(4) }, 'orange', { stroke: true }),
    ...person(124, 136, 'blue'),
    s('path', { d: 'M138 86l4-24', ...SW(7) }, 'skin', { stroke: true })
  ],
  eximir: [
    ...person(60, 136, 'green', { accent: true }),
    s('path', { d: 'M52 60q8 6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 94, y: 20, width: 46, height: 40, rx: 8 }, 'gray'),
    s('path', { d: 'M104 20q0-10 13-10t13 10', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M92 84l10-14 10 14M102 70v28', ...SW(5) }, 'orange', { stroke: true }),
    ground()
  ],
  extensivo: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'sky'),
    s('path', { d: 'M14 60h132v86H14z' }, 'yellow'),
    s('path', { d: 'M14 84l66-24 66 24M14 116l66-56 66 56M14 146l66-86 66 86', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M14 60h132v10H14z' }, 'green', { accent: true }),
    s('circle', { cx: 40, cy: 36, r: 10 }, 'yellow')
  ],
  filete: [
    s('ellipse', { cx: 80, cy: 92, rx: 66, ry: 44 }, 'white'),
    s('ellipse', { cx: 80, cy: 92, rx: 66, ry: 44, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 82q6-30 46-28q40 2 36 30q-4 26-44 26q-38 0-38-28z' }, 'brown', { accent: true }),
    s('path', { d: 'M56 70l40 26M70 64l36 22M54 84l24 16', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: leaflet(112, 112, -20, 20, 6) + leaflet(118, 108, 30, 18, 6) }, 'green')
  ],
  fontana: [
    s('ellipse', { cx: 80, cy: 126, rx: 64, ry: 14 }, 'gray'),
    s('ellipse', { cx: 80, cy: 122, rx: 56, ry: 9 }, 'sky', { accent: true }),
    s('rect', { x: 74, y: 70, width: 12, height: 52 }, 'gray'),
    s('ellipse', { cx: 80, cy: 70, rx: 30, ry: 7 }, 'gray'),
    s('path', { d: 'M80 64q-6-40-40 46M80 64q6-40 40 46M80 66V24', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: dots([[80, 20], [40, 112], [120, 112]], 4) }, 'blue')
  ],
  formativo: [
    s('rect', { x: 14, y: 124, width: 132, height: 20, rx: 4 }, 'brown'),
    s('path', { d: 'M56 124V44', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M70 124V64', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(70, 80, -150, 26, 9) + leaflet(70, 66, -40, 28, 10) }, 'green', { accent: true }),
    s('path', { d: 'M56 90l14 4', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M104 66h30l4 24h-30zM106 72l-12 16 4 3 12-14z' }, 'blue'),
    s('path', { d: 'M100 92q-8 8-12 14M96 96q-6 6-8 12', ...SW(3) }, 'sky', { stroke: true })
  ],
  'ginecólogo': [
    s('circle', { cx: 46, cy: 44, r: 14 }, 'skin'),
    s('path', { d: 'M24 136V74q0-16 22-16t22 16v62z' }, 'white'),
    s('path', { d: 'M24 136V74q0-16 22-16t22 16v62z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 60q-4 24 8 30q12-6 8-30M46 90v10', ...SW(3) }, 'blue', { stroke: true, accent: true }),
    ...lady(112, 136, 'pink'),
    s('ellipse', { cx: 120, cy: 112, rx: 14, ry: 16 }, 'pink')
  ],
  hacinamiento: [
    s('rect', { x: 26, y: 30, width: 108, height: 110 }, 'cream'),
    s('path', { d: 'M20 34l60-24 60 24', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: dots([[44, 54], [68, 50], [92, 52], [116, 56], [40, 84], [62, 82], [84, 86], [108, 82], [50, 112], [74, 114], [98, 110], [120, 112]], 10) }, 'skin'),
    s('path', { d: busts([44, 68, 92, 116], 70, 18, 10) + busts([40, 62, 84, 108], 100, 18, 10) + busts([50, 74, 98, 120], 140, 18, 18) }, 'blue'),
    s('path', { d: 'M26 30h108v110H26z', ...SW(4) }, 'brown', { stroke: true })
  ],
  halago: [
    ground(),
    ...person(40, 136, 'blue'),
    ...person(122, 136, 'pink', { accent: true }),
    s('path', { d: 'M54 92l26-10', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: dots([[86, 74], [96, 80], [86, 86]], 6) }, 'red'),
    s('path', { d: sparkle(100, 40, 9) + sparkle(140, 44, 7) + ells([[116, 78, 4, 2], [128, 78, 4, 2]]) }, 'pink')
  ],
  heno: [
    s('ellipse', { cx: 80, cy: 138, rx: 62, ry: 6 }, 'green'),
    s('rect', { x: 22, y: 50, width: 116, height: 86, rx: 18 }, 'yellow', { accent: true }),
    s('path', { d: 'M30 70h100M30 92h100M30 114h100', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M54 50v86M106 50v86', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M24 52l-6-10M40 48l-2-12M120 48l4-12M136 52l8-8', ...SW(3) }, 'yellow', { stroke: true })
  ],
  hilera: [
    ground(),
    s('path', { d: 'M32 136v-24M64 136v-24M96 136v-24M128 136v-24', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: ells([[32, 90, 14, 24], [64, 90, 14, 24], [96, 90, 14, 24], [128, 90, 14, 24]]) }, 'green', { accent: true }),
    s('path', { d: 'M18 52h124', ...DASH(3) }, 'gray', { stroke: true })
  ],
  'hinchazón': [
    s('path', { d: 'M40 146V60q0-10 9-10t9 10v-30q0-10 10-10t10 10v26-34q0-10 10-10t10 10v38-24q0-10 9-10t9 10v80q0 14-8 24v14z' }, 'skin'),
    s('ellipse', { cx: 73, cy: 42, rx: 16, ry: 22 }, 'pink', { accent: true }),
    s('path', { d: 'M52 40l-10-6M50 54h-12M94 40l10-6', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M40 120q20 10 66 0', ...SW(3) }, 'tan', { stroke: true })
  ],
  hipnosis: [
    s('path', { d: 'M80 14v30', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 14L50 90', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 46, cy: 100, r: 22 }, 'yellow', { accent: true }),
    s('path', { d: spiral(43, 100) + 'M58 100a12 12 0 0 1-24 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M76 110q14-14 28 0t28 0M84 128q14-14 28 0t28 0', ...SW(4) }, 'purple', { stroke: true }),
    s('path', { d: 'M28 72q6 10 4 22M66 72q6 10 4 22', ...DASH(2, '3 4') }, 'orange', { stroke: true })
  ],
  'homeopatía': [
    s('rect', { x: 34, y: 54, width: 52, height: 82, rx: 10 }, 'brown'),
    s('rect', { x: 42, y: 74, width: 36, height: 40, rx: 4 }, 'cream'),
    s('rect', { x: 46, y: 38, width: 28, height: 16, rx: 4 }, 'dark'),
    s('path', { d: 'M60 38V20', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: leaflet(60, 104, -60, 26, 8) }, 'green', { accent: true }),
    s('path', { d: dots([[110, 128], [124, 132], [138, 126], [118, 118], [132, 114]], 6) }, 'white'),
    s('path', { d: ells([[110, 128, 6, 6], [124, 132, 6, 6], [138, 126, 6, 6], [118, 118, 6, 6], [132, 114, 6, 6]]), ...SW(2) }, 'gray', { stroke: true })
  ],
  hostal: [
    s('path', { d: 'M26 30v110M110 30v110', ...SW(8) }, 'brown', { stroke: true }),
    s('rect', { x: 26, y: 58, width: 84, height: 14 }, 'blue', { accent: true }),
    s('rect', { x: 26, y: 110, width: 84, height: 14 }, 'blue'),
    s('path', { d: ells([[42, 52, 12, 6], [42, 104, 12, 6]]) }, 'white'),
    s('path', { d: 'M26 30h84M26 72h84M26 124h84', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 118, y: 92, width: 28, height: 44, rx: 8 }, 'green'),
    s('path', { d: 'M124 108h16', ...SW(4) }, 'dark', { stroke: true })
  ],
  'icónico': [
    ground(140),
    s('path', { d: 'M80 18L54 140h12l14-40 14 40h12z' }, 'gray', { accent: true }),
    s('path', { d: 'M62 104h36M68 70h24', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: star(124, 40, 16) }, 'yellow'),
    s('path', { d: sparkle(32, 46, 10) }, 'yellow'),
    s('path', { d: 'M80 18V8', ...SW(3) }, 'dark', { stroke: true })
  ],
  'implícitamente': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 8 }, 'sky'),
    s('rect', { x: 14, y: 60, width: 132, height: 86, rx: 8 }, 'navy'),
    s('path', { d: 'M60 60l12-26 14 10 10 16z' }, 'white', { accent: true }),
    s('path', { d: 'M48 60h64l18 40-26 36H56l-26-34z' }, 'blue'),
    s('path', { d: 'M14 60h132', ...SW(3) }, 'white', { stroke: true })
  ],
  incalculable: [
    s('rect', { x: 26, y: 78, width: 108, height: 62, rx: 6 }, 'brown'),
    s('path', { d: 'M26 78q0-32 54-32t54 32z' }, 'brown'),
    s('path', { d: 'M30 78q10-20 50-20t50 20z' }, 'yellow', { accent: true }),
    s('path', { d: 'M26 92h108M80 92v20', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M60 58l8-12h12l8 12-14 14z' }, 'sky'),
    s('path', { d: sparkle(36, 34, 10) + sparkle(124, 30, 12) + sparkle(100, 52, 6) }, 'yellow')
  ],
  incontrolable: [
    s('path', { d: 'M14 140q30-30 50-10t30-30q14-20-10-40t30-40q20-8 30 4', ...SW(8) }, 'green', { stroke: true, accent: true }),
    s('rect', { x: 118, y: 10, width: 18, height: 14, rx: 3, transform: 'rotate(30 127 17)' }, 'gray'),
    s('path', { d: 'M136 28q8 10 6 24M140 20q12 6 6 22M130 30q2 14-6 24', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: drop(28, 60, 5) + drop(120, 90, 5) + drop(50, 30, 4) }, 'sky'),
    s('path', { d: 'M96 40l-8-6M66 80l-10 2', ...SW(3) }, 'orange', { stroke: true })
  ],
  inculcar: [
    ...person(46, 136, 'navy', { h: 60, w: 34, r: 15 }),
    s('circle', { cx: 116, cy: 98, r: 14 }, 'skin'),
    s('rect', { x: 102, y: 114, width: 28, height: 22, rx: 8 }, 'green'),
    s('path', { d: 'M100 58h32l-12 22h-8z' }, 'gray'),
    s('circle', { cx: 116, cy: 36, r: 14 }, 'yellow', { accent: true }),
    s('rect', { x: 110, y: 48, width: 12, height: 8, rx: 2 }, 'gray'),
    s('path', { d: 'M62 60l38 2', ...SW(7) }, 'skin', { stroke: true })
  ],
  infringir: [
    ground(),
    s('rect', { x: 26, y: 20, width: 30, height: 70, rx: 8 }, 'dark'),
    s('circle', { cx: 41, cy: 38, r: 10 }, 'red', { accent: true }),
    s('path', { d: dots([[41, 56], [41, 74]], 8) }, 'gray'),
    s('path', { d: 'M41 90v46M66 136h80', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M72 112h70M72 124h70', ...SW(5, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    ...lean(104, 136, 12, 'blue')
  ],
  ingerir: [
    s('circle', { cx: 70, cy: 62, r: 34 }, 'skin'),
    s('path', { d: 'M52 146v-30q0-16 18-16t18 16v30z' }, 'blue'),
    s('path', { d: dots([[58, 54], [82, 54]], 4) }, 'dark'),
    s('ellipse', { cx: 70, cy: 80, rx: 9, ry: 7 }, 'dark'),
    s('rect', { x: 64, y: 26, width: 20, height: 10, rx: 5, transform: 'rotate(30 74 31)' }, 'red', { accent: true }),
    s('path', { d: 'M110 70h28l-4 50h-20z' }, 'sky'),
    s('path', { d: 'M110 70h28l-4 50h-20z', ...SW(2) }, 'gray', { stroke: true })
  ],
  inmoralidad: [
    ...person(80, 140, 'red', { h: 56, w: 36, r: 18 }),
    s('path', { d: 'M64 60l-8-22 16 12zM96 60l8-22-16 12z' }, 'dark', { accent: true }),
    s('path', { d: 'M70 60l8 4M90 60l-8 4M70 76q10 6 20-2', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M98 128q30 0 30-30l8-4-4 10', ...SW(4) }, 'dark', { stroke: true })
  ],
  interventor: [
    ...person(50, 136, 'navy', { h: 56, w: 34, r: 15 }),
    s('path', { d: 'M38 48h24l-4-10H42z' }, 'dark'),
    s('rect', { x: 84, y: 60, width: 46, height: 62, rx: 4 }, 'brown'),
    s('rect', { x: 90, y: 68, width: 34, height: 48 }, 'white'),
    s('path', { d: 'M96 80h22M96 92h22M96 104h14', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 108, cy: 46, r: 14 }, 'sky', { accent: true }),
    s('path', { d: ring(108, 46, 14) + 'M98 56l-14 14', ...SW(5) }, 'dark', { stroke: true })
  ],
  invalidez: [
    s('circle', { cx: 70, cy: 110, r: 28 }, 'gray', { accent: true }),
    s('circle', { cx: 70, cy: 110, r: 20 }, 'white'),
    s('path', { d: 'M50 22v10M50 40l10 50h40l16 46M60 66h30', ...SW(9) }, 'blue', { stroke: true }),
    s('circle', { cx: 120, cy: 132, r: 8 }, 'dark'),
    s('path', { d: ring(70, 110, 24), ...SW(3) }, 'dark', { stroke: true })
  ],
  irrumpir: [
    s('rect', { x: 18, y: 24, width: 40, height: 116 }, 'brown'),
    s('path', { d: 'M58 24l40 16v100l-40-6z' }, 'tan'),
    ...lean(100, 140, 22, 'orange', { accent: true }),
    s('path', { d: burst(66, 70, 30, 14, 8), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M126 64h16M124 80h20M128 96h14', ...SW(4) }, 'gray', { stroke: true })
  ],
  'látex': [
    s('path', { d: 'M58 146V96L40 56q-4-10 4-12t12 8l10 24V30q0-8 8-8t8 8v38V22q0-8 8-8t8 8v46-36q0-8 8-8t8 8v52l8-16q6-8 12-4t2 12l-20 40v30z' }, 'yellow', { accent: true }),
    s('path', { d: 'M58 132h52', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: drop(130, 136, 5) + drop(30, 110, 5) }, 'cream'),
    s('path', { d: drop(130, 136, 5) + drop(30, 110, 5), ...SW(2) }, 'gray', { stroke: true })
  ],
  maceta: [
    s('path', { d: 'M40 86h80l-10 56H50z' }, 'orange', { accent: true }),
    s('rect', { x: 34, y: 80, width: 92, height: 16, rx: 4 }, 'brown'),
    s('path', { d: 'M80 80V40', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 64, -150, 30, 10) + leaflet(80, 54, -30, 30, 10) }, 'green'),
    s('path', { d: dots([[80, 30], [70, 36], [90, 36], [74, 24], [86, 24]], 7) }, 'red'),
    s('circle', { cx: 80, cy: 30, r: 5 }, 'yellow')
  ],
  madrigal: [
    s('path', { d: busts([40, 80, 120], 146, 32, 44) }, 'navy'),
    s('path', { d: dots([[40, 88], [80, 88], [120, 88]], 14) }, 'skin'),
    s('path', { d: ells([[40, 96, 4, 5], [80, 96, 4, 5], [120, 96, 4, 5]]) }, 'dark'),
    s('path', { d: 'M20 126h120', ...SW(4) }, 'cream', { stroke: true }),
    ...note(52, 46, 'purple'),
    s('path', { d: ells([[104, 50, 8, 6]]) + 'M111 50v-28l12 6', ...SW(4) }, 'purple', { stroke: true })
  ],
  mantel: [
    s('path', { d: 'M18 50h124l-8 70H26z' }, 'white'),
    s('path', { d: checker(26, 50, 9, 5, 12) }, 'red', { accent: true }),
    s('path', { d: 'M18 50h124l-8 70H26z', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M40 120v24M120 120v24', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M62 40h36l-4 10H66z' }, 'gray')
  ],
  materialista: [
    ...person(80, 136, 'purple', { accent: true }),
    s('path', { d: 'M20 96h34v40H20zM106 96h34v40h-34z' }, 'pink'),
    s('path', { d: 'M28 96q0-14 9-14t9 14M114 96q0-14 9-14t9 14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 22l6-10h16l6 10-14 14z' }, 'sky'),
    s('path', { d: ells([[48, 30, 10, 10], [114, 34, 10, 10]]) }, 'yellow')
  ],
  'monografía': [
    s('rect', { x: 30, y: 16, width: 100, height: 128, rx: 4 }, 'navy'),
    s('rect', { x: 36, y: 22, width: 88, height: 116 }, 'white'),
    s('path', { d: ring(80, 70, 28), ...SW(5) }, 'blue', { stroke: true }),
    s('circle', { cx: 80, cy: 70, r: 12 }, 'orange', { accent: true }),
    s('path', { d: 'M48 114h64M48 126h44', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 16v128', ...SW(8) }, 'red', { stroke: true })
  ],
};
