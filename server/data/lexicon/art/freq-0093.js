// Illustration specs for words still undrawn in batches 0091–0093 (see server/scripts/lexicon/art.js)
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
  gruta: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 146V100q10-70 66-76q56 6 66 76v46z' }, 'gray'),
    s('path', { d: 'M44 146q0-70 36-74q36 4 36 74z' }, 'dark', { accent: true }),
    s('path', { d: 'M70 76l4 12 4-12zM86 76l3 9 3-9z' }, 'gray'),
    s('path', { d: ells([[80, 140, 26, 6]]) }, 'blue'),
    s('path', { d: 'M14 100q10-70 66-76q56 6 66 76', ...SW(8) }, 'green', { stroke: true })
  ],
  higuera: [
    ground(),
    ...tree(80, 'green'),
    s('path', { d: leaflet(80, 30, -90, 16, 8) + leaflet(80, 30, -150, 14, 6) + leaflet(80, 30, -30, 14, 6) }, 'mint'),
    s('path', { d: drop(58, 70, 7) + drop(98, 60, 7) + drop(76, 92, 7) + drop(110, 92, 6) + drop(46, 98, 6) }, 'purple', { accent: true })
  ],
  hindi: [
    s('path', { d: bubble(20, 24, 120, 92) }, 'white'),
    s('rect', { x: 30, y: 34, width: 100, height: 22, rx: 4 }, 'orange', { accent: true }),
    s('rect', { x: 30, y: 80, width: 100, height: 22, rx: 4 }, 'green'),
    s('path', { d: ring(80, 68, 9) + rays(80, 68, 2, 9, 8), ...SW(2.5) }, 'navy', { stroke: true }),
    s('path', { d: bubble(20, 24, 120, 92), ...SW(3) }, 'gray', { stroke: true })
  ],
  idealismo: [
    ground(),
    ...person(48, 136, 'blue', { h: 46 }),
    s('path', { d: dots([[68, 70], [78, 58]], 4) }, 'gray'),
    s('path', { d: ells([[108, 40, 34, 22], [88, 50, 16, 12], [128, 52, 16, 12], [108, 24, 16, 10]]) }, 'mint'),
    s('path', { d: star(108, 42, 16) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(84, 30, 6) + sparkle(134, 30, 5) }, 'yellow')
  ],
  'ideológicamente': [
    s('path', { d: HEAD }, 'skin'),
    s('path', { d: 'M54 50L86 40L104 64L76 84L54 50M86 40L76 84', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: dots([[54, 50], [86, 40], [104, 64], [76, 84]], 8) }, 'purple', { accent: true }),
    s('path', { d: sparkle(130, 26, 8) }, 'yellow')
  ],
  'ilógico': [
    ground(132),
    s('path', { d: 'M48 72l10-20h38l12 20z' }, 'sky'),
    s('rect', { x: 30, y: 72, width: 100, height: 28, rx: 8 }, 'red', { accent: true }),
    s('path', { d: rects([[38, 98, 30, 30], [92, 98, 30, 30]]) }, 'dark'),
    s('path', { d: dots([[53, 113], [107, 113]], 4) }, 'gray'),
    s('path', { d: spiral(138, 40), ...SW(3) }, 'purple', { stroke: true })
  ],
  impermeable: [
    s('path', { d: drop(28, 30, 4) + drop(130, 24, 4) + drop(40, 76, 4) + drop(134, 70, 4) + drop(118, 46, 4) + drop(24, 112, 4) + drop(140, 110, 4) }, 'blue'),
    s('path', { d: 'M56 52q0-34 24-34t24 34z' }, 'yellow'),
    s('circle', { cx: 80, cy: 48, r: 14 }, 'skin'),
    s('path', { d: 'M66 62h28l18 70H48z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 64v66', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M66 136h12M84 136h12', ...SW(6) }, 'dark', { stroke: true })
  ],
  impunemente: [
    ground(),
    ...lean(64, 136, 12, 'dark', { h: 46 }),
    s('path', { d: 'M62 74h26', ...SW(6) }, 'black', { stroke: true }),
    s('path', { d: ells([[102, 96, 16, 18]]) + 'M96 80l6-8 6 8z' }, 'brown', { accent: true }),
    s('path', { d: ring(30, 126, 8) + 'M38 126h4' + ring(50, 126, 8), ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M118 40l12-8M120 54h14', ...SW(4) }, 'gray', { stroke: true })
  ],
  inalcanzable: [
    ground(),
    ...person(56, 136, 'blue', { h: 50 }),
    s('path', { d: 'M66 90l18-50', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M88 34l22-8', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: star(124, 24, 12) }, 'yellow', { accent: true })
  ],
  incondicionalmente: [
    s('path', { d: heart(80, 66, 30) }, 'red', { accent: true }),
    s('path', { d: 'M20 108q60 36 120 0l-4 22q-56 26-112 0z' }, 'skin'),
    s('path', { d: sparkle(28, 30, 9) + sparkle(134, 36, 8) }, 'yellow'),
    s('path', { d: 'M20 108q60 36 120 0', ...SW(3) }, 'tan', { stroke: true })
  ],
  incumbir: [
    ground(),
    ...person(80, 136, 'green', { h: 46 }),
    s('rect', { x: 52, y: 26, width: 56, height: 36, rx: 4 }, 'brown', { accent: true }),
    s('path', { d: 'M52 44h56M80 26v36', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M30 30v28M24 50l6 8 6-8M130 30v28M124 50l6 8 6-8', ...SW(4) }, 'orange', { stroke: true })
  ],
  indeciso: [
    ground(),
    s('path', { d: 'M80 136V20', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M82 24h50l12 12-12 12H82z' }, 'blue'),
    s('path', { d: 'M78 54H28L16 66l12 12h50z' }, 'red', { accent: true }),
    ...person(112, 136, 'yellow', { h: 36, w: 24, r: 10 }),
    s('path', { d: 'M120 84q10-4 6-14', ...SW(4) }, 'skin', { stroke: true })
  ],
  indistintamente: [
    s('path', { d: 'M30 70h20l-2 52H32zM70 70h20l-2 52H72zM110 70h20l-2 52h-16z' }, 'sky'),
    s('path', { d: 'M31 92h18l-1 30H32zM71 92h18l-1 30H72zM111 92h18l-1 30h-16z' }, 'blue', { accent: true }),
    s('path', { d: 'M20 92h120', ...DASH(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M24 132h112', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 40l-6 12h12zM80 40l-6 12h12zM120 40l-6 12h12z' }, 'green')
  ],
  'inhibición': [
    ground(),
    s('path', { d: 'M60 136l40-8-40-8 40-8-40-8 40-8-40-8', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 44, y: 74, width: 72, height: 18, rx: 4 }, 'brown', { accent: true }),
    s('path', { d: 'M80 74V54', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M62 50h36', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M28 30v26M22 48l6 8 6-8M132 30v26M126 48l6 8 6-8', ...SW(4) }, 'red', { stroke: true })
  ],
  interponer: [
    ground(),
    ...person(30, 136, 'blue', { h: 44, w: 26, r: 11 }),
    ...person(130, 136, 'red', { h: 44, w: 26, r: 11 }),
    s('rect', { x: 66, y: 66, width: 28, height: 70, rx: 4 }, 'orange', { accent: true }),
    arrow('M80 20v34M70 44l10 10 10-10', 'gray', 5)
  ],
  'intrusión': [
    s('path', { d: 'M24 136V60l40-32 40 32v76z' }, 'tan'),
    s('rect', { x: 42, y: 72, width: 44, height: 40, rx: 3 }, 'navy'),
    ground(),
    ...lean(118, 136, -40, 'dark', { h: 44, w: 24, r: 11 }),
    arrow('M138 40q-20-8-36 12M100 40l2 12 12-2', 'red', 5),
    s('path', { d: 'M86 72l-12 10M86 98l-10-6', ...SW(3) }, 'white', { stroke: true, accent: true })
  ],
  jurisdiccional: [
    s('path', { d: 'M24 54q20-30 56-24t50 14q16 30-6 62t-58 22q-34-8-42-40t0-34z' }, 'mint'),
    s('path', { d: 'M24 54q20-30 56-24t50 14q16 30-6 62t-58 22q-34-8-42-40t0-34z', ...DASH(3) }, 'green', { stroke: true }),
    s('path', { d: 'M70 92l34-34', ...SW(7) }, 'brown', { stroke: true }),
    s('rect', { x: 86, y: 34, width: 40, height: 20, rx: 4, transform: 'rotate(45 106 44)' }, 'brown', { accent: true }),
    s('rect', { x: 44, y: 104, width: 40, height: 10, rx: 3 }, 'dark')
  ],
  longevidad: [
    ground(),
    s('circle', { cx: 60, cy: 52, r: 13 }, 'skin'),
    s('path', { d: 'M48 48q12-18 26 0', ...SW(5) }, 'white', { stroke: true, accent: true }),
    s('rect', { x: 46, y: 68, width: 30, height: 68, rx: 10, transform: 'rotate(10 60 136)' }, 'purple'),
    s('path', { d: 'M82 92l8 44M84 92q2-8 8-4', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M104 132q2-22 18-22t18 22z' }, 'green'),
    s('path', { d: 'M138 124q8-6 6-14', ...SW(5) }, 'green', { stroke: true })
  ],
  luisiano: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'mint'),
    s('rect', { x: 14, y: 98, width: 132, height: 48, rx: 12 }, 'blue'),
    s('path', { d: 'M110 98V34M110 40q-20 4-26 30M110 40q20 4 24 30', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M88 60v20M96 48v26M126 56v22M120 48v20', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M22 104q10-14 30-12h34l10 6q-4 6-22 6H52q-20 6-30 0z' }, 'green', { accent: true }),
    s('path', { d: dots([[60, 94]], 3) }, 'dark')
  ],
  'marañón': [
    s('path', { d: 'M76 24q20-6 34 8', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(110, 30, -20, 30, 9) }, 'green'),
    s('path', { d: 'M54 36q22-14 44 0q8 30-4 58q-18 10-36 0q-12-28-4-58z' }, 'red', { accent: true }),
    s('path', { d: 'M62 40q14-8 22 0', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M62 98q-6 30 14 36q22 4 22-10q-2-8-10-6q-8 0-6-20z' }, 'tan')
  ],
  menar: [
    ground(),
    s('path', { d: 'M40 96q-28-90 80 0', ...SW(4) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M40 96q20 54 80 0', ...DASH(3) }, 'orange', { stroke: true }),
    ...person(80, 118, 'pink', { h: 42 }),
    s('path', { d: 'M66 92l-26 4M94 92l26 4', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M60 132h40', ...SW(3) }, 'gray', { stroke: true })
  ],
  mestizaje: [
    ground(),
    s('path', { d: busts([42, 118], 136, 34, 50) }, 'blue'),
    s('circle', { cx: 42, cy: 70, r: 15 }, 'brown'),
    s('circle', { cx: 118, cy: 70, r: 15 }, 'skin'),
    s('path', { d: busts([80], 136, 24, 30) }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 94, r: 11 }, 'tan'),
    s('path', { d: heart(80, 30, 14) }, 'red')
  ],
  minuciosamente: [
    ...paper(22, 26, 80, 104),
    s('path', { d: 'M32 44h60M32 56h60M32 68h48M32 80h60M32 92h40M32 104h60', ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 92, cy: 84, r: 26 }, 'sky'),
    s('path', { d: ring(92, 84, 26), ...SW(7) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M110 102l26 26', ...SW(10) }, 'brown', { stroke: true }),
    s('path', { d: dots([[84, 80], [96, 88]], 2) }, 'dark')
  ],
  moderadamente: [
    s('path', { d: wedge(80, 112, 64, 180, 240) }, 'blue'),
    s('path', { d: wedge(80, 112, 64, 240, 300) }, 'green', { accent: true }),
    s('path', { d: wedge(80, 112, 64, 300, 360) }, 'red'),
    s('circle', { cx: 80, cy: 112, r: 30 }, 'white'),
    s('path', { d: 'M80 112V58', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 112, r: 8 }, 'dark')
  ],
  'monitorización': [
    s('rect', { x: 18, y: 26, width: 124, height: 84, rx: 6 }, 'dark'),
    s('rect', { x: 26, y: 34, width: 108, height: 68, rx: 3 }, 'navy'),
    s('path', { d: 'M30 72h24l8-18 10 34 10-26 6 10h42', ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M80 110v16M54 132h52', ...SW(7) }, 'gray', { stroke: true }),
    s('circle', { cx: 124, cy: 44, r: 4 }, 'red')
  ],
  monstruoso: [
    ground(),
    s('path', { d: 'M40 30l8 20 10-6zM120 30l-8 20-10-6z' }, 'yellow'),
    s('path', { d: 'M30 136V80q0-44 50-44t50 44v56l-12-8-12 8-14-8-12 8-14-8-12 8-12-8z' }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 70, r: 16 }, 'white'),
    s('circle', { cx: 80, cy: 72, r: 7 }, 'dark'),
    s('path', { d: 'M52 98q28 20 56 0q-4 16-28 16t-28-16z' }, 'dark'),
    s('path', { d: 'M60 102l4 8 4-6zM92 102l4 6 4-8z' }, 'white')
  ],
  motriz: [
    ...gear(58, 80, 30, 12, 'orange', { accent: true }),
    s('circle', { cx: 58, cy: 80, r: 10 }, 'dark'),
    ...gear(118, 52, 16, 8, 'gray'),
    s('circle', { cx: 118, cy: 52, r: 5 }, 'dark'),
    arrow('M30 134q28 14 56 0M80 126l6 8-10 4', 'blue', 5),
    arrow('M130 90q-6 18-26 20', 'blue', 5)
  ],
  nicotina: [
    s('rect', { x: 18, y: 104, width: 96, height: 16, rx: 3 }, 'white'),
    s('rect', { x: 18, y: 104, width: 30, height: 16, rx: 3 }, 'orange'),
    s('rect', { x: 18, y: 104, width: 106, height: 16, rx: 3, ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 114, y: 104, width: 10, height: 16, rx: 2 }, 'red'),
    s('path', { d: 'M124 98q-10-12 0-24t0-24', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 30l16-9 16 9v18l-16 9-16-9z', ...SW(5) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: dots([[52, 30], [84, 30], [68, 57], [68, 21]], 5) + 'M84 48l18 10' }, 'purple')
  ],
  oleaje: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 90q20-40 50-30q-16 4-14 22q16-6 30 8q20-34 50-24q-14 6-12 22q12-4 28 4v56H14z' }, 'blue', { accent: true }),
    s('path', { d: 'M14 120q30-16 66 0t66 0v26H14z' }, 'navy'),
    s('path', { d: 'M50 82q2-14 14-22M118 88q0-12 10-20', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: birds([[40, 36], [68, 28]]), ...SW(3) }, 'dark', { stroke: true })
  ],
  ortodoxia: [
    ground(),
    s('rect', { x: 40, y: 80, width: 80, height: 56 }, 'cream'),
    s('rect', { x: 40, y: 80, width: 80, height: 56, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 80q-18-16 20-40q38 24 20 40z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 40V18M72 26h16M74 34l12-4', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M70 136v-26q10-12 20 0v26z' }, 'brown'),
    s('path', { d: 'M28 136v-36q6-10 12 0M132 136v-36q-6-10-12 0', ...SW(4) }, 'gray', { stroke: true })
  ],
  ostras: [
    ...face(56, 58, 36, 'yellow', 'flat'),
    s('ellipse', { cx: 56, cy: 78, rx: 8, ry: 10 }, 'dark'),
    s('path', { d: 'M86 120q20-40 54-14q-10 26-54 14z' }, 'gray', { accent: true }),
    s('path', { d: 'M92 118q18-10 40-10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: burst(30, 124, 14, 6, 8) }, 'orange'),
    s('path', { d: 'M104 30l8-12M114 44l14-6M100 22l-2-10', ...SW(4) }, 'red', { stroke: true })
  ],
  palomar: [
    ground(),
    s('path', { d: 'M76 136V96h8v40z' }, 'brown'),
    s('path', { d: 'M40 58l40-32 40 32z' }, 'red'),
    s('rect', { x: 48, y: 58, width: 64, height: 40 }, 'tan', { accent: true }),
    s('path', { d: dots([[64, 76], [96, 76]], 8) }, 'dark'),
    s('path', { d: 'M54 88h52', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: birds([[30, 30], [128, 24], [138, 46]]), ...SW(4) }, 'gray', { stroke: true })
  ],
  'parábola': [
    ground(),
    s('path', { d: 'M24 128Q80 -10 136 128', ...DASH(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M24 136v-8M136 136v-8', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 59, r: 10 }, 'red', { accent: true }),
    s('path', { d: 'M50 76l-6-6M110 76l6-6', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M80 74v54', ...DASH(2, '4 5') }, 'gray', { stroke: true })
  ],
  penuria: [
    s('path', { d: 'M40 24h80l6 116H96l-16-74-16 74H34z' }, 'brown'),
    s('path', { d: 'M42 34q-14 30 4 36q14 0 10-36zM118 34q14 30-4 36q-14 0-10-36z' }, 'white'),
    s('path', { d: 'M42 34q-14 30 4 36q14 0 10-36zM118 34q14 30-4 36q-14 0-10-36z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M44 100h10v10H44z' }, 'tan', { accent: true }),
    s('path', { d: 'M80 98q-10-14-4-18q6 4 4 18q10-14 4-18q-6 4-4 18z' }, 'gray')
  ],
  perdurar: [
    ground(),
    s('rect', { x: 52, y: 52, width: 56, height: 84 }, 'cream', { accent: true }),
    s('path', { d: 'M62 58v74M74 58v74M86 58v74M98 58v74', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 44, y: 40, width: 72, height: 14, rx: 2 }, 'tan'),
    arrow('M24 70q-6-50 56-56q46 2 58 40M132 46l6 10 10-6', 'orange', 5),
    s('circle', { cx: 132, cy: 92, r: 9 }, 'yellow')
  ],
  poemario: [
    s('rect', { x: 34, y: 22, width: 92, height: 116, rx: 6 }, 'purple', { accent: true }),
    s('rect', { x: 34, y: 22, width: 14, height: 116, rx: 4 }, 'navy'),
    s('rect', { x: 58, y: 36, width: 56, height: 62, rx: 4 }, 'cream'),
    s('path', { d: 'M66 48h36M66 56h28M66 70h40M66 78h24', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: leaflet(70, 120, -40, 40, 8) }, 'white'),
    s('path', { d: 'M70 120l28-24', ...SW(2) }, 'gray', { stroke: true })
  ],
  poetisa: [
    ground(),
    ...lady(54, 136, 'pink', { accent: true }),
    ...paper(92, 66, 40, 50),
    s('path', { d: 'M100 78h24M100 88h18M100 98h24', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: leaflet(104, 104, -60, 50, 8) }, 'purple'),
    s('path', { d: 'M66 100l36 2', ...SW(5) }, 'skin', { stroke: true })
  ],
  pope: [
    ground(),
    s('path', { d: 'M56 136l8-62h32l8 62z' }, 'black', { accent: true }),
    s('circle', { cx: 80, cy: 58, r: 14 }, 'skin'),
    s('rect', { x: 64, y: 22, width: 32, height: 28, rx: 3 }, 'black'),
    s('path', { d: 'M68 64q12 30 24 0z' }, 'gray'),
    s('path', { d: 'M80 96v26M72 104h16M74 114l12-4', ...SW(4) }, 'yellow', { stroke: true })
  ],
  pragmatismo: [
    s('rect', { x: 22, y: 64, width: 116, height: 70, rx: 6 }, 'red', { accent: true }),
    s('path', { d: 'M60 64V50h40v14', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M22 86h116', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M42 62L56 28M54 22a8 8 0 1 0 6 12', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 110, y: 24, width: 12, height: 40, rx: 3 }, 'yellow'),
    s('path', { d: 'M62 108l12 12 24-24', ...SW(7) }, 'white', { stroke: true })
  ],
  prepotencia: [
    ground(),
    ...person(54, 136, 'purple', { h: 70, w: 40, r: 16, accent: true }),
    s('path', { d: 'M48 40q10-6 18-2', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M74 80l30 22', ...SW(6) }, 'skin', { stroke: true }),
    ...person(122, 136, 'gray', { h: 26, w: 20, r: 9 })
  ],
  recepcionista: [
    ...person(80, 100, 'navy', { h: 40 }),
    s('rect', { x: 18, y: 96, width: 124, height: 40, rx: 4 }, 'brown', { accent: true }),
    s('rect', { x: 14, y: 90, width: 132, height: 8, rx: 3 }, 'tan'),
    s('path', { d: 'M28 90q0-16 14-16t14 16z' }, 'yellow'),
    s('path', { d: 'M42 74v-4', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M110 80h16', ...SW(3) }, 'gray', { stroke: true })
  ],
  'rectángulo': [
    s('rect', { x: 20, y: 46, width: 120, height: 72 }, 'blue', { accent: true }),
    s('path', { d: 'M20 58h12v-12M128 46v12h12M20 106h12v12M140 106h-12v12', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M20 132h120M20 128v8M140 128v8M150 46v72M146 46h8M146 118h8', ...SW(3) }, 'gray', { stroke: true })
  ],
  reglamentario: [
    s('rect', { x: 32, y: 24, width: 96, height: 120, rx: 6 }, 'brown'),
    s('rect', { x: 40, y: 34, width: 80, height: 104, rx: 3 }, 'white'),
    s('rect', { x: 62, y: 18, width: 36, height: 14, rx: 4 }, 'gray'),
    s('path', { d: 'M48 54l6 6 10-12M48 84l6 6 10-12M48 114l6 6 10-12', ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M74 56h36M74 86h36M74 116h36', ...SW(4) }, 'gray', { stroke: true })
  ],
  reposar: [
    s('path', { d: 'M22 136V50M138 136V50', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M22 60q58 70 116 0', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M30 74q50 56 100 0q-50 74-100 0z' }, 'orange', { accent: true }),
    s('rect', { x: 52, y: 84, width: 56, height: 18, rx: 8, transform: 'rotate(8 80 93)' }, 'blue'),
    s('circle', { cx: 44, cy: 82, r: 11 }, 'skin'),
    s('circle', { cx: 120, cy: 28, r: 12 }, 'yellow')
  ],
  sabiamente: [
    s('path', { d: 'M40 136q-8-50 10-80q30-26 60 0q18 30 10 80z' }, 'brown', { accent: true }),
    s('path', { d: 'M48 44l-6-16 18 10M112 44l6-16-18 10z' }, 'brown'),
    s('path', { d: dots([[64, 70], [96, 70]], 15) }, 'white'),
    s('path', { d: dots([[64, 70], [96, 70]], 6) }, 'dark'),
    s('path', { d: 'M74 86l6 10 6-10z' }, 'orange'),
    s('rect', { x: 48, y: 108, width: 64, height: 22, rx: 3 }, 'navy')
  ],
  sacerdocio: [
    ground(),
    s('path', { d: 'M54 136l6-70h40l6 70z' }, 'black'),
    s('circle', { cx: 80, cy: 50, r: 14 }, 'skin'),
    s('rect', { x: 74, y: 66, width: 12, height: 8, rx: 2 }, 'white'),
    s('path', { d: 'M66 70l-4 64M94 70l4 64', ...SW(10) }, 'purple', { stroke: true, accent: true }),
    s('rect', { x: 66, y: 94, width: 28, height: 20, rx: 2 }, 'red'),
    s('path', { d: sparkle(124, 36, 10) }, 'yellow')
  ],
  sardina: [
    s('rect', { x: 18, y: 42, width: 124, height: 78, rx: 20 }, 'gray'),
    s('rect', { x: 26, y: 50, width: 108, height: 62, rx: 14 }, 'orange'),
    s('path', { d: fishes([[58, 64], [100, 64], [58, 82], [100, 82], [58, 100], [100, 100]]) }, 'blue', { accent: true }),
    s('path', { d: dots([[64, 62], [106, 62], [64, 80], [106, 80], [64, 98], [106, 98]], 1.5) }, 'dark'),
    s('path', { d: 'M130 40q16-16 8-24', ...SW(4) }, 'gray', { stroke: true })
  ],
  sexismo: [
    s('path', { d: 'M80 136V40M60 136h40', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 30l100 24', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 30l-12 34h24zM130 54l-12 34h24z', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 30, cy: 50, r: 9 }, 'blue', { accent: true }),
    s('path', { d: 'M18 64h24' }, 'gray'),
    s('circle', { cx: 130, cy: 74, r: 9 }, 'pink'),
    s('path', { d: 'M114 88q16-24 32 0zM14 64q16-30 32 0z' }, 'tan')
  ],
  significante: [
    s('path', { d: bubble(16, 24, 64, 52) }, 'sky'),
    s('path', { d: 'M32 48q6-10 0-16M42 56q12-20 0-32M52 62q18-26 0-46', ...SW(4) }, 'navy', { stroke: true, accent: true }),
    arrow('M62 100h24M78 92l8 8-8 8', 'orange', 5),
    s('rect', { x: 114, y: 100, width: 10, height: 36, rx: 3 }, 'brown'),
    s('circle', { cx: 119, cy: 84, r: 24 }, 'green'),
    ground()
  ],
  sobornar: [
    s('rect', { x: 14, y: 34, width: 132, height: 14, rx: 3 }, 'brown'),
    s('path', { d: 'M24 48v92M136 48v92', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 96h28v-8h-28zM120 92H92', ...SW(10) }, 'skin', { stroke: true }),
    s('rect', { x: 64, y: 82, width: 34, height: 20, rx: 2 }, 'green', { accent: true }),
    s('circle', { cx: 81, cy: 92, r: 5 }, 'mint'),
    s('path', { d: 'M50 22l-4-8M80 22v-10M110 22l4-8', ...SW(3) }, 'gray', { stroke: true })
  ],
  suavizar: [
    s('path', { d: 'M14 120l10-10 10 10 10-10 10 10 10-10 10 10h66v16H14z' }, 'pink'),
    s('path', { d: 'M90 70q0-20 20-20h24v20', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 112q4-44 60-44h16v44z' }, 'blue', { accent: true }),
    s('rect', { x: 64, y: 104, width: 76, height: 8, rx: 2 }, 'gray'),
    s('path', { d: 'M20 96q6-6 0-14M34 90q6-6 0-14', ...SW(3) }, 'gray', { stroke: true })
  ],
  subsiguiente: [
    s('rect', { x: 14, y: 62, width: 32, height: 32, rx: 6 }, 'gray'),
    s('rect', { x: 64, y: 62, width: 32, height: 32, rx: 6 }, 'gray'),
    s('rect', { x: 114, y: 58, width: 34, height: 40, rx: 6 }, 'orange', { accent: true }),
    arrow('M48 78h12M54 72l6 6-6 6M98 78h12M104 72l6 6-6 6', 'blue', 4),
    s('path', { d: 'M30 112v6M80 112v6M131 112v6', ...SW(4) }, 'gray', { stroke: true })
  ],
  surrealismo: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('rect', { x: 14, y: 108, width: 132, height: 38, rx: 12 }, 'tan'),
    s('path', { d: 'M30 60h70', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 60q0-30 34-30t34 30q0 30-16 50q-6 10-6-4q-2-30-46-46z' }, 'yellow', { accent: true }),
    s('path', { d: 'M74 44v14l12 6', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 122, cy: 36, r: 10 }, 'orange')
  ],
  tapete: [
    s('path', { d: 'M24 40v80M136 40v80', ...DASH(4, '2 5') }, 'tan', { stroke: true }),
    s('rect', { x: 30, y: 36, width: 100, height: 88, rx: 4 }, 'red', { accent: true }),
    s('rect', { x: 40, y: 46, width: 80, height: 68, rx: 3, ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M80 58l18 22-18 22-18-22z' }, 'navy'),
    s('path', { d: dots([[50, 56], [110, 56], [50, 104], [110, 104]], 4) }, 'cream')
  ],
  tarot: [
    s('rect', { x: 22, y: 36, width: 50, height: 84, rx: 6, transform: 'rotate(-14 47 128)' }, 'navy'),
    s('rect', { x: 88, y: 36, width: 50, height: 84, rx: 6, transform: 'rotate(14 113 128)' }, 'navy'),
    s('rect', { x: 55, y: 28, width: 50, height: 90, rx: 6 }, 'purple', { accent: true }),
    s('path', { d: 'M80 52a16 16 0 1 0 12 26a12 12 0 1 1-12-26z' }, 'yellow'),
    s('path', { d: star(80, 100, 8) + star(34, 72, 6, 2.7) + star(126, 72, 6, 2.7) }, 'yellow'),
    s('path', { d: sparkle(80, 14, 6) }, 'orange')
  ],
  tenaz: [
    s('path', { d: 'M14 136V86q16-10 36-6l14 26 10-30q30-10 72 6v54z' }, 'gray'),
    s('path', { d: 'M64 106l10-30', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M70 92q-2-30 4-54', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(73, 48, -150, 28, 10) + leaflet(73, 60, -30, 28, 10) + leaflet(74, 38, -90, 18, 7) }, 'green', { accent: true }),
    s('circle', { cx: 126, cy: 30, r: 12 }, 'yellow')
  ],
  termas: [
    s('path', { d: 'M36 70q-8-12 0-24t0-24M64 66q-8-12 0-24t0-24M92 70q-8-12 0-24t0-24', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: ells([[80, 112, 64, 26]]) }, 'gray'),
    s('path', { d: ells([[80, 110, 52, 18]]) }, 'sky', { accent: true }),
    s('circle', { cx: 92, cy: 98, r: 11 }, 'skin'),
    s('path', { d: 'M82 92q10-10 20 0z' }, 'white'),
    s('path', { d: 'M40 112q10-4 20 0M108 116q10-4 20 0', ...SW(3) }, 'blue', { stroke: true })
  ],
  'tifón': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'gray'),
    s('path', { d: 'M80 74a6 6 0 0 1 10 6a14 14 0 0 1-24 4a22 22 0 0 1 32-28a32 32 0 0 1-8 52a44 44 0 0 1-54-26', ...SW(9) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M120 140q-4-30 14-52', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(134, 88, 160, 26, 6) + leaflet(134, 88, 130, 24, 6) + leaflet(134, 88, 190, 22, 5) }, 'green'),
    s('path', { d: 'M24 36h30M30 46h26', ...SW(3) }, 'white', { stroke: true })
  ],
  tracto: [
    s('path', { d: 'M44 146V58q0-14 14-16h44q14 2 14 16v88z' }, 'skin'),
    s('circle', { cx: 80, cy: 26, r: 14 }, 'skin'),
    s('path', { d: 'M80 40v26', ...SW(6) }, 'pink', { stroke: true }),
    s('path', { d: 'M78 66q24-6 22 14q-2 12-20 10q-12-2-6-14z' }, 'pink', { accent: true }),
    s('path', { d: 'M86 92q-30 0-26 12t28 4t-6 14q-20 2-22 14', ...SW(6) }, 'red', { stroke: true })
  ],
  trascendente: [
    s('path', { d: halfRays(80, 60, 30, 52, 9), ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 60, r: 22 }, 'yellow', { accent: true }),
    s('path', { d: ells([[48, 100, 32, 14], [80, 104, 30, 16], [114, 100, 32, 14]]) }, 'sky'),
    arrow('M80 140V70M68 82l12-12 12 12', 'orange', 6),
    s('path', { d: 'M18 126h124', ...DASH(3) }, 'gray', { stroke: true })
  ],
  'táctil': [
    s('rect', { x: 34, y: 16, width: 64, height: 120, rx: 10 }, 'dark'),
    s('rect', { x: 40, y: 26, width: 52, height: 96, rx: 3 }, 'sky'),
    s('path', { d: ring(66, 66, 8) + ring(66, 66, 16), ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M68 70q4-6 10 0l12 14q4-4 8 0t2 8q6-2 8 4l4 26q0 18-24 18h-10q-12-2-18-14l-6-16q-2-8 6-6l8 8z' }, 'skin', { accent: true })
  ],
  viaducto: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 146V100q30-10 66 30q36-40 66-30v46z' }, 'green'),
    s('path', { d: 'M14 54h132v12h-6v80h-14v-48a14 14 0 0 0-28 0v48h-14v-48a14 14 0 0 0-28 0v48h-14v-48a14 14 0 0 0-28 0v48H20V66h-6z' }, 'tan', { accent: true }),
    ...car(56, 34, 'red')
  ],
  verter: [
    s('path', { d: 'M30 52h40v50H30zM44 34h12v18H44z', transform: 'rotate(60 50 75)' }, 'green', { accent: true }),
    s('path', { d: 'M88 58q14 14 12 50', ...SW(6) }, 'sky', { stroke: true }),
    s('path', { d: 'M82 96h40l-4 42H86z' }, 'white'),
    s('path', { d: 'M84 116h36l-2 22H86z' }, 'sky'),
    s('path', { d: 'M82 96h40l-4 42H86z', ...SW(3) }, 'gray', { stroke: true })
  ],
  'vándalo': [
    s('rect', { x: 14, y: 20, width: 132, height: 116, rx: 4 }, 'tan'),
    s('path', { d: 'M24 60q14-24 26 0t26-6q10 20 22 0M30 84q20 10 40-10', ...SW(6) }, 'purple', { stroke: true }),
    s('path', { d: 'M100 36h36v28h-36zM104 40l14 10 6-12 8 18', ...SW(3) }, 'dark', { stroke: true }),
    ...person(92, 146, 'dark', { h: 40 }),
    s('path', { d: 'M76 104q-10-8-2-20', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 66, y: 72, width: 10, height: 18, rx: 3 }, 'red', { accent: true })
  ],
  yodo: [
    s('rect', { x: 34, y: 58, width: 52, height: 74, rx: 8 }, 'brown', { accent: true }),
    s('rect', { x: 46, y: 46, width: 28, height: 14 }, 'dark'),
    s('path', { d: 'M60 46V22', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 42, y: 80, width: 36, height: 28, rx: 3 }, 'white'),
    s('path', { d: 'M54 94h12M60 88v12', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: drop(116, 70, 10) }, 'orange'),
    s('rect', { x: 96, y: 112, width: 44, height: 18, rx: 6 }, 'tan')
  ],
  'ídem': [
    ...paper(30, 18, 100, 124),
    s('path', { d: dots([[48, 38], [48, 76], [48, 114]], 7) }, 'blue', { accent: true }),
    s('path', { d: 'M62 38h52M62 76h52M62 114h52', ...SW(5) }, 'gray', { stroke: true }),
    arrow('M48 50v14M43 58l5 6 5-6M48 88v14M43 96l5 6 5-6', 'orange', 3)
  ],
  'acepción': [
    ...openBook(80, 40),
    s('rect', { x: 86, y: 70, width: 40, height: 12, rx: 2 }, 'yellow', { accent: true }),
    s('path', { d: dots([[38, 58], [38, 76], [38, 94], [92, 58], [92, 94]], 3) }, 'blue'),
    s('path', { d: 'M46 58h22M46 76h22M46 94h18M100 58h22M100 94h18M92 76h30', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M124 76l12-30', ...SW(5) }, 'orange', { stroke: true })
  ],
  afirmativo: [
    s('rect', { x: 50, y: 66, width: 56, height: 54, rx: 12 }, 'skin'),
    s('rect', { x: 52, y: 22, width: 20, height: 56, rx: 10 }, 'skin'),
    s('path', { d: 'M74 80h30M74 94h30M74 108h28', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 46, y: 118, width: 64, height: 22, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: sparkle(32, 40, 10) + sparkle(126, 34, 8) }, 'yellow')
  ],
  alcantarilla: [
    s('rect', { x: 14, y: 40, width: 132, height: 30 }, 'gray'),
    s('rect', { x: 14, y: 70, width: 132, height: 76 }, 'brown'),
    s('path', { d: ells([[80, 54, 36, 10]]) }, 'dark', { accent: true }),
    s('path', { d: 'M56 54h48M66 48v12M80 46v16M94 48v12', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 64v28M98 64v28', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 20, y: 96, width: 120, height: 34, rx: 17 }, 'dark'),
    s('path', { d: 'M24 118q14-6 28 0t28 0t28 0t28 0v6H24z' }, 'mint')
  ],
  'alegoría': [
    ...openBook(80, 90),
    s('path', { d: 'M52 70q12-20 30-10l20-18q4 14-8 24q14-4 22 2q-10 10-30 8q-20 8-34-6z' }, 'white'),
    s('path', { d: 'M52 70q12-20 30-10l20-18q4 14-8 24q14-4 22 2q-10 10-30 8q-20 8-34-6z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 70l-10 4 8 2', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: leaflet(40, 52, -150, 18, 5) + leaflet(40, 52, -100, 16, 5) }, 'green', { accent: true }),
    s('path', { d: sparkle(124, 28, 8) + sparkle(30, 26, 6) }, 'yellow')
  ],
  ameno: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 104q66-26 132 0v42H14z' }, 'green'),
    ...face(80, 52, 26, 'yellow', 'smile', { accent: true }),
    s('path', { d: rays(80, 52, 32, 40, 12), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[34, 118], [58, 128], [104, 126], [128, 116]], 5) }, 'pink'),
    s('path', { d: dots([[34, 118], [58, 128], [104, 126], [128, 116]], 2) }, 'yellow')
  ],
  anfiteatro: [
    ground(),
    s('path', { d: 'M18 136V58q62-24 124 0v78z' }, 'tan', { accent: true }),
    s('path', { d: 'M18 82q62-24 124 0M18 106q62-24 124 0', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M28 80v-10a6 6 0 0 1 12 0v8zM50 74v-10a6 6 0 0 1 12 0v8zM74 70v-10a6 6 0 0 1 12 0v10zM98 72v-10a6 6 0 0 1 12 0v10zM120 76v-10a6 6 0 0 1 12 0v12zM28 104v-10a6 6 0 0 1 12 0v8zM50 98v-10a6 6 0 0 1 12 0v8zM74 94v-10a6 6 0 0 1 12 0v10zM98 96v-10a6 6 0 0 1 12 0v10zM120 100v-10a6 6 0 0 1 12 0v12z' }, 'brown'),
    s('path', { d: 'M28 132v-14a6 6 0 0 1 12 0v14zM50 132v-16a6 6 0 0 1 12 0v16zM74 132v-18a6 6 0 0 1 12 0v18zM98 132v-16a6 6 0 0 1 12 0v16zM120 132v-14a6 6 0 0 1 12 0v14z' }, 'dark')
  ],
  'arsénico': [
    s('rect', { x: 46, y: 50, width: 68, height: 90, rx: 12 }, 'purple', { accent: true }),
    s('rect', { x: 66, y: 28, width: 28, height: 24 }, 'purple'),
    s('rect', { x: 62, y: 18, width: 36, height: 12, rx: 3 }, 'dark'),
    s('path', { d: 'M66 88a14 14 0 1 1 28 0v8H66z' }, 'white'),
    s('path', { d: dots([[74, 88], [86, 88]], 4) }, 'purple'),
    s('path', { d: 'M62 106l36 18M98 106l-36 18', ...SW(6) }, 'white', { stroke: true })
  ],
  asno: [
    ...horse('gray', 'dark', { accent: true }),
    s('ellipse', { cx: 116, cy: 24, rx: 5, ry: 16, transform: 'rotate(-20 116 24)' }, 'gray'),
    s('ellipse', { cx: 128, cy: 22, rx: 5, ry: 16, transform: 'rotate(10 128 22)' }, 'gray'),
    s('path', { d: ells([[138, 52, 8, 6]]) }, 'white')
  ],
  atajar: [
    s('path', { d: 'M28 132q-16-40 20-44t40-30t30-28', ...SW(14) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 132q-16-40 20-44t40-30t30-28', ...DASH(3) }, 'white', { stroke: true }),
    s('path', { d: dots([[28, 132]], 8) }, 'blue'),
    s('path', { d: star(124, 28, 12) }, 'yellow'),
    s('path', { d: 'M36 120L108 44M92 42l16 2-2 16', ...SW(7) }, 'red', { stroke: true, accent: true })
  ],
  'autóctono': [
    s('rect', { x: 14, y: 90, width: 132, height: 56, rx: 6 }, 'brown'),
    s('path', { d: 'M80 92v-40', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 60, -150, 36, 12) + leaflet(80, 52, -30, 36, 12) + leaflet(80, 52, -90, 22, 8) }, 'green', { accent: true }),
    s('path', { d: 'M80 92v40M80 100l-26 20M80 100l28 22M80 112l-18 22M80 112l20 20', ...SW(4) }, 'tan', { stroke: true }),
    s('circle', { cx: 128, cy: 30, r: 12 }, 'yellow')
  ],
  'autógrafo': [
    ...paper(20, 28, 104, 80),
    s('path', { d: 'M32 84q10-34 18-14t14 0q4-20 12 0t14-6q6-4 14 10', ...SW(4) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M32 94h80', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 88l34-50', ...SW(8) }, 'red', { stroke: true }),
    s('path', { d: star(46, 128, 10) + star(80, 132, 6) }, 'yellow')
  ],
  basal: [
    s('rect', { x: 66, y: 32, width: 28, height: 24, rx: 3 }, 'sky'),
    s('rect', { x: 48, y: 58, width: 64, height: 24, rx: 3 }, 'sky'),
    s('rect', { x: 30, y: 84, width: 100, height: 24, rx: 3 }, 'sky'),
    s('rect', { x: 14, y: 110, width: 132, height: 26, rx: 3 }, 'orange', { accent: true }),
    s('path', { d: 'M14 142h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  bastidor: [
    s('circle', { cx: 76, cy: 80, r: 54 }, 'cream'),
    s('path', { d: ring(76, 80, 54), ...SW(8) }, 'brown', { stroke: true }),
    s('rect', { x: 68, y: 18, width: 16, height: 10, rx: 2 }, 'gray'),
    ...flower(76, 74, 'pink'),
    s('path', { d: 'M110 110l30 30', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 108q-30-20-26 4', ...SW(2) }, 'red', { stroke: true })
  ],
  bayo: [
    ...horse('tan', 'brown', { accent: true }),
    s('path', { d: 'M48 136h8M60 136h8M90 136h8M102 136h8', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[134, 44]], 2.5) }, 'dark')
  ],
  boa: [
    s('path', { d: 'M24 130q0-20 30-20h52q26 0 26-18t-26-18H56q-22 0-22-16t22-18h40', ...SW(18) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M24 130q0-20 30-20h52q26 0 26-18t-26-18H56q-22 0-22-16t22-18h40', ...DASH(6, '4 12') }, 'brown', { stroke: true }),
    s('path', { d: ells([[104, 40, 16, 11]]) }, 'green'),
    s('path', { d: dots([[110, 36]], 2.5) }, 'dark'),
    s('path', { d: 'M118 44l10 2-4 4 6 0', ...SW(2) }, 'red', { stroke: true })
  ],
  cascabel: [
    s('path', { d: 'M80 36l-14-14h28z' }, 'red'),
    s('circle', { cx: 80, cy: 80, r: 44 }, 'yellow', { accent: true }),
    s('path', { d: 'M38 74h84', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: dots([[80, 98]], 8) + 'M78 104h4v16h-4z' }, 'dark'),
    s('path', { d: 'M68 52q6-8 16-8', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M24 108l-8 6M136 108l8 6M30 124l-6 10M130 124l6 10', ...SW(3) }, 'gray', { stroke: true })
  ],
  cautelar: [
    ...paper(42, 70, 60, 70),
    s('path', { d: 'M52 88h40M52 100h40M52 112h28', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 64q54-60 108 0z' }, 'blue', { accent: true }),
    s('path', { d: 'M72 32v-10', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 70v38', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: drop(136, 40, 4) + drop(146, 70, 4) + drop(130, 96, 4) }, 'sky')
  ],
  centralismo: [
    s('path', { d: dots(around(80, 80, 58, 8, 22.5), 9) }, 'blue'),
    s('path', { d: rays(80, 80, 30, 46, 8, 22.5), ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 24 }, 'red', { accent: true }),
    s('path', { d: star(80, 80, 12) }, 'yellow')
  ],
  chatear: [
    s('rect', { x: 40, y: 14, width: 80, height: 132, rx: 12 }, 'dark'),
    s('rect', { x: 46, y: 26, width: 68, height: 108, rx: 4 }, 'white'),
    s('path', { d: bubble(50, 34, 44, 26) }, 'gray'),
    s('path', { d: 'M110 70h-36a6 6 0 0 0-6 6v10a6 6 0 0 0 6 6h28l8 8z' }, 'green', { accent: true }),
    s('path', { d: bubble(50, 98, 40, 24) }, 'gray'),
    s('path', { d: dots([[62, 44], [72, 44], [82, 44]], 2.5) }, 'dark')
  ],
  chato: [
    s('path', { d: 'M38 44q-18-6-18 18q8 14 22 6M122 44q18-6 18 18q-8 14-22 6' }, 'brown'),
    s('circle', { cx: 80, cy: 80, r: 50 }, 'tan', { accent: true }),
    s('path', { d: ells([[80, 100, 26, 20]]) }, 'dark'),
    s('path', { d: dots([[60, 70], [100, 70]], 7) }, 'dark'),
    s('rect', { x: 70, y: 86, width: 20, height: 8, rx: 4 }, 'black'),
    s('path', { d: 'M74 110q6 4 12 0', ...SW(3) }, 'pink', { stroke: true })
  ],
  clamar: [
    ground(),
    ...person(52, 136, 'orange', { h: 50, accent: true }),
    s('path', { d: 'M66 66l18-8v20z' }, 'red'),
    s('path', { d: 'M38 94L26 52', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 25, cy: 48, r: 6 }, 'skin'),
    s('path', { d: 'M94 52l16-10M96 66h22M94 80l16 10', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M122 34l12-8M126 66h16M122 98l12 8', ...SW(4) }, 'gray', { stroke: true })
  ],
  comino: [
    s('path', { d: 'M18 104h70', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: ells([[104, 104, 38, 22]]) }, 'gray'),
    s('path', { d: ells([[92, 98, 4, 2], [104, 96, 4, 2], [116, 100, 4, 2], [98, 108, 4, 2], [112, 110, 4, 2], [124, 104, 4, 2], [86, 106, 4, 2]]) }, 'brown', { accent: true }),
    s('rect', { x: 32, y: 26, width: 40, height: 50, rx: 6 }, 'cream'),
    s('rect', { x: 32, y: 26, width: 40, height: 50, rx: 6, ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 30, y: 18, width: 44, height: 12, rx: 3 }, 'red'),
    s('path', { d: ells([[44, 56, 3, 2], [56, 62, 3, 2], [60, 50, 3, 2], [48, 66, 3, 2]]) }, 'brown')
  ],
  comparsa: [
    ground(),
    s('path', { d: burst(36, 52, 22, 12, 7) + burst(124, 52, 22, 12, 7) }, 'pink'),
    s('path', { d: burst(80, 40, 26, 14, 8) }, 'yellow'),
    ...person(36, 136, 'purple', { h: 48, w: 26, r: 11 }),
    ...person(80, 130, 'red', { h: 50, w: 28, r: 12, accent: true }),
    ...person(124, 136, 'green', { h: 48, w: 26, r: 11 }),
    s('path', { d: dots([[24, 100], [50, 96], [96, 82], [136, 100], [64, 90]], 3) }, 'yellow')
  ],
  condescendiente: [
    ground(),
    s('rect', { x: 18, y: 108, width: 52, height: 28, rx: 3 }, 'gray'),
    ...person(44, 108, 'navy', { h: 52, accent: true }),
    s('path', { d: 'M38 38q8-4 14-2', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 70q30 6 40 26', ...SW(6) }, 'skin', { stroke: true }),
    ...person(110, 136, 'yellow', { h: 26, w: 22, r: 10 })
  ],
  contraataque: [
    arrow('M18 60h68M72 46l14 14-14 14', 'red', 10),
    s('path', { d: 'M96 30h20v60H96z' }, 'gray'),
    arrow('M104 104q-20 34-60 20M54 112l-12 12 16 6', 'blue', 12),
    s('path', { d: burst(98, 60, 18, 8, 8) }, 'orange', { accent: true })
  ],
  corregidor: [
    ground(),
    s('path', { d: 'M56 136l8-64h32l8 64z' }, 'navy', { accent: true }),
    s('circle', { cx: 80, cy: 58, r: 14 }, 'skin'),
    s('path', { d: 'M56 46q24-20 48 0l-8 4H64z' }, 'black'),
    s('path', { d: 'M74 72l6 10 6-10z' }, 'white'),
    s('path', { d: 'M118 136V60', ...SW(5) }, 'brown', { stroke: true }),
    s('circle', { cx: 118, cy: 58, r: 6 }, 'yellow'),
    s('path', { d: 'M98 96l20-6', ...SW(6) }, 'skin', { stroke: true })
  ],
  cristiandad: [
    s('circle', { cx: 80, cy: 92, r: 44 }, 'blue', { accent: true }),
    s('path', { d: 'M52 72q14-10 24 2t-4 22q-16 4-20-24zM92 96q16-10 30 4q-4 20-18 24q-14-8-12-28z' }, 'green'),
    s('path', { d: 'M80 48V14M68 26h24', ...SW(7) }, 'yellow', { stroke: true }),
    s('path', { d: 'M36 92h88', ...SW(3) }, 'yellow', { stroke: true })
  ],
  'céntrico': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'cream'),
    s('path', { d: 'M14 80h132M80 14v132M14 40h132M14 120h132M40 14v132M120 14v132', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: rects([[46, 46, 28, 28], [86, 46, 28, 28], [46, 86, 28, 28], [86, 86, 28, 28]]) }, 'mint'),
    s('path', { d: 'M80 82q-20-24-20-38a20 20 0 0 1 40 0q0 14-20 38z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 44, r: 7 }, 'white')
  ],
  debilitamiento: [
    s('rect', { x: 26, y: 50, width: 96, height: 56, rx: 8 }, 'dark'),
    s('rect', { x: 32, y: 56, width: 84, height: 44, rx: 4 }, 'white'),
    s('rect', { x: 122, y: 66, width: 10, height: 24, rx: 3 }, 'dark'),
    s('rect', { x: 36, y: 60, width: 16, height: 36, rx: 2 }, 'red', { accent: true }),
    arrow('M80 116v26M70 132l10 10 10-10', 'orange', 5),
    s('path', { d: 'M76 20l-6 18M92 20l6 18', ...SW(4) }, 'gray', { stroke: true })
  ],
  'degeneración': [
    s('circle', { cx: 32, cy: 70, r: 18 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 74, r: 16 }, 'orange'),
    s('path', { d: ells([[128, 82, 14, 10]]) }, 'brown'),
    s('path', { d: dots([[76, 70], [86, 80]], 4) + dots([[124, 80], [134, 84]], 3) }, 'dark'),
    s('path', { d: 'M32 52l4-10M80 58l4-10M128 72l2-8', ...SW(3) }, 'brown', { stroke: true }),
    arrow('M18 116h124M130 106l12 10-12 10', 'gray', 4)
  ],
  'deliberación': [
    s('path', { d: busts([30, 80, 130], 124, 30, 40) }, 'blue'),
    s('path', { d: dots([[30, 74], [80, 74], [130, 74]], 12) }, 'skin'),
    s('rect', { x: 14, y: 108, width: 132, height: 16, rx: 4 }, 'brown'),
    s('path', { d: 'M74 124v14M86 124v14', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: bubble(16, 16, 40, 30) + bubble(104, 16, 40, 30) }, 'mint'),
    s('path', { d: bubble(60, 12, 40, 30) }, 'yellow', { accent: true })
  ],
  desechar: [
    ground(),
    ...person(44, 136, 'green', { h: 48 }),
    s('path', { d: 'M56 98l18-20', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M102 84h40l-6 52h-28z' }, 'gray', { accent: true }),
    s('rect', { x: 98, y: 76, width: 48, height: 8, rx: 3 }, 'dark'),
    s('circle', { cx: 104, cy: 44, r: 10 }, 'white'),
    s('path', { d: ring(104, 44, 10) + 'M98 40l6 6 4-8', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 64q10-20 14-18M114 56l4 10', ...DASH(3, '3 5') }, 'orange', { stroke: true })
  ],
  desvanecer: [
    s('circle', { cx: 40, cy: 80, r: 24 }, 'purple', { accent: true }),
    s('circle', { cx: 92, cy: 80, r: 20 }, 'purple', { opacity: 0.4 }),
    s('path', { d: dots([[124, 66], [132, 84], [122, 96], [140, 70], [142, 98], [130, 110]], 4) }, 'purple', { opacity: 0.3 }),
    s('path', { d: sparkle(120, 40, 7) + sparkle(144, 120, 5) }, 'gray'),
    s('path', { d: 'M24 124h112', ...DASH(3) }, 'gray', { stroke: true })
  ],
  disgustar: [
    ...face(80, 76, 56, 'mint', 'frown', { accent: true }),
    s('path', { d: 'M70 116q10 22 20 0z' }, 'pink'),
    s('path', { d: 'M46 50l18 6M114 50l-18 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 30q6-8 0-16M142 30q6-8 0-16', ...SW(3) }, 'green', { stroke: true })
  ],
  edil: [
    s('path', { d: 'M22 62l58-36 58 36z' }, 'tan'),
    s('rect', { x: 26, y: 62, width: 108, height: 74 }, 'cream'),
    s('path', { d: 'M38 66v70M58 66v70M102 66v70M122 66v70', ...SW(6) }, 'tan', { stroke: true }),
    s('rect', { x: 64, y: 108, width: 32, height: 28, rx: 3 }, 'brown'),
    ...person(80, 108, 'navy', { h: 30, w: 26, r: 11, accent: true }),
    s('path', { d: 'M74 84l6 8 6-8z' }, 'red'),
    ground()
  ],
  ele: [
    s('rect', { x: 24, y: 96, width: 40, height: 40, rx: 4 }, 'red'),
    s('rect', { x: 64, y: 96, width: 40, height: 40, rx: 4 }, 'blue'),
    s('rect', { x: 44, y: 56, width: 40, height: 40, rx: 4 }, 'green'),
    s('rect', { x: 104, y: 70, width: 36, height: 36, rx: 4, transform: 'rotate(15 122 88)' }, 'yellow', { accent: true }),
    s('path', { d: dots([[44, 116], [84, 116], [64, 76]], 6) }, 'cream'),
    ground()
  ],
  emular: [
    ground(),
    ...person(44, 136, 'blue', { h: 48 }),
    s('path', { d: 'M30 96l-12-30M58 96l14-30', ...SW(6) }, 'skin', { stroke: true }),
    ...person(116, 136, 'orange', { h: 48, accent: true }),
    s('path', { d: 'M102 96l-12-30M130 96l14-30', ...SW(6) }, 'skin', { stroke: true }),
    arrow('M60 30q20-12 40 0M92 22l8 8-10 4', 'gray', 4)
  ],
  enmarcar: [
    s('rect', { x: 20, y: 24, width: 120, height: 104, rx: 3 }, 'yellow', { accent: true }),
    s('rect', { x: 34, y: 38, width: 92, height: 76 }, 'sky'),
    s('path', { d: 'M34 114l28-40 20 26 14-16 30 30z' }, 'green'),
    s('circle', { cx: 104, cy: 56, r: 8 }, 'orange'),
    s('path', { d: 'M20 24l14 14M140 24l-14 14M20 128l14-14M140 128l-14-14', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M80 128v14M70 142h20', ...SW(4) }, 'gray', { stroke: true })
  ],
  esclerosis: [
    s('rect', { x: 14, y: 46, width: 132, height: 68, rx: 10 }, 'red'),
    s('path', { d: 'M14 58h132M14 102h132', ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: 'M54 60q26 24 52 0zM62 100q18-18 36 0z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[30, 80], [44, 74], [124, 82], [136, 76]], 5) }, 'pink'),
    arrow('M26 132h108M122 124l12 8-12 8', 'gray', 3)
  ],
  estacional: [
    s('path', { d: wedge(80, 80, 62, 180, 270) }, 'green'),
    s('path', { d: wedge(80, 80, 62, 270, 360) }, 'yellow', { accent: true }),
    s('path', { d: wedge(80, 80, 62, 0, 90) }, 'orange'),
    s('path', { d: wedge(80, 80, 62, 90, 180) }, 'sky'),
    s('path', { d: dots([[104, 56]], 9) + leaflet(98, 98, 45, 22, 8) }, 'white'),
    s('path', { d: 'M56 96v20M46 106h20M49 99l14 14M63 99l-14 14', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: dots([[56, 56], [48, 50], [62, 48]], 5) }, 'pink')
  ],
  'estático': [
    ground(),
    s('rect', { x: 44, y: 82, width: 72, height: 54, rx: 6 }, 'blue', { accent: true }),
    s('path', { d: 'M70 26v34M90 26v34', ...SW(10) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 136v-14M132 136v-14', ...SW(4) }, 'gray', { stroke: true })
  ],
  eufemismo: [
    s('path', { d: burst(66, 70, 52, 30, 11) }, 'red'),
    s('path', { d: ells([[92, 92, 46, 32], [70, 86, 24, 20], [116, 80, 22, 18]]) }, 'pink', { accent: true }),
    s('path', { d: dots([[84, 92], [100, 92], [92, 84], [92, 100]], 6) }, 'white'),
    s('circle', { cx: 92, cy: 92, r: 5 }, 'yellow'),
    s('path', { d: 'M74 120l-6 18 18-12z' }, 'pink')
  ],
  favorablemente: [
    s('path', { d: rects([[26, 104, 22, 32], [58, 88, 22, 48], [90, 68, 22, 68]]) }, 'mint'),
    s('path', { d: 'M24 98l36-24 24 10 46-50M110 32h22v22', ...SW(8) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M18 138h124', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 132, cy: 104, r: 10 }, 'yellow')
  ],
  feminicidio: [
    s('path', { d: 'M80 70q-34-30-12-50q12-6 12 10q0-16 12-10q22 20-12 50zM80 70l-30 70h18l12-30 12 30h18z' }, 'purple', { accent: true }),
    s('path', { d: 'M80 70q-16-18-6-30q6-2 6 6q0-8 6-6q10 12-6 30z' }, 'white'),
    s('rect', { x: 118, y: 100, width: 18, height: 36, rx: 3 }, 'cream'),
    s('path', { d: drop(127, 88, 5) }, 'orange'),
    s('path', { d: 'M18 140h124', ...SW(4) }, 'gray', { stroke: true })
  ],
  fetiche: [
    s('path', { d: ells([[80, 124, 52, 14]]) }, 'red'),
    s('path', { d: 'M64 116l-4-40q0-12 20-12t20 12l-4 40z' }, 'brown', { accent: true }),
    s('circle', { cx: 80, cy: 50, r: 18 }, 'brown'),
    s('path', { d: dots([[73, 48], [87, 48]], 3) + 'M74 58h12v3H74z' }, 'dark'),
    s('path', { d: heart(30, 36, 10) + heart(130, 30, 8) }, 'pink'),
    s('path', { d: sparkle(124, 76, 8) }, 'yellow')
  ],
  'fonética': [
    s('path', { d: 'M20 80q30-34 60 0q-30 40-60 0z' }, 'red', { accent: true }),
    s('path', { d: 'M28 80q22-16 44 0q-22 22-44 0z' }, 'dark'),
    s('path', { d: 'M34 72h32v4H34z' }, 'white'),
    s('path', { d: 'M38 88q12-6 24 0q-12 6-24 0z' }, 'pink'),
    s('path', { d: 'M96 64q8 16 0 32M110 52q14 28 0 56M124 40q20 40 0 80', ...SW(5) }, 'blue', { stroke: true })
  ],
  garbanzo: [
    s('path', { d: 'M18 92h124q-6 46-62 46t-62-46z' }, 'blue', { accent: true }),
    s('path', { d: dots([[38, 84], [56, 78], [74, 82], [92, 76], [110, 82], [126, 86], [48, 66], [66, 62], [86, 60], [104, 64], [76, 46], [96, 46]], 10) }, 'tan'),
    s('path', { d: 'M40 80l4-6M58 74l4-6M76 78l4-6M94 72l4-6M112 78l4-6M50 62l4-6M68 58l4-6M88 56l4-6M106 60l4-6M78 42l4-6M98 42l4-6', ...SW(2) }, 'brown', { stroke: true })
  ],
  georgiano: [
    s('path', { d: 'M24 142V18', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 28, y: 22, width: 112, height: 76 }, 'white'),
    s('path', { d: 'M28 52h112v16H28zM76 22h16v76H76z' }, 'red', { accent: true }),
    s('path', { d: 'M50 30v14M43 37h14M118 30v14M111 37h14M50 76v14M43 83h14M118 76v14M111 83h14', ...SW(4) }, 'red', { stroke: true }),
    s('rect', { x: 28, y: 22, width: 112, height: 76, ...SW(2) }, 'gray', { stroke: true })
  ],
  halar: [
    ground(),
    ...lean(42, 136, -24, 'blue', { h: 46 }),
    s('path', { d: 'M40 88L118 104', ...SW(4) }, 'tan', { stroke: true }),
    s('rect', { x: 110, y: 92, width: 36, height: 44, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: 'M40 94l14-4', ...SW(6) }, 'skin', { stroke: true }),
    arrow('M100 30H52M62 20l-10 10 10 10', 'orange', 5)
  ],
  hereditario: [
    s('path', { d: 'M20 20q40 30 0 60t0 60M60 20q-40 30 0 60t0 60', ...SW(5) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M26 36h28M34 52h12M26 66h28M26 96h28M34 110h12M26 124h28', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: busts([108], 98, 36, 44) }, 'green'),
    s('circle', { cx: 108, cy: 40, r: 16 }, 'skin'),
    s('path', { d: busts([118], 140, 24, 28) }, 'green'),
    s('circle', { cx: 118, cy: 102, r: 10 }, 'skin')
  ],
  idiosincrasia: [
    s('path', { d: 'M80 20q-40 0-46 50M80 34q-28 0-32 40q0 30 10 54M80 48q-20 2-20 30q0 28 12 52M80 62q-8 0-8 16q0 30 14 50M80 34q28 0 32 40q0 30-8 56M80 48q20 2 20 30q0 24-6 42M80 62q8 0 8 18q2 20-2 34M80 20q40 0 46 50q2 24-4 50', ...SW(5) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: sparkle(130, 26, 8) }, 'yellow')
  ],
  'incógnita': [
    s('path', { d: 'M80 140V40M56 140h48', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M32 40h96', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M32 40l-14 34M32 40l14 34M128 40l-14 34M128 40l14 34M16 76h32M112 76h32', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 18, y: 50, width: 28, height: 26, rx: 4 }, 'navy', { accent: true }),
    s('path', { d: dots([[32, 63]], 4) }, 'yellow'),
    s('path', { d: rects([[114, 62, 12, 14], [128, 62, 12, 14], [121, 48, 12, 14]]) }, 'orange')
  ],
  ininterrumpido: [
    s('path', { d: 'M80 80c-20-34-60-34-60 0s40 34 60 0s60-34 60 0s-40 34-60 0', ...SW(14) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M118 58l14-2-4 14', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M42 102l-14 2 4-14', ...SW(5) }, 'dark', { stroke: true })
  ],
  innecesariamente: [
    s('circle', { cx: 126, cy: 32, r: 16 }, 'yellow'),
    s('path', { d: rays(126, 32, 20, 28, 8), ...SW(3) }, 'yellow', { stroke: true }),
    ground(),
    ...person(70, 136, 'green', { h: 44 }),
    s('path', { d: 'M24 54q46-50 92 0z' }, 'red', { accent: true }),
    s('path', { d: 'M70 54v34', ...SW(4) }, 'dark', { stroke: true })
  ],
  insistente: [
    s('rect', { x: 34, y: 26, width: 52, height: 86, rx: 8 }, 'gray'),
    s('circle', { cx: 60, cy: 62, r: 16 }, 'yellow', { accent: true }),
    s('path', { d: 'M74 70q6-6 14 2l26 30v40H86l-18-34q-4-10 6-10l10 10z' }, 'skin'),
    s('path', { d: 'M22 40l-8-6M20 62H10M22 84l-8 6M100 30l10-8M106 50h12', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M88 80l-8-4', ...SW(3) }, 'tan', { stroke: true })
  ],
  intelectualmente: [
    s('path', { d: 'M80 34q-20-16-38 0q-20 6-16 28q-10 18 6 32q4 20 26 18q10 8 22 0q12 8 22 0q22 2 26-18q16-14 6-32q4-22-16-28q-18-16-38 0z' }, 'pink', { accent: true }),
    s('path', { d: 'M80 34v76M54 50q10 8 0 18M40 76q14 0 18 12M106 50q-10 8 0 18M120 76q-14 0-18 12', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M48 138h64', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: sparkle(132, 24, 9) + sparkle(28, 26, 7) }, 'yellow')
  ],
  judicialmente: [
    s('path', { d: 'M18 52l62-34 62 34z' }, 'gray'),
    s('rect', { x: 22, y: 52, width: 116, height: 8 }, 'gray'),
    s('path', { d: 'M34 62v58M56 62v58M104 62v58M126 62v58', ...SW(8) }, 'gray', { stroke: true }),
    s('rect', { x: 16, y: 120, width: 128, height: 14 }, 'gray'),
    s('path', { d: 'M62 104l26-26', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 76, y: 58, width: 30, height: 16, rx: 3, transform: 'rotate(45 91 66)' }, 'brown', { accent: true })
  ],
  kan: [
    s('path', { d: 'M86 136V96q26-28 52 0v40z' }, 'cream'),
    s('path', { d: 'M86 96q26-28 52 0M104 136v-20h16v20', ...SW(3) }, 'red', { stroke: true }),
    ground(),
    s('path', { d: 'M28 136l6-60h36l6 60z' }, 'blue', { accent: true }),
    s('circle', { cx: 52, cy: 58, r: 14 }, 'skin'),
    s('path', { d: 'M36 50q16-36 32 0z' }, 'red'),
    s('path', { d: 'M34 50h36', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 96h24', ...SW(5) }, 'yellow', { stroke: true })
  ],
  litar: [
    s('rect', { x: 34, y: 96, width: 92, height: 40, rx: 3 }, 'gray'),
    s('rect', { x: 26, y: 86, width: 108, height: 12, rx: 3 }, 'tan'),
    s('path', { d: 'M80 84q-24-14-10-40q2 14 10 12q-4-16 10-28q4 20 12 30q4 18-22 26z' }, 'orange', { accent: true }),
    s('path', { d: 'M80 80q-8-8 0-20q8 12 0 20z' }, 'yellow'),
    s('path', { d: dots([[40, 78], [50, 78], [45, 70]], 6) }, 'red'),
    s('path', { d: ells([[118, 78, 12, 8]]) }, 'green')
  ],
  loto: [
    s('rect', { x: 14, y: 96, width: 132, height: 50, rx: 10 }, 'sky'),
    s('path', { d: 'M20 116q40-24 70 0q-20 12-70 0zM96 124q24-18 46 0q-24 10-46 0z' }, 'green'),
    s('path', { d: 'M80 104q-30-20-26-56q20 12 26 56zM80 104q30-20 26-56q-20 12-26 56z' }, 'pink'),
    s('path', { d: 'M80 104q-18-36 0-74q18 38 0 74z' }, 'pink', { accent: true }),
    s('path', { d: 'M80 104q-50 0-56-30q30-4 56 30zM80 104q50 0 56-30q-30-4-56 30z' }, 'red'),
    s('path', { d: 'M80 98v-46', ...SW(2) }, 'white', { stroke: true })
  ],
  macabro: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('circle', { cx: 116, cy: 40, r: 16 }, 'cream'),
    s('rect', { x: 14, y: 124, width: 132, height: 22, rx: 10 }, 'dark'),
    s('path', { d: 'M28 126V96a16 16 0 0 1 32 0v30zM72 126V86a18 18 0 0 1 36 0v40z' }, 'gray', { accent: true }),
    s('path', { d: 'M90 92v20M82 100h16', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M36 40q6-8 12 0q6-8 12 0l-6 6-6-4-6 4z' }, 'black'),
    s('path', { d: 'M124 126v-34M124 104l12-12M124 112l-10-8', ...SW(4) }, 'black', { stroke: true })
  ],
  matricular: [
    s('path', { d: 'M18 64l38-28 38 28z' }, 'red'),
    s('rect', { x: 24, y: 64, width: 64, height: 72 }, 'cream'),
    s('path', { d: rects([[32, 74, 14, 14], [66, 74, 14, 14]]) + 'M46 136v-28h20v28z' }, 'sky'),
    s('path', { d: 'M24 64h64v72H24z', ...SW(2) }, 'gray', { stroke: true }),
    ...paper(96, 66, 48, 64),
    s('path', { d: 'M104 82l5 5 8-10M122 84h14M104 104l5 5 8-10M122 106h14', ...SW(3) }, 'green', { stroke: true, accent: true })
  ],
  merma: [
    s('path', { d: 'M40 120q-10-50 20-70l-8-14h56l-8 14q30 20 20 70q-40 14-80 0z' }, 'tan', { accent: true }),
    s('path', { d: 'M52 36h56', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: ells([[110, 102, 4, 6]]) }, 'dark'),
    s('path', { d: dots([[116, 112], [122, 122], [118, 132], [128, 136], [112, 138]], 3) }, 'yellow'),
    arrow('M20 40v60M12 90l8 10 8-10', 'red', 5)
  ],
  mezquino: [
    ground(),
    ...person(64, 136, 'gray', { h: 50 }),
    s('path', { d: 'M56 70h6M68 70h6M58 80q6-4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 136q-18-6-12-34q6-16 22-16t22 16q6 28-12 34z' }, 'brown', { accent: true }),
    s('path', { d: 'M88 88l-4-10h24l-4 10z' }, 'brown'),
    s('path', { d: 'M76 104q20 10 40 0', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: dots([[96, 122]], 7) }, 'yellow')
  ],
  milano: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M80 70q-30-10-62 6q30 2 46 14zM80 70q30-10 62 6q-30 2-46 14z' }, 'brown', { accent: true }),
    s('path', { d: 'M72 64q8-10 16 0l-2 40-6-4-6 4z' }, 'brown'),
    s('path', { d: 'M74 100l-10 26 16-12 16 12-10-26z' }, 'orange'),
    s('circle', { cx: 80, cy: 60, r: 7 }, 'tan'),
    s('path', { d: 'M78 52l2-6 2 6z' }, 'yellow'),
    s('path', { d: ells([[40, 34, 16, 6], [126, 120, 12, 5]]) }, 'white')
  ],
  minucioso: [
    ...gear(70, 104, 12, 8, 'gray'),
    s('circle', { cx: 70, cy: 104, r: 4 }, 'dark'),
    s('path', { d: 'M76 98L128 22M86 98L132 26', ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: dots([[110, 122], [118, 130], [100, 132], [36, 124]], 4) }, 'orange'),
    s('path', { d: 'M24 138h112', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: ring(40, 60, 18), ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M27 73L14 86', ...SW(6) }, 'dark', { stroke: true })
  ],
  moderar: [
    s('rect', { x: 18, y: 22, width: 124, height: 116, rx: 10 }, 'dark'),
    s('path', { d: 'M46 36v88M80 36v88M114 36v88', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 34, y: 92, width: 24, height: 14, rx: 3 }, 'white'),
    s('rect', { x: 68, y: 74, width: 24, height: 14, rx: 3 }, 'orange', { accent: true }),
    s('rect', { x: 102, y: 54, width: 24, height: 14, rx: 3 }, 'white'),
    s('path', { d: 'M80 62v-14M74 54l6-6 6 6M80 100v14M74 108l6 6 6-6', ...SW(3) }, 'yellow', { stroke: true })
  ],
  mujeriego: [
    ground(),
    ...person(44, 136, 'navy', { h: 50, accent: true }),
    s('path', { d: 'M36 66h6M48 64q4-4 8 0', ...SW(3) }, 'dark', { stroke: true }),
    ...lady(100, 136, 'pink'),
    ...lady(130, 136, 'purple'),
    s('path', { d: heart(70, 30, 8) + heart(90, 44, 6) + heart(56, 16, 5) }, 'red')
  ],
  murga: [
    ground(),
    ...person(46, 136, 'purple', { h: 48 }),
    s('path', { d: 'M32 52l14-20 14 20z' }, 'yellow'),
    s('path', { d: ells([[46, 112, 20, 10]]) + 'M26 112v14h40v-14' }, 'red', { accent: true }),
    ...person(112, 136, 'green', { h: 48 }),
    s('path', { d: 'M98 52l14-20 14 20z' }, 'orange'),
    s('path', { d: 'M118 68l14-4 8-10v24l-8-6z' }, 'yellow'),
    s('path', { d: 'M74 34q6-8 0-16M80 52q6-8 0-16', ...SW(3) }, 'blue', { stroke: true })
  ],
  nupcial: [
    s('path', { d: ring(62, 90, 30), ...SW(9) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: ring(98, 90, 30), ...SW(9) }, 'orange', { stroke: true }),
    s('path', { d: 'M94 54l4-10 4 10-4 6z' }, 'sky'),
    s('path', { d: heart(80, 28, 10) }, 'red'),
    s('path', { d: sparkle(30, 40, 8) + sparkle(130, 132, 7) }, 'yellow')
  ],
  'néctar': [
    s('path', { d: 'M80 136V82', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: dots(around(80, 76, 18, 6), 13) }, 'pink'),
    s('circle', { cx: 80, cy: 76, r: 12 }, 'orange', { accent: true }),
    s('path', { d: drop(80, 112, 6) }, 'yellow'),
    s('path', { d: ells([[118, 36, 16, 10]]) }, 'yellow'),
    s('path', { d: 'M110 28v16M120 28v16', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[112, 22, 7, 10], [126, 22, 7, 10]]) }, 'sky'),
    s('path', { d: 'M102 40L92 62', ...DASH(2, '3 4') }, 'gray', { stroke: true })
  ],
  obrar: [
    ground(),
    ...person(48, 136, 'orange', { h: 48 }),
    s('path', { d: 'M56 52h-18q0-14 10-14t10 14z' }, 'yellow'),
    s('path', { d: 'M60 102l24-24', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M82 82l18-26', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 92, y: 46, width: 24, height: 12, rx: 2, transform: 'rotate(-55 104 52)' }, 'gray', { accent: true }),
    s('rect', { x: 86, y: 116, width: 56, height: 20, rx: 2 }, 'tan'),
    s('path', { d: 'M114 116v-14M104 92l-4-6M122 90l6-4', ...SW(3) }, 'dark', { stroke: true })
  ],
  obsceno: [
    ...face(80, 80, 54, 'yellow', 'flat'),
    s('path', { d: ells([[50, 94, 12, 7], [110, 94, 12, 7]]) }, 'pink'),
    s('path', { d: 'M38 74q16-28 38-8v14H38zM122 74q-16-28-38-8v14h38z' }, 'skin', { accent: true }),
    s('path', { d: 'M46 60v12M56 56v14M104 56v14M114 60v12', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M16 28l20 10M144 28l-20 10', ...SW(4) }, 'red', { stroke: true })
  ],
  odio: [
    ...face(80, 86, 54, 'red', 'frown', { accent: true }),
    s('path', { d: 'M44 64l26 10M116 64l-26 10', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 38q-6-10 2-20M130 38q6-10-2-20M80 24q-6-8 2-14', ...SW(5) }, 'gray', { stroke: true })
  ],
  oval: [
    s('ellipse', { cx: 80, cy: 80, rx: 62, ry: 42 }, 'green', { accent: true }),
    s('path', { d: 'M18 80h124M80 38v84', ...DASH(3) }, 'white', { stroke: true }),
    s('path', { d: dots([[80, 80]], 5) }, 'white'),
    s('path', { d: 'M18 140h124M18 134v12M142 134v12', ...SW(3) }, 'gray', { stroke: true })
  ],
  panista: [
    ground(),
    ...person(54, 136, 'blue', { h: 50, accent: true }),
    s('path', { d: 'M68 92l20-34', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M88 140V18', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M90 20h48v34H90z' }, 'blue'),
    s('path', { d: dots([[114, 37]], 11) }, 'white'),
    s('rect', { x: 110, y: 104, width: 32, height: 32, rx: 3 }, 'gray'),
    s('path', { d: 'M118 104h16', ...SW(4) }, 'dark', { stroke: true })
  ],
  'penalización': [
    ground(),
    ...person(64, 136, 'black', { h: 50 }),
    s('path', { d: 'M78 92l20-44', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 92, y: 18, width: 26, height: 36, rx: 3, transform: 'rotate(12 105 36)' }, 'yellow', { accent: true }),
    s('path', { d: 'M50 84h28', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M124 26l12-6M128 42h14', ...SW(4) }, 'gray', { stroke: true })
  ],
  perdiz: [
    ground(),
    s('path', { d: ells([[76, 96, 46, 30]]) }, 'brown', { accent: true }),
    s('path', { d: 'M32 90l-16-12 6 22z' }, 'brown'),
    s('circle', { cx: 116, cy: 66, r: 16 }, 'tan'),
    s('path', { d: 'M130 64l12 4-12 4z' }, 'orange'),
    s('path', { d: dots([[118, 62]], 3) }, 'dark'),
    s('path', { d: 'M52 96q20-10 40 0M50 108q22-10 44 0', ...SW(3) }, 'cream', { stroke: true }),
    s('path', { d: 'M66 126v10M86 126v10', ...SW(4) }, 'orange', { stroke: true })
  ],
  pinchar: [
    s('path', { d: 'M62 108q-30-24-30-50a30 30 0 0 1 60 0q0 26-30 50z' }, 'red', { accent: true }),
    s('path', { d: 'M62 108l-6 8h12z' }, 'red'),
    s('path', { d: 'M62 116q-8 12 0 26', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M92 52l46-12', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 140, cy: 40, r: 6 }, 'blue'),
    s('path', { d: 'M100 30l-6-10M104 66l8 8M86 30l2-12', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M46 44q4-10 12-12', ...SW(4) }, 'white', { stroke: true })
  ],
  piramidal: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('rect', { x: 14, y: 118, width: 132, height: 28, rx: 10 }, 'tan'),
    s('path', { d: 'M80 30l-56 92h56z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 30l56 92H80z' }, 'orange'),
    s('path', { d: 'M52 76h28M38 100h42', ...SW(2) }, 'orange', { stroke: true }),
    s('circle', { cx: 124, cy: 36, r: 10 }, 'white')
  ],
  'premiación': [
    s('path', { d: rects([[60, 92, 40, 46], [20, 108, 40, 30], [100, 116, 40, 22]]) }, 'gray'),
    ...person(80, 92, 'yellow', { h: 32, w: 24, r: 10, accent: true }),
    ...person(40, 108, 'blue', { h: 30, w: 22, r: 10 }),
    ...person(120, 116, 'orange', { h: 28, w: 22, r: 10 }),
    s('path', { d: 'M68 18h24v10a12 12 0 0 1-24 0zM76 40h8v4h-8z' }, 'yellow'),
    s('path', { d: sparkle(48, 40, 7) + sparkle(112, 36, 7) }, 'yellow')
  ],
  privatizar: [
    s('path', { d: 'M18 136V70l26 16V70l26 16V40h20v96z' }, 'gray'),
    s('path', { d: 'M74 30h12v12H74z' }, 'gray'),
    s('rect', { x: 30, y: 100, width: 12, height: 12 }, 'sky'),
    s('path', { d: ring(118, 62, 14), ...SW(7) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M118 76v54M118 104h12M118 118h10', ...SW(7) }, 'yellow', { stroke: true }),
    ground()
  ],
  proteccionismo: [
    ground(),
    s('path', { d: 'M90 136V80l14-10 14 10 14-10v66z' }, 'gray'),
    s('path', { d: 'M74 30q16 8 30 0v44q0 24-30 36q-30-12-30-36V30q14 8 30 0z' }, 'blue', { accent: true }),
    s('rect', { x: 14, y: 70, width: 26, height: 22, rx: 2 }, 'brown'),
    s('path', { d: 'M18 106q20 16 30-4', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M42 98l6 4 2-8', ...SW(4) }, 'red', { stroke: true })
  ],
  'prócer': [
    s('rect', { x: 44, y: 102, width: 72, height: 38, rx: 3 }, 'gray'),
    s('rect', { x: 36, y: 132, width: 88, height: 10, rx: 3 }, 'dark'),
    s('path', { d: 'M62 102l4-54h28l4 54z' }, 'tan', { accent: true }),
    s('circle', { cx: 80, cy: 38, r: 12 }, 'tan'),
    s('path', { d: 'M92 56l16-36', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: laurel(80, 120, 14, 8, 3) }, 'green'),
    s('path', { d: sparkle(34, 34, 8) }, 'yellow')
  ],
  pucha: [
    ...face(56, 54, 34, 'yellow', 'frown', { accent: true }),
    s('path', { d: 'M28 24l20 10', ...SW(8) }, 'skin', { stroke: true }),
    ground(),
    s('path', { d: ells([[114, 128, 22, 8]]) + 'M102 116a14 14 0 0 1 26 4z' }, 'pink'),
    s('path', { d: 'M118 104l18-22 8 8z' }, 'tan'),
    s('path', { d: drop(78, 66, 4) }, 'blue')
  ],
  quimera: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'purple'),
    s('path', { d: ells([[80, 112, 52, 14], [56, 104, 22, 12], [104, 104, 22, 12]]) }, 'white'),
    s('path', { d: 'M48 100V58l8-10 8 10v42zM96 100V58l8-10 8 10v42z' }, 'pink'),
    s('path', { d: 'M62 100V66h36v34z' }, 'pink', { accent: true }),
    s('path', { d: 'M74 100V86a6 6 0 0 1 12 0v14z' }, 'purple'),
    s('path', { d: 'M80 66V42l12 6-12 6', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: sparkle(30, 34, 8) + sparkle(130, 40, 6) + sparkle(126, 128, 5) }, 'yellow')
  ],
  racimo: [
    s('path', { d: 'M80 34q2-14 12-18', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(84, 30, -10, 46, 16) }, 'green'),
    s('path', { d: dots([[62, 48], [80, 46], [98, 48], [54, 66], [72, 66], [90, 66], [108, 66], [62, 84], [80, 84], [98, 84], [70, 102], [90, 102], [80, 120]], 10) }, 'purple', { accent: true }),
    s('path', { d: dots([[58, 44], [76, 62], [94, 80], [76, 98]], 3) }, 'pink')
  ],
  recobrar: [
    s('path', { d: heart(80, 92, 40) }, 'red', { accent: true }),
    s('rect', { x: 54, y: 66, width: 52, height: 18, rx: 6, transform: 'rotate(-30 80 75)' }, 'tan'),
    s('path', { d: dots([[72, 78], [80, 74], [88, 70]], 2) }, 'brown'),
    arrow('M134 128V82M124 92l10-10 10 10', 'green', 6),
    s('path', { d: sparkle(28, 32, 8) }, 'yellow')
  ],
  'reconversión': [
    s('path', { d: 'M40 106V72l16 10V72l16 10V56h14v50z' }, 'gray'),
    s('path', { d: 'M100 106V70h22v36z' }, 'mint'),
    s('path', { d: 'M104 66l7-18 7 18z' }, 'green', { accent: true }),
    s('path', { d: 'M24 82a56 56 0 0 1 100-36M136 82a56 56 0 0 1-100 36', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M112 38l12 8-2 14M48 128l-12-10 2-14', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M28 106h104', ...SW(4) }, 'dark', { stroke: true })
  ],
  remolacha: [
    s('path', { d: leaflet(80, 64, -110, 48, 14) + leaflet(80, 64, -70, 48, 14) + leaflet(80, 64, -90, 40, 10) }, 'green'),
    s('path', { d: 'M80 64v-30M80 64l-16-40M80 64l16-40', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M80 140q-6-12-20-16q-26-12-20-40q8-24 40-24t40 24q6 28-20 40q-14 4-20 16z' }, 'purple', { accent: true }),
    s('path', { d: 'M58 88q8-8 18-8', ...SW(4) }, 'pink', { stroke: true })
  ],
  reojo: [
    ...face(64, 80, 50, 'skin', 'flat'),
    s('path', { d: ells([[50, 72, 13, 9], [84, 72, 13, 9]]) }, 'white', { accent: true }),
    s('path', { d: dots([[58, 72], [92, 72]], 6) }, 'dark'),
    s('path', { d: 'M38 58l24 2M72 58l24 2', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 70l44-6', ...DASH(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M48 104h28', ...SW(4) }, 'dark', { stroke: true })
  ],
  rupia: [
    s('rect', { x: 16, y: 34, width: 112, height: 60, rx: 4, transform: 'rotate(-8 72 64)' }, 'orange', { accent: true }),
    s('path', { d: ring(72, 64, 16), ...SW(4), transform: 'rotate(-8 72 64)' }, 'white', { stroke: true }),
    s('path', { d: dots([[72, 64]], 6) }, 'white'),
    s('path', { d: ells([[108, 124, 28, 10], [108, 112, 28, 10], [108, 100, 28, 10]]) }, 'gray'),
    s('path', { d: ells([[108, 100, 20, 6]]) }, 'yellow')
  ],
  sabotear: [
    ...gear(54, 82, 26, 10, 'gray'),
    ...gear(108, 82, 22, 9, 'blue'),
    s('path', { d: 'M76 30l12 80', ...SW(9) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M68 22a10 10 0 1 1 18-4z' }, 'red'),
    s('path', { d: burst(82, 110, 16, 7, 8) }, 'yellow')
  ],
  sobrevivencia: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'blue'),
    s('path', { d: ells([[80, 120, 48, 14]]) }, 'tan'),
    s('path', { d: 'M100 116q-4-40 10-62', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(110, 54, -160, 30, 7) + leaflet(110, 54, -20, 30, 7) + leaflet(110, 54, 150, 26, 6) + leaflet(110, 54, 30, 26, 6) }, 'green'),
    ...person(66, 114, 'orange', { h: 30, w: 22, r: 10, accent: true }),
    s('path', { d: 'M54 92l-14-20', ...SW(5) }, 'skin', { stroke: true })
  ],
  sorbo: [
    s('path', { d: HEAD }, 'skin'),
    s('path', { d: 'M110 92h34l-4 34h-26z' }, 'red', { accent: true }),
    s('path', { d: 'M144 100q10 0 6 14', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M120 84q-6-10 0-18M134 84q-6-10 0-18', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[100, 62]], 4) }, 'dark')
  ],
  sota: [
    s('rect', { x: 34, y: 16, width: 92, height: 128, rx: 8 }, 'white'),
    s('rect', { x: 34, y: 16, width: 92, height: 128, rx: 8, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 128l6-56h24l6 56z' }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 58, r: 12 }, 'skin'),
    s('path', { d: 'M66 50q14-16 28 0z' }, 'red'),
    s('path', { d: 'M104 128V48', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M90 90l14-6', ...SW(5) }, 'skin', { stroke: true })
  ],
  sulfato: [
    s('path', { d: 'M80 80L80 30M80 80L36 108M80 80L124 108M80 80L104 60', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 20 }, 'yellow', { accent: true }),
    s('path', { d: dots([[80, 30], [36, 108], [124, 108], [108, 56]], 14) }, 'red'),
    s('path', { d: 'M24 140l8-14h16l8 14z' }, 'blue')
  ],
  sutilmente: [
    s('path', { d: ells([[80, 120, 56, 10]]) }, 'sky'),
    s('path', { d: 'M56 120q24 8 48 0M40 124q40 14 80 0', ...SW(2) }, 'blue', { stroke: true }),
    s('path', { d: 'M80 116q-30-30 10-90q24 40-10 90z' }, 'white', { accent: true }),
    s('path', { d: 'M80 116q-30-30 10-90q24 40-10 90zM80 116q4-50 10-90', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: sparkle(122, 40, 7) }, 'yellow')
  ],
  torcer: [
    s('path', { d: 'M20 70l20 0 10 20-10 0zM50 70h16l10 20H60zM76 70h16l10 20H86zM102 70h16l10 20h-16z' }, 'sky', { accent: true }),
    s('path', { d: 'M40 70l10 20M66 70l10 20M92 70l10 20M118 70l10 20', ...SW(4) }, 'blue', { stroke: true }),
    s('rect', { x: 8, y: 66, width: 16, height: 28, rx: 6 }, 'skin'),
    s('rect', { x: 128, y: 66, width: 16, height: 28, rx: 6 }, 'skin'),
    arrow('M10 54q6-14 20-8M24 60l6-14-14-2M150 106q-6 14-20 8M136 100l-6 14 14 2', 'orange', 4),
    s('path', { d: drop(66, 110, 4) + drop(96, 118, 4) }, 'blue')
  ],
  toscano: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 100q40-30 80-8t52-6v60H14z' }, 'green'),
    s('path', { d: 'M14 118q60-20 132 0v28H14z' }, 'yellow'),
    s('path', { d: ells([[40, 76, 6, 22], [56, 82, 5, 18]]) }, 'dark'),
    s('rect', { x: 98, y: 74, width: 30, height: 20 }, 'cream', { accent: true }),
    s('path', { d: 'M94 76l19-12 19 12z' }, 'orange')
  ],
  tuerca: [
    s('path', { d: 'M80 24l48 28v56l-48 28-48-28V52z' }, 'gray', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 24 }, 'white'),
    s('path', { d: ring(80, 80, 24) + ring(80, 80, 18), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 24l48 28v56l-48 28-48-28V52z', ...SW(3) }, 'dark', { stroke: true })
  ],
  venidero: [
    s('rect', { x: 22, y: 34, width: 70, height: 80, rx: 6 }, 'white'),
    s('rect', { x: 22, y: 34, width: 70, height: 80, rx: 6, ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 22, y: 34, width: 70, height: 18, rx: 6 }, 'gray'),
    s('rect', { x: 64, y: 22, width: 76, height: 86, rx: 6 }, 'blue', { accent: true }),
    s('rect', { x: 64, y: 22, width: 76, height: 20, rx: 6 }, 'navy'),
    s('path', { d: star(102, 76, 16) }, 'yellow'),
    arrow('M30 134h100M118 124l12 10-12 10', 'orange', 5)
  ],
  zaga: [
    s('path', { d: 'M18 136V40h124v96', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M18 40h124v96H18z', ...DASH(2, '3 6') }, 'gray', { stroke: true }),
    s('path', { d: 'M18 136V40h124v96', ...SW(3) }, 'gray', { stroke: true }),
    ...person(80, 136, 'blue', { h: 46, accent: true }),
    s('path', { d: 'M64 94l-24-14M96 94l24-14', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 130, cy: 128, r: 10 }, 'dark')
  ],
  abanderado: [
    ground(),
    ...person(56, 136, 'navy', { h: 50 }),
    s('path', { d: 'M76 136V18', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M78 20q20-8 32 0t32 0v36q-16 8-32 0t-32 0z' }, 'red', { accent: true }),
    s('path', { d: 'M64 96l12-6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: star(110, 38, 8) }, 'yellow')
  ],
  abruptamente: [
    s('path', { d: 'M14 70h70v76H14z' }, 'brown'),
    s('path', { d: 'M14 70h70', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M20 56h64v-2', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M84 54l8 0v80', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M82 124l10 12 10-12', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: burst(92, 54, 16, 6, 8) }, 'yellow')
  ],
  agravante: [
    ground(),
    s('path', { d: 'M40 136q-20-8-14-26q4 10 10 8q-6-14 6-26q2 14 10 18q10 16-12 26z' }, 'orange'),
    arrow('M64 106h20M76 98l8 8-8 8', 'gray', 4),
    s('path', { d: 'M118 136q-36-10-26-50q8 18 16 14q-12-28 12-54q4 30 18 40q18 30-20 50z' }, 'red', { accent: true }),
    s('path', { d: 'M118 132q-14-6-8-22q8 8 14 0q6 14-6 22z' }, 'yellow')
  ],
  albornoz: [
    s('path', { d: 'M80 18v8', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 30q18-14 36 0l16 16 18 28-14 8-10-14v74H56V68l-10 14-14-8 18-28z' }, 'sky', { accent: true }),
    s('path', { d: 'M66 32l14 46 14-46', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M56 96h48M70 96l-6 24M88 96l6 24', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M62 112h12v12H62zM86 112h12v12H86z' }, 'blue')
  ],
  'almidón': [
    s('path', { d: ells([[48, 66, 32, 22]]) }, 'brown'),
    s('path', { d: dots([[38, 60], [56, 72], [52, 54]], 2.5) }, 'dark'),
    s('path', { d: 'M74 106h70q-4 32-35 32t-35-32z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 106q30-40 58 0z' }, 'white'),
    s('path', { d: 'M80 106q30-40 58 0', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 120h44', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: ells([[34, 120, 14, 8]]) }, 'gray')
  ],
  'aluvión': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 70l30-36 30 30 30-30 42 50v62H14z' }, 'green'),
    s('path', { d: 'M74 64q10 30 0 40q-30 20-60 26v16h132v-28q-60 0-72-14t0-40z' }, 'brown', { accent: true }),
    s('path', { d: dots([[40, 132], [70, 124], [104, 134], [126, 126]], 5) }, 'gray'),
    s('path', { d: 'M60 116q10-4 20 0M96 120q10-4 20 0', ...SW(3) }, 'tan', { stroke: true })
  ],
  ameritar: [
    ground(),
    ...person(80, 136, 'navy', { h: 56 }),
    s('path', { d: 'M74 80l6 14 6-14z' }, 'red'),
    s('circle', { cx: 80, cy: 106, r: 12 }, 'yellow', { accent: true }),
    s('path', { d: star(80, 106, 7) }, 'orange'),
    s('path', { d: sparkle(34, 40, 10) + sparkle(126, 46, 8) + sparkle(120, 98, 6) }, 'yellow')
  ],
};
