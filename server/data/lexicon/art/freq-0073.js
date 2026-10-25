// Illustration specs for words still undrawn in batches 0071–0073 (see server/scripts/lexicon/art.js)
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
  trascendental: [
    ground(),
    s('path', { d: burst(80, 62, 50, 30, 12) }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 62, r: 22 }, 'orange'),
    s('path', { d: 'M26 136l30-34 22 24 18-16 38 26z' }, 'gray'),
    ...person(36, 136, 'blue', { h: 24, w: 16, r: 7 })
  ],
  uniformado: [
    ground(),
    s('circle', { cx: 80, cy: 64, r: 14 }, 'skin'),
    s('rect', { x: 58, y: 80, width: 44, height: 56, rx: 12 }, 'navy'),
    s('path', { d: 'M64 54q16-18 32 0z' }, 'navy'),
    s('path', { d: 'M60 54h40', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 80v56', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: star(68, 96, 8) }, 'yellow', { accent: true }),
    s('path', { d: 'M58 128h44', ...SW(5, { 'stroke-linecap': 'butt' }) }, 'dark', { stroke: true })
  ],
  validar: [
    ground(),
    s('rect', { x: 26, y: 66, width: 42, height: 70, rx: 6 }, 'gray'),
    s('rect', { x: 68, y: 92, width: 50, height: 10, rx: 4 }, 'yellow'),
    s('rect', { x: 34, y: 74, width: 26, height: 6, rx: 2 }, 'dark'),
    s('rect', { x: 39, y: 46, width: 16, height: 32, rx: 3 }, 'blue'),
    s('circle', { cx: 112, cy: 52, r: 26 }, 'green', { accent: true }),
    s('path', { d: 'M100 52l9 9 16-18', ...SW(7) }, 'white', { stroke: true })
  ],
  'óptico': [
    s('path', { d: 'M80 20v16M46 30l9 13M114 30l-9 13', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M18 92q62-60 124 0q-62 60-124 0z' }, 'white'),
    s('path', { d: 'M18 92q62-60 124 0q-62 60-124 0z', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 92, r: 25 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 92, r: 11 }, 'dark'),
    s('circle', { cx: 87, cy: 85, r: 5 }, 'white')
  ],
  abrumador: [
    ground(),
    ...person(80, 136, 'green', { h: 32, w: 28, r: 11 }),
    s('path', { d: 'M68 108L60 76M92 108l8-32', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 46, y: 46, width: 68, height: 30, rx: 3 }, 'tan'),
    s('rect', { x: 32, y: 14, width: 96, height: 32, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: drop(116, 92, 4) + drop(44, 98, 4) }, 'sky')
  ],
  acelerador: [
    s('path', { d: 'M24 100a56 56 0 0 1 112 0', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'green', { stroke: true }),
    s('path', { d: 'M110 52a56 56 0 0 1 26 48', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M80 100l42-34', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 100, r: 8 }, 'dark'),
    s('rect', { x: 56, y: 116, width: 48, height: 26, rx: 6, transform: 'rotate(-12 80 129)' }, 'gray'),
    s('path', { d: 'M64 124l32-6M66 134l32-6', ...SW(3) }, 'dark', { stroke: true })
  ],
  acopio: [
    ground(),
    s('path', { d: rects([[20, 104, 30, 32], [50, 104, 30, 32], [80, 104, 30, 32], [110, 104, 30, 32]]) }, 'brown'),
    s('path', { d: rects([[35, 72, 30, 32], [65, 72, 30, 32], [95, 72, 30, 32]]) }, 'tan', { accent: true }),
    s('path', { d: rects([[50, 40, 30, 32], [80, 40, 30, 32]]) }, 'brown'),
    s('path', { d: 'M20 120h120M35 88h90M50 56h60', ...SW(2) }, 'dark', { stroke: true }),
    arrow('M18 34l18 14M142 34l-18 14', 'orange', 5)
  ],
  adyacente: [
    ground(),
    s('rect', { x: 26, y: 76, width: 54, height: 60 }, 'yellow'),
    s('rect', { x: 80, y: 76, width: 54, height: 60 }, 'sky'),
    s('path', { d: 'M20 78l33-30 33 30zM74 78l33-30 33 30z' }, 'red'),
    s('path', { d: rects([[46, 108, 14, 28], [100, 108, 14, 28]]) }, 'brown'),
    s('path', { d: 'M80 70v66', ...SW(6) }, 'orange', { stroke: true, accent: true })
  ],
  'aeronáutica': [
    backdrop('sky'),
    s('path', { d: ells([[38, 122, 20, 10], [56, 116, 16, 12], [116, 40, 18, 9], [130, 36, 12, 9]]) }, 'white'),
    s('path', { d: jet(80, 80), transform: 'translate(80 80) scale(2.6) translate(-80 -80)' }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 50, r: 4 }, 'navy')
  ],
  altavoz: [
    s('rect', { x: 30, y: 22, width: 66, height: 116, rx: 10 }, 'dark'),
    s('circle', { cx: 63, cy: 54, r: 14 }, 'gray'),
    s('circle', { cx: 63, cy: 102, r: 24 }, 'gray'),
    s('circle', { cx: 63, cy: 102, r: 9 }, 'dark'),
    s('path', { d: 'M108 64q12 18 0 36M122 50q22 32 0 64', ...SW(6) }, 'blue', { stroke: true, accent: true })
  ],
  amnesia: [
    ...face(56, 108, 30, 'skin', 'flat'),
    s('path', { d: dots([[84, 74], [94, 64]], 4) }, 'gray'),
    s('path', { d: ells([[112, 40, 32, 24]]) }, 'white'),
    s('path', { d: ring(112, 40, 28), transform: 'translate(112 40) scale(1.15 0.86) translate(-112 -40)', ...DASH(4) }, 'gray', { stroke: true }),
    s('rect', { x: 98, y: 30, width: 26, height: 14, rx: 3, transform: 'rotate(-25 111 37)' }, 'pink', { accent: true })
  ],
  apasionar: [
    s('path', { d: 'M40 100q-14-36 6-70q4 22 16 28q0-28 18-46q18 18 18 46q12-6 16-28q20 34 6 70z' }, 'orange'),
    s('path', { d: 'M56 100q-6-22 6-38q4 14 18 16q14-2 18-16q12 16 6 38z' }, 'yellow'),
    s('path', { d: heart(80, 112, 28) }, 'red', { accent: true })
  ],
  arribo: [
    s('rect', { x: 14, y: 116, width: 132, height: 22, rx: 4 }, 'dark'),
    s('path', { d: 'M22 127h16M54 127h16M86 127h16M118 127h16', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M-8 2l-16 26h12l26-26z', transform: 'translate(76 62) rotate(18)' }, 'navy'),
    s('ellipse', { cx: 0, cy: 0, rx: 44, ry: 10, transform: 'translate(76 62) rotate(18)' }, 'blue', { accent: true }),
    s('path', { d: 'M-42-4l-10-22h12l16 22z', transform: 'translate(76 62) rotate(18)' }, 'navy'),
    arrow('M124 30v40M114 60l10 10 10-10', 'orange', 5)
  ],
  asentado: [
    ground(),
    s('rect', { x: 34, y: 66, width: 92, height: 60, rx: 14 }, 'red', { accent: true }),
    s('rect', { x: 46, y: 96, width: 68, height: 20, rx: 6 }, 'pink'),
    s('path', { d: 'M42 126v10M118 126v10', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 58, r: 13 }, 'skin'),
    s('rect', { x: 66, y: 72, width: 28, height: 30, rx: 9 }, 'blue'),
    s('path', { d: 'M72 102h22v24', ...SW(9) }, 'navy', { stroke: true })
  ],
  'brújula': [
    s('circle', { cx: 80, cy: 82, r: 60 }, 'brown'),
    s('circle', { cx: 80, cy: 82, r: 50 }, 'cream'),
    s('rect', { x: 72, y: 12, width: 16, height: 12, rx: 4 }, 'brown'),
    s('path', { d: rays(80, 82, 40, 48, 8), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 40l10 42H70z' }, 'red', { accent: true }),
    s('path', { d: 'M80 124l10-42H70z' }, 'navy'),
    s('circle', { cx: 80, cy: 82, r: 5 }, 'dark')
  ],
  'bélico': [
    s('path', { d: 'M38 34l78 92M122 34l-78 92', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 98l16 2-2 16M60 98l-16 2 2 16', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 36l34 12v30q0 30-34 46q-34-16-34-46V48z' }, 'red', { accent: true }),
    s('path', { d: 'M80 52l18 6v18q0 18-18 28q-18-10-18-28V58z' }, 'yellow')
  ],
  caballito: [
    ...scaled(horse('tan', 'brown', { accent: true }), 0.78, 18, 8),
    s('path', { d: 'M26 110q54 28 112 0', ...SW(8) }, 'red', { stroke: true }),
    s('circle', { cx: 120, cy: 44, r: 3 }, 'dark')
  ],
  calavera: [
    backdrop('purple'),
    s('circle', { cx: 80, cy: 70, r: 44 }, 'white'),
    s('rect', { x: 56, y: 92, width: 48, height: 36, rx: 10 }, 'white'),
    s('path', { d: dots([[62, 74], [98, 74]], 12) }, 'dark', { accent: true }),
    s('path', { d: 'M80 88l-7 12h14z' }, 'dark'),
    s('path', { d: 'M68 114v14M80 114v14M92 114v14', ...SW(3) }, 'gray', { stroke: true })
  ],
  callo: [
    s('path', { d: 'M56 146q-18-40-8-82q8-30 34-32q28 2 30 32q2 30-12 50q-4 32-44 32z' }, 'skin'),
    s('path', { d: dots([[54, 26], [70, 18], [86, 16], [101, 20], [114, 30]], 7) }, 'skin'),
    s('ellipse', { cx: 84, cy: 66, rx: 18, ry: 13 }, 'yellow', { accent: true }),
    s('path', { d: 'M74 62l8 4M86 60l6 6M80 72l10-2', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M38 34l10 10M128 46l-10 6M30 70h12', ...SW(4) }, 'orange', { stroke: true })
  ],
  camionero: [
    ground(),
    s('rect', { x: 16, y: 54, width: 82, height: 64, rx: 4 }, 'orange'),
    s('path', { d: 'M100 118V72h22l20 22v24z' }, 'red', { accent: true }),
    s('path', { d: 'M106 90V78h14l12 12z' }, 'sky'),
    s('circle', { cx: 116, cy: 84, r: 6 }, 'skin'),
    s('path', { d: dots([[38, 122], [70, 122], [124, 122]], 12) }, 'dark')
  ],
  capucha: [
    s('path', { d: 'M28 146q0-36 26-42h52q26 6 26 42z' }, 'green'),
    s('path', { d: 'M38 116q-12-86 42-88q54 2 42 88q-20 10-42 10t-42-10z' }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 84, r: 26 }, 'skin'),
    s('path', { d: 'M54 72q26-22 52 0', ...SW(6) }, 'mint', { stroke: true }),
    s('path', { d: drop(26, 40, 4) + drop(136, 52, 4) + drop(132, 104, 4) + drop(24, 90, 4) }, 'sky')
  ],
  carente: [
    s('path', { d: rects([[30, 30, 50, 50], [80, 80, 50, 50]]) }, 'blue'),
    s('rect', { x: 80, y: 30, width: 50, height: 50 }, 'yellow', { accent: true }),
    s('rect', { x: 30, y: 80, width: 50, height: 50, ...DASH(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 55, r: 8 }, 'yellow'),
    s('circle', { cx: 105, cy: 80, r: 8 }, 'blue')
  ],
  'caserío': [
    s('path', { d: 'M14 140q66-24 132 0z' }, 'green'),
    s('path', { d: rects([[22, 98, 32, 34], [62, 80, 38, 50], [108, 100, 30, 32]]) }, 'tan'),
    s('path', { d: 'M17 100l21-20 21 20zM57 82l24-24 24 24zM103 102l20-18 20 18z' }, 'red', { accent: true }),
    s('path', { d: rects([[33, 114, 10, 18], [75, 108, 12, 22], [118, 116, 10, 16]]) }, 'brown'),
    s('path', { d: 'M38 46q6-8 12 0M86 30q6-8 12 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  centralizado: [
    s('path', { d: rays(80, 80, 20, 52, 6, -90), ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: dots(around(80, 80, 56, 6, -90), 12) }, 'blue'),
    s('circle', { cx: 80, cy: 80, r: 24 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 10 }, 'white')
  ],
  cofundador: [
    ground(),
    s('path', { d: 'M56 96L74 58M104 96L86 58', ...SW(7) }, 'skin', { stroke: true }),
    ...person(44, 136, 'blue'),
    ...person(116, 136, 'green'),
    s('rect', { x: 72, y: 46, width: 16, height: 12, rx: 3 }, 'gray'),
    s('circle', { cx: 80, cy: 32, r: 18 }, 'yellow', { accent: true }),
    s('path', { d: halfRays(80, 32, 24, 32, 5), ...SW(4) }, 'orange', { stroke: true })
  ],
  coloquial: [
    ground(),
    ...person(44, 136, 'orange', { h: 40 }),
    ...person(116, 136, 'purple', { h: 40 }),
    s('path', { d: bubble(16, 16, 56, 38) }, 'sky', { accent: true }),
    s('path', { d: 'M88 16h48a8 8 0 0 1 8 8v22a8 8 0 0 1-8 8h-6v12l-12-12H88a8 8 0 0 1-8-8V24a8 8 0 0 1 8-8z' }, 'yellow'),
    s('path', { d: 'M26 34q6-6 12 0t12 0t12 0M90 34q6-6 12 0t12 0t12 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  'conjunción': [
    s('circle', { cx: 58, cy: 80, r: 42 }, 'sky'),
    s('circle', { cx: 102, cy: 80, r: 42 }, 'yellow'),
    s('path', { d: 'M80 44.1a42 42 0 0 1 0 71.8a42 42 0 0 1 0-71.8z' }, 'green', { accent: true }),
    s('path', { d: ring(58, 80, 42) + ring(102, 80, 42), ...SW(3) }, 'dark', { stroke: true })
  ],
  cuadrilla: [
    ground(),
    ...person(36, 136, 'orange', { h: 40, w: 26, r: 11 }),
    ...person(80, 136, 'orange', { h: 40, w: 26, r: 11, accent: true }),
    ...person(124, 136, 'orange', { h: 40, w: 26, r: 11 }),
    s('path', { d: [36, 80, 124].map(x => `M${x - 14} 82a14 13 0 0 1 28 0z`).join('') }, 'yellow'),
    s('path', { d: 'M26 112h20M70 112h20M114 112h20', ...SW(4) }, 'yellow', { stroke: true }),
  ],
  'céntimo': [
    s('circle', { cx: 58, cy: 70, r: 40 }, 'yellow'),
    s('circle', { cx: 58, cy: 70, r: 32, ...SW(3) }, 'orange', { stroke: true }),
    s('circle', { cx: 110, cy: 112, r: 22 }, 'brown', { accent: true }),
    s('circle', { cx: 110, cy: 112, r: 16, ...SW(3) }, 'tan', { stroke: true }),
    arrow('M92 56q30 2 22 32M106 80l8 8 6-10', 'gray', 4)
  ],
  'cóndor': [
    s('path', { d: 'M14 140l38-52 22 26 24-34 48 60z' }, 'gray'),
    s('path', { d: 'M80 62q-30-14-66 0q18 10 28 8q-6 10 4 12q16-6 34-14zM80 62q30-14 66 0q-18 10-28 8q6 10-4 12q-16-6-34-14z' }, 'black', { accent: true }),
    s('ellipse', { cx: 80, cy: 72, rx: 12, ry: 18 }, 'black'),
    s('ellipse', { cx: 80, cy: 54, rx: 11, ry: 5 }, 'white'),
    s('circle', { cx: 80, cy: 44, r: 8 }, 'pink'),
    s('path', { d: 'M76 48l4 8 4-8z' }, 'yellow')
  ],
  deidad: [
    s('path', { d: rays(80, 70, 40, 62, 12), ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 44, r: 20, ...SW(4) }, 'orange', { stroke: true }),
    ...person(80, 116, 'white', { h: 46, w: 34, r: 13 }),
    s('rect', { x: 63, y: 70, width: 34, height: 46, rx: 11, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[48, 124, 26, 14], [80, 128, 28, 14], [112, 124, 26, 14]]) }, 'sky', { accent: true })
  ],
  deprisa: [
    ground(),
    s('path', { d: 'M74 110l-18 26M86 108l14 28', ...SW(8) }, 'navy', { stroke: true }),
    ...lean(80, 112, 22, 'red', { h: 40, accent: true }),
    s('path', { d: 'M92 82l18 6M70 84l-16 10', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M16 64h26M22 82h22M16 100h26', ...SW(5) }, 'gray', { stroke: true })
  ],
  desahucio: [
    ground(),
    s('rect', { x: 18, y: 66, width: 64, height: 70 }, 'tan'),
    s('path', { d: 'M12 68l38-36 38 36z' }, 'brown'),
    s('rect', { x: 40, y: 98, width: 20, height: 38 }, 'dark'),
    arrow('M64 90h36M92 82l8 8-8 8', 'red', 5),
    ...person(122, 136, 'blue', { h: 38, w: 24, r: 10 }),
    s('rect', { x: 102, y: 112, width: 22, height: 18, rx: 3 }, 'orange', { accent: true })
  ],
  digestivo: [
    s('path', { d: 'M70 14v24', ...SW(10) }, 'pink', { stroke: true }),
    s('path', { d: 'M62 34q-6 28 14 40q30 10 46-6q14-20-4-40q-14-10-28 4q-10 12-16 2z' }, 'pink', { accent: true }),
    s('path', { d: 'M102 82q4 18-14 28q-24 6-26 22q0 12 20 12h40', ...SW(10) }, 'red', { stroke: true }),
    s('path', { d: dots([[88, 54], [102, 50]], 5) }, 'yellow')
  ],
  disidencia: [
    s('path', { d: fishes([[44, 46], [44, 80], [44, 114], [92, 46], [92, 114]]) }, 'orange'),
    s('ellipse', { cx: 106, cy: 80, rx: 14, ry: 9 }, 'blue', { accent: true }),
    s('path', { d: 'M118 80l12-9v18z' }, 'blue'),
    s('path', { d: dots([[98, 78], [36, 44], [36, 78], [36, 112], [84, 44], [84, 112]], 2) }, 'dark')
  ],
  durazno: [
    s('path', { d: 'M80 34q-4-14 4-22', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(84, 30, -20, 40, 12) }, 'green'),
    s('circle', { cx: 80, cy: 90, r: 52 }, 'orange', { accent: true }),
    s('path', { d: 'M80 40q-20 50 0 102', ...SW(4) }, 'red', { stroke: true }),
    s('ellipse', { cx: 104, cy: 82, rx: 16, ry: 24 }, 'pink')
  ],
  eficazmente: [
    s('circle', { cx: 74, cy: 84, r: 54 }, 'red'),
    s('circle', { cx: 74, cy: 84, r: 38 }, 'white'),
    s('circle', { cx: 74, cy: 84, r: 22 }, 'red'),
    s('circle', { cx: 74, cy: 84, r: 8 }, 'white'),
    s('path', { d: 'M74 84l56-56', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M124 26l14-6-4 14zM120 22l8-8M134 36l8-8', ...SW(4) }, 'orange', { stroke: true, accent: true })
  ],
  'electrodoméstico': [
    ground(),
    s('rect', { x: 20, y: 22, width: 54, height: 114, rx: 6 }, 'sky'),
    s('path', { d: 'M20 62h54M30 34v18M30 74v24', ...SW(4) }, 'blue', { stroke: true }),
    s('rect', { x: 82, y: 62, width: 60, height: 74, rx: 6 }, 'white'),
    outline({ x: 82, y: 62, width: 60, height: 74, rx: 6 }),
    s('circle', { cx: 112, cy: 104, r: 19 }, 'navy', { accent: true }),
    s('circle', { cx: 112, cy: 104, r: 11 }, 'sky')
  ],
  'electrón': [
    s('path', { d: ells([[80, 80, 62, 22]]), transform: 'rotate(30 80 80)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[80, 80, 62, 22]]), transform: 'rotate(-30 80 80)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[74, 76], [86, 76], [80, 86]], 8) }, 'red'),
    s('circle', { cx: 134, cy: 111, r: 11 }, 'blue', { accent: true }),
    s('path', { d: 'M114 128l-8 6M118 132l-6 8', ...SW(3) }, 'sky', { stroke: true })
  ],
  ensayar: [
    s('rect', { x: 14, y: 14, width: 132, height: 122 }, 'navy'),
    s('path', { d: 'M14 14h34q-6 60 6 122H14zM146 14h-34q6 60-6 122h40z' }, 'red', { accent: true }),
    s('rect', { x: 14, y: 128, width: 132, height: 14 }, 'brown'),
    ...person(80, 128, 'yellow', { h: 40, w: 26, r: 11 }),
    ...paper(88, 86, 22, 28)
  ],
  entramado: [
    s('rect', { x: 22, y: 22, width: 116, height: 116 }, 'cream'),
    s('path', { d: 'M22 22h116v116H22zM22 80h116M80 22v116', ...SW(8) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M22 22l58 58M138 22L80 80M22 138l58-58M138 138L80 80', ...SW(6) }, 'brown', { stroke: true })
  ],
  entretener: [
    ground(),
    ...person(80, 136, 'purple', { h: 40 }),
    s('path', { d: 'M68 108L48 84M92 108l20-24', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M46 78q34-80 68 0', ...DASH(3, '4 6') }, 'gray', { stroke: true }),
    s('circle', { cx: 52, cy: 46, r: 9 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 22, r: 9 }, 'yellow'),
    s('circle', { cx: 108, cy: 46, r: 9 }, 'blue')
  ],
  esquizofrenia: [
    s('path', { d: 'M80 22a58 58 0 0 0 0 116l-10-14 12-14-12-16 12-16-12-16 12-14-12-14z' }, 'purple', { accent: true }),
    s('path', { d: 'M86 22a58 58 0 0 1 0 116l-10-14 12-14-12-16 12-16-12-16 12-14-12-14z' }, 'sky'),
    s('circle', { cx: 52, cy: 70, r: 7 }, 'white'),
    s('circle', { cx: 114, cy: 70, r: 7 }, 'navy'),
    s('path', { d: 'M44 104q10-8 20 0M106 100q10 8 20 0', ...SW(4) }, 'dark', { stroke: true })
  ],
  estadista: [
    s('path', { d: ells([[80, 70, 44, 44]]) }, 'sky'),
    s('path', { d: 'M54 48q14 6 10 18q-12 2-14 14q-8-6-6-20zM92 40q20 0 24 18q-12 14-22 6q4-12-2-24zM84 92q14-4 18 12q-6 10-16 6z' }, 'green'),
    s('circle', { cx: 80, cy: 82, r: 12 }, 'skin'),
    s('rect', { x: 62, y: 96, width: 36, height: 40, rx: 12 }, 'navy'),
    s('path', { d: 'M80 98l-4 8 4 14 4-14z' }, 'red', { accent: true }),
    s('rect', { x: 50, y: 116, width: 60, height: 26, rx: 4 }, 'brown')
  ],
  estirar: [
    ground(),
    ...person(80, 136, 'green', { h: 44 }),
    s('path', { d: 'M68 98L36 70M92 98l32-28', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M36 70q44 14 88 0', ...SW(4) }, 'red', { stroke: true, accent: true }),
    arrow('M30 52l-12-8M18 44l10-2M18 44l2 10M130 52l12-8M142 44l-10-2M142 44l-2 10', 'orange', 4)
  ],
  'evangélico': [
    backdrop('sky'),
    s('path', { d: halfRays(80, 84, 30, 62, 7), ...SW(5) }, 'yellow', { stroke: true }),
    ...openBook(80, 74, 'white', 'purple'),
    s('path', { d: 'M38 96h30M38 108h30M92 96h30M92 108h30', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: heart(80, 40, 12) }, 'red', { accent: true })
  ],
  extraordinariamente: [
    s('path', { d: dots([[22, 30], [44, 128], [136, 124], [140, 40], [24, 96], [120, 18], [98, 140], [30, 62]], 6) }, 'gray'),
    s('path', { d: burst(80, 80, 62, 50, 16) }, 'yellow'),
    s('path', { d: star(80, 82, 44) }, 'orange', { accent: true }),
    s('path', { d: sparkle(126, 76, 12) + sparkle(36, 40, 9) }, 'pink')
  ],
  'facturación': [
    s('path', { d: 'M36 16h76v124l-9-8-9 8-10-8-9 8-10-8-9 8-10-8-10 8z' }, 'white'),
    s('path', { d: 'M36 16h76v124l-9-8-9 8-10-8-9 8-10-8-9 8-10-8-10 8z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 36h52M48 52h40M48 68h52M48 84h36', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 106h30', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: ells([[124, 122, 16, 6], [124, 112, 16, 6], [124, 102, 16, 6]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M108 102v20M140 102v20', ...SW(2) }, 'orange', { stroke: true })
  ],
  fiabilidad: [
    s('path', { d: 'M62 96l-14 46 16-8 10 14 8-48zM98 96l14 46-16-8-10 14-8-48z' }, 'red'),
    s('circle', { cx: 80, cy: 70, r: 46 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 70, r: 34 }, 'sky'),
    s('path', { d: 'M62 70l12 12 24-26', ...SW(9) }, 'white', { stroke: true })
  ],
  'filología': [
    s('rect', { x: 26, y: 26, width: 82, height: 100 }, 'cream'),
    s('path', { d: 'M20 26h94M20 126h94', ...SW(12) }, 'tan', { stroke: true }),
    s('path', { d: 'M38 46h56M38 60h46M38 74h56M38 88h40', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 100, cy: 94, r: 22 }, 'sky'),
    s('circle', { cx: 100, cy: 94, r: 22, ...SW(6) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M116 110l22 22', ...SW(9) }, 'navy', { stroke: true })
  ],
  francotirador: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'dark'),
    s('circle', { cx: 80, cy: 80, r: 54 }, 'mint'),
    s('path', { d: 'M26 104q30-14 54-6t54-8v30H26z' }, 'green'),
    s('circle', { cx: 80, cy: 80, r: 32, ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M26 80h40M94 80h40M80 26v40M80 94v40', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 5 }, 'red', { accent: true })
  ],
  gaseosa: [
    s('rect', { x: 70, y: 14, width: 20, height: 10, rx: 2 }, 'red'),
    s('path', { d: 'M72 24h16v18q16 12 16 34v58q0 6-6 6H62q-6 0-6-6V76q0-22 16-34z' }, 'green', { accent: true }),
    s('rect', { x: 56, y: 82, width: 48, height: 30 }, 'yellow'),
    s('path', { d: dots([[72, 60], [84, 52], [80, 70]], 3) + dots([[124, 50], [116, 30], [132, 70]], 5) + dots([[34, 60], [28, 38]], 4) }, 'sky')
  ],
  honradez: [
    ground(),
    ...person(44, 136, 'blue', { h: 46 }),
    ...person(118, 136, 'orange', { h: 40, w: 28, r: 11 }),
    s('path', { d: 'M56 100l22 0M106 104l-14 0', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 74, y: 92, width: 22, height: 16, rx: 3 }, 'brown'),
    s('path', { d: heart(82, 50, 16) }, 'red', { accent: true })
  ],
  impactar: [
    s('rect', { x: 106, y: 14, width: 30, height: 132 }, 'gray'),
    s('path', { d: 'M106 30h30M106 58h30M106 86h30M106 114h30M120 14v16M120 58v28M120 114v32', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: burst(100, 80, 40, 18, 10) }, 'yellow'),
    s('circle', { cx: 82, cy: 80, r: 22 }, 'red', { accent: true }),
    s('path', { d: 'M20 66h30M14 82h32M20 98h30', ...SW(5) }, 'orange', { stroke: true })
  ],
  inducir: [
    ground(),
    s('path', { d: rects([[50, 82, 12, 54], [80, 82, 12, 54], [110, 82, 12, 54]]) }, 'navy'),
    s('rect', { x: 22, y: 82, width: 12, height: 54, transform: 'rotate(30 34 136)' }, 'red', { accent: true }),
    arrow('M14 60q14-18 34-6M40 46l8 8-10 4', 'orange', 4),
    s('path', { d: dots([[56, 110], [86, 110], [116, 110]], 3) }, 'white')
  ],
  latido: [
    s('path', { d: heart(80, 66, 30) }, 'red', { accent: true }),
    s('path', { d: 'M14 116h38l8-14 10 32 10-44 10 26h56', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M36 40l-8-6M124 40l8-6M140 64h6M20 64h-6', ...SW(4) }, 'pink', { stroke: true })
  ],
  legumbre: [
    s('path', { d: 'M18 106q40-52 124-66q-6 50-62 70q-36 12-62-4z' }, 'green', { accent: true }),
    s('path', { d: 'M28 102q46-20 104-54q-26 52-60 58q-26 4-44-4z' }, 'mint'),
    s('path', { d: dots([[46, 96], [68, 88], [90, 76], [112, 62]], 11) }, 'green'),
    s('path', { d: 'M142 40q4-12 0-22', ...SW(4) }, 'green', { stroke: true })
  ],
  libertario: [
    s('path', { d: 'M24 64q30-40 60 0v72H24z' }, 'cream'),
    s('path', { d: 'M24 64q30-40 60 0v72H24zM36 52v84M54 44v92M72 52v84', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M84 136l40-30', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M54 36v-10', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 48q10-22 26-8q8-14 24-8q-12 4-14 16q-4 12-20 10q-12 0-16-10z' }, 'blue', { accent: true }),
    s('path', { d: birds([[110, 76], [134, 90]]), ...SW(3) }, 'sky', { stroke: true })
  ],
  lira: [
    s('path', { d: 'M48 128q-26-50-8-104M112 128q26-50 8-104', ...SW(10) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M44 36h72', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M62 40v86M74 40v88M86 40v88M98 40v86', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M44 124q36 20 72 0v10H44z' }, 'brown')
  ],
  manguera: [
    s('circle', { cx: 60, cy: 92, r: 38, ...SW(10) }, 'green', { stroke: true, accent: true }),
    s('circle', { cx: 60, cy: 92, r: 22, ...SW(10) }, 'green', { stroke: true }),
    s('path', { d: 'M98 92q8-40 30-54', ...SW(10) }, 'green', { stroke: true }),
    s('rect', { x: 118, y: 26, width: 14, height: 18, rx: 3, transform: 'rotate(40 125 35)' }, 'yellow'),
    s('path', { d: drop(140, 22, 4) + drop(146, 38, 3) + drop(132, 14, 3) }, 'blue')
  ],
  maximizar: [
    s('path', { d: 'M18 138h124', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[24, 112, 22, 26], [52, 92, 22, 46], [80, 68, 22, 70]]) }, 'sky'),
    s('rect', { x: 108, y: 40, width: 22, height: 98 }, 'blue', { accent: true }),
    s('path', { d: star(119, 22, 12) }, 'yellow'),
    arrow('M26 92L88 40M70 38h18v18', 'orange', 5)
  ],
  mecer: [
    s('path', { d: 'M28 128q52 22 104 0', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M34 70h92v34q0 20-20 20H54q-20 0-20-20z' }, 'pink', { accent: true }),
    s('path', { d: 'M34 70q0-36 40-36v36z' }, 'red'),
    s('circle', { cx: 92, cy: 64, r: 12 }, 'skin'),
    s('path', { d: 'M74 70h52', ...SW(6) }, 'cream', { stroke: true }),
    s('path', { d: 'M18 98q-6-14 2-28M142 98q6-14-2-28', ...SW(4) }, 'gray', { stroke: true })
  ],
  moco: [
    ...face(76, 74, 50, 'skin', 'frown'),
    s('ellipse', { cx: 76, cy: 84, rx: 9, ry: 7 }, 'pink'),
    s('path', { d: 'M70 90q-4 14 2 22q8 2 6-10', ...SW(6) }, 'mint', { stroke: true }),
    s('path', { d: drop(72, 120, 6) }, 'green', { accent: true }),
    s('rect', { x: 112, y: 104, width: 32, height: 32, rx: 3, transform: 'rotate(-12 128 120)' }, 'white'),
    outline({ x: 112, y: 104, width: 32, height: 32, rx: 3, transform: 'rotate(-12 128 120)' })
  ],
  'navideño': [
    s('rect', { x: 72, y: 124, width: 16, height: 18 }, 'brown'),
    s('path', { d: 'M80 30l30 36H94l26 30h-16l26 30H30l26-30H40l26-30H50z' }, 'green'),
    s('path', { d: star(80, 26, 16) }, 'yellow', { accent: true }),
    s('path', { d: dots([[72, 60], [96, 84], [62, 96], [104, 116], [56, 118], [82, 108]], 5) }, 'red'),
    s('path', { d: 'M58 76q22 10 40 0M48 104q32 12 64 0', ...SW(3) }, 'yellow', { stroke: true })
  ],
  neutralizar: [
    s('path', { d: 'M46 72h68v52q0 16-16 16H62q-16 0-16-16z' }, 'mint'),
    s('path', { d: 'M40 56h80M46 56v68q0 16 16 16h36q16 0 16-16V56', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: drop(46, 30, 9) }, 'red'),
    s('path', { d: drop(114, 30, 9) }, 'blue'),
    s('path', { d: 'M66 100l10 10 20-22', ...SW(6) }, 'green', { stroke: true, accent: true })
  ],
  nexo: [
    s('rect', { x: 18, y: 58, width: 70, height: 44, rx: 22, transform: 'rotate(-20 53 80)', ...SW(10) }, 'gray', { stroke: true }),
    s('rect', { x: 72, y: 58, width: 70, height: 44, rx: 22, transform: 'rotate(-20 107 80)', ...SW(10) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M68 64q8 6 10 18', transform: 'rotate(-20 80 80)', ...SW(10) }, 'gray', { stroke: true })
  ],
  nomenclatura: [
    s('path', { d: 'M38 30h20v30l18 52q4 20-14 20H34q-18 0-14-20l18-52z' }, 'sky'),
    s('path', { d: 'M24 104h48l4 8q4 20-14 20H34q-18 0-14-20z' }, 'blue'),
    s('path', { d: 'M100 30h20v100h-20z' }, 'mint'),
    s('path', { d: 'M100 92h20v38h-20z' }, 'green'),
    s('path', { d: 'M58 52l18 8M120 48l14 8', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M74 56h22l8 10-8 10H74zM132 52h14v30h-14z' }, 'yellow', { accent: true })
  ],
  normativo: [
    ...paper(28, 16, 80, 110),
    s('path', { d: 'M40 36l5 5 9-9M40 62l5 5 9-9M40 88l5 5 9-9', ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M62 38h34M62 64h34M62 90h34', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 50, y: 116, width: 96, height: 22, rx: 3, transform: 'rotate(-12 98 127)' }, 'yellow'),
    s('path', { d: 'M60 126v-8M72 124v-12M84 122v-8M96 120v-12M108 118v-8M120 116v-12M132 114v-8', transform: 'rotate(-12 98 127) translate(0 4)', ...SW(2) }, 'dark', { stroke: true })
  ],
  ofrecimiento: [
    ground(),
    ...person(48, 136, 'blue', { h: 46 }),
    s('path', { d: 'M60 102h30', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 86, y: 76, width: 46, height: 36, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M109 76v36M86 94h46', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M109 76q-14-16-18-4q4 6 18 4q14-16 18-4q-4 6-18 4z' }, 'yellow')
  ],
  padrastro: [
    ground(),
    ...person(58, 136, 'navy', { h: 56, w: 34, r: 14 }),
    ...person(110, 136, 'yellow', { h: 30, w: 22, r: 10, accent: true }),
    s('path', { d: 'M74 106q14 10 26 4', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(86, 30, 12) }, 'pink')
  ],
  pantera: [
    s('path', { d: 'M128 86q24-6 16-36', ...SW(7) }, 'black', { stroke: true }),
    s('path', { d: 'M48 104v32M60 106v30M106 104v32M118 102v34', ...SW(9) }, 'black', { stroke: true }),
    s('ellipse', { cx: 84, cy: 92, rx: 46, ry: 20 }, 'black', { accent: true }),
    s('circle', { cx: 40, cy: 72, r: 20 }, 'black'),
    s('path', { d: 'M24 60l2-16 12 8zM44 52l10-12 4 16z' }, 'black'),
    s('path', { d: ells([[32, 70, 4, 3], [48, 70, 4, 3]]) }, 'yellow')
  ],
  'paracaídas': [
    s('path', { d: 'M18 64q0-50 62-50t62 50q-10-8-20 0q-10-8-21 0q-10-8-21 0q-10-8-21 0q-10-8-21 0q-10-8-20 0z' }, 'red', { accent: true }),
    s('path', { d: 'M59 64q0-50 21-50t21 50q-10-8-21 0q-10-8-21 0z' }, 'white'),
    s('path', { d: 'M18 64l56 52M142 64l-56 52M59 64l16 50M101 64l-16 50', ...SW(2) }, 'dark', { stroke: true }),
    ...person(80, 144, 'blue', { h: 26, w: 20, r: 8 })
  ],
  pasividad: [
    s('rect', { x: 18, y: 74, width: 124, height: 56, rx: 14 }, 'brown'),
    s('path', { d: 'M24 130v10M136 130v10', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 46, y: 88, width: 72, height: 22, rx: 10 }, 'blue', { accent: true }),
    s('circle', { cx: 128, cy: 90, r: 13 }, 'skin'),
    s('path', { d: 'M48 100H22', ...SW(10) }, 'navy', { stroke: true }),
    s('path', { d: 'M124 88h8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: ells([[110, 48, 8, 6], [124, 34, 11, 8]]) }, 'gray')
  ],
  perico: [
    s('path', { d: 'M20 112h120', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M74 100l-18 44 12-2 16-38z' }, 'blue'),
    s('ellipse', { cx: 82, cy: 78, rx: 22, ry: 32, transform: 'rotate(15 82 78)' }, 'green', { accent: true }),
    s('circle', { cx: 92, cy: 42, r: 18 }, 'green'),
    s('path', { d: 'M106 38q14 2 8 18q-4-6-10-6z' }, 'orange'),
    s('circle', { cx: 96, cy: 38, r: 4 }, 'dark'),
    s('path', { d: 'M70 70q10 20 0 34', ...SW(5) }, 'yellow', { stroke: true })
  ],
  portafolio: [
    s('path', { d: 'M62 50V38q0-6 6-6h24q6 0 6 6v12', ...SW(7) }, 'dark', { stroke: true }),
    s('rect', { x: 20, y: 50, width: 120, height: 84, rx: 10 }, 'brown', { accent: true }),
    s('path', { d: 'M20 82h120', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 70, y: 74, width: 20, height: 16, rx: 3 }, 'yellow')
  ],
  pradera: [
    backdrop('sky'),
    s('circle', { cx: 120, cy: 40, r: 14 }, 'yellow'),
    s('path', { d: 'M14 96q40-20 70-4t62-6v60H14z' }, 'green', { accent: true }),
    s('path', { d: 'M14 116q50-18 132 2v28H14z' }, 'mint'),
    s('path', { d: dots([[36, 120], [70, 130], [104, 124], [128, 134]], 4) }, 'yellow'),
    s('path', { d: 'M40 106l-2-8M44 106l2-8M90 112l-2-8M94 112l2-8', ...SW(3) }, 'green', { stroke: true })
  ],
  prematuro: [
    s('rect', { x: 22, y: 112, width: 116, height: 26, rx: 6 }, 'gray'),
    s('path', { d: 'M26 112q0-64 54-64t54 64z' }, 'sky'),
    s('rect', { x: 50, y: 100, width: 60, height: 12, rx: 4 }, 'white'),
    s('circle', { cx: 64, cy: 92, r: 11 }, 'skin'),
    s('rect', { x: 74, y: 86, width: 30, height: 16, rx: 8 }, 'pink', { accent: true }),
    s('path', { d: 'M26 112q0-64 54-64t54 64', ...SW(3) }, 'blue', { stroke: true }),
    s('circle', { cx: 112, cy: 125, r: 5 }, 'green')
  ],
  promulgar: [
    ground(),
    ...person(44, 136, 'navy', { h: 48 }),
    s('path', { d: 'M56 102h18', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 72, y: 34, width: 60, height: 84 }, 'cream'),
    s('path', { d: 'M68 34h68M68 118h68', ...SW(10) }, 'tan', { stroke: true }),
    s('path', { d: 'M84 52h36M84 64h36M84 76h28', ...SW(3) }, 'brown', { stroke: true }),
    s('circle', { cx: 112, cy: 98, r: 10 }, 'red', { accent: true })
  ],
  pubertad: [
    ground(),
    s('path', { d: 'M22 136V18', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M22 30h10M22 50h8M22 70h10M22 90h8M22 110h10', ...SW(3) }, 'gray', { stroke: true }),
    ...person(56, 136, 'yellow', { h: 28, w: 22, r: 10 }),
    ...person(110, 136, 'green', { h: 58, w: 30, r: 13, accent: true }),
    arrow('M76 92q4-40 20-56M86 36h10v10', 'orange', 5)
  ],
  publicista: [
    s('path', { d: 'M50 100v40M110 100v40', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 18, y: 24, width: 124, height: 78, rx: 4 }, 'yellow', { accent: true }),
    s('circle', { cx: 50, cy: 62, r: 20 }, 'red'),
    s('path', { d: 'M82 46h46M82 62h46M82 78h30', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M18 140h124', ...SW(4) }, 'gray', { stroke: true })
  ],
  pulpa: [
    s('rect', { x: 92, y: 50, width: 46, height: 88, rx: 6 }, 'sky'),
    s('rect', { x: 96, y: 66, width: 38, height: 68, rx: 4 }, 'orange'),
    s('path', { d: dots([[106, 80], [120, 92], [110, 110], [124, 120]], 3) }, 'yellow'),
    s('circle', { cx: 54, cy: 92, r: 40 }, 'orange', { accent: true }),
    s('circle', { cx: 54, cy: 92, r: 32 }, 'yellow'),
    s('path', { d: rays(54, 92, 4, 32, 8), ...SW(3) }, 'cream', { stroke: true })
  ],
  quehacer: [
    ground(),
    s('path', { d: 'M48 18l22 84', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M56 98l28-8 16 44H56z' }, 'yellow', { accent: true }),
    s('path', { d: 'M104 92h36l-6 44h-24z' }, 'blue'),
    s('path', { d: 'M104 92q18-26 36 0', ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 122, cy: 92, rx: 16, ry: 4 }, 'sky')
  ],
  racionalidad: [
    s('path', { d: 'M40 140v-24q-18-12-18-44q0-46 50-50q50 0 56 44l12 22-12 4v14q0 12-14 12h-14v22z' }, 'skin'),
    ...gear(76, 66, 18, 8, 'blue', { accent: true }),
    s('circle', { cx: 76, cy: 66, r: 7 }, 'white'),
    s('path', { d: 'M98 50l10-6M100 82l10 6', ...SW(3) }, 'gray', { stroke: true })
  ],
  recrear: [
    ground(),
    s('path', { d: rects([[46, 104, 32, 32], [82, 104, 32, 32]]) }, 'blue'),
    s('path', { d: rects([[64, 72, 32, 32]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M64 72l16-22 16 22z' }, 'red'),
    arrow('M30 70q0-46 50-50q36 2 48 30M118 50h12V38', 'green', 6),
    s('path', { d: 'M130 66v18M30 92v14', ...SW(5) }, 'green', { stroke: true })
  ],
  refinado: [
    s('ellipse', { cx: 76, cy: 128, rx: 54, ry: 10 }, 'gray'),
    s('path', { d: 'M38 74h76q0 46-38 50q-38-4-38-50z' }, 'white'),
    s('path', { d: 'M38 74h76q0 46-38 50q-38-4-38-50zM114 86q20 0 14 18q-4 6-16 6', ...SW(4) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M50 88q26 8 52 0', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M66 58q-8-12 0-22t0-22M86 58q-8-12 0-22', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: sparkle(128, 40, 12) }, 'yellow')
  ],
  'refrigeración': [
    s('rect', { x: 34, y: 14, width: 66, height: 128, rx: 8 }, 'white'),
    outline({ x: 34, y: 14, width: 66, height: 128, rx: 8 }),
    s('path', { d: 'M34 58h66M44 28v18M44 70v26', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 112, cy: 56, r: 30 }, 'sky'),
    s('path', { d: rays(112, 56, 0, 22, 6, 90) + 'M112 40l-6-6M112 40l6-6M112 72l-6 6M112 72l6 6', ...SW(4) }, 'blue', { stroke: true, accent: true })
  ],
  reiniciar: [
    s('rect', { x: 16, y: 24, width: 128, height: 88, rx: 8 }, 'dark'),
    s('rect', { x: 24, y: 32, width: 112, height: 72, rx: 4 }, 'sky'),
    s('path', { d: 'M62 136h36M80 112v24', ...SW(6) }, 'gray', { stroke: true }),
    arrow('M96 52a22 22 0 1 1-26-2M64 40l6 10-11 4', 'blue', 6),
    s('circle', { cx: 80, cy: 68, r: 5 }, 'green', { accent: true })
  ],
  reiterar: [
    ground(),
    ...person(36, 136, 'red', { h: 46, accent: true }),
    s('path', { d: bubble(62, 16, 40, 30) + bubble(62, 56, 40, 30) }, 'yellow'),
    s('path', { d: bubble(106, 36, 40, 30) }, 'yellow'),
    s('path', { d: dots([[74, 30], [82, 30], [90, 30], [74, 70], [82, 70], [90, 70], [118, 50], [126, 50], [134, 50]], 3) }, 'dark')
  ],
  represa: [
    s('path', { d: 'M14 52h46v94H14z' }, 'blue'),
    s('path', { d: 'M14 52q12-6 23 0t23 0', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M56 36h22l20 110H56z' }, 'gray', { accent: true }),
    s('path', { d: 'M60 52h28M62 80h30M64 108h32', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M98 120q8-6 16 0t16 0t16 0M98 134h48', ...SW(6) }, 'sky', { stroke: true }),
    s('path', { d: 'M90 70q14 6 18 46', ...SW(6) }, 'sky', { stroke: true })
  ],
  restablecimiento: [
    s('rect', { x: 36, y: 34, width: 72, height: 110, rx: 8 }, 'dark'),
    s('rect', { x: 60, y: 22, width: 24, height: 12, rx: 3 }, 'dark'),
    s('path', { d: rects([[46, 112, 52, 22], [46, 86, 52, 22]]) }, 'green', { accent: true }),
    s('path', { d: rects([[46, 60, 52, 22]]) }, 'mint'),
    arrow('M126 120V40M114 52l12-12 12 12', 'orange', 6)
  ],
  roce: [
    s('rect', { x: 18, y: 42, width: 92, height: 38, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 50, y: 80, width: 92, height: 38, rx: 4 }, 'tan'),
    arrow('M30 30h40M62 24l8 6-8 6M130 130H90M98 124l-8 6 8 6', 'gray', 4),
    s('path', { d: sparkle(124, 72, 12) + sparkle(36, 92, 10) }, 'yellow'),
    s('path', { d: 'M114 64l8-12M40 96l-10 10', ...SW(3) }, 'orange', { stroke: true })
  ],
  salvaguardar: [
    s('path', { d: 'M80 18l54 18v40q0 46-54 70q-54-24-54-70V36z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 32l40 14v30q0 34-40 54q-40-20-40-54V46z' }, 'sky'),
    s('path', { d: 'M58 84l22-20 22 20v26H58z' }, 'yellow'),
    s('rect', { x: 74, y: 94, width: 12, height: 16 }, 'brown')
  ],
  salvavidas: [
    s('path', { d: 'M14 128q16-10 33 0t33 0t33 0t33 0v18H14z' }, 'blue'),
    s('circle', { cx: 80, cy: 76, r: 44, ...SW(26) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 76, r: 44, ...SW(26, { 'stroke-linecap': 'butt', 'stroke-dasharray': '34.56 34.56' }) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 76, r: 57, ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 76, r: 31, ...SW(2) }, 'gray', { stroke: true })
  ],
  sanatorio: [
    ground(),
    s('path', { d: ells([[26, 112, 12, 18], [134, 112, 12, 18]]) }, 'green'),
    s('rect', { x: 40, y: 50, width: 80, height: 86, rx: 3 }, 'cream'),
    s('path', { d: grid(48, 92, 4, 1, 12, 12, 18, 0) }, 'sky'),
    s('rect', { x: 70, y: 112, width: 20, height: 24 }, 'brown'),
    s('path', { d: 'M80 58v26M67 71h26', ...SW(9, { 'stroke-linecap': 'butt' }) }, 'green', { stroke: true, accent: true })
  ],
  sectorial: [
    s('path', { d: wedge(74, 86, 54, 20, 160) }, 'blue'),
    s('path', { d: wedge(74, 86, 54, 160, 270) }, 'yellow'),
    s('path', { d: wedge(74, 86, 54, 270, 380) }, 'green'),
    s('path', { d: wedge(84, 78, 54, 270, 380), transform: 'translate(10 -8)' }, 'red', { accent: true })
  ],
  sepultura: [
    s('path', { d: 'M14 128q66-14 132 0v14H14z' }, 'green'),
    s('path', { d: 'M48 130V60q0-32 32-32t32 32v70z' }, 'gray', { accent: true }),
    s('path', { d: 'M64 66h32M64 80h32', ...SW(4) }, 'dark', { stroke: true }),
    ...flower(36, 112, 'pink').slice(1),
    s('path', { d: dots([[124, 122], [134, 116]], 6) }, 'yellow')
  ],
  'señalización': [
    ground(),
    s('path', { d: 'M52 136V60M112 136V80', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 18l34 56H18z' }, 'red'),
    s('path', { d: 'M52 34l20 32H32z' }, 'white'),
    s('circle', { cx: 112, cy: 62, r: 28 }, 'blue', { accent: true }),
    arrow('M98 62h26M114 52l10 10-10 10', 'white', 6)
  ],
  sobrecarga: [
    s('path', { d: 'M28 70a52 52 0 0 1 104 0', ...SW(12, { 'stroke-linecap': 'butt' }) }, 'green', { stroke: true }),
    s('path', { d: 'M110 30a52 52 0 0 1 22 40', ...SW(12, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M80 70l40-24', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 18, y: 120, width: 124, height: 16, rx: 4 }, 'gray'),
    s('path', { d: rects([[28, 86, 34, 34], [66, 80, 36, 40], [106, 92, 30, 28]]) }, 'brown'),
    s('path', { d: 'M28 86h34M66 80h36M106 92h30', ...SW(3) }, 'tan', { stroke: true })
  ],
  sobrepasar: [
    s('rect', { x: 14, y: 96, width: 132, height: 44 }, 'dark'),
    s('path', { d: 'M22 118h20M60 118h20M98 118h20', ...SW(4) }, 'white', { stroke: true }),
    ...car(20, 116, 'blue'),
    ...car(84, 94, 'red', 'sky', { accent: true }),
    arrow('M26 74q50-40 104-6M120 60l10 8-12 4', 'orange', 5)
  ],
  'socialdemócrata': [
    s('path', { d: busts([30, 58, 102, 130], 140, 24, 30) }, 'pink'),
    s('path', { d: dots([[30, 98], [58, 98], [102, 98], [130, 98]], 10) }, 'skin'),
    s('rect', { x: 50, y: 70, width: 60, height: 70, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 64, y: 76, width: 32, height: 6, rx: 2 }, 'dark'),
    s('path', { d: 'M68 30h24v46H68z' }, 'white'),
    outline({ x: 68, y: 30, width: 24, height: 46 }),
    s('path', { d: heart(80, 44, 8) }, 'red')
  ],
  soleado: [
    backdrop('sky'),
    s('path', { d: rays(80, 66, 34, 50, 12), ...SW(6) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 66, r: 28 }, 'yellow', { accent: true }),
    s('path', { d: 'M14 120q66-24 132 0v26H14z' }, 'green')
  ],
  urbe: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: rects([[20, 70, 26, 76], [50, 30, 28, 116], [82, 52, 24, 94], [110, 82, 30, 64]]) }, 'navy', { accent: true }),
    s('path', { d: grid(26, 78, 2, 6, 5, 6, 10, 11) + grid(56, 40, 3, 9, 4, 6, 8, 11) + grid(88, 60, 2, 7, 5, 6, 10, 11) + grid(116, 90, 3, 4, 5, 6, 8, 12) }, 'yellow'),
    s('path', { d: 'M64 30V16', ...SW(3) }, 'gray', { stroke: true })
  ],
  veraz: [
    ground(),
    ...person(44, 136, 'blue', { h: 46 }),
    s('path', { d: 'M56 98l14-26', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: bubble(78, 18, 66, 50) }, 'green', { accent: true }),
    s('path', { d: 'M96 42l10 10 20-20', ...SW(7) }, 'white', { stroke: true })
  ],
  victorioso: [
    s('rect', { x: 50, y: 124, width: 60, height: 16, rx: 3 }, 'brown'),
    s('path', { d: 'M72 96h16v28H72z' }, 'orange'),
    s('path', { d: 'M48 54q-26 0-22 18q4 16 28 16M112 54q26 0 22 18q-4 16-28 16', ...SW(7) }, 'orange', { stroke: true }),
    s('path', { d: 'M46 22h68v34q0 44-34 44t-34-44z' }, 'yellow', { accent: true }),
    s('path', { d: star(80, 52, 14) }, 'orange'),
    s('path', { d: sparkle(24, 30, 10) + sparkle(138, 30, 10) }, 'yellow')
  ],
  yanqui: [
    s('path', { d: 'M30 96q-4-56 50-58q54 2 50 58z' }, 'navy', { accent: true }),
    s('path', { d: 'M30 96h70q36 0 40 14H30z' }, 'navy'),
    s('circle', { cx: 80, cy: 38, r: 5 }, 'white'),
    s('path', { d: 'M80 40v56M54 46q-10 20-12 50M106 46q10 20 12 50', ...SW(2) }, 'sky', { stroke: true }),
    s('circle', { cx: 44, cy: 128, r: 14 }, 'white'),
    s('path', { d: 'M34 118q8 10 0 20M54 118q-8 10 0 20', ...SW(2) }, 'red', { stroke: true }),
    s('path', { d: 'M70 140l64-30', ...SW(9) }, 'tan', { stroke: true })
  ],
  yate: [
    backdrop('sky'),
    s('path', { d: 'M14 120q16-8 33 0t33 0t33 0t33 0v26H14z' }, 'blue'),
    s('path', { d: 'M18 98h126l-20 26H34z' }, 'white'),
    s('path', { d: 'M24 106h114', ...SW(4) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M44 98l10-22h56l14 22z' }, 'white'),
    s('path', { d: 'M58 80h18v12H58zM82 80h18v12H82z' }, 'navy'),
    s('path', { d: 'M18 98h126l-20 26H34zM44 98l10-22h56l14 22', ...SW(2) }, 'gray', { stroke: true })
  ],
  'abadía': [
    ground(),
    s('rect', { x: 20, y: 66, width: 82, height: 70 }, 'tan'),
    s('path', { d: 'M14 68l47-34 47 34z' }, 'brown'),
    s('rect', { x: 102, y: 30, width: 36, height: 106 }, 'tan', { accent: true }),
    s('path', { d: 'M98 32l22-20 22 20z' }, 'brown'),
    s('path', { d: 'M112 64v-10a8 8 0 0 1 16 0v10z' }, 'dark'),
    s('path', { d: 'M52 136v-24a9 9 0 0 1 18 0v24zM30 104V90a6 6 0 0 1 12 0v14zM80 104V90a6 6 0 0 1 12 0v14z' }, 'dark'),
    s('circle', { cx: 120, cy: 56, r: 5 }, 'yellow')
  ],
  abonar: [
    ...paper(22, 18, 70, 96),
    s('path', { d: 'M34 38h46M34 54h46M34 70h30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 96l8 8 16-16', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: ells([[112, 130, 24, 8], [112, 118, 24, 8], [112, 106, 24, 8]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M88 106v24M136 106v24', ...SW(2) }, 'orange', { stroke: true }),
    s('circle', { cx: 116, cy: 58, r: 18 }, 'yellow'),
    arrow('M116 82v12', 'orange', 4)
  ],
  'albañil': [
    ground(),
    s('path', { d: rects([[70, 120, 30, 14], [102, 120, 30, 14], [86, 104, 30, 14], [118, 104, 22, 14], [70, 104, 14, 14], [70, 88, 30, 14]]) }, 'red'),
    ...person(40, 136, 'orange', { h: 46, w: 28, r: 12, accent: true }),
    s('path', { d: 'M26 74a14 13 0 0 1 28 0z' }, 'yellow'),
    s('path', { d: 'M52 104l24-14', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M76 90l18-6-4 10z' }, 'gray')
  ],
  alejamiento: [
    ground(),
    ...lean(52, 136, -10, 'blue'),
    ...lean(108, 136, 10, 'pink', { accent: true }),
    arrow('M36 50H14M22 42l-8 8 8 8M124 50h22M138 42l8 8-8 8', 'orange', 5),
    s('path', { d: 'M80 70v66', ...DASH(3) }, 'gray', { stroke: true })
  ],
  alzamiento: [
    s('path', { d: busts([30, 56, 82, 108, 132], 146, 26, 38) }, 'blue'),
    s('path', { d: dots([[30, 104], [56, 100], [82, 104], [108, 100], [132, 104]], 11) }, 'skin'),
    s('path', { d: 'M22 112L14 74M66 108l8-40M120 108l6-40', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M90 112V26', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M90 26h40l-8 14 8 14H90z' }, 'orange', { accent: true })
  ],
  'armónica': [
    s('rect', { x: 16, y: 58, width: 128, height: 44, rx: 6 }, 'gray'),
    s('rect', { x: 16, y: 72, width: 128, height: 16 }, 'blue', { accent: true }),
    s('path', { d: rects([[24, 76, 8, 8], [40, 76, 8, 8], [56, 76, 8, 8], [72, 76, 8, 8], [88, 76, 8, 8], [104, 76, 8, 8], [120, 76, 8, 8]]) }, 'dark'),
    s('path', { d: 'M22 64h116M22 96h116', ...SW(2) }, 'white', { stroke: true }),
    ...note(56, 38, 'purple').map(x => ({ ...x, accent: false })),
    ...note(104, 132, 'purple').map(x => ({ ...x, accent: false }))
  ],
  asaltar: [
    ground(),
    s('path', { d: 'M72 112l-14 24M84 112l16 24', ...SW(8) }, 'dark', { stroke: true }),
    ...lean(78, 114, 14, 'black', { h: 42, accent: true }),
    s('rect', { x: 77, y: 52, width: 26, height: 8, rx: 3, transform: 'rotate(14 90 56)' }, 'dark'),
    s('path', { d: 'M96 84l22 6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M116 82q-4-10 6-10q10 0 6 10q14 6 10 22q-4 10-14 10t-14-10q-4-16 6-22z' }, 'tan'),
    s('path', { d: 'M16 72h20M20 88h18', ...SW(4) }, 'gray', { stroke: true })
  ],
  asentar: [
    s('path', { d: 'M28 70l52-40 52 40v58H28z', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: rects([[16, 120, 42, 20], [60, 120, 42, 20], [104, 120, 40, 20]]) }, 'gray'),
    s('rect', { x: 46, y: 96, width: 42, height: 22, rx: 2 }, 'brown', { accent: true }),
    arrow('M67 70v18M59 80l8 8 8-8', 'orange', 4),
    s('path', { d: 'M106 108l24-14', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M96 112l18-14 6 12z' }, 'dark')
  ],
  'autocrítica': [
    ground(),
    ...person(44, 136, 'blue', { h: 46 }),
    s('ellipse', { cx: 112, cy: 82, rx: 30, ry: 44 }, 'brown'),
    s('ellipse', { cx: 112, cy: 82, rx: 24, ry: 38 }, 'sky', { accent: true }),
    ...face(112, 78, 15, 'skin', 'frown'),
    s('path', { d: 'M112 126v10', ...SW(6) }, 'brown', { stroke: true })
  ],
  aventurero: [
    s('path', { d: 'M76 136l40-80 30 80z' }, 'gray'),
    s('path', { d: 'M116 56v-30l18 8-18 8', ...SW(3) }, 'red', { stroke: true }),
    ground(),
    s('rect', { x: 26, y: 82, width: 18, height: 34, rx: 5 }, 'brown'),
    ...person(54, 136, 'green', { h: 46, accent: true }),
    s('path', { d: 'M34 60h40M42 60q0-14 12-14t12 14', ...SW(5) }, 'tan', { stroke: true })
  ],
  bromear: [
    ground(),
    ...person(44, 136, 'orange', { h: 44 }),
    ...person(116, 136, 'purple', { h: 44 }),
    s('path', { d: 'M38 74h12M110 74h12', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M38 82q6 8 12 0zM110 82q6 8 12 0z' }, 'dark'),
    s('path', { d: sparkle(80, 40, 14) + sparkle(62, 22, 7) + sparkle(98, 22, 7) }, 'yellow', { accent: true })
  ],
  'carpintería': [
    s('path', { d: 'M14 126h132', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 20, y: 100, width: 120, height: 22, rx: 2 }, 'tan'),
    s('path', { d: 'M34 106h30M80 114h40', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M78 100l38-62 22 14-46 54z' }, 'gray'),
    s('path', { d: 'M82 98l38-58', ...DASH(3, '3 3') }, 'dark', { stroke: true }),
    s('rect', { x: 114, y: 20, width: 30, height: 22, rx: 6, transform: 'rotate(32 129 31)' }, 'red', { accent: true }),
    s('path', { d: 'M34 56l24-24M24 46h20v20', ...SW(6) }, 'brown', { stroke: true })
  ],
  centeno: [
    s('path', { d: 'M56 142V72M80 142V56M104 142V72', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M56 72V36M80 56V20M104 72V36', ...SW(10) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M56 70l-14-30M56 56l-12-30M56 70l14-30M56 56l12-30M80 54l-14-30M80 40l-12-28M80 54l14-30M80 40l12-28M104 70l-14-30M104 56l-12-30M104 70l14-30M104 56l12-30', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: leaflet(80, 110, -40, 30, 6) + leaflet(56, 120, -140, 26, 5) }, 'green')
  ],
  'cliché': [
    s('rect', { x: 18, y: 104, width: 124, height: 36, rx: 3 }, 'white'),
    outline({ x: 18, y: 104, width: 124, height: 36, rx: 3 }),
    s('path', { d: star(40, 122, 11) + star(80, 122, 11) + star(120, 122, 11) }, 'purple'),
    s('rect', { x: 64, y: 20, width: 32, height: 36, rx: 6 }, 'brown'),
    s('ellipse', { cx: 80, cy: 18, rx: 14, ry: 8 }, 'brown'),
    s('rect', { x: 52, y: 56, width: 56, height: 14, rx: 2 }, 'dark'),
    s('path', { d: star(80, 84, 11) }, 'purple', { accent: true })
  ],
  colectividad: [
    s('circle', { cx: 80, cy: 80, r: 34, ...SW(6) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: dots(around(80, 80, 52, 8, -90), 11) }, 'skin'),
    s('path', { d: around(80, 80, 36, 8, -90).map(([x, y]) => `M${x} ${y}m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0z`).join('') }, 'blue'),
    s('circle', { cx: 80, cy: 80, r: 14 }, 'red')
  ],
  colonialismo: [
    s('path', { d: 'M14 120q16-8 33 0t33 0t33 0t33 0v26H14z' }, 'blue'),
    s('path', { d: 'M84 120q10-30 44-30q14 0 18 12v18z' }, 'tan'),
    s('path', { d: 'M126 94q-2-22 4-34', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(130, 60, -160, 20, 6) + leaflet(130, 60, -20, 20, 6) + leaflet(130, 60, 60, 16, 5) }, 'green'),
    s('path', { d: 'M14 104h68l-10 16H24z' }, 'brown'),
    s('path', { d: 'M48 104V24', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M50 28q24 18 0 40zM46 30q-24 16 0 36z' }, 'cream'),
    s('path', { d: 'M48 24h18l-4 6 4 6H48z' }, 'red', { accent: true })
  ],
  coloquio: [
    s('path', { d: busts([40, 80, 120], 112, 28, 30) }, 'navy'),
    s('path', { d: dots([[40, 70], [80, 70], [120, 70]], 12) }, 'skin'),
    s('rect', { x: 16, y: 106, width: 128, height: 14, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: 'M26 120v22M134 120v22', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: bubble(16, 14, 40, 30) + bubble(104, 14, 40, 30) }, 'yellow'),
    s('path', { d: 'M40 106V92M80 106V92M120 106V92', ...SW(3) }, 'dark', { stroke: true })
  ],
  compraventa: [
    s('rect', { x: 18, y: 52, width: 50, height: 50, rx: 4 }, 'brown'),
    s('path', { d: 'M18 68h50M43 52v16', ...SW(3) }, 'tan', { stroke: true }),
    s('circle', { cx: 114, cy: 78, r: 26 }, 'yellow', { accent: true }),
    s('circle', { cx: 114, cy: 78, r: 18, ...SW(3) }, 'orange', { stroke: true }),
    arrow('M40 40q40-40 80 4M112 34l8 10 4-12', 'green', 5),
    arrow('M120 116q-40 40-80-4M48 122l-8-10-4 12', 'blue', 5)
  ],
  comprimido: [
    s('rect', { x: 20, y: 30, width: 120, height: 100, rx: 10 }, 'sky'),
    s('path', { d: dots([[50, 60], [80, 60], [110, 60], [50, 100], [80, 100]], 13) }, 'white'),
    s('path', { d: ring(50, 60, 13) + ring(80, 60, 13) + ring(110, 60, 13) + ring(50, 100, 13) + ring(80, 100, 13), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: ring(110, 100, 13), ...DASH(2, '3 3') }, 'gray', { stroke: true }),
    s('circle', { cx: 128, cy: 132, r: 14 }, 'white', { accent: true }),
    s('path', { d: ring(128, 132, 14) + 'M118 132h20', ...SW(3) }, 'blue', { stroke: true })
  ],
  congelar: [
    s('rect', { x: 26, y: 40, width: 92, height: 92, rx: 12 }, 'sky', { accent: true }),
    s('path', { d: 'M38 56l12-6M38 70l20-12', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: fishes([[76, 92]]), transform: 'translate(76 92) scale(1.6) translate(-76 -92)' }, 'orange'),
    s('path', { d: rays(124, 36, 0, 18, 6, 90), ...SW(4) }, 'blue', { stroke: true }),
    s('rect', { x: 26, y: 40, width: 92, height: 92, rx: 12, ...SW(3) }, 'blue', { stroke: true })
  ],
  conque: [
    s('path', { d: ells([[42, 40, 22, 14], [60, 32, 18, 16], [28, 46, 14, 10]]) }, 'gray'),
    s('path', { d: 'M30 64l-4 12M46 64l-4 12M62 64l-4 12', ...SW(4) }, 'blue', { stroke: true }),
    arrow('M70 84h22M84 76l8 8-8 8', 'orange', 5),
    s('path', { d: 'M96 92q22-40 44 0q-7-6-15 0q-7-6-14 0q-8-6-15 0z' }, 'red', { accent: true }),
    s('path', { d: 'M118 92v34q0 8-8 6', ...SW(4) }, 'dark', { stroke: true })
  ],
  consentir: [
    ground(),
    ...person(52, 136, 'blue', { h: 50 }),
    ...person(112, 136, 'yellow', { h: 30, w: 22, r: 10 }),
    s('path', { d: 'M126 92l8 16 8-16z' }, 'tan'),
    s('circle', { cx: 134, cy: 84, r: 10 }, 'pink'),
    s('circle', { cx: 92, cy: 38, r: 16 }, 'green', { accent: true }),
    s('path', { d: 'M84 38l6 6 10-12', ...SW(4) }, 'white', { stroke: true })
  ],
  controvertido: [
    ground(),
    ...person(30, 136, 'blue', { h: 40, w: 26, r: 11 }),
    ...person(130, 136, 'orange', { h: 40, w: 26, r: 11 }),
    s('path', { d: bubble(14, 20, 56, 40) }, 'sky'),
    s('path', { d: 'M98 20h40a8 8 0 0 1 8 8v24a8 8 0 0 1-8 8h-6v12l-12-12H98a8 8 0 0 1-8-8V28a8 8 0 0 1 8-8z' }, 'pink'),
    s('path', { d: 'M86 30l-14 26h14l-10 30 22-36H84l10-20z' }, 'red', { accent: true })
  ],
  colar: [
    s('path', { d: 'M24 54h82q0 44-41 44T24 54z' }, 'gray', { accent: true }),
    s('path', { d: 'M104 60l40-12', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: dots([[46, 70], [64, 74], [82, 70], [56, 86], [74, 86]], 3) }, 'dark'),
    s('path', { d: 'M40 50q12-14 24-4q10-12 22-2q8-6 14 4', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: drop(52, 112, 4) + drop(70, 120, 4) + drop(62, 104, 3) }, 'sky'),
    s('path', { d: 'M38 132h56l-6 12H44z' }, 'blue')
  ],
  cuestionable: [
    s('circle', { cx: 66, cy: 80, r: 50 }, 'skin'),
    s('path', { d: 'M36 60l20-4M78 50l22 8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[50, 72], [90, 72]], 5) }, 'dark'),
    s('path', { d: 'M50 104q20-8 34 2', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 116, cy: 102, r: 18, ...SW(6) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M128 116l14 18', ...SW(8) }, 'navy', { stroke: true })
  ],
  'defensoría': [
    ground(),
    s('path', { d: 'M18 58l62-36 62 36z' }, 'gray'),
    s('path', { d: rects([[26, 64, 108, 8], [22, 126, 116, 10]]) }, 'gray'),
    s('path', { d: 'M34 74v50M56 74v50M104 74v50M126 74v50', ...SW(8) }, 'cream', { stroke: true }),
    s('path', { d: 'M80 76l18 6v16q0 16-18 24q-18-8-18-24V82z' }, 'blue', { accent: true }),
    s('path', { d: 'M72 98l6 6 10-12', ...SW(4) }, 'white', { stroke: true })
  ],
  'deforestación': [
    ground(),
    s('path', { d: ells([[40, 124, 14, 5]]) + 'M26 124v12h28v-12zM90 128h24v8H90z' }, 'brown'),
    s('ellipse', { cx: 40, cy: 124, rx: 10, ry: 3 }, 'tan'),
    s('path', { d: 'M124 136V92', ...SW(8) }, 'brown', { stroke: true }),
    s('circle', { cx: 124, cy: 76, r: 20 }, 'green'),
    s('path', { d: 'M62 74l28 40', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M54 62l20-10 6 16-18 8z' }, 'gray', { accent: true }),
    s('path', { d: 'M94 128l-20-22', ...SW(8) }, 'brown', { stroke: true })
  ],
  denominador: [
    s('rect', { x: 66, y: 22, width: 28, height: 28, rx: 4 }, 'orange'),
    s('path', { d: 'M20 76h120', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: rects([[20, 100, 26, 26], [52, 100, 26, 26], [84, 100, 26, 26], [116, 100, 26, 26]]) }, 'blue', { accent: true }),
    s('path', { d: 'M18 140h126', ...SW(3) }, 'gray', { stroke: true })
  ],
  desembocadura: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'green'),
    s('path', { d: 'M14 98q60-20 132-40v88H14z' }, 'blue', { accent: true }),
    s('path', { d: 'M40 14q-6 30 10 46t40 30l-24 10q-24-20-40-36t0-50z' }, 'sky'),
    s('path', { d: 'M40 120q8-5 16 0M90 112q8-5 16 0M110 132q8-5 16 0', ...SW(3) }, 'white', { stroke: true })
  ],
  devenir: [
    ground(),
    s('path', { d: 'M28 136v-14', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(28, 124, -150, 12, 4) + leaflet(28, 124, -30, 12, 4) }, 'green'),
    s('path', { d: 'M70 136v-36', ...SW(5) }, 'brown', { stroke: true }),
    s('circle', { cx: 70, cy: 92, r: 16 }, 'mint'),
    s('path', { d: 'M122 136V84', ...SW(8) }, 'brown', { stroke: true }),
    s('circle', { cx: 122, cy: 62, r: 28 }, 'green', { accent: true }),
    arrow('M38 112l12-6M86 84l12-8', 'orange', 4)
  ],
  dominical: [
    s('rect', { x: 16, y: 26, width: 128, height: 112, rx: 8 }, 'white'),
    outline({ x: 16, y: 26, width: 128, height: 112, rx: 8 }),
    s('path', { d: 'M16 34a8 8 0 0 1 8-8h112a8 8 0 0 1 8 8v12H16z' }, 'red'),
    s('path', { d: 'M44 20v14M116 20v14', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: grid(24, 56, 6, 4, 12, 14, 18, 20) }, 'gray'),
    s('rect', { x: 126, y: 54, width: 14, height: 80, rx: 3 }, 'red', { accent: true }),
  ],
  elocuente: [
    ground(),
    ...person(36, 136, 'purple', { h: 48, accent: true }),
    s('path', { d: 'M54 64q30-20 40 0t40 0M54 80q30-14 46 0t40 0', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: busts([96, 124], 136, 22, 26) }, 'blue'),
    s('path', { d: dots([[96, 100], [124, 100]], 9) }, 'skin'),
    s('path', { d: heart(110, 26, 8) }, 'red')
  ],
  elogiar: [
    ground(),
    ...person(36, 136, 'blue', { h: 44 }),
    ...person(120, 136, 'orange', { h: 48, accent: true }),
    s('path', { d: bubble(28, 16, 50, 36) }, 'pink'),
    s('path', { d: heart(53, 30, 9) }, 'red'),
    s('path', { d: star(108, 40, 9) + star(134, 34, 9) + star(122, 18, 7) }, 'yellow')
  ],
  emerger: [
    s('rect', { x: 14, y: 70, width: 132, height: 76, rx: 6 }, 'blue'),
    s('path', { d: 'M40 96q0-20 20-20h40q20 0 20 20v4H40z' }, 'yellow', { accent: true }),
    s('rect', { x: 68, y: 56, width: 20, height: 22, rx: 4 }, 'yellow'),
    s('path', { d: 'M82 56V40h10', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 74q12-8 24 0t24 0t24 0t24 0t24 0t12 0', ...SW(5) }, 'sky', { stroke: true }),
    arrow('M28 126V96M20 104l8-8 8 8M132 126V96M124 104l8-8 8 8', 'white', 4)
  ],
  empatar: [
    s('rect', { x: 16, y: 30, width: 128, height: 84, rx: 8 }, 'dark'),
    s('rect', { x: 26, y: 40, width: 44, height: 12, rx: 3 }, 'blue'),
    s('rect', { x: 90, y: 40, width: 44, height: 12, rx: 3 }, 'red'),
    s('path', { d: dots([[38, 82], [58, 82], [102, 82], [122, 82]], 9) }, 'yellow', { accent: true }),
    s('path', { d: 'M72 76h16M72 88h16', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M48 114v24M112 114v24', ...SW(6) }, 'gray', { stroke: true })
  ],
  enchufe: [
    s('rect', { x: 18, y: 36, width: 66, height: 88, rx: 10 }, 'white'),
    outline({ x: 18, y: 36, width: 66, height: 88, rx: 10 }),
    s('circle', { cx: 51, cy: 80, r: 22 }, 'gray'),
    s('path', { d: dots([[43, 80], [59, 80]], 4) }, 'dark'),
    s('path', { d: 'M96 70h10M96 90h10', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 104, y: 60, width: 26, height: 40, rx: 6 }, 'blue', { accent: true }),
    s('path', { d: 'M130 80q16 0 12 30t-4 34', ...SW(6) }, 'dark', { stroke: true })
  ],
  enlazar: [
    ground(),
    s('path', { d: 'M110 136V62', ...SW(12) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 110, cy: 76, rx: 18, ry: 7, ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M92 78q-30 10-40 30t-24 18', ...SW(5) }, 'red', { stroke: true }),
    s('circle', { cx: 34, cy: 46, r: 18, ...SW(4) }, 'tan', { stroke: true }),
    s('circle', { cx: 34, cy: 46, r: 11, ...SW(4) }, 'tan', { stroke: true })
  ],
  espeso: [
    s('path', { d: 'M24 82h112q0 54-56 54T24 82z' }, 'blue'),
    s('ellipse', { cx: 80, cy: 82, rx: 56, ry: 10 }, 'brown', { accent: true }),
    s('path', { d: 'M54 78q8-8 14 0M92 80q8-8 14 0', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M86 80V20', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: 'M78 84q8-10 16 0', ...SW(4) }, 'tan', { stroke: true })
  ],
  'espontáneamente': [
    s('rect', { x: 34, y: 92, width: 72, height: 48, rx: 4 }, 'red'),
    s('path', { d: 'M34 92l-18-22M106 92l20-22', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M70 92q-14-6 0-12t0-12t0-12', ...SW(4) }, 'gray', { stroke: true }),
    ...face(70, 36, 20, 'yellow', 'smile', { accent: true }),
    s('path', { d: sparkle(116, 32, 12) + sparkle(28, 40, 9) }, 'orange'),
    s('path', { d: star(70, 116, 12) }, 'yellow')
  ],
  estabilizar: [
    s('path', { d: 'M14 120h132', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 120v26M146 120v26', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 120l-6-20M86 120l6-20', ...SW(6) }, 'navy', { stroke: true }),
    ...person(80, 102, 'red', { h: 36, w: 24, r: 10, accent: true }),
    s('path', { d: 'M18 76h124', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M70 80h20', ...SW(6) }, 'skin', { stroke: true })
  ],
  estipular: [
    ...paper(22, 14, 84, 120),
    s('path', { d: dots([[36, 36], [36, 56], [36, 76]], 4) }, 'blue'),
    s('path', { d: 'M46 36h46M46 56h46M46 76h40M34 112q10-10 16 0t16-4', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 88, cy: 112, r: 12 }, 'red'),
    s('path', { d: 'M116 132l20-90 8 2-20 90z' }, 'navy', { accent: true }),
    s('path', { d: 'M116 132l-2 10 8-8z' }, 'dark')
  ],
  estresante: [
    ...face(80, 88, 44, 'skin', 'frown'),
    s('path', { d: 'M48 50l-6-16M64 44l-2-18M80 42v-18M96 44l2-18M112 50l6-16', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M22 60l14 8-10 6 14 10M138 60l-14 8 10 6-14 10', ...SW(4) }, 'red', { stroke: true, accent: true }),
    s('path', { d: drop(118, 84, 5) }, 'sky')
  ],
  extravagante: [
    ground(),
    ...person(80, 136, 'purple', { h: 54, w: 36, r: 14, accent: true }),
    s('path', { d: dots([[72, 96], [90, 108], [74, 122], [88, 88]], 4) }, 'yellow'),
    s('path', { d: 'M54 58h52M64 58q0-20 16-20t16 20' }, 'pink'),
    s('path', { d: 'M54 58h52', ...SW(5) }, 'pink', { stroke: true }),
    s('path', { d: 'M94 40q10-30 36-24q-10 4-14 14q-8 10-22 10z' }, 'green'),
    s('path', { d: 'M68 64h24', ...SW(6) }, 'dark', { stroke: true })
  ],
  fichar: [
    s('rect', { x: 30, y: 30, width: 72, height: 102, rx: 8 }, 'gray'),
    s('circle', { cx: 66, cy: 64, r: 24 }, 'white'),
    s('path', { d: 'M66 64V50M66 64l10 6', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 44, y: 100, width: 44, height: 6, rx: 2 }, 'dark'),
    s('rect', { x: 54, y: 82, width: 24, height: 22, rx: 2 }, 'cream'),
    s('path', { d: 'M100 94h24', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 110, y: 80, width: 22, height: 28, rx: 2, transform: 'rotate(-10 121 94)' }, 'orange', { accent: true })
  ],
  floral: [
    s('path', { d: 'M56 106h48l-8 36H64z' }, 'blue'),
    s('path', { d: 'M80 106V60M80 106L52 66M80 106l28-40', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots(around(80, 46, 10, 5, -90), 8) }, 'pink'),
    s('path', { d: dots(around(48, 58, 9, 5, -90), 7) + dots(around(112, 58, 9, 5, -90), 7) }, 'purple'),
    s('path', { d: dots([[80, 46], [48, 58], [112, 58]], 5) }, 'yellow', { accent: true }),
    s('path', { d: leaflet(80, 88, -150, 18, 5) + leaflet(80, 92, -30, 18, 5) }, 'green')
  ],
  furgoneta: [
    ground(),
    s('path', { d: 'M18 120V56q0-10 10-10h76q8 0 14 8l20 28q6 6 6 14v24z' }, 'white'),
    s('path', { d: 'M18 120V56q0-10 10-10h76q8 0 14 8l20 28q6 6 6 14v24z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M106 56l18 26h-18z' }, 'sky'),
    s('rect', { x: 18, y: 92, width: 126, height: 10 }, 'orange', { accent: true }),
    s('path', { d: 'M70 50v70', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: dots([[42, 122], [116, 122]], 13) }, 'dark')
  ],
  'fúnebre': [
    s('circle', { cx: 80, cy: 72, r: 46, ...SW(18) }, 'green', { stroke: true }),
    s('path', { d: dots(around(80, 72, 46, 10, -90), 9) }, 'white'),
    s('path', { d: dots(around(80, 72, 46, 10, -90), 3) }, 'yellow'),
    s('path', { d: 'M80 116l-20 30 8 0 12-20 12 20 8 0z' }, 'black', { accent: true }),
    s('circle', { cx: 80, cy: 118, r: 8 }, 'black')
  ],
  gourmet: [
    s('rect', { x: 14, y: 120, width: 132, height: 8, rx: 4 }, 'gray'),
    s('path', { d: 'M28 116a52 52 0 0 1 104 0z' }, 'gray', { accent: true }),
    s('path', { d: 'M48 96q8-28 32-32', ...SW(5) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 58, r: 7 }, 'dark'),
    s('path', { d: 'M24 116h112', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(130, 40, 12) + sparkle(30, 46, 9) }, 'yellow')
  ],
  imprudente: [
    ground(),
    s('ellipse', { cx: 116, cy: 136, rx: 24, ry: 6 }, 'black'),
    ...lean(66, 136, 8, 'orange', { accent: true }),
    s('rect', { x: 78, y: 70, width: 10, height: 16, rx: 2 }, 'dark'),
    s('path', { d: 'M78 98l4-14', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M106 108l8 12M126 108l-8 12', ...SW(4) }, 'red', { stroke: true })
  ],
  inactividad: [
    ...gear(70, 86, 34, 10, 'gray'),
    s('circle', { cx: 70, cy: 86, r: 12 }, 'white'),
    s('path', { d: 'M104 22l36 0M104 22l36 36M104 22l0 36M110 40q10-4 12-12M110 52q22-8 24-24', ...SW(2) }, 'dark', { stroke: true }),
    s('circle', { cx: 120, cy: 120, r: 22 }, 'orange', { accent: true }),
    s('path', { d: 'M113 110v20M127 110v20', ...SW(5) }, 'white', { stroke: true })
  ],
  incesante: [
    s('circle', { cx: 80, cy: 78, r: 52, ...SW(8) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: rays(80, 78, 6, 48, 8), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 140l20-50 20 50', ...SW(6) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 80, cy: 116, rx: 18, ry: 12 }, 'tan'),
    s('circle', { cx: 96, cy: 108, r: 9 }, 'tan'),
    s('path', { d: dots([[100, 106]], 2) }, 'dark'),
    s('path', { d: 'M20 40q-6 14 0 28M140 40q6 14 0 28', ...SW(3) }, 'gray', { stroke: true })
  ],
  incomparable: [
    s('path', { d: 'M26 118l-6-66 32 30 28-44 28 44 32-30-6 66z' }, 'yellow', { accent: true }),
    s('rect', { x: 26, y: 114, width: 108, height: 20, rx: 4 }, 'orange'),
    s('path', { d: dots([[54, 124], [80, 124], [106, 124]], 5) }, 'red'),
    s('path', { d: dots([[20, 50], [80, 36], [140, 50]], 7) }, 'blue')
  ],
  indicativo: [
    s('rect', { x: 26, y: 64, width: 52, height: 56, rx: 14 }, 'skin', { accent: true }),
    s('rect', { x: 60, y: 64, width: 78, height: 18, rx: 9 }, 'skin'),
    s('path', { d: 'M40 90h34M40 104h34', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 16, y: 120, width: 72, height: 22, rx: 4 }, 'blue'),
    s('path', { d: 'M126 56q12-6 18 0M126 92q12 6 18 0', ...SW(3) }, 'orange', { stroke: true })
  ],
  interruptor: [
    s('rect', { x: 40, y: 28, width: 80, height: 108, rx: 10 }, 'white'),
    outline({ x: 40, y: 28, width: 80, height: 108, rx: 10 }),
    s('rect', { x: 62, y: 52, width: 36, height: 60, rx: 6 }, 'gray'),
    s('rect', { x: 66, y: 56, width: 28, height: 28, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: dots([[80, 36], [80, 128]], 3) }, 'dark')
  ],
  'intimidación': [
    ground(),
    s('path', { d: 'M20 136V70q0-24 26-30a20 20 0 1 1 30 0q26 6 26 30v66z' }, 'dark'),
    s('path', { d: 'M30 72L14 40M92 72l16-32', ...SW(10) }, 'dark', { stroke: true }),
    s('path', { d: ells([[52, 26, 4, 3], [68, 26, 4, 3]]) }, 'red'),
    ...person(126, 136, 'sky', { h: 30, w: 22, r: 10, accent: true }),
    s('path', { d: drop(140, 82, 4) }, 'blue')
  ],
  karaoke: [
    s('rect', { x: 64, y: 16, width: 80, height: 54, rx: 6 }, 'dark'),
    s('path', { d: 'M74 50h40M74 58h56', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M42 74l30 60', ...SW(10) }, 'dark', { stroke: true }),
    s('circle', { cx: 36, cy: 62, r: 18 }, 'gray'),
    s('path', { d: 'M32 76l12-4', ...SW(4) }, 'red', { stroke: true, accent: true }),
    ...note(106, 110, 'purple').map(x => ({ ...x, accent: false }))
  ],
  largometraje: [
    s('path', { d: 'M76 112h70v24H76z' }, 'dark'),
    s('path', { d: rects([[82, 116, 8, 4], [98, 116, 8, 4], [114, 116, 8, 4], [130, 116, 8, 4], [82, 128, 8, 4], [98, 128, 8, 4], [114, 128, 8, 4], [130, 128, 8, 4]]) }, 'white'),
    s('circle', { cx: 56, cy: 76, r: 44 }, 'gray', { accent: true }),
    s('path', { d: dots(around(56, 76, 24, 5, -90), 10) }, 'dark'),
    s('circle', { cx: 56, cy: 76, r: 5 }, 'dark'),
    s('path', { d: 'M56 120h22', ...SW(24, { 'stroke-linecap': 'butt' }) }, 'dark', { stroke: true })
  ],
  lastre: [
    s('path', { d: 'M80 14q46 0 46 46q0 30-30 48H64q-30-18-30-48q0-46 46-46z' }, 'red', { accent: true }),
    s('path', { d: 'M80 14q-18 20-16 94M80 14q18 20 16 94', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M64 108l2 14M96 108l-2 14', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 62, y: 120, width: 36, height: 22, rx: 3 }, 'brown'),
    s('path', { d: 'M62 126l-12 6M98 126l12 6', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: ells([[46, 140, 8, 6], [114, 140, 8, 6]]) }, 'tan')
  ],
  logia: [
    ground(),
    s('rect', { x: 24, y: 56, width: 112, height: 80 }, 'navy'),
    s('path', { d: 'M18 58l62-36 62 36z' }, 'blue'),
    s('path', { d: 'M40 62v74M120 62v74', ...SW(10) }, 'cream', { stroke: true }),
    s('path', { d: 'M64 136V92q16-18 32 0v44z' }, 'brown', { accent: true }),
    s('circle', { cx: 80, cy: 72, r: 7 }, 'yellow')
  ],
  'léxico': [
    s('rect', { x: 28, y: 22, width: 90, height: 118, rx: 6 }, 'red', { accent: true }),
    s('rect', { x: 36, y: 22, width: 82, height: 112, rx: 2 }, 'cream'),
    s('path', { d: rects([[118, 30, 10, 12], [118, 50, 10, 12], [118, 70, 10, 12], [118, 90, 10, 12], [118, 110, 10, 12]]) }, 'yellow'),
    s('path', { d: 'M48 42h56M48 56h44M48 70h56M48 84h40M48 98h56M48 112h36', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 28, y: 22, width: 10, height: 118 }, 'red')
  ],
  magnesio: [
    s('path', { d: 'M30 72h60l-6 62q0 6-6 6H42q-6 0-6-6z' }, 'blue', { accent: true }),
    s('path', { d: 'M30 72h60', ...SW(6) }, 'navy', { stroke: true }),
    s('path', { d: ells([[60, 64, 26, 10], [48, 52, 14, 10], [72, 50, 14, 10]]) }, 'white'),
    s('path', { d: ells([[60, 64, 26, 10]]), ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 100, y: 52, width: 36, height: 50, rx: 14 }, 'skin'),
    s('path', { d: dots([[110, 66], [124, 72], [114, 84], [128, 90]], 4) + ells([[118, 30, 10, 7], [134, 40, 7, 5]]) }, 'white'),
    s('path', { d: ring(118, 30, 9) + ring(134, 40, 6), ...SW(1.5) }, 'gray', { stroke: true })
  ],
  mambo: [
    ground(),
    ...lean(56, 136, -12, 'red', { accent: true }),
    ...lean(104, 136, 12, 'blue'),
    s('path', { d: 'M74 92l12-2', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M40 136q-16-16 0-36', ...SW(4) }, 'red', { stroke: true }),
    ...note(118, 36, 'purple').map(x => ({ ...x, accent: false })),
  ],
  manualmente: [
    s('rect', { x: 20, y: 80, width: 64, height: 60, rx: 6 }, 'red', { accent: true }),
    s('circle', { cx: 52, cy: 110, r: 12 }, 'gray'),
    s('path', { d: 'M52 80V54h44v26', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 52, cy: 54, r: 6 }, 'dark'),
    s('ellipse', { cx: 106, cy: 92, rx: 18, ry: 14 }, 'skin'),
    s('path', { d: 'M122 96l22 14', ...SW(14) }, 'skin', { stroke: true }),
    arrow('M74 36q22-14 40 6M108 32l6 10-12 2', 'orange', 4)
  ],
  marioneta: [
    s('path', { d: 'M40 22h80M80 12v22', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: 'M44 22l8 66M80 34v14M116 22l-8 66M60 22l6 106M100 22l-6 106', ...SW(1.5) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 58, r: 12 }, 'tan'),
    s('rect', { x: 66, y: 72, width: 28, height: 36, rx: 6 }, 'red', { accent: true }),
    s('path', { d: 'M66 78l-14 10M94 78l14 10M72 108l-6 20M88 108l6 20', ...SW(6) }, 'tan', { stroke: true }),
    s('path', { d: dots([[76, 56], [84, 56]], 2) }, 'dark')
  ],
  'masturbación': [
    s('rect', { x: 34, y: 14, width: 80, height: 132, rx: 4 }, 'brown'),
    s('circle', { cx: 102, cy: 84, r: 6 }, 'yellow'),
    s('path', { d: 'M96 84q-4-10 6-12', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 74h-6l-8 4v40h32V78l-8-4z' }, 'pink', { accent: true }),
    s('circle', { cx: 102, cy: 82, r: 4 }, 'brown'),
    s('path', { d: heart(102, 96, 8) }, 'red')
  ],
  muela: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'pink'),
    s('path', { d: 'M38 46q0-22 22-22q10 0 20 8q10-8 20-8q22 0 22 22q0 30-12 44l-6 42q-2 6-8 0l-10-34q-6-6-12 0l-10 34q-6 6-8 0l-6-42q-12-14-12-44z' }, 'white', { accent: true }),
    s('path', { d: 'M38 46q0-22 22-22q10 0 20 8q10-8 20-8q22 0 22 22q0 30-12 44l-6 42q-2 6-8 0l-10-34q-6-6-12 0l-10 34q-6 6-8 0l-6-42q-12-14-12-44z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M54 42q6-8 14-6', ...SW(4) }, 'sky', { stroke: true })
  ],
  pajarito: [
    s('path', { d: 'M14 120q60-10 132 6', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(124, 122, -60, 18, 6) }, 'green'),
    s('path', { d: 'M52 96l-24 8 26 6z' }, 'blue'),
    s('circle', { cx: 80, cy: 86, r: 30 }, 'yellow', { accent: true }),
    s('ellipse', { cx: 72, cy: 92, rx: 16, ry: 11 }, 'orange'),
    s('path', { d: 'M108 80l12 4-12 4z' }, 'orange'),
    s('circle', { cx: 94, cy: 76, r: 4 }, 'dark'),
    s('path', { d: 'M76 116v6M88 116v6', ...SW(3) }, 'orange', { stroke: true })
  ],
  papeleo: [
    s('rect', { x: 14, y: 124, width: 132, height: 10, rx: 2 }, 'brown'),
    ...paper(22, 70, 44, 54),
    ...paper(28, 40, 40, 30),
    ...paper(80, 30, 52, 94),
    s('path', { d: 'M88 46h36M88 60h36M88 74h30M30 82h30M30 96h30', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 58, y: 18, width: 24, height: 10, rx: 2, transform: 'rotate(-20 70 23)' }, 'red', { accent: true })
  ]
};
