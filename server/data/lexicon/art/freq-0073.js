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
    s('rect', { x: 14, y: 128, width: 132, height: 12, rx: 4 }, 'gray'),
    s('rect', { x: 62, y: 62, width: 40, height: 64, rx: 8, transform: 'rotate(20 82 94)' }, 'dark'),
    s('path', { d: 'M74 76l20 8M70 90l20 8M66 104l20 8', ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 62, cy: 52, rx: 38, ry: 15, transform: 'rotate(28 62 52)' }, 'red', { accent: true }),
    s('path', { d: 'M114 44h28M118 62h24M114 80h28', ...SW(5) }, 'orange', { stroke: true })
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
    s('path', { d: 'M44 82q-14-30 6-58q2 20 14 26q0-24 16-38q16 14 16 38q12-6 14-26q20 28 6 58z' }, 'orange'),
    s('path', { d: 'M60 82q-6-18 6-32q4 12 14 14q10-2 14-14q12 14 6 32z' }, 'yellow'),
    s('path', { d: heart(80, 92, 32) }, 'red', { accent: true })
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
  brasilero: [
    ground(),
    s('path', { d: 'M28 136V20', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 32, y: 24, width: 110, height: 72 }, 'green'),
    s('path', { d: 'M87 30l48 30-48 30-48-30z' }, 'yellow'),
    s('circle', { cx: 87, cy: 60, r: 17 }, 'navy', { accent: true }),
    s('path', { d: 'M71 56q16-6 32 6', ...SW(3) }, 'white', { stroke: true })
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
    s('rect', { x: 80, y: 30, width: 50, height: 50 }, 'yellow'),
    s('rect', { x: 30, y: 80, width: 50, height: 50, ...DASH(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 55, r: 8 }, 'yellow'),
    s('circle', { cx: 105, cy: 80, r: 8 }, 'blue'),
    s('path', { d: dots([[55, 105]], 10) }, 'red', { accent: true })
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
  cisco: [
    s('path', { d: 'M18 136q14-50 62-56q48 6 62 56z' }, 'black'),
    s('path', { d: poly([[44, 112], [56, 104], [62, 116]]) + poly([[84, 96], [98, 92], [96, 106]]) + poly([[104, 120], [118, 114], [116, 128]]) }, 'gray'),
    s('path', { d: ells([[46, 50, 18, 12], [72, 40, 20, 14], [100, 50, 18, 12], [120, 34, 12, 9]]) }, 'gray'),
    s('path', { d: dots([[30, 74], [124, 70], [62, 66], [96, 72], [40, 30]], 3) }, 'dark', { accent: true })
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
    s('path', { d: 'M100 136V56', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M92 58h16', ...SW(6) }, 'gray', { stroke: true })
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
    s('path', { d: heart(80, 64, 40) }, 'red', { accent: true }),
    s('path', { d: 'M14 112h38l8-14 10 32 10-44 10 26h56', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 28l-8-6M120 28l8-6M136 54h10M24 54H14', ...SW(4) }, 'pink', { stroke: true })
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
};
