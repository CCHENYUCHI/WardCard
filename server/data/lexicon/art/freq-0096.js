// Illustration specs for words still undrawn in batches 0094–0096 (see server/scripts/lexicon/art.js)
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
  follaje: [
    s('path', { d: 'M80 148v-30', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: ells([[80, 72, 62, 50]]) }, 'green'),
    s('path', { d: leaflet(40, 60, -30, 26, 8) + leaflet(70, 40, -60, 26, 8) + leaflet(104, 44, -110, 26, 8) + leaflet(118, 80, 200, 26, 8) + leaflet(52, 96, 20, 26, 8) + leaflet(90, 104, -20, 24, 8) }, 'mint', { accent: true }),
    s('path', { d: leaflet(26, 82, -10, 20, 6) + leaflet(134, 60, 210, 20, 6) + leaflet(80, 70, -80, 22, 7) }, 'yellow')
  ],
  forastero: [
    ground(),
    s('path', { d: 'M18 136V60h12v76M54 136V60h12v76M14 60h56v-12H14z' }, 'brown'),
    s('path', { d: 'M30 72h24M30 100h24', ...SW(4) }, 'tan', { stroke: true }),
    ...person(108, 136, 'orange', { h: 46, w: 28, r: 12, accent: true }),
    s('path', { d: 'M124 100l14-56', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 138, cy: 44, r: 10 }, 'red')
  ],
  'fortificación': [
    ground(),
    s('path', { d: 'M18 136V54h14v10h12V54h14v10h12V54h20v10h12V54h14v10h12V54h14v82z' }, 'gray', { accent: true }),
    s('path', { d: 'M64 136v-30a16 16 0 0 1 32 0v30z' }, 'dark'),
    s('path', { d: rects([[30, 80, 10, 16], [120, 80, 10, 16]]) }, 'dark'),
    s('path', { d: 'M80 54V22', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 22h24l-6 7 6 7H82z' }, 'red')
  ],
  fresno: [
    ground(),
    s('path', { d: 'M76 136V60M76 96L52 72M76 84l26-22', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: ells([[78, 54, 46, 34], [44, 80, 22, 18], [114, 76, 22, 18]]) }, 'green', { accent: true }),
    s('path', { d: 'M128 116v-26', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(128, 90, 200, 12, 4) + leaflet(128, 98, 200, 12, 4) + leaflet(128, 90, -20, 12, 4) + leaflet(128, 98, -20, 12, 4) + leaflet(128, 90, -90, 12, 4) }, 'mint')
  ],
  fundir: [
    s('path', { d: 'M30 30l40 0l-4 34q-14 10-30 0z', transform: 'rotate(35 50 46)' }, 'gray'),
    s('path', { d: 'M76 62q10 10 8 40', ...SW(8) }, 'orange', { stroke: true, accent: true }),
    s('rect', { x: 40, y: 104, width: 90, height: 34, rx: 4 }, 'dark'),
    s('rect', { x: 52, y: 108, width: 66, height: 14, rx: 3 }, 'orange'),
    s('path', { d: 'M110 70q6-10 0-18M124 80q6-10 0-18', ...SW(4) }, 'red', { stroke: true })
  ],
  futurista: [
    backdrop('navy'),
    s('path', { d: 'M54 136q4-60 26-104q22 44 26 104z' }, 'white', { accent: true }),
    s('ellipse', { cx: 80, cy: 82, rx: 56, ry: 12, ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: 'M24 136q10-30 26-30t16 30zM96 136q10-40 30-40v40z' }, 'purple'),
    s('circle', { cx: 80, cy: 60, r: 7 }, 'sky'),
    s('path', { d: sparkle(30, 34, 7) + sparkle(130, 40, 6) }, 'yellow')
  ],
  'galpón': [
    ground(),
    s('path', { d: 'M18 136V78q62-56 124 0v58z' }, 'gray', { accent: true }),
    s('path', { d: 'M30 74q50-42 100 0', ...SW(3) }, 'white', { stroke: true }),
    s('rect', { x: 54, y: 92, width: 52, height: 44 }, 'dark'),
    s('path', { d: 'M54 92l52 44M106 92l-52 44', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M30 112h14v24H30zM116 112h14v24h-14z' }, 'yellow')
  ],
  glosario: [
    ...paper(30, 16, 100, 128),
    s('path', { d: rects([[42, 32, 22, 8], [42, 56, 18, 8], [42, 80, 26, 8], [42, 104, 20, 8]]) }, 'blue', { accent: true }),
    s('path', { d: 'M74 36h44M70 60h46M76 84h40M72 108h44M42 124h76', ...SW(3) }, 'gray', { stroke: true })
  ],
  hipo: [
    ...face(70, 82, 40, 'yellow', 'flat'),
    s('path', { d: dots([[122, 54], [134, 36], [128, 74]], 6) }, 'sky', { accent: true }),
    s('path', { d: 'M24 48l10 6M18 70h12M112 106l10 6', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M46 52q8-6 14 0M80 52q8-6 14 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  hispanoamericano: [
    s('circle', { cx: 80, cy: 80, r: 66 }, 'sky'),
    s('path', { d: 'M46 28q20-6 30 8q-4 14 8 20q10 10 2 22q14 8 22 22q-6 14-16 26q-8 12-12 16q-4-10-2-24q-12-10-14-24q-10-8-10-20q-16-4-20-20q2-14 12-26z' }, 'green', { accent: true }),
    s('path', { d: 'M52 34q12-2 20 6M88 104q4 10-4 20', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: ring(80, 80, 66), ...SW(3) }, 'blue', { stroke: true })
  ],
  'horóscopo': [
    s('circle', { cx: 80, cy: 80, r: 64 }, 'navy'),
    s('path', { d: rays(80, 80, 30, 64, 12, 15), ...SW(2) }, 'sky', { stroke: true }),
    s('path', { d: ring(80, 80, 30) + ring(80, 80, 52), ...SW(2) }, 'sky', { stroke: true }),
    s('path', { d: star(80, 80, 20) }, 'yellow', { accent: true }),
    s('path', { d: dots(around(80, 80, 58, 12, 0), 3) }, 'yellow')
  ],
  impronta: [
    s('rect', { x: 18, y: 40, width: 124, height: 96, rx: 14 }, 'tan'),
    s('path', { d: 'M62 124q-18-4-16-30q2-18 18-20q18 0 20 18q0 30-22 32z' }, 'brown', { accent: true }),
    s('path', { d: dots([[54, 64], [66, 58], [78, 60], [88, 66], [94, 76]], 5) }, 'brown'),
    s('path', { d: 'M106 52q16 10 22 28M110 112q12-6 18-18', ...SW(3) }, 'brown', { stroke: true })
  ],
  imprudencia: [
    s('rect', { x: 14, y: 96, width: 132, height: 40 }, 'dark'),
    s('path', { d: 'M24 116h20M64 116h20M104 116h20', ...SW(4) }, 'white', { stroke: true }),
    ...car(84, 102, 'red'),
    ...lean(54, 120, 20, 'blue', { h: 34, w: 22, r: 10, accent: true }),
    s('rect', { x: 52, y: 70, width: 10, height: 16, rx: 2, transform: 'rotate(20 54 120)' }, 'black'),
    s('path', { d: 'M128 60l8-10M140 72h8', ...SW(4) }, 'orange', { stroke: true })
  ],
  inigualable: [
    s('rect', { x: 46, y: 116, width: 68, height: 24, rx: 3 }, 'brown'),
    s('path', { d: 'M54 30h52v24q0 30-26 34q-26-4-26-34z' }, 'yellow', { accent: true }),
    s('path', { d: 'M54 40q-22 0-16 18t20 10M106 40q22 0 16 18t-20 10', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M74 88h12v14h10v14H64v-14h10z' }, 'orange'),
    s('path', { d: star(80, 54, 13) }, 'white'),
    s('path', { d: sparkle(28, 30, 8) + sparkle(132, 26, 8) }, 'orange')
  ],
  'intermediación': [
    ...person(30, 128, 'blue', { h: 40, w: 26, r: 11 }),
    ...person(130, 128, 'red', { h: 40, w: 26, r: 11 }),
    ...person(80, 112, 'green', { h: 44, w: 28, r: 12, accent: true }),
    arrow('M46 96h16M114 96H98', 'orange', 5),
    s('path', { d: 'M54 90l8 6-8 6M106 90l-8 6 8 6', ...SW(5) }, 'orange', { stroke: true }),
    ground(140)
  ],
  justicialista: [
    s('path', { d: 'M80 24v80M36 42h88', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M36 42l-14 34M36 42l14 34M124 42l-14 34M124 42l14 34', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 76h36q-4 14-18 14t-18-14zM106 76h36q-4 14-18 14t-18-14z' }, 'yellow', { accent: true }),
    s('path', { d: busts([30, 56, 80, 104, 130], 140, 22, 30) }, 'sky'),
    s('path', { d: dots([[30, 104], [56, 104], [80, 104], [104, 104], [130, 104]], 9) }, 'skin')
  ],
  'lingüista': [
    ...person(46, 136, 'navy', { h: 48, w: 30, r: 13 }),
    s('path', { d: bubble(76, 18, 46, 32) }, 'sky', { accent: true }),
    s('path', { d: bubble(98, 64, 46, 32) }, 'pink'),
    s('path', { d: 'M86 32h26M108 78h26', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: ring(30, 104, 9), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M37 111l8 8', ...SW(4) }, 'dark', { stroke: true })
  ],
  lubricante: [
    ...gear(104, 108, 22, 10, 'gray'),
    s('path', { d: 'M24 56q0-14 18-14h18q14 0 14 14v20H24z' }, 'red', { accent: true }),
    s('path', { d: 'M70 50l34 18', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: drop(104, 84, 4) }, 'yellow'),
    s('path', { d: 'M30 42q4-14 20-14', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 104, cy: 108, r: 7 }, 'dark')
  ],
  majo: [
    ...person(62, 136, 'green', { h: 48, w: 30, r: 14 }),
    s('path', { d: 'M56 64q6 6 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[56, 56], [68, 56]], 2) }, 'dark'),
    s('path', { d: heart(110, 70, 22) }, 'pink', { accent: true }),
    s('path', { d: 'M78 104l22-16', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(130, 30, 7) }, 'yellow')
  ],
  manchar: [
    s('path', { d: 'M52 26l-34 22 12 22 14-8v74h72V62l14 8 12-22-34-22q-8 10-28 10t-28-10z' }, 'white'),
    s('path', { d: 'M52 26l-34 22 12 22 14-8v74h72V62l14 8 12-22-34-22q-8 10-28 10t-28-10z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 78q10-10 18 0q12-4 10 10q8 8-2 14q-2 12-14 6q-10 6-14-6q-12-6-4-14q-4-12 6-10z' }, 'red', { accent: true }),
    s('path', { d: dots([[110, 84], [64, 112]], 4) }, 'red')
  ],
  'maná': [
    backdrop('sky'),
    s('path', { d: 'M14 120q40-14 70-4t62-6v30H14z' }, 'tan'),
    s('path', { d: ells([[56, 30, 26, 14], [84, 24, 24, 16], [108, 32, 22, 12]]) }, 'gray'),
    s('path', { d: dots([[50, 58], [72, 52], [96, 56], [116, 60], [62, 80], [88, 78], [108, 88], [78, 100]], 5) }, 'white', { accent: true }),
    s('path', { d: 'M64 110h40l-6 18H70z' }, 'brown'),
    s('path', { d: halfRays(84, 40, 36, 44, 5), ...SW(3) }, 'yellow', { stroke: true })
  ],
  mascar: [
    s('path', { d: 'M38 24h84v66q0 46-42 46t-42-46z' }, 'skin'),
    s('path', { d: dots([[62, 58], [98, 58]], 4) }, 'dark'),
    s('ellipse', { cx: 108, cy: 98, rx: 12, ry: 9 }, 'pink', { accent: true }),
    s('path', { d: 'M60 110q16 10 32 0', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M22 100l-8 6M24 116l-8 2M138 116l8 2', ...SW(3) }, 'gray', { stroke: true })
  ],
  menospreciar: [
    ground(),
    ...person(54, 136, 'purple', { h: 70, w: 34, r: 15, accent: true }),
    ...person(118, 136, 'sky', { h: 26, w: 20, r: 9 }),
    s('path', { d: 'M48 44h14', ...SW(3) }, 'dark', { stroke: true }),
    arrow('M78 56q30 0 36 30', 'gray', 4),
    arrow('M106 80l8 8 6-10', 'gray', 4)
  ],
  momo: [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'yellow'),
    s('path', { d: spiral(54, 66) + spiral(98, 66), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 100q24 14 48 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M72 104h16v16a8 8 0 0 1-16 0z' }, 'red', { accent: true }),
    s('path', { d: 'M24 64l-10-6M136 64l10-6', ...SW(8) }, 'skin', { stroke: true })
  ],
  'monotonía': [
    s('rect', { x: 14, y: 22, width: 132, height: 64, rx: 8 }, 'dark'),
    s('path', { d: 'M22 54h116', ...SW(4) }, 'mint', { stroke: true, accent: true }),
    ...face(80, 118, 22, 'gray', 'flat'),
    s('path', { d: 'M68 112h8M84 112h8', ...SW(3) }, 'dark', { stroke: true })
  ],
  montura: [
    s('path', { d: 'M28 70q8 18 52 18t52-18q4 36-52 36t-52-36z' }, 'brown', { accent: true }),
    s('path', { d: 'M28 70q-6-20 8-24q10 22 44 22t44-22q14 4 8 24', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M62 98v28M98 98v28', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 126h16v8H54zM90 126h16v8H90z' }, 'gray'),
    s('path', { d: 'M40 106q40 16 80 0', ...SW(4) }, 'tan', { stroke: true })
  ],
  'monárquico': [
    s('path', { d: 'M40 66v70h80V66' }, 'red'),
    s('path', { d: 'M28 136h104', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M38 58l8-38 20 22 14-26 14 26 20-22 8 38z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[46, 20], [80, 16], [114, 20]], 5) }, 'yellow'),
    s('path', { d: dots([[60, 50], [80, 48], [100, 50]], 4) }, 'blue'),
    s('rect', { x: 50, y: 82, width: 60, height: 54, rx: 6 }, 'purple')
  ],
  morador: [
    ground(),
    s('path', { d: 'M24 136V70l44-34 44 34v66z' }, 'cream'),
    s('path', { d: 'M16 74l52-42 52 42', ...SW(8) }, 'red', { stroke: true }),
    s('rect', { x: 34, y: 96, width: 22, height: 40 }, 'brown'),
    s('rect', { x: 74, y: 84, width: 22, height: 18 }, 'sky'),
    ...person(126, 136, 'green', { h: 42, w: 26, r: 11, accent: true })
  ],
  mucosa: [
    s('path', { d: 'M54 18q-12 60-28 84q-10 16 4 28h46q10-8 8-20q-4-30-8-92z' }, 'skin'),
    s('path', { d: 'M54 18q-12 60-28 84q-10 16 4 28h46q10-8 8-20q-4-30-8-92', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M62 40q-6 44-26 70q6 10 34 8q-4-40-8-78z' }, 'pink', { accent: true }),
    s('path', { d: drop(72, 130, 5) + drop(112, 70, 7) + drop(128, 100, 5) }, 'mint')
  ],
  otaku: [
    s('rect', { x: 24, y: 24, width: 112, height: 72, rx: 6 }, 'dark'),
    s('rect', { x: 30, y: 30, width: 100, height: 60, rx: 3 }, 'pink'),
    s('path', { d: 'M68 54a8 10 0 1 0 0.1 0M92 54a8 10 0 1 0 0.1 0' }, 'navy', { accent: true }),
    s('path', { d: sparkle(68, 50, 4) + sparkle(92, 50, 4) + sparkle(116, 40, 5) }, 'white'),
    s('path', { d: busts([80], 148, 44, 34) }, 'orange'),
    s('circle', { cx: 80, cy: 106, r: 14 }, 'brown'),
    s('path', { d: 'M62 108a18 18 0 0 1 36 0', ...SW(5) }, 'red', { stroke: true })
  ],
  partitura: [
    ...paper(20, 22, 120, 116),
    s('path', { d: 'M30 44h100M30 52h100M30 60h100M30 68h100M30 92h100M30 100h100M30 108h100M30 116h100', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: ells([[50, 64, 6, 5], [76, 56, 6, 5], [102, 60, 6, 5], [58, 112, 6, 5], [96, 104, 6, 5]]) }, 'dark', { accent: true }),
    s('path', { d: 'M55 64V38M81 56V32M107 60V36M63 112V88M101 104V80', ...SW(3) }, 'dark', { stroke: true })
  ],
  patrullero: [
    ground(132),
    s('path', { d: 'M44 82l12-22h48l12 22z' }, 'sky'),
    s('rect', { x: 18, y: 80, width: 124, height: 36, rx: 10 }, 'white'),
    s('path', { d: 'M18 98h124', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M18 90q0-10 10-10h104q10 0 10 10v16q0 10-10 10H28q-10 0-10-10z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: rects([[66, 50, 14, 10]]) }, 'red'),
    s('path', { d: rects([[80, 50, 14, 10]]) }, 'blue'),
    s('path', { d: dots([[46, 118], [114, 118]], 12) }, 'dark')
  ],
  persiana: [
    s('rect', { x: 24, y: 18, width: 112, height: 124, rx: 4 }, 'brown'),
    s('rect', { x: 32, y: 26, width: 96, height: 108 }, 'sky'),
    s('path', { d: rects([[32, 26, 96, 10], [32, 40, 96, 10], [32, 54, 96, 10], [32, 68, 96, 10], [32, 82, 96, 10]]) }, 'cream', { accent: true }),
    s('path', { d: 'M120 26v92', ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 120, cy: 120, r: 4 }, 'gray')
  ],
  perturbar: [
    s('path', { d: 'M20 132v-10q0-26 26-26h28q26 0 26 26v10z' }, 'purple'),
    ...face(60, 70, 26, 'skin', 'frown'),
    s('path', { d: 'M86 30q30-20 40 4t-24 18q-26-6-6-24q20-10 34 4q14 18-10 26', ...SW(4) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: 'M126 66l14-6M124 82l16 4', ...SW(4) }, 'red', { stroke: true })
  ],
  posteridad: [
    ground(),
    ...person(32, 136, 'gray', { h: 52, w: 26, r: 12 }),
    ...person(76, 136, 'blue', { h: 40, w: 24, r: 11 }),
    ...person(116, 136, 'yellow', { h: 26, w: 20, r: 9, accent: true }),
    arrow('M30 40h96M118 32l10 8-10 8', 'orange', 5),
    s('path', { d: 'M144 120a4 4 0 1 0 0.1 0' }, 'pink')
  ],
  'predicación': [
    s('path', { d: 'M30 82h60l-6 54H36z' }, 'brown', { accent: true }),
    s('path', { d: 'M48 82V60q0-10 12-10q12 0 12 10v22' }, 'dark'),
    s('circle', { cx: 60, cy: 36, r: 12 }, 'skin'),
    s('path', { d: 'M70 60l18-28', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: busts([110, 136], 140, 22, 30) }, 'sky'),
    s('path', { d: dots([[110, 104], [136, 104]], 9) }, 'skin'),
    s('path', { d: 'M26 82h68', ...SW(4) }, 'tan', { stroke: true })
  ],
  previsional: [
    s('path', { d: 'M16 70q64-70 128 0z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 70v58q0 10-10 10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: ells([[54, 124, 18, 6], [54, 114, 18, 6], [54, 104, 18, 6]]) }, 'yellow'),
    s('path', { d: ells([[110, 124, 18, 6], [110, 114, 18, 6]]) }, 'orange'),
    s('path', { d: 'M16 70q16-10 32 0q16-10 32 0q16-10 32 0q16-10 32 0', ...SW(3) }, 'navy', { stroke: true })
  ],
  'prolífico': [
    ...person(42, 136, 'green', { h: 46, w: 28, r: 12 }),
    s('path', { d: rects([[84, 120, 56, 16], [88, 104, 50, 16], [82, 88, 56, 16], [86, 72, 52, 16], [84, 56, 54, 16]]) }, 'red', { accent: true }),
    s('path', { d: 'M84 120h56M88 104h50M82 88h56M86 72h52', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: rects([[88, 40, 50, 16], [84, 24, 54, 16]]) }, 'blue'),
    s('path', { d: 'M88 40h50', ...SW(3) }, 'white', { stroke: true })
  ],
  prospecto: [
    s('rect', { x: 18, y: 66, width: 54, height: 70, rx: 4 }, 'white'),
    s('path', { d: 'M18 70q0-4 4-4h46q4 0 4 4v66H18z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 84h14v10h10v14H52v10H38v-10H28V94h10z' }, 'red', { accent: true }),
    s('path', { d: 'M84 22l52 10-12 106-52-10z' }, 'cream'),
    s('path', { d: 'M84 22l52 10-12 106-52-10zM98 32l-4 102M116 36l-6 100M88 48l40 8M86 66l40 8M84 84l40 8M82 102l40 8', ...SW(2) }, 'gray', { stroke: true })
  ],
  reabrir: [
    s('rect', { x: 30, y: 30, width: 70, height: 106 }, 'dark'),
    s('path', { d: 'M30 30l40 12v106l-40-12z' }, 'brown'),
    s('circle', { cx: 62, cy: 92, r: 4 }, 'yellow'),
    s('path', { d: 'M116 70a22 22 0 1 1-6-16', ...SW(6) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M114 40l-2 16 16 0z' }, 'green'),
    ground()
  ],
  reconfortante: [
    s('path', { d: 'M22 84h116q-4 46-58 46t-58-46z' }, 'orange', { accent: true }),
    s('path', { d: 'M14 84h132', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M60 132h40', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M54 72q-8-12 0-22t0-22M106 72q-8-12 0-22t0-22', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: heart(80, 52, 16) }, 'pink')
  ],
  rehabilitar: [
    ground(),
    ...person(66, 136, 'blue', { h: 46, w: 28, r: 12 }),
    s('path', { d: 'M88 136l4-58h-8', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 46, y: 104, width: 14, height: 20, rx: 3 }, 'white'),
    s('path', { d: 'M46 104h14v20H46z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M118 120V42M106 54l12-12 12 12', ...SW(7) }, 'green', { stroke: true, accent: true })
  ],
  rejilla: [
    s('rect', { x: 18, y: 18, width: 124, height: 124, rx: 10 }, 'gray', { accent: true }),
    s('path', { d: grid(30, 30, 6, 6, 12, 12, 17, 17) }, 'dark'),
    s('path', { d: dots([[24, 24], [136, 24], [24, 136], [136, 136]], 3) }, 'white')
  ],
  'retransmisión': [
    s('rect', { x: 18, y: 52, width: 92, height: 70, rx: 6 }, 'dark'),
    s('rect', { x: 24, y: 58, width: 80, height: 58 }, 'green'),
    s('circle', { cx: 64, cy: 87, r: 14 }, 'white', { accent: true }),
    s('path', { d: 'M64 77l8 6-3 9h-10l-3-9z' }, 'dark'),
    s('path', { d: 'M46 122l-8 16M82 122l8 16', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M126 70V30M118 46q8-8 16 0M110 36q16-16 32 0', ...SW(4) }, 'red', { stroke: true })
  ],
  rodante: [
    ground(140),
    s('circle', { cx: 92, cy: 90, r: 46 }, 'dark'),
    s('circle', { cx: 92, cy: 90, r: 30 }, 'gray', { accent: true }),
    s('path', { d: rays(92, 90, 6, 30, 6, 20), ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 70h22M14 92h18M22 114h18', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: 'M54 40q-10 10-12 24', ...SW(4) }, 'orange', { stroke: true })
  ],
  sacerdotal: [
    s('path', { d: 'M34 148v-40q0-26 26-26h40q26 0 26 26v40z' }, 'black'),
    s('circle', { cx: 80, cy: 52, r: 24 }, 'skin'),
    s('rect', { x: 72, y: 80, width: 16, height: 10, rx: 2 }, 'white', { accent: true }),
    s('path', { d: 'M60 90v58M100 90v58', ...SW(8) }, 'purple', { stroke: true }),
    s('path', { d: 'M80 104v24M70 114h20', ...SW(4) }, 'yellow', { stroke: true })
  ],
  satisfactoriamente: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'green', { accent: true }),
    s('path', { d: 'M50 82l20 20 40-44', ...SW(14) }, 'white', { stroke: true }),
    s('path', { d: star(132, 28, 10) + star(26, 130, 8) }, 'yellow')
  ],
  seductor: [
    ...person(70, 140, 'red', { h: 52, w: 32, r: 16, accent: true }),
    s('path', { d: 'M60 72q4-4 8 0', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 78, cy: 70, r: 2.5 }, 'dark'),
    s('path', { d: 'M64 80q6 6 14 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: heart(118, 50, 14) + heart(132, 82, 9) + heart(104, 22, 8) }, 'pink'),
    s('path', { d: ells([[70, 54, 18, 8]]) }, 'brown')
  ],
  seleccionador: [
    ground(),
    s('path', { d: busts([90, 112, 134], 136, 18, 30) }, 'gray'),
    s('path', { d: dots([[90, 98], [134, 98]], 8) }, 'skin'),
    s('path', { d: dots([[112, 98]], 8) }, 'skin'),
    s('path', { d: busts([112], 136, 18, 30) }, 'red', { accent: true }),
    ...person(38, 136, 'navy', { h: 50, w: 28, r: 12 }),
    s('rect', { x: 46, y: 90, width: 20, height: 26, rx: 2 }, 'white'),
    arrow('M60 60q30-20 48 22', 'yellow', 4)
  ],
  simplista: [
    s('path', { d: 'M18 50q10-30 24-6t-12 20q-12-4 6-26q22-16 30 10t-16 14q-8-14 14-24q14 0 18 14', ...SW(4) }, 'gray', { stroke: true }),
    arrow('M64 80l16 10', 'orange', 6),
    s('path', { d: 'M74 94l10-2-4 10z' }, 'orange'),
    s('path', { d: 'M86 116h58', ...SW(8) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M18 126h40', ...SW(3, { 'stroke-dasharray': '4 6' }) }, 'gray', { stroke: true })
  ],
  sintetizar: [
    s('path', { d: dots([[24, 30], [24, 130]], 10) }, 'red'),
    s('path', { d: dots([[24, 80]], 10) }, 'blue'),
    s('path', { d: dots([[60, 22], [60, 138]], 8) }, 'yellow'),
    arrow('M36 36l52 36M36 80h48M36 124l52-36M64 32l26 34M64 128l26-34', 'gray', 4),
    s('circle', { cx: 112, cy: 80, r: 30 }, 'purple', { accent: true }),
    s('path', { d: sparkle(112, 80, 14) }, 'white')
  ],
  terco: [
    ground(),
    s('path', { d: 'M86 110v26M96 112v24M124 112v24M134 110v26', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: ells([[112, 98, 28, 16]]) + 'M88 92l-14-22 10-6 16 22z' }, 'gray', { accent: true }),
    s('path', { d: 'M76 70l-4-18 6 0zM84 64l2-18 6 4z' }, 'gray'),
    s('ellipse', { cx: 74, cy: 74, rx: 10, ry: 7 }, 'dark'),
    ...lean(30, 136, -22, 'orange', { h: 40, w: 22, r: 10 }),
    s('path', { d: 'M38 96L72 78', ...SW(3) }, 'brown', { stroke: true })
  ],
  tirante: [
    s('path', { d: 'M18 80h124', ...SW(6) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M14 70h22v20H14zM124 70h22v20h-22z' }, 'skin'),
    s('path', { d: 'M60 66l6-10M80 64V52M100 66l-6-10M60 94l6 10M80 96v12M100 94l-6 10', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M14 54l10 8M146 54l-10 8', ...SW(3) }, 'gray', { stroke: true })
  ],
  trepar: [
    s('path', { d: 'M86 14h60v132H86z' }, 'tan'),
    s('path', { d: ells([[100, 40, 6, 4], [124, 64, 6, 4], [102, 92, 6, 4], [130, 118, 6, 4], [112, 26, 5, 3]]) }, 'red'),
    ...lean(66, 120, 20, 'blue', { h: 40, w: 24, r: 11, accent: true }),
    s('path', { d: 'M80 66l18-24M70 112l30-16', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M14 146h70', ...SW(4) }, 'gray', { stroke: true })
  ],
  tropezar: [
    ground(),
    ...lean(70, 132, 50, 'green', { h: 40, w: 24, r: 11, accent: true }),
    s('path', { d: 'M62 134l-10-12', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M60 136q2-14 16-14t16 14z' }, 'gray'),
    s('path', { d: sparkle(130, 54, 8) + sparkle(116, 34, 6) }, 'yellow'),
    s('path', { d: 'M142 82l6 6M140 96h8', ...SW(3) }, 'orange', { stroke: true })
  ],
  'trópico': [
    s('path', { d: 'M14 128q66-16 132 0v18H14z' }, 'tan'),
    s('circle', { cx: 124, cy: 34, r: 16 }, 'yellow'),
    s('path', { d: 'M66 132q-4-50 14-80', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(80, 52, 200, 44, 10) + leaflet(80, 52, -30, 44, 10) + leaflet(80, 52, 160, 40, 9) + leaflet(80, 52, 20, 40, 9) + leaflet(80, 52, -100, 34, 8) }, 'green', { accent: true }),
    s('path', { d: dots([[76, 60], [86, 62]], 5) }, 'brown')
  ],
  'tácito': [
    ...face(44, 72, 28, 'skin', 'flat'),
    ...face(116, 72, 28, 'skin', 'flat'),
    s('path', { d: 'M56 98v-30', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M56 98v-30', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M62 118q18 18 36 0', ...DASH(4) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: heart(80, 132, 8) }, 'pink')
  ],
  veta: [
    s('path', { d: 'M20 116l10-56 34-30 46 6 30 40-8 50-50 10z' }, 'gray'),
    s('path', { d: 'M24 98q30-16 56-6t62-24', ...SW(9) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M40 60l20 10M100 116l14-8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(70, 90, 7) }, 'white')
  ],
  villancico: [
    s('path', { d: 'M120 26l24 44h-12l14 28h-52l14-28h-12z' }, 'green'),
    s('path', { d: star(120, 22, 8) }, 'yellow'),
    s('rect', { x: 114, y: 98, width: 12, height: 14 }, 'brown'),
    ...person(34, 136, 'red', { h: 42, w: 26, r: 11, accent: true }),
    ...person(76, 136, 'navy', { h: 46, w: 26, r: 11 }),
    ...note(54, 46, 'purple')
  ],
  visceral: [
    s('path', { d: 'M28 148v-60q0-32 52-32t52 32v60z' }, 'sky'),
    s('path', { d: 'M54 92q0-14 26-14t26 14q10 30-20 30q22 6 0 20q-30 4-34-14q0-14 18-12q-20-8-16-24z' }, 'pink', { accent: true }),
    s('path', { d: 'M88 22L74 44h14l-10 22', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M66 98q14 6 28 0M70 132q12-6 24 0', ...SW(3) }, 'red', { stroke: true })
  ],
  volatilidad: [
    s('rect', { x: 14, y: 20, width: 132, height: 120, rx: 8 }, 'cream'),
    s('path', { d: 'M24 100l16-50 14 64 16-74 14 70 14-46 14 56 16-80', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M24 128h112M24 128V30', ...SW(3) }, 'gray', { stroke: true })
  ],
  adictivo: [
    s('rect', { x: 52, y: 20, width: 56, height: 96, rx: 10 }, 'dark'),
    s('rect', { x: 58, y: 30, width: 44, height: 72, rx: 3 }, 'sky'),
    s('path', { d: heart(80, 70, 12) }, 'red', { accent: true }),
    s('path', { d: ells([[70, 124, 8, 5], [62, 134, 5, 8], [52, 142, 8, 5], [40, 142, 5, 8]]), ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M20 126h20v18H20z' }, 'skin')
  ],
  adoptivo: [
    ground(),
    ...person(52, 136, 'blue', { h: 54, w: 30, r: 13 }),
    ...person(110, 136, 'yellow', { h: 30, w: 22, r: 10 }),
    s('path', { d: 'M66 108q20 14 34 2', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: heart(82, 40, 16) }, 'pink', { accent: true }),
    s('path', { d: 'M26 36l4 4M138 36l-4 4', ...SW(3) }, 'gray', { stroke: true })
  ],
  aflojar: [
    s('path', { d: 'M54 66l14-24h24l14 24-14 24H68z' }, 'gray'),
    s('circle', { cx: 80, cy: 66, r: 10 }, 'dark'),
    s('path', { d: 'M90 84l40 52', ...SW(12) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M36 40a50 50 0 0 1 60-24', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M28 28l6 16 14-8z' }, 'orange')
  ],
  agrandar: [
    s('rect', { x: 18, y: 98, width: 30, height: 30, rx: 4 }, 'sky'),
    s('rect', { x: 72, y: 24, width: 70, height: 70, rx: 8 }, 'blue', { accent: true }),
    arrow('M48 98l26-26M58 72h16v16', 'orange', 6),
    s('path', { d: 'M18 98h30v30H18z', ...DASH(2, '4 4') }, 'gray', { stroke: true })
  ],
  'alfabético': [
    s('rect', { x: 18, y: 88, width: 36, height: 36, rx: 4 }, 'red', { accent: true }),
    s('rect', { x: 62, y: 88, width: 36, height: 36, rx: 4 }, 'yellow'),
    s('rect', { x: 106, y: 88, width: 36, height: 36, rx: 4 }, 'blue'),
    s('path', { d: dots([[36, 106]], 5) + dots([[74, 106], [86, 106]], 5) + dots([[114, 100], [124, 110], [134, 100]], 4) }, 'white'),
    arrow('M22 66h112M124 56l10 10-10 10', 'green', 5)
  ],
  alquimia: [
    s('path', { d: 'M66 20h28M70 20v34L36 120q-4 16 14 16h60q18 0 14-16L90 54V20', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 90h56l16 30q4 16-14 16H50q-18 0-14-16z' }, 'purple', { accent: true }),
    s('path', { d: dots([[64, 108], [92, 116], [80, 76]], 5) }, 'white'),
    s('circle', { cx: 124, cy: 46, r: 14 }, 'yellow'),
    s('path', { d: sparkle(124, 46, 8) + sparkle(36, 40, 8) }, 'orange')
  ],
  altibajo: [
    s('path', { d: 'M14 120q20-90 40-40t36 30q20-90 56-60', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M30 120v20M54 80v60M90 110v30M118 54v86', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 92, y: 74, width: 22, height: 14, rx: 4, transform: 'rotate(-40 103 81)' }, 'blue'),
    s('path', { d: 'M14 140h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  anorexia: [
    s('ellipse', { cx: 80, cy: 98, rx: 50, ry: 30 }, 'white'),
    s('path', { d: ells([[80, 98, 50, 30]]) + ells([[80, 98, 30, 17]]), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M20 76v52M14 76v16q0 8 6 8t6-8V76M140 76v52', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M140 76q10 10 0 26', ...SW(4) }, 'gray', { stroke: true }),
    ...face(80, 36, 20, 'yellow', 'frown', { accent: true })
  ],
  anzuelo: [
    s('path', { d: 'M80 14v12', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 26v76q0 26-24 26t-22-24l6-8', ...SW(7) }, 'gray', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 26, r: 6 }, 'gray'),
    s('path', { d: 'M36 92l-2 18 14-6z' }, 'gray'),
    s('path', { d: 'M86 60q22 4 14 22t20 20', ...SW(8) }, 'pink', { stroke: true })
  ],
  apacible: [
    s('rect', { x: 14, y: 20, width: 132, height: 120, rx: 12 }, 'cream'),
    s('path', { d: 'M14 96l36-36 30 26 24-22 42 32z' }, 'mint'),
    s('circle', { cx: 112, cy: 50, r: 14 }, 'orange'),
    s('path', { d: 'M14 96h132v32a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'sky', { accent: true }),
    s('path', { d: 'M38 112h30M90 124h34', ...SW(3) }, 'white', { stroke: true })
  ],
  apoderado: [
    ...person(54, 136, 'navy', { h: 52, w: 30, r: 13 }),
    ...paper(84, 34, 52, 70),
    s('path', { d: 'M94 50h32M94 62h32M94 74h20', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 120, cy: 92, r: 10 }, 'red', { accent: true }),
    s('rect', { x: 34, y: 112, width: 36, height: 26, rx: 4 }, 'brown')
  ],
  'apretón': [
    s('path', { d: 'M14 64h34l14 10v20H14z' }, 'blue'),
    s('path', { d: 'M146 64h-34l-14 10v20h48z' }, 'red'),
    s('path', { d: 'M48 70q16-10 30-4l34 4q8 4 2 12l-28 14q-8 6-16 0L52 92z' }, 'skin', { accent: true }),
    s('path', { d: 'M62 82l30 0M66 92l26-2M84 66v14', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M74 42l6 10M58 46l8 8M90 46l-6 8', ...SW(3) }, 'orange', { stroke: true })
  ],
  arre: [
    ...horse('brown', 'dark'),
    ...person(80, 74, 'red', { h: 30, w: 22, r: 10, accent: true }),
    s('path', { d: 'M88 54l20-30q10 10 0 22', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 70h14M14 88h10', ...SW(4) }, 'gray', { stroke: true })
  ],
  aspirina: [
    s('circle', { cx: 80, cy: 80, r: 64 }, 'sky'),
    s('circle', { cx: 66, cy: 92, r: 34 }, 'white', { accent: true }),
    s('path', { d: ring(66, 92, 34) + 'M66 60v64', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 112, cy: 52, r: 16 }, 'white'),
    s('path', { d: ring(112, 52, 16) + 'M100 52h24', ...SW(3) }, 'gray', { stroke: true })
  ],
  barroso: [
    s('path', { d: 'M14 110q40-12 70-2t62-4v42H14z' }, 'brown', { accent: true }),
    s('path', { d: ells([[48, 124, 22, 6], [110, 132, 18, 5]]) }, 'dark'),
    s('path', { d: 'M76 32q0-6 6-6h14q6 0 6 6v54l18 6q12 4 12 16v2H76z' }, 'yellow'),
    s('path', { d: 'M74 108h60M78 38h22', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[64, 100], [140, 98], [30, 102]], 4) }, 'brown'),
  ],
  bestial: [
    s('path', { d: burst(80, 82, 66, 52, 14) }, 'orange'),
    s('path', { d: 'M40 40l14 26 52 0 14-26-10 40q12 16 4 36q-14 18-34 18t-34-18q-8-20 4-36z' }, 'brown', { accent: true }),
    s('path', { d: 'M58 80l12 6M102 80l-12 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 108q18-10 36 0q-18 18-36 0z' }, 'dark'),
    s('path', { d: 'M66 106l4 8 4-6M94 106l-4 8-4-6', ...SW(2) }, 'white', { stroke: true })
  ],
  biomasa: [
    s('path', { d: 'M18 136q8-40 40-40q8-20 34-14q30 0 50 54z' }, 'green'),
    s('path', { d: 'M36 120l20-10M70 112l24 4M104 120l18-12', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(80, 70, -100, 44, 14) }, 'mint'),
    s('path', { d: 'M126 20l-16 28h14l-12 26', ...SW(6) }, 'yellow', { stroke: true, accent: true })
  ],
  bocha: [
    s('path', { d: 'M14 110h132v26H14z' }, 'mint'),
    s('circle', { cx: 44, cy: 96, r: 18 }, 'red', { accent: true }),
    s('circle', { cx: 112, cy: 98, r: 16 }, 'blue'),
    s('circle', { cx: 80, cy: 108, r: 6 }, 'white'),
    s('path', { d: ring(80, 108, 6), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 88q4-4 10-2M106 90q4-4 10-2', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M14 82h14M18 96h8', ...SW(3) }, 'gray', { stroke: true })
  ],
  bollo: [
    s('path', { d: 'M20 108q0-60 60-60t60 60q0 18-60 18t-60-18z' }, 'orange', { accent: true }),
    s('path', { d: 'M24 108q56 18 112 0', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M52 72q12-10 22-6M86 66q14-2 22 8', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[60, 86], [80, 78], [100, 88], [72, 98], [94, 100]], 2.5) }, 'cream')
  ],
  cachondo: [
    s('circle', { cx: 80, cy: 82, r: 50 }, 'yellow', { accent: true }),
    s('path', { d: 'M56 70q6-8 12 0M90 72h14', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 92q28 32 56 0z' }, 'dark'),
    s('path', { d: 'M68 108q12 6 24 0', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: rects([[22, 22, 6, 12], [130, 30, 6, 12], [140, 120, 6, 10]]) }, 'pink'),
    s('path', { d: dots([[30, 130], [130, 16]], 5) }, 'blue')
  ],
  calificativo: [
    s('rect', { x: 18, y: 64, width: 60, height: 62, rx: 6 }, 'brown'),
    s('path', { d: 'M78 82l18-4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 62l40-6 6 44-40 6-14-18z' }, 'yellow', { accent: true }),
    s('circle', { cx: 100, cy: 80, r: 4 }, 'white'),
    s('path', { d: star(118, 68, 7) + star(124, 88, 7) }, 'orange')
  ],
  camarilla: [
    s('rect', { x: 14, y: 28, width: 132, height: 112, rx: 8 }, 'purple'),
    s('path', { d: 'M58 22l6-14 10 8 6-10 6 10 10-8 6 14z' }, 'yellow', { accent: true }),
    s('path', { d: busts([48, 80, 112], 140, 28, 46) }, 'navy'),
    s('path', { d: dots([[52, 82], [80, 76], [108, 82]], 12) }, 'skin'),
    s('path', { d: 'M62 82h4M94 82h4', ...SW(3) }, 'dark', { stroke: true })
  ],
  canguro: [
    ground(),
    s('path', { d: 'M40 132q-20 6-26 0M60 136l18-4', ...SW(7) }, 'tan', { stroke: true }),
    s('path', { d: 'M28 128q2-30 14-30q4-20 30-30q20-4 26-30l10-10q6 0 4 10l8 4q-4 10-14 10q0 30-14 44q-4 20-30 34z' }, 'tan', { accent: true }),
    s('path', { d: 'M66 104q8 14 20 6', ...SW(3) }, 'brown', { stroke: true }),
    s('circle', { cx: 70, cy: 94, r: 7 }, 'brown'),
    s('path', { d: dots([[106, 36]], 2.5) }, 'dark')
  ],
  'canónigo': [
    s('path', { d: 'M24 112h112q-4 26-56 26t-56-26z' }, 'white'),
    s('path', { d: 'M24 112h112q-4 26-56 26t-56-26z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: leaflet(80, 100, -90, 50, 12) + leaflet(80, 100, -140, 50, 12) + leaflet(80, 100, -40, 50, 12) + leaflet(80, 100, 180, 44, 11) + leaflet(80, 100, 0, 44, 11) }, 'green', { accent: true }),
    s('path', { d: leaflet(80, 104, -115, 34, 9) + leaflet(80, 104, -65, 34, 9) }, 'mint')
  ],
  carlista: [
    ground(),
    s('rect', { x: 98, y: 98, width: 44, height: 38, rx: 6 }, 'red'),
    s('path', { d: 'M104 98l4-24 8 10 6-14 6 14 8-10 4 24z' }, 'yellow', { accent: true }),
    ...person(48, 136, 'navy', { h: 52, w: 30, r: 13 }),
    s('path', { d: 'M62 102l30-18', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M34 54q14-14 28 0z' }, 'red')
  ],
  'castaña': [
    s('path', { d: 'M80 22q-46 34-46 76q0 34 46 34t46-34q0-42-46-76z' }, 'brown', { accent: true }),
    s('path', { d: 'M34 98q0 34 46 34t46-34q-46 12-92 0z' }, 'tan'),
    s('path', { d: 'M66 50q-6 16 0 30', ...SW(5) }, 'orange', { stroke: true })
  ],
  celeridad: [
    s('circle', { cx: 96, cy: 88, r: 46 }, 'white'),
    s('path', { d: ring(96, 88, 46), ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M88 30h16M96 30v12', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 88V58M96 88l18 10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 70h26M18 90h18M14 110h24', ...SW(5) }, 'sky', { stroke: true })
  ],
  cerrojo: [
    s('rect', { x: 14, y: 24, width: 82, height: 116 }, 'brown'),
    s('rect', { x: 100, y: 24, width: 46, height: 116 }, 'tan'),
    s('rect', { x: 42, y: 70, width: 66, height: 20, rx: 4 }, 'gray', { accent: true }),
    s('rect', { x: 50, y: 64, width: 30, height: 32, rx: 3 }, 'dark'),
    s('path', { d: 'M66 90v16', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 104, y: 66, width: 16, height: 28, rx: 3 }, 'dark')
  ],
  ciberseguridad: [
    s('rect', { x: 26, y: 26, width: 108, height: 72, rx: 6 }, 'dark'),
    s('rect', { x: 32, y: 32, width: 96, height: 60 }, 'sky'),
    s('path', { d: 'M14 104h132l-10 16H24z' }, 'gray'),
    s('path', { d: 'M80 38l22 8v14q0 18-22 26q-22-8-22-26V46z' }, 'green', { accent: true }),
    s('rect', { x: 72, y: 58, width: 16, height: 14, rx: 2 }, 'white'),
    s('path', { d: 'M75 58v-4a5 5 0 0 1 10 0v4', ...SW(3) }, 'white', { stroke: true })
  ],
  clasista: [
    s('rect', { x: 18, y: 86, width: 62, height: 54 }, 'gray'),
    ...person(50, 86, 'purple', { h: 40, w: 26, r: 11, accent: true }),
    s('path', { d: 'M38 32h24v-14H42z' }, 'black'),
    s('path', { d: 'M34 32h32', ...SW(4) }, 'black', { stroke: true }),
    ...person(118, 140, 'tan', { h: 34, w: 24, r: 10 }),
    s('path', { d: 'M90 140V70', ...SW(5) }, 'red', { stroke: true })
  ],
  comercialmente: [
    s('path', { d: 'M22 64h116l-10-28H32z' }, 'red', { accent: true }),
    s('path', { d: 'M22 64h116', ...SW(4) }, 'white', { stroke: true }),
    s('rect', { x: 30, y: 64, width: 100, height: 72 }, 'cream'),
    s('rect', { x: 40, y: 78, width: 40, height: 30 }, 'sky'),
    s('rect', { x: 92, y: 84, width: 26, height: 52 }, 'brown'),
    s('path', { d: ells([[124, 132, 14, 5], [124, 122, 14, 5]]) }, 'yellow'),
    ground()
  ],
  condicionar: [
    ground(),
    s('path', { d: 'M24 136v-24M36 136v-22M66 136v-22M78 136v-24', ...SW(6) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 52, cy: 106, rx: 34, ry: 16 }, 'tan'),
    s('circle', { cx: 88, cy: 82, r: 16 }, 'tan'),
    s('path', { d: 'M80 70l-6 18 8-2', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: drop(98, 104, 3) }, 'sky'),
    s('path', { d: 'M110 70q0-26 18-26t18 26z' }, 'yellow', { accent: true }),
    s('path', { d: 'M106 70h44M128 44v-8M110 30l-6-6M146 30l6-6', ...SW(4) }, 'orange', { stroke: true })
  ],
  'conjugación': [
    s('rect', { x: 14, y: 62, width: 46, height: 36, rx: 6 }, 'blue', { accent: true }),
    s('path', { d: 'M60 80h14M74 80L96 34M74 80h22M74 80l22 46', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 96, y: 22, width: 46, height: 24, rx: 6 }, 'red'),
    s('rect', { x: 96, y: 68, width: 46, height: 24, rx: 6 }, 'green'),
    s('rect', { x: 96, y: 114, width: 46, height: 24, rx: 6 }, 'orange')
  ],
  consumismo: [
    s('path', { d: 'M14 40h18l14 66h80l10-46H38', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: rects([[48, 40, 26, 30], [80, 30, 22, 40]]) }, 'red'),
    s('path', { d: rects([[106, 44, 24, 26], [56, 20, 20, 20]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M44 70h86l-6 30H50z' }, 'sky'),
    s('path', { d: dots([[58, 124], [118, 124]], 10) }, 'dark'),
    s('path', { d: 'M86 36v-14q8-6 14 0', ...SW(3) }, 'purple', { stroke: true })
  ],
  contendiente: [
    s('path', { d: 'M14 60h132M14 84h132', ...SW(3) }, 'red', { stroke: true }),
    ...person(44, 136, 'blue', { h: 46, w: 28, r: 12 }),
    ...person(116, 136, 'red', { h: 46, w: 28, r: 12 }),
    s('circle', { cx: 66, cy: 88, r: 11 }, 'red', { accent: true }),
    s('circle', { cx: 94, cy: 88, r: 11 }, 'blue'),
    s('path', { d: 'M76 56l4-12 4 12', ...SW(3) }, 'orange', { stroke: true })
  ],
  cornisa: [
    s('rect', { x: 30, y: 66, width: 100, height: 80 }, 'cream'),
    s('path', { d: 'M18 36h124v12H18zM24 48h112l-6 10H30z' }, 'tan', { accent: true }),
    s('path', { d: dots([[32, 54], [48, 54], [64, 54], [80, 54], [96, 54], [112, 54], [128, 54]], 4) }, 'brown'),
    s('path', { d: 'M18 36h124v12H18z', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: grid(42, 80, 3, 2, 18, 22, 30, 32) }, 'sky'),
    s('rect', { x: 30, y: 58, width: 100, height: 8 }, 'gray')
  ],
  cripta: [
    s('path', { d: 'M14 14h132v26H14z' }, 'green'),
    s('path', { d: 'M14 40h132v106H14z' }, 'brown'),
    s('path', { d: 'M28 140V84a24 24 0 0 1 48 0v56zM84 140V84a24 24 0 0 1 48 0v56z' }, 'dark'),
    s('rect', { x: 36, y: 116, width: 32, height: 20, rx: 3 }, 'gray', { accent: true }),
    s('path', { d: 'M108 136v-22', ...SW(6) }, 'cream', { stroke: true }),
    s('path', { d: drop(108, 106, 4) }, 'yellow')
  ],
  criptomoneda: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'orange'),
    s('circle', { cx: 80, cy: 80, r: 48 }, 'yellow', { accent: true }),
    s('path', { d: 'M56 60h20v20h28M56 100h20V80M104 56v24M80 116v-16h24', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: dots([[56, 60], [56, 100], [104, 56], [104, 100], [80, 116]], 5) }, 'orange')
  ],
  decimal: [
    s('rect', { x: 14, y: 54, width: 132, height: 36, rx: 4 }, 'white'),
    s('path', { d: rects([[14, 54, 13.2, 36], [27.2, 54, 13.2, 36], [40.4, 54, 13.2, 36]]) }, 'blue', { accent: true }),
    s('path', { d: 'M14 54h132v36H14zM27.2 54v36M40.4 54v36M53.6 54v36M66.8 54v36M80 54v36M93.2 54v36M106.4 54v36M119.6 54v36M132.8 54v36', ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 120, r: 9 }, 'red'),
    s('path', { d: rects([[46, 104, 22, 32], [92, 104, 22, 32]]) }, 'sky')
  ],
  defraudar: [
    s('path', { d: 'M30 82h80v54H30z' }, 'red'),
    s('path', { d: 'M30 82l-6-26 82-10 6 26z' }, 'red', { accent: true }),
    s('path', { d: 'M70 82v54M66 52l2 26', ...SW(8) }, 'yellow', { stroke: true }),
    s('rect', { x: 40, y: 92, width: 60, height: 12 }, 'dark'),
    ...face(126, 50, 18, 'yellow', 'frown')
  ],
  deprimir: [
    s('path', { d: ells([[70, 30, 26, 14], [96, 26, 24, 16], [116, 34, 18, 12]]) }, 'gray'),
    s('path', { d: 'M74 52l-4 10M94 52l-4 10M114 52l-4 10', ...SW(3) }, 'blue', { stroke: true }),
    ...lean(80, 136, 25, 'navy', { h: 36, w: 28, r: 12, accent: true }),
    s('path', { d: 'M40 136h86', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 92q2 8 6 6', ...SW(3) }, 'dark', { stroke: true })
  ],
  desagrado: [
    s('circle', { cx: 70, cy: 80, r: 50 }, 'mint', { accent: true }),
    s('path', { d: 'M46 66l14 6M94 66l-14 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M50 104q10-10 20 0t20 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M132 60v44h12V60q0-6-6-6t-6 6z' }, 'skin'),
    s('path', { d: 'M126 106h24v14h-24z' }, 'skin'),
    s('path', { d: 'M24 40l-8-8M34 30l-4-10', ...SW(3) }, 'green', { stroke: true })
  ],
  despectivo: [
    s('path', { d: HEAD, transform: 'rotate(-14 80 80)' }, 'skin'),
    s('path', { d: 'M96 48q8-4 16 0', ...SW(4), transform: 'rotate(-14 80 80)' }, 'dark', { stroke: true }),
    s('path', { d: 'M96 56h14', ...SW(4), transform: 'rotate(-14 80 80)' }, 'dark', { stroke: true }),
    s('path', { d: 'M40 30q20-20 60-10q-10 12-40 12q-14 6-20-2z', transform: 'rotate(-14 80 80)' }, 'brown'),
    arrow('M132 100q4 24-10 34', 'red', 5),
    s('path', { d: 'M116 128l6 8 8-6z' }, 'red', { accent: true })
  ],
  'despenalización': [
    s('path', { d: ring(46, 96, 22), ...SW(9) }, 'gray', { stroke: true }),
    s('path', { d: 'M114 70a22 22 0 1 1-20 12', ...SW(9) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 86q14-8 30 0', ...SW(5, { 'stroke-dasharray': '6 4' }) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 38l14 14 26-28', ...SW(8) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M110 30l8 8M128 26v12M140 38l-10 6', ...SW(3) }, 'orange', { stroke: true })
  ],
  discriminatorio: [
    ground(),
    s('path', { d: busts([28, 52, 76], 136, 22, 40) }, 'blue'),
    s('path', { d: dots([[28, 86], [52, 86], [76, 86]], 10) }, 'skin'),
    s('path', { d: 'M98 136V60', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: busts([126], 136, 22, 40) }, 'orange', { accent: true }),
    s('path', { d: dots([[126, 86]], 10) }, 'skin'),
    s('path', { d: 'M120 104q6-6 12 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  ducado: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'orange'),
    s('circle', { cx: 80, cy: 80, r: 50 }, 'yellow', { accent: true }),
    s('path', { d: 'M50 98l-6-36 18 16 18-26 18 26 18-16-6 36z' }, 'orange'),
    s('path', { d: 'M50 106h60', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: dots(around(80, 80, 55, 16), 2) }, 'brown')
  ],
  durmiente: [
    s('rect', { x: 14, y: 20, width: 132, height: 120 }, 'tan'),
    s('path', { d: rects([[22, 28, 116, 12], [22, 52, 116, 12], [22, 76, 116, 12], [22, 100, 116, 12], [22, 124, 116, 12]]) }, 'brown', { accent: true }),
    s('path', { d: 'M50 20v120M110 20v120', ...SW(7, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M50 20v120M110 20v120', ...SW(2, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true })
  ],
  emanar: [
    s('path', { d: 'M48 104h64l-8 34H56z' }, 'orange'),
    s('path', { d: 'M80 104V76', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: ells([[80, 58, 10, 10], [64, 66, 10, 10], [96, 66, 10, 10], [70, 82, 10, 9], [90, 82, 10, 9]]) }, 'pink', { accent: true }),
    s('circle', { cx: 80, cy: 72, r: 7 }, 'yellow'),
    s('path', { d: 'M40 50q-8-10 0-20t0-20M120 50q-8-10 0-20t0-20M80 36q-6-8 0-16', ...SW(4) }, 'purple', { stroke: true })
  ],
  embudo: [
    s('path', { d: 'M30 24h100L90 76v24H70V76z' }, 'red', { accent: true }),
    s('path', { d: 'M40 30h80', ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: 'M60 110h40v30H60z' }, 'sky'),
    s('path', { d: 'M60 102h40v38H60z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 100v20', ...SW(5) }, 'blue', { stroke: true })
  ],
  enganchar: [
    s('rect', { x: 14, y: 22, width: 132, height: 18, rx: 4 }, 'brown'),
    s('path', { d: 'M80 40v20q16 0 16 14t-16 14', ...SW(6) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: 'M80 88l-52 30h104z', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M36 112h88l10 30H26z' }, 'blue'),
    s('path', { d: 'M80 80q-6 0-6 8', ...SW(5) }, 'dark', { stroke: true })
  ],
  entendible: [
    ...person(58, 140, 'green', { h: 48, w: 30, r: 14 }),
    s('path', { d: 'M52 76q6 6 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M106 66q-22-6-22-28a22 22 0 0 1 44 0q0 22-22 28z' }, 'yellow', { accent: true }),
    s('rect', { x: 98, y: 66, width: 16, height: 12, rx: 2 }, 'gray'),
    s('path', { d: 'M96 30l8 10 10-14', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M138 30h8M134 52l6 4M74 30h-8', ...SW(3) }, 'orange', { stroke: true })
  ],
  envidiable: [
    ground(),
    ...person(48, 136, 'blue', { h: 50, w: 28, r: 12 }),
    s('path', { d: 'M36 38l12-10 12 10-12 16z' }, 'sky', { accent: true }),
    s('path', { d: sparkle(30, 26, 6) + sparkle(68, 22, 6) }, 'yellow'),
    ...person(118, 136, 'gray', { h: 40, w: 26, r: 12 }),
    s('circle', { cx: 118, cy: 82, r: 12 }, 'mint'),
    s('path', { d: 'M110 80l6 2M126 80l-6 2', ...SW(3) }, 'dark', { stroke: true })
  ],
  ergo: [
    s('path', { d: dots([[40, 46], [24, 72], [56, 72]], 10) }, 'blue'),
    arrow('M70 60h36', 'gray', 6),
    s('path', { d: 'M100 48l12 12-12 12', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 128, cy: 60, r: 14 }, 'green', { accent: true }),
    s('path', { d: 'M24 112h112', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[60, 132], [80, 132], [100, 132]], 5) }, 'dark')
  ],
  'espécimen': [
    s('rect', { x: 40, y: 18, width: 80, height: 14, rx: 4 }, 'gray'),
    s('rect', { x: 36, y: 32, width: 88, height: 108, rx: 14 }, 'sky'),
    s('path', { d: 'M80 116V56', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: ells([[64, 70, 16, 12], [96, 70, 16, 12], [68, 96, 12, 10], [92, 96, 12, 10]]) }, 'orange', { accent: true }),
    s('rect', { x: 50, y: 118, width: 60, height: 14, rx: 2 }, 'white')
  ],
  estirpe: [
    s('path', { d: 'M74 110V70M86 110V70M80 74L50 54M80 74l30-20', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M74 106q-6 22-30 30M80 110v28M86 106q6 22 30 30M76 112q-20 10-42 10M84 112q20 10 42 10', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: ells([[80, 42, 42, 28]]) }, 'green', { accent: true }),
    s('path', { d: dots([[60, 40], [80, 30], [100, 42], [80, 52]], 7) }, 'skin'),
    s('path', { d: 'M14 112h132', ...SW(3) }, 'tan', { stroke: true })
  ],
  farol: [
    s('path', { d: 'M80 146V60', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 140h36', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 30h32l-4 32H68z' }, 'yellow', { accent: true }),
    s('path', { d: 'M58 30l22-14 22 14zM64 62h32', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: halfRays(80, 46, 30, 40, 7), ...SW(3) }, 'orange', { stroke: true })
  ],
  finamente: [
    s('rect', { x: 14, y: 96, width: 132, height: 36, rx: 6 }, 'tan'),
    s('path', { d: 'M38 40l70 0q8 0 8 8l-10 22H38z', transform: 'rotate(20 76 60)' }, 'gray', { accent: true }),
    s('path', { d: 'M108 46h30', ...SW(10), transform: 'rotate(20 76 60)' }, 'dark', { stroke: true }),
    s('path', { d: rects([[30, 102, 5, 5], [40, 106, 5, 5], [50, 101, 5, 5], [60, 106, 5, 5], [36, 112, 5, 5], [48, 114, 5, 5], [58, 112, 5, 5], [70, 104, 5, 5]]) }, 'cream'),
    s('path', { d: 'M110 114a14 10 0 1 0 0.1 0' }, 'purple')
  ],
  forzosamente: [
    ground(),
    ...lean(100, 136, 18, 'green', { h: 42, w: 26, r: 11 }),
    s('path', { d: 'M14 70h40v34H14z' }, 'skin'),
    s('path', { d: 'M54 72h16q6 0 6 6t-6 6H54M54 86h18M54 98h14', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M76 74l14 0', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M22 70h28v34H22z', ...SW(3) }, 'tan', { stroke: true }),
    arrow('M30 40h60M80 32l10 8-10 8', 'red', 6),
    s('circle', { cx: 132, cy: 52, r: 6 }, 'red', { accent: true })
  ],
  'genealogía': [
    ...paper(18, 18, 124, 124),
    s('path', { d: 'M50 46v18h60V46M80 64v20M80 84v20h-30M80 104h30', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: dots([[50, 40], [110, 40]], 10) }, 'blue'),
    s('path', { d: dots([[80, 84]], 10) }, 'green', { accent: true }),
    s('path', { d: dots([[50, 116], [110, 116]], 10) }, 'pink')
  ],
  gilipollez: [
    s('path', { d: bubble(30, 16, 110, 70) }, 'white'),
    s('path', { d: bubble(30, 16, 110, 70), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: spiral(56, 50) + 'M86 40q8 10 0 20t10 10M110 44l12 8-12 8', ...SW(4) }, 'purple', { stroke: true }),
    ...face(46, 126, 18, 'yellow', 'smile', { accent: true }),
    s('path', { d: 'M32 112l10-6M60 112l-10-6', ...SW(3) }, 'dark', { stroke: true })
  ],
  hamaca: [
    ground(),
    s('path', { d: 'M24 136V40M136 136V40', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(24, 40, 220, 26, 7) + leaflet(24, 40, -40, 26, 7) + leaflet(136, 40, -140, 26, 7) + leaflet(136, 40, 40, 26, 7) }, 'green'),
    s('path', { d: 'M24 68l18 12M136 68l-18 12', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M40 78q40 44 80 0q-40 20-80 0z' }, 'red', { accent: true }),
    s('path', { d: 'M48 86q32 24 64 0', ...SW(3) }, 'yellow', { stroke: true })
  ],
  himalayo: [
    s('rect', { x: 14, y: 20, width: 132, height: 116, rx: 10 }, 'sky'),
    s('path', { d: 'M14 136l38-70 20 26 26-60 48 104z' }, 'gray'),
    s('path', { d: 'M86 54l12-22 14 30-8-6-6 8-6-8z' }, 'white', { accent: true }),
    s('path', { d: 'M40 88l12-22 10 14-8-2-6 8z' }, 'white')
  ],
  iguana: [
    s('path', { d: 'M30 100q20-20 60-16q30 4 40-12q10-8 18 2q4 8-10 12q-10 24-48 24q-30 0-46 2q-20 4-24 22q-6-26 10-34z' }, 'green', { accent: true }),
    s('path', { d: 'M56 84l4-10 4 10 4-10 4 10 4-10 4 10 4-10 4 10', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: 'M60 108l-6 18M100 106l6 18', ...SW(6) }, 'green', { stroke: true }),
    s('circle', { cx: 132, cy: 76, r: 2.5 }, 'dark'),
    s('path', { d: 'M124 90q2 6 8 6', ...SW(3) }, 'orange', { stroke: true })
  ],
  imperar: [
    s('path', { d: busts([24, 46, 114, 136], 146, 18, 24) }, 'gray'),
    s('rect', { x: 56, y: 110, width: 48, height: 36 }, 'tan'),
    ...person(80, 110, 'purple', { h: 42, w: 28, r: 12, accent: true }),
    s('path', { d: laurel(80, 54, 13, 8, 3) }, 'green'),
    s('path', { d: 'M100 92l16-60', ...SW(5) }, 'yellow', { stroke: true }),
    s('circle', { cx: 116, cy: 28, r: 7 }, 'yellow')
  ],
  inagotable: [
    s('path', { d: 'M30 30h40v10l-6 6H36l-6-6z', transform: 'rotate(-30 50 40)' }, 'blue'),
    s('path', { d: 'M66 50q10 10 10 40', ...SW(8) }, 'sky', { stroke: true, accent: true }),
    s('path', { d: 'M48 92h60l-6 44H54z' }, 'sky'),
    s('path', { d: 'M48 92h60l-6 44H54z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: drop(44, 120, 5) + drop(116, 116, 5) }, 'sky'),
    s('path', { d: 'M120 40c-8-12-26-12-26 0s18 12 26 0 26-12 26 0-18 12-26 0', ...SW(5) }, 'green', { stroke: true })
  ],
  ineficacia: [
    s('rect', { x: 14, y: 118, width: 132, height: 22 }, 'brown'),
    s('path', { d: 'M64 118V96q0-10 18-18l14-6', ...SW(5) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: 'M80 20l30 22-8 10-30-22z' }, 'dark'),
    s('path', { d: 'M90 36l-26 42', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: 'M110 92l14 8M114 76l16-2M28 92l10 6', ...SW(3) }, 'orange', { stroke: true })
  ],
  inerte: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 136q-4-40 30-54q30-10 58 6q22 20 14 48z' }, 'gray', { accent: true }),
    s('path', { d: 'M58 104l12 8M98 100l-6 14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 60h20M110 40h20', ...DASH(4) }, 'sky', { stroke: true }),
    s('path', { d: 'M82 48a6 6 0 1 0 0.1 0' }, 'dark')
  ],
  infractor: [
    s('rect', { x: 18, y: 18, width: 30, height: 74, rx: 8 }, 'dark'),
    s('circle', { cx: 33, cy: 34, r: 9 }, 'red', { accent: true }),
    s('path', { d: dots([[33, 55], [33, 76]], 9) }, 'gray'),
    s('path', { d: 'M33 92v44', ...SW(5) }, 'dark', { stroke: true }),
    ...car(68, 104, 'blue'),
    s('path', { d: 'M54 108h10M50 118h12', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  inimaginable: [
    s('path', { d: ells([[96, 50, 46, 34], [64, 42, 22, 20], [128, 40, 18, 16]]) }, 'navy'),
    s('path', { d: spiral(92, 50), ...SW(4) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: sparkle(66, 36, 6) + sparkle(122, 60, 6) + sparkle(116, 30, 4) }, 'yellow'),
    s('path', { d: dots([[54, 94], [44, 104]], 4) }, 'navy'),
    ...face(34, 126, 18, 'skin', 'flat'),
    s('circle', { cx: 34, cy: 134, r: 4 }, 'dark')
  ],
  'interconexión': [
    s('path', { d: 'M80 24L28 64M80 24l52 40M80 24L46 132M80 24l34 108M28 64h104M28 64l86 68M132 64l-86 68M28 64l18 68M132 64l-18 68M46 132h68', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[28, 64], [132, 64], [46, 132], [114, 132]], 12) }, 'blue'),
    s('circle', { cx: 80, cy: 24, r: 12 }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 82, r: 8 }, 'green')
  ],
  intuitivo: [
    s('rect', { x: 30, y: 16, width: 100, height: 128, rx: 12 }, 'dark'),
    s('rect', { x: 38, y: 26, width: 84, height: 106, rx: 4 }, 'cream'),
    s('circle', { cx: 80, cy: 72, r: 24 }, 'green', { accent: true }),
    s('path', { d: 'M74 60l16 12-16 12z' }, 'white'),
    s('path', { d: 'M96 150v-40q0-8 7-8t7 8v-8q0-7 7-7t7 7v48z' }, 'skin'),
    s('path', { d: 'M108 94l-4-8M120 92l4-8M100 100l-8-2', ...SW(3) }, 'orange', { stroke: true })
  ],
  invariablemente: [
    s('rect', { x: 18, y: 24, width: 124, height: 112, rx: 8 }, 'white'),
    s('rect', { x: 18, y: 24, width: 124, height: 24, rx: 8 }, 'red'),
    s('path', { d: 'M18 32q0-8 8-8h108q8 0 8 8v96q0 8-8 8H26q-8 0-8-8z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[38, 66], [62, 66], [86, 66], [110, 66], [38, 92], [62, 92], [86, 92], [110, 92], [38, 118], [62, 118], [86, 118], [110, 118]], 8) }, 'green', { accent: true }),
    s('path', { d: 'M126 60v64', ...SW(3) }, 'gray', { stroke: true })
  ],
  inyectar: [
    s('rect', { x: 40, y: 64, width: 72, height: 30, rx: 4, transform: 'rotate(-35 80 80)' }, 'white'),
    s('rect', { x: 40, y: 70, width: 44, height: 18, transform: 'rotate(-35 80 80)' }, 'sky', { accent: true }),
    s('path', { d: 'M40 64h72v30H40zM112 79h20M24 66v26M24 79h16M50 64v8M62 64v8M74 64v8', ...SW(3), transform: 'rotate(-35 80 80)' }, 'gray', { stroke: true }),
    s('path', { d: 'M132 79h20', ...SW(2), transform: 'rotate(-35 80 80)' }, 'dark', { stroke: true }),
    s('path', { d: drop(146, 18, 4) }, 'sky')
  ],
  irreparable: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 134l10-30 22 6-4 24z' }, 'blue', { accent: true }),
    s('path', { d: 'M66 134l6-40 20 10 8 30z' }, 'blue'),
    s('path', { d: 'M106 134l4-22 24 6-2 16z' }, 'blue'),
    s('path', { d: 'M54 60l12-24 22 6-4 22z' }, 'sky'),
    s('path', { d: 'M110 70l14 4-6 12z M40 82l8 4-6 6z' }, 'sky'),
    s('path', { d: 'M74 82v-8M100 88l6-6M50 94l-6-4', ...SW(3) }, 'dark', { stroke: true })
  ],
  'jerárquico': [
    s('path', { d: 'M80 40v18M44 58h72M44 58v18M116 58v18M44 92v14M116 92v14M28 106h32M100 106h32M28 106v8M60 106v8M100 106v8M132 106v8', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 28, r: 14 }, 'red', { accent: true }),
    s('path', { d: dots([[44, 84], [116, 84]], 11) }, 'blue'),
    s('path', { d: dots([[28, 124], [60, 124], [100, 124], [132, 124]], 9) }, 'sky')
  ],
  lastimosamente: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 136q-6-18 14-20q18 0 22 20z' }, 'pink', { accent: true }),
    s('path', { d: 'M116 112l18-22 6 8-16 20z' }, 'tan'),
    ...face(50, 70, 32, 'yellow', 'frown'),
    s('path', { d: drop(36, 90, 4) }, 'sky')
  ],
  ligamento: [
    s('path', { d: 'M62 14v52M98 14v52', ...SW(16) }, 'cream', { stroke: true }),
    s('ellipse', { cx: 80, cy: 66, rx: 30, ry: 12 }, 'cream'),
    s('ellipse', { cx: 80, cy: 98, rx: 28, ry: 10 }, 'cream'),
    s('path', { d: 'M66 94v52M94 94v52', ...SW(16) }, 'cream', { stroke: true }),
    s('path', { d: 'M58 64v36M102 64v36M72 66l-2 34M88 66l2 34', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M48 66q0 30 10 34M112 66q0 30-10 34', ...SW(2) }, 'tan', { stroke: true })
  ],
  lupus: [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'skin'),
    s('path', { d: 'M80 92q-14-22-34-14q-8 14 8 24q14 6 26-10q12 16 26 10q16-10 8-24q-20-8-34 14z' }, 'pink', { accent: true }),
    s('path', { d: dots([[60, 66], [100, 66]], 5) }, 'dark'),
    s('path', { d: 'M66 116q14 6 28 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 50q20-34 52-30q34 0 52 30q-20-12-52-12t-52 12z' }, 'brown')
  ],
  maleza: [
    s('rect', { x: 14, y: 116, width: 132, height: 26, rx: 4 }, 'brown'),
    s('path', { d: leaflet(30, 118, -80, 50, 9) + leaflet(30, 118, -120, 36, 7) + leaflet(56, 118, -60, 60, 10) + leaflet(70, 118, -100, 44, 8) + leaflet(96, 118, -75, 56, 10) + leaflet(118, 118, -110, 48, 9) + leaflet(132, 118, -60, 40, 8) }, 'green', { accent: true }),
    s('path', { d: leaflet(44, 118, -40, 30, 7) + leaflet(84, 118, -140, 34, 7) + leaflet(108, 118, -40, 30, 7) }, 'mint'),
    s('path', { d: dots([[60, 60], [114, 72]], 5) }, 'yellow')
  ],
  'mentón': [
    s('path', { d: HEAD }, 'skin'),
    s('path', { d: 'M112 106q12 4 14 14q-4 12-14 12', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M44 34q30-20 66 0q-26-4-40 10q-20-4-26-10z' }, 'brown'),
    s('circle', { cx: 104, cy: 62, r: 3 }, 'dark'),
    arrow('M146 136l-14-10', 'orange', 4)
  ],
  merecedor: [
    ground(),
    ...person(80, 136, 'blue', { h: 56, w: 32, r: 14 }),
    s('path', { d: 'M72 80l8 18 8-18', ...SW(4) }, 'red', { stroke: true }),
    s('circle', { cx: 80, cy: 104, r: 10 }, 'yellow', { accent: true }),
    s('path', { d: star(80, 104, 6) }, 'orange'),
    s('path', { d: sparkle(40, 50, 8) + sparkle(122, 44, 8) + sparkle(126, 92, 6) }, 'yellow')
  ],
  mistral: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M22 46h70q14 0 14-12t-12-10M22 70h96q14 0 14 12t-12 10M22 94h56', ...SW(6) }, 'white', { stroke: true, accent: true }),
    s('path', { d: 'M118 146q4-30-6-50', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(112, 98, 150, 26, 8) + leaflet(112, 106, 170, 24, 7) + leaflet(114, 114, 190, 22, 7) }, 'green'),
    s('path', { d: dots([[40, 130], [52, 124], [64, 132]], 5) }, 'purple')
  ],
  modelar: [
    s('rect', { x: 26, y: 120, width: 108, height: 14, rx: 6 }, 'gray'),
    s('path', { d: 'M52 120q-6-30 14-40q-6-14 6-22h16q12 8 6 22q20 10 14 40z' }, 'brown', { accent: true }),
    s('path', { d: 'M20 82q16-6 30 8l6 10M140 82q-16-6-30 8l-6 10', ...SW(12) }, 'skin', { stroke: true }),
    s('path', { d: 'M40 140h80', ...SW(4) }, 'dark', { stroke: true })
  ],
  modernista: [
    ground(),
    s('path', { d: 'M30 136V60q10-40 50-40t50 40v76z' }, 'mint', { accent: true }),
    s('path', { d: 'M30 60q12 8 25 0t25 0 25 0 25 0', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M46 84q0-12 10-12t10 12v14H46zM94 84q0-12 10-12t10 12v14H94z' }, 'sky'),
    s('path', { d: 'M64 136v-18q0-14 16-14t16 14v18z' }, 'brown'),
    s('path', { d: dots([[56, 36], [80, 30], [104, 36]], 5) }, 'orange')
  ],
  moho: [
    s('path', { d: 'M28 140V60q-14-2-14-22t30-22h72q30 2 30 22t-14 22v80z' }, 'tan'),
    s('path', { d: 'M38 132V56q-12-4-12-16t22-14h64q22 2 22 14t-12 16v76z' }, 'cream'),
    s('path', { d: ells([[60, 60, 14, 10], [96, 92, 18, 13], [62, 112, 10, 8], [116, 50, 8, 6]]) }, 'green', { accent: true }),
    s('path', { d: dots([[54, 56], [66, 64], [90, 88], [102, 96], [64, 110], [76, 80]], 3) }, 'mint')
  ],
  mueca: [
    s('circle', { cx: 80, cy: 82, r: 54 }, 'skin', { accent: true }),
    s('path', { d: 'M48 50l20 8M98 48q10-8 20 2', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: dots([[60, 70], [104, 66]], 5) }, 'dark'),
    s('path', { d: 'M50 110q16-10 30 0t30-14', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 96l6-6', ...SW(5) }, 'dark', { stroke: true })
  ],
  oprimir: [
    ground(),
    s('rect', { x: 34, y: 30, width: 92, height: 50, rx: 4 }, 'dark', { accent: true }),
    arrow('M80 14v12', 'red', 6),
    s('circle', { cx: 80, cy: 96, r: 11 }, 'skin'),
    s('rect', { x: 64, y: 106, width: 32, height: 30, rx: 10 }, 'orange'),
    s('path', { d: 'M62 104l-8-22M98 104l8-22', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M18 92l10 4M142 92l-10 4', ...SW(3) }, 'gray', { stroke: true })
  ],
  orco: [
    s('path', { d: 'M24 64l-14-18 30 6zM136 64l14-18-30 6z' }, 'green'),
    s('path', { d: 'M28 72q0-46 52-46t52 46q0 56-52 56t-52-56z' }, 'green', { accent: true }),
    s('path', { d: 'M46 62l22 8M114 62l-22 8', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[62, 78], [98, 78]], 5) }, 'red'),
    s('path', { d: 'M56 108q24-12 48 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 106l4-16 6 14zM100 106l-4-16-6 14z' }, 'cream')
  ],
  pichincha: [
    s('path', { d: 'M20 60l40-40h50v50l-40 40z' }, 'yellow', { accent: true }),
    s('circle', { cx: 92, cy: 38, r: 7 }, 'white'),
    arrow('M64 58v34M52 80l12 12 12-12', 'red', 7),
    s('path', { d: ells([[108, 130, 26, 7], [108, 120, 26, 7], [108, 110, 26, 7]]) }, 'orange'),
    s('path', { d: sparkle(30, 112, 8) + sparkle(140, 84, 6) }, 'green')
  ],
  plebe: [
    s('path', { d: busts([30, 58, 86, 114, 142], 148, 26, 40) }, 'tan'),
    s('path', { d: dots([[30, 104], [58, 104], [86, 104], [114, 104], [142, 104]], 11) }, 'skin'),
    s('path', { d: busts([44, 72, 100, 128], 120, 24, 36) }, 'brown', { accent: true }),
    s('path', { d: dots([[44, 78], [72, 78], [100, 78], [128, 78]], 10) }, 'skin')
  ],
  plomero: [
    s('path', { d: 'M100 14v50h46', ...SW(14) }, 'gray', { stroke: true }),
    s('rect', { x: 92, y: 52, width: 16, height: 24, rx: 3 }, 'dark'),
    ...person(52, 140, 'blue', { h: 54, w: 32, r: 14, accent: true }),
    s('path', { d: 'M38 46q14-20 28 0z' }, 'red'),
    s('path', { d: 'M66 102l30-30', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M88 70l12-12 6 6-4 4 4 4-6 6z' }, 'gray'),
    s('path', { d: drop(100, 96, 5) }, 'sky')
  ],
  prefacio: [
    ...openBook(80, 46),
    s('path', { d: 'M38 66h30M38 78h34M38 90h26M92 64h30M92 76h30M92 88h30M92 100h20', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 36h18v26l-9-6-9 6z' }, 'red', { accent: true }),
    arrow('M30 136h80M40 128l-10 8 10 8', 'orange', 5)
  ],
  presidio: [
    s('rect', { x: 14, y: 20, width: 132, height: 120, rx: 6 }, 'gray'),
    s('path', { d: 'M14 40h132M14 60h132M14 80h132M14 100h132M14 120h132', ...SW(2) }, 'white', { stroke: true }),
    s('rect', { x: 46, y: 44, width: 68, height: 64, rx: 4 }, 'dark'),
    s('path', { d: 'M58 44v64M72 44v64M88 44v64M102 44v64', ...SW(5) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: dots([[80, 68]], 10) }, 'skin')
  ],
  reaccionario: [
    ground(),
    s('path', { d: 'M22 42h80v-14l36 28-36 28V70H22z' }, 'green'),
    ...lean(112, 136, -20, 'red', { h: 40, w: 26, r: 12, accent: true }),
    s('path', { d: 'M104 96l-22-6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M74 80v18', ...SW(6) }, 'skin', { stroke: true })
  ],
  reactivo: [
    s('path', { d: 'M60 20v86a20 20 0 0 0 40 0V20', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 70h36v36a18 18 0 0 1-36 0z' }, 'green', { accent: true }),
    s('path', { d: dots([[72, 90], [86, 82], [78, 108], [90, 100]], 4) }, 'white'),
    s('path', { d: burst(80, 34, 22, 10, 8) }, 'orange'),
    s('path', { d: dots([[60, 56], [104, 50], [96, 30]], 4) }, 'mint'),
    s('path', { d: 'M54 20h52', ...SW(4) }, 'gray', { stroke: true })
  ],
  'regadío': [
    s('path', { d: 'M14 70h132v70H14z' }, 'brown'),
    s('path', { d: 'M14 84h132M14 104h132M14 124h132', ...SW(5) }, 'sky', { stroke: true, accent: true }),
    s('path', { d: dots([[24, 76], [44, 76], [64, 76], [84, 76], [104, 76], [124, 76], [24, 96], [44, 96], [64, 96], [84, 96], [104, 96], [124, 96], [34, 116], [54, 116], [74, 116], [94, 116], [114, 116], [134, 116]], 5) }, 'green'),
    s('path', { d: 'M80 70V40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 30q14-12 28 0M58 22q22-18 44 0', ...DASH(3, '3 5') }, 'blue', { stroke: true })
  ],
  'reutilización': [
    s('path', { d: 'M54 60h52v68q0 8-8 8H62q-8 0-8-8z' }, 'sky'),
    s('path', { d: 'M54 60h52v68q0 8-8 8H62q-8 0-8-8zM58 52h44v8H58z', ...SW(3) }, 'gray', { stroke: true }),
    ...flower(80, 34, 'pink'),
    s('path', { d: 'M24 100a56 56 0 0 0 18 32M136 60a56 56 0 0 0-18-32', ...SW(6) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M34 138l12 0-4-12zM126 22l-12 0 4 12z' }, 'green')
  ],
  reversa: [
    ground(132),
    ...car(70, 98, 'orange', 'sky', { accent: true }),
    s('path', { d: 'M56 110H20M30 100l-10 10 10 10', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: dots([[130, 102]], 4) }, 'white'),
    s('path', { d: 'M134 72l6-6M126 70v-8', ...SW(3) }, 'gray', { stroke: true })
  ],
  rumorear: [
    ...person(46, 140, 'purple', { h: 48, w: 28, r: 14 }),
    ...person(100, 140, 'blue', { h: 48, w: 28, r: 14 }),
    s('path', { d: 'M58 66q10-4 12 6', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M70 52q6 4 0 10M76 46q10 10 0 22', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: bubble(108, 18, 40, 28) }, 'gray', { accent: true }),
    s('path', { d: dots([[118, 32], [128, 32], [138, 32]], 3) }, 'white')
  ],
  salubridad: [
    s('path', { d: 'M18 40h44v16H34v12H18z' }, 'gray'),
    s('path', { d: 'M26 70v20M26 96v12', ...DASH(5, '6 6') }, 'sky', { stroke: true }),
    s('path', { d: 'M28 118q-4 18 18 20h46q16-2 16-14t-14-12H46z' }, 'skin'),
    s('path', { d: dots([[60, 110], [80, 104], [98, 98]], 7) }, 'white'),
    s('path', { d: 'M100 32h20v20h20v20h-20v20h-20V72H80V52h20z' }, 'green', { accent: true })
  ],
  'sarampión': [
    s('circle', { cx: 74, cy: 84, r: 54 }, 'skin'),
    s('path', { d: 'M24 60q16-40 50-40q36 0 50 40q-20-18-50-18T24 60z' }, 'brown'),
    s('path', { d: dots([[46, 78], [56, 102], [92, 104], [104, 80], [74, 120], [40, 96], [100, 118]], 5) }, 'red', { accent: true }),
    s('path', { d: 'M56 74h10M84 74h10', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 108l52-30', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 132, cy: 78, r: 6 }, 'red')
  ],
  'sazón': [
    s('path', { d: 'M24 98h112q-4 40-56 40t-56-40z' }, 'dark'),
    s('path', { d: 'M18 98h124', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 22h28v40H86z', transform: 'rotate(30 100 42)' }, 'white'),
    s('path', { d: 'M86 22h28v40H86z', ...SW(3), transform: 'rotate(30 100 42)' }, 'gray', { stroke: true }),
    s('path', { d: 'M86 16h28v8H86z', transform: 'rotate(30 100 42)' }, 'red', { accent: true }),
    s('path', { d: dots([[80, 70], [72, 82], [86, 86], [64, 92]], 3) }, 'orange')
  ],
  silicio: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'gray', { accent: true }),
    s('path', { d: grid(34, 40, 5, 5, 14, 14, 18, 18) }, 'purple'),
    s('path', { d: 'M62 140h36', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: ring(80, 80, 62), ...SW(3) }, 'dark', { stroke: true })
  ],
  silo: [
    ground(),
    s('path', { d: 'M48 136V54a32 32 0 0 1 64 0v82z' }, 'gray', { accent: true }),
    s('path', { d: 'M48 54a32 32 0 0 1 64 0z' }, 'red'),
    s('path', { d: 'M48 74h64M48 94h64M48 114h64', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M112 136V96h32v40z' }, 'red'),
    s('path', { d: 'M20 136V100l12-8 12 8v36z' }, 'brown')
  ],
  'sésamo': [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'brown'),
    s('path', { d: [[52, 50, 20], [80, 40, -10], [108, 54, 30], [46, 82, -20], [76, 74, 10], [106, 86, -30], [56, 112, 15], [88, 108, -15], [118, 114, 25]].map(([x, y]) => `M${x} ${y - 10}q7 6 6 12q-1 6-6 8q-5-2-6-8q-1-6 6-12z`).join('') }, 'cream', { accent: true })
  ],
  'teletón': [
    s('rect', { x: 18, y: 30, width: 96, height: 72, rx: 8 }, 'dark'),
    s('rect', { x: 26, y: 38, width: 80, height: 56, rx: 3 }, 'sky'),
    s('path', { d: heart(66, 70, 18) }, 'red', { accent: true }),
    s('path', { d: 'M50 102l-10 20M82 102l10 20', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[130, 134, 14, 5], [130, 124, 14, 5], [130, 114, 14, 5]]) }, 'yellow'),
    s('path', { d: 'M66 20l-12-8M66 20l12-8', ...SW(3) }, 'gray', { stroke: true })
  ],
  triunfante: [
    s('rect', { x: 50, y: 108, width: 60, height: 32, rx: 3 }, 'yellow'),
    s('circle', { cx: 80, cy: 50, r: 12 }, 'skin'),
    s('rect', { x: 66, y: 64, width: 28, height: 44, rx: 9 }, 'red', { accent: true }),
    s('path', { d: 'M68 70L50 36M92 70l18-34', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: rects([[26, 26, 6, 10], [128, 30, 6, 10], [36, 72, 6, 10], [122, 76, 6, 10]]) }, 'blue'),
    s('path', { d: star(80, 124, 9) }, 'orange')
  ],
  universalmente: [
    s('circle', { cx: 80, cy: 80, r: 44 }, 'blue'),
    s('path', { d: 'M50 60q14-6 20 6t16 4q6 14-6 20q-14 4-12 16M100 50q14 4 14 20', ...SW(10) }, 'green', { stroke: true, accent: true }),
    s('path', { d: dots(around(80, 80, 60, 8, -90), 9) }, 'skin'),
    s('path', { d: ring(80, 80, 60), ...SW(5, { 'stroke-dasharray': '10 22' }) }, 'orange', { stroke: true })
  ],
  'utópico': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M24 110a56 56 0 0 1 112 0', ...SW(6) }, 'pink', { stroke: true }),
    s('path', { d: 'M32 110a48 48 0 0 1 96 0', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M38 110h84q-10 28-42 28t-42-28z' }, 'brown'),
    s('path', { d: 'M38 110h84v-6H38z' }, 'green'),
    s('path', { d: 'M62 104V76h10v-8h16v8h10v28z' }, 'white', { accent: true }),
    s('path', { d: ells([[40, 40, 14, 7], [116, 34, 16, 8]]) }, 'white')
  ],
  vajilla: [
    s('path', { d: ells([[60, 128, 46, 10], [60, 118, 46, 10], [60, 108, 46, 10]]) }, 'white'),
    s('path', { d: ells([[60, 128, 46, 10], [60, 118, 46, 10], [60, 108, 46, 10]]), ...SW(3) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M28 62h48q-2 30-24 30t-24-30z' }, 'blue'),
    s('path', { d: 'M104 82h34v24q0 10-10 10h-14q-10 0-10-10z' }, 'blue'),
    s('path', { d: 'M138 88q12 0 8 10t-8 4', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M28 62h48', ...SW(3) }, 'sky', { stroke: true })
  ],
  velero: [
    s('path', { d: 'M14 124q16-6 33 0t33 0t33 0t33 0v22H14z' }, 'blue'),
    s('path', { d: 'M30 106h100l-14 20H44z' }, 'brown'),
    s('path', { d: 'M78 106V18', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 22q36 40 30 80H82z' }, 'white', { accent: true }),
    s('path', { d: 'M82 22q36 40 30 80H82z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 34L38 100h36z' }, 'red')
  ],
  violinista: [
    ...person(60, 140, 'navy', { h: 54, w: 32, r: 14 }),
    s('path', { d: 'M76 68q14-6 28 6q10 10 4 22q-8 8-18 4q-14-6-18-20z' }, 'brown', { accent: true }),
    s('path', { d: 'M72 74l-14-6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M126 52L70 108', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M74 102l-8-8', ...SW(6) }, 'skin', { stroke: true }),
    ...note(130, 108, 'purple')
  ],
};
