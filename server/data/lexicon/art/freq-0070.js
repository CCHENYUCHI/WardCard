// Illustration specs for words still undrawn in batches 0068–0070 (see server/scripts/lexicon/art.js)
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
  astronauta: [
    backdrop('navy'),
    s('path', { d: dots([[30, 34], [128, 40], [34, 118], [130, 112], [112, 24]], 2.5) }, 'yellow'),
    s('path', { d: 'M58 94l-16 20M102 94l16 20', ...SW(12) }, 'white', { stroke: true }),
    s('rect', { x: 56, y: 82, width: 48, height: 52, rx: 14 }, 'white'),
    s('circle', { cx: 80, cy: 58, r: 26 }, 'white'),
    s('rect', { x: 63, y: 46, width: 34, height: 24, rx: 10 }, 'sky', { accent: true }),
    s('rect', { x: 70, y: 96, width: 20, height: 14, rx: 3 }, 'red')
  ],
  'automatización': [
    ground(),
    s('rect', { x: 36, y: 122, width: 44, height: 14, rx: 3 }, 'dark'),
    s('path', { d: 'M58 122L46 78L94 52', ...SW(12) }, 'orange', { stroke: true }),
    s('path', { d: dots([[58, 120], [46, 78], [94, 52]], 8) }, 'dark'),
    s('path', { d: 'M98 46l14-8M100 58l15 2', ...SW(5) }, 'gray', { stroke: true }),
    ...gear(118, 106, 14, 8, 'blue', { accent: true }),
    s('circle', { cx: 118, cy: 106, r: 5 }, 'white')
  ],
  bohemio: [
    ground(),
    ...person(70, 136, 'purple', { accent: true }),
    s('path', { d: 'M54 72q16-14 32-2q-14 4-32 2z' }, 'dark'),
    s('path', { d: 'M60 94q10 6 20 0l12 24', ...SW(6) }, 'red', { stroke: true }),
    ...note(116, 64, 'pink'),
    s('path', { d: sparkle(124, 104, 10) }, 'yellow')
  ],
  brindis: [
    ...glass(52, 15, true),
    ...glass(108, -15, false),
    s('path', { d: sparkle(80, 22, 10) }, 'yellow'),
    s('path', { d: 'M62 22l-8-6M98 22l8-6', ...SW(3) }, 'orange', { stroke: true })
  ],
  buceo: [
    backdrop('blue'),
    s('path', { d: 'M34 88L14 74v24zM34 106L14 120V96z' }, 'yellow'),
    s('rect', { x: 30, y: 84, width: 72, height: 26, rx: 12 }, 'dark'),
    s('circle', { cx: 110, cy: 94, r: 16 }, 'skin'),
    s('rect', { x: 104, y: 84, width: 26, height: 14, rx: 5 }, 'sky', { accent: true }),
    s('path', { d: 'M100 86V56', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: dots([[104, 44], [110, 32], [102, 22]], 4) }, 'white'),
    s('path', { d: fishes([[52, 48]]) }, 'orange')
  ],
  'buzón': [
    ground(),
    s('rect', { x: 50, y: 40, width: 60, height: 96, rx: 8 }, 'yellow', { accent: true }),
    s('path', { d: 'M44 42h72v-6q0-10-10-10H54q-10 0-10 10z' }, 'blue'),
    ...paper(62, 44, 36, 26),
    s('path', { d: 'M63 46l17 12 17-12', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 56, y: 66, width: 48, height: 7, rx: 3 }, 'dark'),
    s('rect', { x: 62, y: 96, width: 36, height: 26, rx: 3 }, 'orange')
  ],
  'bíblico': [
    s('rect', { x: 46, y: 28, width: 76, height: 100, rx: 4 }, 'cream'),
    s('rect', { x: 38, y: 24, width: 76, height: 104, rx: 6 }, 'brown', { accent: true }),
    s('path', { d: 'M76 44v56M58 62h36', ...SW(8) }, 'yellow', { stroke: true }),
    s('path', { d: 'M92 126v20l6-5 6 5v-20z' }, 'red'),
    s('path', { d: 'M44 30v92', ...SW(2) }, 'tan', { stroke: true })
  ],
  calabozo: [
    backdrop('dark'),
    s('path', { d: rects([[22, 22, 30, 16], [58, 22, 40, 16], [104, 22, 34, 16], [22, 44, 22, 16], [116, 44, 22, 16], [22, 66, 18, 16], [120, 66, 18, 16]]) }, 'gray'),
    s('path', { d: 'M48 146V84a32 32 0 0 1 64 0v62z' }, 'brown', { accent: true }),
    s('rect', { x: 66, y: 74, width: 28, height: 24, rx: 3 }, 'black'),
    s('path', { d: 'M73 74v24M80 74v24M87 74v24', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 102, cy: 114, r: 4 }, 'yellow'),
    s('path', { d: 'M30 92v36', ...DASH(5, '5 4') }, 'gray', { stroke: true })
  ],
  careta: [
    s('path', { d: 'M34 66q-12-22 2-38M44 60q0-24 16-32M56 58q8-22 26-24', ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: 'M22 70q58-30 116 0q-4 32-28 34q-16 0-30-12q-14 12-30 12q-24-2-28-34z' }, 'purple', { accent: true }),
    s('path', { d: ells([[56, 78, 12, 8], [104, 78, 12, 8]]) }, 'dark'),
    s('path', { d: dots([[80, 66]], 5) }, 'yellow'),
    s('path', { d: 'M124 98l12 40', ...SW(5) }, 'brown', { stroke: true })
  ],
  cava: [
    s('path', { d: 'M46 136V74q0-14 10-22V30h16v22q10 8 10 22v62z' }, 'green', { accent: true }),
    s('rect', { x: 55, y: 22, width: 18, height: 28, rx: 3 }, 'yellow'),
    s('rect', { x: 50, y: 88, width: 28, height: 24, rx: 3 }, 'cream'),
    s('path', { d: 'M104 56h24l-2 34q-4 10-10 10q-6 0-10-10z' }, 'yellow'),
    s('path', { d: 'M104 56h24l-2 34q-4 10-10 10q-6 0-10-10zM116 100v32M106 134h20', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[112, 82], [120, 72], [113, 64]], 2) }, 'white'),
    s('path', { d: dots([[118, 44], [110, 32], [124, 24]], 3) }, 'orange')
  ],
  caverna: [
    ground(),
    s('path', { d: 'M14 136L38 62l32-28 36 12 26 40 14 50z' }, 'brown'),
    s('path', { d: 'M44 136q0-62 36-62q36 0 36 62z' }, 'black', { accent: true }),
    s('path', { d: 'M62 92l4 14 4-14zM78 78l3 14 3-14zM94 86l3 12 3-12z' }, 'brown'),
    s('path', { d: 'M24 136l4-10 4 10M128 136l4-10 4 10', ...SW(3) }, 'green', { stroke: true })
  ],
  ciegamente: [
    ground(),
    ...lean(58, 136, 10, 'blue', { accent: true }),
    s('rect', { x: 55, y: 75, width: 30, height: 8, rx: 3, transform: 'rotate(10 68 79)' }, 'black'),
    s('path', { d: 'M70 100l30-8', ...SW(7) }, 'skin', { stroke: true }),
    arrow('M106 118h32m-10-10l10 10-10 10'),
    s('path', { d: 'M108 136h30', ...DASH(4) }, 'dark', { stroke: true })
  ],
  ciervo: [
    s('path', { d: 'M52 100v36M64 102v34M94 102v34M106 100v36', ...SW(6) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 44, cy: 86, rx: 6, ry: 5 }, 'cream'),
    s('ellipse', { cx: 78, cy: 94, rx: 36, ry: 16 }, 'brown', { accent: true }),
    s('path', { d: 'M98 90l8-34h14l-4 38z' }, 'brown'),
    s('ellipse', { cx: 120, cy: 54, rx: 15, ry: 8, transform: 'rotate(25 120 54)' }, 'brown'),
    s('path', { d: 'M112 46L104 26M107 34L96 28M104 26L98 14M118 44L124 22M122 32L134 26M124 22L130 12', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: dots([[121, 50], [133, 61]], 2.5) }, 'dark')
  ],
  cisne: [
    s('rect', { x: 14, y: 112, width: 132, height: 30, rx: 8 }, 'sky'),
    s('path', { d: 'M72 100Q50 72 62 50Q70 36 58 30', ...SW(14) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 94, cy: 104, rx: 40, ry: 18 }, 'white'),
    s('ellipse', { cx: 94, cy: 104, rx: 40, ry: 18, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M72 100Q50 72 62 50Q70 36 58 30', ...SW(9) }, 'white', { stroke: true }),
    s('path', { d: 'M90 98q20-16 44-4q-16 14-44 4z' }, 'cream'),
    s('path', { d: 'M50 26l-16 6 16 4z' }, 'orange', { accent: true }),
    s('circle', { cx: 57, cy: 29, r: 2.5 }, 'dark')
  ],
  clemencia: [
    s('path', { d: heart(80, 54, 28) }, 'pink', { accent: true }),
    s('rect', { x: 44, y: 124, width: 72, height: 12, rx: 3 }, 'brown'),
    s('path', { d: 'M62 108l58-14', ...SW(6) }, 'tan', { stroke: true }),
    s('rect', { x: 38, y: 98, width: 28, height: 22, rx: 4, transform: 'rotate(-14 52 109)' }, 'dark'),
    s('path', { d: 'M34 30l-8-6M126 30l8-6M80 14v-2', ...SW(3) }, 'pink', { stroke: true })
  ],
  'consagración': [
    s('path', { d: laurel(80, 82, 48) }, 'green'),
    s('path', { d: rays(80, 82, 34, 42, 12), ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: star(80, 82, 28) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(126, 30, 9) + sparkle(34, 30, 7) }, 'yellow')
  ],
  'contestación': [
    s('path', { d: bubble(16, 20, 72, 46) }, 'gray'),
    s('path', { d: dots([[38, 42], [52, 42], [66, 42]], 4) }, 'white'),
    s('path', { d: bubble(16, 70, 72, 50), transform: 'translate(160 0) scale(-1 1)' }, 'blue', { accent: true }),
    s('path', { d: 'M120 96h-28q-10 0-10-10M92 104l-8-8 8-8', ...SW(5) }, 'white', { stroke: true })
  ],
  'cosmético': [
    s('rect', { x: 38, y: 96, width: 28, height: 40, rx: 3 }, 'dark'),
    s('rect', { x: 42, y: 72, width: 20, height: 26 }, 'yellow'),
    s('path', { d: 'M44 72V46l16-12v38z' }, 'red', { accent: true }),
    s('circle', { cx: 108, cy: 106, r: 30 }, 'pink'),
    s('circle', { cx: 108, cy: 106, r: 21 }, 'cream'),
    s('circle', { cx: 108, cy: 106, r: 12 }, 'tan')
  ],
  credo: [
    s('path', { d: halfRays(80, 56, 26, 38, 7), ...SW(4) }, 'yellow', { stroke: true }),
    ground(),
    s('path', { d: 'M56 136v-36q0-18 24-18q24 0 24 18v36z' }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 66, r: 14 }, 'skin'),
    s('path', { d: 'M80 82l-8 22h16z' }, 'skin'),
    s('path', { d: 'M66 104l14-6 14 6', ...SW(6) }, 'blue', { stroke: true })
  ],
  cuarzo: [
    s('ellipse', { cx: 80, cy: 132, rx: 60, ry: 10 }, 'gray'),
    s('path', { d: 'M38 134l-8-50 10-18 14 14 6 54z' }, 'pink'),
    s('path', { d: 'M104 134l4-52 14-16 10 18-8 50z' }, 'mint'),
    s('path', { d: 'M64 134V60l16-30 16 30v74z' }, 'purple', { accent: true }),
    s('path', { d: 'M80 30v104M40 66l4 68M122 66l-4 68', ...SW(2) }, 'white', { stroke: true })
  ],
  cuasi: [
    s('rect', { x: 18, y: 64, width: 124, height: 32, rx: 10 }, 'white'),
    s('rect', { x: 24, y: 70, width: 98, height: 20, rx: 6 }, 'green', { accent: true }),
    outline({ x: 18, y: 64, width: 124, height: 32, rx: 10 }, 'dark', 4),
    s('path', { d: 'M132 50v-12M132 110v12', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M124 52l8-14 8 14zM124 108l8 14 8-14z' }, 'red')
  ],
  cuchilla: [
    s('path', { d: 'M20 48h88v58H28q-8 0-8-8z' }, 'gray', { accent: true }),
    s('path', { d: 'M22 100q2 6 8 6h78', ...SW(4) }, 'white', { stroke: true }),
    s('circle', { cx: 38, cy: 62, r: 6 }, 'white'),
    s('rect', { x: 106, y: 66, width: 40, height: 18, rx: 6 }, 'brown'),
    s('path', { d: dots([[118, 75], [134, 75]], 2.5) }, 'cream')
  ],
  'cupón': [
    s('path', { d: 'M18 36h124v26a10 10 0 0 0 0 20v26H18V82a10 10 0 0 0 0-20z' }, 'yellow', { accent: true }),
    s('rect', { x: 30, y: 46, width: 100, height: 52, rx: 4, ...DASH(3) }, 'orange', { stroke: true }),
    s('path', { d: star(80, 72, 18) }, 'red'),
    s('path', { d: 'M40 124l36 14M40 140l36-14', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: ring(32, 122, 6) + ring(32, 142, 6), ...SW(4) }, 'red', { stroke: true })
  ],
  'cáliz': [
    s('path', { d: 'M48 32h64q0 40-32 44q-32-4-32-44z' }, 'yellow', { accent: true }),
    s('rect', { x: 74, y: 74, width: 12, height: 44 }, 'yellow'),
    s('ellipse', { cx: 80, cy: 94, rx: 11, ry: 6 }, 'orange'),
    s('path', { d: 'M50 136q4-20 30-20q26 0 30 20z' }, 'orange'),
    s('path', { d: dots([[66, 50], [80, 54], [94, 50]], 4) }, 'red'),
    s('path', { d: sparkle(128, 30, 10) }, 'orange')
  ],
  desbloquear: [
    s('path', { d: 'M58 80V46a22 22 0 0 1 44 0v8', ...SW(10) }, 'gray', { stroke: true }),
    s('rect', { x: 38, y: 76, width: 84, height: 60, rx: 8 }, 'yellow', { accent: true }),
    s('path', { d: 'M74 108a6 6 0 1 1 12 0l-2 16h-8z' }, 'dark'),
    s('path', { d: 'M124 52V24m-9 9l9-9 9 9', ...SW(5) }, 'green', { stroke: true })
  ],
  descarado: [
    ...face(80, 80, 52, 'yellow', 'smile', { accent: true }),
    s('path', { d: 'M76 102q2 22 14 22q10 0 8-22z' }, 'pink'),
    s('path', { d: 'M50 54l20-8M92 50l20 4', ...SW(5) }, 'dark', { stroke: true })
  ],
  destacable: [
    ground(),
    s('path', { d: busts([26, 50, 110, 134], 136, 20, 24) }, 'gray'),
    s('path', { d: dots([[26, 104], [50, 104], [110, 104], [134, 104]], 8) }, 'gray'),
    s('path', { d: halfRays(80, 66, 22, 32, 5), ...SW(4) }, 'orange', { stroke: true }),
    ...person(80, 136, 'yellow', { accent: true }),
    s('path', { d: star(80, 106, 9) }, 'orange')
  ],
  destrozar: [
    s('path', { d: burst(78, 100, 46, 26, 10) }, 'yellow'),
    s('path', { d: 'M46 122l14-22 12 20zM82 96l20 6-8 22zM60 136l20-10 6 14zM106 130l16-6 2 16zM40 98l10-6 2 12z' }, 'blue', { accent: true }),
    s('path', { d: 'M114 18L88 66', ...SW(7) }, 'brown', { stroke: true }),
    s('rect', { x: 96, y: 14, width: 36, height: 18, rx: 3, transform: 'rotate(28 114 23)' }, 'dark'),
    s('path', { d: dots([[30, 80], [130, 90], [70, 74]], 3) }, 'blue')
  ],
  detenidamente: [
    ...paper(28, 22, 72, 100),
    s('path', { d: 'M40 44h48M40 60h48M40 76h40M40 92h48M40 108h30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M114 112l24 24', ...SW(10) }, 'brown', { stroke: true }),
    s('circle', { cx: 92, cy: 88, r: 26 }, 'sky', { accent: true }),
    s('circle', { cx: 92, cy: 88, r: 26, ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 82h24M80 96h18', ...SW(4) }, 'navy', { stroke: true })
  ],
  dictado: [
    ...person(38, 136, 'green'),
    s('path', { d: 'M56 70q6 8 0 16M64 62q12 16 0 32', ...SW(4) }, 'blue', { stroke: true }),
    ...paper(80, 48, 62, 84),
    s('path', { d: 'M88 66q6-6 12 0t12 0t12 0M88 82q6-6 12 0t12 0M88 98q6-6 12 0t12 0t12 0', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M118 118l24-40 8 5-24 40-10 4z' }, 'orange', { accent: true })
  ],
  distar: [
    s('path', { d: 'M36 136h88', ...DASH(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M20 90a14 14 0 1 1 28 0q0 16-14 34q-14-18-14-34z' }, 'red', { accent: true }),
    s('path', { d: 'M112 90a14 14 0 1 1 28 0q0 16-14 34q-14-18-14-34z' }, 'blue'),
    s('path', { d: dots([[34, 90], [126, 90]], 5) }, 'white'),
    arrow('M44 54h72M54 44l-10 10 10 10M106 44l10 10-10 10')
  ],
  dogma: [
    s('rect', { x: 34, y: 28, width: 92, height: 108, rx: 6 }, 'brown'),
    s('rect', { x: 42, y: 34, width: 76, height: 96, rx: 3 }, 'red'),
    s('path', { d: 'M28 72h104M28 92h104', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 82V72a10 10 0 0 1 20 0v10', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 64, y: 80, width: 32, height: 26, rx: 4 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 92, r: 4 }, 'dark')
  ],
  ecologista: [
    ground(),
    ...person(70, 136, 'green', { accent: true }),
    s('path', { d: 'M88 112l12 24h24l12-24z' }, 'brown'),
    s('path', { d: 'M112 112V80', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(112, 92, -150, 26, 9) + leaflet(112, 82, -30, 26, 9) }, 'green'),
    s('path', { d: 'M78 100l16 14', ...SW(7) }, 'skin', { stroke: true })
  ],
  embalse: [
    s('path', { d: 'M14 70l30-30 30 24 30-26 42 40v58H14z' }, 'mint'),
    s('rect', { x: 14, y: 66, width: 74, height: 70 }, 'blue', { accent: true }),
    s('path', { d: 'M78 52h18l24 84H78z' }, 'gray'),
    s('rect', { x: 118, y: 120, width: 28, height: 16 }, 'sky'),
    s('path', { d: 'M100 84q14 20 18 46M88 52h0', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: 'M24 84h20M50 100h24M28 116h18', ...SW(3) }, 'sky', { stroke: true })
  ],
  emir: [
    ground(),
    s('rect', { x: 30, y: 80, width: 100, height: 56 }, 'cream'),
    s('path', { d: 'M48 80q0-40 32-44q32 4 32 44z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 36v-10', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M70 136v-24a10 10 0 0 1 20 0v24zM40 104a6 6 0 0 1 12 0v12H40zM108 104a6 6 0 0 1 12 0v12h-12z' }, 'brown'),
    s('path', { d: 'M56 26l4-12 8 7 6-10 6 10 8-7 4 12z', transform: 'translate(0 -2)' }, 'orange')
  ],
  escribano: [
    s('rect', { x: 28, y: 36, width: 88, height: 96, rx: 4 }, 'cream'),
    s('path', { d: 'M24 36h96M24 132h96', ...SW(10) }, 'tan', { stroke: true }),
    s('path', { d: 'M40 58h64M40 74h64M40 90h48', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 96, cy: 112, r: 12 }, 'red', { accent: true }),
    s('path', { d: 'M90 104q20-50 52-80q-6 40-46 82z' }, 'white'),
    s('path', { d: 'M90 104q20-50 52-80q-6 40-46 82zM92 106l-8 16', ...SW(3) }, 'dark', { stroke: true })
  ],
  escudero: [
    ground(),
    s('path', { d: 'M40 26v110', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M34 30l6-14 6 14z' }, 'gray'),
    ...person(60, 136, 'brown'),
    s('path', { d: 'M74 70h52v32q0 24-26 34q-26-10-26-34z' }, 'blue', { accent: true }),
    s('path', { d: 'M100 74v58M78 94h44', ...SW(6) }, 'yellow', { stroke: true })
  ],
  especular: [
    ground(),
    ...person(40, 136, 'blue'),
    s('path', { d: dots([[60, 66], [68, 54]], 4) }, 'gray'),
    s('rect', { x: 66, y: 16, width: 78, height: 58, rx: 22 }, 'mint'),
    arrow('M78 60l16-18 12 12 24-24m-12 0h12v12', 'green', 5),
    s('path', { d: 'M100 96h40', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: ells([[120, 118, 16, 5], [120, 110, 16, 5], [120, 102, 16, 5]]) }, 'yellow', { accent: true })
  ],
  'estimulación': [
    s('path', { d: 'M40 96q-16-8-10-30q6-20 26-20q8-14 26-10q20-6 30 10q22 4 22 26q4 22-16 28q-6 14-26 12q-14 10-30 0q-20 2-28-16z' }, 'pink', { accent: true }),
    s('path', { d: 'M56 60q10 6 6 18M80 52q-4 14 8 20M106 62q-10 8-4 20M66 92q10-4 18 4', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M24 26l14 18-8 2 10 14M136 26l-14 18 8 2-10 14M80 112v12l-6 4 6 6v10', ...SW(4) }, 'orange', { stroke: true })
  ],
  evocar: [
    s('rect', { x: 48, y: 22, width: 76, height: 80, rx: 3, transform: 'rotate(8 86 62)' }, 'cream'),
    s('rect', { x: 56, y: 30, width: 60, height: 52, transform: 'rotate(8 86 62)' }, 'sky', { accent: true }),
    s('path', { d: 'M58 80q14-22 28-8q14-16 30 0v10H58z', transform: 'rotate(8 86 62)' }, 'green'),
    s('circle', { cx: 100, cy: 46, r: 7 }, 'yellow'),
    ...person(34, 136, 'purple'),
    s('path', { d: 'M48 76q6-4 10-12M54 86q10-2 18-12', ...DASH(3, '4 5') }, 'gray', { stroke: true })
  ],
  exitosamente: [
    s('circle', { cx: 76, cy: 84, r: 54 }, 'red'),
    s('circle', { cx: 76, cy: 84, r: 38 }, 'white'),
    s('circle', { cx: 76, cy: 84, r: 22 }, 'red'),
    s('circle', { cx: 76, cy: 84, r: 8 }, 'white'),
    s('path', { d: 'M76 84l60-60', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M128 22l14-8-4 14zM134 28l10-2-6 10z' }, 'yellow'),
    s('path', { d: 'M100 124l12 12 26-28', ...SW(8) }, 'green', { stroke: true, accent: true })
  ],
  exportador: [
    s('rect', { x: 14, y: 114, width: 132, height: 26, rx: 6 }, 'sky'),
    s('path', { d: 'M18 100h112l-14 26H32z' }, 'navy', { accent: true }),
    s('path', { d: rects([[32, 78, 24, 22], [80, 78, 24, 22]]) }, 'red'),
    s('path', { d: rects([[56, 78, 24, 22], [56, 56, 24, 22]]) }, 'green'),
    s('path', { d: rects([[32, 56, 24, 22]]) }, 'yellow'),
    s('rect', { x: 108, y: 66, width: 14, height: 34 }, 'white'),
    arrow('M96 34h44m-10-10l10 10-10 10')
  ],
  fraile: [
    ground(),
    s('path', { d: 'M66 66h28l18 70H48z' }, 'brown', { accent: true }),
    s('path', { d: 'M62 74q-6-28 18-30q24 2 18 30z' }, 'brown'),
    s('circle', { cx: 80, cy: 60, r: 11 }, 'skin'),
    s('path', { d: 'M58 100h44M70 100v20', ...SW(4) }, 'cream', { stroke: true }),
    s('path', { d: 'M66 86l14 8 14-8', ...SW(5) }, 'skin', { stroke: true })
  ],
  furor: [
    s('path', { d: burst(80, 84, 66, 50, 14) }, 'orange'),
    ...face(80, 84, 44, 'red', 'frown', { accent: true }),
    s('path', { d: 'M50 62l20 10M110 62l-20 10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M34 30q-6-8 2-14M126 30q6-8-2-14', ...SW(4) }, 'gray', { stroke: true })
  ],
  gatito: [
    s('path', { d: 'M104 118q34 4 28-28', ...SW(7) }, 'orange', { stroke: true }),
    s('ellipse', { cx: 84, cy: 110, rx: 26, ry: 24 }, 'orange', { accent: true }),
    s('path', { d: 'M52 58l4-26 14 16zM96 58l-4-26-14 16z' }, 'orange'),
    s('circle', { cx: 74, cy: 64, r: 24 }, 'orange'),
    s('path', { d: dots([[65, 62], [83, 62]], 3) + 'M70 72h8l-4 4z' }, 'dark'),
    s('path', { d: 'M58 132h18M88 132h18', ...SW(6) }, 'cream', { stroke: true }),
    s('circle', { cx: 32, cy: 120, r: 14 }, 'pink'),
    s('path', { d: 'M22 112q10 6 20-2M20 122q12 6 24-4M46 120q10 10 24 12', ...SW(2) }, 'red', { stroke: true })
  ],
  granjero: [
    ground(),
    s('path', { d: 'M114 30v106', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M104 34V16M114 34V16M124 34V16M104 34h20', ...SW(3) }, 'gray', { stroke: true }),
    ...person(76, 136, 'blue', { accent: true }),
    s('path', { d: 'M56 70h40l-6-6q-10-12-28 0z' }, 'yellow'),
    s('path', { d: 'M66 92v44M86 92v44', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M90 100l22-4', ...SW(7) }, 'skin', { stroke: true })
  ],
  'gurú': [
    s('path', { d: rays(80, 60, 30, 42, 12), ...SW(3) }, 'yellow', { stroke: true }),
    s('ellipse', { cx: 80, cy: 118, rx: 50, ry: 12 }, 'red'),
    s('path', { d: 'M64 74h32l10 26q20 4 20 16H34q0-12 20-16z' }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 58, r: 13 }, 'skin'),
    s('path', { d: 'M98 92l14-22', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: busts([24, 136], 146, 18, 20) }, 'gray')
  ],
  'hispánico': [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'blue', { accent: true }),
    s('path', { d: 'M34 46q14-8 24 2q-2 12-10 18q8 8 12 22q4 14-6 30q-6-10-6-24q-12-8-14-24q-6-12 0-24z' }, 'green'),
    s('path', { d: 'M96 52q14-6 26 0q2 12-10 14q-12 2-16-14zM110 74q12 2 16 14q-2 20-12 28q-6-18-4-42z' }, 'green'),
    s('path', { d: bubble(96, 14, 48, 30) }, 'yellow'),
    s('path', { d: dots([[110, 28], [120, 28], [130, 28]], 3) }, 'dark')
  ],
  histeria: [
    s('path', { d: 'M22 40l12 10M138 40l-12 10M18 80h14M128 80h14M30 120l10-8M130 120l-10-8', ...SW(4) }, 'red', { stroke: true }),
    s('ellipse', { cx: 80, cy: 80, rx: 38, ry: 46 }, 'yellow', { accent: true }),
    s('path', { d: dots([[66, 64], [94, 64]], 9) }, 'white'),
    s('path', { d: dots([[66, 64], [94, 64]], 4) }, 'dark'),
    s('ellipse', { cx: 80, cy: 98, rx: 10, ry: 16 }, 'dark'),
    s('path', { d: ells([[42, 96, 10, 20], [118, 96, 10, 20]]) }, 'skin'),
    s('path', { d: drop(122, 48, 5) }, 'sky')
  ],
  idealista: [
    ground(),
    ...lean(52, 136, -10, 'blue'),
    s('path', { d: 'M52 100l24-40', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: halfRays(110, 46, 28, 36, 5) + rays(110, 46, 28, 36, 3, 30), ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: star(110, 46, 24) }, 'yellow', { accent: true }),
    s('path', { d: 'M80 54q12-4 14-10', ...DASH(3, '3 5') }, 'gray', { stroke: true })
  ],
  inadecuado: [
    s('rect', { x: 20, y: 96, width: 120, height: 40, rx: 6 }, 'brown'),
    s('ellipse', { cx: 80, cy: 104, rx: 20, ry: 6 }, 'dark'),
    s('rect', { x: 52, y: 34, width: 56, height: 56, rx: 4, transform: 'rotate(8 80 62)' }, 'red', { accent: true }),
    s('path', { d: 'M40 40l-10-6M38 58H24M120 40l10-6M122 58h14', ...SW(4) }, 'gray', { stroke: true })
  ],
  incomprensible: [
    ground(),
    ...person(44, 136, 'green'),
    s('path', { d: 'M56 80l8-24', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M84 48q14-24 30-6t-14 16t24 8t-8-20t18 0q10 8-4 18q-16 8-28 0q-12-10-4-20t24-4', ...SW(4) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: spiral(100, 108), ...SW(3) }, 'purple', { stroke: true })
  ],
  indecente: [
    s('circle', { cx: 80, cy: 80, r: 52 }, 'yellow', { accent: true }),
    s('path', { d: ells([[50, 96, 12, 7], [110, 96, 12, 7]]) }, 'pink'),
    s('path', { d: 'M70 114q10-8 20 0', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 34, y: 48, width: 92, height: 28, rx: 14 }, 'skin'),
    s('path', { d: 'M56 52v20M70 50v24M90 50v24M104 52v20', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M122 22l-6 14M138 34l-12 8', ...SW(4) }, 'red', { stroke: true })
  ],
  'infografía': [
    s('rect', { x: 16, y: 20, width: 128, height: 112, rx: 8 }, 'cream'),
    s('rect', { x: 16, y: 20, width: 128, height: 112, rx: 8, ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: rects([[30, 92, 12, 28], [48, 72, 12, 48], [66, 52, 12, 68]]) }, 'blue', { accent: true }),
    s('circle', { cx: 112, cy: 56, r: 20 }, 'orange'),
    s('path', { d: wedge(112, 56, 20, -90, 30) }, 'red'),
    s('circle', { cx: 112, cy: 56, r: 9 }, 'cream'),
    s('path', { d: 'M94 94h36M94 108h28M94 122h32', ...SW(5) }, 'green', { stroke: true })
  ],
  intolerable: [
    s('path', { d: wedge(80, 108, 64, 180, 240) }, 'green'),
    s('path', { d: wedge(80, 108, 64, 240, 300) }, 'yellow'),
    s('path', { d: wedge(80, 108, 64, 300, 360) }, 'red', { accent: true }),
    s('path', { d: wedge(80, 108, 40, 178, 362) }, 'white'),
    s('path', { d: 'M80 108l44-28', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 108, r: 9 }, 'dark'),
    s('path', { d: 'M126 30q6-8 0-14M138 38q8-10 0-20', ...SW(4) }, 'gray', { stroke: true })
  ],
  invernal: [
    backdrop('sky'),
    s('path', { d: 'M14 120q40-14 66-4q34-14 66 0v18q0 12-12 12H26q-12 0-12-12z' }, 'white'),
    s('path', { d: 'M80 24l26 40H92l22 34H46l22-34H54z' }, 'green', { accent: true }),
    s('path', { d: 'M80 24l10 16H70zM68 64h24l-6 8h-12zM58 98h44' }, 'white'),
    s('rect', { x: 74, y: 98, width: 12, height: 18 }, 'brown'),
    s('path', { d: dots([[30, 36], [44, 70], [126, 40], [118, 86], [34, 100]], 4) }, 'white')
  ],
  invicto: [
    s('path', { d: 'M58 22l6 18 16-14 16 14 6-18 8 30H50z' }, 'yellow'),
    s('path', { d: 'M48 74q0-18 22-18h22q24 0 24 24v28q0 18-20 18H70q-22 0-22-18z' }, 'red', { accent: true }),
    s('path', { d: 'M48 86q-18 0-18 16q0 10 18 10z' }, 'red'),
    s('rect', { x: 58, y: 120, width: 52, height: 18, rx: 4 }, 'white'),
    outline({ x: 58, y: 120, width: 52, height: 18, rx: 4 }),
    s('path', { d: sparkle(28, 50, 9) + sparkle(134, 50, 9) }, 'orange')
  ],
  karate: [
    backdrop('sky'),
    s('path', { d: 'M64 96l-6 40M74 92l40 4', ...SW(12) }, 'white', { stroke: true }),
    s('rect', { x: 52, y: 56, width: 30, height: 44, rx: 10, transform: 'rotate(-14 67 100)' }, 'white'),
    s('path', { d: 'M54 88l30-6M70 85l-6 14', ...SW(5) }, 'black', { stroke: true, accent: true }),
    s('path', { d: 'M56 64l-22-10M76 62l20-18', ...SW(9) }, 'white', { stroke: true }),
    s('circle', { cx: 60, cy: 44, r: 12 }, 'skin'),
    s('path', { d: 'M48 40h24', ...SW(4) }, 'red', { stroke: true })
  ],
  lagarto: [
    s('path', { d: 'M46 52l-14-14M46 52l-20 0M100 96l20 16M100 96l20-2M56 96l-18 16M88 52l18-16', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M96 100q20 26 40 28q-10 8-30 0', ...SW(9) }, 'green', { stroke: true }),
    s('ellipse', { cx: 72, cy: 74, rx: 38, ry: 16, transform: 'rotate(40 72 74)' }, 'green', { accent: true }),
    s('ellipse', { cx: 40, cy: 40, rx: 14, ry: 10, transform: 'rotate(40 40 40)' }, 'green'),
    s('path', { d: dots([[37, 33], [46, 41]], 2.5) }, 'dark'),
    s('path', { d: dots([[62, 66], [76, 76], [86, 92], [70, 86]], 3) }, 'mint')
  ],
  legislar: [
    ground(),
    s('path', { d: 'M24 56l56-30 56 30z' }, 'gray'),
    s('rect', { x: 28, y: 56, width: 104, height: 10 }, 'gray'),
    s('path', { d: 'M38 70v54M58 70v54M78 70v54M98 70v54M118 70v54', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'cream', { stroke: true }),
    s('rect', { x: 24, y: 124, width: 112, height: 12 }, 'gray'),
    s('path', { d: 'M100 112l34-20', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 86, y: 104, width: 28, height: 16, rx: 3, transform: 'rotate(-30 100 112)' }, 'brown', { accent: true })
  ],
  lila: [
    s('path', { d: 'M80 90v46', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 116, 200, 34, 12) + leaflet(80, 108, -20, 34, 12) }, 'green'),
    s('path', { d: dots([[80, 24], [72, 36], [88, 36], [64, 50], [80, 50], [96, 50], [58, 66], [74, 66], [90, 66], [102, 66], [68, 82], [84, 82], [96, 80]], 9) }, 'purple', { accent: true }),
    s('path', { d: dots([[76, 30], [86, 44], [70, 58], [94, 58], [80, 74], [64, 74]], 4) }, 'pink')
  ],
  macizo: [
    ground(),
    s('path', { d: 'M36 66l44-22 44 22-44 22z' }, 'tan'),
    s('path', { d: 'M36 66v48l44 22V88z' }, 'brown', { accent: true }),
    s('path', { d: 'M124 66v48l-44 22V88z' }, 'orange'),
    s('path', { d: 'M48 84l20 10M48 100l20 10', ...SW(3) }, 'tan', { stroke: true })
  ],
  mestizo: [
    ground(),
    s('path', { d: busts([40], 136, 30, 46) }, 'blue'),
    s('path', { d: busts([120], 136, 30, 46) }, 'green'),
    s('path', { d: busts([80], 136, 24, 32) }, 'orange', { accent: true }),
    s('path', { d: dots([[40, 76]], 14) }, 'skin'),
    s('path', { d: dots([[120, 76]], 14) }, 'brown'),
    s('path', { d: dots([[80, 92]], 11) }, 'tan'),
    s('path', { d: heart(80, 50, 10) }, 'red')
  ],
  mitigar: [
    s('path', { d: 'M34 40q0-18 20-18q8-12 24-6q16-6 24 6q22 0 22 18z' }, 'gray'),
    s('path', { d: 'M40 50l-6 12M62 50l-6 12M98 50l6 12M122 50l6 12', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M36 92q0-28 44-28q44 0 44 28q-11-8-22 0q-11-8-22 0q-11-8-22 0q-11-8-22 0z' }, 'red', { accent: true }),
    s('path', { d: 'M80 64v52q0 8 8 8', ...SW(4) }, 'dark', { stroke: true }),
    ...person(64, 136, 'yellow', { h: 30, w: 22, r: 9 })
  ],
  mondar: [
    s('circle', { cx: 70, cy: 76, r: 40 }, 'orange', { accent: true }),
    s('path', { d: 'M70 36a40 40 0 0 1 38 26l-38 14z' }, 'cream'),
    s('path', { d: 'M108 64q20 6 18 24q-2 16 10 22q10 6 2 22', ...SW(8) }, 'orange', { stroke: true }),
    s('path', { d: 'M94 50l30-30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M124 20l12-10', ...SW(9) }, 'brown', { stroke: true }),
    s('path', { d: 'M54 38q4-14 16-14', ...SW(4) }, 'green', { stroke: true })
  ],
  motel: [
    ground(),
    s('rect', { x: 18, y: 76, width: 96, height: 60 }, 'tan'),
    s('rect', { x: 14, y: 68, width: 104, height: 10, rx: 2 }, 'red'),
    s('path', { d: rects([[26, 96, 16, 40], [52, 96, 16, 40], [78, 96, 16, 40]]) }, 'blue'),
    s('path', { d: 'M132 136V54', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 112, y: 24, width: 40, height: 30, rx: 6 }, 'pink', { accent: true }),
    s('path', { d: star(132, 39, 9) }, 'yellow'),
    s('path', { d: dots([[38, 88], [64, 88], [90, 88]], 3) }, 'yellow')
  ],
  mugre: [
    s('path', { d: 'M40 20h80l20 50H20z' }, 'gray'),
    s('rect', { x: 18, y: 70, width: 124, height: 12, rx: 3 }, 'dark'),
    s('path', { d: 'M40 40q10-8 20 0q4 8-6 10q-14 2-14-10zM96 32q14-4 18 6q-6 10-18 6zM70 56q12-6 22 2q-8 8-22-2z' }, 'brown', { accent: true }),
    s('path', { d: drop(44, 96, 5) + drop(80, 104, 6) + drop(116, 94, 4) }, 'brown'),
    s('path', { d: 'M60 126q4-8 0-16M80 136q4-8 0-16M100 126q4-8 0-16', ...SW(3) }, 'green', { stroke: true })
  ],
  necio: [
    ground(),
    s('rect', { x: 104, y: 30, width: 40, height: 106 }, 'red'),
    s('path', { d: 'M104 52h40M104 74h40M104 96h40M104 118h40M124 30v22M114 52v22M134 74v22M114 96v22', ...SW(3) }, 'white', { stroke: true }),
    ...lean(66, 136, 22, 'blue', { accent: true }),
    s('path', { d: sparkle(96, 40, 8) + sparkle(84, 26, 6) }, 'yellow')
  ],
  nefasto: [
    s('path', { d: 'M100 136q-34 0-36-22q-2-20 6-36q-6-14-2-28l10 10q8-4 16 0l10-10q4 14-2 28q8 16 6 36z' }, 'black', { accent: true }),
    s('path', { d: 'M100 130q30 4 30-20q0-14 10-16', ...SW(6) }, 'black', { stroke: true }),
    s('path', { d: dots([[80, 62], [96, 62]], 3) }, 'yellow'),
    s('rect', { x: 18, y: 40, width: 40, height: 60, rx: 18 }, 'sky'),
    s('rect', { x: 18, y: 40, width: 40, height: 60, rx: 18, ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M38 40l-6 22 10 8-8 30M42 70l14 4', ...SW(2) }, 'dark', { stroke: true })
  ],
  negrito: [
    ground(),
    s('path', { d: busts([56, 104], 136, 36, 50) }, 'purple'),
    s('path', { d: dots([[56, 70], [104, 70]], 16) }, 'brown'),
    s('path', { d: 'M74 106l12 0', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: heart(80, 38, 14) }, 'red', { accent: true })
  ],
  oscilar: [
    s('rect', { x: 50, y: 18, width: 60, height: 8, rx: 3 }, 'brown'),
    s('path', { d: 'M80 26L46 110M80 26L114 110', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: dots([[46, 112], [114, 112]], 10) }, 'gray'),
    s('path', { d: 'M80 26v92', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 122, r: 14 }, 'yellow', { accent: true }),
    arrow('M30 128q50 26 100 0m-8 8l8-8-10-4', 'orange', 4)
  ],
  partidista: [
    ground(),
    s('path', { d: busts([30, 52], 136, 20, 26) }, 'red'),
    s('path', { d: dots([[30, 104], [52, 104]], 8) }, 'skin'),
    s('path', { d: busts([108, 130], 136, 20, 26) }, 'blue'),
    s('path', { d: dots([[108, 104], [130, 104]], 8) }, 'skin'),
    s('rect', { x: 76, y: 70, width: 8, height: 66 }, 'gray'),
    s('path', { d: 'M40 86V32', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 32h34l-8 12 8 12H40z' }, 'red', { accent: true })
  ],
  pegamento: [
    s('path', { d: 'M74 14l-4 18h20l-4-18z' }, 'orange'),
    s('rect', { x: 64, y: 30, width: 32, height: 16, rx: 3 }, 'orange'),
    s('path', { d: 'M52 56q0-12 12-12h32q12 0 12 12v70q0 10-10 10H62q-10 0-10-10z' }, 'white'),
    s('path', { d: 'M52 56q0-12 12-12h32q12 0 12 12v70q0 10-10 10H62q-10 0-10-10z', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 52, y: 74, width: 56, height: 36 }, 'blue', { accent: true }),
    s('path', { d: drop(80, 92, 8) }, 'white'),
    s('path', { d: drop(74, 22, 3) }, 'sky')
  ],
  porfa: [
    s('circle', { cx: 80, cy: 62, r: 42 }, 'yellow', { accent: true }),
    s('path', { d: dots([[64, 58], [96, 58]], 10) }, 'dark'),
    s('path', { d: dots([[67, 54], [99, 54]], 4) }, 'white'),
    s('path', { d: 'M74 84q6-4 12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 98q-12 4-14 20l-2 22h32l-2-22q-2-16-14-20z' }, 'skin'),
    s('path', { d: 'M80 100v38', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: heart(28, 34, 8) + heart(134, 44, 7) }, 'pink')
  ],
  precisar: [
    s('rect', { x: 20, y: 40, width: 124, height: 16, rx: 2 }, 'gray', { accent: true }),
    s('path', { d: 'M30 44v8M42 44v6M54 44v8M66 44v6M78 44v8M90 44v6M102 44v8M114 44v6M126 44v8', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M20 40h16v66l-16-20z' }, 'gray'),
    s('path', { d: 'M100 36h16v70l-16-20z' }, 'dark'),
    s('circle', { cx: 68, cy: 92, r: 30 }, 'red'),
    s('path', { d: 'M38 124h60M38 118v12M98 118v12', ...SW(3) }, 'orange', { stroke: true })
  ],
  predominio: [
    s('path', { d: wedge(80, 96, 48, -60, 240) }, 'blue', { accent: true }),
    s('path', { d: wedge(80, 96, 48, 240, 270) }, 'yellow'),
    s('path', { d: wedge(80, 96, 48, 270, 300) }, 'green'),
    s('path', { d: 'M56 40l-4-24 14 10 14-14 14 14 14-10-4 24z' }, 'yellow')
  ],
  preescolar: [
    ground(),
    s('rect', { x: 86, y: 108, width: 28, height: 28, rx: 3 }, 'red'),
    s('rect', { x: 116, y: 108, width: 28, height: 28, rx: 3 }, 'blue'),
    s('rect', { x: 100, y: 80, width: 28, height: 28, rx: 3 }, 'green'),
    ...person(48, 136, 'yellow', { h: 34, w: 26, r: 12, accent: true }),
    s('path', { d: 'M38 104h20v20H38z' }, 'orange'),
    s('circle', { cx: 114, cy: 60, r: 9 }, 'pink')
  ],
  prioritario: [
    s('rect', { x: 30, y: 108, width: 84, height: 22, rx: 6 }, 'gray'),
    s('rect', { x: 30, y: 80, width: 84, height: 22, rx: 6 }, 'gray'),
    s('rect', { x: 30, y: 44, width: 84, height: 28, rx: 6 }, 'red', { accent: true }),
    s('path', { d: star(48, 58, 9) }, 'yellow'),
    s('path', { d: 'M64 58h38M44 91h56M44 119h56', ...SW(5) }, 'white', { stroke: true }),
    arrow('M134 120V36m-10 10l10-10 10 10', 'green', 5)
  ],
  'promulgación': [
    s('rect', { x: 22, y: 34, width: 60, height: 92, rx: 3 }, 'cream'),
    s('path', { d: 'M18 34h68M18 126h68', ...SW(10) }, 'tan', { stroke: true }),
    s('path', { d: 'M34 56h36M34 72h36M34 88h28', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 66, cy: 108, r: 9 }, 'red'),
    s('path', { d: 'M92 74l36-20v52l-36-20z' }, 'orange', { accent: true }),
    s('rect', { x: 86, y: 72, width: 10, height: 16, rx: 2 }, 'dark'),
    s('path', { d: 'M136 66q6 14 0 28M144 58q10 22 0 44', ...SW(4) }, 'blue', { stroke: true })
  ],
  puntualmente: [
    s('circle', { cx: 72, cy: 80, r: 54 }, 'blue', { accent: true }),
    s('circle', { cx: 72, cy: 80, r: 44 }, 'white'),
    s('path', { d: 'M72 44v-4M72 120v-4M36 80h4M108 80h-4', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: 'M72 80V48M72 80h20', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 120, cy: 120, r: 22 }, 'green'),
    s('path', { d: 'M110 120l7 7 13-14', ...SW(6) }, 'white', { stroke: true })
  ],
  refrigerador: [
    s('rect', { x: 44, y: 14, width: 72, height: 132, rx: 10 }, 'white'),
    s('rect', { x: 44, y: 14, width: 72, height: 132, rx: 10, ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M44 60h72', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M56 30v18M56 72v30', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: rects([[88, 82, 14, 14]]) + dots([[96, 34]], 7) }, 'red', { accent: true }),
    s('rect', { x: 50, y: 140, width: 60, height: 6 }, 'gray')
  ],
  regio: [
    s('path', { d: 'M24 120q0-20 56-20q56 0 56 20q0 18-56 18q-56 0-56-18z' }, 'purple'),
    s('path', { d: dots([[26, 120], [134, 120]], 6) }, 'yellow'),
    s('path', { d: 'M40 96l-6-56 24 22 22-36 22 36 24-22-6 56z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[58, 82], [102, 82]], 6) }, 'blue'),
    s('path', { d: dots([[80, 80]], 8) }, 'red'),
    s('path', { d: dots([[34, 40], [80, 26], [126, 40]], 5) }, 'orange')
  ],
  'reposición': [
    s('path', { d: 'M18 72h104M18 116h104M22 28v108M118 28v108', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: rects([[28, 48, 24, 24], [56, 48, 24, 24], [28, 92, 24, 24], [56, 92, 24, 24], [84, 92, 24, 24]]) }, 'tan'),
    s('rect', { x: 90, y: 22, width: 24, height: 24 }, 'orange', { accent: true }),
    s('path', { d: 'M86 48h24', ...DASH(3, '4 4') }, 'gray', { stroke: true }),
    arrow('M126 18q16 20-10 36', 'green', 4),
    s('path', { d: 'M28 56h24M56 56h24M28 100h24', ...SW(2) }, 'brown', { stroke: true })
  ],
  robusto: [
    s('path', { d: 'M62 136q8-20 6-56h24q-2 36 6 56M50 136q12-6 18-16M110 136q-12-6-18-16' }, 'brown'),
    s('path', { d: ells([[80, 54, 52, 34], [50, 72, 26, 20], [110, 72, 26, 20]]) }, 'green', { accent: true }),
    s('path', { d: 'M74 92q4 8 0 18M86 100q-2 8 2 16', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M34 136h92', ...SW(6) }, 'brown', { stroke: true })
  ],
  'salvadoreño': [
    s('path', { d: 'M14 136l48-80h36l48 80z' }, 'brown', { accent: true }),
    s('path', { d: 'M62 56l8 10 10-8 10 8 8-10z' }, 'gray'),
    s('path', { d: 'M74 50q-8-14 4-22q14-8 10-20', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M32 136l20-30q14 8 22 4l-6 26z' }, 'green'),
    s('path', { d: 'M98 120q18-6 40 4l6 12H94z' }, 'blue')
  ],
  'seducción': [
    s('path', { d: 'M80 76v60', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 112, 200, 26, 9) + leaflet(80, 100, -20, 26, 9) }, 'green'),
    s('path', { d: 'M58 52q-4-24 22-30q26 6 22 30q-2 26-22 26q-20 0-22-26z' }, 'red', { accent: true }),
    s('path', { d: 'M66 48q14 8 28 0M72 34q8 10 16 0', ...SW(3) }, 'pink', { stroke: true }),
    s('path', { d: heart(124, 46, 9) + heart(36, 66, 7) + heart(128, 92, 6) }, 'pink')
  ],
  septentrional: [
    s('circle', { cx: 80, cy: 88, r: 50 }, 'navy'),
    s('circle', { cx: 80, cy: 88, r: 40 }, 'cream'),
    s('path', { d: 'M80 52l10 36H70z' }, 'red', { accent: true }),
    s('path', { d: 'M80 124l10-36H70z' }, 'gray'),
    s('path', { d: star(80, 22, 10) }, 'yellow'),
    s('path', { d: 'M48 88h-6M118 88h-6', ...SW(4) }, 'navy', { stroke: true })
  ],
  simular: [
    ground(),
    ...person(52, 136, 'blue'),
    s('rect', { x: 36, y: 66, width: 34, height: 14, rx: 5 }, 'dark'),
    s('path', { d: 'M74 70q10-6 20-14', ...DASH(3, '3 5') }, 'purple', { stroke: true }),
    s('rect', { x: 90, y: 22, width: 56, height: 52, rx: 8 }, 'mint'),
    s('path', { d: jet(118, 50) }, 'purple', { accent: true }),
    s('rect', { x: 90, y: 22, width: 56, height: 52, rx: 8, ...DASH(3, '6 4') }, 'purple', { stroke: true })
  ],
  singularidad: [
    s('path', { d: dots([[32, 32], [64, 32], [96, 32], [128, 32], [32, 64], [64, 64], [128, 64], [32, 96], [64, 96], [96, 96], [128, 96], [32, 128], [64, 128], [96, 128], [128, 128]], 11) }, 'blue'),
    s('path', { d: star(96, 64, 16) }, 'red', { accent: true }),
    s('path', { d: sparkle(116, 46, 6) }, 'orange')
  ],
  sirviente: [
    ground(),
    ...person(66, 136, 'navy'),
    s('path', { d: 'M60 96l6 6 6-6-6-6z' }, 'red'),
    s('path', { d: 'M78 104l26-8', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M88 92h50', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M94 90q0-24 19-24q19 0 19 24z' }, 'gray', { accent: true }),
    s('path', { d: 'M54 96v26', ...SW(8) }, 'white', { stroke: true })
  ],
  sobrepeso: [
    s('rect', { x: 26, y: 70, width: 108, height: 66, rx: 16 }, 'gray'),
    s('rect', { x: 52, y: 82, width: 56, height: 30, rx: 8 }, 'white'),
    s('path', { d: 'M58 108a22 22 0 0 1 44 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 108l16-16', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: wedge(80, 108, 22, 300, 360) }, 'red', { accent: true }),
    arrow('M80 56V20m-12 12l12-12 12 12', 'red', 6)
  ],
  soriano: [
    backdrop('sky'),
    s('rect', { x: 14, y: 112, width: 132, height: 34, rx: 0 }, 'blue'),
    s('path', { d: 'M14 112V96h132v16h-10a14 14 0 0 0-28 0h-10a14 14 0 0 0-28 0h-10a14 14 0 0 0-28 0z' }, 'tan', { accent: true }),
    s('path', { d: 'M30 96l12-40 12 40zM104 96l14-50 14 50z' }, 'green'),
    s('path', { d: 'M62 96V60h8v-8h8v8h8v36z' }, 'brown')
  ],
  tempestad: [
    backdrop('navy'),
    s('path', { d: 'M28 58q0-20 22-20q8-16 28-12q20-8 32 8q24 0 24 24z' }, 'gray'),
    s('path', { d: 'M86 58l-10 22h12l-10 24', ...SW(5) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M40 66l-8 16M56 66l-8 16M108 66l-8 16M124 66l-8 16', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M14 120q16-16 30 0q16-20 34 0q16-16 32 0q16-18 36 0v26H14z' }, 'blue'),
    s('path', { d: 'M24 112q8-10 16-4M86 110q8-10 16-4', ...SW(3) }, 'white', { stroke: true })
  ],
  textual: [
    ...paper(18, 30, 52, 72),
    ...paper(90, 58, 52, 72),
    s('path', { d: 'M26 46q5-5 10 0t10 0t10 0M26 62q5-5 10 0t10 0M26 78q5-5 10 0t10 0t10 0M98 74q5-5 10 0t10 0t10 0M98 90q5-5 10 0t10 0M98 106q5-5 10 0t10 0t10 0', ...SW(3) }, 'navy', { stroke: true }),
    arrow('M44 112v22h30m-8-8l8 8-8 8', 'orange', 5),
    s('path', { d: 'M82 34h50', ...SW(6) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M82 46h50', ...SW(6) }, 'green', { stroke: true })
  ],
  tramitar: [
    s('rect', { x: 28, y: 76, width: 84, height: 60, rx: 3 }, 'tan'),
    ...paper(22, 64, 84, 64),
    s('path', { d: 'M32 80h40M32 94h50M32 108h30', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 92, y: 90, width: 40, height: 12, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M112 90V56', ...SW(8) }, 'brown', { stroke: true }),
    s('circle', { cx: 112, cy: 46, r: 12 }, 'brown')
  ],
  transnacional: [
    s('circle', { cx: 70, cy: 76, r: 50 }, 'sky'),
    s('path', { d: 'M34 54q16-12 30 0q-6 18 6 26q-10 22-24 18q2-20-12-44zM84 40q20-4 30 14q-10 10-24 2zM92 96q16-8 24 8q-10 14-24-8z' }, 'green'),
    s('rect', { x: 102, y: 54, width: 36, height: 82 }, 'navy', { accent: true }),
    s('path', { d: grid(108, 62, 3, 6, 6, 6, 10, 12) }, 'yellow'),
    arrow('M18 118q50 36 112 6m-12-8l12 8-12 6', 'orange', 5)
  ],
  venado: [
    s('path', { d: 'M62 52L46 22M54 38L36 34M48 26L42 12M98 52l16-30M106 38l18-4M112 26l6-14', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M54 66q-20-4-24-14q16-2 26 6zM106 66q20-4 24-14q-16-2-26 6z' }, 'tan'),
    s('path', { d: 'M60 58q20-12 40 0l-4 50q-4 22-16 26q-12-4-16-26z' }, 'tan', { accent: true }),
    s('path', { d: 'M70 116q10 10 20 0v10q-10 8-20 0z' }, 'cream'),
    s('ellipse', { cx: 80, cy: 128, rx: 8, ry: 6 }, 'dark'),
    s('path', { d: dots([[68, 80], [92, 80]], 4) }, 'dark')
  ],
  venida: [
    ground(),
    s('rect', { x: 20, y: 34, width: 56, height: 102 }, 'brown'),
    s('rect', { x: 28, y: 42, width: 40, height: 94 }, 'yellow'),
    s('path', { d: 'M28 42l-14-6v108l14-8z' }, 'tan'),
    ...person(54, 136, 'blue', { accent: true }),
    arrow('M138 90H96m10-10l-10 10 10 10', 'green', 6)
  ],
  vinculante: [
    ...paper(30, 18, 76, 100),
    s('path', { d: 'M42 38h52M42 52h52M42 66h38', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 46, y: 80, width: 40, height: 24, rx: 12, transform: 'rotate(-30 66 92)', ...SW(8) }, 'gray', { stroke: true }),
    s('rect', { x: 74, y: 100, width: 40, height: 24, rx: 12, transform: 'rotate(-30 94 112)', ...SW(8) }, 'dark', { stroke: true }),
    s('circle', { cx: 120, cy: 50, r: 14 }, 'red', { accent: true }),
    s('path', { d: 'M114 62l-4 16 10-6 10 6-4-16', ...SW(3) }, 'red', { stroke: true })
  ],
  voleibol: [
    s('path', { d: 'M20 136V70M140 136V70', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 20, y: 72, width: 120, height: 28 }, 'cream'),
    s('path', { d: 'M20 72h120M20 100h120M40 72v28M60 72v28M80 72v28M100 72v28M120 72v28', ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 38, r: 24 }, 'yellow', { accent: true }),
    s('path', { d: 'M58 30q22 6 40-14M62 54q12-20 40-10M80 14q-8 16 0 48', ...SW(3) }, 'blue', { stroke: true }),
    s('circle', { cx: 80, cy: 38, r: 24, ...SW(2) }, 'blue', { stroke: true })
  ],
  adepto: [
    ground(),
    s('path', { d: 'M118 92V40', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M118 40h22l-6 10 6 10h-22z' }, 'orange'),
    ...person(110, 136, 'purple', { accent: true }),
    s('path', { d: busts([30, 56, 80], 136, 18, 30) }, 'blue'),
    s('path', { d: dots([[30, 96], [56, 96], [80, 96]], 8) }, 'skin')
  ],
  adulterio: [
    s('path', { d: heart(66, 70, 30) }, 'red', { accent: true }),
    s('path', { d: 'M66 40l-8 16 10 10-8 14 6 20', ...SW(5) }, 'white', { stroke: true }),
    s('circle', { cx: 114, cy: 112, r: 18, ...SW(7) }, 'yellow', { stroke: true }),
    s('path', { d: 'M108 92l6-8 6 8-6 6z' }, 'sky')
  ],
  'afectación': [
    ground(),
    ...lean(66, 136, -8, 'pink', { accent: true }),
    s('path', { d: 'M54 72q6-4 10 0M64 74q6-4 10 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M74 100l22-16', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M92 72h22v6q0 10-11 10q-11 0-11-10z' }, 'white'),
    s('path', { d: 'M92 72h22v6q0 10-11 10q-11 0-11-10zM114 74q8 0 6 8M100 76l-8 4M86 88l-6-8', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: sparkle(124, 48, 8) }, 'yellow')
  ],
  amador: [
    ground(),
    ...person(80, 136, 'blue'),
    s('path', { d: heart(80, 110, 18) }, 'red', { accent: true }),
    s('path', { d: 'M62 108q18 14 36 0', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: heart(124, 46, 7) + heart(36, 54, 6) }, 'pink')
  ],
  ametralladora: [
    s('path', { d: 'M64 96l-28 40M70 96v40M76 96l28 40', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 40, y: 72, width: 56, height: 26, rx: 4 }, 'dark', { accent: true }),
    s('rect', { x: 94, y: 78, width: 52, height: 10, rx: 3 }, 'gray'),
    s('rect', { x: 108, y: 74, width: 20, height: 18, rx: 4 }, 'gray'),
    s('path', { d: 'M40 84H20v14', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M56 98q-4 18 10 30', ...DASH(6, '4 3') }, 'yellow', { stroke: true })
  ],
  anticipo: [
    s('rect', { x: 20, y: 30, width: 72, height: 72, rx: 8 }, 'white'),
    outline({ x: 20, y: 30, width: 72, height: 72, rx: 8 }),
    s('rect', { x: 20, y: 30, width: 72, height: 18, rx: 6 }, 'red'),
    s('path', { d: rects([[30, 58, 10, 10], [46, 58, 10, 10], [62, 58, 10, 10], [30, 78, 10, 10], [46, 78, 10, 10]]) }, 'gray'),
    s('rect', { x: 62, y: 78, width: 10, height: 10 }, 'blue'),
    s('rect', { x: 76, y: 96, width: 66, height: 40, rx: 5 }, 'green', { accent: true }),
    s('circle', { cx: 109, cy: 116, r: 10 }, 'mint'),
    arrow('M138 66h-34m10-10l-10 10 10 10', 'orange', 5)
  ],
  asfixia: [
    s('path', { d: 'M80 26v34M80 52l-12 10M80 52l12 10', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M68 58q-30 0-36 40q-4 30 18 30q18 0 18-20z' }, 'pink', { accent: true }),
    s('path', { d: 'M92 58q30 0 36 40q4 30-18 30q-18 0-18-20z' }, 'pink'),
    s('path', { d: 'M34 98q0-14 16-14q4-10 16-8q10-8 20 0q14-4 18 8q22 0 22 14q0 14-18 14H52q-18 0-18-14z' }, 'gray'),
    s('path', { d: 'M28 28l10 10M24 46h12M132 28l-10 10M136 46h-12', ...SW(4) }, 'red', { stroke: true })
  ],
  asombrar: [
    s('path', { d: sparkle(26, 30, 10) + sparkle(134, 34, 9) + sparkle(132, 128, 7) }, 'yellow'),
    s('circle', { cx: 80, cy: 82, r: 52 }, 'yellow', { accent: true }),
    s('path', { d: dots([[60, 72], [100, 72]], 12) }, 'white'),
    s('path', { d: dots([[60, 72], [100, 72]], 6) }, 'dark'),
    s('path', { d: 'M46 50q12-12 26-6M88 44q14-6 26 6', ...SW(5) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 80, cy: 110, rx: 11, ry: 13 }, 'dark')
  ],
  astuto: [
    s('path', { d: 'M38 26l14 42-26 4zM122 26l-14 42 26 4z' }, 'orange'),
    s('path', { d: 'M24 64q56-24 112 0l-56 72z' }, 'orange', { accent: true }),
    s('path', { d: 'M24 64l56 72-10-50zM136 64l-56 72 10-50z' }, 'white'),
    s('path', { d: 'M52 78q10-6 18 2M90 80q8-8 18-2', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 132, r: 7 }, 'dark'),
    s('path', { d: 'M36 34l12 30M124 34l-12 30', ...SW(4) }, 'dark', { stroke: true })
  ],
  atrevido: [
    s('path', { d: 'M14 146V96h40l6 50zM146 146V96h-40l-6 50z' }, 'brown'),
    s('path', { d: 'M14 96h40M106 96h40', ...SW(4) }, 'green', { stroke: true }),
    ...lean(78, 82, 40, 'red', { accent: true }),
    s('path', { d: 'M78 82l-18 4M78 82l8 14', ...SW(7) }, 'navy', { stroke: true }),
    s('path', { d: 'M70 54l-14-14M94 50l16-12', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M30 70q20-30 46-30', ...DASH(3, '4 5') }, 'gray', { stroke: true })
  ],
  avecinar: [
    s('path', { d: 'M18 64q0-20 22-20q8-16 26-12q18-6 28 10q22 0 22 22z' }, 'dark', { accent: true }),
    s('path', { d: 'M30 74l-6 14M50 74l-6 14M70 74l-6 14M90 74l-6 14', ...SW(3) }, 'blue', { stroke: true }),
    arrow('M90 104h20m-8-8l8 8-8 8', 'orange', 5),
    s('path', { d: 'M112 136V108l16-14 16 14v28z' }, 'yellow'),
    s('rect', { x: 123, y: 118, width: 10, height: 18 }, 'brown'),
    ground()
  ],
  bajista: [
    s('path', { d: 'M44 128q-18-8-10-28q8-12 22-8q8-14 24-8q14 8 4 22q12 14-4 26q-18 10-36-4z' }, 'red', { accent: true }),
    s('path', { d: 'M62 108L126 28', ...SW(8) }, 'brown', { stroke: true }),
    s('rect', { x: 120, y: 12, width: 14, height: 26, rx: 3, transform: 'rotate(39 127 25)' }, 'dark'),
    s('path', { d: 'M54 110L120 26M60 114L126 30', ...SW(1.5) }, 'gray', { stroke: true }),
    s('rect', { x: 48, y: 108, width: 22, height: 8, rx: 2, transform: 'rotate(-51 59 112)' }, 'dark'),
    s('path', { d: 'M28 30v20l-6 4M28 30l8 4', ...SW(4) }, 'blue', { stroke: true })
  ],
  balsa: [
    s('rect', { x: 14, y: 114, width: 132, height: 30, rx: 8 }, 'sky'),
    s('path', { d: ells([[80, 110, 50, 6], [80, 120, 50, 6]]) }, 'brown', { accent: true }),
    s('path', { d: 'M50 104v24M110 104v24', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M80 106V30', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M82 34q36 20 0 62z' }, 'cream'),
    s('path', { d: 'M82 34q36 20 0 62z', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M20 136q10-6 20 0M110 138q10-6 20 0', ...SW(3) }, 'white', { stroke: true })
  ],
  'bañar': [
    s('path', { d: dots([[42, 70], [58, 64], [100, 64], [118, 70], [80, 60], [70, 52]], 10) }, 'white'),
    s('path', { d: dots([[42, 70], [58, 64], [100, 64], [118, 70], [80, 60], [70, 52]], 10), ...SW(2) }, 'sky', { stroke: true }),
    s('circle', { cx: 80, cy: 52, r: 16 }, 'skin'),
    s('path', { d: 'M22 76h116v20q0 26-30 26H52q-30 0-30-26z' }, 'blue', { accent: true }),
    s('path', { d: 'M40 120l-6 14M120 120l6 14', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M126 76V36q0-10 10-10', ...SW(5) }, 'gray', { stroke: true })
  ],
  bel: [
    s('path', { d: 'M20 60h20l24-22v84L40 100H20z' }, 'dark', { accent: true }),
    s('path', { d: rects([[78, 98, 12, 24], [96, 82, 12, 40], [114, 64, 12, 58], [132, 44, 12, 78]]) }, 'green'),
    s('path', { d: rects([[132, 44, 12, 24]]) }, 'red'),
    s('path', { d: 'M74 132h72', ...SW(3) }, 'gray', { stroke: true })
  ],
  bocina: [
    s('path', { d: 'M30 72h16l50-30v76L46 88H30z' }, 'orange', { accent: true }),
    s('rect', { x: 24, y: 68, width: 12, height: 24, rx: 4 }, 'dark'),
    s('ellipse', { cx: 96, cy: 80, rx: 8, ry: 38 }, 'yellow'),
    s('path', { d: 'M112 62q8 18 0 36M124 50q14 30 0 60M136 40q18 40 0 80', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M46 88q-4 30 20 40', ...SW(5) }, 'gray', { stroke: true })
  ],
  bucle: [
    s('path', { d: 'M18 120h30q40 0 40-36a24 24 0 1 0-48 0q0 36 40 36h62', ...SW(8) }, 'blue', { stroke: true }),
    s('path', { d: 'M124 108l18 12-18 12z' }, 'blue', { accent: true }),
    s('path', { d: dots([[64, 60]], 6) }, 'orange')
  ],
  bula: [
    s('rect', { x: 30, y: 18, width: 84, height: 96, rx: 3 }, 'cream'),
    s('rect', { x: 30, y: 18, width: 84, height: 96, rx: 3, ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M42 38h60M42 52h60M42 66h60M42 80h40', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M72 114l-8 14M72 114l8 14', ...SW(3) }, 'red', { stroke: true }),
    s('circle', { cx: 72, cy: 132, r: 14 }, 'gray', { accent: true }),
    s('circle', { cx: 72, cy: 132, r: 8 }, 'dark')
  ],
  cactus: [
    s('path', { d: 'M54 116h52l-6 24H60z' }, 'orange'),
    s('rect', { x: 68, y: 26, width: 24, height: 92, rx: 12 }, 'green', { accent: true }),
    s('path', { d: 'M70 82H54q-8 0-8-8V54M90 70h16q8 0 8-8V44', ...SW(14) }, 'green', { stroke: true }),
    s('path', { d: 'M80 36v74M54 56v12M114 46v12', ...SW(2) }, 'mint', { stroke: true }),
    s('path', { d: dots([[80, 22]], 6) }, 'pink')
  ],
  caducidad: [
    s('path', { d: 'M24 56l14-20h40l-14 20z' }, 'sky'),
    s('rect', { x: 24, y: 56, width: 54, height: 80, rx: 2 }, 'white'),
    outline({ x: 24, y: 56, width: 54, height: 80, rx: 2 }),
    s('path', { d: drop(51, 96, 10) }, 'sky'),
    s('path', { d: 'M94 44h44M94 128h44', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M98 46h36q0 26-18 40q18 14 18 40H98q0-26 18-40q-18-14-18-40z' }, 'cream'),
    s('path', { d: 'M104 126q0-16 12-22q12 6 12 22z' }, 'red', { accent: true }),
    s('path', { d: 'M98 46h36q0 26-18 40q18 14 18 40H98q0-26 18-40q-18-14-18-40z', ...SW(3) }, 'gray', { stroke: true })
  ],
  canalizar: [
    s('path', { d: 'M20 30h120L92 84v20H68V84z' }, 'gray', { accent: true }),
    s('path', { d: drop(48, 20, 5) + drop(80, 22, 6) + drop(112, 20, 5) }, 'blue'),
    s('path', { d: 'M28 34h104l-44 44', ...SW(3) }, 'white', { stroke: true }),
    s('rect', { x: 64, y: 112, width: 32, height: 34, rx: 2 }, 'brown'),
    s('path', { d: 'M80 104v40', ...SW(10) }, 'blue', { stroke: true })
  ],
  carbohidrato: [
    s('path', { d: 'M22 98q0-30 34-30q34 0 34 30v32H22z' }, 'tan', { accent: true }),
    s('path', { d: 'M38 82l8 14M54 78l8 14M70 82l8 14', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: ells([[114, 84, 22, 14]]) }, 'white'),
    s('path', { d: ells([[114, 84, 22, 14]]), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M88 90h52q0 30-26 34q-26-4-26-34z' }, 'blue'),
    s('path', { d: 'M110 72l12-30M118 74l14-28', ...SW(3) }, 'brown', { stroke: true })
  ],
  chic: [
    s('path', { d: 'M22 72q0-12 58-12q58 0 58 12q0 10-58 10q-58 0-58-10z' }, 'black', { accent: true }),
    s('path', { d: 'M52 66q0-34 28-34q28 0 28 34z' }, 'black'),
    s('path', { d: 'M52 58h56', ...SW(7) }, 'pink', { stroke: true }),
    s('path', { d: 'M38 112h34l-4 12q-12 6-24 0zM88 112h34l-4 12q-12 6-24 0zM72 114h16', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[52, 132], [80, 140], [108, 132]], 4) }, 'cream'),
    s('path', { d: sparkle(126, 32, 9) }, 'yellow')
  ],
  colateral: [
    arrow('M18 80h104m-14-14l14 14-14 14', 'blue', 8),
    s('path', { d: burst(132, 80, 16, 8, 8) }, 'red', { accent: true }),
    s('path', { d: 'M60 80q10-30 30-42M60 80q10 30 30 42', ...DASH(3, '4 4') }, 'orange', { stroke: true }),
    s('path', { d: dots([[96, 34], [96, 126]], 8) }, 'orange')
  ],
  'coloración': [
    s('path', { d: 'M80 22q56 0 58 50q0 20-20 20q-14 0-14 14q0 22-26 22q-58 0-58-52q0-54 60-54z' }, 'tan'),
    s('path', { d: dots([[52, 58]], 10) }, 'red'),
    s('path', { d: dots([[78, 44]], 10) }, 'yellow'),
    s('path', { d: dots([[106, 52]], 10) }, 'green'),
    s('path', { d: dots([[46, 90]], 10) }, 'blue', { accent: true }),
    s('circle', { cx: 74, cy: 104, r: 8 }, 'white'),
    s('path', { d: 'M150 150L104 100', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M104 100l-6-8 6 2 2 6z', ...SW(6) }, 'purple', { stroke: true })
  ],
  copado: [
    s('circle', { cx: 72, cy: 72, r: 48 }, 'yellow', { accent: true }),
    s('path', { d: 'M34 60h76M38 60q0 18 14 18q12 0 14-18M78 60q2 18 14 18q14 0 14-18', ...SW(4) }, 'black', { stroke: true }),
    s('path', { d: 'M38 60q0 18 14 18q12 0 14-18zM78 60q2 18 14 18q14 0 14-18z' }, 'black'),
    s('path', { d: 'M54 94q18 16 40 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M110 138h22q8 0 8-8v-18q0-6-8-6h-10l4-14q0-8-8-8l-12 24v30z' }, 'skin'),
    s('path', { d: 'M110 138h22q8 0 8-8v-18q0-6-8-6h-10l4-14q0-8-8-8l-12 24v30z', ...SW(2) }, 'tan', { stroke: true })
  ],
  culata: [
    s('path', { d: 'M20 112l50-22h20v18H74l-46 22q-10 4-12-6z' }, 'brown', { accent: true }),
    s('rect', { x: 88, y: 88, width: 34, height: 18, rx: 2 }, 'dark'),
    s('path', { d: 'M120 92h26', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M94 106q2 12 12 12', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 116l40-18', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M40 52q18-14 34-10', ...DASH(3, '4 5') }, 'gray', { stroke: true }),
    arrow('M44 52l-8 34', 'orange', 4)
  ],
  despensa: [
    s('rect', { x: 20, y: 18, width: 120, height: 124, rx: 4 }, 'tan'),
    s('path', { d: 'M20 60h120M20 102h120', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: rects([[30, 30, 18, 28], [52, 34, 18, 24], [30, 72, 22, 28], [114, 72, 18, 28]]) }, 'red', { accent: true }),
    s('path', { d: rects([[78, 26, 24, 32], [58, 76, 20, 24], [86, 116, 26, 24]]) }, 'yellow'),
    s('path', { d: rects([[108, 30, 22, 28], [86, 72, 22, 28], [30, 114, 22, 26], [56, 116, 22, 24]]) }, 'green'),
    s('path', { d: 'M30 42h18M30 86h22M108 42h22', ...SW(3) }, 'cream', { stroke: true })
  ],
  destinatario: [
    s('rect', { x: 16, y: 40, width: 66, height: 46, rx: 4 }, 'white'),
    s('path', { d: 'M16 44l33 24 33-24M18 40h62q2 0 2 4v38q0 4-4 4H20q-4 0-4-4V44q0-4 2-4z', ...SW(3) }, 'gray', { stroke: true }),
    arrow('M50 100q20 30 50 16m-10-10l10 10-12 6', 'orange', 4),
    ...person(118, 136, 'green', { accent: true }),
    s('path', { d: 'M106 50l12 10 16-20', ...SW(5) }, 'green', { stroke: true })
  ],
  discutible: [
    s('path', { d: 'M80 32v96M54 136h52M30 54h100', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 54l-14 36h28zM130 54l-14 36h28z' }, 'gray'),
    s('path', { d: 'M14 90a16 8 0 0 0 32 0zM114 90a16 8 0 0 0 32 0z' }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 28, r: 8 }, 'orange'),
    s('path', { d: 'M58 40q22-12 44 0M102 40l-6-4M58 40l6-4', ...SW(3) }, 'orange', { stroke: true })
  ],
  diva: [
    s('path', { d: star(28, 36, 10) + star(132, 30, 8) + star(130, 112, 6) }, 'yellow'),
    ...lady(70, 136, 'purple', { accent: true }),
    s('path', { d: 'M46 140h48', ...SW(4) }, 'purple', { stroke: true }),
    s('path', { d: 'M78 92l22-24', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M98 70l10-12', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 110, cy: 56, r: 7 }, 'gray')
  ],
  'embrión': [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'pink'),
    s('circle', { cx: 80, cy: 80, r: 50 }, 'cream'),
    s('path', { d: 'M96 70q4 34-22 40q-20 2-24-14', ...SW(18) }, 'skin', { stroke: true, accent: true }),
    s('circle', { cx: 82, cy: 58, r: 20 }, 'skin'),
    s('circle', { cx: 76, cy: 56, r: 3 }, 'dark'),
    s('path', { d: 'M100 96q14 4 22-8', ...SW(3) }, 'red', { stroke: true })
  ],
  envenenamiento: [
    s('path', { d: 'M80 44q-20-14-38 0q-22 18-12 52q10 34 34 36q8 0 16-4q8 4 16 4q24-2 34-36q10-34-12-52q-18-14-38 0z' }, 'red', { accent: true }),
    s('path', { d: 'M80 44q0-14 8-24', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M86 30q14-12 28-4q-14 12-28 4z' }, 'green'),
    s('path', { d: 'M54 60q12-8 26 0q2 16-6 20q-2 14-10 2q-14-6-10-22z' }, 'green'),
    s('path', { d: drop(68, 110, 6) + drop(56, 140, 4) }, 'green'),
    s('path', { d: dots([[110, 70], [100, 92]], 4) }, 'white')
  ],
  'erradicación': [
    s('rect', { x: 14, y: 104, width: 132, height: 40, rx: 6 }, 'brown'),
    s('path', { d: 'M80 52v44M80 96l-12 14M80 96l12 16M80 100v14', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: leaflet(80, 60, 210, 30, 10) + leaflet(80, 52, -30, 30, 10) + leaflet(80, 52, -90, 22, 8) }, 'green', { accent: true }),
    s('path', { d: 'M90 50q20 -10 40-4', ...SW(10) }, 'skin', { stroke: true }),
    s('ellipse', { cx: 84, cy: 50, rx: 10, ry: 12 }, 'skin'),
    arrow('M44 92V58m-8 8l8-8 8 8', 'orange', 4),
    s('path', { d: dots([[62, 104], [98, 108], [80, 120]], 4) }, 'dark')
  ],
};
