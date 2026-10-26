// Illustration specs for words still undrawn in batches 0111–0112 (see server/scripts/lexicon/art.js)
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
  frustrar: [
    ...face(80, 96, 40, 'orange', 'frown', { accent: true }),
    s('path', { d: 'M56 74l14 6M104 74l-14 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 40q10-16 20 0t20 0 20 0 20 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M46 24q8 10 16 0t16 0 16 0 16 0', ...SW(4) }, 'gray', { stroke: true })
  ],
  gestar: [
    s('circle', { cx: 74, cy: 34, r: 14 }, 'skin'),
    s('path', { d: 'M62 52h24q2 20 10 26q24 10 18 34q-4 22-26 24H62z' }, 'pink'),
    s('ellipse', { cx: 92, cy: 100, rx: 22, ry: 24 }, 'pink', { accent: true }),
    s('path', { d: heart(94, 98, 10) }, 'red'),
    s('path', { d: 'M78 74q24 6 22 26', ...SW(5) }, 'skin', { stroke: true }),
    ground(140)
  ],
  golondrina: [
    backdrop('sky'),
    s('path', { d: 'M40 80q30-22 70-8l14-18 4 26q-8 12-24 14q-36 6-64-14z' }, 'navy', { accent: true }),
    s('path', { d: 'M108 90l32 30-38-18zM110 84l36 10-36 2z' }, 'navy'),
    s('path', { d: 'M48 84q26 14 54 6q-26 18-54-6z' }, 'white'),
    s('path', { d: 'M50 74q20-30 64-44q-14 30-50 46z' }, 'navy'),
    s('path', { d: 'M40 80l-12 4 10 4z' }, 'dark'),
    s('path', { d: 'M38 82q2 6 8 6', ...SW(5) }, 'red', { stroke: true }),
    s('circle', { cx: 46, cy: 78, r: 2.5 }, 'white')
  ],
  graficar: [
    s('path', { d: 'M26 24v112h112', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 40, y: 100, width: 18, height: 34 }, 'blue'),
    s('rect', { x: 66, y: 80, width: 18, height: 54 }, 'green'),
    s('rect', { x: 92, y: 60, width: 18, height: 74 }, 'orange'),
    s('rect', { x: 118, y: 36, width: 18, height: 98 }, 'red', { accent: true }),
    s('path', { d: 'M40 92l28-22 26-18 30-26', ...SW(4) }, 'dark', { stroke: true })
  ],
  'gráficamente': [
    s('rect', { x: 18, y: 22, width: 124, height: 92, rx: 6 }, 'white'),
    outline({ x: 18, y: 22, width: 124, height: 92, rx: 6 }),
    s('circle', { cx: 60, cy: 68, r: 30 }, 'blue'),
    s('path', { d: wedge(60, 68, 30, -90, 30) }, 'orange', { accent: true }),
    s('path', { d: wedge(60, 68, 30, 30, 120) }, 'green'),
    s('path', { d: 'M100 48h30M100 64h24M100 80h28', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M64 114l-16 26M96 114l16 26', ...SW(5) }, 'brown', { stroke: true })
  ],
  'hegemónico': [
    ...person(80, 112, 'purple', { h: 54, w: 36, r: 15, accent: true }),
    s('path', { d: 'M64 34l4-14 6 8 6-10 6 10 6-8 4 14z' }, 'yellow'),
    s('rect', { x: 52, y: 112, width: 56, height: 24, rx: 3 }, 'gray'),
    s('path', { d: dots([[26, 112], [134, 112], [44, 120], [116, 120]], 6) }, 'skin'),
    s('path', { d: busts([26, 134], 136, 14, 18) + busts([44, 116], 140, 12, 14) }, 'gray')
  ],
  'hermético': [
    s('rect', { x: 42, y: 56, width: 76, height: 82, rx: 14 }, 'sky', { accent: true }),
    s('path', { d: dots([[62, 104], [84, 96], [98, 116], [70, 124]], 9) }, 'red'),
    s('rect', { x: 38, y: 40, width: 84, height: 18, rx: 6 }, 'gray'),
    s('rect', { x: 40, y: 56, width: 80, height: 6 }, 'orange'),
    s('path', { d: 'M118 50q14 6 8 30', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M42 30q38-10 76 0', ...SW(5) }, 'dark', { stroke: true })
  ],
  'hipopótamo': [
    s('rect', { x: 14, y: 112, width: 132, height: 30, rx: 6 }, 'blue'),
    s('path', { d: 'M28 116q0-46 50-48q22 0 30 10q26-6 34 14q8 22-6 26z' }, 'purple', { accent: true }),
    s('ellipse', { cx: 128, cy: 104, rx: 18, ry: 14 }, 'purple'),
    s('path', { d: dots([[122, 100], [134, 100]], 2.5) + dots([[100, 78]], 3) }, 'dark'),
    s('path', { d: ells([[96, 66, 5, 6], [108, 68, 5, 6]]) }, 'pink'),
    s('path', { d: 'M18 120q12-6 24 0t24 0 24 0 24 0 24 0', ...SW(4) }, 'sky', { stroke: true })
  ],
  'ibídem': [
    ...paper(22, 30, 54, 74),
    ...paper(84, 30, 54, 74),
    s('path', { d: 'M32 46h34M32 58h34M32 70h22M94 46h34M94 58h34M94 70h22', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 32, y: 82, width: 22, height: 10, rx: 3 }, 'orange', { accent: true }),
    s('rect', { x: 94, y: 82, width: 22, height: 10, rx: 3 }, 'orange'),
    s('path', { d: 'M112 112q-30 28-62 0', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M42 104l6 14 12-8z' }, 'blue')
  ],
  inconsistente: [
    s('rect', { x: 46, y: 116, width: 70, height: 20, rx: 2 }, 'blue'),
    s('rect', { x: 58, y: 96, width: 50, height: 20, rx: 2, transform: 'rotate(8 83 106)' }, 'orange'),
    s('rect', { x: 44, y: 74, width: 54, height: 20, rx: 2, transform: 'rotate(-10 71 84)' }, 'green'),
    s('rect', { x: 66, y: 50, width: 44, height: 20, rx: 2, transform: 'rotate(14 88 60)' }, 'red', { accent: true }),
    s('path', { d: 'M56 34l10 8M104 30l-8 10M124 60l-10 4', ...SW(4) }, 'gray', { stroke: true }),
    ground()
  ],
  incubadora: [
    s('rect', { x: 26, y: 92, width: 108, height: 22, rx: 4 }, 'gray'),
    s('path', { d: 'M44 114v22M116 114v22', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 92q0-48 50-48q50 0 50 48z' }, 'sky', { accent: true }),
    s('rect', { x: 50, y: 78, width: 50, height: 14, rx: 7 }, 'yellow'),
    s('circle', { cx: 104, cy: 82, r: 10 }, 'skin'),
    s('path', { d: 'M44 64q10-12 24-14', ...SW(4) }, 'white', { stroke: true }),
    s('circle', { cx: 120, cy: 103, r: 5 }, 'green')
  ],
  infectar: [
    s('path', { d: rays(46, 52, 16, 26, 8), ...SW(4) }, 'green', { stroke: true }),
    s('circle', { cx: 46, cy: 52, r: 18 }, 'green', { accent: true }),
    s('path', { d: dots([[40, 48], [52, 56]], 4) }, 'mint'),
    arrow('M66 70l20 18'),
    s('path', { d: 'M90 96l8-4-2 10z' }, 'orange'),
    ...face(108, 112, 26, 'skin', 'frown'),
    s('path', { d: dots([[96, 120], [120, 120], [108, 100]], 3.5) }, 'red')
  ],
  inmediatez: [
    s('rect', { x: 72, y: 18, width: 16, height: 10, rx: 2 }, 'dark'),
    s('circle', { cx: 80, cy: 86, r: 50 }, 'white'),
    s('circle', { cx: 80, cy: 86, r: 50, ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('path', { d: wedge(80, 86, 40, -90, -30) }, 'orange'),
    s('path', { d: 'M80 86V48', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 70h10M14 86h14M18 102h10', ...SW(5) }, 'gray', { stroke: true })
  ],
  internamiento: [
    s('rect', { x: 34, y: 46, width: 92, height: 90 }, 'gray'),
    s('path', { d: 'M28 50l52-30 52 30z' }, 'dark'),
    s('path', { d: grid(44, 60, 3, 2, 14, 16, 28, 26) }, 'sky'),
    s('rect', { x: 68, y: 108, width: 24, height: 28 }, 'brown'),
    s('path', { d: 'M16 100v36M28 100v36M132 100v36M144 100v36M14 110h18M128 110h18', ...SW(4) }, 'navy', { stroke: true, accent: true }),
    ground()
  ],
  introductorio: [
    s('path', { d: 'M30 136v-20h28v-22h28v-22h28v-22h28v86z' }, 'gray'),
    s('rect', { x: 30, y: 116, width: 28, height: 20 }, 'green', { accent: true }),
    ...person(44, 116, 'blue', { h: 32, w: 22, r: 10 }),
    s('path', { d: star(126, 34, 12) }, 'yellow'),
    ground(136)
  ],
  jeringa: [
    s('rect', { x: 40, y: 64, width: 72, height: 30, rx: 4 }, 'sky', { accent: true }),
    s('rect', { x: 40, y: 72, width: 40, height: 22 }, 'blue'),
    s('path', { d: 'M40 58v42M112 74h14M126 79h20', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 79h22M18 66v26', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 64v8M70 64v8M94 64v8', ...SW(3) }, 'navy', { stroke: true })
  ],
  juerga: [
    backdrop('navy'),
    s('path', { d: 'M80 14v14', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 44, r: 16 }, 'gray', { accent: true }),
    s('path', { d: 'M66 40h28M66 48h28M76 30v28M86 30v28', ...SW(2) }, 'white', { stroke: true }),
    ...lean(46, 140, -12, 'pink'),
    ...lean(114, 140, 12, 'yellow'),
    s('path', { d: sparkle(28, 30, 8) + sparkle(130, 34, 8) + sparkle(80, 82, 6) }, 'yellow')
  ],
  'júnior': [
    ...person(54, 138, 'navy', { h: 58, w: 32, r: 14 }),
    s('path', { d: 'M54 80l-5 10 5 26 5-26z' }, 'red'),
    ...person(110, 138, 'green', { h: 32, w: 24, r: 11, accent: true }),
    s('rect', { x: 120, y: 108, width: 12, height: 22, rx: 4 }, 'orange'),
    s('path', { d: 'M76 112h14', ...SW(5) }, 'skin', { stroke: true })
  ],
  liberador: [
    s('path', { d: 'M24 62q34-36 68 0v70H24z', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 50v82M58 44v88M76 50v82', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M92 72l30-14v74l-30 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 40q10-20 26-10q-6 4-4 10q-10 12-22 0z' }, 'yellow', { accent: true }),
    s('path', { d: 'M112 36q-4-14 10-20M124 34q8-12 18-8', ...SW(4) }, 'yellow', { stroke: true }),
    s('rect', { x: 18, y: 130, width: 80, height: 8, rx: 2 }, 'brown')
  ],
  llanero: [
    ...horse('brown', 'dark'),
    s('rect', { x: 66, y: 50, width: 18, height: 30, rx: 6 }, 'red', { accent: true }),
    s('circle', { cx: 75, cy: 40, r: 9 }, 'skin'),
    s('path', { d: 'M58 34h34M66 34q0-12 9-12t9 12z' }, 'tan'),
    s('path', { d: 'M58 34h34', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M14 138h132', ...SW(4) }, 'green', { stroke: true })
  ],
  'lípido': [
    s('path', { d: drop(80, 88, 34) }, 'yellow', { accent: true }),
    s('path', { d: ells([[70, 92, 6, 10]]) }, 'cream'),
    s('path', { d: drop(32, 120, 10) + drop(130, 52, 9) + drop(130, 124, 7) }, 'orange'),
    s('path', { d: 'M18 140h124', ...SW(4) }, 'gray', { stroke: true })
  ],
  macarrones: [
    s('ellipse', { cx: 80, cy: 104, rx: 64, ry: 28 }, 'white'),
    s('ellipse', { cx: 80, cy: 104, rx: 64, ry: 28, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M44 96l20-10M60 108l22-6M84 90l20 6M98 108l22-8M70 82l14 14M110 88l10 14M50 112l12 4', ...SW(10) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: dots([[64, 86], [82, 102], [104, 96], [120, 100], [84, 96]], 2.5) }, 'orange'),
    s('path', { d: dots([[72, 96], [96, 84], [112, 108]], 4) }, 'red')
  ],
  maldecir: [
    ...person(40, 138, 'dark', { h: 48 }),
    s('path', { d: 'M56 104l10-10', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: bubble(64, 20, 80, 66) }, 'red', { accent: true }),
    s('path', { d: 'M98 32l-10 18h12l-8 18', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: spiral(116, 46) }, 'white', { stroke: true }),
    s('path', { d: star(80, 58, 7) }, 'white')
  ],
  mamut: [
    s('path', { d: 'M28 106q0-60 62-62q44 0 46 44l-6 18H28z' }, 'brown', { accent: true }),
    s('path', { d: 'M40 104v32M60 104v32M96 104v32M114 104v32', ...SW(12) }, 'brown', { stroke: true }),
    s('path', { d: 'M130 80q8 30-6 50', ...SW(10) }, 'brown', { stroke: true }),
    s('path', { d: 'M122 96q-4 26-30 22', ...SW(6) }, 'cream', { stroke: true }),
    s('circle', { cx: 116, cy: 72, r: 3 }, 'dark'),
    s('path', { d: 'M50 56q4 10 0 18M70 50q4 10 0 18', ...SW(3) }, 'dark', { stroke: true })
  ],
  manchego: [
    s('path', { d: 'M22 70q0-16 58-16t58 16v42q0 16-58 16t-58-16z' }, 'tan'),
    s('ellipse', { cx: 80, cy: 70, rx: 58, ry: 16 }, 'cream'),
    s('path', { d: 'M80 70l58 0v42l-58-10z' }, 'yellow', { accent: true }),
    s('path', { d: 'M26 86l8 8 8-8 8 8 8-8 8 8 8-8M26 102l8 8 8-8 8 8 8-8 8 8 8-8', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: dots([[104, 84], [122, 96]], 3) }, 'tan')
  ],
  manejable: [
    s('rect', { x: 34, y: 104, width: 92, height: 30, rx: 10 }, 'dark'),
    s('path', { d: 'M80 106V56', ...SW(10) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 48, r: 18 }, 'red', { accent: true }),
    s('path', { d: dots([[50, 118], [110, 118]], 6) }, 'blue'),
    s('path', { d: 'M48 40q-10 10-8 24M112 40q10 10 8 24', ...SW(4) }, 'orange', { stroke: true })
  ],
  menester: [
    s('rect', { x: 34, y: 26, width: 92, height: 114, rx: 6 }, 'brown'),
    s('rect', { x: 42, y: 36, width: 76, height: 98, rx: 3 }, 'white'),
    s('rect', { x: 62, y: 18, width: 36, height: 16, rx: 4 }, 'gray'),
    s('path', { d: rects([[50, 50, 14, 14], [50, 76, 14, 14], [50, 102, 14, 14]]) }, 'gray'),
    s('path', { d: 'M52 56l5 6 10-14M52 82l5 6 10-14', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M72 57h36M72 83h36M72 109h36', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: dots([[57, 109]], 5) }, 'red', { accent: true })
  ],
  microbio: [
    s('path', { d: 'M40 72q-14-10-20 2M44 100q-16 6-14 22M118 64q14-14 24-4M120 100q16 4 18 20', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M38 84q0-34 42-34q44 0 44 36q0 34-44 34q-42 0-42-36z' }, 'green', { accent: true }),
    s('path', { d: ells([[70, 82, 12, 10]]) }, 'purple'),
    s('path', { d: dots([[100, 74], [96, 102], [56, 104], [110, 90]], 4) }, 'mint'),
    s('path', { d: dots([[64, 80]], 4) }, 'dark')
  ],
  mimar: [
    s('ellipse', { cx: 80, cy: 124, rx: 60, ry: 14 }, 'purple'),
    s('path', { d: 'M40 120q0-30 36-30q30 0 36 26z' }, 'orange', { accent: true }),
    s('circle', { cx: 112, cy: 96, r: 16 }, 'orange'),
    s('path', { d: 'M100 86l2-16 10 10zM114 80l10-12 2 16z' }, 'orange'),
    s('path', { d: 'M106 98q4 4 8 0M116 98q4 4 8 0', ...SW(2.5) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 50q30-6 48 4q14 8 24 6', ...SW(12) }, 'skin', { stroke: true }),
    s('path', { d: heart(118, 40, 10) + heart(140, 62, 7) }, 'pink')
  ],
  misticismo: [
    backdrop('navy'),
    s('path', { d: 'M48 136l8-18h48l8 18z' }, 'brown'),
    s('circle', { cx: 80, cy: 80, r: 40 }, 'purple', { accent: true }),
    s('path', { d: 'M58 66q8-16 24-18', ...SW(5) }, 'pink', { stroke: true }),
    s('path', { d: sparkle(88, 86, 14) }, 'white'),
    s('path', { d: star(32, 34, 6) + star(130, 30, 7) + star(128, 70, 4) + star(28, 82, 4) }, 'yellow')
  ],
  mofa: [
    ...face(54, 72, 34, 'yellow', 'smile', { accent: true }),
    s('path', { d: 'M38 84q16 20 32 0z' }, 'dark'),
    s('path', { d: 'M88 80h22', ...SW(7) }, 'skin', { stroke: true }),
    ...face(126, 110, 18, 'sky', 'frown'),
    s('path', { d: drop(138, 104, 3) }, 'blue'),
    s('path', { d: 'M22 30l8 8M86 30l-8 8M54 22v10', ...SW(4) }, 'orange', { stroke: true })
  ],
  mongol: [
    backdrop('sky', 14, 96),
    s('rect', { x: 14, y: 104, width: 132, height: 42, rx: 4 }, 'green'),
    s('path', { d: 'M34 86h92v40H34z' }, 'white'),
    s('path', { d: 'M28 88q52-56 104 0z' }, 'red', { accent: true }),
    s('path', { d: 'M34 98h92M34 112h92', ...SW(3) }, 'blue', { stroke: true }),
    s('rect', { x: 70, y: 100, width: 20, height: 26, rx: 2 }, 'orange'),
    outline({ x: 34, y: 86, width: 92, height: 40 })
  ],
  murciano: [
    s('path', { d: 'M24 98h112l-12 38H36z' }, 'brown'),
    s('path', { d: ells([[54, 88, 18, 14], [86, 82, 18, 14], [114, 92, 16, 12]]) }, 'yellow', { accent: true }),
    s('path', { d: ells([[70, 98, 14, 10]]) }, 'red'),
    s('path', { d: leaflet(92, 66, -60, 26, 7) + leaflet(54, 74, -120, 22, 6) }, 'green'),
    s('path', { d: 'M28 112h104', ...SW(3) }, 'tan', { stroke: true })
  ],
  ornamental: [
    s('path', { d: 'M58 136q-14-30 2-56h40q16 26 2 56z' }, 'blue', { accent: true }),
    s('path', { d: 'M54 104q26 10 52 0', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[66, 118], [80, 122], [94, 118]], 3) + dots([[80, 92]], 5) }, 'white'),
    s('path', { d: 'M80 80q-6-30-26-44M80 80q6-30 26-44M80 80V40', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots([[54, 36], [106, 36], [80, 36]], 9) }, 'pink'),
    s('path', { d: dots([[54, 36], [106, 36], [80, 36]], 3) }, 'yellow')
  ],
  'orégano': [
    s('rect', { x: 86, y: 60, width: 46, height: 76, rx: 8 }, 'sky'),
    s('rect', { x: 84, y: 48, width: 50, height: 14, rx: 4 }, 'red'),
    s('path', { d: dots([[98, 100], [110, 110], [120, 96], [102, 122], [118, 124]], 3) }, 'green'),
    s('path', { d: 'M36 136q4-60 18-110', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: ells([[30, 116, 9, 6], [52, 108, 9, 6], [32, 90, 8, 6], [56, 80, 8, 6], [40, 64, 8, 5], [60, 54, 7, 5], [48, 38, 6, 5]]) }, 'green', { accent: true })
  ],
  'palabrería': [
    s('path', { d: bubble(60, 16, 84, 52) }, 'sky'),
    s('path', { d: bubble(20, 54, 74, 46) }, 'yellow', { accent: true }),
    s('path', { d: 'M72 32q6-6 12 0t12 0 12 0 12 0M30 70q6-6 12 0t12 0 12 0 12 0', ...SW(3) }, 'dark', { stroke: true }),
    ...face(118, 116, 22, 'skin', 'flat'),
    s('path', { d: 'M108 108q4-6 8 0M124 108q4-6 8 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  parral: [
    s('path', { d: 'M30 40v96M130 40v96', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M20 40h120', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: ells([[40, 40, 14, 9], [66, 36, 14, 9], [94, 40, 14, 9], [120, 36, 14, 9]]) }, 'green'),
    s('path', { d: dots([[52, 52], [60, 52], [56, 60], [64, 60], [60, 68], [56, 76], [100, 52], [108, 52], [104, 60], [112, 60], [108, 68], [104, 76]], 5) }, 'purple', { accent: true }),
    ground()
  ],
  pastizal: [
    backdrop('sky', 14, 80),
    s('circle', { cx: 120, cy: 40, r: 14 }, 'yellow'),
    s('path', { d: 'M14 90q66-18 132 0v52H14z' }, 'green', { accent: true }),
    s('path', { d: 'M30 110l-4-12M34 110l2-14M38 110l6-10M76 128l-4-12M80 128l2-14M84 128l6-10M116 106l-4-12M120 106l2-14M124 106l6-10', ...SW(4) }, 'mint', { stroke: true })
  ],
  'patológico': [
    s('rect', { x: 34, y: 124, width: 92, height: 12, rx: 4 }, 'dark'),
    s('path', { d: 'M96 124q0-40-28-56', ...SW(12) }, 'gray', { stroke: true }),
    s('rect', { x: 56, y: 22, width: 22, height: 54, rx: 4, transform: 'rotate(-30 67 49)' }, 'navy', { accent: true }),
    s('rect', { x: 44, y: 92, width: 48, height: 8, rx: 2 }, 'gray'),
    s('ellipse', { cx: 62, cy: 88, rx: 12, ry: 4 }, 'pink'),
    s('path', { d: dots([[58, 87], [66, 89]], 2) }, 'red')
  ],
  paulista: [
    s('path', { d: rects([[18, 70, 22, 66], [42, 40, 24, 96], [68, 60, 20, 76], [90, 26, 22, 110], [114, 54, 26, 82]]) }, 'gray'),
    s('rect', { x: 90, y: 26, width: 22, height: 110 }, 'blue', { accent: true }),
    s('path', { d: grid(46, 48, 2, 7, 6, 6, 10, 12) + grid(118, 62, 2, 6, 6, 6, 10, 12) + grid(22, 78, 2, 4, 5, 6, 9, 12) }, 'sky'),
    s('path', { d: grid(94, 34, 2, 8, 5, 6, 9, 12) }, 'white'),
    ground(),
    s('path', { d: 'M90 26l11-12 11 12', ...SW(3) }, 'dark', { stroke: true })
  ],
  pelusa: [
    s('path', { d: burst(80, 82, 52, 38, 22) }, 'gray', { accent: true }),
    s('circle', { cx: 80, cy: 82, r: 36 }, 'gray'),
    s('path', { d: 'M56 70q14-10 30 2t26 0M54 92q16 8 34-4t24 4M64 106q10-6 20 2', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M120 120q10 6 16 18', ...SW(3) }, 'gray', { stroke: true }),
    ground(140)
  ],
  peyorativo: [
    s('path', { d: bubble(20, 18, 120, 96) }, 'gray'),
    s('path', { d: 'M80 34v40', ...SW(10) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M60 70l20 24 20-24z' }, 'red', { accent: true }),
    ...face(126, 126, 18, 'yellow', 'frown')
  ],
  piadoso: [
    s('circle', { cx: 74, cy: 46, r: 30 }, 'cream'),
    s('circle', { cx: 74, cy: 50, r: 14 }, 'skin'),
    s('path', { d: 'M56 136V82q0-16 18-16t18 16v54z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 96l8-22 8 22z' }, 'skin'),
    s('rect', { x: 116, y: 104, width: 12, height: 32, rx: 2 }, 'white'),
    outline({ x: 116, y: 104, width: 12, height: 32, rx: 2 }),
    s('path', { d: drop(122, 92, 5) }, 'orange'),
    ground()
  ],
  pollito: [
    s('path', { d: 'M38 112l8 8 8-8 8 8 8-8 8 8 8-8 8 8 8-8 8 8 8-8v6q0 26-42 26t-42-26z' }, 'white'),
    s('path', { d: 'M38 112l8 8 8-8 8 8 8-8 8 8 8-8 8 8 8-8 8 8 8-8v6q0 26-42 26t-42-26z', ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 80, cy: 98, rx: 32, ry: 26 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 58, r: 22 }, 'yellow'),
    s('path', { d: 'M98 58l14 4-14 6z' }, 'orange'),
    s('circle', { cx: 88, cy: 54, r: 3 }, 'dark'),
    s('path', { d: 'M76 36q4-10 10-6', ...SW(3) }, 'yellow', { stroke: true })
  ],
  presupuestal: [
    s('rect', { x: 24, y: 26, width: 62, height: 96, rx: 8 }, 'navy', { accent: true }),
    s('rect', { x: 32, y: 34, width: 46, height: 20, rx: 3 }, 'mint'),
    s('path', { d: rects([[32, 62, 12, 10], [49, 62, 12, 10], [66, 62, 12, 10], [32, 80, 12, 10], [49, 80, 12, 10], [66, 80, 12, 10], [32, 98, 12, 10], [49, 98, 12, 10], [66, 98, 12, 10]]) }, 'gray'),
    s('path', { d: ells([[114, 128, 22, 7], [114, 118, 22, 7], [114, 108, 22, 7], [114, 98, 22, 7]]) }, 'yellow'),
    s('path', { d: 'M92 128h44M92 118h44M92 108h44', ...SW(2) }, 'orange', { stroke: true })
  ],
  primordialmente: [
    s('circle', { cx: 74, cy: 86, r: 54 }, 'red'),
    s('circle', { cx: 74, cy: 86, r: 40 }, 'white'),
    s('circle', { cx: 74, cy: 86, r: 26 }, 'red'),
    s('circle', { cx: 74, cy: 86, r: 12 }, 'yellow', { accent: true }),
    s('path', { d: 'M76 84l60-50', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M128 34l8-14 6 6-6 6 10 2-6 6z' }, 'green')
  ],
  proeza: [
    s('path', { d: 'M30 44h100', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: ells([[30, 44, 10, 22], [130, 44, 10, 22]]) }, 'dark', { accent: true }),
    s('path', { d: 'M62 44l8 30M98 44l-8 30', ...SW(8) }, 'skin', { stroke: true }),
    ...person(80, 138, 'red', { h: 44, w: 32 }),
    s('path', { d: sparkle(20, 96, 9) + sparkle(140, 96, 9) + sparkle(80, 18, 7) }, 'yellow')
  ],
  profusamente: [
    ...face(80, 82, 44, 'pink', 'flat', { accent: true }),
    s('path', { d: drop(28, 58, 7) + drop(132, 50, 8) + drop(22, 100, 6) + drop(140, 96, 7) + drop(118, 126, 6) + drop(44, 130, 6) + drop(110, 50, 5) }, 'sky'),
    s('path', { d: drop(56, 54, 6) }, 'blue')
  ],
  prontamente: [
    ...lean(86, 136, 20, 'green', { accent: true }),
    s('path', { d: 'M92 114l22 22M82 116l-16 20', ...SW(8) }, 'green', { stroke: true }),
    s('path', { d: 'M18 70h34M24 88h30M18 106h30', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 130, cy: 36, r: 16 }, 'white'),
    s('circle', { cx: 130, cy: 36, r: 16, ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M130 26v10h8', ...SW(3) }, 'dark', { stroke: true })
  ],
  pujante: [
    s('path', { d: 'M20 136l30-24 26 8 30-34 34-20', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M104 30l26-14-6 28z' }, 'gray'),
    s('path', { d: 'M96 70q-4-30 32-50q4 40-22 58z' }, 'red', { accent: true }),
    s('circle', { cx: 112, cy: 50, r: 6 }, 'sky'),
    s('path', { d: 'M96 72l-10 16 18-8z' }, 'orange'),
    s('path', { d: 'M88 76l-6-4M94 82l-2 8', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M20 140h120', ...SW(3) }, 'gray', { stroke: true })
  ],
  punible: [
    s('rect', { x: 50, y: 30, width: 56, height: 28, rx: 6, transform: 'rotate(-30 78 44)' }, 'brown', { accent: true }),
    s('path', { d: 'M88 58l30 40', ...SW(9) }, 'brown', { stroke: true }),
    s('rect', { x: 24, y: 112, width: 76, height: 16, rx: 4 }, 'brown'),
    s('rect', { x: 36, y: 102, width: 52, height: 12, rx: 3 }, 'tan'),
    s('path', { d: 'M24 86l-8-8M48 80v-12M70 86l8-8', ...SW(4) }, 'orange', { stroke: true }),
    ground(136)
  ],
  quietud: [
    backdrop('navy', 14, 80),
    s('rect', { x: 14, y: 90, width: 132, height: 56, rx: 4 }, 'blue'),
    s('circle', { cx: 80, cy: 52, r: 18 }, 'cream', { accent: true }),
    s('path', { d: 'M66 104h28M70 116h20M74 128h12', ...SW(4) }, 'cream', { stroke: true }),
    s('path', { d: star(32, 34, 4) + star(126, 30, 5) + star(118, 70, 3) }, 'yellow'),
    s('path', { d: 'M14 90h132', ...SW(2) }, 'sky', { stroke: true })
  ],
  quinteto: [
    s('path', { d: busts([28, 54, 80, 106, 132], 136, 20, 30) }, 'navy', { accent: true }),
    s('path', { d: dots([[28, 96], [54, 96], [80, 96], [106, 96], [132, 96]], 9) }, 'skin'),
    ...note(52, 54, 'purple'),
    ...note(104, 42, 'orange').map(sh => ({ ...sh, accent: false }))
  ],
  racionalizar: [
    s('path', { d: 'M20 50q10-30 22 0t-8 20 20-26 10 22-14 4', ...SW(4) }, 'gray', { stroke: true }),
    arrow('M62 60h26'),
    s('path', { d: 'M84 50l12 10-12 10z' }, 'orange'),
    s('path', { d: rects([[104, 34, 38, 10], [104, 48, 38, 10], [104, 62, 38, 10], [104, 76, 38, 10]]) }, 'blue', { accent: true }),
    s('rect', { x: 26, y: 104, width: 108, height: 32, rx: 6 }, 'tan'),
    s('path', { d: 'M38 120h84', ...SW(4) }, 'brown', { stroke: true })
  ],
  racionalmente: [
    s('path', { d: HEAD }, 'skin'),
    s('path', { d: 'M48 58q4-26 34-28q30 2 34 26q0 22-34 24q-34-2-34-22z' }, 'pink', { accent: true }),
    s('path', { d: 'M82 32v44M62 46q10 6 0 18M102 46q-10 6 0 18', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M54 104h52M80 96v12M60 104l-6 12h12zM100 104l-6 12h12z', ...SW(3) }, 'navy', { stroke: true })
  ],
  rentar: [
    s('path', { d: 'M18 76l44-38 44 38z' }, 'red'),
    s('rect', { x: 28, y: 74, width: 68, height: 62 }, 'cream'),
    s('rect', { x: 52, y: 100, width: 20, height: 36 }, 'brown'),
    s('circle', { cx: 120, cy: 64, r: 12, ...SW(6) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M120 76v48M120 104h10M120 116h8', ...SW(6) }, 'yellow', { stroke: true }),
    ground()
  ],
  repollo: [
    s('circle', { cx: 80, cy: 86, r: 52 }, 'green'),
    s('circle', { cx: 80, cy: 90, r: 38 }, 'mint', { accent: true }),
    s('path', { d: 'M80 128V60M80 90l-22-20M80 100l22-22M80 112l-26-14M80 116l24-12', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M30 74q20 16 22 52M130 74q-20 16-22 52', ...SW(3) }, 'mint', { stroke: true })
  ],
  revitalizar: [
    s('path', { d: 'M28 136l6-26h28l6 26z' }, 'brown'),
    s('path', { d: 'M48 110q0-20-14-26', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: leaflet(34, 84, 110, 18, 6) }, 'tan'),
    arrow('M74 92h16'),
    s('path', { d: 'M88 84l10 8-10 8z' }, 'orange'),
    s('path', { d: 'M100 136l6-26h28l6 26z' }, 'brown'),
    s('path', { d: 'M120 110V52', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(120, 76, -150, 26, 9) + leaflet(120, 64, -30, 26, 9) + leaflet(120, 54, -90, 20, 7) }, 'green', { accent: true }),
    s('path', { d: sparkle(142, 40, 7) + sparkle(98, 44, 6) }, 'yellow')
  ],
  rocoso: [
    backdrop('sky'),
    s('path', { d: 'M14 146V96l24-30 18 16 26-46 26 34 18-12 20 28v60z' }, 'gray', { accent: true }),
    s('path', { d: 'M82 36l-10 30 14 10M38 66l-4 22M126 78l-6 20', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: ells([[40, 130, 18, 10], [96, 132, 22, 10]]) }, 'brown'),
    s('path', { d: ells([[124, 134, 12, 7]]) }, 'tan')
  ],
  'románico': [
    s('path', { d: 'M24 136V68h112v68z' }, 'tan', { accent: true }),
    s('path', { d: 'M18 70l62-36 62 36z' }, 'brown'),
    s('path', { d: 'M64 136v-30a16 16 0 0 1 32 0v30z' }, 'brown'),
    s('path', { d: 'M60 136v-30a20 20 0 0 1 40 0v30', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M36 100v-12a6 6 0 0 1 12 0v12zM112 100v-12a6 6 0 0 1 12 0v12z' }, 'dark'),
    s('circle', { cx: 80, cy: 58, r: 7 }, 'yellow'),
    ground()
  ],
  rugido: [
    s('path', { d: burst(66, 80, 52, 40, 14) }, 'brown'),
    s('circle', { cx: 66, cy: 80, r: 38 }, 'orange', { accent: true }),
    s('path', { d: dots([[52, 66], [80, 66]], 4) }, 'dark'),
    s('path', { d: 'M48 88q18-6 36 0q2 28-18 28t-18-28z' }, 'dark'),
    s('path', { d: 'M52 90l5 7 5-6 5 6 5-6 5 6 5-7', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M120 62q10 18 0 36M132 52q16 28 0 56M144 44q20 36 0 72', ...SW(4) }, 'gray', { stroke: true })
  ],
  'sacristán': [
    s('circle', { cx: 66, cy: 40, r: 14 }, 'skin'),
    s('path', { d: 'M52 56h28l12 80H40z' }, 'dark'),
    s('path', { d: 'M54 56h24v24H54z' }, 'white'),
    outline({ x: 54, y: 56, width: 24, height: 24 }),
    s('rect', { x: 108, y: 70, width: 12, height: 44, rx: 2 }, 'cream', { accent: true }),
    s('path', { d: 'M98 114h32l-6 22h-20z' }, 'yellow'),
    s('path', { d: drop(114, 60, 5) }, 'orange'),
    s('path', { d: 'M82 96l24-4', ...SW(6) }, 'skin', { stroke: true })
  ],
  saltamontes: [
    s('path', { d: 'M28 92q4-20 50-20q36 0 46 16q-4 12-46 14q-42 0-50-10z' }, 'green', { accent: true }),
    s('circle', { cx: 120, cy: 84, r: 14 }, 'green'),
    s('circle', { cx: 126, cy: 80, r: 4 }, 'dark'),
    s('path', { d: 'M62 86l34-36 10 58', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M100 98l-4 24M86 100l-8 22M124 70q-6-30-30-44M130 72q4-28 16-42', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M36 84q30-8 60 0', ...SW(3) }, 'mint', { stroke: true }),
    ground(124)
  ],
  sensiblemente: [
    s('path', { d: 'M22 112a58 58 0 0 1 116 0', ...SW(14) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 62a58 58 0 0 1 28 50', ...SW(14) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M80 112l38-40', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 112, r: 9 }, 'dark'),
    s('path', { d: 'M30 32q14-10 30-4', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M56 20l8 8-10 6z' }, 'orange'),
    s('rect', { x: 22, y: 128, width: 116, height: 8, rx: 4 }, 'gray')
  ],
  sigma: [
    s('path', { d: 'M18 130q30 0 44-50q10-44 18-44t18 44q14 50 44 50z' }, 'sky'),
    s('path', { d: 'M60 130v-56q10-38 20-38t20 38v56z' }, 'blue', { accent: true }),
    s('path', { d: 'M18 130q30 0 44-50q10-44 18-44t18 44q14 50 44 50', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: 'M80 36v94', ...SW(3, { 'stroke-dasharray': '6 6' }) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 132h132', ...SW(4) }, 'dark', { stroke: true })
  ],
  socialdemocracia: [
    s('rect', { x: 50, y: 56, width: 60, height: 52, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: 'M64 56h32', ...SW(4) }, 'navy', { stroke: true }),
    s('rect', { x: 68, y: 28, width: 24, height: 30, rx: 2, transform: 'rotate(8 80 43)' }, 'white'),
    outline({ x: 68, y: 28, width: 24, height: 30, rx: 2 }),
    s('path', { d: heart(80, 76, 12) }, 'red'),
    s('path', { d: busts([24, 48, 112, 136], 140, 20, 26) }, 'orange'),
    s('path', { d: dots([[24, 106], [48, 106], [112, 106], [136, 106]], 8) }, 'skin')
  ],
  sordera: [
    s('path', { d: 'M60 120q-6-12 6-26q-22-6-22-36q0-28 32-30q32 2 32 34q0 22-18 32q-6 4-6 16q0 16-14 16z' }, 'skin', { accent: true }),
    s('path', { d: 'M66 58q2-12 14-12q12 2 10 16q-2 10-14 12', ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: 'M118 50q10 14 0 28M130 40q16 24 0 48', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 30l36 60', ...SW(6) }, 'red', { stroke: true })
  ],
  sultana: [
    s('path', { d: 'M48 136q4-56 32-56t32 56z' }, 'purple', { accent: true }),
    s('path', { d: 'M56 80q0-36 24-36t24 36q-12-8-24-8t-24 8z' }, 'pink'),
    s('circle', { cx: 80, cy: 64, r: 14 }, 'skin'),
    s('path', { d: 'M64 46l6-14 10 10 10-10 6 14z' }, 'yellow'),
    s('circle', { cx: 80, cy: 38, r: 3 }, 'red'),
    s('path', { d: dots([[72, 100], [80, 108], [88, 100]], 3) }, 'yellow'),
    s('path', { d: sparkle(32, 46, 8) + sparkle(128, 46, 8) }, 'yellow')
  ],
  'símil': [
    s('path', { d: 'M48 54q-24 0-24 30q0 30 24 44q24-14 24-44q0-30-24-30z' }, 'red', { accent: true }),
    s('path', { d: 'M112 54q-24 0-24 30q0 30 24 44q24-14 24-44q0-30-24-30z' }, 'pink'),
    s('path', { d: 'M48 54q0-14 8-22M112 54q0-14 8-22', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(56, 34, -30, 16, 5) + leaflet(120, 34, -30, 16, 5) }, 'green'),
    s('path', { d: 'M60 144h40', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M64 138l-8 6 8 6M96 138l8 6-8 6', ...SW(4) }, 'orange', { stroke: true })
  ],
  tachar: [
    ...paper(22, 26, 100, 110),
    s('path', { d: 'M36 50h72M36 70h72M36 110h60', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 90h72', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 92l86-6', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M118 86l26-50 8 4-26 50-10 4z' }, 'yellow'),
    s('path', { d: 'M142 36l3-6 8 4-3 6z' }, 'pink')
  ],
  tropiezo: [
    s('path', { d: 'M88 136q0-20 18-20t18 20z' }, 'gray'),
    ...lean(78, 132, 55, 'blue', { h: 40, w: 24, r: 11, accent: true }),
    s('path', { d: 'M78 132l26-8M78 132l-22 4', ...SW(8) }, 'navy', { stroke: true }),
    s('path', { d: 'M136 70l12-6M138 86h12M130 56l6-10', ...SW(4) }, 'orange', { stroke: true }),
    ground()
  ],
  'tubérculo': [
    s('rect', { x: 14, y: 70, width: 132, height: 72, rx: 4 }, 'brown'),
    s('path', { d: 'M80 70V26M80 46q-20-10-30-4M80 38q18-10 28-2', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(50, 42, 180, 16, 6) + leaflet(108, 36, 0, 16, 6) + leaflet(80, 26, -90, 14, 6) }, 'green'),
    s('path', { d: 'M80 70q-10 20-34 30M80 70q4 30 2 44M80 70q14 18 38 22', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: ells([[42, 106, 16, 12], [82, 120, 18, 13], [120, 98, 15, 11]]) }, 'tan', { accent: true }),
    s('path', { d: dots([[36, 104], [78, 118], [88, 124], [124, 96]], 2) }, 'brown')
  ],
  'tándem': [
    s('path', { d: ring(32, 112, 20) + ring(128, 112, 20), ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M32 112l26-36h56l14 36M58 76l22 36 34-36M80 112l-26-36', ...SW(5) }, 'red', { stroke: true, accent: true }),
    ...lean(58, 76, -10, 'blue', { h: 30, w: 18, r: 9 }),
    ...lean(102, 76, -10, 'orange', { h: 30, w: 18, r: 9 }),
    s('path', { d: 'M114 76l10-16', ...SW(4) }, 'dark', { stroke: true })
  ],
  ultrasonido: [
    s('rect', { x: 18, y: 22, width: 124, height: 92, rx: 8 }, 'dark'),
    s('path', { d: 'M80 32l-46 72h92z' }, 'gray', { accent: true }),
    s('path', { d: 'M56 86q24-26 48 0q-6 14-24 14t-24-14z' }, 'black'),
    s('path', { d: 'M64 88q4-12 16-12t14 10q-6 6-12 2q-6 6-18 0z' }, 'white'),
    s('path', { d: 'M80 114v14', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 48, y: 128, width: 64, height: 10, rx: 4 }, 'gray')
  ],
  vacunar: [
    s('path', { d: 'M14 76q40-10 90-4q30 4 42 20v28q-30-10-62-8q-40 2-70-6z' }, 'skin'),
    s('rect', { x: 62, y: 84, width: 24, height: 18, rx: 4 }, 'tan'),
    s('rect', { x: 78, y: 30, width: 44, height: 18, rx: 3, transform: 'rotate(40 100 39)' }, 'sky', { accent: true }),
    s('path', { d: 'M86 60l-10-10M118 22l12 14M124 16l-12 12', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 24q12 0 12 12v10q0 12-12 16q-12-4-12-16V36q0-12 12-12z' }, 'green'),
    s('path', { d: 'M34 42l5 6 8-10', ...SW(3) }, 'white', { stroke: true })
  ],
  valientemente: [
    s('path', { d: 'M30 60q-10 40 14 76h30z' }, 'red'),
    ...person(64, 138, 'blue', { h: 50, w: 30 }),
    s('path', { d: 'M90 70h36v26q0 22-18 30q-18-8-18-30z' }, 'gray', { accent: true }),
    s('path', { d: 'M108 78v36M96 92h24', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M126 30l14-10M132 46h12M120 20l4-8', ...SW(4) }, 'orange', { stroke: true })
  ],
  vegetar: [
    s('rect', { x: 14, y: 92, width: 132, height: 30, rx: 10 }, 'purple'),
    s('rect', { x: 14, y: 70, width: 30, height: 52, rx: 10 }, 'purple'),
    s('rect', { x: 44, y: 80, width: 74, height: 16, rx: 8 }, 'green', { accent: true }),
    s('circle', { cx: 128, cy: 82, r: 12 }, 'skin'),
    s('path', { d: 'M128 70V44', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(128, 52, -150, 20, 7) + leaflet(128, 46, -30, 20, 7) }, 'green'),
    s('path', { d: 'M24 122v12M136 122v12', ...SW(6) }, 'dark', { stroke: true })
  ],
  ventral: [
    s('path', { d: 'M24 80q30-40 80-30q20 6 30 30q-10 24-30 30q-50 10-80-30z' }, 'blue'),
    s('path', { d: 'M30 86q40 30 100 0q-10 18-26 24q-44 10-74-24z' }, 'yellow', { accent: true }),
    s('path', { d: 'M28 80l-14-16v32z' }, 'blue'),
    s('circle', { cx: 116, cy: 72, r: 4 }, 'dark'),
    arrow('M80 140v-18'),
    s('path', { d: 'M72 124l8-10 8 10z' }, 'orange')
  ],
  vicisitud: [
    s('path', { d: 'M14 136V100l22-40 22 50 24-70 24 60 20-30 20 30v36z' }, 'green', { accent: true }),
    s('path', { d: 'M14 100l22-40 22 50 24-70 24 60 20-30 20 30', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 82, cy: 32, r: 6 }, 'red'),
    s('circle', { cx: 32, cy: 30, r: 11 }, 'yellow'),
    s('path', { d: 'M110 30q4-12 16-8q8-8 16 2q4 10-6 12h-22q-8-2-4-6z' }, 'gray'),
    s('path', { d: 'M118 44l-2 8M128 44l-2 8M138 44l-2 8', ...SW(3) }, 'blue', { stroke: true }),
    ground(138)
  ],
  alfiler: [
    s('path', { d: 'M24 112q0-46 56-46t56 46z' }, 'red', { accent: true }),
    s('rect', { x: 20, y: 110, width: 120, height: 20, rx: 6 }, 'brown'),
    s('path', { d: 'M54 88L40 40M80 86V30M104 88l16-46', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[40, 38], [120, 40]], 7) }, 'yellow'),
    s('path', { d: dots([[80, 28]], 7) }, 'blue'),
    s('path', { d: 'M40 96q20-16 40 0t40 0', ...SW(3) }, 'pink', { stroke: true })
  ],
  ambientalista: [
    ...person(52, 138, 'green', { h: 48 }),
    s('circle', { cx: 108, cy: 72, r: 30 }, 'blue', { accent: true }),
    s('path', { d: 'M92 56q10-6 16 4q-6 10 4 14q-4 14-14 10q-10-12-6-28zM118 82q10 0 14 8q-6 8-14 4z' }, 'green'),
    s('path', { d: 'M68 108q12-6 20-16', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: leaflet(108, 38, -60, 22, 7) }, 'green')
  ],
  anagrama: [
    s('path', { d: rects([[18, 30, 26, 26], [50, 30, 26, 26], [84, 30, 26, 26], [116, 30, 26, 26]]) }, 'tan'),
    s('rect', { x: 18, y: 30, width: 26, height: 26, rx: 3 }, 'red', { accent: true }),
    s('rect', { x: 116, y: 30, width: 26, height: 26, rx: 3 }, 'blue'),
    s('path', { d: rects([[18, 104, 26, 26], [50, 104, 26, 26], [84, 104, 26, 26], [116, 104, 26, 26]]) }, 'tan'),
    s('rect', { x: 116, y: 104, width: 26, height: 26, rx: 3 }, 'red'),
    s('rect', { x: 18, y: 104, width: 26, height: 26, rx: 3 }, 'blue'),
    s('path', { d: 'M32 62l94 34M128 62L34 96', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M118 88l10 10-14 2zM42 88l-10 10 14 2z' }, 'orange')
  ],
  antagonismo: [
    ...lean(36, 138, 12, 'blue'),
    ...lean(124, 138, -12, 'red', { accent: true }),
    s('path', { d: 'M84 46l-12 26h16l-12 30', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M54 104h14M92 104h14', ...SW(7) }, 'skin', { stroke: true }),
    ground(140)
  ],
  apreciable: [
    s('path', { d: 'M18 136q8-60 62-62q54 2 62 62z' }, 'yellow', { accent: true }),
    s('path', { d: ells([[50, 116, 10, 5], [80, 104, 10, 5], [110, 118, 10, 5], [66, 90, 10, 5], [96, 88, 10, 5], [36, 130, 10, 5], [124, 130, 10, 5], [80, 126, 10, 5]]) }, 'orange'),
    s('path', { d: ells([[80, 70, 12, 6]]) }, 'orange'),
    s('path', { d: sparkle(24, 70, 9) + sparkle(134, 56, 10) + sparkle(56, 40, 7) }, 'yellow'),
    ground(138)
  ],
  ardid: [
    s('path', { d: 'M30 110V78q0-10 10-10h60l10-34h20l6 14-10 4-6 26v32z' }, 'brown', { accent: true }),
    s('path', { d: 'M110 36q-10 10-10 30', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: 'M40 110v14M60 110v14M90 110v14M110 110v14', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 26, y: 120, width: 96, height: 8, rx: 2 }, 'tan'),
    s('path', { d: dots([[38, 132], [110, 132]], 8) }, 'dark'),
    s('circle', { cx: 122, cy: 44, r: 3 }, 'dark'),
    s('rect', { x: 52, y: 80, width: 22, height: 16, rx: 2 }, 'dark')
  ],
  autosuficiencia: [
    s('path', { d: 'M20 76l40-34 40 34z' }, 'red'),
    s('rect', { x: 28, y: 74, width: 64, height: 62 }, 'cream'),
    s('path', { d: 'M40 58l22-14 26 18-22 14z' }, 'navy', { accent: true }),
    s('rect', { x: 52, y: 104, width: 18, height: 32 }, 'brown'),
    s('circle', { cx: 130, cy: 32, r: 12 }, 'yellow'),
    s('path', { d: 'M104 136v-20M118 136v-24M132 136v-20', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots([[104, 112], [118, 108], [132, 112]], 7) }, 'red'),
    ground()
  ],
  azotar: [
    backdrop('gray'),
    s('path', { d: 'M34 30q14-10 26 0q14-8 22 6q10 4 4 14H30q-8-10 4-20z' }, 'dark'),
    s('rect', { x: 92, y: 54, width: 48, height: 82, rx: 3 }, 'sky'),
    s('path', { d: 'M116 54v82M92 94h48', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M36 60q30 10 50 40M28 74q34 14 50 46M44 54q30 4 44 26', ...SW(5) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M20 120q10-10 22-2', ...SW(4) }, 'white', { stroke: true })
  ],
  baca: [
    s('path', { d: 'M22 104v-20q0-6 6-6h18l14-20h52l16 20h8q6 0 6 6v20z' }, 'red', { accent: true }),
    s('path', { d: 'M66 64h18v14H60zM90 64h18l10 14H90z' }, 'sky'),
    s('path', { d: 'M54 48h66M60 48v10M114 48v10', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 58, y: 24, width: 32, height: 22, rx: 3 }, 'orange'),
    s('rect', { x: 92, y: 30, width: 24, height: 16, rx: 3 }, 'blue'),
    s('path', { d: dots([[48, 106], [116, 106]], 12) }, 'dark'),
    s('path', { d: dots([[48, 106], [116, 106]], 5) }, 'gray'),
    ground(120)
  ],
  batata: [
    s('path', { d: 'M18 98q10-40 54-46q50-6 70 24q-14 40-64 44q-50 2-60-22z' }, 'purple'),
    s('ellipse', { cx: 112, cy: 84, rx: 18, ry: 30, transform: 'rotate(20 112 84)' }, 'orange', { accent: true }),
    s('path', { d: 'M40 80q4 10 0 20M62 70q4 10 0 20M80 92q4 8 0 16', ...SW(3) }, 'pink', { stroke: true }),
    s('path', { d: 'M18 98q-6 4-6 10', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M124 34q-4 10-14 14M134 40q-6 6-14 8', ...SW(3) }, 'gray', { stroke: true })
  ],
  biliar: [
    s('path', { d: 'M18 70q10-34 62-30q48 2 62 24q-8 30-50 36q-46 6-74-30z' }, 'brown'),
    s('path', { d: 'M74 92q-6 30 16 34q18-2 12-26q-4-10-8-14z' }, 'green', { accent: true }),
    s('path', { d: 'M90 90v-14q0-8 8-8h20', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M40 62q20 10 36 6', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: dots([[94, 112]], 4) }, 'mint')
  ],
  'biológicamente': [
    s('path', { d: 'M54 20q52 30 0 60t0 60', ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M106 20q-52 30 0 60t0 60', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M62 30h36M70 44h20M70 64h20M62 80h36M70 96h20M70 116h20M62 130h36', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: leaflet(116, 108, -40, 30, 10) }, 'green'),
    s('path', { d: dots([[30, 50], [36, 104]], 8) }, 'mint')
  ],
  bovino: [
    s('path', { d: 'M46 50q-22-6-28-24q18 2 30 12zM114 50q22-6 28-24q-18 2-30 12z' }, 'cream'),
    s('path', { d: 'M38 62l-22 4 18 12zM122 62l22 4-18 12z' }, 'brown'),
    s('path', { d: 'M46 52q34-14 68 0v44q0 18-34 18t-34-18z' }, 'brown', { accent: true }),
    s('path', { d: 'M74 52h12v22h-12z' }, 'white'),
    s('ellipse', { cx: 80, cy: 112, rx: 30, ry: 18 }, 'pink'),
    s('path', { d: ells([[70, 112, 5, 7], [90, 112, 5, 7]]) + dots([[62, 76], [98, 76]], 5) }, 'dark')
  ],
  'bretón': [
    s('path', { d: 'M50 24q30 14 60 0l30 24-12 22-16-8v74H48V62l-16 8-12-22z' }, 'white'),
    s('path', { d: 'M48 50h64M48 66h64M48 82h64M48 98h64M48 114h64M48 130h64', ...SW(7, { 'stroke-linecap': 'butt' }) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M50 24q30 14 60 0l30 24-12 22-16-8v74H48V62l-16 8-12-22z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M54 26q26 16 52 0', ...SW(4) }, 'red', { stroke: true })
  ],
  brillantez: [
    s('path', { d: 'M40 58l16-22h48l16 22-40 70z' }, 'sky', { accent: true }),
    s('path', { d: 'M40 58h80M56 36l10 22 14-22 14 22 10-22M66 58l14 70 14-70', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: sparkle(26, 34, 10) + sparkle(134, 30, 9) + sparkle(130, 106, 8) + sparkle(28, 104, 7) }, 'yellow'),
    s('path', { d: 'M62 44l-6 12', ...SW(4) }, 'white', { stroke: true })
  ],
  'cantábrico': [
    backdrop('sky', 14, 60),
    s('rect', { x: 14, y: 70, width: 132, height: 76, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: 'M14 146V48q20-10 30 4l12 22-4 72z' }, 'green'),
    s('path', { d: 'M14 146V68q20 4 30 22l8 56z' }, 'gray'),
    s('path', { d: 'M64 96q10-8 20 0t20 0 20 0M76 120q10-8 20 0t20 0 20 0', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M100 66h30l-6 8h-18z' }, 'red'),
    s('path', { d: 'M114 66V44l12 18z' }, 'white')
  ],
  caoba: [
    s('rect', { x: 14, y: 58, width: 132, height: 18, rx: 3 }, 'brown', { accent: true }),
    s('rect', { x: 22, y: 76, width: 40, height: 60 }, 'brown'),
    s('rect', { x: 120, y: 76, width: 18, height: 60 }, 'brown'),
    s('path', { d: 'M28 92h28M28 112h28', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: dots([[42, 102], [42, 122]], 3) }, 'yellow'),
    s('path', { d: 'M24 66q30-6 60 0t56-2', ...SW(2) }, 'red', { stroke: true }),
    s('rect', { x: 94, y: 40, width: 22, height: 18, rx: 3 }, 'green'),
    ground()
  ],
  caperuza: [
    s('path', { d: 'M80 18q-40 30-44 118h88q-4-88-44-118z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 66, r: 18 }, 'skin'),
    s('path', { d: dots([[73, 64], [87, 64]], 2.5) }, 'dark'),
    s('path', { d: 'M74 74q6 4 12 0', ...SW(2.5) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 60q18-24 36 0', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M60 90q20 10 40 0', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M114 104l20 4-4 26-20-2z' }, 'tan')
  ],
  'carátula': [
    s('circle', { cx: 100, cy: 80, r: 46 }, 'dark'),
    s('circle', { cx: 100, cy: 80, r: 12 }, 'red'),
    s('rect', { x: 18, y: 30, width: 100, height: 100, rx: 3 }, 'purple', { accent: true }),
    s('circle', { cx: 68, cy: 70, r: 22 }, 'yellow'),
    s('path', { d: 'M18 130l34-40 24 24 18-16 24 32z' }, 'pink'),
    s('path', { d: star(100, 46, 6) }, 'white')
  ],
  chacal: [
    s('path', { d: 'M34 98v36M48 100v34M92 100v34M104 98v36', ...SW(7) }, 'tan', { stroke: true }),
    s('path', { d: 'M30 92q-16 10-14 34', ...SW(8) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 70, cy: 92, rx: 42, ry: 16 }, 'tan', { accent: true }),
    s('path', { d: 'M100 86l10-30 4-22 8 16 6-14 4 26 22 14-6 8-24-4z' }, 'tan'),
    s('path', { d: 'M114 34l6 14 4-10z' }, 'brown'),
    s('circle', { cx: 126, cy: 60, r: 3 }, 'dark'),
    s('path', { d: dots([[146, 72]], 3) }, 'dark')
  ],
  'cirílico': [
    ...openBook(80, 34),
    s('path', { d: 'M36 50q4-6 8 0t8 0 8 0 8 0M36 64q4-6 8 0t8 0 8 0M36 78q4-6 8 0t8 0 8 0 8 0M92 50q4-6 8 0t8 0 8 0 8 0M92 64q4-6 8 0t8 0 8 0M92 78q4-6 8 0t8 0', ...SW(3) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M126 120l18-40 6 2-16 40z' }, 'blue'),
    s('path', { d: 'M126 120l-2 10 8-8z' }, 'dark')
  ],
  clientelismo: [
    s('path', { d: 'M14 100h34l18-10 14 6', ...SW(12) }, 'skin', { stroke: true }),
    s('path', { d: 'M146 70h-34l-16 10', ...SW(12) }, 'skin', { stroke: true }),
    s('path', { d: 'M62 50q0-14 12-14h16q12 0 12 14l6 32H56z' }, 'green', { accent: true }),
    s('path', { d: 'M70 36l10-12 10 12', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 82, cy: 62, r: 9 }, 'yellow'),
    s('rect', { x: 90, y: 100, width: 34, height: 26, rx: 2 }, 'white'),
    outline({ x: 90, y: 100, width: 34, height: 26, rx: 2 }),
    s('path', { d: 'M98 112l5 6 12-12', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M110 96l-4-18', ...SW(10) }, 'skin', { stroke: true })
  ],
  colonizar: [
    backdrop('sky'),
    s('rect', { x: 14, y: 110, width: 132, height: 36, rx: 4 }, 'blue'),
    s('path', { d: 'M36 112q4-24 44-26q40 2 44 26z' }, 'tan'),
    s('path', { d: 'M80 88V30', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 30h34l-8 12 8 12H80z' }, 'red', { accent: true }),
    s('path', { d: 'M100 98v-14M100 84q-12 4-14 10M100 84q12 2 16 10', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M22 104h22l-4 8H26zM33 104V88l8 12z' }, 'brown')
  ],
  conciliador: [
    ...person(30, 138, 'blue', { h: 42, w: 26, r: 11 }),
    ...person(130, 138, 'red', { h: 42, w: 26, r: 11 }),
    ...person(80, 138, 'green', { h: 50, w: 28, r: 12, accent: true }),
    s('path', { d: 'M44 106l20 0M116 106H96', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M80 48q0-20 10-30', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(82, 40, -150, 14, 5) + leaflet(86, 30, -30, 14, 5) }, 'green'),
    s('path', { d: dots([[64, 106], [96, 106]], 6) }, 'skin')
  ],
  contagiar: [
    ...face(42, 78, 26, 'pink', 'flat'),
    s('path', { d: 'M54 86q8 4 8 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[76, 72], [86, 86], [82, 62], [96, 76], [92, 96], [104, 66]], 3) }, 'green', { accent: true }),
    ...face(126, 78, 22, 'mint', 'frown'),
    s('path', { d: 'M24 120q18 10 36 0M108 120q18 10 36 0', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: drop(136, 60, 4) }, 'sky')
  ],
  copete: [
    s('path', { d: HEAD }, 'skin'),
    s('path', { d: 'M34 70q-4-40 30-54q20-12 52-6q20 6 18 18q-30-8-44 2q20 6 22 20q-30-10-50 2q-8 6-8 26z' }, 'dark', { accent: true }),
    s('path', { d: 'M60 30q20-12 52-8', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 104, cy: 66, r: 3.5 }, 'dark'),
    s('path', { d: 'M118 96q-8 4-12 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  corsario: [
    s('path', { d: 'M18 106h124l-18 28H34z' }, 'brown', { accent: true }),
    s('path', { d: 'M56 106V24M104 106V36', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M38 34h36q6 24 0 46H38q6-22 0-46zM88 46h32q6 20 0 40H88q6-20 0-40z' }, 'cream'),
    s('path', { d: 'M56 24h22l-6 6 6 6H56z' }, 'black'),
    s('path', { d: dots([[60, 116], [80, 116], [100, 116]], 4) }, 'dark'),
    s('path', { d: 'M14 140q12-8 24 0t24 0 24 0 24 0 24 0', ...SW(4) }, 'blue', { stroke: true })
  ],
  cruelmente: [
    ...flower(48, 104, 'pink'),
    s('path', { d: 'M78 22h46v52q20 4 20 22v10H78z' }, 'dark', { accent: true }),
    s('path', { d: 'M78 98h66', ...SW(6) }, 'black', { stroke: true }),
    s('path', { d: 'M110 114v14M96 118l-6 10M124 118l6 10', ...SW(4) }, 'orange', { stroke: true }),
    ground()
  ],
  cutis: [
    s('ellipse', { cx: 66, cy: 78, rx: 40, ry: 50 }, 'skin', { accent: true }),
    s('path', { d: 'M28 70q4-46 40-46q34 0 38 40q-16-22-40-22q-22 0-38 28z' }, 'brown'),
    s('path', { d: 'M48 76q6-6 12 0M74 76q6-6 12 0M56 102q10 8 22 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: ells([[44, 92, 6, 4], [92, 92, 6, 4]]) }, 'pink'),
    s('path', { d: sparkle(118, 40, 9) + sparkle(110, 74, 6) }, 'yellow'),
    s('rect', { x: 110, y: 110, width: 36, height: 26, rx: 6 }, 'pink'),
    s('rect', { x: 108, y: 102, width: 40, height: 10, rx: 3 }, 'white'),
    outline({ x: 108, y: 102, width: 40, height: 10, rx: 3 }, 'gray', 2)
  ],
  'córnea': [
    s('path', { d: 'M14 80q66-60 132 0q-66 60-132 0z' }, 'white'),
    s('path', { d: 'M14 80q66-60 132 0q-66 60-132 0z', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 26 }, 'blue'),
    s('circle', { cx: 80, cy: 80, r: 11 }, 'black'),
    s('path', { d: 'M62 62q18-16 36 0', ...SW(5) }, 'sky', { stroke: true, accent: true }),
    s('circle', { cx: 88, cy: 72, r: 4 }, 'white'),
    s('path', { d: 'M100 36l12-14M80 32V16M60 36L48 22', ...SW(3) }, 'gray', { stroke: true })
  ],
  declinar: [
    backdrop('orange', 14, 96),
    s('circle', { cx: 80, cy: 104, r: 34 }, 'yellow', { accent: true }),
    s('rect', { x: 14, y: 104, width: 132, height: 42, rx: 4 }, 'navy'),
    arrow('M124 30q8 20 0 46', 'red', 6),
    s('path', { d: 'M114 70l10 14 8-14z' }, 'red'),
    s('path', { d: 'M40 118h80M56 130h48', ...SW(4) }, 'orange', { stroke: true })
  ],
  'desestabilización': [
    s('path', { d: 'M80 136l-18-30h36z' }, 'gray'),
    s('rect', { x: 18, y: 92, width: 124, height: 10, rx: 3, transform: 'rotate(-14 80 100)' }, 'brown', { accent: true }),
    s('rect', { x: 26, y: 70, width: 22, height: 22, transform: 'rotate(-14 37 81)' }, 'blue'),
    s('circle', { cx: 132, cy: 56, r: 12 }, 'red'),
    arrow('M132 74q8 10 6 22'),
    s('path', { d: 'M110 30l-6 8M124 26l-2 10M58 52l-8-4', ...SW(4) }, 'orange', { stroke: true }),
    ground()
  ],
  desgarrador: [
    s('path', { d: heart(80, 98, 32) }, 'red', { accent: true }),
    s('path', { d: 'M82 48l-10 16 14 14-12 16 10 18', ...SW(7) }, 'white', { stroke: true }),
    s('path', { d: drop(30, 126, 7) + drop(130, 130, 7) + drop(46, 142, 5) }, 'sky')
  ],
  desliz: [
    ...lean(60, 120, -35, 'purple', { h: 40, w: 24, r: 11, accent: true }),
    s('path', { d: 'M60 120l36 10M60 120l-20 14', ...SW(8) }, 'navy', { stroke: true }),
    s('path', { d: 'M90 134q14-14 32-4q-12 0-14 6q-8-4-18-2z' }, 'yellow'),
    s('path', { d: 'M100 112q10-4 16 2M112 100l8-8', ...SW(4) }, 'gray', { stroke: true }),
    ground(136)
  ],
  devorar: [
    s('circle', { cx: 74, cy: 82, r: 54 }, 'orange', { accent: true }),
    s('path', { d: dots([[54, 56], [94, 56]], 6) }, 'dark'),
    s('path', { d: 'M40 84q34-6 68 0q-4 34-34 36q-30-2-34-36z' }, 'dark'),
    s('path', { d: 'M46 86l6 8 6-8 6 8 6-8 6 8 6-8 6 8 6-8 6 8 6-8', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M86 102q20-16 44-10q8 10-4 20q-20 8-40-10z' }, 'brown'),
    s('path', { d: 'M126 100l14 4', ...SW(6) }, 'cream', { stroke: true }),
    s('path', { d: dots([[146, 100], [146, 110]], 5) }, 'cream')
  ],
  dispersar: [
    s('circle', { cx: 80, cy: 80, r: 10 }, 'purple', { accent: true }),
    s('path', { d: rays(80, 80, 18, 46, 8, 22), ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots(around(80, 80, 58, 8, 22), 8) }, 'purple'),
    s('path', { d: dots(around(80, 80, 32, 4, 0), 4) }, 'pink')
  ],
  ecuestre: [
    s('rect', { x: 32, y: 120, width: 96, height: 24, rx: 2 }, 'gray'),
    ...scaled([...horse('dark', 'black')], 0.7, 24, 30),
    s('rect', { x: 68, y: 62, width: 14, height: 24, rx: 5 }, 'dark', { accent: true }),
    s('circle', { cx: 75, cy: 54, r: 8 }, 'dark'),
    s('path', { d: 'M82 66l14-22', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 146h112', ...SW(4) }, 'gray', { stroke: true })
  ],
  encendedor: [
    s('rect', { x: 52, y: 66, width: 52, height: 74, rx: 10 }, 'red', { accent: true }),
    s('rect', { x: 52, y: 50, width: 40, height: 18, rx: 3 }, 'gray'),
    s('circle', { cx: 98, cy: 58, r: 10 }, 'dark'),
    s('path', { d: drop(72, 34, 10) }, 'orange'),
    s('path', { d: drop(72, 38, 5) }, 'yellow'),
    s('path', { d: 'M60 84v44', ...SW(4) }, 'pink', { stroke: true })
  ],
  envolvente: [
    ...person(80, 116, 'yellow', { h: 36, w: 24, r: 11, accent: true }),
    s('path', { d: 'M80 140a58 58 0 0 1-56-60M24 64a58 58 0 0 1 48-42M92 22a58 58 0 0 1 46 44M138 90a58 58 0 0 1-44 48', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M16 70l8-10 8 10zM66 14l10 8-10 8zM144 60l-6 12-8-8zM98 146l-10-6 8-8z' }, 'blue'),
    s('path', { d: 'M60 116h40', ...SW(4) }, 'gray', { stroke: true })
  ],
  'esporádicamente': [
    s('rect', { x: 20, y: 30, width: 120, height: 106, rx: 8 }, 'white'),
    outline({ x: 20, y: 30, width: 120, height: 106, rx: 8 }),
    s('rect', { x: 20, y: 30, width: 120, height: 22, rx: 8 }, 'red'),
    s('path', { d: 'M48 22v16M112 22v16', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: grid(28, 60, 5, 4, 16, 14, 22, 18) }, 'mint'),
    s('rect', { x: 50, y: 78, width: 16, height: 14 }, 'orange', { accent: true }),
    s('rect', { x: 116, y: 114, width: 16, height: 14 }, 'orange')
  ],
  estupendamente: [
    ...face(80, 84, 46, 'yellow', 'smile', { accent: true }),
    s('path', { d: 'M56 98q24 26 48 0z' }, 'dark'),
    s('path', { d: star(26, 32, 12) + star(134, 30, 12) + star(138, 118, 8) + star(22, 118, 8) }, 'orange')
  ],
  exorcista: [
    ...person(46, 138, 'black', { h: 54, w: 32, r: 13 }),
    s('rect', { x: 40, y: 92, width: 12, height: 10 }, 'white'),
    s('rect', { x: 58, y: 92, width: 20, height: 24, rx: 2 }, 'red'),
    s('path', { d: 'M78 96l30-26M78 108l34-8', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M108 98V58q0-22 18-22t18 22v40l-6-6-6 6-6-6-6 6-6-6z' }, 'purple', { accent: true }),
    s('path', { d: dots([[120, 60], [132, 60]], 3.5) + ells([[126, 74, 4, 5]]) }, 'white'),
    s('path', { d: 'M146 46l-8-6M146 64l-10 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  explotador: [
    s('path', { d: ells([[42, 132, 26, 7], [42, 122, 26, 7], [42, 112, 26, 7], [42, 102, 26, 7]]) }, 'yellow'),
    ...person(42, 92, 'dark', { h: 34, w: 34, r: 12, accent: true }),
    s('rect', { x: 30, y: 26, width: 24, height: 14 }, 'black'),
    s('path', { d: 'M26 40h32', ...SW(4) }, 'black', { stroke: true }),
    s('rect', { x: 96, y: 72, width: 44, height: 40, rx: 3 }, 'gray'),
    ...lean(102, 136, 30, 'blue', { h: 30, w: 20, r: 10 }),
    s('path', { d: drop(126, 60, 4) + drop(136, 52, 3) }, 'sky'),
    ground()
  ],
  'extranjería': [
    s('rect', { x: 32, y: 22, width: 76, height: 108, rx: 6 }, 'navy', { accent: true }),
    s('circle', { cx: 70, cy: 64, r: 20, ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M50 64h40M70 44q-12 20 0 40q12-20 0-40', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M54 104h32', ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 116, cy: 110, r: 26 }, 'red'),
    s('circle', { cx: 116, cy: 110, r: 18, ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: star(116, 110, 8) }, 'white')
  ],
  fealdad: [
    s('path', { d: 'M34 72q-2-46 46-48q48 2 46 48q4 50-46 54q-50-4-46-54z' }, 'green', { accent: true }),
    s('circle', { cx: 62, cy: 66, r: 10 }, 'white'),
    s('circle', { cx: 100, cy: 72, r: 6 }, 'white'),
    s('path', { d: dots([[64, 68], [100, 73]], 3.5) + dots([[110, 46], [48, 98]], 5) }, 'dark'),
    s('path', { d: 'M74 76q8 16-2 18', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 108q12-10 22 0t22-4', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M70 106v8M88 106v6', ...SW(4) }, 'yellow', { stroke: true })
  ],
  fecundidad: [
    s('path', { d: 'M40 106q0-30 30-30q26 0 28 30z' }, 'gray', { accent: true }),
    s('ellipse', { cx: 90, cy: 52, rx: 6, ry: 22, transform: 'rotate(-10 90 52)' }, 'gray'),
    s('ellipse', { cx: 104, cy: 54, rx: 6, ry: 20, transform: 'rotate(18 104 54)' }, 'gray'),
    s('circle', { cx: 92, cy: 80, r: 16 }, 'gray'),
    s('circle', { cx: 98, cy: 78, r: 3 }, 'dark'),
    s('path', { d: ells([[26, 124, 9, 7], [52, 126, 9, 7], [116, 126, 9, 7], [140, 124, 7, 6]]) + 'M24 118l-2-10 6 6zM50 120l-2-10 6 6zM114 120l-2-10 6 6zM138 118l-2-8 5 5z' }, 'tan'),
    s('rect', { x: 14, y: 132, width: 132, height: 10, rx: 4 }, 'green')
  ],
  fontanero: [
    s('path', { d: 'M120 136V60H70', ...SW(14) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 60h20', ...SW(20, { 'stroke-linecap': 'butt' }) }, 'dark', { stroke: true }),
    s('path', { d: drop(136, 40, 6) + drop(108, 36, 5) + drop(124, 30, 4) }, 'sky'),
    ...person(46, 138, 'blue', { h: 46, accent: true }),
    s('path', { d: 'M38 50q8-14 20-2z' }, 'red'),
    s('path', { d: 'M60 104l18-16', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M76 90l20-20M92 66l10 0-2 10', ...SW(6) }, 'red', { stroke: true })
  ],
  fulminante: [
    backdrop('navy', 14, 96),
    s('path', { d: 'M38 30q6-14 22-10q10-12 26 0q16-4 20 10q-2 8-10 8H44q-10-2-6-8z' }, 'gray'),
    s('path', { d: 'M72 38l-14 34h18l-16 40 36-48H78l12-26z' }, 'yellow', { accent: true }),
    s('rect', { x: 14, y: 110, width: 132, height: 36, rx: 4 }, 'green'),
    s('path', { d: 'M56 114l-8-8M66 112l2-10M48 120h-12', ...SW(4) }, 'orange', { stroke: true })
  ],
  garabato: [
    ...paper(18, 24, 110, 96),
    s('path', { d: 'M32 90q10-50 26-10t20-20 18 30 14-40q8 30 -40 50q-30 6-24-20', ...SW(4) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M38 46q14 10 30-2t20 4', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M118 110l20 30', ...SW(10) }, 'green', { stroke: true }),
    s('path', { d: 'M114 104l6 8-4 2z' }, 'green')
  ],
  humanamente: [
    s('path', { d: 'M14 120q14-24 40-20l26 8v20H14z' }, 'skin'),
    s('path', { d: 'M146 120q-14-24-40-20l-26 8v20h66z' }, 'tan'),
    s('path', { d: heart(80, 66, 34) }, 'red', { accent: true }),
    s('path', { d: sparkle(30, 40, 8) + sparkle(132, 38, 8) }, 'yellow')
  ],
  identificable: [
    s('path', { d: ring(68, 70, 30) + ring(68, 70, 20) + ring(68, 70, 10), ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M38 74q2 30 30 30', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 70, cy: 70, r: 44, ...SW(8) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: 'M102 102l32 32', ...SW(14) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 42q10-8 22-8', ...SW(4) }, 'sky', { stroke: true })
  ],
  ileso: [
    s('path', { d: 'M14 108v-18l20-4 12-16h30l14 16q12 0 12 10v12z' }, 'gray'),
    s('path', { d: 'M54 72l-6 10M80 92l-8 6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[34, 110], [86, 110]], 9) }, 'dark'),
    ...person(122, 136, 'green', { h: 40, w: 26, r: 11, accent: true }),
    s('path', { d: sparkle(100, 36, 8) + sparkle(144, 34, 7) }, 'yellow'),
    ground(136)
  ],
  impago: [
    ...paper(22, 20, 70, 92),
    s('path', { d: 'M32 38h50M32 52h50M32 66h34', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 30, y: 80, width: 54, height: 22, rx: 4, transform: 'rotate(-12 57 91)' }, 'red', { accent: true }),
    s('path', { d: 'M86 92h56v44H86z' }, 'brown'),
    s('path', { d: 'M86 92l28-18 28 18', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M98 112h32', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M136 66q4-8 10-2M126 56q4-8 10-2', ...SW(3) }, 'gray', { stroke: true })
  ],
  'inhalación': [
    s('path', { d: 'M78 40v40q-12 2-12 14v30q0 14-14 14q-24 0-28-30q-4-30 14-52q16-18 40-16z' }, 'pink', { accent: true }),
    s('path', { d: 'M82 40v40q12 2 12 14v30q0 14 14 14q24 0 28-30q4-30-14-52q-16-18-40-16z' }, 'pink'),
    s('path', { d: 'M80 14v52', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 24q14 4 26 0M94 24q14-4 26 0', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: 'M74 18l6 8 6-8', ...SW(4) }, 'blue', { stroke: true })
  ],
  kayak: [
    s('rect', { x: 14, y: 112, width: 132, height: 34, rx: 4 }, 'blue'),
    s('path', { d: 'M14 104q66 20 132-6q-40 22-70 22q-40-2-62-16z' }, 'yellow', { accent: true }),
    ...person(80, 108, 'red', { h: 26, w: 22, r: 10 }),
    s('path', { d: 'M30 56l104 52', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[30, 56, 6, 12], [134, 108, 6, 12]]) }, 'orange'),
    s('path', { d: 'M24 128q10-6 20 0t20 0M96 132q10-6 20 0t20 0', ...SW(3) }, 'sky', { stroke: true })
  ],
  lavanda: [
    s('path', { d: 'M56 136l-14-80M72 136l-4-90M88 136l6-86M104 136l18-74', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: ells([[42, 52, 6, 16], [68, 40, 6, 18], [94, 42, 6, 18], [122, 56, 6, 16]]) }, 'purple', { accent: true }),
    s('path', { d: ells([[44, 72, 4, 8], [69, 62, 4, 8], [93, 64, 4, 8], [118, 76, 4, 8]]) }, 'purple'),
    s('rect', { x: 62, y: 112, width: 36, height: 10, rx: 3 }, 'pink')
  ],
  'limeño': [
    s('rect', { x: 14, y: 20, width: 132, height: 120, rx: 4 }, 'yellow'),
    s('rect', { x: 40, y: 46, width: 80, height: 54, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: 'M40 40h80l-6 6H46z' }, 'brown'),
    s('path', { d: 'M34 102h92l-8 12H42z' }, 'brown'),
    s('path', { d: grid(48, 52, 4, 2, 12, 18, 18, 22) }, 'tan'),
    s('rect', { x: 64, y: 118, width: 32, height: 22 }, 'dark')
  ],
  linfocito: [
    s('path', { d: ells([[30, 38, 14, 10], [134, 40, 14, 10], [26, 124, 14, 10], [132, 122, 14, 10]]) }, 'red'),
    s('path', { d: ells([[30, 38, 5, 3], [134, 40, 5, 3], [26, 124, 5, 3], [132, 122, 5, 3]]) }, 'pink'),
    s('circle', { cx: 80, cy: 80, r: 44 }, 'sky'),
    s('circle', { cx: 82, cy: 78, r: 32 }, 'purple', { accent: true }),
    s('path', { d: 'M66 66q10 6 6 18M90 64q8 10 0 20', ...SW(3) }, 'navy', { stroke: true })
  ],
  lonja: [
    s('rect', { x: 18, y: 76, width: 124, height: 60, rx: 8 }, 'brown'),
    s('path', { d: 'M28 100q10-30 36-26q20 4 18 18q-4 20-30 22q-20 0-24-14z' }, 'pink', { accent: true }),
    s('path', { d: 'M76 96q10-30 36-26q20 4 18 18q-4 20-30 22q-20 0-24-14z' }, 'pink'),
    s('path', { d: 'M34 92q16-16 40-8M82 88q16-16 40-8', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M100 24l40 30-8 6-40-30z' }, 'gray'),
    s('path', { d: 'M92 30l-10-8', ...SW(6) }, 'dark', { stroke: true })
  ]
};
