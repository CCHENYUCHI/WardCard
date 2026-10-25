// Illustration specs for words still undrawn in batches 0047–0051 (see server/scripts/lexicon/art.js)
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
  procurar: [
    ground(),
    ...person(60, 136, 'blue'),
    s('path', { d: 'M70 96l26-46', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: star(112, 36, 18) }, 'yellow', { accent: true }),
    s('path', { d: drop(42, 70, 4) + drop(34, 84, 3) }, 'sky'),
    s('path', { d: 'M94 64l-6 4M104 70l-2 8', ...SW(3) }, 'orange', { stroke: true })
  ],
  'callejón': [
    backdrop('sky'),
    s('path', { d: poly([[14, 14], [64, 46], [64, 112], [14, 146]]) }, 'tan', { accent: true }),
    s('path', { d: poly([[146, 14], [96, 46], [96, 112], [146, 146]]) }, 'brown'),
    s('rect', { x: 64, y: 46, width: 32, height: 66 }, 'gray'),
    s('path', { d: poly([[64, 112], [96, 112], [146, 146], [14, 146]]) }, 'dark'),
    s('path', { d: rects([[26, 46, 12, 16], [26, 90, 12, 16], [46, 58, 8, 12], [46, 92, 8, 12], [122, 46, 12, 16], [122, 90, 12, 16], [106, 58, 8, 12], [106, 92, 8, 12]]) }, 'navy')
  ],
  caracol: [
    ground(140),
    s('path', { d: 'M18 138q0-14 20-16h82v-38a12 12 0 0 1 24 0v38q0 16-16 16z' }, 'tan'),
    s('path', { d: 'M126 76l-6-18M138 76l6-18', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: dots([[120, 56], [144, 56]], 4) }, 'dark'),
    s('circle', { cx: 68, cy: 84, r: 40 }, 'orange', { accent: true }),
    s('path', { d: 'M68 84a6 6 0 0 1 12 0a12 12 0 0 1-24 0a18 18 0 0 1 36 0a24 24 0 0 1-48 0a30 30 0 0 1 60 0', ...SW(4) }, 'brown', { stroke: true })
  ],
  cigarro: [
    s('rect', { x: 24, y: 96, width: 100, height: 22, rx: 10, transform: 'rotate(-20 80 107)' }, 'brown', { accent: true }),
    s('rect', { x: 44, y: 96, width: 12, height: 22, transform: 'rotate(-20 80 107)' }, 'red'),
    s('rect', { x: 120, y: 96, width: 12, height: 22, rx: 4, transform: 'rotate(-20 80 107)' }, 'gray'),
    s('rect', { x: 130, y: 98, width: 4, height: 18, transform: 'rotate(-20 80 107)' }, 'orange'),
    s('path', { d: 'M132 72q-8-10 0-20t0-20M118 62q-6-8 0-16t0-16', ...SW(4) }, 'gray', { stroke: true })
  ],
  clero: [
    s('path', { d: 'M40 136V56a40 40 0 0 1 80 0v80z' }, 'sky'),
    s('path', { d: 'M80 20v24M70 30h20', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M58 136l8-62h28l8 62z' }, 'black', { accent: true }),
    s('circle', { cx: 80, cy: 62, r: 13 }, 'skin'),
    s('rect', { x: 73, y: 74, width: 14, height: 6, rx: 2 }, 'white'),
    s('rect', { x: 68, y: 94, width: 24, height: 18, rx: 2 }, 'red'),
    ground()
  ],
  combo: [
    s('path', { d: burst(114, 112, 30, 16, 9) }, 'yellow'),
    s('path', { d: 'M44 46l60 60', ...SW(10) }, 'tan', { stroke: true }),
    s('rect', { x: 16, y: 26, width: 56, height: 36, rx: 6, transform: 'rotate(-45 44 44)' }, 'brown', { accent: true }),
    s('path', { d: 'M126 70l10-10M138 96h10M100 146l-4 2', ...SW(4) }, 'orange', { stroke: true })
  ],
  comprensible: [
    ...openBook(80, 78, 'cream'),
    s('path', { d: halfRays(80, 42, 22, 30, 7), ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 42, r: 16 }, 'yellow', { accent: true }),
    s('rect', { x: 73, y: 56, width: 14, height: 10, rx: 2 }, 'gray')
  ],
  conceptual: [
    s('path', { d: 'M50 142l24-114M110 142l-24-114M80 112v30', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 28, y: 28, width: 104, height: 84, rx: 2 }, 'white'),
    outline({ x: 28, y: 28, width: 104, height: 84, rx: 2 }),
    s('circle', { cx: 58, cy: 58, r: 16 }, 'red', { accent: true }),
    s('path', { d: poly([[98, 40], [120, 96], [76, 96]]) }, 'blue'),
    s('rect', { x: 40, y: 80, width: 24, height: 20 }, 'yellow')
  ],
  congresista: [
    s('path', { d: dots(seats(62, 8), 7) }, 'gray'),
    s('circle', { cx: 80, cy: 64, r: 12 }, 'skin'),
    s('rect', { x: 64, y: 78, width: 32, height: 34, rx: 10 }, 'navy'),
    s('path', { d: 'M92 84l10-10', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 104, cy: 72, r: 4 }, 'dark'),
    s('path', { d: 'M50 140l8-44h44l8 44z' }, 'brown', { accent: true }),
    s('circle', { cx: 80, cy: 116, r: 8 }, 'yellow')
  ],
  cordial: [
    ground(),
    ...person(44, 136, 'blue'),
    ...person(116, 136, 'green'),
    s('path', { d: 'M58 102l22 6 22-6', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 46, 16) }, 'red', { accent: true })
  ],
  cortada: [
    s('rect', { x: 50, y: 26, width: 38, height: 120, rx: 19 }, 'skin'),
    s('ellipse', { cx: 69, cy: 44, rx: 11, ry: 13 }, 'cream'),
    s('path', { d: 'M54 82l30-10', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: drop(66, 100, 5) }, 'red', { accent: true }),
    s('path', { d: 'M104 100l30-72q8 14 2 34l-20 44z' }, 'gray'),
    s('path', { d: 'M110 104l-12 34', ...SW(10) }, 'brown', { stroke: true })
  ],
  costoso: [
    ground(),
    s('path', { d: ells([[38, 130, 18, 6], [38, 122, 18, 6], [38, 114, 18, 6], [80, 130, 18, 6], [80, 122, 18, 6], [80, 114, 18, 6], [80, 106, 18, 6], [80, 98, 18, 6], [122, 130, 18, 6], [122, 122, 18, 6], [122, 114, 18, 6], [122, 106, 18, 6], [122, 98, 18, 6], [122, 90, 18, 6], [122, 82, 18, 6]]) }, 'orange'),
    s('path', { d: ells([[38, 108, 18, 6], [80, 92, 18, 6], [122, 76, 18, 6]]) }, 'yellow', { accent: true }),
    s('path', { d: poly([[60, 30], [70, 20], [90, 20], [100, 30], [80, 56]]) }, 'sky'),
    s('path', { d: sparkle(116, 36, 10) + sparkle(42, 58, 8) }, 'yellow')
  ],
  criar: [
    ground(),
    ...person(56, 136, 'green', { accent: true }),
    ...person(110, 136, 'yellow', { h: 26, w: 22, r: 9 }),
    s('path', { d: 'M70 100q20-6 30 6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(84, 40, 12) }, 'red')
  ],
  desigual: [
    ground(),
    s('path', { d: poly([[80, 108], [96, 136], [64, 136]]) }, 'gray'),
    s('path', { d: 'M20 128L140 86', ...SW(7) }, 'brown', { stroke: true }),
    s('rect', { x: 22, y: 82, width: 40, height: 40, transform: 'rotate(-19 42 122)' }, 'red', { accent: true }),
    s('circle', { cx: 124, cy: 83, r: 8 }, 'blue')
  ],
  diarrea: [
    ground(),
    ...lean(46, 136, 18, 'blue', { accent: true }),
    s('path', { d: spiral(58, 112), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: drop(40, 64, 4) }, 'sky'),
    s('path', { d: 'M104 54h32v34h-32zM92 92h56q0 30-22 34v10h-12v-10q-22-4-22-34z' }, 'white'),
    s('path', { d: 'M104 54h32v34h-32zM92 92h56q0 30-22 34v10h-12v-10q-22-4-22-34z', ...SW(3) }, 'gray', { stroke: true }),
    arrow('M70 50q14-12 26 0', 'orange', 5)
  ],
  dirigencia: [
    s('path', { d: busts([30, 56, 104, 130], 116, 22, 30) }, 'gray'),
    s('path', { d: dots([[30, 74], [56, 74], [104, 74], [130, 74]], 10) }, 'skin'),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'skin'),
    s('rect', { x: 64, y: 94, width: 32, height: 46, rx: 10 }, 'red', { accent: true }),
    s('path', { d: star(80, 42, 14) }, 'yellow'),
    s('path', { d: 'M14 140h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  'dúo': [
    ground(),
    ...person(54, 136, 'purple', { accent: true }),
    ...person(106, 136, 'orange'),
    ...note(66, 48, 'blue'),
    s('path', { d: 'M40 84h-8M120 84h8', ...SW(3) }, 'dark', { stroke: true })
  ],
  elemental: [
    ground(),
    s('rect', { x: 28, y: 96, width: 40, height: 40, rx: 3 }, 'red', { accent: true }),
    s('rect', { x: 76, y: 96, width: 40, height: 40, rx: 3 }, 'blue'),
    s('path', { d: poly([[52, 94], [92, 94], [72, 58]]) }, 'yellow'),
    s('circle', { cx: 126, cy: 124, r: 12 }, 'green'),
    s('path', { d: dots([[48, 116], [96, 116]], 6) }, 'white')
  ],
  elogio: [
    ground(),
    ...person(44, 136, 'blue'),
    ...person(116, 136, 'green', { accent: true }),
    s('path', { d: bubble(30, 14, 60, 42) }, 'sky'),
    s('path', { d: star(60, 35, 12) }, 'yellow'),
    s('path', { d: sparkle(116, 50, 10) + sparkle(138, 64, 6) + sparkle(96, 60, 6) }, 'yellow')
  ],
  encajar: [
    s('path', { d: 'M18 78h48v30h28V78h48v62H18z' }, 'blue'),
    s('rect', { x: 66, y: 30, width: 28, height: 30, rx: 2 }, 'yellow', { accent: true }),
    s('path', { d: 'M74 108v-4M86 108v-4', ...SW(2) }, 'navy', { stroke: true }),
    arrow('M114 26v38M106 56l8 8 8-8'),
    arrow('M46 26v38M38 56l8 8 8-8')
  ],
  erradicar: [
    s('rect', { x: 14, y: 112, width: 132, height: 34, rx: 4 }, 'brown'),
    s('ellipse', { cx: 70, cy: 112, rx: 18, ry: 5 }, 'dark'),
    s('path', { d: 'M70 92l-10 14M70 92l10 16M70 92v18', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M70 92V60', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(70, 66, -140, 28, 9) + leaflet(70, 60, -40, 28, 9) }, 'green', { accent: true }),
    arrow('M116 100V36M106 46l10-10 10 10')
  ],
  estallido: [
    s('path', { d: burst(80, 80, 66, 34, 12) }, 'orange', { accent: true }),
    s('path', { d: burst(80, 80, 40, 22, 10) }, 'yellow'),
    s('circle', { cx: 80, cy: 80, r: 14 }, 'white'),
    s('path', { d: dots([[24, 30], [140, 36], [26, 136], [138, 132]], 4) }, 'red')
  ],
  falsedad: [
    s('path', { d: 'M26 70q2-34 36-34t34 30q-18-10-34-10t-36 14z' }, 'brown'),
    s('circle', { cx: 60, cy: 82, r: 34 }, 'skin'),
    s('path', { d: 'M88 78h50l6 5-6 5H88z' }, 'tan', { accent: true }),
    s('path', { d: leaflet(120, 78, -70, 16, 5) }, 'green'),
    s('path', { d: dots([[50, 74], [74, 74]], 4) }, 'dark'),
    s('path', { d: 'M48 100q12 8 24 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  flauta: [
    s('rect', { x: 14, y: 84, width: 132, height: 14, rx: 7, transform: 'rotate(-15 80 91)' }, 'gray', { accent: true }),
    s('path', { d: dots([[34, 91], [70, 91], [86, 91], [102, 91], [118, 91]], 3), transform: 'rotate(-15 80 91)' }, 'dark'),
    ...note(36, 54, 'purple'),
    ...note(104, 132, 'blue')
  ],
  heleno: [
    backdrop('sky'),
    s('path', { d: 'M18 52L80 24l62 28z' }, 'tan', { accent: true }),
    s('rect', { x: 20, y: 52, width: 120, height: 10 }, 'gray'),
    s('path', { d: rects([[28, 66, 12, 60], [56, 66, 12, 60], [92, 66, 12, 60], [120, 66, 12, 60]]) }, 'cream'),
    s('rect', { x: 16, y: 126, width: 128, height: 12 }, 'gray')
  ],
  'imitación': [
    s('rect', { x: 14, y: 40, width: 60, height: 74, rx: 3 }, 'yellow', { accent: true }),
    s('rect', { x: 22, y: 48, width: 44, height: 58 }, 'sky'),
    s('circle', { cx: 44, cy: 70, r: 11 }, 'red'),
    s('path', { d: 'M22 106l20-20 24 20z' }, 'green'),
    s('rect', { x: 86, y: 46, width: 60, height: 74, rx: 3, transform: 'rotate(8 116 83)' }, 'gray'),
    s('rect', { x: 94, y: 54, width: 44, height: 58, transform: 'rotate(8 116 83)' }, 'cream'),
    s('circle', { cx: 116, cy: 76, r: 11, transform: 'rotate(8 116 83)' }, 'pink'),
    s('path', { d: 'M94 112l20-20 24 20z', transform: 'rotate(8 116 83)' }, 'mint')
  ],
  impecable: [
    backdrop('sky'),
    s('path', { d: 'M58 30q22 16 44 0l34 20-12 24-14-8v66H50V66l-14 8-12-24z' }, 'white'),
    s('path', { d: 'M58 30q22 16 44 0l34 20-12 24-14-8v66H50V66l-14 8-12-24z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[80, 62], [80, 82], [80, 102]], 3) }, 'gray'),
    s('path', { d: sparkle(118, 108, 12) + sparkle(36, 112, 8) + sparkle(128, 28, 8) }, 'yellow', { accent: true })
  ],
  improbable: [
    backdrop('sky'),
    s('path', { d: ells([[36, 124, 18, 8], [120, 126, 22, 9]]) }, 'white'),
    s('path', { d: 'M58 96v14M70 98v14M92 98v14M102 96v14', ...SW(6) }, 'pink', { stroke: true }),
    s('ellipse', { cx: 80, cy: 84, rx: 34, ry: 22 }, 'pink', { accent: true }),
    s('circle', { cx: 114, cy: 72, r: 14 }, 'pink'),
    s('path', { d: ells([[126, 76, 6, 5]]) + 'M106 60l-2-10 10 6z' }, 'red'),
    s('path', { d: 'M70 66q-14-28 22-36q-8 18-8 36z' }, 'white'),
    s('path', { d: dots([[114, 68]], 2) }, 'dark')
  ],
  inmobiliario: [
    ground(),
    s('rect', { x: 26, y: 76, width: 60, height: 60 }, 'cream'),
    s('path', { d: 'M18 80l38-36 38 36z' }, 'red'),
    s('rect', { x: 48, y: 106, width: 16, height: 30 }, 'brown'),
    s('path', { d: 'M118 136V64', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 98, y: 58, width: 42, height: 30, rx: 3 }, 'orange', { accent: true }),
    s('path', { d: 'M108 80l11-12 11 12v-1M112 78v4h14v-4', ...SW(3) }, 'white', { stroke: true })
  ],
  'inserción': [
    s('rect', { x: 28, y: 78, width: 104, height: 66, rx: 8 }, 'gray'),
    s('rect', { x: 44, y: 92, width: 72, height: 8, rx: 3 }, 'dark'),
    s('rect', { x: 54, y: 22, width: 52, height: 74, rx: 5 }, 'blue', { accent: true }),
    s('rect', { x: 62, y: 34, width: 14, height: 12, rx: 2 }, 'yellow'),
    s('rect', { x: 28, y: 96, width: 104, height: 48, rx: 8 }, 'gray'),
    s('path', { d: dots([[60, 122], [80, 122], [100, 122]], 5) }, 'green'),
    arrow('M128 24v40M120 56l8 8 8-8', 'orange', 5)
  ],
  invadir: [
    s('rect', { x: 14, y: 20, width: 66, height: 120 }, 'tan'),
    s('rect', { x: 80, y: 20, width: 66, height: 120 }, 'mint'),
    s('path', { d: 'M80 20v120', ...DASH(4) }, 'dark', { stroke: true }),
    arrow('M26 46h80M96 36l10 10-10 10', 'red', 7),
    arrow('M26 80h96M112 70l10 10-10 10', 'red', 7),
    arrow('M26 114h80M96 104l10 10-10 10', 'red', 7),
    s('path', { d: leaflet(120, 132, -90, 14, 5) + leaflet(132, 50, -90, 12, 4) }, 'green', { accent: true })
  ],
  irracional: [
    s('circle', { cx: 80, cy: 92, r: 42 }, 'skin', { accent: true }),
    s('path', { d: spiral(60, 86) + spiral(94, 86), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 114q6-6 12 0t12 0 12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 34q10-16 20 0t20 0 20 0 20 0M54 22q8-10 16 0t16 0 16 0', ...SW(4) }, 'purple', { stroke: true })
  ],
  ji: [
    s('path', { d: 'M62 24h36v10q-4 4-4 10q30 10 30 46t-30 40v8h10v8H62v-8h10v-8q-30-4-30-40t30-46q0-6-4-10z' }, 'orange', { accent: true }),
    s('path', { d: 'M48 34q-14 6-6 30M112 34q14 6 6 30', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M44 82h72', ...SW(6) }, 'black', { stroke: true }),
    s('path', { d: 'M52 98h56', ...DASH(4, '4 4') }, 'black', { stroke: true }),
    s('path', { d: 'M56 68h48', ...DASH(4, '4 4') }, 'black', { stroke: true })
  ],
  laurel: [
    s('path', { d: laurel(80, 76, 46, 20, 7) }, 'green', { accent: true }),
    s('path', { d: 'M62 126l18-10 18 10M68 134l12-18 12 18', ...SW(5) }, 'red', { stroke: true }),
    s('circle', { cx: 80, cy: 118, r: 6 }, 'red')
  ],
  lecho: [
    s('rect', { x: 14, y: 30, width: 132, height: 30 }, 'sky'),
    s('path', { d: 'M14 60h36q10 50 30 50t30-50h36v86H14z' }, 'brown'),
    s('path', { d: 'M50 60q10 50 30 50t30-50z' }, 'blue', { accent: true }),
    s('path', { d: 'M58 76q6-4 12 0t12 0 12 0', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: ells([[70, 104, 6, 4], [84, 106, 7, 4], [96, 98, 5, 3]]) }, 'gray'),
    s('path', { d: leaflet(28, 60, -100, 18, 5) + leaflet(132, 60, -80, 18, 5) }, 'green')
  ],
  led: [
    s('path', { d: halfRays(80, 62, 40, 54, 7), ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M58 96V62a22 22 0 0 1 44 0v34z' }, 'red', { accent: true }),
    s('rect', { x: 52, y: 94, width: 56, height: 10, rx: 3 }, 'red'),
    s('path', { d: 'M70 104v40M90 104v30', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M68 60q0-12 10-14', ...SW(4) }, 'pink', { stroke: true })
  ],
  licor: [
    s('path', { d: 'M38 140q-16 0-16-16v-30q0-26 22-32V36h16v26q22 6 22 32v30q0 16-16 16z' }, 'red', { accent: true }),
    s('rect', { x: 42, y: 22, width: 20, height: 16, rx: 3 }, 'brown'),
    s('rect', { x: 28, y: 92, width: 48, height: 26, rx: 3 }, 'cream'),
    s('path', { d: 'M102 92h32q0 22-16 24q-16-2-16-24zM118 116v20M106 138h24', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 98h28q-2 14-14 16q-12-2-14-16z' }, 'red')
  ],
  linaje: [
    s('path', { d: 'M80 140V90M80 90L46 64M80 90l34-26M46 64L30 40M46 64l16-24M114 64l-16-24M114 64l16-24', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: dots([[30, 34], [62, 34], [98, 34], [130, 34]], 11) }, 'gray'),
    s('path', { d: dots([[46, 64], [114, 64]], 12) }, 'skin'),
    s('circle', { cx: 80, cy: 98, r: 14 }, 'orange', { accent: true }),
    ground(140)
  ],
  'lógicamente': [
    ground(),
    s('rect', { x: 18, y: 96, width: 12, height: 40, rx: 2, transform: 'rotate(60 30 136)' }, 'gray'),
    s('rect', { x: 44, y: 92, width: 12, height: 44, rx: 2, transform: 'rotate(40 56 136)' }, 'blue'),
    s('rect', { x: 72, y: 88, width: 12, height: 48, rx: 2, transform: 'rotate(18 84 136)' }, 'blue', { accent: true }),
    s('rect', { x: 102, y: 84, width: 12, height: 52, rx: 2 }, 'navy'),
    s('rect', { x: 128, y: 80, width: 12, height: 56, rx: 2 }, 'navy'),
    arrow('M26 52q50-30 100 0M116 42l10 10-12 4', 'orange', 5)
  ],
  magno: [
    ground(),
    s('rect', { x: 50, y: 108, width: 60, height: 28 }, 'gray'),
    s('circle', { cx: 80, cy: 46, r: 14 }, 'tan'),
    s('rect', { x: 62, y: 62, width: 36, height: 46, rx: 10 }, 'tan'),
    s('path', { d: 'M66 34l4-14 10 8 10-8 4 14z' }, 'yellow', { accent: true }),
    ...person(134, 136, 'blue', { h: 22, w: 16, r: 7 })
  ],
  mamar: [
    s('circle', { cx: 58, cy: 84, r: 38 }, 'skin'),
    s('path', { d: 'M30 62q6-28 30-26q6 0 6 6', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 80q5-4 10 0M62 80q5-4 10 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[40, 96], [74, 96]], 6) }, 'pink'),
    s('rect', { x: 100, y: 88, width: 46, height: 26, rx: 8, transform: 'rotate(-20 100 101)' }, 'white'),
    s('rect', { x: 118, y: 88, width: 28, height: 26, rx: 6, transform: 'rotate(-20 100 101)' }, 'cream'),
    outline({ x: 100, y: 88, width: 46, height: 26, rx: 8, transform: 'rotate(-20 100 101)' }, 'blue'),
    s('path', { d: 'M100 96l-14 6 14 8z' }, 'pink', { accent: true })
  ],
  marginal: [
    s('circle', { cx: 70, cy: 80, r: 48 }, 'mint'),
    s('path', { d: dots([[50, 62], [70, 54], [90, 62], [56, 84], [78, 80], [96, 92], [62, 104], [82, 106]], 8) }, 'green'),
    s('path', { d: ring(70, 80, 48), ...SW(3) }, 'green', { stroke: true }),
    s('circle', { cx: 134, cy: 126, r: 9 }, 'orange', { accent: true })
  ],
  'milímetro': [
    s('rect', { x: 14, y: 96, width: 132, height: 34, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M24 96v18M44 96v10M64 96v18M84 96v10M104 96v18M124 96v10M28 96v5M32 96v5M36 96v5M40 96v5', ...SW(2) }, 'dark', { stroke: true }),
    s('circle', { cx: 48, cy: 58, r: 28 }, 'sky'),
    s('path', { d: ring(48, 58, 28) + 'M68 78l22 22', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 54v20M38 54v12M46 54v12M54 54v12M62 54v20', ...SW(2) }, 'dark', { stroke: true })
  ],
  minimizar: [
    s('rect', { x: 66, y: 66, width: 28, height: 28, rx: 3 }, 'blue', { accent: true }),
    s('rect', { x: 20, y: 20, width: 120, height: 120, rx: 6, ...DASH(3) }, 'gray', { stroke: true }),
    arrow('M28 28l28 28M42 56h14V42'),
    arrow('M132 28l-28 28M118 56h-14V42'),
    arrow('M28 132l28-28M42 104h14v14'),
    arrow('M132 132l-28-28M118 104h-14v14')
  ],
  monitoreo: [
    s('rect', { x: 20, y: 44, width: 120, height: 78, rx: 6 }, 'dark'),
    s('rect', { x: 28, y: 52, width: 104, height: 62, rx: 2 }, 'navy'),
    s('path', { d: 'M32 84h22l8-18 10 34 10-26 6 10h40', ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M68 122l-6 18h36l-6-18', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 92, y: 16, width: 36, height: 16, rx: 4 }, 'gray'),
    s('circle', { cx: 122, cy: 24, r: 5 }, 'red')
  ],
  obesidad: [
    s('rect', { x: 26, y: 46, width: 108, height: 96, rx: 14 }, 'gray'),
    s('path', { d: 'M48 86a32 32 0 0 1 64 0z' }, 'white'),
    s('path', { d: 'M80 86l24-22', ...SW(4) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M54 76l4 2M66 64l2 4M80 60v4M94 64l-2 4', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 104h32v28H40zM88 104h32v28H88z' }, 'dark'),
    s('path', { d: 'M38 30q42-14 84 0', ...SW(4) }, 'orange', { stroke: true })
  ],
  objetividad: [
    s('path', { d: 'M28 40q52-36 104 0q-52 36-104 0z' }, 'white'),
    s('path', { d: 'M28 40q52-36 104 0q-52 36-104 0z', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 40, r: 12 }, 'blue', { accent: true }),
    s('path', { d: 'M80 70v66M56 136h48M30 82h100M30 82l-12 26M30 82l12 26M130 82l-12 26M130 82l12 26', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 108h32a16 12 0 0 1-32 0zM114 108h32a16 12 0 0 1-32 0z' }, 'yellow')
  ],
  ocasionalmente: [
    s('rect', { x: 18, y: 28, width: 124, height: 112, rx: 8 }, 'white'),
    outline({ x: 18, y: 28, width: 124, height: 112, rx: 8 }),
    s('rect', { x: 18, y: 28, width: 124, height: 22, rx: 6 }, 'red'),
    s('path', { d: grid(28, 60, 6, 4, 12, 12, 18, 19) }, 'gray'),
    s('rect', { x: 81, y: 96, width: 16, height: 16, rx: 3 }, 'green', { accent: true }),
    s('path', { d: 'M48 22v12M112 22v12', ...SW(5) }, 'dark', { stroke: true })
  ],
  ordenado: [
    s('path', { d: 'M18 136h124M18 80h124', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: rects([[24, 92, 14, 42], [40, 92, 14, 42], [56, 92, 14, 42]]) }, 'blue', { accent: true }),
    s('path', { d: rects([[74, 92, 14, 42], [90, 92, 14, 42]]) }, 'red'),
    s('path', { d: rects([[108, 92, 14, 42], [124, 92, 14, 42]]) }, 'green'),
    s('path', { d: rects([[24, 36, 30, 42], [62, 36, 30, 42], [100, 36, 30, 42]]) }, 'tan'),
    s('path', { d: 'M24 50h30M62 50h30M100 50h30', ...SW(3) }, 'brown', { stroke: true })
  ],
  paloma: [
    backdrop('sky'),
    s('path', { d: 'M30 96q10-34 60-30l20-14q14-4 20 8l10 4-10 4q-2 30-34 40H52z' }, 'gray', { accent: true }),
    s('path', { d: 'M54 86q20 18 46 8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 96l-14 14 30-6z' }, 'dark'),
    s('path', { d: 'M112 66q4 10-6 18', ...SW(5) }, 'purple', { stroke: true }),
    s('circle', { cx: 122, cy: 58, r: 3 }, 'dark'),
    s('path', { d: 'M78 112v18M92 108v20', ...SW(4) }, 'pink', { stroke: true })
  ],
  pancho: [
    s('path', { d: 'M24 136V50M136 136V50', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M24 64q56 60 112 0', ...SW(10) }, 'orange', { stroke: true, accent: true }),
    s('circle', { cx: 46, cy: 76, r: 11 }, 'skin'),
    s('path', { d: 'M56 86q28 12 52 0', ...SW(14) }, 'blue', { stroke: true }),
    s('path', { d: 'M40 80q2-8 10-6M44 76q4 2 8 0', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 120, cy: 28, r: 12 }, 'yellow'),
    ground()
  ],
  'parásito': [
    s('ellipse', { cx: 80, cy: 88, rx: 34, ry: 40 }, 'brown', { accent: true }),
    s('path', { d: 'M48 70l-24-12M46 88H20M48 106l-22 14M54 120l-14 18M112 70l24-12M114 88h26M112 106l22 14M106 120l14 18', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 40, r: 14 }, 'dark'),
    s('path', { d: 'M74 28l-4-10M86 28l4-10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: ells([[70, 80, 8, 12]]) }, 'tan')
  ],
  pavo: [
    ground(),
    s('path', { d: wedge(72, 96, 60, 200, 340) }, 'orange'),
    s('path', { d: wedge(72, 96, 44, 200, 340) }, 'red'),
    s('path', { d: wedge(72, 96, 28, 200, 340) }, 'yellow'),
    s('ellipse', { cx: 76, cy: 102, rx: 28, ry: 24 }, 'brown', { accent: true }),
    s('path', { d: 'M98 96q10-26 20-30', ...SW(10) }, 'brown', { stroke: true }),
    s('path', { d: 'M124 66l10 4-10 4zM118 72q0 12 4 14', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M68 124v12M84 124v12', ...SW(4) }, 'orange', { stroke: true })
  ],
  pisar: [
    s('path', { d: 'M14 124h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 36h36v48q30 2 42 18q6 10-6 14H40z' }, 'red', { accent: true }),
    s('rect', { x: 36, y: 112, width: 84, height: 10, rx: 4 }, 'dark'),
    s('path', { d: 'M40 36h36v10H40z' }, 'white'),
    s('path', { d: 'M24 112l-8-8M30 100l-12-4M132 112l8-8M128 100l12-4', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: ells([[50, 138, 10, 4], [86, 140, 16, 5]]) }, 'brown')
  ],
  presuntamente: [
    s('circle', { cx: 60, cy: 52, r: 18 }, 'dark'),
    s('rect', { x: 36, y: 74, width: 48, height: 66, rx: 16 }, 'dark'),
    s('path', { d: 'M44 50h32', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 108, cy: 74, r: 24 }, 'sky', { accent: true }),
    s('path', { d: ring(108, 74, 24) + 'M124 92l20 22', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: dots([[100, 66], [114, 82]], 3) }, 'white')
  ],
  primitivo: [
    ground(),
    s('path', { d: 'M78 136l-14-30M82 136l14-30M66 136l28-26', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 118q-24-14-8-44q4 14 10 16q-2-16 10-26q-2 20 8 30q4 18-20 24z' }, 'orange', { accent: true }),
    s('path', { d: 'M80 118q-10-8-2-22q10 10 10 22z' }, 'yellow'),
    s('path', { d: 'M24 128l20-58', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: poly([[36, 58], [56, 64], [48, 82], [34, 78]]) }, 'gray'),
    s('path', { d: 'M110 136l12-36q10 4 12 16l-4 20z' }, 'tan')
  ],
  radicalmente: [
    s('rect', { x: 14, y: 84, width: 132, height: 62, rx: 4 }, 'brown'),
    s('path', { d: 'M80 84l-24 18-20 30M80 84l22 20 16 32M80 84v54M60 98l-24 4M100 102l26-2', ...SW(5) }, 'tan', { stroke: true, accent: true }),
    s('path', { d: 'M80 84V54', ...SW(10) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 42, r: 28 }, 'green'),
    s('path', { d: 'M14 84h132', ...SW(4) }, 'green', { stroke: true })
  ],
  'reclamación': [
    ground(),
    ...person(48, 136, 'blue'),
    s('path', { d: 'M62 100l18-18', ...SW(7) }, 'skin', { stroke: true }),
    ...paper(76, 62, 26, 32),
    s('path', { d: burst(116, 46, 28, 18, 9) }, 'red', { accent: true }),
    s('path', { d: 'M108 40l16 12M124 40l-16 12', ...SW(4) }, 'white', { stroke: true })
  ],
  remera: [
    s('path', { d: 'M60 30q20 14 40 0l38 20-14 26-16-8v68H52V68l-16 8-14-26z' }, 'red', { accent: true }),
    s('path', { d: 'M60 30q20 14 40 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M38 66l8-4M122 66l-8-4', ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 84, r: 12 }, 'yellow')
  ],
  regir: [
    s('path', { d: 'M44 136V44q36-20 72 0v92z' }, 'red'),
    s('rect', { x: 38, y: 92, width: 84, height: 18, rx: 4 }, 'purple'),
    s('circle', { cx: 80, cy: 58, r: 12 }, 'skin'),
    s('rect', { x: 66, y: 70, width: 28, height: 30, rx: 8 }, 'navy'),
    s('path', { d: 'M68 46l2-14 10 8 10-8 2 14z' }, 'yellow', { accent: true }),
    s('path', { d: 'M100 98l14-40', ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 115, cy: 54, r: 6 }, 'yellow'),
    s('path', { d: 'M38 136h84', ...SW(4) }, 'brown', { stroke: true })
  ],
  ring: [
    s('path', { d: poly([[14, 112], [146, 112], [134, 136], [26, 136]]) }, 'blue'),
    s('path', { d: 'M24 112V44M136 112V44', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 56h112M24 74h112M24 92h112', ...SW(3) }, 'red', { stroke: true, accent: true }),
    s('path', { d: ells([[56, 104, 12, 8], [104, 104, 12, 8]]) }, 'red'),
    s('path', { d: dots([[24, 44], [136, 44]], 6) }, 'dark')
  ],
  saneamiento: [
    s('rect', { x: 14, y: 14, width: 132, height: 30 }, 'gray'),
    s('rect', { x: 14, y: 44, width: 132, height: 102 }, 'brown'),
    s('rect', { x: 34, y: 44, width: 22, height: 50 }, 'dark'),
    s('path', { d: 'M30 106h100q12 0 12 12v28', ...SW(18) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 106h88q4 0 4 6v34', ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('ellipse', { cx: 45, cy: 44, rx: 18, ry: 5 }, 'dark'),
    s('path', { d: 'M70 30h60', ...DASH(4, '10 8') }, 'white', { stroke: true })
  ],
  semanario: [
    s('rect', { x: 26, y: 18, width: 108, height: 124, rx: 4 }, 'white'),
    outline({ x: 26, y: 18, width: 108, height: 124, rx: 4 }),
    s('rect', { x: 36, y: 28, width: 88, height: 14, rx: 2 }, 'dark'),
    s('path', { d: rects([[36, 50, 10, 10], [49, 50, 10, 10], [62, 50, 10, 10], [75, 50, 10, 10], [88, 50, 10, 10], [101, 50, 10, 10]]) }, 'gray'),
    s('rect', { x: 114, y: 50, width: 10, height: 10 }, 'red', { accent: true }),
    s('rect', { x: 36, y: 70, width: 40, height: 34 }, 'sky'),
    s('path', { d: 'M84 74h40M84 86h40M84 98h30M36 116h88M36 128h70', ...SW(4) }, 'gray', { stroke: true })
  ],
  senior: [
    ground(),
    s('circle', { cx: 70, cy: 54, r: 14 }, 'skin'),
    s('path', { d: 'M56 50q2-16 14-16t14 16', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 54, y: 70, width: 32, height: 66, rx: 10 }, 'purple', { accent: true }),
    s('path', { d: 'M86 90l18 10', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M104 136V96q0-10 10-10', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M62 54h6M74 54h6', ...SW(2) }, 'dark', { stroke: true })
  ],
  soberbia: [
    s('rect', { x: 44, y: 106, width: 72, height: 38 }, 'gray'),
    s('circle', { cx: 84, cy: 48, r: 13 }, 'skin'),
    s('path', { d: 'M94 44l10-8', ...SW(4) }, 'skin', { stroke: true }),
    s('rect', { x: 66, y: 62, width: 28, height: 44, rx: 9 }, 'purple', { accent: true }),
    s('path', { d: 'M66 72l-10 12 10 10M94 72l10 12-10 10', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M78 44h6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: busts([24, 140], 146, 14, 18) + dots([[24, 120], [140, 120]], 6) }, 'tan')
  ],
  sordo: [
    s('path', { d: 'M60 128q-14 0-14-14q0-14 10-22q14-14 14-34a24 24 0 0 0-48 0', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M24 58a34 34 0 0 1 68 0q0 26-18 40q-8 6-8 16q0 20-18 20', ...SW(8) }, 'tan', { stroke: true, accent: true }),
    s('path', { d: 'M106 50q10 14 0 28M120 40q18 24 0 48M134 30q24 34 0 68', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 32l40 76', ...SW(7) }, 'red', { stroke: true })
  ],
  suegro: [
    ground(),
    s('circle', { cx: 80, cy: 58, r: 18 }, 'skin'),
    s('path', { d: 'M62 54q0-22 18-22t18 22q-6-10-18-10t-18 10z' }, 'gray'),
    s('path', { d: 'M70 66q10 6 20 0', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: ring(72, 56, 5) + ring(88, 56, 5) + 'M77 56h6', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 58, y: 80, width: 44, height: 56, rx: 14 }, 'brown', { accent: true }),
    s('path', { d: 'M76 80l4 22 4-22z' }, 'red'),
    s('path', { d: ring(124, 52, 10), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: ring(136, 52, 10), ...SW(4) }, 'yellow', { stroke: true })
  ],
  'sábana': [
    s('path', { d: 'M14 30q66 12 132 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 34q52 8 104 0v94q-12-8-26 0t-26 0-26 0-26 0z' }, 'sky', { accent: true }),
    s('path', { d: 'M28 60q52 8 104 0M28 90q52 8 104 0', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: rects([[34, 26, 6, 14], [78, 30, 6, 14], [122, 26, 6, 14]]) }, 'brown'),
    s('path', { d: 'M14 30v116M146 30v116', ...SW(4) }, 'gray', { stroke: true })
  ],
  'sótano': [
    s('path', { d: 'M24 64l56-42 56 42z' }, 'red'),
    s('rect', { x: 34, y: 62, width: 92, height: 38 }, 'cream'),
    s('rect', { x: 14, y: 100, width: 132, height: 46 }, 'brown'),
    s('rect', { x: 34, y: 104, width: 92, height: 38 }, 'tan', { accent: true }),
    s('path', { d: 'M54 102v10h10v10h10v10h10v10', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 108, cy: 118, r: 6 }, 'yellow'),
    s('rect', { x: 92, y: 72, width: 18, height: 18 }, 'sky')
  ],
  textura: [
    s('rect', { x: 18, y: 18, width: 100, height: 100, rx: 8 }, 'orange', { accent: true }),
    s('path', { d: 'M28 34q8-8 16 0t16 0 16 0 16 0 16 0M28 54q8-8 16 0t16 0 16 0 16 0 16 0M28 74q8-8 16 0t16 0 16 0 16 0 16 0M28 94q8-8 16 0t16 0 16 0 16 0 16 0', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M150 150l-30-30q-4-14 6-18l-12-24a7 7 0 0 1 12-6l18 28q14-2 20 8l-2 42z' }, 'skin'),
    s('path', { d: 'M100 116a14 14 0 0 1 20-4', ...SW(3) }, 'tan', { stroke: true })
  ],
  'transcripción': [
    s('circle', { cx: 32, cy: 68, r: 18 }, 'skin'),
    s('path', { d: 'M54 56q8 12 0 24M64 48q14 20 0 40', ...SW(4) }, 'gray', { stroke: true }),
    arrow('M74 68h14M82 60l8 8-8 8', 'orange', 5),
    ...paper(96, 30, 50, 76),
    s('path', { d: 'M104 44h34M104 56h34M104 68h28M104 80h34M104 92h20', ...SW(4) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M108 136l20-30', ...SW(6) }, 'yellow', { stroke: true })
  ],
  tuberculosis: [
    s('path', { d: 'M80 22v40M80 56l-14 14M80 56l14 14', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M68 64q-36-4-44 40q-4 30 14 32q24 2 30-20z' }, 'pink', { accent: true }),
    s('path', { d: 'M92 64q36-4 44 40q4 30-14 32q-24 2-30-20z' }, 'pink'),
    s('path', { d: dots([[46, 92], [56, 112], [40, 116], [110, 90], [118, 112], [104, 122]], 5) }, 'brown')
  ],
  urbanismo: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 6 }, 'gray'),
    s('path', { d: rects([[22, 22, 34, 34], [64, 22, 34, 34], [22, 104, 34, 34], [106, 64, 32, 32]]) }, 'tan'),
    s('path', { d: rects([[106, 22, 32, 34], [64, 104, 34, 34]]) }, 'sky'),
    s('rect', { x: 22, y: 64, width: 76, height: 32 }, 'green', { accent: true }),
    s('rect', { x: 106, y: 104, width: 32, height: 34 }, 'orange'),
    s('path', { d: dots([[40, 80], [60, 76], [82, 84]], 6) }, 'mint')
  ],
  ventilador: [
    s('path', { d: 'M80 98v36M54 138h52', ...SW(8) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 62, r: 46 }, 'sky'),
    s('path', { d: leaflet(80, 62, -90, 40, 14) + leaflet(80, 62, 30, 40, 14) + leaflet(80, 62, 150, 40, 14) }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 62, r: 9 }, 'dark'),
    s('path', { d: ring(80, 62, 46), ...SW(4) }, 'gray', { stroke: true })
  ],
  veredicto: [
    s('rect', { x: 50, y: 116, width: 76, height: 20, rx: 6 }, 'brown'),
    s('path', { d: 'M60 76l40-40', ...SW(8) }, 'tan', { stroke: true }),
    s('rect', { x: 18, y: 54, width: 60, height: 28, rx: 6, transform: 'rotate(-45 48 68)' }, 'brown', { accent: true }),
    s('path', { d: 'M70 104l-8-10M88 100v-12M106 104l8-10', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M30 140h116', ...SW(4) }, 'gray', { stroke: true })
  ],
  wiki: [
    ...paper(40, 22, 80, 104),
    s('path', { d: 'M52 40h56M52 56h56M52 72h40M52 88h56M52 104h32', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 138l30-34', ...SW(8) }, 'red', { stroke: true }),
    s('path', { d: 'M142 138l-30-34', ...SW(8) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M80 146V112', ...SW(8) }, 'green', { stroke: true }),
    s('path', { d: dots([[48, 104], [112, 104], [80, 112]], 3) }, 'dark')
  ],
  yerba: [
    s('path', { d: 'M50 70q-14 30 4 60q26 14 52 0q18-30 4-60z' }, 'brown', { accent: true }),
    s('path', { d: 'M48 70h64', ...SW(6) }, 'yellow', { stroke: true }),
    s('ellipse', { cx: 80, cy: 72, rx: 28, ry: 6 }, 'green'),
    s('path', { d: 'M86 72l26-56', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: leaflet(30, 136, -60, 22, 8) + leaflet(130, 136, -120, 22, 8) + leaflet(26, 110, -20, 18, 6) }, 'green')
  ],
  'aclaración': [
    s('path', { d: ells([[36, 70, 22, 16], [56, 62, 18, 16], [48, 80, 22, 12]]) }, 'gray'),
    arrow('M74 74h16M82 66l8 8-8 8', 'orange', 5),
    s('path', { d: rays(122, 74, 22, 30, 8), ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 122, cy: 74, r: 16 }, 'yellow', { accent: true }),
    s('path', { d: 'M24 118h44M92 118h44M24 132h36M92 132h36', ...SW(4) }, 'gray', { stroke: true })
  ],
  adelantar: [
    s('rect', { x: 14, y: 60, width: 132, height: 80, rx: 4 }, 'dark'),
    s('path', { d: 'M20 100h20M56 100h20M92 100h20M128 100h14', ...SW(3) }, 'white', { stroke: true }),
    ...car(20, 108, 'blue'),
    ...car(80, 76, 'red', 'sky', { accent: true }),
    arrow('M30 82q20-10 40 0M62 74l8 8-10 4', 'yellow', 4)
  ],
  admirable: [
    s('path', { d: burst(80, 52, 36, 26, 14) }, 'yellow'),
    s('circle', { cx: 80, cy: 52, r: 22 }, 'orange', { accent: true }),
    s('path', { d: star(80, 52, 14) }, 'yellow'),
    s('path', { d: 'M66 72l-10 30M94 72l10 30', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: busts([26, 54, 106, 134], 146, 22, 26) + dots([[26, 112], [54, 112], [106, 112], [134, 112]], 10) }, 'skin'),
    s('path', { d: 'M18 100l-4-8M34 100l4-8M126 100l-4-8M142 100l4-8', ...SW(3) }, 'blue', { stroke: true })
  ],
  'afiliación': [
    s('path', { d: ring(68, 80, 50), ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: busts([46, 70, 94], 108, 20, 26) + dots([[46, 72], [70, 72], [94, 72]], 9) }, 'blue'),
    s('path', { d: busts([60, 84], 124, 18, 20) + dots([[60, 98], [84, 98]], 8) }, 'green'),
    s('circle', { cx: 134, cy: 48, r: 9 }, 'skin'),
    s('rect', { x: 124, y: 60, width: 20, height: 26, rx: 7 }, 'orange', { accent: true }),
    arrow('M126 100q-6 14-18 14M110 106l-4 8 8 2', 'orange', 4)
  ],
  afortunado: [
    s('path', { d: 'M80 82q10 40 34 60', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: heart(80, 62, 18) }, 'green', { accent: true }),
    s('path', { d: heart(80, 62, 18), transform: 'rotate(90 80 80)' }, 'green'),
    s('path', { d: heart(80, 62, 18), transform: 'rotate(180 80 80)' }, 'green'),
    s('path', { d: heart(80, 62, 18), transform: 'rotate(270 80 80)' }, 'green'),
    s('path', { d: sparkle(130, 30, 10) + sparkle(28, 130, 8) }, 'yellow')
  ],
  ansioso: [
    s('circle', { cx: 78, cy: 84, r: 44 }, 'skin', { accent: true }),
    s('path', { d: ells([[62, 78, 9, 11], [94, 78, 9, 11]]) }, 'white'),
    s('path', { d: dots([[62, 78], [94, 78]], 4) }, 'dark'),
    s('path', { d: 'M54 62l14-6M102 62l-14-6M62 106q4-4 8 0t8 0 8 0 8 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: drop(130, 60, 6) + drop(26, 70, 5) }, 'sky'),
    s('path', { d: 'M112 24l8 10-8 6 8 10M40 22l-6 10 8 4-6 10', ...SW(3) }, 'orange', { stroke: true })
  ],
  arcilla: [
    s('rect', { x: 26, y: 120, width: 108, height: 18, rx: 4 }, 'gray'),
    s('ellipse', { cx: 80, cy: 118, rx: 50, ry: 8 }, 'dark'),
    s('path', { d: 'M58 116q-14-30 6-50q4-10-4-18h40q-8 8-4 18q20 20 6 50z' }, 'brown', { accent: true }),
    s('path', { d: 'M28 72q14 6 30 8M132 72q-14 6-30 8', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M66 88q14 4 28 0', ...SW(3) }, 'tan', { stroke: true })
  ],
  aspirar: [
    s('rect', { x: 92, y: 90, width: 46, height: 36, rx: 14 }, 'red', { accent: true }),
    s('path', { d: dots([[100, 128], [130, 128]], 7) }, 'dark'),
    s('path', { d: 'M96 100q-30-10-40-50L46 20', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 20l-20 110', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 12, y: 128, width: 32, height: 10, rx: 3 }, 'dark'),
    s('path', { d: dots([[54, 134], [64, 130], [74, 136]], 3) }, 'brown'),
    s('path', { d: 'M48 124l-6-4M52 132h-6', ...SW(2) }, 'gray', { stroke: true })
  ],
  'atómico': [
    s('path', { d: ells([[80, 80, 60, 20]]), ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: ells([[80, 80, 60, 20]]), transform: 'rotate(60 80 80)', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: ells([[80, 80, 60, 20]]), transform: 'rotate(-60 80 80)', ...SW(4) }, 'blue', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'red', { accent: true }),
    s('path', { d: dots([[140, 80], [50, 28], [50, 132]], 6) }, 'orange')
  ],
  autoritario: [
    s('rect', { x: 54, y: 82, width: 52, height: 62 }, 'gray'),
    s('circle', { cx: 80, cy: 34, r: 14 }, 'skin'),
    s('rect', { x: 62, y: 48, width: 36, height: 36, rx: 10 }, 'dark', { accent: true }),
    s('path', { d: 'M98 56l26 12', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M72 32l6 2M88 32l-6 2M74 42h12', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: busts([24, 132], 146, 14, 18) + dots([[24, 120], [132, 120]], 6) }, 'tan'),
    s('path', { d: 'M126 62l8-6M128 72l10 2', ...SW(3) }, 'red', { stroke: true })
  ],
  blues: [
    backdrop('navy'),
    s('path', { d: 'M78 74l46-50', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: ells([[66, 82, 18, 18], [52, 108, 28, 26]]) }, 'orange', { accent: true }),
    s('circle', { cx: 60, cy: 96, r: 7 }, 'dark'),
    s('rect', { x: 34, y: 116, width: 26, height: 6, rx: 2, transform: 'rotate(-45 47 119)' }, 'brown'),
    ...note(112, 118, 'sky'),
    ...note(28, 50, 'sky')
  ],
  carpa: [
    s('path', { d: 'M18 130l20-62h84l20 62z' }, 'white'),
    s('path', { d: 'M38 68l-6 62h14l6-62zM66 68l-4 62h14l-2-62zM94 68l4 62h14l-4-62z' }, 'red'),
    s('path', { d: 'M30 72L80 24l50 48z' }, 'red', { accent: true }),
    s('path', { d: 'M80 24V12l14 6-14 6', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M68 130q0-30 12-30t12 30z' }, 'dark'),
    s('path', { d: 'M18 130l20-62h84l20 62z', ...SW(3) }, 'gray', { stroke: true })
  ],
  catolicismo: [
    ground(),
    s('rect', { x: 34, y: 76, width: 92, height: 60 }, 'cream'),
    s('path', { d: 'M28 80l52-36 52 36z' }, 'brown'),
    s('path', { d: 'M80 44V14M68 24h24', ...SW(6) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M68 136v-26a12 12 0 0 1 24 0v26z' }, 'brown'),
    s('path', { d: 'M44 104v-12a6 6 0 0 1 12 0v12zM104 104v-12a6 6 0 0 1 12 0v12z' }, 'sky')
  ],
  comprometer: [
    s('path', { d: ring(80, 100, 34), ...SW(10) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: poly([[66, 52], [74, 40], [86, 40], [94, 52], [80, 66]]) }, 'sky'),
    s('path', { d: 'M66 52h28', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: sparkle(116, 40, 10) + sparkle(42, 44, 7) }, 'yellow'),
    s('path', { d: heart(130, 116, 10) }, 'red')
  ],
  'tracción': [
    s('rect', { x: 14, y: 122, width: 132, height: 24 }, 'dark'),
    s('circle', { cx: 80, cy: 76, r: 48 }, 'black'),
    s('path', { d: rays(80, 76, 38, 48, 16), ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 76, r: 24 }, 'gray', { accent: true }),
    s('circle', { cx: 80, cy: 76, r: 8 }, 'dark'),
    arrow('M30 136h100M120 128l10 8-10 8', 'yellow', 4)
  ],
  traspaso: [
    ground(),
    ...person(34, 136, 'blue'),
    ...person(126, 136, 'green'),
    s('path', { d: 'M48 100h14M112 100h-14', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M60 30l20-14 20 14v24H60z' }, 'orange', { accent: true }),
    s('rect', { x: 74, y: 40, width: 12, height: 14 }, 'brown'),
    s('path', { d: ring(68, 98, 6) + 'M74 98h20M88 98v6M92 98v5', ...SW(3) }, 'yellow', { stroke: true })
  ],
  'tráiler': [
    s('path', { d: 'M14 126h132', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 14, y: 48, width: 92, height: 62, rx: 3 }, 'gray'),
    s('path', { d: 'M106 66h20l16 20v24h-36z' }, 'red', { accent: true }),
    s('path', { d: 'M126 70l12 16h-12z' }, 'sky'),
    s('rect', { x: 14, y: 106, width: 128, height: 6 }, 'dark'),
    s('path', { d: dots([[32, 116], [50, 116], [118, 116]], 9) }, 'dark')
  ],
  toar: [
    s('rect', { x: 14, y: 100, width: 132, height: 46 }, 'blue'),
    s('path', { d: 'M14 90h50l-8 22H22z' }, 'red', { accent: true }),
    s('rect', { x: 30, y: 72, width: 20, height: 18 }, 'white'),
    s('path', { d: 'M64 96q20 10 40 0', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 96h46l-6 18h-34z' }, 'dark'),
    s('rect', { x: 112, y: 68, width: 30, height: 28 }, 'gray'),
    s('path', { d: 'M18 118q8-6 16 0t16 0M110 122q8-6 16 0t16 0', ...SW(3) }, 'sky', { stroke: true })
  ],
  'tóxico': [
    s('path', { d: 'M62 18h36v14h-4v18q24 12 24 40v42q0 10-10 10H52q-10 0-10-10V90q0-28 24-40V32h-4z' }, 'purple', { accent: true }),
    s('rect', { x: 52, y: 84, width: 56, height: 38, rx: 4 }, 'white'),
    s('path', { d: dots([[72, 98], [88, 98]], 4) + 'M70 112h20v4H70z' }, 'dark'),
    s('path', { d: drop(126, 120, 6) + drop(136, 96, 4) }, 'green'),
    s('path', { d: dots([[78, 70], [88, 62], [72, 58]], 3) }, 'pink')
  ],
  'unánime': [
    ground(),
    s('path', { d: busts([30, 64, 98, 132], 136, 26, 40) }, 'blue', { accent: true }),
    s('path', { d: dots([[30, 98], [64, 98], [98, 98], [132, 98]], 11) }, 'skin'),
    s('path', { d: 'M40 112l6-56M74 112l6-56M108 112l6-56M142 112l2-56', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: dots([[46, 54], [80, 54], [114, 54], [144, 54]], 6) }, 'skin')
  ],
  vencimiento: [
    s('path', { d: 'M48 32h44l16 20v88H48z' }, 'white'),
    s('path', { d: 'M48 32h44l16 20v88H48z', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 48, y: 70, width: 60, height: 40 }, 'sky'),
    s('circle', { cx: 112, cy: 110, r: 26 }, 'red', { accent: true }),
    s('path', { d: 'M112 94v16l10 8', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M28 30l10 8M24 50h12', ...SW(3) }, 'orange', { stroke: true })
  ],
  'abolición': [
    s('path', { d: 'M28 20h44l-6 20 10 16-8 22 8 22-8 20 6 20H28z' }, 'cream'),
    s('path', { d: 'M88 20h44v120H92l6-20-8-20 8-22-8-22 10-16z' }, 'cream'),
    s('path', { d: 'M28 20h44l-6 20 10 16-8 22 8 22-8 20 6 20H28zM88 20h44v120H92l6-20-8-20 8-22-8-22 10-16z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 40h22M38 56h26M38 72h20M100 40h22M104 56h22M98 72h24', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 52, cy: 112, r: 12 }, 'red', { accent: true }),
    s('circle', { cx: 110, cy: 112, r: 12 }, 'red')
  ],
  abono: [
    ground(),
    s('path', { d: 'M20 136l6-70h44l6 70z' }, 'brown', { accent: true }),
    s('path', { d: 'M24 66q24-10 48 0', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: leaflet(48, 100, -90, 20, 7) }, 'green'),
    s('path', { d: dots([[86, 72], [96, 82], [90, 92], [102, 98], [110, 108]], 3) }, 'brown'),
    s('path', { d: 'M120 136v-30', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(120, 110, -140, 22, 8) + leaflet(120, 104, -40, 22, 8) }, 'green')
  ],
  acoger: [
    s('path', { d: 'M14 74l66-54 66 54z' }, 'red'),
    s('rect', { x: 28, y: 70, width: 104, height: 70 }, 'cream'),
    ...person(66, 140, 'orange', { accent: true }),
    ...person(100, 140, 'blue', { h: 26, w: 22, r: 9 }),
    s('path', { d: 'M80 104q12-4 16 4M52 104q-10 8-6 14', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(82, 50, 10) }, 'pink')
  ],
  acreedor: [
    ground(),
    ...person(42, 136, 'navy', { accent: true }),
    ...person(118, 136, 'gray'),
    s('path', { d: 'M56 100h18', ...SW(7) }, 'skin', { stroke: true }),
    ...paper(70, 82, 22, 28),
    s('path', { d: 'M104 100h-8', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 92, cy: 104, r: 6 }, 'yellow'),
  ],
  'analogía': [
    s('path', { d: ring(40, 80, 24), ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 40, cy: 80, r: 12 }, 'yellow', { accent: true }),
    s('circle', { cx: 64, cy: 80, r: 6 }, 'blue'),
    s('path', { d: ring(120, 80, 24), ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 120, cy: 80, r: 10 }, 'red'),
    s('circle', { cx: 144, cy: 80, r: 4 }, 'blue'),
    arrow('M66 126h28M74 118l-8 8 8 8M86 118l8 8-8 8', 'orange', 4)
  ],
  'apreciación': [
    s('path', { d: poly([[44, 70], [58, 54], [86, 54], [100, 70], [72, 108]]) }, 'sky', { accent: true }),
    s('path', { d: 'M44 70h56M64 54l8 16 6-16', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: ring(72, 76, 42) + 'M102 106l30 30', ...SW(8) }, 'brown', { stroke: true }),
    arrow('M118 56V22M110 30l8-8 8 8', 'green', 5)
  ],
  'apropiación': [
    s('rect', { x: 20, y: 96, width: 48, height: 40, rx: 4, ...DASH(3) }, 'gray', { stroke: true }),
    s('rect', { x: 86, y: 62, width: 48, height: 40, rx: 4 }, 'yellow', { accent: true }),
    s('path', { d: 'M86 76h48', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M116 24v34', ...SW(10) }, 'dark', { stroke: true }),
    s('path', { d: 'M104 56h24a6 6 0 0 1 6 6v8H98v-8a6 6 0 0 1 6-6z' }, 'skin'),
    arrow('M60 88q16-20 28-22', 'orange', 4)
  ],
  asfalto: [
    s('rect', { x: 14, y: 112, width: 132, height: 34 }, 'dark'),
    s('rect', { x: 14, y: 112, width: 60, height: 34 }, 'black'),
    s('path', { d: 'M22 130h20M54 130h14', ...SW(4) }, 'yellow', { stroke: true }),
    s('rect', { x: 64, y: 48, width: 56, height: 36, rx: 4 }, 'yellow', { accent: true }),
    s('rect', { x: 76, y: 30, width: 30, height: 20, rx: 3 }, 'sky'),
    s('circle', { cx: 52, cy: 92, r: 20 }, 'gray'),
    s('circle', { cx: 120, cy: 98, r: 14 }, 'gray'),
    s('path', { d: 'M52 72h18', ...SW(6) }, 'orange', { stroke: true })
  ],
  asombro: [
    s('circle', { cx: 80, cy: 86, r: 46 }, 'skin', { accent: true }),
    s('path', { d: ells([[62, 76, 10, 13], [98, 76, 10, 13]]) }, 'white'),
    s('path', { d: dots([[62, 76], [98, 76]], 5) }, 'dark'),
    s('ellipse', { cx: 80, cy: 112, rx: 10, ry: 13 }, 'dark'),
    s('path', { d: 'M50 54l14-6M110 54l-14-6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 14v12M42 22l8 10M118 22l-8 10', ...SW(4) }, 'orange', { stroke: true })
  ],
  bicentenario: [
    s('rect', { x: 30, y: 98, width: 100, height: 38, rx: 4 }, 'pink'),
    s('rect', { x: 42, y: 70, width: 76, height: 30, rx: 4 }, 'cream'),
    s('path', { d: 'M30 112q12 8 25 0t25 0 25 0 25 0', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M66 70V46M94 70V46', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: drop(66, 38, 5) + drop(94, 38, 5) }, 'orange', { accent: true }),
    s('path', { d: star(26, 40, 10) + star(134, 40, 10) }, 'yellow'),
    s('path', { d: 'M20 136h120', ...SW(4) }, 'gray', { stroke: true })
  ],
  'bilingüe': [
    s('path', { d: bubble(14, 18, 70, 46) }, 'blue', { accent: true }),
    s('path', { d: bubble(76, 56, 70, 46), transform: 'scale(-1 1) translate(-222 0)' }, 'orange'),
    s('circle', { cx: 80, cy: 128, r: 14 }, 'skin'),
    s('path', { d: 'M26 34h46M26 46h30', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M88 72h46M104 84h30', ...SW(4) }, 'white', { stroke: true })
  ],
  billetera: [
    s('rect', { x: 34, y: 30, width: 80, height: 50, rx: 3, transform: 'rotate(-10 74 55)' }, 'green'),
    s('circle', { cx: 74, cy: 54, r: 10 }, 'mint'),
    s('rect', { x: 20, y: 58, width: 120, height: 80, rx: 10 }, 'brown', { accent: true }),
    s('path', { d: 'M100 84h40v32h-40a6 6 0 0 1-6-6V90a6 6 0 0 1 6-6z' }, 'tan'),
    s('circle', { cx: 110, cy: 100, r: 5 }, 'yellow'),
    s('path', { d: 'M26 66h70', ...DASH(2, '4 4') }, 'tan', { stroke: true })
  ],
  cannabis: [
    s('path', { d: 'M80 104v40', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 104, -90, 84, 11) }, 'green', { accent: true }),
    s('path', { d: leaflet(80, 104, -125, 70, 10) + leaflet(80, 104, -55, 70, 10) }, 'green'),
    s('path', { d: leaflet(80, 104, -160, 52, 8) + leaflet(80, 104, -20, 52, 8) }, 'green'),
    s('path', { d: leaflet(80, 104, 160, 30, 6) + leaflet(80, 104, 20, 30, 6) }, 'green')
  ],
  chantaje: [
    s('circle', { cx: 48, cy: 52, r: 18 }, 'dark'),
    s('rect', { x: 24, y: 74, width: 48, height: 66, rx: 16 }, 'dark'),
    s('rect', { x: 34, y: 46, width: 28, height: 8, rx: 3 }, 'black'),
    s('rect', { x: 72, y: 70, width: 40, height: 32, rx: 2, transform: 'rotate(-8 92 86)' }, 'white'),
    s('rect', { x: 76, y: 74, width: 32, height: 22, transform: 'rotate(-8 92 86)' }, 'sky'),
    s('path', { d: 'M110 108q-14 4-12 20q2 12 22 12t22-12q2-16-12-20l6-10h-20z' }, 'yellow', { accent: true }),
    s('path', { d: 'M114 110h16', ...SW(3) }, 'brown', { stroke: true })
  ],
  chispa: [
    s('path', { d: 'M30 140l50-56', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: burst(88, 74, 34, 12, 8) }, 'orange'),
    s('path', { d: burst(88, 74, 20, 8, 8) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(130, 34, 10) + sparkle(130, 110, 7) + sparkle(46, 40, 8) }, 'yellow'),
    s('path', { d: dots([[120, 60], [114, 96], [70, 34]], 3) }, 'orange')
  ],
  chocar: [
    ground(),
    ...car(10, 104, 'blue'),
    ...car(90, 104, 'red', 'sky', { accent: true }),
    s('path', { d: burst(80, 98, 22, 10, 8) }, 'yellow'),
    s('path', { d: 'M70 60l6 12M90 60l-6 12M80 54v14', ...SW(3) }, 'orange', { stroke: true })
  ],
  'correlación': [
    s('path', { d: 'M24 18v118h122', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[40, 116], [50, 102], [62, 106], [72, 88], [84, 82], [92, 70], [106, 64], [116, 50], [128, 40], [58, 94], [100, 76]], 5) }, 'blue'),
    s('path', { d: 'M34 124L138 30', ...SW(4) }, 'red', { stroke: true, accent: true })
  ],
  delirio: [
    s('circle', { cx: 80, cy: 92, r: 42 }, 'pink', { accent: true }),
    s('path', { d: spiral(60, 84) + spiral(94, 84), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 112q16 10 32-4', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[80, 34, 46, 12]]), ...DASH(3, '6 8') }, 'gray', { stroke: true }),
    s('path', { d: star(36, 32, 9) + star(122, 30, 9) + star(80, 22, 7) }, 'yellow')
  ],
  derrame: [
    s('path', { d: ells([[96, 128, 48, 12]]) + ells([[62, 132, 26, 9]]) }, 'sky'),
    s('path', { d: 'M18 120l12-24 54-10 12 6 18-4v20l-18-4-10 10-56 12z' }, 'green'),
    s('path', { d: 'M114 88q14 10 6 40h-14q8-24 8-40z' }, 'blue', { accent: true }),
    s('path', { d: drop(128, 106, 4) + drop(140, 118, 3) }, 'blue')
  ],
  desprender: [
    s('rect', { x: 26, y: 26, width: 108, height: 108, rx: 6 }, 'gray'),
    s('path', { d: 'M38 38h84v54L92 122H38z' }, 'yellow', { accent: true }),
    s('path', { d: 'M122 92q-26 0-30 30q-4-22 14-40z' }, 'orange'),
    s('path', { d: star(66, 72, 18) }, 'orange'),
    arrow('M132 70q12 20 4 40', 'blue', 4)
  ],
  'destitución': [
    s('rect', { x: 18, y: 96, width: 70, height: 10 }, 'brown'),
    s('path', { d: 'M24 106v34M82 106v34', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 30, y: 80, width: 30, height: 16, rx: 2 }, 'yellow'),
    ...person(118, 136, 'navy'),
    s('rect', { x: 100, y: 96, width: 36, height: 26, rx: 2 }, 'tan', { accent: true }),
    arrow('M96 54h40M128 46l8 8-8 8', 'red', 5)
  ],
  'devaluación': [
    s('circle', { cx: 56, cy: 56, r: 34 }, 'yellow', { accent: true }),
    s('circle', { cx: 56, cy: 56, r: 24 }, 'orange'),
    s('path', { d: star(56, 56, 12) }, 'yellow'),
    s('path', { d: 'M20 108l30 10 26-6 30 22 36 10', ...SW(5) }, 'red', { stroke: true }),
    arrow('M112 40v52M102 82l10 10 10-10', 'red', 6)
  ],
  'emancipación': [
    s('path', { d: ring(34, 120, 12) + ring(58, 120, 12), ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M78 124q8-8 10-18M96 132q10-2 16-10', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 70q-24-30-50-20q20 2 30 24z' }, 'sky'),
    s('path', { d: 'M86 70q24-36 52-30q-22 8-32 32z' }, 'sky'),
    s('ellipse', { cx: 92, cy: 74, rx: 14, ry: 8 }, 'blue', { accent: true }),
    s('path', { d: 'M100 108l8 4M76 104l-6 6', ...SW(3) }, 'orange', { stroke: true })
  ],
  emocionalmente: [
    s('path', { d: heart(80, 84, 36) }, 'red', { accent: true }),
    s('path', { d: dots([[64, 76], [96, 76]], 5) }, 'dark'),
    s('path', { d: 'M68 98q12-8 24 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: drop(62, 92, 5) }, 'sky'),
  ],
  enamorar: [
    s('path', { d: heart(80, 84, 36) }, 'pink', { accent: true }),
    s('path', { d: 'M24 128L132 30', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M132 30l-14 2 6 8z' }, 'gray'),
    s('path', { d: 'M24 128l4-12M24 128l12-4M32 121l4-12M32 121l12-4', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: heart(132, 118, 10) + heart(30, 40, 8) }, 'red')
  ],
  encabezar: [
    ground(),
    ...person(118, 136, 'red', { accent: true }),
    s('path', { d: 'M132 98V30', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M132 30h-26l6 10-6 10h26z' }, 'yellow'),
    s('path', { d: busts([30, 56, 82], 136, 20, 32) + dots([[30, 96], [56, 96], [82, 96]], 9) }, 'gray')
  ],
  escrutinio: [
    s('rect', { x: 30, y: 72, width: 72, height: 66, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 50, y: 70, width: 32, height: 6 }, 'dark'),
    ...paper(52, 34, 28, 36),
    s('path', { d: 'M58 52l6 6 10-12', ...SW(3) }, 'green', { stroke: true }),
    s('circle', { cx: 116, cy: 104, r: 20 }, 'sky'),
    s('path', { d: ring(116, 104, 20) + 'M130 118l14 16', ...SW(6) }, 'dark', { stroke: true })
  ],
  exigente: [
    ground(),
    s('circle', { cx: 70, cy: 52, r: 16 }, 'skin'),
    s('path', { d: 'M60 46l8 3M80 46l-8 3M62 62q8-4 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 52, y: 70, width: 36, height: 66, rx: 12 }, 'navy', { accent: true }),
    s('path', { d: 'M88 84l20-20', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M108 64l24-42', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M28 78l-8-8M30 92H18', ...SW(3) }, 'red', { stroke: true })
  ],
  fax: [
    s('rect', { x: 46, y: 22, width: 68, height: 50 }, 'white'),
    s('rect', { x: 46, y: 22, width: 68, height: 50, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M56 36h48M56 48h36M56 60h44', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 22, y: 64, width: 116, height: 64, rx: 8 }, 'gray', { accent: true }),
    s('rect', { x: 40, y: 64, width: 80, height: 8 }, 'dark'),
    s('path', { d: grid(84, 84, 3, 3, 10, 8, 14, 12) }, 'dark'),
    s('rect', { x: 32, y: 84, width: 40, height: 26, rx: 4 }, 'dark')
  ],
  fertilidad: [
    s('rect', { x: 14, y: 106, width: 132, height: 40, rx: 4 }, 'brown'),
    s('path', { d: 'M34 106V80M64 106V70M96 106V74M126 106V84', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(34, 84, -140, 18, 7) + leaflet(34, 84, -40, 18, 7) + leaflet(96, 78, -140, 20, 7) + leaflet(96, 78, -40, 20, 7) }, 'green', { accent: true }),
    s('path', { d: leaflet(64, 74, -140, 20, 7) + leaflet(64, 74, -40, 20, 7) + leaflet(126, 88, -140, 16, 6) + leaflet(126, 88, -40, 16, 6) }, 'mint'),
    s('circle', { cx: 80, cy: 30, r: 14 }, 'yellow'),
    s('path', { d: dots([[40, 124], [80, 130], [112, 122]], 4) }, 'tan')
  ],
  feto: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'pink'),
    s('circle', { cx: 80, cy: 80, r: 50 }, 'cream'),
    s('path', { d: 'M76 70q34-6 34 22q0 24-26 26q-24 0-24-18q2-14 16-10' }, 'skin', { accent: true }),
    s('circle', { cx: 70, cy: 58, r: 20 }, 'skin'),
    s('path', { d: 'M62 58q4 4 8 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M84 104q10 14 30 10', ...SW(3) }, 'pink', { stroke: true })
  ],
  fluir: [
    s('path', { d: 'M14 40q30-16 60 0t72 0v34q-36 16-72 0t-60 0zM14 98q30-16 60 0t72 0v34q-36 16-72 0t-60 0z' }, 'sky'),
    s('path', { d: 'M14 70q30-16 60 0t72 0v34q-36 16-72 0t-60 0z' }, 'blue', { accent: true }),
    arrow('M40 86h80M110 76l10 10-10 10', 'white', 5)
  ],
  folleto: [
    s('path', { d: poly([[18, 32], [58, 24], [58, 128], [18, 136]]) }, 'blue'),
    s('path', { d: poly([[58, 24], [102, 32], [102, 136], [58, 128]]) }, 'white'),
    s('path', { d: poly([[102, 32], [142, 24], [142, 128], [102, 136]]) }, 'orange', { accent: true }),
    s('path', { d: poly([[18, 32], [58, 24], [102, 32], [142, 24], [142, 128], [102, 136], [58, 128], [18, 136]]), ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 56, r: 12 }, 'yellow'),
    s('path', { d: 'M68 82h24M68 94h24M68 106h18M26 70h24M26 82h24M110 70h24M110 82h24', ...SW(3) }, 'gray', { stroke: true })
  ],
  huerto: [
    s('rect', { x: 14, y: 76, width: 132, height: 70 }, 'brown'),
    s('path', { d: 'M14 100h132M14 124h132', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: dots([[34, 86], [64, 86], [94, 86], [124, 86]], 10) }, 'green', { accent: true }),
    s('path', { d: poly([[44, 106], [56, 106], [50, 134]]) + poly([[74, 106], [86, 106], [80, 134]]) + poly([[104, 106], [116, 106], [110, 134]]) }, 'orange'),
    s('path', { d: 'M46 104l4-10 4 10M76 104l4-10 4 10M106 104l4-10 4 10', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M14 70h132M24 70V50M56 70V50M88 70V50M120 70V50', ...SW(4) }, 'tan', { stroke: true })
  ],
  implacable: [
    s('rect', { x: 14, y: 116, width: 132, height: 30 }, 'tan'),
    s('path', { d: 'M14 120V90q10-60 70-62q40-2 50 30q-24-14-40 2q-14 18 6 26q-6 24 46 24v10z' }, 'blue', { accent: true }),
    s('path', { d: 'M84 28q40-2 50 30q-24-14-40 2', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: dots([[60, 72], [40, 96], [126, 106]], 4) }, 'white'),
    s('path', { d: 'M126 128h12', ...SW(4) }, 'brown', { stroke: true })
  ],
  inexistente: [
    s('circle', { cx: 80, cy: 46, r: 18, ...DASH(4) }, 'gray', { stroke: true }),
    s('rect', { x: 58, y: 70, width: 44, height: 68, rx: 14, ...DASH(4) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: 'M18 140h124', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: sparkle(124, 54, 8) + sparkle(36, 92, 6) }, 'sky')
  ],
  insignia: [
    s('path', { d: 'M58 20l-12 40h28zM102 20l12 40H86z' }, 'blue'),
    s('path', { d: 'M80 52l40 14v30q0 28-40 44q-40-16-40-44V66z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 62l30 10v24q0 22-30 34q-30-12-30-34V72z' }, 'orange'),
    s('path', { d: star(80, 94, 18) }, 'yellow')
  ],
  'instantánea': [
    s('rect', { x: 36, y: 58, width: 88, height: 84, rx: 3, transform: 'rotate(-8 80 100)' }, 'white'),
    s('rect', { x: 36, y: 58, width: 88, height: 84, rx: 3, transform: 'rotate(-8 80 100)', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 44, y: 66, width: 72, height: 54, transform: 'rotate(-8 80 100)' }, 'sky', { accent: true }),
    s('circle', { cx: 70, cy: 88, r: 10 }, 'yellow'),
    s('path', { d: 'M48 116l26-22 16 12 12-10 14 14z', transform: 'rotate(-8 80 100)' }, 'green'),
    s('path', { d: sparkle(126, 36, 12) + sparkle(30, 40, 8) }, 'yellow')
  ],
  interamericano: [
    backdrop('sky'),
    s('path', { d: 'M24 26h50l6 20-16 12-14 8-8 14H26l-8-24z' }, 'green', { accent: true }),
    s('path', { d: 'M92 84h30l16 18-8 22-18 18-8-14-10-24z' }, 'green'),
    s('path', { d: 'M54 74l20 12 18 0', ...SW(4) }, 'green', { stroke: true }),
    arrow('M50 108q-10 20 30 26M74 128l8 6-6 8', 'orange', 4),
    arrow('M112 60q8-26-30-36M90 16l-8 8 8 6', 'orange', 4)
  ],
  lance: [
    ground(),
    ...lean(54, 136, -12, 'orange', { accent: true }),
    s('path', { d: 'M56 96l-22-20', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M24 90L142 26', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M142 26l-14 2 4 8z' }, 'gray'),
    s('path', { d: 'M90 56l-6-10M104 50l-4-12', ...SW(3) }, 'gray', { stroke: true })
  ],
  mamada: [
    s('rect', { x: 54, y: 52, width: 52, height: 88, rx: 14 }, 'white'),
    s('rect', { x: 54, y: 82, width: 52, height: 58, rx: 14 }, 'cream'),
    outline({ x: 54, y: 52, width: 52, height: 88, rx: 14 }, 'blue'),
    s('rect', { x: 50, y: 40, width: 60, height: 14, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: 'M68 40q0-24 12-24t12 24z' }, 'pink'),
    s('path', { d: 'M60 96h10M60 112h10', ...SW(3) }, 'blue', { stroke: true })
  ],
  meridional: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'cream'),
    s('path', { d: ring(80, 80, 60), ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 80l-12-8 12-48 12 48z' }, 'gray'),
    s('path', { d: 'M68 80l12 56 12-56z' }, 'red', { accent: true }),
    s('path', { d: 'M80 80l-48-8v16zM80 80l48-8v16z' }, 'gray'),
    s('circle', { cx: 80, cy: 80, r: 6 }, 'dark')
  ],
  'mitología': [
    backdrop('sky'),
    ...horse('white', 'yellow', {}),
    s('path', { d: 'M70 70q-10-40 30-52q-10 20-6 50z' }, 'yellow', { accent: true }),
    s('path', { d: ells([[30, 132, 16, 6], [124, 136, 18, 6]]) }, 'white')
  ],
  motocicleta: [
    s('path', { d: ring(40, 108, 22) + ring(120, 108, 22), ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 108l30-30h36l14 30M106 78l-10-26h-14', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 80q10-20 40-12l6 12z' }, 'red', { accent: true }),
    s('rect', { x: 50, y: 70, width: 30, height: 8, rx: 4 }, 'dark'),
    s('circle', { cx: 112, cy: 64, r: 6 }, 'yellow'),
    s('path', { d: dots([[40, 108], [120, 108]], 5) }, 'gray')
  ],
  'oligarquía': [
    s('path', { d: poly([[80, 50], [146, 146], [14, 146]]) }, 'tan'),
    s('path', { d: 'M38 122h84M56 96h48', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: busts([66, 94], 54, 20, 24) + dots([[66, 22], [94, 22]], 9) }, 'purple', { accent: true }),
    s('path', { d: busts([30, 50, 70, 90, 110, 130], 146, 12, 14) }, 'gray'),
    s('path', { d: 'M60 18l2-8 4 4 4-4 2 8zM88 18l2-8 4 4 4-4 2 8z' }, 'yellow')
  ],
  originalidad: [
    s('path', { d: ells([[30, 40, 12, 12], [80, 40, 12, 12], [130, 40, 12, 12], [30, 120, 12, 12], [80, 120, 12, 12], [130, 120, 12, 12], [30, 80, 12, 12], [130, 80, 12, 12]]) }, 'gray'),
    s('path', { d: star(80, 82, 26) }, 'orange', { accent: true }),
    s('path', { d: sparkle(104, 56, 8) }, 'yellow')
  ],
  paralelamente: [
    s('path', { d: 'M18 60h116M18 106h116', ...SW(4) }, 'gray', { stroke: true }),
    arrow('M22 60h110M122 50l10 10-10 10', 'blue', 7),
    arrow('M22 106h110M122 96l10 10-10 10', 'orange', 7),
    s('circle', { cx: 60, cy: 60, r: 10 }, 'blue', { accent: true }),
    s('circle', { cx: 60, cy: 106, r: 10 }, 'orange')
  ],
  pluralidad: [
    ground(),
    s('path', { d: busts([28, 104], 136, 22, 36) }, 'red'),
    s('path', { d: busts([54, 130], 136, 22, 30) }, 'blue', { accent: true }),
    s('path', { d: busts([80], 136, 22, 40) }, 'green'),
    s('path', { d: dots([[28, 88], [104, 88], [54, 94], [130, 94], [80, 84]], 10) }, 'skin'),
    s('path', { d: dots([[80, 84]], 10) }, 'brown')
  ],
  podio: [
    s('rect', { x: 58, y: 70, width: 44, height: 70 }, 'yellow', { accent: true }),
    s('rect', { x: 18, y: 94, width: 40, height: 46 }, 'gray'),
    s('rect', { x: 102, y: 108, width: 40, height: 32 }, 'orange'),
    s('path', { d: star(80, 46, 18) }, 'yellow'),
    s('path', { d: dots([[38, 80], [122, 94]], 7) }, 'gray'),
    s('path', { d: 'M76 92h8v28', ...SW(4) }, 'white', { stroke: true })
  ],
  poste: [
    s('path', { d: 'M80 140V18', ...SW(10) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M48 34h64M54 54h52', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M14 46q20 10 38-10M108 34q20 10 38 4M14 66q20 6 42-10M104 54q20 10 42 6', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: dots([[52, 30], [108, 30], [58, 50], [102, 50]], 4) }, 'gray'),
    ground(140)
  ],
  'pronunciación': [
    s('path', { d: 'M18 80q30-34 60 0q-30 34-60 0z' }, 'red', { accent: true }),
    s('path', { d: 'M28 80q20-16 40 0q-20 18-40 0z' }, 'dark'),
    s('path', { d: 'M36 84q12-8 24 0', ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: 'M28 76h40', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M92 64q10 16 0 32M108 52q18 28 0 56M124 40q26 40 0 80', ...SW(5) }, 'blue', { stroke: true })
  ],
  pulgar: [
    s('rect', { x: 48, y: 70, width: 60, height: 66, rx: 18 }, 'skin'),
    s('path', { d: 'M54 76V34a12 12 0 0 1 24 0v40z' }, 'orange', { accent: true }),
    s('path', { d: 'M108 88H80M108 104H80M108 120H80', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 40, y: 132, width: 76, height: 14, rx: 4 }, 'blue')
  ],
  remover: [
    s('path', { d: 'M28 70h104l-8 60q-2 10-12 10H48q-10 0-12-10z' }, 'gray'),
    s('ellipse', { cx: 80, cy: 70, rx: 52, ry: 10 }, 'orange'),
    s('path', { d: 'M62 70a18 6 0 1 0 36 0a10 4 0 1 0-20 0', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M90 68l30-56', ...SW(6) }, 'brown', { stroke: true, accent: true }),
    arrow('M48 46q32-18 64 0', 'blue', 4)
  ],
  renombre: [
    s('path', { d: 'M60 14h40l30 126H30z' }, 'yellow'),
    ...person(80, 136, 'red', { accent: true }),
    s('path', { d: star(30, 40, 10) + star(130, 40, 10) + star(140, 90, 7) + star(20, 90, 7) }, 'orange'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  rito: [
    s('rect', { x: 24, y: 112, width: 112, height: 24, rx: 4 }, 'brown'),
    s('path', { d: rects([[38, 74, 14, 38], [108, 74, 14, 38]]) }, 'cream'),
    s('path', { d: drop(45, 62, 5) + drop(115, 62, 5) }, 'orange', { accent: true }),
    s('path', { d: 'M66 112l4-18h20l4 18z' }, 'yellow'),
    s('path', { d: 'M80 92q-8-10 0-20t0-20q8-8 0-18', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 140h124', ...SW(4) }, 'brown', { stroke: true })
  ],
  roer: [
    s('path', { d: 'M78 132V82l58-20v70zM136 62l10 4' }, 'yellow', { accent: true }),
    s('path', { d: dots([[100, 104], [124, 92], [116, 120]], 6) }, 'orange'),
    s('path', { d: 'M64 112q-50 12-46-26q4-20 26-20q16 0 28 22z' }, 'gray'),
    s('circle', { cx: 34, cy: 66, r: 10 }, 'pink'),
    s('circle', { cx: 52, cy: 82, r: 3 }, 'dark'),
    s('path', { d: 'M20 108q-10 10 0 24', ...SW(3) }, 'gray', { stroke: true }),
  ],
  solemne: [
    ground(),
    ...person(60, 136, 'black', { accent: true }),
    s('path', { d: 'M56 92l4 12 4-12z' }, 'white'),
    s('path', { d: 'M72 104h24', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: ring(110, 106, 18), ...SW(8) }, 'green', { stroke: true }),
    s('path', { d: dots([[100, 92], [120, 92], [126, 112]], 4) }, 'red'),
    s('rect', { x: 124, y: 36, width: 8, height: 30 }, 'cream'),
    s('path', { d: drop(128, 28, 4) }, 'orange')
  ],
  sudamericano: [
    backdrop('sky'),
    s('path', { d: 'M60 18l38 6 18 22 22 12-4 22-22 18-12 22-14 14-8 12-4-14 4-26-8-22-18-22-4-20z' }, 'green', { accent: true }),
    s('path', { d: 'M96 64l-14 10 6 16', ...SW(3) }, 'mint', { stroke: true })
  ],
  supervisor: [
    ground(),
    s('circle', { cx: 56, cy: 54, r: 14 }, 'skin'),
    s('path', { d: 'M40 50q0-20 16-20t16 20z' }, 'yellow', { accent: true }),
    s('rect', { x: 40, y: 70, width: 32, height: 66, rx: 10 }, 'orange'),
    s('rect', { x: 70, y: 82, width: 24, height: 32, rx: 2 }, 'brown'),
    s('rect', { x: 74, y: 86, width: 16, height: 24 }, 'white'),
    s('path', { d: 'M77 94l3 3 5-5M77 104h10', ...SW(2) }, 'green', { stroke: true }),
    ...person(122, 136, 'blue', { h: 30, w: 22, r: 9 })
  ],
  tapia: [
    s('rect', { x: 14, y: 50, width: 132, height: 86 }, 'tan', { accent: true }),
    s('path', { d: 'M14 72h132M14 94h132M14 116h132M44 50v22M90 50v22M130 50v22M24 72v22M66 72v22M110 72v22M44 94v22M90 94v22M130 94v22M24 116v20M66 116v20M110 116v20', ...SW(3) }, 'brown', { stroke: true }),
    s('rect', { x: 10, y: 42, width: 140, height: 10, rx: 3 }, 'brown'),
    ground(),
    s('path', { d: 'M20 136l4-10 4 10M120 136l4-12 4 12', ...SW(3) }, 'green', { stroke: true })
  ],
  tejado: [
    backdrop('sky'),
    s('path', { d: 'M14 120L80 34l66 86z' }, 'red', { accent: true }),
    s('path', { d: 'M40 86q6 6 12 0t12 0 12 0 12 0 12 0 12 0M28 104q6 6 12 0t12 0 12 0 12 0 12 0 12 0 12 0 12 0M54 68q6 6 12 0t12 0 12 0 12 0', ...SW(3) }, 'orange', { stroke: true }),
    s('rect', { x: 26, y: 120, width: 108, height: 26 }, 'cream'),
    s('rect', { x: 104, y: 36, width: 14, height: 30 }, 'brown')
  ],
  telenovela: [
    s('rect', { x: 14, y: 30, width: 132, height: 92, rx: 8 }, 'dark'),
    s('rect', { x: 22, y: 38, width: 116, height: 76, rx: 4 }, 'pink', { accent: true }),
    s('path', { d: busts([56, 104], 114, 26, 34) + dots([[56, 70], [104, 70]], 12) }, 'cream'),
    s('path', { d: drop(48, 82, 3) }, 'blue'),
    s('path', { d: heart(80, 48, 8) }, 'red'),
    s('path', { d: 'M60 122l-10 18M100 122l10 18', ...SW(5) }, 'gray', { stroke: true })
  ],
  trapo: [
    s('path', { d: 'M34 62l60-20 34 30-8 44-54 18-30-30z' }, 'yellow', { accent: true }),
    s('path', { d: 'M50 70l50-16M44 92l64-22M50 112l56-18', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: ells([[134, 36, 8, 8], [118, 24, 6, 6], [30, 136, 7, 7]]) }, 'sky'),
    s('path', { d: 'M16 146h128', ...SW(4) }, 'gray', { stroke: true })
  ],
  tuitear: [
    s('rect', { x: 26, y: 34, width: 56, height: 104, rx: 10 }, 'dark'),
    s('rect', { x: 32, y: 44, width: 44, height: 82, rx: 3 }, 'sky'),
    s('path', { d: 'M90 74q4-24 30-24q12 0 18 8l10 -2-6 8q0 28-30 30q-8 0-16-4l10-6q-14-2-16-10z' }, 'blue', { accent: true }),
    s('path', { d: 'M40 60h28M40 72h20M40 84h28', ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 124, cy: 62, r: 3 }, 'dark'),
    s('path', { d: 'M100 114l8 8M116 112l2 12', ...SW(3) }, 'orange', { stroke: true })
  ],
  'unificación': [
    arrow('M18 30l50 40', 'red', 6),
    arrow('M18 80h48', 'blue', 6),
    arrow('M18 130l50-40', 'green', 6),
    s('circle', { cx: 88, cy: 80, r: 18 }, 'purple', { accent: true }),
    arrow('M106 80h34M130 70l10 10-10 10', 'purple', 6)
  ],
  velada: [
    backdrop('navy'),
    s('path', { d: 'M110 30a14 14 0 1 0 14 22a12 12 0 1 1-14-22z' }, 'yellow'),
    s('path', { d: 'M14 46q34 24 66 0t66 0', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: dots(qpts([14, 46], [47, 70], [80, 46], 4).concat(qpts([80, 46], [113, 70], [146, 46], 4)), 5) }, 'yellow', { accent: true }),
    ...glass(56, -10, false),
    ...glass(104, 10, false)
  ],
  veterinario: [
    ground(),
    ...person(44, 136, 'mint'),
    s('path', { d: 'M38 92q-4 20 10 24q14-4 10-24', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M88 134v-28h40v28zM96 106l2-28 10-10 4 8h10q8 0 8 10v20z' }, 'brown', { accent: true }),
    s('path', { d: 'M128 112q10-4 12-16', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 116, cy: 88, r: 3 }, 'dark'),
    s('path', { d: 'M52 112l26 0', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 44, y: 66, width: 8, height: 8 }, 'red')
  ],
  vitamina: [
    s('path', { d: wedge(56, 110, 40, 180, 360) }, 'orange'),
    s('path', { d: wedge(56, 110, 32, 180, 360) }, 'yellow'),
    s('path', { d: 'M56 110l-24-16M56 110l-10-28M56 110l10-28M56 110l24-16', ...SW(3) }, 'orange', { stroke: true }),
    s('rect', { x: 92, y: 26, width: 30, height: 70, rx: 15, transform: 'rotate(30 107 61)' }, 'red', { accent: true }),
    s('rect', { x: 92, y: 61, width: 30, height: 35, rx: 0, transform: 'rotate(30 107 61)' }, 'yellow'),
    s('path', { d: dots([[130, 112], [30, 40], [56, 30]], 5) }, 'orange')
  ],
  viviente: [
    ground(),
    s('path', { d: 'M54 136V86', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(54, 96, -150, 26, 9) + leaflet(54, 88, -30, 26, 9) }, 'green'),
    s('circle', { cx: 54, cy: 72, r: 12 }, 'pink', { accent: true }),
    s('path', { d: 'M110 74q-20-20-6-30q6-2 6 10q0-12 6-10q14 10-6 30z' }, 'orange'),
    s('path', { d: 'M110 90q-22 6-24-12q20-4 24 12zM110 90q22 6 24-12q-20-4-24 12z' }, 'purple'),
    s('circle', { cx: 120, cy: 30, r: 12 }, 'yellow'),
    s('path', { d: 'M18 52h14l6-12 8 22 6-10h12', ...SW(3) }, 'red', { stroke: true })
  ],
  vodka: [
    s('path', { d: 'M48 140q-10 0-10-10V70q0-14 14-20l4-14h20l4 14q14 6 14 20v60q0 10-10 10z' }, 'sky', { accent: true }),
    s('rect', { x: 56, y: 22, width: 24, height: 16, rx: 3 }, 'red'),
    s('rect', { x: 38, y: 86, width: 56, height: 28 }, 'white'),
    s('path', { d: 'M54 100h24', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M106 108h32l-4 32h-24z' }, 'sky'),
    s('path', { d: 'M106 108h32l-4 32h-24z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: sparkle(122, 70, 10) }, 'white'),
    s('path', { d: rays(122, 70, 4, 14, 6), ...SW(3) }, 'blue', { stroke: true })
  ],
  vomitar: [
    s('path', { d: 'M48 136l-6-36h76l-6 36z' }, 'gray'),
    s('ellipse', { cx: 80, cy: 100, rx: 38, ry: 6 }, 'dark'),
    s('circle', { cx: 80, cy: 50, r: 32 }, 'mint', { accent: true }),
    s('path', { d: spiral(64, 44) + spiral(90, 44), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M72 70q8-6 16 0q-2 12-8 24', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: drop(78, 92, 4) }, 'green')
  ],
  yeso: [
    s('path', { d: 'M14 70q60 60 132 30', ...SW(8) }, 'blue', { stroke: true }),
    s('path', { d: 'M24 96h40', ...SW(18) }, 'skin', { stroke: true }),
    s('rect', { x: 52, y: 82, width: 70, height: 30, rx: 10 }, 'white', { accent: true }),
    outline({ x: 52, y: 82, width: 70, height: 30, rx: 10 }),
    s('path', { d: 'M122 88h14a8 8 0 0 1 0 16h-14' }, 'skin'),
    s('path', { d: 'M70 90l8 8M92 100l10-8', ...SW(3) }, 'gray', { stroke: true })
  ],
  accionar: [
    s('rect', { x: 20, y: 84, width: 80, height: 56, rx: 6 }, 'gray'),
    s('path', { d: 'M60 84l30-50', ...SW(8) }, 'dark', { stroke: true }),
    s('circle', { cx: 92, cy: 32, r: 12 }, 'red', { accent: true }),
    arrow('M44 50q10-20 34-26', 'orange', 4),
    ...gear(124, 112, 14, 10, 'blue'),
    s('path', { d: dots([[40, 112], [60, 112]], 6) }, 'green')
  ],
  adrenalina: [
    s('path', { d: heart(76, 84, 38) }, 'red', { accent: true }),
    s('path', { d: 'M88 24l-20 46h18l-14 50 40-62H92l14-34z' }, 'yellow'),
    s('path', { d: 'M126 70l12-6M128 88h14M126 106l12 6', ...SW(4) }, 'orange', { stroke: true })
  ],
  algoritmo: [
    s('rect', { x: 56, y: 14, width: 48, height: 22, rx: 11 }, 'green'),
    s('path', { d: 'M80 36v12M80 82v14M106 64h18v32M80 116v10M124 116v10', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: poly([[80, 48], [106, 65], [80, 82], [54, 65]]) }, 'yellow', { accent: true }),
    s('rect', { x: 56, y: 96, width: 48, height: 22, rx: 3 }, 'blue'),
    s('rect', { x: 108, y: 96, width: 36, height: 22, rx: 3 }, 'purple'),
    s('rect', { x: 62, y: 126, width: 72, height: 18, rx: 9 }, 'red')
  ],
  apretar: [
    s('rect', { x: 34, y: 112, width: 92, height: 30, rx: 6 }, 'gray'),
    s('ellipse', { cx: 80, cy: 110, rx: 26, ry: 8 }, 'red', { accent: true }),
    s('path', { d: 'M66 104V40a14 14 0 0 1 28 0v64z' }, 'skin'),
    s('path', { d: 'M94 64h18a10 10 0 0 1 0 20h-18zM94 84h14a9 9 0 0 1 0 18h-14z' }, 'skin'),
    s('path', { d: 'M40 96l-10-8M120 96l10-8M36 110H22M124 110h14', ...SW(4) }, 'orange', { stroke: true })
  ],
  ascendencia: [
    s('path', { d: busts([40, 68, 92, 120], 52, 18, 18) + dots([[40, 26], [68, 26], [92, 26], [120, 26]], 8) }, 'gray'),
    s('path', { d: busts([56, 104], 96, 22, 22) + dots([[56, 64], [104, 64]], 10) }, 'tan'),
    s('circle', { cx: 80, cy: 108, r: 11 }, 'skin'),
    s('path', { d: busts([80], 146, 26, 26) }, 'orange', { accent: true }),
    s('path', { d: 'M56 54v-6M104 54v-6M80 98l-14-14M80 98l14-14', ...SW(3) }, 'brown', { stroke: true }),
    arrow('M140 140V70M132 78l8-8 8 8', 'green', 4)
  ],
  austral: [
    s('circle', { cx: 74, cy: 80, r: 56 }, 'sky'),
    s('path', { d: 'M18 80a56 56 0 0 0 112 0z' }, 'blue', { accent: true }),
    s('path', { d: 'M18 80h112', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M50 44q16-10 28 0t8 20l-20-4z' }, 'green'),
    s('path', { d: star(140, 112, 6) + star(128, 132, 5) + star(146, 140, 4) + star(136, 96, 4) }, 'yellow')
  ],
  autorizar: [
    ...paper(28, 70, 104, 74),
    s('path', { d: 'M40 86h50M40 100h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: ring(102, 118, 18), ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M94 118l6 6 12-12', ...SW(4) }, 'green', { stroke: true }),
    s('rect', { x: 92, y: 26, width: 20, height: 30, rx: 8 }, 'brown', { accent: true }),
    s('rect', { x: 82, y: 54, width: 40, height: 14, rx: 3 }, 'red'),
    arrow('M130 30v28M124 50l6 8 6-8', 'orange', 4)
  ],
  baba: [
    s('circle', { cx: 80, cy: 78, r: 50 }, 'skin', { accent: true }),
    s('path', { d: 'M58 66q6-6 12 0M90 66q6-6 12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 96q16 14 32 0z' }, 'red'),
    s('path', { d: 'M92 104q4 10 4 22a5 5 0 0 1-10 0q0-10 6-22z' }, 'sky'),
    s('path', { d: 'M74 30q6-10 12 0', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: dots([[50, 84], [110, 84]], 7) }, 'pink')
  ],
  barriga: [
    ground(),
    s('circle', { cx: 80, cy: 34, r: 14 }, 'skin'),
    s('path', { d: 'M58 52h44q30 24 12 64l-4 20H52l-4-20q-18-40 10-64z' }, 'green', { accent: true }),
    s('path', { d: 'M114 84q-10 14-28 16', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M74 32h4M84 32h4M74 40q6 4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 96, r: 3 }, 'dark')
  ],
  bondi: [
    s('rect', { x: 14, y: 40, width: 132, height: 76, rx: 12 }, 'yellow', { accent: true }),
    s('path', { d: rects([[24, 52, 22, 24], [52, 52, 22, 24], [80, 52, 22, 24]]) }, 'sky'),
    s('rect', { x: 110, y: 52, width: 26, height: 56, rx: 3 }, 'sky'),
    s('rect', { x: 14, y: 92, width: 132, height: 8 }, 'red'),
    s('path', { d: dots([[40, 118], [118, 118]], 12) }, 'dark'),
    s('path', { d: 'M14 132h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  centroamericano: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 14h60l-6 30-24 14z' }, 'mint'),
    s('path', { d: 'M44 58l24-14 14 30 26 14 18 12-8 8-18-10-28-12-14-14z' }, 'green', { accent: true }),
    s('path', { d: 'M116 108l30-4v42h-24z' }, 'mint'),
    s('path', { d: 'M78 66l6-10 6 10z' }, 'brown'),
    s('path', { d: 'M28 110q8-6 16 0t16 0M100 40q8-6 16 0t16 0', ...SW(3) }, 'blue', { stroke: true })
  ],
  coeficiente: [
    s('path', { d: 'M22 18v118h122', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 128L136 34', ...SW(5) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M64 97h40v-35', ...DASH(4, '6 4') }, 'red', { stroke: true }),
    s('path', { d: dots([[64, 97], [104, 62]], 6) }, 'orange'),
    s('path', { d: ring(84, 80, 0) }, 'gray')
  ],
  criollo: [
    ground(),
    s('rect', { x: 22, y: 64, width: 96, height: 72 }, 'cream'),
    s('path', { d: 'M14 68l12-18h88l12 18z' }, 'orange', { accent: true }),
    s('path', { d: 'M38 136v-34a10 10 0 0 1 20 0v34z' }, 'brown'),
    s('path', { d: rects([[76, 82, 28, 24]]) }, 'blue'),
    s('path', { d: 'M72 110h36M76 106v8M84 106v8M92 106v8M100 106v8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M134 136V70', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(134, 70, -150, 22, 6) + leaflet(134, 70, -30, 22, 6) + leaflet(134, 70, -90, 18, 5) }, 'green')
  ],
  'currículum': [
    ...paper(30, 16, 100, 128),
    s('rect', { x: 42, y: 28, width: 30, height: 36, rx: 3 }, 'sky'),
    s('circle', { cx: 57, cy: 42, r: 8 }, 'skin'),
    s('path', { d: 'M45 64q12-16 24 0z' }, 'blue', { accent: true }),
    s('path', { d: 'M82 34h36M82 48h28M42 80h76M42 94h76M42 108h60M42 122h70', ...SW(4) }, 'gray', { stroke: true })
  ],
  cursar: [
    ground(),
    ...person(58, 136, 'blue'),
    s('rect', { x: 66, y: 94, width: 20, height: 34, rx: 6 }, 'orange'),
    s('path', { d: rects([[96, 120, 40, 8], [100, 112, 34, 8]]) }, 'red', { accent: true }),
    s('rect', { x: 94, y: 104, width: 44, height: 8 }, 'green'),
    s('path', { d: 'M30 30l28-12 28 12-28 12z' }, 'dark'),
    s('path', { d: 'M86 30v14', ...SW(3) }, 'yellow', { stroke: true })
  ],
  decencia: [
    ground(),
    s('circle', { cx: 80, cy: 46, r: 16 }, 'skin'),
    s('path', { d: 'M64 42q2-18 16-18t16 18q-10-8-32 0z' }, 'brown'),
    s('rect', { x: 60, y: 64, width: 40, height: 72, rx: 12 }, 'navy'),
    s('path', { d: 'M72 64l8 12 8-12z' }, 'white'),
    s('path', { d: 'M72 74l8 4-8 4zM88 74l-8 4 8 4z' }, 'red', { accent: true }),
    s('path', { d: 'M74 52q6 4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(124, 40, 8) }, 'yellow')
  ],
  dialogar: [
    ground(),
    ...person(34, 136, 'blue'),
    ...person(126, 136, 'orange'),
    s('path', { d: bubble(24, 16, 54, 34) }, 'sky', { accent: true }),
    s('path', { d: bubble(82, 34, 54, 34), transform: 'scale(-1 1) translate(-218 0)' }, 'mint'),
    s('path', { d: dots([[40, 32], [52, 32], [64, 32], [98, 50], [110, 50], [122, 50]], 3) }, 'dark')
  ],
  dictar: [
    s('circle', { cx: 34, cy: 50, r: 16 }, 'skin'),
    s('rect', { x: 20, y: 68, width: 30, height: 60, rx: 10 }, 'navy'),
    s('path', { d: 'M56 46q8 8 0 16M64 40q12 14 0 28', ...SW(4) }, 'gray', { stroke: true }),
    ...paper(80, 50, 60, 80),
    s('path', { d: 'M90 66h40M90 80h40M90 94h24', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M114 110l22-30', ...SW(6) }, 'orange', { stroke: true, accent: true })
  ],
  discreto: [
    s('circle', { cx: 80, cy: 80, r: 50 }, 'skin'),
    s('path', { d: 'M58 66q6-4 12 0M90 66q6-4 12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 104h36', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 74, y: 82, width: 12, height: 64, rx: 6 }, 'tan', { accent: true }),
    s('path', { d: 'M118 30q10 10 0 20M130 24q14 16 0 32', ...SW(3) }, 'gray', { stroke: true })
  ],
  'encarnación': [
    ground(),
    s('circle', { cx: 40, cy: 54, r: 14, ...DASH(3, '4 4') }, 'purple', { stroke: true }),
    s('path', { d: 'M24 120V84q0-14 16-14t16 14v36l-8-6-8 6-8-6z', ...DASH(3, '4 4') }, 'purple', { stroke: true }),
    arrow('M62 90h26M80 82l8 8-8 8', 'orange', 5),
    ...person(118, 136, 'purple', { accent: true }),
    s('path', { d: sparkle(140, 50, 8) }, 'yellow')
  ],
  'esquí': [
    s('path', { d: 'M14 146L146 72v74z' }, 'white'),
    s('path', { d: 'M14 146L146 72', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M30 120l92-52', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 70, cy: 38, r: 11 }, 'skin'),
    s('rect', { x: 58, y: 50, width: 24, height: 42, rx: 8, transform: 'rotate(20 70 92)' }, 'blue'),
    s('path', { d: 'M60 92l-2 16M80 90l6 12M54 66l-14 40M84 62l20 26', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 30q8-10 16 0z' }, 'red')
  ],
  fanatismo: [
    ground(),
    s('circle', { cx: 60, cy: 74, r: 13 }, 'skin'),
    s('rect', { x: 44, y: 88, width: 32, height: 48, rx: 10 }, 'red', { accent: true }),
    s('path', { d: 'M76 94l14-24M44 94l-12-26', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M92 72l20-54', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M112 18l28 12-22 18z' }, 'yellow'),
    s('path', { d: 'M54 82q6 6 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 50l10 6M24 34l8 10M120 70l14 4', ...SW(3) }, 'orange', { stroke: true })
  ],
  finalista: [
    s('rect', { x: 14, y: 120, width: 132, height: 20 }, 'gray'),
    s('path', { d: checker(108, 20, 3, 6, 12) }, 'black'),
    s('rect', { x: 108, y: 20, width: 36, height: 72, ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 20v100', ...SW(4) }, 'dark', { stroke: true }),
    ...lean(62, 136, 14, 'orange', { accent: true }),
    s('path', { d: 'M64 104l20-14M60 108l-18 8', ...SW(6) }, 'skin', { stroke: true })
  ],
  follar: [
    s('rect', { x: 20, y: 96, width: 120, height: 26, rx: 4 }, 'cream'),
    s('rect', { x: 14, y: 70, width: 12, height: 70, rx: 3 }, 'brown'),
    s('rect', { x: 134, y: 84, width: 12, height: 56, rx: 3 }, 'brown'),
    s('rect', { x: 20, y: 120, width: 120, height: 10 }, 'brown'),
    s('rect', { x: 46, y: 82, width: 94, height: 20, rx: 6 }, 'blue'),
    s('path', { d: heart(66, 38, 18) }, 'red', { accent: true }),
    s('path', { d: heart(98, 44, 14) }, 'pink')
  ],
  'fármaco': [
    s('rect', { x: 26, y: 46, width: 60, height: 92, rx: 8 }, 'orange'),
    s('rect', { x: 22, y: 26, width: 68, height: 22, rx: 4 }, 'white'),
    outline({ x: 22, y: 26, width: 68, height: 22, rx: 4 }),
    s('rect', { x: 32, y: 70, width: 48, height: 46, rx: 3 }, 'white'),
    s('path', { d: 'M56 80v26M43 93h26', ...SW(7) }, 'red', { stroke: true, accent: true }),
    s('rect', { x: 100, y: 96, width: 22, height: 44, rx: 11, transform: 'rotate(-30 111 118)' }, 'blue'),
    s('circle', { cx: 132, cy: 82, r: 10 }, 'mint')
  ],
  'genérico': [
    s('path', { d: rects([[20, 70, 36, 66], [62, 70, 36, 66], [104, 70, 36, 66]]) }, 'gray'),
    s('path', { d: rects([[20, 62, 36, 10], [62, 62, 36, 10], [104, 62, 36, 10]]) }, 'dark'),
    s('rect', { x: 62, y: 92, width: 36, height: 22 }, 'white', { accent: true }),
    s('path', { d: rects([[20, 92, 36, 22], [104, 92, 36, 22]]) }, 'white'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'brown', { stroke: true })
  ],
  'hidrógeno': [
    s('path', { d: ring(80, 80, 50), ...SW(4) }, 'blue', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 20 }, 'red', { accent: true }),
    s('circle', { cx: 115, cy: 45, r: 9 }, 'blue'),
    s('path', { d: sparkle(80, 80, 8) }, 'pink')
  ],
  honrar: [
    ground(),
    ...person(44, 136, 'blue'),
    ...person(116, 136, 'green'),
    s('path', { d: 'M58 96l24-14', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M108 92l8 14 8-14', ...SW(4) }, 'red', { stroke: true }),
    s('circle', { cx: 116, cy: 112, r: 9 }, 'yellow', { accent: true }),
    s('path', { d: laurel(116, 66, 22, 10, 4) }, 'green')
  ],
  huida: [
    ground(),
    ...lean(76, 136, 24, 'orange', { accent: true }),
    s('path', { d: 'M74 136l-16-4M80 132l12 4', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 70h30M20 90h30M14 110h30', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 120, y: 56, width: 24, height: 80 }, 'brown'),
    s('path', { d: 'M126 40l8-8M136 46l8-4', ...SW(3) }, 'gray', { stroke: true })
  ],
  infinidad: [
    backdrop('navy'),
    s('path', { d: star(50, 50, 14) + star(110, 100, 12) }, 'yellow', { accent: true }),
    s('path', { d: dots([[30, 90], [80, 30], [130, 40], [70, 80], [40, 128], [100, 130], [130, 70], [96, 60], [60, 110], [24, 30], [140, 130]], 3) }, 'white'),
    s('path', { d: dots([[86, 104], [118, 22], [36, 68], [54, 140], [128, 122]], 2) }, 'sky')
  ],
  insistencia: [
    s('rect', { x: 20, y: 18, width: 66, height: 128, rx: 3 }, 'brown'),
    s('circle', { cx: 74, cy: 84, r: 4 }, 'yellow'),
    s('path', { d: 'M108 70q-14-2-14 12v16q0 12 14 12h10V70z' }, 'skin', { accent: true }),
    s('path', { d: 'M118 80h22', ...SW(14) }, 'blue', { stroke: true }),
    s('path', { d: 'M90 50l-6-8M100 46v-12M90 124l-6 8M100 128v12', ...SW(4) }, 'orange', { stroke: true })
  ],
  instructor: [
    ground(),
    s('circle', { cx: 56, cy: 54, r: 14 }, 'skin'),
    s('path', { d: 'M42 50q0-18 14-18t14 18z' }, 'red'),
    s('rect', { x: 40, y: 70, width: 32, height: 66, rx: 10 }, 'red', { accent: true }),
    s('path', { d: 'M48 70l8 20 8-20', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 52, y: 88, width: 10, height: 6, rx: 2 }, 'gray'),
    s('path', { d: 'M72 82l20-14', ...SW(7) }, 'skin', { stroke: true }),
    ...person(122, 136, 'blue', { h: 32, w: 22, r: 10 })
  ],
  intervalo: [
    s('path', { d: 'M14 104h132', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[24, 104], [44, 104], [116, 104], [136, 104]], 5) }, 'gray'),
    s('path', { d: dots([[44, 104], [116, 104]], 8) }, 'blue', { accent: true }),
    s('path', { d: 'M44 80q36-40 72 0', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M44 124v10h72v-10', ...SW(3) }, 'gray', { stroke: true }),
  ],
  jacinto: [
    s('path', { d: 'M80 140V44', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 140, -120, 60, 8) + leaflet(80, 140, -60, 60, 8) }, 'green'),
    s('path', { d: dots([[80, 26], [70, 38], [90, 38], [66, 52], [80, 50], [94, 52], [68, 66], [82, 64], [94, 68], [74, 78], [88, 80]], 9) }, 'purple', { accent: true }),
    s('path', { d: dots([[76, 30], [74, 58], [86, 72]], 3) }, 'pink')
  ],
  jesuita: [
    ground(),
    s('path', { d: 'M38 136l8-60h28l8 60z' }, 'black', { accent: true }),
    s('circle', { cx: 60, cy: 62, r: 13 }, 'skin'),
    s('rect', { x: 54, y: 74, width: 12, height: 5, rx: 2 }, 'white'),
    s('rect', { x: 50, y: 94, width: 22, height: 16, rx: 2 }, 'brown'),
    s('circle', { cx: 116, cy: 84, r: 22 }, 'sky'),
    s('path', { d: 'M104 72q10-4 14 6t-4 14M120 96q8-2 10-10', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M116 106v16M100 136l16-14 16 14', ...SW(4) }, 'brown', { stroke: true })
  ],
  llanura: [
    s('rect', { x: 14, y: 14, width: 132, height: 80 }, 'sky'),
    s('rect', { x: 14, y: 94, width: 132, height: 52 }, 'green', { accent: true }),
    s('path', { d: 'M14 94h132', ...SW(2) }, 'mint', { stroke: true }),
    s('circle', { cx: 42, cy: 44, r: 14 }, 'yellow'),
    s('path', { d: 'M110 94V78', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 110, cy: 72, r: 10 }, 'green'),
    s('path', { d: 'M28 116l4-6 4 6M66 132l4-6 4 6M118 122l4-6 4 6', ...SW(2) }, 'mint', { stroke: true })
  ],
  mara: [
    s('rect', { x: 14, y: 14, width: 132, height: 122 }, 'gray'),
    s('path', { d: 'M24 40q20-16 40 0t40 0 34 0', ...SW(6) }, 'purple', { stroke: true }),
    s('path', { d: busts([44, 80, 116], 136, 30, 64) }, 'dark', { accent: true }),
    s('path', { d: dots([[44, 72], [80, 72], [116, 72]], 13) }, 'black'),
    s('path', { d: ells([[44, 78, 7, 4], [80, 78, 7, 4], [116, 78, 7, 4]]) }, 'skin'),
    ground(138)
  ],
  marica: [
    ground(),
    s('rect', { x: 84, y: 40, width: 50, height: 96, rx: 4 }, 'brown'),
    s('circle', { cx: 74, cy: 70, r: 12 }, 'skin'),
    s('rect', { x: 62, y: 84, width: 26, height: 52, rx: 9 }, 'mint', { accent: true }),
    s('path', { d: dots([[70, 68]], 2) + drop(60, 62, 3) }, 'dark'),
    s('path', { d: 'M48 70l-8-4M48 82h-10M50 94l-8 4', ...SW(3) }, 'gray', { stroke: true })
  ],
  medioambiental: [
    s('circle', { cx: 74, cy: 86, r: 50 }, 'blue'),
    s('path', { d: 'M40 56q16-8 30 4t-4 26l-20 6-10-16zM84 98q18-6 28 8l-6 22-18-4z' }, 'green'),
    s('path', { d: leaflet(104, 50, -45, 46, 16) }, 'green', { accent: true }),
    s('path', { d: 'M104 50l30-30', ...SW(3) }, 'mint', { stroke: true })
  ],
  ministerial: [
    ground(),
    s('rect', { x: 26, y: 58, width: 108, height: 78 }, 'cream'),
    s('path', { d: 'M20 60h120L80 30z' }, 'gray'),
    s('path', { d: grid(36, 70, 4, 3, 14, 14, 24, 20) }, 'sky'),
    s('rect', { x: 70, y: 112, width: 20, height: 24 }, 'brown'),
    s('rect', { x: 108, y: 100, width: 36, height: 28, rx: 4 }, 'dark', { accent: true }),
    s('path', { d: 'M118 100v-6h16v6', ...SW(3) }, 'dark', { stroke: true })
  ],
  molde: [
    s('path', { d: 'M18 72h124l-14 56H32z' }, 'gray'),
    s('path', { d: 'M30 82h100l-10 38H40z' }, 'dark'),
    s('path', { d: 'M40 120q0-30 40-30t40 30z' }, 'tan', { accent: true }),
    s('path', { d: star(80, 40, 22) }, 'orange'),
    arrow('M80 64v12', 'gray', 4)
  ],
  morro: [
    s('path', { d: 'M40 30q-24 30-10 80l40 20q20 2 24-10l40-4q14-10 4-28L80 54q-10-26-40-24z' }, 'brown'),
    s('path', { d: 'M84 64l50 18q14 10 2 28l-40 6z' }, 'tan', { accent: true }),
    s('ellipse', { cx: 138, cy: 88, rx: 8, ry: 7 }, 'black'),
    s('circle', { cx: 70, cy: 62, r: 5 }, 'dark'),
    s('path', { d: 'M40 30q-16 10-16 40q10-6 18-24z' }, 'dark'),
    s('path', { d: 'M100 112q14 6 30-2', ...SW(3) }, 'dark', { stroke: true })
  ],
  panamericano: [
    s('path', { d: 'M40 20h40l6 18-20 22 10 10 26 10 12 20-10 26-14 14-6-20-6-22-18-16-20-14-12-24z' }, 'green'),
    s('path', { d: 'M120 140l-4-50', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 90h16l4-8h-24z' }, 'yellow'),
    s('path', { d: 'M116 82q-14-14 0-34q2 12 8 14q2-10 8-12q4 18-8 32z' }, 'orange', { accent: true }),
    s('path', { d: ring(40, 120, 10) + ring(62, 120, 10), ...SW(3) }, 'blue', { stroke: true })
  ],
  patrocinio: [
    ground(),
    ...person(40, 136, 'navy'),
    ...person(120, 136, 'orange', { accent: true }),
    s('path', { d: 'M54 100h18M106 100h-12', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M74 92q-12 4-10 18q2 10 16 10t16-10q2-14-10-18l4-8H70z' }, 'yellow'),
    s('path', { d: 'M74 92h12', ...SW(3) }, 'brown', { stroke: true }),
    s('rect', { x: 112, y: 100, width: 16, height: 10 }, 'white')
  ],
  'perímetro': [
    s('rect', { x: 40, y: 40, width: 80, height: 80 }, 'mint'),
    s('rect', { x: 40, y: 40, width: 80, height: 80, ...SW(6) }, 'green', { stroke: true, accent: true }),
    arrow('M30 30h100M120 22l10 8-10 8', 'orange', 4),
    arrow('M130 30v100M122 120l8 10 8-10', 'orange', 4),
    arrow('M130 130H30M40 122l-10 8 10 8', 'orange', 4),
    arrow('M30 130V30M22 40l8-10 8 10', 'orange', 4)
  ],
  pionero: [
    s('path', { d: 'M14 140q40-70 66-76q30 6 66 76z' }, 'green'),
    ...person(70, 70, 'brown', { h: 30, w: 22, r: 10 }),
    s('path', { d: 'M96 66V18', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 18h34l-8 10 8 10H96z' }, 'red', { accent: true }),
    s('path', { d: 'M80 54l16-6', ...SW(5) }, 'skin', { stroke: true })
  ],
  'planeación': [
    s('rect', { x: 14, y: 22, width: 132, height: 116, rx: 6 }, 'cream'),
    s('path', { d: 'M30 120q20-40 50-30t50-50', ...DASH(5, '8 8') }, 'red', { stroke: true }),
    s('circle', { cx: 30, cy: 120, r: 7 }, 'blue'),
    s('path', { d: 'M126 46V18', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M126 18h18l-6 7 6 7h-18z' }, 'green', { accent: true }),
    s('path', { d: 'M54 40l8 8M62 40l-8 8M100 108l8 8M108 108l-8 8', ...SW(3) }, 'gray', { stroke: true })
  ],
  potestad: [
    s('path', { d: 'M40 140l40-110', ...SW(8) }, 'yellow', { stroke: true }),
    s('circle', { cx: 84, cy: 26, r: 14 }, 'yellow', { accent: true }),
    s('path', { d: sparkle(84, 26, 9) }, 'white'),
    s('path', { d: 'M42 100q16-8 30 2v20q-16 10-36 2z' }, 'skin'),
    s('path', { d: halfRays(84, 26, 20, 30, 5), ...SW(3) }, 'orange', { stroke: true }),
    s('rect', { x: 18, y: 108, width: 26, height: 30, rx: 6 }, 'purple')
  ],
  procesal: [
    s('path', { d: rects([[20, 112, 40, 28], [60, 84, 40, 56], [100, 56, 40, 84]]) }, 'gray'),
    ...paper(28, 94, 24, 16),
    ...paper(68, 66, 24, 16),
    s('path', { d: 'M108 46l24-24', ...SW(6) }, 'tan', { stroke: true }),
    s('rect', { x: 102, y: 30, width: 30, height: 14, rx: 4, transform: 'rotate(-45 117 37)' }, 'brown', { accent: true }),
    arrow('M30 70q20-24 40-36', 'orange', 4)
  ],
  'procuraduría': [
    ground(),
    s('rect', { x: 24, y: 64, width: 112, height: 72 }, 'cream'),
    s('path', { d: 'M18 66h124L80 30z' }, 'navy'),
    s('path', { d: rects([[34, 74, 10, 54], [116, 74, 10, 54]]) }, 'gray'),
    s('path', { d: 'M80 76v42M60 84h40M60 84l-8 16M60 84l8 16M100 84l-8 16M100 84l8 16M70 118h20', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 100h16a8 6 0 0 1-16 0zM92 100h16a8 6 0 0 1-16 0z' }, 'yellow', { accent: true })
  ],
  'proliferación': [
    s('circle', { cx: 30, cy: 80, r: 14 }, 'green', { accent: true }),
    arrow('M48 80h10', 'gray', 4),
    s('path', { d: dots([[72, 66], [72, 94]], 12) }, 'green'),
    arrow('M88 80h10', 'gray', 4),
    s('path', { d: dots([[112, 30], [134, 44], [112, 62], [134, 76], [112, 94], [134, 108], [112, 126], [134, 140]], 9) }, 'mint'),
    s('path', { d: dots([[30, 80], [72, 66], [72, 94]], 4) }, 'dark')
  ],
  publicitario: [
    s('path', { d: 'M58 116v24M102 116v24', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 14, y: 26, width: 132, height: 90, rx: 4 }, 'dark'),
    s('rect', { x: 20, y: 32, width: 120, height: 78 }, 'yellow', { accent: true }),
    s('path', { d: 'M38 54l20 10v26l-20 8zM58 64h18l20-20v60l-20-20H58' }, 'red'),
    s('path', { d: 'M104 54q10 16 0 32M116 46q16 24 0 48', ...SW(4) }, 'red', { stroke: true }),
    ground(140)
  ],
  'remuneración': [
    s('path', { d: 'M18 120q20-16 40-10h30q8 2 4 10H66', ...SW(8) }, 'skin', { stroke: true }),
    s('rect', { x: 52, y: 40, width: 72, height: 50, rx: 4 }, 'cream'),
    outline({ x: 52, y: 40, width: 72, height: 50, rx: 4 }),
    s('path', { d: 'M52 40l36 26 36-26', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 70, y: 24, width: 40, height: 28, rx: 2 }, 'green', { accent: true }),
    s('path', { d: ells([[132, 126, 12, 5], [132, 118, 12, 5], [132, 110, 12, 5]]) }, 'yellow')
  ],
  rosal: [
    ground(),
    s('path', { d: ells([[80, 96, 52, 38]]) }, 'green'),
    s('path', { d: dots([[54, 80], [92, 70], [116, 96], [66, 110], [100, 116]], 10) }, 'red', { accent: true }),
    s('path', { d: dots([[54, 80], [92, 70], [116, 96], [66, 110], [100, 116]], 4) }, 'pink'),
    s('path', { d: 'M76 134v-12M86 134v-12', ...SW(5) }, 'brown', { stroke: true })
  ],
  semen: [
    s('circle', { cx: 80, cy: 80, r: 64 }, 'sky'),
    s('path', { d: ring(80, 80, 64), ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: ells([[56, 56, 9, 7], [100, 84, 9, 7], [64, 112, 9, 7]]) }, 'white', { accent: true }),
    s('path', { d: 'M47 56q-10 6-16-2t-14 0M91 84q-10 6-16-2t-14 0M55 112q-10 6-16-2t-12 0', ...SW(3) }, 'white', { stroke: true })
  ],
  sencillez: [
    s('path', { d: 'M80 104V50', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 80, -30, 20, 7) }, 'green'),
    s('circle', { cx: 80, cy: 40, r: 14 }, 'yellow', { accent: true }),
    s('path', { d: 'M62 98h36l-4 42H66z' }, 'sky'),
    s('path', { d: 'M62 98h36l-4 42H66z', ...SW(3) }, 'gray', { stroke: true })
  ],
  soda: [
    s('path', { d: 'M48 50h64l-8 92H56z' }, 'sky'),
    s('path', { d: 'M52 70h56l-6 72H58z' }, 'orange', { accent: true }),
    s('path', { d: 'M88 80l16-70h14', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: dots([[66, 90], [80, 110], [70, 126], [92, 120], [76, 96]], 3) }, 'white'),
    s('path', { d: 'M48 50h64l-8 92H56z', ...SW(3) }, 'gray', { stroke: true })
  ],
  sonda: [
    backdrop('navy'),
    s('path', { d: rects([[18, 66, 36, 28], [106, 66, 36, 28]]) }, 'blue'),
    s('path', { d: 'M54 80h52', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 66, y: 64, width: 28, height: 32, rx: 4 }, 'yellow', { accent: true }),
    s('path', { d: 'M60 52q20 20 40 0z' }, 'white'),
    s('path', { d: 'M80 52V34', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: dots([[30, 30], [130, 130], [130, 30], [36, 130]], 2) }, 'white')
  ],
  sostenibilidad: [
    s('path', { d: 'M80 104V68', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 76, -140, 26, 9) + leaflet(80, 70, -40, 26, 9) }, 'green', { accent: true }),
    s('path', { d: 'M36 110a48 48 0 0 1 22-70M100 36a48 48 0 0 1 22 70M108 124a48 48 0 0 1-56 0', ...SW(7) }, 'green', { stroke: true }),
    s('path', { d: 'M50 32l10 6-6 10M128 102l-6 10-10-4M46 126l2-12 12 2' , ...SW(5) }, 'green', { stroke: true })
  ],
  sud: [
    ground(),
    s('path', { d: 'M80 136V30', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M54 50h52v30l-26 28-26-28z' }, 'green', { accent: true }),
    s('path', { d: 'M80 58v32M70 80l10 10 10-10', ...SW(4) }, 'white', { stroke: true }),
  ],
  sushi: [
    s('rect', { x: 14, y: 110, width: 132, height: 20, rx: 6 }, 'brown'),
    s('path', { d: 'M24 110v-22q0-10 10-10h40q10 0 10 10v22z' }, 'white'),
    s('path', { d: 'M20 84q2-20 34-20t34 20q-4 6-34 4t-34-4z' }, 'orange', { accent: true }),
    s('path', { d: 'M38 70l8 12M54 66l6 14M70 68l4 12', ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 116, cy: 90, r: 20 }, 'black'),
    s('circle', { cx: 116, cy: 90, r: 14 }, 'white'),
    s('circle', { cx: 116, cy: 90, r: 6 }, 'pink'),
    s('path', { d: 'M24 110v-22q0-10 10-10h40q10 0 10 10v22', ...SW(2) }, 'gray', { stroke: true })
  ],
  telegrama: [
    s('rect', { x: 18, y: 108, width: 70, height: 16, rx: 4 }, 'brown'),
    s('path', { d: 'M30 108l40-22', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 72, cy: 84, r: 8 }, 'dark', { accent: true }),
    s('path', { d: 'M96 30h44v100H96z' }, 'cream'),
    s('path', { d: 'M96 30h44v100H96z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 44h4M114 44h12M132 44h2M104 60h12M122 60h4M104 76h4M114 76h4M124 76h10M104 92h12M122 92h12M104 108h4', ...SW(5) }, 'dark', { stroke: true })
  ],
  tragar: [
    s('path', { d: 'M40 140V96q0-56 46-60q36 0 40 34l8 20-10 4q0 16-12 16H96v30z' }, 'skin'),
    s('path', { d: 'M96 76q10 0 16 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 108v32', ...SW(10) }, 'pink', { stroke: true }),
    s('ellipse', { cx: 96, cy: 122, rx: 8, ry: 6 }, 'red', { accent: true }),
    arrow('M74 104v32M66 128l8 8 8-8', 'orange', 4),
    s('circle', { cx: 100, cy: 54, r: 4 }, 'dark')
  ],
  trascendencia: [
    s('path', { d: halfRays(80, 70, 30, 58, 9), ...SW(5) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 60, r: 22 }, 'yellow', { accent: true }),
    s('path', { d: 'M40 90l40-30 40 30z' }, 'gray'),
    s('path', { d: ells([[30, 104, 22, 12], [80, 108, 30, 14], [130, 104, 22, 12]]) }, 'sky'),
    s('path', { d: 'M14 146l40-36 26 20 26-24 40 40z' }, 'navy')
  ],
  'trilogía': [
    ground(),
    s('rect', { x: 28, y: 36, width: 30, height: 100, rx: 3 }, 'red', { accent: true }),
    s('rect', { x: 64, y: 36, width: 30, height: 100, rx: 3 }, 'red'),
    s('rect', { x: 100, y: 36, width: 30, height: 100, rx: 3 }, 'red'),
    s('path', { d: 'M28 56h102M28 116h102', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[43, 86], [74, 86], [84, 86], [105, 86], [115, 86], [125, 86]], 4) }, 'yellow')
  ],
  veinticinco: [
    s('rect', { x: 18, y: 18, width: 124, height: 124, rx: 10 }, 'cream'),
    s('rect', { x: 18, y: 18, width: 124, height: 124, rx: 10, ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: dots(Array.from({ length: 25 }, (_, k) => [36 + (k % 5) * 22, 36 + Math.floor(k / 5) * 22]), 8) }, 'blue', { accent: true })
  ],
  vinagre: [
    s('path', { d: 'M50 140q-14 0-14-14V92q0-20 18-28V40h16v24q18 8 18 28v34q0 14-14 14z' }, 'brown', { accent: true }),
    s('path', { d: 'M54 40l8-16 8 16z' }, 'dark'),
    s('rect', { x: 44, y: 98, width: 40, height: 22, rx: 3 }, 'cream'),
    s('path', { d: dots([[112, 82], [128, 82], [120, 96], [104, 96], [136, 96], [112, 110], [128, 110], [120, 124]], 8) }, 'purple'),
    s('path', { d: 'M120 74V62l8-6', ...SW(3) }, 'green', { stroke: true })
  ],
  virginidad: [
    s('path', { d: 'M80 140V86', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 120, -140, 30, 8) + leaflet(80, 112, -30, 30, 8) }, 'green'),
    s('circle', { cx: 80, cy: 60, r: 50 }, 'mint'),
    s('path', { d: 'M80 90q-30-10-34-46q20 2 34 26q14-24 34-26q-4 36-34 46z' }, 'white', { accent: true }),
    s('path', { d: 'M80 90q-12-26 0-56q12 30 0 56z' }, 'cream'),
    s('path', { d: 'M76 66v-12M84 66v-12', ...SW(3) }, 'yellow', { stroke: true })
  ],
  adorno: [
    s('path', { d: 'M80 14v24', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 70, y: 36, width: 20, height: 12, rx: 3 }, 'yellow'),
    s('circle', { cx: 80, cy: 92, r: 46 }, 'red', { accent: true }),
    s('path', { d: 'M36 80q44 20 88 0M38 108q42 20 84 0', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[60, 94], [80, 96], [100, 94]], 4) }, 'white'),
    s('path', { d: 'M58 62q10-10 22-10', ...SW(4) }, 'pink', { stroke: true })
  ],
  agresor: [
    ground(),
    ...lean(56, 136, 12, 'dark', { accent: true }),
    s('path', { d: 'M70 94l30-10', ...SW(8) }, 'skin', { stroke: true }),
    s('circle', { cx: 104, cy: 82, r: 10 }, 'skin'),
    s('path', { d: burst(126, 76, 18, 9, 8) }, 'red'),
    s('path', { d: 'M54 72l10 4', ...SW(3) }, 'dark', { stroke: true })
  ],
  alentar: [
    ground(),
    ...person(42, 136, 'pink', { accent: true }),
    s('path', { d: 'M30 96l-12-30M54 96l12-30', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: dots([[18, 62], [66, 62]], 10) }, 'yellow'),
    ...lean(118, 136, 18, 'blue'),
    s('path', { d: 'M74 40l10-10M80 54l14-4', ...SW(4) }, 'orange', { stroke: true })
  ],
  alimenticio: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'white'),
    s('path', { d: ring(80, 80, 62) + ring(80, 80, 50), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: wedge(80, 80, 44, 180, 300) }, 'green', { accent: true }),
    s('path', { d: wedge(80, 80, 44, 300, 420) }, 'orange'),
    s('path', { d: wedge(80, 80, 44, 60, 180) }, 'tan'),
    s('path', { d: dots([[60, 66], [70, 54], [52, 58]], 6) }, 'mint')
  ],
  anarquista: [
    arrow('M80 80L28 30', 'red', 6),
    arrow('M80 80l50-46', 'blue', 6),
    arrow('M80 80l-56 44', 'green', 6),
    arrow('M80 80l54 50', 'orange', 6),
    arrow('M80 80v-64', 'purple', 6),
    s('circle', { cx: 80, cy: 80, r: 14 }, 'dark', { accent: true })
  ],
  anonimato: [
    s('circle', { cx: 80, cy: 60, r: 34 }, 'gray'),
    s('rect', { x: 46, y: 96, width: 68, height: 50, rx: 20 }, 'gray'),
    s('path', { d: 'M40 56q20-12 40 2q20-14 40-2q-4 22-20 22q-12 0-20-10q-8 10-20 10q-16 0-20-22z' }, 'purple', { accent: true }),
    s('path', { d: ells([[62, 62, 8, 5], [98, 62, 8, 5]]) }, 'dark'),
    s('path', { d: 'M120 58l16-20', ...SW(4) }, 'purple', { stroke: true })
  ],
  anormal: [
    s('rect', { x: 14, y: 26, width: 132, height: 86, rx: 6 }, 'dark'),
    s('path', { d: 'M22 70h28l6-10 6 10h10l10-38 12 64 8-26h30', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: poly([[80, 112], [104, 146], [56, 146]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M80 122v12', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 140, r: 2.5 }, 'dark')
  ],
  antiguamente: [
    s('rect', { x: 20, y: 24, width: 96, height: 84, rx: 3 }, 'brown'),
    s('rect', { x: 28, y: 32, width: 80, height: 68 }, 'tan'),
    s('path', { d: 'M36 100l20-30 16 16 12-12 24 26z' }, 'brown'),
    s('circle', { cx: 88, cy: 48, r: 7 }, 'cream'),
    s('circle', { cx: 112, cy: 112, r: 30 }, 'cream'),
    s('path', { d: ring(112, 112, 30), ...SW(4) }, 'dark', { stroke: true }),
    arrow('M112 112V94M112 112l-12 6M96 136a26 26 0 0 1-8-30', 'red', 4),
    s('path', { d: 'M112 112V94', ...SW(4) }, 'dark', { stroke: true, accent: true })
  ],
  antojo: [
    s('circle', { cx: 46, cy: 112, r: 26 }, 'skin'),
    s('path', { d: 'M36 106q4-4 8 0M52 106q4-4 8 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 122q8 6 14 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[76, 82], [86, 68]], 5) + ells([[112, 44, 34, 28]]) }, 'white'),
    s('path', { d: ells([[112, 44, 34, 28]]) + ring(76, 82, 5) + ring(86, 68, 5), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 46l12 24 12-24z' }, 'tan'),
    s('path', { d: dots([[106, 40], [118, 40]], 8) }, 'pink', { accent: true }),
    s('path', { d: drop(58, 134, 3) }, 'sky')
  ],
  'arqueológico': [
    s('rect', { x: 14, y: 50, width: 132, height: 96 }, 'tan'),
    s('path', { d: 'M14 80h132M14 112h132', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 96q-10-12 0-20h24q10 8 0 20z' }, 'orange', { accent: true }),
    s('path', { d: 'M90 126h36M90 120a6 6 0 0 0 0 12M126 120a6 6 0 0 1 0 12', ...SW(6) }, 'cream', { stroke: true }),
    s('path', { d: 'M100 70l28-50', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 92, y: 64, width: 14, height: 14, rx: 2, transform: 'rotate(30 99 71)' }, 'yellow')
  ],
  'atribución': [
    ...person(54, 136, 'blue'),
    s('path', { d: 'M60 102l24-4', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M84 88h40l12 10-12 10H84z' }, 'yellow', { accent: true }),
    s('circle', { cx: 90, cy: 98, r: 3 }, 'white'),
    arrow('M120 40q-30 0-46 30', 'orange', 4),
    s('path', { d: star(130, 36, 10) }, 'orange'),
    ground()
  ],
  banana: [
    s('path', { d: 'M38 40q-16 70 46 96q30 8 46-6q-50-6-70-82z' }, 'yellow', { accent: true }),
    s('path', { d: 'M56 34q-6 60 54 80q14 2 24-6q-46-14-60-72z' }, 'yellow'),
    s('path', { d: 'M38 40q-16 70 46 96q30 8 46-6M56 34q-6 60 54 80q14 2 24-6', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M38 40l4-16h18l-4 12', ...SW(6) }, 'brown', { stroke: true })
  ],
  banquete: [
    s('rect', { x: 14, y: 96, width: 132, height: 12, rx: 3 }, 'brown'),
    s('path', { d: 'M24 108v34M136 108v34', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 94q0-30 26-30q20 0 22 30z' }, 'orange', { accent: true }),
    s('path', { d: 'M26 96h120', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: dots([[110, 84], [124, 84], [117, 72]], 8) }, 'red'),
    s('rect', { x: 92, y: 54, width: 10, height: 40, rx: 3 }, 'purple'),
    s('path', { d: 'M28 92q8-12 10 0z' }, 'green')
  ],
  barbarie: [
    s('path', { d: poly([[30, 136], [40, 96], [62, 90], [70, 136]]) }, 'gray'),
    s('path', { d: poly([[86, 136], [92, 70], [118, 80], [124, 136]]) }, 'gray'),
    s('path', { d: 'M100 70q-16-20 0-40q4 14 10 14q0-14 8-20q12 24-6 46z' }, 'orange', { accent: true }),
    s('path', { d: 'M44 88q-10-14 2-26q4 10 8 10q2-8 6-10q6 16-6 26z' }, 'orange'),
    s('path', { d: ells([[60, 40, 14, 8], [130, 24, 12, 6]]) }, 'gray'),
    ground()
  ],
  bate: [
    s('path', { d: 'M30 132l84-96', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M70 86l52-58', ...SW(20) }, 'tan', { stroke: true, accent: true }),
    s('circle', { cx: 120, cy: 110, r: 18 }, 'white'),
    s('path', { d: ring(120, 110, 18) + 'M108 98q8 12 0 24M132 98q-8 12 0 24', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M26 136l8-8', ...SW(12) }, 'dark', { stroke: true })
  ],
  boludez: [
    s('circle', { cx: 80, cy: 88, r: 46 }, 'skin'),
    s('path', { d: 'M40 58q-10-30 20-38l20 22 20-22q30 8 20 38z' }, 'purple', { accent: true }),
    s('path', { d: dots([[40, 20], [120, 20]], 6) }, 'yellow'),
    s('path', { d: dots([[66, 80], [94, 84]], 5) }, 'dark'),
    s('path', { d: 'M60 106q20 14 40 0', ...SW(4) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 86, cy: 118, rx: 7, ry: 9 }, 'red')
  ],
  cho: [
    ...horse('brown', 'dark', { accent: true }),
    s('path', { d: 'M130 50L96 70', ...SW(2) }, 'dark', { stroke: true }),
    s('circle', { cx: 30, cy: 34, r: 14 }, 'red'),
    s('rect', { x: 23, y: 30, width: 14, height: 8 }, 'white')
  ],
  compadre: [
    ground(),
    ...person(58, 136, 'blue'),
    ...person(102, 136, 'orange', { accent: true }),
    s('path', { d: 'M68 96q14-10 30-4M92 98q-14-6-30 0', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M52 82q6 4 12 0M96 82q6 4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: heart(80, 38, 12) }, 'red')
  ],
  concordia: [
    s('circle', { cx: 80, cy: 80, r: 24 }, 'sky'),
    s('path', { d: heart(80, 76, 14) }, 'red', { accent: true }),
    s('path', { d: ring(80, 80, 48), ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: dots(around(80, 80, 56, 6, -90), 12) }, 'skin'),
    s('path', { d: dots(around(80, 80, 56, 6, -90), 9) }, 'green')
  ],
  croata: [
    backdrop('blue'),
    s('path', { d: 'M14 90q30-40 70-30t62 10v76H14z' }, 'cream'),
    s('path', { d: 'M24 80l14-12 14 12zM58 70l14-14 14 14zM96 72l14-12 14 12z' }, 'red', { accent: true }),
    s('path', { d: rects([[26, 80, 24, 30], [60, 70, 24, 40], [98, 72, 24, 38]]) }, 'tan'),
    s('rect', { x: 132, y: 40, width: 10, height: 50 }, 'gray'),
    s('path', { d: 'M14 120h132', ...SW(10) }, 'sky', { stroke: true })
  ],
  'curación': [
    s('rect', { x: 20, y: 60, width: 120, height: 42, rx: 21, transform: 'rotate(-30 80 81)' }, 'tan', { accent: true }),
    s('rect', { x: 58, y: 60, width: 44, height: 42, transform: 'rotate(-30 80 81)' }, 'cream'),
    s('path', { d: dots([[72, 76], [88, 76], [72, 88], [88, 88], [80, 82]], 3), transform: 'rotate(-30 80 81)' }, 'tan'),
    s('path', { d: heart(124, 120, 12) }, 'red'),
    s('path', { d: sparkle(34, 34, 8) }, 'yellow')
  ],
  descendencia: [
    s('circle', { cx: 80, cy: 28, r: 12 }, 'skin'),
    s('path', { d: busts([80], 60, 26, 26) }, 'orange', { accent: true }),
    s('path', { d: 'M80 62v8M80 70L46 80M80 70l34 10M46 104l-20 8M46 104l20 8M114 104l-20 8M114 104l20 8', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: busts([46, 114], 104, 20, 20) + dots([[46, 84], [114, 84]], 8) }, 'tan'),
    s('path', { d: busts([26, 66, 94, 134], 146, 16, 18) + dots([[26, 122], [66, 122], [94, 122], [134, 122]], 6) }, 'gray'),
    arrow('M146 24v40M138 56l8 8 8-8', 'green', 4)
  ],
  destreza: [
    ground(),
    ...person(80, 136, 'purple', { accent: true }),
    s('path', { d: 'M66 100l-16-14M94 100l16-14', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M48 76q32-70 64 0', ...DASH(3, '4 6') }, 'gray', { stroke: true }),
    s('circle', { cx: 50, cy: 54, r: 8 }, 'red'),
    s('circle', { cx: 80, cy: 26, r: 8 }, 'blue'),
    s('circle', { cx: 110, cy: 54, r: 8 }, 'yellow')
  ],
  detallar: [
    ...paper(22, 18, 84, 116),
    s('path', { d: 'M34 36h60M34 50h50M34 64h60M34 78h44M34 92h60M34 106h50M34 120h36', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 100, cy: 92, r: 28 }, 'white'),
    s('path', { d: 'M86 84h28M86 96h22', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: ring(100, 92, 28) + 'M120 112l22 24', ...SW(7) }, 'dark', { stroke: true, accent: true })
  ],
  duramente: [
    s('path', { d: 'M14 140L146 60v80z' }, 'green'),
    s('circle', { cx: 96, cy: 54, r: 26 }, 'gray', { accent: true }),
    ...lean(52, 118, 40, 'red'),
    s('path', { d: 'M62 86l16-16', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: drop(30, 66, 4) + drop(22, 82, 3) }, 'sky')
  ],
  ecuatorial: [
    s('circle', { cx: 80, cy: 88, r: 52 }, 'blue'),
    s('path', { d: 'M46 60q16-10 30 0l-4 16-20 4zM90 96q20-4 26 10l-12 20-14-8z' }, 'green'),
    s('path', { d: 'M28 88h104', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: rays(80, 22, 12, 18, 8), ...SW(3) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 22, r: 9 }, 'yellow')
  ],
  empujar: [
    ground(),
    ...lean(46, 136, 30, 'blue'),
    s('path', { d: 'M76 94l16 2', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 92, y: 74, width: 50, height: 62, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: 'M92 74l50 62M142 74l-50 62', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M18 110h14M14 122h14', ...SW(3) }, 'gray', { stroke: true })
  ],
  enojar: [
    s('circle', { cx: 80, cy: 88, r: 46 }, 'red', { accent: true }),
    s('path', { d: 'M56 74l16 8M104 74l-16 8M64 114q16-12 32 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[64, 88], [96, 88]], 5) }, 'dark'),
    s('path', { d: 'M44 34q-6-8 0-16M116 34q6-8 0-16M30 46q-8-6-4-14M130 46q8-6 4-14', ...SW(5) }, 'gray', { stroke: true })
  ],
  estrenar: [
    s('path', { d: 'M14 146l40-70h52l40 70z' }, 'red'),
    s('rect', { x: 46, y: 50, width: 68, height: 44, rx: 3 }, 'dark', { accent: true }),
    s('path', { d: 'M46 50l64-24 4 10-64 24z' }, 'dark'),
    s('path', { d: 'M62 44l6 10M80 38l6 10M98 32l6 10', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: sparkle(28, 34, 10) + sparkle(134, 66, 8) + sparkle(24, 80, 6) }, 'yellow')
  ],
  evolucionar: [
    ground(),
    s('path', { d: 'M28 136v-12', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(28, 126, -130, 12, 4) + leaflet(28, 126, -50, 12, 4) }, 'green'),
    s('path', { d: 'M70 136v-30', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(70, 110, -140, 20, 7) + leaflet(70, 104, -40, 20, 7) }, 'green'),
    s('path', { d: 'M122 136V96', ...SW(8) }, 'brown', { stroke: true }),
    s('circle', { cx: 122, cy: 70, r: 28 }, 'green', { accent: true }),
    arrow('M34 92q14-14 28-6M82 70q14-24 26-24', 'orange', 4)
  ],
  fideo: [
    s('path', { d: 'M24 82h112q0 50-56 54q-56-4-56-54z' }, 'red', { accent: true }),
    s('path', { d: 'M36 82q6-14 12 0t12 0 12 0 12 0 12 0 12 0 12 0', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M56 76q-6-20 6-30t0-26M72 76q-6-20 6-30t0-26', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M96 20l-22 60M110 22l-24 58', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M60 136h40', ...SW(6) }, 'red', { stroke: true })
  ],
  'filmación': [
    s('path', { d: 'M60 106l-24 38M80 106v38M100 106l24 38', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 34, y: 62, width: 72, height: 44, rx: 6 }, 'dark', { accent: true }),
    s('path', { d: dots([[50, 46], [86, 46]], 16) }, 'gray'),
    s('path', { d: dots([[50, 46], [86, 46]], 5) }, 'dark'),
    s('path', { d: 'M106 76l30-14v44l-30-14z' }, 'gray'),
    s('circle', { cx: 46, cy: 74, r: 4 }, 'red')
  ],
  fusil: [
    s('path', { d: 'M14 82h96l4-6h28v12l-20 2-8 6H64l-6 6H40l-14 26H14l10-30z' }, 'brown', { accent: true }),
    s('path', { d: 'M40 76h102', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M76 96q0 14 12 14', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 60, y: 62, width: 34, height: 8, rx: 3 }, 'dark')
  ],
  gaceta: [
    s('rect', { x: 26, y: 26, width: 108, height: 108, rx: 3, transform: 'rotate(-6 80 80)' }, 'cream'),
    s('rect', { x: 26, y: 26, width: 108, height: 108, rx: 3, transform: 'rotate(-6 80 80)', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 36, y: 36, width: 88, height: 16, transform: 'rotate(-6 80 80)' }, 'navy', { accent: true }),
    s('path', { d: 'M36 64h40M36 76h40M36 88h40M36 100h40M36 112h88M84 64h40M84 76h40', ...SW(3), transform: 'rotate(-6 80 80)' }, 'gray', { stroke: true }),
    s('rect', { x: 84, y: 84, width: 40, height: 22, transform: 'rotate(-6 80 80)' }, 'sky')
  ],
  'geometría': [
    s('path', { d: poly([[20, 136], [74, 136], [20, 82]]) }, 'yellow'),
    s('circle', { cx: 112, cy: 110, r: 26 }, 'sky'),
    s('path', { d: ring(112, 110, 26), ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M100 20l-24 66M100 20l12 64', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 100, cy: 20, r: 6 }, 'red', { accent: true }),
    s('rect', { x: 80, y: 40, width: 40, height: 40, ...DASH(3) }, 'purple', { stroke: true })
  ],
  'higiénico': [
    s('rect', { x: 40, y: 40, width: 80, height: 64 }, 'white'),
    s('path', { d: 'M40 40h80v64H40z', ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 40, cy: 72, rx: 14, ry: 32 }, 'white'),
    s('ellipse', { cx: 40, cy: 72, rx: 14, ry: 32, ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 40, cy: 72, rx: 6, ry: 12 }, 'tan', { accent: true }),
    s('path', { d: 'M120 104v34h-60v-34', fill: 'none', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: sparkle(130, 28, 10) + sparkle(26, 126, 8) }, 'sky')
  ],
  incierto: [
    ground(),
    s('path', { d: 'M80 136V44', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 40h44l10 10-10 10H80z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 70H36l-10 10 10 10h44z' }, 'orange'),
    s('path', { d: ells([[40, 30, 22, 12], [130, 96, 18, 10], [30, 116, 18, 8]]) }, 'gray')
  ],
  infiel: [
    s('path', { d: heart(80, 84, 40) }, 'red', { accent: true }),
    s('path', { d: 'M80 124l-10-22 14-14-12-16 8-14', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: drop(124, 120, 6) }, 'sky')
  ],
  infinitamente: [
    s('circle', { cx: 80, cy: 80, r: 66 }, 'cream'),
    s('path', { d: 'M80 80c-20-30-60-30-60 0s40 30 60 0 60-30 60 0-40 30-60 0z', ...SW(12) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: sparkle(80, 34, 10) + sparkle(80, 126, 8) }, 'yellow')
  ],
  inmune: [
    s('path', { d: 'M70 30l40 14v30q0 30-40 48q-40-18-40-48V44z' }, 'green', { accent: true }),
    s('path', { d: 'M56 74l10 10 20-22', ...SW(6) }, 'white', { stroke: true }),
    s('circle', { cx: 130, cy: 112, r: 12 }, 'purple'),
    s('path', { d: rays(130, 112, 12, 20, 8), ...SW(4) }, 'purple', { stroke: true }),
    arrow('M118 96l-6-14M106 82l6-2 4 6', 'orange', 3)
  ],
  leso: [
    s('circle', { cx: 80, cy: 86, r: 46 }, 'skin'),
    s('path', { d: 'M40 62q40-36 80 0', ...SW(14) }, 'white', { stroke: true }),
    s('path', { d: 'M40 62q40-36 80 0', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 92, y: 96, width: 28, height: 12, rx: 3, transform: 'rotate(-30 106 102)' }, 'tan', { accent: true }),
    s('path', { d: dots([[66, 84], [94, 84]], 4) }, 'dark'),
    s('path', { d: 'M66 112q14-8 28 0', ...SW(4) }, 'dark', { stroke: true })
  ],
  levemente: [
    s('path', { d: 'M40 120Q50 40 124 30Q118 100 40 120z' }, 'sky', { accent: true }),
    s('path', { d: 'M40 120Q80 76 118 38', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M40 120l-14 14', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M20 60q10-8 20 0M112 132q10-8 20 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  libreta: [
    s('rect', { x: 40, y: 24, width: 84, height: 112, rx: 6 }, 'orange', { accent: true }),
    s('rect', { x: 50, y: 34, width: 66, height: 92, rx: 2 }, 'cream'),
    s('path', { d: 'M60 52h46M60 68h46M60 84h46M60 100h30', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M34 40h14M34 60h14M34 80h14M34 100h14M34 120h14', ...SW(4) }, 'gray', { stroke: true })
  ],
  maestre: [
    s('path', { d: rays(80, 96, 20, 48, 8), ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: ring(80, 96, 34), ...SW(8) }, 'brown', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 96, r: 10 }, 'tan'),
    s('path', { d: 'M48 34q32-24 64 0l-6 10H54z' }, 'navy'),
    s('rect', { x: 52, y: 40, width: 56, height: 8 }, 'white'),
    s('circle', { cx: 80, cy: 30, r: 5 }, 'yellow')
  ],
  'medicación': [
    s('rect', { x: 14, y: 70, width: 100, height: 40, rx: 6 }, 'sky'),
    s('path', { d: 'M38 70v40M64 70v40M90 70v40', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: dots([[26, 90], [52, 90], [76, 90], [102, 90]], 5) }, 'red', { accent: true }),
    s('path', { d: 'M120 60h26l-4 74h-18z' }, 'sky'),
    s('path', { d: 'M120 60h26l-4 74h-18z', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 46, y: 26, width: 40, height: 18, rx: 9, transform: 'rotate(-20 66 35)' }, 'orange')
  ],
  nuez: [
    s('ellipse', { cx: 80, cy: 82, rx: 52, ry: 56 }, 'tan', { accent: true }),
    s('path', { d: 'M80 26v112', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M46 50q14 10 0 22t0 26 0 24M114 50q-14 10 0 22t0 26 0 24M62 40q10 20 0 40t0 40M98 40q-10 20 0 40t0 40', ...SW(3) }, 'brown', { stroke: true })
  ],
  parche: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 8 }, 'blue'),
    s('path', { d: 'M30 20v120M54 20v120M106 20v120M130 20v120', ...SW(2) }, 'navy', { stroke: true }),
    s('rect', { x: 46, y: 46, width: 68, height: 68, rx: 4 }, 'orange', { accent: true }),
    s('rect', { x: 52, y: 52, width: 56, height: 56, rx: 2, ...DASH(3, '5 5') }, 'white', { stroke: true })
  ],
  peraltar: [
    s('path', { d: 'M14 136L146 96v40z' }, 'green'),
    s('path', { d: 'M20 124L140 88l4 14-120 36z' }, 'dark', { accent: true }),
    s('rect', { x: 62, y: 76, width: 44, height: 20, rx: 6, transform: 'rotate(-17 84 96)' }, 'red'),
    s('path', { d: dots([[72, 104], [102, 94]], 6) }, 'black'),
    s('path', { d: 'M30 60q50-40 100 0', ...DASH(4, '8 6') }, 'orange', { stroke: true })
  ],
  persistente: [
    s('path', { d: 'M24 136q0-30 56-32q56 2 56 32z' }, 'gray', { accent: true }),
    s('ellipse', { cx: 80, cy: 110, rx: 14, ry: 5 }, 'dark'),
    s('path', { d: drop(80, 46, 6) + drop(80, 78, 5) }, 'blue'),
    s('path', { d: 'M40 24h80', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 104l-8-8M98 104l8-8', ...SW(3) }, 'sky', { stroke: true })
  ],
  prestigioso: [
    s('path', { d: laurel(80, 72, 52, 20, 7) }, 'green'),
    s('path', { d: 'M54 34h52v20q0 30-26 34q-26-4-26-34z' }, 'yellow', { accent: true }),
    s('path', { d: 'M74 88h12v18H74zM60 106h40v12H60z' }, 'orange'),
    s('path', { d: star(80, 54, 10) }, 'white')
  ],
  presto: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 136v-50', ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 62, cy: 84, r: 12 }, 'skin'),
    s('path', { d: 'M54 98l-28 16 6 22M54 98l22 38', ...SW(10) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M70 98l4 38', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M120 60h20M116 76h24M120 92h20', ...SW(4) }, 'gray', { stroke: true })
  ],
  'prójimo': [
    ground(),
    ...person(48, 136, 'green', { accent: true }),
    s('circle', { cx: 116, cy: 116, r: 11 }, 'skin'),
    s('path', { d: 'M96 136q0-12 20-12t20 12z' }, 'blue'),
    s('path', { d: 'M62 100l36 12', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 40, 12) }, 'red')
  ],
  puntaje: [
    s('rect', { x: 18, y: 26, width: 124, height: 82, rx: 8 }, 'dark'),
    s('path', { d: rects([[30, 40, 40, 54], [90, 40, 40, 54]]) }, 'black'),
    s('path', { d: dots([[40, 52], [50, 52], [60, 52], [40, 66], [60, 66], [40, 80], [50, 80], [60, 80], [110, 52], [110, 66], [110, 80]], 4) }, 'yellow', { accent: true }),
    s('path', { d: 'M50 108v32M110 108v32', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: dots([[80, 56], [80, 76]], 3) }, 'red')
  ],
  quechua: [
    backdrop('sky'),
    s('path', { d: 'M14 120l40-70 26 40 22-50 44 80v26H14z' }, 'gray'),
    s('path', { d: 'M90 50l12-10 12 12z' }, 'white'),
    s('path', { d: 'M14 120h132v26H14z' }, 'green'),
    s('path', { d: 'M40 114q0-16 16-16h22V70a6 6 0 0 1 12 0v40q0 10-8 12v18h-6v-16H54v16h-6v-18q-8-2-8-8z' }, 'cream', { accent: true }),
    s('path', { d: 'M80 66l-2-8M88 66l2-8', ...SW(3) }, 'cream', { stroke: true }),
    s('circle', { cx: 86, cy: 74, r: 2 }, 'dark')
  ],
  querella: [
    ground(),
    ...person(40, 136, 'blue'),
    s('path', { d: 'M54 100l30-14', ...SW(7) }, 'skin', { stroke: true }),
    ...person(122, 136, 'gray'),
    ...paper(70, 42, 30, 36),
    s('path', { d: 'M76 54h18M76 64h18', ...SW(3) }, 'red', { stroke: true, accent: true })
  ],
  quieto: [
    s('rect', { x: 14, y: 14, width: 132, height: 70 }, 'sky'),
    s('rect', { x: 14, y: 84, width: 132, height: 62 }, 'blue', { accent: true }),
    s('path', { d: 'M40 84l20-36 20 36z' }, 'green'),
    s('path', { d: 'M40 84l20 36 20-36z' }, 'mint'),
    s('circle', { cx: 116, cy: 44, r: 12 }, 'yellow'),
    s('path', { d: 'M96 110h36M104 124h22', ...SW(3) }, 'sky', { stroke: true })
  ],
  'rebaño': [
    s('rect', { x: 14, y: 110, width: 132, height: 36 }, 'green'),
    s('path', { d: ells([[42, 92, 22, 16], [94, 100, 22, 16], [126, 80, 18, 13]]) }, 'white', { accent: true }),
    s('path', { d: ells([[42, 92, 22, 16], [94, 100, 22, 16], [126, 80, 18, 13]]), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: ells([[64, 88, 7, 9], [116, 96, 7, 9], [144, 76, 5, 7]]) }, 'dark'),
    s('path', { d: 'M32 106v12M50 106v12M84 114v12M102 114v12M120 92v10M132 92v10', ...SW(4) }, 'dark', { stroke: true })
  ],
  redactor: [
    s('rect', { x: 14, y: 110, width: 132, height: 8 }, 'brown'),
    s('circle', { cx: 50, cy: 52, r: 13 }, 'skin'),
    s('rect', { x: 34, y: 66, width: 32, height: 44, rx: 10 }, 'purple'),
    s('rect', { x: 76, y: 70, width: 60, height: 38, rx: 3 }, 'gray'),
    s('rect', { x: 82, y: 76, width: 48, height: 26 }, 'white', { accent: true }),
    s('path', { d: 'M88 84h36M88 92h26', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 90l14 12', ...SW(6) }, 'skin', { stroke: true })
  ],
  televisivo: [
    s('path', { d: 'M80 44L58 16M80 44l26-28', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 18, y: 44, width: 124, height: 86, rx: 10 }, 'brown', { accent: true }),
    s('rect', { x: 28, y: 54, width: 82, height: 66, rx: 6 }, 'sky'),
    s('path', { d: dots([[126, 66], [126, 84]], 5) }, 'dark'),
    s('path', { d: 'M40 140l8-10M120 140l-8-10', ...SW(5) }, 'dark', { stroke: true })
  ],
  tibia: [
    s('path', { d: 'M56 20q-10 50 0 70l-6 50h50l-4-50q14-30 6-70z' }, 'skin'),
    s('path', { d: 'M78 94v40', ...SW(10) }, 'white', { stroke: true, accent: true }),
    s('path', { d: dots([[72, 90], [84, 90], [72, 138], [84, 138]], 6) }, 'white'),
    s('path', { d: 'M78 94v40', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: ring(78, 90, 12), ...SW(2) }, 'gray', { stroke: true })
  ],
  tirano: [
    s('circle', { cx: 80, cy: 82, r: 42 }, 'skin'),
    s('path', { d: 'M44 50l6-30 14 16 16-20 16 20 14-16 6 30z' }, 'yellow', { accent: true }),
    s('path', { d: 'M58 72l16 8M102 72l-16 8M62 108q18-12 36 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[66, 86], [94, 86]], 4) }, 'dark'),
    s('path', { d: 'M24 140h112', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[28, 134], [44, 134], [116, 134], [132, 134]], 5) }, 'tan')
  ],
  tobillo: [
    s('path', { d: 'M54 14h34v84q0 14 14 18l30 6q12 4 10 18H44q-6-20 10-40z' }, 'skin'),
    s('circle', { cx: 76, cy: 104, r: 14 }, 'red', { accent: true }),
    s('path', { d: ring(76, 104, 22), ...DASH(3, '5 5') }, 'red', { stroke: true })
  ],
  ucraniano: [
    s('rect', { x: 14, y: 14, width: 132, height: 70 }, 'sky'),
    s('rect', { x: 14, y: 84, width: 132, height: 62 }, 'yellow'),
    s('path', { d: 'M24 100l4-12 4 12M44 112l4-12 4 12M120 100l4-12 4 12M104 118l4-12 4 12', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M78 146V70', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: dots(around(78, 54, 16, 10), 7) }, 'orange', { accent: true }),
    s('circle', { cx: 78, cy: 54, r: 11 }, 'brown')
  ],
  vejez: [
    s('circle', { cx: 80, cy: 84, r: 46 }, 'skin', { accent: true }),
    s('path', { d: 'M34 78q0-44 46-44t46 44q-6-22-46-26q-40 4-46 26z' }, 'gray'),
    s('path', { d: ring(64, 86, 9) + ring(96, 86, 9) + 'M73 86h14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 112q14 8 28 0M56 70h12M92 70h12M48 100q4 4 8 0M104 100q4 4 8 0', ...SW(3) }, 'brown', { stroke: true })
  ],
  'ventilación': [
    s('rect', { x: 34, y: 30, width: 92, height: 92, rx: 6 }, 'gray', { accent: true }),
    s('path', { d: 'M44 48h72M44 64h72M44 80h72M44 96h72M44 112h72', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M22 136q20-10 40 0t40 0 40 0M14 18q20-10 40 0', ...SW(4) }, 'sky', { stroke: true })
  ],
  vil: [
    s('circle', { cx: 80, cy: 84, r: 46 }, 'purple', { accent: true }),
    s('path', { d: 'M54 72l20 8M106 72l-20 8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: ells([[66, 84, 6, 3], [94, 84, 6, 3]]) }, 'yellow'),
    s('path', { d: 'M58 104q22 14 44-6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 100q20-6 40 0', ...SW(5) }, 'black', { stroke: true })
  ],
  'íntegramente': [
    s('path', { d: rects([[30, 30, 50, 50]]) }, 'red', { accent: true }),
    s('path', { d: rects([[80, 30, 50, 50]]) }, 'blue'),
    s('path', { d: rects([[30, 80, 50, 50]]) }, 'yellow'),
    s('path', { d: rects([[80, 80, 50, 50]]) }, 'green'),
    s('path', { d: dots([[80, 55], [55, 80], [105, 80], [80, 105]], 8) }, 'white'),
    s('path', { d: 'M30 30h100v100H30z', ...SW(3) }, 'dark', { stroke: true })
  ],
  aborigen: [
    ground(),
    s('circle', { cx: 112, cy: 34, r: 14 }, 'orange'),
    s('path', { d: 'M18 136l28-40 28 40z' }, 'brown'),
    s('path', { d: 'M38 136l8-12 8 12z' }, 'dark'),
    ...person(104, 136, 'red', { accent: true }),
  ],
  abusar: [
    ground(),
    s('path', { d: 'M36 20h72q12 0 12 12v28q0 14-14 14H40q-14 0-14-14V30q0-10 10-10z' }, 'dark', { accent: true }),
    s('path', { d: 'M48 74v10M66 74v12M84 74v12M102 74v10', ...SW(8) }, 'dark', { stroke: true }),
    ...person(76, 136, 'yellow', { h: 30, w: 24, r: 10 }),
    s('path', { d: drop(98, 100, 4) }, 'sky'),
    s('path', { d: 'M48 104l-10 4M106 104l10 4', ...SW(3) }, 'orange', { stroke: true })
  ],
  alteza: [
    s('path', { d: 'M24 110q56-24 112 0l-10 26H34z' }, 'red'),
    s('path', { d: dots([[24, 112], [136, 112]], 7) }, 'yellow'),
    s('path', { d: 'M42 96l-6-50 24 24 20-36 20 36 24-24-6 50z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[60, 82], [80, 82], [100, 82]], 5) }, 'red'),
    s('circle', { cx: 80, cy: 30, r: 6 }, 'blue')
  ],
  'anticorrupción': [
    s('path', { d: 'M88 80q-18 6-16 28q2 18 26 18t26-18q2-22-16-28l8-14H80z' }, 'yellow'),
    s('path', { d: 'M88 80h20', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M24 96V54a8 8 0 0 1 16 0v-6a8 8 0 0 1 16 0v48l4-10q8-8 12 2l-8 22q-6 16-22 16H40q-16 0-16-16z' }, 'skin'),
    s('path', { d: ring(96, 98, 40) + 'M68 70l56 56', ...SW(7) }, 'red', { stroke: true, accent: true })
  ],
  aprendiz: [
    ground(),
    ...person(48, 136, 'brown'),
    s('path', { d: 'M62 100l20-16', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M82 84l10-12', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 84, y: 62, width: 20, height: 10, rx: 2, transform: 'rotate(-50 94 67)' }, 'gray'),
    ...person(122, 136, 'orange', { h: 30, w: 22, r: 10, accent: true }),
  ],
  argumentar: [
    ground(),
    ...person(40, 136, 'navy'),
    s('path', { d: 'M54 98l24-20', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: bubble(66, 16, 80, 64) }, 'cream'),
    s('path', { d: bubble(66, 16, 80, 64), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M78 34l4 4 8-8M78 50l4 4 8-8M78 66l4 4 8-8', ...SW(3) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M98 34h36M98 50h36M98 66h28', ...SW(4) }, 'gray', { stroke: true })
  ],
  arrogancia: [
    ground(),
    s('path', { d: wedge(64, 104, 62, 190, 350) }, 'green'),
    s('path', { d: dots(around(64, 104, 46, 7, 200).filter(p => p[1] < 100), 7) }, 'blue', { accent: true }),
    s('path', { d: dots(around(64, 104, 46, 7, 200).filter(p => p[1] < 100), 3) }, 'yellow'),
    s('ellipse', { cx: 72, cy: 110, rx: 20, ry: 18 }, 'blue'),
    s('path', { d: 'M86 102q12-20 14-48', ...SW(8) }, 'blue', { stroke: true }),
    s('path', { d: 'M100 52l10 2-10 4', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M66 126v10M78 126v10', ...SW(3) }, 'gray', { stroke: true })
  ],
  arteria: [
    s('path', { d: heart(64, 112, 26) }, 'red', { accent: true }),
    s('path', { d: 'M64 86V58q0-20 20-24l40-10M84 40l30 20M100 30l20-10M120 58l20 6M120 58l6 20', ...SW(9) }, 'red', { stroke: true }),
    s('path', { d: 'M64 70q0-18 14-26', ...SW(3) }, 'pink', { stroke: true })
  ],
  atacante: [
    ground(),
    ...person(54, 130, 'orange', { accent: true, h: 40 }),
    s('path', { d: 'M62 124l26-12M48 128l-4 8', ...SW(8) }, 'dark', { stroke: true }),
    s('circle', { cx: 104, cy: 110, r: 12 }, 'white'),
    s('path', { d: ring(104, 110, 12), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M122 104h16M120 116h20', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M68 98l18-14M40 98l-14 10', ...SW(6) }, 'skin', { stroke: true })
  ],
  'autoría': [
    s('rect', { x: 20, y: 30, width: 80, height: 108, rx: 4 }, 'navy', { accent: true }),
    s('rect', { x: 32, y: 46, width: 56, height: 40, rx: 2 }, 'cream'),
    s('circle', { cx: 60, cy: 60, r: 8 }, 'skin'),
    s('path', { d: 'M48 86q12-16 24 0z' }, 'blue'),
    s('path', { d: 'M32 110q8-10 14 0t14 0 14-6', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M110 136L142 30q6 30-20 70z' }, 'white'),
    s('path', { d: 'M110 136L142 30q6 30-20 70', ...SW(3) }, 'gray', { stroke: true })
  ],
  bah: [
    s('circle', { cx: 70, cy: 84, r: 44 }, 'skin', { accent: true }),
    s('path', { d: 'M48 74h14M78 74h14', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[58, 70], [88, 70]], 3) }, 'dark'),
    s('path', { d: 'M58 106q14-6 26 2', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M118 112q14-30 26-34', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M128 64l6-10M142 68l8-6M120 58l-2-12', ...SW(3) }, 'gray', { stroke: true })
  ],
  bandido: [
    ground(),
    s('circle', { cx: 60, cy: 56, r: 14 }, 'skin'),
    s('rect', { x: 44, y: 50, width: 32, height: 9, rx: 3 }, 'black', { accent: true }),
    s('path', { d: 'M42 46q18-18 36 0z' }, 'dark'),
    s('rect', { x: 44, y: 72, width: 32, height: 64, rx: 10 }, 'dark'),
    s('path', { d: 'M100 136q-20 0-16-26q4-16 20-24l-4-8h20l-4 8q18 8 20 24q2 26-16 26z' }, 'tan'),
    s('path', { d: 'M76 86l18-6', ...SW(6) }, 'skin', { stroke: true })
  ],
  barranco: [
    backdrop('sky'),
    s('path', { d: 'M14 60h50l6 20-8 20 10 46H14z' }, 'brown', { accent: true }),
    s('path', { d: 'M146 60H98l-4 22 10 24-8 40h50z' }, 'brown'),
    s('path', { d: 'M72 146l-2-30 26-4 4 34z' }, 'blue'),
    s('path', { d: 'M14 60h50M98 60h48', ...SW(6) }, 'green', { stroke: true })
  ],
  borra: [
    s('rect', { x: 26, y: 70, width: 108, height: 66, rx: 10 }, 'red'),
    s('path', { d: 'M40 70q4-14 18-10q4-14 20-8q8-12 22-2q14-6 18 10z' }, 'white', { accent: true }),
    s('path', { d: 'M40 70q4-14 18-10q4-14 20-8q8-12 22-2q14-6 18 10', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[44, 36, 10, 7], [116, 30, 9, 6], [80, 26, 8, 5]]) }, 'white'),
    s('path', { d: ells([[44, 36, 10, 7], [116, 30, 9, 6], [80, 26, 8, 5]]), ...SW(2) }, 'gray', { stroke: true }),
  ],
  'conciliación': [
    s('rect', { x: 20, y: 104, width: 120, height: 10 }, 'brown'),
    s('path', { d: 'M30 114v26M130 114v26', ...SW(5) }, 'brown', { stroke: true }),
    ...person(34, 104, 'blue', { h: 34 }),
    ...person(126, 104, 'orange', { h: 34 }),
    s('path', { d: 'M48 82l32 4 32-4', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: leaflet(80, 50, -150, 22, 7) + leaflet(80, 50, -30, 22, 7) + 'M80 50v14' }, 'green', { accent: true })
  ],
  'conformación': [
    s('path', { d: 'M40 40l40-20 40 20v80l-40 20-40-20z' }, 'gray'),
    s('path', { d: 'M40 40l40 20 40-20M80 60v80', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 40l40 20v80l-40-20z' }, 'blue', { accent: true }),
    s('path', { d: dots([[40, 40], [80, 20], [120, 40], [80, 60], [40, 120], [120, 120], [80, 140]], 6) }, 'orange')
  ],
  conmemorar: [
    ground(),
    s('path', { d: 'M66 136l6-110h16l6 110z' }, 'gray', { accent: true }),
    s('path', { d: 'M72 26l8-10 8 10z' }, 'gray'),
    s('path', { d: ring(80, 112, 16), ...SW(8) }, 'green', { stroke: true }),
    s('path', { d: dots([[68, 104], [92, 104], [80, 126]], 4) }, 'red'),
    s('rect', { x: 32, y: 110, width: 10, height: 26 }, 'cream'),
    s('rect', { x: 118, y: 110, width: 10, height: 26 }, 'cream'),
    s('path', { d: drop(37, 102, 4) + drop(123, 102, 4) }, 'orange')
  ],
  coyuntura: [
    s('path', { d: 'M30 30l40 50M80 80l40 50', ...SW(16) }, 'tan', { stroke: true }),
    s('path', { d: dots([[30, 30], [120, 130]], 10) }, 'tan'),
    s('circle', { cx: 75, cy: 80, r: 16 }, 'red', { accent: true }),
    s('path', { d: ring(75, 80, 28), ...DASH(3, '5 5') }, 'orange', { stroke: true })
  ],
  cuestionario: [
    ...paper(28, 16, 104, 128),
    s('path', { d: rects([[40, 30, 14, 14], [40, 60, 14, 14], [40, 90, 14, 14], [40, 120, 14, 14]]) }, 'gray'),
    s('path', { d: 'M42 36l5 5 9-12M42 96l5 5 9-12', ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M64 38h56M64 68h48M64 98h56M64 128h40', ...SW(4) }, 'gray', { stroke: true })
  ],
  'cápsula': [
    backdrop('sky'),
    s('path', { d: 'M24 64q56-60 112 0z' }, 'orange'),
    s('path', { d: 'M24 64l48 40M136 64l-48 40M80 64v40', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 104h36l8 32H54z' }, 'gray', { accent: true }),
    s('circle', { cx: 80, cy: 120, r: 6 }, 'sky')
  ],
  denso: [
    s('rect', { x: 14, y: 128, width: 132, height: 14 }, 'brown'),
    s('path', { d: poly([[24, 128], [38, 40], [52, 128]]) + poly([[60, 128], [74, 30], [88, 128]]) + poly([[96, 128], [110, 44], [124, 128]]) }, 'green', { accent: true }),
    s('path', { d: poly([[40, 128], [56, 60], [72, 128]]) + poly([[78, 128], [92, 52], [106, 128]]) + poly([[114, 128], [130, 64], [146, 128]]) + poly([[14, 128], [24, 74], [36, 128]]) }, 'mint'),
    s('path', { d: poly([[48, 128], [60, 90], [72, 128]]) + poly([[86, 128], [98, 86], [110, 128]]) }, 'green')
  ],
  descender: [
    s('path', { d: 'M14 40h30v24h30v24h30v24h42v34H14z' }, 'gray'),
    ...person(90, 88, 'blue', { h: 30, w: 22, r: 10, accent: true }),
    arrow('M30 18l100 90M118 110h14V96', 'orange', 5)
  ],
  despreciable: [
    s('path', { d: 'M88 60h44l-6 76H94z' }, 'gray', { accent: true }),
    s('rect', { x: 82, y: 50, width: 56, height: 12, rx: 3 }, 'dark'),
    s('path', { d: 'M104 72v54M116 72v54', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 40h18v40H24zM42 42h20q8 0 9 8l5 20q1 10-9 10H58l3 18q-1 10-11 4L42 80z' }, 'skin'),
    s('path', { d: 'M24 40h18v40H24z' }, 'blue')
  ],
  doblar: [
    s('path', { d: 'M20 40h60v80H20z' }, 'sky'),
    s('path', { d: 'M80 40l50 14v80l-50-14z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 40v80', ...SW(3) }, 'navy', { stroke: true }),
    arrow('M128 34q-20-24-46-4M88 20l-6 10 10 4', 'orange', 4)
  ],
  'erróneo': [
    s('circle', { cx: 52, cy: 92, r: 40 }, 'white'),
    s('path', { d: ring(52, 92, 40) + ring(52, 92, 26) + ring(52, 92, 12), ...SW(6) }, 'red', { stroke: true }),
    s('circle', { cx: 52, cy: 92, r: 6 }, 'red'),
    s('path', { d: 'M90 40l40-20', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M130 20l-12 0 6 10z' }, 'gray'),
    s('path', { d: 'M114 120l20 20M134 120l-20 20', ...SW(7) }, 'red', { stroke: true, accent: true })
  ],
  esponja: [
    s('rect', { x: 28, y: 52, width: 104, height: 70, rx: 12 }, 'yellow', { accent: true }),
    s('rect', { x: 28, y: 100, width: 104, height: 22, rx: 8 }, 'green'),
    s('path', { d: ells([[48, 70, 6, 5], [72, 82, 5, 4], [96, 68, 7, 5], [116, 84, 5, 4], [58, 92, 4, 3]]) }, 'orange'),
    s('path', { d: ells([[46, 36, 10, 10], [70, 30, 7, 7], [118, 38, 8, 8]]) }, 'sky')
  ],
  'espontáneo': [
    s('rect', { x: 44, y: 98, width: 72, height: 42, rx: 3 }, 'red'),
    s('path', { d: 'M80 98l-14-8 28-8-28-8 28-8-14-8', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 46, r: 16 }, 'skin', { accent: true }),
    s('path', { d: 'M64 34l16-24 16 24z' }, 'purple'),
    s('path', { d: 'M38 40l-10-6M122 40l10-6M36 60H24M124 60h12', ...SW(4) }, 'orange', { stroke: true }),
    s('rect', { x: 96, y: 92, width: 22, height: 6, rx: 2, transform: 'rotate(-30 96 95)' }, 'red')
  ],
  frasco: [
    s('rect', { x: 46, y: 22, width: 68, height: 18, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M50 40h60v8q14 4 14 18v62q0 12-12 12H48q-12 0-12-12V66q0-14 14-18z' }, 'sky'),
    s('path', { d: 'M38 80h84v48q0 12-12 12H50q-12 0-12-12z' }, 'orange'),
    s('path', { d: 'M50 40h60v8q14 4 14 18v62q0 12-12 12H48q-12 0-12-12V66q0-14 14-18z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M54 62v14', ...SW(4) }, 'white', { stroke: true })
  ],
  garza: [
    s('rect', { x: 14, y: 116, width: 132, height: 30 }, 'sky'),
    s('path', { d: 'M74 80v52M86 80v52', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 74q10-20 44-14l-4 22q-28 4-40-8z' }, 'gray', { accent: true }),
    s('path', { d: 'M90 64q14-6 6-26t8-22', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 18l30 8-30 2z' }, 'yellow'),
    s('circle', { cx: 106, cy: 18, r: 2.5 }, 'dark'),
    s('path', { d: 'M104 14l-14-6', ...SW(2) }, 'dark', { stroke: true })
  ],
  gene: [
    s('path', { d: 'M50 16q60 32 0 64t0 64', ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M110 16q-60 32 0 64t0 64', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M62 28h36M78 44h4M62 64h36M62 96h36M78 112h4M62 132h36', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 46h28M66 114h28', ...SW(4) }, 'yellow', { stroke: true })
  ],
  hostilidad: [
    ground(),
    ...person(34, 136, 'red', { accent: true }),
    ...person(126, 136, 'blue'),
    s('path', { d: 'M28 72l10 4M132 72l-10 4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 40l-14 26h14l-10 26 24-34H86l10-18z' }, 'yellow')
  ],
  'idéntico': [
    ground(),
    ...person(52, 136, 'green', { accent: true }),
    ...person(108, 136, 'green'),
    s('path', { d: 'M40 70q12-14 24 0M96 70q12-14 24 0', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M72 92h16M72 102h16', ...SW(4) }, 'orange', { stroke: true })
  ],
  impresora: [
    s('rect', { x: 46, y: 18, width: 68, height: 40 }, 'white'),
    s('rect', { x: 46, y: 18, width: 68, height: 40, ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 20, y: 52, width: 120, height: 56, rx: 8 }, 'gray', { accent: true }),
    s('rect', { x: 40, y: 96, width: 80, height: 44 }, 'white'),
    s('rect', { x: 40, y: 96, width: 80, height: 44, ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 54, y: 108, width: 52, height: 22 }, 'sky'),
    s('circle', { cx: 124, cy: 68, r: 5 }, 'green')
  ],
  incentivar: [
    s('path', { d: 'M20 30l84 30', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M104 60v26', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 86h16l-8 40z' }, 'orange', { accent: true }),
    s('path', { d: 'M100 86l-6-12M108 86l6-12', ...SW(3) }, 'green', { stroke: true }),
    ...lean(50, 136, 14, 'blue'),
    s('path', { d: 'M62 100l20-8', ...SW(6) }, 'skin', { stroke: true }),
    ground()
  ],
  inmoral: [
    s('path', { d: 'M40 70h60v62q0 8-8 8H48q-8 0-8-8z' }, 'sky'),
    s('rect', { x: 36, y: 60, width: 68, height: 12, rx: 4 }, 'brown'),
    s('path', { d: dots([[56, 104], [80, 116], [62, 124]], 10) }, 'tan'),
    s('path', { d: 'M146 70h-30q-14 0-22 14l-8 14', ...SW(12) }, 'dark', { stroke: true, accent: true }),
    s('circle', { cx: 84, cy: 100, r: 8 }, 'skin'),
    s('path', { d: 'M40 70h60v62q0 8-8 8H48q-8 0-8-8z', ...SW(3) }, 'gray', { stroke: true })
  ],
  lucio: [
    s('rect', { x: 14, y: 30, width: 132, height: 100, rx: 10 }, 'sky'),
    s('path', { d: 'M24 80q30-20 90-12l26 8-26 8q-60 10-90-4z' }, 'green', { accent: true }),
    s('path', { d: 'M24 80l-10-14v28z' }, 'green'),
    s('path', { d: dots([[50, 78], [66, 74], [80, 82], [96, 76]], 3) }, 'yellow'),
    s('circle', { cx: 120, cy: 74, r: 3 }, 'dark'),
    s('path', { d: 'M126 82h12', ...SW(2) }, 'dark', { stroke: true })
  ],
  medicinal: [
    s('path', { d: 'M30 82h100q0 46-50 50q-50-4-50-50z' }, 'gray', { accent: true }),
    s('rect', { x: 56, y: 130, width: 48, height: 10, rx: 3 }, 'gray'),
    s('path', { d: 'M100 92l30-60', ...SW(10) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(46, 80, -110, 34, 10) + leaflet(66, 80, -70, 30, 9) }, 'green'),
    s('path', { d: 'M80 98v20M70 108h20', ...SW(5) }, 'red', { stroke: true })
  ],
  miniatura: [
    ground(),
    s('rect', { x: 32, y: 112, width: 30, height: 24 }, 'cream'),
    s('path', { d: 'M28 114l19-16 19 16z' }, 'red'),
    s('circle', { cx: 98, cy: 78, r: 34 }, 'sky'),
    s('path', { d: ring(98, 78, 34) + 'M74 102l-22 22', ...SW(8) }, 'dark', { stroke: true, accent: true }),
    s('rect', { x: 86, y: 76, width: 24, height: 20 }, 'cream'),
    s('path', { d: 'M82 78l16-14 16 14z' }, 'red')
  ],
  'molécula': [
    s('path', { d: 'M80 80L40 40M80 80l44-30M80 80l-6 56M80 80l52 34', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 22 }, 'red', { accent: true }),
    s('path', { d: dots([[40, 40], [124, 50]], 16) }, 'blue'),
    s('path', { d: dots([[74, 136], [132, 114]], 12) }, 'white'),
    s('path', { d: ring(74, 136, 12) + ring(132, 114, 12), ...SW(3) }, 'gray', { stroke: true })
  ],
  mozo: [
    ground(),
    s('circle', { cx: 62, cy: 50, r: 13 }, 'skin'),
    s('rect', { x: 46, y: 66, width: 32, height: 70, rx: 10 }, 'white'),
    s('rect', { x: 46, y: 66, width: 32, height: 70, rx: 10, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M56 68l6 6 6-6z' }, 'dark'),
    s('path', { d: 'M78 80l26-6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M88 70h44', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 70q0-22 14-22t14 22z' }, 'gray', { accent: true })
  ],
  musa: [
    ...lady(54, 136, 'purple', { accent: true }),
    s('path', { d: 'M96 120V70q0-20 14-24M132 120V70q0-20-14-24M96 120h36M106 70v50M114 66v54M122 70v50', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: sparkle(30, 34, 10) + sparkle(80, 26, 8) + sparkle(136, 30, 7) }, 'yellow'),
    ground()
  ],
  nana: [
    backdrop('navy'),
    s('path', { d: 'M30 140q-6-60 50-60t50 60z' }, 'brown'),
    s('circle', { cx: 76, cy: 92, r: 12 }, 'skin'),
    s('path', { d: 'M40 108q40-10 80 0v26H40z' }, 'pink', { accent: true }),
    s('path', { d: 'M70 92q3 3 6 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M124 22a14 14 0 1 0 14 22a12 12 0 1 1-14-22z' }, 'yellow'),
    ...note(42, 50, 'sky')
  ],
  orgasmo: [
    backdrop('navy'),
    s('path', { d: rays(80, 72, 16, 50, 14), ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: heart(80, 64, 18) }, 'red', { accent: true }),
    s('path', { d: rays(36, 120, 6, 18, 8), ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: rays(126, 116, 6, 16, 8), ...SW(3) }, 'yellow', { stroke: true })
  ],
  ortodoxo: [
    ground(),
    s('rect', { x: 44, y: 76, width: 72, height: 60 }, 'cream'),
    s('path', { d: 'M80 34q-26 18-20 42h40q6-24-20-42z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 34V16M72 22h16', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M44 76q-12 8-10 20h20q2-12-10-20zM116 76q-12 8-10 20h20q2-12-10-20z' }, 'yellow'),
    s('path', { d: 'M70 136v-24a10 10 0 0 1 20 0v24z' }, 'brown'),
    s('path', { d: 'M38 96h12v40H38zM110 96h12v40h-12z' }, 'cream')
  ],
  paramilitar: [
    s('path', { d: 'M24 100q0-62 56-62t56 62z' }, 'green', { accent: true }),
    s('path', { d: ells([[56, 70, 10, 6], [96, 58, 12, 7], [110, 86, 9, 6], [70, 92, 8, 5]]) }, 'brown'),
    s('path', { d: ells([[78, 54, 7, 5], [44, 88, 7, 5], [120, 70, 6, 4]]) }, 'dark'),
    s('rect', { x: 18, y: 98, width: 124, height: 12, rx: 6 }, 'green'),
    s('path', { d: 'M40 110q0 26 20 26M120 110q0 26-20 26', ...SW(4) }, 'dark', { stroke: true })
  ],
  parroquial: [
    ground(),
    s('rect', { x: 62, y: 46, width: 36, height: 90 }, 'tan'),
    s('path', { d: 'M56 48l24-30 24 30z' }, 'red', { accent: true }),
    s('path', { d: 'M72 74q0-12 8-12t8 12v6H72z' }, 'yellow'),
    s('path', { d: 'M18 136v-30l14-12 14 12v30zM114 136v-30l14-12 14 12v30z' }, 'cream'),
    s('path', { d: 'M18 106l14-12 14 12M114 106l14-12 14 12', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M72 136v-20a8 8 0 0 1 16 0v20z' }, 'brown')
  ],
  patronato: [
    s('ellipse', { cx: 80, cy: 98, rx: 60, ry: 20 }, 'brown', { accent: true }),
    s('path', { d: busts([30, 62, 98, 130], 86, 22, 26) + dots([[30, 54], [62, 50], [98, 50], [130, 54]], 10) }, 'navy'),
    s('path', { d: dots([[30, 54], [62, 50], [98, 50], [130, 54]], 9) }, 'skin'),
    ...paper(56, 90, 18, 14),
    ...paper(88, 92, 18, 14),
    s('path', { d: 'M40 116v24M120 116v24', ...SW(5) }, 'brown', { stroke: true })
  ],
  potenciar: [
    s('path', { d: rects([[20, 110, 22, 26], [50, 90, 22, 46], [80, 70, 22, 66]]) }, 'green'),
    s('rect', { x: 110, y: 44, width: 22, height: 92 }, 'green', { accent: true }),
    arrow('M22 88q40-10 74-56M84 34h12v12', 'orange', 5),
    s('path', { d: 'M124 14l-10 18h8l-6 14 14-20h-8l6-12z' }, 'yellow'),
    ground(140)
  ],
  'pálido': [
    s('circle', { cx: 80, cy: 84, r: 46 }, 'cream', { accent: true }),
    s('path', { d: ring(80, 84, 46), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 80q6-4 12 0M90 80q6-4 12 0M66 108q14-6 28 0', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: ells([[60, 92, 8, 4], [100, 92, 8, 4]]) }, 'mint'),
    s('path', { d: drop(122, 56, 6) }, 'sky')
  ],
  reactor: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'gray'),
    s('circle', { cx: 80, cy: 80, r: 52 }, 'dark'),
    s('path', { d: Array.from({ length: 12 }, (_, i) => leaflet(80, 80, i * 30, 48, 8)).join('') }, 'gray', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'white'),
    s('path', { d: spiral(77, 80), ...SW(2) }, 'dark', { stroke: true })
  ],
  reflejo: [
    s('rect', { x: 14, y: 14, width: 132, height: 66 }, 'sky'),
    s('rect', { x: 14, y: 80, width: 132, height: 66 }, 'blue'),
    s('path', { d: 'M20 80l40-50 24 26 16-16 40 40z' }, 'green', { accent: true }),
    s('path', { d: 'M20 80l40 50 24-26 16 16 40-40z' }, 'mint'),
    s('circle', { cx: 120, cy: 32, r: 10 }, 'yellow'),
    s('path', { d: 'M40 100h30M90 112h30', ...SW(3) }, 'sky', { stroke: true })
  ],
  relevo: [
    ground(),
    ...lean(46, 136, 16, 'blue'),
    ...lean(116, 136, 16, 'red', { accent: true }),
    s('path', { d: 'M60 98l24-6M118 100l-18-8', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 82, y: 84, width: 22, height: 8, rx: 3, transform: 'rotate(-15 93 88)' }, 'yellow'),
    s('path', { d: 'M14 110h10M14 96h14', ...SW(3) }, 'gray', { stroke: true })
  ],
  'seudónimo': [
    s('circle', { cx: 70, cy: 70, r: 32 }, 'skin'),
    s('path', { d: 'M28 50h84M44 50q4-30 26-30t26 30z' }, 'dark'),
    s('path', { d: 'M28 50h84', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 70h52', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[56, 72, 11, 8], [84, 72, 11, 8]]) }, 'black', { accent: true }),
    s('path', { d: 'M60 92q10 6 20 0', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M104 140L140 74q6 26-18 54z' }, 'white'),
    s('path', { d: 'M104 140L140 74q6 26-18 54', ...SW(3) }, 'gray', { stroke: true })
  ],
  similitud: [
    s('path', { d: leaflet(28, 120, -60, 80, 22) }, 'green', { accent: true }),
    s('path', { d: leaflet(92, 120, -60, 72, 18) }, 'mint'),
    s('path', { d: 'M28 120l40-70M92 120l36-62', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 138h30M60 146h30', ...SW(3) }, 'gray', { stroke: true })
  ],
  temple: [
    s('path', { d: 'M30 120h88v-12h20q-4-14-26-14H30z' }, 'dark'),
    s('path', { d: 'M50 120h40v14H50zM40 134h60v8H40z' }, 'dark'),
    s('rect', { x: 34, y: 84, width: 70, height: 10, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M100 70l30-46', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 84, y: 60, width: 30, height: 18, rx: 3, transform: 'rotate(33 99 69)' }, 'gray'),
    s('path', { d: sparkle(56, 66, 9) + sparkle(36, 70, 6) + sparkle(76, 60, 6) }, 'yellow')
  ],
  'terminación': [
    s('path', { d: 'M40 14v132M120 14v132', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 14, y: 14, width: 132, height: 132 }, 'dark'),
    s('path', { d: 'M40 146L66 14h28l26 132z' }, 'gray'),
    s('rect', { x: 34, y: 66, width: 92, height: 16, rx: 3 }, 'white'),
    s('path', { d: 'M46 66l16 16M70 66l16 16M94 66l16 16', ...SW(8, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M40 82v24M120 82v24', ...SW(5) }, 'gray', { stroke: true })
  ],
  veloz: [
    ground(),
    s('path', { d: 'M54 118q-8-34 30-38l20-6q18-2 22 12l12 6-10 8q-8 4-18 2l-6 10q-20 12-50 6z' }, 'tan', { accent: true }),
    s('path', { d: 'M108 74q-4-26 8-50q8 22 0 50zM118 76q4-24 20-40q2 24-14 42z' }, 'tan'),
    s('circle', { cx: 120, cy: 84, r: 3 }, 'dark'),
    s('circle', { cx: 50, cy: 102, r: 9 }, 'white'),
    s('path', { d: 'M14 84h24M20 100h18M14 116h24', ...SW(4) }, 'gray', { stroke: true })
  ],
  versus: [
    s('path', { d: 'M20 60q0-20 20-20h24q14 0 14 16v28q0 14-14 14H38q-18 0-18-18z' }, 'red', { accent: true }),
    s('path', { d: 'M140 76q0-20-20-20H96q-14 0-14 16v28q0 14 14 14h26q18 0 18-18z' }, 'blue'),
    s('rect', { x: 28, y: 98, width: 34, height: 16, rx: 3 }, 'white'),
    s('rect', { x: 98, y: 114, width: 34, height: 16, rx: 3 }, 'white'),
    s('path', { d: burst(80, 30, 18, 8, 8) }, 'yellow')
  ],
  violentamente: [
    ground(),
    s('path', { d: 'M72 136q4-40 30-70', ...SW(9) }, 'brown', { stroke: true }),
    s('path', { d: ells([[112, 52, 30, 20]]) }, 'green', { accent: true }),
    s('path', { d: 'M14 40h40M20 60h50M14 80h44M24 100h30', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: leaflet(138, 90, 20, 12, 4) + leaflet(130, 110, 40, 12, 4) }, 'green')
  ],
  'visualización': [
    s('rect', { x: 18, y: 54, width: 124, height: 86, rx: 6 }, 'dark'),
    s('path', { d: rects([[34, 108, 16, 24], [58, 90, 16, 42], [82, 100, 16, 32], [106, 72, 16, 60]]) }, 'blue', { accent: true }),
    s('path', { d: 'M48 34q32-28 64 0q-32 28-64 0z' }, 'white'),
    s('path', { d: 'M48 34q32-28 64 0q-32 28-64 0z', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 34, r: 9 }, 'orange')
  ],
  'válvula': [
    s('rect', { x: 14, y: 96, width: 132, height: 26 }, 'gray'),
    s('rect', { x: 60, y: 84, width: 40, height: 50, rx: 6 }, 'red', { accent: true }),
    s('path', { d: 'M80 84V54', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: ring(80, 44, 26) + 'M54 44h52M80 18v52', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M14 96v26M146 96v26', ...SW(6) }, 'dark', { stroke: true })
  ],
  abuela: [
    ground(),
    s('circle', { cx: 80, cy: 26, r: 10 }, 'gray'),
    s('circle', { cx: 80, cy: 50, r: 18 }, 'skin'),
    s('path', { d: 'M62 46q0-18 18-18t18 18q-8-8-18-8t-18 8z' }, 'gray'),
    s('path', { d: ring(73, 52, 5) + ring(87, 52, 5), ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 136l8-66h28l8 66z' }, 'pink', { accent: true }),
    s('path', { d: 'M62 86q18 14 36 0', ...SW(4) }, 'white', { stroke: true })
  ],
  accidental: [
    ground(),
    s('path', { d: 'M80 128q-10-14 0-24q18 4 20 20z' }, 'yellow'),
    ...lean(56, 128, -55, 'blue', { accent: true }),
    s('path', { d: 'M56 128l26-14M56 128l30-2', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(28, 50, 8) + sparkle(40, 32, 6) }, 'yellow'),
    s('path', { d: 'M100 116l12-6M104 128h12', ...SW(3) }, 'orange', { stroke: true })
  ],
  'aceleración': [
    s('path', { d: 'M22 112a58 58 0 0 1 116 0z' }, 'dark'),
    s('path', { d: 'M30 106a50 50 0 0 1 100 0', ...SW(8) }, 'green', { stroke: true }),
    s('path', { d: 'M104 66a50 50 0 0 1 26 40', ...SW(8) }, 'red', { stroke: true }),
    s('path', { d: 'M80 108l36-40', ...SW(5) }, 'orange', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 108, r: 8 }, 'gray'),
    arrow('M40 138h80M110 130l10 8-10 8', 'blue', 4)
  ],
  'activación': [
    s('path', { d: ring(80, 80, 66), ...SW(4) }, 'mint', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 56 }, 'green', { accent: true }),
    s('path', { d: 'M58 52a34 34 0 1 0 44 0M80 38v42', ...SW(9) }, 'white', { stroke: true })
  ],
  'acuñar': [
    s('rect', { x: 54, y: 16, width: 52, height: 22, rx: 3 }, 'gray'),
    s('path', { d: 'M80 38v18', ...SW(10) }, 'dark', { stroke: true }),
    s('rect', { x: 58, y: 56, width: 44, height: 18, rx: 3 }, 'dark'),
    s('path', { d: 'M40 120a40 12 0 0 0 80 0v-10a40 12 0 0 0-80 0z' }, 'orange'),
    s('ellipse', { cx: 80, cy: 110, rx: 40, ry: 12 }, 'yellow', { accent: true }),
    s('path', { d: star(80, 110, 8, 4) }, 'orange'),
    s('path', { d: 'M48 84l-6-8M112 84l6-8M80 86v-6', ...SW(3) }, 'orange', { stroke: true })
  ],
  'adoración': [
    ground(),
    s('path', { d: 'M40 136l4-28q2-10 12-10h10l4 38z' }, 'blue'),
    s('circle', { cx: 60, cy: 84, r: 12 }, 'skin'),
    s('path', { d: 'M68 104l14-24', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(66, 74, 4) + heart(56, 74, 4) }, 'red'),
    s('path', { d: halfRays(112, 60, 24, 34, 7), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: star(112, 56, 20) }, 'yellow', { accent: true })
  ],
  anestesia: [
    s('circle', { cx: 56, cy: 92, r: 40 }, 'skin'),
    s('path', { d: 'M36 86q6 4 12 0M64 86q6 4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M34 104q22-10 44 0l-6 20H40z' }, 'mint'),
    s('path', { d: 'M108 52l20-20', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 96, y: 54, width: 36, height: 14, rx: 3, transform: 'rotate(-45 114 61)' }, 'sky', { accent: true }),
    s('path', { d: 'M100 76l-16 16', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: dots([[110, 112], [124, 104], [136, 92]], 4) }, 'navy')
  ],
  anhelo: [
    s('rect', { x: 64, y: 16, width: 80, height: 80, rx: 4 }, 'navy'),
    s('path', { d: 'M104 16v80M64 56h80', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: star(124, 36, 10) }, 'yellow', { accent: true }),
    s('rect', { x: 60, y: 92, width: 88, height: 8 }, 'brown'),
    s('circle', { cx: 44, cy: 72, r: 14 }, 'skin'),
    s('path', { d: 'M26 146v-40q0-14 18-14t18 14v40z' }, 'purple'),
    s('path', { d: heart(20, 40, 8) }, 'pink')
  ],
  apelar: [
    s('path', { d: 'M14 140h40v-28h40v-28h40v56z' }, 'gray'),
    arrow('M30 100l80-70M96 30h14v14', 'green', 5),
    s('path', { d: 'M100 76l24-24', ...SW(6) }, 'tan', { stroke: true }),
    s('rect', { x: 110, y: 34, width: 28, height: 14, rx: 4, transform: 'rotate(-45 124 41)' }, 'brown', { accent: true })
  ],
  arrogante: [
    s('circle', { cx: 74, cy: 86, r: 42 }, 'skin', { accent: true }),
    s('path', { d: 'M108 74l28-18-14 26z' }, 'skin'),
    s('path', { d: 'M78 74q8-6 16 0M54 78q6-6 12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 110q14 2 26-6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M34 70q4-34 40-34t40 30q-18-14-40-14t-40 18z' }, 'brown'),
    s('path', { d: sparkle(130, 120, 8) }, 'yellow')
  ],
  asta: [
    ground(140),
    s('path', { d: 'M40 140V18', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 40, cy: 16, r: 6 }, 'yellow'),
    s('path', { d: 'M43 24q24-10 50 0t50 0v44q-24 10-50 0t-50 0z' }, 'red', { accent: true }),
    s('rect', { x: 28, y: 128, width: 24, height: 12 }, 'dark')
  ],
  audaz: [
    s('path', { d: 'M14 146V96h40v50zM106 146V96h40v50z' }, 'brown'),
    ...lean(80, 76, 30, 'red', { accent: true }),
    s('path', { d: 'M80 76l-16 10M80 76l18 8', ...SW(7) }, 'dark', { stroke: true }),
    arrow('M30 80q50-60 100 0', 'orange', 3),
  ],
  avena: [
    s('path', { d: 'M24 100h112q0 40-56 42q-56-2-56-42z' }, 'blue', { accent: true }),
    s('ellipse', { cx: 80, cy: 100, rx: 56, ry: 10 }, 'cream'),
    s('path', { d: dots([[60, 98], [76, 102], [94, 98], [108, 102]], 3) }, 'tan'),
    s('path', { d: 'M80 90V18', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: ells([[70, 30, 4, 8], [90, 30, 4, 8], [68, 50, 4, 8], [92, 50, 4, 8], [72, 70, 4, 8], [88, 70, 4, 8]]) }, 'tan')
  ],
  bachiller: [
    s('path', { d: 'M20 50l60-26 60 26-60 26z' }, 'dark', { accent: true }),
    s('path', { d: 'M44 62v24q36 20 72 0V62l-36 14z' }, 'dark'),
    s('path', { d: 'M132 54v32', ...SW(3) }, 'yellow', { stroke: true }),
    s('rect', { x: 30, y: 104, width: 100, height: 24, rx: 12 }, 'cream'),
    s('rect', { x: 72, y: 100, width: 16, height: 32, rx: 2 }, 'red')
  ],
  bilateral: [
    s('path', { d: busts([30], 120, 28, 40) + dots([[30, 66], [130, 66]], 14) }, 'skin'),
    s('path', { d: busts([30], 120, 28, 40) }, 'blue'),
    s('path', { d: busts([130], 120, 28, 40) }, 'orange', { accent: true }),
    arrow('M56 70h48M94 60l10 10-10 10', 'green', 5),
    arrow('M104 102H56M66 92l-10 10 10 10', 'purple', 5),
    ground(122)
  ],
  bol: [
    s('path', { d: 'M18 72h124q0 64-62 64T18 72z' }, 'blue', { accent: true }),
    s('ellipse', { cx: 80, cy: 72, rx: 62, ry: 12 }, 'sky'),
    s('path', { d: 'M36 96q44 18 88 0', ...SW(4) }, 'white', { stroke: true }),
    s('rect', { x: 58, y: 132, width: 44, height: 8, rx: 3 }, 'navy')
  ],
  boleta: [
    s('path', { d: 'M40 20h80v120l-10-8-10 8-10-8-10 8-10-8-10 8-10-8-10 8z' }, 'white'),
    s('path', { d: 'M40 20h80v120l-10-8-10 8-10-8-10 8-10-8-10 8-10-8-10 8z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 40h56M52 56h40M52 72h48M52 88h36', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 52, y: 104, width: 56, height: 14, rx: 2 }, 'green', { accent: true })
  ],
  bonus: [
    s('rect', { x: 34, y: 70, width: 92, height: 66, rx: 4 }, 'red', { accent: true }),
    s('rect', { x: 28, y: 58, width: 104, height: 18, rx: 3 }, 'red'),
    s('path', { d: 'M80 58v78', ...SW(10) }, 'yellow', { stroke: true }),
    s('path', { d: 'M80 58q-30-28-30-6t30 6q30-28 30-6t-30 6', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: ells([[134, 34, 12, 5], [134, 28, 12, 5]]) + star(26, 36, 10) }, 'orange')
  ],
  cachorro: [
    s('ellipse', { cx: 74, cy: 112, rx: 34, ry: 22 }, 'tan'),
    s('circle', { cx: 80, cy: 66, r: 30 }, 'tan', { accent: true }),
    s('path', { d: 'M52 46q-16 10-10 36q10-4 16-18zM108 46q16 10 10 36q-10-4-16-18z' }, 'brown'),
    s('path', { d: dots([[68, 62], [92, 62]], 5) }, 'dark'),
    s('ellipse', { cx: 80, cy: 78, rx: 7, ry: 5 }, 'dark'),
    s('path', { d: 'M74 88q6 6 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 114q20-6 24-24', ...SW(6) }, 'tan', { stroke: true })
  ],
  chaleco: [
    s('path', { d: 'M54 24l22 40v70H38q-8 0-8-8V64q14-8 14-30zM106 24L84 64v70h38q8 0 8-8V64q-14-8-14-30z' }, 'navy', { accent: true }),
    s('path', { d: dots([[70, 84], [70, 104], [70, 124]], 3) }, 'yellow'),
    s('path', { d: 'M40 100h22M98 100h22', ...SW(3) }, 'blue', { stroke: true })
  ],
  cid: [
    s('path', { d: 'M46 86q0-50 34-50t34 50v30H46z' }, 'gray', { accent: true }),
    s('rect', { x: 52, y: 70, width: 56, height: 8 }, 'dark'),
    s('path', { d: 'M80 36V24', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M80 24q20-10 26 10', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M30 140l100-100', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M44 112l14 14', ...SW(8) }, 'brown', { stroke: true }),
  ],
  'clérigo': [
    s('circle', { cx: 80, cy: 52, r: 26 }, 'skin'),
    s('path', { d: 'M54 50q0-28 26-28t26 28q-8-12-26-12t-26 12z' }, 'gray'),
    s('path', { d: 'M24 146q0-56 56-56t56 56z' }, 'black', { accent: true }),
    s('rect', { x: 68, y: 88, width: 24, height: 10, rx: 3 }, 'white'),
    s('path', { d: dots([[70, 52], [90, 52]], 3) }, 'dark'),
    s('path', { d: 'M72 64q8 5 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  colimar: [
    s('path', { d: 'M14 80l40-24M14 80l40 24M14 80h40', ...SW(3) }, 'yellow', { stroke: true }),
    s('circle', { cx: 14, cy: 80, r: 6 }, 'orange'),
    s('path', { d: 'M60 40q-14 40 0 80q14-40 0-80z' }, 'sky', { accent: true }),
    s('path', { d: 'M66 56h80M66 80h80M66 104h80', ...SW(4) }, 'yellow', { stroke: true })
  ],
  'compresión': [
    s('rect', { x: 30, y: 18, width: 100, height: 16, rx: 3 }, 'gray'),
    s('rect', { x: 30, y: 126, width: 100, height: 16, rx: 3 }, 'gray'),
    s('path', { d: 'M80 34l-30 10 60 10-60 10 60 10-60 10 60 10-60 10 30 12', ...SW(5) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M16 50v20M8 62l8 8 8-8M144 50v20M136 62l8 8 8-8', ...SW(4) }, 'red', { stroke: true })
  ],
  consecuente: [
    s('path', { d: bubble(16, 20, 60, 44) }, 'sky'),
    s('path', { d: heart(46, 34, 10) }, 'red', { accent: true }),
    s('path', { d: 'M88 140V96q0-8 8-8t8 8v-6q0-8 8-8t8 8v6q0-6 8-6t8 8v26q0 16-18 16z' }, 'skin'),
    s('path', { d: heart(118, 54, 12) }, 'red'),
    arrow('M66 90q14 8 22 0', 'orange', 4)
  ],
  crespo: [
    s('path', { d: dots(around(80, 66, 40, 12), 16) }, 'brown', { accent: true }),
    s('circle', { cx: 80, cy: 78, r: 34 }, 'skin'),
    s('path', { d: dots([[60, 46], [80, 40], [100, 46]], 14) }, 'brown'),
    s('path', { d: dots([[68, 80], [92, 80]], 4) }, 'dark'),
    s('path', { d: 'M68 96q12 8 24 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 146q0-30 26-30t26 30z' }, 'green')
  ],
  declive: [
    s('path', { d: 'M14 40l132 90v16H14z' }, 'green', { accent: true }),
    s('circle', { cx: 74, cy: 64, r: 12 }, 'red'),
    arrow('M90 66l30 20M114 76l6 10-12 2', 'orange', 4)
  ],
  deducir: [
    s('path', { d: ells([[24, 132, 6, 9], [44, 120, 6, 9], [56, 104, 6, 9], [74, 96, 6, 9]]) }, 'brown'),
    s('path', { d: halfRays(116, 50, 26, 34, 7), ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 116, cy: 52, r: 20 }, 'yellow', { accent: true }),
    s('rect', { x: 108, y: 70, width: 16, height: 12, rx: 2 }, 'gray'),
    arrow('M86 88q12-6 16-12', 'orange', 4)
  ],
  delicia: [
    s('path', { d: 'M20 120l100-44 20 44z' }, 'cream'),
    s('path', { d: 'M20 120h120v14H20z' }, 'tan'),
    s('path', { d: 'M20 120l100-44 20 44', ...SW(6) }, 'pink', { stroke: true, accent: true }),
    s('circle', { cx: 120, cy: 68, r: 10 }, 'red'),
    s('path', { d: sparkle(40, 50, 10) + sparkle(74, 34, 7) }, 'yellow')
  ],
  'descomposición': [
    s('path', { d: 'M56 40q-24 4-24 40q0 40 30 52q8-20 4-46q-4-24-10-46zM104 40q24 4 24 40q0 40-30 52q-8-20-4-46q4-24 10-46z' }, 'red'),
    s('path', { d: 'M56 40q24 10 48 0q-14 40 0 92q-24-10-48 0q14-50 0-92z' }, 'cream'),
    s('path', { d: dots([[70, 70], [90, 90], [76, 110]], 6) }, 'brown', { accent: true }),
    s('path', { d: 'M80 40l4-18', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: dots([[130, 30], [24, 40]], 4) + 'M124 26l-6-4M136 26l6-4M18 36l-6-4M30 36l6-4' }, 'dark')
  ],
  diesel: [
    s('rect', { x: 26, y: 40, width: 64, height: 100, rx: 6 }, 'green', { accent: true }),
    s('rect', { x: 36, y: 54, width: 44, height: 30, rx: 3 }, 'white'),
    s('path', { d: 'M90 60h20v50q0 10 10 10t10-10V60l-14-14', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: drop(120, 140, 5) }, 'black'),
    s('rect', { x: 22, y: 134, width: 72, height: 10 }, 'gray')
  ],
  distintivo: [
    s('path', { d: 'M60 90l-18 52 18-10 10 16 6-52zM100 90l18 52-18-10-10 16-6-52z' }, 'blue'),
    s('circle', { cx: 80, cy: 64, r: 44 }, 'yellow', { accent: true }),
    s('path', { d: dots(around(80, 64, 44, 16), 7) }, 'yellow'),
    s('circle', { cx: 80, cy: 64, r: 28 }, 'red'),
    s('path', { d: star(80, 64, 16) }, 'yellow')
  ],
  duquesa: [
    ...lady(80, 140, 'purple', { accent: true }),
    s('path', { d: 'M66 62l4-14 10 6 10-6 4 14z' }, 'yellow'),
    s('path', { d: dots([[80, 54]], 3) }, 'red'),
    s('path', { d: dots([[72, 96], [80, 98], [88, 96]], 3) }, 'white')
  ],
  educador: [
    s('rect', { x: 50, y: 18, width: 96, height: 70, rx: 4 }, 'green'),
    s('path', { d: 'M62 40h40M62 56h60M62 72h30', ...SW(4) }, 'white', { stroke: true }),
    s('circle', { cx: 32, cy: 58, r: 13 }, 'skin'),
    s('rect', { x: 18, y: 74, width: 30, height: 62, rx: 10 }, 'orange', { accent: true }),
    s('path', { d: 'M46 82l18-14', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: busts([88, 120], 140, 22, 26) + dots([[88, 104], [120, 104]], 9) }, 'blue'),
    ground(140)
  ],
  empoderamiento: [
    s('path', { d: 'M24 136V96q0-10 10-14l22-6q-10-20 0-34q10-10 22-4q16 8 6 30l-8 14 30-4q18 0 18 18v36z' }, 'skin', { accent: true }),
    s('path', { d: 'M62 74q8 6 18 2', ...SW(3) }, 'tan', { stroke: true }),
    arrow('M130 80V24M120 34l10-10 10 10', 'green', 6),
    s('path', { d: sparkle(30, 40, 10) }, 'yellow')
  ],
  espesor: [
    s('rect', { x: 50, y: 30, width: 50, height: 110, rx: 4 }, 'brown', { accent: true }),
    s('rect', { x: 56, y: 36, width: 38, height: 98 }, 'cream'),
    s('path', { d: 'M60 50h30M60 66h30M60 82h30M60 98h30M60 114h30', ...SW(2) }, 'tan', { stroke: true }),
    arrow('M40 22h70M48 14l-8 8 8 8M102 14l8 8-8 8', 'red', 4)
  ],
  festivo: [
    s('path', { d: 'M14 30q66 40 132 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: poly([[24, 36], [40, 44], [30, 66]]) + poly([[72, 50], [88, 50], [80, 74]]) + poly([[120, 44], [136, 36], [130, 66]]) }, 'red', { accent: true }),
    s('path', { d: poly([[48, 46], [64, 50], [54, 72]]) + poly([[96, 50], [112, 46], [106, 72]]) }, 'yellow'),
    s('path', { d: dots([[30, 100], [60, 120], [90, 96], [120, 118], [44, 136], [134, 92]], 4) }, 'blue'),
    s('path', { d: 'M70 104l6 6M104 130l6-6M24 120l6 4', ...SW(4) }, 'green', { stroke: true })
  ],
  gitano: [
    ground(),
    s('path', { d: 'M36 110V66q0-30 44-30t44 30v44z' }, 'red', { accent: true }),
    s('rect', { x: 66, y: 66, width: 28, height: 24, rx: 4 }, 'yellow'),
    s('rect', { x: 30, y: 104, width: 100, height: 8 }, 'brown'),
    s('path', { d: ring(52, 120, 14) + ring(108, 120, 14) + rays(52, 120, 2, 14, 6) + rays(108, 120, 2, 14, 6), ...SW(4) }, 'brown', { stroke: true })
  ],
  goleador: [
    s('path', { d: 'M14 30h132v100', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 30v100', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 30v100M50 30v100M70 30v100M90 30v100M110 30v100M130 30v100M14 50h132M14 70h132M14 90h132M14 110h132', ...SW(1.5) }, 'gray', { stroke: true }),
    s('circle', { cx: 96, cy: 96, r: 18 }, 'white', { accent: true }),
    s('path', { d: ring(96, 96, 18), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: poly([[96, 88], [104, 94], [101, 103], [91, 103], [88, 94]]) }, 'dark'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'green', { stroke: true })
  ],
  gorro: [
    s('path', { d: 'M30 110q0-70 50-70t50 70z' }, 'red', { accent: true }),
    s('rect', { x: 24, y: 104, width: 112, height: 28, rx: 8 }, 'white'),
    s('rect', { x: 24, y: 104, width: 112, height: 28, rx: 8, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 108v20M56 108v20M72 108v20M88 108v20M104 108v20M120 108v20', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 36, r: 14 }, 'white'),
    s('path', { d: ring(80, 36, 14), ...SW(2) }, 'gray', { stroke: true })
  ],
  'guarnición': [
    s('ellipse', { cx: 80, cy: 90, rx: 66, ry: 46 }, 'white'),
    s('path', { d: ells([[80, 90, 66, 46]]), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 90q0-24 30-24t30 20q-6 22-30 22t-30-18z' }, 'brown'),
    s('path', { d: 'M100 70l8 30M110 66l6 32M120 70l4 30', ...SW(5) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: dots([[64, 116], [76, 120], [90, 116]], 6) }, 'green'),
    s('path', { d: dots([[54, 108]], 6) }, 'red')
  ],
  hacha: [
    s('path', { d: 'M14 120q0-14 20-14h92q20 0 20 14v14q0 12-20 12H34q-20 0-20-12z' }, 'brown'),
    s('ellipse', { cx: 126, cy: 124, rx: 14, ry: 12 }, 'tan'),
    s('path', { d: 'M86 108L40 30', ...SW(8) }, 'tan', { stroke: true }),
    s('path', { d: 'M70 92q24-6 30 20l-8 6-28-14z' }, 'gray', { accent: true })
  ],
  'hazaña': [
    ground(),
    ...person(80, 136, 'red', { accent: true }),
    s('path', { d: 'M66 96l-14-42M94 96l14-42', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M20 52h120', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: rects([[18, 30, 18, 44], [124, 30, 18, 44]]) }, 'dark'),
    s('path', { d: sparkle(80, 28, 10) }, 'yellow')
  ],
  hospitalidad: [
    s('rect', { x: 14, y: 20, width: 52, height: 116 }, 'brown'),
    s('rect', { x: 20, y: 26, width: 40, height: 110 }, 'yellow'),
    ...person(94, 136, 'green', { accent: true }),
    s('path', { d: 'M108 98h20', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M120 92h20M124 92v-8h12v8', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M126 80q-4-6 0-12M134 80q-4-6 0-12', ...SW(2) }, 'gray', { stroke: true }),
    ground()
  ],
  hostia: [
    s('path', { d: 'M54 92h52q0 34-26 36q-26-2-26-36z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 126v12M62 140h36', ...SW(6) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 58, r: 30 }, 'white'),
    s('path', { d: ring(80, 58, 30), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 42v32M66 54h28', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: halfRays(80, 58, 36, 46, 7), ...SW(3) }, 'yellow', { stroke: true })
  ],
  humanista: [
    ...openBook(80, 80, 'cream'),
    s('path', { d: heart(80, 46, 14) }, 'red', { accent: true }),
    s('path', { d: busts([30, 130], 66, 18, 20) + dots([[30, 38], [130, 38]], 8) }, 'tan')
  ],
  hundir: [
    s('rect', { x: 14, y: 84, width: 132, height: 62 }, 'blue'),
    s('path', { d: 'M40 40l70 44-10 16-70-44z' }, 'red', { accent: true }),
    s('path', { d: 'M62 40l10-20 20 12-10 20z' }, 'white'),
    s('path', { d: 'M14 84q10-6 20 0t20 0 20 0 20 0 20 0 20 0 12 0', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: ells([[118, 70, 4, 4], [126, 58, 3, 3], [112, 52, 3, 3]]) }, 'sky')
  ],
  ilustrar: [
    ...paper(20, 22, 100, 110),
    s('circle', { cx: 52, cy: 52, r: 12 }, 'yellow'),
    s('path', { d: 'M28 122l34-44 22 26 14-14 22 32z' }, 'green'),
    s('path', { d: 'M100 120l40-56', ...SW(10) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M100 120l4-12 6 4z' }, 'dark')
  ],
  'incursión': [
    s('circle', { cx: 100, cy: 80, r: 46 }, 'mint'),
    s('path', { d: ring(100, 80, 46), ...DASH(4) }, 'green', { stroke: true }),
    arrow('M14 80h96M98 68l12 12-12 12', 'red', 7),
    s('path', { d: 'M18 64h20M24 96h18', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 120, cy: 80, r: 8 }, 'orange', { accent: true })
  ],
  independentista: [
    s('path', { d: 'M20 64q0-40 40-40t40 40v70H20z' }, 'white'),
    s('path', { d: 'M20 64q0-40 40-40t40 40v70H20zM40 40v94M60 24v110M80 40v94', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 70q-16-26-36-24q16 6 24 26zM110 70q12-34 34-36q-14 10-22 38z' }, 'yellow', { accent: true }),
    s('ellipse', { cx: 114, cy: 74, rx: 12, ry: 7 }, 'orange'),
    s('rect', { x: 14, y: 132, width: 92, height: 8 }, 'brown')
  ],
  inodoro: [
    s('rect', { x: 46, y: 18, width: 68, height: 40, rx: 6 }, 'white'),
    s('path', { d: 'M30 64h100q0 42-34 48v24H64v-24q-34-6-34-48z' }, 'white'),
    s('path', { d: 'M46 18h68v40H46zM30 64h100q0 42-34 48v24H64v-24q-34-6-34-48z', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 26, y: 58, width: 108, height: 10, rx: 5 }, 'sky', { accent: true }),
    s('rect', { x: 92, y: 28, width: 14, height: 6, rx: 3 }, 'gray')
  ],
  invasor: [
    backdrop('navy'),
    s('path', { d: 'M56 70q0-24 24-24t24 24z' }, 'sky'),
    s('ellipse', { cx: 80, cy: 74, rx: 54, ry: 14 }, 'gray', { accent: true }),
    s('path', { d: dots([[46, 74], [80, 78], [114, 74]], 4) }, 'yellow'),
    s('path', { d: 'M64 88l-20 52h72l-20-52z' }, 'yellow'),
    s('circle', { cx: 80, cy: 58, r: 6 }, 'green')
  ],
  invernadero: [
    ground(),
    s('path', { d: 'M24 136V70q0-40 56-40t56 40v66z' }, 'sky', { accent: true }),
    s('path', { d: 'M24 136V70q0-40 56-40t56 40v66M52 136V38M80 136V30M108 136V38M24 90h112', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: dots([[38, 124], [66, 120], [94, 124], [122, 120]], 8) }, 'green'),
    s('path', { d: dots([[66, 118], [122, 118]], 3) }, 'red')
  ],
  latitud: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'sky'),
    s('path', { d: 'M28 50h104M22 80h116M28 110h104', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M38 36h84', ...SW(6) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: ring(80, 80, 60), ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M80 20q-30 60 0 120', ...SW(2) }, 'navy', { stroke: true })
  ],
  lino: [
    s('path', { d: 'M40 140V70M60 140V60M80 140V74', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: dots([[40, 62], [60, 52], [80, 66]], 10) }, 'blue', { accent: true }),
    s('path', { d: dots([[40, 62], [60, 52], [80, 66]], 3) }, 'yellow'),
    s('path', { d: 'M96 70h44v70H96z' }, 'cream'),
    s('path', { d: 'M96 70h44v70H96zM104 70v70M112 70v70M120 70v70M128 70v70', ...SW(2) }, 'tan', { stroke: true })
  ],
  luminoso: [
    backdrop('navy'),
    s('path', { d: 'M62 140l8-90h20l8 90z' }, 'white'),
    s('path', { d: 'M66 100h28M64 120h32', ...SW(8) }, 'red', { stroke: true }),
    s('rect', { x: 66, y: 34, width: 28, height: 18 }, 'yellow', { accent: true }),
    s('path', { d: 'M66 34l14-12 14 12z' }, 'red'),
    s('path', { d: 'M94 36l52-18v40zM66 36L14 18v40z' }, 'yellow')
  ],
  matrimonial: [
    s('rect', { x: 18, y: 26, width: 124, height: 118, rx: 8 }, 'brown'),
    s('rect', { x: 24, y: 34, width: 112, height: 104, rx: 6 }, 'blue', { accent: true }),
    s('path', { d: rects([[32, 40, 42, 22], [86, 40, 42, 22]]) }, 'white'),
    s('rect', { x: 24, y: 70, width: 112, height: 68, rx: 6 }, 'sky'),
    s('path', { d: 'M24 82h112', ...SW(3) }, 'white', { stroke: true })
  ],
  membrana: [
    s('path', { d: ells([[80, 80, 64, 54]]) }, 'pink'),
    s('path', { d: ells([[80, 80, 64, 54]]), ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 74, cy: 78, r: 18 }, 'purple'),
    s('path', { d: ells([[114, 64, 10, 6], [52, 112, 10, 6], [112, 104, 6, 6]]) }, 'orange')
  ],
  'mensajería': [
    s('path', { d: 'M14 128h132', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 14, y: 54, width: 82, height: 62, rx: 4 }, 'orange', { accent: true }),
    s('path', { d: 'M96 72h26l20 22v22H96z' }, 'orange'),
    s('path', { d: 'M104 78h16l12 14h-28z' }, 'sky'),
    s('rect', { x: 36, y: 70, width: 36, height: 30 }, 'tan'),
    s('path', { d: 'M54 70v30', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: dots([[36, 118], [118, 118]], 10) }, 'dark')
  ],
  obediencia: [
    ground(),
    ...person(40, 136, 'blue'),
    s('path', { d: 'M54 96l22-12', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M96 136q-6-30 12-44l4-16h22l2 16q6 14 0 44z' }, 'brown', { accent: true }),
    s('circle', { cx: 122, cy: 70, r: 14 }, 'brown'),
    s('path', { d: 'M110 62q-6 10 0 20M134 62q6 10 0 20', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[117, 68], [127, 68]], 2.5) + ells([[122, 78, 4, 3]]) }, 'dark')
  ],
  pantano: [
    s('rect', { x: 14, y: 90, width: 132, height: 56 }, 'green'),
    s('path', { d: ells([[54, 116, 30, 10], [116, 106, 22, 8]]) }, 'brown'),
    s('path', { d: 'M28 90V44M36 90V58M124 90V40M132 90V56', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: ells([[28, 44, 4, 12], [124, 40, 4, 12]]) }, 'brown', { accent: true }),
    s('path', { d: ells([[78, 128, 12, 5]]) }, 'mint'),
    s('circle', { cx: 80, cy: 124, r: 4 }, 'pink')
  ],
  parcela: [
    s('rect', { x: 14, y: 40, width: 132, height: 100 }, 'green'),
    s('path', { d: poly([[40, 60], [120, 56], [128, 124], [34, 120]]) }, 'tan', { accent: true }),
    s('path', { d: poly([[40, 60], [120, 56], [128, 124], [34, 120]]), ...DASH(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 60V40M120 56V36M128 124v-20M34 120v-20', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: dots([[40, 40], [120, 36], [128, 104], [34, 100]], 4) }, 'red')
  ],
  'peatón': [
    s('rect', { x: 14, y: 100, width: 132, height: 46 }, 'dark'),
    s('path', { d: 'M24 108v30M44 108v30M64 108v30M84 108v30M104 108v30M124 108v30', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 26, r: 10 }, 'skin'),
    s('path', { d: 'M80 40v30M80 70l-12 26M80 70l14 26M80 48l-14 14M80 48l16 12', ...SW(8) }, 'green', { stroke: true, accent: true })
  ],
  periferia: [
    s('circle', { cx: 80, cy: 80, r: 64 }, 'mint'),
    s('path', { d: ring(80, 80, 64) + ring(80, 80, 34), ...DASH(3) }, 'green', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 34 }, 'gray'),
    s('path', { d: rects([[66, 62, 10, 34], [80, 54, 12, 42]]) }, 'navy'),
    s('path', { d: dots(around(80, 80, 50, 8, 20), 7) }, 'orange', { accent: true })
  ],
  'periódicamente': [
    s('rect', { x: 18, y: 28, width: 124, height: 112, rx: 8 }, 'white'),
    outline({ x: 18, y: 28, width: 124, height: 112, rx: 8 }),
    s('rect', { x: 18, y: 28, width: 124, height: 22, rx: 6 }, 'blue'),
    s('path', { d: grid(28, 60, 6, 4, 12, 12, 18, 19) }, 'gray'),
    s('path', { d: rects([[82, 60, 12, 12], [82, 79, 12, 12], [82, 98, 12, 12], [82, 117, 12, 12]]) }, 'green', { accent: true }),
    s('path', { d: 'M48 22v12M112 22v12', ...SW(5) }, 'dark', { stroke: true })
  ],
  proclamar: [
    ground(),
    ...person(52, 136, 'red', { accent: true }),
    s('path', { d: 'M66 98l14-8', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 78, y: 54, width: 30, height: 50, rx: 3 }, 'cream'),
    s('path', { d: 'M78 54h30M78 104h30', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M116 60q10 14 0 28M128 52q16 22 0 44', ...SW(4) }, 'orange', { stroke: true })
  ],
  profesionalmente: [
    ground(),
    s('circle', { cx: 66, cy: 46, r: 14 }, 'skin'),
    s('rect', { x: 48, y: 62, width: 36, height: 74, rx: 10 }, 'navy'),
    s('path', { d: 'M60 62l6 10 6-10z' }, 'white'),
    s('path', { d: 'M66 72l-4 18 4 6 4-6z' }, 'red', { accent: true }),
    s('rect', { x: 92, y: 98, width: 40, height: 30, rx: 4 }, 'brown'),
    s('path', { d: 'M104 98v-6h16v6M84 90l10 10', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: star(120, 40, 12) }, 'yellow')
  ],
  prominente: [
    ground(),
    s('path', { d: rects([[20, 104, 18, 32], [44, 96, 18, 40], [98, 100, 18, 36], [122, 108, 18, 28]]) }, 'gray'),
    s('rect', { x: 68, y: 32, width: 24, height: 104, rx: 3 }, 'orange', { accent: true }),
    s('path', { d: star(80, 20, 10) }, 'yellow')
  ],
  pulmonar: [
    s('path', { d: 'M80 18v40M80 52l-14 14M80 52l14 14', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M68 60q-36-4-44 40q-4 30 14 32q24 2 30-20z' }, 'pink', { accent: true }),
    s('path', { d: 'M92 60q36-4 44 40q4 30-14 32q-24 2-30-20z' }, 'pink'),
    s('path', { d: 'M40 84q8 6 6 18M120 84q-8 6-6 18', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M100 24q12-6 24 0t24 0', ...SW(4) }, 'sky', { stroke: true })
  ],
  'pésimo': [
    s('path', { d: ells([[54, 44, 26, 16], [86, 36, 30, 20], [114, 46, 24, 14]]) }, 'dark'),
    s('path', { d: 'M76 58l-10 20h12l-8 18', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: star(28, 124, 11) + star(54, 124, 11) + star(80, 124, 11) + star(106, 124, 11) + star(132, 124, 11) }, 'gray'),
    s('path', { d: star(28, 124, 11) }, 'red', { accent: true })
  ],
  quilombo: [
    s('rect', { x: 14, y: 110, width: 132, height: 36 }, 'tan'),
    s('path', { d: 'M30 60C50 20 90 80 110 50S120 100 90 90 40 50 40 60S100 70 100 90', ...SW(5) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M24 124l20-6 6 16-20 4z' }, 'red'),
    s('path', { d: 'M70 132l10-20 14 8-10 18z' }, 'blue'),
    s('circle', { cx: 120, cy: 126, r: 10 }, 'yellow'),
    s('path', { d: 'M100 118l10-6M136 112l8-6', ...SW(3) }, 'dark', { stroke: true })
  ],
  recordatorio: [
    s('rect', { x: 26, y: 26, width: 80, height: 80, rx: 2, transform: 'rotate(-6 66 66)' }, 'yellow', { accent: true }),
    s('path', { d: 'M40 50h48M40 66h48M40 82h30', ...SW(4), transform: 'rotate(-6 66 66)' }, 'orange', { stroke: true }),
    s('circle', { cx: 64, cy: 30, r: 6 }, 'red'),
    s('path', { d: 'M100 120q0-30 20-30t20 30z' }, 'blue'),
    s('path', { d: 'M96 120h48', ...SW(4) }, 'blue', { stroke: true }),
    s('circle', { cx: 120, cy: 128, r: 5 }, 'blue'),
    s('path', { d: 'M96 92l-6-6M144 92l6-6', ...SW(3) }, 'orange', { stroke: true })
  ],
  renal: [
    s('path', { d: 'M52 30q-30 0-30 50t30 50q16 0 16-20t-10-30q10-10 10-30t-16-20z' }, 'red', { accent: true }),
    s('path', { d: 'M108 30q30 0 30 50t-30 50q-16 0-16-20t10-30q-10-10-10-30t16-20z' }, 'red'),
    s('path', { d: 'M62 80q10 0 12 20v40M98 80q-10 0-12 20v40', ...SW(4) }, 'yellow', { stroke: true })
  ],
  'reorganización': [
    s('path', { d: rects([[30, 50, 32, 32]]) }, 'blue', { accent: true }),
    s('path', { d: rects([[98, 50, 32, 32]]) }, 'orange'),
    s('path', { d: rects([[64, 98, 32, 32]]) }, 'green'),
    arrow('M50 40q30-28 60 0M102 32l8 8-10 6', 'gray', 4),
    arrow('M124 92q-10 30-34 30', 'gray', 4),
    arrow('M60 124q-30-6-24-36', 'gray', 4)
  ],
  repuesto: [
    ...gear(70, 82, 34, 12, 'gray', { accent: true }),
    s('circle', { cx: 70, cy: 82, r: 12 }, 'white'),
    s('path', { d: 'M104 132l30-36', ...SW(10) }, 'red', { stroke: true }),
    s('path', { d: 'M126 86a14 14 0 1 0 22 10l-8-2-4-8z' }, 'red')
  ],
  rienda: [
    s('path', { d: 'M40 140V90q0-44 40-62l40 32q6 12-6 18l-22-4-14 20v46z' }, 'brown', { accent: true }),
    s('path', { d: 'M76 30l-12 50', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 92, cy: 52, r: 3 }, 'dark'),
    s('path', { d: 'M110 74q-20 30-60 40', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M108 70l8-6', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M120 120h20a8 8 0 0 0 0-16h-20a8 8 0 0 0 0 16z' }, 'skin'),
    s('path', { d: 'M114 110q-30 6-60 4', ...SW(4) }, 'red', { stroke: true })
  ],
  romanticismo: [
    backdrop('navy'),
    s('path', { d: 'M118 22a16 16 0 1 0 16 26a14 14 0 1 1-16-26z' }, 'yellow'),
    s('path', { d: 'M70 140V90', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(70, 118, -150, 20, 7) }, 'green'),
    s('circle', { cx: 70, cy: 76, r: 18 }, 'red', { accent: true }),
    s('path', { d: 'M60 76q10-12 20 0q-10 8-20 0', ...SW(3) }, 'pink', { stroke: true }),
    s('path', { d: dots([[30, 40], [50, 24], [140, 90], [20, 100]], 2) }, 'white')
  ],
  sabana: [
    s('rect', { x: 14, y: 14, width: 132, height: 80 }, 'orange'),
    s('rect', { x: 14, y: 94, width: 132, height: 52 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 20 }, 'red'),
    s('path', { d: 'M110 130V70M110 90l-14-20M110 84l16-16', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: ells([[110, 62, 30, 10]]) }, 'green'),
    s('path', { d: 'M24 110l4-8 4 8M54 126l4-8 4 8', ...SW(3) }, 'brown', { stroke: true })
  ],
  sabroso: [
    s('circle', { cx: 80, cy: 66, r: 40 }, 'skin'),
    s('path', { d: 'M62 58q6-6 12 0M86 58q6-6 12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 80q18 16 36 0z' }, 'dark'),
    s('ellipse', { cx: 92, cy: 86, rx: 8, ry: 6 }, 'pink', { accent: true }),
    s('path', { d: 'M28 124h104q-6 18-52 18t-52-18z' }, 'white'),
    s('path', { d: 'M28 124h104q-6 18-52 18t-52-18z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 116q-4-6 0-12M80 116q-4-6 0-12M100 116q-4-6 0-12', ...SW(3) }, 'gray', { stroke: true })
  ],
  secuestrar: [
    s('path', { d: 'M14 120V60h86l26 26h20v34z' }, 'dark', { accent: true }),
    s('path', { d: 'M100 66l20 20h-20z' }, 'gray'),
    s('rect', { x: 24, y: 68, width: 60, height: 22 }, 'black'),
    s('path', { d: dots([[40, 120], [120, 120]], 12) }, 'black'),
    s('path', { d: dots([[40, 120], [120, 120]], 5) }, 'gray'),
    s('path', { d: ring(80, 36, 12), ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 66, y: 36, width: 28, height: 22, rx: 3 }, 'yellow')
  ],
  sirena: [
    s('path', { d: halfRays(80, 90, 48, 62, 7), ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M48 110V78a32 32 0 0 1 64 0v32z' }, 'red', { accent: true }),
    s('path', { d: 'M62 74a18 18 0 0 1 18-16', ...SW(5) }, 'pink', { stroke: true }),
    s('rect', { x: 38, y: 108, width: 84, height: 18, rx: 4 }, 'dark'),
    s('rect', { x: 30, y: 126, width: 100, height: 10, rx: 3 }, 'gray')
  ],
  sucesivo: [
    ground(),
    s('rect', { x: 18, y: 100, width: 28, height: 36, rx: 3 }, 'blue'),
    s('rect', { x: 66, y: 80, width: 28, height: 56, rx: 3 }, 'blue'),
    s('rect', { x: 114, y: 60, width: 28, height: 76, rx: 3 }, 'blue', { accent: true }),
    arrow('M34 88q14-24 38-22M64 58l8 8-10 6', 'orange', 4),
    arrow('M82 66q14-24 38-22M112 36l8 8-10 6', 'orange', 4)
  ],
  'telón': [
    s('rect', { x: 14, y: 14, width: 132, height: 16 }, 'yellow'),
    s('path', { d: 'M14 30h62q-10 60 0 116H14z' }, 'red', { accent: true }),
    s('path', { d: 'M146 30H84q10 60 0 116h62z' }, 'red'),
    s('path', { d: 'M30 30v116M50 30v116M110 30v116M130 30v116', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M76 146H84', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M14 30q16 10 32 0t32 0 32 0 36 0', ...SW(6) }, 'yellow', { stroke: true })
  ],
  'terminología': [
    s('rect', { x: 30, y: 22, width: 92, height: 120, rx: 6 }, 'navy', { accent: true }),
    s('rect', { x: 40, y: 32, width: 72, height: 100 }, 'cream'),
    s('path', { d: rects([[120, 34, 14, 14], [120, 58, 14, 14], [120, 82, 14, 14]]) }, 'orange'),
    s('path', { d: 'M48 46h20M48 62h56M48 74h48M48 90h20M48 106h56M48 118h44', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 46h20M48 90h20', ...SW(5) }, 'blue', { stroke: true })
  ],
  tinto: [
    ...glass(110, 0, true),
    s('path', { d: 'M36 140q-12 0-12-12V74q0-14 12-20V22h18v32q12 6 12 20v54q0 12-12 12z' }, 'dark'),
    s('rect', { x: 28, y: 86, width: 34, height: 26, rx: 3 }, 'cream'),
    s('circle', { cx: 45, cy: 99, r: 7 }, 'red'),
    s('rect', { x: 36, y: 18, width: 18, height: 10, rx: 2 }, 'red')
  ],
  titularidad: [
    ...paper(26, 18, 84, 112),
    s('path', { d: 'M38 36h60M38 52h60M38 68h40', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 86, cy: 104, r: 14 }, 'red', { accent: true }),
    s('path', { d: ring(124, 60, 10) + 'M124 70v60M124 116h10M124 128h8', ...SW(5) }, 'yellow', { stroke: true })
  ],
  tremendamente: [
    s('path', { d: 'M14 140L80 20l66 120z' }, 'gray', { accent: true }),
    s('path', { d: 'M64 50l16-30 16 30-8-4-8 6-8-6z' }, 'white'),
    s('circle', { cx: 132, cy: 128, r: 4 }, 'skin'),
    s('rect', { x: 129, y: 132, width: 6, height: 10, rx: 2 }, 'blue'),
    arrow('M30 40V20M22 28l8-8 8 8M30 40v40', 'orange', 3)
  ],
  'vacunación': [
    s('path', { d: 'M14 120q30-30 80-24q30 4 52 18v26H14z' }, 'skin'),
    s('rect', { x: 64, y: 98, width: 18, height: 12, rx: 3 }, 'tan'),
    s('rect', { x: 82, y: 30, width: 18, height: 54, rx: 3, transform: 'rotate(35 91 57)' }, 'sky', { accent: true }),
    s('path', { d: 'M70 92l8-10', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 22l-12 18M96 18l20 8', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 86, y: 50, width: 10, height: 20, transform: 'rotate(35 91 57)' }, 'blue')
  ],
  'étnico': [
    s('rect', { x: 14, y: 20, width: 132, height: 120, rx: 6 }, 'red'),
    s('path', { d: 'M14 44l11-10 11 10 11-10 11 10 11-10 11 10 11-10 11 10 11-10 11 10 11-10 11 10', ...SW(5) }, 'yellow', { stroke: true, accent: true }),
    s('rect', { x: 14, y: 64, width: 132, height: 32 }, 'navy'),
    s('path', { d: poly([[30, 80], [40, 70], [50, 80], [40, 90]]) + poly([[70, 80], [80, 70], [90, 80], [80, 90]]) + poly([[110, 80], [120, 70], [130, 80], [120, 90]]) }, 'orange'),
    s('path', { d: 'M14 116l11 10 11-10 11 10 11-10 11 10 11-10 11 10 11-10 11 10 11-10 11 10 11-10', ...SW(5) }, 'green', { stroke: true })
  ],
  'útero': [
    s('path', { d: 'M50 50q30 10 60 0q-4 40-20 54v24H70v-24q-16-14-20-54z' }, 'pink', { accent: true }),
    s('path', { d: 'M50 50q-14-8-24 4q-6 10 4 16M110 50q14-8 24 4q6 10-4 16', ...SW(6) }, 'pink', { stroke: true }),
    s('path', { d: dots([[26, 70], [134, 70]], 7) }, 'red'),
    s('path', { d: 'M66 66q14 6 28 0', ...SW(3) }, 'red', { stroke: true })
  ],
  acostumbrar: [
    s('path', { d: 'M40 80a40 40 0 0 1 72-24M120 80a40 40 0 0 1-72 24', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M106 42l8 14-16 2zM54 118l-8-14 16-2z' }, 'blue'),
    s('path', { d: 'M62 66h32v20q0 12-16 12t-16-12z' }, 'orange', { accent: true }),
    s('path', { d: 'M94 70h6a6 6 0 0 1 0 12h-6', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M70 60q-4-6 0-12M84 60q-4-6 0-12', ...SW(2) }, 'gray', { stroke: true })
  ],
  activismo: [
    ground(),
    ...person(64, 136, 'green', { accent: true }),
    s('path', { d: 'M76 96l18-26', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M100 120V40', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 78, y: 20, width: 64, height: 44, rx: 3 }, 'yellow'),
    s('path', { d: heart(110, 34, 10) }, 'red'),
    s('path', { d: 'M52 96l-10-30', ...SW(6) }, 'skin', { stroke: true })
  ],
  acuario: [
    s('rect', { x: 18, y: 34, width: 124, height: 96, rx: 6 }, 'sky'),
    s('rect', { x: 18, y: 50, width: 124, height: 80, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: fishes([[60, 80], [110, 100]]) }, 'orange'),
    s('path', { d: 'M40 130v-26q-6-8 0-16M124 130v-30', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots([[76, 70], [82, 60], [80, 50]], 3) }, 'white'),
    s('rect', { x: 14, y: 128, width: 132, height: 10, rx: 3 }, 'dark')
  ],
  'adjudicación': [
    ...paper(20, 30, 76, 100),
    s('path', { d: 'M32 48h52M32 62h52M32 76h36', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 104l-8 26 12-6 10 8-2-28z' }, 'blue'),
    s('circle', { cx: 64, cy: 100, r: 13 }, 'yellow', { accent: true }),
    s('path', { d: 'M106 82l30-30', ...SW(6) }, 'tan', { stroke: true }),
    s('rect', { x: 96, y: 40, width: 34, height: 16, rx: 4, transform: 'rotate(-45 113 48)' }, 'brown'),
    s('rect', { x: 100, y: 122, width: 44, height: 12, rx: 4 }, 'brown')
  ],
  afinidad: [
    s('path', { d: 'M18 50h28v40a14 14 0 0 0 28 0V50h0', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M18 50h14M60 50h14', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M142 110h-28V70a14 14 0 0 0-28 0v40', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'blue', { stroke: true }),
    s('path', { d: 'M142 110h-14M100 110H86', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('path', { d: heart(80, 120, 10) }, 'pink')
  ],
  'agonía': [
    ground(),
    s('path', { d: 'M50 136h40l-4-24H54z' }, 'brown'),
    s('path', { d: 'M70 112q0-50 30-50q14 4 14 20', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 92, 160, 18, 6) }, 'green'),
    s('path', { d: ells([[114, 90, 10, 14]]) }, 'purple', { accent: true }),
    s('path', { d: ells([[108, 116, 5, 3], [122, 124, 5, 3]]) }, 'purple')
  ],
  'anarquía': [
    ground(),
    s('rect', { x: 20, y: 110, width: 26, height: 26, transform: 'rotate(20 33 123)' }, 'red', { accent: true }),
    s('rect', { x: 56, y: 100, width: 30, height: 30, transform: 'rotate(-30 71 115)' }, 'blue'),
    s('rect', { x: 100, y: 112, width: 24, height: 24, transform: 'rotate(10 112 124)' }, 'yellow'),
    s('rect', { x: 70, y: 40, width: 24, height: 24, transform: 'rotate(45 82 52)' }, 'green'),
    s('path', { d: 'M40 70l-10-10M120 70l10-10M110 92l14 4M50 96l-14 6', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: burst(120, 40, 14, 6, 7) }, 'orange')
  ],
  arancel: [
    s('path', { d: 'M80 14v132', ...DASH(4) }, 'dark', { stroke: true }),
    s('rect', { x: 40, y: 80, width: 50, height: 46, rx: 3 }, 'tan'),
    s('path', { d: 'M40 96h50M65 80v46', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: ells([[118, 64, 18, 7], [118, 56, 18, 7], [118, 48, 18, 7]]) }, 'yellow', { accent: true }),
    arrow('M100 72q-6 8-12 12', 'orange', 4),
    arrow('M20 136h40M50 128l10 8-10 8', 'blue', 4)
  ],
  arbitrario: [
    s('rect', { x: 20, y: 70, width: 50, height: 50, rx: 8 }, 'white'),
    outline({ x: 20, y: 70, width: 50, height: 50, rx: 8 }),
    s('path', { d: dots([[32, 82], [45, 95], [58, 108]], 5) }, 'red', { accent: true }),
    s('path', { d: 'M90 70h34q14 0 14 14v6q0 14-14 14h-20q-14 0-14-14z' }, 'gray'),
    s('circle', { cx: 112, cy: 87, r: 8 }, 'dark'),
    s('path', { d: 'M90 78l-18-16', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M110 50l-4-14M122 52l6-12M134 60l10-8', ...SW(3) }, 'orange', { stroke: true })
  ],
  aro: [
    s('path', { d: ring(70, 80, 48), ...SW(10) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M116 120l24 20', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M14 132h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M136 40q-8 10 0 20', ...SW(3) }, 'gray', { stroke: true })
  ],
  arterial: [
    s('rect', { x: 20, y: 40, width: 70, height: 46, rx: 10 }, 'navy', { accent: true }),
    s('path', { d: 'M90 64q30 0 30 30', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 120, cy: 110, r: 14 }, 'gray'),
    s('circle', { cx: 52, cy: 116, r: 24 }, 'white'),
    s('path', { d: ring(52, 116, 24) + 'M52 116l12-12', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: heart(55, 60, 10) }, 'red')
  ],
  aterrizar: [
    backdrop('sky'),
    s('path', { d: poly([[60, 146], [100, 146], [86, 100], [74, 100]]) }, 'dark'),
    s('path', { d: 'M80 108v8M80 124v10', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M30 60l80 30 10-4-80-34z' }, 'white', { accent: true }),
    s('path', { d: 'M62 60l-18 26h10l26-18zM60 72l-6-28h8l14 24z' }, 'blue'),
    arrow('M120 40l-20 8', 'orange', 3)
  ],
  'audición': [
    s('path', { d: 'M40 90a40 40 0 0 1 80 0', ...SW(8) }, 'dark', { stroke: true }),
    s('rect', { x: 26, y: 84, width: 26, height: 40, rx: 10 }, 'red', { accent: true }),
    s('rect', { x: 108, y: 84, width: 26, height: 40, rx: 10 }, 'red'),
    ...note(66, 100, 'blue'),
  ],
  'autodeterminación': [
    ground(),
    ...person(56, 136, 'orange', { accent: true }),
    s('path', { d: 'M70 96l28-16', ...SW(6) }, 'skin', { stroke: true }),
    arrow('M100 76l34-34M120 42h14v14', 'green', 5),
    s('path', { d: star(40, 30, 12) }, 'yellow')
  ],
  bancarrota: [
    s('path', { d: 'M30 90q0-40 44-40h4l-6 20 10 12-8 18 10 22H60q-30 0-30-32z' }, 'pink', { accent: true }),
    s('path', { d: 'M96 50q34 4 34 40q0 30-26 34l-14 0 8-20-10-16 8-14z' }, 'pink'),
    s('path', { d: 'M44 132v10M120 128v12', ...SW(6) }, 'pink', { stroke: true }),
    s('rect', { x: 72, y: 38, width: 18, height: 5 }, 'dark'),
    s('path', { d: ells([[70, 140, 8, 3], [96, 142, 8, 3]]) }, 'gray'),
    s('circle', { cx: 112, cy: 76, r: 3 }, 'dark')
  ],
  banquero: [
    ground(),
    s('path', { d: 'M74 52h72L110 26z' }, 'gray'),
    s('rect', { x: 78, y: 52, width: 64, height: 84 }, 'cream'),
    s('path', { d: 'M90 60v70M110 60v70M130 60v70', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 40, cy: 64, r: 13 }, 'skin'),
    s('path', { d: 'M30 52V38h20v14zM24 52h32', ...SW(4) }, 'black', { stroke: true }),
    s('rect', { x: 24, y: 80, width: 32, height: 56, rx: 10 }, 'navy', { accent: true }),
    s('circle', { cx: 64, cy: 106, r: 9 }, 'yellow')
  ],
  busto: [
    s('rect', { x: 46, y: 116, width: 68, height: 26, rx: 2 }, 'gray'),
    s('path', { d: 'M40 116q0-34 40-34t40 34z' }, 'cream', { accent: true }),
    s('circle', { cx: 80, cy: 56, r: 24 }, 'cream'),
    s('path', { d: 'M56 52q2-30 24-30t24 30q-6-14-24-14t-24 14z' }, 'tan'),
    s('path', { d: 'M40 116q0-34 40-34t40 34zM104 56a24 24 0 1 1-48 0a24 24 0 1 1 48 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  cacique: [
    ground(),
    s('rect', { x: 36, y: 84, width: 60, height: 52, rx: 6 }, 'brown'),
    s('circle', { cx: 66, cy: 52, r: 14 }, 'skin'),
    s('rect', { x: 50, y: 66, width: 32, height: 48, rx: 10 }, 'red', { accent: true }),
    s('path', { d: 'M104 136V36', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: star(104, 30, 12) }, 'yellow'),
    s('path', { d: 'M82 82l20-6', ...SW(6) }, 'skin', { stroke: true })
  ],
  cartucho: [
    s('rect', { x: 30, y: 40, width: 100, height: 80, rx: 8 }, 'dark', { accent: true }),
    s('path', { d: dots([[54, 80], [80, 80], [106, 80]], 13) }, 'white'),
    s('circle', { cx: 54, cy: 80, r: 10 }, 'sky'),
    s('circle', { cx: 80, cy: 80, r: 10 }, 'pink'),
    s('circle', { cx: 106, cy: 80, r: 10 }, 'yellow'),
    s('rect', { x: 66, y: 120, width: 28, height: 12 }, 'gray')
  ],
  caucho: [
    s('rect', { x: 50, y: 14, width: 34, height: 132 }, 'brown'),
    s('path', { d: 'M52 50l30 10M52 66l30 10M52 82l30 10', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: drop(90, 108, 4) }, 'white'),
    s('path', { d: 'M86 98l6 0', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 118h36l-4 22H90z' }, 'gray'),
    s('rect', { x: 89, y: 122, width: 30, height: 12 }, 'cream', { accent: true }),
    s('path', { d: ring(130, 50, 14), ...SW(8) }, 'dark', { stroke: true })
  ],
  caudillo: [
    ...horse('brown', 'dark'),
    s('circle', { cx: 74, cy: 34, r: 11 }, 'skin'),
    s('rect', { x: 62, y: 44, width: 24, height: 30, rx: 8 }, 'green', { accent: true }),
    s('path', { d: 'M86 52l26-14', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M62 28h24', ...SW(5) }, 'dark', { stroke: true })
  ],
  chatarra: [
    ground(),
    s('path', { d: poly([[20, 136], [40, 96], [110, 90], [140, 136]]) }, 'gray', { accent: true }),
    s('path', { d: ring(54, 104, 14), ...SW(7) }, 'dark', { stroke: true }),
    ...gear(104, 76, 12, 8, 'brown'),
    s('path', { d: 'M70 98l20 14M96 120h30', ...SW(5) }, 'orange', { stroke: true }),
    s('rect', { x: 28, y: 64, width: 30, height: 20, rx: 3, transform: 'rotate(-20 43 74)' }, 'red')
  ],
  chicle: [
    s('circle', { cx: 58, cy: 96, r: 38 }, 'skin'),
    s('path', { d: 'M38 86q5-5 10 0M62 86q5-5 10 0', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 104, cy: 82, r: 38 }, 'pink', { accent: true }),
    s('path', { d: 'M90 60q8-8 18-6', ...SW(4) }, 'white', { stroke: true })
  ],
  'cohesión': [
    s('path', { d: 'M50 130l12-104M66 130l6-104M80 130V26M94 130l-6-104M110 130l-12-104', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M54 80h52', ...SW(12) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M106 80q14 4 14 16M106 80q16-6 12-18', ...SW(4) }, 'red', { stroke: true })
  ],
  comediante: [
    s('path', { d: 'M30 30h100v50q0 50-50 50T30 80z' }, 'yellow', { accent: true }),
    s('path', { d: 'M48 60q10-10 20 0M92 60q10-10 20 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M46 86q34 40 68 0z' }, 'dark'),
    s('ellipse', { cx: 80, cy: 104, rx: 14, ry: 6 }, 'red'),
    s('path', { d: dots([[40, 82], [120, 82]], 6) }, 'pink')
  ],
  complementario: [
    s('path', { d: 'M20 50h44v18a10 10 0 1 1 0 20v22H20z' }, 'blue', { accent: true }),
    s('path', { d: 'M84 50h44v60H84V90a10 10 0 1 0 0-24z' }, 'orange'),
    arrow('M76 130h-6M90 130h6', 'gray', 4),
    s('path', { d: sparkle(80, 30, 8) }, 'yellow')
  ],
  conducto: [
    s('path', { d: 'M20 50h80q30 0 30 30v60', ...SW(26, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: 'M20 50h80q30 0 30 30v60', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'dark', { stroke: true }),
    arrow('M30 50h50M72 42l8 8-8 8', 'sky', 4),
    arrow('M130 100v26M122 118l8 8 8-8', 'sky', 4),
    s('path', { d: 'M40 36v28M120 100h20', ...SW(4) }, 'gray', { stroke: true })
  ],
  credencial: [
    s('path', { d: 'M56 14l24 40 24-40', ...SW(5) }, 'blue', { stroke: true }),
    s('rect', { x: 34, y: 52, width: 92, height: 96, rx: 8 }, 'white'),
    outline({ x: 34, y: 52, width: 92, height: 96, rx: 8 }),
    s('rect', { x: 34, y: 52, width: 92, height: 18, rx: 6 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 92, r: 14 }, 'skin'),
    s('path', { d: 'M60 132q20-28 40 0z' }, 'gray')
  ],
  cronista: [
    ground(),
    ...person(52, 136, 'blue', { accent: true }),
    s('path', { d: 'M66 98l20-12', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 84, y: 70, width: 10, height: 26, rx: 4, transform: 'rotate(30 89 83)' }, 'dark'),
    s('circle', { cx: 96, cy: 70, r: 8 }, 'gray'),
    ...paper(108, 64, 30, 40),
    s('path', { d: 'M114 76h18M114 86h18M114 96h12', ...SW(3) }, 'gray', { stroke: true })
  ],
  cuarteto: [
    ground(),
    s('path', { d: busts([28, 62, 98, 132], 136, 24, 40) }, 'navy', { accent: true }),
    s('path', { d: dots([[28, 86], [62, 86], [98, 86], [132, 86]], 11) }, 'skin'),
    ...note(52, 46, 'purple'),
    ...note(96, 40, 'orange')
  ],
  deseable: [
    s('path', { d: 'M30 140h100v-20H30z' }, 'brown'),
    s('path', { d: 'M40 120V60h80v60z' }, 'sky'),
    s('path', { d: 'M40 120V60h80v60z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: poly([[66, 80], [72, 72], [88, 72], [94, 80], [80, 100]]) }, 'pink', { accent: true }),
    s('path', { d: heart(80, 30, 12) }, 'red'),
    s('path', { d: sparkle(108, 78, 7) + sparkle(52, 100, 5) }, 'white')
  ],
  discapacitado: [
    s('path', { d: ring(66, 112, 26), ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 116, cy: 132, r: 7 }, 'dark'),
    s('circle', { cx: 70, cy: 40, r: 12 }, 'skin'),
    s('path', { d: 'M70 56v34h34l12 36', ...SW(10) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M70 68l24 4', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M50 96h26', ...SW(4) }, 'gray', { stroke: true })
  ],
  'distracción': [
    s('rect', { x: 14, y: 110, width: 90, height: 8 }, 'brown'),
    s('circle', { cx: 52, cy: 66, r: 14 }, 'skin'),
    s('rect', { x: 38, y: 80, width: 30, height: 30, rx: 8 }, 'green', { accent: true }),
    s('rect', { x: 70, y: 98, width: 28, height: 12 }, 'white'),
    s('path', { d: 'M58 64l6-2', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M120 52q-16-20-24-4q8 14 24 4zM120 52q16-20 24-4q-8 14-24 4z' }, 'purple'),
    s('path', { d: 'M74 60q20-20 36-10', ...DASH(2, '3 4') }, 'gray', { stroke: true })
  ],
  dorar: [
    s('path', { d: 'M100 98l44 30', ...SW(10) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 64, cy: 96, rx: 52, ry: 22 }, 'dark'),
    s('ellipse', { cx: 64, cy: 90, rx: 44, ry: 16 }, 'gray'),
    s('rect', { x: 36, y: 74, width: 56, height: 22, rx: 8 }, 'orange', { accent: true }),
    s('path', { d: 'M44 60q-4-8 0-14M64 56q-4-8 0-14M84 60q-4-8 0-14', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: sparkle(110, 50, 9) }, 'yellow')
  ],
  emigrar: [
    ground(),
    s('path', { d: 'M14 82l26-22 26 22v54H14z' }, 'cream'),
    s('path', { d: 'M10 84l30-26 30 26', ...SW(4) }, 'red', { stroke: true }),
    ...person(98, 136, 'blue'),
    s('rect', { x: 112, y: 104, width: 22, height: 28, rx: 4 }, 'orange', { accent: true }),
    arrow('M80 50h50M120 40l10 10-10 10', 'green', 5)
  ],
  'erección': [
    ground(),
    s('path', { d: 'M30 136V24M30 24h100M30 40l20-16', ...SW(6) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M110 24v40', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 92, y: 64, width: 36, height: 10 }, 'red'),
    s('path', { d: 'M70 136V96h20v40z' }, 'gray'),
    s('path', { d: 'M70 96h20', ...SW(3) }, 'dark', { stroke: true }),
    arrow('M140 120V84M132 92l8-8 8 8', 'orange', 4)
  ],
  escoria: [
    s('path', { d: 'M30 60h100l-12 76H42z' }, 'gray'),
    s('path', { d: 'M36 76h88l-8 54H44z' }, 'orange'),
    s('path', { d: 'M36 76q10-10 20 0t20 0 20 0 20 0 8 0v-8H36z' }, 'dark', { accent: true }),
    s('path', { d: dots([[50, 66], [76, 64], [104, 68]], 5) }, 'black'),
    s('path', { d: 'M60 48q-6-8 0-16M90 48q-6-8 0-16', ...SW(3) }, 'gray', { stroke: true })
  ],
  esmeralda: [
    s('path', { d: poly([[50, 30], [110, 30], [134, 64], [80, 136], [26, 64]]) }, 'green', { accent: true }),
    s('path', { d: poly([[50, 30], [110, 30], [98, 64], [62, 64]]) }, 'mint'),
    s('path', { d: 'M26 64h108M62 64l18 72 18-72', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: sparkle(130, 24, 10) }, 'yellow')
  ],
  excluir: [
    s('path', { d: ring(60, 80, 46), ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: busts([42, 70], 108, 22, 28) + dots([[42, 72], [70, 72]], 9) }, 'blue'),
    s('path', { d: busts([56], 124, 18, 20) + dots([[56, 96]], 8) }, 'blue'),
    s('circle', { cx: 132, cy: 76, r: 9 }, 'skin'),
    s('rect', { x: 122, y: 88, width: 20, height: 28, rx: 7 }, 'orange', { accent: true }),
    s('path', { d: 'M112 60v52', ...SW(6) }, 'red', { stroke: true })
  ],
  'experimentación': [
    s('path', { d: 'M38 24h24M44 24v40l-22 60q-2 14 12 14h32q14 0 12-14L56 64V24', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 106l-6 18q-2 12 10 12h32q12 0 10-12l-6-18z' }, 'green', { accent: true }),
    s('path', { d: 'M100 40v84a14 14 0 0 0 28 0V40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M103 90v34a11 11 0 0 0 22 0V90z' }, 'purple'),
    s('path', { d: dots([[46, 92], [52, 78], [110, 76], [116, 62]], 4) }, 'sky')
  ],
  'extorsión': [
    s('path', { d: 'M24 60h112v26H24z' }, 'brown'),
    s('path', { d: 'M24 60q14 14 28 0t28 0 28 0 28 0', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M24 52v42M136 52v42', ...SW(12) }, 'dark', { stroke: true }),
    s('path', { d: ells([[70, 112, 10, 4], [90, 128, 10, 4], [74, 138, 10, 4]]) }, 'yellow', { accent: true }),
    arrow('M14 40q-4-14 10-18M146 40q4-14-10-18', 'red', 4)
  ],
  izar: [
    ground(),
    s('path', { d: 'M100 136V18', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M103 50h38v28h-38z' }, 'red', { accent: true }),
    s('path', { d: 'M96 30v80', ...SW(2) }, 'dark', { stroke: true }),
    ...person(64, 136, 'blue'),
    s('path', { d: 'M74 94l20-6', ...SW(6) }, 'skin', { stroke: true }),
    arrow('M126 44V22M118 30l8-8 8 8', 'green', 4)
  ],
  'ilícito': [
    s('rect', { x: 34, y: 54, width: 76, height: 64, rx: 4 }, 'tan'),
    s('path', { d: 'M34 72h76M72 54v64', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 110, cy: 54, r: 30 }, 'white'),
    s('path', { d: ring(110, 54, 26) + 'M92 36l36 36', ...SW(7) }, 'red', { stroke: true, accent: true })
  ],
  intestino: [
    s('path', { d: 'M28 30q0-14 14-14h76q14 0 14 14v100q0 14-14 14H42q-14 0-14-14z' }, 'skin'),
    s('path', { d: 'M46 40h68v18H46v18h68v18H46v18h50v20', ...SW(10) }, 'pink', { stroke: true, accent: true }),
    s('path', { d: 'M46 40h68v18H46v18h68v18H46v18h50v20', ...SW(2) }, 'red', { stroke: true })
  ],
  irrelevante: [
    s('path', { d: 'M20 40h50v50H20zM70 40h50v50H70zM20 90h50v50H20z' }, 'blue'),
    s('path', { d: 'M20 40h100v50H20zM20 90h50v50', ...SW(3) }, 'navy', { stroke: true }),
    s('rect', { x: 70, y: 90, width: 50, height: 50, ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 110l20-10 14 20-20 14z' }, 'pink', { accent: true }),
  ],
  'irónicamente': [
    s('rect', { x: 56, y: 56, width: 40, height: 84, rx: 14 }, 'red', { accent: true }),
    s('path', { d: 'M66 56V40h20v16M86 44h20l10 14', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M88 100q-16-20 0-44q4 14 10 16q2-10 8-14q10 22-4 42z' }, 'orange'),
    s('path', { d: 'M92 98q-6-10 2-18q6 8 6 18z' }, 'yellow'),
    s('rect', { x: 64, y: 110, width: 24, height: 18 }, 'white'),
    ground(142)
  ],
  llanta: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'dark'),
    s('circle', { cx: 80, cy: 80, r: 44 }, 'gray', { accent: true }),
    s('path', { d: rays(80, 80, 12, 42, 5, -90), ...SW(10) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'dark'),
    s('path', { d: dots(around(80, 80, 6, 5), 1.5) }, 'gray')
  ],
  'madrileño': [
    ground(),
    s('path', { d: 'M110 136V70', ...SW(8) }, 'brown', { stroke: true }),
    s('circle', { cx: 110, cy: 52, r: 30 }, 'green'),
    s('path', { d: dots([[96, 44], [118, 40], [124, 62], [100, 64], [110, 52]], 4) }, 'red'),
    s('path', { d: 'M40 136v-40q0-24 20-26q-4-14 8-16q8 2 6 12q14 6 14 30v40z' }, 'brown', { accent: true }),
    s('path', { d: 'M86 92l12-14', ...SW(8) }, 'brown', { stroke: true }),
    s('circle', { cx: 72, cy: 66, r: 2.5 }, 'dark')
  ],
  mayordomo: [
    s('rect', { x: 100, y: 22, width: 46, height: 114 }, 'brown'),
    s('circle', { cx: 138, cy: 82, r: 3 }, 'yellow'),
    s('circle', { cx: 60, cy: 46, r: 14 }, 'skin'),
    s('path', { d: 'M40 136l4-72h32l4 72h-12l-8-30-8 30z' }, 'black', { accent: true }),
    s('path', { d: 'M52 64l8 14 8-14z' }, 'white'),
    s('path', { d: 'M52 64l8 4-8 4zM68 64l-8 4 8 4z' }, 'dark'),
    s('path', { d: 'M76 84l12 6M88 92a5 5 0 1 0 0.1 0', ...SW(3) }, 'yellow', { stroke: true }),
    ground()
  ],
  metabolismo: [
    s('path', { d: 'M40 80a40 40 0 0 1 72-24M120 80a40 40 0 0 1-72 24', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M106 42l8 14-16 2zM54 118l-8-14 16-2z' }, 'green'),
    s('path', { d: 'M80 104q-24-14-8-44q4 14 10 16q-2-16 10-26q-2 20 8 30q4 18-20 24z' }, 'orange', { accent: true }),
    s('path', { d: 'M80 104q-10-8-2-22q10 10 10 22z' }, 'yellow')
  ],
  mostrador: [
    s('rect', { x: 14, y: 90, width: 132, height: 50, rx: 4 }, 'brown', { accent: true }),
    s('rect', { x: 14, y: 84, width: 132, height: 10, rx: 3 }, 'tan'),
    s('path', { d: 'M86 84l6-34h40l6 34z' }, 'gray'),
    s('rect', { x: 96, y: 56, width: 32, height: 12 }, 'green'),
    s('circle', { cx: 46, cy: 52, r: 13 }, 'skin'),
    s('rect', { x: 30, y: 66, width: 32, height: 22, rx: 8 }, 'red'),
    s('path', { d: 'M30 110h100', ...SW(3) }, 'tan', { stroke: true })
  ],
  'objeción': [
    s('path', { d: 'M56 140V96l-18-30a8 8 0 0 1 14-8l12 18V36a8 8 0 0 1 16 0v-8a8 8 0 0 1 16 0v8a8 8 0 0 1 16 0v16a8 8 0 0 1 14 0v48q0 40-30 40z' }, 'skin', { accent: true }),
    s('path', { d: 'M80 40v40M96 32v48M112 40v40', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M22 30l12 8M20 50h14M22 70l12-6', ...SW(4) }, 'red', { stroke: true })
  ],
  omega: [
    ground(),
    s('path', { d: dots([[24, 116], [48, 116], [72, 116], [96, 116]], 10) }, 'gray'),
    s('circle', { cx: 128, cy: 112, r: 16 }, 'red', { accent: true }),
    s('path', { d: 'M128 84V52', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: checker(128, 30, 3, 2, 8) }, 'black'),
    s('rect', { x: 128, y: 30, width: 24, height: 16, ...SW(2) }, 'dark', { stroke: true })
  ],
  'omisión': [
    ...paper(28, 18, 104, 124),
    s('path', { d: 'M44 40h72M44 64h72M44 112h72', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 40, y: 78, width: 80, height: 20, rx: 3, ...DASH(3) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M136 88h-12M130 82l-6 6 6 6', ...SW(3) }, 'red', { stroke: true })
  ],
  paraje: [
    backdrop('sky'),
    s('path', { d: 'M14 110l36-60 30 40 24-30 42 50v36H14z' }, 'green', { accent: true }),
    s('path', { d: 'M90 70l-6 76h16l-4-76z' }, 'blue'),
    s('path', { d: 'M14 120h132v26H14z' }, 'mint'),
    s('path', { d: ells([[92, 128, 22, 6]]) }, 'blue'),
    s('circle', { cx: 120, cy: 32, r: 10 }, 'yellow')
  ],
  'parálisis': [
    s('rect', { x: 34, y: 26, width: 92, height: 112, rx: 10 }, 'sky', { accent: true }),
    s('circle', { cx: 80, cy: 60, r: 14 }, 'skin'),
    s('rect', { x: 64, y: 76, width: 32, height: 48, rx: 10 }, 'blue'),
    s('path', { d: 'M74 60h12', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 40l14 10M106 120l10-12M108 40l-8 12', ...SW(3) }, 'white', { stroke: true }),
    s('rect', { x: 34, y: 26, width: 92, height: 112, rx: 10, ...SW(3) }, 'blue', { stroke: true })
  ],
  'patología': [
    s('rect', { x: 40, y: 128, width: 80, height: 12, rx: 4 }, 'dark'),
    s('path', { d: 'M60 128q40 0 40-40', ...SW(8) }, 'gray', { stroke: true }),
    s('rect', { x: 68, y: 20, width: 20, height: 60, rx: 4, transform: 'rotate(-25 78 50)' }, 'gray', { accent: true }),
    s('rect', { x: 64, y: 96, width: 44, height: 6 }, 'dark'),
    s('ellipse', { cx: 126, cy: 120, rx: 20, ry: 8 }, 'sky'),
    s('path', { d: dots([[120, 118], [132, 120], [126, 122]], 3) }, 'purple')
  ],
  picada: [
    s('rect', { x: 14, y: 50, width: 132, height: 80, rx: 12 }, 'brown', { accent: true }),
    s('path', { d: poly([[26, 110], [62, 70], [70, 110]]) }, 'yellow'),
    s('path', { d: dots([[90, 76], [110, 70], [126, 84], [100, 96]], 11) }, 'red'),
    s('path', { d: dots([[90, 76], [110, 70], [126, 84], [100, 96]], 3) }, 'pink'),
    s('path', { d: dots([[78, 112], [92, 116], [106, 114]], 6) }, 'green'),
  ],
  porro: [
    s('rect', { x: 30, y: 100, width: 90, height: 16, rx: 8, transform: 'rotate(-20 75 108)' }, 'white'),
    s('rect', { x: 30, y: 100, width: 90, height: 16, rx: 8, transform: 'rotate(-20 75 108)', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 120, cy: 92, r: 6 }, 'orange'),
    s('path', { d: 'M124 80q-8-10 0-20t0-20', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: leaflet(40, 64, -90, 36, 7) + leaflet(40, 64, -130, 28, 6) + leaflet(40, 64, -50, 28, 6) }, 'green', { accent: true })
  ],
  predominante: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'gray'),
    s('path', { d: wedge(80, 80, 60, -90, 190) }, 'blue', { accent: true }),
    s('path', { d: wedge(80, 80, 60, 190, 240) }, 'yellow'),
    s('path', { d: ring(80, 80, 60), ...SW(3) }, 'white', { stroke: true })
  ],
};
