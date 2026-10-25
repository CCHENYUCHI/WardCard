// Illustration specs for words still undrawn in batches 0070–0071 (see server/scripts/lexicon/art.js)
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
  espinal: [
    backdrop('sky'),
    s('rect', { x: 44, y: 14, width: 72, height: 132, rx: 30 }, 'skin'),
    s('path', { d: 'M80 18q-14 32 0 62q14 30 0 62', ...SW(22, { 'stroke-linecap': 'butt', 'stroke-dasharray': '11 4' }) }, 'cream', { stroke: true }),
    s('path', { d: 'M80 18q-14 32 0 62q14 30 0 62', ...SW(4) }, 'red', { stroke: true, accent: true })
  ],
  'estabilización': [
    s('path', { d: 'M66 44l10 10 20-20', ...SW(8) }, 'green', { stroke: true }),
    s('rect', { x: 16, y: 66, width: 128, height: 32, rx: 6 }, 'yellow', { accent: true }),
    s('rect', { x: 50, y: 72, width: 60, height: 20, rx: 10 }, 'mint'),
    s('ellipse', { cx: 80, cy: 82, rx: 10, ry: 6 }, 'white'),
    s('path', { d: 'M66 72v20M94 72v20', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 120h112', ...SW(4) }, 'gray', { stroke: true })
  ],
  estonio: [
    ground(),
    s('path', { d: 'M34 136V20', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 38, y: 26, width: 100, height: 22 }, 'blue', { accent: true }),
    s('rect', { x: 38, y: 48, width: 100, height: 22 }, 'black'),
    s('rect', { x: 38, y: 70, width: 100, height: 22 }, 'white'),
    outline({ x: 38, y: 26, width: 100, height: 66 })
  ],
  'estéril': [
    s('circle', { cx: 80, cy: 84, r: 56 }, 'sky'),
    s('circle', { cx: 80, cy: 84, r: 46 }, 'white'),
    s('path', { d: burst(80, 84, 20, 13, 8) }, 'green'),
    s('circle', { cx: 80, cy: 84, r: 30, ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M59 63l42 42', ...SW(8) }, 'red', { stroke: true })
  ],
  exagerar: [
    ground(),
    s('path', { d: fishes([[86, 30]]) }, 'orange'),
    arrow('M22 52H138M22 52l8-6M22 52l8 6M138 52l-8-6M138 52l-8 6', 'gray', 4),
    s('path', { d: 'M68 100L22 74M92 100l46-26', ...SW(7) }, 'skin', { stroke: true }),
    ...person(80, 136, 'blue', { accent: true })
  ],
  exento: [
    ...paper(34, 22, 72, 100),
    s('path', { d: 'M46 42h48M46 58h48M46 74h30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M106 76l24 9v20q0 20-24 30q-24-10-24-30V85z' }, 'green', { accent: true }),
    s('path', { d: 'M95 105l8 8 14-16', ...SW(5) }, 'white', { stroke: true })
  ],
  exponente: [
    s('path', { d: rects([[20, 116, 32, 20], [108, 122, 32, 14]]) }, 'tan'),
    s('rect', { x: 52, y: 104, width: 56, height: 32 }, 'yellow'),
    s('path', { d: 'M68 70l-12-18M92 70l12-18', ...SW(6) }, 'skin', { stroke: true }),
    ...person(80, 104, 'red', { accent: true, h: 40 }),
    s('path', { d: star(80, 24, 11) }, 'orange')
  ],
  faja: [
    s('path', { d: 'M52 18h56q-8 40 4 62q-12 30-4 62H52q8-32-4-62q12-22 4-62z' }, 'blue'),
    s('rect', { x: 40, y: 70, width: 80, height: 26, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M100 92l14 36M108 90l20 30', ...SW(6) }, 'red', { stroke: true }),
    s('circle', { cx: 104, cy: 83, r: 8 }, 'orange')
  ],
  fervor: [
    s('path', { d: heart(80, 104, 30) }, 'red', { accent: true }),
    s('path', { d: 'M80 14q22 22 10 40q14-4 12-20q16 20 0 40H58q-16-20 0-40q-2 16 12 20q-12-18 10-40z' }, 'orange'),
    s('path', { d: 'M80 38q10 12 4 24h-8q-6-12 4-24z' }, 'yellow')
  ],
  fideicomiso: [
    s('rect', { x: 34, y: 58, width: 92, height: 80, rx: 8 }, 'gray'),
    s('rect', { x: 44, y: 68, width: 72, height: 60, rx: 4 }, 'dark'),
    s('circle', { cx: 80, cy: 98, r: 14 }, 'yellow', { accent: true }),
    s('path', { d: 'M80 98l8-8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 22h26q8 0 8 8t-8 8H18z' }, 'skin'),
    s('path', { d: ring(64, 30, 9) + 'M73 30h44M107 30v10M117 30v10', ...SW(5) }, 'orange', { stroke: true })
  ],
  grifo: [
    s('rect', { x: 14, y: 36, width: 20, height: 44, rx: 4 }, 'gray'),
    s('path', { d: 'M34 56h58q16 0 16 16v12', ...SW(16) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 48V34', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 50, y: 24, width: 32, height: 10, rx: 5 }, 'red', { accent: true }),
    s('path', { d: 'M108 94v18', ...SW(7) }, 'sky', { stroke: true }),
    s('path', { d: drop(108, 128, 9) }, 'blue')
  ],
  habilitar: [
    s('path', { d: 'M60 32l12 12 24-24', ...SW(8) }, 'green', { stroke: true }),
    s('rect', { x: 20, y: 60, width: 120, height: 52, rx: 26 }, 'green', { accent: true }),
    s('circle', { cx: 112, cy: 86, r: 21 }, 'white'),
    s('circle', { cx: 112, cy: 86, r: 21, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 86h30', ...SW(5) }, 'white', { stroke: true })
  ],
  hackear: [
    s('rect', { x: 30, y: 26, width: 100, height: 72, rx: 6 }, 'dark'),
    s('path', { d: 'M18 102h124l-10 18H28z' }, 'gray'),
    s('path', { d: 'M42 42h22M42 52h12M100 42h18M104 84h14M42 84h10', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M72 62v-10a8 8 0 0 1 16 0v-4', ...SW(4) }, 'red', { stroke: true }),
    s('rect', { x: 66, y: 60, width: 28, height: 22, rx: 3 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 70, r: 3 }, 'dark')
  ],
  hetero: [
    ground(),
    ...person(48, 136, 'blue'),
    ...lady(112, 136, 'pink'),
    s('path', { d: 'M62 104h36', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 40, 14) }, 'red', { accent: true })
  ],
  humanismo: [
    s('path', { d: ring(80, 82, 62), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M68 66L26 58M92 66l42-8', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M74 102l-16 36M86 102l16 36', ...SW(8) }, 'blue', { stroke: true }),
    s('rect', { x: 66, y: 56, width: 28, height: 50, rx: 9 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 40, r: 13 }, 'skin')
  ],
  idear: [
    ...person(80, 140, 'green'),
    s('path', { d: halfRays(80, 36, 24, 33, 5), ...SW(4) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 36, r: 18 }, 'yellow', { accent: true }),
    s('rect', { x: 73, y: 52, width: 14, height: 9, rx: 2 }, 'gray'),
    s('path', { d: 'M94 108l-6-24', ...SW(6) }, 'skin', { stroke: true })
  ],
  ilegalidad: [
    s('path', { d: 'M66 72q14-16 28 0', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: rects([[40, 58, 18, 12], [102, 58, 18, 12]]) }, 'dark'),
    s('path', { d: ring(50, 96, 26) + ring(110, 96, 26), ...SW(10) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: dots([[50, 70], [110, 70]], 4) }, 'yellow')
  ],
  inapropiado: [
    s('rect', { x: 22, y: 98, width: 116, height: 38, rx: 4 }, 'brown'),
    s('ellipse', { cx: 80, cy: 104, rx: 22, ry: 7 }, 'dark'),
    s('rect', { x: 60, y: 40, width: 40, height: 40, rx: 2, transform: 'rotate(-10 80 60)' }, 'blue', { accent: true }),
    s('path', { d: 'M116 28l18 18M134 28l-18 18', ...SW(6) }, 'red', { stroke: true })
  ],
  incomodar: [
    s('path', { d: rays(80, 120, 30, 40, 14, 180), ...SW(3) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 80, cy: 122, rx: 36, ry: 20 }, 'green'),
    s('rect', { x: 64, y: 66, width: 32, height: 40, rx: 10 }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 52, r: 13 }, 'skin'),
    s('path', { d: drop(102, 40, 4) + drop(58, 44, 3) }, 'sky'),
    s('path', { d: 'M74 56q6-4 12 0M48 76l-10-6M112 76l10-6', ...SW(3) }, 'dark', { stroke: true })
  ],
  'inducción': [
    s('path', { d: 'M30 40v38a22 22 0 0 0 44 0V40', ...SW(16) }, 'red', { stroke: true }),
    s('path', { d: 'M30 34v14M74 34v14', ...SW(16, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M102 112q-4 26-30 26H44', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 96, y: 56, width: 44, height: 56, rx: 6 }, 'tan'),
    s('path', { d: 'M96 66l44-6M96 78l44-6M96 90l44-6M96 102l44-6', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M120 16l-12 18h10l-8 18 18-24h-10l8-12z' }, 'yellow', { accent: true })
  ],
  infiltrado: [
    ground(),
    ...person(36, 136, 'gray'),
    ...person(124, 136, 'gray'),
    ...person(80, 136, 'dark', { accent: true }),
    s('path', { d: 'M71 77h18', ...SW(6) }, 'black', { stroke: true }),
    s('path', { d: 'M62 68h36M68 68l4-14h16l4 14z' }, 'black')
  ],
  inofensivo: [
    backdrop('mint'),
    s('path', { d: 'M54 112v24M70 116v20M92 116v20M108 112v24', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: ells([[78, 92, 40, 26], [50, 80, 14, 14], [74, 68, 16, 14], [100, 74, 16, 14]]) }, 'white', { accent: true }),
    s('ellipse', { cx: 122, cy: 78, rx: 14, ry: 16 }, 'dark'),
    s('path', { d: dots([[126, 74]], 3) }, 'white'),
    s('path', { d: 'M118 86q5 4 10 0', ...SW(2) }, 'white', { stroke: true })
  ],
  insertar: [
    s('rect', { x: 26, y: 94, width: 108, height: 44, rx: 6 }, 'gray'),
    s('rect', { x: 44, y: 92, width: 72, height: 8, rx: 3 }, 'dark'),
    s('rect', { x: 52, y: 30, width: 56, height: 62, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 60, y: 40, width: 14, height: 11, rx: 2 }, 'yellow'),
    arrow('M126 22v40M116 52l10 10 10-10', 'orange', 5)
  ],
  ladera: [
    backdrop('sky'),
    s('circle', { cx: 40, cy: 40, r: 14 }, 'yellow'),
    s('path', { d: 'M14 146V120L146 40V146z' }, 'green', { accent: true }),
    s('path', { d: 'M44 82l12 22H32zM82 58l12 22H70zM118 36l12 22h-24z' }, 'dark'),
    s('path', { d: 'M30 140q30-20 60-30', ...SW(4) }, 'tan', { stroke: true })
  ],
  lis: [
    backdrop('sky'),
    s('path', { d: 'M80 146V84', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 128, -140, 36, 9) + leaflet(80, 116, -40, 36, 9) }, 'green'),
    s('path', { d: leaflet(80, 88, -90, 56, 15) + leaflet(80, 88, -140, 50, 13) + leaflet(80, 88, -40, 50, 13) }, 'white', { accent: true }),
    s('path', { d: 'M80 86l-8-34M80 86l8-34', ...SW(3) }, 'orange', { stroke: true })
  ],
  malicia: [
    s('path', { d: 'M46 50l-10-34 24 20zM114 50l10-34-24 20z' }, 'red'),
    ...face(80, 86, 50, 'purple', 'smile', { accent: true }),
    s('path', { d: dots([[62, 78], [98, 78]], 6) }, 'yellow'),
    s('path', { d: 'M46 64l26 10M114 64l-26 10', ...SW(6) }, 'dark', { stroke: true })
  ],
  manantial: [
    backdrop('sky'),
    s('path', { d: 'M14 124V64q12-26 36-24q26 4 28 32l-8 52z' }, 'gray'),
    s('path', { d: 'M66 76q28 0 32 44', ...SW(10) }, 'blue', { stroke: true }),
    s('ellipse', { cx: 98, cy: 128, rx: 46, ry: 14 }, 'blue', { accent: true }),
    s('path', { d: dots([[110, 104], [88, 110], [116, 116]], 3) }, 'white'),
    s('path', { d: 'M14 140h132', ...SW(8) }, 'green', { stroke: true })
  ],
  mediador: [
    ground(),
    ...person(32, 136, 'red', { h: 40 }),
    ...person(128, 136, 'blue', { h: 40 }),
    s('path', { d: 'M66 100H48M94 100h18', ...SW(6) }, 'skin', { stroke: true }),
    ...person(80, 136, 'green', { accent: true })
  ],
  'monólogo': [
    backdrop('navy'),
    s('path', { d: 'M80 14L38 132h84z' }, 'cream'),
    s('rect', { x: 14, y: 128, width: 132, height: 18 }, 'brown'),
    ...person(76, 132, 'red', { accent: true }),
    s('path', { d: 'M104 132V96M90 100l14-6', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 104, cy: 92, r: 5 }, 'dark')
  ],
  'murciélago': [
    backdrop('navy'),
    s('circle', { cx: 80, cy: 66, r: 40 }, 'yellow'),
    s('path', { d: 'M74 76Q60 58 18 60q12 12 10 30q12-8 22 0q8-10 24-2zM86 76Q100 58 142 60q-12 12-10 30q-12-8-22 0q-8-10-24-2z' }, 'black'),
    s('path', { d: 'M72 74l2-14 6 8 6-8 2 14z' }, 'black'),
    s('ellipse', { cx: 80, cy: 82, rx: 10, ry: 16 }, 'black', { accent: true }),
    s('path', { d: dots([[76, 76], [84, 76]], 2) }, 'white')
  ],
  nasal: [
    backdrop('pink'),
    s('path', { d: 'M74 18q-4 48-26 76q-10 16 4 22q12 6 28 0q16 6 28 0q14-6 4-22q-22-28-26-76z' }, 'skin', { accent: true }),
    s('path', { d: ells([[66, 108, 7, 4], [94, 108, 7, 4]]) }, 'brown'),
    s('path', { d: 'M54 132q8-6 12-14M106 132q-8-6-12-14', ...SW(4) }, 'sky', { stroke: true })
  ],
  natura: [
    backdrop('sky'),
    s('circle', { cx: 120, cy: 38, r: 16 }, 'yellow'),
    s('path', { d: 'M14 118q40-30 80-10t52 0V146H14z' }, 'mint'),
    s('rect', { x: 52, y: 80, width: 12, height: 44, rx: 3 }, 'brown'),
    s('circle', { cx: 58, cy: 62, r: 28 }, 'green', { accent: true }),
    s('path', { d: birds([[106, 74], [126, 86]]), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots(around(110, 116, 8, 5), 6) }, 'pink'),
    s('circle', { cx: 110, cy: 116, r: 5 }, 'yellow')
  ],
  'neumonía': [
    s('path', { d: 'M80 16v38M80 54l-10 12M80 54l10 12', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: 'M72 40q-32 0-42 48q-6 40 12 40q30 0 30-30zM88 40q32 0 42 48q6 40-12 40q-30 0-30-30z' }, 'pink', { accent: true }),
    s('path', { d: dots([[48, 88], [56, 108], [110, 96], [100, 76]], 6) }, 'red'),
    s('rect', { x: 126, y: 92, width: 12, height: 40, rx: 6 }, 'white'),
    outline({ x: 126, y: 92, width: 12, height: 40, rx: 6 }),
    s('circle', { cx: 132, cy: 134, r: 8 }, 'red')
  ],
  nordeste: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'cream'),
    s('path', { d: ring(80, 80, 62), ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 24v10M80 126v10M24 80h10M126 80h10', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M122 38L86 86L74 74z' }, 'red', { accent: true }),
    s('path', { d: 'M38 122L74 74L86 86z' }, 'gray'),
    s('circle', { cx: 80, cy: 80, r: 6 }, 'dark')
  ],
  ocurrencia: [
    s('path', { d: bubble(30, 16, 110, 74) }, 'white'),
    s('path', { d: bubble(30, 16, 110, 74), ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 85, cy: 46, r: 15 }, 'yellow', { accent: true }),
    s('rect', { x: 79, y: 60, width: 12, height: 8, rx: 2 }, 'gray'),
    s('path', { d: sparkle(116, 38, 8) + sparkle(56, 56, 6) }, 'orange'),
    ...face(48, 124, 20, 'skin')
  ],
  paisano: [
    ground(),
    ...person(54, 136, 'green'),
    ...person(106, 136, 'orange', { accent: true }),
    s('path', { d: 'M68 104h24', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: ells([[54, 68, 20, 5], [106, 68, 20, 5]]) + 'M44 68q10-22 20 0zM96 68q10-22 20 0z' }, 'yellow')
  ],
  'paradójicamente': [
    ground(),
    s('path', { d: 'M90 46q30 0 30 30v24', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 56, y: 52, width: 48, height: 84, rx: 14 }, 'red', { accent: true }),
    s('rect', { x: 62, y: 84, width: 36, height: 20, rx: 3 }, 'white'),
    s('path', { d: 'M60 58q-12-22 6-40q0 14 8 18q0-16 14-24q2 22 12 28q4-8 2-14q16 20-2 32z' }, 'orange'),
    s('path', { d: 'M72 56q-4-12 6-20q2 10 8 12q6 4 2 8z' }, 'yellow')
  ],
  pedestal: [
    backdrop('sky'),
    s('path', { d: rects([[42, 72, 76, 10], [50, 82, 60, 46], [38, 128, 84, 12]]) }, 'gray', { accent: true }),
    s('path', { d: 'M64 88v34M80 88v34M96 88v34', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: busts([80], 72, 40, 26) }, 'cream'),
    s('circle', { cx: 80, cy: 36, r: 14 }, 'cream')
  ],
  pelotudez: [
    s('path', { d: bubble(32, 14, 112, 76) }, 'white'),
    s('path', { d: bubble(32, 14, 112, 76), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M50 54c14-30 26 30 40 0s20 30 36 0', ...SW(5) }, 'red', { stroke: true, accent: true }),
    ...face(50, 126, 18, 'yellow', 'flat'),
    s('path', { d: spiral(80, 120), ...SW(2) }, 'gray', { stroke: true })
  ],
  persuadir: [
    ground(),
    ...person(36, 136, 'blue', { accent: true }),
    ...person(124, 136, 'gray'),
    s('path', { d: bubble(50, 16, 66, 46) }, 'mint'),
    s('path', { d: 'M70 38l8 8 16-16', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M140 64q5 6 0 12M108 64q-5 6 0 12', ...SW(3) }, 'gray', { stroke: true })
  ],
  pliego: [
    s('path', { d: 'M20 40l40 14v80l-40-14zM100 40l40 14v80l-40-14z' }, 'white'),
    s('path', { d: 'M60 54l40-14v80l-40 14z' }, 'cream', { accent: true }),
    s('path', { d: 'M20 40l40 14 40-14 40 14v80l-40-14-40 14-40-14z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 62l24 8M28 76l24 8M68 66l24-8M68 80l24-8M108 62l24 8', ...SW(2) }, 'tan', { stroke: true })
  ],
  'portería': [
    backdrop('green'),
    s('path', { d: 'M36 52v84M48 52v84M60 52v84M72 52v84M84 52v84M96 52v84M108 52v84M120 52v84M24 64h112M24 78h112M24 92h112M24 106h112M24 120h112', ...SW(1.5) }, 'mint', { stroke: true }),
    s('path', { d: 'M24 136V44h112v92', ...SW(7) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 120, r: 15 }, 'white', { accent: true }),
    s('path', { d: dots([[80, 116], [70, 126], [90, 126]], 4) }, 'dark')
  ],
  postear: [
    s('rect', { x: 44, y: 14, width: 68, height: 132, rx: 10 }, 'dark'),
    s('rect', { x: 50, y: 26, width: 56, height: 106, rx: 4 }, 'white'),
    s('rect', { x: 56, y: 36, width: 44, height: 36, rx: 3 }, 'sky'),
    s('path', { d: 'M56 72l14-18 10 10 8-8 12 16z' }, 'green'),
    s('path', { d: heart(66, 94, 7) }, 'red', { accent: true }),
    s('path', { d: 'M78 92h20M58 112h40', ...SW(4) }, 'gray', { stroke: true }),
    arrow('M130 76V36M120 46l10-10 10 10', 'orange', 6)
  ],
  prevalecer: [
    ground(),
    s('path', { d: rects([[20, 104, 22, 32], [48, 92, 22, 44], [118, 98, 22, 38]]) }, 'gray'),
    s('rect', { x: 78, y: 54, width: 30, height: 82 }, 'green', { accent: true }),
    s('path', { d: 'M78 46l-2-26 10 10 7-14 7 14 10-10-2 26z' }, 'yellow')
  ],
  prevalencia: [
    backdrop('cream'),
    s('path', { d: dots([[36, 34], [64, 34], [96, 34], [124, 34], [36, 74], [64, 74], [96, 74], [36, 114], [64, 114]], 8) }, 'red', { accent: true }),
    s('path', { d: busts([36, 64, 96, 124], 60, 20, 16) + busts([36, 64, 96], 100, 20, 16) + busts([36, 64], 140, 20, 16) }, 'red'),
    s('path', { d: dots([[124, 74], [96, 114], [124, 114]], 8) }, 'gray'),
    s('path', { d: busts([124], 100, 20, 16) + busts([96, 124], 140, 20, 16) }, 'gray')
  ],
  'prolongación': [
    s('path', { d: 'M18 52v20M18 62h120', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 14, y: 76, width: 70, height: 18, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: 'M90 85h34', ...SW(18, { 'stroke-linecap': 'butt', 'stroke-dasharray': '8 6' }) }, 'sky', { stroke: true }),
    s('path', { d: 'M126 66l20 19-20 19z' }, 'orange'),
    s('path', { d: 'M14 112h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  propicio: [
    backdrop('cream'),
    s('path', { d: halfRays(118, 46, 18, 28, 5), ...SW(4) }, 'orange', { stroke: true }),
    s('circle', { cx: 118, cy: 46, r: 14 }, 'yellow'),
    s('path', { d: 'M74 80q8 40 26 60', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: dots([[58, 62], [86, 62], [58, 94], [86, 94]], 17) }, 'green', { accent: true }),
    s('path', { d: 'M58 78h28M72 64v28', ...SW(2) }, 'mint', { stroke: true })
  ],
  prosperar: [
    s('rect', { x: 34, y: 108, width: 60, height: 30, rx: 4 }, 'yellow'),
    s('path', { d: 'M34 118h60M34 128h60', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M64 108V56', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(64, 82, -150, 32, 10) + leaflet(64, 66, -30, 34, 11) }, 'green', { accent: true }),
    arrow('M122 132V36M110 48l12-12 12 12', 'orange', 7)
  ],
  purga: [
    ground(),
    s('path', { d: 'M126 16L84 100', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M70 94l26 12-14 30-34-16z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[34, 124], [24, 112], [40, 108], [28, 96]], 6) }, 'gray'),
    s('path', { d: 'M50 84q-8 6-8 14M58 70q-14 8-14 20', ...SW(3) }, 'tan', { stroke: true })
  ],
  'ración': [
    s('ellipse', { cx: 80, cy: 100, rx: 64, ry: 30 }, 'white'),
    s('ellipse', { cx: 80, cy: 100, rx: 64, ry: 30, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 92l-8-30M102 100l10-28', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: ells([[58, 94, 15, 10], [84, 88, 15, 10], [102, 104, 15, 10], [72, 110, 15, 10]]) }, 'orange', { accent: true }),
    s('path', { d: dots([[40, 108], [118, 90], [92, 118]], 3) }, 'green')
  ],
  reembolso: [
    arrow('M114 60Q114 22 80 22Q52 22 52 52M44 44l8 10 8-10', 'orange', 6),
    s('rect', { x: 26, y: 70, width: 92, height: 62, rx: 8 }, 'brown', { accent: true }),
    s('rect', { x: 90, y: 88, width: 38, height: 26, rx: 6 }, 'tan'),
    s('circle', { cx: 104, cy: 101, r: 4 }, 'brown'),
    s('path', { d: dots([[84, 52], [104, 42]], 9) }, 'yellow')
  ],
  reproductivo: [
    s('path', { d: dots([[58, 80], [102, 80]], 32) }, 'pink', { accent: true }),
    s('path', { d: dots([[58, 80], [102, 80]], 11) }, 'purple'),
    s('path', { d: 'M80 54v52', ...SW(3) }, 'white', { stroke: true }),
    arrow('M24 128l-8 8M136 128l8 8M16 128v8h8M144 128v8h-8', 'orange', 4)
  ],
  'restitución': [
    backdrop('cream'),
    s('rect', { x: 26, y: 34, width: 52, height: 42, rx: 2, ...DASH(3) }, 'gray', { stroke: true }),
    s('rect', { x: 78, y: 82, width: 60, height: 46, rx: 3 }, 'brown', { accent: true }),
    s('rect', { x: 86, y: 90, width: 44, height: 30 }, 'sky'),
    s('path', { d: 'M86 120l14-14 10 8 8-6 12 12z' }, 'green'),
    arrow('M104 74Q104 44 84 42M92 34l-10 8 10 8', 'orange', 5)
  ],
  'revólver': [
    s('rect', { x: 40, y: 54, width: 96, height: 14, rx: 3 }, 'gray'),
    s('path', { d: 'M40 62h28l-8 64H38l-12-6z' }, 'brown'),
    s('rect', { x: 52, y: 48, width: 36, height: 28, rx: 7 }, 'dark', { accent: true }),
    s('path', { d: 'M60 76q0 18 16 18', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 52l-10-10 6-3 10 9z' }, 'dark'),
    s('path', { d: 'M58 62h24', ...SW(2) }, 'gray', { stroke: true })
  ],
  rosca: [
    backdrop('sky'),
    s('ellipse', { cx: 80, cy: 88, rx: 64, ry: 40 }, 'tan', { accent: true }),
    s('ellipse', { cx: 80, cy: 84, rx: 24, ry: 11 }, 'sky'),
    s('path', { d: 'M28 80q8-20 26-24M106 56q18 4 26 24M42 112q38 14 76 0', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: dots([[40, 96], [80, 116], [122, 94], [62, 60]], 6) }, 'red'),
    s('path', { d: dots([[60, 112], [100, 112], [100, 60]], 5) }, 'green')
  ],
  rotundamente: [
    ground(),
    ...person(56, 136, 'blue', { accent: true }),
    s('path', { d: 'M42 104h28M42 112l28-12', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M50 84q6-4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 40l36 36M136 40l-36 36', ...SW(11) }, 'red', { stroke: true })
  ],
  'sensibilización': [
    backdrop('cream'),
    s('path', { d: 'M54 132L92 54q8-24-12-26q-20 2-12 26l38 78', ...SW(16) }, 'pink', { stroke: true, accent: true }),
    s('path', { d: heart(124, 40, 9) + heart(36, 56, 7) }, 'red'),
    s('path', { d: sparkle(126, 96, 8) + sparkle(30, 100, 6) }, 'yellow')
  ],
  sobrio: [
    s('path', { d: 'M38 46h48l-6 88H44z' }, 'sky', { accent: true }),
    s('path', { d: 'M38 46h48l-6 88H44z', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M114 64h12v14q8 4 8 14v38h-28V92q0-10 8-14z' }, 'purple'),
    s('path', { d: ring(120, 96, 28) + 'M100 76l40 40', ...SW(5) }, 'red', { stroke: true })
  ],
  'socialización': [
    ground(),
    ...person(36, 136, 'blue'),
    ...person(80, 136, 'orange', { accent: true }),
    ...person(124, 136, 'green'),
    s('path', { d: ells([[58, 36, 18, 12], [104, 30, 18, 12]]) }, 'mint'),
    s('path', { d: heart(58, 38, 5) + heart(104, 32, 5) }, 'red')
  ],
  'socioeconómico': [
    s('path', { d: dots([[46, 40], [80, 32], [114, 40]], 12) }, 'skin'),
    s('path', { d: busts([46, 80, 114], 92, 28, 36) }, 'blue', { accent: true }),
    s('path', { d: dots([[46, 118], [80, 118], [114, 118]], 14) }, 'yellow'),
    s('path', { d: ring(46, 118, 14) + ring(80, 118, 14) + ring(114, 118, 14), ...SW(3) }, 'orange', { stroke: true })
  ],
  sustantivo: [
    backdrop('cream'),
    s('circle', { cx: 50, cy: 58, r: 20 }, 'red', { accent: true }),
    s('path', { d: 'M50 38q4-12 14-12', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M92 72l22-24 22 24v22H92z' }, 'blue'),
    s('circle', { cx: 52, cy: 112, r: 18 }, 'orange'),
    s('rect', { x: 94, y: 102, width: 40, height: 30, rx: 3 }, 'green')
  ],
  terciopelo: [
    s('path', { d: 'M20 18h120v124q-10-6-20 0q-10-6-20 0q-10-6-20 0q-10-6-20 0q-10-6-20 0q-10-6-20 0z' }, 'purple', { accent: true }),
    s('path', { d: 'M40 22v118M60 22v118M80 22v118M100 22v118M120 22v118', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M48 28q5 50 0 104M88 28q5 50 0 104', ...SW(4) }, 'pink', { stroke: true }),
    s('rect', { x: 14, y: 14, width: 132, height: 8, rx: 4 }, 'gray')
  ],
  'tipografía': [
    ...paper(22, 78, 116, 62),
    s('path', { d: 'M34 94h92M34 108h92M34 122h60', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M104 22L92 50', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 46, y: 50, width: 86, height: 22, rx: 11 }, 'dark', { accent: true }),
    s('path', { d: 'M54 58h70', ...SW(3) }, 'gray', { stroke: true })
  ],
  tractor: [
    ground(),
    s('path', { d: 'M28 96h60V58h30v38h12v22H28z' }, 'green', { accent: true }),
    s('rect', { x: 94, y: 64, width: 18, height: 22, rx: 2 }, 'sky'),
    s('path', { d: 'M56 96V68', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[106, 112]], 24) + dots([[44, 122]], 14) }, 'dark'),
    s('path', { d: dots([[106, 112]], 9) + dots([[44, 122]], 5) }, 'yellow')
  ],
  visado: [
    s('rect', { x: 36, y: 18, width: 78, height: 108, rx: 6 }, 'navy'),
    s('path', { d: ring(75, 62, 18) + 'M57 62h36M75 44v36', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M54 100h42', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: ring(110, 112, 22), ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M100 112l7 7 13-14', ...SW(5) }, 'red', { stroke: true })
  ],
  zombi: [
    ground(),
    s('path', { d: 'M72 120l-6 16M88 120l6 16', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 78h32v42l-6-4-5 6-5-6-5 6-5-6-6 4z' }, 'purple'),
    s('path', { d: 'M86 86h42M86 98h40', ...SW(8) }, 'green', { stroke: true }),
    s('circle', { cx: 80, cy: 60, r: 17 }, 'green', { accent: true }),
    s('path', { d: dots([[74, 56], [88, 58]], 3) + 'M72 70h14v3H72z' }, 'dark')
  ],
  agilidad: [
    ground(),
    s('path', { d: 'M60 136V104M100 136V104', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 54, y: 98, width: 52, height: 8, rx: 2 }, 'red'),
    s('path', { d: 'M74 70l-22 10M78 76l-14 20', ...SW(7) }, 'orange', { stroke: true }),
    s('path', { d: 'M96 62l20 14', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 70, y: 56, width: 44, height: 22, rx: 9, transform: 'rotate(-15 92 67)' }, 'orange', { accent: true }),
    s('circle', { cx: 122, cy: 50, r: 11 }, 'skin'),
    s('path', { d: 'M24 70q30-40 70-40', ...DASH(3) }, 'gray', { stroke: true })
  ],
  almendra: [
    s('path', { d: leaflet(116, 36, 140, 34, 10) }, 'green'),
    s('path', { d: drop(64, 96, 22) + drop(108, 100, 18) }, 'brown', { accent: true }),
    s('path', { d: drop(84, 128, 12) }, 'tan'),
    s('path', { d: 'M56 70q-4 20 2 36M70 66q4 22 0 40M102 82q-3 16 1 28M114 80q3 16-1 30', ...SW(2) }, 'tan', { stroke: true })
  ],
  alojar: [
    ground(),
    s('rect', { x: 62, y: 78, width: 72, height: 58 }, 'brown'),
    s('path', { d: 'M54 82l44-36 44 36z' }, 'red'),
    s('rect', { x: 88, y: 104, width: 18, height: 32, rx: 2 }, 'tan'),
    s('rect', { x: 114, y: 92, width: 12, height: 12 }, 'yellow'),
    ...person(32, 136, 'blue', { h: 40, w: 26, r: 11 }),
    s('rect', { x: 44, y: 112, width: 18, height: 22, rx: 3 }, 'orange', { accent: true })
  ],
  anuario: [
    s('rect', { x: 32, y: 16, width: 96, height: 128, rx: 6 }, 'navy', { accent: true }),
    s('path', { d: 'M40 16v128', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: dots([[64, 42], [86, 42], [108, 42], [64, 76], [86, 76], [108, 76], [64, 110], [86, 110], [108, 110]], 6) }, 'skin'),
    s('path', { d: busts([64, 86, 108], 64, 16, 12) + busts([64, 86, 108], 98, 16, 12) + busts([64, 86, 108], 132, 16, 12) }, 'yellow')
  ],
  apodar: [
    ground(),
    ...person(48, 136, 'green'),
    s('rect', { x: 38, y: 100, width: 20, height: 14, rx: 2 }, 'red'),
    s('rect', { x: 41, y: 105, width: 14, height: 6 }, 'white'),
    ...person(122, 136, 'orange', { accent: true }),
    s('path', { d: 'M108 102L76 96', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: bubble(84, 14, 60, 42) }, 'cream'),
    s('path', { d: star(114, 34, 12) }, 'yellow')
  ],
  asturiano: [
    s('path', { d: 'M14 136q30-40 60-20t72-30V146H14z' }, 'green'),
    s('path', { d: 'M44 20h12v18q10 6 10 18v40H34V56q0-12 10-18z', transform: 'rotate(120 50 58)' }, 'green', { accent: true }),
    s('path', { d: 'M80 74q2 26 2 44', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M66 110h32l-4 30H70z' }, 'yellow'),
    s('path', { d: 'M66 110h32l-4 30H70z', ...SW(3) }, 'gray', { stroke: true })
  ],
  'atmosférico': [
    backdrop('navy'),
    s('circle', { cx: 80, cy: 80, r: 58 }, 'sky'),
    s('circle', { cx: 80, cy: 80, r: 46 }, 'mint'),
    s('circle', { cx: 80, cy: 80, r: 36 }, 'blue', { accent: true }),
    s('path', { d: 'M56 66q12-12 24-2q4 14-10 18q-14-2-14-16zM88 90q14-4 18 10q-6 12-18 6z' }, 'green'),
    s('path', { d: ells([[48, 34, 12, 5], [118, 120, 12, 5]]) }, 'white')
  ],
  braga: [
    s('path', { d: 'M14 36q66 20 132 0', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M42 52h76v14q-20 8-28 44h-20q-8-36-28-44z' }, 'pink', { accent: true }),
    s('path', { d: 'M42 54h76', ...SW(6) }, 'purple', { stroke: true }),
    s('path', { d: rects([[50, 38, 6, 18], [104, 38, 6, 18]]) }, 'tan'),
    s('path', { d: 'M80 62l-6-5v10zM80 62l6-5v10z' }, 'red')
  ],
  camilla: [
    s('path', { d: 'M38 104v24M122 104v24', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: dots([[38, 132], [122, 132]], 6) }, 'dark'),
    s('path', { d: 'M14 98h132', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 26, y: 92, width: 108, height: 12, rx: 4 }, 'mint'),
    s('circle', { cx: 42, cy: 80, r: 12 }, 'skin'),
    s('rect', { x: 56, y: 74, width: 74, height: 20, rx: 8 }, 'sky', { accent: true }),
    s('path', { d: 'M86 34v24M74 46h24', ...SW(8, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true })
  ],
  camping: [
    ground(),
    s('path', { d: 'M18 136L62 48l44 88z' }, 'orange', { accent: true }),
    s('path', { d: 'M62 136l-12-44h24z' }, 'dark'),
    s('path', { d: 'M62 48l-6-10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M110 136l30-10M110 126l30 10', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: drop(125, 120, 10) }, 'red'),
    s('path', { d: drop(125, 124, 5) }, 'yellow'),
    s('path', { d: 'M122 30a14 14 0 1 0 14 18a12 12 0 0 1-14-18z' }, 'yellow')
  ],
  canalla: [
    ...face(80, 94, 40, 'skin', 'smile'),
    s('path', { d: 'M58 80l14 4M102 80l-14 4', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 104q-14-10-26-2q4 8 14 4M80 104q14-10 26-2q-4 8-14 4', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 56, y: 16, width: 48, height: 40 }, 'dark'),
    s('rect', { x: 42, y: 52, width: 76, height: 9, rx: 3 }, 'dark'),
    s('rect', { x: 56, y: 42, width: 48, height: 9 }, 'red', { accent: true })
  ],
  chido: [
    ...face(66, 76, 46, 'yellow', 'smile'),
    s('path', { d: 'M34 62h64v8q0 14-14 14h-6q-8 0-10-12q-2 12-10 12h-6q-14 0-14-14zM28 62h6M98 62h6' }, 'black', { accent: true }),
    s('rect', { x: 106, y: 108, width: 30, height: 32, rx: 6 }, 'skin'),
    s('path', { d: 'M112 110V86q0-8 7-8t7 8v22z' }, 'skin'),
    s('path', { d: sparkle(130, 30, 10) }, 'orange')
  ],
  coleccionista: [
    s('rect', { x: 18, y: 22, width: 98, height: 98, rx: 6 }, 'brown'),
    s('rect', { x: 26, y: 30, width: 82, height: 82, rx: 2 }, 'cream'),
    s('path', { d: rects([[34, 38, 18, 18], [82, 38, 18, 18], [58, 62, 18, 18], [34, 86, 18, 18], [82, 86, 18, 18]]) }, 'sky'),
    s('path', { d: rects([[58, 38, 18, 18], [34, 62, 18, 18], [82, 62, 18, 18], [58, 86, 18, 18]]) }, 'red', { accent: true }),
    s('path', { d: ring(116, 106, 20), ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M130 120l14 14', ...SW(10) }, 'dark', { stroke: true })
  ],
  colectivamente: [
    s('rect', { x: 14, y: 48, width: 132, height: 16, rx: 8 }, 'brown', { accent: true }),
    s('path', { d: 'M30 94V62M42 94V62M74 94V62M86 94V62M118 94V62M130 94V62', ...SW(5) }, 'skin', { stroke: true }),
    ...person(36, 136, 'blue'),
    ...person(80, 136, 'green'),
    ...person(124, 136, 'orange')
  ],
  compendio: [
    s('path', { d: 'M110 28l14 8v100l-14-6z' }, 'cream'),
    s('path', { d: 'M114 40v86M118 42v86', ...SW(1.5) }, 'tan', { stroke: true }),
    s('rect', { x: 34, y: 24, width: 78, height: 108, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M56 130v16M68 130v12', ...SW(4) }, 'yellow', { stroke: true }),
    s('rect', { x: 102, y: 68, width: 16, height: 20, rx: 3 }, 'yellow'),
    s('path', { d: 'M48 40h48v24H48z', ...SW(3) }, 'yellow', { stroke: true })
  ],
  concesionario: [
    s('path', { d: 'M14 28h132l-8 22H22z' }, 'red'),
    s('path', { d: 'M40 28l-3 22M66 28v22M94 28v22M120 28l3 22', ...SW(7, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    ground(126),
    ...car(42, 98, 'blue', 'sky', { accent: true }),
    s('path', { d: 'M110 66h22v16h-22l-8-8z' }, 'yellow'),
    s('path', { d: sparkle(32, 76, 8) }, 'orange')
  ],
  'congestión': [
    backdrop('gray'),
    ...car(18, 56, 'red'),
    ...car(84, 56, 'blue', 'sky', { accent: true }),
    ...car(50, 108, 'yellow')
  ],
  'contraposición': [
    s('rect', { x: 20, y: 40, width: 60, height: 80 }, 'dark', { accent: true }),
    s('rect', { x: 80, y: 40, width: 60, height: 80 }, 'white'),
    outline({ x: 20, y: 40, width: 120, height: 80 }, 'dark'),
    s('path', { d: 'M30 80h34M52 68l12 12-12 12', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M130 80H96M108 68l-12 12 12 12', ...SW(6) }, 'dark', { stroke: true })
  ],
  'cráter': [
    backdrop('navy'),
    s('path', { d: dots([[34, 34], [120, 28], [80, 44], [136, 62]], 2.5) }, 'yellow'),
    s('path', { d: 'M14 84q66-16 132 0V146H14z' }, 'gray'),
    s('ellipse', { cx: 80, cy: 110, rx: 48, ry: 18 }, 'tan'),
    s('ellipse', { cx: 80, cy: 114, rx: 38, ry: 12 }, 'dark', { accent: true }),
    s('ellipse', { cx: 128, cy: 134, rx: 12, ry: 4 }, 'dark')
  ],
  'cóctel': [
    s('path', { d: 'M46 42h68L80 78z' }, 'orange', { accent: true }),
    s('path', { d: 'M36 34h88L80 82zM80 82v46M58 130h44', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 32l-16 30', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M90 26a20 14 0 0 1 40 0z' }, 'pink'),
    s('circle', { cx: 66, cy: 46, r: 7 }, 'red')
  ],
  'cómodamente': [
    s('rect', { x: 26, y: 54, width: 108, height: 50, rx: 14 }, 'orange'),
    s('rect', { x: 26, y: 96, width: 108, height: 24, rx: 6 }, 'tan'),
    s('path', { d: rects([[16, 82, 22, 42], [122, 82, 22, 42]]) + 'M30 124h10v12H30zM120 124h10v12h-10z' }, 'brown'),
    s('circle', { cx: 50, cy: 74, r: 12 }, 'skin'),
    s('rect', { x: 46, y: 84, width: 54, height: 18, rx: 8 }, 'blue', { accent: true }),
    s('path', { d: 'M96 92l30-4', ...SW(9) }, 'blue', { stroke: true }),
    s('path', { d: 'M44 72q4 3 8 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  debilitar: [
    arrow('M80 14v28M68 30l12 12 12-12', 'gray', 5),
    s('rect', { x: 24, y: 56, width: 100, height: 54, rx: 8 }, 'white'),
    s('rect', { x: 24, y: 56, width: 100, height: 54, rx: 8, ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 124, y: 72, width: 10, height: 22, rx: 2 }, 'dark'),
    s('rect', { x: 32, y: 64, width: 18, height: 38, rx: 3 }, 'red', { accent: true })
  ],
  decorar: [
    backdrop('cream'),
    s('path', { d: 'M14 28q66 34 132 0', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: qpts([14, 28], [80, 62], [146, 28], 5).filter((_, i) => i % 2 === 0).map(([x, y]) => `M${x - 8} ${y}h16l-8 16z`).join('') }, 'red', { accent: true }),
    s('path', { d: qpts([14, 28], [80, 62], [146, 28], 5).filter((_, i) => i % 2).map(([x, y]) => `M${x - 8} ${y}h16l-8 16z`).join('') }, 'blue'),
    s('path', { d: 'M54 106q4 14 0 32M104 98q-4 18 0 40', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: ells([[54, 90, 15, 18]]) }, 'pink'),
    s('path', { d: ells([[104, 82, 15, 18]]) }, 'yellow')
  ],
  'deformación': [
    s('rect', { x: 16, y: 58, width: 44, height: 44, rx: 2 }, 'blue'),
    arrow('M66 80h22M80 72l8 8-8 8', 'gray', 5),
    s('rect', { x: 100, y: 58, width: 44, height: 44, rx: 2, ...DASH(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M98 66q22-20 44 0q10 22-8 40q-26 12-36-8q-10-14 0-32z' }, 'orange', { accent: true })
  ],
  depredador: [
    backdrop('blue'),
    s('path', { d: 'M28 86l-14-20v40z' }, 'gray'),
    s('path', { d: 'M62 72l10-26 16 24z' }, 'gray'),
    s('ellipse', { cx: 72, cy: 86, rx: 52, ry: 19 }, 'gray', { accent: true }),
    s('path', { d: 'M96 94q12 4 24-2l-24-4z' }, 'white'),
    s('path', { d: dots([[106, 80]], 3) }, 'dark'),
    s('path', { d: fishes([[134, 56]]) }, 'orange')
  ],
  desperdiciar: [
    s('path', { d: 'M44 66h72l-8 72H52z' }, 'gray'),
    s('path', { d: 'M66 78l2 50M80 78v50M94 78l-2 50', ...SW(3) }, 'white', { stroke: true }),
    s('rect', { x: 34, y: 54, width: 92, height: 10, rx: 4, transform: 'rotate(-14 34 64)' }, 'dark'),
    s('circle', { cx: 66, cy: 64, r: 13 }, 'red', { accent: true }),
    s('ellipse', { cx: 98, cy: 62, rx: 17, ry: 10 }, 'tan'),
    s('path', { d: 'M66 50q2-8 8-10', ...SW(3) }, 'green', { stroke: true })
  ],
  desplazar: [
    ground(),
    s('rect', { x: 88, y: 84, width: 52, height: 52, rx: 3 }, 'tan', { accent: true }),
    s('path', { d: 'M88 100h52', ...SW(3) }, 'brown', { stroke: true }),
    ...lean(44, 136, 30, 'blue'),
    s('path', { d: 'M68 100h20', ...SW(6) }, 'skin', { stroke: true }),
    arrow('M92 64h40M122 54l10 10-10 10', 'orange', 6)
  ],
  destructor: [
    backdrop('sky'),
    s('path', { d: 'M70 58V34M62 42h16', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: rects([[54, 72, 36, 26], [64, 58, 14, 14], [96, 84, 26, 14]]) }, 'gray'),
    s('path', { d: 'M120 88l18-8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M16 96h128l-14 24H32z' }, 'dark', { accent: true }),
    s('path', { d: 'M14 114q16-6 33 0t33 0t33 0t33 0V146H14z' }, 'blue')
  ],
  'diversificación': [
    s('path', { d: 'M18 100q14-40 28 0M66 100q14-40 28 0M114 100q14-40 28 0', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: ells([[32, 96, 9, 12], [80, 96, 9, 12], [128, 96, 9, 12]]) }, 'cream'),
    s('path', { d: ells([[32, 96, 9, 12], [80, 96, 9, 12], [128, 96, 9, 12]]), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 100h36l-5 32H19zM62 100h36l-5 32H67zM110 100h36l-5 32h-26z' }, 'tan', { accent: true }),
    s('path', { d: 'M16 112h32M64 112h32M112 112h32', ...SW(2) }, 'brown', { stroke: true }),
    arrow('M80 26v24M50 30l-14 16M110 30l14 16', 'orange', 4)
  ],
  enclave: [
    backdrop('sky'),
    s('path', { d: 'M24 40q40-24 80-8q40 10 36 60q-4 44-60 46q-52 0-60-40q-6-34 4-58z' }, 'green'),
    s('path', { d: 'M66 70q20-12 32 4q8 22-12 28q-22 4-24-14q-2-12 4-18z' }, 'orange', { accent: true }),
    s('path', { d: 'M66 70q20-12 32 4q8 22-12 28q-22 4-24-14q-2-12 4-18z', ...DASH(2.5, '4 4') }, 'dark', { stroke: true })
  ],
  enfatizar: [
    ...paper(20, 26, 96, 108),
    s('rect', { x: 28, y: 68, width: 82, height: 16 }, 'yellow'),
    s('path', { d: 'M32 48h72M32 76h72M32 104h50', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 112, y: 70, width: 20, height: 58, rx: 4, transform: 'rotate(-35 122 99)' }, 'yellow', { accent: true }),
    s('path', { d: 'M104 82l6 4', ...SW(8) }, 'orange', { stroke: true })
  ],
  erario: [
    backdrop('sky'),
    s('path', { d: 'M20 52l60-32 60 32z' }, 'tan'),
    s('path', { d: rects([[28, 58, 12, 56], [50, 58, 12, 56], [98, 58, 12, 56], [120, 58, 12, 56]]) }, 'cream'),
    s('rect', { x: 20, y: 114, width: 120, height: 12 }, 'gray'),
    s('path', { d: ells([[80, 106, 14, 5], [80, 98, 14, 5], [80, 90, 14, 5], [80, 82, 14, 5]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M66 106v-24M94 106v-24', ...SW(2) }, 'orange', { stroke: true })
  ],
  escondite: [
    ground(),
    s('circle', { cx: 100, cy: 92, r: 11 }, 'skin'),
    s('path', { d: dots([[104, 90]], 2.5) }, 'dark'),
    s('rect', { x: 62, y: 60, width: 32, height: 76, rx: 4 }, 'brown'),
    s('circle', { cx: 78, cy: 46, r: 34 }, 'green', { accent: true }),
    s('path', { d: 'M92 102h6M92 108h6', ...SW(4) }, 'skin', { stroke: true })
  ],
  familiarizar: [
    ground(),
    ...person(44, 136, 'purple', { accent: true }),
    s('path', { d: 'M58 100l24 8', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M104 120v16M128 120v16M138 106l8-10', ...SW(5) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 116, cy: 112, rx: 22, ry: 12 }, 'brown'),
    s('circle', { cx: 96, cy: 102, r: 10 }, 'brown'),
    s('path', { d: 'M98 94l6-8 4 10z' }, 'dark'),
    s('path', { d: heart(92, 70, 8) }, 'pink')
  ],
  fertilizante: [
    ground(),
    s('path', { d: 'M30 50q22-8 44 0l6 86H24z' }, 'tan', { accent: true }),
    s('path', { d: 'M36 56h40', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(52, 112, -60, 26, 8) }, 'green'),
    s('path', { d: dots([[92, 128], [100, 120], [88, 116], [96, 132]], 3) }, 'gray'),
    s('path', { d: 'M118 136V90', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(118, 108, -150, 26, 8) + leaflet(118, 96, -30, 28, 9) }, 'green')
  ],
  finar: [
    backdrop('navy'),
    s('ellipse', { cx: 80, cy: 136, rx: 36, ry: 7 }, 'tan'),
    s('rect', { x: 64, y: 76, width: 32, height: 60, rx: 3 }, 'cream'),
    s('path', { d: 'M80 76v-8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 64q-12-10 0-20t0-22', ...SW(4) }, 'gray', { stroke: true, accent: true })
  ],
  foral: [
    s('rect', { x: 40, y: 30, width: 80, height: 96 }, 'cream'),
    s('path', { d: rects([[34, 22, 92, 14], [34, 120, 92, 14]]) }, 'tan'),
    s('path', { d: 'M52 50h56M52 64h56M52 78h40', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M94 112l-6 22M106 112l6 22', ...SW(5) }, 'red', { stroke: true }),
    s('circle', { cx: 100, cy: 102, r: 14 }, 'red', { accent: true }),
    s('path', { d: star(100, 102, 7) }, 'orange')
  ],
  franciscano: [
    ground(),
    s('path', { d: 'M56 52q0-36 24-36t24 36z' }, 'brown'),
    s('path', { d: 'M60 60h40l16 76H44z' }, 'brown', { accent: true }),
    s('circle', { cx: 80, cy: 46, r: 15 }, 'skin'),
    s('path', { d: 'M56 90h48M88 90v34', ...SW(4) }, 'cream', { stroke: true }),
    s('circle', { cx: 80, cy: 84, r: 7 }, 'skin')
  ],
  frescura: [
    s('path', { d: leaflet(32, 128, -50, 112, 32) }, 'green', { accent: true }),
    s('path', { d: 'M32 128L102 44', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: drop(60, 76, 6) + drop(84, 92, 5) }, 'sky'),
    s('path', { d: 'M104 100h32M112 116h26M98 132h30', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: sparkle(126, 40, 12) }, 'blue')
  ],
  hambriento: [
    ...face(80, 62, 44, 'yellow', 'flat', { accent: true }),
    s('ellipse', { cx: 80, cy: 82, rx: 16, ry: 12 }, 'dark'),
    s('path', { d: drop(98, 98, 4) }, 'sky'),
    s('path', { d: 'M40 116v30M34 116v12M46 116v12M34 128h12M120 146v-30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M120 116q12 4 10 20h-10z' }, 'gray')
  ],
  hueva: [
    s('path', { d: fishes([[90, 30]]) }, 'sky'),
    s('ellipse', { cx: 80, cy: 104, rx: 60, ry: 28 }, 'white'),
    s('ellipse', { cx: 80, cy: 104, rx: 60, ry: 28, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[64, 96], [78, 92], [92, 96], [70, 108], [84, 106], [98, 108], [56, 106], [106, 100], [78, 118], [92, 118], [64, 118]], 7) }, 'orange', { accent: true }),
    s('path', { d: dots([[62, 94], [76, 90], [90, 94], [68, 106], [82, 104], [96, 106]], 2) }, 'white')
  ],
  impensable: [
    ...person(36, 136, 'blue'),
    s('path', { d: dots([[52, 62], [60, 52]], 4) }, 'gray'),
    s('path', { d: ells([[98, 44, 46, 30], [76, 36, 20, 18], [122, 32, 20, 18]]) }, 'sky'),
    s('path', { d: 'M88 56v10M106 56v10', ...SW(4) }, 'pink', { stroke: true }),
    s('ellipse', { cx: 98, cy: 46, rx: 22, ry: 13 }, 'pink', { accent: true }),
    s('path', { d: 'M94 38q-10-18 12-16q-2 10-6 16z' }, 'white'),
    s('path', { d: dots([[118, 46]], 5) }, 'red')
  ],
  influenciar: [
    ...person(40, 136, 'red', { accent: true, h: 52, w: 34, r: 14 }),
    s('path', { d: 'M66 66q8 10 0 20M76 58q14 18 0 36M86 50q20 26 0 52', ...SW(4) }, 'orange', { stroke: true }),
    ...person(110, 136, 'gray', { h: 32, w: 22, r: 9 }),
    ...person(136, 136, 'gray', { h: 32, w: 20, r: 9 })
  ],
  ingenuidad: [
    s('circle', { cx: 68, cy: 74, r: 46 }, 'skin', { accent: true }),
    s('path', { d: 'M40 40q28-24 56 0q-14-8-28-6q-14-2-28 6z' }, 'brown'),
    s('path', { d: dots([[52, 70], [84, 70]], 9) }, 'dark'),
    s('path', { d: dots([[55, 66], [87, 66]], 3) + 'M58 92q10 10 20 0' }, 'white'),
    s('path', { d: 'M56 94q12 10 24 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[40, 88], [96, 88]], 6) }, 'pink'),
    s('path', { d: 'M128 146V102', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots(around(128, 92, 11, 6), 7) }, 'pink'),
    s('circle', { cx: 128, cy: 92, r: 6 }, 'yellow')
  ],
  intermitente: [
    s('rect', { x: 40, y: 40, width: 80, height: 30, rx: 8 }, 'sky'),
    s('rect', { x: 24, y: 60, width: 112, height: 50, rx: 12 }, 'red'),
    s('path', { d: 'M32 110h20v14H32zM108 110h20v14h-20z' }, 'dark'),
    s('rect', { x: 30, y: 72, width: 24, height: 14, rx: 4 }, 'orange', { accent: true }),
    s('rect', { x: 106, y: 72, width: 24, height: 14, rx: 4 }, 'gray'),
    s('path', { d: 'M24 70l-8-6M22 80h-8M24 90l-8 6', ...SW(4) }, 'yellow', { stroke: true }),
    arrow('M60 26H28M38 16l-10 10 10 10', 'orange', 5)
  ],
  'júbilo': [
    s('path', { d: rects([[24, 30, 6, 10], [128, 40, 6, 10], [40, 100, 6, 10], [120, 96, 6, 10]]) }, 'pink'),
    s('path', { d: rects([[36, 54, 10, 6], [110, 22, 10, 6], [128, 70, 10, 6], [24, 76, 10, 6]]) }, 'blue'),
    s('path', { d: 'M68 80L52 46M92 80l16-34', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M72 116l-10 16M88 116l10 16', ...SW(7) }, 'orange', { stroke: true }),
    ...person(80, 118, 'orange', { accent: true }),
    s('path', { d: 'M75 64q5 4 10 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  limosna: [
    s('path', { d: 'M48 94h60l-6 42H54z' }, 'tan'),
    s('path', { d: 'M40 136h76', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: dots([[70, 100], [86, 100]], 7) }, 'yellow'),
    s('path', { d: 'M96 26h30q8 0 8 8v4q0 8-8 8H96z' }, 'skin'),
    s('circle', { cx: 86, cy: 66, r: 11 }, 'yellow', { accent: true }),
    s('path', { d: 'M86 42v8', ...SW(3) }, 'gray', { stroke: true })
  ],
  lujuria: [
    backdrop('purple'),
    s('path', { d: heart(38, 40, 9) + heart(124, 34, 11) + heart(126, 124, 7) }, 'pink'),
    s('path', { d: 'M24 84q28-32 56-14q28-18 56 14q-28 42-56 42t-56-42z' }, 'red', { accent: true }),
    s('path', { d: 'M28 84q52 12 104 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  objetivamente: [
    s('path', { d: 'M24 26v104h112', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: rects([[36, 92, 16, 38], [60, 72, 16, 58], [84, 56, 16, 74], [108, 82, 16, 48]]) }, 'blue'),
    s('path', { d: ring(96, 58, 22), ...SW(6) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M112 74l20 20', ...SW(9) }, 'dark', { stroke: true })
  ],
  pepa: [
    s('path', { d: 'M80 18q30 0 36 52q8 68-36 68t-36-68q6-52 36-52z' }, 'green'),
    s('path', { d: 'M80 28q22 0 27 44q6 56-27 56t-27-56q5-44 27-44z' }, 'mint'),
    s('circle', { cx: 80, cy: 98, r: 20 }, 'brown', { accent: true }),
    s('circle', { cx: 74, cy: 92, r: 5 }, 'tan')
  ],
  piojo: [
    s('circle', { cx: 74, cy: 74, r: 52 }, 'cream'),
    s('path', { d: 'M62 80l-14-8M62 92h-16M62 104l-14 8M86 80l14-8M86 92h16M86 104l14 8', ...SW(3) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 74, cy: 92, rx: 14, ry: 22 }, 'tan', { accent: true }),
    s('circle', { cx: 74, cy: 62, r: 9 }, 'brown'),
    s('path', { d: ring(74, 74, 52), ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M112 112l28 28', ...SW(12) }, 'dark', { stroke: true })
  ],
  pisco: [
    s('path', { d: 'M54 82h36v52H54z' }, 'cream'),
    s('path', { d: 'M64 14h16v22q14 8 14 22v80H50V58q0-14 14-22z', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 64, y: 10, width: 16, height: 10, rx: 2 }, 'brown'),
    s('rect', { x: 54, y: 92, width: 36, height: 24 }, 'yellow'),
    s('path', { d: dots([[116, 96], [130, 96], [108, 110], [122, 110], [136, 110], [116, 124], [130, 124], [123, 138]], 7) }, 'purple', { accent: true }),
    s('path', { d: leaflet(122, 88, -60, 20, 7) }, 'green')
  ],
  planilla: [
    s('rect', { x: 34, y: 20, width: 92, height: 124, rx: 6 }, 'brown'),
    s('rect', { x: 42, y: 34, width: 76, height: 102, rx: 2 }, 'white'),
    s('rect', { x: 62, y: 14, width: 36, height: 14, rx: 4 }, 'gray'),
    s('path', { d: rects([[50, 48, 12, 12], [50, 76, 12, 12], [50, 104, 12, 12]]), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 54l4 4 6-9M52 82l4 4 6-9', ...SW(3) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M70 54h40M70 82h40M70 110h40', ...SW(4) }, 'gray', { stroke: true })
  ],
  'polígono': [
    s('path', { d: poly(around(80, 80, 60, 6, -90)) }, 'blue', { accent: true }),
    s('path', { d: poly(around(80, 84, 30, 5, -90)) }, 'yellow'),
    s('path', { d: dots(around(80, 80, 60, 6, -90), 6) }, 'orange')
  ],
  practicante: [
    ground(),
    ...person(58, 136, 'mint', { accent: true }),
    s('path', { d: 'M50 92l8 14 8-14', ...SW(3) }, 'red', { stroke: true }),
    s('rect', { x: 52, y: 104, width: 12, height: 10, rx: 1 }, 'white'),
    s('path', { d: 'M72 104h20', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 88, y: 102, width: 42, height: 5, rx: 2 }, 'gray'),
    s('path', { d: 'M92 84h14l-2 18H94zM112 84h14l-2 18h-10z' }, 'brown'),
    s('path', { d: 'M99 78v-10M119 78v-10', ...SW(2) }, 'gray', { stroke: true })
  ],
  precursor: [
    ...person(30, 136, 'gray', { h: 30, w: 20, r: 9 }),
    ...person(58, 136, 'gray', { h: 30, w: 20, r: 9 }),
    ...person(100, 136, 'red', { accent: true }),
    s('path', { d: 'M118 136V28M114 100h4', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M118 30l26 10-26 10z' }, 'yellow')
  ],
  predecible: [
    ground(),
    arrow('M30 40h96M114 30l12 10-12 10', 'orange', 5),
    s('rect', { x: 26, y: 80, width: 14, height: 56, rx: 2, transform: 'rotate(30 40 136)' }, 'dark', { accent: true }),
    s('path', { d: rects([[56, 80, 14, 56], [84, 80, 14, 56], [112, 80, 14, 56]]) }, 'dark'),
    s('path', { d: dots([[63, 94], [63, 120], [91, 94], [91, 120], [119, 94], [119, 120]], 3) }, 'white')
  ],
  'próstata': [
    backdrop('cream'),
    s('path', { d: 'M50 36q-20-10-30 4M110 36q20-10 30 4', ...SW(5) }, 'pink', { stroke: true }),
    s('path', { d: 'M80 26q40 0 40 40q0 30-28 40H68q-28-10-28-40q0-40 40-40z' }, 'tan'),
    s('path', { d: 'M80 106v38', ...SW(6) }, 'pink', { stroke: true }),
    s('ellipse', { cx: 80, cy: 114, rx: 24, ry: 13 }, 'red', { accent: true })
  ],
  'purificación': [
    s('path', { d: drop(80, 36, 12) }, 'brown'),
    s('path', { d: 'M36 58h88l-28 32v10H64V90z' }, 'gray', { accent: true }),
    s('path', { d: 'M44 66h72M52 76h56', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: drop(80, 128, 12) }, 'blue'),
    s('path', { d: sparkle(110, 118, 9) + sparkle(50, 124, 6) }, 'yellow')
  ],
  rebajar: [
    s('path', { d: 'M22 72L64 30h42v42L64 114z' }, 'yellow', { accent: true }),
    s('circle', { cx: 92, cy: 44, r: 6 }, 'white'),
    s('path', { d: 'M92 44q16-18 36-10', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M50 72l20-20M58 80l20-20', ...SW(4) }, 'orange', { stroke: true }),
    arrow('M124 70v62M110 118l14 14 14-14', 'red', 8)
  ],
  regresivo: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'sky'),
    s('path', { d: ring(80, 80, 62), ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M80 52v56L42 80zM120 52v56L82 80z' }, 'navy', { accent: true })
  ],
  'remoción': [
    ground(),
    s('ellipse', { cx: 80, cy: 136, rx: 22, ry: 5 }, 'dark'),
    s('path', { d: 'M80 108q-4 10-12 14M80 108q4 12 12 16M80 108v20', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 108V54', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 56, -130, 26, 8) + leaflet(80, 52, -50, 26, 8) }, 'green'),
    s('path', { d: 'M92 74h46', ...SW(12) }, 'skin', { stroke: true }),
    s('rect', { x: 68, y: 64, width: 28, height: 22, rx: 8 }, 'skin', { accent: true }),
    arrow('M126 54V22M116 32l10-10 10 10', 'orange', 5)
  ],
  remordimiento: [
    s('path', { d: heart(76, 104, 34) }, 'red', { accent: true }),
    s('path', { d: dots([[126, 64], [124, 82], [116, 48]], 11) }, 'white'),
    s('path', { d: dots([[62, 80], [88, 80]], 4) }, 'dark'),
    s('path', { d: 'M62 102q13-10 26 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: drop(58, 94, 4) }, 'sky')
  ],
  retornar: [
    ground(),
    s('path', { d: 'M14 92l32-32 32 32z' }, 'red'),
    s('rect', { x: 22, y: 88, width: 48, height: 48 }, 'tan'),
    s('rect', { x: 40, y: 110, width: 12, height: 26 }, 'brown'),
    ...person(120, 136, 'blue', { accent: true }),
    arrow('M120 58V46q0-18-18-18H72q-14 0-14 14v6M50 40l8 10 8-10', 'orange', 5)
  ],
  rodeo: [
    ...horse('orange', 'brown', { accent: true }),
    s('rect', { x: 66, y: 42, width: 20, height: 28, rx: 6 }, 'red'),
    s('circle', { cx: 76, cy: 32, r: 9 }, 'skin'),
    s('path', { d: 'M62 26h28M68 26q8-14 16 0z', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M84 46q-20-20-36-18' + ring(36, 24, 12), ...SW(3) }, 'tan', { stroke: true })
  ],
  ruleta: [
    s('circle', { cx: 80, cy: 80, r: 64 }, 'brown'),
    s('path', { d: Array.from({ length: 6 }, (_, i) => wedge(80, 80, 54, i * 60, i * 60 + 30)).join('') }, 'red', { accent: true }),
    s('path', { d: Array.from({ length: 6 }, (_, i) => wedge(80, 80, 54, i * 60 + 30, i * 60 + 60)).join('') }, 'black'),
    s('circle', { cx: 80, cy: 80, r: 20 }, 'green'),
    s('circle', { cx: 80, cy: 80, r: 7 }, 'yellow'),
    s('circle', { cx: 80, cy: 34, r: 5 }, 'white')
  ],
  salmo: [
    s('path', { d: 'M68 46v60M80 46v64M92 46v60', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M50 36q-12 54 30 74q42-20 30-74', ...SW(8) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M48 46h64', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 62, y: 108, width: 36, height: 14, rx: 3 }, 'brown'),
    ...note(128, 60, 'blue').map(x => ({ ...x, accent: false })),
    s('path', { d: sparkle(30, 112, 8) }, 'orange')
  ],
  sauce: [
    s('ellipse', { cx: 80, cy: 138, rx: 62, ry: 8 }, 'blue'),
    s('path', { d: 'M74 136q4-40-2-84h14q-4 44 4 84z' }, 'brown'),
    s('circle', { cx: 80, cy: 54, r: 38 }, 'mint'),
    s('path', { d: 'M44 58q-4 34 2 66M56 44q-6 40 0 76M68 36q-4 46 0 80M92 36q4 46 0 80M104 44q6 40 0 76M116 58q4 34-2 66', ...SW(4) }, 'green', { stroke: true, accent: true })
  ],
  'semántica': [
    s('path', { d: bubble(16, 30, 74, 54) }, 'white'),
    s('path', { d: bubble(16, 30, 74, 54), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 48h50M28 62h34', ...SW(5) }, 'dark', { stroke: true }),
    arrow('M96 60h14M104 52l8 8-8 8', 'orange', 4),
    s('circle', { cx: 130, cy: 56, r: 15 }, 'yellow', { accent: true }),
    s('rect', { x: 124, y: 70, width: 12, height: 9, rx: 2 }, 'gray')
  ],
  sensacional: [
    s('path', { d: burst(80, 82, 62, 40, 12) }, 'yellow'),
    s('path', { d: star(80, 84, 32) }, 'orange', { accent: true }),
    s('path', { d: sparkle(28, 26, 10) + sparkle(134, 132, 9) }, 'pink'),
    s('path', { d: sparkle(136, 28, 7) + sparkle(24, 134, 7) }, 'blue')
  ],
  sensualidad: [
    s('rect', { x: 28, y: 74, width: 54, height: 64, rx: 14 }, 'pink', { accent: true }),
    s('rect', { x: 46, y: 60, width: 18, height: 16 }, 'gray'),
    s('rect', { x: 42, y: 44, width: 26, height: 18, rx: 4 }, 'purple'),
    s('path', { d: 'M114 80v58', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(114, 112, -150, 22, 7) }, 'green'),
    s('circle', { cx: 114, cy: 62, r: 20 }, 'red'),
    s('path', { d: 'M114 62a6 6 0 1 1 6 6a12 12 0 0 1-14-12', ...SW(2) }, 'dark', { stroke: true })
  ],
  servidumbre: [
    backdrop('sky'),
    s('path', { d: 'M14 70h40v-8h8v8h12v-8h8v8h8v-8h8v8h18v76H14z' }, 'gray'),
    s('rect', { x: 52, y: 92, width: 18, height: 28, rx: 9 }, 'dark'),
    s('path', { d: 'M14 120q66-14 132 0V146H14z' }, 'green'),
    ...person(118, 132, 'brown', { accent: true, h: 30, w: 22, r: 9 }),
    s('path', { d: 'M108 106l-22 26M86 132l-8-4', ...SW(4) }, 'dark', { stroke: true })
  ],
  siervo: [
    ground(),
    ...person(58, 136, 'navy'),
    s('path', { d: 'M72 102l20-8', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M86 94h46', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M94 92a15 13 0 0 1 30 0z' }, 'yellow', { accent: true }),
    s('path', { d: 'M109 78v-4', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M44 104l10 14', ...SW(5) }, 'white', { stroke: true })
  ],
  simposio: [
    s('rect', { x: 30, y: 14, width: 100, height: 42, rx: 3 }, 'sky'),
    s('path', { d: 'M44 44l16-10 14 6 18-14 22 8', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: dots([[44, 76], [80, 76], [116, 76]], 10) }, 'skin'),
    s('path', { d: busts([44, 80, 116], 104, 26, 22) }, 'blue'),
    s('path', { d: 'M56 102l6-10M92 102l6-10M128 102l6-10', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 18, y: 100, width: 124, height: 20, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: 'M28 120v20M132 120v20', ...SW(5) }, 'brown', { stroke: true })
  ],
  'sinvergüenza': [
    s('circle', { cx: 80, cy: 80, r: 58 }, 'yellow', { accent: true }),
    s('path', { d: dots([[60, 66]], 7) }, 'dark'),
    s('path', { d: 'M88 66q12-10 24 0M54 94q26 22 52 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M68 102q12 36 24 0z' }, 'red')
  ],
  soplar: [
    s('circle', { cx: 42, cy: 80, r: 28 }, 'skin'),
    s('circle', { cx: 56, cy: 88, r: 10 }, 'pink'),
    s('path', { d: dots([[46, 72]], 3) }, 'dark'),
    s('ellipse', { cx: 70, cy: 88, rx: 5, ry: 4 }, 'red'),
    s('path', { d: 'M80 74h22M80 88h28M80 102h20', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: 'M126 76v62', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M126 76V54l14 14zM126 76h22l-14 14zM126 76v22l-14-14zM126 76h-22l14-14z' }, 'orange', { accent: true })
  ],
  subconsciente: [
    backdrop('navy'),
    s('rect', { x: 14, y: 14, width: 132, height: 52, rx: 12 }, 'sky'),
    s('path', { d: 'M48 66h60l18 32-22 40H58L34 100z' }, 'mint', { accent: true }),
    s('path', { d: 'M62 66l14-28 10 10 10 18z' }, 'white'),
    s('path', { d: 'M14 66h132', ...SW(3) }, 'white', { stroke: true })
  ],
  sudoeste: [
    s('path', { d: 'M20 32l40-10 40 10 40-10v106l-40 10-40-10-40 10z' }, 'cream'),
    s('path', { d: 'M20 32l40-10 40 10 40-10v106l-40 10-40-10-40 10zM60 22v106M100 32v106', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M96 66L54 98', ...DASH(4, '6 6') }, 'orange', { stroke: true }),
    s('path', { d: 'M46 120l-10-16a12 12 0 1 1 20 0z' }, 'red', { accent: true }),
    s('circle', { cx: 46, cy: 98, r: 4 }, 'white'),
    s('circle', { cx: 100, cy: 64, r: 6 }, 'blue')
  ],
  sustentar: [
    s('path', { d: 'M18 108q10 34 62 34t62-34q-10-6-20 0q-12 10-42 10t-42-10q-10-6-20 0z' }, 'skin', { accent: true }),
    s('path', { d: 'M46 72l34-30 34 30z' }, 'red'),
    s('rect', { x: 54, y: 70, width: 52, height: 42 }, 'tan'),
    s('rect', { x: 74, y: 88, width: 12, height: 24 }, 'brown')
  ],
  timo: [
    s('rect', { x: 14, y: 96, width: 132, height: 40, rx: 8 }, 'green'),
    arrow('M40 46q40-26 80 0M112 36l8 10-12 4', 'orange', 4),
    s('path', { d: 'M20 104l6-40h28l6 40zM66 104l6-40h28l6 40zM100 104l6-40h28l6 40z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 120, r: 7 }, 'yellow')
  ],
  torso: [
    backdrop('purple'),
    s('path', { d: 'M46 30q34-14 68 0l-4 22q-4 30-12 50l6 26H56l6-26q-8-20-12-50z' }, 'cream', { accent: true }),
    s('path', { d: 'M62 58q18 8 36 0M80 66v36', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 46, y: 128, width: 68, height: 14, rx: 2 }, 'gray')
  ],
  transexual: [
    backdrop('sky'),
    s('path', { d: rects([[14, 40, 132, 27], [14, 93, 132, 27]]) }, 'pink'),
    s('rect', { x: 14, y: 67, width: 132, height: 26 }, 'white'),
    ...person(80, 140, 'purple', { accent: true }),
    s('path', { d: 'M74 82q6 5 12 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  transitar: [
    backdrop('dark'),
    s('path', { d: rects([[22, 94, 14, 48], [46, 94, 14, 48], [70, 94, 14, 48], [94, 94, 14, 48], [118, 94, 14, 48]]) }, 'white'),
    s('path', { d: 'M74 110l-12 22M86 110l12 22', ...SW(7) }, 'orange', { stroke: true }),
    ...person(80, 112, 'orange', { accent: true }),
    s('path', { d: 'M66 80l-10 16M94 80l10 16', ...SW(6) }, 'skin', { stroke: true })
  ],
};
