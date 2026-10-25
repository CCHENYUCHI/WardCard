// Illustration specs for words still undrawn in batches 0064–0065 (see server/scripts/lexicon/art.js)
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

// Path data: an ear of grain (barley) standing up at x, kernels from y down to y + 60, with long awns
const ear = (x, y) => Array.from({ length: 5 }, (_, k) => leaflet(x, y + 56 - k * 11, -125, 14, 4.5) + leaflet(x, y + 56 - k * 11, -55, 14, 4.5)).join('') + leaflet(x, y + 6, -90, 14, 4.5);
const awns = (x, y) => Array.from({ length: 5 }, (_, k) => { const yy = y + 56 - k * 11; return `M${x - 8} ${yy - 11}l-8 -26M${x + 8} ${yy - 11}l8 -26`; }).join('') + `M${x} ${y - 8}v-24`;

module.exports = {
  brigadier: [
    ground(),
    ...person(80, 136, 'green', { h: 62, w: 42, r: 17, accent: true }),
    s('path', { d: 'M60 50q20-26 40 0zM56 46h48v7H56z' }, 'navy'),
    s('path', { d: star(66, 84, 7) + star(94, 84, 7) }, 'yellow'),
    s('path', { d: rects([[64, 100, 10, 6], [78, 100, 10, 6], [64, 110, 10, 6]]) }, 'red')
  ],
  brutalidad: [
    ground(),
    s('path', { d: burst(78, 108, 42, 22, 12) }, 'red', { accent: true }),
    s('path', { d: 'M54 122l14-16 8 18zM92 102l16 10-10 14zM66 134l22-8 6 10z' }, 'brown'),
    s('path', { d: 'M136 24L100 62', ...SW(9) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 92, cy: 70, rx: 20, ry: 12, transform: 'rotate(-45 92 70)' }, 'brown'),
    s('path', { d: 'M118 74l14 6M112 88l18 10M34 70l12 10', ...SW(4) }, 'gray', { stroke: true })
  ],
  'burgués': [
    ground(),
    ...person(64, 136, 'navy', { accent: true }),
    s('path', { d: rects([[52, 40, 24, 24], [46, 62, 36, 5]]) }, 'black'),
    s('path', { d: 'M58 92l6 14 6-14z' }, 'white'),
    s('path', { d: 'M116 102q-18 12-16 28q2 6 16 6h12q14 0 16-6q2-16-16-28z' }, 'tan'),
    s('path', { d: 'M116 102l-6-10h22l-6 10z' }, 'brown'),
    s('circle', { cx: 122, cy: 122, r: 7 }, 'yellow')
  ],
  caleta: [
    backdrop('green'),
    s('path', { d: 'M38 146q-6-62 42-72q48 10 42 72', ...SW(10) }, 'tan', { stroke: true }),
    s('path', { d: 'M38 146q-6-62 42-72q48 10 42 72z' }, 'sky'),
    s('path', { d: 'M68 118h26l-5 8H73z' }, 'brown'),
    s('path', { d: 'M80 98v18l12-4z' }, 'red', { accent: true }),
    s('path', { d: 'M56 134q6-4 12 0M90 136q6-4 12 0M100 106q6-4 12 0', ...SW(3) }, 'white', { stroke: true })
  ],
  'codificación': [
    ...paper(14, 52, 44, 56),
    s('path', { d: 'M22 66h28M22 78h28M22 90h20', ...SW(3) }, 'gray', { stroke: true }),
    arrow('M64 80h22m-8-8 8 8-8 8'),
    s('rect', { x: 94, y: 52, width: 48, height: 56, rx: 3 }, 'white'),
    outline({ x: 94, y: 52, width: 48, height: 56, rx: 3 }),
    s('path', { d: checker(98, 56, 5, 6, 8) }, 'navy', { accent: true })
  ],
  'concertación': [
    s('rect', { x: 20, y: 112, width: 120, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M30 122v14M130 122v14', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: busts([36], 112, 32, 34) }, 'blue'),
    s('path', { d: busts([124], 112, 32, 34) }, 'green'),
    s('path', { d: dots([[36, 64], [124, 64]], 12) }, 'skin'),
    s('path', { d: 'M48 94q18-8 32-4M112 94q-18-8-32-4', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(80, 58, 12) }, 'yellow', { accent: true })
  ],
  'consejería': [
    ground(),
    s('path', { d: 'M24 58L80 26l56 32z' }, 'brown'),
    s('rect', { x: 30, y: 58, width: 100, height: 78 }, 'tan', { accent: true }),
    s('path', { d: grid(44, 68, 3, 1, 16, 18, 28, 0) }, 'sky'),
    s('rect', { x: 68, y: 100, width: 24, height: 36, rx: 2 }, 'brown'),
    s('path', { d: 'M80 32V12', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 12h18l-4 5 4 5H80z' }, 'green')
  ],
  conservatorio: [
    ground(),
    s('path', { d: 'M20 56L80 22l60 34z' }, 'brown'),
    s('path', { d: rects([[30, 58, 10, 68], [54, 58, 10, 68], [96, 58, 10, 68], [120, 58, 10, 68]]) }, 'gray'),
    s('rect', { x: 22, y: 124, width: 116, height: 12 }, 'dark'),
    s('rect', { x: 70, y: 96, width: 20, height: 28, rx: 2 }, 'brown'),
    ...note(76, 84, 'purple')
  ],
  constatar: [
    ...paper(22, 20, 82, 112),
    s('path', { d: 'M34 40h58M34 56h58M34 72h40', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 104, cy: 92, r: 24 }, 'sky'),
    s('path', { d: ring(104, 92, 24) + 'M121 109l20 20', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M93 92l8 9 15-17', ...SW(6) }, 'green', { stroke: true, accent: true })
  ],
  contradictorio: [
    ...person(80, 136, 'gray'),
    s('path', { d: bubble(14, 18, 56, 42) }, 'green'),
    s('path', { d: 'M28 40l8 8 16-16', ...SW(6) }, 'white', { stroke: true }),
    s('rect', { x: 90, y: 18, width: 56, height: 42, rx: 8 }, 'red', { accent: true }),
    s('path', { d: 'M106 58l-6 14 18-14z' }, 'red'),
    s('path', { d: 'M108 29l20 20M128 29l-20 20', ...SW(6) }, 'white', { stroke: true })
  ],
  'corán': [
    s('path', { d: 'M46 136l64-40M114 136L50 96', ...SW(7) }, 'brown', { stroke: true }),
    ...openBook(80, 44, 'cream', 'green'),
    s('path', { d: 'M36 66h36M88 66h36M36 80h36M88 80h36M36 94h28M88 94h28', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 108v24l-5-6-5 6v-24z' }, 'yellow', { accent: true })
  ],
  'cáscara': [
    ground(134),
    s('path', { d: 'M80 94q-6-26 4-38q10 14 4 38z' }, 'yellow'),
    s('path', { d: 'M68 106q-26-6-36 24q16-10 30-6zM92 106q26-6 36 24q-16-10-30-6z' }, 'yellow'),
    s('path', { d: 'M64 134q-4-32 16-42q20 10 16 42z' }, 'yellow', { accent: true }),
    s('path', { d: 'M70 130q-2-22 10-30q12 8 10 30z' }, 'cream'),
    s('rect', { x: 77, y: 84, width: 6, height: 8, rx: 2 }, 'brown')
  ],
  demente: [
    s('path', { d: 'M40 74q-14-30 6-44l8 12 8-22 12 18 10-22 10 22 12-18 8 22 8-12q20 14 6 44z' }, 'brown'),
    s('circle', { cx: 80, cy: 88, r: 42 }, 'skin'),
    s('path', { d: spiral(60, 80) + spiral(94, 80), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 110q5-6 11 0t11 0t11 0t11 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(24, 36, 9) + sparkle(138, 40, 8) + sparkle(134, 128, 7) }, 'yellow', { accent: true })
  ],
  'desagüe': [
    backdrop('mint'),
    s('circle', { cx: 80, cy: 80, r: 44 }, 'gray'),
    s('path', { d: rects([[56, 58, 48, 6], [48, 72, 64, 6], [48, 86, 64, 6], [56, 100, 48, 6]]) }, 'dark'),
    s('path', { d: 'M22 80a58 58 0 0 1 58-58M138 80a58 58 0 0 1-58 58', ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M76 22l6-6M84 138l-6 6', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: drop(34, 124, 6) + drop(126, 40, 6) }, 'blue')
  ],
  disperso: [
    s('path', { d: rays(80, 80, 16, 40, 8, 22.5), ...SW(4) }, 'orange', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 80, r: 9 }, 'red'),
    s('path', { d: dots([[24, 30], [130, 24], [28, 128], [136, 132], [80, 22]], 8) }, 'blue'),
    s('path', { d: dots([[18, 82], [142, 84], [82, 140], [52, 52], [116, 112]], 7) }, 'purple')
  ],
  dividendo: [
    s('path', { d: wedge(80, 56, 40, -90, 30) }, 'green', { accent: true }),
    s('path', { d: wedge(84, 60, 40, 30, 150) }, 'yellow'),
    s('path', { d: wedge(76, 60, 40, 150, 270) }, 'blue'),
    s('path', { d: 'M48 98l-8 12M80 102v8M112 98l8 12', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[36, 126], [80, 126], [124, 126]], 13) }, 'yellow'),
    s('path', { d: ring(36, 126, 8) + ring(80, 126, 8) + ring(124, 126, 8), ...SW(3) }, 'orange', { stroke: true })
  ],
  dramaturgo: [
    s('path', { d: 'M76 24q30-10 60 0q2 40-30 52q-32-12-30-52z' }, 'blue'),
    s('path', { d: 'M22 48q30-10 60 0q2 40-30 52q-32-12-30-52z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[96, 40], [116, 40], [42, 64], [62, 64]], 5) }, 'dark'),
    s('path', { d: 'M96 62q10-8 20 0M40 78q12 10 24 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 140q8-36 46-60q-6 36-40 60z' }, 'purple'),
    s('path', { d: 'M94 142l22-30', ...SW(2) }, 'dark', { stroke: true })
  ],
  'dígito': [
    s('path', { d: 'M60 90V46M78 88V36M96 90V46', ...SW(14) }, 'skin', { stroke: true }),
    s('rect', { x: 50, y: 82, width: 58, height: 54, rx: 16 }, 'skin'),
    s('path', { d: 'M54 106q16 6 28-2M104 96q-6 4-10 4', ...SW(4) }, 'tan', { stroke: true }),
    s('rect', { x: 56, y: 130, width: 46, height: 14, rx: 3 }, 'blue'),
    s('path', { d: dots([[60, 26], [78, 16], [96, 26]], 5) }, 'orange', { accent: true })
  ],
  empanada: [
    s('ellipse', { cx: 80, cy: 118, rx: 64, ry: 14 }, 'gray'),
    s('path', { d: 'M22 112a58 58 0 0 1 116 0z' }, 'tan', { accent: true }),
    s('path', { d: 'M24 112a56 56 0 0 1 112 0', ...SW(9, { 'stroke-dasharray': '3 9' }) }, 'brown', { stroke: true }),
    s('path', { d: 'M22 112h116', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M64 42q-6-8 0-16M80 38q-6-8 0-16M96 42q-6-8 0-16', ...SW(3) }, 'gray', { stroke: true })
  ],
  encerrar: [
    s('rect', { x: 22, y: 20, width: 116, height: 116 }, 'cream'),
    ...person(80, 136, 'orange'),
    s('path', { d: 'M22 20h116M34 20v116M58 20v116M82 20v116M106 20v116M130 20v116', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 88v-6a7 7 0 0 1 14 0v6', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 96, y: 88, width: 22, height: 18, rx: 3 }, 'yellow', { accent: true })
  ],
  enriquecer: [
    ground(),
    ...person(46, 136, 'green'),
    s('path', { d: rects([[78, 112, 18, 24], [100, 92, 18, 44], [122, 68, 18, 68]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M78 120h18M78 128h18M100 100h18M100 108h18M100 116h18M100 124h18M122 76h18M122 84h18M122 92h18M122 100h18M122 108h18M122 116h18M122 124h18', ...SW(2) }, 'orange', { stroke: true }),
    arrow('M70 82l38-48m-14 0 14 0 0 14', 'green', 6),
    s('path', { d: sparkle(34, 34, 9) }, 'yellow')
  ],
  envolver: [
    s('path', { d: 'M120 58l22-24v66l-22 36z' }, 'pink'),
    s('rect', { x: 38, y: 58, width: 82, height: 78, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M79 58v78M38 96h82', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'yellow', { stroke: true }),
    s('path', { d: ells([[66, 48, 14, 9], [92, 48, 14, 9]]) }, 'yellow'),
    s('circle', { cx: 79, cy: 52, r: 6 }, 'orange'),
    s('path', { d: dots([[130, 60], [134, 80], [128, 98]], 3) }, 'white')
  ],
  epicentro: [
    s('rect', { x: 14, y: 72, width: 132, height: 74 }, 'brown'),
    s('rect', { x: 14, y: 64, width: 132, height: 10 }, 'green'),
    s('path', { d: 'M58 64a22 22 0 0 1 44 0M42 64a38 38 0 0 1 76 0M26 64a54 54 0 0 1 108 0', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M80 108V72', ...DASH(3, '5 5') }, 'yellow', { stroke: true }),
    s('path', { d: burst(80, 118, 16, 7, 8) }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 64, r: 6 }, 'red')
  ],
  'equivocación': [
    ...paper(22, 18, 84, 110),
    s('path', { d: 'M36 38h56M36 54h56M36 70h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M42 86l26 26M68 86l-26 26', ...SW(7) }, 'red', { stroke: true, accent: true }),
    s('rect', { x: 96, y: 100, width: 50, height: 24, rx: 4, transform: 'rotate(-30 120 112)' }, 'pink'),
    s('rect', { x: 96, y: 100, width: 16, height: 24, rx: 2, transform: 'rotate(-30 120 112)' }, 'blue'),
    s('path', { d: dots([[104, 138], [116, 140], [96, 132]], 2.5) }, 'gray')
  ],
  'erróneamente': [
    ground(),
    s('path', { d: 'M46 112l-10 24M78 112l10 24', ...SW(5) }, 'brown', { stroke: true }),
    s('circle', { cx: 62, cy: 74, r: 42 }, 'red'),
    s('circle', { cx: 62, cy: 74, r: 28 }, 'white'),
    s('circle', { cx: 62, cy: 74, r: 14 }, 'red', { accent: true }),
    s('path', { d: 'M20 22q70-14 118 80', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M122 136l18-34', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M140 102l-2-12 8 4zM140 102l6-10 4 8z' }, 'orange')
  ],
  estomagar: [
    ground(),
    s('rect', { x: 54, y: 86, width: 52, height: 50, rx: 16 }, 'blue'),
    ...face(80, 58, 26, 'mint', 'frown'),
    s('path', { d: 'M58 98q4 20 22 18M102 98q-4 20-22 18', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: spiral(77, 100), ...SW(3) }, 'red', { stroke: true, accent: true }),
    s('path', { d: drop(114, 44, 5) }, 'sky')
  ],
  etiquetado: [
    s('rect', { x: 34, y: 46, width: 66, height: 88, rx: 12 }, 'sky'),
    s('rect', { x: 38, y: 32, width: 58, height: 16, rx: 4 }, 'red'),
    s('rect', { x: 34, y: 72, width: 66, height: 36 }, 'yellow', { accent: true }),
    s('path', { d: 'M96 54q14 10 22 36', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 98l14-14h22v32h-22z' }, 'orange'),
    s('circle', { cx: 120, cy: 98, r: 3 }, 'white'),
    s('path', { d: 'M46 84h42M46 96h28', ...SW(4) }, 'brown', { stroke: true })
  ],
  'fisiología': [
    s('circle', { cx: 80, cy: 32, r: 16 }, 'sky'),
    s('path', { d: 'M44 64q36-18 72 0v58H44z' }, 'sky'),
    s('path', { d: ells([[66, 84, 12, 20], [94, 84, 12, 20]]) }, 'pink'),
    s('path', { d: heart(84, 92, 10) }, 'red', { accent: true }),
    s('path', { d: 'M18 134h30l6-12 8 22 6-10h74', ...SW(4) }, 'green', { stroke: true })
  ],
  gatillo: [
    s('path', { d: ring(80, 88, 26), ...DASH(3) }, 'yellow', { stroke: true }),
    s('rect', { x: 24, y: 46, width: 112, height: 24, rx: 4 }, 'dark'),
    s('path', { d: 'M36 68h28l-8 56H28z' }, 'brown'),
    s('path', { d: 'M64 70q0 30 24 30q6 0 6-10V70', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M78 72q-2 12 4 20', ...SW(6) }, 'red', { stroke: true, accent: true })
  ],
  grada: [
    s('path', { d: 'M14 136v-24h33V88h33V64h33V40h33v96z' }, 'gray'),
    s('path', { d: busts([24, 38], 112, 12, 14) }, 'blue'),
    s('path', { d: busts([57, 71], 88, 12, 14) }, 'red', { accent: true }),
    s('path', { d: busts([90, 104], 64, 12, 14) }, 'green'),
    s('path', { d: busts([123, 137], 40, 12, 14) }, 'orange'),
    s('path', { d: dots([[24, 92], [38, 92], [57, 68], [71, 68], [90, 44], [104, 44], [123, 20], [137, 20]], 6) }, 'skin')
  ],
  guiso: [
    s('path', { d: dots([[56, 66], [104, 66], [80, 62]], 9) }, 'orange'),
    s('circle', { cx: 68, cy: 62, r: 6 }, 'green'),
    s('path', { d: 'M30 74h100v42q0 20-20 20H50q-20 0-20-20z' }, 'red', { accent: true }),
    s('rect', { x: 24, y: 68, width: 112, height: 10, rx: 5 }, 'dark'),
    s('path', { d: 'M24 90h-8M136 90h8', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 46q-8-10 0-20M80 42q-8-10 0-20M102 46q-8-10 0-20', ...SW(4) }, 'gray', { stroke: true })
  ],
  haitiano: [
    s('rect', { x: 14, y: 86, width: 132, height: 50 }, 'sky'),
    s('circle', { cx: 34, cy: 34, r: 12 }, 'yellow'),
    s('path', { d: 'M18 104q6-14 16-12l12-26 14 20 12-30 16 30q10 0 12 18z' }, 'green'),
    s('path', { d: 'M16 104h88q-4 10-14 10H30q-10 0-14-10z' }, 'tan'),
    ...person(122, 136, 'blue', { accent: true })
  ],
  hermosura: [
    s('path', { d: 'M64 76q-2-26 16-26t16 26v18H64z' }, 'brown'),
    ...lady(80, 136, 'pink', { accent: true }),
    s('path', { d: sparkle(40, 50, 10) + sparkle(122, 42, 8) + sparkle(126, 100, 6) + sparkle(34, 104, 6) }, 'yellow')
  ],
  impaciente: [
    ground(),
    ...person(54, 136, 'purple'),
    s('path', { d: 'M58 136l18-6', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 120l8-4M84 130h10', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 116, cy: 50, r: 24 }, 'white'),
    s('path', { d: ring(116, 50, 24) + 'M116 50V36M116 50l10 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: burst(76, 62, 9, 4, 6) }, 'red', { accent: true })
  ],
  'improvisación': [
    s('path', { d: 'M66 24h12v80q0 18 16 18t16-16v-6h-6l14-26 14 26h-8v6q0 34-30 34T66 104z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[72, 50], [72, 66], [72, 82]], 3.5) }, 'orange'),
    s('path', { d: 'M66 24l-12-8', ...SW(5) }, 'dark', { stroke: true }),
    ...note(28, 76, 'purple'),
    s('ellipse', { cx: 118, cy: 50, rx: 7, ry: 5 }, 'blue'),
    s('path', { d: 'M124 50V26l10 6', ...SW(3) }, 'blue', { stroke: true })
  ],
  incipiente: [
    s('circle', { cx: 126, cy: 36, r: 14 }, 'yellow'),
    s('path', { d: 'M14 146v-42q66-18 132 0v42z' }, 'brown'),
    s('ellipse', { cx: 80, cy: 102, rx: 10, ry: 6 }, 'tan'),
    s('path', { d: 'M80 98V68', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 72, -150, 28, 9) + leaflet(80, 68, -30, 28, 9) }, 'green', { accent: true })
  ],
  inclusivo: [
    s('path', { d: ring(80, 84, 48), ...SW(6) }, 'green', { stroke: true, accent: true }),
    s('path', { d: dots([[80, 36], [80, 132]], 14) }, 'blue'),
    s('path', { d: dots([[121.6, 60], [38.4, 108]], 14) }, 'red'),
    s('path', { d: dots([[121.6, 108], [38.4, 60]], 14) }, 'yellow'),
    s('path', { d: dots([[80, 36], [80, 132], [121.6, 60], [38.4, 108], [121.6, 108], [38.4, 60]], 7) }, 'skin'),
    s('path', { d: heart(80, 86, 14) }, 'pink')
  ],
  incompetente: [
    s('rect', { x: 40, y: 88, width: 32, height: 48, rx: 10 }, 'blue'),
    ...face(56, 70, 16, 'skin', 'frown'),
    s('path', { d: 'M66 100l24-18', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 82, y: 66, width: 26, height: 12, rx: 2, transform: 'rotate(-35 95 72)' }, 'dark'),
    s('rect', { x: 100, y: 104, width: 44, height: 32 }, 'tan'),
    s('path', { d: 'M120 104v-10l8-6M134 104l2-8-8-4', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: burst(72, 100, 12, 5, 7) }, 'red', { accent: true })
  ],
  infidelidad: [
    s('path', { d: heart(80, 66, 36) }, 'red', { accent: true }),
    s('path', { d: 'M80 34l-8 18 12 14-10 16 8 14-2 6', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: ring(80, 128, 11), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M74 116l6-8 6 8z' }, 'sky')
  ],
  inquieto: [
    ground(),
    ...person(80, 136, 'orange', { accent: true }),
    s('path', { d: 'M50 70q-8 14 0 28M38 64q-10 20 0 40M110 70q8 14 0 28M122 64q10 20 0 40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: drop(100, 62, 4) + drop(58, 58, 3.5) }, 'sky'),
    s('path', { d: 'M66 140l-6 4M94 140l6 4', ...SW(3) }, 'gray', { stroke: true })
  ],
  insostenible: [
    ground(),
    s('path', { d: 'M68 136l-2-56h28l-2 56z' }, 'gray'),
    s('path', { d: 'M76 84l10 14-6 12 10 14', ...SW(3) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 80, cy: 56, rx: 54, ry: 28 }, 'brown', { accent: true }),
    s('path', { d: 'M50 44q12-8 24-4', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M54 102l-14 6M106 102l14 6M54 118l-14 2M106 118l14 2', ...SW(4) }, 'red', { stroke: true })
  ],
  intensivo: [
    s('path', { d: 'M22 110v26M110 110v26', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 16, y: 98, width: 100, height: 14, rx: 4 }, 'gray'),
    s('circle', { cx: 32, cy: 88, r: 10 }, 'skin'),
    s('rect', { x: 44, y: 86, width: 70, height: 16, rx: 6 }, 'sky'),
    s('path', { d: 'M126 56v80', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 102, y: 22, width: 44, height: 36, rx: 4 }, 'dark'),
    s('path', { d: 'M106 42h8l4-10 6 20 4-10h14', ...SW(3) }, 'green', { stroke: true, accent: true })
  ],
  interrogante: [
    ground(),
    ...person(50, 136, 'blue'),
    s('path', { d: 'M62 104q12-8 10-20', ...SW(8) }, 'blue', { stroke: true }),
    s('path', { d: 'M96 44c0-24 40-24 40 0 0 14-20 14-20 34', ...SW(10) }, 'purple', { stroke: true, accent: true }),
    s('circle', { cx: 116, cy: 98, r: 6 }, 'purple'),
    s('path', { d: dots([[74, 62], [84, 52]], 4) }, 'gray')
  ],
  irreal: [
    backdrop('navy'),
    s('path', { d: 'M36 78q44 74 88 0z' }, 'brown'),
    s('ellipse', { cx: 80, cy: 78, rx: 46, ry: 10 }, 'green'),
    s('path', { d: rects([[62, 44, 14, 30], [84, 36, 14, 38]]) }, 'pink', { accent: true }),
    s('path', { d: 'M60 44l9-14 9 14zM82 36l9-14 9 14z' }, 'red'),
    s('path', { d: ells([[34, 122, 14, 8], [48, 118, 12, 10], [118, 128, 14, 8], [132, 124, 10, 8]]) }, 'white'),
    s('path', { d: sparkle(30, 34, 8) + sparkle(130, 40, 7) + sparkle(124, 92, 5) }, 'yellow')
  ],
  jaguar: [
    s('path', { d: 'M36 86q-22-4-20 34', ...SW(7) }, 'orange', { stroke: true }),
    s('path', { d: 'M50 106v28M64 108v28M94 108v28M106 106v28', ...SW(9) }, 'orange', { stroke: true }),
    s('ellipse', { cx: 76, cy: 92, rx: 44, ry: 22 }, 'orange', { accent: true }),
    s('path', { d: 'M114 64l4-12 8 8zM132 62l6-10 2 12z' }, 'orange'),
    s('circle', { cx: 124, cy: 78, r: 18 }, 'orange'),
    s('path', { d: dots([[50, 84], [64, 96], [78, 82], [92, 98], [104, 84], [62, 76], [88, 72], [44, 98], [114, 94]], 3.5) }, 'dark'),
    s('path', { d: dots([[130, 74]], 3) + 'M138 82l4 4-4 2z' }, 'dark')
  ],
  jerga: [
    s('path', { d: busts([38], 136, 40, 40) }, 'green'),
    s('path', { d: busts([122], 136, 40, 40) }, 'purple'),
    s('path', { d: dots([[38, 82], [122, 82]], 14) }, 'skin'),
    s('path', { d: bubble(14, 14, 62, 42) }, 'sky'),
    s('path', { d: 'M24 34q5-10 10 0t10 0t10 0t10 0', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 86, y: 14, width: 60, height: 42, rx: 8 }, 'yellow', { accent: true }),
    s('path', { d: 'M122 56l6 12-16-12z' }, 'yellow'),
    s('path', { d: star(104, 35, 9) + spiral(122, 36) }, 'red')
  ],
  'joyería': [
    backdrop('navy'),
    s('path', { d: 'M30 30q50 90 100 0', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: drop(80, 88, 9) }, 'red', { accent: true }),
    s('path', { d: ring(52, 120, 12), ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M44 104l8-10 8 10-8 6z' }, 'sky'),
    s('path', { d: sparkle(112, 112, 9) + sparkle(130, 128, 5) + sparkle(28, 74, 5) }, 'white')
  ],
  largamente: [
    s('path', { d: rects([[50, 18, 60, 8], [50, 96, 60, 8]]) }, 'brown'),
    s('path', { d: 'M58 26h44l-18 35 18 35H58l18-35z' }, 'sky'),
    s('path', { d: 'M64 32h32l-16 22zM62 96l18-14 18 14z' }, 'yellow', { accent: true }),
    arrow('M20 124h120m-10-10 10 10-10 10M20 114v20', 'orange', 5),
    s('path', { d: 'M50 120v8M80 120v8M110 120v8', ...SW(3) }, 'gray', { stroke: true })
  ],
  lentitud: [
    ground(),
    s('path', { d: 'M18 134q0-10 10-10h56v-26h10v28q0 8-8 8z' }, 'tan'),
    s('path', { d: 'M88 98l-4-10M94 98l4-10', ...SW(3) }, 'tan', { stroke: true }),
    s('circle', { cx: 54, cy: 104, r: 22 }, 'orange', { accent: true }),
    s('path', { d: 'M54 104a4 4 0 0 1 8 0a8 8 0 0 1-16 0a12 12 0 0 1 24 0', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M70 60a40 40 0 0 1 80 0z' }, 'gray'),
    s('path', { d: 'M110 60L80 50', ...SW(4) }, 'red', { stroke: true }),
    s('circle', { cx: 110, cy: 60, r: 5 }, 'dark')
  ],
  liso: [
    s('path', { d: 'M40 66q0-46 40-46t40 46v74H40z' }, 'brown', { accent: true }),
    ...face(80, 72, 26, 'skin', 'smile'),
    s('path', { d: 'M54 62q0-30 26-30t26 30q-26-12-52 0z' }, 'brown'),
    s('path', { d: 'M48 74v58M112 74v58', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: sparkle(132, 40, 8) }, 'yellow')
  ],
  mediocridad: [
    s('path', { d: wedge(80, 96, 62, 180, 240) }, 'red'),
    s('path', { d: wedge(80, 96, 62, 240, 300) }, 'yellow', { accent: true }),
    s('path', { d: wedge(80, 96, 62, 300, 360) }, 'green'),
    s('path', { d: 'M80 96V46', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 96, r: 7 }, 'dark'),
    ...face(80, 126, 14, 'skin', 'flat')
  ],
  'náusea': [
    ...face(80, 66, 42, 'mint', 'flat'),
    s('ellipse', { cx: 80, cy: 90, rx: 18, ry: 10 }, 'skin'),
    s('path', { d: 'M36 18q10-8 20 0M104 18q10-8 20 0', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M14 128q11-10 22 0t22 0t22 0t22 0t22 0t22 0M14 142q11-10 22 0t22 0t22 0t22 0t22 0t22 0', ...SW(5) }, 'blue', { stroke: true, accent: true })
  ],
  odisea: [
    backdrop('sky'),
    s('path', { d: 'M108 56q14-20 30 0z' }, 'green'),
    s('path', { d: 'M74 102q34 6 40-20t10-24', ...DASH(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M24 104h52l-8 14H32z' }, 'brown'),
    s('path', { d: 'M50 104V52', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 56v42l24-6z' }, 'red', { accent: true }),
    s('path', { d: 'M18 130q8-6 16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0', ...SW(4) }, 'white', { stroke: true })
  ],
  olfato: [
    s('path', { d: 'M38 60q-16 12-8 44q12-6 18-26z' }, 'brown'),
    s('circle', { cx: 58, cy: 82, r: 30 }, 'tan'),
    s('ellipse', { cx: 90, cy: 94, rx: 24, ry: 14 }, 'tan'),
    s('circle', { cx: 112, cy: 88, r: 7 }, 'dark'),
    s('circle', { cx: 66, cy: 74, r: 4 }, 'dark'),
    s('path', { d: 'M124 64q6-6 12 0t10 0M124 84q6-6 12 0t10 0M124 104q6-6 12 0t10 0', ...SW(3) }, 'purple', { stroke: true, accent: true })
  ],
  palmera: [
    s('path', { d: 'M24 140q56-24 112 0z' }, 'tan'),
    s('path', { d: 'M78 132q-6-50 6-86', ...SW(10) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(84, 44, -160, 46, 10) + leaflet(84, 44, -115, 38, 9) + leaflet(84, 44, -65, 38, 9) + leaflet(84, 44, -20, 46, 10) + leaflet(84, 44, 30, 38, 8) + leaflet(84, 44, 150, 38, 8) }, 'green', { accent: true }),
    s('path', { d: dots([[78, 54], [90, 54]], 6) }, 'brown')
  ],
  'panteón': [
    ground(),
    s('path', { d: 'M38 66a42 42 0 0 1 84 0z' }, 'gray'),
    s('path', { d: 'M20 78L80 50l60 28z' }, 'tan', { accent: true }),
    s('path', { d: rects([[28, 78, 10, 46], [50, 78, 10, 46], [72, 78, 10, 46], [94, 78, 10, 46], [116, 78, 10, 46]]) }, 'cream'),
    s('path', { d: rects([[28, 78, 10, 46], [50, 78, 10, 46], [72, 78, 10, 46], [94, 78, 10, 46], [116, 78, 10, 46]]), ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 20, y: 124, width: 120, height: 12 }, 'dark')
  ],
  parentesco: [
    s('path', { d: ells([[80, 66, 64, 50]]) }, 'green', { accent: true }),
    s('path', { d: 'M80 136V96M80 96L46 66M80 96l34-30M80 96V44', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: dots([[46, 66], [114, 66], [80, 38]], 14) }, 'skin'),
    s('path', { d: dots([[80, 96]], 10) }, 'skin'),
    s('path', { d: dots([[41, 64], [51, 64], [109, 64], [119, 64], [75, 36], [85, 36], [76, 94], [84, 94]], 2) }, 'dark')
  ],
  pasarela: [
    s('path', { d: 'M64 30h32l42 110H22z' }, 'gray'),
    s('path', { d: dots([[60, 46], [100, 46], [52, 72], [108, 72], [42, 98], [118, 98], [32, 124], [128, 124]], 4) }, 'yellow'),
    ...lady(80, 120, 'red', { accent: true }),
    s('path', { d: sparkle(24, 30, 9) + sparkle(136, 30, 9) }, 'yellow')
  ],
  'paño': [
    s('rect', { x: 14, y: 116, width: 132, height: 20, rx: 4 }, 'tan'),
    s('path', { d: 'M30 70l20-24h80l-10 24z' }, 'sky'),
    s('path', { d: 'M30 70h90l10 46H40z' }, 'blue', { accent: true }),
    s('path', { d: 'M38 84h84M42 100h84', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: sparkle(28, 32, 9) + sparkle(142, 92, 6) }, 'yellow')
  ],
  pergamino: [
    s('rect', { x: 38, y: 34, width: 84, height: 90 }, 'cream'),
    s('path', { d: 'M38 34h84v90H38z', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: rects([[28, 24, 104, 16], [28, 118, 104, 16]]) }, 'brown'),
    s('path', { d: 'M50 56h60M50 70h60M50 84h36M50 98h28', ...SW(3) }, 'tan', { stroke: true }),
    s('circle', { cx: 104, cy: 100, r: 10 }, 'red', { accent: true })
  ],
  pillo: [
    ground(),
    ...person(60, 136, 'green', { h: 36, w: 26, r: 12 }),
    s('path', { d: 'M48 82q12-18 24 0zM68 78h12v4H68z' }, 'red', { accent: true }),
    s('path', { d: 'M55 90q5 4 10 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M70 112l22-6', ...SW(7) }, 'green', { stroke: true }),
    s('path', { d: 'M100 136v-28M100 108l-8-16M100 108l8-16', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M92 92q8 8 16 0', ...SW(2) }, 'dark', { stroke: true }),
    s('circle', { cx: 120, cy: 70, r: 5 }, 'gray')
  ],
  planeamiento: [
    backdrop('mint'),
    s('path', { d: 'M14 64h132M14 104h132M58 14v132M106 14v132', ...SW(9, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('path', { d: rects([[22, 22, 28, 34], [66, 22, 32, 34], [114, 72, 26, 24], [22, 112, 28, 28], [114, 112, 26, 28]]) }, 'sky'),
    s('circle', { cx: 82, cy: 84, r: 14 }, 'green'),
    s('path', { d: drop(82, 118, 10) }, 'red', { accent: true }),
    s('circle', { cx: 82, cy: 118, r: 4 }, 'white')
  ],
  'privación': [
    ground(),
    ...person(48, 136, 'gray'),
    s('path', { d: 'M60 102l14-4', ...SW(7) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 82, cy: 96, rx: 14, ry: 9, ...DASH(2, '4 4') }, 'gray', { stroke: true }),
    s('ellipse', { cx: 124, cy: 92, rx: 18, ry: 11 }, 'tan'),
    arrow('M96 70h36m-8-8 8 8-8 8', 'red', 5)
  ],
  proletariado: [
    s('path', { d: 'M14 112V72l30-20v20l30-20v20l30-20v60z' }, 'gray'),
    s('rect', { x: 112, y: 34, width: 14, height: 78 }, 'dark'),
    s('path', { d: ells([[124, 24, 10, 7], [136, 16, 8, 6]]) }, 'gray'),
    s('path', { d: busts([40, 80, 120], 146, 30, 30) }, 'blue', { accent: true }),
    s('path', { d: dots([[40, 104], [80, 104], [120, 104]], 11) }, 'skin'),
    s('path', { d: 'M27 101a13 13 0 0 1 26 0zM67 101a13 13 0 0 1 26 0zM107 101a13 13 0 0 1 26 0z' }, 'yellow')
  ],
  'psiquiátrico': [
    ground(),
    s('rect', { x: 26, y: 60, width: 108, height: 76 }, 'mint'),
    s('path', { d: grid(36, 72, 4, 2, 14, 14, 24, 26) }, 'sky'),
    s('rect', { x: 70, y: 108, width: 20, height: 28 }, 'brown'),
    s('circle', { cx: 80, cy: 38, r: 22 }, 'white'),
    outline({ cx: 80, cy: 38, r: 22 }),
    s('path', { d: ells([[73, 40, 10, 10], [87, 40, 10, 10], [80, 32, 12, 9]]) }, 'pink', { accent: true }),
    s('path', { d: 'M80 26v24M72 36q4 4 0 8M88 36q-4 4 0 8', ...SW(2) }, 'red', { stroke: true })
  ],
  pulpo: [
    s('path', { d: 'M52 80q-22 22-10 46q6-6 4-10M64 86q-8 26 0 44q6-4 2-10M80 88v48M96 86q8 26 0 44q-6-4-2-10M108 80q22 22 10 46q-6-6-4-10', ...SW(9) }, 'purple', { stroke: true }),
    s('ellipse', { cx: 80, cy: 56, rx: 38, ry: 36 }, 'purple', { accent: true }),
    s('path', { d: dots([[66, 62], [94, 62]], 8) }, 'white'),
    s('path', { d: dots([[68, 63], [96, 63]], 4) }, 'dark'),
    s('path', { d: dots([[62, 34], [76, 28]], 3) }, 'pink')
  ],
  radicalismo: [
    s('rect', { x: 14, y: 104, width: 132, height: 32 }, 'brown'),
    s('path', { d: 'M66 104q14 8 28 0', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 88v-34M80 88l-16 20M80 88l16 22M80 88l-4 26M72 100l-10 2M90 102l10 0', ...SW(5), transform: 'rotate(12 80 70)' }, 'brown', { stroke: true }),
    s('circle', { cx: 86, cy: 40, r: 26, transform: 'rotate(12 80 70)' }, 'green'),
    arrow('M124 92V34m-10 10 10-10 10 10', 'red', 7),
    s('path', { d: dots([[40, 120], [118, 124], [26, 112]], 3) }, 'tan', { accent: true })
  ],
  ras: [
    s('rect', { x: 14, y: 112, width: 132, height: 24 }, 'green'),
    s('ellipse', { cx: 84, cy: 96, rx: 50, ry: 9 }, 'blue', { accent: true }),
    s('path', { d: 'M44 96l-10-22h12l16 22z' }, 'blue'),
    s('path', { d: 'M78 98l-16 12h22l16-12z' }, 'navy'),
    s('path', { d: dots([[100, 94], [112, 94], [88, 94]], 3) }, 'white'),
    s('path', { d: 'M14 106h132', ...DASH(2, '4 4') }, 'red', { stroke: true }),
    s('path', { d: 'M16 86h14M20 98h8', ...SW(3) }, 'gray', { stroke: true })
  ],
  'ratificación': [
    ...paper(22, 18, 88, 118),
    s('path', { d: 'M34 38h64M34 52h64M34 66h46', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 104q8-12 14 0t14-4t12 2', ...SW(3) }, 'navy', { stroke: true }),
    s('circle', { cx: 92, cy: 108, r: 15 }, 'red', { accent: true }),
    s('path', { d: star(92, 108, 7) }, 'yellow'),
    s('path', { d: 'M144 34l-34 52', ...SW(7) }, 'dark', { stroke: true })
  ],
  realeza: [
    ground(),
    ...person(52, 136, 'purple', { accent: true }),
    ...person(108, 136, 'red'),
    s('path', { d: 'M40 68l2-18 8 8 2-12 4 12 8-8 2 18zM96 68l2-14 6 6 4-10 4 10 6-6 2 14z' }, 'yellow'),
    s('path', { d: rects([[46, 98, 12, 4], [102, 98, 12, 4]]) }, 'yellow')
  ],
  reclutar: [
    ground(),
    ...person(40, 136, 'navy'),
    s('rect', { x: 52, y: 96, width: 20, height: 26, rx: 2 }, 'tan', { accent: true }),
    s('path', { d: 'M56 104h12M56 112h8', ...SW(2) }, 'brown', { stroke: true }),
    ...person(106, 136, 'green', { h: 32, w: 20, r: 9 }),
    ...person(134, 136, 'orange', { h: 32, w: 20, r: 9 }),
    arrow('M130 70h-40m10-10-10 10 10 10', 'gray', 5)
  ],
  recolectar: [
    ground(),
    s('path', { d: 'M40 136V90', ...SW(10) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 44, cy: 60, rx: 34, ry: 30 }, 'green'),
    s('path', { d: dots([[30, 50], [56, 46], [40, 74], [62, 70], [72, 120], [84, 116], [96, 120]], 7) }, 'red'),
    s('path', { d: 'M60 126h48l-6 14H66z' }, 'brown', { accent: true }),
    ...person(122, 136, 'orange'),
    s('path', { d: 'M110 100L74 72', ...SW(8) }, 'orange', { stroke: true })
  ],
  recopilar: [
    s('path', { d: rects([[18, 18, 26, 32], [67, 14, 26, 32], [116, 18, 26, 32]]) }, 'white'),
    s('path', { d: rects([[18, 18, 26, 32], [67, 14, 26, 32], [116, 18, 26, 32]]) + 'M24 28h14M24 36h14M73 24h14M73 32h14M122 28h14M122 36h14', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 56l14 12M80 50v14M124 56l-14 12', ...SW(4) }, 'orange', { stroke: true }),
    s('rect', { x: 50, y: 72, width: 60, height: 66, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: 'M56 86h-10M56 104h-10M56 122h-10', ...SW(4) }, 'gray', { stroke: true })
  ],
  repasar: [
    ...openBook(80, 72),
    s('path', { d: 'M34 98h36', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M59 52A24 24 0 1 1 68 61', ...SW(6) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M56 46l-2 10 10 2', ...SW(5) }, 'green', { stroke: true })
  ],
  'retribución': [
    s('rect', { x: 62, y: 46, width: 52, height: 30, rx: 3 }, 'green', { accent: true }),
    s('circle', { cx: 88, cy: 58, r: 7 }, 'mint'),
    s('rect', { x: 54, y: 64, width: 68, height: 40, rx: 3 }, 'tan'),
    s('path', { d: 'M54 64l34 22 34-22', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M28 112q30-6 50 0h40q10 0 10 9t-10 9H64q-20 0-36-4z' }, 'skin'),
    s('rect', { x: 14, y: 106, width: 18, height: 30, rx: 3 }, 'blue'),
    s('path', { d: dots([[136, 60], [140, 90]], 7) }, 'yellow')
  ],
  retro: [
    s('rect', { x: 20, y: 40, width: 120, height: 80, rx: 8 }, 'orange', { accent: true }),
    s('rect', { x: 32, y: 50, width: 96, height: 38, rx: 4 }, 'cream'),
    s('rect', { x: 50, y: 58, width: 60, height: 22, rx: 11 }, 'dark'),
    s('path', { d: dots([[62, 69], [98, 69]], 7) }, 'white'),
    s('path', { d: 'M44 120l8-20h56l8 20z' }, 'brown'),
    s('path', { d: dots([[28, 48], [132, 48], [28, 112], [132, 112]], 2.5) }, 'dark')
  ],
  'revocación': [
    ...paper(24, 24, 80, 112),
    s('path', { d: 'M36 44h56M36 60h56M36 76h40', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 84, cy: 112, r: 12 }, 'red'),
    arrow('M108 40h14q18 0 18 24t-18 24h-14m10-10-10 10 10 10', 'orange', 6),
    s('path', { d: 'M18 136L110 24', ...SW(8) }, 'red', { stroke: true, accent: true })
  ],
  'sartén': [
    s('path', { d: 'M104 66l38-26', ...SW(12) }, 'black', { stroke: true }),
    s('circle', { cx: 64, cy: 92, r: 48 }, 'black'),
    s('circle', { cx: 64, cy: 92, r: 40 }, 'dark'),
    s('path', { d: 'M40 86q0-22 24-20q26-4 26 18q6 24-22 26q-30 2-28-24z' }, 'white'),
    s('circle', { cx: 64, cy: 88, r: 11 }, 'yellow', { accent: true })
  ],
  seducir: [
    ground(),
    ...lady(46, 136, 'red', { accent: true }),
    s('path', { d: 'M56 98l18-12', ...SW(6) }, 'red', { stroke: true }),
    ...person(120, 136, 'blue'),
    s('path', { d: 'M78 80q20-20 30-30', ...DASH(3) }, 'pink', { stroke: true }),
    s('path', { d: heart(120, 46, 10) + heart(96, 54, 6) + heart(140, 32, 6) }, 'pink')
  ],
  silueta: [
    backdrop('orange'),
    s('circle', { cx: 80, cy: 98, r: 36 }, 'yellow'),
    s('rect', { x: 14, y: 118, width: 132, height: 28 }, 'black'),
    s('circle', { cx: 80, cy: 58, r: 12 }, 'black'),
    s('rect', { x: 65, y: 74, width: 30, height: 46, rx: 10 }, 'black', { accent: true }),
    s('path', { d: birds([[36, 40], [124, 32]]), ...SW(3) }, 'black', { stroke: true })
  ],
  simulacro: [
    ground(),
    s('circle', { cx: 38, cy: 40, r: 20 }, 'red', { accent: true }),
    s('circle', { cx: 38, cy: 40, r: 6 }, 'dark'),
    s('path', { d: 'M12 22l6 6M12 58l6-6M64 22l-6 6M64 58l-6-6', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: drop(116, 56, 18), ...DASH(3, '5 5') }, 'orange', { stroke: true }),
    ...person(60, 136, 'yellow', { h: 36, w: 24, r: 10 }),
    ...person(92, 136, 'blue', { h: 36, w: 24, r: 10 }),
    arrow('M110 118h28m-8-8 8 8-8 8', 'green', 5)
  ],
  'supremacía': [
    ground(),
    s('path', { d: rects([[22, 104, 24, 32], [52, 92, 24, 44], [114, 98, 24, 38]]) }, 'gray'),
    s('rect', { x: 82, y: 48, width: 26, height: 88 }, 'purple', { accent: true }),
    s('path', { d: 'M80 44l2-20 8 8 5-14 5 14 8-8 2 20z' }, 'yellow')
  ],
  taberna: [
    s('rect', { x: 14, y: 100, width: 132, height: 36, rx: 3 }, 'brown'),
    s('rect', { x: 22, y: 50, width: 48, height: 50, rx: 16 }, 'tan'),
    s('path', { d: 'M24 62h44M24 88h44', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M70 76h10v8', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M126 70h6q8 0 8 8v8q0 8-8 8h-6', ...SW(5) }, 'yellow', { stroke: true }),
    s('rect', { x: 96, y: 60, width: 32, height: 40, rx: 4 }, 'yellow', { accent: true }),
    s('path', { d: ells([[104, 58, 9, 7], [118, 58, 10, 7]]) }, 'cream')
  ],
  tara: [
    arrow('M80 20v30m-9-9 9 9 9-9', 'red', 6),
    s('path', { d: 'M44 60h72l-6 38H50z' }, 'tan', { accent: true }),
    s('path', { d: 'M44 60h72', ...SW(3) }, 'brown', { stroke: true }),
    s('rect', { x: 24, y: 98, width: 112, height: 10, rx: 4 }, 'dark'),
    s('path', { d: 'M30 108h100l-8 28H38z' }, 'gray'),
    s('rect', { x: 66, y: 116, width: 28, height: 12, rx: 2 }, 'sky')
  ],
  'timón': [
    s('path', { d: rays(80, 80, 0, 58, 8), ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: ring(80, 80, 44), ...SW(10) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: dots(around(80, 80, 60, 8), 7) }, 'brown'),
    s('circle', { cx: 80, cy: 80, r: 14 }, 'tan'),
    s('circle', { cx: 80, cy: 80, r: 5 }, 'dark')
  ],
  tolerante: [
    s('path', { d: busts([42], 140, 40, 40) }, 'green', { accent: true }),
    ...face(42, 82, 18, 'skin', 'smile'),
    s('path', { d: busts([118], 140, 40, 40) }, 'gray'),
    ...face(118, 82, 18, 'skin', 'frown'),
    s('path', { d: burst(116, 34, 20, 11, 8) }, 'red'),
    s('path', { d: heart(42, 38, 11) }, 'pink')
  ],
  tribal: [
    ground(),
    s('ellipse', { cx: 80, cy: 34, rx: 36, ry: 10 }, 'cream'),
    s('path', { d: 'M44 34q0 34 22 48l-6 54h40l-6-54q22-14 22-48z' }, 'brown', { accent: true }),
    s('path', { d: 'M48 54l8 8 8-8 8 8 8-8 8 8 8-8 8 8 8-8', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M66 108l7 7 7-7 7 7 7-7', ...SW(4) }, 'red', { stroke: true }),
    s('ellipse', { cx: 80, cy: 34, rx: 36, ry: 10, ...SW(2) }, 'tan', { stroke: true })
  ],
  vector: [
    s('path', { d: 'M28 140V18m-6 8 6-8 6 8M20 132h122m-8-6 8 6-8 6', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M114 48v84M28 48h86', ...DASH(2, '5 5') }, 'gray', { stroke: true }),
    arrow('M30 130L112 50m-20 0 20 0 0 20', 'red', 7),
    s('circle', { cx: 28, cy: 132, r: 5 }, 'dark', { accent: true })
  ],
  'vibración': [
    s('rect', { x: 54, y: 24, width: 52, height: 108, rx: 9 }, 'dark'),
    s('rect', { x: 60, y: 36, width: 40, height: 80, rx: 3 }, 'sky', { accent: true }),
    s('circle', { cx: 80, cy: 124, r: 4 }, 'gray'),
    s('path', { d: 'M42 48l-8 10 8 10-8 10 8 10M118 48l8 10-8 10 8 10-8 10', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M24 52q-8 26 0 52M136 52q8 26 0 52', ...SW(4) }, 'gray', { stroke: true })
  ],
  'ártico': [
    backdrop('sky'),
    s('path', { d: 'M18 112l14-12h96l14 12-10 14H28z' }, 'white'),
    s('path', { d: 'M18 112l14-12h96l14 12-10 14H28z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M56 90v14M70 92v12M92 92v12M104 90v14', ...SW(8) }, 'cream', { stroke: true }),
    s('ellipse', { cx: 80, cy: 82, rx: 32, ry: 15 }, 'cream', { accent: true }),
    s('circle', { cx: 114, cy: 72, r: 12 }, 'cream'),
    s('path', { d: dots([[108, 62], [118, 70], [124, 74]], 2.5) }, 'dark'),
    s('path', { d: sparkle(34, 36, 8) + sparkle(120, 30, 6) }, 'white')
  ],
  alcantarillado: [
    s('path', { d: rects([[22, 22, 30, 28], [100, 14, 36, 36]]) }, 'tan'),
    s('rect', { x: 14, y: 50, width: 132, height: 8 }, 'gray'),
    s('rect', { x: 14, y: 58, width: 132, height: 88 }, 'brown'),
    s('path', { d: 'M70 58v38M118 58v66', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 96h132M60 124h86', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 98h132M60 126h86', ...SW(5, { 'stroke-linecap': 'butt' }) }, 'blue', { stroke: true, accent: true }),
    s('ellipse', { cx: 70, cy: 50, rx: 12, ry: 4 }, 'dark')
  ],
  allegado: [
    s('path', { d: heart(80, 40, 12) }, 'pink', { accent: true }),
    s('path', { d: busts([46, 114], 140, 36, 44) }, 'blue'),
    s('path', { d: busts([80], 140, 36, 46) }, 'orange'),
    s('path', { d: dots([[46, 84], [114, 84], [80, 80]], 14) }, 'skin'),
    s('path', { d: 'M34 116q46-18 92 0', ...SW(7) }, 'skin', { stroke: true })
  ],
  alzar: [
    ground(),
    ...person(80, 136, 'blue'),
    s('path', { d: 'M68 98l-8-40M92 98l8-40', ...SW(8) }, 'blue', { stroke: true }),
    s('rect', { x: 48, y: 24, width: 64, height: 34, rx: 3 }, 'orange', { accent: true }),
    s('path', { d: 'M24 94V54m-8 8 8-8 8 8M136 94V54m-8 8 8-8 8 8', ...SW(5) }, 'green', { stroke: true })
  ],
  'anomalía': [
    s('path', { d: dots([[32, 32], [64, 32], [96, 32], [128, 32], [32, 64], [64, 64], [128, 64], [32, 96], [64, 96], [96, 96], [128, 96], [32, 128], [64, 128], [96, 128], [128, 128]], 11) }, 'blue'),
    s('path', { d: ring(96, 64, 22), ...DASH(3, '4 4') }, 'gray', { stroke: true }),
    s('rect', { x: 84, y: 52, width: 24, height: 24, rx: 3, transform: 'rotate(20 96 64)' }, 'red', { accent: true })
  ],
  'antelación': [
    s('rect', { x: 22, y: 30, width: 116, height: 106, rx: 8 }, 'white'),
    outline({ x: 22, y: 30, width: 116, height: 106, rx: 8 }),
    s('rect', { x: 22, y: 30, width: 116, height: 24, rx: 8 }, 'red'),
    s('path', { d: 'M48 20v18M112 20v18', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: grid(34, 64, 5, 3, 14, 14, 20, 22) }, 'gray'),
    s('rect', { x: 110, y: 104, width: 18, height: 18, rx: 3 }, 'blue', { accent: true }),
    s('path', { d: 'M112 100q-30-26-56-30', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M66 64l-10 6 10 6', ...SW(4) }, 'green', { stroke: true })
  ],
  anteproyecto: [
    ...paper(20, 22, 106, 112),
    s('path', { d: 'M40 116V80l34-28 34 28v36z', ...DASH(3, '6 5') }, 'blue', { stroke: true }),
    s('path', { d: 'M64 116V96h18v20', ...DASH(3, '4 4') }, 'blue', { stroke: true }),
    s('path', { d: 'M100 136l36-36', ...SW(10) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M96 140l4-4', ...SW(5) }, 'dark', { stroke: true })
  ],
  aparentar: [
    ...face(64, 76, 40, 'skin', 'frown'),
    s('path', { d: 'M66 54q28-10 56 0q2 38-28 50q-30-12-28-50z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[84, 68], [104, 68]], 5) }, 'dark'),
    s('path', { d: 'M82 84q12 10 24 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M110 100l18 38', ...SW(5) }, 'brown', { stroke: true })
  ],
  balneario: [
    s('path', { d: ells([[30, 110, 16, 10], [130, 110, 16, 10], [50, 132, 18, 9], [110, 132, 18, 9]]) }, 'gray'),
    s('ellipse', { cx: 80, cy: 114, rx: 54, ry: 20 }, 'sky', { accent: true }),
    s('circle', { cx: 80, cy: 98, r: 14 }, 'skin'),
    s('path', { d: 'M66 94q14-18 28 0z' }, 'pink'),
    s('path', { d: 'M48 70q-8-10 0-20t0-20M80 64q-8-10 0-20t0-20M112 70q-8-10 0-20t0-20', ...SW(4) }, 'gray', { stroke: true })
  ],
  brevedad: [
    s('rect', { x: 70, y: 22, width: 20, height: 14, rx: 3 }, 'dark'),
    s('circle', { cx: 80, cy: 88, r: 48 }, 'white'),
    s('path', { d: wedge(80, 88, 42, -90, -60) }, 'red', { accent: true }),
    s('path', { d: ring(80, 88, 48) + 'M80 88L101 52', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M120 44l8-8', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 88, r: 5 }, 'dark')
  ],
  cebada: [
    s('path', { d: 'M80 136V92M80 136q-8-30-26-52M80 136q8-30 26-52', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: awns(80, 40), ...SW(2) }, 'yellow', { stroke: true }),
    s('path', { d: ear(80, 40) }, 'yellow', { accent: true }),
    s('path', { d: awns(80, 40), ...SW(2), transform: 'rotate(-24 80 136)' }, 'orange', { stroke: true }),
    s('path', { d: ear(80, 40), transform: 'rotate(-24 80 136)' }, 'orange'),
    s('path', { d: awns(80, 40), ...SW(2), transform: 'rotate(24 80 136)' }, 'orange', { stroke: true }),
    s('path', { d: ear(80, 40), transform: 'rotate(24 80 136)' }, 'orange')
  ],
  chorizo: [
    s('rect', { x: 18, y: 94, width: 124, height: 42, rx: 6 }, 'tan'),
    s('path', { d: 'M30 52q24-14 50 0', ...SW(24) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M90 56q22-10 44 6', ...SW(24) }, 'red', { stroke: true }),
    s('path', { d: 'M84 50v12', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 62, cy: 114, r: 16 }, 'red'),
    s('circle', { cx: 100, cy: 116, r: 14 }, 'red'),
    s('path', { d: dots([[56, 110], [66, 118], [64, 106], [96, 112], [104, 120]], 2.5) }, 'cream')
  ],
  'citación': [
    s('rect', { x: 16, y: 56, width: 90, height: 62, rx: 3 }, 'white'),
    outline({ x: 16, y: 56, width: 90, height: 62, rx: 3 }),
    s('path', { d: 'M16 56l45 34 45-34', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 61, cy: 92, r: 8 }, 'red'),
    s('path', { d: 'M118 46l20 52', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 96, y: 28, width: 44, height: 18, rx: 4, transform: 'rotate(-21 118 37)' }, 'brown', { accent: true }),
    s('ellipse', { cx: 120, cy: 128, rx: 22, ry: 7 }, 'dark')
  ],
  coliseo: [
    ground(),
    s('path', { d: 'M18 78q62-44 124 0v52q-62 22-124 0z' }, 'tan', { accent: true }),
    s('path', { d: 'M100 56l42 22V50q-20-10-42 6z' }, 'white'),
    s('path', { d: grid(24, 84, 9, 2, 8, 14, 14, 22) }, 'brown'),
    s('path', { d: 'M18 78q62-40 124 0', ...SW(3) }, 'brown', { stroke: true })
  ],
  comilla: [
    s('path', { d: bubble(18, 22, 124, 96) }, 'sky'),
    s('path', { d: dots([[54, 52], [76, 52]], 9) }, 'navy', { accent: true }),
    s('path', { d: 'M46 54q0 14-8 22M68 54q0 14-8 22', ...SW(6) }, 'navy', { stroke: true }),
    s('path', { d: dots([[86, 86], [108, 86]], 9) }, 'navy'),
    s('path', { d: 'M94 84q0-14 8-22M116 84q0-14 8-22', ...SW(6) }, 'navy', { stroke: true })
  ],
  contencioso: [
    s('path', { d: busts([28], 140, 30, 36) }, 'blue'),
    s('path', { d: busts([132], 140, 30, 36) }, 'red'),
    s('path', { d: dots([[28, 90], [132, 90]], 12) }, 'skin'),
    s('path', { d: 'M54 30l14 10-8 6 16 12M106 30l-14 10 8 6-16 12', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M80 98l10 34', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 58, y: 80, width: 44, height: 18, rx: 4, transform: 'rotate(-16 80 89)' }, 'brown', { accent: true }),
    s('ellipse', { cx: 80, cy: 138, rx: 22, ry: 6 }, 'dark')
  ],
  contraparte: [
    s('path', { d: 'M46 108v28M114 108v28', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 38, y: 100, width: 84, height: 10, rx: 3 }, 'brown'),
    s('path', { d: busts([26], 140, 32, 42) }, 'blue'),
    s('path', { d: busts([134], 140, 32, 42) }, 'green', { accent: true }),
    s('path', { d: dots([[26, 84], [134, 84]], 13) }, 'skin'),
    s('path', { d: 'M52 62h56m-10-8 10 8-10 8M62 54l-10 8 10 8', ...SW(4) }, 'orange', { stroke: true })
  ],
  convenientemente: [
    s('rect', { x: 26, y: 60, width: 104, height: 76, rx: 6 }, 'blue'),
    s('path', { d: 'M78 60v20M78 120v16M26 100h36M94 100h36', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M62 80h8a8 8 0 0 1 16 0h8v40H62z' }, 'yellow'),
    s('circle', { cx: 124, cy: 40, r: 18 }, 'green', { accent: true }),
    s('path', { d: 'M115 40l6 7 12-14', ...SW(5) }, 'white', { stroke: true })
  ],
  'coronación': [
    s('path', { d: 'M64 92l-16 44h64l-16-44z' }, 'red'),
    ...person(80, 136, 'purple'),
    s('path', { d: 'M60 56l4-24 10 10 6-14 6 14 10-10 4 24z' }, 'yellow', { accent: true }),
    s('path', { d: 'M30 30l28 16M130 30l-28 16', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M16 22l14 8M144 22l-14 8', ...SW(12) }, 'navy', { stroke: true }),
    s('path', { d: sparkle(40, 74, 7) + sparkle(122, 72, 7) }, 'yellow')
  ],
  decretar: [
    ground(),
    ...person(44, 136, 'navy'),
    s('path', { d: 'M56 100l16-10', ...SW(8) }, 'navy', { stroke: true }),
    s('rect', { x: 74, y: 40, width: 58, height: 66 }, 'cream'),
    s('path', { d: rects([[70, 32, 66, 10], [70, 104, 66, 10]]) }, 'brown'),
    s('path', { d: 'M84 56h38M84 68h38M84 80h26', ...SW(3) }, 'tan', { stroke: true }),
    s('circle', { cx: 118, cy: 92, r: 8 }, 'red', { accent: true })
  ],
  'democratización': [
    s('path', { d: busts([24, 136], 140, 22, 30) }, 'gray'),
    s('path', { d: dots([[24, 100], [136, 100]], 10) }, 'skin'),
    s('rect', { x: 66, y: 34, width: 28, height: 36 }, 'white'),
    s('path', { d: 'M66 34h28v36H66zM72 52l6 6 10-12', ...SW(3) }, 'green', { stroke: true }),
    s('rect', { x: 46, y: 76, width: 68, height: 62, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 42, y: 68, width: 76, height: 10, rx: 2 }, 'navy'),
    s('path', { d: 'M64 73h32', ...SW(4) }, 'dark', { stroke: true })
  ],
  'derogación': [
    s('rect', { x: 36, y: 34, width: 76, height: 96, rx: 4 }, 'navy'),
    s('path', { d: 'M112 40h6v84h-6z' }, 'cream'),
    s('path', { d: 'M74 58v40M58 64h32M58 64l-6 14h12zM90 64l-6 14h12zM64 98h20', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M30 30l94 104M124 30L30 134', ...SW(9) }, 'red', { stroke: true, accent: true })
  ],
  desafortunado: [
    ground(),
    ...person(80, 136, 'gray'),
    s('path', { d: ells([[64, 36, 20, 14], [86, 30, 22, 16], [104, 40, 16, 12]]) }, 'dark', { accent: true }),
    s('path', { d: 'M62 56l-4 10M78 58l-4 10M94 56l-4 10M106 58l-4 10', ...SW(3) }, 'blue', { stroke: true }),
    s('circle', { cx: 132, cy: 28, r: 10 }, 'yellow'),
    s('ellipse', { cx: 80, cy: 138, rx: 30, ry: 4 }, 'sky')
  ],
  desequilibrio: [
    s('path', { d: 'M80 54v80M56 136h48', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 38L132 72', ...SW(6) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M28 38l-12 26M28 38l12 26M132 72l-12 26M132 72l12 26', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M12 64h32a16 9 0 0 1-32 0zM116 98h32a16 9 0 0 1-32 0z' }, 'yellow'),
    s('rect', { x: 120, y: 78, width: 24, height: 20, rx: 2 }, 'gray'),
    s('circle', { cx: 80, cy: 54, r: 5 }, 'dark')
  ],
  desplegar: [
    s('path', { d: [0, 2, 4, 6, 8].map(i => wedge(80, 124, 72, -160 + i * 14, -146 + i * 14)).join('') }, 'red', { accent: true }),
    s('path', { d: [1, 3, 5, 7, 9].map(i => wedge(80, 124, 72, -160 + i * 14, -146 + i * 14)).join('') }, 'pink'),
    s('path', { d: 'M80 124v16', ...SW(8) }, 'brown', { stroke: true }),
    arrow('M24 74q56-70 112 0m-12-2 12 2 2-12', 'green', 5)
  ],
  detractor: [
    s('rect', { x: 58, y: 16, width: 44, height: 32, rx: 6 }, 'navy'),
    s('rect', { x: 52, y: 44, width: 56, height: 42, rx: 14 }, 'skin'),
    s('path', { d: 'M58 58h44M58 72h44', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M66 84v36', ...SW(15) }, 'skin', { stroke: true }),
    s('circle', { cx: 124, cy: 112, r: 16 }, 'red', { accent: true }),
    s('path', { d: 'M117 105l14 14M131 105l-14 14', ...SW(4) }, 'white', { stroke: true })
  ],
  'distorsión': [
    s('ellipse', { cx: 80, cy: 80, rx: 46, ry: 66 }, 'brown'),
    s('ellipse', { cx: 80, cy: 80, rx: 38, ry: 58 }, 'sky'),
    s('ellipse', { cx: 80, cy: 38, rx: 18, ry: 8 }, 'skin'),
    s('path', { d: 'M70 48q14 10 0 20q-14 10 0 20q14 10 0 20q-14 10 0 20h20q-14-10 0-20q14-10 0-20q-14-10 0-20q14-10 0-20z' }, 'orange', { accent: true })
  ],
  divulgar: [
    s('path', { d: 'M20 70l50-26v72l-50-26z' }, 'red', { accent: true }),
    s('rect', { x: 14, y: 66, width: 10, height: 28, rx: 2 }, 'dark'),
    s('path', { d: 'M82 62q8 18 0 36M94 52q14 28 0 56', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: busts([126], 56, 18, 18) + busts([136], 100, 18, 18) + busts([124], 144, 18, 18) }, 'blue'),
    s('path', { d: dots([[126, 32], [136, 76], [124, 120]], 8) }, 'skin')
  ],
  emisor: [
    ground(),
    s('path', { d: 'M80 44L58 136M80 44l22 92M66 104h28M72 74h16M62 122l36-18M98 122L62 104', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 40, r: 8 }, 'red', { accent: true }),
    s('path', { d: 'M62 30q-10 10 0 22M98 30q10 10 0 22M48 20q-18 20 0 42M112 20q18 20 0 42', ...SW(4) }, 'orange', { stroke: true })
  ],
  envidiar: [
    s('rect', { x: 24, y: 100, width: 40, height: 40, rx: 12 }, 'green'),
    ...face(44, 78, 22, 'mint', 'frown'),
    ...person(116, 140, 'red'),
    s('rect', { x: 126, y: 96, width: 20, height: 18, rx: 2 }, 'yellow', { accent: true }),
    s('path', { d: 'M136 96v18', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M66 66q30-18 56 30', ...DASH(3) }, 'gray', { stroke: true })
  ],
  escandaloso: [
    s('circle', { cx: 80, cy: 88, r: 42 }, 'skin'),
    s('path', { d: dots([[66, 76], [94, 76]], 6) }, 'dark'),
    s('ellipse', { cx: 80, cy: 106, rx: 11, ry: 14 }, 'dark'),
    s('path', { d: ells([[38, 108, 10, 16], [122, 108, 10, 16]]) }, 'tan'),
    s('path', { d: burst(28, 30, 16, 6, 8) + burst(132, 30, 16, 6, 8) }, 'yellow', { accent: true }),
    s('path', { d: 'M52 40l-8-10M108 40l8-10M80 36V22', ...SW(4) }, 'red', { stroke: true })
  ],
  eslogan: [
    s('path', { d: 'M28 30v106M132 30v106', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 22, y: 30, width: 116, height: 42, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M40 51h80', ...SW(8) }, 'white', { stroke: true }),
    ...person(28, 136, 'blue', { h: 34, w: 24, r: 10 }),
    ...person(132, 136, 'green', { h: 34, w: 24, r: 10 })
  ],
  'excavación': [
    s('rect', { x: 14, y: 56, width: 132, height: 90 }, 'brown'),
    s('rect', { x: 14, y: 50, width: 132, height: 8 }, 'green'),
    s('path', { d: 'M30 58h82l-12 66H42z' }, 'tan'),
    s('path', { d: 'M58 86h16l-2 6q10 8 6 20t-12 12h-8q-12-2-12-12t6-20z' }, 'orange', { accent: true }),
    s('path', { d: 'M84 112h18', ...SW(5) }, 'cream', { stroke: true }),
    s('path', { d: dots([[84, 109], [84, 115], [102, 109], [102, 115]], 3.5) }, 'cream'),
    s('path', { d: 'M126 20v38', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M118 56h16l-2 16h-12z' }, 'gray')
  ],
  exceder: [
    s('path', { d: 'M44 40h72l-8 96H52z' }, 'sky'),
    s('path', { d: 'M48 50h64l-6 82H54z' }, 'blue', { accent: true }),
    s('path', { d: 'M42 44q30-20 76 0z' }, 'blue'),
    s('path', { d: 'M44 42q-12 24-10 80M116 42q12 24 10 80', ...SW(6) }, 'blue', { stroke: true }),
    s('ellipse', { cx: 80, cy: 138, rx: 56, ry: 6 }, 'sky'),
    s('path', { d: 'M18 40h124', ...DASH(3, '6 5') }, 'red', { stroke: true })
  ],
  'faraón': [
    s('path', { d: 'M30 138l14-82q36-40 72 0l14 82z' }, 'yellow', { accent: true }),
    s('path', { d: 'M34 114h92M38 94h84M42 74h76', ...SW(6) }, 'blue', { stroke: true }),
    s('ellipse', { cx: 80, cy: 86, rx: 22, ry: 28 }, 'skin'),
    s('path', { d: 'M54 62h52', ...SW(8) }, 'blue', { stroke: true }),
    s('path', { d: 'M74 112h12l-2 24h-8z' }, 'blue'),
    s('path', { d: dots([[72, 82], [88, 82]], 3) }, 'dark'),
    s('path', { d: 'M80 58v-12', ...SW(4) }, 'orange', { stroke: true })
  ],
  'fénix': [
    s('path', { d: 'M70 82q-40-10-56-52q30 10 40 0q4 22 20 32z' }, 'red'),
    s('path', { d: 'M90 82q40-10 56-52q-30 10-40 0q-4 22-20 32z' }, 'red'),
    s('path', { d: 'M70 106q-12 20-4 36l14-14 14 14q8-16-4-36z' }, 'yellow', { accent: true }),
    s('ellipse', { cx: 80, cy: 88, rx: 16, ry: 24 }, 'orange'),
    s('circle', { cx: 80, cy: 56, r: 11 }, 'orange'),
    s('path', { d: 'M80 46l-6-14 6 6 6-6zM86 56l8 3-8 3z' }, 'yellow')
  ],
  gamma: [
    s('circle', { cx: 50, cy: 80, r: 34 }, 'yellow', { accent: true }),
    s('path', { d: wedge(50, 80, 28, -120, -60) + wedge(50, 80, 28, 0, 60) + wedge(50, 80, 28, 120, 180) }, 'black'),
    s('circle', { cx: 50, cy: 80, r: 6 }, 'black'),
    s('path', { d: 'M90 80q5-12 10 0t10 0t10 0t10 0t10 0', ...SW(4) }, 'purple', { stroke: true }),
    s('path', { d: 'M88 56q5-12 10 0t10 0t10 0t10 0M88 104q5-12 10 0t10 0t10 0t10 0', ...SW(3) }, 'purple', { stroke: true })
  ],
  'guiño': [
    s('circle', { cx: 80, cy: 80, r: 58 }, 'yellow', { accent: true }),
    s('ellipse', { cx: 58, cy: 66, rx: 7, ry: 10 }, 'dark'),
    s('path', { d: 'M90 68q12-10 24 0', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M50 98q30 26 60 0', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: ells([[40, 90, 9, 6], [120, 90, 9, 6]]) }, 'pink')
  ],
  'gótico': [
    ground(),
    s('path', { d: rects([[26, 56, 30, 80], [104, 56, 30, 80]]) }, 'gray'),
    s('path', { d: 'M24 58l17-44 17 44zM102 58l17-44 17 44z' }, 'dark'),
    s('path', { d: 'M56 136V72l24-30 24 30v64z' }, 'gray'),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'purple', { accent: true }),
    s('path', { d: 'M70 136v-22q10-18 20 0v22zM36 96q5-14 10 0v18H36zM114 96q5-14 10 0v18h-10z' }, 'dark'),
    s('path', { d: ring(80, 80, 12) + 'M68 80h24M80 68v24', ...SW(2) }, 'sky', { stroke: true })
  ],
  hambruna: [
    s('circle', { cx: 36, cy: 36, r: 16 }, 'orange'),
    s('rect', { x: 14, y: 96, width: 132, height: 40 }, 'tan'),
    s('path', { d: 'M30 100l12 14-6 14M70 100l-8 16 12 14M120 102l10 12-8 18', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M48 98V70q0-10 12-4', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(60, 66, 80, 14, 4) }, 'brown'),
    s('path', { d: 'M86 72h50q0 24-25 24t-25-24z' }, 'brown', { accent: true }),
    s('path', { d: 'M86 72h50', ...SW(3) }, 'dark', { stroke: true })
  ],
  henar: [
    s('rect', { x: 14, y: 14, width: 132, height: 72 }, 'sky'),
    s('rect', { x: 14, y: 84, width: 132, height: 52 }, 'yellow'),
    s('path', { d: 'M20 132l4-8M34 130l2-8M140 132l-4-8M126 130l-2-8', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: dots([[48, 100], [110, 96]], 24) }, 'tan', { accent: true }),
    s('path', { d: 'M48 100a4 4 0 0 1 8 0a8 8 0 0 1-16 0a14 14 0 0 1 28 0M110 96a4 4 0 0 1 8 0a8 8 0 0 1-16 0a14 14 0 0 1 28 0', ...SW(3) }, 'brown', { stroke: true }),
    s('circle', { cx: 124, cy: 36, r: 12 }, 'yellow')
  ],
  herzegovino: [
    s('path', { d: 'M14 70q30-30 60-6q30-30 72 0v76H14z' }, 'green'),
    s('rect', { x: 14, y: 108, width: 132, height: 38 }, 'blue'),
    s('path', { d: 'M14 84h34v62H14zM112 84h34v62h-34z' }, 'gray'),
    s('path', { d: 'M44 84q36-56 72 0v8q-36-46-72 0z' }, 'tan', { accent: true }),
    s('path', { d: rects([[28, 60, 16, 24], [116, 60, 16, 24]]) }, 'tan'),
    s('path', { d: 'M26 60l10-10 10 10zM114 60l10-10 10 10z' }, 'brown')
  ],
  hipotecario: [
    ground(),
    s('path', { d: 'M18 78l42-38 42 38z' }, 'red'),
    s('rect', { x: 26, y: 78, width: 68, height: 58 }, 'tan'),
    s('rect', { x: 50, y: 104, width: 20, height: 32 }, 'brown'),
    s('path', { d: rects([[110, 112, 30, 8], [110, 102, 30, 8], [110, 92, 30, 8], [110, 82, 30, 8]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M110 90h30M110 100h30M110 110h30', ...SW(2) }, 'orange', { stroke: true }),
    arrow('M124 70q-6-30-40-34m8-8-8 8 10 6', 'green', 4)
  ],
  iberoamericano: [
    backdrop('sky'),
    s('path', { d: 'M22 28q22-8 32 6t-4 24q12 6 10 22t-14 28q-6 14-10 28q-8-20-6-34t-10-24q-10-12-4-28q-4-14 6-22z' }, 'green'),
    s('path', { d: 'M108 46h28l4 10-4 22h-24l-8-14z' }, 'green', { accent: true }),
    s('path', { d: 'M60 76q24-50 46-16', ...DASH(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M80 108h20l-4 6h-12z' }, 'brown'),
    s('path', { d: 'M90 108V96l6 8z' }, 'white')
  ],
  impresionar: [
    s('circle', { cx: 80, cy: 86, r: 44 }, 'skin'),
    s('path', { d: star(62, 76, 11) + star(98, 76, 11) }, 'yellow', { accent: true }),
    s('ellipse', { cx: 80, cy: 108, rx: 10, ry: 8 }, 'dark'),
    s('path', { d: sparkle(26, 32, 10) + sparkle(134, 30, 9) + sparkle(140, 114, 7) + sparkle(20, 116, 7) }, 'orange')
  ],
  incansable: [
    ground(),
    s('path', { d: 'M52 128l-12 8M62 120l16 16', ...SW(7) }, 'orange', { stroke: true }),
    ...lean(58, 122, 18, 'orange', { accent: true, h: 40 }),
    s('path', { d: 'M18 74h14M14 90h18M20 106h10', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 110, y: 40, width: 30, height: 58, rx: 4, ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 116, y: 46, width: 18, height: 46, rx: 2 }, 'green'),
    s('rect', { x: 119, y: 32, width: 12, height: 8 }, 'dark')
  ],
  injerencia: [
    s('path', { d: ring(68, 88, 50), ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: busts([48], 128, 28, 34) }, 'blue'),
    s('path', { d: busts([88], 128, 28, 34) }, 'green'),
    s('path', { d: dots([[48, 82], [88, 82]], 12) }, 'skin'),
    s('path', { d: 'M148 30L104 64', ...SW(12) }, 'skin', { stroke: true }),
    s('path', { d: 'M150 28l-12 9', ...SW(16, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true, accent: true })
  ],
  inmortalidad: [
    s('path', { d: 'M80 80c-20-30-58-30-58 0s38 30 58 0s38-30 58 0s-38 30-58 0', ...SW(12) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: sparkle(80, 36, 10) + sparkle(30, 120, 7) + sparkle(130, 124, 8) + sparkle(80, 124, 6) }, 'yellow')
  ],
  invencible: [
    s('path', { d: 'M80 22l46 16v36q0 42-46 62q-46-20-46-62V38z' }, 'blue', { accent: true }),
    s('path', { d: star(80, 74, 20) }, 'yellow'),
    s('path', { d: 'M14 56l14 6M14 104l14-6M146 64l-12 4', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: burst(32, 64, 7, 3, 6) + burst(32, 96, 7, 3, 6) + burst(130, 70, 6, 3, 6) }, 'orange'),
    s('path', { d: 'M12 64l4 2M12 92l4-2', ...SW(3) }, 'gray', { stroke: true })
  ],
  litio: [
    s('path', { d: 'M14 136q4-20 20-22q14-2 18 8q8 4 6 14z' }, 'gray'),
    s('rect', { x: 68, y: 26, width: 20, height: 10, rx: 2 }, 'dark'),
    s('rect', { x: 54, y: 34, width: 72, height: 102, rx: 8 }, 'sky'),
    s('rect', { x: 92, y: 26, width: 20, height: 10, rx: 2 }, 'dark'),
    s('path', { d: 'M96 48l-22 40h16l-8 34 26-46H92l10-28z' }, 'yellow', { accent: true }),
    s('path', { d: sparkle(36, 104, 6) }, 'white')
  ],
  maligno: [
    s('path', { d: dots([[26, 30], [134, 34], [24, 128], [136, 126], [80, 20]], 10) }, 'pink'),
    s('path', { d: burst(80, 82, 46, 30, 12) }, 'purple', { accent: true }),
    s('path', { d: 'M62 70l12 6M98 70l-12 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[68, 82], [92, 82]], 4) }, 'yellow'),
    s('path', { d: 'M66 100l7-5 7 5 7-5 7 5', ...SW(3) }, 'dark', { stroke: true })
  ],
  mandamiento: [
    s('path', { d: 'M22 136V52a24 24 0 0 1 48 0v84zM90 136V52a24 24 0 0 1 48 0v84z' }, 'gray', { accent: true }),
    s('path', { d: 'M22 136V52a24 24 0 0 1 48 0v84zM90 136V52a24 24 0 0 1 48 0v84z', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M32 56h28M32 72h28M32 88h28M32 104h28M32 120h28M100 56h28M100 72h28M100 88h28M100 104h28M100 120h28', ...SW(3) }, 'dark', { stroke: true })
  ],
  merienda: [
    s('circle', { cx: 128, cy: 34, r: 14 }, 'orange'),
    s('ellipse', { cx: 80, cy: 128, rx: 64, ry: 10 }, 'gray'),
    s('path', { d: 'M28 78h52v36q0 14-14 14H42q-14 0-14-14z' }, 'red', { accent: true }),
    s('path', { d: 'M80 88h6q8 0 8 8t-8 8h-6', ...SW(5) }, 'red', { stroke: true }),
    s('ellipse', { cx: 54, cy: 80, rx: 24, ry: 5 }, 'brown'),
    s('path', { d: 'M44 64q-6-8 0-16M62 64q-6-8 0-16', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[118, 116, 10, 10], [104, 118, 9, 7], [132, 118, 9, 7]]) }, 'tan'),
    s('path', { d: 'M114 110v12M122 110v12', ...SW(2) }, 'brown', { stroke: true })
  ],
  monto: [
    s('path', { d: 'M34 18h68v112l-8-6-9 6-9-6-9 6-9-6-8 6-8-6-8 6z' }, 'white'),
    s('path', { d: 'M34 18h68v112l-8-6-9 6-9-6-9 6-9-6-8 6-8-6-8 6z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M44 36h48M44 50h48M44 64h48M44 78h30', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M44 98h48M44 108h48', ...SW(4) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: rects([[106, 120, 34, 8], [106, 110, 34, 8], [106, 100, 34, 8]]) }, 'yellow'),
    s('path', { d: 'M106 110h34M106 120h34', ...SW(2) }, 'orange', { stroke: true })
  ],
  muslo: [
    s('path', { d: 'M52 18h52v34H52z' }, 'blue'),
    s('path', { d: 'M54 52h48l-8 50H62z' }, 'skin', { accent: true }),
    s('path', { d: 'M62 102h32l-4 30H66z' }, 'skin'),
    s('path', { d: 'M64 130h28q14 0 14 10H64z' }, 'dark'),
    s('path', { d: 'M114 54v46m-8-46h8m-8 46h8', ...SW(4) }, 'orange', { stroke: true })
  ],
  neoliberalismo: [
    s('circle', { cx: 80, cy: 80, r: 42 }, 'blue'),
    s('path', { d: 'M56 56q14-10 22 4t-6 22q-10 4-16-8zM94 78q16-6 20 10t-10 20q-10-4-10-30z' }, 'green'),
    s('path', { d: 'M28 50a58 58 0 0 1 96-16M132 110a58 58 0 0 1-96 16', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M114 24l12 10-14 6M46 136l-12-10 14-6', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: dots([[22, 62], [138, 98]], 10) }, 'yellow', { accent: true })
  ],
  'niñera': [
    ground(),
    ...lady(44, 136, 'purple', { accent: true }),
    s('path', { d: 'M54 96l26-12', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 82h56q0 32-28 32t-28-32z' }, 'pink'),
    s('path', { d: 'M88 82a26 26 0 0 1 26-26v26z' }, 'navy'),
    s('circle', { cx: 124, cy: 76, r: 8 }, 'skin'),
    s('path', { d: dots([[96, 126], [132, 126]], 8) }, 'dark')
  ],
  notoriedad: [
    s('path', { d: 'M64 14h32l34 122H30z' }, 'cream'),
    ...person(80, 136, 'red', { accent: true }),
    s('path', { d: rects([[16, 60, 22, 16], [122, 60, 22, 16]]) }, 'dark'),
    s('path', { d: dots([[27, 68], [133, 68]], 5) }, 'gray'),
    s('path', { d: burst(27, 46, 10, 4, 8) + burst(133, 46, 10, 4, 8) }, 'yellow')
  ],
  pepino: [
    s('ellipse', { cx: 74, cy: 66, rx: 58, ry: 18, transform: 'rotate(-25 74 66)' }, 'green', { accent: true }),
    s('path', { d: dots([[48, 82], [66, 72], [84, 64], [102, 54], [58, 62], [94, 46]], 2) }, 'dark'),
    s('path', { d: dots([[60, 118], [100, 122]], 17) }, 'green'),
    s('path', { d: dots([[60, 118], [100, 122]], 13) }, 'mint'),
    s('path', { d: dots([[54, 114], [66, 114], [60, 124], [94, 118], [106, 118], [100, 128]], 2) }, 'cream')
  ],
  'pontífice': [
    ground(),
    s('path', { d: 'M56 84h48l14 52H42z' }, 'white'),
    s('path', { d: 'M56 84h48l14 52H42z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 86v50M86 86v50', ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 72, r: 12 }, 'skin'),
    s('path', { d: 'M68 62V40l12-18 12 18v22z' }, 'yellow', { accent: true }),
    s('path', { d: 'M124 136V44q0-14-12-10', ...SW(4) }, 'yellow', { stroke: true })
  ],
  portuario: [
    s('rect', { x: 14, y: 112, width: 132, height: 34 }, 'blue'),
    s('rect', { x: 116, y: 100, width: 30, height: 46 }, 'gray'),
    s('path', { d: 'M18 100h86l-10 20H28z' }, 'navy'),
    s('path', { d: rects([[30, 86, 22, 14], [54, 86, 22, 14]]) }, 'red'),
    s('path', { d: 'M130 100V30M130 30H64M130 44l-14-14', ...SW(5) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M80 30v28', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 68, y: 58, width: 24, height: 14 }, 'green')
  ],
  potro: [
    ground(),
    ...scaled(horse('tan', 'brown', { accent: true }), 0.82, 12, 25),
    s('path', { d: sparkle(124, 30, 7) }, 'yellow')
  ],
  preciado: [
    s('path', { d: 'M24 112q56-26 112 0l-8 24H32z' }, 'red'),
    s('path', { d: 'M54 66h52l14 18-40 40-40-40z' }, 'sky', { accent: true }),
    s('path', { d: 'M54 66l12 18h28l12-18M40 84h80M66 84l14 40 14-40', ...SW(2) }, 'blue', { stroke: true }),
    s('path', { d: sparkle(30, 46, 10) + sparkle(130, 40, 9) + sparkle(80, 30, 7) }, 'yellow'),
    s('path', { d: dots([[30, 118], [130, 118]], 5) }, 'yellow')
  ],
  precoz: [
    ground(),
    ...person(62, 136, 'orange', { h: 34, w: 26, r: 12 }),
    s('path', { d: 'M62 74l20-7-20-7-20 7z' }, 'navy', { accent: true }),
    s('path', { d: 'M78 68v12', ...SW(2) }, 'yellow', { stroke: true }),
    s('rect', { x: 82, y: 98, width: 52, height: 38, rx: 3 }, 'blue'),
    s('path', { d: 'M90 108h36M90 118h36M90 128h24', ...SW(3) }, 'white', { stroke: true })
  ],
  predecesor: [
    ground(),
    ...person(44, 136, 'gray'),
    ...person(116, 136, 'blue', { accent: true }),
    s('path', { d: 'M58 100h16M102 100H88', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 70, y: 94, width: 20, height: 10, rx: 4 }, 'yellow'),
    arrow('M54 46h52m-10-10 10 10-10 10', 'orange', 5)
  ],
  prescindir: [
    s('path', { d: rects([[22, 40, 30, 30], [64, 40, 30, 30]]) }, 'blue'),
    s('rect', { x: 110, y: 76, width: 30, height: 30, rx: 3, transform: 'rotate(25 125 91)' }, 'gray'),
    s('path', { d: 'M112 80l26 26M138 80l-26 26', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M100 52q24 2 30 16', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 116h70', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M30 106l6 6 10-12M70 106l6 6 10-12', ...SW(4) }, 'green', { stroke: true })
  ],
  pretemporada: [
    ground(),
    s('path', { d: 'M24 136l8-22 8 22zM60 136l8-22 8 22zM96 136l8-22 8 22z' }, 'orange'),
    ...lean(118, 136, 14, 'blue', { accent: true }),
    s('circle', { cx: 46, cy: 126, r: 10 }, 'white'),
    s('path', { d: ring(46, 126, 10) + 'M42 122l4-3 4 3-1 5h-6z', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 50h40v30H28z' }, 'white'),
    s('path', { d: 'M28 50h40v30H28zM28 60h40M38 46v8M58 46v8', ...SW(3) }, 'red', { stroke: true })
  ],
  prometedor: [
    s('path', { d: 'M14 90h132v46H14z' }, 'green'),
    s('path', { d: 'M48 90a32 32 0 0 1 64 0z' }, 'yellow', { accent: true }),
    s('path', { d: halfRays(80, 90, 40, 56, 7), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M74 90h12l30 46H44z' }, 'tan'),
    s('path', { d: 'M80 98v8M80 116v10', ...SW(3) }, 'white', { stroke: true })
  ],
  'pétalo': [
    s('path', { d: 'M62 136V74', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: ells([[46, 54, 14, 10], [78, 54, 14, 10], [62, 38, 10, 14]]) }, 'pink'),
    s('circle', { cx: 62, cy: 56, r: 9 }, 'yellow'),
    s('path', { d: 'M110 92q16-4 22 10q-16 10-26 2q-4-8 4-12z' }, 'pink', { accent: true }),
    s('path', { d: 'M96 70q8 8 4 16M124 124q-6 4-12 0', ...DASH(2, '3 4') }, 'gray', { stroke: true }),
    s('path', { d: 'M104 120q12-2 16 8q-10 6-18 2q-2-6 2-10z' }, 'pink')
  ],
  quejar: [
    ground(),
    ...person(48, 136, 'orange'),
    s('path', { d: bubble(70, 18, 76, 54) }, 'red', { accent: true }),
    s('path', { d: 'M112 26l-14 20h12l-8 18 20-24h-12l8-14z' }, 'yellow'),
    s('path', { d: 'M40 76l6 2M56 76l-6 2', ...SW(2) }, 'dark', { stroke: true })
  ],
  rabino: [
    ground(),
    ...person(64, 136, 'black'),
    s('path', { d: 'M56 82q8 16 16 0', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M56 70a8 6 0 0 1 16 0z' }, 'blue'),
    s('path', { d: 'M54 92v44M74 92v44', ...SW(5) }, 'white', { stroke: true }),
    s('rect', { x: 92, y: 84, width: 40, height: 40 }, 'cream', { accent: true }),
    s('path', { d: 'M92 80v48M132 80v48', ...SW(8) }, 'brown', { stroke: true })
  ],
  rascacielos: [
    ground(),
    s('rect', { x: 62, y: 18, width: 36, height: 118 }, 'blue', { accent: true }),
    s('path', { d: 'M80 18V6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: grid(68, 26, 3, 11, 6, 6, 9, 10) }, 'sky'),
    s('path', { d: rects([[30, 76, 26, 60], [104, 60, 26, 76]]) }, 'gray'),
    s('path', { d: ells([[40, 40, 18, 9], [126, 34, 16, 8]]) }, 'white'),
    s('path', { d: ells([[40, 40, 18, 9], [126, 34, 16, 8]]), ...SW(2) }, 'gray', { stroke: true })
  ],
  recibimiento: [
    ground(),
    s('rect', { x: 18, y: 30, width: 46, height: 106 }, 'brown'),
    s('rect', { x: 24, y: 36, width: 34, height: 100 }, 'cream'),
    ...person(100, 136, 'green', { accent: true }),
    s('path', { d: 'M88 100l-16-20M112 100l16-20', ...SW(8) }, 'green', { stroke: true }),
    s('path', { d: dots([[76, 40], [120, 30], [134, 56], [92, 24]], 4) }, 'red'),
    s('path', { d: 'M70 54l6 4M106 40l6-4M140 76l4 6', ...SW(3) }, 'yellow', { stroke: true })
  ],
  reformista: [
    ...gear(66, 92, 30, 10, 'gray'),
    s('circle', { cx: 66, cy: 92, r: 10 }, 'white'),
    s('path', { d: 'M96 62l34-34', ...SW(10) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M126 18a12 12 0 1 0 14 14l-8-2-4-4z' }, 'blue'),
    arrow('M18 50q8-30 40-34m-10-8 10 8-8 10', 'green', 5)
  ],
  relajar: [
    s('circle', { cx: 128, cy: 32, r: 14 }, 'yellow'),
    s('path', { d: 'M24 136l20-40M136 136l-20-40', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 100q40 30 80 0', ...SW(10) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 52, cy: 98, r: 11 }, 'skin'),
    s('path', { d: 'M64 104q20 10 40 2', ...SW(12) }, 'blue', { stroke: true }),
    s('path', { d: 'M48 74q4-4 8 0M60 64q4-4 8 0', ...SW(2) }, 'gray', { stroke: true })
  ],
  resucitar: [
    s('path', { d: heart(80, 76, 40) }, 'red', { accent: true }),
    s('path', { d: 'M22 98h30l8-18 10 34 10-26 6 10h52', ...SW(5) }, 'white', { stroke: true, lineColor: 'dark' }),
    s('path', { d: 'M126 20l-12 18h10l-8 16 18-22h-10l6-12z' }, 'yellow'),
    s('path', { d: sparkle(28, 40, 8) }, 'yellow')
  ],
  retaguardia: [
    ground(),
    ...person(118, 136, 'green', { h: 36, w: 24, r: 10 }),
    ...person(84, 136, 'green', { h: 36, w: 24, r: 10 }),
    ...person(44, 136, 'navy', { h: 40, w: 26, r: 11, accent: true }),
    s('path', { d: 'M28 92h20v18q0 12-10 16q-10-4-10-16z' }, 'gray'),
    arrow('M96 50h40m-8-8 8 8-8 8', 'orange', 5)
  ],
  rudo: [
    s('path', { d: 'M22 120l6-26 12-6 2-22 16-8 6-16 18 6 12-10 14 14 16 2 6 20 12 10-6 18 8 18z' }, 'brown', { accent: true }),
    s('path', { d: 'M40 100l10 6M60 70l8 10M90 54l-4 12M110 76l-10 6M70 104l10-4M118 104l-8-6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[52, 84], [80, 84], [98, 96], [86, 70], [112, 92], [62, 114], [100, 112]], 2.5) }, 'tan'),
    ground(122)
  ],
  rogar: [
    ground(),
    s('path', { d: 'M56 136h44v-10H56z' }, 'blue'),
    s('rect', { x: 62, y: 84, width: 28, height: 44, rx: 9 }, 'blue', { accent: true }),
    s('circle', { cx: 76, cy: 70, r: 12 }, 'skin'),
    s('path', { d: 'M88 96l14-14', ...SW(7) }, 'blue', { stroke: true }),
    s('path', { d: 'M100 84l6-14 6 4z' }, 'skin'),
    s('path', { d: 'M94 52q8-6 12 0M108 40q8-6 12 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  solicitante: [
    ground(),
    ...person(48, 136, 'blue'),
    s('rect', { x: 70, y: 40, width: 66, height: 82, rx: 3 }, 'white'),
    outline({ x: 70, y: 40, width: 66, height: 82, rx: 3 }),
    s('rect', { x: 78, y: 50, width: 20, height: 24 }, 'sky', { accent: true }),
    s('path', { d: 'M104 54h24M104 66h24M80 86h48M80 98h48M80 110h32', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 104l12-4', ...SW(7) }, 'blue', { stroke: true })
  ],
  subyacente: [
    s('rect', { x: 14, y: 50, width: 132, height: 96 }, 'blue'),
    s('path', { d: 'M62 50l12-30 10 12 8-6 8 24z' }, 'white'),
    s('path', { d: 'M62 50l12-30 10 12 8-6 8 24z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 50h38l22 34-12 42-40 12-34-28 8-40z' }, 'sky', { accent: true }),
    s('path', { d: 'M14 50h132', ...SW(3) }, 'white', { stroke: true })
  ],
  sumario: [
    s('path', { d: rects([[18, 38, 46, 60], [22, 34, 46, 60], [26, 30, 46, 60]]) }, 'white'),
    s('path', { d: rects([[18, 38, 46, 60], [22, 34, 46, 60], [26, 30, 46, 60]]) + 'M34 44h30M34 54h30M34 64h30M34 74h30M34 84h22', ...SW(2) }, 'gray', { stroke: true }),
    arrow('M76 64h20m-8-8 8 8-8 8'),
    s('rect', { x: 104, y: 46, width: 40, height: 36, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M112 58h24M112 70h16', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M18 112h124', ...SW(3) }, 'gray', { stroke: true })
  ],
  'superhéroe': [
    s('path', { d: 'M62 70L18 120l40-14z' }, 'red'),
    s('rect', { x: 52, y: 60, width: 76, height: 26, rx: 13, transform: 'rotate(-20 90 73)' }, 'blue', { accent: true }),
    s('circle', { cx: 134, cy: 50, r: 13 }, 'skin'),
    s('path', { d: 'M120 46l20-6', ...SW(5) }, 'navy', { stroke: true }),
    s('path', { d: star(90, 72, 9) }, 'yellow'),
    s('path', { d: 'M22 70h22M30 54h18M36 90h14', ...SW(4) }, 'gray', { stroke: true })
  ],
  'súbdito': [
    ground(),
    s('path', { d: 'M88 136V60q0-8 8-8h28q8 0 8 8v76z' }, 'red'),
    ...person(110, 128, 'purple', { accent: true }),
    s('path', { d: 'M98 62l2-14 6 6 4-10 4 10 6-6 2 14z' }, 'yellow'),
    s('path', { d: busts([30, 62], 136, 22, 22) }, 'gray'),
    s('path', { d: dots([[36, 112], [68, 112]], 9) }, 'skin')
  ],
  tertulia: [
    s('rect', { x: 40, y: 104, width: 80, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M80 114v22', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: busts([24, 136], 136, 28, 40) }, 'blue'),
    s('path', { d: dots([[24, 84], [136, 84]], 13) }, 'skin'),
    s('path', { d: rects([[56, 92, 12, 12], [92, 92, 12, 12]]) }, 'white'),
    s('path', { d: rects([[56, 92, 12, 12], [92, 92, 12, 12]]), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: bubble(16, 18, 52, 34) }, 'yellow', { accent: true }),
    s('path', { d: bubble(92, 18, 52, 34) }, 'mint')
  ],
  trinchera: [
    s('rect', { x: 14, y: 14, width: 132, height: 60 }, 'sky'),
    s('rect', { x: 14, y: 70, width: 132, height: 76 }, 'brown'),
    s('path', { d: 'M54 70h52v56H54z' }, 'dark'),
    s('path', { d: ells([[30, 64, 14, 7], [130, 64, 14, 7], [44, 56, 12, 6], [116, 56, 12, 6]]) }, 'tan'),
    s('path', { d: 'M66 72a14 14 0 0 1 28 0z' }, 'green', { accent: true }),
    s('rect', { x: 60, y: 120, width: 40, height: 6 }, 'tan')
  ],
  'validación': [
    ...paper(20, 22, 80, 104),
    s('path', { d: 'M32 42h56M32 58h56M32 74h36', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 112l-10 30 14-8 6 14 8-32z' }, 'red'),
    s('path', { d: burst(110, 98, 30, 25, 16) }, 'green', { accent: true }),
    s('path', { d: 'M98 98l8 9 16-18', ...SW(6) }, 'white', { stroke: true })
  ],
  viga: [
    s('path', { d: 'M80 14v24M70 38l10 8 10-8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 46L40 66M80 46l40 20', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 66h124v8h-56v26h56v8H18v-8h56V74H18z' }, 'orange', { accent: true }),
    s('path', { d: 'M18 66h124', ...SW(2) }, 'brown', { stroke: true }),
    ground()
  ],
  abertura: [
    s('rect', { x: 14, y: 20, width: 132, height: 116 }, 'red'),
    s('path', { d: 'M14 44h132M14 72h132M14 100h132M14 128h132M50 20v24M110 20v24M30 44v28M80 44v28M130 44v28M50 100v28M110 100v28M30 128v8M130 128v8', ...SW(3) }, 'cream', { stroke: true }),
    s('path', { d: 'M54 52l18-6 28 4 10 26-6 30-30 6-22-14z' }, 'sky', { accent: true }),
    s('path', { d: 'M70 70l8 6M90 64l-4 10M80 94l2-8', ...SW(3) }, 'yellow', { stroke: true })
  ],
  adverso: [
    ground(),
    ...lean(92, 136, -18, 'navy'),
    s('path', { d: 'M76 82l-30-22', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M20 64q14-30 34 0q-8-6-16 0q-10-6-18 0z' }, 'red', { accent: true }),
    s('path', { d: 'M14 36q20-6 40 0M18 100q26-6 46 0M14 120q20-6 36 0M110 40q14-6 30 0', ...SW(4) }, 'gray', { stroke: true })
  ],
  agrupar: [
    s('path', { d: ring(46, 80, 32), ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: ring(114, 80, 32), ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[36, 68], [56, 68], [36, 92], [56, 92]], 9) }, 'blue', { accent: true }),
    s('path', { d: 'M104 60h20l-10 18zM104 86h20l-10 18z' }, 'red'),
    s('path', { d: 'M46 140v-20M114 140v-20M40 126l6-6 6 6M108 126l6-6 6 6', ...SW(3) }, 'gray', { stroke: true })
  ],
  'alférez': [
    ground(),
    ...person(60, 136, 'green', { accent: true }),
    s('path', { d: 'M48 72q12-14 24 0zM46 68h28v4H46z' }, 'navy'),
    s('path', { d: 'M86 136V22', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M86 24h48v32H86z' }, 'blue'),
    s('path', { d: 'M86 40h48', ...SW(8, { 'stroke-linecap': 'butt' }) }, 'yellow', { stroke: true }),
    s('path', { d: 'M72 104l14-6', ...SW(7) }, 'green', { stroke: true })
  ],
  alguacil: [
    ground(),
    s('rect', { x: 92, y: 30, width: 50, height: 106 }, 'brown'),
    s('circle', { cx: 132, cy: 86, r: 3 }, 'yellow'),
    ...person(56, 136, 'navy', { accent: true }),
    s('path', { d: 'M42 72q14-16 28 0zM40 68h32v5H40z' }, 'navy'),
    s('path', { d: star(64, 104, 6) }, 'yellow')
  ],
  arruga: [
    s('path', { d: 'M34 70q0-46 46-46t46 46q-10-20-46-20t-46 20z' }, 'gray'),
    ...face(80, 82, 44, 'skin', 'smile'),
    s('path', { d: 'M60 54q20-6 40 0M64 62q16-5 32 0M44 76l-8 4M44 84l-8 0M116 76l8 4M116 84l8 0M62 114q18 8 36 0', ...SW(2) }, 'brown', { stroke: true, accent: true })
  ],
  asemejar: [
    ...face(42, 70, 26, 'skin', 'smile'),
    ...face(118, 70, 26, 'skin', 'smile'),
    s('path', { d: 'M18 60q4-30 24-30t24 30q-10-16-24-16t-24 16zM94 60q4-30 24-30t24 30q-10-16-24-16t-24 16z' }, 'brown'),
    s('path', { d: 'M70 66h20M70 78h20', ...SW(5) }, 'green', { stroke: true, accent: true }),
    s('path', { d: busts([42, 118], 140, 40, 36) }, 'blue')
  ],
  'bambú': [
    s('path', { d: 'M54 142V20M80 142V30M106 142V16', ...SW(12, { 'stroke-linecap': 'butt' }) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M48 50h12M48 90h12M48 124h12M74 66h12M74 106h12M100 40h12M100 82h12M100 120h12', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: leaflet(60, 50, -30, 26, 6) + leaflet(74, 66, -150, 26, 6) + leaflet(112, 40, -30, 26, 6) + leaflet(100, 82, -160, 24, 6) }, 'mint')
  ],
  bienal: [
    s('rect', { x: 46, y: 22, width: 68, height: 54 }, 'brown'),
    s('rect', { x: 52, y: 28, width: 56, height: 42 }, 'sky', { accent: true }),
    s('path', { d: 'M52 70l18-20 12 12 10-8 16 16z' }, 'green'),
    s('path', { d: 'M60 76l-14 42M100 76l14 42M80 76v24', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: rects([[16, 104, 30, 30], [114, 104, 30, 30]]) }, 'white'),
    s('path', { d: rects([[16, 104, 30, 30], [114, 104, 30, 30]]), ...SW(2) }, 'red', { stroke: true }),
    arrow('M50 128q30 14 60 0m-10-6 10 6-8 8', 'orange', 4)
  ],
  buey: [
    ground(),
    s('path', { d: 'M46 100v34M60 102v34M96 102v34M110 100v34', ...SW(9) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 76, cy: 90, rx: 46, ry: 22 }, 'brown', { accent: true }),
    s('path', { d: 'M34 86q-12 4-10 26', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M114 80l14-24h16l2 30-14 8z' }, 'brown'),
    s('path', { d: 'M128 58q-10-12-2-22M140 58q10-12 0-22', ...SW(5) }, 'cream', { stroke: true }),
    s('path', { d: ells([[138, 88, 9, 7]]) }, 'tan'),
    s('circle', { cx: 134, cy: 68, r: 3 }, 'dark')
  ],
  caliza: [
    s('path', { d: 'M18 136V60l20-18h66l26 26 12 68z' }, 'cream'),
    s('path', { d: 'M20 76h112M20 96h116M20 116h120', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M18 136V60l20-18h66l26 26 12 68z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 106a10 10 0 0 1 20 0z' }, 'orange', { accent: true }),
    s('path', { d: 'M66 106l6-8M72 106v-10M78 106l-6-8', ...SW(2) }, 'brown', { stroke: true }),
    ground()
  ],
  candado: [
    s('path', { d: 'M50 74V52a30 30 0 0 1 60 0v22', ...SW(12) }, 'gray', { stroke: true }),
    s('rect', { x: 36, y: 72, width: 88, height: 68, rx: 10 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 100, r: 9 }, 'dark'),
    s('path', { d: 'M80 104v18', ...SW(7) }, 'dark', { stroke: true })
  ],
  cangrejo: [
    s('path', { d: 'M48 98l-20 12-4 16M56 106l-14 20M112 98l20 12 4 16M104 106l14 20', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M52 82l-16-24M108 82l16-24', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M24 54q4-24 22-18l-6 10 10 2q-2 14-26 6zM136 54q-4-24-22-18l6 10-10 2q2 14 26 6z' }, 'red'),
    s('ellipse', { cx: 80, cy: 92, rx: 34, ry: 22 }, 'red', { accent: true }),
    s('path', { d: 'M70 72v-10M90 72v-10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[70, 60], [90, 60]], 5) }, 'dark')
  ],
  carcajada: [
    s('circle', { cx: 80, cy: 82, r: 52 }, 'yellow', { accent: true }),
    s('path', { d: 'M50 64q8-10 16 0M94 64q8-10 16 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M46 86h68q0 36-34 36t-34-36z' }, 'dark'),
    s('path', { d: 'M60 108q20-12 40 0q-8 12-20 12t-20-12z' }, 'red'),
    s('path', { d: drop(36, 76, 6) + drop(124, 76, 6) }, 'sky'),
    s('path', { d: 'M22 30l10 10M138 30l-10 10M80 14v12', ...SW(4) }, 'orange', { stroke: true })
  ],
  'cartografía': [
    s('path', { d: 'M18 30l40-10 44 10 40-10v106l-40 10-44-10-40 10z' }, 'cream'),
    s('path', { d: 'M58 20v106M102 30v106', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M30 60q14-20 30-4t20 20q-10 20-30 10t-20-26zM96 70q20-10 34 4q-4 20-24 18z' }, 'green'),
    s('path', { d: 'M40 108q30-16 50 0t40-6', ...DASH(3) }, 'red', { stroke: true }),
    s('path', { d: 'M118 30l6 16 16 6-16 6-6 16-6-16-16-6 16-6z' }, 'blue', { accent: true }),
    s('path', { d: 'M18 30l40-10 44 10 40-10v106l-40 10-44-10-40 10z', ...SW(2) }, 'gray', { stroke: true })
  ],
  cepa: [
    s('rect', { x: 14, y: 112, width: 132, height: 34 }, 'brown'),
    s('path', { d: 'M80 112q-8-30 0-50q-20-10-40-6M80 62q20-10 40-6', ...SW(9) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 112l-14 22M80 112l16 22M80 112v26', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: leaflet(40, 56, -120, 24, 10) + leaflet(120, 56, -60, 24, 10) + leaflet(80, 62, -90, 22, 9) }, 'green'),
    s('path', { d: dots([[40, 66], [48, 66], [44, 74], [36, 74], [40, 82], [118, 66], [126, 66], [122, 74], [114, 74], [120, 82]], 5) }, 'purple', { accent: true })
  ],
  ciudadela: [
    s('path', { d: 'M14 140q66-56 132 0z' }, 'green'),
    s('rect', { x: 36, y: 66, width: 88, height: 54 }, 'gray'),
    s('path', { d: rects([[28, 46, 22, 74], [110, 46, 22, 74], [66, 30, 28, 40]]) }, 'gray', { accent: true }),
    s('path', { d: rects([[28, 40, 6, 6], [44, 40, 6, 6], [110, 40, 6, 6], [126, 40, 6, 6], [66, 24, 6, 6], [77, 24, 6, 6], [88, 24, 6, 6]]) }, 'gray'),
    s('path', { d: 'M70 120V100q10-14 20 0v20z' }, 'dark'),
    s('path', { d: rects([[36, 60, 6, 10], [118, 60, 6, 10], [77, 42, 6, 10]]) }, 'dark')
  ],
  concursante: [
    ...person(80, 104, 'purple'),
    s('path', { d: 'M44 100h72l-6 36H50z' }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 118, r: 9 }, 'yellow'),
    s('path', { d: sparkle(30, 34, 9) + sparkle(130, 34, 9) }, 'yellow'),
    s('path', { d: 'M96 84l10-14', ...SW(7) }, 'purple', { stroke: true })
  ],
  contingencia: [
    s('rect', { x: 26, y: 70, width: 74, height: 60, rx: 8 }, 'red', { accent: true }),
    s('path', { d: 'M50 70v-10h26v10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M63 84v32M47 100h32', ...SW(9) }, 'white', { stroke: true }),
    s('path', { d: 'M120 34l26 46h-52z' }, 'yellow'),
    s('path', { d: 'M120 50v14', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 120, cy: 72, r: 3 }, 'dark'),
    ground()
  ],
  desafiar: [
    ground(),
    ...person(40, 136, 'blue'),
    ...person(120, 136, 'red', { h: 52, w: 34, r: 14 }),
    s('path', { d: 'M54 98l20-14', ...SW(8) }, 'blue', { stroke: true }),
    s('path', { d: 'M70 136q0-10 6-14h14q4 6 4 14z' }, 'yellow', { accent: true }),
    s('path', { d: 'M84 40l8 12-6 2 8 12', ...SW(4) }, 'orange', { stroke: true })
  ],
  desconectar: [
    s('rect', { x: 18, y: 50, width: 40, height: 60, rx: 6 }, 'white'),
    outline({ x: 18, y: 50, width: 40, height: 60, rx: 6 }),
    s('path', { d: dots([[32, 80], [44, 80]], 4) }, 'dark'),
    s('path', { d: 'M76 74h-8M76 86h-8', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 76, y: 66, width: 26, height: 28, rx: 5 }, 'dark', { accent: true }),
    s('path', { d: 'M102 80q30 0 40 50', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 60l6-6M62 100l6 6M58 80h-2', ...SW(3) }, 'orange', { stroke: true })
  ],
  destinar: [
    s('path', { d: rects([[18, 100, 30, 36], [65, 100, 30, 36], [112, 100, 30, 36]]) }, 'gray'),
    s('rect', { x: 65, y: 100, width: 30, height: 36 }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 26, r: 12 }, 'yellow'),
    s('path', { d: 'M80 44v36', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M70 74l10 12 10-12', ...SW(5) }, 'orange', { stroke: true }),
    ground()
  ],
  'didáctico': [
    s('rect', { x: 46, y: 20, width: 100, height: 70, rx: 4 }, 'green', { accent: true }),
    s('path', { d: 'M62 74l20-36 20 36zM112 40h20M112 56h20', ...SW(3) }, 'white', { stroke: true }),
    ...person(28, 136, 'orange'),
    s('path', { d: 'M38 98l22-22', ...SW(4) }, 'brown', { stroke: true }),
    ground()
  ],
  dinamismo: [
    s('path', { d: 'M18 120q10-60 30-40t24-30t30-20', ...DASH(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 112, cy: 36, r: 20 }, 'orange', { accent: true }),
    s('path', { d: 'M92 64l-14 8M102 70l-10 14M84 52l-16 0', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M122 82l-12 20h10l-8 18 20-24h-10l8-14z' }, 'yellow'),
    ground()
  ],
  distrital: [
    s('path', { d: 'M20 24h56l-6 44H18z' }, 'mint'),
    s('path', { d: 'M76 24h64l-4 38-66 6z' }, 'sky'),
    s('path', { d: 'M18 68h52l4 32-56 6zM70 68l66-6 4 50-66 0z' }, 'tan'),
    s('path', { d: 'M74 100h66v36H18v-30l56-6z' }, 'cream'),
    s('path', { d: 'M70 68l66-6 4 50H74z' }, 'orange', { accent: true }),
    s('path', { d: 'M20 24h120v112H18zM76 24l-6 44 4 32M18 68l52 0 66-6M18 106l56-6h66', ...SW(3) }, 'white', { stroke: true, lineColor: 'dark' })
  ],
  'ensueño': [
    s('rect', { x: 14, y: 116, width: 90, height: 20, rx: 6 }, 'sky'),
    s('ellipse', { cx: 30, cy: 110, rx: 16, ry: 8 }, 'white'),
    s('circle', { cx: 34, cy: 100, r: 12 }, 'skin'),
    s('path', { d: dots([[54, 88], [64, 76]], 4) }, 'gray'),
    s('path', { d: ells([[100, 46, 42, 30], [74, 52, 18, 16], [128, 54, 18, 16]]) }, 'purple', { accent: true }),
    s('path', { d: 'M90 32a14 14 0 1 0 14 20a12 12 0 0 1-14-20z' }, 'yellow'),
    s('path', { d: star(118, 40, 7) + star(84, 62, 5) }, 'yellow')
  ],
  entrevistar: [
    s('path', { d: busts([30], 140, 34, 46) }, 'navy'),
    s('path', { d: busts([130], 140, 34, 46) }, 'green'),
    s('path', { d: dots([[30, 80], [130, 80]], 14) }, 'skin'),
    s('path', { d: 'M46 108l40-18', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 84, y: 80, width: 14, height: 16, rx: 7, transform: 'rotate(-24 91 88)' }, 'red', { accent: true }),
    s('path', { d: bubble(62, 20, 50, 34) }, 'yellow')
  ],
  equilibrar: [
    ground(),
    s('ellipse', { cx: 80, cy: 124, rx: 40, ry: 12 }, 'gray'),
    s('ellipse', { cx: 80, cy: 98, rx: 30, ry: 12 }, 'brown', { accent: true }),
    s('ellipse', { cx: 80, cy: 74, rx: 22, ry: 10 }, 'tan'),
    s('ellipse', { cx: 80, cy: 54, rx: 15, ry: 9 }, 'gray'),
    s('ellipse', { cx: 80, cy: 36, rx: 9, ry: 7 }, 'brown'),
    s('path', { d: 'M28 56q-8 16 0 32M132 56q8 16 0 32', ...SW(3) }, 'green', { stroke: true })
  ],
  'erótico': [
    s('path', { d: 'M24 82q28-30 56-12q28-18 56 12q-28 10-56 4q-28 6-56-4z' }, 'red', { accent: true }),
    s('path', { d: 'M24 82q56 54 112 0q-28 4-56 6q-28-2-56-6z' }, 'red'),
    s('path', { d: 'M28 82q52 6 104 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: heart(36, 30, 8) + heart(124, 34, 10) + heart(130, 124, 7) }, 'pink')
  ],
  escama: [
    s('path', { d: 'M20 80q40-44 94-10l28-24v68l-28-24q-54 34-94-10z' }, 'blue'),
    s('path', { d: 'M54 66a8 8 0 0 0 0 16M66 60a8 8 0 0 0 0 16M66 82a8 8 0 0 0 0 16M78 62a8 8 0 0 0 0 16M78 84a8 8 0 0 0 0 16M90 66a8 8 0 0 0 0 16M102 70a8 8 0 0 0 0 16', ...SW(3) }, 'sky', { stroke: true, accent: true }),
    s('circle', { cx: 38, cy: 76, r: 5 }, 'white'),
    s('circle', { cx: 38, cy: 76, r: 2.5 }, 'dark'),
    s('path', { d: dots([[128, 120], [116, 132], [140, 136]], 5) }, 'sky')
  ],
  esforzar: [
    s('path', { d: 'M14 140l132-50v50z' }, 'green'),
    s('circle', { cx: 104, cy: 70, r: 26 }, 'gray', { accent: true }),
    ...lean(60, 124, 40, 'orange'),
    s('path', { d: 'M74 90l10-6M70 100l14-6', ...SW(7) }, 'orange', { stroke: true }),
    s('path', { d: drop(48, 58, 4) + drop(38, 70, 3) }, 'sky')
  ],
  'excitación': [
    ground(),
    ...person(80, 124, 'red', { accent: true }),
    s('path', { d: 'M68 86L50 50M92 86l18-36', ...SW(8) }, 'red', { stroke: true }),
    s('path', { d: burst(34, 40, 12, 5, 8) + burst(126, 40, 12, 5, 8) }, 'yellow'),
    s('path', { d: 'M64 136h32', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 100l-10 4M120 100l10 4', ...SW(3) }, 'orange', { stroke: true })
  ],
  'fascinación': [
    s('path', { d: 'M18 140q0-36 40-36t40 36z' }, 'blue'),
    s('circle', { cx: 58, cy: 80, r: 26 }, 'skin'),
    s('path', { d: heart(50, 76, 6) + heart(68, 76, 6) }, 'red'),
    s('path', { d: 'M52 94q6 4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: star(120, 40, 22) }, 'yellow', { accent: true }),
    s('path', { d: rays(120, 40, 28, 36, 8, 22), ...SW(3) }, 'orange', { stroke: true })
  ],
  fiar: [
    s('rect', { x: 14, y: 96, width: 132, height: 40, rx: 3 }, 'brown'),
    ...person(34, 96, 'green'),
    ...person(126, 96, 'blue'),
    s('path', { d: 'M62 96l6-26h24l6 26z' }, 'tan'),
    s('rect', { x: 58, y: 104, width: 44, height: 26, rx: 2 }, 'cream', { accent: true }),
    s('path', { d: 'M66 110v14M72 110v14M78 110v14M84 110v14M62 122l26-10', ...SW(2) }, 'dark', { stroke: true })
  ],
  flanco: [
    s('rect', { x: 64, y: 36, width: 72, height: 88, rx: 6 }, 'mint'),
    s('path', { d: dots(Array.from({ length: 12 }, (_, k) => [76 + (k % 3) * 24, 50 + Math.floor(k / 3) * 20]), 7) }, 'navy'),
    s('path', { d: 'M64 40v80', ...SW(8) }, 'red', { stroke: true, accent: true }),
    arrow('M16 80h36m-10-10 10 10-10 10', 'orange', 6)
  ],
  fluvial: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'green'),
    s('path', { d: 'M60 14q-30 30 10 50t-10 50q-14 18 0 32h40q-18-18 0-36t-10-50t10-46z' }, 'blue', { accent: true }),
    s('path', { d: 'M72 96h18l-3 6h-12z' }, 'brown'),
    s('path', { d: 'M80 96v-12l6 10z' }, 'white'),
    s('path', { d: dots([[30, 40], [128, 70], [36, 116], [124, 124]], 9) }, 'mint')
  ],
  golpista: [
    ground(),
    s('path', { d: 'M20 66L58 46l38 20z' }, 'gray'),
    s('path', { d: rects([[26, 66, 8, 50], [44, 66, 8, 50], [64, 66, 8, 50], [82, 66, 8, 50]]) }, 'cream'),
    s('rect', { x: 20, y: 116, width: 76, height: 8 }, 'gray'),
    s('path', { d: 'M86 120h56l-6 16H92z' }, 'green', { accent: true }),
    s('path', { d: 'M96 120l6-14h28l6 14z' }, 'green'),
    s('path', { d: 'M110 108L78 98', ...SW(6) }, 'green', { stroke: true })
  ],
  guau: [
    s('path', { d: 'M40 62q-16 12-8 44q12-6 18-26z' }, 'brown'),
    s('circle', { cx: 60, cy: 84, r: 30 }, 'tan', { accent: true }),
    s('path', { d: 'M76 94q16-4 30 4q-4 14-30 8z' }, 'tan'),
    s('path', { d: 'M86 100q8 6 18 2', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[104, 92], [66, 74]], 5) }, 'dark'),
    s('path', { d: 'M116 70l10-8M120 92h14M116 112l10 8', ...SW(5) }, 'orange', { stroke: true })
  ],
  hez: [
    s('path', { d: 'M48 20h64l-6 112H54z' }, 'sky'),
    s('path', { d: 'M52 50h56l-4 82H56z' }, 'pink'),
    s('path', { d: 'M55 112h50l-1 20H56z' }, 'brown', { accent: true }),
    s('path', { d: dots([[64, 120], [80, 124], [94, 118], [72, 104], [90, 98]], 3) }, 'brown'),
    s('path', { d: 'M48 20h64l-6 112H54z', ...SW(3) }, 'gray', { stroke: true })
  ],
  humorista: [
    s('rect', { x: 14, y: 120, width: 132, height: 16 }, 'brown'),
    ...person(66, 120, 'purple', { accent: true }),
    s('path', { d: 'M78 84l12-10', ...SW(7) }, 'purple', { stroke: true }),
    s('rect', { x: 86, y: 64, width: 10, height: 14, rx: 5 }, 'dark'),
    s('path', { d: 'M110 136V90', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 30q8-6 16 0M126 46q8-6 16 0M110 30q8 10 14 0', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: burst(124, 32, 14, 8, 8) }, 'yellow')
  ],
  hundimiento: [
    s('path', { d: 'M60 40l60 60-30 20-50-50z' }, 'red', { accent: true }),
    s('path', { d: 'M76 54l20-20 10 10-20 20z' }, 'white'),
    s('rect', { x: 14, y: 80, width: 132, height: 66 }, 'blue'),
    s('path', { d: dots([[40, 96], [48, 110], [130, 100], [120, 118]], 4) }, 'sky'),
    s('path', { d: 'M14 82q12-8 24 0t24 0t24 0t24 0t24 0', ...SW(4) }, 'sky', { stroke: true })
  ],
  impune: [
    ground(),
    ...lean(100, 136, 14, 'dark', { accent: true }),
    s('path', { d: 'M108 90q30 4 26 30h-20z' }, 'tan'),
    s('path', { d: ring(30, 110, 10) + ring(54, 110, 10) + 'M40 110h4', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 56q8 20 26 10', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 70h12M66 84h14', ...SW(3) }, 'gray', { stroke: true })
  ],
  incomodidad: [
    s('path', { d: 'M40 136V90M120 136V90', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 34, y: 82, width: 92, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M46 82l4-10 4 10M70 82l4-10 4 10M94 82l4-10 4 10M108 82l4-10 4 10', ...SW(2) }, 'gray', { stroke: true }),
    ...face(80, 46, 24, 'skin', 'frown'),
    s('path', { d: drop(110, 30, 5) }, 'sky'),
    s('path', { d: 'M48 40l-10-6M48 52l-10 4', ...SW(3) }, 'orange', { stroke: true, accent: true })
  ],
  incontable: [
    backdrop('navy'),
    s('path', { d: dots([[28, 30], [52, 46], [70, 24], [96, 40], [122, 26], [138, 54], [30, 64], [62, 72], [88, 62], [112, 78], [40, 96], [76, 100], [104, 108], [132, 96], [26, 126], [58, 124], [90, 132], [124, 130]], 2.5) }, 'white'),
    s('path', { d: star(70, 58, 9) + star(118, 54, 7) + star(48, 112, 8) + star(108, 124, 6) + star(134, 120, 5) + star(30, 46, 5) }, 'yellow', { accent: true })
  ],
  indumentaria: [
    s('path', { d: 'M18 30h124M24 30v106M136 30v106', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 30v8M80 30v8M112 30v8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M34 42h28l8 12-6 6-4-4v40H36V56l-4 4-6-6z' }, 'red', { accent: true }),
    s('path', { d: 'M68 42h24v54h-8l-4-30-4 30h-8z' }, 'blue'),
    s('path', { d: 'M100 42h24l-4 10 12 50h-40l12-50z' }, 'purple')
  ],
  'inmersión': [
    backdrop('blue'),
    s('path', { d: 'M14 30q11-8 22 0t22 0t22 0t22 0t22 0t22 0', ...SW(4) }, 'sky', { stroke: true }),
    s('ellipse', { cx: 82, cy: 94, rx: 34, ry: 12 }, 'orange', { accent: true }),
    s('circle', { cx: 50, cy: 90, r: 12 }, 'skin'),
    s('path', { d: 'M40 86h18v8H40z' }, 'sky'),
    s('path', { d: 'M114 94l14-8v16z' }, 'dark'),
    s('path', { d: dots([[54, 70], [60, 56], [52, 44]], 4) }, 'white')
  ],
  insulina: [
    s('rect', { x: 26, y: 72, width: 34, height: 56, rx: 6 }, 'sky'),
    s('rect', { x: 32, y: 60, width: 22, height: 14, rx: 2 }, 'gray'),
    s('rect', { x: 30, y: 90, width: 26, height: 22 }, 'white'),
    s('path', { d: 'M78 120l44-44', ...SW(14) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M122 76l14-14M132 52l14 14M72 126l-8 8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: drop(66, 40, 7) }, 'blue')
  ],
  'insólito': [
    s('path', { d: ells([[26, 100, 6, 4], [134, 100, 6, 4]]) }, 'white'),
    s('path', { d: 'M64 74q-20-30-44-18q10 14 40 30zM96 74q20-30 44-18q-10 14-40 30z' }, 'sky'),
    s('ellipse', { cx: 80, cy: 92, rx: 40, ry: 26 }, 'pink', { accent: true }),
    s('path', { d: 'M58 116v14M70 118v14M90 118v14M102 116v14', ...SW(7) }, 'pink', { stroke: true }),
    s('ellipse', { cx: 120, cy: 90, rx: 9, ry: 7 }, 'red'),
    s('path', { d: dots([[117, 90], [123, 90], [106, 80]], 2) }, 'dark'),
    s('path', { d: 'M40 90q-12-4-8 8', ...SW(3) }, 'pink', { stroke: true })
  ],
  istmo: [
    backdrop('sky'),
    s('path', { d: 'M14 14h54q6 26-6 44l-10 20q-8 6-38 0z' }, 'green'),
    s('path', { d: 'M146 146H92q-6-26 6-44l10-20q8-6 38 0z' }, 'green'),
    s('path', { d: 'M56 70q14 0 28 10t26 12l-8 12q-16-4-28-12t-26-10z' }, 'yellow', { accent: true })
  ],
  labrador: [
    s('rect', { x: 14, y: 110, width: 132, height: 30 }, 'brown'),
    s('path', { d: 'M14 120h132M14 132h132', ...SW(2) }, 'tan', { stroke: true }),
    ...person(70, 110, 'green', { accent: true }),
    s('path', { d: 'M48 36h44M56 36q14-18 28 0', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M104 30l-14 98', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M88 120l-14 4 14 6z' }, 'gray'),
    s('path', { d: 'M82 74l16 -4', ...SW(7) }, 'green', { stroke: true })
  ],
  locutor: [
    s('path', { d: 'M18 140q0-40 44-40t44 40z' }, 'blue'),
    s('circle', { cx: 62, cy: 70, r: 26 }, 'skin'),
    s('path', { d: 'M34 70a28 28 0 0 1 56 0', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: rects([[30, 62, 10, 18], [84, 62, 10, 18]]) }, 'dark'),
    s('path', { d: 'M108 140V96l-16-10', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 84, y: 66, width: 18, height: 26, rx: 9, transform: 'rotate(30 93 79)' }, 'gray'),
    s('rect', { x: 112, y: 20, width: 34, height: 18, rx: 5 }, 'red', { accent: true })
  ],
  madrina: [
    ground(),
    ...lady(64, 136, 'pink', { accent: true }),
    s('ellipse', { cx: 86, cy: 100, rx: 20, ry: 11 }, 'white'),
    s('ellipse', { cx: 86, cy: 100, rx: 20, ry: 11, ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 100, cy: 94, r: 8 }, 'skin'),
    s('path', { d: heart(110, 50, 10) }, 'red'),
    s('path', { d: sparkle(130, 80, 6) }, 'yellow')
  ],
  magnate: [
    s('path', { d: rects([[18, 40, 22, 96], [120, 30, 24, 106]]) }, 'gray'),
    s('path', { d: rects([[46, 112, 68, 10], [50, 102, 60, 10], [54, 92, 52, 10], [46, 122, 68, 14]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M46 122h68M50 112h60M54 102h52', ...SW(2) }, 'orange', { stroke: true }),
    ...person(80, 92, 'navy', { h: 36, w: 26, r: 11 }),
    s('path', { d: 'M88 60h14', ...SW(3) }, 'brown', { stroke: true }),
    ground()
  ],
};
