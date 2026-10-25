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
    ...person(80, 136, 'green', { accent: true }),
    s('path', { d: 'M66 70q14-18 28 0zM62 68h36v5H62z' }, 'navy'),
    s('path', { d: star(70, 100, 6) + star(90, 100, 6) }, 'yellow'),
    s('path', { d: rects([[68, 112, 8, 5], [80, 112, 8, 5], [68, 120, 8, 5]]) }, 'red')
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
};
