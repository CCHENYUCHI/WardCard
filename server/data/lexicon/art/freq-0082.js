// Illustration specs for words still undrawn in batches 0080–0082 (see server/scripts/lexicon/art.js)
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

module.exports = {
  irritante: [
    ...face(70, 90, 38, 'pink', 'frown', { accent: true }),
    s('path', { d: 'M52 66l14 6M88 66l-14 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[124, 36, 7, 5]]) }, 'dark'),
    s('path', { d: 'M118 30l-6-8M128 30l6-8', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 46q-8 6 0 12t0 12M140 50q6 8-2 14', ...DASH(3, '4 5') }, 'dark', { stroke: true }),
    s('path', { d: 'M26 30l8 8M40 22l2 12M18 46l12 2', ...SW(4) }, 'red', { stroke: true })
  ],
  'legítimamente': [
    ...paper(40, 22, 80, 104),
    s('path', { d: 'M52 42h56M52 56h56M52 70h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 112l-8 26 14-6 8 12 4-30z' }, 'red'),
    s('circle', { cx: 104, cy: 104, r: 16 }, 'red', { accent: true }),
    s('path', { d: 'M56 98l10 10 18-20', ...SW(6) }, 'green', { stroke: true })
  ],
  libreto: [
    s('rect', { x: 42, y: 52, width: 76, height: 92, rx: 6 }, 'red', { accent: true }),
    s('rect', { x: 50, y: 60, width: 60, height: 76, rx: 3 }, 'cream'),
    s('path', { d: 'M58 80h44M58 94h44M58 108h30M58 122h40', ...SW(3) }, 'gray', { stroke: true }),
    ...note(56, 38, 'purple'),
    ...note(96, 30, 'blue')
  ],
  madrastra: [
    ...lady(60, 140, 'purple', { accent: true }),
    s('path', { d: 'M48 70l-6-14 8 6 4-10 4 10 8-6-6 14z' }, 'yellow'),
    s('path', { d: 'M54 76l4 2M66 76l-4 2', ...SW(3) }, 'dark', { stroke: true }),
    ...person(114, 140, 'pink', { h: 30, w: 22, r: 10 }),
    s('path', { d: 'M108 98q6-4 12 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  'masón': [
    s('path', { d: rects([[18, 104, 40, 16], [62, 104, 40, 16], [106, 104, 36, 16], [18, 124, 20, 14], [42, 124, 40, 14], [86, 124, 40, 14], [130, 124, 12, 14]]) }, 'tan'),
    s('path', { d: rects([[40, 86, 40, 14]]) }, 'orange', { accent: true }),
    s('path', { d: 'M96 70l26-40', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M84 60l24 16 12-22z' }, 'gray'),
    s('path', { d: 'M26 82h22', ...SW(4) }, 'gray', { stroke: true })
  ],
  mella: [
    s('path', { d: 'M20 96h40v-16H20z' }, 'brown'),
    s('path', { d: 'M60 78h70q14 0 14 10l-8 4H96l-6-8-6 8H60z' }, 'gray', { accent: true }),
    s('path', { d: 'M84 92l6-8 6 8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 88h24', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M84 108l-4 10M94 108l4 12M89 110v12', ...SW(3) }, 'orange', { stroke: true })
  ],
  mercante: [
    s('path', { d: 'M14 128q20-8 33 0t33 0 33 0 33 0v18H14z' }, 'sky'),
    s('path', { d: 'M18 98h124l-14 28H32z' }, 'navy', { accent: true }),
    s('path', { d: rects([[36, 74, 22, 24], [60, 74, 22, 24], [84, 74, 22, 24]]) }, 'red'),
    s('path', { d: rects([[48, 52, 22, 22], [72, 52, 22, 22]]) }, 'green'),
    s('rect', { x: 112, y: 62, width: 20, height: 36, rx: 2 }, 'white'),
    s('path', { d: 'M112 62h20v36h-20z', ...SW(3) }, 'gray', { stroke: true })
  ],
  nazareno: [
    s('path', { d: 'M80 30q-18 0-18 22v10h36V52q0-22-18-22z' }, 'purple'),
    s('path', { d: 'M62 60h36l18 78H44z' }, 'purple', { accent: true }),
    s('path', { d: 'M70 48h20', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 96h32', ...SW(6) }, 'yellow', { stroke: true }),
    s('rect', { x: 112, y: 46, width: 8, height: 70, rx: 3 }, 'cream'),
    s('path', { d: drop(116, 36, 5) }, 'orange'),
    s('path', { d: 'M98 92l16 4', ...SW(6) }, 'skin', { stroke: true })
  ],
  'odontología': [
    s('path', { d: 'M40 40q20-14 40 0q20-14 40 0q14 20 0 50l-8 44q-4 8-10 0l-8-30q-4-8-12 0l-8 30q-6 8-10 0l-8-44q-14-30 0-50z' }, 'white'),
    s('path', { d: 'M40 40q20-14 40 0q20-14 40 0q14 20 0 50l-8 44q-4 8-10 0l-8-30q-4-8-12 0l-8 30q-6 8-10 0l-8-44q-14-30 0-50z', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: 'M104 126l26 16', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 100, cy: 116, r: 12 }, 'blue', { accent: true }),
    s('path', { d: sparkle(56, 60, 10) }, 'yellow')
  ],
  olmo: [
    ground(),
    ...tree(80, 'green', 'brown', { accent: true }),
    s('path', { d: 'M80 110l-16-14M80 102l14-12', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: dots([[54, 52], [96, 44], [110, 76]], 4) }, 'mint')
  ],
  omiso: [
    s('path', { d: bubble(18, 24, 64, 40) }, 'sky'),
    s('path', { d: 'M30 40h40M30 50h28', ...SW(4) }, 'white', { stroke: true }),
    ...person(108, 136, 'orange', { accent: true }),
    s('path', { d: 'M94 98l2-18M122 98l-2-18', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M100 76q8 6 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  'optimización': [
    s('path', { d: 'M24 112a56 56 0 0 1 112 0', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 63a56 56 0 0 1 28 49', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'green', { accent: true, stroke: true }),
    s('path', { d: 'M80 112l34-36', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 112, r: 9 }, 'dark'),
    s('path', { d: 'M40 140h80', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 46l12-14 12 14M42 32v26', ...SW(5) }, 'orange', { stroke: true })
  ],
  palco: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'navy'),
    s('path', { d: 'M14 14h40q-8 50 0 132H14zM146 14h-40q8 50 0 132h40z' }, 'red', { accent: true }),
    s('path', { d: busts([66, 94], 104, 22, 24) }, 'purple'),
    s('path', { d: dots([[66, 70], [94, 70]], 10) }, 'skin'),
    s('path', { d: 'M40 104h80v20q-40 12-80 0z' }, 'yellow'),
    s('path', { d: 'M14 20h132', ...SW(10) }, 'yellow', { stroke: true })
  ],
  panfleto: [
    s('path', { d: 'M28 40l36 8v84l-36-8z' }, 'yellow'),
    s('path', { d: 'M64 48l36-8v84l-36 8z' }, 'orange', { accent: true }),
    s('path', { d: 'M100 40l32 8v84l-32-8z' }, 'yellow'),
    s('path', { d: 'M74 70l18-10v24l-18-10z' }, 'dark'),
    s('path', { d: 'M36 66l20 4M36 80l20 4M36 94l20 4M108 70l16-2M108 84l16-2', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M72 104l20-4M72 114l20-4', ...SW(3) }, 'cream', { stroke: true })
  ],
  peine: [
    s('rect', { x: 22, y: 50, width: 116, height: 24, rx: 8 }, 'purple', { accent: true }),
    s('path', { d: 'M30 74v40M42 74v40M54 74v40M66 74v40M78 74v40M90 74v40M102 74v40M114 74v40M126 74v40', ...SW(5) }, 'purple', { stroke: true }),
    s('path', { d: 'M32 60h96', ...SW(3) }, 'pink', { stroke: true })
  ],
  pluralismo: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'cream'),
    s('path', { d: busts([50], 134, 26, 30) + 'M38 64h24v-24H38z' }, 'red', { accent: true }),
    s('path', { d: busts([80], 134, 26, 30) + 'M80 36l14 24H66z' }, 'blue'),
    s('path', { d: busts([110], 134, 26, 30) }, 'green'),
    s('circle', { cx: 110, cy: 52, r: 12 }, 'green'),
    s('path', { d: dots([[50, 92], [80, 92], [110, 92]], 11) }, 'skin'),
    s('path', { d: 'M40 74h80', ...DASH(3, '3 6') }, 'gray', { stroke: true })
  ],
  poseedor: [
    ...person(58, 136, 'blue'),
    s('path', { d: 'M70 98l22-10', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 104, cy: 60, r: 18, ...SW(8) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M104 78v52M104 108h14M104 122h10', ...SW(8) }, 'yellow', { stroke: true })
  ],
  precipicio: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'sky'),
    s('path', { d: 'M14 72h70l-6 18 8 14-10 18 6 24H14z' }, 'brown', { accent: true }),
    s('path', { d: 'M14 72h70', ...SW(6) }, 'green', { stroke: true }),
    ...person(64, 70, 'red', { h: 26, w: 18, r: 8 }),
    s('path', { d: 'M110 146q8-20 20-26t16 0v26z' }, 'gray'),
    s('path', { d: 'M100 40q8-8 16 0M118 30q6-6 12 0', ...SW(3) }, 'white', { stroke: true })
  ],
  pulga: [
    s('path', { d: 'M14 128q20-12 33 0t33 0 33 0 33 0v18H14z' }, 'brown'),
    s('ellipse', { cx: 92, cy: 62, rx: 22, ry: 18, transform: 'rotate(-20 92 62)' }, 'dark', { accent: true }),
    s('circle', { cx: 116, cy: 48, r: 8 }, 'dark'),
    s('path', { d: 'M82 76l-12 18 6 10M96 78l2 20M76 66l-18 4-6 14', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M26 118q10-60 40-64', ...DASH(3, '5 6') }, 'gray', { stroke: true })
  ],
  raso: [
    s('rect', { x: 14, y: 14, width: 132, height: 110, rx: 8 }, 'navy'),
    s('rect', { x: 14, y: 118, width: 132, height: 28, rx: 4 }, 'green'),
    s('path', { d: star(40, 40, 8) + star(110, 30, 6) + star(78, 56, 5) + star(128, 70, 5) }, 'yellow', { accent: true }),
    s('rect', { x: 44, y: 106, width: 70, height: 14, rx: 7 }, 'orange'),
    s('circle', { cx: 38, cy: 110, r: 9 }, 'skin'),
    s('path', { d: 'M118 112h20', ...SW(3) }, 'mint', { stroke: true })
  ],
  recambio: [
    s('circle', { cx: 66, cy: 84, r: 46 }, 'dark', { accent: true }),
    s('circle', { cx: 66, cy: 84, r: 22 }, 'gray'),
    s('path', { d: dots([[66, 84]], 6) }, 'dark'),
    s('path', { d: 'M28 64l-8 4M24 92h-8M36 118l-6 6', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M118 40q20 8 20 30M138 70l-8-8M138 70l8-8', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M120 136q-20-6-20-26M100 110l-8 8M100 110l8 8', ...SW(5) }, 'green', { stroke: true })
  ],
  recargar: [
    s('rect', { x: 34, y: 22, width: 60, height: 108, rx: 10 }, 'dark'),
    s('rect', { x: 40, y: 32, width: 48, height: 84, rx: 4 }, 'sky'),
    s('path', { d: 'M68 46l-16 32h12l-6 24 18-34H64z' }, 'yellow', { accent: true }),
    s('path', { d: 'M64 130v8q0 6 10 6h40q12 0 12-12V96', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 116, y: 72, width: 20, height: 24, rx: 4 }, 'gray'),
    s('path', { d: 'M120 72V60M132 72V60', ...SW(4) }, 'dark', { stroke: true })
  ],
  'regresión': [
    s('path', { d: 'M24 24v112h116', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 50l28 20 22-10 28 34 20 24', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M120 128h12v-14', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M110 36H62M74 26l-12 10 12 10', ...SW(5) }, 'blue', { stroke: true })
  ],
  relucir: [
    s('path', { d: 'M30 116l18-36h64l18 36z' }, 'yellow', { accent: true }),
    s('path', { d: 'M48 80h64l-6 10H54z' }, 'orange'),
    s('path', { d: sparkle(40, 50, 14) + sparkle(110, 40, 18) + sparkle(78, 30, 9) }, 'yellow'),
    s('path', { d: 'M70 92l-8 18', ...SW(4) }, 'cream', { stroke: true }),
    s('path', { d: 'M20 130h120', ...SW(4) }, 'gray', { stroke: true })
  ],
  rematar: [
    s('path', { d: 'M96 30h44v100M96 30v100', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 40h36M100 60h36M100 80h36M100 100h36M100 120h36M112 34v96M124 34v96', ...SW(2) }, 'gray', { stroke: true }),
    ...lean(42, 136, -10, 'red', { h: 40, w: 24, r: 10, accent: true }),
    s('path', { d: 'M46 132l20-10', ...SW(7) }, 'dark', { stroke: true }),
    s('circle', { cx: 92, cy: 104, r: 10 }, 'white'),
    s('circle', { cx: 92, cy: 104, r: 10, ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 112l12-4M68 98l10 2', ...SW(3) }, 'orange', { stroke: true })
  ],
  reo: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'cream'),
    ...person(80, 140, 'orange', { accent: true }),
    s('path', { d: 'M68 112l8 4M92 112l-8 4', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: ring(74, 118, 6) + ring(86, 118, 6), ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 18, y: 104, width: 40, height: 36, rx: 3 }, 'brown'),
    s('rect', { x: 102, y: 104, width: 40, height: 36, rx: 3 }, 'brown')
  ],
  'rústico': [
    s('path', { d: 'M20 76l60-46 60 46z' }, 'red'),
    s('path', { d: rects([[30, 76, 100, 12], [30, 92, 100, 12], [30, 108, 100, 12], [30, 124, 100, 12]]) }, 'brown', { accent: true }),
    s('rect', { x: 68, y: 100, width: 24, height: 36, rx: 2 }, 'dark'),
    s('rect', { x: 102, y: 84, width: 18, height: 16, rx: 2 }, 'yellow'),
    s('path', { d: 'M108 44V22h12v32', ...SW(1) }, 'gray', { stroke: true }),
    s('rect', { x: 106, y: 30, width: 12, height: 22 }, 'gray')
  ],
  sevillano: [
    s('rect', { x: 64, y: 50, width: 32, height: 86 }, 'tan', { accent: true }),
    s('rect', { x: 70, y: 28, width: 20, height: 22 }, 'tan'),
    s('path', { d: 'M74 28l6-14 6 14z' }, 'yellow'),
    s('path', { d: rects([[72, 60, 6, 12], [82, 60, 6, 12], [72, 84, 6, 12], [82, 84, 6, 12], [76, 34, 8, 10]]) }, 'brown'),
    ...[30, 130].flatMap(x => [
      s('rect', { x: x - 3, y: 110, width: 6, height: 26 }, 'brown'),
      s('circle', { cx: x, cy: 98, r: 16 }, 'green')
    ]),
    s('path', { d: dots([[24, 94], [34, 104], [126, 96], [136, 102]], 4) }, 'orange')
  ],
  sidra: [
    s('path', { d: 'M54 26h16v24q14 8 14 24v58q0 6-6 6H52q-6 0-6-6V74q0-16 8-24z' }, 'green', { accent: true }),
    s('rect', { x: 48, y: 80, width: 34, height: 26 }, 'cream'),
    s('circle', { cx: 65, cy: 93, r: 8 }, 'red'),
    s('path', { d: 'M100 92h28l-4 46h-20z' }, 'sky'),
    s('path', { d: 'M102 106h24l-2 30h-20z' }, 'yellow'),
    s('path', { d: 'M114 30v60', ...DASH(3, '4 4') }, 'yellow', { stroke: true })
  ],
  solana: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'sky'),
    s('circle', { cx: 112, cy: 44, r: 18 }, 'yellow', { accent: true }),
    s('path', { d: rays(112, 44, 24, 32, 8), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M14 104h132v42H14z' }, 'cream'),
    s('path', { d: 'M14 104h132M24 104v42M44 104v42M64 104v42M84 104v42M104 104v42M124 104v42', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M20 66h80', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 66h18v24H30zM62 66h22l-2 20H64z' }, 'pink')
  ],
  tamal: [
    s('path', { d: 'M20 96q10-38 60-38t60 38q-60 22-120 0z' }, 'yellow', { accent: true }),
    s('path', { d: 'M40 80q40-16 80 0', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M14 100l36-6 30 22 30-22 36 6-24 30H38z' }, 'mint'),
    s('path', { d: 'M50 94l30 22 30-22', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M60 56q-4-12 4-22M90 54q-4-12 4-22', ...SW(3) }, 'gray', { stroke: true })
  ],
  teorema: [
    s('path', { d: 'M56 100l48 0 0-36z' }, 'yellow', { accent: true }),
    s('path', { d: rects([[56, 100, 48, 48]]) }, 'blue'),
    s('path', { d: rects([[104, 64, 36, 36]]) }, 'red'),
    s('path', { d: 'M56 100l36-48 48 12-36 0z' }, 'green'),
    s('path', { d: 'M56 100L92 52l48 12', ...SW(2) }, 'dark', { stroke: true })
  ],
  tino: [
    s('circle', { cx: 74, cy: 86, r: 54 }, 'red'),
    s('circle', { cx: 74, cy: 86, r: 38 }, 'white'),
    s('circle', { cx: 74, cy: 86, r: 22 }, 'red'),
    s('circle', { cx: 74, cy: 86, r: 8 }, 'yellow', { accent: true }),
    s('path', { d: 'M76 84l52-44', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M124 44l8-18 6 6zM128 38l18-4-6-6z' }, 'blue')
  ],
  'transgénero': [
    s('path', { d: 'M30 20v120', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M33 26q30-8 54 0t50 0v72q-26 8-50 0t-54 0z' }, 'white'),
    s('path', { d: 'M33 26q30-8 54 0t50 0v14q-26 8-50 0t-54 0zM33 84q30-8 54 0t50 0v14q-26 8-50 0t-54 0z' }, 'sky', { accent: true }),
    s('path', { d: 'M33 40q30-8 54 0t50 0v15q-26 8-50 0t-54 0zM33 69q30-8 54 0t50 0v15q-26 8-50 0t-54 0z' }, 'pink'),
    s('path', { d: 'M33 26q30-8 54 0t50 0v72q-26 8-50 0t-54 0z', ...SW(2) }, 'gray', { stroke: true })
  ],
  trascender: [
    s('path', { d: 'M14 84h132', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 136V44M60 64l20-24 20 24', ...SW(10) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M66 76l-8 8 8 6M94 76l8 8-8 6', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: sparkle(116, 30, 12) + sparkle(44, 36, 9) }, 'yellow')
  ],
  'veintidós': [
    s('rect', { x: 18, y: 36, width: 124, height: 88, rx: 8 }, 'cream'),
    s('path', { d: dots(Array.from({ length: 10 }, (_, i) => [30 + (i % 5) * 12, 56 + Math.floor(i / 5) * 14]), 5) }, 'blue', { accent: true }),
    s('path', { d: dots(Array.from({ length: 10 }, (_, i) => [94 + (i % 5) * 12, 56 + Math.floor(i / 5) * 14]), 5) }, 'blue'),
    s('path', { d: dots([[68, 104], [92, 104]], 7) }, 'red'),
    s('path', { d: 'M80 44v44', ...SW(3) }, 'gray', { stroke: true })
  ],
  visiblemente: [
    s('path', { d: 'M14 80q66-60 132 0q-66 60-132 0z' }, 'white'),
    s('path', { d: 'M14 80q66-60 132 0q-66 60-132 0z', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 26 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'dark'),
    s('circle', { cx: 88, cy: 72, r: 5 }, 'white'),
    s('path', { d: rays(80, 80, 52, 62, 6, -150).split('M').slice(0, 4).join('M'), ...SW(4) }, 'yellow', { stroke: true })
  ],
  vivero: [
    s('path', { d: 'M18 136V76l62-46 62 46v60z' }, 'mint'),
    s('path', { d: 'M18 76l62-46 62 46M18 76v60M142 76v60M80 30v106M18 104h124', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 118h20l-3 18H33zM70 118h20l-3 18H73zM110 118h20l-3 18h-14z' }, 'orange'),
    s('path', { d: leaflet(40, 118, -60, 16, 5) + leaflet(40, 118, -120, 16, 5) + leaflet(80, 118, -60, 16, 5) + leaflet(80, 118, -120, 16, 5) + leaflet(120, 118, -60, 16, 5) + leaflet(120, 118, -120, 16, 5) }, 'green', { accent: true })
  ],
  aduanero: [
    ...person(54, 116, 'navy', { accent: true }),
    s('path', { d: 'M38 52q16-12 32 0v6H38z' }, 'navy'),
    s('path', { d: 'M36 56h38', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 54, cy: 52, r: 3 }, 'yellow'),
    s('rect', { x: 14, y: 116, width: 132, height: 24, rx: 3 }, 'brown'),
    s('rect', { x: 92, y: 84, width: 46, height: 32, rx: 6 }, 'red'),
    s('path', { d: 'M106 84v-8h18v8', ...SW(4) }, 'dark', { stroke: true })
  ],
  aferrar: [
    s('path', { d: 'M14 64h132', ...SW(14) }, 'brown', { stroke: true }),
    s('path', { d: 'M54 50q0-10 10-10h34q10 0 10 10v38q0 30-28 30t-26-30z' }, 'skin', { accent: true }),
    s('path', { d: 'M66 42v34M80 42v34M94 42v34', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 64, y: 112, width: 32, height: 34, rx: 4 }, 'blue'),
    s('path', { d: 'M40 40l-8-8M120 40l8-8M42 84l-10 4M118 84l10 4', ...SW(4) }, 'orange', { stroke: true })
  ],
  ardor: [
    ...person(80, 140, 'blue', { h: 60, w: 44, r: 16 }),
    s('path', { d: 'M80 124q-18-4-16-22 2-10 8-16 0 10 6 12-2-14 10-24 0 12 8 18 4 6 2 14-2 16-18 18z' }, 'orange', { accent: true }),
    s('path', { d: 'M80 120q-8-2-6-10 2-6 6-8 2 6 6 8 2 8-6 10z' }, 'yellow'),
    s('path', { d: 'M70 52q10 6 20 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  'aritmética': [
    s('rect', { x: 20, y: 24, width: 120, height: 112, rx: 6, ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M24 52h112M24 80h112M24 108h112', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[40, 52], [52, 52], [100, 52], [112, 52], [124, 52]], 6) }, 'red', { accent: true }),
    s('path', { d: dots([[40, 80], [52, 80], [64, 80], [112, 80], [124, 80]], 6) }, 'blue'),
    s('path', { d: dots([[40, 108], [88, 108], [100, 108], [112, 108], [124, 108]], 6) }, 'green')
  ],
  arpa: [
    s('path', { d: 'M40 136V30q0-10 10-8q50 10 70 50l14 10', ...SW(10) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M40 136h60l34-54', ...SW(10) }, 'brown', { stroke: true }),
    s('path', { d: 'M54 30v106M68 36v100M82 44v92M96 54v74M110 68v46', ...SW(2) }, 'yellow', { stroke: true }),
    s('circle', { cx: 40, cy: 26, r: 8 }, 'yellow')
  ],
  aseguradora: [
    s('path', { d: 'M18 72q62-64 124 0z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 72v4', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 72q15-10 31 0 15-10 31 0 15-10 31 0 15-10 31 0', ...SW(2) }, 'navy', { stroke: true }),
    s('path', { d: 'M80 14v8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 104l36-24 36 24v34H44z' }, 'cream'),
    s('path', { d: 'M38 106l42-30 42 30', ...SW(6) }, 'red', { stroke: true }),
    s('rect', { x: 72, y: 112, width: 16, height: 26 }, 'brown')
  ],
  asteroide: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'navy'),
    s('path', { d: 'M20 140l52-50M34 146l46-44M14 120l50-44', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M78 50q20-20 44-8t16 40-30 24-34-18 4-38z' }, 'gray', { accent: true }),
    s('path', { d: dots([[100, 60], [118, 82], [92, 86]], 7) }, 'dark'),
    s('path', { d: star(36, 32, 5) + star(130, 128, 5) }, 'yellow')
  ],
  boricua: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'sky'),
    s('path', { d: 'M14 120q30-8 66 0t66 0v26H14z' }, 'blue'),
    s('path', { d: 'M30 122q50-30 100 0z' }, 'tan'),
    s('path', { d: 'M82 112q4-40-8-64', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(74, 48, 200, 34, 8) + leaflet(74, 48, 160, 30, 7) + leaflet(74, 48, -20, 34, 8) + leaflet(74, 48, 20, 30, 7) + leaflet(74, 48, -90, 26, 6) }, 'green', { accent: true }),
    s('circle', { cx: 120, cy: 34, r: 12 }, 'yellow')
  ],
  cambiario: [
    s('circle', { cx: 50, cy: 64, r: 28 }, 'yellow', { accent: true }),
    s('circle', { cx: 50, cy: 64, r: 18, ...SW(3) }, 'orange', { stroke: true }),
    s('circle', { cx: 110, cy: 100, r: 28 }, 'gray'),
    s('circle', { cx: 110, cy: 100, r: 18, ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M90 34q30 0 30 30M112 56l8 10 8-10', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M70 130q-30 0-30-30M32 106l8-10 8 10', ...SW(5) }, 'blue', { stroke: true })
  ],
  'champú': [
    s('rect', { x: 50, y: 50, width: 60, height: 88, rx: 14 }, 'purple', { accent: true }),
    s('rect', { x: 66, y: 34, width: 28, height: 16, rx: 3 }, 'dark'),
    s('rect', { x: 60, y: 78, width: 40, height: 34, rx: 6 }, 'white'),
    s('path', { d: 'M74 34v-8h20', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: ring(36, 46, 10) + ring(124, 40, 8) + ring(130, 70, 6) + ring(28, 78, 6), ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: dots([[80, 95]], 8) }, 'pink')
  ],
  colaborativo: [
    ...person(36, 136, 'blue'),
    ...person(124, 136, 'green', { accent: true }),
    s('rect', { x: 50, y: 70, width: 60, height: 40, rx: 4 }, 'tan'),
    s('path', { d: 'M50 80h60M80 70v10', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M46 100l10-14M114 100l-10-14', ...SW(7) }, 'skin', { stroke: true })
  ],
  colmena: [
    s('path', { d: 'M40 130q-6-50 10-74q30-36 60 0q16 24 10 74z' }, 'yellow', { accent: true }),
    s('path', { d: 'M44 110h72M42 90h76M48 70h64', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M70 130v-14q10-8 20 0v14z' }, 'dark'),
    s('path', { d: ells([[30, 40, 8, 6], [126, 36, 8, 6]]) }, 'dark'),
    s('path', { d: ells([[28, 32, 5, 4], [124, 28, 5, 4]]) }, 'sky'),
    s('path', { d: 'M36 40q14-8 18 6M120 36q-10 8-10 18', ...DASH(2, '3 4') }, 'gray', { stroke: true })
  ],
  'cuña': [
    s('path', { d: 'M14 96h56l10 10 10-10h56v40H14z' }, 'brown'),
    s('path', { d: 'M14 112h132M14 126h132', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M62 40h36l-18 70z' }, 'orange', { accent: true }),
    s('path', { d: 'M54 18l12 12M106 18l-12 12M80 12v12', ...SW(4) }, 'gray', { stroke: true })
  ],
  denunciante: [
    ...person(54, 136, 'blue', { accent: true }),
    s('path', { d: 'M66 100l40-20', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 112, cy: 78, r: 6 }, 'skin'),
    s('path', { d: 'M118 76h14', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M48 78h22l6 6-6 6H52z' }, 'gray'),
    s('path', { d: 'M84 66l10-10M86 80l14-2M80 52l4-14', ...SW(4) }, 'orange', { stroke: true })
  ],
  'derivación': [
    s('path', { d: 'M80 140V86', ...SW(16) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M80 90q0-24-40-44M80 90q0-24 40-44', ...SW(12) }, 'sky', { stroke: true }),
    s('path', { d: 'M26 36l16 12 4-20zM134 36l-16 12-4-20z' }, 'sky'),
    s('path', { d: 'M74 128v-20M86 120v-14', ...SW(3) }, 'white', { stroke: true })
  ],
  desacato: [
    s('rect', { x: 92, y: 98, width: 48, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M100 80l30-30', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 94, y: 36, width: 30, height: 18, rx: 4, transform: 'rotate(45 109 45)' }, 'brown'),
    ...person(54, 136, 'red', { accent: true }),
    s('path', { d: 'M40 106h28', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M46 74q8-6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M36 52l-6-6M72 52l6-6', ...SW(4) }, 'dark', { stroke: true })
  ],
  desastroso: [
    s('path', { d: 'M24 136V84l40-30 30 22-10 10 16 8v42z' }, 'tan'),
    s('path', { d: 'M100 136l12-40 28 10v30z' }, 'gray'),
    s('path', { d: 'M18 86l46-36 32 26', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M54 84l-6 14 8 8-6 14', ...SW(4) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: 'M104 56q-10-14 4-22 4-14 18-10 14-4 18 8 10 10-2 22z' }, 'gray'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'brown', { stroke: true })
  ],
  desconfiar: [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'yellow', { accent: true }),
    s('path', { d: 'M44 70h26M90 70h26', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[64, 76], [110, 76]], 5) }, 'dark'),
    s('path', { d: 'M42 54l26 6M92 58l24-8', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M62 108q18-6 36 4', ...SW(5) }, 'dark', { stroke: true })
  ],
  descriptivo: [
    ...paper(28, 22, 84, 116),
    s('rect', { x: 40, y: 34, width: 60, height: 36, rx: 3 }, 'sky'),
    s('path', { d: 'M40 70l20-20 14 12 10-8 16 16z' }, 'green'),
    s('path', { d: 'M40 84h60M40 98h60M40 112h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 132l30-56 10 6-30 56-12 6z' }, 'yellow', { accent: true }),
    s('path', { d: 'M134 76l4-8 10 6-4 8z' }, 'pink')
  ],
  desesperanza: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'navy'),
    s('path', { d: 'M40 136q-4-36 26-40h28q26 4 26 40z' }, 'gray', { accent: true }),
    s('circle', { cx: 74, cy: 84, r: 14 }, 'skin'),
    s('path', { d: 'M62 104l10-12', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M120 136v-30q0-12-14-14', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M106 92q-10 2-10 12l12-2z' }, 'brown'),
    s('path', { d: 'M30 36q20-12 34 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  desprestigio: [
    s('path', { d: 'M52 18h56l-12 28H64z' }, 'blue'),
    s('circle', { cx: 80, cy: 76, r: 30 }, 'yellow', { accent: true }),
    s('path', { d: 'M74 46l12 14-10 12 12 12-8 22', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 140h80', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[46, 124], [62, 130], [98, 128], [114, 122]], 5) }, 'orange'),
    s('path', { d: 'M126 70v24M118 86l8 8 8-8', ...SW(4) }, 'red', { stroke: true })
  ],
  digerir: [
    s('path', { d: 'M62 14v22q0 18 20 20 34 4 34 38 0 30-34 34-26 2-30-16', ...SW(16) }, 'pink', { stroke: true, accent: true }),
    s('path', { d: 'M52 112q-6 10-6 26', ...SW(10) }, 'pink', { stroke: true }),
    s('path', { d: dots([[86, 90], [98, 100], [80, 106]], 6) }, 'orange'),
    s('path', { d: 'M28 30v20M20 44l8 8 8-8', ...SW(4) }, 'green', { stroke: true })
  ],
  dinamita: [
    s('path', { d: rects([[34, 60, 26, 76], [62, 60, 26, 76], [90, 60, 26, 76]]) }, 'red', { accent: true }),
    s('path', { d: 'M30 82h90M30 116h90', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M75 60q0-26 26-34', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: burst(110, 24, 12, 5, 8) }, 'yellow'),
    s('circle', { cx: 110, cy: 24, r: 4 }, 'orange')
  ],
  diplomado: [
    ...person(62, 140, 'navy', { h: 52, w: 36, r: 14 }),
    s('path', { d: 'M36 58l26-12 26 12-26 10z' }, 'black'),
    s('path', { d: 'M84 58v14', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M74 104l30-14', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 100, y: 74, width: 40, height: 14, rx: 7, transform: 'rotate(-25 120 81)' }, 'cream', { accent: true }),
    s('path', { d: 'M118 74l4 16', ...SW(4) }, 'red', { stroke: true })
  ],
  'ebullición': [
    s('path', { d: 'M30 70h100v50q0 14-14 14H44q-14 0-14-14z' }, 'gray', { accent: true }),
    s('path', { d: 'M20 74h10M130 74h10', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M34 70q8-12 16 0t16 0 16 0 16 0 16 0 16 0' }, 'sky'),
    s('path', { d: ring(54, 54, 7) + ring(80, 48, 9) + ring(106, 56, 6), ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M60 32q-6-8 0-16M100 32q-6-8 0-16', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M50 146q4-10 10 0 4-10 10 0M90 146q4-10 10 0 4-10 10 0', ...SW(4) }, 'orange', { stroke: true })
  ],
  'edén': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'mint'),
    ...tree(66, 'green', 'brown'),
    s('path', { d: dots([[50, 60], [72, 50], [84, 72], [58, 80], [44, 88]], 6) }, 'red', { accent: true }),
    s('path', { d: dots([[118, 120], [134, 112]], 6) }, 'pink'),
    s('path', { d: dots([[118, 120], [134, 112]], 2) }, 'yellow'),
    s('path', { d: 'M110 130q14-6 30 0', ...SW(3) }, 'green', { stroke: true })
  ],
  enfriar: [
    s('path', { d: 'M38 66h60v48q0 18-18 18H56q-18 0-18-18z' }, 'red', { accent: true }),
    s('path', { d: 'M98 78q16 0 14 16t-14 10', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M52 56q-6-8 0-16', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M118 24v40M101 34l34 20M101 54l34-20', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: 'M24 70v50M16 110l8 10 8-10', ...SW(5) }, 'blue', { stroke: true })
  ],
  escupir: [
    s('path', { d: HEAD, transform: 'translate(-16 0)' }, 'skin', { accent: true }),
    s('path', { d: 'M98 92q6-4 12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M114 92q14-10 22 6', ...DASH(3, '3 5') }, 'gray', { stroke: true }),
    s('ellipse', { cx: 138, cy: 108, rx: 4, ry: 6 }, 'dark'),
    s('circle', { cx: 84, cy: 60, r: 5 }, 'dark'),
    s('path', { d: 'M32 30q30-20 60-4', ...SW(10) }, 'brown', { stroke: true })
  ],
  esgrima: [
    backdrop('sky'),
    ...lean(42, 136, -8, 'white', { h: 40, w: 24, r: 11 }),
    ...lean(118, 136, 8, 'white', { h: 40, w: 24, r: 11 }),
    s('path', { d: 'M42 136l4-44M118 136l-4-44', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[36, 80], [124, 80]], 11) }, 'dark'),
    s('path', { d: 'M52 106l60-32M108 106l-60-32', ...SW(4) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: dots([[54, 105], [106, 105]], 4) }, 'red')
  ],
  fisco: [
    s('path', { d: 'M20 56l60-36 60 36z' }, 'gray'),
    s('rect', { x: 24, y: 56, width: 112, height: 10 }, 'gray'),
    s('path', { d: 'M36 70v52M58 70v52M102 70v52M124 70v52', ...SW(10) }, 'cream', { stroke: true }),
    s('rect', { x: 18, y: 122, width: 124, height: 14 }, 'gray'),
    s('path', { d: dots([[80, 98], [80, 82]], 14) }, 'yellow', { accent: true }),
    s('path', { d: 'M74 98h12M74 82h12', ...SW(3) }, 'orange', { stroke: true })
  ],
  foso: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'sky'),
    s('path', { d: 'M14 120h132v26H14z' }, 'blue', { accent: true }),
    s('path', { d: 'M40 116V56h12v-10h12v10h8v-10h16v10h8v-10h12v10h12v60z' }, 'gray'),
    s('path', { d: 'M70 116v-24q10-10 20 0v24z' }, 'dark'),
    s('path', { d: 'M14 116h26M120 116h26', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M24 132q8-4 16 0M100 134q8-4 16 0', ...SW(3) }, 'white', { stroke: true })
  ],
  'fábula': [
    ground(),
    s('path', { d: 'M24 134q0-28 28-28t28 28z' }, 'green', { accent: true }),
    s('circle', { cx: 86, cy: 118, r: 8 }, 'mint'),
    s('path', { d: 'M38 118l8-8 8 8-8 8zM54 118l8-8 8 8-8 8z' }, 'mint'),
    s('path', { d: 'M108 104q-6-30 0-42M120 104q4-30 12-40', ...SW(7) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 116, cy: 116, rx: 18, ry: 14 }, 'tan'),
    s('path', { d: 'M100 130h30', ...SW(6) }, 'tan', { stroke: true })
  ],
  'galés': [
    s('path', { d: 'M14 120q40-30 72-10t60-8v38H14z' }, 'green'),
    s('path', { d: 'M80 136V76', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 118, -150, 26, 6) }, 'green'),
    s('path', { d: ells([[80, 52, 30, 30]]) }, 'yellow'),
    s('path', { d: dots(around(80, 52, 22, 6, -90), 12) }, 'yellow'),
    s('circle', { cx: 80, cy: 52, r: 14 }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 52, r: 7 }, 'yellow')
  ],
  'geopolítica': [
    s('circle', { cx: 80, cy: 86, r: 56 }, 'blue'),
    s('path', { d: 'M40 60q16-14 30-4t6 24-22 14-14-34zM92 52q24-6 34 16t-10 30-20-10-4-36zM70 112q16-4 22 8t-14 16z' }, 'green'),
    s('path', { d: 'M62 54q-10-6-6-16h10q4 10-4 16zM56 60h12v-6H56z' }, 'dark'),
    s('circle', { cx: 62, cy: 30, r: 7 }, 'dark'),
    s('path', { d: 'M104 66h16l-2-24q8-6 4-14l-8 4-8-6-6 8q-4 6 2 10z' }, 'red', { accent: true })
  ],
  ineptitud: [
    s('rect', { x: 20, y: 110, width: 120, height: 14, rx: 3 }, 'brown'),
    s('rect', { x: 40, y: 92, width: 40, height: 18, rx: 6 }, 'skin'),
    s('path', { d: 'M100 40L66 84', ...SW(8) }, 'brown', { stroke: true }),
    s('rect', { x: 50, y: 74, width: 34, height: 16, rx: 3, transform: 'rotate(-52 67 82)' }, 'gray', { accent: true }),
    s('path', { d: star(110, 72, 9) + star(30, 70, 7) + star(126, 100, 6) }, 'yellow'),
    s('path', { d: 'M32 90l-10-6', ...SW(3) }, 'red', { stroke: true })
  ],
  insuperable: [
    s('path', { d: rects([[22, 112, 30, 24], [108, 100, 30, 36]]) }, 'gray'),
    s('rect', { x: 62, y: 70, width: 36, height: 66 }, 'yellow', { accent: true }),
    s('path', { d: 'M66 30h28v8q0 18-14 18T66 38zM80 56v8M70 66h20' }, 'orange'),
    s('path', { d: 'M80 54v12M70 66h20', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M66 36q-10 0-8 8t8 4M94 36q10 0 8 8t-8 4', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: star(80, 100, 12) }, 'white'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'dark', { stroke: true })
  ],
  intercultural: [
    s('circle', { cx: 80, cy: 70, r: 44 }, 'sky'),
    s('path', { d: 'M48 50q14-12 26-2t2 22-20 10-8-30zM96 40q22-2 24 20t-16 16-8-36z' }, 'green'),
    ...person(34, 140, 'orange', { h: 34, w: 24, r: 10 }),
    ...person(126, 140, 'purple', { h: 34, w: 24, r: 10, accent: true }),
    s('path', { d: 'M44 118q36 14 72 0', ...SW(6) }, 'skin', { stroke: true })
  ],
  jota: [
    s('path', { d: 'M62 74h36l14 62H48z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 58, r: 13 }, 'skin'),
    s('path', { d: 'M66 80L40 40M94 80l26-40', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: dots([[38, 36], [122, 36]], 7) }, 'brown'),
    s('path', { d: 'M48 136q32 8 64 0', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 60q-6-8 0-16M136 60q6-8 0-16', ...SW(3) }, 'orange', { stroke: true })
  ],
  judicatura: [
    s('path', { d: 'M18 52l62-34 62 34z' }, 'gray', { accent: true }),
    s('rect', { x: 22, y: 52, width: 116, height: 10 }, 'gray'),
    s('path', { d: 'M34 66v52M54 66v52M106 66v52M126 66v52', ...SW(10) }, 'cream', { stroke: true }),
    s('rect', { x: 16, y: 118, width: 128, height: 16 }, 'gray'),
    s('path', { d: 'M80 70v36M64 106h32M66 78h28', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M60 78l-6 14h12zM100 78l-6 14h12z' }, 'yellow')
  ],
  lanzador: [
    s('path', { d: 'M14 136q66-20 132 0z' }, 'tan'),
    ...lean(66, 134, 10, 'navy', { accent: true }),
    s('path', { d: 'M72 92l20-30', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 96, cy: 56, r: 8 }, 'white'),
    s('circle', { cx: 96, cy: 56, r: 8, ...SW(2) }, 'red', { stroke: true }),
    s('path', { d: 'M60 102l-16 6', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: 'M110 50h24M108 62h20', ...SW(3) }, 'gray', { stroke: true })
  ],
  'liberalización': [
    s('path', { d: 'M28 136V76q0-36 36-36t36 36v60z' }, 'cream'),
    s('path', { d: 'M28 136V76q0-36 36-36t36 36v60M46 50v86M64 40v96M82 50v86M28 136h72', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 96l20-34', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 52q10-18 24-12-4 8-10 10 10 2 12 12-14 2-20-6-4 4-10 2z' }, 'yellow', { accent: true }),
    s('circle', { cx: 128, cy: 38, r: 2 }, 'dark')
  ],
  liguilla: [
    s('path', { d: 'M24 32h24v40h24M24 112h24V72M24 52h0', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[22, 32], [22, 112]], 8) }, 'blue'),
    s('path', { d: dots([[22, 52], [22, 92]], 8) }, 'red'),
    s('path', { d: 'M30 52h18M30 92h18v-20', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 52h36v12q0 22-18 22T96 64zM114 86v16M100 106h28v12h-28z' }, 'yellow', { accent: true }),
    s('path', { d: 'M96 58q-12 0-10 12t10 6M132 58q12 0 10 12t-10 6', ...SW(4) }, 'yellow', { stroke: true })
  ],
  maqueta: [
    s('path', { d: 'M16 124l64 18 64-18-64-16z' }, 'mint'),
    s('path', { d: 'M40 118V66l30-14v74zM70 52l26 10v64l-26 0z' }, 'white'),
    s('path', { d: 'M40 118V66l30-14 26 10v56', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 70l24-8v52l-24 4z' }, 'sky', { accent: true }),
    s('path', { d: grid(48, 74, 2, 3, 6, 8, 10, 14) }, 'blue'),
    s('path', { d: dots([[124, 124], [30, 120]], 7) }, 'green'),
    s('path', { d: 'M22 30l44 0', ...SW(6) }, 'yellow', { stroke: true })
  ],
  mareo: [
    s('path', { d: 'M14 120q16-14 33 0t33 0 33 0 33 0v26H14z' }, 'blue'),
    s('circle', { cx: 80, cy: 66, r: 42 }, 'mint', { accent: true }),
    s('path', { d: spiral(62, 58) + spiral(94, 58), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 88q8-6 16 0t16 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 24q10-10 20 0M100 24q10-10 20 0', ...SW(3) }, 'purple', { stroke: true })
  ],
  masculinidad: [
    ...person(80, 140, 'blue', { h: 48, w: 40, r: 20, accent: true }),
    s('path', { d: 'M62 74q18 26 36 0q-4 18-18 18T62 74z' }, 'brown'),
    s('path', { d: 'M66 78q14-4 28 0', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M60 92l-26-10-4-20M100 92l26-10 4-20', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: dots([[30, 58], [130, 58]], 9) }, 'skin'),
    s('path', { d: 'M62 50q18-14 36 0', ...SW(6) }, 'brown', { stroke: true })
  ],
  matador: [
    s('path', { d: 'M14 136q66-10 132 0v10H14z' }, 'tan'),
    ...person(46, 136, 'yellow', { accent: true }),
    s('path', { d: 'M58 98l30-6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M86 90q14 10 6 46H60q12-20 26-46z' }, 'red'),
    s('path', { d: ells([[124, 106, 20, 16]]) + 'M110 116v20h6v-16zM132 116v20h6v-20z' }, 'dark'),
    s('ellipse', { cx: 104, cy: 102, rx: 10, ry: 13 }, 'dark'),
    s('path', { d: 'M96 92q-8-6-6-16M112 92q8-6 6-16', ...SW(4) }, 'cream', { stroke: true })
  ],
  maternal: [
    s('circle', { cx: 80, cy: 40, r: 16 }, 'skin'),
    s('path', { d: 'M56 136q-4-60 24-80 28 20 24 80z' }, 'pink', { accent: true }),
    s('ellipse', { cx: 80, cy: 88, rx: 22, ry: 14 }, 'cream'),
    s('circle', { cx: 68, cy: 84, r: 9 }, 'skin'),
    s('path', { d: 'M56 96q24 10 48-6', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: heart(118, 34, 12) }, 'red')
  ],
  'meteorológico': [
    s('circle', { cx: 60, cy: 54, r: 24 }, 'yellow', { accent: true }),
    s('path', { d: rays(60, 54, 30, 38, 8), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M60 104q-18 0-18-16t20-16q6-20 30-18 22 2 24 22 18 0 18 14t-18 14z' }, 'gray'),
    s('path', { d: 'M66 116l-6 14M88 116l-6 14M110 116l-6 14', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M24 120v-24', ...SW(6) }, 'red', { stroke: true }),
    s('circle', { cx: 24, cy: 124, r: 7 }, 'red')
  ],
  modestia: [
    ...person(60, 136, 'mint', { accent: true }),
    s('path', { d: 'M52 82q8-4 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[50, 80], [70, 80]], 4) }, 'pink'),
    s('path', { d: 'M74 106l22 2', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M100 92h30v8q0 18-15 18t-15-18zM115 118v10M104 132h22' }, 'yellow'),
    s('path', { d: 'M115 118v10M104 132h22', ...SW(5) }, 'yellow', { stroke: true })
  ],
  nerviosismo: [
    ...face(80, 76, 50, 'yellow', 'flat', { accent: true }),
    s('path', { d: 'M60 102q4-6 8 0t8 0 8 0 8 0 8 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: drop(132, 56, 6) + drop(30, 70, 5) }, 'sky'),
    s('path', { d: 'M20 30l8 6-6 6 8 6M140 110l-8 6 6 6-8 6', ...SW(3) }, 'orange', { stroke: true })
  ],
  oportunista: [
    s('rect', { x: 18, y: 20, width: 52, height: 116, rx: 3 }, 'brown'),
    s('path', { d: 'M70 20l20 10v116l-20-10z' }, 'tan'),
    s('circle', { cx: 116, cy: 54, r: 16 }, 'yellow', { accent: true }),
    s('circle', { cx: 116, cy: 54, r: 10, ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M100 130q-6-30 6-50', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M96 82q6-14 16-8l2 10-8 4z' }, 'skin'),
    s('path', { d: 'M134 34l6-6M138 54h8M134 74l6 6', ...SW(3) }, 'yellow', { stroke: true })
  ],
  oratoria: [
    s('path', { d: 'M46 96h68l-8 44H54z' }, 'brown', { accent: true }),
    ...person(80, 96, 'blue', { h: 30, w: 30, r: 12 }),
    s('path', { d: 'M80 96V76', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 76, y: 66, width: 8, height: 12, rx: 4 }, 'dark'),
    s('path', { d: 'M94 62l12-10M68 62l-12-10', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M118 34q10 10 0 22M128 26q16 18 0 38M42 34q-10 10 0 22M32 26q-16 18 0 38', ...SW(4) }, 'orange', { stroke: true })
  ],
  panadero: [
    ...person(58, 140, 'white', { h: 52, w: 36, r: 14 }),
    s('rect', { x: 40, y: 88, width: 36, height: 52, rx: 12, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M44 60q-10-16 6-20 4-12 16-4 12-6 14 6 10 8 0 18z' }, 'white'),
    s('path', { d: 'M44 60q-10-16 6-20 4-12 16-4 12-6 14 6 10 8 0 18z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 112q0-18 28-24t32 8q0 18-30 24t-30-8z' }, 'orange', { accent: true }),
    s('path', { d: 'M104 98l6 12M118 94l6 12M132 94l4 10', ...SW(3) }, 'yellow', { stroke: true })
  ],
  patinar: [
    s('path', { d: 'M46 30h40v50l36 14q8 4 8 12v6H46z' }, 'white'),
    s('path', { d: 'M46 30h40v50l36 14q8 4 8 12v6H46z', ...SW(4) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M60 112v14M114 112v14', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 126h106q8 0 10-8', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 50l-14 6M86 64l-14 6M86 78l-14 6', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M20 142h120', ...SW(3) }, 'sky', { stroke: true })
  ],
  'primogénito': [
    ground(),
    ...person(44, 136, 'red', { h: 52, w: 30, r: 13, accent: true }),
    ...person(90, 136, 'blue', { h: 38, w: 24, r: 11 }),
    ...person(126, 136, 'green', { h: 26, w: 20, r: 9 }),
    s('path', { d: star(44, 30, 10) }, 'yellow')
  ],
  prior: [
    s('path', { d: 'M80 54l-28 14-8 72h72l-8-72z' }, 'brown', { accent: true }),
    s('circle', { cx: 80, cy: 46, r: 16 }, 'skin'),
    s('path', { d: 'M64 42q16-14 32 0', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M54 96h52M90 96l6 30', ...SW(4) }, 'cream', { stroke: true }),
    s('path', { d: 'M52 64q28 16 56 0l-6-8q-22 10-44 0z' }, 'tan'),
    s('path', { d: 'M124 140V26M114 36h20', ...SW(5) }, 'yellow', { stroke: true })
  ],
  proverbio: [
    s('path', { d: bubble(56, 16, 88, 64) }, 'cream'),
    s('path', { d: bubble(56, 16, 88, 64), ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 100, cy: 42, r: 14 }, 'yellow', { accent: true }),
    s('path', { d: 'M94 58h12M96 64h8', ...SW(3) }, 'gray', { stroke: true }),
    ...person(44, 140, 'purple', { h: 40, w: 28, r: 12 }),
    s('path', { d: 'M36 84q8 14 16 0z' }, 'white')
  ],
  puja: [
    ...person(46, 140, 'blue'),
    s('path', { d: 'M58 100l14-36', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M72 64V46', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 72, cy: 34, r: 16 }, 'orange', { accent: true }),
    s('rect', { x: 102, y: 108, width: 40, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M108 98l26-26', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 120, y: 52, width: 26, height: 16, rx: 3, transform: 'rotate(45 133 60)' }, 'brown')
  ],
  reapertura: [
    s('path', { d: 'M24 52l8-20h96l8 20z' }, 'red'),
    s('path', { d: 'M24 52q8 10 16 0t16 0 16 0 16 0 16 0 16 0 16 0' }, 'red'),
    s('rect', { x: 28, y: 62, width: 104, height: 74 }, 'cream'),
    s('path', { d: 'M40 66h80v20H40z' }, 'gray'),
    s('path', { d: 'M40 86h80v50H40z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 128V96M70 106l10-10 10 10', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: sparkle(140, 24, 9) + sparkle(18, 30, 7) }, 'orange')
  ],
  renombrado: [
    s('path', { d: 'M60 14h40l26 122H34z' }, 'cream'),
    ...person(80, 136, 'purple', { accent: true }),
    s('path', { d: 'M66 104l-14-30M94 104l14-30', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: star(28, 40, 10) + star(132, 40, 10) + star(26, 96, 7) + star(134, 96, 7) }, 'yellow')
  ],
  riel: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'mint'),
    s('path', { d: 'M40 146l28-130h24l28 130z' }, 'tan'),
    s('path', { d: 'M38 144l12-12h60M44 120h72M50 98h60M55 78h50M60 60h40M64 44h32M67 30h26', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M54 146L74 16M106 146L86 16', ...SW(5) }, 'gray', { stroke: true, accent: true })
  ],
  ruidoso: [
    s('path', { d: 'M30 64h22l30-26v84L52 96H30z' }, 'dark', { accent: true }),
    s('path', { d: 'M96 60q12 20 0 40M110 46q22 34 0 68M124 34q32 46 0 92', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M24 30l10 10M24 130l10-10', ...SW(4) }, 'red', { stroke: true })
  ],
  salvamento: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'sky'),
    s('path', { d: 'M14 90q16-8 33 0t33 0 33 0 33 0v56H14z' }, 'blue'),
    s('circle', { cx: 80, cy: 92, r: 30, ...SW(16) }, 'white', { stroke: true }),
    s('path', { d: 'M80 62v14M80 108v14M50 92h14M96 92h14', ...SW(16, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 72, r: 11 }, 'skin'),
    s('path', { d: 'M110 92q24-30 30-70', ...SW(3) }, 'tan', { stroke: true })
  ],
  soplo: [
    s('path', { d: HEAD, transform: 'translate(-22 0)' }, 'skin'),
    s('ellipse', { cx: 106, cy: 92, rx: 5, ry: 4 }, 'dark'),
    s('path', { d: 'M114 84q10-4 20 0M114 94h24M114 104q10 4 20 0', ...SW(4) }, 'sky', { stroke: true, accent: true }),
    s('path', { d: dots([[140, 70], [146, 116]], 3) }, 'gray'),
    s('circle', { cx: 78, cy: 58, r: 5 }, 'dark')
  ],
  'soñador': [
    s('path', { d: 'M24 118q-4-22 20-22h80q16 0 16 22z' }, 'blue'),
    s('circle', { cx: 34, cy: 96, r: 12 }, 'skin'),
    s('rect', { x: 18, y: 118, width: 124, height: 14, rx: 4 }, 'brown'),
    s('path', { d: dots([[52, 76], [62, 62]], 4) }, 'gray'),
    s('path', { d: 'M70 48q-6-18 12-22 6-14 24-8 18-6 24 10 14 6 6 20-8 12-24 8-16 8-28 0-16 4-14-8z' }, 'cream'),
    s('path', { d: star(96, 34, 9) }, 'yellow', { accent: true }),
    s('path', { d: 'M118 22a12 12 0 1 0 6 20 9 9 0 1 1-6-20z' }, 'yellow')
  ],
  subsidiario: [
    s('rect', { x: 50, y: 18, width: 60, height: 48, rx: 4 }, 'navy', { accent: true }),
    s('path', { d: grid(60, 28, 4, 2, 8, 10, 12, 16) }, 'yellow'),
    s('path', { d: 'M80 66v18M34 84h92M34 84v14M126 84v14', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[16, 98, 36, 38], [108, 98, 36, 38]]) }, 'sky'),
    s('path', { d: grid(22, 106, 3, 2, 6, 8, 10, 14) + grid(114, 106, 3, 2, 6, 8, 10, 14) }, 'blue')
  ],
  suplir: [
    ...person(40, 136, 'red'),
    ...person(120, 136, 'green', { accent: true }),
    s('path', { d: 'M62 44h36M88 34l10 10-10 10', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M98 66H62M72 56L62 66l10 10', ...SW(5) }, 'red', { stroke: true })
  ],
  sustentabilidad: [
    s('path', { d: 'M80 22a58 58 0 0 1 56 46M136 68l6-14M136 68l-14-4M80 138a58 58 0 0 1-56-46M24 92l-6 14M24 92l14 4', ...SW(8) }, 'green', { stroke: true }),
    s('path', { d: 'M80 116q-30-30 0-70 30 40 0 70z' }, 'green', { accent: true }),
    s('path', { d: 'M80 128V58', ...SW(4) }, 'mint', { stroke: true }),
    s('path', { d: 'M40 40l8 8M120 120l-8-8', ...SW(1) }, 'mint', { stroke: true })
  ],
  talle: [
    s('path', { d: 'M54 24l-30 22 12 18 12-8v80h64V56l12 8 12-18-30-22q-6 10-26 10t-26-10z' }, 'blue'),
    s('path', { d: 'M46 92h68', ...SW(10) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M52 88v8M62 88v8M72 88v8M82 88v8M92 88v8M102 88v8', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M114 92q16 2 16 22t-10 22', ...SW(10) }, 'yellow', { stroke: true })
  ],
  tentar: [
    s('path', { d: 'M90 14v26', ...SW(3) }, 'brown', { stroke: true }),
    s('circle', { cx: 90, cy: 58, r: 20 }, 'red', { accent: true }),
    s('path', { d: leaflet(90, 40, -40, 16, 5) }, 'green'),
    s('path', { d: 'M24 136q6-40 40-50', ...SW(14) }, 'skin', { stroke: true }),
    s('path', { d: 'M62 86l10-12M64 88l14-6M64 92l14 0', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(122, 40, 10) + sparkle(116, 84, 7) }, 'yellow')
  ],
  terrenal: [
    s('rect', { x: 14, y: 14, width: 132, height: 70, rx: 8 }, 'sky'),
    s('path', { d: 'M14 84h132v52q0 10-10 10H24q-10 0-10-10z' }, 'brown', { accent: true }),
    s('path', { d: 'M14 84h132', ...SW(8) }, 'green', { stroke: true }),
    s('path', { d: 'M90 80V58l18-14 18 14v22z' }, 'cream'),
    s('path', { d: 'M86 60l22-18 22 18', ...SW(5) }, 'red', { stroke: true }),
    ...person(48, 80, 'orange', { h: 24, w: 16, r: 8 }),
    s('path', { d: dots([[40, 108], [80, 120], [120, 104]], 4) }, 'tan')
  ],
  tilde: [
    s('rect', { x: 26, y: 30, width: 108, height: 100, rx: 14 }, 'gray'),
    s('rect', { x: 34, y: 34, width: 92, height: 84, rx: 10 }, 'white'),
    s('path', { d: 'M48 80q16-24 32 0t32 0', ...SW(12) }, 'blue', { stroke: true, accent: true })
  ],
  'tórax': [
    s('path', { d: 'M40 20q40-10 80 0l10 50q0 50-50 70-50-20-50-70z' }, 'skin'),
    s('path', { d: 'M80 30v76', ...SW(6) }, 'cream', { stroke: true, accent: true }),
    s('path', { d: 'M78 44q-20-4-30 10M82 44q20-4 30 10M78 60q-22-4-32 12M82 60q22-4 32 12M78 76q-20-2-28 14M82 76q20-2 28 14', ...SW(5) }, 'cream', { stroke: true }),
    s('path', { d: 'M40 20q40-10 80 0l10 50q0 50-50 70-50-20-50-70z', ...SW(3) }, 'tan', { stroke: true })
  ],
  vertedero: [
    s('path', { d: 'M14 136q40-60 80-40t52 40z' }, 'brown'),
    s('path', { d: rects([[50, 94, 14, 10], [80, 88, 12, 12]]) + 'M110 104l12-8 6 10z' }, 'gray'),
    s('path', { d: dots([[40, 116], [96, 110], [70, 108]], 6) }, 'green'),
    s('path', { d: 'M30 34h42v34H30zM72 46h18l10 12v10H72z' }, 'orange', { accent: true }),
    s('path', { d: dots([[42, 70], [88, 70]], 7) }, 'dark'),
    s('path', { d: 'M30 34l-12 20', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: birds([[120, 36], [138, 50]]), ...SW(3) }, 'dark', { stroke: true })
  ],
  vestidura: [
    s('path', { d: 'M80 14q8 0 8 8t-8 8l-46 16h92L80 30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 40l-28 18 10 12 12-8-8 76h68l-8-76 12 8 10-12-28-18q-10 10-20 10t-20-10z' }, 'purple', { accent: true }),
    s('path', { d: 'M80 50v86', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M50 128h60', ...SW(5) }, 'yellow', { stroke: true })
  ],
  'viñedo': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'mint'),
    s('path', { d: 'M14 70q66-20 132 0', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M22 136l40-60M60 136l26-62M100 136l12-60M138 136l2-58', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: dots([[60, 104], [68, 104], [64, 112], [72, 112], [68, 120], [112, 96], [120, 96], [116, 104], [124, 104], [120, 112]], 5) }, 'purple', { accent: true }),
    s('circle', { cx: 120, cy: 34, r: 12 }, 'yellow')
  ],
  'volcánico': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'sky'),
    s('path', { d: 'M14 146l48-80h36l48 80z' }, 'brown'),
    s('path', { d: 'M62 66h36l-6 12-6-4-6 10-6-8-6 6z' }, 'red', { accent: true }),
    s('path', { d: 'M80 62q-14-20-4-36M80 62q14-24 30-28M80 62q-24-10-32-26', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: ells([[60, 28, 14, 10], [100, 22, 16, 10]]) }, 'gray')
  ],
  'vértice': [
    s('path', { d: 'M80 32l52 100H28z' }, 'sky'),
    s('path', { d: 'M80 32l52 100H28z', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M62 40l18-16 18 16', ...SW(4) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 32, r: 10 }, 'red', { accent: true }),
    s('path', { d: dots([[28, 132], [132, 132]], 5) }, 'navy')
  ],
  'índico': [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'blue', { accent: true }),
    s('path', { d: 'M22 60q10-28 34-34 4 14-4 24 10 16-6 34-14-2-24-24zM66 22q16 20 6 46-10 30-26 40-4-34 20-86zM104 30q30 14 34 40-14 10-30 0-10-20-4-40zM112 108q16-6 26 4-6 20-22 22-10-12-4-26z' }, 'green'),
    s('path', { d: 'M74 96q8-6 16 0t16 0M70 116q8-6 16 0t16 0', ...SW(3) }, 'sky', { stroke: true })
  ],
  acomodado: [
    s('path', { d: 'M22 76q0-16 16-16h60q16 0 16 16v40H22z' }, 'red', { accent: true }),
    s('path', { d: 'M14 100q0-12 12-12t12 12v32H14zM98 100q0-12 12-12t12 12v32H98z' }, 'red'),
    s('rect', { x: 30, y: 104, width: 76, height: 28, rx: 4 }, 'pink'),
    s('circle', { cx: 68, cy: 64, r: 13 }, 'skin'),
    s('rect', { x: 54, y: 78, width: 28, height: 28, rx: 8 }, 'blue'),
    s('path', { d: 'M120 136q-8-6-6-20 4-14 18-14t16 14-6 20z' }, 'yellow'),
    s('path', { d: 'M124 102l4-10h8l4 10', ...SW(3) }, 'orange', { stroke: true })
  ],
  anticuado: [
    s('path', { d: 'M28 132l10-50h84l10 50z' }, 'brown', { accent: true }),
    s('path', { d: 'M30 70q0-20 20-20h60q20 0 20 20v8h-28v-8H58v8H30z' }, 'dark'),
    s('circle', { cx: 80, cy: 106, r: 18 }, 'cream'),
    s('path', { d: dots(around(80, 106, 11, 8, -90), 3) }, 'dark'),
    s('path', { d: 'M18 18l24 24M18 30l12 12M30 18l12 12M18 18q10 6 12 24M18 18q6 10 24 12', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M142 18l-24 24M142 30l-12 12M130 18l-12 12', ...SW(2) }, 'gray', { stroke: true })
  ],
  apasionante: [
    s('rect', { x: 22, y: 18, width: 116, height: 64, rx: 6 }, 'dark'),
    s('rect', { x: 28, y: 24, width: 104, height: 52, rx: 3 }, 'green'),
    s('circle', { cx: 80, cy: 50, r: 9 }, 'white'),
    s('path', { d: busts([44, 80, 116], 146, 28, 34) }, 'orange', { accent: true }),
    s('path', { d: dots([[44, 106], [80, 106], [116, 106]], 11) }, 'skin'),
    s('path', { d: 'M32 122l-6-24M56 122l6-24M104 122l-6-24M128 122l6-24', ...SW(6) }, 'skin', { stroke: true })
  ],
  'aprehensión': [
    ...face(76, 84, 46, 'yellow', 'frown', { accent: true }),
    s('path', { d: 'M52 62l14-6M100 62l-14-6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: drop(122, 56, 8) }, 'sky'),
    s('path', { d: 'M108 22q-10-6-18 2t-18-2-18 2', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 130q10-14 22-6M116 130q-10-14-22-6', ...SW(8) }, 'skin', { stroke: true })
  ],
  arista: [
    s('path', { d: 'M40 56l40-22 44 22-44 22z' }, 'sky'),
    s('path', { d: 'M40 56v56l40 22V78z' }, 'blue'),
    s('path', { d: 'M80 78v56l44-22V56z' }, 'navy'),
    s('path', { d: 'M80 78v56', ...SW(7) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M70 72l10 6 10-6M70 140l10-6 10 6', ...SW(3) }, 'orange', { stroke: true })
  ],
  arzobispado: [
    s('path', { d: 'M24 136V54l16-24 16 24v82zM104 136V54l16-24 16 24v82z' }, 'tan'),
    s('path', { d: 'M56 136V72l24-20 24 20v64z' }, 'cream', { accent: true }),
    s('path', { d: 'M40 30v-14M34 20h12M120 30v-14M114 20h12M80 52V36M74 42h12', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M70 136v-26q10-12 20 0v26z' }, 'brown'),
    s('circle', { cx: 80, cy: 82, r: 9 }, 'purple'),
    s('path', { d: rects([[34, 70, 12, 20], [114, 70, 12, 20]]) }, 'brown')
  ],
  asaltante: [
    ...person(68, 136, 'black', { h: 48, w: 32, r: 15 }),
    s('rect', { x: 52, y: 64, width: 32, height: 10, rx: 4 }, 'dark'),
    s('path', { d: dots([[62, 69], [74, 69]], 3) }, 'white'),
    s('path', { d: 'M108 76q22 4 24 32t-24 30q-26-2-24-30t24-32z' }, 'tan', { accent: true }),
    s('path', { d: 'M100 78l8-10 8 10', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M84 104h12', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 108, cy: 110, r: 8 }, 'yellow')
  ],
  astucia: [
    s('path', { d: 'M30 30l20 26h60l20-26-6 44q-4 44-44 58-40-14-44-58z' }, 'orange', { accent: true }),
    s('path', { d: 'M80 132q-20-8-28-26h56q-8 18-28 26z' }, 'white'),
    s('path', { d: 'M54 78q8-6 16 2M90 80q8-8 16-2', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 108, r: 6 }, 'dark'),
    s('path', { d: 'M40 40l10 18M120 40l-10 18', ...SW(4) }, 'dark', { stroke: true })
  ],
  atentar: [
    s('path', { d: 'M80 22l46 16v40q0 40-46 60-46-20-46-60V38z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 34l34 12v32q0 30-34 46z' }, 'sky'),
    s('path', { d: 'M82 50l-10 18 12 6-10 22', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M138 20L98 56M98 56l4-14M98 56l14-4', ...SW(6) }, 'red', { stroke: true })
  ],
  auditor: [
    ...paper(22, 26, 76, 104),
    s('path', { d: 'M34 44h52M34 60h52M34 76h52M34 92h52M34 108h30', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 102l26 26', ...SW(10) }, 'brown', { stroke: true }),
    s('circle', { cx: 92, cy: 82, r: 26 }, 'sky', { accent: true }),
    s('circle', { cx: 92, cy: 82, r: 26, ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 82l8 8 14-16', ...SW(4) }, 'green', { stroke: true })
  ],
  avergonzar: [
    ...person(54, 136, 'blue', { h: 46, w: 32, r: 16, accent: true }),
    s('path', { d: dots([[46, 76], [62, 76]], 5) }, 'red'),
    s('path', { d: 'M42 98l4-18M66 98l-4-18', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M142 74H106', ...SW(8) }, 'skin', { stroke: true }),
    s('rect', { x: 128, y: 66, width: 16, height: 20, rx: 6 }, 'skin'),
    s('path', { d: 'M86 54l-6-8M92 66h-10M24 50l8 6', ...SW(3) }, 'orange', { stroke: true })
  ],
  bazar: [
    s('path', { d: 'M16 50l10-26h108l10 26z' }, 'red'),
    s('path', { d: 'M46 24l-6 26M80 24v26M114 24l6 26', ...SW(8) }, 'white', { stroke: true }),
    s('rect', { x: 22, y: 50, width: 116, height: 86 }, 'cream'),
    s('rect', { x: 22, y: 106, width: 116, height: 30 }, 'brown'),
    s('path', { d: ells([[40, 98, 12, 8], [66, 98, 10, 8]]) }, 'orange', { accent: true }),
    s('path', { d: rects([[84, 82, 18, 24], [108, 88, 22, 18]]) + 'M36 60h20l-4 16H40zM110 60h16v12h-16z' }, 'blue'),
    s('path', { d: 'M70 60v18', ...SW(4) }, 'purple', { stroke: true })
  ],
  billar: [
    s('rect', { x: 18, y: 40, width: 124, height: 80, rx: 10 }, 'brown'),
    s('rect', { x: 28, y: 50, width: 104, height: 60, rx: 4 }, 'green', { accent: true }),
    s('path', { d: dots([[100, 70], [110, 80], [100, 90], [120, 74]], 7) }, 'red'),
    s('path', { d: dots([[110, 92]], 7) }, 'yellow'),
    s('circle', { cx: 56, cy: 80, r: 7 }, 'white'),
    s('path', { d: 'M14 136l34-48', ...SW(6) }, 'tan', { stroke: true })
  ],
  bucal: [
    s('path', { d: 'M20 80q60-50 120 0q-60 56-120 0z' }, 'red'),
    s('path', { d: 'M34 80q46-30 92 0q-46 34-92 0z' }, 'dark'),
    s('path', { d: rects([[46, 66, 12, 10], [62, 62, 12, 12], [78, 62, 12, 12], [94, 64, 12, 10]]) }, 'white'),
    s('path', { d: 'M56 98q24-16 48 0q-24 10-48 0z' }, 'pink', { accent: true }),
    s('path', { d: 'M100 140l40-30', ...SW(7) }, 'blue', { stroke: true }),
    s('rect', { x: 128, y: 98, width: 18, height: 8, rx: 2, transform: 'rotate(-37 137 102)' }, 'white')
  ],
  buzo: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'blue'),
    s('path', { d: 'M40 92q0-20 22-20h30q20 0 20 20v12H40z' }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 58, r: 20 }, 'gray'),
    s('rect', { x: 68, y: 48, width: 24, height: 18, rx: 6 }, 'sky'),
    s('path', { d: 'M112 98l24 10-4 12-22-6zM40 98l-24 10 4 12 22-6z' }, 'yellow'),
    s('path', { d: ring(92, 30, 4) + ring(100, 20, 6) + ring(114, 32, 3), ...SW(3) }, 'white', { stroke: true })
  ],
  'básquet': [
    s('rect', { x: 34, y: 18, width: 92, height: 56, rx: 4 }, 'white'),
    s('rect', { x: 34, y: 18, width: 92, height: 56, rx: 4, ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M56 70h48', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M60 72l6 24h28l6-24M70 74l4 22M90 74l-4 22', ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 118, r: 22 }, 'orange', { accent: true }),
    s('path', { d: 'M58 118h44M80 96v44M64 102q12 16 0 32M96 102q-12 16 0 32', ...SW(3) }, 'dark', { stroke: true })
  ],
  'capitanía': [
    s('path', { d: 'M14 128q16-8 33 0t33 0 33 0 33 0v18H14z' }, 'blue'),
    s('rect', { x: 34, y: 66, width: 76, height: 60 }, 'cream'),
    s('path', { d: 'M28 66l44-26 44 26z' }, 'red'),
    s('path', { d: grid(44, 78, 3, 2, 12, 12, 22, 22) }, 'sky'),
    s('path', { d: 'M126 128V30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M126 32l22 8-22 8z' }, 'red', { accent: true }),
  ],
  castor: [
    s('path', { d: 'M18 120q-6-20 16-22l20 8-4 22z' }, 'dark'),
    s('path', { d: ells([[78, 100, 34, 26]]) }, 'brown', { accent: true }),
    s('circle', { cx: 112, cy: 76, r: 20 }, 'brown'),
    s('path', { d: dots([[100, 60], [122, 60]], 6) }, 'brown'),
    s('circle', { cx: 118, cy: 72, r: 3 }, 'dark'),
    s('path', { d: rects([[122, 86, 8, 10]]) }, 'white'),
    s('circle', { cx: 130, cy: 80, r: 4 }, 'dark'),
    s('path', { d: 'M66 126v10M92 126v10M14 138h132', ...SW(5) }, 'brown', { stroke: true })
  ],
  cerezo: [
    ground(),
    ...tree(80, 'pink', 'brown', { accent: true }),
    s('path', { d: dots([[60, 64], [74, 78], [98, 60], [108, 86], [50, 90], [86, 50]], 4) }, 'white'),
    s('path', { d: dots([[64, 76], [98, 74]], 6) }, 'red'),
    s('path', { d: 'M64 72q6-10 14-12M98 70q2-8 8-10', ...SW(2) }, 'green', { stroke: true })
  ],
  chusma: [
    s('path', { d: busts([30, 58, 86, 114, 136], 146, 26, 36) }, 'gray', { accent: true }),
    s('path', { d: dots([[30, 98], [58, 92], [86, 100], [114, 94], [136, 100]], 11) }, 'skin'),
    s('path', { d: 'M44 118l-6-40M100 118l6-44M128 124l8-34', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: dots([[38, 74], [106, 70], [136, 86]], 6) }, 'skin'),
    s('path', { d: 'M60 30l-6 14M80 22v16M100 30l6 14', ...SW(4) }, 'red', { stroke: true })
  ],
  colgante: [
    s('path', { d: 'M36 20q0 70 44 74q44-4 44-74', ...SW(3) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 96, r: 5 }, 'yellow'),
    s('path', { d: 'M80 98l22 18-22 28-22-28z' }, 'blue', { accent: true }),
    s('path', { d: 'M58 116h44M80 98l-8 18 8 28 8-28z', ...SW(2) }, 'sky', { stroke: true })
  ],
  comandancia: [
    s('rect', { x: 24, y: 70, width: 112, height: 66 }, 'green'),
    s('path', { d: 'M20 70h120v-10H20z' }, 'dark'),
    s('path', { d: grid(34, 82, 4, 2, 14, 14, 26, 24) }, 'cream'),
    s('rect', { x: 68, y: 110, width: 24, height: 26 }, 'brown'),
    s('path', { d: 'M80 60V20', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 22h38v24H80z' }, 'red', { accent: true }),
    s('path', { d: star(99, 34, 8) }, 'yellow')
  ],
  comerciar: [
    s('path', { d: 'M18 104h40l20 4', ...SW(12) }, 'skin', { stroke: true }),
    s('path', { d: 'M142 104h-40l-20 4', ...SW(12) }, 'tan', { stroke: true }),
    s('path', { d: 'M18 118V90M142 118V90', ...SW(10) }, 'blue', { stroke: true }),
    s('circle', { cx: 52, cy: 58, r: 16 }, 'yellow', { accent: true }),
    s('rect', { x: 92, y: 40, width: 34, height: 34, rx: 3 }, 'brown'),
    s('path', { d: 'M70 36q10-8 20 0M90 76q-10 8-20 0', ...SW(4) }, 'green', { stroke: true })
  ],
  culebra: [
    s('path', { d: 'M30 130q40 10 60-10t-20-40 10-42q14-10 32-6', ...SW(16) }, 'green', { stroke: true, accent: true }),
    s('ellipse', { cx: 116, cy: 34, rx: 16, ry: 11 }, 'green'),
    s('circle', { cx: 120, cy: 30, r: 3 }, 'dark'),
    s('path', { d: 'M132 36l10 2-6 4M142 38l4-6', ...SW(2) }, 'red', { stroke: true }),
    s('path', { d: 'M48 130h8M84 110l4 4M76 74l4-4', ...SW(4) }, 'yellow', { stroke: true })
  ],
  delirante: [
    s('path', { d: HEAD, transform: 'translate(-16 0)' }, 'skin'),
    s('path', { d: 'M76 64a4 4 0 0 1 8 0a10 10 0 0 1-20 0a16 16 0 0 1 32 0a22 22 0 0 1-44 0', ...SW(4) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: star(124, 30, 8) + star(30, 34, 6) }, 'yellow'),
    s('path', { d: sparkle(126, 64, 8) }, 'pink'),
    s('path', { d: 'M108 94q6-4 12 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  descaradamente: [
    ...face(80, 80, 56, 'yellow', 'smile', { accent: true }),
    s('path', { d: 'M86 74q6-6 12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 46, y: 64, width: 14, height: 8 }, 'yellow'),
    s('path', { d: 'M70 104h20v14q0 10-10 10t-10-10z' }, 'pink'),
    s('path', { d: 'M80 104v14', ...SW(2) }, 'red', { stroke: true })
  ],
  despertador: [
    s('path', { d: 'M48 128l-10 12M112 128l10 12', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 88, r: 44 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 88, r: 34 }, 'white'),
    s('path', { d: 'M80 88V64M80 88l16 10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 50a20 20 0 0 1 28-28zM130 50a20 20 0 0 0-28-28z' }, 'yellow'),
    s('path', { d: 'M18 74l-6-4M18 90h-6M142 74l6-4M142 90h6', ...SW(4) }, 'orange', { stroke: true })
  ],
  despilfarro: [
    s('path', { d: 'M30 140q-6-30 16-46', ...SW(14) }, 'skin', { stroke: true }),
    s('path', { d: 'M44 92q8-8 20-4', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: rects([[70, 60, 34, 18], [96, 30, 34, 18]]), transform: 'rotate(-15 100 54)' }, 'green', { accent: true }),
    s('path', { d: dots([[120, 80], [136, 104], [104, 110], [64, 34], [40, 54]], 9) }, 'yellow'),
    s('path', { d: 'M48 80l14-14M66 92l20-6', ...SW(3) }, 'gray', { stroke: true })
  ],
  destructivo: [
    s('path', { d: 'M108 14v56', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 100, cy: 84, r: 20 }, 'dark', { accent: true }),
    s('path', { d: rects([[18, 64, 30, 18], [18, 84, 30, 18], [18, 104, 30, 18], [50, 104, 26, 18], [50, 84, 22, 18]]) }, 'red'),
    s('path', { d: rects([[56, 58, 10, 10], [70, 50, 8, 8], [64, 74, 8, 8]]) }, 'orange'),
    s('path', { d: 'M14 124h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M126 70l10-6M126 96l10 6', ...SW(3) }, 'gray', { stroke: true })
  ],
  devastador: [
    s('path', { d: 'M26 22h108q-10 16-30 18 6 14-14 18 6 14-8 18 6 14-4 22 4 12-4 22-8-12-6-22-12-10-6-22-14-8-8-18-18-4-14-18-14-4-24-18z' }, 'gray', { accent: true }),
    s('path', { d: 'M40 40h80M54 58h50M62 76h36', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 136l10-26 18 6 6-12 10 32zM104 136l6-20 14-4 14 10 8 14z' }, 'brown'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: rects([[30, 92, 8, 8], [118, 90, 8, 8]]) }, 'tan')
  ],
  discernir: [
    s('path', { d: 'M20 50h120l-16 40H36z' }, 'gray', { accent: true }),
    s('path', { d: 'M36 70h88M44 80h72', ...DASH(3, '3 4') }, 'dark', { stroke: true }),
    s('path', { d: dots([[50, 46], [72, 42], [96, 46], [116, 42]], 9) }, 'brown'),
    s('path', { d: dots([[60, 108], [80, 120], [100, 104], [74, 136], [92, 134]], 4) }, 'yellow'),
    s('path', { d: 'M14 50h20M126 50h20', ...SW(6) }, 'dark', { stroke: true })
  ],
  englobar: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'sky'),
    s('circle', { cx: 80, cy: 80, r: 62, ...SW(5) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: dots([[56, 60], [100, 54]], 14) }, 'red'),
    s('path', { d: rects([[46, 90, 26, 26]]) }, 'green'),
    s('path', { d: 'M100 82l18 32H82z' }, 'yellow'),
    s('path', { d: star(80, 120, 9) }, 'purple')
  ],
  'entrañable': [
    s('path', { d: 'M28 136q-2-46 34-52h12l8 52zM132 136q2-46-34-52H86l-8 52z' }, 'blue'),
    s('path', { d: 'M86 84h12q36 6 34 52H78z' }, 'pink', { accent: true }),
    s('path', { d: dots([[64, 64], [96, 64]], 15) }, 'skin'),
    s('path', { d: 'M44 100q36 16 72 0', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 22, 12) }, 'red')
  ],
  entristecer: [
    s('path', { d: 'M44 50q-20 0-20-16t22-14q6-12 22-10 14-8 26 2 20-4 26 12 16 2 14 16t-18 10z' }, 'gray'),
    s('path', { d: 'M46 60l-4 10M70 62l-4 10M94 62l-4 10M118 60l-4 10', ...SW(4) }, 'blue', { stroke: true }),
    ...face(80, 112, 30, 'sky', 'frown', { accent: true }),
    s('path', { d: drop(64, 118, 3) }, 'blue')
  ],
  estampa: [
    s('rect', { x: 26, y: 22, width: 108, height: 116 }, 'white'),
    s('rect', { x: 26, y: 22, width: 108, height: 116, ...DASH(8, '0 12') }, 'cream', { stroke: true }),
    s('rect', { x: 26, y: 22, width: 108, height: 116, ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 38, y: 34, width: 84, height: 92 }, 'sky'),
    s('path', { d: 'M38 126V96l26-24 22 22 14-12 22 22v22z' }, 'green', { accent: true }),
    s('circle', { cx: 102, cy: 54, r: 10 }, 'yellow')
  ],
  estante: [
    s('path', { d: 'M18 70h124M18 124h124', ...SW(8) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: rects([[26, 34, 12, 32], [40, 38, 12, 28], [54, 30, 10, 36]]) }, 'red'),
    s('path', { d: rects([[66, 40, 12, 26], [36, 90, 14, 30], [52, 94, 12, 26]]) }, 'blue'),
    s('path', { d: 'M108 66h22l-4-16h-14z' }, 'orange'),
    s('path', { d: leaflet(119, 50, -60, 20, 5) + leaflet(119, 50, -120, 20, 5) }, 'green'),
    s('path', { d: 'M96 120h36l-4-14h-28z' }, 'yellow')
  ],
  esteroide: [
    s('path', { d: 'M52 64h14a14 14 0 0 1 0 28h-14z', transform: 'rotate(-35 52 78)' }, 'white'),
    s('path', { d: 'M52 64h-14a14 14 0 0 0 0 28h14z', transform: 'rotate(-35 52 78)' }, 'red', { accent: true }),
    s('rect', { x: 24, y: 64, width: 56, height: 28, rx: 14, transform: 'rotate(-35 52 78)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M92 120h48M98 104v32M134 104v32', ...SW(10) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 112v16M146 112v16', ...SW(8) }, 'gray', { stroke: true })
  ],
  fonda: [
    s('path', { d: 'M80 14v18', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 46q0-14 18-14t18 14z' }, 'yellow'),
    s('rect', { x: 20, y: 96, width: 120, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M36 106v30M124 106v30', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M54 72h52q-2 24-26 24T54 72z' }, 'red', { accent: true }),
    s('path', { d: 'M68 64q-6-8 0-14M88 64q-6-8 0-14', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 64l20-16', ...SW(3) }, 'tan', { stroke: true })
  ],
  glorieta: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'green'),
    s('path', { d: 'M66 14h28v132H66zM14 66h132v28H14z' }, 'gray'),
    s('circle', { cx: 80, cy: 80, r: 44 }, 'gray'),
    s('circle', { cx: 80, cy: 80, r: 24 }, 'mint'),
    s('path', { d: 'M80 62l16 14H64z' }, 'red', { accent: true }),
    s('path', { d: 'M68 76v14M92 76v14', ...SW(3) }, 'cream', { stroke: true }),
    s('path', { d: ring(80, 80, 34), ...DASH(3, '6 8') }, 'white', { stroke: true })
  ],
  gobernanza: [
    s('circle', { cx: 80, cy: 80, r: 40, ...SW(10) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: rays(80, 80, 0, 62, 8, 22.5), ...SW(7) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'yellow'),
    s('path', { d: dots(around(80, 80, 62, 8, 22.5), 6) }, 'tan')
  ],
  grillo: [
    s('path', { d: 'M14 136q66-16 132 0', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: ells([[76, 92, 38, 14]]) }, 'green', { accent: true }),
    s('circle', { cx: 116, cy: 86, r: 12 }, 'green'),
    s('path', { d: 'M50 88l24-36 16 46M60 100l-14 30M88 104l4 26M104 102l10 26', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M122 76q10-40 20-50M116 76q-4-40 8-56', ...SW(2) }, 'dark', { stroke: true }),
    s('circle', { cx: 120, cy: 84, r: 3 }, 'dark'),
    s('path', { d: 'M30 50q-6 8 0 16M20 44q-10 14 0 28', ...SW(3) }, 'orange', { stroke: true })
  ],
  'heroísmo': [
    s('path', { d: 'M62 74l-30 60h40zM98 74l30 60H88z' }, 'red'),
    ...person(80, 136, 'blue', { h: 52, w: 32, r: 14, accent: true }),
    s('path', { d: 'M66 92L44 60M94 92l22-32', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: star(80, 110, 9) }, 'yellow'),
    s('path', { d: sparkle(30, 34, 9) + sparkle(130, 34, 9) }, 'yellow')
  ],
  ideario: [
    s('path', { d: 'M30 30h96v108H30z' }, 'navy', { accent: true }),
    s('path', { d: 'M38 30v108', ...SW(4) }, 'blue', { stroke: true }),
    s('circle', { cx: 82, cy: 70, r: 22 }, 'yellow'),
    s('rect', { x: 72, y: 90, width: 20, height: 12, rx: 3 }, 'gray'),
    s('path', { d: 'M82 40V32M56 48l-6-6M108 48l6-6M50 70h-8M114 70h8', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M52 118h60', ...SW(4) }, 'cream', { stroke: true })
  ],
  incienso: [
    s('path', { d: 'M40 116h80l-8 22H48z' }, 'brown', { accent: true }),
    s('path', { d: 'M64 116l-6-50M80 116V62M96 116l6-50', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: dots([[58, 64], [80, 60], [102, 64]], 3) }, 'orange'),
    s('path', { d: 'M58 56q-12-10 0-20t0-22M80 52q12-10 0-20t4-18M102 56q12-10 0-20', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 116h88', ...SW(4) }, 'tan', { stroke: true })
  ],
  indebido: [
    s('rect', { x: 26, y: 74, width: 70, height: 50, rx: 4 }, 'gray'),
    s('rect', { x: 34, y: 82, width: 54, height: 16 }, 'dark'),
    s('path', { d: 'M100 70q20-10 30 6', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: dots([[62, 66], [78, 60]], 10) }, 'yellow'),
    s('circle', { cx: 112, cy: 50, r: 30, ...SW(7) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M91 29l42 42', ...SW(7) }, 'red', { stroke: true })
  ],
  'inhabilitación': [
    s('rect', { x: 20, y: 38, width: 112, height: 76, rx: 8 }, 'sky'),
    s('circle', { cx: 52, cy: 70, r: 12 }, 'skin'),
    s('path', { d: 'M34 100q0-16 18-16t18 16z' }, 'blue'),
    s('path', { d: 'M82 62h38M82 76h30M82 90h34', ...SW(4) }, 'white', { stroke: true }),
    s('circle', { cx: 110, cy: 110, r: 28 }, 'white'),
    s('circle', { cx: 110, cy: 110, r: 24, ...SW(7) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M93 93l34 34', ...SW(7) }, 'red', { stroke: true })
  ],
  instaurar: [
    s('path', { d: 'M14 136q66-40 132 0z' }, 'green'),
    s('path', { d: rects([[54, 108, 52, 14]]) }, 'gray'),
    s('path', { d: 'M80 108V22', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 24q20-8 40 0v30q-20-8-40 0z' }, 'blue', { accent: true }),
    s('path', { d: star(102, 40, 7) }, 'yellow'),
    s('path', { d: 'M60 108v-8M100 108v-8', ...SW(3) }, 'gray', { stroke: true })
  ],
  intimidar: [
    s('path', { d: 'M24 146q-6-62 30-70h24q36 8 30 70z' }, 'dark', { accent: true }),
    s('circle', { cx: 66, cy: 50, r: 24 }, 'dark'),
    s('path', { d: 'M54 46l8 4M78 46l-8 4', ...SW(4) }, 'red', { stroke: true }),
    ...person(128, 140, 'yellow', { h: 30, w: 20, r: 9 }),
    s('path', { d: 'M122 98l-4-6M132 96l4-6', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: drop(140, 86, 3) }, 'sky')
  ],
  'intromisión': [
    ...person(30, 136, 'blue'),
    ...person(130, 136, 'green'),
    s('path', { d: bubble(18, 24, 30, 24) + bubble(112, 24, 30, 24) }, 'cream'),
    s('circle', { cx: 80, cy: 82, r: 16 }, 'skin'),
    s('path', { d: 'M64 82q-2 30 4 54h24q6-24 4-54' }, 'orange', { accent: true }),
    s('path', { d: 'M74 76h2M86 76h2', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M72 54l-6-10M88 54l6-10', ...SW(3) }, 'gray', { stroke: true })
  ],
  inundar: [
    s('path', { d: 'M30 70l36-30 36 30v40H30z' }, 'cream'),
    s('path', { d: 'M24 72l42-36 42 36', ...SW(6) }, 'red', { stroke: true }),
    s('rect', { x: 44, y: 74, width: 16, height: 14 }, 'sky'),
    s('path', { d: 'M14 96q16-10 33 0t33 0 33 0 33 0v50H14z' }, 'blue', { accent: true }),
    s('path', { d: 'M24 118q10-6 20 0M70 128q10-6 20 0M110 112q10-6 20 0', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M118 40q-10 0-10-10t12-8q4-8 14-6 10 2 8 14 2 10-8 10z' }, 'gray')
  ],
  jodidamente: [
    s('path', { d: 'M24 112a56 56 0 0 1 112 0', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'yellow', { stroke: true }),
    s('path', { d: 'M108 63a56 56 0 0 1 28 49', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'red', { accent: true, stroke: true }),
    s('path', { d: 'M80 112l52-20', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 112, r: 9 }, 'dark'),
    s('path', { d: burst(132, 40, 22, 11, 8) }, 'orange'),
    s('path', { d: 'M40 136h80', ...SW(4) }, 'gray', { stroke: true })
  ],
  legitimar: [
    ...paper(24, 60, 92, 78),
    s('path', { d: 'M36 76h68M36 90h50', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 116, r: 14, ...SW(4) }, 'green', { stroke: true }),
    s('rect', { x: 84, y: 20, width: 24, height: 36, rx: 10 }, 'brown'),
    s('rect', { x: 74, y: 54, width: 44, height: 14, rx: 3 }, 'green', { accent: true }),
    s('path', { d: 'M72 116l6 6 10-12', ...SW(4) }, 'green', { stroke: true })
  ],
  magistratura: [
    ...person(80, 112, 'black', { h: 44, w: 40, r: 16, accent: true }),
    s('path', { d: 'M72 70h16l-8 10z' }, 'white'),
    s('rect', { x: 18, y: 104, width: 124, height: 36, rx: 3 }, 'brown'),
    s('rect', { x: 110, y: 90, width: 26, height: 12, rx: 3, transform: 'rotate(-30 123 96)' }, 'tan'),
    s('path', { d: 'M100 104l18-10', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M30 122h100', ...SW(3) }, 'tan', { stroke: true })
  ],
  maravillosamente: [
    s('path', { d: 'M20 120a60 60 0 0 1 120 0', ...SW(10) }, 'red', { stroke: true }),
    s('path', { d: 'M30 120a50 50 0 0 1 100 0', ...SW(10) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M40 120a40 40 0 0 1 80 0', ...SW(10) }, 'green', { stroke: true }),
    s('path', { d: 'M50 120a30 30 0 0 1 60 0', ...SW(10) }, 'blue', { stroke: true }),
    s('path', { d: sparkle(30, 34, 10) + sparkle(134, 42, 12) + sparkle(80, 104, 8) }, 'purple')
  ],
  matutino: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'cream'),
    s('circle', { cx: 80, cy: 110, r: 30 }, 'orange', { accent: true }),
    s('path', { d: halfRays(80, 110, 38, 50, 7), ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M14 110h132v26q0 10-10 10H24q-10 0-10-10z' }, 'green'),
    s('path', { d: birds([[40, 40], [60, 30]]), ...SW(3) }, 'dark', { stroke: true })
  ],
  'maña': [
    s('path', { d: 'M24 140q-4-34 20-48l26-12 10 10-20 24q-4 18-10 26z' }, 'skin'),
    s('path', { d: 'M62 88l40-40', ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M102 48l22-22', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M112 22l6 6M128 38l-6-6', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: sparkle(130, 70, 10) + sparkle(96, 20, 7) }, 'yellow'),
    s('path', { d: 'M108 64q10 10 4 22', ...SW(4) }, 'orange', { stroke: true })
  ],
  minoritario: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'blue'),
    s('path', { d: wedge(86, 74, 60, -90, -50) }, 'orange', { accent: true }),
    s('path', { d: 'M80 80V20M80 80l38-46', ...SW(3) }, 'white', { stroke: true })
  ],
  monitorear: [
    s('rect', { x: 18, y: 26, width: 124, height: 84, rx: 8 }, 'dark'),
    s('rect', { x: 26, y: 34, width: 108, height: 68, rx: 3 }, 'navy'),
    s('path', { d: 'M30 70h26l8-20 12 36 10-26 6 10h38', ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M80 110v14M54 132h52', ...SW(6) }, 'gray', { stroke: true })
  ],
  neblina: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'sky'),
    s('path', { d: 'M14 130l34-44 26 26 26-40 46 58v16H14z' }, 'green'),
    s('path', { d: 'M24 60h70M60 80h76M20 100h60M90 110h46M30 124h80', ...SW(8) }, 'white', { stroke: true, accent: true }),
    s('circle', { cx: 116, cy: 40, r: 12 }, 'cream')
  ],
  numeral: [
    s('rect', { x: 18, y: 50, width: 36, height: 36, rx: 6 }, 'white'),
    s('rect', { x: 62, y: 50, width: 36, height: 36, rx: 6 }, 'white'),
    s('rect', { x: 106, y: 50, width: 36, height: 36, rx: 6 }, 'white'),
    s('path', { d: rects([[18, 50, 36, 36], [62, 50, 36, 36], [106, 50, 36, 36]]), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[36, 68], [72, 60], [88, 76], [114, 58], [124, 68], [134, 78]], 4) }, 'red', { accent: true }),
    s('path', { d: 'M36 104v10M72 104v10M88 104v10M114 104v10M124 104v10M134 104v10', ...SW(5) }, 'blue', { stroke: true })
  ],
  obligatoriamente: [
    s('circle', { cx: 80, cy: 72, r: 54 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 72, r: 54, ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M80 108V48M60 66l20-22 20 22', ...SW(12) }, 'white', { stroke: true }),
    s('path', { d: 'M80 126v20', ...SW(6) }, 'gray', { stroke: true })
  ],
  oligarca: [
    s('path', { d: 'M40 136q-14-40 20-48 34 8 20 48zM88 136q-14-36 18-42 32 6 18 42z' }, 'tan'),
    s('path', { d: 'M54 90l6-10 6 10M100 96l6-10 6 10', ...SW(3) }, 'brown', { stroke: true }),
    ...person(80, 84, 'navy', { h: 34, w: 34, r: 13, accent: true }),
    s('path', { d: 'M68 18h24v16H68zM60 34h40v4H60z' }, 'black'),
    s('path', { d: dots([[22, 132], [138, 132]], 7) }, 'yellow')
  ],
  'paralización': [
    ...gear(70, 86, 30, 10, 'gray'),
    s('circle', { cx: 70, cy: 86, r: 10 }, 'white'),
    s('circle', { cx: 112, cy: 40, r: 26 }, 'red', { accent: true }),
    s('path', { d: 'M104 30v20M120 30v20', ...SW(7) }, 'white', { stroke: true })
  ],
  pericia: [
    s('path', { d: 'M40 70l14-20h52l14 20-40 50z' }, 'sky', { accent: true }),
    s('path', { d: 'M40 70h80M66 50l-6 20 20 50 20-50-6-20', ...SW(3) }, 'blue', { stroke: true }),
    s('circle', { cx: 120, cy: 110, r: 18, ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M132 124l10 12', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(30, 40, 9) + sparkle(126, 36, 7) }, 'yellow')
  ],
  pimiento: [
    s('path', { d: 'M46 54q-14 10-12 40t20 42q10 6 16-4 10 10 20 0 6 10 16 4 18-12 20-42T114 54q-20-10-34 0-14-10-34 0z' }, 'red', { accent: true }),
    s('path', { d: 'M62 60q-10 20-4 50', ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: 'M66 52q14-10 28 0', ...SW(10) }, 'green', { stroke: true }),
    s('path', { d: 'M80 48q0-20 14-28', ...SW(6) }, 'green', { stroke: true })
  ],
  'plática': [
    ...person(40, 136, 'orange'),
    ...person(120, 136, 'blue'),
    s('path', { d: bubble(24, 22, 52, 34) }, 'mint', { accent: true }),
    s('path', { d: 'M136 22H92q-8 0-8 8v18q0 8 8 8h20l12 12V56h12q8 0 8-8V30q0-8-8-8z' }, 'pink'),
    s('rect', { x: 68, y: 110, width: 24, height: 26, rx: 3 }, 'brown'),
    s('path', { d: 'M74 104q-4-6 0-12M86 104q-4-6 0-12', ...SW(2) }, 'gray', { stroke: true })
  ],
  primicia: [
    s('rect', { x: 20, y: 34, width: 100, height: 104, rx: 3 }, 'white'),
    s('rect', { x: 20, y: 34, width: 100, height: 104, rx: 3, ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 30, y: 44, width: 80, height: 12 }, 'dark'),
    s('rect', { x: 30, y: 64, width: 40, height: 34 }, 'sky'),
    s('path', { d: 'M78 66h32M78 78h32M78 90h32M30 108h80M30 120h80', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: burst(118, 40, 26, 16, 10) }, 'red', { accent: true }),
    s('path', { d: star(118, 40, 10) }, 'yellow')
  ],
  priorizar: [
    s('path', { d: rects([[30, 26, 100, 26]]) }, 'orange', { accent: true }),
    s('path', { d: rects([[30, 66, 100, 26], [30, 106, 100, 26]]) }, 'gray'),
    s('path', { d: star(48, 39, 9) }, 'white'),
    s('path', { d: 'M66 39h50M48 79h68M48 119h68', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M144 110V40M136 50l8-10 8 10', ...SW(4) }, 'green', { stroke: true })
  ],
  'puntería': [
    s('circle', { cx: 120, cy: 80, r: 26 }, 'red'),
    s('circle', { cx: 120, cy: 80, r: 16 }, 'white'),
    s('circle', { cx: 120, cy: 80, r: 7 }, 'red', { accent: true }),
    s('path', { d: 'M40 36q30 44 0 88', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 36L28 80l12 44', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 80h70M90 74l8 6-8 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 80l-8-6M28 80l-8 6', ...SW(3) }, 'orange', { stroke: true })
  ],
  'puñetazo': [
    s('path', { d: burst(112, 76, 36, 18, 10) }, 'yellow'),
    s('path', { d: 'M40 58q0-14 16-14h40q20 0 20 22v20q0 20-20 20H56q-16 0-16-14z' }, 'red', { accent: true }),
    s('path', { d: 'M74 62q-14 0-14 12t14 12', ...SW(4) }, 'pink', { stroke: true }),
    s('rect', { x: 18, y: 60, width: 26, height: 40, rx: 4 }, 'white'),
    s('rect', { x: 18, y: 60, width: 26, height: 40, rx: 4, ...SW(3) }, 'gray', { stroke: true })
  ],
  ramal: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'mint'),
    s('path', { d: 'M60 146V14M76 146V14', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M68 120q0-40 60-70M84 120q0-30 60-58', ...SW(5) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M54 30h28M54 50h28M54 70h28M54 90h28M54 110h28M54 130h28', ...SW(4) }, 'brown', { stroke: true })
  ],
  reciprocidad: [
    ...person(36, 136, 'blue'),
    ...person(124, 136, 'green'),
    s('path', { d: 'M54 50q26-22 52 0M98 42l8 8 2-12', ...SW(5) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M106 70q-26 22-52 0M62 78l-8-8-2 12', ...SW(5) }, 'purple', { stroke: true }),
    s('path', { d: heart(80, 92, 8) }, 'red')
  ],
  regazo: [
    s('circle', { cx: 56, cy: 40, r: 14 }, 'skin'),
    s('path', { d: 'M40 100q-4-40 16-44 20 4 20 44z' }, 'purple', { accent: true }),
    s('path', { d: 'M40 100h60v36', ...SW(14) }, 'purple', { stroke: true }),
    s('circle', { cx: 88, cy: 64, r: 10 }, 'skin'),
    s('rect', { x: 78, y: 74, width: 20, height: 20, rx: 6 }, 'yellow'),
    s('path', { d: 'M64 76q14 12 20 10', ...SW(6) }, 'skin', { stroke: true })
  ],
  sangrar: [
    s('path', { d: 'M54 140V60q0-16 16-16t16 16v80z' }, 'skin', { accent: true }),
    s('rect', { x: 50, y: 74, width: 40, height: 18, rx: 4, transform: 'rotate(-8 70 83)' }, 'tan'),
    s('path', { d: dots([[62, 84], [70, 82], [78, 80]], 2) }, 'brown'),
    s('path', { d: drop(110, 72, 10) + drop(122, 110, 7) }, 'red')
  ],
  sensatez: [
    s('path', { d: HEAD, transform: 'translate(-6 0)' }, 'skin'),
    s('path', { d: 'M76 34v42M56 46h40', ...SW(4) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M48 58l8-12 8 12zM88 58l8-12 8 12z' }, 'navy'),
    s('path', { d: 'M66 76h20', ...SW(5) }, 'navy', { stroke: true })
  ],
  sexista: [
    s('path', { d: 'M80 72v64M54 136h52', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 88l112-32', ...SW(5) }, 'dark', { stroke: true }),
    ...person(34, 84, 'blue', { h: 22, w: 20, r: 8 }),
    ...person(126, 56, 'pink', { h: 22, w: 20, r: 8, accent: true }),
    s('path', { d: 'M112 102l20 20M112 122l20-20', ...SW(5) }, 'red', { stroke: true })
  ],
  'significación': [
    s('path', { d: star(64, 66, 34) }, 'yellow', { accent: true }),
    s('circle', { cx: 64, cy: 66, r: 44, ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 98l34 34', ...SW(12) }, 'brown', { stroke: true }),
    s('path', { d: sparkle(132, 30, 10) }, 'orange')
  ],
  soprano: [
    ...lady(64, 140, 'red', { accent: true }),
    s('ellipse', { cx: 64, cy: 82, rx: 4, ry: 5 }, 'dark'),
    s('path', { d: 'M54 104l-14-14M74 104l14-14', ...SW(5) }, 'skin', { stroke: true }),
    ...note(108, 52, 'purple'),
    ...note(132, 28, 'blue')
  ],
  surco: [
    s('rect', { x: 14, y: 14, width: 132, height: 40, rx: 8 }, 'sky'),
    s('path', { d: 'M14 54h132v82q0 10-10 10H24q-10 0-10-10z' }, 'brown', { accent: true }),
    s('path', { d: 'M76 58L22 146M84 58l20 88M80 58l-24 88M88 58l50 88M72 58L14 120', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 40l20 16M108 56h20', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 36, cy: 32, r: 10 }, 'yellow')
  ],
  tarro: [
    s('rect', { x: 46, y: 26, width: 68, height: 18, rx: 4 }, 'red'),
    s('path', { d: 'M50 44h60q8 6 8 20v62q0 12-12 12H54q-12 0-12-12V64q0-14 8-20z' }, 'sky'),
    s('path', { d: 'M46 70h68v56q0 8-8 8H54q-8 0-8-8z' }, 'orange', { accent: true }),
    s('rect', { x: 58, y: 84, width: 44, height: 26, rx: 4 }, 'cream'),
    s('path', { d: 'M54 52v10', ...SW(4) }, 'white', { stroke: true })
  ],
  toxina: [
    s('path', { d: 'M36 84q0-44 44-44t44 44z' }, 'red', { accent: true }),
    s('path', { d: dots([[60, 62], [86, 54], [104, 72], [74, 76]], 6) }, 'white'),
    s('path', { d: 'M68 84h24v40q0 12-12 12t-12-12z' }, 'cream'),
    s('path', { d: 'M40 34q-8-8 0-16M120 34q8-8 0-16M80 28q-6-6 0-14', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'green', { stroke: true })
  ],
  triunfal: [
    s('path', { d: 'M24 136V40h112v96H100V96q0-20-20-20T60 96v40z' }, 'tan', { accent: true }),
    s('rect', { x: 18, y: 30, width: 124, height: 14, rx: 2 }, 'gray'),
    s('path', { d: 'M38 52v84M122 52v84', ...SW(5) }, 'cream', { stroke: true }),
    s('path', { d: star(80, 60, 9) }, 'yellow'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  vagamente: [
    s('path', { d: 'M30 92q-16-2-14-18t20-14q4-22 30-22 18-12 36 0 26-2 30 20 18 4 14 22t-20 12z' }, 'cream'),
    s('path', { d: 'M30 92q-16-2-14-18t20-14q4-22 30-22 18-12 36 0 26-2 30 20 18 4 14 22t-20 12z', ...DASH(3, '6 6') }, 'gray', { stroke: true }),
    s('path', { d: 'M60 80V62l20-14 20 14v18z', ...DASH(4, '4 6') }, 'purple', { stroke: true, accent: true }),
    ...person(40, 140, 'blue', { h: 28, w: 22, r: 10 }),
    s('path', { d: dots([[44, 104], [52, 96]], 4) }, 'gray')
  ],
  vaginal: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'mint'),
    s('circle', { cx: 80, cy: 64, r: 26, ...SW(10) }, 'pink', { stroke: true, accent: true }),
    s('path', { d: 'M80 90v40M64 112h32', ...SW(10) }, 'pink', { stroke: true }),
    s('path', { d: 'M118 26v20M108 36h20', ...SW(6) }, 'red', { stroke: true })
  ],
  vertido: [
    s('path', { d: 'M14 108q16-8 33 0t33 0 33 0 33 0v38H14z' }, 'blue'),
    s('path', { d: 'M14 46h52', ...SW(16) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 36v20', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M68 46q24 0 26 64', ...SW(10) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: ells([[96, 118, 26, 8]]) }, 'brown'),
    s('path', { d: fishes([[44, 128]]) }, 'gray'),
    s('path', { d: 'M120 96l12-12M132 96l-12-12', ...SW(4) }, 'red', { stroke: true })
  ],
  'víbora': [
    s('path', { d: ells([[80, 116, 50, 18], [80, 98, 38, 14]]) }, 'brown', { accent: true }),
    s('path', { d: 'M40 116l8-8 8 8 8-8 8 8 8-8 8 8 8-8 8 8 8-8 8 8M52 98l8-6 8 6 8-6 8 6 8-6 8 6', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M80 88q-4-24 8-36', ...SW(14) }, 'brown', { stroke: true }),
    s('path', { d: 'M74 40l30-6 8 12-30 14z' }, 'brown'),
    s('circle', { cx: 96, cy: 42, r: 3 }, 'yellow'),
    s('path', { d: 'M106 50l2 10M100 52l1 8', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M112 42l14-2-6 6', ...SW(2) }, 'red', { stroke: true })
  ],
  afecto: [
    s('path', { d: heart(80, 66, 28) }, 'red', { accent: true }),
    s('path', { d: 'M18 120q16-22 46-20l10 10H52M142 120q-16-22-46-20l-10 10h22', ...SW(12) }, 'skin', { stroke: true }),
    s('path', { d: 'M18 140v-20M142 140v-20', ...SW(14) }, 'blue', { stroke: true }),
    s('path', { d: sparkle(40, 32, 8) + sparkle(122, 30, 8) }, 'pink')
  ],
  'alienígena': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'navy'),
    s('path', { d: 'M52 146q0-30 28-30t28 30z' }, 'green'),
    s('path', { d: 'M80 34q34 0 34 36 0 30-34 48-34-18-34-48 0-36 34-36z' }, 'green', { accent: true }),
    s('path', { d: ells([[66, 74, 11, 7], [94, 74, 11, 7]]), transform: '' }, 'black'),
    s('path', { d: 'M66 38l-10-18M94 38l10-18', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: dots([[56, 20], [104, 20]], 5) + star(130, 120, 5) + star(28, 108, 4) }, 'yellow')
  ],
  'analítico': [
    s('path', { d: rects([[24, 96, 18, 40], [50, 72, 18, 64], [76, 84, 18, 52], [102, 50, 18, 86]]) }, 'blue'),
    s('path', { d: 'M18 136h126', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 92, cy: 56, r: 26, ...SW(7) }, 'dark', { stroke: true }),
    s('circle', { cx: 92, cy: 56, r: 22 }, 'sky', { accent: true }),
    s('path', { d: 'M110 74l24 24', ...SW(9) }, 'dark', { stroke: true }),
    s('path', { d: 'M78 64l10-10 8 6 12-14', ...SW(3) }, 'red', { stroke: true })
  ],
  'análogo': [
    s('circle', { cx: 44, cy: 86, r: 26 }, 'red', { accent: true }),
    s('circle', { cx: 116, cy: 86, r: 26 }, 'red'),
    s('path', { d: 'M44 60q2-12 10-16M116 60q2-12 10-16', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(48, 56, -30, 14, 5) + leaflet(120, 56, -30, 14, 5) }, 'green'),
    s('path', { d: 'M74 128h12M64 128l10-8M64 128l10 8M96 128l-10-8M96 128l-10 8', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M18 128h28M114 128h28', ...SW(3) }, 'gray', { stroke: true })
  ],
  arbitrar: [
    s('rect', { x: 56, y: 72, width: 48, height: 64, rx: 14 }, 'white'),
    s('path', { d: 'M66 74v62M80 72v64M94 74v62', ...SW(7, { 'stroke-linecap': 'butt' }) }, 'black', { stroke: true }),
    s('circle', { cx: 80, cy: 56, r: 14 }, 'skin'),
    s('path', { d: 'M104 90l18-36', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 114, y: 26, width: 20, height: 28, rx: 3, transform: 'rotate(15 124 40)' }, 'yellow', { accent: true }),
    s('path', { d: 'M58 92l-14 10', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M86 60h12', ...SW(5) }, 'gray', { stroke: true })
  ],
  arenal: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'sky'),
    s('path', { d: 'M14 82h132v24H14z' }, 'blue'),
    s('path', { d: 'M14 104q30-20 66-4t66-8v54H14z' }, 'tan', { accent: true }),
    s('path', { d: 'M30 126q20-8 40 0M90 132q20-8 40 0', ...SW(3) }, 'yellow', { stroke: true }),
    s('circle', { cx: 116, cy: 40, r: 14 }, 'yellow')
  ],
  arribar: [
    s('path', { d: 'M14 112q16-8 33 0t33 0 33 0 33 0v34H14z' }, 'blue'),
    s('rect', { x: 100, y: 94, width: 46, height: 12 }, 'brown'),
    s('path', { d: 'M110 106v30M134 106v30', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M18 86h72l-10 24H28z' }, 'red', { accent: true }),
    s('path', { d: 'M54 86V30M56 32l26 46H56zM52 38L28 78h24z' }, 'cream'),
    s('path', { d: 'M90 90q10 10 22 4', ...SW(3) }, 'tan', { stroke: true })
  ],
  artritis: [
    s('path', { d: 'M40 140V90q0-12 12-12h20', ...SW(22) }, 'skin', { stroke: true }),
    s('path', { d: 'M72 78l26-26 20 10', ...SW(20) }, 'skin', { stroke: true }),
    s('circle', { cx: 98, cy: 52, r: 16 }, 'red', { accent: true }),
    s('path', { d: rays(98, 52, 22, 32, 6, -60), ...SW(4) }, 'orange', { stroke: true }),
    s('circle', { cx: 72, cy: 78, r: 10 }, 'pink')
  ],
  asesorar: [
    s('rect', { x: 18, y: 22, width: 76, height: 56, rx: 4 }, 'white'),
    s('rect', { x: 18, y: 22, width: 76, height: 56, rx: 4, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 66l18-14 14 8 24-22', ...SW(4) }, 'green', { stroke: true }),
    ...person(118, 140, 'navy', { accent: true }),
    s('path', { d: 'M114 92l4 18 4-18z' }, 'red'),
    s('path', { d: 'M104 102L82 70', ...SW(7) }, 'skin', { stroke: true }),
    ...person(44, 140, 'orange', { h: 30, w: 26, r: 11 })
  ],
  astillero: [
    s('path', { d: 'M14 136h132', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 84h96l-14 36H38z' }, 'blue', { accent: true }),
    s('path', { d: 'M40 120l-4 16M104 120l4 16M72 120v16', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M134 136V24H84M134 40l-34-16M110 24v28', ...SW(5) }, 'yellow', { stroke: true }),
    s('rect', { x: 102, y: 52, width: 16, height: 12 }, 'dark'),
    s('path', { d: 'M48 84V70h40v14', ...SW(4) }, 'gray', { stroke: true })
  ],
  asir: [
    s('path', { d: 'M30 50h70v62q0 24-24 24H54q-24 0-24-24z' }, 'red', { accent: true }),
    s('path', { d: 'M100 66q30 0 26 28t-26 22', ...SW(10) }, 'red', { stroke: true }),
    s('path', { d: 'M118 72q24 2 24 26 0 18-14 20', ...SW(16) }, 'skin', { stroke: true }),
    s('path', { d: 'M120 84h12M120 98h14', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M50 40q-6-8 0-16M74 40q-6-8 0-16', ...SW(3) }, 'gray', { stroke: true })
  ],
  'ateísmo': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'sky'),
    s('path', { d: 'M52 50q-16 0-16-14t18-12q6-12 24-10 14-6 26 4 18 0 18 16t-18 16z', ...DASH(3, '5 6') }, 'navy', { stroke: true }),
    ...person(80, 140, 'gray', { accent: true }),
    s('path', { d: 'M68 104h24', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M72 74q8-4 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  balonmano: [
    s('path', { d: 'M100 136V50h46', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M106 60h40M106 80h40M106 100h40M106 120h40M120 54v82M134 54v82', ...SW(2) }, 'gray', { stroke: true }),
    ...lean(46, 136, -12, 'blue', { accent: true }),
    s('path', { d: 'M52 94l14-42', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 68, cy: 42, r: 12 }, 'yellow'),
    s('path', { d: 'M58 42h20M68 30v24', ...SW(2) }, 'orange', { stroke: true })
  ],
  'bioquímica': [
    s('path', { d: 'M70 24v34l-30 62q-4 14 10 14h60q14 0 10-14L90 58V24z' }, 'white'),
    s('path', { d: 'M54 98h52l14 28q2 8-8 8H48q-10 0-8-8z' }, 'green', { accent: true }),
    s('path', { d: 'M70 24v34l-30 62q-4 14 10 14h60q14 0 10-14L90 58V24M62 24h36', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M68 112q12-16 24 0t-12 14M68 112q12 16 24 0', ...SW(4) }, 'purple', { stroke: true }),
    s('path', { d: ring(118, 44, 8) + ring(132, 26, 5), ...SW(3) }, 'mint', { stroke: true })
  ],
  bolita: [
    s('circle', { cx: 56, cy: 96, r: 26 }, 'blue', { accent: true }),
    s('circle', { cx: 108, cy: 106, r: 18 }, 'red'),
    s('circle', { cx: 100, cy: 58, r: 14 }, 'green'),
    s('path', { d: 'M44 86q4-10 14-12', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: dots([[102, 98], [96, 52]], 4) }, 'white'),
    s('path', { d: 'M18 130h124', ...SW(3) }, 'gray', { stroke: true })
  ],
  canje: [
    s('rect', { x: 18, y: 40, width: 56, height: 34, rx: 4 }, 'yellow', { accent: true }),
    s('path', { d: 'M30 50h32M30 62h20', ...SW(3) }, 'orange', { stroke: true }),
    s('rect', { x: 90, y: 92, width: 50, height: 42, rx: 3 }, 'red'),
    s('path', { d: 'M115 92v42M90 108h50', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M84 50q36 0 36 34M112 76l8 10 8-10', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M76 124q-32 0-32-36M36 96l8-10 8 10', ...SW(5) }, 'blue', { stroke: true })
  ],
  capullo: [
    s('path', { d: 'M80 140V82', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 120, -150, 30, 9) + leaflet(80, 108, -30, 30, 9) }, 'green'),
    s('path', { d: 'M80 84q-26-10-20-40 6-20 20-28 14 8 20 28 6 30-20 40z' }, 'pink', { accent: true }),
    s('path', { d: 'M80 84q-18-24 0-62M80 84q18-24 0-62', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M62 82q18 10 36 0l-6-12H68z' }, 'green')
  ],
  'caribeño': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'sky'),
    s('path', { d: 'M14 96h132v50H14z' }, 'mint', { accent: true }),
    s('path', { d: 'M14 120q33-10 66 0t66 0v26H14z' }, 'blue'),
    s('path', { d: 'M58 90h46l-6 10H64z' }, 'white'),
    s('path', { d: 'M80 88V36l22 46zM78 44L60 82h18z' }, 'orange'),
    s('circle', { cx: 34, cy: 38, r: 12 }, 'yellow'),
    s('path', { d: birds([[124, 40]]), ...SW(3) }, 'dark', { stroke: true })
  ],
  cebo: [
    s('path', { d: 'M80 14v62q0 30-22 30t-20-26l8 6', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 86q10-14 24-4t26 0 22 6', ...SW(10) }, 'pink', { stroke: true, accent: true }),
    s('path', { d: 'M14 120q16-8 33 0t33 0 33 0 33 0v26H14z' }, 'blue'),
    s('path', { d: fishes([[110, 130]]) }, 'orange')
  ],
  'ceño': [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'skin'),
    s('path', { d: 'M36 66l34 14M124 66L90 80', ...SW(9) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M74 52v18M86 52v18', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: dots([[56, 92], [104, 92]], 7) }, 'dark'),
    s('path', { d: 'M60 124q20-12 40 0', ...SW(5) }, 'dark', { stroke: true })
  ],
  colonizador: [
    s('path', { d: 'M14 120q16-8 33 0t33 0 33 0 33 0v26H14z' }, 'blue'),
    s('path', { d: 'M28 92h104l-14 26H44z' }, 'brown', { accent: true }),
    s('path', { d: 'M60 92V26M100 92V36', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 36h40q4 20 0 40H40q-4-20 0-40zM84 44h32q4 18 0 34H84q-4-16 0-34z' }, 'cream'),
    s('path', { d: 'M60 26l16 6-16 6z' }, 'red'),
    s('path', { d: dots([[46, 104], [80, 104], [114, 104]], 4) }, 'dark')
  ]
};
