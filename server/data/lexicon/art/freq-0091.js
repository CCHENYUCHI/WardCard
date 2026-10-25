// Illustration specs for words still undrawn in batches 0090–0091 (see server/scripts/lexicon/art.js)
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
module.exports = {
  cuatrimestre: [
    s('rect', { x: 22, y: 30, width: 116, height: 108, rx: 8 }, 'white'),
    outline({ x: 22, y: 30, width: 116, height: 108, rx: 8 }),
    s('rect', { x: 22, y: 30, width: 116, height: 24, rx: 8 }, 'red'),
    s('path', { d: 'M50 22v18M110 22v18', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: rects([[32, 64, 20, 18], [57, 64, 20, 18], [82, 64, 20, 18], [107, 64, 20, 18]]) }, 'orange', { accent: true }),
    s('path', { d: rects([[32, 88, 20, 18], [57, 88, 20, 18], [82, 88, 20, 18], [107, 88, 20, 18], [32, 112, 20, 18], [57, 112, 20, 18], [82, 112, 20, 18], [107, 112, 20, 18]]) }, 'gray')
  ],
  cuidador: [
    ground(),
    ...person(52, 136, 'mint', { h: 52, accent: true }),
    s('rect', { x: 92, y: 98, width: 34, height: 38, rx: 10 }, 'purple'),
    s('circle', { cx: 109, cy: 84, r: 12 }, 'skin'),
    s('path', { d: 'M97 78q12-14 24 0', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 96q18-4 28 8M132 104l4 32', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: heart(82, 38, 16) }, 'red')
  ],
  'cáñamo': [
    s('path', { d: leaflet(58, 96, -90, 66, 8) + leaflet(58, 96, -60, 56, 7) + leaflet(58, 96, -120, 56, 7) + leaflet(58, 96, -30, 42, 6) + leaflet(58, 96, -150, 42, 6) }, 'green', { accent: true }),
    s('path', { d: 'M58 96v40', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: ells([[112, 112, 30, 22]]) }, 'tan'),
    s('path', { d: ring(112, 112, 20) + ring(112, 112, 11), ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M138 104q10-20-4-40', ...SW(6) }, 'tan', { stroke: true })
  ],
  decepcionar: [
    ...face(80, 50, 30, 'yellow', 'frown'),
    s('path', { d: drop(104, 58, 5) }, 'blue'),
    s('rect', { x: 42, y: 98, width: 76, height: 40, rx: 3 }, 'red', { accent: true }),
    s('rect', { x: 46, y: 92, width: 68, height: 10 }, 'dark'),
    s('rect', { x: 92, y: 84, width: 46, height: 10, rx: 2, transform: 'rotate(30 115 89)' }, 'red'),
    s('path', { d: 'M80 98v40', ...SW(6) }, 'yellow', { stroke: true })
  ],
  delegar: [
    ground(),
    ...person(36, 136, 'navy', { h: 50 }),
    ...person(124, 136, 'green', { h: 44 }),
    ...paper(68, 70, 24, 30),
    s('path', { d: 'M50 98l18-10M110 98l-18-8', ...SW(5) }, 'skin', { stroke: true }),
    arrow('M50 44q30-16 60 0M100 34l10 10-14 4', 'orange')
  ],
  depresivo: [
    s('path', { d: ells([[80, 34, 40, 16], [60, 30, 20, 14], [102, 28, 22, 14]]) }, 'dark'),
    s('path', { d: 'M56 56l-4 12M80 56l-4 12M104 56l-4 12', ...SW(4) }, 'blue', { stroke: true }),
    ground(),
    ...lean(80, 136, 10, 'gray', { h: 40 }),
    s('path', { d: 'M86 92q4 6 10 4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: drop(96, 100, 4) }, 'blue', { accent: true })
  ],
  'desdén': [
    s('path', { d: HEAD, transform: 'rotate(-14 80 80)' }, 'skin', { accent: true }),
    s('path', { d: 'M34 70q-4-40 40-46q36-2 46 20q-30 6-48-4q-10 14-38 30z', transform: 'rotate(-14 80 80)' }, 'brown'),
    s('path', { d: 'M90 58q8 4 14 0', ...SW(4), transform: 'rotate(-14 80 80)' }, 'dark', { stroke: true }),
    s('path', { d: 'M104 92h10', ...SW(4), transform: 'rotate(-14 80 80)' }, 'dark', { stroke: true }),
    s('path', { d: ells([[140, 52, 8, 5], [134, 40, 5, 4]]) }, 'gray')
  ],
  destello: [
    backdrop('navy'),
    s('path', { d: rays(80, 80, 30, 56, 8, 22.5), ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: sparkle(80, 80, 52) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(34, 36, 10) + sparkle(126, 120, 12) + sparkle(124, 34, 7) }, 'cream')
  ],
  destrozo: [
    ground(130),
    s('path', { d: burst(80, 76, 46, 26, 10) }, 'orange'),
    s('path', { d: 'M58 128l10-30 16 10-6 20zM96 128l4-26 18 6-4 20zM24 126l14-16 10 16zM120 126l8-20 12 18z' }, 'blue', { accent: true }),
    s('path', { d: 'M64 56l12 12M98 50l-8 16M80 44v14', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M74 98l-10 12M96 92l10-6', ...SW(3) }, 'sky', { stroke: true })
  ],
  disparidad: [
    ground(),
    s('rect', { x: 28, y: 30, width: 40, height: 106, rx: 4 }, 'green', { accent: true }),
    s('rect', { x: 92, y: 114, width: 40, height: 22, rx: 4 }, 'red'),
    s('path', { d: 'M112 36v62M102 46l10-10 10 10M102 88l10 10 10-10', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 30h50', ...DASH(3) }, 'gray', { stroke: true })
  ],
  electricista: [
    ground(),
    ...person(58, 136, 'blue', { h: 50 }),
    s('path', { d: 'M42 74q0-18 16-18t16 18zM38 74h40', ...SW(0) }, 'yellow'),
    s('path', { d: 'M38 72h40v6H38z' }, 'yellow'),
    s('path', { d: 'M118 22l-22 50h18l-12 44 30-58h-18l12-36z' }, 'yellow', { accent: true }),
    s('path', { d: 'M72 104l24-6', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M96 98l14-4', ...SW(4) }, 'red', { stroke: true })
  ],
  embarcar: [
    s('rect', { x: 14, y: 116, width: 132, height: 30, rx: 6 }, 'sky'),
    s('path', { d: 'M78 96h68l-10 30H88z' }, 'navy', { accent: true }),
    s('rect', { x: 96, y: 68, width: 40, height: 28, rx: 3 }, 'white'),
    s('path', { d: 'M102 76h28', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M14 128L84 98', ...SW(5) }, 'brown', { stroke: true }),
    ...lean(46, 112, 10, 'red', { h: 30, w: 22, r: 9 })
  ],
  encina: [
    ...tree(80, 'green'),
    s('path', { d: ells([[56, 64, 8, 4], [98, 52, 8, 4], [108, 86, 8, 4], [68, 92, 8, 4]]) }, 'mint'),
    s('path', { d: ells([[124, 128, 7, 9], [36, 128, 7, 9]]) }, 'tan', { accent: true }),
    s('path', { d: 'M116 124a8 6 0 0 1 16 0zM28 124a8 6 0 0 1 16 0z' }, 'brown')
  ],
  'endémico': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: ells([[80, 120, 60, 18]]) }, 'tan'),
    s('path', { d: 'M48 116q-4-40 6-62', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(54, 54, -160, 30, 8) + leaflet(54, 54, -20, 30, 8) + leaflet(54, 54, 160, 26, 7) + leaflet(54, 54, 20, 26, 7) }, 'green'),
    s('path', { d: ells([[98, 100, 18, 14]]) + 'M88 112l-2 8M104 112l2 8' }, 'brown', { accent: true }),
    s('path', { d: 'M114 96l22 8', ...SW(3) }, 'tan', { stroke: true }),
    s('circle', { cx: 108, cy: 94, r: 2.5 }, 'dark')
  ],
  'epílogo': [
    ...openBook(80, 46),
    s('path', { d: 'M38 58h34M38 68h34M38 78h34M38 88h28M88 66h34M88 76h20', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[104, 92]], 4) }, 'brown'),
    s('path', { d: 'M118 42v72l7-6 7 6V42z' }, 'red', { accent: true })
  ],
  'epístola': [
    s('rect', { x: 20, y: 46, width: 112, height: 76, rx: 4 }, 'cream'),
    outline({ x: 20, y: 46, width: 112, height: 76, rx: 4 }, 'brown'),
    s('path', { d: 'M22 50l54 40 54-40', ...SW(3) }, 'brown', { stroke: true }),
    s('circle', { cx: 76, cy: 90, r: 12 }, 'red', { accent: true }),
    s('path', { d: 'M116 132Q126 70 146 26q-30 26-36 74z' }, 'white'),
    s('path', { d: 'M116 132Q126 70 146 26', ...SW(3) }, 'gray', { stroke: true })
  ],
  equis: [
    ground(),
    s('path', { d: busts([30, 130], 136, 26, 46) + dots([[30, 76], [130, 76]], 12) }, 'gray'),
    ...person(80, 136, 'gray', { h: 50, accent: true }),
    s('path', { d: dots([[76, 70], [84, 70]], 1.8) + 'M76 78h8' }, 'dark'),
    s('path', { d: 'M75 78h10', ...SW(2) }, 'dark', { stroke: true })
  ],
  escarlata: [
    s('path', { d: 'M24 30h112', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M28 32h104l-6 100q-10 6-20 0q-10 6-20 0q-10 6-20 0q-10 6-20 0q-10 6-20 0z' }, 'red', { accent: true }),
    s('path', { d: 'M50 36l-4 94M74 36v94M98 36l2 94M120 36l4 94', ...SW(3) }, 'pink', { stroke: true })
  ],
  especulador: [
    ground(),
    s('path', { d: ells([[38, 128, 18, 6], [38, 120, 18, 6], [38, 112, 18, 6], [38, 104, 18, 6]]) }, 'yellow'),
    ...person(38, 98, 'navy', { h: 34, w: 24, r: 10 }),
    s('path', { d: 'M44 50h18v8H44z' }, 'dark'),
    arrow('M66 120l20-24 14 12 36-50M118 58h18v18', 'green', 7),
    s('path', { d: 'M66 120l20-24 14 12 36-50', ...SW(7) }, 'green', { stroke: true, accent: true })
  ],
  estupefaciente: [
    s('rect', { x: 26, y: 70, width: 96, height: 22, rx: 4, transform: 'rotate(-35 74 81)' }, 'sky', { accent: true }),
    s('path', { d: 'M24 120l18-12', ...SW(3), transform: 'rotate(0)' }, 'gray', { stroke: true }),
    s('path', { d: 'M104 38l18-12M114 46l-14-20', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 104l30-22', ...SW(10) }, 'red', { stroke: true }),
    s('path', { d: spiral(116, 104), ...SW(4) }, 'purple', { stroke: true }),
    s('path', { d: spiral(126, 124), ...SW(3) }, 'purple', { stroke: true })
  ],
  exterminar: [
    s('path', { d: ells([[80, 84, 26, 34]]) }, 'brown'),
    s('path', { d: 'M56 66l-20-12M54 84H30M56 102l-20 12M104 66l20-12M106 84h24M104 102l20 12M70 50l-8-16M90 50l8-16', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 46, r: 12 }, 'dark'),
    s('path', { d: ring(80, 80, 60), ...SW(10) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M38 38l84 84', ...SW(10) }, 'red', { stroke: true })
  ],
  floreciente: [
    ground(),
    ...flower(64, 52, 'pink'),
    s('path', { d: leaflet(64, 110, -30, 30, 9) + leaflet(64, 118, -150, 26, 8) }, 'green'),
    arrow('M112 128V40M98 54l14-14 14 14', 'green', 7)
  ],
  graso: [
    s('path', { d: drop(110, 64, 26) }, 'yellow', { accent: true }),
    s('path', { d: 'M100 52q6-6 12-2', ...SW(4) }, 'cream', { stroke: true }),
    s('path', { d: 'M18 116q12-14 24 0t24 0t24 0t24 0v18q-12-14-24 0t-24 0t-24 0t-24 0z' }, 'pink'),
    s('path', { d: 'M18 124q12-14 24 0t24 0t24 0t24 0', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: drop(34, 94, 6) + drop(56, 84, 5) }, 'orange')
  ],
  hechicero: [
    ...person(70, 140, 'purple', { h: 54, accent: true }),
    s('path', { d: 'M50 72h40L72 16z' }, 'navy'),
    s('path', { d: star(68, 52, 7) }, 'yellow'),
    s('path', { d: 'M60 86q10 26 20 0z' }, 'white'),
    s('path', { d: 'M86 108L120 58', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: sparkle(124, 50, 14) + sparkle(140, 76, 7) }, 'yellow')
  ],
  ilustrador: [
    s('path', { d: 'M96 48l-14 90M120 48l14 90M108 120v18', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 76, y: 26, width: 66, height: 70, rx: 3 }, 'white'),
    outline({ x: 76, y: 26, width: 66, height: 70, rx: 3 }),
    s('path', { d: 'M80 92q20-30 34-14q12-16 24 14z' }, 'green'),
    s('circle', { cx: 122, cy: 46, r: 9 }, 'orange'),
    ...person(36, 136, 'red', { h: 48, accent: true }),
    s('path', { d: 'M48 100l22-24', ...SW(5) }, 'yellow', { stroke: true })
  ],
  imperfecto: [
    s('path', { d: ring(80, 80, 56), ...DASH(4, '8 8') }, 'gray', { stroke: true }),
    s('path', { d: 'M80 30q30 4 44 26q10 30-12 54q-24 22-44 12q-30-8-38-32q-6-26 12-44q14-14 26-12l4 20 14-6z' }, 'orange', { accent: true }),
    s('path', { d: 'M62 70l10 10-6 14', ...SW(4) }, 'brown', { stroke: true })
  ],
  impresentable: [
    ...person(80, 140, 'tan', { h: 54, accent: true }),
    s('path', { d: 'M66 58l-8-10M72 52l-4-12M80 50v-12M88 52l4-12M94 58l10-8', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: dots([[72, 100], [90, 114], [78, 124]], 5) }, 'brown'),
    s('path', { d: 'M28 60q-6-8 0-16t0-16M132 60q6-8 0-16t0-16', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M74 76q6-4 12 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  inactivo: [
    s('rect', { x: 22, y: 30, width: 116, height: 80, rx: 8 }, 'dark'),
    s('rect', { x: 30, y: 38, width: 100, height: 64, rx: 4 }, 'gray', { accent: true }),
    s('path', { d: 'M68 62a18 18 0 1 0 24 0M80 54v18', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M70 110l-6 20h32l-6-20zM50 132h60', ...SW(0) }, 'dark'),
    s('rect', { x: 52, y: 128, width: 56, height: 8, rx: 3 }, 'dark'),
    s('path', { d: 'M100 38l30 0M100 38l30 30M100 38l12 22M108 46q8 2 8 10', ...SW(2) }, 'white', { stroke: true })
  ],
  inconformidad: [
    ...face(80, 62, 40, 'yellow', 'frown'),
    s('path', { d: 'M56 46l14 6M104 46l-14 6', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M38 126q42-30 84 0', ...SW(14) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M40 108q40 30 80 0', ...SW(14) }, 'orange', { stroke: true })
  ],
  ineludible: [
    s('path', { d: ring(80, 84, 54), ...SW(12) }, 'gray', { stroke: true }),
    ...person(80, 116, 'blue', { h: 34, w: 24, r: 10, accent: true }),
    arrow('M52 86l-16 0M44 76l-10 10 10 10', 'red', 5),
    arrow('M108 86h16M116 76l10 10-10 10', 'red', 5),
    s('path', { d: 'M28 50l-8-6M132 50l8-6M80 26v-10', ...SW(4) }, 'orange', { stroke: true })
  ],
  infamia: [
    ground(),
    ...person(80, 136, 'gray', { h: 46, accent: true }),
    s('path', { d: 'M76 70q4 4 8 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 74h30M146 74h-30', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M14 74h14M146 74h-14', ...SW(12) }, 'red', { stroke: true }),
    s('path', { d: ells([[80, 28, 36, 12], [64, 24, 16, 10], [96, 22, 18, 12]]) }, 'dark')
  ],
  interceptar: [
    ground(),
    ...person(26, 136, 'blue', { h: 40, w: 24, r: 10 }),
    ...person(134, 136, 'blue', { h: 40, w: 24, r: 10 }),
    ...person(80, 124, 'red', { h: 40, w: 26, r: 11, accent: true }),
    s('path', { d: 'M40 70q40-50 80 0', ...DASH(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 38, r: 11 }, 'orange'),
    s('path', { d: 'M70 92l4-40M90 92l-4-40', ...SW(5) }, 'skin', { stroke: true })
  ],
  inviable: [
    s('rect', { x: 14, y: 116, width: 132, height: 30, rx: 4 }, 'sky'),
    s('path', { d: 'M14 70h40l10 76H14zM146 70h-40l-10 76h50z' }, 'brown'),
    s('path', { d: 'M54 70l26 8M106 70l-14 12', ...SW(6) }, 'tan', { stroke: true }),
    ...car(18, 52, 'blue'),
    s('circle', { cx: 126, cy: 44, r: 16 }, 'red', { accent: true }),
    s('path', { d: 'M116 44h20', ...SW(6) }, 'white', { stroke: true })
  ],
  involuntario: [
    s('path', { d: 'M28 100h52M32 100v36M76 100v36', ...SW(6) }, 'brown', { stroke: true }),
    ...person(48, 96, 'green', { h: 42, w: 28 }),
    s('path', { d: 'M50 92h40', ...SW(14) }, 'blue', { stroke: true }),
    s('path', { d: 'M92 92l30 28', ...SW(11) }, 'skin', { stroke: true }),
    s('path', { d: 'M96 120q14 14 32 10', ...DASH(3, '4 5') }, 'gray', { stroke: true }),
    s('path', { d: 'M128 40L104 74', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M92 72l14-12 8 8-14 12z' }, 'red', { accent: true }),
    s('path', { d: 'M116 82l8-4M114 92l10 2', ...SW(3) }, 'orange', { stroke: true })
  ],
  'irrigación': [
    s('rect', { x: 14, y: 96, width: 132, height: 44, rx: 4 }, 'brown'),
    s('path', { d: 'M14 112h132', ...SW(8) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M30 96v-18M54 96v-18M78 96v-18M102 96v-18M126 96v-18M30 126v-6M54 126v-6M78 126v-6M102 126v-6M126 126v-6', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M30 82l-6-6M30 82l6-6M54 82l-6-6M54 82l6-6M78 82l-6-6M78 82l6-6M102 82l-6-6M102 82l6-6M126 82l-6-6M126 82l6-6', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M80 70V30', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 30q-30 0-50 30M80 30q30 0 50 30', ...DASH(4, '3 7') }, 'sky', { stroke: true })
  ],
  ligereza: [
    s('path', { d: 'M40 132Q50 70 120 26q4 50-60 92z' }, 'sky', { accent: true }),
    s('path', { d: 'M40 132Q70 80 116 32', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M74 86l-14-8M86 72l-12-10M96 58l-10-10', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M18 50q14-8 28 0M110 110q14-8 28 0M122 128q10-6 20 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  londinense: [
    s('rect', { x: 92, y: 50, width: 36, height: 88 }, 'tan'),
    s('path', { d: 'M90 50l20-30 20 30z' }, 'brown'),
    s('circle', { cx: 110, cy: 70, r: 12 }, 'white'),
    s('path', { d: ring(110, 70, 12) + 'M110 62v8h6', ...SW(3) }, 'dark', { stroke: true }),
    ground(),
    ...person(50, 136, 'navy', { h: 46 }),
    s('path', { d: 'M22 58a28 22 0 0 1 56 0z' }, 'red', { accent: true }),
    s('path', { d: 'M50 58v32', ...SW(3) }, 'dark', { stroke: true })
  ],
  lucidez: [
    s('path', { d: HEAD }, 'skin'),
    s('circle', { cx: 74, cy: 64, r: 22 }, 'yellow', { accent: true }),
    s('path', { d: rays(74, 64, 26, 36, 8), ...SW(4) }, 'orange', { stroke: true }),
    s('circle', { cx: 112, cy: 68, r: 4 }, 'dark'),
    s('path', { d: ells([[26, 34, 12, 8]]) }, 'gray')
  ],
  majestuoso: [
    backdrop('sky'),
    s('circle', { cx: 122, cy: 40, r: 14 }, 'yellow'),
    s('path', { d: 'M14 146L64 40l40 70 14-20 28 56z' }, 'navy', { accent: true }),
    s('path', { d: 'M52 66l12-26 12 22-8-4-6 8-4-6z' }, 'white'),
    s('rect', { x: 14, y: 130, width: 132, height: 16 }, 'green')
  ],
  maletero: [
    ground(132),
    s('path', { d: 'M18 98q2-14 16-16l22-20h40l16 20h12v34H18z' }, 'red', { accent: true }),
    s('path', { d: 'M60 66h32l12 16H50z' }, 'sky'),
    s('path', { d: 'M124 82l20-42', ...SW(6) }, 'red', { stroke: true }),
    s('rect', { x: 110, y: 64, width: 26, height: 34, rx: 4, transform: 'rotate(-12 123 81)' }, 'blue'),
    s('path', { d: 'M118 66q4-8 10-2', ...SW(3), transform: 'rotate(-12 123 81)' }, 'dark', { stroke: true }),
    s('path', { d: dots([[42, 116], [100, 116]], 12) }, 'dark')
  ],
  'mamón': [
    s('path', { d: ells([[70, 112, 40, 26]]) }, 'sky'),
    s('circle', { cx: 70, cy: 70, r: 32 }, 'skin'),
    s('path', { d: 'M40 62a30 32 0 0 1 60 0q-30-12-60 0z' }, 'sky'),
    s('path', { d: dots([[60, 72]], 3) + 'M74 70h8' }, 'dark'),
    s('rect', { x: 86, y: 70, width: 50, height: 22, rx: 8, transform: 'rotate(-20 110 81)' }, 'white'),
    outline({ x: 86, y: 70, width: 50, height: 22, rx: 8, transform: 'rotate(-20 110 81)' }),
    s('rect', { x: 78, y: 76, width: 14, height: 10, rx: 4, transform: 'rotate(-20 110 81)' }, 'orange', { accent: true })
  ],
  masticar: [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'skin'),
    s('path', { d: dots([[60, 60], [100, 60]], 5) }, 'dark'),
    s('path', { d: 'M52 96q28 24 56 0z' }, 'dark'),
    s('path', { d: 'M58 98h44v6q-22 8-44 0z' }, 'white'),
    s('path', { d: ells([[40, 82, 10, 6], [120, 82, 10, 6]]) }, 'pink', { accent: true }),
    s('path', { d: 'M20 120v-20M14 106l6-6 6 6M140 120v-20M134 106l6-6 6 6', ...SW(3) }, 'gray', { stroke: true })
  ],
  mellizo: [
    ground(),
    ...person(52, 136, 'blue', { h: 38, w: 28, r: 14 }),
    ...person(108, 136, 'pink', { h: 38, w: 28, r: 14, accent: true }),
    s('path', { d: 'M38 66q14-22 28 0z' }, 'brown'),
    s('path', { d: 'M92 72q16-30 32 0q-16-8-32 0zM118 56l12-6v12z' }, 'orange'),
    s('path', { d: heart(80, 36, 12) }, 'red')
  ],
  metano: [
    s('path', { d: 'M80 76L80 30M80 76L38 100M80 76L122 100M80 76L80 124', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 76, r: 20 }, 'dark', { accent: true }),
    s('path', { d: dots([[80, 30], [38, 100], [122, 100], [80, 124]], 13) }, 'white'),
    s('path', { d: ring(80, 30, 13) + ring(38, 100, 13) + ring(122, 100, 13) + ring(80, 124, 13), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: drop(130, 40, 10) }, 'blue')
  ],
  modular: [
    s('path', { d: rects([[30, 108, 48, 28]]) + rects([[36, 102, 10, 6], [62, 102, 10, 6]]) }, 'blue'),
    s('path', { d: rects([[82, 108, 48, 28]]) + rects([[88, 102, 10, 6], [114, 102, 10, 6]]) }, 'green'),
    s('path', { d: rects([[56, 74, 48, 28]]) + rects([[62, 68, 10, 6], [88, 68, 10, 6]]) }, 'yellow'),
    s('path', { d: rects([[60, 22, 48, 28]]) + rects([[66, 16, 10, 6], [92, 16, 10, 6]]) }, 'red', { accent: true }),
    arrow('M84 54v10', 'gray', 4)
  ],
  'mínimamente': [
    s('path', { d: 'M24 112a56 56 0 0 1 112 0z' }, 'cream'),
    s('path', { d: 'M30 112a50 50 0 0 1 14-34', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true }),
    s('path', { d: 'M24 112a56 56 0 0 1 112 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 112L40 104', ...SW(6) }, 'orange', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 112, r: 8 }, 'dark'),
    s('path', { d: 'M24 128h112', ...SW(4) }, 'gray', { stroke: true })
  ],
  naipe: [
    s('rect', { x: 34, y: 34, width: 56, height: 80, rx: 6, transform: 'rotate(-18 62 124)' }, 'white'),
    outline({ x: 34, y: 34, width: 56, height: 80, rx: 6, transform: 'rotate(-18 62 124)' }),
    s('rect', { x: 70, y: 34, width: 56, height: 80, rx: 6, transform: 'rotate(14 98 124)' }, 'white'),
    outline({ x: 70, y: 34, width: 56, height: 80, rx: 6, transform: 'rotate(14 98 124)' }),
    s('path', { d: heart(110, 66, 16) }, 'red', { accent: true }),
    s('path', { d: 'M50 54c-12 12-18 18-18 26a9 9 0 0 0 16 4l-3 10h10l-3-10a9 9 0 0 0 16-4c0-8-6-14-18-26z', transform: 'rotate(-18 62 124)' }, 'black')
  ],
  nato: [
    s('path', { d: ells([[80, 108, 34, 30]]) }, 'sky'),
    s('circle', { cx: 80, cy: 72, r: 26 }, 'skin'),
    s('path', { d: 'M70 74q4 4 8 0M84 74q4 4 8 0M76 86q4 3 8 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 52l-4-30 16 14 12-20 12 20 16-14-4 30z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[68, 44], [92, 44], [80, 42]], 3) }, 'red'),
    s('path', { d: 'M54 114q26 12 52 0', ...SW(4) }, 'white', { stroke: true })
  ],
  nebulosa: [
    backdrop('navy'),
    s('path', { d: ells([[70, 80, 44, 26], [96, 70, 30, 22]]), transform: 'rotate(-20 80 80)' }, 'purple'),
    s('path', { d: ells([[80, 78, 28, 14], [64, 88, 16, 10]]), transform: 'rotate(-20 80 80)' }, 'pink', { accent: true }),
    s('circle', { cx: 82, cy: 78, r: 6 }, 'cream'),
    s('path', { d: dots([[28, 30], [126, 30], [134, 124], [32, 128], [110, 112], [44, 60]], 2.5) + sparkle(124, 56, 6) }, 'white')
  ],
  nominar: [
    ground(),
    s('path', { d: busts([36, 124], 136, 30, 42) + dots([[36, 84], [124, 84]], 13) }, 'gray'),
    ...person(80, 136, 'blue', { h: 46, accent: true }),
    s('path', { d: star(80, 30, 16) }, 'yellow'),
    arrow('M80 50v10', 'orange', 5)
  ],
  'nórdico': [
    backdrop('navy'),
    s('path', { d: 'M20 50q30-20 60 0t60-6', ...SW(8) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M20 66q30-16 60 0t60-4', ...SW(5) }, 'mint', { stroke: true }),
    s('path', { d: 'M14 120l30-44 26 40 20-30 22 34 18-26 16 26v26H14z' }, 'gray'),
    s('path', { d: 'M36 88l8-12 8 12-8-2zM84 94l6-8 6 8z' }, 'white'),
    s('rect', { x: 14, y: 124, width: 132, height: 22, rx: 4 }, 'blue')
  ],
  patito: [
    s('rect', { x: 14, y: 118, width: 132, height: 26, rx: 8 }, 'sky'),
    s('path', { d: ells([[58, 102, 32, 20]]) + 'M26 98l-8-14 20 6z' }, 'white'),
    s('path', { d: ells([[58, 102, 32, 20]]), ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 74, r: 16 }, 'white'),
    s('path', { d: 'M94 72l12 4-12 4z' }, 'orange'),
    s('path', { d: ells([[118, 112, 18, 12], [126, 92, 11, 11]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M136 90l8 3-8 3z' }, 'orange'),
    s('path', { d: dots([[84, 70], [128, 88]], 2) }, 'dark')
  ],
  pecar: [
    s('path', { d: 'M76 48q-36-16-46 20q-8 40 26 58q12 6 24 0q12 6 24 0q34-18 26-58q-10-36-46-20z' }, 'red', { accent: true }),
    s('path', { d: ells([[124, 84, 14, 16]]) }, 'white'),
    s('path', { d: 'M80 48q2-16 12-22', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(86, 32, -30, 26, 8) }, 'green'),
    s('path', { d: 'M20 140q20-14 40 0t40 0q16-10 26-4', ...SW(8) }, 'green', { stroke: true }),
    s('circle', { cx: 132, cy: 134, r: 7 }, 'green')
  ],
  pellejo: [
    s('path', { d: 'M50 30q30 10 60 0l6 18 22-4-10 26q8 20 0 40l10 26-22-4-6 18q-30-10-60 0l-6-18-22 4 10-26q-8-20 0-40l-10-26 22 4z' }, 'tan', { accent: true }),
    s('path', { d: ells([[68, 64, 10, 8], [96, 82, 12, 9], [70, 104, 8, 7], [100, 54, 6, 5]]) }, 'brown'),
    s('path', { d: 'M80 34v94', ...DASH(2, '4 6') }, 'brown', { stroke: true })
  ],
  plasmar: [
    s('path', { d: ells([[80, 124, 56, 10]]) }, 'gray'),
    s('rect', { x: 34, y: 124, width: 92, height: 14, rx: 4 }, 'dark'),
    s('path', { d: 'M60 120q-14-28 6-46q6-10 4-22h20q-2 12 4 22q20 18 6 46z' }, 'orange', { accent: true }),
    s('path', { d: ells([[42, 92, 14, 10], [118, 92, 14, 10]]) }, 'skin'),
    s('path', { d: 'M14 96h20M146 96h-20', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M28 140q-4-10 0-14M132 140q4-10 0-14', ...SW(3) }, 'gray', { stroke: true })
  ],
  playera: [
    s('circle', { cx: 128, cy: 32, r: 14 }, 'yellow'),
    s('path', { d: 'M56 30q24 14 48 0l34 20-12 24-16-8v66H50V66l-16 8-12-24z' }, 'blue', { accent: true }),
    s('path', { d: 'M56 30q24 14 48 0', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: 'M14 142q16-10 32 0t32 0 32 0 32 0', ...SW(4) }, 'sky', { stroke: true })
  ],
  'plusvalía': [
    s('path', { d: 'M20 86l44-40 44 40z' }, 'red'),
    s('rect', { x: 30, y: 86, width: 68, height: 50 }, 'cream'),
    s('rect', { x: 54, y: 106, width: 20, height: 30 }, 'brown'),
    s('path', { d: 'M124 132V40M108 56l16-16 16 16', ...SW(8) }, 'green', { stroke: true, accent: true }),
    s('path', { d: dots([[108, 120], [140, 104]], 8) }, 'yellow')
  ],
  porcentual: [
    s('circle', { cx: 72, cy: 82, r: 52 }, 'sky'),
    s('path', { d: wedge(80, 76, 52, -90, 20) }, 'blue', { accent: true }),
    s('path', { d: wedge(72, 82, 52, 130, 200) }, 'orange'),
    s('path', { d: ring(72, 82, 52), ...SW(3) }, 'white', { stroke: true })
  ],
  posibilitar: [
    ground(),
    s('path', { d: 'M56 136L84 36M92 136L116 40M62 116h26M67 96h26M73 76h26M78 56h26', ...SW(5) }, 'brown', { stroke: true }),
    ...lean(80, 104, 14, 'blue', { h: 30, w: 22, r: 9 }),
    s('path', { d: star(120, 28, 14) }, 'yellow', { accent: true }),
    s('path', { d: 'M138 22l6-4M138 36l6 4', ...SW(3) }, 'orange', { stroke: true })
  ],
  postor: [
    ground(),
    ...person(56, 136, 'green', { h: 48 }),
    s('path', { d: 'M68 96l16-40', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M84 56v-14', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 86, cy: 32, r: 16 }, 'orange', { accent: true }),
    s('rect', { x: 102, y: 108, width: 28, height: 12, rx: 3, transform: 'rotate(-30 116 114)' }, 'brown'),
    s('path', { d: 'M120 116l14 18', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 104, y: 130, width: 36, height: 6 }, 'dark')
  ],
  preferiblemente: [
    ground(),
    s('path', { d: 'M28 80l18 56 18-56z' }, 'tan'),
    s('circle', { cx: 46, cy: 72, r: 18 }, 'gray'),
    s('path', { d: 'M96 80l18 56 18-56z' }, 'tan'),
    s('circle', { cx: 114, cy: 72, r: 18 }, 'pink', { accent: true }),
    s('path', { d: heart(114, 30, 14) }, 'red'),
    s('path', { d: sparkle(140, 56, 6) }, 'yellow')
  ],
  preservativo: [
    s('rect', { x: 30, y: 30, width: 100, height: 100, rx: 6 }, 'blue', { accent: true }),
    s('path', { d: 'M30 36h100M30 124h100', ...DASH(4, '4 4') }, 'navy', { stroke: true }),
    s('path', { d: ring(80, 80, 26), ...SW(8) }, 'sky', { stroke: true }),
    s('path', { d: ring(80, 80, 16), ...SW(3) }, 'sky', { stroke: true })
  ],
  'profundización': [
    s('rect', { x: 14, y: 30, width: 132, height: 30 }, 'green'),
    s('rect', { x: 14, y: 60, width: 132, height: 30 }, 'tan'),
    s('rect', { x: 14, y: 90, width: 132, height: 30 }, 'brown'),
    s('rect', { x: 14, y: 120, width: 132, height: 24 }, 'dark'),
    arrow('M80 18v108M64 110l16 16 16-16', 'orange', 8),
    s('path', { d: 'M80 18v108', ...SW(8) }, 'orange', { stroke: true, accent: true })
  ],
  pronombre: [
    s('rect', { x: 14, y: 44, width: 54, height: 36, rx: 6 }, 'cream'),
    outline({ x: 14, y: 44, width: 54, height: 36, rx: 6 }, 'brown'),
    s('path', { d: 'M24 56h34M24 68h24', ...SW(4) }, 'gray', { stroke: true }),
    arrow('M60 104q20 24 40-10M90 98l10-4 4 10', 'orange', 5),
    s('path', { d: busts([118], 108, 36, 34) }, 'blue', { accent: true }),
    s('circle', { cx: 118, cy: 62, r: 14 }, 'skin')
  ],
  pugna: [
    s('path', { d: 'M14 82h30', ...SW(20) }, 'red', { stroke: true }),
    s('path', { d: 'M146 82h-30', ...SW(20) }, 'blue', { stroke: true }),
    s('rect', { x: 40, y: 64, width: 34, height: 36, rx: 10 }, 'skin'),
    s('rect', { x: 86, y: 64, width: 34, height: 36, rx: 10 }, 'skin'),
    s('path', { d: 'M64 70v24M96 70v24', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: burst(80, 40, 18, 9, 8) }, 'orange', { accent: true }),
    s('path', { d: 'M60 122l10-10M100 122l-10-10M80 128v-12', ...SW(4) }, 'orange', { stroke: true })
  ],
  pulir: [
    s('rect', { x: 14, y: 96, width: 132, height: 36, rx: 4 }, 'brown'),
    s('path', { d: 'M90 100h50', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: ells([[70, 86, 30, 14]]) }, 'yellow', { accent: true }),
    s('path', { d: ells([[70, 70, 22, 14]]) }, 'skin'),
    s('path', { d: 'M110 62q10 6 0 12M120 56q14 10 0 24', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: sparkle(124, 114, 9) + sparkle(30, 118, 6) + sparkle(110, 34, 8) }, 'white')
  ],
  reaparecer: [
    ground(),
    s('circle', { cx: 40, cy: 66, r: 12 }, 'gray', { flatOnly: true }),
    s('path', { d: ring(40, 66, 12) + 'M25 136v-34q0-10 15-10t15 10v34', ...DASH(3, '5 5') }, 'gray', { stroke: true }),
    ...person(116, 136, 'purple', { h: 46, accent: true }),
    arrow('M54 48q30-30 54 0M98 44l10 6 2-12', 'orange', 5),
    s('path', { d: sparkle(140, 62, 8) + sparkle(92, 92, 6) }, 'yellow')
  ],
  recelo: [
    ...face(80, 80, 54, 'yellow', 'flat'),
    s('path', { d: 'M48 64h22M90 60l24-6', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M50 72h18v6H50zM92 72h18v6H92z' }, 'white'),
    s('path', { d: dots([[64, 75], [106, 75]], 4) }, 'dark'),
    s('path', { d: drop(130, 50, 6) }, 'sky', { accent: true })
  ],
  reinante: [
    s('path', { d: 'M40 138V40q40-20 80 0v98z' }, 'red'),
    s('rect', { x: 32, y: 100, width: 96, height: 14, rx: 4 }, 'brown'),
    ...person(80, 130, 'purple', { h: 44 }),
    s('path', { d: 'M64 62l-2-20 10 8 8-14 8 14 10-8-2 20z' }, 'yellow', { accent: true })
  ],
  remanente: [
    s('path', { d: ells([[80, 86, 62, 56]]) }, 'white'),
    s('path', { d: ring(80, 86, 58) + ring(80, 86, 44), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: wedge(80, 86, 44, -30, 30) }, 'orange', { accent: true }),
    s('path', { d: 'M118 64a44 44 0 0 1 0 44', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: dots([[60, 66], [54, 100], [82, 116], [72, 52]], 2) }, 'tan')
  ],
  'satírico': [
    ...paper(22, 22, 96, 116),
    s('circle', { cx: 70, cy: 62, r: 28 }, 'skin'),
    s('path', { d: ells([[92, 70, 18, 10]]) }, 'pink', { accent: true }),
    s('path', { d: dots([[60, 54], [76, 52]], 3) + 'M56 76q12 10 24 4' }, 'dark'),
    s('rect', { x: 60, y: 90, width: 20, height: 30, rx: 6 }, 'blue'),
    s('path', { d: 'M120 136l22-56', ...SW(8) }, 'orange', { stroke: true }),
    s('path', { d: 'M118 130l-2 12 8-6', ...SW(3) }, 'dark', { stroke: true })
  ],
  sensar: [
    s('rect', { x: 26, y: 64, width: 46, height: 46, rx: 8 }, 'gray'),
    s('circle', { cx: 49, cy: 87, r: 12 }, 'red', { accent: true }),
    s('path', { d: 'M84 70q10 17 0 34M98 60q16 27 0 54M112 50q22 37 0 74', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M49 110v26M36 136h26', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 128, y: 40, width: 12, height: 70, rx: 6 }, 'white'),
    outline({ x: 128, y: 40, width: 12, height: 70, rx: 6 }),
    s('circle', { cx: 134, cy: 118, r: 10 }, 'red')
  ],
  sobrellevar: [
    ground(),
    ...lean(76, 136, 18, 'blue'),
    s('path', { d: 'M40 74q-6-34 34-40q40-4 46 24q4 30-34 34q-40 4-46-18z' }, 'gray', { accent: true }),
    s('path', { d: 'M88 104l-4-24', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M136 70l6 10M126 60l10-2', ...SW(3) }, 'sky', { stroke: true })
  ],
  sofocar: [
    s('rect', { x: 22, y: 60, width: 32, height: 76, rx: 12 }, 'red', { accent: true }),
    s('path', { d: 'M30 60v-10h16v10M46 52l18-8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 44q20 0 30 30', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 136q-24-6-14-36q6 10 12 6q-4-20 14-34q0 22 14 32q8 18-4 32z' }, 'orange'),
    s('path', { d: ells([[104, 92, 14, 10], [120, 80, 16, 12], [136, 96, 10, 8]]) }, 'white'),
    s('path', { d: ells([[104, 92, 14, 10], [120, 80, 16, 12], [136, 96, 10, 8]]), ...SW(2) }, 'gray', { stroke: true })
  ],
  surcoreano: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M74 18q20-4 34 6l-6 18q-14 10-18 24l-26 4-10-14 4-20 22-6z' }, 'gray'),
    s('path', { d: 'M58 70l26-4q8 14 22 20l8 26q-4 18-16 24l-18-4-20 8-10-14 6-20q-6-16 2-36z' }, 'green', { accent: true }),
    s('path', { d: ells([[78, 136, 8, 4]]) }, 'green'),
    s('path', { d: 'M50 68l58-6', ...DASH(3, '4 4') }, 'navy', { stroke: true }),
    s('circle', { cx: 80, cy: 98, r: 5 }, 'red')
  ],
  'sífilis': [
    s('circle', { cx: 70, cy: 70, r: 50 }, 'mint'),
    s('path', { d: ring(70, 70, 50), ...SW(10) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 108l32 32', ...SW(14) }, 'dark', { stroke: true }),
    s('path', { d: 'M36 60q6-10 12 0t12 0 12 0 12 0 12 0', ...SW(4) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M44 88q6-10 12 0t12 0 12 0 12 0', ...SW(4) }, 'purple', { stroke: true })
  ],
  tamil: [
    s('path', { d: 'M50 136l6-30h48l6 30zM58 106l6-24h32l6 24zM66 82l4-20h20l4 20zM72 62l3-14h10l3 14z' }, 'orange', { accent: true }),
    s('path', { d: 'M70 136v-18h20v18z' }, 'brown'),
    s('path', { d: 'M76 48q4-12 8 0z' }, 'yellow'),
    ground(),
    s('path', { d: bubble(104, 18, 44, 34) }, 'white'),
    s('path', { d: bubble(104, 18, 44, 34), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M112 34q4-6 8 0t8 0q4-6 8 0', ...SW(3) }, 'blue', { stroke: true })
  ],
  televidente: [
    s('rect', { x: 84, y: 36, width: 62, height: 46, rx: 6 }, 'dark'),
    s('rect', { x: 90, y: 42, width: 50, height: 34, rx: 3 }, 'sky', { accent: true }),
    s('path', { d: 'M115 82v16M100 100h30', ...SW(5) }, 'dark', { stroke: true }),
    ...person(44, 118, 'green', { h: 36, w: 28 }),
    s('path', { d: 'M14 104h66v24H14zM14 96h10v40H14zM70 96h10v40H70z' }, 'red'),
    s('path', { d: 'M60 96l10-6', ...SW(4) }, 'dark', { stroke: true })
  ],
  'traumático': [
    s('path', { d: heart(80, 80, 40) }, 'red', { accent: true }),
    s('path', { d: 'M80 48l-10 20 14 12-12 18 8 20', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M34 16l-8 18h10l-6 16', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: drop(130, 40, 7) }, 'blue')
  ],
  'triatlón': [
    s('path', { d: 'M14 136q10-8 20 0t20 0t20 0', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: ring(48, 74, 22) + ring(112, 74, 22), ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 74l20-26h34l10 26M68 48l14 26 20-26M64 40h12M102 48l-4-12h10', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M96 128h40q8 0 8 8H92q-2-12 4-14z' }, 'orange'),
    s('path', { d: dots([[30, 122]], 7) }, 'skin')
  ],
  trimestral: [
    s('path', { d: wedge(80, 80, 50, -90, 0) }, 'green', { accent: true }),
    s('path', { d: wedge(80, 80, 50, 0, 90) }, 'yellow'),
    s('path', { d: wedge(80, 80, 50, 90, 180) }, 'orange'),
    s('path', { d: wedge(80, 80, 50, 180, 270) }, 'sky'),
    s('path', { d: 'M80 80V30M80 80h50M80 80v50M80 80H30', ...SW(4) }, 'white', { stroke: true }),
    arrow('M138 54a62 62 0 0 1 0 52M128 96l10 12 10-12', 'navy', 5)
  ],
  'unísono': [
    ground(),
    s('path', { d: busts([36, 80, 124], 136, 32, 40) }, 'blue', { accent: true }),
    s('path', { d: dots([[36, 82], [80, 82], [124, 82]], 14) }, 'skin'),
    s('path', { d: dots([[36, 88], [80, 88], [124, 88]], 4) }, 'dark'),
    ...note(76, 46, 'purple'),
    s('path', { d: 'M48 64q8-8 16-4M112 64q-8-8-16-4', ...SW(3) }, 'gray', { stroke: true })
  ],
  vato: [
    ground(),
    ...person(70, 136, 'orange', { h: 50, accent: true }),
    s('path', { d: 'M58 66q12-16 24 0zM58 66l-14 2', ...SW(0) }, 'navy'),
    s('path', { d: 'M58 66l-16 4', ...SW(5) }, 'navy', { stroke: true }),
    s('path', { d: 'M84 98l26-38', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M118 46q8 6 6 16M128 40q12 10 8 24', ...SW(3) }, 'gray', { stroke: true })
  ],
  'veintitrés': [
    s('path', { d: rects([[18, 36, 124, 28], [18, 70, 124, 28]]), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].flatMap(i => [[30 + i * 11.2, 50], [30 + i * 11.2, 84]]), 4.5) }, 'blue'),
    s('path', { d: dots([[56, 122], [80, 122], [104, 122]], 9) }, 'orange', { accent: true })
  ],
  vitrina: [
    s('rect', { x: 34, y: 18, width: 92, height: 124, rx: 4 }, 'brown'),
    s('rect', { x: 42, y: 26, width: 76, height: 108, rx: 2 }, 'sky', { accent: true }),
    s('path', { d: 'M42 72h76M42 106h76', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M70 70q-10-16 4-28h12q14 12 4 28z' }, 'blue'),
    s('path', { d: ells([[80, 94, 18, 10]]) }, 'yellow'),
    s('path', { d: 'M52 40l14 20M100 112l12 14', ...SW(3) }, 'white', { stroke: true })
  ],
  volcar: [
    s('path', { d: ells([[92, 124, 52, 12]]) }, 'sky'),
    s('path', { d: 'M36 120l-20-36 36-14 14 40z', }, 'white'),
    s('path', { d: 'M36 120l-20-36 36-14 14 40z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 110q10 2 14 12', ...SW(8) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: drop(110, 100, 5) + drop(130, 108, 4) }, 'blue'),
    s('path', { d: 'M20 60l8 10M40 50l2 12', ...SW(3) }, 'orange', { stroke: true })
  ],
  advenimiento: [
    backdrop('sky', 14, 100),
    s('path', { d: halfRays(80, 108, 52, 70, 9), ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M34 108a46 46 0 0 1 92 0z' }, 'yellow', { accent: true }),
    s('rect', { x: 14, y: 108, width: 132, height: 38, rx: 4 }, 'green'),
    s('path', { d: birds([[44, 40], [118, 34]]), ...SW(3) }, 'navy', { stroke: true })
  ],
  aerosol: [
    s('rect', { x: 30, y: 62, width: 50, height: 78, rx: 10 }, 'red', { accent: true }),
    s('path', { d: 'M36 62q19-18 38 0z' }, 'gray'),
    s('rect', { x: 48, y: 36, width: 14, height: 14, rx: 3 }, 'dark'),
    s('rect', { x: 30, y: 88, width: 50, height: 22 }, 'white'),
    s('path', { d: dots([[78, 40], [92, 32], [92, 48], [108, 26], [108, 42], [108, 58], [124, 20], [126, 38], [126, 56], [124, 72], [142, 30], [142, 50], [140, 68]], 4) }, 'sky')
  ],
  agallas: [
    s('rect', { x: 14, y: 30, width: 132, height: 100, rx: 12 }, 'sky'),
    s('path', { d: ells([[76, 80, 50, 30]]) + 'M122 80l22-22v44z' }, 'orange', { accent: true }),
    s('path', { d: 'M52 60q-10 20 0 40M60 58q-10 22 0 44M68 58q-10 22 0 44', ...SW(4) }, 'red', { stroke: true }),
    s('circle', { cx: 42, cy: 72, r: 5 }, 'dark'),
    s('path', { d: 'M28 92q6 2 10-2', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[22, 52], [28, 40]], 3) }, 'white')
  ],
  agilizar: [
    ...paper(56, 30, 60, 76),
    s('path', { d: 'M66 46h40M66 58h40M66 70h28', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 50h28M14 70h32M22 90h24', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: 'M60 118l24 14-24 14zM84 118l24 14-24 14z' }, 'green', { accent: true })
  ],
  'alérgico': [
    s('circle', { cx: 52, cy: 62, r: 34 }, 'skin'),
    s('path', { d: 'M36 54l10 4M68 54l-10 4', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 52, cy: 70, r: 7 }, 'red', { accent: true }),
    s('path', { d: dots([[40, 76], [62, 82], [46, 84]], 2.5) }, 'pink'),
    s('rect', { x: 38, y: 96, width: 28, height: 40, rx: 9 }, 'blue'),
    ...flower(118, 84, 'yellow'),
    s('path', { d: dots([[96, 62], [88, 72], [100, 50], [84, 58]], 2.5) }, 'orange')
  ],
  ambientar: [
    s('rect', { x: 34, y: 76, width: 22, height: 60, rx: 3 }, 'cream'),
    s('rect', { x: 66, y: 92, width: 22, height: 44, rx: 3 }, 'cream'),
    s('path', { d: rects([[34, 76, 22, 60], [66, 92, 22, 44]]), ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: drop(45, 62, 7) + drop(77, 78, 7) }, 'orange', { accent: true }),
    s('path', { d: dots([[45, 50], [77, 66]], 20) }, 'yellow', { flatOnly: true, }),
    ...note(112, 60, 'purple'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'brown', { stroke: true })
  ],
  arboleda: [
    ground(),
    s('path', { d: 'M30 136v-34M80 136v-42M130 136v-34', ...SW(9) }, 'brown', { stroke: true }),
    s('path', { d: ells([[30, 82, 22, 30], [130, 82, 22, 30]]) }, 'green'),
    s('path', { d: ells([[80, 64, 30, 40]]) }, 'green', { accent: true }),
    s('path', { d: ells([[55, 92, 14, 18], [105, 92, 14, 18]]) }, 'mint')
  ],
  arrebato: [
    s('path', { d: burst(80, 84, 64, 46, 14) }, 'orange'),
    ...face(80, 84, 40, 'red', 'frown', { accent: true }),
    s('path', { d: 'M58 66l14 8M102 66l-14 8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 30q-6-10 2-16M120 30q6-10-2-16', ...SW(5) }, 'gray', { stroke: true })
  ],
  astral: [
    s('circle', { cx: 80, cy: 80, r: 64 }, 'navy', { accent: true }),
    s('path', { d: ring(80, 80, 50) + rays(80, 80, 50, 64, 12), ...SW(2) }, 'sky', { stroke: true }),
    s('path', { d: 'M80 36a26 26 0 1 0 22 40a20 20 0 0 1-22-40z' }, 'yellow'),
    s('path', { d: star(104, 52, 8) + star(58, 104, 6) }, 'cream'),
    s('path', { d: dots(around(80, 80, 57, 12, 15), 2.5) }, 'white')
  ],
  autocontrol: [
    s('path', { d: ring(80, 84, 58), ...DASH(3, '6 8') }, 'mint', { stroke: true }),
    s('path', { d: ells([[80, 126, 46, 12]]) }, 'purple'),
    s('path', { d: 'M60 120l8-50h24l8 50z' }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 52, r: 16 }, 'skin'),
    s('path', { d: 'M71 52q3 3 6 0M83 52q3 3 6 0', ...SW(2.5) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 84l-24 26M94 84l24 26', ...SW(6) }, 'skin', { stroke: true })
  ],
  avalar: [
    ...paper(32, 18, 82, 108),
    s('path', { d: 'M44 38h58M44 52h58M44 66h58M44 80h36', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 104l-10 40 14-8 8 14 6-42zM112 108l8 34 8-12 14 6-10-34z' }, 'red'),
    s('circle', { cx: 112, cy: 104, r: 22 }, 'yellow', { accent: true }),
    s('path', { d: star(112, 104, 10) }, 'orange')
  ],
  azote: [
    s('path', { d: 'M24 134l30-30', ...SW(12) }, 'brown', { stroke: true }),
    s('path', { d: 'M54 104l6-6', ...SW(14) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 98q60-80 40-70q-40 20 30 0t10 30', ...SW(4) }, 'tan', { stroke: true, accent: true }),
    s('path', { d: 'M138 66l8 10M146 52l-2-10M126 72l2 12', ...SW(3) }, 'orange', { stroke: true })
  ],
  balacera: [
    s('path', { d: 'M20 50h30q14 0 20 8q-6 8-20 8H20z' }, 'yellow', { accent: true }),
    s('path', { d: 'M90 100h30q14 0 20 8q-6 8-20 8H90z' }, 'yellow'),
    s('path', { d: 'M20 50h10v16H20zM90 100h10v16H90z' }, 'orange'),
    s('path', { d: 'M14 82h40M30 132h50M74 58h50', ...DASH(3, '8 6') }, 'gray', { stroke: true }),
    s('path', { d: burst(126, 50, 18, 8, 8) + burst(40, 112, 14, 6, 8) }, 'orange')
  ],
  baterista: [
    ...person(80, 104, 'black', { h: 40 }),
    s('circle', { cx: 80, cy: 112, r: 26 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 112, r: 16 }, 'white'),
    s('path', { d: ells([[124, 78, 20, 5], [36, 96, 18, 8]]) }, 'yellow'),
    s('path', { d: 'M124 80v56M36 104v32', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 72L40 84M94 72l26 0', ...SW(4) }, 'brown', { stroke: true })
  ],
  blanquear: [
    s('path', { d: 'M28 132V76q0-10 8-14h24q8 4 8 14v56z' }, 'blue', { accent: true }),
    s('rect', { x: 40, y: 46, width: 16, height: 16, rx: 3 }, 'white'),
    outline({ x: 40, y: 46, width: 16, height: 16, rx: 3 }),
    s('path', { d: 'M80 54l18-14q10 8 22 0l18 14-8 14-8-4v66H96V64l-8 4z' }, 'white'),
    s('path', { d: 'M80 54l18-14q10 8 22 0l18 14-8 14-8-4v66H96V64l-8 4z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: sparkle(110, 92, 10) + sparkle(36, 28, 7) }, 'yellow')
  ],
  boga: [
    s('rect', { x: 14, y: 104, width: 132, height: 40, rx: 6 }, 'sky'),
    s('path', { d: 'M26 98h108l-14 22H40z' }, 'brown', { accent: true }),
    ...person(76, 98, 'red', { h: 30, w: 24, r: 10 }),
    s('path', { d: 'M40 70l80 60', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: ells([[124, 132, 10, 5]]) }, 'tan'),
    s('path', { d: 'M18 124q8-6 16 0M128 112q8-6 16 0', ...SW(3) }, 'white', { stroke: true })
  ],
  bombardero: [
    s('path', { d: 'M20 66q0-10 12-10h92q16 0 22 10q-6 10-22 10H32q-12 0-12-10z' }, 'gray', { accent: true }),
    s('path', { d: 'M62 66l30-34h12l-16 34zM62 70l26 30h12l-16-30zM24 60l-6-22h10l12 18z' }, 'dark'),
    s('path', { d: 'M126 60h14', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: ells([[60, 104, 6, 10], [44, 128, 6, 10]]) }, 'dark'),
    s('path', { d: 'M54 92l12 0M38 116l12 0', ...SW(3) }, 'red', { stroke: true })
  ],
  'bombón': [
    s('path', { d: heart(80, 84, 36) }, 'red', { accent: true }),
    s('path', { d: dots([[60, 72], [80, 82], [100, 72], [68, 100], [92, 100], [80, 116]], 8) }, 'brown'),
    s('path', { d: dots([[60, 72], [80, 82], [100, 72], [68, 100], [92, 100], [80, 116]], 3) }, 'tan'),
    s('path', { d: sparkle(136, 30, 8) }, 'yellow')
  ],
  brea: [
    s('path', { d: 'M36 64h88l-10 72H46z' }, 'gray'),
    s('path', { d: 'M34 58h92v12q-8 0-8 14q-6 6-10 0v-8q-8-4-12 4v18q-6 6-10 0V80q-8-4-12 4v6q-6 4-10 0V74q-8-4-12 4v6q-4 4-8 0z' }, 'black', { accent: true }),
    s('path', { d: 'M36 52q44-40 88 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[70, 54, 6, 4], [92, 50, 4, 3]]) }, 'dark'),
    s('rect', { x: 14, y: 136, width: 132, height: 8, rx: 3 }, 'dark')
  ],
  calamidad: [
    s('path', { d: ells([[80, 30, 46, 14], [56, 26, 20, 12], [104, 24, 24, 14]]) }, 'dark'),
    s('path', { d: 'M114 40l-10 22h12l-10 22', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M28 96l40-30 40 30z' }, 'brown'),
    s('path', { d: 'M38 96h60v40H38z' }, 'tan', { accent: true }),
    s('path', { d: 'M66 66l-6 30 10 14-6 26', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M112 128l10-8 10 4 8 12h-34z' }, 'gray'),
    s('path', { d: 'M24 56l-4 10M44 56l-4 10M134 70l-4 10', ...SW(3) }, 'blue', { stroke: true })
  ],
  causalidad: [
    ground(),
    s('rect', { x: 18, y: 66, width: 14, height: 46, rx: 2, transform: 'rotate(60 32 136)' }, 'dark'),
    s('rect', { x: 40, y: 90, width: 14, height: 46, rx: 2, transform: 'rotate(40 54 136)' }, 'dark'),
    s('rect', { x: 66, y: 90, width: 14, height: 46, rx: 2, transform: 'rotate(20 80 136)' }, 'dark'),
    s('rect', { x: 94, y: 90, width: 14, height: 46, rx: 2 }, 'red', { accent: true }),
    s('rect', { x: 122, y: 90, width: 14, height: 46, rx: 2 }, 'dark'),
    arrow('M20 40h96M104 30l12 10-12 10', 'orange', 5)
  ],
  colegial: [
    ground(),
    s('rect', { x: 84, y: 82, width: 28, height: 36, rx: 6 }, 'red'),
    ...person(70, 136, 'navy', { h: 42, w: 28, accent: true }),
    s('path', { d: 'M58 54q12-14 24 0z' }, 'yellow'),
    s('path', { d: 'M78 96l10-6', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 62, y: 94, width: 16, height: 10 }, 'white')
  ],
  concluyente: [
    s('circle', { cx: 68, cy: 90, r: 36 }, 'sky', { flatOnly: true }),
    s('path', { d: 'M48 94a20 26 0 0 1 40 0M42 94a26 32 0 0 1 52 0M58 94a10 14 0 0 1 20 0M44 104q24 10 48 0M52 116q16 6 32 0', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: ring(68, 90, 36), ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M94 116l34 26', ...SW(12) }, 'red', { stroke: true, accent: true }),
    s('path', { d: star(124, 34, 14) }, 'yellow')
  ],
  conserje: [
    ...person(80, 112, 'navy', { h: 44 }),
    s('path', { d: 'M66 54h28v-8q-14-8-28 0zM62 54h36v4H62z' }, 'navy'),
    s('rect', { x: 18, y: 100, width: 124, height: 40, rx: 4 }, 'brown', { accent: true }),
    s('path', { d: 'M110 94a10 10 0 0 1 20 0z' }, 'yellow'),
    s('path', { d: 'M106 94h28', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: ring(40, 86, 6) + 'M40 92v10', ...SW(3) }, 'orange', { stroke: true })
  ],
  corregimiento: [
    s('path', { d: 'M20 30l40-10 50 12 32-4-6 56 8 44-44 8-50-8-34 4 6-50z' }, 'mint'),
    s('path', { d: 'M60 20l-4 60 50 8 4-56M56 80l-30 6M106 88l-6 52', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M56 80l50 8 32-2 2 46-44 6z' }, 'orange', { accent: true }),
    s('path', { d: drop(96, 104, 10) }, 'red'),
    s('circle', { cx: 96, cy: 103, r: 4 }, 'white')
  ],
  curricular: [
    s('rect', { x: 26, y: 112, width: 108, height: 22, rx: 3 }, 'blue'),
    s('rect', { x: 34, y: 90, width: 96, height: 22, rx: 3 }, 'red'),
    s('rect', { x: 30, y: 68, width: 100, height: 22, rx: 3 }, 'green'),
    s('path', { d: 'M38 120h88M42 98h80M38 76h84', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M80 26l50 18-50 18-50-18z' }, 'black', { accent: true }),
    s('path', { d: 'M58 54v12h44V54', ...SW(0) }, 'black'),
    s('path', { d: 'M124 46v22', ...SW(4) }, 'yellow', { stroke: true })
  ],
  dardo: [
    s('circle', { cx: 74, cy: 84, r: 58 }, 'dark'),
    s('circle', { cx: 74, cy: 84, r: 46 }, 'cream'),
    s('circle', { cx: 74, cy: 84, r: 30 }, 'red'),
    s('circle', { cx: 74, cy: 84, r: 14 }, 'green'),
    s('path', { d: 'M76 82l48-48', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M118 40l8-18 6 12 12 6-18 8z' }, 'orange', { accent: true })
  ],
  dentadura: [
    s('path', { d: 'M20 70q60-50 120 0v12q-60-30-120 0z' }, 'pink', { accent: true }),
    s('path', { d: 'M20 98q60 40 120 0V88q-60 32-120 0z' }, 'pink'),
    s('path', { d: 'M28 74q52-34 104 0v10q-12 4-14-4q-6 8-14 0q-6 8-14 0q-6 8-14 0q-6 8-14 0q-6 8-14 0q-2 8-16 4z' }, 'white'),
    s('path', { d: 'M28 90q52 26 104 0v-6q-14-2-14 4q-6-8-14 0q-6-8-14 0q-6-8-14 0q-6-8-14 0q-6-8-14 0q-2-6-16-2z' }, 'white'),
    s('path', { d: 'M28 74q52-34 104 0M28 90q52 26 104 0', ...SW(2) }, 'gray', { stroke: true })
  ],
  desistir: [
    ground(),
    ...person(60, 136, 'gray', { h: 46 }),
    s('path', { d: 'M72 96l18-10', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M90 136V24', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M92 26q24-10 48 2v34q-24-10-48-2z' }, 'white', { accent: true }),
    s('path', { d: 'M92 26q24-10 48 2v34q-24-10-48-2z', ...SW(3) }, 'gray', { stroke: true })
  ],
  desprendimiento: [
    s('path', { d: 'M14 20h40l10 30-8 30 14 30-12 26H14z' }, 'brown'),
    s('rect', { x: 14, y: 128, width: 132, height: 14, rx: 3 }, 'dark'),
    s('path', { d: 'M90 128l8-18 16 4 4 14zM118 128l6-12 12 2 4 10z' }, 'gray', { accent: true }),
    s('path', { d: 'M70 76l12-6 8 10-10 8zM84 46l10-4 4 10-10 4z' }, 'gray'),
    arrow('M66 58q14 10 20 30M100 64q8 18 8 34', 'orange', 4),
    s('path', { d: 'M100 136h-4M120 140h4', ...SW(3) }, 'yellow', { stroke: true })
  ],
  diapositiva: [
    s('rect', { x: 20, y: 22, width: 120, height: 82, rx: 4 }, 'white'),
    outline({ x: 20, y: 22, width: 120, height: 82, rx: 4 }),
    s('path', { d: rects([[38, 70, 16, 24], [62, 54, 16, 40], [86, 40, 16, 54]]) }, 'blue', { accent: true }),
    s('path', { d: wedge(120, 50, 12, -90, 120) }, 'orange'),
    s('path', { d: 'M80 104v24M60 140l20-12 20 12', ...SW(5) }, 'dark', { stroke: true })
  ],
  discurrir: [
    s('path', { d: HEAD, transform: 'translate(160 0) scale(-1 1)' }, 'skin'),
    s('path', { d: 'M98 30q20 10 10 24t10 26', ...SW(8) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M14 108q20-10 30 0t30 0M14 126q20-10 30 0t30 0', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: 'M48 56q4-10 10 0M26 64h8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: ells([[124, 22, 6, 5], [136, 38, 4, 3]]) }, 'gray')
  ],
  embole: [
    s('circle', { cx: 120, cy: 40, r: 22 }, 'white'),
    s('path', { d: ring(120, 40, 22) + 'M120 28v12l8 6', ...SW(4) }, 'dark', { stroke: true }),
    ...face(68, 88, 48, 'yellow', 'flat', { accent: true }),
    s('path', { d: 'M46 78q8 4 16 0M74 78q8 4 16 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[68, 112, 10, 12]]) }, 'dark')
  ],
  ensayista: [
    ...person(54, 108, 'purple', { h: 40 }),
    s('rect', { x: 18, y: 104, width: 124, height: 10, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: 'M30 114v26M130 114v26', ...SW(6) }, 'brown', { stroke: true }),
    ...paper(84, 70, 44, 34),
    s('path', { d: 'M90 80h32M90 88h32M90 96h20', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M68 82l26-30', ...SW(4) }, 'navy', { stroke: true })
  ],
  eros: [
    s('path', { d: heart(80, 84, 36) }, 'red', { accent: true }),
    s('path', { d: 'M22 128L138 32', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M138 32l-16 2 4 4 4 4zM132 26l14-6-6 14z' }, 'yellow'),
    s('path', { d: 'M22 128l-4-14M22 128l14 4M30 120l-4-14M30 120l14 4', ...SW(4) }, 'pink', { stroke: true })
  ],
  'estiércol': [
    s('rect', { x: 14, y: 116, width: 132, height: 26, rx: 4 }, 'green'),
    s('path', { d: 'M24 124q4-30 26-30q2-20 22-20q22 0 22 20q22 0 26 30z' }, 'brown', { accent: true }),
    s('path', { d: 'M54 96q10-6 20 0M76 96q10-6 20 0', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M130 128L112 30M104 30l4 22M114 26l4 22M124 24l-2 22', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 60q-4-8 2-14M70 52q-4-8 2-14', ...SW(3) }, 'gray', { stroke: true })
  ],
  'expectación': [
    s('rect', { x: 14, y: 16, width: 132, height: 80, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M40 18v76M66 18v76M94 18v76M120 18v76', ...SW(3) }, 'pink', { stroke: true }),
    s('path', { d: 'M14 16h132v12H14z' }, 'brown'),
    s('path', { d: busts([30, 64, 98, 132], 146, 26, 30) }, 'navy'),
    s('path', { d: dots([[30, 112], [64, 110], [98, 112], [132, 110]], 11) }, 'dark')
  ],
  flagrante: [
    s('path', { d: 'M120 18L46 136h88z' }, 'yellow'),
    s('rect', { x: 110, y: 10, width: 24, height: 16, rx: 3 }, 'dark'),
    ...person(84, 136, 'black', { h: 44 }),
    s('path', { d: 'M72 68h24v8H72z' }, 'black'),
    s('path', { d: ells([[54, 116, 18, 18]]) + 'M48 98l6-8 6 8z' }, 'tan', { accent: true }),
    s('path', { d: dots([[78, 72], [90, 72]], 2) }, 'white')
  ],
  'frenesí': [
    s('path', { d: dots([[20, 30], [140, 26], [30, 100], [134, 104], [60, 22], [104, 34]], 4) }, 'yellow'),
    ...lean(58, 136, -14, 'red', { h: 44, accent: true }),
    ...lean(104, 136, 14, 'purple', { h: 44 }),
    s('path', { d: 'M48 96L20 70M114 96l28-28', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M22 120q-8-6 0-12M140 120q8-6 0-12M80 30v12M72 44l8 4 8-4', ...SW(3) }, 'orange', { stroke: true })
  ],
  frialdad: [
    s('rect', { x: 26, y: 26, width: 108, height: 108, rx: 16 }, 'sky', { accent: true }),
    s('path', { d: 'M38 30h84l-6 14-6-8-8 14-6-12-8 10-6-10-8 14-8-14-6 10-6-10-8 8z' }, 'white'),
    s('path', { d: dots([[60, 72], [100, 72]], 6) }, 'navy'),
    s('path', { d: 'M60 104h40', ...SW(5) }, 'navy', { stroke: true }),
    s('path', { d: rays(132, 128, 0, 14, 6), ...SW(3) }, 'blue', { stroke: true })
  ],
  ganga: [
    s('path', { d: 'M30 60l30-30h70v70l-30 30z' }, 'orange', { accent: true }),
    s('circle', { cx: 112, cy: 48, r: 8 }, 'white'),
    s('path', { d: 'M112 48q12-16 26-10', ...SW(3) }, 'dark', { stroke: true }),
    arrow('M72 62v52M56 98l16 16 16-16', 'green', 8),
    s('path', { d: 'M18 140h40', ...SW(4) }, 'red', { stroke: true })
  ],
  generosamente: [
    ground(),
    ...person(44, 136, 'green', { h: 48 }),
    s('path', { d: 'M56 98h24', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 78, y: 76, width: 52, height: 44, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M104 76v44M78 96h52', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M104 76q-16-16-20-4q4 6 20 4q16-16 20-4q-4 6-20 4z' }, 'yellow'),
    s('path', { d: heart(104, 30, 12) + heart(132, 50, 7) }, 'pink')
  ],
  glifosato: [
    s('rect', { x: 20, y: 62, width: 44, height: 72, rx: 10 }, 'green', { accent: true }),
    s('path', { d: 'M42 62V36h30', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M72 36l14-6', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[96, 34], [104, 46], [110, 30], [118, 42], [102, 58]], 3) }, 'sky'),
    s('path', { d: 'M118 136q0-30-6-40M118 136q4-26 18-32M112 96q-12-2-14 8M136 104q4 10-4 16', ...SW(4) }, 'brown', { stroke: true }),
    ground()
  ],
  grotesco: [
    s('path', { d: 'M30 72q-6-40 40-46q50-4 60 30q8 34-10 58q-20 24-50 14q-36-12-40-56z' }, 'green', { accent: true }),
    s('circle', { cx: 56, cy: 64, r: 16 }, 'white'),
    s('circle', { cx: 104, cy: 70, r: 7 }, 'white'),
    s('path', { d: dots([[60, 66], [104, 72]], 5) }, 'dark'),
    s('path', { d: ells([[82, 90, 12, 16]]) }, 'pink'),
    s('path', { d: 'M54 112q26 16 54 0q-26 6-54 0zM66 116v8M90 116v6', ...SW(4) }, 'dark', { stroke: true })
  ],
};
