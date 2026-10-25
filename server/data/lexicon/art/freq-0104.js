// Illustration specs for words still undrawn in batches 0103–0104 (see server/scripts/lexicon/art.js)
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
  silicona: [
    s('path', { d: 'M28 84l60-60 22 22-60 60z' }, 'gray'),
    s('path', { d: 'M110 46l18-18 6 6-18 18z' }, 'dark'),
    s('path', { d: 'M88 24l22 22', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 84l-8 8 22 22 8-8z' }, 'blue', { accent: true }),
    s('path', { d: 'M126 46q4 30-20 50t-30 50', ...SW(9) }, 'white', { stroke: true }),
    s('path', { d: 'M126 46q4 30-20 50t-30 50', ...SW(2) }, 'gray', { stroke: true })
  ],
  sobriedad: [
    ground(),
    ...person(60, 136, 'blue', { accent: true }),
    s('path', { d: 'M76 100l22-10', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M100 78h22l-3 42h-16z' }, 'sky'),
    s('path', { d: 'M100 66h22l-4 54h-14z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 60q8 6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[54, 52], [66, 52]], 2.5) }, 'dark')
  ],
  soltura: [
    s('path', { d: bubble(56, 18, 92, 58) }, 'sky'),
    s('path', { d: 'M68 38q8-8 16 0t16 0 16 0 16 0M68 54q8-8 16 0t16 0 16 0 16 0', ...SW(5) }, 'blue', { stroke: true, accent: true }),
    s('circle', { cx: 48, cy: 92, r: 16 }, 'skin'),
    s('rect', { x: 26, y: 110, width: 44, height: 30, rx: 14 }, 'orange'),
    s('path', { d: 'M50 98q6 4 10 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  superliga: [
    s('path', { d: 'M52 30h56v26q0 32-28 34q-28-2-28-34z' }, 'yellow', { accent: true }),
    s('path', { d: 'M52 38H36q0 26 20 28M108 38h16q0 26-20 28', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M74 90h12v20H74zM56 110h48v12H56zM50 122h60v14H50z' }, 'orange'),
    s('path', { d: star(30, 22, 10) + star(130, 22, 10) + star(80, 60, 11) }, 'white'),
    s('path', { d: 'M30 116h10M120 116h10', ...SW(4) }, 'gray', { stroke: true })
  ],
  'superposición': [
    s('rect', { x: 22, y: 22, width: 76, height: 76, rx: 8 }, 'blue'),
    s('rect', { x: 62, y: 62, width: 76, height: 76, rx: 8 }, 'red'),
    s('path', { d: 'M62 70a8 8 0 0 1 8-8h28v28a8 8 0 0 1-8 8H62z' }, 'purple', { accent: true }),
    s('path', { d: 'M22 30a8 8 0 0 1 8-8h60a8 8 0 0 1 8 8v60a8 8 0 0 1-8 8H30a8 8 0 0 1-8-8z', ...DASH(3) }, 'dark', { stroke: true })
  ],
  sutura: [
    s('rect', { x: 16, y: 40, width: 128, height: 80, rx: 30 }, 'skin'),
    s('path', { d: 'M30 82q50-8 100 0', ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: 'M40 70v22M58 68v22M76 67v22M94 67v22M112 68v22', ...SW(3) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M120 70q14-30 0-48', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M112 68q2-6 8-2', ...SW(2) }, 'navy', { stroke: true })
  ],
  tajante: [
    s('path', { d: 'M24 112h52l-6 26H24zM84 112h52v26H90z' }, 'yellow'),
    s('path', { d: 'M24 112h52M84 112h52', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M56 26h52v40q-26 6-52 0z' }, 'gray', { accent: true }),
    s('rect', { x: 108, y: 34, width: 34, height: 14, rx: 6 }, 'brown'),
    s('path', { d: 'M80 74v30', ...SW(4, { 'stroke-dasharray': '4 6' }) }, 'dark', { stroke: true }),
    s('circle', { cx: 66, cy: 36, r: 4 }, 'white')
  ],
  tapiz: [
    s('path', { d: 'M24 22h112', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 34, y: 24, width: 92, height: 100 }, 'red', { accent: true }),
    s('rect', { x: 44, y: 34, width: 72, height: 80 }, 'navy'),
    s('path', { d: 'M80 44l26 30-26 30-26-30z' }, 'yellow'),
    s('path', { d: dots([[80, 74]], 8) + dots([[58, 46], [102, 46], [58, 102], [102, 102]], 4) }, 'mint'),
    s('path', { d: 'M38 124v14M50 124v14M62 124v14M74 124v14M86 124v14M98 124v14M110 124v14M122 124v14', ...SW(3) }, 'yellow', { stroke: true })
  ],
  telediario: [
    s('rect', { x: 18, y: 26, width: 124, height: 92, rx: 10 }, 'dark'),
    s('rect', { x: 26, y: 34, width: 108, height: 76, rx: 4 }, 'sky'),
    s('circle', { cx: 80, cy: 58, r: 12 }, 'skin'),
    s('path', { d: 'M62 96v-12a18 18 0 0 1 36 0v12z' }, 'navy', { accent: true }),
    s('rect', { x: 34, y: 94, width: 92, height: 16 }, 'brown'),
    s('path', { d: 'M60 136l12-18h16l12 18z' }, 'gray'),
    s('rect', { x: 104, y: 40, width: 22, height: 14, rx: 2 }, 'red')
  ],
  tenebroso: [
    backdrop('navy'),
    s('circle', { cx: 118, cy: 38, r: 14 }, 'cream'),
    s('path', { d: 'M28 136V70l-10 20M28 92l12-16M60 136V54l-12 18M60 76l14-14M100 136V80l-12 12M100 96l14-10', ...SW(7) }, 'black', { stroke: true }),
    s('path', { d: ells([[70, 112, 4, 5], [84, 112, 4, 5]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'black', { stroke: true })
  ],
  'undécimo': [
    s('path', { d: dots([[30, 40], [55, 40], [80, 40], [105, 40], [130, 40], [30, 72], [55, 72], [80, 72], [105, 72], [130, 72]], 10) }, 'gray'),
    s('path', { d: star(80, 114, 24) }, 'orange', { accent: true }),
    s('path', { d: 'M56 140h48', ...SW(4) }, 'orange', { stroke: true })
  ],
  universalidad: [
    s('circle', { cx: 80, cy: 80, r: 44 }, 'sky'),
    s('path', { d: 'M56 52q14-6 22 6t-6 20q-12 6-8 18-14-6-14-24 0-12 6-20zM96 72q16-4 22 10t-8 22q-12 0-14-14-2-10 0-18z' }, 'green', { accent: true }),
    s('path', { d: dots(around(80, 80, 62, 8, 22.5), 8) }, 'skin'),
    s('path', { d: ring(80, 80, 62), ...SW(2) }, 'gray', { stroke: true })
  ],
  versatilidad: [
    s('path', { d: 'M100 70l34-40', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M76 66L70 22', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M56 74L22 50l6-6z' }, 'gray'),
    s('path', { d: 'M118 112l22 14', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 26, y: 72, width: 108, height: 34, rx: 17 }, 'red', { accent: true }),
    s('path', { d: 'M74 89h12M80 83v12', ...SW(4) }, 'white', { stroke: true })
  ],
  vidriera: [
    s('path', { d: 'M34 140V64a46 46 0 0 1 92 0v76z' }, 'dark'),
    s('path', { d: 'M42 64a38 38 0 0 1 38-38v46H42z' }, 'red', { accent: true }),
    s('path', { d: 'M80 26a38 38 0 0 1 38 38v8H80z' }, 'blue'),
    s('path', { d: 'M42 78h38v28H42z' }, 'yellow'),
    s('path', { d: 'M80 78h38v28H80z' }, 'green'),
    s('path', { d: 'M42 112h38v22H42z' }, 'purple'),
    s('path', { d: 'M80 112h38v22H80z' }, 'sky')
  ],
  vitalicio: [
    s('path', { d: 'M80 80c-14-18-46-18-46 0s32 18 46 0 46-18 46 0-32 18-46 0z', ...SW(10) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: heart(80, 112, 16) }, 'red'),
    s('path', { d: 'M38 34v10M33 39h10M122 26v10M117 31h10', ...SW(3) }, 'yellow', { stroke: true })
  ],
  voltio: [
    s('rect', { x: 46, y: 34, width: 68, height: 108, rx: 10 }, 'dark'),
    s('rect', { x: 66, y: 22, width: 28, height: 14, rx: 3 }, 'gray'),
    s('rect', { x: 46, y: 34, width: 68, height: 34, rx: 10 }, 'orange'),
    s('path', { d: 'M86 54l-20 42h14l-6 34 24-46H84z' }, 'yellow', { accent: true })
  ],
  vulgaridad: [
    s('path', { d: bubble(16, 16, 80, 54) }, 'red'),
    s('path', { d: 'M28 42l10-12 10 18 10-18 10 18 10-14 6 8', ...SW(4) }, 'dark', { stroke: true }),
    ...person(118, 140, 'mint', { h: 40 }),
    s('path', { d: 'M104 82l-6 8M132 82l6 8', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M110 76h6M120 76h6', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 118, cy: 82, r: 3 }, 'dark', { accent: true })
  ],
  abominable: [
    backdrop('sky'),
    s('path', { d: 'M44 136V70q0-44 36-44t36 44v66h-26v-20H70v20z' }, 'white', { accent: true }),
    s('path', { d: 'M44 136V70q0-44 36-44t36 44v66h-26v-20H70v20z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 46h40v24H60z' }, 'gray'),
    s('path', { d: dots([[70, 56], [90, 56]], 3.5) }, 'dark'),
    s('path', { d: 'M70 64l4 4 4-4 4 4 4-4 4 4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 80l-16 22M116 80l16 22', ...SW(10) }, 'white', { stroke: true })
  ],
  abrupto: [
    backdrop('sky'),
    s('path', { d: 'M14 54h66l6 22-8 20 10 22-6 28H14z' }, 'brown', { accent: true }),
    s('path', { d: 'M14 54h66', ...SW(6) }, 'green', { stroke: true }),
    ...person(60, 52, 'red', { h: 20, w: 14, r: 6 }),
    s('path', { d: 'M96 140q24-10 50 0', ...SW(6) }, 'blue', { stroke: true }),
    arrow('M112 40v52m-8-8 8 8 8-8', 'dark', 4)
  ],
  acoplamiento: [
    ground(130),
    s('rect', { x: 14, y: 62, width: 58, height: 50, rx: 6 }, 'red'),
    s('rect', { x: 88, y: 62, width: 58, height: 50, rx: 6 }, 'blue'),
    s('path', { d: 'M70 98h20', ...SW(8) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: dots([[30, 118], [56, 118], [104, 118], [130, 118]], 9) }, 'dark'),
    s('path', { d: rects([[24, 72, 38, 18], [98, 72, 38, 18]]) }, 'sky'),
    s('path', { d: 'M80 64v-14m-6 6 6-6 6 6', ...SW(3) }, 'orange', { stroke: true })
  ],
  adherente: [
    s('rect', { x: 18, y: 106, width: 124, height: 32, rx: 4 }, 'tan'),
    s('circle', { cx: 56, cy: 66, r: 34 }, 'yellow'),
    s('circle', { cx: 56, cy: 66, r: 18 }, 'white'),
    s('path', { d: 'M86 80q30 4 46 26h-30q-6-14-20-18z' }, 'yellow', { accent: true }),
    s('path', { d: ring(56, 66, 18), ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M108 106v12M124 106v8', ...SW(3) }, 'orange', { stroke: true })
  ],
  aliar: [
    ground(),
    ...person(46, 136, 'blue'),
    ...person(114, 136, 'red'),
    s('path', { d: 'M58 96L76 56M102 96L84 56', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: ring(72, 40, 12) + ring(88, 40, 12), ...SW(6) }, 'orange', { stroke: true, accent: true })
  ],
  amuleto: [
    s('path', { d: 'M40 20q40 60 80 0', ...SW(3) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 92, r: 42 }, 'yellow', { accent: true }),
    s('path', { d: ells([[80, 74, 11, 13], [80, 110, 11, 13], [62, 92, 13, 11], [98, 92, 13, 11]]) }, 'green'),
    s('path', { d: 'M80 92l8 26', ...SW(3) }, 'green', { stroke: true }),
    s('circle', { cx: 80, cy: 50, r: 6 }, 'orange')
  ],
  arcada: [
    s('rect', { x: 14, y: 40, width: 132, height: 100 }, 'tan', { accent: true }),
    s('path', { d: 'M24 140V82a14 14 0 0 1 28 0v58zM66 140V82a14 14 0 0 1 28 0v58zM108 140V82a14 14 0 0 1 28 0v58z' }, 'brown'),
    s('rect', { x: 10, y: 28, width: 140, height: 14 }, 'orange'),
    s('path', { d: 'M14 54h132', ...SW(3) }, 'brown', { stroke: true })
  ],
  baronesa: [
    ground(),
    ...lady(80, 136, 'purple', { accent: true }),
    s('path', { d: 'M68 64l-2-14 8 6 6-10 6 10 8-6-2 14z' }, 'yellow'),
    s('path', { d: dots([[72, 98], [80, 102], [88, 98]], 3) }, 'white'),
    s('path', { d: 'M56 88h-20M104 88h20', ...SW(6) }, 'skin', { stroke: true })
  ],
  'bufón': [
    s('circle', { cx: 80, cy: 98, r: 30 }, 'skin'),
    s('path', { d: 'M48 86q-30-14-26-56 24 16 44 40zM112 86q30-14 26-56-24 16-44 40z' }, 'red', { accent: true }),
    s('path', { d: 'M62 74q2-50 18-56 16 6 18 56z' }, 'yellow'),
    s('path', { d: dots([[22, 30], [138, 30], [80, 18]], 7) }, 'orange'),
    s('path', { d: 'M48 80h64', ...SW(8) }, 'purple', { stroke: true }),
    s('path', { d: dots([[70, 96], [90, 96]], 3) }, 'dark'),
    s('path', { d: 'M64 108q16 16 32 0', ...SW(4) }, 'dark', { stroke: true })
  ],
  cabecilla: [
    ground(),
    s('path', { d: busts([22, 46, 114, 138], 136, 20, 34) }, 'gray'),
    ...person(80, 136, 'orange', { h: 52, w: 34, r: 14, accent: true }),
    s('path', { d: star(80, 30, 12) }, 'yellow'),
    s('path', { d: 'M96 102l22-24', ...SW(7) }, 'skin', { stroke: true })
  ],
  califato: [
    ground(),
    s('rect', { x: 38, y: 82, width: 84, height: 54 }, 'cream'),
    s('path', { d: 'M48 82a32 32 0 0 1 64 0z' }, 'green', { accent: true }),
    s('rect', { x: 126, y: 46, width: 12, height: 90 }, 'tan'),
    s('path', { d: 'M124 46l8-16 8 16z' }, 'green'),
    s('path', { d: 'M70 136v-24a10 10 0 0 1 20 0v24z' }, 'brown'),
    s('path', { d: 'M28 136V94M28 94q-14-4-16 6M28 94q14-4 16 6M28 94q-8-12-18-10M28 94q8-12 18-10', ...SW(4) }, 'green', { stroke: true })
  ],
  canino: [
    s('path', { d: 'M38 40q-22 4-20 44 18 4 26-20zM122 40q22 4 20 44-18 4-26-20z' }, 'brown'),
    s('circle', { cx: 80, cy: 74, r: 46 }, 'tan'),
    s('path', { d: dots([[62, 62], [98, 62]], 5) }, 'dark'),
    s('ellipse', { cx: 80, cy: 80, rx: 10, ry: 7 }, 'dark'),
    s('path', { d: 'M54 96q26 30 52 0z' }, 'red'),
    s('path', { d: 'M60 98l6 18 6-16zM100 98l-6 18-6-16z' }, 'white', { accent: true }),
    s('path', { d: 'M60 98l6 18 6-16M100 98l-6 18-6-16', ...SW(2) }, 'gray', { stroke: true })
  ],
  capitalizar: [
    ground(),
    s('path', { d: rects([[28, 118, 34, 9], [28, 106, 34, 9], [70, 118, 34, 9], [70, 106, 34, 9], [70, 94, 34, 9], [70, 82, 34, 9]]) }, 'yellow'),
    s('path', { d: rects([[28, 126, 34, 10], [70, 126, 34, 10]]) }, 'orange'),
    s('path', { d: 'M112 136V58', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(112, 90, -40, 26, 9) + leaflet(112, 76, 220, 24, 8) }, 'green'),
    arrow('M20 70l40-30 20 14 40-34m-14 0h14v14', 'green', 6),
    s('circle', { cx: 112, cy: 52, r: 9 }, 'yellow', { accent: true })
  ],
  capricornio: [
    s('path', { d: 'M62 52q-30-20-34 12M98 52q30-20 34 12', ...SW(9) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M58 54q22-12 44 0l-4 48q-18 16-36 0z' }, 'tan'),
    s('path', { d: 'M58 62l-18 6 16 8M102 62l18 6-16 8' }, 'tan'),
    s('path', { d: dots([[70, 72], [90, 72]], 4) }, 'dark'),
    s('path', { d: 'M72 106l8 30 8-30z' }, 'cream'),
    s('ellipse', { cx: 80, cy: 98, rx: 10, ry: 6 }, 'pink')
  ],
  cardinal: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'cream'),
    s('path', { d: ring(80, 80, 60), ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 24l10 46 46 10-46 10-10 46-10-46-46-10 46-10z' }, 'navy'),
    s('path', { d: 'M80 24l10 46H70z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 6 }, 'yellow')
  ],
  centrocampista: [
    s('rect', { x: 14, y: 30, width: 132, height: 100, rx: 6 }, 'green'),
    s('path', { d: 'M80 30v100' + ring(80, 80, 24) + 'M14 58h18v44H14M146 58h-18v44h18', ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 62, r: 8 }, 'skin'),
    s('rect', { x: 72, y: 70, width: 16, height: 20, rx: 5 }, 'red', { accent: true }),
    s('circle', { cx: 92, cy: 96, r: 6 }, 'white'),
    s('path', { d: ring(92, 96, 6), ...SW(2) }, 'dark', { stroke: true })
  ],
  chocho: [
    s('path', { d: 'M24 84h112q-4 50-56 50T24 84z' }, 'brown', { accent: true }),
    s('path', { d: ells([[48, 78, 11, 8], [70, 72, 11, 8], [94, 74, 11, 8], [116, 80, 11, 8], [60, 86, 11, 8], [84, 86, 11, 8], [106, 88, 11, 8], [80, 60, 11, 8]]) }, 'yellow'),
    s('path', { d: 'M24 84h112', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: ells([[124, 40, 4, 4], [134, 50, 3, 3], [116, 52, 3, 3]]) }, 'white'),
    s('path', { d: ells([[124, 40, 4, 4], [134, 50, 3, 3], [116, 52, 3, 3]]), ...SW(1.5) }, 'gray', { stroke: true })
  ],
  cilantro: [
    s('path', { d: 'M80 140V70M80 110L52 60M80 100l30-52M80 70V30', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots([[46, 54], [56, 46], [40, 64], [52, 60]], 9) }, 'green', { accent: true }),
    s('path', { d: dots([[114, 42], [104, 36], [122, 52], [110, 50]], 9) }, 'green'),
    s('path', { d: dots([[80, 26], [70, 32], [90, 32], [80, 38]], 9) }, 'mint'),
    s('path', { d: dots([[70, 32], [90, 32]], 9), ...SW(2) }, 'green', { stroke: true })
  ],
  cinto: [
    s('path', { d: 'M14 66h132v28H14z' }, 'brown', { accent: true }),
    s('rect', { x: 52, y: 56, width: 44, height: 48, rx: 6 }, 'yellow'),
    s('rect', { x: 60, y: 64, width: 28, height: 32, rx: 3 }, 'brown'),
    s('path', { d: 'M74 80h24', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[112, 80], [126, 80], [140, 80]], 3) }, 'dark')
  ],
  clarificar: [
    s('path', { d: 'M18 62h40l-4 72H22z' }, 'brown'),
    s('path', { d: 'M102 62h40l-4 72h-32z' }, 'sky', { accent: true }),
    s('path', { d: 'M18 44h40l-4 90H22zM102 44h40l-4 90h-32z', ...SW(3) }, 'gray', { stroke: true }),
    arrow('M64 90h30m-10-10 10 10-10 10', 'orange', 5),
    s('path', { d: sparkle(126, 30, 10) }, 'yellow')
  ],
  'coagulación': [
    s('path', { d: drop(80, 90, 42) }, 'red', { accent: true }),
    s('path', { d: 'M56 90l20 20 24-30M60 108l40-26M70 76l14 38M92 76l-26 24', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[64, 96], [94, 102], [80, 82]], 4) }, 'pink')
  ],
  cobijo: [
    ground(),
    s('path', { d: 'M24 50q20-20 40 0 20-16 36 2 20 0 22 18H22q-10-10 2-20z' }, 'gray'),
    s('path', { d: 'M34 80l-6 14M60 80l-6 14M86 80l-6 14M112 80l-6 14', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M40 136l40-46 40 46z' }, 'orange', { accent: true }),
    s('path', { d: 'M80 136l-12-22h24z' }, 'brown'),
    s('circle', { cx: 80, cy: 124, r: 6 }, 'skin')
  ],
  colector: [
    s('path', { d: 'M30 20v50M80 20v50M130 20v50', ...SW(12) }, 'gray', { stroke: true }),
    s('rect', { x: 18, y: 72, width: 124, height: 34, rx: 8 }, 'dark', { accent: true }),
    s('path', { d: 'M26 89h108', ...SW(10) }, 'blue', { stroke: true }),
    s('path', { d: 'M130 106v20q0 10 10 10', ...SW(14) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 40v20M80 40v20M130 40v20', ...SW(4) }, 'sky', { stroke: true })
  ],
  combi: [
    ground(),
    s('path', { d: 'M18 120V64q0-14 14-14h82q12 0 20 14l12 22v34z' }, 'yellow', { accent: true }),
    s('path', { d: rects([[28, 60, 24, 20], [58, 60, 24, 20], [88, 60, 22, 20]]) + 'M116 60h4l12 22h-16z' }, 'sky'),
    s('path', { d: 'M18 98h128', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: dots([[44, 122], [118, 122]], 12) }, 'dark'),
    s('path', { d: dots([[44, 122], [118, 122]], 5) }, 'gray')
  ],
  compartimento: [
    s('rect', { x: 18, y: 36, width: 124, height: 96, rx: 8 }, 'blue', { accent: true }),
    s('path', { d: rects([[26, 44, 50, 36], [84, 44, 50, 36], [26, 88, 32, 36], [64, 88, 32, 36], [102, 88, 32, 36]]) }, 'cream'),
    s('path', { d: dots([[40, 62], [58, 62]], 7) }, 'red'),
    s('path', { d: 'M92 56l34 16', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: dots([[42, 106], [80, 106], [118, 106]], 8) }, 'green')
  ],
  compasivo: [
    ground(),
    ...person(52, 136, 'green', { accent: true }),
    ...person(110, 136, 'gray', { h: 36 }),
    s('path', { d: 'M62 96q20-14 36-14', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: drop(114, 82, 3) }, 'sky'),
    s('path', { d: heart(80, 40, 16) }, 'red')
  ],
  conflictivo: [
    ...face(42, 86, 28, 'red', 'frown', { accent: true }),
    ...face(118, 86, 28, 'orange', 'frown'),
    s('path', { d: 'M84 44l-10 30h14l-10 32 20-40H84z' }, 'yellow'),
    s('path', { d: 'M28 56l14 8M56 56l-14 8M104 56l14 8M132 56l-14 8', ...SW(4) }, 'dark', { stroke: true })
  ],
  cordialidad: [
    s('rect', { x: 18, y: 30, width: 50, height: 106 }, 'brown'),
    s('rect', { x: 24, y: 36, width: 38, height: 100 }, 'cream'),
    ground(),
    ...person(100, 136, 'orange', { accent: true }),
    s('path', { d: 'M86 98L66 76M114 98l20-22', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M94 72q6 6 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: heart(100, 30, 12) }, 'red')
  ],
  'cuadrilátero': [
    s('path', { d: 'M14 112l26-40h80l26 40z' }, 'sky'),
    s('path', { d: 'M14 112v18h132v-18z' }, 'navy'),
    s('path', { d: 'M40 72V40M120 72V40M14 112V80M146 112V80', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 46h80M40 58h80M14 86l26-34M14 98l26-34M146 86l-26-34M146 98l-26-34', ...SW(3) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M14 86h132M14 98h132', ...SW(3) }, 'red', { stroke: true })
  ],
  cubeta: [
    s('rect', { x: 14, y: 50, width: 132, height: 70, rx: 10 }, 'blue', { accent: true }),
    s('path', { d: rects([[22, 58, 26, 24], [54, 58, 26, 24], [86, 58, 26, 24], [118, 58, 20, 24], [22, 88, 26, 24], [54, 88, 26, 24], [86, 88, 26, 24], [118, 88, 20, 24]]) }, 'navy'),
    s('path', { d: rects([[26, 62, 18, 16], [58, 62, 18, 16], [90, 62, 18, 16], [26, 92, 18, 16], [90, 92, 18, 16], [121, 92, 14, 16]]) }, 'sky'),
    s('path', { d: 'M30 66l6 0M62 66h6M94 66h6M30 96h6', ...SW(3) }, 'white', { stroke: true })
  ],
  culinario: [
    s('path', { d: 'M52 60q-22-4-16-24 6-16 22-10 6-14 22-14t22 14q16-6 22 10 6 20-16 24z' }, 'white', { accent: true }),
    s('path', { d: 'M52 60q-22-4-16-24 6-16 22-10 6-14 22-14t22 14q16-6 22 10 6 20-16 24z', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 52, y: 58, width: 56, height: 16 }, 'cream'),
    s('path', { d: 'M52 58h56v16H52z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 96h100v24q0 18-18 18H48q-18 0-18-18z' }, 'red'),
    s('path', { d: 'M18 100h12M130 100h12', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 92q-4-6 0-12M80 92q-4-6 0-12M100 92q-4-6 0-12', ...SW(3) }, 'gray', { stroke: true })
  ],
  deliberante: [
    s('path', { d: busts([30, 62, 98, 130], 108, 24, 30) }, 'blue'),
    s('path', { d: dots([[30, 70], [62, 70], [98, 70], [130, 70]], 10) }, 'skin'),
    s('rect', { x: 14, y: 100, width: 132, height: 16, rx: 4 }, 'brown', { accent: true }),
    s('path', { d: 'M24 116v20M136 116v20', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: bubble(36, 14, 40, 30) + bubble(86, 14, 40, 30) }, 'cream'),
    s('path', { d: 'M46 28h20M96 28h20', ...SW(3) }, 'gray', { stroke: true })
  ],
  desahogo: [
    ground(),
    ...person(54, 136, 'green', { accent: true }),
    s('path', { d: 'M40 98L26 74M68 98l14-24', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M74 66q20-6 30 6 16-4 22 8t-6 20q-14 8-26 0-16 4-22-10', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: dots([[50, 62], [60, 62]], 2.5) }, 'dark'),
    s('path', { d: 'M54 72a3 3 0 0 0 6 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 84q10-10 20 0', ...SW(3) }, 'blue', { stroke: true })
  ],
  descabellado: [
    s('path', { d: 'M40 70l-20-30 26 14-4-34 18 26 8-34 12 32 16-28 2 34 22-18-8 32 28-10-24 30z' }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 92, r: 34 }, 'skin'),
    s('path', { d: spiral(64, 86) + spiral(92, 86), ...SW(3) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 80, cy: 112, rx: 10, ry: 7 }, 'dark'),
    s('path', { d: 'M46 92l-14 30M114 92l14 30', ...SW(7) }, 'skin', { stroke: true })
  ],
  descontrol: [
    s('circle', { cx: 80, cy: 80, r: 42 }, 'dark'),
    s('circle', { cx: 80, cy: 80, r: 30 }, 'white'),
    s('path', { d: 'M80 80L54 66M80 80l26-14M80 80v30', ...SW(9) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 10 }, 'red', { accent: true }),
    s('path', { d: 'M24 52a62 62 0 0 1 40-36M136 108a62 62 0 0 1-40 36', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M60 14l6 8-10 2M100 146l-6-8 10-2', ...SW(5) }, 'orange', { stroke: true })
  ],
  desplome: [
    ground(),
    s('path', { d: 'M40 134l24-104 34 8-24 104z' }, 'tan', { accent: true }),
    s('path', { d: grid(0, 0, 2, 4, 8, 10, 14, 20), transform: 'translate(54 44) rotate(13)' }, 'sky'),
    s('path', { d: rects([[94, 122, 16, 12], [114, 126, 12, 10], [128, 120, 12, 14]]) }, 'gray'),
    arrow('M124 30v56m-9-9 9 9 9-9', 'red', 6),
    s('path', { d: 'M24 126l8-6M36 132l-6-10', ...SW(3) }, 'gray', { stroke: true })
  ],
  destapar: [
    s('path', { d: 'M62 140V82q0-14 8-22V36h20v24q8 8 8 22v58z' }, 'green', { accent: true }),
    s('rect', { x: 70, y: 92, width: 20, height: 26 }, 'cream'),
    s('path', { d: 'M90 18l18-6 4 10-18 6z' }, 'yellow'),
    s('path', { d: 'M74 30l-14-12M86 26l2-14M98 32l16 2', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: dots([[64, 20], [104, 44]], 4) }, 'sky')
  ],
  disipar: [
    s('circle', { cx: 112, cy: 52, r: 26 }, 'yellow', { accent: true }),
    s('path', { d: ells([[54, 88, 26, 14], [36, 102, 16, 10], [120, 112, 18, 10], [70, 124, 12, 7]]) }, 'gray'),
    s('path', { d: 'M16 50h40q10 0 10-8M16 64h52M16 36h22', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: dots([[100, 92], [140, 132]], 4) + dots([[90, 140]], 3) }, 'gray')
  ],
  divergencia: [
    ground(),
    ...lean(64, 136, -10, 'blue'),
    ...lean(96, 136, 10, 'red', { accent: true }),
    arrow('M40 46H16m8-8-8 8 8 8', 'blue', 5),
    arrow('M120 46h24m-8-8 8 8-8 8', 'red', 5),
    s('path', { d: 'M80 20v116', ...DASH(3) }, 'gray', { stroke: true })
  ],
  divergente: [
    s('path', { d: 'M80 140V96L34 30M80 96l46-66', ...SW(20) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 136V100M80 96L40 38M80 96l40-58', ...SW(3, { 'stroke-dasharray': '8 8' }) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 96, r: 8 }, 'orange', { accent: true }),
    s('path', { d: dots([[28, 20], [132, 20]], 7) }, 'green')
  ],
  divorciar: [
    s('path', { d: heart(80, 92, 44) }, 'red', { accent: true }),
    s('path', { d: 'M80 28l-10 20 14 14-10 18 12 16-6 40', ...SW(7) }, 'white', { stroke: true }),
    s('path', { d: ring(30, 128, 10) + ring(130, 128, 10), ...SW(5) }, 'yellow', { stroke: true })
  ],
  ebriedad: [
    ground(),
    ...lean(66, 136, 16, 'purple', { accent: true }),
    s('path', { d: spiral(78, 76), ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M116 136v-30q0-6 4-10V84h8v12q4 4 4 10v30z' }, 'green'),
    s('path', { d: dots([[100, 40], [112, 30], [96, 26]], 5) }, 'pink'),
    s('path', { d: 'M88 104l22-6', ...SW(7) }, 'skin', { stroke: true })
  ],
  empalme: [
    s('path', { d: 'M14 70h40q10 0 18 8M146 90h-40q-10 0-18-8', ...SW(10) }, 'red', { stroke: true }),
    s('path', { d: 'M14 70h40M146 90h-40', ...SW(10) }, 'blue', { stroke: true }),
    s('path', { d: 'M62 74q18 18 36 0', ...SW(4) }, 'orange', { stroke: true }),
    s('rect', { x: 62, y: 62, width: 36, height: 36, rx: 6 }, 'dark', { accent: true }),
    s('path', { d: 'M70 70v20M80 70v20M90 70v20', ...SW(3) }, 'gray', { stroke: true })
  ],
  'encíclica': [
    s('circle', { cx: 104, cy: 56, r: 38 }, 'sky'),
    s('path', { d: 'M88 34q14-6 22 4t-4 18q-10 4-14 14-10-14-4-36zM118 64q10 2 12 12-8 10-16 4z' }, 'green'),
    s('rect', { x: 26, y: 60, width: 72, height: 80, rx: 4 }, 'cream', { accent: true }),
    s('path', { d: 'M26 64h72v76H26z', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M38 80h48M38 94h48M38 108h30', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 84, cy: 124, r: 10 }, 'red')
  ],
  enfurecer: [
    ...face(80, 92, 44, 'red', 'frown', { accent: true }),
    s('path', { d: 'M52 72l18 8M108 72l-18 8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M36 40q-8-10 0-20t0-18M124 40q8-10 0-20t0-18', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 30l6-14 6 14', ...SW(5) }, 'orange', { stroke: true })
  ],
  exageradamente: [
    ground(),
    ...person(80, 136, 'blue', { accent: true }),
    s('path', { d: 'M66 98L20 84M94 98l46-14', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M24 70v28M136 70v28', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M76 36q8-8 16 0-8 8-16 0zM76 36l-8-5v10z' }, 'orange'),
    s('path', { d: 'M74 58q6 6 12 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  'exprés': [
    s('path', { d: 'M14 120V76q0-14 14-14h58q44 0 60 40v18z' }, 'white', { accent: true }),
    s('path', { d: 'M14 120V76q0-14 14-14h58q44 0 60 40v18z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 70q24 4 36 26h-36z' }, 'navy'),
    s('path', { d: 'M14 104h132', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: rects([[26, 74, 16, 12], [50, 74, 16, 12], [74, 74, 16, 12]]) }, 'sky'),
    s('path', { d: 'M20 40h40M14 52h28M70 46h30M20 138h120', ...SW(4) }, 'gray', { stroke: true })
  ],
  falsificar: [
    s('rect', { x: 34, y: 34, width: 110, height: 60, rx: 6 }, 'mint'),
    s('rect', { x: 16, y: 54, width: 110, height: 60, rx: 6 }, 'green', { accent: true }),
    s('circle', { cx: 71, cy: 84, r: 16 }, 'mint'),
    s('path', { d: 'M24 62h10M108 106h10', ...SW(4) }, 'mint', { stroke: true }),
    s('path', { d: 'M96 128l40-40 8 8-40 40-12 4z' }, 'orange'),
    s('path', { d: 'M136 88l8 8', ...SW(4) }, 'dark', { stroke: true })
  ],
  federativo: [
    s('path', { d: 'M80 80L34 40M80 80l46-40M80 80l-46 40M80 80l46 40', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 24 }, 'navy', { accent: true }),
    s('path', { d: dots([[34, 40], [126, 120]], 18) }, 'green'),
    s('path', { d: dots([[126, 40], [34, 120]], 18) }, 'orange'),
    s('path', { d: star(80, 80, 12) }, 'yellow')
  ],
  gendarme: [
    ground(),
    ...person(80, 136, 'navy', { h: 56, w: 36, r: 14, accent: true }),
    s('path', { d: 'M64 50v-16h32v16z' }, 'navy'),
    s('path', { d: 'M60 52h40', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M70 36h20', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: star(70, 96, 6) }, 'yellow'),
    s('path', { d: 'M62 116h36', ...SW(4) }, 'dark', { stroke: true })
  ],
  grabador: [
    s('rect', { x: 16, y: 50, width: 128, height: 82, rx: 10 }, 'gray'),
    s('rect', { x: 28, y: 62, width: 104, height: 40, rx: 6 }, 'dark'),
    s('path', { d: dots([[56, 82], [104, 82]], 13) }, 'white'),
    s('path', { d: dots([[56, 82], [104, 82]], 5) }, 'dark'),
    s('path', { d: rects([[30, 112, 18, 12], [54, 112, 18, 12], [78, 112, 18, 12]]) }, 'navy'),
    s('circle', { cx: 120, cy: 118, r: 7 }, 'red', { accent: true }),
    s('path', { d: 'M40 50L52 28h56l12 22', ...SW(5) }, 'dark', { stroke: true })
  ],
  grandote: [
    ground(),
    ...person(60, 136, 'blue', { h: 74, w: 52, r: 20, accent: true }),
    ...person(122, 136, 'orange', { h: 26, w: 18, r: 8 }),
    s('path', { d: 'M52 34q8 6 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  iluso: [
    s('path', { d: 'M54 50q-10-18 10-24 6-14 26-10 20-8 30 8 20 2 16 22 0 18-24 18H66q-16 0-12-14z' }, 'sky'),
    s('path', { d: 'M76 58V38h8v6h6v-6h8v6h6v-6h8v20z' }, 'pink', { accent: true }),
    s('path', { d: dots([[54, 82], [46, 94]], 5) }, 'sky'),
    s('circle', { cx: 40, cy: 112, r: 14 }, 'skin'),
    s('rect', { x: 22, y: 128, width: 36, height: 14, rx: 6 }, 'yellow'),
    s('path', { d: 'M36 110q4 4 8 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(130, 22, 8) }, 'yellow')
  ],
  indestructible: [
    s('path', { d: 'M80 140q-46-16-46-70V36l46-16 46 16v34q0 54-46 70z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 128q-34-14-34-58V44l34-12z' }, 'sky'),
    s('path', { d: 'M110 34l26-22 10 12-26 22z' }, 'gray'),
    s('path', { d: 'M116 40l-18 20', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: burst(100, 66, 14, 6, 8) }, 'yellow')
  ],
  inferir: [
    s('path', { d: ells([[28, 130, 6, 9], [44, 112, 6, 9], [52, 90, 6, 9], [70, 74, 6, 9]]) }, 'brown'),
    s('circle', { cx: 112, cy: 48, r: 24 }, 'yellow', { accent: true }),
    s('rect', { x: 102, y: 72, width: 20, height: 14, rx: 3 }, 'gray'),
    s('path', { d: halfRays(112, 48, 30, 40, 5), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: ring(104, 116, 16), ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M116 128l16 14', ...SW(8) }, 'dark', { stroke: true })
  ],
  'ingestión': [
    s('path', { d: 'M40 140v-64q0-50 40-50t40 50v64z' }, 'skin'),
    s('path', { d: 'M74 64q6 8 12 0' , ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 70v26', ...SW(4, { 'stroke-dasharray': '4 6' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 100q-10 0-10 12t14 16 26-4q6-12-6-22-12-4-24-2z' }, 'pink', { accent: true }),
    s('rect', { x: 72, y: 40, width: 16, height: 9, rx: 4.5 }, 'blue'),
    s('path', { d: dots([[66, 48], [94, 48]], 3) }, 'dark')
  ],
  inhabilitar: [
    ground(),
    ...person(52, 136, 'green'),
    s('path', { d: 'M64 96l34-30', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 92, y: 26, width: 30, height: 42, rx: 4, transform: 'rotate(12 107 47)' }, 'red', { accent: true }),
    ...person(118, 136, 'gray', { h: 36, w: 24, r: 10 }),
    s('path', { d: 'M108 82q10-6 20 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  intencionado: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'red'),
    s('circle', { cx: 80, cy: 80, r: 42 }, 'white'),
    s('circle', { cx: 80, cy: 80, r: 24 }, 'red'),
    s('circle', { cx: 80, cy: 80, r: 9 }, 'yellow', { accent: true }),
    s('path', { d: 'M82 78l52-52', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M126 22l14-4-4 14M120 28l14-4-4 14', ...SW(4) }, 'orange', { stroke: true })
  ],
  inutilidad: [
    s('path', { d: 'M18 76q62-70 124 0z' }, 'purple', { accent: true }),
    s('path', { d: dots([[46, 62], [80, 46], [108, 64]], 7) }, 'white'),
    s('path', { d: 'M80 76v52q0 10-10 10t-10-10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M46 72v12M80 56v14M108 74v12M46 96v10M108 98v10M30 20v10M80 18v10M120 20v10', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M80 34V24', ...SW(4) }, 'dark', { stroke: true })
  ],
  'inverosímil': [
    backdrop('sky'),
    s('path', { d: ells([[30, 124, 18, 8], [128, 118, 14, 6]]) }, 'white'),
    s('ellipse', { cx: 80, cy: 86, rx: 40, ry: 26 }, 'pink', { accent: true }),
    s('path', { d: 'M74 70q-26-40-46-26 10 20 34 30zM90 70q26-40 46-26-10 20-34 30z' }, 'white'),
    s('ellipse', { cx: 120, cy: 84, rx: 10, ry: 12 }, 'pink'),
    s('path', { d: dots([[118, 80], [124, 88]], 2) + dots([[106, 76]], 2.5) }, 'dark'),
    s('path', { d: 'M56 108v12M72 110v12M92 110v12M106 106v12M40 84q-10 0-8-8', ...SW(5) }, 'pink', { stroke: true })
  ],
  justiciero: [
    ground(),
    s('path', { d: 'M68 72L40 136h80L92 72z' }, 'red'),
    ...person(80, 136, 'navy', { h: 52, w: 32, r: 14, accent: true }),
    s('rect', { x: 66, y: 64, width: 28, height: 9, rx: 4 }, 'black'),
    s('path', { d: dots([[73, 68], [87, 68]], 2.2) }, 'white'),
    s('path', { d: star(80, 108, 9) }, 'yellow')
  ],
  kurdo: [
    s('circle', { cx: 80, cy: 64, r: 22 }, 'yellow', { accent: true }),
    s('path', { d: halfRays(80, 64, 28, 38, 7), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M14 136l40-56 26 30 24-36 42 62z' }, 'brown'),
    s('path', { d: 'M40 100l14-20 10 12zM96 86l8-12 10 14z' }, 'white'),
    s('path', { d: 'M14 136q66-20 132 0z' }, 'green')
  ],
  lacayo: [
    ground(),
    ...person(64, 136, 'black', { h: 52, w: 32, r: 13, accent: true }),
    s('path', { d: 'M58 86l6 8 6-8', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M78 98h30', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M94 94h44', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 94a16 16 0 0 1 32 0z' }, 'gray'),
    s('path', { d: 'M116 74v4', ...SW(4) }, 'dark', { stroke: true })
  ],
  lacio: [
    s('path', { d: 'M38 140V70q0-48 42-48t42 48v70z' }, 'brown', { accent: true }),
    s('ellipse', { cx: 80, cy: 82, rx: 28, ry: 34 }, 'skin'),
    s('path', { d: 'M52 72q0-30 28-30t28 30q-16-14-56 0z' }, 'brown'),
    s('path', { d: dots([[70, 86], [90, 86]], 3) }, 'dark'),
    s('path', { d: 'M72 100q8 6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 90v48M112 90v48', ...SW(2) }, 'tan', { stroke: true })
  ],
  lactosa: [
    s('path', { d: 'M40 40h50l-6 96H46z' }, 'white', { accent: true }),
    s('path', { d: 'M40 40h50l-6 96H46z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M42 58h46', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: rects([[100, 108, 26, 26], [112, 80, 26, 26]]) }, 'white'),
    s('path', { d: rects([[100, 108, 26, 26], [112, 80, 26, 26]]), ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: sparkle(122, 48, 10) }, 'yellow')
  ],
  lechero: [
    s('path', { d: 'M54 140V62q0-10 8-14V30h36v18q8 4 8 14v78z' }, 'gray'),
    s('rect', { x: 58, y: 22, width: 44, height: 12, rx: 4 }, 'dark'),
    s('path', { d: 'M54 76h52v36H54z' }, 'white', { accent: true }),
    s('path', { d: ells([[68, 90, 7, 5], [92, 100, 6, 7]]) }, 'black'),
    s('path', { d: 'M42 68q-8 0-8 10t8 10M118 68q8 0 8 10t-8 10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 76h52v36H54z', ...SW(2) }, 'gray', { stroke: true })
  ],
  'libanés': [
    ground(),
    s('rect', { x: 74, y: 108, width: 12, height: 28 }, 'brown'),
    s('path', { d: 'M80 20l26 22H54zM80 38l40 30H40zM80 64l56 44H24z' }, 'green', { accent: true }),
    s('path', { d: 'M80 20v88', ...SW(3) }, 'brown', { stroke: true })
  ],
  lugarteniente: [
    ground(),
    ...person(54, 136, 'navy', { h: 54, w: 36, r: 14 }),
    s('path', { d: 'M40 52h28v-10H40z' }, 'navy'),
    s('path', { d: star(54, 98, 8) }, 'yellow'),
    ...person(112, 136, 'green', { h: 40, w: 28, r: 11, accent: true }),
    s('path', { d: 'M102 104h12M102 110h12', ...SW(3) }, 'yellow', { stroke: true }),
    s('rect', { x: 120, y: 96, width: 18, height: 24, rx: 2 }, 'cream')
  ],
  medallista: [
    s('path', { d: rects([[56, 100, 48, 40], [14, 116, 42, 24], [104, 122, 42, 18]]) }, 'gray'),
    ...person(80, 100, 'blue', { h: 40, w: 28, r: 12 }),
    s('path', { d: 'M72 60l8 18 8-18', ...SW(3) }, 'red', { stroke: true }),
    s('circle', { cx: 80, cy: 82, r: 8 }, 'yellow', { accent: true }),
    s('path', { d: 'M66 66L52 40M94 66l14-26', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: star(80, 120, 8) }, 'yellow')
  ],
  melodrama: [
    s('path', { d: 'M24 34q36-12 72 0v40q-4 36-36 40-32-4-36-40z' }, 'purple', { accent: true }),
    s('path', { d: 'M40 56q8-6 16 0M64 56q8-6 16 0', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M44 92q16-14 32 0', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: drop(48, 74, 5) + drop(74, 74, 5) }, 'sky'),
    ...note(118, 116, 'red'),
    s('path', { d: 'M110 40q10-14 20 0t20 0', ...SW(4) }, 'pink', { stroke: true })
  ],
  'militarización': [
    ground(),
    s('path', { d: busts([30, 62, 98, 130], 136, 26, 50) }, 'green', { accent: true }),
    s('path', { d: dots([[30, 74], [62, 74], [98, 74], [130, 74]], 10) }, 'skin'),
    s('path', { d: 'M18 70a12 12 0 0 1 24 0zM50 70a12 12 0 0 1 24 0zM86 70a12 12 0 0 1 24 0zM118 70a12 12 0 0 1 24 0z' }, 'dark'),
    s('path', { d: 'M16 70h28M48 70h28M84 70h28M116 70h28', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 20v28', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 20h24l-6 6 6 6H80z' }, 'red')
  ],
  molusco: [
    ground(),
    s('path', { d: 'M18 136q0-12 14-14h80q14 0 18-22l8 4q-4 32-26 32z' }, 'tan'),
    s('circle', { cx: 70, cy: 90, r: 34 }, 'orange', { accent: true }),
    s('path', { d: 'M70 90a6 6 0 0 1 12 0 14 14 0 0 1-26 0 22 22 0 0 1 44 0', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M126 102l-4-22M134 104l6-20', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: dots([[122, 78], [140, 82]], 4) }, 'dark')
  ],
  muleta: [
    s('path', { d: 'M62 34l-6 56M98 34l6 56', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 56, y: 22, width: 48, height: 14, rx: 7 }, 'dark'),
    s('path', { d: 'M56 90h48l-16 16h-16z' }, 'gray'),
    s('path', { d: 'M80 104v34', ...SW(8) }, 'gray', { stroke: true, accent: true }),
    s('rect', { x: 62, y: 66, width: 36, height: 10, rx: 4 }, 'blue'),
    s('rect', { x: 72, y: 134, width: 16, height: 8, rx: 3 }, 'dark')
  ],
  nitrato: [
    ground(),
    s('path', { d: 'M24 136V58q0-8 8-10l16-4 16 4q8 2 8 10v78z' }, 'tan'),
    s('path', { d: 'M24 74h48v34H24z' }, 'green', { accent: true }),
    s('path', { d: 'M48 80l6 10-6 10-6-10z' }, 'white'),
    s('path', { d: 'M114 136V82', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(114, 100, -30, 28, 10) + leaflet(114, 88, 210, 26, 9) + leaflet(114, 82, -90, 22, 8) }, 'green'),
    s('path', { d: 'M90 126l4-6 4 6-4 6zM132 124l4-6 4 6-4 6zM100 112l3-4 3 4-3 4z' }, 'sky')
  ],
  'nostálgico': [
    s('rect', { x: 34, y: 18, width: 92, height: 76, rx: 4 }, 'cream'),
    s('rect', { x: 42, y: 26, width: 76, height: 60 }, 'tan'),
    s('path', { d: 'M56 86V60l24-18 24 18v26z' }, 'brown'),
    s('path', { d: 'M34 18h92v76H34z', ...SW(3) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 122, r: 16 }, 'skin'),
    s('path', { d: 'M70 122q4-4 8 0M82 122q4-4 8 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: drop(92, 132, 3) }, 'sky', { accent: true }),
    s('path', { d: heart(130, 116, 10) }, 'pink')
  ],
  novel: [
    s('path', { d: 'M44 104q0-36 36-36t36 36q0 36-36 36t-36-36z' }, 'cream'),
    s('path', { d: 'M44 104l10-10 10 10 10-10 10 10 10-10 10 10 10-10 6 10', ...SW(4) }, 'tan', { stroke: true }),
    s('circle', { cx: 80, cy: 76, r: 26 }, 'yellow', { accent: true }),
    s('path', { d: dots([[72, 72], [90, 72]], 3) }, 'dark'),
    s('path', { d: 'M76 80h10l-5 7z' }, 'orange'),
    s('path', { d: 'M54 40a20 14 0 0 1 52 0l-6 10-10-8-8 10-10-10-10 8z' }, 'cream'),
    s('path', { d: sparkle(130, 40, 9) }, 'yellow')
  ],
  nutricionista: [
    ground(),
    ...person(60, 136, 'mint', { h: 52, w: 34, r: 14 }),
    s('path', { d: 'M54 84l6 10 6-10', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M74 100l26-12', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 112, cy: 82, r: 14 }, 'red', { accent: true }),
    s('path', { d: 'M112 68q0-8 8-10', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M54 60h12', ...SW(3) }, 'dark', { stroke: true })
  ],
  nutritivo: [
    s('ellipse', { cx: 80, cy: 110, rx: 64, ry: 20 }, 'white'),
    s('path', { d: ells([[80, 110, 64, 20]]), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 108l22-64 12 8z' }, 'orange', { accent: true }),
    s('path', { d: 'M70 46l-2-14M76 48l10-10', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M110 108V82', ...SW(8) }, 'green', { stroke: true }),
    s('path', { d: dots([[96, 72], [110, 64], [124, 72], [104, 82], [118, 82]], 11) }, 'green'),
    s('path', { d: sparkle(30, 40, 9) + sparkle(138, 34, 7) }, 'yellow')
  ],
  'patógeno': [
    s('path', { d: rays(80, 80, 30, 50, 10), ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: dots(around(80, 80, 52, 10), 7) }, 'green'),
    s('circle', { cx: 80, cy: 80, r: 34 }, 'green', { accent: true }),
    s('path', { d: dots([[68, 70], [92, 74], [78, 94]], 6) }, 'mint'),
    s('path', { d: 'M68 70l24 4-14 20z', ...SW(2) }, 'dark', { stroke: true })
  ],
  paulatino: [
    s('path', { d: rects([[18, 120, 24, 18], [44, 106, 24, 32], [70, 92, 24, 46], [96, 78, 24, 60], [122, 64, 24, 74]]) }, 'tan'),
    s('path', { d: 'M18 120h24v-14h26V92h26V78h26V64h26', ...SW(4) }, 'brown', { stroke: true }),
    ...person(56, 106, 'blue', { h: 26, w: 18, r: 8, accent: true }),
    arrow('M30 42q50-26 100-20m-10-8 10 8-10 8', 'orange', 4)
  ],
  pertinencia: [
    s('path', { d: 'M20 40h120v96H20z' }, 'blue'),
    s('path', { d: 'M60 70h14a8 8 0 1 1 12 0h14v14a8 8 0 1 0 0 12v14H60z' }, 'navy'),
    s('path', { d: 'M60 70h14a8 8 0 1 1 12 0h14v14a8 8 0 1 0 0 12v14H60z', transform: 'translate(0 -40)' }, 'yellow', { accent: true }),
    arrow('M120 30v34m-8-8 8 8 8-8', 'orange', 4)
  ],
  picadura: [
    s('rect', { x: 14, y: 96, width: 132, height: 44, rx: 18 }, 'skin'),
    s('circle', { cx: 70, cy: 110, r: 14 }, 'pink', { accent: true }),
    s('circle', { cx: 70, cy: 110, r: 4 }, 'red'),
    s('ellipse', { cx: 110, cy: 50, rx: 16, ry: 7, transform: 'rotate(-20 110 50)' }, 'dark'),
    s('path', { d: 'M110 50q-10-26 16-30M110 50q14-24 30-12', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 56L80 72M104 58l-4 18M116 58l6 16', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 96l-6-8M92 96l6-8', ...SW(3) }, 'red', { stroke: true })
  ],
  pistolero: [
    ground(),
    s('path', { d: 'M128 136V90M128 106h10v-14M128 112h-10v-12', ...SW(8) }, 'green', { stroke: true }),
    ...person(70, 136, 'brown', { h: 52, w: 32, r: 13 }),
    s('path', { d: 'M42 52h56l-8-6V34q-20-8-40 0v12z' }, 'dark', { accent: true }),
    s('path', { d: 'M54 104h32', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M78 106h12v16l-6 2z' }, 'black'),
    s('path', { d: 'M60 80l20 18 20-18', ...SW(3) }, 'red', { stroke: true })
  ],
  polilla: [
    s('path', { d: 'M80 14v18', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 32h36l-6 14H68z' }, 'dark'),
    s('circle', { cx: 80, cy: 54, r: 10 }, 'yellow', { accent: true }),
    s('path', { d: 'M80 96q-30-26-52-6 4 22 52 12zM80 96q30-26 52-6-4 22-52 12zM80 102q-26 20-12 34 10-6 12-30zM80 102q26 20 12 34-10-6-12-30z' }, 'tan'),
    s('ellipse', { cx: 80, cy: 102, rx: 6, ry: 16 }, 'brown'),
    s('path', { d: 'M76 88l-8-12M84 88l8-12', ...SW(2) }, 'brown', { stroke: true })
  ],
  'politólogo': [
    s('path', { d: dots(seats(46, 7), 7) }, 'blue'),
    s('path', { d: dots(seats(30, 5), 7) }, 'red', { accent: true }),
    s('path', { d: dots(seats(62, 9), 6) }, 'green'),
    s('circle', { cx: 80, cy: 108, r: 10 }, 'skin'),
    s('path', { d: 'M62 140v-10a18 18 0 0 1 36 0v10z' }, 'navy'),
    s('path', { d: 'M98 128l26-30', ...SW(3) }, 'dark', { stroke: true })
  ],
  pomo: [
    s('rect', { x: 26, y: 14, width: 80, height: 132 }, 'brown'),
    s('path', { d: rects([[36, 24, 60, 46], [36, 82, 60, 54]]), ...SW(3) }, 'tan', { stroke: true }),
    s('circle', { cx: 112, cy: 80, r: 18 }, 'yellow', { accent: true }),
    s('rect', { x: 92, y: 74, width: 12, height: 12 }, 'orange'),
    s('circle', { cx: 106, cy: 74, r: 5 }, 'cream')
  ],
  precandidato: [
    ground(),
    ...person(54, 136, 'orange', { h: 50, w: 32, r: 13 }),
    s('path', { d: 'M40 90l28 22', ...SW(6) }, 'red', { stroke: true }),
    s('rect', { x: 92, y: 90, width: 46, height: 46, rx: 4 }, 'blue'),
    s('path', { d: 'M104 90h22', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 104, y: 60, width: 22, height: 26, rx: 2 }, 'white', { accent: true }),
    s('path', { d: 'M104 60h22v26h-22z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 74l5 5 9-10', ...SW(3) }, 'green', { stroke: true })
  ],
  predilecto: [
    s('path', { d: 'M18 100h32l-4 32H22zM64 100h32l-4 32H68zM110 100h32l-4 32h-24z' }, 'tan'),
    s('path', { d: ells([[34, 96, 18, 12], [126, 96, 18, 12]]) }, 'pink'),
    s('ellipse', { cx: 80, cy: 94, rx: 20, ry: 14 }, 'purple', { accent: true }),
    s('circle', { cx: 80, cy: 78, r: 5 }, 'red'),
    s('path', { d: heart(80, 48, 16) }, 'red'),
    s('path', { d: 'M54 40l-8-6M106 40l8-6', ...SW(3) }, 'orange', { stroke: true })
  ],
  preponderante: [
    s('path', { d: 'M80 34v94M54 140h52', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 50l104 32', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 50l-16 30h32zM132 82l-16 30h32z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M12 80h32q-16 12-32 0zM116 112h32q-16 12-32 0z' }, 'gray'),
    s('rect', { x: 114, y: 84, width: 36, height: 28, rx: 4 }, 'red', { accent: true }),
    s('rect', { x: 22, y: 70, width: 12, height: 10, rx: 2 }, 'yellow')
  ],
  primate: [
    s('path', { d: dots([[38, 72], [122, 72]], 16) }, 'brown'),
    s('circle', { cx: 80, cy: 76, r: 44 }, 'brown', { accent: true }),
    s('path', { d: dots([[38, 72], [122, 72]], 9) }, 'tan'),
    s('path', { d: 'M52 76q0-24 28-18 28-6 28 18 6 34-28 42-34-8-28-42z' }, 'tan'),
    s('path', { d: dots([[68, 72], [92, 72]], 5) }, 'dark'),
    s('path', { d: 'M72 92h4M84 92h4M68 104q12 8 24 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  'protagónico': [
    s('path', { d: 'M24 14l40 0 50 122H18z' }, 'cream'),
    s('ellipse', { cx: 66, cy: 132, rx: 46, ry: 8 }, 'yellow'),
    ...person(66, 132, 'red', { h: 46, w: 30, r: 13, accent: true }),
    s('path', { d: 'M52 96L38 70M80 96l14-26', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M118 14q8 60 28 126V14z' }, 'purple')
  ],
  psicoterapia: [
    s('path', { d: 'M14 120V96q0-10 10-10h40q10 0 10 10v8h12V120z' }, 'purple'),
    s('path', { d: 'M18 120v12M82 120v12', ...SW(5) }, 'brown', { stroke: true }),
    s('circle', { cx: 30, cy: 78, r: 11 }, 'skin'),
    s('rect', { x: 40, y: 84, width: 40, height: 16, rx: 8 }, 'blue', { accent: true }),
    ...person(120, 136, 'green', { h: 40, w: 28, r: 11 }),
    s('rect', { x: 96, y: 96, width: 16, height: 20, rx: 2 }, 'cream'),
    s('path', { d: bubble(36, 18, 52, 38) }, 'sky')
  ],
  recluir: [
    s('rect', { x: 18, y: 18, width: 124, height: 124, rx: 6 }, 'gray'),
    ...person(80, 142, 'orange', { h: 50, w: 34, r: 14, accent: true }),
    s('path', { d: 'M38 18v124M60 18v124M100 18v124M122 18v124', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 18h124', ...SW(8) }, 'dark', { stroke: true })
  ],
  'rectoría': [
    ground(),
    s('path', { d: 'M16 60l64-32 64 32z' }, 'navy', { accent: true }),
    s('rect', { x: 22, y: 60, width: 116, height: 10 }, 'cream'),
    s('path', { d: 'M34 70v58M58 70v58M102 70v58M126 70v58', ...SW(9) }, 'cream', { stroke: true }),
    s('path', { d: 'M70 128v-30h20v30z' }, 'brown'),
    s('rect', { x: 18, y: 126, width: 124, height: 10 }, 'gray'),
    s('path', { d: 'M66 46l14-6 14 6-14 6zM88 46v8', ...SW(2) }, 'yellow', { stroke: true })
  ],
  religiosamente: [
    s('rect', { x: 14, y: 30, width: 92, height: 92, rx: 6 }, 'white'),
    s('path', { d: 'M14 30h92v92H14z', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 14, y: 30, width: 92, height: 18, rx: 4 }, 'red'),
    s('path', { d: 'M22 64l4 4 7-8M50 64l4 4 7-8M78 64l4 4 7-8M22 88l4 4 7-8M50 88l4 4 7-8M78 88l4 4 7-8M22 110l4 4 7-8M50 110l4 4 7-8', ...SW(3) }, 'green', { stroke: true, accent: true }),
    s('circle', { cx: 118, cy: 116, r: 26 }, 'yellow'),
    s('path', { d: 'M118 100v16l10 6', ...SW(4) }, 'dark', { stroke: true })
  ],
  repeler: [
    s('path', { d: 'M20 52h34v20H34v16h20v20H20z' }, 'red', { accent: true }),
    s('path', { d: 'M140 52h-34v20h20v16h-20v20h34z' }, 'red'),
    s('path', { d: 'M20 88h34v20H20zM106 88h34v20h-34z' }, 'gray'),
    s('path', { d: 'M74 66l-8 14 8 14M86 66l8 14-8 14', ...SW(4) }, 'blue', { stroke: true }),
    arrow('M30 38H14m6-6-6 6 6 6M130 38h16m-6-6 6 6-6 6', 'dark', 4)
  ],
  retrete: [
    s('rect', { x: 88, y: 22, width: 40, height: 46, rx: 6 }, 'white'),
    s('path', { d: 'M88 22h40v46H88z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 72h98q0 34-30 44l6 22H58l4-24q-32-14-32-42z' }, 'white', { accent: true }),
    s('path', { d: 'M30 72h98q0 34-30 44l6 22H58l4-24q-32-14-32-42z', ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 72, cy: 72, rx: 42, ry: 8 }, 'sky'),
    s('rect', { x: 112, y: 30, width: 10, height: 5, rx: 2 }, 'gray')
  ],
  'ruiseñor': [
    backdrop('navy'),
    s('path', { d: 'M110 30a14 14 0 1 0 14 22 12 12 0 0 1-14-22z' }, 'cream'),
    s('path', { d: 'M14 112q60-8 120 6', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M38 100q0-24 26-24 10-14 22-4l10 2-8 6q2 22-24 24l-30 8z' }, 'tan', { accent: true }),
    s('circle', { cx: 80, cy: 78, r: 2.5 }, 'dark'),
    ...note(118, 76, 'yellow')
  ],
  salitre: [
    s('rect', { x: 14, y: 20, width: 132, height: 120 }, 'tan'),
    s('path', { d: rects([[14, 36, 132, 2], [14, 60, 132, 2], [14, 84, 132, 2], [14, 108, 132, 2], [54, 20, 2, 16], [104, 36, 2, 24], [40, 60, 2, 24], [90, 84, 2, 24]]) }, 'brown'),
    s('path', { d: 'M14 140v-36q14-10 24 0 12-16 26-2 14-12 26 0 16-14 28 2 14-10 28 4v32z' }, 'white', { accent: true }),
    s('path', { d: 'M14 104q14-10 24 0 12-16 26-2 14-12 26 0 16-14 28 2 14-10 28 4', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: sparkle(40, 120, 6) + sparkle(100, 124, 6) }, 'sky')
  ],
  saqueador: [
    ground(),
    ...person(66, 136, 'dark', { h: 48, w: 30, r: 13, accent: true }),
    s('rect', { x: 54, y: 66, width: 24, height: 7, rx: 3 }, 'black'),
    s('path', { d: 'M86 48q-12 30 6 50h28q16-22 2-50z' }, 'tan'),
    s('path', { d: 'M92 48q12-12 24 0', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 100l12-8', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M14 104h24M20 118h22', ...SW(3) }, 'gray', { stroke: true })
  ],
  seccional: [
    ground(),
    s('rect', { x: 26, y: 62, width: 108, height: 74 }, 'sky'),
    s('path', { d: 'M20 62h120v-12H20z' }, 'navy', { accent: true }),
    s('path', { d: 'M68 136v-36h24v36z' }, 'navy'),
    s('path', { d: rects([[36, 76, 22, 16], [102, 76, 22, 16]]) }, 'white'),
    s('path', { d: 'M70 50V36a10 10 0 0 1 20 0v14z' }, 'blue'),
    s('path', { d: 'M60 24l-8-6M100 24l8-6M80 18V8', ...SW(3) }, 'red', { stroke: true })
  ],
  'simbología': [
    s('rect', { x: 18, y: 18, width: 124, height: 124, rx: 8 }, 'cream'),
    s('circle', { cx: 50, cy: 50, r: 18 }, 'red', { accent: true }),
    s('path', { d: 'M110 30l20 36H90z' }, 'blue'),
    s('path', { d: star(50, 110, 20) }, 'yellow'),
    s('rect', { x: 92, y: 92, width: 36, height: 36, rx: 4 }, 'green'),
    s('path', { d: 'M18 18h124v124H18zM80 18v124M18 80h124', ...SW(2) }, 'tan', { stroke: true })
  ],
  subdesarrollo: [
    s('rect', { x: 14, y: 110, width: 132, height: 30 }, 'tan'),
    s('path', { d: 'M30 118l10 8-4 10M90 114l8 12 10-2M120 126l10-8', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M66 110V92', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(66, 96, 150, 14, 5) + leaflet(66, 94, 40, 12, 4) }, 'green'),
    s('path', { d: rects([[96, 92, 12, 18], [114, 98, 12, 12], [132, 104, 10, 6]]) }, 'orange', { accent: true }),
    s('circle', { cx: 38, cy: 46, r: 18 }, 'yellow'),
    arrow('M96 40l20 20 20-4', 'red', 4)
  ],
  subversivo: [
    ground(),
    s('path', { d: 'M24 64l92-36 8 22-92 36z' }, 'navy'),
    s('path', { d: 'M48 50l20-8-6-18-12 6z' }, 'yellow'),
    ...person(76, 136, 'orange', { h: 40, w: 28, r: 12, accent: true }),
    s('path', { d: 'M64 100l-6-30M88 100l4-36', ...SW(7) }, 'skin', { stroke: true }),
    arrow('M120 116V74m-8 8 8-8 8 8', 'red', 5)
  ],
  'succión': [
    s('path', { d: 'M44 64h72l-8 76H52z' }, 'sky'),
    s('path', { d: 'M48 96h64l-4 44H52z' }, 'orange'),
    s('path', { d: 'M44 64h72l-8 76H52z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 128V30l20-14', ...SW(8) }, 'red', { stroke: true, accent: true }),
    arrow('M124 80V44m-8 8 8-8 8 8', 'blue', 4),
    arrow('M36 80V44m-8 8 8-8 8 8', 'blue', 4)
  ],
  tajada: [
    s('path', { d: 'M18 56h124a62 62 0 0 1-124 0z' }, 'green'),
    s('path', { d: 'M26 56h108a54 54 0 0 1-108 0z' }, 'mint'),
    s('path', { d: 'M32 56h96a48 48 0 0 1-96 0z' }, 'red', { accent: true }),
    s('path', { d: ells([[56, 72, 3, 5], [80, 80, 3, 5], [104, 72, 3, 5], [68, 92, 3, 5], [92, 92, 3, 5]]) }, 'dark')
  ],
  tecno: [
    s('rect', { x: 14, y: 76, width: 132, height: 56, rx: 8 }, 'dark'),
    s('path', { d: dots([[48, 104], [112, 104]], 22) }, 'black'),
    s('path', { d: dots([[48, 104], [112, 104]], 7) }, 'purple', { accent: true }),
    s('path', { d: 'M74 92v24M86 92v24', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 56l10-24 10 24 10-24 10 24 10-24 10 24 10-24 10 24 10-24 10 24', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M58 18l-6 8M102 18l6 8', ...SW(3) }, 'pink', { stroke: true })
  ],
  tedioso: [
    ...face(64, 90, 40, 'yellow', 'flat', { accent: true }),
    s('path', { d: 'M44 82h16M68 82h16', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 124, cy: 38, r: 22 }, 'white'),
    s('path', { d: ring(124, 38, 22) + 'M124 24v14h10', ...SW(4) }, 'dark', { stroke: true })
  ],
  temario: [
    s('rect', { x: 32, y: 24, width: 96, height: 118, rx: 6 }, 'brown'),
    s('rect', { x: 40, y: 34, width: 80, height: 100, rx: 3 }, 'white'),
    s('rect', { x: 62, y: 18, width: 36, height: 14, rx: 4 }, 'gray'),
    s('path', { d: rects([[48, 48, 10, 10], [48, 72, 10, 10], [48, 96, 10, 10]]) }, 'blue', { accent: true }),
    s('path', { d: 'M66 53h44M66 77h44M66 101h34M48 120h60', ...SW(4) }, 'gray', { stroke: true })
  ],
  toga: [
    ground(),
    s('path', { d: 'M60 66h40l14 70H46z' }, 'black', { accent: true }),
    s('circle', { cx: 80, cy: 52, r: 14 }, 'skin'),
    s('path', { d: 'M70 66l10 14 10-14' }, 'white'),
    s('path', { d: 'M70 66l10 14 10-14z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M102 98l26-20', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 118, y: 66, width: 22, height: 12, rx: 3, transform: 'rotate(-38 129 72)' }, 'brown')
  ],
  'transfusión': [
    s('path', { d: 'M54 16h28', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 46, y: 22, width: 44, height: 56, rx: 10 }, 'red', { accent: true }),
    s('path', { d: 'M46 40h44', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M68 78v26q0 16 22 16h22', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M100 96h46v34h-46z' }, 'skin'),
    s('rect', { x: 104, y: 112, width: 18, height: 12, rx: 3 }, 'white'),
    s('path', { d: 'M104 112h18v12h-18z', ...SW(2) }, 'gray', { stroke: true })
  ],
  transportador: [
    s('rect', { x: 14, y: 94, width: 132, height: 22, rx: 11 }, 'dark', { accent: true }),
    s('path', { d: dots([[26, 105], [56, 105], [86, 105], [116, 105], [134, 105]], 6) }, 'gray'),
    s('path', { d: 'M30 116v22M130 116v22', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: rects([[26, 64, 30, 30], [74, 70, 26, 24], [114, 58, 28, 36]]) }, 'tan'),
    s('path', { d: 'M41 64v12M87 70v10M128 58v12', ...SW(3) }, 'brown', { stroke: true }),
    arrow('M50 36h60m-10-8 10 8-10 8', 'orange', 5)
  ],
  tumulto: [
    s('path', { d: busts([20, 48, 76, 104, 132], 140, 26, 40) }, 'blue'),
    s('path', { d: dots([[20, 102], [48, 96], [76, 104], [104, 94], [132, 100]], 11) }, 'skin'),
    s('path', { d: 'M34 70l-8-26M62 66l4-28M90 70l-4-30M118 66l8-26', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: busts([62, 90], 140, 22, 30) }, 'red', { accent: true }),
    s('path', { d: 'M14 28l10 6M146 28l-10 6M80 16v12', ...SW(3) }, 'orange', { stroke: true })
  ],
  turbulencia: [
    backdrop('sky'),
    s('path', { d: jet(80, 72), transform: 'rotate(18 80 72) scale(1)' }, 'white', { accent: true }),
    s('path', { d: jet(80, 72), transform: 'rotate(18 80 72)', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M22 110q12-10 24 0t24 0 24 0 24 0 22 0M22 128q12-10 24 0t24 0 24 0 24 0 22 0', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M42 48l-10-4M42 62l-12 2M118 80l12 4M116 94l10 8', ...SW(3) }, 'dark', { stroke: true })
  ],
  turquesa: [
    s('path', { d: 'M40 30q40 44 80 0', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M80 58l40 28-40 56-40-56z' }, 'mint', { accent: true }),
    s('path', { d: 'M80 58l40 28H40z' }, 'sky'),
    s('path', { d: 'M80 58l40 28-40 56-40-56z', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M58 104l12 10M94 100l-8 12', ...SW(2) }, 'blue', { stroke: true }),
    s('circle', { cx: 80, cy: 54, r: 6 }, 'yellow')
  ],
  vasija: [
    s('path', { d: 'M64 22h32v14q34 12 34 50 0 36-26 52H56q-26-16-26-52 0-38 34-50z' }, 'orange', { accent: true }),
    s('path', { d: 'M60 22h40', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M38 80h84M42 100h76', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M64 40q-20-2-22 18M96 40q20-2 22 18', ...SW(4) }, 'brown', { stroke: true })
  ],
  'vesícula': [
    s('path', { d: 'M18 46q50-20 124 0-10 44-62 52-50-6-62-52z' }, 'brown'),
    s('path', { d: 'M88 72q30 6 34 30 2 26-20 30-24-2-22-30z' }, 'green', { accent: true }),
    s('path', { d: 'M90 76q-20-6-30 6v40', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M96 92q6 0 10 8', ...SW(3) }, 'mint', { stroke: true })
  ],
  adherencia: [
    s('rect', { x: 14, y: 118, width: 132, height: 22 }, 'gray'),
    s('circle', { cx: 80, cy: 72, r: 50 }, 'dark', { accent: true }),
    s('circle', { cx: 80, cy: 72, r: 24 }, 'gray'),
    s('path', { d: rays(80, 72, 38, 50, 16), ...SW(5) }, 'black', { stroke: true }),
    s('path', { d: 'M40 120l8 6M60 122l8 6M92 122l8 6M112 120l8 6', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 72, r: 8 }, 'dark')
  ],
  aditivo: [
    s('path', { d: 'M48 70V40h20v30l26 52q4 14-10 14H32q-14 0-10-14z' }, 'cream'),
    s('path', { d: 'M28 108h80l4 10q2 18-10 18H34q-14 0-10-14z' }, 'sky'),
    s('path', { d: 'M48 70V40h20v30l26 52q4 14-10 14H32q-14 0-10-14z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M112 22l12 12-30 30-12-12z' }, 'gray'),
    s('rect', { x: 116, y: 12, width: 16, height: 22, rx: 6, transform: 'rotate(45 124 23)' }, 'red', { accent: true }),
    s('path', { d: drop(76, 84, 5) }, 'green'),
    s('path', { d: sparkle(130, 70, 8) }, 'yellow')
  ],
  adrede: [
    ground(),
    s('rect', { x: 14, y: 70, width: 60, height: 8 }, 'brown'),
    s('path', { d: 'M22 78v58M66 78v58', ...SW(5) }, 'brown', { stroke: true }),
    ...person(110, 136, 'orange', { h: 44, w: 28, r: 12 }),
    s('path', { d: 'M96 96L72 66', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M58 52h18l-3 16H61z' }, 'sky', { accent: true, transform: 'rotate(-30 67 60)' }),
    s('path', { d: 'M50 126l8-8 6 6 8-10M44 136l6-4', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M104 72q6 4 12-2', ...SW(3) }, 'dark', { stroke: true })
  ],
  afectuoso: [
    ground(),
    ...person(64, 136, 'pink', { accent: true }),
    ...person(98, 136, 'blue'),
    s('path', { d: 'M54 96q30 -8 52 -2M108 96q-30-10-52-2', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 36, 14) }, 'red')
  ],
  allanar: [
    ground(),
    s('path', { d: 'M14 136q10-26 26-6' }, 'brown'),
    s('circle', { cx: 60, cy: 112, r: 24 }, 'gray'),
    s('rect', { x: 76, y: 58, width: 56, height: 50, rx: 6 }, 'yellow', { accent: true }),
    s('rect', { x: 88, y: 36, width: 36, height: 26, rx: 4 }, 'sky'),
    s('path', { d: 'M60 112l26-14', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 120, cy: 120, r: 16 }, 'dark'),
    s('circle', { cx: 60, cy: 112, r: 8 }, 'dark')
  ],
  amapola: [
    s('path', { d: 'M80 140V86', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 122, 200, 30, 8) }, 'green'),
    s('path', { d: ells([[56, 58, 28, 24], [104, 58, 28, 24], [80, 40, 26, 22], [80, 76, 26, 20]]) }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 58, r: 12 }, 'black'),
    s('path', { d: dots(around(80, 58, 18, 8), 2.5) }, 'dark')
  ],
  anteayer: [
    s('path', { d: rects([[14, 52, 40, 48], [60, 52, 40, 48], [106, 52, 40, 48]]) }, 'white'),
    s('path', { d: rects([[14, 52, 40, 48], [60, 52, 40, 48], [106, 52, 40, 48]]), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: rects([[60, 44, 40, 14], [106, 44, 40, 14]]) }, 'gray'),
    s('rect', { x: 14, y: 44, width: 40, height: 14 }, 'red', { accent: true }),
    s('circle', { cx: 34, cy: 80, r: 10 }, 'red'),
    s('circle', { cx: 126, cy: 80, r: 6 }, 'blue'),
    arrow('M126 120q-46 24-92 0m10 10-10-10 14-2', 'orange', 5)
  ],
  antidisturbios: [
    ground(),
    ...person(70, 136, 'navy', { h: 54, w: 34, r: 14 }),
    s('path', { d: 'M54 66a16 16 0 0 1 32 0v4H54z' }, 'dark'),
    s('rect', { x: 58, y: 66, width: 24, height: 7 }, 'sky'),
    s('rect', { x: 84, y: 54, width: 40, height: 82, rx: 6 }, 'sky', { accent: true }),
    s('path', { d: 'M84 54h40v82H84z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M92 70h24', ...SW(4) }, 'white', { stroke: true })
  ],
  antifascista: [
    s('path', { d: 'M14 80h20', ...SW(10) }, 'gray', { stroke: true }),
    s('rect', { x: 28, y: 64, width: 36, height: 32, rx: 16 }, 'gray'),
    s('rect', { x: 36, y: 72, width: 20, height: 16, rx: 8 }, 'white'),
    s('rect', { x: 96, y: 64, width: 36, height: 32, rx: 16 }, 'gray'),
    s('rect', { x: 104, y: 72, width: 20, height: 16, rx: 8 }, 'white'),
    s('path', { d: 'M126 80h20', ...SW(10) }, 'gray', { stroke: true }),
    s('path', { d: burst(80, 80, 18, 7, 8) }, 'orange', { accent: true }),
    s('path', { d: 'M70 50l-8-14M90 50l8-14M70 110l-8 14M90 110l8 14', ...SW(4) }, 'red', { stroke: true })
  ],
  'anís': [
    s('path', { d: Array.from({ length: 8 }, (_, i) => leaflet(80, 80, i * 45, 58, 14)).join('') }, 'brown', { accent: true }),
    s('path', { d: dots(around(80, 80, 34, 8), 6) }, 'tan'),
    s('circle', { cx: 80, cy: 80, r: 10 }, 'dark')
  ],
  apaciguar: [
    ground(),
    ...person(52, 136, 'mint', { h: 44, w: 30, r: 12 }),
    s('path', { d: 'M66 96l26-10', ...SW(7) }, 'skin', { stroke: true }),
    ...face(118, 98, 22, 'sky', 'smile', { accent: true }),
    s('path', { d: 'M90 50q10-8 20 0t20 0M96 64q10-8 20 0t20 0', ...SW(4) }, 'blue', { stroke: true }),
  ],
  arrebatar: [
    ...person(46, 140, 'gray', { h: 44, w: 30, r: 12 }),
    s('path', { d: 'M58 104l24-6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M96 72h30l4 34H92z' }, 'red', { accent: true }),
    s('path', { d: 'M102 72q9-16 18 0', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M146 52q-20 0-28 14', ...SW(9) }, 'skin', { stroke: true }),
    s('path', { d: 'M132 30l12-6M136 44l14-2M84 60l-10-8', ...SW(3) }, 'orange', { stroke: true })
  ],
  'arándano': [
    s('path', { d: dots([[58, 70], [100, 64], [80, 102], [44, 108], [116, 104]], 22) }, 'navy', { accent: true }),
    s('path', { d: dots([[52, 64], [94, 58], [74, 96], [38, 102], [110, 98]], 5) }, 'blue'),
    s('path', { d: 'M58 52l-4-4 4-2 4 2zM100 46l-4-4 4-2 4 2zM80 84l-4-4 4-2 4 2z', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: leaflet(78, 40, -60, 30, 10) }, 'green')
  ],
  aterrar: [
    s('path', { d: 'M86 140V58q0-36 28-36t28 36v82l-9-10-10 10-9-10-10 10-9-10z' }, 'white', { accent: true }),
    s('path', { d: 'M86 140V58q0-36 28-36t28 36v82l-9-10-10 10-9-10-10 10-9-10z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[104, 58, 5, 7], [124, 58, 5, 7], [114, 80, 6, 8]]) }, 'dark'),
    ...face(40, 88, 26, 'yellow', 'flat'),
    s('ellipse', { cx: 40, cy: 100, rx: 7, ry: 9 }, 'dark'),
    s('path', { d: 'M18 52l6 8M40 46v10M62 52l-6 8', ...SW(3) }, 'blue', { stroke: true })
  ],
  atormentar: [
    s('path', { d: 'M30 50q-6-22 16-24 8-16 28-10 16-10 30 4 22-2 22 18 0 18-20 18H46q-18 0-16-6z' }, 'dark'),
    s('path', { d: 'M78 60l-12 24h14l-8 22 20-30H78z' }, 'yellow', { accent: true }),
    s('path', { d: 'M44 70l-4 10M112 70l-4 10M54 84l-4 10', ...SW(3) }, 'blue', { stroke: true }),
    ...person(80, 140, 'gray', { h: 26, w: 26, r: 10 }),
    s('path', { d: 'M74 106q6-4 12 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  autogobierno: [
    ground(),
    s('path', { d: 'M40 136V90l20-16 20 16v46zM80 136V80l22-18 22 18v56z' }, 'tan'),
    s('path', { d: rects([[50, 100, 10, 12], [94, 90, 14, 14], [94, 116, 14, 20]]) }, 'brown'),
    s('path', { d: 'M102 62V30', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M102 30h22l-6 7 6 7h-22z' }, 'green', { accent: true }),
    arrow('M28 70a52 52 0 0 1 40-46m-12-2 12 2-4 12', 'orange', 4)
  ],
  avestruz: [
    ground(),
    s('path', { d: 'M64 104l-8 32M84 104l6 32', ...SW(5) }, 'pink', { stroke: true }),
    s('path', { d: 'M30 80q4-30 40-30t36 24q-4 32-40 32-30 0-36-26z' }, 'dark', { accent: true }),
    s('path', { d: 'M30 78q-10-8-6-20 8 6 12 14z' }, 'white'),
    s('path', { d: 'M96 62q8-14 6-40', ...SW(6) }, 'pink', { stroke: true }),
    s('ellipse', { cx: 108, cy: 22, rx: 10, ry: 7 }, 'pink'),
    s('path', { d: 'M116 22l12 4-12 2z' }, 'orange'),
    s('circle', { cx: 108, cy: 20, r: 2 }, 'dark')
  ],
  azur: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 16 }, 'blue', { accent: true }),
    s('rect', { x: 14, y: 80, width: 132, height: 66, rx: 16 }, 'sky'),
    s('path', { d: ells([[56, 54, 22, 10], [74, 46, 16, 10], [112, 100, 20, 8]]) }, 'white'),
    s('path', { d: birds([[106, 40], [124, 50]]), ...SW(3) }, 'navy', { stroke: true })
  ],
  bardear: [
    ...person(36, 140, 'red', { h: 40, w: 28, r: 11 }),
    ...person(124, 140, 'blue', { h: 40, w: 28, r: 11 }),
    s('path', { d: 'M24 54l8-16 8 10 10-14 6 12 12-10-2 14 12 4-12 8z' }, 'orange', { accent: true }),
    s('path', { d: 'M136 54l-8-16-8 10-10-14-6 12-12-10 2 14-12 4 12 8z' }, 'yellow'),
    s('path', { d: 'M28 80l6 4M44 80l-6 4M116 80l6 4M132 80l-6 4', ...SW(3) }, 'dark', { stroke: true })
  ],
  bondadoso: [
    ground(),
    ...person(54, 136, 'green', { h: 50, w: 32, r: 13, accent: true }),
    ...person(118, 136, 'yellow', { h: 28, w: 20, r: 9 }),
    s('path', { d: 'M68 98l26-4', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: heart(100, 96, 10) }, 'red'),
    s('path', { d: 'M48 68q6 6 12 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  calleja: [
    s('path', { d: 'M14 14h48v126H14zM98 14h48v126H98z' }, 'cream'),
    s('path', { d: 'M62 14l36 0v126H62z' }, 'sky'),
    s('path', { d: 'M62 140l10-60h16l10 60z' }, 'gray', { accent: true }),
    s('path', { d: rects([[24, 30, 14, 18], [24, 64, 14, 18], [122, 36, 14, 18], [122, 72, 14, 18]]) }, 'blue'),
    s('path', { d: 'M38 104h14v36H38z' }, 'brown'),
    s('path', { d: 'M62 14v126M98 14v126', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M66 30h28', ...SW(2) }, 'dark', { stroke: true })
  ],
  carcasa: [
    s('rect', { x: 42, y: 16, width: 76, height: 128, rx: 18 }, 'purple', { accent: true }),
    s('rect', { x: 50, y: 24, width: 60, height: 112, rx: 10 }, 'dark'),
    s('path', { d: dots([[64, 40], [64, 56]], 6) }, 'gray'),
    s('path', { d: heart(92, 84, 14) }, 'pink'),
    s('path', { d: 'M38 50v18M122 50v12', ...SW(4) }, 'purple', { stroke: true })
  ],
  casaca: [
    s('path', { d: 'M56 20h48l32 24-12 22-16-10v84H52V56L36 66 24 44z' }, 'red', { accent: true }),
    s('path', { d: 'M66 20l14 20 14-20', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M80 40v100', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: dots([[72, 60], [72, 82], [72, 104], [88, 60], [88, 82], [88, 104]], 4) }, 'yellow'),
    s('path', { d: 'M24 44l12 22M136 44l-12 22', ...SW(6) }, 'navy', { stroke: true })
  ],
  cesto: [
    s('path', { d: 'M34 34h92l-10 106H44z' }, 'tan', { accent: true }),
    s('path', { d: 'M38 60h84M40 84h80M42 108h76M60 34l4 106M80 34v106M100 34l-4 106', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 36q10-26 30-20l10 20zM80 36q24-30 44-10l-4 10z' }, 'blue'),
    s('path', { d: 'M58 34q4-14 18-8', ...SW(5) }, 'pink', { stroke: true }),
    s('rect', { x: 30, y: 28, width: 100, height: 10, rx: 4 }, 'brown')
  ],
  charca: [
    s('path', { d: ells([[80, 110, 66, 26]]) }, 'blue'),
    s('path', { d: ells([[70, 108, 20, 8], [114, 116, 12, 5]]) }, 'green'),
    s('ellipse', { cx: 70, cy: 96, rx: 14, ry: 10 }, 'green', { accent: true }),
    s('path', { d: dots([[64, 86], [76, 86]], 4) }, 'white'),
    s('path', { d: dots([[64, 86], [76, 86]], 1.8) }, 'dark'),
    s('path', { d: 'M24 44q-2 30 6 50M40 52v40M128 50q2 26-4 44', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M100 120q10-6 20 0', ...SW(2) }, 'sky', { stroke: true })
  ],
  cheto: [
    ground(),
    ...person(80, 136, 'pink', { h: 52, w: 34, r: 15 }),
    s('path', { d: 'M64 58h32v6q-8 6-14 0h-4q-6 6-14 0z' }, 'black', { accent: true }),
    s('path', { d: 'M66 86q14 14 28 0', ...SW(4, { 'stroke-dasharray': '1 6' }) }, 'yellow', { stroke: true }),
    s('path', { d: sparkle(116, 40, 10) + sparkle(42, 54, 7) }, 'yellow'),
    s('path', { d: 'M66 50q14-14 28 0', ...SW(4) }, 'orange', { stroke: true })
  ],
  cisma: [
    s('path', { d: 'M72 20a60 60 0 0 0 0 120l8-20-10-16 12-18-10-16 12-18-8-16z' }, 'purple', { accent: true }),
    s('path', { d: 'M96 20a60 60 0 0 1 0 120l8-20-10-16 12-18-10-16 12-18-8-16z', transform: 'translate(-4 0)' }, 'orange'),
    s('path', { d: 'M74 70l-12-6M98 90l12 6', ...SW(3) }, 'dark', { stroke: true })
  ],
  clausurar: [
    s('rect', { x: 34, y: 20, width: 92, height: 120, rx: 4 }, 'brown'),
    s('path', { d: 'M30 50l100 40M30 110l100-40', ...SW(14) }, 'tan', { stroke: true }),
    s('path', { d: 'M68 90V78a12 12 0 0 1 24 0v12', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 62, y: 88, width: 36, height: 30, rx: 5 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 102, r: 4 }, 'dark')
  ],
  'coerción': [
    ground(),
    ...person(80, 136, 'gray', { h: 26, w: 30, r: 11 }),
    s('path', { d: 'M40 80V40q0-10 10-10h60q10 0 10 10v40H40z' }, 'skin', { accent: true }),
    s('path', { d: 'M60 30v-16M80 30v-16M100 30v-16', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M60 40v20M80 40v20M100 40v20', ...SW(2) }, 'tan', { stroke: true }),
    arrow('M28 40v30m-8-8 8 8 8-8', 'red', 4),
    arrow('M132 40v30m-8-8 8 8 8-8', 'red', 4)
  ],
  colindante: [
    ground(),
    s('path', { d: 'M18 136V74l32-30 30 30v62z' }, 'orange', { accent: true }),
    s('path', { d: 'M80 136V74l30-30 32 30v62z' }, 'blue'),
    s('path', { d: rects([[30, 88, 16, 16], [52, 108, 16, 28], [112, 88, 16, 16], [92, 108, 16, 28]]) }, 'cream'),
    s('path', { d: 'M80 30v106', ...DASH(4) }, 'dark', { stroke: true })
  ],
  concientizar: [
    s('path', { d: 'M30 80l50-26v64L30 92z' }, 'red', { accent: true }),
    s('rect', { x: 18, y: 76, width: 14, height: 20, rx: 3 }, 'dark'),
    s('path', { d: 'M40 92l6 22h10l-4-18', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 116, cy: 66, r: 20 }, 'yellow'),
    s('rect', { x: 108, y: 86, width: 16, height: 12, rx: 3 }, 'gray'),
    s('path', { d: halfRays(116, 66, 26, 34, 5), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M90 70q8 16 0 32', ...SW(4) }, 'orange', { stroke: true })
  ],
  condecorar: [
    s('path', { d: 'M14 146V60q30-14 66-14t66 14v86z' }, 'navy'),
    s('path', { d: 'M80 46v100', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M90 70h22l-4 22h-14zM114 70h22l-4 22h-14z' }, 'red'),
    s('path', { d: star(102, 104, 12) + star(126, 104, 12) }, 'yellow', { accent: true }),
    s('path', { d: dots([[68, 70], [68, 98], [68, 126]], 4) }, 'yellow')
  ],
  consonante: [
    s('path', { d: 'M24 80q28-30 56-18 28-12 56 18-28 32-56 32T24 80z' }, 'red', { accent: true }),
    s('path', { d: 'M28 80q52 4 104 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M136 56q10 24 0 48M146 46q14 34 0 68', ...SW(4) }, 'blue', { stroke: true }),
  ],
  conspirar: [
    backdrop('navy'),
    s('circle', { cx: 56, cy: 74, r: 18 }, 'skin'),
    s('circle', { cx: 104, cy: 74, r: 18 }, 'skin'),
    s('path', { d: 'M30 58h52M78 58h52M40 58q0-22 16-22t16 22zM88 58q0-22 16-22t16 22z' }, 'dark'),
    s('path', { d: busts([56, 104], 146, 36, 50) }, 'gray', { accent: true }),
    s('path', { d: 'M74 84q6-14 12 0', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M30 58h52M78 58h52', ...SW(4) }, 'black', { stroke: true })
  ],
  constitucionalista: [
    ground(),
    ...person(48, 136, 'navy', { h: 52, w: 32, r: 13 }),
    s('rect', { x: 74, y: 44, width: 62, height: 80, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M86 64l19-10 19 10zM88 66v30M98 66v30M112 66v30M122 66v30M84 98h42', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M62 100l14-6', ...SW(7) }, 'skin', { stroke: true })
  ],
  corromper: [
    s('rect', { x: 14, y: 54, width: 132, height: 12, rx: 4 }, 'brown'),
    s('path', { d: 'M24 66v70M136 66v70', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M14 102h40M146 102h-40', ...SW(9) }, 'skin', { stroke: true }),
    s('path', { d: 'M66 86q-8 16 6 30h20q14-14 6-30z' }, 'green', { accent: true }),
    s('path', { d: 'M70 86h24', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 82, cy: 104, r: 6 }, 'yellow'),
    s('path', { d: dots([[60, 30], [100, 30]], 10) }, 'skin')
  ],
  'corrosión': [
    s('rect', { x: 14, y: 58, width: 132, height: 40, rx: 4 }, 'gray'),
    s('path', { d: ells([[44, 70, 14, 8], [96, 86, 18, 9], [126, 66, 8, 6]]) }, 'orange', { accent: true }),
    s('path', { d: ells([[48, 70, 6, 4], [100, 86, 8, 4]]) }, 'brown'),
    s('path', { d: 'M96 98v14M110 98v8', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: drop(96, 128, 5) }, 'brown'),
    s('path', { d: 'M14 58v40M146 58v40', ...SW(8) }, 'dark', { stroke: true })
  ],
  'críticamente': [
    s('rect', { x: 14, y: 22, width: 82, height: 112, rx: 4 }, 'white'),
    s('path', { d: 'M14 22h82v112H14z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M26 44h56M26 62h56M26 80h40M26 98h56', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 74l12 14M82 74l-12 14M30 112q20 10 40 0', ...SW(4) }, 'red', { stroke: true }),
    s('circle', { cx: 106, cy: 82, r: 26 }, 'sky', { accent: true }),
    s('path', { d: ring(106, 82, 26) + 'M124 102l20 24', ...SW(7) }, 'dark', { stroke: true })
  ],
  'cándido': [
    s('circle', { cx: 80, cy: 82, r: 46 }, 'skin'),
    s('path', { d: ells([[62, 78, 9, 12], [98, 78, 9, 12]]) }, 'dark'),
    s('path', { d: dots([[65, 73], [101, 73]], 3.5) }, 'white'),
    s('path', { d: 'M72 106q8 8 16 0', ...SW(3) }, 'dark', { stroke: true }),
    ...flower(122, 40, 'white').slice(1).map(sh => ({ ...sh })),
    s('path', { d: 'M38 52q0-30 42-30t42 30q-20-12-42-12T38 52z' }, 'yellow', { accent: true })
  ],
  'cónclave': [
    ground(),
    s('rect', { x: 26, y: 70, width: 92, height: 66 }, 'cream'),
    s('path', { d: 'M20 70l52-30 52 30z' }, 'red'),
    s('rect', { x: 94, y: 30, width: 14, height: 30 }, 'tan'),
    s('path', { d: ells([[104, 20, 12, 8], [122, 14, 10, 6]]) }, 'white', { accent: true }),
    s('path', { d: ells([[104, 20, 12, 8], [122, 14, 10, 6]]), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 136v-34h20v34z' }, 'brown'),
    s('path', { d: ring(130, 112, 7) + 'M130 119v18M130 130h6', ...SW(4) }, 'yellow', { stroke: true })
  ],
  desenmascarar: [
    s('circle', { cx: 66, cy: 84, r: 42 }, 'skin'),
    s('path', { d: dots([[52, 78], [80, 78]], 4) }, 'dark'),
    s('path', { d: 'M54 102q12 10 24 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 42q34-10 46 14 4 22-10 36-24-6-36-50z', transform: 'rotate(10 120 60)' }, 'purple', { accent: true }),
    s('path', { d: ells([[118, 58, 5, 4]]) }, 'dark'),
    s('path', { d: 'M100 112l26-24', ...SW(8) }, 'skin', { stroke: true })
  ],
  deseoso: [
    ...face(56, 100, 36, 'yellow', 'smile', { accent: true }),
    s('path', { d: heart(44, 90, 7) + heart(68, 90, 7) }, 'red'),
    s('path', { d: dots([[94, 66], [104, 54]], 4) }, 'gray'),
    s('path', { d: bubble(96, 14, 52, 40) }, 'cream'),
    s('path', { d: 'M112 26h20l-2 18h-16z' }, 'pink'),
    s('path', { d: 'M110 26q12-10 24 0', ...SW(3) }, 'brown', { stroke: true })
  ],
  desobedecer: [
    ground(),
    ...person(44, 136, 'navy', { h: 50, w: 30, r: 13 }),
    s('path', { d: 'M58 96l24-12', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M88 80l6-4', ...SW(4) }, 'skin', { stroke: true }),
    ...person(120, 136, 'red', { h: 34, w: 24, r: 11, accent: true }),
    s('path', { d: 'M110 84l20-6', ...SW(3) }, 'dark', { stroke: true }),
    arrow('M120 52h22m-8-8 8 8-8 8', 'orange', 4)
  ],
  'desvío': [
    s('path', { d: 'M60 140V96q0-20 20-36l40-32', ...SW(22) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 96V20', ...SW(22) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 40h28l-4 12H50z' }, 'orange'),
    s('path', { d: 'M46 40h28', ...SW(4, { 'stroke-dasharray': '6 4' }) }, 'white', { stroke: true }),
    s('rect', { x: 92, y: 90, width: 46, height: 28, rx: 4 }, 'orange', { accent: true }),
    s('path', { d: 'M100 104h26m-8-8 8 8-8 8M115 118v22', ...SW(4) }, 'dark', { stroke: true })
  ],
  disfrazar: [
    s('path', { d: 'M48 88h64l14 52H34z' }, 'purple'),
    s('circle', { cx: 80, cy: 66, r: 22 }, 'skin'),
    s('path', { d: 'M56 46l24-34 24 34z' }, 'purple', { accent: true }),
    s('path', { d: 'M56 62h48v12H56z' }, 'black'),
    s('path', { d: dots([[70, 68], [90, 68]], 3) }, 'white'),
    s('path', { d: star(80, 30, 6) + star(66, 116, 7) + star(98, 104, 6) }, 'yellow')
  ],
  disuadir: [
    s('path', { d: 'M14 128h96l6 18H14z' }, 'brown'),
    arrow('M132 96v40m-8-8 8 8 8-8', 'red', 4),
    ...person(84, 128, 'orange', { h: 40, w: 26, r: 11 }),
    ...person(40, 128, 'green', { h: 44, w: 28, r: 12, accent: true }),
    s('path', { d: 'M54 92l14-6', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 70, cy: 85, r: 6 }, 'skin')
  ],
  dolo: [
    s('path', { d: 'M80 14v70', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 84v30a20 20 0 0 1-40 0l8-8', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 106l-6-10', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 72, r: 18 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 72, r: 10 }, 'orange'),
    ...person(124, 140, 'blue', { h: 30, w: 24, r: 10 }),
    s('path', { d: 'M112 116l-10-14', ...SW(6) }, 'skin', { stroke: true })
  ],
  ejecutor: [
    ground(),
    ...person(52, 136, 'blue', { h: 50, w: 32, r: 13, accent: true }),
    s('path', { d: 'M66 96l22-10', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 92, y: 60, width: 46, height: 60, rx: 4 }, 'cream'),
    s('path', { d: 'M100 76h30M100 88h30M100 100h18', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 110l6 6 12-14', ...SW(4) }, 'green', { stroke: true })
  ],
  electrodo: [
    s('rect', { x: 24, y: 70, width: 112, height: 68, rx: 6 }, 'sky'),
    s('path', { d: 'M24 70h112v68H24z', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 44, y: 40, width: 14, height: 80 }, 'red', { accent: true }),
    s('rect', { x: 102, y: 40, width: 14, height: 80 }, 'dark'),
    s('path', { d: 'M51 40V24h58v16', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M74 16l-6 10h12l-6 10', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[70, 100], [84, 112], [76, 126], [92, 96]], 3) }, 'white')
  ],
  embalaje: [
    s('path', { d: 'M24 60l56-24 56 24v62l-56 24-56-24z' }, 'tan', { accent: true }),
    s('path', { d: 'M24 60l56 24 56-24M80 84v62', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M52 48l56 24v20', ...SW(10) }, 'sky', { stroke: true }),
    s('path', { d: 'M34 98l12 6M34 108l12 6', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M110 104l10-12 10 8', ...SW(4) }, 'red', { stroke: true })
  ],
  embutido: [
    s('path', { d: 'M30 50q50-20 100 0', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M50 44q-10 40 6 86', ...SW(22) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M110 44q10 40-6 86', ...SW(22) }, 'brown', { stroke: true }),
    s('path', { d: dots([[46, 70], [56, 100], [50, 120]], 3) + dots([[114, 72], [106, 104]], 3) }, 'cream'),
    s('path', { d: 'M80 40v80', ...SW(16) }, 'pink', { stroke: true }),
    s('path', { d: dots([[78, 60], [82, 90], [78, 110]], 3) }, 'white')
  ],
  'enajenación': [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'mint'),
    s('path', { d: busts([30, 54], 120, 20, 28) }, 'gray'),
    s('path', { d: dots([[30, 82], [54, 82]], 9) }, 'gray'),
    ...person(118, 120, 'purple', { h: 34, w: 24, r: 11, accent: true }),
    s('path', { d: spiral(114, 70), ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 40v80', ...DASH(3) }, 'dark', { stroke: true })
  ],
  equiparar: [
    s('path', { d: 'M80 34v94M54 136h52', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 52h112', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 52l-14 30h28zM136 52l-14 30h28z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M10 82h28q-14 12-28 0zM122 82h28q-14 12-28 0z' }, 'gray'),
    s('circle', { cx: 24, cy: 70, r: 12 }, 'orange', { accent: true }),
    s('circle', { cx: 136, cy: 70, r: 12 }, 'blue'),
    s('path', { d: 'M80 34v-14', ...SW(4) }, 'dark', { stroke: true })
  ],
  extremismo: [
    s('path', { d: 'M20 112a60 60 0 0 1 120 0', ...SW(18, { 'stroke-linecap': 'butt' }) }, 'mint', { stroke: true }),
    s('path', { d: 'M118 64a60 60 0 0 1 22 48', ...SW(18, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M20 112a60 60 0 0 1 22-48', ...SW(18, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true }),
    s('path', { d: 'M80 112l52-6', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 112, r: 9 }, 'dark'),
    s('path', { d: 'M132 34l4 12M144 40l-8 8', ...SW(3) }, 'orange', { stroke: true })
  ],
  'fertilización': [
    ground(),
    s('path', { d: 'M100 136V76', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(100, 100, -30, 34, 12) + leaflet(100, 88, 210, 30, 11) + leaflet(100, 76, -80, 26, 9) }, 'green', { accent: true }),
    s('path', { d: 'M22 52l22-16 16 20-22 16z' }, 'tan'),
    s('path', { d: 'M38 72v40M50 70v46M58 64v54', ...SW(3, { 'stroke-dasharray': '2 8' }) }, 'brown', { stroke: true }),
    s('path', { d: 'M60 136q20-14 40 0', ...SW(4) }, 'brown', { stroke: true })
  ],
  'flotación': [
    s('rect', { x: 14, y: 80, width: 132, height: 64 }, 'blue'),
    s('path', { d: 'M14 80q16-8 33 0t33 0 33 0 33 0', ...SW(4) }, 'sky', { stroke: true }),
    s('circle', { cx: 80, cy: 78, r: 30 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 78, r: 14 }, 'blue'),
    s('path', { d: 'M58 58l10 10M102 58l-10 10M58 98l10-10M102 98l-10-10', ...SW(8) }, 'white', { stroke: true })
  ],
  fogata: [
    s('path', { d: 'M30 132l100-22M30 110l100 22', ...SW(12) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 118q-40-6-32-46 8 14 16 14-4-30 18-54 0 26 18 34 4-10 4-20 22 26 10 52-8 20-34 20z' }, 'orange', { accent: true }),
    s('path', { d: 'M80 118q-20-4-14-30 8 10 14 6 0-14 10-22 12 20 6 32-4 14-16 14z' }, 'yellow'),
    s('path', { d: dots([[40, 46], [120, 40], [108, 22]], 3) }, 'orange')
  ],
  fosfato: [
    s('path', { d: 'M56 22h48M66 22v40l-30 62q-6 16 10 16h68q16 0 10-16L94 62V22' , ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 96h64l12 26q4 14-10 14H46q-14 0-10-14z' }, 'mint'),
    s('path', { d: 'M62 108l8-8 8 8-8 8zM88 118l6-6 6 6-6 6zM96 100l5-5 5 5-5 5z' }, 'white', { accent: true }),
    s('path', { d: 'M62 108l8-8 8 8-8 8zM88 118l6-6 6 6-6 6z', ...SW(2) }, 'green', { stroke: true }),
    s('path', { d: sparkle(122, 40, 8) }, 'yellow')
  ],
  'frenético': [
    ground(),
    ...lean(70, 136, -12, 'red', { accent: true }),
    s('path', { d: 'M58 94L32 70M82 92l28-26', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M24 52l-8-8M28 40l-2-12M122 52l10-6M118 40l4-12', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M96 136l14-22M48 136l-10-20', ...SW(4) }, 'gray', { stroke: true }),
    ...note(128, 108, 'purple')
  ],
  'fructífero': [
    ...tree(80, 'green'),
    s('path', { d: dots([[60, 58], [92, 48], [104, 76], [72, 82], [52, 90], [110, 92], [84, 64]], 7) }, 'red', { accent: true }),
    s('path', { d: 'M26 136h26M108 136h26', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 120, cy: 130, r: 7 }, 'red')
  ],
  gasa: [
    s('rect', { x: 28, y: 28, width: 104, height: 104, rx: 4 }, 'white', { accent: true }),
    s('path', { d: 'M28 28h104v104H28zM28 54h104M28 80h104M28 106h104M54 28v104M80 28v104M106 28v104', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 132q20 10 30-10', ...SW(10) }, 'white', { stroke: true }),
    s('path', { d: 'M110 132q20 10 30-10', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 66, y: 66, width: 28, height: 28, rx: 4 }, 'pink')
  ],
  'genealógico': [
    s('path', { d: 'M80 44v22M40 66h80M40 66v22M120 66v22M40 110v20M24 110h32M120 110v20M104 110h32', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 32, r: 14 }, 'orange', { accent: true }),
    s('path', { d: dots([[40, 98], [120, 98]], 12) }, 'blue'),
    s('path', { d: dots([[24, 136], [56, 136], [104, 136], [136, 136]], 9) }, 'green'),
    s('path', { d: 'M24 110h32M104 110h32', ...SW(4) }, 'brown', { stroke: true })
  ],
  goleta: [
    s('path', { d: 'M14 106h132l-16 26H34z' }, 'brown', { accent: true }),
    s('path', { d: 'M60 106V20M104 106V30', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 24l34 70H62zM106 34l30 60h-30z' }, 'cream'),
    s('path', { d: 'M58 30L24 96h34z' }, 'white'),
    s('path', { d: 'M58 30L24 96h34z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 140q16-8 33 0t33 0 33 0 33 0', ...SW(4) }, 'blue', { stroke: true })
  ],
  gueto: [
    s('path', { d: 'M14 140V110h132v30z' }, 'gray'),
    s('path', { d: 'M28 110V62h30v48zM64 110V44h34v66zM104 110V70h30v40z' }, 'tan', { accent: true }),
    s('path', { d: grid(34, 72, 2, 2, 7, 9, 12, 16) + grid(72, 54, 2, 3, 8, 9, 14, 16) + grid(110, 80, 2, 1, 7, 9, 12, 16) }, 'brown'),
    s('path', { d: 'M14 104h132M22 104V90M42 104V90M62 104V90M82 104V90M102 104V90M122 104V90M142 104V90M14 94h132', ...SW(3) }, 'dark', { stroke: true })
  ],
  horriblemente: [
    s('path', { d: 'M24 54q-6-26 22-26 10-16 34-10 22-10 34 8 24 0 22 24z' }, 'dark'),
    s('path', { d: 'M40 60l-6 14M70 60l-6 14M100 60l-6 14M126 60l-6 14', ...SW(4) }, 'blue', { stroke: true }),
    ...face(80, 114, 26, 'orange', 'frown', { accent: true }),
    s('path', { d: drop(104, 92, 4) }, 'sky')
  ],
  impostor: [
    ground(),
    ...person(80, 136, 'gray', { h: 52, w: 34, r: 15 }),
    s('path', { d: 'M62 56q18-18 36 0z' }, 'navy'),
    s('path', { d: 'M62 74q18 12 36 0q-18 4-36 0z' }, 'dark'),
    s('path', { d: 'M64 62h32', ...SW(5) }, 'black', { stroke: true, accent: true }),
    s('rect', { x: 96, y: 92, width: 30, height: 20, rx: 3 }, 'cream'),
    s('path', { d: 'M100 98h10M100 106h18', ...SW(3) }, 'red', { stroke: true })
  ],
  insaciable: [
    s('circle', { cx: 60, cy: 86, r: 40 }, 'yellow', { accent: true }),
    s('path', { d: 'M60 86l40-22v44z' }, 'white'),
    s('circle', { cx: 56, cy: 66, r: 5 }, 'dark'),
    s('path', { d: dots([[112, 86], [132, 86], [148, 86]], 6) }, 'orange'),
    s('path', { d: 'M28 30l8 10M60 22v12M92 30l-8 10', ...SW(3) }, 'red', { stroke: true })
  ],
  intervencionismo: [
    s('path', { d: 'M22 136V96l28-22 28 22v40zM82 136V90l28-22 28 22v46z' }, 'tan'),
    s('path', { d: rects([[42, 110, 16, 26], [102, 104, 16, 32]]) }, 'brown'),
    ground(),
    s('path', { d: 'M74 14v40q0 8 8 8h10', ...SW(14) }, 'skin', { stroke: true, accent: true }),
    s('path', { d: 'M92 62q6 10 0 18M84 62v14', ...SW(5) }, 'skin', { stroke: true }),
  ],
  'intrínseco': [
    s('path', { d: 'M28 70l20-26h64l20 26-52 70z' }, 'sky'),
    s('path', { d: 'M28 70h104M48 44l14 26 18-26 18 26 14-26M62 70l18 70 18-70', ...SW(2) }, 'blue', { stroke: true }),
    s('circle', { cx: 80, cy: 90, r: 14 }, 'yellow', { accent: true }),
    s('path', { d: rays(80, 90, 18, 26, 8), ...SW(3) }, 'yellow', { stroke: true })
  ],
  latigazo: [
    s('rect', { x: 18, y: 104, width: 32, height: 14, rx: 6, transform: 'rotate(-30 34 111)' }, 'brown', { accent: true }),
    s('path', { d: 'M46 98q30-40 60-28t36-26', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M136 34l8-12M128 28l-4-12M146 42l12-2', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: burst(140, 44, 10, 4, 6) }, 'yellow')
  ],
  leninista: [
    s('rect', { x: 46, y: 96, width: 68, height: 44, rx: 4 }, 'brown'),
    ...person(80, 96, 'dark', { h: 36, w: 30, r: 13 }),
    s('path', { d: 'M94 70l20-30', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M54 32v40', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M54 32h-30l6 10-6 10h30z' }, 'red', { accent: true }),
    s('path', { d: 'M62 110h36', ...SW(4) }, 'tan', { stroke: true })
  ],
  limpiador: [
    s('path', { d: 'M54 60h40l6 16v60q0 4-4 4H52q-4 0-4-4V76z' }, 'sky', { accent: true }),
    s('path', { d: 'M62 34h26v26H62z' }, 'white'),
    s('path', { d: 'M62 34h26v26H62z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 34l-16 4v8l16 2' }, 'blue'),
    s('path', { d: 'M88 40q14 8 6 20', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M38 30l-8-4M36 42l-10 2M38 54l-8 6', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: sparkle(120, 104, 12) + sparkle(130, 70, 7) }, 'yellow')
  ],
  llavero: [
    s('path', { d: ring(64, 46, 26), ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 70l-14 50l8 2v-8l6 2 2-8-6-2 6-24', ...SW(9) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M76 70l34 44', ...SW(9) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 112l6-8 10 8-6 8z' }, 'gray'),
    s('path', { d: heart(110, 46, 14) }, 'red'),
    s('path', { d: 'M88 46h8', ...SW(4) }, 'gray', { stroke: true })
  ],
  'locución': [
    ...person(40, 140, 'blue', { h: 40, w: 28, r: 12, accent: true }),
    s('path', { d: bubble(60, 20, 86, 54) }, 'cream'),
    s('path', { d: rects([[72, 38, 18, 10], [94, 38, 18, 10], [116, 38, 18, 10]]) }, 'orange'),
    s('path', { d: 'M74 60h60', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M52 100q6-8 0-16', ...SW(3) }, 'gray', { stroke: true })
  ],
  'lícito': [
    s('rect', { x: 26, y: 26, width: 108, height: 108, rx: 10 }, 'cream'),
    s('path', { d: 'M26 26h108v108H26z', ...SW(3) }, 'tan', { stroke: true }),
    s('circle', { cx: 80, cy: 72, r: 30 }, 'green', { accent: true }),
    s('path', { d: 'M66 72l10 10 20-22', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M48 116h64', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 98l10 26 6-10 10 4-10-24' }, 'red')
  ],
  malabares: [
    ground(),
    ...person(80, 136, 'orange', { h: 46, w: 30, r: 13, accent: true }),
    s('path', { d: 'M66 100L48 84M94 100l18-16', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M46 72q-6-34 34-46 40 12 34 46', ...DASH(2, '3 6') }, 'gray', { stroke: true }),
    s('circle', { cx: 50, cy: 46, r: 9 }, 'red'),
    s('circle', { cx: 80, cy: 24, r: 9 }, 'blue'),
    s('circle', { cx: 110, cy: 46, r: 9 }, 'green')
  ],
  malayo: [
    backdrop('sky'),
    s('path', { d: 'M14 120q66-24 132 0v26H14z' }, 'blue'),
    s('path', { d: 'M34 112q46-24 92 0z' }, 'tan', { accent: true }),
    s('path', { d: 'M80 100q-4-30 6-56', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(86, 44, 200, 34, 9) + leaflet(86, 44, -20, 34, 9) + leaflet(86, 44, 240, 26, 7) + leaflet(86, 44, 40, 28, 8) }, 'green'),
    s('circle', { cx: 124, cy: 36, r: 12 }, 'yellow')
  ],
  manitas: [
    s('path', { d: 'M24 112l58-58', ...SW(12) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 44a20 20 0 1 0 22 22l-10-2-8-8-2-10z' }, 'gray'),
    s('path', { d: 'M100 120l36-36', ...SW(10) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M60 104l40-40', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 56l20-20 10 10-20 20z' }, 'orange'),
    s('path', { d: 'M128 80l14-14 6 6-14 14z' }, 'dark')
  ],
  marcadamente: [
    s('path', { d: rects([[24, 108, 22, 28], [56, 100, 22, 36], [88, 104, 22, 32]]) }, 'gray'),
    s('rect', { x: 120, y: 34, width: 22, height: 102 }, 'red', { accent: true }),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M104 22l-8-8M100 40H88', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: ells([[131, 78, 26, 52]]), ...SW(4) }, 'yellow', { stroke: true })
  ],
  masajista: [
    s('rect', { x: 14, y: 104, width: 132, height: 12, rx: 4 }, 'brown'),
    s('path', { d: 'M22 116v24M138 116v24', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 40, y: 88, width: 84, height: 18, rx: 9 }, 'skin'),
    s('circle', { cx: 28, cy: 94, r: 11 }, 'skin'),
    ...person(96, 76, 'mint', { h: 36, w: 28, r: 12, accent: true }),
    s('path', { d: 'M84 62l-14 24M108 62l-6 24', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M60 80q4-6 0-12M120 80q4-6 0-12', ...SW(3) }, 'pink', { stroke: true })
  ],
  mediocampista: [
    s('rect', { x: 14, y: 82, width: 132, height: 58, rx: 4 }, 'green'),
    s('path', { d: 'M80 82v58M58 140a22 22 0 0 1 44 0', ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 34, r: 12 }, 'skin'),
    s('path', { d: 'M66 104l-8 24M94 104l10 22', ...SW(7) }, 'dark', { stroke: true }),
    s('rect', { x: 66, y: 48, width: 28, height: 40, rx: 8 }, 'blue', { accent: true }),
    s('rect', { x: 66, y: 84, width: 28, height: 20, rx: 4 }, 'white'),
    s('circle', { cx: 116, cy: 124, r: 9 }, 'white'),
    s('path', { d: ring(116, 124, 9), ...SW(2) }, 'dark', { stroke: true })
  ],
  milenario: [
    ground(),
    s('path', { d: 'M62 136l6-40q-34 0-40-30 20-30 52-20 30-14 50 12 4 34-30 38l6 40z' }, 'green', { accent: true }),
    s('path', { d: 'M62 136l6-44h24l6 44z' }, 'brown'),
    s('path', { d: 'M74 104q6 4 12 0M72 118q8 4 16 0', ...SW(2) }, 'tan', { stroke: true }),
    s('circle', { cx: 128, cy: 110, r: 14 }, 'cream'),
    s('path', { d: 'M128 100v10l7 4', ...SW(3) }, 'dark', { stroke: true })
  ],
  morisco: [
    s('rect', { x: 18, y: 18, width: 124, height: 122 }, 'cream'),
    s('path', { d: 'M42 140V78q0-40 38-40t38 40v62h-8V82q-4-34-30-34T50 82v58z' }, 'blue', { accent: true }),
    s('path', { d: 'M50 140V82q4-34 30-34t30 34v58z' }, 'navy'),
    s('path', { d: checker(18, 18, 8, 1, 15.5) }, 'green'),
    s('path', { d: 'M28 60v80M132 60v80', ...SW(5) }, 'tan', { stroke: true })
  ],
  natalicio: [
    s('path', { d: 'M32 96h96v40H32z' }, 'pink', { accent: true }),
    s('path', { d: 'M32 96q8 10 16 0t16 0 16 0 16 0 16 0 16 0', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M58 96V70M80 96V64M102 96V70', ...SW(6) }, 'sky', { stroke: true }),
    s('path', { d: drop(58, 56, 5) + drop(80, 50, 5) + drop(102, 56, 5) }, 'orange'),
    s('path', { d: 'M24 136h112', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: sparkle(28, 50, 9) + sparkle(134, 40, 8) }, 'yellow')
  ],
  negligente: [
    ground(),
    ...lean(52, 136, -10, 'orange', { accent: true }),
    s('path', { d: 'M40 58h8M54 58h8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 136v-26h30v26' }, 'sky'),
    s('path', { d: 'M100 110h30v26h-30z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M114 110q-6-20 4-34', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M86 136q20 6 40 0', ...SW(5) }, 'blue', { stroke: true })
  ],
  notarial: [
    s('rect', { x: 28, y: 20, width: 84, height: 112, rx: 4 }, 'cream'),
    s('path', { d: 'M28 20h84v112H28z', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M40 40h60M40 54h60M40 68h44M40 112q10-10 20 0t20-4', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 106, y: 66, width: 26, height: 30, rx: 4 }, 'brown'),
    s('rect', { x: 100, y: 96, width: 38, height: 12, rx: 3 }, 'dark'),
    s('circle', { cx: 96, cy: 112, r: 12 }, 'red', { accent: true })
  ],
  obeso: [
    ground(),
    s('circle', { cx: 80, cy: 44, r: 16 }, 'skin'),
    s('ellipse', { cx: 80, cy: 98, rx: 42, ry: 38 }, 'blue', { accent: true }),
    s('path', { d: 'M72 46q8 6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M38 98l-14 14M122 98l14 14', ...SW(7) }, 'skin', { stroke: true })
  ],
  obstetricia: [
    s('rect', { x: 18, y: 76, width: 124, height: 54, rx: 26 }, 'pink'),
    s('circle', { cx: 50, cy: 64, r: 26 }, 'skin'),
    s('path', { d: 'M40 70q10 8 20 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M76 76h50a14 14 0 0 1 0 28H76z' }, 'cream', { accent: true }),
    s('path', { d: 'M28 44q22-20 44 0', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: heart(118, 40, 12) }, 'red')
  ],
  ornamento: [
    s('path', { d: 'M80 14v18', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 72, y: 30, width: 16, height: 12, rx: 3 }, 'yellow'),
    s('circle', { cx: 80, cy: 90, r: 50 }, 'red', { accent: true }),
    s('path', { d: 'M32 76q48 20 96 0M30 102q50 20 100 0', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[54, 90], [80, 92], [106, 90]], 6) }, 'white'),
    s('path', { d: 'M54 56q8-8 18-6', ...SW(5) }, 'pink', { stroke: true })
  ],
  pavada: [
    s('path', { d: Array.from({ length: 7 }, (_, i) => leaflet(70, 96, 200 + i * 23, 56, 14)).join('') }, 'brown'),
    s('ellipse', { cx: 76, cy: 100, rx: 30, ry: 26 }, 'tan', { accent: true }),
    s('path', { d: 'M96 92q6-30 10-40', ...SW(10) }, 'tan', { stroke: true }),
    s('circle', { cx: 108, cy: 46, r: 11 }, 'tan'),
    s('path', { d: 'M118 44l12 4-12 4z' }, 'orange'),
    s('path', { d: 'M110 56q4 10-2 14', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: spiral(104, 42), ...SW(1.5) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 124v16M86 124v16', ...SW(4) }, 'orange', { stroke: true })
  ],
  penalidad: [
    ground(),
    ...person(80, 136, 'gray', { h: 44, w: 30, r: 12, accent: true }),
    s('path', { d: 'M66 96L54 58M94 96l12-38', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: ells([[80, 40, 40, 22]]) }, 'brown'),
    s('path', { d: 'M64 34q8-6 18-4', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: drop(62, 80, 4) + drop(100, 80, 4) }, 'sky'),
    s('path', { d: 'M74 80q6-4 12 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  penetrante: [
    s('path', { d: 'M18 90q20-40 62-40t62 40q-20 40-62 40T18 90z' }, 'white'),
    s('path', { d: 'M18 90q20-40 62-40t62 40q-20 40-62 40T18 90z', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 90, r: 26 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 90, r: 11 }, 'black'),
    s('circle', { cx: 86, cy: 84, r: 4 }, 'white'),
    s('path', { d: 'M40 40l-8-12M80 30V14M120 40l8-12', ...SW(4) }, 'orange', { stroke: true })
  ]
};
