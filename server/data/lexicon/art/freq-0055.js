// Illustration specs for words still undrawn in batches 0054–0055 (see server/scripts/lexicon/art.js)
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


module.exports = {
  presenciar: [
    ground(),
    ...person(40, 136, 'blue'),
    s('path', { d: dots([[44, 76]], 2.5) }, 'dark'),
    s('path', { d: 'M54 76L96 80', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: burst(118, 84, 28, 14, 9) }, 'red', { accent: true }),
    s('circle', { cx: 118, cy: 84, r: 10 }, 'yellow')
  ],
  'presunción': [
    ground(),
    ...person(80, 136, 'purple', { accent: true }),
    s('path', { d: 'M66 58l4-14 8 8 6-10 6 10 8-8 4 14z', transform: 'rotate(-10 80 54)' }, 'yellow'),
    s('path', { d: 'M74 70l14-4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(122, 40, 10) + sparkle(36, 52, 7) }, 'yellow'),
    s('path', { d: 'M66 100l28 0', ...SW(6) }, 'skin', { stroke: true })
  ],
  'prórroga': [
    s('circle', { cx: 74, cy: 80, r: 50 }, 'white'),
    s('path', { d: wedge(74, 80, 50, -90, -30) }, 'orange', { accent: true }),
    s('circle', { cx: 74, cy: 80, r: 50, ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M74 80V44M74 80l26 0', ...SW(5) }, 'dark', { stroke: true }),
    arrow('M112 26q20 10 22 30', 'red', 6),
    s('circle', { cx: 124, cy: 124, r: 16 }, 'white'),
    s('path', { d: poly([[124, 116], [131, 121], [128, 129], [120, 129], [117, 121]]) + ring(124, 124, 16) }, 'dark')
  ],
  revancha: [
    ground(),
    ...person(34, 136, 'blue'),
    ...person(126, 136, 'red', { accent: true }),
    arrow('M60 70a22 22 0 1 1 40 12', 'orange', 6),
    s('path', { d: 'M92 86l10-6 2 12z' }, 'orange'),
    s('circle', { cx: 80, cy: 118, r: 12 }, 'white'),
    s('circle', { cx: 80, cy: 118, r: 12, ...SW(3) }, 'dark', { stroke: true })
  ],
  reverendo: [
    s('path', { d: halfRays(96, 52, 22, 34, 7), ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 96, cy: 52, r: 14 }, 'skin'),
    s('path', { d: 'M78 136l6-66h24l6 66z' }, 'black', { accent: true }),
    s('rect', { x: 89, y: 66, width: 14, height: 6, rx: 2 }, 'white'),
    ...lean(42, 136, 35, 'green', { h: 34, w: 24, r: 10 }),
    ground()
  ],
  sapo: [
    s('ellipse', { cx: 80, cy: 128, rx: 56, ry: 8 }, 'mint'),
    s('path', { d: 'M28 124q0-58 52-58t52 58z' }, 'green', { accent: true }),
    s('path', { d: 'M52 124q0-30 28-30t28 30z' }, 'yellow'),
    s('path', { d: dots([[56, 66], [104, 66]], 13) }, 'green'),
    s('path', { d: dots([[56, 64], [104, 64]], 7) }, 'dark'),
    s('path', { d: 'M62 86q18 10 36 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 126l-8 6M136 126l8 6', ...SW(6) }, 'green', { stroke: true })
  ],
  'satanás': [
    s('path', { d: 'M54 54L46 22l26 24M106 54l8-32-26 24' }, 'dark'),
    s('circle', { cx: 80, cy: 82, r: 40 }, 'red', { accent: true }),
    s('path', { d: 'M58 70l16 8M102 70l-16 8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 96q20 16 40 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 116l-8 24h16z' }, 'dark'),
    s('path', { d: 'M132 146V58M120 58q12 16 24 0M132 58v-8', ...SW(4) }, 'orange', { stroke: true })
  ],
  'señoría': [
    s('circle', { cx: 80, cy: 46, r: 14 }, 'skin'),
    s('path', { d: 'M62 40q0-22 18-22t18 22l4 16h-8v-12H66v12h-8z' }, 'white'),
    s('path', { d: 'M62 40q0-22 18-22t18 22l4 16h-8v-12H66v12h-8z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M56 96v-24q0-10 24-10t24 10v24z' }, 'black', { accent: true }),
    s('rect', { x: 20, y: 94, width: 120, height: 46, rx: 4 }, 'brown'),
    s('path', { d: 'M110 84l20-14', ...SW(5) }, 'tan', { stroke: true }),
    s('rect', { x: 120, y: 58, width: 22, height: 12, rx: 3, transform: 'rotate(-35 131 64)' }, 'tan')
  ],
  sorprendentemente: [
    s('path', { d: 'M20 50l12 8M16 82h14M20 114l12-8M140 50l-12 8M144 82h-14M140 114l-12-8', ...SW(5) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 82, r: 44 }, 'yellow', { accent: true }),
    s('path', { d: ells([[64, 70, 7, 9], [96, 70, 7, 9], [80, 104, 9, 12]]) }, 'dark'),
    s('path', { d: 'M54 52q10-8 18-2M88 50q8-6 18 2', ...SW(4) }, 'dark', { stroke: true })
  ],
  temblar: [
    ground(),
    ...person(80, 136, 'sky', { accent: true }),
    s('path', { d: 'M54 70l-6 6 6 6-6 6 6 6M106 70l6 6-6 6 6 6-6 6M36 76l-6 6 6 6M124 76l6 6-6 6', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M74 70l4-2 4 2 4-2', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M126 30v24M114 36l24 12M114 48l24-12', ...SW(3) }, 'sky', { stroke: true })
  ],
  unilateral: [
    ground(),
    ...person(30, 136, 'blue', { accent: true }),
    ...person(130, 136, 'green'),
    arrow('M52 72h52', 'orange', 7),
    s('path', { d: 'M100 62l14 10-14 10z' }, 'orange'),
    s('path', { d: 'M108 108H56', ...DASH(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 98l12 20M86 98l-12 20', ...SW(5) }, 'red', { stroke: true })
  ],
  'vagón': [
    s('path', { d: 'M10 136h140', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 142h132', ...DASH(4, '8 6') }, 'brown', { stroke: true }),
    s('rect', { x: 18, y: 50, width: 124, height: 64, rx: 8 }, 'red', { accent: true }),
    s('rect', { x: 14, y: 42, width: 132, height: 12, rx: 6 }, 'dark'),
    s('path', { d: grid(28, 62, 4, 1, 20, 22, 28, 0) }, 'sky'),
    s('rect', { x: 18, y: 96, width: 124, height: 6 }, 'yellow'),
    s('path', { d: dots([[40, 124], [62, 124], [98, 124], [120, 124]], 9) }, 'dark')
  ],
  'vestíbulo': [
    backdrop('cream'),
    s('path', { d: 'M14 112h132v34H14z' }, 'tan'),
    s('path', { d: 'M56 112V60a24 24 0 0 1 48 0v52z' }, 'brown', { accent: true }),
    s('path', { d: 'M80 40v72', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 14v10M66 32h28', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 32q16 14 32 0z' }, 'yellow'),
    s('path', { d: 'M28 112v-8h14v8zM118 112v-8h14v8z' }, 'gray'),
    s('path', { d: ells([[35, 92, 10, 14], [125, 92, 10, 14]]) }, 'green')
  ],
  'éxodo': [
    s('path', { d: 'M14 146L64 70h32l50 76z' }, 'tan'),
    s('circle', { cx: 80, cy: 50, r: 16 }, 'yellow'),
    s('path', { d: busts([30, 62, 98], 138, 18, 28) + busts([82, 104], 104, 12, 18) }, 'blue', { accent: true }),
    s('path', { d: dots([[30, 112], [62, 112], [98, 112], [82, 86], [104, 86]], 7) }, 'skin'),
    s('path', { d: dots([[20, 122], [74, 120]], 7) }, 'brown'),
    s('path', { d: 'M14 70h132', ...SW(3) }, 'gray', { stroke: true })
  ],
  absorber: [
    s('path', { d: drop(80, 30, 7) + drop(56, 46, 6) + drop(104, 46, 6) }, 'blue'),
    arrow('M80 50v18M56 62v12M104 62v12', 'sky', 4),
    s('rect', { x: 30, y: 82, width: 100, height: 54, rx: 10 }, 'yellow', { accent: true }),
    s('path', { d: dots([[48, 98], [72, 108], [96, 96], [116, 116], [56, 122], [90, 124]], 5) }, 'orange'),
    s('rect', { x: 30, y: 120, width: 100, height: 16, rx: 6 }, 'sky')
  ],
  abstracto: [
    backdrop('cream'),
    s('path', { d: 'M14 100q30-40 60-10t72-20v76H14z' }, 'sky'),
    s('circle', { cx: 52, cy: 52, r: 22 }, 'red', { accent: true }),
    s('path', { d: poly([[100, 26], [134, 84], [92, 70]]) }, 'yellow'),
    s('path', { d: 'M28 128q14-20 28 0t28 0t28 0', ...SW(5) }, 'purple', { stroke: true }),
    s('path', { d: 'M76 40l20 70', ...SW(5) }, 'dark', { stroke: true })
  ],
  accesibilidad: [
    s('path', { d: 'M14 136h132L146 92z' }, 'gray'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 58, cy: 112, r: 22, ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('circle', { cx: 54, cy: 52, r: 11 }, 'skin'),
    s('path', { d: 'M54 66v30h24l8 22M54 80h18', ...SW(8) }, 'blue', { stroke: true }),
    arrow('M96 112l40-12', 'green', 5)
  ],
  acera: [
    s('rect', { x: 14, y: 116, width: 132, height: 30 }, 'dark'),
    s('path', { d: 'M24 132h20M68 132h20M112 132h20', ...SW(4) }, 'white', { stroke: true }),
    s('rect', { x: 14, y: 100, width: 132, height: 16 }, 'gray', { accent: true }),
    s('path', { d: 'M14 100h132', ...SW(3) }, 'white', { stroke: true }),
    ...person(80, 100, 'green', { h: 40, w: 26, r: 11 }),
    s('path', { d: 'M40 100V40M30 40h20', ...SW(4) }, 'dark', { stroke: true })
  ],
  alga: [
    backdrop('sky'),
    s('path', { d: 'M14 128q40-8 66 0t66 0v18H14z' }, 'tan'),
    s('path', { d: 'M52 132q-14-20 0-40t0-40q-8-14 2-30M80 132q12-24 0-46t4-40M110 132q-12-18 2-36t0-38', ...SW(9) }, 'green', { stroke: true, accent: true }),
    s('path', { d: dots([[96, 34], [104, 22], [36, 70]], 4) }, 'white')
  ],
  aludir: [
    ground(),
    ...person(40, 136, 'orange', { accent: true }),
    s('path', { d: bubble(58, 20, 52, 36) }, 'white'),
    s('path', { d: bubble(58, 20, 52, 36), ...SW(3) }, 'gray', { stroke: true }),
    arrow('M70 38h22', 'blue', 5),
    s('path', { d: 'M90 31l8 7-8 7z' }, 'blue'),
    s('circle', { cx: 122, cy: 118, r: 16 }, 'purple')
  ],
  anchura: [
    s('rect', { x: 18, y: 70, width: 124, height: 60, rx: 4 }, 'tan'),
    s('path', { d: 'M18 70v60M142 70v60', ...SW(4) }, 'brown', { stroke: true }),
    arrow('M26 46h108', 'blue', 6),
    s('path', { d: 'M22 46l14-10v20zM138 46l-14-10v20z' }, 'blue', { accent: true }),
    s('path', { d: 'M18 36v20M142 36v20', ...SW(3) }, 'gray', { stroke: true })
  ],
  apuro: [
    ground(),
    ...person(58, 136, 'blue'),
    s('path', { d: drop(76, 62, 4) + drop(84, 76, 3) + drop(38, 66, 3) }, 'sky'),
    s('path', { d: 'M52 72q6-4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 116, cy: 52, r: 24 }, 'red', { accent: true }),
    s('circle', { cx: 116, cy: 52, r: 18 }, 'white'),
    s('path', { d: 'M116 52V40M116 52l10 6M100 26l-6-6M132 26l6-6', ...SW(3) }, 'dark', { stroke: true })
  ],
  arbusto: [
    ground(),
    s('path', { d: 'M76 136v-20M84 136v-14', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: ells([[48, 104, 30, 24], [112, 104, 30, 24], [80, 86, 36, 30], [80, 114, 50, 18]]) }, 'green', { accent: true }),
    s('path', { d: dots([[60, 90], [96, 80], [110, 108], [52, 112]], 4) }, 'red')
  ],
  asma: [
    s('rect', { x: 50, y: 30, width: 34, height: 78, rx: 8 }, 'blue', { accent: true }),
    s('rect', { x: 56, y: 18, width: 22, height: 16, rx: 3 }, 'orange'),
    s('path', { d: 'M50 96h32q8 0 8 8v24q0 8-8 8H58q-8 0-8-8z' }, 'gray'),
    s('rect', { x: 84, y: 112, width: 22, height: 20, rx: 3 }, 'gray'),
    s('path', { d: 'M114 116q10-6 18 0M114 126q12 0 22 6M114 106q10-10 22-8', ...SW(4) }, 'sky', { stroke: true })
  ],
  ayuno: [
    s('ellipse', { cx: 80, cy: 98, rx: 46, ry: 34 }, 'white'),
    s('ellipse', { cx: 80, cy: 98, rx: 46, ry: 34, ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 80, cy: 98, rx: 28, ry: 20, ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M20 70v62M14 70v16q0 6 6 6t6-6V70M140 70v62M140 70q-8 10-6 30h6', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 120, cy: 34, r: 18 }, 'orange', { accent: true }),
    s('path', { d: 'M120 34v-10M120 34l7 4', ...SW(3) }, 'white', { stroke: true })
  ],
  barroco: [
    s('rect', { x: 26, y: 26, width: 108, height: 108, rx: 6 }, 'yellow', { accent: true }),
    s('rect', { x: 44, y: 44, width: 72, height: 72 }, 'navy'),
    s('path', { d: spiral(26, 26) + spiral(128, 26) + spiral(26, 128) + spiral(128, 128), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M62 26q18-16 36 0M62 134q18 16 36 0M26 62q-16 18 0 36M134 62q16 18 0 36', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: heart(80, 76, 14) }, 'red')
  ],
  bis: [
    s('path', { d: 'M14 112h132v34H14z' }, 'brown'),
    ...person(80, 112, 'purple', { h: 40, w: 26, r: 11, accent: true }),
    s('path', { d: 'M92 72l8-12', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 101, cy: 58, r: 5 }, 'dark'),
    arrow('M40 52a20 20 0 1 1 6 22', 'orange', 5),
    s('path', { d: 'M38 68l10 10-12 2z' }, 'orange'),
    ...note(118, 40, 'blue')
  ],
  borda: [
    backdrop('sky', 14, 80),
    s('path', { d: 'M14 94h132v52H14z' }, 'blue'),
    s('path', { d: 'M24 70h112l-14 50H38z' }, 'brown'),
    s('path', { d: 'M20 66h120', ...SW(8) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M34 66V48M58 66V48M82 66V48M106 66V48M130 66V48M30 48h104', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[54, 90], [80, 90], [106, 90]], 5) }, 'cream')
  ],
  'cancillería': [
    ground(),
    s('path', { d: 'M24 64l56-26 56 26z' }, 'gray'),
    s('rect', { x: 28, y: 64, width: 104, height: 8 }, 'gray'),
    s('path', { d: 'M40 76v54M64 76v54M96 76v54M120 76v54', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'cream', { stroke: true }),
    s('rect', { x: 24, y: 128, width: 112, height: 8 }, 'gray'),
    s('circle', { cx: 80, cy: 100, r: 14 }, 'blue', { accent: true }),
    s('path', { d: 'M74 92q6 4 4 10t6 10M66 100h28', ...SW(3) }, 'green', { stroke: true })
  ],
  'cardíaco': [
    s('path', { d: heart(80, 98, 38) }, 'red', { accent: true }),
    s('path', { d: 'M24 82h28l8-18 12 36 10-48 10 30h44', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M44 42q8-10 18-6', ...SW(4) }, 'pink', { stroke: true })
  ],
  cascada: [
    s('path', { d: 'M14 30h42v116H14zM104 30h42v116h-42z' }, 'gray'),
    s('path', { d: 'M14 30h132v8H14z' }, 'green'),
    s('rect', { x: 56, y: 34, width: 48, height: 96 }, 'sky', { accent: true }),
    s('path', { d: 'M66 42v80M80 46v76M94 42v80', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M14 130q22-10 46 0t40 0t46 0v16H14z' }, 'blue'),
    s('path', { d: dots([[60, 124], [100, 124], [80, 118]], 5) }, 'white')
  ],
  cauce: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'green'),
    s('path', { d: 'M40 14q-10 40 30 60t20 72h38q14-50-24-74t-14-58z' }, 'tan'),
    s('path', { d: 'M54 14q-6 36 30 58t18 74h12q14-50-24-74t-12-58z' }, 'blue', { accent: true }),
    s('path', { d: dots([[110, 30], [30, 110], [126, 60]], 6) }, 'mint')
  ],
  chingo: [
    ground(),
    s('path', { d: 'M18 136q10-90 62-100q52 10 62 100z' }, 'orange'),
    s('path', { d: dots([[46, 116], [70, 104], [96, 116], [116, 122], [60, 80], [92, 74], [80, 52]], 7) }, 'red', { accent: true }),
    s('path', { d: dots([[34, 126], [84, 92], [106, 98], [56, 100], [76, 66]], 6) }, 'yellow'),
    s('path', { d: dots([[70, 126], [100, 136], [44, 104], [104, 80]], 6) }, 'blue')
  ],
  comestible: [
    s('path', { d: 'M36 110q0-62 44-62t44 62z' }, 'red', { accent: true }),
    s('path', { d: dots([[60, 82], [84, 70], [102, 92]], 6) }, 'white'),
    s('path', { d: 'M64 110h32v24q0 8-8 8H72q-8 0-8-8z' }, 'cream'),
    s('circle', { cx: 124, cy: 40, r: 18 }, 'green'),
    s('path', { d: 'M114 40l7 7 13-14', ...SW(5) }, 'white', { stroke: true })
  ],
  complot: [
    backdrop('navy'),
    s('circle', { cx: 56, cy: 66, r: 16 }, 'skin'),
    s('circle', { cx: 100, cy: 66, r: 16 }, 'skin'),
    s('path', { d: 'M36 66q0-30 20-30t20 30q-10-14-20-14t-20 14zM80 66q0-30 20-30t20 30q-10-14-20-14t-20 14z' }, 'black'),
    s('path', { d: busts([56, 100], 146, 36, 56) }, 'dark', { accent: true }),
    s('path', { d: 'M72 74q6 6 0 12', ...SW(3) }, 'skin', { stroke: true }),
    s('path', { d: dots([[128, 32]], 10) }, 'yellow')
  ],
  'conmoción': [
    s('circle', { cx: 80, cy: 92, r: 40 }, 'skin'),
    s('path', { d: dots([[64, 88], [96, 88]], 4) }, 'dark'),
    s('path', { d: 'M66 112q14-6 28 0', ...SW(4) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 98, cy: 58, rx: 12, ry: 8 }, 'pink'),
    s('ellipse', { cx: 80, cy: 40, rx: 50, ry: 14, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: star(36, 40, 10) + star(124, 40, 10) + star(80, 26, 9) }, 'yellow', { accent: true })
  ],
  costarricense: [
    s('path', { d: 'M26 140V18', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 28, y: 22, width: 110, height: 84 }, 'blue'),
    s('rect', { x: 28, y: 36, width: 110, height: 56 }, 'white'),
    s('rect', { x: 28, y: 50, width: 110, height: 28 }, 'red', { accent: true }),
    s('rect', { x: 28, y: 22, width: 110, height: 84, ...SW(2) }, 'gray', { stroke: true })
  ],
  'danés': [
    s('path', { d: 'M26 140V18', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 28, y: 22, width: 110, height: 76 }, 'red', { accent: true }),
    s('path', { d: 'M64 22v76M28 60h110', ...SW(12, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true })
  ],
  'desinformación': [
    s('path', { d: 'M24 64l44-14v60l-44-14z' }, 'red', { accent: true }),
    s('rect', { x: 16, y: 62, width: 14, height: 36, rx: 3 }, 'dark'),
    s('path', { d: 'M34 102l6 24h10l-4-22', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M78 60q10-14 20 0t20 0t20 0M78 80q8 12 18-2t18 4t16-6t12 8M78 100q12 10 20-4t22 2t20-6', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 22l20 34H90z' }, 'yellow'),
    s('path', { d: 'M110 32v12', ...SW(4) }, 'dark', { stroke: true })
  ],
  donante: [
    s('path', { d: 'M40 24h48v68q0 10-10 10H50q-10 0-10-10z' }, 'red', { accent: true }),
    s('rect', { x: 40, y: 24, width: 48, height: 18 }, 'white'),
    s('rect', { x: 40, y: 24, width: 48, height: 78, rx: 4, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M64 102v18q0 14 20 14h24', ...SW(4) }, 'red', { stroke: true }),
    s('rect', { x: 100, y: 120, width: 46, height: 22, rx: 11 }, 'skin'),
    s('path', { d: heart(118, 62, 18) }, 'pink')
  ],
  dudoso: [
    s('circle', { cx: 80, cy: 82, r: 50 }, 'yellow', { accent: true }),
    s('path', { d: ells([[62, 80, 6, 4], [100, 76, 6, 7]]) }, 'dark'),
    s('path', { d: 'M50 66l22 4M88 56q12-10 24 2', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 108q16-6 34 2', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M38 146q4-28 30-26', ...SW(10) }, 'skin', { stroke: true })
  ],
  'egoísmo': [
    ground(),
    s('path', { d: 'M18 64q30-34 60 0z' }, 'red', { accent: true }),
    s('path', { d: 'M48 64v24', ...SW(3) }, 'dark', { stroke: true }),
    ...person(48, 136, 'blue', { h: 40 }),
    ...person(118, 136, 'gray', { h: 40 }),
    s('path', { d: drop(104, 40, 4) + drop(120, 30, 4) + drop(134, 46, 4) + drop(112, 60, 3) }, 'sky'),
    s('path', { d: 'M110 88q8 6 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  enriquecimiento: [
    s('path', { d: 'M56 112h48l-6 30H62z' }, 'brown'),
    s('path', { d: 'M80 112V52M80 90q-20-4-26-20M80 72q20-4 26-20', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: dots([[50, 66], [110, 48], [80, 40]], 13) }, 'yellow', { accent: true }),
    s('path', { d: dots([[50, 66], [110, 48], [80, 40]], 7) }, 'orange'),
    arrow('M132 120V80', 'green', 5),
    s('path', { d: 'M124 84l8-12 8 12z' }, 'green')
  ],
  episcopal: [
    s('path', { d: 'M48 128V60q0-30 32-44q32 14 32 44v68z' }, 'white'),
    s('path', { d: 'M48 128V60q0-30 32-44q32 14 32 44v68z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 20v108M48 110h64', ...SW(8, { 'stroke-linecap': 'butt' }) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M70 66h20M80 56v20', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M130 146V44q0-18-14-18t-12 14', ...SW(5) }, 'orange', { stroke: true })
  ],
  'erosión': [
    backdrop('sky'),
    s('path', { d: 'M14 40h70q6 20-8 30t4 26q-10 18 6 26l-2 24H14z' }, 'brown', { accent: true }),
    s('path', { d: 'M76 112q22-14 36 0t34-6v40H62z' }, 'blue'),
    s('path', { d: 'M90 100q10-10 20 0M100 86q8-8 16 0', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: dots([[84, 60], [92, 72], [88, 84]], 3) }, 'tan'),
    s('path', { d: 'M14 40h70', ...SW(5) }, 'green', { stroke: true })
  ],
  especia: [
    s('path', { d: 'M18 130q0-26 22-26t22 26zM58 130q0-34 22-34t22 34zM98 130q0-26 22-26t22 26z' }, 'brown'),
    s('path', { d: 'M58 130q0-34 22-34t22 34z' }, 'red', { accent: true }),
    s('path', { d: 'M98 130q0-26 22-26t22 26z' }, 'yellow'),
    s('path', { d: 'M14 132h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: star(80, 50, 22, 8) }, 'brown'),
    s('path', { d: 'M28 40l40 30M36 32l40 30', ...SW(6) }, 'orange', { stroke: true })
  ],
  estrago: [
    ground(),
    s('path', { d: 'M28 136V82l40-12 24 26 30-20 10 60z' }, 'tan'),
    s('path', { d: 'M20 84l46-40 30 30', ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M56 136l8-22-10-14 6-10M104 136l-6-24 10-10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: rects([[112, 120, 16, 10], [36, 124, 12, 8]]) + 'M128 120l10-14 8 14z' }, 'gray'),
    s('path', { d: 'M108 52q8-14 20-8q6-12 18-4', ...SW(5) }, 'gray', { stroke: true })
  ],
  'estético': [
    s('path', { d: 'M62 76q-18 30 0 60h36q18-30 0-60l4-10H58z' }, 'blue', { accent: true }),
    s('path', { d: 'M64 104q16 8 32 0', ...SW(4) }, 'cream', { stroke: true }),
    s('path', { d: 'M80 66V34M80 54l-14-12', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots([[80, 28], [62, 38]], 8) }, 'pink'),
    s('path', { d: sparkle(120, 50, 12) + sparkle(36, 88, 9) + sparkle(128, 112, 8) }, 'yellow')
  ],
  fijamente: [
    s('ellipse', { cx: 48, cy: 64, rx: 26, ry: 20 }, 'white'),
    s('ellipse', { cx: 48, cy: 64, rx: 26, ry: 20, ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 58, cy: 64, r: 10 }, 'blue', { accent: true }),
    s('path', { d: 'M82 64h40', ...DASH(4) }, 'gray', { stroke: true }),
    s('path', { d: ring(132, 64, 12) + ring(132, 64, 4), ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M24 38q24-12 48 0', ...SW(4) }, 'dark', { stroke: true })
  ],
  fracasar: [
    ground(),
    s('path', { d: rects([[26, 60, 22, 76], [58, 80, 22, 56], [90, 104, 22, 32]]) }, 'gray'),
    arrow('M24 38l30 20 18-6 24 34 20 34', 'red', 7),
    s('path', { d: 'M104 112l24 12-4-24z' }, 'red', { accent: true }),
    s('path', { d: 'M130 126l8-8M122 134l12 4', ...SW(3) }, 'orange', { stroke: true })
  ],
  'fértil': [
    s('rect', { x: 14, y: 90, width: 132, height: 56, rx: 8 }, 'brown', { accent: true }),
    s('path', { d: 'M14 108h132M14 126h132', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M36 90V64M80 90V56M124 90V64', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(36, 72, -40, 18, 6) + leaflet(36, 72, 220, 18, 6) + leaflet(80, 64, -40, 22, 7) + leaflet(80, 64, 220, 22, 7) + leaflet(124, 72, -40, 18, 6) + leaflet(124, 72, 220, 18, 6) }, 'green'),
    s('circle', { cx: 124, cy: 30, r: 14 }, 'yellow')
  ],
  gancho: [
    s('rect', { x: 50, y: 14, width: 60, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M80 24v40', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 70, r: 7, ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 78v40a18 18 0 0 1-36 0l-6-6', ...SW(10) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: 'M40 114l-8-12 14 2z' }, 'gray')
  ],
  genital: [
    s('path', { d: 'M80 140V92', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 124, 200, 26, 9) }, 'green'),
    s('path', { d: ells([[56, 64, 22, 14], [104, 64, 22, 14], [80, 40, 14, 22], [80, 88, 14, 14]]) }, 'pink'),
    s('path', { d: 'M80 82V48M80 82L62 56M80 82l18-26', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: dots([[62, 54], [98, 54], [80, 44]], 4) }, 'yellow', { accent: true }),
    s('ellipse', { cx: 80, cy: 86, rx: 8, ry: 6 }, 'green')
  ],
  grupal: [
    s('ellipse', { cx: 80, cy: 96, rx: 50, ry: 20 }, 'brown'),
    s('path', { d: busts([36, 124], 104, 22, 30) + busts([60, 100], 82, 20, 22) }, 'blue', { accent: true }),
    s('path', { d: busts([80], 146, 26, 30) }, 'orange'),
    s('path', { d: dots([[36, 62], [124, 62]], 10) + dots([[60, 50], [100, 50]], 9) }, 'skin'),
    s('circle', { cx: 80, cy: 102, r: 11 }, 'skin')
  ],
  gusano: [
    s('path', { d: leaflet(16, 120, -28, 140, 34) }, 'green'),
    s('path', { d: 'M16 120L140 54', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: dots([[48, 82], [62, 76], [76, 72], [90, 76]], 9) }, 'yellow', { accent: true }),
    s('circle', { cx: 104, cy: 68, r: 11 }, 'orange'),
    s('path', { d: dots([[108, 64]], 2.5) }, 'dark'),
    s('path', { d: 'M102 58l-4-10M110 58l4-10', ...SW(2) }, 'dark', { stroke: true })
  ],
  historieta: [
    s('rect', { x: 14, y: 30, width: 132, height: 100, rx: 4 }, 'white'),
    s('path', { d: rects([[20, 36, 58, 42], [82, 36, 58, 42], [20, 82, 58, 42], [82, 82, 58, 42]]), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: bubble(26, 40, 30, 20) }, 'sky'),
    s('path', { d: dots([[60, 66], [124, 66]], 7) + busts([60, 124], 78, 12, 10) + dots([[40, 112], [100, 112]], 7) + busts([40, 100], 124, 12, 10) }, 'orange', { accent: true }),
    s('path', { d: burst(116, 100, 12, 6, 7) }, 'yellow')
  ],
  hocico: [
    s('path', { d: 'M30 50q-12 30 6 50l12-46z' }, 'brown'),
    s('path', { d: 'M40 40q30-20 56 0l40 46q8 26-20 30H70q-30 0-30-30z' }, 'tan'),
    s('path', { d: 'M96 80q40-6 44 14q-4 20-44 22z' }, 'cream'),
    s('ellipse', { cx: 132, cy: 88, rx: 12, ry: 9 }, 'dark', { accent: true }),
    s('path', { d: dots([[72, 64]], 5) }, 'dark'),
    s('path', { d: 'M110 108q10 4 22-2', ...SW(3) }, 'dark', { stroke: true })
  ],
  hoguera: [
    s('path', { d: 'M30 132l100-20M30 112l100 20', ...SW(12) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 118q-40-10-26-50q6 14 16 14q-8-30 14-54q0 26 20 40q6-10 4-22q24 30 0 72z' }, 'orange', { accent: true }),
    s('path', { d: 'M80 118q-16-8-8-30q8 12 12 0q16 16-4 30z' }, 'yellow'),
    s('path', { d: dots([[44, 54], [118, 44], [108, 24]], 3) }, 'orange')
  ],
  'imán': [
    s('path', { d: 'M40 120V74a40 40 0 0 1 80 0v46', ...SW(26, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M27 104h26v16H27zM107 104h26v16h-26z' }, 'gray'),
    s('path', { d: 'M20 132q-4 10 6 12M140 132q4 10-6 12', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 136h12v-14h-8v10M64 128q16 22 32 0', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M60 18q20-10 40 0M50 8q30-12 60 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  incompetencia: [
    s('rect', { x: 20, y: 98, width: 120, height: 40, rx: 4 }, 'brown'),
    s('circle', { cx: 80, cy: 98, r: 18 }, 'dark'),
    s('rect', { x: 62, y: 30, width: 40, height: 40, rx: 3, transform: 'rotate(18 82 50)' }, 'blue', { accent: true }),
    s('path', { d: 'M40 40l10 6M120 40l-10 6M48 24l6 10M112 24l-6 10', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M110 80l12-6M42 82l-12-6', ...SW(3) }, 'gray', { stroke: true })
  ],
  injustamente: [
    s('path', { d: 'M80 34v100M54 136h52', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 46L130 74', ...SW(5) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M30 46l-14 34h28zM130 74l-14 34h28z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 80q16 12 32 0zM114 108q16 12 32 0z' }, 'orange'),
    s('rect', { x: 120, y: 88, width: 20, height: 20, rx: 3 }, 'dark'),
    s('circle', { cx: 30, cy: 74, r: 5 }, 'red')
  ],
  'intersección': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'green'),
    s('path', { d: 'M62 14h36v132H62zM14 62h132v36H14z' }, 'dark', { accent: true }),
    s('path', { d: 'M80 18v36M80 106v36M18 80h36M106 80h36', ...DASH(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M66 58h28M66 102h28', ...DASH(6, '4 4') }, 'white', { stroke: true })
  ],
  loro: [
    s('path', { d: 'M20 124h120', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M66 60q-6 50 30 64h-16q6 20-8 26l-8-24q-20-30 2-66z' }, 'green', { accent: true }),
    s('circle', { cx: 82, cy: 50, r: 22 }, 'red'),
    s('path', { d: 'M100 44q18 2 16 20q-6-6-14-4z' }, 'dark'),
    s('circle', { cx: 86, cy: 44, r: 6 }, 'white'),
    s('circle', { cx: 87, cy: 44, r: 3 }, 'dark'),
    s('path', { d: 'M70 74q-10 22 8 40', ...SW(5) }, 'blue', { stroke: true })
  ],
  'lámina': [
    s('path', { d: 'M20 120l60-24 60 24-60 24z' }, 'gray'),
    s('path', { d: 'M20 108l60-24 60 24-60 24z' }, 'sky'),
    s('path', { d: 'M20 96l60-24 60 24-60 24z' }, 'gray'),
    s('path', { d: 'M20 84l60-24 40 16q30-40 10-60q-50 20-110 68z' }, 'blue', { accent: true }),
    s('path', { d: 'M54 50l40-16', ...SW(3) }, 'white', { stroke: true })
  ],
  mazo: [
    s('path', { d: 'M90 72L44 138', ...SW(10) }, 'brown', { stroke: true }),
    s('rect', { x: 52, y: 26, width: 84, height: 40, rx: 10, transform: 'rotate(35 94 46)' }, 'tan', { accent: true }),
    s('path', { d: 'M74 36l-10 14M130 74l-10 14', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 20, y: 132, width: 52, height: 10, rx: 3 }, 'brown')
  ],
  memorable: [
    s('rect', { x: 30, y: 24, width: 100, height: 112, rx: 4, transform: 'rotate(-6 80 80)' }, 'white'),
    s('rect', { x: 30, y: 24, width: 100, height: 112, rx: 4, transform: 'rotate(-6 80 80)', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 40, y: 34, width: 80, height: 70, transform: 'rotate(-6 80 80)' }, 'sky'),
    s('path', { d: 'M40 100l24-30 18 18 14-14 26 26z', transform: 'rotate(-6 80 80)' }, 'green'),
    s('circle', { cx: 100, cy: 50, r: 9 }, 'yellow'),
    s('path', { d: heart(118, 118, 16) }, 'red', { accent: true })
  ],
  menta: [
    s('path', { d: 'M80 146V30', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 110, 200, 46, 18) + leaflet(80, 110, -20, 46, 18) + leaflet(80, 74, 210, 40, 15) + leaflet(80, 74, -30, 40, 15) + leaflet(80, 44, 250, 30, 12) + leaflet(80, 44, -70, 30, 12) }, 'green', { accent: true }),
    s('path', { d: 'M48 104l24 4M112 104l-24 4M54 66l20 6M106 66l-20 6', ...SW(2) }, 'mint', { stroke: true })
  ],
  migratorio: [
    backdrop('sky'),
    s('circle', { cx: 124, cy: 40, r: 14 }, 'yellow'),
    s('path', { d: birds([[46, 70], [66, 58], [86, 46], [66, 82], [86, 94], [106, 104]]), ...SW(4) }, 'dark', { stroke: true, accent: true }),
    arrow('M30 128q40-6 80-30', 'orange', 4),
    s('path', { d: 'M104 94l12 0-4 12z' }, 'orange')
  ],
  modales: [
    ground(),
    ...lean(46, 136, 40, 'navy', { accent: true }),
    ...person(118, 136, 'pink'),
    s('path', { d: 'M108 98l-10-4', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(90, 40, 9) }, 'yellow')
  ],
  moralmente: [
    s('path', { d: 'M80 18l50 18v40q0 46-50 66q-50-20-50-66V36z' }, 'blue', { accent: true }),
    s('path', { d: heart(80, 78, 28) }, 'white'),
    s('path', { d: 'M66 72l10 10 18-20', ...SW(6) }, 'green', { stroke: true })
  ],
  neoliberal: [
    s('circle', { cx: 80, cy: 80, r: 44 }, 'sky'),
    s('path', { d: 'M56 52q12 6 8 20t10 22l-6 18q-24-14-24-34zM96 48q16 2 20 18l-12 6-6 20-10-8 4-18z' }, 'green'),
    arrow('M24 46a64 64 0 0 1 60-30M136 114a64 64 0 0 1-60 30', 'orange', 6),
    s('path', { d: 'M80 8l10 8-10 8zM80 136l-10 8 10 8z' }, 'orange'),
    s('path', { d: dots([[130, 34], [30, 126]], 12) }, 'yellow', { accent: true })
  ],
  nublado: [
    s('circle', { cx: 56, cy: 58, r: 24 }, 'yellow'),
    s('path', { d: halfRays(56, 58, 30, 40, 5), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: ells([[70, 92, 30, 22], [104, 82, 28, 26], [124, 100, 22, 18], [94, 108, 44, 16]]) }, 'gray', { accent: true }),
    s('path', { d: ells([[42, 124, 20, 12], [62, 118, 18, 14]]) }, 'gray')
  ],
  nutriente: [
    s('path', { d: 'M40 70q18-6 30 6l-30 64q-22-30 0-70z' }, 'orange'),
    s('path', { d: 'M54 66q-6-20 8-28M54 66q10-16 24-14', ...SW(4) }, 'green', { stroke: true }),
    s('rect', { x: 86, y: 70, width: 50, height: 22, rx: 11, transform: 'rotate(-40 111 81)' }, 'red', { accent: true }),
    s('rect', { x: 86, y: 70, width: 25, height: 22, rx: 11, transform: 'rotate(-40 111 81)' }, 'yellow'),
    s('path', { d: sparkle(110, 124, 9) + sparkle(30, 30, 7) + sparkle(130, 40, 7) }, 'yellow')
  ],
  oasis: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'cream'),
    s('path', { d: 'M14 110q30-20 66-4t66-6v46H14z' }, 'tan'),
    s('ellipse', { cx: 76, cy: 120, rx: 40, ry: 10 }, 'blue', { accent: true }),
    s('path', { d: 'M100 116q-4-40 6-64M48 112q4-30-6-50', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(106, 52, 200, 30, 8) + leaflet(106, 52, -20, 30, 8) + leaflet(106, 52, 150, 26, 7) + leaflet(106, 52, 30, 26, 7) + leaflet(42, 62, 200, 24, 7) + leaflet(42, 62, -20, 24, 7) + leaflet(42, 62, 150, 22, 6) }, 'green'),
    s('circle', { cx: 126, cy: 30, r: 10 }, 'orange')
  ],
  olivo: [
    ground(),
    s('path', { d: 'M74 136q6-30-6-50M86 136q-4-30 14-52M78 100l-16-12', ...SW(10) }, 'brown', { stroke: true }),
    s('path', { d: ells([[52, 70, 30, 22], [104, 62, 32, 24], [78, 46, 30, 22]]) }, 'gray'),
    s('path', { d: ells([[52, 70, 26, 18], [104, 62, 28, 20], [78, 46, 26, 18]]) }, 'green'),
    s('path', { d: ells([[48, 74, 4, 6], [64, 62, 4, 6], [96, 56, 4, 6], [114, 70, 4, 6], [80, 40, 4, 6]]) }, 'purple', { accent: true })
  ],
  oyente: [
    s('rect', { x: 18, y: 70, width: 56, height: 40, rx: 6 }, 'orange', { accent: true }),
    s('circle', { cx: 36, cy: 90, r: 11 }, 'dark'),
    s('path', { d: 'M54 82h12M54 92h12M30 70l20-20', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 80q6 10 0 20M90 72q12 18 0 36', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 120, cy: 70, r: 18 }, 'skin'),
    s('path', { d: 'M102 70q0-26 18-26', ...SW(4) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 106, cy: 72, rx: 6, ry: 9 }, 'pink'),
    s('rect', { x: 102, y: 92, width: 36, height: 50, rx: 12 }, 'blue')
  ],
  participativo: [
    s('path', { d: 'M30 80V40M64 70V28M98 70V28M132 80V40', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: dots([[30, 38], [64, 26], [98, 26], [132, 38]], 7) }, 'skin'),
    s('path', { d: busts([42, 80, 118], 140, 30, 40) }, 'green', { accent: true }),
    s('path', { d: busts([80], 140, 30, 40) }, 'orange'),
    s('path', { d: dots([[42, 94], [80, 94], [118, 94]], 13) }, 'skin')
  ],
  paternidad: [
    ground(),
    ...person(70, 136, 'blue', { h: 50, w: 34, r: 13 }),
    s('ellipse', { cx: 76, cy: 102, rx: 22, ry: 12 }, 'cream', { accent: true }),
    s('circle', { cx: 96, cy: 96, r: 9 }, 'skin'),
    s('path', { d: 'M54 106q20 14 44 0', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(118, 50, 14) }, 'red')
  ],
  peaje: [
    ground(),
    s('rect', { x: 18, y: 56, width: 34, height: 80, rx: 4 }, 'gray'),
    s('rect', { x: 24, y: 66, width: 22, height: 20, rx: 2 }, 'sky'),
    s('path', { d: 'M14 52h44', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M52 100h90', ...SW(8, { 'stroke-dasharray': '12 10', 'stroke-linecap': 'butt' }) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M52 100h90', ...SW(8, { 'stroke-dasharray': '0 12 10 0', 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    ...car(78, 108, 'yellow')
  ],
  planificar: [
    s('rect', { x: 30, y: 26, width: 100, height: 118, rx: 6 }, 'brown'),
    s('rect', { x: 40, y: 38, width: 80, height: 98, rx: 2 }, 'white'),
    s('rect', { x: 62, y: 20, width: 36, height: 14, rx: 4 }, 'gray'),
    s('path', { d: 'M48 58l5 5 9-10M48 86l5 5 9-10', ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M70 58h40M70 86h40M70 114h40', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 48, y: 106, width: 14, height: 14, ...SW(3) }, 'gray', { stroke: true })
  ],
  preferido: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M22 136l4-40h24l4 40zM106 136l4-40h24l4 40z' }, 'sky'),
    s('path', { d: 'M56 136l6-60h36l6 60z' }, 'orange', { accent: true }),
    s('path', { d: heart(80, 46, 18) }, 'red'),
    s('path', { d: sparkle(116, 40, 8) + sparkle(44, 52, 7) }, 'yellow')
  ],
  'pretensión': [
    ground(),
    s('path', { d: 'M40 136L66 46M76 136L96 46M46 116h34M52 94h34M58 72h34M64 52h30', ...SW(5) }, 'brown', { stroke: true }),
    ...lean(76, 82, 10, 'blue', { h: 32, w: 22, r: 10 }),
    s('path', { d: 'M86 50l20-16', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: star(124, 28, 16) }, 'yellow', { accent: true })
  ],
  'párroco': [
    ground(),
    s('path', { d: 'M86 136V74l24-22 24 22v62z' }, 'cream'),
    s('path', { d: 'M110 52V30M102 38h16', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 136v-24a10 10 0 0 1 20 0v24z' }, 'brown'),
    s('path', { d: 'M82 76l28-26 28 26', ...SW(5) }, 'red', { stroke: true }),
    ...person(46, 136, 'black', { accent: true }),
    s('rect', { x: 40, y: 92, width: 12, height: 6, rx: 2 }, 'white')
  ],
  'reivindicación': [
    ground(),
    s('path', { d: 'M80 136V36', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 38, y: 18, width: 84, height: 48, rx: 4 }, 'yellow', { accent: true }),
    s('path', { d: 'M58 34h44M58 50h28', ...SW(5) }, 'orange', { stroke: true }),
    ...person(52, 136, 'red', { h: 40 }),
    ...person(112, 136, 'blue', { h: 40 }),
    s('path', { d: 'M62 102l14-16M102 102l-14-16', ...SW(6) }, 'skin', { stroke: true })
  ],
  repaso: [
    ...openBook(80, 78, 'white'),
    s('path', { d: 'M38 96h30M38 106h30M92 96h30', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M88 108h36', ...SW(7, { 'stroke-linecap': 'butt' }) }, 'yellow', { stroke: true }),
    arrow('M50 50a30 30 0 1 1 50 12', 'blue', 6),
    s('path', { d: 'M90 58l14 6-2-16z' }, 'blue', { accent: true })
  ],
  repentino: [
    s('path', { d: 'M36 96h88v48H36z' }, 'red'),
    s('path', { d: 'M36 96L20 70h60z' }, 'blue'),
    s('path', { d: 'M80 96q-14-6 0-12t0-12t0-12', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 42, r: 22 }, 'yellow', { accent: true }),
    s('path', { d: dots([[72, 38], [88, 38]], 3) + ells([[80, 52, 5, 6]]) }, 'dark'),
    s('path', { d: 'M40 30l-12-8M120 30l12-8M46 14l-4-6M114 14l4-6', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: star(80, 122, 10) }, 'yellow')
  ],
  repudio: [
    ...lean(118, 136, -20, 'gray'),
    ground(),
    s('path', { d: 'M40 136V96', ...SW(14) }, 'skin', { stroke: true }),
    s('path', { d: 'M24 98V54a6 6 0 0 1 12 0v-6a6 6 0 0 1 12 0v6a6 6 0 0 1 12 0v40q0 20-18 20h-6q-12 0-12-14z' }, 'skin', { accent: true }),
    s('path', { d: 'M74 70h14M70 52l10-6M70 88l10 6', ...SW(4) }, 'red', { stroke: true })
  ],
  rifle: [
    s('path', { d: 'M18 74h96v12H18z' }, 'dark'),
    s('path', { d: 'M114 70h30v20h-30z' }, 'dark'),
    s('path', { d: 'M54 86h70l14 40h-20l-12-26H70z' }, 'brown', { accent: true }),
    s('path', { d: 'M86 90q0 14 10 14', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 64, y: 60, width: 36, height: 10, rx: 4 }, 'gray')
  ],
  sangriento: [
    s('path', { d: 'M14 14h132v12q-10 20-20 0q-10 30-24 0q-8 16-20 0q-10 24-22 0q-12 18-22 0q-10 22-24 0z' }, 'red', { accent: true }),
    s('path', { d: drop(36, 60, 6) + drop(92, 72, 7) + drop(126, 56, 5) + drop(62, 92, 5) }, 'red'),
    s('ellipse', { cx: 80, cy: 132, rx: 54, ry: 10 }, 'red')
  ],
  'saudí': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'cream'),
    s('circle', { cx: 116, cy: 40, r: 16 }, 'orange'),
    s('path', { d: 'M14 120q40-40 80-10q30-26 52-6v42H14z' }, 'tan'),
    s('path', { d: 'M14 132q50-24 132 0v14H14z' }, 'orange', { accent: true }),
    ...scaled([s('path', { d: CAMEL }, 'brown')], 0.6, 22, 34)
  ],
  suicidar: [
    s('path', { d: 'M50 112h60l-8 32H58z' }, 'brown'),
    s('path', { d: 'M80 112V70q0-14-20-22', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: ells([[54, 50, 10, 6], [60, 60, 6, 10]]) }, 'gray'),
    s('path', { d: 'M132 86q-6-10-18-4l-14 10', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: heart(110, 34, 14) }, 'pink', { accent: true }),
    s('path', { d: drop(78, 84, 4) }, 'sky')
  ],
  surf: [
    backdrop('sky'),
    s('path', { d: 'M14 146V100q30-56 80-56q-30 14-26 48q10 30 78 16v38z' }, 'blue', { accent: true }),
    s('path', { d: 'M94 44q-18 10-18 28', ...SW(4) }, 'white', { stroke: true }),
    s('ellipse', { cx: 92, cy: 104, rx: 34, ry: 6, transform: 'rotate(-10 92 104)' }, 'yellow'),
    ...lean(92, 100, -8, 'red', { h: 28, w: 18, r: 9 }),
    s('path', { d: 'M76 82l-14-6M106 82l14-8', ...SW(5) }, 'skin', { stroke: true })
  ],
  traba: [
    ground(),
    s('path', { d: 'M28 136V96M132 136V96', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 20, y: 82, width: 120, height: 18, rx: 4 }, 'white'),
    s('path', { d: 'M30 82l-10 18M54 82l-12 18M78 82l-12 18M102 82l-12 18M126 82l-12 18', ...SW(9, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true, accent: true }),
    s('rect', { x: 20, y: 82, width: 120, height: 18, rx: 4, ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 70V30', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 30, r: 10 }, 'orange')
  ],
  'tía': [
    ground(),
    ...lady(58, 136, 'purple', { accent: true }),
    ...person(108, 136, 'green', { h: 28, w: 22, r: 10 }),
    s('path', { d: 'M66 96q24 0 34 4', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(110, 46, 12) }, 'red')
  ],
  'típicamente': [
    ground(),
    s('path', { d: 'M18 136V96l16-14 16 14v40zM56 136V96l16-14 16 14v40zM94 136V96l16-14 16 14v40z' }, 'tan'),
    s('path', { d: 'M14 98l20-18 20 18M52 98l20-18 20 18M90 98l20-18 20 18', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: rects([[28, 110, 12, 26], [66, 110, 12, 26], [104, 110, 12, 26]]) }, 'brown'),
    s('path', { d: 'M110 40l10 10 20-24', ...SW(6) }, 'green', { stroke: true })
  ],
  ventura: [
    s('path', { d: 'M80 82q10 40 34 60', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: heart(80, 76, 20) }, 'green', { accent: true }),
    s('path', { d: heart(80, 76, 20), transform: 'rotate(90 80 82)' }, 'green'),
    s('path', { d: heart(80, 76, 20), transform: 'rotate(180 80 82)' }, 'green'),
    s('path', { d: heart(80, 76, 20), transform: 'rotate(270 80 82)' }, 'green'),
    s('path', { d: sparkle(130, 30, 10) + sparkle(30, 128, 8) }, 'yellow')
  ],
  vitalidad: [
    s('rect', { x: 30, y: 44, width: 90, height: 64, rx: 8 }, 'dark'),
    s('rect', { x: 120, y: 64, width: 10, height: 24, rx: 3 }, 'dark'),
    s('path', { d: rects([[38, 52, 20, 48], [62, 52, 20, 48], [86, 52, 26, 48]]) }, 'green', { accent: true }),
    s('path', { d: 'M76 16l-12 20h12l-8 20 22-26H78l8-14z' }, 'yellow'),
    s('path', { d: sparkle(30, 128, 9) + sparkle(130, 126, 9) + sparkle(80, 134, 7) }, 'yellow')
  ],
  abanico: [
    s('path', { d: wedge(80, 120, 76, 200, 340) }, 'red', { accent: true }),
    s('path', { d: rays(80, 120, 10, 76, 20, 198).split('M').filter(Boolean).slice(0, 9).map(x => 'M' + x).join(''), ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M24 104a56 56 0 0 1 112 0', ...SW(5) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 120, r: 7 }, 'brown')
  ],
  acreditado: [
    s('rect', { x: 18, y: 28, width: 124, height: 88, rx: 4 }, 'cream'),
    s('rect', { x: 26, y: 36, width: 108, height: 72, rx: 2, ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M40 56h80M40 72h56', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 108l-6 32 14-8 14 8-6-32z' }, 'blue'),
    s('path', { d: burst(112, 98, 20, 16, 12) }, 'red', { accent: true }),
    s('circle', { cx: 112, cy: 98, r: 9 }, 'yellow')
  ],
  adobe: [
    ground(),
    s('rect', { x: 26, y: 62, width: 108, height: 74 }, 'tan', { accent: true }),
    s('path', { d: 'M26 80h108M26 98h108M26 116h108M50 62v18M86 62v18M122 62v18M38 80v18M74 80v18M110 80v18M50 98v18M86 98v18M122 98v18M38 116v20M74 116v20M110 116v20', ...SW(3) }, 'brown', { stroke: true }),
    s('rect', { x: 20, y: 54, width: 120, height: 10, rx: 2 }, 'brown'),
    s('path', { d: 'M40 58h-14M124 58h14', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 124, cy: 30, r: 14 }, 'yellow')
  ],
  aguacate: [
    s('path', { d: 'M48 20q-26 0-26 50q0 70 26 70t26-70q0-50-26-50z' }, 'dark'),
    s('path', { d: 'M48 26q-20 0-20 46q0 62 20 62t20-62q0-46-20-46z' }, 'green'),
    s('path', { d: 'M112 20q-26 0-26 50q0 70 26 70t26-70q0-50-26-50z' }, 'dark'),
    s('path', { d: 'M112 26q-20 0-20 46q0 62 20 62t20-62q0-46-20-46z' }, 'mint'),
    s('circle', { cx: 112, cy: 96, r: 16 }, 'brown', { accent: true })
  ],
  alergia: [
    ground(),
    ...person(54, 136, 'blue', { accent: true }),
    s('path', { d: 'M68 70l16-6M68 76h18M68 82l16 6', ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 50, cy: 70, rx: 4, ry: 2 }, 'red'),
    ...flower(118, 72, 'pink'),
    s('path', { d: dots([[98, 54], [92, 64], [102, 44], [88, 50]], 2.5) }, 'yellow')
  ],
  'alineación': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 8 }, 'green'),
    s('path', { d: 'M14 80h132', ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 16, ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: dots([[80, 134], [40, 116], [68, 118], [92, 118], [120, 116], [48, 98], [80, 96], [112, 98], [56, 64], [104, 64], [80, 48]], 6) }, 'red', { accent: true }),
    s('path', { d: 'M60 146v-8h40v8', ...SW(3) }, 'white', { stroke: true })
  ],
  ancestral: [
    s('rect', { x: 14, y: 14, width: 132, height: 122, rx: 12 }, 'sky'),
    ground(),
    s('path', { d: rects([[30, 66, 22, 70], [108, 66, 22, 70], [66, 82, 28, 54]]) }, 'gray'),
    s('rect', { x: 24, y: 52, width: 112, height: 16, rx: 3 }, 'gray', { accent: true }),
    s('path', { d: 'M36 80l10 6M114 92l10 8', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 32, r: 12 }, 'orange')
  ],
  anteojos: [
    s('path', { d: ring(46, 84, 26) + ring(114, 84, 26) + 'M72 80q8-8 16 0M20 78L10 64M140 78l10-14', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: dots([[46, 84], [114, 84]], 22) }, 'sky', { accent: true }),
    s('path', { d: 'M34 76l10-10M102 76l10-10', ...SW(4) }, 'white', { stroke: true })
  ],
  'antibiótico': [
    s('rect', { x: 30, y: 60, width: 80, height: 34, rx: 17, transform: 'rotate(-35 70 77)' }, 'white'),
    s('rect', { x: 30, y: 60, width: 40, height: 34, rx: 17, transform: 'rotate(-35 70 77)' }, 'blue', { accent: true }),
    s('rect', { x: 30, y: 60, width: 80, height: 34, rx: 17, transform: 'rotate(-35 70 77)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[118, 116, 18, 12]]) + 'M100 116h-8M136 116h8M118 104v-8M118 128v8' }, 'green'),
    s('path', { d: 'M100 116h-8M136 116h8M118 104v-8M118 128v8', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M100 100l36 32M136 100l-36 32', ...SW(5) }, 'red', { stroke: true })
  ],
  'anulación': [
    s('rect', { x: 34, y: 18, width: 92, height: 124, rx: 4 }, 'white'),
    s('rect', { x: 34, y: 18, width: 92, height: 124, rx: 4, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 40h64M48 56h64M48 72h40M48 88h64', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 30l100 100M130 30L30 130', ...SW(12) }, 'red', { stroke: true, accent: true })
  ],
  'apagón': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('path', { d: rects([[20, 90, 26, 56], [50, 70, 30, 76], [84, 100, 24, 46], [112, 80, 30, 66]]) }, 'black'),
    s('path', { d: 'M80 14v18', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M68 38h24v8q14 6 14 22a26 26 0 0 1-52 0q0-16 14-22z' }, 'gray', { accent: true }),
    s('path', { d: dots([[124, 30]], 8) }, 'cream')
  ],
  aura: [
    s('ellipse', { cx: 80, cy: 82, rx: 58, ry: 64 }, 'cream'),
    s('ellipse', { cx: 80, cy: 82, rx: 44, ry: 52, ...SW(5) }, 'purple', { stroke: true, accent: true }),
    s('ellipse', { cx: 80, cy: 82, rx: 58, ry: 64, ...SW(3) }, 'pink', { stroke: true }),
    ...person(80, 126, 'blue', { h: 42, w: 28, r: 12 }),
    s('path', { d: sparkle(126, 30, 8) + sparkle(30, 132, 7) }, 'yellow')
  ],
  banquillo: [
    s('rect', { x: 14, y: 14, width: 132, height: 60, rx: 10 }, 'sky'),
    s('rect', { x: 14, y: 74, width: 132, height: 72, rx: 0 }, 'green'),
    s('rect', { x: 18, y: 104, width: 124, height: 10, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: 'M28 114v24M132 114v24', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: busts([46, 80, 114], 106, 24, 34) }, 'orange'),
    s('path', { d: dots([[46, 64], [80, 64], [114, 64]], 10) }, 'skin')
  ],
  bautismo: [
    s('path', { d: 'M30 96h100q0 34-50 34T30 96z' }, 'gray'),
    s('path', { d: 'M66 130h28l6 14H60z' }, 'gray'),
    s('ellipse', { cx: 80, cy: 98, rx: 46, ry: 8 }, 'sky'),
    s('circle', { cx: 80, cy: 84, r: 14 }, 'skin'),
    s('ellipse', { cx: 80, cy: 98, rx: 22, ry: 8 }, 'white'),
    s('path', { d: 'M90 26q20-10 34 4l-10 18q-14-4-24-22z' }, 'orange', { accent: true }),
    s('path', { d: drop(90, 54, 4) + drop(84, 66, 3) }, 'blue')
  ],
  boxeador: [
    ground(),
    s('circle', { cx: 80, cy: 46, r: 14 }, 'skin'),
    s('rect', { x: 64, y: 62, width: 32, height: 40, rx: 10 }, 'blue'),
    s('rect', { x: 64, y: 98, width: 32, height: 20, rx: 4 }, 'red'),
    s('path', { d: 'M72 118v18M88 118v18', ...SW(9) }, 'skin', { stroke: true }),
    s('path', { d: 'M66 72l-20 4M94 72l20-4', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: ells([[40, 70, 14, 16], [120, 62, 14, 16]]) }, 'red', { accent: true })
  ],
  cacho: [
    s('path', { d: 'M18 110q0-40 40-44h28l-8 10 8 10-6 12 8 14-6 12H30q-12 0-12-14z' }, 'orange'),
    s('path', { d: 'M34 84q10-6 14 0M52 80q10-6 14 0', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M108 76h16q16 4 16 28t-16 26h-16l6-10-8-12 6-10-8-12z' }, 'orange', { accent: true }),
    s('path', { d: 'M108 76l6 10-8 10 6 12-8 12h10', ...SW(3) }, 'cream', { stroke: true }),
    arrow('M96 54q10-14 24-6', 'gray', 4)
  ],
  calabaza: [
    s('path', { d: 'M80 44q-4-16 8-24', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: ells([[56, 92, 32, 44], [104, 92, 32, 44]]) }, 'orange'),
    s('ellipse', { cx: 80, cy: 92, rx: 26, ry: 46 }, 'orange', { accent: true }),
    s('path', { d: 'M80 48v88M58 52q-14 40 0 80M102 52q14 40 0 80', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(86, 40, -20, 26, 8) }, 'green')
  ],
  chao: [
    s('path', { d: 'M60 146V110', ...SW(18) }, 'blue', { stroke: true }),
    s('path', { d: 'M46 112V60a7 7 0 0 1 14 0V50a7 7 0 0 1 14 0v6a7 7 0 0 1 14 0v10a7 7 0 0 1 14 0v34l14-14q10-4 12 4l-22 32q-10 12-26 12h-14q-20 0-20-22z' }, 'skin', { accent: true }),
    s('path', { d: 'M28 70q-8-14 0-28M18 76q-12-20 0-42M124 50q10 10 6 26M134 42q14 16 8 38', ...SW(4) }, 'orange', { stroke: true })
  ],
  chiquito: [
    s('path', { d: 'M100 98L132 136', ...SW(12) }, 'brown', { stroke: true }),
    s('circle', { cx: 74, cy: 72, r: 38 }, 'sky'),
    s('circle', { cx: 74, cy: 72, r: 38, ...SW(8) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 74, cy: 78, rx: 12, ry: 10 }, 'red', { accent: true }),
    s('path', { d: dots([[70, 76], [79, 81]], 2) + 'M66 70a8 6 0 0 1 16 0z' }, 'dark'),
    s('path', { d: 'M24 140h112', ...SW(3) }, 'gray', { stroke: true })
  ],
  chistoso: [
    s('circle', { cx: 80, cy: 80, r: 54 }, 'yellow', { accent: true }),
    s('path', { d: 'M52 66q8-10 16 0M92 66q8-10 16 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 88h64q0 36-32 36t-32-36z' }, 'dark'),
    s('path', { d: 'M60 112q20-12 40 0q-20 16-40 0z' }, 'red'),
    s('path', { d: drop(36, 76, 7) + drop(124, 76, 7) }, 'sky')
  ],
  'ciclón': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('path', { d: 'M80 80m-6 0a6 6 0 0 1 12 0a14 14 0 0 1-28 0a24 24 0 0 1 48 0a36 36 0 0 1-72 0a48 48 0 0 1 96 0', ...SW(10) }, 'white', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 80, r: 5 }, 'sky'),
    s('path', { d: 'M22 120q10-8 20 0M118 34q10-8 20 0', ...SW(4) }, 'sky', { stroke: true })
  ],
  clon: [
    ground(),
    s('path', { d: ells([[40, 92, 26, 20], [120, 92, 26, 20]]) + dots([[28, 80], [46, 76], [108, 80], [126, 76]], 10) }, 'white'),
    s('path', { d: ells([[40, 92, 26, 20], [120, 92, 26, 20]]), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[62, 84, 9, 11], [142, 84, 9, 11]]) }, 'dark'),
    s('path', { d: 'M28 110v26M50 110v26M108 110v26M130 110v26', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M74 52h12M74 60h12', ...SW(4) }, 'blue', { stroke: true, accent: true }),
    arrow('M54 40q26-20 52 0', 'blue', 4)
  ],
  codicia: [
    ground(),
    s('path', { d: ells([[54, 128, 30, 8], [54, 120, 30, 8], [54, 112, 30, 8], [100, 128, 26, 8], [100, 120, 26, 8]]) }, 'orange'),
    s('path', { d: dots([[40, 100], [64, 96], [52, 84], [96, 108], [112, 104]], 10) }, 'yellow', { accent: true }),
    s('path', { d: 'M146 46l-30 18-10 22', ...SW(14) }, 'skin', { stroke: true }),
    s('path', { d: 'M96 84l10 10 8-6M104 74l14 10', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(30, 50, 9) + sparkle(84, 40, 7) }, 'yellow')
  ],
  comportar: [
    s('rect', { x: 92, y: 90, width: 54, height: 8, rx: 2 }, 'brown'),
    s('path', { d: 'M98 98v38M140 98v38', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 136V96h40v40M40 96V60', ...SW(5) }, 'brown', { stroke: true }),
    ...person(64, 96, 'green', { h: 36, w: 26, r: 11, accent: true }),
    s('path', { d: 'M78 82h20', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: star(122, 46, 16) }, 'yellow')
  ],
  concretar: [
    s('path', { d: ells([[38, 64, 18, 14], [56, 54, 18, 18], [64, 70, 18, 12], [32, 74, 14, 10]]) }, 'sky'),
    s('path', { d: dots([[46, 64]], 7) }, 'yellow'),
    arrow('M80 80h22', 'orange', 6),
    s('path', { d: 'M100 70l12 10-12 10z' }, 'orange'),
    s('path', { d: 'M116 96l18-10v34l-18 10z' }, 'orange'),
    s('path', { d: 'M96 86l20 10v34l-20-10z' }, 'gray', { accent: true }),
    s('path', { d: 'M96 86l18-10 20 10-18 10z' }, 'cream'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  condolencia: [
    ground(),
    ...person(58, 136, 'gray', { accent: true }),
    ...person(108, 136, 'navy'),
    s('path', { d: 'M96 96L68 84', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: drop(52, 86, 3) }, 'sky'),
    s('path', { d: 'M126 96l10-40', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: leaflet(136, 56, -100, 16, 6) + leaflet(136, 56, -60, 14, 5) + leaflet(136, 56, -140, 14, 5) }, 'white')
  ],
  confort: [
    s('path', { d: 'M30 140v-10M130 140v-10', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M38 104V56q0-16 16-16h52q16 0 16 16v48z' }, 'red', { accent: true }),
    s('rect', { x: 20, y: 80, width: 22, height: 50, rx: 10 }, 'red'),
    s('rect', { x: 118, y: 80, width: 22, height: 50, rx: 10 }, 'red'),
    s('rect', { x: 40, y: 98, width: 80, height: 32, rx: 8 }, 'pink'),
    s('rect', { x: 62, y: 60, width: 36, height: 30, rx: 10, transform: 'rotate(-10 80 75)' }, 'yellow')
  ],
  consultorio: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'mint'),
    s('path', { d: 'M110 30v24M98 42h24', ...SW(8, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true }),
    ...person(52, 136, 'white'),
    s('rect', { x: 37, y: 92, width: 30, height: 44, rx: 10, ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 94v14a6 6 0 0 0 12 0V94', ...SW(3) }, 'dark', { stroke: true }),
    ...person(114, 136, 'blue', { h: 38, w: 26, r: 11, accent: true })
  ],
  contraer: [
    ground(),
    ...person(52, 136, 'green', { accent: true }),
    s('path', { d: 'M42 74h20', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: burst(112, 50, 16, 10, 10) + burst(128, 96, 12, 8, 9) + burst(96, 88, 9, 6, 8) }, 'purple'),
    arrow('M96 56l-22 10', 'gray', 3),
    s('path', { d: drop(36, 64, 3) }, 'sky')
  ],
  deprimente: [
    ground(),
    s('path', { d: ells([[60, 36, 26, 18], [92, 32, 26, 22], [78, 46, 40, 12]]) }, 'gray'),
    s('path', { d: 'M54 64l-4 10M74 64l-4 10M94 64l-4 10', ...SW(3) }, 'blue', { stroke: true }),
    ...person(76, 136, 'navy', { accent: true }),
    s('path', { d: 'M70 84q6-4 12 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  desesperadamente: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'blue'),
    s('ellipse', { cx: 80, cy: 128, rx: 40, ry: 14 }, 'tan'),
    s('path', { d: 'M84 120q-2-30 10-60', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(94, 60, 200, 22, 7) + leaflet(94, 60, -20, 22, 7) + leaflet(94, 60, 120, 18, 6) }, 'green'),
    ...person(60, 120, 'red', { h: 30, w: 20, r: 9, accent: true }),
    s('path', { d: 'M52 96l-14-22M68 96l12-20', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M26 64l-4-10M88 60l6-8', ...SW(3) }, 'white', { stroke: true })
  ],
  despegue: [
    backdrop('sky'),
    s('path', { d: 'M14 128h132v18H14z' }, 'dark'),
    s('path', { d: 'M24 138h20M64 138h20M104 138h20', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M34 112l90-48q14-6 16 2t-12 14l-90 44z' }, 'white', { accent: true }),
    s('path', { d: 'M76 92l-6-30 14-6 16 26zM44 112l-14-18h10l14 12z' }, 'blue'),
    s('path', { d: 'M34 112l90-48q14-6 16 2t-12 14l-90 44z', ...SW(2) }, 'gray', { stroke: true })
  ],
  diagrama: [
    s('rect', { x: 56, y: 18, width: 48, height: 26, rx: 5 }, 'blue', { accent: true }),
    s('rect', { x: 18, y: 112, width: 44, height: 26, rx: 5 }, 'green'),
    s('rect', { x: 98, y: 112, width: 44, height: 26, rx: 5 }, 'orange'),
    s('path', { d: 'M80 58l22 18-22 18-22-18z' }, 'yellow'),
    s('path', { d: 'M80 44v14M58 76H40v34M102 76h18v34', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M34 104l6 8 6-8zM114 104l6 8 6-8z' }, 'dark')
  ],
  dibujante: [
    s('rect', { x: 22, y: 40, width: 80, height: 100, rx: 3 }, 'white'),
    s('rect', { x: 22, y: 40, width: 80, height: 100, rx: 3, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 120q10-40 30-30t20-30', ...SW(4) }, 'blue', { stroke: true }),
    s('circle', { cx: 56, cy: 66, r: 10 }, 'pink'),
    s('path', { d: 'M90 70l40-46 12 10-40 46-16 6z' }, 'yellow', { accent: true }),
    s('path', { d: 'M90 70l-4 16 16-6z' }, 'tan'),
    s('path', { d: 'M130 24l12 10 4-4-12-10z' }, 'pink')
  ],
  disimular: [
    ground(),
    ...person(54, 136, 'orange', { accent: true }),
    s('circle', { cx: 64, cy: 79, r: 3 }, 'dark'),
    ...note(80, 50, 'blue'),
    s('path', { d: 'M108 136l6-18 10 8 4-12 8 22z' }, 'purple'),
    s('path', { d: 'M100 136l4-8M140 128l4 8', ...SW(4) }, 'purple', { stroke: true })
  ],
  'dotación': [
    s('path', { d: 'M14 120h132v26H14z' }, 'blue'),
    s('path', { d: 'M20 96h120l-16 32H36z' }, 'red', { accent: true }),
    s('path', { d: busts([46, 68, 90, 112], 96, 14, 20) }, 'navy'),
    s('path', { d: dots([[46, 70], [68, 70], [90, 70], [112, 70]], 7) }, 'skin'),
    s('path', { d: 'M80 62V22', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 24l26 14-26 10z' }, 'yellow')
  ],
  estrato: [
    s('path', { d: 'M14 30q66-14 132 0v20q-66-14-132 0z' }, 'green'),
    s('path', { d: 'M14 50q66-14 132 0v24q-66-14-132 0z' }, 'brown'),
    s('path', { d: 'M14 74q66-14 132 0v22q-66-14-132 0z' }, 'tan', { accent: true }),
    s('path', { d: 'M14 96q66-14 132 0v22q-66-14-132 0z' }, 'orange'),
    s('path', { d: 'M14 118q66-14 132 0v28H14z' }, 'gray'),
    s('path', { d: dots([[40, 108], [100, 126], [120, 84]], 4) }, 'dark')
  ],
  estudioso: [
    s('path', { d: rects([[20, 124, 52, 12], [24, 112, 48, 12], [18, 100, 54, 12]]) }, 'red'),
    s('path', { d: 'M22 106h48M26 118h44', ...SW(2) }, 'cream', { stroke: true }),
    s('circle', { cx: 104, cy: 56, r: 14 }, 'skin'),
    s('path', { d: 'M86 54l18-10 18 10-18 8z' }, 'dark'),
    s('rect', { x: 88, y: 72, width: 32, height: 46, rx: 10 }, 'blue'),
    s('path', { d: 'M80 98l24 8 24-8v26l-24 8-24-8z' }, 'yellow', { accent: true }),
    s('path', { d: 'M104 106v26', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  evadir: [
    ground(),
    ...lean(100, 136, 24, 'green', { accent: true }),
    s('path', { d: 'M96 136l-16-10', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M76 70H52M80 90H44M80 110H56', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 18, y: 42, width: 30, height: 38, rx: 3 }, 'white'),
    s('rect', { x: 18, y: 42, width: 30, height: 38, rx: 3, ...SW(3) }, 'red', { stroke: true })
  ],
  extremidad: [
    s('circle', { cx: 80, cy: 32, r: 14 }, 'skin'),
    s('rect', { x: 66, y: 48, width: 28, height: 50, rx: 10 }, 'gray'),
    s('path', { d: 'M68 56L34 82M92 56l34 26M72 96l-16 42M88 96l16 42', ...SW(10) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: dots([[30, 85], [130, 85]], 7) }, 'skin'),
    s('path', { d: 'M46 140h14M100 140h14', ...SW(7) }, 'dark', { stroke: true })
  ],
  'facción': [
    ground(),
    s('path', { d: busts([24, 46, 34], 136, 20, 40) }, 'red', { accent: true }),
    s('path', { d: busts([114, 136, 126], 136, 20, 40) }, 'blue'),
    s('path', { d: dots([[24, 88], [46, 88], [114, 88], [136, 88]], 9) + dots([[34, 102], [126, 102]], 9) }, 'skin'),
    s('path', { d: 'M80 30v106', ...DASH(5, '8 8') }, 'gray', { stroke: true }),
    s('path', { d: 'M24 54l22-14v28zM136 54l-22-14v28z' }, 'yellow')
  ],
  felizmente: [
    s('path', { d: 'M14 120q66-20 132 0v26H14z' }, 'green'),
    s('circle', { cx: 120, cy: 36, r: 16 }, 'yellow'),
    ...lean(66, 118, -12, 'pink', { accent: true }),
    s('path', { d: 'M54 76l-20-16M78 76l18-22', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M54 50q6 6 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: heart(30, 46, 10) + heart(104, 70, 8) }, 'red')
  ],
  frijol: [
    s('path', { d: 'M20 84h120q0 56-60 56T20 84z' }, 'orange'),
    s('path', { d: ells([[48, 82, 10, 7], [68, 76, 10, 7], [90, 80, 10, 7], [112, 82, 10, 7], [58, 90, 10, 7], [80, 90, 10, 7], [102, 90, 10, 7]]) }, 'brown', { accent: true }),
    s('path', { d: ells([[40, 40, 14, 9], [76, 36, 14, 9], [116, 44, 14, 9]]) }, 'red'),
    s('path', { d: 'M36 38q4 2 8 0M72 34q4 2 8 0M112 42q4 2 8 0', ...SW(2) }, 'cream', { stroke: true })
  ],
  'galardón': [
    s('path', { d: 'M52 26h56v28q0 30-28 30t-28-30z' }, 'yellow', { accent: true }),
    s('path', { d: 'M52 34H36q0 26 20 28M108 34h16q0 26-20 28', ...SW(5) }, 'yellow', { stroke: true }),
    s('rect', { x: 74, y: 84, width: 12, height: 22 }, 'orange'),
    s('rect', { x: 52, y: 106, width: 56, height: 14, rx: 3 }, 'orange'),
    s('rect', { x: 44, y: 120, width: 72, height: 18, rx: 3 }, 'brown'),
    s('path', { d: star(80, 50, 11) }, 'white')
  ],
  genuino: [
    s('path', { d: 'M40 58l16-22h48l16 22-40 52z' }, 'sky', { accent: true }),
    s('path', { d: 'M40 58h80M56 36l8 22 16-22 16 22 8-22M64 58l16 52 16-52', ...SW(2) }, 'blue', { stroke: true }),
    s('path', { d: sparkle(124, 28, 10) + sparkle(30, 96, 7) }, 'yellow'),
    s('circle', { cx: 116, cy: 120, r: 20 }, 'green'),
    s('path', { d: 'M106 120l7 7 13-14', ...SW(5) }, 'white', { stroke: true })
  ],
  hemorragia: [
    s('rect', { x: 14, y: 50, width: 132, height: 40, rx: 20 }, 'skin'),
    s('rect', { x: 62, y: 46, width: 36, height: 48, rx: 4 }, 'white'),
    s('rect', { x: 62, y: 46, width: 36, height: 48, rx: 4, ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 70, r: 11 }, 'red', { accent: true }),
    s('path', { d: drop(72, 112, 5) + drop(90, 128, 4) }, 'red'),
    s('ellipse', { cx: 80, cy: 142, rx: 30, ry: 4 }, 'red')
  ],
  iluminado: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('path', { d: 'M58 34l-34 112h102L94 34z' }, 'yellow', { accent: true }),
    s('path', { d: 'M76 14v12', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 34q0-10 28-10t28 10z' }, 'gray'),
    s('path', { d: 'M24 136h112', ...SW(4) }, 'orange', { stroke: true }),
    ...person(80, 136, 'red', { h: 30, w: 20, r: 9 })
  ],
  imponente: [
    backdrop('sky'),
    s('path', { d: 'M14 136L80 22l66 114z' }, 'gray', { accent: true }),
    s('path', { d: 'M62 54l18-32 18 32-8 6-10-8-8 8z' }, 'white'),
    s('path', { d: 'M14 136h132v10H14z' }, 'green'),
    ...person(30, 136, 'red', { h: 12, w: 8, r: 4 }),
    s('path', { d: birds([[118, 40]]), ...SW(3) }, 'dark', { stroke: true })
  ],
  indudablemente: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 48, ...SW(4) }, 'mint', { stroke: true }),
    s('path', { d: 'M52 82l20 20 38-42', ...SW(12) }, 'white', { stroke: true })
  ],
  informante: [
    backdrop('dark'),
    s('path', { d: 'M48 146V90q0-16 20-16t20 16v56z' }, 'tan', { accent: true }),
    s('circle', { cx: 68, cy: 58, r: 13 }, 'skin'),
    s('path', { d: 'M46 50h44M54 50q0-18 14-18t14 18z' }, 'brown'),
    s('path', { d: 'M46 50h44', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 96, y: 92, width: 34, height: 24, rx: 2, transform: 'rotate(-10 113 104)' }, 'cream'),
    s('path', { d: 'M86 108l14-4', ...SW(6) }, 'skin', { stroke: true })
  ],
  lama: [
    ground(),
    s('circle', { cx: 80, cy: 46, r: 16 }, 'skin'),
    s('path', { d: 'M48 136q0-66 32-66t32 66z' }, 'red', { accent: true }),
    s('path', { d: 'M64 74q30 20 36 62h12q0-60-32-66z' }, 'orange'),
    s('path', { d: ring(80, 100, 14), ...DASH(5, '2 5') }, 'brown', { stroke: true }),
    s('path', { d: 'M72 44h4M84 44h4M74 54q6 4 12 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  ligar: [
    ground(),
    ...person(46, 136, 'blue'),
    ...lady(116, 136, 'red', { accent: true }),
    s('path', { d: 'M60 100l26-12', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M86 88l8-22', ...SW(3) }, 'green', { stroke: true }),
    s('circle', { cx: 95, cy: 62, r: 7 }, 'red'),
    s('path', { d: heart(80, 36, 10) + heart(100, 26, 7) }, 'pink')
  ],
  logotipo: [
    s('path', { d: 'M40 30l-26 20 12 22 14-6v74h80V66l14 6 12-22-26-20q-10 12-40 12t-40-12z' }, 'white'),
    s('path', { d: 'M40 30l-26 20 12 22 14-6v74h80V66l14 6 12-22-26-20q-10 12-40 12t-40-12z', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 90, r: 22 }, 'blue', { accent: true }),
    s('path', { d: 'M66 98q14-24 32-14', ...SW(6) }, 'yellow', { stroke: true })
  ],
  malta: [
    s('path', { d: 'M40 146V40', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: ells([[34, 52, 5, 9], [46, 52, 5, 9], [34, 70, 5, 9], [46, 70, 5, 9], [34, 88, 5, 9], [46, 88, 5, 9], [40, 34, 5, 9]]) }, 'yellow'),
    s('path', { d: 'M74 54h52v80q0 8-8 8H82q-8 0-8-8z' }, 'brown', { accent: true }),
    s('path', { d: ells([[84, 52, 12, 10], [100, 48, 14, 12], [116, 52, 12, 10]]) }, 'cream'),
    s('path', { d: 'M126 70h8q10 0 10 10v20q0 10-10 10h-8', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: ells([[100, 132, 6, 3], [90, 128, 4, 2]]) }, 'orange')
  ],
  manufactura: [
    s('path', { d: 'M14 136V70l30 18V70l30 18V70l30 18V40h20v96z' }, 'gray'),
    s('path', { d: 'M108 32q8-14 20-10q8-12 18-4', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 14, y: 110, width: 132, height: 10, rx: 5 }, 'dark'),
    s('path', { d: dots([[24, 115], [50, 115], [76, 115], [102, 115], [128, 115]], 3) }, 'gray'),
    s('path', { d: rects([[24, 92, 18, 18], [64, 92, 18, 18], [104, 92, 18, 18]]) }, 'orange', { accent: true }),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'dark', { stroke: true })
  ],
  mobiliario: [
    ground(),
    s('rect', { x: 100, y: 40, width: 40, height: 96, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: 'M120 44v88M112 86v8M128 86v8', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 18, y: 90, width: 66, height: 8, rx: 2 }, 'tan'),
    s('path', { d: 'M24 98v38M78 98v38', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: 'M88 136v-30h-10M88 106V70', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M36 90V74l10-14 10 14v16z' }, 'yellow')
  ],
  'mítico': [
    backdrop('sky'),
    ...horse('white', 'purple'),
    s('path', { d: ells([[76, 84, 44, 20]]), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M134 40l10-24-2 28z' }, 'yellow', { accent: true }),
    s('path', { d: sparkle(40, 36, 10) + sparkle(70, 22, 7) }, 'pink')
  ],
  'nitrógeno': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M64 66l32 0M64 80h32M64 94h32', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: dots([[54, 80], [106, 80]], 24) }, 'blue', { accent: true }),
    s('path', { d: dots([[46, 70], [98, 70]], 6) }, 'white'),
    s('path', { d: ring(30, 130, 6) + ring(130, 30, 8) + ring(124, 128, 5) + ring(34, 32, 5), ...SW(3) }, 'white', { stroke: true })
  ],
  notario: [
    s('rect', { x: 18, y: 64, width: 90, height: 76, rx: 3 }, 'white'),
    s('rect', { x: 18, y: 64, width: 90, height: 76, rx: 3, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 82h60M30 96h60M30 110h30', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 82, cy: 122, r: 12 }, 'red'),
    s('path', { d: 'M114 70v-24M100 44q14-24 28 0z' }, 'brown'),
    s('path', { d: 'M114 70V48', ...SW(10) }, 'brown', { stroke: true }),
    s('rect', { x: 98, y: 70, width: 32, height: 12, rx: 3 }, 'dark', { accent: true })
  ],
  notorio: [
    s('path', { d: 'M66 14h28l30 104H36z' }, 'cream'),
    s('rect', { x: 66, y: 10, width: 28, height: 10, rx: 3 }, 'dark'),
    s('path', { d: star(80, 86, 26) }, 'red', { accent: true }),
    s('path', { d: busts([24, 52, 108, 136], 146, 20, 22) }, 'navy'),
    s('path', { d: dots([[24, 120], [52, 120], [108, 120], [136, 120]], 8) }, 'skin')
  ],
  patriarca: [
    ground(),
    s('circle', { cx: 66, cy: 44, r: 14 }, 'skin'),
    s('path', { d: 'M54 48q12 32 24 0z' }, 'white'),
    s('path', { d: 'M54 48q12 32 24 0', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 50, y: 62, width: 32, height: 74, rx: 10 }, 'brown', { accent: true }),
    s('path', { d: 'M94 136V62q0-8-8-8', ...SW(5) }, 'tan', { stroke: true }),
    ...person(118, 136, 'blue', { h: 34, w: 22, r: 10 }),
    ...person(26, 136, 'green', { h: 28, w: 18, r: 9 })
  ],
  penitenciario: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'gray'),
    s('rect', { x: 36, y: 30, width: 88, height: 100, rx: 4 }, 'navy'),
    s('circle', { cx: 104, cy: 52, r: 8 }, 'cream'),
    s('path', { d: 'M50 30v100M68 30v100M86 30v100M104 30v100', ...SW(6, { 'stroke-linecap': 'butt' }) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: 'M36 30h88v100H36z', ...SW(6) }, 'dark', { stroke: true })
  ],
  pereza: [
    s('path', { d: 'M14 40q66-14 132 0', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M52 38v20M108 38v20', ...SW(6) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 80, cy: 72, rx: 36, ry: 22 }, 'tan', { accent: true }),
    s('circle', { cx: 110, cy: 80, r: 16 }, 'tan'),
    s('ellipse', { cx: 112, cy: 82, rx: 11, ry: 9 }, 'cream'),
    s('path', { d: 'M104 80q3 3 6 0M114 80q3 3 6 0M110 88h4', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: ells([[40, 120, 18, 10], [60, 132, 14, 8]]) }, 'green')
  ],
  'pestaña': [
    s('path', { d: 'M20 84q60-56 120 0q-60 52-120 0z' }, 'white'),
    s('path', { d: 'M20 84q60-56 120 0q-60 52-120 0z', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 84, r: 20 }, 'brown', { accent: true }),
    s('circle', { cx: 80, cy: 84, r: 9 }, 'black'),
    s('path', { d: 'M34 70l-10-16M52 58l-6-18M70 52l-2-20M90 52l2-20M108 58l6-18M126 70l10-16', ...SW(4) }, 'dark', { stroke: true })
  ],
  pileta: [
    s('path', { d: 'M24 84h112v10q0 30-30 30H54q-30 0-30-30z' }, 'white'),
    s('path', { d: 'M24 84h112v10q0 30-30 30H54q-30 0-30-30z', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 66, y: 124, width: 28, height: 22 }, 'gray'),
    s('path', { d: 'M80 82V40q0-10 10-10h12v12', ...SW(8) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: drop(102, 60, 4) + drop(102, 74, 3) }, 'blue'),
    s('ellipse', { cx: 80, cy: 94, rx: 40, ry: 6 }, 'sky')
  ],
  populismo: [
    s('rect', { x: 54, y: 72, width: 40, height: 30, rx: 3 }, 'brown'),
    ...person(74, 72, 'navy', { h: 26, w: 22, r: 10 }),
    s('path', { d: 'M86 44l28-14v32l-28-14z' }, 'red', { accent: true }),
    s('path', { d: 'M122 34l10-6M124 46h12M122 58l10 6', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: busts([24, 50, 76, 102, 128], 146, 20, 22) }, 'gray'),
    s('path', { d: dots([[24, 120], [50, 120], [76, 120], [102, 120], [128, 120]], 8) }, 'skin'),
    s('path', { d: 'M36 112v-14M114 112v-14', ...SW(5) }, 'skin', { stroke: true })
  ],
  'púrpura': [
    s('path', { d: 'M40 70q-20-30 20-40q20-20 40 4q36-6 30 30q20 26-10 40q-10 30-40 14q-34 10-34-20q-26-10-6-28z' }, 'purple', { accent: true }),
    s('path', { d: dots([[26, 40], [136, 46], [130, 128], [28, 120]], 6) }, 'purple'),
    s('path', { d: 'M104 112l30 30', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M96 104l10-4 4 10-6 6z' }, 'gray')
  ],
  quincena: [
    s('rect', { x: 20, y: 28, width: 120, height: 112, rx: 8 }, 'white'),
    s('rect', { x: 20, y: 28, width: 120, height: 112, rx: 8, ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 20, y: 28, width: 120, height: 22, rx: 8 }, 'red'),
    s('path', { d: 'M46 20v16M114 20v16', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: grid(28, 58, 7, 2, 12, 12, 16, 16) + rects([[28, 90, 12, 12]]) }, 'orange', { accent: true }),
    s('path', { d: grid(44, 90, 6, 2, 12, 12, 16, 16) }, 'gray')
  ],
  rivalidad: [
    ground(),
    ...person(34, 136, 'red', { accent: true }),
    ...person(126, 136, 'blue'),
    s('path', { d: 'M44 104h72', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 94v20', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M80 136V118', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 54l-8-8M136 54l8-8', ...SW(4) }, 'orange', { stroke: true })
  ],
  'riñón': [
    s('path', { d: 'M60 30q-40 0-40 50t40 50q16 0 16-20q0-14-10-20q-8-10 0-20q10-6 10-20q0-20-16-20z' }, 'red', { accent: true }),
    s('path', { d: 'M100 30q40 0 40 50t-40 50q-16 0-16-20q0-14 10-20q8-10 0-20q-10-6-10-20q0-20 16-20z' }, 'red'),
    s('path', { d: 'M70 80h-4q-6 0-6 8v58M90 80h4q6 0 6 8v58', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M36 60q4-14 16-18M108 42q12 4 16 18', ...SW(4) }, 'pink', { stroke: true })
  ],
  rompecabezas: [
    s('rect', { x: 20, y: 44, width: 56, height: 56 }, 'blue', { accent: true }),
    s('path', { d: dots([[48, 40], [80, 72]], 11) }, 'blue'),
    s('rect', { x: 92, y: 64, width: 50, height: 56 }, 'orange'),
    s('path', { d: dots([[117, 124]], 11) }, 'orange'),
    s('circle', { cx: 92, cy: 92, r: 11 }, 'white'),
    s('rect', { x: 30, y: 112, width: 40, height: 30 }, 'green'),
    s('circle', { cx: 50, cy: 110, r: 10 }, 'green')
  ],
  saliente: [
    ground(),
    s('path', { d: rects([[18, 96, 24, 40], [46, 96, 24, 40], [102, 96, 24, 40], [130, 96, 16, 40]]) }, 'gray'),
    s('rect', { x: 74, y: 44, width: 24, height: 92 }, 'orange', { accent: true }),
    arrow('M86 32V16', 'red', 5),
    s('path', { d: 'M78 22l8-12 8 12z' }, 'red')
  ],
  saliva: [
    s('circle', { cx: 80, cy: 72, r: 52 }, 'skin', { accent: true }),
    s('path', { d: 'M54 58q6-6 12 0M94 58q6-6 12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 86q24 26 48 0z' }, 'dark'),
    s('path', { d: 'M98 92v24', ...SW(6) }, 'sky', { stroke: true }),
    s('path', { d: drop(98, 128, 7) }, 'sky')
  ],
  sancionar: [
    s('rect', { x: 66, y: 18, width: 52, height: 72, rx: 5, transform: 'rotate(10 92 54)' }, 'red', { accent: true }),
    s('path', { d: 'M70 140V96', ...SW(14) }, 'navy', { stroke: true }),
    s('path', { d: 'M56 100V72a7 7 0 0 1 14 0v-8a7 7 0 0 1 14 0v26l8-8q8-2 8 6l-10 16q-6 10-18 10h-4q-12 0-12-14z' }, 'skin'),
    s('path', { d: 'M28 50l14 8M24 74h16M28 98l14-8', ...SW(4) }, 'orange', { stroke: true })
  ],
  simbolizar: [
    backdrop('sky'),
    s('path', { d: 'M40 86q20-34 60-24l24-14-6 18q0 30-40 36q-20 4-38-16z' }, 'white', { accent: true }),
    s('path', { d: 'M62 74q20-40 50-46q-10 30-34 50z' }, 'white'),
    s('path', { d: 'M62 74q20-40 50-46q-10 30-34 50zM40 86q20-34 60-24l24-14-6 18q0 30-40 36q-20 4-38-16z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: dots([[108, 60]], 2.5) }, 'dark'),
    s('path', { d: 'M126 60l14 12', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: leaflet(132, 66, 120, 10, 4) + leaflet(138, 72, 60, 10, 4) }, 'green')
  ],
  soborno: [
    s('rect', { x: 14, y: 50, width: 132, height: 14, rx: 3 }, 'brown'),
    s('path', { d: 'M24 64v76M136 64v76', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M14 104h34M146 104h-34', ...SW(14) }, 'skin', { stroke: true }),
    s('rect', { x: 52, y: 92, width: 56, height: 26, rx: 3 }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 105, r: 7 }, 'mint'),
    s('path', { d: dots([[40, 30], [60, 30], [100, 30], [120, 30]], 7) }, 'dark')
  ],
  sobrenatural: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('path', { d: 'M44 132V70a36 36 0 0 1 72 0v62l-12-10-12 10-12-10-12 10-12-10z' }, 'white', { accent: true }),
    s('path', { d: ells([[68, 70, 6, 9], [92, 70, 6, 9], [80, 96, 7, 8]]) }, 'dark'),
    s('path', { d: sparkle(126, 32, 8) + sparkle(30, 40, 6) }, 'yellow')
  ],
};
