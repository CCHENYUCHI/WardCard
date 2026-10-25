// Illustration specs for words still undrawn in batches 0096–0097 (see server/scripts/lexicon/art.js)
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
  visibilizar: [
    backdrop('navy'),
    s('path', { d: 'M70 22h20l40 114H30z' }, 'yellow'),
    s('path', { d: 'M64 14h32l-6 14H70z' }, 'gray'),
    ...person(80, 136, 'red', { h: 40, w: 28, r: 12, accent: true }),
    s('path', { d: sparkle(48, 70, 8) + sparkle(114, 64, 7) }, 'white')
  ],
  'ítem': [
    s('rect', { x: 34, y: 22, width: 92, height: 120, rx: 8 }, 'brown'),
    s('rect', { x: 42, y: 34, width: 76, height: 102, rx: 4 }, 'white'),
    s('rect', { x: 62, y: 16, width: 36, height: 14, rx: 4 }, 'gray'),
    s('path', { d: 'M50 56l6 6 10-12M50 86l6 6 10-12', ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: rects([[50, 108, 14, 14]]), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 56h36M74 86h36M74 116h36', ...SW(5) }, 'gray', { stroke: true })
  ],
  'acordeón': [
    s('rect', { x: 18, y: 40, width: 30, height: 84, rx: 6 }, 'red', { accent: true }),
    s('rect', { x: 112, y: 40, width: 30, height: 84, rx: 6 }, 'red'),
    s('path', { d: 'M48 46l8 78 8-78 8 78 8-78 8 78 8-78 8 78 8-78v78H48z' }, 'dark'),
    s('path', { d: 'M48 46h64M48 118h64', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[26, 56], [26, 72], [26, 88], [26, 104], [38, 64], [38, 80], [38, 96]], 3) }, 'white'),
    s('path', { d: rects([[120, 52, 14, 6], [120, 64, 14, 6], [120, 76, 14, 6], [120, 88, 14, 6], [120, 100, 14, 6]]) }, 'white')
  ],
  afectivo: [
    s('path', { d: heart(80, 84, 32) }, 'red', { accent: true }),
    s('path', { d: 'M18 140q4-34 30-42l22 16q-10 10-14 26z' }, 'skin'),
    s('path', { d: 'M142 140q-4-34-30-42l-22 16q10 10 14 26z' }, 'skin'),
    s('path', { d: sparkle(32, 34, 8) + sparkle(128, 30, 7) }, 'pink')
  ],
  afluente: [
    backdrop('green'),
    s('path', { d: 'M14 120q60-10 132-40v40q-60 26-132 26z' }, 'blue', { accent: true }),
    s('path', { d: 'M30 20q10 40 50 80M110 18q-10 30 6 62M146 40q-20 10-24 40', ...SW(7) }, 'sky', { stroke: true }),
    s('path', { d: ells([[40, 48, 10, 8], [130, 120, 8, 6]]) }, 'mint')
  ],
  afroamericano: [
    s('path', { d: ells([[80, 46, 30, 26]]) }, 'dark'),
    s('circle', { cx: 80, cy: 58, r: 22 }, 'brown'),
    s('path', { d: 'M34 146v-20q0-30 46-30t46 30v20z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[72, 56], [88, 56]], 2.5) }, 'dark'),
    s('path', { d: 'M72 68q8 6 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  aguado: [
    s('path', { d: 'M38 74h66l-8 62H46z' }, 'white'),
    s('path', { d: 'M38 74h66l-8 62H46z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M42 88h58l-6 44H48z' }, 'tan', { accent: true }),
    s('path', { d: 'M104 90q22 0 18 18q-4 12-22 12', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 14h46l-8 28H88z', transform: 'rotate(-30 100 28)' }, 'blue'),
    s('path', { d: 'M78 40q-6 20-4 44', ...SW(5) }, 'sky', { stroke: true })
  ],
  'ají': [
    s('path', { d: 'M100 40q20 10 10 40q-14 44-76 60q-6-6 4-12q46-24 48-64q2-20 14-24z' }, 'red', { accent: true }),
    s('path', { d: 'M96 40q4-18 22-22', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M92 42q10-8 22 0l-4 8q-8-4-16 0z' }, 'green'),
    s('path', { d: 'M126 70q14-10 10-26M132 92q16-2 18-14', ...SW(4) }, 'orange', { stroke: true })
  ],
  alzada: [
    ground(),
    ...horse('brown', 'dark'),
    s('path', { d: 'M18 136V54', ...SW(4) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M18 64h64', ...DASH(3) }, 'dark', { stroke: true })
  ],
  'amortización': [
    ground(140),
    s('path', { d: rects([[22, 40, 22, 96], [52, 62, 22, 74], [82, 86, 22, 50], [112, 110, 22, 26]]) }, 'blue', { accent: true }),
    s('path', { d: 'M30 28q50 4 104 70', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M126 98l10 2-2-10z' }, 'orange'),
    s('circle', { cx: 132, cy: 36, r: 14 }, 'yellow'),
    s('circle', { cx: 132, cy: 36, r: 8 }, 'orange')
  ],
  amplificador: [
    s('rect', { x: 26, y: 40, width: 84, height: 96, rx: 8 }, 'dark'),
    s('circle', { cx: 68, cy: 96, r: 28 }, 'gray'),
    s('circle', { cx: 68, cy: 96, r: 10 }, 'black'),
    s('path', { d: dots([[42, 54], [58, 54], [74, 54], [90, 54]], 4) }, 'orange', { accent: true }),
    s('path', { d: 'M118 76q10 20 0 40M128 64q18 32 0 64M138 52q24 44 0 88', ...SW(4) }, 'blue', { stroke: true })
  ],
  arrasar: [
    ground(),
    s('rect', { x: 50, y: 70, width: 64, height: 40, rx: 4 }, 'yellow', { accent: true }),
    s('rect', { x: 78, y: 44, width: 30, height: 28, rx: 3 }, 'sky'),
    s('rect', { x: 46, y: 108, width: 74, height: 26, rx: 13 }, 'dark'),
    s('path', { d: dots([[60, 121], [83, 121], [106, 121]], 7) }, 'gray'),
    s('path', { d: 'M50 86H34l-10 50h20', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M126 136l6-8 6 4 4-6 4 10z' }, 'brown')
  ],
  avioneta: [
    s('path', { d: 'M30 82q0-12 20-14h66q18 4 18 14t-18 12H50q-20-2-20-12z' }, 'white'),
    s('path', { d: 'M30 82q0-12 20-14h66q18 4 18 14t-18 12H50q-20-2-20-12z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 82h54l-8 12H70z' }, 'red', { accent: true }),
    s('path', { d: 'M34 70l-10-26h14l18 26z' }, 'red'),
    s('path', { d: 'M100 72q4-10 14-8l6 8z' }, 'sky'),
    s('path', { d: 'M140 62v40', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 108h6l4-14M100 108h6l-4-14', ...SW(3) }, 'dark', { stroke: true })
  ],
  ballesta: [
    s('path', { d: 'M20 84h104', ...SW(12) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M112 30q30 54 0 108', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M112 30L72 84l40 54', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M72 84h68', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M150 84l-12-7v14z' }, 'red'),
    s('path', { d: 'M52 90l-4 16h8l2-16z' }, 'dark')
  ],
  benefactor: [
    ground(),
    ...person(52, 136, 'navy', { h: 50, w: 32, r: 14 }),
    ...person(118, 136, 'orange', { h: 34, w: 24, r: 11 }),
    s('path', { d: 'M66 104h22', ...SW(7) }, 'navy', { stroke: true }),
    s('rect', { x: 84, y: 82, width: 30, height: 26, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M99 82v26M84 94h30', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: heart(100, 50, 14) }, 'pink')
  ],
  binomio: [
    s('path', { d: 'M20 50h40q-6-18 12-18t12 18h-4v40q18-6 18 12t-18 12v26H20z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 50h60v90H80v-26q18 6 18-12t-18-12z' }, 'orange'),
  ],
  borroso: [
    s('rect', { x: 18, y: 24, width: 124, height: 112, rx: 6 }, 'brown'),
    s('rect', { x: 28, y: 34, width: 104, height: 92 }, 'sky'),
    s('path', { d: ells([[78, 76, 26, 22]]) + 'M74 96h8v28h-8z' }, 'mint'),
    s('path', { d: ells([[86, 72, 26, 22]]) + 'M82 92h8v32h-8z' }, 'green', { accent: true }),
    s('path', { d: ells([[112, 52, 10, 10], [116, 50, 10, 10]]) }, 'yellow'),
    s('path', { d: 'M30 118q26-8 50 0t50 0', ...SW(4) }, 'white', { stroke: true })
  ],
  casal: [
    ground(),
    s('path', { d: 'M14 136q30-18 60-6t72-8v14z' }, 'green'),
    s('rect', { x: 32, y: 66, width: 96, height: 62 }, 'cream', { accent: true }),
    s('path', { d: 'M24 70l56-40 56 40z' }, 'red'),
    s('path', { d: 'M70 128v-30h20v30z' }, 'brown'),
    s('path', { d: rects([[42, 82, 16, 16], [102, 82, 16, 16]]) }, 'sky'),
    s('path', { d: 'M104 48V30h10v24z' }, 'gray')
  ],
  certificar: [
    ...paper(26, 22, 96, 116),
    s('path', { d: 'M40 44h68M40 60h68M40 76h48', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 112l-8 32 12-8 6 12 6-32zM120 112l10 30 2-12 12 2-10-26z' }, 'blue'),
    s('path', { d: burst(116, 108, 22, 17, 12) }, 'red', { accent: true }),
    s('circle', { cx: 116, cy: 108, r: 10 }, 'yellow')
  ],
  'ciénaga': [
    s('path', { d: ells([[80, 116, 66, 26]]) }, 'brown', { accent: true }),
    s('path', { d: ells([[70, 112, 40, 12]]) }, 'dark'),
    s('path', { d: 'M28 112V50M40 114V64M124 110V44M136 114V60', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: ells([[28, 52, 4, 10], [124, 46, 4, 10]]) }, 'brown'),
    s('path', { d: dots([[60, 104], [84, 110], [96, 102]], 4) }, 'gray'),
    s('path', { d: ells([[110, 124, 16, 4]]) }, 'green')
  ],
  'clóset': [
    s('rect', { x: 34, y: 18, width: 92, height: 124, rx: 4 }, 'brown', { accent: true }),
    s('rect', { x: 42, y: 26, width: 76, height: 108 }, 'cream'),
    s('path', { d: 'M42 38h76', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 46l8-6 8 6v40H48zM84 46l8-6 8 6v52H84z' }, 'blue'),
    s('path', { d: 'M66 46l8-6 8 6v34H66zM102 46l8-6 8 6v44h-16z' }, 'red'),
    s('path', { d: 'M34 18l-14 8v108l14 8zM126 18l14 8v108l-14 8z' }, 'tan')
  ],
  'concientización': [
    s('path', { d: 'M30 92l50-26v52z' }, 'red', { accent: true }),
    s('rect', { x: 18, y: 80, width: 16, height: 24, rx: 3 }, 'dark'),
    s('path', { d: 'M86 70q12 22 0 44M96 60q18 32 0 64', ...SW(4) }, 'orange', { stroke: true }),
    s('circle', { cx: 124, cy: 52, r: 18 }, 'yellow'),
    s('rect', { x: 116, y: 68, width: 16, height: 12, rx: 2 }, 'gray'),
    s('path', { d: halfRays(124, 52, 24, 32, 5), ...SW(3) }, 'yellow', { stroke: true })
  ],
  'confiscación': [
    s('rect', { x: 40, y: 92, width: 80, height: 50, rx: 4 }, 'gray'),
    s('path', { d: 'M36 86h88v12H36z' }, 'dark'),
    s('rect', { x: 66, y: 46, width: 28, height: 46, rx: 5, transform: 'rotate(15 80 70)' }, 'dark'),
    s('rect', { x: 70, y: 52, width: 20, height: 32, rx: 2, transform: 'rotate(15 80 70)' }, 'sky'),
    s('path', { d: 'M100 30l30-14 10 18-26 16z' }, 'skin'),
    s('path', { d: 'M96 38q-8 14 6 18', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M126 18l14-6 8 16-12 8z' }, 'navy', { accent: true })
  ],
  cotizar: [
    s('rect', { x: 18, y: 22, width: 124, height: 96, rx: 6 }, 'dark'),
    s('path', { d: 'M30 100l24-20 18 10 26-30 30-20', ...SW(5) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M118 36l14-4-2 14z' }, 'green'),
    s('path', { d: 'M60 124h40l-6 20H66z' }, 'gray'),
    s('path', { d: 'M30 50h16M30 62h10', ...SW(3) }, 'gray', { stroke: true })
  ],
  cuantificar: [
    s('rect', { x: 16, y: 104, width: 128, height: 26, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M28 104v12M44 104v8M60 104v12M76 104v8M92 104v12M108 104v8M124 104v12', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: rects([[28, 76, 22, 22], [56, 76, 22, 22], [84, 76, 22, 22], [112, 76, 22, 22], [42, 50, 22, 22], [70, 50, 22, 22], [98, 50, 22, 22], [56, 24, 22, 22], [84, 24, 22, 22]]) }, 'blue'),
    s('path', { d: 'M28 70v-40M24 34l4-6 4 6', ...SW(3) }, 'red', { stroke: true })
  ],
  cuenco: [
    s('path', { d: 'M18 72h124q-4 58-62 62q-58-4-62-62z' }, 'brown', { accent: true }),
    s('ellipse', { cx: 80, cy: 72, rx: 62, ry: 12 }, 'tan'),
    s('path', { d: 'M30 92q50 14 100 0', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M62 134h36l4 8H58z' }, 'brown')
  ],
  curia: [
    ground(),
    s('path', { d: 'M40 70q0-40 40-40t40 40z' }, 'sky', { accent: true }),
    s('rect', { x: 76, y: 18, width: 8, height: 14 }, 'gray'),
    s('rect', { x: 24, y: 70, width: 112, height: 12 }, 'gray'),
    s('path', { d: 'M36 82v46M58 82v46M80 82v46M102 82v46M124 82v46', ...SW(8) }, 'cream', { stroke: true }),
    s('rect', { x: 20, y: 126, width: 120, height: 10 }, 'gray')
  ],
  deforme: [
    s('rect', { x: 26, y: 30, width: 70, height: 70, ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M54 60q30-20 50 4t30 30q-6 30-36 40t-54-10q-10-30 10-64z' }, 'purple', { accent: true }),
    s('path', { d: dots([[76, 88], [100, 84]], 4) }, 'dark'),
    s('path', { d: 'M78 110q14-8 26 4', ...SW(3) }, 'dark', { stroke: true })
  ],
  descuidar: [
    ground(142),
    s('path', { d: 'M48 104h64l-8 36H56z' }, 'orange', { accent: true }),
    s('rect', { x: 44, y: 96, width: 72, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M80 96V54q0-14-16-8q-8 4-10 16', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(54, 62, 100, 18, 6) + leaflet(80, 76, 160, 18, 5) }, 'tan'),
    s('path', { d: leaflet(24, 140, -10, 16, 5) + leaflet(120, 140, 190, 16, 5) + leaflet(132, 140, -20, 14, 4) }, 'brown'),
    s('path', { d: 'M58 116l10 8 6-6M90 112l8 10', ...SW(2) }, 'brown', { stroke: true })
  ],
  desidia: [
    ground(140),
    s('rect', { x: 18, y: 92, width: 124, height: 40, rx: 10 }, 'purple', { accent: true }),
    s('rect', { x: 18, y: 72, width: 22, height: 60, rx: 8 }, 'purple'),
    s('rect', { x: 48, y: 78, width: 72, height: 20, rx: 10 }, 'blue'),
    s('circle', { cx: 120, cy: 76, r: 12 }, 'skin'),
    s('path', { d: 'M112 74q4 3 8 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 20l20 20M24 40l20-20M24 30h20M34 20v20', ...SW(1.5) }, 'gray', { stroke: true }),
    s('path', { d: 'M130 60q4-12 12-10M132 46q2-10 10-10', ...SW(3) }, 'sky', { stroke: true })
  ],
  'desmán': [
    ground(),
    ...lean(52, 136, -12, 'red', { accent: true }),
    s('path', { d: 'M62 116l26 6', ...SW(8) }, 'red', { stroke: true }),
    s('path', { d: 'M98 112l30-12 14 34-30 6z' }, 'gray'),
    s('path', { d: 'M96 106l32-12', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M110 70l10-6 4 10zM132 60l8 4-6 8zM92 80l-8-4 4-8z' }, 'brown'),
    s('path', { d: burst(110, 40, 16, 8, 8) }, 'orange')
  ],
  detestable: [
    s('path', { d: ells([[80, 86, 30, 40]]) }, 'brown'),
    s('path', { d: 'M80 48v76M60 70l-24-10M60 90H32M60 110l-22 12M100 70l24-10M100 90h28M100 110l22 12M70 46l-12-20M90 46l12-20', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 64, ...SW(9) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M35 35l90 90', ...SW(9) }, 'red', { stroke: true })
  ],
  'digitalización': [
    ...paper(16, 46, 40, 52),
    s('path', { d: 'M24 60h24M24 70h24M24 80h16', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 72h20', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M92 72l-12-10v20z' }, 'orange', { accent: true }),
    s('rect', { x: 96, y: 44, width: 52, height: 40, rx: 4 }, 'dark'),
    s('rect', { x: 100, y: 48, width: 44, height: 32 }, 'sky'),
    s('path', { d: 'M90 88h64l-6 8h-52z' }, 'gray'),
    s('path', { d: dots([[110, 58], [120, 58], [130, 58], [110, 68], [120, 68], [130, 68]], 2.5) }, 'blue')
  ],
  encomendar: [
    s('path', { d: 'M14 104l30-16h22v14H44l-30 12z' }, 'skin'),
    s('path', { d: 'M146 66l-30 16H94V68h22l30-12z' }, 'skin'),
    s('rect', { x: 58, y: 72, width: 44, height: 28, rx: 4 }, 'cream'),
    s('rect', { x: 58, y: 72, width: 44, height: 28, rx: 4, ...SW(3) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 86, r: 8 }, 'red', { accent: true }),
    s('path', { d: 'M14 120l30-12M146 50l-30 12', ...SW(8) }, 'navy', { stroke: true })
  ],
  enfadar: [
    ...face(80, 88, 46, 'red', 'frown', { accent: true }),
    s('path', { d: 'M52 70l18 8M108 70l-18 8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 30q-6-10 4-16M120 30q6-10-4-16M80 26q-6-8 0-14', ...SW(5) }, 'gray', { stroke: true })
  ],
  ensanche: [
    backdrop('gray'),
    s('path', { d: [24, 64, 104].flatMap(x => [24, 64, 104].map(y => `M${x + 6} ${y}h20l6 6v20l-6 6h-20l-6-6v-20z`)).join('') }, 'orange', { accent: true }),
    s('path', { d: [24, 64, 104].flatMap(x => [24, 64, 104].map(y => `M${x + 10} ${y + 10}h12v12h-12z`)).join('') }, 'green'),
    s('path', { d: 'M14 146L146 14', ...SW(6) }, 'white', { stroke: true })
  ],
  entrevistador: [
    ground(),
    ...person(46, 136, 'navy', { accent: true }),
    ...person(118, 136, 'green'),
    s('path', { d: 'M60 104l28-20', ...SW(6) }, 'navy', { stroke: true }),
    s('path', { d: 'M88 84l8-8', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 98, cy: 74, r: 7 }, 'dark'),
    s('path', { d: bubble(16, 16, 40, 30) }, 'sky')
  ],
  'ermitaño': [
    s('path', { d: 'M14 146V80q0-60 66-60t66 60v66z' }, 'gray'),
    s('path', { d: 'M40 146V92q0-40 40-40t40 40v54z' }, 'dark'),
    s('path', { d: 'M62 146v-46q0-12 14-12t14 12v46z' }, 'brown', { accent: true }),
    s('circle', { cx: 76, cy: 74, r: 12 }, 'skin'),
    s('path', { d: 'M66 78q10 30 20 0z' }, 'white'),
    s('path', { d: 'M104 146V62', ...SW(5) }, 'tan', { stroke: true })
  ],
  esparcir: [
    s('path', { d: 'M14 120l40-20q10-4 14 4l-4 10-34 16z' }, 'skin'),
    s('path', { d: 'M48 100q10-10 22-6', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: dots([[84, 86], [96, 70], [110, 92], [120, 58], [124, 80], [138, 66], [104, 50], [134, 102], [92, 108], [116, 118], [140, 40]], 4) }, 'brown', { accent: true }),
    s('path', { d: 'M76 70q20-30 50-36', ...DASH(2, '4 6') }, 'gray', { stroke: true }),
    s('path', { d: 'M14 140h132', ...SW(5) }, 'green', { stroke: true })
  ],
  fastidiar: [
    ...face(64, 92, 40, 'yellow', 'frown', { accent: true }),
    s('path', { d: ells([[126, 40, 7, 5]]) }, 'dark'),
    s('path', { d: ells([[122, 34, 6, 4], [131, 34, 6, 4]]) }, 'sky'),
    s('path', { d: 'M118 44q-20 20 0 30t-10 22', ...DASH(2, '3 5') }, 'gray', { stroke: true }),
    s('path', { d: 'M40 60l14 4M88 60l-14 4', ...SW(4) }, 'dark', { stroke: true })
  ],
  funerario: [
    s('circle', { cx: 80, cy: 72, r: 46, ...SW(18) }, 'green', { stroke: true, accent: true }),
    s('path', { d: laurel(80, 72, 46, 16, 6) }, 'mint'),
    s('path', { d: dots(around(80, 72, 46, 7, 140), 7) }, 'white'),
    s('path', { d: dots(around(80, 72, 46, 7, 140), 3) }, 'yellow'),
    s('path', { d: 'M80 118l-16 26M80 118l16 26', ...SW(8) }, 'purple', { stroke: true }),
    s('circle', { cx: 80, cy: 118, r: 9 }, 'purple')
  ],
  garrote: [
    s('path', { d: 'M40 136L70 64q8-30 36-36t20 28q-8 24-30 30L52 140z' }, 'brown', { accent: true }),
    s('path', { d: 'M92 44l6 8M104 62l6 4M82 70l6 2', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M40 132l12 6', ...SW(10) }, 'dark', { stroke: true })
  ],
  germano: [
    s('path', { d: ells([[80, 44, 22, 20]]) + 'M58 46v34h8V50zM94 50v30h8V46z' }, 'yellow'),
    s('circle', { cx: 80, cy: 52, r: 18 }, 'skin'),
    s('path', { d: 'M38 146v-30q0-36 42-36t42 36v30z' }, 'brown', { accent: true }),
    s('path', { d: 'M48 98q32 20 64 0', ...SW(8) }, 'tan', { stroke: true }),
    s('circle', { cx: 120, cy: 118, r: 26 }, 'red'),
    s('circle', { cx: 120, cy: 118, r: 8 }, 'gray')
  ],
  golpiza: [
    s('path', { d: burst(98, 64, 46, 26, 12) }, 'yellow'),
    s('path', { d: burst(40, 38, 20, 10, 8) + burst(128, 126, 18, 9, 8) }, 'orange'),
    s('path', { d: 'M24 136l34-34', ...SW(18) }, 'skin', { stroke: true }),
    s('rect', { x: 50, y: 58, width: 46, height: 40, rx: 12 }, 'skin', { accent: true }),
    s('path', { d: 'M60 58v14M72 58v14M84 58v14', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M108 104l14 10M116 92l18 2M104 116l4 16', ...SW(4) }, 'red', { stroke: true })
  ],
  hernia: [
    s('rect', { x: 46, y: 14, width: 68, height: 132, rx: 30 }, 'mint'),
    s('path', { d: rects([[64, 20, 32, 16], [64, 44, 32, 16], [64, 92, 32, 16], [64, 116, 32, 16]]) }, 'cream'),
    s('path', { d: rects([[64, 68, 32, 16]]) }, 'cream'),
    s('path', { d: rects([[66, 36, 28, 8], [66, 84, 28, 8], [66, 108, 28, 8]]) }, 'sky'),
    s('path', { d: 'M66 60h28q16 4 0 8H66z' }, 'red', { accent: true }),
    s('path', { d: 'M118 48q10 6 12 16M122 72q8 4 10 0', ...SW(3) }, 'red', { stroke: true })
  ],
  'homónimo': [
    ground(),
    ...person(48, 136, 'blue', { accent: true }),
    ...person(112, 136, 'blue'),
    s('path', { d: star(48, 102, 8) + star(112, 102, 8) }, 'yellow'),
    s('path', { d: 'M66 50h28', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 50l6-5v10zM94 50l-6-5v10z' }, 'gray')
  ],
  inaudito: [
    s('path', { d: halfRays(80, 84, 56, 70, 7), ...SW(5) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 88, r: 46 }, 'yellow', { accent: true }),
    s('path', { d: dots([[64, 76], [96, 76]], 7) }, 'white'),
    s('path', { d: dots([[64, 76], [96, 76]], 3) }, 'dark'),
    s('ellipse', { cx: 80, cy: 110, rx: 10, ry: 14 }, 'dark'),
    s('path', { d: 'M28 96l-4 40h20zM132 96l4 40h-20z' }, 'skin')
  ],
  incoherente: [
    s('path', { d: bubble(18, 24, 124, 92) }, 'white'),
    s('path', { d: bubble(18, 24, 124, 92), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: star(46, 52, 12) }, 'yellow'),
    s('path', { d: 'M76 76l14-24 14 24z' }, 'green', { accent: true }),
    s('path', { d: spiral(114, 52), ...SW(3) }, 'purple', { stroke: true }),
    s('path', { d: 'M34 84q10-12 20 0t20 0', ...SW(4) }, 'blue', { stroke: true }),
    s('circle', { cx: 120, cy: 86, r: 9 }, 'red')
  ],
  inconfundible: [
    backdrop('sky'),
    s('path', { d: fishes([[44, 34], [104, 30], [132, 60], [40, 110], [110, 124], [72, 130]]) }, 'gray'),
    s('path', { d: ells([[88, 80, 28, 17]]) + 'M64 80l-24-18v36z' }, 'orange', { accent: true }),
    s('circle', { cx: 102, cy: 76, r: 4 }, 'dark')
  ],
  incumplir: [
    s('path', { d: 'M24 26h52l-8 20 10 18-12 22 8 20-6 30H24z' }, 'white'),
    s('path', { d: 'M24 26h52l-8 20 10 18-12 22 8 20-6 30H24z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M90 34h46v108H90l6-26-8-22 12-20-10-20z', transform: 'rotate(8 112 88)' }, 'cream'),
    s('path', { d: 'M90 34h46v108H90l6-26-8-22 12-20-10-20z', transform: 'rotate(8 112 88)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 48h24M34 64h20M34 80h24', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M32 122q10-10 20 0', ...SW(4) }, 'blue', { stroke: true }),
    s('circle', { cx: 120, cy: 120, r: 10 }, 'red', { accent: true })
  ],
  insurgencia: [
    ground(),
    s('path', { d: busts([36, 80, 124], 136, 30, 42) }, 'gray'),
    s('path', { d: dots([[36, 82], [80, 82], [124, 82]], 12) }, 'skin'),
    s('path', { d: 'M50 104l12-36M108 104l-8-36', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: dots([[62, 64], [100, 64]], 7) }, 'skin'),
    s('path', { d: 'M136 100V20', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M136 20l-34 8 34 10z' }, 'red', { accent: true })
  ],
  intangible: [
    s('path', { d: star(96, 66, 46, 20), ...DASH(4) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: sparkle(130, 30, 8) + sparkle(56, 110, 6) }, 'yellow'),
    s('path', { d: 'M14 128l38-22', ...SW(16) }, 'skin', { stroke: true }),
    s('path', { d: 'M48 108l30-18', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M14 140l30-18', ...SW(10) }, 'blue', { stroke: true })
  ],
  'intensificación': [
    ground(140),
    s('path', { d: drop(34, 120, 10) }, 'yellow'),
    s('path', { d: drop(74, 108, 18) }, 'orange'),
    s('path', { d: drop(122, 96, 26) }, 'red', { accent: true }),
    s('path', { d: drop(122, 108, 12) }, 'yellow'),
    s('path', { d: 'M22 52l100-30', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M134 18l-14-6 2 14z' }, 'gray')
  ],
  'internacionalización': [
    s('circle', { cx: 80, cy: 80, r: 44 }, 'blue', { accent: true }),
    s('path', { d: 'M52 56q14-8 22 4t-4 22q-12 6-18-8zM90 74q18-6 26 8t-4 26q-14 4-18-14zM78 40q10-4 18 2l-6 8z' }, 'green'),
    s('path', { d: 'M20 64q20-50 92-44M140 96q-20 50-92 44', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M112 12l12 8-12 8zM48 132l-12 8 12 8z' }, 'orange')
  ],
  metralla: [
    s('path', { d: burst(80, 80, 34, 16, 10) }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'yellow'),
    s('path', { d: 'M24 30l14 4-4 10zM126 22l10 12-12 2zM140 100l6 14-12-2zM30 120l14-6 0 12zM88 140l-10-8 12-4zM16 78l12-6 2 12z' }, 'gray'),
    s('path', { d: 'M44 46l10 10M114 40l-10 12M126 98l-14-6M46 112l10-8M84 128v-12M32 78h14', ...SW(3) }, 'dark', { stroke: true })
  ],
  misericordioso: [
    s('path', { d: 'M18 118q20-6 40 4h44q18-20 40-30q6 6-2 14l-26 28q-8 8-20 8H18z' }, 'skin'),
    s('path', { d: 'M62 110q-4-26 20-30q20 0 22 16l14-6-12 14q-6 10-20 10z' }, 'sky', { accent: true }),
    s('circle', { cx: 94, cy: 88, r: 2.5 }, 'dark'),
    s('path', { d: heart(80, 50, 18) }, 'pink'),
    s('path', { d: sparkle(122, 40, 7) + sparkle(36, 46, 6) }, 'yellow')
  ],
  mutual: [
    ground(),
    ...person(34, 136, 'blue', { h: 40, w: 26, r: 11 }),
    ...person(126, 136, 'red', { h: 40, w: 26, r: 11 }),
    s('path', { d: 'M54 60q26-26 52 0', ...SW(6) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M106 100q-26 26-52 0', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M112 66l-2-16-12 8zM48 94l2 16 12-8z' }, 'dark')
  ],
  natividad: [
    backdrop('navy'),
    s('path', { d: star(80, 34, 16) }, 'yellow', { accent: true }),
    s('path', { d: 'M44 136l10-44M116 136l-10-44', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M36 94h88l-10 24H46z' }, 'brown'),
    s('path', { d: 'M40 94l8-8 8 6 8-8 8 6 8-8 8 6 8-8 8 6 8-8 8 6 8-6v6z' }, 'yellow'),
    s('circle', { cx: 80, cy: 80, r: 10 }, 'skin'),
    s('path', { d: 'M66 92q14-14 28 0z' }, 'white')
  ],
  noria: [
    ground(),
    s('circle', { cx: 80, cy: 70, r: 52, ...SW(5) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: rays(80, 70, 0, 52, 8) + 'M80 70l-28 66M80 70l28 66', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: rects(around(80, 70, 52, 8).map(([x, y]) => [x - 7, y, 14, 12])) }, 'red'),
    s('circle', { cx: 80, cy: 70, r: 7 }, 'dark')
  ],
  nupcias: [
    backdrop('sky'),
    s('path', { d: 'M14 136h132v10H14z' }, 'green'),
    s('path', { d: 'M28 136V64q0-38 52-38t52 38v72', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: dots([[30, 70], [44, 40], [80, 28], [116, 40], [130, 70]], 7) }, 'pink'),
    ...lady(62, 136, 'white'),
    ...person(102, 136, 'dark', { h: 48, w: 26, r: 12, accent: true })
  ],
  obviar: [
    ground(),
    s('path', { d: 'M62 136q0-34 18-34t18 34z' }, 'gray', { accent: true }),
    s('path', { d: 'M18 126q20 0 32-30t30-34q18 2 30 34t32 30', ...DASH(5, '8 8') }, 'orange', { stroke: true }),
    s('path', { d: 'M144 126l-12-8v14z' }, 'orange'),
    s('circle', { cx: 22, cy: 112, r: 8 }, 'blue')
  ],
  opacidad: [
    s('rect', { x: 16, y: 30, width: 128, height: 100, rx: 4 }, 'cream'),
    s('path', { d: dots([[48, 80], [112, 80]], 20) }, 'red'),
    s('rect', { x: 20, y: 40, width: 56, height: 80, rx: 4 }, 'sky'),
    s('rect', { x: 84, y: 40, width: 56, height: 80, rx: 4 }, 'gray', { accent: true }),
    s('circle', { cx: 48, cy: 80, r: 20 }, 'red'),
    s('path', { d: 'M28 50l12-8M28 62l18-14', ...SW(3) }, 'white', { stroke: true })
  ],
  palmar: [
    s('path', { d: 'M48 146v-30q-16-14-22-40q-2-8 6-8q6 0 10 10l6 14V34q0-8 8-8t8 8v38V26q0-8 8-8t8 8v46V32q0-8 8-8t8 8v42V46q0-8 8-8t8 8v52q0 22-20 36v12z' }, 'skin', { accent: true }),
    s('path', { d: 'M62 96q16-6 30 4M58 108q20-4 40 0M76 120q4-18 16-26', ...SW(2.5) }, 'brown', { stroke: true })
  ],
  papaya: [
    s('path', { d: 'M80 20q40 0 44 60q2 60-44 62q-46-2-44-62q4-60 44-60z' }, 'green'),
    s('path', { d: 'M80 28q32 2 36 54q0 50-36 52q-36-2-36-52q4-52 36-54z' }, 'orange', { accent: true }),
    s('path', { d: ells([[80, 86, 14, 34]]) }, 'yellow'),
    s('path', { d: dots([[76, 64], [84, 72], [76, 82], [84, 92], [76, 102], [84, 110], [80, 56]], 4) }, 'black')
  ],
  'pavimentación': [
    s('path', { d: 'M14 136h132v10H14z' }, 'dark', { accent: true }),
    s('path', { d: 'M100 136h46v-6h-46z' }, 'gray'),
    s('rect', { x: 54, y: 70, width: 68, height: 36, rx: 4 }, 'yellow'),
    s('rect', { x: 84, y: 40, width: 30, height: 30, rx: 3 }, 'sky'),
    s('circle', { cx: 40, cy: 112, r: 22 }, 'gray'),
    s('circle', { cx: 112, cy: 118, r: 16 }, 'dark'),
    s('path', { d: 'M40 112l20-20', ...SW(6) }, 'orange', { stroke: true })
  ],
  pediatra: [
    ...person(56, 140, 'white', { h: 56, w: 36, r: 14 }),
    s('rect', { x: 38, y: 84, width: 36, height: 56, rx: 12, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 86q0 24 10 24t10-24', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 58, cy: 112, r: 4 }, 'gray'),
    s('circle', { cx: 116, cy: 82, r: 13 }, 'skin'),
    s('path', { d: 'M96 140v-26q0-18 20-18t20 18v26z' }, 'pink', { accent: true }),
    s('path', { d: 'M110 70q6-6 12 0', ...SW(3) }, 'brown', { stroke: true })
  ],
  pepito: [
    s('path', { d: 'M18 90q0-28 62-30t62 30z' }, 'tan', { accent: true }),
    s('path', { d: 'M20 92h120l-6 10H26z' }, 'brown'),
    s('path', { d: 'M20 102q10 6 20 0t20 0 20 0 20 0 20 0 20 0', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M18 106h124q0 22-62 22t-62-22z' }, 'tan'),
    s('path', { d: 'M48 72l6-4M76 68l6-4M104 72l6-4', ...SW(3) }, 'cream', { stroke: true })
  ],
  prefijo: [
    s('path', { d: rects([[66, 70, 24, 24], [94, 70, 24, 24], [122, 70, 24, 24]]) }, 'blue'),
    s('rect', { x: 18, y: 66, width: 32, height: 32, rx: 4 }, 'orange', { accent: true }),
    s('path', { d: 'M34 108q0 24 24 2', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 106l-4 10-6-6z' }, 'gray'),
    s('path', { d: 'M18 52h32', ...SW(4) }, 'orange', { stroke: true })
  ],
  'prófugo': [
    ground(),
    s('path', { d: 'M14 46h40v90H14z' }, 'gray'),
    s('path', { d: 'M24 46v90M34 46v90M44 46v90', ...SW(4) }, 'dark', { stroke: true }),
    ...lean(102, 136, 18, 'orange', { accent: true }),
    s('path', { d: 'M88 102h28M88 114h28M88 126h28', ...SW(4), transform: 'rotate(18 102 136)' }, 'dark', { stroke: true }),
    s('path', { d: 'M74 110h-14M70 96H58M76 82H64', ...SW(3) }, 'gray', { stroke: true })
  ],
  putear: [
    ...face(44, 100, 28, 'red', 'frown', { accent: true }),
    s('path', { d: 'M30 90l10 4M58 90l-10 4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: bubble(66, 18, 80, 56) }, 'dark'),
    s('path', { d: star(84, 44, 10) + 'M112 32l-6 12h8l-6 12' }, 'yellow'),
    s('path', { d: spiral(124, 44), ...SW(3) }, 'white', { stroke: true })
  ],
  'péndulo': [
    s('rect', { x: 30, y: 16, width: 100, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M38 112q42 30 84 0', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 26l26 84', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 108, cy: 116, r: 16 }, 'yellow', { accent: true }),
    s('path', { d: 'M80 26l-26 84', ...DASH(2, '3 5') }, 'gray', { stroke: true }),
    s('circle', { cx: 52, cy: 116, r: 16, ...DASH(2, '3 5') }, 'gray', { stroke: true })
  ],
  quid: [
    s('circle', { cx: 74, cy: 86, r: 56 }, 'red'),
    s('circle', { cx: 74, cy: 86, r: 40 }, 'white'),
    s('circle', { cx: 74, cy: 86, r: 24 }, 'red'),
    s('circle', { cx: 74, cy: 86, r: 9 }, 'yellow', { accent: true }),
    s('path', { d: 'M76 84l60-60', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M130 14l16 2-2 16-10-8z' }, 'blue')
  ],
  recitar: [
    ground(),
    ...person(60, 136, 'purple', { h: 48, w: 30, r: 13, accent: true }),
    s('path', { d: 'M66 102l26-8', ...SW(6) }, 'purple', { stroke: true }),
    s('path', { d: 'M86 78l20-4v30l-20 4zM106 74l20 4v30l-20-4z' }, 'cream'),
    s('path', { d: 'M86 78l20-4 20 4v30l-20-4-20 4z', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M82 52q8 6 0 14M92 42q14 14 0 30', ...SW(4) }, 'orange', { stroke: true })
  ],
  reconocible: [
    s('path', { d: HEAD, transform: 'translate(-6 0)' }, 'gray'),
    s('circle', { cx: 92, cy: 70, r: 32 }, 'sky'),
    s('circle', { cx: 92, cy: 70, r: 32, ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M114 94l26 26', ...SW(12) }, 'dark', { stroke: true }),
    s('path', { d: 'M78 70l10 10 18-20', ...SW(6) }, 'green', { stroke: true, accent: true })
  ],
  reconsiderar: [
    ...person(80, 140, 'blue', { h: 46, w: 32, r: 14 }),
    s('path', { d: 'M52 40a28 28 0 1 1 8 20', ...SW(6) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M46 58l16 8 2-16z' }, 'orange'),
    s('path', { d: 'M74 80q6-4 12 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  redundancia: [
    s('path', { d: 'M18 140h124', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 50h56l-6 84H58z' }, 'sky', { accent: true }),
    s('path', { d: 'M52 50h56l-6 84H58z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 50q-12 30-6 86M108 50q12 30 6 86', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M92 14v30', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: ells([[32, 138, 16, 4], [128, 138, 16, 4]]) }, 'blue')
  ],
  reinar: [
    s('path', { d: 'M38 140V44q0-14 14-14h56q14 0 14 14v96z' }, 'red'),
    s('rect', { x: 34, y: 96, width: 92, height: 14, rx: 4 }, 'brown'),
    ...person(80, 124, 'purple', { h: 40, w: 32, r: 13 }),
    s('path', { d: 'M66 58l-2-16 9 8 7-12 7 12 9-8-2 16z' }, 'yellow', { accent: true }),
    s('path', { d: 'M72 124v16M88 124v16', ...SW(7) }, 'purple', { stroke: true })
  ],
  repositorio: [
    s('path', { d: 'M34 34v92q0 14 46 14t46-14V34z' }, 'blue', { accent: true }),
    s('ellipse', { cx: 80, cy: 34, rx: 46, ry: 14 }, 'sky'),
    s('path', { d: 'M34 66q0 14 46 14t46-14M34 96q0 14 46 14t46-14', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: dots([[110, 92], [110, 122]], 4) }, 'green')
  ],
  represivo: [
    s('rect', { x: 30, y: 18, width: 100, height: 42, rx: 4 }, 'dark', { accent: true }),
    s('path', { d: 'M60 40l20 20 20-20', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 140h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 140v-52q0-14 34-14t34 14v52z' }, 'orange'),
    s('path', { d: dots([[70, 98], [90, 98]], 4) }, 'dark'),
    s('path', { d: 'M70 118q10-6 20 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 66v40M136 66v40', ...SW(4) }, 'red', { stroke: true })
  ],
  reproche: [
    ground(),
    ...person(46, 136, 'red', { h: 50, w: 30, r: 13, accent: true }),
    s('path', { d: 'M60 96l34-10', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M94 86l12-4', ...SW(4) }, 'skin', { stroke: true }),
    ...person(122, 136, 'gray', { h: 36, w: 26, r: 11 }),
    s('path', { d: 'M116 82q6-4 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M20 40l8 8M34 30l2 10', ...SW(3) }, 'red', { stroke: true })
  ],
  riesgoso: [
    s('path', { d: 'M14 146V88h28v58zM118 146V88h28v58z' }, 'brown'),
    s('path', { d: 'M42 92h76', ...SW(2) }, 'dark', { stroke: true }),
    ...person(80, 92, 'red', { h: 34, w: 20, r: 10, accent: true }),
    s('path', { d: 'M48 56h64', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M42 146q38-30 76 0z' }, 'navy')
  ],
  'sangría': [
    s('path', { d: 'M40 40h64l-6 96H46z' }, 'red', { accent: true }),
    s('path', { d: 'M40 40h64l-6 96H46zM104 56q22 4 18 30t-22 30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: ells([[60, 70, 10, 10], [86, 92, 10, 10]]) }, 'orange'),
    s('path', { d: ells([[70, 112, 9, 9]]) }, 'yellow'),
    s('path', { d: 'M88 24l-8 50', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M38 40l-8-10', ...SW(4) }, 'gray', { stroke: true })
  ],
  seiscientos: [
    s('path', { d: rects([[18, 30, 36, 36], [62, 30, 36, 36], [106, 30, 36, 36], [18, 82, 36, 36], [62, 82, 36, 36], [106, 82, 36, 36]]) }, 'blue', { accent: true }),
    s('path', { d: [18, 62, 106].flatMap(x => [30, 82].map(y => `M${x} ${y + 12}h36M${x} ${y + 24}h36M${x + 12} ${y}v36M${x + 24} ${y}v36`)).join(''), ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M18 134h124', ...SW(4) }, 'orange', { stroke: true })
  ],
  senderismo: [
    s('path', { d: 'M14 120l40-64 30 40 18-24 44 48z' }, 'green'),
    s('path', { d: 'M14 146q60-30 132-20v20z' }, 'tan'),
    s('rect', { x: 76, y: 92, width: 18, height: 24, rx: 5 }, 'orange'),
    ...person(98, 140, 'red', { h: 34, w: 20, r: 10, accent: true }),
    s('path', { d: 'M114 140l4-40', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M108 124l8-8', ...SW(5) }, 'red', { stroke: true })
  ],
  sensacionalista: [
    s('rect', { x: 22, y: 20, width: 116, height: 124, rx: 3 }, 'cream'),
    s('rect', { x: 22, y: 20, width: 116, height: 124, rx: 3, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: burst(80, 64, 40, 24, 12) }, 'red', { accent: true }),
    s('path', { d: 'M84 40l-14 26h14l-10 24', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M34 116h92M34 130h70', ...SW(5) }, 'gray', { stroke: true })
  ],
  'sinfín': [
    s('path', { d: 'M80 80q-20-34-44-24t0 48q24 10 44-24t44-24t0 48q-24 10-44-24', ...SW(12) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: sparkle(30, 30, 8) + sparkle(130, 128, 8) + sparkle(130, 34, 6) + sparkle(30, 128, 6) }, 'yellow')
  ],
  sobremanera: [
    s('path', { d: 'M20 112a60 60 0 0 1 120 0z' }, 'gray'),
    s('path', { d: wedge(80, 112, 60, 300, 360) }, 'red', { accent: true }),
    s('path', { d: wedge(80, 112, 60, 240, 300) }, 'yellow'),
    s('path', { d: wedge(80, 112, 60, 180, 240) }, 'green'),
    s('path', { d: 'M80 112l62 10', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 112, r: 9 }, 'dark'),
    s('path', { d: 'M136 132l10 8M146 118l8 2', ...SW(3) }, 'orange', { stroke: true })
  ],
  solemnemente: [
    s('rect', { x: 34, y: 96, width: 52, height: 12, rx: 2 }, 'brown'),
    s('rect', { x: 38, y: 108, width: 44, height: 32 }, 'brown'),
    ...person(100, 140, 'navy', { h: 50, w: 32, r: 14, accent: true }),
    s('path', { d: 'M116 100l14-34', ...SW(6) }, 'navy', { stroke: true }),
    s('path', { d: 'M128 52v18h8V52z' }, 'skin'),
    s('path', { d: 'M86 106l-6 0', ...SW(6) }, 'navy', { stroke: true }),
    s('rect', { x: 42, y: 88, width: 36, height: 8, rx: 2 }, 'red')
  ],
  somo: [
    backdrop('sky'),
    s('path', { d: 'M14 146l66-100 66 100z' }, 'gray'),
    s('path', { d: 'M62 74l18-28 18 28-10-6-8 8-8-8z' }, 'white'),
    s('path', { d: 'M80 46V18', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 18l22 6-22 8z' }, 'red', { accent: true })
  ],
  sutileza: [
    s('path', { d: 'M40 136q30-40 90-110q-6 50-50 90z' }, 'sky', { accent: true }),
    s('path', { d: 'M30 146l100-120', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M70 104l-8-14M86 86l-8-16M102 66l-4-16', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: sparkle(46, 46, 10) + sparkle(130, 104, 7) }, 'yellow')
  ],
  tardanza: [
    s('circle', { cx: 100, cy: 56, r: 40 }, 'white'),
    s('circle', { cx: 100, cy: 56, r: 40, ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 56V30M100 56l18 10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 136h132', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M22 136q4-10 18-10h30v10z' }, 'tan'),
    s('circle', { cx: 50, cy: 114, r: 16 }, 'orange', { accent: true }),
    s('path', { d: 'M70 126l8-18M76 106h4', ...SW(4) }, 'tan', { stroke: true })
  ],
  temeroso: [
    s('path', { d: 'M40 146v-36q0-26 40-26t40 26v36z' }, 'green'),
    s('circle', { cx: 80, cy: 60, r: 30 }, 'sky', { accent: true }),
    s('path', { d: dots([[68, 56], [92, 56]], 5) }, 'dark'),
    s('path', { d: 'M68 76l6-4 6 4 6-4 6 4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M38 46l-10-4M36 62h-12M122 46l10-4M124 62h12', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: drop(110, 40, 5) }, 'blue')
  ],
  'tentáculo': [
    s('path', { d: 'M24 146q0-60 40-90t70-10q14 14-6 30q-24-14-44 6t-28 64z' }, 'purple', { accent: true }),
    s('path', { d: dots([[48, 128], [52, 110], [60, 94], [72, 80], [88, 72], [106, 70]], 5) }, 'pink'),
    s('path', { d: dots([[48, 128], [52, 110], [60, 94], [72, 80], [88, 72], [106, 70]], 2) }, 'purple')
  ],
  tiza: [
    s('rect', { x: 14, y: 20, width: 132, height: 96, rx: 4 }, 'green'),
    s('rect', { x: 14, y: 20, width: 132, height: 96, rx: 4, ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M30 72q16-24 32 0t32 0', ...SW(4) }, 'white', { stroke: true }),
    s('rect', { x: 92, y: 60, width: 44, height: 12, rx: 3, transform: 'rotate(-30 114 66)' }, 'white', { accent: true }),
    s('path', { d: 'M14 124h132', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 40, y: 128, width: 24, height: 8, rx: 2 }, 'cream')
  ],
  topar: [
    ground(),
    ...lean(48, 136, 14, 'blue', { accent: true }),
    ...lean(112, 136, -14, 'orange'),
    s('path', { d: burst(80, 66, 22, 10, 8) }, 'yellow'),
    s('path', { d: 'M64 30l4 10M96 30l-4 10M80 22v12', ...SW(3) }, 'red', { stroke: true })
  ],
  torbellino: [
    s('path', { d: 'M24 30h112M36 52h88M50 74h60M62 96h36M72 116h16', ...SW(10) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: 'M24 30q60 20 112 0M50 74q30 12 60 0', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M80 116q-6 14 0 28', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: leaflet(128, 70, -20, 16, 5) + leaflet(30, 96, 200, 14, 5) }, 'green'),
    s('path', { d: 'M136 100l10 4-6 8z' }, 'brown')
  ],
  'tributación': [
    ...paper(20, 22, 64, 84),
    s('path', { d: 'M30 40h44M30 54h44M30 68h30', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[110, 130, 26, 9], [110, 118, 26, 9], [110, 106, 26, 9]]) }, 'orange'),
    s('ellipse', { cx: 110, cy: 94, rx: 26, ry: 9 }, 'yellow', { accent: true }),
    s('path', { d: 'M46 120h40', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M92 120l-10-7v14z' }, 'green'),
  ],
  tulio: [
    s('rect', { x: 26, y: 26, width: 108, height: 108, rx: 10 }, 'mint'),
    s('rect', { x: 26, y: 26, width: 108, height: 108, rx: 10, ...SW(4) }, 'green', { stroke: true }),
    s('ellipse', { cx: 80, cy: 80, rx: 40, ry: 14, ...SW(3) }, 'navy', { stroke: true }),
    s('ellipse', { cx: 80, cy: 80, rx: 40, ry: 14, transform: 'rotate(60 80 80)', ...SW(3) }, 'navy', { stroke: true }),
    s('ellipse', { cx: 80, cy: 80, rx: 40, ry: 14, transform: 'rotate(120 80 80)', ...SW(3) }, 'navy', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 9 }, 'purple', { accent: true })
  ],
  vallenato: [
    s('rect', { x: 18, y: 64, width: 18, height: 52, rx: 4 }, 'red', { accent: true }),
    s('rect', { x: 72, y: 64, width: 18, height: 52, rx: 4 }, 'red'),
    s('path', { d: 'M36 68l6 46 6-46 6 46 6-46 6 46 6-46v46H36z' }, 'dark'),
    s('path', { d: 'M100 92h44l-4 46h-36z' }, 'yellow'),
    s('ellipse', { cx: 122, cy: 92, rx: 22, ry: 7 }, 'tan'),
    ...note(56, 40, 'purple')
  ],
  venenoso: [
    s('path', { d: 'M24 128q20-30 50-10t50-20q16-10 10-34', ...SW(14) }, 'green', { stroke: true, accent: true }),
    s('path', { d: ells([[132, 52, 18, 12]]) }, 'green'),
    s('circle', { cx: 136, cy: 46, r: 3 }, 'dark'),
    s('path', { d: 'M130 62l-2 10M138 62l-2 10', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: drop(127, 86, 5) + drop(135, 98, 4) }, 'purple'),
    s('path', { d: dots([[46, 118], [90, 116], [112, 100]], 4) }, 'yellow')
  ],
  'ñoquis': [
    s('ellipse', { cx: 80, cy: 96, rx: 66, ry: 32 }, 'white'),
    s('ellipse', { cx: 80, cy: 96, rx: 66, ry: 32, ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 80, cy: 92, rx: 46, ry: 18 }, 'red'),
    s('path', { d: ells([[56, 86, 10, 7], [78, 82, 10, 7], [100, 86, 10, 7], [66, 98, 10, 7], [90, 98, 10, 7]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M52 86h8M74 82h8M96 86h8M62 98h8M86 98h8', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: leaflet(104, 72, -30, 14, 5) }, 'green')
  ],
  'acrónimo': [
    s('path', { d: rects([[40, 22, 64, 18], [40, 52, 88, 18], [40, 82, 52, 18]]) }, 'gray'),
    s('path', { d: rects([[18, 22, 18, 18], [18, 52, 18, 18], [18, 82, 18, 18]]) }, 'orange', { accent: true }),
    s('path', { d: 'M27 104v12', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M21 114l6 8 6-8z' }, 'dark'),
    s('path', { d: rects([[18, 126, 18, 18], [38, 126, 18, 18], [58, 126, 18, 18]]) }, 'orange')
  ],
  adaptador: [
    s('rect', { x: 46, y: 48, width: 68, height: 64, rx: 10 }, 'white'),
    s('rect', { x: 46, y: 48, width: 68, height: 64, rx: 10, ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[68, 80], [92, 80]], 5) }, 'dark'),
    s('path', { d: 'M66 112v22M94 112v22', ...SW(7) }, 'gray', { stroke: true }),
    s('rect', { x: 62, y: 18, width: 36, height: 30, rx: 5 }, 'blue', { accent: true }),
    s('path', { d: 'M80 18V8', ...SW(5) }, 'dark', { stroke: true })
  ],
  afilado: [
    s('path', { d: 'M18 112l90-52q30-12 36-6q-6 16-40 30l-78 34z' }, 'gray', { accent: true }),
    s('path', { d: 'M20 120l84-36', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M24 108l-10 6 6 12 10-4z' }, 'dark'),
    s('path', { d: sparkle(116, 76, 12) + sparkle(62, 104, 8) }, 'yellow'),
    s('path', { d: 'M14 140h50', ...SW(10) }, 'brown', { stroke: true })
  ],
  agravio: [
    ground(),
    ...person(44, 136, 'red', { h: 48, w: 30, r: 13 }),
    ...person(118, 136, 'sky', { h: 38, w: 26, r: 12, accent: true }),
    s('path', { d: 'M66 54l20 12-10 4 22 14', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M112 80q6-4 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: drop(126, 76, 3) }, 'blue'),
    s('path', { d: 'M100 40q18-18 36 0', ...SW(10) }, 'dark', { stroke: true })
  ],
  'agrónomo': [
    s('path', { d: 'M14 120h132v26H14z' }, 'brown'),
    s('path', { d: 'M30 120v-10M54 120v-10M78 120v-10M102 120v-10M126 120v-10', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: dots([[30, 106], [54, 106], [78, 106], [102, 106], [126, 106]], 5) }, 'green'),
    ...person(64, 92, 'navy', { h: 40, w: 28, r: 12 }),
    s('path', { d: 'M44 30h40l-6-10H50z' }, 'tan', { accent: true }),
    s('rect', { x: 84, y: 50, width: 24, height: 30, rx: 3 }, 'cream'),
    s('path', { d: 'M78 66h8', ...SW(5) }, 'navy', { stroke: true })
  ],
  ahondar: [
    s('path', { d: 'M14 70h132v76H14z' }, 'brown'),
    s('path', { d: 'M56 70h48l-6 76H62z' }, 'dark'),
    s('path', { d: 'M80 82v44', ...SW(6) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M70 120l10 16 10-16z' }, 'orange'),
    s('path', { d: 'M110 20l-20 44', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: 'M84 58l14 6-6 14-14-6z' }, 'gray'),
    s('path', { d: 'M18 70q10-14 30-8M112 70q14-14 32-2', ...SW(6) }, 'brown', { stroke: true })
  ],
  'alienación': [
    ground(),
    s('path', { d: busts([28, 54, 80], 136, 24, 40) }, 'blue'),
    s('path', { d: dots([[28, 84], [54, 84], [80, 84]], 11) }, 'skin'),
    s('path', { d: busts([128], 136, 24, 40) }, 'gray', { accent: true }),
    s('circle', { cx: 128, cy: 84, r: 11 }, 'gray'),
    s('path', { d: 'M104 60v76', ...DASH(3) }, 'gray', { stroke: true })
  ],
  altercado: [
    ground(),
    ...person(34, 136, 'red', { h: 44, w: 28, r: 12, accent: true }),
    ...person(126, 136, 'blue', { h: 44, w: 28, r: 12 }),
    s('path', { d: burst(62, 42, 20, 12, 8) }, 'orange'),
    s('path', { d: burst(98, 42, 20, 12, 8) }, 'yellow'),
    s('path', { d: 'M74 76l6 10 6-10', ...SW(4) }, 'dark', { stroke: true })
  ],
  amparar: [
    s('path', { d: 'M24 70q56-60 112 0q-14-8-28 0q-14-8-28 0q-14-8-28 0q-14-8-28 0z' }, 'red', { accent: true }),
    s('path', { d: 'M80 34v80', ...SW(4) }, 'dark', { stroke: true }),
    ...person(80, 136, 'yellow', { h: 34, w: 24, r: 11 }),
    s('path', { d: 'M24 20l-6 14M50 14l-6 14M110 14l-6 14M136 20l-6 14M20 90l-6 14M142 90l-6 14', ...SW(3) }, 'blue', { stroke: true })
  ],
  'antártico': [
    s('path', { d: 'M14 128l20-12h94l18 12v18H14z' }, 'white'),
    s('path', { d: 'M14 128l20-12h94l18 12', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: ells([[80, 82, 26, 38]]) }, 'black', { accent: true }),
    s('path', { d: ells([[80, 90, 17, 28]]) }, 'white'),
    s('path', { d: dots([[72, 62], [88, 62]], 3) }, 'white'),
    s('path', { d: 'M74 70h12l-6 8z' }, 'orange'),
    s('path', { d: 'M66 120h12M82 120h12', ...SW(5) }, 'orange', { stroke: true })
  ],
  'apuñalar': [
    s('path', { d: 'M64 70l64 50', ...SW(10) }, 'gray', { stroke: true }),
    s('path', { d: 'M128 120l12 14-18-6z' }, 'gray'),
    s('path', { d: 'M48 80l28-30', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M30 38l30 30', ...SW(12) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M100 70l12-12M116 84l14-6M84 64l4-16', ...SW(3) }, 'orange', { stroke: true })
  ],
  armisticio: [
    backdrop('sky'),
    s('path', { d: 'M40 136V20', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M42 22q24-8 44 2t44 0v40q-24 10-44 0t-44 2z' }, 'white', { accent: true }),
    s('path', { d: 'M30 134l100-12M34 118l96 14', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M126 116v12M126 128v12', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 140h132v6H14z' }, 'green')
  ],
  atalaya: [
    s('path', { d: 'M14 120q30-8 60 0t72 0v26H14z' }, 'blue'),
    s('path', { d: 'M40 124V56h44v68z' }, 'tan', { accent: true }),
    s('path', { d: 'M34 56h56V44h-8v6h-8v-6h-8v6h-8v-6h-8v6h-8v-6h-8z' }, 'tan'),
    s('rect', { x: 56, y: 72, width: 12, height: 18, rx: 6 }, 'dark'),
    s('path', { d: 'M90 40l40-14v28z' }, 'yellow'),
    s('path', { d: 'M26 124l10-16h52l10 16z' }, 'gray')
  ],
  atrio: [
    s('rect', { x: 14, y: 20, width: 132, height: 120, rx: 4 }, 'cream'),
    s('rect', { x: 48, y: 50, width: 64, height: 60 }, 'sky', { accent: true }),
    s('rect', { x: 56, y: 74, width: 48, height: 26, rx: 2 }, 'blue'),
    s('path', { d: dots([[48, 50], [112, 50], [48, 110], [112, 110]], 7) }, 'gray'),
    s('path', { d: 'M14 20h132l-34 30H48z' }, 'red'),
    s('path', { d: 'M14 140l34-30h64l34 30z' }, 'tan')
  ],
  azucarera: [
    s('path', { d: 'M36 70h88l-6 64H42z' }, 'blue', { accent: true }),
    s('path', { d: 'M36 86q-18 0-18 16t22 12M124 86q18 0 18 16t-22 12', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M30 62q50-30 100 0z' }, 'sky'),
    s('circle', { cx: 80, cy: 40, r: 7 }, 'navy'),
    s('path', { d: rects([[52, 18, 14, 14], [96, 24, 14, 14]]) }, 'white'),
    s('path', { d: rects([[52, 18, 14, 14], [96, 24, 14, 14]]), ...SW(2) }, 'gray', { stroke: true })
  ],
  barniz: [
    s('rect', { x: 14, y: 96, width: 132, height: 36, rx: 3 }, 'brown'),
    s('rect', { x: 14, y: 96, width: 76, height: 36, rx: 3 }, 'orange', { accent: true }),
    s('path', { d: 'M24 104h50M30 120h40', ...SW(3) }, 'yellow', { stroke: true }),
    s('rect', { x: 84, y: 66, width: 30, height: 20, rx: 2, transform: 'rotate(-30 99 76)' }, 'gray'),
    s('path', { d: 'M108 62l26-30', ...SW(8) }, 'red', { stroke: true }),
    s('path', { d: 'M80 82l10 14', ...SW(8) }, 'tan', { stroke: true }),
    s('path', { d: sparkle(40, 68, 8) }, 'yellow')
  ],
  bombonera: [
    s('path', { d: 'M16 70l20-40h88l20 40z' }, 'pink'),
    s('rect', { x: 16, y: 70, width: 128, height: 64, rx: 6 }, 'red', { accent: true }),
    s('rect', { x: 24, y: 76, width: 112, height: 52, rx: 4 }, 'cream'),
    s('path', { d: dots([[40, 90], [64, 90], [88, 90], [112, 90], [40, 114], [64, 114], [88, 114], [112, 114]], 9) }, 'brown'),
    s('path', { d: dots([[40, 88], [88, 88], [64, 112], [112, 112]], 3) }, 'tan')
  ],
  brazalete: [
    s('ellipse', { cx: 80, cy: 84, rx: 56, ry: 36, ...SW(16) }, 'yellow', { stroke: true, accent: true }),
    s('ellipse', { cx: 80, cy: 84, rx: 56, ry: 36, ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: dots([[80, 120], [48, 114], [112, 114]], 7) }, 'red'),
    s('path', { d: dots([[30, 98], [130, 98]], 6) }, 'blue'),
    s('path', { d: sparkle(124, 46, 8) }, 'yellow')
  ],
  'bursátil': [
    s('path', { d: 'M18 140h124M18 140V20', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 72v52M64 52v52M92 66v42M120 30v52', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: rects([[28, 84, 16, 30], [84, 76, 16, 22]]) }, 'red'),
    s('path', { d: rects([[56, 60, 16, 32], [112, 38, 16, 36]]) }, 'green', { accent: true })
  ],
  butaca: [
    s('rect', { x: 40, y: 22, width: 80, height: 76, rx: 18 }, 'red', { accent: true }),
    s('rect', { x: 44, y: 94, width: 72, height: 26, rx: 8 }, 'red'),
    s('rect', { x: 26, y: 70, width: 20, height: 52, rx: 6 }, 'dark'),
    s('rect', { x: 114, y: 70, width: 20, height: 52, rx: 6 }, 'dark'),
    s('path', { d: 'M40 120l-4 22M120 120l4 22', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 36v48M80 36v48M104 36v48', ...SW(2) }, 'pink', { stroke: true })
  ],
  califa: [
    s('path', { d: 'M30 136V70h100v66z' }, 'tan'),
    s('path', { d: 'M50 70q0-40 30-50q30 10 30 50z' }, 'sky'),
    s('path', { d: 'M46 140v-30q0-26 34-26t34 26v30z' }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 68, r: 14 }, 'skin'),
    s('path', { d: ells([[80, 52, 20, 11]]) }, 'white'),
    s('path', { d: ells([[80, 52, 20, 11]]), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 78q6 10 12 0z' }, 'dark')
  ],
  'catastrófico': [
    ground(),
    s('path', { d: 'M30 136V70l40-28 40 28v66z', transform: 'rotate(-14 70 136)' }, 'tan'),
    s('path', { d: 'M66 54l8 22-10 14 12 18-6 28', ...SW(4), transform: 'rotate(-14 70 136)' }, 'dark', { stroke: true }),
    s('path', { d: burst(118, 48, 24, 12, 9) }, 'red', { accent: true }),
    s('path', { d: 'M110 130l8-10 10 6 8-10 6 18z' }, 'gray'),
    s('path', { d: 'M24 126l10-6 6 12z' }, 'brown')
  ],
  'categóricamente': [
    s('circle', { cx: 80, cy: 40, r: 20 }, 'skin'),
    s('path', { d: 'M40 146v-44q0-28 40-28t40 28v44z' }, 'navy'),
    s('path', { d: 'M46 86l68 46M114 86l-68 46', ...SW(14) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M70 46h20', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[72, 36], [88, 36]], 2.5) }, 'dark')
  ],
  cebra: [
    s('path', { d: 'M50 96v40M62 98v38M92 98v38M104 96v40', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: ells([[76, 84, 44, 20]]) + 'M98 76l12-38 18 4-8 40z' }, 'white', { accent: true }),
    s('ellipse', { cx: 130, cy: 46, rx: 16, ry: 9, transform: 'rotate(35 130 46)' }, 'white'),
    s('path', { d: 'M50 68v34M64 64v40M78 64v40M92 66v36M104 50l12 4M102 62l12 4M120 38l8 10M136 50l4 8', ...SW(5) }, 'black', { stroke: true }),
    s('path', { d: ells([[76, 84, 44, 20]]) + 'M98 76l12-38 18 4-8 40z', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M34 80q-12 10-8 30', ...SW(4) }, 'dark', { stroke: true })
  ],
  chili: [
    s('path', { d: 'M20 76h120q-4 56-60 60q-56-4-60-60z' }, 'gray'),
    s('ellipse', { cx: 80, cy: 76, rx: 60, ry: 14 }, 'red', { accent: true }),
    s('path', { d: ells([[56, 74, 6, 4], [80, 70, 6, 4], [104, 76, 6, 4], [70, 82, 6, 4]]) }, 'brown'),
    s('path', { d: dots([[92, 82], [64, 70]], 3) }, 'green'),
    s('path', { d: 'M116 36q10 20-24 34q30 0 34-26z' }, 'red'),
    s('path', { d: 'M118 38l8-12', ...SW(4) }, 'green', { stroke: true })
  ],
  chinchilla: [
    s('path', { d: ells([[84, 102, 46, 36]]) }, 'gray', { accent: true }),
    s('circle', { cx: 58, cy: 70, r: 30 }, 'gray'),
    s('path', { d: ells([[40, 38, 13, 18], [74, 36, 13, 18]]) }, 'pink'),
    s('path', { d: dots([[46, 68], [68, 68]], 4) }, 'black'),
    s('circle', { cx: 57, cy: 80, r: 3 }, 'pink'),
    s('path', { d: 'M40 84l-16-2M40 88l-14 6M74 84l14-2', ...SW(1.5) }, 'dark', { stroke: true }),
    s('path', { d: 'M128 112q16-8 10-30', ...SW(10) }, 'gray', { stroke: true })
  ],
  chorrada: [
    s('path', { d: HEAD, transform: 'translate(-28 0) scale(1)' }, 'skin'),
    s('path', { d: 'M100 92q20-30 46-20', ...SW(5) }, 'sky', { stroke: true, accent: true }),
    s('path', { d: dots([[110, 60], [128, 50], [140, 92], [120, 104]], 5) }, 'blue'),
    s('circle', { cx: 74, cy: 64, r: 4 }, 'dark'),
    s('path', { d: 'M40 34q20-14 46-6', ...SW(8) }, 'brown', { stroke: true })
  ],
  colada: [
    s('path', { d: 'M14 30q66 18 132 0', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 40l12-6h12l12 6-6 12h-4v40H32V52h-4z' }, 'blue', { accent: true }),
    s('path', { d: 'M74 40h28v54H74z' }, 'pink'),
    s('path', { d: 'M112 36h26l-2 40h-8l-2-18-2 18h-8z' }, 'yellow'),
    s('path', { d: 'M40 106h80l-8 34H48z' }, 'tan'),
    s('path', { d: 'M48 116h64M50 128h60', ...SW(2) }, 'brown', { stroke: true })
  ],
  coloso: [
    ground(),
    s('path', { d: 'M54 136l6-50h40l6 50h-14l-6-36-6 36z' }, 'orange', { accent: true }),
    s('rect', { x: 58, y: 42, width: 44, height: 48, rx: 10 }, 'orange'),
    s('circle', { cx: 80, cy: 28, r: 14 }, 'orange'),
    s('path', { d: 'M100 50l20-26', ...SW(8) }, 'orange', { stroke: true }),
    s('path', { d: 'M120 24l6-8', ...SW(4) }, 'yellow', { stroke: true }),
    ...person(134, 136, 'blue', { h: 14, w: 10, r: 5 })
  ],
  complaciente: [
    ground(),
    ...lean(62, 136, 22, 'navy', { accent: true }),
    s('path', { d: 'M74 100l30-6', ...SW(6) }, 'navy', { stroke: true }),
    s('path', { d: 'M98 92h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 92q14-24 28 0z' }, 'gray'),
    s('path', { d: 'M84 70q4 4 8 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: heart(118, 44, 10) }, 'pink')
  ],
  'concreción': [
    s('path', { d: ells([[40, 50, 26, 18], [26, 64, 14, 12], [56, 66, 16, 12]]) }, 'sky'),
    s('path', { d: dots([[40, 50], [32, 64], [52, 64]], 4) }, 'white'),
    s('path', { d: 'M54 96q20 20 40 4', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M96 94l-12 0 6 12z' }, 'orange'),
    s('path', { d: 'M100 84l24-12 22 12v32l-22 12-24-12z' }, 'gray', { accent: true }),
    s('path', { d: 'M100 84l24 12 22-12M124 96v32', ...SW(3) }, 'dark', { stroke: true })
  ],
  'condecoración': [
    s('path', { d: 'M56 14h48l-12 64H68z' }, 'blue'),
    s('path', { d: 'M72 14h16v60h-16z' }, 'red'),
    s('circle', { cx: 80, cy: 104, r: 34 }, 'yellow', { accent: true }),
    s('path', { d: star(80, 104, 20) }, 'orange'),
    s('circle', { cx: 80, cy: 104, r: 34, ...SW(3) }, 'orange', { stroke: true })
  ],
  'condensación': [
    s('rect', { x: 18, y: 18, width: 124, height: 124, rx: 6 }, 'sky'),
    s('rect', { x: 18, y: 18, width: 124, height: 124, rx: 6, ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 18v124M18 80h124', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: drop(40, 40, 5) + drop(60, 56, 4) + drop(108, 36, 5) + drop(124, 60, 4) + drop(40, 104, 4) + drop(62, 120, 5) + drop(104, 110, 5) + drop(124, 128, 4) }, 'blue', { accent: true }),
    s('path', { d: 'M100 52v14M44 112v14', ...SW(2) }, 'blue', { stroke: true })
  ],
  correccional: [
    ground(),
    s('rect', { x: 26, y: 50, width: 108, height: 86 }, 'gray'),
    s('path', { d: 'M20 52l60-34 60 34z' }, 'navy'),
    s('path', { d: rects([[38, 66, 20, 24], [102, 66, 20, 24]]) }, 'sky'),
    s('path', { d: 'M44 66v24M52 66v24M108 66v24M116 66v24', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 136v-36h28v36z' }, 'brown'),
    s('path', { d: 'M80 70v-12M80 64q-10-8-12 0q2 6 12 0q10-8 12 0q-2 6-12 0', ...SW(3) }, 'green', { stroke: true, accent: true })
  ],
  cremallera: [
    s('path', { d: 'M24 14h50v132H24zM86 14h50v132H86z' }, 'blue'),
    s('path', { d: 'M74 80h12v66H74z' }, 'gray'),
    s('path', { d: Array.from({ length: 8 }, (_, i) => `M74 ${84 + i * 8}h6M80 ${88 + i * 8}h6`).join('') + 'M74 20q0 30-4 52M86 20q0 30 4 52', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 70, y: 66, width: 20, height: 16, rx: 4 }, 'yellow', { accent: true }),
    s('rect', { x: 74, y: 82, width: 12, height: 22, rx: 4 }, 'orange')
  ],
  crujiente: [
    s('path', { d: 'M28 70q20-40 64-36q44 10 40 52q-12 40-60 36q-50-12-44-52z' }, 'yellow', { accent: true }),
    s('path', { d: 'M70 50l10 24-14 14 12 24M104 66l-12 14', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: dots([[46, 64], [110, 102], [92, 46]], 3) }, 'orange'),
    s('path', { d: 'M126 30l10-10M138 46l14-4M30 128l-10 10M48 136l-4 10', ...SW(3) }, 'gray', { stroke: true })
  ],
  'cítrico': [
    s('circle', { cx: 56, cy: 92, r: 40 }, 'orange'),
    s('circle', { cx: 56, cy: 92, r: 32 }, 'cream'),
    s('path', { d: wedge(56, 92, 28, 0, 55) + wedge(56, 92, 28, 65, 115) + wedge(56, 92, 28, 125, 175) + wedge(56, 92, 28, 185, 235) + wedge(56, 92, 28, 245, 295) + wedge(56, 92, 28, 305, 355) }, 'orange'),
    s('path', { d: ells([[114, 58, 30, 22]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M86 52l-6 4M142 64l6-4', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: leaflet(112, 36, -60, 20, 6) }, 'green')
  ],
};
