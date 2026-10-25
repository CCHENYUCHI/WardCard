// Illustration specs for words still undrawn in batches 0099–0100 (see server/scripts/lexicon/art.js)
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
  moratoria: [
    s('rect', { x: 24, y: 30, width: 92, height: 100, rx: 8 }, 'white'),
    outline({ x: 24, y: 30, width: 92, height: 100, rx: 8 }),
    s('rect', { x: 24, y: 30, width: 92, height: 22, rx: 6 }, 'red'),
    s('path', { d: grid(34, 62, 4, 3, 14, 12, 20, 20) }, 'gray'),
    s('circle', { cx: 112, cy: 110, r: 30 }, 'orange', { accent: true }),
    s('path', { d: rects([[100, 96, 8, 28], [116, 96, 8, 28]]) }, 'white')
  ],
  mus: [
    s('rect', { x: 26, y: 40, width: 52, height: 80, rx: 6, transform: 'rotate(-18 52 120)' }, 'cream'),
    s('rect', { x: 54, y: 32, width: 52, height: 80, rx: 6 }, 'cream'),
    s('rect', { x: 84, y: 40, width: 52, height: 80, rx: 6, transform: 'rotate(18 110 120)' }, 'cream'),
    s('path', { d: 'M26 40h52v80H26zM54 32h52v80H54zM84 40h52v80H84z', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 72, r: 16 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 72, r: 8 }, 'orange'),
    s('path', { d: 'M116 66h18l-4 18h-10zM125 84v10M118 96h14', ...SW(3) }, 'red', { stroke: true }),
    s('rect', { x: 38, y: 60, width: 6, height: 40, rx: 3, transform: 'rotate(-18 41 80)' }, 'brown')
  ],
  musculoso: [
    s('circle', { cx: 80, cy: 40, r: 16 }, 'skin'),
    s('path', { d: 'M60 66h40l-6 70H66z' }, 'red', { accent: true }),
    s('path', { d: 'M60 70q-24 0-30-22q-2-12 10-16q6 12 6 20q8-8 20-2z' }, 'skin'),
    s('path', { d: 'M100 70q24 0 30-22q2-12-10-16q-6 12-6 20q-8-8-20-2z' }, 'skin'),
    s('path', { d: 'M38 34a8 8 0 1 1 6-10M122 34a8 8 0 1 0-6-10', ...SW(4) }, 'skin', { stroke: true }),
    s('path', { d: 'M72 46q8 6 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  'máxime': [
    ground(),
    s('rect', { x: 22, y: 106, width: 24, height: 30, rx: 4 }, 'gray'),
    s('rect', { x: 114, y: 106, width: 24, height: 30, rx: 4 }, 'gray'),
    s('rect', { x: 58, y: 62, width: 44, height: 74, rx: 6 }, 'red', { accent: true }),
    s('path', { d: star(80, 36, 18) }, 'yellow'),
    s('path', { d: 'M40 40l14 14M120 40l-14 14', ...SW(5) }, 'orange', { stroke: true })
  ],
  neonazi: [
    s('path', { d: 'M48 40h36v60q30 4 36 20v14H44z' }, 'black'),
    s('path', { d: 'M44 124h76', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 52h28M52 66h28M52 80h28', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 84, r: 62, ...SW(10) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M36 40l88 88', ...SW(10) }, 'red', { stroke: true })
  ],
  novecientos: [
    s('path', { d: rects([[18, 18, 36, 36], [62, 18, 36, 36], [106, 18, 36, 36]]) }, 'blue', { accent: true }),
    s('path', { d: rects([[18, 62, 36, 36], [62, 62, 36, 36], [106, 62, 36, 36]]) }, 'green'),
    s('path', { d: rects([[18, 106, 36, 36], [62, 106, 36, 36], [106, 106, 36, 36]]) }, 'orange'),
    s('path', { d: [18, 62, 106].map(x => [18, 62, 106].map(y => `M${x + 12} ${y}v36M${x + 24} ${y}v36M${x} ${y + 12}h36M${x} ${y + 24}h36`).join('')).join(''), ...SW(2) }, 'white', { stroke: true })
  ],
  ojera: [
    s('circle', { cx: 80, cy: 82, r: 58 }, 'skin'),
    s('path', { d: 'M36 86q14 18 30 0M94 86q14 18 30 0', ...SW(9) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M38 74q12 6 26 0M96 74q12 6 26 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 116h28', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 56q-2-36 56-36t56 36q-20-18-56-18t-56 18z' }, 'brown')
  ],
  palestra: [
    s('ellipse', { cx: 80, cy: 128, rx: 66, ry: 16 }, 'tan'),
    s('path', { d: 'M14 128V108h132v20', ...SW(3) }, 'brown', { stroke: true }),
    ...person(54, 122, 'blue', { accent: true }),
    ...person(106, 122, 'red'),
    s('path', { d: 'M66 84l28 0', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M70 30l10-12 10 12', ...SW(4) }, 'orange', { stroke: true })
  ],
  panal: [
    s('path', { d: [[56, 50], [92, 50], [38, 80], [74, 80], [110, 80], [56, 110], [92, 110]].map(([x, y]) => `M${x - 17} ${y}l8.5-15h17l8.5 15-8.5 15h-17z`).join('') }, 'yellow', { accent: true }),
    s('path', { d: [[56, 50], [92, 50], [38, 80], [74, 80], [110, 80], [56, 110], [92, 110]].map(([x, y]) => `M${x - 17} ${y}l8.5-15h17l8.5 15-8.5 15h-17z`).join(''), ...SW(3) }, 'orange', { stroke: true }),
    s('ellipse', { cx: 130, cy: 36, rx: 12, ry: 8 }, 'yellow'),
    s('path', { d: 'M126 29v14M132 29v14', ...SW(3) }, 'black', { stroke: true }),
    s('path', { d: ells([[124, 26, 6, 5], [134, 25, 6, 5]]) }, 'sky')
  ],
  'paramédico': [
    s('circle', { cx: 60, cy: 40, r: 14 }, 'skin'),
    s('rect', { x: 42, y: 58, width: 36, height: 56, rx: 10 }, 'green'),
    s('path', { d: 'M48 114v22M72 114v22', ...SW(8) }, 'navy', { stroke: true }),
    s('rect', { x: 92, y: 86, width: 46, height: 36, rx: 6 }, 'red', { accent: true }),
    s('path', { d: 'M115 94v20M105 104h20', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M76 76q16 0 22 10', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M46 30q14-14 28 0z' }, 'white')
  ],
  paternal: [
    ground(),
    ...person(60, 136, 'blue', { h: 60, w: 34, r: 15 }),
    ...person(112, 136, 'yellow', { h: 30, w: 22, r: 10, accent: true }),
    s('path', { d: 'M76 100q14 6 26 0', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(88, 30, 14) }, 'red')
  ],
  peer: [
    ...person(56, 136, 'blue', { accent: true }),
    s('path', { d: 'M44 136v-10M68 136v-10', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: ells([[100, 104, 14, 12], [118, 92, 12, 10], [132, 110, 12, 10]]) }, 'mint'),
    s('path', { d: 'M84 116q8-4 12 2', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M44 40q-4-6 2-10M66 40q4-6-2-10', ...SW(3) }, 'dark', { stroke: true })
  ],
  peligrosidad: [
    s('path', { d: wedge(80, 112, 56, 180, 240) }, 'green'),
    s('path', { d: wedge(80, 112, 56, 240, 300) }, 'yellow'),
    s('path', { d: wedge(80, 112, 56, 300, 360) }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 112, r: 24 }, 'white'),
    s('path', { d: 'M80 112l40-36', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 112, r: 7 }, 'dark'),
    s('path', { d: 'M24 112h112', ...SW(3) }, 'gray', { stroke: true })
  ],
  perplejo: [
    s('circle', { cx: 80, cy: 98, r: 40 }, 'skin'),
    s('path', { d: dots([[66, 92], [94, 92]], 4) }, 'dark'),
    s('path', { d: 'M68 116q6-6 12 0t12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 80l12-4M100 76l-12 4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 40q-14-24 14-26q30 0 18 22q-14 18-26-2q-8-14 14-14q20 4 6 16q30-6 20-24q-8-10-20-4', ...SW(4) }, 'purple', { stroke: true, accent: true })
  ],
  piropo: [
    ...person(40, 136, 'blue'),
    s('path', { d: bubble(66, 20, 80, 64) }, 'white'),
    s('path', { d: bubble(66, 20, 80, 64), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M90 44l8-10h16l8 10-16 22z' }, 'red', { accent: true }),
    s('path', { d: sparkle(130, 34, 8) + sparkle(84, 64, 6) }, 'yellow')
  ],
  'plácido': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('circle', { cx: 112, cy: 44, r: 16 }, 'yellow'),
    s('path', { d: 'M14 96l34-36 26 24 22-18 50 30z' }, 'green'),
    s('rect', { x: 14, y: 96, width: 132, height: 50, rx: 0 }, 'blue', { accent: true }),
    s('path', { d: 'M30 116h30M86 128h36', ...SW(3) }, 'sky', { stroke: true })
  ],
  portaaviones: [
    s('rect', { x: 14, y: 100, width: 132, height: 46 }, 'blue'),
    s('path', { d: 'M18 86h128l-14 30H34z' }, 'gray', { accent: true }),
    s('rect', { x: 110, y: 60, width: 18, height: 26 }, 'gray'),
    s('path', { d: 'M28 92h100', ...DASH(2) }, 'white', { stroke: true }),
    s('path', { d: jet(60, 64), transform: 'rotate(90 60 64)' }, 'dark'),
    s('path', { d: 'M116 66h6', ...SW(3) }, 'sky', { stroke: true })
  ],
  psique: [
    s('path', { d: HEAD }, 'skin'),
    s('path', { d: 'M76 70q-26-24-26 2q2 14 26 0zM76 70q26-24 26 2q-2 14-26 0zM76 72q-20 18-14 24q8 2 14-22zM76 72q20 18 14 24q-8 2-14-22z' }, 'purple', { accent: true }),
    s('path', { d: 'M76 62v22', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(48, 40, 6) + sparkle(110, 46, 5) }, 'yellow')
  ],
  radiador: [
    s('path', { d: rects([[28, 60, 14, 72], [46, 60, 14, 72], [64, 60, 14, 72], [82, 60, 14, 72], [100, 60, 14, 72], [118, 60, 14, 72]]) }, 'white'),
    s('path', { d: rects([[28, 60, 14, 72], [46, 60, 14, 72], [64, 60, 14, 72], [82, 60, 14, 72], [100, 60, 14, 72], [118, 60, 14, 72]]), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 70h112M24 122h112', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M50 48q-6-8 0-14t0-14M80 48q-6-8 0-14t0-14M110 48q-6-8 0-14t0-14', ...SW(4) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M34 132v8M126 132v8', ...SW(5) }, 'dark', { stroke: true })
  ],
  recado: [
    s('rect', { x: 14, y: 20, width: 132, height: 120, rx: 6 }, 'tan'),
    s('rect', { x: 34, y: 40, width: 60, height: 60, transform: 'rotate(-6 64 70)' }, 'yellow', { accent: true }),
    s('path', { d: 'M44 58h40M44 70h40M44 82h26', ...SW(3), transform: 'rotate(-6 64 70)' }, 'dark', { stroke: true }),
    s('rect', { x: 92, y: 74, width: 44, height: 50, transform: 'rotate(8 114 99)' }, 'white'),
    s('path', { d: 'M100 92h28M100 104h20', ...SW(3), transform: 'rotate(8 114 99)' }, 'gray', { stroke: true }),
    s('circle', { cx: 62, cy: 42, r: 5 }, 'red')
  ],
  'rediseño': [
    s('rect', { x: 26, y: 40, width: 50, height: 50, rx: 4, ...DASH(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 100, cy: 92, r: 30 }, 'blue', { accent: true }),
    s('path', { d: 'M52 112a40 40 0 0 0 22 26', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M66 140l10 0-2-10', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M110 22l20 20-46 46-24 6 6-24z' }, 'yellow'),
    s('path', { d: 'M66 70l-6 24 24-6z' }, 'tan')
  ],
  relegar: [
    ground(),
    s('rect', { x: 52, y: 84, width: 40, height: 52 }, 'yellow'),
    s('rect', { x: 102, y: 108, width: 36, height: 28 }, 'gray'),
    ...person(72, 84, 'blue'),
    ...person(120, 108, 'red', { h: 34, accent: true }),
    s('path', { d: 'M92 40q30-6 32 40', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M116 72l8 10 8-10', ...SW(5) }, 'orange', { stroke: true })
  ],
  reorganizar: [
    s('rect', { x: 20, y: 24, width: 36, height: 36, rx: 4 }, 'red', { accent: true }),
    s('rect', { x: 104, y: 24, width: 36, height: 36, rx: 4 }, 'blue'),
    s('rect', { x: 20, y: 100, width: 36, height: 36, rx: 4 }, 'yellow'),
    s('rect', { x: 104, y: 100, width: 36, height: 36, rx: 4 }, 'green'),
    s('path', { d: 'M64 38q16-12 32 0M96 122q-16 12-32 0M38 68q-10 14 0 26M122 92q10-14 0-26', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M90 30l6 8-8 4M70 130l-6-8 8-4', ...SW(5) }, 'gray', { stroke: true })
  ],
  repensar: [
    s('path', { d: HEAD }, 'skin'),
    s('circle', { cx: 82, cy: 66, r: 30 }, 'white'),
    s('circle', { cx: 82, cy: 66, r: 30, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 60a18 18 0 1 0-4 16', ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M104 50v12h-12', ...SW(6) }, 'blue', { stroke: true })
  ],
  restrictivo: [
    ...person(80, 130, 'blue'),
    s('path', { d: 'M24 24h112v112H24z', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M46 24v112M68 24v112M92 24v112M114 24v112', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 66, y: 72, width: 28, height: 22, rx: 4 }, 'yellow', { accent: true }),
    s('path', { d: 'M72 72v-8a8 8 0 0 1 16 0v8', ...SW(4) }, 'gray', { stroke: true })
  ],
  resurgir: [
    s('path', { d: 'M40 146q-14-24 8-40q0 14 10 16q-6-20 14-34q4 24 16 26q4-14 0-22q30 18 20 54z' }, 'orange'),
    s('path', { d: 'M62 146q-4-14 10-22q4 10 10 10q6-8 2-16q16 12 8 28z' }, 'yellow'),
    s('path', { d: 'M80 82q-6-20 0-34q-34-6-56-24q16 30 40 40q-30 0-44 4q30 12 60 14zM80 48q34-6 56-24q-16 30-40 40q30 0 44 4q-30 12-60 14z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 40, r: 8 }, 'red'),
    s('path', { d: 'M86 38l8 2-8 3z' }, 'yellow')
  ],
  ropero: [
    s('rect', { x: 34, y: 18, width: 92, height: 120, rx: 4 }, 'brown', { accent: true }),
    s('rect', { x: 42, y: 26, width: 76, height: 104 }, 'cream'),
    s('path', { d: 'M42 40h76', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 42h18l4 10v40H44V52zM76 42h18l4 10v50H72V52z' }, 'blue'),
    s('path', { d: 'M102 42h12v56h-12z' }, 'red'),
    s('path', { d: 'M34 18l-14 8v104l14 8zM126 18l14 8v104l-14 8z' }, 'tan'),
    s('path', { d: 'M42 138v6M118 138v6', ...SW(5) }, 'dark', { stroke: true })
  ],
  savia: [
    s('path', { d: 'M46 146V60h68v86z' }, 'brown'),
    s('ellipse', { cx: 80, cy: 60, rx: 34, ry: 12 }, 'tan'),
    s('path', { d: ring(80, 60, 20) + ring(80, 60, 9), ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M86 66q6 14 2 26', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: drop(88, 108, 9) }, 'orange', { accent: true }),
    s('path', { d: 'M114 70q20-20 22-46q-18 10-20 30', ...SW(4) }, 'green', { stroke: true })
  ],
  'señorial': [
    s('rect', { x: 20, y: 70, width: 120, height: 66 }, 'cream'),
    s('path', { d: 'M14 72l66-46 66 46z' }, 'red', { accent: true }),
    s('path', { d: rects([[30, 78, 8, 58], [52, 78, 8, 58], [100, 78, 8, 58], [122, 78, 8, 58]]) }, 'white'),
    s('path', { d: rects([[30, 78, 8, 58], [52, 78, 8, 58], [100, 78, 8, 58], [122, 78, 8, 58]]), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 136v-30a10 10 0 0 1 20 0v30z' }, 'brown'),
    s('path', { d: 'M14 140h132', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 56, r: 8 }, 'yellow')
  ],
  sobrante: [
    s('path', { d: 'M48 40h64l-8 96H56z' }, 'sky'),
    s('path', { d: 'M48 40q32-14 64 0q-4 6 2 16q4 20-2 40q-4 10 6 10' }, 'blue', { accent: true }),
    s('path', { d: 'M114 106q6 20 10 30', ...SW(6) }, 'blue', { stroke: true }),
    s('ellipse', { cx: 128, cy: 140, rx: 16, ry: 4 }, 'blue'),
    s('path', { d: 'M48 40h64l-8 96H56z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: drop(36, 74, 5) }, 'blue')
  ],
  sufragar: [
    s('rect', { x: 34, y: 86, width: 92, height: 54, rx: 6 }, 'blue'),
    s('rect', { x: 64, y: 82, width: 32, height: 8, rx: 4 }, 'dark'),
    s('path', { d: heart(80, 108, 14) }, 'pink'),
    s('circle', { cx: 80, cy: 58, r: 14 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 58, r: 8, ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M40 28q20-10 30 4q4 8-4 10l-26 2z' }, 'skin'),
    s('path', { d: 'M80 76v4', ...SW(4) }, 'orange', { stroke: true })
  ],
  televisora: [
    s('path', { d: 'M52 140l18-90h20l18 90M60 104h40M66 76h28', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 40, r: 9 }, 'red'),
    s('path', { d: 'M56 26a30 30 0 0 0 0 28M104 26a30 30 0 0 1 0 28M42 16a48 48 0 0 0 0 48M118 16a48 48 0 0 1 0 48', ...SW(4) }, 'blue', { stroke: true }),
    s('rect', { x: 18, y: 104, width: 34, height: 36, rx: 4 }, 'gray'),
    s('rect', { x: 24, y: 112, width: 22, height: 16 }, 'sky')
  ],
  temerario: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 116h92v30H14z' }, 'brown'),
    s('path', { d: 'M106 116v30', ...SW(2) }, 'dark', { stroke: true }),
    ...car(56, 88, 'red', 'sky', { accent: true }),
    s('path', { d: 'M22 84h22M18 96h26M26 108h18', ...SW(4) }, 'white', { stroke: true })
  ],
  'vigía': [
    s('rect', { x: 14, y: 120, width: 132, height: 26 }, 'blue'),
    s('path', { d: 'M76 136V20', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M32 124h96l-12 16H44z' }, 'brown'),
    s('circle', { cx: 80, cy: 38, r: 10 }, 'skin'),
    s('path', { d: 'M62 50h36l-4 18H66z' }, 'red', { accent: true }),
    s('path', { d: 'M90 36l28-8', ...SW(6) }, 'dark', { stroke: true })
  ],
  acertadamente: [
    s('circle', { cx: 74, cy: 86, r: 56 }, 'red'),
    s('circle', { cx: 74, cy: 86, r: 40 }, 'white'),
    s('circle', { cx: 74, cy: 86, r: 24 }, 'red'),
    s('circle', { cx: 74, cy: 86, r: 10 }, 'yellow', { accent: true }),
    s('path', { d: 'M74 86l64-56', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M128 26l14-6-4 16M136 22l8 8', ...SW(4) }, 'green', { stroke: true })
  ],
  acontecer: [
    s('rect', { x: 22, y: 44, width: 76, height: 84, rx: 8 }, 'white'),
    outline({ x: 22, y: 44, width: 76, height: 84, rx: 8 }),
    s('rect', { x: 22, y: 44, width: 76, height: 20, rx: 6 }, 'blue'),
    s('path', { d: grid(32, 74, 4, 3, 10, 10, 16, 16) }, 'gray'),
    s('path', { d: burst(112, 50, 34, 18, 10) }, 'orange', { accent: true }),
    s('path', { d: star(112, 50, 12) }, 'yellow')
  ],
  acuarela: [
    s('rect', { x: 18, y: 84, width: 124, height: 50, rx: 12 }, 'white'),
    outline({ x: 18, y: 84, width: 124, height: 50, rx: 12 }),
    s('path', { d: ells([[40, 100, 10, 8]]) }, 'red'),
    s('path', { d: ells([[66, 100, 10, 8]]) }, 'yellow'),
    s('path', { d: ells([[92, 100, 10, 8]]) }, 'blue', { accent: true }),
    s('path', { d: ells([[118, 100, 10, 8]]) }, 'green'),
    s('path', { d: 'M48 70l70-52', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M42 74q-8 0-8 8q8 0 12-4z' }, 'dark'),
    s('path', { d: drop(36, 30, 7) + drop(56, 46, 5) }, 'sky')
  ],
  adentrar: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'mint'),
    s('path', { d: 'M22 146q0-110 70-110t60 110z' }, 'gray'),
    s('path', { d: 'M56 146q0-70 38-70t38 70z' }, 'dark'),
    ...lean(80, 140, 8, 'orange', { h: 30, w: 20, r: 9, accent: true }),
    s('path', { d: 'M70 140l-6-2M88 140l4-2', ...SW(3) }, 'dark', { stroke: true })
  ],
  adoctrinamiento: [
    s('path', { d: HEAD, transform: 'translate(0 10)' }, 'skin'),
    s('path', { d: 'M54 14h52l-20 26v12h-12V40z' }, 'gray', { accent: true }),
    s('path', { d: 'M70 54h16v22H70z' }, 'blue'),
    s('rect', { x: 40, y: 2, width: 30, height: 18, rx: 2, transform: 'rotate(-10 55 11)' }, 'red'),
    s('path', { d: 'M48 8h14', ...SW(2), transform: 'rotate(-10 55 11)' }, 'white', { stroke: true }),
    s('path', { d: dots([[100, 94]], 4) }, 'dark')
  ],
  aducir: [
    s('path', { d: 'M100 42v84M78 136h44M70 52h60', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M62 52l-10 26h20zM138 52l-10 26h20z' }, 'yellow'),
    s('path', { d: 'M50 80a12 6 0 0 0 24 0zM126 80a12 6 0 0 0 24 0z' }, 'orange'),
    ...paper(16, 92, 38, 48),
    s('path', { d: 'M24 106h22M24 116h22M24 126h14', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 66l20 16', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M48 82l12 0 0-12', ...SW(5) }, 'red', { stroke: true })
  ],
  alado: [
    ...horse('white', 'gray', { accent: true }),
    s('path', { d: 'M70 70q-10-40-46-48q10 18 8 28q-12 0-18 0q14 14 22 20q-10 4-14 8q26 4 48-8z' }, 'sky'),
    s('path', { d: ells([[76, 84, 44, 20]]), ...SW(3) }, 'gray', { stroke: true })
  ],
  'ambientación': [
    s('rect', { x: 14, y: 24, width: 132, height: 112 }, 'navy'),
    s('path', { d: 'M14 24h30q-6 60 0 112H14zM146 24h-30q6 60 0 112h30z' }, 'red', { accent: true }),
    s('path', { d: 'M60 24l-8 112h56l-8-112z' }, 'cream'),
    s('rect', { x: 14, y: 128, width: 132, height: 12 }, 'brown'),
    s('path', { d: 'M70 128v-20h-8l18-36 18 36h-8v20z' }, 'green'),
    s('path', { d: 'M14 18h132', ...SW(6) }, 'dark', { stroke: true })
  ],
  'analógico': [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'cream'),
    s('circle', { cx: 80, cy: 80, r: 60, ...SW(8) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: rays(80, 80, 44, 52, 12), ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 80V44M80 80l26 14', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 5 }, 'red')
  ],
  anhelar: [
    ground(),
    ...lean(56, 136, 16, 'blue'),
    s('path', { d: 'M74 92l34-40', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: star(124, 34, 20) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(96, 22, 6) + sparkle(140, 66, 5) }, 'orange')
  ],
  antebrazo: [
    s('path', { d: 'M14 60q24-8 50 4', ...SW(26) }, 'skin', { stroke: true }),
    s('path', { d: 'M64 64l52 40', ...SW(24) }, 'orange', { stroke: true, accent: true }),
    s('circle', { cx: 64, cy: 64, r: 13 }, 'skin'),
    s('path', { d: 'M114 92q22-4 30 10q6 14-8 22q-14 6-22-10z' }, 'skin'),
    s('path', { d: 'M54 30l8 18M126 70l-8 16', ...SW(4) }, 'red', { stroke: true })
  ],
  archiduque: [
    s('ellipse', { cx: 80, cy: 124, rx: 60, ry: 18 }, 'purple'),
    s('path', { d: 'M38 112l-6-56 26 22 22-38 22 38 26-22-6 56z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[32, 52], [80, 36], [128, 52]], 7) }, 'yellow'),
    s('path', { d: dots([[58, 98], [80, 98], [102, 98]], 6) }, 'red'),
    s('path', { d: 'M80 32V14M72 22h16', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M38 112h84', ...SW(6) }, 'white', { stroke: true })
  ],
  'armazón': [
    ground(),
    s('path', { d: 'M28 136V72l52-44 52 44v64', ...SW(7) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M28 72h104M28 104h104M54 50v86M80 28v108M106 50v86', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M28 104l26-32M54 104l26-32M106 104l26-32', ...SW(3) }, 'tan', { stroke: true })
  ],
  arrechera: [
    s('circle', { cx: 80, cy: 90, r: 48 }, 'red', { accent: true }),
    s('path', { d: 'M54 72l18 8M106 72l-18 8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[64, 88], [96, 88]], 5) }, 'dark'),
    s('path', { d: 'M62 116q18-14 36 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 34q-8-10 0-18M116 34q8-10 0-18M80 30q-6-8 0-16', ...SW(5) }, 'gray', { stroke: true })
  ],
  arroba: [
    s('path', { d: 'M80 34v20M20 54h120', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M20 54l-10 30h20zM140 54l-10 30h20z' }, 'dark'),
    s('path', { d: 'M8 84a12 6 0 0 0 24 0zM128 84a12 6 0 0 0 24 0z' }, 'gray'),
    s('path', { d: 'M40 136q-8-34 14-40l-4-8h20l-4 8q22 6 14 40z' }, 'tan', { accent: true }),
    s('path', { d: 'M96 136l6-30h28l6 30z' }, 'dark'),
    s('path', { d: 'M110 106v-8h8v8', ...SW(3) }, 'dark', { stroke: true }),
    ground(140)
  ],
  asador: [
    s('path', { d: 'M30 136l20-72M130 136l-20-72', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M20 70h124', ...SW(5) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 80, cy: 70, rx: 34, ry: 18 }, 'brown', { accent: true }),
    s('path', { d: 'M60 66q20 6 40 0', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M50 140q-10-20 6-30q0 10 8 10q-2-16 16-24q2 16 10 18q4-10 2-18q22 14 12 44z' }, 'orange'),
    s('path', { d: 'M144 70h4v-12', ...SW(5) }, 'gray', { stroke: true })
  ],
  auspiciar: [
    s('path', { d: 'M24 136q-4-30 20-34l26-8q8 0 6 8l-14 6h50q10 0 6 10z' }, 'skin'),
    s('rect', { x: 30, y: 74, width: 100, height: 14, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M54 74l-4-50M106 74l4-50', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M50 24h60v26H50z' }, 'blue'),
    s('path', { d: star(80, 37, 9) }, 'yellow')
  ],
  basto: [
    s('path', { d: 'M18 100l10-30 22-10 18 8 20-14 26 6 20 18 8 22-14 20-30 4-26-6-28 4z' }, 'brown', { accent: true }),
    s('path', { d: dots([[40, 86], [56, 100], [76, 82], [92, 102], [110, 84], [122, 104], [66, 116], [100, 118], [36, 108]], 3) }, 'dark'),
    s('path', { d: 'M44 72l6-8M92 60l4-8M128 76l8-6M24 104l-6 4', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: dots([[48, 92], [84, 92], [116, 96]], 2) }, 'tan')
  ],
  'borrón': [
    ...paper(22, 20, 96, 120),
    s('path', { d: 'M36 40h68M36 56h68M36 72h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 88q14-12 22 2q16-6 12 12q12 10-4 18q-4 14-18 6q-14 8-18-8q-14-6-2-16q-6-12 8-14z' }, 'navy', { accent: true }),
    s('rect', { x: 100, y: 96, width: 22, height: 44, rx: 4, transform: 'rotate(30 111 118)' }, 'pink'),
    s('rect', { x: 100, y: 96, width: 22, height: 16, rx: 4, transform: 'rotate(30 111 118)' }, 'blue')
  ],
  cadencia: [
    s('path', { d: 'M50 140l18-120h24l18 120z' }, 'brown', { accent: true }),
    s('path', { d: 'M58 128h44', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M80 120L104 38', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 92, y: 60, width: 16, height: 10, rx: 2, transform: 'rotate(16 100 65)' }, 'yellow'),
    s('path', { d: 'M114 30q12 8 12 22M122 22q18 12 18 34M46 30q-12 8-12 22M38 22q-18 12-18 34', ...SW(4) }, 'orange', { stroke: true })
  ],
  camada: [
    s('ellipse', { cx: 80, cy: 112, rx: 66, ry: 26 }, 'blue'),
    s('ellipse', { cx: 80, cy: 106, rx: 54, ry: 18 }, 'sky'),
    s('path', { d: ells([[48, 96, 14, 12], [80, 92, 14, 12], [112, 96, 14, 12]]) }, 'tan', { accent: true }),
    s('path', { d: 'M36 88l-2 14 8-6zM60 88l2 14-8-6zM68 84l-2 14 8-6zM92 84l2 14-8-6zM100 88l-2 14 8-6zM124 88l2 14-8-6z' }, 'brown'),
    s('path', { d: dots([[44, 94], [52, 94], [76, 90], [84, 90], [108, 94], [116, 94]], 2) + dots([[48, 102], [80, 98], [112, 102]], 3) }, 'dark'),
    s('path', { d: ells([[50, 64, 26, 20]]) + 'M70 52l14-12 2 18z' }, 'brown')
  ],
  candente: [
    s('path', { d: 'M14 120l40-40', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 128l40-40', ...SW(8) }, 'dark', { stroke: true }),
    s('rect', { x: 50, y: 66, width: 96, height: 22, rx: 6, transform: 'rotate(-30 98 77)' }, 'red', { accent: true }),
    s('rect', { x: 92, y: 52, width: 54, height: 22, rx: 6, transform: 'rotate(-30 98 77)' }, 'orange'),
    s('rect', { x: 120, y: 48, width: 24, height: 22, rx: 6, transform: 'rotate(-30 98 77)' }, 'yellow'),
    s('path', { d: 'M88 40q-6-8 0-16M110 30q-6-8 0-16', ...SW(4) }, 'orange', { stroke: true })
  ],
  'cariñosamente': [
    ...person(62, 136, 'blue', { h: 54, w: 32, r: 14 }),
    ...person(98, 136, 'pink', { h: 50, w: 30, r: 13 }),
    s('path', { d: 'M48 100q30 14 60-4', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 30, 16) }, 'red', { accent: true })
  ],
  catarsis: [
    s('circle', { cx: 80, cy: 90, r: 44 }, 'skin'),
    s('path', { d: 'M58 84q8-6 14 0M88 84q8-6 14 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 110q16 12 32 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: drop(60, 104, 5) + drop(102, 104, 5) + drop(52, 124, 4) }, 'sky', { accent: true }),
    s('path', { d: halfRays(80, 50, 44, 60, 7), ...SW(5) }, 'yellow', { stroke: true })
  ],
  censor: [
    ...paper(24, 18, 84, 120),
    s('path', { d: 'M36 36h60M36 64h60M36 92h60M36 120h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[34, 44, 64, 12], [34, 100, 64, 12]]) }, 'black'),
    s('path', { d: 'M116 30l20 6-34 92-12 6 0-14z' }, 'red', { accent: true }),
    s('path', { d: 'M116 30l20 6-4 10-20-6z' }, 'dark')
  ],
  'centralización': [
    s('circle', { cx: 80, cy: 80, r: 20 }, 'red', { accent: true }),
    s('path', { d: dots(around(80, 80, 58, 8, 22.5), 9) }, 'blue'),
    s('path', { d: rays(80, 80, 28, 46, 8, 22.5), ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: around(80, 80, 30, 8, 22.5).map(([x, y]) => { const dx = (x - 80) / 30, dy = (y - 80) / 30; return `M${(x + dx * 8 - dy * 6).toFixed(1)} ${(y + dy * 8 + dx * 6).toFixed(1)}L${x} ${y}L${(x + dx * 8 + dy * 6).toFixed(1)} ${(y + dy * 8 - dx * 6).toFixed(1)}`; }).join(''), ...SW(5) }, 'gray', { stroke: true })
  ],
  'chabón': [
    ground(),
    ...person(70, 136, 'green', { h: 56, w: 34, r: 15, accent: true }),
    s('path', { d: 'M55 54q15-16 30 0z' }, 'blue'),
    s('path', { d: 'M84 54h12', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M86 90l24-30', ...SW(8) }, 'skin', { stroke: true }),
    s('circle', { cx: 112, cy: 54, r: 8 }, 'skin'),
    s('path', { d: 'M122 40l8-6M126 54h10', ...SW(3) }, 'orange', { stroke: true })
  ],
  civismo: [
    ground(),
    ...person(50, 136, 'blue'),
    s('path', { d: 'M64 96l26-14', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M100 92h36l-4 44h-28z' }, 'green', { accent: true }),
    s('rect', { x: 96, y: 84, width: 44, height: 8, rx: 3 }, 'dark'),
    s('rect', { x: 100, y: 56, width: 12, height: 16, rx: 2, transform: 'rotate(20 106 64)' }, 'red'),
    s('path', { d: 'M108 76l4 6', ...DASH(3, '3 4') }, 'gray', { stroke: true })
  ],
  cocer: [
    s('path', { d: 'M26 136h108', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M50 136q-6-10 4-14q0 6 6 6q-2-10 10-14q0 10 6 10M90 136q-6-10 4-14q0 6 6 6q-2-10 10-14q0 10 6 10' }, 'orange'),
    s('path', { d: 'M34 64h92v50q0 10-10 10H44q-10 0-10-10z' }, 'gray', { accent: true }),
    s('path', { d: 'M34 76H20M126 76h14', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[54, 58], [80, 54], [104, 58]], 7) }, 'sky'),
    s('path', { d: 'M60 40q-6-8 0-16M80 36q-6-8 0-16M100 40q-6-8 0-16', ...SW(4) }, 'gray', { stroke: true })
  ],
  coleccionar: [
    s('rect', { x: 18, y: 22, width: 124, height: 116, rx: 6 }, 'navy'),
    s('path', { d: rects([[30, 34, 28, 30], [66, 34, 28, 30]]) }, 'red', { accent: true }),
    s('path', { d: rects([[102, 34, 28, 30], [30, 76, 28, 30]]) }, 'yellow'),
    s('path', { d: rects([[66, 76, 28, 30], [102, 76, 28, 30]]) }, 'green'),
    s('path', { d: rects([[30, 34, 28, 30], [66, 34, 28, 30], [102, 34, 28, 30], [30, 76, 28, 30], [66, 76, 28, 30], [102, 76, 28, 30]]), ...DASH(3, '3 3') }, 'white', { stroke: true }),
    s('path', { d: 'M100 130l26-14', ...SW(5) }, 'gray', { stroke: true })
  ],
  comensal: [
    ...person(36, 112, 'blue'),
    ...person(124, 112, 'red'),
    s('rect', { x: 14, y: 100, width: 132, height: 10, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: 'M30 110v30M130 110v30', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: ells([[64, 96, 16, 5], [96, 96, 16, 5]]) }, 'white'),
    s('path', { d: ells([[64, 92, 8, 4], [96, 92, 8, 4]]) }, 'orange')
  ],
  compresor: [
    s('rect', { x: 20, y: 70, width: 100, height: 50, rx: 25 }, 'red', { accent: true }),
    s('path', { d: dots([[38, 128], [102, 128]], 9) }, 'dark'),
    s('rect', { x: 46, y: 42, width: 46, height: 28, rx: 4 }, 'gray'),
    s('circle', { cx: 108, cy: 50, r: 13 }, 'white'),
    s('path', { d: ring(108, 50, 13) + 'M108 50l6-8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M120 94q24 0 22 24t-12 22', ...SW(5) }, 'dark', { stroke: true })
  ],
  confeccionar: [
    s('path', { d: 'M62 22h36l6 16q-14 10-24 10t-24-10z' }, 'gray'),
    s('path', { d: 'M56 38q24 18 48 0l10 40-8 60H54l-8-60z' }, 'purple', { accent: true }),
    s('path', { d: 'M54 78h52', ...DASH(3, '4 4') }, 'white', { stroke: true }),
    s('path', { d: 'M100 112l40-40', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 108q-10 14-24 4q-10-8-20 4', ...SW(2) }, 'red', { stroke: true }),
    s('circle', { cx: 138, cy: 74, r: 3 }, 'white')
  ],
  contaminar: [
    s('rect', { x: 14, y: 120, width: 132, height: 26 }, 'brown'),
    s('path', { d: 'M20 120V80l26 14V80l26 14V60h20v60z' }, 'gray', { accent: true }),
    s('rect', { x: 100, y: 40, width: 14, height: 80 }, 'dark'),
    s('path', { d: ells([[110, 30, 14, 10], [128, 22, 14, 10], [94, 22, 10, 8]]) }, 'dark'),
    s('path', { d: 'M114 120q8 10 0 26', ...SW(8) }, 'green', { stroke: true }),
    s('path', { d: 'M30 132h20M70 138h24', ...SW(3) }, 'black', { stroke: true })
  ],
  cornudo: [
    s('circle', { cx: 80, cy: 92, r: 42 }, 'skin'),
    s('path', { d: 'M54 60q-24-20-18-48q12 24 30 38zM106 60q24-20 18-48q-12 24-30 38z' }, 'tan', { accent: true }),
    s('path', { d: 'M54 60q-24-20-18-48M106 60q24-20 18-48', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: dots([[66, 88], [94, 88]], 4) }, 'dark'),
    s('path', { d: 'M66 116q14-10 28 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: drop(100, 104, 4) }, 'sky')
  ],
  cotejo: [
    ...paper(18, 24, 54, 96),
    ...paper(88, 24, 54, 96),
    s('path', { d: 'M28 44h34M28 64h34M28 84h34M98 44h34M98 64h34M98 84h34', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 44h36M62 64h36M62 84h36', ...DASH(2, '3 4') }, 'blue', { stroke: true }),
    s('path', { d: 'M60 132l8 8 16-18M100 132l8 8 16-18', ...SW(5) }, 'green', { stroke: true, accent: true })
  ],
  'denegación': [
    ...paper(28, 18, 90, 120),
    s('path', { d: 'M42 38h60M42 54h60M42 70h40', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 100, cy: 104, r: 30 }, 'red', { accent: true }),
    s('path', { d: 'M88 92l24 24M112 92l-24 24', ...SW(7) }, 'white', { stroke: true })
  ],
  desabastecimiento: [
    s('rect', { x: 18, y: 18, width: 124, height: 124, rx: 4 }, 'tan'),
    s('path', { d: 'M18 56h124M18 96h124M18 136h124', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 28, y: 36, width: 14, height: 20, rx: 2 }, 'red', { accent: true }),
    s('path', { d: 'M110 136l12-10', ...SW(4) }, 'gray', { stroke: true })
  ],
  'desaceleración': [
    s('path', { d: 'M20 112a60 60 0 0 1 120 0', ...SW(14) }, 'gray', { stroke: true }),
    s('path', { d: 'M20 112a60 60 0 0 1 30-52', ...SW(14) }, 'green', { stroke: true }),
    s('path', { d: 'M80 112L46 82', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 112, r: 8 }, 'dark'),
    s('path', { d: 'M120 54a50 50 0 0 0-40-22', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M86 24l-8 8 8 8', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M20 136h120', ...SW(4) }, 'gray', { stroke: true })
  ],
  desesperante: [
    ...car(14, 120, 'gray'),
    ...car(86, 120, 'blue'),
    s('circle', { cx: 80, cy: 52, r: 26 }, 'skin'),
    s('path', { d: 'M54 50q-16-16-4-30M106 50q16-16 4-30', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: spiral(64, 48) + spiral(86, 48) + 'M70 68q10-6 20 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 14l6 8M80 8v10M102 14l-6 8', ...SW(4) }, 'red', { stroke: true, accent: true })
  ],
  desvelar: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('path', { d: 'M126 26a16 16 0 1 0 8 26a14 14 0 1 1-8-26z' }, 'yellow'),
    s('rect', { x: 20, y: 100, width: 120, height: 30, rx: 6 }, 'blue'),
    s('circle', { cx: 46, cy: 90, r: 16 }, 'skin'),
    s('path', { d: ells([[40, 88, 5, 6], [54, 88, 5, 6]]) }, 'white', { accent: true }),
    s('path', { d: dots([[40, 89], [54, 89]], 2.5) }, 'dark'),
    s('path', { d: 'M62 96h78v20H62z' }, 'sky')
  ],
  'dilatación': [
    s('circle', { cx: 80, cy: 80, r: 30 }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 50, ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: rays(80, 80, 34, 60, 8), ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: around(80, 80, 60, 8).map(([x, y]) => { const dx = (x - 80) / 60, dy = (y - 80) / 60; return `M${(x - dx * 8 - dy * 6).toFixed(1)} ${(y - dy * 8 + dx * 6).toFixed(1)}L${x} ${y}L${(x - dx * 8 + dy * 6).toFixed(1)} ${(y - dy * 8 - dx * 6).toFixed(1)}`; }).join(''), ...SW(5) }, 'red', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'yellow')
  ],
  'disertación': [
    s('rect', { x: 64, y: 18, width: 80, height: 54, rx: 4 }, 'white'),
    outline({ x: 64, y: 18, width: 80, height: 54, rx: 4 }),
    s('path', { d: 'M76 58l14-16 12 10 16-20 14 14', ...SW(4) }, 'blue', { stroke: true }),
    ...person(40, 112, 'navy', { h: 40 }),
    s('path', { d: 'M22 94h50l-6 44H28z' }, 'brown', { accent: true }),
    s('path', { d: 'M52 76l18-14', ...SW(5) }, 'skin', { stroke: true })
  ],
  'ecografía': [
    s('rect', { x: 18, y: 18, width: 124, height: 96, rx: 8 }, 'dark'),
    s('path', { d: 'M40 100l40-70 40 70z' }, 'gray'),
    s('path', { d: 'M74 62a14 14 0 1 1 18 14q10 10 0 18q-12 6-22-4q-8-14 4-28z' }, 'white', { accent: true }),
    s('rect', { x: 60, y: 118, width: 40, height: 10, rx: 3 }, 'gray'),
    s('rect', { x: 110, y: 120, width: 14, height: 26, rx: 6 }, 'blue')
  ],
  empresariado: [
    s('path', { d: busts([36, 80, 124], 140, 36, 44) }, 'navy', { accent: true }),
    s('path', { d: dots([[36, 76], [80, 72], [124, 76]], 14) }, 'skin'),
    s('path', { d: 'M32 104l4-8 4 8-4 16zM76 100l4-8 4 8-4 16zM120 104l4-8 4 8-4 16z' }, 'red'),
    s('path', { d: rects([[60, 22, 40, 26]]) }, 'brown'),
    s('path', { d: 'M72 22v-6h16v6M60 34h40', ...SW(3) }, 'dark', { stroke: true })
  ],
  'escalafón': [
    s('path', { d: 'M14 140h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 140v-26h36v-26h36v-26h36v78z' }, 'blue'),
    ...person(36, 114, 'yellow', { h: 22, w: 16, r: 8 }),
    ...person(72, 88, 'yellow', { h: 22, w: 16, r: 8 }),
    ...person(108, 62, 'red', { h: 22, w: 16, r: 8, accent: true }),
    s('path', { d: star(108, 20, 9) }, 'yellow')
  ],
  espantar: [
    s('path', { d: 'M60 140V44M30 64h60', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 60, cy: 36, r: 14 }, 'tan'),
    s('path', { d: 'M40 30h40l-8-14H48z' }, 'yellow'),
    s('path', { d: 'M42 58h36l6 50H36z' }, 'red', { accent: true }),
    s('path', { d: 'M30 64l-8 10M90 64l8 10', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: birds([[112, 40], [134, 60], [118, 82]]), ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 140h132', ...SW(4) }, 'green', { stroke: true })
  ],
  espontaneidad: [
    ground(),
    s('circle', { cx: 80, cy: 46, r: 14 }, 'skin'),
    s('rect', { x: 66, y: 64, width: 28, height: 40, rx: 10 }, 'orange', { accent: true }),
    s('path', { d: 'M68 70L44 40M92 70l24-30M72 102l-10 20M88 102l10 20', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(30, 30, 9) + sparkle(130, 30, 9) + sparkle(130, 100, 6) + sparkle(30, 100, 6) }, 'yellow'),
    s('path', { d: 'M74 50q6 6 12 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  'flexión': [
    ground(132),
    s('circle', { cx: 124, cy: 84, r: 11 }, 'skin'),
    s('path', { d: 'M110 92L30 120', ...SW(16) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M30 120l-8 10', ...SW(8) }, 'navy', { stroke: true }),
    s('path', { d: 'M104 98l-4 16 12 16', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M120 60v14l6-6M120 74l-6-6', ...SW(3) }, 'orange', { stroke: true })
  ],
  florecimiento: [
    ...flower(80, 44, 'pink'),
    s('path', { d: 'M80 110q-26-4-34-24q22-2 34 16M80 96q26-4 34-24q-22-2-34 16' }, 'green'),
    s('path', { d: dots([[40, 50], [120, 50]], 8) }, 'red'),
    s('path', { d: sparkle(30, 24, 7) + sparkle(130, 24, 7) }, 'yellow')
  ],
  floresta: [
    s('rect', { x: 14, y: 110, width: 132, height: 36 }, 'mint'),
    s('rect', { x: 34, y: 82, width: 10, height: 40 }, 'brown'),
    s('rect', { x: 112, y: 82, width: 10, height: 40 }, 'brown'),
    s('path', { d: ells([[40, 62, 26, 30], [116, 62, 26, 30], [78, 50, 28, 36]]) }, 'green', { accent: true }),
    s('rect', { x: 74, y: 82, width: 10, height: 40 }, 'brown'),
    s('path', { d: dots([[24, 132], [50, 138], [70, 128], [96, 136], [124, 130], [140, 140]], 5) }, 'pink'),
    s('path', { d: dots([[36, 140], [86, 140], [110, 140]], 4) }, 'yellow')
  ],
  'geométrico': [
    s('path', { d: 'M22 140l40-70 40 70z' }, 'blue'),
    s('circle', { cx: 110, cy: 50, r: 30 }, 'yellow', { accent: true }),
    s('rect', { x: 18, y: 18, width: 44, height: 44 }, 'red'),
    s('rect', { x: 104, y: 98, width: 38, height: 38, transform: 'rotate(45 123 117)' }, 'green')
  ],
  guagua: [
    s('rect', { x: 14, y: 40, width: 132, height: 80, rx: 10 }, 'yellow', { accent: true }),
    s('path', { d: rects([[24, 52, 22, 26], [52, 52, 22, 26], [80, 52, 22, 26]]) }, 'sky'),
    s('rect', { x: 110, y: 52, width: 26, height: 56, rx: 2 }, 'sky'),
    s('path', { d: 'M14 92h96', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: dots([[40, 122], [116, 122]], 13) }, 'dark'),
    s('path', { d: dots([[40, 122], [116, 122]], 5) }, 'gray')
  ],
  guillotina: [
    s('rect', { x: 18, y: 96, width: 124, height: 40, rx: 4 }, 'tan'),
    s('path', { d: grid(26, 104, 6, 3, 16, 6, 18, 10) }, 'brown'),
    s('rect', { x: 50, y: 82, width: 70, height: 14 }, 'white'),
    outline({ x: 50, y: 82, width: 70, height: 14 }),
    s('path', { d: 'M28 96L120 24l8 10-92 66z' }, 'gray', { accent: true }),
    s('rect', { x: 112, y: 14, width: 30, height: 14, rx: 6, transform: 'rotate(-38 127 21)' }, 'red'),
    s('circle', { cx: 30, cy: 96, r: 7 }, 'dark')
  ],
  hato: [
    s('path', { d: ells([[100, 108, 22, 14], [124, 104, 16, 12]]) }, 'white'),
    s('path', { d: ells([[100, 108, 22, 14], [124, 104, 16, 12]]), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[136, 100], [116, 98]], 6) }, 'dark'),
    s('path', { d: 'M92 120v16M110 120v16M120 114v18M132 112v18', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 136L70 40', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M50 44q-4-20 20-24q24 4 20 24q-4 18-20 18q-16 0-20-18z' }, 'red', { accent: true }),
    s('path', { d: 'M62 22l8 8 8-8', ...SW(3) }, 'dark', { stroke: true })
  ],
  hedor: [
    s('path', { d: 'M40 70h80l-8 70H48z' }, 'gray'),
    s('rect', { x: 34, y: 60, width: 92, height: 12, rx: 4 }, 'dark'),
    s('path', { d: 'M56 84v44M80 84v44M104 84v44', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 50q-10-10 0-20t0-20M80 50q-10-10 0-20t0-20M106 50q-10-10 0-20t0-20', ...SW(6) }, 'green', { stroke: true, accent: true }),
    s('path', { d: ells([[134, 36, 5, 4]]) + 'M130 30l-4-6M138 30l4-6' }, 'dark')
  ],
  'homofóbico': [
    s('path', { d: heart(80, 60, 52), transform: 'translate(0 0)' }, 'red', { accent: true }),
    s('path', { d: 'M24 52h112v12H24z' }, 'orange'),
    s('path', { d: 'M28 70h104v12H28z' }, 'yellow'),
    s('path', { d: 'M38 88h84v12H38z' }, 'green'),
    s('path', { d: 'M54 106h52v12H54z' }, 'blue'),
    s('path', { d: 'M82 26l-10 22 14 14-12 22 10 18-8 20', ...SW(6) }, 'white', { stroke: true, lineColor: 'dark' })
  ],
  'incitación': [
    ...person(40, 136, 'red', { accent: true }),
    s('path', { d: 'M56 76l28-16v40l-28-16z' }, 'gray'),
    s('rect', { x: 50, y: 74, width: 10, height: 14 }, 'dark'),
    s('path', { d: 'M96 62l14-8M98 80h16M96 98l14 8', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M118 140q-14-20 4-34q0 12 8 12q0-16 12-22q2 22 2 44z' }, 'orange')
  ],
  individualista: [
    ground(),
    ...person(38, 136, 'gray', { h: 36, w: 24, r: 10 }),
    ...person(62, 136, 'gray', { h: 36, w: 24, r: 10 }),
    ...person(122, 136, 'red', { h: 44, w: 28, r: 12, accent: true }),
    s('path', { d: 'M96 56v80', ...DASH(3) }, 'gray', { stroke: true })
  ],
};
