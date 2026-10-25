// Illustration specs for words still undrawn in batches 0093–0094 (see server/scripts/lexicon/art.js)
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
  antesala: [
    backdrop('cream'),
    s('rect', { x: 92, y: 32, width: 44, height: 104 }, 'brown'),
    s('rect', { x: 98, y: 38, width: 32, height: 98 }, 'yellow', { accent: true }),
    s('path', { d: 'M24 104h52v8H24zM28 112v24M72 112v24M24 104V78' , ...SW(5) }, 'navy', { stroke: true }),
    ...person(48, 104, 'green', { h: 30, w: 24, r: 10 }),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  antidepresivo: [
    s('rect', { x: 26, y: 62, width: 54, height: 36, rx: 18, transform: 'rotate(-30 80 80)' }, 'pink', { accent: true }),
    s('rect', { x: 80, y: 62, width: 54, height: 36, rx: 18, transform: 'rotate(-30 80 80)' }, 'white'),
    s('rect', { x: 26, y: 62, width: 108, height: 36, rx: 18, transform: 'rotate(-30 80 80)', ...SW(3) }, 'gray', { stroke: true }),
    ...face(118, 122, 18, 'yellow'),
    s('path', { d: sparkle(32, 34, 9) }, 'yellow')
  ],
  aplazamiento: [
    s('rect', { x: 18, y: 40, width: 50, height: 52, rx: 4 }, 'white'),
    s('rect', { x: 18, y: 40, width: 50, height: 14, rx: 4 }, 'red'),
    s('rect', { x: 92, y: 68, width: 50, height: 52, rx: 4 }, 'white'),
    s('rect', { x: 92, y: 68, width: 50, height: 14, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: 'M18 40h50v52H18zM92 68h50v52H92zM30 64h26v16H30zM104 92h26v16h-26z', ...SW(3) }, 'gray', { stroke: true }),
    arrow('M44 102q10 34 52 26M86 120l10 8-12 6', 'orange', 5)
  ],
  apresar: [
    s('path', { d: ring(50, 96, 24) + ring(110, 96, 24), ...SW(10) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: 'M72 82q8-10 16 0', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[74, 76], [80, 72], [86, 76]], 4) }, 'dark'),
    s('rect', { x: 36, y: 58, width: 12, height: 14, rx: 2 }, 'gray'),
    s('rect', { x: 112, y: 58, width: 12, height: 14, rx: 2 }, 'gray')
  ],
  'beneplácito': [
    ...paper(30, 18, 84, 112),
    s('path', { d: 'M42 40h60M42 54h60M42 68h40', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 94l14 14 26-30', ...SW(8) }, 'green', { stroke: true, accent: true }),
    s('circle', { cx: 118, cy: 116, r: 22 }, 'red'),
    s('path', { d: ring(118, 116, 14), ...SW(3) }, 'white', { stroke: true })
  ],
  bombeo: [
    ground(),
    s('rect', { x: 54, y: 52, width: 28, height: 84, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M68 52V36L30 24', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 66h22v10', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: drop(104, 92, 4) + drop(104, 106, 4) }, 'blue'),
    s('path', { d: 'M90 112h30l-4 24H94z' }, 'gray')
  ],
  botero: [
    s('path', { d: 'M14 120q16-6 33 0t33 0t33 0t33 0v26H14z' }, 'blue'),
    s('path', { d: 'M28 104h104q-8 22-30 22H58q-22 0-30-22z' }, 'brown', { accent: true }),
    ...person(70, 104, 'green', { h: 34, w: 24, r: 11 }),
    s('path', { d: 'M108 52l-24 82', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: 'M78 128l10 8-6 4z' }, 'tan')
  ],
  burdo: [
    ground(),
    s('path', { d: 'M48 136q-10-30 2-56q-12-12 0-26q24-8 46 2q12 12-2 22q16 26 6 58z' }, 'brown', { accent: true }),
    s('path', { d: 'M56 96l10 8-4 10M90 70l-8 12 8 6M100 112l-10-4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 54q24-6 40 4', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M124 54l10-6M126 70h12M18 60l10 6', ...SW(3) }, 'gray', { stroke: true })
  ],
  'caparazón': [
    s('path', { d: ells([[40, 56, 10, 8], [120, 56, 10, 8], [40, 112, 10, 8], [120, 112, 10, 8], [80, 26, 12, 12]]) + 'M76 132l4 10 4-10z' }, 'green'),
    s('ellipse', { cx: 80, cy: 84, rx: 48, ry: 52 }, 'brown', { accent: true }),
    s('path', { d: 'M68 64h24l8 20-8 20H68l-8-20zM68 64l-14-16M92 64l14-16M60 84H34M100 84h26M68 104l-14 16M92 104l14 16', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: dots([[74, 22], [86, 22]], 2) }, 'dark')
  ],
  carnero: [
    ground(),
    s('path', { d: 'M48 110v26M62 112v24M96 112v24M110 110v26', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: ells([[78, 94, 40, 24], [52, 84, 14, 14], [74, 76, 16, 14], [98, 80, 14, 12]]) }, 'cream'),
    s('ellipse', { cx: 122, cy: 70, rx: 14, ry: 18 }, 'gray'),
    s('path', { d: 'M114 58q-26-12-28 10q0 18 16 16q10-2 8-12', ...SW(9) }, 'tan', { stroke: true, accent: true }),
    s('circle', { cx: 126, cy: 66, r: 2.5 }, 'dark')
  ],
  carrete: [
    s('rect', { x: 34, y: 26, width: 92, height: 14, rx: 4 }, 'tan'),
    s('rect', { x: 34, y: 120, width: 92, height: 14, rx: 4 }, 'tan'),
    s('rect', { x: 46, y: 40, width: 68, height: 80 }, 'red', { accent: true }),
    s('path', { d: 'M46 52h68M46 66h68M46 80h68M46 94h68M46 108h68', ...SW(2) }, 'pink', { stroke: true }),
    s('path', { d: 'M114 100q24 10 14 30t10 16', ...SW(3) }, 'red', { stroke: true })
  ],
  castidad: [
    s('circle', { cx: 80, cy: 80, r: 66 }, 'sky'),
    s('path', { d: 'M80 140V84', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 122, 200, 30, 8) }, 'green'),
    s('path', { d: leaflet(80, 84, -90, 52, 14) + leaflet(80, 84, -130, 46, 12) + leaflet(80, 84, -50, 46, 12) }, 'white', { accent: true }),
    s('path', { d: leaflet(80, 84, -90, 52, 14) + leaflet(80, 84, -130, 46, 12) + leaflet(80, 84, -50, 46, 12), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 82v-18M74 82l-4-14M86 82l4-14', ...SW(2) }, 'yellow', { stroke: true })
  ],
  cavar: [
    s('path', { d: 'M14 112h132v34H14z' }, 'brown'),
    s('path', { d: 'M96 112q14-18 30-18q14 0 20 18z' }, 'tan'),
    s('path', { d: 'M24 112q16 22 36 0z' }, 'dark'),
    ...lean(76, 112, -15, 'blue', { h: 40, w: 24, r: 11 }),
    s('path', { d: 'M86 54L50 104', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M44 100l12 8-8 12-10-6z' }, 'gray', { accent: true })
  ],
  centinela: [
    ground(),
    s('path', { d: 'M20 136V52l22-16 22 16v84z' }, 'red'),
    s('rect', { x: 28, y: 60, width: 28, height: 76 }, 'dark'),
    ...person(104, 136, 'navy', { h: 50, w: 28, r: 12 }),
    s('rect', { x: 92, y: 34, width: 24, height: 26, rx: 6 }, 'black', { accent: true }),
    s('path', { d: 'M124 136V60', ...SW(5) }, 'brown', { stroke: true })
  ],
  chancho: [
    ground(),
    s('path', { d: 'M48 110v26M66 114v22M96 114v22M112 110v26', ...SW(8) }, 'pink', { stroke: true }),
    s('ellipse', { cx: 80, cy: 90, rx: 50, ry: 32 }, 'pink', { accent: true }),
    s('ellipse', { cx: 132, cy: 88, rx: 10, ry: 12 }, 'red'),
    s('path', { d: 'M108 64l8-14 6 16zM30 84q-14-4-6-14t-4-8', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: dots([[130, 84], [134, 92], [114, 76]], 2.5) }, 'dark')
  ],
  chucho: [
    ground(),
    s('path', { d: 'M50 110v26M64 112v24M96 112v24M108 110v26', ...SW(7) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 80, cy: 96, rx: 38, ry: 20 }, 'tan'),
    s('ellipse', { cx: 70, cy: 92, rx: 14, ry: 12 }, 'brown', { accent: true }),
    s('circle', { cx: 116, cy: 70, r: 16 }, 'tan'),
    s('path', { d: 'M108 58l-6 22 8-4zM42 90q-16-10-10-28', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: dots([[120, 66], [131, 74]], 2.5) }, 'dark')
  ],
  'cibernética': [
    ...gear(80, 80, 24, 10, 'gray'),
    s('circle', { cx: 80, cy: 80, r: 9 }, 'white'),
    s('path', { d: 'M80 22a58 58 0 0 1 56 46M80 138a58 58 0 0 1-56-46', ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M128 64l8 8 6-12M32 96l-8-8-6 12', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: dots([[26, 40], [134, 120]], 6) }, 'orange')
  ],
  'compañerismo': [
    ground(),
    s('path', { d: busts([52, 108], 136, 34, 56) }, 'blue'),
    s('path', { d: busts([108], 136, 34, 56) }, 'orange', { accent: true }),
    s('path', { d: 'M52 92l56 0', ...SW(9) }, 'skin', { stroke: true }),
    s('path', { d: dots([[52, 62], [108, 62]], 14) }, 'skin'),
    s('path', { d: heart(80, 34, 12) }, 'red')
  ],
  conector: [
    s('rect', { x: 92, y: 40, width: 50, height: 80, rx: 10 }, 'white'),
    s('rect', { x: 92, y: 40, width: 50, height: 80, rx: 10, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[110, 70], [124, 70], [117, 92]], 4) }, 'dark'),
    s('path', { d: 'M74 70h10M74 90h10', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 42, y: 60, width: 32, height: 40, rx: 6 }, 'orange', { accent: true }),
    s('path', { d: 'M42 80H30q-14 0-14 20v36', ...SW(6) }, 'dark', { stroke: true })
  ],
  consolar: [
    ground(),
    ...person(54, 136, 'green', { h: 46 }),
    ...person(104, 136, 'blue', { h: 40, r: 12 }),
    s('path', { d: 'M62 92q20-14 36-8', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: drop(110, 86, 3) }, 'sky'),
    s('path', { d: heart(80, 36, 12) }, 'pink', { accent: true })
  ],
  custodio: [
    ground(),
    s('rect', { x: 84, y: 54, width: 58, height: 82, rx: 4 }, 'gray'),
    s('path', { d: ring(113, 92, 14) + 'M113 78v28M99 92h28', ...SW(4) }, 'dark', { stroke: true }),
    ...person(44, 136, 'navy', { h: 48 }),
    s('path', { d: ring(64, 58, 7) + 'M64 65v24M64 82h6M64 76h6', ...SW(4) }, 'yellow', { stroke: true, accent: true })
  ],
  'descalificación': [
    s('path', { d: 'M60 18l20 36 20-36', ...SW(10) }, 'blue', { stroke: true }),
    s('circle', { cx: 80, cy: 90, r: 34 }, 'yellow'),
    s('path', { d: star(80, 90, 18) }, 'orange'),
    s('path', { d: 'M34 44l92 92M126 44l-92 92', ...SW(12) }, 'red', { stroke: true, accent: true })
  ],
  desembarcar: [
    s('path', { d: 'M14 112q16-6 33 0t33 0v34H14z' }, 'blue'),
    s('path', { d: 'M14 94h70q-6 24-26 24H30q-14 0-16-12z' }, 'red'),
    s('rect', { x: 88, y: 100, width: 58, height: 10 }, 'brown'),
    s('path', { d: 'M96 110v36M136 110v36', ...SW(5) }, 'brown', { stroke: true }),
    ...lean(116, 100, 10, 'green', { h: 36, w: 22, r: 10, accent: true }),
    arrow('M56 60q24-24 48-6M96 48l8 6-8 8', 'orange', 5)
  ],
  desencanto: [
    s('path', { d: 'M26 128l50-50', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 66l20-20', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M76 78l4-6 6 4-4 6z' }, 'gray'),
    s('path', { d: star(116, 36, 14) }, 'gray', { accent: true }),
    s('path', { d: star(120, 82, 8) + star(130, 116, 7) }, 'gray'),
    s('path', { d: 'M132 62v6M134 98v6', ...SW(3) }, 'gray', { stroke: true })
  ],
  detergente: [
    s('path', { d: 'M48 50h64v80q0 6-6 6H54q-6 0-6-6z' }, 'blue', { accent: true }),
    s('rect', { x: 64, y: 32, width: 22, height: 18, rx: 3 }, 'orange'),
    s('path', { d: 'M86 38h14', ...SW(5) }, 'orange', { stroke: true }),
    s('rect', { x: 58, y: 74, width: 44, height: 36, rx: 6 }, 'white'),
    s('path', { d: ring(30, 34, 10) + ring(124, 28, 8) + ring(132, 56, 6) + ring(80, 92, 8), ...SW(3) }, 'sky', { stroke: true })
  ],
  'devastación': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'gray'),
    s('path', { d: 'M28 136V80l20-18 10 14 8-20 26 24v16l14-6v66z' }, 'brown', { accent: true }),
    s('path', { d: 'M40 136l8-18 12 4 6-14 10 12 12-6 10 22z' }, 'dark'),
    s('path', { d: ells([[104, 54, 16, 12], [122, 38, 18, 14], [90, 34, 12, 10]]) }, 'dark'),
    s('path', { d: 'M110 136l8-10 12 4 6 6z' }, 'tan')
  ],
  diafragma: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'dark'),
    s('circle', { cx: 80, cy: 80, r: 50 }, 'gray'),
    s('path', { d: poly(around(80, 80, 22, 6, 0)) }, 'sky', { accent: true }),
    s('path', { d: around(80, 80, 22, 6, 0).map(([x, y], i) => { const [x2, y2] = around(80, 80, 50, 1, i * 60 + 40)[0]; return `M${x} ${y}L${x2} ${y2}`; }).join(''), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(72, 72, 6) }, 'white')
  ],
  elitista: [
    s('rect', { x: 62, y: 76, width: 36, height: 60 }, 'tan'),
    ground(),
    ...person(80, 76, 'purple', { h: 36, w: 24, r: 11, accent: true }),
    s('path', { d: 'M82 18l4 6 6-6 6 6 2-8H80z' }, 'yellow'),
    s('path', { d: busts([30, 130], 136, 18, 22) + dots([[30, 104], [130, 104]], 8) }, 'gray')
  ],
  engranaje: [
    ...gear(60, 66, 30, 12, 'gray'),
    ...gear(112, 112, 20, 8, 'orange', { accent: true }),
    s('path', { d: dots([[60, 66], [112, 112]], 8) }, 'white'),
    s('path', { d: ring(60, 66, 8) + ring(112, 112, 8), ...SW(2) }, 'dark', { stroke: true })
  ],
  erigir: [
    ground(),
    s('path', { d: 'M46 136l8-14h52l8 14z' }, 'gray'),
    s('path', { d: 'M66 122l4-86 10-14 10 14 4 86z' }, 'tan', { accent: true }),
    arrow('M126 120V34M114 46l12-12 12 12', 'green', 6),
    arrow('M34 120V34M22 46l12-12 12 12', 'green', 6)
  ],
  escarabajo: [
    s('path', { d: 'M48 64l-18-10M48 84H22M48 104l-18 14M112 64l18-10M112 84h26M112 104l18 14M72 34l-8-14M88 34l8-14', ...SW(4) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 80, cy: 40, rx: 16, ry: 12 }, 'dark'),
    s('ellipse', { cx: 80, cy: 90, rx: 34, ry: 44 }, 'green', { accent: true }),
    s('path', { d: 'M80 50v82', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(64, 74, 6) }, 'mint')
  ],
  estrado: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'cream'),
    s('path', { d: 'M18 136v-28h124v28z' }, 'brown'),
    s('path', { d: 'M18 108h124', ...SW(4) }, 'tan', { stroke: true }),
    ...person(80, 84, 'navy', { h: 26, w: 26, r: 11 }),
    s('path', { d: 'M62 108l4-34h28l4 34z' }, 'red', { accent: true })
  ],
  exuberante: [
    s('path', { d: 'M14 136h132v10H14z' }, 'brown'),
    s('path', { d: leaflet(80, 136, -90, 110, 18) + leaflet(80, 136, -130, 90, 16) + leaflet(80, 136, -50, 90, 16) }, 'green', { accent: true }),
    s('path', { d: leaflet(80, 136, -160, 70, 14) + leaflet(80, 136, -20, 70, 14) + leaflet(80, 136, -110, 80, 12) + leaflet(80, 136, -70, 80, 12) }, 'mint'),
    s('path', { d: dots([[40, 48], [122, 56]], 7) }, 'red'),
    s('path', { d: dots([[40, 48], [122, 56]], 3) }, 'yellow')
  ],
  fichero: [
    s('rect', { x: 38, y: 40, width: 70, height: 50, rx: 3 }, 'white'),
    s('path', { d: 'M38 40h70v50H38z', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 52, y: 30, width: 70, height: 50, rx: 3 }, 'yellow'),
    s('rect', { x: 92, y: 22, width: 22, height: 10, rx: 2 }, 'orange'),
    s('path', { d: 'M22 74h116v62H22z' }, 'brown', { accent: true }),
    s('rect', { x: 64, y: 94, width: 32, height: 12, rx: 4 }, 'tan')
  ],
  formalizar: [
    ...paper(24, 22, 80, 104),
    s('path', { d: 'M36 42h56M36 56h56M36 70h40M36 108h40', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 100q8-14 12 0t12-4 10 2', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M142 50l-56 56-6 14 14-6 56-56z' }, 'blue', { accent: true }),
    s('circle', { cx: 116, cy: 120, r: 14 }, 'red')
  ],
  genoma: [
    s('path', { d: 'M54 16q52 32 0 64t0 64', ...SW(7) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M106 16q-52 32 0 64t0 64', ...SW(7) }, 'red', { stroke: true }),
    s('path', { d: 'M64 30h32M76 48h8M64 64h32M64 96h32M76 112h8M64 128h32', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots([[26, 40], [134, 120]], 5) }, 'yellow')
  ],
  giratorio: [
    ground(),
    s('path', { d: 'M80 112v16M56 132l24-4 24 4', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 56, y: 96, width: 48, height: 14, rx: 6 }, 'blue', { accent: true }),
    s('rect', { x: 60, y: 46, width: 40, height: 50, rx: 10 }, 'blue'),
    arrow('M30 70a50 22 0 1 0 100 0M120 60l10 10 10-12', 'orange', 5)
  ],
  globalizar: [
    s('circle', { cx: 80, cy: 80, r: 46 }, 'sky'),
    s('path', { d: 'M54 56q16-8 22 6t-6 20q-12 4-16-10zM92 92q16-4 20 10t-12 18q-14-6-8-28zM96 44q14 0 18 10l-10 4z' }, 'green', { accent: true }),
    arrow('M30 40a64 64 0 0 1 90-16M112 14l8 10-12 6', 'orange', 5),
    arrow('M130 120a64 64 0 0 1-90 16M48 146l-8-10 12-6', 'orange', 5)
  ],
  hotelero: [
    s('rect', { x: 18, y: 112, width: 124, height: 12, rx: 3 }, 'brown'),
    s('path', { d: 'M34 112a30 30 0 0 1 60 0z' }, 'yellow', { accent: true }),
    s('path', { d: 'M64 82v-8M56 72h16', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: ring(118, 56, 10) + 'M118 66v38M118 96h8M118 88h6', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 106, y: 98, width: 24, height: 12, rx: 3 }, 'red')
  ],
  idealmente: [
    s('circle', { cx: 80, cy: 82, r: 58 }, 'white'),
    s('path', { d: ring(80, 82, 58), ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 82, r: 42 }, 'red'),
    s('circle', { cx: 80, cy: 82, r: 26 }, 'white'),
    s('circle', { cx: 80, cy: 82, r: 12 }, 'red', { accent: true }),
    s('path', { d: 'M82 80l52-52M128 24l10-2-2 10M124 28l14 0', ...SW(5) }, 'dark', { stroke: true })
  ],
  imprevisto: [
    s('rect', { x: 40, y: 92, width: 80, height: 50, rx: 4 }, 'red'),
    s('path', { d: 'M40 92l-18-22h60z' }, 'orange'),
    s('path', { d: 'M80 92q-12-8 0-16t0-16q-12-8 0-16', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 30, r: 18 }, 'yellow', { accent: true }),
    s('path', { d: dots([[74, 26], [86, 26]], 3) + ells([[80, 38, 5, 4]]) }, 'dark'),
    s('path', { d: 'M46 22l-12-6M44 40H30M114 22l12-6M116 40h14', ...SW(4) }, 'orange', { stroke: true })
  ],
  incuestionable: [
    s('path', { d: 'M80 16l54 18v40q0 46-54 70q-54-24-54-70V34z' }, 'navy'),
    s('path', { d: 'M80 28l42 14v32q0 36-42 56q-42-20-42-56V42z' }, 'blue'),
    s('path', { d: 'M56 80l18 18 32-36', ...SW(10) }, 'yellow', { stroke: true, accent: true })
  ],
  inseparable: [
    s('path', { d: ring(62, 80, 30), ...SW(12) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: ring(98, 80, 30), ...SW(12) }, 'orange', { stroke: true }),
    s('path', { d: 'M74 54a30 30 0 0 1 12 6', ...SW(12, { 'stroke-linecap': 'butt' }) }, 'yellow', { stroke: true }),
    s('path', { d: sparkle(80, 26, 8) + sparkle(126, 128, 6) }, 'yellow')
  ],
  irrefutable: [
    s('path', { d: 'M40 50q20-20 40 0M32 64q28-30 56 0M28 80q32-34 64 0M32 96q28-26 56 0M40 112q20-18 40 0', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 90, cy: 76, r: 34 }, 'sky'),
    s('path', { d: 'M70 70q20-20 40 0M66 84q24-26 48 0', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: ring(90, 76, 34), ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M114 100l26 26', ...SW(12) }, 'brown', { stroke: true, accent: true })
  ],
  item: [
    s('circle', { cx: 36, cy: 86, r: 20 }, 'red', { accent: true }),
    s('circle', { cx: 124, cy: 86, r: 20 }, 'red'),
    s('path', { d: 'M36 66q2-10 8-14M124 66q2-10 8-14', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(40, 62, -30, 16, 5) + leaflet(128, 62, -30, 16, 5) }, 'green'),
    s('path', { d: 'M80 74v24M68 86h24', ...SW(7) }, 'gray', { stroke: true })
  ],
  jugoso: [
    s('circle', { cx: 74, cy: 86, r: 48 }, 'orange'),
    s('circle', { cx: 74, cy: 86, r: 40 }, 'yellow', { accent: true }),
    s('path', { d: rays(74, 86, 6, 36, 8), ...SW(3) }, 'cream', { stroke: true }),
    s('path', { d: drop(130, 40, 6) + drop(136, 74, 5) + drop(120, 128, 5) + drop(28, 30, 5) }, 'orange')
  ],
  lamer: [
    s('path', { d: 'M90 136l20-58h-40z' }, 'tan'),
    s('path', { d: ells([[90, 64, 22, 20]]) }, 'pink', { accent: true }),
    s('circle', { cx: 40, cy: 66, r: 24 }, 'tan'),
    s('path', { d: ells([[18, 70, 8, 16], [58, 52, 6, 4]]) }, 'brown'),
    s('path', { d: dots([[34, 58], [46, 60]], 3) }, 'dark'),
    s('path', { d: 'M52 76q14-4 18 10q-8 8-18-2z' }, 'red')
  ],
  loza: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: ells([[64, 126, 46, 8], [64, 114, 46, 8], [64, 102, 46, 8]]) }, 'white'),
    s('path', { d: ells([[64, 126, 46, 8], [64, 114, 46, 8], [64, 102, 46, 8]]), ...SW(2) }, 'blue', { stroke: true }),
    s('path', { d: 'M100 56h32v30q0 14-16 14t-16-14z' }, 'white'),
    s('path', { d: 'M100 56h32v30q0 14-16 14t-16-14zM132 64q12 0 10 12t-12 8', ...SW(3) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M40 70q24 14 48 0', ...SW(2) }, 'blue', { stroke: true })
  ],
  malicioso: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('circle', { cx: 80, cy: 84, r: 46 }, 'purple', { accent: true }),
    s('path', { d: 'M50 64l22 10M110 64l-22 10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: ells([[64, 82, 6, 3], [96, 82, 6, 3]]) }, 'yellow'),
    s('path', { d: 'M54 102q26 22 52 0q-26 8-52 0z' }, 'white'),
    s('path', { d: 'M46 48l-6-20 18 10zM114 48l6-20-18 10z' }, 'purple')
  ],
  medusa: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'blue'),
    s('path', { d: 'M56 80q-6 20 4 34t-2 26M72 82q4 22-4 36M88 82q-4 22 4 36M104 80q6 20-4 34t2 26', ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: 'M36 82q0-50 44-50t44 50q-11-8-22 0q-11-8-22 0q-11-8-22 0q-11-8-22 0z' }, 'pink', { accent: true }),
    s('path', { d: ring(30, 40, 4) + ring(130, 120, 5) + ring(124, 30, 3), ...SW(2) }, 'sky', { stroke: true })
  ],
  memorizar: [
    s('path', { d: HEAD, transform: 'translate(160 0) scale(-1 1)' }, 'skin'),
    s('path', { d: ells([[86, 62, 26, 20]]) }, 'pink', { accent: true }),
    s('path', { d: 'M74 52q8 6 0 12M90 50q-6 8 4 14M98 64q-8 4-4 10', ...SW(2.5) }, 'red', { stroke: true }),
    s('rect', { x: 14, y: 24, width: 30, height: 22, rx: 3 }, 'yellow'),
    arrow('M30 52q4 16 26 14M50 60l8 6-8 6', 'orange', 4)
  ],
  naco: [
    ground(),
    s('circle', { cx: 80, cy: 38, r: 14 }, 'skin'),
    s('rect', { x: 62, y: 54, width: 36, height: 44, rx: 10 }, 'pink'),
    s('path', { d: 'M62 66h36M62 80h36', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M66 98h28v38H66z' }, 'orange', { accent: true }),
    s('path', { d: 'M68 56q12 18 24 0', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M66 30q14-14 28 0', ...SW(6) }, 'purple', { stroke: true })
  ],
  'pastelería': [
    s('rect', { x: 22, y: 50, width: 116, height: 86 }, 'cream'),
    s('path', { d: 'M18 30h124v20q-10 10-20 0q-10 10-21 0q-10 10-21 0q-10 10-21 0q-10 10-21 0q-10 10-20 0z' }, 'pink', { accent: true }),
    s('rect', { x: 30, y: 64, width: 62, height: 50, rx: 3 }, 'sky'),
    s('path', { d: 'M42 112v-16h38v16zM42 96q19-10 38 0' }, 'brown'),
    s('path', { d: 'M61 86v-8', ...SW(3) }, 'red', { stroke: true }),
    s('rect', { x: 102, y: 72, width: 28, height: 64 }, 'brown'),
    ground()
  ],
  pava: [
    s('path', { d: 'M42 128q-14-60 38-64q52 4 38 64z' }, 'gray', { accent: true }),
    s('path', { d: 'M116 96q16-8 24-30', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 76q-2-36 28-36t28 36', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 64, y: 58, width: 32, height: 8, rx: 3 }, 'dark'),
    s('path', { d: 'M138 52q-6-8 0-16t0-16', ...SW(3) }, 'sky', { stroke: true }),
    s('rect', { x: 34, y: 126, width: 92, height: 10, rx: 4 }, 'brown')
  ],
  periodicidad: [
    s('path', { d: 'M14 80h132', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M16 80q11-48 22 0t22 0t22 0t22 0t22 0t22 0', ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: dots([[27, 56], [71, 56], [115, 56]], 6) }, 'orange'),
    s('path', { d: 'M27 116v12M71 116v12M115 116v12M27 122h88', ...SW(3) }, 'gray', { stroke: true })
  ],
  perpendicular: [
    s('path', { d: 'M18 124h124', ...SW(8) }, 'navy', { stroke: true }),
    s('path', { d: 'M80 124V22', ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M80 102h22v22', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M80 22l-10-6h20z' }, 'red')
  ],
  perturbador: [
    s('path', { d: ells([[80, 32, 36, 16], [54, 36, 20, 12], [106, 38, 20, 12]]) }, 'dark'),
    s('path', { d: 'M70 52l-8 14h10l-6 14', ...SW(4) }, 'yellow', { stroke: true }),
    ground(),
    ...person(80, 136, 'blue', { h: 40, accent: true }),
    s('path', { d: 'M54 92l-8-4 6-6-8-4M106 92l8-4-6-6 8-4', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: drop(92, 72, 3) }, 'sky')
  ],
  'picardía': [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'yellow', { accent: true }),
    s('circle', { cx: 60, cy: 66, r: 6 }, 'dark'),
    s('path', { d: 'M92 68q10-8 20 0M50 94q30 30 60 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 106q4 18 14 14q6-6 0-18z' }, 'red'),
    s('path', { d: sparkle(130, 28, 9) }, 'orange')
  ],
  'plantón': [
    ground(),
    s('path', { d: 'M86 136l28-44 28 44z' }, 'orange'),
    s('path', { d: busts([30, 64], 136, 24, 26) + dots([[30, 98], [64, 98]], 11) }, 'blue'),
    s('path', { d: 'M48 94V50', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 26, y: 22, width: 44, height: 30, rx: 3 }, 'white', { accent: true }),
    s('rect', { x: 26, y: 22, width: 44, height: 30, rx: 3, ...SW(3) }, 'red', { stroke: true })
  ],
  porra: [
    s('path', { d: ring(80, 76, 34), ...SW(20) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: ring(80, 76, 34), ...DASH(3, '4 8') }, 'brown', { stroke: true }),
    s('path', { d: dots([[60, 52], [104, 60], [98, 102], [56, 96]], 2.5) }, 'cream'),
    s('path', { d: 'M100 122h40l-4 22h-32z' }, 'white'),
    s('path', { d: ells([[120, 122, 20, 5]]) }, 'brown'),
    s('path', { d: 'M100 122h40l-4 22h-32z', ...SW(3) }, 'gray', { stroke: true })
  ],
  privar: [
    ground(),
    ...person(46, 136, 'green', { h: 40 }),
    s('path', { d: 'M58 88l18-6', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 104, cy: 72, r: 16 }, 'red', { accent: true }),
    s('path', { d: 'M146 66h-24', ...SW(10) }, 'skin', { stroke: true }),
    arrow('M90 46h40M120 36l10 10-10 10', 'gray', 5)
  ],
  pudrir: [
    s('circle', { cx: 80, cy: 92, r: 46 }, 'green'),
    s('path', { d: ells([[64, 84, 16, 12], [100, 106, 14, 10], [84, 120, 8, 6]]) }, 'brown', { accent: true }),
    s('path', { d: 'M80 46q0-14 8-20', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: ells([[42, 34, 4, 3], [124, 40, 4, 3]]) }, 'dark'),
    s('path', { d: 'M30 30q4-8 10 0M48 26q4-8 8 0M118 36q4-8 8 0M132 32q4-8 8 0', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M54 40q-6-8 0-16M108 36q6-8 0-16', ...SW(2.5) }, 'mint', { stroke: true })
  ],
  'recámara': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'cream'),
    s('rect', { x: 18, y: 64, width: 10, height: 72, rx: 3 }, 'brown'),
    s('rect', { x: 28, y: 96, width: 90, height: 24, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 30, y: 84, width: 28, height: 14, rx: 6 }, 'white'),
    s('path', { d: 'M30 120v16M114 120v16', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M126 136v-40M120 96l6-30 14 0 0 30zM120 136h14', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M120 66h20l4 26h-28z' }, 'yellow')
  ],
  'repartición': [
    s('rect', { x: 60, y: 22, width: 40, height: 32, rx: 4 }, 'brown', { accent: true }),
    arrow('M70 58L36 90M80 58v32M90 58l34 32', 'orange', 5),
    s('path', { d: busts([30, 80, 130], 140, 24, 24) }, 'blue'),
    s('path', { d: dots([[30, 108], [80, 108], [130, 108]], 10) }, 'skin')
  ],
  resguardar: [
    s('path', { d: drop(26, 30, 4) + drop(50, 22, 4) + drop(110, 22, 4) + drop(136, 30, 4) + drop(24, 80, 4) + drop(140, 84, 4) }, 'blue'),
    ground(),
    s('path', { d: 'M30 72q50-50 100 0z' }, 'red', { accent: true }),
    s('path', { d: 'M80 48v-6M80 72v26', ...SW(4) }, 'dark', { stroke: true }),
    ...person(70, 136, 'green', { h: 38, w: 24, r: 11 }),
    ...person(96, 136, 'yellow', { h: 30, w: 20, r: 9 })
  ],
  retar: [
    ground(),
    ...lean(36, 136, 10, 'blue', { h: 44 }),
    ...lean(124, 136, -10, 'red', { h: 44 }),
    s('path', { d: 'M52 88l16-4M108 88l-16-4', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M80 50l-8 18h12l-8 18', ...SW(5) }, 'yellow', { stroke: true, accent: true })
  ],
  rinoceronte: [
    ground(),
    s('path', { d: 'M44 110v26M60 112v24M96 112v24M110 110v26', ...SW(10) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 76, cy: 90, rx: 50, ry: 28 }, 'gray', { accent: true }),
    s('path', { d: 'M104 70q32-10 40 24q-8 14-32 10z' }, 'gray'),
    s('path', { d: 'M130 84l10-36 8 38zM116 74l4-16 8 14z' }, 'cream'),
    s('path', { d: dots([[122, 84]], 2.5) }, 'dark'),
    s('path', { d: 'M108 70l-2-12 8 8z' }, 'gray')
  ],
  sauna: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'tan'),
    s('path', { d: 'M14 40h132M14 66h132M14 92h132', ...SW(2) }, 'brown', { stroke: true }),
    s('rect', { x: 20, y: 100, width: 120, height: 14 }, 'brown', { accent: true }),
    s('path', { d: 'M30 114v32M130 114v32', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M90 136l6-18h24l6 18z' }, 'gray'),
    s('path', { d: 'M52 88q-8-10 0-20t0-20M80 88q-8-10 0-20t0-20M108 88q-8-10 0-20t0-20', ...SW(4) }, 'white', { stroke: true })
  ],
  sien: [
    s('circle', { cx: 80, cy: 72, r: 38 }, 'skin'),
    s('path', { d: 'M42 66q0-36 38-36t38 36q-10-20-38-20t-38 20z' }, 'brown'),
    ...face(80, 82, 22, 'skin', 'frown').slice(1),
    s('path', { d: 'M14 136q0-40 22-58M146 136q0-40-22-58', ...SW(12) }, 'skin', { stroke: true }),
    s('path', { d: dots([[40, 72], [120, 72]], 9) }, 'red', { accent: true }),
    s('path', { d: 'M24 52l-8-6M136 52l8-6', ...SW(3) }, 'orange', { stroke: true })
  ],
  sudadera: [
    s('path', { d: 'M56 30q24-18 48 0l30 20 8 70h-20l-4-50v66H42V70l-4 50H18l8-70z' }, 'green', { accent: true }),
    s('path', { d: 'M62 34q18 26 36 0q-18-12-36 0z' }, 'dark'),
    s('path', { d: 'M72 44v20M88 44v20', ...SW(3) }, 'white', { stroke: true }),
    s('rect', { x: 58, y: 98, width: 44, height: 22, rx: 6 }, 'mint'),
    s('path', { d: 'M42 128h76', ...SW(6) }, 'mint', { stroke: true })
  ],
  'sísmico': [
    ...paper(18, 28, 124, 90),
    s('path', { d: 'M22 74h18l6-12 6 22 8-44 8 64 8-50 8 34 6-20 6 6h44', ...SW(4) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M30 132h100', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 136l-6 8M96 136l6 8', ...SW(3) }, 'gray', { stroke: true })
  ],
  teja: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 40h132v106H14z' }, 'red', { accent: true }),
    s('path', { d: 'M14 74q11-14 22 0t22 0t22 0t22 0t22 0t22 0M14 108q11-14 22 0t22 0t22 0t22 0t22 0t22 0M14 142q11-14 22 0t22 0t22 0t22 0t22 0t22 0', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M36 40v96M58 40v96M80 40v96M102 40v96M124 40v96', ...SW(2) }, 'orange', { stroke: true })
  ],
  tibetano: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 146V110l40-62 26 34 22-30 44 68v26z' }, 'white'),
    s('path', { d: 'M14 146V122l40-30 30 30 24-20 38 30v14z' }, 'gray'),
    s('path', { d: 'M18 30q62 30 124 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 36h12v16H30zM90 46h12v16H90z' }, 'blue', { accent: true }),
    s('path', { d: 'M50 42h12v16H50zM110 40h12v16h-12z' }, 'yellow'),
    s('path', { d: 'M70 46h12v16H70zM130 34h10v14h-10z' }, 'red')
  ],
  'trampolín': [
    s('path', { d: 'M14 110h132v36H14z' }, 'sky'),
    s('path', { d: 'M14 120q16-6 33 0t33 0t33 0t33 0', ...SW(3) }, 'blue', { stroke: true }),
    s('rect', { x: 18, y: 62, width: 14, height: 48 }, 'gray'),
    s('path', { d: 'M18 62h90', ...SW(8) }, 'blue', { stroke: true, accent: true }),
    ...person(98, 58, 'red', { h: 26, w: 18, r: 9 }),
    arrow('M112 26q24-4 26 36', 'gray', 3)
  ],
  turbina: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'gray'),
    s('circle', { cx: 80, cy: 80, r: 52 }, 'dark'),
    s('path', { d: around(80, 80, 50, 12).map(([x, y]) => `M80 80Q${((x + 80) / 2 + (y - 80) / 4).toFixed(1)} ${((y + 80) / 2 - (x - 80) / 4).toFixed(1)} ${x} ${y}`).join(''), ...SW(7) }, 'sky', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 80, r: 14 }, 'gray'),
    s('circle', { cx: 80, cy: 80, r: 5 }, 'dark')
  ],
  ultraderecha: [
    s('rect', { x: 18, y: 72, width: 124, height: 16, rx: 8 }, 'cream'),
    s('path', { d: 'M28 80h104', ...DASH(3, '2 10') }, 'gray', { stroke: true }),
    s('circle', { cx: 134, cy: 80, r: 14 }, 'navy', { accent: true }),
    arrow('M60 46h64M112 34l12 12-12 12', 'navy', 7),
    arrow('M60 116h64M112 104l12 12-12 12', 'navy', 7)
  ],
  vikingo: [
    s('path', { d: 'M14 120q16-6 33 0t33 0t33 0t33 0v26H14z' }, 'blue'),
    s('path', { d: 'M20 96h120q-10 24-34 24H54q-24 0-34-24zM20 96q-6-20 6-24M140 96q6-20-6-24' }, 'brown'),
    s('path', { d: 'M80 96V20', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 50, y: 26, width: 60, height: 52, rx: 4 }, 'white'),
    s('path', { d: 'M50 38h60M50 62h60', ...SW(12, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true, accent: true }),
    s('path', { d: dots([[40, 104], [62, 104], [84, 104], [106, 104], [124, 104]], 7) }, 'yellow')
  ],
  visor: [
    s('rect', { x: 18, y: 54, width: 108, height: 70, rx: 10 }, 'dark'),
    s('rect', { x: 30, y: 42, width: 28, height: 14, rx: 3 }, 'dark'),
    s('rect', { x: 32, y: 66, width: 54, height: 40, rx: 4 }, 'sky', { accent: true }),
    s('path', { d: 'M40 98l14-16 10 10 8-8 10 14z' }, 'green'),
    s('path', { d: 'M96 40q20-10 40 0q-20 10-40 0z' }, 'white'),
    s('circle', { cx: 116, cy: 40, r: 6 }, 'brown'),
    s('path', { d: 'M100 52v14', ...SW(3) }, 'gray', { stroke: true })
  ],
  'éter': [
    s('path', { d: 'M58 62h44v68q0 8-8 8H66q-8 0-8-8z' }, 'brown', { accent: true }),
    s('rect', { x: 66, y: 44, width: 28, height: 20 }, 'brown'),
    s('rect', { x: 64, y: 34, width: 32, height: 12, rx: 3 }, 'dark'),
    s('rect', { x: 66, y: 86, width: 28, height: 30, rx: 3 }, 'cream'),
    s('path', { d: ells([[110, 26, 12, 8], [128, 34, 10, 7], [44, 30, 10, 7]]) }, 'mint'),
    s('path', { d: drop(80, 102, 6) }, 'sky')
  ],
  acarrear: [
    ground(),
    s('path', { d: 'M30 72h70l-10 36H40z' }, 'green', { accent: true }),
    s('path', { d: rects([[40, 56, 20, 16], [62, 56, 20, 16], [50, 40, 20, 16]]) }, 'red'),
    s('circle', { cx: 56, cy: 120, r: 14 }, 'dark'),
    s('path', { d: 'M90 100l40 10', ...SW(5) }, 'brown', { stroke: true }),
    ...lean(136, 136, -15, 'blue', { h: 40, w: 22, r: 10 })
  ],
  acecho: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('path', { d: 'M14 146V96q12-30 22 0q10-36 22 0q10-36 22 0q10-36 22 0q10-36 22 0q12-30 22 0v50z' }, 'green'),
    s('path', { d: ells([[62, 92, 12, 8], [98, 92, 12, 8]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M62 86v12M98 86v12', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 120, cy: 36, r: 12 }, 'cream')
  ],
  'agronomía': [
    s('path', { d: 'M14 100h132v46H14z' }, 'brown'),
    s('path', { d: 'M14 116h132M14 132h132', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M54 100V60', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(54, 74, -150, 26, 9) + leaflet(54, 66, -30, 26, 9) }, 'green'),
    s('circle', { cx: 104, cy: 52, r: 22 }, 'sky'),
    s('path', { d: ring(104, 52, 22) + 'M120 68l20 20', ...SW(7) }, 'dark', { stroke: true, accent: true })
  ],
  alternar: [
    s('circle', { cx: 42, cy: 80, r: 26 }, 'red', { accent: true }),
    s('circle', { cx: 118, cy: 80, r: 26 }, 'blue'),
    arrow('M48 44q32-30 64 0M100 32l12 12-16 6', 'orange', 5),
    arrow('M112 116q-32 30-64 0M60 128l-12-12 16-6', 'orange', 5)
  ],
  andadura: [
    s('path', { d: 'M22 136q40-10 40-40t56-40', ...DASH(4, '2 12') }, 'gray', { stroke: true }),
    s('path', { d: ells([[30, 128, 5, 8], [46, 120, 5, 8], [58, 104, 5, 8], [66, 86, 5, 8], [82, 70, 5, 8], [100, 62, 5, 8]]) }, 'brown'),
    s('path', { d: 'M122 58V18', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M124 18h22l-6 9 6 9h-22z' }, 'red', { accent: true })
  ],
  antisemita: [
    ground(),
    ...person(44, 136, 'gray', { h: 44 }),
    s('path', { d: 'M30 82l28 10', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: ells([[44, 32, 22, 10], [32, 28, 12, 8]]) }, 'dark', { accent: true }),
    ...person(116, 136, 'blue', { h: 44 }),
    s('path', { d: 'M80 48v88', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: drop(126, 70, 3) }, 'sky')
  ],
  apio: [
    s('path', { d: 'M56 140l6-90M72 142l2-96M88 142l-2-96M104 140l-6-90', ...SW(12) }, 'mint', { stroke: true }),
    s('path', { d: 'M56 140l6-90M88 142l-2-96', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(62, 50, -120, 26, 10) + leaflet(74, 46, -95, 28, 10) + leaflet(86, 46, -80, 28, 10) + leaflet(98, 50, -55, 26, 10) }, 'green', { accent: true })
  ],
  arbitrariedad: [
    s('rect', { x: 22, y: 76, width: 48, height: 48, rx: 8 }, 'white'),
    s('rect', { x: 22, y: 76, width: 48, height: 48, rx: 8, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[34, 88], [46, 100], [58, 112]], 5) }, 'dark'),
    s('rect', { x: 84, y: 24, width: 50, height: 22, rx: 4, transform: 'rotate(-30 109 35)' }, 'brown', { accent: true }),
    s('path', { d: 'M110 42l20 40', ...SW(7) }, 'brown', { stroke: true }),
    s('rect', { x: 92, y: 120, width: 50, height: 12, rx: 3 }, 'brown')
  ],
  argumental: [
    s('rect', { x: 14, y: 40, width: 132, height: 80, rx: 4 }, 'dark'),
    s('path', { d: rects([[20, 46, 8, 8], [36, 46, 8, 8], [52, 46, 8, 8], [68, 46, 8, 8], [84, 46, 8, 8], [100, 46, 8, 8], [116, 46, 8, 8], [132, 46, 8, 8], [20, 106, 8, 8], [36, 106, 8, 8], [52, 106, 8, 8], [68, 106, 8, 8], [84, 106, 8, 8], [100, 106, 8, 8], [116, 106, 8, 8], [132, 106, 8, 8]]) }, 'white'),
    s('path', { d: 'M24 98q28-2 40-20t26-16q18 2 24 22t22 14', ...SW(5) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: dots([[24, 98], [90, 62], [136, 98]], 5) }, 'orange')
  ],
  arrecho: [
    s('circle', { cx: 80, cy: 88, r: 46 }, 'red', { accent: true }),
    s('path', { d: 'M54 72l18 8M106 72l-18 8M60 112q20-14 40 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[64, 88], [96, 88]], 4) }, 'dark'),
    s('path', { d: 'M40 36q-8-10 0-20M120 36q8-10 0-20M80 32q-8-10 0-18', ...SW(5) }, 'gray', { stroke: true })
  ],
  'artífice': [
    ground(),
    ...person(44, 136, 'brown', { h: 46 }),
    s('rect', { x: 76, y: 104, width: 70, height: 10 }, 'tan'),
    s('path', { d: 'M84 104l4-32h40l4 32zM96 72q12-14 24 0' }, 'blue', { accent: true }),
    s('path', { d: 'M56 84l18-26', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 64, y: 48, width: 20, height: 10, rx: 2, transform: 'rotate(-35 74 53)' }, 'gray'),
    s('path', { d: sparkle(110, 32, 8) }, 'yellow')
  ],
  'astrónomo': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('path', { d: star(110, 34, 9) + star(134, 62, 6) + star(40, 32, 5) }, 'yellow'),
    s('path', { d: 'M90 128l-14-40M90 128l14-10', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 58, y: 66, width: 60, height: 18, rx: 6, transform: 'rotate(-35 88 75)' }, 'white', { accent: true }),
    ...person(44, 140, 'green', { h: 40, w: 26, r: 11 })
  ],
  aviador: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('circle', { cx: 80, cy: 76, r: 36 }, 'skin'),
    s('path', { d: 'M44 74q0-42 36-42t36 42q-8-24-36-24t-36 24zM44 74l-6 30h12zM116 74l6 30h-12z' }, 'brown', { accent: true }),
    s('path', { d: ring(66, 64, 10) + ring(94, 64, 10), ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M76 64h8M68 92q12 8 24 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 118q32 12 64 0l8 24H40z' }, 'white')
  ],
  baluarte: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 136h132v10H14z' }, 'green'),
    s('path', { d: 'M24 136V70h12v-10h12v10h12v-10h12v10h16v-10h12v10h12v-10h12v10h12v66z' }, 'gray', { accent: true }),
    s('path', { d: 'M58 136v-26a22 22 0 0 1 44 0v26z' }, 'dark'),
    s('path', { d: 'M80 60V26', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 26h20l-5 7 5 7H82z' }, 'red')
  ],
  barriada: [
    s('path', { d: 'M14 146V100q66-50 132-40v86z' }, 'tan'),
    s('path', { d: 'M24 112h20v20H24zM50 100h22v24H50zM78 88h20v22H78zM104 76h22v22h-22zM40 132h24v14H40zM74 120h22v26H74zM104 108h24v30h-24z' }, 'orange', { accent: true }),
    s('path', { d: 'M22 112l12-8 12 8M48 100l13-8 13 8M76 88l12-8 12 8M102 76l13-8 13 8M38 132l14-8 14 8M72 120l13-8 13 8M102 108l14-8 14 8', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: dots([[34, 120], [61, 110], [88, 96], [115, 86], [85, 132], [116, 120]], 3) }, 'dark')
  ],
  bermejo: [
    s('path', { d: 'M24 120q-14-50 26-78q40-24 74 4q24 24 10 54q-8 18-28 10t-30 14q-14 16-30 10q-14-4-22-14z' }, 'red', { accent: true }),
    s('path', { d: 'M40 70q30-30 70-10', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: dots([[106, 120]], 8) + drop(60, 134, 5) }, 'red'),
    s('path', { d: 'M136 18l-30 46', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M108 58l-6 12 10-4z' }, 'red')
  ],
  bobina: [
    s('rect', { x: 26, y: 70, width: 108, height: 20, rx: 4 }, 'gray'),
    s('path', { d: Array.from({ length: 9 }, (_, i) => `M${40 + i * 10} 60v40`).join(''), ...SW(8) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M40 100q-10 20-24 26M120 100q10 20 24 26', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M74 36l-6 12h8l-6 12', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[16, 126], [144, 126]], 5) }, 'red')
  ],
  borrego: [
    ground(),
    s('path', { d: 'M24 108v28M38 110v26M120 116v20M132 114v22', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: ells([[34, 96, 22, 16], [26, 86, 10, 10], [42, 84, 10, 10]]) + ells([[124, 106, 16, 12], [118, 98, 8, 8], [130, 98, 8, 8]]) }, 'cream'),
    s('path', { d: ells([[60, 92, 9, 10], [142, 100, 7, 8]]) }, 'gray', { accent: true }),
    s('path', { d: 'M56 60h20M70 54l6 6-6 6M90 60h16M100 54l6 6-6 6', ...SW(3) }, 'orange', { stroke: true })
  ],
  cacerola: [
    s('path', { d: 'M30 74h100v46q0 16-16 16H46q-16 0-16-16z' }, 'red', { accent: true }),
    s('path', { d: 'M30 82H14M130 82h16', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M26 74q54-26 108 0z' }, 'gray'),
    s('rect', { x: 70, y: 50, width: 20, height: 10, rx: 4 }, 'dark'),
    s('path', { d: 'M60 40q-6-8 0-16M100 40q-6-8 0-16', ...SW(3) }, 'gray', { stroke: true })
  ],
  campestre: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 100q40-30 70-6t62-10v62H14z' }, 'green'),
    s('path', { d: 'M14 120q60-20 132 0v26H14z' }, 'yellow', { accent: true }),
    s('path', { d: 'M92 94V70l14-12 14 12v24z' }, 'red'),
    s('circle', { cx: 40, cy: 40, r: 12 }, 'yellow'),
    s('path', { d: 'M24 132l10-6M50 128l10-6M80 132l10-6M112 130l10-6', ...SW(3) }, 'orange', { stroke: true })
  ],
  capataz: [
    ground(),
    ...person(60, 136, 'orange', { h: 50 }),
    s('path', { d: 'M44 64q0-18 16-18t16 18z' }, 'yellow', { accent: true }),
    s('path', { d: 'M40 64h40', ...SW(4) }, 'yellow', { stroke: true }),
    s('rect', { x: 76, y: 92, width: 24, height: 30, rx: 2 }, 'brown'),
    s('path', { d: 'M48 96l-18-22', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M108 136V92h30v44M108 104h30M108 118h30', ...SW(4) }, 'gray', { stroke: true })
  ],
  carrizo: [
    s('path', { d: 'M14 124q16-6 33 0t33 0t33 0t33 0v22H14z' }, 'blue'),
    s('path', { d: 'M48 130V40M68 132V28M88 130V44M108 132V34', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: ells([[48, 40, 5, 14], [68, 28, 5, 14], [88, 44, 5, 14], [108, 34, 5, 14]]) }, 'brown', { accent: true }),
    s('path', { d: leaflet(48, 100, -140, 30, 5) + leaflet(88, 96, -40, 30, 5) + leaflet(108, 104, -30, 26, 5) }, 'mint')
  ],
  'chelín': [
    s('circle', { cx: 70, cy: 74, r: 50 }, 'gray', { accent: true }),
    s('circle', { cx: 70, cy: 74, r: 40 }, 'white'),
    s('path', { d: ring(70, 74, 40), ...DASH(3, '3 5') }, 'gray', { stroke: true }),
    s('path', { d: 'M56 102q-6-24 6-34q-10-14 4-24q14-4 18 8l-6 4q8 10 0 20l8 26z' }, 'gray'),
    s('circle', { cx: 118, cy: 122, r: 22 }, 'yellow'),
    s('circle', { cx: 118, cy: 122, r: 14 }, 'orange')
  ],
  'clítoris': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'cream'),
    s('path', { d: leaflet(80, 126, -90, 96, 30) }, 'pink'),
    s('path', { d: leaflet(80, 120, -90, 76, 14) }, 'red'),
    s('circle', { cx: 80, cy: 46, r: 9 }, 'pink', { accent: true }),
    s('path', { d: 'M80 32v-8', ...SW(4) }, 'red', { stroke: true })
  ],
  consistorio: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('rect', { x: 20, y: 76, width: 120, height: 60 }, 'cream'),
    s('rect', { x: 64, y: 34, width: 32, height: 42 }, 'tan'),
    s('path', { d: 'M60 34l20-18 20 18z' }, 'red'),
    s('circle', { cx: 80, cy: 52, r: 10 }, 'white', { accent: true }),
    s('path', { d: 'M80 46v6h5', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: rects([[28, 90, 12, 18], [48, 90, 12, 18], [100, 90, 12, 18], [120, 90, 12, 18], [70, 104, 20, 32]]) }, 'navy'),
    s('path', { d: 'M14 136h132', ...SW(6) }, 'gray', { stroke: true })
  ],
  converger: [
    arrow('M22 22l44 44M66 48v18H48', 'blue', 6),
    arrow('M138 22l-44 44M94 48v18h18', 'red', 6),
    arrow('M22 138l44-44M66 112V94H48', 'green', 6),
    arrow('M138 138l-44-44M94 112V94h18', 'orange', 6),
    s('circle', { cx: 80, cy: 80, r: 9 }, 'purple', { accent: true })
  ],
  cristalino: [
    s('path', { d: 'M44 30h72l-8 108H52z' }, 'sky', { accent: true }),
    s('path', { d: 'M48 56h64l-6 82H54z' }, 'blue'),
    s('path', { d: 'M44 30h72l-8 108H52z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 70v50', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: sparkle(128, 40, 10) + sparkle(30, 80, 7) }, 'yellow')
  ],
  crucifijo: [
    s('path', { d: 'M40 18q40 60 80 0', ...DASH(3, '2 4') }, 'gray', { stroke: true }),
    s('path', { d: 'M74 50h12v26h22v12H86v52H74V88H52V76h22z' }, 'brown', { accent: true }),
    s('path', { d: 'M80 84v34M62 80l18 8 18-8', ...SW(4) }, 'tan', { stroke: true }),
    s('circle', { cx: 80, cy: 74, r: 4 }, 'tan')
  ],
  culminante: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 146l66-100 66 100z' }, 'gray'),
    s('path', { d: 'M62 74l18-28 18 28-10-6-8 8-8-8z' }, 'white'),
    s('path', { d: 'M80 46V16', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 16h22l-6 7 6 7H82z' }, 'red', { accent: true }),
    s('path', { d: sparkle(118, 50, 7) + sparkle(36, 38, 6) }, 'yellow')
  ],
  demoler: [
    ground(),
    s('path', { d: 'M86 136V60h44v76zM86 60l10 12-6 10' }, 'tan'),
    s('path', { d: grid(94, 72, 3, 4, 8, 10, 12, 16) }, 'navy'),
    s('path', { d: 'M30 14l14 70', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 52, cy: 92, r: 20 }, 'dark', { accent: true }),
    s('path', { d: 'M74 80l-6-6M76 96h-8M74 110l-6 6', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M78 132l6-8 6 8zM74 120l6-6 4 6z' }, 'gray')
  ],
  densamente: [
    s('path', { d: dots(Array.from({ length: 30 }, (_, k) => [26 + (k % 6) * 22 + (Math.floor(k / 6) % 2) * 11, 36 + Math.floor(k / 6) * 22]), 9) }, 'blue', { accent: true }),
    s('path', { d: dots(Array.from({ length: 30 }, (_, k) => [26 + (k % 6) * 22 + (Math.floor(k / 6) % 2) * 11, 36 + Math.floor(k / 6) * 22]).filter((_, k) => k % 4 === 1), 9) }, 'orange'),
    s('path', { d: 'M14 146h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  deparar: [
    s('path', { d: 'M48 136l8-22h48l8 22z' }, 'brown'),
    s('circle', { cx: 80, cy: 74, r: 44 }, 'purple', { accent: true }),
    s('circle', { cx: 80, cy: 74, r: 34 }, 'sky'),
    s('path', { d: star(80, 74, 14) }, 'yellow'),
    s('path', { d: sparkle(62, 54, 6) + sparkle(100, 92, 5) + sparkle(130, 30, 8) }, 'white'),
    s('path', { d: 'M58 50q10-14 26-12', ...SW(4) }, 'white', { stroke: true })
  ],
  derramamiento: [
    s('path', { d: 'M28 130q-10-14 24-18t50-4q34 4 30 18q-4 12-50 12t-54-8z' }, 'red', { accent: true }),
    s('rect', { x: 28, y: 76, width: 34, height: 48, rx: 4, transform: 'rotate(-70 45 100)' }, 'white'),
    s('rect', { x: 28, y: 76, width: 34, height: 48, rx: 4, transform: 'rotate(-70 45 100)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: drop(110, 70, 6) + drop(126, 92, 5) }, 'red'),
    ground(146)
  ],
  desfilar: [
    ground(),
    ...person(30, 136, 'blue', { h: 40, w: 22, r: 10 }),
    ...person(64, 136, 'blue', { h: 40, w: 22, r: 10 }),
    ...person(98, 136, 'blue', { h: 40, w: 22, r: 10 }),
    s('path', { d: 'M132 136V30', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M134 30h12v26h-12z' }, 'red', { accent: true }),
    s('path', { d: 'M22 58h16M56 58h16M90 58h16', ...SW(5) }, 'red', { stroke: true })
  ],
  'deshidratación': [
    s('circle', { cx: 120, cy: 34, r: 16 }, 'yellow'),
    s('path', { d: rays(120, 34, 20, 28, 8), ...SW(3) }, 'orange', { stroke: true }),
    ground(),
    ...person(60, 136, 'red', { h: 42 }),
    s('path', { d: drop(76, 62, 3) + drop(44, 70, 3) }, 'sky'),
    s('path', { d: 'M96 136v-34h16v34z' }, 'white'),
    s('path', { d: 'M96 136v-34h16v34zM100 102v-8h8v8', ...SW(3) }, 'blue', { stroke: true, accent: true })
  ],
  'desolación': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'gray'),
    s('path', { d: 'M14 112q66-12 132 0v34H14z' }, 'tan'),
    s('path', { d: 'M100 116V56M100 76l-16-14M100 66l14-18M100 90l14-8', ...SW(5) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: dots([[46, 92]], 6) }, 'dark'),
    s('path', { d: 'M40 116v-16q0-6 6-6t6 6v16z' }, 'dark'),
    s('path', { d: birds([[60, 40]]), ...SW(3) }, 'dark', { stroke: true })
  ],
  'dramáticamente': [
    s('path', { d: 'M22 22v114h118', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 50l26 6 18-10 14 6 30 72', ...SW(7) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M108 128l12 6 4-14', ...SW(7) }, 'red', { stroke: true }),
    s('path', { d: burst(118, 60, 18, 8) }, 'yellow')
  ],
  edema: [
    s('path', { d: 'M54 14v70q0 18 10 28l-10 18q-4 14 12 14h66q8 0 8-10q0-14-28-20q-6-10-8-24V14z' }, 'skin'),
    s('path', { d: ells([[78, 110, 26, 18]]) }, 'pink', { accent: true }),
    s('path', { d: 'M40 102l-12-4M40 116H26M118 98l12-6', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M76 108v6', ...SW(3) }, 'red', { stroke: true })
  ],
  elegible: [
    ground(),
    ...person(52, 136, 'blue', { h: 46 }),
    s('circle', { cx: 112, cy: 60, r: 26 }, 'green', { accent: true }),
    s('path', { d: 'M100 60l9 9 16-18', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M90 86l-14 10', ...SW(3) }, 'gray', { stroke: true })
  ],
  eminente: [
    s('circle', { cx: 80, cy: 60, r: 50 }, 'yellow'),
    s('path', { d: laurel(80, 60, 40) }, 'green'),
    s('path', { d: busts([80], 136, 52, 60) }, 'navy', { accent: true }),
    s('circle', { cx: 80, cy: 58, r: 20 }, 'skin'),
    s('path', { d: star(80, 18, 8) }, 'orange')
  ],
  enjambre: [
    s('path', { d: 'M24 14v20', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: ells([[24, 44, 12, 10], [24, 60, 16, 10], [24, 76, 13, 9]]) }, 'orange'),
    s('path', { d: ells(BEES.map(([x, y]) => [x, y, 9, 6])) }, 'yellow', { accent: true }),
    s('path', { d: BEES.map(([x, y]) => `M${x - 2} ${y - 5}v10M${x + 3} ${y - 5}v10`).join(''), ...SW(2.5) }, 'dark', { stroke: true }),
    s('path', { d: ells(BEES.map(([x, y]) => [x - 1, y - 8, 5, 4])) }, 'sky')
  ],
  ensuciar: [
    s('path', { d: 'M50 24l-30 18 10 22 14-6v78h72V58l14 6 10-22-30-18q-10 12-30 12t-30-12z' }, 'white'),
    s('path', { d: 'M50 24l-30 18 10 22 14-6v78h72V58l14 6 10-22-30-18q-10 12-30 12t-30-12z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 74q10-10 20 0t14 12q-4 14-18 10t-22-6q-4-10 6-16z' + ells([[100, 112, 8, 6], [62, 118, 5, 4]]) }, 'brown', { accent: true }),
    s('path', { d: drop(110, 84, 4) }, 'brown')
  ],
  entredicho: [
    ...paper(22, 26, 80, 104),
    s('path', { d: 'M34 46h56M34 60h56M34 74h40', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 96q7-6 14 0t14 0t14 0t14 0', ...SW(3) }, 'red', { stroke: true }),
    s('circle', { cx: 104, cy: 76, r: 22 }, 'sky'),
    s('path', { d: ring(104, 76, 22) + 'M120 92l20 24', ...SW(7) }, 'orange', { stroke: true, accent: true })
  ],
  envoltura: [
    s('path', { d: 'M46 80l-30-22v44zM114 80l30-22v44z' }, 'purple'),
    s('rect', { x: 40, y: 56, width: 80, height: 48, rx: 22 }, 'purple', { accent: true }),
    s('path', { d: 'M56 60l-12 40M80 58l-12 44M104 60l-12 42', ...SW(5) }, 'pink', { stroke: true }),
    s('path', { d: sparkle(34, 30, 7) + sparkle(130, 130, 6) }, 'yellow')
  ],
  expedir: [
    s('rect', { x: 26, y: 24, width: 72, height: 100, rx: 6 }, 'navy', { accent: true }),
    s('circle', { cx: 62, cy: 66, r: 18 }, 'yellow'),
    s('path', { d: 'M44 66h36M62 48q-10 18 0 36q10-18 0-36', ...SW(2) }, 'navy', { stroke: true }),
    s('path', { d: 'M44 100h36', ...SW(4) }, 'yellow', { stroke: true }),
    s('rect', { x: 100, y: 88, width: 30, height: 14, rx: 3 }, 'red'),
    s('path', { d: 'M115 88V70', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 115, cy: 64, r: 9 }, 'brown')
  ],
  'factoría': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M18 136V84l30-18v18l30-18v18l30-18v70z' }, 'gray', { accent: true }),
    s('rect', { x: 112, y: 40, width: 18, height: 96 }, 'red'),
    s('path', { d: ells([[124, 30, 10, 8], [136, 20, 8, 6]]) }, 'white'),
    s('path', { d: rects([[30, 100, 14, 14], [60, 100, 14, 14], [90, 100, 14, 14]]) }, 'yellow'),
    s('path', { d: 'M14 136h132', ...SW(6) }, 'dark', { stroke: true })
  ],
  femenil: [
    ground(),
    ...lady(60, 136, 'purple', { accent: true }),
    s('path', { d: 'M74 116l20 6', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 112, cy: 120, r: 16 }, 'white'),
    s('path', { d: ring(112, 120, 16) + 'M106 114l6-4 6 4-2 7h-8z', ...SW(3) }, 'dark', { stroke: true })
  ],
};
