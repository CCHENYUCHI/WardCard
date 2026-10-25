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
    s('circle', { cx: 80, cy: 26, r: 14 }, 'skin'),
    s('path', { d: 'M30 140V66q0-22 22-22h56q22 0 22 22v74z' }, 'skin'),
    s('path', { d: 'M52 62q28 12 56 0M50 78q30 12 60 0', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M96 82q24-8 22 18q-2 22-22 24q10-20 0-42z' }, 'purple', { accent: true }),
    s('path', { d: 'M48 96q22-10 40 4q-4 20-24 18q-18-2-16-22z' }, 'pink')
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
  condimento: [
    s('path', { d: 'M28 136V72q0-22 22-22t22 22v64z' }, 'white'),
    s('path', { d: 'M28 136V72q0-22 22-22t22 22v64z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[42, 62], [50, 58], [58, 62]], 3) }, 'gray'),
    s('path', { d: 'M88 136V72q0-22 22-22t22 22v64z' }, 'dark', { accent: true }),
    s('path', { d: dots([[102, 62], [110, 58], [118, 62]], 3) }, 'white'),
    s('path', { d: dots([[40, 30], [50, 22], [104, 26], [118, 18], [60, 34]], 2.5) }, 'gray')
  ],
  confiabilidad: [
    s('path', { d: 'M80 16l48 16v40q0 44-48 68q-48-24-48-68V32z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 28l36 12v32q0 34-36 54z' }, 'navy'),
    s('path', { d: 'M58 76l16 16 30-32', ...SW(9) }, 'white', { stroke: true })
  ],
  corneta: [
    s('path', { d: 'M40 96q-12-40 26-40h34q16 0 16 18v22', ...SW(8) }, 'yellow', { stroke: true }),
    s('path', { d: 'M26 96h70', ...SW(8) }, 'yellow', { stroke: true }),
    s('path', { d: 'M92 88q26-2 46-24v64q-20-22-46-24z' }, 'yellow', { accent: true }),
    s('rect', { x: 16, y: 90, width: 14, height: 12, rx: 3 }, 'orange'),
    s('path', { d: 'M56 102q10 22 30 8', ...SW(4) }, 'red', { stroke: true })
  ],
  creta: [
    backdrop('sky'),
    s('path', { d: 'M14 112h132v22a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'blue', { accent: true }),
    s('path', { d: 'M14 52h84l8 20-8 18 14 24H14z' }, 'white'),
    s('path', { d: 'M98 52l8 20-8 18 14 24M40 60l-4 20M70 64l6 24', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 44h86l-2 10H14z' }, 'green'),
    s('path', { d: birds([[120, 34], [134, 48]]), ...SW(3) }, 'dark', { stroke: true })
  ],
  descubridor: [
    s('path', { d: 'M14 112h132v34H14z' }, 'blue'),
    s('path', { d: 'M18 106h66l-10 20H28z' }, 'brown'),
    ...person(48, 106, 'red', { h: 36, w: 26, r: 11 }),
    s('path', { d: 'M56 58l28-10', ...SW(7) }, 'dark', { stroke: true, accent: true }),
    s('ellipse', { cx: 122, cy: 112, rx: 22, ry: 8 }, 'tan'),
    s('path', { d: 'M122 108q-2-22 6-34', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(128, 74, 200, 20, 6) + leaflet(128, 74, -20, 20, 6) + leaflet(128, 74, 100, 16, 5) }, 'green')
  ],
  despecho: [
    ...person(80, 136, 'purple', { accent: true }),
    s('path', { d: 'M66 100h28M68 108h24', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M70 72l8 3M90 72l-8 3M74 86q6-4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 40q8-14 18 0t18 0t18 0t18 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[50, 30, 12, 8], [76, 24, 16, 10], [102, 30, 12, 8]]) }, 'gray')
  ],
  destituir: [
    ground(),
    s('rect', { x: 16, y: 88, width: 54, height: 8, rx: 2 }, 'brown'),
    s('path', { d: 'M22 96v40M64 96v40', ...SW(5) }, 'brown', { stroke: true }),
    ...person(110, 136, 'gray'),
    s('rect', { x: 92, y: 92, width: 36, height: 24, rx: 3 }, 'tan', { accent: true }),
    s('path', { d: leaflet(104, 92, -70, 18, 5) + leaflet(104, 92, -120, 14, 4) }, 'green')
  ],
  'discográfico': [
    s('circle', { cx: 72, cy: 84, r: 54 }, 'black', { accent: true }),
    s('path', { d: ring(72, 84, 44) + ring(72, 84, 34), ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 72, cy: 84, r: 18 }, 'red'),
    s('circle', { cx: 72, cy: 84, r: 3 }, 'white'),
    ...note(118, 46, 'purple')
  ],
  dolencia: [
    ...person(76, 136, 'green'),
    s('path', { d: 'M62 106q10 8 24 2', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: burst(100, 106, 16, 7, 8) }, 'red', { accent: true }),
    s('path', { d: 'M70 84q6-4 12 0M70 74h4M80 74h4', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 70, y: 60, width: 24, height: 8, rx: 3, transform: 'rotate(-30 82 64)' }, 'tan')
  ],
  elijar: [
    s('path', { d: 'M60 50q-8-10 0-20t0-20M80 50q-8-10 0-20t0-20M100 50q-8-10 0-20t0-20', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: 'M34 58h92v36q0 20-20 20H54q-20 0-20-20z' }, 'gray'),
    s('path', { d: 'M34 62h-10M126 62h10', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: leaflet(60, 60, -30, 22, 6) + leaflet(96, 60, -150, 22, 6) }, 'green'),
    s('path', { d: 'M50 140q-6-12 6-22q2 10 8 10q2-8 8-14q8 12 4 26zM84 140q-6-12 6-22q2 10 8 10q2-8 8-14q8 12 4 26z' }, 'orange', { accent: true })
  ],
  emisario: [
    ...lean(66, 136, 15, 'navy'),
    s('rect', { x: 92, y: 72, width: 44, height: 30, rx: 3 }, 'white'),
    s('path', { d: 'M92 72h44v30H92zM92 72l22 16 22-16', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 114, cy: 90, r: 6 }, 'red', { accent: true }),
    s('path', { d: 'M78 88l14-4', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M18 70h20M14 88h20M20 106h18', ...SW(4) }, 'gray', { stroke: true })
  ],
  enredo: [
    s('path', { d: 'M34 84q16-56 60-34t-24 58t54-18q16-40-30-48q-50-6-34 48t70 22q26-36-12-60', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M40 60q40 70 70 20t-56-30q-30 30 10 60t60-10', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M114 116q12 12 24 22M30 92q-10 20-14 40', ...SW(5) }, 'red', { stroke: true })
  ],
  entrepierna: [
    s('path', { d: 'M42 22h76l10 116H92L80 58l-12 80H32z' }, 'navy'),
    s('rect', { x: 42, y: 22, width: 76, height: 10 }, 'dark'),
    s('path', { d: 'M81 60l12 76', ...SW(8) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M81 60l12 76', ...SW(8, { 'stroke-linecap': 'butt', 'stroke-dasharray': '2 8' }) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 46, r: 4 }, 'yellow')
  ],
  eritreo: [
    s('ellipse', { cx: 70, cy: 134, rx: 44, ry: 8 }, 'yellow', { accent: true }),
    s('circle', { cx: 70, cy: 100, r: 30 }, 'black'),
    s('path', { d: 'M62 74l4-46h8l4 46z' }, 'black'),
    s('path', { d: 'M48 86L26 64', ...SW(8) }, 'black', { stroke: true }),
    s('path', { d: 'M94 84q22-6 16-32q-6-14-34-16', ...SW(6) }, 'black', { stroke: true }),
    s('path', { d: 'M112 112h14l-2 14h-10zM130 112h14l-2 14h-10z' }, 'white'),
    s('path', { d: 'M112 112h14l-2 14h-10zM130 112h14l-2 14h-10z', ...SW(2) }, 'gray', { stroke: true })
  ],
  estamento: [
    s('path', { d: 'M80 18l20 30H60z' }, 'purple', { accent: true }),
    s('path', { d: 'M58 52h44l20 36H38z' }, 'blue'),
    s('path', { d: 'M36 92h88l22 44H14z' }, 'brown'),
    s('path', { d: dots([[80, 38], [64, 74], [80, 74], [96, 74], [44, 118], [64, 118], [84, 118], [104, 118], [124, 118]], 5) }, 'cream')
  ],
  estilista: [
    s('rect', { x: 98, y: 22, width: 18, height: 112, rx: 4 }, 'dark'),
    s('path', { d: 'M100 28v100', ...SW(8, { 'stroke-linecap': 'butt', 'stroke-dasharray': '3 5' }) }, 'white', { stroke: true }),
    s('path', { d: 'M64 112L38 22M40 112L66 22', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: ring(36, 124, 11) + ring(68, 124, 11), ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 52, cy: 67, r: 4 }, 'dark'),
    s('path', { d: 'M126 46q16 10 10 30q-6 16 6 30', ...SW(5) }, 'brown', { stroke: true })
  ],
  felino: [
    s('path', { d: 'M34 66l4-44 32 22zM126 66l-4-44-32 22z' }, 'orange'),
    s('circle', { cx: 80, cy: 86, r: 50 }, 'orange', { accent: true }),
    s('path', { d: 'M80 36v16M66 40l4 12M94 40l-4 12M30 86h16M114 86h16M32 102h14M114 102h14', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: ells([[70, 110, 14, 10], [90, 110, 14, 10]]) }, 'cream'),
    s('path', { d: 'M74 98h12l-6 7z' }, 'pink'),
    s('path', { d: ells([[62, 80, 8, 9], [98, 80, 8, 9]]) }, 'green'),
    s('path', { d: 'M62 74v12M98 74v12', ...SW(3) }, 'dark', { stroke: true })
  ],
  flagelo: [
    s('path', { d: 'M24 136l32-36', ...SW(11) }, 'brown', { stroke: true }),
    s('path', { d: 'M56 100q44-40 10-62q-20-14 30-20q32-4 44 18', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M136 46l8-8M140 56l6 2M130 52l2 10', ...SW(3) }, 'orange', { stroke: true, accent: true })
  ],
  futsal: [
    s('path', { d: 'M14 30L80 14l66 16', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 14, y: 110, width: 132, height: 36, rx: 4 }, 'blue'),
    s('path', { d: 'M14 126h132', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M46 54v56M60 54v56M74 54v56M88 54v56M34 70h64M34 88h64', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 110V50h64v60', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 120, cy: 112, r: 14 }, 'white'),
    outline({ cx: 120, cy: 112, r: 14 }, 'dark', 2),
    s('path', { d: 'M120 106l6 4-2 7h-8l-2-7z' }, 'dark')
  ],
  hereje: [
    ground(),
    s('path', { d: busts([28, 56, 104, 132], 136, 22, 30) }, 'gray'),
    s('path', { d: dots([[28, 94], [56, 94], [104, 94], [132, 94]], 9) }, 'skin'),
    ...person(80, 136, 'red', { accent: true }),
    s('path', { d: 'M18 54h36m-8-8 8 8-8 8M106 54h36m-8-8 8 8-8 8', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M98 32H62m8-8-8 8 8 8', ...SW(5) }, 'red', { stroke: true })
  ],
  'hostelería': [
    s('rect', { x: 28, y: 18, width: 104, height: 118, rx: 4 }, 'cream'),
    s('rect', { x: 28, y: 18, width: 104, height: 118, rx: 4, ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: grid(40, 30, 4, 2, 14, 16, 22, 26) }, 'sky'),
    s('path', { d: 'M22 86h116l-8 18H30z' }, 'red', { accent: true }),
    s('path', { d: 'M52 86l-4 18M80 86v18M108 86l4 18', ...SW(6) }, 'white', { stroke: true }),
    s('rect', { x: 68, y: 110, width: 24, height: 26 }, 'brown'),
    ground()
  ],
  'hélice': [
    s('ellipse', { cx: 80, cy: 46, rx: 14, ry: 32 }, 'blue', { accent: true }),
    s('ellipse', { cx: 80, cy: 46, rx: 14, ry: 32, transform: 'rotate(120 80 80)' }, 'blue'),
    s('ellipse', { cx: 80, cy: 46, rx: 14, ry: 32, transform: 'rotate(240 80 80)' }, 'blue'),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'dark'),
    s('path', { d: 'M24 52q-10 40 14 70M136 108q10-40-14-70', ...DASH(3) }, 'gray', { stroke: true })
  ],
  incorrectamente: [
    s('rect', { x: 18, y: 98, width: 108, height: 38, rx: 6 }, 'tan'),
    s('ellipse', { cx: 72, cy: 110, rx: 22, ry: 8 }, 'dark'),
    s('rect', { x: 50, y: 40, width: 44, height: 44, rx: 4, transform: 'rotate(12 72 62)' }, 'blue', { accent: true }),
    s('circle', { cx: 126, cy: 40, r: 16, ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M115 29l22 22', ...SW(6) }, 'red', { stroke: true })
  ],
  'incubación': [
    s('path', { d: ells([[48, 108, 11, 14], [112, 110, 11, 14]]) }, 'cream'),
    s('path', { d: ells([[48, 108, 11, 14], [112, 110, 11, 14]]), ...SW(2) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 76, cy: 88, rx: 42, ry: 26 }, 'tan'),
    s('circle', { cx: 112, cy: 58, r: 14 }, 'tan'),
    s('path', { d: 'M104 46l4-10 4 8 4-8 2 10z' }, 'red', { accent: true }),
    s('path', { d: 'M126 56l10 4-10 4z' }, 'yellow'),
    s('path', { d: 'M22 110q58 36 116 0l-6 20q-52 18-104 0z' }, 'brown'),
    s('circle', { cx: 116, cy: 56, r: 2.5 }, 'dark')
  ],
  'incógnito': [
    s('path', { d: 'M44 138l10-62h52l10 62z' }, 'tan', { accent: true }),
    s('path', { d: 'M54 76l26 20 26-20-6-10H60z' }, 'brown'),
    s('circle', { cx: 80, cy: 60, r: 18 }, 'skin'),
    s('path', { d: 'M48 46h64v-6H98V20H62v20H48z' }, 'dark'),
    s('path', { d: ells([[71, 62, 8, 6], [89, 62, 8, 6]]) }, 'black'),
    s('path', { d: 'M74 76h12', ...SW(3) }, 'dark', { stroke: true })
  ],
  independentismo: [
    s('rect', { x: 14, y: 74, width: 44, height: 24, rx: 12, ...SW(8) }, 'gray', { stroke: true }),
    s('rect', { x: 102, y: 74, width: 44, height: 24, rx: 12, ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 70q14-16 18 0M102 102q-14 16-18 0', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: burst(80, 86, 18, 8, 8) }, 'yellow', { accent: true }),
    s('path', { d: birds([[60, 40], [86, 28], [110, 42]]), ...SW(4) }, 'blue', { stroke: true })
  ],
  indescriptible: [
    s('circle', { cx: 58, cy: 100, r: 36 }, 'skin'),
    s('path', { d: dots([[46, 92], [70, 92]], 4.5) }, 'dark'),
    s('ellipse', { cx: 58, cy: 116, rx: 8, ry: 10 }, 'dark'),
    s('path', { d: bubble(78, 14, 68, 54) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(98, 36, 10) + sparkle(124, 36, 10) }, 'white'),
    s('path', { d: 'M38 70l-6-8M58 64v-10M78 70l6-8', ...SW(3) }, 'orange', { stroke: true })
  ],
  inmensidad: [
    backdrop('navy'),
    s('path', { d: sparkle(30, 32, 6) + sparkle(64, 24, 4) + sparkle(100, 40, 7) + sparkle(130, 26, 4) + sparkle(46, 62, 4) + sparkle(120, 66, 5) }, 'white'),
    s('path', { d: 'M14 100h132v34a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'blue'),
    s('path', { d: 'M26 116h20M70 126h30M110 112h22', ...SW(2) }, 'sky', { stroke: true }),
    s('path', { d: 'M74 102h12v-4H74z' }, 'tan'),
    ...person(80, 100, 'orange', { h: 10, w: 6, r: 3, accent: true })
  ],
  innato: [
    s('ellipse', { cx: 80, cy: 118, rx: 32, ry: 24 }, 'sky'),
    s('circle', { cx: 80, cy: 70, r: 28 }, 'skin'),
    s('path', { d: 'M80 42q-8-8 0-12', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: dots([[70, 68], [90, 68]], 3) }, 'dark'),
    s('path', { d: 'M74 82q6 5 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: star(80, 118, 13) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(130, 40, 9) + sparkle(30, 46, 7) }, 'yellow')
  ],
  inservible: [
    s('path', { d: 'M40 70h80l-8 66H48z' }, 'gray'),
    s('path', { d: 'M62 80v46M80 80v46M98 80v46', ...SW(3) }, 'white', { stroke: true }),
    s('rect', { x: 34, y: 58, width: 92, height: 10, rx: 4, transform: 'rotate(-12 34 68)' }, 'dark'),
    s('path', { d: 'M80 70V28', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 34q12-22 32-18l-8 10 14-2q14 8 18 20l-16-6-8 10-10-12z' }, 'red', { accent: true })
  ],
  intencionadamente: [
    ...person(36, 136, 'blue'),
    s('path', { d: 'M48 96l18-16', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M70 76q22-14 46-6', ...DASH(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 118, cy: 72, r: 26 }, 'red', { accent: true }),
    s('circle', { cx: 118, cy: 72, r: 17 }, 'white'),
    s('circle', { cx: 118, cy: 72, r: 8 }, 'red'),
    s('path', { d: 'M118 72l-14-6', ...SW(4) }, 'dark', { stroke: true })
  ],
  intrigante: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'purple', { accent: true }),
    s('circle', { cx: 80, cy: 72, r: 22 }, 'skin'),
    s('path', { d: 'M14 14h60v132H14zM86 14h60v132H86z' }, 'purple'),
    s('path', { d: 'M30 20v120M52 20v120M108 20v120M130 20v120', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: dots([[76, 70], [90, 70]], 3) }, 'dark'),
    s('path', { d: 'M72 62l8 2M86 64l8-4', ...SW(3) }, 'dark', { stroke: true })
  ],
  'invocación': [
    s('path', { d: 'M62 20h36l34 116H28z' }, 'cream'),
    s('circle', { cx: 80, cy: 28, r: 14 }, 'yellow', { accent: true }),
    s('path', { d: halfRays(80, 28, 18, 26, 7), ...SW(3) }, 'orange', { stroke: true }),
    ...person(80, 136, 'blue'),
    s('path', { d: 'M68 98l-14-32M92 98l14-32', ...SW(6) }, 'skin', { stroke: true })
  ],
  'isleño': [
    backdrop('sky'),
    s('path', { d: 'M14 108h132v26a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'blue'),
    s('ellipse', { cx: 80, cy: 110, rx: 56, ry: 14 }, 'tan'),
    s('path', { d: 'M104 106q-4-30 6-52', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(110, 54, 200, 24, 7) + leaflet(110, 54, -20, 24, 7) + leaflet(110, 54, 250, 18, 5) + leaflet(110, 54, 60, 18, 5) }, 'green'),
    ...person(60, 106, 'orange', { h: 30, w: 20, r: 9, accent: true })
  ],
  jaca: [
    ground(),
    ...scaled(horse('tan', 'brown', { accent: true }), 0.8, 16, 28),
    s('rect', { x: 58, y: 84, width: 24, height: 10, rx: 3 }, 'red')
  ],
  jornal: [
    s('circle', { cx: 44, cy: 44, r: 18 }, 'yellow'),
    s('path', { d: rays(44, 44, 24, 32, 8), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: ells([[100, 126, 30, 9], [100, 112, 30, 9], [100, 98, 30, 9]]) }, 'orange'),
    s('ellipse', { cx: 100, cy: 84, rx: 30, ry: 9 }, 'yellow', { accent: true }),
    s('path', { d: 'M70 98v28M130 98v28', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: dots([[100, 84]], 4) }, 'orange')
  ],
  'latón': [
    s('path', { d: 'M22 120l10-26h52l10 26zM66 120l10-26h52l10 26z' }, 'orange', { accent: true }),
    s('path', { d: 'M44 92l10-26h52l10 26z' }, 'yellow'),
    s('path', { d: 'M38 100h40M82 100h40M60 72h40', ...SW(3) }, 'cream', { stroke: true }),
    s('path', { d: sparkle(124, 46, 10) + sparkle(30, 56, 6) }, 'yellow')
  ],
  licuadora: [
    s('path', { d: 'M46 36h68l-8 72H54z' }, 'sky'),
    s('path', { d: 'M49.7 72h60.6l-4.3 36H54z' }, 'pink', { accent: true }),
    s('path', { d: 'M46 36h68l-8 72H54z', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 42, y: 26, width: 76, height: 12, rx: 4 }, 'dark'),
    s('path', { d: 'M66 100h28', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 48, y: 108, width: 64, height: 30, rx: 6 }, 'dark'),
    s('circle', { cx: 80, cy: 123, r: 6 }, 'red')
  ],
  lindar: [
    s('path', { d: 'M14 30l64-12 8 124H14z' }, 'green'),
    s('path', { d: 'M78 18l68 12v112H86z' }, 'yellow', { accent: true }),
    s('path', { d: 'M78 18l8 124', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: rects([[76, 40, 8, 14], [78, 76, 8, 14], [81, 112, 8, 14]]) }, 'brown'),
    s('path', { d: 'M30 60h20M28 90h30M110 60h20M112 96h20', ...SW(3) }, 'mint', { stroke: true })
  ],
  litera: [
    s('path', { d: 'M28 20v118M132 20v118', ...SW(8) }, 'brown', { stroke: true }),
    s('rect', { x: 28, y: 56, width: 104, height: 14, rx: 3 }, 'blue', { accent: true }),
    s('rect', { x: 28, y: 112, width: 104, height: 14, rx: 3 }, 'blue'),
    s('path', { d: 'M34 50h26v-8H34zM34 106h26v-8H34z' }, 'white'),
    s('path', { d: 'M34 50h26v-8H34zM34 106h26v-8H34z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 70h104M28 126h104M112 70v42M124 70v42M112 84h12M112 98h12', ...SW(4) }, 'tan', { stroke: true })
  ],
  lombardo: [
    s('circle', { cx: 80, cy: 56, r: 30 }, 'skin'),
    s('path', { d: 'M50 58q2 30 10 50q8 30 20 36q12-6 20-36q8-20 10-50q-6 20-30 22q-24-2-30-22z' }, 'brown', { accent: true }),
    s('path', { d: 'M50 50q0-34 30-34t30 34q-30-14-60 0z' }, 'gray'),
    s('path', { d: dots([[70, 54], [90, 54]], 3.5) }, 'dark'),
    s('path', { d: 'M70 72q10-4 20 0', ...SW(4) }, 'tan', { stroke: true })
  ],
  manganeso: [
    s('path', { d: 'M22 120l14-40 32-14 26 22-6 34-40 10z' }, 'gray'),
    s('path', { d: 'M36 80l22 14 10-28M58 94l-10 34M58 94l30 24', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M104 132l-6-46 14-24 14 24-6 46z' }, 'pink', { accent: true }),
    s('path', { d: 'M126 132l-6-30 10-16 10 16-4 30z' }, 'pink'),
    s('path', { d: 'M112 62v70', ...SW(2) }, 'white', { stroke: true })
  ],
  mariquita: [
    s('path', { d: 'M80 36v-8M66 30l-8-10M94 30l8-10', ...SW(3) }, 'black', { stroke: true }),
    s('circle', { cx: 80, cy: 46, r: 16 }, 'black'),
    s('path', { d: 'M80 52a40 44 0 1 0 0.1 0z' }, 'red', { accent: true }),
    s('path', { d: 'M80 54v80', ...SW(4) }, 'black', { stroke: true }),
    s('path', { d: dots([[60, 76], [100, 76], [56, 106], [104, 106], [70, 124], [90, 124]], 8) }, 'black')
  ],
  matorral: [
    s('path', { d: 'M14 112q66-20 132 0v34H14z' }, 'tan'),
    s('path', { d: ells([[40, 104, 26, 18], [110, 100, 28, 20], [76, 116, 22, 14]]) }, 'green', { accent: true }),
    s('path', { d: ells([[30, 92, 14, 12], [62, 96, 14, 10], [98, 86, 16, 12], [128, 94, 12, 10]]) }, 'mint'),
    s('path', { d: dots([[40, 98], [114, 94], [80, 112]], 3) }, 'brown')
  ],
  'melancólico': [
    s('rect', { x: 26, y: 18, width: 108, height: 84, rx: 6 }, 'gray'),
    s('rect', { x: 34, y: 26, width: 92, height: 68 }, 'sky'),
    s('path', { d: 'M50 34l-4 12M70 42l-4 12M96 30l-4 12M114 48l-4 12M56 66l-4 12M108 70l-4 12', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M80 26v68', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: busts([80], 146, 56, 44) }, 'navy', { accent: true }),
    s('circle', { cx: 80, cy: 98, r: 18 }, 'brown')
  ],
  meritar: [
    s('path', { d: 'M18 136V112h36V88h36V64h36v72z' }, 'tan'),
    ...person(108, 64, 'blue', { h: 30, w: 22, r: 9 }),
    s('path', { d: star(60, 36, 16) }, 'yellow', { accent: true }),
    s('path', { d: 'M60 58v14M48 64l-8 8M72 64l8 8', ...SW(3) }, 'orange', { stroke: true })
  ],
  'metástasis': [
    s('circle', { cx: 80, cy: 80, r: 24 }, 'purple', { accent: true }),
    s('path', { d: dots([[72, 74], [88, 84]], 5) }, 'navy'),
    s('path', { d: 'M100 66l20-16M58 96l-20 18M104 96l18 18M58 64l-18-16', ...DASH(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[130, 40], [28, 124], [130, 122], [30, 38]], 9) }, 'purple'),
    s('path', { d: dots([[142, 60], [16, 100]], 5) }, 'pink')
  ],
  multilateral: [
    s('circle', { cx: 80, cy: 80, r: 34 }, 'brown', { accent: true }),
    s('path', { d: dots(around(80, 80, 52, 6, -90), 13) }, 'skin'),
    s('path', { d: dots(around(80, 80, 52, 6, -90).filter((_, i) => i % 2 === 0), 13) }, 'blue'),
    s('path', { d: dots(around(80, 80, 52, 6, -90).filter((_, i) => i % 2 === 1), 13) }, 'orange'),
    s('path', { d: rects([[74, 52, 12, 8], [74, 100, 12, 8], [52, 76, 8, 8], [100, 76, 8, 8]]) }, 'white')
  ],
  observancia: [
    ground(),
    s('rect', { x: 92, y: 20, width: 34, height: 78, rx: 8 }, 'dark'),
    s('path', { d: 'M109 98v38', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 109, cy: 38, r: 10 }, 'red', { accent: true }),
    s('path', { d: dots([[109, 60], [109, 82]], 10) }, 'gray'),
    ...person(48, 136, 'green')
  ],
  opaco: [
    s('rect', { x: 14, y: 60, width: 34, height: 24, rx: 4 }, 'dark'),
    s('path', { d: 'M48 60l44-24v72L48 84z' }, 'yellow', { accent: true }),
    s('rect', { x: 92, y: 26, width: 18, height: 92, rx: 3 }, 'brown'),
    s('path', { d: 'M110 40h36v64h-36z' }, 'gray'),
    ground(132)
  ],
  pacientemente: [
    ground(),
    ...person(48, 136, 'green'),
    s('path', { d: 'M42 82q6 4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 44h40M96 132h40', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 46h32q0 26-16 42q16 16 16 42h-32q0-26 16-42q-16-16-16-42z' }, 'sky'),
    s('path', { d: 'M106 66h20l-10 16zM116 108l12 22h-24z' }, 'yellow', { accent: true }),
    s('path', { d: 'M100 46h32q0 26-16 42q16 16 16 42h-32q0-26 16-42q-16-16-16-42z', ...SW(3) }, 'gray', { stroke: true })
  ],
  pandillero: [
    s('path', { d: rects([[14, 20, 132, 116]]) }, 'tan'),
    s('path', { d: 'M14 46h132M14 72h132M14 98h132M40 20v26M90 46v26M50 72v26M110 98v38', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M24 40q14-16 28 0t28 0M100 112q12-20 30-6', ...SW(5) }, 'pink', { stroke: true }),
    s('path', { d: 'M52 136v-40q0-28 28-28t28 28v40z' }, 'dark', { accent: true }),
    s('path', { d: 'M58 66q0-32 22-32t22 32z' }, 'dark'),
    s('circle', { cx: 80, cy: 62, r: 13 }, 'skin'),
    s('path', { d: 'M66 104h28', ...SW(6) }, 'red', { stroke: true })
  ],
  'paradójico': [
    s('rect', { x: 40, y: 66, width: 72, height: 66, rx: 8 }, 'sky'),
    s('path', { d: 'M40 66l16-14h72l-16 14zM112 66l16-14v66l-16 14z' }, 'mint'),
    s('path', { d: 'M52 80l20-10M50 96l10-4', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M84 54q-30-18-6-40q0 14 12 18q4-12 0-18q24 14 14 40q-6 8-20 0z' }, 'orange', { accent: true }),
    s('path', { d: 'M88 50q-8-12 2-20q4 12 10 12q2 8-12 8z' }, 'yellow')
  ],
  parla: [
    ...person(36, 136, 'orange', { accent: true }),
    s('path', { d: 'M42 76h6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: bubble(64, 14, 82, 44) }, 'sky'),
    s('path', { d: bubble(78, 70, 64, 36) }, 'mint'),
    s('path', { d: bubble(60, 52, 40, 30) }, 'yellow'),
    s('path', { d: dots([[94, 34], [106, 34], [118, 34], [100, 86], [112, 86], [124, 86]], 4) }, 'dark')
  ],
  pasante: [
    ...person(62, 136, 'sky', { h: 50, w: 32, r: 13 }),
    s('path', { d: 'M54 86l8 18 8-18', ...SW(2) }, 'red', { stroke: true }),
    s('rect', { x: 56, y: 104, width: 12, height: 14, rx: 2 }, 'white'),
    s('rect', { x: 56, y: 104, width: 12, height: 14, rx: 2, ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 86, y: 92, width: 54, height: 6, rx: 2 }, 'brown'),
    s('path', { d: 'M92 92l2-18h12l2 18zM116 92l2-18h12l2 18z' }, 'orange', { accent: true }),
    s('path', { d: 'M100 68q-4-6 0-10M124 68q-4-6 0-10', ...SW(2) }, 'gray', { stroke: true })
  ],
  perforar: [
    s('rect', { x: 100, y: 24, width: 22, height: 112, rx: 3 }, 'tan'),
    s('ellipse', { cx: 100, cy: 80, rx: 4, ry: 8 }, 'dark'),
    s('path', { d: 'M64 80h36', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 18, y: 64, width: 50, height: 30, rx: 8 }, 'orange', { accent: true }),
    s('path', { d: 'M28 92l-6 34h20l6-32z' }, 'dark'),
    s('path', { d: dots([[130, 70], [136, 84], [132, 96], [140, 76]], 3) }, 'brown')
  ],
  'piñata': [
    s('path', { d: 'M80 14v24', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: star(80, 72, 40, 22) }, 'pink', { accent: true }),
    s('circle', { cx: 80, cy: 74, r: 16 }, 'yellow'),
    s('path', { d: 'M62 108v18M74 110v22M86 110v20M98 108v16', ...SW(4) }, 'purple', { stroke: true }),
    s('path', { d: dots([[40, 132], [120, 128], [132, 112]], 5) }, 'red'),
    s('path', { d: dots([[28, 116], [108, 138]], 5) }, 'blue'),
    s('path', { d: dots([[72, 74], [88, 74]], 3) }, 'dark')
  ],
  prematuramente: [
    s('path', { d: 'M80 34q2-14 12-20', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(84, 26, -20, 26, 8) }, 'green'),
    s('path', { d: 'M80 40q-38-12-40 30q2 46 40 56q38-10 40-56q-2-42-40-30z' }, 'mint', { accent: true }),
    s('circle', { cx: 118, cy: 116, r: 24 }, 'white'),
    s('circle', { cx: 118, cy: 116, r: 24, ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M118 116v-14M118 116l-10 4', ...SW(4) }, 'dark', { stroke: true })
  ],
  prepotente: [
    ground(),
    ...person(64, 136, 'red', { h: 70, w: 40, r: 16, accent: true }),
    s('path', { d: 'M84 76l28 10', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M58 42l8 2M72 44l8-2', ...SW(3) }, 'dark', { stroke: true }),
    ...person(122, 136, 'gray', { h: 26, w: 20, r: 9 })
  ],
  rabioso: [
    s('path', { d: 'M34 50l-4-30 30 16zM126 50l4-30-30 16z' }, 'brown'),
    s('circle', { cx: 80, cy: 80, r: 48 }, 'tan', { accent: true }),
    s('path', { d: 'M52 62l20 10M108 62l-20 10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[64, 80], [96, 80]], 5) }, 'dark'),
    s('path', { d: 'M54 100q26-12 52 0v14q-26 12-52 0z' }, 'dark'),
    s('path', { d: 'M58 102l6 8 6-8 6 8 6-8 6 8 6-8 6 8 4-8', ...SW(3) }, 'white', { stroke: true }),
    s('ellipse', { cx: 80, cy: 92, rx: 8, ry: 5 }, 'black')
  ],
  rancio: [
    s('ellipse', { cx: 80, cy: 118, rx: 60, ry: 14 }, 'gray'),
    s('path', { d: 'M40 116V82l20-14h64v34l-20 14z' }, 'yellow'),
    s('path', { d: 'M40 82h64v34M104 82l20-14', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: dots([[56, 96], [74, 104], [90, 90], [112, 80]], 6) }, 'green', { accent: true }),
    s('path', { d: 'M60 52q-8-10 0-18t0-18M84 52q-8-10 0-18t0-18M108 52q-8-10 0-18t0-18', ...SW(4) }, 'green', { stroke: true })
  ],
  ranura: [
    s('rect', { x: 34, y: 20, width: 92, height: 120, rx: 10 }, 'gray'),
    s('circle', { cx: 80, cy: 66, r: 22 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 66, r: 14, ...SW(3) }, 'orange', { stroke: true }),
    s('rect', { x: 34, y: 84, width: 92, height: 56, rx: 10 }, 'gray'),
    s('rect', { x: 50, y: 80, width: 60, height: 10, rx: 4 }, 'dark'),
    s('path', { d: 'M80 26v10M72 30l8 8 8-8', ...SW(4) }, 'blue', { stroke: true }),
    s('rect', { x: 60, y: 108, width: 40, height: 20, rx: 4 }, 'dark')
  ],

  'recíproco': [
    ground(),
    ...person(34, 136, 'blue'),
    ...person(126, 136, 'green'),
    s('path', { d: 'M48 52q32-30 64 0m-10-4 10 4 2-10', ...SW(5) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M112 70q-32 30-64 0m10 4-10-4-2 10', ...SW(5) }, 'purple', { stroke: true })
  ],
  remontada: [
    s('path', { d: 'M18 136h126M18 136V20', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 50l26 30 20 34 18-6 22-50 22-34', ...SW(7) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M120 16l14 6-10 12', ...SW(7) }, 'green', { stroke: true }),
    s('circle', { cx: 70, cy: 114, r: 9 }, 'red'),
    s('path', { d: star(128, 108, 14) }, 'yellow')
  ],
  'repatriación': [
    ground(),
    s('path', { d: 'M96 136V96l24-20 24 20v40z' }, 'cream'),
    s('path', { d: 'M90 100l30-28 30 28', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: heart(120, 104, 12) }, 'red', { accent: true }),
    s('path', { d: 'M20 56q40-30 72 0', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: jet(56, 44), transform: 'rotate(80 56 44)' }, 'blue')
  ],
  repetitivo: [
    s('path', { d: 'M80 22a58 58 0 1 1-50 28', ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M18 40l12 12 14-8', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: rects([[38, 66, 22, 22], [69, 66, 22, 22], [100, 66, 22, 22]]) }, 'orange'),
    s('path', { d: rects([[38, 96, 22, 8], [69, 96, 22, 8], [100, 96, 22, 8]]) }, 'gray')
  ],
  retorcido: [
    s('path', { d: 'M60 18q40 16 0 32t0 32t0 32t20 28', ...SW(10) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M100 18q-40 16 0 32t0 32t0 32t-20 28', ...SW(10) }, 'tan', { stroke: true }),
    s('path', { d: 'M54 18h52', ...SW(6) }, 'dark', { stroke: true })
  ],
  'reubicación': [
    ground(),
    s('path', { d: 'M18 136v-36l20-18 20 18v36z' }, 'gray'),
    s('path', { d: 'M102 136v-36l20-18 20 18v36z' }, 'green', { accent: true }),
    s('rect', { x: 62, y: 110, width: 30, height: 26, rx: 2 }, 'tan'),
    s('path', { d: 'M62 118h30', ...SW(3) }, 'brown', { stroke: true }),
    arrow('M40 60q40-40 80 0m-12 0 12 0 0-12', 'orange', 5)
  ],
  rezo: [
    s('path', { d: halfRays(80, 70, 50, 62, 7), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M80 30q-14 6-18 40l-6 40h24z' }, 'skin'),
    s('path', { d: 'M80 30q14 6 18 40l6 40H80z' }, 'tan'),
    s('path', { d: 'M52 106h56l6 34H46z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 34v76', ...SW(2) }, 'brown', { stroke: true })
  ],
  sagrario: [
    s('path', { d: halfRays(80, 56, 46, 60, 9), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M46 56q0-30 34-30t34 30z' }, 'orange'),
    s('rect', { x: 46, y: 56, width: 68, height: 64, rx: 2 }, 'yellow', { accent: true }),
    s('path', { d: 'M80 64v48M56 64h48v48H56z', ...SW(3) }, 'orange', { stroke: true }),
    s('rect', { x: 36, y: 120, width: 88, height: 14, rx: 3 }, 'brown'),
    s('path', { d: dots([[74, 88], [86, 88]], 3) }, 'orange')
  ],
  selectividad: [
    ...paper(22, 18, 82, 112),
    s('path', { d: rects([[32, 32, 10, 10], [32, 56, 10, 10], [32, 80, 10, 10], [32, 104, 10, 10]]), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M50 37h42M50 61h42M50 85h42M50 109h30', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 59l4 4 6-8M34 83l4 4 6-8', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M120 140l-6-6 22-80 10 4-22 80z' }, 'yellow', { accent: true }),
    s('path', { d: 'M110 30l26-10 14 6-26 10z' }, 'dark')
  ],
  serenata: [
    backdrop('navy'),
    s('path', { d: 'M126 30a14 14 0 1 0 6 26a16 16 0 0 1-6-26z' }, 'yellow'),
    s('path', { d: 'M86 52h50v10H86zM90 62v14M104 62v14M118 62v14M132 62v14', ...SW(3) }, 'gray', { stroke: true }),
    ...person(52, 140, 'red'),
    s('ellipse', { cx: 66, cy: 112, rx: 14, ry: 11, transform: 'rotate(-30 66 112)' }, 'orange', { accent: true }),
    s('path', { d: 'M72 104l26-26', ...SW(4) }, 'brown', { stroke: true }),
    ...note(96, 44, 'white')
  ],
  'serranía': [
    backdrop('sky'),
    s('path', { d: 'M14 90l22-28 18 18 22-34 24 30 18-22 28 34v38H14z' }, 'purple'),
    s('path', { d: 'M14 112l26-26 20 18 26-30 24 26 20-20 16 18v24a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green', { accent: true }),
    s('path', { d: 'M76 46l7 10-7-2-6 4zM46 116l14-12 14 10M100 112l14-12', ...SW(3) }, 'white', { stroke: true })
  ],
  'sociológico': [
    s('path', { d: 'M80 46L36 104M80 46l44 58M36 104h88M80 46v48M36 104l44-10M124 104l-44-10', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: busts([80], 58, 22, 18) + busts([36, 124], 116, 22, 18) + busts([80], 106, 22, 18) }, 'blue', { accent: true }),
    s('path', { d: dots([[80, 32], [36, 90], [124, 90], [80, 80]], 8) }, 'skin'),
    s('ellipse', { cx: 80, cy: 82, rx: 66, ry: 60, ...DASH(2) }, 'gray', { stroke: true })
  ],
  soluble: [
    s('path', { d: 'M40 40h80l-8 96H48z' }, 'sky'),
    s('path', { d: 'M40 40h80l-8 96H48z', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 62, y: 96, width: 30, height: 30, rx: 3, transform: 'rotate(-12 77 111)' }, 'white'),
    s('rect', { x: 62, y: 96, width: 30, height: 30, rx: 3, transform: 'rotate(-12 77 111)', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: dots([[60, 84], [70, 74], [96, 80], [86, 66], [104, 96], [58, 106]], 3) }, 'white'),
    s('path', { d: 'M50 58q15 8 30 0t30 0', ...SW(3) }, 'blue', { stroke: true, accent: true })
  ],
  subestimar: [
    backdrop('sky', 14, 46),
    s('path', { d: 'M14 58h132v76a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'blue'),
    s('path', { d: 'M48 62l-22 30 10 36 40 12 46-8 18-34-26-36z' }, 'sky', { accent: true }),
    s('path', { d: 'M62 60l12-26 10 8 6-12 14 30z' }, 'white'),
    s('path', { d: 'M62 60l12-26 10 8 6-12 14 30', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 58h132', ...SW(3) }, 'white', { stroke: true })
  ],
  'tablón': [
    s('rect', { x: 16, y: 26, width: 128, height: 100, rx: 6 }, 'brown'),
    s('rect', { x: 24, y: 34, width: 112, height: 84, rx: 2 }, 'tan'),
    s('path', { d: rects([[34, 44, 34, 30], [80, 50, 46, 26], [46, 84, 40, 26]]) }, 'cream'),
    s('rect', { x: 96, y: 84, width: 30, height: 26 }, 'sky'),
    s('path', { d: dots([[51, 46], [103, 52], [66, 86], [111, 86]], 4) }, 'red', { accent: true }),
    s('path', { d: 'M40 132l-6 10M120 132l6 10', ...SW(5) }, 'brown', { stroke: true })
  ],
  tiroides: [
    s('circle', { cx: 80, cy: 34, r: 22 }, 'skin'),
    s('rect', { x: 62, y: 46, width: 36, height: 70 }, 'skin'),
    s('path', { d: 'M18 144q4-34 44-36h36q40 2 44 36z' }, 'skin'),
    s('path', { d: 'M78 90q-6-20-18-18q-10 4-6 22q6 14 24 4zM82 90q6-20 18-18q10 4 6 22q-6 14-24 4z' }, 'red', { accent: true }),
    s('path', { d: 'M80 58v52', ...SW(3, { 'stroke-dasharray': '3 4' }) }, 'tan', { stroke: true })
  ],
  todoterreno: [
    s('path', { d: 'M14 136l30-14 22 8 28-12 52 6v22H14z' }, 'brown'),
    s('rect', { x: 22, y: 66, width: 116, height: 34, rx: 6, transform: 'rotate(-6 80 100)' }, 'green', { accent: true }),
    s('path', { d: 'M38 68l10-24h58l16 18z', transform: 'rotate(-6 80 100)' }, 'sky'),
    s('path', { d: dots([[48, 108], [114, 100]], 17) }, 'dark'),
    s('path', { d: dots([[48, 108], [114, 100]], 6) }, 'gray'),
    s('rect', { x: 132, y: 56, width: 10, height: 26, rx: 4 }, 'dark')
  ],
  toreo: [
    s('ellipse', { cx: 80, cy: 128, rx: 66, ry: 12 }, 'tan'),
    ...person(34, 128, 'yellow', { h: 40, w: 26, r: 11 }),
    s('path', { d: 'M44 86q16 4 22 40H40z' }, 'red', { accent: true }),
    s('path', { d: 'M104 106v20M136 106v20', ...SW(7) }, 'black', { stroke: true }),
    s('ellipse', { cx: 118, cy: 94, rx: 26, ry: 16 }, 'black'),
    s('circle', { cx: 86, cy: 92, r: 13 }, 'black'),
    s('path', { d: 'M84 80q-6-12 4-18M92 80q10-8 6-18', ...SW(4) }, 'cream', { stroke: true })
  ],
  tosca: [
    ground(),
    s('path', { d: 'M24 136l8-50 30-34 46 4 26 34 4 46z' }, 'tan', { accent: true }),
    s('path', { d: dots([[54, 80], [78, 70], [100, 86], [70, 104], [92, 112], [118, 108], [46, 116], [110, 70]], 4) }, 'brown'),
    s('path', { d: dots([[62, 92], [86, 96], [124, 92], [56, 128], [100, 126]], 2.5) }, 'brown'),
    s('path', { d: 'M62 52l8 18M108 56l-6 14', ...SW(3) }, 'brown', { stroke: true })
  ],
  vagar: [
    s('path', { d: 'M18 130q20-30 40-10t20-30q0-26-20-20t0-26q20-20 40 0', ...DASH(4) }, 'gray', { stroke: true }),
    ...lean(116, 136, 6, 'orange', { accent: true }),
    s('path', { d: 'M110 136l-10 0M124 136l10 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M102 100q-10 10-4 20', ...SW(5) }, 'skin', { stroke: true })
  ],
  varado: [
    backdrop('sky', 14, 60),
    s('path', { d: 'M14 70h132v14H14z' }, 'blue'),
    s('path', { d: 'M14 84h132v50a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'tan'),
    s('path', { d: 'M28 96h96l-14 30H46z', transform: 'rotate(12 76 110)' }, 'red', { accent: true }),
    s('path', { d: 'M78 98V40', ...SW(4), transform: 'rotate(12 76 110)' }, 'brown', { stroke: true }),
    s('path', { d: 'M82 44l28 40H82z', transform: 'rotate(12 76 110)' }, 'white')
  ],
  vegano: [
    s('circle', { cx: 80, cy: 86, r: 58 }, 'white'),
    outline({ cx: 80, cy: 86, r: 58 }),
    s('path', { d: ells([[60, 64, 14, 12], [74, 56, 12, 11], [50, 76, 10, 9]]) + 'M58 70l4 26h8l-2-26z' }, 'green', { accent: true }),
    s('path', { d: 'M88 100l40-28-6-6-40 26z' }, 'orange'),
    s('path', { d: dots([[64, 112], [82, 120]], 11) }, 'red'),
    s('path', { d: leaflet(120, 74, -60, 18, 5) }, 'green')
  ],
  vieira: [
    s('rect', { x: 14, y: 116, width: 132, height: 30, rx: 8 }, 'cream'),
    s('path', { d: 'M80 130L22 64q6-46 58-46t58 46z' }, 'pink', { accent: true }),
    s('path', { d: 'M80 130L32 50M80 130L54 26M80 130V20M80 130l26-104M80 130l48-80', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M62 132l18-14 18 14z' }, 'red'),
    s('path', { d: 'M130 126l-8-10q8-6 16 0z' }, 'orange')
  ],
  adecuar: [
    s('path', { d: 'M18 76h44v-8a10 10 0 0 1 20 0v8h60v64H18z' }, 'blue'),
    s('path', { d: 'M62 76v18a10 10 0 0 1 0 20v26H18V76z' }, 'sky'),
    s('path', { d: 'M76 22h18v-6a8 8 0 0 1 16 0v6h18v40H76z' }, 'orange', { accent: true }),
    arrow('M100 66l-14 14', 'gray', 4)
  ],
  'aeródromo': [
    backdrop('mint'),
    s('path', { d: 'M48 146L68 70h24l20 76z' }, 'gray'),
    s('path', { d: 'M80 80v60', ...DASH(4, '8 8') }, 'white', { stroke: true }),
    s('path', { d: 'M40 36h44M58 28l6 8-6 8M44 30v12', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M118 74V30', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M118 30l24 4v10l-24 4z' }, 'orange'),
    s('path', { d: 'M126 31v14M134 32v12', ...SW(3) }, 'white', { stroke: true })
  ],
  altruista: [
    ground(),
    ...person(44, 136, 'blue'),
    ...person(118, 136, 'gray', { h: 36, w: 26 }),
    s('path', { d: 'M58 96h18', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(84, 86, 14) }, 'red', { accent: true }),
    s('path', { d: sparkle(84, 50, 8) }, 'yellow')
  ],
  aparcar: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'dark'),
    s('path', { d: 'M40 14v80M80 14v80M120 14v80', ...SW(4) }, 'white', { stroke: true }),
    s('rect', { x: 88, y: 26, width: 24, height: 44, rx: 6 }, 'blue', { accent: true }),
    s('path', { d: 'M92 36h16v8H92zM92 56h16v6H92z' }, 'sky'),
    s('rect', { x: 48, y: 30, width: 24, height: 44, rx: 6 }, 'red'),
    arrow('M40 130q60 0 60-50m-8 10 8-10 8 10', 'yellow', 4)
  ],
  aposento: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'cream'),
    s('rect', { x: 92, y: 28, width: 38, height: 40, rx: 3 }, 'sky'),
    s('path', { d: 'M111 28v40M92 48h38', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M22 70h12v66H22zM22 108h112v20H22zM126 104h8v32h-8z' }, 'brown'),
    s('rect', { x: 34, y: 92, width: 96, height: 16, rx: 4 }, 'purple', { accent: true }),
    s('rect', { x: 36, y: 82, width: 24, height: 10, rx: 4 }, 'white')
  ],
  avispa: [
    s('path', { d: ells([[66, 52, 22, 10], [94, 52, 22, 10]]), transform: 'rotate(0)' }, 'sky'),
    s('ellipse', { cx: 100, cy: 92, rx: 30, ry: 18 }, 'yellow', { accent: true }),
    s('path', { d: 'M92 76v32M108 76v32', ...SW(6) }, 'black', { stroke: true }),
    s('path', { d: 'M128 92l14 2-14 4z' }, 'black'),
    s('ellipse', { cx: 62, cy: 86, rx: 12, ry: 9 }, 'black'),
    s('circle', { cx: 42, cy: 84, r: 11 }, 'yellow'),
    s('path', { d: 'M36 74l-6-12M44 74l2-12M60 94l-6 20M68 94l2 20', ...SW(3) }, 'black', { stroke: true })
  ],
  bagaje: [
    s('rect', { x: 26, y: 64, width: 108, height: 72, rx: 10 }, 'brown', { accent: true }),
    s('path', { d: 'M62 64V48h36v16', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 64v72M106 64v72', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: dots([[40, 82], [120, 120]], 7) }, 'yellow'),
    s('rect', { x: 34, y: 112, width: 18, height: 12, rx: 2, transform: 'rotate(-10 43 118)' }, 'sky'),
    s('path', { d: rects([[42, 140, 10, 4], [108, 140, 10, 4]]) }, 'dark')
  ],
  bolchevique: [
    s('path', { d: 'M110 60v-16q0-14 12-20q12 6 12 20v16z' }, 'green'),
    s('rect', { x: 102, y: 60, width: 40, height: 40 }, 'cream'),
    s('path', { d: 'M48 104V22', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 22h46l-8 16 8 16H48z' }, 'red', { accent: true }),
    s('path', { d: busts([30, 54, 78, 102, 126], 136, 22, 30) }, 'gray'),
    s('path', { d: dots([[30, 96], [54, 96], [78, 96], [102, 96], [126, 96]], 9) }, 'skin'),
    s('path', { d: 'M20 90h20M44 90h20M68 90h20M92 90h20M116 90h20', ...SW(5) }, 'dark', { stroke: true })
  ],
  brandy: [
    s('path', { d: 'M28 136V64l8-14V22h20v28l8 14v72z' }, 'brown'),
    s('rect', { x: 34, y: 80, width: 24, height: 30, rx: 3 }, 'cream'),
    s('path', { d: 'M86 70h50q4 44-25 48q-29-4-25-48z' }, 'white', { flatOnly: true }),
    s('path', { d: 'M87 90h48q-2 26-24 28q-22-2-24-28z' }, 'orange', { accent: true }),
    s('path', { d: 'M86 70h50q4 44-25 48q-29-4-25-48zM111 118v14M96 134h30', ...SW(3) }, 'gray', { stroke: true })
  ],
  brasa: [
    s('path', { d: 'M18 116h124l-10 22H28z' }, 'dark'),
    s('path', { d: ells([[42, 104, 18, 12], [76, 100, 20, 14], [112, 104, 20, 12], [58, 88, 16, 10], [96, 88, 16, 10]]) }, 'black'),
    s('path', { d: 'M32 104l10-4 6 6M70 98l8 4 6-6M104 104l8-6 8 6M54 88l8 2M92 86l8 4', ...SW(3) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M62 74q-8-12 4-26q2 10 8 12q4-10 0-18q16 12 6 32zM90 76q-6-10 4-18q4 8 8 8q8 10-12 10z' }, 'red'),
    s('path', { d: 'M14 112h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  'búnker': [
    s('path', { d: 'M14 132q66-40 132 0v14H14z' }, 'green'),
    s('path', { d: 'M34 128q0-60 46-60t46 60z' }, 'gray', { accent: true }),
    s('rect', { x: 56, y: 92, width: 48, height: 9, rx: 3 }, 'dark'),
    s('path', { d: 'M48 116h64', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M80 68V46', ...SW(4) }, 'dark', { stroke: true })
  ],
  calmado: [
    s('ellipse', { cx: 80, cy: 128, rx: 50, ry: 10 }, 'mint'),
    s('path', { d: 'M40 126q40-26 80 0z' }, 'blue', { accent: true }),
    s('rect', { x: 64, y: 78, width: 32, height: 42, rx: 12 }, 'blue'),
    s('path', { d: 'M66 90q-16 18 -4 28M94 90q16 18 4 28', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 80, cy: 62, r: 14 }, 'skin'),
    s('path', { d: 'M72 62q3 3 6 0M82 62q3 3 6 0', ...SW(2.5) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 46q8-6 16 0t16 0M98 36q8-6 16 0t16 0', ...SW(3) }, 'sky', { stroke: true })
  ],
  calza: [
    s('path', { d: 'M50 20h60l8 50H42z' }, 'green'),
    s('path', { d: 'M54 70h20l-2 62H58zM86 70h20l-4 62H88z' }, 'red', { accent: true }),
    s('path', { d: 'M56 130h18l-2 8H38q2-8 18-8zM88 130h16q16 0 18 8H88z' }, 'dark'),
    s('path', { d: 'M42 70h76', ...SW(5) }, 'yellow', { stroke: true })
  ],
  campar: [
    ground(),
    s('path', { d: 'M20 132l38-80 38 80z' }, 'orange', { accent: true }),
    s('path', { d: 'M58 52l-14 80h28z' }, 'dark'),
    s('path', { d: 'M108 136l24-12M108 124l24 12', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M110 122q-6-14 6-28q2 10 6 10q4-8 2-16q14 14 2 34z' }, 'red'),
    s('path', { d: sparkle(124, 30, 6) + sparkle(30, 30, 5) }, 'yellow')
  ],
  'capitulación': [
    s('path', { d: 'M14 112h132v34H14z' }, 'gray'),
    s('path', { d: 'M14 112v-10h18v10M50 112v-10h18v10M92 112v-10h18v10M128 112v-10h18v10' }, 'gray'),
    s('path', { d: 'M56 102V20', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M58 22q24-10 40 0t40 0v38q-20 10-40 0t-40 0z' }, 'white', { accent: true }),
    s('path', { d: 'M58 22q24-10 40 0t40 0v38q-20 10-40 0t-40 0z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 128h132', ...SW(2) }, 'white', { stroke: true })
  ],
  catequesis: [
    s('path', { d: 'M56 70V44q0-24 24-24t24 24v26z' }, 'sky'),
    s('path', { d: 'M56 70V44q0-24 24-24t24 24v26zM80 22v48M56 46h48', ...SW(4) }, 'purple', { stroke: true }),
    ...openBook(80, 90, 'white', 'red').map((sh, i) => i === 0 ? { ...sh, accent: true } : sh),
    s('path', { d: dots([[26, 104], [134, 104]], 11) }, 'skin'),
    s('path', { d: busts([26, 134], 146, 24, 28) }, 'blue')
  ],
  'consolación': [
    ground(),
    ...person(54, 136, 'green', { accent: true }),
    ...person(102, 136, 'gray', { h: 40, r: 11 }),
    s('path', { d: 'M62 88q20-10 38 4', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: drop(108, 86, 3.5) }, 'blue'),
    s('path', { d: heart(80, 36, 12) }, 'pink')
  ],
  corintio: [
    s('rect', { x: 34, y: 124, width: 92, height: 14, rx: 2 }, 'tan'),
    s('rect', { x: 54, y: 62, width: 52, height: 62 }, 'cream'),
    s('path', { d: 'M64 64v58M80 64v58M96 64v58', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 30, y: 20, width: 100, height: 12, rx: 2 }, 'tan'),
    s('path', { d: 'M48 32q-6 16 8 30h48q14-14 8-30z' }, 'cream'),
    s('path', { d: leaflet(58, 62, -110, 26, 8) + leaflet(80, 62, -90, 28, 8) + leaflet(102, 62, -70, 26, 8) + 'M44 40a8 8 0 1 0 8-8M116 40a8 8 0 1 1-8-8' }, 'green', { accent: true })
  ],
  costal: [
    s('path', { d: 'M46 52q-20 30-16 70q2 18 20 18h60q18 0 20-18q4-40-16-70z' }, 'tan', { accent: true }),
    s('path', { d: 'M58 52l-6-24q28 10 56 0l-6 24z' }, 'tan'),
    s('path', { d: 'M54 52h52', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M60 80l6 6M90 96l6-6M70 116l6 6M100 120l4-6', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: dots([[24, 136], [34, 140], [136, 138]], 4) }, 'yellow')
  ],
  crisol: [
    s('path', { d: 'M40 42h80l-12 64H52z' }, 'gray'),
    s('path', { d: 'M42 52h76l-3 14H45z' }, 'orange', { accent: true }),
    s('path', { d: 'M36 42h88', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 140q-8-14 6-26q2 12 10 12q2-12 10-18q8 12 10 18q8 0 10-12q14 12 6 26z' }, 'red'),
    s('path', { d: 'M62 140q-2-8 6-14q4 8 12 6q8 2 12-6q8 6 6 14z' }, 'yellow'),
    s('path', { d: 'M66 30q-4-8 2-14M92 30q-4-8 2-14', ...SW(3) }, 'gray', { stroke: true })
  ],
  cuantitativo: [
    s('rect', { x: 26, y: 24, width: 40, height: 112, rx: 6 }, 'white'),
    s('rect', { x: 26, y: 64, width: 40, height: 72, rx: 6 }, 'sky'),
    s('rect', { x: 26, y: 24, width: 40, height: 112, rx: 6, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M26 40h12M26 56h18M26 72h12M26 88h18M26 104h12M26 120h18', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: rects([[84, 100, 14, 36], [104, 76, 14, 60], [124, 50, 14, 86]]) }, 'blue', { accent: true }),
    s('path', { d: 'M80 136h62', ...SW(3) }, 'gray', { stroke: true })
  ],
  cursiva: [
    ...paper(18, 30, 124, 100),
    s('path', { d: 'M30 62q6-20 12 0t12 0t12 0q4-18 10 0t12 0q6-20 12 0t12 0M30 92q6-20 12 0t12 0q6-20 12 0t12 0', ...SW(4), transform: 'skewX(-12) translate(18 0)' }, 'navy', { stroke: true }),
    s('path', { d: 'M108 112l30-30 6 6-30 30-10 4z' }, 'red', { accent: true })
  ],
  decapitar: [
    s('rect', { x: 34, y: 124, width: 92, height: 14, rx: 2 }, 'brown'),
    s('path', { d: 'M48 124V22M112 124V22M42 22h76', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M52 40h56v18L52 72z' }, 'gray', { accent: true }),
    s('path', { d: 'M80 26v14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 104h56v12H52z' }, 'tan'),
    s('circle', { cx: 80, cy: 110, r: 8 }, 'dark')
  ],
  decreciente: [
    s('path', { d: 'M18 136h126M18 136V20', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: rects([[26, 34, 18, 102], [52, 58, 18, 78], [78, 82, 18, 54], [104, 106, 18, 30]]) }, 'orange', { accent: true }),
    s('path', { d: 'M30 22l100 76m-2-14 2 14-14 2', ...SW(5) }, 'red', { stroke: true })
  ],
  delantal: [
    s('path', { d: 'M60 24h40v34q20 4 24 10l-6 70H42l-6-70q4-6 24-10z' }, 'red', { accent: true }),
    s('path', { d: 'M60 24q0-12 20-12t20 12', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M38 66l-18 10M122 66l18 10', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 58, y: 88, width: 44, height: 26, rx: 4 }, 'white'),
    s('path', { d: 'M80 88v26', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 132h68', ...DASH(3, '4 4') }, 'white', { stroke: true })
  ],
  delinquir: [
    ground(),
    ...lean(66, 136, -10, 'dark'),
    s('path', { d: 'M48 66h28v8H48z' }, 'black'),
    s('path', { d: 'M52 56q4-16 14-16t12 14z' }, 'black'),
    s('path', { d: 'M84 100q28-6 44 10q4 22-16 24q-22 0-28-34z' }, 'tan', { accent: true }),
    s('path', { d: 'M76 96l10 2', ...SW(6) }, 'skin', { stroke: true })
  ],
  'desaprobación': [
    s('rect', { x: 46, y: 30, width: 64, height: 60, rx: 16 }, 'skin'),
    s('rect', { x: 56, y: 76, width: 22, height: 62, rx: 11 }, 'skin'),
    s('path', { d: 'M62 46h40M62 60h40', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 100, y: 26, width: 26, height: 68, rx: 6 }, 'red', { accent: true }),
    s('path', { d: 'M56 76h22', ...SW(3) }, 'tan', { stroke: true })
  ],
  descompuesto: [
    s('rect', { x: 28, y: 60, width: 104, height: 76, rx: 8 }, 'gray'),
    s('rect', { x: 40, y: 72, width: 56, height: 44, rx: 4 }, 'dark'),
    s('path', { d: 'M48 80l20 16-8 4 22 12', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M110 70l-4 8 8 6-6 8 8 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[56, 40, 16, 12], [80, 30, 18, 14], [104, 42, 14, 10]]) }, 'gray'),
    s('path', { d: burst(124, 58, 14, 6, 8) }, 'yellow', { accent: true })
  ],
  desestimar: [
    ...paper(22, 26, 64, 84),
    s('path', { d: 'M32 44h44M32 58h44M32 72h30', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 62, cy: 92, r: 14, ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M52 82l20 20', ...SW(5) }, 'red', { stroke: true }),
    s('rect', { x: 92, y: 30, width: 44, height: 22, rx: 6, transform: 'rotate(30 114 41)' }, 'brown', { accent: true }),
    s('path', { d: 'M108 54l-18 34', ...SW(7) }, 'brown', { stroke: true }),
    s('rect', { x: 92, y: 124, width: 48, height: 12, rx: 3 }, 'brown')
  ],
  detenimiento: [
    s('path', { d: 'M28 128q-6-70 70-90q14 70-56 94z' }, 'green'),
    s('path', { d: 'M34 126q30-40 60-84M50 104l-10-14M64 84l-12-12M60 98l20 0M74 78l16 0', ...SW(3) }, 'mint', { stroke: true }),
    s('circle', { cx: 80, cy: 78, r: 30 }, 'sky', { flatOnly: true }),
    s('circle', { cx: 80, cy: 78, r: 30, ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M102 100l32 32', ...SW(12) }, 'brown', { stroke: true, accent: true })
  ],
  disconformidad: [
    ground(),
    ...person(80, 136, 'blue'),
    s('path', { d: 'M94 104l18-34', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M114 76V24', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 86, y: 18, width: 56, height: 40, rx: 4 }, 'yellow', { accent: true }),
    s('path', { d: dots([[104, 32], [124, 32]], 3) }, 'dark'),
    s('path', { d: 'M102 48q12-8 24 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M72 80q8-4 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  enchufado: [
    s('rect', { x: 108, y: 54, width: 34, height: 50, rx: 6 }, 'white'),
    s('rect', { x: 108, y: 54, width: 34, height: 50, rx: 6, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: rects([[118, 66, 4, 12], [128, 66, 4, 12]]) }, 'dark'),
    ...person(40, 136, 'purple'),
    s('path', { d: 'M54 116q30 10 30-24q0-14 18-14', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 96, y: 68, width: 16, height: 18, rx: 3 }, 'orange', { accent: true }),
    s('path', { d: star(40, 34, 14) }, 'yellow')
  ],
  enloquecer: [
    s('path', { d: 'M30 60q-8-30 14-26q0-20 22-12q10-14 26-2q20-10 26 10q22 0 14 26z' }, 'orange'),
    s('circle', { cx: 80, cy: 88, r: 44 }, 'skin'),
    s('path', { d: spiral(60, 80) + spiral(94, 80), ...SW(3) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M62 112q6-6 12 0t12 0t12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: star(24, 104, 8) + star(138, 100, 8) + star(130, 30, 7) }, 'yellow')
  ],
  entorpecer: [
    ground(),
    s('path', { d: 'M40 136V82M120 136V82', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 22, y: 64, width: 116, height: 22, rx: 4 }, 'white'),
    s('path', { d: 'M40 64l-14 22M64 64l-14 22M88 64l-14 22M112 64l-14 22M136 64l-14 22', ...SW(8, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true, accent: true }),
    s('rect', { x: 22, y: 64, width: 116, height: 22, rx: 4, ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 38, r: 10 }, 'orange')
  ],
  envoltorio: [
    s('rect', { x: 20, y: 64, width: 72, height: 66, rx: 4 }, 'pink', { accent: true }),
    s('path', { d: 'M20 96h72M56 64v66', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[32, 76], [76, 116], [40, 118], [80, 74]], 4) }, 'white'),
    s('path', { d: 'M92 100l40-60 16 10-38 58z' }, 'pink'),
    s('path', { d: 'M92 100h20', ...SW(2) }, 'red', { stroke: true }),
    s('ellipse', { cx: 140, cy: 46, rx: 7, ry: 10, transform: 'rotate(34 140 46)' }, 'red')
  ],
  'epidemiología': [
    s('rect', { x: 14, y: 30, width: 132, height: 100, rx: 8 }, 'mint'),
    s('path', { d: 'M28 50q20-10 34 4q14 16 34 0t36 10v50q-20 4-30-10t-36 0q-24 8-38-14z' }, 'green'),
    s('path', { d: dots([[62, 74], [72, 84], [54, 90], [84, 70], [104, 96], [118, 82]], 5) }, 'red'),
    s('circle', { cx: 120, cy: 40, r: 14 }, 'purple', { accent: true }),
    s('path', { d: rays(120, 40, 14, 22, 8), ...SW(4) }, 'purple', { stroke: true }),
    s('path', { d: 'M62 74l42 22', ...DASH(2, '3 4') }, 'red', { stroke: true })
  ],
  eslovaco: [
    s('path', { d: 'M14 136q66-40 132 0z' }, 'green'),
    s('rect', { x: 40, y: 70, width: 80, height: 50 }, 'white'),
    s('path', { d: rects([[34, 56, 16, 64], [110, 56, 16, 64]]) }, 'white'),
    s('path', { d: 'M40 70h80v50H40zM34 56h16v64H34zM110 56h16v64h-16z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 56l12-20 12 20zM106 56l12-20 12 20zM50 70l30-16 30 16z' }, 'red', { accent: true }),
    s('path', { d: grid(52, 82, 4, 2, 8, 10, 16, 18) }, 'sky')
  ],
  estribo: [
    s('path', { d: 'M72 14h16v44H72z' }, 'brown'),
    s('path', { d: 'M74 58h12v8H74z' }, 'gray'),
    s('path', { d: 'M80 66q-38 10-38 50v14h76v-14q0-40-38-50z', ...SW(9) }, 'gray', { stroke: true, accent: true }),
    s('rect', { x: 36, y: 124, width: 88, height: 14, rx: 4 }, 'dark')
  ],
  estruendo: [
    s('path', { d: burst(122, 44, 24, 12, 10) }, 'orange', { accent: true }),
    s('path', { d: 'M92 64l-12 8 8 6-10 8M100 80l-8 14 10 2-6 12', ...SW(4) }, 'red', { stroke: true }),
    ...person(48, 136, 'blue'),
    s('path', { d: 'M38 78h-8M58 78h8', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M36 100l-6-24M60 100l6-24', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M44 72l4 4M52 72l-4 4M44 86h8', ...SW(3) }, 'dark', { stroke: true })
  ],
  'evaporación': [
    s('circle', { cx: 122, cy: 36, r: 16 }, 'yellow'),
    s('path', { d: rays(122, 36, 21, 28, 8), ...SW(3) }, 'orange', { stroke: true }),
    s('ellipse', { cx: 70, cy: 124, rx: 52, ry: 14 }, 'blue', { accent: true }),
    s('path', { d: 'M44 104q-8-10 0-20t0-20M70 104q-8-10 0-20t0-20M96 104q-8-10 0-20t0-20', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: 'M38 50l6-8 6 8M64 50l6-8 6 8M90 50l6-8 6 8', ...SW(4) }, 'sky', { stroke: true })
  ],
  exponencialmente: [
    s('path', { d: 'M20 136h124M20 136V18', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 130q60 0 80-20q18-20 26-84', ...SW(7) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M120 34l10-12 8 14', ...SW(7) }, 'purple', { stroke: true }),
    s('path', { d: dots([[46, 129], [76, 124], [100, 112], [118, 84]], 5) }, 'orange')
  ],
  expresivo: [
    s('path', { d: 'M18 34q24-12 50 0q4 40-25 54q-29-14-25-54z' }, 'yellow', { accent: true }),
    s('path', { d: 'M30 50q5-6 10 0M48 50q5-6 10 0M32 66q11 12 22 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M88 70q26-12 52 0q4 42-26 56q-30-14-26-56z' }, 'blue'),
    s('path', { d: 'M100 88q5 6 10 0M118 88q5 6 10 0M102 110q11-10 22 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 88q10 30 40 40', ...SW(3) }, 'red', { stroke: true })
  ],
  familiaridad: [
    ground(),
    s('path', { d: 'M18 56l62-38 62 38', ...SW(6) }, 'red', { stroke: true, accent: true }),
    ...person(44, 136, 'blue', { h: 50 }),
    ...person(116, 136, 'pink', { h: 46 }),
    ...person(80, 136, 'yellow', { h: 26, w: 22, r: 10 }),
    s('path', { d: 'M58 108h12M90 108h12', ...SW(6) }, 'skin', { stroke: true })
  ],
  focal: [
    s('ellipse', { cx: 60, cy: 80, rx: 12, ry: 52 }, 'sky', { accent: true }),
    s('path', { d: 'M14 40h46l62 40M14 80h108M14 120h46l62-40', ...SW(3) }, 'orange', { stroke: true }),
    s('ellipse', { cx: 60, cy: 80, rx: 12, ry: 52, ...SW(3) }, 'blue', { stroke: true }),
    s('circle', { cx: 122, cy: 80, r: 8 }, 'red'),
    s('path', { d: sparkle(122, 80, 22) }, 'yellow', { flatOnly: true })
  ],
  'futbolístico': [
    s('ellipse', { cx: 80, cy: 136, rx: 50, ry: 6 }, 'mint'),
    s('circle', { cx: 80, cy: 80, r: 54 }, 'white'),
    s('circle', { cx: 80, cy: 80, r: 54, ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 62l17 12-6 20H69l-6-20z' }, 'black', { accent: true }),
    s('path', { d: 'M80 62V30M97 74l28-10M91 94l18 26M69 94l-18 26M63 74l-28-10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M70 28l10-6 10 6-4 8H74zM118 58l8 2 2 12-8 4-6-8zM42 58l-8 2-2 12 8 4 6-8z' }, 'black')
  ],
  goteo: [
    s('path', { d: 'M20 40h70v20H20z' }, 'gray', { accent: true }),
    s('path', { d: 'M70 60h24v20H70z' }, 'gray'),
    s('rect', { x: 46, y: 26, width: 16, height: 14, rx: 3 }, 'dark'),
    s('path', { d: drop(82, 98, 6) + drop(82, 124, 4) }, 'blue'),
    s('ellipse', { cx: 82, cy: 140, rx: 30, ry: 5 }, 'sky')
  ],
  'grosería': [
    s('circle', { cx: 56, cy: 96, r: 40 }, 'skin'),
    s('path', { d: 'M38 84l10 4M74 84l-10 4', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 108q16 8 32 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M50 110h14v10a7 7 0 0 1-14 0z' }, 'red', { accent: true }),
    s('path', { d: bubble(80, 14, 66, 50) }, 'dark'),
    s('path', { d: 'M92 30l10 12-8 4 10 10M112 30q10 6 4 14t6 12M130 28l4 18', ...SW(4) }, 'yellow', { stroke: true })
  ],
  gubernatura: [
    s('rect', { x: 26, y: 122, width: 108, height: 14 }, 'gray'),
    s('rect', { x: 34, y: 76, width: 92, height: 46 }, 'cream'),
    s('path', { d: 'M46 80v40M62 80v40M98 80v40M114 80v40', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: 'M26 76l54-18 54 18z' }, 'gray'),
    s('path', { d: 'M60 58q0-22 20-22t20 22z' }, 'sky', { accent: true }),
    s('path', { d: 'M80 36V16', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 16h18l-4 6 4 6H80z' }, 'red'),
    s('rect', { x: 72, y: 96, width: 16, height: 26 }, 'brown')
  ],
  huy: [
    s('rect', { x: 14, y: 116, width: 132, height: 10, rx: 2 }, 'brown'),
    s('path', { d: 'M60 66h40l-6 50H66z', transform: 'rotate(28 80 116)' }, 'sky'),
    s('path', { d: 'M60 66h40l-6 50H66z', transform: 'rotate(28 80 116)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: drop(122, 72, 6) + drop(136, 92, 5) + drop(112, 52, 4) }, 'blue', { accent: true }),
    s('path', { d: 'M28 36l8 10M44 26v14M60 32l-6 10', ...SW(4) }, 'orange', { stroke: true })
  ],
  incluyente: [
    ground(),
    s('path', { d: 'M18 64q62-64 124 0z' }, 'purple', { accent: true }),
    s('path', { d: 'M80 64v20', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: busts([34, 62, 98, 126], 136, 22, 34) }, 'blue'),
    s('path', { d: busts([62, 126], 136, 22, 34) }, 'orange'),
    s('path', { d: dots([[34, 92], [62, 92], [98, 92], [126, 92]], 10) }, 'skin'),
    s('path', { d: dots([[62, 92], [126, 92]], 10) }, 'brown')
  ],
  indiscriminado: [
    s('rect', { x: 70, y: 112, width: 20, height: 26, rx: 3 }, 'dark'),
    s('circle', { cx: 80, cy: 104, r: 12 }, 'gray', { accent: true }),
    s('path', { d: 'M80 92l-46-56M80 92l-6-70M80 92l40-60M80 92l56-12M80 92l-60-10M80 92l60 30M80 92l-60 34', ...DASH(3, '2 8') }, 'blue', { stroke: true }),
    s('path', { d: dots([[30, 30], [72, 18], [124, 28], [140, 80], [18, 80], [142, 124], [18, 128]], 5) }, 'blue')
  ],
  indulgencia: [
    s('path', { d: heart(80, 70, 30) }, 'pink', { accent: true }),
    s('rect', { x: 46, y: 106, width: 52, height: 22, rx: 6, transform: 'rotate(-12 72 117)' }, 'brown'),
    s('path', { d: 'M96 116l40 12', ...SW(7) }, 'brown', { stroke: true }),
    s('rect', { x: 30, y: 132, width: 100, height: 8, rx: 3 }, 'tan'),
    s('path', { d: sparkle(130, 40, 8) + sparkle(30, 46, 6) }, 'yellow')
  ],
  insigne: [
    s('path', { d: laurel(80, 66, 46) }, 'green'),
    s('circle', { cx: 80, cy: 66, r: 30 }, 'yellow', { accent: true }),
    s('path', { d: star(80, 66, 18) }, 'orange'),
    s('path', { d: 'M64 96l-10 40 14-8 8 14 4-44zM96 96l10 40-14-8-8 14-4-44z' }, 'red')
  ],
  insolente: [
    ground(),
    ...person(118, 136, 'gray', { h: 46 }),
    s('path', { d: 'M100 136l4-46', ...SW(4) }, 'brown', { stroke: true }),
    ...person(48, 136, 'red', { h: 40, accent: true }),
    s('path', { d: 'M62 96l24-16', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 82, y: 70, width: 12, height: 16, rx: 5 }, 'skin'),
    s('path', { d: 'M48 72l10-6M52 80q6 2 10-2', ...SW(3) }, 'dark', { stroke: true })
  ],
  instructivo: [
    s('rect', { x: 26, y: 18, width: 108, height: 124, rx: 6 }, 'blue', { accent: true }),
    s('rect', { x: 34, y: 26, width: 92, height: 108, rx: 3 }, 'white'),
    s('path', { d: rects([[42, 36, 30, 26], [88, 36, 30, 26], [42, 78, 30, 26], [88, 78, 30, 26]]), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M75 49h10M75 91h10', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M50 54l8-12 8 12zM96 42h14v14H96zM57 84v14M50 91h14M103 84a7 7 0 1 0 0.1 0z' }, 'orange'),
    s('path', { d: 'M42 116h76M42 126h50', ...SW(3) }, 'gray', { stroke: true })
  ],
  'inválido': [
    s('path', { d: 'M18 52h124v20a10 10 0 0 0 0 20v20H18V92a10 10 0 0 0 0-20z' }, 'tan'),
    s('path', { d: 'M104 56v52', ...DASH(3, '4 5') }, 'brown', { stroke: true }),
    s('path', { d: 'M30 66h56M30 80h40M30 94h50', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M24 120L136 40', ...SW(12) }, 'red', { stroke: true, accent: true })
  ],
};
