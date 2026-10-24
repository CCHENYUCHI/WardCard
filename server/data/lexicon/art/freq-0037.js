// Illustration specs for words still undrawn in batches 0032–0037 (see server/scripts/lexicon/art.js)
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

module.exports = {
  apostar: [
    backdrop('green'),
    s('path', { d: 'M28 84v26a22 8 0 0 0 44 0v-26z' }, 'red', { accent: true }),
    s('ellipse', { cx: 50, cy: 84, rx: 22, ry: 8 }, 'pink'),
    s('path', { d: 'M28 93a22 8 0 0 0 44 0M28 102a22 8 0 0 0 44 0', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M86 102v12a22 8 0 0 0 44 0v-12z' }, 'blue'),
    s('ellipse', { cx: 108, cy: 102, rx: 22, ry: 8 }, 'sky'),
    s('rect', { x: 84, y: 30, width: 36, height: 36, rx: 6, transform: 'rotate(15 102 48)' }, 'white'),
    s('path', { d: dots([[94, 40], [102, 48], [110, 56]], 3.5), transform: 'rotate(15 102 48)' }, 'dark')
  ],
  petrolero: [
    s('path', { d: 'M14 112q8-6 16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0V146H14z' }, 'blue'),
    s('path', { d: 'M20 90h124l-14 26H34z' }, 'red', { accent: true }),
    s('path', { d: 'M40 90v-10h56v10', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 106, y: 58, width: 24, height: 32, rx: 2 }, 'cream'),
    s('rect', { x: 110, y: 64, width: 16, height: 7 }, 'sky'),
    s('rect', { x: 113, y: 44, width: 10, height: 14 }, 'black'),
    s('path', { d: drop(68, 103, 6) }, 'black')
  ],
  perpetuo: [
    s('path', { d: 'M80 74c-14-20-50-20-50 0s36 20 50 0 50-20 50 0-36 20-50 0', ...SW(12) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M34 118a52 30 0 0 0 92 0M118 108l8 10 10-6', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: sparkle(36, 34, 10) + sparkle(124, 36, 8) }, 'yellow')
  ],
  hondo: [
    s('rect', { x: 14, y: 30, width: 132, height: 116, rx: 8 }, 'brown'),
    s('path', { d: 'M14 70h50M96 70h50M14 104h50M96 104h50', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 14, y: 22, width: 132, height: 14, rx: 4 }, 'green'),
    s('path', { d: 'M64 30h32v100q-16 10-32 0z' }, 'dark', { accent: true }),
    arrow('M80 44v70M70 104l10 10 10-10', 'yellow', 5)
  ],
  adorar: [
    ground(),
    ...person(48, 136, 'blue'),
    s('path', { d: 'M60 104l16-14', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(108, 76, 22) }, 'red', { accent: true }),
    s('path', { d: heart(34, 40, 8) + heart(60, 26, 6) }, 'pink')
  ],
  sistemático: [
    s('path', { d: rects([[36, 18, 56, 26], [36, 116, 56, 26]]) }, 'blue'),
    s('rect', { x: 36, y: 67, width: 56, height: 26 }, 'green', { accent: true }),
    s('path', { d: 'M64 46v16M58 56l6 6 6-6M64 95v16M58 105l6 6 6-6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M106 31l5 5 10-11M106 80l5 5 10-11M106 129l5 5 10-11', ...SW(4) }, 'green', { stroke: true })
  ],
  variante: [
    s('path', { d: 'M80 18l24 20v24H56V38z' }, 'gray'),
    s('path', { d: 'M62 70l-18 16M80 70v16M98 70l18 16', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 94l18 14v28H22v-28z' }, 'red', { accent: true }),
    s('path', { d: 'M66 110h28v26H66zM62 112l18-16 18 16z' }, 'blue'),
    s('path', { d: 'M108 106h32v30h-32zM104 106l20-12 20 12z' }, 'green')
  ],
  vió: [
    s('path', { d: 'M20 70q60-56 120 0q-60 56-120 0z' }, 'white'),
    s('path', { d: 'M20 70q60-56 120 0q-60 56-120 0z', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 70, r: 22 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 70, r: 10 }, 'black'),
    s('circle', { cx: 86, cy: 64, r: 4 }, 'white'),
    s('path', { d: 'M58 132a22 22 0 1 1 44 0M50 124l8 8 8-6', ...SW(4) }, 'orange', { stroke: true })
  ],
  vocabulario: [
    s('rect', { x: 42, y: 28, width: 34, height: 44, rx: 4, transform: 'rotate(-15 59 50)' }, 'yellow'),
    s('rect', { x: 84, y: 28, width: 34, height: 44, rx: 4, transform: 'rotate(15 101 50)' }, 'pink'),
    s('rect', { x: 63, y: 18, width: 34, height: 44, rx: 4 }, 'sky', { accent: true }),
    s('path', { d: 'M70 30h20M70 38h14', ...SW(3) }, 'navy', { stroke: true }),
    ...openBook(80, 78)
  ],
  wey: [
    ground(),
    ...person(48, 136, 'blue'),
    ...person(112, 136, 'orange', { accent: true }),
    s('path', { d: 'M62 104h12M98 104H86', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: burst(80, 98, 10, 4, 7) }, 'yellow')
  ],
  accesorio: [
    s('path', { d: 'M34 78h60l8 56H26z' }, 'pink', { accent: true }),
    s('path', { d: 'M48 78q16-34 32 0', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 58, y: 86, width: 12, height: 8, rx: 2 }, 'yellow'),
    s('path', { d: ells([[100, 36, 12, 9], [128, 36, 12, 9]]) + 'M110 34h8v3h-8z' }, 'dark'),
    s('path', { d: ring(124, 106, 16), ...SW(6) }, 'yellow', { stroke: true }),
    s('circle', { cx: 124, cy: 90, r: 5 }, 'sky')
  ],
  acondicionado: [
    s('rect', { x: 24, y: 24, width: 112, height: 42, rx: 8 }, 'white'),
    outline({ x: 24, y: 24, width: 112, height: 42, rx: 8 }),
    s('path', { d: 'M36 56h88', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 124, cy: 36, r: 4 }, 'green'),
    s('path', { d: 'M44 78q8 12 0 24t0 24M80 78q8 12 0 24t0 24M116 78q8 12 0 24t0 24', ...SW(5) }, 'blue', { stroke: true, accent: true })
  ],
  asignado: [
    ground(),
    ...paper(22, 26, 40, 52),
    s('path', { d: 'M30 40h24M30 50h24M30 60h16', ...SW(3) }, 'gray', { stroke: true }),
    ...person(110, 136, 'green', { accent: true }),
    s('circle', { cx: 116, cy: 108, r: 5 }, 'yellow'),
    arrow('M48 88q8 26 38 20M76 100l10 8-12 6', 'orange', 5)
  ],
  azteca: [
    s('path', { d: 'M18 136h124v-16h-12v-16h-12v-16h-12v-16H54v16H42v16H30v16H18z' }, 'tan'),
    s('rect', { x: 70, y: 72, width: 20, height: 64 }, 'brown'),
    s('path', { d: 'M70 84h20M70 96h20M70 108h20M70 120h20', ...SW(2) }, 'tan', { stroke: true }),
    s('rect', { x: 62, y: 46, width: 36, height: 26 }, 'red', { accent: true }),
    s('rect', { x: 58, y: 40, width: 44, height: 8 }, 'brown'),
    s('rect', { x: 74, y: 56, width: 12, height: 16 }, 'dark'),
    s('circle', { cx: 128, cy: 30, r: 12 }, 'yellow')
  ],
  beta: [
    s('rect', { x: 20, y: 24, width: 120, height: 98, rx: 8 }, 'white'),
    outline({ x: 20, y: 24, width: 120, height: 98, rx: 8 }),
    s('path', { d: 'M20 32a8 8 0 0 1 8-8h104a8 8 0 0 1 8 8v8H20z' }, 'navy'),
    s('path', { d: 'M72 50h16v16l16 30q2 6-6 6H62q-8 0-6-6l16-30z' }, 'mint'),
    s('path', { d: 'M62 86h36l6 10q2 6-6 6H62q-8 0-6-6z' }, 'green', { accent: true }),
    s('rect', { x: 40, y: 130, width: 80, height: 8, rx: 4 }, 'gray'),
    s('rect', { x: 40, y: 130, width: 44, height: 8, rx: 4 }, 'orange')
  ],
  brujo: [
    s('path', { d: 'M56 136l14-64h20l14 64z' }, 'purple', { accent: true }),
    s('circle', { cx: 80, cy: 62, r: 12 }, 'skin'),
    s('path', { d: 'M70 64q10 34 20 0z' }, 'white'),
    s('ellipse', { cx: 80, cy: 52, rx: 22, ry: 5 }, 'navy'),
    s('path', { d: 'M68 50l16-38 8 38z' }, 'navy'),
    s('path', { d: star(83, 36, 4) }, 'yellow'),
    s('path', { d: 'M100 104l24-28', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: sparkle(128, 70, 10) }, 'yellow')
  ],
  caudal: [
    backdrop('mint'),
    s('path', { d: 'M14 56q33-20 66 0t66 0v44q-33-20-66 0t-66 0z' }, 'blue', { accent: true }),
    s('path', { d: 'M28 74q10-6 20 0M68 82q10-6 20 0M108 74q10-6 20 0', ...SW(3) }, 'white', { stroke: true }),
    arrow('M40 126h76M104 116l12 10-12 10', 'navy', 5)
  ],
  chance: [
    backdrop('navy'),
    s('rect', { x: 50, y: 24, width: 66, height: 112 }, 'yellow', { accent: true }),
    s('path', { d: 'M50 136h66l30 10H20z' }, 'cream'),
    s('path', { d: 'M50 24l-22 10v108l22-6z' }, 'brown'),
    s('rect', { x: 50, y: 24, width: 66, height: 112, ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 36, cy: 88, r: 3 }, 'yellow'),
    s('path', { d: sparkle(83, 72, 16) }, 'white')
  ],
  cirujano: [
    s('rect', { x: 50, y: 92, width: 60, height: 50, rx: 18 }, 'mint'),
    s('circle', { cx: 80, cy: 66, r: 22 }, 'skin'),
    s('path', { d: 'M58 62a22 22 0 0 1 44 0z' }, 'green', { accent: true }),
    s('rect', { x: 64, y: 70, width: 32, height: 16, rx: 6 }, 'sky'),
    s('path', { d: dots([[72, 66], [88, 66]], 2.5) }, 'dark'),
    s('path', { d: 'M116 134l14-34', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M130 100l6-12-1 14z' }, 'gray')
  ],
  collar: [
    backdrop('navy'),
    s('path', { d: 'M30 30Q80 140 130 30', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: dots(qpts([30, 30], [80, 140], [130, 30], 11).filter((_, i) => i !== 5), 5) }, 'white'),
    s('path', { d: 'M80 88l11 14-11 18-11-18z' }, 'red', { accent: true })
  ],
  compartido: [
    s('circle', { cx: 80, cy: 56, r: 36 }, 'yellow'),
    s('path', { d: ring(80, 56, 36), ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M80 20v72', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: dots([[64, 42], [62, 66], [96, 44], [98, 68], [72, 54], [90, 56]], 5) }, 'red'),
    ...person(36, 140, 'blue', { h: 30, w: 22, r: 10 }),
    ...person(124, 140, 'green', { h: 30, w: 22, r: 10, accent: true })
  ],
  crucial: [
    s('path', { d: burst(106, 106, 40, 28, 12) }, 'yellow'),
    s('path', { d: rects([[30, 30, 48, 48], [82, 30, 48, 48], [30, 82, 48, 48]]) }, 'sky'),
    s('rect', { x: 82, y: 82, width: 48, height: 48, rx: 2 }, 'red', { accent: true }),
    s('path', { d: dots([[106, 80], [80, 106]], 8) }, 'red'),
    s('path', { d: dots([[54, 78], [78, 54], [106, 54]], 7) }, 'sky')
  ],
  cráneo: [
    s('path', { d: 'M44 76a36 36 0 0 1 72 0v18q0 10-10 12v14H54v-14q-10-2-10-12z' }, 'cream'),
    s('path', { d: 'M44 76a36 36 0 0 1 72 0v18q0 10-10 12v14H54v-14q-10-2-10-12z', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: ells([[66, 82, 9, 10], [94, 82, 9, 10]]) + 'M80 94l-5 9h10z' }, 'dark', { accent: true }),
    s('path', { d: 'M66 110v10M74 110v10M82 110v10M90 110v10', ...SW(2) }, 'dark', { stroke: true })
  ],
  ecuación: [
    s('rect', { x: 14, y: 36, width: 132, height: 88, rx: 6 }, 'green'),
    s('rect', { x: 14, y: 36, width: 132, height: 88, rx: 6, ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 24, y: 68, width: 22, height: 22 }, 'yellow', { accent: true }),
    s('path', { d: 'M54 79h12M60 73v12M104 75h12M104 83h12', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M74 90l11-22 11 22z' }, 'pink'),
    s('circle', { cx: 132, cy: 79, r: 10 }, 'sky')
  ],
  ejercitar: [
    ground(),
    ...person(80, 136, 'red', { accent: true }),
    s('path', { d: 'M68 98l-12-32M92 98l12-32', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M40 62h80', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: rects([[28, 48, 12, 28], [120, 48, 12, 28]]) }, 'dark')
  ],
  encerrado: [
    ...person(80, 128, 'orange', { accent: true }),
    s('path', { d: 'M85 76q-5-4-10 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M36 30v100M54 30v100M72 30v100M90 30v100M108 30v100M126 30v100', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 24h104v8H28zM28 128h104v8H28z' }, 'dark')
  ],
  enfermería: [
    ...lady(50, 136, 'sky'),
    s('path', { d: 'M40 64h20l-3-9H43z' }, 'white'),
    s('path', { d: 'M40 64h20l-3-9H43z', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 86, y: 32, width: 54, height: 46, rx: 6 }, 'white'),
    outline({ x: 86, y: 32, width: 54, height: 46, rx: 6 }),
    s('path', { d: 'M108 40h10v10h10v10h-10v10h-10v-10H98V50h10z' }, 'green', { accent: true }),
    s('rect', { x: 86, y: 96, width: 54, height: 40, rx: 3 }, 'tan')
  ],
  equipamiento: [
    ground(),
    s('rect', { x: 22, y: 52, width: 56, height: 84, rx: 16 }, 'orange', { accent: true }),
    s('rect', { x: 32, y: 96, width: 36, height: 28, rx: 6 }, 'brown'),
    s('path', { d: 'M38 52q12-20 24 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M90 132a26 26 0 0 1 52 0zM86 128h60v8H86z' }, 'yellow'),
    s('path', { d: ring(116, 64, 18) + ring(116, 64, 9), ...SW(5) }, 'tan', { stroke: true })
  ],
  equivaler: [
    s('path', { d: 'M80 36v96M56 136h48', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 44h104', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 44l-12 36M28 44l12 36M132 44l-12 36M132 44l12 36', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 80h28a14 10 0 0 1-28 0zM118 80h28a14 10 0 0 1-28 0z' }, 'gray'),
    s('path', { d: ells([[28, 74, 10, 4], [28, 67, 10, 4], [28, 60, 10, 4]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M120 78l5-14h14l5 14z' }, 'orange')
  ],
  escultura: [
    s('rect', { x: 52, y: 108, width: 56, height: 30 }, 'gray'),
    s('rect', { x: 46, y: 102, width: 68, height: 8, rx: 2 }, 'dark'),
    s('path', { d: 'M50 102q0-30 30-30t30 30z' }, 'tan', { accent: true }),
    s('ellipse', { cx: 80, cy: 54, rx: 18, ry: 22 }, 'tan'),
    s('path', { d: 'M62 50a18 22 0 0 1 36 0q-18-10-36 0z' }, 'brown'),
    s('path', { d: 'M73 60h0M87 60h0', ...SW(4) }, 'brown', { stroke: true })
  ],
  expulsado: [
    ...person(44, 136, 'blue', { h: 36, w: 24, r: 10 }),
    arrow('M64 64H24M32 56l-8 8 8 8', 'orange', 4),
    s('path', { d: 'M118 140L94 76', ...SW(16) }, 'black', { stroke: true }),
    s('circle', { cx: 90, cy: 68, r: 10 }, 'skin'),
    s('rect', { x: 74, y: 20, width: 30, height: 42, rx: 3, transform: 'rotate(-10 89 41)' }, 'red', { accent: true })
  ],
  extraer: [
    s('path', { d: 'M56 76q0-20 24-20t24 20q0 16-6 30l-4 26q-2 6-6 0l-4-20q-4-4-8 0l-4 20q-4 6-6 0l-4-26q-6-14-6-30z' }, 'white'),
    s('path', { d: 'M56 76q0-20 24-20t24 20q0 16-6 30l-4 26q-2 6-6 0l-4-20q-4-4-8 0l-4 20q-4 6-6 0l-4-26q-6-14-6-30z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 62q22-18 44 0', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M76 48l-10-30M84 48l10-30', ...SW(7) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 48, r: 5 }, 'dark'),
    arrow('M128 100V52M120 60l8-8 8 8', 'orange', 5)
  ],
  fidelidad: [
    s('path', { d: 'M50 138q-4-40 20-52h20q20 12 16 52z' }, 'brown'),
    s('path', { d: ells([[58, 70, 8, 16], [102, 70, 8, 16]]) }, 'dark'),
    s('circle', { cx: 80, cy: 70, r: 22 }, 'brown'),
    s('ellipse', { cx: 80, cy: 80, rx: 10, ry: 7 }, 'tan'),
    s('path', { d: dots([[72, 64], [88, 64]], 3) + dots([[80, 76]], 4) }, 'dark'),
    s('path', { d: 'M64 92h32', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: heart(80, 30, 10) }, 'red', { accent: true })
  ],
  francamente: [
    ground(),
    ...person(52, 136, 'blue', { accent: true }),
    s('circle', { cx: 52, cy: 106, r: 6 }, 'skin'),
    s('path', { d: bubble(80, 20, 64, 46) }, 'white'),
    s('path', { d: bubble(80, 20, 64, 46), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M98 42l8 8 16-16', ...SW(5) }, 'green', { stroke: true })
  ],
  gramo: [
    s('path', { d: 'M30 104h100l-8 32H38z' }, 'gray'),
    s('rect', { x: 62, y: 112, width: 36, height: 16, rx: 3 }, 'dark'),
    s('rect', { x: 68, y: 117, width: 14, height: 6 }, 'green'),
    s('rect', { x: 24, y: 94, width: 112, height: 8, rx: 4 }, 'sky'),
    s('rect', { x: 74, y: 82, width: 12, height: 12, rx: 2 }, 'red', { accent: true }),
    arrow('M80 36v34M72 62l8 8 8-8', 'orange', 4)
  ],
  inmunidad: [
    s('path', { d: 'M80 30l40 14v30q0 36-40 56q-40-20-40-56V44z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 44l28 10v22q0 26-28 40q-28-14-28-40V54z' }, 'sky'),
    s('path', { d: 'M70 80l8 8 14-16', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: dots([[26, 40], [134, 48], [130, 122], [28, 116]], 8) }, 'green'),
    s('path', { d: rays(26, 40, 8, 13, 8) + rays(134, 48, 8, 13, 8) + rays(130, 122, 8, 13, 8) + rays(28, 116, 8, 13, 8), ...SW(3) }, 'green', { stroke: true })
  ],
  inusual: [
    s('path', { d: dots([[32, 52], [80, 52], [128, 52], [32, 108], [128, 108]], 16) }, 'gray'),
    s('path', { d: star(80, 110, 24) }, 'red', { accent: true }),
    s('path', { d: sparkle(108, 84, 7) + sparkle(54, 132, 6) }, 'yellow')
  ],
  inventar: [
    s('path', { d: halfRays(80, 56, 38, 46, 7), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M80 24a32 32 0 0 1 20 57v15H60V81a32 32 0 0 1 20-57z' }, 'yellow', { accent: true }),
    s('path', { d: 'M70 62l6 10 4-10 4 10 6-10', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: rects([[60, 98, 40, 8], [64, 108, 32, 8]]) }, 'gray'),
    s('path', { d: 'M70 118h20l-4 8h-12z' }, 'dark')
  ],
  leña: [
    ground(136),
    s('path', { d: dots([[44, 116], [80, 116], [116, 116], [62, 84], [98, 84], [80, 52]], 18) }, 'brown', { accent: true }),
    s('path', { d: dots([[44, 116], [80, 116], [116, 116], [62, 84], [98, 84], [80, 52]], 11) }, 'tan'),
    s('path', { d: dots([[44, 116], [80, 116], [116, 116], [62, 84], [98, 84], [80, 52]], 3) }, 'brown')
  ],
  lote: [
    s('rect', { x: 22, y: 40, width: 116, height: 92 }, 'green'),
    s('rect', { x: 22, y: 40, width: 116, height: 92, ...DASH(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[22, 40], [138, 40], [22, 132], [138, 132]], 6) }, 'red', { accent: true }),
    s('path', { d: 'M80 92v30', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 60, y: 70, width: 40, height: 24, rx: 3 }, 'white'),
    s('path', { d: 'M68 78h24M68 86h16', ...SW(3) }, 'gray', { stroke: true })
  ],
  madero: [
    s('path', { d: 'M20 76l100-30 24 12-100 30z' }, 'tan'),
    s('path', { d: 'M20 76l24 12v26l-24-12z' }, 'tan'),
    s('path', { d: 'M44 88l100-30v26L44 114z' }, 'brown', { accent: true }),
    s('path', { d: 'M24 84q8 0 16 10M24 92q6 2 12 8', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M60 98q30-10 70-22M64 106q30-10 56-17', ...SW(2) }, 'dark', { stroke: true })
  ],
  mango: [
    s('path', { d: 'M44 74q4-36 44-34q36 4 34 44q-4 46-46 48q-36-4-32-58z' }, 'orange', { accent: true }),
    s('path', { d: 'M44 74q4-36 44-34q-30 10-30 40q0 30 20 50q-38-6-34-56z' }, 'red'),
    s('ellipse', { cx: 98, cy: 70, rx: 8, ry: 14, transform: 'rotate(-30 98 70)' }, 'yellow'),
    s('path', { d: 'M88 40q2-12 8-18', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(96, 24, -10, 36, 9) }, 'green')
  ],
  marítimo: [
    s('path', { d: ring(80, 32, 10), ...SW(6) }, 'navy', { stroke: true }),
    s('path', { d: 'M80 42v76M60 58h40M38 90q4 36 42 36q38 0 42-36M32 98l6-10 8 8M128 98l-6-10-8 8', ...SW(7) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M18 142q8-8 16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: birds([[124, 34], [140, 48]]), ...SW(3) }, 'gray', { stroke: true })
  ],
  moderado: [
    s('path', { d: wedge(80, 116, 58, 180, 240) }, 'sky'),
    s('path', { d: wedge(80, 116, 58, 240, 300) }, 'green', { accent: true }),
    s('path', { d: wedge(80, 116, 58, 300, 360) }, 'red'),
    s('path', { d: 'M80 116V68', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 116, r: 8 }, 'dark'),
    s('rect', { x: 18, y: 124, width: 124, height: 10, rx: 4 }, 'gray')
  ],
  montero: [
    ground(),
    ...person(60, 136, 'green', { accent: true }),
    s('path', { d: 'M44 66h32v-4H44zM50 62l4-12h12l4 12z' }, 'brown'),
    s('path', { d: 'M74 94q30 0 44-22l10 4q-10 32-54 26z' }, 'yellow'),
    s('path', { d: 'M132 60q6 8 0 16M138 52q8 12 0 26', ...SW(3) }, 'orange', { stroke: true })
  ],
  mutuo: [
    ground(),
    ...person(32, 136, 'blue'),
    ...person(128, 136, 'red'),
    s('path', { d: 'M54 80h50M96 72l8 8-8 8', ...SW(5) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M106 108H56M64 100l-8 8 8 8', ...SW(5) }, 'green', { stroke: true })
  ],
  neutral: [
    ...face(80, 80, 54, 'yellow', 'flat', { accent: true }),
    s('path', { d: 'M50 50h20M90 50h20', ...SW(4) }, 'brown', { stroke: true })
  ],
  ofender: [
    ground(),
    ...person(36, 136, 'purple'),
    ...lean(124, 136, 12, 'blue', { accent: true }),
    s('path', { d: burst(80, 50, 30, 18, 9) }, 'red'),
    s('path', { d: 'M74 38l12 8-8 4 10 12', ...SW(3) }, 'yellow', { stroke: true })
  ],
  patético: [
    ground(),
    s('path', { d: ells([[66, 34, 18, 13], [88, 28, 22, 17], [106, 36, 14, 11]]) }, 'dark'),
    s('path', { d: 'M66 52l-3 8M82 52l-3 8M98 52l-3 8', ...SW(3) }, 'blue', { stroke: true }),
    ...person(80, 136, 'gray', { accent: true }),
    s('path', { d: 'M75 84q5-4 10 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  peculiar: [
    ...person(80, 130, 'purple', { accent: true }),
    s('path', { d: 'M66 64h28l-4-48H70z' }, 'green'),
    s('path', { d: 'M69 30h22M68 46h24', ...SW(4) }, 'yellow', { stroke: true }),
    s('ellipse', { cx: 70, cy: 134, rx: 9, ry: 5 }, 'red'),
    s('ellipse', { cx: 92, cy: 134, rx: 9, ry: 5 }, 'blue'),
    s('path', { d: dots([[75, 72]], 2) + dots([[86, 71]], 4) }, 'dark')
  ],
  pescador: [
    s('path', { d: 'M14 112h132v34H14z' }, 'blue'),
    s('path', { d: 'M70 80L126 30', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M126 30v90', ...SW(1.5) }, 'gray', { stroke: true }),
    ...person(60, 102, 'yellow', { h: 30, w: 24, r: 10, accent: true }),
    s('path', { d: 'M22 100h80l-10 20H32z' }, 'brown'),
    s('path', { d: fishes([[126, 132]]) }, 'orange')
  ],
  pi: [
    s('circle', { cx: 80, cy: 70, r: 44 }, 'cream'),
    s('path', { d: ring(80, 70, 44), ...SW(6) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M36 70h88', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: dots([[36, 70], [124, 70]], 5) }, 'navy'),
    s('path', { d: 'M18 134h36M60 134h36M102 134h36', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M140 134h4', ...SW(5) }, 'orange', { stroke: true })
  ],
  presunto: [
    ground(),
    ...person(66, 136, 'dark', { accent: true }),
    s('path', { d: 'M50 64h32v-4H50zM56 60l3-12h14l3 12z' }, 'black'),
    s('path', { d: ring(84, 76, 22), ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 92l22 22', ...SW(9) }, 'brown', { stroke: true })
  ],
  proporcional: [
    s('path', { d: 'M24 132h112L24 28z' }, 'sky'),
    s('path', { d: 'M24 132h74L24 63z' }, 'blue'),
    s('path', { d: 'M24 132h38L24 97z' }, 'navy', { accent: true }),
    s('path', { d: 'M24 132h112L24 28z', ...SW(3) }, 'navy', { stroke: true })
  ],
  prostituto: [
    backdrop('navy'),
    s('path', { d: 'M58 46h12l34 90H24z' }, 'cream'),
    s('path', { d: 'M40 136V36h24', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M54 36h20l-4 10h-12z' }, 'yellow'),
    ...person(74, 136, 'red', { accent: true }),
    s('circle', { cx: 122, cy: 36, r: 10 }, 'cream')
  ],
  puñado: [
    s('rect', { x: 60, y: 124, width: 40, height: 22, rx: 4 }, 'blue'),
    s('path', { d: 'M28 88h104q-6 40-52 44q-46-4-52-44z' }, 'skin'),
    s('path', { d: ells([[62, 84, 9, 6], [80, 82, 9, 6], [98, 84, 9, 6], [70, 72, 9, 6], [90, 72, 9, 6], [80, 62, 9, 6]]) }, 'brown', { accent: true }),
    s('path', { d: 'M28 88q52 16 104 0', ...SW(4) }, 'tan', { stroke: true })
  ],
  repercusión: [
    s('path', { d: ells([[80, 112, 64, 22]]) }, 'sky'),
    s('path', { d: ells([[80, 112, 46, 15], [80, 112, 26, 8]]), ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: drop(64, 92, 4) + drop(96, 92, 4) + drop(80, 86, 4) }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 44, r: 11 }, 'gray'),
    s('path', { d: 'M80 18v10M70 22l3 8M90 22l-3 8', ...SW(3) }, 'gray', { stroke: true })
  ],
  resaltar: [
    ...paper(24, 26, 92, 110),
    s('path', { d: 'M36 46h68M36 62h68M36 94h68M36 110h50', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 32, y: 72, width: 78, height: 14, rx: 3 }, 'yellow'),
    s('path', { d: 'M36 79h68', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 105, y: 24, width: 18, height: 46, rx: 4, transform: 'rotate(25 114 80)' }, 'yellow', { accent: true }),
    s('rect', { x: 105, y: 66, width: 18, height: 14, rx: 2, transform: 'rotate(25 114 80)' }, 'dark')
  ],
  revuelta: [
    s('path', { d: 'M94 112V24', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M94 26h42l-8 12 8 12H94z' }, 'red', { accent: true }),
    s('path', { d: busts([28, 56, 84, 112, 136], 140, 22, 32) }, 'gray'),
    s('path', { d: dots([[28, 100], [56, 96], [84, 100], [112, 96], [136, 100]], 9) }, 'skin'),
    s('path', { d: 'M36 114l8-42M62 108l6-40M118 108l6-40', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: dots([[44, 70], [68, 66], [124, 66]], 6) }, 'skin')
  ],
  sarcasmo: [
    s('circle', { cx: 80, cy: 82, r: 54 }, 'yellow', { accent: true }),
    s('path', { d: ells([[60, 70, 11, 9], [100, 70, 11, 9]]) }, 'white'),
    s('path', { d: dots([[60, 64], [100, 64]], 5) }, 'dark'),
    s('path', { d: 'M58 108q22 6 40-10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M46 52q10-10 24-6M90 50l22 2', ...SW(4) }, 'brown', { stroke: true })
  ],
  sinceridad: [
    s('path', { d: heart(80, 76, 26) }, 'red', { accent: true }),
    s('path', { d: 'M24 100q8 34 56 34q48 0 56-34q-28 14-56 14t-56-14z' }, 'skin'),
    s('path', { d: 'M18 120l12-10M142 120l-12-10', ...SW(12) }, 'blue', { stroke: true }),
    s('path', { d: sparkle(32, 40, 10) + sparkle(128, 38, 8) }, 'yellow')
  ],
  tango: [
    ground(),
    ...lady(62, 136, 'red', { accent: true }),
    ...person(100, 136, 'black'),
    s('path', { d: 'M70 94h18M60 92L44 70', ...SW(5) }, 'skin', { stroke: true })
  ],
  telefonía: [
    s('path', { d: 'M62 136l14-88 14 88M66 110h20M70 86h12M72 66h8', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 76, cy: 44, r: 5 }, 'red'),
    s('path', { d: 'M58 34q-8 10 0 20M48 28q-14 16 0 32M94 34q8 10 0 20M104 28q14 16 0 32', ...SW(4) }, 'blue', { stroke: true, accent: true }),
    s('rect', { x: 110, y: 94, width: 28, height: 46, rx: 5 }, 'dark'),
    s('rect', { x: 114, y: 100, width: 20, height: 32, rx: 2 }, 'sky')
  ],
  televisar: [
    s('path', { d: 'M48 84l-20 52M48 84v52M48 84l20 52', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[34, 40], [58, 40]], 11) }, 'dark'),
    s('rect', { x: 18, y: 50, width: 58, height: 34, rx: 6 }, 'dark'),
    s('rect', { x: 76, y: 58, width: 14, height: 18, rx: 3 }, 'gray'),
    s('circle', { cx: 28, cy: 58, r: 4 }, 'red'),
    s('path', { d: 'M98 50q8 8 0 16M108 44q14 14 0 28', ...SW(3) }, 'orange', { stroke: true }),
    s('rect', { x: 94, y: 86, width: 50, height: 40, rx: 5 }, 'navy'),
    s('rect', { x: 99, y: 91, width: 40, height: 30, rx: 2 }, 'sky', { accent: true }),
    s('path', { d: dots([[119, 100]], 5) + busts([119], 121, 16, 14) }, 'red')
  ],
  teórico: [
    s('rect', { x: 14, y: 22, width: 132, height: 94, rx: 6 }, 'green'),
    s('rect', { x: 14, y: 22, width: 132, height: 94, rx: 6, ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M30 100h56M30 100V38', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M34 94q20-2 30-28t20-28', ...SW(3) }, 'yellow', { stroke: true }),
    s('circle', { cx: 116, cy: 60, r: 16 }, 'yellow', { accent: true }),
    s('rect', { x: 109, y: 74, width: 14, height: 10, rx: 2 }, 'gray'),
    s('rect', { x: 22, y: 120, width: 116, height: 8, rx: 2 }, 'brown')
  ],
  trago: [
    s('path', { d: 'M28 146q0-40 32-44q32 4 32 44z' }, 'blue'),
    s('circle', { cx: 60, cy: 62, r: 30 }, 'skin'),
    s('path', { d: 'M30 60a30 30 0 0 1 58-12q-30-8-58 12z' }, 'brown'),
    s('path', { d: 'M66 58q5 4 10 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M90 64h30l-4 44H94z', transform: 'rotate(-35 104 86)' }, 'sky'),
    s('path', { d: 'M91 84h28l-3 24H94z', transform: 'rotate(-35 104 86)' }, 'orange', { accent: true })
  ],
  vegetación: [
    s('path', { d: 'M14 116q40-20 70-4t62-6v40H14z' }, 'mint'),
    s('path', { d: 'M44 118V86M112 112V80', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: dots([[44, 72], [112, 66]], 22) }, 'green', { accent: true }),
    s('path', { d: ells([[78, 120, 18, 12], [134, 126, 12, 9], [24, 128, 10, 8]]) }, 'green'),
    s('path', { d: 'M60 140l-4-10M66 140v-12M100 140l4-10M94 140v-12', ...SW(3) }, 'green', { stroke: true })
  ],
  vendido: [
    ground(),
    ...person(60, 136, 'gray'),
    s('path', { d: dots([[64, 76], [69, 76]], 2) }, 'dark'),
    s('path', { d: 'M54 84h10', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M72 110h18', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M100 100q-18 14-8 36h32q10-22-8-36z' }, 'yellow', { accent: true }),
    s('path', { d: 'M100 98h16', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: dots([[130, 50], [118, 40], [138, 32]], 5) }, 'orange')
  ],
  verificación: [
    ...paper(24, 20, 78, 102),
    s('path', { d: 'M36 40h54M36 54h54M36 68h40', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 96, cy: 92, r: 24 }, 'sky'),
    s('path', { d: ring(96, 92, 24), ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M113 109l22 22', ...SW(9) }, 'dark', { stroke: true }),
    s('path', { d: 'M84 92l8 8 14-16', ...SW(5) }, 'green', { stroke: true, accent: true })
  ],
  visibilidad: [
    backdrop('gray'),
    s('path', { d: 'M40 80L146 34v92z' }, 'white'),
    s('path', { d: 'M114 112V92', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 114, cy: 82, r: 13 }, 'green'),
    s('path', { d: 'M16 80q18-20 36 0q-18 20-36 0z' }, 'white'),
    s('circle', { cx: 34, cy: 80, r: 7 }, 'blue', { accent: true }),
    s('path', { d: 'M22 40q20-10 40 0M24 124q20-10 40 0', ...SW(5) }, 'white', { stroke: true })
  ],
  vocal: [
    s('path', { d: 'M30 84q50-44 100 0q-50 52-100 0z' }, 'red', { accent: true }),
    s('ellipse', { cx: 80, cy: 86, rx: 34, ry: 18 }, 'dark'),
    s('rect', { x: 58, y: 68, width: 44, height: 7, rx: 3 }, 'white'),
    ...note(110, 46, 'purple'),
    ...note(24, 128, 'blue')
  ],
  acumulación: [
    s('path', { d: rects([[22, 108, 36, 28], [62, 108, 36, 28], [102, 108, 36, 28], [42, 78, 36, 28], [82, 78, 36, 28]]) }, 'tan'),
    s('rect', { x: 62, y: 48, width: 36, height: 28 }, 'orange', { accent: true }),
    s('path', { d: 'M40 108v28M80 108v28M120 108v28M60 78v28M100 78v28M80 48v28', ...SW(2) }, 'brown', { stroke: true }),
    arrow('M130 70V22M122 30l8-8 8 8', 'dark', 5)
  ],
  alusión: [
    s('circle', { cx: 54, cy: 82, r: 34 }, 'yellow', { accent: true }),
    s('circle', { cx: 42, cy: 74, r: 4 }, 'dark'),
    s('path', { d: 'M58 74q6-6 12 0M38 94q14 12 28 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 52q30-34 52 4', ...DASH(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M126 52l8 6 2-10', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: star(128, 100, 16) }, 'purple'),
    s('rect', { x: 108, y: 106, width: 38, height: 32, rx: 3 }, 'brown')
  ],
  amnistía: [
    s('path', { d: halfRays(80, 70, 44, 54, 7), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: ring(52, 100, 20), ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: 'M88 100a20 20 0 1 0 16-19.6', ...SW(7) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M72 100h16', ...SW(5, { 'stroke-dasharray': '4 3' }) }, 'dark', { stroke: true }),
    s('path', { d: birds([[96, 38], [118, 26]]), ...SW(4) }, 'blue', { stroke: true })
  ],
  andaluz: [
    backdrop('sky'),
    s('rect', { x: 30, y: 62, width: 100, height: 84 }, 'white'),
    s('path', { d: 'M24 64h112l-10-14H34z' }, 'red'),
    s('path', { d: 'M68 146v-34a12 12 0 0 1 24 0v34z' }, 'brown', { accent: true }),
    s('rect', { x: 104, y: 80, width: 14, height: 18 }, 'navy'),
    s('path', { d: rects([[38, 88, 12, 10], [52, 88, 12, 10]]) }, 'blue'),
    s('path', { d: dots([[44, 84], [58, 84]], 5) }, 'pink'),
    s('circle', { cx: 128, cy: 30, r: 10 }, 'yellow')
  ],
  asado: [
    s('path', { d: 'M70 54q-6-10 0-20t0-18M94 54q-6-10 0-20', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 90q-4-14 6-22q0 10 6 12q0 6-4 10zM112 90q-4-14 6-22q0 10 6 12q0 6-4 10z' }, 'orange'),
    s('path', { d: ells([[62, 80, 20, 10], [100, 80, 20, 10]]) }, 'brown', { accent: true }),
    s('path', { d: 'M54 74l6 12M66 74l6 12M92 74l6 12M104 74l6 12', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 90h112', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 92h100l-10 24H40z' }, 'dark'),
    s('path', { d: 'M44 116l-8 22M116 116l8 22', ...SW(5) }, 'dark', { stroke: true })
  ],
  atrapado: [
    s('path', { d: rays(80, 80, 0, 64, 8, 22.5), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: ring(80, 80, 20) + ring(80, 80, 40) + ring(80, 80, 60), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: ells([[88, 66, 8, 5], [104, 66, 8, 5]]) }, 'sky'),
    s('ellipse', { cx: 96, cy: 74, rx: 8, ry: 11 }, 'dark', { accent: true }),
    s('circle', { cx: 46, cy: 40, r: 7 }, 'black'),
    s('path', { d: 'M40 34l-6-6M52 34l6-6M40 46l-6 6M52 46l6 6', ...SW(2) }, 'black', { stroke: true })
  ],
  auditorio: [
    s('rect', { x: 14, y: 86, width: 132, height: 12 }, 'brown'),
    ...person(80, 86, 'blue', { h: 30, w: 22, r: 10 }),
    s('path', { d: 'M14 14h132v16H14z' }, 'red'),
    s('path', { d: 'M14 14h22q-6 50 6 72H14zM146 14h-22q6 50-6 72h28z' }, 'red', { accent: true }),
    s('path', { d: busts([26, 53, 80, 107, 134], 146, 22, 22) }, 'navy'),
    s('path', { d: dots([[26, 116], [53, 116], [80, 116], [107, 116], [134, 116]], 9) }, 'dark')
  ],
  aviación: [
    s('path', { d: 'M70 80l-18-40h14l34 40zM70 88l-18 40h14l34-40z' }, 'blue', { accent: true }),
    s('path', { d: 'M24 80l-6-26h10l16 26z' }, 'red'),
    s('path', { d: 'M20 84q0-10 14-10h92q14 0 20 10q-6 10-20 10H34q-14 0-14-10z' }, 'white'),
    s('path', { d: 'M20 84q0-10 14-10h92q14 0 20 10q-6 10-20 10H34q-14 0-14-10z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[60, 82], [72, 82], [84, 82], [96, 82], [108, 82]], 3) }, 'sky'),
    s('path', { d: 'M130 79q8 0 12 5h-12z' }, 'navy')
  ],
  bondad: [
    ground(),
    ...person(50, 136, 'green', { accent: true }),
    ...person(114, 136, 'orange', { h: 30, w: 24, r: 10 }),
    s('path', { d: 'M62 104l14-10', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(86, 86, 12) }, 'red'),
    s('path', { d: sparkle(100, 46, 8) }, 'yellow')
  ],
  cabra: [
    s('path', { d: 'M46 104v32M60 106v30M90 106v30M104 104v32', ...SW(6) }, 'tan', { stroke: true }),
    s('path', { d: 'M36 80l-10-10', ...SW(4) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 74, cy: 88, rx: 40, ry: 22 }, 'tan'),
    s('path', { d: 'M100 82l14-24', ...SW(14) }, 'tan', { stroke: true }),
    s('path', { d: 'M114 50q-4-18 8-26M120 50q4-14 16-14', ...SW(5) }, 'gray', { stroke: true, accent: true }),
    s('ellipse', { cx: 124, cy: 62, rx: 16, ry: 10, transform: 'rotate(30 124 62)' }, 'tan'),
    s('path', { d: 'M132 72l-2 14 8-10z' }, 'brown'),
    s('circle', { cx: 122, cy: 58, r: 2.5 }, 'dark')
  ],
  cancelación: [
    s('path', { d: 'M20 58h120v14a8 8 0 0 0 0 16v14H20V88a8 8 0 0 0 0-16z' }, 'yellow'),
    s('path', { d: 'M108 58v44', ...DASH(2, '4 4') }, 'brown', { stroke: true }),
    s('path', { d: 'M34 74h56M34 88h40', ...SW(4) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 44, ...SW(9) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M49 49l62 62', ...SW(9) }, 'red', { stroke: true })
  ],
  carril: [
    s('path', { d: 'M60 14h40l46 132H14z' }, 'dark'),
    s('path', { d: 'M73 14h14l15 132H58z' }, 'blue', { accent: true }),
    s('path', { d: 'M73 16l-2 14M71 44l-3 20M67 80l-4 26M62 122l-3 22M87 16l2 14M89 44l3 20M93 80l4 26M98 122l3 22', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M60 14L14 146M100 14l46 132', ...SW(3) }, 'yellow', { stroke: true }),
    s('rect', { x: 68, y: 92, width: 24, height: 18, rx: 4 }, 'red'),
    s('path', { d: dots([[73, 104], [87, 104]], 2.5) }, 'yellow')
  ],
  catedrático: [
    ...person(80, 104, 'navy'),
    s('path', { d: 'M60 36l20-9 20 9-20 9z' }, 'black'),
    s('path', { d: 'M100 36v12', ...SW(2) }, 'yellow', { stroke: true }),
    s('path', { d: ring(75, 49, 4) + ring(85, 49, 4), ...SW(1.5) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 96h56l-8 44H60z' }, 'brown', { accent: true }),
    s('path', { d: 'M62 94l18-6 18 6', ...SW(4) }, 'cream', { stroke: true })
  ],
  celoso: [
    ground(),
    ...person(40, 136, 'green', { accent: true }),
    s('circle', { cx: 40, cy: 78, r: 12 }, 'mint'),
    s('path', { d: 'M33 76h5M43 76h5M35 84q5-3 10 0', ...SW(2) }, 'dark', { stroke: true }),
    ...person(100, 136, 'blue', { h: 40, w: 24, r: 11 }),
    ...person(126, 136, 'pink', { h: 40, w: 24, r: 11 }),
    s('path', { d: heart(113, 54, 9) }, 'red')
  ],
  cereal: [
    s('path', { d: 'M30 72V24', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: ells([[26, 30, 4, 7], [34, 30, 4, 7], [26, 42, 4, 7], [34, 42, 4, 7], [26, 54, 4, 7], [34, 54, 4, 7]]) }, 'orange'),
    s('path', { d: 'M104 80l24-48', ...SW(5) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 130, cy: 28, rx: 6, ry: 9, transform: 'rotate(28 130 28)' }, 'gray'),
    s('path', { d: 'M24 84h112q-6 50-56 50t-56-50z' }, 'blue', { accent: true }),
    s('ellipse', { cx: 80, cy: 84, rx: 56, ry: 10 }, 'cream'),
    s('path', { d: ells([[58, 82, 7, 4], [76, 78, 7, 4], [94, 84, 7, 4], [112, 80, 7, 4], [68, 88, 6, 3]]) }, 'orange')
  ],
  cerámica: [
    s('rect', { x: 36, y: 136, width: 88, height: 8, rx: 4 }, 'gray'),
    s('path', { d: 'M64 24h32v10q-4 8 10 22q22 24 6 58q-8 18-32 22q-24-4-32-22q-16-34 6-58q14-14 10-22z' }, 'orange', { accent: true }),
    s('path', { d: 'M48 74h64M44 98h72', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: dots([[60, 86], [80, 86], [100, 86]], 4) }, 'cream'),
    s('rect', { x: 60, y: 20, width: 40, height: 8, rx: 3 }, 'brown')
  ],
  clasificado: [
    s('path', { d: dots([[36, 80], [30, 58]], 8) }, 'red'),
    s('path', { d: dots([[80, 80], [86, 58]], 8) }, 'blue'),
    s('path', { d: dots([[124, 80], [118, 58]], 8) }, 'green'),
    s('path', { d: 'M16 92h40l-4 44H20z' }, 'red', { accent: true }),
    s('path', { d: 'M60 92h40l-4 44H64z' }, 'blue'),
    s('path', { d: 'M104 92h40l-4 44h-32z' }, 'green'),
    s('path', { d: 'M80 20v18M72 30l8 8 8-8', ...SW(4) }, 'dark', { stroke: true })
  ],
  cláusula: [
    ...paper(36, 16, 92, 126),
    s('path', { d: 'M48 32h68M48 44h68M48 100h68M48 112h50', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 44, y: 56, width: 76, height: 32, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M50 64h64M50 72h64M50 80h40', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 130q6-10 10 0t10 0t10-4', ...SW(3) }, 'navy', { stroke: true }),
    arrow('M14 72h18M24 64l8 8-8 8', 'red', 4)
  ],
  coherente: [
    ...gear(54, 62, 20, 10, 'blue', { accent: true }),
    ...gear(100, 92, 16, 8, 'orange'),
    ...gear(56, 118, 12, 7, 'green'),
    s('path', { d: dots([[54, 62], [100, 92], [56, 118]], 5) }, 'white')
  ],
  contundente: [
    s('path', { d: burst(60, 108, 34, 16, 10) }, 'orange', { accent: true }),
    s('rect', { x: 28, y: 110, width: 64, height: 28, rx: 2 }, 'tan'),
    s('path', { d: 'M60 110l-6 10 8 8-4 10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 82L128 30', ...SW(8) }, 'brown', { stroke: true }),
    s('rect', { x: 40, y: 78, width: 44, height: 24, rx: 4, transform: 'rotate(-40 62 90)' }, 'gray')
  ],
  crío: [
    s('path', { d: 'M62 124v12M78 124v12', ...SW(8) }, 'skin', { stroke: true }),
    s('rect', { x: 54, y: 88, width: 32, height: 38, rx: 12 }, 'yellow', { accent: true }),
    ...face(70, 68, 22, 'skin', 'smile'),
    s('path', { d: 'M66 46q4-8 10-2', ...SW(3) }, 'brown', { stroke: true }),
    s('circle', { cx: 114, cy: 122, r: 14 }, 'red'),
    s('path', { d: 'M100 122h28', ...SW(3) }, 'white', { stroke: true })
  ],
  cultivar: [
    s('circle', { cx: 32, cy: 36, r: 12 }, 'yellow'),
    s('path', { d: ells([[80, 126, 64, 10], [80, 102, 52, 8]]) }, 'brown'),
    s('path', { d: 'M48 122v-14M80 122v-14M112 122v-14M58 98v-12M80 98v-12M102 98v-12', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: [[48, 108], [80, 108], [112, 108], [58, 86], [80, 86], [102, 86]].map(([x, y]) => leaflet(x, y, -40, 12, 4) + leaflet(x, y, -140, 12, 4)).join('') }, 'green', { accent: true }),
    s('path', { d: 'M132 26l-24 50', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 70l16 6-6 8z' }, 'gray')
  ],
  dañar: [
    s('path', { d: 'M26 48l-10-6M28 68H14M134 48l10-6M132 68h14', ...SW(3) }, 'orange', { stroke: true }),
    s('rect', { x: 46, y: 18, width: 68, height: 124, rx: 10 }, 'dark'),
    s('rect', { x: 52, y: 28, width: 56, height: 100, rx: 3 }, 'sky'),
    s('path', { d: 'M70 28l10 30-14 14 20 18-8 38M80 58l28-8M86 90l22 14', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: burst(80, 58, 10, 4, 8) }, 'red', { accent: true })
  ],
  declarado: [
    ground(),
    s('rect', { x: 36, y: 112, width: 48, height: 24 }, 'brown'),
    ...person(60, 112, 'red', { h: 36, w: 26, r: 11, accent: true }),
    s('path', { d: 'M72 90l12-6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M82 82l30-16v32l-30-16z' }, 'yellow'),
    s('path', { d: 'M120 68q6 14 0 28M130 60q10 22 0 44', ...SW(3) }, 'orange', { stroke: true })
  ],
  descontento: [
    s('rect', { x: 42, y: 92, width: 76, height: 48, rx: 20 }, 'blue'),
    s('path', { d: 'M52 110l56 12M108 110l-56 12', ...SW(10) }, 'skin', { stroke: true }),
    ...face(80, 60, 28, 'skin', 'frown', { accent: true }),
    s('path', { d: 'M62 46l10 4M98 46l-10 4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: ells([[124, 34, 12, 8], [136, 28, 10, 8]]) }, 'gray')
  ],
  desesperado: [
    ground(),
    s('rect', { x: 62, y: 90, width: 36, height: 46, rx: 12 }, 'purple', { accent: true }),
    s('circle', { cx: 80, cy: 66, r: 22 }, 'skin'),
    s('path', { d: 'M64 98l-16-26 12-14M96 98l16-26-12-14', ...SW(7) }, 'skin', { stroke: true }),
    s('ellipse', { cx: 80, cy: 76, rx: 6, ry: 8 }, 'dark'),
    s('path', { d: dots([[72, 62], [88, 62]], 3) }, 'dark'),
    s('path', { d: drop(122, 46, 5) + drop(38, 52, 4) + drop(128, 66, 4) }, 'blue')
  ],
  diamante: [
    s('path', { d: 'M44 46h72l24 26-60 64-60-64z' }, 'sky', { accent: true }),
    s('path', { d: 'M44 46h72l24 26-60 64-60-64z', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M44 46l16 26 20-26 20 26 16-26M20 72h120M60 72l20 64 20-64', ...SW(2) }, 'blue', { stroke: true }),
    s('path', { d: sparkle(126, 30, 10) + sparkle(30, 34, 6) }, 'yellow')
  ],
  diseñar: [
    s('rect', { x: 16, y: 26, width: 110, height: 92, rx: 4 }, 'blue'),
    s('path', { d: 'M40 98V70l26-20 26 20v28zM58 98V80h16v18', ...SW(3) }, 'white', { stroke: true }),
    s('rect', { x: 20, y: 120, width: 110, height: 14, rx: 2, transform: 'rotate(-6 75 127)' }, 'yellow'),
    s('path', { d: 'M34 125v5M50 123v5M66 121v5M82 119v5M98 118v5M114 116v5', transform: 'rotate(-6 75 127)', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M140 30l-34 48', ...SW(10) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M102 76l-6 14 12-6z' }, 'dark')
  ],
  disolución: [
    s('path', { d: 'M48 54h64l-7 84H55z' }, 'sky'),
    s('path', { d: 'M44 34h72l-8 104H52z', ...SW(4) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 80, cy: 124, rx: 16, ry: 6 }, 'white', { accent: true }),
    s('path', { d: dots([[72, 108], [88, 100], [78, 88], [92, 76], [70, 70], [84, 62]], 3) + dots([[60, 116], [100, 118]], 4) }, 'white'),
    s('path', { d: dots([[74, 44], [90, 38]], 2.5) }, 'blue')
  ],
  emprendedor: [
    ground(),
    ...person(48, 136, 'navy'),
    s('rect', { x: 58, y: 110, width: 24, height: 18, rx: 2 }, 'brown'),
    s('path', { d: 'M100 106l-10 14h12zM132 106l10 14h-12z' }, 'red'),
    s('path', { d: 'M116 26q16 16 16 46v40h-32V72q0-30 16-46z' }, 'white'),
    s('path', { d: 'M116 26q16 16 16 46v40h-32V72q0-30 16-46z', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 116, cy: 66, r: 8 }, 'sky'),
    s('path', { d: 'M106 114h20l-10 24z' }, 'orange', { accent: true })
  ],
  estricto: [
    ground(),
    ...person(60, 136, 'dark'),
    s('path', { d: 'M53 72l6 2M67 72l-6 2M55 85q5-4 10 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: ring(55, 77, 4) + ring(65, 77, 4), ...SW(1.5) }, 'dark', { stroke: true }),
    s('path', { d: 'M74 100l22-10', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M94 90l40-40', ...SW(7) }, 'yellow', { stroke: true, accent: true })
  ],
  fabricar: [
    s('path', { d: ells([[114, 28, 8, 6], [128, 20, 10, 7]]) }, 'gray'),
    s('rect', { x: 104, y: 34, width: 18, height: 60 }, 'red'),
    s('path', { d: 'M18 136V84l26 14V84l26 14V84l26 14V80h46v56z' }, 'brown', { accent: true }),
    s('path', { d: rects([[28, 108, 12, 10], [54, 108, 12, 10], [80, 108, 12, 10]]) }, 'yellow'),
    s('rect', { x: 110, y: 110, width: 20, height: 26 }, 'dark'),
    ground()
  ],
  formulario: [
    s('rect', { x: 36, y: 24, width: 88, height: 118, rx: 6 }, 'brown'),
    s('rect', { x: 44, y: 36, width: 72, height: 98, rx: 2 }, 'white'),
    s('rect', { x: 64, y: 18, width: 32, height: 12, rx: 3 }, 'gray'),
    s('path', { d: rects([[52, 48, 10, 10], [52, 72, 10, 10], [52, 96, 10, 10]]), ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M68 53h40M68 77h40M68 101h40M52 122h56', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M51 52l5 6 9-11M51 76l5 6 9-11', ...SW(3) }, 'green', { stroke: true, accent: true })
  ],
  frustración: [
    ...face(80, 92, 42, 'pink', 'frown', { accent: true }),
    s('path', { d: 'M60 72l12 6M100 72l-12 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 30c10-12 18 12 26-2s14 10 22-2 14 10 18-2M52 40c8 8 14-8 22 2s14-8 22 2', ...SW(3) }, 'dark', { stroke: true })
  ],
  guerrilla: [
    ground(),
    s('path', { d: 'M70 80a20 16 0 0 1 40 0z' }, 'brown', { accent: true }),
    s('path', { d: dots([[82, 70], [98, 72]], 4) }, 'green'),
    s('rect', { x: 74, y: 80, width: 32, height: 12 }, 'skin'),
    s('path', { d: dots([[84, 86], [96, 86]], 2.5) }, 'dark'),
    s('path', { d: ells([[48, 112, 32, 26], [92, 108, 34, 26], [126, 116, 20, 20]]) }, 'green'),
    s('path', { d: leaflet(90, 66, -60, 18, 4) + leaflet(90, 66, -120, 18, 4) }, 'mint')
  ],
  hispano: [
    s('circle', { cx: 80, cy: 86, r: 50 }, 'sky'),
    s('path', { d: 'M44 58q14-8 20 6q-4 12 4 20q2 10-6 16l4 10q-2 14-10 22q-6-16-10-30q-10-16-2-44zM100 52q12-6 22 4q-4 10-14 8q-6 4-8-12z' }, 'green'),
    s('path', { d: 'M64 84q20-30 40-26', ...DASH(3) }, 'orange', { stroke: true }),
    s('path', { d: bubble(16, 14, 44, 32) }, 'red', { accent: true }),
    s('path', { d: bubble(100, 14, 44, 32) }, 'yellow'),
    s('path', { d: dots([[30, 30], [38, 30], [46, 30], [114, 30], [122, 30], [130, 30]], 3) }, 'white')
  ],
  imprenta: [
    s('rect', { x: 52, y: 26, width: 56, height: 24 }, 'white'),
    outline({ x: 52, y: 26, width: 56, height: 24 }),
    s('rect', { x: 26, y: 48, width: 108, height: 40, rx: 6 }, 'gray'),
    s('path', { d: dots([[56, 68], [104, 68]], 14) }, 'dark', { accent: true }),
    s('rect', { x: 46, y: 88, width: 68, height: 48 }, 'white'),
    outline({ x: 46, y: 88, width: 68, height: 48 }),
    s('path', { d: 'M54 100h52M54 110h52M54 120h36', ...SW(3) }, 'navy', { stroke: true })
  ],
  influir: [
    ground(),
    s('path', { d: 'M30 102v-24M24 84l6-6 6 6', ...SW(4) }, 'orange', { stroke: true }),
    s('rect', { x: 32, y: 84, width: 14, height: 52, rx: 2, transform: 'rotate(55 46 136)' }, 'red', { accent: true }),
    s('rect', { x: 62, y: 84, width: 14, height: 52, rx: 2, transform: 'rotate(30 76 136)' }, 'navy'),
    s('rect', { x: 88, y: 84, width: 14, height: 52, rx: 2, transform: 'rotate(10 102 136)' }, 'navy'),
    s('rect', { x: 112, y: 84, width: 14, height: 52, rx: 2 }, 'navy'),
    s('path', { d: dots([[95, 100], [95, 120], [119, 100], [119, 120]], 3) }, 'white')
  ],
  insoportable: [
    s('rect', { x: 14, y: 56, width: 40, height: 66, rx: 6 }, 'dark'),
    s('path', { d: dots([[34, 76], [34, 104]], 10) }, 'gray'),
    s('path', { d: 'M62 72q8 16 0 32M72 64q14 24 0 48', ...SW(4) }, 'orange', { stroke: true }),
    ground(),
    ...person(116, 136, 'blue', { accent: true }),
    s('path', { d: 'M102 98l-2-14M130 98l2-14', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: dots([[102, 78], [130, 78]], 6) }, 'skin'),
    s('path', { d: 'M110 84h12M110 74l4 2M122 74l-4 2', ...SW(2) }, 'dark', { stroke: true })
  ],
  islámico: [
    backdrop('sky'),
    s('path', { d: rects([[22, 60, 12, 86], [126, 60, 12, 86]]) }, 'white'),
    s('path', { d: 'M22 60l6-16 6 16zM126 60l6-16 6 16z' }, 'green'),
    s('rect', { x: 44, y: 82, width: 72, height: 64 }, 'cream'),
    s('path', { d: 'M48 82a32 32 0 0 1 64 0z' }, 'green', { accent: true }),
    s('path', { d: 'M80 50V36', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M70 146v-24a10 10 0 0 1 20 0v24z' }, 'brown')
  ],
  laberinto: [
    s('rect', { x: 22, y: 22, width: 116, height: 116, rx: 6 }, 'cream'),
    s('path', { d: 'M84 24H136V136H100M84 136H24V24H64M44 44h48M112 44v72M44 44v72h44M64 64h28v32M64 64v32M108 116h-4', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M74 14v40h-20v66h46', ...DASH(3, '2 6') }, 'red', { stroke: true }),
    s('circle', { cx: 74, cy: 18, r: 6 }, 'red', { accent: true })
  ],
  maldición: [
    s('path', { d: ells([[62, 38, 20, 14], [86, 32, 24, 18], [108, 40, 16, 12]]) }, 'dark'),
    s('path', { d: 'M86 50l-10 16h10l-8 14 18-20h-10l6-10z' }, 'yellow', { accent: true }),
    ground(140),
    ...person(80, 140, 'purple', { h: 36 }),
    s('path', { d: spiral(54, 76) + spiral(104, 78), ...SW(2) }, 'purple', { stroke: true })
  ],
  mutuamente: [
    s('path', { d: 'M14 112l44-22M146 112l-44-22', ...SW(18) }, 'blue', { stroke: true }),
    s('ellipse', { cx: 80, cy: 88, rx: 26, ry: 15 }, 'skin', { accent: true }),
    s('path', { d: 'M70 80v14M78 78v16M86 80v14', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M58 54a24 18 0 0 1 44 0M96 50l6 6 6-8', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M102 122a24 18 0 0 1-44 0M64 126l-6-6-6 8', ...SW(4) }, 'orange', { stroke: true })
  ],
  olla: [
    s('path', { d: 'M60 40q-5-6 0-12t0-12M100 40q-5-6 0-12t0-12', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 82h-12M130 82h12', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 70h100v44q0 22-22 22H52q-22 0-22-22z' }, 'red', { accent: true }),
    s('path', { d: 'M24 68q56-28 112 0z' }, 'dark'),
    s('rect', { x: 72, y: 46, width: 16, height: 8, rx: 3 }, 'dark')
  ],
  preocupante: [
    s('path', { d: 'M80 26l60 104H20z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 26l60 104H20z', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[70, 88], [90, 88]], 4) }, 'dark'),
    s('path', { d: 'M66 110q5-5 9 0t10 0t9 0M64 78l10-4M96 78l-10-4', ...SW(3) }, 'dark', { stroke: true })
  ],
  presentador: [
    s('path', { d: 'M60 14h40l36 122H24z' }, 'cream'),
    ground(),
    ...person(80, 136, 'navy', { accent: true }),
    s('path', { d: 'M80 94l-4 4 4 18 4-18z' }, 'red'),
    s('path', { d: 'M94 106l8-16', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 103, cy: 86, r: 6 }, 'gray')
  ],
  promocionar: [
    s('path', { d: 'M40 70l50-26v72L40 90z' }, 'red', { accent: true }),
    s('rect', { x: 24, y: 66, width: 18, height: 28, rx: 4 }, 'dark'),
    s('path', { d: 'M50 92l-4 24', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: star(120, 46, 12) + star(126, 96, 9) }, 'yellow'),
    s('path', { d: 'M98 70h18M100 82l14 4', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M92 116h32l12 12-12 12H92z' }, 'orange'),
    s('circle', { cx: 100, cy: 128, r: 3 }, 'white')
  ],
  recomendable: [
    s('rect', { x: 26, y: 74, width: 22, height: 64, rx: 3 }, 'blue', { accent: true }),
    s('path', { d: 'M48 78h14l12-34q14-4 14 12l-4 20h28q12 2 10 14l-8 36q-2 10-12 10H48z' }, 'skin'),
    s('path', { d: 'M94 98h20M94 112h18', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: sparkle(116, 40, 12) + sparkle(36, 44, 8) }, 'yellow')
  ],
  rezar: [
    s('path', { d: halfRays(80, 70, 42, 52, 7), ...SW(3) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M58 118l-16 22M102 118l16 22', ...SW(14) }, 'blue', { stroke: true }),
    s('path', { d: 'M80 30q-10 0-14 20l-10 50q-2 14 8 22l16 10zM80 30q10 0 14 20l10 50q2 14-8 22l-16 10z' }, 'skin'),
    s('path', { d: 'M80 32v98', ...SW(2) }, 'tan', { stroke: true })
  ],
  riego: [
    s('path', { d: 'M88 92l28-28', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M112 58l12-6 4 10-10 6z' }, 'green'),
    s('path', { d: 'M46 60q16-24 32 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M38 60h50v44q0 8-8 8H46q-8 0-8-8z' }, 'green', { accent: true }),
    s('path', { d: drop(128, 80, 3) + drop(122, 94, 3) + drop(136, 98, 3) }, 'blue'),
    s('path', { d: 'M126 138v-22', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: leaflet(126, 124, -30, 12, 4) + leaflet(126, 124, -150, 12, 4) }, 'green')
  ],
  simpatía: [
    ...face(80, 82, 50, 'yellow', 'smile', { accent: true }),
    s('path', { d: ells([[52, 94, 8, 5], [108, 94, 8, 5]]) }, 'pink'),
    s('path', { d: heart(130, 34, 8) + heart(28, 40, 6) }, 'red')
  ],
  tatuaje: [
    s('path', { d: 'M14 112q40-12 80-34l20 22q-50 34-100 40z' }, 'skin'),
    s('circle', { cx: 114, cy: 86, r: 18 }, 'skin'),
    s('path', { d: heart(56, 100, 10) }, 'red', { accent: true }),
    s('path', { d: 'M40 108q16 8 32 0', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M88 30l-10 34', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M78 64l-2 8', ...SW(2) }, 'gray', { stroke: true })
  ],
  ternura: [
    s('path', { d: heart(118, 44, 8) + heart(42, 38, 6) }, 'pink'),
    s('circle', { cx: 80, cy: 92, r: 20 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 66, r: 13 }, 'yellow'),
    s('path', { d: 'M92 64l8 3-8 3z' }, 'orange'),
    s('circle', { cx: 84, cy: 62, r: 2 }, 'dark'),
    s('path', { d: 'M24 96q8 40 56 40t56-40q-28 16-56 16t-56-16z' }, 'skin')
  ],
  vulnerable: [
    s('path', { d: ells([[80, 86, 26, 34]]) }, 'cream', { accent: true }),
    s('path', { d: ells([[80, 86, 26, 34]]), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 80l8 8 6-8 8 8 6-6 8 6 10-6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M20 26l26 26M38 52h8v-8M140 26l-26 26M122 52h-8v-8M20 144l24-22M36 122h8v8M140 144l-24-22M124 122h-8v8', ...SW(4) }, 'red', { stroke: true })
  ],
  abastecimiento: [
    ground(130),
    s('path', { d: rects([[22, 30, 30, 24], [56, 30, 30, 24]]) }, 'tan'),
    s('rect', { x: 16, y: 56, width: 80, height: 58, rx: 4 }, 'orange'),
    s('path', { d: 'M96 72h26l16 20v22H96z' }, 'blue', { accent: true }),
    s('path', { d: 'M104 78h16l10 14h-26z' }, 'sky'),
    s('path', { d: dots([[40, 118], [118, 118]], 12) }, 'dark'),
    s('path', { d: dots([[40, 118], [118, 118]], 4) }, 'gray')
  ],
  adaptar: [
    s('path', { d: 'M14 116h132', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 92q-22 4-20 22q4 14 16 6q6-8-2-12', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M60 104l-4 10M92 104l4 10', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M76 64a38 22 0 0 0 0 44z' }, 'green'),
    s('path', { d: 'M76 64a38 22 0 0 1 0 44z' }, 'orange', { accent: true }),
    s('path', { d: 'M108 74l30 10-24 16z' }, 'orange'),
    s('circle', { cx: 116, cy: 82, r: 5 }, 'white'),
    s('circle', { cx: 117, cy: 82, r: 2.5 }, 'dark')
  ],
  afín: [
    s('circle', { cx: 62, cy: 80, r: 38 }, 'sky'),
    s('circle', { cx: 98, cy: 80, r: 38 }, 'pink'),
    s('path', { d: 'M80 46.5a38 38 0 0 1 0 67a38 38 0 0 1 0-67z' }, 'purple', { accent: true }),
    s('path', { d: dots([[46, 80], [114, 80]], 6) }, 'white')
  ],
  ambición: [
    s('path', { d: 'M40 140L80 30M70 140L110 30M46 124h30M52 106h30M58 88h30M64 70h30M70 52h30', ...SW(4) }, 'brown', { stroke: true }),
    ...person(66, 112, 'red', { h: 24, w: 16, r: 8 }),
    s('path', { d: star(116, 30, 15) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(140, 58, 6) + sparkle(96, 18, 5) }, 'orange')
  ],
  anterioridad: [
    s('path', { d: 'M18 100h116', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M132 90l12 10-12 10z' }, 'gray'),
    s('circle', { cx: 50, cy: 100, r: 13 }, 'orange', { accent: true }),
    s('circle', { cx: 108, cy: 100, r: 9 }, 'gray'),
    s('path', { d: 'M106 80q-28-36-54 0M52 80l0-12M52 80l12 0', ...SW(4) }, 'navy', { stroke: true })
  ],
  antropología: [
    s('path', { d: busts([44, 80, 116], 140, 26, 30) }, 'brown'),
    s('path', { d: dots([[44, 100], [80, 100], [116, 100]], 11) }, 'skin'),
    s('path', { d: 'M86 40l26-24', ...SW(8) }, 'dark', { stroke: true }),
    s('circle', { cx: 70, cy: 56, r: 22 }, 'sky'),
    s('path', { d: ring(70, 56, 22), ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 46h20q6 6 2 20H58q-4-14 2-20z' }, 'orange', { accent: true })
  ],
  aportación: [
    s('path', { d: rects([[30, 112, 36, 24], [70, 112, 36, 24], [50, 86, 36, 24]]) }, 'tan'),
    s('rect', { x: 92, y: 86, width: 36, height: 24, ...DASH(3, '5 4') }, 'dark', { stroke: true }),
    s('rect', { x: 92, y: 40, width: 36, height: 24 }, 'orange', { accent: true }),
    s('path', { d: 'M146 52h-18', ...SW(10) }, 'skin', { stroke: true }),
    arrow('M110 68v12M104 74l6 6 6-6', 'dark', 3),
    ground()
  ],
  aurora: [
    backdrop('navy'),
    s('path', { d: 'M24 56q30-30 56-6t56-20', ...SW(10) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M24 78q30-30 56-6t56-20', ...SW(6) }, 'mint', { stroke: true }),
    s('path', { d: dots([[30, 28], [110, 22], [132, 74], [60, 34]], 2) }, 'white'),
    s('path', { d: 'M14 146V112l26-24 22 18 30-30 28 26 26-14v58z' }, 'dark')
  ],
  belén: [
    s('rect', { x: 34, y: 70, width: 92, height: 66 }, 'cream'),
    s('path', { d: 'M24 72l56-34 56 34z' }, 'brown'),
    s('path', { d: 'M34 70v66M126 70v66', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M58 120h44l-8 16H66z' }, 'tan'),
    s('path', { d: 'M60 118h40', ...SW(4) }, 'yellow', { stroke: true }),
    s('ellipse', { cx: 82, cy: 112, rx: 12, ry: 6 }, 'sky'),
    s('circle', { cx: 70, cy: 110, r: 5 }, 'skin'),
    s('path', { d: star(80, 24, 10) }, 'yellow', { accent: true })
  ],
  castigar: [
    ground(),
    ...person(46, 136, 'navy', { h: 52 }),
    s('path', { d: 'M58 92l16-14', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M74 78l4-10', ...SW(3) }, 'skin', { stroke: true }),
    ...person(112, 136, 'yellow', { h: 28, w: 20, r: 10, accent: true }),
    s('path', { d: 'M108 101q4-3 8 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  contrabando: [
    s('path', { d: 'M64 50v-12h32v12', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 24, y: 50, width: 112, height: 82, rx: 8 }, 'brown'),
    s('rect', { x: 34, y: 60, width: 92, height: 28, rx: 3 }, 'sky'),
    s('rect', { x: 34, y: 96, width: 92, height: 28, rx: 3 }, 'dark'),
    s('path', { d: rects([[40, 102, 22, 18], [68, 102, 22, 18], [96, 102, 24, 18]]) }, 'orange', { accent: true }),
    s('path', { d: 'M24 92h112', ...DASH(2, '4 3') }, 'yellow', { stroke: true })
  ],
  contribuyente: [
    ground(),
    s('path', { d: 'M92 64l27-18 27 18zM92 66h54v6H92zM96 72h6v52h-6zM116 72h6v52h-6zM136 72h6v52h-6zM90 124h58v8H90z' }, 'gray'),
    ...person(40, 136, 'green', { accent: true }),
    s('path', { d: 'M54 96q20-34 40-22', ...DASH(3) }, 'orange', { stroke: true }),
    s('path', { d: dots([[66, 80], [80, 72]], 6) }, 'yellow')
  ],
  coordinar: [
    s('path', { d: 'M66 72L40 46M94 72l26-26M80 98v14', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: busts([30, 130], 62, 22, 22) + busts([80], 146, 22, 22) }, 'blue'),
    s('path', { d: dots([[30, 32], [130, 32], [80, 116]], 8) }, 'skin'),
    s('circle', { cx: 80, cy: 82, r: 18 }, 'orange', { accent: true }),
    s('path', { d: ring(80, 82, 8), ...SW(3) }, 'white', { stroke: true })
  ],
  despliegue: [
    s('path', { d: 'M28 40l34 10v74l-34-10z' }, 'mint'),
    s('path', { d: 'M62 50l34-10v74l-34 10z' }, 'sky'),
    s('path', { d: 'M96 40l34 10v74l-34-10z' }, 'mint'),
    s('path', { d: 'M38 104q30-50 56-22t26-26', ...DASH(3) }, 'red', { stroke: true }),
    s('path', { d: 'M114 40q-10 0-10 10 0 8 10 18 10-10 10-18 0-10-10-10z' }, 'red', { accent: true }),
    s('path', { d: 'M22 80h-8M18 74l-4 6 4 6M138 80h8M142 74l4 6-4 6', ...SW(3) }, 'dark', { stroke: true })
  ],
  donar: [
    s('rect', { x: 34, y: 84, width: 92, height: 56, rx: 6 }, 'blue'),
    s('rect', { x: 60, y: 84, width: 40, height: 6, rx: 3 }, 'dark'),
    s('path', { d: heart(80, 66, 16) }, 'red', { accent: true }),
    s('path', { d: 'M52 26h50q6 0 6 6t-6 6H52q-6 0-6-6t6-6z' }, 'skin'),
    s('path', { d: heart(80, 120, 7) }, 'white')
  ],
  emisora: [
    s('path', { d: 'M110 66L128 36', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M118 28q10-10 20 0M114 20q14-12 28 0', ...SW(3) }, 'orange', { stroke: true }),
    s('rect', { x: 24, y: 66, width: 112, height: 70, rx: 10 }, 'red', { accent: true }),
    s('circle', { cx: 56, cy: 101, r: 20 }, 'dark'),
    s('path', { d: ring(56, 101, 11), ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 88, y: 80, width: 36, height: 14, rx: 3 }, 'cream'),
    s('path', { d: dots([[96, 114], [116, 114]], 6) }, 'dark')
  ],
  flecha: [
    s('path', { d: 'M34 126L120 40', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M134 26l-8 26-18-18z' }, 'gray'),
    s('path', { d: 'M42 118l-18-2 6-10 18 4zM42 118l2 18 10-6-4-18z' }, 'red', { accent: true })
  ],
  fortalecimiento: [
    s('path', { d: rects([[28, 40, 34, 22], [66, 40, 34, 22], [28, 66, 16, 22], [48, 66, 34, 22], [86, 66, 14, 22], [28, 92, 34, 22], [66, 92, 34, 22], [28, 118, 16, 20], [48, 118, 34, 20], [86, 118, 14, 20]]) }, 'tan'),
    s('path', { d: 'M24 64h80M24 90h80M24 116h80', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 40v98M104 40v98', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M128 124V36M118 46l10-10 10 10', ...SW(6) }, 'green', { stroke: true, accent: true })
  ],
  gravemente: [
    s('path', { d: 'M30 50h16l6-14 8 26 6-12h18', ...SW(4) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M124 98V26M124 30h-12', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 102, y: 30, width: 16, height: 22, rx: 4 }, 'sky'),
    s('path', { d: 'M26 114v22M134 114v22M20 100V78', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 20, y: 100, width: 120, height: 14, rx: 4 }, 'sky'),
    s('circle', { cx: 42, cy: 90, r: 11 }, 'skin'),
    s('path', { d: 'M32 85h20', ...SW(5) }, 'white', { stroke: true }),
    s('rect', { x: 54, y: 86, width: 84, height: 16, rx: 6 }, 'mint')
  ],
  hipócrita: [
    s('path', { d: 'M28 146q0-40 34-42q34 2 34 42z' }, 'gray'),
    s('circle', { cx: 62, cy: 70, r: 30 }, 'skin'),
    s('path', { d: 'M40 62l12 4M44 90q6-6 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 90l20 34', ...SW(4) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 90, cy: 66, rx: 24, ry: 28 }, 'yellow', { accent: true }),
    s('path', { d: ells([[82, 60, 4, 3], [98, 60, 4, 3]]) }, 'dark'),
    s('path', { d: 'M78 76q12 10 24 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  honorable: [
    s('path', { d: 'M56 18h16l14 52H72zM104 18H88L74 70h14z' }, 'blue'),
    s('circle', { cx: 80, cy: 98, r: 32 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 98, r: 22 }, 'orange'),
    s('path', { d: star(80, 98, 15) }, 'yellow')
  ],
  huerta: [
    s('path', { d: 'M20 92V60M50 92V60M80 92V60M110 92V60M140 92V60M14 70h132M14 84h132', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 14, y: 98, width: 132, height: 44, rx: 6 }, 'brown'),
    s('path', { d: 'M14 120h132', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: dots([[34, 100], [80, 100], [126, 100]], 12) }, 'green', { accent: true }),
    s('path', { d: 'M54 124l5 14 5-14zM98 124l5 14 5-14z' }, 'orange'),
    s('path', { d: 'M56 124l-3-8M59 124v-9M62 124l3-8M100 124l-3-8M103 124v-9M106 124l3-8', ...SW(2) }, 'green', { stroke: true })
  ],
  imposición: [
    s('path', { d: 'M40 30h80l14 46H26z' }, 'dark', { accent: true }),
    s('path', { d: 'M66 30v-10h28v10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 82v14M72 90l8 8 8-8', ...SW(4) }, 'red', { stroke: true }),
    ground(),
    ...person(80, 136, 'orange', { h: 22, w: 36, r: 10 }),
    s('path', { d: 'M56 116l-8-4M104 116l8-4', ...SW(3) }, 'gray', { stroke: true })
  ],
  impotencia: [
    s('rect', { x: 94, y: 20, width: 50, height: 116 }, 'gray'),
    s('path', { d: 'M94 44h50M94 68h50M94 92h50M94 116h50M118 20v24M106 44v24M130 68v24M110 92v24M126 116v20', ...SW(2) }, 'dark', { stroke: true }),
    ground(),
    ...person(52, 136, 'blue', { accent: true }),
    s('path', { d: 'M44 112h16', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M47 84q5-4 10 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  interino: [
    s('rect', { x: 44, y: 28, width: 12, height: 62, rx: 3 }, 'brown'),
    s('rect', { x: 44, y: 86, width: 68, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M50 96v40M106 96v40', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M70 42h28l-12 20 12 20H70l12-20z' }, 'sky'),
    s('path', { d: 'M75 48h18l-9 12zM74 82h20l-10-8z' }, 'yellow', { accent: true }),
    s('path', { d: 'M66 40h36M66 84h36', ...SW(4) }, 'dark', { stroke: true })
  ],
  inventario: [
    s('path', { d: 'M16 60h76M16 100h76M16 136h76M16 24v112M92 24v112', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: rects([[22, 38, 22, 22], [48, 42, 18, 18], [68, 38, 20, 22], [22, 78, 18, 22], [44, 78, 22, 22], [70, 82, 18, 18], [22, 114, 30, 22], [58, 118, 26, 18]]) }, 'tan'),
    s('rect', { x: 100, y: 56, width: 42, height: 60, rx: 4 }, 'brown'),
    s('rect', { x: 105, y: 64, width: 32, height: 46, rx: 2 }, 'white'),
    s('path', { d: 'M108 74l3 4 6-7M108 88l3 4 6-7M108 102l3 4 6-7', ...SW(2.5) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M121 75h12M121 89h12M121 103h12', ...SW(2) }, 'gray', { stroke: true })
  ],
  inversor: [
    s('path', { d: 'M80 106V56', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 88, -150, 28, 8) + leaflet(80, 76, -30, 28, 8) }, 'green'),
    s('path', { d: dots([[80, 44], [52, 66], [108, 58]], 11) }, 'yellow', { accent: true }),
    s('path', { d: ring(80, 44, 6) + ring(52, 66, 6) + ring(108, 58, 6), ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M50 104h60l-6 32H56z' }, 'brown')
  ],
  leu: [
    s('rect', { x: 18, y: 34, width: 104, height: 60, rx: 6, transform: 'rotate(-8 70 64)' }, 'green'),
    s('rect', { x: 22, y: 44, width: 104, height: 60, rx: 6 }, 'mint'),
    s('rect', { x: 28, y: 50, width: 92, height: 48, rx: 3, ...SW(2) }, 'green', { stroke: true }),
    s('circle', { cx: 74, cy: 74, r: 16 }, 'green'),
    s('path', { d: dots([[112, 116], [132, 126]], 15) }, 'yellow', { accent: true }),
    s('path', { d: ring(112, 116, 9) + ring(132, 126, 9), ...SW(2) }, 'orange', { stroke: true })
  ],
  liberalismo: [
    s('path', { d: 'M28 134V76a30 30 0 0 1 60 0v58M40 134V54M52 134V48M64 134V48M76 134V54', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 22, y: 132, width: 72, height: 8, rx: 3 }, 'dark'),
    s('path', { d: 'M88 96l22-14v40l-22 12z' }, 'gray'),
    s('path', { d: 'M104 54q12-14 24-6l12-4-4 10q-8 12-24 10l-10 6z' }, 'blue', { accent: true }),
    s('path', { d: 'M112 50l8-14 6 12z' }, 'sky'),
    s('path', { d: birds([[130, 24]]), ...SW(3) }, 'blue', { stroke: true })
  ],
  litoral: [
    s('path', { d: 'M14 14h132v60q-30 10-50 30t-82 20z' }, 'blue'),
    s('path', { d: 'M14 124q60 0 82-20t50-30v16q-26 10-44 30t-88 22z' }, 'yellow', { accent: true }),
    s('path', { d: 'M14 146v-4q62-2 88-22t44-30v56z' }, 'green'),
    s('path', { d: 'M30 50q8-6 16 0t16 0M80 34q8-6 16 0t16 0M60 84q8-6 16 0', ...SW(3) }, 'white', { stroke: true })
  ],
  maternidad: [
    ...lady(66, 136, 'pink', { accent: true }),
    s('ellipse', { cx: 80, cy: 104, rx: 18, ry: 11 }, 'cream'),
    s('circle', { cx: 93, cy: 98, r: 8 }, 'skin'),
    s('path', { d: 'M56 106q16 14 38 4', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: heart(112, 54, 9) }, 'red')
  ],
  non: [
    s('path', { d: ells([[50, 46, 28, 15], [50, 80, 28, 15], [50, 114, 28, 15]]) }, 'sky'),
    s('path', { d: dots([[38, 46], [62, 46], [38, 80], [62, 80], [38, 114], [62, 114]], 8) }, 'blue'),
    s('circle', { cx: 116, cy: 80, r: 12 }, 'red', { accent: true }),
    s('path', { d: ring(116, 80, 22), ...DASH(3) }, 'orange', { stroke: true })
  ],
  observador: [
    ground(),
    ...person(56, 136, 'green', { accent: true }),
    s('path', { d: 'M46 100l2-14M66 100l-2-14', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: dots([[50, 78], [62, 78]], 7) }, 'dark'),
    s('path', { d: dots([[50, 78], [62, 78]], 3) }, 'sky'),
    s('path', { d: 'M74 70l38-26', ...DASH(2) }, 'gray', { stroke: true }),
    s('path', { d: birds([[124, 38]]), ...SW(3) }, 'dark', { stroke: true })
  ],
  octavo: [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'cream'),
    s('path', { d: wedge(80, 80, 56, -90, -45) }, 'orange', { accent: true }),
    s('path', { d: rays(80, 80, 0, 56, 8, -90), ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: ring(80, 80, 56), ...SW(4) }, 'brown', { stroke: true })
  ],
  optimista: [
    s('path', { d: rays(122, 36, 18, 24, 8), ...SW(3) }, 'orange', { stroke: true }),
    s('circle', { cx: 122, cy: 36, r: 13 }, 'yellow'),
    s('path', { d: 'M51 84h50l-5 52H56z' }, 'blue', { accent: true }),
    s('path', { d: 'M46 30h60l-8 106H54z', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 74q6-6 12 0', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: sparkle(30, 60, 8) }, 'yellow')
  ],
  patriota: [
    ground(),
    s('path', { d: 'M86 136V22', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M86 24h50v36H86z' }, 'purple', { accent: true }),
    s('path', { d: star(111, 42, 9) }, 'yellow'),
    ...person(58, 136, 'blue'),
    s('path', { d: 'M70 102l14-8', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(58, 108, 7) }, 'red')
  ],
  patriotismo: [
    s('path', { d: heart(80, 100, 34) }, 'red', { accent: true }),
    s('path', { d: 'M80 80V20', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 22h40v28H80z' }, 'purple'),
    s('path', { d: star(100, 36, 7) }, 'yellow'),
    s('path', { d: sparkle(34, 40, 8) }, 'orange')
  ],
  penetración: [
    s('rect', { x: 84, y: 20, width: 18, height: 120 }, 'tan'),
    s('path', { d: 'M88 30v20M96 60v30M90 104v24', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M56 78h72', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M126 73l14 5-14 5z' }, 'gray'),
    s('rect', { x: 16, y: 64, width: 42, height: 28, rx: 6 }, 'orange', { accent: true }),
    s('path', { d: 'M30 92l-4 30h16l4-30z' }, 'dark'),
    s('path', { d: dots([[110, 66], [114, 92], [108, 98]], 3) }, 'brown')
  ],
  preventivo: [
    ground(),
    ...person(74, 136, 'green'),
    s('path', { d: 'M78 64v34q0 6-6 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M32 66a46 32 0 0 1 92 0z' }, 'red', { accent: true }),
    s('path', { d: ells([[118, 26, 16, 10], [134, 30, 12, 8]]) }, 'gray'),
    s('path', { d: 'M114 42l-3 8M126 44l-3 8M138 42l-3 8', ...SW(3) }, 'blue', { stroke: true })
  ],
  psicólogo: [
    s('path', { d: 'M14 104h84v26H14zM14 104V88q0-6 6-6h18v22z' }, 'purple'),
    s('circle', { cx: 32, cy: 76, r: 10 }, 'skin'),
    s('rect', { x: 42, y: 88, width: 52, height: 16, rx: 7 }, 'sky'),
    ...person(122, 136, 'navy', { accent: true }),
    s('rect', { x: 98, y: 96, width: 16, height: 20, rx: 2 }, 'white'),
    s('path', { d: 'M101 102h10M101 108h10', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M32 130v8M90 130v8', ...SW(4) }, 'dark', { stroke: true })
  ],
  puntuación: [
    s('path', { d: star(28, 80, 14) + star(54, 80, 14) + star(80, 80, 14) + star(106, 80, 14) }, 'yellow', { accent: true }),
    s('path', { d: star(132, 80, 14) }, 'gray'),
    s('rect', { x: 24, y: 106, width: 112, height: 12, rx: 6 }, 'gray'),
    s('rect', { x: 24, y: 106, width: 88, height: 12, rx: 6 }, 'green'),
    s('path', { d: 'M60 46l10-12 10 8 14-16', ...SW(4) }, 'orange', { stroke: true })
  ],
  receptor: [
    s('path', { d: 'M70 90v46M50 136h40', ...SW(6) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 70, cy: 76, rx: 42, ry: 16, transform: 'rotate(-45 70 76)' }, 'white'),
    s('ellipse', { cx: 70, cy: 76, rx: 42, ry: 16, transform: 'rotate(-45 70 76)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 76l26-26', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 98, cy: 48, r: 5 }, 'red', { accent: true }),
    s('path', { d: 'M116 30q8 8 2 18M126 22q14 14 4 32', ...SW(3) }, 'blue', { stroke: true })
  ],
  rendición: [
    ground(),
    ...person(56, 136, 'green'),
    s('path', { d: 'M44 98l-8-32M68 98l8-32', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M104 136V30', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M104 32q20-8 38 4v30q-18-10-38-2z' }, 'white', { accent: true }),
    s('path', { d: 'M104 32q20-8 38 4v30q-18-10-38-2z', ...SW(3) }, 'gray', { stroke: true })
  ],
  resumir: [
    ...paper(16, 30, 50, 70),
    ...paper(24, 40, 50, 70),
    s('path', { d: 'M32 54h34M32 64h34M32 74h34M32 84h34M32 94h20', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M82 76h20M94 68l8 8-8 8', ...SW(5) }, 'orange', { stroke: true }),
    s('rect', { x: 110, y: 60, width: 34, height: 34, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M117 72h20M117 82h12', ...SW(3) }, 'brown', { stroke: true })
  ],
  subasta: [
    s('path', { d: 'M88 46l34 58', ...SW(7) }, 'brown', { stroke: true }),
    s('rect', { x: 60, y: 30, width: 56, height: 24, rx: 6, transform: 'rotate(-30 88 42)' }, 'brown', { accent: true }),
    s('rect', { x: 26, y: 112, width: 64, height: 16, rx: 4 }, 'dark'),
    s('path', { d: 'M40 94l-10-8M56 90l-2-12M24 106H14', ...SW(3) }, 'orange', { stroke: true })
  ],
  sudor: [
    ...face(80, 86, 46, 'skin', 'flat', { accent: true }),
    s('path', { d: drop(122, 60, 7) + drop(38, 72, 6) + drop(118, 98, 5) }, 'blue'),
    s('path', { d: halfRays(80, 86, 54, 62, 5), ...SW(3) }, 'orange', { stroke: true })
  ],
  susto: [
    s('path', { d: rays(80, 84, 54, 64, 10, -72), ...SW(4) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 84, r: 46 }, 'yellow', { accent: true }),
    s('path', { d: ells([[62, 74, 11, 13], [98, 74, 11, 13]]) }, 'white'),
    s('path', { d: dots([[62, 74], [98, 74]], 3) }, 'dark'),
    s('ellipse', { cx: 80, cy: 106, rx: 10, ry: 13 }, 'dark')
  ],
  sutil: [
    s('path', { d: 'M40 132Q56 64 122 26q-10 52-76 100z' }, 'sky'),
    s('path', { d: 'M40 132L116 34', ...SW(2) }, 'navy', { stroke: true }),
    s('path', { d: 'M62 104l-10-6M78 84l-12-6M94 64l-10-8M68 96l12 2M86 74l12 0', ...SW(1.5) }, 'blue', { stroke: true }),
    s('path', { d: sparkle(116, 106, 10) }, 'purple', { accent: true })
  ],
  umbral: [
    s('rect', { x: 47, y: 27, width: 66, height: 106 }, 'cream'),
    s('path', { d: 'M44 136V24h72v112', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M84 112V64', ...SW(12) }, 'blue', { stroke: true }),
    s('path', { d: 'M76 126q0-8 10-8h16q10 2 10 10v2H76z' }, 'dark'),
    s('rect', { x: 34, y: 130, width: 92, height: 10, rx: 2 }, 'orange', { accent: true })
  ],
  verbal: [
    ground(),
    ...person(36, 136, 'blue'),
    ...person(124, 136, 'orange'),
    s('path', { d: bubble(46, 22, 52, 34) }, 'sky', { accent: true }),
    s('path', { d: dots([[62, 38], [72, 38], [82, 38]], 4) }, 'navy'),
    s('path', { d: 'M104 56q8-8 16-2', ...SW(3) }, 'gray', { stroke: true })
  ],
  adelanto: [
    ground(),
    s('path', { d: 'M52 20l20 12-20 12zM74 20l20 12-20 12z' }, 'green'),
    ...lean(50, 136, 14, 'gray', { h: 36, r: 10 }),
    ...lean(102, 136, 20, 'red', { accent: true }),
    s('path', { d: 'M14 80h16M18 96h14M66 76h12', ...SW(3) }, 'orange', { stroke: true })
  ],
  agresivo: [
    s('path', { d: 'M44 56l-6-30 26 16zM116 56l6-30-26 16z' }, 'dark'),
    s('circle', { cx: 80, cy: 84, r: 42 }, 'brown', { accent: true }),
    s('path', { d: 'M58 66l16 8M102 66l-16 8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[66, 78], [94, 78]], 4) }, 'dark'),
    s('path', { d: 'M52 104q28-14 56 0q-28 22-56 0z' }, 'dark'),
    s('path', { d: 'M60 102l4 8 4-8zM92 102l4 8 4-8zM70 112l4-6 4 6zM82 112l4-6 4 6z' }, 'white'),
    s('ellipse', { cx: 80, cy: 90, rx: 7, ry: 5 }, 'black')
  ],
  ano: [
    backdrop('mint'),
    s('path', { d: 'M34 80h-12V40', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 46, y: 50, width: 64, height: 60, rx: 4 }, 'white', { accent: true }),
    s('path', { d: 'M70 110h40v26l-6-4-6 4-6-4-6 4-6-4-6 4-4-2z' }, 'white'),
    s('ellipse', { cx: 46, cy: 80, rx: 12, ry: 30 }, 'cream'),
    s('ellipse', { cx: 46, cy: 80, rx: 5, ry: 12 }, 'gray')
  ],
  antemano: [
    s('rect', { x: 24, y: 30, width: 112, height: 106, rx: 8 }, 'white'),
    outline({ x: 24, y: 30, width: 112, height: 106, rx: 8 }),
    s('path', { d: 'M24 38a8 8 0 0 1 8-8h96a8 8 0 0 1 8 8v14H24z' }, 'red'),
    s('path', { d: 'M50 22v16M110 22v16', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[44, 70], [68, 70], [92, 70], [116, 70], [68, 92], [92, 92], [116, 92], [44, 114], [68, 114], [92, 114]], 4) }, 'gray'),
    s('path', { d: ring(44, 92, 10), ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: star(116, 114, 9) }, 'orange'),
    s('path', { d: 'M104 120q-30 16-50-18M54 102l-2 10M54 102l9 4', ...SW(3) }, 'navy', { stroke: true })
  ],
  aspiración: [
    ground(),
    ...person(54, 136, 'purple'),
    s('path', { d: 'M44 98l-8-28M64 98l14-30', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M84 60q8-20 16-22', ...DASH(3) }, 'orange', { stroke: true }),
    s('path', { d: star(112, 40, 20) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(140, 74, 6) + sparkle(84, 24, 5) }, 'orange')
  ],
  asqueroso: [
    ...face(80, 86, 46, 'mint', 'frown', { accent: true }),
    s('path', { d: 'M72 110h16v8a8 8 0 0 1-16 0z' }, 'pink'),
    s('path', { d: 'M46 30q-6-8 0-14M80 28q-6-8 0-14M114 30q-6-8 0-14', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: dots([[28, 44], [134, 54]], 4) }, 'dark')
  ],
  asustar: [
    s('path', { d: 'M24 124V70a26 26 0 0 1 52 0v54l-9-8-8 8-9-8-8 8-9-8z' }, 'white'),
    s('path', { d: 'M24 124V70a26 26 0 0 1 52 0v54l-9-8-8 8-9-8-8 8-9-8z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[42, 72, 4, 6], [58, 72, 4, 6], [50, 92, 7, 9]]) }, 'dark'),
    ground(),
    ...lean(118, 136, 16, 'blue', { accent: true }),
    s('path', { d: 'M110 52l-6-10M124 46v-12M138 52l6-10', ...SW(3) }, 'orange', { stroke: true })
  ],
  atlas: [
    s('rect', { x: 34, y: 24, width: 92, height: 112, rx: 6 }, 'navy', { accent: true }),
    s('rect', { x: 34, y: 24, width: 14, height: 112, rx: 4 }, 'blue'),
    s('circle', { cx: 88, cy: 78, r: 28 }, 'sky'),
    s('path', { d: 'M72 62q10-6 16 4q-4 10 4 18q-6 10-14 4q-4-12-6-26zM98 58q10 2 12 10q-8 2-12-10z' }, 'green'),
    s('path', { d: 'M60 78h56M88 50q-16 28 0 56M88 50q16 28 0 56', ...SW(2) }, 'white', { stroke: true })
  ],
  bodega: [
    s('path', { d: 'M14 146V70a66 56 0 0 1 132 0v76z' }, 'dark'),
    s('path', { d: ells([[50, 116, 26, 24], [110, 116, 26, 24], [80, 72, 26, 24]]) }, 'brown', { accent: true }),
    s('path', { d: ells([[50, 116, 17, 15], [110, 116, 17, 15], [80, 72, 17, 15]]), ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: dots([[50, 116], [110, 116], [80, 72]], 4) }, 'dark')
  ],
  bombardeo: [
    backdrop('sky'),
    s('path', { d: 'M50 22v-6M100 18v-4M76 64v-6', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: dots([[46, 50], [100, 40], [76, 90]], 13) }, 'black'),
    s('path', { d: 'M54 38l6-8M108 28l6-8M84 78l6-8', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: sparkle(62, 28, 6) + sparkle(116, 18, 6) + sparkle(92, 68, 6) }, 'orange'),
    s('path', { d: burst(80, 126, 20, 11, 10) }, 'red', { accent: true })
  ],
  calentamiento: [
    s('path', { d: 'M46 30q-6-8 0-14M66 28q-6-8 0-14M86 30q-6-8 0-14', ...SW(3) }, 'orange', { stroke: true }),
    s('circle', { cx: 62, cy: 86, r: 44 }, 'blue'),
    s('path', { d: 'M36 66q14-10 24 2q-4 14 6 22q-4 18-18 22q-14-20-12-46zM80 56q16 0 22 14q-10 6-22-14zM86 104q14-4 20 6q-8 10-20-6z' }, 'green'),
    s('rect', { x: 114, y: 26, width: 16, height: 90, rx: 8 }, 'white'),
    s('rect', { x: 114, y: 26, width: 16, height: 90, rx: 8, ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 118, y: 44, width: 8, height: 76, rx: 4 }, 'red', { accent: true }),
    s('circle', { cx: 122, cy: 122, r: 12 }, 'red')
  ],
  caravana: [
    s('circle', { cx: 128, cy: 30, r: 12 }, 'orange'),
    s('path', { d: 'M14 128q40-14 70 0t62-4v22H14z' }, 'yellow'),
    s('path', { d: CAMEL, transform: 'translate(-10 0)' }, 'brown', { accent: true }),
    s('path', { d: CAMEL, transform: 'translate(70 22) scale(0.75)' }, 'tan')
  ],
  casero: [
    s('path', { d: 'M34 76l46-38 46 38z' }, 'red'),
    s('rect', { x: 42, y: 76, width: 76, height: 60 }, 'tan'),
    s('rect', { x: 58, y: 88, width: 44, height: 26, rx: 2 }, 'sky'),
    s('path', { d: 'M72 100q-4-6 0-10M88 100q-4-6 0-10', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 114a20 10 0 0 1 40 0z' }, 'orange', { accent: true }),
    s('rect', { x: 54, y: 114, width: 52, height: 6, rx: 2 }, 'brown'),
    ground()
  ],
  colono: [
    ground(),
    s('path', { d: 'M30 96V70q0-30 20-30h40q20 0 20 30v26z' }, 'cream'),
    s('path', { d: 'M30 96V70q0-30 20-30h40q20 0 20 30v26M50 42v54M70 40v56M90 42v54', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 24, y: 94, width: 92, height: 16, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: ring(42, 118, 14) + ring(98, 118, 14) + 'M42 104v28M28 118h28M98 104v28M84 118h28', ...SW(4) }, 'dark', { stroke: true }),
    ...person(132, 136, 'green', { h: 30, w: 18, r: 9 })
  ],
  compensar: [
    ground(),
    s('path', { d: 'M80 100l-16 36h32z' }, 'gray'),
    s('path', { d: 'M18 98h124', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 22, y: 64, width: 32, height: 32, rx: 2 }, 'blue'),
    s('rect', { x: 108, y: 80, width: 18, height: 16, rx: 2 }, 'orange'),
    s('rect', { x: 108, y: 40, width: 18, height: 16, rx: 2 }, 'orange', { accent: true }),
    s('path', { d: 'M117 60v12M112 67l5 5 5-5', ...SW(3) }, 'dark', { stroke: true })
  ],
  consolidación: [
    s('path', { d: rects([[16, 40, 18, 18], [16, 70, 18, 18], [16, 100, 18, 18], [40, 55, 18, 18], [40, 85, 18, 18]]) }, 'sky'),
    s('path', { d: 'M66 79h18M76 71l8 8-8 8', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 92, y: 52, width: 54, height: 54, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: 'M92 70h54M92 88h54M110 52v54M128 52v54', ...SW(2) }, 'sky', { stroke: true })
  ],
  contradicción: [
    s('path', { d: 'M14 70h44V56l22 24-22 24V90H14z' }, 'blue'),
    s('path', { d: 'M146 70h-44V56l-22 24 22 24V90h44z' }, 'red', { accent: true }),
    s('path', { d: burst(80, 80, 20, 9, 8) }, 'yellow')
  ],
  cuñado: [
    ground(),
    s('path', { d: 'M28 50q50-40 98 0', ...DASH(3) }, 'orange', { stroke: true }),
    ...person(28, 136, 'green', { h: 40, w: 24, r: 11 }),
    ...lady(78, 136, 'pink'),
    ...person(124, 136, 'blue', { accent: true }),
    s('path', { d: heart(101, 62, 7) }, 'red')
  ],
  cédula: [
    s('rect', { x: 16, y: 36, width: 128, height: 88, rx: 10 }, 'sky'),
    s('rect', { x: 28, y: 52, width: 36, height: 46, rx: 4 }, 'white'),
    s('circle', { cx: 46, cy: 70, r: 9 }, 'skin'),
    s('path', { d: busts([46], 98, 26, 18) }, 'navy', { accent: true }),
    s('path', { d: 'M76 60h52M76 74h52M76 88h36', ...SW(4) }, 'navy', { stroke: true }),
    s('rect', { x: 110, y: 98, width: 20, height: 16, rx: 3 }, 'yellow')
  ],
  decadencia: [
    s('path', { d: 'M50 128V72l8-6 6 10 8-12 8 8v56z' }, 'tan'),
    s('path', { d: 'M58 80v46M66 82v44M74 80v46', ...SW(2) }, 'brown', { stroke: true }),
    s('rect', { x: 42, y: 126, width: 46, height: 12 }, 'gray'),
    s('rect', { x: 96, y: 118, width: 44, height: 18, rx: 2, transform: 'rotate(-8 118 127)' }, 'tan'),
    s('path', { d: 'M92 28l14 14 10-6 20 24M126 62h10V52', ...SW(4) }, 'red', { stroke: true, accent: true })
  ],
  derrotar: [
    s('rect', { x: 30, y: 100, width: 50, height: 36 }, 'gray'),
    ...person(55, 100, 'red', { h: 36, w: 24, r: 11, accent: true }),
    s('path', { d: 'M45 72l-8-18M65 72l8-18', ...SW(5) }, 'skin', { stroke: true }),
    s('rect', { x: 88, y: 122, width: 36, height: 14, rx: 6 }, 'blue'),
    s('circle', { cx: 132, cy: 127, r: 9 }, 'skin'),
    s('path', { d: sparkle(130, 108, 5) + sparkle(116, 104, 4) }, 'yellow'),
    ground()
  ],
  difícilmente: [
    s('path', { d: 'M14 140L146 60v86H14z' }, 'green'),
    s('circle', { cx: 106, cy: 62, r: 22 }, 'gray', { accent: true }),
    ...lean(52, 116, 40, 'orange'),
    s('path', { d: drop(68, 50, 4) }, 'blue')
  ],
  efectuar: [
    s('rect', { x: 34, y: 108, width: 92, height: 24, rx: 8 }, 'gray'),
    s('path', { d: 'M50 108a30 18 0 0 1 60 0z' }, 'green', { accent: true }),
    s('rect', { x: 72, y: 40, width: 14, height: 54, rx: 7 }, 'skin'),
    s('rect', { x: 64, y: 16, width: 40, height: 34, rx: 10 }, 'skin'),
    s('path', { d: 'M44 84l-8-6M116 84l8-6M40 100H30M120 100h10', ...SW(3) }, 'orange', { stroke: true })
  ],
  enormemente: [
    ground(),
    s('circle', { cx: 94, cy: 84, r: 50 }, 'orange', { accent: true }),
    s('path', { d: sparkle(80, 66, 10) }, 'yellow'),
    ...person(26, 136, 'blue', { h: 18, w: 12, r: 6 }),
    s('path', { d: 'M28 30v70M22 38l6-8 6 8M22 92l6 8 6-8', ...SW(3) }, 'dark', { stroke: true })
  ],
  escuadrón: [
    s('path', { d: jet(50, 72) + jet(110, 72) + jet(34, 112) + jet(126, 112) }, 'gray'),
    s('path', { d: jet(80, 40) }, 'navy', { accent: true }),
    s('path', { d: 'M50 92v12M110 92v12M80 60v12', ...DASH(2, '3 3') }, 'sky', { stroke: true })
  ],
  examinar: [
    s('path', { d: 'M50 30v30q0 30 30 30t30-30V30', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[50, 28], [110, 28]], 5) }, 'gray'),
    s('path', { d: 'M80 90v20q0 14 14 14h6', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 112, cy: 124, r: 13 }, 'gray', { accent: true }),
    s('circle', { cx: 112, cy: 124, r: 6 }, 'sky')
  ],
  expresamente: [
    s('circle', { cx: 100, cy: 86, r: 42 }, 'red'),
    s('circle', { cx: 100, cy: 86, r: 29 }, 'white'),
    s('circle', { cx: 100, cy: 86, r: 15 }, 'red', { accent: true }),
    s('path', { d: 'M22 32l76 52', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 36l-14-2 6-10zM28 36l-4 12 10-4z' }, 'yellow')
  ],
  extracto: [
    s('rect', { x: 68, y: 56, width: 24, height: 14 }, 'dark'),
    s('path', { d: 'M72 56V40a8 8 0 0 1 16 0v16z' }, 'dark'),
    s('path', { d: 'M54 70h52v56q0 10-10 10H64q-10 0-10-10z' }, 'brown', { accent: true }),
    s('rect', { x: 62, y: 90, width: 36, height: 28, rx: 3 }, 'cream'),
    s('path', { d: leaflet(70, 112, -40, 26, 7) }, 'green'),
    s('path', { d: drop(122, 76, 6) }, 'orange')
  ],
  frágil: [
    ...glass(80, 0, true),
    s('path', { d: 'M70 36l8 10-6 8 8 8', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M38 132l6-8 4 10zM114 130l8-6 2 10z' }, 'sky')
  ],
  furioso: [
    s('path', { d: ells([[38, 30, 12, 9], [122, 30, 12, 9]]) }, 'gray'),
    ...face(80, 88, 48, 'red', 'frown', { accent: true }),
    s('path', { d: 'M52 66l18 8M108 66l-18 8', ...SW(5) }, 'dark', { stroke: true })
  ],
  genocidio: [
    backdrop('navy'),
    s('path', { d: rects([[40, 92, 18, 46], [71, 82, 18, 56], [102, 92, 18, 46]]) }, 'cream'),
    s('path', { d: dots([[49, 76], [80, 66], [111, 76]], 14) }, 'orange'),
    s('path', { d: drop(49, 78, 5) + drop(80, 68, 5) + drop(111, 78, 5) }, 'yellow', { accent: true }),
    s('path', { d: 'M20 138h120', ...SW(4) }, 'gray', { stroke: true })
  ],
  hongo: [
    ground(),
    s('path', { d: 'M66 90h28l4 46H62z' }, 'cream'),
    s('path', { d: 'M66 90h28l4 46H62z', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M28 94q0-60 52-60t52 60z' }, 'red', { accent: true }),
    s('path', { d: dots([[56, 62], [84, 50], [106, 70], [72, 80]], 7) }, 'white'),
    s('path', { d: 'M120 136q-2-12 6-16q8 4 6 16z' }, 'tan')
  ],
  inconveniente: [
    s('path', { d: 'M14 120h132v20H14z' }, 'dark'),
    s('path', { d: 'M24 130h16M56 130h16M88 130h16', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M96 120V78M136 120V78', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 88, y: 78, width: 56, height: 18, rx: 3 }, 'white'),
    s('path', { d: 'M96 78l-8 10M110 78l-14 18M124 78l-14 18M138 78l-14 18M144 86l-6 10', ...SW(5) }, 'red', { stroke: true, accent: true }),
    ...car(18, 98, 'blue')
  ],
  increíblemente: [
    s('path', { d: burst(80, 82, 64, 50, 14) }, 'yellow'),
    s('circle', { cx: 80, cy: 82, r: 44 }, 'skin', { accent: true }),
    s('path', { d: star(64, 72, 11) + star(96, 72, 11) }, 'orange'),
    s('ellipse', { cx: 80, cy: 104, rx: 10, ry: 12 }, 'dark'),
    s('path', { d: 'M40 120l-8 10M120 120l8 10', ...SW(8) }, 'skin', { stroke: true })
  ],
  indicación: [
    s('path', { d: 'M80 140V28', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M84 34h44l12 12-12 12H84z' }, 'green', { accent: true }),
    s('path', { d: 'M76 66H32l-12 12 12 12h44z' }, 'blue'),
    s('path', { d: 'M84 98h36l10 10-10 10H84z' }, 'orange'),
    ground(140)
  ],
  inestabilidad: [
    ground(),
    s('rect', { x: 50, y: 112, width: 60, height: 24, rx: 2 }, 'blue'),
    s('rect', { x: 52, y: 88, width: 52, height: 24, rx: 2, transform: 'rotate(8 78 100)' }, 'green'),
    s('rect', { x: 58, y: 62, width: 48, height: 24, rx: 2, transform: 'rotate(-10 82 74)' }, 'yellow'),
    s('rect', { x: 64, y: 34, width: 44, height: 24, rx: 2, transform: 'rotate(16 86 46)' }, 'red', { accent: true }),
    s('path', { d: 'M36 40q-6 10 0 20M128 66q6 10 0 20', ...SW(3) }, 'orange', { stroke: true })
  ],
  intérprete: [
    ground(),
    ...person(28, 136, 'blue', { h: 36, w: 24, r: 10 }),
    ...person(80, 136, 'purple', { accent: true }),
    ...person(132, 136, 'orange', { h: 36, w: 24, r: 10 }),
    s('path', { d: 'M16 30h30v20H26l-6 6v-6h-4z' }, 'sky'),
    s('path', { d: 'M114 30h30v20h-4v6l-6-6h-20z' }, 'yellow'),
    s('path', { d: 'M52 46h16M62 40l6 6-6 6M108 60H92M98 54l-6 6 6 6', ...SW(3) }, 'dark', { stroke: true })
  ],
  inyección: [
    s('rect', { x: 50, y: 66, width: 64, height: 24, rx: 3, transform: 'rotate(-40 80 80)' }, 'sky'),
    s('rect', { x: 50, y: 72, width: 34, height: 12, transform: 'rotate(-40 80 80)' }, 'red', { accent: true }),
    s('rect', { x: 50, y: 66, width: 64, height: 24, rx: 3, transform: 'rotate(-40 80 80)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M107 57l24-20M54 104l-16 14M30 110l16 16', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: drop(136, 46, 4) }, 'blue')
  ],
  jerarquía: [
    s('path', { d: 'M80 44v14M40 58h80M40 58v14M120 58v14M40 96v10M24 106h32M24 106v8M56 106v8M120 96v10M104 106h32M104 106v8M136 106v8', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 62, y: 20, width: 36, height: 24, rx: 4 }, 'red', { accent: true }),
    s('path', { d: rects([[24, 72, 32, 24], [104, 72, 32, 24]]) }, 'blue'),
    s('path', { d: rects([[14, 114, 20, 18], [46, 114, 20, 18], [94, 114, 20, 18], [126, 114, 20, 18]]) }, 'sky')
  ],
  lotería: [
    s('circle', { cx: 60, cy: 70, r: 44 }, 'sky'),
    s('path', { d: ring(60, 70, 44), ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[44, 84], [70, 92]], 11) }, 'red'),
    s('path', { d: dots([[62, 66], [38, 58]], 11) }, 'yellow'),
    s('path', { d: dots([[82, 70]], 11) }, 'green'),
    s('rect', { x: 92, y: 96, width: 52, height: 38, rx: 4 }, 'pink', { accent: true }),
    s('path', { d: dots([[106, 108], [118, 108], [130, 108], [106, 122], [118, 122], [130, 122]], 3.5) }, 'white')
  ],
  malestar: [
    ground(),
    s('rect', { x: 64, y: 92, width: 32, height: 44, rx: 10 }, 'blue'),
    s('circle', { cx: 80, cy: 72, r: 16 }, 'mint', { accent: true }),
    s('path', { d: 'M72 80q8-5 16 0M72 68l5 2M88 68l-5 2', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 112q14 8 28 0', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: spiral(110, 52) + spiral(44, 52), ...SW(2) }, 'green', { stroke: true })
  ],
  mansión: [
    s('path', { d: 'M54 50l26-18 26 18z' }, 'red'),
    s('rect', { x: 54, y: 50, width: 52, height: 86 }, 'cream'),
    s('path', { d: rects([[16, 74, 38, 62], [106, 74, 38, 62]]) }, 'tan'),
    s('path', { d: 'M12 76l42-20v20zM148 76l-42-20v20z' }, 'red'),
    s('path', { d: 'M62 60v76M74 60v76M86 60v76M98 60v76', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: rects([[24, 86, 10, 14], [38, 86, 10, 14], [112, 86, 10, 14], [126, 86, 10, 14], [24, 110, 10, 14], [126, 110, 10, 14]]) }, 'sky'),
    s('rect', { x: 72, y: 108, width: 16, height: 28 }, 'brown', { accent: true })
  ],
  maquinar: [
    ground(),
    ...person(50, 136, 'dark'),
    s('path', { d: 'M44 74l5 2M56 74l-5 2M44 84q6 4 12-2', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: ells([[100, 50, 36, 26], [72, 84, 5, 4], [80, 74, 7, 5]]) }, 'white'),
    s('path', { d: ells([[100, 50, 36, 26]]), ...SW(3) }, 'gray', { stroke: true }),
    ...gear(92, 50, 8, 8, 'purple', { accent: true }),
    ...gear(114, 50, 6, 6, 'orange')
  ],
  micrófono: [
    s('path', { d: 'M80 98v32M56 136h48', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 66q0 32 26 32t26-32', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 62, y: 18, width: 36, height: 66, rx: 18 }, 'dark', { accent: true }),
    s('path', { d: 'M64 36h32M64 48h32M64 60h32', ...SW(2) }, 'gray', { stroke: true })
  ],
  narrar: [
    ...person(46, 136, 'green', { accent: true }),
    s('path', { d: 'M30 102l16 6 16-6v16l-16 6-16-6z' }, 'red'),
    s('path', { d: bubble(70, 20, 70, 44) }, 'sky'),
    s('path', { d: 'M84 50l12-18 10 12 8-8 12 14z' }, 'green'),
    s('circle', { cx: 120, cy: 32, r: 5 }, 'yellow'),
    s('path', { d: busts([96, 124], 136, 20, 18) }, 'orange'),
    s('path', { d: dots([[96, 108], [124, 108]], 8) }, 'skin')
  ],
  negación: [
    s('rect', { x: 26, y: 26, width: 22, height: 64, rx: 3 }, 'blue', { accent: true }),
    s('path', { d: 'M48 82h14l12 34q14 4 14-12l-4-20h28q12-2 10-14l-8-36q-2-10-12-10H48z' }, 'skin'),
    s('path', { d: 'M94 62h20M94 48h18', ...SW(2) }, 'tan', { stroke: true }),
    s('circle', { cx: 124, cy: 116, r: 16, ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M113 105l22 22', ...SW(5) }, 'red', { stroke: true })
  ],
  nomás: [
    s('ellipse', { cx: 80, cy: 112, rx: 60, ry: 18 }, 'white'),
    s('path', { d: ells([[80, 112, 60, 18]]), ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 104, r: 16 }, 'tan', { accent: true }),
    s('path', { d: dots([[74, 100], [86, 102], [80, 110]], 2.5) }, 'brown'),
    s('path', { d: sparkle(116, 64, 10) + sparkle(46, 72, 6) }, 'yellow'),
    s('path', { d: 'M80 40v30', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M66 34h28v14a14 14 0 0 1-28 0z', transform: 'rotate(180 80 41)' }, 'skin')
  ],
  pañuelo: [
    s('path', { d: 'M24 36h112v88H24z' }, 'sky'),
    s('path', { d: 'M136 124l-36 0 36-36z' }, 'blue', { accent: true }),
    s('path', { d: dots([[44, 56], [72, 56], [100, 56], [58, 80], [86, 80], [44, 104], [72, 104]], 5) }, 'white'),
    s('path', { d: 'M30 42h100v76', ...SW(2, { 'stroke-dasharray': '4 4' }) }, 'navy', { stroke: true })
  ],
  perla: [
    s('path', { d: 'M24 92q56 50 112 0z' }, 'gray'),
    s('path', { d: 'M24 88q10-58 56-58t56 58z' }, 'tan'),
    s('path', { d: 'M48 76q8-26 16 0M72 70q8-30 16 0M96 76q8-26 16 0', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M30 92q50 30 100 0', ...SW(4) }, 'pink', { stroke: true }),
    s('circle', { cx: 80, cy: 98, r: 14 }, 'cream', { accent: true }),
    s('circle', { cx: 75, cy: 93, r: 4 }, 'white')
  ],
  permanentemente: [
    s('path', { d: 'M54 72V54a26 26 0 0 1 52 0v18', ...SW(8) }, 'gray', { stroke: true }),
    s('rect', { x: 42, y: 70, width: 76, height: 58, rx: 8 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 94, r: 7 }, 'dark'),
    s('path', { d: 'M80 100v12', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 120a62 62 0 0 1 2-70M132 40a62 62 0 0 1 2 70M24 110l4 10 10-4M138 50l-6-10-10 4', ...SW(4) }, 'blue', { stroke: true })
  ],
  polaco: [
    s('path', { d: 'M20 70q10-30 40-36q30-10 56 4q20 14 18 40q-8 30-40 40q-34 10-58-8q-20-16-16-40z' }, 'mint'),
    s('path', { d: 'M52 60q20-12 46-4q6 16-4 34q-24 10-42-4q-6-14 0-26z' }, 'green'),
    s('path', { d: 'M76 40q-14 0-14 14q0 12 14 26q14-14 14-26q0-14-14-14z' }, 'red', { accent: true }),
    s('circle', { cx: 76, cy: 54, r: 5 }, 'white'),
    s('path', { d: 'M54 116h44', ...SW(4) }, 'blue', { stroke: true })
  ],
  preliminar: [
    s('path', { d: 'M20 136h120V40h-24v24H92v24H68v24H44v24z' }, 'gray'),
    s('rect', { x: 20, y: 112, width: 48, height: 24 }, 'orange', { accent: true }),
    ...person(32, 112, 'blue', { h: 26, w: 18, r: 9 }),
    s('path', { d: star(128, 26, 10) }, 'yellow'),
    arrow('M50 100l14-14M56 86h8v8', 'green', 4)
  ],
  primario: [
    s('circle', { cx: 80, cy: 54, r: 30 }, 'red', { accent: true }),
    s('circle', { cx: 52, cy: 104, r: 30 }, 'yellow'),
    s('circle', { cx: 108, cy: 104, r: 30 }, 'blue')
  ],
  radicar: [
    s('rect', { x: 14, y: 90, width: 132, height: 56 }, 'brown'),
    s('path', { d: 'M80 90l-24 30M80 90l26 34M80 90v46M66 108l-20 6M96 112l20 2', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M80 92V60', ...SW(10) }, 'brown', { stroke: true }),
    s('path', { d: dots([[80, 40], [56, 54], [104, 54]], 24) }, 'green', { accent: true }),
    s('rect', { x: 14, y: 86, width: 132, height: 8 }, 'green')
  ],
  razonamiento: [
    s('path', { d: 'M40 136v-26q-18-12-18-40a46 46 0 0 1 92-4l12 22-12 4v14q0 10-10 10H88v20z' }, 'skin'),
    ...gear(66, 64, 12, 9, 'blue', { accent: true }),
    ...gear(92, 80, 8, 7, 'orange'),
    s('path', { d: 'M104 30l8-10M120 42l12-6M118 58h12', ...SW(3) }, 'yellow', { stroke: true })
  ],
  reconstruir: [
    s('path', { d: 'M108 136V22M108 26H40M60 26v36', ...SW(5) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M112 26h22v10h-22z' }, 'dark'),
    s('path', { d: rects([[20, 112, 30, 22], [54, 112, 30, 22], [36, 88, 30, 22]]) }, 'red'),
    s('rect', { x: 46, y: 62, width: 28, height: 18 }, 'orange'),
    s('path', { d: 'M20 112h64M50 112v22', ...SW(2) }, 'white', { stroke: true }),
    ground()
  ],
  renovable: [
    s('path', { d: 'M52 136l4-70h4l4 70z' }, 'gray'),
    s('path', { d: 'M58 66l-4-44 8 0zM58 66l36 24-4 6zM58 66l-38 22-4-6z' }, 'white'),
    s('path', { d: 'M58 66l-4-44 8 0zM58 66l36 24-4 6zM58 66l-38 22-4-6z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M92 112l12-28h40l-12 28z' }, 'blue', { accent: true }),
    s('path', { d: 'M104 98h34M118 84l-6 28', ...SW(2) }, 'sky', { stroke: true }),
    s('path', { d: 'M112 112v24', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 36a20 20 0 1 1 6 20M108 48l2-12 10 4', ...SW(4) }, 'green', { stroke: true })
  ],
  requerimiento: [
    ...paper(34, 22, 76, 112),
    s('path', { d: 'M46 44h40M46 66h40M46 88h40M46 110h28', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 40v10M91 42l10 6M101 42l-10 6M96 62v10M91 64l10 6M101 64l-10 6', ...SW(3) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M138 74l-26 20', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M112 94l-10 8', ...SW(5) }, 'skin', { stroke: true })
  ],
  resurrección: [
    s('path', { d: 'M40 136q-6-20 10-30q0 12 8 14q-2-20 16-30q-4 20 8 28q4-12 14-14q-4 14 6 18q10-6 12-16q14 14 2 30z' }, 'orange'),
    s('path', { d: 'M80 98q-6-30 0-50q6 20 0 50z' }, 'red'),
    s('path', { d: 'M80 60q-30-10-50-36q30 6 50 22q20-16 50-22q-20 26-50 36z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 44, r: 8 }, 'yellow'),
    s('path', { d: halfRays(80, 50, 46, 56, 5), ...SW(3) }, 'yellow', { stroke: true })
  ],
  rigor: [
    s('rect', { x: 18, y: 104, width: 124, height: 22, rx: 3 }, 'yellow'),
    s('path', { d: 'M28 104v10M40 104v6M52 104v10M64 104v6M76 104v10M88 104v6M100 104v10M112 104v6M124 104v10', ...SW(2) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 56, r: 32 }, 'white'),
    s('path', { d: ring(80, 56, 32), ...SW(5) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: 'M80 56V34M80 56l14 8M74 18h12', ...SW(4) }, 'red', { stroke: true })
  ],
  severo: [
    backdrop('gray'),
    s('path', { d: ells([[56, 46, 26, 18], [90, 38, 30, 22], [118, 50, 22, 16]]) }, 'dark'),
    s('path', { d: 'M86 62l-14 26h14l-10 24 24-32H86l10-18z' }, 'yellow', { accent: true }),
    s('path', { d: 'M40 78l-8 16M54 80l-8 16M110 76l-8 16M124 78l-8 16M34 110l-8 16M118 112l-8 16', ...SW(3) }, 'blue', { stroke: true })
  ],
  siembra: [
    s('path', { d: ells([[80, 128, 64, 10], [80, 106, 54, 8]]) }, 'brown'),
    s('path', { d: 'M108 34q-14 0-20 10l-10 14 6 4 10-10', ...SW(12) }, 'skin', { stroke: true }),
    s('rect', { x: 110, y: 24, width: 30, height: 20, rx: 4 }, 'blue'),
    s('path', { d: dots([[72, 72], [64, 84], [78, 88], [58, 98], [86, 100]], 3) }, 'tan', { accent: true }),
    s('path', { d: 'M40 124v-8M120 126v-8', ...SW(3) }, 'green', { stroke: true })
  ],
  timbre: [
    s('rect', { x: 20, y: 22, width: 60, height: 116, rx: 3 }, 'brown'),
    s('circle', { cx: 70, cy: 82, r: 4 }, 'yellow'),
    s('rect', { x: 92, y: 60, width: 28, height: 44, rx: 6 }, 'gray'),
    s('circle', { cx: 106, cy: 82, r: 9 }, 'red', { accent: true }),
    s('path', { d: 'M128 66q8 16 0 32M136 58q14 24 0 48', ...SW(3) }, 'orange', { stroke: true })
  ],
  trágico: [
    s('path', { d: 'M34 34h92v40q0 52-46 60q-46-8-46-60z' }, 'navy', { accent: true }),
    s('path', { d: 'M48 66q10-8 20 2M92 68q10-10 20-2', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: ells([[58, 74, 7, 5], [102, 74, 7, 5]]) }, 'white'),
    s('path', { d: 'M60 112q20-20 40 0', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: drop(54, 94, 4) }, 'sky')
  ],
  ético: [
    s('path', { d: 'M80 36v96M56 136h48M28 46h104', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 46l-12 40M28 46l12 40M132 46l-12 30M132 46l12 30', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 86h28a14 10 0 0 1-28 0zM118 76h28a14 10 0 0 1-28 0z' }, 'gray'),
    s('path', { d: heart(28, 78, 10) }, 'red', { accent: true }),
    s('path', { d: dots([[132, 70]], 6) }, 'yellow')
  ],
  acostar: [
    backdrop('navy'),
    s('rect', { x: 24, y: 96, width: 112, height: 18, rx: 4 }, 'brown'),
    s('path', { d: 'M28 114v20M132 114v20M24 100V74', ...SW(5) }, 'brown', { stroke: true }),
    s('circle', { cx: 46, cy: 86, r: 11 }, 'skin'),
    s('rect', { x: 56, y: 82, width: 78, height: 18, rx: 7 }, 'sky', { accent: true }),
    s('path', { d: 'M124 26a18 18 0 1 0 8 30a14 14 0 1 1-8-30z' }, 'yellow'),
    s('path', { d: dots([[40, 34], [74, 46], [96, 24]], 2) }, 'white')
  ],
  activar: [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'dark'),
    s('circle', { cx: 80, cy: 80, r: 44 }, 'green', { accent: true }),
    s('path', { d: 'M62 58a28 28 0 1 0 36 0M80 44v34', ...SW(8) }, 'white', { stroke: true }),
    s('path', { d: rays(80, 80, 58, 64, 12), ...SW(3) }, 'yellow', { stroke: true })
  ],
  aerolínea: [
    s('rect', { x: 18, y: 60, width: 124, height: 64, rx: 8 }, 'white'),
    outline({ x: 18, y: 60, width: 124, height: 64, rx: 8 }),
    s('path', { d: 'M18 68a8 8 0 0 1 8-8h108a8 8 0 0 1 8 8v12H18z' }, 'blue', { accent: true }),
    s('path', { d: 'M100 60v64', ...DASH(2, '4 4') }, 'gray', { stroke: true }),
    s('path', { d: 'M30 96h56M30 110h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 102l14-4 8-12h4l-4 12 8-2 3-4h3l-2 6 2 6h-3l-3-4-8-2 4 12h-4l-8-12z' }, 'navy'),
    s('path', { d: 'M38 44l30-10 10-14h6l-4 16 16-2 6-6h4l-2 10z' }, 'blue')
  ],
  afán: [
    ground(),
    ...lean(54, 136, 30, 'red', { accent: true }),
    s('path', { d: 'M14 84h18M18 100h16', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: drop(66, 60, 4) }, 'blue'),
    s('path', { d: 'M128 136V40', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M128 42h-26l8 12-8 12h26z' }, 'yellow')
  ],
  antepasado: [
    s('ellipse', { cx: 80, cy: 78, rx: 46, ry: 58 }, 'brown', { accent: true }),
    s('ellipse', { cx: 80, cy: 78, rx: 36, ry: 48 }, 'cream'),
    s('path', { d: busts([80], 124, 46, 36) }, 'dark'),
    s('circle', { cx: 80, cy: 72, r: 15 }, 'skin'),
    s('path', { d: 'M66 66q14-16 28 0M70 84q10 10 20 0', ...SW(4) }, 'white', { stroke: true })
  ],
  bacteria: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'mint'),
    s('path', { d: ring(80, 80, 60), ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 44, y: 54, width: 50, height: 22, rx: 11, transform: 'rotate(-20 69 65)' }, 'purple', { accent: true }),
    s('rect', { x: 74, y: 92, width: 44, height: 20, rx: 10, transform: 'rotate(25 96 102)' }, 'green'),
    s('path', { d: 'M46 74q-8 8-16 2M118 112q6 10 2 18M94 50q8-8 16-4', ...SW(2) }, 'purple', { stroke: true }),
    s('path', { d: dots([[60, 64], [76, 58], [92, 98], [104, 106]], 3) }, 'white')
  ],
  bicho: [
    s('path', { d: 'M56 70l-20-10M54 90H30M58 108l-20 12M104 70l20-10M106 90h24M102 108l20 12M70 46l-8-16M90 46l8-16', ...SW(4) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 80, cy: 92, rx: 28, ry: 36 }, 'red', { accent: true }),
    s('path', { d: 'M80 58v70', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 52, r: 14 }, 'dark'),
    s('path', { d: dots([[68, 82], [92, 82], [70, 106], [90, 106]], 5) }, 'dark')
  ],
  billón: [
    ground(),
    s('path', { d: rects([[20, 112, 36, 24], [62, 112, 36, 24], [104, 112, 36, 24], [40, 84, 36, 24], [84, 84, 36, 24], [62, 56, 36, 24]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M24 120h28M66 120h28M108 120h28M44 92h28M88 92h28M66 64h28', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: sparkle(122, 50, 10) + sparkle(34, 64, 8) + sparkle(80, 30, 8) }, 'orange')
  ],
  cheque: [
    s('rect', { x: 14, y: 46, width: 132, height: 70, rx: 4 }, 'mint'),
    s('rect', { x: 14, y: 46, width: 132, height: 70, rx: 4, ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M26 64h70M26 80h100M26 100h40', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 104, y: 56, width: 32, height: 14, rx: 2 }, 'white'),
    s('path', { d: 'M84 102q6-10 10 0t10 0t10-4t10 2', ...SW(3) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M130 30l-12 30', ...SW(6) }, 'dark', { stroke: true })
  ],
  clavo: [
    s('rect', { x: 14, y: 116, width: 132, height: 24 }, 'tan'),
    s('path', { d: 'M80 70v50', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 66, y: 64, width: 28, height: 8, rx: 3 }, 'gray', { accent: true }),
    s('path', { d: 'M110 20L82 58', ...SW(7) }, 'brown', { stroke: true }),
    s('rect', { x: 60, y: 38, width: 40, height: 18, rx: 3, transform: 'rotate(36 80 47)' }, 'dark'),
    s('path', { d: 'M54 62l-10-4M106 62l10-4', ...SW(3) }, 'orange', { stroke: true })
  ],
  colocación: [
    s('path', { d: 'M18 110h124', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 24, y: 80, width: 22, height: 28, rx: 2 }, 'blue'),
    s('rect', { x: 52, y: 86, width: 18, height: 22, rx: 2 }, 'green'),
    s('rect', { x: 84, y: 76, width: 26, height: 32, rx: 2, ...DASH(2, '4 3') }, 'dark', { stroke: true }),
    s('path', { d: 'M88 22h18v12q8 6 6 18H82q-2-12 6-18z' }, 'red', { accent: true }),
    s('path', { d: 'M97 58v12M91 64l6 6 6-6', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M130 26h-16', ...SW(10) }, 'skin', { stroke: true })
  ],
  colonización: [
    s('path', { d: 'M14 110q8-6 16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0V146H14z' }, 'blue'),
    s('path', { d: 'M86 108q20-30 60-30v30z' }, 'green'),
    s('path', { d: 'M120 84V52', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M120 54h20l-6 6 6 6h-20z' }, 'orange'),
    s('path', { d: 'M20 100h56l-8 14H28z' }, 'brown', { accent: true }),
    s('path', { d: 'M46 98V40M48 44l22 30H48zM44 50L26 78h18z' }, 'cream'),
    s('path', { d: 'M46 98V40', ...SW(3) }, 'dark', { stroke: true })
  ],
  complicidad: [
    ...face(52, 80, 30, 'skin', 'smile', { accent: true }),
    ...face(110, 80, 30, 'tan', 'smile'),
    s('path', { d: 'M114 64q6-6 12 0', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M122 64q-5 4-10 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 96V72', ...SW(5) }, 'pink', { stroke: true }),
    s('path', { d: sparkle(80, 34, 8) }, 'yellow')
  ],
  compositor: [
    s('rect', { x: 50, y: 92, width: 96, height: 20, rx: 3 }, 'black'),
    s('path', { d: rects([[56, 96, 8, 12], [68, 96, 8, 12], [80, 96, 8, 12], [92, 96, 8, 12], [104, 96, 8, 12], [116, 96, 8, 12], [128, 96, 8, 12]]) }, 'white'),
    s('path', { d: 'M58 112v24M138 112v24', ...SW(5) }, 'black', { stroke: true }),
    ...person(32, 136, 'purple', { accent: true }),
    s('path', { d: 'M44 104l12-6', ...SW(5) }, 'skin', { stroke: true }),
    ...note(86, 52, 'blue'),
    ...note(118, 40, 'red')
  ],
  condesa: [
    ...lady(80, 140, 'purple', { accent: true }),
    s('path', { d: 'M66 66l4-14 5 8 5-10 5 10 5-8 4 14z' }, 'yellow'),
    s('path', { d: dots([[80, 56]], 3) }, 'red'),
    s('path', { d: 'M70 92q10 8 20 0', ...SW(3) }, 'white', { stroke: true })
  ],
  cuerno: [
    s('path', { d: 'M34 120q-6-60 50-84q36-16 50-4q-40 0-58 24q-18 26-14 64z' }, 'cream'),
    s('path', { d: 'M34 120q-6-60 50-84q36-16 50-4q-40 0-58 24q-18 26-14 64z', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M38 108h26M42 88h28M52 68h28', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M28 112h40v24H28z' }, 'brown', { accent: true })
  ],
  cálido: [
    s('path', { d: 'M60 42q-6-8 0-16t0-14M80 42q-6-8 0-16M100 42q-6-8 0-16t0-14', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 72h8a16 16 0 0 1 0 32h-10', ...SW(7) }, 'orange', { stroke: true }),
    s('path', { d: 'M36 54h80v54q0 22-22 22H58q-22 0-22-22z' }, 'orange', { accent: true }),
    s('path', { d: heart(76, 96, 14) }, 'red'),
    s('rect', { x: 26, y: 132, width: 100, height: 8, rx: 4 }, 'brown')
  ],
  decisivo: [
    s('path', { d: 'M80 140V92L36 40M80 92l44-52', ...SW(16) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 92l44-52', ...SW(16) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M108 56l18-18-4 24z' }, 'dark'),
    s('path', { d: 'M126 38l-2-8M118 34l-6-4', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M60 120l40 0', ...SW(4, { 'stroke-dasharray': '6 6' }) }, 'white', { stroke: true })
  ],
  desconocer: [
    ground(),
    ...person(46, 136, 'blue', { accent: true }),
    s('path', { d: 'M30 96l-10-10M62 96l10-10', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 116, cy: 76, r: 12 }, 'gray'),
    s('rect', { x: 101, y: 92, width: 30, height: 44, rx: 10 }, 'gray'),
    s('path', { d: 'M100 40q10-6 20 0t20 0', ...SW(3, { 'stroke-dasharray': '3 4' }) }, 'dark', { stroke: true })
  ],
  encabezado: [
    ...paper(30, 18, 100, 124),
    s('rect', { x: 38, y: 28, width: 84, height: 22, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M48 39h64', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M42 66h76M42 80h76M42 94h76M42 108h76M42 122h50', ...SW(3) }, 'gray', { stroke: true })
  ],
  epidemia: [
    s('path', { d: busts([30, 80, 130], 140, 24, 26) }, 'gray'),
    s('path', { d: dots([[30, 104], [80, 104], [130, 104]], 10) }, 'skin'),
    s('path', { d: dots([[52, 58], [104, 46], [80, 30], [128, 72], [28, 74]], 8) }, 'green', { accent: true }),
    s('path', { d: rays(52, 58, 8, 12, 8) + rays(104, 46, 8, 12, 8) + rays(80, 30, 8, 12, 8) + rays(128, 72, 8, 12, 8) + rays(28, 74, 8, 12, 8), ...SW(2) }, 'green', { stroke: true }),
    s('rect', { x: 72, y: 104, width: 16, height: 8, rx: 2 }, 'sky')
  ],
  equivocar: [
    s('rect', { x: 26, y: 80, width: 108, height: 56, rx: 4 }, 'tan'),
    s('rect', { x: 54, y: 92, width: 32, height: 32 }, 'brown'),
    s('path', { d: 'M100 24l24 40H76z' }, 'red', { accent: true }),
    s('path', { d: 'M96 70l-12 14', ...DASH(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 24l20 20M50 24L30 44', ...SW(5) }, 'red', { stroke: true })
  ],
  especulación: [
    s('path', { d: 'M18 120l20-30 18 14 22-40 18 22 22-30 20 10', ...SW(5) }, 'green', { stroke: true }),
    s('circle', { cx: 80, cy: 62, r: 30 }, 'sky', { accent: true }),
    s('path', { d: 'M66 50a14 14 0 0 1 16-8', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M56 88h48l6 14H50z' }, 'purple'),
    s('path', { d: sparkle(124, 30, 8) + sparkle(36, 38, 6) }, 'yellow')
  ],
  fallar: [
    s('circle', { cx: 60, cy: 86, r: 40 }, 'red'),
    s('circle', { cx: 60, cy: 86, r: 27 }, 'white'),
    s('circle', { cx: 60, cy: 86, r: 13 }, 'red'),
    s('path', { d: 'M142 30l-36 14', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M106 44l-6-6M106 44l-4 8', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 40q-10 0-14-8', ...DASH(2) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: burst(104, 44, 10, 5, 7) }, 'orange')
  ],
  farsa: [
    s('path', { d: 'M40 24h80M58 24v40M80 24v28M102 24v40', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 34, y: 18, width: 92, height: 10, rx: 3 }, 'brown'),
    s('circle', { cx: 80, cy: 64, r: 14 }, 'skin'),
    s('circle', { cx: 80, cy: 66, r: 5 }, 'red'),
    s('path', { d: 'M66 54l14-14 14 14z' }, 'yellow'),
    s('path', { d: 'M64 80h32l8 38H56z' }, 'purple', { accent: true }),
    s('path', { d: 'M64 84L52 64M96 84l12-20M70 118v16M90 118v16', ...SW(5) }, 'purple', { stroke: true })
  ],
  fascismo: [
    backdrop('dark'),
    s('path', { d: busts([30, 58, 86, 114], 146, 22, 34) }, 'gray'),
    s('path', { d: dots([[30, 104], [58, 104], [86, 104], [114, 104]], 9) }, 'gray'),
    s('path', { d: 'M90 40l36-16v44L90 52z' }, 'red', { accent: true }),
    s('rect', { x: 76, y: 38, width: 16, height: 16, rx: 3 }, 'black'),
    s('path', { d: 'M132 34l8-4M132 46h10M132 58l8 4', ...SW(3) }, 'red', { stroke: true })
  ],
  felicitar: [
    ground(),
    ...person(54, 136, 'blue'),
    ...person(110, 136, 'orange', { accent: true }),
    s('path', { d: 'M66 104h32', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: rects([[40, 30, 6, 10], [70, 22, 6, 10], [100, 34, 6, 10], [124, 26, 6, 10]]) }, 'red'),
    s('path', { d: dots([[56, 40], [86, 36], [116, 46], [30, 50]], 4) }, 'yellow'),
    s('path', { d: 'M84 50l4 8M64 54l-2 8', ...SW(3) }, 'green', { stroke: true })
  ],
  fingir: [
    ground(),
    ...person(70, 136, 'green', { accent: true }),
    s('path', { d: 'M62 84q8 6 16 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M84 104l12 4', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M96 110l6-14M100 110l10-10', ...SW(4) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(118, 82, 6) }, 'orange'),
    s('path', { d: dots([[64, 76], [76, 76]], 2) }, 'dark')
  ],
  forzar: [
    s('rect', { x: 26, y: 70, width: 92, height: 66, rx: 4 }, 'brown'),
    s('path', { d: 'M22 62h100v14H22z' }, 'brown'),
    s('path', { d: 'M26 70h92', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 62, y: 80, width: 20, height: 18, rx: 3 }, 'yellow'),
    s('path', { d: 'M60 70l60-46q10-4 12 6', ...SW(7) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M48 66l-8-8M40 74H28', ...SW(3) }, 'orange', { stroke: true })
  ],
  gramática: [
    s('path', { d: 'M80 34l-40 30M80 34l40 30M40 64l-18 28M40 64l18 28M120 64v28', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 62, y: 20, width: 36, height: 20, rx: 4 }, 'purple', { accent: true }),
    s('path', { d: rects([[24, 56, 32, 18], [104, 56, 32, 18]]) }, 'blue'),
    s('path', { d: rects([[14, 92, 24, 16], [46, 92, 24, 16]]) }, 'orange'),
    s('rect', { x: 108, y: 92, width: 24, height: 16, rx: 2 }, 'green'),
    s('path', { d: 'M14 128h132', ...SW(4) }, 'dark', { stroke: true })
  ],
  hallazgo: [
    s('path', { d: 'M14 112q66-12 132 0v34H14z' }, 'brown'),
    s('path', { d: halfRays(78, 86, 34, 46, 7), ...SW(3) }, 'yellow', { stroke: true }),
    s('rect', { x: 50, y: 84, width: 56, height: 36, rx: 3 }, 'orange', { accent: true }),
    s('path', { d: 'M50 84q28-30 56 0z' }, 'brown'),
    s('rect', { x: 72, y: 90, width: 12, height: 12, rx: 2 }, 'yellow'),
    s('path', { d: 'M122 50l-6 66', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M108 114h16l-8 18z' }, 'gray')
  ],
  homosexualidad: [
    ground(),
    ...person(56, 136, 'blue', { accent: true }),
    ...person(104, 136, 'green'),
    s('path', { d: 'M70 106h20', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 50, 13) }, 'red')
  ],
  interrupción: [
    s('path', { d: 'M14 80h46M100 80h46', ...SW(10) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 80l6-6M60 80l6 6M100 80l-6-6M100 80l-6 6', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: burst(80, 80, 16, 7, 8) }, 'yellow', { accent: true }),
    s('rect', { x: 64, y: 108, width: 12, height: 32, rx: 2 }, 'red'),
    s('rect', { x: 84, y: 108, width: 12, height: 32, rx: 2 }, 'red')
  ],
  lesbiana: [
    ground(),
    ...lady(56, 136, 'purple', { accent: true }),
    ...lady(104, 136, 'orange'),
    s('path', { d: 'M66 104h28', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 46, 12) }, 'red')
  ],
  mandatario: [
    s('rect', { x: 54, y: 98, width: 52, height: 42, rx: 2 }, 'brown'),
    ...person(80, 98, 'navy', { h: 40, w: 30, r: 13 }),
    s('path', { d: 'M68 60l26 36', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M72 98v-10M88 98v-10', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 118, r: 8 }, 'yellow'),
    s('path', { d: dots([[38, 40], [122, 40]], 5) }, 'yellow')
  ],
  modernización: [
    s('path', { d: 'M18 136V90l22-16 22 16v46z' }, 'tan'),
    s('rect', { x: 32, y: 108, width: 14, height: 28 }, 'brown'),
    arrow('M66 100h16M76 92l8 8-8 8', 'orange', 4),
    s('rect', { x: 94, y: 22, width: 48, height: 114, rx: 3 }, 'sky', { accent: true }),
    s('path', { d: 'M94 44h48M94 66h48M94 88h48M94 110h48M118 22v114', ...SW(2) }, 'blue', { stroke: true }),
    ground()
  ],
  monje: [
    s('path', { d: 'M48 140l10-62q22-14 44 0l10 62z' }, 'brown', { accent: true }),
    s('path', { d: 'M58 70a22 22 0 0 1 44 0v10H58z' }, 'brown'),
    s('circle', { cx: 80, cy: 70, r: 14 }, 'skin'),
    s('path', { d: 'M74 70q3 3 6 0M84 70q3 3 6 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 106h40M90 106l4 22', ...SW(3) }, 'cream', { stroke: true }),
    s('path', { d: 'M72 96l8-6 8 6v8H72z' }, 'skin')
  ],
  poético: [
    s('path', { d: 'M110 22a24 24 0 1 0 14 40a18 18 0 1 1-14-40z' }, 'yellow'),
    s('path', { d: star(40, 34, 7) + star(64, 22, 5) }, 'yellow'),
    ...paper(24, 74, 76, 64),
    s('path', { d: 'M34 92q10-6 20 0t20 0M34 108q10-6 20 0t20 0M34 124q10-6 20 0', ...SW(2) }, 'navy', { stroke: true }),
    s('path', { d: 'M86 128q10-60 48-74q-4 40-48 74z' }, 'purple', { accent: true })
  ],
  precaución: [
    s('rect', { x: 34, y: 128, width: 92, height: 12, rx: 3 }, 'dark'),
    s('path', { d: 'M70 24h20l26 104H44z' }, 'orange', { accent: true }),
    s('path', { d: 'M62 58h36l6 24H56zM52 98h56l4 16H48z' }, 'white')
  ],
  programar: [
    s('rect', { x: 26, y: 30, width: 108, height: 72, rx: 6 }, 'dark'),
    s('rect', { x: 32, y: 36, width: 96, height: 60, rx: 2 }, 'navy'),
    s('path', { d: 'M40 48h30M48 60h40M48 72h24M40 84h20', ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M74 48h20M92 72h24', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M16 106h128l-8 14H24z' }, 'gray')
  ],
  radar: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'dark'),
    s('path', { d: ring(80, 80, 40) + ring(80, 80, 20) + 'M20 80h120M80 20v120', ...SW(2) }, 'green', { stroke: true }),
    s('path', { d: wedge(80, 80, 60, -60, -20) }, 'green', { accent: true }),
    s('circle', { cx: 112, cy: 54, r: 5 }, 'yellow'),
    s('circle', { cx: 58, cy: 104, r: 4 }, 'red')
  ],
  recuento: [
    s('rect', { x: 34, y: 70, width: 92, height: 66, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 60, y: 70, width: 40, height: 6 }, 'dark'),
    s('path', { d: 'M66 20h28v40H66z' }, 'white'),
    s('path', { d: 'M66 20h28v40H66zM72 32h16M72 42h10', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 96v24M58 96v24M68 96v24M78 96v24M44 116l38-16', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M96 96v24M106 96v24', ...SW(4) }, 'white', { stroke: true })
  ],
  rehén: [
    s('path', { d: 'M48 70v66M48 100h64v36M112 100V96', ...SW(6) }, 'brown', { stroke: true }),
    ...person(80, 104, 'gray', { h: 36, w: 28 }),
    s('path', { d: 'M64 80h32M64 92h32', ...SW(4) }, 'tan', { stroke: true, accent: true }),
    s('path', { d: 'M76 61h8', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M70 104v32M90 104v32', ...SW(7) }, 'gray', { stroke: true })
  ],
  repetición: [
    s('path', { d: 'M40 70a40 30 0 0 1 76-8M120 90a40 30 0 0 1-76 8', ...SW(7) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M104 54l14 8 2-16zM56 106l-14-8-2 16z' }, 'blue'),
    s('path', { d: star(56, 80, 8) + star(80, 80, 8) + star(104, 80, 8) }, 'orange')
  ],
  silvestre: [
    s('path', { d: 'M14 120q30-12 66-4t66-4v34H14z' }, 'green'),
    s('path', { d: 'M40 102v30M100 90v40', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots([[31, 92], [49, 92], [40, 83], [40, 101]], 8) }, 'pink'),
    s('path', { d: dots([[91, 80], [109, 80], [100, 71], [100, 89]], 8) }, 'purple'),
    s('path', { d: dots([[40, 92], [100, 80]], 6) }, 'yellow', { accent: true }),
    s('path', { d: 'M128 40l-8-8a6 6 0 0 0-6 10zM128 40l8-8a6 6 0 0 1 6 10z' }, 'orange'),
    s('path', { d: 'M62 132l-4-14M70 132v-16M132 132l4-14', ...SW(3) }, 'mint', { stroke: true })
  ],
};
