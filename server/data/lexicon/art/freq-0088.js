// Illustration specs for words still undrawn in batches 0087–0088 (see server/scripts/lexicon/art.js)
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
  hospicio: [
    ground(),
    s('rect', { x: 34, y: 64, width: 92, height: 72 }, 'cream'),
    outline({ x: 34, y: 64, width: 92, height: 72 }, 'tan'),
    s('path', { d: 'M24 68L80 28l56 40z' }, 'red'),
    s('path', { d: heart(80, 46, 9) }, 'pink', { accent: true }),
    s('rect', { x: 68, y: 100, width: 24, height: 36, rx: 3 }, 'brown'),
    s('path', { d: rects([[42, 80, 16, 14], [102, 80, 16, 14]]) }, 'sky')
  ],
  hospitalizar: [
    s('rect', { x: 16, y: 70, width: 8, height: 66, rx: 3 }, 'gray'),
    s('path', { d: 'M28 106v30M136 106v30', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 20, y: 92, width: 120, height: 14, rx: 4 }, 'sky'),
    s('circle', { cx: 42, cy: 80, r: 11 }, 'skin'),
    s('rect', { x: 54, y: 76, width: 82, height: 20, rx: 8 }, 'mint', { accent: true }),
    s('path', { d: 'M128 20v52M118 76h20', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 116, y: 22, width: 24, height: 26, rx: 5 }, 'sky'),
    s('path', { d: 'M128 48q-4 22-60 30', ...SW(2) }, 'blue', { stroke: true })
  ],
  hum: [
    ...face(88, 84, 48, 'yellow', 'flat', { accent: true }),
    s('path', { d: 'M62 72h14M96 72h14', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: ells([[30, 110, 9, 7], [20, 96, 7, 5], [16, 82, 5, 4]]) }, 'gray')
  ],
  impopular: [
    s('path', { d: busts([30, 130], 136, 24, 30) }, 'gray'),
    s('path', { d: dots([[30, 96], [130, 96]], 11) }, 'gray'),
    ...person(80, 136, 'orange', { accent: true }),
    s('path', { d: 'M74 84q6-4 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: ells([[66, 34, 16, 12], [84, 28, 18, 14], [100, 36, 12, 10]]) }, 'gray'),
    s('path', { d: 'M66 52l-4 10M82 52l-4 10M98 52l-4 10', ...SW(4) }, 'blue', { stroke: true })
  ],
  inconcebible: [
    s('path', { d: HEAD, transform: 'translate(10 24) scale(0.8)' }, 'skin'),
    s('circle', { cx: 87, cy: 78, r: 3 }, 'dark'),
    s('path', { d: rays(70, 36, 26, 34, 10), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: burst(70, 36, 22, 10, 10) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(122, 30, 9) + sparkle(28, 54, 7) }, 'purple')
  ],
  influjo: [
    s('circle', { cx: 112, cy: 80, r: 30 }, 'blue', { accent: true }),
    s('path', { d: 'M18 52h52M60 42l10 10-10 10M18 80h52M60 70l10 10-10 10M18 108h52M60 98l10 10-10 10', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: dots([[104, 70], [120, 76], [110, 92], [124, 92]], 5) }, 'sky')
  ],
  intensificar: [
    s('path', { d: drop(34, 118, 8) + drop(70, 112, 14) }, 'orange'),
    s('path', { d: drop(116, 100, 26) }, 'red', { accent: true }),
    s('path', { d: drop(116, 110, 13) }, 'yellow'),
    s('path', { d: 'M24 82L66 52M54 52h12v12', ...SW(5) }, 'green', { stroke: true }),
    ground(128)
  ],
  itinerante: [
    s('path', { d: 'M20 76q30-40 60-10t60-34', ...DASH(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[20, 76], [80, 66], [140, 32]], 7) }, 'red', { accent: true }),
    ...car(50, 106, 'orange'),
    ground(136)
  ],
  jalar: [
    ground(),
    s('rect', { x: 20, y: 96, width: 38, height: 40, rx: 3 }, 'tan'),
    s('path', { d: 'M20 96l38 40M58 96l-38 40', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M58 112L120 98', ...SW(4) }, 'brown', { stroke: true }),
    ...lean(112, 136, 20, 'blue', { accent: true }),
    s('path', { d: 'M114 102l8-4', ...SW(8) }, 'skin', { stroke: true })
  ],
  judo: [
    backdrop('sky'),
    s('path', { d: 'M62 90l-22 22M98 90l22-22', ...SW(11) }, 'white', { stroke: true }),
    s('rect', { x: 60, y: 78, width: 40, height: 58, rx: 10 }, 'white'),
    s('path', { d: 'M70 80l10 20 10-20', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 60, y: 104, width: 40, height: 7 }, 'black', { accent: true }),
    s('circle', { cx: 80, cy: 62, r: 13 }, 'skin')
  ],
  kiosco: [
    ground(),
    s('path', { d: 'M24 58l56-28 56 28z' }, 'green'),
    s('rect', { x: 30, y: 74, width: 100, height: 62 }, 'green'),
    s('rect', { x: 24, y: 58, width: 112, height: 18 }, 'red', { accent: true }),
    s('path', { d: rects([[38, 58, 12, 18], [62, 58, 12, 18], [86, 58, 12, 18], [110, 58, 12, 18]]) }, 'white'),
    s('rect', { x: 40, y: 84, width: 80, height: 32 }, 'cream'),
    s('path', { d: rects([[46, 90, 14, 20], [66, 90, 14, 20], [86, 90, 14, 20]]) }, 'blue'),
    s('rect', { x: 104, y: 90, width: 12, height: 20 }, 'yellow')
  ],
  maltratar: [
    ...person(52, 136, 'dark', { h: 56, w: 36, r: 15 }),
    s('path', { d: 'M64 90L94 60', ...SW(9) }, 'dark', { stroke: true }),
    s('rect', { x: 100, y: 108, width: 32, height: 28, rx: 10 }, 'sky', { accent: true }),
    s('circle', { cx: 114, cy: 100, r: 10 }, 'skin'),
    s('path', { d: 'M102 98q10-14 22-4', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: burst(104, 48, 12, 5, 8) }, 'yellow'),
    ground()
  ],
  manzanilla: [
    backdrop('sky'),
    s('path', { d: 'M48 64v40M92 50v48', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: ells([...around(48, 58, 11, 8), ...around(92, 44, 11, 8)].map(([x, y]) => [x, y, 6, 6])) }, 'white'),
    s('path', { d: dots([[48, 58], [92, 44]], 7) }, 'yellow', { accent: true }),
    s('path', { d: 'M124 104q16 0 12 14q-4 6-12 4', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M68 98h56v14q0 22-28 22t-28-22z' }, 'white'),
    s('ellipse', { cx: 96, cy: 99, rx: 26, ry: 4 }, 'yellow')
  ],
  'memorándum': [
    ...paper(34, 24, 80, 112),
    s('path', { d: 'M46 48h56M46 62h56M46 76h40M46 90h48', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M98 14v30a6 6 0 0 1-12 0V22', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 92, y: 94, width: 42, height: 42, rx: 3, transform: 'rotate(8 113 115)' }, 'yellow', { accent: true }),
    s('path', { d: 'M100 108h24M100 120h18', ...SW(3), transform: 'rotate(8 113 115)' }, 'orange', { stroke: true })
  ],
  'menstruación': [
    s('rect', { x: 24, y: 34, width: 112, height: 104, rx: 6 }, 'white'),
    outline({ x: 24, y: 34, width: 112, height: 104, rx: 6 }),
    s('rect', { x: 24, y: 34, width: 112, height: 20, rx: 6 }, 'pink'),
    s('path', { d: 'M50 26v16M110 26v16', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[44, 72], [68, 72], [92, 72], [116, 72], [44, 96], [68, 96], [92, 96], [116, 96], [44, 120], [68, 120]], 4) }, 'gray'),
    s('circle', { cx: 104, cy: 118, r: 14 }, 'pink'),
    s('path', { d: drop(104, 120, 8) }, 'red', { accent: true })
  ],
  militarmente: [
    ground(),
    s('rect', { x: 20, y: 100, width: 120, height: 32, rx: 16 }, 'dark'),
    s('path', { d: dots([[38, 116], [60, 116], [82, 116], [104, 116], [124, 116]], 7) }, 'gray'),
    s('path', { d: 'M30 100l10-18h80l10 18z' }, 'green', { accent: true }),
    s('path', { d: 'M56 82v-12q0-12 12-12h20q12 0 12 12v12z' }, 'green'),
    s('path', { d: 'M98 66h44', ...SW(7) }, 'green', { stroke: true })
  ],
  'módem': [
    s('path', { d: 'M44 86L32 36M116 86l12-50', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 52a30 30 0 0 1 44 0M68 64a16 16 0 0 1 24 0', ...SW(4) }, 'blue', { stroke: true }),
    s('rect', { x: 22, y: 86, width: 116, height: 38, rx: 8 }, 'navy'),
    s('path', { d: dots([[42, 105], [58, 105], [74, 105], [90, 105]], 4) }, 'mint', { accent: true }),
    s('path', { d: rects([[30, 124, 14, 6], [116, 124, 14, 6]]) }, 'dark')
  ],
  nogal: [
    ground(),
    ...tree(66, 'green', 'brown'),
    s('circle', { cx: 124, cy: 112, r: 18 }, 'tan', { accent: true }),
    s('path', { d: 'M124 94v36M114 102q4 10 0 20M134 102q-4 10 0 20', ...SW(3) }, 'brown', { stroke: true })
  ],
  omitir: [
    s('path', { d: dots([[32, 100], [128, 100]], 16) }, 'blue'),
    s('path', { d: ring(80, 100, 16), ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 74q44-56 88 0M108 72l16 2 2-16', ...SW(6) }, 'orange', { stroke: true, accent: true }),
    ground(124)
  ],
  pagano: [
    s('circle', { cx: 80, cy: 46, r: 18 }, 'yellow', { accent: true }),
    s('path', { d: rects([[30, 72, 18, 64], [70, 72, 18, 64], [110, 72, 18, 64]]) }, 'gray'),
    s('path', { d: rects([[24, 58, 70, 14], [104, 64, 30, 10]]) }, 'gray'),
    s('path', { d: 'M30 90h18M70 100h18M110 86h18', ...SW(2) }, 'dark', { stroke: true }),
    ground()
  ],
  palenque: [
    s('circle', { cx: 122, cy: 36, r: 14 }, 'yellow'),
    s('path', { d: Array.from({ length: 8 }, (_, i) => `M${20 + i * 16} 136v-62l6-10 6 10v62z`).join('') }, 'brown', { accent: true }),
    s('path', { d: 'M16 90h128M16 118h128', ...SW(5) }, 'tan', { stroke: true }),
    ground()
  ],
  pastoreo: [
    backdrop('sky'),
    s('path', { d: 'M14 146v-30q66-40 132 0v30z' }, 'green'),
    s('path', { d: 'M58 100v18M82 100v18', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: ells([[70, 88, 24, 16], [54, 80, 10, 10], [80, 76, 12, 10], [64, 76, 10, 9]]) }, 'white'),
    s('ellipse', { cx: 98, cy: 84, rx: 8, ry: 11 }, 'dark'),
    s('path', { d: 'M126 132V48q0-12-10-12t-10 10', ...SW(5) }, 'brown', { stroke: true, accent: true })
  ],
  pelvis: [
    backdrop('navy'),
    s('path', { d: 'M80 60q-10-28-46-32q-14 32 4 60q10 18 22 30h40q12-12 22-30q18-28 4-60q-36 4-46 32z' }, 'cream', { accent: true }),
    s('path', { d: 'M72 54h16l-3 30h-10z' }, 'tan'),
    s('path', { d: ells([[80, 100, 14, 11], [62, 112, 5, 6], [98, 112, 5, 6]]) }, 'navy')
  ],
  'perturbación': [
    s('path', { d: 'M16 50h44l8-12 8 24 8-24 8 24 8-24 8 24 8-24 8 12', ...SW(5) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M16 82h44l8-12 8 24 8-24 8 24 8-24 8 24 8-24 8 12', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: 'M16 114h44l8-12 8 24 8-24 8 24 8-24 8 24 8-24 8 12', ...SW(5) }, 'navy', { stroke: true }),
    s('path', { d: burst(140, 24, 8, 4, 6) }, 'orange')
  ],
  'perversión': [
    s('circle', { cx: 20, cy: 120, r: 6 }, 'red'),
    s('path', { d: 'M20 120C60 120 60 40 100 40S144 100 104 112S60 64 42 40M40 58V40h18', ...SW(8) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: sparkle(128, 132, 8) }, 'pink')
  ],
  proporcionalmente: [
    s('rect', { x: 24, y: 57, width: 108, height: 79 }, 'sky'),
    s('rect', { x: 24, y: 92, width: 60, height: 44 }, 'blue'),
    s('rect', { x: 24, y: 114, width: 30, height: 22 }, 'navy', { accent: true }),
    s('path', { d: 'M20 139L140 51', ...DASH(3, '6 5') }, 'orange', { stroke: true })
  ],
  provisionalmente: [
    s('path', { d: 'M28 86l-6 50M72 86l6 50', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 16, y: 72, width: 68, height: 16, rx: 3 }, 'orange'),
    s('path', { d: 'M30 74l-8 12M46 74l-8 12M62 74l-8 12M78 74l-8 12', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M98 32q0 30 16 48q-16 18-16 48h32q0-30-16-48q16-18 16-48z' }, 'sky'),
    s('path', { d: 'M102 42h24q-2 16-12 28q-10-12-12-28zM102 126q4-18 12-20q8 2 12 20z' }, 'yellow', { accent: true }),
    s('path', { d: 'M92 30h44M92 130h44', ...SW(5) }, 'dark', { stroke: true })
  ],
  'puñal': [
    s('path', { d: 'M80 16l10 16v58H70V32z', transform: 'rotate(35 80 80)' }, 'gray'),
    s('path', { d: 'M80 30v56', ...SW(2), transform: 'rotate(35 80 80)' }, 'white', { stroke: true }),
    s('rect', { x: 56, y: 90, width: 48, height: 9, rx: 4, transform: 'rotate(35 80 80)' }, 'yellow', { accent: true }),
    s('rect', { x: 74, y: 99, width: 12, height: 30, rx: 3, transform: 'rotate(35 80 80)' }, 'brown'),
    s('circle', { cx: 80, cy: 134, r: 7, transform: 'rotate(35 80 80)' }, 'yellow')
  ],
  rapto: [
    s('path', { d: 'M80 62Q50 18 14 32q24 8 36 32zM80 62q30-44 66-30q-24 8-36 32z' }, 'brown', { accent: true }),
    s('ellipse', { cx: 80, cy: 70, rx: 16, ry: 22 }, 'brown'),
    s('circle', { cx: 80, cy: 46, r: 10 }, 'cream'),
    s('path', { d: 'M76 52l4 8 4-8z' }, 'yellow'),
    s('path', { d: 'M74 90v12M86 90v12', ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 110, r: 7 }, 'skin'),
    s('rect', { x: 72, y: 117, width: 16, height: 22, rx: 5 }, 'sky')
  ],
  redentor: [
    backdrop('sky'),
    s('path', { d: 'M14 146v-18q66-34 132 0v18z' }, 'green'),
    s('path', { d: 'M28 60h104', ...SW(12) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 54h20l8 76H62z' }, 'gray', { accent: true }),
    s('circle', { cx: 80, cy: 42, r: 11 }, 'gray')
  ],
  reelegir: [
    s('rect', { x: 66, y: 34, width: 28, height: 40 }, 'white'),
    outline({ x: 66, y: 34, width: 28, height: 40 }),
    s('path', { d: 'M72 54l6 8 12-14', ...SW(4) }, 'green', { stroke: true }),
    s('rect', { x: 40, y: 78, width: 80, height: 58, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 60, y: 86, width: 40, height: 5 }, 'dark'),
    s('path', { d: 'M136 120a56 56 0 0 0-6-76M118 40l12 4 2-12', ...SW(5) }, 'orange', { stroke: true })
  ],
  'reencarnación': [
    s('path', { d: 'M34 80a46 46 0 0 1 92 0M116 70l10 10 10-10', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M126 80a46 46 0 0 1-92 0M24 90l10-10 10 10', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: ells([[68, 72, 12, 10], [92, 72, 12, 10], [70, 90, 9, 8], [90, 90, 9, 8]]) }, 'purple', { accent: true }),
    s('path', { d: 'M80 66v30M80 66l-6-10M80 66l6-10', ...SW(3) }, 'dark', { stroke: true })
  ],
  rehacer: [
    ground(),
    s('rect', { x: 26, y: 106, width: 44, height: 30, rx: 3 }, 'red', { accent: true }),
    s('rect', { x: 30, y: 78, width: 36, height: 28, rx: 3 }, 'yellow'),
    s('rect', { x: 34, y: 52, width: 28, height: 26, rx: 3 }, 'blue'),
    s('path', { d: 'M124 64a24 24 0 1 1-30 2M84 58l10 8-6 12', ...SW(6) }, 'green', { stroke: true })
  ],
  rehusar: [
    ...person(46, 136, 'blue'),
    s('path', { d: 'M60 98h20', ...SW(8) }, 'blue', { stroke: true }),
    s('rect', { x: 78, y: 80, width: 14, height: 26, rx: 6 }, 'skin'),
    s('ellipse', { cx: 124, cy: 112, rx: 20, ry: 6 }, 'white'),
    s('ellipse', { cx: 124, cy: 112, rx: 20, ry: 6, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[118, 104], [128, 104]], 5) }, 'green'),
    s('path', { d: ring(124, 64, 16) + 'M113 53l22 22', ...SW(5) }, 'red', { stroke: true, accent: true })
  ],
  'remisión': [
    s('path', { d: 'M20 20v116h120', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 36L56 50L84 86L112 108', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: dots([[28, 36], [56, 50], [84, 86]], 5) }, 'red'),
    s('path', { d: heart(124, 104, 14) }, 'green', { accent: true })
  ],
  saborear: [
    ...face(70, 80, 44, 'yellow', 'smile'),
    s('path', { d: 'M48 70q6-6 12 0M80 70q6-6 12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 92, cy: 100, rx: 7, ry: 6 }, 'pink', { accent: true }),
    s('path', { d: 'M116 96l28 18', ...SW(5) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 108, cy: 92, rx: 12, ry: 7, transform: 'rotate(30 108 92)' }, 'gray'),
    s('path', { d: sparkle(124, 36, 10) + sparkle(140, 62, 6) }, 'orange')
  ],
  'subversión': [
    s('rect', { x: 44, y: 40, width: 72, height: 54 }, 'orange'),
    s('path', { d: 'M36 94l44 38 44-38z' }, 'red', { accent: true }),
    s('rect', { x: 70, y: 40, width: 20, height: 26 }, 'brown'),
    s('path', { d: rects([[50, 70, 14, 12], [96, 70, 14, 12]]) }, 'sky'),
    s('path', { d: 'M28 70a52 52 0 0 1 28-50M44 14l12 6-6 12', ...SW(5) }, 'purple', { stroke: true }),
    s('path', { d: 'M14 40h18', ...SW(4) }, 'gray', { stroke: true })
  ],
  sumiso: [
    ground(),
    ...person(118, 136, 'navy', { h: 60, w: 34, r: 15 }),
    ...lean(50, 136, 38, 'tan', { h: 38, w: 26, r: 11, accent: true })
  ],
  'sureño': [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'cream'),
    s('path', { d: ring(80, 80, 56), ...SW(5) }, 'navy', { stroke: true }),
    s('path', { d: rays(80, 80, 44, 52, 4), ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: 'M70 80l10-42 10 42z' }, 'gray'),
    s('path', { d: 'M70 80l10 44 10-44z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 6 }, 'dark')
  ],
  surtido: [
    s('rect', { x: 18, y: 46, width: 124, height: 88, rx: 6 }, 'brown'),
    s('rect', { x: 24, y: 52, width: 112, height: 76, rx: 3 }, 'cream'),
    s('path', { d: dots([[44, 72]], 13) }, 'tan'),
    s('rect', { x: 68, y: 60, width: 24, height: 24, rx: 4 }, 'orange'),
    s('path', { d: heart(116, 72, 13) }, 'pink'),
    s('path', { d: star(44, 110, 15) }, 'yellow', { accent: true }),
    s('path', { d: dots([[80, 108]], 13) }, 'dark'),
    s('rect', { x: 104, y: 96, width: 24, height: 24, rx: 4 }, 'tan')
  ],
  'talibán': [
    s('path', { d: 'M14 96l34-56 24 30 22-26 52 52z' }, 'gray'),
    s('path', { d: 'M40 54l8-14 9 11zM86 54l8-10 8 10z' }, 'white'),
    ...openBook(80, 78, 'cream', 'green'),
    s('path', { d: 'M38 96h30M38 106h30M92 96h30M92 106h30', ...SW(3) }, 'tan', { stroke: true, accent: true })
  ],
  'tazón': [
    s('path', { d: 'M60 52q-8-10 0-20t0-20M80 52q-8-10 0-20t0-20M100 52q-8-10 0-20t0-20', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 60, y: 124, width: 40, height: 10, rx: 3 }, 'navy'),
    s('path', { d: 'M20 70h120q0 58-60 58t-60-58z' }, 'blue', { accent: true }),
    s('ellipse', { cx: 80, cy: 70, rx: 60, ry: 10 }, 'orange'),
    s('path', { d: 'M34 90q46 16 92 0', ...SW(4) }, 'sky', { stroke: true })
  ],
  'telégrafo': [
    s('path', { d: 'M24 112q-10-40 10-60t36-20', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 20, y: 104, width: 120, height: 22, rx: 4 }, 'brown'),
    s('rect', { x: 74, y: 90, width: 12, height: 14 }, 'dark'),
    s('rect', { x: 36, y: 84, width: 96, height: 8, rx: 3 }, 'gray'),
    s('ellipse', { cx: 122, cy: 78, rx: 15, ry: 8 }, 'black', { accent: true }),
    s('path', { d: 'M78 26l-8 14h12l-8 14', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M96 40h10M114 40h4M126 40h10', ...SW(5) }, 'orange', { stroke: true })
  ],
  textualmente: [
    ...paper(18, 24, 54, 72),
    ...paper(88, 64, 54, 72),
    s('path', { d: 'M28 40h34M28 52h34M28 64h22M28 76h30M98 80h34M98 92h34M98 104h22M98 116h30', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M40 108q4 24 38 18M68 116l10 10-12 8', ...SW(5) }, 'orange', { stroke: true, accent: true })
  ],
  tonalidad: [
    s('rect', { x: 18, y: 80, width: 40, height: 56, rx: 4 }, 'sky'),
    s('rect', { x: 60, y: 80, width: 40, height: 56, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 102, y: 80, width: 40, height: 56, rx: 4 }, 'navy'),
    ...note(66, 52, 'purple'),
    s('path', { d: 'M24 64q40-20 80 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  torpedo: [
    backdrop('sky'),
    s('path', { d: 'M34 80l-14-16v32z' }, 'dark'),
    s('path', { d: 'M30 80q0-12 12-12h74q20 0 26 12q-6 12-26 12H42q-12 0-12-12z' }, 'gray', { accent: true }),
    s('rect', { x: 96, y: 68, width: 7, height: 24 }, 'red'),
    s('path', { d: dots([[40, 50], [52, 40], [30, 36], [60, 112], [44, 120]], 4) }, 'white'),
    s('path', { d: 'M14 128q16-8 32 0t32 0 32 0 32 0', ...SW(3) }, 'blue', { stroke: true })
  ],
  trompada: [
    s('path', { d: burst(108, 82, 36, 16, 10) }, 'yellow', { accent: true }),
    s('path', { d: 'M14 56h14M14 82h10M14 108h14', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 22, y: 66, width: 18, height: 34, rx: 3 }, 'red'),
    s('rect', { x: 38, y: 60, width: 56, height: 46, rx: 14 }, 'skin'),
    s('path', { d: 'M94 72h-12M94 84h-12M94 96h-12M52 106q-6-14 10-16h12', ...SW(3) }, 'tan', { stroke: true })
  ],
  trueque: [
    s('circle', { cx: 36, cy: 92, r: 18 }, 'red', { accent: true }),
    s('path', { d: leaflet(36, 74, -60, 14, 5) }, 'green'),
    s('path', { d: 'M104 92l-14-12v24z' }, 'blue'),
    s('ellipse', { cx: 122, cy: 92, rx: 22, ry: 13 }, 'blue'),
    s('circle', { cx: 132, cy: 88, r: 3 }, 'dark'),
    s('path', { d: 'M44 56q36-30 72 0M104 44l12 12-16 4M116 128q-36 26-72 0M56 140l-12-12 16-4', ...SW(5) }, 'orange', { stroke: true })
  ],
  'urbanístico': [
    backdrop('navy'),
    s('path', { d: 'M18 60h124M18 104h124M58 18v124M102 18v124', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: rects([[24, 22, 28, 32], [64, 22, 32, 32], [108, 22, 30, 32], [24, 66, 28, 32], [108, 66, 30, 32], [24, 110, 28, 30], [64, 110, 32, 30], [108, 110, 30, 30]]) }, 'mint'),
    s('rect', { x: 64, y: 66, width: 32, height: 32 }, 'green', { accent: true }),
    s('path', { d: dots([[74, 78], [86, 88]], 5) }, 'mint')
  ],
  'usurpación': [
    s('rect', { x: 34, y: 40, width: 56, height: 70, rx: 8 }, 'red'),
    s('rect', { x: 26, y: 96, width: 72, height: 16, rx: 4 }, 'brown'),
    s('path', { d: 'M32 112v24M92 112v24', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 72l-4-24 12 10 8-14 8 14 12-10-4 24z' }, 'yellow', { accent: true }),
    s('path', { d: 'M146 94h-22', ...SW(12) }, 'skin', { stroke: true }),
    s('path', { d: 'M126 88q-14-6-14 6t14 6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M104 34l-6-8M120 30v-10M134 34l6-8', ...SW(3) }, 'orange', { stroke: true })
  ],
  venerable: [
    s('path', { d: laurel(78, 62, 32) }, 'green', { accent: true }),
    s('rect', { x: 56, y: 84, width: 44, height: 52, rx: 14 }, 'purple'),
    s('circle', { cx: 78, cy: 62, r: 17 }, 'skin'),
    s('path', { d: 'M62 64q16 52 32 0q-16 8-32 0z' }, 'white'),
    s('path', { d: 'M62 64q16 52 32 0q-16 8-32 0z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M116 82v54M116 82q0-12-12-10', ...SW(5) }, 'brown', { stroke: true }),
    ground()
  ],
  virtuoso: [
    s('path', { d: 'M62 64q-16 0-16 18q0 10 8 14q-8 6-8 18q0 22 30 22t30-22q0-12-8-18q8-4 8-14q0-18-16-18z', transform: 'rotate(-20 76 100)' }, 'orange', { accent: true }),
    s('rect', { x: 72, y: 18, width: 8, height: 50, rx: 3, transform: 'rotate(-20 76 100)' }, 'dark'),
    s('path', { d: 'M28 128L138 56', ...SW(4) }, 'tan', { stroke: true }),
    ...note(118, 112, 'purple'),
    s('path', { d: sparkle(126, 30, 12) }, 'yellow')
  ],
  yihadista: [
    s('path', { d: 'M80 20l66 116H14z' }, 'yellow'),
    s('path', { d: 'M80 20l66 116H14z', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 78, cy: 106, r: 20 }, 'black', { accent: true }),
    s('path', { d: 'M90 90q8-14 18-10', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: burst(110, 78, 9, 4, 6) }, 'orange')
  ],
  zas: [
    s('path', { d: burst(80, 80, 64, 34, 12) }, 'yellow'),
    s('path', { d: burst(80, 80, 36, 20, 10) }, 'orange', { accent: true }),
    s('path', { d: dots([[80, 80]], 10) }, 'red')
  ],
  'áspero': [
    s('rect', { x: 22, y: 56, width: 116, height: 76, rx: 4 }, 'tan'),
    s('path', { d: dots(Array.from({ length: 30 }, (_, k) => [34 + (k % 6) * 18 + (Math.floor(k / 6) % 2) * 9, 68 + Math.floor(k / 6) * 13]), 3) }, 'brown', { accent: true }),
    s('path', { d: 'M100 14v34', ...SW(16) }, 'skin', { stroke: true }),
    s('path', { d: 'M30 36l6-8 6 8 6-8 6 8 6-8 6 8M118 30l6-8 6 8 6-8 6 8', ...SW(3) }, 'red', { stroke: true })
  ],
  'aberración': [
    s('path', { d: 'M14 112h132', ...DASH(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[26, 100], [50, 100], [74, 100]], 10) }, 'green'),
    s('path', { d: 'M86 102q16-6 22-36', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: burst(118, 46, 22, 10, 7) }, 'purple', { accent: true })
  ],
  acortar: [
    s('rect', { x: 16, y: 50, width: 78, height: 12, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M102 56L76 40M102 56L76 72M102 56l14-12M102 56l14 12', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: ring(124, 40, 10) + ring(124, 72, 10), ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 92, y: 104, width: 44, height: 12, rx: 3, transform: 'rotate(14 114 110)' }, 'red'),
    s('path', { d: 'M24 120h60M24 112v16M84 112v16', ...SW(3) }, 'blue', { stroke: true })
  ],
  adiestramiento: [
    ground(),
    s('path', { d: 'M62 106v30', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 84l-10 10M76 70l10 12', ...SW(5) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 58, cy: 74, rx: 26, ry: 10, transform: 'rotate(-15 58 74)' }, 'tan'),
    s('circle', { cx: 86, cy: 62, r: 10 }, 'tan'),
    s('ellipse', { cx: 62, cy: 76, rx: 14, ry: 30, ...SW(6) }, 'red', { stroke: true, accent: true }),
    ...person(126, 136, 'blue', { h: 36, w: 24, r: 11 })
  ],
  alberca: [
    s('rect', { x: 24, y: 40, width: 112, height: 90, rx: 10 }, 'sky', { accent: true }),
    s('rect', { x: 24, y: 40, width: 112, height: 90, rx: 10, ...SW(8) }, 'tan', { stroke: true }),
    s('path', { d: 'M28 70h104M28 100h104', ...DASH(3, '8 6') }, 'white', { stroke: true }),
    s('path', { d: 'M110 22v36M126 22v36M110 32h16M110 44h16', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 84q6-4 12 0t12 0M70 116q6-4 12 0t12 0', ...SW(3) }, 'blue', { stroke: true })
  ],
  albino: [
    backdrop('green'),
    s('path', { d: 'M48 72q-12-40 2-46q10 6 6 46zM62 70q2-42 16-42q6 10-6 44z' }, 'white'),
    s('ellipse', { cx: 92, cy: 108, rx: 36, ry: 26 }, 'white'),
    s('circle', { cx: 60, cy: 86, r: 19 }, 'white'),
    s('circle', { cx: 126, cy: 100, r: 9 }, 'white'),
    s('path', { d: 'M51 64q-6-26 0-32M68 64q2-24 8-30', ...SW(4) }, 'pink', { stroke: true }),
    s('circle', { cx: 54, cy: 84, r: 4 }, 'red', { accent: true }),
    s('circle', { cx: 44, cy: 94, r: 3 }, 'pink')
  ],
  alegato: [
    ...person(54, 136, 'navy', { accent: true }),
    s('path', { d: 'M68 96l20-18', ...SW(8) }, 'navy', { stroke: true }),
    s('path', { d: bubble(84, 22, 60, 44) }, 'white'),
    s('path', { d: bubble(84, 22, 60, 44), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 38h36M96 50h26', ...SW(4) }, 'blue', { stroke: true }),
    ground()
  ],
  'alucinación': [
    s('circle', { cx: 66, cy: 96, r: 40 }, 'skin'),
    s('path', { d: spiral(48, 88) + spiral(76, 88), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 116q6-6 12 0t12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M22 40q14-14 28 0t28 0', ...SW(5) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: star(124, 40, 16) }, 'yellow'),
    s('path', { d: dots([[126, 84], [112, 110]], 8) }, 'pink'),
    s('path', { d: sparkle(130, 132, 9) }, 'mint')
  ],
  amarillento: [
    s('path', { d: 'M34 22h74l20 20v96H34z' }, 'cream'),
    s('path', { d: ells([[60, 60, 13, 9], [96, 106, 18, 11], [54, 118, 9, 6]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M46 44h46M46 80h70M46 92h60', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M34 22h74l20 20v96H34z', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M108 22v20h20z' }, 'tan')
  ],
  andante: [
    ground(),
    s('path', { d: 'M66 98l-14 38M76 98l16 38', ...SW(8) }, 'navy', { stroke: true }),
    s('rect', { x: 56, y: 54, width: 28, height: 46, rx: 9 }, 'green', { accent: true }),
    s('circle', { cx: 72, cy: 40, r: 12 }, 'skin'),
    s('path', { d: 'M82 64l16 18', ...SW(7) }, 'green', { stroke: true }),
    s('path', { d: 'M100 72v64', ...SW(4) }, 'brown', { stroke: true }),
    ...note(118, 46, 'purple')
  ],
  animador: [
    ...person(66, 136, 'red', { accent: true }),
    s('path', { d: 'M80 100l16-20', ...SW(8) }, 'red', { stroke: true }),
    s('path', { d: 'M96 82l8-14', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 106, cy: 64, r: 7 }, 'gray'),
    s('path', { d: rects([[28, 30, 6, 10], [112, 30, 6, 10], [134, 80, 6, 10]]) }, 'blue'),
    s('path', { d: dots([[44, 44], [128, 52], [24, 70], [92, 30]], 4) }, 'yellow'),
    s('path', { d: sparkle(60, 22, 8) + sparkle(138, 112, 7) }, 'pink')
  ],
  antisemitismo: [
    s('path', { d: busts([44, 80, 116], 136, 28, 34) }, 'blue'),
    s('path', { d: dots([[44, 90], [80, 90], [116, 90]], 12) }, 'skin'),
    s('path', { d: heart(80, 46, 24) }, 'red', { accent: true }),
    s('path', { d: 'M80 24l-8 12 10 10-8 12 6 10', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M30 30l12 10M130 30l-12 10', ...SW(4) }, 'gray', { stroke: true })
  ],
  antisocial: [
    s('path', { d: busts([28, 56], 136, 24, 30) }, 'green'),
    s('path', { d: dots([[28, 94], [56, 94]], 11) }, 'skin'),
    s('path', { d: bubble(22, 28, 44, 32) }, 'mint'),
    s('path', { d: ring(116, 92, 34), ...DASH(4) }, 'gray', { stroke: true }),
    ...person(116, 124, 'purple', { h: 34, w: 24, r: 11, accent: true }),
    s('path', { d: 'M104 76q12-20 24 0', ...SW(4) }, 'dark', { stroke: true })
  ],
  'astrología': [
    backdrop('navy'),
    s('path', { d: ring(80, 80, 52) + ring(80, 80, 34), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: rays(80, 80, 34, 52, 12), ...SW(2) }, 'yellow', { stroke: true }),
    s('path', { d: 'M88 62a20 20 0 1 0 0 36a16 16 0 1 1 0-36z' }, 'yellow', { accent: true }),
    s('path', { d: sparkle(28, 28, 6) + sparkle(134, 30, 6) + sparkle(132, 132, 6) + sparkle(26, 130, 6) }, 'white')
  ],
  atajo: [
    s('path', { d: 'M28 120q-10-92 52-92t52 92', ...DASH(5, '8 8') }, 'gray', { stroke: true }),
    s('path', { d: 'M30 120h92M112 110l10 10-10 10', ...SW(6) }, 'orange', { stroke: true, accent: true }),
    s('circle', { cx: 28, cy: 120, r: 8 }, 'green'),
    s('circle', { cx: 132, cy: 120, r: 8 }, 'red')
  ],
  automatizar: [
    s('rect', { x: 22, y: 118, width: 48, height: 18, rx: 4 }, 'dark'),
    s('path', { d: 'M46 118V76L96 50', ...SW(14) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: dots([[46, 76], [96, 50]], 8) }, 'gray'),
    s('path', { d: 'M100 50l18 4M100 50l12 16', ...SW(5) }, 'dark', { stroke: true }),
    ...gear(118, 112, 14, 8, 'gray'),
    s('circle', { cx: 118, cy: 112, r: 5 }, 'white')
  ],
  ballestero: [
    s('path', { d: 'M100 36q-20 44 0 88', ...SW(7) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: 'M100 36L80 80L100 124', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 74l-14 4v12l14 4z' }, 'brown'),
    s('rect', { x: 28, y: 74, width: 92, height: 12, rx: 4 }, 'brown'),
    s('path', { d: 'M80 80h56M58 86l4 14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M136 75l10 5-10 5z' }, 'dark')
  ],
  biopsia: [
    s('rect', { x: 20, y: 108, width: 120, height: 20, rx: 3 }, 'sky'),
    outline({ x: 20, y: 108, width: 120, height: 20, rx: 3 }),
    s('ellipse', { cx: 70, cy: 118, rx: 14, ry: 6 }, 'pink', { accent: true }),
    s('path', { d: 'M124 22L90 92M134 28L96 94', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 93, cy: 94, r: 4 }, 'pink')
  ],
  'biólogo': [
    s('circle', { cx: 58, cy: 46, r: 14 }, 'skin'),
    s('rect', { x: 40, y: 62, width: 36, height: 74, rx: 12 }, 'white'),
    outline({ x: 40, y: 62, width: 36, height: 74, rx: 12 }),
    s('path', { d: 'M50 62l8 14 8-14', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 110, cy: 70, r: 18 }, 'mint'),
    s('path', { d: leaflet(100, 80, -45, 24, 7) }, 'green', { accent: true }),
    s('path', { d: ring(110, 70, 18) + 'M97 83L80 100', ...SW(6) }, 'dark', { stroke: true })
  ],
  'bonificación': [
    s('rect', { x: 22, y: 66, width: 84, height: 56, rx: 4 }, 'white'),
    s('path', { d: 'M22 66h84v56H22zM22 66l42 30 42-30', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 116, cy: 108, r: 20 }, 'yellow', { accent: true }),
    s('path', { d: ring(116, 108, 12), ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M118 70V30M106 42l12-12 12 12', ...SW(6) }, 'green', { stroke: true })
  ],
  bronceado: [
    backdrop('sky'),
    s('rect', { x: 14, y: 108, width: 132, height: 38, rx: 0 }, 'yellow'),
    s('circle', { cx: 120, cy: 42, r: 14 }, 'yellow', { accent: true }),
    s('path', { d: rays(120, 42, 20, 28, 8), ...SW(3) }, 'orange', { stroke: true }),
    s('rect', { x: 22, y: 100, width: 96, height: 12, rx: 3 }, 'red'),
    s('rect', { x: 44, y: 86, width: 66, height: 14, rx: 7 }, 'brown'),
    s('circle', { cx: 34, cy: 90, r: 10 }, 'brown'),
    s('rect', { x: 64, y: 86, width: 18, height: 14 }, 'blue')
  ],
  bulevar: [
    s('path', { d: 'M70 40h20l42 100H28z' }, 'gray'),
    s('path', { d: 'M80 50v8M80 70v14M80 98v22', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M30 112v24M46 76v14M57 56v8M130 112v24M114 76v14M103 56v8', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: ells([[30, 96, 16, 18], [46, 66, 10, 12], [57, 50, 6, 7], [130, 96, 16, 18], [114, 66, 10, 12], [103, 50, 6, 7]]) }, 'green', { accent: true })
  ],
  burdel: [
    backdrop('navy'),
    s('rect', { x: 36, y: 50, width: 88, height: 96 }, 'purple'),
    s('path', { d: rects([[46, 62, 22, 22], [92, 62, 22, 22]]) }, 'pink'),
    s('rect', { x: 68, y: 104, width: 24, height: 42 }, 'brown'),
    s('path', { d: 'M114 92v8', ...SW(2) }, 'yellow', { stroke: true }),
    s('ellipse', { cx: 114, cy: 110, rx: 9, ry: 11 }, 'red', { accent: true }),
    s('path', { d: heart(80, 32, 10) }, 'pink')
  ],
  'buró': [
    s('path', { d: 'M44 128v10M116 128v10', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 36, y: 80, width: 88, height: 50, rx: 4 }, 'brown'),
    s('path', { d: 'M42 104h76', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: dots([[80, 93], [80, 117]], 4) }, 'yellow'),
    s('path', { d: 'M72 80l4-24h8l4 24z' }, 'gray'),
    s('path', { d: 'M60 56l8-30h24l8 30z' }, 'yellow', { accent: true })
  ],
  cabellera: [
    s('rect', { x: 40, y: 88, width: 80, height: 50, rx: 20 }, 'pink'),
    s('path', { d: 'M56 52q0-32 24-32t24 32q4 52 16 86H40q12-34 16-86z' }, 'brown', { accent: true }),
    s('path', { d: 'M70 36q-6 44-16 96M90 36q6 44 16 96M80 30v100', ...SW(3) }, 'orange', { stroke: true })
  ],
  campanario: [
    ground(),
    s('rect', { x: 52, y: 52, width: 56, height: 84 }, 'tan'),
    s('path', { d: 'M46 54l34-40 34 40z' }, 'red'),
    s('path', { d: 'M66 104V80a14 14 0 0 1 28 0v24z' }, 'dark'),
    s('path', { d: 'M70 100q2-22 10-22t10 22z' }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 102, r: 3 }, 'yellow')
  ],
  capitalino: [
    ground(),
    s('path', { d: rects([[20, 84, 24, 52], [92, 76, 22, 60]]) }, 'blue'),
    s('path', { d: rects([[44, 62, 24, 74], [114, 94, 26, 42]]) }, 'navy'),
    s('rect', { x: 68, y: 92, width: 24, height: 44 }, 'gray'),
    s('path', { d: grid(49, 70, 2, 5, 5, 6, 10, 12) + grid(96, 84, 2, 4, 5, 6, 9, 12) }, 'yellow'),
    s('path', { d: star(80, 46, 22) }, 'yellow', { accent: true })
  ],
  celulosa: [
    backdrop('green'),
    s('path', { d: grid(22, 22, 4, 4, 26, 26, 30, 30) }, 'mint'),
    s('path', { d: dots([[40, 42], [62, 34], [96, 46], [128, 36], [32, 70], [74, 72], [102, 64], [126, 76], [42, 100], [64, 98], [94, 104], [130, 96], [36, 128], [66, 126], [98, 132], [124, 124]], 5) }, 'green', { accent: true })
  ],
  choza: [
    ground(),
    s('rect', { x: 40, y: 88, width: 80, height: 48 }, 'tan'),
    s('path', { d: 'M70 136v-24a10 10 0 0 1 20 0v24z' }, 'brown'),
    s('path', { d: 'M26 94l54-58 54 58z' }, 'yellow', { accent: true }),
    s('path', { d: 'M44 86l10-12M62 86l10-14M88 86l10-14M106 86l10-12M64 60l8-10M86 60l8-8', ...SW(3) }, 'orange', { stroke: true })
  ],
  cociente: [
    s('path', { d: dots(Array.from({ length: 12 }, (_, i) => [25 + i * 10, 30]), 4) }, 'orange'),
    s('path', { d: 'M38 44v14M80 44v14M122 44v14', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[18, 66, 40, 56], [60, 66, 40, 56], [102, 66, 40, 56]]), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[30, 82], [46, 82], [30, 106], [46, 106], [72, 82], [88, 82], [72, 106], [88, 106], [114, 82], [130, 82], [114, 106], [130, 106]], 7) }, 'orange', { accent: true })
  ],
  comunicacional: [
    s('rect', { x: 34, y: 86, width: 10, height: 22, rx: 3 }, 'dark'),
    s('path', { d: 'M24 64h20l48-26v74L44 86H24z' }, 'red', { accent: true }),
    s('path', { d: 'M104 62a20 20 0 0 1 0 26M114 50a36 36 0 0 1 0 50', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: bubble(104, 14, 40, 28) }, 'sky'),
    s('path', { d: bubble(104, 106, 40, 28) }, 'mint')
  ],
  confidente: [
    ...lean(52, 136, 14, 'blue'),
    ...person(112, 136, 'pink'),
    s('path', { d: 'M74 70q6-8 10 2', ...SW(5) }, 'skin', { stroke: true }),
    s('rect', { x: 72, y: 32, width: 20, height: 16, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M76 32v-5a6 6 0 0 1 12 0v5', ...SW(3) }, 'gray', { stroke: true }),
    ground()
  ],
  contrapartida: [
    s('path', { d: 'M22 50h44v18a10 10 0 1 1 0 20v24H22z' }, 'blue'),
    s('path', { d: 'M72 50h46v62H72V88a10 10 0 1 0 0-20z' }, 'orange', { accent: true }),
    s('path', { d: sparkle(130, 36, 10) + sparkle(30, 128, 8) }, 'yellow')
  ],
  contrapunto: [
    s('path', { d: 'M16 80q32-56 64 0t64 0', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M16 80q32 56 64 0t64 0', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: dots([[24, 66], [48, 52], [102, 108], [126, 96]], 8) }, 'blue'),
    s('path', { d: dots([[24, 94], [48, 108], [102, 52], [126, 64]], 8) }, 'red')
  ],
  contrincante: [
    ...person(40, 136, 'red'),
    ...person(120, 136, 'blue', { accent: true }),
    s('path', { d: 'M54 100l10-12M106 100l-10-12', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: dots([[66, 84]], 9) }, 'red'),
    s('path', { d: dots([[94, 84]], 9) }, 'blue'),
    s('path', { d: sparkle(80, 56, 9) }, 'yellow'),
    ground()
  ],
  conyugal: [
    s('path', { d: ring(64, 92, 28), ...SW(9) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: ring(98, 92, 28), ...SW(9) }, 'orange', { stroke: true }),
    s('path', { d: 'M56 56l8-10 8 10-8 8z' }, 'sky'),
    s('path', { d: heart(118, 38, 10) + heart(34, 42, 8) }, 'pink')
  ],
  cortante: [
    s('rect', { x: 14, y: 70, width: 36, height: 18, rx: 5 }, 'dark'),
    s('path', { d: 'M48 70h76q20 0 22 18H48z' }, 'gray', { accent: true }),
    s('path', { d: 'M54 86h86', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: sparkle(132, 56, 10) }, 'yellow'),
    s('path', { d: 'M46 132a18 18 0 0 1 36 0zM90 132a18 18 0 0 1 36 0z' }, 'red'),
    s('path', { d: dots([[58, 126], [70, 126], [102, 126], [114, 126]], 3) }, 'yellow')
  ],
  costero: [
    backdrop('sky'),
    s('path', { d: 'M14 100q30-8 60 0t72 0v46H14z' }, 'blue'),
    s('path', { d: 'M84 146q16-32 62-38v38z' }, 'yellow'),
    s('path', { d: 'M110 112l4-60h16l4 60z' }, 'white'),
    s('path', { d: rects([[112, 70, 20, 10], [111, 94, 22, 10]]) }, 'red'),
    s('rect', { x: 112, y: 36, width: 20, height: 16, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M24 118q8-6 16 0M50 130q8-6 16 0', ...SW(3) }, 'white', { stroke: true })
  ],
  cromo: [
    s('rect', { x: 26, y: 30, width: 76, height: 108, rx: 8, transform: 'rotate(-12 64 84)' }, 'blue'),
    s('rect', { x: 54, y: 22, width: 80, height: 116, rx: 8 }, 'orange'),
    s('rect', { x: 62, y: 32, width: 64, height: 76, rx: 4 }, 'sky'),
    s('path', { d: busts([94], 108, 40, 30) }, 'navy'),
    s('circle', { cx: 94, cy: 62, r: 12 }, 'navy'),
    s('path', { d: star(114, 122, 9) }, 'yellow', { accent: true }),
    s('path', { d: 'M66 36l18 0-14 22z' }, 'white')
  ],
  'cántico': [
    s('path', { d: busts([40, 80, 120], 136, 30, 40) }, 'purple', { accent: true }),
    s('path', { d: dots([[40, 82], [80, 82], [120, 82]], 13) }, 'skin'),
    s('path', { d: dots([[40, 88], [80, 88], [120, 88]], 4) }, 'dark'),
    ...note(50, 46, 'blue'),
    ...note(98, 36, 'blue')
  ],
  desarmar: [
    s('path', { d: 'M28 128L72 84', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 12, y: 120, width: 30, height: 14, rx: 5, transform: 'rotate(-45 27 127)' }, 'red', { accent: true }),
    ...gear(112, 46, 12, 8, 'gray'),
    s('rect', { x: 92, y: 92, width: 40, height: 26, rx: 4, transform: 'rotate(12 112 105)' }, 'blue'),
    s('path', { d: dots([[40, 40], [62, 54], [44, 70], [140, 136]], 5) }, 'dark'),
    s('path', { d: 'M70 30l14 8M80 120l14-6', ...SW(5) }, 'orange', { stroke: true })
  ],
  desbordar: [
    s('path', { d: 'M58 18h32v10M86 28v20', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 50h56l-8 84H60z' }, 'blue', { accent: true }),
    s('path', { d: 'M50 50h60l-9 86H59z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M50 52q-8 14-4 30M110 52q8 14 4 34', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: drop(42, 100, 5) + drop(120, 108, 5) }, 'blue'),
    s('ellipse', { cx: 80, cy: 140, rx: 56, ry: 6 }, 'sky')
  ],
  desmentir: [
    s('path', { d: bubble(16, 24, 92, 64) }, 'pink'),
    s('path', { d: 'M30 44h60M30 60h44', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: rays(96, 82, 10, 22, 7), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M136 126L104 90', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 138, cy: 128, r: 8 }, 'red', { accent: true })
  ],
  destierro: [
    ground(),
    s('rect', { x: 18, y: 96, width: 34, height: 40 }, 'gray'),
    s('path', { d: 'M14 98l21-22 21 22z' }, 'dark'),
    s('path', { d: 'M66 136V40', ...DASH(4) }, 'red', { stroke: true }),
    ...person(102, 136, 'brown', { accent: true }),
    s('path', { d: 'M112 96L130 66', ...SW(4) }, 'tan', { stroke: true }),
    s('circle', { cx: 132, cy: 62, r: 10 }, 'red')
  ],
  'diabólico': [
    s('path', { d: 'M46 60l-10-38 28 22zM114 60l10-38-28 22z' }, 'dark', { accent: true }),
    ...face(80, 88, 46, 'red', 'smile'),
    s('path', { d: 'M54 70l18 8M106 70l-18 8', ...SW(5) }, 'dark', { stroke: true })
  ],
  'dicotomía': [
    s('path', { d: wedge(72, 80, 50, 90, 270) }, 'dark', { accent: true }),
    s('path', { d: wedge(88, 80, 50, -90, 90) }, 'white'),
    s('path', { d: wedge(88, 80, 50, -90, 90), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[54, 80]], 7) }, 'white'),
    s('path', { d: dots([[106, 80]], 7) }, 'dark')
  ],
  dominico: [
    backdrop('sky'),
    s('path', { d: 'M66 66q-4-30 14-30t14 30z' }, 'black'),
    s('path', { d: 'M62 66h36l14 72H48z' }, 'white'),
    s('path', { d: 'M60 64h40l12 74h-14l-8-58H70l-8 58H48z' }, 'black', { accent: true }),
    s('circle', { cx: 80, cy: 54, r: 12 }, 'skin'),
    s('path', { d: 'M80 82v30', ...SW(3) }, 'brown', { stroke: true })
  ],
  'escenografía': [
    s('rect', { x: 30, y: 28, width: 100, height: 90 }, 'sky'),
    s('circle', { cx: 104, cy: 52, r: 12 }, 'yellow'),
    s('path', { d: 'M30 118q50-44 100 0z' }, 'green'),
    s('rect', { x: 14, y: 116, width: 132, height: 22 }, 'brown'),
    s('path', { d: 'M14 24h32q-8 50 6 96H14zM146 24h-32q8 50-6 96h38z' }, 'red', { accent: true }),
    s('rect', { x: 14, y: 14, width: 132, height: 14 }, 'red')
  ],
  'estría': [
    s('rect', { x: 50, y: 36, width: 60, height: 88 }, 'cream'),
    outline({ x: 50, y: 36, width: 60, height: 88 }, 'tan', 2),
    s('path', { d: 'M60 42v76M72 42v76M84 42v76M96 42v76', ...SW(4) }, 'tan', { stroke: true, accent: true }),
    s('rect', { x: 38, y: 22, width: 84, height: 14, rx: 3 }, 'tan'),
    s('rect', { x: 38, y: 124, width: 84, height: 14, rx: 3 }, 'tan')
  ],
  etanol: [
    s('path', { d: 'M70 50h20v24l28 46q4 12-10 12H52q-14 0-10-12l28-46z' }, 'white'),
    s('path', { d: 'M56 104h48l11 18q3 8-6 8H51q-9 0-6-8z' }, 'sky'),
    s('path', { d: 'M70 50h20v24l28 46q4 12-10 12H52q-14 0-10-12l28-46z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 44v6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: drop(80, 34, 9) }, 'blue', { accent: true }),
    s('path', { d: drop(80, 38, 4) }, 'yellow')
  ],
  evidenciar: [
    s('circle', { cx: 74, cy: 74, r: 36 }, 'cream'),
    s('path', { d: 'M60 84a14 14 0 0 1 28 0M52 86a22 22 0 0 1 44 0M46 90a28 28 0 0 1 56 0M68 82a6 6 0 0 1 12 0', ...SW(3) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: ring(74, 74, 36), ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 100l32 32', ...SW(11) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(126, 32, 9) }, 'yellow')
  ],
  excitar: [
    s('path', { d: 'M66 84l-18-28M94 84l18-28', ...SW(8) }, 'orange', { stroke: true }),
    s('path', { d: 'M72 114l-10 18M88 114l10 18', ...SW(8) }, 'navy', { stroke: true }),
    ...person(80, 116, 'orange', { accent: true }),
    s('path', { d: 'M74 64q6 6 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(30, 40, 10) + sparkle(130, 40, 10) + sparkle(28, 100, 7) + sparkle(132, 100, 7) }, 'yellow'),
    s('path', { d: 'M48 28l-6-10M112 28l6-10M80 24V12', ...SW(4) }, 'pink', { stroke: true })
  ],
  'excéntrico': [
    ...person(80, 136, 'purple', { h: 50, w: 32, r: 14 }),
    s('path', { d: dots([[72, 100], [88, 114], [74, 126]], 4) }, 'yellow'),
    s('rect', { x: 66, y: 20, width: 30, height: 36, rx: 2, transform: 'rotate(14 81 56)' }, 'green', { accent: true }),
    s('rect', { x: 58, y: 52, width: 46, height: 6, rx: 3, transform: 'rotate(14 81 56)' }, 'green'),
    s('path', { d: ring(86, 70, 5) + 'M91 72q8 8 2 20', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 62l18-14', ...SW(4) }, 'pink', { stroke: true }),
    ground()
  ],
  extinguir: [
    s('path', { d: 'M40 56v-14h22l12 10', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 24, y: 56, width: 32, height: 80, rx: 10 }, 'red', { accent: true }),
    s('rect', { x: 28, y: 80, width: 24, height: 18, rx: 3 }, 'white'),
    s('path', { d: drop(122, 118, 14) }, 'orange'),
    s('path', { d: ells([[88, 62, 10, 7], [104, 72, 13, 9], [118, 88, 16, 10], [128, 104, 12, 8]]) }, 'sky'),
    ground()
  ],
  'ferretería': [
    s('rect', { x: 18, y: 20, width: 124, height: 120, rx: 6 }, 'cream'),
    s('path', { d: dots(Array.from({ length: 20 }, (_, k) => [30 + (k % 5) * 25, 32 + Math.floor(k / 5) * 30]), 2.5) }, 'tan'),
    s('path', { d: 'M48 128V66', ...SW(8) }, 'brown', { stroke: true, accent: true }),
    s('rect', { x: 28, y: 50, width: 40, height: 16, rx: 3 }, 'dark'),
    s('path', { d: 'M96 128V70', ...SW(9) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 44a16 16 0 1 0 0 32a16 16 0 1 0 0-32zM90 40h12v18H90z' }, 'gray'),
    s('path', { d: 'M126 80v34M134 90v28', ...SW(3) }, 'dark', { stroke: true })
  ],
  ferviente: [
    s('path', { d: drop(80, 82, 40) }, 'orange'),
    s('path', { d: drop(80, 90, 26) }, 'yellow'),
    s('path', { d: heart(80, 98, 24) }, 'red', { accent: true })
  ],
  'filiación': [
    ...person(54, 136, 'blue', { h: 50, w: 32, r: 14 }),
    ...person(108, 136, 'orange', { h: 28, w: 22, r: 10, accent: true }),
    s('path', { d: 'M70 106q14 6 26 2', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M54 50V34h54v48', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: heart(81, 30, 9) }, 'pink'),
    ground()
  ],
  flan: [
    s('ellipse', { cx: 80, cy: 124, rx: 62, ry: 10 }, 'white'),
    s('ellipse', { cx: 80, cy: 124, rx: 62, ry: 10, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M42 122l12-58h52l12 58z' }, 'yellow', { accent: true }),
    s('path', { d: 'M54 64h52l-2 12q-24 8-48 0z' }, 'brown'),
    s('path', { d: 'M60 76v12M80 80v16M100 76v10', ...SW(5) }, 'brown', { stroke: true })
  ],
  'foráneo': [
    ground(),
    ...person(62, 136, 'green'),
    s('path', { d: 'M76 112h20', ...SW(6) }, 'green', { stroke: true }),
    s('rect', { x: 92, y: 104, width: 32, height: 32, rx: 4 }, 'orange', { accent: true }),
    s('path', { d: 'M102 104v-8h12v8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: jet(120, 42), transform: 'rotate(60 120 42)' }, 'gray'),
    s('path', { d: 'M24 30q30 0 70 10', ...DASH(3) }, 'gray', { stroke: true })
  ],
  fraudulento: [
    s('rect', { x: 18, y: 44, width: 124, height: 72, rx: 6 }, 'green'),
    s('rect', { x: 26, y: 52, width: 108, height: 56, rx: 4 }, 'mint'),
    s('path', { d: 'M48 74q32-16 64 0q4 22-14 22q-10 0-18-10q-8 10-18 10q-18 0-14-22z' }, 'black', { accent: true }),
    s('path', { d: ells([[64, 80, 7, 5], [96, 80, 7, 5]]) }, 'mint'),
    s('path', { d: 'M30 132l100-0', ...SW(4) }, 'red', { stroke: true })
  ],
  friki: [
    s('rect', { x: 54, y: 84, width: 52, height: 52, rx: 14 }, 'green'),
    s('circle', { cx: 80, cy: 58, r: 22 }, 'skin'),
    s('path', { d: 'M58 52q0-28 22-28t22 28q-10-10-22-10t-22 10z' }, 'brown'),
    s('path', { d: ring(70, 60, 8) + ring(90, 60, 8) + 'M78 60h4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 104h56q12 0 12 14t-12 14q-8 0-12-8H64q-4 8-12 8q-12 0-12-14t12-14z' }, 'dark', { accent: true }),
    s('path', { d: dots([[100, 114], [108, 120]], 3) }, 'red')
  ],
  fundamentar: [
    s('rect', { x: 20, y: 108, width: 120, height: 30, rx: 2 }, 'gray', { accent: true }),
    s('path', { d: 'M20 123h120M50 108v15M90 108v15M130 108v15M30 123v15M70 123v15M110 123v15', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 38, y: 68, width: 84, height: 40 }, 'yellow'),
    s('path', { d: 'M30 72l50-42 50 42z' }, 'red'),
    s('rect', { x: 70, y: 84, width: 20, height: 24 }, 'brown')
  ],
  horrendo: [
    s('circle', { cx: 80, cy: 82, r: 56 }, 'green', { accent: true }),
    s('path', { d: ells([[60, 70, 13, 15], [100, 70, 13, 15]]) }, 'white'),
    s('path', { d: dots([[60, 74], [100, 74]], 5) }, 'red'),
    s('path', { d: 'M42 46l26 10M118 46l-26 10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 110l8-10 8 10 8-10 8 10 8-10 8 10 8-10 8 10', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M26 70v14M134 70v14', ...SW(4) }, 'navy', { stroke: true })
  ],
  humildemente: [
    ground(),
    s('rect', { x: 56, y: 82, width: 34, height: 54, rx: 11 }, 'tan', { accent: true }),
    s('circle', { cx: 80, cy: 72, r: 14 }, 'skin'),
    s('path', { d: 'M68 58q12-10 24 2', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 70, y: 96, width: 22, height: 14, rx: 3 }, 'brown'),
    s('ellipse', { cx: 81, cy: 110, rx: 20, ry: 5 }, 'brown'),
    s('path', { d: dots([[70, 106], [92, 106]], 5) }, 'skin')
  ],
  'humorístico': [
    s('circle', { cx: 80, cy: 80, r: 54 }, 'yellow', { accent: true }),
    s('path', { d: 'M54 62q8-10 16 0M90 62q8-10 16 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M50 88h60q-4 32-30 32t-30-32z' }, 'dark'),
    s('ellipse', { cx: 80, cy: 110, rx: 14, ry: 7 }, 'pink'),
    s('path', { d: drop(32, 82, 7) + drop(128, 82, 7) }, 'sky')
  ],
  'inacción': [
    s('path', { d: 'M38 136V76M38 104h44v32', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 46, y: 72, width: 26, height: 32, rx: 8 }, 'gray'),
    s('circle', { cx: 58, cy: 60, r: 12 }, 'skin'),
    s('path', { d: 'M68 102h16v32', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: rects([[104, 60, 12, 40], [124, 60, 12, 40]]) }, 'orange', { accent: true }),
    ground()
  ],
  incurrir: [
    s('path', { d: 'M14 112h50M110 112h36', ...SW(4) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 87, cy: 116, rx: 24, ry: 9 }, 'dark'),
    s('path', { d: 'M74 92l-14-18M100 92l14-18', ...SW(7) }, 'blue', { stroke: true }),
    s('rect', { x: 74, y: 86, width: 26, height: 30, rx: 8 }, 'blue', { accent: true }),
    s('circle', { cx: 87, cy: 72, r: 12 }, 'skin'),
    s('path', { d: 'M76 40l-4-10M88 36V24M100 40l4-10', ...SW(4) }, 'orange', { stroke: true })
  ],
  indeseable: [
    s('path', { d: 'M80 60q-16-14-34-4q-20 14-12 46q8 30 30 34q8 2 16-4q8 6 16 4q22-4 30-34q8-32-12-46q-18-10-34 4z' }, 'brown', { accent: true }),
    s('path', { d: 'M80 60q2-14 10-22', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[60, 90, 8, 6], [100, 106, 10, 7], [88, 80, 5, 4]]) }, 'dark'),
    s('path', { d: ells([[30, 36, 5, 3], [36, 30, 5, 3], [124, 50, 5, 3], [130, 44, 5, 3]]) }, 'sky'),
    s('path', { d: dots([[34, 38], [128, 52]], 3) }, 'black'),
    s('path', { d: 'M54 40q-6-6 0-12M110 34q-6-6 0-12', ...SW(3) }, 'green', { stroke: true })
  ],
  'instauración': [
    s('rect', { x: 40, y: 30, width: 80, height: 106 }, 'cream'),
    outline({ x: 40, y: 30, width: 80, height: 106 }, 'tan'),
    s('path', { d: 'M24 136V80M136 136V80', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 86h112', ...SW(7) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M80 86l-16-12v24zM80 86l16-12v24z' }, 'red'),
    s('path', { d: sparkle(60, 50, 9) + sparkle(104, 48, 7) }, 'yellow')
  ],
  'instrumentación': [
    s('path', { d: 'M30 92l-10-22M62 92l10-22', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 22, y: 98, width: 48, height: 36, rx: 4 }, 'red'),
    s('ellipse', { cx: 46, cy: 98, rx: 24, ry: 7 }, 'cream'),
    s('path', { d: 'M80 64h38', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M116 64l24-16v32z' }, 'yellow', { accent: true }),
    s('path', { d: rects([[88, 52, 5, 10], [98, 52, 5, 10]]) }, 'orange'),
    ...note(104, 124, 'purple')
  ],
  jornalero: [
    ground(),
    s('circle', { cx: 130, cy: 30, r: 12 }, 'orange'),
    ...person(62, 136, 'blue', { h: 48, w: 30, r: 13 }),
    s('ellipse', { cx: 62, cy: 66, rx: 22, ry: 5 }, 'yellow', { accent: true }),
    s('path', { d: 'M52 66q10-16 20 0z' }, 'yellow'),
    s('path', { d: 'M90 136L104 40', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 40h18', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: 'M76 104l18-6', ...SW(7) }, 'blue', { stroke: true })
  ],
  ladilla: [
    s('circle', { cx: 70, cy: 70, r: 46 }, 'sky'),
    s('path', { d: 'M54 64l-14-10-4 6M54 72H36l-2 6M54 80l-14 10-4-4M86 64l14-10 4 6M86 72h18l2 6M86 80l14 10 4-4', ...SW(4) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 70, cy: 72, rx: 18, ry: 14 }, 'tan', { accent: true }),
    s('path', { d: ring(70, 70, 46), ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M104 104l30 30', ...SW(10) }, 'dark', { stroke: true })
  ],
  letrado: [
    s('rect', { x: 18, y: 112, width: 78, height: 20, rx: 3 }, 'navy'),
    s('rect', { x: 24, y: 92, width: 70, height: 20, rx: 3 }, 'red'),
    s('path', { d: 'M28 102h60M24 122h66', ...SW(2) }, 'cream', { stroke: true }),
    s('path', { d: 'M118 36v96M102 134h32M96 44h44', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 44l-8 30M96 44l8 30M140 44l-8 30M140 44l8 30', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 74h20q-2 10-10 10t-10-10zM130 74h20q-2 10-10 10t-10-10z' }, 'yellow', { accent: true })
  ],
  lince: [
    s('path', { d: 'M42 64l-4-40 26 22zM118 64l4-40-26 22z' }, 'tan'),
    s('path', { d: 'M38 26V12M122 26V12', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 96l-8 22 18-6zM120 96l8 22-18-6z' }, 'cream'),
    s('ellipse', { cx: 80, cy: 88, rx: 44, ry: 38 }, 'tan', { accent: true }),
    s('path', { d: ells([[62, 80, 7, 8], [98, 80, 7, 8]]) }, 'green'),
    s('path', { d: 'M72 98h16l-8 9z' }, 'pink'),
    s('path', { d: dots([[54, 108], [106, 108], [80, 60], [64, 58], [96, 58]], 3) }, 'brown')
  ],
  linchamiento: [
    s('path', { d: 'M40 100L46 56M120 100l-6-44', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: drop(46, 48, 8) + drop(114, 48, 8) }, 'orange', { accent: true }),
    s('path', { d: busts([30, 62, 98, 130], 136, 28, 32) }, 'gray'),
    s('path', { d: dots([[30, 96], [62, 92], [98, 92], [130, 96]], 11) }, 'skin'),
    s('path', { d: 'M24 90l8 3M36 90l-8 3M56 86l8 3M68 86l-8 3M92 86l8 3M104 86l-8 3M124 90l8 3M136 90l-8 3', ...SW(2) }, 'dark', { stroke: true })
  ],
};
