// Illustration specs for words still undrawn in batches 0045–0047 (see server/scripts/lexicon/art.js)
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
  brisa: [
    s('path', { d: 'M18 56h66a14 14 0 1 0-14-14M18 82h92a14 14 0 1 1-14 14M30 106h52', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: leaflet(112, 46, -30, 24, 8) + leaflet(122, 70, 15, 18, 7) }, 'green', { accent: true }),
    s('path', { d: leaflet(94, 112, -20, 18, 6) }, 'mint'),
    s('path', { d: 'M16 134q16-8 32 0t32 0 32 0 32 0', ...SW(4) }, 'sky', { stroke: true })
  ],
  calentar: [
    s('path', { d: 'M46 56q-6-8 0-16t0-16M62 56q-6-8 0-16t0-16', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 30, y: 66, width: 48, height: 54, rx: 8 }, 'red', { accent: true }),
    s('path', { d: 'M78 78h8a10 10 0 0 1 0 22h-8', ...SW(6) }, 'red', { stroke: true }),
    s('rect', { x: 114, y: 26, width: 16, height: 88, rx: 8 }, 'white'),
    s('rect', { x: 118, y: 56, width: 8, height: 60 }, 'red'),
    s('circle', { cx: 122, cy: 120, r: 12 }, 'red'),
    outline({ x: 114, y: 26, width: 16, height: 88, rx: 8 }),
    arrow('M102 76V42M94 50l8-8 8 8', 'orange', 4)
  ],
  caricatura: [
    ...paper(28, 16, 104, 128),
    s('rect', { x: 70, y: 104, width: 20, height: 30, rx: 6 }, 'blue'),
    s('circle', { cx: 80, cy: 66, r: 36 }, 'skin'),
    s('path', { d: 'M46 54q6-30 34-28q28-2 34 28q-14-14-34-14t-34 14z' }, 'brown'),
    s('path', { d: dots([[66, 58], [94, 58]], 5) }, 'dark'),
    s('ellipse', { cx: 80, cy: 76, rx: 13, ry: 15 }, 'pink', { accent: true }),
    s('path', { d: 'M58 94q22 12 44 0', ...SW(4) }, 'dark', { stroke: true })
  ],
  'cesión': [
    ground(),
    ...person(36, 136, 'blue'),
    ...person(124, 136, 'green'),
    s('path', { d: 'M50 100h18M92 100h18', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 64, y: 84, width: 32, height: 24, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M64 92h32', ...SW(3) }, 'orange', { stroke: true }),
    arrow('M54 56h52M96 46l10 10-10 10')
  ],
  chimenea: [
    ground(),
    s('rect', { x: 98, y: 36, width: 18, height: 40 }, 'brown', { accent: true }),
    s('rect', { x: 36, y: 84, width: 88, height: 52 }, 'tan'),
    s('path', { d: 'M26 88l54-44 54 44z' }, 'red'),
    s('rect', { x: 70, y: 106, width: 20, height: 30 }, 'brown'),
    s('rect', { x: 44, y: 96, width: 16, height: 16 }, 'sky'),
    s('path', { d: ells([[106, 28, 8, 5], [118, 22, 10, 7], [134, 20, 9, 6]]) }, 'gray')
  ],
  cimiento: [
    s('rect', { x: 14, y: 100, width: 132, height: 46, rx: 4 }, 'brown'),
    s('rect', { x: 32, y: 100, width: 96, height: 32 }, 'gray', { accent: true }),
    s('path', { d: 'M40 108l12 16M60 108l12 16M80 108l12 16M100 108l12 16', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 44, y: 30, width: 72, height: 70 }, 'cream'),
    outline({ x: 44, y: 30, width: 72, height: 70 }),
    s('path', { d: grid(54, 40, 3, 3, 12, 12, 20, 20) }, 'sky'),
    s('path', { d: 'M14 100h132', ...SW(4) }, 'green', { stroke: true })
  ],
  consciencia: [
    s('path', { d: halfRays(80, 92, 50, 64, 7), ...SW(5) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 92, r: 40 }, 'skin', { accent: true }),
    s('path', { d: ells([[64, 86, 10, 11], [96, 86, 10, 11]]) }, 'white'),
    s('path', { d: dots([[64, 88], [96, 88]], 5) }, 'dark'),
    s('path', { d: 'M66 112q14 10 28 0', ...SW(4) }, 'dark', { stroke: true })
  ],
  contenedor: [
    s('path', { d: 'M40 24l40 32 40-32', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 34, y: 16, width: 92, height: 8, rx: 2 }, 'yellow'),
    s('rect', { x: 18, y: 56, width: 124, height: 66, rx: 3 }, 'orange', { accent: true }),
    s('path', { d: 'M32 62v54M44 62v54M56 62v54M68 62v54M80 62v54M92 62v54M104 62v54M116 62v54M128 62v54', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M18 56h124M18 122h124', ...SW(5) }, 'brown', { stroke: true }),
    ground(132)
  ],
  culpabilidad: [
    ground(),
    ...person(54, 136, 'blue'),
    s('path', { d: dots([[49, 76], [59, 76]], 2) }, 'dark'),
    s('path', { d: 'M49 86q5-4 10 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: drop(72, 66, 4) }, 'sky'),
    s('path', { d: poly([[94, 136], [98, 112], [112, 118], [108, 136]]) + poly([[114, 136], [118, 108], [132, 116], [128, 136]]) + poly([[102, 100], [120, 94], [116, 106]]) }, 'orange', { accent: true }),
    s('path', { d: 'M96 104l-6-6M126 100l6-6M112 88v-8', ...SW(3) }, 'gray', { stroke: true })
  ],
  cumbia: [
    ...lady(58, 136, 'red', { accent: true }),
    ...person(106, 136, 'blue'),
    s('path', { d: 'M64 92l16-8M92 96l-12-12', ...SW(6) }, 'skin', { stroke: true }),
    ...note(26, 54, 'purple'),
    ...note(120, 50, 'orange')
  ],
  desecho: [
    ground(),
    s('path', { d: 'M28 136q-10-34 16-48l-4-10h20l-4 10q26 14 16 48z' }, 'dark', { accent: true }),
    s('path', { d: 'M88 136q-6-26 14-36l-2-8h16l-2 8q20 10 14 36z' }, 'green'),
    s('path', { d: poly([[66, 136], [70, 116], [84, 120], [82, 136]]) }, 'gray'),
    s('path', { d: 'M118 136q4-16 18-14', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[54, 56], [100, 60], [78, 44]], 3) }, 'dark'),
    s('path', { d: 'M48 50q6-8 12 0M94 54q6-8 12 0M72 38q6-8 12 0', ...SW(2) }, 'gray', { stroke: true })
  ],
  directriz: [
    s('rect', { x: 36, y: 22, width: 88, height: 122, rx: 6 }, 'brown', { accent: true }),
    s('rect', { x: 44, y: 32, width: 72, height: 104, rx: 2 }, 'white'),
    s('rect', { x: 62, y: 16, width: 36, height: 14, rx: 4 }, 'gray'),
    s('path', { d: 'M52 56l5 5 9-10M52 86l5 5 9-10M52 116l5 5 9-10', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M74 56h32M74 86h32M74 116h32', ...SW(5) }, 'gray', { stroke: true })
  ],
  dron: [
    s('ellipse', { cx: 80, cy: 134, rx: 36, ry: 6 }, 'gray'),
    s('path', { d: 'M36 70h88M44 70V58M116 70V58M66 86l-10 16M94 86l10 16', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: ells([[44, 56, 22, 4], [116, 56, 22, 4]]) }, 'gray'),
    s('rect', { x: 58, y: 62, width: 44, height: 26, rx: 10 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 92, r: 8 }, 'dark'),
    s('circle', { cx: 80, cy: 92, r: 3 }, 'sky')
  ],
  dureza: [
    ground(),
    s('path', { d: poly([[34, 136], [42, 100], [70, 90], [104, 96], [124, 136]]) }, 'gray', { accent: true }),
    s('path', { d: 'M76 64l50-34', ...SW(8) }, 'brown', { stroke: true }),
    s('rect', { x: 50, y: 56, width: 40, height: 20, rx: 3, transform: 'rotate(57 70 66)' }, 'dark'),
    s('path', { d: sparkle(100, 82, 9) + sparkle(46, 86, 7) }, 'yellow')
  ],
  eclipse: [
    backdrop('navy'),
    s('path', { d: rays(80, 80, 44, 60, 12), ...SW(5) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 38 }, 'yellow', { accent: true }),
    s('circle', { cx: 86, cy: 76, r: 35 }, 'black'),
    s('path', { d: dots([[28, 30], [132, 128], [128, 28]], 2) }, 'white')
  ],
  enteramente: [
    s('rect', { x: 20, y: 88, width: 120, height: 36, rx: 10 }, 'gray'),
    s('rect', { x: 26, y: 94, width: 108, height: 24, rx: 6 }, 'green', { accent: true }),
    s('path', { d: 'M48 94v24M70 94v24M92 94v24M114 94v24', ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 50, r: 26 }, 'green'),
    s('path', { d: 'M68 50l8 8 16-16', ...SW(6) }, 'white', { stroke: true })
  ],
  especificar: [
    ...paper(24, 18, 84, 116),
    s('path', { d: 'M36 40h60M36 56h60M36 98h60M36 114h40', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 32, y: 70, width: 68, height: 14, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M38 77h56', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 100, cy: 78, r: 22, ...SW(7) }, 'blue', { stroke: true }),
    s('path', { d: 'M116 94l22 22', ...SW(10) }, 'dark', { stroke: true })
  ],
  estereotipo: [
    s('rect', { x: 68, y: 14, width: 24, height: 22, rx: 8 }, 'brown'),
    s('rect', { x: 40, y: 36, width: 80, height: 18, rx: 4 }, 'red', { accent: true }),
    arrow('M80 62v12M72 68l8 8 8-8', 'orange', 4),
    s('path', { d: busts([36, 80, 124], 136, 30, 30) }, 'gray'),
    s('path', { d: dots([[36, 94], [80, 94], [124, 94]], 11) }, 'gray'),
    s('path', { d: 'M18 136h124', ...SW(4) }, 'dark', { stroke: true })
  ],
  franquista: [
    s('path', { d: 'M24 72q56-44 112 0l-8 18H32z' }, 'green', { accent: true }),
    s('rect', { x: 32, y: 86, width: 96, height: 18, rx: 3 }, 'dark'),
    s('path', { d: 'M32 96h96', ...SW(2) }, 'yellow', { stroke: true }),
    s('path', { d: 'M28 104h104q-12 22-52 22t-52-22z' }, 'black'),
    s('circle', { cx: 80, cy: 70, r: 11 }, 'yellow'),
    s('circle', { cx: 80, cy: 70, r: 5 }, 'red')
  ],
  'hincapié': [
    ground(134),
    s('path', { d: 'M60 20h26v62q22 2 40 18q8 10 4 20H48q-6-32 12-38z' }, 'brown', { accent: true }),
    s('rect', { x: 58, y: 20, width: 30, height: 16 }, 'blue'),
    s('path', { d: 'M48 124h82', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M38 114l-14-8M34 128H18M134 104l10-10M138 122h8', ...SW(4) }, 'orange', { stroke: true })
  ],
  honrado: [
    ground(),
    s('rect', { x: 52, y: 76, width: 56, height: 60, rx: 18 }, 'blue'),
    s('circle', { cx: 80, cy: 50, r: 22 }, 'skin'),
    s('path', { d: dots([[72, 48], [88, 48]], 3) }, 'dark'),
    s('path', { d: 'M72 58q8 6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: heart(70, 94, 12) }, 'red', { accent: true }),
    s('path', { d: 'M104 120q-14-6-24-22', ...SW(8) }, 'skin', { stroke: true })
  ],
  influyente: [
    s('path', { d: 'M80 80L30 100M80 80v18M80 80l50 20', ...SW(3) }, 'gray', { stroke: true }),
    ...person(80, 84, 'purple', { accent: true, h: 36, w: 28 }),
    s('path', { d: busts([30, 80, 130], 140, 22, 22) }, 'blue'),
    s('path', { d: dots([[30, 108], [80, 108], [130, 108]], 9) }, 'skin'),
    s('path', { d: sparkle(108, 30, 9) + sparkle(52, 34, 6) }, 'yellow')
  ],
  intolerancia: [
    backdrop('sky'),
    s('path', { d: 'M58 42h44l-6 86H64z' }, 'white', { accent: true }),
    s('path', { d: 'M58 42h44l-6 86H64z', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 84, r: 54, ...SW(10) }, 'red', { stroke: true }),
    s('path', { d: 'M42 46l76 76', ...SW(10) }, 'red', { stroke: true })
  ],
  investidura: [
    s('rect', { x: 26, y: 104, width: 26, height: 32 }, 'brown'),
    s('rect', { x: 22, y: 96, width: 34, height: 8, rx: 2 }, 'dark'),
    ...person(80, 136, 'navy', { h: 56, w: 40, r: 14 }),
    s('path', { d: 'M64 82l32 46', ...SW(8) }, 'red', { stroke: true }),
    s('circle', { cx: 86, cy: 112, r: 6 }, 'yellow', { accent: true }),
    s('path', { d: 'M98 92l16-26M62 96l-16 0', ...SW(8) }, 'skin', { stroke: true }),
    s('circle', { cx: 116, cy: 60, r: 7 }, 'skin')
  ],
  lienzo: [
    s('path', { d: 'M52 140L72 30M108 140L88 30M80 30v110', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 34, y: 34, width: 92, height: 72 }, 'cream'),
    s('path', { d: 'M38 106V96q20-24 44-10q20-16 40 0v20z' }, 'green', { accent: true }),
    s('circle', { cx: 104, cy: 56, r: 10 }, 'yellow'),
    outline({ x: 34, y: 34, width: 92, height: 72 }, 'tan', 4),
    s('rect', { x: 28, y: 106, width: 104, height: 8, rx: 2 }, 'brown')
  ],
  macedonio: [
    s('rect', { x: 18, y: 36, width: 124, height: 88, rx: 4 }, 'red'),
    s('path', { d: 'M26 42L80 80M134 42L80 80M26 118L80 80M134 118L80 80M80 40v80M24 80h112', ...SW(9, { 'stroke-linecap': 'butt' }) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 18 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 13 }, 'red'),
    s('circle', { cx: 80, cy: 80, r: 10 }, 'yellow')
  ],
  'mandíbula': [
    s('circle', { cx: 80, cy: 62, r: 42 }, 'skin'),
    s('path', { d: 'M40 84q46 4 80 0l-2 6q-4 14-38 14t-38-14z' }, 'dark'),
    s('path', { d: 'M42 96q2 42 38 44q36-2 38-44q-38 14-76 0z' }, 'skin', { accent: true }),
    s('path', { d: 'M42 96q2 42 38 44q36-2 38-44', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: dots([[64, 56], [96, 56]], 5) }, 'dark'),
    s('path', { d: 'M138 92v40M132 100l6-8 6 8M132 124l6 8 6-8', ...SW(4) }, 'orange', { stroke: true })
  ],
  manteca: [
    s('ellipse', { cx: 80, cy: 112, rx: 62, ry: 18 }, 'gray'),
    s('ellipse', { cx: 80, cy: 108, rx: 54, ry: 13 }, 'white'),
    s('path', { d: 'M40 76l20-14h56l-20 14z' }, 'cream'),
    s('path', { d: 'M96 76l20-14v32l-20 14z' }, 'orange'),
    s('rect', { x: 40, y: 76, width: 56, height: 32 }, 'yellow', { accent: true }),
    s('path', { d: 'M110 30l26-14', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 36l-10 6', ...SW(7) }, 'dark', { stroke: true })
  ],
  marxismo: [
    ground(),
    s('path', { d: 'M88 136V98l16 10V98l16 10V64h12v72z' }, 'gray'),
    s('path', { d: ells([[128, 54, 8, 6], [138, 42, 8, 6]]) }, 'gray'),
    s('rect', { x: 24, y: 54, width: 56, height: 78, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M32 54v78', ...SW(4) }, 'dark', { stroke: true }),
    ...gear(56, 92, 11, 8, 'yellow')
  ],
  mensajero: [
    ground(),
    ...lean(76, 136, 15, 'orange', { accent: true }),
    s('rect', { x: 50, y: 104, width: 22, height: 18, rx: 4 }, 'brown'),
    s('path', { d: 'M88 98l16-18', ...SW(7) }, 'skin', { stroke: true }),
    ...paper(102, 60, 32, 22),
    s('path', { d: 'M102 60l16 12 16-12', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M22 80h22M16 96h22M24 112h16', ...SW(4) }, 'gray', { stroke: true })
  ],
  'médula': [
    backdrop('mint'),
    s('path', { d: ells([[42, 58, 16, 16], [42, 102, 16, 16]]) + 'M42 60h78v40H42z' }, 'cream'),
    s('path', { d: ells([[42, 58, 16, 16], [42, 102, 16, 16]]), ...SW(3) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 120, cy: 80, rx: 14, ry: 20 }, 'cream'),
    s('ellipse', { cx: 120, cy: 80, rx: 14, ry: 20, ...SW(3) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 120, cy: 80, rx: 8, ry: 13 }, 'red', { accent: true })
  ],
  originario: [
    s('rect', { x: 14, y: 86, width: 132, height: 60, rx: 4 }, 'brown'),
    s('path', { d: 'M80 86v34M80 100l-18 18M80 104l20 16M80 118l-10 14', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M80 86V50', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 62, -150, 30, 10) + leaflet(80, 54, -30, 30, 10) }, 'green', { accent: true }),
    s('path', { d: 'M124 64q-14-14-14-26a14 14 0 0 1 28 0q0 12-14 26z' }, 'red'),
    s('circle', { cx: 124, cy: 38, r: 5 }, 'white')
  ],
  padecer: [
    s('circle', { cx: 80, cy: 86, r: 44 }, 'skin'),
    s('rect', { x: 42, y: 40, width: 76, height: 18, rx: 9 }, 'sky', { accent: true }),
    s('path', { d: 'M58 80q6 4 12 0M90 80q6 4 12 0M60 110q12-8 24 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[56, 96, 8, 5], [106, 96, 8, 5]]) }, 'pink'),
    s('path', { d: 'M86 108l40-20', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 128, cy: 87, r: 5 }, 'red'),
    s('path', { d: drop(130, 56, 6) }, 'sky')
  ],
  pandemia: [
    s('circle', { cx: 80, cy: 80, r: 40 }, 'blue'),
    s('path', { d: 'M54 60q14-10 22 2q-2 14-14 16q-10-6-8-18zM86 88q14-6 22 6q-4 14-18 14q-8-8-4-20zM80 48q12-6 20 4q-8 6-20-4z' }, 'green'),
    s('path', { d: [[30, 32], [130, 36], [128, 128], [30, 126]].map(([x, y]) => rays(x, y, 8, 14, 8)).join(''), ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: dots([[30, 32], [130, 36], [128, 128], [30, 126]], 9) }, 'red', { accent: true })
  ],
  pandilla: [
    ...person(36, 140, 'red', { h: 40 }),
    ...person(124, 140, 'orange', { h: 42 }),
    ...person(64, 140, 'blue', { accent: true, h: 46 }),
    ...person(96, 140, 'green', { h: 44 }),
    s('path', { d: 'M40 106h80', ...SW(6) }, 'skin', { stroke: true })
  ],
  perjudicial: [
    ground(),
    s('path', { d: 'M48 136l-6-30h40l-6 30z' }, 'orange'),
    s('path', { d: 'M62 106q0-30 18-36', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 70, 100, 24, 8) + leaflet(64, 90, 160, 16, 6) }, 'brown'),
    s('path', { d: 'M104 26h14v12q12 6 12 18v32h-38V56q0-12 12-18z' }, 'purple', { accent: true }),
    s('rect', { x: 102, y: 20, width: 18, height: 8, rx: 2 }, 'dark'),
    s('path', { d: drop(104, 106, 4) + drop(114, 120, 4) }, 'purple')
  ],
  peseta: [
    s('path', { d: ells([[48, 120, 30, 10], [48, 110, 30, 10], [48, 100, 30, 10]]) }, 'orange'),
    s('path', { d: ells([[48, 120, 30, 10], [48, 110, 30, 10], [48, 100, 30, 10]]), ...SW(2) }, 'brown', { stroke: true }),
    s('circle', { cx: 100, cy: 66, r: 38 }, 'yellow', { accent: true }),
    s('circle', { cx: 100, cy: 66, r: 30, ...SW(3) }, 'orange', { stroke: true }),
    s('circle', { cx: 100, cy: 66, r: 9 }, 'white'),
    s('circle', { cx: 100, cy: 66, r: 9, ...SW(3) }, 'orange', { stroke: true })
  ],
  pipa: [
    s('path', { d: 'M90 54q-8-8 0-16t0-16M104 52q-6-6 0-12t0-12', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M20 84h50q10 0 16 10', ...SW(9) }, 'dark', { stroke: true }),
    s('path', { d: 'M78 70h44v34q0 24-22 24t-22-24z' }, 'brown', { accent: true }),
    s('ellipse', { cx: 100, cy: 70, rx: 22, ry: 6 }, 'dark')
  ],
  plebiscito: [
    ...paper(62, 20, 36, 52),
    s('path', { d: 'M70 44l6 6 12-12', ...SW(4) }, 'green', { stroke: true }),
    s('rect', { x: 34, y: 74, width: 92, height: 64, rx: 6 }, 'blue', { accent: true }),
    s('rect', { x: 30, y: 66, width: 100, height: 12, rx: 3 }, 'navy'),
    s('rect', { x: 58, y: 70, width: 44, height: 4, rx: 2 }, 'black')
  ],
  positivamente: [
    s('circle', { cx: 80, cy: 80, r: 50 }, 'green', { accent: true }),
    s('path', { d: 'M80 52v56M52 80h56', ...SW(14) }, 'white', { stroke: true }),
    s('path', { d: sparkle(132, 28, 10) + sparkle(28, 130, 8) }, 'yellow')
  ],
  profundizar: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy', { accent: true }),
    s('rect', { x: 14, y: 14, width: 132, height: 44 }, 'sky'),
    s('rect', { x: 14, y: 58, width: 132, height: 44 }, 'blue'),
    arrow('M80 30v94M64 108l16 16 16-16', 'yellow', 8),
    s('path', { d: ring(110, 76, 5) + ring(118, 60, 4) + ring(46, 96, 5), ...SW(2) }, 'white', { stroke: true })
  ],
  radial: [
    s('path', { d: rays(80, 80, 18, 60, 12), ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: dots(around(80, 80, 60, 12), 6) }, 'red'),
    s('circle', { cx: 80, cy: 80, r: 18 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 8 }, 'orange')
  ],
  redactar: [
    ...paper(24, 18, 86, 120),
    s('path', { d: 'M36 40h62M36 58h62M36 76h62M36 94h30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M76 112l52-52', ...SW(12) }, 'blue', { stroke: true }),
    s('path', { d: 'M74 114l-8 8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: ells([[96, 102, 14, 10]]) }, 'skin', { accent: true })
  ],
  regularidad: [
    s('path', { d: 'M18 70h16V40h20v30h20V40h20v30h20V40h20v30h8', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: dots([[24, 106], [52, 106], [80, 106], [108, 106], [136, 106]], 9) }, 'green', { accent: true }),
    s('path', { d: 'M18 132h124M24 126v12M52 126v12M80 126v12M108 126v12M136 126v12', ...SW(3) }, 'gray', { stroke: true })
  ],
  resonancia: [
    s('path', { d: 'M66 26v52q0 16 14 16t14-16V26', ...SW(9) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 94v38', ...SW(9) }, 'dark', { stroke: true }),
    s('path', { d: 'M50 40q-8 16 0 32M36 32q-14 24 0 48M110 40q8 16 0 32M124 32q14 24 0 48', ...SW(5) }, 'blue', { stroke: true }),
    s('ellipse', { cx: 80, cy: 136, rx: 22, ry: 6 }, 'brown', { accent: true })
  ],
  rodar: [
    s('path', { d: 'M14 60L146 132V140H14z' }, 'green'),
    s('circle', { cx: 97, cy: 80, r: 22 }, 'red', { accent: true }),
    s('path', { d: rays(97, 80, 4, 20, 6, 15), ...SW(3) }, 'white', { stroke: true }),
    arrow('M76 50a28 28 0 0 1 40 0M118 40v12h-12', 'orange', 4),
    s('path', { d: 'M44 50l16 8M36 64l16 8', ...SW(4) }, 'gray', { stroke: true })
  ],
  sacramento: [
    s('path', { d: halfRays(80, 54, 28, 38, 7), ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 54, r: 20 }, 'white'),
    outline({ cx: 80, cy: 54, r: 20 }),
    s('path', { d: 'M48 78h64q0 30-32 34q-32-4-32-34z' }, 'yellow', { accent: true }),
    s('path', { d: 'M76 110h8v16h-8zM56 136q0-10 24-10t24 10z' }, 'orange')
  ],
  sodio: [
    s('path', { d: 'M36 36h88v88H36zM80 36v88M36 80h88', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[36, 36], [124, 36], [80, 80], [36, 124], [124, 124]], 13) }, 'purple', { accent: true }),
    s('path', { d: dots([[80, 36], [36, 80], [124, 80], [80, 124]], 9) }, 'green')
  ],
  sustancial: [
    s('path', { d: 'M30 86q8-42 50-42t50 42z' }, 'cream'),
    s('path', { d: 'M30 86q8-42 50-42t50 42', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: ells([[62, 66, 14, 10], [98, 64, 16, 11]]) }, 'brown'),
    s('path', { d: dots([[80, 52], [114, 78], [46, 78]], 7) }, 'green'),
    s('path', { d: 'M20 84h120q-6 46-60 46t-60-46z' }, 'blue', { accent: true }),
    s('rect', { x: 58, y: 128, width: 44, height: 8, rx: 3 }, 'navy')
  ],
  'tiranía': [
    ground(),
    ...person(104, 136, 'dark', { h: 70, w: 40, r: 16 }),
    s('path', { d: 'M90 34l2-16 8 8 4-10 4 10 8-8 2 16z' }, 'yellow', { accent: true }),
    s('path', { d: 'M86 84l-30 18', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: busts([28, 56], 136, 20, 16) }, 'gray'),
    s('path', { d: dots([[24, 112], [52, 112]], 7) }, 'gray')
  ],
  tolerar: [
    ...face(76, 92, 40, 'skin', 'flat', { accent: true }),
    s('path', { d: 'M18 76l8 6-8 6 8 6M134 98l8 6-8 6 8 6', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: ells([[122, 40, 5, 9], [134, 40, 5, 9]]) }, 'sky'),
    s('ellipse', { cx: 128, cy: 48, rx: 8, ry: 5 }, 'dark'),
    s('path', { d: drop(118, 72, 5) }, 'sky')
  ],
  transversal: [
    s('path', { d: 'M18 50h124M18 110h124', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 140L120 20', ...SW(8) }, 'red', { stroke: true }),
    s('path', { d: 'M76 110a16 16 0 0 0-8-14M112 50a14 14 0 0 1 6-12', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: dots([[60, 110], [100, 50]], 7) }, 'blue', { accent: true })
  ],
  tutor: [
    ground(),
    ...person(58, 136, 'navy', { h: 56, w: 34, r: 14 }),
    ...person(104, 136, 'orange', { h: 34, w: 24, r: 11, accent: true }),
    s('path', { d: 'M72 92q16-6 26 6', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 94, y: 112, width: 22, height: 14, rx: 2 }, 'red')
  ],
  vampiro: [
    s('path', { d: 'M20 140q8-60 60-60t60 60z' }, 'black'),
    s('path', { d: 'M42 94l-18-32 46 26zM118 94l18-32-46 26z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 66, r: 30 }, 'mint'),
    s('path', { d: 'M50 60q0-28 30-28t30 28l-30-12z' }, 'black'),
    s('path', { d: dots([[70, 68], [90, 68]], 4) }, 'red'),
    s('path', { d: 'M68 82h24', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M71 83l3 9 3-9zM83 83l3 9 3-9z' }, 'white')
  ],
  vencedor: [
    s('path', { d: rects([[16, 112, 38, 24], [106, 118, 38, 18]]) }, 'gray'),
    s('rect', { x: 54, y: 96, width: 52, height: 40 }, 'yellow', { accent: true }),
    ...person(80, 96, 'blue', { h: 36, w: 26, r: 11 }),
    s('path', { d: 'M92 66l12-18', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M98 16h22q0 18-11 20q-11-2-11-20zM107 36h4v6h-4zM101 42h16v4h-16z' }, 'orange')
  ],
  veracidad: [
    s('path', { d: bubble(28, 20, 112, 82) }, 'sky', { accent: true }),
    s('path', { d: 'M56 60l18 18 36-36', ...SW(12) }, 'green', { stroke: true }),
    s('path', { d: busts([36], 148, 26, 18) }, 'blue'),
    s('circle', { cx: 36, cy: 120, r: 9 }, 'skin')
  ],
  'absorción': [
    s('path', { d: drop(50, 40, 7) + drop(80, 28, 8) + drop(110, 40, 7) }, 'blue'),
    arrow('M50 56v14M80 46v24M110 56v14', 'sky', 4),
    s('rect', { x: 30, y: 80, width: 100, height: 52, rx: 8 }, 'yellow', { accent: true }),
    s('rect', { x: 30, y: 80, width: 100, height: 16, rx: 8 }, 'sky'),
    s('path', { d: dots([[48, 108], [70, 118], [94, 104], [112, 120], [58, 124], [120, 104]], 4) }, 'orange')
  ],
  'acompañamiento': [
    s('circle', { cx: 62, cy: 78, r: 46 }, 'gray'),
    s('circle', { cx: 62, cy: 78, r: 38 }, 'white'),
    s('path', { d: 'M36 82q0-24 28-24t26 18q0 16-28 16t-26-10z' }, 'brown', { accent: true }),
    s('circle', { cx: 116, cy: 116, r: 26 }, 'blue'),
    s('path', { d: dots([[106, 110], [122, 106], [116, 122], [104, 122], [128, 118]], 7) }, 'green'),
    s('path', { d: 'M110 106l4-10M126 104l2-10', ...SW(4) }, 'yellow', { stroke: true })
  ],
  'anticipación': [
    s('circle', { cx: 64, cy: 80, r: 46 }, 'white'),
    s('circle', { cx: 64, cy: 80, r: 46, ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M64 50v30l18 12', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M110 60l18 20-18 20zM126 60l18 20-18 20z' }, 'orange', { accent: true })
  ],
  'apóstol': [
    s('circle', { cx: 80, cy: 42, r: 24, ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M56 136l8-70h32l8 70z' }, 'brown', { accent: true }),
    s('path', { d: 'M118 26v112', ...SW(5) }, 'tan', { stroke: true }),
    s('circle', { cx: 80, cy: 48, r: 15 }, 'skin'),
    s('path', { d: 'M67 52q13 24 26 0z' }, 'gray'),
    s('path', { d: 'M100 90h18', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 38, y: 92, width: 30, height: 12, rx: 6 }, 'cream'),
    s('rect', { x: 38, y: 92, width: 30, height: 12, rx: 6, ...SW(2) }, 'tan', { stroke: true })
  ],
  arca: [
    s('path', { d: 'M128 92V52', ...SW(6) }, 'yellow', { stroke: true }),
    s('ellipse', { cx: 134, cy: 48, rx: 9, ry: 5 }, 'yellow'),
    s('path', { d: 'M18 92h124l-16 36H34z' }, 'brown', { accent: true }),
    s('path', { d: 'M22 102h116', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 44, y: 62, width: 68, height: 30 }, 'tan'),
    s('path', { d: 'M38 64l40-22 40 22z' }, 'red'),
    s('path', { d: 'M56 72h10v10H56zM90 72h10v10H90z' }, 'dark'),
    s('path', { d: 'M14 130q16-8 33 0t33 0 33 0 33 0v16H14z' }, 'blue')
  ],
  'arqueología': [
    s('rect', { x: 14, y: 70, width: 132, height: 76, rx: 4 }, 'tan'),
    s('path', { d: 'M14 70h132', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M50 112q-4-24 16-30h28q20 6 16 30q-6 24-30 24t-30-24z' }, 'orange', { accent: true }),
    s('path', { d: 'M56 104h48', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: dots([[28, 90], [128, 120], [30, 128], [124, 86]], 4) }, 'brown'),
    s('path', { d: 'M122 22l-28 34', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M90 52l-12 14 10 8 12-14z' }, 'yellow')
  ],
  arriesgar: [
    s('rect', { x: 14, y: 118, width: 132, height: 28, rx: 4 }, 'blue'),
    s('path', { d: 'M40 118l8-12 6 12zM104 118l8-12 6 12z' }, 'dark'),
    s('path', { d: rects([[14, 80, 10, 38], [136, 80, 10, 38]]) }, 'brown'),
    s('path', { d: 'M14 80h132', ...SW(3) }, 'dark', { stroke: true }),
    ...person(80, 80, 'red', { accent: true, h: 30, w: 22, r: 10 }),
    s('path', { d: 'M28 50l104-10', ...SW(4) }, 'gray', { stroke: true })
  ],
  'articulación': [
    s('path', { d: 'M28 120L72 84M90 76l40-44', ...SW(16) }, 'tan', { stroke: true }),
    s('path', { d: dots([[22, 120], [30, 130], [128, 26], [138, 34]], 9) }, 'tan'),
    s('circle', { cx: 80, cy: 80, r: 18 }, 'red', { accent: true }),
    arrow('M46 64q8-24 30-28M68 30l8 6-6 8', 'orange', 4)
  ],
  barril: [
    s('path', { d: 'M44 24h72q12 56 0 112H44q-12-56 0-112z' }, 'brown', { accent: true }),
    s('path', { d: 'M62 24q-6 56 0 112M80 24v112M98 24q6 56 0 112', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M42 42h76M38 80h84M42 118h76', ...SW(6) }, 'gray', { stroke: true })
  ],
  'bóveda': [
    ground(),
    s('path', { d: 'M36 136V78a44 44 0 0 1 88 0v58z' }, 'navy', { accent: true }),
    s('path', { d: 'M30 136V78a50 50 0 0 1 100 0v58', ...SW(12) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 22v12M41 39l9 9M119 39l-9 9M24 78h12M136 78h-12M24 108h12M136 108h-12', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 34v30', ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 68, r: 6 }, 'yellow')
  ],
  'calefacción': [
    s('path', { d: 'M46 18q-8 10 0 20t0 20M80 18q-8 10 0 20t0 20M114 18q-8 10 0 20t0 20', ...SW(5) }, 'red', { stroke: true }),
    s('rect', { x: 26, y: 68, width: 108, height: 64, rx: 6 }, 'gray'),
    s('path', { d: rects([[32, 70, 14, 60], [52, 70, 14, 60], [72, 70, 14, 60], [92, 70, 14, 60], [112, 70, 14, 60]]) }, 'orange', { accent: true }),
    s('path', { d: 'M40 132v8M120 132v8', ...SW(5) }, 'dark', { stroke: true })
  ],
  caminata: [
    s('path', { d: 'M14 128l36-56 26 30 22-24 48 50z' }, 'mint'),
    ground(),
    ...lean(78, 136, 8, 'green', { accent: true }),
    s('rect', { x: 52, y: 90, width: 18, height: 30, rx: 5 }, 'orange'),
    s('path', { d: 'M100 96l10 40', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M90 102l10-4', ...SW(6) }, 'skin', { stroke: true })
  ],
  canela: [
    s('path', { d: ells([[80, 132, 44, 8]]) }, 'tan'),
    s('rect', { x: 26, y: 60, width: 108, height: 20, rx: 6, transform: 'rotate(-12 80 70)' }, 'brown', { accent: true }),
    s('rect', { x: 26, y: 88, width: 108, height: 20, rx: 6, transform: 'rotate(-12 80 98)' }, 'brown'),
    s('path', { d: ells([[28, 81, 6, 10], [28, 109, 6, 10]]) }, 'tan'),
    s('path', { d: 'M28 81m-3 0a3 4 0 1 0 6 0M28 109m-3 0a3 4 0 1 0 6 0', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M64 58l6 60M94 52l6 60', ...SW(4) }, 'red', { stroke: true })
  ],
  cano: [
    backdrop('sky'),
    s('path', { d: busts([80], 146, 70, 34) }, 'purple'),
    s('path', { d: ells([[80, 64, 40, 36]]) }, 'white'),
    s('circle', { cx: 80, cy: 76, r: 30 }, 'skin', { accent: true }),
    s('path', { d: 'M50 66q30-34 60 0q-10-16-30-16t-30 16z' }, 'white'),
    s('path', { d: dots([[70, 78], [90, 78]], 3) }, 'dark'),
    s('path', { d: 'M70 92q10 6 20 0M62 70h12M86 70h12', ...SW(3) }, 'dark', { stroke: true })
  ],
  casita: [
    ground(),
    s('path', { d: 'M118 136V64', ...SW(8) }, 'brown', { stroke: true }),
    s('circle', { cx: 118, cy: 52, r: 28 }, 'green'),
    s('rect', { x: 32, y: 100, width: 50, height: 36 }, 'yellow', { accent: true }),
    s('path', { d: 'M26 102l31-26 31 26z' }, 'red'),
    s('rect', { x: 50, y: 116, width: 14, height: 20, rx: 6 }, 'brown')
  ],
  cha: [
    s('ellipse', { cx: 76, cy: 128, rx: 54, ry: 10 }, 'gray'),
    s('path', { d: 'M58 54q-6-8 0-16t0-16', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M114 80q20-2 18 14t-22 14', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M36 70h80q0 56-40 56t-40-56z' }, 'green', { accent: true }),
    s('ellipse', { cx: 76, cy: 70, rx: 40, ry: 8 }, 'brown'),
    s('path', { d: 'M94 70l12-40', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 100, y: 20, width: 14, height: 12, rx: 2 }, 'orange')
  ],
  chorro: [
    s('path', { d: 'M14 122q30 0 40-16', ...SW(9) }, 'green', { stroke: true }),
    s('rect', { x: 48, y: 92, width: 22, height: 14, rx: 3, transform: 'rotate(-40 58 99)' }, 'yellow', { accent: true }),
    s('path', { d: 'M66 88q40-60 74 30', ...SW(10) }, 'sky', { stroke: true }),
    s('path', { d: drop(128, 104, 4) + drop(142, 96, 3) + drop(118, 84, 3) }, 'blue'),
    s('ellipse', { cx: 136, cy: 136, rx: 12, ry: 4 }, 'sky')
  ],
  clemente: [
    s('path', { d: heart(80, 62, 30) }, 'pink', { accent: true }),
    s('path', { d: sparkle(122, 30, 8) + sparkle(38, 34, 6) }, 'yellow'),
    ground(),
    s('path', { d: 'M40 124h56', ...SW(7) }, 'brown', { stroke: true }),
    s('rect', { x: 96, y: 108, width: 20, height: 28, rx: 4 }, 'dark')
  ],
  confluencia: [
    backdrop('mint'),
    s('path', { d: 'M32 14q10 40 48 64M128 14q-10 40-48 64', ...SW(16) }, 'blue', { stroke: true }),
    s('path', { d: 'M80 74q-6 36 0 72', ...SW(26, { 'stroke-linecap': 'butt' }) }, 'blue', { stroke: true }),
    s('path', { d: dots([[30, 100], [126, 104], [80, 32], [40, 64], [120, 66]], 8) }, 'green', { accent: true })
  ],
  consultor: [
    s('path', { d: 'M111 80v56', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 80, y: 30, width: 62, height: 50, rx: 3 }, 'white'),
    outline({ x: 80, y: 30, width: 62, height: 50, rx: 3 }),
    s('path', { d: 'M90 70l14-14 12 8 18-20', ...SW(4) }, 'green', { stroke: true }),
    ...person(44, 136, 'navy', { h: 50, r: 13 }),
    s('path', { d: 'M44 86l-4 14 4 6 4-6z' }, 'red', { accent: true }),
    s('path', { d: 'M58 96l26-22', ...SW(6) }, 'skin', { stroke: true })
  ],
  contrarrestar: [
    s('path', { d: poly([[14, 64], [48, 64], [48, 48], [76, 80], [48, 112], [48, 96], [14, 96]]) }, 'red', { accent: true }),
    s('path', { d: poly([[146, 64], [112, 64], [112, 48], [84, 80], [112, 112], [112, 96], [146, 96]]) }, 'blue'),
    s('path', { d: burst(80, 80, 18, 8, 8) }, 'yellow')
  ],
  determinante: [
    s('rect', { x: 28, y: 108, width: 104, height: 28, rx: 6 }, 'gray'),
    s('ellipse', { cx: 80, cy: 108, rx: 36, ry: 10 }, 'dark'),
    s('path', { d: 'M50 108V94a30 10 0 0 1 60 0v14a30 10 0 0 1-60 0z' }, 'red', { accent: true }),
    s('path', { d: 'M80 34v48', ...SW(14) }, 'skin', { stroke: true }),
    s('path', { d: ells([[80, 28, 20, 14]]) }, 'skin'),
    s('path', { d: 'M46 76l-12-6M114 76l12-6M40 92H26M120 92h14', ...SW(4) }, 'orange', { stroke: true })
  ],
  detestar: [
    ...face(62, 80, 40, 'mint', 'frown', { accent: true }),
    s('path', { d: 'M34 56l20 8M90 56l-20 8', ...SW(4) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 62, cy: 108, rx: 7, ry: 8 }, 'pink'),
    s('path', { d: 'M124 136v-32', ...SW(8) }, 'green', { stroke: true }),
    s('path', { d: dots([[114, 100], [134, 100], [124, 88]], 12) }, 'green')
  ],
  dialecto: [
    s('path', { d: bubble(14, 18, 62, 50) }, 'orange', { accent: true }),
    s('path', { d: bubble(84, 18, 62, 50) }, 'green'),
    s('path', { d: 'M24 40q6-8 12 0t12 0 12 0', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M94 38l6 8 6-8 6 8 6-8 6 8 6-8', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: busts([36, 124], 146, 34, 30) }, 'blue'),
    s('path', { d: dots([[36, 104], [124, 104]], 13) }, 'skin')
  ],
  'dinámico': [
    s('ellipse', { cx: 80, cy: 140, rx: 28, ry: 5 }, 'gray'),
    s('path', { d: 'M68 56L46 34M92 56l22-22', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M72 88l-18 24M88 88l22 16', ...SW(8) }, 'navy', { stroke: true }),
    s('circle', { cx: 80, cy: 34, r: 13 }, 'skin'),
    s('rect', { x: 66, y: 50, width: 28, height: 40, rx: 10 }, 'orange', { accent: true }),
    s('path', { d: 'M30 60l-10 6M130 60l10 6M36 120l-12 8M128 122l12 4', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: sparkle(36, 30, 8) + sparkle(126, 92, 7) }, 'yellow')
  ],
  'emigración': [
    ground(),
    s('rect', { x: 20, y: 98, width: 36, height: 38 }, 'tan'),
    s('path', { d: 'M14 100l24-22 24 22z' }, 'red'),
    ...person(80, 136, 'blue', { accent: true, h: 40 }),
    s('rect', { x: 96, y: 110, width: 20, height: 24, rx: 3 }, 'brown'),
    s('path', { d: jet(124, 46), transform: 'rotate(45 124 46)' }, 'gray'),
    arrow('M58 58q24-26 48-22', 'orange', 4)
  ],
  empleador: [
    ...person(54, 112, 'navy', { h: 40, r: 13 }),
    s('path', { d: 'M54 72l-4 14 4 6 4-6z' }, 'red'),
    s('rect', { x: 16, y: 108, width: 88, height: 30, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: busts([124], 140, 32, 34) }, 'green'),
    s('circle', { cx: 124, cy: 92, r: 13 }, 'skin'),
    s('rect', { x: 126, y: 116, width: 10, height: 12, rx: 2 }, 'white')
  ],
  'evasión': [
    s('rect', { x: 14, y: 66, width: 66, height: 70 }, 'gray'),
    s('path', { d: 'M14 88h66M14 112h66M36 66v22M58 88v24M36 112v24', ...SW(3) }, 'dark', { stroke: true }),
    ground(),
    ...lean(112, 136, 22, 'orange', { accent: true }),
    s('path', { d: 'M86 70l-14 2M90 86l-16 4M92 102l-14 4', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 32, cy: 34, r: 12 }, 'yellow')
  ],
  excesivamente: [
    s('path', { d: 'M50 34h60l-8 92H58z' }, 'sky'),
    s('path', { d: 'M46 34q34-18 68 0z' }, 'blue', { accent: true }),
    s('path', { d: 'M50 34h60l-8 92H58z', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 34q-8 30-6 64M112 34q8 40 4 70', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: ells([[40, 132, 20, 6], [120, 134, 22, 6]]) }, 'blue')
  ],
  'explícitamente': [
    s('path', { d: 'M66 22h28l42 76H24z' }, 'cream'),
    s('rect', { x: 60, y: 14, width: 40, height: 12, rx: 4 }, 'dark'),
    s('path', { d: bubble(32, 60, 96, 60) }, 'blue', { accent: true }),
    s('path', { d: 'M48 80h64M48 98h40', ...SW(7) }, 'white', { stroke: true })
  ],
  expulsar: [
    s('rect', { x: 72, y: 18, width: 38, height: 56, rx: 4, transform: 'rotate(10 91 46)' }, 'red', { accent: true }),
    s('path', { d: 'M90 140V98', ...SW(18) }, 'black', { stroke: true }),
    s('rect', { x: 76, y: 68, width: 28, height: 32, rx: 10 }, 'skin'),
    s('path', { d: 'M52 40l-12-6M48 58H32M126 30l12-8M130 52h14', ...SW(4) }, 'orange', { stroke: true })
  ],
  'formulación': [
    s('path', { d: 'M52 24h16v34l30 62q4 12-10 12H32q-14 0-10-12l30-62z' }, 'white'),
    s('path', { d: 'M38 96h44l14 26q2 10-10 10H34q-12 0-10-10z' }, 'purple', { accent: true }),
    s('path', { d: 'M52 24h16v34l30 62q4 12-10 12H32q-14 0-10-12l30-62zM46 24h28', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[54, 82], [64, 70], [58, 110]], 4) }, 'purple'),
    ...paper(104, 30, 38, 50),
    s('path', { d: 'M112 44h22M112 56h22M112 68h14', ...SW(3) }, 'gray', { stroke: true })
  ],
  fronterizo: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 118h104', ...DASH(3, '10 8') }, 'gray', { stroke: true }),
    s('rect', { x: 26, y: 70, width: 14, height: 66 }, 'dark'),
    s('rect', { x: 26, y: 70, width: 118, height: 14, rx: 3 }, 'white'),
    s('path', { d: rects([[40, 70, 16, 14], [72, 70, 16, 14], [104, 70, 16, 14], [136, 70, 8, 14]]) }, 'red', { accent: true }),
    outline({ x: 26, y: 70, width: 118, height: 14, rx: 3 }),
    s('circle', { cx: 33, cy: 77, r: 4 }, 'gray')
  ],
  herir: [
    s('rect', { x: 14, y: 64, width: 118, height: 40, rx: 20 }, 'skin'),
    s('ellipse', { cx: 134, cy: 84, rx: 12, ry: 18 }, 'skin'),
    s('path', { d: 'M44 74l20 16M54 70l16 14', ...SW(3) }, 'red', { stroke: true }),
    s('rect', { x: 80, y: 60, width: 22, height: 48, rx: 6, transform: 'rotate(30 91 84)' }, 'tan', { accent: true }),
    s('path', { d: dots([[87, 80], [95, 88], [89, 90]], 2) }, 'brown'),
    s('path', { d: drop(56, 118, 5) }, 'red')
  ],
  hormona: [
    s('path', { d: [poly(around(44, 100, 20, 6, -90)), poly(around(78.6, 100, 20, 6, -90)), poly(around(61.3, 70, 20, 6, -90)), poly(around(98, 66, 18, 5, -90))].join(''), ...SW(5) }, 'purple', { stroke: true }),
    s('path', { d: dots([[44, 80], [26.7, 110], [96, 120], [111, 52]], 6) }, 'red'),
    s('path', { d: drop(126, 110, 10) }, 'pink', { accent: true })
  ],
  hurtar: [
    ground(),
    s('path', { d: 'M100 136q-12-30 8-46q-4-10 6-10t6 10q20 16 8 46z' }, 'brown', { accent: true }),
    ...lean(64, 136, 10, 'dark'),
    s('path', { d: 'M64 76h24', ...SW(6) }, 'black', { stroke: true }),
    s('path', { d: 'M62 70q12-18 26 0z' }, 'black'),
    s('path', { d: 'M78 98l26-8', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(116, 60, 8) }, 'yellow')
  ],
  icono: [
    s('rect', { x: 40, y: 14, width: 80, height: 132, rx: 12 }, 'dark'),
    s('rect', { x: 46, y: 24, width: 68, height: 108, rx: 4 }, 'sky'),
    s('rect', { x: 52, y: 32, width: 24, height: 24, rx: 6 }, 'red', { accent: true }),
    s('rect', { x: 84, y: 32, width: 24, height: 24, rx: 6 }, 'yellow'),
    s('rect', { x: 52, y: 64, width: 24, height: 24, rx: 6 }, 'green'),
    s('rect', { x: 84, y: 64, width: 24, height: 24, rx: 6 }, 'purple'),
    s('rect', { x: 52, y: 96, width: 24, height: 24, rx: 6 }, 'orange')
  ],
  ilustre: [
    s('rect', { x: 46, y: 104, width: 68, height: 30, rx: 2 }, 'gray'),
    s('rect', { x: 40, y: 132, width: 80, height: 8, rx: 2 }, 'dark'),
    s('path', { d: busts([80], 104, 50, 30) }, 'tan'),
    s('circle', { cx: 80, cy: 58, r: 18 }, 'tan'),
    s('path', { d: laurel(80, 62, 32) }, 'green', { accent: true }),
    s('path', { d: sparkle(124, 30, 8) }, 'yellow')
  ],
  innecesario: [
    s('path', { d: rays(36, 36, 18, 26, 8), ...SW(4) }, 'orange', { stroke: true }),
    s('circle', { cx: 36, cy: 36, r: 14 }, 'yellow'),
    ground(),
    ...person(84, 136, 'green'),
    s('path', { d: 'M104 62v40', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 62q40-42 80 0z' }, 'red', { accent: true }),
    s('path', { d: 'M98 102h6', ...SW(6) }, 'skin', { stroke: true })
  ],
  insignificante: [
    s('circle', { cx: 68, cy: 70, r: 38 }, 'sky'),
    s('circle', { cx: 68, cy: 70, r: 40, ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M98 100l32 32', ...SW(12) }, 'brown', { stroke: true }),
    s('circle', { cx: 68, cy: 74, r: 3 }, 'red', { accent: true })
  ],
  'intuición': [
    s('circle', { cx: 80, cy: 98, r: 40 }, 'skin'),
    s('path', { d: 'M62 94q6 4 12 0M86 94q6 4 12 0M70 116q10 6 20 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 56q-6-6 0-10t0-10', ...SW(3) }, 'purple', { stroke: true }),
    s('path', { d: star(80, 26, 13) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(44, 42, 7) + sparkle(118, 46, 7) }, 'purple')
  ],
  jefatura: [
    ground(),
    s('path', { d: rects([[18, 96, 28, 40], [114, 104, 28, 32]]) }, 'gray'),
    s('rect', { x: 54, y: 46, width: 52, height: 90 }, 'navy', { accent: true }),
    s('path', { d: grid(62, 56, 3, 5, 8, 10, 14, 15) }, 'yellow'),
    s('path', { d: 'M80 46V18', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 18h20l-6 7 6 7H80z' }, 'red')
  ],
  linear: [
    s('path', { d: 'M24 20v116h120', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 128L140 28', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: dots([[46, 112], [74, 87], [102, 62], [130, 37]], 7) }, 'red', { accent: true })
  ],
  oponente: [
    ground(),
    ...person(34, 136, 'red', { accent: true }),
    ...person(126, 136, 'blue'),
    s('path', { d: 'M49 96h14M111 96H97', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 66, cy: 96, r: 9 }, 'red'),
    s('circle', { cx: 94, cy: 96, r: 9 }, 'blue'),
    s('path', { d: 'M84 46l-10 16h12l-10 16', ...SW(4) }, 'orange', { stroke: true })
  ],
  ordenamiento: [
    s('rect', { x: 20, y: 22, width: 120, height: 116, rx: 4 }, 'brown'),
    s('path', { d: rects([[28, 30, 104, 46], [28, 84, 104, 46]]) }, 'cream'),
    s('path', { d: rects([[32, 56, 12, 20], [46, 50, 12, 26], [60, 44, 12, 32], [74, 38, 12, 38]]) }, 'blue', { accent: true }),
    s('path', { d: rects([[90, 56, 12, 20], [104, 48, 12, 28], [118, 40, 12, 36]]) }, 'red'),
    s('path', { d: rects([[32, 100, 30, 30], [64, 100, 30, 30], [96, 100, 30, 30]]) }, 'green'),
    s('path', { d: 'M40 108h14M72 108h14M104 108h14', ...SW(4) }, 'white', { stroke: true })
  ],
  'pañal': [
    backdrop('pink'),
    s('path', { d: 'M24 40h112v22q-26 6-34 34t-22 30q-14-4-22-30t-34-34z' }, 'white', { accent: true }),
    s('path', { d: 'M24 40h112v22q-26 6-34 34t-22 30q-14-4-22-30t-34-34z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: rects([[24, 42, 16, 14], [120, 42, 16, 14]]) }, 'sky'),
    s('path', { d: 'M44 54q36 10 72 0', ...SW(3) }, 'sky', { stroke: true })
  ],
  'periodístico': [
    ...paper(20, 28, 104, 104),
    s('rect', { x: 30, y: 38, width: 84, height: 14 }, 'dark'),
    s('rect', { x: 30, y: 60, width: 38, height: 32 }, 'sky', { accent: true }),
    s('path', { d: 'M76 64h38M76 76h38M76 88h38M30 104h84M30 118h84', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M132 120V90', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 124, y: 64, width: 16, height: 28, rx: 8 }, 'red')
  ],
  plantar: [
    s('path', { d: 'M14 112q66-20 132 0v34H14z' }, 'brown'),
    s('path', { d: 'M80 106V72', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 82, -150, 24, 9) + leaflet(80, 76, -30, 24, 9) }, 'green', { accent: true }),
    s('path', { d: ells([[54, 106, 14, 9], [106, 106, 14, 9]]) }, 'skin'),
    s('path', { d: 'M124 22l-14 26', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M104 46l12 6-6 18-10-4z' }, 'gray')
  ],
  'polémico': [
    s('path', { d: bubble(14, 18, 66, 50) }, 'red', { accent: true }),
    s('path', { d: bubble(14, 40, 66, 50), transform: 'translate(160 0) scale(-1 1)' }, 'blue'),
    s('path', { d: 'M84 50l-10 18h14l-10 20', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M28 40l10 6M38 36l-4 12M118 66l10 6M128 62l-4 12', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: busts([30, 130], 146, 26, 22) }, 'gray'),
    s('path', { d: dots([[30, 116], [130, 116]], 9) }, 'skin')
  ],
  porte: [
    ground(132),
    s('rect', { x: 20, y: 66, width: 72, height: 64, rx: 3 }, 'tan'),
    s('path', { d: 'M20 86h72M56 66v20', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: ells([[118, 120, 22, 8], [118, 110, 22, 8], [118, 100, 22, 8]]) }, 'yellow', { accent: true }),
    s('path', { d: ells([[118, 120, 22, 8], [118, 110, 22, 8], [118, 100, 22, 8]]), ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M100 34h20l20 20-16 16-24-24z' }, 'orange'),
    s('circle', { cx: 108, cy: 42, r: 4 }, 'white')
  ],
  progresivamente: [
    s('path', { d: 'M18 136V112h28V88h28V64h28V40h28v96z' }, 'blue', { accent: true }),
    ...person(88, 64, 'orange', { h: 24, w: 16, r: 8 }),
    arrow('M22 92l36-36M44 54h14v14', 'green', 4)
  ],
  'proposición': [
    ...lady(112, 136, 'pink'),
    s('circle', { cx: 48, cy: 80, r: 12 }, 'skin'),
    s('rect', { x: 34, y: 94, width: 28, height: 28, rx: 9 }, 'blue'),
    s('path', { d: 'M44 124h22v12', ...SW(9) }, 'navy', { stroke: true }),
    s('path', { d: 'M60 104h14', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 72, y: 96, width: 16, height: 12, rx: 2 }, 'red'),
    s('circle', { cx: 80, cy: 90, r: 5, ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: heart(84, 40, 12) }, 'red', { accent: true })
  ],
  rastrear: [
    s('path', { d: ells([[26, 132, 6, 10], [42, 118, 6, 10], [52, 100, 6, 10], [70, 92, 6, 10]]) }, 'brown'),
    s('circle', { cx: 102, cy: 56, r: 26 }, 'sky'),
    s('path', { d: ells([[98, 58, 8, 13]]) }, 'brown', { accent: true }),
    s('circle', { cx: 102, cy: 56, r: 28, ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M122 76l20 22', ...SW(10) }, 'dark', { stroke: true })
  ],
  recital: [
    s('path', { d: 'M54 34l-14 100h80L106 34z' }, 'cream'),
    s('path', { d: 'M14 14h132v14H14zM14 28h28q-8 50 0 102H14zM146 28h-28q8 50 0 102h28z' }, 'red', { accent: true }),
    s('rect', { x: 14, y: 130, width: 132, height: 16 }, 'brown'),
    ...person(80, 130, 'purple', { h: 40 }),
    s('path', { d: 'M94 106l6-18', ...SW(5) }, 'skin', { stroke: true }),
    s('circle', { cx: 100, cy: 84, r: 5 }, 'dark'),
    ...note(108, 66, 'navy')
  ],
  'reestructuración': [
    ground(132),
    s('path', { d: rects([[24, 100, 30, 32], [58, 100, 30, 32]]) }, 'blue'),
    s('rect', { x: 92, y: 100, width: 30, height: 32 }, 'orange', { accent: true }),
    s('rect', { x: 92, y: 50, width: 30, height: 30, transform: 'rotate(20 107 65)' }, 'green'),
    arrow('M44 88q4-40 40-48M74 32l10 8-8 10', 'orange', 5)
  ],
  resistente: [
    s('path', { d: 'M80 20l44 16v36q0 42-44 64q-44-22-44-64V36z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 34l30 11v26q0 30-30 48q-30-18-30-48V45z' }, 'sky'),
    s('path', { d: 'M14 52l18 10M14 100l18-6M146 52l-18 10M146 100l-18-6', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: sparkle(34, 64, 8) + sparkle(36, 92, 7) + sparkle(126, 64, 8) + sparkle(124, 92, 7) }, 'yellow')
  ],
  secuela: [
    ground(),
    ...person(66, 136, 'blue'),
    s('path', { d: 'M54 72h24', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M52 102h28v14H52z' }, 'white'),
    s('rect', { x: 58, y: 118, width: 14, height: 18, rx: 3 }, 'cream', { accent: true }),
    s('path', { d: 'M100 92v44M92 92h16', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M82 102h16', ...SW(6) }, 'skin', { stroke: true })
  ],
  'simulación': [
    s('path', { d: busts([60], 146, 60, 40) }, 'green'),
    s('circle', { cx: 60, cy: 82, r: 24 }, 'skin'),
    s('path', { d: 'M36 72q24-30 48 0', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 32, y: 68, width: 56, height: 22, rx: 8 }, 'dark', { accent: true }),
    s('path', { d: 'M100 46h30v30h-30zM112 34h30v30M100 46l12-12M130 46l12-12M130 76l12-12', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M90 76l6-4M92 88l8 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  someter: [
    s('path', { d: 'M24 112h112l-10 24H34z' }, 'gray'),
    s('rect', { x: 24, y: 104, width: 112, height: 8, rx: 2 }, 'dark', { accent: true }),
    ...paper(56, 34, 48, 64),
    s('path', { d: 'M64 50h32M64 62h32M64 74h22', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[56, 42, 14, 10]]) }, 'skin'),
    arrow('M124 40v50M116 82l8 8 8-8', 'orange', 5)
  ],
  suspiro: [
    s('circle', { cx: 62, cy: 82, r: 40 }, 'skin', { accent: true }),
    s('path', { d: 'M42 78q6 6 12 0M68 78q6 6 12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 74, cy: 102, r: 5 }, 'dark'),
    s('path', { d: 'M84 102h14', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: ells([[114, 96, 14, 10], [134, 84, 10, 8]]) }, 'sky')
  ],
  sustentable: [
    s('path', { d: [-80, 40, 160].map(a => { const [p, q] = [around(80, 80, 56, 1, a)[0], around(80, 80, 56, 1, a + 90)[0]]; return `M${p[0]} ${p[1]}A56 56 0 0 1 ${q[0]} ${q[1]}`; }).join(''), ...SW(7) }, 'blue', { stroke: true }),
    s('path', { d: [-80, 40, 160].map(a => poly([around(80, 80, 56, 1, a + 106)[0], around(80, 80, 44, 1, a + 90)[0], around(80, 80, 68, 1, a + 90)[0]])).join('') }, 'blue'),
    s('path', { d: leaflet(56, 104, -45, 64, 18) }, 'green', { accent: true }),
    s('path', { d: 'M56 104l30-30', ...SW(3) }, 'mint', { stroke: true })
  ],
  sustituto: [
    ...person(40, 136, 'red'),
    ...person(120, 136, 'green', { accent: true }),
    arrow('M60 58h40M90 48l10 10-10 10', 'green', 6),
    arrow('M100 100H60M70 90l-10 10 10 10', 'red', 6)
  ],
  tenor: [
    ...person(80, 140, 'black', { h: 56, w: 44, r: 20 }),
    s('path', { d: 'M68 84h24l-12 30z' }, 'white'),
    s('path', { d: 'M70 82l10 6 10-6v12l-10-6-10 6z' }, 'red', { accent: true }),
    s('ellipse', { cx: 80, cy: 70, rx: 7, ry: 9 }, 'dark'),
    s('path', { d: dots([[72, 54], [88, 54]], 3) }, 'dark'),
    ...note(116, 50, 'orange'),
    ...note(26, 60, 'purple')
  ],
  transferir: [
    ground(),
    s('path', { d: 'M14 70l24-16 24 16zM18 74h40v6H18zM20 82h6v40h-6zM35 82h6v40h-6zM50 82h6v40h-6zM16 124h44v12H16z' }, 'gray'),
    s('path', { d: 'M14 70l24-16 24 16zM18 74h40v6H18zM20 82h6v40h-6zM35 82h6v40h-6zM50 82h6v40h-6zM16 124h44v12H16z', transform: 'translate(84 0)' }, 'blue'),
    arrow('M44 42q36-30 72 0M106 30l10 12-14 2', 'orange', 4),
    s('circle', { cx: 80, cy: 28, r: 12 }, 'yellow', { accent: true })
  ],
  tutela: [
    s('path', { d: 'M40 50q40-34 80 0', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: heart(80, 30, 8) }, 'pink'),
    ...person(80, 116, 'orange', { accent: true, h: 30, w: 22, r: 10 }),
    s('path', { d: 'M20 84q0 54 60 54t60-54q-10 0-14 10q-8 28-46 28t-46-28q-4-10-14-10z' }, 'skin')
  ],
  vacante: [
    ground(),
    s('rect', { x: 52, y: 40, width: 44, height: 48, rx: 10 }, 'blue', { accent: true }),
    s('rect', { x: 46, y: 88, width: 56, height: 12, rx: 5 }, 'navy'),
    s('path', { d: 'M74 100v24M54 134l20-10 20 10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 26a10 10 0 1 0 20 0a10 10 0 1 0-20 0M60 84V56q0-10 14-10t14 10v28', ...DASH(3, '5 5') }, 'gray', { stroke: true }),
    s('path', { d: 'M112 40l8-8 8 8', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 104, y: 40, width: 32, height: 22, rx: 3 }, 'yellow')
  ],
  vulnerabilidad: [
    s('ellipse', { cx: 80, cy: 138, rx: 40, ry: 6 }, 'gray'),
    s('path', { d: 'M80 20c26 0 42 42 42 72s-18 44-42 44-42-14-42-44 16-72 42-72z' }, 'cream', { accent: true }),
    s('path', { d: 'M80 20c26 0 42 42 42 72s-18 44-42 44-42-14-42-44 16-72 42-72z', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M64 50l12 14-8 12 14 14-6 12', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: drop(122, 40, 5) + drop(36, 52, 4) }, 'sky')
  ],
  abundar: [
    s('path', { d: dots([[60, 48], [68, 40], [52, 40], [60, 32], [76, 48]], 7) }, 'purple'),
    s('path', { d: 'M96 52q20-24 44-10', ...SW(10) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[42, 76], [96, 70], [140, 132]], 15) }, 'red'),
    s('path', { d: dots([[70, 66], [120, 78]], 15) }, 'orange'),
    s('path', { d: 'M22 84h116l-14 52H36z' }, 'brown', { accent: true }),
    s('path', { d: 'M28 98h104M32 114h96', ...SW(3) }, 'tan', { stroke: true })
  ],
  adversario: [
    s('rect', { x: 20, y: 118, width: 120, height: 28 }, 'cream'),
    s('path', { d: checker(20, 118, 8, 2, 15) }, 'gray'),
    s('path', { d: [44].map(cx => `M${cx - 22} 116h44v-8l-10-6-4-34h6v-6h-28v6h6l-4 34-10 6z`).join('') + ells([[44, 50, 13, 13]]) }, 'red', { accent: true }),
    s('path', { d: [116].map(cx => `M${cx - 22} 116h44v-8l-10-6-4-34h6v-6h-28v6h6l-4 34-10 6z`).join('') + ells([[116, 50, 13, 13]]) }, 'blue'),
    s('path', { d: 'M84 50l-8 14h10l-8 14', ...SW(4) }, 'orange', { stroke: true })
  ],
  alambre: [
    s('path', { d: ring(68, 78, 46) + ring(68, 78, 38) + ring(68, 78, 30), ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 68, cy: 78, r: 22 }, 'brown', { accent: true }),
    s('circle', { cx: 68, cy: 78, r: 7 }, 'tan'),
    s('path', { d: 'M114 78q20 0 16 26t14 28', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M140 126l4 8', ...SW(5) }, 'orange', { stroke: true })
  ],
  autenticidad: [
    ...paper(20, 22, 104, 88),
    s('path', { d: 'M34 44h76M34 60h76M34 76h44', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 112l-8 28 12-6 6 12 4-30zM124 112l8 28-12-6-6 12-4-30z' }, 'blue'),
    s('path', { d: burst(114, 102, 22, 18, 14) }, 'red', { accent: true }),
    s('path', { d: 'M105 102l6 6 11-12', ...SW(4) }, 'white', { stroke: true })
  ],
  cantero: [
    ground(),
    s('rect', { x: 86, y: 92, width: 56, height: 44, rx: 3 }, 'gray', { accent: true }),
    s('path', { d: 'M98 104h18M126 120h10M100 124h8', ...SW(2) }, 'dark', { stroke: true }),
    ...person(44, 136, 'orange'),
    s('path', { d: 'M30 76a14 14 0 0 1 28 0z' }, 'yellow'),
    s('path', { d: 'M58 104l18-4', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M74 102l16-8M58 92l16-26', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 64, y: 54, width: 24, height: 12, rx: 2, transform: 'rotate(-30 76 60)' }, 'dark'),
    s('path', { d: sparkle(96, 84, 6) }, 'yellow')
  ],
  'castaño': [
    s('path', { d: 'M80 136V84', ...SW(12) }, 'brown', { stroke: true }),
    s('path', { d: ells([[80, 62, 54, 42]]) }, 'green'),
    s('path', { d: burst(56, 56, 10, 6, 12) + burst(100, 48, 10, 6, 12) + burst(84, 82, 10, 6, 12) }, 'yellow'),
    s('path', { d: 'M120 138q-16 0-14-14q4-10 14-12q10 2 14 12q2 14-14 14z' }, 'brown', { accent: true }),
    s('path', { d: 'M108 132q12 6 24 0', ...SW(4) }, 'tan', { stroke: true }),
    ground(140)
  ],
  'caño': [
    s('rect', { x: 14, y: 14, width: 26, height: 132 }, 'tan'),
    s('path', { d: 'M14 50h70q20 0 20 20v24', ...SW(18, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 40v20M74 40v20', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 90, y: 92, width: 28, height: 10, rx: 2 }, 'dark', { accent: true }),
    s('path', { d: 'M104 106v22', ...SW(8) }, 'sky', { stroke: true }),
    s('ellipse', { cx: 104, cy: 136, rx: 22, ry: 5 }, 'blue')
  ],
  celebridad: [
    s('path', { d: star(80, 72, 54) }, 'yellow'),
    s('path', { d: 'M56 146l12-26h24l12 26z' }, 'red'),
    ...person(80, 128, 'purple', { accent: true }),
    s('path', { d: 'M70 70h20', ...SW(6) }, 'black', { stroke: true }),
    s('path', { d: sparkle(24, 40, 9) + sparkle(138, 46, 9) + sparkle(130, 120, 6) }, 'orange')
  ],
  cicatriz: [
    backdrop('sky'),
    s('rect', { x: 14, y: 54, width: 132, height: 52, rx: 26 }, 'skin', { accent: true }),
    s('path', { d: 'M36 92Q80 62 124 80', ...SW(6) }, 'pink', { stroke: true }),
    s('path', { d: qpts([36, 92], [80, 62], [124, 80], 5).map(([x, y]) => `M${x - 3} ${y - 8}l6 16`).join(''), ...SW(3) }, 'dark', { stroke: true })
  ],
  concernir: [
    s('circle', { cx: 34, cy: 80, r: 20 }, 'blue', { accent: true }),
    s('rect', { x: 106, y: 60, width: 40, height: 40, rx: 6 }, 'orange'),
    s('path', { d: ells([[62, 80, 12, 7], [98, 80, 12, 7]]), ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: ells([[80, 80, 13, 8]]), ...SW(5) }, 'dark', { stroke: true })
  ],
  corpus: [
    s('rect', { x: 16, y: 30, width: 44, height: 58, rx: 3 }, 'white'),
    outline({ x: 16, y: 30, width: 44, height: 58, rx: 3 }),
    s('rect', { x: 26, y: 42, width: 44, height: 58, rx: 3 }, 'white'),
    outline({ x: 26, y: 42, width: 44, height: 58, rx: 3 }),
    s('rect', { x: 36, y: 54, width: 44, height: 58, rx: 3 }, 'white'),
    outline({ x: 36, y: 54, width: 44, height: 58, rx: 3 }),
    s('path', { d: 'M88 50v60a26 9 0 0 0 52 0V50z' }, 'blue', { accent: true }),
    s('ellipse', { cx: 114, cy: 50, rx: 26, ry: 9 }, 'sky'),
    s('path', { d: 'M88 70a26 9 0 0 0 52 0M88 90a26 9 0 0 0 52 0M44 68h28M44 80h28M44 92h20', ...SW(3) }, 'navy', { stroke: true })
  ],
  deficiente: [
    s('rect', { x: 22, y: 50, width: 104, height: 60, rx: 10, ...SW(7) }, 'dark', { stroke: true }),
    s('rect', { x: 128, y: 68, width: 12, height: 24, rx: 3 }, 'dark'),
    s('rect', { x: 32, y: 60, width: 18, height: 40, rx: 4 }, 'red', { accent: true }),
    arrow('M80 124v12M72 130l8 8 8-8', 'red', 4)
  ],
  dental: [
    backdrop('sky'),
    s('path', { d: 'M40 42q16-12 28 0q10-10 26 0q12 14 2 40q-4 14-6 40q-2 10-8 0l-6-30q-2-6-8 0l-6 30q-6 10-8 0q-2-26-6-40q-10-26 2-40z' }, 'white', { accent: true }),
    s('path', { d: 'M40 42q16-12 28 0q10-10 26 0q12 14 2 40q-4 14-6 40q-2 10-8 0l-6-30q-2-6-8 0l-6 30q-6 10-8 0q-2-26-6-40q-10-26 2-40z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M128 140V56', ...SW(9) }, 'blue', { stroke: true }),
    s('path', { d: rects([[112, 24, 12, 34]]) }, 'white'),
    s('path', { d: 'M112 30h12M112 40h12M112 50h12', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M124 22h8v38h-8z' }, 'blue'),
    s('path', { d: sparkle(30, 30, 7) }, 'yellow')
  ],
  descartar: [
    s('path', { d: 'M44 80h72l-8 56H52z' }, 'gray'),
    s('rect', { x: 38, y: 70, width: 84, height: 10, rx: 3 }, 'dark'),
    s('path', { d: 'M64 92v32M80 92v32M96 92v32', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 84, y: 14, width: 34, height: 46, rx: 4, transform: 'rotate(25 101 37)' }, 'white'),
    s('rect', { x: 84, y: 14, width: 34, height: 46, rx: 4, transform: 'rotate(25 101 37)', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: heart(101, 34, 8), transform: 'rotate(25 101 37)' }, 'red', { accent: true }),
    s('path', { d: 'M70 30q-12 14-6 30', ...DASH(3, '5 5') }, 'gray', { stroke: true })
  ],
  'desempeñar': [
    s('rect', { x: 14, y: 126, width: 132, height: 20 }, 'brown'),
    ...person(66, 126, 'purple', { h: 46 }),
    s('path', { d: 'M80 96l20-26', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M92 30h40q0 38-20 38t-20-38z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[104, 42], [120, 42]], 4) }, 'dark'),
    s('path', { d: 'M102 52q10 8 20 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  diferencial: [
    s('path', { d: 'M20 136h120', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 34, y: 80, width: 34, height: 56 }, 'blue'),
    s('rect', { x: 92, y: 36, width: 34, height: 100 }, 'orange', { accent: true }),
    s('path', { d: 'M34 36h56', ...DASH(3, '4 4') }, 'gray', { stroke: true }),
    s('path', { d: 'M52 40v36M46 46l6-6 6 6M46 70l6 6 6-6', ...SW(3) }, 'red', { stroke: true })
  ],
  'dinastía': [
    s('path', { d: 'M80 54v36M40 90h80M40 90v14M120 90v14', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: [[80, 52, 22]].map(([cx, cy, w]) => `M${cx - w} ${cy}l-4-20 ${w / 2 + 4} 12 ${w / 2}-18 ${w / 2} 18 ${w / 2 + 4}-12-4 20z`).join('') }, 'yellow', { accent: true }),
    s('path', { d: [[40, 132, 16], [120, 132, 16]].map(([cx, cy, w]) => `M${cx - w} ${cy}l-4-20 ${w / 2 + 4} 12 ${w / 2}-18 ${w / 2} 18 ${w / 2 + 4}-12-4 20z`).join('') }, 'orange'),
    s('path', { d: dots([[80, 44], [40, 126], [120, 126]], 3) }, 'red')
  ],
  distante: [
    s('rect', { x: 14, y: 14, width: 132, height: 70, rx: 10 }, 'sky'),
    s('path', { d: 'M14 84l24-18 22 18zM96 84l24-20 26 20z' }, 'mint'),
    s('rect', { x: 14, y: 84, width: 132, height: 62, rx: 6 }, 'green'),
    s('path', { d: 'M36 146L78 84h4l42 62z' }, 'gray'),
    s('path', { d: 'M80 142v-14M80 118v-9M80 102v-5', ...SW(2) }, 'white', { stroke: true }),
    s('rect', { x: 104, y: 78, width: 8, height: 6 }, 'red', { accent: true }),
    s('path', { d: 'M102 78l6-5 6 5z' }, 'brown')
  ],
  dulzura: [
    s('path', { d: 'M80 58V30M68 24h24', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 70q-4 66 40 66t40-66z' }, 'orange', { accent: true }),
    s('rect', { x: 34, y: 58, width: 92, height: 14, rx: 6 }, 'brown'),
    s('path', { d: 'M42 72h76v8H42z' + drop(56, 88, 5) + drop(98, 98, 6) }, 'yellow'),
    s('path', { d: heart(124, 34, 12) }, 'pink')
  ],
  encarcelar: [
    s('rect', { x: 34, y: 14, width: 92, height: 74, rx: 4 }, 'gray'),
    s('rect', { x: 44, y: 24, width: 72, height: 54 }, 'navy', { accent: true }),
    s('path', { d: 'M58 24v54M80 24v54M102 24v54', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: ring(56, 118, 16) + ring(104, 118, 16), ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: 'M72 118h16', ...SW(4) }, 'dark', { stroke: true })
  ],
  'envío': [
    s('rect', { x: 50, y: 64, width: 76, height: 62, rx: 3 }, 'tan', { accent: true }),
    s('path', { d: 'M50 84h76M88 64v20', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M18 80h22M14 98h26M22 116h18', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M98 40l44-18-16 40-10-12z' }, 'sky'),
    s('path', { d: 'M116 50l26-28', ...SW(2) }, 'navy', { stroke: true })
  ],
  escalar: [
    s('path', { d: 'M58 146L80 14h66v132z' }, 'gray'),
    s('path', { d: 'M112 14v120', ...SW(2) }, 'red', { stroke: true }),
    s('path', { d: dots([[92, 40], [118, 66], [98, 104], [128, 110]], 5) }, 'orange'),
    s('path', { d: 'M90 78l2-34M98 84l18-16', ...SW(6) }, 'skin', { stroke: true }),
    ...lean(86, 120, 8, 'blue', { accent: true }),
    s('path', { d: 'M86 120l10-14', ...SW(6) }, 'navy', { stroke: true })
  ],
  etnia: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'mint'),
    s('path', { d: busts([34, 126], 136, 30, 32) }, 'red'),
    s('path', { d: busts([57, 103], 136, 30, 36) }, 'blue'),
    s('path', { d: busts([80], 136, 32, 42) }, 'green', { accent: true }),
    s('path', { d: dots([[34, 92], [103, 86]], 11) }, 'skin'),
    s('path', { d: dots([[57, 86], [126, 92]], 11) }, 'tan'),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'brown')
  ],
  fallido: [
    s('circle', { cx: 64, cy: 88, r: 44 }, 'red'),
    s('circle', { cx: 64, cy: 88, r: 30 }, 'white'),
    s('circle', { cx: 64, cy: 88, r: 16 }, 'red', { accent: true }),
    s('path', { d: 'M18 40q60-34 98-12', ...DASH(3, '6 6') }, 'gray', { stroke: true }),
    s('path', { d: 'M110 32l28 8M116 26l-6 6 8 4', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M138 40l-8-8 12 2z' }, 'dark')
  ],
  faso: [
    s('ellipse', { cx: 72, cy: 118, rx: 54, ry: 16 }, 'gray', { accent: true }),
    s('ellipse', { cx: 72, cy: 114, rx: 42, ry: 10 }, 'dark'),
    s('path', { d: 'M48 112l70-34', ...SW(9) }, 'cream', { stroke: true }),
    s('path', { d: 'M48 112l12-6', ...SW(9) }, 'orange', { stroke: true }),
    s('circle', { cx: 120, cy: 77, r: 5 }, 'red'),
    s('path', { d: 'M124 68q-8-8 0-16t0-16 0-16', ...SW(4) }, 'gray', { stroke: true })
  ],
  festejo: [
    s('path', { d: 'M48 82v54M96 70v66M124 94v42', ...SW(2) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 48, cy: 60, rx: 18, ry: 22 }, 'red', { accent: true }),
    s('ellipse', { cx: 96, cy: 48, rx: 18, ry: 22 }, 'blue'),
    s('ellipse', { cx: 126, cy: 78, rx: 14, ry: 17 }, 'yellow'),
    s('path', { d: rects([[22, 30, 6, 6], [68, 22, 6, 6], [132, 26, 6, 6], [26, 110, 6, 6], [70, 120, 6, 6]]) }, 'green'),
    s('path', { d: dots([[40, 22], [140, 52], [24, 84], [76, 96], [108, 112]], 3) }, 'pink')
  ],
  glorioso: [
    s('path', { d: rays(80, 80, 54, 66, 16), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: laurel(80, 82, 38, 18, 6) }, 'orange', { accent: true }),
    s('path', { d: star(80, 80, 22) }, 'yellow'),
    s('path', { d: 'M72 118l-8 20 10-4 8 8v-24zM88 118l8 20-10-4-8 8v-24z' }, 'red')
  ],
  gradual: [
    ground(120),
    s('path', { d: dots([[26, 114]], 5) }, 'brown'),
    s('path', { d: 'M58 120v-14M94 120v-30M130 120v-50', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(58, 108, -40, 12, 5) + leaflet(94, 100, -140, 18, 6) + leaflet(94, 96, -40, 18, 6) + leaflet(130, 96, -140, 22, 7) + leaflet(130, 90, -40, 22, 7) }, 'green'),
    s('path', { d: dots(around(130, 62, 8, 6), 6) }, 'pink', { accent: true }),
    s('circle', { cx: 130, cy: 62, r: 5 }, 'yellow'),
    arrow('M24 136h112M126 128l10 8-10 8', 'orange', 4)
  ],
  'génesis': [
    { ...backdrop('navy'), accent: true },
    s('path', { d: 'M76 80a4 4 0 0 1 8 0a10 10 0 0 1-20 0a18 18 0 0 1 36 0a28 28 0 0 1-56 0a40 40 0 0 1 80 0', ...SW(5) }, 'purple', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 8 }, 'yellow'),
    s('path', { d: dots([[30, 30], [130, 34], [124, 128], [34, 126], [110, 50]], 2) }, 'white'),
    s('path', { d: sparkle(128, 112, 8) }, 'yellow')
  ],
  hablante: [
    s('path', { d: busts([60], 146, 64, 44) }, 'blue', { accent: true }),
    s('circle', { cx: 60, cy: 74, r: 26 }, 'skin'),
    s('path', { d: dots([[50, 68], [70, 68]], 3) }, 'dark'),
    s('ellipse', { cx: 60, cy: 86, rx: 7, ry: 6 }, 'dark'),
    s('path', { d: 'M100 66q8 10 0 20M112 56q14 20 0 40M124 46q20 30 0 60', ...SW(5) }, 'orange', { stroke: true })
  ],
  'ibérico': [
    s('rect', { x: 18, y: 112, width: 124, height: 14, rx: 4 }, 'brown'),
    s('path', { d: 'M26 106q-4-36 28-50q32-12 56 6l20-22 8 8-18 24q10 24-16 34q-38 14-78 0z' }, 'red', { accent: true }),
    s('path', { d: 'M30 102q36 12 74-4', ...SW(5) }, 'cream', { stroke: true }),
    s('path', { d: 'M132 34l10-10', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 126v10M112 126v10', ...SW(6) }, 'brown', { stroke: true })
  ],
  impactante: [
    s('path', { d: burst(80, 80, 66, 48, 14) }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 82, r: 36 }, 'skin'),
    s('path', { d: ells([[66, 76, 7, 9], [94, 76, 7, 9]]) }, 'white'),
    s('path', { d: dots([[66, 76], [94, 76]], 3) }, 'dark'),
    s('ellipse', { cx: 80, cy: 102, rx: 8, ry: 10 }, 'dark'),
    s('path', { d: 'M58 60q8-6 16 0M86 60q8-6 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  inaugural: [
    s('path', { d: rects([[14, 58, 8, 82], [138, 58, 8, 82]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M20 66h44q6 0 8 10M140 66H96q-6 0-8 10', ...SW(9) }, 'red', { stroke: true }),
    s('path', { d: 'M70 112l12-48M90 112L78 64', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: ring(66, 122, 9) + ring(94, 122, 9), ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: sparkle(48, 30, 8) + sparkle(112, 28, 8) + sparkle(80, 22, 5) }, 'orange')
  ],
  individualmente: [
    s('path', { d: rects([[14, 36, 40, 88], [60, 36, 40, 88], [106, 36, 40, 88]]), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[34, 62], [80, 62], [126, 62]], 10) }, 'skin'),
    s('rect', { x: 22, y: 78, width: 24, height: 40, rx: 8 }, 'red'),
    s('rect', { x: 68, y: 78, width: 24, height: 40, rx: 8 }, 'blue', { accent: true }),
    s('rect', { x: 114, y: 78, width: 24, height: 40, rx: 8 }, 'green')
  ],
  instrumental: [
    s('path', { d: 'M96 64L130 30', ...SW(8) }, 'brown', { stroke: true }),
    s('rect', { x: 124, y: 16, width: 14, height: 20, rx: 3, transform: 'rotate(45 131 26)' }, 'dark'),
    s('path', { d: ells([[86, 76, 22, 20], [62, 100, 30, 28]]) }, 'orange', { accent: true }),
    s('circle', { cx: 74, cy: 88, r: 9 }, 'dark'),
    s('path', { d: 'M46 112l12 12', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M52 118L128 32', ...SW(1) }, 'cream', { stroke: true }),
    ...note(28, 56, 'purple')
  ],
  intensamente: [
    s('path', { d: 'M80 140q-44 0-44-40q0-30 24-52q-2 22 12 28q-6-34 22-62q2 30 20 44q14 14 10 42q0 40-44 40z' }, 'red', { accent: true }),
    s('path', { d: 'M80 140q-24 0-24-24q0-18 14-30q0 14 10 18q0-20 14-30q12 20 12 40q0 26-26 26z' }, 'orange'),
    s('path', { d: 'M80 140q-10 0-10-12t10-20q10 8 10 20t-10 12z' }, 'yellow')
  ],
  interminable: [
    s('path', { d: 'M80 80C64 56 24 56 24 80S64 104 80 80 136 56 136 80 96 104 80 80', ...SW(14) }, 'purple', { stroke: true }),
    s('path', { d: 'M80 80C64 56 24 56 24 80S64 104 80 80 136 56 136 80 96 104 80 80', ...DASH(3, '6 8') }, 'white', { stroke: true }),
    s('circle', { cx: 136, cy: 80, r: 9 }, 'orange', { accent: true })
  ],
  intriga: [
    { ...backdrop('navy'), accent: true },
    ...person(52, 140, 'purple'),
    ...person(108, 140, 'gray'),
    s('path', { d: 'M90 80h36M96 80l2-14h20l2 14z', ...SW(2) }, 'black', { stroke: true }),
    s('path', { d: 'M96 80l2-14h20l2 14z' }, 'black'),
    s('path', { d: 'M62 86l12-6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M74 72q6-4 12 0M76 62q8-6 16 0', ...SW(3) }, 'white', { stroke: true })
  ],
  jara: [
    backdrop('green'),
    s('path', { d: leaflet(20, 126, -35, 40, 10) + leaflet(140, 128, -145, 40, 10) }, 'mint'),
    s('path', { d: dots(around(80, 76, 26, 5, -90), 24) }, 'white', { accent: true }),
    s('path', { d: dots(around(80, 76, 15, 5, -90), 6) }, 'red'),
    s('circle', { cx: 80, cy: 76, r: 10 }, 'yellow')
  ],
  jurisprudencia: [
    s('path', { d: 'M80 26v94M44 40h72', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 40l-16 36M44 40l16 36M116 40l-16 36M116 40l16 36', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 76h40a20 12 0 0 1-40 0zM96 76h40a20 12 0 0 1-40 0z' }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 24, r: 6 }, 'yellow'),
    s('rect', { x: 46, y: 118, width: 68, height: 12, rx: 2 }, 'red'),
    s('rect', { x: 52, y: 130, width: 56, height: 10, rx: 2 }, 'blue')
  ],
  'legalización': [
    ...paper(24, 74, 112, 64),
    s('path', { d: 'M36 92h44M36 106h36M36 120h48', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 106, cy: 110, r: 16, ...SW(4) }, 'red', { stroke: true }),
    s('rect', { x: 86, y: 52, width: 40, height: 14, rx: 3 }, 'red', { accent: true }),
    s('rect', { x: 98, y: 26, width: 16, height: 28, rx: 4 }, 'brown'),
    s('circle', { cx: 106, cy: 22, r: 10 }, 'brown'),
    s('path', { d: 'M88 74l-6 6M124 74l6 6', ...SW(3) }, 'orange', { stroke: true })
  ],
  manada: [
    backdrop('mint'),
    s('path', { d: [[40, 64], [96, 58], [62, 104], [112, 106]].map(([x, y]) => `M${x - 10} ${y + 10}v14M${x + 10} ${y + 10}v14`).join(''), ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[40, 64, 20, 14], [96, 58, 20, 14], [62, 104, 22, 15], [112, 106, 20, 14]]) }, 'white', { accent: true }),
    s('path', { d: ells([[62, 60, 7, 9], [118, 54, 7, 9], [86, 100, 7, 9], [134, 102, 7, 9]]) }, 'dark')
  ],
  mejilla: [
    s('circle', { cx: 80, cy: 82, r: 50 }, 'skin'),
    s('path', { d: 'M30 78q0-50 50-50t50 50q-10-30-50-30t-50 30z' }, 'brown'),
    s('path', { d: dots([[62, 78], [98, 78]], 5) }, 'dark'),
    s('path', { d: 'M68 106q12 8 24 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[54, 98, 13, 9], [106, 98, 13, 9]]) }, 'pink', { accent: true })
  ],
  misionero: [
    ground(),
    s('path', { d: 'M112 136v-24h28v24z' }, 'tan'),
    s('path', { d: 'M106 114l20-18 20 18z' }, 'red'),
    ...person(54, 136, 'brown', { accent: true }),
    s('path', { d: 'M76 136V66', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M64 100h12', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 28, y: 96, width: 16, height: 20, rx: 2 }, 'navy'),
    s('path', { d: 'M84 132q12-4 24-2', ...DASH(3, '4 5') }, 'gray', { stroke: true })
  ],
  molar: [
    s('rect', { x: 14, y: 88, width: 132, height: 58, rx: 12 }, 'pink'),
    s('path', { d: 'M38 52q0-24 20-22q10 2 22 6q12-4 22-6q20-2 20 22q0 20-8 34l-4 44q-2 8-8 0l-6-30q-2-6-6-6h-20q-4 0-6 6l-6 30q-6 8-8 0l-4-44q-8-14-8-34z' }, 'white', { accent: true }),
    s('path', { d: 'M38 52q0-24 20-22q10 2 22 6q12-4 22-6q20-2 20 22q0 20-8 34l-4 44q-2 8-8 0l-6-30q-2-6-6-6h-20q-4 0-6 6l-6 30q-6 8-8 0l-4-44q-8-14-8-34z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: sparkle(132, 32, 9) }, 'yellow')
  ],
  mudar: [
    ground(),
    s('path', { d: 'M18 136v-30h30v30zM14 108l19-17 19 17z' }, 'gray'),
    s('path', { d: 'M112 136v-30h30v30z' }, 'yellow'),
    s('path', { d: 'M108 108l19-17 19 17z' }, 'red'),
    ...person(80, 136, 'blue'),
    s('rect', { x: 64, y: 86, width: 32, height: 26, rx: 2 }, 'tan', { accent: true }),
    s('path', { d: 'M64 96h32', ...SW(3) }, 'brown', { stroke: true }),
    arrow('M40 56h76M106 46l10 10-10 10', 'orange', 4)
  ],
  'neumático': [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'black'),
    s('circle', { cx: 80, cy: 80, r: 56, ...DASH(8, '8 8') }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 32 }, 'gray', { accent: true }),
    s('path', { d: dots(around(80, 80, 18, 5, -90), 4) }, 'dark'),
    s('circle', { cx: 80, cy: 80, r: 8 }, 'dark')
  ],
  nova: [
    backdrop('navy'),
    s('path', { d: rays(80, 80, 56, 64, 8, 22.5), ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: burst(80, 80, 50, 14, 8) }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 14 }, 'white'),
    s('path', { d: dots([[28, 30], [132, 30], [30, 128], [128, 124]], 2) }, 'white')
  ],
  obedecer: [
    ground(),
    ...person(42, 136, 'blue'),
    s('path', { d: 'M56 96l16-16', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M132 132q10-2 10-12', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M96 136q-4-36 16-40q16 2 18 18l2 22z' }, 'brown', { accent: true }),
    s('circle', { cx: 104, cy: 84, r: 13 }, 'brown'),
    s('path', { d: ells([[114, 82, 5, 10], [92, 89, 6, 4]]) }, 'dark'),
    s('circle', { cx: 100, cy: 80, r: 2 }, 'dark')
  ],
  poniente: [
    backdrop('orange'),
    s('path', { d: 'M44 96a36 36 0 0 1 72 0z' }, 'yellow', { accent: true }),
    s('path', { d: 'M14 96h132v38a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'navy'),
    s('path', { d: 'M56 108h48M66 120h28M74 132h12', ...SW(4) }, 'yellow', { stroke: true }),
    arrow('M62 40H28M38 30L28 40l10 10', 'white', 5)
  ],
  'porteño': [
    s('path', { d: 'M40 112V30h62M40 52l22-22M92 30v26', ...SW(5) }, 'orange', { stroke: true }),
    s('rect', { x: 82, y: 56, width: 20, height: 12 }, 'yellow'),
    s('path', { d: rects([[66, 84, 16, 14], [84, 84, 16, 14], [102, 84, 16, 14], [120, 84, 16, 14]]) }, 'green'),
    s('path', { d: 'M54 98h92l-12 18H66z' }, 'red', { accent: true }),
    s('path', { d: 'M14 114h132v20a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'blue'),
    s('path', { d: birds([[118, 30], [136, 44]]), ...SW(3) }, 'dark', { stroke: true })
  ],
  posgrado: [
    s('rect', { x: 30, y: 122, width: 100, height: 14, rx: 2 }, 'red'),
    s('rect', { x: 36, y: 108, width: 88, height: 14, rx: 2 }, 'blue'),
    s('rect', { x: 42, y: 94, width: 76, height: 14, rx: 2 }, 'green'),
    s('path', { d: 'M56 56v18q24 12 48 0V56l-24 10z' }, 'dark'),
    s('path', { d: 'M80 26l54 20-54 20-54-20z' }, 'black', { accent: true }),
    s('path', { d: 'M126 50v24', ...SW(3) }, 'yellow', { stroke: true }),
    s('circle', { cx: 126, cy: 78, r: 4 }, 'yellow')
  ],
  prender: [
    s('rect', { x: 46, y: 80, width: 30, height: 58, rx: 3 }, 'cream'),
    s('rect', { x: 46, y: 80, width: 30, height: 58, rx: 3, ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M61 80v-8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: drop(61, 60, 7) }, 'orange', { accent: true }),
    s('path', { d: 'M80 66l50-30', ...SW(5) }, 'tan', { stroke: true }),
    s('circle', { cx: 78, cy: 67, r: 5 }, 'red'),
    s('path', { d: drop(76, 54, 5) }, 'yellow')
  ],
  procura: [
    s('path', { d: 'M42 48h90l-12 48H52z' }, 'sky'),
    s('path', { d: rects([[58, 32, 18, 26], [80, 26, 22, 32], [106, 38, 16, 20]]) }, 'orange', { accent: true }),
    s('path', { d: 'M16 30h18l16 66h70l12-48H40M50 96l-6 12h76', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[56, 122], [112, 122]], 9) }, 'dark')
  ],
  profesorado: [
    s('rect', { x: 22, y: 18, width: 116, height: 60, rx: 4 }, 'green', { accent: true }),
    s('rect', { x: 22, y: 18, width: 116, height: 60, rx: 4, ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 62l12-22 12 22zM84 38h36M84 52h26', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: busts([40, 80, 120], 146, 30, 34) }, 'navy'),
    s('path', { d: dots([[40, 100], [80, 100], [120, 100]], 11) }, 'skin'),
    s('rect', { x: 110, y: 120, width: 20, height: 14, rx: 2 }, 'red')
  ],
  'propagación': [
    s('path', { d: ring(80, 80, 58), ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: ring(80, 80, 42), ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: ring(80, 80, 26), ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: dots(around(80, 80, 58, 8, 22.5), 6) }, 'green'),
    s('circle', { cx: 80, cy: 80, r: 10 }, 'navy', { accent: true })
  ],
  prototipo: [
    { ...backdrop('navy'), accent: true },
    s('path', { d: 'M14 46h132M14 80h132M14 114h132M46 14v132M80 14v132M114 14v132', ...SW(1) }, 'sky', { stroke: true }),
    s('path', { d: 'M30 100h100V84l-20-4-14-18H62L48 80l-18 4z', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: ring(54, 102, 10) + ring(106, 102, 10), ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M30 124h100M30 120v8M130 120v8', ...SW(2) }, 'yellow', { stroke: true })
  ],
  'regeneración': [
    ground(),
    s('path', { d: 'M48 136l6-40h52l6 40z' }, 'brown'),
    s('ellipse', { cx: 80, cy: 96, rx: 26, ry: 7 }, 'tan'),
    s('path', { d: 'M68 96a12 4 0 0 1 24 0', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M86 94V60', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(86, 70, -150, 22, 8) + leaflet(86, 62, -30, 22, 8) }, 'green', { accent: true }),
    arrow('M36 72a44 44 0 0 1 30-42M58 22l10 8-8 10', 'orange', 4)
  ],
  reprimir: [
    s('path', { d: 'M24 62q-8-6-4-14M136 62q8-6 4-14', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 34, y: 76, width: 92, height: 56, rx: 8 }, 'gray'),
    s('rect', { x: 28, y: 66, width: 104, height: 12, rx: 4 }, 'dark'),
    s('rect', { x: 70, y: 56, width: 20, height: 12, rx: 3 }, 'dark'),
    s('path', { d: 'M80 14v24', ...SW(16) }, 'skin', { stroke: true }),
    s('path', { d: 'M58 58q0-22 22-22t22 22z' }, 'skin', { accent: true }),
    s('path', { d: 'M30 96l-12 4M130 96l12 4', ...SW(4) }, 'red', { stroke: true })
  ],
  revivir: [
    ground(),
    s('path', { d: 'M40 136V100q0-14 14-16', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 58, cy: 90, r: 8 }, 'brown'),
    s('path', { d: 'M114 136V64', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(114, 106, -30, 22, 8) }, 'green'),
    s('path', { d: dots(around(114, 54, 11, 6), 8) }, 'pink'),
    s('circle', { cx: 114, cy: 54, r: 7 }, 'yellow', { accent: true }),
    arrow('M62 66q18-22 34-10M88 50l8 6-4 10', 'orange', 4)
  ],
  satisfecho: [
    s('ellipse', { cx: 72, cy: 108, rx: 36, ry: 30 }, 'orange', { accent: true }),
    s('circle', { cx: 72, cy: 56, r: 22 }, 'skin'),
    s('path', { d: 'M60 54q4-5 8 0M76 54q4-5 8 0M62 64q10 8 20 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 100q22 14 36 0', ...SW(7) }, 'skin', { stroke: true }),
    s('ellipse', { cx: 126, cy: 132, rx: 20, ry: 6 }, 'gray'),
    s('ellipse', { cx: 126, cy: 130, rx: 14, ry: 4 }, 'white')
  ],
  saudita: [
    s('circle', { cx: 118, cy: 40, r: 16 }, 'yellow'),
    s('path', { d: 'M50 114q-4-30 4-58', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(54, 56, -170, 30, 8) + leaflet(54, 56, -125, 26, 7) + leaflet(54, 56, -55, 26, 7) + leaflet(54, 56, -10, 30, 8) }, 'green'),
    s('path', { d: 'M14 112q40-30 80 0t52-6v40H14z' }, 'tan', { accent: true }),
    s('path', { d: 'M14 128q50-24 132 0v18H14z' }, 'orange')
  ],
  sobrar: [
    s('circle', { cx: 80, cy: 80, r: 58 }, 'gray'),
    s('circle', { cx: 80, cy: 80, r: 52 }, 'white'),
    s('path', { d: wedge(80, 80, 48, -70, -20) }, 'orange'),
    s('path', { d: wedge(80, 80, 40, -70, -20) }, 'yellow', { accent: true }),
    s('path', { d: dots([[92, 52], [104, 64]], 5) }, 'red'),
    s('path', { d: dots([[60, 100], [96, 110], [52, 74], [110, 92]], 2) }, 'tan')
  ],
  suplemento: [
    s('rect', { x: 34, y: 46, width: 56, height: 90, rx: 8 }, 'orange', { accent: true }),
    s('rect', { x: 30, y: 28, width: 64, height: 20, rx: 4 }, 'white'),
    outline({ x: 30, y: 28, width: 64, height: 20, rx: 4 }),
    s('rect', { x: 42, y: 72, width: 40, height: 36, rx: 3 }, 'white'),
    s('path', { d: 'M50 84h24M50 96h18', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 100, y: 96, width: 36, height: 16, rx: 8, transform: 'rotate(-30 118 104)' }, 'red'),
    s('rect', { x: 104, y: 122, width: 36, height: 16, rx: 8, transform: 'rotate(10 122 130)' }, 'blue')
  ],
  suprimir: [
    ...paper(20, 22, 96, 116),
    s('path', { d: 'M32 44h72M32 62h72M32 116h50M32 82h24M32 98h16', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 70, y: 72, width: 56, height: 28, rx: 5, transform: 'rotate(-25 98 86)' }, 'pink', { accent: true }),
    s('rect', { x: 106, y: 72, width: 20, height: 28, rx: 5, transform: 'rotate(-25 98 86)' }, 'blue'),
    s('path', { d: dots([[62, 108], [70, 116], [56, 118]], 2) }, 'pink')
  ],
  taquilla: [
    s('rect', { x: 26, y: 40, width: 108, height: 96 }, 'red'),
    s('path', { d: 'M20 40h120l-8-20H28z' }, 'yellow'),
    s('path', { d: 'M46 98V76a34 20 0 0 1 68 0v22z' }, 'sky'),
    s('path', { d: busts([80], 98, 26, 16) + ells([[80, 74, 9, 9]]) }, 'navy'),
    s('rect', { x: 40, y: 98, width: 80, height: 8 }, 'brown'),
    s('rect', { x: 84, y: 102, width: 30, height: 16, rx: 2, transform: 'rotate(-10 99 110)' }, 'yellow', { accent: true })
  ],
  tequila: [
    s('path', { d: 'M44 20h20v24q14 8 14 24v66H30V68q0-16 14-24z' }, 'sky'),
    s('path', { d: 'M32 80h44v52H32z' }, 'yellow', { accent: true }),
    s('rect', { x: 42, y: 14, width: 24, height: 8, rx: 2 }, 'dark'),
    s('path', { d: 'M90 96h28l-4 40H94z' }, 'sky'),
    s('path', { d: 'M92 108h24l-3 26H95z' }, 'yellow'),
    s('path', { d: wedge(132, 88, 16, 180, 360) }, 'green'),
    s('path', { d: wedge(132, 88, 11, 180, 360) }, 'mint')
  ],
  triunfar: [
    s('path', { d: 'M14 140l66-80 66 80z' }, 'gray'),
    s('path', { d: 'M64 80l16-20 16 20-8-4-8 6-8-6z' }, 'white'),
    ...person(80, 60, 'red', { accent: true, h: 26, w: 18, r: 9 }),
    s('path', { d: 'M88 40l14-14', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M104 14v34', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M104 14h24l-6 7 6 7h-24z' }, 'yellow')
  ],
  unanimidad: [
    s('path', { d: [24, 52, 80, 108, 136].map(x => `M${x + 8} 126L${x + 12} 84`).join(''), ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: dots([24, 52, 80, 108, 136].map(x => [x + 12, 82]), 5) }, 'skin'),
    s('path', { d: busts([24, 52, 80, 108, 136], 146, 24, 28) }, 'blue', { accent: true }),
    s('path', { d: dots([24, 52, 80, 108, 136].map(x => [x, 108]), 9) }, 'skin')
  ],
  villano: [
    s('path', { d: 'M24 146q6-52 56-52t56 52z' }, 'black'),
    s('path', { d: 'M58 98l22 30 22-30z' }, 'red'),
    s('circle', { cx: 80, cy: 74, r: 24 }, 'skin'),
    s('path', { d: 'M52 52h56v6H52zM62 18h36v36H62z' }, 'black'),
    s('rect', { x: 62, y: 42, width: 36, height: 8 }, 'red', { accent: true }),
    s('path', { d: 'M80 86q-10-6-18 0q-6 4-10-2M80 86q10-6 18 0q6 4 10-2', ...SW(4) }, 'black', { stroke: true }),
    s('path', { d: 'M66 66l10 4M94 66l-10 4', ...SW(3) }, 'dark', { stroke: true })
  ],
  'violín': [
    s('path', { d: 'M26 36l108 82', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 56V20', ...SW(8) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 18, r: 6 }, 'dark'),
    s('path', { d: 'M68 54q-18 0-16 20q2 10 8 14q-14 8-14 26q0 24 28 24h12q28 0 28-24q0-18-14-26q6-4 8-14q2-20-16-20z' }, 'orange', { accent: true }),
    s('path', { d: 'M66 96q-4 6 0 12M94 96q4 6 0 12M70 118h20', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M77 30v88M83 30v88', ...SW(1) }, 'cream', { stroke: true })
  ],
  'víspera': [
    s('path', { d: 'M44 18a26 26 0 1 0 28 36a20 20 0 1 1-28-36z' }, 'yellow'),
    s('rect', { x: 52, y: 44, width: 84, height: 90, rx: 6 }, 'white'),
    outline({ x: 52, y: 44, width: 84, height: 90, rx: 6 }),
    s('path', { d: 'M52 50a6 6 0 0 1 6-6h72a6 6 0 0 1 6 6v16H52z' }, 'red'),
    s('path', { d: 'M70 36v14M118 36v14', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: star(94, 100, 22) }, 'orange', { accent: true })
  ],
  'acompañante': [
    ground(),
    ...person(56, 136, 'green', { accent: true }),
    ...person(104, 136, 'purple', { h: 38, r: 11 }),
    s('path', { d: 'M70 108q10 6 20 0', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 40, 10) }, 'pink')
  ],
  acumular: [
    ground(),
    s('path', { d: rects([[26, 112, 34, 24], [63, 112, 34, 24], [100, 112, 34, 24], [44, 86, 34, 24], [82, 86, 34, 24]]) }, 'tan'),
    s('path', { d: rects([[26, 112, 34, 24], [63, 112, 34, 24], [100, 112, 34, 24], [44, 86, 34, 24], [82, 86, 34, 24], [63, 60, 34, 24]]), ...SW(2) }, 'brown', { stroke: true }),
    s('rect', { x: 63, y: 60, width: 34, height: 24 }, 'orange', { accent: true }),
    arrow('M80 20v30M70 40l10 10 10-10', 'green', 5)
  ],
  'adición': [
    s('path', { d: dots([[28, 60], [50, 60]], 10) }, 'red'),
    s('path', { d: 'M68 60h20M78 50v20', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[108, 60], [130, 60], [119, 40]], 10) }, 'blue'),
    arrow('M80 84v16M70 92l10 10 10-10', 'gray', 4),
    s('path', { d: rects([[30, 108, 100, 34]]) }, 'cream', { accent: true }),
    s('path', { d: dots([[44, 125], [64, 125]], 9) }, 'red'),
    s('path', { d: dots([[86, 125], [106, 125], [124, 125]], 9) }, 'blue')
  ],
  adorable: [
    s('path', { d: 'M38 72l4-44 32 22zM122 72l-4-44-32 22z' }, 'orange'),
    s('circle', { cx: 80, cy: 88, r: 46 }, 'orange', { accent: true }),
    s('path', { d: ells([[62, 84, 9, 11], [98, 84, 9, 11]]) }, 'dark'),
    s('path', { d: dots([[65, 80], [101, 80]], 3) }, 'white'),
    s('path', { d: 'M76 100h8l-4 5z' }, 'pink'),
    s('path', { d: 'M80 105q-6 8-12 2M80 105q6 8 12 2', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: heart(132, 28, 8) + heart(26, 30, 6) }, 'pink')
  ],
  almacenar: [
    s('path', { d: 'M22 20v120M138 20v120M22 56h116M22 96h116M22 136h116', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: rects([[30, 30, 30, 26], [64, 36, 24, 20], [96, 28, 34, 28], [30, 70, 40, 26], [76, 74, 26, 22], [106, 66, 26, 30], [34, 110, 26, 26], [66, 112, 30, 24]]) }, 'tan', { accent: true }),
    s('path', { d: 'M45 30v10M114 28v10M50 70v10M119 66v10M47 110v10M81 112v10', ...SW(3) }, 'brown', { stroke: true })
  ],
  amabilidad: [
    ground(),
    ...person(40, 136, 'blue'),
    ...person(120, 136, 'pink'),
    s('path', { d: 'M54 100h22', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M78 102V76', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: dots(around(78, 70, 6, 5), 5) }, 'red'),
    s('circle', { cx: 78, cy: 70, r: 3 }, 'yellow'),
    s('path', { d: heart(80, 32, 10) }, 'pink', { accent: true })
  ],
  'antaño': [
    s('rect', { x: 18, y: 22, width: 96, height: 80, rx: 3 }, 'brown'),
    s('rect', { x: 26, y: 30, width: 80, height: 64 }, 'tan', { accent: true }),
    s('path', { d: 'M44 94V70l22-16 22 16v24z' }, 'brown'),
    s('circle', { cx: 118, cy: 114, r: 24 }, 'cream'),
    s('circle', { cx: 118, cy: 114, r: 24, ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M118 98v16l-10 6', ...SW(3) }, 'dark', { stroke: true }),
    arrow('M72 128q4 12 18 10M80 134l10 4-6 8', 'orange', 4)
  ],
  arrojar: [
    ground(),
    ...lean(44, 136, -10, 'red', { accent: true }),
    s('path', { d: 'M48 94l14-28', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M68 58q30-40 62 4', ...DASH(3, '6 6') }, 'gray', { stroke: true }),
    s('circle', { cx: 134, cy: 74, r: 10 }, 'blue'),
    s('path', { d: 'M122 92l-6 6M138 92l2 8', ...SW(3) }, 'gray', { stroke: true })
  ],
  artefacto: [
    s('path', { d: 'M110 54l14-34', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 124, cy: 20, r: 5 }, 'red'),
    s('rect', { x: 30, y: 54, width: 100, height: 76, rx: 10 }, 'gray', { accent: true }),
    s('rect', { x: 40, y: 64, width: 44, height: 34, rx: 4 }, 'mint'),
    s('path', { d: 'M44 82q5-10 10 0t10 0 10 0', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: dots([[108, 74], [108, 106]], 9) }, 'red'),
    s('path', { d: rects([[42, 108, 10, 10], [58, 108, 10, 10], [74, 108, 10, 10]]) }, 'dark')
  ],
  caldera: [
    s('path', { d: 'M34 142l92-10M34 132l92 10', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: drop(56, 124, 8) + drop(80, 120, 10) + drop(104, 124, 8) }, 'orange'),
    s('path', { d: 'M30 58h100q4 56-50 56t-50-56z' }, 'black', { accent: true }),
    s('rect', { x: 24, y: 52, width: 112, height: 10, rx: 5 }, 'dark'),
    s('path', { d: dots([[60, 46], [84, 42], [104, 46]], 7) }, 'green'),
    s('path', { d: ring(72, 28, 5) + ring(94, 22, 4), ...SW(2) }, 'green', { stroke: true })
  ],
  callejero: [
    s('path', { d: 'M20 36l40-14 40 14 40-14v104l-40 14-40-14-40 14z' }, 'cream'),
    s('path', { d: 'M20 72l120-20M20 106l120-24M44 30v104M120 28v104', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M20 36l40-14 40 14 40-14v104l-40 14-40-14-40 14zM60 22v104M100 36v104', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M92 80q-14-14-14-26a14 14 0 0 1 28 0q0 12-14 26z' }, 'red', { accent: true }),
    s('circle', { cx: 92, cy: 54, r: 5 }, 'white')
  ],
  contable: [
    s('rect', { x: 26, y: 24, width: 64, height: 100, rx: 8 }, 'dark'),
    s('rect', { x: 34, y: 32, width: 48, height: 20, rx: 3 }, 'mint'),
    s('path', { d: rects(Array.from({ length: 12 }, (_, k) => [36 + (k % 3) * 16, 60 + Math.floor(k / 3) * 15, 12, 10])) }, 'gray'),
    s('rect', { x: 68, y: 105, width: 12, height: 10 }, 'orange', { accent: true }),
    s('rect', { x: 100, y: 56, width: 40, height: 68, rx: 3 }, 'green'),
    s('path', { d: 'M108 72h24M108 86h24M108 100h24', ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 120, cy: 136, r: 8 }, 'yellow')
  ],
  'contención': [
    s('path', { d: 'M14 40h60v106H14z' }, 'blue'),
    s('path', { d: 'M14 40q10-6 20 0t20 0 20 0', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M104 130h42v16h-42z' }, 'sky'),
    s('path', { d: 'M70 30h22l12 116H66z' }, 'gray', { accent: true }),
    s('path', { d: 'M74 50h22M74 80h26M72 110h30', ...SW(2) }, 'dark', { stroke: true })
  ],
  convergencia: [
    s('path', { d: 'M18 24L104 80M18 80h86M18 136L104 80', ...SW(6) }, 'blue', { stroke: true }),
    s('circle', { cx: 116, cy: 80, r: 16 }, 'orange', { accent: true }),
    s('path', { d: dots([[18, 24], [18, 80], [18, 136]], 7) }, 'navy')
  ],
  convincente: [
    ground(),
    ...person(40, 136, 'purple', { accent: true, h: 50 }),
    s('path', { d: 'M54 100l22-20', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: busts([96, 132], 136, 24, 26) }, 'blue'),
    s('path', { d: dots([[96, 100], [132, 100]], 9) }, 'skin'),
    s('path', { d: 'M88 74l6 6 10-12M124 74l6 6 10-12', ...SW(4) }, 'green', { stroke: true })
  ],
  desgaste: [
    s('path', { d: 'M20 112q0-30 24-34l28-6q10-30 34-30h16v60q12 4 18 16v14H20z' }, 'brown', { accent: true }),
    s('rect', { x: 18, y: 120, width: 124, height: 12, rx: 4 }, 'dark'),
    s('path', { d: ells([[56, 126, 12, 5], [100, 127, 6, 3]]) }, 'white'),
    s('path', { d: 'M40 100l8-8M60 96l10 6M96 60l8 4', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M108 42l-4-12M116 42l2-12M124 42l6-10', ...SW(2) }, 'brown', { stroke: true })
  ],
  'discreción': [
    s('circle', { cx: 80, cy: 78, r: 50 }, 'skin'),
    s('path', { d: 'M54 68q7-5 14 0M92 68q7-5 14 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 100h32', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[80, 134, 16, 10]]) }, 'tan'),
    s('rect', { x: 73, y: 78, width: 14, height: 52, rx: 7 }, 'tan', { accent: true })
  ],
  divertir: [
    s('circle', { cx: 80, cy: 84, r: 48 }, 'yellow', { accent: true }),
    s('path', { d: 'M54 76q8-10 16 0M90 76q8-10 16 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 96h52q0 28-26 28t-26-28z' }, 'dark'),
    s('path', { d: 'M66 116q14-8 28 0q-14 8-28 0z' }, 'pink'),
    s('path', { d: drop(40, 84, 4) + drop(120, 84, 4) }, 'sky'),
    s('path', { d: sparkle(26, 30, 8) + sparkle(134, 34, 8) }, 'orange')
  ],
  dorsal: [
    s('path', { d: 'M40 100q20-10 30-66q30 30 46 66z' }, 'gray', { accent: true }),
    s('path', { d: 'M14 100h132v34a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'blue'),
    s('path', { d: 'M14 100q16-8 33 0t33 0 33 0 33 0', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: 'M24 122q16-6 32 0M96 132q16-6 32 0', ...SW(3) }, 'sky', { stroke: true })
  ],
  educado: [
    ground(),
    s('path', { d: 'M34 112l2-14h16l2 14zM28 112h32v4H28z' }, 'black'),
    ...lean(76, 136, 26, 'navy', { accent: true }),
    s('path', { d: 'M74 104l-24 6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M86 102l8 10', ...SW(4) }, 'red', { stroke: true })
  ],
  entusiasta: [
    ...person(70, 136, 'red', { accent: true }),
    s('path', { d: 'M84 100l18-38M56 100L40 76', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M102 64V18', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M102 18l40 12-40 12z' }, 'yellow'),
    s('ellipse', { cx: 70, cy: 82, rx: 4, ry: 3 }, 'dark'),
    s('path', { d: sparkle(28, 50, 8) + sparkle(130, 76, 7) }, 'orange')
  ],
  'estadía': [
    s('path', { d: 'M44 18a20 20 0 1 0 22 28a16 16 0 1 1-22-28z' }, 'yellow'),
    s('rect', { x: 100, y: 52, width: 34, height: 30, rx: 4 }, 'orange'),
    s('path', { d: 'M110 52v-6h14v6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 74v62M18 110h124v26', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 48, y: 82, width: 94, height: 28, rx: 6 }, 'blue', { accent: true }),
    s('rect', { x: 22, y: 88, width: 26, height: 16, rx: 6 }, 'white'),
    s('rect', { x: 22, y: 88, width: 26, height: 16, rx: 6, ...SW(2) }, 'gray', { stroke: true })
  ],
  exportar: [
    s('path', { d: 'M60 14v132', ...DASH(3, '8 6') }, 'gray', { stroke: true }),
    s('rect', { x: 16, y: 70, width: 36, height: 30, rx: 2 }, 'tan'),
    s('path', { d: 'M16 85h36', ...SW(3) }, 'brown', { stroke: true }),
    arrow('M36 58q30-36 74-8M98 40l12 10-14 6', 'orange', 5),
    s('path', { d: rects([[88, 92, 16, 14], [106, 92, 16, 14], [124, 92, 14, 14]]) }, 'green'),
    s('path', { d: 'M74 106h72l-10 18H82z' }, 'red', { accent: true }),
    s('path', { d: 'M68 134q10-6 20 0t20 0 20 0 18 0', ...SW(3) }, 'blue', { stroke: true })
  ],
  ey: [
    ground(),
    ...person(64, 136, 'orange', { accent: true }),
    s('path', { d: 'M78 98l20-40', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 100, cy: 52, r: 9 }, 'skin'),
    s('path', { d: 'M114 40q8 6 6 16M122 32q12 10 8 26', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[59, 76], [69, 76]], 2) }, 'dark'),
    s('ellipse', { cx: 64, cy: 84, rx: 4, ry: 3 }, 'dark')
  ],
  'fijación': [
    s('rect', { x: 18, y: 24, width: 124, height: 112, rx: 6 }, 'brown'),
    s('rect', { x: 26, y: 32, width: 108, height: 96, rx: 3 }, 'tan'),
    s('rect', { x: 50, y: 50, width: 60, height: 60, rx: 2, transform: 'rotate(-6 80 80)' }, 'yellow'),
    s('path', { d: 'M60 78h40M60 92h28', ...SW(3), transform: 'rotate(-6 80 80)' }, 'orange', { stroke: true }),
    s('path', { d: 'M80 54v12', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 50, r: 9 }, 'red', { accent: true })
  ],
  forense: [
    s('ellipse', { cx: 58, cy: 78, rx: 40, ry: 50 }, 'cream', { accent: true }),
    s('path', { d: ells([[58, 78, 8, 12], [58, 78, 16, 22], [58, 78, 24, 32], [58, 78, 32, 42]]), ...SW(4) }, 'navy', { stroke: true }),
    s('circle', { cx: 100, cy: 92, r: 26, ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M118 110l22 22', ...SW(10) }, 'dark', { stroke: true })
  ],
  fuero: [
    s('rect', { x: 34, y: 30, width: 92, height: 100 }, 'cream'),
    s('rect', { x: 26, y: 22, width: 108, height: 14, rx: 7 }, 'tan'),
    s('rect', { x: 26, y: 124, width: 108, height: 14, rx: 7 }, 'tan'),
    s('path', { d: 'M48 52h64M48 66h64M48 80h64M48 94h36', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M104 116l-4 18M112 116l4 18', ...SW(4) }, 'red', { stroke: true }),
    s('circle', { cx: 108, cy: 108, r: 12 }, 'red', { accent: true })
  ],
  guay: [
    s('circle', { cx: 80, cy: 84, r: 48 }, 'yellow'),
    s('path', { d: 'M34 72h92', ...SW(5) }, 'black', { stroke: true }),
    s('path', { d: 'M40 70h34q0 22-17 22t-17-22zM86 70h34q0 22-17 22t-17-22z' }, 'black', { accent: true }),
    s('path', { d: 'M48 76l8-4M94 76l8-4', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M60 108q20 14 40-4', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(126, 30, 10) }, 'orange')
  ],
  guiar: [
    ground(),
    s('path', { d: busts([28, 60], 136, 24, 30) }, 'blue'),
    s('path', { d: dots([[28, 96], [60, 96]], 10) }, 'skin'),
    ...person(108, 136, 'orange', { accent: true }),
    s('path', { d: 'M122 100h6M128 104V30', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M128 30h18l-5 8 5 8h-18z' }, 'red')
  ],
  hidrocarburo: [
    s('path', { d: drop(50, 92, 30) }, 'black', { accent: true }),
    s('path', { d: 'M36 84q0-12 8-20', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 70h24l-12 24zM100 70l-8-16M124 70l8-16M112 94v20', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[100, 70], [124, 70], [112, 94]], 9) }, 'dark'),
    s('path', { d: dots([[92, 54], [132, 54], [112, 116]], 6) }, 'white'),
    s('path', { d: ring(92, 54, 6) + ring(132, 54, 6) + ring(112, 116, 6), ...SW(2) }, 'gray', { stroke: true })
  ],
  indiscutible: [
    s('rect', { x: 24, y: 130, width: 112, height: 12, rx: 3 }, 'brown'),
    s('path', { d: 'M36 130V50a44 34 0 0 1 88 0v80z' }, 'gray', { accent: true }),
    s('path', { d: 'M36 130V50a44 34 0 0 1 88 0v80z', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 84l18 18 34-34', ...SW(12) }, 'green', { stroke: true })
  ],
  inevitablemente: [
    s('path', { d: 'M40 18h80M40 142h80', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M48 22h64q0 34-28 54v8q28 20 28 54H48q0-34 28-54v-8Q48 56 48 22z' }, 'sky'),
    s('path', { d: 'M66 50h28q-4 14-14 20q-10-6-14-20zM50 138q4-24 30-30q26 6 30 30z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 70v38', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M48 22h64q0 34-28 54v8q28 20 28 54H48q0-34 28-54v-8Q48 56 48 22z', ...SW(3) }, 'gray', { stroke: true })
  ],
  infame: [
    s('rect', { x: 34, y: 18, width: 92, height: 122, rx: 3 }, 'tan'),
    s('rect', { x: 34, y: 18, width: 92, height: 122, rx: 3, ...SW(3) }, 'brown', { stroke: true }),
    s('rect', { x: 46, y: 28, width: 68, height: 14 }, 'red', { accent: true }),
    s('path', { d: busts([80], 120, 50, 30) }, 'dark'),
    s('circle', { cx: 80, cy: 76, r: 18 }, 'gray'),
    s('path', { d: 'M64 74h32', ...SW(6) }, 'black', { stroke: true }),
    s('path', { d: 'M50 130h60', ...SW(4) }, 'brown', { stroke: true })
  ],
  instar: [
    ground(),
    ...lean(52, 136, 18, 'blue'),
    ...lean(100, 136, 10, 'orange', { accent: true }),
    s('path', { d: 'M72 100l16-4', ...SW(7) }, 'skin', { stroke: true }),
    arrow('M112 46h26M128 36l10 10-10 10', 'red', 5),
    s('path', { d: 'M18 92h12M14 108h14', ...SW(3) }, 'gray', { stroke: true })
  ],
  intendencia: [
    ground(),
    s('rect', { x: 66, y: 30, width: 28, height: 50 }, 'tan'),
    s('path', { d: 'M62 32l18-18 18 18z' }, 'red'),
    s('circle', { cx: 80, cy: 50, r: 9 }, 'white'),
    s('path', { d: 'M80 44v6h5', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 22, y: 78, width: 116, height: 58 }, 'cream'),
    s('path', { d: 'M16 82l64-20 64 20z' }, 'red'),
    s('path', { d: 'M36 92v44M54 92v44M106 92v44M124 92v44', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 68, y: 108, width: 24, height: 28, rx: 8 }, 'brown', { accent: true })
  ],
  intermediario: [
    ground(),
    ...person(24, 136, 'blue', { h: 40, w: 22, r: 10 }),
    ...person(136, 136, 'green', { h: 40, w: 22, r: 10 }),
    ...person(80, 136, 'purple', { accent: true }),
    s('path', { d: 'M66 102H36M94 102h30', ...SW(6) }, 'skin', { stroke: true })
  ],
  'irlandés': [
    s('path', { d: 'M80 92q6 30 22 46', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: heart(80, 70, 22) }, 'green', { accent: true }),
    s('path', { d: heart(80, 70, 22), transform: 'rotate(120 80 92)' }, 'green'),
    s('path', { d: heart(80, 70, 22), transform: 'rotate(240 80 92)' }, 'green'),
    s('path', { d: 'M80 92V62M80 92l26 15M80 92l-26 15', ...SW(2) }, 'mint', { stroke: true })
  ],
  itinerario: [
    s('path', { d: 'M30 122q20-50 50-30t50-52', ...DASH(4, '6 7') }, 'gray', { stroke: true }),
    s('path', { d: dots([[30, 122], [80, 92]], 10) }, 'blue'),
    s('path', { d: dots([[30, 122], [80, 92]], 4) }, 'white'),
    s('path', { d: 'M130 42V14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M130 14h16l-4 6 4 6h-16z' }, 'red', { accent: true }),
    s('path', { d: jet(42, 50), transform: 'rotate(50 42 50)' }, 'gray')
  ],
  legendario: [
    s('path', { d: 'M28 142q4-44 52-46q48 2 52 46z' }, 'gray'),
    s('path', { d: 'M74 46h12v58H74z' }, 'sky'),
    s('rect', { x: 60, y: 40, width: 40, height: 8, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M80 40V24', ...SW(8) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 20, r: 6 }, 'yellow'),
    s('path', { d: sparkle(44, 52, 8) + sparkle(118, 44, 8) + sparkle(124, 82, 5) }, 'yellow')
  ],
  'legión': [
    s('path', { d: [32, 80, 128].map(x => `M${x + 22} 142V58`).join(''), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: [32, 80, 128].map(x => `M${x - 16} 72q16-30 32 0z`).join('') }, 'red', { accent: true }),
    s('path', { d: [32, 80, 128].map(x => `M${x - 18} 96a18 22 0 0 1 36 0v8h-6v-6h-24v6h-6z`).join('') }, 'gray'),
    s('path', { d: rects([[18, 106, 28, 36], [66, 106, 28, 36], [114, 106, 28, 36]]) }, 'red'),
    s('path', { d: dots([[32, 124], [80, 124], [128, 124]], 5) }, 'yellow')
  ],
  machismo: [
    ground(),
    s('path', { d: 'M48 70l-20 10 2-26M96 70l20 10-2-26', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: dots([[30, 52], [114, 52]], 8) }, 'skin'),
    s('path', { d: 'M48 64h48l-6 72H54z' }, 'blue', { accent: true }),
    s('circle', { cx: 72, cy: 44, r: 16 }, 'skin'),
    s('path', { d: 'M64 50q8-4 16 0', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 134, cy: 104, r: 7 }, 'skin'),
    s('path', { d: 'M128 112h12l8 24h-28z' }, 'pink')
  ],
  mosquito: [
    s('ellipse', { cx: 70, cy: 58, rx: 10, ry: 26, transform: 'rotate(-30 70 58)' }, 'sky'),
    s('ellipse', { cx: 98, cy: 56, rx: 10, ry: 26, transform: 'rotate(25 98 56)' }, 'sky'),
    s('path', { d: 'M70 90l-24 30M80 92l-8 40M92 92l14 38M100 88l28 30M66 86l-34 4M104 84h32', ...SW(2) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 92, cy: 84, rx: 30, ry: 8, transform: 'rotate(-15 92 84)' }, 'dark', { accent: true }),
    s('circle', { cx: 56, cy: 92, r: 9 }, 'dark'),
    s('path', { d: 'M48 96l-20 12', ...SW(2) }, 'dark', { stroke: true })
  ],
  mota: [
    s('path', { d: 'M18 58L58 18l88 88-40 40z' }, 'cream'),
    s('rect', { x: 18, y: 18, width: 40, height: 40, rx: 2 }, 'sky'),
    s('path', { d: 'M38 18v40M18 38h40', ...SW(3) }, 'white', { stroke: true }),
    outline({ x: 18, y: 18, width: 40, height: 40 }, 'brown', 4),
    s('path', { d: dots([[66, 70], [86, 84], [100, 72], [78, 104], [110, 110], [122, 96], [96, 122]], 2.5) }, 'brown', { accent: true })
  ],
  nalga: [
    s('path', { d: 'M34 30h92l8 110h-46l-8-56-8 56H26z' }, 'blue', { accent: true }),
    s('rect', { x: 34, y: 30, width: 92, height: 10 }, 'navy'),
    s('path', { d: 'M44 52h28v22l-14 6-14-6zM88 52h28v22l-14 6-14-6z' }, 'navy'),
    s('path', { d: 'M80 40v42M50 30v10M110 30v10', ...SW(2) }, 'sky', { stroke: true })
  ],
  nominal: [
    ...person(80, 140, 'blue', { h: 70, w: 60, r: 22 }),
    s('rect', { x: 70, y: 82, width: 36, height: 24, rx: 3 }, 'white'),
    s('rect', { x: 70, y: 82, width: 36, height: 8, rx: 3 }, 'red', { accent: true }),
    outline({ x: 70, y: 82, width: 36, height: 24, rx: 3 }),
    s('path', { d: 'M76 98h24', ...SW(3) }, 'gray', { stroke: true })
  ],
  ofensa: [
    s('path', { d: burst(56, 50, 42, 28, 10) }, 'red', { accent: true }),
    s('path', { d: 'M38 50q6-8 12 0t12 0 12 0', ...SW(4) }, 'white', { stroke: true }),
    ground(),
    ...person(116, 136, 'green'),
    s('path', { d: 'M110 86q6-4 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: dots([[111, 76], [121, 76]], 2) }, 'dark'),
    s('path', { d: drop(128, 84, 3) }, 'sky')
  ],
  pastoral: [
    s('path', { d: 'M14 110q40-30 80-6t52-8v50H14z' }, 'green'),
    ...person(44, 120, 'brown', { accent: true }),
    s('path', { d: 'M66 124V48q0-12 10-12t10 10', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M58 88h8', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M102 122v12M120 122v12', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[110, 114, 20, 13]]) }, 'white'),
    s('path', { d: ells([[132, 108, 7, 9]]) }, 'dark')
  ],
  portador: [
    ground(),
    ...lean(64, 136, 8, 'blue', { accent: true }),
    s('path', { d: 'M78 96l12-26', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M92 74V48', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 84, y: 40, width: 16, height: 8, rx: 2 }, 'gray'),
    s('path', { d: drop(92, 26, 8) }, 'orange'),
    s('path', { d: drop(92, 30, 4) }, 'yellow'),
    s('path', { d: 'M24 90h14M20 106h16', ...SW(3) }, 'gray', { stroke: true })
  ],
  raramente: [
    s('rect', { x: 22, y: 26, width: 116, height: 112, rx: 6 }, 'white'),
    outline({ x: 22, y: 26, width: 116, height: 112, rx: 6 }),
    s('path', { d: 'M22 32a6 6 0 0 1 6-6h104a6 6 0 0 1 6 6v16H22z' }, 'blue'),
    s('path', { d: grid(32, 58, 5, 4, 14, 12, 21, 19) }, 'gray'),
    s('rect', { x: 95, y: 96, width: 14, height: 12 }, 'red', { accent: true }),
    s('circle', { cx: 102, cy: 102, r: 13, ...SW(3) }, 'red', { stroke: true })
  ],
  reciclaje: [
    s('path', { d: 'M40 56h80l-8 82H48z' }, 'green', { accent: true }),
    s('rect', { x: 34, y: 46, width: 92, height: 12, rx: 4 }, 'dark'),
    s('path', { d: [-80, 40, 160].map(a => { const [p, q] = [around(80, 98, 20, 1, a)[0], around(80, 98, 20, 1, a + 85)[0]]; return `M${p[0]} ${p[1]}A20 20 0 0 1 ${q[0]} ${q[1]}`; }).join(''), ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: [-80, 40, 160].map(a => poly([around(80, 98, 20, 1, a + 108)[0], around(80, 98, 13, 1, a + 88)[0], around(80, 98, 27, 1, a + 88)[0]])).join('') }, 'white'),
    s('path', { d: 'M64 46V30h8v-8h8v8h8v16', ...SW(3) }, 'sky', { stroke: true })
  ],
  'recreación': [
    s('path', { d: 'M14 120q66-16 132 0v26H14z' }, 'green'),
    s('path', { d: 'M110 64q8 6 4 14t6 14', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M110 64q-12 30-44 40', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 20l18 20-18 24-18-24z' }, 'red', { accent: true }),
    s('path', { d: 'M110 20v44M92 40h36', ...SW(2) }, 'dark', { stroke: true }),
    ...person(52, 128, 'orange'),
    s('path', { d: 'M64 96l4 8', ...SW(6) }, 'skin', { stroke: true })
  ],
  restablecer: [
    ...gear(80, 80, 22, 10, 'gray', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 9 }, 'white'),
    s('path', { d: 'M32 80a48 48 0 1 1 14 34', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: poly([[40.3, 108.3], [53.7, 111.9], [43.9, 121.7]]) }, 'green')
  ],
  rosado: [
    s('path', { d: 'M46 50h36q-2 24-18 26q-16-2-18-26z' }, 'pink', { accent: true }),
    s('path', { d: 'M44 30h40q0 46-20 46q-20 0-20-46zM64 76v44M48 122h32', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M114 88v48', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(114, 116, -30, 18, 6) }, 'green'),
    s('circle', { cx: 114, cy: 72, r: 18 }, 'pink'),
    s('path', { d: spiral(111, 72), ...SW(3) }, 'red', { stroke: true })
  ],
  secular: [
    ground(),
    s('path', { d: 'M56 136q6-20 4-50h24q-2 30 4 50z' }, 'brown'),
    s('path', { d: ells([[72, 56, 46, 32], [42, 72, 20, 16], [100, 70, 20, 14]]) }, 'green', { accent: true }),
    s('path', { d: 'M114 94h24M114 136h24', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M118 96h16l-8 18 8 20h-16l8-20z' }, 'sky'),
    s('path', { d: 'M119 134h14l-7-10z' }, 'yellow')
  ],
  'seña': [
    s('path', { d: 'M24 48q-8 12 0 24M136 48q8 12 0 24', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 76V40M70 74V30M82 74V30M94 76V40M54 102L36 86', ...SW(11) }, 'skin', { stroke: true }),
    s('rect', { x: 50, y: 70, width: 52, height: 52, rx: 16 }, 'skin', { accent: true }),
    s('rect', { x: 56, y: 118, width: 40, height: 26, rx: 4 }, 'blue')
  ],
  silencioso: [
    s('path', { d: 'M24 64h22l30-26v84L46 96H24z' }, 'dark', { accent: true }),
    s('path', { d: 'M94 64q10 16 0 32M108 54q18 26 0 52', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M88 44l48 72', ...SW(7) }, 'red', { stroke: true })
  ],
  tambor: [
    s('path', { d: 'M52 18l26 46M112 22L86 64', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M28 72v46a52 14 0 0 0 104 0V72z' }, 'blue', { accent: true }),
    s('path', { d: 'M28 82l26 36 26-36 26 36 26-36', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M28 118a52 14 0 0 0 104 0', ...SW(5) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 80, cy: 72, rx: 52, ry: 14 }, 'cream'),
    s('ellipse', { cx: 80, cy: 72, rx: 52, ry: 14, ...SW(4) }, 'gray', { stroke: true })
  ],
  terriblemente: [
    s('path', { d: ells([[54, 40, 24, 18], [84, 32, 28, 22], [112, 42, 22, 16]]) + 'M34 46h96v12H34z' }, 'dark'),
    s('path', { d: 'M88 58l-12 22h14l-12 24', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: drop(118, 80, 4) + drop(130, 100, 4) + drop(110, 108, 4) }, 'sky'),
    s('circle', { cx: 50, cy: 112, r: 26 }, 'skin', { accent: true }),
    s('path', { d: ells([[42, 106, 6, 7], [58, 106, 6, 7]]) }, 'white'),
    s('path', { d: dots([[42, 106], [58, 106]], 2.5) }, 'dark'),
    s('path', { d: 'M40 124q5-5 10 0t10 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  victimar: [
    ground(),
    s('path', { d: 'M50 136V64a30 30 0 0 1 60 0v72z' }, 'gray', { accent: true }),
    s('path', { d: 'M64 80h32M64 94h32M64 108h20', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M36 136v-12M124 136v-12', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: dots([[36, 120], [124, 120]], 6) }, 'red'),
    s('path', { d: ells([[56, 26, 16, 10], [74, 20, 18, 12]]) }, 'gray')
  ],
  agir: [
    s('rect', { x: 26, y: 118, width: 76, height: 16, rx: 4 }, 'brown'),
    s('path', { d: 'M64 96l60-40', ...SW(7) }, 'brown', { stroke: true }),
    s('rect', { x: 42, y: 85, width: 44, height: 22, rx: 4, transform: 'rotate(56 64 96)' }, 'dark', { accent: true }),
    s('path', { d: 'M36 108l-10-8M92 110l12-6M60 126v0', ...SW(4) }, 'orange', { stroke: true })
  ],
  'agitación': [
    s('path', { d: 'M62 40h36l-6 96H68z', transform: 'rotate(-15 80 88)' }, 'gray', { accent: true }),
    s('path', { d: 'M60 30h40v12H60zM70 18h20v12H70z', transform: 'rotate(-15 80 88)' }, 'dark'),
    s('path', { d: 'M36 50l-12 8M36 74H22M36 98l-12-8M124 50l12 8M124 74h14M124 98l12-8', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: drop(42, 30, 4) + drop(110, 22, 4) }, 'sky')
  ],
  arce: [
    s('path', { d: 'M80 108v34', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: poly([[80, 18], [88, 38], [102, 32], [98, 58], [118, 46], [114, 64], [136, 70], [108, 90], [112, 104], [84, 98], [82, 112], [78, 112], [76, 98], [48, 104], [52, 90], [24, 70], [46, 64], [42, 46], [62, 58], [58, 32], [72, 38]]) }, 'red', { accent: true }),
    s('path', { d: 'M80 108V34M80 90l28-22M80 90L52 68', ...SW(2) }, 'orange', { stroke: true })
  ],
  'bastón': [
    ground(),
    ...lean(66, 136, 14, 'purple', { accent: true }),
    s('path', { d: 'M69 78a12 12 0 0 1 24 0z' }, 'gray'),
    s('path', { d: 'M104 136V84q0-10 10-10t10 10', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M84 100l18-12', ...SW(6) }, 'skin', { stroke: true })
  ],
  bendito: [
    s('path', { d: 'M54 40l-26 96h104L106 40z' }, 'cream'),
    s('path', { d: ells([[60, 32, 20, 14], [84, 26, 24, 18], [108, 34, 18, 12]]) }, 'sky'),
    ...person(80, 136, 'blue', { accent: true }),
    s('path', { d: 'M66 98L50 84M94 98l16-14', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(42, 76, 7) + sparkle(120, 70, 8) + sparkle(116, 112, 5) }, 'yellow')
  ],
  boliche: [
    ground(),
    s('path', { d: [96, 116, 136].map(x => `M${x} 48q-8 0-6 14q4 8 0 16q-8 16-4 58h20q4-42-4-58q-4-8 0-16q2-14-6-14z`).join('') }, 'white'),
    s('path', { d: [96, 116, 136].map(x => `M${x} 48q-8 0-6 14q4 8 0 16q-8 16-4 58h20q4-42-4-58q-4-8 0-16q2-14-6-14z`).join(''), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M91 70h10M111 70h10M131 70h10', ...SW(4) }, 'red', { stroke: true }),
    s('circle', { cx: 44, cy: 110, r: 26 }, 'navy', { accent: true }),
    s('path', { d: dots([[36, 100], [48, 98], [42, 110]], 3) }, 'dark')
  ],
  cadera: [
    ground(),
    s('path', { d: 'M68 106v30M92 106v30', ...SW(10) }, 'navy', { stroke: true }),
    s('path', { d: 'M66 58l-18 18 14 12M94 58l18 18-14 12', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 80, cy: 36, r: 14 }, 'skin'),
    s('path', { d: 'M66 54h28l4 36H62z' }, 'purple'),
    s('path', { d: 'M58 88h44l6 18H52z' }, 'pink', { accent: true }),
    s('path', { d: 'M24 98h16M136 98h-16', ...SW(4) }, 'orange', { stroke: true })
  ],
  casamiento: [
    ground(),
    ...person(54, 136, 'black'),
    s('path', { d: 'M48 92h12l-6 14z' }, 'white'),
    s('path', { d: 'M100 70q10-14 22 0l8 34q-12-8-24-8z' }, 'cream'),
    s('path', { d: 'M100 86h16l16 50H84z' }, 'white'),
    s('path', { d: 'M100 86h16l16 50H84z', ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 108, cy: 74, r: 12 }, 'skin'),
    s('path', { d: heart(80, 32, 10) }, 'red', { accent: true })
  ],
  celestial: [
    backdrop('sky'),
    s('path', { d: ells([[50, 104, 26, 16], [78, 96, 28, 20], [106, 106, 24, 15]]) + 'M26 106h104v14H26z' }, 'white'),
    s('path', { d: star(42, 42, 12) + star(118, 34, 9) + star(86, 60, 7) }, 'yellow', { accent: true }),
    s('path', { d: halfRays(78, 100, 32, 42, 5), ...SW(3) }, 'yellow', { stroke: true })
  ],
  comparable: [
    s('circle', { cx: 42, cy: 96, r: 28 }, 'red', { accent: true }),
    s('circle', { cx: 118, cy: 96, r: 28 }, 'orange'),
    s('path', { d: 'M42 68v-12M118 68v-10', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(42, 60, -30, 18, 6) + leaflet(118, 62, -30, 16, 6) }, 'green'),
    s('path', { d: 'M62 40h36M70 32l-8 8 8 8M90 32l8 8-8 8', ...SW(4) }, 'gray', { stroke: true })
  ],
  corporativo: [
    s('rect', { x: 20, y: 40, width: 34, height: 96 }, 'navy'),
    s('rect', { x: 106, y: 22, width: 34, height: 114 }, 'gray'),
    s('path', { d: grid(26, 48, 3, 4, 6, 8, 10, 12) + grid(112, 30, 3, 5, 6, 8, 10, 12) }, 'sky'),
    s('rect', { x: 44, y: 88, width: 72, height: 48, rx: 6 }, 'brown', { accent: true }),
    s('path', { d: 'M66 88v-8h28v8M44 106h72', ...SW(4) }, 'dark', { stroke: true })
  ],
  corresponsal: [
    ground(),
    s('circle', { cx: 116, cy: 46, r: 28 }, 'blue'),
    s('path', { d: 'M100 32q10-6 16 4q-4 10-14 8zM116 58q10-6 18 2q-4 10-14 8z' }, 'green'),
    ...person(52, 136, 'orange', { accent: true, h: 50 }),
    s('path', { d: 'M64 100l8-14', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 66, y: 70, width: 12, height: 18, rx: 6 }, 'dark')
  ],
  corrida: [
    ground(),
    s('path', { d: 'M40 110v26M54 112v24M74 112v24M88 110v26M28 92q-10 6-8 20', ...SW(6) }, 'black', { stroke: true }),
    s('path', { d: ells([[62, 96, 34, 20]]) }, 'black'),
    s('ellipse', { cx: 100, cy: 100, rx: 14, ry: 12 }, 'black'),
    s('path', { d: 'M94 90q2-14 12-14M106 92q8-10 18-6', ...SW(4) }, 'cream', { stroke: true }),
    s('path', { d: 'M120 70h24l-4 50q-14 6-24-4z' }, 'red', { accent: true }),
    s('path', { d: ells([[20, 132, 6, 3], [30, 128, 5, 3]]) }, 'tan')
  ],
  cresta: [
    s('path', { d: 'M58 140q-8-48 14-70q22-20 44 0q10 14 0 30l-10 40z' }, 'orange'),
    s('path', { d: 'M68 62q-4-20 8-20q0-14 12-10q4-12 14-4q10-4 10 8q8 4 2 14q-20 4-46 12z' }, 'red', { accent: true }),
    s('path', { d: 'M116 72l20 6-20 6z' }, 'yellow'),
    s('path', { d: ells([[110, 96, 6, 10]]) }, 'red'),
    s('circle', { cx: 100, cy: 74, r: 4 }, 'dark')
  ],
  'creíble': [
    s('path', { d: 'M14 80h40', ...SW(22, { 'stroke-linecap': 'butt' }) }, 'blue', { stroke: true }),
    s('path', { d: 'M146 80h-40', ...SW(22, { 'stroke-linecap': 'butt' }) }, 'green', { stroke: true }),
    s('path', { d: ells([[80, 84, 28, 17]]) }, 'skin', { accent: true }),
    s('path', { d: 'M66 78h26M68 86h26M70 94h20', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: heart(80, 38, 10) }, 'pink')
  ],
  cuarentena: [
    ground(),
    s('rect', { x: 34, y: 66, width: 92, height: 70 }, 'tan', { accent: true }),
    s('path', { d: 'M24 70l56-44 56 44z' }, 'red'),
    s('rect', { x: 62, y: 80, width: 36, height: 30 }, 'sky'),
    s('path', { d: 'M68 110a12 10 0 0 1 24 0z' }, 'blue'),
    s('circle', { cx: 80, cy: 94, r: 8 }, 'skin'),
    s('rect', { x: 74, y: 96, width: 12, height: 6, rx: 2 }, 'white'),
    s('path', { d: 'M14 128L146 108', ...SW(10) }, 'yellow', { stroke: true }),
    s('path', { d: 'M14 128L146 108', ...DASH(10, '8 8') }, 'black', { stroke: true })
  ],
  desviar: [
    s('rect', { x: 62, y: 14, width: 36, height: 132 }, 'gray'),
    s('path', { d: 'M80 20v14M80 100v14M80 130v12', ...SW(3) }, 'white', { stroke: true }),
    s('rect', { x: 52, y: 60, width: 56, height: 14, rx: 3 }, 'orange', { accent: true }),
    s('path', { d: 'M62 60l6 14M78 60l6 14M94 60l6 14', ...SW(3) }, 'white', { stroke: true }),
    arrow('M80 124q0-14 34-22q22-10 20-36q-4-26-34-34M110 24l-10 8 12 6', 'blue', 5)
  ],
  encantador: [
    s('path', { d: 'M30 130l64-64', ...SW(8) }, 'black', { stroke: true }),
    s('path', { d: 'M86 74l8-8', ...SW(8) }, 'white', { stroke: true }),
    s('path', { d: star(108, 52, 20) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(62, 40, 8) + sparkle(138, 92, 8) + sparkle(130, 20, 6) }, 'purple'),
    s('path', { d: heart(118, 112, 12) }, 'pink')
  ],
  equipar: [
    s('path', { d: 'M40 76L32 42M120 76l6-28', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 40l8-6 8 6-4 8h-8z' }, 'gray'),
    s('rect', { x: 120, y: 22, width: 12, height: 24, rx: 4, transform: 'rotate(12 126 34)' }, 'yellow'),
    s('rect', { x: 22, y: 76, width: 116, height: 60, rx: 6 }, 'red', { accent: true }),
    s('path', { d: 'M60 76V62h40v14M22 96h116', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 74, y: 90, width: 12, height: 12, rx: 2 }, 'yellow')
  ],
  facial: [
    s('circle', { cx: 80, cy: 86, r: 48 }, 'skin'),
    s('path', { d: 'M40 74q40-24 80 0v26q-40 36-80 0z' }, 'mint', { accent: true }),
    s('path', { d: dots([[62, 82], [98, 82]], 12) }, 'green'),
    s('path', { d: dots([[62, 82], [98, 82]], 8) }, 'cream'),
    s('path', { d: 'M30 70q50-60 100 0q-50-24-100 0z' }, 'pink'),
    s('path', { d: 'M68 112q12 8 24 0', ...SW(4) }, 'dark', { stroke: true })
  ],
  festejar: [
    ...glass(56, 18, true),
    ...glass(104, -18, false),
    s('path', { d: sparkle(80, 22, 10) + sparkle(44, 24, 6) + sparkle(118, 26, 6) }, 'yellow'),
    s('path', { d: 'M64 30l-6-8M96 30l6-8', ...SW(3) }, 'orange', { stroke: true })
  ],
  fiable: [
    s('path', { d: 'M52 72V52a28 28 0 0 1 56 0v20', ...SW(10) }, 'gray', { stroke: true }),
    s('rect', { x: 38, y: 70, width: 84, height: 66, rx: 10 }, 'yellow', { accent: true }),
    s('path', { d: 'M62 102l12 12 26-26', ...SW(8) }, 'green', { stroke: true })
  ],
  flamenco: [
    s('ellipse', { cx: 84, cy: 140, rx: 30, ry: 5 }, 'sky'),
    s('path', { d: 'M84 102v38M84 112l-12-8 4 14', ...SW(3) }, 'pink', { stroke: true }),
    s('path', { d: ells([[80, 90, 30, 18]]) }, 'pink', { accent: true }),
    s('path', { d: 'M60 86q20-14 40 0q-20 10-40 0z' }, 'red'),
    s('path', { d: 'M104 84q16-20 0-40q-12-16 8-22', ...SW(6) }, 'pink', { stroke: true }),
    s('circle', { cx: 112, cy: 22, r: 7 }, 'pink'),
    s('path', { d: 'M117 20l10 4-6 8z' }, 'black')
  ],
  'galán': [
    s('path', { d: busts([80], 146, 70, 46) }, 'navy', { accent: true }),
    s('path', { d: 'M68 100h24l-12 26z' }, 'white'),
    s('path', { d: 'M70 100l10 6 10-6v12l-10-6-10 6z' }, 'black'),
    s('circle', { cx: 80, cy: 64, r: 26 }, 'skin'),
    s('path', { d: 'M54 62q0-30 28-30q24 0 26 24q-12-12-30-6q-14 4-24 12z' }, 'black'),
    s('path', { d: 'M66 68q4-3 8 0M70 80q10 8 20 0', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 92, cy: 67, r: 3 }, 'dark'),
    s('path', { d: sparkle(116, 84, 7) }, 'yellow')
  ],
  garra: [
    s('path', { d: [[50, 80], [68, 66], [92, 66], [110, 80]].map(([x, y]) => `M${x - 5} ${y - 8}l5-20 5 20z`).join('') }, 'dark'),
    s('path', { d: ells([[80, 98, 46, 40]]) }, 'brown'),
    s('path', { d: ells([[80, 112, 22, 16]]) }, 'tan', { accent: true }),
    s('path', { d: dots([[50, 80], [68, 66], [92, 66], [110, 80]], 9) }, 'tan')
  ],
  'genético': [
    s('path', { d: 'M68 30h24M64 80h32M68 128h24', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M62 52h36M62 106h36', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M56 14Q104 36 80 58T80 102T80 146', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M104 14Q56 36 80 58T80 102T80 146', ...SW(6) }, 'purple', { stroke: true }),
    s('path', { d: dots([[56, 14], [104, 14]], 5) }, 'navy', { accent: true })
  ],
  honra: [
    s('path', { d: 'M104 14H86l-14 52h18z' }, 'blue'),
    s('path', { d: 'M56 14h18l14 52H70z' }, 'red'),
    s('circle', { cx: 80, cy: 98, r: 34 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 98, r: 26, ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: star(80, 100, 16) }, 'orange')
  ],
  'humillación': [
    ground(),
    ...person(80, 136, 'gray'),
    s('path', { d: ells([[72, 80, 7, 9], [88, 80, 7, 9]]) }, 'tan'),
    s('path', { d: ells([[80, 68, 10, 3]]) }, 'pink', { accent: true }),
    s('path', { d: 'M14 60h22M146 56h-22', ...SW(12) }, 'blue', { stroke: true }),
    s('path', { d: 'M36 60h16M124 56h-16', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: drop(98, 66, 4) }, 'sky')
  ],
  insuficiencia: [
    s('path', { d: 'M20 112a60 60 0 0 1 120 0z' }, 'dark'),
    s('path', { d: 'M32 110A48 48 0 0 1 43.2 79.1', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true }),
    s('path', { d: 'M43.2 79.1A48 48 0 0 1 80 62', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'yellow', { stroke: true }),
    s('path', { d: 'M80 62A48 48 0 0 1 128 110', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'green', { stroke: true }),
    s('path', { d: 'M80 110L44 97', ...SW(5) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 110, r: 8 }, 'gray', { accent: true }),
    s('rect', { x: 20, y: 112, width: 120, height: 14, rx: 4 }, 'gray')
  ],
  insurgente: [
    ground(),
    s('path', { d: 'M48 136V24', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M48 24H18l6 13-6 13h30z' }, 'red'),
    ...person(76, 136, 'green', { accent: true }),
    s('path', { d: 'M90 96l10-46M62 100H50', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 101, cy: 44, r: 9 }, 'skin')
  ],
  interrogatorio: [
    { ...backdrop('dark'), accent: true },
    s('path', { d: 'M64 44h32l34 70H30z' }, 'cream'),
    s('path', { d: 'M80 14v20', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 46a18 14 0 0 1 36 0z' }, 'gray'),
    s('path', { d: busts([42], 112, 32, 26) }, 'blue'),
    s('path', { d: busts([118], 112, 32, 26) }, 'red'),
    s('path', { d: dots([[42, 76], [118, 76]], 11) }, 'skin'),
    s('rect', { x: 22, y: 110, width: 116, height: 12 }, 'brown')
  ],
  'iraní': [
    s('path', { d: 'M30 22v-8M42 22v-8M54 22v-8M66 22v-8M78 22v-8M90 22v-8M102 22v-8M114 22v-8M126 22v-8M30 138v8M42 138v8M54 138v8M66 138v8M78 138v8M90 138v8M102 138v8M114 138v8M126 138v8', ...SW(2) }, 'tan', { stroke: true }),
    s('rect', { x: 24, y: 22, width: 112, height: 116, rx: 2 }, 'red', { accent: true }),
    s('rect', { x: 34, y: 32, width: 92, height: 96 }, 'navy'),
    s('path', { d: poly([[80, 44], [112, 80], [80, 116], [48, 80]]) }, 'red'),
    s('path', { d: poly([[80, 60], [96, 80], [80, 100], [64, 80]]) }, 'yellow'),
    s('path', { d: dots([[44, 42], [116, 42], [44, 118], [116, 118]], 4) }, 'yellow')
  ],
  josefino: [
    s('path', { d: 'M14 100l40-56 18 20 20-30 54 66z' }, 'green'),
    s('path', { d: ells([[92, 26, 6, 4], [100, 18, 7, 5]]) }, 'gray'),
    ground(),
    s('path', { d: rects([[22, 92, 22, 44], [48, 80, 26, 56], [78, 96, 20, 40], [102, 86, 28, 50]]) }, 'blue', { accent: true }),
    s('path', { d: grid(52, 88, 2, 4, 6, 6, 12, 11) + grid(108, 94, 2, 3, 6, 6, 12, 12) }, 'sky')
  ],
  malvado: [
    s('path', { d: 'M40 56l-6-36 26 22zM120 56l6-36-26 22z' }, 'red'),
    s('circle', { cx: 80, cy: 84, r: 46 }, 'purple', { accent: true }),
    s('path', { d: 'M54 72l20 8M106 72l-20 8', ...SW(5) }, 'black', { stroke: true }),
    s('path', { d: dots([[64, 86], [96, 86]], 5) }, 'yellow'),
    s('path', { d: 'M54 104q26 22 52 0q-26 8-52 0z' }, 'white')
  ],
  negativamente: [
    s('circle', { cx: 80, cy: 80, r: 50 }, 'red', { accent: true }),
    s('path', { d: 'M52 80h56', ...SW(14) }, 'white', { stroke: true }),
    arrow('M136 104v34M126 128l10 10 10-10', 'dark', 5)
  ],
  'nominación': [
    s('rect', { x: 22, y: 44, width: 116, height: 76, rx: 4 }, 'cream'),
    s('path', { d: 'M26 44h108a4 4 0 0 1 4 4v68a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4V48a4 4 0 0 1 4-4zM22 48l58 40 58-40', ...SW(3) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 90, r: 16 }, 'red', { accent: true }),
    s('path', { d: star(80, 91, 10) }, 'yellow'),
    s('path', { d: sparkle(32, 28, 7) + sparkle(130, 26, 8) }, 'yellow')
  ],
  ocupante: [
    ground(126),
    s('path', { d: 'M44 78l14-26h44l14 26z' }, 'sky'),
    s('path', { d: 'M74 78a12 9 0 0 1 24 0z' }, 'blue'),
    s('circle', { cx: 86, cy: 64, r: 9 }, 'skin'),
    s('rect', { x: 20, y: 76, width: 120, height: 34, rx: 10 }, 'red', { accent: true }),
    s('path', { d: dots([[46, 112], [114, 112]], 12) }, 'dark')
  ],
  originar: [
    s('path', { d: 'M14 82l30-42 30 20 20-30 52 52v16H14z' }, 'gray'),
    s('path', { d: 'M14 96h132v38a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green'),
    s('path', { d: 'M60 66q-10 30 10 50t-4 30', ...SW(10) }, 'blue', { stroke: true }),
    s('circle', { cx: 60, cy: 64, r: 10 }, 'sky', { accent: true }),
    s('path', { d: sparkle(80, 50, 7) + sparkle(42, 48, 5) }, 'white')
  ],
  'padrón': [
    s('rect', { x: 26, y: 18, width: 108, height: 124, rx: 4 }, 'brown', { accent: true }),
    s('rect', { x: 34, y: 26, width: 92, height: 108, rx: 2 }, 'cream'),
    s('path', { d: [56, 82, 108, 134].map(f => busts([46], f, 16, 10)).join('') }, 'blue'),
    s('path', { d: dots([[46, 40], [46, 66], [46, 92], [46, 118]], 6) }, 'skin'),
    s('path', { d: 'M62 46h52M62 72h52M62 98h52M62 124h52', ...SW(4) }, 'gray', { stroke: true })
  ],
  palanca: [
    ground(),
    s('path', { d: 'M44 136l12-28 12 28z' }, 'orange', { accent: true }),
    s('path', { d: 'M18 94L142 134', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M14 92q-2-24 18-28q22 0 22 22z' }, 'gray'),
    arrow('M130 82v26M122 100l8 8 8-8', 'red', 5),
    arrow('M34 54V32M26 40l8-8 8 8', 'green', 4)
  ],
  perdedor: [
    ground(),
    s('path', { d: ells([[60, 36, 18, 13], [82, 30, 22, 17], [102, 38, 16, 12]]) }, 'gray'),
    s('path', { d: 'M62 54l-3 8M82 54l-3 8M100 54l-3 8', ...SW(3) }, 'sky', { stroke: true }),
    ...person(80, 136, 'blue', { accent: true }),
    s('path', { d: dots([[75, 76], [85, 76]], 2) }, 'dark'),
    s('path', { d: 'M74 86q6-4 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 136l4-16h16l4 16z' }, 'gray')
  ],
  peregrino: [
    s('path', { d: 'M14 136q60-12 132 0', ...SW(4) }, 'tan', { stroke: true }),
    s('rect', { x: 46, y: 88, width: 20, height: 30, rx: 6 }, 'brown'),
    ...lean(72, 136, 8, 'green', { accent: true }),
    s('path', { d: 'M64 76h34M70 76l4-12h14l4 12z' }, 'tan'),
    s('path', { d: 'M104 136V60', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M88 100l16-6', ...SW(6) }, 'skin', { stroke: true })
  ],
  perjudicar: [
    s('path', { d: 'M24 20v116h120', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 40l30 20 22-6 22 34 30 30', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M122 106l14 18-22 2z' }, 'red', { accent: true }),
    s('path', { d: 'M86 44l-8 14 10 6-8 14', ...SW(3) }, 'gray', { stroke: true })
  ],
  peronista: [
    s('rect', { x: 46, y: 40, width: 68, height: 50 }, 'cream'),
    s('rect', { x: 40, y: 86, width: 80, height: 10, rx: 2 }, 'gray'),
    ...person(80, 86, 'navy', { h: 28, w: 24, r: 10 }),
    s('path', { d: 'M92 64l14-18', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: busts([28, 56, 84, 112, 140], 146, 24, 22) }, 'blue', { accent: true }),
    s('path', { d: dots([28, 56, 84, 112, 140].map(x => [x, 116]), 8) }, 'skin')
  ],
  'predicción': [
    s('path', { d: 'M46 126h68l-8 14H54z' }, 'brown'),
    s('circle', { cx: 80, cy: 82, r: 44 }, 'purple', { accent: true }),
    s('circle', { cx: 80, cy: 82, r: 34 }, 'sky'),
    s('path', { d: sparkle(80, 80, 14) + sparkle(62, 66, 6) + sparkle(100, 98, 5) }, 'white'),
    s('path', { d: 'M60 52q10-8 22-8', ...SW(4) }, 'white', { stroke: true })
  ],
  presidir: [
    s('rect', { x: 24, y: 96, width: 112, height: 16, rx: 4 }, 'brown'),
    s('path', { d: busts([36, 124], 96, 22, 20) + busts([80], 96, 34, 36) }, 'gray'),
    s('path', { d: busts([80], 96, 34, 36) }, 'navy', { accent: true }),
    s('path', { d: dots([[36, 68], [124, 68]], 9) }, 'skin'),
    s('circle', { cx: 80, cy: 46, r: 14 }, 'skin'),
    s('path', { d: 'M80 64l-4 12 4 6 4-6z' }, 'red'),
    s('path', { d: 'M40 112v26M120 112v26', ...SW(6) }, 'brown', { stroke: true })
  ],
  raer: [
    s('rect', { x: 14, y: 20, width: 80, height: 120 }, 'blue'),
    s('path', { d: 'M60 60h34v80H60z' }, 'tan'),
    s('rect', { x: 52, y: 54, width: 30, height: 8, rx: 2, transform: 'rotate(-20 67 58)' }, 'gray'),
    s('path', { d: 'M80 52l40-30', ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('rect', { x: 112, y: 14, width: 28, height: 14, rx: 6, transform: 'rotate(-37 126 21)' }, 'red', { accent: true }),
    s('path', { d: poly([[100, 80], [108, 84], [102, 90]]) + poly([[110, 104], [120, 106], [114, 114]]) + poly([[96, 124], [104, 130], [96, 134]]) }, 'blue')
  ],
  rapero: [
    s('path', { d: busts([80], 146, 76, 44) }, 'purple', { accent: true }),
    s('circle', { cx: 80, cy: 70, r: 26 }, 'skin'),
    s('path', { d: 'M54 66a26 24 0 0 1 52 0zM96 62h22v6H96z' }, 'red'),
    s('path', { d: 'M62 104q18 22 36 0', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[72, 76], [88, 76]], 3) }, 'dark'),
    s('path', { d: 'M110 140l14-36', ...SW(5) }, 'skin', { stroke: true }),
    s('rect', { x: 118, y: 80, width: 14, height: 26, rx: 7 }, 'dark')
  ],
  recipiente: [
    s('rect', { x: 46, y: 22, width: 68, height: 14, rx: 4 }, 'red', { accent: true }),
    s('rect', { x: 40, y: 36, width: 80, height: 100, rx: 14 }, 'sky'),
    s('path', { d: 'M44 80h72v40q0 12-12 12H56q-12 0-12-12z' }, 'orange'),
    s('path', { d: dots([[58, 92], [74, 100], [92, 90], [104, 106], [64, 116], [86, 120]], 4) }, 'brown'),
    s('rect', { x: 40, y: 36, width: 80, height: 100, rx: 14, ...SW(3) }, 'gray', { stroke: true })
  ],
  reclutamiento: [
    s('path', { d: 'M30 30v34a20 20 0 0 0 40 0V30', ...SW(16, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true }),
    s('path', { d: 'M30 30v10M70 30v10', ...SW(16, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M84 70l14 0M86 56l12-6M86 84l12 6', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: busts([108, 136], 146, 24, 30) }, 'blue', { accent: true }),
    s('path', { d: dots([[108, 104], [136, 104]], 10) }, 'skin'),
    arrow('M126 70h-20M112 64l-6 6 6 6', 'gray', 3)
  ],
  regulador: [
    s('path', { d: 'M14 110h40M106 110h40', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('rect', { x: 52, y: 92, width: 56, height: 36, rx: 6 }, 'dark'),
    s('path', { d: 'M80 92V76', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 50, r: 30 }, 'white'),
    s('path', { d: 'M58 62a24 24 0 0 1 10-30', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M92 28a24 24 0 0 1 10 34', ...SW(5) }, 'red', { stroke: true }),
    s('circle', { cx: 80, cy: 50, r: 30, ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M80 50l-12-14', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 50, r: 4 }, 'orange', { accent: true })
  ],
  repentinamente: [
    s('rect', { x: 36, y: 96, width: 88, height: 44, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M36 96l-14-14M124 96l14-14', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M80 96q-14-6 0-12t0-12 0-12', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 46, r: 20 }, 'yellow'),
    s('path', { d: dots([[73, 42], [87, 42]], 3) }, 'dark'),
    s('ellipse', { cx: 80, cy: 54, rx: 5, ry: 4 }, 'dark'),
    s('path', { d: 'M48 30l-12-8M112 30l12-8M44 52H28M116 52h16', ...SW(4) }, 'orange', { stroke: true })
  ],
  sinopsis: [
    s('rect', { x: 16, y: 22, width: 52, height: 116, rx: 3 }, 'dark'),
    s('path', { d: rects([[24, 32, 36, 26], [24, 66, 36, 26], [24, 100, 36, 26]]) }, 'sky'),
    s('path', { d: 'M20 28v108M64 28v108', ...DASH(3, '4 5') }, 'white', { stroke: true }),
    ...paper(80, 42, 64, 76),
    s('path', { d: 'M90 58h44M90 72h44M90 86h30', ...SW(4) }, 'gray', { stroke: true }),
    arrow('M66 80h12', 'orange', 4),
    s('rect', { x: 90, y: 98, width: 24, height: 10 }, 'yellow', { accent: true })
  ],
  'sistemáticamente': [
    s('path', { d: 'M48 40h28M80 52v28M80 100h28M100 112v12', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 18, y: 28, width: 30, height: 24, rx: 4 }, 'blue'),
    s('rect', { x: 76, y: 28, width: 30, height: 24, rx: 4 }, 'blue'),
    s('rect', { x: 64, y: 80, width: 32, height: 24, rx: 4 }, 'green', { accent: true }),
    s('rect', { x: 108, y: 88, width: 34, height: 24, rx: 4 }, 'blue'),
    s('path', { d: 'M110 124l-10 12-10-12z' }, 'orange'),
    s('path', { d: 'M58 34l10 6-10 6M74 70l6 10 6-10M98 86l10 6-10 6', ...SW(3) }, 'dark', { stroke: true })
  ],
  sospechar: [
    s('circle', { cx: 80, cy: 84, r: 50 }, 'skin', { accent: true }),
    s('path', { d: 'M50 60l24 4M88 70l26-4', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: ells([[62, 80, 12, 6], [100, 80, 12, 6]]) }, 'white'),
    s('path', { d: dots([[70, 80], [108, 80]], 4) }, 'dark'),
    s('path', { d: 'M64 110h30', ...SW(4) }, 'dark', { stroke: true })
  ],
  subsecretario: [
    s('path', { d: rects([[22, 104, 60, 36], [82, 80, 56, 60]]) }, 'gray'),
    ...person(110, 80, 'navy', { h: 38, w: 28, r: 12 }),
    s('path', { d: 'M110 44l-4 12 4 6 4-6z' }, 'red'),
    ...person(52, 104, 'blue', { accent: true, h: 30, w: 22, r: 10 }),
    s('path', { d: 'M52 76l-3 9 3 4 3-4z' }, 'yellow')
  ],
  suero: [
    s('path', { d: 'M80 14v126M56 140h48M80 20h26', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 24h28v40q0 10-14 10t-14-10z' }, 'sky', { accent: true }),
    s('path', { d: 'M100 44h28v20q0 10-14 10t-14-10z' }, 'blue'),
    s('path', { d: 'M114 74v12q0 20-24 30t-34 20', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: drop(114, 96, 3) }, 'blue'),
    s('rect', { x: 36, y: 118, width: 34, height: 14, rx: 7 }, 'skin')
  ],
  'utopía': [
    s('path', { d: 'M24 76a56 56 0 0 1 112 0', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M32 76a48 48 0 0 1 96 0', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M40 76a40 40 0 0 1 80 0', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: ells([[50, 120, 26, 14], [80, 112, 30, 18], [112, 120, 26, 14]]) + 'M26 120h108v14H26z' }, 'sky'),
    s('path', { d: 'M58 114V76h8v-8h8v8h12v-8h8v8h8v38z' }, 'pink', { accent: true }),
    s('path', { d: 'M76 114V98a4 4 0 0 1 8 0v16z' }, 'purple')
  ],
  velar: [
    { ...backdrop('navy'), accent: true },
    s('path', { d: 'M118 26a16 16 0 1 0 14 24a12 12 0 1 1-14-24z' }, 'yellow'),
    s('rect', { x: 62, y: 84, width: 22, height: 50, rx: 3 }, 'cream'),
    s('path', { d: drop(73, 70, 7) }, 'orange'),
    s('path', { d: halfRays(73, 72, 18, 26, 5), ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M24 46q16-14 32 0q-16 14-32 0z' }, 'white'),
    s('circle', { cx: 40, cy: 46, r: 5 }, 'dark')
  ],
  vigilante: [
    s('path', { d: busts([66], 146, 66, 48) }, 'navy', { accent: true }),
    s('circle', { cx: 66, cy: 72, r: 24 }, 'skin'),
    s('path', { d: 'M40 56h52v-8q-26-16-52 0zM40 56h62v6H40z' }, 'black'),
    s('circle', { cx: 66, cy: 52, r: 4 }, 'yellow'),
    s('path', { d: 'M96 124l20-30', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M116 94l30-34v40z' }, 'yellow'),
    s('path', { d: dots([[58, 74], [74, 74]], 3) }, 'dark')
  ],
  accidentalmente: [
    s('rect', { x: 14, y: 112, width: 132, height: 8 }, 'brown'),
    s('path', { d: 'M76 112q-30 0-46 4t-16 8h60z' }, 'brown'),
    s('path', { d: 'M78 112V84h36v28z' }, 'red', { accent: true }),
    s('path', { d: 'M114 90h8a8 8 0 0 1 0 16h-8', ...SW(4) }, 'red', { stroke: true }),
    s('ellipse', { cx: 78, cy: 98, rx: 4, ry: 14 }, 'brown'),
    s('path', { d: drop(30, 134, 4) + drop(46, 140, 3) }, 'brown'),
    s('path', { d: 'M96 70l4-12M110 72l10-8M82 72l-4-12', ...SW(3) }, 'orange', { stroke: true })
  ],
  antorcha: [
    s('path', { d: 'M80 140V76', ...SW(12) }, 'brown', { stroke: true }),
    s('path', { d: 'M62 60h36l-8 18H70z' }, 'gray'),
    s('path', { d: 'M80 62q-26-10-20-30q4 10 10 10q-4-18 12-30q0 14 10 20q4-8 2-14q14 14 4 44z' }, 'red', { accent: true }),
    s('path', { d: 'M80 62q-12-6-8-18q4 6 8 4q2-10 8-14q6 12 2 28z' }, 'yellow')
  ],
  arder: [
    s('path', { d: 'M28 136l104-18M28 118l104 18', ...SW(10) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 124q-40 0-34-36q4-20 18-30q0 16 10 20q-4-30 18-50q2 26 16 38q10 12 6 30q-4 28-34 28z' }, 'orange', { accent: true }),
    s('path', { d: 'M80 124q-18 0-16-18q2-12 10-18q2 8 8 10q2-14 12-22q8 18 6 30q-2 18-20 18z' }, 'yellow'),
    s('path', { d: sparkle(36, 52, 5) + sparkle(124, 46, 6) }, 'red')
  ],
  avezar: [
    ground(),
    ...person(80, 136, 'green', { accent: true }),
    arrow('M40 70a44 44 0 0 1 80 0M110 62l10 8 8-10', 'orange', 5),
    arrow('M120 112a44 44 0 0 1-80 0M50 120l-10-8-8 10', 'orange', 5)
  ],
  brote: [
    s('path', { d: 'M14 96q66-16 132 0v50H14z' }, 'brown'),
    s('path', { d: ells([[80, 106, 18, 12]]) }, 'tan'),
    s('path', { d: 'M70 106l6-6 4 6 4-6 6 6', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 98V56', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 62, -150, 30, 11) + leaflet(80, 56, -30, 30, 11) }, 'green', { accent: true })
  ],
  'cacería': [
    ground(),
    s('path', { d: 'M20 112q4-18 30-18h20q8-10 18-6l6 10-8 6v24h-6v-14H44v14h-6v-12q-12 0-18-8z' }, 'brown', { accent: true }),
    s('path', { d: ells([[120, 112, 14, 9]]) + 'M118 126v10M128 124v12' }, 'gray'),
    s('path', { d: ells([[134, 102, 5, 12], [128, 100, 4, 12]]) }, 'gray'),
    s('path', { d: 'M106 120h-8M108 108h-8', ...SW(3) }, 'gray', { stroke: true })
  ],
  cinismo: [
    s('circle', { cx: 80, cy: 84, r: 50 }, 'skin', { accent: true }),
    s('path', { d: ells([[62, 76, 12, 9], [100, 76, 12, 9]]) }, 'white'),
    s('path', { d: dots([[62, 70], [100, 70]], 4) }, 'dark'),
    s('path', { d: 'M48 62q14-8 26-2M88 64q12-4 26 2', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 108q22 4 38-10', ...SW(4) }, 'dark', { stroke: true })
  ],
  complicar: [
    s('path', { d: 'M24 120c20-90 100 20 60-50s-70 40-20 30 80-60 40 20-60-40 30-60', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M40 40c40 30 80-10 70 40s-60 0-40 30 60 10 60 20', ...SW(5) }, 'blue', { stroke: true }),
    s('circle', { cx: 134, cy: 60, r: 8 }, 'red', { accent: true }),
    s('path', { d: 'M24 120l-8 12', ...SW(5) }, 'red', { stroke: true })
  ],
  concebir: [
    s('path', { d: 'M40 140V112q-16-8-16-32q0-40 44-44q40 2 44 40l12 18-12 4v16q0 12-16 10v18z' }, 'skin'),
    s('circle', { cx: 74, cy: 74, r: 20 }, 'yellow', { accent: true }),
    s('rect', { x: 66, y: 92, width: 16, height: 10, rx: 2 }, 'gray'),
    s('path', { d: halfRays(74, 74, 26, 34, 5), ...SW(3) }, 'orange', { stroke: true })
  ],
  conectividad: [
    s('path', { d: 'M36 60a62 62 0 0 1 88 0M50 76a42 42 0 0 1 60 0M64 92a22 22 0 0 1 32 0', ...SW(8) }, 'blue', { stroke: true }),
    s('circle', { cx: 80, cy: 108, r: 9 }, 'blue', { accent: true }),
    s('rect', { x: 18, y: 104, width: 30, height: 40, rx: 4 }, 'dark'),
    s('rect', { x: 112, y: 112, width: 34, height: 24, rx: 3 }, 'dark'),
    s('path', { d: 'M48 124h20M92 124h20', ...DASH(3, '4 4') }, 'gray', { stroke: true })
  ],
  consistencia: [
    s('path', { d: 'M24 84h112q-6 50-56 50t-56-50z' }, 'blue', { accent: true }),
    s('path', { d: 'M30 84q8-16 24-8q12-14 26-4q14-12 26 2q14-8 24 10z' }, 'tan'),
    s('path', { d: 'M86 80L104 18', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: ells([[84, 84, 10, 5]]) }, 'gray')
  ],
  convivir: [
    s('path', { d: 'M24 136V70l56-44 56 44v66', ...SW(6) }, 'red', { stroke: true }),
    ...person(60, 132, 'blue', { accent: true, h: 40 }),
    ...person(102, 132, 'orange', { h: 36, r: 11 }),
    s('path', { d: 'M74 104h14', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M18 136h124', ...SW(4) }, 'gray', { stroke: true })
  ],
  cooperar: [
    ground(),
    ...person(36, 136, 'blue'),
    ...person(124, 136, 'green', { accent: true }),
    s('rect', { x: 26, y: 62, width: 108, height: 14, rx: 7 }, 'brown'),
    s('path', { d: 'M44 92l2-16M116 92l-2-16', ...SW(6) }, 'skin', { stroke: true })
  ],
  cosmos: [
    { ...backdrop('navy'), accent: true },
    s('circle', { cx: 74, cy: 82, r: 24 }, 'orange'),
    s('ellipse', { cx: 74, cy: 82, rx: 44, ry: 10, transform: 'rotate(-20 74 82)', ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 122, cy: 40, r: 10 }, 'sky'),
    s('path', { d: dots([[30, 32], [56, 24], [130, 120], [36, 126], [104, 130], [136, 82]], 2) }, 'white'),
    s('path', { d: sparkle(32, 70, 6) }, 'yellow')
  ],
  costilla: [
    backdrop('sky'),
    s('path', { d: 'M80 24v112', ...SW(8) }, 'cream', { stroke: true }),
    s('path', { d: [40, 60, 80, 100].map(y => `M76 ${y}q-40-4-42 30M84 ${y}q40-4 42 30`).join(''), ...SW(6) }, 'cream', { stroke: true, accent: true }),
    s('path', { d: [40, 60, 80, 100].map(y => `M76 ${y}q-40-4-42 30M84 ${y}q40-4 42 30`).join(''), ...SW(1) }, 'tan', { stroke: true }),
    s('rect', { x: 74, y: 20, width: 12, height: 120, rx: 6 }, 'tan')
  ],
  'cotización': [
    s('path', { d: 'M20 20v116h122', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 70v50M66 56v50M92 40v44M118 26v50', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: rects([[34, 84, 12, 26], [86, 50, 12, 24], [112, 34, 12, 30]]) }, 'green', { accent: true }),
    s('path', { d: rects([[60, 66, 12, 30]]) }, 'red')
  ],
  deliberadamente: [
    s('path', { d: checker(30, 98, 6, 2, 16, 1) }, 'gray'),
    s('rect', { x: 30, y: 98, width: 96, height: 32, ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 98h20v-6l-4-4 2-20h4v-6h-16v6h4l2 20-4 4z' + ells([[80, 54, 9, 9]]) }, 'dark', { accent: true }),
    s('path', { d: ells([[80, 34, 16, 10]]) }, 'skin'),
    s('path', { d: dots([[108, 30], [120, 22], [134, 16]], 4) }, 'gray')
  ],
  derribar: [
    s('path', { d: 'M60 14L100 72', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 104, cy: 80, r: 18 }, 'dark', { accent: true }),
    s('path', { d: rects([[20, 96, 24, 14], [44, 96, 24, 14], [20, 110, 24, 14], [44, 110, 24, 14], [20, 124, 24, 14], [44, 124, 24, 14]]) }, 'red'),
    s('path', { d: 'M20 96h48v42H20zM20 110h48M20 124h48M44 96v42', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: rects([[74, 58, 18, 12]]), transform: 'rotate(20 83 64)' }, 'red'),
    s('path', { d: rects([[30, 70, 18, 12]]), transform: 'rotate(-30 39 76)' }, 'red'),
    ground(138)
  ],
  disgusto: [
    s('path', { d: 'M40 30c10-20 30 10 20 10s-10-20 10-20 10 20 20 10 20-10 10 10', ...SW(4) }, 'dark', { stroke: true }),
    ...face(80, 96, 42, 'skin', 'frown', { accent: true }),
    s('path', { d: 'M54 76l16 6M106 76l-16 6', ...SW(4) }, 'dark', { stroke: true })
  ],
  'dispersión': [
    s('path', { d: 'M14 84l50-10', ...SW(5) }, 'white', { stroke: true, lineColor: 'gray' }),
    s('path', { d: 'M14 84l50-10', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 72l60-40', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M88 76l58-20', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M88 80l58 2', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M86 84l60 26', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M84 88l60 48', ...SW(6) }, 'purple', { stroke: true }),
    s('path', { d: 'M76 34l38 80H38z' }, 'sky', { accent: true })
  ],
  enciclopedia: [
    s('rect', { x: 18, y: 130, width: 124, height: 8 }, 'brown'),
    s('path', { d: rects([[22, 40, 22, 90], [70, 40, 22, 90], [118, 40, 22, 90]]) }, 'navy'),
    s('path', { d: rects([[46, 40, 22, 90], [94, 40, 22, 90]]) }, 'red', { accent: true }),
    s('path', { d: 'M22 56h118M22 114h118', ...SW(3) }, 'yellow', { stroke: true })
  ],
  expandir: [
    s('rect', { x: 56, y: 56, width: 48, height: 48, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 32, y: 32, width: 96, height: 96, rx: 6, ...DASH(3, '6 6') }, 'gray', { stroke: true }),
    arrow('M52 52L22 22M22 38V22h16M108 52l30-30M122 22h16v16M52 108l-30 30M22 122v16h16M108 108l30 30M138 122v16h-16', 'orange', 5)
  ],
  factible: [
    s('path', { d: 'M50 140L76 30M86 140l26-110M56 116h36M62 92h36M68 68h36M74 44h36', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: star(112, 24, 12) }, 'yellow', { accent: true }),
    s('circle', { cx: 132, cy: 120, r: 16 }, 'green'),
    s('path', { d: 'M124 120l6 6 10-12', ...SW(4) }, 'white', { stroke: true })
  ],
  fatiga: [
    ground(),
    ...lean(76, 136, 34, 'blue', { accent: true }),
    s('path', { d: 'M94 106l6 24', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: drop(124, 66, 5) + drop(86, 70, 4) + drop(136, 84, 4) }, 'sky'),
    s('rect', { x: 22, y: 30, width: 34, height: 18, rx: 3, ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 26, y: 34, width: 6, height: 10 }, 'red')
  ],
  filmar: [
    s('path', { d: 'M60 104l-20 38M80 104v38M100 104l20 38', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 34, y: 62, width: 68, height: 42, rx: 6 }, 'dark', { accent: true }),
    s('path', { d: dots([[48, 44], [86, 44]], 17) }, 'gray'),
    s('path', { d: 'M102 72l30-14v50l-30-14z' }, 'gray'),
    s('circle', { cx: 52, cy: 82, r: 6 }, 'red')
  ],
  fosa: [
    s('path', { d: 'M14 70h132v76H14z' }, 'brown'),
    s('path', { d: 'M44 70h72l-10 56H54z' }, 'dark', { accent: true }),
    s('path', { d: 'M30 70q8-14 24-6M106 64q16-8 24 6', ...SW(8) }, 'tan', { stroke: true }),
    s('path', { d: 'M120 64l12-46', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M110 58l12 6-4 14-12-4z' }, 'gray')
  ],
  'garzón': [
    ...person(60, 140, 'black', { h: 56, w: 34, r: 14 }),
    s('path', { d: 'M52 84h16l-8 16z' }, 'white'),
    s('path', { d: 'M54 84l6 4 6-4v8l-6-4-6 4z' }, 'red'),
    s('path', { d: 'M76 100l26-20', ...SW(6) }, 'skin', { stroke: true }),
    s('ellipse', { cx: 108, cy: 76, rx: 30, ry: 6 }, 'gray', { accent: true }),
    s('path', { d: 'M90 70a18 16 0 0 1 36 0z' }, 'gray'),
    s('rect', { x: 40, y: 104, width: 10, height: 24 }, 'white')
  ],
  gratuitamente: [
    s('rect', { x: 32, y: 66, width: 96, height: 70, rx: 4 }, 'red', { accent: true }),
    s('rect', { x: 26, y: 54, width: 108, height: 18, rx: 4 }, 'pink'),
    s('path', { d: 'M80 54v82', ...SW(12) }, 'yellow', { stroke: true }),
    s('path', { d: 'M80 54q-26-30-30-10t30 10q26-30 30-10t-30 10z' }, 'yellow'),
    s('path', { d: sparkle(28, 30, 8) + sparkle(132, 32, 8) }, 'orange')
  ],
  'guaraní': [
    s('rect', { x: 18, y: 46, width: 124, height: 68, rx: 6 }, 'green', { accent: true }),
    s('rect', { x: 26, y: 54, width: 108, height: 52, rx: 4, ...SW(2) }, 'mint', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 18 }, 'mint'),
    s('path', { d: busts([80], 96, 20, 12) + ells([[80, 76, 6, 7]]) }, 'green'),
    s('path', { d: dots([[40, 68], [120, 92]], 6) }, 'mint')
  ],
  'hegemonía': [
    s('path', { d: 'M52 136h56v-10l-10-8-6-44h8v-8H60v8h8l-6 44-10 8z' }, 'dark', { accent: true }),
    s('path', { d: 'M74 50h12M80 40v22', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: ells([[80, 62, 16, 8]]) }, 'dark'),
    s('path', { d: [24, 132].map(x => `M${x - 10} 136h20v-4l-4-3-2-12h-8l-2 12-4 3z`).join('') + ells([[24, 112, 6, 6], [132, 112, 6, 6]]) }, 'gray')
  ],
  'huérfano': [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    ...person(70, 136, 'blue', { h: 36, w: 26, r: 12 }),
    s('path', { d: dots([[100, 118], [100, 104], [93, 98], [107, 98]], 8) }, 'brown'),
    s('path', { d: dots([[100, 118], [100, 104], [93, 98], [107, 98]], 3) }, 'tan', { accent: true }),
    s('path', { d: 'M82 110l10 4', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: drop(76, 92, 3) }, 'sky')
  ],
  ingenuo: [
    s('circle', { cx: 80, cy: 86, r: 48 }, 'skin', { accent: true }),
    s('path', { d: ells([[62, 82, 12, 15], [98, 82, 12, 15]]) }, 'white'),
    s('path', { d: dots([[62, 84], [98, 84]], 8) }, 'dark'),
    s('path', { d: dots([[65, 80], [101, 80]], 3) }, 'white'),
    s('path', { d: 'M70 110q10 8 20 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(30, 30, 8) + sparkle(128, 34, 7) }, 'yellow')
  ],
  'iniciación': [
    s('rect', { x: 40, y: 20, width: 80, height: 120 }, 'brown'),
    s('rect', { x: 48, y: 28, width: 64, height: 112 }, 'yellow', { accent: true }),
    s('path', { d: 'M112 28l-36 12v108l36-8z' }, 'tan'),
    s('circle', { cx: 84, cy: 88, r: 4 }, 'dark'),
    s('path', { d: 'M14 140h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  innovador: [
    s('path', { d: 'M80 14q24 22 22 60l12 20v22l-14-10H60l-14 10V94l12-20q-2-38 22-60z' }, 'white'),
    s('path', { d: 'M80 14q24 22 22 60l12 20v22l-14-10H60l-14 10V94l12-20q-2-38 22-60z', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 60, r: 10 }, 'sky'),
    s('path', { d: 'M80 14q14 12 18 28H62q4-16 18-28z' }, 'red', { accent: true }),
    s('path', { d: drop(80, 128, 9) }, 'orange'),
    s('path', { d: drop(80, 124, 4) }, 'yellow')
  ],
  'inquisición': [
    s('path', { d: busts([46], 140, 30, 34) }, 'gray'),
    s('circle', { cx: 46, cy: 96, r: 11 }, 'skin'),
    s('circle', { cx: 96, cy: 68, r: 34 }, 'sky'),
    s('circle', { cx: 96, cy: 68, r: 36, ...SW(8) }, 'dark', { stroke: true, accent: true }),
    s('ellipse', { cx: 96, cy: 68, rx: 14, ry: 9 }, 'white'),
    s('circle', { cx: 96, cy: 68, r: 6 }, 'navy', { accent: true }),
    s('path', { d: 'M72 96l-18 20', ...SW(10) }, 'dark', { stroke: true })
  ],
  interferencia: [
    s('rect', { x: 20, y: 56, width: 120, height: 80, rx: 10 }, 'brown', { accent: true }),
    s('circle', { cx: 52, cy: 96, r: 22 }, 'dark'),
    s('rect', { x: 86, y: 74, width: 42, height: 20, rx: 3 }, 'cream'),
    s('path', { d: 'M90 84l5-6 5 10 5-10 5 10 5-10 5 6', ...SW(2) }, 'red', { stroke: true }),
    s('path', { d: 'M110 56L130 20', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M20 36l8 6 6-10 8 8 6-10M120 30l6 6', ...SW(3) }, 'orange', { stroke: true })
  ],
  lamentar: [
    ...face(80, 82, 46, 'skin', 'frown', { accent: true }),
    s('path', { d: 'M52 62l18 6M108 62l-18 6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: drop(64, 98, 5) + drop(98, 104, 4) }, 'sky'),
    s('path', { d: heart(124, 128, 10) }, 'gray')
  ],
  llamamiento: [
    s('path', { d: 'M40 70h18l50-30v80L58 90H40z' }, 'red', { accent: true }),
    s('rect', { x: 50, y: 90, width: 10, height: 26, rx: 3 }, 'dark'),
    s('path', { d: 'M118 62q8 18 0 36M128 50q16 30 0 60', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M40 70v20', ...SW(10) }, 'dark', { stroke: true })
  ],
  lodo: [
    s('path', { d: 'M14 118q20-12 40-4t40-4 52 6v30H14z' }, 'brown', { accent: true }),
    s('path', { d: 'M56 28h26v66q20 4 30 16v10H50l2-30z' }, 'green'),
    s('path', { d: 'M50 112q30 6 62 0', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: dots([[40, 96], [126, 100], [30, 110], [118, 88]], 4) }, 'brown')
  ],
  marinero: [
    s('path', { d: busts([66], 146, 64, 46) }, 'white'),
    s('path', { d: 'M38 116h56M36 128h60M36 140h60', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M50 100l16 18 16-18z' }, 'navy'),
    s('circle', { cx: 66, cy: 74, r: 24 }, 'skin'),
    s('path', { d: 'M40 56q26-16 52 0v6H40z' }, 'white'),
    s('path', { d: 'M40 62h52', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M124 50v66M110 62h28M106 100q4 18 18 18t18-18', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 124, cy: 44, r: 7, ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[58, 76], [74, 76]], 3) }, 'dark'),
    s('rect', { x: 34, y: 100, width: 64, height: 46, ...SW(2) }, 'gray', { stroke: true, accent: true })
  ],
  mena: [
    s('path', { d: 'M24 130l10-40 30-20 40 6 28 30-8 24z' }, 'gray', { accent: true }),
    s('path', { d: poly([[50, 96], [58, 90], [62, 100]]) + poly([[86, 84], [96, 82], [92, 94]]) + poly([[70, 112], [80, 108], [78, 120]]) + poly([[106, 104], [114, 100], [112, 112]]) }, 'yellow'),
    s('path', { d: 'M102 62l30-46', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M108 18q20 0 36 14', ...SW(6) }, 'dark', { stroke: true })
  ],
  'mesías': [
    s('path', { d: rays(80, 70, 34, 60, 16), ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M56 140l10-64h28l10 64z' }, 'white'),
    s('path', { d: 'M56 140l10-64h28l10 64z', ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 62, r: 14 }, 'skin'),
    s('path', { d: 'M66 84L40 70M94 84l26-14', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M76 88h8v52h-8z' }, 'sky', { accent: true })
  ],
  'moderación': [
    s('path', { d: 'M24 80h112', ...SW(10) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 80h56', ...SW(10) }, 'green', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 16 }, 'white'),
    s('circle', { cx: 80, cy: 80, r: 16, ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M24 112h28M66 112h28M108 112h28', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M66 112h28', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M80 52l-6-8h12z' }, 'orange', { accent: true })
  ],
  motivar: [
    s('path', { d: heart(80, 92, 34) }, 'red', { accent: true }),
    s('path', { d: 'M80 70q-16-6-12-24q4 8 8 6q-2-16 10-26q0 14 8 20q6 14-14 24z' }, 'orange'),
    arrow('M30 120V84M22 92l8-8 8 8M130 120V84M122 92l8-8 8 8', 'green', 4)
  ],
  paradoja: [
    s('path', { d: 'M80 20l60 104h-24L80 62 56 104H34z' }, 'blue', { accent: true }),
    s('path', { d: 'M140 124H20l12-20h72L80 62l12-21z' }, 'sky'),
    s('path', { d: 'M20 124L80 20l12 21-48 83h72l12 20' }, 'navy'),
    s('path', { d: 'M80 20l60 104H20z', ...SW(2) }, 'dark', { stroke: true })
  ],
  pendejada: [
    s('circle', { cx: 80, cy: 86, r: 46 }, 'yellow', { accent: true }),
    s('path', { d: 'M56 74a6 6 0 1 0 12 0M92 74a6 6 0 1 0 12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 62, cy: 76, r: 3 }, 'dark'),
    s('path', { d: 'M58 100q22 18 44 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M74 106h14v12q0 8-7 8t-7-8z' }, 'pink'),
    s('path', { d: 'M50 40l60-6-26-22z' }, 'red')
  ],
  pescar: [
    s('path', { d: 'M14 108h132v26a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'blue'),
    s('path', { d: 'M24 120L110 22', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M110 22q16 30 10 66', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: fishes([[120, 100]]), transform: 'rotate(-90 120 100)' }, 'orange', { accent: true }),
    s('path', { d: 'M100 112q10-6 20 0', ...SW(3) }, 'sky', { stroke: true })
  ],
  procesador: [
    s('path', { d: [44, 62, 80, 98, 116].map(v => `M${v} 18v20M${v} 122v20M18 ${v}h20M122 ${v}h20`).join(''), ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 36, y: 36, width: 88, height: 88, rx: 8 }, 'dark'),
    s('rect', { x: 56, y: 56, width: 48, height: 48, rx: 4 }, 'green', { accent: true }),
    s('path', { d: 'M64 66h32M64 80h32M64 94h20', ...SW(3) }, 'mint', { stroke: true })
  ],
  programador: [
    s('rect', { x: 28, y: 22, width: 104, height: 70, rx: 6 }, 'dark'),
    s('path', { d: 'M40 38h30M50 50h44M50 62h30M40 74h50', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M76 38h20M86 62h24', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M18 100h124l-10 14H28z' }, 'gray', { accent: true }),
    s('path', { d: busts([80], 146, 52, 26) }, 'blue')
  ],
  proyectar: [
    s('rect', { x: 70, y: 22, width: 76, height: 56, rx: 2 }, 'white'),
    outline({ x: 70, y: 22, width: 76, height: 56, rx: 2 }),
    s('path', { d: 'M40 106L70 22v56z' }, 'cream'),
    s('path', { d: 'M84 70l16-24 14 16 10-10 14 18z' }, 'green'),
    s('rect', { x: 18, y: 96, width: 40, height: 24, rx: 4 }, 'blue', { accent: true }),
    s('circle', { cx: 52, cy: 104, r: 6 }, 'yellow'),
    s('path', { d: 'M26 120l-6 16M50 120l6 16', ...SW(4) }, 'dark', { stroke: true })
  ],
  raja: [
    s('rect', { x: 14, y: 52, width: 132, height: 56, rx: 4 }, 'tan', { accent: true }),
    s('path', { d: 'M20 70q40-6 80 4M20 92q50 6 120-6', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M74 52l8 14-6 10 10 12-6 20', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 120, cy: 72, r: 5 }, 'brown')
  ],
  repugnante: [
    s('ellipse', { cx: 80, cy: 128, rx: 50, ry: 7 }, 'brown'),
    s('path', { d: ells([[76, 110, 36, 14]]) + 'M110 110l22-14v28z' }, 'gray', { accent: true }),
    s('path', { d: 'M56 110h40M66 102v16M78 102v16M90 102v16', ...SW(2) }, 'dark', { stroke: true }),
    s('circle', { cx: 50, cy: 106, r: 3 }, 'dark'),
    s('path', { d: 'M56 86q-8-8 0-16t0-16M80 84q-8-8 0-16t0-16M104 86q-8-8 0-16t0-16', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots([[36, 46], [122, 40], [130, 70]], 3) }, 'dark')
  ],
  revertir: [
    s('path', { d: 'M110 140V70a30 30 0 0 0-60 0v40', ...SW(14) }, 'blue', { stroke: true }),
    s('path', { d: 'M30 104h40l-20 30z' }, 'blue', { accent: true }),
    s('path', { d: 'M110 140V70a30 30 0 0 0-60 0v34', ...DASH(2, '6 6') }, 'white', { stroke: true })
  ],
  superviviente: [
    s('path', { d: 'M14 84q16-8 33 0t33 0 33 0 33 0v62H14z' }, 'blue'),
    s('circle', { cx: 80, cy: 94, r: 26, ...SW(12) }, 'red', { stroke: true }),
    s('path', { d: 'M54 94h-2M106 94h2M80 68v-2M80 120v2', ...SW(12, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 62, r: 12 }, 'skin', { accent: true }),
    s('path', { d: 'M66 72l-14-30M94 72l14-30', ...SW(6) }, 'skin', { stroke: true })
  ],
  suspenso: [
    s('path', { d: 'M14 40h80v106H14z' }, 'gray'),
    s('path', { d: 'M94 40l8 12-8 10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[100, 44], [114, 44]], 6) }, 'skin'),
    s('path', { d: 'M102 48l2 30M114 48l-2 30', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 108, cy: 90, r: 12 }, 'skin'),
    s('rect', { x: 96, y: 102, width: 24, height: 34, rx: 8 }, 'orange', { accent: true }),
    s('path', { d: drop(126, 84, 4) }, 'sky')
  ],
  talvez: [
    s('path', { d: 'M40 136q0-90 60-96', ...DASH(3, '6 6') }, 'gray', { stroke: true }),
    s('ellipse', { cx: 104, cy: 40, rx: 22, ry: 10, transform: 'rotate(-20 104 40)' }, 'orange'),
    s('ellipse', { cx: 104, cy: 36, rx: 22, ry: 10, transform: 'rotate(-20 104 36)' }, 'yellow', { accent: true }),
    s('path', { d: ells([[40, 138, 16, 6]]) }, 'skin'),
    s('path', { d: sparkle(130, 70, 6) + sparkle(76, 28, 5) }, 'orange')
  ],
};
