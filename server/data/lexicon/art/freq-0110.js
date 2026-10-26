// Illustration specs for words still undrawn in batches 0109–0110 (see server/scripts/lexicon/art.js)
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
  misiva: [
    ...paper(22, 42, 116, 78),
    s('path', { d: 'M22 42l58 42 58-42', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M22 120l42-36M138 120l-42-36', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 86, r: 13 }, 'red', { accent: true }),
    s('path', { d: 'M74 86l6-6 6 6-6 6z' }, 'white')
  ],
  mordisco: [
    s('path', { d: 'M80 48q-20-14-40-2q-22 16-14 52q10 38 34 38q10 0 20-6q10 6 20 6q24 0 34-38q8-36-14-52q-20-12-40 2z' }, 'red', { accent: true }),
    s('path', { d: dots([[132, 70], [138, 94], [130, 116]], 13) }, 'white'),
    s('path', { d: 'M119 66a13 13 0 0 0 6 16a13 13 0 0 0 0 24a13 13 0 0 0-6 10', ...SW(5) }, 'cream', { stroke: true }),
    s('path', { d: 'M80 48q0-14 8-24', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(86, 30, -20, 26, 8) }, 'green')
  ],
  ninfa: [
    s('path', { d: ells([[58, 74, 14, 26], [102, 74, 14, 26]]) }, 'sky'),
    ...lady(80, 126, 'mint', { accent: true }),
    s('path', { d: 'M18 134q10-6 20 0t20 0 20 0 20 0 20 0 20 0', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: sparkle(34, 36, 8) + sparkle(126, 34, 8) + sparkle(130, 104, 6) }, 'yellow')
  ],
  nochevieja: [
    backdrop('navy'),
    s('path', { d: rays(44, 44, 6, 22, 10), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: rays(118, 40, 5, 18, 8, 20), ...SW(4) }, 'pink', { stroke: true }),
    s('circle', { cx: 80, cy: 98, r: 32 }, 'white', { accent: true }),
    s('path', { d: dots(around(80, 98, 25, 12, -90), 2.5) }, 'gray'),
    s('path', { d: 'M80 98V74M80 98l-3-16', ...SW(5) }, 'dark', { stroke: true })
  ],
  noguera: [
    ...tree(80, 'green', 'brown', { accent: true }),
    s('path', { d: dots([[60, 56], [84, 46], [100, 70], [66, 80], [108, 50], [52, 90], [104, 88]], 6) }, 'tan'),
    ground(),
    s('path', { d: ells([[40, 130, 7, 6], [122, 130, 7, 6]]) }, 'brown'),
    s('path', { d: 'M40 124v12M122 124v12', ...SW(2) }, 'dark', { stroke: true })
  ],
  pacer: [
    s('rect', { x: 14, y: 124, width: 132, height: 14, rx: 4 }, 'green'),
    s('path', { d: 'M42 96v30M56 98v28M86 98v28M98 96v30', ...SW(7) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 70, cy: 86, rx: 40, ry: 20 }, 'brown', { accent: true }),
    s('path', { d: ells([[56, 82, 9, 7], [86, 92, 8, 6]]) }, 'white'),
    s('ellipse', { cx: 118, cy: 108, rx: 12, ry: 18, transform: 'rotate(-30 118 108)' }, 'brown'),
    s('path', { d: 'M108 90l-6-8M118 88l2-10', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M124 124l-4-12M132 124v-14M140 124l4-10', ...SW(4) }, 'green', { stroke: true })
  ],
  panacea: [
    s('rect', { x: 68, y: 22, width: 24, height: 14, rx: 3 }, 'brown'),
    s('rect', { x: 72, y: 34, width: 16, height: 14 }, 'sky'),
    s('rect', { x: 48, y: 46, width: 64, height: 88, rx: 14 }, 'purple', { accent: true }),
    s('rect', { x: 56, y: 70, width: 48, height: 40, rx: 4 }, 'cream'),
    s('path', { d: heart(80, 84, 14) }, 'red'),
    s('path', { d: sparkle(30, 54, 10) + sparkle(130, 44, 9) + sparkle(132, 112, 7) }, 'yellow')
  ],
  parental: [
    ...person(42, 138, 'blue', { h: 52 }),
    ...person(118, 138, 'red', { h: 52 }),
    ...person(80, 138, 'yellow', { h: 30, w: 22, r: 10, accent: true }),
    s('path', { d: 'M56 112h12M92 112h12', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 40, 12) }, 'pink')
  ],
  'pasantía': [
    s('rect', { x: 92, y: 26, width: 50, height: 110, rx: 3 }, 'gray'),
    s('path', { d: grid(100, 36, 3, 6, 9, 10, 13, 16) }, 'sky'),
    s('rect', { x: 26, y: 96, width: 12, height: 26, rx: 4 }, 'orange'),
    ...person(46, 138, 'green', { accent: true }),
    s('path', { d: 'M66 62h14', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M78 54l10 8-10 8z' }, 'orange')
  ],
  pechuga: [
    s('ellipse', { cx: 80, cy: 102, rx: 64, ry: 30 }, 'white'),
    s('ellipse', { cx: 80, cy: 102, rx: 64, ry: 30, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 96q0-28 40-34q42 0 44 26q0 22-40 24q-44 0-44-16z' }, 'tan', { accent: true }),
    s('path', { d: 'M56 82l10 22M74 76l12 28M94 76l10 24', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(116, 112, -20, 22, 6) + leaflet(116, 112, 20, 18, 5) }, 'green'),
    s('path', { d: 'M110 22q16 10 6 26M126 20q14 12 4 26', ...SW(3) }, 'gray', { stroke: true })
  ],
  pensante: [
    ...person(54, 138, 'blue', { accent: true }),
    s('path', { d: 'M66 104l2-14', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: dots([[78, 64], [88, 54]], 3) + dots([[96, 44]], 5) }, 'gray'),
    s('path', { d: ells([[116, 34, 22, 16], [100, 32, 10, 10], [132, 32, 10, 10]]) }, 'sky'),
    ...gear(116, 34, 7, 8, 'navy')
  ],
  piscis: [
    s('path', { d: 'M112 54q34 24 2 54M48 54q-34 24-2 54', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[84, 52, 28, 14]]) + 'M60 52l-18-13v26z' }, 'blue', { accent: true }),
    s('path', { d: ells([[76, 108, 28, 14]]) + 'M100 108l18-13v26z' }, 'purple'),
    s('path', { d: dots([[100, 48], [60, 104]], 3) }, 'dark'),
    s('path', { d: star(28, 28, 7) + star(134, 132, 6) + star(134, 24, 4) }, 'yellow')
  ],
  planicie: [
    backdrop('sky', 14, 86),
    s('rect', { x: 14, y: 94, width: 132, height: 52, rx: 4 }, 'green', { accent: true }),
    s('circle', { cx: 112, cy: 50, r: 16 }, 'yellow'),
    s('path', { d: 'M26 110h18M70 120h24M110 106h22M40 132h20M100 134h28', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: 'M30 34q6-6 12 0q6-6 12 0', ...SW(3) }, 'white', { stroke: true })
  ],
  polarizar: [
    s('path', { d: busts([26, 46], 136, 18, 30) }, 'blue', { accent: true }),
    s('path', { d: busts([114, 134], 136, 18, 30) }, 'red'),
    s('path', { d: dots([[26, 98], [46, 98], [114, 98], [134, 98]], 8) }, 'skin'),
    s('path', { d: 'M80 30v106', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 56H38M90 56h32', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M40 46l-12 10 12 10zM120 46l12 10-12 10z' }, 'orange')
  ],
  pontificado: [
    s('path', { d: 'M34 138V44a12 12 0 0 1 24 0', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M68 132V78q0-34 30-56q30 22 30 56v54z' }, 'cream'),
    s('path', { d: 'M68 132V78q0-34 30-56q30 22 30 56v54z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M98 24v108M68 104h60', ...SW(8) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M98 52v24M88 62h20', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M76 132l-4 10h12l-2-10zM112 132l2 10h12l-4-10z' }, 'red')
  ],
  'pregón': [
    ...person(54, 138, 'red', { accent: true }),
    s('path', { d: 'M44 64h20l-4-14h-12z' }, 'dark'),
    s('path', { d: 'M66 106l24-30', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M86 76q0-22 14-22t14 22l4 6h-36z' }, 'yellow'),
    s('circle', { cx: 100, cy: 86, r: 4 }, 'brown'),
    s('path', { d: 'M126 52q8 12 0 24M136 44q14 20 0 40', ...SW(4) }, 'orange', { stroke: true })
  ],
  'prevaricación': [
    s('rect', { x: 26, y: 118, width: 60, height: 14, rx: 4 }, 'brown'),
    s('rect', { x: 34, y: 46, width: 54, height: 24, rx: 6, transform: 'rotate(-30 61 58)' }, 'brown', { accent: true }),
    s('path', { d: 'M68 70l40 52', ...SW(8) }, 'tan', { stroke: true }),
    s('rect', { x: 96, y: 34, width: 48, height: 28, rx: 3, transform: 'rotate(12 120 48)' }, 'green'),
    s('circle', { cx: 120, cy: 48, r: 7 }, 'mint'),
    s('path', { d: dots([[110, 126], [128, 124]], 9) }, 'yellow')
  ],
  primaveral: [
    s('rect', { x: 14, y: 132, width: 132, height: 10, rx: 4 }, 'green'),
    ...flower(48, 84, 'pink'),
    s('circle', { cx: 116, cy: 40, r: 14 }, 'yellow'),
    s('path', { d: rays(116, 40, 20, 28, 8), ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: ells([[104, 98, 9, 12], [120, 98, 9, 12]]) }, 'purple')
  ],
  procrear: [
    s('path', { d: 'M24 94h112q-6 40-56 40t-56-40z' }, 'brown', { accent: true }),
    s('path', { d: 'M30 102q50 12 100 0M36 116q44 10 88 0', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: ells([[54, 88, 12, 16], [106, 88, 12, 16]]) }, 'cream'),
    s('circle', { cx: 80, cy: 80, r: 16 }, 'yellow'),
    s('path', { d: 'M94 78l10 4-10 4z' }, 'orange'),
    s('circle', { cx: 84, cy: 76, r: 2.5 }, 'dark'),
    s('path', { d: heart(80, 36, 14) }, 'pink')
  ],
  profesionista: [
    ...person(70, 138, 'navy', { h: 50, w: 36 }),
    s('path', { d: 'M62 88l8 14 8-14z' }, 'white'),
    s('path', { d: 'M68 94h4l3 26-5 5-5-5z' }, 'red', { accent: true }),
    s('rect', { x: 100, y: 108, width: 38, height: 28, rx: 4 }, 'brown'),
    s('path', { d: 'M112 108v-6h14v6', ...SW(4) }, 'dark', { stroke: true })
  ],
  quijada: [
    backdrop('sky'),
    s('path', { d: 'M38 44q0 88 42 88t42-88', ...SW(26) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 44q0 88 42 88t42-88', ...SW(20) }, 'white', { stroke: true, accent: true }),
    s('path', { d: dots(qpts([46, 64], [52, 116], [80, 116], 3).concat(qpts([114, 64], [108, 116], [80, 116], 3)), 5) }, 'cream'),
    s('path', { d: dots(qpts([46, 64], [52, 116], [80, 116], 3).concat(qpts([114, 64], [108, 116], [80, 116], 3)), 5), ...SW(2) }, 'gray', { stroke: true })
  ],
  'radicalización': [
    s('path', { d: wedge(80, 116, 64, 180, 240) }, 'green'),
    s('path', { d: wedge(80, 116, 64, 240, 300) }, 'yellow'),
    s('path', { d: wedge(80, 116, 64, 300, 360) }, 'red', { accent: true }),
    s('path', { d: 'M40 116a40 40 0 0 1 80 0z' }, 'white'),
    s('path', { d: 'M80 116l54-26', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 116, r: 9 }, 'dark'),
    s('path', { d: 'M16 132h128', ...SW(4) }, 'gray', { stroke: true })
  ],
  'recaída': [
    ...face(64, 88, 38, 'mint', 'frown', { accent: true }),
    s('path', { d: 'M86 108l26-34', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 116, cy: 69, r: 7 }, 'red'),
    s('path', { d: 'M110 30a24 24 0 1 1-26 26', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M74 52l10 12 8-14z' }, 'orange')
  ],
  'reedición': [
    s('rect', { x: 20, y: 46, width: 46, height: 72, rx: 4 }, 'blue'),
    s('rect', { x: 20, y: 46, width: 10, height: 72, rx: 3 }, 'navy'),
    s('rect', { x: 94, y: 46, width: 46, height: 72, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 94, y: 46, width: 10, height: 72, rx: 3 }, 'navy'),
    s('path', { d: 'M38 66h20M38 76h14M112 66h20M112 76h14', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M70 82h16', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M84 74l8 8-8 8z' }, 'orange'),
    s('path', { d: sparkle(134, 36, 10) }, 'yellow')
  ],
  remolino: [
    s('circle', { cx: 80, cy: 80, r: 64 }, 'blue'),
    s('path', { d: 'M80 80a5 5 0 0 1 10 0a12 12 0 0 1-24 0a19 19 0 0 1 38 0a26 26 0 0 1-52 0a33 33 0 0 1 66 0a40 40 0 0 1-80 0a47 47 0 0 1 94 0', ...SW(6) }, 'sky', { stroke: true, accent: true }),
    s('path', { d: leaflet(112, 44, 30, 16, 5) }, 'green')
  ],
  'repulsión': [
    ...lean(52, 138, -14, 'blue', { accent: true }),
    s('path', { d: 'M60 104l26-10', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 90, cy: 92, r: 8 }, 'skin'),
    s('path', { d: 'M104 96h36l-4 40h-28z' }, 'gray'),
    s('rect', { x: 100, y: 88, width: 44, height: 8, rx: 3 }, 'dark'),
    s('path', { d: 'M112 80q-6-8 0-16t0-16M124 80q-6-8 0-16t0-16M136 80q-6-8 0-16', ...SW(4) }, 'green', { stroke: true })
  ],
  resbalar: [
    s('ellipse', { cx: 82, cy: 136, rx: 60, ry: 8 }, 'sky'),
    ...lean(70, 128, -42, 'orange', { accent: true }),
    s('path', { d: 'M70 128l30-24M74 130l34-12', ...SW(8) }, 'navy', { stroke: true }),
    s('path', { d: 'M110 132q8-10 16-4q-2-8 8-10q-2 10 6 14z' }, 'yellow'),
    s('path', { d: 'M38 58l12 8M30 76h14M118 62l-10 10', ...SW(4) }, 'gray', { stroke: true })
  ],
  restituir: [
    ...person(30, 138, 'blue'),
    ...person(130, 138, 'green'),
    s('path', { d: 'M44 108h20M116 108H96', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 62, y: 96, width: 36, height: 24, rx: 4 }, 'brown', { accent: true }),
    s('path', { d: 'M114 70q-34-30-64 0', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M44 62l2 16 14-8z' }, 'orange')
  ],
  retardo: [
    s('circle', { cx: 60, cy: 58, r: 38 }, 'white'),
    outline({ cx: 60, cy: 58, r: 38 }, 'gray', 5),
    s('path', { d: 'M60 58V32M60 58l18 10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 134h60q0-14-14-14h-26z' }, 'tan'),
    s('circle', { cx: 112, cy: 110, r: 20 }, 'orange', { accent: true }),
    s('path', { d: spiral(108, 110), ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M134 120l2-16M140 122l6-14', ...SW(3) }, 'tan', { stroke: true })
  ],
  reventa: [
    s('path', { d: 'M20 60h88v12a8 8 0 0 0 0 16v12H20V88a8 8 0 0 0 0-16z', transform: 'rotate(-10 64 80)' }, 'orange', { accent: true }),
    s('path', { d: 'M88 62v40', ...DASH(3, '4 4'), transform: 'rotate(-10 64 80)' }, 'white', { stroke: true }),
    s('path', { d: star(50, 80, 12) }, 'yellow'),
    s('path', { d: 'M126 132V44', ...SW(7) }, 'red', { stroke: true }),
    s('path', { d: 'M112 50l14-20 14 20z' }, 'red'),
    s('path', { d: ells([[100, 132, 14, 5], [100, 124, 14, 5], [100, 116, 14, 5]]) }, 'yellow')
  ],
  rigurosamente: [
    s('rect', { x: 14, y: 98, width: 116, height: 26, rx: 3, transform: 'rotate(-8 72 111)' }, 'yellow'),
    s('path', { d: 'M24 100v10M36 98v6M48 96v10M60 94v6M72 92v10M84 90v6M96 88v10M108 86v6', ...SW(3), transform: 'rotate(-8 72 111) translate(0 6)' }, 'dark', { stroke: true }),
    s('circle', { cx: 92, cy: 56, r: 26 }, 'sky'),
    outline({ cx: 92, cy: 56, r: 26 }, 'navy', 7),
    s('path', { d: 'M112 76l24 24', ...SW(10) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M80 56l8 9 16-18', ...SW(5) }, 'green', { stroke: true })
  ],
  rompimiento: [
    s('path', { d: 'M14 96a14 14 0 0 1 0-28h18a14 14 0 0 1 0 28z', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M56 70H44a14 14 0 0 0 0 28h12M104 70h12a14 14 0 0 1 0 28h-12', ...SW(8) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: 'M146 96a14 14 0 0 1 0-28', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: burst(80, 84, 20, 8, 8) }, 'orange'),
    s('path', { d: 'M72 50l-6-10M88 50l6-10M72 118l-6 10M88 118l6 10', ...SW(4) }, 'red', { stroke: true })
  ],
  saciar: [
    ...person(80, 138, 'orange', { w: 52, h: 46, accent: true }),
    s('path', { d: 'M72 72q4-3 8 0M84 72q4-3 8 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M72 82q8 7 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 118q22 10 44 0', ...SW(7) }, 'skin', { stroke: true }),
    s('ellipse', { cx: 30, cy: 132, rx: 18, ry: 5 }, 'gray'),
    s('path', { d: 'M124 98h20l-3 38h-14z' }, 'sky')
  ],
  suboficial: [
    s('path', { d: 'M14 30h132v100H14z' }, 'green'),
    s('path', { d: 'M46 40h68v62l-34 22-34-22z' }, 'navy', { accent: true }),
    s('path', { d: 'M56 70l24-16 24 16M56 86l24-16 24 16M56 102l24-16 24 16', ...SW(7) }, 'yellow', { stroke: true }),
    s('path', { d: 'M14 136h132', ...SW(5) }, 'dark', { stroke: true })
  ],
  'síndico': [
    s('ellipse', { cx: 58, cy: 104, rx: 40, ry: 28 }, 'pink', { accent: true }),
    s('path', { d: 'M34 126v10h10v-12zM70 124v12h10v-10zM34 82l-4-14 16 8z' + ells([[98, 102, 7, 10]]) }, 'pink'),
    s('path', { d: dots([[97, 98], [97, 106]], 2) + dots([[84, 92]], 3) }, 'dark'),
    s('path', { d: 'M48 76h20', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 78l-6 14 8 6-6 14 6 12', ...SW(3) }, 'dark', { stroke: true }),
    ...person(124, 138, 'gray', { h: 50, w: 28 }),
    ...paper(98, 92, 22, 28)
  ],
  'súbitamente': [
    s('rect', { x: 46, y: 96, width: 68, height: 40, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M46 96l-20-16M114 96l20-16', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M80 96l-12-6 24-6-24-6 24-6-12-6', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 50, r: 20 }, 'yellow'),
    s('circle', { cx: 80, cy: 58, r: 5 }, 'dark'),
    s('path', { d: dots([[73, 46], [87, 46]], 3) }, 'dark'),
    s('path', { d: rays(80, 50, 28, 38, 7, 200), ...SW(4) }, 'orange', { stroke: true })
  ],
  'súplica': [
    s('path', { d: halfRays(80, 40, 18, 30, 5), ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 72, cy: 66, r: 13 }, 'skin'),
    s('rect', { x: 56, y: 80, width: 30, height: 36, rx: 10 }, 'purple', { accent: true }),
    s('rect', { x: 56, y: 112, width: 56, height: 22, rx: 10 }, 'purple'),
    s('path', { d: 'M80 92l16-12 0-16', ...SW(7) }, 'skin', { stroke: true }),
    ground(136)
  ],
  'torácico': [
    backdrop('navy'),
    s('path', { d: 'M48 28h64q12 40 4 108H44q-8-68 4-108z' }, 'blue'),
    s('path', { d: 'M76 46q-26 0-30 10M76 62q-30 0-34 12M76 78q-30 0-34 12M76 94q-28 0-30 12M84 46q26 0 30 10M84 62q30 0 34 12M84 78q30 0 34 12M84 94q28 0 30 12', ...SW(5) }, 'white', { stroke: true }),
    s('rect', { x: 74, y: 38, width: 12, height: 64, rx: 5 }, 'white', { accent: true }),
    s('path', { d: 'M80 104v30', ...DASH(6, '5 3') }, 'sky', { stroke: true })
  ],
  usurpador: [
    s('path', { d: 'M24 128l6-18h52l6 18z' }, 'red'),
    s('path', { d: 'M38 104l-6-30 16 14 10-22 10 22 16-14-6 30z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[48, 96], [58, 92], [68, 96]], 3) }, 'red'),
    s('path', { d: 'M146 40l-46 26', ...SW(18) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 56l-20 4 2 10 14 4 8-6z' }, 'skin'),
    s('path', { d: 'M120 100q-14 14-36 10', ...SW(4) }, 'gray', { stroke: true })
  ],
  'valorización': [
    s('path', { d: 'M40 70l14-20h40l14 20-34 50z' }, 'sky', { accent: true }),
    s('path', { d: 'M40 70h68M54 50l20 70M94 50l-20 70M64 50l-6 20M84 50l6 20', ...SW(2) }, 'blue', { stroke: true }),
    s('path', { d: 'M128 136V44', ...SW(8) }, 'green', { stroke: true }),
    s('path', { d: 'M114 50l14-22 14 22z' }, 'green'),
    s('path', { d: sparkle(30, 40, 9) + sparkle(104, 112, 7) }, 'yellow')
  ],
  absorbente: [
    s('path', { d: drop(48, 36, 8) + drop(80, 26, 8) + drop(112, 38, 8) }, 'blue'),
    s('path', { d: 'M48 54v12M80 44v14M112 56v10', ...SW(4) }, 'sky', { stroke: true }),
    s('rect', { x: 28, y: 76, width: 104, height: 48, rx: 10 }, 'yellow', { accent: true }),
    s('path', { d: ells([[48, 92, 6, 5], [72, 104, 5, 4], [96, 90, 6, 5], [116, 108, 5, 4], [54, 114, 4, 3], [88, 116, 4, 3]]) }, 'orange'),
    s('ellipse', { cx: 80, cy: 134, rx: 54, ry: 6 }, 'sky')
  ],
  afinar: [
    s('path', { d: 'M62 30v54q0 18 18 18t18-18V30', ...SW(9) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: 'M80 102v36', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 46q-10 14 0 28M30 38q-16 22 0 44M116 46q10 14 0 28M130 38q16 22 0 44', ...SW(4) }, 'orange', { stroke: true }),
    ...note(118, 128, 'purple')
  ],
  alfajor: [
    s('ellipse', { cx: 80, cy: 130, rx: 62, ry: 10 }, 'gray'),
    s('ellipse', { cx: 80, cy: 112, rx: 54, ry: 16 }, 'tan'),
    s('rect', { x: 28, y: 92, width: 104, height: 16, rx: 8 }, 'brown', { accent: true }),
    s('ellipse', { cx: 80, cy: 84, rx: 54, ry: 18 }, 'tan'),
    s('path', { d: dots([[60, 80], [80, 76], [98, 84], [72, 90], [110, 78], [52, 88], [88, 70]], 3) }, 'white'),
    s('path', { d: dots([[78, 44], [92, 54], [66, 58]], 2.5) }, 'cream')
  ],
  andanza: [
    s('path', { d: 'M14 108q30-36 60-20t72-20v78H14z' }, 'mint'),
    s('path', { d: 'M100 142q-40-20 0-36t10-30', ...SW(10) }, 'tan', { stroke: true }),
    s('rect', { x: 32, y: 84, width: 14, height: 24, rx: 4 }, 'red'),
    ...person(52, 138, 'blue', { accent: true }),
    s('path', { d: 'M70 140l10-56', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M110 40l12-18 12 18z' }, 'green'),
    s('circle', { cx: 32, cy: 34, r: 10 }, 'yellow')
  ],
  antagonista: [
    ...person(36, 138, 'blue'),
    s('path', { d: 'M110 92h32l8 46h-48z' }, 'purple'),
    ...person(124, 138, 'black', { accent: true }),
    s('path', { d: dots([[119, 78], [129, 78]], 3) }, 'red'),
    s('path', { d: 'M118 86l12 2', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 60l-10 22h10l-8 22 18-28H86l8-16z' }, 'yellow')
  ],
  aplacar: [
    s('rect', { x: 52, y: 22, width: 56, height: 24, rx: 10 }, 'skin'),
    s('path', { d: 'M80 52v20', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M72 70l8 10 8-10z' }, 'orange'),
    s('path', { d: 'M18 102l12-14 12 14 12-14 12 14 12-14 12 14', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M18 126q10-6 20 0t20 0 20 0 20 0 20 0 20 0', ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M102 98h40', ...SW(5) }, 'sky', { stroke: true })
  ],
  apostolado: [
    s('path', { d: halfRays(62, 66, 22, 32, 5), ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 62, cy: 66, r: 12 }, 'skin'),
    s('path', { d: 'M48 80h28l10 56H38z' }, 'brown', { accent: true }),
    s('path', { d: 'M100 136V40', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: 'M74 100l26-6', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 30, y: 96, width: 22, height: 26, rx: 2 }, 'red'),
    s('path', { d: 'M112 136q18-20 30-20', ...DASH(4) }, 'gray', { stroke: true })
  ],
  'aristócrata': [
    ...person(74, 138, 'purple', { h: 52, accent: true }),
    s('path', { d: 'M60 36h28v20H60zM52 54h44v6H52z' }, 'black'),
    s('path', { d: 'M62 86q12 10 24 0l-12 14z' }, 'white'),
    s('path', { d: ring(80, 70, 5) + 'M85 70l6 14', ...SW(2) }, 'yellow', { stroke: true }),
    s('path', { d: 'M114 136V96', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M88 102l26-6', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 114, cy: 94, r: 5 }, 'yellow')
  ],
  asentir: [
    s('circle', { cx: 74, cy: 84, r: 36 }, 'skin'),
    s('path', { d: 'M60 80q4-3 8 0M80 80q4-3 8 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 96q14 10 28 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M120 60v52', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M112 62l8-12 8 12zM112 110l8 12 8-12z' }, 'orange'),
    s('path', { d: 'M30 30l8 10 18-20', ...SW(6) }, 'green', { stroke: true, accent: true })
  ],
  austero: [
    backdrop('cream'),
    s('rect', { x: 30, y: 92, width: 100, height: 8, rx: 2 }, 'brown', { accent: true }),
    s('path', { d: 'M40 100v36M120 100v36', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M48 80h36q-2 12-18 12t-18-12z' }, 'gray'),
    s('rect', { x: 104, y: 66, width: 8, height: 26, rx: 2 }, 'white'),
    s('path', { d: drop(108, 56, 4) }, 'orange'),
    s('rect', { x: 54, y: 28, width: 40, height: 30, rx: 2 }, 'sky')
  ],
  autoconsumo: [
    s('path', { d: 'M30 82L80 42l50 40z' }, 'red'),
    s('path', { d: 'M88 50l28 22h-14l-24-18z' }, 'navy', { accent: true }),
    s('rect', { x: 40, y: 82, width: 80, height: 54 }, 'tan'),
    s('rect', { x: 70, y: 104, width: 20, height: 32 }, 'brown'),
    s('circle', { cx: 132, cy: 32, r: 12 }, 'yellow'),
    s('path', { d: 'M48 34a40 40 0 0 1 64-8', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M46 26l-2 14 12-4z' }, 'green'),
    s('path', { d: leaflet(26, 136, -70, 26, 7) + leaflet(138, 136, -110, 26, 7) }, 'green')
  ],
  azafata: [
    s('path', { d: ells([[30, 60, 12, 18], [130, 60, 12, 18]]) }, 'sky'),
    ...lady(80, 136, 'navy', { accent: true }),
    s('path', { d: 'M70 86l10 8 10-8', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M68 64h24v-6q-12-6-24 0z' }, 'navy'),
    s('rect', { x: 104, y: 98, width: 34, height: 6, rx: 2 }, 'gray'),
    s('path', { d: 'M112 90h8v8h-8zM126 86h6v12h-6z' }, 'orange')
  ],
  baboso: [
    ...face(78, 74, 46, 'yellow', 'smile', { accent: true }),
    s('path', { d: 'M100 92q2 18 0 30', ...SW(6) }, 'sky', { stroke: true }),
    s('path', { d: drop(100, 128, 6) }, 'sky'),
    s('path', { d: 'M48 46l14 4M108 46l-14 4', ...SW(3) }, 'dark', { stroke: true })
  ],
  bananero: [
    s('path', { d: leaflet(30, 70, -100, 50, 12) + leaflet(30, 70, -40, 40, 10) + leaflet(130, 70, -80, 50, 12) + leaflet(130, 70, -140, 40, 10) }, 'green'),
    s('path', { d: 'M28 70v20M132 70v20', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M40 84q10 24 34 20M50 80q12 22 36 16M60 76q14 20 38 12M70 74q16 18 40 6M82 74q16 14 36 0', ...SW(10) }, 'yellow', { stroke: true, accent: true }),
    s('rect', { x: 26, y: 94, width: 108, height: 42, rx: 3 }, 'brown'),
    s('path', { d: 'M26 108h108M26 122h108', ...SW(3) }, 'tan', { stroke: true })
  ],
  'bisturí': [
    s('rect', { x: 20, y: 90, width: 80, height: 14, rx: 5, transform: 'rotate(-30 60 97)' }, 'gray'),
    s('path', { d: 'M28 108l70-40', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 56l42-28q-6 22-34 40z' }, 'sky', { accent: true }),
    s('path', { d: 'M96 56l42-28q-6 22-34 40z', ...SW(2) }, 'navy', { stroke: true }),
    s('path', { d: sparkle(126, 60, 8) }, 'yellow')
  ],
  boquilla: [
    s('path', { d: 'M20 84h84', ...SW(8) }, 'yellow', { stroke: true }),
    s('path', { d: 'M40 84v-20h46v20', ...SW(8) }, 'yellow', { stroke: true }),
    s('path', { d: 'M100 84l40-24v48z' }, 'yellow'),
    s('path', { d: 'M54 64v-14M64 64v-14M74 64v-14', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M16 76q12 0 14 8q-2 8-14 8z' }, 'gray', { accent: true }),
    s('path', { d: 'M30 84h14', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: ring(23, 110, 10), ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M23 100V92', ...SW(3) }, 'red', { stroke: true })
  ],
  bruma: [
    backdrop('sky'),
    s('rect', { x: 14, y: 112, width: 132, height: 34, rx: 6 }, 'blue'),
    s('path', { d: 'M60 110l30-60v60zM96 110l16-40 14 40z' }, 'white'),
    s('path', { d: 'M48 110h86l-10 12H58z' }, 'brown'),
    s('path', { d: 'M18 54h80M40 74h104M18 94h70M64 132h76', ...SW(10), opacity: 0.85 }, 'gray', { stroke: true, accent: true })
  ],
  cabalgata: [
    ...horse('brown', 'dark'),
    s('rect', { x: 64, y: 40, width: 22, height: 30, rx: 7 }, 'red', { accent: true }),
    s('circle', { cx: 75, cy: 30, r: 10 }, 'skin'),
    s('path', { d: 'M65 22l-2-12 6 6 6-8 6 8 6-6-2 12z' }, 'yellow'),
    s('path', { d: 'M24 140V22l18 6-18 6', ...SW(3) }, 'purple', { stroke: true })
  ],
  calmante: [
    s('rect', { x: 18, y: 64, width: 60, height: 26, rx: 13, transform: 'rotate(-30 48 77)' }, 'white'),
    s('path', { d: 'M48 64h17a13 13 0 0 1 0 26H48z', transform: 'rotate(-30 48 77)' }, 'blue', { accent: true }),
    s('rect', { x: 18, y: 64, width: 60, height: 26, rx: 13, transform: 'rotate(-30 48 77)', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 52, cy: 120, r: 12 }, 'mint'),
    s('path', { d: 'M114 30a22 22 0 1 0 22 30a18 18 0 1 1-22-30z' }, 'yellow'),
    s('path', { d: 'M88 104q10-6 20 0t20 0M88 122q10-6 20 0t20 0', ...SW(4) }, 'sky', { stroke: true })
  ],
  'camaleón': [
    s('path', { d: 'M16 118q60-12 128 4', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M46 108q-2-36 34-40q30-2 46 16l14 18-16 6H84q-14 16-28 8q-10 0-10-8z' }, 'green', { accent: true }),
    s('path', { d: 'M50 104q-20 4-24-12t12-16q12 4 6 14', ...SW(7) }, 'green', { stroke: true }),
    s('circle', { cx: 112, cy: 88, r: 8 }, 'yellow'),
    s('circle', { cx: 113, cy: 88, r: 3 }, 'dark'),
    s('path', { d: 'M64 108v12M96 108v12', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M62 82q12 6 26 0', ...SW(3) }, 'mint', { stroke: true })
  ],
  camarote: [
    backdrop('tan'),
    s('circle', { cx: 112, cy: 48, r: 20 }, 'sky'),
    outline({ cx: 112, cy: 48, r: 20 }, 'navy', 6),
    s('path', { d: 'M24 136V40M76 136V40', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 24, y: 64, width: 52, height: 12, rx: 3 }, 'blue', { accent: true }),
    s('rect', { x: 24, y: 112, width: 52, height: 12, rx: 3 }, 'blue'),
    s('path', { d: ells([[34, 60, 8, 4], [34, 108, 8, 4]]) }, 'white'),
    s('path', { d: 'M104 92h30v44h-30z' }, 'brown')
  ],
  canelo: [
    ...tree(56, 'green', 'brown', { accent: true }),
    ground(),
    s('path', { d: rects([[96, 110, 46, 9], [96, 120, 46, 9], [100, 100, 42, 9]]) }, 'brown'),
    s('path', { d: dots([[98, 114], [98, 124], [102, 104]], 4) }, 'orange'),
    s('path', { d: 'M120 98v34', ...SW(4) }, 'red', { stroke: true })
  ],
  'carmesí': [
    s('path', { d: 'M18 116q30-40 64-28t60-30', ...SW(22) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M128 26l18 12-22 22-10-8z' }, 'tan'),
    s('rect', { x: 102, y: 54, width: 20, height: 12, rx: 3, transform: 'rotate(-40 112 60)' }, 'gray'),
    s('path', { d: 'M104 64q-8 4-10 14 10-2 14-8z' }, 'red'),
    s('path', { d: drop(40, 132, 6) + drop(64, 126, 5) }, 'red')
  ],
  carrito: [
    s('path', { d: 'M18 34h16l14 70h70l12-48H40', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 56h90l-12 48H48z' }, 'red', { accent: true }),
    s('path', { d: 'M58 60l6 40M80 60v40M102 60l-4 40M44 80h80', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: dots([[58, 124], [108, 124]], 9) }, 'dark'),
    s('path', { d: 'M48 104l-4 10h70', ...SW(5) }, 'dark', { stroke: true })
  ],
  cauteloso: [
    s('rect', { x: 92, y: 18, width: 54, height: 120 }, 'gray'),
    ...lean(76, 136, 10, 'green', { accent: true }),
    s('path', { d: 'M84 74h4M92 74h0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M84 100l14-6', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: ells([[34, 132, 6, 3], [52, 124, 6, 3]]) }, 'tan')
  ],
  cazo: [
    s('path', { d: 'M22 70h76v44q0 20-20 20H42q-20 0-20-20z' }, 'red', { accent: true }),
    s('rect', { x: 18, y: 64, width: 84, height: 10, rx: 4 }, 'gray'),
    s('path', { d: 'M100 76l42-14', ...SW(10) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 54q-8-10 0-20t0-20M62 54q-8-10 0-20t0-20M80 54q-8-10 0-20', ...SW(4) }, 'gray', { stroke: true })
  ],
  charro: [
    s('ellipse', { cx: 80, cy: 96, rx: 66, ry: 18 }, 'tan'),
    s('path', { d: 'M54 92q-2-50 26-56q28 6 26 56z' }, 'tan'),
    s('path', { d: 'M55 82q25 10 50 0v10q-25 10-50 0z' }, 'red', { accent: true }),
    s('path', { d: dots([[64, 88], [80, 92], [96, 88]], 3) + dots([[30, 98], [130, 98]], 3) }, 'yellow'),
    s('ellipse', { cx: 80, cy: 96, rx: 66, ry: 18, ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: ring(80, 128, 12) + 'M92 128h30', ...SW(4) }, 'brown', { stroke: true })
  ],
  'chingón': [
    s('rect', { x: 50, y: 74, width: 46, height: 56, rx: 12 }, 'skin'),
    s('rect', { x: 56, y: 30, width: 18, height: 52, rx: 9 }, 'skin', { accent: true }),
    s('path', { d: 'M62 92h34M62 106h34M62 120h30', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 92, y: 80, width: 24, height: 52, rx: 4 }, 'blue'),
    s('path', { d: star(28, 40, 12) + star(122, 36, 14) + star(132, 70, 7) }, 'yellow')
  ],
  ciruela: [
    s('circle', { cx: 60, cy: 88, r: 38 }, 'purple', { accent: true }),
    s('path', { d: 'M60 52q4 20 0 72', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M60 50q2-16 12-24', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(66, 36, -20, 28, 9) }, 'green'),
    s('circle', { cx: 118, cy: 108, r: 26 }, 'purple'),
    s('circle', { cx: 118, cy: 108, r: 21 }, 'yellow'),
    s('ellipse', { cx: 118, cy: 108, rx: 8, ry: 11 }, 'brown')
  ],
  cohecho: [
    s('rect', { x: 14, y: 50, width: 132, height: 14, rx: 3 }, 'brown'),
    s('path', { d: 'M34 64v72M126 64v72', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M14 100h40M146 100h-40', ...SW(14) }, 'navy', { stroke: true }),
    s('path', { d: dots([[58, 100], [102, 100]], 9) }, 'skin'),
    s('rect', { x: 64, y: 88, width: 36, height: 22, rx: 3, transform: 'rotate(-8 82 99)' }, 'green', { accent: true }),
    s('circle', { cx: 82, cy: 99, r: 5 }, 'mint'),
  ],
  conductual: [
    s('path', { d: 'M18 40q30-26 60 0q-30 26-60 0z' }, 'white'),
    s('path', { d: 'M18 40q30-26 60 0q-30 26-60 0z', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 52, cy: 40, r: 9 }, 'blue', { accent: true }),
    s('path', { d: 'M62 54l22 20', ...DASH(3, '4 5') }, 'gray', { stroke: true }),
    ...lean(110, 136, 8, 'orange'),
    s('path', { d: ells([[30, 132, 6, 3], [50, 124, 6, 3], [70, 132, 6, 3], [90, 124, 6, 3]]) }, 'tan')
  ],
  cordialmente: [
    ...person(70, 138, 'green', { h: 50, w: 34 }),
    s('path', { d: heart(64, 104, 10) }, 'red', { accent: true }),
    s('path', { d: 'M84 104l-14 2', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M64 72q6 5 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: heart(118, 50, 12) + heart(132, 82, 7) }, 'pink'),
    s('path', { d: sparkle(30, 44, 8) }, 'yellow')
  ],
  crediticio: [
    s('rect', { x: 18, y: 40, width: 104, height: 66, rx: 8 }, 'blue', { accent: true }),
    s('rect', { x: 18, y: 54, width: 104, height: 12 }, 'navy'),
    s('rect', { x: 30, y: 74, width: 20, height: 16, rx: 3 }, 'yellow'),
    s('path', { d: 'M62 92h44', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: ells([[124, 134, 18, 6], [124, 124, 18, 6], [124, 114, 18, 6]]) }, 'yellow'),
    s('path', { d: ells([[124, 134, 18, 6], [124, 124, 18, 6], [124, 114, 18, 6]]), ...SW(2) }, 'orange', { stroke: true })
  ],
  detonar: [
    s('rect', { x: 18, y: 100, width: 50, height: 36, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M43 100V70M28 70h30', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M68 126q30 10 40-14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: burst(112, 64, 38, 18, 11) }, 'orange'),
    s('path', { d: burst(112, 64, 20, 10, 8) }, 'yellow')
  ],
  disciplinado: [
    ...person(36, 138, 'navy'),
    ...person(80, 138, 'navy', { accent: true }),
    ...person(124, 138, 'navy'),
    s('path', { d: 'M18 58h124', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 34l6 8 12-14', ...SW(5) }, 'green', { stroke: true })
  ],
  'discografía': [
    s('path', { d: dots([[40, 70], [80, 70], [120, 70]], 22) + dots([[60, 110], [100, 110]], 22) }, 'black'),
    s('path', { d: ring(40, 70, 15) + ring(80, 70, 15) + ring(120, 70, 15) + ring(60, 110, 15) + ring(100, 110, 15), ...SW(1) }, 'gray', { stroke: true }),
    s('path', { d: dots([[40, 70], [120, 70]], 7) }, 'red', { accent: true }),
    s('path', { d: dots([[80, 70], [60, 110]], 7) }, 'yellow'),
    s('path', { d: dots([[100, 110]], 7) }, 'sky'),
    s('path', { d: dots([[40, 70], [80, 70], [120, 70], [60, 110], [100, 110]], 2) }, 'white')
  ],
  'distraído': [
    s('rect', { x: 110, y: 30, width: 12, height: 106 }, 'gray'),
    ...lean(64, 136, 10, 'orange', { accent: true }),
    s('path', { d: 'M76 76l4-4', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[34, 36, 8, 10], [48, 36, 8, 10]]) }, 'purple'),
    s('path', { d: 'M40 30l4 14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 52q-8-6-12-2', ...DASH(2, '3 3') }, 'gray', { stroke: true }),
    ground()
  ],
  'diálisis': [
    s('rect', { x: 94, y: 30, width: 48, height: 106, rx: 6 }, 'gray'),
    s('rect', { x: 102, y: 40, width: 32, height: 22, rx: 3 }, 'sky'),
    s('path', { d: dots([[110, 78], [126, 78]], 6) }, 'navy'),
    s('path', { d: 'M38 74q4-28 28-26q20 4 16 26q-4 12 4 24q4 22-18 24q-28 0-30-48z' }, 'pink', { accent: true }),
    s('path', { d: 'M84 70q10-20 18 6M86 104q20 20 22-6', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M102 112h32', ...SW(4) }, 'dark', { stroke: true })
  ],
  drago: [
    s('path', { d: 'M72 136l2-40-20-20M76 96l2-24M84 96l2-26M86 96l22-24', ...SW(12) }, 'tan', { stroke: true }),
    s('path', { d: 'M16 70q4-36 64-38q60 2 64 38q-30 10-64 8q-36 2-64-8z' }, 'green', { accent: true }),
    s('path', { d: 'M28 58l10-10M58 46l6-10M98 44l6 8M126 56l8-8', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: drop(90, 116, 6) }, 'red'),
    ground()
  ],
  engendro: [
    s('path', { d: 'M28 136q-8-40 10-70q16-30 42-30q26 0 42 30q18 30 10 70l-14-10-12 10-14-10-12 10-12-10-12 10-14-10z' }, 'green', { accent: true }),
    s('path', { d: 'M52 46l-10-18 18 8M108 46l10-18-18 8' }, 'purple'),
    s('circle', { cx: 80, cy: 72, r: 16 }, 'white'),
    s('circle', { cx: 82, cy: 74, r: 7 }, 'dark'),
    s('path', { d: 'M56 102q24 14 48 0z' }, 'dark'),
    s('path', { d: 'M64 104l4 6 4-4M92 105l4 5 4-6' }, 'white')
  ],
  ensamblaje: [
    s('path', { d: 'M14 70h40v10h12v20H54v10H14z' }, 'tan', { accent: true }),
    s('path', { d: 'M94 70h52v40H94v-10H82V80h12z' }, 'tan'),
    s('path', { d: 'M96 80h-12v20h12z' }, 'white'),
    s('path', { d: 'M24 70v40M134 70v40', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 50h20M120 50h-20', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M58 42l10 8-10 8zM102 42l-10 8 10 8z' }, 'orange'),
    s('path', { d: 'M48 140l40-16', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 116a10 10 0 1 0 12 14l-6-2-2-6z' }, 'gray')
  ],
  entusiasmar: [
    s('ellipse', { cx: 80, cy: 138, rx: 26, ry: 5 }, 'gray'),
    ...person(80, 120, 'red', { accent: true }),
    s('path', { d: 'M68 82L50 52M92 82l18-30', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M72 120l-8 10M88 120l8 10', ...SW(7) }, 'navy', { stroke: true }),
    s('path', { d: 'M72 60q8 8 16 0z' }, 'dark'),
    s('path', { d: star(30, 76, 10) + star(130, 76, 10) + star(80, 22, 8) }, 'yellow')
  ],
  envenenar: [
    s('path', { d: 'M52 18h12v12H52z', transform: 'rotate(40 58 56)' }, 'dark'),
    s('path', { d: 'M52 28h12v12l16 14v32H36V54l16-14z', transform: 'rotate(40 58 56)' }, 'green', { accent: true }),
    s('path', { d: drop(92, 86, 6) }, 'green'),
    s('path', { d: 'M84 102h48q0 26-24 26t-24-26z' }, 'red'),
    s('path', { d: 'M108 128v8M94 138h28', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M84 102h48', ...SW(3) }, 'green', { stroke: true })
  ],
  envidioso: [
    ...face(52, 78, 34, 'mint', 'flat', { accent: true }),
    s('path', { d: 'M34 64l14 4M70 64l-14 4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M84 68h10', ...DASH(3, '3 4') }, 'gray', { stroke: true }),
    s('rect', { x: 100, y: 96, width: 44, height: 30, rx: 4 }, 'pink'),
    s('rect', { x: 100, y: 88, width: 44, height: 10, rx: 4 }, 'cream'),
    s('path', { d: 'M114 86V74M130 86V74', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: drop(114, 68, 4) + drop(130, 68, 4) }, 'orange')
  ],
  escanear: [
    s('rect', { x: 70, y: 84, width: 72, height: 52, rx: 3 }, 'tan'),
    s('rect', { x: 84, y: 94, width: 44, height: 30 }, 'white'),
    s('path', { d: 'M90 98v22M95 98v22M102 98v22M106 98v22M113 98v22M117 98v22M122 98v22', ...SW(3, { 'stroke-linecap': 'butt' }) }, 'black', { stroke: true }),
    s('path', { d: 'M48 50l36 58M48 50l58 52', ...SW(2) }, 'red', { stroke: true }),
    s('path', { d: 'M16 40l34-10 6 22-14 4 4 30-14 4-6-30-6 2z' }, 'dark', { accent: true }),
    s('path', { d: 'M86 108h44', ...SW(3) }, 'red', { stroke: true })
  ],
  'exclamación': [
    ...person(48, 138, 'purple', { accent: true }),
    s('ellipse', { cx: 48, cy: 86, rx: 5, ry: 6 }, 'dark'),
    s('path', { d: dots([[43, 76], [53, 76]], 2.5) }, 'dark'),
    s('path', { d: 'M36 104L26 74M60 104l10-30', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: burst(112, 54, 36, 20, 10) }, 'yellow'),
    s('path', { d: 'M72 76l12-6M74 90h14', ...SW(4) }, 'orange', { stroke: true })
  ],
  facultativo: [
    s('path', { d: 'M80 140V36', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: 'M84 40h40l14 12-14 12H84z' }, 'green', { accent: true }),
    s('path', { d: 'M76 70H36L22 82l14 12h40z' }, 'blue'),
    s('path', { d: 'M18 140q40-16 62-30q22 14 62 30', ...SW(6) }, 'tan', { stroke: true }),
    s('path', { d: 'M102 52l6 6 10-12M46 82l6 6 10-12', ...SW(3) }, 'white', { stroke: true })
  ],
  firmamento: [
    s('path', { d: 'M14 136V96a66 66 0 0 1 132 0v40z' }, 'navy', { accent: true }),
    s('path', { d: star(50, 66, 7) + star(104, 52, 9) + star(80, 92, 5) + star(122, 92, 5) + star(36, 104, 4) + star(76, 42, 4) }, 'yellow'),
    s('path', { d: 'M40 70l64-18', ...DASH(2, '2 5') }, 'white', { stroke: true }),
    s('path', { d: 'M14 136q40-18 70-6t62-6v18H14z' }, 'green')
  ],
  frazada: [
    s('rect', { x: 22, y: 92, width: 116, height: 38, rx: 8 }, 'red'),
    s('rect', { x: 26, y: 60, width: 108, height: 34, rx: 8 }, 'blue', { accent: true }),
    s('path', { d: 'M54 60v34M80 60v34M106 60v34M26 77h108', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: 'M50 92v38M80 92v38M110 92v38M22 111h116', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M28 130v8M36 130v8M44 130v8M116 130v8M124 130v8M132 130v8', ...SW(3) }, 'red', { stroke: true })
  ],
  fregar: [
    s('circle', { cx: 70, cy: 92, r: 44 }, 'white'),
    outline({ cx: 70, cy: 92, r: 44 }, 'gray', 4),
    s('circle', { cx: 70, cy: 92, r: 28 }, 'sky'),
    s('rect', { x: 84, y: 48, width: 50, height: 28, rx: 6, transform: 'rotate(-20 109 62)' }, 'yellow', { accent: true }),
    s('rect', { x: 84, y: 48, width: 50, height: 10, rx: 4, transform: 'rotate(-20 109 62)' }, 'green'),
    s('path', { d: ring(46, 54, 8) + ring(30, 72, 6) + ring(124, 98, 7) + ring(110, 116, 5), ...SW(3) }, 'blue', { stroke: true })
  ],
  'fémur': [
    backdrop('sky'),
    s('path', { d: 'M42 118L118 42', ...SW(16) }, 'white', { stroke: true, accent: true }),
    s('path', { d: dots([[110, 34], [126, 50], [34, 110], [50, 126]], 13) }, 'white'),
    s('path', { d: 'M42 118L118 42', ...SW(3) }, 'gray', { stroke: true })
  ],
  ganglio: [
    s('path', { d: HEAD }, 'skin'),
    s('path', { d: 'M60 62q4-6 10-2', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: dots([[100, 108], [86, 116], [72, 108]], 8) }, 'red', { accent: true }),
    s('path', { d: ring(86, 110, 26), ...DASH(3, '5 5') }, 'orange', { stroke: true }),
    s('path', { d: 'M76 26q-40 0-44 40q14-10 24-22q16 8 40-4q14 6 22 14q-4-28-42-28z' }, 'brown')
  ],
  gangrena: [
    s('path', { d: 'M24 128q-6-24 10-42l10-48h40l2 52q24 0 46 10q10 6 4 22q-4 8-14 8H32z' }, 'skin'),
    s('path', { d: dots([[136, 104]], 9) + dots([[124, 98]], 7) }, 'purple', { accent: true }),
    s('path', { d: dots([[112, 96], [102, 94]], 6) }, 'skin'),
    s('path', { d: dots([[136, 104]], 4) }, 'black'),
    s('rect', { x: 42, y: 54, width: 44, height: 22, rx: 2 }, 'white'),
    s('path', { d: 'M42 54h44v22H42zM52 54v22M64 54v22M76 54v22', ...SW(2) }, 'gray', { stroke: true })
  ],
  granadino: [
    s('circle', { cx: 62, cy: 86, r: 42 }, 'red', { accent: true }),
    s('path', { d: 'M50 48l-4-16 10 8 6-12 6 12 10-8-4 16z' }, 'red'),
    s('path', { d: 'M46 72q8-10 18-8', ...SW(4) }, 'pink', { stroke: true }),
    s('circle', { cx: 120, cy: 112, r: 26 }, 'cream'),
    s('path', { d: dots([[110, 102], [122, 98], [132, 108], [114, 116], [126, 122], [106, 116], [120, 110], [134, 120]], 4) }, 'red'),
    outline({ cx: 120, cy: 112, r: 26 }, 'red', 4)
  ],
  guisante: [
    s('path', { d: 'M18 92q60 48 124-8q-8 40-62 40q-50 0-62-32z' }, 'green', { accent: true }),
    s('path', { d: 'M24 90q58 26 112-10q-40 26-112 10z' }, 'mint'),
    s('path', { d: dots([[46, 96], [66, 100], [86, 98], [106, 92]], 10) }, 'green'),
    s('path', { d: ring(46, 96, 10) + ring(66, 100, 10) + ring(86, 98, 10) + ring(106, 92, 10), ...SW(2) }, 'dark', { stroke: true, flatOnly: true, opacity: 0.25 }),
    s('path', { d: 'M142 84q4-14 0-24', ...SW(4) }, 'green', { stroke: true })
  ],
  'géminis': [
    ...person(54, 138, 'yellow'),
    ...person(106, 138, 'yellow', { accent: true }),
    s('path', { d: 'M68 108h24', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: star(54, 36, 10) + star(106, 36, 10) }, 'navy'),
    s('path', { d: 'M54 50h52', ...DASH(2, '3 4') }, 'navy', { stroke: true })
  ],
  huelguista: [
    ...person(50, 138, 'blue'),
    s('path', { d: 'M62 104l26-24', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M92 140V58', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 70, y: 20, width: 72, height: 44, rx: 3 }, 'white'),
    outline({ x: 70, y: 20, width: 72, height: 44, rx: 3 }),
    s('rect', { x: 76, y: 34, width: 60, height: 16, rx: 2 }, 'red', { accent: true }),
    s('path', { d: 'M38 104l-8-34', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 30, cy: 66, r: 7 }, 'skin')
  ],
  incurable: [
    s('rect', { x: 30, y: 66, width: 100, height: 32, rx: 16, transform: 'rotate(-30 80 82)' }, 'white'),
    s('path', { d: 'M80 66h34a16 16 0 0 1 0 32H80z', transform: 'rotate(-30 80 82)' }, 'pink'),
    s('rect', { x: 30, y: 66, width: 100, height: 32, rx: 16, transform: 'rotate(-30 80 82)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ring(80, 82, 58) + 'M39 41l82 82', ...SW(10) }, 'red', { stroke: true, accent: true })
  ],
  insensato: [
    s('path', { d: 'M18 140V20h22v120z' }, 'brown'),
    s('rect', { x: 38, y: 74, width: 108, height: 12, rx: 5 }, 'brown'),
    s('path', { d: leaflet(36, 24, -45, 30, 10) + leaflet(30, 30, -150, 26, 9) }, 'green'),
    ...person(116, 74, 'orange', { h: 34, w: 24, r: 10, accent: true }),
    s('path', { d: 'M108 74l-4 22M124 74l4 22', ...SW(6) }, 'navy', { stroke: true }),
    s('path', { d: 'M58 52l10 36', ...SW(10) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 56l-34 4', ...SW(6) }, 'skin', { stroke: true })
  ],
  lacar: [
    s('rect', { x: 16, y: 98, width: 128, height: 26, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: 'M24 106h70', ...SW(5) }, 'tan', { stroke: true }),
    s('rect', { x: 98, y: 60, width: 34, height: 14, rx: 3, transform: 'rotate(30 115 67)' }, 'gray'),
    s('path', { d: 'M126 52l18-30', ...SW(8) }, 'red', { stroke: true }),
    s('path', { d: 'M96 72l-8 20 20 4 6-14z' }, 'dark'),
    s('path', { d: sparkle(38, 80, 9) + sparkle(64, 84, 6) + sparkle(84, 74, 5) }, 'yellow')
  ],
  lavado: [
    s('rect', { x: 30, y: 20, width: 100, height: 120, rx: 10 }, 'white'),
    outline({ x: 30, y: 20, width: 100, height: 120, rx: 10 }, 'gray', 4),
    s('path', { d: 'M30 44h100', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[46, 32], [58, 32]], 4) }, 'dark'),
    s('circle', { cx: 80, cy: 90, r: 34 }, 'navy'),
    s('path', { d: 'M48 94q16-14 32 0t32 0v4a32 32 0 0 1-64 0z' }, 'blue', { accent: true }),
    s('path', { d: ring(68, 80, 5) + ring(90, 72, 4), ...SW(2) }, 'white', { stroke: true })
  ],
  llaga: [
    s('path', { d: 'M14 70h132v42H14z' }, 'skin'),
    s('ellipse', { cx: 64, cy: 91, rx: 16, ry: 11 }, 'pink'),
    s('ellipse', { cx: 64, cy: 91, rx: 9, ry: 6 }, 'red', { accent: true }),
    s('rect', { x: 96, y: 112, width: 46, height: 18, rx: 9, transform: 'rotate(-20 119 121)' }, 'tan'),
    s('rect', { x: 110, y: 114, width: 18, height: 14, rx: 2, transform: 'rotate(-20 119 121)' }, 'cream'),
  ],
  manualidad: [
    s('path', { d: 'M20 120l40-62 40 62z' }, 'yellow'),
    s('path', { d: 'M100 120l20-40 20 40z' }, 'green'),
    s('path', { d: 'M20 120l40-62 18 62z' }, 'orange'),
    s('path', { d: ring(46, 34, 9) + ring(46, 58, 9), ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M54 38l60 22M54 54l60-12', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 14, y: 128, width: 132, height: 8, rx: 3 }, 'brown')
  ],
  mapache: [
    s('path', { d: 'M34 54l6-30 22 18zM126 54l-6-30-22 18z' }, 'gray'),
    s('path', { d: 'M24 78q0-40 56-40t56 40q0 28-30 42l-26 14-26-14q-30-14-30-42z' }, 'gray', { accent: true }),
    s('path', { d: 'M28 74q24-16 52 2q28-18 52-2q-6 22-24 22q-16 0-28-10q-12 10-28 10q-18 0-24-22z' }, 'dark'),
    s('path', { d: 'M48 64q10-8 20 0M92 64q10-8 20 0', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: dots([[56, 80], [104, 80]], 5) }, 'white'),
    s('path', { d: 'M62 104q18 14 36 0l-18 30z' }, 'white'),
    s('ellipse', { cx: 80, cy: 110, rx: 9, ry: 6 }, 'black')
  ],
  masturbar: [
    s('rect', { x: 40, y: 18, width: 80, height: 122, rx: 4 }, 'brown', { accent: true }),
    s('rect', { x: 50, y: 30, width: 60, height: 40, rx: 3 }, 'tan'),
    s('circle', { cx: 106, cy: 88, r: 6 }, 'yellow'),
    s('path', { d: 'M100 94v8', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M88 100h24v36H88z' }, 'pink'),
    s('path', { d: heart(100, 112, 8) }, 'red')
  ],
  metadatos: [
    s('rect', { x: 14, y: 24, width: 84, height: 70, rx: 4 }, 'sky'),
    s('path', { d: 'M14 94l26-34 18 22 14-14 26 26z' }, 'green'),
    s('circle', { cx: 76, cy: 42, r: 8 }, 'yellow'),
    s('path', { d: 'M74 94l18-26h50v58H92z' }, 'orange', { accent: true }),
    s('circle', { cx: 92, cy: 80, r: 5 }, 'white'),
    s('path', { d: 'M104 90h30M104 102h24M104 114h30', ...SW(4) }, 'white', { stroke: true }),
  ],
  metodista: [
    s('path', { d: 'M80 24v112M48 56h64', ...SW(14) }, 'dark', { stroke: true }),
    s('path', { d: 'M88 140q-36-6-36-40q0-24 18-36q-4 20 10 26q2-24 24-36q-4 20 6 32q14 18 6 34q-6 16-28 20z' }, 'red', { accent: true }),
    s('path', { d: 'M86 132q-16-8-12-26q8 10 14 4q10 14-2 22z' }, 'orange'),
    s('path', { d: 'M18 140h124', ...SW(4) }, 'gray', { stroke: true })
  ],
  'miopía': [
    s('path', { d: 'M110 34l14 30-6 10 20 6-12 4 6 10H96l6-10-12-4 20-6-6-10z', opacity: 0.45 }, 'green'),
    s('path', { d: 'M108 40l14 30M118 46l-8 30', ...SW(6), opacity: 0.3 }, 'green', { stroke: true }),
    s('circle', { cx: 48, cy: 104, r: 22 }, 'sky'),
    s('circle', { cx: 100, cy: 104, r: 22 }, 'sky'),
    s('path', { d: ring(48, 104, 22) + ring(100, 104, 22) + 'M70 102q4-6 8 0M26 98l-10-8M122 98l12-8', ...SW(6) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M40 96l6-6M92 96l6-6', ...SW(3) }, 'white', { stroke: true })
  ],
  necedad: [
    s('path', { d: 'M80 58L40 30l-10 26zM80 58l40-28 10 26z' }, 'purple', { accent: true }),
    s('path', { d: 'M80 58l-12-34 12-4 12 4z' }, 'yellow'),
    s('path', { d: dots([[30, 56], [130, 56], [80, 20]], 6) }, 'yellow'),
    ...person(80, 138, 'green', { h: 44 }),
    s('path', { d: 'M72 84q8 8 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 88q0 8 4 8t2-8z' }, 'red'),
    s('path', { d: 'M70 76l4 2M86 78l4-2', ...SW(3) }, 'dark', { stroke: true })
  ],
  'necrópolis': [
    s('path', { d: 'M52 96l40-60 40 60z' }, 'tan'),
    s('path', { d: 'M92 36l40 60H108z' }, 'brown'),
    s('path', { d: 'M18 136v-32a12 12 0 0 1 24 0v32zM54 136v-28a10 10 0 0 1 20 0v28zM90 136v-34a12 12 0 0 1 24 0v34zM122 136v-26a10 10 0 0 1 20 0v26z' }, 'gray', { accent: true }),
    s('path', { d: 'M30 108v14M24 114h12M102 106v14M96 112h12', ...SW(3) }, 'dark', { stroke: true }),
    ground(138)
  ],
  normatividad: [
    s('rect', { x: 18, y: 104, width: 70, height: 14, rx: 3 }, 'navy'),
    s('rect', { x: 22, y: 90, width: 62, height: 14, rx: 3 }, 'red'),
    s('rect', { x: 16, y: 118, width: 74, height: 16, rx: 3 }, 'blue'),
    s('path', { d: 'M118 132V34M96 46h44M88 132h60', ...SW(5) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M96 46l-12 28M96 46l12 28M140 46l-12 28M140 46l12 28', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M82 74h28q-2 12-14 12t-14-12zM126 74h28q-2 12-14 12t-14-12z' }, 'yellow')
  ],
  objetar: [
    ...person(54, 138, 'navy', { accent: true }),
    s('path', { d: 'M66 102l24-40', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 84, y: 34, width: 22, height: 30, rx: 9 }, 'skin'),
    s('path', { d: 'M114 34l12-10M118 48h16M114 62l12 10', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M48 86q6-4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 96, y: 104, width: 50, height: 32, rx: 2 }, 'brown')
  ],
  obstinado: [
    ...person(96, 138, 'brown', { accent: true, w: 34 }),
    s('path', { d: 'M82 104h28M82 112h28', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M88 86q8-6 16 0M86 72l8 3M106 72l-8 3', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 100h40', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M56 90l14 10-14 10z' }, 'orange'),
    s('path', { d: 'M80 140V136M112 140v-4M70 138h52', ...SW(6) }, 'dark', { stroke: true })
  ],
  oleoducto: [
    s('rect', { x: 14, y: 110, width: 132, height: 30, rx: 4 }, 'tan'),
    s('path', { d: 'M30 112V88M80 112V88M130 112V88', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 80h132', ...SW(18) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: 'M50 70v20M110 70v20', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: drop(80, 44, 12) }, 'black'),
    s('path', { d: 'M18 76h128', ...SW(3) }, 'white', { stroke: true })
  ],
  pasadizo: [
    s('rect', { x: 14, y: 20, width: 132, height: 120, rx: 4 }, 'gray'),
    s('path', { d: rects([[14, 44, 132, 3], [14, 72, 132, 3], [14, 100, 132, 3]]) }, 'white'),
    s('path', { d: 'M46 140V76a34 34 0 0 1 68 0v64z' }, 'dark', { accent: true }),
    s('path', { d: 'M62 140V90a18 18 0 0 1 36 0v50z' }, 'black'),
    s('path', { d: 'M46 140l16-14h36l16 14', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 124, y: 60, width: 6, height: 20 }, 'brown'),
    s('path', { d: drop(127, 54, 6) }, 'orange')
  ],
  patrocinar: [
    s('path', { d: 'M18 130q-4-36 26-46l-8-12h24l-8 12q30 10 26 46z' }, 'yellow', { accent: true }),
    s('path', { d: 'M38 84h20', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 48, cy: 110, r: 8 }, 'orange'),
    ...lean(118, 136, 10, 'blue'),
    s('path', { d: 'M114 112h12v10h-12z' }, 'white'),
    s('path', { d: 'M76 90q14-18 30-12', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M100 70l10 8-12 6z' }, 'orange')
  ],
  penumbra: [
    backdrop('navy'),
    s('circle', { cx: 60, cy: 80, r: 52, opacity: 0.25 }, 'yellow'),
    s('circle', { cx: 60, cy: 80, r: 30, opacity: 0.5 }, 'yellow', { accent: true }),
    s('rect', { x: 54, y: 82, width: 12, height: 40, rx: 3 }, 'cream'),
    s('path', { d: drop(60, 74, 6) }, 'orange'),
    s('path', { d: 'M94 136V64h52v72z' }, 'black')
  ],
  personalizar: [
    s('path', { d: 'M52 30l-36 22 12 22 14-8v70h76V66l14 8 12-22-36-22q-10 12-28 12t-28-12z' }, 'white'),
    s('path', { d: 'M52 30l-36 22 12 22 14-8v70h76V66l14 8 12-22-36-22q-10 12-28 12t-28-12z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: star(80, 94, 22) }, 'purple', { accent: true }),
    s('path', { d: 'M120 136l26-32', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M114 134l-6 8 10-2z' }, 'purple')
  ],
  'pictórico': [
    s('path', { d: 'M54 140l20-100M106 140l-20-100M80 100v40', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 30, y: 24, width: 100, height: 76, rx: 2 }, 'tan'),
    s('rect', { x: 36, y: 30, width: 88, height: 64 }, 'sky'),
    s('path', { d: 'M36 94l26-30 18 20 14-12 30 22z' }, 'green', { accent: true }),
    s('circle', { cx: 104, cy: 46, r: 8 }, 'yellow'),
  ],
  pincho: [
    s('ellipse', { cx: 80, cy: 128, rx: 64, ry: 10 }, 'white'),
    s('ellipse', { cx: 80, cy: 128, rx: 64, ry: 10, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: rects([[26, 100, 46, 22], [88, 100, 46, 22]]) }, 'tan'),
    s('path', { d: 'M26 86q23-10 46 0v14H26zM88 86q23-10 46 0v14H88z' }, 'red', { accent: true }),
    s('path', { d: ells([[49, 82, 14, 8], [111, 82, 14, 8]]) }, 'yellow'),
    s('path', { d: 'M49 120V34M111 120V34', ...SW(4) }, 'brown', { stroke: true })
  ],
  'polución': [
    s('path', { d: 'M18 136V90l28 16V90l28 16V90l28 16V60h14v-10h12v86z' }, 'gray', { accent: true }),
    s('path', { d: grid(26, 116, 4, 1, 10, 8, 18, 0) }, 'yellow'),
    s('path', { d: ells([[110, 40, 14, 10], [126, 28, 16, 12], [98, 24, 12, 9]]) }, 'dark'),
    s('path', { d: ells([[60, 46, 14, 10], [42, 36, 12, 8]]), opacity: 0.6 }, 'dark'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'dark', { stroke: true })
  ],
  pompa: [
    s('path', { d: 'M24 140l26-38', ...SW(5) }, 'purple', { stroke: true }),
    s('path', { d: ring(56, 92, 10), ...SW(4) }, 'purple', { stroke: true }),
    s('circle', { cx: 98, cy: 58, r: 30, opacity: 0.6 }, 'sky', { accent: true }),
    s('path', { d: ring(98, 58, 30) + ring(52, 40, 14) + ring(126, 116, 16) + ring(82, 112, 8), ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M84 44q6-8 14-8M46 36q2-4 6-4M118 110q3-4 8-4', ...SW(4) }, 'white', { stroke: true })
  ],
  predial: [
    s('path', { d: 'M14 108l66-26 66 26-66 30z' }, 'green'),
    s('path', { d: 'M14 108l66-26 66 26-66 30z', ...DASH(3) }, 'brown', { stroke: true }),
    s('rect', { x: 56, y: 70, width: 40, height: 36 }, 'tan'),
    s('path', { d: 'M50 72l26-26 26 26z' }, 'red', { accent: true }),
    s('rect', { x: 70, y: 86, width: 12, height: 20 }, 'brown'),
    s('circle', { cx: 128, cy: 46, r: 16 }, 'yellow'),
    s('path', { d: ring(128, 46, 10), ...SW(3) }, 'orange', { stroke: true })
  ],
  'pseudónimo': [
    s('circle', { cx: 62, cy: 66, r: 36 }, 'skin'),
    s('path', { d: 'M24 62q38-14 76 0q-2 18-18 16t-20-8q-4 10-20 8t-18-16z' }, 'black', { accent: true }),
    s('path', { d: dots([[46, 66], [78, 66]], 5) }, 'skin'),
    s('path', { d: 'M48 86q14 8 28 0', ...SW(3) }, 'dark', { stroke: true }),
    ...paper(92, 92, 50, 46),
    s('path', { d: 'M100 112h26M100 124h20', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 98l30-62q8 18-4 34z' }, 'purple')
  ],
  pudiente: [
    s('path', { d: 'M22 136l8-18h40l8 18zM42 116l8-18h40l8 18zM82 136l8-18h40l8 18z' }, 'yellow'),
    s('path', { d: 'M100 102q-6-32 18-42l-8-12h24l-8 12q24 10 18 42z' }, 'green', { accent: true }),
    s('path', { d: 'M110 60h20', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 76q-6-26 14-34l-6-10h20l-6 10q20 8 14 34z' }, 'green'),
    s('path', { d: sparkle(30, 30, 8) + sparkle(140, 34, 7) }, 'yellow')
  ],
  'pícaro': [
    ...person(64, 138, 'brown', { accent: true }),
    s('rect', { x: 52, y: 110, width: 10, height: 10 }, 'orange'),
    s('path', { d: 'M56 76l8 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M70 76h0M58 86q8 4 14-2', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M76 104L124 50', ...SW(5) }, 'tan', { stroke: true }),
    s('circle', { cx: 124, cy: 50, r: 16 }, 'red'),
    s('path', { d: dots([[118, 46], [130, 54]], 3) }, 'white'),
    s('path', { d: 'M50 66l12-12 16 6', ...SW(5) }, 'dark', { stroke: true })
  ],
  'póquer': [
    s('rect', { x: 30, y: 34, width: 50, height: 72, rx: 6, transform: 'rotate(-18 55 106)' }, 'white'),
    s('rect', { x: 30, y: 34, width: 50, height: 72, rx: 6, transform: 'rotate(-18 55 106)', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 66, y: 30, width: 50, height: 72, rx: 6, transform: 'rotate(10 91 102)' }, 'white'),
    s('rect', { x: 66, y: 30, width: 50, height: 72, rx: 6, transform: 'rotate(10 91 102)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: heart(50, 70, 13) }, 'red', { accent: true }),
    s('path', { d: 'M92 50l12 16-12 16-12-16z' }, 'red'),
    s('path', { d: ells([[122, 134, 18, 6], [122, 126, 18, 6], [122, 118, 18, 6]]) }, 'blue'),
    s('path', { d: ells([[122, 134, 18, 6], [122, 126, 18, 6], [122, 118, 18, 6]]), ...DASH(3, '4 4') }, 'white', { stroke: true })
  ],
  'racionalización': [
    s('path', { d: 'M24 70q20-40 30 0t-20 30 28 10q16-20-8-50t-24 10', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 84h16', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M80 76l10 8-10 8z' }, 'orange'),
    s('path', { d: rects([[98, 56, 44, 12], [98, 78, 44, 12], [98, 100, 44, 12]]) }, 'blue', { accent: true }),
    s('path', { d: 'M100 130l8 8 14-16', ...SW(5) }, 'green', { stroke: true })
  ],
  ramen: [
    s('path', { d: 'M18 80h124q0 50-62 54q-62-4-62-54z' }, 'red', { accent: true }),
    s('ellipse', { cx: 80, cy: 80, rx: 62, ry: 12 }, 'tan'),
    s('path', { d: 'M34 80q8-8 16 0t16 0 16 0 16 0 16 0 12 0', ...SW(3) }, 'yellow', { stroke: true }),
    s('ellipse', { cx: 104, cy: 78, rx: 12, ry: 7 }, 'white'),
    s('circle', { cx: 104, cy: 78, r: 4 }, 'orange'),
    s('path', { d: leaflet(50, 76, -10, 22, 5) }, 'green'),
    s('path', { d: 'M74 76l50-58M86 78l50-54', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M60 52q-6-10 0-20M80 52q-6-10 0-20', ...SW(3) }, 'gray', { stroke: true })
  ],
  reacio: [
    ...lean(54, 138, -12, 'orange', { accent: true }),
    s('path', { d: 'M40 76q4 6 10 4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 106l18-14', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 86, cy: 90, r: 8 }, 'skin'),
    s('path', { d: 'M146 70l-42 8', ...SW(5) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 104, cy: 78, rx: 10, ry: 6 }, 'gray'),
    s('path', { d: dots([[104, 72], [98, 70], [110, 70]], 5) }, 'green')
  ],
  redundante: [
    ...paper(20, 30, 48, 62),
    ...paper(56, 50, 48, 62),
    s('rect', { x: 92, y: 70, width: 48, height: 62, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M28 44h32M28 56h24M64 64h32M64 76h24M100 84h32M100 96h24', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 84h32M100 96h24', ...SW(4) }, 'orange', { stroke: true })
  ],
  sachar: [
    s('rect', { x: 14, y: 116, width: 132, height: 26, rx: 4 }, 'brown'),
    s('path', { d: 'M30 28l66 82', ...SW(6) }, 'tan', { stroke: true }),
    s('path', { d: 'M86 102l22-12 8 14-24 12z' }, 'gray', { accent: true }),
    s('path', { d: leaflet(120, 116, -100, 22, 6) + leaflet(120, 116, -60, 18, 5) + leaflet(44, 116, -80, 20, 6) + leaflet(44, 116, -120, 16, 5) }, 'green'),
    s('path', { d: 'M126 84l6-8M134 94l8-4', ...SW(3) }, 'gray', { stroke: true })
  ],
  saharaui: [
    backdrop('sky', 14, 80),
    s('circle', { cx: 120, cy: 42, r: 16 }, 'yellow'),
    s('path', { d: 'M14 104q36-30 72-6q30-24 60-4v52H14z' }, 'tan', { accent: true }),
    s('path', { d: 'M14 124q40-22 80 0q30-12 52 0v22H14z' }, 'orange'),
    s('path', { d: 'M40 96l18-26 18 26z' }, 'brown'),
    s('path', { d: 'M58 70v26', ...SW(2) }, 'dark', { stroke: true })
  ],
  salpicar: [
    s('ellipse', { cx: 80, cy: 124, rx: 62, ry: 14 }, 'sky'),
    s('path', { d: 'M48 122q4-26 14-10q4-30 14-6q6-30 14 4q8-26 14 8q10-14 10 4z' }, 'blue', { accent: true }),
    s('path', { d: drop(80, 36, 8) }, 'blue'),
    s('path', { d: dots([[34, 92], [128, 90], [44, 70], [120, 66], [100, 52], [58, 50]], 4) }, 'blue')
  ],
  'sanación': [
    s('path', { d: heart(80, 76, 34) }, 'red', { accent: true }),
    s('rect', { x: 52, y: 70, width: 56, height: 18, rx: 6, transform: 'rotate(-30 80 79)' }, 'tan'),
    s('path', { d: dots([[74, 82], [80, 76], [86, 80]], 2) }, 'brown'),
    s('path', { d: sparkle(28, 40, 10) + sparkle(134, 36, 10) + sparkle(132, 124, 8) + sparkle(30, 122, 7) }, 'yellow'),
    s('path', { d: 'M24 82q-6-30 16-50M136 82q6-30-16-50', ...SW(4) }, 'mint', { stroke: true })
  ],
  sarna: [
    ...person(54, 138, 'blue'),
    s('path', { d: 'M68 104l40-14', ...SW(10) }, 'skin', { stroke: true, accent: true }),
    s('path', { d: dots([[84, 99], [94, 95], [100, 92], [90, 101]], 2.5) }, 'red'),
    s('path', { d: 'M40 104l46-6', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M86 80l6-8M98 78l4-10M110 82l8-6', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M48 86q6-4 12 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  sigilo: [
    backdrop('navy'),
    s('path', { d: 'M108 28a14 14 0 1 0 12 22a12 12 0 1 1-12-22z' }, 'yellow'),
    ...lean(76, 128, 8, 'black', { accent: true }),
    s('rect', { x: 74, y: 58, width: 22, height: 8, rx: 3, transform: 'rotate(8 76 128)' }, 'dark'),
    s('path', { d: 'M76 128l-16 8M76 128l14 6', ...SW(6) }, 'black', { stroke: true }),
    s('path', { d: ells([[36, 136, 5, 3], [24, 128, 5, 3]]) }, 'gray')
  ],
  silbato: [
    s('path', { d: 'M40 70h52l24-14v36l-14 0a34 34 0 1 1-62-22z' }, 'gray', { accent: true }),
    s('circle', { cx: 66, cy: 98, r: 12 }, 'white'),
    s('path', { d: 'M40 70q-26-30 0-50q30-10 46 10', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M126 48l12-10M128 70h14M126 92l12 10', ...SW(5) }, 'orange', { stroke: true }),
    s('rect', { x: 82, y: 68, width: 10, height: 6 }, 'dark')
  ],
  solapa: [
    s('path', { d: 'M24 140V60l40-36 16 30 16-30 40 36v80z' }, 'navy', { accent: true }),
    s('path', { d: 'M64 24l16 30 16-30z' }, 'white'),
    s('path', { d: 'M76 56h8l4 50-8 10-8-10z' }, 'red'),
    s('path', { d: 'M64 24L44 70l14 6-8 18 30 30M96 24l20 46-14 6 8 18-30 30', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: dots([[110, 84]], 7) }, 'pink'),
    s('circle', { cx: 110, cy: 84, r: 3 }, 'yellow')
  ],
  sonata: [
    s('rect', { x: 14, y: 84, width: 132, height: 52, rx: 4 }, 'white'),
    outline({ x: 14, y: 84, width: 132, height: 52, rx: 4 }),
    s('path', { d: 'M33 84v52M52 84v52M71 84v52M90 84v52M109 84v52M128 84v52', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: rects([[28, 84, 10, 30], [47, 84, 10, 30], [85, 84, 10, 30], [104, 84, 10, 30], [123, 84, 10, 30]]) }, 'black'),
    ...note(52, 58, 'purple'),
    ...note(100, 50, 'blue')
  ],
  sorpresivamente: [
    s('rect', { x: 40, y: 92, width: 80, height: 46, rx: 3 }, 'purple', { accent: true }),
    s('path', { d: 'M74 92h12v46H74z' }, 'yellow'),
    s('rect', { x: 30, y: 66, width: 52, height: 16, rx: 3, transform: 'rotate(-30 30 82)' }, 'purple'),
    s('path', { d: burst(92, 62, 26, 12, 9) }, 'yellow'),
    s('path', { d: rects([[54, 30, 6, 10], [118, 40, 6, 10], [100, 20, 6, 10]]) }, 'red'),
    s('path', { d: dots([[130, 70], [70, 44], [140, 28], [86, 24]], 4) }, 'blue'),
    s('path', { d: 'M30 50l12-6M126 96l12 4', ...SW(4) }, 'green', { stroke: true })
  ],
  sostenimiento: [
    s('path', { d: 'M14 46l66-26 66 26z' }, 'gray'),
    s('rect', { x: 18, y: 46, width: 124, height: 12 }, 'tan', { accent: true }),
    s('path', { d: rects([[28, 58, 16, 72], [72, 58, 16, 72], [116, 58, 16, 72]]) }, 'cream'),
    s('path', { d: 'M32 62v64M40 62v64M76 62v64M84 62v64M120 62v64M128 62v64', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 14, y: 130, width: 132, height: 10 }, 'gray')
  ],
  'tendón': [
    s('path', { d: 'M60 18h34l2 60q2 30 10 46h34v16H58q-8-30 0-62z' }, 'skin'),
    s('path', { d: 'M94 50q-2 50 14 80', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M94 40q-12 14-10 36', ...SW(3) }, 'pink', { stroke: true }),
    s('path', { d: ring(104, 108, 14), ...DASH(3, '4 4') }, 'orange', { stroke: true })
  ],
  tildar: [
    ...person(100, 138, 'green', { accent: true }),
    s('path', { d: 'M86 106h30v14H86z' }, 'yellow'),
    s('path', { d: dots([[92, 113]], 2) }, 'dark'),
    s('path', { d: 'M100 86q4-4 8 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 70h42', ...SW(14) }, 'blue', { stroke: true }),
    s('path', { d: 'M56 62h12M56 70h22', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M82 66l-4-8M84 76l6 2', ...SW(3) }, 'orange', { stroke: true })
  ],
  tranca: [
    s('rect', { x: 24, y: 18, width: 112, height: 122, rx: 4 }, 'brown'),
    s('path', { d: 'M52 18v122M80 18v122M108 18v122', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M28 62h12v28H28zM120 62h12v28h-12z' }, 'dark'),
    s('rect', { x: 14, y: 68, width: 132, height: 16, rx: 3 }, 'tan', { accent: true }),
    s('path', { d: 'M20 76h120', ...SW(2) }, 'brown', { stroke: true })
  ],
  trovador: [
    ...person(54, 138, 'red', { accent: true }),
    s('path', { d: 'M40 70q14-14 28 0z' }, 'green'),
    s('path', { d: 'M66 64q14-14 22-30', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M74 116q-16-16 2-30q22-8 24 14q0 22-26 16z' }, 'brown'),
    s('path', { d: 'M90 96l34-34', ...SW(6) }, 'brown', { stroke: true }),
    ...note(124, 104, 'purple')
  ],
  'unánimemente': [
    s('path', { d: busts([30, 64, 98, 132], 138, 26, 34) }, 'blue', { accent: true }),
    s('path', { d: dots([[30, 104], [64, 104], [98, 104], [132, 104]], 10) }, 'skin'),
    s('path', { d: 'M40 120V70M74 120V70M108 120V70M142 120V70', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: dots([[40, 66], [74, 66], [108, 66], [142, 66]], 7) }, 'skin'),
    s('path', { d: 'M60 30l12 12 24-22', ...SW(6) }, 'green', { stroke: true })
  ],
  verdoso: [
    s('path', { d: 'M18 132q-4-50 30-72q30-26 70-10q30 20 24 82z' }, 'gray'),
    s('path', { d: 'M30 92q10-20 28-24q10 10-2 22q-14 10-26 2zM90 66q20-6 36 10q-8 12-24 6q-12-4-12-16zM60 120q16-16 40-6q-10 16-40 6z' }, 'green', { accent: true }),
    s('path', { d: 'M48 76q12-6 20 4M114 96q10 2 16 14M20 128q14-6 24 0', ...SW(5) }, 'mint', { stroke: true }),
    s('path', { d: 'M14 134h132', ...SW(4) }, 'brown', { stroke: true })
  ],
  vigoroso: [
    ...person(70, 138, 'red', { w: 40, accent: true }),
    s('path', { d: 'M90 104h20l-4-24', ...SW(10) }, 'skin', { stroke: true }),
    s('circle', { cx: 104, cy: 92, r: 10 }, 'skin'),
    s('path', { d: 'M50 104l-12-20', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M62 82q8 6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M128 28l-12 22h10l-8 20 20-28h-10l8-14z' }, 'yellow'),
    s('path', { d: 'M28 50l8 6M24 70h10', ...SW(4) }, 'orange', { stroke: true })
  ],
  'vizcaíno': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'blue'),
    s('path', { d: 'M14 14h132v40q-30 0-46 20t-50 6q-20 10-36 0z' }, 'green', { accent: true }),
    s('path', { d: 'M100 54v-24h10v24z' }, 'white'),
    s('path', { d: 'M98 30h14l-7-8z' }, 'red'),
    s('path', { d: 'M30 112q8-6 16 0t16 0M86 126q8-6 16 0t16 0M70 98q8-6 16 0', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: 'M110 94h22l-4 8h-14z' }, 'red'),
    s('path', { d: 'M120 94V80l8 10z' }, 'white')
  ],
  voraz: [
    s('path', { d: 'M16 80q30-30 80-20l14-22 6 26q20 8 30 16q-12 10-30 14l-6 22-16-18q-44 6-78-18z' }, 'gray', { accent: true }),
    s('path', { d: 'M16 80q-4-20 8-26l14 20M16 80q-4 20 8 26l14-20' }, 'gray'),
    s('path', { d: 'M146 80l-30-6q-6 6 0 12z' }, 'white'),
    s('path', { d: 'M146 80l-30-6q-6 6 0 12z', ...SW(2) }, 'dark', { stroke: true }),
    s('circle', { cx: 118, cy: 68, r: 4 }, 'dark'),
    s('path', { d: ells([[100, 122, 10, 6]]) + 'M110 122l8-6v12z' }, 'orange')
  ],
  'vudú': [
    s('path', { d: 'M80 22a20 20 0 1 1 0 40a20 20 0 1 1 0-40zM68 62h24l30 10-4 10-22-6v24l12 34H94l-14-22-14 22H52l12-34V76l-22 6-4-10z' }, 'tan', { accent: true }),
    s('path', { d: dots([[73, 40], [87, 40]], 4) }, 'dark'),
    s('path', { d: 'M72 52h16M76 50v4M80 50v4M84 50v4', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 64v36', ...DASH(2, '3 3') }, 'brown', { stroke: true }),
    s('path', { d: 'M100 84l26-14M58 96l-24 12', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[128, 68], [32, 110]], 5) }, 'red')
  ],
  vulnerar: [
    s('path', { d: 'M80 20l50 16v40q0 40-50 64q-50-24-50-64V36z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 52l-8 20 12 12-10 20', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: 'M146 18L84 76', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M86 66l-8 14 14-6z' }, 'gray'),
    s('path', { d: 'M142 14l4 14 8-10zM134 22l6 12 6-12z' }, 'red')
  ],
  'álgido': [
    s('path', { d: 'M14 136l60-90 22 30 12-14 38 74z' }, 'gray', { accent: true }),
    s('path', { d: 'M56 74l18-28 14 20-8 4-6-6-8 12z' }, 'white'),
    s('path', { d: 'M74 46V18', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M76 18h22l-6 6 6 6H76z' }, 'red'),
    s('path', { d: rays(124, 40, 4, 12, 6), ...SW(3) }, 'sky', { stroke: true })
  ],
  'ánima': [
    s('path', { d: 'M52 128V72a28 28 0 0 1 56 0v56l-10-8-8 8-10-8-10 8-8-8z', opacity: 0.85 }, 'sky', { accent: true }),
    s('path', { d: dots([[70, 72], [90, 72]], 5) }, 'navy'),
    s('ellipse', { cx: 80, cy: 34, rx: 20, ry: 6, ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: sparkle(30, 60, 8) + sparkle(130, 70, 7) + sparkle(124, 120, 5) }, 'yellow')
  ],
  'ávido': [
    ...person(60, 138, 'purple'),
    s('rect', { x: 64, y: 82, width: 40, height: 32, rx: 3, transform: 'rotate(-10 84 98)' }, 'red', { accent: true }),
    s('path', { d: 'M84 84v30', ...SW(2), transform: 'rotate(-10 84 98)' }, 'white', { stroke: true }),
    s('path', { d: star(54, 78, 4) + star(66, 78, 4) }, 'yellow'),
    s('path', { d: rects([[114, 120, 32, 14], [116, 106, 28, 14], [112, 92, 34, 14]]) }, 'blue'),
    s('path', { d: heart(110, 50, 12) }, 'pink')
  ],
  'abdicación': [
    s('path', { d: 'M24 136V40q0-12 12-12h28q12 0 12 12v96' }, 'red'),
    s('rect', { x: 20, y: 90, width: 60, height: 16, rx: 4 }, 'yellow'),
    s('path', { d: 'M34 90l-4-22 12 10 8-16 8 16 12-10-4 22z' }, 'yellow', { accent: true }),
    ...person(122, 138, 'purple'),
    s('path', { d: 'M110 40h-20', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M108 32l12 8-12 8z' }, 'orange')
  ],
  adhesivo: [
    s('path', { d: 'M64 104h76v20H64z' }, 'yellow'),
    s('path', { d: ring(64, 72, 30), ...SW(20) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: ring(64, 72, 19), ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: ring(64, 72, 40), ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M140 104l-4 5 4 5-4 5 4 5', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M18 136h124', ...SW(4) }, 'gray', { stroke: true })
  ],
  aeroespacial: [
    s('path', { d: 'M60 20q20 20 20 60v34H40V80q0-40 20-60z' }, 'white'),
    s('path', { d: 'M60 20q20 20 20 60v34H40V80q0-40 20-60z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 90l-12 30h12zM80 90l12 30H80z' }, 'red', { accent: true }),
    s('circle', { cx: 60, cy: 60, r: 8 }, 'sky'),
    s('path', { d: 'M48 114l12 30 12-30z' }, 'orange'),
    s('path', { d: jet(118, 60) }, 'blue'),
    s('path', { d: star(124, 120, 6) + star(30, 30, 5) }, 'yellow')
  ],
  afamado: [
    s('path', { d: 'M60 16L30 136h100L100 16z', opacity: 0.4 }, 'yellow'),
    ...person(80, 136, 'purple', { accent: true }),
    s('path', { d: 'M68 104L50 74M92 104l18-30', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: star(28, 40, 10) + star(134, 44, 10) + star(130, 100, 7) + star(30, 104, 7) }, 'yellow'),
    ground(138)
  ],
  agrio: [
    s('ellipse', { cx: 54, cy: 92, rx: 38, ry: 28 }, 'yellow', { accent: true }),
    s('path', { d: 'M16 92l-4-6M92 92l4-6' }, 'yellow'),
    s('circle', { cx: 116, cy: 52, r: 26 }, 'skin'),
    s('path', { d: 'M104 46l8 4M128 46l-8 4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M110 64q6-6 12 0q-6 6-12 0z' }, 'dark'),
    s('path', { d: 'M34 92h40M54 72v40M40 78l28 28M68 78l-28 28', ...SW(2) }, 'cream', { stroke: true }),
    s('path', { d: drop(140, 30, 4) }, 'sky')
  ],
  ahuyentar: [
    s('path', { d: 'M80 140V44M44 70h72', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M58 68h44l-6 44H64z' }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 46, r: 14 }, 'tan'),
    s('path', { d: 'M56 36h48l-10-6v-14H66v14z' }, 'brown'),
    s('path', { d: dots([[40, 70], [120, 70]], 6) }, 'yellow'),
    s('path', { d: birds([[124, 26], [140, 44], [30, 30]]), ...SW(4) }, 'dark', { stroke: true })
  ],
  anclaje: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M80 54v74M64 66h32M48 104q4 24 32 24t32-24', ...SW(9) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: ring(80, 44, 9), ...SW(6) }, 'navy', { stroke: true }),
    s('path', { d: 'M40 106l8-10 8 10zM104 106l8-10 8 10z' }, 'navy'),
    s('path', { d: 'M14 136q30-6 66 0t66 0v10H14z' }, 'tan'),
    s('path', { d: 'M80 36q10-14 0-22', ...DASH(4, '5 4') }, 'gray', { stroke: true })
  ],
  angelito: [
    s('path', { d: ells([[48, 88, 20, 14], [112, 88, 20, 14]]) }, 'white'),
    s('path', { d: ells([[48, 88, 20, 14], [112, 88, 20, 14]]), ...SW(3) }, 'sky', { stroke: true }),
    s('circle', { cx: 80, cy: 66, r: 20 }, 'skin'),
    s('rect', { x: 64, y: 86, width: 32, height: 40, rx: 12 }, 'pink', { accent: true }),
    s('ellipse', { cx: 80, cy: 36, rx: 16, ry: 5, ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M72 72q8 6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[73, 62], [87, 62]], 2.5) }, 'dark')
  ],
  aprovisionamiento: [
    s('path', { d: 'M100 70h24l16 22v28h-40z' }, 'red', { accent: true }),
    s('path', { d: 'M108 76h14l10 14h-24z' }, 'sky'),
    s('rect', { x: 18, y: 58, width: 84, height: 62, rx: 3 }, 'gray'),
    s('path', { d: rects([[26, 86, 22, 22], [52, 86, 22, 22], [38, 64, 22, 22]]) }, 'tan'),
    s('path', { d: ells([[86, 96, 10, 14]]) }, 'cream'),
    s('path', { d: dots([[38, 124], [118, 124]], 10) }, 'dark')
  ],
  arrendar: [
    s('path', { d: 'M18 72L60 36l42 36z' }, 'red'),
    s('rect', { x: 26, y: 72, width: 68, height: 64 }, 'cream'),
    s('rect', { x: 50, y: 100, width: 20, height: 36 }, 'brown'),
    s('path', { d: ring(118, 70, 12) + 'M118 82v44M118 108h12M118 118h8', ...SW(7) }, 'yellow', { stroke: true, accent: true }),
    s('rect', { x: 30, y: 80, width: 16, height: 14 }, 'sky')
  ],
  aspiradora: [
    s('ellipse', { cx: 52, cy: 110, rx: 34, ry: 24 }, 'red', { accent: true }),
    s('path', { d: dots([[34, 132], [70, 132]], 7) }, 'dark'),
    s('path', { d: 'M80 98q40 0 40-60', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M120 38v-12', ...SW(10) }, 'dark', { stroke: true }),
    s('path', { d: 'M114 120l14-82', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 100, y: 120, width: 40, height: 12, rx: 4 }, 'dark'),
    s('path', { d: dots([[138, 140], [146, 132], [130, 140]], 2.5) }, 'brown')
  ],
  'atañer': [
    s('circle', { cx: 60, cy: 80, r: 40, opacity: 0.8 }, 'sky'),
    s('circle', { cx: 100, cy: 80, r: 40, opacity: 0.8 }, 'pink'),
    s('path', { d: 'M80 45a40 40 0 0 1 0 70a40 40 0 0 1 0-70z' }, 'purple', { accent: true }),
    s('path', { d: 'M40 136h80', ...SW(4) }, 'gray', { stroke: true })
  ],
  automovilista: [
    s('path', { d: 'M34 86l18-32h56l18 32z' }, 'sky'),
    s('circle', { cx: 86, cy: 70, r: 12 }, 'skin'),
    s('rect', { x: 76, y: 82, width: 20, height: 6 }, 'blue'),
    s('rect', { x: 18, y: 84, width: 124, height: 34, rx: 10 }, 'red', { accent: true }),
    s('path', { d: dots([[46, 120], [114, 120]], 14) }, 'dark'),
    s('path', { d: dots([[46, 120], [114, 120]], 5) }, 'gray'),
    s('path', { d: 'M64 66l6 14', ...SW(4) }, 'dark', { stroke: true })
  ],
  'añicos': [
    s('path', { d: 'M24 134l14-18 12 14zM60 136l8-22 18 10 2 12zM98 132l16-14 10 16zM120 124l14-6 4 14z' }, 'blue', { accent: true }),
    s('path', { d: 'M40 108l10-12 8 10zM88 112l6-10 8 8zM70 98l8-6 2 10z' }, 'navy'),
    s('path', { d: 'M28 70l6-8M60 58v-10M104 64l8-8M130 84l10-4', ...SW(4) }, 'orange', { stroke: true }),
    ground(138)
  ],
  banano: [
    s('path', { d: 'M74 136l4-80h8l4 80z' }, 'green'),
    s('path', { d: leaflet(82, 56, -150, 62, 14) + leaflet(82, 56, -30, 62, 14) + leaflet(82, 56, -95, 44, 12) }, 'green'),
    s('path', { d: 'M86 70l14 30', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M90 82q-4 18 10 30M100 84q-2 18 12 26M108 80q2 18 16 20M94 98q-2 16 12 24', ...SW(9) }, 'yellow', { stroke: true, accent: true }),
    ground()
  ],
  beige: [
    s('path', { d: 'M56 26l-38 24 10 34 16-8v60h72V76l16 8 10-34-38-24q-6 14-24 14t-24-14z' }, 'tan', { accent: true }),
    s('path', { d: 'M44 128h72M44 120h72M28 84l16-8M132 84l-16-8', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M56 26q24 22 48 0', ...SW(4) }, 'cream', { stroke: true }),
    s('path', { d: 'M60 60l10 10 10-10 10 10 10-10', ...SW(3) }, 'cream', { stroke: true })
  ],
  bledo: [
    s('path', { d: 'M80 136V40M80 90l-30-20M80 76l26-18', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 110, -160, 34, 10) + leaflet(80, 104, -20, 34, 10) }, 'green'),
    s('path', { d: ells([[80, 36, 7, 18], [48, 64, 6, 14], [108, 52, 6, 14]]) }, 'red', { accent: true }),
    s('path', { d: dots([[80, 22], [48, 52], [108, 40]], 4) }, 'pink'),
    ground()
  ],
  boina: [
    s('circle', { cx: 80, cy: 98, r: 34 }, 'skin'),
    s('path', { d: 'M38 74q2-34 46-34q40 0 42 26q-6 14-44 16q-34 0-44-8z' }, 'navy', { accent: true }),
    s('path', { d: 'M84 40v-10', ...SW(5) }, 'navy', { stroke: true }),
    s('path', { d: dots([[68, 98], [92, 98]], 3.5) }, 'dark'),
    s('path', { d: 'M70 114q10 8 20 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 132h52v8H54z' }, 'red')
  ],
  bullicio: [
    s('path', { d: busts([24, 52, 80, 108, 136], 140, 24, 30) }, 'orange', { accent: true }),
    s('path', { d: dots([[24, 106], [52, 102], [80, 106], [108, 102], [136, 106]], 10) }, 'skin'),
    s('path', { d: bubble(16, 20, 40, 30) + bubble(104, 18, 40, 30) }, 'white'),
    s('path', { d: bubble(16, 20, 40, 30) + bubble(104, 18, 40, 30), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 34q4-6 8 0t8 0 8 0M112 32q4-6 8 0t8 0 8 0M66 34l4 14M80 26v20M94 34l-4 14', ...SW(3) }, 'red', { stroke: true })
  ],
  cabelludo: [
    s('path', { d: ells([[80, 66, 58, 46], [36, 100, 22, 30], [124, 100, 22, 30]]) }, 'brown', { accent: true }),
    s('circle', { cx: 80, cy: 88, r: 30 }, 'skin'),
    s('path', { d: 'M50 76q10-26 30-14q20-12 30 14q-10-30-30-30t-30 30z' }, 'brown'),
    s('path', { d: dots([[70, 90], [90, 90]], 3) }, 'dark'),
    s('path', { d: 'M72 104q8 6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 40q8-8 16 0M100 34q8-8 16 0M30 80q-6 8 0 16', ...SW(3) }, 'tan', { stroke: true })
  ],
  capuchino: [
    s('ellipse', { cx: 76, cy: 128, rx: 60, ry: 10 }, 'gray'),
    s('path', { d: 'M24 70h104q0 56-52 56T24 70z' }, 'white'),
    s('path', { d: 'M24 70h104q0 56-52 56T24 70z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M126 82q20 0 18 14t-24 10', ...SW(6) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 76, cy: 70, rx: 52, ry: 10 }, 'brown', { accent: true }),
    s('path', { d: heart(76, 66, 10) }, 'cream'),
    s('path', { d: 'M62 50q-6-10 0-20M86 50q-6-10 0-20', ...SW(3) }, 'gray', { stroke: true })
  ],
  'cartílago': [
    backdrop('sky'),
    s('path', { d: 'M62 14h36v40q14 2 14 16H48q0-14 14-16zM48 92h64q0 14-14 16v38H62v-38q-14-2-14-16z' }, 'white'),
    s('path', { d: 'M62 14h36v40q14 2 14 16H48q0-14 14-16zM48 92h64q0 14-14 16v38H62v-38q-14-2-14-16z', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 46, y: 72, width: 68, height: 18, rx: 9 }, 'blue', { accent: true })
  ],
  chacra: [
    s('path', { d: 'M14 70l30-36 26 24 26-30 50 42z' }, 'gray'),
    s('rect', { x: 14, y: 70, width: 132, height: 70 }, 'green', { accent: true }),
    s('path', { d: 'M24 90h60M20 104h64M16 118h70M14 132h72', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 98, y: 92, width: 38, height: 30 }, 'tan'),
    s('path', { d: 'M94 94l23-22 23 22z' }, 'yellow'),
    s('rect', { x: 112, y: 104, width: 10, height: 18 }, 'brown')
  ],
  'champiñón': [
    s('path', { d: 'M48 136l4-34h16l4 34zM96 136l4-26h12l4 26z' }, 'cream'),
    s('path', { d: 'M48 136l4-34h16l4 34zM96 136l4-26h12l4 26z', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M20 104a40 36 0 0 1 80 0z' }, 'white'),
    s('path', { d: 'M76 112a30 26 0 0 1 60 0z' }, 'white'),
    s('path', { d: 'M20 104a40 36 0 0 1 80 0zM76 112a30 26 0 0 1 60 0z', ...SW(3) }, 'brown', { stroke: true, accent: true }),
    ground(138)
  ],
  'circunvalación': [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'mint'),
    s('path', { d: ring(80, 80, 52), ...SW(14) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: ring(80, 80, 52), ...DASH(2, '6 6') }, 'white', { stroke: true }),
    s('path', { d: rects([[56, 62, 14, 36], [74, 50, 14, 48], [92, 68, 14, 30]]) }, 'blue'),
    s('rect', { x: 122, y: 70, width: 14, height: 22, rx: 3 }, 'red')
  ],
  cirrosis: [
    s('path', { d: 'M22 72q-6-34 40-36q50-2 76 14q12 10-8 28q-30 26-60 34q-40 6-48-40z' }, 'brown', { accent: true }),
    s('path', { d: dots([[44, 62], [66, 56], [90, 54], [52, 84], [76, 78], [100, 70], [116, 60], [66, 100], [88, 92]], 5) }, 'tan'),
    s('path', { d: 'M80 106v28', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M100 32q4-14 16-16', ...SW(4) }, 'red', { stroke: true })
  ],
  clarinete: [
    s('path', { d: 'M74 18h12v104H74z' }, 'black', { accent: true }),
    s('path', { d: 'M72 120h16l10 22H62z' }, 'black'),
    s('path', { d: 'M76 10h8l-1 8h-6z' }, 'gray'),
    s('path', { d: dots([[80, 40], [80, 56], [80, 72], [80, 88], [80, 104]], 3.5) }, 'gray'),
    s('path', { d: 'M86 46h8v20M86 80h8v20', ...SW(2) }, 'gray', { stroke: true }),
    ...note(118, 58, 'purple'),
    ...note(40, 82, 'blue')
  ],
  cobalto: [
    s('path', { d: 'M40 120l-12-40 30-40 46 6 22 40-20 40z' }, 'blue', { accent: true }),
    s('path', { d: 'M58 40l10 44-40-4M68 84l38 6M68 84l-28 36M106 90l20-4M106 90l-2 40', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M58 40l46 6-36 38z' }, 'sky'),
    s('path', { d: sparkle(130, 36, 9) + sparkle(28, 46, 6) }, 'yellow'),
    ground(138)
  ],
  compartimiento: [
    s('rect', { x: 18, y: 40, width: 124, height: 90, rx: 6 }, 'brown', { accent: true }),
    s('path', { d: rects([[26, 48, 50, 34], [84, 48, 50, 34], [26, 88, 32, 34], [64, 88, 32, 34], [102, 88, 32, 34]]) }, 'tan'),
    s('path', { d: dots([[40, 64], [56, 70]], 7) }, 'red'),
    s('path', { d: 'M92 60h34M92 70h34', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: dots([[42, 106], [80, 104], [118, 106]], 8) }, 'yellow')
  ],
  complacencia: [
    s('path', { d: 'M22 136V80q0-10 10-10h96q10 0 10 10v56z' }, 'green'),
    s('rect', { x: 34, y: 98, width: 92, height: 22, rx: 6 }, 'mint'),
    s('circle', { cx: 80, cy: 62, r: 16 }, 'skin'),
    s('rect', { x: 62, y: 76, width: 36, height: 26, rx: 10 }, 'orange', { accent: true }),
    s('path', { d: 'M72 60q4 3 8 0M84 60q4 3 8 0M72 68q8 6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 82l-8-18 14 0M98 82l8-18-14 0', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(124, 36, 8) }, 'yellow')
  ],
  'corpiño': [
    s('path', { d: 'M80 20v14M58 50q22-26 44 0', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 60l6 40M120 60l-6 40', ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: 'M30 112q0-26 24-26q20 0 26 20q6-20 26-20q24 0 24 26z' }, 'pink', { accent: true }),
    s('rect', { x: 26, y: 110, width: 108, height: 10, rx: 4 }, 'pink'),
    s('path', { d: 'M80 104l-6 6h12z' }, 'red')
  ],
  craneal: [
    backdrop('sky'),
    s('path', { d: 'M80 24q48 0 48 48q0 22-14 30v18H46v-18q-14-8-14-30q0-48 48-48z' }, 'white', { accent: true }),
    s('path', { d: 'M80 24q48 0 48 48q0 22-14 30v18H46v-18q-14-8-14-30q0-48 48-48z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[62, 76, 11, 12], [98, 76, 11, 12]]) + 'M80 88l-6 12h12z' }, 'gray'),
    s('path', { d: 'M58 120v12M70 120v12M90 120v12M102 120v12', ...SW(3) }, 'gray', { stroke: true })
  ],
  criadero: [
    s('rect', { x: 14, y: 84, width: 132, height: 54, rx: 4 }, 'tan'),
    s('path', { d: 'M18 84v54M40 84v54M62 84v54M84 84v54M106 84v54M128 84v54M14 96h132', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: ells([[40, 122, 14, 12], [80, 118, 14, 12], [120, 122, 14, 12]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M54 120l8 2-8 2zM94 116l8 2-8 2zM134 120l8 2-8 2z' }, 'orange'),
    s('path', { d: 'M80 14v24', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 52q0-16 18-16t18 16z' }, 'red'),
    s('path', { d: 'M66 60l-10 14M80 60v16M94 60l10 14', ...SW(3) }, 'orange', { stroke: true })
  ],
  cultivador: [
    s('rect', { x: 14, y: 118, width: 132, height: 22, rx: 4 }, 'brown'),
    ...person(48, 118, 'green', { accent: true }),
    s('path', { d: 'M38 56h20l-4-8h-12z' }, 'yellow'),
    s('path', { d: 'M60 92h22', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M80 84h22v20H80z' }, 'blue'),
    s('path', { d: 'M102 90l18-10', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: leaflet(116, 118, -60, 16, 5) + leaflet(116, 118, -120, 16, 5) + leaflet(136, 118, -60, 14, 5) + leaflet(136, 118, -120, 14, 5) }, 'green'),
    s('path', { d: dots([[124, 92], [128, 102]], 2.5) }, 'sky')
  ],
  depurar: [
    s('path', { d: 'M30 30h100L92 82v18H68V82z' }, 'gray'),
    s('path', { d: 'M38 36h84l-16 16H54z' }, 'brown'),
    s('path', { d: dots([[60, 44], [80, 42], [100, 46]], 3) }, 'dark'),
    s('path', { d: drop(80, 112, 6) }, 'sky'),
    s('path', { d: 'M52 140V122h56v18z' }, 'blue', { accent: true }),
    s('path', { d: sparkle(124, 118, 8) }, 'yellow')
  ],
  descontar: [
    s('path', { d: 'M20 60l40-36h60v72H60z' }, 'yellow', { accent: true }),
    s('circle', { cx: 44, cy: 60, r: 7 }, 'white'),
    s('path', { d: 'M74 50h34M74 64h26', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M120 112v24', ...SW(8) }, 'red', { stroke: true }),
    s('path', { d: 'M108 132l12 12 12-12z' }, 'red'),
    s('path', { d: ring(34, 118, 9) + ring(56, 126, 9) + 'M42 112l40-24M62 120l40-12', ...SW(4) }, 'gray', { stroke: true })
  ],
  deshielo: [
    s('circle', { cx: 124, cy: 34, r: 14 }, 'yellow'),
    s('path', { d: rays(124, 34, 18, 24, 8), ...SW(3) }, 'yellow', { stroke: true }),
    s('ellipse', { cx: 76, cy: 128, rx: 60, ry: 10 }, 'blue'),
    s('path', { d: 'M40 120V70q0-6 6-6h52q6 0 6 6v50q-8-8-16 0t-16 0-16 0-16 0z' }, 'sky', { accent: true }),
    s('path', { d: 'M50 76l12 0M50 86h6', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: drop(110, 104, 5) + drop(32, 110, 4) }, 'blue')
  ],
  distal: [
    s('circle', { cx: 30, cy: 54, r: 12 }, 'skin'),
    s('rect', { x: 18, y: 68, width: 24, height: 60, rx: 8 }, 'blue'),
    s('path', { d: 'M40 76l70 6', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M108 72l16 4 16 2M108 86l20 2', ...SW(5) }, 'skin', { stroke: true }),
    s('circle', { cx: 140, cy: 78, r: 6 }, 'red', { accent: true }),
    s('path', { d: 'M40 108h86', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M122 100l12 8-12 8z' }, 'orange')
  ],
  disyuntiva: [
    s('path', { d: 'M18 136V40q0-8 8-8h32q8 0 8 8v96z' }, 'red'),
    s('path', { d: 'M94 136V40q0-8 8-8h32q8 0 8 8v96z' }, 'blue'),
    s('path', { d: dots([[58, 88], [102, 88]], 4) }, 'yellow'),
    ...person(80, 138, 'purple', { h: 36, w: 24, r: 10, accent: true }),
    s('path', { d: 'M70 98l-8-22M90 98l8-22', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M66 50l-8-8M80 46V34M94 50l8-8', ...SW(3) }, 'orange', { stroke: true })
  ],
  dolorosamente: [
    ...face(70, 80, 42, 'skin', 'frown', { accent: false }),
    s('path', { d: drop(50, 98, 5) + drop(90, 98, 5) }, 'sky'),
    s('path', { d: 'M48 66l12 6M92 66l-12 6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: heart(126, 40, 16) }, 'red', { accent: true }),
    s('path', { d: 'M126 22l-5 10 8 6-6 12', ...SW(3) }, 'white', { stroke: true })
  ],
  'electromagnético': [
    s('path', { d: 'M38 30v52a42 42 0 0 0 84 0V30', ...SW(22, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M38 30v18M122 30v18', ...SW(22, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 52l-14 22h12l-10 22 20-30H82l8-14z' }, 'yellow'),
    s('path', { d: 'M18 142q12-12 24 0t24 0 24 0 24 0 24 0', ...SW(4) }, 'blue', { stroke: true })
  ],
  elixir: [
    s('path', { d: 'M68 20h24v34q30 10 30 44a42 42 0 0 1-84 0q0-34 30-44z' }, 'white'),
    s('path', { d: 'M40 96h80a40 40 0 0 1-80 0z' }, 'mint', { accent: true }),
    s('path', { d: 'M68 20h24v34q30 10 30 44a42 42 0 0 1-84 0q0-34 30-44z', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 66, y: 14, width: 28, height: 10, rx: 3 }, 'brown'),
    s('path', { d: dots([[64, 112], [90, 120], [80, 104]], 4) }, 'white'),
    s('path', { d: sparkle(26, 40, 10) + sparkle(134, 48, 9) + sparkle(130, 128, 6) }, 'yellow')
  ],
  endurecer: [
    s('path', { d: 'M18 110q0-24 18-28q18-10 30 6q10 18-6 26q-22 10-42-4z' }, 'pink'),
    s('path', { d: 'M70 92h14', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M82 84l10 8-10 8z' }, 'orange'),
    s('path', { d: 'M100 76l20-10 22 10v36l-22 12-20-12z' }, 'gray', { accent: true }),
    s('path', { d: 'M100 76l20 10 22-10M120 86v38', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(130, 44, 8) }, 'yellow'),
    ground()
  ],
  endurecimiento: [
    s('path', { d: 'M14 54h132v52H14z' }, 'red', { accent: true }),
    s('path', { d: 'M14 64h132v32H14z' }, 'pink'),
    s('path', { d: 'M56 64q24 14 48 0zM60 96q20-12 40 0z' }, 'yellow'),
    s('path', { d: 'M24 80h20M116 80h20', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M40 74l8 6-8 6zM132 74l8 6-8 6z' }, 'orange')
  ],
  episcopado: [
    s('path', { d: busts([32, 80, 128], 138, 34, 46) }, 'purple', { accent: true }),
    s('path', { d: dots([[32, 92], [80, 92], [128, 92]], 12) }, 'skin'),
    s('path', { d: 'M22 80v-18l10-12 10 12v18zM70 80v-18l10-12 10 12v18zM118 80v-18l10-12 10 12v18z' }, 'white'),
    s('path', { d: 'M22 80v-18l10-12 10 12v18zM70 80v-18l10-12 10 12v18zM118 80v-18l10-12 10 12v18z', ...SW(2) }, 'yellow', { stroke: true }),
  ],
  esclarecimiento: [
    backdrop('navy'),
    s('path', { d: 'M46 108l60-58 30 56z', opacity: 0.85 }, 'yellow', { accent: true }),
    s('rect', { x: 18, y: 104, width: 44, height: 18, rx: 6, transform: 'rotate(-40 40 113)' }, 'gray'),
    s('path', { d: ring(104, 86, 8) + 'M110 92l14 14M120 102l4-4', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: sparkle(128, 60, 6) }, 'white')
  ],
  especulativo: [
    s('path', { d: 'M18 118l26-30 20 16 26-46 20 24 28-46', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M128 26l12 6-10 8z' }, 'green'),
    s('circle', { cx: 56, cy: 50, r: 26, opacity: 0.85 }, 'purple', { accent: true }),
    s('path', { d: 'M44 42q4-8 12-8', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M38 84h36l-4-10H42z' }, 'brown'),
    s('path', { d: 'M18 136h124', ...SW(4) }, 'gray', { stroke: true })
  ],
  'estéticamente': [
    s('rect', { x: 26, y: 18, width: 108, height: 124, rx: 4 }, 'yellow'),
    s('rect', { x: 36, y: 28, width: 88, height: 104 }, 'cream'),
    s('path', { d: 'M66 130q-14-14-4-36h36q10 22-4 36z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 94V60M80 74l-14-10', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: dots([[80, 52]], 9) + dots([[64, 60]], 7) }, 'pink'),
    s('path', { d: sparkle(110, 44, 8) + sparkle(50, 112, 5) }, 'orange')
  ],
  explicativo: [
    s('rect', { x: 62, y: 24, width: 84, height: 62, rx: 3 }, 'white'),
    outline({ x: 62, y: 24, width: 84, height: 62, rx: 3 }),
    s('path', { d: wedge(90, 55, 20, -90, 60) }, 'orange'),
    s('path', { d: wedge(90, 55, 20, 60, 270) }, 'blue'),
    s('path', { d: 'M118 46h18M118 58h14M118 70h18', ...SW(4) }, 'gray', { stroke: true }),
    ...person(36, 138, 'green', { accent: true }),
    s('path', { d: 'M48 106l26-44', ...SW(6) }, 'skin', { stroke: true })
  ],
  exprimir: [
    s('path', { d: 'M26 118h108l-14 22H40z' }, 'gray'),
    s('path', { d: 'M54 118q0-30 26-36q26 6 26 36z' }, 'white'),
    s('path', { d: 'M54 118q0-30 26-36q26 6 26 36z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 80a40 40 0 0 1 80 0z' }, 'orange', { accent: true }),
    s('path', { d: 'M46 80a34 34 0 0 1 68 0z' }, 'yellow'),
    s('rect', { x: 50, y: 24, width: 60, height: 24, rx: 10 }, 'skin'),
    s('path', { d: 'M80 52v12', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: drop(64, 100, 4) + drop(96, 104, 4) }, 'orange')
  ],
  extremar: [
    s('rect', { x: 34, y: 16, width: 92, height: 124, rx: 4 }, 'brown'),
    s('path', { d: 'M56 30q0-12 10-12t10 12v16H56zM56 60q0-12 10-12t10 12v16H56zM56 90q0-12 10-12t10 12v16H56z', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 46h32v14H66zM66 76h32v14H66zM66 106h32v14H66z' }, 'yellow', { accent: true }),
    s('path', { d: 'M96 30q20 50-2 100', ...DASH(5, '8 4') }, 'gray', { stroke: true })
  ],
  fecal: [
    s('path', { d: 'M100 22h36v48h-36z' }, 'white'),
    s('path', { d: 'M100 22h36v48h-36z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M22 72h112q0 34-36 40l4 24H56l4-24q-38-6-38-40z' }, 'white'),
    s('path', { d: 'M22 72h112q0 34-36 40l4 24H56l4-24q-38-6-38-40z', ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 70, cy: 72, rx: 46, ry: 8 }, 'sky', { accent: true }),
    s('rect', { x: 112, y: 30, width: 14, height: 6, rx: 2 }, 'gray')
  ],
  'fechoría': [
    ...person(62, 138, 'black', { accent: true }),
    s('rect', { x: 50, y: 74, width: 24, height: 8, rx: 3 }, 'dark'),
    s('path', { d: 'M48 68q14-16 28 0z' }, 'dark'),
    s('path', { d: 'M100 134q-28-6-18-40q8-14 18-14t18 14q10 34-18 40z' }, 'tan'),
    s('path', { d: 'M90 82l20-6', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M74 104l14-14', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: dots([[100, 110]], 6) }, 'yellow'),
    s('path', { d: ells([[30, 134, 6, 3], [18, 126, 6, 3]]) }, 'gray')
  ],
  feminidad: [
    ...lady(70, 136, 'pink', { accent: true }),
    s('path', { d: 'M58 74q-4-20 12-22q16 2 12 22q-4-12-12-12t-12 12z' }, 'brown'),
    ...flower(118, 66, 'red'),
  ],
  fragmentar: [
    s('path', { d: 'M54 50l24-8-4 34-26 6z' }, 'blue', { accent: true }),
    s('path', { d: 'M86 40l26 10-2 26-30 2z' }, 'blue'),
    s('path', { d: 'M48 92l26-8 4 34-24 4zM86 86l28 4-6 30-24-6z' }, 'navy'),
    s('path', { d: 'M40 40l-14-12M120 40l14-12M40 128l-14 12M120 128l14 12', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M24 26l-2 10 10-2zM136 26l2 10-10-2zM24 142l-2-10 10 2zM136 142l2-10-10 2z' }, 'orange')
  ]
};
