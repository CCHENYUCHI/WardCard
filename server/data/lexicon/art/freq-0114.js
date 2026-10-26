// Illustration specs for words still undrawn in batches 0113–0114 (see server/scripts/lexicon/art.js)
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
  luir: [
    s('ellipse', { cx: 72, cy: 108, rx: 56, ry: 22 }, 'gray'),
    s('ellipse', { cx: 72, cy: 104, rx: 42, ry: 14 }, 'cream'),
    s('path', { d: 'M84 84l30-26 24 18-30 24z' }, 'blue', { accent: true }),
    s('circle', { cx: 122, cy: 70, r: 12 }, 'skin'),
    s('path', { d: sparkle(36, 56, 14) + sparkle(64, 34, 9) + sparkle(110, 124, 8) }, 'yellow'),
    s('path', { d: 'M40 102q14 8 34 6', ...SW(4) }, 'white', { stroke: true })
  ],
  manojo: [
    s('path', { d: 'M80 104L46 34M80 104L62 26M80 104V22M80 104L98 26M80 104L114 34', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: ells([[46, 30, 8, 12], [62, 22, 8, 12], [80, 18, 8, 12], [98, 22, 8, 12], [114, 30, 8, 12]]) }, 'green'),
    s('rect', { x: 62, y: 96, width: 36, height: 34, rx: 12 }, 'skin'),
    s('rect', { x: 68, y: 84, width: 24, height: 10, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M64 106h32M64 116h32', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M76 130l-4 10M84 130l4 10', ...SW(5) }, 'green', { stroke: true })
  ],
  manufacturero: [
    s('rect', { x: 112, y: 30, width: 16, height: 50 }, 'brown'),
    s('path', { d: ells([[124, 22, 10, 7], [136, 14, 8, 5]]) }, 'gray'),
    s('path', { d: 'M18 136V72l30-18v18l30-18v18l30-18v18h34v64z' }, 'gray'),
    s('path', { d: grid(26, 90, 4, 1, 14, 12, 22, 0) }, 'sky'),
    ...gear(118, 112, 12, 8, 'orange', { accent: true }),
    s('rect', { x: 32, y: 112, width: 22, height: 24 }, 'dark')
  ],
  mapeo: [
    s('path', { d: 'M18 38l40-12 44 12 40-12v96l-40 12-44-12-40 12z' }, 'cream'),
    s('path', { d: 'M58 26v96M102 38v96', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 62q20-16 40-4t38 8 36-8l2 30q-20 10-38 6t-38-6-38 6z' }, 'mint'),
    s('path', { d: 'M30 112q30-30 60-10t40-40', ...DASH(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M118 40a14 14 0 0 1 14 14q0 12-14 26q-14-14-14-26a14 14 0 0 1 14-14z' }, 'red', { accent: true }),
    s('circle', { cx: 118, cy: 54, r: 5 }, 'white'),
    s('path', { d: 'M18 38l40-12 44 12 40-12v96l-40 12-44-12-40 12z', ...SW(3) }, 'tan', { stroke: true })
  ],
  mariguana: [
    s('path', { d: 'M80 104v34', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(80, 104, -90, 84, 9) }, 'green', { accent: true }),
    s('path', { d: leaflet(80, 104, -60, 74, 8) + leaflet(80, 104, -120, 74, 8) }, 'green'),
    s('path', { d: leaflet(80, 104, -30, 60, 7) + leaflet(80, 104, -150, 60, 7) }, 'green'),
    s('path', { d: leaflet(80, 104, 0, 40, 5) + leaflet(80, 104, 180, 40, 5) }, 'green'),
    s('path', { d: 'M80 100V36M80 104l38-60M80 104L42 44', ...SW(1.5) }, 'mint', { stroke: true })
  ],
  maxilar: [
    backdrop('sky'),
    s('path', { d: 'M34 30v42q0 56 46 56t46-56V30', ...SW(22) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 30v42q0 56 46 56t46-56V30', ...SW(15) }, 'cream', { stroke: true }),
    s('path', { d: dots([[34, 40], [34, 56], ...qpts([34, 72], [34, 128], [80, 128], 3), [80, 128], ...qpts([126, 72], [126, 128], [80, 128], 3), [126, 56], [126, 40]], 6) }, 'white'),
    s('path', { d: dots([[34, 40], [34, 56], ...qpts([34, 72], [34, 128], [80, 128], 3), [80, 128], ...qpts([126, 72], [126, 128], [80, 128], 3), [126, 56], [126, 40]], 6), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 34l-6-12h12zM126 34l-6-12h12z' }, 'cream', { accent: true })
  ],
  'mechón': [
    s('circle', { cx: 80, cy: 88, r: 44 }, 'skin'),
    s('path', { d: 'M36 86q-4-54 44-56q48 2 44 56q-10-30-34-34q-30 2-54 34z' }, 'brown'),
    s('path', { d: 'M80 34q-12 30 6 50q10 12-4 24q22-6 14-28q-10-20 0-44z' }, 'orange', { accent: true }),
    s('path', { d: dots([[64, 92], [104, 92]], 4) }, 'dark'),
    s('path', { d: 'M70 112q10 8 20 0', ...SW(4) }, 'dark', { stroke: true })
  ],
  medicinar: [
    ...face(52, 72, 32, 'skin', 'flat'),
    s('rect', { x: 26, y: 104, width: 52, height: 34, rx: 14 }, 'mint'),
    s('path', { d: 'M100 92l42 30', ...SW(6) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 92, cy: 88, rx: 16, ry: 9, transform: 'rotate(35 92 88)' }, 'gray'),
    s('rect', { x: 82, y: 82, width: 20, height: 10, rx: 5, transform: 'rotate(35 92 87)' }, 'red', { accent: true }),
    s('path', { d: 'M32 44h40', ...SW(5) }, 'white', { stroke: true })
  ],
  metraje: [
    s('circle', { cx: 52, cy: 58, r: 36 }, 'dark'),
    s('path', { d: dots(around(52, 58, 18, 5, -90), 8) }, 'gray'),
    s('circle', { cx: 52, cy: 58, r: 5 }, 'gray'),
    s('path', { d: 'M86 70l50 10v28l-56-10z' }, 'dark'),
    s('path', { d: rects([[92, 80, 12, 14], [110, 84, 12, 14]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M24 128h112M24 128l10-8M24 128l10 8M136 128l-10-8M136 128l-10 8', ...SW(5) }, 'orange', { stroke: true })
  ],
  minimalista: [
    s('rect', { x: 22, y: 22, width: 116, height: 116, rx: 4 }, 'cream'),
    outline({ x: 22, y: 22, width: 116, height: 116, rx: 4 }, 'dark', 4),
    s('path', { d: 'M40 104h80', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 104, cy: 64, r: 14 }, 'red', { accent: true })
  ],
  miocardio: [
    s('path', { d: 'M66 30v18M92 26v20', ...SW(10) }, 'blue', { stroke: true }),
    s('path', { d: heart(80, 90, 36) }, 'red', { accent: true }),
    s('path', { d: 'M40 70q20 10 30 40M58 58q24 14 30 60M96 56q8 30-6 64M118 68q0 24-18 40', ...SW(3) }, 'pink', { stroke: true }),
    s('path', { d: 'M24 136h30l8-14 10 26 10-20h54', ...SW(4) }, 'dark', { stroke: true })
  ],
  'misógino': [
    ...person(46, 136, 'navy', { accent: true }),
    ...lady(118, 136, 'pink'),
    s('path', { d: 'M62 96l18-8', ...SW(7) }, 'navy', { stroke: true }),
    s('path', { d: heart(82, 40, 14) }, 'red'),
    s('path', { d: 'M82 28l-5 8 7 6-5 10', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M38 66l8 3M54 66l-8 3', ...SW(3) }, 'dark', { stroke: true })
  ],
  molienda: [
    s('path', { d: 'M48 56h64l-10 22H58z' }, 'gray'),
    s('rect', { x: 46, y: 78, width: 68, height: 50, rx: 4 }, 'brown', { accent: true }),
    s('path', { d: 'M80 56V38h30', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 112, cy: 38, r: 7 }, 'red'),
    s('path', { d: dots([[62, 52], [74, 48], [88, 50], [100, 52]], 5) }, 'dark'),
    s('rect', { x: 60, y: 104, width: 40, height: 16, rx: 3 }, 'tan'),
    s('circle', { cx: 80, cy: 92, r: 4 }, 'yellow'),
    ground(130)
  ],
  multar: [
    s('path', { d: 'M38 84l16-26h52l16 26z' }, 'sky'),
    s('rect', { x: 18, y: 84, width: 124, height: 34, rx: 10 }, 'blue'),
    s('path', { d: dots([[46, 118], [114, 118]], 12) }, 'dark'),
    s('rect', { x: 66, y: 46, width: 28, height: 36, rx: 2, transform: 'rotate(-8 80 64)' }, 'white'),
    outline({ x: 66, y: 46, width: 28, height: 36, rx: 2, transform: 'rotate(-8 80 64)' }),
    s('rect', { x: 66, y: 46, width: 28, height: 9, transform: 'rotate(-8 80 64)' }, 'red', { accent: true }),
    s('path', { d: 'M72 64h16M72 72h12', ...SW(3), transform: 'rotate(-8 80 64)' }, 'gray', { stroke: true })
  ],
  mundialista: [
    s('path', { d: 'M54 30h52q2 40-26 48q-28-8-26-48z' }, 'yellow', { accent: true }),
    s('path', { d: 'M54 38q-18 0-14 16q4 10 18 10M106 38q18 0 14 16q-4 10-18 10', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M74 78h12v16H74zM60 94h40l4 16H56z' }, 'orange'),
    s('circle', { cx: 116, cy: 116, r: 22 }, 'white'),
    outline({ cx: 116, cy: 116, r: 22 }, 'dark'),
    s('path', { d: 'M116 106l9 7-3 10h-12l-3-10z' }, 'dark'),
    ground(138)
  ],
  nitro: [
    s('path', { d: 'M54 66q-22-14-40 4q14 4 18 10q-18 2-18 14q22 6 40-8z' }, 'orange'),
    s('path', { d: 'M54 72q-14-6-24 4q12 4 24 6z' }, 'yellow'),
    s('rect', { x: 50, y: 58, width: 76, height: 40, rx: 20 }, 'blue', { accent: true }),
    s('rect', { x: 126, y: 70, width: 14, height: 16, rx: 3 }, 'gray'),
    s('path', { d: 'M62 70h40', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: 'M60 116h70M76 128h50M60 40h50', ...SW(4) }, 'gray', { stroke: true })
  ],
  opereta: [
    s('path', { d: 'M14 14h34q-8 60 4 122H14zM146 14h-34q8 60-4 122h38z' }, 'red'),
    ...lady(80, 136, 'purple', { accent: true }),
    ...note(54, 54, 'dark'),
    ...note(102, 40, 'orange')
  ],
  'oscilación': [
    s('path', { d: 'M50 24h60', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 24L44 104M80 24l36 80', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[44, 108], [116, 108]], 12) }, 'gray'),
    s('path', { d: 'M80 24v90', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 118, r: 16 }, 'orange', { accent: true }),
    s('path', { d: 'M34 128q46 28 92 0', ...DASH(4) }, 'blue', { stroke: true })
  ],
  oscurecer: [
    backdrop('navy'),
    s('circle', { cx: 60, cy: 106, r: 30 }, 'orange'),
    s('path', { d: 'M14 104q30-16 62 0t70-6v34q0 12-12 12H26q-12 0-12-12z' }, 'dark'),
    s('path', { d: 'M118 30a18 18 0 1 0 14 30a14 14 0 1 1-14-30z' }, 'yellow', { accent: true }),
    s('path', { d: sparkle(40, 40, 7) + sparkle(84, 30, 5) + sparkle(96, 66, 5) }, 'white')
  ],
  palatino: [
    s('ellipse', { cx: 80, cy: 82, rx: 60, ry: 50 }, 'red'),
    s('ellipse', { cx: 80, cy: 82, rx: 50, ry: 40 }, 'dark'),
    s('path', { d: 'M36 66q44-56 88 0q-44-20-88 0z' }, 'pink', { accent: true }),
    s('path', { d: rects([[50, 60, 10, 10], [64, 54, 10, 10], [78, 52, 10, 10], [92, 54, 10, 10], [104, 60, 10, 10]]) }, 'white'),
    s('path', { d: 'M46 112q34-36 68 0q-34 14-68 0z' }, 'pink')
  ],
  'papelón': [
    s('path', { d: 'M14 136l28-112h76l28 112z' }, 'cream'),
    ...face(80, 82, 40, 'skin', 'frown'),
    s('path', { d: dots([[54, 96], [106, 96]], 8) }, 'pink', { accent: true }),
    s('path', { d: drop(126, 56, 7) }, 'sky'),
    s('path', { d: burst(44, 44, 16, 8, 8) }, 'red')
  ],
  papita: [
    s('path', { d: 'M22 96h116q-6 40-58 40t-58-40z' }, 'red'),
    s('ellipse', { cx: 58, cy: 84, rx: 30, ry: 18, transform: 'rotate(-20 58 84)' }, 'yellow', { accent: true }),
    s('ellipse', { cx: 104, cy: 82, rx: 30, ry: 18, transform: 'rotate(18 104 82)' }, 'orange'),
    s('ellipse', { cx: 82, cy: 62, rx: 28, ry: 17, transform: 'rotate(4 82 62)' }, 'yellow'),
    s('path', { d: dots([[72, 58], [92, 66], [50, 86], [110, 80]], 3) }, 'brown'),
    s('path', { d: 'M40 112h80', ...SW(4) }, 'white', { stroke: true })
  ],
  payasada: [
    s('path', { d: ells([[38, 74, 16, 20], [122, 74, 16, 20]]) }, 'orange'),
    s('circle', { cx: 80, cy: 82, r: 42 }, 'white'),
    outline({ cx: 80, cy: 82, r: 42 }),
    s('path', { d: 'M56 22h48l-24-22z', transform: 'translate(0 18)' }, 'purple'),
    s('path', { d: 'M58 104q22 22 44 0', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: dots([[66, 72], [94, 72]], 5) }, 'dark'),
    s('circle', { cx: 80, cy: 88, r: 10 }, 'red', { accent: true })
  ],
  pender: [
    s('rect', { x: 20, y: 16, width: 120, height: 12, rx: 3 }, 'brown'),
    s('path', { d: 'M80 28v42', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 74h36l10 44H52z' }, 'dark', { accent: true }),
    s('circle', { cx: 80, cy: 72, r: 7, ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 124v8', ...DASH(3, '4 4') }, 'gray', { stroke: true }),
    s('path', { d: 'M56 74q-16-16 0-30M104 74q16-16 0-30', ...SW(3) }, 'gray', { stroke: true }),
    ground(140)
  ],
  peral: [
    ...tree(80, 'green'),
    s('path', { d: drop(56, 64, 7) + drop(98, 56, 7) + drop(80, 84, 7) + drop(110, 84, 6) }, 'yellow', { accent: true }),
    s('path', { d: drop(42, 128, 6) }, 'yellow'),
    ground()
  ],
  perfilar: [
    s('path', { d: HEAD, ...DASH(4, '8 6') }, 'dark', { stroke: true }),
    s('path', { d: 'M110 38l10-6 22 46-10 6z' }, 'yellow', { accent: true }),
    s('path', { d: 'M132 84l10-6 2 14z' }, 'tan'),
    s('path', { d: 'M110 38l10-6 2 4-10 6z' }, 'pink'),
    s('path', { d: 'M122 70q-8 8-12 16', ...SW(4) }, 'dark', { stroke: true })
  ],
  'personalización': [
    s('path', { d: 'M48 30l18-8q14 10 28 0l18 8 22 22-16 16-10-8v70H52V60l-10 8-16-16z' }, 'blue'),
    s('path', { d: star(80, 74, 18) }, 'yellow', { accent: true }),
    s('path', { d: 'M110 140l18-36', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M128 104l4-14 6 4-4 12z' }, 'red'),
    s('path', { d: dots([[104, 96], [56, 110], [96, 114]], 4) }, 'pink')
  ],
  pesquisa: [
    s('path', { d: ells([[30, 124, 7, 10], [52, 110, 7, 10], [36, 92, 7, 10], [60, 78, 7, 10]]) }, 'dark'),
    s('path', { d: 'M108 104l26 26', ...SW(12) }, 'brown', { stroke: true }),
    s('circle', { cx: 88, cy: 76, r: 32 }, 'sky', { accent: true }),
    s('circle', { cx: 88, cy: 76, r: 32, ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: ells([[80, 66, 6, 9], [100, 82, 6, 9]]) }, 'navy'),
    s('path', { d: 'M72 58q6-8 14-8', ...SW(4) }, 'white', { stroke: true })
  ],
  pincelada: [
    s('path', { d: 'M20 112q30-40 60-20t62-30', ...SW(18) }, 'blue', { accent: true, stroke: true }),
    s('path', { d: 'M112 20l-26 38', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M86 56l10 6-6 10-10-6z' }, 'gray'),
    s('path', { d: 'M80 66l10 6-10 12q-8-2-6-10z' }, 'dark')
  ],
  plenipotenciario: [
    ...person(66, 136, 'navy', { h: 54, w: 34, r: 14 }),
    s('path', { d: 'M52 84l30 46', ...SW(6) }, 'red', { stroke: true }),
    s('rect', { x: 90, y: 74, width: 44, height: 52, rx: 3 }, 'cream'),
    outline({ x: 90, y: 74, width: 44, height: 52, rx: 3 }),
    s('path', { d: 'M98 86h28M98 96h28M98 106h16', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 124, cy: 118, r: 9 }, 'red', { accent: true }),
    s('path', { d: 'M82 100h10', ...SW(8) }, 'navy', { stroke: true })
  ],
  plumaje: [
    s('path', { d: ells([[30, 104, 14, 18], [130, 104, 14, 18]]) + ells(around(80, 104, 50, 9, 180).filter(([, y]) => y < 100).map(([x, y]) => [x, y, 13, 17])) }, 'green'),
    s('path', { d: dots(around(80, 104, 50, 9, 180).filter(([, y]) => y < 100), 7) }, 'blue'),
    s('path', { d: dots(around(80, 104, 50, 9, 180).filter(([, y]) => y < 100), 3) }, 'yellow'),
    s('ellipse', { cx: 80, cy: 112, rx: 14, ry: 22 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 84, r: 9 }, 'blue'),
    s('path', { d: 'M78 76l-4-10M82 76l4-10', ...SW(2) }, 'navy', { stroke: true }),
    ground(138)
  ],
  podredumbre: [
    s('path', { d: 'M80 52q-16-12-34-4q-20 12-16 44q6 40 36 40q8 0 14-4q6 4 14 4q30 0 36-40q4-32-16-44q-18-8-34 4z' }, 'brown', { accent: true }),
    s('path', { d: ells([[60, 84, 12, 9], [102, 102, 10, 8], [74, 116, 7, 5]]) }, 'dark'),
    s('path', { d: 'M80 52q0-14 8-22', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M88 38q14-12 22-2q-12 8-22 2z' }, 'gray'),
    s('path', { d: dots([[40, 34], [122, 54], [130, 30]], 4) }, 'black'),
    s('path', { d: 'M34 30q6-6 12 0M118 50q6-6 12 0M126 26q6-6 12 0', ...SW(2) }, 'gray', { stroke: true })
  ],
  'policíaco': [
    s('path', { d: 'M34 60q0-34 46-34t46 34z' }, 'navy'),
    s('rect', { x: 34, y: 56, width: 92, height: 14, rx: 3 }, 'dark'),
    s('path', { d: 'M40 70q40 18 80 0', ...SW(5) }, 'black', { stroke: true }),
    s('path', { d: star(80, 108, 28) }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 108, r: 8 }, 'orange'),
    s('circle', { cx: 80, cy: 44, r: 7 }, 'yellow')
  ],
  prebenda: [
    s('rect', { x: 20, y: 52, width: 76, height: 60, rx: 14 }, 'red', { accent: true }),
    s('rect', { x: 14, y: 82, width: 88, height: 34, rx: 10 }, 'pink'),
    s('path', { d: 'M24 116v18M92 116v18', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M106 84q-8 8-8 26q0 22 22 22t22-22q0-18-8-26z' }, 'tan'),
    s('path', { d: 'M110 76h20l-6 10h-8z' }, 'brown'),
    s('path', { d: ells([[56, 26, 12, 5], [56, 36, 12, 5], [56, 46, 12, 5]]) }, 'yellow'),
    s('circle', { cx: 120, cy: 108, r: 8 }, 'yellow')
  ],
  'prehispánico': [
    s('circle', { cx: 124, cy: 34, r: 14 }, 'yellow'),
    s('path', { d: 'M16 136h128l-12-22H28zM30 114h100l-12-22H42zM44 92h72l-12-22H56z' }, 'tan', { accent: true }),
    s('rect', { x: 62, y: 46, width: 36, height: 24 }, 'brown'),
    s('rect', { x: 74, y: 56, width: 12, height: 14 }, 'dark'),
    s('path', { d: 'M72 136l4-66h8l4 66z' }, 'brown'),
    s('path', { d: 'M78 78h4M77 90h6M76 102h8M75 114h10M74 126h12', ...SW(2) }, 'tan', { stroke: true })
  ],
  pretencioso: [
    ...person(80, 136, 'purple', { h: 52, w: 34, r: 16, accent: true }),
    s('rect', { x: 64, y: 30, width: 32, height: 26, rx: 2, transform: 'rotate(-10 80 56)' }, 'black'),
    s('rect', { x: 58, y: 54, width: 44, height: 6, rx: 3, transform: 'rotate(-10 80 56)' }, 'black'),
    s('circle', { cx: 86, cy: 68, r: 6, ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M92 72l10-6', ...SW(4) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(34, 52, 10) + sparkle(126, 94, 9) + sparkle(40, 108, 7) }, 'yellow')
  ],
  'propensión': [
    s('circle', { cx: 128, cy: 34, r: 16 }, 'yellow', { accent: true }),
    s('path', { d: rays(128, 34, 21, 29, 8) , ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M54 110q-4-40 20-60q14-10 30-16', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(62, 78, -20, 26, 8) + leaflet(80, 52, -40, 26, 8) + leaflet(58, 92, 200, 22, 7) }, 'green'),
    s('path', { d: 'M30 108h48l-6 30H36z' }, 'brown')
  ],
  puf: [
    s('ellipse', { cx: 80, cy: 132, rx: 56, ry: 6 }, 'gray'),
    s('path', { d: 'M26 128q-10-46 26-70q28-18 56 0q36 24 26 70q-54 8-108 0z' }, 'orange', { accent: true }),
    s('path', { d: 'M46 74q34 20 68 0', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 52v-8M60 50l-6-8M100 50l6-8', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: ells([[44, 34, 10, 7], [116, 34, 10, 7]]) }, 'gray')
  ],
  'póker': [
    s('rect', { x: 34, y: 26, width: 50, height: 70, rx: 6, transform: 'rotate(-14 59 96)' }, 'white'),
    outline({ x: 34, y: 26, width: 50, height: 70, rx: 6, transform: 'rotate(-14 59 96)' }),
    s('rect', { x: 70, y: 24, width: 50, height: 70, rx: 6, transform: 'rotate(10 95 94)' }, 'white'),
    outline({ x: 70, y: 24, width: 50, height: 70, rx: 6, transform: 'rotate(10 95 94)' }),
    s('path', { d: heart(98, 56, 12) }, 'red', { accent: true }),
    s('path', { d: heart(56, 68, 10), transform: 'rotate(180 56 59) rotate(14 56 59)' }, 'dark'),
    s('path', { d: ells([[40, 122, 18, 7], [40, 114, 18, 7], [120, 122, 18, 7]]) }, 'blue'),
    s('path', { d: ells([[40, 106, 18, 7], [120, 114, 18, 7]]) }, 'red')
  ],
  'póstumo': [
    s('path', { d: 'M28 136V64q0-30 34-30t34 30v72z' }, 'gray'),
    s('path', { d: 'M46 72h32M46 84h24', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 86, y: 92, width: 52, height: 40, rx: 3 }, 'red', { accent: true }),
    s('rect', { x: 86, y: 124, width: 52, height: 8 }, 'cream'),
    s('path', { d: sparkle(124, 72, 10) }, 'yellow'),
    s('path', { d: 'M100 92v40', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[44, 126], [54, 122], [64, 128]], 6) }, 'purple'),
    ground()
  ],
  rectorado: [
    s('path', { d: 'M20 62l60-34 60 34z' }, 'gray'),
    s('path', { d: rects([[30, 66, 12, 56], [56, 66, 12, 56], [92, 66, 12, 56], [118, 66, 12, 56]]) }, 'cream'),
    s('rect', { x: 72, y: 88, width: 16, height: 34 }, 'brown'),
    s('rect', { x: 20, y: 122, width: 120, height: 14 }, 'gray'),
    s('path', { d: 'M80 34l20 8-20 8-20-8z' }, 'navy', { accent: true }),
    s('path', { d: 'M98 42v10', ...SW(2) }, 'yellow', { stroke: true })
  ],
  recubrimiento: [
    s('rect', { x: 18, y: 40, width: 80, height: 96, rx: 4 }, 'gray'),
    s('path', { d: 'M18 40h50v96H18z' }, 'blue', { accent: true }),
    s('path', { d: 'M68 40q-8 12 0 24t0 24 0 24 0 24', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: dots([[78, 70], [86, 60], [86, 82], [94, 72], [80, 92], [96, 56]], 3) }, 'blue'),
    s('path', { d: 'M104 62h30v18h-30zM118 80l8 26h-12l-6-26z' }, 'dark'),
    s('path', { d: 'M104 66l-6 4v4l6 2z' }, 'orange')
  ],
  reflector: [
    s('path', { d: 'M96 52L150 14v94L96 72z' }, 'cream'),
    s('path', { d: 'M40 44h50l8 10v12l-8 10H40z' }, 'dark'),
    s('ellipse', { cx: 96, cy: 62, rx: 6, ry: 16 }, 'yellow', { accent: true }),
    s('path', { d: 'M64 76v40M64 116l-26 20M64 116l26 20M64 116v20', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M54 44v-8h20v8', ...SW(4) }, 'gray', { stroke: true })
  ],
  'regañadientes': [
    ...face(80, 74, 46, 'orange', 'flat', { accent: true }),
    s('rect', { x: 58, y: 84, width: 44, height: 20, rx: 6 }, 'white'),
    s('path', { d: 'M58 94h44M69 84v20M80 84v20M91 84v20', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M50 48l20 8M110 48l-20 8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M34 130q46-16 92 0', ...SW(14) }, 'blue', { stroke: true })
  ],
  retrovisor: [
    s('path', { d: 'M80 98v26h-24v12', ...SW(8) }, 'dark', { stroke: true }),
    s('rect', { x: 18, y: 36, width: 124, height: 62, rx: 28 }, 'dark'),
    s('rect', { x: 26, y: 44, width: 108, height: 46, rx: 22 }, 'sky', { accent: true }),
    s('path', { d: 'M64 70l8-12h18l8 12z' }, 'white'),
    s('rect', { x: 56, y: 70, width: 50, height: 12, rx: 4 }, 'red'),
    s('path', { d: 'M38 54l14-6', ...SW(4) }, 'white', { stroke: true })
  ],
  salvajemente: [
    s('path', { d: burst(80, 80, 66, 50, 14) }, 'brown'),
    s('circle', { cx: 80, cy: 80, r: 42 }, 'orange', { accent: true }),
    s('path', { d: 'M56 62l16 6M104 62l-16 6', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 92q22-10 44 0q-4 26-22 26t-22-26z' }, 'dark'),
    s('path', { d: 'M62 93l5 10 5-10zM88 93l5 10 5-10z' }, 'white'),
    s('path', { d: 'M74 76l6 6 6-6z' }, 'black')
  ],
  secador: [
    s('path', { d: 'M62 82l-16 52h22l14-50z' }, 'dark'),
    s('rect', { x: 30, y: 40, width: 84, height: 46, rx: 23 }, 'pink', { accent: true }),
    s('rect', { x: 108, y: 48, width: 18, height: 30, rx: 4 }, 'gray'),
    s('circle', { cx: 52, cy: 63, r: 12 }, 'gray'),
    s('path', { d: 'M132 50q8 6 0 12t0 12M144 44q8 8 0 18t0 18', ...SW(3) }, 'sky', { stroke: true })
  ],
  secano: [
    s('circle', { cx: 118, cy: 38, r: 18 }, 'orange', { accent: true }),
    s('path', { d: rays(118, 38, 24, 32, 8), ...SW(3) }, 'yellow', { stroke: true }),
    s('rect', { x: 14, y: 92, width: 132, height: 46, rx: 6 }, 'tan'),
    s('path', { d: 'M24 104l14 10 2 14M60 98l-6 14 10 12M92 112l16-4 6 18M120 98l8 12', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M38 92V56M50 92V62M62 92V58', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: ells([[38, 52, 4, 9], [50, 58, 4, 9], [62, 54, 4, 9]]) }, 'yellow')
  ],
  servil: [
    s('rect', { x: 92, y: 120, width: 52, height: 16 }, 'red'),
    ...person(118, 120, 'purple', { h: 46, w: 30, accent: true }),
    s('path', { d: 'M106 50l4-10 8 6 8-6 4 10z' }, 'yellow'),
    ...lean(44, 136, 32, 'gray', { h: 40, w: 26, r: 11 }),
    ground()
  ],
  simbiosis: [
    backdrop('sky'),
    s('path', { d: 'M40 136q-10-30 6-56M60 136q-4-34 10-64M80 136q2-34-6-62M100 136q8-30 0-58M120 136q10-28-6-52', ...SW(9) }, 'pink', { stroke: true }),
    s('path', { d: 'M34 136h92', ...SW(8) }, 'purple', { stroke: true }),
    s('ellipse', { cx: 88, cy: 54, rx: 24, ry: 14 }, 'orange', { accent: true }),
    s('path', { d: 'M66 54l-14-10v20z' }, 'orange'),
    s('path', { d: 'M78 42v24M96 42v24', ...SW(4) }, 'white', { stroke: true }),
    s('circle', { cx: 104, cy: 50, r: 3 }, 'dark')
  ],
  sobremesa: [
    s('path', { d: busts([30, 130], 116, 28, 40) }, 'blue'),
    s('path', { d: dots([[30, 66], [130, 66]], 13) }, 'skin'),
    s('rect', { x: 14, y: 112, width: 132, height: 10, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: ells([[66, 108, 16, 4]]) + 'M90 96h14v14H90z' }, 'gray'),
    s('path', { d: 'M104 100q8 0 6 6', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: bubble(54, 24, 34, 26) }, 'cream'),
    s('path', { d: dots([[64, 36], [71, 36], [78, 36]], 2.5) }, 'dark'),
    s('path', { d: 'M28 122v14M132 122v14', ...SW(5) }, 'brown', { stroke: true })
  ],
  soneto: [
    ...paper(28, 18, 84, 124),
    s('path', { d: 'M40 32h56M40 40h50M40 48h56M40 56h44M40 70h56M40 78h50M40 86h56M40 94h44M40 108h52M40 116h46M40 124h50', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M138 22q-30 10-40 60l6 2q24-30 34-62z' }, 'purple', { accent: true }),
    s('path', { d: 'M100 82l-6 22', ...SW(3) }, 'dark', { stroke: true })
  ],
  subjuntivo: [
    ...person(44, 136, 'blue', { h: 40, w: 28, r: 12 }),
    s('path', { d: ells([[100, 52, 40, 26], [76, 46, 18, 16], [124, 44, 18, 16]]) }, 'white'),
    s('path', { d: ells([[100, 52, 40, 26]]), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[64, 84], [56, 72]], 4) }, 'gray'),
    s('path', { d: star(100, 52, 16) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(128, 36, 6) + sparkle(76, 64, 5) }, 'purple')
  ],
  suplementario: [
    s('rect', { x: 38, y: 104, width: 84, height: 32, rx: 4 }, 'brown'),
    s('rect', { x: 38, y: 72, width: 84, height: 32, rx: 4 }, 'tan'),
    s('rect', { x: 54, y: 22, width: 52, height: 28, rx: 4 }, 'orange', { accent: true }),
    s('rect', { x: 54, y: 22, width: 52, height: 28, rx: 4, ...DASH(3, '0') }, 'brown', { stroke: true }),
    s('path', { d: 'M38 68h84', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 52v12M74 58l6 6 6-6', ...SW(4) }, 'dark', { stroke: true })
  ],
  treintena: [
    s('rect', { x: 16, y: 34, width: 128, height: 100, rx: 10 }, 'tan'),
    s('path', { d: ells(Array.from({ length: 30 }, (_, k) => [30 + (k % 6) * 20, 50 + Math.floor(k / 6) * 17, 8, 7])) }, 'cream', { accent: true }),
    s('path', { d: ells(Array.from({ length: 30 }, (_, k) => [30 + (k % 6) * 20, 50 + Math.floor(k / 6) * 17, 8, 7])), ...SW(1.5) }, 'brown', { stroke: true })
  ],
  tribuno: [
    s('rect', { x: 40, y: 104, width: 80, height: 34, rx: 3 }, 'gray'),
    s('circle', { cx: 80, cy: 38, r: 13 }, 'skin'),
    s('path', { d: laurel(80, 38, 15, 9, 3) }, 'green'),
    s('path', { d: 'M64 54h32l6 50H58z' }, 'white'),
    s('path', { d: 'M64 54h32l6 50H58z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 56l32 46', ...SW(8) }, 'red', { accent: true, stroke: true }),
    s('path', { d: 'M96 60l22-24', ...SW(8) }, 'skin', { stroke: true })
  ],
  tridente: [
    backdrop('sky'),
    s('path', { d: 'M14 120q16-8 33 0t33 0 33 0 33 0v14q0 12-12 12H26q-12 0-12-12z' }, 'blue'),
    s('path', { d: 'M80 64v76', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: 'M52 26v26q0 14 28 14t28-14V26M80 20v46', ...SW(7) }, 'yellow', { accent: true, stroke: true }),
    s('path', { d: 'M46 30l6-12 6 12zM74 24l6-12 6 12zM102 30l6-12 6 12z' }, 'yellow')
  ],
  urraca: [
    s('path', { d: 'M90 96l50 30-6 8-50-28z' }, 'navy'),
    s('ellipse', { cx: 76, cy: 88, rx: 32, ry: 22 }, 'black', { accent: true }),
    s('path', { d: 'M56 92q20 22 44 6q-20 4-44-6z' }, 'white'),
    s('path', { d: 'M70 76q22-6 36 10q-16 2-36-10z' }, 'white'),
    s('circle', { cx: 46, cy: 66, r: 16 }, 'black'),
    s('path', { d: 'M32 62l-14 6 14 3z' }, 'dark'),
    s('circle', { cx: 42, cy: 62, r: 3 }, 'white'),
    s('path', { d: 'M70 108l-4 22M84 108l2 22', ...SW(3) }, 'dark', { stroke: true })
  ],
  vibrador: [
    s('rect', { x: 64, y: 70, width: 26, height: 66, rx: 10 }, 'purple'),
    s('ellipse', { cx: 77, cy: 50, rx: 28, ry: 24 }, 'pink', { accent: true }),
    s('rect', { x: 70, y: 90, width: 14, height: 8, rx: 3 }, 'white'),
    s('path', { d: 'M38 30q-10 20 0 40M28 24q-14 26 0 52M116 30q10 20 0 40M126 24q14 26 0 52', ...SW(4) }, 'gray', { stroke: true })
  ],
  zafiro: [
    s('path', { d: 'M44 36h72l26 30-62 74-62-74z' }, 'blue', { accent: true }),
    s('path', { d: 'M18 66h124L80 140z' }, 'navy'),
    s('path', { d: 'M44 36l14 30 22-30 22 30 14-30', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M58 66l22 74 22-74', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: sparkle(130, 26, 12) }, 'yellow')
  ],
  zarpado: [
    s('path', { d: 'M20 112a60 60 0 0 1 120 0z' }, 'dark'),
    s('path', { d: 'M30 112a50 50 0 0 1 25-43', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'green', { stroke: true }),
    s('path', { d: 'M58 66a50 50 0 0 1 48 0', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'yellow', { stroke: true }),
    s('path', { d: 'M108 67a50 50 0 0 1 22 45', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true }),
    s('path', { d: 'M80 112l58 12', ...SW(6) }, 'orange', { accent: true, stroke: true }),
    s('circle', { cx: 80, cy: 112, r: 8 }, 'gray'),
    s('path', { d: burst(140, 126, 14, 7, 8) }, 'red')
  ],
  'zoología': [
    ...openBook(80, 66, 'white', 'green'),
    s('path', { d: dots([[50, 84], [62, 78], [74, 84]], 5) + ells([[62, 98, 11, 9]]) }, 'brown', { accent: true }),
    s('path', { d: 'M100 92q-14-14 0-20q4 8 4 20M108 92q14-14 0-20q-4 8-4 20' }, 'orange'),
  ],
  abreviatura: [
    s('rect', { x: 14, y: 34, width: 132, height: 30, rx: 8 }, 'sky'),
    s('path', { d: rects([[24, 44, 18, 10], [48, 44, 22, 10], [76, 44, 14, 10], [96, 44, 20, 10], [122, 44, 14, 10]]) }, 'navy'),
    s('path', { d: 'M80 72v24M70 86l10 10 10-10', ...SW(5) }, 'orange', { stroke: true }),
    s('rect', { x: 52, y: 104, width: 56, height: 30, rx: 8 }, 'yellow', { accent: true }),
    s('path', { d: rects([[62, 114, 18, 10], [86, 114, 12, 10]]) }, 'navy')
  ],
  'aeronáutico': [
    backdrop('sky'),
    s('path', { d: 'M24 82q0-12 14-12h86q16 0 22 12q-6 12-22 12H38q-14 0-14-12z' }, 'white'),
    s('path', { d: 'M70 82l26-46h14l-14 46zM70 82l26 40h14l-14-40z' }, 'blue', { accent: true }),
    s('path', { d: 'M28 72l-8-28h12l16 28z' }, 'blue'),
    s('path', { d: grid(56, 76, 6, 1, 6, 6, 10, 0) }, 'navy'),
    s('path', { d: 'M126 74q10 2 14 8', ...SW(4) }, 'navy', { stroke: true })
  ],
  'aglomeración': [
    s('path', { d: dots([[24, 64], [48, 58], [72, 62], [96, 56], [120, 60], [140, 66]], 10) }, 'skin'),
    s('path', { d: busts([24, 48, 72, 96, 120, 140], 104, 22, 30) }, 'gray'),
    s('path', { d: dots([[36, 88], [62, 84], [88, 86], [114, 84], [134, 92]], 11) }, 'skin'),
    s('path', { d: busts([36, 114], 136, 24, 34) + busts([134], 136, 22, 32) }, 'blue'),
    s('path', { d: busts([62, 88], 136, 24, 36) }, 'red', { accent: true })
  ],
  aleatoriamente: [
    s('rect', { x: 26, y: 62, width: 50, height: 50, rx: 9, transform: 'rotate(-18 51 87)' }, 'red', { accent: true }),
    s('path', { d: dots([[40, 76], [51, 87], [62, 98]], 5), transform: 'rotate(-18 51 87)' }, 'white'),
    s('rect', { x: 88, y: 40, width: 46, height: 46, rx: 9, transform: 'rotate(24 111 63)' }, 'white'),
    outline({ x: 88, y: 40, width: 46, height: 46, rx: 9, transform: 'rotate(24 111 63)' }, 'dark'),
    s('path', { d: dots([[100, 52], [122, 52], [100, 74], [122, 74]], 5), transform: 'rotate(24 111 63)' }, 'dark'),
    s('path', { d: 'M30 132q20-14 40-6t40-4', ...DASH(4) }, 'gray', { stroke: true })
  ],
  'alfarería': [
    s('ellipse', { cx: 80, cy: 118, rx: 60, ry: 12 }, 'gray'),
    s('rect', { x: 66, y: 120, width: 28, height: 18 }, 'dark'),
    s('path', { d: 'M62 112q-14-20 4-40q6-8 2-20h24q-4 12 2 20q18 20 4 40z' }, 'orange', { accent: true }),
    s('path', { d: 'M66 50h28', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: ells([[42, 86, 14, 10], [118, 86, 14, 10]]) }, 'skin'),
    s('path', { d: 'M14 96q14-10 28-10M146 96q-14-10-28-10', ...SW(10) }, 'skin', { stroke: true })
  ],
  alita: [
    s('ellipse', { cx: 80, cy: 104, rx: 64, ry: 24 }, 'white'),
    s('ellipse', { cx: 80, cy: 104, rx: 64, ry: 24, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 98q4-30 30-30q20 0 22 14q-12 4-18 20q-14 10-34-4z' }, 'orange', { accent: true }),
    s('path', { d: 'M94 108q-6-28 18-34q20-2 24 12q-4 16-18 26q-14 6-24-4z' }, 'brown'),
    s('path', { d: dots([[60, 82], [112, 92], [50, 92]], 3) }, 'red'),
    s('path', { d: 'M44 40q6 8 0 16M60 34q6 8 0 16M104 44q6 8 0 16', ...SW(3) }, 'gray', { stroke: true })
  ],
  altruismo: [
    ...person(42, 136, 'green', { h: 48, w: 30 }),
    ...person(124, 136, 'blue', { h: 34, w: 24, r: 10 }),
    s('path', { d: 'M56 100l22-10M110 106l-14-6', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: heart(88, 84, 14) }, 'red', { accent: true }),
    s('path', { d: sparkle(88, 40, 8) }, 'yellow')
  ],
  'amputación': [
    s('circle', { cx: 80, cy: 28, r: 13 }, 'skin'),
    s('rect', { x: 62, y: 44, width: 36, height: 46, rx: 12 }, 'blue'),
    s('path', { d: 'M70 90v46h-8', ...SW(10) }, 'navy', { stroke: true }),
    s('path', { d: 'M90 88v14', ...SW(12) }, 'navy', { stroke: true }),
    s('path', { d: 'M90 102v18q0 14 14 16h10', ...SW(6) }, 'gray', { accent: true, stroke: true }),
    s('path', { d: 'M62 50l-14 34M98 50l14 34', ...SW(8) }, 'skin', { stroke: true }),
    ground(138)
  ],
  apocar: [
    ...person(56, 136, 'navy', { h: 62, w: 40, r: 16 }),
    s('path', { d: 'M76 82l30 16', ...SW(8) }, 'navy', { stroke: true }),
    s('circle', { cx: 120, cy: 112, r: 6 }, 'skin'),
    s('rect', { x: 113, y: 120, width: 14, height: 16, rx: 5 }, 'gray', { accent: true }),
    s('path', { d: 'M132 70v24M126 88l6 6 6-6', ...SW(4) }, 'orange', { stroke: true }),
    ground()
  ],
  apresuradamente: [
    ...lean(76, 120, 22, 'orange', { h: 42, w: 26, r: 12, accent: true }),
    s('path', { d: 'M76 120l-18 16M76 118l22 12 6 8', ...SW(8) }, 'navy', { stroke: true }),
    s('path', { d: 'M18 70h26M12 88h30M20 106h22', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 128, cy: 36, r: 16 }, 'white'),
    s('path', { d: ring(128, 36, 16) + 'M128 26v10l7 5', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: drop(110, 50, 4) }, 'sky')
  ],
  armonioso: [
    s('path', { d: 'M14 70q33-20 66 0t66 0M14 84q33-20 66 0t66 0M14 98q33-20 66 0t66 0', ...SW(2) }, 'gray', { stroke: true }),
    ...note(40, 100, 'blue'),
    ...note(108, 76, 'purple'),
    s('path', { d: heart(78, 112, 12) }, 'pink'),
    s('path', { d: sparkle(80, 34, 8) }, 'yellow')
  ],
  artillero: [
    s('path', { d: 'M24 98l72-30 6 16-72 30z' }, 'dark', { accent: true }),
    s('circle', { cx: 56, cy: 112, r: 20 }, 'brown'),
    s('circle', { cx: 56, cy: 112, r: 6 }, 'tan'),
    s('path', { d: dots([[20, 132], [32, 132], [26, 122]], 6) }, 'black'),
    ...person(122, 136, 'green', { h: 42, w: 28, r: 11 }),
    s('path', { d: 'M108 76a14 14 0 0 1 28 0z' }, 'green'),
    s('path', { d: ells([[108, 56, 10, 8], [118, 48, 8, 6]]) }, 'gray')
  ],
  aseguramiento: [
    s('path', { d: 'M80 18l52 18v36q0 44-52 66q-52-22-52-66V36z' }, 'blue', { accent: true }),
    s('path', { d: 'M66 72v-12a14 14 0 0 1 28 0v12', ...SW(6) }, 'white', { stroke: true }),
    s('rect', { x: 58, y: 70, width: 44, height: 36, rx: 6 }, 'yellow'),
    s('circle', { cx: 80, cy: 86, r: 5 }, 'dark'),
    s('path', { d: 'M80 88v10', ...SW(4) }, 'dark', { stroke: true })
  ],
  atasco: [
    s('rect', { x: 14, y: 40, width: 132, height: 96, rx: 6 }, 'gray'),
    s('path', { d: 'M20 88h120', ...DASH(3, '10 8') }, 'white', { stroke: true }),
    s('path', { d: 'M24 62l6-10h18l6 10zM90 62l6-10h18l6 10zM36 110l6-10h18l6 10zM102 110l6-10h18l6 10z' }, 'sky'),
    s('path', { d: rects([[18, 62, 44, 14], [84, 62, 44, 14]]) }, 'red', { accent: true }),
    s('path', { d: rects([[30, 110, 44, 14], [96, 110, 44, 14]]) }, 'blue'),
    s('path', { d: dots([[28, 76], [52, 76], [94, 76], [118, 76], [40, 124], [64, 124], [106, 124], [130, 124]], 5) }, 'dark')
  ],
  'autenticación': [
    s('rect', { x: 44, y: 16, width: 68, height: 124, rx: 10 }, 'dark'),
    s('rect', { x: 50, y: 26, width: 56, height: 100, rx: 4 }, 'sky'),
    s('path', { d: 'M70 60v-8a8 8 0 0 1 16 0v8', ...SW(4) }, 'navy', { stroke: true }),
    s('rect', { x: 64, y: 58, width: 28, height: 22, rx: 4 }, 'navy'),
    s('path', { d: dots([[60, 100], [72, 100], [84, 100], [96, 100]], 4) }, 'white'),
    s('circle', { cx: 112, cy: 120, r: 18 }, 'green', { accent: true }),
    s('path', { d: 'M103 120l7 7 12-13', ...SW(5) }, 'white', { stroke: true })
  ],
  'averiguación': [
    ...person(44, 136, 'orange', { h: 46, w: 28 }),
    ...person(122, 136, 'gray', { h: 46, w: 28 }),
    s('rect', { x: 62, y: 80, width: 26, height: 32, rx: 2 }, 'cream'),
    outline({ x: 62, y: 80, width: 26, height: 32, rx: 2 }, 'dark', 2),
    s('path', { d: 'M68 90h14M68 98h14M68 106h8', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: bubble(78, 24, 36, 26) }, 'blue', { accent: true }),
    s('path', { d: dots([[88, 36], [96, 36], [104, 36]], 3) }, 'white')
  ],
  barandilla: [
    s('path', { d: 'M18 136h32v-20h24v-20h24v-20h24v-20h20v80z' }, 'gray'),
    s('path', { d: 'M34 116V76M62 96V56M86 76V36M110 56V18', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M26 82l116-70', ...SW(9) }, 'brown', { accent: true, stroke: true })
  ],
  'barcelonés': [
    s('path', { d: 'M14 120q16-8 33 0t33 0 33 0 33 0v16H14z' }, 'blue'),
    s('path', { d: 'M40 120V50q8-34 16 0v70zM64 120V36q8-34 16 0v84zM88 120V36q8-34 16 0v84zM112 120V50q8-34 16 0v70z' }, 'tan', { accent: true }),
    s('path', { d: dots([[48, 32], [72, 18], [96, 18], [120, 32]], 4) }, 'orange'),
    s('path', { d: rects([[45, 70, 6, 12], [69, 60, 6, 12], [93, 60, 6, 12], [117, 70, 6, 12]]) }, 'brown'),
    s('rect', { x: 36, y: 104, width: 96, height: 16, rx: 2 }, 'brown')
  ],
  bronquitis: [
    s('path', { d: 'M74 50q-34-8-46 30q-10 40 8 50q22 8 38-10zM86 50q34-8 46 30q10 40-8 50q-22 8-38-10z' }, 'pink'),
    s('path', { d: 'M80 18v40M80 58l-20 20M80 58l20 20M60 78l-10 18M60 78v20M100 78l10 18M100 78v20', ...SW(5) }, 'red', { accent: true, stroke: true }),
    s('path', { d: 'M36 26l-12-6M34 36H18M38 46l-14 4', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[52, 104], [110, 100], [64, 116]], 3) }, 'orange')
  ],
  'báltico': [
    backdrop('sky'),
    s('path', { d: 'M14 96q16-8 33 0t33 0 33 0 33 0v38q0 12-12 12H26q-12 0-12-12z' }, 'navy'),
    s('path', { d: 'M100 96h46V70q-20-6-46 4z' }, 'green'),
    s('path', { d: 'M118 74v-40h12v40z' }, 'white'),
    s('path', { d: 'M118 46h12M118 60h12', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M114 34l10-10 10 10z' }, 'red', { accent: true }),
    s('path', { d: 'M40 92h40l-6 10H46zM58 92V56l20 30z' }, 'white'),
    s('path', { d: 'M24 124q12-6 24 0M64 116q12-6 24 0', ...SW(3) }, 'sky', { stroke: true })
  ],
  'caló': [
    s('path', { d: busts([36, 124], 138, 34, 46) }, 'purple'),
    s('path', { d: dots([[36, 76], [124, 76]], 15) }, 'skin'),
    s('path', { d: bubble(46, 18, 68, 40) }, 'dark', { accent: true }),
    s('path', { d: 'M58 34q8-8 16 0t16 0 16 0', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[64, 46], [80, 46], [96, 46]], 3) }, 'white')
  ],
  carbonero: [
    s('path', { d: 'M24 134q4-40 40-44q36 4 40 44z' }, 'black', { accent: true }),
    s('path', { d: dots([[48, 110], [70, 104], [84, 120]], 4) }, 'gray'),
    s('path', { d: 'M124 26l-14 80', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M96 102l28 4-6 30-26-4z' }, 'gray'),
    s('path', { d: dots([[106, 116], [114, 118]], 5) }, 'black'),
    s('path', { d: 'M112 26h22', ...SW(6) }, 'brown', { stroke: true }),
    ground(138)
  ],
  caritativo: [
    s('rect', { x: 36, y: 74, width: 88, height: 62, rx: 6 }, 'red', { accent: true }),
    s('rect', { x: 58, y: 74, width: 44, height: 6, rx: 3 }, 'dark'),
    s('path', { d: heart(80, 112, 14) }, 'white'),
    s('circle', { cx: 80, cy: 52, r: 12 }, 'yellow'),
    s('path', { d: 'M96 26q12-4 30 2l10 12', ...SW(12) }, 'skin', { stroke: true })
  ],
  cepo: [
    s('rect', { x: 14, y: 36, width: 132, height: 30, rx: 8 }, 'blue'),
    s('circle', { cx: 74, cy: 92, r: 44 }, 'black'),
    s('circle', { cx: 74, cy: 92, r: 22 }, 'gray'),
    s('path', { d: 'M74 92h56v-30h12v46h-12', ...SW(10) }, 'yellow', { accent: true, stroke: true }),
    s('circle', { cx: 74, cy: 92, r: 12 }, 'yellow'),
    s('rect', { x: 124, y: 104, width: 18, height: 16, rx: 3 }, 'dark')
  ],
  chillar: [
    ...face(70, 84, 44, 'orange', 'flat', { accent: true }),
    s('ellipse', { cx: 70, cy: 104, rx: 14, ry: 18 }, 'dark'),
    s('path', { d: 'M46 60l14 6M94 60l-14 6', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M122 70l18-10M126 86h20M122 102l18 10', ...SW(5) }, 'red', { stroke: true })
  ],
  'clínicamente': [
    s('rect', { x: 26, y: 28, width: 74, height: 104, rx: 6 }, 'brown'),
    s('rect', { x: 34, y: 38, width: 58, height: 86, rx: 3 }, 'white'),
    s('rect', { x: 48, y: 22, width: 30, height: 12, rx: 4 }, 'gray'),
    s('path', { d: 'M40 70h12l6-14 8 28 6-14h14', ...SW(4) }, 'red', { accent: true, stroke: true }),
    s('path', { d: 'M42 98h40M42 110h28', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M112 22v30q0 18 14 18t14-18V22M126 70v30q0 24-24 24', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 100, cy: 124, r: 10 }, 'gray')
  ],
  computacional: [
    s('rect', { x: 18, y: 24, width: 124, height: 84, rx: 6 }, 'dark'),
    s('rect', { x: 26, y: 32, width: 108, height: 68, rx: 3 }, 'navy'),
    s('path', { d: 'M36 46h40M46 58h50M46 70h30M36 82h44', ...SW(4) }, 'mint', { stroke: true }),
    ...gear(108, 70, 12, 8, 'orange', { accent: true }),
    s('path', { d: 'M62 108l-6 22h48l-6-22z' }, 'gray')
  ],
  condensador: [
    s('path', { d: 'M66 112v28M94 112v20', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 50, y: 22, width: 60, height: 92, rx: 12 }, 'blue', { accent: true }),
    s('rect', { x: 92, y: 26, width: 12, height: 84 }, 'sky'),
    s('ellipse', { cx: 80, cy: 26, rx: 28, ry: 6 }, 'gray'),
    s('path', { d: 'M98 40v8M98 60v8M98 80v8', ...SW(3) }, 'navy', { stroke: true })
  ],
  congruente: [
    s('path', { d: 'M18 120l28-76 40 76z' }, 'blue', { accent: true }),
    s('path', { d: 'M74 120l28-76 40 76z' }, 'orange'),
    s('path', { d: 'M28 80l6 4M84 80l6 4M60 82l6-4M116 82l6-4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 116v8M124 116v8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 136h32M64 144h32', ...SW(4) }, 'gray', { stroke: true })
  ],
  'congénito': [
    s('path', { d: 'M38 136q-6-50 32-56q38 6 32 56z' }, 'sky'),
    s('circle', { cx: 70, cy: 64, r: 26 }, 'skin'),
    s('path', { d: 'M60 64q4 4 8 0M74 64q4 4 8 0M64 76q6 4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M114 20q28 20 0 40t0 40 0 40M140 20q-28 20 0 40t0 40 0 40', ...SW(4) }, 'purple', { accent: true, stroke: true }),
    s('path', { d: 'M118 30h18M118 50h18M118 70h18M118 90h18M118 110h18M118 130h18', ...SW(3) }, 'pink', { stroke: true }),
    s('path', { d: 'M48 50q22-18 44 0q-22-10-44 0z' }, 'brown')
  ],
  converso: [
    ...person(54, 136, 'green', { h: 44, w: 28, accent: true }),
    s('path', { d: 'M40 30q-30 30 0 50', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M90 64q30-30 40 0', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M122 60l8 10 6-12z' }, 'orange'),
    s('circle', { cx: 122, cy: 98, r: 14 }, 'yellow'),
    s('path', { d: rays(122, 98, 18, 26, 8), ...SW(3) }, 'yellow', { stroke: true }),
    ground()
  ],
  'crucifixión': [
    backdrop('orange'),
    s('circle', { cx: 80, cy: 88, r: 26 }, 'yellow'),
    s('path', { d: 'M14 112q66-26 132 0v22q0 12-12 12H26q-12 0-12-12z' }, 'dark'),
    s('path', { d: 'M80 98V34M64 50h32', ...SW(8) }, 'brown', { accent: true, stroke: true }),
    s('path', { d: 'M38 108V66M28 78h20M122 108V66M112 78h20', ...SW(6) }, 'brown', { stroke: true })
  ],
  cuadrangular: [
    s('path', { d: 'M80 24l56 56-56 56-56-56z' }, 'green'),
    s('path', { d: 'M80 44l36 36-36 36-36-36z' }, 'tan'),
    s('path', { d: 'M80 108l8 8-8 8-8-8zM108 72l8 8-8 8-8-8zM80 36l8 8-8 8-8-8zM52 72l8 8-8 8-8-8z' }, 'white'),
    s('circle', { cx: 132, cy: 30, r: 10 }, 'white'),
    s('path', { d: ring(132, 30, 10), ...SW(2) }, 'red', { stroke: true }),
    s('path', { d: 'M84 104q20-60 38-70', ...DASH(3) }, 'orange', { accent: true, stroke: true })
  ],
  cui: [
    s('path', { d: 'M28 100q0-40 50-40q58 0 58 40q0 28-54 28q-54 0-54-28z' }, 'orange', { accent: true }),
    s('path', { d: 'M78 60q34 0 48 22q-20 6-34 0q-14-6-14-22z' }, 'white'),
    s('path', { d: 'M28 100q2-30 34-36q-10 30 4 62q-38-4-38-26z' }, 'brown'),
    s('ellipse', { cx: 118, cy: 64, rx: 8, ry: 6 }, 'pink'),
    s('circle', { cx: 120, cy: 84, r: 4 }, 'dark'),
    s('circle', { cx: 137, cy: 98, r: 4 }, 'pink'),
    s('path', { d: 'M54 128v8M104 128v8', ...SW(6) }, 'pink', { stroke: true })
  ],
  dactilar: [
    s('path', { d: 'M38 140V70a42 42 0 0 1 84 0v70z' }, 'skin'),
    s('path', { d: 'M56 136V76a24 24 0 0 1 48 0v26M66 136V78a14 14 0 0 1 28 0v40M76 136V80a4 4 0 0 1 8 0v56M46 120V72a34 34 0 0 1 68 0v54M114 72v-2', ...SW(3) }, 'brown', { accent: true, stroke: true }),
    s('path', { d: 'M38 140V70a42 42 0 0 1 84 0v70', ...SW(3) }, 'tan', { stroke: true })
  ],
  'declinación': [
    s('path', { d: 'M24 22v114h116', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M36 40l24 16 18-6 22 30 16-4 14 30', ...SW(6) }, 'red', { accent: true, stroke: true }),
    s('path', { d: 'M138 120l-4-18-14 10z' }, 'red'),
    s('path', { d: rects([[38, 100, 12, 36], [62, 108, 12, 28], [86, 116, 12, 20], [110, 124, 12, 12]]) }, 'gray')
  ],
  'descolonización': [
    s('circle', { cx: 80, cy: 110, r: 36 }, 'yellow'),
    s('path', { d: rays(80, 110, 42, 56, 9, 180).split('M').filter(Boolean).slice(0, 5).map(x => 'M' + x).join(''), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M14 136h132', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M20 64a12 12 0 0 1 0-24h14a12 12 0 0 1 0 24zM126 64a12 12 0 0 1 0-24h14a12 12 0 0 1 0 24z', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 52l8-6M114 52l-8-6', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: birds([[80, 40], [104, 26]]), ...SW(5) }, 'navy', { accent: true, stroke: true })
  ],
  descomponer: [
    s('rect', { x: 30, y: 56, width: 90, height: 72, rx: 8 }, 'gray'),
    s('rect', { x: 40, y: 66, width: 50, height: 36, rx: 4 }, 'dark'),
    s('path', { d: 'M50 70l12 14-8 6 14 10', ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 106, cy: 78, r: 7 }, 'red', { accent: true }),
    s('path', { d: ells([[70, 40, 16, 12], [92, 30, 14, 10], [110, 42, 12, 9]]) }, 'dark'),
    s('path', { d: 'M120 104q14-4 10 10t10 10', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M40 128v8M110 128v8', ...SW(6) }, 'dark', { stroke: true })
  ],
  'desinfección': [
    s('rect', { x: 26, y: 70, width: 44, height: 66, rx: 8 }, 'blue', { accent: true }),
    s('path', { d: 'M36 70V50h28l14 8v8H64v4z' }, 'white'),
    s('path', { d: 'M36 70V50h28l14 8v8H64v4', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 56l-8 30', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[90, 56], [100, 48], [100, 64], [112, 40], [112, 56], [112, 72], [124, 48], [124, 64]], 3) }, 'sky'),
    s('path', { d: burst(118, 108, 14, 9, 8) + burst(138, 86, 9, 6, 7) }, 'green'),
    s('path', { d: sparkle(96, 120, 9) }, 'yellow')
  ],
  despoblado: [
    s('path', { d: 'M14 120h132v16H14z' }, 'tan'),
    s('path', { d: 'M30 120V74l30-24 30 24v46z' }, 'gray', { accent: true }),
    s('path', { d: 'M24 78l36-32 36 32', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 84h16v14H40zM52 102h16v18H52z' }, 'dark'),
    s('path', { d: 'M38 88l20 8', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M118 120V70M118 90l-12-12M118 82l14-14M118 100l10-6', ...SW(5) }, 'brown', { stroke: true }),
    s('circle', { cx: 132, cy: 112, r: 8, ...SW(3) }, 'brown', { stroke: true })
  ],
  'detonación': [
    s('path', { d: burst(80, 82, 66, 36, 12) }, 'orange', { accent: true }),
    s('path', { d: burst(80, 82, 38, 22, 10) }, 'yellow'),
    s('circle', { cx: 80, cy: 82, r: 14 }, 'white'),
    s('path', { d: 'M20 24l10 10M140 24l-10 10M18 140l12-10M142 140l-12-10', ...SW(4) }, 'red', { stroke: true })
  ],
  diligente: [
    s('rect', { x: 18, y: 96, width: 124, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M28 106v30M132 106v30', ...SW(6) }, 'brown', { stroke: true }),
    ...person(60, 96, 'blue', { h: 34, w: 30, r: 12, accent: true }),
    s('path', { d: rects([[100, 86, 30, 10], [102, 76, 30, 10], [100, 66, 30, 10]]) }, 'white'),
    s('path', { d: rects([[100, 86, 30, 10], [102, 76, 30, 10], [100, 66, 30, 10]]), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 82l20 4', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: drop(78, 34, 4) + drop(86, 44, 3) }, 'sky')
  ],
  'déspota': [
    s('path', { d: 'M36 136V40q0-12 12-12h64q12 0 12 12v96z' }, 'red'),
    s('path', { d: 'M56 136q-4-50 24-56q28 6 24 56z' }, 'navy', { accent: true }),
    ...face(80, 62, 18, 'skin', 'frown'),
    s('path', { d: 'M66 46l4-14 10 8 10-8 4 14z' }, 'yellow'),
    s('path', { d: 'M70 54l8 3M90 54l-8 3', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M114 136V70', ...SW(5) }, 'yellow', { stroke: true })
  ],
  encarecidamente: [
    s('path', { d: 'M80 140V70q0-30-12-46q-8-4-10 6l2 44-20 30 12 36z' }, 'skin', { accent: true }),
    s('path', { d: 'M80 140V70q0-30 12-46q8-4 10 6l-2 44 20 30-12 36z' }, 'skin'),
    s('path', { d: 'M80 70v66', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M48 120l-8 18h80l-8-18', ...SW(10) }, 'blue', { stroke: true }),
    s('path', { d: heart(124, 30, 10) + heart(36, 40, 8) }, 'red'),
    s('path', { d: sparkle(80, 14, 7) }, 'yellow')
  ],
  'encía': [
    s('path', { d: 'M18 56q62-44 124 0v28H18z' }, 'pink', { accent: true }),
    s('path', { d: rects([[26, 76, 16, 28], [44, 74, 16, 32], [62, 72, 16, 36], [80, 72, 16, 36], [98, 74, 16, 32], [116, 76, 16, 28]]) }, 'white'),
    s('path', { d: rects([[26, 76, 16, 28], [44, 74, 16, 32], [62, 72, 16, 36], [80, 72, 16, 36], [98, 74, 16, 32], [116, 76, 16, 28]]), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 56q62-44 124 0', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M28 128h86', ...SW(10) }, 'blue', { stroke: true }),
    s('rect', { x: 110, y: 112, width: 28, height: 12, rx: 3 }, 'white'),
    s('path', { d: 'M114 112v-8M120 112v-8M126 112v-8M132 112v-8', ...SW(3) }, 'sky', { stroke: true })
  ],
  esbirro: [
    ...person(80, 112, 'purple', { h: 60, w: 40, r: 16 }),
    ...person(40, 136, 'dark', { h: 46, w: 30, r: 13, accent: true }),
    ...person(120, 136, 'dark', { h: 46, w: 30, r: 13 }),
    s('path', { d: rects([[30, 72, 20, 6], [110, 72, 20, 6]]) }, 'black'),
    s('path', { d: 'M70 30l20 0', ...SW(4) }, 'dark', { stroke: true })
  ],
  'espárrago': [
    s('path', { d: 'M60 140L50 34M72 140l-2-112M84 140l4-110M96 140l12-104', ...SW(10) }, 'green', { accent: true, stroke: true }),
    s('path', { d: ells([[50, 30, 6, 10], [70, 24, 6, 10], [88, 26, 6, 10], [108, 32, 6, 10]]) }, 'purple'),
    s('path', { d: 'M48 70l6-4M70 60l6-4M88 64l-6-4M104 72l-6-4', ...SW(3) }, 'mint', { stroke: true }),
    s('rect', { x: 50, y: 100, width: 56, height: 14, rx: 4 }, 'red')
  ],
  expropiar: [
    s('path', { d: 'M54 24h26v34H54z' }, 'skin'),
    s('path', { d: 'M48 50h40l-4 14H52z' }, 'skin'),
    s('path', { d: 'M40 84l30-22 30 22v34H40z' }, 'red', { accent: true }),
    s('rect', { x: 62, y: 96, width: 14, height: 22 }, 'brown'),
    s('path', { d: 'M24 136h112', ...DASH(5, '8 8') }, 'brown', { stroke: true }),
    ...person(124, 136, 'gray', { h: 30, w: 22, r: 10 }),
    s('path', { d: 'M70 118v14', ...DASH(3, '4 4') }, 'gray', { stroke: true })
  ],
  fisioterapia: [
    s('rect', { x: 14, y: 106, width: 100, height: 12, rx: 4 }, 'gray'),
    s('circle', { cx: 28, cy: 94, r: 11 }, 'skin'),
    s('rect', { x: 38, y: 88, width: 40, height: 18, rx: 8 }, 'blue', { accent: true }),
    s('path', { d: 'M76 98l24-36', ...SW(12) }, 'navy', { stroke: true }),
    ...person(124, 136, 'mint', { h: 44, w: 28 }),
    s('path', { d: 'M112 96l-10-30', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M24 118v18M104 118v18', ...SW(5) }, 'dark', { stroke: true })
  ],
  formador: [
    ...paper(56, 22, 88, 60),
    s('path', { d: 'M66 66l18-16 16 10 24-24', ...SW(4) }, 'green', { stroke: true }),
    ...person(36, 108, 'red', { h: 46, w: 28, accent: true }),
    s('path', { d: 'M48 78l14-12', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: busts([72, 100, 128], 136, 22, 22) + dots([[72, 108], [100, 108], [128, 108]], 9) }, 'gray')
  ],
  fusionar: [
    s('circle', { cx: 34, cy: 46, r: 18 }, 'blue'),
    s('circle', { cx: 126, cy: 46, r: 18 }, 'yellow'),
    s('path', { d: 'M48 60l18 22M112 60l-18 22', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 80l8 6M100 80l-8 6', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 112, r: 26 }, 'green', { accent: true }),
    s('path', { d: 'M66 104q6-10 16-10', ...SW(4) }, 'mint', { stroke: true })
  ],
  gratamente: [
    ...face(70, 80, 42, 'yellow', 'smile', { accent: true }),
    s('path', { d: 'M48 56q8-8 16 0M76 56q8-8 16 0', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 112, y: 96, width: 32, height: 30, rx: 3 }, 'red'),
    s('path', { d: 'M128 96v30M112 108h32', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: sparkle(128, 40, 12) + sparkle(24, 32, 8) + sparkle(120, 74, 6) }, 'orange')
  ],
  grilla: [
    s('rect', { x: 14, y: 22, width: 132, height: 98, rx: 8 }, 'dark'),
    s('path', { d: rects([[22, 32, 40, 16], [66, 32, 72, 16], [22, 70, 56, 16], [82, 70, 56, 16]]) }, 'blue'),
    s('path', { d: rects([[22, 51, 64, 16], [90, 51, 48, 16], [22, 89, 30, 16], [56, 89, 82, 16]]) }, 'orange', { accent: true }),
    s('path', { d: 'M62 120l-8 16h52l-8-16z' }, 'gray')
  ],
  guacho: [
    s('path', { d: ells([[48, 26, 22, 12], [72, 22, 20, 12]]) }, 'gray'),
    s('path', { d: 'M40 44l-4 10M56 44l-4 10M72 40l-4 10', ...SW(3) }, 'sky', { stroke: true }),
    s('rect', { x: 26, y: 118, width: 108, height: 18 }, 'gray'),
    s('circle', { cx: 80, cy: 78, r: 13 }, 'skin'),
    s('path', { d: 'M74 82q6-4 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 66, y: 92, width: 28, height: 26, rx: 9 }, 'orange', { accent: true }),
    s('path', { d: ells([[108, 108, 9, 10]]) + dots([[108, 94], [102, 90], [114, 90]], 5) }, 'brown')
  ],
  hiena: [
    s('path', { d: 'M38 100l-4 36M54 104v32M100 106v30M114 100v36', ...SW(7) }, 'tan', { stroke: true }),
    s('path', { d: 'M28 92q4-20 30-26q30-8 60-6q14 4 12 30q-2 18-40 18H44q-18-2-16-16z' }, 'tan', { accent: true }),
    s('path', { d: 'M94 62l20-6q18-4 26 8l4 18q-14 4-24-2z' }, 'tan'),
    s('path', { d: 'M108 52l6-12 6 14z' }, 'brown'),
    s('path', { d: dots([[50, 84], [66, 80], [82, 86], [62, 96], [90, 98], [104, 86]], 4) }, 'brown'),
    s('path', { d: 'M60 60l40 4', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M128 80l16 4', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 128, cy: 66, r: 3 }, 'dark')
  ],
  hispanohablante: [
    ...person(44, 136, 'red', { h: 48, w: 30, accent: true }),
    s('path', { d: bubble(66, 18, 76, 62) }, 'cream'),
    s('circle', { cx: 104, cy: 46, r: 22 }, 'blue'),
    s('path', { d: 'M92 32q10 4 6 14t6 12M110 40q8 0 10 10q-4 8-10 4z' }, 'green'),
    s('path', { d: bubble(66, 18, 76, 62), ...SW(3) }, 'orange', { stroke: true })
  ],
  'incautación': [
    s('path', { d: rects([[18, 78, 60, 58], [82, 78, 60, 58], [50, 22, 60, 56]]) }, 'tan'),
    s('path', { d: 'M18 78l60 58M78 78l-60 58M82 78l60 58M142 78l-60 58', ...SW(5) }, 'yellow', { accent: true, stroke: true }),
    s('path', { d: 'M50 22h60v56H50zM18 78h60v58H18zM82 78h60v58H82z', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: star(80, 50, 18) }, 'navy'),
    s('circle', { cx: 80, cy: 50, r: 5 }, 'yellow')
  ],
  inconsciencia: [
    s('rect', { x: 50, y: 108, width: 82, height: 24, rx: 12 }, 'blue', { accent: true }),
    s('circle', { cx: 36, cy: 112, r: 18 }, 'skin'),
    s('path', { d: spiral(26, 106) + spiral(40, 106), ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: star(28, 70, 9) + star(52, 60, 7) + star(72, 76, 8) }, 'yellow'),
    s('path', { d: ells([[40, 72, 30, 8]]), ...DASH(2, '4 4') }, 'gray', { stroke: true }),
    ground(138)
  ],
  inflable: [
    s('circle', { cx: 70, cy: 86, r: 48 }, 'orange', { accent: true }),
    s('path', { d: wedge(70, 86, 48, -60, -20) + wedge(70, 86, 48, 60, 100) + wedge(70, 86, 48, 180, 220) }, 'white'),
    s('circle', { cx: 70, cy: 86, r: 22 }, 'white'),
    s('path', { d: ring(70, 86, 22) + ring(70, 86, 48), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M114 70q20-6 24 24v40', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 128, y: 112, width: 18, height: 26, rx: 3 }, 'blue')
  ],
  infundir: [
    s('path', { d: 'M30 24h44l6 10-10 30H38L24 40z' }, 'gray'),
    s('path', { d: 'M80 34q16 20 0 76', ...SW(8) }, 'yellow', { stroke: true }),
    s('path', { d: heart(80, 112, 22) }, 'red', { accent: true }),
    s('path', { d: heart(80, 106, 10) }, 'yellow'),
    s('path', { d: sparkle(122, 70, 8) + sparkle(40, 96, 7) }, 'orange')
  ],
  inmejorable: [
    s('path', { d: 'M62 18l-10 50h20l8-30 8 30h20l-10-50z' }, 'blue'),
    s('circle', { cx: 80, cy: 92, r: 30 }, 'yellow', { accent: true }),
    s('path', { d: star(80, 92, 16) }, 'orange'),
    s('path', { d: star(24, 136, 9) + star(52, 136, 9) + star(80, 136, 9) + star(108, 136, 9) + star(136, 136, 9) }, 'yellow'),
    s('path', { d: ring(80, 92, 30), ...SW(3) }, 'orange', { stroke: true })
  ],
  insecticida: [
    s('rect', { x: 22, y: 58, width: 40, height: 80, rx: 8 }, 'red', { accent: true }),
    s('rect', { x: 32, y: 44, width: 20, height: 14, rx: 3 }, 'gray'),
    s('rect', { x: 50, y: 46, width: 10, height: 6 }, 'dark'),
    s('path', { d: dots([[72, 46], [82, 40], [82, 54], [94, 34], [94, 48], [94, 62]], 3) }, 'gray'),
    s('path', { d: 'M96 118l-6 14M110 116v16M124 118l6 14M96 108l-10-6', ...SW(3) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 110, cy: 112, rx: 20, ry: 12 }, 'dark'),
    s('rect', { x: 26, y: 80, width: 32, height: 20 }, 'white')
  ],
  integrador: [
    s('circle', { cx: 80, cy: 80, r: 40, ...SW(8) }, 'orange', { accent: true, stroke: true }),
    s('path', { d: dots(around(80, 80, 56, 6, -90), 10) }, 'skin'),
    s('path', { d: dots(around(80, 80, 40, 6, -90).slice(0, 2), 10) }, 'blue'),
    s('path', { d: dots(around(80, 80, 40, 6, -90).slice(2, 4), 10) }, 'green'),
    s('path', { d: dots(around(80, 80, 40, 6, -90).slice(4, 6), 10) }, 'purple'),
    s('path', { d: heart(80, 84, 12) }, 'red')
  ],
  inteligentemente: [
    ...person(80, 136, 'blue', { h: 40, w: 30, r: 13 }),
    s('circle', { cx: 80, cy: 40, r: 18 }, 'yellow', { accent: true }),
    s('rect', { x: 72, y: 54, width: 16, height: 10, rx: 2 }, 'gray'),
    s('path', { d: rays(80, 40, 24, 34, 7, 180).split('M').filter(Boolean).filter((_, i) => i < 7).map(x => 'M' + x).join(''), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M74 42l6 6 6-6', ...SW(2) }, 'orange', { stroke: true })
  ],
  inversamente: [
    s('path', { d: 'M24 18v118h120', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M38 24q8 70 98 98', ...SW(6) }, 'red', { accent: true, stroke: true }),
    s('path', { d: 'M48 76V40M40 50l8-10 8 10', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M112 76v36M104 102l8 10 8-10', ...SW(4) }, 'orange', { stroke: true })
  ],
  invisibilidad: [
    s('circle', { cx: 80, cy: 52, r: 18, ...DASH(4) }, 'gray', { stroke: true }),
    s('rect', { x: 58, y: 76, width: 44, height: 58, rx: 14, ...DASH(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 34h44l-6-22H64z' }, 'purple', { accent: true }),
    s('rect', { x: 52, y: 32, width: 56, height: 6, rx: 3 }, 'purple'),
    s('path', { d: sparkle(126, 70, 10) + sparkle(34, 96, 8) + sparkle(120, 118, 6) }, 'yellow'),
    ground(140)
  ],
  'islandés': [
    backdrop('navy'),
    s('path', { d: 'M14 46q30-16 66 0t66-6', ...SW(8) }, 'green', { stroke: true }),
    s('path', { d: 'M14 136l40-62 18 20 22-36 52 78z' }, 'white'),
    s('path', { d: 'M54 74l-10 16 10-4 8 6 10-2zM94 58l-12 20 12-4 12 6z' }, 'sky'),
    s('path', { d: 'M120 136q2-30 2-50', ...SW(6) }, 'sky', { accent: true, stroke: true }),
    s('path', { d: ells([[122, 82, 10, 8]]) }, 'sky')
  ],
  jalea: [
    s('rect', { x: 40, y: 50, width: 80, height: 86, rx: 12 }, 'purple', { accent: true }),
    s('rect', { x: 36, y: 30, width: 88, height: 22, rx: 4 }, 'red'),
    s('rect', { x: 52, y: 76, width: 56, height: 34, rx: 4 }, 'cream'),
    s('path', { d: 'M66 90a8 8 0 0 1 14 0a8 8 0 0 1 14 0', ...SW(4) }, 'purple', { stroke: true }),
    s('path', { d: 'M48 62v20', ...SW(4) }, 'pink', { stroke: true })
  ],
  juliano: [
    s('rect', { x: 34, y: 40, width: 92, height: 92, rx: 6 }, 'white'),
    outline({ x: 34, y: 40, width: 92, height: 92, rx: 6 }),
    s('rect', { x: 34, y: 40, width: 92, height: 20 }, 'red', { accent: true }),
    s('path', { d: grid(44, 70, 5, 4, 10, 8, 15, 14) }, 'gray'),
    s('path', { d: laurel(80, 86, 66, 16, 5) }, 'green'),
    s('path', { d: 'M58 34v12M102 34v12', ...SW(5) }, 'dark', { stroke: true })
  ],
  juntamente: [
    ...person(58, 136, 'blue', { h: 46, w: 28 }),
    ...person(102, 136, 'orange', { h: 46, w: 28, accent: true }),
    s('path', { d: 'M70 106q10 8 20 0', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 40, 12) }, 'red'),
    ground()
  ],
  kamikaze: [
    s('rect', { x: 26, y: 14, width: 108, height: 132 }, 'gray'),
    s('path', { d: 'M80 14v132', ...DASH(4, '12 10') }, 'white', { stroke: true }),
    s('path', { d: 'M44 72V40M36 50l8-10 8 10M116 120V88M108 98l8-10 8 10', ...SW(4) }, 'white', { stroke: true }),
    s('rect', { x: 98, y: 28, width: 32, height: 50, rx: 8 }, 'red', { accent: true }),
    s('rect', { x: 102, y: 60, width: 24, height: 12, rx: 3 }, 'sky'),
    s('path', { d: 'M108 82l-4 8M120 82l4 8', ...SW(4) }, 'yellow', { stroke: true }),
    s('rect', { x: 30, y: 82, width: 28, height: 44, rx: 8 }, 'blue')
  ],
  kelvin: [
    s('rect', { x: 50, y: 18, width: 24, height: 96, rx: 12 }, 'white'),
    s('rect', { x: 50, y: 18, width: 24, height: 96, rx: 12, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 112V90', ...SW(10) }, 'blue', { stroke: true }),
    s('circle', { cx: 62, cy: 122, r: 18 }, 'blue', { accent: true }),
    s('path', { d: 'M78 36h8M78 52h8M78 68h8M78 84h8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M118 70v40M100 80l36 20M100 100l36-20', ...SW(5) }, 'sky', { stroke: true })
  ],
  laborable: [
    s('rect', { x: 14, y: 44, width: 132, height: 52, rx: 6 }, 'white'),
    outline({ x: 14, y: 44, width: 132, height: 52, rx: 6 }),
    s('path', { d: rects([[20, 52, 14, 36], [38, 52, 14, 36], [56, 52, 14, 36], [74, 52, 14, 36], [92, 52, 14, 36]]) }, 'blue', { accent: true }),
    s('path', { d: rects([[110, 52, 14, 36], [128, 52, 12, 36]]) }, 'gray'),
    s('rect', { x: 52, y: 108, width: 56, height: 34, rx: 5 }, 'brown'),
    s('path', { d: 'M70 108v-6h20v6', ...SW(4) }, 'dark', { stroke: true })
  ],
  labranza: [
    backdrop('sky'),
    s('path', { d: 'M14 80h132v54q0 12-12 12H26q-12 0-12-12z' }, 'brown'),
    s('path', { d: 'M24 96q40-6 112 0M20 114q60-8 120 0M18 132q62-8 124 0', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M54 34l40 46M86 76l20 6-8 8z', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 30l14-6', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: leaflet(120, 78, -60, 18, 6) + leaflet(120, 78, -120, 18, 6) }, 'green', { accent: true })
  ],
  laicismo: [
    s('path', { d: 'M18 136V74l22-18 22 18v62zM32 58V30h16v28z' }, 'tan'),
    s('path', { d: 'M28 30l12-14 12 14z' }, 'brown'),
    s('path', { d: 'M98 66l24-20 24 20z' }, 'gray'),
    s('path', { d: rects([[100, 70, 8, 52], [118, 70, 8, 52], [136, 70, 8, 52], [96, 122, 50, 14]]) }, 'gray'),
    s('rect', { x: 72, y: 34, width: 14, height: 102 }, 'blue', { accent: true }),
    s('path', { d: 'M74 50h10M74 70h10M74 90h10M74 110h10', ...SW(2) }, 'navy', { stroke: true }),
    s('path', { d: 'M32 136v-24a8 8 0 0 1 16 0v24z' }, 'brown')
  ],
  lastra: [
    s('path', { d: 'M14 70h132v66H14z' }, 'green'),
    s('path', { d: 'M24 110l50-10 10 22-56 10z' }, 'gray', { accent: true }),
    s('path', { d: 'M86 96l44-6 8 20-48 6zM50 80l40-6 6 14-42 6z' }, 'tan'),
    s('path', { d: 'M24 110l50-10 10 22-56 10zM86 96l44-6 8 20-48 6zM50 80l40-6 6 14-42 6z', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 70l26-36 22 36zM96 70l24-28 22 28z' }, 'mint')
  ],
  lechuza: [
    backdrop('navy'),
    s('path', { d: 'M40 76q0 60 40 60t40-60q-8-36-40-36t-40 36z' }, 'tan'),
    s('path', { d: 'M80 54q-16-14-34-4q-4 30 12 44q12 10 22 2q10 8 22-2q16-14 12-44q-18-10-34 4z' }, 'white', { accent: true }),
    s('path', { d: dots([[64, 72], [96, 72]], 7) }, 'dark'),
    s('path', { d: 'M80 80l-4 10h8z' }, 'tan'),
    s('path', { d: 'M54 112l6 6M76 116v8M98 112l-6 6', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M26 138h108', ...SW(6) }, 'brown', { stroke: true })
  ],
  legible: [
    ...paper(22, 22, 80, 112),
    s('path', { d: 'M34 42h56M34 58h50M34 74h56M34 90h40M34 106h52', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 112q20-24 44 0q-24 24-44 0z' }, 'white'),
    s('path', { d: 'M100 112q20-24 44 0q-24 24-44 0z', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 122, cy: 112, r: 8 }, 'blue', { accent: true })
  ],
  limitante: [
    s('path', { d: 'M108 22v114', ...SW(8) }, 'red', { accent: true, stroke: true }),
    s('path', { d: 'M108 36h22M108 66h22M108 96h22', ...DASH(8, '6 6') }, 'red', { stroke: true }),
    s('path', { d: 'M22 80h60M70 66l14 14-14 14', ...SW(7) }, 'blue', { stroke: true }),
    s('path', { d: 'M92 70l8-6M92 90l8 6', ...SW(3) }, 'gray', { stroke: true }),
    ground()
  ],
  locamente: [
    ...face(80, 86, 44, 'yellow', 'smile'),
    s('path', { d: heart(64, 78, 10) + heart(96, 78, 10) }, 'red', { accent: true }),
    s('path', { d: heart(30, 34, 9) + heart(130, 30, 11) + heart(134, 122, 8) }, 'pink'),
    s('path', { d: 'M18 72q-6-30 20-48M142 70q6-26-14-42', ...DASH(3, '4 6') }, 'pink', { stroke: true })
  ],
  magneto: [
    s('path', { d: 'M36 120V70a36 36 0 0 1 72 0v50', ...SW(26, { 'stroke-linecap': 'butt' }) }, 'red', { accent: true, stroke: true }),
    s('path', { d: rects([[23, 116, 26, 20], [95, 116, 26, 20]]) }, 'gray'),
    s('path', { d: 'M130 30l-12 22h12l-10 24', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M28 34l10 10M44 22l4 12', ...SW(4) }, 'orange', { stroke: true })
  ],
  'malagueño': [
    backdrop('sky'),
    s('circle', { cx: 116, cy: 40, r: 16 }, 'yellow'),
    s('path', { d: 'M14 90q16-6 33 0t33 0 33 0 33 0v22H14z' }, 'blue'),
    s('path', { d: 'M14 108q66-10 132 0v26q0 12-12 12H26q-12 0-12-12z' }, 'tan'),
    s('path', { d: 'M46 74q22-30 44 0z' }, 'red', { accent: true }),
    s('path', { d: 'M68 74v50', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 30h20', ...SW(5) }, 'white', { stroke: true })
  ],
  maleante: [
    s('circle', { cx: 64, cy: 46, r: 18 }, 'skin'),
    s('rect', { x: 46, y: 38, width: 36, height: 10, rx: 5 }, 'black', { accent: true }),
    s('path', { d: 'M46 34q18-24 36 0z' }, 'dark'),
    s('rect', { x: 46, y: 66, width: 36, height: 70, rx: 12 }, 'gray'),
    s('path', { d: 'M48 82h32M48 98h32M48 114h32', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 92q-6 46 20 46t20-46z' }, 'tan'),
    s('path', { d: 'M80 80l22 12', ...SW(7) }, 'gray', { stroke: true })
  ],
  'malformación': [
    s('circle', { cx: 50, cy: 80, r: 30, ...DASH(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 80h14M94 72l8 8-8 8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M112 52q30-6 28 24q-2 20-18 40q-10 6-14-12q-16-4-10-24q2-24 14-28z' }, 'purple', { accent: true }),
    s('path', { d: 'M114 70q6 4 0 10', ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 50, cy: 80, r: 24 }, 'mint')
  ],
  'mampostería': [
    s('rect', { x: 18, y: 30, width: 124, height: 106, rx: 4 }, 'cream'),
    s('path', { d: ells([[38, 46, 16, 12], [74, 44, 18, 12], [114, 46, 22, 13], [34, 76, 14, 14], [68, 78, 18, 14], [110, 76, 24, 14], [42, 112, 20, 18], [88, 112, 22, 18], [128, 112, 12, 18]]) }, 'gray', { accent: true }),
    s('path', { d: ells([[38, 46, 16, 12], [74, 44, 18, 12], [114, 46, 22, 13], [34, 76, 14, 14], [68, 78, 18, 14], [110, 76, 24, 14], [42, 112, 20, 18], [88, 112, 22, 18], [128, 112, 12, 18]]), ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 18l26 0 4 10h-34z' }, 'gray'),
    s('path', { d: 'M120 18v-8h10', ...SW(4) }, 'brown', { stroke: true })
  ],
  menopausia: [
    ...lady(64, 136, 'purple', { accent: true }),
    s('path', { d: 'M56 70h16', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: wedge(104, 76, 26, 200, 290) }, 'pink'),
    s('path', { d: 'M104 76l-24-8', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M36 40q-6-8 0-14t0-14M92 34q-6-8 0-14t0-14', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: drop(82, 66, 3) }, 'sky')
  ],
  'mesón': [
    s('path', { d: 'M20 66l60-38 60 38z' }, 'red'),
    s('rect', { x: 28, y: 66, width: 104, height: 70 }, 'cream'),
    s('rect', { x: 66, y: 94, width: 28, height: 42, rx: 2 }, 'brown', { accent: true }),
    s('path', { d: rects([[38, 82, 18, 16], [104, 82, 18, 16]]) }, 'sky'),
    s('path', { d: 'M132 76h12v8', ...SW(3) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 144, cy: 92, rx: 8, ry: 9 }, 'brown'),
    s('path', { d: 'M28 136v-62', ...SW(5) }, 'brown', { stroke: true })
  ],
  migar: [
    s('path', { d: 'M24 96h112q-4 40-56 40t-56-40z' }, 'blue'),
    s('ellipse', { cx: 80, cy: 96, rx: 56, ry: 10 }, 'cream'),
    s('path', { d: 'M40 54q0-20 22-18l10 4 2 22-30 4z' }, 'tan', { accent: true }),
    s('path', { d: 'M84 40l26-4q16 4 10 22l-34 4z' }, 'tan'),
    s('path', { d: ells([[72, 76, 5, 4], [86, 72, 4, 3], [80, 88, 6, 4], [62, 94, 5, 3], [96, 94, 6, 3]]) }, 'tan'),
    s('path', { d: 'M40 54q0-20 22-18l10 4 2 22-30 4zM84 40l26-4q16 4 10 22l-34 4z', ...SW(2) }, 'brown', { stroke: true })
  ],
  mitra: [
    s('path', { d: 'M48 136V60q0-30 32-46q32 16 32 46v76z' }, 'white'),
    s('path', { d: 'M48 136V60q0-30 32-46q32 16 32 46v76z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 16v120M48 112h64', ...SW(8) }, 'yellow', { accent: true, stroke: true }),
    s('path', { d: 'M58 136l-6 10M102 136l6 10', ...SW(6) }, 'red', { stroke: true }),
    s('circle', { cx: 80, cy: 70, r: 6 }, 'red')
  ],
  'mormón': [
    s('rect', { x: 30, y: 82, width: 100, height: 54 }, 'white'),
    s('path', { d: 'M30 82h100v54H30zM66 82V50h28v32', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 66, y: 50, width: 28, height: 32 }, 'white'),
    s('path', { d: 'M70 50l10-34 10 34z' }, 'cream'),
    s('circle', { cx: 80, cy: 14, r: 4 }, 'yellow', { accent: true }),
    s('path', { d: rects([[40, 96, 10, 20], [60, 96, 10, 20], [90, 96, 10, 20], [110, 96, 10, 20]]) }, 'sky'),
    s('path', { d: 'M74 136v-14a6 6 0 0 1 12 0v14z' }, 'brown'),
    ground(138)
  ],
  neurosis: [
    ...person(80, 136, 'blue', { h: 42, w: 30, r: 14 }),
    s('path', { d: 'M44 46q10-30 36-20t30 10q-10 22-34 6t-20 18q24 10 44-4q14-14 0-20', ...SW(4) }, 'red', { accent: true, stroke: true }),
    s('path', { d: 'M76 72l4-4M84 72l-4-4', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: drop(100, 74, 4) + drop(60, 70, 3) }, 'sky'),
    s('path', { d: burst(132, 30, 8, 4, 6) + burst(28, 30, 7, 3, 6) }, 'orange')
  ],
  nodriza: [
    ...lady(70, 136, 'mint'),
    s('ellipse', { cx: 72, cy: 92, rx: 20, ry: 12 }, 'cream', { accent: true }),
    s('circle', { cx: 86, cy: 86, r: 8 }, 'skin'),
    s('path', { d: 'M54 92q16 16 34 6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M118 64h16l2 50h-20z' }, 'white'),
    s('path', { d: 'M118 64h16l2 50h-20zM126 52v12', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: heart(124, 30, 9) }, 'pink')
  ],
  parafrasear: [
    s('path', { d: bubble(14, 22, 64, 48) }, 'blue', { accent: true }),
    s('path', { d: 'M24 38h44M24 50h30', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: bubble(82, 74, 64, 48) }, 'orange'),
    s('path', { d: 'M92 88h20M118 88h18M92 100h40', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M86 30q30 0 30 34M108 56l8 10 8-10', ...SW(4) }, 'gray', { stroke: true })
  ],
  pegajoso: [
    s('path', { d: 'M30 40h40v16H30zM90 112h40v16H90z' }, 'skin'),
    s('path', { d: 'M40 56q2 30 30 40t24 16M56 56q4 24 22 34t24 22M66 56q14 30 40 56', ...SW(6) }, 'pink', { accent: true, stroke: true }),
    s('path', { d: ells([[50, 30, 22, 14], [110, 140, 22, 10]]) }, 'skin'),
    s('path', { d: drop(48, 84, 6) }, 'pink')
  ],
  percha: [
    s('path', { d: 'M80 36a10 10 0 1 1 10-10q0 8-10 14v8', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 48L20 92h120z', ...SW(7) }, 'brown', { accent: true, stroke: true }),
    s('path', { d: 'M24 94q14 6 30 6h52q16 0 30-6l2 46H22z' }, 'sky'),
    s('path', { d: 'M70 100l10 12 10-12', ...SW(3) }, 'blue', { stroke: true })
  ],
  peritaje: [
    s('rect', { x: 14, y: 30, width: 70, height: 106 }, 'tan'),
    s('path', { d: 'M48 30l-8 30 12 18-10 24 8 34', ...SW(4) }, 'dark', { stroke: true }),
    ...person(118, 136, 'orange', { h: 46, w: 28 }),
    s('path', { d: 'M104 66a14 14 0 0 1 28 0z' }, 'yellow'),
    s('rect', { x: 88, y: 84, width: 22, height: 30, rx: 2 }, 'white', { accent: true }),
    outline({ x: 88, y: 84, width: 22, height: 30, rx: 2 }, 'dark', 2),
    s('path', { d: 'M93 94l3 3 6-6M93 104h12', ...SW(2) }, 'green', { stroke: true })
  ],
  peto: [
    s('path', { d: 'M54 18l4 40M106 18l-4 40', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M54 54h52v32h10l4 54H92l-12-36-12 36H40l4-54h10z' }, 'blue', { accent: true }),
    s('rect', { x: 66, y: 64, width: 28, height: 18, rx: 2 }, 'navy'),
    s('path', { d: dots([[58, 58], [102, 58]], 4) }, 'yellow'),
    s('path', { d: 'M80 104v34', ...SW(2) }, 'navy', { stroke: true })
  ],
  'petroquímica': [
    s('path', { d: rects([[24, 40, 20, 96], [52, 60, 18, 76]]) }, 'gray'),
    s('path', { d: 'M24 64h20M24 90h20M52 84h18M52 108h18', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 136V56', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 54q-8-10 0-20q8 10 0 20z' }, 'orange'),
    s('path', { d: 'M110 72h16v24l16 34q2 6-4 6h-40q-6 0-4-6l16-34z' }, 'sky'),
    s('path', { d: 'M100 114h52l4 16q0 6-6 6h-48q-6 0-6-6z' }, 'black', { accent: true }),
    ground(138)
  ],
  poblar: [
    s('path', { d: 'M14 116q66-16 132 0v20H14z' }, 'green'),
    s('path', { d: 'M22 112V86l16-14 16 14v26zM104 106V76l18-16 18 16v30z' }, 'cream'),
    s('path', { d: 'M18 88l20-18 20 18zM100 78l22-20 22 20z' }, 'red', { accent: true }),
    s('path', { d: 'M62 112V58l22-20 22 20v54z' }, 'tan'),
    s('path', { d: 'M58 60l26-24 26 24z' }, 'brown'),
    s('path', { d: rects([[34, 96, 8, 16], [78, 92, 12, 20], [116, 88, 10, 18]]) }, 'dark'),
    s('path', { d: dots([[54, 128], [96, 126]], 5) }, 'skin')
  ],
  pocho: [
    ...person(36, 136, 'orange', { h: 48, w: 28, accent: true }),
    s('path', { d: bubble(56, 22, 60, 44) }, 'red'),
    s('path', { d: bubble(86, 46, 60, 44) }, 'blue'),
    s('path', { d: 'M66 36h30M96 62h36M96 74h24', ...SW(4) }, 'white', { stroke: true })
  ],
  precipitar: [
    s('path', { d: 'M14 46h50v100H14z' }, 'brown'),
    s('path', { d: 'M14 46h50', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M92 82l20-8 16 10 2 20-18 10-20-8z' }, 'gray', { accent: true }),
    s('path', { d: 'M90 50v18M108 46v18M124 54v18', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: ells([[110, 138, 30, 6]]) }, 'gray'),
    s('path', { d: dots([[72, 52], [80, 66]], 4) }, 'brown')
  ],
  puchero: [
    s('path', { d: 'M40 30q-6-10 0-18M80 28q-6-10 0-18M120 30q-6-10 0-18', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M26 62h108v34q0 40-54 40T26 96z' }, 'orange', { accent: true }),
    s('ellipse', { cx: 80, cy: 62, rx: 54, ry: 10 }, 'brown'),
    s('path', { d: ells([[60, 60, 10, 5], [96, 60, 12, 5]]) }, 'red'),
    s('path', { d: 'M74 58l12-6', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M26 74h-12M134 74h12', ...SW(8) }, 'brown', { stroke: true })
  ],
  'púnico': [
    s('path', { d: 'M40 104v32M58 108v28M96 108v28M114 104v32', ...SW(12) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 76, cy: 90, rx: 46, ry: 30 }, 'gray'),
    s('path', { d: 'M108 72q30-6 30 30q0 22 6 32', ...SW(10) }, 'gray', { stroke: true }),
    s('path', { d: 'M56 62h48v40H56z' }, 'red', { accent: true }),
    s('path', { d: 'M104 82l14 8', ...SW(4) }, 'white', { stroke: true }),
    s('circle', { cx: 114, cy: 76, r: 3 }, 'dark'),
    s('circle', { cx: 80, cy: 50, r: 12 }, 'yellow')
  ],
  quincenal: [
    s('rect', { x: 22, y: 30, width: 116, height: 106, rx: 6 }, 'white'),
    outline({ x: 22, y: 30, width: 116, height: 106, rx: 6 }),
    s('rect', { x: 22, y: 30, width: 116, height: 20 }, 'blue'),
    s('path', { d: grid(30, 58, 7, 4, 10, 10, 15, 19) }, 'gray'),
    s('path', { d: ring(35, 63, 10) + ring(50, 120, 10), ...SW(4) }, 'red', { accent: true, stroke: true }),
    s('path', { d: 'M54 24v12M106 24v12', ...SW(5) }, 'dark', { stroke: true })
  ],
  radioterapia: [
    s('path', { d: 'M20 22h80v26H72v12H48V48H20z' }, 'gray'),
    s('path', { d: 'M52 60h16l20 46H32z' }, 'yellow', { accent: true }),
    s('rect', { x: 16, y: 106, width: 128, height: 10, rx: 4 }, 'gray'),
    s('circle', { cx: 120, cy: 96, r: 10 }, 'skin'),
    s('rect', { x: 34, y: 92, width: 78, height: 14, rx: 6 }, 'mint'),
    s('path', { d: 'M40 116v20M120 116v20', ...SW(6) }, 'dark', { stroke: true })
  ],
  redondear: [
    s('rect', { x: 14, y: 54, width: 50, height: 50, rx: 2 }, 'blue'),
    s('path', { d: 'M72 80h16M82 72l8 8-8 8', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 120, cy: 80, r: 26 }, 'orange', { accent: true }),
    s('path', { d: 'M18 58l8 0M18 58v8M60 100h-8M60 100v-8', ...SW(3) }, 'navy', { stroke: true })
  ],
  reflujo: [
    s('path', { d: 'M74 18v40', ...SW(16) }, 'pink', { stroke: true }),
    s('path', { d: 'M74 54q-40 10-38 50q4 34 46 32q40-2 44-36q4-40-30-44z' }, 'pink'),
    s('path', { d: 'M56 112q24 10 50-6', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M74 100V24M64 36l10-12 10 12', ...SW(6) }, 'orange', { accent: true, stroke: true }),
    s('path', { d: 'M110 26q8 6 0 12t0 12', ...SW(3) }, 'red', { stroke: true })
  ],
  regulatorio: [
    ...paper(22, 26, 70, 96),
    s('path', { d: 'M32 44h50M32 58h50M32 72h40M32 86h50', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 80l20-20 12 12-20 20z' }, 'brown', { accent: true }),
    s('path', { d: 'M114 80l18 18', ...SW(7) }, 'brown', { stroke: true }),
    s('rect', { x: 90, y: 118, width: 50, height: 14, rx: 3 }, 'dark'),
    s('circle', { cx: 74, cy: 106, r: 9 }, 'red')
  ],
  'reincorporación': [
    s('rect', { x: 86, y: 26, width: 54, height: 110 }, 'brown'),
    s('rect', { x: 94, y: 34, width: 40, height: 102 }, 'cream'),
    ...person(70, 136, 'blue', { h: 46, w: 28, accent: true }),
    s('rect', { x: 44, y: 106, width: 22, height: 18, rx: 3 }, 'dark'),
    s('path', { d: 'M38 46q-20 20 6 40', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M36 84l10 4-2-12z' }, 'orange')
  ],
  reintegro: [
    s('rect', { x: 26, y: 72, width: 92, height: 62, rx: 8 }, 'brown', { accent: true }),
    s('rect', { x: 92, y: 92, width: 34, height: 22, rx: 6 }, 'tan'),
    s('circle', { cx: 112, cy: 103, r: 4 }, 'brown'),
    s('circle', { cx: 60, cy: 38, r: 16 }, 'yellow'),
    s('path', { d: 'M86 26q36 4 30 40M108 58l8 10 8-10', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M60 58v8', ...SW(4) }, 'yellow', { stroke: true })
  ],
  repelente: [
    s('rect', { x: 22, y: 64, width: 36, height: 72, rx: 8 }, 'green', { accent: true }),
    s('rect', { x: 30, y: 48, width: 20, height: 16, rx: 3 }, 'white'),
    outline({ x: 30, y: 48, width: 20, height: 16, rx: 3 }),
    s('path', { d: 'M74 30q30 50 0 100', ...DASH(5, '4 8') }, 'mint', { stroke: true }),
    s('ellipse', { cx: 118, cy: 72, rx: 12, ry: 6 }, 'dark'),
    s('path', { d: 'M110 70l-12-10M122 66l8-12M112 78l-6 10M124 78l6 10M106 72l-10 2', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M130 84l10 8', ...SW(3) }, 'red', { stroke: true })
  ],
  replantear: [
    ...paper(50, 50, 60, 60),
    s('path', { d: 'M60 92l14-14 10 8 16-18', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M30 70a52 52 0 0 1 90-36M130 90a52 52 0 0 1-90 36', ...SW(6) }, 'orange', { accent: true, stroke: true }),
    s('path', { d: 'M112 22l12 14-16 4zM48 138l-12-14 16-4z' }, 'orange')
  ],
  repudiar: [
    s('path', { d: 'M48 50h44q10 0 10 10v34q0 10-10 10H64q-16 0-16-16z' }, 'skin', { accent: true }),
    s('path', { d: 'M66 104v26a10 10 0 0 0 20 0v-26z' }, 'skin'),
    s('path', { d: 'M62 62h34M62 76h34M62 90h34', ...SW(2) }, 'tan', { stroke: true }),
    s('rect', { x: 34, y: 44, width: 18, height: 66, rx: 4 }, 'red'),
    s('path', { d: 'M118 40l20 20M138 40l-20 20', ...SW(6) }, 'red', { stroke: true })
  ],
  resplandeciente: [
    s('path', { d: rays(80, 80, 40, 66, 16), ...SW(5) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 34 }, 'orange'),
    s('path', { d: sparkle(80, 80, 30) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(80, 80, 10) }, 'white'),
    s('path', { d: sparkle(24, 24, 8) + sparkle(136, 136, 8) }, 'orange')
  ],
  rotativo: [
    s('path', { d: 'M14 84h86', ...SW(12) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 84h86', ...SW(8) }, 'white', { stroke: true }),
    s('circle', { cx: 52, cy: 62, r: 20 }, 'gray', { accent: true }),
    s('circle', { cx: 52, cy: 106, r: 20 }, 'gray'),
    s('circle', { cx: 52, cy: 62, r: 6 }, 'dark'),
    s('circle', { cx: 52, cy: 106, r: 6 }, 'dark'),
    s('rect', { x: 100, y: 54, width: 44, height: 56, rx: 2 }, 'white'),
    outline({ x: 100, y: 54, width: 44, height: 56, rx: 2 }),
    s('path', { d: 'M106 64h32M106 74h14M124 74h14M106 84h14M124 84h14M106 94h32', ...SW(3) }, 'gray', { stroke: true })
  ],
  sanguinario: [
    s('path', { d: 'M80 50q-20-26-44-26q-10 16-6 30q-14 6-16 26q22-10 34 0q8 18 32 30q24-12 32-30q12-10 34 0q-2-20-16-26q4-14-6-30q-24 0-44 26z' }, 'dark', { accent: true }),
    s('path', { d: 'M70 56l4 10 4-10zM82 56l4 10 4-10z' }, 'white'),
    s('path', { d: dots([[72, 48], [88, 48]], 3) }, 'red'),
    s('path', { d: drop(80, 128, 6) + drop(56, 116, 4) + drop(104, 120, 5) }, 'red')
  ],
  saturnino: [
    s('circle', { cx: 80, cy: 86, r: 34 }, 'tan', { accent: true }),
    s('ellipse', { cx: 80, cy: 86, rx: 62, ry: 14, transform: 'rotate(-15 80 86)', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M56 76h48M52 96h56', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: ells([[48, 28, 20, 12], [72, 24, 18, 12]]) }, 'gray'),
    s('path', { d: 'M44 46l-4 10M60 44l-4 10M76 42l-4 10', ...SW(3) }, 'sky', { stroke: true })
  ],
  'segmentación': [
    s('path', { d: wedge(74, 86, 50, -90, 40) }, 'blue', { accent: true }),
    s('path', { d: wedge(80, 92, 50, 40, 150) }, 'orange'),
    s('path', { d: wedge(70, 90, 50, 150, 230) }, 'green'),
    s('path', { d: wedge(72, 82, 50, 230, 270) }, 'purple')
  ],
  sombrilla: [
    s('circle', { cx: 132, cy: 28, r: 12 }, 'yellow'),
    ...lady(64, 136, 'blue'),
    s('path', { d: 'M30 52q40-50 80 0q-10-6-20 0q-10-6-20 0q-10-6-20 0q-10-6-20 0z' }, 'pink', { accent: true }),
    s('path', { d: 'M70 30v56', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M76 84l-6 4', ...SW(6) }, 'skin', { stroke: true })
  ],
  sorpresivo: [
    s('rect', { x: 40, y: 92, width: 80, height: 44, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M40 92l-16-18M120 92l16-18', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M80 92q-14-6 0-12t0-12 0-12', ...SW(5) }, 'gray', { stroke: true }),
    ...face(80, 40, 20, 'yellow', 'smile'),
    s('path', { d: 'M36 30l-12-8M124 30l12-8M40 52H26M120 52h14', ...SW(4) }, 'orange', { stroke: true })
  ],
  subcontinente: [
    backdrop('sky'),
    s('path', { d: 'M18 36q30-12 70-6q40-4 56 10v30q-20 8-30 4q-16 30-30 62q-14-30-28-58q-20-8-38-6z' }, 'green'),
    s('path', { d: 'M56 72q20-6 52 2q-12 26-24 58q-12-30-28-60z' }, 'orange', { accent: true }),
    s('path', { d: ells([[126, 110, 6, 9]]) }, 'green')
  ],
  'subdivisión': [
    s('rect', { x: 20, y: 20, width: 120, height: 120, rx: 4 }, 'mint'),
    s('rect', { x: 80, y: 80, width: 60, height: 60 }, 'orange', { accent: true }),
    s('path', { d: rects([[80, 80, 30, 30], [110, 110, 30, 30]]) }, 'yellow'),
    s('path', { d: 'M80 20v120M20 80h120', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M110 80v60M80 110h60', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 20, y: 20, width: 120, height: 120, rx: 4, ...SW(4) }, 'dark', { stroke: true })
  ],
  subsanar: [
    s('path', { d: 'M46 40h68l-6 20q20 24 10 60q-6 18-38 18t-38-18q-10-36 10-60z' }, 'orange'),
    s('path', { d: 'M76 60l8 20-10 14 8 22', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 50, y: 78, width: 60, height: 22, rx: 8, transform: 'rotate(-20 80 89)' }, 'tan', { accent: true }),
    s('rect', { x: 70, y: 82, width: 20, height: 14, transform: 'rotate(-20 80 89)' }, 'cream'),
    s('path', { d: sparkle(130, 40, 9) + sparkle(30, 110, 7) }, 'yellow')
  ],
  'sádico': [
    s('circle', { cx: 80, cy: 82, r: 46 }, 'purple', { accent: true }),
    s('path', { d: 'M50 60l22 12M110 60l-22 12', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[64, 80], [96, 80]], 5) }, 'yellow'),
    s('path', { d: 'M52 98q28 30 56 0q-28 12-56 0z' }, 'dark'),
    s('path', { d: 'M58 100l4 8 4-6 4 8 4-6 4 8 4-6 4 8 4-6 4 8 4-6 4 6', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M46 44l-6-18 16 10M114 44l6-18-16 10' }, 'purple')
  ],
  tamarindo: [
    s('path', { d: 'M22 60q20-10 40 0t40 0 36 4q-4 10-36 8t-40-2-40 4z' }, 'brown', { accent: true }),
    s('path', { d: 'M24 108q20-12 40-2t36 4', ...SW(18) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 110q14 2 30-6', ...SW(18) }, 'orange', { stroke: true }),
    s('path', { d: dots([[110, 108], [124, 104]], 5) }, 'dark'),
    s('path', { d: 'M138 64l8-6M18 106l-4-6', ...SW(3) }, 'green', { stroke: true })
  ],
  'termodinámica': [
    s('rect', { x: 44, y: 22, width: 72, height: 90, rx: 4 }, 'gray'),
    s('rect', { x: 50, y: 60, width: 60, height: 48 }, 'red', { accent: true }),
    s('rect', { x: 50, y: 48, width: 60, height: 12 }, 'dark'),
    s('path', { d: 'M80 48V14', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 140q-10-14 4-24q2 10 10 4q-2-12 10-20q2 14 12 10q10 10 0 30z' }, 'orange'),
    s('path', { d: 'M128 80V40M120 50l8-10 8 10', ...SW(4) }, 'blue', { stroke: true })
  ],
  'terrorífico': [
    backdrop('navy'),
    s('circle', { cx: 120, cy: 36, r: 12 }, 'yellow'),
    s('path', { d: 'M44 136V76a36 36 0 0 1 72 0v60l-12-10-12 10-12-10-12 10-12-10z' }, 'white', { accent: true }),
    s('path', { d: ells([[66, 76, 7, 10], [94, 76, 7, 10], [80, 104, 8, 10]]) }, 'black'),
    s('path', { d: birds([[36, 36]]), ...SW(4) }, 'dark', { stroke: true })
  ],
  tolerable: [
    ...face(80, 52, 26, 'skin', 'flat'),
    s('rect', { x: 62, y: 80, width: 36, height: 56, rx: 12 }, 'blue'),
    s('rect', { x: 46, y: 76, width: 68, height: 30, rx: 3 }, 'tan', { accent: true }),
    s('path', { d: 'M46 90h68', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M14 120h28M118 120h28', ...SW(6) }, 'green', { stroke: true }),
    ground()
  ],
  'tomografía': [
    s('circle', { cx: 60, cy: 80, r: 46 }, 'gray'),
    s('circle', { cx: 60, cy: 80, r: 24 }, 'white'),
    s('path', { d: ring(60, 80, 24) + ring(60, 80, 46), ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 30, y: 84, width: 120, height: 10, rx: 4 }, 'blue', { accent: true }),
    s('circle', { cx: 134, cy: 74, r: 9 }, 'skin'),
    s('rect', { x: 86, y: 70, width: 40, height: 14, rx: 6 }, 'mint'),
    s('path', { d: 'M110 94v40M60 126v10', ...SW(6) }, 'dark', { stroke: true })
  ],
  tripartito: [
    s('path', { d: dots([[80, 26], [30, 70], [130, 70]], 13) }, 'skin'),
    s('path', { d: busts([80], 60, 30, 22) }, 'blue'),
    s('path', { d: busts([30, 130], 104, 30, 22) }, 'green'),
    s('rect', { x: 50, y: 70, width: 60, height: 70, rx: 3 }, 'white'),
    outline({ x: 50, y: 70, width: 60, height: 70, rx: 3 }),
    s('path', { d: 'M58 116q6-6 10 0M74 124q6-6 10 0M90 116q6-6 10 0', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M60 84h40M60 94h40', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 104, r: 5 }, 'red', { accent: true })
  ],
  trote: [
    ...horse('brown', 'dark', { accent: true }),
    s('path', { d: 'M12 60h14M8 76h16M12 92h12', ...SW(4) }, 'gray', { stroke: true }),
    ground(138)
  ],
  turbulento: [
    backdrop('gray'),
    s('path', { d: ells([[40, 40, 26, 14], [120, 120, 26, 14], [112, 34, 22, 12]]) }, 'dark'),
    s('path', { d: jet(80, 80), transform: 'rotate(60 80 80) scale(1.6) translate(-30 -30)' }, 'white', { accent: true }),
    s('path', { d: 'M24 82l8-6 8 6 8-6M110 70l8-6 8 6 8-6', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M40 56l-8 14h8l-6 12', ...SW(4) }, 'yellow', { stroke: true })
  ],
  zapatista: [
    backdrop('sky'),
    s('circle', { cx: 80, cy: 112, r: 26 }, 'yellow'),
    s('path', { d: 'M14 116h132v18q0 12-12 12H26q-12 0-12-12z' }, 'brown'),
    s('path', { d: 'M30 116V64M130 116V64', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: leaflet(30, 90, -50, 22, 6) + leaflet(130, 90, -130, 22, 6) + ells([[30, 60, 6, 12], [130, 60, 6, 12]]) }, 'green'),
    s('path', { d: 'M44 58q36-10 72 0q-6 6-36 6t-36-6zM64 54q2-22 16-22t16 22z' }, 'tan', { accent: true })
  ],
  acorralar: [
    s('path', { d: 'M22 70h80v66H22z', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M22 92h80M22 114h80M48 70v66M76 70v66', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: ells([[62, 112, 14, 9]]) }, 'white'),
    s('circle', { cx: 52, cy: 106, r: 6 }, 'dark'),
    ...person(128, 136, 'orange', { h: 44, w: 26, accent: true }),
    s('path', { d: 'M114 100h-8M110 94l-6 6 6 6', ...SW(4) }, 'dark', { stroke: true })
  ],
  acotar: [
    s('path', { d: 'M14 120l40-20 92 16-56 26z' }, 'green'),
    s('path', { d: 'M40 108V70M70 102V64M118 112V74M84 132V94', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 74l30-6 48 10-34 20z', ...SW(4) }, 'yellow', { accent: true, stroke: true }),
    s('path', { d: 'M40 74l30-6 48 10-34 20z', ...DASH(4, '6 8') }, 'black', { stroke: true })
  ],
  acusador: [
    ...person(36, 136, 'red', { h: 48, w: 30, accent: true }),
    s('path', { d: 'M48 92l30-12', ...SW(8) }, 'red', { stroke: true }),
    s('path', { d: 'M78 80l18-4', ...SW(5) }, 'skin', { stroke: true }),
    ...person(126, 136, 'gray', { h: 46, w: 28 }),
    s('path', { d: drop(110, 62, 4) }, 'sky'),
    ground()
  ],
  'acuífero': [
    s('rect', { x: 14, y: 30, width: 132, height: 30 }, 'tan'),
    s('rect', { x: 14, y: 60, width: 132, height: 36 }, 'blue', { accent: true }),
    s('rect', { x: 14, y: 96, width: 132, height: 40 }, 'brown'),
    s('path', { d: 'M24 78q10-6 20 0t20 0M94 74q10-6 20 0t20 0', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M80 16v62', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 30l8-14 8 14M120 30l8-14 8 14', ...SW(4) }, 'green', { stroke: true })
  ],
  'antítesis': [
    s('circle', { cx: 46, cy: 80, r: 30 }, 'black', { accent: true }),
    s('circle', { cx: 114, cy: 80, r: 30 }, 'white'),
    outline({ cx: 114, cy: 80, r: 30 }, 'dark'),
    s('path', { d: 'M46 124h-24M28 118l-6 6 6 6M114 124h24M132 118l6 6-6 6', ...SW(4) }, 'orange', { stroke: true })
  ],
  'apocalíptico': [
    backdrop('red'),
    s('path', { d: 'M14 112h18V82h16v20h14V70h18v30h16V88h18v24h32v22q0 12-12 12H26q-12 0-12-12z' }, 'black'),
    s('circle', { cx: 102, cy: 46, r: 12 }, 'orange', { accent: true }),
    s('path', { d: 'M96 52L40 22M92 40L56 18', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: burst(56, 92, 10, 5, 7) + burst(112, 100, 8, 4, 7) }, 'orange')
  ],
  'arnés': [
    s('path', { d: 'M80 14v38', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 64, r: 12 }, 'skin'),
    s('rect', { x: 64, y: 80, width: 32, height: 40, rx: 10 }, 'blue'),
    s('path', { d: 'M68 82l12 22 12-22M64 108h32M70 120l-6 20M90 120l6 20', ...SW(5) }, 'orange', { accent: true, stroke: true }),
    s('circle', { cx: 80, cy: 52, r: 5, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 20h32v120H18z' }, 'gray')
  ],
  arrendatario: [
    s('path', { d: 'M18 74l40-34 40 34v62H18z' }, 'tan'),
    s('path', { d: 'M12 76l46-40 46 40', ...SW(6) }, 'red', { stroke: true }),
    s('rect', { x: 48, y: 100, width: 20, height: 36 }, 'brown'),
    ...person(124, 136, 'green', { h: 44, w: 26 }),
    s('circle', { cx: 104, cy: 70, r: 9, ...SW(4) }, 'yellow', { accent: true, stroke: true }),
    s('path', { d: 'M104 79v16l6-4M104 88h5', ...SW(4) }, 'yellow', { stroke: true })
  ],
  asiduo: [
    s('rect', { x: 18, y: 34, width: 96, height: 60, rx: 8 }, 'cream'),
    outline({ x: 18, y: 34, width: 96, height: 60, rx: 8 }, 'brown'),
    s('path', { d: dots([[36, 54], [56, 54], [76, 54], [96, 54], [36, 76], [56, 76], [76, 76], [96, 76]], 7) }, 'red', { accent: true }),
    s('path', { d: 'M100 108h36l-4 30h-28z' }, 'white'),
    s('path', { d: 'M100 108h36l-4 30h-28zM136 114q10 0 8 10t-12 8', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M110 100q-4-6 0-12M124 100q-4-6 0-12', ...SW(3) }, 'gray', { stroke: true })
  ],
  asar: [
    s('path', { d: 'M28 76h104q0 40-52 40t-52-40z' }, 'dark'),
    s('path', { d: 'M28 76h104M40 116l-10 22M120 116l10 22', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: ells([[58, 68, 22, 10], [106, 68, 20, 9]]) }, 'brown', { accent: true }),
    s('path', { d: 'M46 64l24 6M96 64l20 6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 52q-6-10 0-18M84 50q-6-10 0-18M106 52q-6-10 0-18', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 100l6-10 6 10 6-12 6 12 6-10 6 10z' }, 'orange')
  ],
  atener: [
    s('rect', { x: 30, y: 60, width: 100, height: 70, rx: 6 }, 'navy', { accent: true }),
    s('rect', { x: 36, y: 66, width: 88, height: 6 }, 'yellow'),
    s('path', { d: 'M64 60V30q0-8 8-8t8 8v30M80 60V24q0-8 8-8t8 8v36M96 60V34q0-8 8-8t8 8v26M48 60V44q0-8 8-8t8 8' }, 'skin'),
    s('path', { d: 'M48 60h64', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M60 100h40', ...SW(5) }, 'yellow', { stroke: true })
  ],
  aterrorizar: [
    s('path', { d: 'M14 136V60q0-40 50-40t50 40v76l-12-10-12 10-12-10-12 10-12-10-12 10-12-10z' }, 'purple', { accent: true }),
    s('path', { d: 'M38 56l14 6M90 56l-14 6', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 80h48l-6 14-6-8-6 8-6-8-6 8-6-8-6 8z' }, 'white'),
    s('circle', { cx: 132, cy: 104, r: 10 }, 'skin'),
    s('rect', { x: 122, y: 116, width: 20, height: 20, rx: 6 }, 'blue'),
    s('path', { d: 'M120 88l-4-6M132 86v-8M144 88l4-6', ...SW(3) }, 'gray', { stroke: true })
  ],
  avistamiento: [
    s('path', { d: 'M14 104q16-6 33 0t33 0 33 0 33 0v30q0 12-12 12H26q-12 0-12-12z' }, 'blue'),
    s('path', { d: 'M104 100q-6-26 8-36q-4 14 6 18q10-6 14-20q8 16-10 30l-8 8z' }, 'navy', { accent: true }),
    s('path', { d: rects([[26, 40, 26, 34], [60, 40, 26, 34]]) }, 'dark'),
    s('path', { d: dots([[39, 78], [73, 78]], 13) }, 'dark'),
    s('path', { d: dots([[39, 78], [73, 78]], 7) }, 'sky'),
    s('rect', { x: 50, y: 48, width: 12, height: 14 }, 'gray')
  ],
  bielorruso: [
    backdrop('sky'),
    s('path', { d: 'M14 120h132v14q0 12-12 12H26q-12 0-12-12z' }, 'green'),
    s('path', { d: ells([[42, 54, 22, 28], [110, 48, 24, 30]]) }, 'green'),
    s('path', { d: rects([[38, 70, 8, 52], [106, 64, 8, 58]]) }, 'white', { accent: true }),
    s('path', { d: 'M38 84h4M42 100h4M38 112h4M106 80h4M110 96h4M106 108h4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 100q8-12 18-8l12-14-8 18q-6 10-22 4z' }, 'white'),
    s('path', { d: 'M74 104l-2 16M80 104l2 16', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M94 78l8-4', ...SW(3) }, 'red', { stroke: true })
  ],
  'brócoli': [
    s('path', { d: 'M70 140l4-50h12l4 50z' }, 'mint'),
    s('path', { d: 'M80 96L60 76M80 96l20-22', ...SW(8) }, 'mint', { stroke: true }),
    s('path', { d: ells([[56, 60, 24, 22], [104, 58, 24, 22], [80, 44, 26, 24], [40, 78, 14, 13], [120, 76, 14, 13]]) }, 'green', { accent: true }),
    s('path', { d: dots([[60, 52], [88, 36], [108, 54], [76, 56], [44, 74], [120, 72]], 4) }, 'mint')
  ],
  cachondeo: [
    ...face(52, 86, 30, 'yellow', 'smile', { accent: true }),
    ...face(112, 86, 30, 'orange', 'smile'),
    s('path', { d: 'M38 96q14 18 28 0zM98 96q14 18 28 0z' }, 'dark'),
    s('path', { d: rects([[30, 30, 6, 10], [70, 22, 6, 10], [104, 30, 6, 10], [136, 40, 6, 10]]) }, 'pink'),
    s('path', { d: 'M48 34l10 4M88 30l8 8M122 26l-4 10', ...SW(4) }, 'blue', { stroke: true })
  ],
  camerino: [
    s('rect', { x: 32, y: 18, width: 96, height: 92, rx: 6 }, 'brown'),
    s('rect', { x: 42, y: 28, width: 76, height: 72, rx: 4 }, 'sky', { accent: true }),
    s('path', { d: dots([[32, 30], [32, 52], [32, 74], [32, 96], [128, 30], [128, 52], [128, 74], [128, 96], [56, 18], [80, 18], [104, 18]], 6) }, 'yellow'),
    s('rect', { x: 20, y: 112, width: 120, height: 12, rx: 3 }, 'tan'),
    s('path', { d: 'M28 124v16M132 124v16', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: star(80, 64, 18) }, 'white')
  ],
  centroafricano: [
    backdrop('orange'),
    s('circle', { cx: 80, cy: 64, r: 30 }, 'yellow'),
    s('path', { d: 'M14 112h132v22q0 12-12 12H26q-12 0-12-12z' }, 'tan'),
    s('path', { d: 'M80 112V76M80 92l-24-14M80 88l22-12', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 74q50-22 100 0q-50 8-100 0z' }, 'green', { accent: true }),
    s('path', { d: 'M110 112v-10q4-6 8 0v10M126 112v-14q4-6 8 0v14', ...SW(3) }, 'brown', { stroke: true })
  ],
  'charlatán': [
    s('rect', { x: 34, y: 104, width: 64, height: 32 }, 'brown'),
    ...person(66, 104, 'purple', { h: 40, w: 28, r: 12, accent: true }),
    s('path', { d: 'M52 40h28v-14H52z' }, 'black'),
    s('path', { d: 'M80 76l26-16', ...SW(6) }, 'purple', { stroke: true }),
    s('path', { d: 'M104 36h10v10l6 6v18h-22V52l6-6z' }, 'green'),
    s('path', { d: 'M124 28l10-8M128 44h14', ...SW(3) }, 'orange', { stroke: true })
  ],
  combativo: [
    s('path', { d: 'M24 58q0-30 30-30q26 0 26 30v26q0 12-12 12H36q-12 0-12-12z' }, 'red', { accent: true }),
    s('path', { d: 'M80 74q0-30 30-30q26 0 26 30v26q0 12-12 12H92q-12 0-12-12z' }, 'red'),
    s('path', { d: 'M28 96h48v20H28zM84 112h48v20H84z' }, 'white'),
    s('path', { d: 'M28 96h48v20H28zM84 112h48v20H84z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 56q6-10 16-8M94 72q6-10 16-8', ...SW(4) }, 'pink', { stroke: true })
  ],
  compinche: [
    ...person(56, 136, 'blue', { h: 46, w: 30 }),
    ...person(104, 136, 'orange', { h: 46, w: 30, accent: true }),
    s('path', { d: 'M62 96q20-14 40-6', ...SW(7) }, 'blue', { stroke: true }),
    s('path', { d: 'M96 72q4-3 8 0M110 74h4', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M50 74h2M60 74h2', ...SW(4) }, 'dark', { stroke: true }),
    ground()
  ],
  conferencista: [
    s('path', { d: 'M60 28l-40 108h40z' }, 'cream'),
    ...person(80, 96, 'navy', { h: 34, w: 30, r: 13 }),
    s('path', { d: 'M48 90h64l-8 46H56z' }, 'brown', { accent: true }),
    s('path', { d: 'M96 90l-8-18', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 87, cy: 70, r: 4 }, 'dark'),
    s('circle', { cx: 80, cy: 110, r: 8 }, 'yellow')
  ],
  conformismo: [
    s('path', { d: dots([[26, 64], [54, 64], [82, 64], [110, 64], [138, 64]], 10) }, 'gray'),
    s('path', { d: busts([26, 54, 82, 110, 138], 112, 22, 34) }, 'gray', { accent: true }),
    s('path', { d: 'M14 124h132M126 124l-8-6M126 124l-8 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 64l4 0M46 64h4M74 64h4M102 64h4M130 64h4', ...SW(3) }, 'dark', { stroke: true })
  ],
  consistentemente: [
    s('circle', { cx: 74, cy: 84, r: 54 }, 'red'),
    s('circle', { cx: 74, cy: 84, r: 38 }, 'white'),
    s('circle', { cx: 74, cy: 84, r: 22 }, 'red', { accent: true }),
    s('circle', { cx: 74, cy: 84, r: 8 }, 'white'),
    s('path', { d: 'M74 84l60-50M78 80l58-34M70 86l64-58', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M128 28l12 0-4 10M134 40h10l-4 8', ...SW(3) }, 'yellow', { stroke: true })
  ],
  'consternación': [
    ...face(80, 76, 44, 'sky', 'flat', { accent: true }),
    s('ellipse', { cx: 80, cy: 98, rx: 8, ry: 12 }, 'dark'),
    s('path', { d: 'M28 106q-4-30 12-36M132 106q4-30-12-36', ...SW(12) }, 'skin', { stroke: true }),
    s('path', { d: 'M54 50l12-6M106 50l-12-6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 140v-12M80 140v-14M100 140v-12', ...SW(3) }, 'gray', { stroke: true })
  ],
  constitutivo: [
    s('path', { d: rects([[24, 104, 36, 32], [100, 104, 36, 32]]) }, 'blue'),
    s('rect', { x: 62, y: 104, width: 36, height: 32 }, 'yellow', { accent: true }),
    s('path', { d: rects([[42, 70, 36, 32], [82, 70, 36, 32]]) }, 'red'),
    s('rect', { x: 62, y: 36, width: 36, height: 32 }, 'green'),
    s('path', { d: dots([[42, 104], [80, 104], [118, 104], [60, 70], [100, 70], [80, 36]], 5) }, 'white')
  ],
  copo: [
    backdrop('navy'),
    s('path', { d: 'M80 24v112M32 52l96 56M32 108l96-56', ...SW(7) }, 'white', { accent: true, stroke: true }),
    s('path', { d: 'M68 34l12 12 12-12M68 126l12-12 12 12M36 66l16-4-4-16M124 94l-16 4 4 16M36 94l16 4-4 16M124 66l-16-4 4-16', ...SW(5) }, 'sky', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 8 }, 'sky')
  ],
  cortafuegos: [
    s('path', { d: 'M22 136q-10-34 12-52q0 18 12 20q-6-28 14-44q2 24 14 28q4-18 14-24q8 30 0 72z' }, 'orange'),
    s('path', { d: 'M40 136q-4-16 8-26q2 12 10 14q2-12 10-16q6 14 0 28z' }, 'yellow'),
    s('rect', { x: 90, y: 30, width: 46, height: 106 }, 'red', { accent: true }),
    s('path', { d: 'M90 48h46M90 66h46M90 84h46M90 102h46M90 120h46M113 30v18M102 48v18M124 48v18M113 66v18M102 84v18M124 84v18M113 102v18M102 120v16M124 120v16', ...SW(3) }, 'cream', { stroke: true }),
    ground()
  ],
  cotidianamente: [
    s('path', { d: 'M30 80a50 50 0 1 1 14 36', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 128l12-14-18-2z' }, 'gray'),
    s('circle', { cx: 80, cy: 60, r: 16 }, 'yellow', { accent: true }),
    s('path', { d: halfRays(80, 60, 22, 30, 5), ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M62 88h36l-4 24H66z' }, 'brown'),
    s('path', { d: 'M98 92q8 0 6 8t-8 6', ...SW(3) }, 'brown', { stroke: true })
  ],
  'criminalización': [
    s('circle', { cx: 52, cy: 92, r: 26, ...SW(10) }, 'gray', { accent: true, stroke: true }),
    s('circle', { cx: 108, cy: 92, r: 26, ...SW(10) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 70q6-14 12 0', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: rects([[30, 58, 14, 12], [116, 58, 14, 12]]) }, 'dark'),
    s('path', { d: 'M36 100q4 10 12 12', ...SW(3) }, 'white', { stroke: true })
  ]
};
