// Illustration specs for words still undrawn in batches 0073–0074 (see server/scripts/lexicon/art.js)
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
  'pavón': [
    s('path', { d: wedge(80, 104, 64, 180, 360) }, 'green'),
    s('path', { d: dots([200, 223, 247, 270, 293, 317, 340].map(a => around(80, 104, 50, 1, a)[0]), 8) }, 'blue'),
    s('path', { d: dots([200, 223, 247, 270, 293, 317, 340].map(a => around(80, 104, 50, 1, a)[0]), 3.5) }, 'yellow'),
    s('path', { d: 'M74 120v16M86 120v16', ...SW(4) }, 'orange', { stroke: true }),
    s('ellipse', { cx: 80, cy: 106, rx: 13, ry: 18 }, 'navy', { accent: true }),
    s('circle', { cx: 80, cy: 82, r: 9 }, 'blue'),
    s('path', { d: 'M88 81l9 3-9 3z' }, 'orange'),
    s('path', { d: 'M80 72v-10M76 72l-4-8M84 72l4-8', ...SW(2) }, 'navy', { stroke: true })
  ],
  pesquero: [
    s('rect', { x: 14, y: 112, width: 132, height: 34, rx: 6 }, 'blue'),
    s('path', { d: 'M50 92V30M50 34l40 20', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M90 54l-12 36M90 54l2 36M90 54l14 36M80 72h22M78 84h28', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 66, y: 66, width: 34, height: 26, rx: 3 }, 'cream'),
    s('rect', { x: 74, y: 72, width: 18, height: 10, rx: 2 }, 'sky'),
    s('path', { d: 'M22 92h116l-16 28H38z' }, 'red', { accent: true }),
    s('path', { d: 'M24 134q8-4 16 0M100 136q8-4 16 0', ...SW(3) }, 'white', { stroke: true })
  ],
  'pingüino': [
    s('ellipse', { cx: 80, cy: 88, rx: 36, ry: 50 }, 'black'),
    s('ellipse', { cx: 80, cy: 98, rx: 23, ry: 36 }, 'white'),
    s('path', { d: dots([[70, 62], [90, 62]], 4) }, 'white'),
    s('path', { d: dots([[71, 62], [89, 62]], 2) }, 'dark'),
    s('path', { d: 'M72 70h16l-8 10z' }, 'orange', { accent: true }),
    s('path', { d: ells([[66, 138, 12, 5], [94, 138, 12, 5]]) }, 'orange')
  ],
  poro: [
    backdrop('skin'),
    s('path', { d: dots([[40, 44], [84, 36], [124, 52], [56, 84], [104, 92], [36, 120], [80, 126], [126, 122]], 7) }, 'tan'),
    s('path', { d: dots([[40, 44], [84, 36], [124, 52], [56, 84], [104, 92], [36, 120], [80, 126], [126, 122]], 3) }, 'brown'),
    s('path', { d: drop(104, 70, 9) }, 'sky', { accent: true }),
    s('path', { d: 'M56 84q-6-20 4-34', ...SW(3) }, 'dark', { stroke: true })
  ],
  postulado: [
    s('path', { d: 'M40 116v20M120 116v20', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 18, y: 28, width: 124, height: 90, rx: 4 }, 'brown'),
    s('rect', { x: 25, y: 35, width: 110, height: 76, rx: 2 }, 'green'),
    s('path', { d: 'M34 58h92', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M34 88h92', ...DASH(3) }, 'white', { stroke: true }),
    s('path', { d: dots([[60, 58], [100, 58], [80, 88]], 6) }, 'yellow', { accent: true })
  ],
  prolongar: [
    s('rect', { x: 18, y: 60, width: 64, height: 36, rx: 6 }, 'blue', { accent: true }),
    s('rect', { x: 84, y: 60, width: 56, height: 36, rx: 6, ...DASH(4) }, 'blue', { stroke: true }),
    arrow('M30 118h100M118 106l12 12-12 12'),
    s('path', { d: 'M18 40h20M38 32v16', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M122 40h20M122 32v16', ...SW(4) }, 'gray', { stroke: true })
  ],
  'póster': [
    s('rect', { x: 32, y: 18, width: 96, height: 124, rx: 3 }, 'white'),
    outline({ x: 32, y: 18, width: 96, height: 124, rx: 3 }),
    s('rect', { x: 40, y: 26, width: 80, height: 82 }, 'sky'),
    s('path', { d: 'M40 108l26-38 16 20 14-14 24 32z' }, 'green'),
    s('circle', { cx: 100, cy: 46, r: 10 }, 'yellow', { accent: true }),
    s('path', { d: 'M48 120h64M56 130h48', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[26, 14, 16, 8], [118, 14, 16, 8]]) }, 'tan')
  ],
  quimioterapia: [
    s('path', { d: 'M50 22v114M36 136h28M42 22h16', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 30, y: 30, width: 40, height: 46, rx: 8 }, 'white'),
    outline({ x: 30, y: 30, width: 40, height: 46, rx: 8 }),
    s('rect', { x: 35, y: 48, width: 30, height: 23, rx: 5 }, 'orange', { accent: true }),
    s('path', { d: 'M50 76v12q0 24 48 22', ...SW(3) }, 'gray', { stroke: true }),
    ...person(112, 136, 'mint', { h: 44, w: 30, r: 12 }),
    s('path', { d: 'M98 110l-6 10', ...SW(7) }, 'skin', { stroke: true })
  ],
  'radiografía': [
    s('rect', { x: 20, y: 12, width: 120, height: 136, rx: 8 }, 'sky', { accent: true }),
    s('rect', { x: 28, y: 20, width: 104, height: 120, rx: 4 }, 'black'),
    s('path', { d: 'M80 30v100', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M80 52q-30-4-40 16M80 52q30-4 40 16M80 70q-28-4-38 16M80 70q28-4 38 16M80 88q-26-4-34 14M80 88q26-4 34 14', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M48 38q16 6 32 4q16 2 32-4', ...SW(4) }, 'gray', { stroke: true })
  ],
  razonablemente: [
    ...person(54, 136, 'blue', { h: 44, w: 30, r: 13 }),
    s('path', { d: dots([[72, 70], [80, 62]], 4) }, 'sky'),
    s('ellipse', { cx: 108, cy: 42, rx: 34, ry: 26 }, 'sky'),
    s('path', { d: 'M94 42l10 10 18-20', ...SW(7) }, 'green', { stroke: true, accent: true })
  ],
  'reclusión': [
    ground(),
    s('path', { d: 'M14 136q8-92 66-98q58 6 66 98z' }, 'brown'),
    s('path', { d: 'M50 136q2-50 30-52q28 2 30 52z' }, 'dark'),
    ...person(80, 136, 'tan', { h: 24, w: 18, r: 8, accent: true }),
    s('path', { d: drop(98, 124, 4) }, 'orange')
  ],
  rectangular: [
    s('rect', { x: 22, y: 44, width: 116, height: 72 }, 'orange', { accent: true }),
    s('path', { d: 'M22 58h14V44M124 44v14h14M22 102h14v14M124 116v-14h14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M22 30h116M22 24v12M138 24v12', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M146 44v72M140 44h12M140 116h12', ...SW(3) }, 'gray', { stroke: true })
  ],
  remontar: [
    s('rect', { x: 96, y: 40, width: 50, height: 106 }, 'gray'),
    s('rect', { x: 96, y: 34, width: 50, height: 12, rx: 3 }, 'blue'),
    s('path', { d: 'M84 40h16v80H84z' }, 'sky'),
    s('rect', { x: 14, y: 116, width: 132, height: 30, rx: 4 }, 'blue'),
    s('ellipse', { cx: 62, cy: 74, rx: 20, ry: 9, transform: 'rotate(-55 62 74)' }, 'orange', { accent: true }),
    s('path', { d: 'M52 90l-16 4 10 12z' }, 'orange'),
    s('path', { d: 'M30 112q6-34 24-56', ...DASH(3) }, 'gray', { stroke: true })
  ],
  rumano: [
    s('path', { d: 'M26 20v122', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 28, y: 24, width: 36, height: 74 }, 'navy'),
    s('rect', { x: 64, y: 24, width: 36, height: 74 }, 'yellow', { accent: true }),
    s('rect', { x: 100, y: 24, width: 36, height: 74 }, 'red'),
    outline({ x: 28, y: 24, width: 108, height: 74 })
  ],
  'secesión': [
    s('path', { d: wedge(68, 80, 50, 30, 330) }, 'green'),
    s('path', { d: wedge(84, 80, 50, -30, 30) }, 'orange', { accent: true }),
    arrow('M104 120l24 14M118 120l12 14-14 2', 'red', 4),
    s('path', { d: 'M68 80l43-25M68 80l43 25', ...SW(3) }, 'white', { stroke: true })
  ],
  secuaz: [
    ground(),
    ...person(58, 136, 'black', { h: 58, w: 36, r: 15 }),
    s('path', { d: 'M40 48h36M46 48V32h24v16z', ...SW(4) }, 'dark', { stroke: true }),
    ...person(102, 136, 'purple', { h: 34, w: 20, r: 9, accent: true }),
    ...person(130, 136, 'purple', { h: 34, w: 20, r: 9 })
  ],
  silenciar: [
    s('path', { d: 'M98 60q12 20 0 40M114 48q20 32 0 64', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 62h24l32-28v92L48 98H24z' }, 'dark'),
    s('path', { d: 'M22 30l116 100', ...SW(9) }, 'red', { stroke: true, accent: true })
  ],
  sintaxis: [
    s('path', { d: 'M80 40L44 64M80 40l36 24M44 84L27 108M44 84l15 24M116 84l-15 24M116 84l17 24', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 60, y: 20, width: 40, height: 22, rx: 6 }, 'purple', { accent: true }),
    s('path', { d: rects([[26, 64, 36, 20], [98, 64, 36, 20]]) }, 'blue'),
    s('path', { d: rects([[14, 108, 26, 20], [88, 108, 26, 20]]) }, 'green'),
    s('path', { d: rects([[46, 108, 26, 20], [120, 108, 26, 20]]) }, 'orange')
  ],
  'sujeción': [
    s('rect', { x: 24, y: 70, width: 112, height: 12, rx: 2 }, 'tan'),
    s('rect', { x: 24, y: 82, width: 112, height: 12, rx: 2 }, 'brown'),
    s('path', { d: 'M76 50h46v66H76', ...SW(10) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M86 30v34M74 30h24', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 78, y: 62, width: 16, height: 8, rx: 2 }, 'dark'),
    s('rect', { x: 78, y: 94, width: 16, height: 8, rx: 2 }, 'dark')
  ],
  tangible: [
    s('path', { d: 'M76 62l16-16h50l-16 16z' }, 'yellow'),
    s('path', { d: 'M126 62l16-16v52l-16 16z' }, 'brown'),
    s('rect', { x: 76, y: 62, width: 50, height: 52 }, 'orange', { accent: true }),
    s('path', { d: 'M14 96h36', ...SW(20) }, 'skin', { stroke: true }),
    s('path', { d: 'M50 90h22', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M64 74l-6-8M64 106l-6 8', ...SW(3) }, 'gray', { stroke: true })
  ],
  toxicidad: [
    s('rect', { x: 68, y: 18, width: 24, height: 10, rx: 3 }, 'brown'),
    s('rect', { x: 70, y: 26, width: 20, height: 18 }, 'gray'),
    s('rect', { x: 42, y: 42, width: 76, height: 98, rx: 16 }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 90, r: 26 }, 'white'),
    s('path', { d: ells([[80, 86, 13, 12]]) + 'M72 94h16v10H72z' }, 'dark'),
    s('path', { d: dots([[75, 86], [85, 86]], 3.5) }, 'white')
  ],
  transportista: [
    ground(132),
    s('rect', { x: 14, y: 52, width: 84, height: 62, rx: 3 }, 'orange', { accent: true }),
    s('path', { d: 'M100 72h26l18 22v20h-44z' }, 'red'),
    s('path', { d: 'M106 78h18l12 14h-30z' }, 'sky'),
    s('circle', { cx: 116, cy: 86, r: 6 }, 'skin'),
    s('path', { d: dots([[34, 118], [72, 118], [124, 118]], 10) }, 'dark')
  ],
  'térmico': [
    s('rect', { x: 68, y: 18, width: 24, height: 96, rx: 12 }, 'white'),
    outline({ x: 68, y: 18, width: 24, height: 96, rx: 12 }),
    s('rect', { x: 75, y: 46, width: 10, height: 72, rx: 5 }, 'red'),
    s('circle', { cx: 80, cy: 122, r: 18 }, 'red', { accent: true }),
    s('path', { d: 'M114 54q8 8 0 16q-8 8 0 16q8 8 0 16M128 46q8 8 0 16q-8 8 0 16q8 8 0 16M46 54q8 8 0 16q-8 8 0 16q8 8 0 16M32 46q8 8 0 16q-8 8 0 16q8 8 0 16', ...SW(4) }, 'orange', { stroke: true })
  ],
  viceministro: [
    ground(),
    ...person(60, 136, 'navy', { h: 56, w: 36, r: 15 }),
    s('path', { d: 'M60 80l-5 14 5 22 5-22z' }, 'gray'),
    ...person(110, 136, 'dark', { h: 46, w: 30, r: 12 }),
    s('path', { d: 'M110 90l-4 12 4 18 4-18z' }, 'red', { accent: true }),
    s('rect', { x: 124, y: 112, width: 18, height: 14, rx: 2 }, 'brown')
  ],
  vocalista: [
    ...person(62, 136, 'purple', { h: 48, w: 32, r: 13, accent: true }),
    s('path', { d: 'M100 136V74M88 136h24', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M74 98l18-26', ...SW(7) }, 'skin', { stroke: true }),
    s('ellipse', { cx: 92, cy: 66, rx: 6, ry: 9, transform: 'rotate(30 92 66)' }, 'dark'),
    ...note(118, 52, 'blue'),
    ...note(132, 92, 'pink')
  ],
  volador: [
    s('rect', { x: 14, y: 118, width: 132, height: 28, rx: 4 }, 'blue'),
    s('path', { d: 'M30 120q30-90 108-60', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M72 66l-4-38 30 34z' }, 'sky'),
    s('ellipse', { cx: 84, cy: 72, rx: 32, ry: 12, transform: 'rotate(-12 84 72)' }, 'navy', { accent: true }),
    s('path', { d: 'M54 80l-20-6 8 24z' }, 'navy'),
    s('circle', { cx: 104, cy: 66, r: 3 }, 'white'),
    s('path', { d: drop(38, 112, 3) + drop(48, 106, 3) }, 'sky')
  ],
  'víveres': [
    s('ellipse', { cx: 50, cy: 80, rx: 24, ry: 12 }, 'tan'),
    s('rect', { x: 76, y: 52, width: 26, height: 38, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M110 90V54l4-8v-8h8v8l4 8v36z' }, 'sky'),
    s('rect', { x: 22, y: 86, width: 116, height: 50, rx: 3 }, 'brown'),
    s('path', { d: 'M22 104h116M22 120h116', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 76l6-4M52 78l6-4', ...SW(2) }, 'brown', { stroke: true })
  ],
  abordaje: [
    s('rect', { x: 14, y: 120, width: 132, height: 26, rx: 4 }, 'blue'),
    s('path', { d: 'M40 104V40M120 104V40', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M42 44l26 26H42zM118 44l-26 26h26z' }, 'yellow'),
    s('path', { d: 'M14 104h58l-8 22H22zM88 104h58l-8 22H96z' }, 'brown'),
    s('path', { d: 'M66 102h28', ...SW(4) }, 'tan', { stroke: true }),
    ...person(80, 100, 'red', { h: 24, w: 16, r: 8, accent: true })
  ],
  acatar: [
    ground(),
    ...person(72, 136, 'green', { h: 50, w: 32, r: 13 }),
    s('path', { d: 'M58 66q14-18 28 0z' }, 'navy'),
    s('path', { d: 'M56 66h34', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 94l16-14-12-12', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 124, cy: 48, r: 16 }, 'yellow', { accent: true }),
    s('path', { d: 'M117 48l5 5 9-10', ...SW(4) }, 'white', { stroke: true })
  ],
  acidez: [
    s('circle', { cx: 60, cy: 70, r: 42 }, 'yellow', { accent: true }),
    s('circle', { cx: 60, cy: 70, r: 34 }, 'cream'),
    s('path', { d: rays(60, 70, 6, 32, 8, 22.5), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M104 92h34l-5 46h-24z' }, 'white'),
    s('path', { d: 'M107 112h28l-3 26h-22z' }, 'green'),
    s('path', { d: 'M104 92h34l-5 46h-24z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[116, 104], [126, 98], [120, 84]], 3) }, 'mint')
  ],
  acre: [
    s('path', { d: 'M36 64q8-14 22-8q42 14 64 70q2 10-8 8Q56 116 36 64z' }, 'red', { accent: true }),
    s('path', { d: 'M38 62q-6-14 4-26', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M90 60q8-8 0-16q-8-8 0-16M108 66q8-8 0-16q-8-8 0-16M126 72q8-8 0-16q-8-8 0-16', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M52 72q14 8 26 26', ...SW(3) }, 'pink', { stroke: true })
  ],
  adversidad: [
    s('path', { d: ells([[56, 30, 26, 14], [90, 26, 30, 16], [116, 34, 20, 12]]) }, 'dark'),
    s('path', { d: 'M108 40l-10 18h10l-8 18', ...SW(4) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M30 52l-6 12M40 60l-6 12M130 58l-6 12M138 76l-6 12M28 90l-6 12', ...SW(3) }, 'sky', { stroke: true }),
    ...person(80, 136, 'blue', { h: 36, w: 28, r: 12 }),
    s('path', { d: 'M50 66q30-32 60 0z' }, 'red'),
    s('path', { d: 'M80 66v28', ...SW(3) }, 'dark', { stroke: true })
  ],
  altiplano: [
    backdrop('sky'),
    s('circle', { cx: 120, cy: 36, r: 12 }, 'yellow', { accent: true }),
    s('path', { d: 'M14 146V86l20-28h92l20 28v60z' }, 'brown'),
    s('path', { d: 'M34 58h92l6 8H28z' }, 'green'),
    s('path', { d: ells([[32, 100, 16, 7], [128, 108, 16, 7]]) }, 'white')
  ],
  ancla: [
    s('path', { d: ring(80, 30, 10) + 'M80 40v94M58 56h44', ...SW(9) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M34 100q4 34 46 36q42-2 46-36', ...SW(9) }, 'navy', { stroke: true }),
    s('path', { d: 'M22 106l12-18 12 18zM114 106l12-18 12 18z' }, 'navy')
  ],
  azulejo: [
    s('rect', { x: 20, y: 20, width: 120, height: 120, rx: 4 }, 'cream'),
    s('path', { d: [[50, 50], [110, 50], [50, 110], [110, 110]].map(([x, y]) => `M${x} ${y - 22}l22 22-22 22-22-22z`).join('') }, 'blue', { accent: true }),
    s('path', { d: dots([[50, 50], [110, 50], [50, 110], [110, 110]], 8) }, 'yellow'),
    s('path', { d: dots([[20, 20], [80, 20], [140, 20], [20, 80], [80, 80], [140, 80], [20, 140], [80, 140], [140, 140]].filter(([x, y]) => x > 20 && x < 140 && y > 20 && y < 140), 9) }, 'navy'),
    s('path', { d: 'M80 20v120M20 80h120', ...SW(3) }, 'navy', { stroke: true }),
    s('rect', { x: 20, y: 20, width: 120, height: 120, rx: 4, ...SW(4) }, 'navy', { stroke: true })
  ],
  bache: [
    s('rect', { x: 14, y: 56, width: 132, height: 84, rx: 4 }, 'gray'),
    s('path', { d: 'M24 76h20M64 76h20M104 76h20', ...SW(4) }, 'white', { stroke: true }),
    s('ellipse', { cx: 66, cy: 110, rx: 34, ry: 13 }, 'dark'),
    s('path', { d: 'M32 112l-10 6M100 106l12-6M66 123v10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M116 128l10-40h8l10 40z' }, 'orange', { accent: true }),
    s('path', { d: 'M121 108h18', ...SW(5) }, 'white', { stroke: true }),
    s('rect', { x: 110, y: 126, width: 40, height: 8, rx: 2 }, 'dark')
  ],
  'bastión': [
    ground(),
    s('path', { d: rects([[18, 84, 32, 52], [110, 84, 32, 52], [18, 74, 8, 12], [32, 74, 8, 12], [120, 74, 8, 12], [134, 74, 8, 12]]) }, 'gray'),
    s('path', { d: rects([[46, 52, 68, 84], [46, 38, 12, 16], [74, 38, 12, 16], [102, 38, 12, 16]]) }, 'gray'),
    s('path', { d: 'M66 136v-22a14 14 0 0 1 28 0v22z' }, 'dark'),
    s('path', { d: 'M80 38V14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 14l22 7-22 7z' }, 'red', { accent: true }),
    s('path', { d: rects([[58, 64, 8, 14], [94, 64, 8, 14]]) }, 'dark')
  ],
  'baúl': [
    s('rect', { x: 20, y: 70, width: 120, height: 64, rx: 4 }, 'brown'),
    s('path', { d: 'M20 72V58q0-26 26-26h68q26 0 26 26v14z' }, 'tan'),
    s('path', { d: 'M48 32v102M112 32v102', ...SW(8, { 'stroke-linecap': 'butt' }) }, 'dark', { stroke: true }),
    s('path', { d: 'M20 72h120', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 70, y: 64, width: 20, height: 22, rx: 3 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 76, r: 3 }, 'dark')
  ],
  bipolar: [
    s('path', { d: 'M80 30a50 50 0 0 0 0 100z' }, 'yellow'),
    s('path', { d: 'M80 30a50 50 0 0 1 0 100z' }, 'blue', { accent: true }),
    s('path', { d: dots([[60, 70], [100, 70]], 6) }, 'dark'),
    s('path', { d: 'M54 92q12 16 26 8M80 102q12-12 26-2', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: drop(110, 86, 5) }, 'sky'),
    s('path', { d: rays(36, 34, 8, 16, 6) , ...SW(3) }, 'orange', { stroke: true })
  ],
  bisexual: [
    s('path', { d: heart(56, 88, 26) }, 'pink'),
    s('path', { d: heart(104, 88, 26) }, 'blue'),
    s('path', { d: heart(80, 112, 16) }, 'purple', { accent: true }),
    s('path', { d: sparkle(30, 32, 8) + sparkle(130, 30, 8) }, 'yellow')
  ],
  'bitácora': [
    ...openBook(80, 76, 'white', 'brown'),
    s('path', { d: 'M38 94h32M38 106h32M38 118h26M90 94h32M90 106h32', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: ring(80, 40, 20) + rays(80, 40, 4, 30, 8), ...SW(5) }, 'navy', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 40, r: 6 }, 'yellow')
  ],
  bocado: [
    s('circle', { cx: 76, cy: 84, r: 54 }, 'tan', { accent: true }),
    s('path', { d: dots([[128, 50], [136, 78], [120, 30]], 16) }, 'white'),
    s('path', { d: dots([[54, 64], [80, 110], [52, 104], [92, 74], [100, 40]], 6) }, 'brown'),
    s('path', { d: dots([[132, 104], [140, 118], [124, 120]], 3) }, 'tan')
  ],
  'caché': [
    s('path', { d: 'M14 20l58 116H38zM146 20l-58 116h34z' }, 'cream'),
    s('path', { d: 'M62 136l10-64h16l10 64z' }, 'red'),
    s('path', { d: star(80, 46, 22) }, 'yellow', { accent: true }),
    s('path', { d: 'M34 136v-36M126 136v-36M34 104q14 10 26 0M100 104q14 10 26 0', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: rects([[14, 14, 16, 12], [130, 14, 16, 12]]) }, 'dark')
  ],
  cafetera: [
    s('path', { d: 'M48 136l6-46h48l6 46z' }, 'gray'),
    s('path', { d: 'M54 90l6-50h36l6 50z' }, 'gray'),
    s('rect', { x: 50, y: 84, width: 56, height: 10, rx: 2 }, 'dark'),
    s('path', { d: 'M60 40l-14-8M102 50q24 4 14 36', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 72, y: 30, width: 12, height: 10, rx: 3 }, 'dark'),
    s('path', { d: 'M40 24q-6-6 0-12M30 26q-6-6 0-12', ...SW(4) }, 'brown', { stroke: true, accent: true })
  ],
  'camarón': [
    s('path', { d: 'M104 40q36 34 4 70q-28 26-62 8', ...SW(26) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M120 56l-14 6M126 76l-16 2M120 96l-14-4M102 114l-8-10M80 124l-2-12', ...SW(3) }, 'cream', { stroke: true }),
    s('path', { d: 'M48 118l-24-10 4 26z' }, 'red'),
    s('path', { d: 'M100 34q8-20 40-22M96 38q-12-20 10-26', ...SW(3) }, 'red', { stroke: true }),
    s('circle', { cx: 104, cy: 38, r: 4 }, 'dark')
  ],
  camello: [
    backdrop('cream'),
    s('circle', { cx: 122, cy: 36, r: 12 }, 'yellow'),
    s('path', { d: 'M14 136q40-14 72-4t60-2v16H14z' }, 'tan'),
    s('path', { d: CAMEL, transform: 'translate(-13 -57) scale(1.5)' }, 'brown', { accent: true })
  ],
  cartelera: [
    s('path', { d: 'M40 106v32M120 106v32', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 14, y: 26, width: 132, height: 82, rx: 4 }, 'dark'),
    s('rect', { x: 22, y: 34, width: 34, height: 66, rx: 2 }, 'red'),
    s('rect', { x: 63, y: 34, width: 34, height: 66, rx: 2 }, 'blue', { accent: true }),
    s('rect', { x: 104, y: 34, width: 34, height: 66, rx: 2 }, 'yellow'),
    s('path', { d: star(39, 56, 9) + 'M66 92l14-22 14 22z' + ells([[121, 58, 9, 9]]) }, 'white')
  ],
  catalizador: [
    s('path', { d: 'M64 20h28v34l26 60q4 20-16 20H54q-20 0-16-20l26-60z' }, 'white'),
    s('path', { d: 'M48 96h60l10 18q4 20-16 20H54q-20 0-16-20z' }, 'purple', { accent: true }),
    s('path', { d: 'M64 20h28v34l26 60q4 20-16 20H54q-20 0-16-20l26-60z', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M132 24l-14 28h14l-12 28', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[70, 82], [86, 70], [78, 58]], 4) }, 'pink')
  ],
  'cañada': [
    backdrop('sky'),
    s('path', { d: 'M14 146V40q30 6 52 106z' }, 'green'),
    s('path', { d: 'M146 146V34q-30 8-52 112z' }, 'brown'),
    s('path', { d: 'M80 146q-12-24 0-44q8-14 0-30', ...SW(10) }, 'tan', { stroke: true }),
    s('path', { d: ells([[76, 118, 8, 6], [86, 96, 7, 5]]) }, 'white', { accent: true }),
    s('path', { d: dots([[68, 118], [80, 96]], 3) }, 'dark')
  ],
  chasis: [
    s('path', { d: rects([[30, 40, 28, 16], [102, 40, 28, 16], [30, 104, 28, 16], [102, 104, 28, 16]]) }, 'dark'),
    s('path', { d: 'M44 56v48M116 56v48', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 66h124M18 94h124', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 66v28M80 66v28M132 66v28', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 92, y: 70, width: 28, height: 20, rx: 3 }, 'orange', { accent: true })
  ],
  'cocción': [
    s('path', { d: 'M40 30q-6-8 0-16M80 30q-6-8 0-16M120 30q-6-8 0-16', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 34, y: 54, width: 92, height: 58, rx: 6 }, 'gray'),
    s('rect', { x: 28, y: 44, width: 104, height: 12, rx: 5 }, 'dark'),
    s('path', { d: 'M34 70H20M126 70h14', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: drop(56, 126, 6) + drop(80, 126, 7) + drop(104, 126, 6) }, 'orange', { accent: true }),
    s('rect', { x: 30, y: 134, width: 100, height: 8, rx: 3 }, 'dark')
  ],
  conocedor: [
    ...person(46, 136, 'navy', { h: 60, w: 34, r: 14 }),
    s('path', { d: 'M60 96l30-6', ...SW(7) }, 'skin', { stroke: true }),
    ...glass(110, -10, true),
    s('path', { d: 'M74 44q6-6 12 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  cooperativo: [
    ground(),
    ...person(32, 136, 'blue', { h: 48, w: 28, r: 12 }),
    ...person(128, 136, 'green', { h: 48, w: 28, r: 12 }),
    s('rect', { x: 56, y: 78, width: 48, height: 38, rx: 3 }, 'tan', { accent: true }),
    s('path', { d: 'M44 100h14M116 100h-14', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M56 96h48', ...SW(2) }, 'brown', { stroke: true })
  ],
  coso: [
    s('circle', { cx: 80, cy: 80, r: 64 }, 'brown'),
    s('path', { d: ring(80, 80, 54), ...DASH(6, '4 6') }, 'cream', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 44 }, 'red'),
    s('circle', { cx: 80, cy: 80, r: 40 }, 'yellow', { accent: true }),
    s('path', { d: 'M80 16v20', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 80, cy: 82, rx: 12, ry: 7 }, 'dark')
  ],
  'crepúsculo': [
    backdrop('purple'),
    s('rect', { x: 14, y: 66, width: 132, height: 44 }, 'orange'),
    s('path', { d: 'M48 110a32 32 0 0 1 64 0z' }, 'yellow', { accent: true }),
    s('path', { d: 'M14 108h132v26a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'navy'),
    s('path', { d: sparkle(36, 34, 6) + sparkle(120, 28, 5) + sparkle(84, 40, 4) }, 'cream'),
    s('path', { d: birds([[104, 58], [124, 50]]), ...SW(3) }, 'dark', { stroke: true })
  ],
  'crónico': [
    s('rect', { x: 18, y: 26, width: 88, height: 88, rx: 6 }, 'white'),
    s('rect', { x: 18, y: 26, width: 88, height: 20, rx: 6 }, 'red'),
    outline({ x: 18, y: 26, width: 88, height: 88, rx: 6 }),
    s('path', { d: dots(Array.from({ length: 12 }, (_, k) => [34 + (k % 4) * 19, 62 + Math.floor(k / 4) * 18]), 4) }, 'gray'),
    s('path', { d: ring(118, 112, 26), ...DASH(4) }, 'blue', { stroke: true }),
    s('rect', { x: 102, y: 104, width: 32, height: 16, rx: 8, transform: 'rotate(-35 118 112)' }, 'orange', { accent: true }),
    s('path', { d: 'M138 92l6 8-10 2', ...SW(4) }, 'blue', { stroke: true })
  ],
  cursi: [
    s('path', { d: heart(80, 80, 34) }, 'pink', { accent: true }),
    s('path', { d: heart(80, 76, 22) }, 'white'),
    s('path', { d: heart(80, 72, 12) }, 'red'),
    s('path', { d: 'M80 114l-16-10v20zM80 114l16-10v20z' }, 'purple'),
    s('path', { d: sparkle(26, 30, 9) + sparkle(134, 32, 9) + sparkle(130, 128, 7) + sparkle(30, 124, 7) }, 'yellow')
  ],
  'deducción': [
    s('path', { d: ells([[30, 128, 6, 10], [50, 114, 6, 10], [44, 92, 6, 10], [64, 78, 6, 10]]) }, 'brown'),
    s('path', { d: 'M74 70q14-20 26-24', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 70a26 26 0 1 1 20 0v12h-20z' }, 'yellow', { accent: true }),
    s('rect', { x: 110, y: 82, width: 20, height: 12, rx: 3 }, 'gray'),
    s('path', { d: rays(120, 46, 32, 40, 5, 200) , ...SW(3) }, 'orange', { stroke: true })
  ],
  deplorable: [
    ground(),
    s('path', { d: 'M30 136V78l50-8 48 12v54z' }, 'tan'),
    s('path', { d: 'M20 80l58-46 60 48z' }, 'brown', { accent: true }),
    s('path', { d: 'M92 56l14 8-8 8z' }, 'dark'),
    s('rect', { x: 44, y: 92, width: 24, height: 20 }, 'dark'),
    s('path', { d: 'M48 96l8 8 4-6 6 10M90 136v-34h22v34', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[110, 22, 18, 9], [130, 24, 14, 8]]) }, 'gray'),
    s('path', { d: 'M104 34l-4 8M120 36l-4 8M136 34l-4 8', ...SW(3) }, 'sky', { stroke: true })
  ],
  'difamación': [
    s('path', { d: bubble(14, 18, 66, 44) }, 'gray'),
    s('path', { d: 'M24 40q6-12 12 0t12 0t12 0t12 0', ...SW(4) }, 'dark', { stroke: true }),
    ...person(112, 136, 'blue', { h: 50, w: 34, r: 14 }),
    s('path', { d: dots([[104, 104], [122, 120], [118, 96], [108, 64]], 6) }, 'brown', { accent: true }),
    s('path', { d: 'M54 76q24 4 40 18', ...DASH(4) }, 'brown', { stroke: true })
  ],
  discriminar: [
    ...person(30, 136, 'blue', { h: 36, w: 20, r: 9 }),
    ...person(56, 136, 'blue', { h: 36, w: 20, r: 9 }),
    ...person(82, 136, 'blue', { h: 36, w: 20, r: 9 }),
    s('path', { d: 'M106 56v80', ...SW(6) }, 'red', { stroke: true, accent: true }),
    ...person(132, 136, 'orange', { h: 36, w: 20, r: 9 })
  ],
  disparate: [
    s('circle', { cx: 62, cy: 96, r: 40 }, 'yellow', { accent: true }),
    s('path', { d: spiral(44, 88) + spiral(66, 88), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M46 116q8-8 16 0t16 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: bubble(86, 16, 60, 42) }, 'mint'),
    s('path', { d: 'M96 38l8-10 8 14 8-14 8 14 8-10', ...SW(3) }, 'purple', { stroke: true })
  ],
  'diésel': [
    s('rect', { x: 28, y: 26, width: 64, height: 110, rx: 6 }, 'green', { accent: true }),
    s('rect', { x: 38, y: 36, width: 44, height: 26, rx: 3 }, 'sky'),
    s('path', { d: 'M92 70q30 0 30 30v18', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M114 118h16l-4 14h-8z' }, 'black'),
    s('path', { d: drop(64, 100, 12) }, 'yellow'),
    s('rect', { x: 22, y: 132, width: 76, height: 8, rx: 3 }, 'dark')
  ],
  documentar: [
    s('rect', { x: 32, y: 22, width: 84, height: 118, rx: 6 }, 'brown'),
    s('rect', { x: 40, y: 34, width: 68, height: 98, rx: 2 }, 'white'),
    s('rect', { x: 58, y: 16, width: 32, height: 14, rx: 4 }, 'gray'),
    s('path', { d: 'M48 52l5 5 9-10M48 80l5 5 9-10M48 108l5 5 9-10', ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M70 54h28M70 82h28M70 110h20', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M150 70l-40 56', ...SW(8) }, 'orange', { stroke: true })
  ],
  drogadicto: [
    ground(),
    ...lean(64, 136, 24, 'gray', { h: 38, w: 30, r: 12 }),
    s('path', { d: ells([[84, 26, 18, 10], [104, 30, 16, 9]]) }, 'dark'),
    s('rect', { x: 100, y: 120, width: 22, height: 10, rx: 5, transform: 'rotate(-20 111 125)' }, 'red', { accent: true }),
    s('rect', { x: 120, y: 104, width: 22, height: 10, rx: 5, transform: 'rotate(30 131 109)' }, 'white'),
    s('rect', { x: 120, y: 104, width: 22, height: 10, rx: 5, transform: 'rotate(30 131 109)', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: dots([[136, 130], [98, 106]], 4) }, 'pink')
  ],
  'emblemático': [
    s('path', { d: 'M60 100l-12 38 14-8 8 12 8-34zM100 100l12 38-14-8-8 12-8-34z' }, 'red'),
    s('path', { d: laurel(80, 70, 44) }, 'green'),
    s('circle', { cx: 80, cy: 70, r: 32 }, 'navy'),
    s('path', { d: star(80, 70, 22) }, 'yellow', { accent: true })
  ],
  'empujón': [
    ground(),
    ...person(50, 136, 'green', { h: 46, w: 30, r: 12 }),
    s('path', { d: 'M62 104h28', ...SW(8) }, 'skin', { stroke: true }),
    ...lean(104, 136, 18, 'orange', { h: 44, w: 30, r: 12, accent: true }),
    s('path', { d: 'M130 48l12-6M134 62l12 0M132 76l12 6', ...SW(3) }, 'gray', { stroke: true })
  ],
  encarcelamiento: [
    backdrop('gray'),
    ...person(80, 136, 'orange', { h: 48, w: 34, r: 14, accent: true }),
    s('path', { d: 'M34 20v120M60 20v120M86 20v120M112 20v120M138 20v120', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 40h124', ...SW(6) }, 'dark', { stroke: true })
  ],
  encarnar: [
    s('path', { d: 'M70 14l-40 122h80z' }, 'cream'),
    ...person(66, 136, 'purple', { h: 50, w: 32, r: 13 }),
    s('path', { d: 'M80 104q14-10 22-34', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M92 30h36q4 34-18 40q-22-6-18-40z' }, 'yellow', { accent: true }),
    s('path', { d: ells([[103, 42, 5, 4], [117, 42, 5, 4]]) }, 'dark'),
    s('path', { d: 'M102 54q8 8 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  encubrir: [
    s('path', { d: 'M16 124q22-26 50-6h78v16H16z' }, 'red', { accent: true }),
    s('path', { d: 'M126 22l-30 74', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M84 92l22 8-6 24-28-10z' }, 'yellow'),
    s('path', { d: dots([[66, 126], [56, 130], [62, 118]], 4) }, 'gray'),
    s('path', { d: 'M16 134h128', ...SW(3) }, 'gray', { stroke: true })
  ],
  equitativo: [
    s('path', { d: 'M80 34v98M56 136h48', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 48h104', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 48l-14 40M28 48l14 40M132 48l-14 40M132 48l14 40', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M12 88h32a16 12 0 0 1-32 0zM116 88h32a16 12 0 0 1-32 0z' }, 'yellow', { accent: true }),
    s('path', { d: rects([[20, 72, 16, 16], [124, 72, 16, 16]]) }, 'blue'),
    s('circle', { cx: 80, cy: 34, r: 7 }, 'yellow')
  ],
  escote: [
    s('path', { d: 'M80 34v-8q0-8 8-8t6 10M80 34L44 52h72z', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M56 48h12l12 32 12-32h12l6 24-8 6 22 60H36l22-60-8-6z' }, 'red', { accent: true }),
    s('path', { d: 'M56 92h48', ...SW(5) }, 'dark', { stroke: true })
  ],
  'estadísticamente': [
    s('path', { d: 'M24 20v116h120', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: rects([[34, 96, 18, 40], [60, 76, 18, 60], [86, 86, 18, 50], [112, 52, 18, 84]]) }, 'blue'),
    s('path', { d: 'M43 82l26-22 26 12 26-36', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: dots([[43, 82], [69, 60], [95, 72], [121, 36]], 6) }, 'orange', { accent: true })
  ],
  estafador: [
    ...person(80, 112, 'dark', { h: 40, w: 36, r: 13 }),
    s('path', { d: 'M62 46h36M68 46V30h24v16z', ...SW(4) }, 'black', { stroke: true }),
    s('path', { d: 'M70 57h20', ...SW(6) }, 'black', { stroke: true }),
    s('rect', { x: 14, y: 110, width: 132, height: 12, rx: 3 }, 'brown'),
    s('path', { d: 'M22 110l6-26h20l6 26zM66 110l6-26h20l6 26zM110 110l6-26h20l6 26z' }, 'red', { accent: true }),
    s('circle', { cx: 104, cy: 105, r: 5 }, 'yellow'),
    s('path', { d: 'M38 128v12M80 128v12M122 128v12', ...SW(5) }, 'brown', { stroke: true })
  ],
  'etimología': [
    s('path', { d: 'M80 106V64M80 84l-18-14M80 76l16-14', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: ells([[80, 44, 36, 26], [52, 60, 18, 14], [108, 58, 18, 14]]) }, 'green', { accent: true }),
    s('path', { d: 'M80 104q-20 2-28 10M80 104q20 2 28 10', ...SW(4) }, 'tan', { stroke: true }),
    s('rect', { x: 26, y: 110, width: 108, height: 14, rx: 3 }, 'brown'),
    s('rect', { x: 32, y: 124, width: 104, height: 14, rx: 3 }, 'purple'),
    s('path', { d: 'M30 117h100', ...SW(2) }, 'cream', { stroke: true })
  ],
  fastidio: [
    ...face(66, 92, 42, 'yellow', 'frown', { accent: true }),
    s('path', { d: 'M38 70l16 6M94 70l-16 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M110 70q-10-30 16-34t14-20', ...DASH(2, '4 4') }, 'gray', { stroke: true }),
    s('path', { d: ells([[124, 30, 7, 5], [132, 30, 7, 5]]) }, 'sky'),
    s('ellipse', { cx: 128, cy: 38, rx: 7, ry: 5 }, 'dark')
  ],
  flamante: [
    ground(136),
    ...scaled(car(0, 0, 'red', 'sky', { accent: true }), 1.8, 26, 84),
    s('path', { d: sparkle(30, 40, 10) + sparkle(136, 44, 12) + sparkle(84, 26, 7) }, 'yellow')
  ],
  'fragmentación': [
    s('path', { d: 'M28 28h46l-8 40-38 6z' }, 'blue'),
    s('path', { d: 'M86 22h48v52l-40-10z' }, 'sky'),
    s('path', { d: 'M24 90l42-8 6 52H24z' }, 'navy'),
    s('path', { d: 'M86 78l50 10v46H90z' }, 'orange', { accent: true }),
    s('path', { d: 'M76 74l6 4-4 6-6-4zM80 20l4 4-4 4-4-4zM142 80l4 4-4 4-4-4z' }, 'gray')
  ],
  fumador: [
    ...person(62, 136, 'gray', { h: 44, w: 30, r: 13 }),
    s('path', { d: 'M74 104q20-6 8-20', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M74 84l22-4', ...SW(7, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M75 84l18-3', ...SW(4, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('circle', { cx: 97, cy: 80, r: 4 }, 'orange', { accent: true }),
    s('path', { d: 'M102 72q-8-8 0-16t0-16q-8-8 0-16M116 64q-8-8 0-16t0-16', ...SW(4) }, 'gray', { stroke: true })
  ],
  funeraria: [
    s('path', { d: 'M48 22h40l16 30-12 88H44L32 52z' }, 'brown', { accent: true }),
    s('path', { d: 'M52 30h32l10 24-8 76H50l-8-76z', ...SW(3) }, 'tan', { stroke: true }),
    ...flower(124, 82, 'purple')
  ],
  ganso: [
    backdrop('sky'),
    s('path', { d: 'M74 118v20M88 118v20', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M104 92q12-32 0-54', ...SW(15) }, 'white', { stroke: true }),
    s('ellipse', { cx: 76, cy: 98, rx: 42, ry: 24 }, 'white'),
    s('circle', { cx: 104, cy: 38, r: 12 }, 'white'),
    s('path', { d: 'M114 34l18 5-18 7z' }, 'orange', { accent: true }),
    s('path', { d: 'M46 92q24-12 46 4q-24 14-46-4z' }, 'gray'),
    s('circle', { cx: 106, cy: 34, r: 2.5 }, 'dark')
  ],
  generacional: [
    ground(),
    ...person(32, 136, 'purple', { h: 42, w: 28, r: 12 }),
    s('path', { d: 'M20 78a12 12 0 0 1 24 0q-12-6-24 0z' }, 'gray'),
    s('path', { d: 'M50 102v34', ...SW(4) }, 'brown', { stroke: true }),
    ...person(84, 136, 'blue', { h: 54, w: 32, r: 13 }),
    ...person(128, 136, 'orange', { h: 28, w: 20, r: 10, accent: true })
  ],
  gesta: [
    ground(),
    ...horse('gray', 'dark'),
    s('rect', { x: 62, y: 42, width: 20, height: 30, rx: 6 }, 'red', { accent: true }),
    s('circle', { cx: 72, cy: 32, r: 10 }, 'dark'),
    s('path', { d: 'M78 56L144 22', ...SW(4) }, 'brown', { stroke: true })
  ],
  golosina: [
    s('path', { d: 'M52 80L18 56v48zM108 80l34-24v48z' }, 'purple'),
    s('ellipse', { cx: 80, cy: 80, rx: 32, ry: 24 }, 'pink', { accent: true }),
    s('path', { d: 'M62 62l-8 32M80 58l-10 44M98 60l-10 40', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: sparkle(120, 28, 8) + sparkle(40, 128, 7) }, 'yellow')
  ],
  gremial: [
    s('path', { d: busts([40, 80, 120], 136, 32, 60) }, 'navy'),
    s('path', { d: dots([[40, 64], [80, 64], [120, 64]], 13) }, 'skin'),
    s('path', { d: [40, 80, 120].map(x => `M${x - 15} 60a15 15 0 0 1 30 0h4v4h-38v-4z`).join('') }, 'yellow'),
    s('rect', { x: 18, y: 100, width: 124, height: 30, rx: 3 }, 'red', { accent: true }),
    ...gear(80, 115, 6, 8, 'cream')
  ],
  'habilitación': [
    s('path', { d: 'M48 70V48a24 24 0 0 1 48 0v4', ...SW(10) }, 'gray', { stroke: true }),
    s('rect', { x: 34, y: 70, width: 76, height: 66, rx: 8 }, 'yellow'),
    s('path', { d: dots([[72, 98]], 7) + 'M68 100h8l4 22H64z' }, 'dark'),
    s('circle', { cx: 126, cy: 44, r: 16 }, 'green', { accent: true }),
    s('path', { d: 'M119 44l5 5 9-10', ...SW(4) }, 'white', { stroke: true })
  ],
  'hondureño': [
    s('path', { d: 'M26 20v122', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 28, y: 24, width: 108, height: 72 }, 'white'),
    s('path', { d: rects([[28, 24, 108, 24], [28, 72, 108, 24]]) }, 'blue', { accent: true }),
    s('path', { d: star(82, 60, 5) + star(66, 54, 5) + star(98, 54, 5) + star(66, 66, 5) + star(98, 66, 5) }, 'blue'),
    outline({ x: 28, y: 24, width: 108, height: 72 })
  ],
  'imputación': [
    s('path', { d: 'M14 62h44', ...SW(22) }, 'skin', { stroke: true }),
    s('path', { d: 'M54 56h36', ...SW(9) }, 'skin', { stroke: true }),
    s('path', { d: 'M14 62h10', ...SW(24, { 'stroke-linecap': 'butt' }) }, 'navy', { stroke: true }),
    s('path', { d: 'M96 46l8-8M100 56h12M96 66l8 8', ...SW(4) }, 'red', { stroke: true, accent: true }),
    ...person(122, 136, 'gray', { h: 40, w: 28, r: 12 }),
    s('path', { d: drop(138, 76, 4) }, 'sky')
  ],
  inesperadamente: [
    s('path', { d: 'M80 92l-14-6 28-8-28-8 28-8-14-6', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 40, y: 92, width: 80, height: 44, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M120 92l18-26', ...SW(5) }, 'red', { stroke: true }),
    ...face(80, 40, 20, 'yellow', 'smile'),
    s('path', { d: 'M40 30l-14-6M40 48l-16 4M120 30l14-6M120 48l16 4', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: star(80, 114, 10) }, 'yellow')
  ],
  'infiltración': [
    s('rect', { x: 14, y: 20, width: 38, height: 116 }, 'blue'),
    s('rect', { x: 52, y: 20, width: 40, height: 116 }, 'brown'),
    s('path', { d: 'M52 36h40M52 56h40M52 76h40M52 96h40M52 116h40M72 20v16M64 36v20M80 56v20M66 76v20M80 96v20', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M52 60l14 8-6 10 16 6-6 12 22 4', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: drop(106, 104, 6) + drop(122, 118, 5) + drop(112, 132, 5) }, 'sky', { accent: true })
  ],
  inspeccionar: [
    ground(),
    ...person(46, 136, 'navy', { h: 48, w: 30, r: 13 }),
    s('path', { d: 'M32 72a14 14 0 0 1 28 0h4v4H28v-4z' }, 'yellow', { accent: true }),
    s('rect', { x: 58, y: 92, width: 20, height: 26, rx: 2 }, 'brown'),
    s('path', { d: 'M54 84l58 16', ...DASH(3) }, 'gray', { stroke: true }),
    s('rect', { x: 96, y: 96, width: 44, height: 40, rx: 3 }, 'tan'),
    s('path', { d: 'M96 116h44M118 96v40', ...SW(3) }, 'brown', { stroke: true })
  ],
  institucionalidad: [
    s('path', { d: 'M18 52l62-32 62 32z' }, 'navy', { accent: true }),
    s('rect', { x: 22, y: 52, width: 116, height: 10 }, 'gray'),
    s('path', { d: rects([[30, 66, 12, 52], [56, 66, 12, 52], [92, 66, 12, 52], [118, 66, 12, 52]]) }, 'gray'),
    s('path', { d: rects([[22, 120, 116, 8], [16, 128, 128, 10]]) }, 'dark'),
    s('circle', { cx: 80, cy: 40, r: 6 }, 'yellow')
  ],
  intencionalmente: [
    s('circle', { cx: 70, cy: 86, r: 52 }, 'red'),
    s('circle', { cx: 70, cy: 86, r: 38 }, 'white'),
    s('circle', { cx: 70, cy: 86, r: 24 }, 'red'),
    s('circle', { cx: 70, cy: 86, r: 10 }, 'yellow', { accent: true }),
    s('path', { d: 'M72 84l58-50', ...SW(5) }, 'navy', { stroke: true }),
    s('path', { d: 'M124 28l14-6-4 14zM120 42l14-2-6 12z' }, 'orange')
  ],
  ion: [
    s('ellipse', { cx: 80, cy: 80, rx: 64, ry: 24, transform: 'rotate(-30 80 80)', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 28 }, 'purple', { accent: true }),
    s('circle', { cx: 70, cy: 70, r: 7 }, 'white'),
    s('circle', { cx: 132, cy: 50, r: 8 }, 'blue'),
    s('path', { d: 'M30 30l10 10-6 2 8 10M128 112l10 10-6 2 8 10', ...SW(3) }, 'yellow', { stroke: true })
  ],
  laborista: [
    ground(),
    ...person(64, 136, 'red', { h: 52, w: 34, r: 14 }),
    s('path', { d: 'M48 64a16 16 0 0 1 32 0h5v5H43v-5z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 100l18-30', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M98 70l14-28', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 34a10 10 0 1 0 16 8l-6-2 2-8z' }, 'gray'),
    s('rect', { x: 102, y: 112, width: 40, height: 24, rx: 3 }, 'blue')
  ],
  lenteja: [
    s('path', { d: 'M28 82q52-36 104 0z' }, 'brown'),
    s('path', { d: dots([[50, 74], [64, 68], [80, 64], [96, 68], [110, 74], [72, 76], [90, 76], [58, 78], [102, 78], [80, 72]], 3.5) }, 'tan'),
    s('path', { d: 'M20 82h120q-4 54-60 54T20 82z' }, 'blue', { accent: true }),
    s('path', { d: 'M110 70l26-44', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: ells([[30, 142, 5, 3], [130, 142, 5, 3], [142, 136, 5, 3]]) }, 'brown')
  ],
  levadura: [
    s('path', { d: 'M34 86q0-46 46-46t46 46z' }, 'tan'),
    s('path', { d: dots([[60, 66], [86, 56], [104, 72], [74, 78]], 4) }, 'cream'),
    s('path', { d: 'M24 84h112l-10 52H34z' }, 'gray'),
    s('path', { d: 'M24 84h112', ...SW(5) }, 'dark', { stroke: true }),
    arrow('M80 32V12M70 22l10-10 10 10', 'orange', 5),
    s('path', { d: 'M126 32l8-10M134 44l12-4', ...SW(3) }, 'orange', { stroke: true, accent: true })
  ],
  liebre: [
    s('path', { d: 'M48 104l-16 26M60 110l-8 26M96 108l14 26M104 102l24 18', ...SW(7) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 76, cy: 94, rx: 40, ry: 20, transform: 'rotate(-8 76 94)' }, 'brown', { accent: true }),
    s('circle', { cx: 116, cy: 72, r: 14 }, 'brown'),
    s('path', { d: ells([[100, 40, 6, 22]]), transform: 'rotate(-30 100 40)' }, 'tan'),
    s('path', { d: ells([[114, 38, 6, 22]]), transform: 'rotate(-10 114 38)' }, 'tan'),
    s('circle', { cx: 122, cy: 68, r: 2.5 }, 'dark'),
    s('path', { d: 'M14 70h18M18 86h14M14 102h12', ...SW(4) }, 'gray', { stroke: true })
  ],
  litigio: [
    ground(),
    ...person(28, 136, 'red', { h: 40, w: 24, r: 11 }),
    ...person(132, 136, 'blue', { h: 40, w: 24, r: 11 }),
    s('rect', { x: 62, y: 120, width: 36, height: 16, rx: 3 }, 'dark'),
    s('path', { d: 'M86 108L58 48', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 42, y: 38, width: 46, height: 20, rx: 4, transform: 'rotate(-25 65 48)' }, 'brown', { accent: true })
  ],
  'lugareño': [
    ground(),
    s('rect', { x: 18, y: 78, width: 60, height: 58 }, 'tan'),
    s('path', { d: 'M12 80l36-34 36 34z' }, 'red'),
    s('rect', { x: 40, y: 104, width: 16, height: 32 }, 'brown'),
    ...person(112, 136, 'green', { h: 48, w: 30, r: 13 }),
    s('path', { d: 'M92 64h40M102 64q10-20 20 0z' }, 'yellow', { accent: true }),
    s('path', { d: 'M92 64h40', ...SW(5) }, 'yellow', { stroke: true })
  ],
  lupa: [
    s('path', { d: 'M98 98l36 36', ...SW(16) }, 'brown', { stroke: true }),
    s('circle', { cx: 68, cy: 68, r: 46 }, 'sky'),
    s('path', { d: ring(68, 68, 46), ...SW(10) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M44 56q4-14 18-18', ...SW(6) }, 'white', { stroke: true })
  ],
  'mandarín': [
    ...person(36, 136, 'blue', { h: 46, w: 30, r: 13 }),
    s('path', { d: bubble(56, 14, 90, 76) }, 'cream'),
    s('path', { d: bubble(56, 14, 90, 76), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M92 26h16M92 74h16M100 74v12', ...SW(4) }, 'yellow', { stroke: true }),
    s('ellipse', { cx: 100, cy: 50, rx: 22, ry: 22 }, 'red', { accent: true }),
    s('path', { d: 'M100 28v44M88 32q-8 18 0 36M112 32q8 18 0 36', ...SW(2) }, 'orange', { stroke: true })
  ],
  mendigo: [
    ground(),
    s('circle', { cx: 52, cy: 76, r: 13 }, 'skin'),
    s('rect', { x: 34, y: 92, width: 36, height: 44, rx: 12 }, 'brown'),
    s('path', { d: 'M70 136h30', ...SW(12) }, 'gray', { stroke: true }),
    s('path', { d: 'M64 110l26 4', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M88 104h18l-3 18H91z' }, 'gray'),
    s('circle', { cx: 98, cy: 84, r: 7 }, 'yellow', { accent: true })
  ],
  microscopio: [
    s('rect', { x: 38, y: 124, width: 80, height: 14, rx: 4 }, 'dark'),
    s('path', { d: 'M98 124q22-42-6-76', ...SW(14) }, 'gray', { stroke: true }),
    s('rect', { x: 56, y: 18, width: 20, height: 70, rx: 4, transform: 'rotate(-20 66 53)' }, 'navy', { accent: true }),
    s('rect', { x: 46, y: 98, width: 58, height: 7, rx: 2 }, 'dark'),
    s('rect', { x: 60, y: 93, width: 26, height: 5 }, 'sky'),
    s('circle', { cx: 104, cy: 80, r: 8 }, 'dark')
  ],
  milanesa: [
    s('ellipse', { cx: 80, cy: 90, rx: 66, ry: 46 }, 'gray'),
    s('ellipse', { cx: 80, cy: 88, rx: 58, ry: 38 }, 'white'),
    s('path', { d: 'M36 86q-2-26 34-30q40-6 48 18q8 26-34 32q-46 6-48-20z' }, 'orange', { accent: true }),
    s('path', { d: dots([[54, 76], [70, 90], [90, 70], [100, 88], [66, 68], [82, 100]], 3) }, 'brown'),
    s('path', { d: 'M108 96l26 4-16 18z' }, 'yellow'),
    s('path', { d: leaflet(46, 108, 200, 14, 5) }, 'green')
  ],
  modernizar: [
    s('rect', { x: 14, y: 62, width: 50, height: 42, rx: 6 }, 'brown'),
    s('circle', { cx: 32, cy: 83, r: 11 }, 'tan'),
    s('path', { d: 'M48 74h8M48 84h8M48 94h8M22 62l16-16', ...SW(3) }, 'dark', { stroke: true }),
    arrow('M70 84h24M86 76l8 8-8 8'),
    s('rect', { x: 102, y: 40, width: 40, height: 76, rx: 7 }, 'dark'),
    s('rect', { x: 107, y: 48, width: 30, height: 56, rx: 2 }, 'sky', { accent: true }),
    s('path', { d: sparkle(130, 26, 9) }, 'yellow')
  ],
  mutante: [
    s('path', { d: 'M56 26v6M104 26v6M58 42h44M68 58h24M68 102h24M58 118h44', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M56 20q0 30 24 40t24 40t-24 40', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M104 20q0 30-24 40t-24 40t24 40', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M54 80h52', ...SW(7) }, 'green', { stroke: true, accent: true }),
    s('path', { d: sparkle(124, 72, 10) + sparkle(36, 92, 8) }, 'yellow')
  ],
  nano: [
    ground(),
    ...person(40, 136, 'blue', { h: 46, w: 30, r: 13 }),
    ...person(120, 136, 'green', { h: 46, w: 30, r: 13 }),
    s('path', { d: 'M54 100l20-14M106 100l-20-14', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: dots([[74, 84], [86, 84]], 6) }, 'skin'),
    s('path', { d: 'M80 70V56M68 72l-8-10M92 72l8-10', ...SW(4) }, 'orange', { stroke: true, accent: true })
  ],
  nono: [
    s('path', { d: dots([[40, 40], [80, 40], [120, 40], [40, 80], [80, 80], [120, 80], [40, 120], [80, 120]], 14) }, 'gray'),
    s('path', { d: ring(120, 120, 22), ...SW(4) }, 'orange', { stroke: true }),
    s('circle', { cx: 120, cy: 120, r: 15 }, 'red', { accent: true })
  ],
  obsequio: [
    s('rect', { x: 34, y: 56, width: 92, height: 62, rx: 4 }, 'red', { accent: true }),
    s('rect', { x: 28, y: 46, width: 104, height: 16, rx: 3 }, 'red'),
    s('path', { d: 'M80 46v72M80 46q-24-26-30-8q6 10 30 8q24 2 30-8q-6-18-30 8', ...SW(7) }, 'yellow', { stroke: true }),
    s('path', { d: 'M14 128h46M146 128h-46', ...SW(14) }, 'skin', { stroke: true })
  ],
  oda: [
    s('path', { d: 'M46 30q-22 50 16 90h36q38-40 16-90', ...SW(10) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M40 42h80', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: 'M66 42v78M80 42v78M94 42v78', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 56, y: 116, width: 48, height: 12, rx: 3 }, 'brown'),
    ...note(130, 116, 'purple')
  ],
  otorgamiento: [
    s('path', { d: 'M14 108h40M146 108h-40', ...SW(16) }, 'skin', { stroke: true }),
    s('path', { d: 'M14 108h14M146 108h-14', ...SW(18, { 'stroke-linecap': 'butt' }) }, 'navy', { stroke: true }),
    s('rect', { x: 50, y: 82, width: 60, height: 16, rx: 8 }, 'cream'),
    s('rect', { x: 50, y: 82, width: 60, height: 16, rx: 8, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M76 98l-6 18M84 98l6 18', ...SW(5) }, 'red', { stroke: true }),
    s('circle', { cx: 80, cy: 90, r: 8 }, 'red', { accent: true }),
    s('path', { d: star(80, 42, 18) }, 'yellow')
  ],
  'paralímpico': [
    s('path', { d: ring(70, 106, 30), ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: rays(70, 106, 4, 28, 6), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 106h56', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 130, cy: 130, r: 8 }, 'dark'),
    s('rect', { x: 60, y: 60, width: 22, height: 46, rx: 9, transform: 'rotate(25 71 106)' }, 'blue', { accent: true }),
    s('circle', { cx: 96, cy: 50, r: 11 }, 'skin'),
    s('path', { d: 'M88 72l8 26', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M14 84h18M18 100h14M14 116h14', ...SW(4) }, 'gray', { stroke: true })
  ],
  paranoico: [
    backdrop('navy'),
    ...person(80, 140, 'gray', { h: 40, w: 28, r: 12 }),
    s('path', { d: ells([[36, 40, 12, 7], [124, 36, 12, 7], [32, 96, 12, 7], [128, 92, 12, 7]]) }, 'yellow', { accent: true }),
    s('path', { d: dots([[36, 40], [124, 36], [32, 96], [128, 92]], 3.5) }, 'black'),
    s('path', { d: drop(98, 72, 4) + drop(62, 76, 4) }, 'sky')
  ],
  pela: [
    s('rect', { x: 20, y: 46, width: 80, height: 44, rx: 4, transform: 'rotate(-10 60 68)' }, 'green'),
    s('circle', { cx: 60, cy: 68, r: 11, transform: 'rotate(-10 60 68)' }, 'mint'),
    s('path', { d: rects([[78, 116, 52, 10], [78, 104, 52, 10], [78, 92, 52, 10]]) }, 'orange'),
    s('ellipse', { cx: 104, cy: 90, rx: 26, ry: 8 }, 'yellow', { accent: true }),
    s('ellipse', { cx: 44, cy: 124, rx: 20, ry: 7 }, 'yellow'),
    s('path', { d: 'M78 104h52M78 116h52', ...SW(2) }, 'yellow', { stroke: true })
  ],
  'pentágono': [
    s('path', { d: poly(around(80, 86, 62, 5, -90)) }, 'orange', { accent: true }),
    s('path', { d: poly(around(80, 86, 40, 5, -90)), ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: dots(around(80, 86, 62, 5, -90), 6) }, 'navy')
  ],
  'percusión': [
    s('rect', { x: 32, y: 66, width: 96, height: 64, rx: 6 }, 'red', { accent: true }),
    s('path', { d: 'M34 72l16 52 16-52 16 52 16-52 16 52 12-40', ...SW(3) }, 'yellow', { stroke: true }),
    s('ellipse', { cx: 80, cy: 66, rx: 48, ry: 14 }, 'cream'),
    s('ellipse', { cx: 80, cy: 66, rx: 48, ry: 14, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 20l40 42M124 20l-40 42', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M60 40l-8-6M100 40l8-6M80 34v-10', ...SW(3) }, 'orange', { stroke: true })
  ],
  perfeccionar: [
    s('path', { d: 'M40 76l16-22h48l16 22-40 52z' }, 'sky', { accent: true }),
    s('path', { d: 'M40 76h80M56 54l12 22 12-22 12 22 12-22M68 76l12 52 12-52', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M104 54q14-20 30-16q8 12-4 26z' }, 'yellow'),
    s('path', { d: 'M132 50l14 14', ...SW(12) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(30, 44, 10) + sparkle(130, 104, 9) + sparkle(84, 28, 7) }, 'yellow')
  ],
  platicar: [
    ...person(36, 136, 'blue', { h: 46, w: 30, r: 13 }),
    ...person(124, 136, 'pink', { h: 46, w: 30, r: 13, accent: true }),
    s('path', { d: bubble(46, 16, 46, 34) }, 'sky'),
    s('path', { d: bubble(76, 50, 46, 34), transform: 'translate(198 0) scale(-1 1)' }, 'mint'),
    s('path', { d: dots([[60, 32], [69, 32], [78, 32], [84, 66], [93, 66], [102, 66]], 3) }, 'dark')
  ],
  plenario: [
    s('path', { d: dots(seats(64, 10), 6) }, 'blue'),
    s('path', { d: dots(seats(50, 8), 6) }, 'green'),
    s('path', { d: dots(seats(36, 6), 6) }, 'orange'),
    s('path', { d: 'M14 128h132', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 70, y: 104, width: 20, height: 22, rx: 3 }, 'navy', { accent: true })
  ],
  'portón': [
    ground(),
    s('path', { d: rects([[14, 30, 20, 106], [126, 30, 20, 106]]) }, 'gray'),
    s('path', { d: 'M34 136V64q46-40 92 0v72z' }, 'brown', { accent: true }),
    s('path', { d: 'M80 44v92M34 84h92M34 112h92', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[72, 98], [88, 98]], 4) }, 'yellow')
  ],
  praxis: [
    s('path', { d: 'M18 50l26 6 26-6v44l-26 6-26-6z' }, 'blue'),
    s('path', { d: 'M44 56v44', ...SW(2) }, 'white', { stroke: true }),
    arrow('M76 74h18M86 66l8 8-8 8'),
    s('rect', { x: 100, y: 108, width: 46, height: 14, rx: 2 }, 'tan'),
    s('path', { d: 'M122 108V92', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 82l22-40', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 118, y: 30, width: 28, height: 14, rx: 3, transform: 'rotate(30 132 37)' }, 'dark', { accent: true })
  ],
  presentimiento: [
    ground(),
    ...person(46, 136, 'purple', { h: 48, w: 30, r: 13 }),
    s('path', { d: 'M28 58q18-16 36 0M22 50q24-24 48 0', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: ells([[112, 34, 20, 11], [128, 38, 16, 9]]) }, 'dark'),
    s('path', { d: 'M118 46l-8 14h10l-8 16', ...SW(4) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M66 66q24-24 40-24', ...DASH(3, '3 6') }, 'gray', { stroke: true })
  ],
  presupuestario: [
    s('path', { d: wedge(64, 70, 46, -90, 60) }, 'blue'),
    s('path', { d: wedge(64, 70, 46, 60, 170) }, 'green'),
    s('path', { d: wedge(64, 70, 46, 170, 270) }, 'orange', { accent: true }),
    s('path', { d: rects([[96, 122, 44, 10], [96, 110, 44, 10], [96, 98, 44, 10]]) }, 'yellow'),
    s('path', { d: 'M96 110h44M96 122h44', ...SW(2) }, 'orange', { stroke: true }),
    s('ellipse', { cx: 118, cy: 98, rx: 22, ry: 6 }, 'yellow')
  ],
  principiante: [
    s('path', { d: ring(42, 112, 22) + ring(112, 112, 22), ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[28, 130], [126, 130]], 7) }, 'gray'),
    s('path', { d: 'M42 112l26-30h34l10 30M68 82l12 30h22M64 76h14', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('rect', { x: 66, y: 34, width: 22, height: 34, rx: 8, transform: 'rotate(15 77 68)' }, 'blue'),
    s('circle', { cx: 86, cy: 24, r: 10 }, 'skin'),
    s('path', { d: 'M76 22a10 10 0 0 1 20 0z' }, 'yellow'),
    s('path', { d: 'M86 50l14 22', ...SW(5) }, 'skin', { stroke: true })
  ],
  propiciar: [
    s('rect', { x: 14, y: 118, width: 132, height: 28, rx: 4 }, 'blue'),
    s('path', { d: 'M80 104V30l40 70z' }, 'cream'),
    s('path', { d: 'M80 104V30l40 70z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M76 40L50 96h26z' }, 'yellow'),
    s('path', { d: 'M48 104h80l-12 16H60z' }, 'red', { accent: true }),
    s('path', { d: 'M14 50q12-6 24 0M18 66q12-6 24 0M14 82q12-6 24 0', ...SW(4) }, 'sky', { stroke: true })
  ],
  proseguir: [
    backdrop('sky'),
    s('path', { d: 'M14 146h132v-50H14z' }, 'green'),
    s('path', { d: 'M40 146l32-80h16l32 80z' }, 'gray'),
    s('path', { d: 'M80 140v-12M80 116v-10M80 96v-8M80 80v-6', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M80 64V24M68 36l12-12 12 12', ...SW(7) }, 'orange', { stroke: true, accent: true })
  ],
  'regalía': [
    s('path', { d: 'M30 82l-6-44 26 22 30-34 30 34 26-22-6 44z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[50, 60], [80, 48], [110, 60]], 5) }, 'red'),
    s('rect', { x: 30, y: 82, width: 100, height: 10, rx: 2 }, 'orange'),
    s('path', { d: rects([[50, 126, 60, 10], [50, 114, 60, 10], [50, 102, 60, 10]]) }, 'yellow'),
    s('path', { d: 'M50 114h60M50 126h60', ...SW(2) }, 'orange', { stroke: true })
  ],
  'relajación': [
    s('circle', { cx: 120, cy: 32, r: 14 }, 'yellow'),
    s('path', { d: 'M24 136V50M136 136V50', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M24 62q56 70 112 0', ...SW(10) }, 'red', { stroke: true, accent: true }),
    s('ellipse', { cx: 84, cy: 90, rx: 32, ry: 9, transform: 'rotate(6 84 90)' }, 'blue'),
    s('circle', { cx: 46, cy: 80, r: 11 }, 'skin'),
  ],
  safari: [
    backdrop('cream'),
    s('circle', { cx: 112, cy: 60, r: 24 }, 'orange'),
    s('path', { d: 'M40 126V70', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M14 66q26-18 52 0z' }, 'green', { accent: true }),
    s('path', { d: 'M14 120h132v26H14z' }, 'tan'),
    ...scaled(car(0, 0, 'green', 'sky'), 1.1, 82, 108)
  ],
  saquear: [
    s('rect', { x: 14, y: 30, width: 70, height: 106 }, 'gray'),
    s('path', { d: 'M24 44h50v44H24z' }, 'sky'),
    s('path', { d: 'M24 44l18 20-6 10 12 14M74 44l-14 18 8 8', ...SW(3) }, 'dark', { stroke: true }),
    ...person(104, 136, 'dark', { h: 42, w: 28, r: 12 }),
    s('path', { d: 'M110 54q30-10 34 18q2 24-24 22q-18-6-10-40z' }, 'tan', { accent: true }),
    s('path', { d: 'M92 70h40', ...SW(5) }, 'black', { stroke: true })
  ],
  sicario: [
    s('path', { d: ring(80, 80, 62), ...SW(4) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M80 14v24M80 122v24M14 80h24M122 80h24', ...SW(4) }, 'red', { stroke: true }),
    ...person(80, 136, 'black', { h: 50, w: 38, r: 15 }),
    s('path', { d: 'M60 56h40M66 56V40h28v16z', ...SW(4) }, 'black', { stroke: true }),
    s('path', { d: 'M70 68h20', ...SW(6) }, 'black', { stroke: true })
  ],
  simio: [
    s('rect', { x: 46, y: 92, width: 68, height: 50, rx: 24 }, 'brown'),
    s('path', { d: dots([[38, 60], [122, 60]], 14) }, 'tan'),
    s('circle', { cx: 80, cy: 60, r: 40 }, 'brown', { accent: true }),
    s('path', { d: 'M54 60q0-20 26-12q26-8 26 12q6 30-26 30q-32 0-26-30z' }, 'tan'),
    s('path', { d: dots([[68, 56], [92, 56]], 4) + dots([[76, 72], [84, 72]], 2.5) }, 'dark'),
    s('path', { d: 'M70 82q10 6 20 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  'subsecretaría': [
    s('path', { d: 'M80 54v20M80 98v10M36 108h88M36 108v8M80 108v8M124 108v8', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 56, y: 16, width: 48, height: 38, rx: 6 }, 'navy'),
    s('rect', { x: 56, y: 70, width: 48, height: 30, rx: 6 }, 'orange', { accent: true }),
    s('path', { d: rects([[18, 116, 36, 26], [62, 116, 36, 26], [106, 116, 36, 26]]) }, 'sky'),
    s('path', { d: busts([80], 50, 22, 16) + busts([80], 98, 18, 12) }, 'white'),
    s('path', { d: dots([[80, 28], [80, 80]], 6) }, 'skin')
  ],
  tempo: [
    s('path', { d: 'M54 136l18-112h16l18 112z' }, 'brown', { accent: true }),
    s('path', { d: 'M66 60h28l6 50H60z' }, 'cream'),
    s('path', { d: 'M80 118l26-80', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 94, y: 62, width: 14, height: 10, rx: 2, transform: 'rotate(18 101 67)' }, 'gray'),
    s('rect', { x: 48, y: 128, width: 64, height: 10, rx: 3 }, 'dark'),
    s('path', { d: 'M120 40q8 6 8 16M128 30q14 10 12 30', ...SW(3) }, 'orange', { stroke: true })
  ],
  terciario: [
    s('path', { d: rects([[56, 64, 48, 72]]) }, 'yellow'),
    s('path', { d: rects([[14, 84, 42, 52]]) }, 'gray'),
    s('rect', { x: 104, y: 100, width: 42, height: 36 }, 'orange', { accent: true }),
    s('path', { d: 'M118 74l7 10 7-10', ...SW(4) }, 'red', { stroke: true }),
    s('circle', { cx: 125, cy: 88, r: 8 }, 'brown'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'dark', { stroke: true })
  ],
  ternera: [
    backdrop('mint'),
    s('path', { d: 'M48 104v30M62 106v28M98 106v28M112 104v30', ...SW(7) }, 'white', { stroke: true }),
    s('ellipse', { cx: 80, cy: 92, rx: 38, ry: 22 }, 'white'),
    s('path', { d: ells([[66, 86, 12, 9], [96, 98, 10, 7]]) }, 'dark'),
    s('ellipse', { cx: 122, cy: 70, rx: 14, ry: 17 }, 'white'),
    s('ellipse', { cx: 126, cy: 82, rx: 10, ry: 7 }, 'pink', { accent: true }),
    s('path', { d: 'M108 58l-10-6M134 56l10-6', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: dots([[118, 66], [130, 66]], 2.5) }, 'dark')
  ],
  'tesorería': [
    s('rect', { x: 18, y: 22, width: 124, height: 106, rx: 8 }, 'gray'),
    s('rect', { x: 28, y: 32, width: 104, height: 86, rx: 4 }, 'dark'),
    s('path', { d: 'M40 108l8-14h24l8 14zM80 108l8-14h24l8 14zM60 92l8-14h24l8 14z' }, 'yellow', { accent: true }),
    s('path', { d: ring(80, 54, 12) + 'M80 42v24M68 54h24', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 128v10M130 128v10', ...SW(6) }, 'dark', { stroke: true })
  ],
  tripa: [
    ...person(80, 136, 'blue', { h: 56, w: 50, r: 14 }),
    s('path', { d: 'M66 96h28v10H66v10h28v10H72', ...SW(5) }, 'pink', { stroke: true, accent: true }),
    s('path', { d: 'M52 110l20 4M108 110l-20 4', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M122 98q8 6 0 12M132 92q14 12 0 24M38 98q-8 6 0 12M28 92q-14 12 0 24', ...SW(3) }, 'orange', { stroke: true })
  ],
  trucha: [
    s('path', { d: 'M28 80l-14-20v40z' }, 'green'),
    s('path', { d: 'M28 80q40-34 90-18q24 8 28 18q-4 10-28 18q-50 16-90-18z' }, 'green', { accent: true }),
    s('path', { d: 'M38 80q40-8 98 0', ...SW(7) }, 'pink', { stroke: true }),
    s('path', { d: dots([[60, 68], [76, 64], [92, 66], [70, 94], [96, 94]], 3) }, 'dark'),
    s('circle', { cx: 128, cy: 74, r: 4 }, 'dark'),
    s('path', { d: 'M78 64l14-16 12 16z' }, 'green')
  ],
  vacuno: [
    s('path', { d: 'M50 40q-30 0-30-24M110 40q30 0 30-24', ...SW(8) }, 'cream', { stroke: true }),
    s('path', { d: 'M50 40q-30 0-30-24M110 40q30 0 30-24', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: ells([[32, 56, 18, 9], [128, 56, 18, 9]]) }, 'brown'),
    s('path', { d: 'M46 50q34-24 68 0l-4 62H50z' }, 'brown', { accent: true }),
    s('ellipse', { cx: 80, cy: 116, rx: 32, ry: 22 }, 'pink'),
    s('path', { d: dots([[64, 70], [96, 70]], 5) + dots([[68, 116], [92, 116]], 5) }, 'dark')
  ],
  vecinal: [
    ground(),
    s('path', { d: rects([[18, 90, 36, 46], [62, 80, 36, 56], [106, 90, 36, 46]]) }, 'tan'),
    s('path', { d: 'M14 92l22-24 22 24zM58 82l22-26 22 26zM102 92l22-24 22 24z' }, 'red', { accent: true }),
    s('path', { d: rects([[30, 112, 12, 24], [74, 112, 12, 24], [118, 112, 12, 24]]) }, 'brown'),
    s('path', { d: rects([[68, 90, 24, 12], [24, 98, 24, 8], [112, 98, 24, 8]]) }, 'sky'),
    s('path', { d: birds([[50, 40], [110, 36]]), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 126h8M98 126h8', ...SW(4) }, 'green', { stroke: true })
  ],
  vengador: [
    s('path', { d: 'M62 74L36 136h88L98 74z' }, 'red'),
    ...person(80, 136, 'navy', { h: 58, w: 34, r: 14, accent: true }),
    s('path', { d: 'M68 60h24', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M94 92l20-30', ...SW(8) }, 'skin', { stroke: true }),
    s('circle', { cx: 116, cy: 58, r: 7 }, 'skin'),
    s('path', { d: star(80, 102, 10) }, 'yellow')
  ],
  vibra: [
    s('path', { d: 'M40 104a40 40 0 0 1 80 0', ...SW(5) }, 'pink', { stroke: true }),
    s('path', { d: 'M26 104a54 54 0 0 1 108 0', ...SW(5) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M14 104a66 66 0 0 1 132 0', ...SW(5) }, 'sky', { stroke: true }),
    ...person(80, 136, 'purple', { h: 40, w: 28, r: 12 }),
    s('path', { d: sparkle(24, 132, 7) + sparkle(136, 132, 7) }, 'yellow')
  ],
  vietnamita: [
    s('path', { d: 'M26 20v122', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 28, y: 24, width: 108, height: 72 }, 'red', { accent: true }),
    s('path', { d: star(82, 60, 24) }, 'yellow')
  ],
  'íntimamente': [
    ground(),
    ...person(62, 136, 'blue', { h: 48, w: 32, r: 13 }),
    ...person(98, 136, 'pink', { h: 46, w: 32, r: 13 }),
    s('path', { d: 'M70 106q14 8 28-8M90 106q-14 8-28-8', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 34, 14) }, 'red', { accent: true })
  ],
  acantilado: [
    backdrop('sky'),
    s('path', { d: 'M14 100h132v34a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'blue'),
    s('path', { d: 'M14 146V44h56l10 20-6 22 10 24-8 36z' }, 'brown', { accent: true }),
    s('path', { d: 'M14 44h56l4 8H14z' }, 'green'),
    s('path', { d: 'M88 118q8-8 16 0t16 0t16 0M84 132q8-8 16 0t16 0', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: birds([[110, 40], [128, 52]]), ...SW(3) }, 'dark', { stroke: true })
  ],
  'acuático': [
    backdrop('blue'),
    s('path', { d: 'M34 146q-10-30 4-50q10-20 0-40M120 146q10-24-2-44', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: fishes([[80, 64], [104, 104]]) }, 'orange', { accent: true }),
    s('path', { d: dots([[92, 62], [116, 102]], 2.5) }, 'dark'),
    s('path', { d: dots([[60, 40], [66, 28], [56, 20]], 4) }, 'sky'),
    s('path', { d: 'M14 136h132v10H14z' }, 'tan')
  ],
  aforo: [
    s('rect', { x: 14, y: 30, width: 132, height: 110, rx: 8 }, 'cream'),
    s('path', { d: busts([30, 54, 78, 102, 126], 140, 22, 26) }, 'blue'),
    s('path', { d: dots([[30, 108], [54, 108], [78, 108], [102, 108], [126, 108]], 9) }, 'skin'),
    s('path', { d: busts([42, 66, 90, 114], 104, 22, 22) + dots([[42, 76], [66, 76], [90, 76], [114, 76]], 9) }, 'purple'),
    s('rect', { x: 30, y: 16, width: 100, height: 20, rx: 10 }, 'gray'),
    s('rect', { x: 34, y: 20, width: 92, height: 12, rx: 6 }, 'red', { accent: true })
  ],
  agotar: [
    s('rect', { x: 20, y: 48, width: 108, height: 64, rx: 10 }, 'white'),
    s('rect', { x: 20, y: 48, width: 108, height: 64, rx: 10, ...SW(7) }, 'dark', { stroke: true }),
    s('rect', { x: 128, y: 66, width: 12, height: 28, rx: 3 }, 'dark'),
    s('rect', { x: 30, y: 58, width: 16, height: 44, rx: 3 }, 'red', { accent: true }),
    s('path', { d: drop(80, 130, 5) }, 'sky')
  ],
  agravar: [
    s('path', { d: 'M22 20v116h120', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M32 40l26 16 22-6 24 34 28 34', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M120 122l14 4 2-14', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: ells([[104, 32, 18, 10], [124, 34, 14, 8]]) }, 'gray'),
    s('path', { d: 'M110 44l-6 10h8l-6 10', ...SW(3) }, 'yellow', { stroke: true })
  ],
  agredir: [
    ground(),
    ...lean(52, 136, 16, 'red', { h: 44, w: 30, r: 12 }),
    s('path', { d: 'M72 96l22-6', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: burst(100, 86, 14, 6, 8) }, 'yellow', { accent: true }),
    ...lean(122, 136, -12, 'blue', { h: 44, w: 26, r: 12 }),
    s('path', { d: 'M110 92l-4-16', ...SW(6) }, 'skin', { stroke: true })
  ],
  aldeano: [
    ground(),
    s('rect', { x: 18, y: 86, width: 56, height: 50 }, 'brown'),
    s('path', { d: 'M10 92l36-40 36 40z' }, 'yellow'),
    s('rect', { x: 38, y: 108, width: 16, height: 28 }, 'dark'),
    ...person(110, 136, 'green', { h: 46, w: 30, r: 13 }),
    s('path', { d: 'M90 106h40l-4 20H94z' }, 'tan', { accent: true }),
    s('path', { d: dots([[100, 104], [110, 102], [120, 104]], 6) }, 'red')
  ],
  alegremente: [
    ...person(80, 130, 'orange', { h: 42, w: 30, r: 13, accent: true }),
    s('path', { d: 'M68 96L48 62M92 96l20-34', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M72 130l-8 12M88 130l8 12', ...SW(6) }, 'dark', { stroke: true }),
    ...note(28, 56, 'blue'),
    s('path', { d: rects([[120, 30, 6, 6], [130, 60, 6, 6], [34, 100, 6, 6], [118, 100, 6, 6]]) }, 'pink'),
    s('path', { d: rects([[100, 22, 6, 6], [56, 26, 6, 6], [140, 84, 6, 6]]) }, 'green')
  ],
  'amazónico': [
    backdrop('mint'),
    s('path', { d: 'M14 120q40-10 60 6t72-4v24H14z' }, 'blue'),
    s('path', { d: 'M34 120V70M120 116V64', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: ells([[34, 56, 22, 18], [20, 72, 12, 10], [48, 72, 12, 10], [120, 50, 24, 20], [136, 68, 12, 10]]) }, 'green'),
    s('path', { d: 'M78 60q0-16 14-16t10 14l-6 30q-6 6-12 0z' }, 'red', { accent: true }),
    s('path', { d: 'M100 52l10 4-10 4z' }, 'yellow'),
    s('path', { d: 'M82 84l-4 14M90 86v14', ...SW(4) }, 'blue', { stroke: true })
  ],
  anarquismo: [
    s('path', { d: 'M24 80h28M108 80h28', ...SW(10) }, 'gray', { stroke: true }),
    s('rect', { x: 18, y: 64, width: 46, height: 32, rx: 16, ...SW(9) }, 'dark', { stroke: true }),
    s('rect', { x: 96, y: 64, width: 46, height: 32, rx: 16, ...SW(9) }, 'dark', { stroke: true }),
    s('path', { d: burst(80, 80, 24, 10, 8) }, 'yellow', { accent: true }),
    s('path', { d: 'M68 48l6 8M92 48l-6 8M68 112l6-8M92 112l-6-8', ...SW(4) }, 'orange', { stroke: true })
  ],
  'apatía': [
    s('path', { d: busts([80], 148, 76, 34) }, 'gray'),
    s('circle', { cx: 80, cy: 72, r: 40 }, 'yellow', { accent: true }),
    s('path', { d: 'M54 66h18M88 66h18', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[63, 72], [97, 72]], 4) }, 'dark'),
    s('path', { d: 'M66 94h28', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 108l-10-12M132 108l10-12', ...SW(6) }, 'gray', { stroke: true })
  ],
  arduo: [
    backdrop('sky'),
    s('path', { d: 'M14 146L112 24l34 40v82z' }, 'gray'),
    s('path', { d: 'M112 24v-10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M112 14l14 5-14 5z' }, 'red'),
    ...lean(64, 112, 30, 'orange', { h: 24, w: 16, r: 8, accent: true }),
    s('rect', { x: 56, y: 78, width: 14, height: 18, rx: 4, transform: 'rotate(30 64 112)' }, 'brown')
  ],
  arriendo: [
    ground(),
    s('rect', { x: 22, y: 76, width: 70, height: 60 }, 'tan'),
    s('path', { d: 'M14 78l43-40 43 40z' }, 'red'),
    s('rect', { x: 48, y: 104, width: 18, height: 32 }, 'brown'),
    s('path', { d: ring(118, 60, 12) + 'M118 72v40M118 96h10M118 106h8', ...SW(6) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: dots([[112, 126], [132, 126]], 8) }, 'orange')
  ],
  audacia: [
    s('path', { d: 'M14 146V90h40l-6 56zM146 146V80h-36l8 66z' }, 'brown'),
    s('path', { d: 'M40 84q40-70 84-8', ...DASH(3) }, 'gray', { stroke: true }),
    ...lean(80, 70, 50, 'orange', { h: 30, w: 20, r: 10, accent: true }),
    s('path', { d: 'M74 60l-14 6M88 48l6-14', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M60 120q20 10 40 0', ...SW(3) }, 'blue', { stroke: true })
  ],
  bastardo: [
    s('path', { d: 'M34 24h92v50q0 44-46 64q-46-20-46-64z' }, 'blue'),
    s('path', { d: 'M116 30L40 108', ...SW(16, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M34 24h92v50q0 44-46 64q-46-20-46-64z', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: star(58, 56, 9) }, 'yellow')
  ],
  bermudas: [
    s('rect', { x: 36, y: 26, width: 88, height: 18, rx: 3 }, 'brown'),
    s('path', { d: 'M36 44h88l12 88H90l-10-54-10 54H24z' }, 'blue', { accent: true }),
    s('path', { d: 'M26 120h44M90 120h44', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: 'M48 56q8 10 18 4M112 56q-8 10-18 4', ...SW(3) }, 'navy', { stroke: true }),
    s('rect', { x: 74, y: 28, width: 12, height: 14, rx: 2 }, 'yellow')
  ],
  candela: [
    s('circle', { cx: 80, cy: 44, r: 30 }, 'cream'),
    s('path', { d: drop(80, 44, 12) }, 'orange', { accent: true }),
    s('path', { d: drop(80, 50, 6) }, 'yellow'),
    s('path', { d: 'M80 58v10', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 62, y: 68, width: 36, height: 64, rx: 4 }, 'red'),
    s('path', { d: 'M90 68v20', ...SW(5) }, 'pink', { stroke: true }),
    s('rect', { x: 46, y: 130, width: 68, height: 10, rx: 4 }, 'gray')
  ],
  cantor: [
    ...person(64, 136, 'purple', { h: 56, w: 40, r: 14, accent: true }),
    s('path', { d: 'M52 80l12 10 12-10z' }, 'white'),
    s('ellipse', { cx: 64, cy: 68, rx: 4, ry: 5 }, 'dark'),
    s('path', { d: 'M54 104l12-6 12 6v16l-12-6-12 6z' }, 'red'),
    ...note(108, 56, 'blue'),
    ...note(132, 88, 'orange')
  ],
  caseta: [
    ground(),
    s('rect', { x: 34, y: 56, width: 92, height: 80 }, 'blue'),
    s('path', { d: 'M24 56h112l-8-26H32z' }, 'red', { accent: true }),
    s('path', { d: 'M48 30l-4 26M80 30v26M112 30l4 26M64 30l-2 26M96 30l2 26', ...SW(6, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('rect', { x: 46, y: 70, width: 68, height: 30, rx: 3 }, 'sky'),
    s('rect', { x: 40, y: 100, width: 80, height: 8 }, 'brown')
  ],
  causal: [
    ground(),
    s('rect', { x: 20, y: 80, width: 14, height: 46, rx: 2, transform: 'rotate(60 34 126)' }, 'gray'),
    s('rect', { x: 50, y: 82, width: 14, height: 46, rx: 2, transform: 'rotate(40 64 128)' }, 'gray'),
    s('rect', { x: 84, y: 86, width: 14, height: 50, rx: 2, transform: 'rotate(18 98 136)' }, 'orange', { accent: true }),
    s('path', { d: rects([[112, 86, 14, 50], [134, 86, 12, 50]]) }, 'blue'),
    arrow('M30 50q30-16 60 0M82 42l8 8-10 4', 'red', 4)
  ],
  ceremonial: [
    s('path', { d: 'M14 70h132', ...SW(10) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M80 70l-20-16v32zM80 70l20-16v32z' }, 'red'),
    s('path', { d: 'M80 70l-10 30M80 70l12 28', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M18 130l22-58M18 130l40-46', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: ring(14, 136, 8) + ring(24, 140, 8), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: sparkle(122, 112, 9) + sparkle(56, 30, 7) + sparkle(108, 34, 7) }, 'yellow')
  ],
  chalet: [
    ground(),
    s('rect', { x: 30, y: 72, width: 76, height: 64 }, 'cream'),
    s('path', { d: 'M20 76l48-50 48 50z' }, 'brown', { accent: true }),
    s('rect', { x: 88, y: 32, width: 12, height: 24 }, 'red'),
    s('path', { d: rects([[40, 86, 18, 16], [78, 86, 18, 16]]) }, 'sky'),
    s('rect', { x: 58, y: 108, width: 18, height: 28 }, 'brown'),
    s('path', { d: ells([[130, 92, 14, 22]]) }, 'green'),
    s('path', { d: 'M130 112v24M14 124h12', ...SW(4) }, 'brown', { stroke: true })
  ],
  chapa: [
    s('path', { d: burst(80, 80, 60, 50, 21) }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 40 }, 'red'),
    s('path', { d: ring(80, 80, 40), ...SW(3) }, 'cream', { stroke: true }),
    s('path', { d: star(80, 80, 18) }, 'yellow')
  ],
  comparecer: [
    s('rect', { x: 64, y: 20, width: 80, height: 40, rx: 8 }, 'dark'),
    s('circle', { cx: 104, cy: 36, r: 11 }, 'skin'),
    s('path', { d: busts([104], 60, 30, 14) }, 'black'),
    s('rect', { x: 56, y: 58, width: 90, height: 60 }, 'brown', { accent: true }),
    s('path', { d: 'M68 72h66', ...SW(3) }, 'tan', { stroke: true }),
    ...person(30, 136, 'blue', { h: 44, w: 28, r: 12 }),
    ground()
  ],
  conciudadano: [
    s('path', { d: rects([[20, 40, 22, 56], [46, 22, 20, 74], [92, 34, 24, 62], [120, 48, 20, 48]]) }, 'gray'),
    s('path', { d: busts([30, 56, 80, 104, 130], 140, 22, 30) }, 'blue', { accent: true }),
    s('path', { d: dots([[30, 104], [56, 102], [80, 104], [104, 102], [130, 104]], 10) }, 'skin'),
    s('path', { d: busts([56, 104], 140, 22, 30) }, 'green'),
    s('path', { d: 'M18 92h124', ...SW(3) }, 'dark', { stroke: true })
  ],
  conmemorativo: [
    ground(),
    s('path', { d: 'M66 124l6-94 8-12 8 12 6 94z' }, 'gray'),
    s('rect', { x: 50, y: 122, width: 60, height: 14, rx: 2 }, 'dark'),
    s('path', { d: ring(80, 100, 14), ...SW(7) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M74 112l-6 12M86 112l6 12', ...SW(4) }, 'red', { stroke: true })
  ],
  'connotación': [
    s('rect', { x: 14, y: 56, width: 132, height: 90, rx: 6 }, 'blue'),
    s('path', { d: 'M56 56l14-30 10 10 12-6 12 26z' }, 'white'),
    s('path', { d: 'M56 56l14-30 10 10 12-6 12 26z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M56 56l-24 44 26 36h50l24-40-28-40z' }, 'sky', { accent: true }),
    s('path', { d: 'M14 56h132', ...SW(3) }, 'navy', { stroke: true })
  ],
  'consultoría': [
    s('rect', { x: 66, y: 20, width: 78, height: 56, rx: 4 }, 'white'),
    outline({ x: 66, y: 20, width: 78, height: 56, rx: 4 }),
    s('path', { d: rects([[78, 50, 10, 18], [94, 40, 10, 28], [110, 32, 10, 36]]) }, 'green', { accent: true }),
    ...person(40, 136, 'navy', { h: 50, w: 30, r: 13 }),
    s('path', { d: 'M52 96l24-36', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 70, y: 108, width: 76, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M84 118v18M132 118v18', ...SW(5) }, 'brown', { stroke: true })
  ],
  contractual: [
    ...paper(30, 18, 88, 120),
    s('path', { d: 'M44 38h60M44 52h60M44 66h60M44 80h40', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M44 112q8-14 14 0t14-4t12 2', ...SW(3) }, 'navy', { stroke: true }),
    s('circle', { cx: 104, cy: 112, r: 12 }, 'red', { accent: true }),
    s('path', { d: 'M150 64l-40 50', ...SW(7) }, 'orange', { stroke: true })
  ],
  contrariamente: [
    s('path', { d: 'M18 56h96v-18l30 30-30 30V80H18z' }, 'blue'),
    s('path', { d: 'M142 102H46V84l-30 30 30 30v-18h96z' }, 'orange', { accent: true }),
    s('path', { d: 'M14 89h132', ...DASH(2, '4 6') }, 'gray', { stroke: true })
  ],
  'convulsión': [
    s('rect', { x: 14, y: 30, width: 132, height: 100, rx: 8 }, 'dark'),
    s('path', { d: 'M22 80h18l6-20 8 44 8-60 8 72 8-56 8 40 6-20h36', ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M22 50h116M22 110h116', ...DASH(2, '4 6') }, 'gray', { stroke: true }),
  ],
  cronograma: [
    s('rect', { x: 14, y: 22, width: 132, height: 116, rx: 6 }, 'cream'),
    s('path', { d: 'M46 22v116M80 22v116M114 22v116', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: rects([[20, 36, 52, 14], [56, 100, 50, 14]]) }, 'blue'),
    s('path', { d: rects([[48, 58, 48, 14], [90, 122, 50, 12]]) }, 'green'),
    s('rect', { x: 76, y: 80, width: 62, height: 14, rx: 3 }, 'orange', { accent: true }),
    s('rect', { x: 14, y: 22, width: 132, height: 116, rx: 6, ...SW(3) }, 'gray', { stroke: true })
  ],
  'currículo': [
    ...paper(32, 16, 96, 128),
    s('rect', { x: 42, y: 28, width: 32, height: 36, rx: 3 }, 'sky'),
    s('path', { d: busts([58], 64, 20, 14) + dots([[58, 42]], 7) }, 'blue', { accent: true }),
    s('path', { d: 'M82 34h34M82 46h28M82 58h34', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M42 80h76M42 94h70M42 108h76M42 122h56', ...SW(3) }, 'gray', { stroke: true })
  ],
  'cúmulo': [
    backdrop('sky'),
    s('path', { d: 'M30 112q-16 0-14-16q2-14 18-12q0-22 22-24q6-26 32-20q22 4 22 26q20-4 24 14q16 0 14 18q-2 14-16 14z' }, 'white', { accent: true }),
    s('path', { d: 'M30 112h102', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[120, 38, 14, 7]]) }, 'white')
  ],
  'defunción': [
    s('path', { d: 'M14 128q66-16 132 0v18H14z' }, 'green'),
    s('path', { d: 'M44 128V60a36 36 0 0 1 72 0v68z' }, 'gray', { accent: true }),
    s('path', { d: 'M62 74h36M62 88h36M66 102h28', ...SW(3) }, 'dark', { stroke: true }),
    ...flower(128, 106, 'purple').slice(1),
    s('path', { d: 'M128 116v14', ...SW(3) }, 'green', { stroke: true })
  ],
  desafiante: [
    ground(),
    s('path', { d: 'M84 136V20h62v116z' }, 'gray'),
    s('path', { d: 'M84 40h62M84 64h62M84 88h62M84 112h62M114 20v20M100 40v24M126 64v24M104 88v24', ...SW(2) }, 'dark', { stroke: true }),
    ...person(44, 136, 'red', { h: 46, w: 30, r: 13, accent: true }),
    s('path', { d: 'M30 98l-8 10 8 6M58 98l8 10-8 6', ...SW(6) }, 'skin', { stroke: true })
  ],
  'desintegración': [
    s('path', { d: 'M60 30a50 50 0 0 0 0 100z' }, 'purple', { accent: true }),
    s('path', { d: dots([[70, 40], [74, 58], [70, 76], [76, 94], [70, 112], [86, 50], [88, 72], [90, 100], [84, 120]], 7) }, 'purple'),
    s('path', { d: dots([[102, 44], [106, 70], [100, 92], [108, 116], [124, 60], [122, 98], [140, 80]], 4) }, 'pink'),
    s('path', { d: dots([[118, 32], [138, 52], [134, 116]], 2.5) }, 'gray')
  ],
  deudor: [
    ground(),
    ...person(56, 136, 'gray', { h: 48, w: 32, r: 13 }),
    s('path', { d: 'M40 120h10v10H40zM62 120h10v10H62z' }, 'white'),
    s('path', { d: 'M56 136q30 0 48-4', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 116, cy: 122, r: 16 }, 'black'),
    s('rect', { x: 92, y: 30, width: 50, height: 60, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M102 46h30M102 58h30M102 70h20', ...SW(3) }, 'white', { stroke: true })
  ],
  duplicar: [
    s('circle', { cx: 34, cy: 80, r: 20 }, 'orange'),
    arrow('M62 80h24M78 72l8 8-8 8'),
    s('circle', { cx: 120, cy: 52, r: 20 }, 'orange', { accent: true }),
    s('circle', { cx: 120, cy: 108, r: 20 }, 'orange'),
    s('path', { d: dots([[28, 74], [114, 46], [114, 102]], 4) }, 'cream')
  ],
  empecer: [
    s('path', { d: 'M50 20h60l36 126H14z' }, 'gray'),
    s('path', { d: 'M80 24v14M80 48v16M80 76v18', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M32 136v-44M128 136v-44', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 18, y: 86, width: 124, height: 20, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M38 86l-12 20M66 86l-12 20M94 86l-12 20M122 86l-12 20', ...SW(8, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true })
  ],
  escalofriante: [
    backdrop('navy'),
    s('circle', { cx: 118, cy: 40, r: 14 }, 'cream'),
    s('path', { d: 'M48 130V70a32 32 0 0 1 64 0v60l-10-10-12 10-10-10-10 10-12-10z' }, 'white', { accent: true }),
    s('path', { d: ells([[68, 72, 6, 9], [92, 72, 6, 9], [80, 96, 6, 8]]) }, 'dark'),
    s('path', { d: birds([[34, 36], [52, 48]]), ...SW(3) }, 'purple', { stroke: true })
  ],
  esclarecer: [
    backdrop('dark'),
    s('path', { d: 'M54 104l92-60v100H86z' }, 'cream'),
    s('rect', { x: 18, y: 96, width: 44, height: 22, rx: 4, transform: 'rotate(-30 40 107)' }, 'yellow', { accent: true }),
    s('path', { d: ring(112, 102, 12) + 'M120 110l14 14', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: sparkle(126, 70, 7) }, 'orange')
  ],
  excedente: [
    s('path', { d: 'M38 24h84l-10 104H48z' }, 'sky'),
    s('path', { d: 'M38 24q-6 20 -8 40M122 24q6 20 8 40', ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M38 24h84l-10 104H48z', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: ells([[38, 138, 22, 6], [122, 138, 22, 6]]) }, 'blue'),
    s('path', { d: drop(80, 18, 5) }, 'blue')
  ],
  'exención': [
    s('path', { d: rects([[58, 118, 50, 10], [58, 106, 50, 10], [58, 94, 50, 10]]) }, 'yellow'),
    s('path', { d: 'M30 40q50-30 100 0v30q0 40-50 66q-50-26-50-66z' }, 'green', { accent: true }),
    s('path', { d: 'M62 74l12 12 24-26', ...SW(8) }, 'white', { stroke: true }),
    s('path', { d: sparkle(24, 24, 8) + sparkle(136, 24, 8) }, 'yellow')
  ],
  exministro: [
    ground(),
    s('rect', { x: 22, y: 60, width: 40, height: 52, rx: 6 }, 'brown'),
    s('path', { d: 'M28 112v24M56 112v24M42 112v24', ...SW(5) }, 'dark', { stroke: true }),
    ...lean(110, 136, 8, 'navy', { h: 50, w: 30, r: 13 }),
    s('rect', { x: 96, y: 92, width: 38, height: 26, rx: 2 }, 'tan', { accent: true }),
    s('path', { d: 'M100 92l6-10h10', ...SW(3) }, 'green', { stroke: true })
  ],
  'eólico': [
    backdrop('sky'),
    s('path', { d: 'M14 128q66-30 132 0v18H14z' }, 'green'),
    s('path', { d: 'M56 120V56M116 122V72', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: leaflet(56, 56, -90, 34, 6) + leaflet(56, 56, 30, 34, 6) + leaflet(56, 56, 150, 34, 6) }, 'white', { accent: true }),
    s('path', { d: leaflet(116, 72, -60, 24, 5) + leaflet(116, 72, 60, 24, 5) + leaflet(116, 72, 180, 24, 5) }, 'white'),
    s('path', { d: dots([[56, 56], [116, 72]], 4) }, 'gray')
  ],
  falacia: [
    ground(),
    s('path', { d: rects([[50, 112, 60, 24], [54, 88, 52, 24]]) }, 'blue'),
    s('rect', { x: 58, y: 64, width: 48, height: 24, transform: 'rotate(-12 82 76)' }, 'red', { accent: true }),
    s('path', { d: 'M70 66l6 10-4 6 8 6', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 64, y: 36, width: 44, height: 24, transform: 'rotate(-22 86 48)' }, 'blue'),
    s('path', { d: 'M118 44l14-6M118 60l16 2', ...SW(3) }, 'gray', { stroke: true })
  ],
  fascinar: [
    backdrop('navy'),
    s('circle', { cx: 80, cy: 98, r: 40 }, 'yellow'),
    s('path', { d: star(64, 92, 12) + star(96, 92, 12) }, 'orange', { accent: true }),
    s('path', { d: 'M70 114q10 10 20 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(30, 34, 7) + sparkle(130, 30, 8) + sparkle(80, 28, 5) }, 'cream')
  ],
  fotografiar: [
    s('rect', { x: 18, y: 50, width: 124, height: 82, rx: 10 }, 'dark'),
    s('path', { d: 'M52 50l8-14h40l8 14z' }, 'dark'),
    s('circle', { cx: 80, cy: 90, r: 30 }, 'gray'),
    s('circle', { cx: 80, cy: 90, r: 18 }, 'blue', { accent: true }),
    s('rect', { x: 116, y: 60, width: 16, height: 10, rx: 2 }, 'yellow'),
    s('path', { d: rays(124, 40, 10, 22, 5, 200), ...SW(3) }, 'yellow', { stroke: true })
  ],
  fragilidad: [
    s('rect', { x: 22, y: 40, width: 116, height: 96, rx: 3 }, 'tan'),
    s('path', { d: 'M22 40l14-18h88l14 18z' }, 'brown'),
    s('path', { d: 'M62 58h36q0 24-18 26q-18-2-18-26zM80 84v24M68 110h24', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M74 58l6 10-4 6', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M22 124h116', ...SW(3) }, 'brown', { stroke: true })
  ],
  gong: [
    s('path', { d: 'M28 140V26h104v114M20 26h120', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M62 26v14M98 26v14', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 40 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 14 }, 'orange'),
    s('path', { d: ring(80, 80, 28), ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M138 122l-24-22', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 112, cy: 98, r: 8 }, 'red')
  ],
  'historiografía': [
    s('path', { d: rects([[18, 112, 90, 22]]) }, 'brown'),
    s('path', { d: rects([[26, 90, 76, 22]]) }, 'navy'),
    s('path', { d: rects([[22, 68, 82, 22]]) }, 'red'),
    s('path', { d: 'M18 123h90M26 101h76M22 79h82', ...SW(2) }, 'cream', { stroke: true }),
    s('rect', { x: 112, y: 60, width: 22, height: 76, rx: 10 }, 'cream'),
    s('path', { d: 'M112 70h22M112 126h22', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M56 64q20-40 60-50q-16 30-56 50z' }, 'orange', { accent: true })
  ],
  idem: [
    s('rect', { x: 18, y: 40, width: 52, height: 72, rx: 6 }, 'blue'),
    s('rect', { x: 90, y: 40, width: 52, height: 72, rx: 6 }, 'blue', { accent: true }),
    s('path', { d: star(44, 76, 14) + star(116, 76, 14) }, 'yellow'),
    s('path', { d: 'M44 124q36 24 72 0', ...DASH(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M106 120l10 4-4 10', ...SW(4) }, 'orange', { stroke: true })
  ],
  'idóneo': [
    s('path', { d: 'M18 30h124v100H18z' }, 'blue'),
    s('path', { d: 'M50 64h22a10 10 0 1 1 16 0h22v26a10 10 0 1 0 0 16v12H50z' }, 'white'),
    s('path', { d: 'M50 58h22a10 10 0 1 1 16 0h22v26a10 10 0 1 0 0 16v12H50z' }, 'orange', { accent: true }),
    s('path', { d: sparkle(130, 20, 8) + sparkle(28, 140, 7) }, 'yellow')
  ],
  impotente: [
    ground(),
    ...person(80, 136, 'gray', { h: 50, w: 34, r: 14 }),
    s('path', { d: 'M60 96h40M60 110h40', ...SW(5) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M72 74q8-6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: drop(104, 64, 4) }, 'sky'),
    s('path', { d: ells([[110, 24, 18, 9], [130, 28, 12, 7]]) }, 'gray')
  ],
  impredecible: [
    s('rect', { x: 20, y: 52, width: 56, height: 56, rx: 10, transform: 'rotate(-15 48 80)' }, 'red', { accent: true }),
    s('rect', { x: 86, y: 70, width: 50, height: 50, rx: 9, transform: 'rotate(20 111 95)' }, 'white'),
    s('rect', { x: 86, y: 70, width: 50, height: 50, rx: 9, transform: 'rotate(20 111 95)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[34, 70], [48, 80], [62, 90]], 5) }, 'white'),
    s('path', { d: dots([[100, 80], [122, 88], [112, 98], [102, 104], [124, 112]], 5) }, 'dark'),
    s('path', { d: 'M40 30q6-10 14-6M100 40q10-12 20-4', ...SW(3) }, 'gray', { stroke: true })
  ],
  infalible: [
    s('path', { d: 'M60 104l-14 36 16-8 10 12 6-36zM100 104l14 36-16-8-10 12-6-36z' }, 'blue'),
    s('path', { d: burst(80, 70, 52, 44, 16) }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 70, r: 36 }, 'yellow'),
    s('path', { d: 'M62 70l12 12 24-26', ...SW(9) }, 'green', { stroke: true })
  ],
  ingesta: [
    ...person(60, 136, 'blue', { h: 48, w: 32, r: 14 }),
    s('path', { d: 'M74 106l12-30', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M76 52h20l-3 30H79z' }, 'sky', { accent: true }),
    s('path', { d: 'M76 52h20l-3 30H79z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: drop(124, 60, 10) + drop(134, 98, 6) }, 'blue')
  ],
  invocar: [
    s('path', { d: 'M60 14h40l18 122H42z' }, 'cream'),
    s('path', { d: ells([[56, 22, 20, 10], [100, 22, 22, 10]]) }, 'gray'),
    ...person(80, 136, 'purple', { h: 44, w: 30, r: 13, accent: true }),
    s('path', { d: 'M68 100L52 62M92 100l16-38', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(80, 44, 9) + sparkle(36, 96, 6) + sparkle(124, 96, 6) }, 'yellow')
  ],
  'irritación': [
    backdrop('skin'),
    s('path', { d: 'M18 80q62-60 124 0q-62 60-124 0z' }, 'white'),
    s('path', { d: 'M32 72l14 4M34 92l12-4M128 70l-14 6M126 92l-12-4M40 66l8 8', ...SW(2) }, 'red', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 22 }, 'brown'),
    s('circle', { cx: 80, cy: 80, r: 10 }, 'dark'),
    s('path', { d: 'M18 80q62-60 124 0q-62 60-124 0z', ...SW(5) }, 'red', { stroke: true, accent: true })
  ],
  laburar: [
    ground(),
    ...person(60, 136, 'orange', { h: 50, w: 32, r: 13 }),
    s('path', { d: 'M44 64a16 16 0 0 1 32 0h4v4H40v-4z' }, 'yellow'),
    s('path', { d: rects([[78, 82, 34, 12], [82, 70, 34, 12], [78, 58, 34, 12]]) }, 'red', { accent: true }),
    s('path', { d: 'M72 96l10-8', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: drop(40, 70, 4) }, 'sky'),
    s('path', { d: rects([[112, 112, 30, 12], [116, 124, 30, 12]]) }, 'red')
  ],
  'marginación': [
    s('path', { d: ring(64, 80, 34), ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: dots(around(64, 80, 34, 6, -90), 12) }, 'blue'),
    s('circle', { cx: 130, cy: 124, r: 12 }, 'orange', { accent: true }),
    s('path', { d: 'M110 108l-8-8', ...SW(3) }, 'gray', { stroke: true })
  ],
  meteorito: [
    backdrop('navy'),
    s('path', { d: 'M24 24l70 56-12 12z' }, 'orange'),
    s('path', { d: 'M40 30l56 52-6 6z' }, 'yellow'),
    s('circle', { cx: 96, cy: 88, r: 18 }, 'brown', { accent: true }),
    s('path', { d: 'M14 128q66-20 132 0v18H14z' }, 'green'),
    s('path', { d: sparkle(130, 34, 6) + sparkle(120, 60, 4) }, 'cream')
  ],
  milagroso: [
    s('path', { d: 'M60 30h40l26 106H34z' }, 'cream'),
    s('path', { d: ells([[56, 26, 22, 10], [104, 26, 22, 10], [80, 20, 20, 10]]) }, 'gray'),
    ...flower(80, 96, 'pink'),
    s('path', { d: sparkle(44, 70, 8) + sparkle(118, 64, 9) + sparkle(110, 112, 6) }, 'yellow')
  ],
  miliciano: [
    ground(),
    s('path', { d: ells([[100, 128, 20, 8], [130, 128, 18, 8], [114, 114, 20, 8]]) }, 'tan'),
    ...person(56, 136, 'green', { h: 52, w: 34, r: 14 }),
    s('path', { d: 'M40 60q16-20 32 0z' }, 'green', { accent: true }),
    s('path', { d: 'M38 60h40', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M50 96h12M50 106h12', ...SW(3) }, 'dark', { stroke: true })
  ],
  modernismo: [
    s('rect', { x: 20, y: 20, width: 120, height: 120 }, 'white'),
    s('rect', { x: 20, y: 20, width: 60, height: 70 }, 'red', { accent: true }),
    s('rect', { x: 104, y: 104, width: 36, height: 36 }, 'blue'),
    s('rect', { x: 20, y: 112, width: 30, height: 28 }, 'yellow'),
    s('path', { d: 'M80 20v120M20 90h120M104 90v50M50 90v50M80 54h60', ...SW(5) }, 'black', { stroke: true }),
    s('rect', { x: 20, y: 20, width: 120, height: 120, ...SW(5) }, 'black', { stroke: true })
  ],
  'métrica': [
    s('rect', { x: 14, y: 94, width: 132, height: 30, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M26 94v14M40 94v8M54 94v14M68 94v8M82 94v14M96 94v8M110 94v14M124 94v8M138 94v14', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 64h16M60 64h16M96 64h16M132 64h8', ...SW(7) }, 'purple', { stroke: true }),
    s('path', { d: ring(50, 64, 5) + ring(86, 64, 5) + ring(122, 64, 5), ...SW(3) }, 'purple', { stroke: true }),
    s('path', { d: 'M32 44v8M68 44v8M104 44v8', ...SW(3) }, 'gray', { stroke: true })
  ],
  nafta: [
    s('path', { d: 'M36 40h58l30 26v68a6 6 0 0 1-6 6H42a6 6 0 0 1-6-6z' }, 'red', { accent: true }),
    s('path', { d: 'M50 40V28h26v12', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M106 50l12-18h10', ...SW(8) }, 'dark', { stroke: true }),
    s('rect', { x: 50, y: 64, width: 56, height: 58, rx: 6, ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: drop(136, 120, 6) }, 'yellow')
  ],
  narrativo: [
    s('path', { d: 'M52 76V48h12v-8h8v8h16v-8h8v8h12v28z' }, 'gray'),
    s('path', { d: 'M76 40V22', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M76 22l14 5-14 5z' }, 'red', { accent: true }),
    ...openBook(80, 76, 'cream', 'blue'),
    s('path', { d: sparkle(32, 50, 8) + sparkle(130, 44, 8) }, 'yellow')
  ]
};
