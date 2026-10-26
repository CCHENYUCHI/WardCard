// Illustration specs for words still undrawn in batches 0102–0107 (see server/scripts/lexicon/art.js)
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
  tosco: [
    s('path', { d: 'M22 120l10-38 22-16 14-30 26 10 20-8 18 26 12 30-8 22-20 18H44z' }, 'brown', { accent: true }),
    s('path', { d: 'M54 66l10 18-12 16M94 46l-6 26 18 14M120 82l-16 20 6 18M70 112l14-10', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 132l-10 6M140 120l8 4M70 30l-4-10M124 50l8-8', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M18 140h124', ...SW(4) }, 'gray', { stroke: true })
  ],
  'pérsico': [
    s('rect', { x: 26, y: 24, width: 108, height: 112, rx: 4 }, 'red', { accent: true }),
    s('rect', { x: 36, y: 34, width: 88, height: 92, rx: 2 }, 'navy'),
    s('path', { d: 'M80 48l26 32-26 32-26-32z' }, 'yellow'),
    s('path', { d: 'M80 64l13 16-13 16-13-16z' }, 'red'),
    s('path', { d: dots([[46, 44], [114, 44], [46, 116], [114, 116]], 5) }, 'cream'),
    s('path', { d: 'M30 24v-8M42 24v-8M54 24v-8M66 24v-8M78 24v-8M90 24v-8M102 24v-8M114 24v-8M126 24v-8M30 136v8M42 136v8M54 136v8M66 136v8M78 136v8M90 136v8M102 136v8M114 136v8M126 136v8', ...SW(3) }, 'tan', { stroke: true })
  ],
  rasca: [
    ...person(96, 138, 'red', { accent: true }),
    s('path', { d: 'M82 92h28v8H82zM100 100h8v18h-8z' }, 'blue'),
    s('path', { d: 'M90 72l4 2M102 72l-4 2M90 84q6-4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M16 50q22-8 40 0M14 76q24-8 46 0M18 102q18-6 36 0', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: 'M76 70l-6 4M116 70l6 4M76 96l-6 0M118 96l6 0', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: sparkle(130, 30, 9) + sparkle(36, 128, 7) + sparkle(56, 28, 6) }, 'sky')
  ],
  rectitud: [
    ground(),
    s('path', { d: 'M80 14v122', ...DASH(3) }, 'gray', { stroke: true }),
    ...person(80, 136, 'blue', { accent: true, h: 54 }),
    s('rect', { x: 112, y: 26, width: 14, height: 110, rx: 2 }, 'yellow'),
    s('path', { d: 'M112 40h7M112 56h5M112 72h7M112 88h5M112 104h7M112 120h5', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 60l8 8 16-18', ...SW(6) }, 'green', { stroke: true })
  ],
  reducto: [
    backdrop('sky'),
    s('path', { d: 'M14 146q66-60 132 0z' }, 'green'),
    s('path', { d: 'M56 106V62h10v8h8v-8h12v8h8v-8h10v44z' }, 'gray', { accent: true }),
    s('path', { d: 'M74 106v-16a6 6 0 0 1 12 0v16z' }, 'dark'),
    s('path', { d: 'M80 62V34', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 34h20l-6 6 6 6H80z' }, 'red'),
    s('path', { d: 'M24 122l14-8M136 122l-14-8M30 140l12-12M130 140l-12-12', ...SW(4) }, 'orange', { stroke: true })
  ],
  regenerar: [
    ground(),
    s('path', { d: 'M56 136v-30h48v30z' }, 'brown'),
    s('ellipse', { cx: 80, cy: 106, rx: 24, ry: 7 }, 'tan'),
    s('path', { d: 'M80 104V74', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 82, -150, 26, 9) + leaflet(80, 76, -30, 26, 9) }, 'green', { accent: true }),
    s('path', { d: 'M36 58a46 46 0 0 1 84-16M124 102a46 46 0 0 1-2 12', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M126 30l-4 16-14-6z' }, 'orange')
  ],
  registrador: [
    s('rect', { x: 34, y: 22, width: 84, height: 116, rx: 6 }, 'brown'),
    s('rect', { x: 42, y: 34, width: 68, height: 96, rx: 2 }, 'white'),
    s('rect', { x: 60, y: 16, width: 32, height: 14, rx: 4 }, 'gray'),
    s('path', { d: 'M50 52l4 4 8-8M50 76l4 4 8-8M50 100l4 4 8-8', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M70 54h32M70 78h32M70 102h24', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M138 64l-30 52-6 10 2-12 30-52z' }, 'blue', { accent: true })
  ],
  'reinserción': [
    s('path', { d: busts([28, 56, 112, 140], 132, 22, 30) }, 'blue'),
    s('path', { d: dots([[28, 92], [56, 92], [112, 92], [140, 92]], 10) }, 'skin'),
    s('path', { d: busts([84], 132, 22, 30), ...DASH(3, '4 4') }, 'gray', { stroke: true }),
    s('path', { d: busts([84], 72, 22, 30) }, 'orange', { accent: true }),
    s('circle', { cx: 84, cy: 32, r: 10 }, 'skin'),
    s('path', { d: 'M84 76v14', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M76 88l8 10 8-10z' }, 'green')
  ],
  repunte: [
    s('path', { d: 'M22 26v110h118', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 60l22 22 18 10 18 22 14-18 30-50', ...SW(6) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M136 32l-4 22-16-12z' }, 'green'),
    s('circle', { cx: 88, cy: 114, r: 6 }, 'red'),
    s('path', { d: 'M40 136v-6M64 136v-6M88 136v-6M112 136v-6', ...SW(3) }, 'gray', { stroke: true })
  ],
  ringar: [
    ground(),
    s('rect', { x: 86, y: 118, width: 40, height: 18, rx: 3 }, 'tan'),
    s('path', { d: 'M58 104v32', ...SW(14) }, 'navy', { stroke: true }),
    s('path', { d: 'M56 98L94 108', ...SW(22) }, 'purple', { stroke: true, accent: true }),
    s('circle', { cx: 106, cy: 110, r: 10 }, 'skin'),
    s('path', { d: 'M90 112l6 8', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: burst(54, 84, 14, 6, 8) }, 'red'),
    s('path', { d: 'M100 108q4 4 8 2', ...SW(2) }, 'dark', { stroke: true })
  ],
  sionismo: [
    backdrop('sky'),
    s('circle', { cx: 122, cy: 38, r: 12 }, 'yellow'),
    s('path', { d: 'M14 146V108q66-46 132 0v38z' }, 'tan'),
    s('path', { d: 'M38 100V74h8v-6h8v6h8v-6h8v6h8v-6h8v6h8v-6h8v6h8v26z' }, 'cream', { accent: true }),
    s('path', { d: 'M72 100V86a8 8 0 0 1 16 0v14z' }, 'brown'),
    s('path', { d: 'M38 84h84', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M30 140q40-10 50-40', ...SW(4) }, 'brown', { stroke: true })
  ],
  subgrupo: [
    s('circle', { cx: 80, cy: 80, r: 64 }, 'mint'),
    s('path', { d: ring(80, 80, 64), ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots([[46, 56], [60, 116], [80, 36], [42, 92], [80, 128], [118, 40]], 8) }, 'blue'),
    s('circle', { cx: 100, cy: 92, r: 30 }, 'yellow', { accent: true }),
    s('path', { d: dots([[90, 82], [112, 86], [98, 106]], 8) }, 'red')
  ],
  sumergir: [
    s('rect', { x: 14, y: 56, width: 132, height: 90, rx: 6 }, 'blue'),
    s('path', { d: 'M14 56q11-8 22 0t22 0 22 0 22 0 22 0 22 0', ...SW(4) }, 'sky', { stroke: true }),
    s('circle', { cx: 80, cy: 112, r: 16 }, 'red', { accent: true }),
    s('path', { d: 'M80 22v38', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M70 56l10 14 10-14z' }, 'orange'),
    s('path', { d: dots([[104, 92], [112, 78], [100, 70]], 4) }, 'white')
  ],
  'teleférico': [
    backdrop('sky'),
    s('path', { d: 'M14 146l34-70 30 48 26-40 42 62z' }, 'green'),
    s('path', { d: 'M14 40l132 34', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 56v14', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 64, y: 70, width: 36, height: 32, rx: 6 }, 'red', { accent: true }),
    s('path', { d: rects([[70, 76, 10, 10], [84, 76, 10, 10]]) }, 'white')
  ],
  tendiente: [
    ground(),
    s('circle', { cx: 124, cy: 36, r: 16 }, 'yellow'),
    s('path', { d: rays(124, 36, 20, 28, 8) , ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M54 136q0-40 30-62', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(84, 74, -40, 30, 10) + leaflet(66, 100, 200, 22, 7) }, 'green', { accent: true }),
    s('path', { d: 'M38 136h32l-4-16H42z' }, 'orange'),
    s('path', { d: 'M90 96l18-24', ...DASH(3, '4 5') }, 'orange', { stroke: true })
  ],
  'teológico': [
    s('path', { d: halfRays(80, 70, 30, 54, 7), ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 52, r: 14 }, 'yellow'),
    ...openBook(80, 78, 'cream', 'navy'),
    s('path', { d: 'M80 30v-6M80 92v42', ...SW(3) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M40 98h28M40 108h28M92 98h28M92 108h28', ...SW(2) }, 'gray', { stroke: true })
  ],
  terna: [
    s('path', { d: 'M18 136h124', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: busts([40], 136, 30, 40) }, 'blue'),
    s('path', { d: busts([80], 136, 30, 40) }, 'orange', { accent: true }),
    s('path', { d: busts([120], 136, 30, 40) }, 'green'),
    s('path', { d: dots([[40, 82], [80, 82], [120, 82]], 13) }, 'skin'),
    s('path', { d: 'M24 46q56-36 112 0', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: star(40, 50, 7) + star(80, 34, 7) + star(120, 50, 7) }, 'yellow')
  ],
  triunfador: [
    s('path', { d: rects([[56, 104, 48, 34], [18, 118, 38, 20], [104, 124, 38, 14]]) }, 'gray'),
    s('rect', { x: 56, y: 104, width: 48, height: 34 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 50, r: 11 }, 'skin'),
    s('rect', { x: 68, y: 62, width: 24, height: 42, rx: 8 }, 'red'),
    s('path', { d: 'M70 66l-14-22M90 66l14-22', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(30, 40, 10) + sparkle(130, 40, 10) + sparkle(80, 22, 8) }, 'yellow')
  ],
  upar: [
    ground(),
    ...person(80, 136, 'blue', { accent: true, h: 50 }),
    s('path', { d: 'M68 92l-6-42M92 92l6-42', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 80, cy: 20, r: 9 }, 'skin'),
    s('rect', { x: 64, y: 28, width: 32, height: 22, rx: 10 }, 'pink'),
    s('path', { d: 'M76 20q4 3 8 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  velorio: [
    s('path', { d: 'M30 112l12-22h76l12 22-12 22H42z' }, 'brown', { accent: true }),
    s('path', { d: 'M44 104h72', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: rects([[24, 58, 10, 32], [126, 58, 10, 32]]) }, 'cream'),
    s('path', { d: drop(29, 48, 5) + drop(131, 48, 5) }, 'orange'),
    s('path', { d: 'M16 90h26M118 90h26', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[72, 86], [80, 82], [88, 86]], 6) }, 'pink'),
    s('path', { d: 'M54 34q26-14 52 0', ...SW(3) }, 'navy', { stroke: true })
  ],
  verticalmente: [
    s('path', { d: 'M40 20v120M120 20v120', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 38v84', ...SW(8) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M64 42l16-24 16 24zM64 118l16 24 16-24z' }, 'blue'),
    s('path', { d: 'M28 40h24M28 120h24M108 40h24M108 120h24', ...SW(3) }, 'orange', { stroke: true })
  ],
  'viático': [
    s('rect', { x: 28, y: 60, width: 88, height: 70, rx: 8 }, 'brown', { accent: true }),
    s('path', { d: 'M56 60v-14h32v14', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 90h88', ...SW(4) }, 'tan', { stroke: true }),
    s('rect', { x: 92, y: 26, width: 46, height: 26, rx: 3, transform: 'rotate(-15 115 39)' }, 'green'),
    s('circle', { cx: 115, cy: 39, r: 7 }, 'mint'),
    s('path', { d: dots([[128, 108], [136, 124], [120, 124]], 9) }, 'yellow'),
    s('path', { d: 'M36 136v4M108 136v4', ...SW(6) }, 'dark', { stroke: true })
  ],
  'vulneración': [
    s('path', { d: 'M74 24l44 16v34q0 40-44 60q-44-20-44-60V40z' }, 'blue', { accent: true }),
    s('path', { d: 'M74 40l-8 22 14 10-10 24', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M146 34l-56 50', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M92 72l-6 16 16-6z' }, 'gray'),
    s('path', { d: 'M140 26l10 2-2 10-10-2zM132 34l8 0-4 8z' }, 'red'),
    s('path', { d: burst(88, 86, 14, 6, 8) }, 'orange')
  ],
  agroindustria: [
    ground(),
    s('path', { d: 'M24 136V78l24 14V78l24 14V78l24 14v44z' }, 'gray'),
    s('path', { d: rects([[100, 46, 14, 90], [120, 60, 12, 76]]) }, 'dark'),
    s('path', { d: 'M107 40q-6-10 6-14q10-8 18-2', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: rects([[34, 104, 12, 10], [58, 104, 12, 10], [82, 104, 12, 10]]) }, 'sky'),
    s('path', { d: 'M28 136v-24M40 136v-20M52 136v-24M64 136v-20M76 136v-24', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: ells([[28, 108, 3, 7], [40, 112, 3, 7], [52, 108, 3, 7], [64, 112, 3, 7], [76, 108, 3, 7]]) }, 'yellow', { accent: true })
  ],
  aguayo: [
    s('rect', { x: 24, y: 24, width: 112, height: 112, rx: 4 }, 'red', { accent: true }),
    s('path', { d: rects([[24, 40, 112, 8], [24, 112, 112, 8]]) }, 'green'),
    s('path', { d: rects([[24, 52, 112, 6], [24, 102, 112, 6]]) }, 'yellow'),
    s('path', { d: rects([[24, 62, 112, 36]]) }, 'purple'),
    s('path', { d: 'M40 80l8-10 8 10-8 10zM72 80l8-10 8 10-8 10zM104 80l8-10 8 10-8 10z' }, 'orange'),
    s('path', { d: rects([[24, 28, 112, 6], [24, 126, 112, 6]]) }, 'pink')
  ],
  argelino: [
    backdrop('sky'),
    s('circle', { cx: 116, cy: 40, r: 14 }, 'yellow'),
    s('path', { d: 'M14 146v-30q40-24 74 0q30-18 58 0v30z' }, 'tan', { accent: true }),
    s('path', { d: 'M52 116q-2-36 4-56', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(56, 60, 200, 26, 7) + leaflet(56, 60, 240, 22, 6) + leaflet(56, 60, -20, 26, 7) + leaflet(56, 60, 300, 22, 6) }, 'green'),
    s('path', { d: 'M96 128q12-10 24 0', ...SW(3) }, 'orange', { stroke: true })
  ],
  automovilismo: [
    s('path', { d: 'M18 120h124', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M26 106l10-14h30l12-12h22l8 12h28l6 14z' }, 'red', { accent: true }),
    s('path', { d: dots([[46, 108], [118, 108]], 12) }, 'dark'),
    s('path', { d: 'M86 82h14l4 10H82z' }, 'sky'),
    s('path', { d: 'M14 78h18M10 92h16M18 106h8', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M118 24v56', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 118, y: 24, width: 28, height: 20 }, 'white'),
    s('path', { d: rects([[118, 24, 7, 5], [132, 24, 7, 5], [125, 29, 7, 5], [139, 29, 7, 5], [118, 34, 7, 5], [132, 34, 7, 5], [125, 39, 7, 5], [139, 39, 7, 5]]) }, 'black')
  ],
  autosuficiente: [
    ground(),
    s('path', { d: 'M28 136V82l36-30 36 30v54z' }, 'cream'),
    s('path', { d: 'M20 86l44-40 44 40', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M40 60l16-14 16 14-6 6-10-8-10 8z' }, 'navy', { accent: true }),
    s('rect', { x: 54, y: 106, width: 18, height: 30, rx: 2 }, 'brown'),
    s('path', { d: 'M112 136v-16M124 136v-20M136 136v-16', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: ells([[112, 116, 6, 8], [124, 112, 6, 8], [136, 116, 6, 8]]) }, 'green'),
    s('circle', { cx: 128, cy: 34, r: 12 }, 'yellow')
  ],
  barbudo: [
    s('circle', { cx: 80, cy: 64, r: 40 }, 'skin'),
    s('path', { d: 'M40 64q0 74 40 76q40-2 40-76q-10 22-40 22t-40-22z' }, 'brown', { accent: true }),
    s('path', { d: 'M42 52q4-34 38-34t38 34q-14-12-38-12t-38 12z' }, 'brown'),
    s('path', { d: dots([[66, 62], [94, 62]], 4) }, 'dark'),
    s('path', { d: 'M64 92q16-8 32 0q-16 8-32 0z' }, 'tan'),
    s('ellipse', { cx: 80, cy: 98, rx: 6, ry: 3 }, 'pink')
  ],
  'barómetro': [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'brown', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 50 }, 'cream'),
    s('path', { d: halfRays(80, 84, 38, 46, 9), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 84L106 56', ...SW(4) }, 'red', { stroke: true }),
    s('circle', { cx: 80, cy: 84, r: 6 }, 'dark'),
    s('path', { d: ells([[56, 108, 10, 6], [66, 104, 8, 7]]) }, 'gray'),
    s('circle', { cx: 104, cy: 108, r: 8 }, 'yellow')
  ],
  berenjena: [
    s('path', { d: 'M96 44q30 10 22 52q-8 42-44 46q-36 0-34-30q2-24 26-36q14-8 16-26q4-12 14-6z' }, 'purple', { accent: true }),
    s('path', { d: 'M82 38q8-12 22-6q10 4 6 18q-10-6-16-2q-8-2-12-10z' }, 'green'),
    s('path', { d: 'M96 32l8-16', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M54 100q2-14 14-20', ...SW(5) }, 'pink', { stroke: true })
  ],
  biosfera: [
    s('circle', { cx: 80, cy: 82, r: 54 }, 'blue', { accent: true }),
    s('path', { d: 'M44 54q16-10 26 2q6 14-6 22q-4 14-14 12q-14-12-6-36zM92 46q20 2 30 18q4 18-8 20q-10-10-18-6q-12-14-4-32zM84 108q14-6 24 4q-4 14-18 12z' }, 'green'),
    s('path', { d: leaflet(116, 30, -40, 30, 10) }, 'green'),
    s('path', { d: birds([[34, 26], [56, 18]]), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: fishes([[64, 128]]) }, 'orange'),
    s('path', { d: ring(80, 82, 64), ...DASH(3, '6 8') }, 'mint', { stroke: true })
  ],
  bolero: [
    s('path', { d: 'M50 40q30 12 60 0l10 50-14 6-8-30v-2l-18 12-18-12v2l-8 30-14-6z' }, 'red', { accent: true }),
    s('path', { d: 'M62 46q18 8 36 0v66H62z' }, 'white'),
    s('path', { d: 'M62 46q18 8 36 0v66H62z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 44q-4 30 10 50M108 44q4 30-10 50', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[58, 98], [102, 98], [56, 76], [104, 76]], 6) }, 'yellow'),
    ...note(128, 124, 'navy')
  ],
  canibalismo: [
    s('rect', { x: 14, y: 20, width: 132, height: 120, rx: 12 }, 'sky'),
    s('path', { d: 'M24 82q30-40 74-14l-22 14 22 14q-44 26-74-14z' }, 'green', { accent: true }),
    s('path', { d: 'M24 82l-10-12v24z' }, 'green'),
    s('circle', { cx: 52, cy: 72, r: 5 }, 'dark'),
    s('path', { d: ells([[118, 82, 14, 8]]) + 'M130 82l10-8v16z' }, 'green'),
    s('path', { d: 'M116 79a2 2 0 1 0 0.1 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[110, 46], [96, 38], [116, 120]], 4) }, 'white')
  ],
  capilar: [
    s('circle', { cx: 80, cy: 80, r: 64 }, 'pink'),
    s('path', { d: 'M20 60q30 10 50 20t40-6 36-4M70 80q4 24 30 34t40 4M54 72q-8 24-28 40M108 74q10-20 4-46M100 114q-10 14-6 30', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M84 100q14-6 24 4M40 48q6 8 18 6M124 44q8 14 18 14', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: ring(80, 80, 64), ...SW(4) }, 'gray', { stroke: true })
  ],
  carabina: [
    s('path', { d: 'M18 98l40-8 6-12h62v12h20v8H70l-18 8-6 18-20 4z' }, 'brown', { accent: true }),
    s('path', { d: 'M64 78h82v12H64z' }, 'dark'),
    s('path', { d: 'M74 90v12q4 6 10 0v-8', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 90, y: 70, width: 22, height: 8, rx: 2 }, 'gray')
  ],
  centralista: [
    s('path', { d: dots(around(80, 80, 54, 6, -90), 10) }, 'blue'),
    s('path', { d: around(80, 80, 40, 6, -90).map(([x, y]) => `M${x} ${y}L${(80 + (x - 80) * 0.6).toFixed(1)} ${(80 + (y - 80) * 0.6).toFixed(1)}`).join(''), ...SW(5) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 18 }, 'red', { accent: true }),
    s('path', { d: 'M70 86V76l10-8 10 8v10z' }, 'yellow')
  ],
  'chamán': [
    ground(),
    s('path', { d: 'M30 136l14-18 14 18M36 136l8-8 8 8' }, 'brown'),
    s('path', { d: 'M44 126q-10-14 0-24q4 10 8 4q6 12-8 20z' }, 'orange'),
    ...person(104, 136, 'green', { accent: true }),
    s('path', { d: 'M92 64l12-22 12 22', ...SW(4) }, 'red', { stroke: true }),
    s('ellipse', { cx: 76, cy: 102, rx: 12, ry: 16 }, 'tan'),
    s('path', { d: 'M44 94q-10-14 2-28t-2-30M60 86q8-14 0-30', ...SW(3) }, 'gray', { stroke: true })
  ],
  chango: [
    s('path', { d: 'M14 34q60 10 132-6', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M66 36q-4 30 4 44M98 36q4 30-4 44M76 120q-26 10-14 26', ...SW(7) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 82, cy: 100, rx: 22, ry: 26 }, 'brown', { accent: true }),
    s('path', { d: dots([[60, 64], [104, 64]], 9) }, 'tan'),
    s('circle', { cx: 82, cy: 66, r: 20 }, 'brown'),
    s('ellipse', { cx: 82, cy: 72, rx: 14, ry: 11 }, 'tan'),
    s('path', { d: dots([[76, 62], [88, 62]], 3) }, 'dark'),
    s('path', { d: 'M76 76q6 4 12 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  'cibernético': [
    s('rect', { x: 22, y: 28, width: 116, height: 82, rx: 8 }, 'dark'),
    s('rect', { x: 30, y: 36, width: 100, height: 66, rx: 3 }, 'navy'),
    s('path', { d: 'M40 50h24v20h24M120 56h-20v30H70M44 92h16v-10', ...SW(3) }, 'mint', { stroke: true, accent: true }),
    s('path', { d: dots([[40, 50], [88, 70], [120, 56], [70, 86], [44, 92], [60, 82]], 4) }, 'mint'),
    s('path', { d: 'M68 110l-4 18h32l-4-18z' }, 'gray'),
    s('rect', { x: 50, y: 126, width: 60, height: 8, rx: 3 }, 'gray')
  ],
  coleta: [
    s('circle', { cx: 74, cy: 74, r: 44 }, 'brown', { accent: true }),
    s('path', { d: 'M114 70q30 4 26 40q-4 26-18 32q4-24-6-40q-6-14-6-28z' }, 'brown'),
    s('rect', { x: 108, y: 62, width: 12, height: 20, rx: 4, transform: 'rotate(-20 114 72)' }, 'pink'),
    s('path', { d: 'M46 50q24-18 52-6M42 74q30-10 60 0', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M54 112q20 10 40 0v24H54z' }, 'skin')
  ],
  compi: [
    ground(),
    ...person(48, 136, 'orange', { accent: true }),
    ...person(112, 136, 'blue'),
    s('path', { d: 'M60 100l18-46M100 100l-18-46', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M80 44v-14M68 46l-8-10M92 46l8-10', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M42 66q6 4 12 0M106 66q6 4 12 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  compuerta: [
    s('path', { d: 'M14 30h30v110H14zM116 30h30v110h-30z' }, 'gray'),
    s('rect', { x: 14, y: 60, width: 132, height: 80 }, 'sky'),
    s('rect', { x: 44, y: 26, width: 72, height: 80, rx: 2 }, 'brown', { accent: true }),
    s('path', { d: 'M44 46h72M44 66h72M44 86h72', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M50 112q10 10 20 0t20 0 20 0M50 126q10 10 20 0t20 0 20 0', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M80 26V14M66 14h28', ...SW(5) }, 'dark', { stroke: true })
  ],
  confluir: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'mint'),
    s('path', { d: 'M28 18q8 50 46 74M132 18q-8 50-46 74', ...SW(14) }, 'blue', { stroke: true }),
    s('path', { d: 'M80 88v56', ...SW(24) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M80 104v22', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: ells([[30, 108, 10, 12], [130, 108, 10, 12], [46, 132, 8, 8]]) }, 'green')
  ],
  congruencia: [
    s('path', { d: 'M18 116l30-64 30 64z' }, 'green', { accent: true }),
    s('path', { d: 'M82 116l30-64 30 64z' }, 'green'),
    s('path', { d: 'M18 130h60M82 130h60', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 80l8 6M60 80l-8 6M92 80l8 6M124 80l-8 6', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M62 30l10 10 22-22', ...SW(7) }, 'blue', { stroke: true })
  ],
  coraza: [
    s('path', { d: 'M40 30q40 16 80 0l14 22-12 16v58q-42 22-84 0V68L26 52z' }, 'gray', { accent: true }),
    s('path', { d: 'M56 34q24 20 48 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 48v80M50 76q30 10 60 0M48 104q32 10 64 0', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: dots([[44, 62], [116, 62], [46, 118], [114, 118]], 4) }, 'yellow'),
    s('path', { d: 'M26 52l14-22M134 52l-14-22', ...SW(4) }, 'brown', { stroke: true })
  ],
  criador: [
    ground(),
    ...person(48, 136, 'green', { accent: true, h: 50 }),
    s('path', { d: 'M60 96l20 8', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: dots([[86, 112], [92, 118], [82, 120]], 2) }, 'orange'),
    s('path', { d: ells([[108, 124, 12, 10], [134, 126, 11, 9]]) }, 'yellow'),
    s('path', { d: dots([[100, 110], [126, 114]], 8) }, 'yellow'),
    s('path', { d: 'M92 110l-5 2 5 2zM118 114l-5 2 5 2', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: dots([[98, 108], [124, 112]], 1.6) }, 'dark')
  ],
  discrepar: [
    ...person(36, 138, 'blue'),
    ...person(124, 138, 'orange', { accent: true }),
    s('path', { d: bubble(14, 18, 46, 32) }, 'sky'),
    s('path', { d: 'M146 18H108a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h24l12 12v-12a8 8 0 0 0 8-8V26a8 8 0 0 0-6-8z' }, 'pink'),
    s('circle', { cx: 37, cy: 34, r: 8 }, 'blue'),
    s('path', { d: 'M118 42l8-14 8 14z' }, 'red'),
    s('path', { d: 'M74 70l12 14-10 6 12 16', ...SW(5) }, 'yellow', { stroke: true })
  ],
  egreso: [
    s('rect', { x: 18, y: 60, width: 78, height: 60, rx: 10 }, 'brown', { accent: true }),
    s('path', { d: 'M70 76h26v28H70a14 14 0 0 1 0-28z' }, 'tan'),
    s('circle', { cx: 74, cy: 90, r: 5 }, 'dark'),
    s('path', { d: dots([[114, 64], [132, 44], [122, 96]], 10) }, 'yellow'),
    s('path', { d: 'M98 84l40 0', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M136 76l10 8-10 8z' }, 'red'),
    s('path', { d: 'M100 60l6-6M106 104l6 6', ...SW(3) }, 'gray', { stroke: true })
  ],
  embotellado: [
    s('rect', { x: 14, y: 122, width: 132, height: 12, rx: 6 }, 'dark'),
    s('path', { d: 'M64 14h32v14l-8 10h-16l-8-10z' }, 'gray'),
    s('path', { d: 'M80 40v22', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M26 122V88q0-8 6-12V64h8v12q6 4 6 12v34zM70 122V88q0-8 6-12V64h8v12q6 4 6 12v34zM114 122V88q0-8 6-12V64h8v12q6 4 6 12v34z' }, 'green'),
    s('path', { d: 'M26 122V96h20v26zM70 122V104h20v18z' }, 'blue', { accent: true }),
    s('path', { d: 'M30 140h0M60 140h0M100 140h0M130 140h0', ...SW(6) }, 'gray', { stroke: true })
  ],
  'empeñar': [
    s('rect', { x: 14, y: 96, width: 132, height: 14, rx: 3 }, 'brown'),
    s('path', { d: ring(46, 74, 14), ...SW(6) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M40 56l6-8 6 8-6 6z' }, 'sky'),
    s('path', { d: dots([[114, 84], [126, 74], [110, 66]], 9) }, 'yellow'),
    s('path', { d: 'M66 56q14-14 28 0M94 92q-14 14-28 0', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M90 50l6 8-10 2zM70 98l-6-8 10-2z' }, 'orange'),
    s('path', { d: 'M24 110v30M136 110v30', ...SW(6) }, 'brown', { stroke: true })
  ],
  enamoramiento: [
    ...face(80, 92, 46, 'skin', 'smile'),
    s('path', { d: heart(62, 76, 9) + heart(98, 76, 9) }, 'red', { accent: true }),
    s('path', { d: heart(40, 30, 10) + heart(122, 24, 8) + heart(132, 56, 6) }, 'pink'),
    s('path', { d: dots([[52, 104], [108, 104]], 6) }, 'pink')
  ],
  enmascarado: [
    s('circle', { cx: 80, cy: 82, r: 50 }, 'skin'),
    s('path', { d: 'M30 72q50-50 100 0q-50-16-100 0z' }, 'dark'),
    s('path', { d: 'M28 70q52-14 104 0v18q-14 10-28 0h-48q-14 10-28 0z' }, 'black', { accent: true }),
    s('path', { d: ells([[60, 80, 8, 5], [100, 80, 8, 5]]) }, 'white'),
    s('path', { d: 'M132 74q10 -2 14 8M28 74q-10-2-14 8', ...SW(4) }, 'black', { stroke: true }),
    s('path', { d: 'M66 110q14 6 28 0', ...SW(4) }, 'dark', { stroke: true })
  ],
  enseres: [
    s('path', { d: 'M28 92h104v48H28z' }, 'tan', { accent: true }),
    s('path', { d: 'M28 92l-12 14M132 92l12 14', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 92V50h20v42M40 70h20M44 92V80M56 92V80', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 92V52M88 50h24l-6-20h-12z', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M88 50h24l-6-20h-12z' }, 'yellow'),
    s('path', { d: 'M66 92V78h22v14z' }, 'red'),
    s('path', { d: 'M28 112h104', ...SW(3) }, 'brown', { stroke: true })
  ],
  'entonación': [
    s('path', { d: HEAD, transform: 'translate(-14 0)' }, 'skin'),
    s('path', { d: 'M110 92q-6 4-12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 92, cy: 62, r: 4 }, 'dark'),
    s('path', { d: 'M118 92q6-30 12-4t8 0', ...SW(5) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M118 112q6-16 12 0t10-6', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M114 72q8-10 16-4', ...SW(4) }, 'blue', { stroke: true })
  ],
  'enésimo': [
    s('path', { d: dots([[22, 120], [42, 120], [62, 120], [82, 120], [102, 120]], 7) }, 'gray'),
    s('path', { d: dots([[116, 120], [124, 120], [132, 120]], 2.5) }, 'dark'),
    s('path', { d: 'M48 70a32 32 0 1 1 32 32', ...SW(7) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M38 66l10 14 12-14z' }, 'blue'),
    s('path', { d: 'M70 102l10-8v16z' }, 'blue'),
    s('path', { d: star(80, 70, 12) }, 'yellow')
  ],
  epidermis: [
    s('rect', { x: 18, y: 40, width: 124, height: 100, rx: 6 }, 'pink'),
    s('path', { d: 'M18 52q16-8 31 0t31 0 31 0 31 0v-12H18z' }, 'skin', { accent: true }),
    s('path', { d: 'M18 52q16-8 31 0t31 0 31 0 31 0', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 18, y: 104, width: 124, height: 36 }, 'cream'),
    s('path', { d: 'M60 52V18M60 52q-4 30 4 50', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M90 70q14 10 4 24t10 28M120 70q-10 20 6 34', ...SW(3) }, 'red', { stroke: true }),
    s('ellipse', { cx: 64, cy: 104, rx: 6, ry: 5 }, 'tan')
  ],
  esbozo: [
    s('path', { d: 'M54 128l26-112 26 112M80 120v24', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 30, y: 30, width: 100, height: 76, rx: 2 }, 'white'),
    outline({ x: 30, y: 30, width: 100, height: 76, rx: 2 }),
    s('path', { d: 'M54 92V64l26-20 26 20v28zM70 92V76h12v16', ...DASH(3, '5 4') }, 'dark', { stroke: true }),
    s('path', { d: 'M134 40l-26 46-4 10 8-6 26-46z' }, 'orange', { accent: true }),
    s('path', { d: 'M24 106h112', ...SW(5) }, 'brown', { stroke: true })
  ],
  estampilla: [
    s('rect', { x: 34, y: 28, width: 92, height: 104 }, 'white'),
    s('rect', { x: 34, y: 28, width: 92, height: 104, ...DASH(6, '0 10') }, 'gray', { stroke: true }),
    s('rect', { x: 46, y: 40, width: 68, height: 70, rx: 2 }, 'sky'),
    s('path', { d: 'M46 110l20-30 14 18 12-12 22 24z' }, 'green'),
    s('circle', { cx: 98, cy: 56, r: 8 }, 'yellow'),
    s('path', { d: 'M54 120h52', ...SW(4) }, 'red', { stroke: true, accent: true })
  ],
  estival: [
    s('rect', { x: 14, y: 14, width: 132, height: 92, rx: 10 }, 'sky'),
    s('path', { d: 'M14 100h132v36a10 10 0 0 1-10 10H24a10 10 0 0 1-10-10z' }, 'tan'),
    s('circle', { cx: 116, cy: 42, r: 16 }, 'yellow', { accent: true }),
    s('path', { d: rays(116, 42, 22, 30, 8), ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M24 72q30-34 62 0z' }, 'red'),
    s('path', { d: 'M55 70l12 62', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 104q16-8 33 0t33 0 33 0 33 0', ...SW(4) }, 'blue', { stroke: true })
  ],
  estofado: [
    s('path', { d: 'M24 72h112q0 64-56 64t-56-64z' }, 'dark', { accent: true }),
    s('path', { d: 'M16 78h16M128 78h16', ...SW(7) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 80, cy: 72, rx: 56, ry: 10 }, 'brown'),
    s('path', { d: rects([[46, 66, 12, 8], [88, 64, 12, 8]]) }, 'red'),
    s('path', { d: dots([[70, 70], [112, 72]], 5) }, 'orange'),
    s('path', { d: 'M56 52q-8-12 0-24M80 50q-8-12 0-26M104 52q-8-12 0-24', ...SW(4) }, 'gray', { stroke: true })
  ],
  'esófago': [
    s('path', { d: 'M40 146V96q0-22 22-26V54a18 18 0 0 1 36 0v16q22 4 22 26v50z' }, 'cream'),
    s('path', { d: 'M40 146V96q0-22 22-26V54a18 18 0 0 1 36 0v16q22 4 22 26v50', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 54v56', ...SW(9) }, 'pink', { stroke: true, accent: true }),
    s('path', { d: 'M72 108q-8 26 18 28q22-2 16-22q-4-10-26-6z' }, 'pink'),
    s('circle', { cx: 80, cy: 72, r: 5 }, 'orange'),
    s('path', { d: 'M80 84v14', ...SW(3) }, 'red', { stroke: true })
  ],
  eventualidad: [
    s('path', { d: 'M30 64a18 18 0 0 1 22-24a24 24 0 0 1 44-2a18 18 0 0 1 20 26z' }, 'gray'),
    s('path', { d: 'M46 76l-4 10M66 76l-4 10M86 76l-4 10M106 76l-4 10', ...DASH(3, '4 4') }, 'blue', { stroke: true }),
    ...person(56, 140, 'green'),
    s('path', { d: 'M86 98q24-28 48 0z' }, 'red', { accent: true }),
    s('path', { d: 'M110 98v28q0 6-6 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M68 104l38 0', ...SW(6) }, 'skin', { stroke: true })
  ],
  expatriado: [
    s('path', { d: 'M18 72l20-18 20 18v32H18z' }, 'red'),
    s('rect', { x: 30, y: 86, width: 12, height: 18 }, 'brown'),
    s('path', { d: 'M18 132h124', ...SW(4) }, 'gray', { stroke: true }),
    ...person(80, 132, 'blue', { accent: true, h: 40 }),
    s('rect', { x: 94, y: 104, width: 22, height: 26, rx: 4 }, 'orange'),
    s('path', { d: 'M100 104v-6h10v6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: jet(126, 50), transform: 'rotate(60 126 50)' }, 'gray'),
    s('path', { d: 'M62 42q20-20 46-6', ...DASH(3, '4 5') }, 'gray', { stroke: true })
  ],
  'extremeño': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'cream'),
    s('path', { d: 'M14 112h132v22a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'tan'),
    ...scaled(tree(80, 'green', 'brown'), 0.6, 4, 54),
    s('rect', { x: 104, y: 40, width: 18, height: 72 }, 'brown'),
    s('path', { d: 'M100 40h26l-4-8h-18z' }, 'dark'),
    s('path', { d: 'M104 32q0-14 12-12l4 4-6 4q4 6-2 6z' }, 'white', { accent: true }),
    s('path', { d: 'M120 24l12 2', ...SW(3) }, 'orange', { stroke: true })
  ],
  falsar: [
    s('rect', { x: 30, y: 22, width: 76, height: 100, rx: 3 }, 'white'),
    outline({ x: 30, y: 22, width: 76, height: 100, rx: 3 }),
    s('path', { d: 'M42 42h52M42 56h52M42 70h40M44 104q8-10 14 0t14-2', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M68 96q22-12 44 0q8 20-22 32q-30-12-22-32z' }, 'purple', { accent: true }),
    s('path', { d: 'M78 100l8 4M100 100l-8 4', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M138 40l-22 44-4 8 8-4 22-44z' }, 'blue')
  ],
  'fecundación': [
    s('circle', { cx: 92, cy: 84, r: 44 }, 'pink', { accent: true }),
    s('circle', { cx: 92, cy: 84, r: 36 }, 'cream'),
    s('circle', { cx: 98, cy: 80, r: 12 }, 'pink'),
    s('path', { d: ells([[42, 72, 7, 5], [36, 102, 7, 5], [50, 44, 7, 5]]) }, 'sky'),
    s('path', { d: 'M35 72q-8-6-14 0t-8 0M29 102q-8 6-14 0M43 44q-8-6-14 0t-8 0', ...SW(3) }, 'sky', { stroke: true })
  ],
  filamento: [
    s('path', { d: 'M80 16a40 40 0 0 1 24 72q-4 4-4 12H60q0-8-4-12a40 40 0 0 1 24-72z' }, 'yellow', { accent: true }),
    s('path', { d: 'M70 100V72M90 100V72M70 72q2-10 5 0q3-10 5 0q3-10 5 0q3-10 5 0', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M60 100h40v10H60zM62 112h36v10H62z' }, 'gray'),
    s('path', { d: 'M70 124h20l-4 8h-12z' }, 'dark'),
    s('path', { d: halfRays(80, 56, 48, 58, 5), ...SW(3) }, 'yellow', { stroke: true })
  ],
  'finlandés': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 100h132v34a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'blue'),
    s('path', { d: 'M30 104l12-40 12 40zM50 104l14-56 14 56zM96 104l12-44 12 44zM118 104l10-30 10 30z' }, 'green', { accent: true }),
    s('path', { d: 'M42 104v6M64 104v6M108 104v6', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M34 124h20M80 118h32M104 134h24', ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 116, cy: 32, r: 9 }, 'cream')
  ],
  fraternal: [
    ground(),
    ...person(60, 136, 'blue', { accent: true }),
    ...person(100, 136, 'blue'),
    s('path', { d: 'M66 96q14-16 28-4M94 96q-14-16-28-4', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 22, 14) }, 'red'),
    s('path', { d: 'M54 66q6 4 12 0M94 66q6 4 12 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  fregadero: [
    s('rect', { x: 14, y: 82, width: 132, height: 58, rx: 4 }, 'tan'),
    s('path', { d: 'M30 82h84l-6 28H36z' }, 'gray', { accent: true }),
    s('path', { d: 'M96 82V50q0-10-12-10h-8v10', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M76 52v14', ...DASH(3, '4 4') }, 'blue', { stroke: true }),
    s('ellipse', { cx: 58, cy: 78, rx: 18, ry: 6 }, 'white'),
    s('ellipse', { cx: 58, cy: 78, rx: 18, ry: 6, ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M126 82V56h12v26z' }, 'green'),
    s('path', { d: 'M14 120h132', ...SW(3) }, 'brown', { stroke: true })
  ],
  fundamentalista: [
    ground(),
    ...person(54, 136, 'navy'),
    s('rect', { x: 70, y: 70, width: 40, height: 52, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: 'M74 70v52', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M62 96l10 0M62 108l10 0', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M90 58a10 10 0 0 1 20 0v14', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 86, y: 70, width: 28, height: 22, rx: 3 }, 'yellow'),
    s('path', { d: 'M118 36l10-10M130 52h12M30 40l-10-10', ...SW(4) }, 'orange', { stroke: true })
  ],
  gasoducto: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'mint'),
    s('path', { d: 'M14 112h132', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M14 84h132', ...SW(16) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: 'M40 92v20M84 92v20M128 92v20', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 74v20M100 74v20', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M78 60q-12-12 0-30q4 10 8 6q10 12-8 24z' }, 'blue'),
    s('path', { d: 'M80 56q-4-6 0-12q4 6 2 12z' }, 'sky')
  ],
  'generalísimo': [
    s('path', { d: 'M30 92q-4-40 50-48q54 8 50 48z' }, 'navy', { accent: true }),
    s('rect', { x: 26, y: 88, width: 108, height: 16, rx: 4 }, 'yellow'),
    s('path', { d: 'M38 104q42 26 84 0z' }, 'black'),
    s('path', { d: star(60, 70, 8) + star(80, 64, 9) + star(100, 70, 8) }, 'yellow'),
    s('path', { d: laurel(80, 82, 62, 14, 4) }, 'green')
  ],
  granel: [
    s('path', { d: 'M18 136l8-48h44l8 48zM82 136l8-48h44l8 48z' }, 'brown'),
    s('path', { d: 'M24 92q24-36 48 0zM88 92q24-30 48 0z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[40, 82], [50, 74], [58, 84], [100, 84], [112, 76], [122, 86]], 3) }, 'orange'),
    s('path', { d: 'M104 54l26-24', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M88 54q8 18 24 6l-8-14z' }, 'gray'),
    s('path', { d: 'M18 140h124', ...SW(4) }, 'gray', { stroke: true })
  ],
  'hiperinflación': [
    ground(),
    s('path', { d: 'M24 104h70l-8 22H34z' }, 'gray'),
    s('path', { d: dots([[38, 128], [82, 128]], 8) }, 'dark'),
    s('path', { d: rects([[30, 88, 30, 16], [62, 88, 30, 16], [36, 72, 30, 16], [64, 72, 26, 16], [44, 56, 30, 16]]) }, 'green', { accent: true }),
    s('path', { d: 'M94 106l26-10', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 46q20-14 34 2v12h-34z' }, 'tan'),
    s('path', { d: 'M126 40l12-20', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M130 18l12 0-4 12z' }, 'red')
  ],
  identificador: [
    s('rect', { x: 16, y: 36, width: 128, height: 88, rx: 10 }, 'sky', { accent: true }),
    s('rect', { x: 26, y: 50, width: 40, height: 50, rx: 4 }, 'white'),
    s('circle', { cx: 46, cy: 68, r: 9 }, 'skin'),
    s('path', { d: busts([46], 100, 26, 18) }, 'blue'),
    s('path', { d: 'M76 56h56M76 70h40M76 84h48', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: 'M78 98v16M84 98v16M88 98v16M94 98v16M100 98v16M104 98v16M110 98v16M116 98v16M122 98v16M128 98v16', ...SW(2) }, 'dark', { stroke: true })
  ],
  ilusionado: [
    ...face(70, 92, 44, 'skin', 'smile'),
    s('path', { d: sparkle(56, 84, 8) + sparkle(84, 84, 8) }, 'yellow'),
    s('path', { d: star(124, 34, 18) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(96, 24, 7) + sparkle(142, 66, 6) }, 'orange'),
    s('path', { d: 'M96 56q14-10 18-22', ...DASH(3, '4 4') }, 'gray', { stroke: true })
  ],
  impulsivo: [
    ground(),
    ...lean(76, 136, 30, 'red', { accent: true }),
    s('path', { d: 'M60 110l-18 26M86 112l20 22', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 64h26M14 84h30M22 104h18', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M126 22l-14 22h10l-10 22 24-30h-12l12-14z' }, 'yellow')
  ],
  indebidamente: [
    s('rect', { x: 20, y: 76, width: 92, height: 60, rx: 6 }, 'gray'),
    s('rect', { x: 28, y: 76, width: 76, height: 14 }, 'dark'),
    s('path', { d: dots([[46, 70], [62, 66]], 7) }, 'yellow'),
    s('path', { d: 'M146 34l-56 34', ...SW(14) }, 'skin', { stroke: true }),
    s('circle', { cx: 92, cy: 66, r: 10 }, 'skin'),
    s('path', { d: ring(80, 80, 62), ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M36 124L124 36', ...SW(8) }, 'red', { stroke: true })
  ],
  infiltrar: [
    s('rect', { x: 14, y: 20, width: 132, height: 116 }, 'tan'),
    s('path', { d: 'M14 46h132M14 72h132M14 98h132M14 124h132M46 20v26M90 46v26M46 72v26M110 72v26M70 98v26M120 20v26', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M62 136v-80h30v80z' }, 'dark'),
    s('circle', { cx: 78, cy: 70, r: 11 }, 'black'),
    s('rect', { x: 66, y: 82, width: 24, height: 50, rx: 8 }, 'black', { accent: true }),
    s('path', { d: 'M70 68h16', ...SW(4) }, 'skin', { stroke: true })
  ],
  informalidad: [
    ground(),
    s('circle', { cx: 80, cy: 34, r: 14 }, 'skin'),
    s('path', { d: 'M66 26q14-14 30 0h8v4H66z' }, 'red'),
    s('path', { d: 'M54 54l14-6h24l14 6 8 18-12 4v18H58V76l-12-4z' }, 'orange', { accent: true }),
    s('path', { d: 'M58 94h44l2 22H84l-4-10-4 10H56z' }, 'blue'),
    s('path', { d: 'M62 116v16M98 116v16', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M54 136h16M90 136h16', ...SW(5) }, 'green', { stroke: true })
  ],
  ingente: [
    ground(),
    s('path', { d: 'M24 136V40h56v96zM80 136V68h56v68z' }, 'tan', { accent: true }),
    s('path', { d: 'M24 72h56M24 104h56M80 100h56M52 40v96M108 68v68', ...SW(3) }, 'brown', { stroke: true }),
    s('circle', { cx: 144, cy: 120, r: 3 }, 'skin'),
    s('rect', { x: 141, y: 124, width: 6, height: 12, rx: 2 }, 'blue'),
    s('path', { d: 'M24 28h112M24 22v12M136 22v12', ...SW(3) }, 'gray', { stroke: true })
  ],
  injustificado: [
    ground(),
    ...person(54, 136, 'blue', { accent: true }),
    s('path', { d: 'M42 98l-18-18M66 98l18-18', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M46 66q8-5 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: bubble(70, 18, 60, 40), ...DASH(4, '6 5') }, 'gray', { stroke: true }),
    s('path', { d: 'M146 100h-28', ...SW(12) }, 'skin', { stroke: true }),
    s('path', { d: 'M118 100h-22', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: burst(110, 78, 10, 5, 8) }, 'red')
  ],
  'introspección': [
    s('path', { d: HEAD }, 'skin'),
    s('path', { d: ring(78, 70, 26) }, 'cream'),
    s('ellipse', { cx: 78, cy: 70, rx: 18, ry: 10 }, 'white'),
    s('circle', { cx: 78, cy: 70, r: 7 }, 'blue', { accent: true }),
    s('path', { d: ring(78, 70, 26), ...SW(3) }, 'purple', { stroke: true }),
    s('path', { d: 'M110 70l-10 0M24 52l10 6M24 92l10-6', ...SW(4) }, 'purple', { stroke: true })
  ],
  kiwi: [
    s('ellipse', { cx: 52, cy: 92, rx: 34, ry: 40 }, 'brown'),
    s('circle', { cx: 104, cy: 70, r: 40 }, 'brown'),
    s('circle', { cx: 104, cy: 70, r: 35 }, 'green', { accent: true }),
    s('circle', { cx: 104, cy: 70, r: 12 }, 'cream'),
    s('path', { d: dots(around(104, 70, 18, 12), 2.5) }, 'black')
  ],
  lapicera: [
    s('path', { d: 'M40 132l10-26 74-74 16 16-74 74z' }, 'blue', { accent: true }),
    s('path', { d: 'M40 132l10-26 16 16z' }, 'cream'),
    s('path', { d: 'M40 132l4-10 6 6z' }, 'dark'),
    s('path', { d: 'M108 48l20-20', ...SW(5) }, 'navy', { stroke: true }),
    s('path', { d: 'M110 30l-30 30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M22 140q14-8 26-2', ...SW(3) }, 'navy', { stroke: true })
  ],
  lobato: [
    s('path', { d: 'M56 136q-10-50 24-56q34 6 24 56z' }, 'gray', { accent: true }),
    s('path', { d: 'M104 128q30 0 28-22', ...SW(10) }, 'gray', { stroke: true }),
    s('path', { d: 'M50 54q30-24 60 0l-16 30q-14 10-28 0z' }, 'gray'),
    s('path', { d: 'M54 50l-6-30 22 16zM106 50l6-30-22 16z' }, 'gray'),
    s('path', { d: 'M70 70h20l-4 16q-6 4-12 0z' }, 'white'),
    s('path', { d: dots([[68, 56], [92, 56]], 3.5) }, 'dark'),
    s('ellipse', { cx: 80, cy: 82, rx: 5, ry: 4 }, 'dark')
  ],
  'loción': [
    s('rect', { x: 52, y: 54, width: 56, height: 86, rx: 14 }, 'pink', { accent: true }),
    s('rect', { x: 70, y: 36, width: 20, height: 18 }, 'white'),
    outline({ x: 70, y: 36, width: 20, height: 18 }),
    s('path', { d: 'M80 36V22h22v8', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 60, y: 84, width: 40, height: 28, rx: 4 }, 'cream'),
    s('path', { d: drop(114, 44, 5) + drop(126, 58, 4) }, 'sky')
  ],
  manglar: [
    s('rect', { x: 14, y: 102, width: 132, height: 44, rx: 6 }, 'blue'),
    s('path', { d: 'M44 72q-14 20-22 40M44 72q-4 20-10 40M44 72q4 20 8 40M44 72q14 20 18 40M112 76q-12 18-18 36M112 76q2 20 0 36M112 76q12 18 20 36', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: ells([[44, 54, 28, 22], [112, 58, 26, 20]]) }, 'green', { accent: true }),
    s('path', { d: ells([[30, 40, 14, 10], [124, 44, 12, 9]]) }, 'green'),
    s('path', { d: 'M24 124q10-6 20 0t20 0M90 132q10-6 20 0t20 0', ...SW(3) }, 'sky', { stroke: true })
  ],
  maniobrar: [
    s('circle', { cx: 80, cy: 86, r: 50, ...SW(12) }, 'dark', { stroke: true }),
    s('path', { d: 'M34 86h92M80 86v48', ...SW(10) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 86, r: 12 }, 'gray'),
    s('path', { d: ells([[36, 70, 12, 16], [124, 70, 12, 16]]) }, 'skin'),
    s('path', { d: 'M44 24a56 56 0 0 1 72 0', ...SW(6) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M122 14l0 18-16-4z' }, 'orange')
  ],
  manzanillo: [
    ground(),
    ...tree(80, 'green', 'brown'),
    s('path', { d: dots([[60, 60], [92, 54], [110, 76], [64, 86], [86, 80], [48, 74]], 6) }, 'mint', { accent: true }),
    s('path', { d: drop(120, 104, 6) + drop(132, 120, 5) + drop(40, 112, 5) }, 'purple')
  ],
  marginalidad: [
    s('circle', { cx: 66, cy: 80, r: 50 }, 'mint'),
    s('path', { d: busts([46, 70, 94], 104, 20, 24) + busts([58, 82], 74, 20, 24) }, 'blue'),
    s('path', { d: dots([[46, 84], [70, 84], [94, 84], [58, 54], [82, 54]], 9) }, 'skin'),
    s('path', { d: busts([138], 140, 18, 24) }, 'gray', { accent: true }),
    s('circle', { cx: 138, cy: 120, r: 8 }, 'skin'),
    s('path', { d: ring(66, 80, 50), ...DASH(3) }, 'green', { stroke: true })
  ],
  medular: [
    s('path', { d: 'M26 52a14 14 0 1 1 20-18l68 68a14 14 0 1 1 18 20a14 14 0 1 1-20 18L44 72a14 14 0 1 1-18-20z' }, 'cream'),
    s('path', { d: 'M26 52a14 14 0 1 1 20-18l68 68a14 14 0 1 1 18 20a14 14 0 1 1-20 18L44 72a14 14 0 1 1-18-20z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 58l50 50', ...SW(10) }, 'red', { stroke: true, accent: true }),
    s('path', { d: sparkle(128, 40, 12) }, 'yellow')
  ],
  meningitis: [
    s('path', { d: 'M40 84a40 36 0 0 1 80 0q4 22-14 26H54q-18-4-14-26z' }, 'pink'),
    s('path', { d: 'M38 84a42 40 0 0 1 84 0', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M80 52v54M58 70q10 6 4 16M100 70q-10 6-4 16', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M28 40l-8-8M132 40l8-8M80 28v-12', ...SW(4) }, 'orange', { stroke: true }),
    s('rect', { x: 112, y: 104, width: 10, height: 40, rx: 5 }, 'white'),
    outline({ x: 112, y: 104, width: 10, height: 40, rx: 5 }),
    s('path', { d: 'M117 140v-28', ...SW(4) }, 'red', { stroke: true })
  ],
  'meñique': [
    s('path', { d: 'M52 140v-36q-6-18 4-30h60q8 8 4 30v36z' }, 'skin'),
    s('path', { d: 'M62 76V58M80 76V54M98 76V58', ...SW(14) }, 'skin', { stroke: true }),
    s('path', { d: 'M114 80V40', ...SW(14) }, 'skin', { stroke: true, accent: true }),
    s('path', { d: 'M62 58v4M80 54v4M98 58v4', ...SW(10) }, 'pink', { stroke: true }),
    s('path', { d: 'M114 40v2', ...SW(12) }, 'pink', { stroke: true }),
    s('path', { d: sparkle(134, 28, 9) }, 'yellow'),
    s('path', { d: 'M52 108q-12-10-4-24', ...SW(12) }, 'skin', { stroke: true })
  ],
  'mojón': [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M14 146l30-16h72l30 16z' }, 'gray'),
    s('path', { d: 'M56 132V60a24 24 0 0 1 48 0v72z' }, 'white'),
    s('path', { d: 'M56 76V60a24 24 0 0 1 48 0v16z' }, 'red', { accent: true }),
    s('path', { d: 'M56 132V60a24 24 0 0 1 48 0v72z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M68 96h24M72 108h16', ...SW(4) }, 'dark', { stroke: true })
  ],
  'moretón': [
    s('path', { d: 'M14 64q60-20 132-6v50q-72-12-132 6z' }, 'skin'),
    s('path', { d: ells([[82, 84, 24, 18]]) }, 'purple', { accent: true }),
    s('path', { d: ells([[86, 82, 12, 9]]) }, 'navy'),
    s('path', { d: ells([[64, 92, 8, 6], [104, 74, 7, 5]]) }, 'green'),
    s('path', { d: 'M62 40l8 10M86 34v12M110 40l-8 10', ...SW(4) }, 'red', { stroke: true })
  ],
  multiplicidad: [
    s('circle', { cx: 44, cy: 44, r: 18 }, 'red', { accent: true }),
    s('rect', { x: 66, y: 28, width: 32, height: 32, rx: 4 }, 'blue'),
    s('path', { d: 'M120 26l20 36h-40z' }, 'green'),
    s('path', { d: star(44, 104, 22) }, 'yellow'),
    s('path', { d: heart(82, 92, 18) }, 'pink'),
    s('path', { d: 'M108 82h28l8 20-22 22-22-22z' }, 'purple'),
    s('path', { d: 'M18 140h124', ...DASH(3, '2 8') }, 'gray', { stroke: true })
  ],
  osado: [
    s('path', { d: 'M14 146V80h30v66zM116 146V80h30v66z' }, 'brown'),
    s('path', { d: 'M44 80h72', ...SW(3) }, 'dark', { stroke: true }),
    ...person(80, 80, 'red', { accent: true, h: 30, w: 22, r: 10 }),
    s('path', { d: 'M48 50l64-8', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M18 30l8 6M140 30l-8 6', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M44 146q36-30 72 0z' }, 'sky')
  ],
  padecimiento: [
    s('path', { d: 'M18 140v-44h124v44', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 18, y: 96, width: 124, height: 16, rx: 3 }, 'white'),
    s('rect', { x: 52, y: 84, width: 86, height: 28, rx: 8 }, 'sky', { accent: true }),
    s('rect', { x: 20, y: 80, width: 30, height: 16, rx: 6 }, 'cream'),
    ...face(40, 70, 14, 'skin', 'frown'),
    s('path', { d: 'M42 30a14 14 0 0 1 22-10a12 12 0 0 1 20 8a10 10 0 0 1-2 18H44a10 10 0 0 1-2-16z' }, 'gray'),
    s('path', { d: 'M54 52l-4 8M70 52l-4 8', ...SW(3) }, 'blue', { stroke: true })
  ],
  paritario: [
    s('path', { d: 'M80 30v100M54 136h52M24 50h112', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 50l-12 30M24 50l12 30M136 50l-12 30M136 50l12 30', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M8 80h32q-2 10-16 10t-16-10zM120 80h32q-2 10-16 10t-16-10z' }, 'yellow', { accent: true }),
    s('path', { d: busts([24, 136], 80, 18, 20) }, 'blue'),
    s('path', { d: busts([136], 80, 18, 20) }, 'orange'),
    s('path', { d: dots([[24, 62], [136, 62]], 7) }, 'skin'),
    s('circle', { cx: 80, cy: 28, r: 6 }, 'dark')
  ],
  pavor: [
    s('path', { d: 'M34 50l-8-24M52 38l-2-26M80 34V10M108 38l2-26M126 50l8-24', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 86, r: 50 }, 'mint', { accent: true }),
    s('path', { d: ells([[62, 74, 10, 13], [98, 74, 10, 13]]) }, 'white'),
    s('path', { d: dots([[62, 76], [98, 76]], 4) }, 'dark'),
    s('ellipse', { cx: 80, cy: 112, rx: 12, ry: 16 }, 'dark'),
    s('path', { d: 'M20 80q-6 8 0 16M140 80q6 8 0 16', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: drop(124, 56, 5) }, 'sky')
  ],
  'pinzón': [
    s('path', { d: 'M14 120q60 6 132-6', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: 'M46 96q0-34 36-36q30 2 30 30q-4 22-30 28l-36 0z' }, 'orange', { accent: true }),
    s('path', { d: 'M44 96l-28-12 6 22z' }, 'brown'),
    s('circle', { cx: 92, cy: 64, r: 18 }, 'red'),
    s('path', { d: 'M108 58l18 8-18 8z' }, 'tan'),
    s('circle', { cx: 96, cy: 60, r: 3.5 }, 'dark'),
    s('path', { d: 'M60 84q14 12 30 4', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M78 116v6M90 116v6', ...SW(3) }, 'dark', { stroke: true })
  ],
  'platónico': [
    s('path', { d: 'M88 46a14 14 0 0 1 22-16a16 16 0 0 1 30 10a12 12 0 0 1-4 22H92a10 10 0 0 1-4-16z' }, 'sky'),
    s('path', { d: heart(116, 34, 12) }, 'red', { accent: true }),
    s('path', { d: dots([[78, 72], [70, 84]], 4) }, 'sky'),
    ...person(48, 138, 'purple'),
    s('path', { d: 'M40 70q4-3 8 0M50 70q4-3 8 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(22, 40, 8) + sparkle(140, 92, 7) }, 'yellow')
  ],
  porcino: [
    s('path', { d: 'M44 110v24M60 112v24M100 112v24M116 110v24', ...SW(9) }, 'pink', { stroke: true }),
    s('ellipse', { cx: 80, cy: 92, rx: 50, ry: 32 }, 'pink', { accent: true }),
    s('path', { d: 'M54 66l-6-16 16 8zM100 64l10-14 4 18z' }, 'pink'),
    s('ellipse', { cx: 126, cy: 94, rx: 10, ry: 13 }, 'red'),
    s('path', { d: dots([[123, 90], [123, 98]], 2.5) }, 'dark'),
    s('circle', { cx: 108, cy: 80, r: 4 }, 'dark'),
    s('path', { d: 'M30 86q-12-4-8-14q8 0 4 8', ...SW(3) }, 'pink', { stroke: true })
  ],
  pormenor: [
    s('rect', { x: 14, y: 24, width: 112, height: 90, rx: 6 }, 'cream'),
    s('path', { d: dots([[30, 40], [48, 50], [34, 98], [108, 40], [110, 96]], 3) + dots([[72, 70], [84, 62], [64, 82]], 5) }, 'blue'),
    s('circle', { cx: 74, cy: 70, r: 28 }, 'sky'),
    s('path', { d: dots([[72, 70], [84, 62], [64, 82]], 7) }, 'red', { accent: true }),
    s('path', { d: ring(74, 70, 28), ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M94 90l40 42', ...SW(12) }, 'dark', { stroke: true })
  ],
  potencialidad: [
    ground(),
    s('path', { d: 'M74 136v-40M86 136v-40', ...DASH(3, '4 5') }, 'gray', { stroke: true }),
    s('path', { d: ring(80, 64, 40), ...DASH(4, '6 6') }, 'green', { stroke: true }),
    s('ellipse', { cx: 80, cy: 126, rx: 14, ry: 10 }, 'brown', { accent: true }),
    s('path', { d: 'M80 118q0-10 8-14', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: sparkle(120, 104, 9) + sparkle(36, 104, 7) }, 'yellow')
  ],
  presuponer: [
    ...person(42, 138, 'blue'),
    s('path', { d: 'M20 18h56a8 8 0 0 1 8 8v24a8 8 0 0 1-8 8H20a8 8 0 0 1-8-8V26a8 8 0 0 1 8-8z' }, 'white'),
    s('path', { d: 'M20 18h56a8 8 0 0 1 8 8v24a8 8 0 0 1-8 8H20a8 8 0 0 1-8-8V26a8 8 0 0 1 8-8z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[42, 66], [48, 74]], 3) }, 'gray'),
    s('path', { d: 'M32 38l10 10 20-20', ...SW(6) }, 'green', { stroke: true, accent: true }),
    s('rect', { x: 96, y: 92, width: 46, height: 44, rx: 3 }, 'tan'),
    s('path', { d: 'M96 106h46M119 92v14', ...SW(3) }, 'brown', { stroke: true })
  ],
  'profesionalización': [
    s('path', { d: 'M14 140h40v-28h34v-28h34v-28h24v84z' }, 'gray'),
    s('circle', { cx: 32, cy: 92, r: 8 }, 'skin'),
    s('rect', { x: 24, y: 100, width: 16, height: 30, rx: 5 }, 'orange'),
    s('circle', { cx: 132, cy: 22, r: 9 }, 'skin'),
    s('rect', { x: 122, y: 32, width: 20, height: 24, rx: 6 }, 'navy', { accent: true }),
    s('path', { d: 'M132 32l-3 8 3 6 3-6z' }, 'red'),
    s('rect', { x: 104, y: 40, width: 14, height: 12, rx: 2 }, 'brown'),
    s('path', { d: 'M50 98l60-58', ...DASH(3, '4 5') }, 'green', { stroke: true })
  ],
  'píxel': [
    s('rect', { x: 18, y: 18, width: 124, height: 124, rx: 6 }, 'navy'),
    s('path', { d: rects([[38, 46, 14, 14], [52, 46, 14, 14], [94, 46, 14, 14], [108, 46, 14, 14], [24, 60, 112, 14], [24, 74, 112, 14], [38, 88, 84, 14], [52, 102, 56, 14], [66, 116, 28, 14]]) }, 'red', { accent: true }),
    s('path', { d: rects([[38, 60, 14, 14]]) }, 'pink'),
    s('path', { d: 'M24 46h112M24 60h112M24 74h112M24 88h112M24 102h112M24 116h112M38 32v104M52 32v104M66 32v104M80 32v104M94 32v104M108 32v104M122 32v104', ...SW(1) }, 'dark', { stroke: true })
  ],
  recuadro: [
    s('rect', { x: 26, y: 16, width: 108, height: 128, rx: 3 }, 'white'),
    outline({ x: 26, y: 16, width: 108, height: 128, rx: 3 }),
    s('path', { d: 'M38 32h84M38 44h84M38 120h84M38 132h60', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 38, y: 56, width: 84, height: 52, rx: 2 }, 'cream'),
    s('rect', { x: 38, y: 56, width: 84, height: 52, rx: 2, ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M50 72h60M50 84h60M50 96h40', ...SW(3) }, 'dark', { stroke: true })
  ],
  reescribir: [
    s('rect', { x: 22, y: 24, width: 84, height: 112, rx: 3 }, 'white'),
    outline({ x: 22, y: 24, width: 84, height: 112, rx: 3 }),
    s('path', { d: 'M34 44h60M34 58h50', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 51h68', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M34 80q6-8 12 0t12 0 12 0M34 98q6-8 12 0t12 0', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M144 50l-38 64-6 12 10-8 38-64z' }, 'yellow', { accent: true }),
    s('path', { d: 'M120 22a22 22 0 1 1-8 30', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M104 46l8 8 6-10z' }, 'green')
  ],
  repechaje: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'green'),
    s('path', { d: 'M30 140V70h100v70', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M30 90h100M30 110h100M50 70v70M70 70v70M90 70v70M110 70v70', ...SW(1) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 112, r: 14 }, 'white', { accent: true }),
    s('path', { d: 'M44 44a40 40 0 0 1 72 0', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M108 30l12 18-20 2z' }, 'yellow')
  ],
  repercutir: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'blue'),
    s('path', { d: ells([[80, 92, 56, 22]]), ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: ells([[80, 92, 36, 14]]), ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: ells([[80, 92, 16, 6]]), ...SW(5) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 38, r: 12 }, 'gray', { accent: true }),
    s('path', { d: 'M80 54v14', ...DASH(3, '3 4') }, 'white', { stroke: true })
  ],
  reversible: [
    s('path', { d: 'M48 30l32 10v100H34V64l-14 10-8-24z' }, 'red', { accent: true }),
    s('path', { d: 'M112 30L80 40v100h46V64l14 10 8-24z' }, 'blue'),
    s('path', { d: 'M80 40v100', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M60 18a24 14 0 0 1 40 0', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M96 10l8 8-10 4z' }, 'orange'),
    s('path', { d: dots([[72, 70], [72, 96]], 3) + dots([[88, 70], [88, 96]], 3) }, 'yellow')
  ],
  rozar: [
    s('path', { d: 'M14 120q66-20 132 0v26H14z' }, 'green'),
    s('path', { d: 'M18 114q60-14 124 0', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: 'M60 104q10-40 40-62l20 12q-20 30-40 54z' }, 'skin', { accent: true }),
    s('path', { d: 'M24 96h26M30 84h18M100 112h34', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: sparkle(62, 116, 7) + sparkle(84, 118, 5) }, 'yellow')
  ],
  seso: [
    s('path', { d: 'M28 92q-12-26 12-40q2-22 26-24q14-10 30 0q26-2 30 22q24 12 12 40q4 24-24 26q-12 14-30 6q-14 10-30-2q-24 0-26-28z' }, 'pink', { accent: true }),
    s('path', { d: 'M80 30v100M52 50q14 10 4 24t8 26M108 50q-14 10-4 24t-8 26M36 86q10-6 16 4M124 86q-10-6-16 4', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: sparkle(138, 24, 9) }, 'yellow')
  ],
  sobrevalorado: [
    s('path', { d: 'M40 140l10-60h60l10 60z' }, 'yellow', { accent: true }),
    s('rect', { x: 44, y: 72, width: 72, height: 10, rx: 2 }, 'orange'),
    s('ellipse', { cx: 80, cy: 66, rx: 10, ry: 7 }, 'gray'),
    s('path', { d: 'M50 14l-12 56M110 14l12 56', ...SW(3) }, 'cream', { stroke: true }),
    s('path', { d: sparkle(30, 40, 9) + sparkle(130, 40, 9) + sparkle(80, 30, 8) }, 'yellow'),
    s('path', { d: 'M62 104h36', ...SW(3) }, 'orange', { stroke: true })
  ],
  subteniente: [
    ground(),
    s('path', { d: 'M66 50q-2-14 14-16q16 2 14 16z' }, 'green'),
    s('rect', { x: 62, y: 48, width: 36, height: 6, rx: 2 }, 'dark'),
    s('circle', { cx: 80, cy: 64, r: 11 }, 'skin'),
    s('rect', { x: 58, y: 78, width: 44, height: 58, rx: 12 }, 'green', { accent: true }),
    s('rect', { x: 58, y: 80, width: 14, height: 6, rx: 2 }, 'yellow'),
    s('path', { d: 'M80 84v40', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: dots([[86, 96], [86, 112]], 2.5) }, 'yellow')
  ],
  susodicho: [
    s('rect', { x: 30, y: 16, width: 84, height: 128, rx: 3 }, 'white'),
    outline({ x: 30, y: 16, width: 84, height: 128, rx: 3 }),
    s('rect', { x: 38, y: 28, width: 68, height: 14, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M44 35h56M44 62h56M44 78h56M44 94h40M44 112h56', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 112q40-10 24-70', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M114 46l10-12 6 14z' }, 'blue')
  ],
  tacha: [
    s('rect', { x: 26, y: 18, width: 94, height: 122, rx: 3 }, 'white'),
    outline({ x: 26, y: 18, width: 94, height: 122, rx: 3 }),
    s('path', { d: 'M40 36h66M40 52h66M40 68h50', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 86l52 48M114 86l-52 48', ...SW(9) }, 'red', { stroke: true, accent: true }),
    s('path', { d: ells([[48, 116, 9, 7], [38, 108, 4, 3]]) }, 'brown')
  ],
  talco: [
    s('rect', { x: 46, y: 50, width: 52, height: 90, rx: 14 }, 'sky', { accent: true }),
    s('path', { d: 'M52 50q20-16 40 0z' }, 'white'),
    s('path', { d: 'M52 50q20-16 40 0z', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 56, y: 82, width: 32, height: 30, rx: 4 }, 'white'),
    s('path', { d: dots([[72, 32], [86, 24], [100, 28], [112, 18], [108, 40], [124, 30], [94, 14]], 4) }, 'gray'),
    s('path', { d: heart(72, 92, 8) }, 'pink')
  ],
  testificar: [
    s('rect', { x: 18, y: 104, width: 70, height: 36, rx: 3 }, 'brown'),
    s('rect', { x: 14, y: 98, width: 78, height: 10, rx: 3 }, 'tan'),
    s('circle', { cx: 54, cy: 60, r: 13 }, 'skin'),
    s('rect', { x: 38, y: 74, width: 32, height: 26, rx: 10 }, 'blue', { accent: true }),
    s('path', { d: 'M66 80l14-36', ...SW(7) }, 'skin', { stroke: true }),
    s('ellipse', { cx: 81, cy: 38, rx: 7, ry: 9 }, 'skin'),
    s('path', { d: 'M108 66l24 -20', ...SW(8) }, 'brown', { stroke: true }),
    s('rect', { x: 116, y: 60, width: 30, height: 14, rx: 3, transform: 'rotate(-40 131 67)' }, 'brown')
  ],
  tofu: [
    s('ellipse', { cx: 80, cy: 112, rx: 64, ry: 20 }, 'blue'),
    s('path', { d: 'M38 104V70l14-10h40v34l-14 10z' }, 'cream', { accent: true }),
    s('path', { d: 'M38 104V70l14-10h40v34l-14 10zM38 70h40l14-10M78 70v34', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 106V84l10-8h26v22l-10 8zM96 84h26l10-8M122 84v22' }, 'cream'),
    s('path', { d: 'M96 106V84l10-8h26v22l-10 8zM96 84h26l10-8M122 84v22', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 50l10-24M48 46l6-22', ...SW(4) }, 'brown', { stroke: true })
  ],
  troyano: [
    ...horse('tan', 'brown', { accent: true }),
    s('rect', { x: 30, y: 132, width: 96, height: 8, rx: 3 }, 'brown'),
    s('path', { d: dots([[44, 144], [112, 144]], 6) }, 'dark'),
    s('path', { d: 'M64 80h20v12H64z' }, 'brown')
  ],
  vagancia: [
    s('path', { d: 'M22 140V30M138 140V30', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: ells([[22, 30, 16, 14], [138, 30, 16, 14]]) }, 'green'),
    s('path', { d: 'M22 70q58 60 116 0', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M30 78q50 50 100 0q-50 30-100 0z' }, 'red', { accent: true }),
    s('circle', { cx: 50, cy: 80, r: 11 }, 'skin'),
    s('path', { d: 'M60 92q20 10 50 0', ...SW(14) }, 'blue', { stroke: true }),
    s('path', { d: 'M44 78q3 2 6 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  vehemencia: [
    s('path', { d: 'M42 140l8-46h60l8 46z' }, 'brown'),
    s('circle', { cx: 80, cy: 54, r: 13 }, 'skin'),
    s('rect', { x: 62, y: 66, width: 36, height: 30, rx: 10 }, 'red', { accent: true }),
    s('path', { d: 'M94 72l20-36M66 72l-16 10', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 115, cy: 32, r: 7 }, 'skin'),
    s('path', { d: 'M30 30l12 12M22 58h16M132 64l-12-4M138 40h-10', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M72 60q8 6 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  verbena: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('path', { d: 'M14 40q66 40 132 0M14 84q66 30 132 0', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: dots(qpts([14, 40], [80, 80], [146, 40], 6), 6) }, 'yellow', { accent: true }),
    s('path', { d: qpts([14, 84], [80, 114], [146, 84], 6).map(([x, y]) => `M${x - 7} ${y}h14l-7 14z`).join('') }, 'red'),
    s('path', { d: sparkle(40, 120, 10) + sparkle(116, 124, 8) }, 'pink'),
    s('path', { d: sparkle(80, 128, 8) }, 'mint')
  ],
  vetar: [
    s('rect', { x: 18, y: 40, width: 62, height: 84, rx: 3 }, 'white'),
    outline({ x: 18, y: 40, width: 62, height: 84, rx: 3 }),
    s('path', { d: 'M28 58h42M28 72h42M28 86h30', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 140V82q-10-6-6-20v-28a6 6 0 0 1 12 0v22v-30a6 6 0 0 1 12 0v30v-34a6 6 0 0 1 12 0v34v-28a6 6 0 0 1 12 0v40q0 30-14 34v30z' }, 'skin'),
    s('path', { d: ring(48, 104, 18), ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M36 92l24 24', ...SW(5) }, 'red', { stroke: true })
  ],
  aberrante: [
    s('path', { d: 'M20 34h80M20 62h80M20 118h80', ...SW(8) }, 'blue', { stroke: true }),
    s('path', { d: 'M98 22l18 12-18 12zM98 50l18 12-18 12zM98 106l18 12-18 12z' }, 'blue'),
    s('path', { d: 'M20 90q14-20 28 0t28-4 18 18', ...SW(8) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M86 98l12 24-24-6z' }, 'orange')
  ],
  acampada: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('path', { d: 'M14 112h132v22a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green'),
    s('path', { d: 'M24 116l38-68 38 68z' }, 'orange', { accent: true }),
    s('path', { d: 'M62 48l-12 68h24z' }, 'brown'),
    s('path', { d: 'M110 124l20-8M110 116l20 8', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M120 114q-10-12 0-24q2 8 6 4q6 12-6 20z' }, 'yellow'),
    s('path', { d: star(112, 34, 5) + star(130, 52, 4) + star(34, 34, 4) }, 'yellow')
  ],
  acechar: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 74q30-10 60 0t72 0v60a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green'),
    s('path', { d: 'M22 74l6-26 6 26 6-30 6 30 6-26 6 26 6-30 6 30 6-26 6 26z' }, 'green'),
    s('path', { d: ells([[40, 86, 8, 5], [64, 86, 8, 5]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M40 83v6M64 83v6', ...SW(3) }, 'black', { stroke: true }),
    s('path', { d: 'M110 74q0-16 14-18q12 4 10 18z' }, 'brown'),
    s('path', { d: 'M118 56l-2-14M126 56l2-14', ...SW(4) }, 'brown', { stroke: true })
  ],
  aguacero: [
    s('path', { d: 'M24 70a22 22 0 0 1 26-28a30 30 0 0 1 56-4a22 22 0 0 1 24 32z' }, 'dark', { accent: true }),
    s('path', { d: 'M38 84l-8 22M58 84l-8 22M78 84l-8 22M98 84l-8 22M118 84l-8 22M46 112l-8 22M66 112l-8 22M86 112l-8 22M106 112l-8 22M126 112l-8 22', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M18 142h124', ...SW(4) }, 'sky', { stroke: true })
  ],
  agudeza: [
    s('path', { d: 'M24 136q-4-60 34-86q30-18 58-4l22 12-18 6q-6 22-30 30l16 42z' }, 'brown', { accent: true }),
    s('path', { d: 'M116 46l26 12-28 10z' }, 'yellow'),
    s('circle', { cx: 96, cy: 52, r: 8 }, 'yellow'),
    s('circle', { cx: 97, cy: 52, r: 4 }, 'black'),
    s('path', { d: 'M86 42l18 -4', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 136q4-36 24-56', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: sparkle(136, 26, 10) }, 'yellow')
  ],
};
