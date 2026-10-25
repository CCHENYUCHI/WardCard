// Illustration specs for words still undrawn in batches 0088–0090 (see server/scripts/lexicon/art.js)
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
module.exports = {
  longitudinal: [
    s('rect', { x: 18, y: 66, width: 124, height: 32, rx: 16 }, 'tan'),
    s('path', { d: ells([[126, 82, 10, 16]]) }, 'brown'),
    s('path', { d: 'M30 82h80', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M24 48h112M34 38l-10 10 10 10M126 38l10 10-10 10', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M24 116h112M34 106l-10 10 10 10M126 106l10 10-10 10', ...SW(6) }, 'red', { stroke: true, accent: true })
  ],
  mariachi: [
    ...person(80, 140, 'black', { h: 50 }),
    s('path', { d: 'M74 84l6 10 6-10', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: ells([[80, 66, 48, 9]]) + 'M64 66q2-28 16-28t16 28z' }, 'tan', { accent: true }),
    s('path', { d: ells([[62, 116, 16, 13], [74, 104, 10, 9]]) }, 'orange'),
    s('path', { d: 'M78 102L118 74', ...SW(5) }, 'brown', { stroke: true }),
    ...note(132, 50, 'red')
  ],
  merlo: [
    s('path', { d: 'M14 120q60-10 132 4', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(120, 122, 60, 18, 6) }, 'green'),
    s('path', { d: ells([[78, 94, 30, 20]]) + 'M50 94l-30 10 4-14z' }, 'black'),
    s('circle', { cx: 104, cy: 74, r: 16 }, 'black'),
    s('path', { d: 'M118 70l18 4-18 6z' }, 'orange', { accent: true }),
    s('circle', { cx: 108, cy: 70, r: 3 }, 'yellow'),
    s('path', { d: 'M84 110l-4 12M94 110l2 12', ...SW(3) }, 'orange', { stroke: true }),
    ...note(130, 40, 'blue')
  ],
  milagrosamente: [
    s('path', { d: ells([[80, 28, 40, 12], [60, 24, 18, 10], [100, 24, 18, 10]]) }, 'gray'),
    s('path', { d: 'M56 36L30 136h100L104 36z' }, 'cream'),
    ...person(80, 136, 'blue', { accent: true }),
    s('path', { d: sparkle(42, 70, 9) + sparkle(120, 60, 11) + sparkle(116, 108, 7) }, 'yellow')
  ],
  minorista: [
    s('rect', { x: 20, y: 40, width: 120, height: 96 }, 'cream'),
    s('path', { d: 'M14 40h132v18q-11 10-22 0q-11 10-22 0q-11 10-22 0q-11 10-22 0q-11 10-22 0q-11 10-22 0z' }, 'red', { accent: true }),
    s('rect', { x: 20, y: 96, width: 120, height: 40 }, 'brown'),
    s('path', { d: dots([[40, 86], [56, 86], [72, 86]], 8) }, 'orange'),
    s('rect', { x: 92, y: 74, width: 18, height: 22, rx: 3 }, 'blue'),
    s('rect', { x: 114, y: 70, width: 16, height: 26, rx: 3 }, 'green')
  ],
  montonero: [
    s('path', { d: ells([[30, 120, 24, 22], [130, 118, 24, 24]]) }, 'green'),
    s('path', { d: busts([52, 80, 108], 136, 26, 34) }, 'green', { accent: true }),
    s('path', { d: dots([[52, 92], [80, 90], [108, 92]], 11) }, 'skin'),
    s('path', { d: ells([[52, 84, 13, 6], [80, 82, 13, 6], [108, 84, 13, 6]]) }, 'brown'),
    s('path', { d: 'M120 112V30', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M120 30h26v18h-26z' }, 'red')
  ],
  narcótico: [
    s('rect', { x: 34, y: 54, width: 52, height: 82, rx: 8 }, 'orange', { accent: true }),
    s('rect', { x: 30, y: 38, width: 60, height: 18, rx: 4 }, 'white'),
    outline({ x: 30, y: 38, width: 60, height: 18, rx: 4 }),
    s('rect', { x: 42, y: 78, width: 36, height: 30, rx: 3 }, 'white'),
    s('rect', { x: 98, y: 112, width: 34, height: 16, rx: 8, transform: 'rotate(-20 115 120)' }, 'red'),
    s('path', { d: 'M126 28a18 18 0 1 0 14 30a14 14 0 0 1-14-30z' }, 'yellow')
  ],
  obediente: [
    ground(),
    ...person(44, 136, 'blue'),
    s('path', { d: 'M58 100l26 14', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: ells([[120, 120, 18, 16]]) + 'M98 136l4-34h18l2 34zM136 124q12-2 10-14' }, 'brown', { accent: true }),
    s('circle', { cx: 108, cy: 92, r: 13 }, 'brown'),
    s('path', { d: ells([[96, 96, 9, 6]]) + 'M112 82l10 18-4 2z' }, 'tan'),
    s('path', { d: dots([[106, 88], [88, 95]], 2.5) }, 'dark')
  ],
  obligatoriedad: [
    s('rect', { x: 76, y: 96, width: 8, height: 44 }, 'gray'),
    s('circle', { cx: 80, cy: 64, r: 46 }, 'blue', { accent: true }),
    s('path', { d: ring(80, 64, 46), ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M80 94V44M62 60l18-20 18 20', ...SW(10) }, 'white', { stroke: true })
  ],
  orquídea: [
    s('path', { d: 'M80 136V94q0-20 24-30', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 134, -150, 40, 10) + leaflet(80, 134, -30, 40, 10) }, 'green'),
    s('path', { d: ells([[80, 36, 12, 22], [56, 58, 22, 12], [104, 58, 22, 12]]) }, 'pink'),
    s('path', { d: ells([[64, 76, 12, 16], [96, 76, 12, 16]]) }, 'purple'),
    s('path', { d: 'M70 60q10 40 20 0q-10 -10-20 0z' }, 'purple', { accent: true }),
    s('circle', { cx: 80, cy: 58, r: 5 }, 'yellow')
  ],
  ozono: [
    s('circle', { cx: 80, cy: 90, r: 56 }, 'sky'),
    s('circle', { cx: 80, cy: 90, r: 40 }, 'blue', { accent: true }),
    s('path', { d: 'M58 74q10-10 20 0t10 18q-10 10-24 2zM92 106q12-6 16 6q-6 10-16 4z' }, 'green'),
    s('circle', { cx: 28, cy: 28, r: 12 }, 'yellow'),
    s('path', { d: 'M40 40l20 20M58 46l14 6', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: ring(80, 90, 56), ...DASH(3, '4 6') }, 'navy', { stroke: true })
  ],
  parcialidad: [
    s('path', { d: 'M80 40v90M56 136h48', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M28 34L132 62', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M16 54h28l-14-20zM118 84h28l-14-22z' }, 'gray'),
    s('path', { d: 'M14 54a16 10 0 0 0 32 0zM116 84a16 10 0 0 0 32 0z' }, 'yellow', { accent: true }),
    s('path', { d: 'M126 64v-40q0-6 6-6t6 6v40z' }, 'skin')
  ],
  pedacito: [
    s('path', { d: 'M18 120V80l50-30 50 30v40z' }, 'yellow'),
    s('path', { d: 'M18 80l50-30 50 30H18z' }, 'orange'),
    s('path', { d: dots([[40, 100], [64, 110], [92, 98]], 5) }, 'orange'),
    s('path', { d: 'M114 132v-16l26-10v14z' }, 'yellow', { accent: true }),
    s('path', { d: 'M114 116l26-10-10-4z' }, 'orange'),
    ground(138)
  ],
  pliegue: [
    s('path', { d: 'M20 40l24 20v76l-24-20zM68 40l24 20v76l-24-20zM116 40l24 20v76l-24-20z' }, 'sky'),
    s('path', { d: 'M44 60l24-20v76l-24 20zM92 60l24-20v76l-24 20z' }, 'blue', { accent: true }),
    s('path', { d: 'M20 40l24 20 24-20 24 20 24-20 24 20', ...SW(2) }, 'navy', { stroke: true })
  ],
  podre: [
    s('path', { d: 'M80 52q-36-14-46 20q-6 40 26 58q12 6 20 0q8 6 20 0q32-18 26-58q-10-34-46-20z' }, 'brown', { accent: true }),
    s('path', { d: 'M80 52q0-16 8-22', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[60, 84, 10, 8], [96, 102, 12, 9], [100, 72, 6, 5]]) }, 'green'),
    s('path', { d: dots([[40, 30], [126, 40], [120, 22]], 4) }, 'black'),
    s('path', { d: 'M34 26q-6-6-10 0M30 34q-8 2-6 8M130 36q4-8 10-4', ...SW(2) }, 'gray', { stroke: true })
  ],
  pregrado: [
    ground(),
    s('path', { d: 'M24 60h112L80 30z' }, 'gray'),
    s('path', { d: rects([[30, 64, 100, 8], [26, 128, 108, 8]]) }, 'gray'),
    s('path', { d: rects([[36, 74, 10, 54], [62, 74, 10, 54], [88, 74, 10, 54], [114, 74, 10, 54]]) }, 'cream'),
    ...person(80, 136, 'green', { h: 30, w: 20, r: 9, accent: true }),
    s('rect', { x: 70, y: 110, width: 8, height: 14 }, 'orange')
  ],
  pupila: [
    s('path', { d: 'M14 80q66-60 132 0q-66 60-132 0z' }, 'white'),
    s('path', { d: 'M14 80q66-60 132 0q-66 60-132 0z', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 28 }, 'brown'),
    s('circle', { cx: 80, cy: 80, r: 14 }, 'black', { accent: true }),
    s('circle', { cx: 86, cy: 74, r: 4 }, 'white')
  ],
  pus: [
    backdrop('skin'),
    s('circle', { cx: 80, cy: 84, r: 36 }, 'pink'),
    s('circle', { cx: 80, cy: 80, r: 18 }, 'yellow', { accent: true }),
    s('path', { d: drop(80, 120, 7) }, 'yellow'),
    s('path', { d: 'M30 40h26M43 27v26', ...SW(8) }, 'red', { stroke: true })
  ],
  rareza: [
    ground(),
    s('path', { d: ells([[30, 112, 14, 18], [58, 112, 14, 18], [110, 112, 14, 18], [138, 112, 14, 18]]) }, 'cream'),
    s('path', { d: ells([[30, 112, 14, 18], [58, 112, 14, 18], [110, 112, 14, 18], [138, 112, 14, 18]]), ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: ells([[84, 104, 18, 26]]) }, 'purple', { accent: true }),
    s('path', { d: sparkle(84, 54, 10) + sparkle(112, 70, 6) }, 'yellow'),
    s('path', { d: dots([[78, 98], [92, 112], [80, 118]], 3) }, 'yellow')
  ],
  recreativo: [
    ground(),
    s('path', { d: 'M24 136L44 40 64 136M96 136l20-96 20 96M40 42h80', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M72 42l-6 66M92 42l6 66', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 62, y: 106, width: 40, height: 6, rx: 2 }, 'brown'),
    s('circle', { cx: 82, cy: 78, r: 10 }, 'skin'),
    s('rect', { x: 72, y: 88, width: 20, height: 20, rx: 6 }, 'orange', { accent: true })
  ],
  remitente: [
    s('rect', { x: 16, y: 42, width: 128, height: 84, rx: 6 }, 'white'),
    outline({ x: 16, y: 42, width: 128, height: 84, rx: 6 }, 'gray'),
    s('path', { d: 'M18 46l62 44 62-44', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 38, cy: 64, r: 7 }, 'skin'),
    s('path', { d: busts([38], 88, 18, 16) }, 'blue', { accent: true }),
    s('rect', { x: 116, y: 54, width: 18, height: 22 }, 'red'),
    s('path', { d: 'M20 22h44M54 14l10 8-10 8', ...SW(5) }, 'orange', { stroke: true })
  ],
  reunificación: [
    s('path', { d: 'M74 40q-30 0-44 20t-6 50q14 20 50 14z' }, 'green'),
    s('path', { d: 'M86 40q30 0 44 20t6 50q-14 20-50 14z' }, 'green', { accent: true }),
    s('path', { d: 'M74 40q-8 20 0 40t0 44M86 40q-8 20 0 40t0 44', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 140h30M34 132l10 8-10 8M146 140h-30M126 132l-10 8 10 8', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: heart(80, 18, 8) }, 'red')
  ],
  rondar: [
    s('path', { d: 'M52 60h56v50H52z' }, 'cream'),
    s('path', { d: 'M46 62l34-26 34 26z' }, 'red'),
    s('rect', { x: 72, y: 84, width: 16, height: 26 }, 'brown'),
    s('path', { d: 'M24 120a60 30 0 1 0 22-56', ...SW(5, { 'stroke-dasharray': '8 8' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 56l8 8-10 6', ...SW(5) }, 'gray', { stroke: true }),
    ...person(26, 128, 'navy', { h: 34, w: 22, r: 9, accent: true }),
    s('path', { d: 'M18 80h16l-2-6h-12z' }, 'navy')
  ],
  rítmico: [
    s('path', { d: 'M56 136l16-104h16l16 104z' }, 'brown', { accent: true }),
    s('path', { d: 'M64 120h32l-10-70h-12z' }, 'cream'),
    s('path', { d: 'M80 116L100 50', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 90, y: 70, width: 14, height: 10, rx: 2, transform: 'rotate(18 97 75)' }, 'red'),
    s('path', { d: 'M108 36q10 4 12 14M114 28q14 6 16 22M52 36q-10 4-12 14M46 28q-14 6-16 22', ...SW(3) }, 'orange', { stroke: true }),
    ...note(30, 110, 'blue')
  ],
  salame: [
    s('path', { d: 'M18 76q0-18 18-18h56v52H36q-18 0-18-18z' }, 'red', { accent: true }),
    s('path', { d: 'M18 84q-6 0-6-6', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: ells([[92, 84, 12, 26]]) }, 'pink'),
    s('path', { d: ells([[124, 100, 18, 24], [124, 64, 14, 18]]) }, 'pink'),
    s('path', { d: dots([[90, 74], [94, 92], [120, 92], [128, 108], [118, 112], [122, 58], [128, 70]], 3) + ells([[32, 70, 4, 3], [56, 80, 4, 3], [44, 96, 4, 3], [70, 70, 4, 3]]) }, 'cream'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'brown', { stroke: true })
  ],
  sedición: [
    s('path', { d: busts([28, 56, 104, 132], 140, 24, 28) }, 'gray'),
    s('path', { d: dots([[28, 100], [56, 100], [104, 100], [132, 100]], 10) }, 'skin'),
    s('path', { d: 'M40 116L36 78M120 116l4-38', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: dots([[36, 74], [124, 74]], 7) }, 'skin'),
    ...person(80, 140, 'red', { accent: true }),
    s('path', { d: 'M92 72l20-14v28z' }, 'orange'),
    s('path', { d: 'M118 64l10-6M120 74h12M118 84l10 6', ...SW(3) }, 'orange', { stroke: true })
  ],
  sepultar: [
    s('path', { d: 'M14 136q66-40 132 0z' }, 'brown'),
    s('path', { d: 'M56 112V54q0-22 24-22t24 22v58z' }, 'gray', { accent: true }),
    s('path', { d: 'M80 54v32M68 64h24', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M124 50l14 76', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M132 120l14-2 4 18-14 2z' }, 'dark'),
    s('path', { d: dots([[26, 118], [36, 112], [36, 124]], 6) }, 'pink')
  ],
  sumir: [
    s('rect', { x: 14, y: 72, width: 132, height: 74, rx: 6 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 72, r: 16 }, 'skin'),
    s('path', { d: 'M14 74q11-8 22 0t22 0t22 0t22 0t22 0t22 0v14H14z' }, 'navy'),
    s('path', { d: 'M72 66q2-3 4 0M84 66q2-3 4 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M50 30h60v12H50z' }, 'gray'),
    s('path', { d: 'M56 46v8M70 46v8M84 46v8M98 46v8', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: ring(110, 110, 5) + ring(52, 120, 4) + ring(96, 128, 3), ...SW(2) }, 'sky', { stroke: true })
  ],
  suspirar: [
    ...face(64, 80, 40, 'yellow', 'flat', { accent: true }).slice(0, 1),
    s('path', { d: 'M44 74q6 6 12 0M72 74q6 6 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 92, cy: 98, r: 5 }, 'dark'),
    s('path', { d: ells([[118, 106, 12, 9], [134, 92, 9, 7], [142, 76, 6, 5]]) }, 'sky'),
    s('path', { d: drop(36, 50, 5) }, 'sky')
  ],
  tarima: [
    s('rect', { x: 20, y: 22, width: 120, height: 46, rx: 3 }, 'green'),
    s('rect', { x: 50, y: 104, width: 92, height: 32 }, 'brown', { accent: true }),
    s('path', { d: 'M50 112h92', ...SW(2) }, 'tan', { stroke: true }),
    ...person(98, 104, 'blue', { h: 32, w: 22, r: 9 }),
    s('path', { d: busts([20], 140, 22, 22) }, 'orange'),
    s('circle', { cx: 20, cy: 108, r: 9 }, 'skin')
  ],
  tormento: [
    s('path', { d: ells([[80, 34, 40, 14], [60, 28, 18, 12], [100, 28, 20, 12]]) }, 'dark'),
    s('path', { d: 'M86 44l-10 16h10l-8 16', ...SW(4) }, 'yellow', { stroke: true }),
    ...face(80, 108, 30, 'skin', 'frown'),
    s('path', { d: 'M48 104q-10-14 0-28M112 104q10-14 0-28', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: spiral(122, 124) + spiral(30, 124), ...SW(3) }, 'purple', { stroke: true, accent: true })
  ],
  totalitarismo: [
    s('rect', { x: 64, y: 16, width: 32, height: 62, rx: 6 }, 'dark', { accent: true }),
    s('circle', { cx: 80, cy: 34, r: 10 }, 'skin'),
    s('path', { d: 'M64 52L24 60M96 52l40 8', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: busts([28, 54, 80, 106, 132], 116, 18, 18) + busts([41, 67, 93, 119], 140, 18, 18) }, 'gray'),
    s('path', { d: dots([[28, 92], [54, 92], [80, 92], [106, 92], [132, 92], [41, 116], [67, 116], [93, 116], [119, 116]], 7) }, 'gray')
  ],
  traumatismo: [
    s('path', { d: HEAD, transform: 'translate(8 8) scale(0.9)' }, 'skin'),
    s('path', { d: 'M38 44q40-30 82 0v14q-40-28-82 0z' }, 'white'),
    s('path', { d: 'M38 44q40-30 82 0v14q-40-28-82 0z', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 82, y: 66, width: 22, height: 10, rx: 3, transform: 'rotate(-30 93 71)' }, 'tan'),
    s('circle', { cx: 88, cy: 72, r: 3 }, 'dark'),
    s('path', { d: sparkle(26, 30, 9) + sparkle(140, 34, 8) }, 'yellow', { accent: true }),
    s('path', { d: dots([[60, 34]], 4) }, 'red')
  ],
  trecho: [
    s('path', { d: 'M20 140L66 60h28l46 80z' }, 'gray'),
    s('path', { d: 'M80 64v10M80 86v14M80 112v22', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M24 136V96M136 64V30', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 96h20l-6 8 6 8H24zM136 30h-20l6 8-6 8h20z' }, 'red', { accent: true }),
    s('path', { d: 'M30 46q50-30 80-12', ...DASH(3) }, 'orange', { stroke: true })
  ],
  veintena: [
    s('rect', { x: 16, y: 36, width: 128, height: 100, rx: 10 }, 'tan'),
    s('path', { d: dots(Array.from({ length: 20 }, (_, k) => [34 + (k % 5) * 23, 54 + Math.floor(k / 5) * 22]).filter((_, k) => k % 2 === 0), 9) }, 'orange', { accent: true }),
    s('path', { d: dots(Array.from({ length: 20 }, (_, k) => [34 + (k % 5) * 23, 54 + Math.floor(k / 5) * 22]).filter((_, k) => k % 2 === 1), 9) }, 'red')
  ],
  yema: [
    s('path', { d: 'M24 96h112q-4 40-56 40t-56-40z' }, 'blue'),
    s('path', { d: ells([[80, 98, 50, 10]]) }, 'cream'),
    s('circle', { cx: 80, cy: 92, r: 14 }, 'yellow', { accent: true }),
    s('path', { d: 'M48 50q0-30 16-30t16 30l-6-6-5 6-5-6-5 6-5-6z' }, 'white'),
    s('path', { d: 'M48 50q0-30 16-30t16 30l-6-6-5 6-5-6-5 6-5-6z', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M84 54q0 30 16 30t16-30l-6 6-5-6-5 6-5-6-5 6z' }, 'white'),
    s('path', { d: 'M84 54q0 30 16 30t16-30l-6 6-5-6-5 6-5-6-5 6z', ...SW(2) }, 'tan', { stroke: true })
  ],
  acosar: [
    s('rect', { x: 14, y: 24, width: 14, height: 112 }, 'gray'),
    ground(),
    ...person(44, 136, 'sky', { h: 30, w: 22, r: 9 }),
    s('path', { d: 'M40 86q4-4 8 0', ...SW(2) }, 'dark', { stroke: true }),
    ...lean(104, 136, -14, 'red', { h: 60, w: 36, r: 15, accent: true }),
    s('path', { d: 'M86 74L58 64M90 92l-30 4', ...SW(7) }, 'skin', { stroke: true })
  ],
  adherir: [
    s('rect', { x: 20, y: 76, width: 72, height: 56, rx: 4, transform: 'rotate(-6 56 104)' }, 'yellow'),
    s('rect', { x: 64, y: 66, width: 72, height: 56, rx: 4, transform: 'rotate(8 100 94)' }, 'sky'),
    s('path', { d: 'M64 74q10 20 0 44', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M96 18l26 20-14 18-26-20z' }, 'orange', { accent: true }),
    s('path', { d: 'M82 36l-10 14', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: drop(68, 62, 5) }, 'white'),
    s('path', { d: drop(68, 62, 5), ...SW(2) }, 'gray', { stroke: true })
  ],
  adjudicar: [
    s('rect', { x: 14, y: 116, width: 66, height: 20, rx: 4 }, 'brown'),
    s('rect', { x: 18, y: 50, width: 60, height: 22, rx: 6, transform: 'rotate(-30 48 61)' }, 'brown', { accent: true }),
    s('path', { d: 'M54 72l20 36', ...SW(7) }, 'tan', { stroke: true }),
    s('path', { d: 'M34 100l-8 6M48 98v-10', ...SW(3) }, 'orange', { stroke: true }),
    s('rect', { x: 100, y: 96, width: 40, height: 40, rx: 3 }, 'red'),
    s('path', { d: 'M120 96v40M100 116h40M120 96q-14-16-14 0M120 96q14-16 14 0', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M88 46h36M114 36l10 10-10 10', ...SW(5) }, 'green', { stroke: true })
  ],
  aguardiente: [
    s('path', { d: 'M30 136V70q0-12 12-16V24h20v30q12 4 12 16v66z' }, 'sky'),
    s('rect', { x: 40, y: 18, width: 24, height: 10, rx: 2 }, 'red'),
    s('rect', { x: 36, y: 84, width: 32, height: 30 }, 'cream'),
    s('path', { d: 'M96 92h36l-4 44h-28z' }, 'sky'),
    s('path', { d: 'M114 88q-14-14 0-34q2 12 8 6q10 16-8 28z' }, 'orange', { accent: true }),
    s('path', { d: 'M114 84q-6-8 0-16q4 8 4 16z' }, 'yellow')
  ],
  balada: [
    s('path', { d: 'M40 14h80l20 122H20z' }, 'cream'),
    ...person(66, 136, 'purple', { accent: true }),
    s('path', { d: 'M104 136V78', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[104, 72, 7, 10]]) }, 'dark'),
    s('path', { d: 'M78 98l22-24', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(118, 36, 9) + heart(36, 46, 7) }, 'pink'),
    ...note(128, 72, 'blue')
  ],
  balar: [
    s('path', { d: 'M38 112v24M54 114v22M86 114v22M100 112v24', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: ells([[70, 92, 40, 26], [44, 84, 16, 16], [96, 84, 16, 16], [70, 72, 20, 14]]) }, 'white'),
    s('path', { d: ells([[70, 92, 40, 26]]), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[110, 70, 14, 18]]) }, 'dark', { accent: true }),
    s('path', { d: 'M126 52q8 6 8 18M134 42q14 10 12 32', ...SW(4) }, 'orange', { stroke: true }),
    ground(138)
  ],
  blasfemia: [
    s('path', { d: 'M40 34q40-24 80 0', ...SW(5) }, 'yellow', { stroke: true }),
    ...person(40, 140, 'gray', { h: 36, w: 24, r: 10 }),
    s('path', { d: bubble(64, 60, 72, 46) }, 'dark', { accent: true }),
    s('path', { d: 'M76 74l8 8-8 8M96 72l-4 10 6 0-4 12M112 74a6 6 0 1 0 0.1 0z', ...SW(3) }, 'red', { stroke: true })
  ],
  bronco: [
    ...rot(horse('brown', 'dark', { accent: true }), 15, 76, 96),
    s('path', { d: 'M14 138h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[24, 132], [34, 128], [110, 130]], 4) }, 'tan')
  ],
  búfalo: [
    s('path', { d: 'M42 108v28M56 110v26M100 110v26M114 108v28', ...SW(9) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 92q0-28 30-30q20-24 46-6q20 6 20 30v18q-40 10-96 0z' }, 'brown', { accent: true }),
    s('path', { d: 'M100 56q12-12 28-4q10 18 2 36q-10 10-24 6z' }, 'dark'),
    s('path', { d: 'M110 58q-16-12-8-26M126 56q12-8 6-24', ...SW(5) }, 'cream', { stroke: true }),
    s('circle', { cx: 120, cy: 70, r: 3 }, 'white'),
    s('path', { d: 'M28 88q-12 6-10 22', ...SW(3) }, 'dark', { stroke: true })
  ],
  búho: [
    s('path', { d: 'M20 132h120', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: 'M44 128V64l-6-32 22 16h40l22-16-6 32v64z' }, 'brown', { accent: true }),
    s('path', { d: ells([[80, 104, 24, 22]]) }, 'tan'),
    s('path', { d: dots([[62, 68], [98, 68]], 16) }, 'white'),
    s('path', { d: dots([[62, 68], [98, 68]], 8) }, 'black'),
    s('path', { d: 'M74 80l6 12 6-12z' }, 'orange'),
    s('path', { d: dots([[24, 30], [136, 22]], 2) + sparkle(130, 40, 6) }, 'yellow')
  ],
  camuflaje: [
    backdrop('green'),
    s('path', { d: ells([[40, 40, 22, 14], [110, 56, 26, 16], [60, 118, 30, 14], [128, 124, 16, 12]]) }, 'brown'),
    s('path', { d: ells([[84, 30, 14, 10], [30, 86, 16, 18], [120, 96, 14, 10], [90, 128, 12, 8]]) }, 'dark'),
    s('path', { d: ells([[60, 62, 12, 8], [96, 108, 14, 8], [40, 130, 10, 6]]) }, 'tan'),
    s('path', { d: ells([[66, 82, 10, 8], [94, 82, 10, 8]]) }, 'white', { accent: true }),
    s('path', { d: dots([[68, 82], [96, 82]], 4) }, 'black')
  ],
  cardiovascular: [
    s('path', { d: 'M66 46V18M80 44q0-24 30-26M94 48V24', ...SW(9) }, 'blue', { stroke: true }),
    s('path', { d: heart(80, 92, 32) }, 'red', { accent: true }),
    s('path', { d: 'M58 84q10 24 40 26', ...SW(3) }, 'pink', { stroke: true }),
    s('path', { d: 'M14 140h30l8-14 10 26 8-12h76', ...SW(4) }, 'green', { stroke: true })
  ],
  carita: [
    s('rect', { x: 34, y: 14, width: 92, height: 132, rx: 14 }, 'dark'),
    s('rect', { x: 40, y: 26, width: 80, height: 108, rx: 4 }, 'sky'),
    s('path', { d: bubble(48, 40, 64, 64) }, 'white'),
    ...face(80, 68, 18, 'yellow', 'smile', { accent: true })
  ],
  cervical: [
    s('path', { d: HEAD, transform: 'translate(0 4)' }, 'skin'),
    s('path', { d: 'M58 140v-22q-10-4-16-10', ...SW(10) }, 'pink', { stroke: true }),
    s('path', { d: dots([[60, 112], [60, 122], [60, 132]], 4) }, 'red', { accent: true }),
    s('path', { d: 'M40 96l-14-6M38 108l-14 2', ...SW(3) }, 'red', { stroke: true })
  ],
  cetro: [
    s('path', { d: 'M54 136L100 52', ...SW(9) }, 'yellow', { stroke: true }),
    s('path', { d: 'M48 128l12 8M92 58l14 8', ...SW(6) }, 'orange', { stroke: true }),
    s('circle', { cx: 108, cy: 40, r: 16 }, 'yellow'),
    s('circle', { cx: 108, cy: 40, r: 8 }, 'red', { accent: true }),
    s('path', { d: 'M108 14v10M122 18l-6 8M94 18l6 8', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: sparkle(130, 70, 7) + sparkle(36, 40, 6) }, 'yellow')
  ],
  chamo: [
    ground(),
    ...person(48, 136, 'orange', { accent: true }),
    s('path', { d: 'M34 72q14-16 28 0z' }, 'red'),
    s('path', { d: 'M60 72h16', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M62 100l18-30', ...SW(6) }, 'skin', { stroke: true }),
    ...person(112, 136, 'green'),
    s('path', { d: 'M98 100l-16-30', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(81, 56, 8) }, 'yellow')
  ],
  cinematografía: [
    s('path', { d: 'M50 136l26-44M110 136l-26-44M80 92v44', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 36, y: 64, width: 70, height: 36, rx: 6 }, 'dark', { accent: true }),
    s('path', { d: 'M106 72l26-10v40l-26-10z' }, 'gray'),
    s('path', { d: dots([[50, 40], [88, 40]], 20) }, 'dark'),
    s('path', { d: dots([[50, 40], [88, 40]], 6) }, 'gray'),
    s('path', { d: 'M132 66l12-12M132 98l12 12', ...SW(3) }, 'yellow', { stroke: true })
  ],
  circundante: [
    s('circle', { cx: 80, cy: 80, r: 50, ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M64 76h32v28H64z' }, 'cream'),
    s('path', { d: 'M58 78l22-18 22 18z' }, 'red', { accent: true }),
    s('path', { d: dots(around(80, 80, 50, 8, 22.5), 12) }, 'green'),
    s('path', { d: rects(around(80, 80, 50, 8, 22.5).map(([x, y]) => [x - 2, y + 8, 4, 10])) }, 'brown')
  ],
  colapsar: [
    s('path', { d: ells([[40, 128, 26, 10], [110, 130, 30, 10], [76, 120, 22, 12]]) }, 'tan'),
    s('rect', { x: 26, y: 72, width: 44, height: 56 }, 'gray'),
    s('rect', { x: 74, y: 44, width: 44, height: 50, transform: 'rotate(24 96 94)' }, 'gray', { accent: true }),
    s('path', { d: grid(34, 80, 2, 3, 10, 10, 18, 16) }, 'sky'),
    s('rect', { x: 92, y: 104, width: 40, height: 18, transform: 'rotate(-10 112 113)' }, 'gray'),
    s('path', { d: 'M70 72l8 10-6 12 8 10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[130, 50], [140, 66], [24, 56]], 4) }, 'brown')
  ],
  confortable: [
    s('rect', { x: 26, y: 40, width: 108, height: 70, rx: 22 }, 'purple', { accent: true }),
    s('rect', { x: 16, y: 74, width: 30, height: 50, rx: 14 }, 'purple'),
    s('rect', { x: 114, y: 74, width: 30, height: 50, rx: 14 }, 'purple'),
    s('rect', { x: 42, y: 92, width: 76, height: 28, rx: 10 }, 'pink'),
    s('path', { d: 'M28 124v12M132 124v12', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 58, y: 58, width: 44, height: 30, rx: 10 }, 'yellow')
  ],
  conservadurismo: [
    s('rect', { x: 30, y: 124, width: 100, height: 14, rx: 4 }, 'brown'),
    s('path', { d: 'M38 124V70q0-46 42-46t42 46v54z' }, 'sky'),
    s('path', { d: 'M54 76h52L80 60zM58 80h44v6H58zM58 112h44v8H58z' }, 'tan', { accent: true }),
    s('path', { d: rects([[62, 88, 6, 24], [77, 88, 6, 24], [92, 88, 6, 24]]) }, 'tan'),
    s('path', { d: 'M54 42q10-10 22-12', ...SW(4) }, 'white', { stroke: true })
  ],
  contralor: [
    ...paper(22, 26, 76, 100),
    s('path', { d: 'M32 44h56M32 60h56M32 76h56M32 92h40', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[40, 138, 12, 5], [40, 132, 12, 5], [40, 126, 12, 5]]) }, 'yellow'),
    s('circle', { cx: 100, cy: 80, r: 22 }, 'sky'),
    s('path', { d: ring(100, 80, 22) + 'M116 96l24 24', ...SW(7) }, 'navy', { stroke: true, accent: true })
  ],
  contundencia: [
    s('path', { d: burst(110, 80, 40, 22, 12) }, 'yellow'),
    s('path', { d: burst(110, 80, 22, 12, 10) }, 'orange'),
    s('rect', { x: 14, y: 68, width: 40, height: 26, rx: 6 }, 'blue'),
    s('rect', { x: 50, y: 56, width: 48, height: 48, rx: 14 }, 'red', { accent: true }),
    s('path', { d: 'M86 62v40M74 60v42', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 50l-10-8M28 112l-10 8', ...SW(4) }, 'gray', { stroke: true })
  ],
  cromosoma: [
    s('path', { d: 'M40 20q20 30 40 60q20 30 40 60', ...SW(22) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M120 20q-20 30-40 60q-20 30-40 60', ...SW(22) }, 'pink', { stroke: true }),
    s('path', { d: 'M38 34l14-8M54 58l14-8M94 108l14-8M108 132l14-8', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: 'M108 26l14 8M92 50l14 8M54 104l14 8M36 128l14 8', ...SW(4) }, 'red', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 10 }, 'yellow')
  ],
  cronológico: [
    s('path', { d: 'M16 112h128', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: dots([[30, 112], [64, 112], [98, 112], [132, 112]], 8) }, 'blue'),
    s('path', { d: 'M30 112v-14M64 112v18M98 112v-14M132 112v18', ...SW(3) }, 'blue', { stroke: true }),
    s('circle', { cx: 80, cy: 50, r: 30 }, 'white'),
    s('path', { d: ring(80, 50, 30), ...SW(5) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M80 32v18l12 8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M128 104l14 8-14 8', ...SW(5) }, 'gray', { stroke: true })
  ],
  cupido: [
    s('path', { d: ells([[48, 68, 22, 12], [44, 84, 18, 10]]) }, 'white'),
    s('path', { d: ells([[48, 68, 22, 12], [44, 84, 18, 10]]), ...SW(2) }, 'sky', { stroke: true }),
    s('circle', { cx: 74, cy: 50, r: 14 }, 'skin'),
    s('path', { d: ells([[74, 88, 18, 24]]) }, 'skin'),
    s('path', { d: 'M100 52q30 30 0 60', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 52v60M70 82h70', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: heart(140, 76, 7) }, 'red', { accent: true }),
    s('path', { d: 'M62 40q12-10 24 0', ...SW(4) }, 'yellow', { stroke: true })
  ],
  desertor: [
    s('path', { d: 'M14 136q40-20 70-6t62 6z' }, 'tan'),
    s('path', { d: 'M28 132V52', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 52h30v20H28z' }, 'red'),
    s('path', { d: 'M30 132a12 8 0 0 1 24 0z' }, 'green'),
    ...lean(108, 132, 22, 'green', { accent: true }),
    s('path', { d: 'M80 100h-34M90 84h-30', ...SW(3) }, 'gray', { stroke: true })
  ],
  deshonra: [
    ground(),
    s('circle', { cx: 80, cy: 64, r: 14 }, 'skin'),
    s('path', { d: 'M62 136V96q0-18 18-18t18 18v40z' }, 'gray', { accent: true }),
    s('path', { d: 'M66 90l10-26M94 90l-10-26', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M114 136l6-28h10l6 28z' }, 'red'),
    s('path', { d: 'M126 118a12 12 0 1 0-4 0', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: drop(104, 56, 5) }, 'sky')
  ],
  deslizar: [
    s('rect', { x: 44, y: 14, width: 72, height: 132, rx: 12 }, 'dark'),
    s('rect', { x: 50, y: 26, width: 60, height: 108, rx: 3 }, 'sky'),
    s('path', { d: rects([[56, 40, 48, 26], [56, 74, 48, 26]]) }, 'white'),
    s('path', { d: 'M100 112H36M46 102l-10 10 10 10', ...SW(6) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M112 98q-10 6-4 20l6 20h24l4-24-24-10v-14q0-6-6-4z' }, 'skin')
  ],
  desmantelar: [
    s('rect', { x: 20, y: 96, width: 60, height: 40, rx: 3 }, 'gray'),
    s('rect', { x: 92, y: 60, width: 36, height: 24, rx: 3, transform: 'rotate(20 110 72)' }, 'gray'),
    s('rect', { x: 40, y: 50, width: 28, height: 26, rx: 3, transform: 'rotate(-14 54 63)' }, 'gray'),
    s('path', { d: dots([[34, 108], [66, 108], [104, 128], [124, 112]], 4) }, 'dark'),
    s('path', { d: 'M96 120l34-34', ...SW(8) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M126 76q14-2 12 12l-6-2-4 4 2 6q-14 2-12-12z' }, 'blue'),
    s('path', { d: 'M76 40l10-8M86 50l12-2M30 40l-6-10', ...SW(3) }, 'orange', { stroke: true })
  ],
  desodorante: [
    s('rect', { x: 52, y: 56, width: 44, height: 82, rx: 10 }, 'sky', { accent: true }),
    s('rect', { x: 56, y: 36, width: 36, height: 22, rx: 4 }, 'blue'),
    s('rect', { x: 60, y: 76, width: 28, height: 30, rx: 4 }, 'white'),
    s('path', { d: 'M96 44h4', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M106 40l30-14M108 46h34M106 52l30 14', ...DASH(3, '3 5') }, 'mint', { stroke: true }),
    s('path', { d: sparkle(130, 82, 8) + sparkle(30, 46, 7) }, 'green')
  ],
  dial: [
    s('rect', { x: 14, y: 44, width: 132, height: 88, rx: 12 }, 'brown'),
    s('path', { d: 'M40 44L80 18', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 24, y: 56, width: 60, height: 66, rx: 6 }, 'tan'),
    s('path', { d: 'M30 70h48M30 82h48M30 94h48M30 106h48', ...SW(2) }, 'brown', { stroke: true }),
    s('circle', { cx: 114, cy: 88, r: 22 }, 'cream', { accent: true }),
    s('path', { d: ring(114, 88, 22), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M114 88l10-16', ...SW(4) }, 'red', { stroke: true })
  ],
  diversificar: [
    s('path', { d: 'M18 80h40', ...SW(10) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 80q20 0 40-44h20', ...SW(7) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M58 80h60', ...SW(7) }, 'blue', { stroke: true }),
    s('path', { d: 'M58 80q20 0 40 44h20', ...SW(7) }, 'green', { stroke: true }),
    s('path', { d: 'M118 26l16 10-16 10zM118 70l16 10-16 10zM118 114l16 10-16 10z' }, 'orange')
  ],
  eminentemente: [
    s('path', { d: 'M14 136l30-40 20 20 16-86 20 60 14-14 32 60z' }, 'gray'),
    s('path', { d: 'M70 60l10-30 10 30-10-6z' }, 'white'),
    s('path', { d: 'M80 30V12', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 12h20l-6 6 6 6H80z' }, 'red', { accent: true }),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'green', { stroke: true })
  ],
  enfermar: [
    s('rect', { x: 14, y: 96, width: 132, height: 20, rx: 4 }, 'sky'),
    s('path', { d: 'M18 116v20M142 116v20', ...SW(5) }, 'gray', { stroke: true }),
    ...face(46, 80, 18, 'pink', 'frown'),
    s('rect', { x: 66, y: 78, width: 74, height: 24, rx: 10 }, 'mint', { accent: true }),
    s('path', { d: 'M54 92l18 8', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 34, y: 54, width: 26, height: 8, rx: 3 }, 'white'),
    s('path', { d: 'M100 30v34M100 64a6 6 0 1 0 0.1 0', ...SW(5) }, 'red', { stroke: true })
  ],
  escaparate: [
    s('rect', { x: 14, y: 20, width: 132, height: 116, rx: 4 }, 'brown'),
    s('rect', { x: 24, y: 40, width: 112, height: 86 }, 'sky'),
    s('path', { d: 'M14 20h132v16H14z' }, 'red'),
    s('path', { d: 'M70 66h20l10 50H60z' }, 'pink', { accent: true }),
    s('circle', { cx: 80, cy: 56, r: 8 }, 'white'),
    s('path', { d: 'M30 116h22v-16H30zM108 116h22V90h-22z' }, 'orange'),
    s('path', { d: 'M110 46l-16 20M124 48l-24 30', ...SW(3) }, 'white', { stroke: true })
  ],
  escolaridad: [
    s('rect', { x: 18, y: 116, width: 36, height: 20, rx: 2 }, 'red'),
    s('rect', { x: 62, y: 96, width: 36, height: 40, rx: 2 }, 'blue'),
    s('rect', { x: 106, y: 76, width: 36, height: 60, rx: 2 }, 'green'),
    s('path', { d: 'M18 126h36M62 106h36M62 116h36M106 86h36M106 96h36M106 106h36', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M100 52l24-10 24 10-24 10z' }, 'black', { accent: true }),
    s('path', { d: 'M112 58v10q12 6 24 0V58z' }, 'black'),
    s('path', { d: 'M148 52v14', ...SW(2) }, 'yellow', { stroke: true })
  ],
  establo: [
    ground(),
    s('path', { d: 'M22 136V66l58-38 58 38v70z' }, 'red', { accent: true }),
    s('path', { d: 'M14 70l66-48 66 48', ...SW(6) }, 'white', { stroke: true }),
    s('rect', { x: 52, y: 84, width: 56, height: 52 }, 'white'),
    s('path', { d: 'M56 88l48 44M104 88l-48 44M56 88h48v44H56z', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 70, y: 46, width: 20, height: 18 }, 'tan'),
    s('path', { d: 'M18 136V112M142 136V112M14 112h22M124 112h22', ...SW(4) }, 'tan', { stroke: true })
  ],
  fantasiar: [
    ...person(36, 140, 'blue', { h: 40, w: 26, r: 11 }),
    s('path', { d: dots([[56, 72], [64, 60]], 4) }, 'white'),
    s('path', { d: ells([[100, 44, 40, 26], [80, 30, 20, 16], [118, 26, 18, 14]]) }, 'white'),
    s('path', { d: ells([[100, 44, 40, 26]]) + dots([[56, 72], [64, 60]], 4), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 58V34l6 4v-8l8 4 6-6 6 6 8-4v8l6-4v24z' }, 'purple', { accent: true }),
    s('path', { d: sparkle(130, 50, 6) + sparkle(76, 26, 5) }, 'yellow')
  ],
  festín: [
    s('rect', { x: 14, y: 104, width: 132, height: 12, rx: 3 }, 'brown'),
    s('path', { d: 'M24 116v22M136 116v22', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: ells([[56, 102, 34, 6]]) }, 'white'),
    s('path', { d: 'M28 100q0-34 28-34t28 34z' }, 'orange', { accent: true }),
    s('path', { d: 'M80 76l14-10', ...SW(6) }, 'cream', { stroke: true }),
    s('path', { d: 'M100 102V80h36v22z' }, 'pink'),
    s('path', { d: 'M100 80h36v-8h-36z' }, 'white'),
    s('path', { d: dots([[110, 66], [126, 66]], 5) }, 'red'),
    s('path', { d: 'M40 46l6 14M62 42v14M80 46l-6 14', ...SW(3) }, 'gray', { stroke: true })
  ],
  filar: [
    s('path', { d: 'M14 70q36-40 72 0q-36 40-72 0z' }, 'white'),
    s('path', { d: 'M14 70q36-40 72 0q-36 40-72 0z', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 50, cy: 70, r: 12 }, 'black'),
    s('path', { d: 'M18 46q30-14 64 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M90 70h40', ...DASH(4) }, 'orange', { stroke: true }),
    s('path', { d: ring(132, 70, 14) + ring(132, 70, 6), ...SW(4) }, 'red', { stroke: true, accent: true }),
  ],
  folclore: [
    ground(),
    s('circle', { cx: 80, cy: 46, r: 12 }, 'skin'),
    s('path', { d: 'M72 58h16l4 30H68z' }, 'white'),
    s('path', { d: 'M68 84h24l46 40q-58 20-116 0z' }, 'red', { accent: true }),
    s('path', { d: 'M38 116q42 10 84 0', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M72 64l-24-20M88 64l24-20', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: dots([[68, 34], [92, 34]], 5) }, 'pink')
  ],
  galera: [
    s('path', { d: 'M14 120q60 30 132 0z' }, 'sky'),
    s('path', { d: 'M18 94h124l-12 22H30z' }, 'brown', { accent: true }),
    s('path', { d: 'M40 116l-8 18M56 116l-8 18M72 116l-8 18M88 116l-8 18M104 116l-8 18M120 116l-8 18', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M80 94V18', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 24q40 20 0 60q-40-20 0-60z' }, 'cream'),
    s('path', { d: 'M18 94q-6-14 4-18M142 94q8-10 0-20', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 18l16 4-16 4z' }, 'red')
  ],
  gastronómico: [
    s('path', { d: ells([[80, 108, 46, 20]]) }, 'white'),
    s('path', { d: ells([[80, 108, 46, 20], [80, 108, 32, 12]]), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 104q18-20 36 0z' }, 'orange', { accent: true }),
    s('path', { d: dots([[72, 98], [88, 98]], 3) }, 'green'),
    s('path', { d: 'M18 80v56M14 80v14q4 6 8 0V80M142 80v56M142 80q-8 10 0 24', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: ells([[66, 34, 14, 12], [80, 28, 16, 14], [94, 34, 14, 12]]) + 'M64 40h32v18H64z' }, 'white'),
    s('path', { d: 'M66 46a14 12 0 0 1 4-24a16 14 0 0 1 20 0a14 12 0 0 1 4 24M64 40v18h32V40', ...SW(2) }, 'gray', { stroke: true })
  ],
  globalmente: [
    s('circle', { cx: 80, cy: 80, r: 44 }, 'blue', { accent: true }),
    s('path', { d: 'M52 54q14-6 22 4t-2 22q-14 4-24-8zM90 92q14-8 22 4q-2 16-18 18q-10-8-4-22zM96 44q12 0 16 10q-8 4-16-2z' }, 'green'),
    s('path', { d: 'M24 60a60 22 0 0 0 112 40', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M124 92l12 8-14 6', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M136 60a60 22 0 0 0-112 40M36 108l-12-8 14-6', ...DASH(3, '5 6') }, 'yellow', { stroke: true })
  ],
  grabadora: [
    s('rect', { x: 18, y: 48, width: 124, height: 84, rx: 10 }, 'dark'),
    s('rect', { x: 30, y: 60, width: 100, height: 44, rx: 6 }, 'cream'),
    s('path', { d: dots([[58, 82], [102, 82]], 14) }, 'dark'),
    s('path', { d: dots([[58, 82], [102, 82]], 5) }, 'white'),
    s('circle', { cx: 120, cy: 118, r: 7 }, 'red', { accent: true }),
    s('path', { d: rects([[34, 112, 16, 10], [56, 112, 16, 10], [78, 112, 16, 10]]) }, 'gray'),
    s('path', { d: 'M110 34q10-10 20 0M104 26q16-16 32 0', ...SW(4) }, 'red', { stroke: true })
  ],
  helio: [
    s('rect', { x: 22, y: 76, width: 34, height: 60, rx: 12 }, 'gray'),
    s('rect', { x: 32, y: 64, width: 14, height: 14 }, 'dark'),
    s('path', { d: 'M46 70q20 0 30-10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M90 80q-4 30 10 56M118 66q2 40-18 70M138 86q-10 30-38 50', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: ells([[90, 54, 18, 22], [138, 66, 14, 18]]) }, 'pink'),
    s('path', { d: ells([[118, 38, 18, 22]]) }, 'yellow', { accent: true }),
    s('path', { d: ells([[84, 46, 4, 7], [112, 30, 4, 7]]) }, 'white')
  ],
  hemorroides: [
    s('rect', { x: 18, y: 112, width: 124, height: 24, rx: 6 }, 'brown'),
    s('path', { d: ells([[80, 106, 46, 12]]) }, 'pink'),
    s('path', { d: ells([[80, 104, 16, 4]]) }, 'brown'),
    ...face(80, 56, 22, 'skin', 'frown'),
    s('rect', { x: 62, y: 76, width: 36, height: 30, rx: 10 }, 'blue', { accent: true }),
    s('path', { d: 'M106 40l10-6M110 54h12', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: drop(52, 44, 4) }, 'sky')
  ],
  hipódromo: [
    s('path', { d: ells([[80, 104, 66, 36]]) }, 'green'),
    s('path', { d: ells([[80, 104, 66, 36]]) + ells([[80, 104, 44, 20]]), ...SW(6) }, 'tan', { stroke: true }),
    ...scaled(horse('brown', 'dark', { accent: true }), 0.6, 34, 4),
    s('path', { d: 'M108 76V60', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 60h12v8h-12z' }, 'red')
  ],
  homólogo: [
    s('rect', { x: 14, y: 104, width: 132, height: 12, rx: 3 }, 'brown'),
    ...person(40, 112, 'navy', { h: 40, w: 28, r: 12 }),
    ...person(120, 112, 'dark', { h: 40, w: 28, r: 12 }),
    s('path', { d: 'M52 84q14 4 28 0q14 4 28 0', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M76 104V70M84 104V70', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M76 70h-14v10h14zM84 70h14v10H84z' }, 'red', { accent: true })
  ],
  horroroso: [
    s('path', { d: ells([[80, 78, 38, 48]]) }, 'mint', { accent: true }),
    s('path', { d: dots([[64, 62], [96, 62]], 9) }, 'white'),
    s('path', { d: dots([[64, 62], [96, 62]], 4) + ells([[80, 104, 10, 16]]) }, 'black'),
    s('path', { d: 'M44 80q-10 30 10 50M116 80q10 30-10 50', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M28 24l10 12M80 14v14M132 24l-10 12', ...SW(4) }, 'orange', { stroke: true })
  ],
  hostigamiento: [
    ground(),
    ...lean(46, 136, 14, 'blue', { accent: true }),
    s('path', { d: 'M72 92q20 -20 40 0', ...DASH(2, '3 5') }, 'gray', { stroke: true }),
    s('path', { d: ells([[100, 66, 9, 6], [124, 84, 9, 6], [116, 52, 9, 6], [136, 66, 9, 6]]) }, 'yellow'),
    s('path', { d: 'M96 60v12M104 60v12M120 78v12M128 78v12M112 46v12M120 46v12M132 60v12M140 60v12', ...SW(3) }, 'black', { stroke: true }),
    s('path', { d: ells([[98, 58, 6, 4], [122, 76, 6, 4], [114, 44, 6, 4], [134, 58, 6, 4]]) }, 'sky')
  ],
  hídrico: [
    s('path', { d: drop(80, 74, 34) }, 'blue', { accent: true }),
    s('path', { d: 'M66 84q0 14 12 18', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: 'M14 136q11-8 22 0t22 0t22 0t22 0t22 0t22 0', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: drop(30, 40, 8) + drop(132, 50, 7) }, 'sky')
  ],
  ibero: [
    backdrop('sky'),
    s('path', { d: 'M30 50q10-14 30-10q20-4 40 0q16 -6 34 8l-6 14q-8 10-4 26q-10 14-20 24q-20 6-40 2q-14 2-20-6q2-14-10-20q4-10-8-20q4-12 4-18z' }, 'tan', { accent: true }),
    s('path', { d: 'M100 40q8 8 0 16', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M56 74l10-14 10 14z' }, 'brown'),
    s('path', { d: ells([[120, 94, 6, 3], [130, 88, 4, 2]]) }, 'tan')
  ],
  individualidad: [
    s('path', { d: ells([[80, 82, 46, 58]]) }, 'pink'),
    s('path', { d: 'M80 32a40 46 0 0 1 38 56M42 80a40 46 0 0 1 30-46M56 120q-10-20-8-40a32 34 0 0 1 64 4q0 20-6 36M70 128q-8-24-8-44a18 20 0 0 1 36 0q0 22-8 40M80 84q0 26 4 40', ...SW(5) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: sparkle(130, 30, 8) }, 'yellow')
  ],
  infeccioso: [
    s('path', { d: rays(60, 70, 24, 38, 12), ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: dots(around(60, 70, 38, 12), 5) }, 'green'),
    s('circle', { cx: 60, cy: 70, r: 26 }, 'green', { accent: true }),
    s('path', { d: dots([[52, 62], [70, 74], [56, 82]], 5) }, 'mint'),
    s('path', { d: 'M96 96l20 14M110 110v-10h-10', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: busts([126], 146, 22, 22) }, 'gray'),
    s('circle', { cx: 126, cy: 114, r: 9 }, 'pink')
  ],
  inquebrantable: [
    s('path', { d: 'M40 136l16-60h48l16 60z' }, 'gray', { accent: true }),
    s('path', { d: 'M56 76l12 20M104 76l-10 26M64 120h30', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 30L96 66', ...SW(7) }, 'brown', { stroke: true }),
    s('rect', { x: 42, y: 20, width: 40, height: 18, rx: 4, transform: 'rotate(45 62 29)' }, 'dark'),
    s('path', { d: 'M110 48l12-8M112 62h16M100 36l4-14', ...SW(4) }, 'yellow', { stroke: true }),
    ground()
  ],
  insatisfacción: [
    ...face(56, 72, 36, 'yellow', 'frown', { accent: true }),
    s('path', { d: 'M108 74h16q8 0 8 8v26q0 8-8 8h-16zM124 116q0 18-8 22q-6 0-4-14z' }, 'skin'),
    s('path', { d: 'M108 74h-6v34h6', ...SW(4) }, 'blue', { stroke: true })
  ],
  internauta: [
    ...person(46, 136, 'orange', { h: 36, w: 26, r: 11 }),
    s('path', { d: 'M76 136h70', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 132l10-46h48l-10 46z' }, 'dark'),
    s('path', { d: 'M94 124l8-32h36l-8 32z' }, 'sky', { accent: true }),
    s('path', { d: 'M100 36q20-16 40 0M108 46q12-10 24 0', ...SW(5) }, 'blue', { stroke: true }),
    s('circle', { cx: 120, cy: 56, r: 5 }, 'blue'),
    s('path', { d: 'M60 104l30 10', ...SW(6) }, 'skin', { stroke: true })
  ],
  jurídicamente: [
    s('rect', { x: 20, y: 70, width: 70, height: 66, rx: 4 }, 'red', { accent: true }),
    s('rect', { x: 26, y: 74, width: 64, height: 58 }, 'cream'),
    s('path', { d: 'M58 86v34M42 92h32M36 106l6-14 6 14zM68 106l6-14 6 14z', ...SW(3) }, 'brown', { stroke: true }),
    s('rect', { x: 100, y: 22, width: 46, height: 22, rx: 5, transform: 'rotate(30 123 33)' }, 'brown'),
    s('path', { d: 'M114 48l-18 34', ...SW(6) }, 'tan', { stroke: true }),
    s('rect', { x: 100, y: 120, width: 44, height: 14, rx: 3 }, 'brown')
  ],
  lavabo: [
    s('rect', { x: 46, y: 14, width: 68, height: 50, rx: 8 }, 'sky'),
    s('path', { d: 'M56 28l16-8M60 40l24-16', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M22 78h116q0 34-58 34t-58-34z' }, 'white'),
    s('path', { d: 'M22 78h116q0 34-58 34t-58-34zM70 112l2 26h16l2-26', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 78V68h12', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: drop(92, 86, 4) }, 'blue', { accent: true })
  ],
  lavadero: [
    s('path', { d: 'M18 90h124l-10 46H28z' }, 'gray'),
    s('path', { d: ells([[80, 90, 62, 8]]) }, 'sky'),
    s('rect', { x: 92, y: 40, width: 34, height: 58, rx: 4, transform: 'rotate(12 109 69)' }, 'tan'),
    s('path', { d: 'M96 52h26M94 62h26M92 72h26M90 82h26', ...SW(2), transform: 'rotate(12 109 69)' }, 'brown', { stroke: true }),
    s('path', { d: 'M34 60h30l6 30H28z' }, 'pink', { accent: true }),
    s('path', { d: ring(40, 40, 7) + ring(58, 30, 5) + ring(76, 46, 6), ...SW(2) }, 'sky', { stroke: true })
  ],
  lejanía: [
    s('path', { d: 'M14 96l20-14 14 8 18-12 22 16z' }, 'gray'),
    s('circle', { cx: 112, cy: 92, r: 10 }, 'orange'),
    s('path', { d: 'M14 96h132v50H14z' }, 'green'),
    s('path', { d: 'M76 96h6l40 50H38z' }, 'tan'),
    ...person(130, 140, 'blue', { h: 30, w: 20, r: 8, accent: true }),
    s('path', { d: 'M120 92l10-6', ...SW(4) }, 'skin', { stroke: true }),
    s('path', { d: birds([[60, 50], [84, 40]]), ...SW(3) }, 'dark', { stroke: true })
  ],
  lencería: [
    s('path', { d: 'M80 18v10M56 40q24-20 48 0', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M64 40h32l-2 24 22 64H44l22-64z' }, 'pink', { accent: true }),
    s('path', { d: 'M66 40v-6M94 40v-6', ...SW(3) }, 'pink', { stroke: true }),
    s('path', { d: 'M44 128q6 8 12 0t12 0t12 0t12 0t12 0t12 0', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M66 64h28', ...SW(4) }, 'purple', { stroke: true }),
    s('path', { d: dots([[80, 80], [70, 100], [92, 104]], 3) }, 'white')
  ],
  manipulador: [
    s('path', { d: 'M40 24h80', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M60 10q20-8 40 0v14H60z' }, 'skin'),
    s('path', { d: 'M44 24l20 66M80 24v20M116 24l-20 66M62 28l-8 92M98 28l8 92', ...SW(1.5) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 56, r: 12 }, 'skin'),
    s('rect', { x: 66, y: 68, width: 28, height: 36, rx: 8 }, 'red', { accent: true }),
    s('path', { d: 'M68 74l-6 16M92 74l6 16M72 104l-8 16M88 104l8 16', ...SW(6) }, 'red', { stroke: true })
  ],
  mantra: [
    s('path', { d: ells([[80, 128, 46, 10]]) }, 'orange'),
    s('circle', { cx: 80, cy: 58, r: 13 }, 'skin'),
    s('path', { d: 'M62 118V86q0-12 18-12t18 12v32z' }, 'orange', { accent: true }),
    s('path', { d: 'M40 124q40-20 80 0', ...SW(10) }, 'orange', { stroke: true }),
    s('path', { d: 'M74 58h4M82 58h4', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M102 40q8 8 0 16M112 32q14 16 0 32M58 40q-8 8 0 16M48 32q-14 16 0 32', ...SW(3) }, 'purple', { stroke: true }),
    s('path', { d: dots(around(80, 92, 16, 12).filter(([x, y]) => y > 92), 3) }, 'brown')
  ],
  marciano: [
    s('circle', { cx: 128, cy: 36, r: 16 }, 'red'),
    s('path', { d: 'M64 30l-8-14M96 30l8-14', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: dots([[56, 16], [104, 16]], 5) }, 'yellow'),
    s('path', { d: ells([[80, 58, 28, 26]]) + 'M62 80h36l6 50H56z' }, 'green', { accent: true }),
    s('path', { d: ells([[68, 56, 8, 10], [92, 56, 8, 10]]) }, 'black'),
    s('path', { d: 'M60 92l-20 16M100 92l20 16', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: dots([[24, 30], [40, 120], [140, 100]], 2) }, 'yellow')
  ],
  mote: [
    ...person(44, 136, 'green', { accent: true }),
    s('rect', { x: 32, y: 98, width: 24, height: 16, rx: 3 }, 'white'),
    s('path', { d: 'M32 98h24v5H32z' }, 'red'),
    s('path', { d: star(44, 110, 5) }, 'yellow'),
    ...person(124, 136, 'blue', { h: 40, w: 26, r: 11 }),
    s('path', { d: bubble(68, 22, 56, 40) }, 'cream'),
    s('path', { d: star(96, 40, 13) }, 'orange')
  ],
  moño: [
    s('circle', { cx: 80, cy: 34, r: 20 }, 'brown'),
    s('path', { d: ells([[80, 82, 40, 42]]) }, 'brown'),
    s('path', { d: 'M54 112q26 12 52 0v28H54z' }, 'skin'),
    s('path', { d: 'M78 34q6 -12 0-20M68 30q14 4 22-6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 54l-26-14v28zM80 54l26-14v28z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 54, r: 6 }, 'pink')
  ],
  mástil: [
    s('path', { d: 'M14 128q66 24 132 0v18H14z' }, 'blue'),
    s('path', { d: 'M28 112h104l-12 18H40z' }, 'brown'),
    s('path', { d: 'M80 112V16', ...SW(7) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M86 24q40 40 34 82H86z' }, 'white'),
    s('path', { d: 'M86 24q40 40 34 82H86z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 34q-30 30-30 70h30z' }, 'cream'),
    s('path', { d: 'M80 16l16 6-16 6z' }, 'red')
  ],
  nadador: [
    s('rect', { x: 14, y: 70, width: 132, height: 76, rx: 6 }, 'sky'),
    s('path', { d: 'M24 92h40l40 4', ...SW(14) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 116, cy: 86, r: 12 }, 'skin'),
    s('path', { d: 'M110 78q6-10 16-4', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M76 88q10-50 50-48', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M14 82q11-8 22 0t22 0t22 0t22 0t22 0t22 0', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M18 110h40M80 124h50', ...SW(3) }, 'white', { stroke: true })
  ],
  negatividad: [
    s('path', { d: ells([[80, 36, 46, 16], [56, 30, 22, 14], [104, 30, 22, 14]]) }, 'gray'),
    s('path', { d: 'M50 58v10M70 58v14M90 58v10M110 58v14', ...SW(3) }, 'blue', { stroke: true }),
    s('circle', { cx: 80, cy: 112, r: 28 }, 'red', { accent: true }),
    s('path', { d: 'M64 112h32', ...SW(8) }, 'white', { stroke: true }),
    s('path', { d: 'M38 112h-16M138 112h-16M50 136l-10 8M110 136l10 8', ...SW(4) }, 'dark', { stroke: true })
  ],
  nocivo: [
    ground(),
    s('rect', { x: 22, y: 60, width: 44, height: 76 }, 'gray'),
    s('rect', { x: 32, y: 30, width: 14, height: 30 }, 'dark'),
    s('path', { d: ells([[48, 22, 14, 10], [70, 18, 16, 10], [94, 26, 14, 10]]) }, 'purple', { accent: true }),
    s('path', { d: 'M112 136v-30q0-14 12-22', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: ells([[124, 92, 10, 6]]) + leaflet(112, 116, 160, 18, 5) }, 'brown'),
    s('path', { d: 'M74 60h20M86 50l10 10-10 10', ...SW(4) }, 'purple', { stroke: true })
  ],
  nómada: [
    s('path', { d: 'M14 136q66-14 132 0z' }, 'tan'),
    s('path', { d: 'M20 132V96q22-26 44 0v36z' }, 'cream'),
    s('path', { d: 'M20 96q22-26 44 0', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M34 132v-22h16v22z' }, 'brown'),
    s('path', { d: CAMEL, transform: 'translate(54 6) scale(0.82)' }, 'brown', { accent: true }),
    s('circle', { cx: 126, cy: 30, r: 12 }, 'yellow')
  ],
  orgullosamente: [
    ground(),
    s('circle', { cx: 80, cy: 46, r: 14 }, 'skin'),
    s('path', { d: 'M62 136V78q0-14 18-14t18 14v58z' }, 'blue'),
    s('path', { d: 'M62 78l-20-24M98 78l20-24', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M70 64l10 20 10-20', ...SW(3) }, 'red', { stroke: true }),
    s('circle', { cx: 80, cy: 92, r: 9 }, 'yellow', { accent: true }),
    s('path', { d: sparkle(32, 40, 8) + sparkle(128, 40, 8) + sparkle(120, 96, 6) }, 'yellow')
  ],
  osuno: [
    s('path', { d: dots([[48, 32], [112, 32]], 16) }, 'brown'),
    s('path', { d: dots([[48, 32], [112, 32]], 8) }, 'tan'),
    s('circle', { cx: 80, cy: 76, r: 50 }, 'brown', { accent: true }),
    s('path', { d: ells([[80, 96, 22, 17]]) }, 'tan'),
    s('path', { d: dots([[62, 66], [98, 66]], 6) + ells([[80, 88, 8, 6]]) }, 'black'),
    s('path', { d: 'M72 104q8 8 16 0', ...SW(3) }, 'black', { stroke: true })
  ],
  pacifista: [
    s('circle', { cx: 80, cy: 80, r: 64 }, 'sky'),
    s('path', { d: 'M40 86q20-30 56-20l26-20 6 6-14 20q0 30-40 36q-30 4-40-20z' }, 'white', { accent: true }),
    s('path', { d: 'M56 76q20 20 42-4q-20-4-42 4z' }, 'gray'),
    s('path', { d: 'M128 52l8 4-8 4z' }, 'orange'),
    s('circle', { cx: 120, cy: 50, r: 2.5 }, 'dark'),
    s('path', { d: 'M110 62q14 10 18 22', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: leaflet(118, 70, 20, 14, 4) + leaflet(124, 78, 100, 12, 4) }, 'green')
  ],
  papelera: [
    s('path', { d: 'M40 62h80l-10 74H50z' }, 'gray', { accent: true }),
    s('path', { d: 'M56 70l4 58M80 70v58M104 70l-4 58', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: ells([[64, 58, 14, 12], [92, 54, 14, 12]]) }, 'white'),
    s('path', { d: ells([[64, 58, 14, 12], [92, 54, 14, 12]]) + 'M58 54l8 6M90 48l6 10', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M120 24q12 6 8 18', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 118, cy: 22, r: 9 }, 'cream')
  ],
  paralelismo: [
    s('path', { d: 'M18 56h108', ...SW(10) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M18 104h108', ...SW(10) }, 'red', { stroke: true }),
    s('path', { d: 'M124 44l18 12-18 12zM124 92l18 12-18 12z' }, 'dark'),
    s('path', { d: 'M40 64v32M80 64v32M120 64v32', ...DASH(3, '4 4') }, 'gray', { stroke: true })
  ],
  pasional: [
    s('path', { d: 'M80 130q-60-30-40-80q10 20 20 10q-4-30 20-46q0 26 20 36q10-10 6-24q36 30 14 70q-10 20-40 34z' }, 'orange'),
    s('path', { d: heart(80, 92, 26) }, 'red', { accent: true }),
    s('path', { d: 'M62 74q4-8 12-8', ...SW(3) }, 'pink', { stroke: true })
  ],
  pelaje: [
    s('path', { d: 'M30 136q-10-40 20-70l-6-30 22 18q14-6 28 0l22-18-6 30q30 30 20 70z' }, 'orange', { accent: true }),
    s('path', { d: 'M52 90l12 4M108 90l-12 4M44 112l16 0M116 112h-16', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: ells([[80, 104, 20, 14]]) }, 'cream'),
    s('path', { d: dots([[64, 76], [96, 76]], 5) + 'M74 96h12l-6 6z' }, 'dark'),
    s('path', { d: 'M30 136q4-10 0-20M130 136q-4-10 0-20M24 130l-6-4M136 130l6-4', ...SW(3) }, 'orange', { stroke: true })
  ],
  piquete: [
    s('path', { d: 'M14 100q60-20 132 0v40H14z' }, 'skin'),
    s('circle', { cx: 74, cy: 104, r: 10 }, 'pink', { accent: true }),
    s('path', { d: 'M82 92l-6 8', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: ells([[98, 72, 16, 7]]) }, 'dark'),
    s('circle', { cx: 84, cy: 78, r: 6 }, 'dark'),
    s('path', { d: ells([[100, 58, 12, 6], [112, 62, 12, 6]]) }, 'sky'),
    s('path', { d: 'M92 76l-6 18M104 76l4 18M112 74l10 14', ...SW(2) }, 'dark', { stroke: true })
  ],
  pragmático: [
    s('rect', { x: 18, y: 72, width: 124, height: 64, rx: 6 }, 'red', { accent: true }),
    s('path', { d: 'M58 72V56h44v16', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 18, y: 92, width: 124, height: 8 }, 'dark'),
    s('path', { d: 'M40 70L60 30M104 70l16-36', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 26q8-8 16 0l-4 6h-8zM112 30h16v10h-16z' }, 'gray'),
    s('rect', { x: 74, y: 108, width: 12, height: 10 }, 'yellow')
  ],
  pretendiente: [
    ground(),
    ...lady(118, 136, 'pink'),
    s('circle', { cx: 46, cy: 78, r: 11 }, 'skin'),
    s('path', { d: 'M34 90h24v24h12v22H52v-12H34z' }, 'navy'),
    s('path', { d: 'M58 98l22-6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M84 92v-14', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: dots([[80, 74], [88, 74], [84, 68]], 5) }, 'red', { accent: true }),
    s('path', { d: heart(84, 40, 9) }, 'red')
  ],
  propulsión: [
    s('path', { d: 'M80 14q24 22 22 70H58q-2-48 22-70z' }, 'white'),
    s('path', { d: 'M80 14q24 22 22 70H58q-2-48 22-70z', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 48, r: 9 }, 'sky'),
    s('path', { d: 'M58 66l-16 22h16zM102 66l16 22h-16z' }, 'red'),
    s('path', { d: 'M64 86h32l-6 22-10 30-10-30z' }, 'orange', { accent: true }),
    s('path', { d: 'M72 88h16l-8 26z' }, 'yellow')
  ],
  proyector: [
    s('rect', { x: 70, y: 18, width: 76, height: 56, rx: 2 }, 'white'),
    outline({ x: 70, y: 18, width: 76, height: 56, rx: 2 }),
    s('path', { d: 'M40 106L70 18h76z' }, 'yellow'),
    s('path', { d: 'M90 34l20 14 16-20 14 38H82z' }, 'sky'),
    s('rect', { x: 16, y: 98, width: 50, height: 28, rx: 6 }, 'dark', { accent: true }),
    s('circle', { cx: 52, cy: 108, r: 8 }, 'gray'),
    s('rect', { x: 10, y: 126, width: 64, height: 10, rx: 3 }, 'brown')
  ],
  quirófano: [
    s('path', { d: 'M80 14v14M50 44q30-20 60 0z' }, 'gray'),
    s('path', { d: 'M52 44l-14 30M108 44l14 30', ...DASH(2, '4 4') }, 'yellow', { stroke: true }),
    s('rect', { x: 20, y: 96, width: 120, height: 12, rx: 4 }, 'sky'),
    s('path', { d: 'M80 108v28M60 136h40', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: busts([108], 96, 26, 24) }, 'green', { accent: true }),
    s('circle', { cx: 108, cy: 60, r: 11 }, 'skin'),
    s('path', { d: 'M100 64h16v6h-16zM98 54h20v-8h-20z' }, 'green'),
    s('rect', { x: 28, y: 86, width: 58, height: 12, rx: 5 }, 'white')
  ],
  racionamiento: [
    s('path', { d: 'M14 100h40q0 22-20 22t-20-22zM60 100h40q0 22-20 22t-20-22zM106 100h40q0 22-20 22t-20-22z' }, 'blue'),
    s('path', { d: ells([[34, 100, 14, 6], [80, 100, 14, 6], [126, 100, 14, 6]]) }, 'cream', { accent: true }),
    s('path', { d: 'M110 36l-20 36', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 70q6 18 22 10l-6-12z' }, 'gray'),
    s('path', { d: dots([[86, 82], [84, 90]], 3) }, 'cream'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'brown', { stroke: true })
  ],
  recolector: [
    ...tree(46),
    s('path', { d: dots([[30, 60], [52, 52], [62, 76], [26, 84]], 6) }, 'red'),
    ...person(104, 136, 'orange', { accent: true }),
    s('path', { d: 'M94 98L74 72', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M114 112h28l-4 24h-20z' }, 'tan'),
    s('path', { d: dots([[122, 110], [134, 110]], 6) }, 'red')
  ],
  reflexivo: [
    ...person(46, 136, 'blue', { accent: true }),
    s('path', { d: 'M58 104q10-14-2-26', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 86, y: 30, width: 50, height: 106, rx: 25 }, 'sky'),
    s('path', { d: 'M86 55a25 25 0 0 1 50 0v81H86z', ...SW(4) }, 'brown', { stroke: true }),
    ...person(111, 126, 'navy', { h: 34, w: 22, r: 9 }),
    s('path', { d: dots([[30, 46], [22, 34]], 3) + ells([[24, 22, 10, 7]]) }, 'gray')
  ],
  religiosidad: [
    s('path', { d: rays(80, 76, 44, 62, 12), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M78 120V40q-6-10-14 0l-14 50 10 30zM82 120V40q6-10 14 0l14 50-10 30z' }, 'skin'),
    s('path', { d: 'M80 40v80', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M56 118h48v20H56z' }, 'purple', { accent: true })
  ],
  representatividad: [
    s('path', { d: busts([22, 46, 22, 46], 136, 20, 20) + busts([34], 116, 20, 20) }, 'gray'),
    s('path', { d: dots([[22, 112], [46, 112], [34, 92]], 8) }, 'gray'),
    s('path', { d: 'M62 104h22M74 94l10 10-10 10', ...SW(5) }, 'orange', { stroke: true }),
    s('rect', { x: 92, y: 104, width: 52, height: 32, rx: 3 }, 'brown'),
    ...person(118, 104, 'blue', { h: 36, w: 26, r: 11, accent: true }),
    s('path', { d: 'M104 82l-10-22', ...SW(6) }, 'skin', { stroke: true })
  ],
  riña: [
    s('path', { d: burst(80, 82, 56, 40, 14) }, 'gray'),
    s('path', { d: ells([[80, 82, 40, 30]]) }, 'gray'),
    s('path', { d: 'M40 70L20 54M120 96l20 14M58 116l-8 22M108 52l12-20', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: dots([[18, 52], [142, 112], [48, 140], [122, 30]], 7) }, 'skin'),
    s('path', { d: star(70, 76, 10) + star(96, 92, 8) }, 'yellow', { accent: true }),
    s('path', { d: dots([[60, 100], [100, 66]], 6) }, 'red')
  ],
  roedor: [
    s('path', { d: 'M24 120q-12 0-10-14', ...SW(3) }, 'pink', { stroke: true }),
    s('path', { d: 'M24 120q0-40 50-40q30 0 44 14l18 12-20 14H24z' }, 'gray', { accent: true }),
    s('circle', { cx: 90, cy: 76, r: 12 }, 'gray'),
    s('circle', { cx: 90, cy: 76, r: 6 }, 'pink'),
    s('circle', { cx: 112, cy: 98, r: 3 }, 'black'),
    s('rect', { x: 128, y: 112, width: 8, height: 8 }, 'white'),
    s('path', { d: 'M134 108l12 8v20h-24z' }, 'yellow')
  ],
  secretariado: [
    s('rect', { x: 14, y: 104, width: 132, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M20 114v22M140 114v22', ...SW(6) }, 'brown', { stroke: true }),
    ...person(52, 112, 'purple', { h: 36, w: 28, r: 12, accent: true }),
    s('rect', { x: 78, y: 70, width: 42, height: 30, rx: 3 }, 'dark'),
    s('rect', { x: 82, y: 74, width: 34, height: 22 }, 'sky'),
    s('path', { d: 'M126 104V84h18v20zM128 84l4-6h10l2 6z' }, 'yellow')
  ],
  silenciosamente: [
    ...face(80, 76, 46, 'skin', 'flat'),
    s('path', { d: 'M80 140V86', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M80 140V86', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M126 30q8 0 8 8M136 22q14 0 14 14', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 30h12M18 40h8', ...SW(4) }, 'blue', { stroke: true, accent: true })
  ],
  sionista: [
    s('circle', { cx: 120, cy: 34, r: 14 }, 'yellow'),
    s('path', { d: 'M14 136q30-60 66-60t66 60z' }, 'tan'),
    s('path', { d: 'M40 100h80v-14h-6v-8h-8v8H92v-12h-8v12H66v-8h-8v8h-6v-8h-8v8h-4z' }, 'cream', { accent: true }),
    s('path', { d: 'M74 100v-12a6 6 0 0 1 12 0v12z' }, 'brown'),
    s('path', { d: leaflet(26, 120, -70, 22, 6) + leaflet(136, 122, -110, 20, 6) }, 'green')
  ],
  titanio: [
    s('path', { d: 'M20 120l14-26h52l14 26zM60 94l14-26h52l14 26z' }, 'gray', { accent: true }),
    s('path', { d: 'M34 94h52l-6 8H40zM74 68h52l-6 8H80z' }, 'white'),
    s('path', { d: 'M20 120h80M60 94h80M20 120l14-26M100 120L86 94', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(122, 40, 10) + sparkle(40, 66, 7) }, 'sky'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'navy', { stroke: true })
  ],
  travieso: [
    ...face(64, 64, 32, 'skin', 'smile'),
    s('path', { d: 'M36 46q28-24 56 0q-10-6-28-6t-28 6z' }, 'brown'),
    s('rect', { x: 46, y: 96, width: 36, height: 40, rx: 10 }, 'green', { accent: true }),
    s('path', { d: 'M108 136v-30l-10-14M108 106l10-14', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M98 92q10 16 20 0', ...SW(2) }, 'red', { stroke: true }),
    s('circle', { cx: 132, cy: 52, r: 5 }, 'gray'),
    s('path', { d: 'M112 82l18-26', ...DASH(2, '3 4') }, 'gray', { stroke: true })
  ],
  troika: [
    s('path', { d: 'M12 116h30l-6 16H16z' }, 'red'),
    s('path', { d: 'M42 112l30-30M42 112l30-4M42 112l30 22', ...SW(2) }, 'dark', { stroke: true }),
    ...[[96, 44, 'tan'], [96, 80, 'brown'], [96, 116, 'dark']].map(([x, y, c], i) => s('path', { d: `M${x - 24} ${y}a24 10 0 1 0 48 0a24 10 0 1 0-48 0zM${x + 14} ${y - 4}l10-22h12l6 10-4 4-8-2-6 14zM${x - 16} ${y + 6}v16h5v-16zM${x + 12} ${y + 6}v16h5v-16z` }, c, i === 1 ? { accent: true } : {})),
    s('path', { d: 'M14 140h132', ...SW(3) }, 'sky', { stroke: true })
  ],
  tumbar: [
    ground(),
    ...person(30, 136, 'blue', { accent: true }),
    s('path', { d: 'M42 100h16', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 58, y: 70, width: 16, height: 66, rx: 2, transform: 'rotate(20 74 136)' }, 'dark'),
    s('rect', { x: 86, y: 70, width: 16, height: 66, rx: 2, transform: 'rotate(50 102 136)' }, 'dark'),
    s('rect', { x: 110, y: 120, width: 34, height: 16, rx: 2 }, 'dark'),
    s('path', { d: 'M84 54q10-6 20 4', ...SW(3) }, 'orange', { stroke: true })
  ],
  ultravioleta: [
    s('circle', { cx: 46, cy: 46, r: 22 }, 'yellow'),
    s('path', { d: 'M66 66q8 0 8 8t8 8 8 8 8 8 8 8M54 76q8 0 8 8t8 8 8 8 8 8M76 54q8 0 8 8t8 8 8 8 8 8', ...SW(4) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M96 132v-36M66 100q30-40 60 0z' }, 'red'),
    s('path', { d: 'M96 132v-36', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'tan', { stroke: true })
  ],
  unilateralmente: [
    s('rect', { x: 14, y: 100, width: 132, height: 10, rx: 3 }, 'brown'),
    ...person(36, 100, 'red', { h: 36, w: 26, r: 11, accent: true }),
    s('path', { d: 'M48 76l22 10', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 66, y: 76, width: 18, height: 12, rx: 2 }, 'dark'),
    ...paper(62, 88, 36, 12),
    s('path', { d: ring(124, 56, 10) + 'M108 100V80q0-10 16-10t16 10v20', ...DASH(3, '4 4') }, 'gray', { stroke: true }),
    s('path', { d: 'M30 110v26M130 110v26', ...SW(5) }, 'brown', { stroke: true })
  ],
  valija: [
    s('rect', { x: 34, y: 46, width: 92, height: 80, rx: 10 }, 'blue', { accent: true }),
    s('path', { d: 'M64 46V30h32v16', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 52v68M102 52v68', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: dots([[50, 132], [110, 132]], 6) }, 'dark'),
    s('rect', { x: 70, y: 66, width: 22, height: 16, rx: 3, transform: 'rotate(-12 81 74)' }, 'yellow'),
    s('circle', { cx: 112, cy: 100, r: 7 }, 'red')
  ],
  vibrar: [
    s('rect', { x: 54, y: 24, width: 52, height: 112, rx: 10, transform: 'rotate(-10 80 80)' }, 'dark', { accent: true }),
    s('rect', { x: 60, y: 34, width: 40, height: 88, rx: 3, transform: 'rotate(-10 80 80)' }, 'sky'),
    s('path', { d: 'M38 50l-8 6 8 6-8 6 8 6M30 90l-8 6 8 6-8 6M122 52l8 6-8 6 8 6-8 6M130 90l8 6-8 6 8 6', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M40 30l-10-8M120 130l10 8', ...SW(3) }, 'gray', { stroke: true })
  ],
  vizconde: [
    s('path', { d: 'M54 76h52l18 60H36z' }, 'red', { accent: true }),
    s('path', { d: 'M54 76h52v10H54z' }, 'white'),
    s('path', { d: dots([[62, 82], [80, 82], [98, 82]], 2.5) }, 'black'),
    s('circle', { cx: 80, cy: 56, r: 14 }, 'skin'),
    s('path', { d: 'M64 42h32v-8H64z' }, 'yellow'),
    s('path', { d: dots([[64, 30], [72, 30], [80, 30], [88, 30], [96, 30]], 3.5) }, 'white'),
    s('path', { d: ring(64, 30, 3.5) + ring(72, 30, 3.5) + ring(80, 30, 3.5) + ring(88, 30, 3.5) + ring(96, 30, 3.5), ...SW(1.5) }, 'gray', { stroke: true })
  ],
  zeta: [
    s('rect', { x: 14, y: 104, width: 28, height: 28, rx: 4 }, 'red'),
    s('rect', { x: 46, y: 104, width: 28, height: 28, rx: 4 }, 'yellow'),
    s('rect', { x: 78, y: 104, width: 28, height: 28, rx: 4 }, 'green'),
    s('rect', { x: 112, y: 92, width: 36, height: 40, rx: 5 }, 'purple', { accent: true }),
    s('path', { d: 'M20 80q60-50 112-4M120 64l12 12-16 4', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: sparkle(130, 40, 9) }, 'yellow')
  ],
  zodiaco: [
    s('circle', { cx: 80, cy: 80, r: 64 }, 'purple'),
    s('path', { d: [0, 60, 120, 180, 240, 300].map(a => wedge(80, 80, 64, a, a + 30)).join('') }, 'blue'),
    s('path', { d: around(80, 80, 52, 12, 15).map(([x, y]) => sparkle(x, y, 7)).join('') }, 'white'),
    s('circle', { cx: 80, cy: 80, r: 38 }, 'cream'),
    s('path', { d: rays(80, 80, 22, 32, 8), ...SW(4) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 16 }, 'orange', { accent: true })
  ],
  aba: [
    ground(),
    s('circle', { cx: 40, cy: 104, r: 32 }, 'gray', { accent: true }),
    s('path', { d: 'M28 86q10-8 20 2M30 116q12 6 22-4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M78 96h14M76 112h20M80 80h10', ...SW(4) }, 'gray', { stroke: true }),
    ...lean(122, 136, 24, 'orange'),
    s('path', { d: 'M136 98l10-20M116 92l-6-18', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M128 52l8-12M144 60l6-8', ...SW(3) }, 'red', { stroke: true })
  ],
  adornar: [
    s('path', { d: 'M80 14L36 80h16l-24 40h104l-24-40h16z' }, 'green'),
    s('rect', { x: 72, y: 120, width: 16, height: 16 }, 'brown'),
    s('path', { d: dots([[64, 70], [96, 92], [56, 108], [100, 112]], 6) }, 'red', { accent: true }),
    s('path', { d: dots([[86, 54], [70, 92]], 6) }, 'blue'),
    s('path', { d: star(80, 16, 10) }, 'yellow'),
    s('path', { d: 'M128 80l-14 10', ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 112, cy: 94, r: 6 }, 'purple'),
    s('path', { d: 'M150 74h-18', ...SW(9) }, 'skin', { stroke: true })
  ],
  adscribir: [
    s('rect', { x: 58, y: 16, width: 44, height: 26, rx: 4 }, 'navy'),
    s('path', { d: 'M80 42v20M34 62h92M34 62v16M80 62v16M126 62v16', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 16, y: 78, width: 36, height: 24, rx: 4 }, 'sky'),
    s('rect', { x: 62, y: 78, width: 36, height: 24, rx: 4 }, 'sky'),
    s('rect', { x: 108, y: 78, width: 36, height: 24, rx: 4, ...DASH(3, '4 4') }, 'orange', { stroke: true }),
    s('circle', { cx: 126, cy: 86, r: 5 }, 'skin'),
    s('path', { d: busts([126], 102, 14, 10) }, 'orange', { accent: true }),
    s('path', { d: 'M40 132q50 10 82-18M112 112l10 2 0 10', ...SW(4) }, 'green', { stroke: true })
  ],
  aguinaldo: [
    s('rect', { x: 20, y: 60, width: 96, height: 64, rx: 6 }, 'red', { accent: true }),
    s('path', { d: 'M20 64l48 30 48-30', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: ells([[108, 132, 16, 6], [108, 124, 16, 6], [108, 116, 16, 6]]) }, 'yellow'),
    s('path', { d: ells([[108, 116, 16, 6]]), ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: leaflet(118, 42, -30, 22, 7) + leaflet(118, 42, 210, 22, 7) }, 'green'),
    s('path', { d: dots([[114, 46], [122, 46], [118, 40]], 4) }, 'red')
  ],
  alarde: [
    s('path', { d: around(80, 112, 60, 9, 180).concat([]).filter(([, y]) => y <= 112).map(([x, y]) => ells([[x, y, 13, 13]])).join('') + 'M20 112a60 60 0 0 1 120 0z' }, 'green'),
    s('path', { d: dots(around(80, 112, 48, 7, 195).filter(([, y]) => y < 110), 7) }, 'blue'),
    s('path', { d: dots(around(80, 112, 48, 7, 195).filter(([, y]) => y < 110), 3) }, 'yellow'),
    s('path', { d: ells([[80, 112, 16, 22]]) + 'M76 96V66q4-10 12-4l-4 34z' }, 'navy', { accent: true }),
    s('path', { d: 'M88 64l8 2-8 4z' }, 'orange'),
    s('path', { d: 'M72 132v8M88 132v8', ...SW(3) }, 'orange', { stroke: true })
  ],
  alertar: [
    s('path', { d: 'M44 110V84q0-36 36-36t36 36v26z' }, 'red', { accent: true }),
    s('path', { d: 'M62 84q0-18 14-20', ...SW(5) }, 'pink', { stroke: true }),
    s('rect', { x: 32, y: 110, width: 96, height: 22, rx: 4 }, 'dark'),
    s('path', { d: 'M80 34V16M118 46l12-12M42 46L30 34M136 80h12M24 80H12', ...SW(5) }, 'yellow', { stroke: true })
  ],
  anaranjado: [
    s('circle', { cx: 56, cy: 92, r: 36 }, 'orange', { accent: true }),
    s('path', { d: leaflet(58, 56, -50, 24, 8) }, 'green'),
    s('path', { d: dots([[44, 82], [64, 100], [50, 106]], 2) }, 'yellow'),
    s('rect', { x: 102, y: 22, width: 40, height: 116, rx: 6 }, 'cream'),
    s('path', { d: rects([[106, 26, 32, 30], [106, 62, 32, 30], [106, 98, 32, 30]]) }, 'orange'),
    s('rect', { x: 106, y: 62, width: 32, height: 30 }, 'yellow')
  ],
  antiterrorista: [
    ...person(80, 136, 'navy', { h: 50, w: 34, r: 13 }),
    s('path', { d: 'M64 74a16 16 0 0 1 32 0z' }, 'dark'),
    s('rect', { x: 66, y: 74, width: 28, height: 6 }, 'sky'),
    s('path', { d: 'M90 88h40v34q0 14-20 20q-20-6-20-20z' }, 'blue', { accent: true }),
    s('path', { d: 'M96 96h28', ...SW(3) }, 'sky', { stroke: true }),
  ],
  archivar: [
    s('rect', { x: 30, y: 20, width: 80, height: 116, rx: 4 }, 'gray'),
    s('path', { d: rects([[38, 30, 64, 30], [38, 66, 64, 30]]) }, 'gray'),
    s('path', { d: 'M38 30h64v30H38zM38 66h64v30H38z', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 26, y: 100, width: 88, height: 34, rx: 3 }, 'tan'),
    s('path', { d: 'M62 40h16M62 76h16M60 116h20', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 98l8-30h36l-8 30z' }, 'yellow', { accent: true }),
    s('path', { d: 'M130 50v32M122 74l8 10 8-10', ...SW(4) }, 'green', { stroke: true })
  ],
  asistencial: [
    ground(),
    ...person(52, 136, 'mint', { accent: true }),
    s('circle', { cx: 104, cy: 84, r: 11 }, 'skin'),
    s('path', { d: 'M102 72q2-6 8-4', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 92, y: 96, width: 24, height: 40, rx: 8 }, 'purple'),
    s('path', { d: 'M66 104l26 2M126 106v30M118 106q8-6 8 0', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: heart(78, 50, 10) }, 'red')
  ],
  atrevimiento: [
    s('path', { d: 'M14 146V90h22v56zM124 146V90h22v56z' }, 'brown'),
    s('path', { d: 'M36 92q44 10 88 0', ...SW(2) }, 'dark', { stroke: true }),
    ...person(80, 96, 'red', { h: 30, w: 18, r: 9, accent: true }),
    s('path', { d: 'M40 58h80', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[40, 58], [120, 58]], 5) }, 'yellow'),
    s('path', { d: birds([[52, 30], [112, 22]]), ...SW(3) }, 'gray', { stroke: true })
  ],
  autodefensa: [
    ground(),
    ...person(54, 136, 'white'),
    s('rect', { x: 39, y: 100, width: 30, height: 6 }, 'black'),
    s('path', { d: 'M66 104l18-30M64 112l20-8', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M90 54q14 26 0 52', ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M146 80h-26', ...SW(10) }, 'orange', { stroke: true }),
    s('circle', { cx: 112, cy: 80, r: 11 }, 'orange')
  ],
  barranca: [
    s('rect', { x: 14, y: 14, width: 132, height: 60 }, 'sky'),
    s('path', { d: 'M14 54h44l8 20-6 20 10 20-4 32H14zM146 50h-46l-6 24 8 18-8 22 6 32h46z' }, 'orange', { accent: true }),
    s('path', { d: 'M14 54h44M146 50h-46', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M64 146l4-32h30l2 32z' }, 'blue'),
    s('path', { d: 'M24 80h20M30 100h20M112 70h22M110 96h24', ...SW(3) }, 'brown', { stroke: true })
  ],
  bulla: [
    ...face(40, 92, 22, 'yellow', 'flat').slice(0, 2),
    ...face(80, 108, 22, 'pink', 'flat').slice(0, 2),
    ...face(120, 92, 22, 'mint', 'flat').slice(0, 2),
    s('path', { d: ells([[40, 104, 7, 8], [80, 120, 7, 8], [120, 104, 7, 8]]) }, 'dark'),
    s('path', { d: 'M24 54l-8-14M40 50V34M58 54l8-14M104 54l-8-14M120 50V34M138 54l8-14M80 70V54M64 74l-6-12M96 74l6-12', ...SW(4) }, 'red', { stroke: true, accent: true })
  ],
  capar: [
    s('path', { d: 'M48 136q-8-40 32-48q40 8 32 48z' }, 'orange'),
    s('path', { d: 'M62 90L30 30h100L98 90z' }, 'sky', { accent: true }),
    s('path', { d: 'M62 90L30 30M98 90l32-60', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M60 50l-2-18 16 10zM100 50l2-18-16 10z' }, 'orange'),
    s('circle', { cx: 80, cy: 64, r: 24 }, 'orange'),
    s('path', { d: dots([[70, 60], [90, 60]], 3) + 'M76 70h8l-4 4z' }, 'dark'),
    s('path', { d: 'M100 118h18M109 109v18', ...SW(6) }, 'white', { stroke: true })
  ],
  caprichoso: [
    ...face(64, 64, 30, 'skin', 'frown'),
    s('path', { d: 'M44 46l12 6M84 46l-12 6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M46 96h36v40H46z' }, 'pink', { accent: true }),
    s('path', { d: 'M44 104l38 10M84 104l-38 10', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M120 136V64', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 120, cy: 54, r: 18 }, 'purple'),
    s('path', { d: spiral(116, 54), ...SW(3) }, 'pink', { stroke: true })
  ],
  carrusel: [
    s('path', { d: 'M18 50l62-34 62 34z' }, 'red', { accent: true }),
    s('path', { d: 'M18 50q10 10 20 0t21 0 21 0 21 0 21 0 20 0', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M40 56v70M80 56v70M120 56v70', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M24 96q4-10 16-10h6l6-8 6 6-4 6v6q0 6-8 6h-14v8h-6zM104 106q4-10 16-10h6l6-8 6 6-4 6v6q0 6-8 6h-14v8h-6z' }, 'white'),
    s('path', { d: 'M24 96q4-10 16-10h6l6-8 6 6-4 6v6q0 6-8 6h-14v8h-6zM104 106q4-10 16-10h6l6-8 6 6-4 6v6q0 6-8 6h-14v8h-6z', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 14, y: 126, width: 132, height: 12, rx: 4 }, 'pink')
  ],
  certero: [
    s('circle', { cx: 70, cy: 86, r: 52 }, 'white'),
    s('path', { d: ring(70, 86, 52) + ring(70, 86, 32), ...SW(10) }, 'red', { stroke: true }),
    s('circle', { cx: 70, cy: 86, r: 12 }, 'red', { accent: true }),
    s('path', { d: 'M70 86L142 22', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M134 22l12-8-2 14zM128 26l12 0M132 32l0-12', ...SW(3) }, 'blue', { stroke: true })
  ],
  chocante: [
    s('path', { d: burst(80, 70, 60, 40, 12) }, 'yellow'),
    s('circle', { cx: 80, cy: 72, r: 28 }, 'skin'),
    s('path', { d: 'M58 52l-6-14M70 46l-2-16M90 46l2-16M102 52l6-14', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[70, 66], [90, 66]], 6) }, 'white'),
    s('path', { d: dots([[70, 66], [90, 66]], 3) + ells([[80, 88, 6, 9]]) }, 'dark'),
    s('rect', { x: 62, y: 102, width: 36, height: 38, rx: 10 }, 'purple', { accent: true })
  ],
  cholo: [
    ground(),
    ...person(36, 136, 'green'),
    ...person(124, 136, 'blue'),
    s('circle', { cx: 124, cy: 78, r: 12 }, 'brown'),
    s('circle', { cx: 80, cy: 96, r: 10 }, 'tan'),
    s('rect', { x: 70, y: 106, width: 20, height: 30, rx: 7 }, 'orange', { accent: true }),
    s('path', { d: heart(80, 50, 10) }, 'red')
  ],
  churro: [
    s('path', { d: 'M104 136h-38l-4-44h46z' }, 'white'),
    s('path', { d: 'M104 136h-38l-4-44h46zM108 104q16 0 14 14t-16 10', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[85, 94, 23, 6]]) }, 'brown'),
    s('path', { d: 'M24 128L72 40M40 132L92 48', ...SW(14) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M24 128L72 40M40 132L92 48', ...SW(3, { 'stroke-dasharray': '2 6' }) }, 'brown', { stroke: true }),
    s('path', { d: dots([[60, 70], [44, 100], [76, 74], [62, 104]], 2) }, 'white')
  ],
  cobija: [
    s('circle', { cx: 70, cy: 44, r: 18 }, 'skin'),
    s('path', { d: 'M52 36q18-26 36 0q-18-10-36 0z' }, 'brown'),
    s('path', { d: 'M30 136q0-80 40-80t40 80z' }, 'red', { accent: true }),
    s('path', { d: 'M46 80l64 56M38 104l42 32M94 80l-60 56M106 104l-42 32', ...SW(3) }, 'cream', { stroke: true }),
    s('path', { d: 'M64 44h4M76 44h4', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M116 108h22v24h-22z' }, 'white'),
    s('path', { d: 'M116 108h22v24h-22zM120 102q2-6 0-10M132 102q2-6 0-10', ...SW(2) }, 'gray', { stroke: true })
  ],
  compulsivo: [
    s('path', { d: 'M14 38h18l14 64h74l12-46H38', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: dots([[54, 120], [110, 120]], 8) }, 'dark'),
    s('path', { d: rects([[44, 30, 22, 28], [94, 26, 22, 32]]) }, 'red', { accent: true }),
    s('path', { d: rects([[66, 20, 26, 38], [112, 36, 20, 22]]) }, 'blue'),
    s('path', { d: rects([[48, 58, 70, 40]]) }, 'yellow'),
    s('path', { d: 'M50 30q5-10 10 0M98 26q6-10 12 0M70 20q8-12 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  confín: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('path', { d: dots([[30, 30], [120, 24], [64, 20], [134, 60], [24, 70]], 2) }, 'white'),
    s('path', { d: 'M14 86q40-14 84 0v12H14z' }, 'green', { accent: true }),
    s('path', { d: 'M14 98h84l-4 48H14z' }, 'brown'),
    s('path', { d: 'M98 92q14 4 12 54M90 96q10 10 8 50', ...SW(5) }, 'sky', { stroke: true }),
    ...person(40, 88, 'orange', { h: 24, w: 16, r: 7 })
  ],
  contrapeso: [
    s('path', { d: 'M56 136V30', ...SW(8) }, 'yellow', { stroke: true }),
    s('path', { d: 'M18 34h128', ...SW(8) }, 'yellow', { stroke: true, accent: true }),
    s('rect', { x: 18, y: 38, width: 26, height: 26, rx: 2 }, 'dark'),
    s('path', { d: 'M56 14L20 34M56 14l80 20', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M128 38v50', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 116, y: 88, width: 24, height: 20 }, 'orange'),
    s('rect', { x: 40, y: 124, width: 32, height: 12 }, 'gray')
  ],
  contratiempo: [
    s('path', { d: 'M14 134h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 84l12-22h40l14 22z' }, 'sky'),
    s('rect', { x: 20, y: 82, width: 104, height: 34, rx: 10, transform: 'rotate(4 72 99)' }, 'red', { accent: true }),
    s('circle', { cx: 44, cy: 118, r: 14 }, 'dark'),
    s('path', { d: 'M86 134q0-14 16-14t16 14z' }, 'dark'),
    s('circle', { cx: 120, cy: 34, r: 20 }, 'white'),
    s('path', { d: ring(120, 34, 20) + 'M120 22v12l8 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M126 102l10-8M128 116h12', ...SW(3) }, 'orange', { stroke: true })
  ],
};
