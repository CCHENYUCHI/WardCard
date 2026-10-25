// Illustration specs for words still undrawn in batches 0063–0064 (see server/scripts/lexicon/art.js)
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
  devoto: [
    ground(),
    ...person(64, 136, 'purple', { accent: true }),
    s('path', { d: 'M74 102l12-10', ...SW(8) }, 'purple', { stroke: true }),
    s('path', { d: 'M90 64l7 30h-14z' }, 'skin'),
    s('rect', { x: 112, y: 96, width: 14, height: 40, rx: 2 }, 'cream'),
    outline({ x: 112, y: 96, width: 14, height: 40, rx: 2 }, 'tan', 2),
    s('path', { d: drop(119, 82, 6) }, 'orange')
  ],
  distraer: [
    ground(),
    ...person(54, 136, 'blue'),
    s('rect', { x: 58, y: 96, width: 34, height: 22, rx: 3 }, 'red'),
    s('path', { d: 'M66 72q20-24 40-18', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[112, 44, 12, 9], [126, 44, 12, 9], [113, 60, 8, 6], [125, 60, 8, 6]]) }, 'purple', { accent: true }),
    s('path', { d: 'M119 38v28', ...SW(4) }, 'dark', { stroke: true })
  ],
  educacional: [
    ...openBook(80, 76),
    s('path', { d: 'M56 36v16q24 12 48 0V36z' }, 'navy'),
    s('path', { d: 'M80 14l52 18-52 18-52-18z' }, 'navy', { accent: true }),
    s('path', { d: 'M126 32v24', ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 126, cy: 58, r: 5 }, 'yellow')
  ],
  embarque: [
    s('rect', { x: 14, y: 14, width: 132, height: 122, rx: 12 }, 'sky'),
    s('path', { d: 'M128 52l8-22h10l-4 22z' }, 'blue'),
    s('path', { d: 'M64 50h70q12 0 12 13t-12 13H64q-14 0-14-13t14-13z' }, 'white'),
    s('path', { d: dots([[100, 60], [112, 60], [124, 60]], 3) }, 'blue'),
    s('rect', { x: 70, y: 54, width: 12, height: 22, rx: 2 }, 'navy'),
    s('path', { d: 'M70 76L36 136h24l30-60z' }, 'gray'),
    s('circle', { cx: 54, cy: 88, r: 7 }, 'skin'),
    s('rect', { x: 47, y: 96, width: 14, height: 22, rx: 5 }, 'orange', { accent: true }),
    ground()
  ],
  entrante: [
    ground(),
    s('rect', { x: 92, y: 30, width: 46, height: 106 }, 'brown'),
    s('rect', { x: 98, y: 36, width: 34, height: 100 }, 'dark'),
    s('path', { d: 'M98 36l-14 8v86l14 6z' }, 'tan'),
    ...lean(46, 136, 10, 'green', { accent: true }),
    arrow('M60 52h20m-8-8 8 8-8 8')
  ],
  estigma: [
    ground(),
    ...person(80, 136, 'gray'),
    s('path', { d: burst(80, 112, 11, 5, 8) }, 'red', { accent: true }),
    s('path', { d: 'M20 60l32 24M52 84H38M52 84l-6-12M140 60l-32 24M108 84h14M108 84l6-12', ...SW(5) }, 'dark', { stroke: true })
  ],
  exceptuar: [
    s('path', { d: ring(58, 92, 42), ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: busts([42, 74], 114, 24, 26) }, 'blue'),
    s('path', { d: dots([[42, 78], [74, 78]], 10) }, 'skin'),
    s('path', { d: busts([126], 136, 24, 26) }, 'red', { accent: true }),
    s('circle', { cx: 126, cy: 100, r: 10 }, 'skin'),
    arrow('M96 54l20 12m-10 2 10-2-4-10', 'gray', 4)
  ],
  frutal: [
    ground(),
    s('path', { d: 'M72 136V92h16v44z' }, 'brown'),
    s('path', { d: ells([[80, 64, 56, 42]]) }, 'green'),
    s('path', { d: dots([[54, 52], [110, 60], [66, 82]], 9) }, 'red', { accent: true }),
    s('path', { d: dots([[84, 40], [40, 72]], 9) }, 'yellow'),
    s('path', { d: dots([[98, 84], [120, 78], [70, 50]], 7) }, 'purple')
  ],
  'fundición': [
    s('path', { d: 'M26 26h44l-6 38H32z', transform: 'rotate(34 48 46)' }, 'gray'),
    s('path', { d: 'M18 34l22-18', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M68 64q12 18 12 46', ...SW(9) }, 'orange', { stroke: true, accent: true }),
    s('rect', { x: 46, y: 108, width: 72, height: 28, rx: 3 }, 'dark'),
    s('rect', { x: 54, y: 108, width: 56, height: 8 }, 'orange'),
    s('path', { d: sparkle(104, 90, 8) + sparkle(120, 74, 6) + sparkle(56, 94, 5) }, 'yellow')
  ],
  galardonar: [
    ground(),
    s('rect', { x: 50, y: 108, width: 60, height: 28, rx: 3 }, 'tan'),
    ...person(80, 108, 'blue'),
    s('path', { d: 'M72 64l8 16 8-16', ...SW(4) }, 'red', { stroke: true }),
    s('circle', { cx: 80, cy: 86, r: 8 }, 'yellow', { accent: true }),
    s('path', { d: star(32, 50, 12) + star(128, 50, 12) + star(40, 92, 7) + star(120, 92, 7) }, 'yellow')
  ],
  glucosa: [
    s('path', { d: drop(46, 94, 24) }, 'red', { accent: true }),
    s('path', { d: poly(around(110, 54, 26, 6, 30)), ...SW(5) }, 'purple', { stroke: true }),
    s('path', { d: dots(around(110, 54, 26, 6, 30), 5) }, 'purple'),
    s('rect', { x: 84, y: 100, width: 26, height: 26, rx: 3 }, 'white'),
    outline({ x: 84, y: 100, width: 26, height: 26, rx: 3 }),
    s('rect', { x: 114, y: 110, width: 22, height: 22, rx: 3 }, 'white'),
    outline({ x: 114, y: 110, width: 22, height: 22, rx: 3 })
  ],
  grosor: [
    s('path', { d: 'M32 64l16-16h92l-16 16z' }, 'cream'),
    s('path', { d: 'M124 64l16-16v44l-16 16z' }, 'brown'),
    s('rect', { x: 32, y: 64, width: 92, height: 44 }, 'tan', { accent: true }),
    s('path', { d: 'M32 64l16-16h92v44l-16 16H32z', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M18 66v40M12 72l6-6 6 6M12 100l6 6 6-6', ...SW(4) }, 'red', { stroke: true })
  ],
  halo: [
    s('ellipse', { cx: 80, cy: 34, rx: 42, ry: 16 }, 'cream'),
    s('path', { d: 'M40 146q0-26 40-26t40 26z' }, 'sky'),
    ...face(80, 86, 30, 'skin'),
    s('ellipse', { cx: 80, cy: 34, rx: 30, ry: 8, ...SW(7) }, 'yellow', { stroke: true, accent: true })
  ],
  hepatitis: [
    s('path', { d: burst(80, 84, 66, 50, 14) }, 'pink'),
    s('path', { d: 'M26 72q8-28 58-28q52 0 54 18q2 18-30 34q-30 16-56 28q-24 2-28-20q-2-16 2-32z' }, 'brown', { accent: true }),
    s('path', { d: 'M84 46q-6 30 2 66', ...SW(3) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 86, cy: 104, rx: 7, ry: 10 }, 'green')
  ],
  heroico: [
    ground(),
    s('path', { d: 'M68 94L32 132h48z' }, 'red'),
    ...person(80, 136, 'blue', { accent: true }),
    s('path', { d: 'M90 98l20-40', ...SW(9) }, 'blue', { stroke: true }),
    s('circle', { cx: 112, cy: 52, r: 7 }, 'skin'),
    s('path', { d: star(80, 110, 10) }, 'yellow')
  ],
  imparable: [
    ground(),
    s('path', { d: rects([[114, 30, 30, 20], [114, 112, 30, 24]]) }, 'brown'),
    s('path', { d: 'M110 62l14-6 4 12-14 6zM132 80l12 4-4 12-12-4zM112 96l10 2-2 10-10-2z' }, 'brown'),
    s('path', { d: 'M18 76h26M12 94h30M18 112h26', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 78, cy: 104, r: 32 }, 'orange', { accent: true }),
    s('path', { d: 'M62 88q16-10 32 4', ...SW(4) }, 'yellow', { stroke: true })
  ],
  inciso: [
    ...paper(28, 22, 104, 116),
    s('path', { d: 'M40 42h80M40 60h80M40 100h80M40 118h56', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 58, y: 74, width: 52, height: 12, rx: 6 }, 'blue', { accent: true }),
    s('path', { d: 'M76 98l8-8 8 8', ...SW(4) }, 'red', { stroke: true })
  ],
  indefinidamente: [
    s('rect', { x: 14, y: 14, width: 132, height: 60, rx: 0 }, 'sky'),
    s('rect', { x: 14, y: 74, width: 132, height: 62 }, 'green'),
    s('path', { d: 'M76 74h8l58 62H18z' }, 'dark'),
    s('path', { d: 'M80 80v52', ...DASH(4, '8 8') }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 40, r: 18 }, 'white', { accent: true }),
    s('path', { d: ring(80, 40, 18) + 'M80 40v-11M80 40l8 5', ...SW(3) }, 'dark', { stroke: true })
  ],
  interactivo: [
    s('rect', { x: 24, y: 18, width: 112, height: 88, rx: 10 }, 'dark'),
    s('rect', { x: 32, y: 26, width: 96, height: 72, rx: 4 }, 'sky'),
    s('path', { d: rects([[40, 34, 24, 18], [100, 34, 20, 18], [40, 74, 24, 16]]) }, 'blue', { accent: true }),
    s('path', { d: ring(92, 66, 9) + ring(92, 66, 17), ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M86 70q0-6 6-6t6 6v24l14-4q8 0 6 10l-8 30H82l-12-26q-2-8 6-6l10 6z' }, 'skin')
  ],
  irreversible: [
    arrow('M22 52h104m-16-16 16 16-16 16', 'green', 8),
    s('path', { d: 'M126 108H34m16-16-16 16 16 16', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: ring(80, 108, 26) + 'M62 90l36 36', ...SW(7) }, 'red', { stroke: true, accent: true })
  ],
  latente: [
    s('rect', { x: 14, y: 14, width: 132, height: 64 }, 'sky'),
    s('circle', { cx: 120, cy: 38, r: 12 }, 'yellow'),
    s('rect', { x: 14, y: 72, width: 132, height: 10 }, 'green'),
    s('rect', { x: 14, y: 82, width: 132, height: 54 }, 'brown'),
    s('ellipse', { cx: 80, cy: 114, rx: 18, ry: 11 }, 'tan', { accent: true }),
    s('path', { d: 'M70 113q4 3 8 0M84 113q4 3 8 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 102v-12', ...DASH(3, '4 4') }, 'cream', { stroke: true })
  ],
  letrero: [
    s('rect', { x: 14, y: 16, width: 10, height: 120 }, 'gray'),
    s('path', { d: 'M24 32h100M46 32v26M102 32v26', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 30, y: 58, width: 92, height: 54, rx: 8 }, 'green', { accent: true }),
    s('path', { d: 'M46 76h60M46 94h40', ...SW(6) }, 'white', { stroke: true })
  ],
  liar: [
    s('path', { d: rects([[22, 62, 116, 12], [22, 78, 116, 12], [22, 94, 116, 12]]) }, 'brown'),
    s('path', { d: dots([[22, 68], [22, 84], [22, 100]], 6) }, 'tan'),
    s('path', { d: 'M52 56v56M108 56v56', ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M108 56l-14-12v18zM108 56l14-12v18z' }, 'red')
  ],
  llamativo: [
    s('path', { d: burst(80, 82, 60, 42, 14) }, 'yellow'),
    s('path', { d: busts([30, 130], 136, 28, 30) }, 'gray'),
    s('path', { d: dots([[30, 94], [130, 94]], 11) }, 'gray'),
    ...person(80, 136, 'red', { accent: true }),
    s('path', { d: sparkle(50, 30, 9) + sparkle(116, 26, 7) }, 'pink')
  ],
  lujoso: [
    s('path', { d: 'M80 14v22', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 64q56 40 112 0', ...SW(7) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M62 36h36l-6 40H68z' }, 'yellow'),
    s('path', { d: rects([[20, 52, 10, 14], [46, 70, 10, 14], [104, 70, 10, 14], [130, 52, 10, 14]]) }, 'orange'),
    s('path', { d: drop(25, 82, 5) + drop(51, 100, 5) + drop(80, 108, 6) + drop(109, 100, 5) + drop(135, 82, 5) }, 'sky'),
    s('path', { d: 'M25 52v-8M51 70v-8M109 70v-8M135 52v-8', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: sparkle(30, 124, 8) + sparkle(130, 124, 8) + sparkle(80, 136, 6) }, 'yellow')
  ],
  martirio: [
    s('path', { d: ring(80, 82, 44), ...SW(12) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: ring(80, 82, 44), ...SW(4, { 'stroke-dasharray': '10 14' }) }, 'tan', { stroke: true }),
    s('path', { d: rays(80, 82, 48, 62, 16, 10) + rays(80, 82, 26, 38, 16, 21), ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: drop(64, 136, 5) + drop(98, 140, 4) }, 'red')
  ],
  'mejoría': [
    s('rect', { x: 18, y: 96, width: 124, height: 20, rx: 4 }, 'white'),
    outline({ x: 18, y: 96, width: 124, height: 20, rx: 4 }),
    s('path', { d: 'M18 76v60M142 96v40', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 50, y: 70, width: 30, height: 30, rx: 10 }, 'sky'),
    ...face(64, 54, 16, 'skin'),
    s('rect', { x: 76, y: 88, width: 62, height: 14, rx: 6 }, 'mint'),
    arrow('M104 72l20-32m-14 2 14-2 2 14', 'green', 7)
  ],
  'melancolía': [
    s('path', { d: ells([[60, 34, 24, 14], [92, 30, 26, 16], [76, 44, 36, 12]]) }, 'gray'),
    s('path', { d: 'M54 60l-4 10M76 62l-4 10M98 60l-4 10', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M40 146q0-26 40-26t40 26z' }, 'navy'),
    ...face(80, 98, 26, 'skin', 'frown'),
    s('path', { d: drop(66, 108, 4) }, 'sky', { accent: true })
  ],
  mensualmente: [
    s('rect', { x: 34, y: 38, width: 92, height: 84, rx: 8 }, 'white'),
    outline({ x: 34, y: 38, width: 92, height: 84, rx: 8 }),
    s('path', { d: 'M34 58V46a8 8 0 0 1 8-8h76a8 8 0 0 1 8 8v12z' }, 'red', { accent: true }),
    s('path', { d: dots([[50, 74], [68, 74], [86, 74], [104, 74], [50, 92], [68, 92], [86, 92], [104, 92], [50, 108], [68, 108]], 4) }, 'gray'),
    s('circle', { cx: 86, cy: 108, r: 7 }, 'blue'),
    s('path', { d: 'M24 70a58 58 0 0 1 98-44M136 90a58 58 0 0 1-98 44', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M126 14l-2 18-16-6zM34 146l2-18 16 6z' }, 'green')
  ],
  merino: [
    s('rect', { x: 14, y: 14, width: 132, height: 122, rx: 12 }, 'mint'),
    s('path', { d: 'M50 110v24M66 112v22M92 112v22M108 110v24', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[46, 84], [62, 70], [82, 68], [100, 76], [56, 102], [78, 104], [100, 98], [70, 86], [92, 88]], 16) }, 'cream', { accent: true }),
    s('ellipse', { cx: 120, cy: 74, rx: 13, ry: 17 }, 'dark'),
    s('path', { d: 'M112 64a9 9 0 1 1 6 14M128 64a9 9 0 1 0-4 14', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: dots([[116, 78], [124, 78]], 2) }, 'white')
  ],
  narcotraficante: [
    ground(),
    ...person(56, 136, 'dark'),
    s('path', { d: 'M36 66h40M44 66q0-16 12-16t12 16z' }, 'black'),
    s('path', { d: 'M46 76h20', ...SW(5) }, 'black', { stroke: true }),
    s('path', { d: rects([[86, 104, 26, 16], [114, 104, 26, 16], [100, 86, 26, 16]]) }, 'white', { accent: true }),
    s('path', { d: rects([[86, 104, 26, 16], [114, 104, 26, 16], [100, 86, 26, 16]]) + 'M99 104v16M127 104v16M113 86v16', ...SW(3) }, 'tan', { stroke: true })
  ],
  naufragio: [
    s('rect', { x: 14, y: 14, width: 132, height: 122, rx: 12 }, 'sky'),
    s('path', { d: 'M28 66l90 10-10 30H44z', transform: 'rotate(28 80 90)' }, 'brown', { accent: true }),
    s('path', { d: 'M88 68L104 24', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 28l26 20-34 6z' }, 'white'),
    s('path', { d: 'M14 104q16-12 33 0t33 0 33 0 33 0v32H14z' }, 'blue'),
    s('path', { d: 'M24 122q10-8 20 0M70 126q10-8 20 0M112 120q10-8 20 0', ...SW(3) }, 'white', { stroke: true })
  ],
  'panameño': [
    s('path', { d: 'M30 136V22', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 32, y: 26, width: 104, height: 72 }, 'white'),
    outline({ x: 32, y: 26, width: 104, height: 72 }),
    s('rect', { x: 84, y: 26, width: 52, height: 36 }, 'red', { accent: true }),
    s('rect', { x: 32, y: 62, width: 52, height: 36 }, 'blue'),
    s('path', { d: star(58, 44, 11) }, 'blue'),
    s('path', { d: star(110, 80, 11) }, 'red')
  ],
  pecador: [
    ground(),
    ...person(60, 136, 'gray'),
    s('path', { d: 'M54 82q6-4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M110 92a16 16 0 1 0 -2 0z' }, 'red', { accent: true }),
    s('circle', { cx: 120, cy: 82, r: 6 }, 'white'),
    s('path', { d: 'M104 66q2-8 8-10', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M76 104l20-10', ...SW(8) }, 'gray', { stroke: true })
  ],
  'perforación': [
    s('rect', { x: 110, y: 14, width: 36, height: 122 }, 'tan'),
    s('path', { d: dots([[128, 40], [128, 112]], 5) }, 'dark'),
    s('path', { d: 'M90 72h22', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 58h56a8 8 0 0 1 8 8v12a8 8 0 0 1-8 8H30z' }, 'orange', { accent: true }),
    s('path', { d: 'M40 84l-8 36h22l4-34z' }, 'dark'),
    s('path', { d: dots([[100, 92], [106, 100], [96, 104], [104, 110]], 3) }, 'brown')
  ],
  pesimismo: [
    s('path', { d: ells([[78, 30, 26, 12], [104, 28, 22, 12], [90, 40, 36, 10]]) }, 'gray'),
    s('path', { d: 'M48 56h64l-8 80H56z' }, 'white'),
    s('path', { d: 'M54 108h52l-3 28H57z' }, 'sky', { accent: true }),
    s('path', { d: 'M48 56h64l-8 80H56z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 82q14-10 28 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[70, 72], [90, 72]], 3) }, 'dark')
  ],
  pillar: [
    ground(),
    ...person(110, 136, 'orange'),
    s('path', { d: 'M126 66l14-6', ...SW(6) }, 'orange', { stroke: true }),
    ...person(50, 136, 'navy', { accent: true }),
    s('path', { d: 'M38 66h24q0-12-12-12t-12 12z' }, 'navy'),
    s('path', { d: 'M64 102q20-10 34-8', ...SW(8) }, 'navy', { stroke: true }),
    s('circle', { cx: 100, cy: 94, r: 6 }, 'skin')
  ],
  platillo: [
    s('path', { d: 'M54 76L30 136h100L106 76z' }, 'yellow'),
    s('path', { d: 'M54 56q0-22 26-22t26 22z' }, 'sky'),
    s('ellipse', { cx: 80, cy: 62, rx: 56, ry: 16 }, 'gray', { accent: true }),
    s('path', { d: dots([[46, 64], [66, 68], [94, 68], [114, 64]], 4) }, 'yellow'),
    s('path', { d: sparkle(28, 28, 7) + sparkle(134, 34, 6) }, 'navy')
  ],
  pose: [
    ground(),
    s('path', { d: 'M54 80l-12-22q8-8 16 4M80 98l18 10', ...SW(8) }, 'pink', { stroke: true }),
    ...lady(66, 136, 'pink', { accent: true }),
    s('rect', { x: 108, y: 70, width: 34, height: 24, rx: 4 }, 'dark'),
    s('circle', { cx: 125, cy: 82, r: 7 }, 'sky'),
    s('path', { d: burst(120, 52, 14, 6, 8) }, 'yellow')
  ],
  'problemático': [
    ground(),
    ...person(80, 136, 'blue'),
    s('path', { d: 'M92 64q8-4 6-12', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M52 40c10-30 60-30 56 0s-46 14-36-6 40-16 36 6-36 20-44 2', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: drop(66, 74, 3) }, 'sky')
  ],
  'psicópata': [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'white'),
    s('path', { d: 'M80 24a56 56 0 0 1 0 112z' }, 'dark', { accent: true }),
    s('path', { d: ring(80, 80, 56), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: spiral(54, 64), ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 106, cy: 64, r: 6 }, 'red'),
    s('path', { d: 'M48 96q32 26 64 0q-32 12-64 0z' }, 'red')
  ],
  puerco: [
    ground(),
    s('path', { d: 'M48 100v36M64 104v32M98 104v32M112 100v36', ...SW(9) }, 'pink', { stroke: true }),
    s('ellipse', { cx: 80, cy: 90, rx: 46, ry: 30 }, 'pink', { accent: true }),
    s('path', { d: 'M34 86q-10-6-6-14q8 0 4 8', ...SW(3) }, 'pink', { stroke: true }),
    s('path', { d: 'M110 62l6-16 10 14zM128 60l8-14 4 16z' }, 'pink'),
    s('circle', { cx: 122, cy: 80, r: 18 }, 'pink'),
    s('ellipse', { cx: 136, cy: 86, rx: 8, ry: 7 }, 'red'),
    s('path', { d: dots([[134, 86], [139, 86], [120, 74]], 2) }, 'dark')
  ],
  punir: [
    ground(),
    ...person(64, 136, 'gray', { accent: true }),
    s('path', { d: 'M58 82q6-4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M72 132q20 4 40-2', ...SW(4, { 'stroke-dasharray': '5 4' }) }, 'dark', { stroke: true }),
    s('circle', { cx: 120, cy: 122, r: 14 }, 'black'),
    s('path', { d: 'M56 56l-10-6M64 52v-10M72 56l10-6', ...SW(3) }, 'red', { stroke: true })
  ],
  quebrado: [
    s('path', { d: 'M74 30a50 50 0 0 0 0 100l8-18-10-14 12-16-10-16 10-18z' }, 'yellow', { accent: true }),
    s('path', { d: 'M86 30a50 50 0 0 1 0 100l8-18-10-14 12-16-10-16 10-18z', transform: 'translate(14 8)' }, 'yellow'),
    s('path', { d: 'M60 60a26 26 0 0 0 0 40', ...SW(4) }, 'orange', { stroke: true }),
    arrow('M138 20v26m-8-8 8 8 8-8', 'red', 6)
  ],
  rebote: [
    ground(),
    s('path', { d: 'M20 40q20 0 36 96q16-60 40-60', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 132l-8 4M66 132l8 4', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 112, cy: 76, r: 24 }, 'orange', { accent: true }),
    s('path', { d: 'M88 76h48M112 52v48M95 59q12 17 0 34M129 59q-12 17 0 34', ...SW(2) }, 'dark', { stroke: true })
  ],
  recarga: [
    s('rect', { x: 46, y: 16, width: 68, height: 116, rx: 10 }, 'dark'),
    s('rect', { x: 54, y: 28, width: 52, height: 88, rx: 3 }, 'sky'),
    s('rect', { x: 64, y: 44, width: 32, height: 56, rx: 4 }, 'white'),
    s('rect', { x: 66, y: 72, width: 28, height: 26, rx: 2 }, 'green', { accent: true }),
    s('path', { d: 'M84 50l-12 20h10l-6 18 14-24h-10z' }, 'yellow'),
    s('path', { d: 'M80 132v8q0 6 10 6h46', ...SW(4) }, 'gray', { stroke: true })
  ],
  'rectificación': [
    s('path', { d: 'M20 52q10-16 20 0t20 0 20 0 20 0 20 0 20 0', ...SW(6) }, 'gray', { stroke: true }),
    arrow('M80 70v24m-8-8 8 8 8-8', 'orange', 5),
    s('path', { d: 'M20 112h120', ...SW(6) }, 'green', { stroke: true, accent: true }),
    s('rect', { x: 20, y: 120, width: 120, height: 16, rx: 2 }, 'yellow'),
    s('path', { d: 'M32 120v6M44 120v4M56 120v6M68 120v4M80 120v6M92 120v4M104 120v6M116 120v4M128 120v6', ...SW(2) }, 'dark', { stroke: true })
  ],
  'redistribución': [
    s('path', { d: ells([[80, 46, 20, 7], [80, 38, 20, 7], [80, 30, 20, 7]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M60 30v16M100 30v16', ...SW(2) }, 'orange', { stroke: true }),
    arrow('M70 60L36 92M80 60v32M90 60l34 32', 'gray', 4),
    s('path', { d: busts([30, 80, 130], 136, 24, 22) }, 'blue'),
    s('path', { d: dots([[30, 108], [80, 108], [130, 108]], 9) }, 'skin'),
    s('path', { d: ells([[30, 92, 9, 4], [80, 92, 9, 4], [130, 92, 9, 4]]) }, 'yellow')
  ],
  reproductor: [
    s('rect', { x: 22, y: 32, width: 116, height: 96, rx: 10 }, 'dark'),
    s('rect', { x: 30, y: 40, width: 100, height: 60, rx: 4 }, 'sky'),
    s('circle', { cx: 80, cy: 70, r: 20 }, 'white'),
    s('path', { d: 'M74 60l16 10-16 10z' }, 'red', { accent: true }),
    s('path', { d: 'M34 114h92', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 114h44', ...SW(4) }, 'red', { stroke: true }),
    s('circle', { cx: 78, cy: 114, r: 5 }, 'white')
  ],
  sastre: [
    ground(),
    ...person(56, 136, 'navy'),
    s('path', { d: 'M46 76q10 14 20 0M48 80v32M64 80v26', ...SW(5) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M48 88h4M48 98h4M64 88h-4M64 98h-4', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: ring(104, 108, 8) + ring(124, 108, 8) + 'M108 100l26-40M120 100l-26-40', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 28h40v20h-40z' }, 'red')
  ],
  satisfactorio: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'mint'),
    s('rect', { x: 96, y: 70, width: 18, height: 52, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 50, y: 70, width: 50, height: 52, rx: 12 }, 'skin'),
    s('path', { d: 'M54 76V38q0-12 11-12t9 12v38z' }, 'skin'),
    s('path', { d: 'M74 84h22M74 98h22M74 112h20', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: sparkle(30, 40, 9) + sparkle(126, 40, 7) }, 'yellow')
  ],
  serenidad: [
    s('rect', { x: 14, y: 14, width: 132, height: 80 }, 'cream'),
    s('circle', { cx: 80, cy: 94, r: 30 }, 'orange'),
    s('rect', { x: 14, y: 94, width: 132, height: 42 }, 'sky'),
    s('path', { d: 'M30 112h30M100 112h30M50 126h60', ...SW(3) }, 'white', { stroke: true }),
    s('ellipse', { cx: 80, cy: 98, rx: 30, ry: 9 }, 'purple'),
    s('path', { d: 'M66 98l4-34h20l4 34z' }, 'purple', { accent: true }),
    s('circle', { cx: 80, cy: 52, r: 11 }, 'skin'),
    s('path', { d: 'M75 52h3M82 52h3', ...SW(2) }, 'dark', { stroke: true })
  ],
  sindicalista: [
    s('path', { d: busts([28, 132], 136, 26, 30) }, 'gray'),
    s('path', { d: dots([[28, 96], [132, 96]], 11) }, 'gray'),
    ...person(80, 136, 'orange', { accent: true }),
    s('path', { d: 'M64 74q0-20 16-20t16 20z' }, 'yellow'),
    s('path', { d: 'M92 98l14-10', ...SW(8) }, 'orange', { stroke: true }),
    s('path', { d: 'M104 84l26-18v40l-26-12z' }, 'red'),
    s('path', { d: 'M136 72l8-4M138 86h8M136 100l8 4', ...SW(3) }, 'dark', { stroke: true })
  ],
  soga: [
    s('path', { d: ring(80, 88, 44) + ring(80, 88, 30) + ring(80, 88, 16), ...SW(12) }, 'tan', { stroke: true, accent: true }),
    s('path', { d: ring(80, 88, 44) + ring(80, 88, 30) + ring(80, 88, 16), ...SW(12, { 'stroke-dasharray': '3 7', 'stroke-linecap': 'butt' }) }, 'brown', { stroke: true }),
    s('path', { d: 'M124 88q14-40-18-62', ...SW(12) }, 'tan', { stroke: true }),
    s('path', { d: 'M124 88q14-40-18-62', ...SW(12, { 'stroke-dasharray': '3 7', 'stroke-linecap': 'butt' }) }, 'brown', { stroke: true })
  ],
  suministrar: [
    ground(),
    s('path', { d: rects([[18, 104, 30, 30], [50, 104, 30, 30], [34, 72, 30, 30]]) }, 'tan'),
    s('path', { d: 'M33 104v30M65 104v30M49 72v30', ...SW(3) }, 'brown', { stroke: true }),
    arrow('M86 82h20m-8-8 8 8-8 8', 'green', 6),
    s('path', { d: 'M108 82l20-20 20 20z' }, 'red'),
    s('rect', { x: 112, y: 82, width: 32, height: 52 }, 'cream', { accent: true }),
    s('rect', { x: 122, y: 108, width: 12, height: 26 }, 'brown')
  ],
  surrealista: [
    s('rect', { x: 14, y: 14, width: 132, height: 122, rx: 12 }, 'sky'),
    s('rect', { x: 14, y: 96, width: 132, height: 40 }, 'tan'),
    s('rect', { x: 20, y: 74, width: 70, height: 14 }, 'brown'),
    s('path', { d: 'M38 74q0-30 30-30q34 0 30 30q-2 30 6 46q-8 6-12-4q-4-20-10-42z' }, 'yellow', { accent: true }),
    s('path', { d: 'M48 70q2-16 20-18q18 0 20 18', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M68 70v-14M68 70l10 4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M120 136V58M120 70l14-14', ...SW(4) }, 'dark', { stroke: true })
  ],
  tala: [
    ground(),
    s('path', { d: 'M28 136v-22h24v22z' }, 'brown'),
    s('ellipse', { cx: 40, cy: 114, rx: 12, ry: 4 }, 'tan'),
    s('path', { d: 'M62 132l60-56 10 10-60 56z' }, 'brown'),
    s('path', { d: ells([[132, 64, 18, 24]]) }, 'green', { accent: true }),
    s('path', { d: 'M76 74l-22-30', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M48 36l18 6-6 14q-14-4-12-20z' }, 'gray')
  ],
  talentoso: [
    ground(),
    ...person(56, 136, 'purple'),
    s('path', { d: 'M96 92q30-20 40 6q4 18-20 18q-6 0-6 8q-12 6-18-12q-4-12 4-20z' }, 'tan'),
    s('path', { d: dots([[106, 92], [122, 92], [128, 104]], 5) }, 'red'),
    s('path', { d: dots([[108, 106]], 5) }, 'blue'),
    s('path', { d: 'M72 104l24-4', ...SW(7) }, 'purple', { stroke: true }),
    s('path', { d: star(56, 38, 14) + sparkle(30, 48, 7) + sparkle(84, 30, 6) }, 'yellow', { accent: true })
  ],
  temperamento: [
    s('path', { d: 'M46 60q-8-24 10-40q0 16 10 12q0-14 14-20q-2 16 10 18q6-10 14-12q-4 14 6 22q4 10 0 20z' }, 'orange'),
    s('path', { d: 'M40 146q0-26 40-26t40 26z' }, 'navy'),
    s('circle', { cx: 80, cy: 88, r: 32 }, 'red', { accent: true }),
    s('path', { d: 'M62 76l12 6M98 76l-12 6M68 104q12-8 24 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 82q-8-6 0-14M136 82q8-6 0-14', ...SW(4) }, 'gray', { stroke: true })
  ],
  tinte: [
    s('path', { d: 'M28 56q16-8 28 0v80H28z' }, 'purple', { accent: true }),
    s('path', { d: 'M28 70q8 4 14 0M38 56v80M48 56v80', ...SW(2) }, 'pink', { stroke: true }),
    s('rect', { x: 82, y: 58, width: 40, height: 78, rx: 8 }, 'white'),
    outline({ x: 82, y: 58, width: 40, height: 78, rx: 8 }),
    s('rect', { x: 82, y: 86, width: 40, height: 30 }, 'purple'),
    s('path', { d: 'M94 58V40h16v18zM102 40l-6-14h12z' }, 'dark'),
    s('path', { d: drop(66, 104, 6) }, 'purple')
  ],
  'tirón': [
    ground(),
    ...lean(52, 136, -24, 'blue', { accent: true }),
    s('path', { d: 'M48 96L144 92', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 46, cy: 96, r: 6 }, 'skin'),
    s('path', { d: 'M100 72l12 0M96 112h14M104 82l20-2', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 132l-14 2', ...SW(5) }, 'dark', { stroke: true })
  ],
  tornar: [
    ground(),
    s('path', { d: 'M22 96l24-24 24 24z' }, 'red'),
    s('rect', { x: 28, y: 96, width: 36, height: 40 }, 'cream'),
    s('rect', { x: 40, y: 112, width: 12, height: 24 }, 'brown'),
    s('path', { d: 'M76 118h40q22 0 22-30t-22-30H62', ...SW(7) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M74 44l-18 14 18 14z' }, 'orange')
  ],
  tornillo: [
    s('path', { d: 'M74 58l12 0 0 70-6 12-6-12z', transform: 'rotate(30 80 90)' }, 'gray'),
    s('path', { d: 'M70 66l20 6M70 78l20 6M70 90l20 6M70 102l20 6M70 114l20 6', transform: 'rotate(30 80 90)', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 56, y: 40, width: 48, height: 18, rx: 6, transform: 'rotate(30 80 90)' }, 'gray', { accent: true }),
    s('path', { d: 'M62 49h36', transform: 'rotate(30 80 90)', ...SW(4) }, 'dark', { stroke: true })
  ],
  tricolor: [
    s('path', { d: 'M62 90l-20 50 14-6 8 12 10-50zM98 90l20 50-14-6-8 12-10-50z' }, 'blue'),
    s('circle', { cx: 80, cy: 70, r: 50 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 70, r: 34 }, 'white'),
    s('circle', { cx: 80, cy: 70, r: 18 }, 'green')
  ],
  urgentemente: [
    s('path', { d: 'M44 46l-12-12a14 14 0 0 1 22-8zM116 46l12-12a14 14 0 0 0-22-8z' }, 'dark'),
    s('path', { d: 'M54 128l-8 10M106 128l8 10', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 88, r: 44 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 88, r: 34 }, 'white'),
    s('path', { d: 'M80 88V64M80 88l14 8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M22 76q-6 12 0 24M138 76q6 12 0 24M14 70q-4 18 0 36M146 70q4 18 0 36', ...SW(3) }, 'orange', { stroke: true })
  ],
  utensilio: [
    s('path', { d: 'M50 26v62M80 20v68M110 26v62', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 40, y: 18, width: 20, height: 22, rx: 3 }, 'dark'),
    s('path', { d: 'M110 30a12 12 0 1 1 0 0.1z' }, 'gray'),
    s('path', { d: 'M72 18q8-12 16 0v24q-8 8-16 0z' }, 'gray'),
    s('path', { d: 'M38 80h84l-8 56H46z' }, 'blue', { accent: true }),
    s('path', { d: 'M40 92h80', ...SW(3) }, 'navy', { stroke: true })
  ],
  vestigio: [
    s('rect', { x: 14, y: 120, width: 132, height: 16, rx: 4 }, 'tan'),
    s('rect', { x: 26, y: 40, width: 22, height: 80 }, 'gray', { accent: true }),
    s('rect', { x: 20, y: 30, width: 34, height: 12 }, 'gray'),
    s('path', { d: 'M70 120V64l8-6 6 8 8-4v56z' }, 'gray'),
    s('path', { d: 'M112 120V92l10 4 10-6v30z' }, 'gray'),
    s('path', { d: 'M33 46v70M41 46v70M77 68v48M85 68v48M119 98v18M127 98v18', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M96 120l6-10 10 4 2 6z' }, 'gray')
  ],
  vivencia: [
    ground(),
    ...person(40, 136, 'green', { accent: true }),
    s('path', { d: dots([[58, 70], [66, 60]], 4) }, 'gray'),
    s('path', { d: ells([[104, 44, 42, 32]]) }, 'gray'),
    s('path', { d: ells([[104, 44, 36, 26]]) }, 'white'),
    s('path', { d: 'M74 62l18-26 10 12 10-20 20 34z' }, 'green'),
    s('circle', { cx: 118, cy: 30, r: 6 }, 'yellow'),
    s('path', { d: 'M108 28v-12', ...SW(2) }, 'red', { stroke: true })
  ],
  voltaje: [
    s('path', { d: 'M80 18l64 112H16z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 18l64 112H16z', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M88 46l-24 40h16l-10 34 28-46H82z' }, 'dark')
  ],
  'ápice': [
    s('rect', { x: 14, y: 14, width: 132, height: 122, rx: 12 }, 'sky'),
    s('path', { d: 'M14 136l66-96 66 96z' }, 'gray'),
    s('path', { d: 'M66 60l14-20 14 20-8-4-6 6-6-6z' }, 'white'),
    s('circle', { cx: 80, cy: 40, r: 7 }, 'red', { accent: true }),
    arrow('M118 30l-26 6m8-10-8 10 10 6', 'red', 4)
  ],
  aburrir: [
    s('rect', { x: 18, y: 24, width: 40, height: 40, rx: 20 }, 'white'),
    s('path', { d: ring(38, 44, 20) + 'M38 44V32M38 44h10', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M44 146q0-26 40-26t40 26z' }, 'blue'),
    s('circle', { cx: 84, cy: 84, r: 32 }, 'skin', { accent: true }),
    s('path', { d: 'M66 78h12M90 78h12', ...SW(4) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 84, cy: 100, rx: 8, ry: 10 }, 'dark'),
    s('path', { d: 'M116 52q8-8 16 0M124 36q6-6 12 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  afro: [
    s('path', { d: dots([[80, 66], [52, 58], [108, 58], [60, 36], [100, 36], [80, 28], [46, 82], [114, 82]], 24) }, 'dark', { accent: true }),
    s('path', { d: 'M40 146q0-26 40-26t40 26z' }, 'orange'),
    s('rect', { x: 72, y: 106, width: 16, height: 18 }, 'brown'),
    ...face(80, 84, 24, 'brown')
  ],
  anochecer: [
    s('rect', { x: 14, y: 14, width: 132, height: 122, rx: 12 }, 'navy'),
    s('path', { d: 'M14 70h132v66H14z' }, 'purple'),
    s('circle', { cx: 80, cy: 112, r: 30 }, 'orange', { accent: true }),
    s('rect', { x: 14, y: 112, width: 132, height: 24 }, 'dark'),
    s('path', { d: 'M118 30a14 14 0 1 0 12 20a11 11 0 1 1-12-20z' }, 'cream'),
    s('path', { d: star(40, 34, 5) + star(70, 26, 4) + star(96, 48, 3) + star(30, 58, 3) }, 'yellow')
  ],
  apogeo: [
    s('rect', { x: 14, y: 14, width: 132, height: 122, rx: 12 }, 'navy'),
    s('ellipse', { cx: 80, cy: 76, rx: 60, ry: 34, ...DASH(3) }, 'white', { stroke: true }),
    s('circle', { cx: 44, cy: 76, r: 14 }, 'blue'),
    s('path', { d: 'M38 68q6 2 6 8M48 82q2 4 6 2', ...SW(3) }, 'green', { stroke: true }),
    s('rect', { x: 132, y: 68, width: 12, height: 16, rx: 2 }, 'gray', { accent: true }),
    s('path', { d: 'M124 72h8M124 80h8', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: 'M58 118h80M58 118l8-6M58 118l8 6', ...SW(3) }, 'yellow', { stroke: true })
  ],
  'apéndice': [
    s('rect', { x: 26, y: 18, width: 108, height: 124, rx: 30 }, 'cream'),
    s('path', { d: 'M54 118V48h52v70', ...SW(16) }, 'pink', { stroke: true }),
    s('path', { d: 'M54 48h52', ...SW(16) }, 'pink', { stroke: true }),
    s('path', { d: 'M54 118q-2 14-12 18', ...SW(7) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M48 62h12M48 84h12M48 104h12M100 62h12M100 84h12M100 104h12', ...SW(2) }, 'red', { stroke: true })
  ],
  'argumentación': [
    ground(),
    ...person(36, 136, 'blue'),
    s('path', { d: 'M48 98l20-14', ...SW(7) }, 'blue', { stroke: true }),
    s('path', { d: bubble(66, 18, 80, 76) }, 'cream'),
    s('path', { d: bubble(66, 18, 80, 76), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[80, 34], [80, 50], [80, 66]], 5) }, 'green', { accent: true }),
    s('path', { d: 'M92 34h40M92 50h40M92 66h28', ...SW(5) }, 'gray', { stroke: true })
  ],
  asa: [
    s('path', { d: 'M104 62h10a20 20 0 0 1 0 40h-10', ...SW(12) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M36 44h72v68a20 20 0 0 1-20 20H56a20 20 0 0 1-20-20z' }, 'white'),
    s('path', { d: 'M36 44h72v68a20 20 0 0 1-20 20H56a20 20 0 0 1-20-20z', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 36q-6-10 0-18M80 34q-6-10 0-18', ...SW(3) }, 'gray', { stroke: true })
  ],
  cadete: [
    ground(),
    ...person(70, 136, 'navy', { accent: true }),
    s('path', { d: 'M54 66h32v-8q-16-8-32 0z' }, 'navy'),
    s('path', { d: 'M52 66h36', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M84 100l18-18-14-14', ...SW(8) }, 'navy', { stroke: true }),
    s('path', { d: 'M64 96h12M64 106h12', ...SW(3) }, 'yellow', { stroke: true })
  ],
  chin: [
    s('path', { d: 'M20 120q16-30 46-36l20-2q6 6 0 12l-20 4' }, 'skin'),
    s('path', { d: 'M20 120q16-30 46-36l20-2q6 6 0 12l-20 4', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M28 44q30-8 50 8l14 12q2 8-6 10l-18-8q-20-4-40 0z' }, 'skin'),
    s('path', { d: 'M28 44q30-8 50 8l14 12q2 8-6 10l-18-8q-20-4-40 0z', ...SW(3) }, 'tan', { stroke: true }),
    s('circle', { cx: 100, cy: 78, r: 4 }, 'brown', { accent: true }),
    s('path', { d: 'M114 60l14-10M118 78h16M114 96l14 10', ...SW(3) }, 'orange', { stroke: true })
  ],
  clamor: [
    s('path', { d: busts([30, 62, 98, 130], 136, 28, 34) }, 'blue'),
    s('path', { d: dots([[30, 92], [62, 88], [98, 88], [130, 92]], 12) }, 'skin'),
    s('path', { d: ells([[30, 98, 4, 5], [62, 94, 4, 5], [98, 94, 4, 5], [130, 98, 4, 5]]) }, 'dark'),
    s('path', { d: 'M18 60l-4-14M44 74l4-14M58 70V52M100 70V52M116 74l-4-14M142 60l4-14', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M50 38q30-24 60 0M38 26q42-32 84 0', ...SW(5) }, 'orange', { stroke: true, accent: true })
  ],
  clandestino: [
    s('rect', { x: 14, y: 14, width: 132, height: 122, rx: 12 }, 'navy'),
    s('path', { d: 'M114 26a14 14 0 1 0 12 20a11 11 0 1 1-12-20z' }, 'cream'),
    s('path', { d: 'M58 132l10-26M90 132l-8-26', ...SW(7) }, 'black', { stroke: true }),
    s('path', { d: 'M60 68h34l8 44H52z' }, 'dark', { accent: true }),
    s('circle', { cx: 77, cy: 56, r: 12 }, 'skin'),
    s('path', { d: 'M60 52h34M66 52q0-14 11-14t11 14z' }, 'black'),
    s('path', { d: 'M82 60h-10', ...SW(4) }, 'black', { stroke: true }),
    s('path', { d: 'M28 132q10-8 20 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  clientela: [
    s('rect', { x: 92, y: 40, width: 50, height: 96 }, 'cream'),
    s('path', { d: 'M88 28h58v18H88z' }, 'red'),
    s('path', { d: 'M88 46h58', ...SW(4, { 'stroke-dasharray': '10 4' }) }, 'white', { stroke: true }),
    s('rect', { x: 106, y: 86, width: 22, height: 50 }, 'brown'),
    s('path', { d: busts([24, 50, 76], 136, 22, 30) }, 'green', { accent: true }),
    s('path', { d: dots([[24, 98], [50, 98], [76, 98]], 10) }, 'skin'),
    ground()
  ],
  compacto: [
    s('path', { d: 'M54 66l12-12h40l-12 12z' }, 'orange'),
    s('path', { d: 'M94 66l12-12v40l-12 12z' }, 'brown'),
    s('rect', { x: 54, y: 66, width: 40, height: 40 }, 'yellow', { accent: true }),
    arrow('M18 86h24m-8-8 8 8-8 8M142 80h-24m8-8-8 8 8 8M80 18v24m-8-8 8 8 8-8M74 142v-24m-8 8 8-8 8 8', 'gray', 5)
  ],
  compatibilidad: [
    s('path', { d: 'M24 46h40v14a10 10 0 1 1 0 20v34H24z' }, 'blue', { accent: true }),
    s('path', { d: 'M136 46H74v14a10 10 0 1 0 0 20v34h62z' }, 'green'),
    s('path', { d: sparkle(80, 30, 9) + sparkle(80, 130, 7) }, 'yellow')
  ],
  conciliar: [
    ground(),
    ...person(32, 136, 'blue'),
    ...person(128, 136, 'green'),
    s('path', { d: 'M44 100q20-4 32-12M116 100q-20-4-32-12', ...SW(8) }, 'skin', { stroke: true }),
    s('circle', { cx: 80, cy: 86, r: 8 }, 'skin'),
    s('path', { d: heart(80, 42, 18) }, 'red', { accent: true })
  ],
  cuaresma: [
    s('rect', { x: 14, y: 14, width: 132, height: 122, rx: 12 }, 'purple'),
    s('path', { d: 'M80 22v40M66 34h28', ...SW(7) }, 'cream', { stroke: true }),
    s('ellipse', { cx: 80, cy: 106, rx: 54, ry: 20 }, 'white'),
    s('path', { d: fishes([[84, 104]]) }, 'sky', { accent: true }),
    s('circle', { cx: 90, cy: 102, r: 2 }, 'dark')
  ],
  'cuántico': [
    s('ellipse', { cx: 80, cy: 80, rx: 62, ry: 20, ...SW(4) }, 'blue', { stroke: true }),
    s('ellipse', { cx: 80, cy: 80, rx: 62, ry: 20, transform: 'rotate(60 80 80)', ...SW(4) }, 'blue', { stroke: true }),
    s('ellipse', { cx: 80, cy: 80, rx: 62, ry: 20, transform: 'rotate(120 80 80)', ...SW(4) }, 'blue', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'red', { accent: true }),
    s('path', { d: dots([[142, 80], [49, 26], [49, 134]], 7) }, 'purple'),
    s('path', { d: dots([[130, 56], [118, 114], [28, 96], [40, 52], [104, 26], [70, 140]], 3) }, 'purple')
  ],
  'cómputo': [
    s('rect', { x: 38, y: 16, width: 84, height: 126, rx: 10 }, 'dark'),
    s('rect', { x: 48, y: 26, width: 64, height: 26, rx: 3 }, 'mint'),
    s('path', { d: dots([[100, 39], [88, 39], [76, 39]], 4) }, 'dark'),
    s('path', { d: rects([[48, 62, 14, 12], [73, 62, 14, 12], [48, 82, 14, 12], [73, 82, 14, 12], [48, 102, 14, 12], [73, 102, 14, 12], [48, 122, 14, 12], [73, 122, 14, 12]]) }, 'gray'),
    s('path', { d: rects([[98, 62, 14, 12], [98, 82, 14, 12], [98, 102, 14, 32]]) }, 'orange', { accent: true })
  ],
  'cónyuge': [
    ground(),
    ...person(52, 136, 'navy'),
    ...lady(108, 136, 'white'),
    s('path', { d: 'M100 136l8-50h0l8 50z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 104l28-2', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: ring(72, 34, 12) + ring(88, 34, 12), ...SW(5) }, 'yellow', { stroke: true, accent: true })
  ],
  emboscada: [
    ground(),
    s('path', { d: ells([[38, 108, 30, 28], [122, 108, 30, 28]]) }, 'green'),
    s('path', { d: dots([[30, 104], [44, 104], [116, 100], [130, 100]], 5) }, 'white'),
    s('path', { d: dots([[32, 105], [46, 105], [114, 101], [128, 101]], 2) }, 'dark'),
    ...person(80, 136, 'orange', { accent: true, h: 36, w: 22, r: 10 }),
    s('path', { d: 'M62 60l-6-10M80 54V42M98 60l6-10', ...SW(3) }, 'red', { stroke: true })
  ],
  'escrúpulo': [
    s('path', { d: 'M24 112q0-46 16-60h34q4 32 30 40q32 8 32 30v10H24z' }, 'brown', { accent: true }),
    s('path', { d: 'M40 56h34', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 20, y: 122, width: 120, height: 12, rx: 4 }, 'dark'),
    s('ellipse', { cx: 58, cy: 36, rx: 10, ry: 8 }, 'gray'),
    arrow('M58 48v12', 'red', 4),
    s('path', { d: 'M90 34l-6-10M100 40l10-8M104 52h12', ...SW(3) }, 'red', { stroke: true })
  ],
  feudal: [
    s('rect', { x: 14, y: 14, width: 132, height: 122, rx: 12 }, 'sky'),
    s('path', { d: 'M14 100q66-30 132 0v36H14z' }, 'green'),
    s('path', { d: 'M30 120l30-12M44 132l50-20M90 132l40-18', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M48 86V40h12v8h8v-8h8v8h8v-8h8v8h8v-8h12v46z' }, 'gray', { accent: true }),
    s('path', { d: 'M74 86V70q6-8 12 0v16z' }, 'dark'),
    s('path', { d: 'M80 40V22l14 6-14 6', ...SW(3) }, 'red', { stroke: true })
  ],
  firmante: [
    s('rect', { x: 18, y: 30, width: 100, height: 110, rx: 4 }, 'white'),
    outline({ x: 18, y: 30, width: 100, height: 110, rx: 4 }),
    s('path', { d: 'M30 48h76M30 62h76M30 76h56M30 124h66', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 116q8-20 14 0t12-4 10 0 14-6', ...SW(3) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M86 104l44-56 10 8-44 56-14 6z' }, 'dark'),
    s('path', { d: 'M86 104l-4 14 14-6z' }, 'yellow')
  ],
  fragata: [
    s('path', { d: 'M14 104q16-8 33 0t33 0 33 0 33 0v32H14z' }, 'blue'),
    s('path', { d: 'M16 88h128l-14 24H30z' }, 'gray', { accent: true }),
    s('path', { d: 'M54 88V68h40v20zM66 68V54h18v14z' }, 'gray'),
    s('path', { d: 'M74 54V28M66 36h16M106 82l24-10', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 82h18', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[62, 78], [74, 78], [86, 78]], 3) }, 'navy')
  ],
  hinchada: [
    s('path', { d: 'M14 136v-30h132v30zM14 106V80h132v26z' }, 'gray'),
    s('path', { d: busts([28, 58, 88, 118], 106, 22, 22) + busts([42, 72, 102, 132], 136, 22, 22) }, 'red', { accent: true }),
    s('path', { d: dots([[28, 76], [58, 76], [88, 76], [118, 76], [42, 106], [72, 106], [102, 106], [132, 106]], 8) }, 'skin'),
    s('path', { d: 'M40 62l12-38M100 62l14-36', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 24l26 6-20 12zM114 26l24 10-22 10z' }, 'yellow'),
    s('path', { d: 'M72 50q16 8 32 0', ...SW(6, { 'stroke-dasharray': '6 4', 'stroke-linecap': 'butt' }) }, 'red', { stroke: true })
  ],
  hervir: [
    s('path', { d: 'M40 122h80', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 140l6-12M80 142v-14M112 140l-6-12', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M34 66h92v40a14 14 0 0 1-14 14H48a14 14 0 0 1-14-14z' }, 'gray', { accent: true }),
    s('path', { d: 'M24 72h12M124 72h12', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[54, 62], [70, 58], [88, 62], [106, 60], [62, 50], [96, 48]], 6) }, 'sky'),
    s('path', { d: 'M58 38q-6-8 0-16t0-16M80 36q-6-8 0-16M102 38q-6-8 0-16t0-16', ...SW(3) }, 'gray', { stroke: true })
  ],
  indignante: [
    s('path', { d: ells([[22, 50, 10, 8], [138, 50, 10, 8], [30, 32, 8, 6], [130, 32, 8, 6]]) }, 'gray'),
    s('path', { d: 'M40 146q0-26 40-26t40 26z' }, 'blue'),
    s('circle', { cx: 80, cy: 82, r: 36 }, 'orange', { accent: true }),
    s('path', { d: 'M58 66l16 8M102 66l-16 8M64 106q16-12 32 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[68, 82], [92, 82]], 4) }, 'dark'),
    s('path', { d: 'M100 34q6 6 0 12M112 34q-6 6 0 12M100 34q6 6 12 0M100 46q6-6 12 0', ...SW(4) }, 'red', { stroke: true })
  ],
  inquilino: [
    ground(),
    s('path', { d: 'M74 50l36-28 36 28z' }, 'red'),
    s('rect', { x: 80, y: 50, width: 60, height: 86 }, 'cream'),
    s('path', { d: rects([[88, 60, 14, 14], [118, 60, 14, 14]]) }, 'sky'),
    s('rect', { x: 100, y: 96, width: 22, height: 40 }, 'brown'),
    ...person(40, 136, 'purple'),
    s('path', { d: 'M52 100l16-8', ...SW(7) }, 'purple', { stroke: true }),
    s('path', { d: ring(74, 86, 7) + 'M74 93v18M74 104h6M74 110h6', ...SW(4) }, 'yellow', { stroke: true, accent: true })
  ],
  'insurrección': [
    s('path', { d: 'M14 136l20-30h92l20 30z' }, 'brown'),
    s('path', { d: busts([40, 80, 120], 106, 24, 28) }, 'gray'),
    s('path', { d: dots([[40, 72], [80, 72], [120, 72]], 11) }, 'skin'),
    s('path', { d: 'M28 84L18 52M132 84l10-32M92 84l6-56', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: dots([[18, 48], [142, 48]], 6) }, 'skin'),
    s('path', { d: 'M98 28l40 8-38 16z' }, 'red', { accent: true })
  ],
  intencional: [
    ground(),
    ...person(32, 136, 'blue'),
    s('path', { d: 'M44 98l14-10', ...SW(7) }, 'blue', { stroke: true }),
    s('path', { d: 'M60 84q30-26 56-12', ...DASH(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 118, cy: 80, r: 28 }, 'red', { accent: true }),
    s('circle', { cx: 118, cy: 80, r: 18 }, 'white'),
    s('circle', { cx: 118, cy: 80, r: 8 }, 'red'),
    s('path', { d: 'M118 80l-14-8', ...SW(4) }, 'dark', { stroke: true })
  ],
  intestinal: [
    s('rect', { x: 30, y: 18, width: 100, height: 124, rx: 36 }, 'cream'),
    s('path', { d: 'M46 50h68v70H46z', ...SW(12) }, 'brown', { stroke: true }),
    s('path', { d: 'M60 66h40q6 0 6 6t-6 6H60q-6 0-6 6t6 6h40q6 0 6 6t-6 6H60', ...SW(8) }, 'pink', { stroke: true, accent: true })
  ],
  lactancia: [
    s('path', { d: 'M30 146v-30q0-24 34-24h32q34 0 34 24v30z' }, 'mint'),
    s('circle', { cx: 80, cy: 58, r: 22 }, 'skin'),
    s('path', { d: 'M58 54q0-30 22-30t22 30q-6-14-22-16q-16 2-22 16z' }, 'brown'),
    s('ellipse', { cx: 72, cy: 112, rx: 34, ry: 18 }, 'cream', { accent: true }),
    s('circle', { cx: 92, cy: 102, r: 14 }, 'skin'),
    s('path', { d: 'M48 124q30 10 60-6', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: heart(124, 34, 10) }, 'pink')
  ],
  lagrimar: [
    s('path', { d: 'M36 146q0-26 44-26t44 26z' }, 'blue'),
    ...face(80, 76, 40, 'skin', 'frown'),
    s('path', { d: 'M66 76q-2 20-6 34M94 76q2 20 6 34', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: drop(58, 118, 6) + drop(102, 118, 6) }, 'blue', { accent: true })
  ],
  laico: [
    ground(),
    s('path', { d: 'M24 136l8-50h20l8 50z' }, 'dark'),
    s('circle', { cx: 42, cy: 74, r: 11 }, 'skin'),
    s('path', { d: 'M38 90h8', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M80 36v100', ...DASH(3) }, 'gray', { stroke: true }),
    ...person(118, 136, 'orange', { accent: true }),
    s('path', { d: 'M104 108h28', ...SW(3) }, 'yellow', { stroke: true })
  ],
  leucemia: [
    s('path', { d: drop(80, 92, 46) }, 'red', { accent: true }),
    s('path', { d: dots([[64, 84], [94, 78], [80, 104], [58, 112], [102, 106], [82, 60]], 9) }, 'white'),
    s('path', { d: dots([[64, 84], [94, 78], [80, 104], [58, 112], [102, 106], [82, 60]], 3) }, 'purple')
  ],
  'maní': [
    s('path', { d: 'M30 60q-8-22 12-30q18-6 26 10q8 10 20 8q22 0 24 20q2 22-22 24q-14 0-22 10q-16 14-30 2q-14-12-2-28q6-8-6-16z', transform: 'rotate(-10 70 70)' }, 'tan', { accent: true }),
    s('path', { d: 'M44 44l6 6M60 54l6 6M78 66l6 6M92 78l6 6M50 76l6 6M70 86l6 6', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M88 112q10-20 30-12q18 10 4 28q-10 12-26 6q-12-6-8-22z' }, 'brown'),
    s('path', { d: ells([[104, 116, 9, 7], [120, 118, 8, 6]]) }, 'cream')
  ],
  mosaico: [
    s('rect', { x: 18, y: 18, width: 124, height: 124, rx: 6 }, 'cream'),
    s('path', { d: rects([[22, 22, 26, 26], [80, 22, 26, 26], [51, 51, 26, 26], [109, 51, 29, 26], [22, 80, 26, 26], [80, 80, 26, 26], [51, 109, 26, 29], [109, 109, 29, 29]]) }, 'blue', { accent: true }),
    s('path', { d: rects([[51, 22, 26, 26], [22, 51, 26, 26], [80, 51, 26, 26], [109, 80, 29, 26], [22, 109, 26, 29]]) }, 'orange'),
    s('path', { d: rects([[109, 22, 29, 26], [51, 80, 26, 26], [80, 109, 26, 29]]) }, 'green')
  ],
  multiplicar: [
    s('circle', { cx: 28, cy: 80, r: 14 }, 'green', { accent: true }),
    arrow('M46 72l14-14M46 88l14 14', 'gray', 4),
    s('path', { d: dots([[74, 52], [74, 108]], 12) }, 'green'),
    arrow('M90 46l12-10M90 58l12 10M90 102l12-10M90 114l12 10', 'gray', 4),
    s('path', { d: dots([[122, 30], [122, 64], [122, 96], [122, 130]], 12) }, 'green')
  ],
  naranjo: [
    ground(),
    s('path', { d: 'M56 136V96h14v40z' }, 'brown'),
    s('circle', { cx: 62, cy: 64, r: 46 }, 'green'),
    s('path', { d: dots([[40, 50], [68, 36], [86, 62], [52, 80], [76, 88], [30, 70]], 9) }, 'orange'),
    s('circle', { cx: 122, cy: 116, r: 20 }, 'orange', { accent: true }),
    s('circle', { cx: 122, cy: 116, r: 14 }, 'yellow'),
    s('path', { d: rays(122, 116, 0, 14, 8), ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M104 98q10-14 24-8q-10 10-24 8z' }, 'green')
  ],
  'navío': [
    s('path', { d: 'M14 112q16-8 33 0t33 0 33 0 33 0v24H14z' }, 'blue'),
    s('path', { d: 'M20 92h120l-16 24H34z' }, 'brown', { accent: true }),
    s('path', { d: 'M50 92V20M80 92V14M110 92V24', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M38 30h24q4 20 0 40H38q-4-20 0-40zM66 22h28q4 24 0 48H66q-4-24 0-48zM98 34h24q4 16 0 34H98q-4-18 0-34z' }, 'cream'),
    s('path', { d: 'M80 14l14 6-14 4z' }, 'red'),
    s('path', { d: dots([[46, 102], [66, 102], [86, 102], [106, 102]], 3) }, 'yellow')
  ],
  obispado: [
    s('path', { d: 'M118 140V44', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M118 46q0-26 16-26t10 16q-4 8-12 4', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M40 120V64q0-30 26-46q26 16 26 46v56z' }, 'white', { accent: true }),
    s('path', { d: 'M40 120V64q0-30 26-46q26 16 26 46v56z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 22v98M40 100h52', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M54 120l-6 20M78 120l6 20', ...SW(5) }, 'red', { stroke: true })
  ],
  olivar: [
    s('path', { d: 'M14 96q66-16 132 0v40H14z' }, 'tan'),
    s('path', { d: 'M38 112V92M80 106V86M122 112V92M58 136v-16M102 136v-16', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: ells([[38, 78, 22, 16], [80, 72, 22, 16], [122, 78, 22, 16], [58, 108, 18, 12], [102, 108, 18, 12]]) }, 'mint'),
    s('path', { d: ells([[38, 80, 16, 10], [80, 74, 16, 10], [122, 80, 16, 10]]) }, 'green', { accent: true }),
    s('path', { d: dots([[26, 72], [50, 84], [70, 66], [92, 80], [112, 74], [134, 84]], 3) }, 'purple')
  ],
  pactar: [
    s('rect', { x: 34, y: 96, width: 92, height: 44, rx: 4 }, 'white'),
    outline({ x: 34, y: 96, width: 92, height: 44, rx: 4 }),
    s('path', { d: 'M46 112h50M46 124h36', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 48h28l8 14-28 14H14z' }, 'blue'),
    s('path', { d: 'M146 48h-28l-8 14 28 14h8z' }, 'green', { accent: true }),
    s('path', { d: 'M44 50q20-10 40 4l14 4q6 6-2 10l-12 2q-14 10-38 2z' }, 'skin'),
    s('path', { d: 'M66 64q16 6 30-2M70 72q12 4 24 0', ...SW(3) }, 'tan', { stroke: true })
  ],
  particularidad: [
    s('path', { d: rects([[24, 24, 26, 26], [64, 24, 26, 26], [104, 24, 26, 26], [24, 64, 26, 26], [104, 64, 26, 26], [24, 104, 26, 26], [64, 104, 26, 26]]) }, 'gray'),
    s('path', { d: 'M77 64l16 26H61z' }, 'orange', { accent: true }),
    s('path', { d: ring(77, 78, 22), ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M94 96l40 40', ...SW(9) }, 'blue', { stroke: true })
  ],
  patrono: [
    ground(),
    ...person(56, 136, 'navy', { accent: true, h: 54 }),
    s('path', { d: 'M56 84l-5 8 5 26 5-26z' }, 'red'),
    s('path', { d: 'M68 92q24-6 36 6', ...SW(7) }, 'navy', { stroke: true }),
    ...person(112, 136, 'orange', { h: 34, w: 24, r: 10 }),
    s('path', { d: 'M100 92q0-14 12-14t12 14z' }, 'yellow')
  ],
  pinar: [
    s('rect', { x: 14, y: 14, width: 132, height: 122, rx: 12 }, 'mint'),
    s('path', { d: 'M38 136v-14M80 136v-14M122 136v-14', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M38 30l22 46H48l14 26H14l14-26H16zM122 30l22 46h-12l14 26H98l14-26h-12z' }, 'green'),
    s('path', { d: 'M80 20l24 50H92l16 30H52l16-30H56z' }, 'green', { accent: true }),
    s('path', { d: 'M80 100v22', ...SW(6) }, 'brown', { stroke: true })
  ],
  portillo: [
    s('rect', { x: 14, y: 40, width: 132, height: 96 }, 'tan'),
    s('path', { d: 'M14 64h132M14 88h132M14 112h132M40 40v24M80 40v24M120 40v24M60 64v24M100 64v24M30 88v24M130 88v24M40 112v24M120 112v24', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M62 136V92a18 18 0 0 1 36 0v44z' }, 'brown', { accent: true }),
    s('circle', { cx: 90, cy: 116, r: 3 }, 'yellow'),
    s('path', { d: 'M62 136V92a18 18 0 0 1 36 0v44', ...SW(4) }, 'dark', { stroke: true })
  ],
  postular: [
    ground(),
    ...person(46, 136, 'green'),
    s('path', { d: 'M58 98l18-24', ...SW(7) }, 'green', { stroke: true }),
    s('rect', { x: 74, y: 30, width: 56, height: 72, rx: 4 }, 'white'),
    outline({ x: 74, y: 30, width: 56, height: 72, rx: 4 }),
    s('rect', { x: 82, y: 38, width: 18, height: 22 }, 'sky', { accent: true }),
    s('path', { d: 'M106 42h16M106 52h16M84 70h38M84 80h38M84 90h28', ...SW(3) }, 'gray', { stroke: true })
  ],
  'progresión': [
    ground(),
    s('path', { d: rects([[22, 116, 18, 20], [48, 100, 18, 36], [74, 80, 18, 56], [100, 56, 18, 80]]) }, 'blue'),
    s('rect', { x: 126, y: 28, width: 18, height: 108 }, 'green', { accent: true }),
    arrow('M22 98L110 32m-14 0 14 0-2 14', 'orange', 5)
  ],
  proyectil: [
    s('path', { d: 'M20 120q50-100 120-70', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M76 60h40q20 0 28 12q-8 12-28 12H76z', transform: 'rotate(-14 110 72)' }, 'gray', { accent: true }),
    s('path', { d: 'M70 58h10v28H70z', transform: 'rotate(-14 110 72)' }, 'dark'),
    s('path', { d: 'M40 76h22M34 92h24M44 108h14', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M18 136h40', ...SW(4) }, 'gray', { stroke: true })
  ],
  'psiquiatría': [
    s('path', { d: 'M100 142v-26q22-4 20-20l10-4-8-14q4-34-30-44q-38-8-56 22q-14 30 8 54v32z' }, 'sky'),
    s('path', { d: 'M48 52q2-16 22-16q8-8 20 0q20 0 18 18q8 12-4 22q-2 14-18 12q-10 8-22 0q-18 0-18-16q-8-10 2-20z' }, 'pink', { accent: true }),
    s('path', { d: 'M62 52q8 6 0 14M82 46q-4 10 6 16M74 74q8-6 16 0', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M136 30v30q0 18-18 18', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 116, cy: 80, r: 7 }, 'gray')
  ],
  quebrar: [
    s('path', { d: 'M20 100l56-20', ...SW(12) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M84 80l56 20', ...SW(12) }, 'brown', { stroke: true }),
    s('path', { d: 'M76 70l-4-14M80 72v-20M84 70l6-14M76 92l-4 14M84 92l6 14', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: ells([[38, 98, 12, 14], [122, 98, 12, 14]]) }, 'skin'),
    s('path', { d: 'M30 112l-10 24M130 112l10 24', ...SW(12) }, 'blue', { stroke: true })
  ],
  rampa: [
    ground(),
    s('path', { d: 'M14 136l120-56h12v56z' }, 'gray'),
    s('circle', { cx: 74, cy: 92, r: 18, ...SW(5) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M66 88V62h14v24h20l8 14', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 74, cy: 46, r: 10 }, 'skin'),
    s('path', { d: 'M74 58v24h18', ...SW(8) }, 'orange', { stroke: true })
  ],
  receso: [
    s('circle', { cx: 60, cy: 66, r: 44 }, 'orange', { accent: true }),
    s('path', { d: rects([[46, 44, 10, 44], [64, 44, 10, 44]]) }, 'white'),
    s('path', { d: 'M100 92h40v32a12 12 0 0 1-12 12h-16a12 12 0 0 1-12-12z' }, 'brown'),
    s('path', { d: 'M140 100a8 8 0 0 1 0 16', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M112 84q-4-6 0-12M126 84q-4-6 0-12', ...SW(3) }, 'gray', { stroke: true })
  ],
  rellenar: [
    ...paper(24, 18, 96, 124),
    s('path', { d: rects([[36, 32, 70, 16], [36, 60, 70, 16], [36, 88, 70, 16]]), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: rects([[38, 34, 66, 12], [38, 62, 66, 12]]) }, 'sky'),
    s('rect', { x: 38, y: 90, width: 30, height: 12 }, 'sky', { accent: true }),
    s('path', { d: 'M70 104l50-56 10 8-50 56-14 4z' }, 'yellow'),
    s('path', { d: 'M70 104l-4 12 14-4z' }, 'dark')
  ],
  retablo: [
    s('path', { d: 'M22 140V50l18-20 40-16 40 16 18 20v90z' }, 'yellow', { accent: true }),
    s('path', { d: 'M62 132V64a18 18 0 0 1 36 0v68z' }, 'blue'),
    s('path', { d: 'M30 132V76a10 10 0 0 1 20 0v56zM110 132V76a10 10 0 0 1 20 0v56z' }, 'red'),
    s('path', { d: 'M80 74l8 14-8 14-8-14z' }, 'cream'),
    s('path', { d: 'M56 46h48M22 140h116', ...SW(4) }, 'orange', { stroke: true })
  ],
  sabotaje: [
    ...gear(56, 90, 26, 10, 'gray'),
    ...gear(112, 70, 18, 8, 'gray'),
    s('path', { d: 'M74 30l14 70', ...SW(9) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M66 22a10 10 0 1 0 18-6', ...SW(8) }, 'red', { stroke: true }),
    s('path', { d: sparkle(94, 104, 10) + sparkle(30, 40, 7) }, 'orange'),
    s('circle', { cx: 56, cy: 90, r: 7 }, 'dark')
  ],
  secretamente: [
    s('path', { d: 'M36 146q0-26 44-26t44 26z' }, 'purple'),
    s('circle', { cx: 80, cy: 78, r: 36 }, 'skin'),
    s('path', { d: dots([[66, 70], [94, 70]], 4) }, 'dark'),
    s('path', { d: 'M68 96h24', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M76 124V86a4 4 0 0 1 8 0v38z' }, 'tan', { accent: true }),
    s('path', { d: 'M124 52q10 10 0 20M134 44q16 18 0 36', ...SW(3) }, 'gray', { stroke: true })
  ],
  'segregación': [
    s('path', { d: 'M80 22v116', ...SW(8) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M72 48h16M72 80h16M72 112h16', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: dots([[30, 50], [54, 66], [32, 92], [56, 112], [30, 126]], 11) }, 'blue'),
    s('path', { d: dots([[106, 50], [130, 70], [104, 92], [128, 112], [108, 126]], 11) }, 'orange'),
    ground(142)
  ],
  'sociólogo': [
    ground(),
    ...person(36, 136, 'brown'),
    s('rect', { x: 46, y: 92, width: 20, height: 26, rx: 2 }, 'white'),
    outline({ x: 46, y: 92, width: 20, height: 26, rx: 2 }, 'gray', 2),
    s('path', { d: 'M110 30L84 70M110 30l26 40M84 70h52M110 30v76M84 70l26 36M136 70l-26 36', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[110, 30], [84, 70], [136, 70], [110, 106]], 10) }, 'blue', { accent: true }),
    s('path', { d: dots([[110, 26], [84, 66], [136, 66], [110, 102]], 4) }, 'skin')
  ],
  sortear: [
    s('path', { d: 'M60 112l-10 26M100 112l10 26M40 138h80', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 70, r: 50 }, 'sky'),
    s('path', { d: dots([[64, 96], [86, 100], [104, 90]], 10) }, 'red'),
    s('path', { d: dots([[54, 76], [76, 80], [96, 70]], 10) }, 'yellow', { accent: true }),
    s('path', { d: dots([[66, 54], [90, 48], [112, 64]], 10) }, 'green'),
    s('path', { d: ring(80, 70, 50), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M114 38q12-8 20 2', ...SW(3) }, 'white', { stroke: true })
  ],
  subsuelo: [
    s('rect', { x: 14, y: 14, width: 132, height: 56 }, 'sky'),
    s('rect', { x: 14, y: 70, width: 132, height: 70 }, 'brown'),
    s('path', { d: 'M14 104h132', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M48 40l32-22 32 22v30H48z' }, 'cream'),
    s('path', { d: 'M48 40l32-22 32 22', ...SW(4) }, 'red', { stroke: true }),
    s('rect', { x: 48, y: 74, width: 64, height: 44 }, 'gray', { accent: true }),
    s('path', { d: 'M56 118V96h18M86 84h20v12', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[24, 120], [130, 128], [36, 92], [136, 86]], 4) }, 'tan')
  ],
  tentativa: [
    ground(),
    s('path', { d: 'M52 134l20-4M64 134l8-6', ...SW(5) }, 'dark', { stroke: true }),
    ...person(66, 130, 'green', { accent: true }),
    s('path', { d: 'M74 80l12-34', ...SW(7) }, 'green', { stroke: true }),
    s('path', { d: star(112, 30, 14) }, 'yellow'),
    s('path', { d: 'M90 40l8-4', ...DASH(3, '3 4') }, 'gray', { stroke: true })
  ],
  tripulante: [
    s('path', { d: 'M108 54v80M70 94h76M81 67l54 54M81 121l54-54', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: ring(108, 94, 26), ...SW(8) }, 'brown', { stroke: true }),
    ...person(48, 136, 'navy', { accent: true }),
    s('path', { d: 'M34 68h28v-8q-14-6-28 0z' }, 'white'),
    s('path', { d: 'M34 68h28', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 94l8 8 8-8', ...SW(4) }, 'white', { stroke: true })
  ],
  unitario: [
    arrow('M22 34l28 28M22 126l28-28M138 34l-28 28M138 126l-28-28', 'gray', 4),
    s('path', { d: dots([[22, 34], [22, 126], [138, 34], [138, 126]], 9) }, 'sky'),
    s('circle', { cx: 80, cy: 80, r: 30 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'white')
  ],
  vertebral: [
    s('path', { d: 'M80 16q14 64-4 128', ...SW(6) }, 'pink', { stroke: true }),
    s('path', { d: rects([[66, 18, 28, 12], [68, 34, 28, 12], [70, 50, 28, 12], [70, 66, 30, 12], [70, 82, 30, 12], [68, 98, 30, 12], [66, 114, 28, 12]]) }, 'cream', { accent: true }),
    s('path', { d: 'M60 24h12M62 40h12M64 56h12M64 72h12M64 88h12M62 104h12M60 120h12M88 24h14M90 40h14M92 56h14M94 72h14M94 88h14M92 104h14M88 120h14', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M74 130l4 14 4-14z' }, 'tan')
  ],
  'vértigo': [
    s('path', { d: 'M14 136V96h50l10 40z' }, 'gray'),
    s('path', { d: 'M36 146q0-24 34-24t34 24z' }, 'green'),
    s('circle', { cx: 70, cy: 80, r: 34 }, 'skin', { accent: true }),
    s('path', { d: spiral(54, 74) + spiral(80, 74), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 98q6-4 12 0t12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 34q30-20 60 0M110 60q20 12 30 0', ...SW(4) }, 'purple', { stroke: true }),
    s('path', { d: star(120, 30, 6) + star(30, 50, 5) }, 'yellow')
  ],
  'ático': [
    ground(),
    s('rect', { x: 34, y: 74, width: 92, height: 62 }, 'cream'),
    s('path', { d: 'M24 78l56-54 56 54z' }, 'red'),
    s('circle', { cx: 80, cy: 56, r: 12 }, 'yellow', { accent: true }),
    s('path', { d: 'M80 44v24M68 56h24', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: rects([[44, 86, 20, 18], [96, 86, 20, 18]]) }, 'sky'),
    s('rect', { x: 70, y: 106, width: 20, height: 30 }, 'brown')
  ],
  'acústica': [
    s('path', { d: 'M120 46q-26-8-32 20q-2 12 6 20q8 10 2 22q-4 12 10 16q18 4 22-14q10-4 8-28q0-28-16-36z' }, 'skin', { accent: true }),
    s('path', { d: 'M114 62q-12 2-10 16q8 6 4 14', ...SW(4) }, 'tan', { stroke: true }),
    s('rect', { x: 18, y: 58, width: 22, height: 44, rx: 4 }, 'dark'),
    s('path', { d: 'M40 60l20-16v72l-20-16z' }, 'dark'),
    s('path', { d: 'M68 64q8 16 0 32M78 56q14 24 0 48', ...SW(4) }, 'blue', { stroke: true })
  ],
  admirador: [
    ground(),
    ...person(48, 136, 'blue'),
    s('path', { d: heart(43, 72, 4) + heart(55, 72, 4) }, 'red'),
    s('path', { d: 'M60 100l18-30', ...SW(7) }, 'blue', { stroke: true }),
    s('path', { d: 'M80 50h24v24H80z', transform: 'rotate(10 92 62)' }, 'pink'),
    s('path', { d: heart(92, 58, 8), transform: 'rotate(10 92 62)' }, 'white'),
    s('path', { d: star(124, 40, 18) }, 'yellow', { accent: true })
  ],
  'agüero': [
    s('rect', { x: 14, y: 14, width: 132, height: 122, rx: 12 }, 'purple'),
    s('circle', { cx: 112, cy: 42, r: 18 }, 'cream'),
    s('path', { d: 'M14 108h132', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: 'M46 106q-6-30 20-40q4-14 18-12l14 4-12 4q2 20-10 34l-6 10z' }, 'black', { accent: true }),
    s('path', { d: 'M48 98l-22 10 18-16z' }, 'black'),
    s('circle', { cx: 86, cy: 58, r: 2 }, 'yellow'),
    s('path', { d: 'M60 106v8M70 106v8', ...SW(3) }, 'orange', { stroke: true })
  ],
  'alcohólico': [
    s('path', { d: 'M40 136V70q0-12 10-18V22h20v30q10 6 10 18v66z' }, 'green', { accent: true }),
    s('rect', { x: 46, y: 80, width: 28, height: 30 }, 'cream'),
    s('rect', { x: 50, y: 16, width: 20, height: 8 }, 'red'),
    s('path', { d: 'M96 76h40q0 30-20 32q-20-2-20-32z' }, 'red'),
    s('path', { d: 'M96 60h40q0 48-20 50q-20-2-20-50zM116 110v24M104 136h24', ...SW(3) }, 'gray', { stroke: true })
  ],
  'anexión': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M20 50q20-24 48-14q24-10 30 16q10 22-6 40q-6 26-34 24q-28 4-36-22q-12-24-2-44z' }, 'green'),
    s('path', { d: 'M112 72q14-12 28 0q8 14-4 26q-14 8-26-2q-8-12 2-24z' }, 'yellow', { accent: true }),
    s('path', { d: 'M96 84q4-8 12-6', ...DASH(3, '4 4') }, 'dark', { stroke: true }),
    arrow('M126 124q-30 14-56-4m10-2-10 2 4 10', 'red', 5)
  ],
  'apostólico': [
    s('path', { d: 'M40 120L110 44M50 40l70 76', ...SW(8) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: ring(34, 126, 10) + ring(126, 122, 10), ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M104 50l10 10M98 56l8 8M56 46l-10 10M62 52l-8 8', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 30l8-10 8 10-8 10z' }, 'red')
  ],
  astro: [
    s('rect', { x: 14, y: 14, width: 132, height: 122, rx: 12 }, 'navy'),
    s('circle', { cx: 80, cy: 76, r: 30 }, 'orange', { accent: true }),
    s('ellipse', { cx: 80, cy: 76, rx: 56, ry: 14, transform: 'rotate(-18 80 76)', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: star(32, 34, 6) + star(128, 120, 7) + star(124, 34, 4) + star(36, 118, 4) }, 'cream')
  ],
  atropello: [
    s('rect', { x: 14, y: 126, width: 132, height: 10 }, 'dark'),
    ...car(18, 98, 'red', 'sky', { accent: true }),
    s('path', { d: burst(86, 96, 16, 8, 8) }, 'yellow'),
    ...lean(110, 126, 24, 'blue'),
  ],
  bancada: [
    s('path', { d: seats(56, 7).map(([x, y]) => `M${x - 9} ${y + 12}v-6a9 9 0 0 1 18 0v6z`).join('') + seats(32, 5).map(([x, y]) => `M${x - 9} ${y + 12}v-6a9 9 0 0 1 18 0v6z`).join('') }, 'gray'),
    s('path', { d: seats(56, 7).slice(0, 4).map(([x, y]) => `M${x - 9} ${y + 12}v-6a9 9 0 0 1 18 0v6z`).join('') + seats(32, 5).slice(0, 3).map(([x, y]) => `M${x - 9} ${y + 12}v-6a9 9 0 0 1 18 0v6z`).join('') }, 'blue', { accent: true }),
    s('path', { d: dots(seats(56, 7).slice(0, 4).map(([x, y]) => [x, y - 8]).concat(seats(32, 5).slice(0, 3).map(([x, y]) => [x, y - 8])), 6) }, 'skin'),
    s('rect', { x: 66, y: 112, width: 28, height: 22, rx: 3 }, 'brown')
  ],
  basurero: [
    s('path', { d: 'M40 56h80l-8 80H48z' }, 'green', { accent: true }),
    s('path', { d: 'M62 68v56M80 68v56M98 68v56', ...SW(4) }, 'mint', { stroke: true }),
    s('rect', { x: 32, y: 42, width: 96, height: 14, rx: 4 }, 'dark'),
    s('path', { d: 'M68 42v-8h24v8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 42l6-14 10 6zM104 40l10-14 6 12z' }, 'tan'),
    ground(138)
  ],
  batir: [
    s('path', { d: 'M24 86h112q0 50-56 50T24 86z' }, 'blue', { accent: true }),
    s('ellipse', { cx: 80, cy: 86, rx: 56, ry: 10 }, 'yellow'),
    s('path', { d: 'M114 20l-30 54', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M84 74q-22 6-14 20q12 8 24-6M84 74q-10-6-22 8q4 14 20 6M84 74q6 14-6 22', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 76q6-6 10 0M110 76q6-6 10 0', ...SW(3) }, 'cream', { stroke: true })
  ],
  blanqueo: [
    s('rect', { x: 28, y: 18, width: 104, height: 124, rx: 10 }, 'white'),
    outline({ x: 28, y: 18, width: 104, height: 124, rx: 10 }),
    s('path', { d: 'M28 40h104', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 88, r: 36 }, 'sky'),
    s('path', { d: rects([[58, 74, 44, 26]]), transform: 'rotate(-20 80 88)' }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 88, r: 7, transform: 'rotate(-20 80 88)' }, 'mint'),
    s('path', { d: ring(80, 88, 36), ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: dots([[100, 66], [62, 110], [108, 104]], 5) }, 'white')
  ],
  'botánico': [
    s('path', { d: 'M40 106h48l-6 32H46z' }, 'orange'),
    s('path', { d: 'M64 106V64', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(64, 80, -150, 36, 12) + leaflet(64, 70, -30, 36, 12) + leaflet(64, 64, -90, 30, 10) }, 'green'),
    s('path', { d: ring(104, 60, 22), ...SW(7) }, 'dark', { stroke: true }),
    s('circle', { cx: 104, cy: 60, r: 18 }, 'sky', { accent: true }),
    s('path', { d: 'M120 76l20 20', ...SW(9) }, 'dark', { stroke: true })
  ],
};
