// Illustration specs for words still undrawn in batches 0066–0068 (see server/scripts/lexicon/art.js)
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
  malaria: [
    s('path', { d: 'M62 96l-14 30M74 98l-4 32M90 102l8 28M102 98l18 22', ...SW(3) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 70, cy: 62, rx: 24, ry: 11, transform: 'rotate(-62 70 62)' }, 'sky'),
    s('ellipse', { cx: 98, cy: 64, rx: 24, ry: 11, transform: 'rotate(-28 98 64)' }, 'sky'),
    s('ellipse', { cx: 82, cy: 92, rx: 36, ry: 9, transform: 'rotate(18 82 92)' }, 'dark'),
    s('circle', { cx: 44, cy: 80, r: 9 }, 'dark'),
    s('path', { d: 'M38 85L16 104', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: drop(130, 118, 10) }, 'red', { accent: true })
  ],
  'marqués': [
    ground(),
    s('path', { d: 'M62 82L44 136h72L98 82z' }, 'red'),
    ...person(80, 136, 'purple', { accent: true }),
    s('path', { d: 'M66 68l-2-16 8 7 8-11 8 11 8-7-2 16z' }, 'yellow'),
    s('path', { d: dots([[72, 59], [88, 59]], 2.5) }, 'red'),
    s('path', { d: 'M72 96h16', ...SW(4) }, 'yellow', { stroke: true })
  ],
  matadero: [
    ground(),
    s('rect', { x: 30, y: 64, width: 100, height: 72 }, 'tan'),
    s('path', { d: 'M20 68L80 28l60 40z' }, 'red', { accent: true }),
    s('rect', { x: 68, y: 104, width: 24, height: 32 }, 'dark'),
    s('circle', { cx: 80, cy: 84, r: 14 }, 'white'),
    outline({ cx: 80, cy: 84, r: 14 }, 'brown', 3),
    s('path', { d: 'M70 78h14v12H70z' }, 'gray'),
    s('path', { d: 'M84 83h9', ...SW(4) }, 'brown', { stroke: true })
  ],
  mayonesa: [
    s('rect', { x: 74, y: 14, width: 12, height: 18, rx: 3 }, 'red'),
    s('rect', { x: 62, y: 30, width: 36, height: 22, rx: 4 }, 'yellow'),
    s('path', { d: 'M56 52h48l8 84H48z' }, 'cream'),
    s('path', { d: 'M56 52h48l8 84H48z', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 56, y: 80, width: 48, height: 34, rx: 4 }, 'yellow', { accent: true }),
    s('ellipse', { cx: 80, cy: 97, rx: 14, ry: 11 }, 'white'),
    s('circle', { cx: 80, cy: 98, r: 6 }, 'orange')
  ],
  memo: [
    s('circle', { cx: 80, cy: 86, r: 48 }, 'skin', { accent: true }),
    s('path', { d: spiral(56, 76) + spiral(94, 76), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 106q24 18 48 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: drop(102, 120, 5) }, 'sky'),
    s('path', { d: 'M62 40q4-14 12-2M80 36q6-14 12 0', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: sparkle(26, 34, 10) + sparkle(136, 36, 8) }, 'yellow')
  ],
  mole: [
    s('ellipse', { cx: 80, cy: 96, rx: 64, ry: 36 }, 'white'),
    s('ellipse', { cx: 80, cy: 96, rx: 64, ry: 36, ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 80, cy: 94, rx: 48, ry: 24 }, 'brown', { accent: true }),
    s('path', { d: 'M58 82q14-12 34-4q14 8 4 20q-18 6-32-2q-14-6-6-14z' }, 'dark'),
    s('path', { d: dots([[62, 84], [76, 80], [90, 86], [70, 96], [100, 98], [56, 100], [104, 84]], 2.5) }, 'cream'),
    s('path', { d: 'M110 40q12 10 0 20M124 36q12 10 0 20', ...SW(3) }, 'gray', { stroke: true })
  ],
  mordida: [
    s('path', { d: 'M80 46q-14-10-30-6q-30 10-26 46q6 44 40 50q8-2 16-6q8 4 16 6q34-6 40-50q4-36-26-46q-16-4-30 6z' }, 'red', { accent: true }),
    s('path', { d: dots([[136, 74], [140, 98], [130, 118]], 14) }, 'white'),
    s('path', { d: 'M80 46q0-16 8-26', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M88 30q16-14 30-6q-14 14-30 6z' }, 'green'),
    s('path', { d: 'M122 66q-6 8 0 16M126 92q-6 8 0 16', ...SW(2) }, 'cream', { stroke: true })
  ],
  multimillonario: [
    ground(),
    ...person(80, 136, 'navy'),
    s('path', { d: 'M66 66V42h28v24zM58 62h44v5H58z' }, 'dark'),
    s('path', { d: 'M28 136q-8-26 10-34l-4-8h16l-4 8q18 8 10 34zM104 136q-8-26 10-34l-4-8h16l-4 8q18 8 10 34z' }, 'green'),
    s('path', { d: ells([[42, 132, 10, 3], [42, 126, 10, 3], [118, 132, 10, 3]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M72 92l8 6 8-6', ...SW(3) }, 'yellow', { stroke: true })
  ],
  nata: [
    s('path', { d: 'M44 86h72l-12 50H56z' }, 'pink'),
    s('path', { d: 'M42 88q-2-20 20-22q2-20 18-22q16 2 18 22q22 2 20 22z' }, 'white'),
    s('path', { d: 'M42 88q-2-20 20-22q2-20 18-22q16 2 18 22q22 2 20 22zM62 66q18 8 36 0', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 34q4-14 14-18', ...SW(3) }, 'green', { stroke: true }),
    s('circle', { cx: 80, cy: 36, r: 9 }, 'red', { accent: true })
  ],
  ocasionar: [
    ground(),
    s('rect', { x: 24, y: 90, width: 14, height: 46, rx: 2, transform: 'rotate(48 38 136)' }, 'navy'),
    s('rect', { x: 56, y: 90, width: 14, height: 46, rx: 2, transform: 'rotate(30 70 136)' }, 'navy'),
    s('rect', { x: 88, y: 90, width: 14, height: 46, rx: 2, transform: 'rotate(12 102 136)' }, 'navy'),
    s('rect', { x: 118, y: 90, width: 14, height: 46, rx: 2 }, 'red', { accent: true }),
        arrow('M30 52q40-26 80 0m-12 2 12-2-2-12')
  ],
  opio: [
    s('path', { d: 'M56 74v62M110 86v50', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: ells([[42, 58, 18, 15], [70, 58, 18, 15], [56, 44, 16, 14], [56, 70, 16, 12]]) }, 'red', { accent: true }),
    s('circle', { cx: 56, cy: 58, r: 8 }, 'dark'),
    s('ellipse', { cx: 110, cy: 72, rx: 16, ry: 18 }, 'mint'),
    s('path', { d: 'M96 58l6-8 4 6 4-8 4 8 4-6 6 8z' }, 'green'),
    s('path', { d: 'M106 66v16M114 66v16', ...SW(2) }, 'green', { stroke: true })
  ],
  'panorámico': [
    s('rect', { x: 12, y: 40, width: 136, height: 72, rx: 8 }, 'sky'),
    s('circle', { cx: 112, cy: 60, r: 10 }, 'yellow'),
    s('path', { d: 'M12 112V92l22-24 22 22 26-34 28 32 18-16 20 18v22z' }, 'green', { accent: true }),
    s('rect', { x: 12, y: 40, width: 136, height: 72, rx: 8, ...SW(4) }, 'dark', { stroke: true }),
    arrow('M30 130h100m-10-8 10 8-10 8M40 122l-10 8 10 8', 'orange', 5)
  ],
  papeleta: [
    s('rect', { x: 34, y: 76, width: 92, height: 60, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 34, y: 70, width: 92, height: 12, rx: 3 }, 'navy'),
    s('rect', { x: 62, y: 74, width: 36, height: 4 }, 'dark'),
    s('rect', { x: 66, y: 22, width: 28, height: 52, rx: 2, transform: 'rotate(-8 80 74)' }, 'white'),
    s('rect', { x: 66, y: 22, width: 28, height: 52, rx: 2, transform: 'rotate(-8 80 74)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M72 40l5 6 10-12', transform: 'rotate(-8 80 74)', ...SW(4) }, 'green', { stroke: true })
  ],
  perito: [
    ground(),
    ...person(52, 136, 'navy'),
    s('path', { d: 'M62 100l26-16', ...SW(7) }, 'navy', { stroke: true }),
    s('path', { d: 'M90 82l10-10', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 112, cy: 60, r: 18 }, 'sky'),
    s('path', { d: ring(112, 60, 18), ...SW(5) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: 'M102 108h40v28h-40z' }, 'tan'),
    s('path', { d: 'M108 56l6 4 6-8', ...SW(3) }, 'navy', { stroke: true })
  ],
  popularmente: [
    s('path', { d: heart(36, 50, 12) + heart(124, 50, 12) + heart(80, 42, 14) }, 'red', { accent: true }),
    s('path', { d: busts([28, 62, 98, 132], 136, 30, 34) }, 'blue'),
    s('path', { d: busts([45, 115], 136, 30, 26) }, 'orange'),
    s('path', { d: dots([[28, 90], [62, 90], [98, 90], [132, 90]], 11) }, 'skin'),
    s('path', { d: dots([[45, 100], [115, 100]], 11) }, 'tan')
  ],
  posguerra: [
    s('rect', { x: 14, y: 14, width: 132, height: 122, rx: 12 }, 'mint'),
    s('circle', { cx: 116, cy: 46, r: 16 }, 'yellow'),
    ground(),
    s('path', { d: 'M28 136q0-36 34-36t34 36z' }, 'gray'),
    s('path', { d: 'M22 136h80', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 100V64', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(62, 84, -30, 22, 7) + leaflet(62, 76, 210, 20, 6) }, 'green'),
    s('path', { d: dots([[56, 60], [68, 60], [62, 52], [62, 66]], 6) }, 'pink', { accent: true }),
    s('circle', { cx: 62, cy: 60, r: 4 }, 'yellow')
  ],
  previsible: [
    s('path', { d: 'M14 78q30-30 60 0q-30 30-60 0z' }, 'white'),
    s('path', { d: 'M14 78q30-30 60 0q-30 30-60 0z', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 44, cy: 78, r: 11 }, 'blue', { accent: true }),
    s('circle', { cx: 44, cy: 78, r: 5 }, 'dark'),
    s('path', { d: 'M78 78h34', ...DASH(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 128, cy: 78, r: 18 }, 'red'),
    s('circle', { cx: 128, cy: 78, r: 11 }, 'white'),
    s('circle', { cx: 128, cy: 78, r: 5 }, 'red')
  ],
  'prótesis': [
    ground(),
    s('path', { d: 'M60 14h40l-4 54H66z' }, 'skin'),
    s('path', { d: 'M62 62h36l-6 30H70z' }, 'blue', { accent: true }),
    s('rect', { x: 76, y: 90, width: 10, height: 34 }, 'gray'),
    s('rect', { x: 72, y: 100, width: 18, height: 6, rx: 2 }, 'dark'),
    s('path', { d: 'M70 122h18q24 4 36 10v4H70z' }, 'dark')
  ],
  puntero: [
    s('rect', { x: 14, y: 22, width: 132, height: 96, rx: 8 }, 'navy'),
    s('rect', { x: 22, y: 30, width: 116, height: 80, rx: 4 }, 'sky'),
    s('path', { d: 'M68 120h24l6 16H62z' }, 'gray'),
    s('path', { d: 'M58 40v58l14-13 10 22 10-4-10-22h20z' }, 'white', { accent: true }),
    s('path', { d: 'M58 40v58l14-13 10 22 10-4-10-22h20z', ...SW(3) }, 'dark', { stroke: true })
  ],
  rambla: [
    s('path', { d: 'M70 50h20l46 86H24z' }, 'tan'),
    s('path', { d: 'M76 50L48 136M84 50l28 86', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M34 128V96M126 128V96M60 72V56M100 72V56', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: ells([[34, 86, 18, 16], [126, 86, 18, 16], [60, 50, 10, 9], [100, 50, 10, 9]]) }, 'green', { accent: true }),
    s('path', { d: dots([[76, 92], [88, 106]], 5) }, 'skin'),
    s('path', { d: rects([[71, 98, 10, 14], [83, 112, 10, 14]]) }, 'red')
  ],
  reivindicar: [
    ground(),
    s('path', { d: 'M96 136V44', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 72, y: 18, width: 52, height: 34, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: heart(98, 31, 12) }, 'red'),
    ...person(52, 136, 'blue'),
    s('path', { d: 'M62 98l28-16', ...SW(7) }, 'blue', { stroke: true }),
    s('path', { d: 'M40 98l-12-26', ...SW(7) }, 'blue', { stroke: true }),
    s('circle', { cx: 27, cy: 68, r: 6 }, 'skin')
  ],
  resguardo: [
    s('path', { d: 'M38 20h68v108l-8.5-6-8.5 6-8.5-6-8.5 6-8.5-6-8.5 6-8.5-6-8.5 6z' }, 'white'),
    s('path', { d: 'M38 20h68v108l-8.5-6-8.5 6-8.5-6-8.5 6-8.5-6-8.5 6-8.5-6-8.5 6z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 36h48M48 50h36M48 64h44M48 78h30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 96h68', ...DASH(2, '4 4') }, 'gray', { stroke: true }),
    s('circle', { cx: 118, cy: 116, r: 20 }, 'green', { accent: true }),
    s('path', { d: 'M108 116l7 7 13-14', ...SW(5) }, 'white', { stroke: true })
  ],
  retratar: [
    ground(),
    s('path', { d: 'M100 136l12-96M132 136l-12-96M116 40v96', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 88, y: 30, width: 56, height: 62, rx: 2 }, 'cream'),
    s('rect', { x: 88, y: 30, width: 56, height: 62, rx: 2, ...SW(4) }, 'tan', { stroke: true }),
    ...face(116, 56, 14, 'pink', 'smile', { accent: true }),
    ...person(44, 136, 'orange'),
    s('path', { d: 'M54 100l24-20', ...SW(6) }, 'orange', { stroke: true })
  ],
  sacudir: [
    ground(),
    ...person(46, 136, 'green'),
    s('path', { d: 'M56 96l20-22', ...SW(7) }, 'green', { stroke: true }),
    s('path', { d: 'M74 70q14-14 30-4q14 10 30 0l-4 26q-16 8-30-2q-14-8-24 4z' }, 'red', { accent: true }),
    s('path', { d: dots([[116, 112], [130, 104], [104, 122], [140, 122]], 6) + dots([[124, 124], [142, 106]], 4) }, 'gray'),
    s('path', { d: 'M100 46l6-10M118 44l2-12M136 50l8-8', ...SW(4) }, 'gray', { stroke: true })
  ],
  satelital: [
    s('rect', { x: 14, y: 54, width: 40, height: 28, rx: 2, transform: 'rotate(-30 80 80)' }, 'blue', { accent: true }),
    s('rect', { x: 106, y: 54, width: 40, height: 28, rx: 2, transform: 'rotate(-30 80 80)' }, 'blue', { accent: true }),
    s('path', { d: 'M54 68h52', transform: 'rotate(-30 80 80)', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 64, y: 54, width: 32, height: 32, rx: 4, transform: 'rotate(-30 80 80)' }, 'gray'),
    s('path', { d: 'M70 92q10 18 26 10z' }, 'white'),
    s('path', { d: 'M70 92q10 18 26 10zM84 100l10 14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 120q8 6 14-2M98 132q16 10 26-6', ...SW(4) }, 'orange', { stroke: true })
  ],
  'saturación': [
    s('path', { d: 'M48 34h64l-8 102H56z' }, 'sky', { accent: true }),
    s('path', { d: 'M44 28h72l-10 108H54z', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M42 28q4-10 18-6q10-8 20-2q10-8 20 0q14-6 18 8q-4 8-12 6l-4 18q-4 6-6-2l-2-14H54q-6 16-10 4z' }, 'blue'),
    s('path', { d: drop(36, 74, 6) + drop(126, 82, 6) + drop(30, 112, 5) }, 'blue'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'sky', { stroke: true })
  ],
  secar: [
    s('path', { d: 'M38 46h50q12 0 12 14t-12 14H38z' }, 'red', { accent: true }),
    s('circle', { cx: 44, cy: 60, r: 18 }, 'red'),
    s('circle', { cx: 44, cy: 60, r: 8 }, 'dark'),
    s('path', { d: 'M40 76h14l6 40H46z' }, 'dark'),
    s('path', { d: 'M106 50q8-6 16 0t16 0M106 62q8-6 16 0t16 0M106 74q8-6 16 0t16 0', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: drop(122, 112, 8) }, 'sky'),
    s('path', { d: drop(140, 124, 4) }, 'sky')
  ],
  'sombrío': [
    backdrop('navy'),
    s('path', { d: 'M28 70q0-18 18-18q6-16 24-14q12-12 28 0q22-2 22 18q16 2 16 14H28z' }, 'gray', { accent: true }),
    s('path', { d: 'M40 136V112M40 112l-14-14M40 116l12-16', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M88 136v-32l14-12 14 12v32z' }, 'dark'),
    s('path', { d: 'M48 86l-4 10M70 86l-4 10M92 86l-4 10M114 86l-4 10', ...SW(3) }, 'sky', { stroke: true }),
    s('rect', { x: 98, y: 112, width: 8, height: 8 }, 'yellow'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'black', { stroke: true })
  ],
  'talón': [
    s('path', { d: 'M48 14h32v84q30 6 52 16q10 6 6 18q-2 4-8 4H52q-14 0-16-14q-2-12 12-20z' }, 'skin'),
    s('path', { d: 'M48 14h32v84q30 6 52 16q10 6 6 18q-2 4-8 4H52q-14 0-16-14q-2-12 12-20z', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: ring(52, 120, 18), ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M18 120h12M24 96l8 8M24 144l8-8', ...SW(4) }, 'red', { stroke: true })
  ],
  tanda: [
    s('circle', { cx: 80, cy: 44, r: 28 }, 'white'),
    s('path', { d: ring(80, 44, 28), ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 28v16l12 8', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: busts([36], 136, 34, 38) }, 'blue', { accent: true }),
    s('path', { d: busts([124], 136, 34, 38) }, 'orange'),
    s('path', { d: dots([[36, 96], [124, 96]], 13) }, 'skin'),
    arrow('M60 98q20-14 40 0m-10 0h10v-10M100 124q-20 14-40 0m10 0H60v10', 'green', 4)
  ],
  tijera: [
    s('path', { d: 'M62 96L118 20M98 96L42 20', ...SW(10) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 72, r: 4 }, 'dark'),
    s('path', { d: ring(56, 116, 16) + ring(104, 116, 16), ...SW(9) }, 'red', { stroke: true, accent: true })
  ],
  todopoderoso: [
    s('path', { d: rays(80, 92, 48, 66, 16), ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 92, r: 38 }, 'blue'),
    s('path', { d: 'M52 76q16-6 22 6q-2 14 12 16q8 12-4 22q-16-4-20-18q-12-6-10-26zM96 66q14 4 20 18q-10 4-14-2q-10 0-6-16z' }, 'green'),
    s('path', { d: 'M54 44l-4-30 16 14 14-20 14 20 16-14-4 30z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[66, 34], [80, 30], [94, 34]], 3) }, 'red')
  ],
  torero: [
    ground(),
    s('path', { d: 'M88 92q34-6 52 18q-6 22-26 26q-20-14-26-44z' }, 'red', { accent: true }),
    ...person(60, 136, 'yellow'),
    s('path', { d: 'M70 98l20-6', ...SW(7) }, 'yellow', { stroke: true }),
    s('path', { d: 'M46 66q14-12 28 0q-14-6-28 0z', ...SW(6) }, 'black', { stroke: true }),
    s('path', { d: 'M52 102h16M60 92v40', ...SW(3) }, 'orange', { stroke: true })
  ],
  trompeta: [
    s('path', { d: 'M22 74h72M38 74q-6 16 4 24h52', ...SW(8) }, 'yellow', { stroke: true }),
    s('path', { d: 'M94 70l46-24v76l-46-24z' }, 'yellow', { accent: true }),
    s('rect', { x: 14, y: 68, width: 10, height: 12, rx: 2 }, 'orange'),
    s('path', { d: 'M56 56v18M68 56v18M80 56v18', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: dots([[56, 54], [68, 54], [80, 54]], 5) }, 'orange'),
    s('ellipse', { cx: 140, cy: 84, rx: 5, ry: 38 }, 'orange')
  ],
  'túnica': [
    s('path', { d: 'M62 18h36l38 26-12 18-20-12v86H56V50L36 62 24 44z' }, 'purple', { accent: true }),
    s('path', { d: 'M68 18q12 14 24 0z' }, 'white'),
    s('path', { d: 'M68 18q12 14 24 0', ...SW(3) }, 'navy', { stroke: true }),
    s('rect', { x: 54, y: 78, width: 52, height: 10, rx: 3 }, 'yellow'),
    s('path', { d: 'M58 130h44', ...SW(4) }, 'yellow', { stroke: true })
  ],
  vandalismo: [
    s('rect', { x: 14, y: 22, width: 132, height: 114, rx: 6 }, 'tan'),
    s('path', { d: 'M14 52h132M14 82h132M14 112h132M50 22v30M100 22v30M30 52v30M80 52v30M126 52v30M50 82v30M100 82v30M30 112v24M80 112v24M126 112v24', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M26 74q14-26 26 0t26 0q10-22 22-4', ...SW(7) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M30 104q20 10 40-4', ...SW(6) }, 'green', { stroke: true }),
    s('rect', { x: 108, y: 74, width: 20, height: 40, rx: 4 }, 'red'),
    s('rect', { x: 113, y: 66, width: 10, height: 8 }, 'dark'),
    s('path', { d: 'M104 62l-8-6M106 54l-4-10', ...SW(3) }, 'purple', { stroke: true })
  ],
  vanidad: [
    s('path', { d: 'M74 116l-12 30', ...SW(10) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 84, cy: 70, rx: 42, ry: 50 }, 'pink'),
    s('ellipse', { cx: 84, cy: 70, rx: 34, ry: 42 }, 'sky'),
    ...face(84, 72, 22, 'skin', 'smile', { accent: true }),
    s('path', { d: 'M62 60q22-30 44 0q-10-10-22-10t-22 10z' }, 'brown'),
    s('path', { d: sparkle(30, 30, 10) + sparkle(138, 112, 9) + sparkle(138, 30, 6) }, 'yellow')
  ],
  vibrante: [
    s('path', { d: burst(80, 80, 62, 40, 12) }, 'orange'),
    s('path', { d: burst(80, 80, 42, 26, 9) }, 'yellow', { accent: true }),
    s('path', { d: 'M86 52l-16 30h14l-8 28 22-36H84l10-22z' }, 'red'),
    s('path', { d: 'M18 30q6 6 0 12t0 12M142 106q6 6 0 12t0 12', ...SW(4) }, 'purple', { stroke: true })
  ],
  virreinato: [
    backdrop('sky'),
    s('path', { d: 'M30 40q20-14 46-6q18 10 40 2q20 8 16 30q-10 16-4 34q-6 20-30 22q-18-4-24 6q-24 4-34-14q-12-16-6-32q-12-22-4-42z' }, 'green'),
    s('path', { d: 'M30 40q20-14 46-6q18 10 40 2q20 8 16 30q-10 16-4 34q-6 20-30 22q-18-4-24 6q-24 4-34-14q-12-16-6-32q-12-22-4-42z', ...DASH(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 92l-4-30 14 12 12-18 12 18 14-12-4 30z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[68, 82], [80, 80], [92, 82]], 3) }, 'red')
  ],
  yegua: [
    ...scaled(horse('brown', 'dark', { accent: true }), 0.8, 0, 26),
    ...scaled(horse('tan', 'brown'), 0.42, 82, 80)
  ],
  'óptimo': [
    s('path', { d: wedge(80, 112, 64, 180, 240) }, 'red'),
    s('path', { d: wedge(80, 112, 64, 240, 300) }, 'yellow'),
    s('path', { d: wedge(80, 112, 64, 300, 360) }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 112, r: 34 }, 'white'),
    s('path', { d: 'M80 112l40-30', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 112, r: 8 }, 'dark'),
    s('path', { d: star(124, 32, 12) }, 'yellow')
  ],
  acueducto: [
    s('rect', { x: 14, y: 22, width: 132, height: 114, rx: 8 }, 'sky'),
    s('rect', { x: 14, y: 40, width: 132, height: 96 }, 'tan', { accent: true }),
    s('path', { d: [20, 54, 88, 122].map(x => `M${x} 136v-34a12 12 0 0 1 24 0v34z`).join('') }, 'sky'),
    s('path', { d: [20, 54, 88, 122].map(x => `M${x + 3} 80v-14a9 9 0 0 1 18 0v14z`).join('') }, 'sky'),
    s('path', { d: 'M14 40h132', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M14 52h132M14 88h132', ...SW(2) }, 'brown', { stroke: true })
  ],
  'adecuación': [
    s('rect', { x: 18, y: 18, width: 124, height: 112, rx: 10 }, 'navy'),
    s('path', { d: 'M46 34v80M80 34v80M114 34v80', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 34, y: 82, width: 24, height: 12, rx: 4 }, 'orange'),
    s('rect', { x: 68, y: 50, width: 24, height: 12, rx: 4 }, 'green', { accent: true }),
    s('rect', { x: 102, y: 70, width: 24, height: 12, rx: 4 }, 'orange'),
    s('path', { d: 'M44 142h72', ...SW(4) }, 'gray', { stroke: true })
  ],
  aeronave: [
    backdrop('sky'),
    s('path', { d: ells([[40, 116, 22, 9], [58, 110, 14, 10], [118, 40, 18, 8], [130, 34, 10, 8]]) }, 'white'),
    s('path', { d: jet(0, 0), transform: 'translate(80 80) rotate(45) scale(2.6)' }, 'white'),
    s('path', { d: jet(0, 0), transform: 'translate(80 80) rotate(45) scale(2.6)', ...SW(1.2) }, 'navy', { stroke: true }),
    s('path', { d: 'M-1.5-12h3v18h-3z', transform: 'translate(80 80) rotate(45) scale(2.6)' }, 'red', { accent: true })
  ],
  antivirus: [
    s('path', { d: 'M92 22l44 16v34q0 40-44 64q-44-24-44-64V38z' }, 'green', { accent: true }),
    s('path', { d: 'M74 76l14 14 26-28', ...SW(8) }, 'white', { stroke: true }),
    s('path', { d: rays(32, 54, 10, 20, 8), ...SW(4) }, 'purple', { stroke: true }),
    s('circle', { cx: 32, cy: 54, r: 12 }, 'purple'),
    s('path', { d: dots([[28, 50], [36, 58]], 3) }, 'pink'),
    s('path', { d: 'M40 74l-4 10M50 66l8 4', ...SW(3) }, 'gray', { stroke: true })
  ],
  antro: [
    s('path', { d: 'M14 136V80q0-62 66-62t66 62v56z' }, 'brown'),
    s('path', { d: 'M34 136V84q0-44 46-44t46 44v52z' }, 'dark'),
    s('path', { d: 'M80 40v14', ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 64, r: 11 }, 'gray', { accent: true }),
    s('path', { d: 'M74 58h4v4h-4zM82 66h4v4h-4zM74 68h3v3h-3z' }, 'white'),
    s('path', { d: 'M70 74l-26 48M90 74l30 46', ...SW(5) }, 'purple', { stroke: true }),
    s('path', { d: dots([[54, 106], [102, 100], [80, 120]], 4) }, 'pink'),
    s('path', { d: dots([[64, 92], [96, 124], [110, 88]], 3) }, 'yellow')
  ],
  aristocracia: [
    s('path', { d: 'M14 136h132v-12H14z' }, 'red'),
    s('path', { d: busts([52, 108], 124, 40, 50) }, 'purple', { accent: true }),
    s('path', { d: 'M40 82l12 10 12-10M96 82l12 10 12-10', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: dots([[52, 62], [108, 62]], 15) }, 'skin'),
    s('path', { d: 'M40 46l-2-16 8 6 6-10 6 10 8-6-2 16zM96 46l-2-16 8 6 6-10 6 10 8-6-2 16z' }, 'yellow'),
    s('path', { d: 'M80 124V96', ...SW(3) }, 'yellow', { stroke: true })
  ],
  atuendo: [
    s('path', { d: 'M80 14q-8 0-8 8M80 22L40 40h80z', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 40h28l4 32 32 64H30l32-64z' }, 'pink', { accent: true }),
    s('path', { d: 'M62 72h36', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M70 40q10 12 20 0', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: dots([[60, 100], [80, 112], [100, 100], [70, 124], [92, 126]], 3) }, 'white'),
    s('path', { d: sparkle(30, 50, 10) + sparkle(132, 60, 8) }, 'yellow')
  ],
  avalancha: [
    backdrop('sky'),
    s('path', { d: 'M14 136L60 30l86 106z' }, 'gray'),
    s('path', { d: 'M46 62L60 30l22 28-12-6-10 10-8-6z' }, 'white'),
    s('path', { d: 'M70 70q20 0 30 20q20 6 26 30q-30 4-50-14q-16-14-6-36z' }, 'white', { accent: true }),
    s('path', { d: dots([[110, 112], [128, 96], [96, 120]], 7) }, 'white'),
    s('path', { d: ring(110, 112, 7) + ring(128, 96, 7) + ring(96, 120, 7) + 'M70 70q20 0 30 20q20 6 26 30', ...SW(2) }, 'sky', { stroke: true })
  ],
  'benéfico': [
    s('rect', { x: 34, y: 84, width: 92, height: 52, rx: 6 }, 'blue'),
    s('rect', { x: 62, y: 84, width: 36, height: 6, rx: 3 }, 'navy'),
    s('path', { d: heart(80, 54, 22) }, 'red', { accent: true }),
    s('path', { d: 'M28 50q8-12 22-4l12 8', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M132 50q-8-12-22-4l-12 8', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 110, 10) }, 'white')
  ],
  bombo: [
    s('circle', { cx: 74, cy: 86, r: 52 }, 'red', { accent: true }),
    s('circle', { cx: 74, cy: 86, r: 42 }, 'cream'),
    s('path', { d: dots(around(74, 86, 47, 10), 3) }, 'yellow'),
    s('path', { d: 'M100 20l40 44', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 104, cy: 26, r: 10 }, 'white'),
    outline({ cx: 104, cy: 26, r: 10 }, 'gray', 3)
  ],
  calumnia: [
    s('path', { d: busts([36], 136, 36, 40) }, 'green'),
    s('circle', { cx: 36, cy: 88, r: 14 }, 'skin'),
    s('path', { d: busts([124], 136, 36, 40) }, 'gray'),
    ...face(124, 88, 14, 'skin', 'frown'),
    s('path', { d: bubble(44, 18, 72, 44) }, 'dark', { accent: true }),
    s('path', { d: 'M62 40q6-10 12 0t12 0t12 0', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M104 30l-6 10h6l-6 10', ...SW(3) }, 'yellow', { stroke: true })
  ],
  cansar: [
    s('circle', { cx: 80, cy: 82, r: 50 }, 'skin', { accent: true }),
    s('path', { d: 'M52 72q8 6 16 0M92 72q8 6 16 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 82q8 4 16 0M92 82q8 4 16 0', ...SW(3) }, 'purple', { stroke: true }),
    s('ellipse', { cx: 80, cy: 108, rx: 10, ry: 13 }, 'dark'),
    s('path', { d: drop(124, 50, 7) + drop(36, 58, 5) }, 'sky'),
    s('path', { d: 'M64 28q16 10 32 0', ...SW(4) }, 'brown', { stroke: true })
  ],
  conmovedor: [
    ...face(80, 62, 42, 'skin', 'smile'),
    s('path', { d: 'M56 56q8-6 16 0M88 56q8-6 16 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: drop(60, 80, 5) + drop(102, 84, 5) }, 'sky'),
    s('path', { d: heart(80, 120, 20) }, 'red', { accent: true }),
    s('path', { d: 'M36 140q10-20 30-14M124 140q-10-20-30-14', ...SW(10) }, 'skin', { stroke: true })
  ],
  'cordobés': [
    s('rect', { x: 14, y: 26, width: 132, height: 110, rx: 6 }, 'cream'),
    s('path', { d: 'M24 136V78a28 28 0 1 1 56 0v58M80 136V78a28 28 0 1 1 56 0v58', ...SW(14) }, 'white', { stroke: true }),
    s('path', { d: 'M24 136V78a28 28 0 1 1 56 0v58M80 136V78a28 28 0 1 1 56 0v58', ...SW(14, { 'stroke-linecap': 'butt', 'stroke-dasharray': '9 9' }) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M24 136V96M80 136V96M136 136V96', ...SW(8) }, 'tan', { stroke: true }),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'brown', { stroke: true })
  ],
  'coreografía': [
    s('rect', { x: 14, y: 116, width: 132, height: 22, rx: 4 }, 'tan'),
    ...lean(52, 116, -14, 'pink', { h: 40, w: 24, r: 11, accent: true }),
    ...lean(110, 116, 14, 'blue', { h: 40, w: 24, r: 11 }),
    s('path', { d: 'M38 74l-14-22M124 74l14-22', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M44 132q36 10 72 0', ...DASH(3) }, 'brown', { stroke: true }),
    ...note(78, 44, 'purple')
  ],
  'cúbico': [
    s('path', { d: 'M80 22l52 28-52 28-52-28z' }, 'sky', { accent: true }),
    s('path', { d: 'M28 50l52 28v60l-52-28z' }, 'blue'),
    s('path', { d: 'M132 50l-52 28v60l52-28z' }, 'navy'),
    s('path', { d: 'M80 22l52 28v60l-52 28-52-28V50zM80 78v60M28 50l52 28 52-28', ...SW(3) }, 'dark', { stroke: true })
  ],
  defensivo: [
    s('path', { d: 'M80 22l44 14v38q0 38-44 62q-44-24-44-62V36z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 34l32 10v30q0 28-32 48z' }, 'navy'),
    s('path', { d: 'M14 46l24 14M14 90l22 2M18 128l20-14', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 60l-8 0M38 60l-2-8M36 92l-6 6M36 92l-6-6M38 114l-8-2M38 114l0 8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: burst(132, 84, 12, 5, 7) }, 'yellow')
  ],
  descaro: [
    s('circle', { cx: 80, cy: 80, r: 54 }, 'skin', { accent: true }),
    s('circle', { cx: 60, cy: 66, r: 6 }, 'dark'),
    s('path', { d: 'M92 66q8-6 16 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 96q28 20 56 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M70 102h22v12q-11 14-22 0z' }, 'red'),
    s('path', { d: 'M48 46l20 6M92 50l20-8', ...SW(4) }, 'brown', { stroke: true })
  ],
  desmadre: [
    ground(),
    ...lean(80, 128, 14, 'orange', { h: 34, w: 24, r: 10, accent: true }),
    s('path', { d: 'M74 102l-24-20M88 100l24-22', ...SW(6) }, 'orange', { stroke: true }),
    s('rect', { x: 18, y: 112, width: 22, height: 16, rx: 2, transform: 'rotate(-20 29 120)' }, 'blue'),
    s('circle', { cx: 132, cy: 124, r: 12 }, 'red'),
    s('path', { d: 'M22 30h20v24H22zM118 30l18 8-8 18-18-8z' }, 'yellow'),
    s('path', { d: 'M54 26l8 10M100 22l-6 10M36 70l10 2M132 74l-10 4', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 130h-24l6-8z' }, 'green')
  ],
  dictatorial: [
    ground(),
    s('rect', { x: 26, y: 84, width: 54, height: 52, rx: 3 }, 'brown'),
    ...person(53, 84, 'dark', { h: 38, w: 28, r: 12 }),
    s('path', { d: 'M66 54l34-12', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 42l14-4', ...SW(4) }, 'skin', { stroke: true }),
    s('path', { d: busts([98, 120, 142], 136, 18, 20) }, 'gray'),
    s('path', { d: dots([[98, 120], [120, 120], [142, 120]], 6) }, 'skin'),
    s('path', { d: 'M53 22l-4-6M44 26l-8-2M62 26l8-2', ...SW(3) }, 'red', { stroke: true, accent: true })
  ],
  divinidad: [
    s('path', { d: rays(80, 70, 40, 62, 16), ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 70, r: 34 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 70, r: 22 }, 'cream'),
    s('path', { d: 'M14 136q0-22 26-22q10-18 30-10q14-16 34-2q22-6 30 14q12 2 12 20z' }, 'white'),
    s('path', { d: 'M14 136q0-22 26-22q10-18 30-10q14-16 34-2q22-6 30 14q12 2 12 20', ...SW(3) }, 'sky', { stroke: true })
  ],
  doquier: [
    s('circle', { cx: 80, cy: 82, r: 56 }, 'sky'),
    s('path', { d: 'M38 56q18-16 34-4q-2 18 10 20q2 22-14 26q-12-10-14-24q-12-6-16-18zM96 40q22 2 34 26q-8 12-20 4q-10 6-12-10q-8-8-2-20zM92 104q16-8 28 4q-6 18-24 16z' }, 'green'),
    ...[[56, 62], [110, 54], [100, 104], [70, 100], [124, 82]].map(([x, y], i) => s('path', { d: `M${x} ${y}c-10-12-10-24 0-24s10 12 0 24z` }, 'red', i ? {} : { accent: true })),
    s('path', { d: dots([[56, 48], [110, 40], [100, 90], [70, 86], [124, 68]], 3) }, 'white')
  ],
  'dueña': [
    ground(),
    s('rect', { x: 92, y: 60, width: 48, height: 76 }, 'tan'),
    s('path', { d: 'M86 62l30-26 30 26z' }, 'brown'),
    s('rect', { x: 106, y: 98, width: 20, height: 38 }, 'brown'),
    ...lady(50, 136, 'red', { accent: true }),
    s('path', { d: ring(78, 82, 7), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M78 89v20M78 102h6M78 108h5', ...SW(4) }, 'yellow', { stroke: true })
  ],
  epa: [
    ground(),
    ...person(64, 136, 'green', { accent: true }),
    s('path', { d: 'M76 96l18-36', ...SW(7) }, 'green', { stroke: true }),
    s('circle', { cx: 96, cy: 54, r: 8 }, 'skin'),
    s('path', { d: 'M108 44q8 8 0 18M118 38q12 14 0 28', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: burst(124, 108, 16, 8, 8) }, 'yellow'),
    s('path', { d: 'M56 74h4M68 74h4M58 84q6 6 12 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  estandarte: [
    s('path', { d: 'M46 140V22', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 46, cy: 18, r: 7 }, 'yellow'),
    s('path', { d: 'M50 30h80v86l-20-16-20 16-20-16-20 16z' }, 'red', { accent: true }),
    s('path', { d: 'M50 30h80', ...SW(6) }, 'yellow', { stroke: true }),
    s('circle', { cx: 90, cy: 68, r: 18 }, 'yellow'),
    s('path', { d: star(90, 68, 11) }, 'red')
  ],
  euforia: [
    ground(),
    ...person(80, 118, 'pink', { accent: true }),
    s('path', { d: 'M70 80L50 46M90 80l20-34M72 118l-10 16M88 118l10 16', ...SW(7) }, 'pink', { stroke: true }),
    s('path', { d: dots([[48, 42], [112, 42]], 6) }, 'skin'),
    s('path', { d: 'M74 62q6 6 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: rects([[24, 30, 8, 5], [130, 70, 8, 5], [40, 90, 6, 6]]) }, 'blue'),
    s('path', { d: rects([[132, 24, 6, 8], [22, 64, 8, 6], [118, 100, 5, 7]]) }, 'yellow'),
    s('path', { d: rects([[78, 18, 6, 6], [30, 112, 6, 4]]) }, 'green')
  ],
  excepcionalmente: [
    s('path', { d: dots([[32, 40], [64, 40], [96, 40], [128, 40], [32, 80], [64, 80], [128, 80], [32, 120], [64, 120], [96, 120], [128, 120]], 12) }, 'gray'),
    s('circle', { cx: 96, cy: 80, r: 20 }, 'yellow'),
    s('path', { d: star(96, 80, 16) }, 'orange', { accent: true })
  ],
  exclusividad: [
    s('path', { d: 'M62 136h36l12-84H50z' }, 'red'),
    s('path', { d: 'M24 136v-56M136 136v-56', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[24, 78], [136, 78]], 7) }, 'yellow'),
    s('path', { d: 'M18 136h12M130 136h12', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M28 84q52 34 104 0', ...SW(7) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: star(80, 34, 16) }, 'yellow')
  ],
  exhaustivo: [
    s('rect', { x: 30, y: 24, width: 84, height: 112, rx: 6 }, 'brown'),
    s('rect', { x: 38, y: 34, width: 68, height: 96, rx: 2 }, 'white'),
    s('rect', { x: 56, y: 18, width: 32, height: 14, rx: 3 }, 'gray'),
    s('path', { d: 'M44 52l5 5 9-10M44 76l5 5 9-10M44 100l5 5 9-10', ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M64 52h34M64 76h34M64 100h34', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 116, cy: 112, r: 16 }, 'sky'),
    s('path', { d: ring(116, 112, 16) + 'M128 124l12 12', ...SW(6) }, 'dark', { stroke: true })
  ],
  'extrañamente': [
    backdrop('sky'),
    s('path', { d: 'M48 34h64v52H48z' }, 'yellow', { accent: true }),
    s('path', { d: 'M40 86h80l-40 36z' }, 'red'),
    s('rect', { x: 70, y: 34, width: 20, height: 28 }, 'brown'),
    s('path', { d: rects([[54, 64, 14, 12], [92, 64, 14, 12]]) }, 'white'),
    s('path', { d: 'M24 46q6 6 0 12M136 46q-6 6 0 12M58 130q22 8 44 0', ...SW(4) }, 'navy', { stroke: true })
  ],
  faena: [
    ground(),
    s('path', { d: 'M90 136q-4-36 26-36t28 36z' }, 'yellow', { accent: true }),
    s('path', { d: 'M96 118h44M100 106h38', ...SW(2) }, 'orange', { stroke: true }),
    ...person(54, 136, 'blue'),
    s('path', { d: 'M30 132L82 26', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M76 22l4-10M82 26l8-8M86 30l10-4', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 62q14-14 28 0z' }, 'tan'),
    s('path', { d: 'M62 100l10-24', ...SW(7) }, 'blue', { stroke: true })
  ],
  falange: [
    s('rect', { x: 36, y: 88, width: 84, height: 50, rx: 16 }, 'skin'),
    s('path', { d: rects([[38, 34, 18, 64], [60, 20, 18, 78], [82, 26, 18, 72], [104, 42, 16, 56]]) }, 'skin'),
    s('path', { d: 'M120 112l18-22', ...SW(16) }, 'skin', { stroke: true }),
    s('path', { d: rects([[61, 22, 16, 22], [61, 48, 16, 22], [61, 74, 16, 22]]) }, 'pink', { accent: true }),
    s('path', { d: 'M40 56h14M40 76h14M84 50h14M84 72h14M106 62h12M106 80h12', ...SW(3) }, 'tan', { stroke: true })
  ],
  ficticio: [
    ...openBook(80, 90),
    s('path', { d: 'M48 70q0-14 14-14q4-12 18-10q12-8 22 4q16 0 16 20z' }, 'white'),
    s('path', { d: 'M48 70q0-14 14-14q4-12 18-10q12-8 22 4q16 0 16 20z', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M64 60V36h8v6h6v-6h6v6h6v-6h8v24z' }, 'purple', { accent: true }),
    s('path', { d: 'M80 36V18l12 5-12 5', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: sparkle(30, 40, 9) + sparkle(130, 34, 9) }, 'yellow')
  ],
  fiera: [
    s('path', { d: burst(80, 80, 66, 46, 16) }, 'orange'),
    s('circle', { cx: 80, cy: 82, r: 40 }, 'yellow', { accent: true }),
    s('path', { d: dots([[64, 70], [96, 70]], 5) }, 'dark'),
    s('path', { d: 'M62 60l12 6M98 60l-12 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 92q16-10 32 0q-4 22-16 22t-16-22z' }, 'dark'),
    s('path', { d: 'M68 94l4 8 4-8zM84 94l4 8 4-8z' }, 'white'),
    s('path', { d: 'M74 82h12l-6 6z' }, 'brown')
  ],
  folio: [
    s('path', { d: 'M40 18h56l26 26v96H40z' }, 'white'),
    s('path', { d: 'M96 18v26h26z' }, 'gray'),
    s('path', { d: 'M40 18h56l26 26v96H40z', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 62h58M52 78h58M52 94h58M52 110h40', ...SW(4) }, 'blue', { stroke: true, accent: true })
  ],
  fugaz: [
    backdrop('navy'),
    s('path', { d: 'M28 126L96 60', ...SW(10) }, 'sky', { stroke: true }),
    s('path', { d: 'M40 130L98 72M24 110l70-62', ...SW(3) }, 'purple', { stroke: true }),
    s('path', { d: star(106, 52, 24) }, 'yellow', { accent: true }),
    s('path', { d: dots([[36, 36], [130, 112], [60, 52], [128, 26]], 2.5) }, 'white')
  ],
  'férreo': [
    s('path', { d: 'M22 30h116v18H92v64h46v18H22v-18h46V48H22z' }, 'gray', { accent: true }),
    s('path', { d: 'M22 30h116v18H92v64h46v18H22v-18h46V48H22z', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[34, 39], [126, 39], [34, 121], [126, 121], [80, 64], [80, 96]], 4) }, 'dark'),
    s('path', { d: sparkle(116, 76, 10) }, 'white')
  ],
  gelatina: [
    s('ellipse', { cx: 80, cy: 128, rx: 62, ry: 12 }, 'sky'),
    s('path', { d: 'M38 124l6-58q2-24 36-24t36 24l6 58z' }, 'red', { accent: true }),
    s('path', { d: 'M44 82h72M42 104h76', ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: 'M56 56q2-6 10-8', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M24 64q-6 10 0 20M136 64q6 10 0 20', ...SW(4) }, 'gray', { stroke: true })
  ],
  golazo: [
    s('path', { d: 'M22 138V30h116v108', ...SW(8) }, 'white', { stroke: true }),
    s('path', { d: 'M22 138V30h116v108', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 38h100M30 62h100M30 86h100M30 110h100M50 34v104M80 34v104M110 34v104', ...SW(1.5) }, 'gray', { stroke: true }),
    s('path', { d: burst(110, 58, 30, 16, 10) }, 'yellow', { accent: true }),
    s('circle', { cx: 110, cy: 58, r: 15 }, 'white'),
    s('path', { d: ring(110, 58, 15) + 'M104 52h12l3 10-9 6-9-6z', ...SW(3) }, 'dark', { stroke: true })
  ],
  graduar: [
    ground(),
    ...person(70, 136, 'navy', { accent: true }),
    s('path', { d: 'M70 44l26 8-26 8-26-8z' }, 'black'),
    s('path', { d: 'M92 54v12', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M82 104l26-22', ...SW(7) }, 'navy', { stroke: true }),
    s('rect', { x: 102, y: 66, width: 34, height: 12, rx: 6, transform: 'rotate(-40 119 72)' }, 'cream'),
    s('path', { d: 'M114 70v10', transform: 'rotate(-40 119 72)', ...SW(4) }, 'red', { stroke: true })
  ],
  'grúa': [
    ground(),
    s('rect', { x: 18, y: 92, width: 74, height: 28, rx: 4 }, 'yellow', { accent: true }),
    s('path', { d: 'M24 92V70h28v22z' }, 'sky'),
    s('path', { d: 'M74 92l42-40', ...SW(7) }, 'orange', { stroke: true }),
    s('path', { d: 'M116 52v28', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: dots([[38, 122], [76, 122]], 10) }, 'dark'),
    ...scaled(car(0, 0, 'blue'), 0.7, 98, 86).map(sh => ({ ...sh, attrs: { ...sh.attrs, transform: sh.attrs.transform + ' rotate(-20 30 10)' } }))
  ],
  humillante: [
    s('circle', { cx: 80, cy: 84, r: 50 }, 'skin'),
    s('path', { d: 'M40 70q-6-30 18-34q8-14 24-6q14-8 26 4q20 4 14 34q-14-8-20 4q-12-10-22 2q-12-10-20 6q-10-12-20-10z' }, 'cream', { accent: true }),
    s('path', { d: 'M40 70q-6-30 18-34q8-14 24-6q14-8 26 4q20 4 14 34q-14-8-20 4q-12-10-22 2q-12-10-20 6q-10-12-20-10z', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M58 90q6-4 12 0M92 90q6-4 12 0M66 114q14-8 28 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[50, 102, 8, 5], [110, 102, 8, 5]]) }, 'pink'),
    s('path', { d: dots([[46, 86], [118, 72]], 5) }, 'cream')
  ],
  igualitario: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 136l14-26 14 26z' }, 'brown'),
    s('rect', { x: 18, y: 104, width: 124, height: 8, rx: 3 }, 'orange', { accent: true }),
    ...person(40, 104, 'blue', { h: 36, w: 24, r: 11 }),
    ...person(120, 104, 'red', { h: 36, w: 24, r: 11 })
  ],
  impartir: [
    s('rect', { x: 18, y: 18, width: 96, height: 62, rx: 4 }, 'green', { accent: true }),
    s('rect', { x: 18, y: 18, width: 96, height: 62, rx: 4, ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M30 62l14-24 14 24zM70 50a10 10 0 1 0 20 0a10 10 0 1 0-20 0', ...SW(3) }, 'white', { stroke: true }),
    ...person(130, 136, 'purple', { h: 40, w: 24, r: 11 }),
    s('path', { d: 'M120 104l-22-30', ...SW(6) }, 'purple', { stroke: true }),
    s('path', { d: busts([32, 66], 136, 26, 28) }, 'orange'),
    s('path', { d: dots([[32, 106], [66, 106]], 10) }, 'skin')
  ],
  inferioridad: [
    ground(),
    ...person(100, 136, 'navy', { h: 70, w: 40, r: 18 }),
    ...person(38, 136, 'gray', { h: 26, w: 18, r: 9, accent: true }),
    s('path', { d: 'M33 96q5 4 10 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: drop(52, 88, 3) }, 'sky')
  ],
  'inflexión': [
    s('path', { d: 'M22 20v116h120', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 120C78 124 82 40 136 36', ...SW(6) }, 'blue', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 10 }, 'red', { accent: true }),
    s('path', { d: 'M80 92v40', ...DASH(3, '4 5') }, 'red', { stroke: true })
  ],
  inhumano: [
    s('path', { d: heart(80, 76, 40) }, 'gray', { accent: true }),
    s('path', { d: 'M80 44l-8 14 12 10-8 16 4 14', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M16 130h128', ...SW(8, { 'stroke-dasharray': '14 6' }) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 116l8 14M120 116l-8 14', ...SW(5) }, 'dark', { stroke: true })
  ],
  'iraquí': [
    s('rect', { x: 14, y: 14, width: 132, height: 122, rx: 12 }, 'cream'),
    s('path', { d: 'M24 136v-20h80v20zM34 116V96h60v20zM46 96V78h36v18z' }, 'tan', { accent: true }),
    s('path', { d: 'M58 78V64h12v14z' }, 'brown'),
    s('path', { d: 'M60 136l4-40M68 136l-4-40', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M124 136q-4-40 4-80', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(128, 56, 200, 26, 6) + leaflet(128, 56, 160, 24, 6) + leaflet(128, 56, -20, 24, 6) + leaflet(128, 56, 20, 22, 6) + leaflet(128, 56, -90, 18, 5) }, 'green'),
    s('path', { d: 'M14 136q30-8 60 0t72 0', ...SW(5) }, 'blue', { stroke: true })
  ],
  irresponsabilidad: [
    ground(),
    s('rect', { x: 92, y: 98, width: 48, height: 38 }, 'gray'),
    s('rect', { x: 98, y: 72, width: 36, height: 24, rx: 3 }, 'dark'),
    s('path', { d: 'M100 72q-4-14 6-18M116 72q0-14 8-20M130 72q4-10 0-16', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: burst(116, 92, 14, 7, 7) }, 'orange', { accent: true }),
    ...person(44, 136, 'green'),
    s('rect', { x: 34, y: 70, width: 12, height: 20, rx: 2 }, 'dark'),
    s('path', { d: 'M32 102l6-14', ...SW(6) }, 'green', { stroke: true })
  ],
  jarabe: [
    s('rect', { x: 34, y: 40, width: 50, height: 96, rx: 10 }, 'brown', { accent: true }),
    s('rect', { x: 46, y: 22, width: 26, height: 20, rx: 3 }, 'white'),
    outline({ x: 46, y: 22, width: 26, height: 20, rx: 3 }),
    s('rect', { x: 40, y: 72, width: 38, height: 34, rx: 3 }, 'white'),
    s('path', { d: 'M59 80v18M50 89h18', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M96 120l40-40', ...SW(5) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 98, cy: 118, rx: 14, ry: 9, transform: 'rotate(-45 98 118)' }, 'gray'),
    s('ellipse', { cx: 98, cy: 118, rx: 9, ry: 5, transform: 'rotate(-45 98 118)' }, 'pink')
  ],
  kilogramo: [
    s('path', { d: ring(80, 40, 16), ...SW(9) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 54h52l20 82H34z' }, 'dark', { accent: true }),
    s('path', { d: 'M62 66h8l-12 56h-8z' }, 'gray'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  liquidar: [
    s('path', { d: 'M24 46l40-28h70v56l-40 40-70-40z', transform: 'rotate(10 80 70)' }, 'red', { accent: true }),
    s('circle', { cx: 112, cy: 34, r: 7 }, 'white'),
    s('path', { d: 'M78 38v52m-16-16 16 18 16-18', ...SW(8) }, 'white', { stroke: true }),
    s('path', { d: 'M36 112h40l-4 28H40z' }, 'yellow'),
    s('path', { d: 'M46 112q0-14 10-14t10 14', ...SW(4) }, 'orange', { stroke: true })
  ],
  lucero: [
    s('rect', { x: 14, y: 14, width: 132, height: 122, rx: 12 }, 'navy'),
    s('path', { d: 'M14 104q66-20 132 0v20q0 12-12 12H26q-12 0-12-12z' }, 'orange'),
    s('path', { d: 'M14 120q40-18 70 0t62-4v8q0 12-12 12H26q-12 0-12-12z' }, 'dark'),
    s('path', { d: sparkle(100, 52, 26) }, 'white', { accent: true }),
    s('circle', { cx: 100, cy: 52, r: 6 }, 'yellow'),
    s('path', { d: dots([[40, 40], [58, 70], [130, 84]], 2) }, 'white')
  ],
  'maduración': [
    s('path', { d: 'M14 120h132', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 32, cy: 100, r: 16 }, 'green'),
    s('circle', { cx: 80, cy: 98, r: 18 }, 'orange'),
    s('circle', { cx: 128, cy: 96, r: 20 }, 'red', { accent: true }),
    s('path', { d: 'M26 84l6 4 6-4M74 80l6 4 6-4M122 76l6 4 6-4', ...SW(4) }, 'green', { stroke: true }),
    arrow('M30 54q50-26 100 0m-12 2 12-2-2-12', 'gray', 5)
  ],
  mafioso: [
    ground(),
    ...person(80, 136, 'black', { h: 52, w: 36, r: 14, accent: true }),
    s('path', { d: 'M80 84l-8 10 8 34 8-34z' }, 'white'),
    s('path', { d: 'M80 92l-4 6 4 24 4-24z' }, 'red'),
    s('path', { d: 'M58 54h44M66 54q0-20 14-20t14 20', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 56q4 0 6 8h-12q2-8 6-8zM94 56q-4 0-6 8h12q-2-8-6-8z' }, 'black'),
    s('path', { d: 'M65 62h30', ...SW(3) }, 'black', { stroke: true }),
    s('rect', { x: 108, y: 106, width: 30, height: 22, rx: 4 }, 'dark')
  ],
  maza: [
    s('path', { d: 'M52 140l46-74', ...SW(10) }, 'brown', { stroke: true }),
    s('path', { d: 'M48 146l10-16', ...SW(12) }, 'dark', { stroke: true }),
    s('path', { d: burst(106, 50, 38, 24, 10) }, 'gray', { accent: true }),
    s('circle', { cx: 106, cy: 50, r: 24 }, 'dark'),
    s('circle', { cx: 98, cy: 42, r: 6 }, 'gray')
  ],
  mercadeo: [
    s('path', { d: 'M26 70h18l44-26v76L44 94H26z' }, 'red', { accent: true }),
    s('path', { d: 'M34 94l8 30h14l-6-30z' }, 'dark'),
    s('path', { d: 'M98 64q8 18 0 36M110 54q14 28 0 56', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M118 22l6 28h-22l6-28z' }, 'yellow'),
    s('path', { d: 'M108 28q0-10 5-10t5 10', ...SW(3) }, 'orange', { stroke: true }),
    s('rect', { x: 108, y: 94, width: 38, height: 30, rx: 3 }, 'navy'),
    s('path', { d: 'M114 112l10-8 10 6 10-12', ...SW(4) }, 'green', { stroke: true })
  ],
  meseta: [
    backdrop('sky'),
    s('circle', { cx: 120, cy: 36, r: 12 }, 'yellow'),
    s('path', { d: 'M14 136l22-68h88l22 68z' }, 'brown', { accent: true }),
    s('path', { d: 'M36 68h88l3 10H33z' }, 'tan'),
    s('path', { d: 'M48 92l10 20M86 86l6 30M112 96l4 16', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'green', { stroke: true })
  ],
  mijo: [
    s('path', { d: 'M72 140q4-60-2-96', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(72, 110, -40, 40, 6) + leaflet(72, 90, 210, 36, 6) }, 'green'),
    s('path', { d: 'M70 44q20 10 32 46', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: dots(qpts([70, 44], [96, 50], [102, 92], 10).concat(qpts([66, 40], [88, 50], [92, 86], 8)), 4) }, 'yellow', { accent: true }),
    s('path', { d: 'M96 116h44q-2 22-22 22t-22-22z' }, 'brown'),
    s('path', { d: dots([[106, 114], [116, 112], [126, 114], [111, 108], [121, 108]], 4) }, 'yellow')
  ],
  'mutación': [
    s('path', { d: 'M50 16q60 16 0 32t0 32t0 32t0 32', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M110 16q-60 16 0 32t0 32t0 32t0 32', ...SW(5) }, 'purple', { stroke: true }),
    s('path', { d: 'M62 28h36M62 60h36M62 124h36M62 132h36', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M56 92h48', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: sparkle(130, 88, 10) }, 'orange')
  ],
  novedoso: [
    s('path', { d: 'M80 18q24 18 22 62H58q-2-44 22-62z' }, 'white'),
    s('path', { d: 'M80 18q24 18 22 62H58q-2-44 22-62z', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 52, r: 9 }, 'sky'),
    s('path', { d: 'M58 62l-14 22h16zM102 62l14 22h-16z' }, 'red', { accent: true }),
    s('path', { d: 'M66 84q14 40 14 40t14-40z' }, 'orange'),
    s('path', { d: 'M72 84q8 22 8 22t8-22z' }, 'yellow'),
    s('path', { d: sparkle(30, 40, 10) + sparkle(130, 34, 8) + sparkle(124, 112, 10) + sparkle(36, 116, 7) }, 'yellow')
  ],
  paralizar: [
    ground(),
    ...person(80, 128, 'blue'),
    s('path', { d: 'M74 70h4M82 70h4M74 80h12', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 46, y: 46, width: 68, height: 86, rx: 6, opacity: 0.6 }, 'sky', { accent: true }),
    s('rect', { x: 46, y: 46, width: 68, height: 86, rx: 6, ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M54 58l10-6M54 70l18-12', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: sparkle(130, 50, 8) + sparkle(30, 92, 7) }, 'sky')
  ],
  parejo: [
    s('path', { d: 'M14 120h132v16H14z' }, 'green'),
    s('rect', { x: 22, y: 88, width: 116, height: 26, rx: 4 }, 'yellow', { accent: true }),
    s('rect', { x: 60, y: 93, width: 40, height: 16, rx: 8 }, 'mint'),
    s('ellipse', { cx: 80, cy: 101, rx: 6, ry: 5 }, 'white'),
    s('path', { d: 'M70 93v16M90 93v16', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 52h100M30 52l10-8M30 52l10 8M130 52l-10-8M130 52l-10 8', ...SW(4) }, 'gray', { stroke: true })
  ],
  'partición': [
    s('path', { d: wedge(72, 84, 52, 0, 90) }, 'yellow'),
    s('path', { d: wedge(72, 84, 52, 90, 180) }, 'orange'),
    s('path', { d: wedge(72, 84, 52, 180, 270) }, 'yellow'),
    s('path', { d: wedge(86, 70, 52, 270, 360) }, 'red', { accent: true }),
    s('path', { d: 'M72 84v52M20 84h52M72 32v52M72 84h52', ...SW(3) }, 'white', { stroke: true })
  ],
  peninsular: [
    backdrop('sky'),
    s('path', { d: 'M14 14h132v30q-26 6-36 20q-6 18 2 34q2 22-16 36q-16-8-16-26q-8-18-24-24q-12-12-22-14q-14-2-20-10z' }, 'green', { accent: true }),
    s('path', { d: 'M30 102q10-6 20 0t20 0M106 120q10-6 20 0', ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 92, cy: 112, r: 4 }, 'red')
  ],
  pis: [
    s('rect', { x: 92, y: 26, width: 40, height: 50, rx: 4 }, 'white'),
    outline({ x: 92, y: 26, width: 40, height: 50, rx: 4 }),
    s('path', { d: 'M30 76h100q0 30-30 36l6 24H58l6-24q-34-6-34-36z' }, 'white'),
    s('path', { d: 'M30 76h100q0 30-30 36l6 24H58l6-24q-34-6-34-36z', ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 70, cy: 76, rx: 36, ry: 7 }, 'sky'),
    s('path', { d: drop(52, 48, 8) }, 'yellow', { accent: true }),
    s('path', { d: drop(36, 56, 5) }, 'yellow')
  ],
  posterioridad: [
    s('path', { d: 'M18 100h120', ...SW(5) }, 'gray', { stroke: true }),
    arrow('M126 90l12 10-12 10', 'gray', 5),
    s('circle', { cx: 46, cy: 100, r: 9 }, 'gray'),
    s('circle', { cx: 108, cy: 100, r: 12 }, 'orange', { accent: true }),
    s('circle', { cx: 108, cy: 50, r: 22 }, 'white'),
    s('path', { d: ring(108, 50, 22) + 'M108 36v14l10 6', ...SW(4) }, 'dark', { stroke: true }),
    arrow('M54 80q20-26 40-14', 'orange', 4)
  ],
  predicar: [
    s('path', { d: 'M36 136V82h52v54z' }, 'brown'),
    s('path', { d: 'M30 82h64', ...SW(6) }, 'tan', { stroke: true }),
    ...person(62, 82, 'purple', { h: 30, w: 26, r: 12, accent: true }),
    s('path', { d: 'M74 60l14-22', ...SW(6) }, 'purple', { stroke: true }),
    s('path', { d: 'M96 40q6 6 0 12M104 34q10 12 0 24', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: busts([108, 136], 136, 24, 22) }, 'green'),
    s('path', { d: dots([[108, 108], [136, 108]], 9) }, 'skin')
  ],
  'puré': [
    s('path', { d: 'M22 86h116q-4 50-58 50t-58-50z' }, 'blue', { accent: true }),
    s('path', { d: 'M30 86q0-28 20-26q6-18 30-18t30 18q20-2 20 26z' }, 'cream'),
    s('path', { d: 'M54 72q12-12 26 0t26 0', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 70, y: 40, width: 18, height: 14, rx: 2, transform: 'rotate(-10 79 47)' }, 'yellow'),
    s('path', { d: 'M110 70l26-50', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M22 86h116', ...SW(4) }, 'navy', { stroke: true })
  ],
  'póliza': [
    ...paper(28, 16, 80, 110),
    s('path', { d: 'M40 36h40M40 50h56M40 64h50', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 108q8-10 14 0t14-2', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M86 108q0-34 30-34t30 34q-7-6-15 0q-7-6-15 0q-7-6-15 0q-7-6-15 0z' }, 'blue', { accent: true }),
    s('path', { d: 'M116 74v-6M116 106v26q0 6-6 6', ...SW(4) }, 'dark', { stroke: true })
  ],
  razonar: [
    s('path', { d: 'M52 136v-22q-26-10-26-46q0-46 50-46q46 0 46 44l12 22-12 4v14q0 12-14 10l-16-2v22z' }, 'tan'),
    ...gear(70, 66, 16, 8, 'blue', { accent: true }),
    ...gear(102, 58, 10, 6, 'orange'),
    s('circle', { cx: 70, cy: 66, r: 6 }, 'tan'),
    s('circle', { cx: 102, cy: 58, r: 4 }, 'tan')
  ],
  remesa: [
    ground(),
    s('rect', { x: 100, y: 96, width: 40, height: 40 }, 'tan'),
    s('path', { d: 'M94 98l26-24 26 24z' }, 'red'),
    s('rect', { x: 114, y: 112, width: 12, height: 24 }, 'brown'),
    s('rect', { x: 18, y: 34, width: 52, height: 34, rx: 4 }, 'white'),
    s('path', { d: 'M18 38h52v30H18zM18 38l26 18 26-18', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 60, cy: 64, r: 12 }, 'yellow', { accent: true }),
    arrow('M48 88q30 30 52 4m-12-2 12 2 2-12')
  ],
  reverso: [
    s('rect', { x: 18, y: 30, width: 56, height: 80, rx: 6 }, 'white'),
    outline({ x: 18, y: 30, width: 56, height: 80, rx: 6 }),
    s('path', { d: heart(46, 66, 16) }, 'red'),
    s('rect', { x: 88, y: 50, width: 56, height: 80, rx: 6 }, 'navy', { accent: true }),
    s('path', { d: 'M96 58h40v64H96z', ...SW(3, { 'stroke-dasharray': '4 4' }) }, 'sky', { stroke: true }),
    arrow('M40 128q30 24 54 6m-12 0 12 0-2-12', 'orange', 5)
  ],
  revuelo: [
    backdrop('sky'),
    s('path', { d: birds([[40, 40], [72, 30], [108, 44], [128, 28], [56, 66], [96, 76], [124, 64], [36, 92], [76, 102], [116, 104]]), ...SW(4) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: leaflet(48, 120, -30, 14, 4) + leaflet(100, 126, 200, 14, 4) + leaflet(130, 86, 60, 12, 3) }, 'white'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'green', { stroke: true })
  ],
  rizar: [
    s('path', { d: 'M100 20l-40 100', ...SW(14) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 120l-10 26', ...SW(16) }, 'dark', { stroke: true }),
    s('path', { d: 'M104 22q-24 4-14 16q22 4 6 18q-24 6-12 18q22 6 4 18q-24 6-10 18', ...SW(9) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M114 70q8 4 4 12M118 52q10 6 4 16', ...SW(3) }, 'orange', { stroke: true }),
    s('circle', { cx: 56, cy: 128, r: 3 }, 'red')
  ],
  rolar: [
    s('path', { d: 'M80 140V54', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M36 54h70l-10-10M106 54l-10 10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 44l12 10-12 10h14l8-10-8-10z' }, 'red'),
    s('path', { d: 'M124 54l-18-14v28z' }, 'red', { accent: true }),
    s('path', { d: 'M42 98q38 30 76 0', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M118 98l-14 4 8 10z' }, 'orange'),
    s('path', { d: 'M24 130q16-8 32 0M104 130q16-8 32 0', ...SW(4) }, 'sky', { stroke: true })
  ],
  rotonda: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'mint'),
    s('path', { d: 'M66 14h28v132H66zM14 66h132v28H14z' }, 'gray'),
    s('circle', { cx: 80, cy: 80, r: 44 }, 'gray'),
    s('circle', { cx: 80, cy: 80, r: 22 }, 'green', { accent: true }),
    s('path', { d: ring(80, 80, 33), ...DASH(2, '5 5') }, 'white', { stroke: true }),
    s('rect', { x: 104, y: 72, width: 10, height: 16, rx: 3 }, 'red'),
    s('rect', { x: 46, y: 72, width: 10, height: 16, rx: 3 }, 'blue')
  ],
  separatista: [
    s('path', { d: 'M20 40h36q-4-14 8-14t8 14h28v30q-14-4-14 8t14 8v34H20z' }, 'blue'),
    s('path', { d: 'M114 70q-14-4-14 8t14 8v34h32V70z' }, 'orange', { accent: true }),
    arrow('M112 52l20-16m-10 0h10v10', 'gray', 4),
    s('path', { d: 'M20 120h80', ...SW(3) }, 'navy', { stroke: true })
  ],
  simplicidad: [
    s('rect', { x: 24, y: 24, width: 112, height: 112, rx: 10 }, 'cream'),
    s('path', { d: leaflet(52, 112, -45, 70, 20) }, 'green', { accent: true }),
    s('path', { d: 'M52 112l40-40', ...SW(3) }, 'mint', { stroke: true })
  ],
  'sinfonía': [
    s('path', { d: 'M54 40q-10-16 6-24q16 8 6 24q14 14 0 34q12 20-6 44q-18-8-18-26q-8-22 6-30q-8-10 6-22z' }, 'brown', { accent: true }),
    s('path', { d: 'M60 18V112', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 106L98 52', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M60 112v26', ...SW(5) }, 'dark', { stroke: true }),
    ...note(108, 92, 'purple'),
    ...note(128, 56, 'blue')
  ],
  sondeo: [
    s('rect', { x: 22, y: 24, width: 76, height: 108, rx: 6 }, 'brown'),
    s('rect', { x: 30, y: 34, width: 60, height: 92, rx: 2 }, 'white'),
    s('path', { d: rects([[38, 46, 12, 12], [38, 72, 12, 12], [38, 98, 12, 12]]) + 'M58 52h24M58 78h24M58 104h24', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 76l4 5 7-9', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: wedge(118, 92, 26, -90, 120) }, 'blue', { accent: true }),
    s('path', { d: wedge(118, 92, 26, 120, 270) }, 'orange')
  ],
  superintendente: [
    ground(),
    ...person(104, 136, 'navy', { h: 60, w: 36, r: 16, accent: true }),
    s('path', { d: 'M104 78l-5 8 5 26 5-26z' }, 'red'),
    s('path', { d: 'M88 46q16-16 32 0z' }, 'yellow'),
    s('rect', { x: 66, y: 92, width: 22, height: 28, rx: 2 }, 'tan'),
    s('path', { d: busts([24, 50], 136, 20, 22) }, 'orange'),
    s('path', { d: dots([[24, 110], [50, 110]], 8) }, 'skin'),
    s('path', { d: 'M70 102h14M70 110h10', ...SW(2) }, 'brown', { stroke: true })
  ],
  tejer: [
    s('circle', { cx: 112, cy: 104, r: 30 }, 'pink', { accent: true }),
    s('path', { d: 'M90 92q22-12 44 4M88 108q24-16 46 6M100 80q4 30 28 48', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M24 40l60 80M86 30l-50 92', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 54h40v34H40z' }, 'purple'),
    s('path', { d: 'M48 62l4 6 4-6 4 6 4-6 4 6 4-6M48 76l4 6 4-6 4 6 4-6 4 6 4-6', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M82 70q10 0 14 14', ...SW(3) }, 'pink', { stroke: true })
  ],
  'terapéutico': [
    s('path', { d: 'M40 72q-6-10 0-20t0-20M80 72q-6-10 0-20t0-20M120 72q-6-10 0-20t0-20', ...SW(4) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 80, cy: 112, rx: 64, ry: 24 }, 'tan'),
    s('ellipse', { cx: 80, cy: 108, rx: 54, ry: 18 }, 'sky', { accent: true }),
    s('circle', { cx: 80, cy: 94, r: 14 }, 'skin'),
    s('path', { d: 'M73 92q3 3 6 0M81 92q3 3 6 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 82q14-12 28 0z' }, 'white'),
    s('path', { d: leaflet(124, 96, -60, 26, 8) }, 'green')
  ],
  terrateniente: [
    s('path', { d: 'M14 82h132v54H14z' }, 'green'),
    s('path', { d: 'M14 94h132M14 108h132M14 122h132', ...SW(5) }, 'yellow', { stroke: true }),
    s('rect', { x: 104, y: 56, width: 34, height: 26 }, 'red'),
    s('path', { d: 'M100 58l21-18 21 18z' }, 'brown'),
    ...person(48, 112, 'brown', { h: 40, w: 26, r: 12, accent: true }),
    s('path', { d: 'M28 52h40M38 52q0-14 10-14t10 14', ...SW(6) }, 'tan', { stroke: true }),
    s('path', { d: 'M60 90l30-20', ...SW(6) }, 'brown', { stroke: true })
  ],
  traficar: [
    s('rect', { x: 22, y: 50, width: 116, height: 82, rx: 8 }, 'brown'),
    s('rect', { x: 64, y: 34, width: 32, height: 18, rx: 6, ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 30, y: 58, width: 100, height: 40, rx: 4 }, 'tan'),
    s('rect', { x: 30, y: 100, width: 100, height: 26, rx: 2 }, 'dark'),
    s('path', { d: rects([[38, 104, 24, 18], [68, 104, 24, 18], [98, 104, 24, 18]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M38 78h84', ...SW(3) }, 'brown', { stroke: true })
  ],
  trivial: [
    ground(),
    ...person(80, 136, 'gray'),
    s('path', { d: 'M66 102l-18-8-4-16M94 102l18-8 4-16', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: dots([[44, 74], [116, 74]], 6) }, 'skin'),
    s('path', { d: 'M74 76h12', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 128, cy: 132, r: 4 }, 'orange', { accent: true }),
    s('path', { d: 'M122 120l-4-6M134 120l4-6', ...SW(2) }, 'orange', { stroke: true })
  ],
  tuitero: [
    ground(),
    ...person(48, 136, 'blue'),
    s('rect', { x: 50, y: 82, width: 16, height: 24, rx: 3 }, 'dark'),
    s('path', { d: bubble(80, 20, 60, 40) }, 'sky', { accent: true }),
    s('path', { d: 'M96 40q4-10 12-6q2-8 10 0l6-4-4 8q0 10-14 12q-8 0-10-10z' }, 'blue'),
    s('path', { d: bubble(96, 76, 40, 30) }, 'mint'),
    s('path', { d: 'M106 90h20', ...SW(4) }, 'green', { stroke: true })
  ],
  unificar: [
    s('path', { d: dots([[28, 30], [28, 130]], 12) }, 'blue'),
    s('path', { d: dots([[22, 80]], 12) }, 'red'),
    s('path', { d: dots([[60, 22], [60, 138]], 10) }, 'yellow'),
    arrow('M40 38l38 30M40 122l38-30M36 80h40M64 34l16 34M64 126l16-34', 'gray', 4),
    s('circle', { cx: 114, cy: 80, r: 30 }, 'purple', { accent: true })
  ],
  vialidad: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'mint'),
    s('path', { d: 'M14 60h132M14 112h132M54 14v132M110 14v132', ...SW(18) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 60h132M14 112h132M54 14v132M110 14v132', ...SW(2, { 'stroke-dasharray': '6 6' }) }, 'white', { stroke: true }),
    s('rect', { x: 74, y: 76, width: 16, height: 34, rx: 4 }, 'dark'),
    s('path', { d: dots([[82, 84], [82, 93], [82, 102]], 3) }, 'yellow'),
    s('circle', { cx: 82, cy: 84, r: 3 }, 'red', { accent: true }),
    s('circle', { cx: 82, cy: 102, r: 3 }, 'green')
  ],
  'vigésimo': [
    s('path', { d: dots(Array.from({ length: 19 }, (_, k) => [32 + (k % 5) * 24, 32 + Math.floor(k / 5) * 32]), 9) }, 'gray'),
    s('circle', { cx: 128, cy: 128, r: 13 }, 'orange', { accent: true }),
    s('path', { d: star(128, 128, 9) }, 'yellow')
  ],
  virgo: [
    backdrop('navy'),
    s('path', { d: 'M32 40l26 22 30-6 18 26 10 30M88 56l-8 40 18 22M58 62l-12 40', ...SW(2) }, 'sky', { stroke: true }),
    s('path', { d: [[32, 40], [58, 62], [88, 56], [106, 82], [80, 96], [98, 118], [46, 102]].map(([x, y]) => sparkle(x, y, 7)).join('') }, 'yellow', { accent: true }),
    s('path', { d: sparkle(116, 112, 10) }, 'white'),
    s('path', { d: 'M124 40q-12 4-8 18M124 40q-4 12-14 8', ...SW(3) }, 'yellow', { stroke: true })
  ],
  yuan: [
    s('rect', { x: 18, y: 34, width: 96, height: 56, rx: 4, transform: 'rotate(-8 66 62)' }, 'red'),
    s('circle', { cx: 66, cy: 62, r: 16, transform: 'rotate(-8 66 62)' }, 'pink'),
    s('rect', { x: 24, y: 40, width: 84, height: 44, rx: 2, transform: 'rotate(-8 66 62)', ...SW(2) }, 'pink', { stroke: true }),
    s('circle', { cx: 104, cy: 104, r: 34 }, 'yellow', { accent: true }),
    s('circle', { cx: 104, cy: 104, r: 26 }, 'orange'),
    s('rect', { x: 95, y: 95, width: 18, height: 18 }, 'white'),
    outline({ x: 95, y: 95, width: 18, height: 18 }, 'orange', 2)
  ],
  'abogacía': [
    s('path', { d: 'M80 30v92M56 136h48M64 122h32', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M32 42h96', ...SW(6) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M32 42l-14 40M32 42l14 40M128 42l-14 40M128 42l14 40', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 82h36q-4 16-18 16T14 82zM110 82h36q-4 16-18 16t-18-16z' }, 'yellow'),
    s('circle', { cx: 80, cy: 26, r: 7 }, 'yellow'),
    s('rect', { x: 18, y: 112, width: 34, height: 24, rx: 3 }, 'red'),
    s('path', { d: 'M22 114v20', ...SW(3) }, 'cream', { stroke: true })
  ],
  agropecuario: [
    ground(),
    s('path', { d: 'M28 136V60M38 136V54M48 136V62', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: ells([[28, 52, 5, 12], [38, 44, 5, 12], [48, 54, 5, 12]]) }, 'yellow'),
    s('path', { d: 'M74 70q-10-6-10-16l14 6M134 70q10-6 10-16l-14 6' }, 'tan'),
    s('path', { d: 'M76 58h56l-6 50q-22 12-44 0z' }, 'white'),
    s('path', { d: 'M76 58h56l-6 50q-22 12-44 0z', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 60h22l-2 22q-14 0-20-22z' }, 'dark'),
    s('ellipse', { cx: 104, cy: 102, rx: 18, ry: 11 }, 'pink', { accent: true }),
    s('path', { d: dots([[92, 78], [116, 78], [98, 102], [110, 102]], 3.5) }, 'dark')
  ],
  'alegación': [
    s('rect', { x: 92, y: 30, width: 54, height: 40, rx: 3 }, 'brown'),
    s('circle', { cx: 119, cy: 24, r: 10 }, 'skin'),
    s('path', { d: 'M104 30q15-10 30 0z' }, 'white'),
    ground(),
    s('rect', { x: 26, y: 96, width: 52, height: 40, rx: 3 }, 'tan'),
    ...person(52, 96, 'navy', { h: 30, w: 26, r: 11, accent: true }),
    s('path', { d: 'M62 72l18-20', ...SW(6) }, 'navy', { stroke: true }),
    s('path', { d: 'M82 50l4-10', ...SW(4) }, 'skin', { stroke: true }),
    s('path', { d: 'M92 96q8 8 0 16M100 90q14 14 0 28', ...SW(4) }, 'orange', { stroke: true })
  ],
  'ambigüedad': [
    ground(),
    s('path', { d: 'M80 136V30', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M84 36h40l12 12-12 12H84z' }, 'blue', { accent: true }),
    s('path', { d: 'M76 70H36L24 82l12 12h40z' }, 'orange'),
    s('path', { d: 'M76 36H48l-10 10 10 10h28z' }, 'green'),
    s('path', { d: 'M24 120q14-8 28 0M108 120q14-8 28 0', ...SW(4) }, 'gray', { stroke: true })
  ],
  analfabetismo: [
    ...openBook(80, 84),
    s('path', { d: 'M38 94q4-4 8 0t8 0t8 0M38 106q4-4 8 0t8 0M38 118q4-4 8 0t8 0t8 0M90 94q4-4 8 0t8 0t8 0M90 106q4-4 8 0t8 0t8 0M90 118q4-4 8 0', ...SW(2) }, 'gray', { stroke: true }),
    ...face(80, 46, 26, 'skin', 'frown', { accent: true }),
    s('path', { d: spiral(116, 24), ...SW(3) }, 'purple', { stroke: true }),
    s('path', { d: 'M38 26q-6-10 4-14M30 40l-8-4', ...SW(3) }, 'purple', { stroke: true })
  ],
  anticonceptivo: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'pink'),
    s('circle', { cx: 80, cy: 80, r: 50 }, 'white'),
    s('path', { d: dots(around(80, 80, 36, 14, -90).slice(4), 7) }, 'purple', { accent: true }),
    s('path', { d: around(80, 80, 36, 14, -90).slice(0, 4).map(([x, y]) => ring(x, y, 7)).join(''), ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 14 }, 'pink'),
    arrow('M80 80V58', 'dark', 4)
  ],
  anticuerpo: [
    s('path', { d: rays(80, 80, 20, 30, 10), ...SW(5) }, 'purple', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 22 }, 'purple'),
    s('path', { d: dots([[72, 74], [88, 86], [86, 72]], 4) }, 'pink'),
    s('path', { d: 'M30 30l14 14M44 44v14M44 44h14M130 30l-14 14M116 44v14M116 44h-14M30 130l14-14M44 116v-14M44 116h14M130 130l-14-14M116 116v-14M116 116h-14', ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: dots([[44, 58], [58, 44], [116, 58], [102, 44], [44, 102], [58, 116], [116, 102], [102, 116]], 4) }, 'yellow')
  ],
  apestar: [
    s('path', { d: 'M40 70h80l-8 66H48z' }, 'green', { accent: true }),
    s('rect', { x: 34, y: 60, width: 92, height: 12, rx: 4 }, 'dark'),
    s('path', { d: 'M60 84v40M80 84v40M100 84v40', ...SW(4) }, 'mint', { stroke: true }),
    s('path', { d: 'M54 52q-10-10 0-20t0-20M80 52q-10-10 0-20t0-20M106 52q-10-10 0-20t0-20', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: dots([[26, 40], [136, 46], [130, 30]], 3) }, 'dark'),
    s('path', { d: 'M22 34l4 4 4-4M132 40l4 4 4-4', ...SW(2) }, 'gray', { stroke: true })
  ],
  bengala: [
    backdrop('navy'),
    s('path', { d: 'M40 136L78 70', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 122l-6-8', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: rays(84, 60, 10, 46, 14), ...SW(3) }, 'yellow', { stroke: true }),
    s('circle', { cx: 84, cy: 60, r: 10 }, 'white', { accent: true }),
    s('path', { d: sparkle(130, 34, 8) + sparkle(36, 40, 6) + sparkle(126, 106, 7) }, 'orange')
  ],
  boulevard: [
    s('rect', { x: 14, y: 104, width: 132, height: 32 }, 'gray'),
    s('path', { d: 'M14 120h132', ...SW(3, { 'stroke-dasharray': '10 8' }) }, 'white', { stroke: true }),
    s('path', { d: 'M14 104h132', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: 'M30 102V70M72 102V70M114 102V70', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: dots([[30, 52], [72, 52], [114, 52]], 20) }, 'green', { accent: true }),
    s('path', { d: 'M142 102V62M136 62h12', ...SW(4) }, 'dark', { stroke: true }),
    ...scaled(car(0, 0, 'red'), 0.55, 60, 112)
  ],
  budismo: [
    s('path', { d: 'M14 128q66-14 132 0', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: leaflet(80, 116, -90, 66, 16) }, 'pink', { accent: true }),
    s('path', { d: leaflet(78, 118, -130, 58, 14) + leaflet(82, 118, -50, 58, 14) }, 'pink'),
    s('path', { d: leaflet(76, 120, -165, 52, 12) + leaflet(84, 120, -15, 52, 12) }, 'purple'),
    s('path', { d: 'M40 124q40 10 80 0', ...SW(6) }, 'green', { stroke: true })
  ],
  buenaventura: [
    s('path', { d: 'M46 140V84q0-10 8-10V36q0-8 7-8t7 8v32V28q0-8 7-8t7 8v40V32q0-8 7-8t7 8v38V44q0-8 7-8t7 8v56q0 40-34 40z' }, 'skin', { accent: true }),
    s('path', { d: 'M58 110q16-14 36-20M60 98q18-6 40 4M70 126q4-24 0-40', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M46 96q-14-10-22-2', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(130, 30, 12) + sparkle(28, 40, 8) }, 'yellow'),
    s('path', { d: star(132, 72, 8) }, 'purple')
  ],
  buitre: [
    s('path', { d: 'M18 130h124', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M54 122q-14-30 6-58q30-8 42 20q8 26-8 44z' }, 'dark', { accent: true }),
    s('path', { d: 'M100 84l18 40-18-6z' }, 'black'),
    s('path', { d: ells([[78, 62, 20, 9]]) }, 'cream'),
    s('path', { d: 'M76 58q-6-26 10-30q14 0 12 14', ...SW(7) }, 'pink', { stroke: true }),
    s('path', { d: 'M96 38l12 6-10 4z' }, 'orange'),
    s('circle', { cx: 90, cy: 34, r: 2.5 }, 'dark'),
    s('path', { d: 'M66 122v8M84 122v8', ...SW(4) }, 'gray', { stroke: true })
  ],
  cajita: [
    s('path', { d: 'M42 86h76v46H42z' }, 'red', { accent: true }),
    s('path', { d: 'M42 86l10-34h76l-10 34z' }, 'pink'),
    s('path', { d: 'M78 86v46M42 104h76', ...SW(5) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 96, r: 4 }, 'yellow'),
    ...note(118, 40, 'purple'),
    s('path', { d: sparkle(28, 60, 8) }, 'yellow')
  ],
  calculadora: [
    s('rect', { x: 36, y: 16, width: 88, height: 126, rx: 10 }, 'dark'),
    s('rect', { x: 46, y: 26, width: 68, height: 26, rx: 3 }, 'mint', { accent: true }),
    s('path', { d: grid(48, 62, 3, 4, 14, 12, 20, 18) }, 'gray'),
    s('path', { d: rects([[106, 62, 8, 30], [106, 98, 8, 30]]) }, 'orange')
  ],
  cargamento: [
    s('path', { d: 'M14 128q66 8 132 0', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M14 96h132l-14 30H30z' }, 'red', { accent: true }),
    s('path', { d: rects([[26, 74, 32, 22], [62, 74, 32, 22], [26, 52, 32, 20]]) }, 'blue'),
    s('path', { d: rects([[98, 74, 32, 22], [62, 52, 32, 20]]) }, 'orange'),
    s('path', { d: rects([[98, 52, 32, 20]]) }, 'green'),
    s('path', { d: 'M114 52V24M114 30l14 6-14 6', ...SW(4) }, 'dark', { stroke: true })
  ],
  'carnicería': [
    s('path', { d: 'M18 26h124l-8 26H26z' }, 'red'),
    s('path', { d: 'M42 26l-4 26M68 26l-2 26M92 26l2 26M118 26l4 26', ...SW(8) }, 'white', { stroke: true }),
    s('rect', { x: 24, y: 52, width: 112, height: 84 }, 'cream'),
    s('rect', { x: 24, y: 96, width: 112, height: 40 }, 'tan'),
    s('path', { d: 'M38 66q12-6 30 0q12 10 4 22q-18 8-30 0q-10-12-4-22z' }, 'red', { accent: true }),
    s('circle', { cx: 52, cy: 76, r: 6 }, 'white'),
    s('path', { d: 'M90 72q10 12 0 22q10 12 0 22q14 10 24 0q-10-10 0-22q-10-10 0-22z', transform: 'rotate(90 102 94) translate(0 -14)' }, 'pink')
  ],
  cas: [
    s('path', { d: leaflet(52, 46, -60, 34, 10) }, 'green'),
    s('circle', { cx: 56, cy: 82, r: 36 }, 'yellow'),
    s('path', { d: 'M40 70q4-8 12-10', ...SW(4) }, 'cream', { stroke: true }),
    s('circle', { cx: 112, cy: 104, r: 30 }, 'green'),
    s('circle', { cx: 112, cy: 104, r: 24 }, 'cream', { accent: true }),
    s('path', { d: dots(around(112, 104, 12, 8), 2.5) }, 'tan')
  ],
  cata: [
    ...glass(58, -16, true),
    s('rect', { x: 102, y: 48, width: 22, height: 88, rx: 6 }, 'green'),
    s('rect', { x: 107, y: 26, width: 12, height: 24, rx: 3 }, 'green'),
    s('rect', { x: 104, y: 80, width: 18, height: 26, rx: 2 }, 'cream'),
    s('path', { d: 'M26 52q6-6 12 0M24 38q8-10 18 0', ...SW(3) }, 'purple', { stroke: true }),
    s('path', { d: 'M36 136h50', ...SW(4) }, 'gray', { stroke: true })
  ],
  chicha: [
    s('path', { d: 'M86 52h44l-6 84H92z' }, 'purple', { accent: true }),
    s('path', { d: 'M84 50h48l-6 86H90z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M90 62h36', ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: 'M48 128q-18-40 0-92q18 52 0 92z' }, 'purple'),
    s('path', { d: dots([[44, 60], [52, 60], [44, 76], [52, 76], [44, 92], [52, 92], [48, 108]], 3) }, 'navy'),
    s('path', { d: 'M48 130q-26-20-24-62q12 34 22 46M50 130q24-18 26-56q-14 30-22 44' }, 'green')
  ],
  cognitivo: [
    s('path', { d: 'M80 34q-14-14-32-4q-18 0-20 20q-14 10-6 28q-6 18 12 28q4 18 26 14q12 8 20-2q10 10 24 2q22 4 26-14q18-10 12-28q8-18-6-28q-2-20-20-20q-18-10-36 4z' }, 'pink', { accent: true }),
    s('path', { d: 'M80 34v86M54 52q10 8 4 20M106 52q-10 8-4 20M44 90q14-2 20 10M116 90q-14-2-20 10', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: sparkle(130, 30, 10) + sparkle(28, 130, 8) }, 'yellow'),
    s('path', { d: 'M134 120q-10 0-14 8', ...SW(3) }, 'yellow', { stroke: true })
  ],
  columnista: [
    ...paper(22, 18, 96, 120),
    s('path', { d: 'M32 30h76', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M32 48h22M32 60h22M32 72h22M32 84h22M32 96h22M32 108h22M32 120h22', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 62, y: 44, width: 46, height: 82, rx: 3 }, 'sky', { accent: true }),
    s('path', { d: 'M70 56h30M70 68h30M70 80h30M70 92h30M70 104h22', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M150 34l-34 58', ...SW(7) }, 'orange', { stroke: true }),
    s('path', { d: 'M116 92l-4 10 8-6z' }, 'dark')
  ],
  comitiva: [
    ground(),
    s('path', { d: 'M28 136V40', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M30 42h26l-6 10 6 10H30z' }, 'red', { accent: true }),
    ...person(40, 136, 'navy', { h: 36, w: 22, r: 10 }),
    s('path', { d: busts([70, 94, 118, 142], 136, 20, 32) }, 'gray'),
    s('path', { d: dots([[70, 96], [94, 96], [118, 96], [142, 96]], 9) }, 'skin')
  ],
  comparativo: [
    s('path', { d: 'M18 136h124', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 34, y: 82, width: 32, height: 54, rx: 3 }, 'blue'),
    s('rect', { x: 94, y: 36, width: 32, height: 100, rx: 3 }, 'orange', { accent: true }),
    s('path', { d: 'M30 36h100', ...DASH(3, '5 5') }, 'gray', { stroke: true }),
    s('path', { d: 'M50 74V46m-8 8 8-8 8 8', ...SW(4) }, 'dark', { stroke: true })
  ],
  conferir: [
    s('path', { d: 'M14 70q20-10 36 0h16', ...SW(14) }, 'skin', { stroke: true }),
    s('path', { d: 'M146 98q-20 10-36 0H94', ...SW(14) }, 'skin', { stroke: true }),
    s('rect', { x: 60, y: 62, width: 16, height: 46, rx: 8, transform: 'rotate(-60 80 84)' }, 'cream'),
    s('rect', { x: 56, y: 76, width: 48, height: 16, rx: 8, transform: 'rotate(-20 80 84)' }, 'cream'),
    s('path', { d: 'M72 76l6 18', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M74 92l-6 20M80 92l4 20', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: star(80, 30, 14) }, 'yellow')
  ],
  consultivo: [
    s('ellipse', { cx: 80, cy: 118, rx: 60, ry: 14 }, 'brown'),
    s('path', { d: busts([42, 118], 112, 30, 34) }, 'blue'),
    s('path', { d: dots([[42, 76], [118, 76]], 13) }, 'skin'),
    s('path', { d: bubble(18, 18, 46, 32) }, 'mint', { accent: true }),
    s('path', { d: bubble(96, 18, 46, 32) }, 'sky'),
    s('path', { d: 'M30 32h22M108 32h22', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 120h40', ...SW(3) }, 'cream', { stroke: true })
  ],
  cortejo: [
    ground(),
    ...person(46, 136, 'blue'),
    s('path', { d: 'M56 98l26-8', ...SW(7) }, 'blue', { stroke: true }),
    s('path', { d: 'M82 92l4-20', ...SW(3) }, 'green', { stroke: true }),
    s('circle', { cx: 86, cy: 68, r: 7 }, 'red'),
    ...lady(118, 136, 'pink'),
    s('path', { d: heart(82, 36, 14) }, 'red', { accent: true })
  ],
  cosquillas: [
    ...face(64, 80, 40, 'skin', 'smile', { accent: true }),
    s('path', { d: 'M44 72q6-6 12 0M72 72q6-6 12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M46 90q18 26 36 0z' }, 'dark'),
    s('path', { d: leaflet(138, 30, 130, 76, 12) }, 'purple'),
    s('path', { d: 'M138 30L86 92', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M110 104q6-4 10 2M104 116q8-2 10 6', ...SW(3) }, 'orange', { stroke: true })
  ],
  costura: [
    s('path', { d: 'M14 80q40-14 66 0t66 0v52H14z' }, 'pink', { accent: true }),
    s('path', { d: 'M14 100q40-14 66 0t66 0', ...DASH(3, '8 6') }, 'red', { stroke: true }),
    s('path', { d: 'M40 54L118 22', ...SW(5) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 112, cy: 25, rx: 4, ry: 2, transform: 'rotate(-22 112 25)' }, 'white'),
    s('path', { d: 'M112 25q30 20 6 50q-16 20 6 30', ...SW(3) }, 'red', { stroke: true })
  ],
  cuatrocientos: [
    s('path', { d: rects([[18, 18, 56, 56], [86, 18, 56, 56], [18, 86, 56, 56], [86, 86, 56, 56]]) }, 'yellow', { accent: true }),
    s('path', { d: [18, 86].flatMap(x => [18, 86].map(y => Array.from({ length: 9 }, (_, i) => `M${x + 5.6 * (i + 1)} ${y}v56M${x} ${y + 5.6 * (i + 1)}h56`).join(''))).join(''), ...SW(1) }, 'orange', { stroke: true }),
    s('path', { d: rects([[18, 18, 56, 56], [86, 18, 56, 56], [18, 86, 56, 56], [86, 86, 56, 56]]), ...SW(3) }, 'orange', { stroke: true })
  ],
  'culminación': [
    backdrop('sky'),
    s('path', { d: 'M14 136l66-92 66 92z' }, 'gray'),
    s('path', { d: 'M62 70l18-26 18 26-10-6-8 8-8-8z' }, 'white'),
    s('path', { d: 'M80 44V18', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 18h26l-6 8 6 8H82z' }, 'red', { accent: true }),
    s('path', { d: sparkle(40, 36, 9) + sparkle(126, 54, 7) }, 'yellow')
  ],
  debutar: [
    s('path', { d: 'M14 14h26v122H14zM120 14h26v122h-26z' }, 'red'),
    s('path', { d: 'M14 14h132v14H14z' }, 'red'),
    s('path', { d: 'M62 28L42 120h76L98 28z' }, 'cream', { accent: true }),
    s('rect', { x: 14, y: 120, width: 132, height: 16 }, 'brown'),
    ...person(80, 120, 'purple', { h: 34, w: 24, r: 11 }),
    s('path', { d: sparkle(56, 52, 7) + sparkle(104, 60, 6) }, 'yellow')
  ],
  desarme: [
    s('path', { d: 'M24 120l40-40', ...SW(10) }, 'gray', { stroke: true }),
    s('path', { d: 'M76 68l52-52', ...SW(10) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: 'M20 108l16 16M14 130l10-10', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M62 74l10 4-4-12 8 2', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M88 112q16-24 40-6q-10 2-12 10q14 6 22 20q-24 4-34-4q-10 2-16-6z' }, 'white'),
    s('path', { d: 'M88 112q16-24 40-6q-10 2-12 10q14 6 22 20q-24 4-34-4q-10 2-16-6z', ...SW(3) }, 'sky', { stroke: true }),
    s('circle', { cx: 96, cy: 110, r: 2 }, 'dark')
  ],
  'descentralización': [
    s('path', { d: 'M80 80L30 34M80 80L130 34M80 80L30 126M80 80L130 126M30 34h100M30 126h100M30 34v92M130 34v92', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'gray'),
    s('path', { d: dots([[30, 34], [130, 34], [30, 126], [130, 126]], 15) }, 'blue', { accent: true }),
    s('path', { d: dots([[80, 34], [80, 126], [30, 80], [130, 80]], 9) }, 'orange')
  ],
  descuidado: [
    ground(),
    ...lean(66, 136, 18, 'orange'),
    s('path', { d: 'M76 98l18-4', ...SW(7) }, 'orange', { stroke: true }),
    s('path', { d: 'M66 136q8-6 16 0q-4 6-12 4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 106l18 6-6 14-16-8z' }, 'white'),
    s('path', { d: 'M100 106l18 6-6 14-16-8z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 130q16-4 34 0q-6 8-34 0z' }, 'brown', { accent: true }),
    s('path', { d: drop(126, 116, 3) }, 'brown')
  ],
  destacamento: [
    ground(),
    s('path', { d: busts([22, 42, 62], 136, 18, 30) }, 'green'),
    s('path', { d: ells([[22, 102, 10, 7], [42, 102, 10, 7], [62, 102, 10, 7]]) }, 'green'),
    s('path', { d: dots([[22, 110], [42, 110], [62, 110]], 7) }, 'skin'),
    s('path', { d: busts([102, 122, 142], 136, 18, 30) }, 'green', { accent: true }),
    s('path', { d: ells([[102, 102, 10, 7], [122, 102, 10, 7], [142, 102, 10, 7]]) }, 'dark'),
    s('path', { d: dots([[102, 110], [122, 110], [142, 110]], 7) }, 'skin'),
    arrow('M90 60h40m-10-8 10 8-10 8', 'orange', 5)
  ],
  'dióxido': [
    s('path', { d: 'M36 80h88', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 72h88M36 88h88', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 32, cy: 80, r: 22 }, 'red'),
    s('circle', { cx: 128, cy: 80, r: 22 }, 'red'),
    s('circle', { cx: 80, cy: 80, r: 26 }, 'dark', { accent: true }),
    s('path', { d: dots([[24, 72], [120, 72], [72, 70]], 5) }, 'white')
  ],
  'débito': [
    s('rect', { x: 16, y: 38, width: 128, height: 84, rx: 10 }, 'blue', { accent: true }),
    s('rect', { x: 30, y: 58, width: 24, height: 18, rx: 3 }, 'yellow'),
    s('path', { d: 'M38 58v18M30 67h24', ...SW(1.5) }, 'orange', { stroke: true }),
    s('path', { d: 'M30 96h14M50 96h14M70 96h14M90 96h14', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M100 66q6 6 0 12M108 62q10 10 0 20', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: dots([[116, 108], [128, 108]], 7) }, 'sky')
  ],
  entablar: [
    s('rect', { x: 26, y: 26, width: 108, height: 108, rx: 2 }, 'cream'),
    s('path', { d: checker(26, 26, 8, 8, 13.5) }, 'brown'),
    s('rect', { x: 26, y: 26, width: 108, height: 108, rx: 2, ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 120h16l-3-12a6 6 0 1 0-10 0z' }, 'white'),
    s('path', { d: 'M60 120h16l-3-12a6 6 0 1 0-10 0z', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M88 54h16l-3-12a6 6 0 1 0-10 0z' }, 'black', { accent: true })
  ],
  'escéptico': [
    s('circle', { cx: 80, cy: 72, r: 46 }, 'skin', { accent: true }),
    s('path', { d: 'M52 50l18 6M92 44l20-6', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: dots([[62, 68], [100, 64]], 5) }, 'dark'),
    s('path', { d: 'M64 96q16-6 32 2', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M34 142q0-24 46-24t46 24z' }, 'blue')
  ],
  esmalte: [
    s('rect', { x: 26, y: 70, width: 50, height: 66, rx: 10 }, 'red', { accent: true }),
    s('rect', { x: 38, y: 22, width: 26, height: 50, rx: 4 }, 'black'),
    s('path', { d: 'M34 84q4-6 10-6', ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: 'M96 140V66q0-8 8-8t8 8v12q0-8 8-8t8 8v12q0-8 8-8t8 8v62' }, 'skin'),
    s('path', { d: ells([[104, 70, 5, 7], [120, 82, 5, 7], [136, 94, 5, 7]]) }, 'red')
  ],
  'espléndido': [
    s('path', { d: 'M14 136q30-30 66-10q36-26 66 10z' }, 'green'),
    s('path', { d: rays(80, 64, 34, 52, 12), ...SW(5) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 64, r: 28 }, 'yellow', { accent: true }),
    s('path', { d: sparkle(28, 32, 9) + sparkle(134, 30, 9) + sparkle(130, 104, 7) }, 'yellow')
  ],
  esquivar: [
    ground(),
    ...lean(64, 136, -30, 'blue', { accent: true }),
    s('path', { d: 'M56 112l-14 24', ...SW(7) }, 'blue', { stroke: true }),
    s('circle', { cx: 120, cy: 56, r: 14 }, 'red'),
    s('path', { d: 'M92 50h-30M94 62H74M96 40H80', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 52q4-12 0-24', ...SW(3) }, 'orange', { stroke: true })
  ],
  facha: [
    ground(),
    ...person(80, 136, 'orange', { accent: true }),
    s('path', { d: 'M70 92l10 10 10-10', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M66 72h28', ...SW(6) }, 'black', { stroke: true }),
    s('path', { d: 'M68 64q4-16 22-12', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M94 100l14-12', ...SW(7) }, 'orange', { stroke: true }),
    s('path', { d: sparkle(32, 50, 10) + sparkle(128, 46, 8) + sparkle(124, 100, 6) }, 'yellow')
  ],
  'fricción': [
    s('path', { d: 'M14 112h132v24H14z' }, 'tan'),
    s('path', { d: 'M14 112l8 6 8-6 8 6 8-6 8 6 8-6 8 6 8-6 8 6 8-6 8 6 8-6 8 6 8-6 8 6 8-6', ...SW(3) }, 'brown', { stroke: true }),
    s('rect', { x: 58, y: 70, width: 56, height: 40, rx: 4 }, 'blue', { accent: true }),
    arrow('M18 90h30m-10-8 10 8-10 8', 'gray', 5),
    s('path', { d: burst(56, 110, 12, 5, 7) + burst(120, 108, 8, 4, 6) }, 'orange'),
    s('path', { d: 'M48 98q-6-8 0-14M126 96q4-8 0-14', ...SW(3) }, 'red', { stroke: true })
  ],
  gaviota: [
    backdrop('sky'),
    s('path', { d: 'M14 120q16-8 33 0t33 0t33 0t33 0v16H14z' }, 'blue'),
    s('path', { d: 'M24 54q30-26 56 6q26-32 56-6q-30-6-56 22q-26-28-56-22z' }, 'gray'),
    s('ellipse', { cx: 80, cy: 68, rx: 26, ry: 11 }, 'white', { accent: true }),
    s('path', { d: 'M102 64l14 2-14 4z' }, 'yellow'),
    s('circle', { cx: 96, cy: 64, r: 2 }, 'dark'),
    s('path', { d: 'M38 46l-10 4M122 46l10 4', ...SW(4) }, 'dark', { stroke: true })
  ],
  'gendarmería': [
    ground(),
    ...person(64, 136, 'navy', { accent: true }),
    s('path', { d: 'M50 64h28V50H50z' }, 'navy'),
    s('path', { d: 'M48 64h32', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M50 54h28', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: star(72, 104, 6) }, 'yellow'),
    s('path', { d: 'M96 114h48M100 114v22M140 114v22', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M108 114l8-6 8 6 8-6', ...SW(3) }, 'white', { stroke: true })
  ],
  'generalización': [
    s('circle', { cx: 36, cy: 80, r: 16 }, 'red', { accent: true }),
    s('path', { d: ring(36, 80, 24), ...SW(4) }, 'dark', { stroke: true }),
    arrow('M64 80h26m-8-8 8 8-8 8', 'gray', 5),
    s('path', { d: dots([[106, 40], [134, 40], [106, 68], [134, 68], [106, 96], [134, 96], [106, 124], [134, 124]], 10) }, 'red'),
    s('path', { d: 'M96 26h48v112H96z', ...DASH(2, '4 4') }, 'gray', { stroke: true })
  ],
  'glándula': [
    s('path', { d: 'M54 14v40q-30 20-40 82h132q-10-62-40-82V14z' }, 'skin'),
    s('path', { d: 'M78 72q-6-12-20-10q-12 4-10 22q4 18 20 14q10-4 10-14zM82 72q6-12 20-10q12 4 10 22q-4 18-20 14q-10-4-10-14z' }, 'pink', { accent: true }),
    s('rect', { x: 74, y: 76, width: 12, height: 14, rx: 4 }, 'pink'),
    s('path', { d: 'M80 52v16', ...SW(4) }, 'tan', { stroke: true })
  ],
  gobernabilidad: [
    s('path', { d: rays(80, 80, 30, 62, 8), ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: dots(around(80, 80, 62, 8), 6) }, 'brown'),
    s('path', { d: ring(80, 80, 44), ...SW(10) }, 'brown', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 80, r: 16 }, 'yellow'),
    s('circle', { cx: 80, cy: 80, r: 6 }, 'brown')
  ],
  granado: [
    ground(),
    s('path', { d: 'M54 136V96', ...SW(9) }, 'brown', { stroke: true }),
    s('path', { d: ells([[54, 64, 42, 36]]) }, 'green'),
    s('path', { d: dots([[36, 56], [70, 48], [62, 82], [30, 80]], 8) }, 'red'),
    s('circle', { cx: 120, cy: 112, r: 22 }, 'red', { accent: true }),
    s('circle', { cx: 120, cy: 112, r: 16 }, 'cream'),
    s('path', { d: dots([[112, 106], [122, 104], [128, 112], [116, 116], [124, 120], [112, 118], [120, 112]], 3) }, 'red')
  ],
  guita: [
    s('rect', { x: 18, y: 76, width: 92, height: 50, rx: 4, transform: 'rotate(-10 64 101)' }, 'green'),
    s('rect', { x: 26, y: 70, width: 92, height: 50, rx: 4, transform: 'rotate(-4 72 95)' }, 'mint'),
    s('rect', { x: 26, y: 70, width: 92, height: 50, rx: 4, transform: 'rotate(-4 72 95)', ...SW(3) }, 'green', { stroke: true }),
    s('circle', { cx: 72, cy: 95, r: 14 }, 'green', { accent: true }),
    s('path', { d: ells([[124, 128, 20, 7], [124, 120, 20, 7], [124, 112, 20, 7]]) }, 'orange'),
    s('ellipse', { cx: 124, cy: 104, rx: 20, ry: 7 }, 'yellow'),
    s('path', { d: sparkle(40, 40, 10) + sparkle(120, 50, 8) }, 'yellow')
  ],
  hala: [
    ground(),
    ...person(80, 136, 'red', { accent: true }),
    s('path', { d: 'M70 98L46 56M90 98l24-42', ...SW(7) }, 'red', { stroke: true }),
    s('path', { d: dots([[44, 52], [116, 52]], 7) }, 'skin'),
    s('path', { d: 'M40 44q40-24 80 0', ...SW(9) }, 'blue', { stroke: true }),
    s('path', { d: 'M40 44q40-24 80 0', ...SW(9, { 'stroke-linecap': 'butt', 'stroke-dasharray': '8 8' }) }, 'white', { stroke: true }),
    s('path', { d: 'M72 74q8 8 16 0z' }, 'dark'),
    s('path', { d: 'M24 90l-10-4M26 104l-12 2M136 90l10-4M134 104l12 2', ...SW(4) }, 'orange', { stroke: true })
  ],
  'hipertensión': [
    s('circle', { cx: 92, cy: 66, r: 48 }, 'white'),
    s('path', { d: ring(92, 66, 48), ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: wedge(92, 66, 40, -20, 40) }, 'red', { accent: true }),
    s('circle', { cx: 92, cy: 66, r: 30 }, 'white'),
    s('path', { d: 'M92 66l34 6', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 92, cy: 66, r: 6 }, 'dark'),
    s('path', { d: 'M56 112q-20 10-24 32', ...SW(4) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 28, cy: 128, rx: 12, ry: 16 }, 'gray')
  ],
  inclinar: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 136l18-40 18 40z' }, 'brown'),
    s('rect', { x: 20, y: 72, width: 124, height: 10, rx: 3, transform: 'rotate(18 46 96)' }, 'orange', { accent: true }),
    s('circle', { cx: 108, cy: 98, r: 10 }, 'blue'),
    s('path', { d: 'M86 136a40 40 0 0 0-6-24', ...SW(3) }, 'red', { stroke: true }),
    arrow('M112 80l16 6m-8 4 8-4-4-8', 'gray', 3)
  ],
  indagar: [
    s('path', { d: ells([[30, 124, 6, 9], [50, 108, 6, 9], [66, 124, 6, 9], [86, 106, 6, 9]]) }, 'brown'),
    s('path', { d: dots([[30, 112], [50, 96], [66, 112], [86, 94]], 3) }, 'brown'),
    s('circle', { cx: 100, cy: 64, r: 30 }, 'sky'),
    s('path', { d: ring(100, 64, 30), ...SW(7) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: 'M78 86l-30 30', ...SW(10) }, 'brown', { stroke: true }),
    s('path', { d: ells([[100, 64, 8, 12]]) + 'M96 50a3 3 0 1 0 6 0a3 3 0 1 0-6 0z' }, 'brown')
  ],
  indirecto: [
    s('circle', { cx: 24, cy: 120, r: 10 }, 'blue', { accent: true }),
    s('circle', { cx: 136, cy: 120, r: 10 }, 'red'),
    s('rect', { x: 62, y: 88, width: 36, height: 48, rx: 4 }, 'gray'),
    s('path', { d: 'M34 120h92', ...DASH(3, '4 6') }, 'gray', { stroke: true }),
    s('path', { d: 'M28 108q-6-60 32-70q40-14 50 20q40-10 26 48', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M128 104l8 10 6-14', ...SW(5) }, 'orange', { stroke: true })
  ],
  intelecto: [
    s('path', { d: 'M52 140v-22q-26-10-26-46q0-50 50-50q46 0 46 44l12 22-12 4v14q0 12-14 10l-16-2v26z' }, 'navy'),
    s('path', { d: rays(76, 68, 26, 36, 8), ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 76, cy: 64, r: 18 }, 'yellow', { accent: true }),
    s('rect', { x: 68, y: 80, width: 16, height: 12, rx: 2 }, 'gray'),
    s('path', { d: 'M70 60l6 8 6-8', ...SW(2) }, 'orange', { stroke: true })
  ],
  irresistible: [
    s('path', { d: 'M24 40v40q0 20 20 20t20-20V40', ...SW(16, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M16 40h16M56 40h16', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('path', { d: heart(100, 52, 14) + heart(128, 84, 12) + heart(102, 112, 12) }, 'pink'),
    s('path', { d: 'M76 56h8M76 86h14M76 108h10', ...SW(3) }, 'gray', { stroke: true })
  ],
  jardinero: [
    ground(),
    ...person(46, 136, 'green', { accent: true }),
    s('path', { d: 'M56 98l18-6', ...SW(7) }, 'green', { stroke: true }),
    s('path', { d: 'M70 86h24l-2 22H72z' }, 'blue'),
    s('path', { d: 'M94 92l18-12', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M116 82l4 12M122 80l6 10M126 78l8 8', ...SW(2) }, 'sky', { stroke: true }),
    ...flower(126, 112, 'red').slice(0, 1),
    s('path', { d: dots([[126, 106]], 8) + dots([[110, 120]], 6) }, 'pink')
  ],
  larva: [
    s('path', { d: leaflet(16, 120, -20, 136, 30) }, 'green'),
    s('path', { d: dots([[42, 96], [58, 88], [74, 84], [90, 84], [106, 88]], 10) }, 'mint', { accent: true }),
    s('circle', { cx: 122, cy: 84, r: 12 }, 'yellow'),
    s('circle', { cx: 126, cy: 82, r: 2.5 }, 'dark'),
    s('path', { d: 'M120 72l-4-10M128 72l4-10', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M42 106v4M58 98v4M74 94v4M90 94v4M106 98v4', ...SW(3) }, 'dark', { stroke: true })
  ],
  manija: [
    s('rect', { x: 30, y: 14, width: 100, height: 132, rx: 4 }, 'brown'),
    s('rect', { x: 40, y: 24, width: 80, height: 50, rx: 3 }, 'tan'),
    s('rect', { x: 92, y: 82, width: 16, height: 44, rx: 6 }, 'gray'),
    s('path', { d: 'M100 92H62', ...SW(10) }, 'yellow', { stroke: true, accent: true }),
    s('circle', { cx: 100, cy: 92, r: 9 }, 'yellow'),
    s('circle', { cx: 100, cy: 112, r: 3 }, 'dark')
  ],
  masivamente: [
    s('path', { d: dots(Array.from({ length: 24 }, (_, k) => [24 + (k % 6) * 22 + (Math.floor(k / 6) % 2) * 11, 36 + Math.floor(k / 6) * 26]), 7) }, 'skin'),
    s('path', { d: busts(Array.from({ length: 6 }, (_, k) => 24 + k * 22), 58, 16, 12) + busts(Array.from({ length: 6 }, (_, k) => 35 + k * 22), 84, 16, 12) }, 'blue'),
    s('path', { d: busts(Array.from({ length: 6 }, (_, k) => 24 + k * 22), 110, 16, 12) + busts(Array.from({ length: 6 }, (_, k) => 35 + k * 22), 136, 16, 12) }, 'orange', { accent: true })
  ],
  mecha: [
    s('circle', { cx: 66, cy: 96, r: 40 }, 'black', { accent: true }),
    s('rect', { x: 78, y: 48, width: 20, height: 16, rx: 3, transform: 'rotate(40 88 56)' }, 'dark'),
    s('path', { d: 'M94 50q10-18 24-14', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: burst(122, 34, 14, 6, 8) }, 'orange'),
    s('circle', { cx: 122, cy: 34, r: 5 }, 'yellow'),
    s('path', { d: 'M48 80q4-12 16-16', ...SW(5) }, 'gray', { stroke: true })
  ],
  millar: [
    s('path', { d: 'M80 22l56 28-56 28-56-28z' }, 'yellow', { accent: true }),
    s('path', { d: 'M24 50l56 28v64l-56-28z' }, 'orange'),
    s('path', { d: 'M136 50l-56 28v64l56-28z' }, 'yellow'),
    s('path', { d: Array.from({ length: 9 }, (_, i) => { const t = (i + 1) / 10; return `M${24 + 56 * t} ${50 + 28 * t}v64M${80 + 56 * t} ${78 - 28 * t}v64M24 ${50 + 6.4 * (i + 1)}l56 28 56-28`; }).join(''), ...SW(1) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 22l56 28v64l-56 28-56-28V50zM24 50l56 28 56-28M80 78v64', ...SW(3) }, 'brown', { stroke: true })
  ],
  moderador: [
    ground(),
    s('rect', { x: 62, y: 96, width: 36, height: 40, rx: 3 }, 'brown'),
    ...person(80, 96, 'purple', { h: 30, w: 24, r: 11, accent: true }),
    s('path', { d: bubble(14, 24, 40, 28) }, 'sky'),
    s('path', { d: bubble(106, 24, 40, 28) }, 'mint'),
    s('path', { d: busts([28, 132], 136, 26, 30) }, 'gray'),
    s('path', { d: dots([[28, 98], [132, 98]], 11) }, 'skin'),
    s('path', { d: 'M90 72l12-10', ...SW(4) }, 'dark', { stroke: true })
  ],
  morbo: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 8 }, 'brown'),
    s('circle', { cx: 80, cy: 72, r: 34 }, 'white'),
    s('path', { d: ring(80, 72, 34), ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 88, cy: 72, r: 16 }, 'green', { accent: true }),
    s('circle', { cx: 88, cy: 72, r: 7 }, 'dark'),
    s('path', { d: 'M74 116h12l6 22H68z' }, 'dark'),
    s('path', { d: 'M46 34l12 8M114 34l-12 8', ...SW(4) }, 'tan', { stroke: true })
  ],
  mordaza: [
    s('path', { d: 'M52 30h60v18H70v64h42v18H52z' }, 'blue', { accent: true }),
    s('path', { d: 'M124 18v66', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 18h32', ...SW(8) }, 'dark', { stroke: true }),
    s('rect', { x: 110, y: 84, width: 28, height: 8, rx: 2 }, 'gray'),
    s('rect', { x: 80, y: 92, width: 48, height: 20, rx: 2 }, 'tan')
  ],
  mortero: [
    s('path', { d: 'M28 80h104q-6 46-52 48q-46-2-52-48z' }, 'gray', { accent: true }),
    s('rect', { x: 56, y: 124, width: 48, height: 12, rx: 4 }, 'gray'),
    s('ellipse', { cx: 80, cy: 80, rx: 52, ry: 9 }, 'dark'),
    s('path', { d: 'M88 84l32-62', ...SW(14) }, 'tan', { stroke: true }),
    s('path', { d: leaflet(50, 78, -30, 18, 5) + leaflet(66, 78, -120, 16, 5) }, 'green'),
    s('path', { d: dots([[100, 80], [60, 80]], 3) }, 'yellow')
  ],
  'pacíficamente': [
    s('rect', { x: 14, y: 14, width: 132, height: 122, rx: 12 }, 'sky'),
    s('path', { d: 'M14 112q33-8 66 0t66 0v12q0 12-12 12H26q-12 0-12-12z' }, 'blue'),
    s('path', { d: 'M40 70q20-30 46-10q16-22 34-10q-12 6-18 18q-10 20-34 16q-18-2-28-14z' }, 'white', { accent: true }),
    s('path', { d: 'M40 70q20-30 46-10q16-22 34-10q-12 6-18 18q-10 20-34 16q-18-2-28-14z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M120 50l12 0-10 6z' }, 'orange'),
    s('path', { d: 'M126 56q8 6 14 14', ...SW(2) }, 'green', { stroke: true }),
    s('path', { d: leaflet(130, 60, 40, 12, 4) + leaflet(136, 66, 60, 10, 3) }, 'green')
  ],
  peluca: [
    s('path', { d: 'M66 136h28l-4-24H70z' }, 'gray'),
    s('ellipse', { cx: 80, cy: 82, rx: 28, ry: 34 }, 'cream'),
    s('path', { d: ells([[54, 58, 16, 16], [74, 42, 18, 16], [98, 44, 18, 16], [112, 64, 14, 16], [48, 82, 12, 16], [112, 88, 12, 16], [50, 104, 10, 12], [110, 108, 10, 12]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M66 64q14-10 30 0', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M52 136h56', ...SW(6) }, 'brown', { stroke: true })
  ],
  'periférico': [
    s('rect', { x: 46, y: 22, width: 68, height: 50, rx: 4 }, 'dark'),
    s('rect', { x: 52, y: 28, width: 56, height: 38, rx: 2 }, 'sky', { accent: true }),
    s('path', { d: 'M74 72h12v10H74z' }, 'gray'),
    s('rect', { x: 40, y: 98, width: 70, height: 22, rx: 3 }, 'gray'),
    s('path', { d: grid(46, 102, 7, 2, 6, 5, 9, 8) }, 'white'),
    s('ellipse', { cx: 128, cy: 108, rx: 10, ry: 14 }, 'gray'),
    s('rect', { x: 12, y: 30, width: 26, height: 30, rx: 3 }, 'navy'),
    s('path', { d: 'M38 46h8M114 46q20 10 14 48', ...SW(3) }, 'dark', { stroke: true })
  ],
  persistencia: [
    s('path', { d: 'M40 18h50v14H40z' }, 'gray'),
    s('path', { d: 'M64 32v10', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: drop(64, 60, 6) + drop(64, 88, 5) }, 'blue', { accent: true }),
    s('path', { d: 'M14 136q2-30 30-34h40q36 2 38 34z' }, 'gray'),
    s('ellipse', { cx: 64, cy: 106, rx: 12, ry: 5 }, 'dark'),
    s('path', { d: 'M48 104q-6-6-10 0M80 104q6-6 10 0', ...SW(3) }, 'sky', { stroke: true })
  ],
  piar: [
    s('path', { d: 'M24 108q56 40 112 0', ...SW(14) }, 'brown', { stroke: true }),
    s('path', { d: 'M30 112q50 20 100 0', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: dots([[54, 94], [80, 88], [106, 94]], 16) }, 'yellow', { accent: true }),
    s('path', { d: 'M48 80l6-12 6 12zM74 74l6-14 6 14zM100 80l6-12 6 12z' }, 'orange'),
    s('path', { d: dots([[48, 90], [60, 90], [74, 84], [86, 84], [100, 90], [112, 90]], 2) }, 'dark'),
    s('path', { d: 'M62 50q-6-8 0-16M80 44v-16M98 50q6-8 0-16', ...SW(3) }, 'gray', { stroke: true })
  ],
  plateado: [
    s('path', { d: 'M22 120l10-24h44l10 24zM74 120l10-24h44l10 24zM48 96l10-24h44l10 24z' }, 'gray', { accent: true }),
    s('path', { d: 'M32 96h44M84 96h44M58 72h44', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M22 120h116', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(40, 40, 12) + sparkle(124, 48, 10) + sparkle(84, 112, 7) }, 'sky')
  ],
  presumiblemente: [
    ground(),
    ...person(44, 136, 'blue'),
    s('path', { d: dots([[68, 70], [78, 58]], 4) }, 'gray'),
    s('path', { d: 'M76 48q-4-24 22-26q16-14 34 0q18 6 10 22q4 18-20 18H92q-18 0-16-14z' }, 'white'),
    s('path', { d: 'M76 48q-4-24 22-26q16-14 34 0q18 6 10 22q4 18-20 18H92q-18 0-16-14z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M90 42q0-10 10-10q4-8 14-4q10 0 10 14z' }, 'gray'),
    s('path', { d: 'M98 46l-2 6M108 46l-2 6M118 46l-2 6', ...SW(3) }, 'blue', { stroke: true, accent: true })
  ],
  'páramo': [
    s('rect', { x: 14, y: 14, width: 132, height: 122, rx: 12 }, 'gray'),
    s('path', { d: 'M14 84l30-30 24 20 30-34 48 44v52H14z' }, 'navy'),
    s('path', { d: 'M14 96q66-14 132 0v40H14z' }, 'tan', { accent: true }),
    s('path', { d: 'M44 132v-22M110 128v-18', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: ells([[44, 106, 9, 7], [110, 106, 8, 6]]) }, 'green'),
    s('path', { d: 'M74 120q4-8 8 0M128 124q4-8 8 0', ...SW(3) }, 'mint', { stroke: true })
  ],
  ratio: [
    s('rect', { x: 18, y: 30, width: 42, height: 42, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 60, y: 30, width: 84, height: 42, rx: 4 }, 'orange'),
    s('path', { d: 'M60 30v42', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: dots([[39, 108]], 12) }, 'blue'),
    s('path', { d: dots([[90, 108], [124, 108]], 12) }, 'orange'),
    s('path', { d: dots([[64, 102], [64, 116]], 3) }, 'dark')
  ],
  rededor: [
    s('path', { d: ring(80, 80, 56), ...DASH(5, '10 10') }, 'orange', { stroke: true }),
    arrow('M126 46l10 2 0-10', 'orange', 5),
    s('path', { d: 'M74 112V88', ...SW(8) }, 'brown', { stroke: true }),
    s('circle', { cx: 74, cy: 70, r: 22 }, 'green', { accent: true }),
    s('path', { d: dots([[80, 24], [136, 80], [80, 136], [24, 80]], 6) }, 'blue')
  ],
  reencuentro: [
    ground(),
    ...person(64, 136, 'blue'),
    ...person(96, 136, 'red', { accent: true }),
    s('path', { d: 'M54 96q26-12 52 0M106 98q-26-12-52 0', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 36, 14) }, 'pink'),
    s('path', { d: sparkle(40, 40, 8) + sparkle(124, 44, 8) }, 'yellow')
  ],
  referendo: [
    ...paper(40, 16, 80, 120),
    s('path', { d: rects([[54, 36, 20, 20], [54, 82, 20, 20]]), ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 46l7 8 14-18', ...SW(5) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M84 46h24M84 92h24', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M128 34l-40 76', ...SW(6) }, 'navy', { stroke: true }),
    s('path', { d: 'M88 110l-4 10 9-6z' }, 'dark')
  ],
  'refrán': [
    ground(),
    ...person(44, 136, 'brown'),
    s('path', { d: 'M34 76q10 22 20 0z' }, 'white'),
    s('path', { d: 'M34 76q10 22 20 0', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: bubble(70, 16, 74, 58) }, 'cream', { accent: true }),
    s('path', { d: 'M84 26h46v32H84z' }, 'tan'),
    s('path', { d: 'M84 26q-6 16 0 32M130 26q6 16 0 32M92 36h30M92 46h22', ...SW(3) }, 'brown', { stroke: true })
  ],
  relator: [
    ground(),
    s('rect', { x: 20, y: 104, width: 50, height: 12, rx: 3 }, 'brown'),
    ...person(44, 104, 'green', { h: 30, w: 24, r: 11, accent: true }),
    s('path', { d: 'M28 92l20 6 20-6v14l-20 6-20-6z' }, 'red'),
    s('path', { d: bubble(76, 22, 66, 50) }, 'sky'),
    s('path', { d: 'M92 56V40h8v6h6v-6h6v6h6v-6h8v16z' }, 'purple'),
    s('path', { d: 'M40 120v16M50 120v16', ...SW(4) }, 'brown', { stroke: true })
  ],
  rigidez: [
    s('rect', { x: 14, y: 70, width: 132, height: 20, rx: 3 }, 'gray', { accent: true }),
    s('path', { d: 'M14 80h132', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 90q-8 14 2 28M130 90q8 14-2 28', ...SW(14) }, 'skin', { stroke: true }),
    arrow('M40 40l14 18m0-12v12H42M120 40l-14 18m0-12v12h12', 'red', 4),
    s('path', { d: 'M80 52v-8M70 54l-4-6M90 54l4-6', ...SW(3) }, 'orange', { stroke: true })
  ],
  serial: [
    s('rect', { x: 14, y: 46, width: 132, height: 68, rx: 4 }, 'dark'),
    s('path', { d: rects([[18, 50, 6, 6], [32, 50, 6, 6], [46, 50, 6, 6], [60, 50, 6, 6], [74, 50, 6, 6], [88, 50, 6, 6], [102, 50, 6, 6], [116, 50, 6, 6], [130, 50, 6, 6], [18, 104, 6, 6], [32, 104, 6, 6], [46, 104, 6, 6], [60, 104, 6, 6], [74, 104, 6, 6], [88, 104, 6, 6], [102, 104, 6, 6], [116, 104, 6, 6], [130, 104, 6, 6]]) }, 'white'),
    s('path', { d: rects([[18, 60, 36, 40], [62, 60, 36, 40]]) }, 'sky'),
    s('rect', { x: 106, y: 60, width: 36, height: 40 }, 'yellow', { accent: true }),
    s('path', { d: 'M36 70v20M80 70v20M124 70v20', ...SW(6) }, 'navy', { stroke: true })
  ],
  simplificar: [
    s('path', { d: 'M18 50q10-30 20 0t-6 20q-14 10 4 20q20 10 10-20q-6-24 14-18q16 6 0 24', ...SW(5) }, 'gray', { stroke: true }),
    arrow('M80 64h16m-6-8 6 8-6 8', 'orange', 5),
    s('path', { d: 'M108 64h36', ...SW(6) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M18 120h124', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: sparkle(126, 36, 9) }, 'yellow')
  ],
  'sinfónico': [
    s('path', { d: 'M14 120h132v16H14z' }, 'brown'),
    ...person(80, 120, 'black', { h: 40, w: 28, r: 13, accent: true }),
    s('path', { d: 'M94 90l24-30', ...SW(6) }, 'black', { stroke: true }),
    s('path', { d: 'M118 60l14-20', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 90l-22-14', ...SW(6) }, 'black', { stroke: true }),
    ...note(30, 50, 'purple'),
    s('path', { d: 'M22 120v-16h20v16M118 120v-16h20v16', ...SW(3) }, 'gray', { stroke: true })
  ],
  suplicar: [
    ground(),
    s('path', { d: 'M56 136h50v-10H70l-6-30H48z' }, 'blue'),
    s('rect', { x: 46, y: 64, width: 28, height: 40, rx: 10, transform: 'rotate(10 60 104)' }, 'blue', { accent: true }),
    s('circle', { cx: 66, cy: 50, r: 12 }, 'skin'),
    s('path', { d: 'M70 76l18-10', ...SW(7) }, 'blue', { stroke: true }),
    s('path', { d: 'M90 70l6-22 6 22z' }, 'skin'),
    s('path', { d: drop(78, 60, 3) }, 'sky'),
    s('path', { d: 'M110 40l10-10M114 52h14M106 30l2-12', ...SW(3) }, 'yellow', { stroke: true })
  ],
  'temático': [
    ground(),
    s('path', { d: ring(80, 70, 50) + rays(80, 70, 0, 50, 8), ...SW(4) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M80 70l-24 66M80 70l24 66', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: rects(around(80, 70, 50, 8).map(([x, y]) => [x - 7, y - 4, 14, 12])) }, 'red'),
    s('circle', { cx: 80, cy: 70, r: 8 }, 'yellow')
  ],
  torturar: [
    s('path', { d: 'M30 54q0-20 22-20q8-16 28-12q12-12 30 0q20 0 22 22z' }, 'dark'),
    s('path', { d: 'M76 54l-8 16h12l-8 16', ...SW(4) }, 'yellow', { stroke: true }),
    ...person(80, 136, 'gray'),
    s('path', { d: 'M66 100l-6-28M94 100l6-28', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 76q6-4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: spiral(38, 96) + spiral(116, 96), ...SW(3) }, 'red', { stroke: true, accent: true })
  ],
  zen: [
    s('path', { d: 'M14 112q33-8 66 0t66 0M14 124q33-8 66 0t66 0M14 136q33-8 66 0t66 0', ...SW(3) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 80, cy: 98, rx: 36, ry: 12 }, 'gray'),
    s('ellipse', { cx: 80, cy: 74, rx: 28, ry: 11 }, 'dark', { accent: true }),
    s('ellipse', { cx: 80, cy: 53, rx: 20, ry: 9 }, 'gray'),
    s('ellipse', { cx: 80, cy: 36, rx: 12, ry: 7 }, 'dark'),
    s('path', { d: leaflet(116, 40, -30, 22, 6) }, 'green')
  ],
  'óleo': [
    s('path', { d: 'M80 30q50 0 56 40q4 30-26 28q-12 0-10 14q0 18-26 18q-56-6-56-50q0-50 62-50z' }, 'tan'),
    s('circle', { cx: 52, cy: 104, r: 9 }, 'white'),
    s('path', { d: dots([[50, 58]], 9) }, 'red', { accent: true }),
    s('path', { d: dots([[78, 48]], 9) }, 'blue'),
    s('path', { d: dots([[106, 56]], 9) }, 'yellow'),
    s('path', { d: dots([[40, 82]], 8) }, 'green'),
    s('path', { d: 'M150 18l-56 66', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M96 80l-10 14 14-8z' }, 'purple')
  ],
  abstinencia: [
    ...glass(46, 0, false),
    s('path', { d: ring(46, 74, 40) + 'M18 46l56 56', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M96 140V96q0-8 6-8V54q0-6 6-6t6 6v26-34q0-6 6-6t6 6v34-28q0-6 6-6t6 6v32-20q0-6 5-6t5 6v42q0 34-24 34z' }, 'skin')
  ],
  aleatorio: [
    s('rect', { x: 20, y: 54, width: 56, height: 56, rx: 10, transform: 'rotate(-14 48 82)' }, 'white'),
    s('rect', { x: 20, y: 54, width: 56, height: 56, rx: 10, transform: 'rotate(-14 48 82)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[34, 72], [48, 82], [62, 92]], 5), transform: 'rotate(-14 48 82)' }, 'dark'),
    s('rect', { x: 82, y: 76, width: 56, height: 56, rx: 10, transform: 'rotate(18 110 104)' }, 'red', { accent: true }),
    s('path', { d: dots([[96, 90], [124, 90], [96, 118], [124, 118], [110, 104]], 5), transform: 'rotate(18 110 104)' }, 'white'),
    s('path', { d: 'M100 40q10-12 22-6M110 26q10-6 20 0', ...SW(3) }, 'orange', { stroke: true })
  ],
  anemia: [
    s('path', { d: drop(64, 84, 34) }, 'pink', { accent: true }),
    s('path', { d: drop(64, 84, 34), ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M50 84q4-4 8 0M70 84q4-4 8 0M54 104q10-6 20 0', ...SW(3) }, 'dark', { stroke: true }),
    arrow('M124 40v76m-12-12 12 12 12-12', 'gray', 6)
  ],
  aplastar: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 116h70l-4 14H48z' }, 'red'),
    s('path', { d: 'M52 18h40v62h22q16 0 16 16v18H52z' }, 'dark', { accent: true }),
    s('path', { d: 'M52 110h78', ...SW(4) }, 'black', { stroke: true }),
    s('path', { d: 'M30 112l-14-6M32 126H14M136 112l12-8M138 128h10', ...SW(4) }, 'orange', { stroke: true })
  ],
};
