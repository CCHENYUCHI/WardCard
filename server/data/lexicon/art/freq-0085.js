// Illustration specs for words still undrawn in batches 0084–0085 (see server/scripts/lexicon/art.js)
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

module.exports = {
  orificio: [
    s('rect', { x: 18, y: 24, width: 84, height: 112, rx: 12 }, 'gray'),
    s('circle', { cx: 60, cy: 80, r: 20 }, 'dark', { accent: true }),
    s('path', { d: ring(60, 80, 20), ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: dots([[30, 38], [90, 38], [30, 122], [90, 122]], 4) }, 'dark'),
    s('path', { d: 'M86 70q16-8 30 0t28 0M86 90q16-8 30 0t28 0', ...SW(4) }, 'sky', { stroke: true })
  ],
  oriundo: [
    ground(),
    s('path', { d: 'M42 96q-24-26-24-44a24 24 0 0 1 48 0q0 18-24 44z' }, 'red', { accent: true }),
    s('circle', { cx: 42, cy: 52, r: 9 }, 'white'),
    s('path', { d: 'M48 112q30 22 56 4', ...DASH(3, '4 6') }, 'gray', { stroke: true }),
    ...person(122, 136, 'blue')
  ],
  oxigenar: [
    s('path', { d: 'M80 22v38M80 60l-14 10M80 60l14 10', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 66q-34-6-38 40q0 26 22 26q18 0 18-20zM94 66q34-6 38 40q0 26-22 26q-18 0-18-20z' }, 'pink', { accent: true }),
    s('path', { d: ells([[38, 36, 9, 9], [124, 30, 10, 10], [112, 54, 6, 6], [48, 58, 5, 5]]) }, 'sky'),
    s('path', { d: 'M38 36m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0M124 30m-10 0a10 10 0 1 0 20 0a10 10 0 1 0-20 0', ...SW(2) }, 'blue', { stroke: true })
  ],
  'partícipe': [
    s('path', { d: busts([40, 120], 104, 28, 30) }, 'gray'),
    s('path', { d: dots([[40, 62], [120, 62]], 12) }, 'skin'),
    s('path', { d: busts([80], 104, 28, 34) }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 56, r: 12 }, 'skin'),
    s('path', { d: 'M92 82l14-34', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 18, y: 104, width: 124, height: 12, rx: 4 }, 'brown'),
    s('path', { d: 'M30 116v20M130 116v20', ...SW(6) }, 'brown', { stroke: true })
  ],
  pedofilia: [
    s('path', { d: 'M80 18l52 18v40q0 42-52 64q-52-22-52-64V36z' }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 60, r: 12 }, 'skin'),
    s('rect', { x: 68, y: 74, width: 24, height: 34, rx: 8 }, 'yellow'),
    s('path', { d: 'M112 140l18-32 18 32z' }, 'red'),
    s('path', { d: 'M58 124q22 10 44 0', ...SW(4) }, 'white', { stroke: true })
  ],
  peligrosamente: [
    s('path', { d: 'M14 148l18-38 16 38 18-30 20 30 18-42 18 42 20-26v26z' }, 'gray'),
    s('path', { d: 'M14 74h132', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 74v74M142 74v74', ...SW(6) }, 'brown', { stroke: true }),
    ...person(80, 74, 'red', { h: 30, w: 22, r: 10, accent: true }),
    s('path', { d: 'M36 46l88-8', ...SW(4) }, 'brown', { stroke: true })
  ],
  'plató': [
    s('rect', { x: 66, y: 116, width: 80, height: 20, rx: 3 }, 'brown'),
    s('path', { d: 'M108 22h24l8 18h-40z' }, 'dark'),
    s('path', { d: 'M104 40h32l10 76H90z' }, 'yellow', { accent: true }),
    s('path', { d: 'M120 14v8', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 18, y: 54, width: 42, height: 28, rx: 4 }, 'dark'),
    s('rect', { x: 60, y: 60, width: 12, height: 16, rx: 2 }, 'gray'),
    s('path', { d: 'M38 82l-16 54M38 82v54M38 82l16 54', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 30, cy: 46, r: 8 }, 'red')
  ],
  plausible: [
    s('rect', { x: 34, y: 54, width: 28, height: 60, rx: 14, transform: 'rotate(-18 48 84)' }, 'skin'),
    s('rect', { x: 58, y: 54, width: 28, height: 60, rx: 14, transform: 'rotate(18 72 84)' }, 'skin'),
    s('path', { d: 'M32 44l-8-10M56 36V24M80 44l8-10', ...SW(4) }, 'orange', { stroke: true }),
    s('rect', { x: 50, y: 112, width: 20, height: 24, rx: 4 }, 'blue'),
    s('circle', { cx: 116, cy: 96, r: 24 }, 'green', { accent: true }),
    s('path', { d: 'M104 96l8 8 16-16', ...SW(6) }, 'white', { stroke: true })
  ],
  poncho: [
    s('path', { d: 'M68 112v24M92 112v24', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 46L24 104q0 8 8 8h96q8 0 8-8z' }, 'red', { accent: true }),
    s('path', { d: 'M42 86h76M32 98h96', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M34 114v10M46 114v10M58 114v10M102 114v10M114 114v10M126 114v10', ...SW(3) }, 'tan', { stroke: true }),
    s('circle', { cx: 80, cy: 34, r: 16 }, 'skin'),
    s('path', { d: 'M62 30q18-20 36 0z' }, 'dark')
  ],
  porche: [
    s('rect', { x: 26, y: 58, width: 108, height: 78 }, 'cream'),
    outline({ x: 26, y: 58, width: 108, height: 78 }),
    s('path', { d: 'M16 62L80 20l64 42z' }, 'red'),
    s('rect', { x: 66, y: 98, width: 28, height: 38, rx: 2 }, 'blue'),
    s('rect', { x: 18, y: 80, width: 124, height: 10, rx: 2 }, 'brown', { accent: true }),
    s('path', { d: 'M28 90v46M52 90v46M108 90v46M132 90v46', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M16 140h128', ...SW(6) }, 'gray', { stroke: true })
  ],
  posar: [
    s('rect', { x: 16, y: 48, width: 46, height: 32, rx: 5 }, 'dark'),
    s('circle', { cx: 39, cy: 64, r: 10 }, 'gray'),
    s('path', { d: sparkle(70, 36, 12) }, 'yellow'),
    ...person(104, 140, 'pink', { accent: true }),
    s('path', { d: 'M118 104l14-14-6-16M90 104l-6 14 10 4', ...SW(6) }, 'skin', { stroke: true })
  ],
  preceder: [
    ground(),
    ...person(52, 136, 'gray', { h: 38 }),
    ...person(100, 136, 'orange', { accent: true }),
    arrow('M30 34h100m-12-12 12 12-12 12')
  ],
  'predisposición': [
    s('path', { d: 'M50 20q30 15 0 30t0 30t0 30t0 30', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M50 20q-30 15 0 30t0 30t0 30t0 30', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M38 35h24M38 65h24M38 95h24M38 125h24', ...SW(3) }, 'gray', { stroke: true }),
    arrow('M84 64q24-2 34 26m-12-2 12 2 2-12', 'orange', 5),
    ...person(124, 140, 'green', { h: 30, w: 22, r: 9, accent: true })
  ],
  preferencial: [
    s('rect', { x: 18, y: 42, width: 124, height: 76, rx: 10 }, 'purple', { accent: true }),
    s('path', { d: dots([[18, 80], [142, 80]], 9) }, 'white'),
    s('path', { d: star(56, 80, 22) }, 'yellow'),
    s('path', { d: 'M88 66h38M88 80h38M88 94h24', ...SW(4) }, 'white', { stroke: true }),
  ],
  'presbítero': [
    s('path', { d: 'M34 140V64a46 46 0 0 1 92 0v76z' }, 'sky'),
    ...person(80, 140, 'black', { h: 58, w: 40, r: 15, accent: true }),
    s('rect', { x: 73, y: 84, width: 14, height: 7, rx: 2 }, 'white'),
    s('path', { d: 'M66 58q14-16 28 0', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 106v20M72 114h16', ...SW(4) }, 'yellow', { stroke: true })
  ],
  progenitor: [
    ground(),
    ...person(58, 136, 'blue', { accent: true, h: 50 }),
    ...person(110, 136, 'orange', { h: 28, w: 22, r: 10 }),
    s('path', { d: 'M72 106q14 6 28 4', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(84, 30, 14) }, 'red')
  ],
  propagar: [
    s('path', { d: ring(80, 80, 36), ...DASH(3, '5 6') }, 'gray', { stroke: true }),
    s('path', { d: rays(80, 80, 22, 50, 8), ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: dots(around(80, 80, 60, 8), 8) }, 'red'),
    s('circle', { cx: 80, cy: 80, r: 16 }, 'red', { accent: true })
  ],
  'púa': [
    s('path', { d: 'M14 46l132 22M14 62l132 22M14 78l132 22M14 94l132 22', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 140q-50-50-46-82q4-32 46-32q42 0 46 32q4 32-46 82z' }, 'orange', { accent: true }),
    s('path', { d: 'M62 50q18-10 36 0', ...SW(4) }, 'yellow', { stroke: true })
  ],
  realizador: [
    s('path', { d: 'M20 58l70-16 4 14-70 16z' }, 'dark'),
    s('path', { d: 'M34 58l4 10M50 54l4 10M66 50l4 10M82 46l4 10', ...SW(5) }, 'white', { stroke: true }),
    s('rect', { x: 22, y: 74, width: 70, height: 56, rx: 4 }, 'dark'),
    s('path', { d: 'M32 94h50M32 110h50', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M108 66l34-20v58l-34-20z' }, 'orange', { accent: true }),
    s('rect', { x: 98, y: 64, width: 12, height: 24, rx: 3 }, 'gray'),
    s('path', { d: 'M116 90v18', ...SW(5) }, 'dark', { stroke: true })
  ],
  refutar: [
    s('path', { d: bubble(16, 20, 74, 48) }, 'gray'),
    s('path', { d: 'M48 26l8 12-8 8 8 12', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: bubble(72, 82, 72, 48) }, 'red', { accent: true }),
    s('path', { d: 'M126 106H90m10-10-10 10 10 10', ...SW(5) }, 'white', { stroke: true })
  ],
  regar: [
    ground(),
    s('path', { d: 'M24 52h50v42q0 8-8 8H32q-8 0-8-8z' }, 'green', { accent: true }),
    s('path', { d: 'M74 74l34-26', ...SW(7) }, 'green', { stroke: true }),
    s('path', { d: 'M32 52q16-26 34 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: drop(114, 66, 4) + drop(122, 84, 4) + drop(110, 98, 4) }, 'sky'),
    s('path', { d: 'M118 136v-24', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(118, 116, -150, 20, 6) + leaflet(118, 116, -30, 20, 6) }, 'green')
  ],
  reggaeton: [
    s('rect', { x: 26, y: 26, width: 60, height: 110, rx: 8 }, 'dark'),
    s('circle', { cx: 56, cy: 100, r: 22 }, 'gray'),
    s('circle', { cx: 56, cy: 52, r: 13 }, 'gray'),
    s('circle', { cx: 56, cy: 100, r: 9 }, 'purple', { accent: true }),
    s('path', { d: 'M98 82q10 18 0 36M110 74q16 26 0 52', ...SW(5) }, 'purple', { stroke: true }),
    ...note(118, 50, 'pink')
  ],
  'regularización': [
    s('path', { d: 'M22 34l18-6 6 18-18 6zM30 70l16 10-10 16-16-10zM18 110l18 4-4 18-18-4z' }, 'gray'),
    arrow('M56 80h28m-9-9 9 9-9 9', 'orange', 5),
    s('path', { d: grid(100, 36, 2, 3, 18, 18, 24, 32) }, 'blue', { accent: true }),
    s('path', { d: 'M96 136h50', ...SW(4) }, 'gray', { stroke: true })
  ],
  reiteradamente: [
    s('path', { d: 'M40 80A40 40 0 0 1 114.6 60m0 0l-13-2m13 2 2-13', ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M120 80A40 40 0 0 1 45.4 100m0 0l13 2m-13-2-2 13', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: dots([[62, 80], [80, 80], [98, 80]], 6) }, 'orange')
  ],
  renacentista: [
    s('rect', { x: 26, y: 16, width: 108, height: 128, rx: 4 }, 'yellow', { accent: true }),
    s('rect', { x: 38, y: 28, width: 84, height: 104 }, 'mint'),
    s('path', { d: busts([80], 132, 60, 42) }, 'brown'),
    s('ellipse', { cx: 80, cy: 72, rx: 14, ry: 17 }, 'skin'),
    s('path', { d: 'M64 76q0-26 16-26t16 26v18h-6V76q0-14-10-14T70 76v18h-6z' }, 'dark'),
    s('path', { d: 'M42 116q10-14 20-8', ...SW(3) }, 'green', { stroke: true })
  ],
  riachuelo: [
    backdrop('mint'),
    s('path', { d: 'M72 22q-34 34 4 62t-8 56', ...SW(18) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M66 44q-6 8 0 14M78 100q4 8-2 14', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: dots([[34, 112], [118, 52], [112, 120], [100, 70]], 6) }, 'gray'),
    s('path', { d: 'M30 62v-12M36 62v-16M42 62v-10M120 96v-12M126 96v-8M132 96v-14', ...SW(3) }, 'green', { stroke: true })
  ],
  'secreción': [
    s('circle', { cx: 68, cy: 64, r: 44 }, 'pink'),
    s('circle', { cx: 62, cy: 58, r: 16 }, 'purple'),
    s('path', { d: 'M98 92q8 6 8 16', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: drop(108, 116, 9) + drop(126, 136, 6) }, 'yellow', { accent: true }),
    s('path', { d: dots([[46, 86], [84, 40], [88, 82]], 4) }, 'red')
  ],
  sima: [
    s('rect', { x: 14, y: 14, width: 132, height: 44, rx: 10 }, 'sky'),
    s('path', { d: 'M14 54h132v80q0 12-12 12H26q-12 0-12-12z' }, 'brown'),
    s('path', { d: 'M54 54q-6 40 14 92h22q18-52 14-92z' }, 'dark', { accent: true }),
    s('path', { d: 'M14 54h40M106 54h40', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: dots([[30, 90], [130, 110], [36, 126], [124, 76]], 4) }, 'tan')
  ],
  'simetría': [
    s('path', { d: 'M80 14v132', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[52, 60, 28, 24], [108, 60, 28, 24], [58, 106, 20, 18], [102, 106, 20, 18]]) }, 'purple', { accent: true }),
    s('path', { d: dots([[50, 58], [110, 58], [58, 106], [102, 106]], 7) }, 'yellow'),
    s('rect', { x: 75, y: 42, width: 10, height: 82, rx: 5 }, 'dark'),
    s('path', { d: 'M77 44l-10-18M83 44l10-18', ...SW(3) }, 'dark', { stroke: true })
  ],
  soldadura: [
    s('rect', { x: 14, y: 100, width: 64, height: 26 }, 'gray'),
    s('rect', { x: 82, y: 100, width: 64, height: 26 }, 'gray'),
    s('rect', { x: 76, y: 100, width: 8, height: 26 }, 'orange', { accent: true }),
    s('path', { d: burst(80, 96, 26, 9, 10) }, 'yellow'),
    s('path', { d: 'M86 82l40-50', ...SW(10) }, 'dark', { stroke: true }),
    s('path', { d: 'M126 32l14-14', ...SW(6) }, 'red', { stroke: true })
  ],
  sometimiento: [
    ground(),
    ...lean(56, 136, 45, 'gray', { h: 34 }),
    ...person(122, 136, 'navy', { accent: true, h: 50 }),
    s('path', { d: 'M108 56q14-14 28 0l-4-12-6 6-4-8-4 8-6-6z' }, 'yellow')
  ],
  supercopa: [
    s('path', { d: 'M50 36q-22 0-18 20q4 14 22 14M110 36q22 0 18 20q-4 14-22 14', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M48 24h64v24q0 36-32 42q-32-6-32-42z' }, 'yellow', { accent: true }),
    s('path', { d: star(80, 50, 14) }, 'white'),
    s('rect', { x: 74, y: 88, width: 12, height: 20 }, 'yellow'),
    s('rect', { x: 56, y: 106, width: 48, height: 14, rx: 3 }, 'brown'),
    s('rect', { x: 46, y: 120, width: 68, height: 16, rx: 3 }, 'dark'),
    s('path', { d: sparkle(26, 30, 10) + sparkle(136, 96, 9) + sparkle(130, 24, 7) }, 'orange')
  ],
  'suéter': [
    s('path', { d: 'M58 24q22 12 44 0l32 14 12 52-18 6-8-30v66H40V66l-8 30-18-6 12-52z' }, 'red', { accent: true }),
    s('path', { d: 'M58 24q22 16 44 0', ...SW(6) }, 'navy', { stroke: true }),
    s('path', { d: 'M44 128h72M16 90l16 5M144 90l-16 5', ...SW(7, { 'stroke-linecap': 'butt' }) }, 'navy', { stroke: true }),
    s('path', { d: 'M44 76l9-8 9 8 9-8 9 8 9-8 9 8 9-8 9 8', ...SW(3) }, 'white', { stroke: true })
  ],
  tenacidad: [
    s('circle', { cx: 124, cy: 34, r: 14 }, 'yellow'),
    s('path', { d: 'M14 90h60l6 10 6-10h60v50H14z' }, 'gray'),
    s('path', { d: 'M80 100l-6 14 8 10-4 16', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 100V54', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 74, -150, 30, 10) + leaflet(80, 62, -30, 30, 10) }, 'green', { accent: true })
  ],
  tentador: [
    s('path', { d: 'M80 54V14', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 70q-14-10-30 0q-20 16-6 46q12 22 36 12q24 10 36-12q14-30-6-46q-16-10-30 0z' }, 'red', { accent: true }),
    s('path', { d: 'M80 70V54', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(82, 60, -20, 24, 7) }, 'green'),
    s('path', { d: 'M62 84q-8 8-6 20', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: sparkle(30, 40, 10) + sparkle(130, 50, 12) + sparkle(128, 124, 7) }, 'yellow')
  ],
  'transgénico': [
    s('circle', { cx: 64, cy: 96, r: 42 }, 'red'),
    s('path', { d: star(64, 56, 16, 6) }, 'green'),
    s('path', { d: 'M44 86q-4 14 4 24', ...SW(4) }, 'white', { stroke: true }),
    s('rect', { x: 100, y: 20, width: 16, height: 50, rx: 3, transform: 'rotate(40 108 45)' }, 'sky', { accent: true }),
    s('path', { d: 'M92 64L80 78', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M124 26l9-11M126 10l14 12', ...SW(5) }, 'dark', { stroke: true })
  ],
  traspasar: [
    s('rect', { x: 70, y: 24, width: 20, height: 112, rx: 4 }, 'brown'),
    s('path', { d: 'M18 80h112', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M146 80l-18-11v22z' }, 'red', { accent: true }),
    s('path', { d: 'M26 80l-10-10M26 80l-10 10M36 80l-10-10M36 80l-10 10', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M80 66l-6-10M80 94l6 10M90 74l8-4', ...SW(3) }, 'dark', { stroke: true })
  ],
  'ultimátum': [
    s('rect', { x: 16, y: 56, width: 86, height: 60, rx: 3 }, 'white'),
    s('path', { d: 'M16 56h86v60H16zM16 56l43 32 43-32', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 59, cy: 90, r: 11 }, 'red', { accent: true }),
    s('path', { d: 'M114 128h28', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M114 36h28', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M118 36h20l-10 46 10 46h-20l10-46z' }, 'sky'),
    s('path', { d: 'M119 128h18l-9-22z' }, 'yellow')
  ],
  vacacional: [
    s('rect', { x: 14, y: 112, width: 132, height: 32, rx: 8 }, 'tan'),
    s('circle', { cx: 128, cy: 30, r: 13 }, 'yellow'),
    s('path', { d: 'M66 34v96', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M20 64a46 32 0 0 1 92 0z' }, 'red', { accent: true }),
    s('path', { d: 'M51 64q-6-28 15-32q21 4 15 32z' }, 'white'),
    s('rect', { x: 94, y: 92, width: 40, height: 30, rx: 4 }, 'orange'),
    s('path', { d: 'M106 92v-8h16v8', ...SW(4) }, 'dark', { stroke: true })
  ],
  zarzuela: [
    s('path', { d: 'M14 16h132v14H14z' }, 'red'),
    s('path', { d: 'M14 16h38q-6 60 4 120H14zM146 16h-38q6 60-4 120h42z' }, 'red', { accent: true }),
    s('rect', { x: 14, y: 134, width: 132, height: 10 }, 'brown'),
    ...lady(78, 134, 'purple'),
    s('path', { d: 'M66 92l-12-14M90 92l12-14', ...SW(5) }, 'skin', { stroke: true }),
    ...note(96, 50, 'navy')
  ],
  'ímpetu': [
    s('path', { d: 'M80 132l-22 4M80 132l18 6', ...SW(7) }, 'dark', { stroke: true }),
    ...lean(80, 132, 22, 'red', { accent: true }),
    s('path', { d: 'M92 102l20-6M84 108l-18 8', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M16 70h30M22 90h34M16 110h28', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: ells([[48, 134, 12, 6], [30, 130, 8, 5]]) }, 'tan')
  ],
  aclamar: [
    s('path', { d: busts([36, 80, 124], 146, 30, 36) }, 'blue', { accent: true }),
    s('path', { d: dots([[36, 98], [80, 98], [124, 98]], 12) }, 'skin'),
    s('path', { d: 'M24 118l-8-30M48 118l8-30M68 118l-4-30M92 118l4-30M112 118l-8-30M136 118l8-30', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: star(80, 44, 16) }, 'yellow'),
    s('path', { d: sparkle(36, 34, 8) + sparkle(124, 30, 8) + sparkle(110, 62, 5) + sparkle(52, 64, 5) }, 'pink')
  ],
  'acné': [
    s('path', { d: 'M28 70q2-46 52-46t52 46q-24-22-52-22T28 70z' }, 'brown'),
    ...face(80, 84, 52, 'skin', 'flat'),
    s('path', { d: dots([[50, 96], [60, 108], [108, 100], [98, 58], [62, 56], [116, 86]], 4) }, 'red', { accent: true })
  ],
  agustino: [
    ground(),
    s('path', { d: 'M60 64h40l16 72H44z' }, 'black', { accent: true }),
    s('path', { d: 'M60 68q-6-40 20-44q26 4 20 44z' }, 'black'),
    s('circle', { cx: 80, cy: 52, r: 12 }, 'skin'),
    s('path', { d: 'M56 94h48M66 94v24', ...SW(5) }, 'tan', { stroke: true }),
    s('rect', { x: 84, y: 100, width: 22, height: 18, rx: 2 }, 'brown')
  ],
  alabar: [
    s('rect', { x: 24, y: 72, width: 18, height: 56, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 40, y: 72, width: 60, height: 56, rx: 12 }, 'skin'),
    s('path', { d: 'M48 74q-6-34 14-44q10 0 8 14l-4 30z' }, 'skin'),
    s('path', { d: 'M100 88H64M100 104H64M100 120H64', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: sparkle(120, 40, 14) + sparkle(130, 76, 8) + sparkle(96, 28, 7) }, 'yellow'),
    s('path', { d: heart(124, 106, 12) }, 'red')
  ],
  analfabeto: [
    ...openBook(80, 74),
    s('path', { d: 'M34 92q6-6 12 0t12 0t12 0M90 96q6-6 12 0t12 0t12 0M34 108q6-6 12 0t12 0t12 0M90 112q6-6 12 0t12 0t12 0', ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 38, r: 22 }, 'skin', { accent: true }),
    s('path', { d: spiral(70, 34) + spiral(86, 34) + 'M72 50q4-4 8 0t8 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: drop(108, 30, 4) }, 'sky')
  ],
  apartheid: [
    ground(),
    ...person(38, 136, 'gray'),
    s('rect', { x: 104, y: 92, width: 30, height: 44, rx: 10 }, 'gray'),
    s('circle', { cx: 119, cy: 78, r: 12 }, 'brown'),
    s('rect', { x: 70, y: 22, width: 20, height: 114, rx: 2 }, 'dark', { accent: true }),
    s('path', { d: 'M70 44h20M70 66h20M70 88h20M70 110h20M80 22v22M80 66v22M80 110v26', ...SW(2) }, 'gray', { stroke: true })
  ],
  bancar: [
    s('path', { d: 'M18 124q0-16 16-16h76q14 0 22-12l10 6q-8 30-30 36H32q-14 0-14-14z' }, 'skin'),
    s('path', { d: 'M34 108q-2-8 6-10h8M54 108v-10M72 108v-10', ...SW(3) }, 'tan', { stroke: true }),
    ...person(76, 106, 'orange', { h: 36, w: 26, r: 11, accent: true }),
    s('path', { d: 'M62 82l-12-16M90 82l12-16', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: ells([[126, 52, 14, 5], [126, 44, 14, 5], [126, 36, 14, 5]]) }, 'yellow')
  ],
  bicarbonato: [
    s('rect', { x: 22, y: 36, width: 62, height: 100, rx: 4 }, 'orange', { accent: true }),
    s('rect', { x: 28, y: 68, width: 50, height: 36, rx: 3 }, 'white'),
    s('circle', { cx: 53, cy: 86, r: 10 }, 'blue'),
    s('path', { d: 'M96 74h44l-6 62h-32z' }, 'sky'),
    s('path', { d: 'M96 74h44l-6 62h-32z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[110, 120], [124, 110], [114, 98], [126, 88], [118, 62], [126, 48], [114, 36]], 4) }, 'white'),
    s('path', { d: ring(118, 62, 4) + ring(126, 48, 4) + ring(114, 36, 4), ...SW(2) }, 'blue', { stroke: true })
  ],
  botar: [
    s('path', { d: 'M88 72h48l-6 64H94z' }, 'gray', { accent: true }),
    s('rect', { x: 84, y: 62, width: 56, height: 10, rx: 3 }, 'dark'),
    s('path', { d: 'M102 84v40M112 84v40M122 84v40', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M34 54q40-40 76 0', ...DASH(3, '4 6') }, 'gray', { stroke: true }),
    s('circle', { cx: 30, cy: 62, r: 13 }, 'white'),
    s('path', { d: ring(30, 62, 13) + 'M22 58l8 4 6-6M26 70l8-4', ...SW(3) }, 'gray', { stroke: true })
  ],
  bruscamente: [
    ...scaled(car(0, 0, 'red', 'sky', { accent: true }), 1.6, 34, 72),
    s('path', { d: 'M14 124h30M18 112h22', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M134 66l10-8M136 82h10M134 98l10 8', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M14 128h132', ...SW(3) }, 'gray', { stroke: true })
  ],
  'caligrafía': [
    ...paper(18, 26, 112, 108),
    s('path', { d: 'M32 104q14-60 34-24t30-20q8 30 18 6', ...SW(5) }, 'navy', { stroke: true }),
    s('path', { d: 'M112 66l18-44 12 5-17 44z' }, 'dark', { accent: true }),
    s('path', { d: 'M112 66l13 5-12 8z' }, 'yellow')
  ],
  'campiña': [
    backdrop('sky'),
    s('circle', { cx: 40, cy: 46, r: 14 }, 'yellow'),
    s('path', { d: 'M14 96q40-30 70-6t62-10v54q0 12-12 12H26q-12 0-12-12z' }, 'green', { accent: true }),
    s('path', { d: 'M24 120q34-12 66-6M34 134q36-10 80-6', ...SW(4) }, 'yellow', { stroke: true }),
    s('rect', { x: 113, y: 64, width: 6, height: 20 }, 'brown'),
    s('circle', { cx: 116, cy: 58, r: 13 }, 'green')
  ],
  'capitalización': [
    ground(),
    s('path', { d: rects([[24, 110, 26, 26], [60, 88, 26, 48], [96, 62, 26, 74]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M24 120h26M24 128h26M60 98h26M60 108h26M60 118h26M60 128h26M96 72h26M96 82h26M96 92h26M96 102h26M96 112h26M96 122h26', ...SW(2) }, 'orange', { stroke: true }),
    arrow('M26 84l30-30 16 12 40-40m-14 0h14v14', 'green', 6)
  ],
  carruaje: [
    s('path', { d: 'M42 48h66q10 0 10 10v42H32V58q0-10 10-10z' }, 'red', { accent: true }),
    s('path', { d: 'M38 48q38-18 76 0', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 58, y: 58, width: 36, height: 24, rx: 3 }, 'sky'),
    s('path', { d: 'M118 92h28', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: ring(46, 116, 18) + ring(106, 116, 18), ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: rays(46, 116, 0, 18, 6) + rays(106, 116, 0, 18, 6), ...SW(2) }, 'dark', { stroke: true }),
    s('circle', { cx: 28, cy: 62, r: 5 }, 'yellow')
  ],
  cedro: [
    ground(),
    s('rect', { x: 74, y: 44, width: 12, height: 92 }, 'brown'),
    s('path', { d: ells([[80, 38, 18, 10], [80, 62, 40, 11], [80, 88, 56, 12], [80, 114, 64, 11]]) }, 'green', { accent: true })
  ],
  cercado: [
    backdrop('mint'),
    s('path', { d: 'M18 98h124M18 122h124', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: [24, 46, 68, 90, 112, 134].map(x => `M${x - 7} 140V82l7-10 7 10v58z`).join('') }, 'tan', { accent: true }),
    s('circle', { cx: 116, cy: 40, r: 12 }, 'yellow')
  ],
  coexistencia: [
    s('circle', { cx: 60, cy: 80, r: 42 }, 'blue'),
    s('circle', { cx: 100, cy: 80, r: 42 }, 'yellow'),
    s('path', { d: 'M80 42.8A42 42 0 0 1 80 117.2A42 42 0 0 1 80 42.8z' }, 'green', { accent: true }),
    s('path', { d: heart(80, 76, 9) }, 'white')
  ],
  colecta: [
    s('rect', { x: 34, y: 72, width: 92, height: 64, rx: 6 }, 'blue', { accent: true }),
    s('rect', { x: 62, y: 72, width: 36, height: 8, rx: 3 }, 'dark'),
    s('path', { d: heart(80, 104, 16) }, 'white'),
    s('circle', { cx: 80, cy: 36, r: 14 }, 'yellow'),
    s('path', { d: ring(80, 36, 9), ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M108 32v28m-7-7 7 7 7-7', ...SW(4) }, 'gray', { stroke: true })
  ],
  colmillo: [
    s('path', { d: 'M18 60q62-34 124 0v40q-62 34-124 0z' }, 'red'),
    s('path', { d: 'M30 68q50-22 100 0v24q-50 22-100 0z' }, 'dark'),
    s('path', { d: 'M42 64l8 34 8-38zM102 60l8 38 8-34z' }, 'white', { accent: true }),
    s('path', { d: 'M62 100l6-14 6 16zM86 102l6-16 6 14z' }, 'white')
  ],
  comunero: [
    s('path', { d: busts([30, 128], 140, 24, 28) }, 'gray'),
    s('path', { d: dots([[30, 102], [128, 102]], 10) }, 'skin'),
    ...person(70, 140, 'tan'),
    s('path', { d: 'M94 140V28', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M96 28h42l-8 14 8 14H96z' }, 'purple', { accent: true }),
    s('path', { d: 'M84 108l10-12', ...SW(6) }, 'skin', { stroke: true })
  ],
  cuerdo: [
    s('path', { d: HEAD }, 'skin'),
    ...gear(70, 66, 16, 8, 'blue', { accent: true }),
    s('circle', { cx: 70, cy: 66, r: 6 }, 'white'),
    s('circle', { cx: 112, cy: 64, r: 4 }, 'dark'),
    s('path', { d: 'M114 92q6 4 12 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  curador: [
    s('rect', { x: 82, y: 22, width: 60, height: 48, rx: 2 }, 'yellow'),
    s('rect', { x: 89, y: 29, width: 46, height: 34 }, 'sky'),
    s('path', { d: 'M89 63l14-16 10 10 8-8 14 14z' }, 'green'),
    s('rect', { x: 104, y: 100, width: 30, height: 36 }, 'gray'),
    s('path', { d: 'M110 100q-6-10 2-20h14q8 10 2 20z' }, 'purple'),
    ...person(52, 140, 'navy', { accent: true }),
    s('path', { d: 'M64 102l20-30', ...SW(6) }, 'skin', { stroke: true })
  ],
  daga: [
    s('path', { d: 'M80 12l10 16v62H70V28z', transform: 'rotate(45 80 80)' }, 'gray'),
    s('path', { d: 'M80 30v54', ...SW(2), transform: 'rotate(45 80 80)' }, 'white', { stroke: true }),
    s('rect', { x: 56, y: 90, width: 48, height: 9, rx: 4, transform: 'rotate(45 80 80)' }, 'yellow'),
    s('rect', { x: 74, y: 99, width: 12, height: 32, rx: 3, transform: 'rotate(45 80 80)' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 138, r: 7, transform: 'rotate(45 80 80)' }, 'yellow')
  ],
  decorativo: [
    s('path', { d: 'M14 26q66 30 132 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 30l8 22 10-18zM70 40l10 22 10-22zM118 34l10 18 8-22z' }, 'red'),
    s('path', { d: 'M46 37l9 22 9-20zM94 39l9 20 10-22z' }, 'yellow'),
    s('path', { d: 'M62 136q-22-28 0-56h36q22 28 0 56z' }, 'blue', { accent: true }),
    s('rect', { x: 66, y: 72, width: 28, height: 10, rx: 3 }, 'blue'),
    s('path', { d: 'M56 106q8-10 16 0t16 0t16 0', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[64, 92], [80, 92], [96, 92], [70, 122], [90, 122]], 3) }, 'white')
  ],
  degenerado: [
    ground(),
    s('path', { d: 'M56 136V90q0-30 30-32', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: ells([[92, 70, 9, 14], [104, 66, 9, 14], [98, 82, 9, 12]]) }, 'brown', { accent: true }),
    s('path', { d: leaflet(56, 112, -150, 22, 6) }, 'tan'),
    s('path', { d: ells([[84, 132, 7, 3], [104, 132, 7, 3]]) }, 'brown'),
    arrow('M130 28v62m-12-12 12 12 12-12', 'red', 6)
  ],
  'delimitación': [
    backdrop('mint'),
    s('path', { d: 'M32 42l72-12 32 54-28 44-70-10z', ...DASH(5, '8 7') }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M32 42V24M104 30V12M136 84V66M108 128v-18M38 118v-18', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M32 24l12 5-12 5zM104 14l12 5-12 5zM136 66l-12 5 12 5zM108 110l12 5-12 5zM38 100l12 5-12 5z' }, 'orange')
  ],
  'depreciación': [
    s('path', { d: 'M24 22v114h114', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M32 38l26 20 22-6 24 36 26 22m-14 4h14v-14', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 60, cy: 108, r: 18 }, 'yellow'),
    s('path', { d: 'M56 92l8 10-6 6 6 16', ...SW(3) }, 'dark', { stroke: true })
  ],
  dupla: [
    ground(),
    ...person(50, 136, 'blue', { accent: true }),
    ...person(110, 136, 'orange'),
    s('path', { d: 'M60 96l18-36M100 96l-18-36', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(80, 40, 12) }, 'yellow')
  ],
  eminencia: [
    ground(),
    s('rect', { x: 56, y: 94, width: 48, height: 42 }, 'yellow', { accent: true }),
    s('path', { d: 'M18 110h38v26H18zM104 118h38v18h-38z' }, 'gray'),
    ...person(80, 94, 'purple', { h: 32, w: 24, r: 10 }),
    s('path', { d: star(80, 26, 12) }, 'yellow'),
    s('path', { d: sparkle(46, 46, 8) + sparkle(116, 48, 8) }, 'orange')
  ],
  empero: [
    s('path', { d: 'M18 112h60q30 0 30-30V44m-14 14 14-14 14 14', ...SW(8) }, 'blue', { stroke: true, accent: true }),
    s('rect', { x: 118, y: 96, width: 26, height: 14, rx: 2 }, 'red'),
    s('path', { d: 'M124 96l-6 14M136 96l-6 14', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M122 110v26M140 110v26', ...SW(4) }, 'dark', { stroke: true })
  ],
  enmendar: [
    ...paper(22, 18, 84, 120),
    s('path', { d: 'M34 40h58M34 56h58M34 88h58M34 104h44', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 72q7-6 14 0t14 0t14 0t14 0', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M108 112l28-28 10 10-28 28z' }, 'yellow', { accent: true }),
    s('path', { d: 'M108 112l10 10-16 6z' }, 'tan'),
    s('path', { d: 'M136 84l10 10 2-2-10-10z' }, 'pink')
  ],
  'enérgico': [
    s('rect', { x: 22, y: 48, width: 100, height: 66, rx: 8, ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 122, y: 68, width: 12, height: 26, rx: 3 }, 'dark'),
    s('path', { d: rects([[32, 58, 22, 46], [60, 58, 22, 46], [88, 58, 24, 46]]) }, 'green', { accent: true }),
    s('path', { d: 'M82 28l-24 52h18l-10 50 34-62H82l12-40z' }, 'yellow'),
    s('path', { d: 'M82 28l-24 52h18l-10 50 34-62H82l12-40z', ...SW(3) }, 'dark', { stroke: true })
  ],
  'estaño': [
    s('path', { d: 'M18 136l8-26h44l8 26zM82 136l8-26h44l8 26z' }, 'gray'),
    s('path', { d: 'M50 108l8-26h44l8 26z' }, 'gray', { accent: true }),
    s('path', { d: 'M30 118h32M94 118h32M62 90h32', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: sparkle(40, 50, 12) + sparkle(120, 60, 9) }, 'sky')
  ],
  'estéreo': [
    s('path', { d: 'M44 56V38h72v18', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 14, y: 56, width: 132, height: 76, rx: 10 }, 'dark'),
    s('circle', { cx: 44, cy: 98, r: 22 }, 'gray'),
    s('circle', { cx: 116, cy: 98, r: 22 }, 'gray'),
    s('path', { d: dots([[44, 98], [116, 98]], 9) }, 'red', { accent: true }),
    s('rect', { x: 68, y: 66, width: 24, height: 16, rx: 2 }, 'sky'),
    s('path', { d: dots([[72, 108], [80, 108], [88, 108]], 3) }, 'yellow')
  ],
  etiquetar: [
    s('path', { d: 'M18 80l30-30h94v60H48z' }, 'orange', { accent: true }),
    s('circle', { cx: 44, cy: 80, r: 7 }, 'white'),
    s('path', { d: 'M44 80q-24 30 8 56', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M68 70h58M68 90h38', ...SW(5) }, 'white', { stroke: true })
  ],
  fetal: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'pink'),
    s('circle', { cx: 80, cy: 80, r: 52 }, 'cream'),
    s('path', { d: 'M90 72q-30-6-40 22q-4 30 26 36q24 4 30-18q4-22-16-40z' }, 'skin', { accent: true }),
    s('circle', { cx: 94, cy: 60, r: 20 }, 'skin'),
    s('path', { d: 'M96 62q4 3 8 0M76 120q-12 8-30 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  fusilamiento: [
    backdrop('tan'),
    s('path', { d: 'M14 42h132M14 70h132M14 98h132M14 126h132M50 14v28M100 42v28M50 70v28M100 98v28', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M60 80h80', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M26 74h40v12H52l-14 22H22l10-22h-6z' }, 'brown', { accent: true }),
    s('path', { d: 'M54 86q2 10 10 8', ...SW(3) }, 'dark', { stroke: true })
  ],
  'galápago': [
    s('path', { d: 'M14 122h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 100h16v20H36zM92 100h16v20H92z' }, 'tan'),
    s('path', { d: 'M110 98q12-8 22-10', ...SW(10) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 134, cy: 86, rx: 12, ry: 9 }, 'tan'),
    s('path', { d: 'M20 104q4-54 52-54t52 54z' }, 'green', { accent: true }),
    s('path', { d: 'M56 74l16-10 16 10v18H56zM56 74l-14 10M88 74l14 10M56 92l-10 12M88 92l10 12', ...SW(3) }, 'mint', { stroke: true }),
    s('circle', { cx: 137, cy: 83, r: 2.5 }, 'dark')
  ],
  gentuza: [
    s('path', { d: dots([[40, 86], [80, 80], [120, 86]], 19) }, 'dark'),
    s('path', { d: busts([40, 80, 120], 142, 34, 42) }, 'dark', { accent: true }),
    s('path', { d: dots([[40, 90], [80, 84], [120, 90]], 12) }, 'skin'),
    s('path', { d: 'M32 84l6 3M48 84l-6 3M72 78l6 3M88 78l-6 3M112 84l6 3M128 84l-6 3', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M36 96h8M76 90h8M116 96h8', ...SW(2) }, 'dark', { stroke: true }),
  ],
  germen: [
    s('path', { d: rays(80, 80, 40, 52, 14), ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M80 36q30 0 36 22q20 12 8 34q2 30-28 32q-20 14-40 0q-30-2-30-30q-12-22 8-36q8-22 46-22z' }, 'green', { accent: true }),
    s('path', { d: dots([[54, 104], [108, 104], [58, 56], [104, 52]], 5) }, 'mint'),
    s('path', { d: dots([[68, 80], [92, 80]], 6) }, 'dark'),
    s('path', { d: 'M60 66l14 6M100 66l-14 6M70 98q10-6 20 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  humedal: [
    s('rect', { x: 14, y: 96, width: 132, height: 44, rx: 8 }, 'blue', { accent: true }),
    s('path', { d: 'M30 132V60M42 132V72M114 132V56M126 132V68M136 132V82', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: ells([[30, 62, 4, 10], [42, 74, 4, 10], [114, 58, 4, 10], [126, 70, 4, 10]]) }, 'brown'),
    s('path', { d: ells([[70, 112, 14, 5], [92, 126, 12, 4]]) }, 'green'),
    s('path', { d: 'M56 124h14M86 108h16', ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 40, r: 14 }, 'yellow')
  ],
  impugnar: [
    ...person(46, 140, 'navy', { accent: true }),
    s('path', { d: 'M60 100l30-26', ...SW(7) }, 'skin', { stroke: true }),
    ...paper(96, 30, 46, 60),
    s('path', { d: 'M104 44h30M104 56h30M104 68h20', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ring(119, 60, 22) + 'M103 76l32-32', ...SW(5) }, 'red', { stroke: true })
  ],
  incredulidad: [
    s('path', { d: 'M30 70q2-46 50-46t50 46q-22-24-50-24T30 70z' }, 'dark'),
    s('circle', { cx: 80, cy: 86, r: 50 }, 'skin', { accent: true }),
    s('path', { d: dots([[62, 82], [100, 82]], 5) }, 'dark'),
    s('path', { d: 'M50 64q12-14 26-6M90 72h20M66 112q14-4 28 4', ...SW(4) }, 'dark', { stroke: true })
  ],
  indefenso: [
    s('path', { d: 'M42 30l-26 8v34q0 36 30 54z' }, 'blue'),
    s('path', { d: 'M118 30l26 8v34q0 36-30 54z' }, 'blue', { accent: true }),
    s('path', { d: 'M42 30l6 20-8 14 8 16-6 18M118 30l-6 20 8 14-8 16 6 18', ...SW(3) }, 'navy', { stroke: true }),
    ...person(80, 136, 'yellow', { h: 34, w: 24, r: 11 }),
    s('path', { d: 'M70 106l-10-22M90 106l10-22', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M64 56l-6-4M96 56l6-4', ...SW(3) }, 'gray', { stroke: true })
  ],
  indigente: [
    s('rect', { x: 18, y: 64, width: 62, height: 72 }, 'tan'),
    s('path', { d: 'M18 64l20-14h42l-20 14', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M74 88h36l10 48H64z' }, 'gray', { accent: true }),
    s('circle', { cx: 92, cy: 74, r: 13 }, 'skin'),
    s('path', { d: 'M78 70q14-16 28 0z' }, 'brown'),
    s('path', { d: 'M126 120h16l-2 16h-12z' }, 'orange'),
    ground()
  ],
  ineficiencia: [
    s('path', { d: 'M40 60h80l-10 76H50z' }, 'gray', { accent: true }),
    s('path', { d: 'M40 60q40 10 80 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[58, 94], [96, 110], [70, 124]], 4) }, 'dark'),
    s('path', { d: 'M58 98q-12 10-18 26M96 114q14 8 18 22M70 128q-4 8-8 10', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M100 14q-14 18-14 36', ...SW(8) }, 'sky', { stroke: true }),
    s('path', { d: ells([[30, 140, 12, 4], [124, 140, 12, 4]]) }, 'sky')
  ],
  inmaduro: [
    s('path', { d: 'M14 32q66 14 132 -4', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M56 38v18M106 34v22', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(82, 36, 60, 30, 10) }, 'green'),
    s('path', { d: dots([[56, 82], [106, 86]], 26) }, 'green', { accent: true }),
    s('path', { d: 'M44 74q2-10 10-12M94 78q2-10 10-12', ...SW(4) }, 'mint', { stroke: true }),
    s('path', { d: star(56, 58, 8, 3) + star(106, 62, 8, 3) }, 'dark')
  ],
  inmerso: [
    s('rect', { x: 14, y: 36, width: 132, height: 110, rx: 10 }, 'sky'),
    s('path', { d: 'M14 38q11-8 22 0t22 0t22 0t22 0t22 0t22 0', ...SW(4) }, 'blue', { stroke: true }),
    ...person(80, 138, 'orange', { accent: true }),
    s('path', { d: dots([[86, 58], [92, 46]], 4) + dots([[80, 66]], 3) }, 'white'),
    s('path', { d: 'M66 104l-18-14M94 104l18-14', ...SW(6) }, 'skin', { stroke: true })
  ],
  intemperie: [
    s('path', { d: ells([[56, 34, 26, 16], [86, 28, 26, 20], [110, 38, 20, 14]]) }, 'gray'),
    s('path', { d: 'M44 58l-6 14M68 60l-6 14M96 58l-6 14M120 56l-6 14M30 90l-6 14M128 84l-6 14', ...SW(3) }, 'blue', { stroke: true }),
    ...person(80, 140, 'purple', { accent: true }),
    s('path', { d: 'M66 104l14 6 14-6', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M14 120q14-6 26 0M120 116q14-6 26 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  israelita: [
    s('circle', { cx: 128, cy: 30, r: 12 }, 'yellow'),
    s('path', { d: 'M14 136l26-50 26 50zM106 136l20-40 20 40z' }, 'tan'),
    s('path', { d: 'M66 70h28l12 66H54z' }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 56, r: 12 }, 'skin'),
    s('path', { d: 'M66 58q0-22 14-22t14 22v14h-4V58q0-12-10-12T70 58v14h-4z' }, 'cream'),
    s('path', { d: 'M106 136V48q0-8-8-8', ...SW(4) }, 'brown', { stroke: true }),
    ground()
  ],
  jeque: [
    s('path', { d: 'M40 146q0-40 40-40t40 40z' }, 'white'),
    s('path', { d: 'M54 66q0-40 26-40t26 40l10 46H44z' }, 'white'),
    s('path', { d: 'M40 146q0-40 40-40t40 40zM54 66q0-40 26-40t26 40l10 46H44z', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 66, r: 15 }, 'skin'),
    s('path', { d: 'M56 46q24-10 48 0', ...SW(6) }, 'black', { stroke: true }),
    s('path', { d: 'M80 112v34', ...SW(5) }, 'yellow', { stroke: true, accent: true })
  ],
  jeta: [
    s('circle', { cx: 80, cy: 80, r: 54 }, 'skin'),
    s('circle', { cx: 60, cy: 66, r: 6 }, 'dark'),
    s('path', { d: 'M90 66q9-7 18 0M54 96q26 24 52 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M70 104q10 26 22 0z' }, 'pink', { accent: true }),
    s('path', { d: dots([[46, 88], [114, 88]], 7) }, 'pink')
  ],
  'judaísmo': [
    s('path', { d: 'M58 138h44l-6-12H64z' }, 'yellow'),
    s('path', { d: 'M80 128V48', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M64 48q0 28 16 28t16-28M50 48q0 42 30 42t30-42M36 48q0 56 44 56t44-56', ...SW(5) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: [36, 50, 64, 80, 96, 110, 124].map(x => drop(x, 36, 5)).join('') }, 'orange')
  ],
  largar: [
    s('path', { d: 'M34 112l-10-18M44 104l-4-22M56 104l4-22M66 110l10-16', ...SW(8) }, 'skin', { stroke: true }),
    s('ellipse', { cx: 50, cy: 120, rx: 22, ry: 18 }, 'skin'),
    s('rect', { x: 38, y: 134, width: 24, height: 12, rx: 3 }, 'blue'),
    s('path', { d: 'M108 70q-12 22 0 44', ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 108, cy: 44, rx: 20, ry: 25 }, 'red', { accent: true }),
    s('path', { d: 'M104 72l4-4 4 4z' }, 'red'),
    s('path', { d: 'M100 32q-6 6-4 14', ...SW(4) }, 'white', { stroke: true })
  ],
  'malecón': [
    backdrop('sky'),
    s('circle', { cx: 40, cy: 50, r: 16 }, 'orange'),
    s('rect', { x: 14, y: 72, width: 132, height: 30 }, 'blue'),
    s('path', { d: 'M14 100h132v34q0 12-12 12H26q-12 0-12-12z' }, 'gray', { accent: true }),
    s('path', { d: 'M14 98h132', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M120 98V40h-12', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 106, cy: 44, r: 6 }, 'yellow'),
    s('path', { d: 'M30 94q4-12 12-4M66 94q4-12 12-4', ...SW(3) }, 'white', { stroke: true })
  ],
  manzanar: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M40 96h10v40H40zM108 90h10v46h-10z' }, 'brown'),
    s('path', { d: ells([[45, 74, 30, 28], [113, 64, 32, 30]]) }, 'green'),
    s('path', { d: dots([[32, 66], [54, 60], [46, 86], [28, 84], [100, 52], [124, 56], [108, 76], [128, 78], [98, 74]], 5) }, 'red', { accent: true }),
    s('path', { d: dots([[72, 132], [86, 133]], 4) }, 'red')
  ],
  mica: [
    s('path', { d: 'M22 112l44-22 72 10-44 24z' }, 'brown'),
    s('path', { d: 'M24 96l44-22 70 10-44 24z' }, 'tan'),
    s('path', { d: 'M26 80l44-22 68 10-44 24z' }, 'cream', { accent: true }),
    s('path', { d: 'M26 80l44-22 68 10-44 24z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: sparkle(60, 40, 10) + sparkle(116, 46, 8) + sparkle(80, 72, 6) }, 'yellow')
  ],
  migrar: [
    s('path', { d: 'M14 146q66-40 132 0z' }, 'green'),
    s('path', { d: birds([[44, 50], [62, 64], [80, 78], [62, 36], [80, 22]]), ...SW(3) }, 'dark', { stroke: true }),
    arrow('M96 64q24-10 40 6m-12 2 12-2-2-12', 'orange', 5),
    s('circle', { cx: 128, cy: 30, r: 10 }, 'yellow', { accent: true })
  ],
  'minúscula': [
    ground(),
    s('rect', { x: 20, y: 30, width: 70, height: 106, rx: 8 }, 'gray'),
    s('rect', { x: 102, y: 96, width: 40, height: 40, rx: 6 }, 'orange', { accent: true }),
    arrow('M122 30v48m-10-10 10 10 10-10', 'blue', 5)
  ],
  navegante: [
    ...person(80, 120, 'navy', { accent: true }),
    s('path', { d: 'M64 56q16-14 32 0z' }, 'white'),
    s('path', { d: 'M62 56h36', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: rays(80, 104, 0, 34, 8), ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: ring(80, 104, 24), ...SW(7) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 104, r: 6 }, 'yellow'),
    s('path', { d: 'M14 144q10-6 20 0t20 0M106 144q10-6 20 0t20 0', ...SW(4) }, 'blue', { stroke: true })
  ],
  negociador: [
    s('path', { d: busts([36, 124], 106, 34, 42) }, 'navy'),
    s('path', { d: dots([[36, 60], [124, 60]], 13) }, 'skin'),
    s('path', { d: 'M50 84q16 10 26 8M110 84q-16 10-26 8', ...SW(7) }, 'navy', { stroke: true }),
    s('circle', { cx: 80, cy: 92, r: 8 }, 'skin', { accent: true }),
    s('rect', { x: 14, y: 106, width: 132, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M30 116v20M130 116v20', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 58, y: 98, width: 18, height: 8 }, 'white')
  ],
  normalizar: [
    s('path', { d: 'M14 80l8-30 10 56 10-46 10 34 10-20', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M62 74q8 10 16 6h68', ...SW(6) }, 'green', { stroke: true, accent: true }),
    s('circle', { cx: 120, cy: 40, r: 16 }, 'green'),
    s('path', { d: 'M112 40l6 6 10-12', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M14 124h132', ...DASH(3) }, 'gray', { stroke: true })
  ],
  'norteño': [
    s('circle', { cx: 80, cy: 90, r: 50 }, 'cream'),
    s('path', { d: ring(80, 90, 50), ...SW(5) }, 'navy', { stroke: true }),
    s('path', { d: 'M80 46l12 44H68z' }, 'red', { accent: true }),
    s('path', { d: 'M68 90h24l-12 44z' }, 'gray'),
    s('path', { d: 'M34 90h8M118 90h8M80 128v4', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: star(80, 24, 10) }, 'yellow')
  ],
  noviazgo: [
    ground(),
    ...person(54, 136, 'blue'),
    ...lady(108, 136, 'pink', { accent: true }),
    s('path', { d: 'M66 112q14 4 28-2', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 34, 16) }, 'red')
  ],
  odioso: [
    ...face(80, 88, 48, 'red', 'frown', { accent: true }),
    s('path', { d: 'M52 66l20 8M108 66l-20 8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 36q-6-8 0-16M30 44q-8-10 0-20M120 36q6-8 0-16M130 44q8-10 0-20', ...SW(4) }, 'gray', { stroke: true })
  ],
  opresor: [
    ground(),
    s('path', { d: 'M52 16h40v52h30q16 0 16 16v10H52z' }, 'dark', { accent: true }),
    s('path', { d: 'M52 94h86', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 44, cy: 126, r: 9 }, 'skin'),
    s('rect', { x: 56, y: 120, width: 50, height: 16, rx: 7 }, 'blue'),
    s('path', { d: 'M36 104l-10-8M120 108l10-6M72 106v8M94 106v8', ...SW(4) }, 'gray', { stroke: true })
  ],
  orbe: [
    s('circle', { cx: 80, cy: 80, r: 44 }, 'blue', { accent: true }),
    s('path', { d: 'M58 50q20-8 26 8q-4 16-20 12q-14 10-18-4zM90 90q18-4 22 12q-8 18-24 10zM48 96q10 0 10 10q-6 8-12 0z' }, 'green'),
    s('ellipse', { cx: 80, cy: 80, rx: 62, ry: 18, transform: 'rotate(-20 80 80)', ...SW(3) }, 'yellow', { stroke: true }),
    s('circle', { cx: 138, cy: 59, r: 6 }, 'gray')
  ],
  'pediatría': [
    ...person(52, 140, 'white', { h: 56, w: 38, r: 15 }),
    s('rect', { x: 33, y: 84, width: 38, height: 56, rx: 12.7, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M42 86v14q10 14 20 0V86M62 100q4 14 30 12', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 94, cy: 112, r: 5 }, 'gray'),
    ...person(118, 140, 'yellow', { h: 30, w: 22, r: 11, accent: true }),
    s('path', { d: 'M46 112h12M52 106v12', ...SW(4) }, 'red', { stroke: true })
  ],
  perezoso: [
    s('path', { d: 'M14 30q66 10 132-6', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M58 34v34M102 30v36', ...SW(11) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 80, cy: 86, rx: 36, ry: 30 }, 'tan', { accent: true }),
    s('ellipse', { cx: 80, cy: 94, rx: 20, ry: 15 }, 'cream'),
    s('path', { d: ells([[71, 92, 7, 4], [89, 92, 7, 4]]) }, 'brown'),
    s('path', { d: 'M66 92q5 3 10 0M84 92q5 3 10 0', ...SW(2) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 100, r: 3 }, 'dark')
  ],
  perpetrar: [
    ...lean(66, 136, 12, 'dark', { accent: true }),
    s('rect', { x: 66, y: 74, width: 28, height: 8, rx: 3 }, 'black'),
    s('path', { d: dots([[73, 78], [86, 78]], 2) }, 'white'),
    s('path', { d: 'M86 102l18 10', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M100 106q-4 30 18 32q22-2 18-32z' }, 'gray'),
    s('path', { d: 'M104 106q14-10 28 0', ...SW(4) }, 'dark', { stroke: true }),
    ground()
  ],
  placebo: [
    s('path', { d: 'M38 84h28v28H38a14 14 0 0 1 0-28z', transform: 'rotate(-35 66 98)' }, 'pink', { accent: true }),
    s('path', { d: 'M66 84h28a14 14 0 0 1 0 28H66z', transform: 'rotate(-35 66 98)' }, 'white'),
    s('path', { d: 'M38 84h56a14 14 0 0 1 0 28H38a14 14 0 0 1 0-28z', transform: 'rotate(-35 66 98)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[114, 40, 24, 20], [92, 76, 5, 5], [84, 88, 3, 3]]) }, 'mint'),
    s('path', { d: heart(114, 40, 12) }, 'red')
  ],
  preludio: [
    s('rect', { x: 14, y: 94, width: 132, height: 46, rx: 4 }, 'white'),
    s('path', { d: 'M14 94h132v46H14zM33 94v46M52 94v46M71 94v46M90 94v46M109 94v46M128 94v46', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: rects([[27, 94, 12, 26], [46, 94, 12, 26], [84, 94, 12, 26], [103, 94, 12, 26], [122, 94, 12, 26]]) }, 'dark'),
    ...note(52, 66, 'purple'),
    s('path', { d: 'M90 70q10-20 34-20', ...DASH(3, '4 5') }, 'gray', { stroke: true }),
    s('path', { d: sparkle(130, 44, 9) }, 'yellow')
  ],
  prodigio: [
    ...person(80, 140, 'green', { h: 34, w: 24, r: 13 }),
    s('circle', { cx: 80, cy: 46, r: 20 }, 'yellow', { accent: true }),
    s('rect', { x: 72, y: 62, width: 16, height: 10, rx: 2 }, 'gray'),
    s('path', { d: halfRays(80, 46, 26, 32, 5), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: sparkle(32, 90, 9) + sparkle(128, 96, 9) }, 'yellow')
  ],
  propenso: [
    s('path', { d: 'M14 64L146 136H14z' }, 'green', { accent: true }),
    s('circle', { cx: 48, cy: 66, r: 14 }, 'orange'),
    arrow('M74 66l42 22m-14 2 14-2-6-12', 'dark', 5),
    s('path', { d: 'M24 54l-8-6M30 46l-4-10', ...SW(3) }, 'gray', { stroke: true })
  ],
  proporcionalidad: [
    s('rect', { x: 24, y: 48, width: 110, height: 88 }, 'sky'),
    s('rect', { x: 24, y: 92, width: 56, height: 44 }, 'blue'),
    s('rect', { x: 24, y: 114, width: 28, height: 22 }, 'navy', { accent: true }),
    s('path', { d: 'M24 136L138 45', ...DASH(3) }, 'orange', { stroke: true }),
    s('path', { d: dots([[52, 114], [80, 92], [134, 48]], 4) }, 'orange')
  ],
  remar: [
    s('path', { d: 'M14 132q10-6 20 0t20 0t20 0t20 0t20 0t20 0', ...SW(4) }, 'blue', { stroke: true }),
    s('rect', { x: 66, y: 70, width: 28, height: 36, rx: 9 }, 'red'),
    s('circle', { cx: 80, cy: 58, r: 11 }, 'skin'),
    s('path', { d: 'M112 70L34 132', ...SW(5) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 34, cy: 132, rx: 12, ry: 5, transform: 'rotate(-38 34 132)' }, 'tan'),
    s('path', { d: 'M18 104h124q-10 24-30 24H48q-20 0-30-24z' }, 'brown', { accent: true }),
    s('path', { d: 'M74 86l26-6', ...SW(6) }, 'skin', { stroke: true })
  ],
  reno: [
    ...horse('brown', 'cream', { accent: true }),
    s('path', { d: 'M120 36l-8-20M114 22l-10-4M128 34l4-20M131 20l8-4', ...SW(4) }, 'tan', { stroke: true }),
    s('circle', { cx: 144, cy: 54, r: 4 }, 'dark')
  ],
  renovador: [
    s('rect', { x: 14, y: 24, width: 132, height: 112 }, 'gray'),
    s('rect', { x: 14, y: 24, width: 78, height: 112 }, 'mint'),
    s('path', { d: 'M122 40l-6 14 8 8M130 100l-8 10 4 10', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 82, y: 40, width: 20, height: 48, rx: 6 }, 'blue', { accent: true }),
    s('path', { d: 'M102 64h16v54', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(42, 62, 12) + sparkle(56, 104, 8) }, 'yellow')
  ],
  rumba: [
    ...lady(70, 140, 'red', { accent: true }),
    s('path', { d: 'M62 92l-18-26M78 92l22-22', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M44 66l-6-10M102 68l8-8', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: ells([[34, 48, 9, 11], [116, 54, 9, 11]]) }, 'orange'),
    ...note(124, 112, 'purple'),
    s('path', { d: 'M40 128q-14-6-16-18M102 128q14-4 14-14', ...SW(3) }, 'gray', { stroke: true })
  ],
  subjetividad: [
    s('path', { d: busts([30, 130], 140, 30, 40) }, 'gray'),
    s('path', { d: dots([[30, 88], [130, 88]], 12) }, 'skin'),
    s('rect', { x: 66, y: 104, width: 28, height: 32, rx: 3 }, 'yellow'),
    s('path', { d: ells([[38, 38, 24, 20], [122, 38, 24, 20], [32, 66, 4, 4], [128, 66, 4, 4]]) }, 'cream'),
    s('path', { d: ells([[38, 38, 24, 20], [122, 38, 24, 20], [32, 66, 4, 4], [128, 66, 4, 4]]), ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 38, cy: 38, r: 10 }, 'red', { accent: true }),
    s('rect', { x: 113, y: 29, width: 18, height: 18, rx: 2 }, 'blue')
  ],
  'séquito': [
    ground(),
    ...person(36, 136, 'purple', { accent: true, h: 50 }),
    s('path', { d: 'M24 64l4-14 8 8 8-8 4 14z' }, 'yellow'),
    ...person(76, 136, 'gray', { h: 36, w: 24, r: 10 }),
    ...person(106, 136, 'gray', { h: 36, w: 24, r: 10 }),
    ...person(134, 136, 'gray', { h: 36, w: 24, r: 10 })
  ],
  'sílaba': [
    s('rect', { x: 14, y: 54, width: 40, height: 34, rx: 17 }, 'blue', { accent: true }),
    s('rect', { x: 60, y: 54, width: 40, height: 34, rx: 17 }, 'orange'),
    s('rect', { x: 106, y: 54, width: 40, height: 34, rx: 17 }, 'green'),
    s('path', { d: dots([[34, 116], [80, 116], [126, 116]], 8) }, 'dark'),
    s('path', { d: 'M34 98v8M80 98v8M126 98v8', ...SW(3) }, 'gray', { stroke: true })
  ],
  'súbito': [
    s('rect', { x: 40, y: 96, width: 80, height: 44, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M40 96L18 74l5-5 22 22z' }, 'red'),
    s('path', { d: 'M80 96l-14-6 28-8-28-8 28-8-14-6', ...SW(4) }, 'gray', { stroke: true }),
    ...face(80, 44, 18, 'yellow'),
    s('path', { d: halfRays(80, 44, 24, 31, 5), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: star(80, 118, 10) }, 'yellow')
  ],
  'tailandés': [
    s('rect', { x: 44, y: 96, width: 72, height: 40 }, 'tan'),
    s('path', { d: 'M28 102l52-34 52 34z' }, 'red'),
    s('path', { d: 'M44 76l36-26 36 26z' }, 'red', { accent: true }),
    s('path', { d: 'M80 50V22M28 102q-8-2-8-12M132 102q8-2 8-12M44 76q-6-2-6-10M116 76q6-2 6-10', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M70 136v-18a10 10 0 0 1 20 0v18z' }, 'dark'),
    ground()
  ],
  templario: [
    s('rect', { x: 22, y: 36, width: 52, height: 64, rx: 8 }, 'gray'),
    s('path', { d: 'M26 62h44M48 70v20', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M22 100h52l-8 20H30z' }, 'gray'),
    s('path', { d: 'M84 46h56v40q0 32-28 48q-28-16-28-48z' }, 'white'),
    s('path', { d: 'M84 46h56v40q0 32-28 48q-28-16-28-48z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M112 54v68M92 80h40', ...SW(9) }, 'red', { stroke: true, accent: true })
  ],
  tez: [
    s('path', { d: 'M22 70q0-50 46-50t46 50q-20-30-46-30T22 70z' }, 'brown'),
    s('ellipse', { cx: 68, cy: 84, rx: 40, ry: 50 }, 'skin', { accent: true }),
    s('path', { d: 'M48 80q6 4 12 0M76 80q6 4 12 0M60 110q8 4 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[44, 98], [92, 98]], 7) }, 'pink'),
    s('path', { d: dots([[130, 50]], 12) }, 'tan'),
    s('path', { d: dots([[130, 84]], 12) }, 'brown'),
    s('path', { d: dots([[130, 118]], 12) }, 'cream'),
    s('path', { d: ring(130, 118, 12), ...SW(2) }, 'gray', { stroke: true })
  ],
  tico: [
    s('path', { d: 'M14 124h132', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M48 112l-12 30h18z' }, 'black'),
    s('ellipse', { cx: 62, cy: 82, rx: 26, ry: 38 }, 'black'),
    s('ellipse', { cx: 72, cy: 70, rx: 14, ry: 18 }, 'yellow'),
    s('path', { d: 'M82 50q40-12 62 8q-26 10-62 10z' }, 'orange', { accent: true }),
    s('circle', { cx: 74, cy: 54, r: 6 }, 'white'),
    s('circle', { cx: 75, cy: 54, r: 3 }, 'dark'),
    s('path', { d: 'M136 56l8 2', ...SW(4) }, 'red', { stroke: true })
  ],
  'pedófilo': [
    ground(),
    s('path', { d: busts([40], 136, 40, 70) }, 'dark'),
    s('circle', { cx: 40, cy: 52, r: 14 }, 'gray'),
    s('path', { d: 'M80 30v106', ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M100 70l22-8 22 8v24q0 26-22 38q-22-12-22-38z' }, 'blue'),
    s('circle', { cx: 122, cy: 84, r: 8 }, 'skin'),
    s('rect', { x: 113, y: 94, width: 18, height: 22, rx: 6 }, 'yellow')
  ],
  pelirrojo: [
    s('path', { d: 'M24 96q-12-40 10-62q22-24 56-16q34 0 42 30q10 26-4 48q-4-40-48-44q-44 4-46 44z' }, 'orange', { accent: true }),
    ...face(80, 88, 44, 'skin'),
    s('path', { d: 'M30 50q-10 6-8 18M130 52q10 8 6 20M60 26q-6-10 4-14M100 24q8-8 16 0', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: dots([[56, 96], [62, 102], [50, 102], [104, 96], [98, 102], [110, 102]], 2) }, 'brown')
  ]
};
