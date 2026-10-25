// Illustration specs for words still undrawn in batches 0058–0060 (see server/scripts/lexicon/art.js)
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
  'compilación': [
    ...paper(24, 30, 34, 44),
    s('rect', { x: 64, y: 22, width: 34, height: 44, rx: 3 }, 'sky'),
    s('rect', { x: 104, y: 30, width: 34, height: 44, rx: 3 }, 'mint'),
    arrow('M44 80l24 18M118 80l-24 18'),
    s('rect', { x: 46, y: 100, width: 68, height: 38, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M54 108h52M54 118h52M54 128h52', ...SW(3) }, 'white', { stroke: true })
  ],
  constructivo: [
    s('path', { d: bubble(20, 20, 120, 96) }, 'cream'),
    s('path', { d: bubble(20, 20, 120, 96), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: rects([[40, 80, 26, 20], [68, 80, 26, 20], [96, 80, 26, 20], [54, 58, 26, 20]]) }, 'orange', { accent: true }),
    s('rect', { x: 82, y: 36, width: 26, height: 20 }, 'green'),
    arrow('M96 30l-6-8', 'green', 4)
  ],
  'contraloría': [
    ...paper(30, 24, 76, 100),
    s('path', { d: 'M40 42h56M40 56h56M40 70h56M40 84h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[54, 108], [70, 108]], 8) }, 'yellow'),
    s('circle', { cx: 104, cy: 92, r: 22 }, 'sky', { accent: true }),
    s('path', { d: ring(104, 92, 22), ...SW(6) }, 'navy', { stroke: true }),
    s('path', { d: 'M120 108l20 22', ...SW(9) }, 'brown', { stroke: true })
  ],
  cortometraje: [
    s('rect', { x: 34, y: 54, width: 92, height: 52, rx: 4 }, 'dark'),
    s('path', { d: rects([[40, 58, 8, 6], [56, 58, 8, 6], [72, 58, 8, 6], [88, 58, 8, 6], [104, 58, 8, 6], [40, 96, 8, 6], [56, 96, 8, 6], [72, 96, 8, 6], [88, 96, 8, 6], [104, 96, 8, 6]]) }, 'white'),
    s('path', { d: rects([[40, 68, 36, 24], [82, 68, 36, 24]]) }, 'sky', { accent: true }),
    s('path', { d: 'M54 72l12 8-12 8z' }, 'red'),
    s('circle', { cx: 120, cy: 40, r: 16 }, 'yellow'),
    s('path', { d: 'M120 30v10l7 5', ...SW(3) }, 'dark', { stroke: true })
  ],
  cosita: [
    s('path', { d: 'M28 112q0-20 26-22h44q30 0 34 18v10q-6 12-40 14H48q-20-2-20-20z' }, 'skin'),
    s('path', { d: 'M52 92q-6-12 8-14M70 90q-4-14 10-14M88 90q0-14 14-12', ...SW(4) }, 'tan', { stroke: true }),
    s('circle', { cx: 80, cy: 86, r: 10 }, 'pink', { accent: true }),
    s('path', { d: sparkle(64, 64, 8) + sparkle(98, 60, 6) }, 'yellow'),
    s('circle', { cx: 77, cy: 83, r: 3 }, 'white')
  ],
  'cínico': [
    s('circle', { cx: 80, cy: 80, r: 50 }, 'yellow', { accent: true }),
    s('path', { d: 'M52 70h20M88 66l20-6', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 82h16M90 80h16', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 108q24 2 40-12', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M118 40q6-6 12 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  desactivar: [
    s('rect', { x: 40, y: 30, width: 80, height: 100, rx: 14 }, 'white'),
    outline({ x: 40, y: 30, width: 80, height: 100, rx: 14 }),
    s('rect', { x: 62, y: 46, width: 36, height: 68, rx: 18 }, 'gray'),
    s('circle', { cx: 80, cy: 96, r: 14 }, 'dark', { accent: true }),
    s('path', { d: ring(80, 62, 6), ...SW(3) }, 'red', { stroke: true })
  ],
  descifrar: [
    s('rect', { x: 18, y: 26, width: 100, height: 80, rx: 6 }, 'cream'),
    s('path', { d: rects([[28, 36, 14, 14], [60, 36, 14, 14], [92, 36, 14, 14], [44, 58, 14, 14], [76, 58, 14, 14], [28, 80, 14, 14], [92, 80, 14, 14]]) }, 'navy'),
    s('path', { d: rects([[44, 36, 14, 14], [60, 80, 14, 14]]) }, 'orange'),
    s('circle', { cx: 92, cy: 92, r: 24 }, 'sky', { accent: true }),
    s('path', { d: ring(92, 92, 24), ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M110 110l24 24', ...SW(9) }, 'brown', { stroke: true })
  ],
  desobediencia: [
    arrow('M22 50h56M58 36l20 14-20 14', 'gray', 7),
    arrow('M22 110h56M58 96l20 14-20 14', 'gray', 7),
    arrow('M86 50h56M122 36l20 14-20 14', 'gray', 7),
    arrow('M142 110H86M106 96l-20 14 20 14', 'red', 8),
    s('circle', { cx: 114, cy: 110, r: 4 }, 'red', { accent: true })
  ],
  despegar: [
    s('path', { d: 'M14 136h132', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M22 136h12M50 136h12M78 136h12M106 136h12', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M30 118q8-8 18-4M22 104q10-8 20-4', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 72h84q16 0 18 8q-2 8-18 8H40z', transform: 'rotate(-28 80 80)' }, 'white'),
    s('path', { d: 'M34 72h84q16 0 18 8q-2 8-18 8H40z', ...SW(3), transform: 'rotate(-28 80 80)' }, 'gray', { stroke: true }),
    s('path', { d: 'M36 72l-6-22h12l14 22zM66 84l20 30h14l-6-30z', transform: 'rotate(-28 80 80)' }, 'blue', { accent: true }),
    s('path', { d: 'M60 76h50', ...DASH(4, '5 6'), transform: 'rotate(-28 80 80)' }, 'sky', { stroke: true })
  ],
  diagonal: [
    s('rect', { x: 28, y: 28, width: 104, height: 104, rx: 4 }, 'cream'),
    outline({ x: 28, y: 28, width: 104, height: 104, rx: 4 }, 'navy', 5),
    s('path', { d: 'M30 130L130 30', ...SW(7) }, 'red', { stroke: true, accent: true }),
    s('path', { d: dots([[30, 130], [130, 30]], 7) }, 'orange')
  ],
  distribuidor: [
    ground(),
    s('rect', { x: 18, y: 66, width: 78, height: 54, rx: 4 }, 'orange', { accent: true }),
    s('path', { d: 'M96 84h26l18 18v18H96z' }, 'blue'),
    s('path', { d: 'M104 90h16l10 12h-26z' }, 'sky'),
    s('path', { d: dots([[40, 122], [116, 122]], 11) }, 'dark'),
    s('path', { d: rects([[30, 78, 22, 20], [58, 78, 22, 20]]) }, 'tan'),
    arrow('M40 52l-12-18M80 52l12-18', 'green', 5)
  ],
  doctoral: [
    s('rect', { x: 34, y: 106, width: 92, height: 26, rx: 3 }, 'navy'),
    s('rect', { x: 40, y: 94, width: 80, height: 14, rx: 3 }, 'red'),
    s('path', { d: 'M56 70q0 14 24 14t24-14V58H56z' }, 'dark'),
    s('path', { d: 'M80 30l56 22-56 22-56-22z' }, 'black', { accent: true }),
    s('path', { d: 'M126 56v24', ...SW(3) }, 'yellow', { stroke: true }),
    s('circle', { cx: 126, cy: 84, r: 5 }, 'yellow')
  ],
  'eclesiástico': [
    ground(),
    s('rect', { x: 40, y: 72, width: 80, height: 64 }, 'cream'),
    s('path', { d: 'M34 76l46-30 46 30z' }, 'red', { accent: true }),
    s('rect', { x: 66, y: 98, width: 28, height: 38, rx: 12 }, 'brown'),
    s('path', { d: 'M80 16v30M70 26h20', ...SW(5) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 82, r: 7 }, 'sky')
  ],
  emblema: [
    s('path', { d: laurel(80, 82, 52) }, 'green'),
    s('path', { d: 'M80 26l44 14v34q0 36-44 56q-44-20-44-56V40z' }, 'navy', { accent: true }),
    s('path', { d: 'M80 36l34 11v27q0 28-34 44q-34-16-34-44V47z' }, 'red'),
    s('path', { d: star(80, 76, 22) }, 'yellow')
  ],
  encarar: [
    s('circle', { cx: 50, cy: 74, r: 28 }, 'skin'),
    s('circle', { cx: 110, cy: 74, r: 28 }, 'tan'),
    s('path', { d: 'M74 70l8 6-6 2M86 70l-8 6 6 2', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[60, 66], [100, 66]], 4) }, 'dark'),
    s('path', { d: 'M54 58l14 4M106 58l-14 4M58 88h12M90 88h12', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 136q0-34 26-34t26 34z' }, 'blue', { accent: true }),
    s('path', { d: 'M84 136q0-34 26-34t26 34z' }, 'red')
  ],
  escepticismo: [
    s('circle', { cx: 70, cy: 84, r: 42 }, 'skin'),
    s('path', { d: 'M46 64l16-2M78 56l18 8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[54, 76], [86, 76]], 5) }, 'dark'),
    s('path', { d: 'M56 104q14-6 28 2', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 128q10-12 26-8l4 10', ...SW(9) }, 'tan', { stroke: true }),
    s('path', { d: ells([[124, 36, 18, 14], [110, 66, 6, 5]]) }, 'gray', { accent: true }),
    s('path', { d: 'M117 36h14', ...SW(4) }, 'white', { stroke: true })
  ],
  'exageración': [
    ground(),
    ...person(80, 136, 'blue', { accent: true }),
    s('path', { d: 'M66 100l-50-16M94 100l50-16', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M14 78v16M146 78v16', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: fishes([[84, 40]]) }, 'orange'),
    s('path', { d: 'M40 70l-4-6M120 70l4-6', ...SW(3) }, 'orange', { stroke: true })
  ],
  exhibir: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'cream'),
    s('path', { d: 'M80 14l-34 44h68z' }, 'yellow'),
    s('rect', { x: 46, y: 50, width: 68, height: 54, rx: 2 }, 'brown', { accent: true }),
    s('rect', { x: 54, y: 58, width: 52, height: 38 }, 'sky'),
    s('path', { d: 'M54 96l18-20 12 12 8-8 14 16z' }, 'green'),
    s('rect', { x: 50, y: 120, width: 60, height: 22 }, 'gray'),
    s('path', { d: 'M24 132h112', ...SW(4) }, 'dark', { stroke: true })
  ],
  'filtración': [
    s('path', { d: 'M30 26h100l-38 54v18H68V80z' }, 'sky'),
    s('path', { d: 'M38 34h84l-34 46h-16z' }, 'brown'),
    s('path', { d: 'M30 26h100l-38 54v18H68V80z', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: drop(80, 116, 6) + drop(80, 140, 4) }, 'blue', { accent: true }),
    s('path', { d: dots([[60, 46], [76, 52], [96, 44]], 3) }, 'dark')
  ],
  fluidez: [
    s('path', { d: 'M14 52q22-18 44 0t44 0t44 0', ...SW(10) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M14 82q22-18 44 0t44 0t44 0', ...SW(10) }, 'sky', { stroke: true }),
    s('path', { d: 'M14 112q22-18 44 0t44 0t44 0', ...SW(10) }, 'mint', { stroke: true }),
    s('path', { d: dots([[30, 132], [60, 136], [96, 132]], 4) }, 'blue')
  ],
  generalidad: [
    s('path', { d: dots([[28, 52], [56, 52], [84, 52], [112, 52], [42, 92], [70, 92], [126, 92]], 9) }, 'skin'),
    s('path', { d: busts([28, 56, 84, 112], 84, 22, 22) + busts([42, 70, 126], 124, 22, 22) }, 'blue', { accent: true }),
    s('circle', { cx: 98, cy: 92, r: 9 }, 'skin'),
    s('path', { d: busts([98], 124, 22, 22) }, 'orange'),
    s('path', { d: 'M14 140h132', ...SW(3) }, 'gray', { stroke: true })
  ],
  gestor: [
    ground(),
    ...person(64, 136, 'navy', { accent: true }),
    s('path', { d: 'M64 92l-6 12 6 10 6-10z' }, 'red'),
    s('rect', { x: 92, y: 106, width: 34, height: 26, rx: 4 }, 'brown'),
    s('path', { d: 'M102 106v-6h14v6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M78 104l18 4', ...SW(6) }, 'navy', { stroke: true }),
    s('rect', { x: 26, y: 88, width: 20, height: 28, rx: 2 }, 'yellow')
  ],
  gorila: [
    s('path', { d: 'M30 136q-6-40 12-64q16-20 38-20t38 20q18 24 12 64z' }, 'dark', { accent: true }),
    s('circle', { cx: 80, cy: 48, r: 26 }, 'dark'),
    s('path', { d: 'M62 50q0-12 18-12t18 12q4 18-18 22q-22-4-18-22z' }, 'gray'),
    s('path', { d: dots([[72, 46], [88, 46]], 3) }, 'dark'),
    s('path', { d: 'M74 60h12', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 104q24 10 48 0', ...SW(4) }, 'gray', { stroke: true })
  ],
  grieta: [
    s('rect', { x: 18, y: 18, width: 124, height: 124, rx: 6 }, 'tan'),
    s('path', { d: rects([[18, 46, 124, 3], [18, 78, 124, 3], [18, 110, 124, 3]]) }, 'brown'),
    s('path', { d: 'M74 18l10 22-12 18 16 20-10 22 14 18-6 24', ...SW(7) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: 'M84 78l18 6M72 58l-14 4', ...SW(3) }, 'dark', { stroke: true })
  ],
  imparcialidad: [
    s('path', { d: 'M80 36v92M56 132h48M28 52h104', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M38 54l-14 34M38 54l14 34M122 54l-14 34M122 54l14 34', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 88h40q-2 14-20 14t-20-14zM102 88h40q-2 14-20 14t-20-14z' }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 34, r: 8 }, 'blue')
  ],
  impedimento: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 84v52M122 84v52', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 20, y: 64, width: 120, height: 26, rx: 4 }, 'white'),
    s('path', { d: 'M30 64l-10 13M54 64L34 90M78 64L58 90M102 64L82 90M126 64l-20 26M140 72l-14 18' , ...SW(10, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true, accent: true }),
    outline({ x: 20, y: 64, width: 120, height: 26, rx: 4 }, 'dark', 3),
    s('path', { d: dots([[38, 52], [122, 52]], 8) }, 'orange')
  ],
  imperativo: [
    ground(),
    ...person(52, 136, 'navy'),
    s('path', { d: 'M64 96l52-18', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M40 62q12-8 24 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: burst(126, 70, 20, 10, 8) }, 'red', { accent: true }),
    s('path', { d: rays(126, 70, 26, 34, 6, 30), ...SW(3) }, 'orange', { stroke: true })
  ],
  inercia: [
    s('path', { d: 'M14 128h132', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 104, cy: 100, r: 26 }, 'red', { accent: true }),
    s('path', { d: 'M92 88q12-8 22 0', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M20 86h46M30 100h40M20 114h46', ...SW(5) }, 'sky', { stroke: true }),
    arrow('M96 54h40M126 46l10 8-10 8', 'navy', 5)
  ],
  jinete: [
    ...horse('brown', 'dark'),
    s('path', { d: 'M60 68l6-24q2-6 10-4l6 4', ...SW(10) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 72, cy: 24, r: 10 }, 'skin'),
    s('path', { d: 'M62 22q10-12 20 0z' }, 'dark'),
    s('path', { d: 'M66 70l-4 22', ...SW(6) }, 'navy', { stroke: true })
  ],
  lineamiento: [
    s('rect', { x: 18, y: 18, width: 124, height: 124, rx: 10 }, 'mint'),
    s('path', { d: 'M34 128q20-50 52-40t36-56', ...DASH(5, '8 8') }, 'navy', { stroke: true }),
    s('path', { d: 'M120 22v32', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M122 22h18l-6 8 6 8h-18z' }, 'red', { accent: true }),
    s('circle', { cx: 34, cy: 128, r: 8 }, 'blue'),
    s('path', { d: 'M54 88l-8-6M70 84l2-10', ...SW(3) }, 'green', { stroke: true })
  ],
  'lingüístico': [
    s('path', { d: bubble(16, 22, 78, 56) }, 'blue', { accent: true }),
    s('path', { d: bubble(66, 66, 78, 56) }, 'orange'),
    s('path', { d: 'M30 42h48M30 56h32', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: dots([[86, 92], [104, 92], [122, 92]], 5) }, 'white'),
    s('path', { d: 'M122 132q4 8 12 4', ...SW(3) }, 'gray', { stroke: true })
  ],
  meditar: [
    s('path', { d: 'M28 132q0-14 52-14t52 14z' }, 'purple'),
    s('path', { d: 'M56 120q-6-38 24-38t24 38z' }, 'mint', { accent: true }),
    s('circle', { cx: 80, cy: 62, r: 16 }, 'skin'),
    s('path', { d: 'M72 62q3 3 6 0M82 62q3 3 6 0', ...SW(2.5) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 98l-18 16M102 98l18 16', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M48 40q32-30 64 0', ...SW(3) }, 'yellow', { stroke: true })
  ],
  'mercadería': [
    s('rect', { x: 18, y: 126, width: 124, height: 10, rx: 2 }, 'brown'),
    s('path', { d: 'M24 136v6M80 136v6M136 136v6', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: rects([[22, 88, 56, 38], [82, 88, 56, 38], [50, 50, 60, 38]]) }, 'tan', { accent: true }),
    s('path', { d: 'M22 88h56M82 88h56M50 50h60M50 107h28M110 69h0M82 107h56M50 69h60', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M44 88v38M110 88v38M80 50v38', ...SW(4) }, 'orange', { stroke: true })
  ],
  'nacionalización': [
    ground(),
    s('path', { d: 'M18 136V84l26 14V84l26 14V84l26 14v38z' }, 'gray'),
    s('rect', { x: 100, y: 64, width: 14, height: 72 }, 'dark'),
    s('path', { d: rects([[28, 112, 12, 10], [54, 112, 12, 10], [80, 112, 12, 10]]) }, 'yellow'),
    s('path', { d: 'M128 136V22', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M130 24q8-4 16 0v26q-8-4-16 0z' }, 'red', { accent: true }),
    s('path', { d: 'M104 56q-4-10 4-16', ...SW(3) }, 'gray', { stroke: true })
  ],
  ocasional: [
    s('rect', { x: 22, y: 30, width: 116, height: 106, rx: 8 }, 'white'),
    outline({ x: 22, y: 30, width: 116, height: 106, rx: 8 }),
    s('rect', { x: 22, y: 30, width: 116, height: 24, rx: 8 }, 'red'),
    s('path', { d: grid(32, 64, 5, 3, 14, 14, 20, 22) }, 'gray'),
    s('circle', { cx: 99, cy: 93, r: 13 }, 'orange', { accent: true }),
    s('path', { d: 'M50 22v16M110 22v16', ...SW(5) }, 'dark', { stroke: true })
  ],
  ora: [
    s('circle', { cx: 46, cy: 56, r: 20 }, 'yellow', { accent: true }),
    s('path', { d: rays(46, 56, 26, 34, 8), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: ells([[108, 96, 22, 14], [124, 90, 16, 12], [96, 92, 14, 10]]) }, 'gray'),
    s('path', { d: 'M100 116l-4 10M114 116l-4 10M128 116l-4 10', ...SW(3) }, 'blue', { stroke: true }),
    arrow('M78 38q36-6 40 28', 'navy', 4),
    arrow('M78 124q-36 6-38-30', 'navy', 4)
  ],
  orador: [
    s('path', { d: 'M50 136l6-50h48l6 50z' }, 'brown', { accent: true }),
    ...person(80, 84, 'navy', { h: 30 }),
    s('path', { d: 'M96 80l-14-14', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 82, cy: 64, r: 4 }, 'dark'),
    s('path', { d: 'M100 52q30-20 24-40', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M126 46q8 8 0 16M134 40q12 14 0 28', ...SW(3) }, 'orange', { stroke: true })
  ],
  ostentar: [
    ground(),
    ...person(80, 136, 'purple'),
    s('path', { d: 'M66 80l4-14 10 8 10-8 4 14z' }, 'yellow', { accent: true }),
    s('path', { d: 'M68 94q12 18 24 0', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: sparkle(40, 50, 10) + sparkle(122, 44, 12) + sparkle(124, 96, 8) }, 'orange'),
    s('path', { d: 'M66 104l-20-24', ...SW(7) }, 'skin', { stroke: true })
  ],
  perseverancia: [
    s('path', { d: 'M14 140L146 40v100z' }, 'green'),
    s('path', { d: 'M126 54V20', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M128 20h16l-5 7 5 7h-16z' }, 'red'),
    s('circle', { cx: 92, cy: 70, r: 15 }, 'gray', { accent: true }),
    ...lean(66, 112, 50, 'blue', { h: 30, w: 22, r: 9 }),
    s('path', { d: drop(48, 74, 4) }, 'sky')
  ],
  perverso: [
    s('path', { d: 'M40 52l-8-34 26 22zM120 52l8-34-26 22z' }, 'red'),
    s('circle', { cx: 80, cy: 86, r: 48 }, 'purple', { accent: true }),
    s('path', { d: 'M52 72l22 10M108 72l-22 10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[64, 86], [96, 86]], 5) }, 'yellow'),
    s('path', { d: 'M54 104q26 24 52 0', ...SW(5) }, 'dark', { stroke: true })
  ],
  plenitud: [
    backdrop('navy'),
    s('circle', { cx: 80, cy: 80, r: 44 }, 'yellow', { accent: true }),
    s('path', { d: dots([[66, 64], [96, 92]], 7) + dots([[90, 62]], 4) }, 'orange'),
    s('path', { d: sparkle(30, 32, 6) + sparkle(130, 128, 7) + sparkle(130, 30, 5) }, 'white')
  ],
  pontificio: [
    backdrop('mint'),
    s('path', { d: 'M48 118V60q16-30 32-46q16 16 32 46v58z' }, 'white'),
    s('path', { d: 'M48 118V60q16-30 32-46q16 16 32 46v58z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 102h64M80 24v94', ...SW(7) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M80 44v32M68 56h24', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M62 118l-6 22M98 118l6 22', ...SW(6) }, 'red', { stroke: true })
  ],
  'precipitación': [
    s('path', { d: ells([[80, 54, 40, 22], [52, 60, 22, 16], [110, 60, 22, 16], [72, 38, 22, 18]]) }, 'gray', { accent: true }),
    s('path', { d: 'M44 92l-6 16M68 92l-6 16M92 92l-6 16M116 92l-6 16M56 118l-6 16M104 118l-6 16', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M80 116v20M71 121l18 10M71 131l18-10', ...SW(3) }, 'sky', { stroke: true })
  ],
  predicador: [
    s('path', { d: 'M40 136V96h80v40z' }, 'brown'),
    s('path', { d: 'M32 96h96l-8-10H40z' }, 'tan'),
    s('rect', { x: 64, y: 54, width: 32, height: 34, rx: 10 }, 'dark'),
    s('circle', { cx: 80, cy: 40, r: 12 }, 'skin'),
    s('path', { d: 'M96 62l16-22', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 36l14-8 14 8-14 6z' }, 'red', { accent: true }),
    s('path', { d: 'M76 102h8M80 98v14', ...SW(3) }, 'yellow', { stroke: true })
  ],
  predominantemente: [
    s('circle', { cx: 80, cy: 80, r: 58 }, 'gray'),
    s('path', { d: wedge(80, 80, 58, -90, 200) }, 'blue', { accent: true }),
    s('path', { d: wedge(80, 80, 58, 200, 240) }, 'orange'),
    s('path', { d: ring(80, 80, 58), ...SW(4) }, 'white', { stroke: true })
  ],
  prefecto: [
    ground(),
    s('rect', { x: 63, y: 92, width: 34, height: 44, rx: 10 }, 'navy'),
    s('circle', { cx: 80, cy: 76, r: 13 }, 'skin'),
    s('path', { d: 'M64 66h32l-4-10H68z' }, 'navy'),
    s('path', { d: 'M66 94l28 36', ...SW(7) }, 'red', { stroke: true, accent: true }),
    s('path', { d: star(88, 106, 7) }, 'yellow'),
    s('rect', { x: 110, y: 104, width: 32, height: 32, rx: 2 }, 'brown')
  ],
  preferentemente: [
    s('path', { d: dots([[36, 110], [124, 110]], 18) }, 'gray'),
    s('circle', { cx: 80, cy: 110, r: 22 }, 'red', { accent: true }),
    s('path', { d: star(80, 108, 10) }, 'yellow'),
    s('path', { d: 'M80 76V30M66 44l14-14 14 14', ...SW(6) }, 'green', { stroke: true })
  ],
  progresar: [
    s('path', { d: 'M24 24v112h112', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[36, 104, 18, 32], [62, 88, 18, 48], [88, 68, 18, 68], [114, 46, 18, 90]]) }, 'blue'),
    arrow('M34 92l30-20 24 6 42-48M114 28h16v16', 'green', 6),
    s('circle', { cx: 130, cy: 30, r: 3 }, 'green', { accent: true })
  ],
  puma: [
    ground(),
    s('path', { d: 'M40 104v32M56 106v30M100 106v30M114 104v32', ...SW(8) }, 'tan', { stroke: true }),
    s('path', { d: 'M30 96q-18 4-14-24', ...SW(6) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 78, cy: 96, rx: 46, ry: 18 }, 'tan', { accent: true }),
    s('path', { d: 'M108 74q4-20 22-18q14 4 12 20q-2 12-16 14q-16 0-18-16z' }, 'tan'),
    s('path', { d: 'M114 60l2-10 8 8zM132 58l6-8 2 12z' }, 'brown'),
    s('path', { d: 'M136 80l6 2-4 4zM126 70h0', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 128, cy: 70, r: 3 }, 'dark')
  ],
  regidor: [
    ground(),
    s('rect', { x: 26, y: 66, width: 108, height: 70 }, 'cream'),
    s('path', { d: 'M20 68l60-34 60 34z' }, 'navy', { accent: true }),
    s('path', { d: 'M40 76v54M60 76v54M100 76v54M120 76v54', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 92, r: 8 }, 'skin'),
    s('path', { d: busts([80], 130, 24, 30) }, 'red'),
    s('circle', { cx: 80, cy: 54, r: 6 }, 'yellow')
  ],
  rotura: [
    s('path', { d: 'M18 98l50-24 6 10-50 24zM142 98l-50-24-6 10 50 24z' }, 'brown', { accent: true }),
    s('path', { d: 'M68 74l4 4-4 4 6 4M92 74l-4 4 4 4-6 4', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: burst(80, 70, 22, 10, 9) }, 'yellow'),
    s('path', { d: 'M80 40v-14M58 50l-10-10M102 50l10-10', ...SW(4) }, 'orange', { stroke: true })
  ],
  'salmón': [
    s('path', { d: 'M14 120q22-12 44 0t44 0t44 0v20H14z' }, 'blue'),
    s('path', { d: 'M30 96q30-50 86-40q14 4 20 14q-6 10-20 14q-56 10-86 12z', transform: 'rotate(-14 80 80)' }, 'pink', { accent: true }),
    s('path', { d: 'M34 94l-18-20 2 30z', transform: 'rotate(-14 80 80)' }, 'red'),
    s('path', { d: 'M60 72q20-8 40-6', ...SW(3), transform: 'rotate(-14 80 80)' }, 'white', { stroke: true }),
    s('circle', { cx: 118, cy: 60, r: 4 }, 'dark'),
    s('path', { d: drop(40, 118, 4) + drop(126, 112, 4) }, 'sky')
  ],
  saltillo: [
    s('path', { d: 'M14 30h50v30H14z' }, 'gray'),
    s('path', { d: 'M96 76h50v60H96z' }, 'gray'),
    s('path', { d: 'M14 30q60-2 70 20t12 70', ...SW(14) }, 'sky', { stroke: true, accent: true }),
    s('path', { d: 'M60 136q36-24 86-4', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: ells([[100, 124, 28, 8]]) }, 'blue'),
    s('path', { d: dots([[76, 120], [118, 108], [86, 108]], 4) }, 'white')
  ],
  'sintonía': [
    s('rect', { x: 20, y: 58, width: 120, height: 78, rx: 10 }, 'orange', { accent: true }),
    s('path', { d: 'M40 58l60-34', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 52, cy: 96, r: 22 }, 'dark'),
    s('rect', { x: 86, y: 74, width: 42, height: 20, rx: 3 }, 'cream'),
    s('path', { d: 'M92 84h30M108 74v20', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: dots([[96, 114], [118, 114]], 6) }, 'dark'),
    s('path', { d: 'M112 28q8 6 0 14M122 22q14 12 0 26', ...SW(3) }, 'blue', { stroke: true })
  ],
  sonriente: [
    ...face(80, 80, 56, 'yellow', 'smile', { accent: true }),
    s('path', { d: 'M52 102q28 30 56 0z' }, 'white'),
    s('path', { d: dots([[46, 92], [114, 92]], 7) }, 'pink')
  ],
  subrayar: [
    ...paper(20, 24, 120, 96),
    s('path', { d: 'M34 44h92M34 64h60M34 84h92M34 104h50', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 74h60', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M96 74l34 50 8-4-36-52z' }, 'yellow'),
    s('path', { d: 'M94 72l2 6 6-4z' }, 'dark')
  ],
  suciedad: [
    s('path', { d: 'M48 26l-34 22 12 22 14-6v72h80V64l14 6 12-22-34-22q-12 14-32 14t-32-14z' }, 'white'),
    s('path', { d: 'M48 26l-34 22 12 22 14-6v72h80V64l14 6 12-22-34-22q-12 14-32 14t-32-14z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[64, 78, 12, 8], [96, 106, 16, 10], [104, 64, 7, 5], [60, 116, 6, 5]]) }, 'brown', { accent: true }),
    s('path', { d: 'M124 22q6-6 10 0M136 34q6-6 10 0', ...SW(2.5) }, 'dark', { stroke: true })
  ],
  'sultán': [
    s('rect', { x: 34, y: 104, width: 92, height: 26, rx: 12 }, 'red'),
    s('path', { d: 'M46 106q-6-48 34-52q40 4 34 52z' }, 'white'),
    s('path', { d: 'M46 106q-6-48 34-52q40 4 34 52z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 84q28 10 56 0M50 96q30 10 60 0', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: drop(80, 74, 9) }, 'green', { accent: true }),
    s('path', { d: 'M80 58q-4-22 10-36', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: dots([[34, 130], [126, 130]], 6) }, 'yellow')
  ],
  superintendencia: [
    ground(),
    s('rect', { x: 24, y: 72, width: 72, height: 64 }, 'gray'),
    s('path', { d: grid(32, 80, 3, 3, 14, 12, 20, 18) }, 'sky'),
    s('path', { d: 'M18 74l42-24 42 24z' }, 'navy'),
    s('path', { d: 'M90 50q24-30 48 0q-24 30-48 0z' }, 'white'),
    s('path', { d: 'M90 50q24-30 48 0q-24 30-48 0z', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 114, cy: 50, r: 9 }, 'blue', { accent: true })
  ],
  tarado: [
    s('circle', { cx: 80, cy: 82, r: 52 }, 'skin', { accent: true }),
    s('path', { d: spiral(56, 72) + spiral(98, 72), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 108q8-6 14 0t14 0t14 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: star(40, 30, 9) + star(118, 24, 8) }, 'yellow'),
    s('path', { d: 'M100 112q4 12 2 16', ...SW(4) }, 'sky', { stroke: true })
  ],
  'torreón': [
    ground(),
    s('rect', { x: 50, y: 50, width: 60, height: 86 }, 'gray', { accent: true }),
    s('path', { d: 'M44 34h14v12h10V34h10v12h10V34h10v12h10V34h8v20H44z' }, 'gray'),
    s('path', { d: 'M68 136v-24a12 12 0 0 1 24 0v24z' }, 'dark'),
    s('path', { d: rects([[74, 66, 12, 20]]) }, 'dark'),
    s('path', { d: 'M80 34V14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 14h18l-5 6 5 6H82z' }, 'red')
  ],
  traficante: [
    backdrop('navy'),
    s('circle', { cx: 62, cy: 62, r: 14 }, 'skin'),
    s('path', { d: 'M50 54q0-16 12-16t12 16z' }, 'dark'),
    s('path', { d: 'M40 54h44', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 140V96q0-18 18-18t18 18v44z' }, 'dark'),
    s('rect', { x: 84, y: 100, width: 50, height: 34, rx: 4 }, 'brown', { accent: true }),
    s('path', { d: 'M100 100v-8h18v8', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M56 64h12', ...SW(4) }, 'black', { stroke: true })
  ],
  veto: [
    ...paper(28, 30, 72, 92),
    s('path', { d: 'M40 48h48M40 62h48M40 76h30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: ring(96, 100, 30), ...SW(10) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M75 79l42 42', ...SW(10) }, 'red', { stroke: true })
  ],
  voluntariado: [
    s('path', { d: 'M14 120q20-10 40-8l26 6 26-6q20-2 40 8v20H14z' }, 'skin'),
    s('path', { d: 'M14 128q20-8 40-6M146 128q-20-8-40-6', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: heart(80, 76, 32) }, 'red', { accent: true }),
    s('path', { d: 'M58 58q6-8 14-6', ...SW(5) }, 'white', { stroke: true })
  ],
  abasto: [
    s('path', { d: 'M24 30h112l-8 22H32z' }, 'red', { accent: true }),
    s('path', { d: 'M24 52v84M136 52v84', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: rects([[30, 110, 46, 26], [84, 110, 46, 26]]) }, 'tan'),
    s('path', { d: dots([[40, 104], [54, 104], [68, 104]], 8) }, 'red'),
    s('path', { d: dots([[94, 104], [108, 104], [122, 104]], 8) }, 'orange'),
    s('path', { d: dots([[60, 80], [80, 80], [100, 80]], 9) }, 'green')
  ],
  abstener: [
    s('rect', { x: 34, y: 72, width: 64, height: 64, rx: 4 }, 'blue'),
    s('path', { d: 'M50 80h32', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 52, y: 44, width: 28, height: 34, rx: 2 }, 'white'),
    outline({ x: 52, y: 44, width: 28, height: 34, rx: 2 }),
    s('circle', { cx: 120, cy: 88, r: 22 }, 'white'),
    s('path', { d: ring(120, 88, 22) + 'M104 104l32-32', ...SW(6) }, 'red', { stroke: true, accent: true })
  ],
  acreditar: [
    s('path', { d: 'M56 14l24 46 24-46', ...SW(6) }, 'blue', { stroke: true }),
    s('rect', { x: 40, y: 56, width: 80, height: 88, rx: 8 }, 'white'),
    outline({ x: 40, y: 56, width: 80, height: 88, rx: 8 }),
    s('rect', { x: 68, y: 52, width: 24, height: 10, rx: 3 }, 'gray'),
    s('circle', { cx: 80, cy: 88, r: 14 }, 'skin'),
    s('path', { d: 'M54 128q0-18 26-18t26 18z' }, 'navy'),
    s('circle', { cx: 108, cy: 128, r: 10 }, 'green', { accent: true }),
    s('path', { d: 'M103 128l4 4 6-8', ...SW(3) }, 'white', { stroke: true })
  ],
  adelgazar: [
    s('path', { d: 'M58 20h44l-6 54 8 66H56l8-66z' }, 'skin'),
    s('path', { d: 'M54 76h52l2 64H52z' }, 'blue'),
    s('path', { d: 'M40 70q40 16 80 0', ...SW(7) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M48 70l2 6M60 74l1 6M72 76v6M88 76v6M100 74l-1 6', ...SW(2) }, 'dark', { stroke: true }),
    arrow('M30 100h16M130 100h-16', 'green', 4)
  ],
  'adónde': [
    ground(),
    s('path', { d: 'M80 136V24', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M84 30h46l12 10-12 10H84z' }, 'green', { accent: true }),
    s('path', { d: 'M76 58H30l-12 10 12 10h46z' }, 'blue'),
    s('path', { d: 'M84 86h40l10 10-10 10H84z' }, 'orange'),
    s('circle', { cx: 80, cy: 22, r: 5 }, 'dark')
  ],
  'alcázar': [
    ground(),
    s('rect', { x: 18, y: 72, width: 124, height: 64 }, 'tan', { accent: true }),
    s('path', { d: 'M18 62h12v10H18zM38 62h12v10H38zM58 62h12v10H58zM90 62h12v10H90zM110 62h12v10h-12zM130 62h12v10h-12z' }, 'tan'),
    s('rect', { x: 66, y: 40, width: 28, height: 40 }, 'orange'),
    s('path', { d: 'M66 40h28l-14-16z' }, 'red'),
    s('path', { d: 'M64 136v-28q16-24 32 0v28z' }, 'brown'),
    s('path', { d: 'M30 100q6-10 12 0v12H30zM118 100q6-10 12 0v12h-12z' }, 'dark')
  ],
  allanamiento: [
    s('rect', { x: 30, y: 24, width: 70, height: 112 }, 'gray'),
    s('rect', { x: 64, y: 34, width: 56, height: 102, transform: 'skewY(-12) translate(0 16)' }, 'brown', { accent: true }),
    s('circle', { cx: 110, cy: 92, r: 4 }, 'yellow'),
    s('path', { d: burst(52, 80, 26, 12, 9) }, 'orange'),
    s('path', { d: 'M18 46l14 10M16 100l16-4M40 136l6-14', ...SW(4) }, 'red', { stroke: true })
  ],
  'arquitectónico': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 8 }, 'blue'),
    s('path', { d: 'M40 44h80l-40-20z' }, 'white'),
    s('path', { d: 'M44 48h72v8H44zM40 120h80v10H40z' }, 'white'),
    s('path', { d: 'M54 58v60M72 58v60M88 58v60M106 58v60', ...SW(8) }, 'white', { stroke: true, accent: true }),
    s('path', { d: 'M24 24h112M24 136h112', ...DASH(2, '4 4') }, 'sky', { stroke: true })
  ],
  'autonómico': [
    s('path', { d: 'M26 46l30-20 40 6 34 22-6 40-30 34-40 0-30-28z' }, 'mint'),
    s('path', { d: 'M96 32l34 22-6 40-30 6-12-30z' }, 'orange', { accent: true }),
    s('path', { d: 'M26 46l30-20 40 6 34 22-6 40-30 34-40 0-30-28zM96 32l-14 38 12 30M54 128l10-40 18-18M24 80l40 8', ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 108, cy: 66, r: 6 }, 'red')
  ],
  barbacoa: [
    s('path', { d: 'M54 100l-14 36M106 100l14 36M80 104v32', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 76h104q0 30-52 30T28 76z' }, 'red', { accent: true }),
    s('path', { d: 'M28 74h104', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 66h36M88 66h30', ...SW(10) }, 'brown', { stroke: true }),
    s('path', { d: 'M60 52q-8-10 0-20M80 50q-8-12 0-24M100 52q-8-10 0-20', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 66h6M102 66h6', ...SW(3) }, 'tan', { stroke: true })
  ],
  'basílica': [
    ground(),
    s('rect', { x: 20, y: 80, width: 120, height: 56 }, 'cream'),
    s('path', { d: 'M44 80a36 36 0 0 1 72 0z' }, 'sky', { accent: true }),
    s('path', { d: 'M80 44V22M72 30h16', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M68 136v-24a12 12 0 0 1 24 0v24z' }, 'brown'),
    s('path', { d: 'M32 96v28M48 96v28M112 96v28M128 96v28', ...SW(6) }, 'tan', { stroke: true }),
    s('path', { d: 'M14 82h132', ...SW(4) }, 'tan', { stroke: true })
  ],
  'brujería': [
    s('path', { d: 'M40 136q-10-50 40-50t40 50z' }, 'dark'),
    s('path', { d: 'M30 92h100', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: ells([[80, 88, 46, 8]]) }, 'green', { accent: true }),
    s('path', { d: dots([[64, 72], [88, 62], [104, 76], [74, 50]], 6) }, 'mint'),
    s('path', { d: 'M96 42l12-28 14 26z' }, 'purple'),
    s('path', { d: 'M90 42h38', ...SW(5) }, 'purple', { stroke: true }),
    s('path', { d: sparkle(40, 40, 10) }, 'yellow')
  ],
  bu: [
    s('path', { d: 'M40 136V70a40 40 0 0 1 80 0v66l-14-12-12 12-14-12-12 12-14-12z' }, 'white'),
    s('path', { d: 'M40 136V70a40 40 0 0 1 80 0v66l-14-12-12 12-14-12-12 12-14-12z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[66, 66, 6, 9], [94, 66, 6, 9]]) }, 'dark'),
    s('ellipse', { cx: 80, cy: 94, rx: 10, ry: 12 }, 'dark', { accent: true }),
    s('path', { d: 'M24 52l-8-6M22 72H12M128 40l10-8M136 62h12', ...SW(4) }, 'orange', { stroke: true })
  ],
  cana: [
    s('path', { d: 'M40 136q0-30 40-30t40 30z' }, 'blue'),
    s('circle', { cx: 80, cy: 72, r: 32 }, 'skin'),
    s('path', { d: 'M46 74q-6-40 34-42q40 2 34 42q-6-20-34-22q-28 2-34 22z' }, 'brown'),
    s('path', { d: 'M72 34q12 0 10 22', ...SW(6) }, 'white', { stroke: true, accent: true }),
    s('path', { d: dots([[68, 78], [92, 78]], 3) }, 'dark'),
    s('path', { d: 'M72 92q8 6 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  capacitar: [
    s('rect', { x: 18, y: 22, width: 84, height: 56, rx: 4 }, 'green'),
    s('path', { d: 'M28 62l16-16 14 10 24-22', ...SW(4) }, 'white', { stroke: true }),
    ...person(118, 136, 'orange', { accent: true }),
    s('path', { d: 'M104 98L86 66', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: busts([36, 66], 136, 26, 30) }, 'blue'),
    s('path', { d: dots([[36, 100], [66, 100]], 11) }, 'skin')
  ],
  causante: [
    ground(),
    s('rect', { x: 34, y: 82, width: 14, height: 54, transform: 'rotate(30 48 136)' }, 'red', { accent: true }),
    s('rect', { x: 64, y: 82, width: 14, height: 54, transform: 'rotate(14 78 136)' }, 'navy'),
    s('path', { d: rects([[92, 82, 14, 54], [120, 82, 14, 54]]) }, 'navy'),
    s('path', { d: 'M14 70h18', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M40 56q6-6 12 0', ...SW(3) }, 'orange', { stroke: true })
  ],
  colesterol: [
    s('path', { d: 'M14 40h132v80H14z' }, 'red'),
    s('path', { d: 'M14 56h132v48H14z' }, 'pink'),
    s('path', { d: 'M50 56q30 30 60 0zM60 104q24-22 50 0z' }, 'yellow', { accent: true }),
    s('path', { d: ells([[30, 80, 8, 6], [128, 82, 8, 6]]) }, 'red'),
    s('path', { d: 'M14 40h132M14 120h132', ...SW(4) }, 'brown', { stroke: true })
  ],
  'comprobación': [
    ...paper(24, 22, 84, 112),
    s('path', { d: 'M34 42l6 6 10-12M34 72l6 6 10-12M34 102l6 6 10-12', ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M58 42h38M58 72h38M58 102h30', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 112, cy: 96, r: 18 }, 'sky'),
    s('path', { d: ring(112, 96, 18) + 'M125 109l16 16', ...SW(6) }, 'dark', { stroke: true })
  ],
  consecuentemente: [
    ground(),
    s('path', { d: 'M20 136a12 12 0 0 1 24 0z' }, 'brown'),
    s('ellipse', { cx: 32, cy: 118, rx: 6, ry: 9 }, 'tan'),
    arrow('M54 112h40M84 102l10 10-10 10', 'orange', 5),
    s('path', { d: 'M124 136V70', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(124, 96, -150, 26, 9) + leaflet(124, 84, -30, 26, 9) + leaflet(124, 70, -90, 22, 8) }, 'green', { accent: true }),
    s('circle', { cx: 124, cy: 40, r: 10 }, 'red')
  ],
  contradecir: [
    s('path', { d: bubble(14, 30, 60, 50) }, 'blue', { accent: true }),
    s('path', { d: 'M146 38a8 8 0 0 0-8-8H94a8 8 0 0 0-8 8v34a8 8 0 0 0 8 8h22l12 12V80h10a8 8 0 0 0 8-8z' }, 'red'),
    s('path', { d: 'M80 22l-8 22h10l-8 22', ...SW(4) }, 'yellow', { stroke: true }),
    ...person(40, 140, 'blue', { h: 30, w: 24, r: 10 }),
    ...person(120, 140, 'red', { h: 30, w: 24, r: 10 })
  ],
  cuidadoso: [
    s('path', { d: 'M24 108q10 24 56 28q46-4 56-28q-8-6-20 0q-12 10-36 12q-24-2-36-12q-12-6-20 0z' }, 'skin'),
    s('ellipse', { cx: 80, cy: 86, rx: 20, ry: 26 }, 'cream', { accent: true }),
    s('path', { d: 'M80 86m-20 0a20 26 0 1 0 40 0a20 26 0 1 0-40 0', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: heart(80, 40, 10) }, 'pink'),
    s('path', { d: 'M40 100q-6-10 2-16M120 100q6-10-2-16', ...SW(3) }, 'tan', { stroke: true })
  ],
  decepcionante: [
    s('path', { d: 'M30 90h70v46H30z' }, 'red'),
    s('path', { d: 'M30 90h70v12H30z' }, 'dark'),
    s('path', { d: 'M22 86l78-24 6 12-80 22z' }, 'red', { accent: true }),
    s('path', { d: 'M64 90v46', ...SW(6) }, 'yellow', { stroke: true }),
    ...face(122, 50, 22, 'yellow', 'frown'),
    s('path', { d: drop(110, 84, 4) }, 'sky')
  ],
  'demográfico': [
    s('path', { d: 'M20 136h120', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[30, 100, 22, 36], [62, 78, 22, 58], [94, 58, 22, 78]]) }, 'sky'),
    s('path', { d: dots([[41, 88], [73, 66], [105, 46]], 8) }, 'skin'),
    s('path', { d: busts([41, 73, 105], 100, 18, 12) }, 'blue', { accent: true }),
    s('path', { d: busts([126], 136, 14, 30) + dots([[126, 98]], 6) }, 'orange')
  ],
  derrumbe: [
    ground(),
    s('path', { d: 'M24 136V52h38l6 20-8 64z' }, 'gray'),
    s('path', { d: 'M74 136l10-50 24 4 10 46z' }, 'tan', { accent: true }),
    s('path', { d: rects([[100, 42, 20, 16], [118, 66, 16, 14], [88, 60, 14, 12]]) }, 'brown'),
    s('path', { d: ells([[56, 130, 26, 10], [124, 132, 20, 8]]) }, 'tan'),
    s('path', { d: 'M108 30l4-8M128 54l8-6M80 46l-6-8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: grid(32, 62, 2, 3, 8, 10, 16, 18) }, 'dark')
  ],
  'desilusión': [
    ground(),
    ...person(52, 136, 'gray', { accent: true }),
    s('path', { d: 'M44 72q8-4 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 104l30 10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 114l14-14 4 18 14-8-6 16z' }, 'red'),
    s('path', { d: 'M110 50l6 8M128 46l-2 10M138 64l-8 2', ...SW(3) }, 'red', { stroke: true })
  ],
  despejar: [
    backdrop('sky'),
    s('circle', { cx: 80, cy: 80, r: 26 }, 'yellow', { accent: true }),
    s('path', { d: rays(80, 80, 32, 42, 10), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: ells([[26, 60, 16, 10], [134, 104, 16, 10]]) }, 'white'),
    arrow('M44 52l-24-14M116 112l22 10', 'blue', 4)
  ],
  disputar: [
    ground(),
    ...lean(30, 136, -20, 'blue'),
    ...lean(130, 136, 20, 'red'),
    s('path', { d: 'M56 98h16M88 98h16', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M68 76h24v10q0 14-12 14t-12-14z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 100v14M70 116h20', ...SW(5) }, 'yellow', { stroke: true })
  ],
  dotar: [
    ground(),
    ...person(40, 136, 'navy'),
    ...person(122, 136, 'green'),
    s('rect', { x: 64, y: 88, width: 34, height: 26, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M72 88v-6h18v6M64 100h34', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 104h10M98 104h10', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(80, 60, 10) }, 'yellow')
  ],
  duradero: [
    s('rect', { x: 34, y: 40, width: 80, height: 80, rx: 10 }, 'dark'),
    s('rect', { x: 114, y: 64, width: 12, height: 32, rx: 3 }, 'dark'),
    s('path', { d: rects([[42, 48, 16, 64], [62, 48, 16, 64], [82, 48, 16, 64]]) }, 'green', { accent: true }),
    s('path', { d: 'M102 48h4v64h-4z' }, 'green'),
    s('path', { d: 'M62 136h36M80 128v12', ...SW(4) }, 'gray', { stroke: true })
  ],
  eludir: [
    ground(),
    ...lean(80, 136, -28, 'orange', { accent: true }),
    s('circle', { cx: 112, cy: 60, r: 12 }, 'red'),
    s('path', { d: 'M144 56h-16M146 68h-14', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M76 98l-24-14', ...SW(6) }, 'skin', { stroke: true })
  ],
  envase: [
    ground(),
    s('path', { d: 'M28 136v-56q0-12 8-16V46h12v18q8 4 8 16v56z' }, 'green', { accent: true }),
    s('rect', { x: 64, y: 84, width: 30, height: 52, rx: 6 }, 'gray'),
    s('rect', { x: 64, y: 98, width: 30, height: 22 }, 'red'),
    s('path', { d: 'M104 70l12-14h18v80h-30z' }, 'white'),
    s('path', { d: 'M104 70l12-14h18v80h-30zM104 70h30', ...SW(3) }, 'blue', { stroke: true }),
    s('rect', { x: 36, y: 40, width: 16, height: 8, rx: 2 }, 'dark')
  ],
  envejecimiento: [
    ...person(30, 136, 'blue', { h: 26, w: 20, r: 9 }),
    ...person(80, 136, 'green', { h: 44, w: 26, r: 12 }),
    ...person(130, 136, 'purple', { h: 40, w: 26, r: 12, accent: true }),
    s('path', { d: 'M118 78q12-14 24 0', ...SW(5) }, 'white', { stroke: true, lineColor: 'gray' }),
    s('path', { d: 'M146 98v38', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M68 60q12-12 24 0', ...SW(5) }, 'brown', { stroke: true })
  ],
  'escocés': [
    s('rect', { x: 22, y: 22, width: 116, height: 116, rx: 6 }, 'green', { accent: true }),
    s('path', { d: 'M22 50h116M22 98h116M50 22v116M98 22v116', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'navy', { stroke: true }),
    s('path', { d: 'M22 74h116M74 22v116', ...SW(4, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true }),
    s('path', { d: 'M22 120h116M120 22v116', ...SW(2, { 'stroke-linecap': 'butt' }) }, 'yellow', { stroke: true })
  ],
  espartar: [
    s('path', { d: 'M30 82h100l-12 54H42z' }, 'tan', { accent: true }),
    s('path', { d: 'M34 96h92M38 110h84M42 124h76M50 82l6 54M70 82l2 54M90 82l-2 54M110 82l-6 54', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 82q-6-40-16-56M54 82q0-36 10-60M72 82q4-34 0-56M92 82q8-32 22-52M110 82q12-30 26-40', ...SW(4) }, 'green', { stroke: true })
  ],
  estimar: [
    s('path', { d: 'M86 52h44v80q0 6-6 6H92q-6 0-6-6z' }, 'sky'),
    s('path', { d: dots([[96, 126], [108, 126], [120, 126], [102, 114], [114, 114], [96, 102], [120, 102], [108, 92]], 5) }, 'red', { accent: true }),
    s('rect', { x: 84, y: 42, width: 48, height: 12, rx: 3 }, 'gray'),
    ...face(42, 72, 26, 'skin', 'flat'),
    s('path', { d: 'M32 102q-4 20 6 36', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: ells([[56, 30, 10, 8], [72, 20, 6, 5]]) }, 'gray')
  ],
  estufa: [
    s('rect', { x: 36, y: 50, width: 88, height: 80, rx: 10 }, 'gray'),
    s('rect', { x: 50, y: 64, width: 60, height: 44, rx: 6 }, 'dark'),
    s('path', { d: 'M80 106q-20-6-14-24q4 6 8 6q-2-14 10-22q0 12 10 18q6 14-14 22z' }, 'orange', { accent: true }),
    s('path', { d: 'M46 130v8M114 130v8', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 40q-8-8 0-16M80 40q-8-8 0-16M104 40q-8-8 0-16', ...SW(4) }, 'red', { stroke: true })
  ],
  fabuloso: [
    s('path', { d: 'M40 136q0-36 20-56q-6-14 4-26l30-12q22 4 30 20l-12 8q4 20-10 26l-4 40z' }, 'white'),
    s('path', { d: 'M40 136q0-36 20-56q-6-14 4-26l30-12q22 4 30 20l-12 8q4 20-10 26l-4 40z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M92 42l22-28-6 34z' }, 'yellow', { accent: true }),
    s('path', { d: 'M64 54q-24 10-26 40M72 50q-20 22-16 46', ...SW(6) }, 'purple', { stroke: true }),
    s('circle', { cx: 100, cy: 54, r: 4 }, 'dark'),
    s('path', { d: sparkle(130, 100, 10) + sparkle(28, 36, 8) }, 'pink')
  ],
  fenomenal: [
    backdrop('navy'),
    s('path', { d: rays(56, 62, 8, 32, 12), ...SW(4) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: rays(110, 92, 6, 26, 10), ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: dots([[56, 62], [110, 92]], 5) }, 'white'),
    s('path', { d: 'M40 140q10-40 16-50M100 140q4-20 10-22', ...DASH(3, '3 5') }, 'orange', { stroke: true }),
    s('path', { d: sparkle(124, 36, 7) + sparkle(36, 116, 6) }, 'white')
  ],
  garrido: [
    ground(),
    s('circle', { cx: 80, cy: 50, r: 14 }, 'skin'),
    s('path', { d: 'M66 46q0-18 14-18t14 18q-4-8-14-8t-14 8z' }, 'dark'),
    s('path', { d: 'M62 68h36l-6 68H68z' }, 'blue', { accent: true }),
    s('path', { d: 'M62 74l-20 10 4-26M98 74l20 10-4-26', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(28, 40, 9) + sparkle(130, 34, 8) }, 'yellow')
  ],
  guardaespaldas: [
    ground(),
    ...person(54, 136, 'black', { h: 60, w: 38, r: 14, accent: true }),
    s('path', { d: 'M44 58h22', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 78l-5 10 5 30 5-30z' }, 'white'),
    s('path', { d: 'M68 64q8 2 6 10', ...SW(2) }, 'gray', { stroke: true }),
    ...person(118, 136, 'pink', { h: 38, w: 24, r: 11 }),
    s('path', { d: 'M108 76l10-8 10 8z' }, 'yellow')
  ],
  incompleto: [
    s('path', { d: rects([[30, 30, 48, 48], [82, 82, 48, 48]]) }, 'blue'),
    s('rect', { x: 30, y: 82, width: 48, height: 48 }, 'orange'),
    s('rect', { x: 82, y: 30, width: 48, height: 48, ...DASH(4, '6 6') }, 'gray', { stroke: true }),
    s('path', { d: dots([[80, 54], [54, 80], [106, 80], [80, 106]], 9) }, 'green', { accent: true })
  ],
  'inflamación': [
    s('path', { d: 'M52 140V60q0-16 14-16t14 16v80z' }, 'skin'),
    s('ellipse', { cx: 66, cy: 92, rx: 24, ry: 20 }, 'red', { accent: true }),
    s('path', { d: 'M54 56q12-6 24 0', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M104 72q8-8 0-16t0-16M120 80q8-8 0-16t0-16', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M56 84l8 8M76 84l-8 8', ...SW(3) }, 'pink', { stroke: true })
  ],
  inherente: [
    s('path', { d: 'M80 18q-30 0-36 46q-14 30-6 50q10 26 42 26t42-26q8-20-6-50q-6-46-36-46z' }, 'green'),
    s('path', { d: 'M80 28q-22 0-28 40q-12 28-4 44q8 18 32 18t32-18q8-16-4-44q-6-40-28-40z' }, 'cream'),
    s('circle', { cx: 80, cy: 98, r: 22 }, 'brown', { accent: true }),
    s('path', { d: 'M72 90q4-6 10-6', ...SW(3) }, 'tan', { stroke: true })
  ],
  inmaculado: [
    backdrop('sky'),
    s('path', { d: 'M48 26l-30 20 10 22 14-6v70h76V62l14 6 10-22-30-20q-12 14-32 14t-32-14z' }, 'white', { accent: true }),
    s('path', { d: 'M48 26l-30 20 10 22 14-6v70h76V62l14 6 10-22-30-20q-12 14-32 14t-32-14z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: sparkle(64, 80, 10) + sparkle(98, 104, 8) + sparkle(132, 132, 6) }, 'yellow')
  ],
  intacto: [
    s('path', { d: 'M62 30h36v10q-4 4-4 10q22 14 22 46q0 20-14 34H58q-14-14-14-34q0-32 22-46q0-6-4-10z' }, 'blue', { accent: true }),
    s('path', { d: 'M52 88q28 10 56 0', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M40 132h80', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 126, cy: 44, r: 16 }, 'green'),
    s('path', { d: 'M119 44l5 5 9-10', ...SW(4) }, 'white', { stroke: true })
  ],
  inventor: [
    ground(),
    ...person(56, 136, 'white', { accent: false }),
    s('rect', { x: 41, y: 92, width: 30, height: 44, rx: 10, ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 56, cy: 34, r: 14 }, 'yellow', { accent: true }),
    s('path', { d: 'M51 50h10', ...SW(4) }, 'gray', { stroke: true }),
    ...gear(118, 104, 14, 8, 'gray'),
    s('path', { d: rays(56, 34, 18, 24, 6, -90), ...SW(3) }, 'orange', { stroke: true })
  ],
  jaque: [
    s('path', { d: checker(14, 112, 8, 2, 16.5) }, 'gray'),
    s('path', { d: 'M38 112v-8h40v8zM44 104l6-42h16l6 42zM46 62h24v-8H46z' }, 'dark', { accent: true }),
    s('path', { d: 'M58 52V36M50 42h16', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 112v-8h36v8zM106 104l4-28h16l4 28zM104 76q14-26 28 0z' }, 'white'),
    s('path', { d: 'M100 112v-8h36v8zM106 104l4-28h16l4 28zM104 76q14-26 28 0z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 60L80 70', ...SW(4) }, 'red', { stroke: true })
  ],
  machete: [
    s('path', { d: 'M54 104L132 28q10 6 6 18L70 118z' }, 'gray', { accent: true }),
    s('path', { d: 'M70 118L140 46', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M54 104l16 14-28 28-16-14z' }, 'brown'),
    s('path', { d: dots([[40, 126], [48, 118]], 3) }, 'tan')
  ],
  malla: [
    s('path', { d: 'M24 30q56 16 112 0v100q-56-14-112 0z' }, 'mint'),
    s('path', { d: 'M24 30v100M52 34v94M80 36v90M108 34v94M136 30v100M24 54q56 14 112 0M24 78q56 14 112 0M24 102q56 14 112 0', ...SW(3) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: dots([[24, 30], [136, 30], [24, 130], [136, 130]], 5) }, 'orange')
  ],
  mentor: [
    ground(),
    ...person(52, 136, 'navy', { h: 54, w: 32, r: 13 }),
    s('path', { d: 'M40 58q12-12 24 0', ...SW(5) }, 'white', { stroke: true, lineColor: 'gray' }),
    ...person(104, 136, 'orange', { h: 36, w: 24, r: 11, accent: true }),
    s('path', { d: 'M66 90l30 2', ...SW(6) }, 'skin', { stroke: true }),
    arrow('M112 38h28M132 30l8 8-8 8', 'green', 4)
  ],
  morder: [
    s('path', { d: 'M80 44q-30-14-46 10q-16 30 6 64q16 22 40 12q24 10 40-12q8-12 10-24q-12 0-12-12q0-12 8-14q-4-10-10-14q-14 0-12-10q-10-6-24 0z' }, 'red', { accent: true }),
    s('path', { d: 'M80 44q0-16 10-24', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(84, 28, -30, 20, 6) }, 'green'),
    s('path', { d: 'M128 106q-12 0-12-12q0-12 8-14q-4-10-10-14q-14 0-12-10', ...SW(3) }, 'cream', { stroke: true })
  ],
  movilizar: [
    s('path', { d: dots([[30, 66], [58, 66], [86, 66], [44, 104], [72, 104], [100, 104]], 9) }, 'skin'),
    s('path', { d: busts([30, 58, 86], 96, 22, 22) }, 'green'),
    s('path', { d: busts([44, 72, 100], 134, 22, 22) }, 'blue', { accent: true }),
    arrow('M114 60h30M134 50l10 10-10 10', 'orange', 5),
    arrow('M122 98h22M134 88l10 10-10 10', 'orange', 5)
  ],
  'místico': [
    backdrop('navy'),
    s('circle', { cx: 80, cy: 72, r: 40 }, 'purple', { accent: true }),
    s('path', { d: sparkle(70, 62, 12) + sparkle(94, 86, 7) }, 'white'),
    s('path', { d: 'M48 118h64l-10 18H58z' }, 'yellow'),
    s('path', { d: dots([[30, 32], [130, 40], [134, 110], [26, 104]], 2.5) }, 'yellow')
  ],
  natalidad: [
    s('path', { d: 'M30 60q30-30 74-10l20-10 8 10-20 12q-30 30-64 22z' }, 'white'),
    s('path', { d: 'M30 60q30-30 74-10l20-10 8 10-20 12q-30 30-64 22z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M124 40l20 4-14 8z' }, 'orange'),
    s('path', { d: 'M78 76l-4 24M74 100q-26 0-24 18q2 16 24 16q22 0 24-16q0-18-24-18', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 100q-26 0-24 18q2 16 24 16q22 0 24-16q0-18-24-18z' }, 'pink', { accent: true }),
    s('circle', { cx: 74, cy: 116, r: 9 }, 'skin')
  ],
  neutro: [
    s('path', { d: 'M20 112a60 60 0 0 1 120 0z' }, 'gray'),
    s('path', { d: wedge(80, 112, 60, 180, 240) }, 'sky'),
    s('path', { d: wedge(80, 112, 60, 300, 360) }, 'pink'),
    s('path', { d: wedge(80, 112, 60, 240, 300) }, 'white'),
    s('path', { d: 'M80 112V58', ...SW(6) }, 'dark', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 112, r: 9 }, 'dark'),
    s('path', { d: 'M14 124h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  'normalización': [
    s('rect', { x: 18, y: 30, width: 22, height: 30, transform: 'rotate(-20 29 45)' }, 'red'),
    s('circle', { cx: 40, cy: 90, r: 14 }, 'orange'),
    s('path', { d: 'M20 132l14-26 14 26z' }, 'purple'),
    arrow('M62 80h26M80 70l10 10-10 10', 'gray', 5),
    s('path', { d: rects([[104, 26, 30, 30], [104, 66, 30, 30], [104, 106, 30, 30]]) }, 'blue', { accent: true })
  ],
  orar: [
    s('path', { d: 'M80 22q-14 8-16 40l-8 50h24z' }, 'skin', { accent: true }),
    s('path', { d: 'M80 22q14 8 16 40l8 50H80z' }, 'tan'),
    s('path', { d: 'M48 112h64v28H48z' }, 'blue'),
    s('path', { d: 'M80 26v86', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: rays(80, 56, 44, 56, 5, -150), ...SW(3) }, 'yellow', { stroke: true })
  ],
  pachuco: [
    ground(),
    s('path', { d: 'M58 66h44l6 46H52z' }, 'blue', { accent: true }),
    s('path', { d: 'M60 112h40l-6 24H66z' }, 'navy'),
    s('circle', { cx: 80, cy: 54, r: 11 }, 'skin'),
    s('path', { d: 'M56 46h48M66 46q0-16 14-16t14 16z' }, 'dark'),
    s('path', { d: 'M56 46h48', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M92 36l12-10', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M84 100q20 22 4 34', ...SW(3) }, 'yellow', { stroke: true })
  ],
  patriarcado: [
    ground(),
    ...person(80, 136, 'navy', { h: 60, w: 36, r: 15, accent: true }),
    s('path', { d: 'M70 46q10 10 20 0', ...SW(5) }, 'brown', { stroke: true }),
    ...person(30, 136, 'pink', { h: 30, w: 22, r: 10 }),
    ...person(130, 136, 'green', { h: 26, w: 20, r: 9 }),
    s('path', { d: 'M66 30l6-10 8 8 8-8 6 10z' }, 'yellow')
  ],
  pavimento: [
    s('path', { d: 'M14 70h132v76H14z' }, 'gray'),
    s('path', { d: rects([[14, 70, 30, 16], [48, 70, 30, 16], [82, 70, 30, 16], [116, 70, 30, 16], [30, 90, 30, 16], [64, 90, 30, 16], [98, 90, 30, 16], [14, 110, 30, 16], [48, 110, 30, 16], [82, 110, 30, 16], [116, 110, 30, 16]]) }, 'tan', { accent: true }),
    s('rect', { x: 46, y: 26, width: 50, height: 30, rx: 15 }, 'orange'),
    s('path', { d: 'M96 40h24v20', ...SW(5) }, 'dark', { stroke: true })
  ],
  'pelotón': [
    ground(),
    s('path', { d: dots([[30, 74], [62, 74], [94, 74], [126, 74]], 10) }, 'skin'),
    s('path', { d: 'M18 72q12-16 24 0zM50 72q12-16 24 0zM82 72q12-16 24 0zM114 72q12-16 24 0z' }, 'green'),
    s('path', { d: rects([[19, 88, 22, 48], [51, 88, 22, 48], [83, 88, 22, 48], [115, 88, 22, 48]]) }, 'green', { accent: true }),
    s('path', { d: 'M18 108h120', ...SW(3) }, 'brown', { stroke: true })
  ],
  penoso: [
    ground(),
    ...lean(76, 136, 24, 'gray', { accent: true }),
    s('rect', { x: 66, y: 32, width: 62, height: 38, rx: 6, transform: 'rotate(20 97 51)' }, 'brown'),
    s('path', { d: drop(66, 86, 4) + drop(54, 76, 3) }, 'sky'),
    s('path', { d: 'M86 80q4-6 0-12', ...SW(3) }, 'dark', { stroke: true })
  ],
  'pezón': [
    s('path', { d: 'M50 70h60v62q0 8-8 8H58q-8 0-8-8z' }, 'white'),
    s('path', { d: 'M50 70h60v62q0 8-8 8H58q-8 0-8-8zM62 90h36M62 106h36M62 122h36', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 46, y: 56, width: 68, height: 16, rx: 4 }, 'sky'),
    s('path', { d: 'M64 56q4-22 12-30q4-6 8 0q8 8 12 30z' }, 'orange', { accent: true })
  ],
  pinza: [
    s('path', { d: 'M14 40q66 16 132 0', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 46h32v40H38z' }, 'pink'),
    s('rect', { x: 70, y: 38, width: 12, height: 76, rx: 4, transform: 'rotate(-8 76 40)' }, 'tan', { accent: true }),
    s('rect', { x: 84, y: 38, width: 12, height: 76, rx: 4, transform: 'rotate(8 90 40)' }, 'tan'),
    s('path', { d: 'M76 70h22', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M112 46h26v32h-26z' }, 'sky')
  ],
  pizca: [
    s('path', { d: 'M40 20q-6 30 24 44l20 4q10-10-4-20L62 36q-4-16-22-16z' }, 'skin'),
    s('path', { d: 'M120 20q6 30-22 42l-14 6q-6-10 6-18l14-14q2-16 16-16z' }, 'tan'),
    s('path', { d: dots([[82, 82], [78, 94], [86, 102], [80, 112]], 3) }, 'gray'),
    s('ellipse', { cx: 80, cy: 128, rx: 34, ry: 10 }, 'blue', { accent: true }),
    s('path', { d: 'M72 124l8 4 10-4', ...SW(3) }, 'white', { stroke: true })
  ],
  ponencia: [
    s('rect', { x: 46, y: 18, width: 98, height: 66, rx: 4 }, 'white'),
    outline({ x: 46, y: 18, width: 98, height: 66, rx: 4 }),
    s('path', { d: rects([[60, 54, 14, 20], [82, 42, 14, 32], [104, 30, 14, 44]]) }, 'blue', { accent: true }),
    ...person(26, 110, 'red', { h: 34, w: 22, r: 10 }),
    s('path', { d: 'M36 84l20-22', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: busts([66, 96, 126], 140, 24, 24) + dots([[66, 110], [96, 110], [126, 110]], 9) }, 'navy')
  ],
  preferente: [
    s('path', { d: 'M44 136V40q0-14 14-14h30q14 0 14 14v56h20v40z' }, 'red', { accent: true }),
    s('path', { d: 'M40 96h86v16H40z' }, 'dark'),
    s('path', { d: 'M56 136v-24M110 136v-24', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: star(73, 60, 16) }, 'yellow')
  ],
  presencial: [
    ground(),
    ...person(44, 136, 'blue'),
    ...person(116, 136, 'orange'),
    s('path', { d: 'M58 104h44', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M80 64q-16-20-16-30a16 16 0 0 1 32 0q0 10-16 30z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 34, r: 6 }, 'white')
  ],
  primeramente: [
    s('path', { d: rects([[58, 74, 44, 62]]) }, 'yellow', { accent: true }),
    s('path', { d: rects([[18, 96, 40, 40], [102, 108, 40, 28]]) }, 'gray'),
    s('circle', { cx: 80, cy: 52, r: 12 }, 'skin'),
    s('path', { d: 'M66 74q0-12 14-12t14 12z' }, 'red'),
    s('path', { d: 'M56 30l8 8M104 30l-8 8M80 24v10', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'dark', { stroke: true })
  ],
  'psicoanálisis': [
    s('path', { d: 'M14 112h96v18H14zM14 112q0-24 20-24h10v24z' }, 'brown'),
    s('path', { d: 'M44 100h62v12H44z' }, 'purple', { accent: true }),
    s('circle', { cx: 36, cy: 92, r: 10 }, 'skin'),
    s('path', { d: 'M24 130v8M104 130v8', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 130, cy: 58, r: 11 }, 'skin'),
    s('path', { d: 'M118 112V80q0-10 12-10t12 10v32z' }, 'navy'),
    s('rect', { x: 110, y: 82, width: 14, height: 18, rx: 2 }, 'cream'),
    s('path', { d: ells([[70, 54, 14, 10], [52, 76, 5, 4]]) }, 'gray')
  ],
  pulsera: [
    s('path', { d: ring(80, 80, 42), ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots(around(80, 80, 42, 14), 8) }, 'blue', { accent: true }),
    s('path', { d: dots(around(80, 80, 42, 7), 5) }, 'pink'),
    s('circle', { cx: 80, cy: 124, r: 9 }, 'yellow')
  ],
  'redención': [
    backdrop('cream'),
    s('path', { d: halfRays(80, 76, 30, 56, 9), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M38 108a16 16 0 1 1 22 0M100 108a16 16 0 1 1 22 0', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 98q-16-8-30-2q10-14 26-12q-8-14 4-24q12 10 4 24q16-2 26 12q-14-6-30 2z' }, 'white', { accent: true }),
    s('path', { d: 'M80 98q-16-8-30-2q10-14 26-12q-8-14 4-24q12 10 4 24q16-2 26 12q-14-6-30 2z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 120l-8 10M100 120l8 10', ...SW(4) }, 'dark', { stroke: true })
  ],
  'sanguíneo': [
    s('path', { d: drop(64, 92, 36) }, 'red', { accent: true }),
    s('path', { d: ells([[118, 46, 18, 12], [124, 92, 14, 9], [110, 130, 16, 10]]) }, 'pink'),
    s('path', { d: ells([[118, 46, 8, 4], [124, 92, 6, 3], [110, 130, 7, 3]]) }, 'red'),
    s('path', { d: 'M48 86q4-14 14-20', ...SW(5) }, 'white', { stroke: true })
  ],
  selectivo: [
    s('path', { d: dots([[30, 36], [64, 36], [98, 36], [130, 36], [30, 74], [98, 74], [130, 74], [30, 112], [64, 112], [130, 112]], 11) }, 'gray'),
    s('circle', { cx: 64, cy: 74, r: 13 }, 'red', { accent: true }),
    s('circle', { cx: 98, cy: 112, r: 13 }, 'red'),
    s('path', { d: ring(64, 74, 20) + ring(98, 112, 20), ...SW(3) }, 'green', { stroke: true })
  ],
  sentenciar: [
    s('rect', { x: 30, y: 116, width: 100, height: 20, rx: 4 }, 'brown'),
    s('ellipse', { cx: 80, cy: 112, rx: 26, ry: 6 }, 'tan'),
    s('rect', { x: 50, y: 40, width: 50, height: 26, rx: 6, transform: 'rotate(-30 75 53)' }, 'brown', { accent: true }),
    s('path', { d: 'M84 60l36 46', ...SW(8) }, 'tan', { stroke: true }),
    s('path', { d: 'M40 100l-12-6M50 90l-6-12M110 96l12-6', ...SW(3) }, 'orange', { stroke: true })
  ],
  sesgo: [
    s('path', { d: 'M80 40v86M56 130h48', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 64l104-26', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 64l-14 34M36 64l14 34M124 42l-14 34M124 42l14 34', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M16 98h40q-2 14-20 14t-20-14zM104 76h40q-2 14-20 14t-20-14z' }, 'yellow', { accent: true }),
    s('rect', { x: 26, y: 82, width: 20, height: 16, rx: 2 }, 'red')
  ],
  severamente: [
    s('circle', { cx: 70, cy: 74, r: 44 }, 'skin', { accent: true }),
    s('path', { d: 'M44 54l20 8M96 54l-20 8', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[56, 72], [84, 72]], 5) }, 'dark'),
    s('path', { d: 'M54 98h32', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M114 140v-56', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M114 84V52', ...SW(7) }, 'tan', { stroke: true }),
    s('path', { d: 'M130 50l10-6M130 64h12', ...SW(3) }, 'red', { stroke: true })
  ],
  'señorío': [
    s('path', { d: 'M14 136q66-24 132 0z' }, 'green'),
    s('rect', { x: 40, y: 64, width: 80, height: 60 }, 'cream'),
    s('path', { d: 'M32 66l48-30 48 30z' }, 'red', { accent: true }),
    s('path', { d: grid(50, 76, 3, 2, 12, 14, 24, 24) }, 'sky'),
    s('path', { d: 'M80 36V14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 14h16l-5 5 5 5H82z' }, 'purple')
  ],
  sobredosis: [
    s('rect', { x: 22, y: 50, width: 52, height: 72, rx: 8, transform: 'rotate(-60 48 86)' }, 'orange', { accent: true }),
    s('rect', { x: 16, y: 34, width: 22, height: 30, rx: 4, transform: 'rotate(-60 48 86)' }, 'white'),
    s('path', { d: ells([[92, 104, 10, 6], [116, 118, 10, 6], [104, 132, 10, 6], [132, 100, 10, 6], [84, 128, 10, 6], [128, 134, 10, 6]]) }, 'red'),
    s('path', { d: ells([[108, 92, 10, 6], [140, 120, 8, 5]]) }, 'sky'),
    s('path', { d: 'M14 140h132', ...SW(3) }, 'gray', { stroke: true })
  ],
  tornado: [
    s('path', { d: 'M20 30h120q-10 14-30 20q-4 14-20 22q-4 14-14 24q-2 16-10 26q6 10-2 14q-6-8-2-16q-6-12 0-24q-10-10-6-22q-16-8-16-22q-16-6-20-22z' }, 'gray', { accent: true }),
    s('path', { d: 'M30 40h96M44 60h66M54 82h42M64 104h20', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M40 136q30-10 80 0', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: dots([[40, 120], [116, 116], [104, 128]], 3) }, 'brown')
  ],
  traicionar: [
    ground(),
    ...person(44, 136, 'blue'),
    ...person(116, 136, 'purple', { accent: true }),
    s('path', { d: 'M58 104h44', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M132 110l10 2', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M140 112l4-30 4 30z' }, 'gray'),
    s('path', { d: 'M108 76q8 4 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  'tramitación': [
    ...paper(20, 20, 56, 70),
    s('path', { d: 'M30 36h36M30 48h36M30 60h24', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 92, y: 58, width: 52, height: 64, rx: 3 }, 'cream'),
    s('circle', { cx: 118, cy: 98, r: 14 }, 'red', { accent: true }),
    s('path', { d: 'M110 98l6 6 10-12', ...SW(3) }, 'white', { stroke: true }),
    arrow('M48 98q0 30 34 20M74 110l10 8-12 4', 'blue', 4)
  ],
  trance: [
    s('path', { d: 'M80 14v76', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 14L52 84', ...SW(3, { 'stroke-dasharray': '2 6' }) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 100, r: 22 }, 'yellow', { accent: true }),
    s('path', { d: 'M80 100a3 3 0 0 1 6 0a7 7 0 0 1-14 0a11 11 0 0 1 22 0a15 15 0 0 1-30 0', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M36 84q-10 16 0 32M124 84q10 16 0 32', ...SW(4) }, 'purple', { stroke: true })
  ],
  'tranvía': [
    s('path', { d: 'M14 24h132', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 24l-10 16h20z' }, 'dark'),
    s('rect', { x: 20, y: 40, width: 120, height: 78, rx: 14 }, 'red', { accent: true }),
    s('path', { d: rects([[32, 52, 24, 26], [62, 52, 24, 26], [92, 52, 24, 26]]) }, 'sky'),
    s('rect', { x: 120, y: 52, width: 14, height: 60, rx: 2 }, 'yellow'),
    s('path', { d: 'M14 130h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[44, 122], [116, 122]], 8) }, 'dark')
  ],
  trescientos: [
    s('path', { d: rects([[10, 40, 42, 42], [59, 40, 42, 42], [108, 40, 42, 42]]) }, 'cream'),
    s('path', { d: 'M14 46.0h34M14 49.5h34M14 53.0h34M14 56.5h34M14 60.0h34M14 63.5h34M14 67.0h34M14 70.5h34M14 74.0h34M14 77.5h34M63 46.0h34M63 49.5h34M63 53.0h34M63 56.5h34M63 60.0h34M63 63.5h34M63 67.0h34M63 70.5h34M63 74.0h34M63 77.5h34M112 46.0h34M112 49.5h34M112 53.0h34M112 56.5h34M112 60.0h34M112 63.5h34M112 67.0h34M112 70.5h34M112 74.0h34M112 77.5h34', ...SW(2.6, { 'stroke-linecap': 'butt', 'stroke-dasharray': '2.6 0.9' }) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: rects([[10, 40, 42, 42], [59, 40, 42, 42], [108, 40, 42, 42]]), ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: dots([[31, 108], [80, 108], [129, 108]], 12) }, 'orange')
  ],
  trueno: [
    s('path', { d: ells([[80, 52, 42, 22], [50, 58, 24, 16], [112, 58, 24, 16], [74, 36, 24, 18]]) }, 'dark'),
    s('path', { d: 'M82 70l-18 34h16l-12 34 32-46H84l12-22z' }, 'yellow', { accent: true }),
    s('path', { d: 'M30 96q-10 12 0 24M18 90q-14 18 0 36M130 96q10 12 0 24M142 90q14 18 0 36', ...SW(4) }, 'orange', { stroke: true })
  ],
  ultramar: [
    s('path', { d: 'M14 92h132v48H14z' }, 'blue'),
    s('path', { d: 'M104 92q14-18 30-2z' }, 'green'),
    s('path', { d: 'M126 92V70', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M118 72q8-8 16 0M126 70q6-10 14-4', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M26 84h44l-6 12H32z' }, 'red', { accent: true }),
    s('path', { d: 'M48 84V48l18 30z' }, 'white'),
    s('path', { d: 'M48 84V48l18 30z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M76 70q12-6 22 0', ...DASH(3, '4 5') }, 'navy', { stroke: true })
  ],
  veinticuatro: [
    s('rect', { x: 20, y: 32, width: 120, height: 96, rx: 10 }, 'cream'),
    s('path', { d: dots(Array.from({ length: 24 }, (_, i) => [34 + (i % 6) * 18.4, 48 + Math.floor(i / 6) * 21.4]), 6) }, 'red', { accent: true }),
    s('path', { d: 'M20 85h120', ...SW(2) }, 'tan', { stroke: true }),
    outline({ x: 20, y: 32, width: 120, height: 96, rx: 10 }, 'tan')
  ],
  vicioso: [
    s('rect', { x: 18, y: 76, width: 48, height: 48, rx: 8, transform: 'rotate(-12 42 100)' }, 'white'),
    s('rect', { x: 18, y: 76, width: 48, height: 48, rx: 8, transform: 'rotate(-12 42 100)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[30, 92], [42, 100], [54, 108], [32, 112], [52, 88]], 4.5) }, 'red', { accent: true }),
    s('path', { d: 'M78 120l60-24', ...SW(9) }, 'white', { stroke: true, lineColor: 'gray' }),
    s('path', { d: 'M132 98l8-3', ...SW(9, { 'stroke-linecap': 'butt' }) }, 'orange', { stroke: true }),
    s('path', { d: 'M140 86q-8-12 0-24t0-26', ...SW(4) }, 'gray', { stroke: true })
  ],
  abortar: [
    s('path', { d: 'M60 120V60q0-28 20-46q20 18 20 46v60z' }, 'white'),
    s('path', { d: 'M60 120V60q0-28 20-46q20 18 20 46v60z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 96l-16 24h16zM100 96l16 24h-16z' }, 'blue'),
    s('circle', { cx: 80, cy: 58, r: 8 }, 'sky'),
    s('circle', { cx: 116, cy: 116, r: 24 }, 'red', { accent: true }),
    s('path', { d: 'M104 116h24', ...SW(6) }, 'white', { stroke: true })
  ],
  agotamiento: [
    s('rect', { x: 26, y: 50, width: 96, height: 60, rx: 10 }, 'white'),
    s('rect', { x: 26, y: 50, width: 96, height: 60, rx: 10, ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 122, y: 68, width: 12, height: 24, rx: 3 }, 'dark'),
    s('rect', { x: 36, y: 60, width: 16, height: 40, rx: 3 }, 'red', { accent: true }),
    s('path', { d: drop(70, 132, 6) + drop(96, 128, 4) }, 'sky'),
    s('path', { d: 'M62 26l8 8M98 26l-8 8', ...SW(4) }, 'gray', { stroke: true })
  ],
  alarmante: [
    s('path', { d: 'M48 116V82a32 32 0 0 1 64 0v34z' }, 'red', { accent: true }),
    s('rect', { x: 36, y: 116, width: 88, height: 18, rx: 4 }, 'dark'),
    s('path', { d: 'M62 84a18 18 0 0 1 18-18', ...SW(5) }, 'pink', { stroke: true }),
    s('path', { d: 'M80 18v18M34 34l12 12M126 34l-12 12M16 76h18M144 76h-18', ...SW(5) }, 'orange', { stroke: true })
  ],
  'alfabetización': [
    ...openBook(80, 78),
    s('path', { d: 'M36 92h34M36 104h34M36 116h24M90 96h34M90 108h34M90 120h24', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 40, r: 16 }, 'skin'),
    s('path', { d: 'M64 38q0-20 16-20t16 20q-6-8-16-8t-16 8z' }, 'brown'),
    s('path', { d: 'M110 70l20-40 6 4-20 40z' }, 'yellow', { accent: true })
  ],
  apego: [
    s('path', { d: dots([[56, 52], [104, 52]], 9) }, 'brown'),
    s('circle', { cx: 80, cy: 72, r: 26 }, 'brown', { accent: true }),
    s('ellipse', { cx: 80, cy: 116, rx: 30, ry: 24 }, 'brown'),
    s('path', { d: dots([[70, 68], [90, 68]], 3) + ells([[80, 82, 9, 6]]) }, 'tan'),
    s('path', { d: 'M28 118q20-26 52-12q32-14 52 12', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: heart(124, 30, 12) }, 'pink')
  ],
  aplaudir: [
    s('path', { d: 'M56 140l6-40q-2-30 10-58q6-10 12-2q4 10 2 24l6-14q8-6 10 4l-6 30-8 56z' }, 'skin', { accent: true }),
    s('path', { d: 'M80 140l4-50q0-14 10-30q8-6 10 4l-4 24 10-10q10-2 8 8l-12 24-6 30z' }, 'tan'),
    s('path', { d: 'M36 50l-14-10M30 74H14M54 26l-6-12M120 30l10-12M134 54l14-6', ...SW(4) }, 'orange', { stroke: true })
  ],
  aptitud: [
    s('path', { d: 'M40 120q-20-30 0-62q20-30 52-22q32 8 34 40q2 20-12 30v26H52z' }, 'pink'),
    s('path', { d: 'M62 60q8-14 22-6M84 54q14-8 22 6M60 84q16 4 20-10M88 82q14 6 22-8', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: star(84, 70, 18) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(130, 30, 10) + sparkle(30, 40, 7) }, 'orange')
  ],
  ascendente: [
    s('path', { d: 'M14 140h30v-26h28V88h28V62h30V36h16v104z' }, 'tan', { accent: true }),
    s('path', { d: 'M14 140h30v-26h28V88h28V62h30V36h16', ...SW(3) }, 'brown', { stroke: true }),
    arrow('M26 96l70-62M74 32h22v22', 'green', 6)
  ],
  atrocidad: [
    backdrop('dark'),
    s('path', { d: 'M24 136v-40l20-16 18 14v42zM80 136V82l14-10 8 20 12-4 22 16v32z' }, 'gray'),
    s('path', { d: 'M88 72q-10-14 0-26q-4 12 8 18q-2-14 10-22q-4 16 6 24q-4 10-24 6z' }, 'red', { accent: true }),
    s('path', { d: ells([[54, 46, 18, 10], [76, 30, 14, 8]]) }, 'gray'),
    s('path', { d: 'M38 112h8M96 110h8', ...SW(5) }, 'black', { stroke: true })
  ],
  autoritarismo: [
    ground(),
    s('path', { d: 'M48 100h64v36H48z' }, 'gray'),
    ...person(80, 100, 'black', { h: 44, w: 32, r: 13, accent: true }),
    s('path', { d: 'M96 66l26-12v28z' }, 'red'),
    s('path', { d: busts([22, 138], 136, 16, 20) + dots([[22, 108], [138, 108]], 7) }, 'blue'),
    s('path', { d: 'M126 60l10-6M128 72h12', ...SW(3) }, 'red', { stroke: true })
  ],
  bautizar: [
    s('path', { d: 'M36 96h88q-4 28-44 28t-44-28z' }, 'gray'),
    s('path', { d: 'M70 124h20v12H70zM56 136h48', ...SW(4) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 80, cy: 96, rx: 44, ry: 8 }, 'sky'),
    s('ellipse', { cx: 72, cy: 80, rx: 26, ry: 12 }, 'white'),
    s('ellipse', { cx: 72, cy: 80, rx: 26, ry: 12, ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 100, cy: 76, r: 12 }, 'skin'),
    s('path', { d: 'M112 22q12 10 6 22', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: drop(106, 50, 4) + drop(98, 60, 3) }, 'blue', { accent: true })
  ],
  bikini: [
    backdrop('sky'),
    s('path', { d: 'M38 30l12 24M122 30l-12 24M50 54q30 10 60 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M46 54q-6 22 10 26q18-4 22-24zM114 54q6 22-10 26q-18-4-22-24z' }, 'pink', { accent: true }),
    s('path', { d: 'M38 100q42 10 84 0l-24 34H62z' }, 'pink'),
    s('path', { d: dots([[62, 66], [98, 66], [80, 112]], 4) }, 'white')
  ],
  complutense: [
    ground(),
    s('rect', { x: 22, y: 64, width: 116, height: 72 }, 'tan'),
    s('path', { d: 'M16 66l64-34 64 34z' }, 'brown', { accent: true }),
    s('path', { d: 'M38 74v54M58 74v54M102 74v54M122 74v54', ...SW(7) }, 'cream', { stroke: true }),
    s('path', { d: 'M70 136v-26a10 10 0 0 1 20 0v26z' }, 'dark'),
    s('path', { d: 'M80 32V14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 54l14-8 14 8-14 6z' }, 'navy')
  ],
  consagrar: [
    s('path', { d: halfRays(80, 54, 34, 54, 7), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M54 34h52q0 36-26 40q-26-4-26-40z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 74v36M58 116h44', ...SW(8) }, 'yellow', { stroke: true }),
    s('path', { d: 'M54 34h52', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M62 140q4-16 18-18q14 2 18 18', ...SW(8) }, 'skin', { stroke: true })
  ],
  contorno: [
    s('path', { d: 'M40 136V78q0-20 12-30l-8-24 20 14q16-6 32 0l20-14-8 24q12 10 12 30v58z', ...DASH(4, '7 6') }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M60 72h8M92 72h8M74 92l6 6 6-6', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M118 120l22-44 6 3-22 44z' }, 'yellow'),
    s('path', { d: 'M118 120l-2 10 8-7z' }, 'dark')
  ],
  'contracción': [
    s('circle', { cx: 80, cy: 80, r: 24 }, 'red', { accent: true }),
    arrow('M18 80h26M34 70l10 10-10 10', 'blue', 5),
    arrow('M142 80h-26M126 70l-10 10 10 10', 'blue', 5),
    arrow('M80 18v26M70 34l10 10 10-10', 'blue', 5),
    arrow('M80 142v-26M70 126l10-10 10 10', 'blue', 5),
    s('path', { d: ring(80, 80, 46), ...DASH(3, '4 6') }, 'gray', { stroke: true })
  ],
  cota: [
    s('path', { d: 'M50 26l-30 20 8 34 14-6v62h76V74l14 6 8-34-30-20q-14 10-30 10t-30-10z' }, 'gray', { accent: true }),
    s('path', { d: 'M42 60h76M42 76h76M42 92h76M42 108h76M42 124h76', ...SW(3, { 'stroke-dasharray': '4 3' }) }, 'dark', { stroke: true }),
    s('path', { d: 'M42 136h76', ...SW(5) }, 'brown', { stroke: true })
  ],
  criminalidad: [
    backdrop('navy'),
    s('circle', { cx: 64, cy: 58, r: 18 }, 'skin'),
    s('path', { d: 'M46 54h36v10H46z' }, 'black', { accent: true }),
    s('path', { d: 'M46 52q0-24 18-24t18 24z' }, 'dark'),
    s('path', { d: 'M40 136v-38q0-18 24-18t24 18v38z' }, 'dark'),
    s('path', { d: 'M96 136q-10-20 6-34h24q16 14 6 34z' }, 'gray'),
    s('path', { d: 'M108 102l6-10 6 10', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: dots([[130, 34]], 12) }, 'yellow')
  ],
  'cuantía': [
    s('path', { d: ells([[40, 130, 18, 6], [40, 122, 18, 6], [40, 114, 18, 6], [80, 130, 18, 6], [80, 122, 18, 6], [80, 114, 18, 6], [80, 106, 18, 6], [80, 98, 18, 6], [120, 130, 18, 6], [120, 122, 18, 6], [120, 114, 18, 6], [120, 106, 18, 6], [120, 98, 18, 6], [120, 90, 18, 6], [120, 82, 18, 6]]) }, 'orange'),
    s('path', { d: ells([[40, 108, 18, 6], [80, 92, 18, 6], [120, 76, 18, 6]]) }, 'yellow', { accent: true }),
    arrow('M26 64l40-20 30 6 34-26M118 22h14v14', 'green', 5)
  ],
  culturalmente: [
    s('path', { d: 'M24 136q-8-24 6-40q-6-10 2-16h20q8 6 2 16q14 16 6 40z' }, 'orange', { accent: true }),
    s('path', { d: 'M28 108h40', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 26h46q2 34-23 40q-25-6-23-40z' }, 'white'),
    s('path', { d: 'M86 26h46q2 34-23 40q-25-6-23-40z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 38h6M116 38h6M98 52q11 8 22 0', ...SW(3) }, 'dark', { stroke: true }),
    ...note(108, 118, 'purple')
  ],
  curro: [
    s('rect', { x: 18, y: 110, width: 124, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M28 120v20M132 120v20', ...SW(6) }, 'brown', { stroke: true }),
    ...person(54, 110, 'blue', { h: 34, w: 30 }),
    s('path', { d: 'M78 70h44v34H78z' }, 'dark'),
    s('path', { d: 'M82 74h36v26H82z' }, 'sky', { accent: true }),
    s('path', { d: 'M74 106h52', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 128, y: 92, width: 12, height: 16, rx: 2 }, 'red')
  ],
  'demarcación': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'mint'),
    s('path', { d: 'M14 100q40-30 62-10t70-28V146H14z' }, 'tan'),
    s('path', { d: 'M14 100q40-30 62-10t70-28', ...DASH(5, '10 7') }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M40 86V60M108 76V50', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M42 60h16l-4 6 4 6H42zM110 50h16l-4 6 4 6h-16z' }, 'orange')
  ],
  'democráticamente': [
    s('path', { d: dots([[30, 86], [64, 86], [98, 86], [130, 86]], 10) }, 'skin'),
    s('path', { d: busts([30, 64, 98, 130], 136, 26, 36) }, 'blue'),
    s('path', { d: 'M40 106l6-56M74 106l4-56M108 106l4-56', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: busts([130], 136, 26, 36) }, 'orange', { accent: true }),
    s('path', { d: 'M140 106l2-56', ...SW(7) }, 'skin', { stroke: true })
  ],
  denotar: [
    s('path', { d: 'M18 90l50-6 8-8 10 6-6 12-58 8z' }, 'skin'),
    s('circle', { cx: 112, cy: 92, r: 26 }, 'red', { accent: true }),
    s('path', { d: 'M112 66q2-12 8-16', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 36l20-14 20 10-10 18z' }, 'yellow'),
    s('path', { d: 'M114 48l-2 18', ...SW(2) }, 'dark', { stroke: true }),
    arrow('M84 74l8-8', 'orange', 4)
  ],
};
