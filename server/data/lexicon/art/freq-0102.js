// Illustration specs for words still undrawn in batches 0100–0102 (see server/scripts/lexicon/art.js)
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
  umbilical: [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'skin'),
    s('path', { d: 'M80 88q-4 20 16 26q22 6 28-12q4-14 10-6', ...SW(8) }, 'pink', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 86, r: 7 }, 'brown'),
    s('rect', { x: 124, y: 88, width: 18, height: 9, rx: 3 }, 'blue'),
    s('path', { d: 'M60 52q20-10 40 0', ...SW(3) }, 'tan', { stroke: true })
  ],
  vanguardista: [
    ground(),
    s('path', { d: busts([28, 52, 76], 136, 20, 32) }, 'gray'),
    ...person(110, 136, 'red', { accent: true }),
    s('path', { d: 'M124 100V28', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M124 28h22l-6 10 6 10h-22z' }, 'orange'),
    arrow('M30 44h44m-10-10 10 10-10 10', 'purple', 5)
  ],
  varilla: [
    s('path', { d: 'M48 54h64l-8 82H56z' }, 'sky'),
    s('path', { d: 'M51 82h58l-5.4 54H56.4z' }, 'orange'),
    s('path', { d: 'M48 54h64l-8 82H56z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 126L120 18', ...SW(5) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: 'M60 104q20 8 40 0', ...SW(3) }, 'white', { stroke: true })
  ],
  veintiocho: [
    s('path', { d: rects(Array.from({ length: 10 }, (_, i) => [20, 16 + i * 13, 24, 10])) }, 'blue', { accent: true }),
    s('path', { d: rects(Array.from({ length: 10 }, (_, i) => [52, 16 + i * 13, 24, 10])) }, 'blue'),
    s('path', { d: dots([[100, 30], [130, 30], [100, 62], [130, 62], [100, 94], [130, 94], [100, 126], [130, 126]], 11) }, 'orange')
  ],
  veintisiete: [
    s('path', { d: rects(Array.from({ length: 10 }, (_, i) => [20, 16 + i * 13, 24, 10])) }, 'green', { accent: true }),
    s('path', { d: rects(Array.from({ length: 10 }, (_, i) => [52, 16 + i * 13, 24, 10])) }, 'green'),
    s('path', { d: dots([[100, 30], [130, 30], [100, 62], [130, 62], [100, 94], [130, 94], [115, 126]], 11) }, 'purple')
  ],
  viveza: [
    s('path', { d: burst(80, 76, 62, 44, 12) }, 'yellow'),
    s('path', { d: 'M70 66l-20-26M90 66l20-26', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M72 98l-12 30M88 98l12 30', ...SW(8) }, 'navy', { stroke: true }),
    s('rect', { x: 66, y: 60, width: 28, height: 42, rx: 9 }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 44, r: 13 }, 'skin'),
    s('path', { d: 'M74 46q6 6 12 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  'álamo': [
    ground(),
    s('path', { d: 'M40 120v16M120 120v16M80 112v24', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: ells([[40, 92, 12, 32], [120, 92, 12, 32]]) }, 'mint'),
    s('ellipse', { cx: 80, cy: 66, rx: 22, ry: 50 }, 'green', { accent: true }),
    s('path', { d: 'M80 30v70M80 50l-10-8M80 70l10-8', ...SW(3) }, 'mint', { stroke: true })
  ],
  abrumar: [
    ground(),
    s('path', { d: rects([[42, 60, 76, 22], [50, 36, 60, 22], [60, 14, 40, 20]]) }, 'tan', { accent: true }),
    s('path', { d: rects([[42, 60, 76, 22], [50, 36, 60, 22], [60, 14, 40, 20]]), ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M68 110l-14-28M92 110l14-28', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 64, y: 102, width: 32, height: 34, rx: 10 }, 'blue'),
    s('circle', { cx: 80, cy: 92, r: 11 }, 'skin'),
    s('path', { d: drop(130, 96, 5) + drop(30, 104, 5) }, 'sky')
  ],
  acallar: [
    s('circle', { cx: 74, cy: 80, r: 50 }, 'skin'),
    s('path', { d: dots([[56, 68], [92, 68]], 5) }, 'dark'),
    s('path', { d: 'M60 104h28', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 68, y: 78, width: 13, height: 44, rx: 6.5 }, 'tan'),
    s('rect', { x: 58, y: 112, width: 34, height: 32, rx: 12 }, 'tan'),
    s('path', { d: 'M132 62q8 16 0 32M144 54q12 24 0 48', ...SW(4) }, 'purple', { stroke: true, accent: true })
  ],
  acentuar: [
    ...paper(28, 22, 104, 116),
    s('path', { d: rects([[40, 38, 80, 8], [40, 56, 80, 8], [40, 104, 80, 8], [40, 122, 56, 8]]) }, 'gray'),
    s('rect', { x: 34, y: 72, width: 92, height: 22, rx: 4 }, 'yellow', { accent: true }),
    s('rect', { x: 40, y: 79, width: 76, height: 8 }, 'dark'),
    s('path', { d: 'M136 64l-8 10M146 83h-12M136 102l-8-10', ...SW(4) }, 'orange', { stroke: true })
  ],
  acondicionamiento: [
    s('rect', { x: 20, y: 28, width: 120, height: 44, rx: 8 }, 'white'),
    outline({ x: 20, y: 28, width: 120, height: 44, rx: 8 }),
    s('path', { d: 'M32 60h96', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 126, cy: 42, r: 4 }, 'green'),
    s('path', { d: 'M44 86q8 10 0 20t0 20M80 86q8 10 0 20t0 20M116 86q8 10 0 20t0 20', ...SW(5) }, 'blue', { stroke: true, accent: true })
  ],
  admisible: [
    ...paper(30, 18, 84, 108),
    s('path', { d: rects([[42, 34, 60, 6], [42, 50, 60, 6], [42, 66, 44, 6]]) }, 'gray'),
    s('circle', { cx: 108, cy: 110, r: 30 }, 'green', { accent: true }),
    s('path', { d: 'M94 110l10 10 18-20', ...SW(7) }, 'white', { stroke: true })
  ],
  'aflicción': [
    s('path', { d: ells([[62, 30, 22, 14], [88, 24, 24, 16], [110, 32, 18, 12]]) }, 'gray'),
    s('path', { d: 'M62 50l-4 10M86 48l-4 10M110 50l-4 10', ...SW(3) }, 'blue', { stroke: true }),
    ...face(80, 104, 38, 'skin', 'frown'),
    s('path', { d: drop(97, 108, 5) }, 'blue', { accent: true })
  ],
  afrenta: [
    s('path', { d: bubble(14, 18, 66, 54) }, 'white'),
    s('path', { d: bubble(14, 18, 66, 54), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 30l16 10-10 6 18 12', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 106, cy: 98, r: 36 }, 'skin'),
    s('path', { d: dots([[94, 88], [118, 88]], 4) }, 'dark'),
    s('circle', { cx: 106, cy: 114, r: 7 }, 'dark'),
    s('ellipse', { cx: 84, cy: 106, rx: 8, ry: 6 }, 'pink')
  ],
  agridulce: [
    s('ellipse', { cx: 50, cy: 84, rx: 34, ry: 26, transform: 'rotate(-20 50 84)' }, 'yellow', { accent: true }),
    s('path', { d: 'M18 98l-4 4M82 70l4-4', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M96 84l-14-12v24zM128 84l14-12v24z' }, 'pink'),
    s('circle', { cx: 112, cy: 84, r: 18 }, 'pink'),
    s('path', { d: 'M104 70l16 28', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M38 74q12-6 22 2', ...SW(3) }, 'cream', { stroke: true })
  ],
  'alavés': [
    backdrop('sky'),
    s('path', { d: 'M14 96q36-26 70-6t62-6v50a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green'),
    s('path', { d: 'M24 112q56-10 112 0M24 126q56-10 112 0', ...DASH(5, '4 8') }, 'dark', { stroke: true }),
    s('path', { d: 'M80 84q-22-24-22-40a22 22 0 0 1 44 0q0 16-22 40z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 44, r: 8 }, 'white'),
    s('path', { d: dots([[120, 104], [127, 110], [120, 116], [113, 110]], 4) }, 'purple')
  ],
  alentador: [
    ...person(46, 136, 'blue'),
    ...person(112, 136, 'green', { h: 36, w: 26 }),
    s('path', { d: 'M60 84l28 0', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: bubble(16, 14, 60, 40) }, 'yellow', { accent: true }),
    s('path', { d: heart(46, 28, 10) }, 'red'),
    s('path', { d: sparkle(130, 50, 8) }, 'orange')
  ],
  'anglosajón': [
    s('path', { d: 'M24 136L136 24', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M130 18l12-4-4 12z' }, 'gray'),
    s('circle', { cx: 74, cy: 86, r: 52 }, 'brown', { accent: true }),
    s('path', { d: 'M74 34v104M22 86h104', ...SW(4) }, 'tan', { stroke: true }),
    s('circle', { cx: 74, cy: 86, r: 52, ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 74, cy: 86, r: 14 }, 'gray')
  ],
  'aniquilación': [
    s('path', { d: burst(80, 74, 62, 32, 14) }, 'orange', { accent: true }),
    s('path', { d: burst(80, 74, 36, 18, 10) }, 'yellow'),
    s('path', { d: 'M20 136l14-16 10 8 12-14 10 22zM96 136l12-18 10 10 10-6 10 14z' }, 'gray'),
    ground()
  ],
  aplazar: [
    s('rect', { x: 20, y: 30, width: 104, height: 100, rx: 8 }, 'white'),
    outline({ x: 20, y: 30, width: 104, height: 100, rx: 8 }),
    s('rect', { x: 20, y: 30, width: 104, height: 22, rx: 6 }, 'red'),
    s('path', { d: grid(30, 62, 4, 3, 14, 12, 24, 22) }, 'gray'),
    s('rect', { x: 30, y: 62, width: 14, height: 12 }, 'orange'),
    arrow('M38 64q46-56 92 14m-14-2 14 2 2-14', 'blue', 5),
    s('rect', { x: 102, y: 106, width: 14, height: 12 }, 'blue', { accent: true })
  ],
  'astronómico': [
    backdrop('navy'),
    s('circle', { cx: 106, cy: 46, r: 16 }, 'orange', { accent: true }),
    s('ellipse', { cx: 106, cy: 46, rx: 28, ry: 7, transform: 'rotate(-20 106 46)', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: sparkle(36, 34, 7) + sparkle(64, 58, 5) + sparkle(130, 88, 6) }, 'white'),
    s('path', { d: 'M60 104l-16 32M60 104l16 32', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 28, y: 86, width: 74, height: 18, rx: 6, transform: 'rotate(-30 65 95)' }, 'sky')
  ],
  auditivo: [
    s('path', { d: 'M62 62q0-40 38-40q38 0 38 42q0 22-18 34q-10 8-10 22q0 18-18 18q-18 0-22-16q-8-28-8-60z' }, 'skin'),
    s('path', { d: 'M82 62q0-20 18-20q18 0 18 20q0 12-10 18q-8 6-8 16', ...SW(6) }, 'tan', { stroke: true }),
    s('path', { d: 'M44 60q-10 20 0 40M28 48q-16 32 0 64', ...SW(5) }, 'blue', { stroke: true, accent: true })
  ],
  austriaco: [
    backdrop('sky'),
    s('path', { d: 'M14 120l36-52 20 24 32-58 44 86z' }, 'gray'),
    s('path', { d: 'M102 34l16 30-8-4-8 6-6-6-8 4z' }, 'white'),
    s('path', { d: 'M14 116h132v18a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green'),
    s('path', { d: star(42, 118, 16, 6) }, 'white'),
    s('circle', { cx: 42, cy: 118, r: 5 }, 'yellow', { accent: true })
  ],
  autenticar: [
    s('path', { d: 'M40 118q-14-34 0-66q36-44 72 0q12 30 0 62M54 116q-10-28 0-54q24-30 48 0q10 26 0 52M68 114q-6-20 0-38q12-14 24 0q4 18 0 36M80 112V82', ...SW(5) }, 'blue', { stroke: true }),
    s('circle', { cx: 116, cy: 114, r: 22 }, 'green', { accent: true }),
    s('path', { d: 'M106 114l7 7 13-14', ...SW(5) }, 'white', { stroke: true })
  ],
  baranda: [
    s('rect', { x: 14, y: 126, width: 132, height: 14, rx: 3 }, 'gray'),
    s('path', { d: 'M30 60v66M50 60v66M70 60v66M90 60v66M110 60v66M130 60v66', ...SW(7) }, 'tan', { stroke: true }),
    s('path', { d: 'M20 120h120', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M18 56h124', ...SW(12) }, 'brown', { stroke: true, accent: true })
  ],
  batuta: [
    ...person(56, 136, 'black'),
    s('path', { d: 'M68 98l22-24', ...SW(8) }, 'black', { stroke: true }),
    s('circle', { cx: 92, cy: 72, r: 6 }, 'skin'),
    s('path', { d: 'M94 70l30-38', ...SW(4) }, 'brown', { stroke: true }),
    ...note(118, 104, 'purple')
  ],
  bazo: [
    s('rect', { x: 34, y: 18, width: 92, height: 124, rx: 30 }, 'skin'),
    s('path', { d: 'M50 48q30 14 60 0M48 64q32 14 64 0M50 80q30 12 60 0', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M96 56q24-8 22 18q-2 22-22 24q10-20 0-42z' }, 'purple', { accent: true }),
    s('path', { d: 'M54 92q18-8 34 4q-4 18-22 16q-14-2-12-20z' }, 'pink')
  ],
  bejarano: [
    backdrop('sky'),
    s('path', { d: 'M14 96l34-44 26 30 30-48 42 62v50H14z' }, 'gray'),
    s('path', { d: 'M104 34l14 20-8-2-6 6-6-6-8 2z' }, 'white'),
    s('path', { d: 'M14 110h132v24a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green'),
    s('path', { d: rects([[30, 100, 26, 30], [66, 94, 28, 36], [104, 102, 26, 28]]) }, 'cream'),
    s('path', { d: 'M26 102l17-14 17 14zM62 96l18-16 18 16zM100 104l17-14 17 14z' }, 'red', { accent: true }),
    s('path', { d: rects([[38, 112, 8, 10], [76, 108, 8, 10], [112, 112, 8, 10]]) }, 'brown')
  ],
  'biográfico': [
    s('rect', { x: 36, y: 18, width: 88, height: 124, rx: 6 }, 'navy', { accent: true }),
    s('path', { d: 'M46 18v124', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 58, y: 34, width: 52, height: 60, rx: 4 }, 'cream'),
    s('circle', { cx: 84, cy: 56, r: 11 }, 'skin'),
    s('path', { d: busts([84], 94, 32, 24) }, 'red'),
    s('path', { d: rects([[58, 106, 52, 6], [64, 118, 40, 6]]) }, 'yellow')
  ],
  'bálsamo': [
    s('rect', { x: 40, y: 72, width: 80, height: 62, rx: 14 }, 'mint'),
    s('rect', { x: 36, y: 54, width: 88, height: 24, rx: 8 }, 'green', { accent: true }),
    s('rect', { x: 54, y: 88, width: 52, height: 32, rx: 5 }, 'white'),
    s('path', { d: leaflet(66, 112, -40, 34, 9) }, 'green'),
    s('path', { d: sparkle(128, 36, 9) + sparkle(36, 34, 6) }, 'yellow')
  ],
  'camarógrafo': [
    ground(),
    ...person(58, 136, 'gray'),
    s('rect', { x: 52, y: 60, width: 66, height: 32, rx: 6 }, 'dark', { accent: true }),
    s('path', { d: 'M118 64l22-8v40l-22-8z' }, 'black'),
    s('rect', { x: 66, y: 50, width: 30, height: 10, rx: 3 }, 'dark'),
    s('circle', { cx: 66, cy: 76, r: 5 }, 'red')
  ],
  capote: [
    ground(),
    ...person(42, 136, 'navy'),
    s('path', { d: 'M54 72q46-16 86 14q-6 34-26 50H60z' }, 'pink', { accent: true }),
    s('path', { d: 'M60 136h54q20-16 26-50', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M54 72l-12 16', ...SW(6) }, 'skin', { stroke: true })
  ],
  caradura: [
    s('rect', { x: 28, y: 26, width: 104, height: 108, rx: 22 }, 'gray', { accent: true }),
    s('path', { d: 'M42 38l10 14-6 8M120 112l-12 10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M50 76h18M92 76h18', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M90 58q10-10 22-2', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 104q26 10 44-10', ...SW(5) }, 'dark', { stroke: true })
  ],
  carbonato: [
    s('path', { d: 'M80 82V30M80 82l-44 28M80 82l44 28', ...SW(8) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 82, r: 22 }, 'black'),
    s('circle', { cx: 80, cy: 32, r: 18 }, 'red', { accent: true }),
    s('path', { d: dots([[36, 110], [124, 110]], 18) }, 'red'),
    s('path', { d: 'M74 76a8 8 0 0 1 8-4', ...SW(3) }, 'gray', { stroke: true })
  ],
  carey: [
    backdrop('sky'),
    s('path', { d: ells([[46, 62, 20, 8], [114, 62, 20, 8], [54, 112, 14, 7], [106, 112, 14, 7]]) }, 'tan'),
    s('circle', { cx: 80, cy: 36, r: 12 }, 'tan'),
    s('ellipse', { cx: 80, cy: 86, rx: 34, ry: 40 }, 'brown', { accent: true }),
    s('path', { d: dots([[80, 70], [66, 92], [94, 92], [80, 110]], 8) + dots([[62, 70], [98, 70]], 5) }, 'orange'),
    s('path', { d: dots([[76, 32], [84, 32]], 2) }, 'dark')
  ],
  carmelita: [
    s('path', { d: 'M58 70h44l16 68H42z' }, 'brown', { accent: true }),
    s('path', { d: 'M58 72q-12 30-18 66h22l6-62zM102 72q12 30 18 66H98l-6-62z' }, 'white'),
    s('path', { d: 'M58 72q-12 30-18 66h22l6-62zM102 72q12 30 18 66H98l-6-62z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 62q0-36 22-36t22 36z' }, 'brown'),
    s('circle', { cx: 80, cy: 50, r: 13 }, 'skin'),
    s('path', { d: 'M72 96h16', ...SW(5) }, 'skin', { stroke: true })
  ],
  ceiba: [
    ground(),
    s('path', { d: 'M48 136q20-6 24-30V60h16v46q4 24 24 30z' }, 'brown'),
    s('path', { d: 'M80 70L48 46M80 70l32-24', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: ells([[80, 38, 62, 18], [44, 34, 28, 14], [116, 34, 28, 14], [80, 24, 30, 12]]) }, 'green', { accent: true })
  ],
  celulitis: [
    s('path', { d: 'M46 14h68q6 60-12 100l-4 32H64l-4-32q-18-40-14-100z' }, 'skin'),
    s('path', { d: dots([[60, 34], [72, 46], [64, 60], [80, 30], [94, 42], [86, 58], [100, 64], [70, 76], [90, 80]], 3) }, 'tan'),
    s('circle', { cx: 98, cy: 58, r: 24 }, 'white', { flatOnly: true }),
    s('circle', { cx: 98, cy: 58, r: 24, ...SW(6) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: dots([[92, 52], [104, 50], [98, 64], [88, 66], [108, 66]], 4) }, 'orange'),
    s('path', { d: 'M116 76l20 20', ...SW(9) }, 'navy', { stroke: true })
  ],
  'champán': [
    s('path', { d: 'M46 136h30V86q0-12-7-20V46H53v20q-7 8-7 20z', transform: 'rotate(-18 61 136)' }, 'green', { accent: true }),
    s('rect', { x: 52, y: 44, width: 18, height: 14, transform: 'rotate(-18 61 136)' }, 'yellow'),
    s('ellipse', { cx: 104, cy: 22, rx: 7, ry: 9, transform: 'rotate(30 104 22)' }, 'tan'),
    s('path', { d: dots([[82, 34], [92, 46], [74, 24]], 4) }, 'yellow'),
    s('path', { d: 'M108 66h28l-4 30q-10 8-20 0z' }, 'yellow'),
    s('path', { d: 'M108 66h28l-4 30q-10 8-20 0zM122 100v30M110 132h24', ...SW(3) }, 'gray', { stroke: true })
  ],
  cochino: [
    s('path', { d: 'M52 110v24M66 112v24M92 112v24M106 110v24', ...SW(10) }, 'pink', { stroke: true }),
    s('ellipse', { cx: 78, cy: 86, rx: 46, ry: 32 }, 'pink', { accent: true }),
    s('circle', { cx: 116, cy: 74, r: 22 }, 'pink'),
    s('path', { d: 'M108 54l6-16 10 14z' }, 'pink'),
    s('ellipse', { cx: 136, cy: 80, rx: 8, ry: 10 }, 'red'),
    s('path', { d: dots([[134, 76], [138, 84], [118, 68]], 2.5) }, 'dark'),
    s('path', { d: 'M32 80q-12-4-8-12q6-4 4 4', ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: dots([[60, 96], [80, 104], [50, 80]], 6) }, 'brown')
  ],
  colorante: [
    s('path', { d: 'M46 80h68l-6 56H52z' }, 'sky'),
    s('path', { d: 'M47.7 96h64.6l-4.3 40H52z' }, 'pink'),
    s('path', { d: 'M46 80h68l-6 56H52z', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 76, y: 30, width: 8, height: 30, rx: 3 }, 'gray'),
    s('ellipse', { cx: 80, cy: 24, rx: 11, ry: 12 }, 'red', { accent: true }),
    s('path', { d: drop(80, 72, 5) }, 'red')
  ],
  comparativamente: [
    s('path', { d: 'M56 136l24-12 24 12z' }, 'dark'),
    s('path', { d: 'M80 58v68', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M32 50L128 66', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M32 50l-14 38M32 50l14 38M128 66l-14 38M128 66l14 38', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 88h36q-2 12-18 12t-18-12zM110 104h36q-2 12-18 12t-18-12z' }, 'gray'),
    s('circle', { cx: 32, cy: 80, r: 8 }, 'orange'),
    s('circle', { cx: 128, cy: 88, r: 16 }, 'orange', { accent: true })
  ],
  competer: [
    ...paper(16, 40, 44, 56),
    s('path', { d: 'M24 54h28M24 66h28M24 78h20', ...SW(3) }, 'gray', { stroke: true }),
    arrow('M66 68h26m-10-10 10 10-10 10', 'orange'),
    ...person(118, 136, 'blue', { accent: true }),
    s('path', { d: star(118, 110, 9) }, 'yellow')
  ],
};
