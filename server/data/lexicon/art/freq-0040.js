// Illustration specs for words still undrawn in batches 0038–0042 (see server/scripts/lexicon/art.js)
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

module.exports = {
  superioridad: [
    ground(),
    s('rect', { x: 62, y: 76, width: 36, height: 60, rx: 3 }, 'yellow', { accent: true }),
    ...person(80, 76, 'red', { h: 30, w: 22, r: 10 }),
    s('rect', { x: 22, y: 112, width: 32, height: 24, rx: 3 }, 'gray'),
    ...person(38, 112, 'blue', { h: 22, w: 18, r: 8 }),
    s('rect', { x: 108, y: 120, width: 32, height: 16, rx: 3 }, 'gray'),
    arrow('M126 106V58M116 68l10-10 10 10', 'green', 5)
  ],
  tierno: [
    s('path', { d: heart(80, 98, 38) }, 'pink'),
    s('ellipse', { cx: 80, cy: 104, rx: 26, ry: 20 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 74, r: 16 }, 'yellow'),
    s('path', { d: 'M76 78l4 6 4-6z' }, 'orange'),
    s('path', { d: dots([[73, 71], [87, 71]], 2.5) }, 'dark'),
    s('path', { d: dots([[68, 80], [92, 80]], 3) }, 'red')
  ],
  trauma: [
    ...face(80, 84, 46, 'skin', 'frown'),
    s('path', { d: 'M36 62q44-26 88 0v14q-44-26-88 0z' }, 'white'),
    s('path', { d: 'M36 62q44-26 88 0v14q-44-26-88 0z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 50h10v-6h-10zM98 46h6', ...SW(3) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M104 106l12 6M110 102l-2 14', ...SW(4) }, 'tan', { stroke: true })
  ],
  tregua: [
    backdrop('sky'),
    s('path', { d: 'M56 24v116', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M58 28q24-10 44 0t40 0v44q-20 10-40 0t-44 0z' }, 'white', { accent: true }),
    s('path', { d: 'M58 28q24-10 44 0t40 0v44q-20 10-40 0t-44 0z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M22 132l48-10M138 132l-48-10', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 136l8-14M136 136l-8-14', ...SW(5) }, 'dark', { stroke: true })
  ],
  tribuna: [
    s('path', { d: 'M14 136V40h132v96z' }, 'gray'),
    s('path', { d: 'M14 64h132M14 88h132M14 112h132', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[26, 56], [50, 56], [74, 56], [98, 56], [122, 56], [38, 80], [62, 80], [86, 80], [110, 80], [134, 80], [26, 104], [50, 104], [98, 104], [122, 104]], 6) }, 'skin'),
    s('path', { d: rects([[20, 56, 12, 8], [68, 56, 12, 8], [116, 56, 12, 8], [56, 80, 12, 8], [104, 80, 12, 8], [44, 104, 12, 8], [92, 104, 12, 8]]) }, 'red', { accent: true }),
    s('path', { d: rects([[44, 56, 12, 8], [92, 56, 12, 8], [32, 80, 12, 8], [80, 80, 12, 8], [128, 80, 12, 8], [20, 104, 12, 8], [116, 104, 12, 8]]) }, 'blue'),
    s('path', { d: 'M10 40l14-18h112l14 18z' }, 'navy')
  ],
  trofeo: [
    s('path', { d: 'M48 32h64v24a32 32 0 0 1-64 0z' }, 'yellow', { accent: true }),
    s('path', { d: 'M48 40H34q0 26 18 30M112 40h14q0 26-18 30', ...SW(6) }, 'yellow', { stroke: true }),
    s('rect', { x: 74, y: 86, width: 12, height: 20 }, 'orange'),
    s('rect', { x: 56, y: 104, width: 48, height: 12, rx: 3 }, 'orange'),
    s('rect', { x: 48, y: 116, width: 64, height: 20, rx: 3 }, 'brown'),
    s('path', { d: star(80, 56, 11) }, 'white')
  ],
  urbanización: [
    s('path', { d: 'M14 120h132v20H14z' }, 'gray'),
    s('path', { d: 'M18 128h12M42 128h12M66 128h12M90 128h12M114 128h12', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: rects([[20, 84, 30, 36], [65, 84, 30, 36], [110, 84, 30, 36]]) }, 'cream'),
    s('path', { d: 'M16 86l19-22 19 22zM61 86l19-22 19 22zM106 86l19-22 19 22z' }, 'red', { accent: true }),
    s('path', { d: rects([[30, 102, 10, 18], [75, 102, 10, 18], [120, 102, 10, 18]]) }, 'brown'),
    s('path', { d: dots([[40, 40]], 14) }, 'green'),
    s('path', { d: 'M40 54v30', ...SW(4) }, 'brown', { stroke: true })
  ],
  yoga: [
    s('rect', { x: 20, y: 124, width: 120, height: 10, rx: 4 }, 'purple'),
    s('ellipse', { cx: 80, cy: 116, rx: 42, ry: 10 }, 'navy'),
    s('path', { d: 'M64 116V82q16-12 32 0v34z' }, 'mint', { accent: true }),
    s('circle', { cx: 80, cy: 64, r: 13 }, 'skin'),
    s('path', { d: 'M66 88Q52 70 76 40M94 88Q108 70 84 40', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: dots([[80, 36]], 5) }, 'skin')
  ],
  abad: [
    s('path', { d: 'M56 136l8-62h32l8 62z' }, 'brown', { accent: true }),
    s('path', { d: 'M62 72q18-30 36 0z' }, 'brown'),
    s('circle', { cx: 80, cy: 58, r: 14 }, 'skin'),
    s('path', { d: 'M68 50a12 6 0 0 1 24 0z' }, 'tan'),
    s('path', { d: 'M62 100h36', ...SW(4) }, 'cream', { stroke: true }),
    s('path', { d: 'M116 136V48q0-14 12-14t10 10-10 8', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M98 96l18-4', ...SW(6) }, 'skin', { stroke: true })
  ],
  aproximación: [
    s('circle', { cx: 112, cy: 80, r: 32 }, 'red'),
    s('circle', { cx: 112, cy: 80, r: 21 }, 'white'),
    s('circle', { cx: 112, cy: 80, r: 10 }, 'red', { accent: true }),
    s('path', { d: dots([[22, 80]], 5) + dots([[44, 80]], 6) + dots([[64, 80]], 7) }, 'blue'),
    arrow('M30 112q30 16 62-10M84 98l10 2-2 10', 'orange', 5)
  ],
  canon: [
    s('rect', { x: 18, y: 40, width: 124, height: 26, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M30 40v10M42 40v6M54 40v10M66 40v6M78 40v10M90 40v6M102 40v10M114 40v6M126 40v10', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: rects([[30, 80, 20, 56], [56, 86, 18, 50], [80, 78, 22, 58]]) }, 'navy'),
    s('path', { d: 'M30 92h20M56 98h18M80 90h22', ...SW(3) }, 'yellow', { stroke: true }),
    s('circle', { cx: 124, cy: 108, r: 18 }, 'green'),
    s('path', { d: 'M115 108l7 7 11-13', ...SW(4) }, 'white', { stroke: true })
  ],
  cera: [
    s('ellipse', { cx: 80, cy: 136, rx: 40, ry: 8 }, 'gray'),
    s('path', { d: 'M58 60h44v76H58z' }, 'cream', { accent: true }),
    s('path', { d: 'M58 58h44v10q-4 10-8 0t-8 14-8-14-8 6-8-6-6 20-6-20z' }, 'white'),
    s('path', { d: 'M58 60h44v76H58z', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M80 58v-8', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: drop(80, 38, 8) }, 'orange'),
    s('path', { d: drop(80, 40, 4) }, 'yellow')
  ],
  cercanía: [
    s('circle', { cx: 80, cy: 86, r: 56, ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 112V88l22-18 22 18v24z' }, 'cream'),
    s('path', { d: 'M42 90l28-24 28 24', ...SW(5) }, 'red', { stroke: true }),
    s('rect', { x: 64, y: 96, width: 12, height: 16 }, 'brown'),
    s('path', { d: 'M110 98c-12-14-12-30 0-30s12 16 0 30z' }, 'blue', { accent: true }),
    s('circle', { cx: 110, cy: 80, r: 4 }, 'white')
  ],
  certamen: [
    s('path', { d: 'M66 96l-14 44 14-8 8 12 6-44zM94 96l14 44-14-8-8 12-6-44z' }, 'red'),
    s('path', { d: burst(80, 70, 46, 38, 16) }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 70, r: 30 }, 'sky'),
    s('circle', { cx: 80, cy: 70, r: 20 }, 'yellow'),
    s('path', { d: star(80, 70, 12) }, 'orange')
  ],
  ciclista: [
    s('path', { d: ring(44, 112, 22) + ring(116, 112, 22), ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 112l26-30h36l10 30M70 82l14 30h-40M84 112l22-30M66 74h12M104 82l-2-10', ...SW(4) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M74 76l14-30 16 34M88 48l18 22', ...SW(8) }, 'blue', { stroke: true }),
    s('circle', { cx: 92, cy: 32, r: 11 }, 'skin'),
    s('path', { d: 'M80 30a13 13 0 0 1 26-2z' }, 'yellow')
  ],
  codo: [
    s('circle', { cx: 86, cy: 116, r: 26 }, 'pink'),
    s('path', { d: 'M20 116h66V40', ...SW(24) }, 'skin', { stroke: true }),
    s('path', { d: dots([[86, 30]], 15) }, 'skin'),
    s('path', { d: 'M20 116h24', ...SW(26) }, 'blue', { stroke: true }),
    s('circle', { cx: 86, cy: 116, r: 7 }, 'red', { accent: true }),
    arrow('M140 146l-30-18M110 138l0-10 10-2', 'red', 4)
  ],
  compatible: [
    s('path', { d: 'M20 50h56v16a10 10 0 1 1 0 28v16H20z' }, 'blue', { accent: true }),
    s('path', { d: 'M84 50h56v60H84V94a10 10 0 1 0 0-28z' }, 'orange'),
    s('path', { d: 'M38 126l12 12 22-24', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: heart(110, 128, 14) }, 'red')
  ],
  compatriota: [
    ground(),
    s('path', { d: 'M80 16v38', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 18h36v22H82z' }, 'green', { accent: true }),
    s('path', { d: 'M82 26h36', ...SW(6) }, 'white', { stroke: true }),
    ...person(54, 136, 'green'),
    ...person(106, 136, 'green'),
    s('path', { d: 'M66 104h28', ...SW(6) }, 'skin', { stroke: true })
  ],
  conveniencia: [
    s('rect', { x: 22, y: 50, width: 116, height: 86 }, 'cream'),
    s('path', { d: 'M18 34h124v20H18z' }, 'green', { accent: true }),
    s('path', { d: 'M18 54q8 10 15.5 0t15.5 0 15.5 0 15.5 0 15.5 0 15.5 0 15.5 0 15.5 0z' }, 'white'),
    s('rect', { x: 32, y: 74, width: 44, height: 62 }, 'sky'),
    s('rect', { x: 88, y: 74, width: 40, height: 30 }, 'sky'),
    s('path', { d: 'M54 74v62', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[98, 96], [108, 96], [118, 96]], 4) }, 'red')
  ],
  cuan: [
    s('path', { d: 'M22 120a58 58 0 0 1 116 0', ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M32 120a48 48 0 0 1 96 0', ...SW(8) }, 'yellow', { stroke: true }),
    s('path', { d: 'M42 120a38 38 0 0 1 76 0', ...SW(8) }, 'green', { stroke: true }),
    s('path', { d: 'M52 120a28 28 0 0 1 56 0', ...SW(8) }, 'blue', { stroke: true }),
    s('path', { d: sparkle(28, 34, 10) + sparkle(132, 30, 8) + sparkle(80, 22, 7) }, 'yellow'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  debidamente: [
    ...paper(34, 18, 92, 120),
    s('path', { d: 'M44 40l6 6 10-12M44 70l6 6 10-12M44 100l6 6 10-12', ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M68 40h46M68 70h46M68 100h34', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 112, cy: 120, r: 14, ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: star(112, 120, 7) }, 'red')
  ],
  desarrollador: [
    s('rect', { x: 14, y: 30, width: 92, height: 64, rx: 6 }, 'dark'),
    s('path', { d: 'M24 44h24M32 56h34M32 68h20M24 80h28', ...SW(5) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M54 44h16M58 68h24', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M10 94h100l-8 10H18z' }, 'gray'),
    s('circle', { cx: 128, cy: 66, r: 13 }, 'skin'),
    s('path', { d: 'M108 136V94q0-14 20-14t20 14v42z' }, 'blue'),
    s('path', { d: 'M112 100l-10 0', ...SW(6) }, 'skin', { stroke: true })
  ],
  detective: [
    s('path', { d: 'M44 138q0-36 36-36t36 36z' }, 'brown'),
    s('circle', { cx: 80, cy: 72, r: 24 }, 'skin'),
    s('path', { d: 'M52 64q2-30 28-30t28 30z' }, 'tan'),
    s('path', { d: 'M46 64h68', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M108 128l20 18', ...SW(8) }, 'dark', { stroke: true }),
    s('circle', { cx: 100, cy: 116, r: 16 }, 'sky', { accent: true }),
    s('circle', { cx: 100, cy: 116, r: 16, ...SW(5) }, 'dark', { stroke: true })
  ],
  devoción: [
    ground(),
    s('rect', { x: 40, y: 112, width: 40, height: 24, rx: 8 }, 'blue'),
    s('rect', { x: 60, y: 76, width: 26, height: 44, rx: 9, transform: 'rotate(10 73 120)' }, 'blue'),
    s('circle', { cx: 82, cy: 62, r: 12 }, 'skin'),
    s('path', { d: 'M86 92l12-14', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(120, 52, 18) }, 'red', { accent: true }),
    s('path', { d: rays(120, 42, 26, 34, 8), ...SW(3) }, 'yellow', { stroke: true })
  ],
  diabetes: [
    s('rect', { x: 26, y: 30, width: 56, height: 96, rx: 12 }, 'blue', { accent: true }),
    s('rect', { x: 34, y: 42, width: 40, height: 30, rx: 4 }, 'mint'),
    s('path', { d: dots([[44, 94], [64, 94]], 6) }, 'white'),
    s('rect', { x: 46, y: 126, width: 16, height: 18 }, 'white'),
    s('path', { d: drop(54, 140, 5) }, 'red'),
    s('path', { d: rects([[96, 104, 24, 24], [122, 104, 24, 24], [108, 80, 24, 24]]) }, 'white'),
    s('path', { d: rects([[96, 104, 24, 24], [122, 104, 24, 24], [108, 80, 24, 24]]), ...SW(2) }, 'gray', { stroke: true })
  ],
  galaxia: [
    s('circle', { cx: 80, cy: 80, r: 66 }, 'navy'),
    s('path', { d: 'M80 80c20-10 10-36-14-34-30 2-40 36-20 56 24 24 70 10 72-26', ...SW(8) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M80 80c-20 10-10 36 14 34 30-2 40-36 20-56-24-24-70-10-72 26', ...SW(8) }, 'pink', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 10 }, 'yellow'),
    s('path', { d: sparkle(40, 40, 6) + sparkle(124, 118, 6) + sparkle(46, 124, 4) + sparkle(120, 40, 4) }, 'white')
  ],
  gestionar: [
    s('rect', { x: 26, y: 26, width: 76, height: 110, rx: 6 }, 'brown'),
    s('rect', { x: 34, y: 36, width: 60, height: 92, rx: 2 }, 'white'),
    s('rect', { x: 48, y: 20, width: 32, height: 14, rx: 4 }, 'gray'),
    s('path', { d: 'M42 56l5 5 8-10M42 82l5 5 8-10M42 108l5 5 8-10', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M62 56h24M62 82h24M62 108h18', ...SW(3) }, 'gray', { stroke: true }),
    ...gear(118, 104, 16, 8, 'orange', { accent: true }),
    s('circle', { cx: 118, cy: 104, r: 6 }, 'white')
  ],
  graduación: [
    s('path', { d: 'M80 30l62 22-62 22-62-22z' }, 'black', { accent: true }),
    s('path', { d: 'M48 64v24q32 16 64 0V64l-32 10z' }, 'dark'),
    s('path', { d: 'M80 52l46 6v28', ...SW(3) }, 'yellow', { stroke: true }),
    s('circle', { cx: 126, cy: 90, r: 5 }, 'yellow'),
    s('rect', { x: 34, y: 112, width: 92, height: 22, rx: 11, transform: 'rotate(-8 80 123)' }, 'cream'),
    s('path', { d: 'M76 112l8 22', ...SW(6) }, 'red', { stroke: true })
  ],
  humanitario: [
    s('rect', { x: 36, y: 40, width: 88, height: 70, rx: 4 }, 'tan'),
    s('path', { d: 'M36 56h88', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: heart(80, 76, 22) }, 'red', { accent: true }),
    s('path', { d: 'M14 112q20-2 34 8h64q14-10 34-8v24H14z' }, 'skin'),
    s('path', { d: 'M48 120h64', ...SW(3) }, 'tan', { stroke: true })
  ],
  húmedo: [
    s('path', { d: 'M40 58a20 20 0 0 1 8-38 26 26 0 0 1 48-4 20 20 0 0 1 24 42z' }, 'gray'),
    s('path', { d: 'M14 76h132', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 76h64v40l-8-4-8 6-8-6-8 6-8-6-8 6-8-6-8 4z' }, 'blue', { accent: true }),
    s('path', { d: drop(56, 132, 4) + drop(80, 138, 5) + drop(104, 132, 4) + drop(30, 104, 4) + drop(130, 104, 4) }, 'sky')
  ],
  incentivo: [
    s('path', { d: 'M18 30l84 10', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 40v30', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M92 74l16 0-8 40z' }, 'orange', { accent: true }),
    s('path', { d: 'M94 72l6-12 6 12', ...SW(3) }, 'green', { stroke: true }),
    ...lean(52, 136, 18, 'blue'),
    s('path', { d: 'M62 104l20-12', ...SW(6) }, 'skin', { stroke: true }),
    ground()
  ],
  inclinación: [
    s('path', { d: 'M18 132h124V60z' }, 'tan'),
    s('path', { d: 'M18 132h124V60z', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M54 132a36 36 0 0 0-4-18', ...SW(4) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 104, cy: 66, r: 14 }, 'blue'),
    arrow('M86 64L54 80M56 72l-4 8 9 1', 'orange', 4)
  ],
  indicio: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'cream'),
    s('path', { d: ells([[30, 124, 7, 11], [52, 104, 7, 11], [56, 76, 7, 11], [78, 58, 7, 11], [86, 30, 7, 11]]) }, 'brown'),
    s('path', { d: 'M110 104l22 22', ...SW(8) }, 'dark', { stroke: true }),
    s('circle', { cx: 96, cy: 90, r: 20 }, 'sky', { accent: true }),
    s('circle', { cx: 96, cy: 90, r: 20, ...SW(5) }, 'dark', { stroke: true })
  ],
  indirectamente: [
    s('rect', { x: 66, y: 50, width: 28, height: 60, rx: 3 }, 'gray'),
    s('path', { d: 'M38 80h84', ...DASH(3) }, 'gray', { stroke: true }),
    arrow('M30 86q0 52 50 50t50-50', 'orange', 5),
    s('path', { d: 'M120 92l10-8 6 12', ...SW(5) }, 'orange', { stroke: true }),
    s('circle', { cx: 28, cy: 80, r: 12 }, 'blue', { accent: true }),
    s('circle', { cx: 132, cy: 74, r: 12 }, 'red')
  ],
  interfaz: [
    s('rect', { x: 18, y: 24, width: 124, height: 112, rx: 10 }, 'navy'),
    s('rect', { x: 26, y: 40, width: 108, height: 88, rx: 4 }, 'white'),
    s('path', { d: dots([[30, 32], [40, 32], [50, 32]], 3) }, 'yellow'),
    s('rect', { x: 34, y: 50, width: 40, height: 30, rx: 4 }, 'sky'),
    s('rect', { x: 84, y: 50, width: 42, height: 12, rx: 6 }, 'green', { accent: true }),
    s('circle', { cx: 118, cy: 56, r: 4 }, 'white'),
    s('path', { d: 'M34 98h92M84 72h42', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 70, cy: 98, r: 7 }, 'blue'),
    s('rect', { x: 34, y: 108, width: 44, height: 12, rx: 6 }, 'orange')
  ],
  libio: [
    s('rect', { x: 14, y: 30, width: 132, height: 100, rx: 4 }, 'black'),
    s('rect', { x: 14, y: 30, width: 132, height: 25, rx: 4 }, 'red'),
    s('rect', { x: 14, y: 105, width: 132, height: 25, rx: 4 }, 'green', { accent: true }),
    s('path', { d: 'M86 66a15 15 0 1 0 0 28 12 12 0 1 1 0-28z' }, 'white'),
    s('path', { d: star(94, 80, 7) }, 'white'),
    s('rect', { x: 14, y: 30, width: 132, height: 100, rx: 4, ...SW(2) }, 'gray', { stroke: true })
  ],
  llanto: [
    ...face(80, 74, 48, 'skin', 'frown'),
    s('path', { d: drop(58, 98, 6) + drop(102, 98, 6) + drop(56, 128, 5) + drop(104, 128, 5) }, 'blue', { accent: true }),
    s('path', { d: 'M54 60q8 6 16 0M90 60q8 6 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  mariscal: [
    s('path', { d: 'M40 140q0-44 40-44t40 44z' }, 'navy', { accent: true }),
    s('path', { d: 'M38 104h22M100 104h22', ...SW(8) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 72, r: 20 }, 'skin'),
    s('path', { d: 'M56 56q24-20 48 0v4H56z' }, 'navy'),
    s('path', { d: 'M54 60h52', ...SW(5) }, 'black', { stroke: true }),
    s('path', { d: star(80, 50, 6) + star(70, 118, 6) + star(90, 118, 6) }, 'yellow'),
    s('path', { d: 'M126 140l12-34', ...SW(6) }, 'red', { stroke: true })
  ],
  oponer: [
    s('path', { d: 'M16 66h40V48l28 32-28 32V94H16z' }, 'blue', { accent: true }),
    s('path', { d: 'M144 66h-40V48L76 80l28 32V94h40z' }, 'red'),
    s('path', { d: burst(80, 80, 18, 8, 8) }, 'yellow')
  ],
  optimismo: [
    s('path', { d: rays(80, 72, 46, 60, 12), ...SW(6) }, 'orange', { stroke: true }),
    ...face(80, 72, 38, 'yellow', 'smile', { accent: true }),
    s('path', { d: 'M28 140a14 14 0 0 1 8-26 20 20 0 0 1 36-2 14 14 0 0 1 10 28z' }, 'white'),
    s('path', { d: 'M28 140a14 14 0 0 1 8-26 20 20 0 0 1 36-2 14 14 0 0 1 10 28z', ...SW(2) }, 'gray', { stroke: true })
  ],
  pana: [
    s('path', { d: 'M42 20h76l10 120H92l-12-80-12 80H32z' }, 'brown', { accent: true }),
    s('path', { d: 'M50 30l-8 104M58 30l-6 104M66 30v36M94 30v36M102 30l6 104M110 30l8 104', ...SW(2) }, 'tan', { stroke: true }),
    s('rect', { x: 42, y: 20, width: 76, height: 10 }, 'dark'),
    s('circle', { cx: 80, cy: 25, r: 3 }, 'yellow')
  ],
  parodia: [
    s('rect', { x: 26, y: 18, width: 108, height: 124, rx: 4 }, 'yellow'),
    s('rect', { x: 36, y: 28, width: 88, height: 104 }, 'sky'),
    s('path', { d: 'M52 132q0-30 28-30t28 30z' }, 'navy'),
    s('circle', { cx: 80, cy: 72, r: 24 }, 'skin'),
    s('path', { d: ring(70, 68, 7) + ring(90, 68, 7) + 'M77 68h6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 86q9-8 18 0 9-8 18 0-9 6-18 0-9 6-18 0z' }, 'black', { accent: true }),
    s('path', { d: dots([[80, 78]], 5) }, 'red')
  ],
  pascual: [
    s('path', { d: 'M14 128h132v12H14z' }, 'green'),
    s('path', { d: 'M54 106v24M70 108v22M94 108v22M110 106v24', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[50, 84], [64, 74], [80, 72], [96, 74], [110, 84], [62, 98], [80, 102], [98, 98], [80, 86]], 16) }, 'white', { accent: true }),
    s('path', { d: dots([[50, 84], [64, 74], [80, 72], [96, 74], [110, 84], [62, 98], [80, 102], [98, 98], [80, 86]], 16), ...SW(2) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 124, cy: 66, rx: 14, ry: 12 }, 'dark'),
    s('path', { d: dots([[128, 64]], 2) }, 'white'),
    s('path', { d: ells([[32, 36, 10, 13], [134, 30, 10, 13]]) }, 'pink'),
    s('path', { d: ells([[56, 26, 8, 10]]) }, 'yellow')
  ],
  piola: [
    s('rect', { x: 26, y: 70, width: 76, height: 60, rx: 4 }, 'tan'),
    s('path', { d: 'M64 70v60M26 100h76', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M64 70q-14-18-4-20t4 20q14-18 4-20t-4 20', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 124, cy: 104, r: 20 }, 'cream', { accent: true }),
    s('path', { d: 'M108 96q16 8 32-4M106 108q18 10 36-4M112 120q14 4 26-6', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M104 104q-6 30-36 26', ...SW(3) }, 'brown', { stroke: true })
  ],
  plaga: [
    s('path', { d: 'M14 120h132v26H14z' }, 'brown'),
    s('path', { d: 'M28 120V92M48 120V96M68 120V90M88 120V96M108 120V90M128 120V94', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: ells([[28, 88, 5, 9], [68, 86, 5, 9], [108, 86, 5, 9]]) }, 'yellow'),
    s('path', { d: ells([[40, 40, 12, 6], [80, 30, 12, 6], [118, 46, 12, 6], [60, 62, 12, 6], [104, 72, 12, 6]]) }, 'green', { accent: true }),
    s('path', { d: 'M34 46l-6 6M46 46l6 6M74 36l-6 6M86 36l6 6M112 52l-6 6M124 52l6 6M54 68l-6 6M66 68l6 6M98 78l-6 6M110 78l6 6', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: dots([[50, 40], [90, 30], [128, 46], [70, 62], [114, 72]], 3) }, 'dark')
  ],
  pronóstico: [
    s('rect', { x: 14, y: 22, width: 132, height: 100, rx: 8 }, 'navy'),
    s('rect', { x: 22, y: 30, width: 116, height: 84, rx: 4 }, 'sky'),
    s('circle', { cx: 66, cy: 60, r: 18 }, 'yellow', { accent: true }),
    s('path', { d: 'M62 96a14 14 0 0 1 8-26 20 20 0 0 1 36-4 14 14 0 0 1 10 30z' }, 'white'),
    s('path', { d: drop(76, 108, 3) + drop(92, 108, 3) + drop(108, 108, 3) }, 'blue'),
    s('path', { d: 'M60 122l-10 18M100 122l10 18', ...SW(5) }, 'dark', { stroke: true })
  ],
  puramente: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'mint'),
    s('path', { d: drop(80, 90, 32) }, 'sky', { accent: true }),
    s('path', { d: 'M66 84q0-14 8-22', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: sparkle(122, 44, 12) + sparkle(40, 50, 8) + sparkle(116, 116, 7) }, 'white')
  ],
  puño: [
    s('rect', { x: 50, y: 112, width: 52, height: 34, rx: 6 }, 'blue'),
    s('rect', { x: 40, y: 34, width: 80, height: 82, rx: 22 }, 'skin', { accent: true }),
    s('path', { d: 'M60 36v34M80 36v34M100 36v34', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M40 78h46q10 2 8 12t-14 10H42z' }, 'tan')
  ],
  recurrente: [
    s('path', { d: 'M46 84a14 14 0 0 1 8-26 20 20 0 0 1 36-4 14 14 0 0 1 12 30z' }, 'purple', { accent: true }),
    s('path', { d: 'M78 84l-8 16h10l-6 14', ...SW(4) }, 'yellow', { stroke: true }),
    arrow('M36 50a54 54 0 0 1 96 20M126 54l6 16 14-10', 'orange', 6),
    arrow('M124 112a54 54 0 0 1-96-20M34 108l-6-16-14 10', 'orange', 6)
  ],
  repertorio: [
    s('path', { d: 'M80 104v32M60 136h40', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 104l14-70h72l14 70z' }, 'dark'),
    s('rect', { x: 46, y: 28, width: 50, height: 66, rx: 2, transform: 'rotate(-6 71 61)' }, 'cream'),
    s('rect', { x: 64, y: 30, width: 50, height: 66, rx: 2, transform: 'rotate(6 89 63)' }, 'white'),
    s('path', { d: 'M70 48h38M68 62h38M66 76h38', ...SW(2), transform: 'rotate(6 89 63)' }, 'gray', { stroke: true }),
    ...note(82, 76, 'purple'),
    s('path', { d: dots([[102, 58]], 5) }, 'navy')
  ],
  restaurar: [
    s('path', { d: 'M58 30h44l-6 14q26 20 20 56-6 30-36 34-30-4-36-34-6-36 20-56z' }, 'blue', { accent: true }),
    s('path', { d: 'M62 60l12 14-6 16 16 14M102 70l-14 8', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M110 128l26-50', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M136 78l4-14 4 4z', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: sparkle(130, 40, 9) }, 'yellow')
  ],
  roble: [
    s('path', { d: 'M70 140l4-50h12l4 50z' }, 'brown'),
    s('path', { d: 'M80 98l-20-18M80 94l20-16', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: dots([[46, 70], [80, 50], [114, 70], [64, 44], [98, 40], [80, 84], [40, 52], [120, 50]], 24) }, 'green', { accent: true }),
    s('path', { d: ells([[38, 110, 8, 10], [122, 112, 8, 10]]) }, 'orange'),
    s('path', { d: ells([[38, 102, 10, 5], [122, 104, 10, 5]]) }, 'brown'),
    s('path', { d: 'M14 140h132', ...SW(4) }, 'green', { stroke: true })
  ],
  salarial: [
    s('rect', { x: 22, y: 50, width: 96, height: 64, rx: 4 }, 'tan'),
    s('rect', { x: 34, y: 30, width: 72, height: 40, rx: 3, transform: 'rotate(-6 70 50)' }, 'green', { accent: true }),
    s('circle', { cx: 70, cy: 48, r: 9 }, 'mint'),
    s('path', { d: 'M22 50l48 34 48-34v64H22z' }, 'cream'),
    s('path', { d: 'M22 50l48 34 48-34', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: ells([[124, 132, 16, 6], [124, 122, 16, 6], [124, 112, 16, 6]]) }, 'yellow'),
    arrow('M138 90V36M128 46l10-10 10 10', 'green', 5)
  ],
  siesta: [
    s('path', { d: 'M22 60v80M138 60v80', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M22 70q58 60 116 0', ...SW(14) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 46, cy: 88, r: 12 }, 'skin'),
    s('path', { d: 'M40 88q6 4 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 96q30 10 60 0', ...SW(14) }, 'blue', { stroke: true }),
    s('circle', { cx: 124, cy: 30, r: 14 }, 'yellow'),
    s('path', { d: ells([[70, 30, 6, 4], [86, 22, 8, 5]]) }, 'sky')
  ],
  sillón: [
    s('rect', { x: 36, y: 30, width: 88, height: 66, rx: 18 }, 'red', { accent: true }),
    s('rect', { x: 46, y: 84, width: 68, height: 26, rx: 8 }, 'pink'),
    s('rect', { x: 20, y: 70, width: 30, height: 56, rx: 12 }, 'red'),
    s('rect', { x: 110, y: 70, width: 30, height: 56, rx: 12 }, 'red'),
    s('rect', { x: 34, y: 106, width: 92, height: 22, rx: 6 }, 'red'),
    s('path', { d: 'M36 128v12M124 128v12', ...SW(6) }, 'brown', { stroke: true })
  ],
  sobreviviente: [
    s('path', { d: 'M14 96q11-8 22 0t22 0 22 0 22 0 22 0 22 0V146H14z' }, 'blue'),
    s('circle', { cx: 80, cy: 50, r: 13 }, 'skin'),
    s('rect', { x: 66, y: 64, width: 28, height: 40, rx: 10 }, 'green'),
    s('path', { d: 'M92 70l16-26', ...SW(6) }, 'skin', { stroke: true }),
    s('ellipse', { cx: 80, cy: 96, rx: 32, ry: 12, ...SW(12) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M56 88l6 14M104 88l-6 14', ...SW(12, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('path', { d: 'M14 112q11-6 22 0t22 0 22 0 22 0 22 0 22 0', ...SW(3) }, 'sky', { stroke: true })
  ],
  submarino: [
    s('path', { d: 'M14 40q11-6 22 0t22 0 22 0 22 0 22 0 22 0V146H14z' }, 'blue'),
    s('path', { d: 'M26 96a28 22 0 0 1 28-22h56a28 22 0 0 1 0 44H54a28 22 0 0 1-28-22z' }, 'yellow', { accent: true }),
    s('path', { d: 'M66 74V58h26v16z' }, 'orange'),
    s('path', { d: 'M84 58V42h8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[64, 96], [86, 96], [108, 96]], 6) }, 'sky'),
    s('path', { d: 'M26 96l-10-10v20z' }, 'orange')
  ],
  subvención: [
    s('rect', { x: 60, y: 126, width: 40, height: 22 }, 'blue'),
    s('path', { d: 'M28 110q0-8 10-8h84q10 0 10 8 0 18-30 22H58q-30-4-30-22z' }, 'skin'),
    s('path', { d: 'M60 104q-28-8-12-34 8-10 18-12h28q10 2 18 12 16 26-12 34z' }, 'green', { accent: true }),
    s('path', { d: 'M66 58l-6-14h40l-6 14z' }, 'green'),
    s('path', { d: 'M64 58h32', ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 84, r: 10 }, 'yellow'),
    arrow('M132 90V30M122 40l10-10 10 10', 'orange', 5)
  ],
  supresión: [
    ...paper(22, 22, 76, 100),
    s('path', { d: 'M34 42h52M34 62h52M34 82h52M34 102h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 62h64', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M108 82h36l-4 58h-28z' }, 'dark'),
    s('rect', { x: 104, y: 72, width: 44, height: 10, rx: 3 }, 'gray'),
    arrow('M90 62q24 0 28 6', 'red', 4)
  ],
  sustento: [
    s('path', { d: 'M22 96q0-40 46-40t46 40v8H22z' }, 'tan', { accent: true }),
    s('path', { d: 'M46 70l8 18M68 64v20M90 70l-8 18', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M22 104h92', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M90 112h56q-4 28-28 28t-28-28z' }, 'blue'),
    s('path', { d: 'M94 112q24-16 48 0z' }, 'white'),
    s('path', { d: 'M128 88l12-30M136 90l12-28', ...SW(3) }, 'brown', { stroke: true })
  ],
  tentación: [
    s('path', { d: 'M14 20h70', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M84 20v40', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M84 60v8a8 8 0 0 1-16 0', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 100, r: 30 }, 'pink', { accent: true }),
    s('circle', { cx: 80, cy: 100, r: 10 }, 'white'),
    s('path', { d: 'M64 86l4 3M92 84l-2 4M98 104l3 2M62 112l4-2M84 120l3-3', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: sparkle(122, 70, 10) + sparkle(36, 128, 8) }, 'yellow')
  ],
  tirada: [
    s('path', { d: rects([[30, 122, 100, 14], [26, 106, 100, 14], [32, 90, 100, 14], [28, 74, 100, 14]]) }, 'white'),
    s('path', { d: rects([[30, 122, 100, 14], [26, 106, 100, 14], [32, 90, 100, 14], [28, 74, 100, 14]]), ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 30, y: 24, width: 100, height: 48, rx: 2, transform: 'rotate(-4 80 48)' }, 'white'),
    s('rect', { x: 30, y: 24, width: 100, height: 48, rx: 2, transform: 'rotate(-4 80 48)', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 36h84M76 48h44M76 58h44', ...SW(4), transform: 'rotate(-4 80 48)' }, 'gray', { stroke: true }),
    s('rect', { x: 38, y: 44, width: 30, height: 22, transform: 'rotate(-4 80 48)' }, 'sky', { accent: true }),
    s('path', { d: 'M14 140h132', ...SW(4) }, 'brown', { stroke: true })
  ],
  tranquilamente: [
    s('path', { d: 'M14 104h132v42H14z' }, 'blue'),
    s('path', { d: 'M14 104h60v-6H14z' }, 'brown'),
    s('circle', { cx: 40, cy: 54, r: 11 }, 'skin'),
    s('path', { d: 'M28 98V74q0-8 12-8t12 8v24z' }, 'green', { accent: true }),
    s('path', { d: 'M50 80l28-46', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M78 34q30 10 40 86', ...SW(1.5) }, 'dark', { stroke: true }),
    s('path', { d: 'M104 120q14-5 28 0', ...SW(2) }, 'sky', { stroke: true }),
    s('circle', { cx: 128, cy: 30, r: 12 }, 'yellow')
  ],
  vagina: [
    s('rect', { x: 34, y: 66, width: 96, height: 28, rx: 14, transform: 'rotate(-30 80 80)' }, 'brown', { accent: true }),
    s('path', { d: 'M52 104l-26 15M44 92l-8-14 10-6 8 14', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 92l60-34', ...SW(4) }, 'tan', { stroke: true }),
    s('circle', { cx: 32, cy: 114, r: 4 }, 'yellow'),
    s('path', { d: 'M114 48l12-6-4 14z' }, 'yellow')
  ],
  viceversa: [
    s('rect', { x: 18, y: 56, width: 40, height: 40, rx: 6 }, 'blue', { accent: true }),
    s('circle', { cx: 122, cy: 76, r: 20 }, 'orange'),
    arrow('M44 46q36-32 72 0M104 34l12 12-16 4', 'green', 5),
    arrow('M116 108q-36 32-72 0M56 122l-12-14 16-2', 'purple', 5)
  ],
  aguja: [
    s('path', { d: 'M32 136L116 32', ...SW(7) }, 'gray', { stroke: true, accent: true }),
    s('ellipse', { cx: 110, cy: 40, rx: 2.5, ry: 7, transform: 'rotate(39 110 40)' }, 'white'),
    s('path', { d: 'M110 40q30 10 22 40t-40 50', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M24 46h40v40H24z' }, 'red'),
    s('path', { d: 'M18 42h52M18 90h52', ...SW(8) }, 'tan', { stroke: true }),
    s('path', { d: 'M26 56h36M26 66h36M26 76h36', ...SW(2) }, 'pink', { stroke: true })
  ],
  alejar: [
    ground(),
    ...person(34, 136, 'blue'),
    s('path', { d: 'M46 100h26', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 74, y: 84, width: 30, height: 30, rx: 3 }, 'orange', { accent: true }),
    s('rect', { x: 116, y: 104, width: 16, height: 16, rx: 2 }, 'tan'),
    arrow('M86 64h48M124 56l10 8-10 8', 'red', 4)
  ],
  amistoso: [
    ground(),
    ...person(52, 136, 'blue'),
    ...person(108, 136, 'orange'),
    s('path', { d: 'M64 104q16 6 32 0', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 40, 20) }, 'red', { accent: true })
  ],
  analista: [
    s('rect', { x: 52, y: 20, width: 92, height: 72, rx: 4 }, 'white'),
    outline({ x: 52, y: 20, width: 92, height: 72, rx: 4 }),
    s('path', { d: rects([[64, 62, 12, 22], [84, 48, 12, 36], [104, 36, 12, 48]]) }, 'blue', { accent: true }),
    s('path', { d: 'M62 54l22-14 20 6 30-24', ...SW(3) }, 'red', { stroke: true }),
    ...person(30, 140, 'green', { h: 40, w: 26, r: 11 }),
    s('path', { d: 'M40 106l24-20', ...SW(5) }, 'skin', { stroke: true })
  ],
  anfitrión: [
    s('rect', { x: 14, y: 22, width: 52, height: 114 }, 'brown'),
    s('rect', { x: 22, y: 30, width: 36, height: 106 }, 'cream'),
    ground(),
    ...person(90, 136, 'red', { accent: true }),
    s('path', { d: 'M104 102l18-10M122 92h22', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M116 88h32', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M122 86l-4-14h12zM138 86l-4-14h12z' }, 'pink')
  ],
  australiano: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M62 132q-30-6-50-30', ...SW(9) }, 'brown', { stroke: true }),
    s('path', { d: 'M58 126q-8-50 26-72 18-10 24 6l-4 50q-6 18-26 20z' }, 'brown', { accent: true }),
    s('path', { d: 'M98 64q4-26 18-28 12 4 18 16l-14 8z' }, 'brown'),
    s('path', { d: 'M104 38l-2-18 10 14M114 36l4-18 4 18', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 80l12 10M72 130h24', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 100q10 6 20 0', ...SW(3) }, 'tan', { stroke: true }),
    s('circle', { cx: 118, cy: 46, r: 3 }, 'dark')
  ],
  barca: [
    s('path', { d: 'M14 108q11-8 22 0t22 0 22 0 22 0 22 0 22 0V146H14z' }, 'blue'),
    s('path', { d: 'M20 82h120l-18 32H38z' }, 'brown', { accent: true }),
    s('path', { d: 'M20 82h120', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: 'M30 62l30 64M130 62l-30 64', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: ells([[60, 128, 6, 4], [100, 128, 6, 4]]) }, 'tan'),
    s('circle', { cx: 124, cy: 34, r: 12 }, 'yellow')
  ],
  burbuja: [
    s('circle', { cx: 66, cy: 82, r: 40 }, 'sky', { accent: true }),
    s('circle', { cx: 116, cy: 48, r: 22 }, 'mint'),
    s('circle', { cx: 118, cy: 116, r: 16 }, 'pink'),
    s('circle', { cx: 32, cy: 32, r: 12 }, 'purple'),
    s('path', { d: 'M42 72q4-18 22-22M104 40q4-8 12-10M110 110q2-5 6-6', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: ring(66, 82, 40) + ring(116, 48, 22) + ring(118, 116, 16) + ring(32, 32, 12), ...SW(2) }, 'blue', { stroke: true })
  ],
  buscador: [
    s('rect', { x: 14, y: 22, width: 132, height: 116, rx: 10 }, 'gray'),
    s('rect', { x: 20, y: 38, width: 120, height: 94, rx: 4 }, 'white'),
    s('path', { d: dots([[24, 30], [34, 30], [44, 30]], 3) }, 'red'),
    s('rect', { x: 30, y: 56, width: 100, height: 22, rx: 11, ...SW(3) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: ring(112, 66, 5) + 'M116 70l5 5', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M36 96h80M36 108h60M36 120h70', ...SW(4) }, 'gray', { stroke: true })
  ],
  combinar: [
    s('path', { d: drop(36, 50, 18) }, 'blue'),
    s('path', { d: drop(124, 50, 18) }, 'yellow'),
    arrow('M48 70q20 26 26 36M112 70q-20 26-26 36', 'gray', 5),
    s('path', { d: drop(80, 122, 18) }, 'green', { accent: true })
  ],
  comicios: [
    s('rect', { x: 30, y: 70, width: 100, height: 70, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 30, y: 62, width: 100, height: 14, rx: 3 }, 'navy'),
    s('rect', { x: 60, y: 66, width: 40, height: 5, rx: 2 }, 'black'),
    s('rect', { x: 64, y: 20, width: 32, height: 46, rx: 2, transform: 'rotate(-8 80 43)' }, 'white'),
    s('path', { d: 'M70 32l6 6 12-12', ...SW(4), transform: 'rotate(-8 80 43)' }, 'green', { stroke: true }),
    s('path', { d: 'M64 20h32v46H64z', ...SW(2), transform: 'rotate(-8 80 43)' }, 'gray', { stroke: true }),
    s('path', { d: 'M44 100h72', ...SW(3) }, 'white', { stroke: true })
  ],
  competitividad: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M132 30v106', ...DASH(4, '8 6') }, 'red', { stroke: true }),
    ...lean(52, 136, 18, 'blue'),
    ...lean(92, 136, 18, 'orange', { accent: true }),
    s('path', { d: 'M60 100l16-6M102 100l16-6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M18 74h16M22 90h14M58 74h16', ...SW(3) }, 'gray', { stroke: true })
  ],
  contienda: [
    s('path', { d: burst(80, 66, 34, 18, 10) }, 'yellow'),
    s('path', { d: 'M34 130L120 34M126 130L40 34', ...SW(6) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: 'M38 114l12 12M122 114l-12 12', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M24 142l14-14M136 142l-14-14', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: dots([[22, 144], [138, 144]], 4) }, 'yellow')
  ],
  cólera: [
    ...face(80, 88, 48, 'red', 'frown', { accent: true }),
    s('path', { d: 'M52 68l18 8M108 68l-18 8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 30q-8 8 0 14t0 14M120 30q8 8 0 14t0 14', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 16v18M68 22l6 10M92 22l-6 10', ...SW(4) }, 'orange', { stroke: true })
  ],
  enano: [
    s('path', { d: 'M56 52l24-40 24 40z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 62, r: 14 }, 'skin'),
    s('path', { d: 'M64 64q16 44 32 0q-8 8-16 8t-16-8z' }, 'white'),
    s('path', { d: 'M64 64q16 44 32 0', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 62, y: 92, width: 36, height: 34, rx: 10 }, 'blue'),
    s('path', { d: 'M68 126v10M92 126v10', ...SW(8) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 64, r: 4 }, 'pink'),
    s('path', { d: 'M110 136h10v-18h-10z' }, 'cream'),
    s('path', { d: 'M98 120a17 14 0 0 1 34 0z' }, 'orange')
  ],
  fascinante: [
    s('circle', { cx: 80, cy: 84, r: 50 }, 'yellow'),
    s('path', { d: star(60, 74, 15) + star(100, 74, 15) }, 'orange', { accent: true }),
    s('path', { d: 'M62 104q18 22 36 0z' }, 'dark'),
    s('path', { d: sparkle(24, 30, 10) + sparkle(136, 30, 10) + sparkle(140, 130, 7) }, 'purple')
  ],
  filme: [
    s('circle', { cx: 56, cy: 66, r: 40 }, 'dark', { accent: true }),
    s('path', { d: dots([[56, 44], [56, 88], [34, 66], [78, 66]], 9) }, 'gray'),
    s('circle', { cx: 56, cy: 66, r: 5 }, 'gray'),
    s('path', { d: 'M74 102l70 18-8 26-70-18z' }, 'black'),
    s('path', { d: rects([[86, 112, 12, 12], [104, 116, 12, 12], [122, 121, 12, 12]]), transform: 'rotate(15 110 122)' }, 'sky'),
    s('path', { d: 'M96 70q16 0 20 30', ...SW(3) }, 'dark', { stroke: true })
  ],
  generalizar: [
    s('circle', { cx: 30, cy: 80, r: 12 }, 'orange', { accent: true }),
    arrow('M46 80h22M46 72l22-28M46 88l22 28', 'gray', 4),
    s('path', { d: dots([[86, 36], [108, 36], [130, 36], [86, 58], [108, 58], [130, 58], [86, 80], [108, 80], [130, 80], [86, 102], [108, 102], [130, 102], [86, 124], [108, 124], [130, 124]], 9) }, 'orange')
  ],
  gratitud: [
    s('path', { d: 'M18 134q14-30 46-30l20 6-6 12H58', ...SW(9) }, 'skin', { stroke: true }),
    s('rect', { x: 64, y: 76, width: 50, height: 40, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M89 76v40M64 96h50', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M89 76q-14-16-20-6t20 6q14-16 20-6t-20 6', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: heart(112, 40, 14) + heart(136, 58, 8) }, 'pink')
  ],
  grey: [
    s('path', { d: 'M14 128h132v12H14z' }, 'green'),
    s('path', { d: ells([[40, 104, 18, 13], [76, 110, 18, 13], [106, 98, 18, 13]]) }, 'white'),
    s('path', { d: ells([[40, 104, 18, 13], [76, 110, 18, 13], [106, 98, 18, 13]]), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: ells([[24, 98, 6, 5], [60, 104, 6, 5], [122, 92, 6, 5]]) }, 'dark'),
    s('path', { d: 'M34 116v12M48 116v12M70 122v8M84 122v8M100 110v18M114 110v18', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M132 128V44q0-16-12-16t-10 12', ...SW(5) }, 'brown', { stroke: true, accent: true })
  ],
  honorario: [
    s('rect', { x: 18, y: 62, width: 76, height: 58, rx: 6 }, 'brown'),
    s('path', { d: 'M42 62v-10h28v10', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M18 84h76', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 50, y: 80, width: 12, height: 10 }, 'yellow'),
    s('path', { d: ells([[122, 130, 18, 6], [122, 120, 18, 6], [122, 110, 18, 6], [122, 100, 18, 6]]) }, 'yellow', { accent: true }),
    s('rect', { x: 92, y: 28, width: 50, height: 30, rx: 3, transform: 'rotate(-10 117 43)' }, 'green'),
    s('circle', { cx: 117, cy: 43, r: 7 }, 'mint')
  ],
  infante: [
    s('path', { d: 'M62 50l-2-22 10 10 10-14 10 14 10-10-2 22z' }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 66, r: 16 }, 'skin'),
    s('path', { d: dots([[74, 64], [86, 64]], 2) }, 'dark'),
    s('path', { d: 'M60 136l6-50h28l6 50z' }, 'blue'),
    s('path', { d: 'M56 86q24 10 48 0l6 54-10-4-20 6-20-6-10 4z' }, 'red'),
    s('path', { d: 'M66 88h28', ...SW(4) }, 'white', { stroke: true })
  ],
  infarto: [
    s('path', { d: heart(80, 84, 40) }, 'red', { accent: true }),
    s('path', { d: 'M86 30l-12 24 14 8-12 26', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M14 136h36l8-14 10 22 10-30 8 22h60', ...SW(4) }, 'dark', { stroke: true })
  ],
  infeliz: [
    ...face(80, 96, 42, 'sky', 'frown', { accent: true }),
    s('path', { d: 'M40 44a14 14 0 0 1 8-24 20 20 0 0 1 36-4 14 14 0 0 1 12 28z' }, 'gray'),
    s('path', { d: 'M54 50l-4 8M70 50l-4 8M86 50l-4 8', ...SW(3) }, 'blue', { stroke: true })
  ],
  ladrillo: [
    s('path', { d: rects([[18, 112, 60, 26], [82, 112, 60, 26], [50, 82, 60, 26]]) }, 'red', { accent: true }),
    s('path', { d: rects([[18, 112, 60, 8], [82, 112, 60, 8], [50, 82, 60, 8]]) }, 'orange'),
    s('path', { d: 'M18 140h124', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 64, y: 42, width: 60, height: 26, transform: 'rotate(-12 94 55)' }, 'red'),
    s('path', { d: 'M74 58l12-2M100 52l12-3', ...SW(4) }, 'brown', { stroke: true })
  ],
  living: [
    s('rect', { x: 14, y: 128, width: 132, height: 10, rx: 4 }, 'tan'),
    s('rect', { x: 30, y: 82, width: 96, height: 30, rx: 8 }, 'green', { accent: true }),
    s('rect', { x: 24, y: 100, width: 108, height: 22, rx: 8 }, 'green'),
    s('path', { d: 'M78 84v28', ...SW(2) }, 'mint', { stroke: true }),
    s('path', { d: 'M30 122v8M126 122v8', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 52, y: 26, width: 52, height: 36, rx: 2 }, 'yellow'),
    s('path', { d: 'M58 56l14-16 10 10 6-6 12 12z' }, 'blue'),
    s('path', { d: 'M140 128V52', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M128 56l6-20h12l6 20z' }, 'orange')
  ],
  llano: [
    s('rect', { x: 14, y: 14, width: 132, height: 84, rx: 0 }, 'sky'),
    s('path', { d: 'M14 98h132v48H14z' }, 'green', { accent: true }),
    s('path', { d: 'M14 98h132', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 120h20M90 134h24M60 112h14', ...SW(3) }, 'mint', { stroke: true }),
    s('circle', { cx: 42, cy: 44, r: 14 }, 'yellow'),
    s('path', { d: 'M118 98V80', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 118, cy: 74, r: 10 }, 'green')
  ],
  láser: [
    s('rect', { x: 14, y: 66, width: 44, height: 28, rx: 6 }, 'dark'),
    s('rect', { x: 58, y: 72, width: 10, height: 16 }, 'gray'),
    s('path', { d: 'M68 80h58', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M68 80h58', ...SW(1.5) }, 'white', { stroke: true }),
    s('path', { d: burst(128, 80, 18, 7, 8) }, 'yellow'),
    s('rect', { x: 140, y: 40, width: 6, height: 80 }, 'gray')
  ],
  magistrado: [
    s('path', { d: 'M40 140q0-50 40-50t40 50z' }, 'black', { accent: true }),
    s('path', { d: 'M72 92l8 14 8-14z' }, 'white'),
    s('circle', { cx: 80, cy: 66, r: 20 }, 'skin'),
    s('path', { d: 'M58 66q0-28 22-28t22 28q-4-16-22-16t-22 16z' }, 'white'),
    s('path', { d: 'M58 66q0-28 22-28t22 28', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 112, y: 92, width: 30, height: 14, rx: 4, transform: 'rotate(-30 127 99)' }, 'brown'),
    s('path', { d: 'M126 100l10 20', ...SW(5) }, 'brown', { stroke: true })
  ],
  manuscrito: [
    s('rect', { x: 28, y: 20, width: 84, height: 116, rx: 3 }, 'cream'),
    s('rect', { x: 28, y: 20, width: 84, height: 116, rx: 3, ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M38 42q6-6 12 0t12 0 12 0 12 0 12 0M38 62q6-6 12 0t12 0 12 0 12 0 12 0M38 82q6-6 12 0t12 0 12 0 12 0 12 0M38 102q6-6 12 0t12 0 12 0', ...SW(2.5) }, 'navy', { stroke: true }),
    s('path', { d: 'M100 120q20-60 44-90-8 40-40 92z' }, 'white', { accent: true }),
    s('path', { d: 'M100 120q20-60 44-90-8 40-40 92z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 120l-4 10', ...SW(3) }, 'dark', { stroke: true })
  ],
  matiz: [
    s('path', { d: rects([[18, 30, 20, 100]]) }, 'sky'),
    s('path', { d: rects([[42, 30, 20, 100]]) }, 'blue', { accent: true }),
    s('path', { d: rects([[66, 30, 20, 100]]) }, 'navy'),
    s('path', { d: rects([[90, 30, 20, 100]]) }, 'purple'),
    s('path', { d: rects([[114, 30, 20, 100]]) }, 'pink'),
    s('path', { d: 'M118 142l26-30', ...SW(6) }, 'brown', { stroke: true })
  ],
  mercantil: [
    s('rect', { x: 18, y: 52, width: 48, height: 40, rx: 3 }, 'tan', { accent: true }),
    s('path', { d: 'M18 64h48M42 52v40', ...SW(3) }, 'brown', { stroke: true }),
    s('circle', { cx: 118, cy: 72, r: 22 }, 'yellow'),
    s('circle', { cx: 118, cy: 72, r: 14, ...SW(3) }, 'orange', { stroke: true }),
    arrow('M50 106q30 26 60 0M98 102l12 4-2 12', 'green', 5),
    arrow('M110 40q-30-26-60 0M62 44l-12-4 2-12', 'blue', 5)
  ],
  mármol: [
    s('path', { d: 'M24 52l56-22 56 22v68l-56 22-56-22z' }, 'white', { accent: true }),
    s('path', { d: 'M24 52l56 22 56-22M80 74v68', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 52l56-22 56 22v68l-56 22-56-22z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 70q12 10 10 24t14 26M92 92q14-4 20 8t16 6M60 46q14 4 30-4', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(124, 30, 8) }, 'sky')
  ],
  narco: [
    backdrop('navy'),
    s('path', { d: 'M60 56q-30 40-22 74 2 8 10 8h64q8 0 10-8 8-34-22-74z' }, 'white', { accent: true }),
    s('path', { d: 'M60 56l-8-20h56l-8 20z' }, 'white'),
    s('path', { d: 'M58 56h44', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: 'M60 104h40', ...SW(10) }, 'red', { stroke: true }),
    s('path', { d: ring(118, 40, 10) + ring(136, 56, 8) + 'M126 46l4 4', ...SW(4) }, 'gray', { stroke: true })
  ],
  nudo: [
    s('path', { d: 'M14 70q30 0 46 10', ...SW(10) }, 'tan', { stroke: true }),
    s('path', { d: 'M146 90q-30 0-46-10', ...SW(10) }, 'tan', { stroke: true }),
    s('path', { d: 'M60 80q20 30 40 0t-20-30-20 30', ...SW(10) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M18 70h8M30 72h8M122 88h8M134 90h8', ...SW(2) }, 'brown', { stroke: true })
  ],
  ofensivo: [
    ...person(36, 140, 'red', { h: 40, w: 26, r: 11 }),
    s('path', { d: burst(98, 60, 46, 30, 12) }, 'red', { accent: true }),
    s('path', { d: 'M82 50l10 10-10 10M114 50l-10 10 10 10', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M52 104l14-20', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M80 100l-16 16', ...SW(4) }, 'red', { stroke: true })
  ],
  ordinario: [
    s('path', { d: 'M14 104h132v30H14z' }, 'tan'),
    s('path', { d: 'M14 104l10 30M50 104v30M80 104v30M110 104v30M146 104l-10 30', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: ells([[34, 92, 14, 18], [64, 92, 14, 18], [96, 92, 14, 18], [126, 92, 14, 18]]) }, 'cream', { accent: true }),
    s('path', { d: ells([[34, 92, 14, 18], [64, 92, 14, 18], [96, 92, 14, 18], [126, 92, 14, 18]]), ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: ells([[50, 48, 14, 18], [80, 48, 14, 18], [110, 48, 14, 18]]) }, 'cream'),
    s('path', { d: ells([[50, 48, 14, 18], [80, 48, 14, 18], [110, 48, 14, 18]]), ...SW(2) }, 'tan', { stroke: true })
  ],
  percibir: [
    s('path', { d: 'M18 80q48-44 96 0q-48 44-96 0z' }, 'white'),
    s('path', { d: 'M18 80q48-44 96 0q-48 44-96 0z', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 66, cy: 80, r: 18 }, 'green', { accent: true }),
    s('circle', { cx: 66, cy: 80, r: 8 }, 'black'),
    s('path', { d: 'M124 58q12 22 0 44M136 46q18 34 0 68', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: sparkle(30, 34, 8) + sparkle(110, 130, 7) }, 'yellow')
  ],
  procesión: [
    ground(),
    s('path', { d: dots([[32, 95], [64, 95], [96, 95], [128, 95]], 9) }, 'skin'),
    s('path', { d: 'M22 136l4-30h12l4 30zM86 136l4-30h12l4 30zM118 136l4-30h12l4 30z' }, 'purple'),
    s('path', { d: 'M54 136l4-30h12l4 30z' }, 'purple', { accent: true }),
    s('path', { d: 'M40 116l4-4v-30M72 116l4-4v-30M104 116l4-4v-30M136 116l4-4v-30', ...SW(3) }, 'cream', { stroke: true }),
    s('path', { d: drop(44, 74, 4) + drop(76, 74, 4) + drop(108, 74, 4) + drop(140, 74, 4) }, 'orange')
  ],
  pulmón: [
    s('path', { d: 'M72 50q-20-8-34 14-18 30-16 64 2 12 16 10 26-4 34-20z' }, 'pink', { accent: true }),
    s('path', { d: 'M88 50q20-8 34 14 18 30 16 64-2 12-16 10-26-4-34-20z' }, 'pink'),
    s('path', { d: 'M80 18v48M80 66l-18 16M80 66l18 16', ...SW(7) }, 'red', { stroke: true }),
    s('path', { d: 'M54 92l-12 10M50 112l-8 4M106 92l12 10M110 112l8 4', ...SW(3) }, 'red', { stroke: true })
  ],
  punk: [
    s('path', { d: 'M62 50l4-26 6 18 8-24 8 24 6-18 4 26z' }, 'pink', { accent: true }),
    s('circle', { cx: 80, cy: 62, r: 15 }, 'skin'),
    s('path', { d: 'M56 136V92q0-14 24-14t24 14v44z' }, 'black'),
    s('path', { d: 'M62 92l6 4M98 92l-6 4M70 104l4 0M86 104l4 0', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 126l70-40 10 10-66 46z' }, 'red'),
    s('path', { d: 'M110 86l20-14', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[56, 118]], 9) }, 'red')
  ],
  racial: [
    s('path', { d: 'M28 140V86q0-6 6-6t6 6V70q0-6 6-6t6 6v70z' }, 'skin', { accent: true }),
    s('path', { d: 'M62 140V60q0-6 6-6t6 6V44q0-6 6-6t6 6v96z' }, 'tan'),
    s('path', { d: 'M98 140V78q0-6 6-6t6 6V62q0-6 6-6t6 6v78z' }, 'brown'),
    s('path', { d: heart(80, 22, 10) }, 'red')
  ],
  seleccionar: [
    s('path', { d: rects([[16, 40, 36, 50], [108, 40, 36, 50]]) }, 'gray'),
    s('rect', { x: 60, y: 30, width: 40, height: 60, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: 'M68 60l8 8 16-18', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M84 98l0 46 12-12 10 18 8-4-10-18 16-2z' }, 'white'),
    s('path', { d: 'M84 98l0 46 12-12 10 18 8-4-10-18 16-2z', ...SW(3) }, 'dark', { stroke: true })
  ],
  simbólico: [
    backdrop('sky'),
    s('path', { d: 'M40 86q10-30 44-24l26-22q6 10 0 24 22 6 26 22-24-4-34 6-20 18-46 6l-24 10z' }, 'white', { accent: true }),
    s('path', { d: 'M40 86q10-30 44-24l26-22q6 10 0 24 22 6 26 22-24-4-34 6-20 18-46 6l-24 10z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M106 62l8-4-6 8z' }, 'orange'),
    s('path', { d: 'M114 70q8 18 20 18', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(122, 80, 60, 10, 4) + leaflet(130, 86, -30, 10, 4) }, 'green')
  ],
  socialmente: [
    s('path', { d: 'M80 80L36 44M80 80L124 44M80 80L36 116M80 80L124 116M36 44h88M36 116h88', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 16 }, 'orange', { accent: true }),
    s('path', { d: dots([[36, 44], [124, 44], [36, 116], [124, 116]], 14) }, 'blue'),
    s('path', { d: dots([[80, 74], [36, 40], [124, 40], [36, 112], [124, 112]], 5) }, 'skin')
  ],
  tumor: [
    s('path', { d: 'M40 40q40-20 80 0 20 40 0 80-40 20-80 0-20-40 0-80z' }, 'pink'),
    s('path', { d: 'M54 60q20 10 10 30M100 50q-6 20 10 30', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M88 96q4-12 14-8 12 2 10 14-2 12-14 10-12-2-10-16z' }, 'purple', { accent: true }),
    s('circle', { cx: 100, cy: 100, r: 24, ...DASH(3, '5 5') }, 'dark', { stroke: true })
  ],
  usual: [
    s('rect', { x: 18, y: 28, width: 124, height: 112, rx: 8 }, 'white'),
    outline({ x: 18, y: 28, width: 124, height: 112, rx: 8 }),
    s('path', { d: 'M18 36q0-8 8-8h108q8 0 8 8v14H18z' }, 'red', { accent: true }),
    s('path', { d: 'M46 20v16M114 20v16', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[38, 70], [64, 70], [90, 70], [116, 70], [38, 96], [64, 96], [90, 96], [116, 96], [38, 122], [64, 122]], 8) }, 'orange'),
    s('path', { d: dots([[90, 122], [116, 122]], 8) }, 'gray')
  ],
  veterano: [
    s('path', { d: 'M44 140q0-46 36-46t36 46z' }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 70, r: 20 }, 'skin'),
    s('path', { d: 'M58 62q0-22 22-22t22 22z' }, 'green'),
    s('path', { d: 'M68 80q12-6 24 0', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 110h10v8h-10zM74 110h10v8h-10z' }, 'red'),
    s('path', { d: dots([[65, 124], [79, 124]], 4) }, 'yellow'),
    s('path', { d: 'M124 140V100q0-8 8-8', ...SW(5) }, 'brown', { stroke: true })
  ],
  órbita: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('ellipse', { cx: 80, cy: 80, rx: 58, ry: 28, transform: 'rotate(-20 80 80)', ...DASH(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 24 }, 'blue', { accent: true }),
    s('path', { d: 'M62 70q10 6 16-4t16 0M66 92q10-6 20 2', ...SW(4) }, 'green', { stroke: true }),
    s('rect', { x: 124, y: 54, width: 10, height: 10 }, 'gray'),
    s('path', { d: 'M114 59h30', ...SW(5) }, 'sky', { stroke: true })
  ],
  ajustar: [
    s('path', { d: 'M36 128l62-62', ...SW(16) }, 'gray', { stroke: true, accent: true }),
    s('circle', { cx: 104, cy: 58, r: 22 }, 'gray'),
    s('path', { d: 'M110 30l20 20-12 12-20-20z' }, 'white'),
    s('polygon', { points: '108,40 120,40 126,51 120,62 108,62 102,51' }, 'dark'),
    s('path', { d: dots([[36, 128]], 5) }, 'dark'),
    arrow('M140 82a40 40 0 0 1-30 36M106 108l4 10 10-4', 'orange', 5)
  ],
  alterar: [
    s('rect', { x: 16, y: 56, width: 44, height: 44, rx: 4 }, 'blue'),
    arrow('M68 78h24M84 70l8 8-8 8', 'gray', 5),
    s('path', { d: star(122, 78, 26) }, 'orange', { accent: true }),
    s('path', { d: sparkle(122, 30, 8) + sparkle(30, 128, 6) + sparkle(130, 126, 7) }, 'purple')
  ],
  amoroso: [
    s('path', { d: dots([[54, 38], [106, 38]], 13) }, 'brown'),
    s('circle', { cx: 80, cy: 60, r: 30 }, 'brown'),
    s('ellipse', { cx: 80, cy: 112, rx: 36, ry: 32 }, 'brown'),
    s('ellipse', { cx: 80, cy: 70, rx: 12, ry: 9 }, 'tan'),
    s('path', { d: dots([[68, 54], [92, 54], [80, 66]], 3.5) }, 'dark'),
    s('path', { d: heart(80, 112, 26) }, 'red', { accent: true }),
    s('path', { d: heart(130, 40, 10) + heart(28, 80, 7) }, 'pink')
  ],
  amén: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'cream'),
    s('path', { d: rays(80, 76, 50, 60, 12), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M80 30q-18 20-20 60l-8 18 28 12z' }, 'skin', { accent: true }),
    s('path', { d: 'M80 30q18 20 20 60l8 18-28 12z' }, 'tan'),
    s('path', { d: 'M52 108l-6 22h34M108 108l6 22H80', ...SW(10) }, 'blue', { stroke: true })
  ],
  animado: [
    s('ellipse', { cx: 80, cy: 46, rx: 18, ry: 22 }, 'yellow', { accent: true }),
    s('ellipse', { cx: 44, cy: 56, rx: 18, ry: 22 }, 'red'),
    s('ellipse', { cx: 116, cy: 52, rx: 18, ry: 22 }, 'blue'),
    s('path', { d: 'M44 78q6 20-2 50M80 68q-6 24 2 60M116 74q6 20-2 54', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: rects([[20, 104, 6, 10], [134, 110, 6, 10], [60, 120, 6, 10], [100, 96, 6, 10]]) }, 'green'),
    s('path', { d: rects([[30, 130, 8, 6], [120, 136, 8, 6], [96, 128, 8, 6], [56, 92, 8, 6]]) }, 'purple')
  ],
  apodo: [
    ground(),
    ...person(36, 136, 'green'),
    s('path', { d: bubble(62, 20, 82, 64) }, 'white'),
    s('path', { d: bubble(62, 20, 82, 64), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[88, 36], [118, 36]], 8) }, 'brown'),
    s('circle', { cx: 103, cy: 52, r: 18 }, 'brown', { accent: true }),
    s('path', { d: dots([[96, 48], [110, 48]], 2.5) + dots([[103, 58]], 4) }, 'dark')
  ],
  armamento: [
    s('path', { d: 'M30 96l84-34 8 18-84 30z' }, 'dark', { accent: true }),
    s('path', { d: dots([[116, 70]], 9) }, 'dark'),
    s('circle', { cx: 52, cy: 110, r: 22 }, 'brown'),
    s('circle', { cx: 52, cy: 110, r: 8 }, 'tan'),
    s('path', { d: 'M52 88v44M30 110h44', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: dots([[104, 130], [124, 130], [114, 114]], 9) }, 'black'),
    s('path', { d: 'M14 140h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  aroma: [
    s('path', { d: 'M38 84h70v24q0 28-35 28t-35-28z' }, 'white'),
    s('path', { d: 'M38 84h70v24q0 28-35 28t-35-28zM108 92q20 0 18 16t-20 12', ...SW(4) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 73, cy: 86, rx: 32, ry: 5 }, 'brown', { accent: true }),
    s('path', { d: 'M56 72q-10-12 0-24t0-26M74 72q-10-12 0-24t0-26M92 72q-10-12 0-24t0-26', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 142h112', ...SW(4) }, 'tan', { stroke: true })
  ],
  aterrizaje: [
    s('path', { d: 'M14 128h132v16H14z' }, 'dark'),
    s('path', { d: 'M24 136h18M58 136h18M92 136h18M126 136h14', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M30 66q0-8 12-8h70l18-18h10l-6 28q-2 10-14 10H44q-14 0-14-12z', transform: 'rotate(-10 80 70)' }, 'white', { accent: true }),
    s('path', { d: 'M30 66q0-8 12-8h70l18-18h10l-6 28q-2 10-14 10H44q-14 0-14-12z', ...SW(3), transform: 'rotate(-10 80 70)' }, 'blue', { stroke: true }),
    s('path', { d: 'M62 84l20-6 18 22z', transform: 'rotate(-10 80 70)' }, 'blue'),
    s('path', { d: 'M54 86v14M98 92v14', ...SW(4) }, 'dark', { stroke: true })
  ],
  beneficiar: [
    s('path', { d: 'M14 128h132v14H14z' }, 'brown'),
    s('path', { d: 'M100 128V96', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(100, 108, -150, 26, 9) + leaflet(100, 100, -30, 26, 9) }, 'green', { accent: true }),
    s('path', { d: 'M22 40h44l-6 34H28z' }, 'blue'),
    s('path', { d: 'M60 52l26 14', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M28 40q14-18 30 0', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: drop(94, 80, 3) + drop(102, 86, 3) + drop(90, 92, 3) }, 'sky')
  ],
  burocracia: [
    s('path', { d: rects([[30, 118, 70, 10], [34, 106, 70, 10], [28, 94, 70, 10], [32, 82, 70, 10], [30, 70, 70, 10], [34, 58, 70, 10], [30, 46, 70, 10]]) }, 'white'),
    s('path', { d: rects([[30, 118, 70, 10], [34, 106, 70, 10], [28, 94, 70, 10], [32, 82, 70, 10], [30, 70, 70, 10], [34, 58, 70, 10], [30, 46, 70, 10]]), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 130h132', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 106, y: 90, width: 30, height: 12, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M121 90V64', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 121, cy: 60, r: 9 }, 'brown'),
    s('circle', { cx: 66, cy: 36, r: 8, ...SW(3) }, 'red', { stroke: true })
  ],
  cabida: [
    s('path', { d: 'M40 30h80v100q0 10-10 10H50q-10 0-10-10z' }, 'white'),
    s('path', { d: 'M40 70h80v60q0 10-10 10H50q-10 0-10-10z' }, 'sky', { accent: true }),
    s('path', { d: 'M40 30v100q0 10 10 10h60q10 0 10-10V30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 50h14M40 70h20M40 90h14M40 110h20', ...SW(3) }, 'dark', { stroke: true }),
    arrow('M136 132V36M128 44l8-8 8 8M128 124l8 8 8-8', 'orange', 4)
  ],
  cagada: [
    s('ellipse', { cx: 80, cy: 124, rx: 60, ry: 14 }, 'gray'),
    s('path', { d: 'M40 118q-10-14 6-20 2-14 18-12 6-12 18-6 14-4 16 10 18 0 16 16 10 10-2 16z' }, 'red', { accent: true }),
    s('path', { d: dots([[30, 98], [122, 88], [112, 70], [38, 74]], 5) }, 'red'),
    s('path', { d: 'M84 34h36l-6 40H90z', transform: 'rotate(40 102 54)' }, 'blue'),
    s('path', { d: 'M88 50q-10 -26 26-14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 38l8 8M24 54h10M44 26v10', ...SW(3) }, 'orange', { stroke: true })
  ],
  calificar: [
    ...paper(26, 18, 84, 116),
    s('path', { d: 'M38 42h48M38 62h48M38 82h48M38 102h32', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M90 38l4 4 8-8M90 58l4 4 8-8M90 78l4 4 8-8', ...SW(3) }, 'red', { stroke: true }),
    s('circle', { cx: 112, cy: 112, r: 22, ...SW(4) }, 'red', { stroke: true, accent: true }),
    s('path', { d: star(112, 112, 11) }, 'red'),
    s('path', { d: 'M132 50l10-30', ...SW(6) }, 'red', { stroke: true })
  ],
  clasificar: [
    s('path', { d: 'M18 104h36l-4 36H22zM62 104h36l-4 36H66zM106 104h36l-4 36h-28z' }, 'gray'),
    s('circle', { cx: 36, cy: 92, r: 10 }, 'red'),
    s('rect', { x: 70, y: 82, width: 20, height: 20 }, 'blue', { accent: true }),
    s('polygon', { points: '124,80 136,102 112,102' }, 'green'),
    s('circle', { cx: 50, cy: 40, r: 10 }, 'red'),
    s('rect', { x: 92, y: 24, width: 20, height: 20 }, 'blue'),
    arrow('M50 54l-10 22M102 50l-20 24M120 36l6 34', 'gray', 3)
  ],
  coherencia: [
    s('rect', { x: 14, y: 64, width: 52, height: 32, rx: 16, transform: 'rotate(-20 40 80)', ...SW(10) }, 'gray', { stroke: true }),
    s('rect', { x: 54, y: 64, width: 52, height: 32, rx: 16, transform: 'rotate(20 80 80)', ...SW(10) }, 'yellow', { stroke: true, accent: true }),
    s('rect', { x: 94, y: 64, width: 52, height: 32, rx: 16, transform: 'rotate(-20 120 80)', ...SW(10) }, 'gray', { stroke: true })
  ],
  colmo: [
    s('path', { d: 'M44 40h72l-10 94H54z' }, 'sky'),
    s('path', { d: 'M44 40h72l-10 94H54z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 40q40-20 80 0' }, 'blue', { accent: true }),
    s('path', { d: 'M118 40q10 6 8 30M42 40q-10 10-6 40', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: drop(126, 90, 5) + drop(34, 102, 5) }, 'blue'),
    s('path', { d: 'M24 140h112', ...SW(3) }, 'blue', { stroke: true })
  ],
  comunión: [
    s('path', { d: 'M48 30h64q0 40-32 46-32-6-32-46z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 76v40M58 124h44', ...SW(8) }, 'yellow', { stroke: true }),
    s('path', { d: 'M52 38h56q-2 18-28 22-26-4-28-22z' }, 'red'),
    s('circle', { cx: 120, cy: 112, r: 18 }, 'white'),
    s('circle', { cx: 120, cy: 112, r: 18, ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: sparkle(130, 34, 9) }, 'yellow')
  ],
  consolidar: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[40, 98, 80, 36], [48, 60, 64, 36], [56, 22, 48, 36]]) }, 'tan'),
    s('path', { d: rects([[40, 98, 80, 36], [48, 60, 64, 36], [56, 22, 48, 36]]), ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M64 22v112M96 22v112', ...SW(7) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: dots([[64, 40], [96, 40], [64, 78], [96, 78], [64, 116], [96, 116]], 4) }, 'dark'),
    arrow('M28 60h12M132 60h-12M28 110h8M132 110h-8', 'orange', 4)
  ],
  césped: [
    s('path', { d: 'M14 90h132v56H14z' }, 'green', { accent: true }),
    s('path', { d: 'M14 104h132M14 120h132M14 136h132', ...SW(6) }, 'mint', { stroke: true }),
    s('path', { d: 'M20 90l4-12 4 12 4-10 4 10 4-12 4 12M110 90l4-12 4 12 4-10 4 10 4-12 4 12', ...SW(2) }, 'green', { stroke: true }),
    s('rect', { x: 62, y: 60, width: 40, height: 22, rx: 6 }, 'red'),
    s('path', { d: dots([[68, 84], [96, 84]], 6) }, 'dark'),
    s('path', { d: 'M100 62l24-30h10', ...SW(4) }, 'dark', { stroke: true })
  ],
  cómico: [
    s('circle', { cx: 80, cy: 82, r: 46 }, 'white'),
    s('path', { d: dots([[38, 52], [122, 52], [34, 72], [126, 72]], 14) }, 'orange'),
    s('circle', { cx: 80, cy: 82, r: 46, ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M56 102q24 26 48 0z' }, 'red'),
    s('circle', { cx: 80, cy: 86, r: 10 }, 'red', { accent: true }),
    s('path', { d: 'M56 68q8-10 16 0M88 68q8-10 16 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 40l18-26 18 26z' }, 'blue')
  ],
  despedir: [
    ground(),
    s('rect', { x: 100, y: 34, width: 44, height: 102 }, 'brown'),
    s('rect', { x: 106, y: 40, width: 32, height: 96 }, 'dark'),
    ...person(54, 136, 'gray'),
    s('rect', { x: 34, y: 86, width: 40, height: 28, rx: 2 }, 'tan', { accent: true }),
    s('path', { d: leaflet(48, 86, -110, 20, 6) + leaflet(52, 86, -60, 18, 6) }, 'green'),
    arrow('M78 26h-50M38 18l-10 8 10 8', 'red', 5)
  ],
  devolución: [
    s('rect', { x: 18, y: 74, width: 60, height: 52, rx: 3 }, 'tan'),
    s('path', { d: 'M18 90h60M48 74v16', ...SW(3) }, 'brown', { stroke: true }),
    arrow('M60 56V40q0-18 30-18h16q30 0 30 28v20q0 26-30 26H94', 'blue', 7),
    s('path', { d: 'M104 82l-14 14 14 14', ...SW(7) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: ells([[118, 132, 14, 5], [118, 124, 14, 5]]) }, 'yellow')
  ],
  dilema: [
    s('path', { d: 'M70 146l6-56-46-60h18l40 50 40-50h18l-46 60 6 56z' }, 'tan'),
    s('path', { d: 'M80 140v-46', ...DASH(3) }, 'white', { stroke: true }),
    ...person(80, 140, 'blue', { h: 28, w: 20, r: 9 }),
    s('path', { d: 'M24 28h28l8 8-8 8H24zM136 28h-28l-8 8 8 8h28z' }, 'orange', { accent: true }),
    s('path', { d: 'M38 44v14M122 44v14', ...SW(4) }, 'brown', { stroke: true })
  ],
  dimisión: [
    s('path', { d: 'M14 108h132v10H14z' }, 'brown'),
    s('path', { d: 'M24 118v24M136 118v24', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 32, y: 74, width: 60, height: 34, rx: 3 }, 'white', { accent: true }),
    s('path', { d: 'M32 74l30 20 30-20M32 74h60v34H32z', ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 62, cy: 96, r: 5 }, 'red'),
    s('path', { d: 'M108 104V40h26v68', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 112, y: 44, width: 18, height: 40, rx: 4 }, 'gray')
  ],
  diócesis: [
    s('path', { d: 'M24 46q20-30 60-24t52 34q10 40-20 66t-70 10q-36-20-22-86z' }, 'mint'),
    s('path', { d: 'M24 46q20-30 60-24t52 34q10 40-20 66t-70 10q-36-20-22-86z', ...DASH(3) }, 'green', { stroke: true }),
    s('path', { d: 'M64 112V76l16-14 16 14v36z' }, 'cream', { accent: true }),
    s('path', { d: 'M80 62V42M72 50h16', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 74, y: 94, width: 12, height: 18 }, 'brown'),
    s('path', { d: 'M36 72v-12l8-7 8 7v12zM110 112v-12l8-7 8 7v12z' }, 'tan')
  ],
  ea: [
    s('circle', { cx: 80, cy: 52, r: 14 }, 'skin'),
    s('path', { d: 'M66 112V76q0-10 14-10t14 10v36z' }, 'orange', { accent: true }),
    s('path', { d: 'M68 76L46 40M92 76l22-36M72 112l-6 28M88 112l6 28', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M28 30l8 6M24 48h10M132 30l-8 6M136 48h-10', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: sparkle(80, 22, 8) }, 'yellow')
  ],
  equipaje: [
    s('path', { d: 'M48 46V32q0-8 8-8h16q8 0 8 8v14', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 30, y: 46, width: 68, height: 84, rx: 8 }, 'red', { accent: true }),
    s('path', { d: 'M46 54v68M82 54v68', ...SW(4) }, 'pink', { stroke: true }),
    s('rect', { x: 102, y: 72, width: 40, height: 58, rx: 6 }, 'blue'),
    s('path', { d: 'M114 72v-24h16v24', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[42, 136], [86, 136], [110, 136], [134, 136]], 5) }, 'dark')
  ],
  estimación: [
    s('path', { d: 'M18 112a62 62 0 0 1 124 0z' }, 'white'),
    s('path', { d: 'M18 112a62 62 0 0 1 124 0', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: wedge(80, 112, 58, 250, 290) }, 'mint'),
    s('path', { d: halfRays(80, 112, 48, 58, 9), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 112l10-50', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 112, r: 8 }, 'dark'),
    s('path', { d: 'M40 132q10-8 20 0t20 0 20 0 20 0', ...SW(4) }, 'orange', { stroke: true })
  ],
  figurar: [
    ...paper(30, 16, 100, 128),
    s('rect', { x: 36, y: 66, width: 88, height: 26, rx: 4 }, 'yellow', { accent: true }),
    s('path', { d: dots([[50, 40], [50, 79], [50, 118]], 8) }, 'blue'),
    s('path', { d: 'M66 40h48M66 79h48M66 118h48', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M136 79l12-8v16z' }, 'red')
  ],
  globalización: [
    s('circle', { cx: 80, cy: 84, r: 52 }, 'blue', { accent: true }),
    s('path', { d: 'M52 50q14 4 10 18t12 20-6 22M96 40q-6 12 8 18t20 22M100 108q10-6 22 2', ...SW(9) }, 'green', { stroke: true }),
    s('path', { d: 'M44 70Q80 0 116 66M50 112Q90 140 124 94', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: dots([[44, 70], [116, 66], [50, 112], [124, 94]], 5) }, 'yellow')
  ],
  hipoteca: [
    s('path', { d: 'M24 80l46-38 46 38' }, 'red'),
    s('rect', { x: 34, y: 76, width: 72, height: 58 }, 'cream'),
    s('path', { d: 'M24 80l46-38 46 38', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('rect', { x: 62, y: 102, width: 16, height: 32 }, 'brown'),
    s('path', { d: ells([[126, 132, 16, 6], [126, 122, 16, 6], [126, 112, 16, 6], [126, 102, 16, 6]]) }, 'yellow'),
    s('path', { d: ring(132, 50, 10) + 'M132 60v26M132 76h8M132 84h6', ...SW(5) }, 'orange', { stroke: true })
  ],
  hostil: [
    s('path', { d: 'M30 132q-10-40 20-70 30-24 60 0l6 70h-12l-4-30H54l-10 30z' }, 'black', { accent: true }),
    s('path', { d: 'M48 58l-4-12 8 6 6-12 6 12 8-6-2 12', ...SW(4) }, 'black', { stroke: true }),
    s('circle', { cx: 120, cy: 64, r: 18 }, 'black'),
    s('path', { d: 'M106 50l2-18 10 12zM134 50l-2-18-10 12z' }, 'black'),
    s('path', { d: ells([[113, 60, 4, 3], [127, 60, 4, 3]]) }, 'yellow'),
    s('path', { d: 'M112 72l4 6 4-4 4 4 4-6', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M30 130q-20-20-6-50', ...SW(6) }, 'black', { stroke: true })
  ],
  incumplimiento: [
    s('path', { d: 'M24 22h50l-8 20 10 18-8 22 8 20-8 18 4 18H24z' }, 'white'),
    s('path', { d: 'M86 22h50v116H90l-4-18 8-18-8-20 8-22-10-18 8-20z' }, 'white'),
    s('path', { d: 'M24 22h50l-8 20 10 18-8 22 8 20-8 18 4 18H24zM86 22h50v116H90l-4-18 8-18-8-20 8-22-10-18 8-20z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 42h28M34 62h30M98 42h28M98 62h28M34 82h24M100 82h26', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 118, cy: 114, r: 10 }, 'red', { accent: true }),
    s('path', { d: 'M34 116q8-8 14 0t14-2', ...SW(3) }, 'navy', { stroke: true })
  ],
  infracción: [
    s('rect', { x: 22, y: 18, width: 34, height: 86, rx: 8 }, 'dark'),
    s('path', { d: 'M39 104v36', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 39, cy: 36, r: 11 }, 'red', { accent: true }),
    s('path', { d: dots([[39, 61], [39, 86]], 11) }, 'gray'),
    ...car(72, 108, 'blue'),
    arrow('M74 96h-20M62 88l-8 8 8 8', 'orange', 4)
  ],
  letal: [
    s('path', { d: 'M66 22h28v24q20 8 20 32v48q0 10-10 10H56q-10 0-10-10V78q0-24 20-32z' }, 'purple', { accent: true }),
    s('rect', { x: 62, y: 16, width: 36, height: 12, rx: 3 }, 'dark'),
    s('circle', { cx: 80, cy: 90, r: 18 }, 'white'),
    s('path', { d: dots([[73, 88], [87, 88]], 4) }, 'dark'),
    s('path', { d: 'M74 100v4M80 100v4M86 100v4', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M130 136v-30q0-10-8-12', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: ells([[116, 98, 8, 5]]) }, 'gray')
  ],
  lío: [
    s('circle', { cx: 78, cy: 78, r: 46 }, 'pink'),
    s('path', { d: 'M44 70q36-30 72 10M46 96q30 20 66-20M56 48q20 40 50 64M60 114q0-40 50-66M36 84q40 4 82-6', ...SW(4) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M50 58q40 6 52 52M40 104q26-40 70-40', ...SW(3) }, 'purple', { stroke: true }),
    s('path', { d: 'M112 108q14 16 28 30', ...SW(4) }, 'red', { stroke: true })
  ],
  marcial: [
    backdrop('sky'),
    s('circle', { cx: 52, cy: 40, r: 13 }, 'skin'),
    s('path', { d: 'M40 54h26l4 44H42z' }, 'white'),
    s('path', { d: 'M40 54h26l4 44H42z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M42 80h28', ...SW(6) }, 'black', { stroke: true, accent: true }),
    s('path', { d: 'M50 98l-10 40M62 96l60-30', ...SW(10) }, 'white', { stroke: true }),
    s('path', { d: 'M62 60l26 10M44 62l-18 18', ...SW(7) }, 'white', { stroke: true }),
    s('path', { d: 'M126 64l12-6M120 54l8-8M128 80l12 2', ...SW(3) }, 'orange', { stroke: true })
  ],
  martillo: [
    s('path', { d: 'M40 136l52-78', ...SW(12) }, 'brown', { stroke: true }),
    s('rect', { x: 70, y: 36, width: 60, height: 22, rx: 3, transform: 'rotate(34 100 47)' }, 'gray', { accent: true }),
    s('rect', { x: 116, y: 50, width: 10, height: 26, rx: 2, transform: 'rotate(34 100 47)' }, 'dark'),
    s('path', { d: 'M124 104v32', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M116 104h16', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 136h132', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: 'M108 96l-8-6M140 96l6-6', ...SW(3) }, 'orange', { stroke: true })
  ],
  mayoritariamente: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'gray'),
    s('path', { d: wedge(80, 80, 60, -90, 160) }, 'blue', { accent: true }),
    s('path', { d: wedge(80, 80, 60, -90, 160), ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: dots([[96, 88]], 8) }, 'white')
  ],
  medición: [
    s('rect', { x: 20, y: 70, width: 64, height: 60, rx: 3 }, 'tan'),
    s('rect', { x: 86, y: 100, width: 50, height: 40, rx: 10 }, 'yellow', { accent: true }),
    s('circle', { cx: 111, cy: 120, r: 10 }, 'dark'),
    s('path', { d: 'M20 56h80v16H20z' }, 'yellow'),
    s('path', { d: 'M28 56v8M36 56v5M44 56v8M52 56v5M60 56v8M68 56v5M76 56v8M84 56v5M92 56v8', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 64q10 6 10 36', ...SW(8) }, 'yellow', { stroke: true }),
    arrow('M20 40h80M28 32l-8 8 8 8M92 32l8 8-8 8', 'red', 3)
  ],
  mezquita: [
    s('rect', { x: 36, y: 84, width: 80, height: 52 }, 'cream'),
    s('path', { d: 'M40 84q0-38 36-40 36 2 36 40z' }, 'green', { accent: true }),
    s('path', { d: 'M76 44v-14', ...SW(3) }, 'yellow', { stroke: true }),
    s('rect', { x: 124, y: 40, width: 14, height: 96 }, 'cream'),
    s('path', { d: 'M122 40l9-22 9 22z' }, 'green'),
    s('path', { d: 'M66 136v-22a10 10 0 0 1 20 0v22z' }, 'brown'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'tan', { stroke: true })
  ],
  mixto: [
    s('path', { d: 'M22 84h116q-4 52-58 52T22 84z' }, 'brown'),
    s('circle', { cx: 50, cy: 76, r: 13 }, 'red', { accent: true }),
    s('circle', { cx: 78, cy: 70, r: 13 }, 'yellow'),
    s('circle', { cx: 106, cy: 76, r: 13 }, 'green'),
    s('path', { d: ells([[64, 82, 10, 6], [94, 84, 10, 6]]) }, 'orange'),
    s('path', { d: dots([[38, 86], [122, 86], [80, 86]], 6) }, 'purple')
  ],
  muralla: [
    s('path', { d: 'M14 120q30-40 62-30t70-30v86H14z' }, 'green'),
    s('path', { d: 'M14 118q30-40 62-30t70-30', ...SW(20) }, 'tan', { stroke: true, accent: true }),
    s('path', { d: 'M14 106q30-40 62-30t70-30', ...DASH(8, '6 6') }, 'tan', { stroke: true }),
    s('path', { d: 'M14 118q30-40 62-30t70-30', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M64 96V62h26v30z' }, 'tan'),
    s('path', { d: 'M64 62h26', ...DASH(6, '5 4') }, 'tan', { stroke: true }),
    s('rect', { x: 72, y: 72, width: 8, height: 10 }, 'dark')
  ],
  muscular: [
    ground(),
    s('circle', { cx: 80, cy: 40, r: 14 }, 'skin'),
    s('path', { d: 'M58 58h44l-6 50H64z' }, 'red', { accent: true }),
    s('path', { d: 'M58 62q-24 4-28-24M102 62q24 4 28-24', ...SW(12) }, 'skin', { stroke: true }),
    s('path', { d: dots([[40, 56], [120, 56]], 10) + dots([[26, 32], [134, 32]], 8) }, 'skin'),
    s('path', { d: 'M68 108v28M92 108v28', ...SW(10) }, 'navy', { stroke: true })
  ],
  natación: [
    s('rect', { x: 14, y: 30, width: 132, height: 100, rx: 6 }, 'sky'),
    s('path', { d: 'M14 54h132M14 106h132', ...DASH(4, '10 6') }, 'red', { stroke: true }),
    s('circle', { cx: 92, cy: 80, r: 11 }, 'skin'),
    s('path', { d: 'M86 72a11 11 0 0 1 16 0z' }, 'red', { accent: true }),
    s('path', { d: 'M80 82q-20 4-48 0M100 70q14-20 30-6', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M24 90q10-6 20 0t20 0 20 0M104 92q10-6 20 0', ...SW(3) }, 'white', { stroke: true })
  ],
  ninja: [
    s('circle', { cx: 74, cy: 54, r: 22 }, 'black'),
    s('rect', { x: 58, y: 46, width: 32, height: 12, rx: 6 }, 'skin'),
    s('path', { d: dots([[67, 52], [81, 52]], 2.5) }, 'dark'),
    s('path', { d: 'M52 44h44M52 44l-14-8M52 44l-12 4', ...SW(4) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M46 140V96q0-20 28-20t28 20v44z' }, 'black'),
    s('path', { d: star(124, 104, 16, 6) }, 'gray'),
    s('circle', { cx: 124, cy: 104, r: 3 }, 'dark')
  ],
  notablemente: [
    s('path', { d: 'M18 136h124', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: rects([[26, 110, 18, 26], [52, 104, 18, 32], [78, 112, 18, 24]]) }, 'gray'),
    s('rect', { x: 106, y: 34, width: 22, height: 102 }, 'orange', { accent: true }),
    s('path', { d: sparkle(117, 20, 10) + sparkle(140, 50, 6) }, 'yellow')
  ],
  padrino: [
    s('path', { d: 'M48 140q0-56 32-56t32 56z' }, 'navy'),
    s('path', { d: 'M74 84l6 30 6-30z' }, 'white'),
    s('path', { d: 'M78 90l2 20 2-20z' }, 'red'),
    s('circle', { cx: 80, cy: 60, r: 18 }, 'skin'),
    s('ellipse', { cx: 94, cy: 112, rx: 28, ry: 14 }, 'white', { accent: true }),
    s('ellipse', { cx: 94, cy: 112, rx: 28, ry: 14, ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 112, cy: 106, r: 10 }, 'skin')
  ],
  peronismo: [
    s('path', { d: busts([28, 52, 76, 100, 124], 140, 22, 30) }, 'blue'),
    s('path', { d: dots([[28, 104], [52, 104], [76, 104], [100, 104], [124, 104]], 10) }, 'skin'),
    s('path', { d: 'M38 112l10-30M110 112l14-36', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M52 24v48M116 28v44', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M54 26h40v26H54z' }, 'sky', { accent: true }),
    s('path', { d: 'M54 34h40', ...SW(8) }, 'white', { stroke: true }),
    s('path', { d: 'M118 30h22v18h-22z' }, 'sky')
  ],
  pito: [
    s('path', { d: 'M24 70h70v-14h20v14q24 0 24 26t-28 26-28-26H24z' }, 'gray', { accent: true }),
    s('circle', { cx: 110, cy: 96, r: 10 }, 'dark'),
    s('rect', { x: 24, y: 70, width: 14, height: 26 }, 'dark'),
    s('path', { d: ring(30, 120, 8), ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M38 102q-6 8-4 12', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M78 52l-6-16M96 46v-18M112 52l8-14', ...SW(4) }, 'orange', { stroke: true })
  ],
  portar: [
    ground(),
    ...person(70, 136, 'green'),
    s('rect', { x: 92, y: 96, width: 36, height: 30, rx: 4 }, 'brown', { accent: true }),
    s('path', { d: 'M100 96q10-16 20 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M84 100l14 0', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M48 70l-16 0M44 80h-12', ...SW(3) }, 'gray', { stroke: true })
  ],
  premier: [
    s('rect', { x: 50, y: 84, width: 60, height: 56, rx: 4 }, 'brown'),
    s('path', { d: 'M38 84q0-36 42-36t42 36z' }, 'navy'),
    s('path', { d: 'M74 50l6 26 6-26z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 34, r: 16 }, 'skin'),
    s('path', { d: 'M66 84l-8-18M94 84l8-18', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[58, 64], [102, 64]], 5) }, 'dark'),
    s('circle', { cx: 80, cy: 110, r: 10 }, 'yellow')
  ],
  presionar: [
    s('rect', { x: 26, y: 112, width: 108, height: 26, rx: 6 }, 'gray'),
    s('ellipse', { cx: 80, cy: 112, rx: 34, ry: 12 }, 'red', { accent: true }),
    s('path', { d: 'M80 98V36', ...SW(20) }, 'skin', { stroke: true }),
    s('rect', { x: 64, y: 20, width: 32, height: 26, rx: 6 }, 'blue'),
    s('path', { d: 'M40 92l-10-8M120 92l10-8M30 108H18M130 108h12', ...SW(4) }, 'orange', { stroke: true })
  ],
  prever: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 70h132v64q0 12-12 12H26q-12 0-12-12z' }, 'green'),
    s('path', { d: 'M30 146l44-76h12l44 76z' }, 'gray'),
    s('circle', { cx: 80, cy: 52, r: 12 }, 'yellow'),
    s('path', { d: ells([[54, 110, 22, 22], [106, 110, 22, 22]]) + 'M70 100h20v14H70z' }, 'black', { accent: true }),
    s('path', { d: ells([[54, 110, 12, 12], [106, 110, 12, 12]]) }, 'sky'),
    s('path', { d: 'M48 104q4-4 8-4M100 104q4-4 8-4', ...SW(3) }, 'white', { stroke: true })
  ],
  procedencia: [
    s('path', { d: 'M40 70c-16-18-16-40 0-40s16 22 0 40z' }, 'red', { accent: true }),
    s('circle', { cx: 40, cy: 46, r: 6 }, 'white'),
    s('path', { d: 'M40 76q0 40 40 40t40-20', ...DASH(4) }, 'gray', { stroke: true }),
    s('rect', { x: 100, y: 64, width: 40, height: 34, rx: 3 }, 'tan'),
    s('path', { d: 'M100 76h40M120 64v12', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M30 76h20', ...SW(4) }, 'dark', { stroke: true })
  ],
  promotor: [
    ground(),
    ...person(48, 136, 'purple'),
    s('path', { d: 'M60 90l14-6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M70 76l40-22v52l-40-22z' }, 'red', { accent: true }),
    s('rect', { x: 64, y: 74, width: 10, height: 14, rx: 2 }, 'dark'),
    s('path', { d: 'M120 60l14-10M122 80h16M120 100l14 10', ...SW(4) }, 'orange', { stroke: true })
  ],
  propiamente: [
    s('rect', { x: 26, y: 88, width: 108, height: 48, rx: 4 }, 'brown'),
    s('rect', { x: 58, y: 88, width: 44, height: 28 }, 'dark'),
    s('rect', { x: 58, y: 36, width: 44, height: 44, rx: 2 }, 'blue', { accent: true }),
    arrow('M80 20v10', 'gray', 4),
    s('circle', { cx: 126, cy: 40, r: 16 }, 'green'),
    s('path', { d: 'M118 40l6 6 10-12', ...SW(4) }, 'white', { stroke: true })
  ],
  resta: [
    s('path', { d: dots([[30, 80], [58, 80], [86, 80]], 13) }, 'red'),
    s('path', { d: 'M30 66l4-8M58 66l4-8M86 66l4-8', ...SW(3) }, 'brown', { stroke: true }),
    s('circle', { cx: 126, cy: 50, r: 13 }, 'red', { accent: true }),
    s('circle', { cx: 126, cy: 50, r: 17, ...DASH(2, '4 4') }, 'gray', { stroke: true }),
    arrow('M100 74l14-12M104 60l10 2-2 10', 'orange', 4),
    s('path', { d: 'M30 116h70', ...SW(6) }, 'navy', { stroke: true })
  ],
  rocío: [
    s('circle', { cx: 124, cy: 36, r: 14 }, 'yellow'),
    s('path', { d: 'M30 136Q40 60 130 70Q90 140 30 136z' }, 'green'),
    s('path', { d: 'M30 136Q70 100 120 74', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: dots([[60, 104], [96, 92], [80, 120]], 7) + dots([[106, 110]], 5) }, 'sky', { accent: true }),
    s('path', { d: dots([[58, 102], [94, 90], [78, 118]], 2) }, 'white'),
    s('path', { d: drop(40, 52, 8) }, 'sky')
  ],
  simpatizante: [
    ground(),
    ...person(64, 136, 'blue'),
    s('path', { d: 'M76 100l20-20', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M100 136V24', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 100, y: 24, width: 44, height: 40, rx: 3 }, 'yellow'),
    s('path', { d: heart(122, 44, 14) }, 'red', { accent: true })
  ],
  subtítulo: [
    s('rect', { x: 14, y: 26, width: 132, height: 96, rx: 6 }, 'dark'),
    s('path', { d: 'M22 34h116v80H22z' }, 'navy'),
    s('circle', { cx: 80, cy: 62, r: 16 }, 'skin'),
    s('path', { d: 'M54 114q0-32 26-32t26 32z' }, 'purple'),
    s('path', { d: 'M38 96h84M50 108h60', ...SW(6) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M60 122l-8 18M100 122l8 18', ...SW(5) }, 'dark', { stroke: true })
  ],
  tarta: [
    s('ellipse', { cx: 80, cy: 128, rx: 60, ry: 10 }, 'gray'),
    s('rect', { x: 32, y: 74, width: 96, height: 52, rx: 6 }, 'pink', { accent: true }),
    s('path', { d: 'M32 80q12 14 24 0t24 0 24 0 24 0', ...SW(8) }, 'white', { stroke: true }),
    s('path', { d: 'M32 104h96', ...SW(4) }, 'cream', { stroke: true }),
    s('path', { d: dots([[50, 68], [80, 64], [110, 68]], 8) }, 'red'),
    s('path', { d: 'M66 58V34M94 58V34', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: drop(66, 28, 4) + drop(94, 28, 4) }, 'orange')
  ],
  textil: [
    s('rect', { x: 20, y: 40, width: 30, height: 96, rx: 4 }, 'red', { accent: true }),
    s('rect', { x: 56, y: 40, width: 30, height: 96, rx: 4 }, 'blue'),
    s('path', { d: 'M86 52q30 0 40 20t16 60H96z' }, 'blue'),
    s('path', { d: 'M28 40v96M36 40v96M64 40v96M72 40v96', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: ells([[35, 40, 15, 5], [71, 40, 15, 5]]) }, 'dark'),
    s('path', { d: 'M100 104l8 8M112 96l8 8M110 120l8 8', ...SW(2) }, 'sky', { stroke: true })
  ],
  transportar: [
    s('path', { d: 'M14 128h132', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 16, y: 50, width: 86, height: 64, rx: 3 }, 'orange', { accent: true }),
    s('path', { d: 'M102 72h22l18 22v20h-40z' }, 'red'),
    s('path', { d: 'M108 78h14l12 16h-26z' }, 'sky'),
    s('path', { d: dots([[38, 116], [80, 116], [122, 116]], 11) }, 'dark'),
    s('path', { d: dots([[38, 116], [80, 116], [122, 116]], 4) }, 'gray'),
    s('path', { d: 'M24 62h70M24 78h70M24 94h70', ...SW(2) }, 'yellow', { stroke: true })
  ],
  triángulo: [
    s('path', { d: 'M72 30L30 120h86', ...SW(7) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: 'M88 30l34 74', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: 'M72 30q8-14 16 0', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M84 76l56 40', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M124 58l8-6M130 74h10M112 46l2-10', ...SW(3) }, 'orange', { stroke: true })
  ],
  abismo: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 70h46l-6 20 8 20-4 36H14zM146 70h-46l6 20-8 20 4 36h44z' }, 'brown'),
    s('path', { d: 'M60 70h40l6 20-8 20 4 36H58l4-36-8-20z' }, 'black', { accent: true }),
    s('path', { d: 'M14 70h46M100 70h46', ...SW(6) }, 'green', { stroke: true }),
    ...person(36, 66, 'red', { h: 26, w: 18, r: 8 })
  ],
  adicionalmente: [
    s('path', { d: rects([[40, 110, 70, 26], [40, 82, 70, 26], [40, 54, 70, 26]]) }, 'tan'),
    s('path', { d: rects([[40, 110, 70, 26], [40, 82, 70, 26], [40, 54, 70, 26]]), ...SW(2) }, 'brown', { stroke: true }),
    s('rect', { x: 60, y: 16, width: 70, height: 26, rx: 2, transform: 'rotate(8 95 29)' }, 'green', { accent: true }),
    arrow('M30 20v26M22 38l8 8 8-8', 'orange', 4),
    s('path', { d: sparkle(136, 64, 8) }, 'yellow')
  ],
  admirar: [
    ground(),
    ...person(44, 136, 'blue'),
    s('path', { d: 'M56 100l16-20', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: star(110, 54, 30) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(140, 104, 8) + sparkle(76, 30, 7) }, 'orange'),
    s('path', { d: heart(44, 80, 6) }, 'red')
  ],
  anular: [
    s('rect', { x: 26, y: 30, width: 108, height: 104, rx: 8 }, 'white'),
    outline({ x: 26, y: 30, width: 108, height: 104, rx: 8 }),
    s('path', { d: 'M26 38q0-8 8-8h92q8 0 8 8v14H26z' }, 'blue'),
    s('path', { d: rects([[40, 66, 20, 16], [70, 66, 20, 16], [100, 66, 20, 16], [40, 94, 20, 16], [70, 94, 20, 16]]) }, 'sky'),
    s('circle', { cx: 110, cy: 106, r: 22, ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M95 91l30 30', ...SW(6) }, 'red', { stroke: true })
  ],
  audiovisual: [
    s('rect', { x: 18, y: 26, width: 92, height: 66, rx: 6 }, 'dark'),
    s('path', { d: 'M56 44l24 15-24 15z' }, 'white'),
    s('path', { d: 'M24 136V118a26 26 0 0 1 52 0v18', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: rects([[16, 116, 14, 24], [70, 116, 14, 24]]) }, 'red', { accent: true }),
    s('path', { d: 'M106 108l14-10v34l-14-10z' }, 'blue'),
    s('path', { d: 'M126 106q6 9 0 18M134 100q12 15 0 30', ...SW(3) }, 'blue', { stroke: true })
  ],
  balanza: [
    s('path', { d: 'M80 24v104M56 136h48', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M28 40h104', ...SW(5) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M28 40l-14 40M28 40l14 40M132 40l-14 40M132 40l14 40', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M12 80h32q-2 14-16 14T12 80zM116 80h32q-2 14-16 14t-16-14z' }, 'yellow'),
    s('circle', { cx: 80, cy: 24, r: 6 }, 'yellow')
  ],
  bolivariano: [
    s('path', { d: laurel(80, 82, 52) }, 'green'),
    s('path', { d: 'M32 78q48-56 96 0q-48-10-96 0z' }, 'navy', { accent: true }),
    s('path', { d: 'M48 70q32-12 64 0', ...SW(3) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 52, r: 6 }, 'red'),
    s('path', { d: 'M40 124q40 8 82-30', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 124l-10 4M34 116l8 16', ...SW(5) }, 'yellow', { stroke: true })
  ],
  carnet: [
    s('rect', { x: 14, y: 36, width: 132, height: 88, rx: 8 }, 'sky'),
    s('rect', { x: 14, y: 36, width: 132, height: 20, rx: 8 }, 'blue', { accent: true }),
    s('rect', { x: 24, y: 64, width: 40, height: 48, rx: 4 }, 'white'),
    s('circle', { cx: 44, cy: 82, r: 9 }, 'skin'),
    s('path', { d: 'M30 112q0-18 14-18t14 18z' }, 'navy'),
    s('path', { d: 'M76 72h56M76 88h44M76 104h50', ...SW(5) }, 'white', { stroke: true })
  ],
  confesar: [
    s('rect', { x: 18, y: 20, width: 124, height: 120, rx: 6 }, 'brown'),
    s('path', { d: 'M18 28q0-8 8-8h108q8 0 8 8v4H18z' }, 'dark'),
    s('rect', { x: 66, y: 44, width: 28, height: 50 }, 'tan', { accent: true }),
    s('path', { d: 'M66 52l28 28M66 68l26 26M66 84l10 10M78 44l16 16M66 64l20-20M66 80l28-28M66 94l28-28M80 94l14-14', ...SW(2) }, 'brown', { stroke: true }),
    s('circle', { cx: 40, cy: 70, r: 12 }, 'skin'),
    s('path', { d: 'M26 140V96q0-12 14-12t14 12v44z' }, 'navy'),
    s('path', { d: 'M52 72q6-2 10 0', ...SW(3) }, 'skin', { stroke: true })
  ],
  coral: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'blue'),
    s('path', { d: 'M14 128q66-14 132 0v6q0 12-12 12H26q-12 0-12-12z' }, 'tan'),
    s('path', { d: 'M60 126V90l-16-20M60 96l18-24M60 84V54M40 70l-6-14M78 72l10-12', ...SW(9) }, 'pink', { stroke: true, accent: true }),
    s('path', { d: 'M110 126V96l12-18M110 104l-14-14M122 78l-4-14M122 78l14-8', ...SW(8) }, 'orange', { stroke: true }),
    s('path', { d: fishes([[110, 40]]) }, 'yellow'),
    s('path', { d: dots([[30, 40], [40, 28], [140, 70]], 3) }, 'sky')
  ],
  cuestionar: [
    ground(),
    ...person(40, 136, 'orange'),
    s('path', { d: 'M52 100l12-30', ...SW(6) }, 'skin', { stroke: true }),
    ...paper(78, 52, 62, 80),
    s('path', { d: 'M88 70h42M88 84h42M88 112h30', ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 108, cy: 98, rx: 26, ry: 10, ...SW(4) }, 'red', { stroke: true, accent: true }),
    s('path', { d: dots([[34, 34], [50, 28], [66, 34]], 5) }, 'gray')
  ],
  decano: [
    s('path', { d: 'M40 140l8-50q32-14 64 0l8 50z' }, 'purple', { accent: true }),
    s('path', { d: 'M66 92l14 40 14-40', ...SW(6) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 132, r: 7 }, 'yellow'),
    s('circle', { cx: 80, cy: 64, r: 20 }, 'skin'),
    s('path', { d: 'M60 58q0-16 20-16t20 16q-4-8-20-8t-20 8z' }, 'gray'),
    s('path', { d: ring(72, 64, 6) + ring(88, 64, 6) + 'M78 64h4', ...SW(2.5) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 22l30 10-30 10-30-10z' }, 'black')
  ],
  distribuir: [
    s('rect', { x: 62, y: 18, width: 36, height: 30, rx: 3 }, 'tan', { accent: true }),
    arrow('M70 54L34 84M80 54v30M90 54l36 30', 'gray', 4),
    s('path', { d: dots([[30, 100], [80, 100], [130, 100]], 10) }, 'skin'),
    s('path', { d: busts([30, 80, 130], 140, 26, 28) }, 'blue'),
    s('path', { d: rects([[20, 122, 14, 12], [70, 122, 14, 12], [120, 122, 14, 12]]) }, 'tan')
  ],
  empatía: [
    ground(),
    ...person(56, 136, 'green', { accent: true }),
    ...person(104, 136, 'sky'),
    s('path', { d: 'M66 98q20-14 34-6', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: drop(110, 84, 3) }, 'blue'),
    s('path', { d: heart(80, 42, 16) }, 'red')
  ],
  espuma: [
    s('path', { d: 'M24 88h112l-8 46q-2 6-8 6H40q-6 0-8-6z' }, 'blue'),
    s('path', { d: dots([[34, 86], [56, 78], [80, 84], [104, 76], [126, 86], [46, 62], [70, 58], [94, 56], [116, 64], [82, 38]], 15) }, 'white', { accent: true }),
    s('path', { d: ring(34, 86, 15) + ring(56, 78, 15) + ring(104, 76, 15) + ring(126, 86, 15) + ring(46, 62, 15) + ring(94, 56, 15) + ring(116, 64, 15) + ring(82, 38, 15), ...SW(2) }, 'sky', { stroke: true }),
    s('path', { d: dots([[20, 40], [140, 36]], 6) }, 'sky')
  ],
  explosivo: [
    s('path', { d: burst(124, 34, 20, 9, 9) }, 'yellow'),
    s('path', { d: 'M86 58q20-30 36-24', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: rects([[34, 64, 22, 72], [58, 64, 22, 72], [82, 64, 22, 72]]) }, 'red', { accent: true }),
    s('path', { d: 'M30 84h78M30 116h78', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M38 70v60M62 70v60M86 70v60', ...SW(2) }, 'pink', { stroke: true })
  ],
  flexible: [
    ground(),
    s('path', { d: 'M46 104Q80 30 116 96', ...SW(18) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M116 96l10 38', ...SW(10) }, 'navy', { stroke: true }),
    s('path', { d: 'M46 104l-10 30', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 56, cy: 116, r: 11 }, 'skin'),
    arrow('M52 40q28-20 56 0M98 30l10 10-14 4', 'orange', 4)
  ],
  gallardo: [
    s('path', { d: 'M48 140q-6-50 32-56 38 6 32 56z' }, 'red'),
    s('path', { d: 'M62 140V96q0-12 18-12t18 12v44z' }, 'navy', { accent: true }),
    s('circle', { cx: 80, cy: 66, r: 16 }, 'skin'),
    s('path', { d: 'M52 56q28-14 56 0-4 4-28 2-24 2-28-2z' }, 'black'),
    s('path', { d: 'M64 52q20-30 34-8-10-8-34 8z' }, 'black'),
    s('path', { d: 'M98 48q16-26 34-26-10 16-30 28z' }, 'yellow'),
    s('path', { d: 'M70 72q10 4 20 0', ...SW(3) }, 'brown', { stroke: true })
  ],
  gilipollas: [
    s('circle', { cx: 80, cy: 84, r: 50 }, 'yellow', { accent: true }),
    s('path', { d: ells([[62, 70, 12, 14], [100, 70, 12, 14]]) }, 'white'),
    s('path', { d: dots([[68, 74], [94, 74]], 5) }, 'dark'),
    s('path', { d: 'M56 102q24 22 48 0z' }, 'dark'),
    s('path', { d: 'M74 110q6 16 14 0z' }, 'red'),
    s('path', { d: 'M54 28l-8-10M80 26v-12M106 28l8-10', ...SW(4) }, 'orange', { stroke: true })
  ],
  ingenio: [
    s('circle', { cx: 80, cy: 62, r: 38 }, 'yellow', { accent: true }),
    s('path', { d: 'M62 96h36v16H62z' }, 'yellow'),
    s('path', { d: rects([[64, 112, 32, 8], [66, 122, 28, 8]]) }, 'gray'),
    ...gear(80, 62, 12, 8, 'orange'),
    s('path', { d: halfRays(80, 62, 46, 56, 7), ...SW(4) }, 'orange', { stroke: true })
  ],
  luchador: [
    s('rect', { x: 14, y: 124, width: 132, height: 16 }, 'sky'),
    s('path', { d: 'M14 70h132M14 90h132', ...SW(3) }, 'red', { stroke: true }),
    s('circle', { cx: 80, cy: 42, r: 18 }, 'blue', { accent: true }),
    s('path', { d: ells([[72, 40, 5, 6], [88, 40, 5, 6]]) }, 'white'),
    s('path', { d: 'M54 124V74q0-14 26-14t26 14v50z' }, 'skin'),
    s('rect', { x: 54, y: 96, width: 52, height: 12 }, 'yellow'),
    s('path', { d: 'M54 72L32 52M106 72l22-20', ...SW(10) }, 'skin', { stroke: true })
  ],
  lunar: [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'skin'),
    s('path', { d: 'M24 70q4-50 56-50t56 50q-14-20-56-24-42 4-56 24z' }, 'brown'),
    s('path', { d: dots([[60, 76], [100, 76]], 5) }, 'dark'),
    s('path', { d: 'M64 108q16 10 32 0', ...SW(4) }, 'red', { stroke: true }),
    s('circle', { cx: 110, cy: 100, r: 5 }, 'dark', { accent: true }),
    s('circle', { cx: 110, cy: 100, r: 13, ...DASH(2, '4 3') }, 'orange', { stroke: true })
  ],
  machista: [
    ground(),
    s('rect', { x: 18, y: 104, width: 52, height: 32, rx: 3 }, 'gray'),
    ...person(44, 104, 'navy', { h: 44, w: 34, r: 13, accent: true }),
    s('path', { d: 'M30 72h28', ...SW(8) }, 'skin', { stroke: true }),
    ...lady(112, 136, 'pink'),
    arrow('M66 40l24 18', 'red', 4)
  ],
  marxista: [
    s('path', { d: 'M110 140V60h28v80z' }, 'gray'),
    s('rect', { x: 120, y: 40, width: 8, height: 20 }, 'gray'),
    s('path', { d: 'M120 32q8-10 18-6', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: 'M24 140q0-46 36-46t36 46z' }, 'dark'),
    s('circle', { cx: 60, cy: 64, r: 18 }, 'skin'),
    s('path', { d: 'M42 66q0 34 18 34t18-34q-6 12-18 12t-18-12zM42 60q0-24 18-24t18 24q-6-12-18-12t-18 12z' }, 'gray'),
    s('rect', { x: 44, y: 106, width: 34, height: 28, rx: 2 }, 'red', { accent: true })
  ],
  melodía: [
    s('path', { d: 'M14 60q33-24 66 0t66 0M14 76q33-24 66 0t66 0M14 92q33-24 66 0t66 0', ...SW(2) }, 'gray', { stroke: true }),
    ...note(40, 100, 'purple'),
    ...note(80, 70, 'blue'),
    s('ellipse', { cx: 118, cy: 108, rx: 8, ry: 6 }, 'red'),
    s('path', { d: 'M125 108v-28l12 6', ...SW(4) }, 'red', { stroke: true })
  ],
  módulo: [
    s('path', { d: 'M34 66l22-12 22 12v26l-22 12-22-12z' }, 'blue'),
    s('path', { d: 'M82 66l22-12 22 12v26l-22 12-22-12z' }, 'green'),
    s('path', { d: 'M58 106l22-12 22 12v26l-22 12-22-12z' }, 'orange'),
    s('path', { d: 'M58 26l22-12 22 12v26l-22 12-22-12z' }, 'purple', { accent: true }),
    s('path', { d: 'M58 26l22 12 22-12M80 38v26M34 66l22 12 22-12M56 78v26M82 66l22 12 22-12M104 78v26M58 106l22 12 22-12M80 118v26', ...SW(2) }, 'white', { stroke: true })
  ],
  nulo: [
    s('rect', { x: 18, y: 44, width: 124, height: 72, rx: 6 }, 'cream'),
    s('path', { d: 'M54 44v72', ...DASH(3, '4 4') }, 'gray', { stroke: true }),
    s('path', { d: dots([[54, 44], [54, 116]], 7) }, 'white'),
    s('path', { d: 'M66 64h60M66 80h44M66 96h52', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M20 124L140 36', ...SW(10) }, 'red', { stroke: true, accent: true }),
    s('rect', { x: 18, y: 44, width: 124, height: 72, rx: 6, ...SW(2) }, 'tan', { stroke: true })
  ],
  nutrición: [
    s('circle', { cx: 80, cy: 84, r: 58 }, 'white'),
    s('circle', { cx: 80, cy: 84, r: 58, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: wedge(80, 84, 46, 180, 270) }, 'green', { accent: true }),
    s('path', { d: wedge(80, 84, 46, 270, 360) }, 'red'),
    s('path', { d: wedge(80, 84, 46, 0, 90) }, 'tan'),
    s('path', { d: wedge(80, 84, 46, 90, 180) }, 'yellow'),
    s('path', { d: 'M80 38v92M34 84h92', ...SW(3) }, 'white', { stroke: true })
  ],
  ocio: [
    s('path', { d: 'M14 120h132v26H14z' }, 'tan'),
    s('path', { d: 'M80 120V40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 50q52-50 104 0z' }, 'red', { accent: true }),
    s('path', { d: 'M40 120l20-30h40l-16 30M58 96l28 0', ...SW(5) }, 'blue', { stroke: true }),
    s('rect', { x: 100, y: 96, width: 10, height: 24 }, 'orange'),
    s('path', { d: 'M100 96l4-8', ...SW(2) }, 'green', { stroke: true })
  ],
  orina: [
    s('path', { d: 'M48 50h64l-6 86H54z' }, 'white'),
    s('path', { d: 'M51 84h58l-3 52H54z' }, 'yellow', { accent: true }),
    s('path', { d: 'M48 50h64l-6 86H54z', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 44, y: 32, width: 72, height: 18, rx: 4 }, 'blue'),
    s('rect', { x: 62, y: 96, width: 36, height: 22, rx: 2 }, 'white'),
    s('path', { d: 'M68 104h24M68 110h16', ...SW(2) }, 'gray', { stroke: true })
  ],
  parrilla: [
    s('path', { d: 'M28 140l14-36M132 140l-14-36', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M22 84h116l-8 22H30z' }, 'dark'),
    s('path', { d: 'M24 84q8-14 12 0t16-2 12-4 14 6M84 84q8-16 16-2t16-2 14 4', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M18 76h124', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: ells([[54, 66, 22, 10]]) }, 'brown', { accent: true }),
    s('rect', { x: 86, y: 58, width: 46, height: 12, rx: 6 }, 'red'),
    s('path', { d: 'M44 58l8 16M58 58l8 16', ...SW(2) }, 'dark', { stroke: true })
  ],
  patrulla: [
    s('path', { d: 'M14 124h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M44 78l12-22h44l14 22z' }, 'sky'),
    s('rect', { x: 20, y: 76, width: 120, height: 34, rx: 8 }, 'white'),
    s('rect', { x: 20, y: 76, width: 120, height: 34, rx: 8, ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M20 92h120', ...SW(8) }, 'navy', { stroke: true }),
    s('path', { d: rects([[62, 44, 16, 10]]) }, 'red', { accent: true }),
    s('path', { d: rects([[78, 44, 16, 10]]) }, 'blue'),
    s('path', { d: dots([[48, 112], [112, 112]], 11) }, 'dark')
  ],
  portátil: [
    s('path', { d: 'M34 30h92q6 0 6 6v68H28V36q0-6 6-6z' }, 'gray'),
    s('rect', { x: 36, y: 38, width: 88, height: 60, rx: 2 }, 'sky', { accent: true }),
    s('path', { d: 'M14 104h132l-10 20H24z' }, 'gray'),
    s('path', { d: 'M38 110h84M44 116h72', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 76l18-18 14 12 20-20 14 14', ...SW(4) }, 'blue', { stroke: true })
  ],
  previsión: [
    s('path', { d: 'M24 24v108h116', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M32 116l20-20 18 8 20-30', ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M90 74l20-14 22-20', ...DASH(5, '6 7') }, 'orange', { stroke: true }),
    s('path', { d: 'M90 74l44-34v60z' }, 'orange', { flatOnly: true, opacity: 0.25 }),
    s('path', { d: 'M90 28v100', ...DASH(2, '4 4') }, 'gray', { stroke: true })
  ],
  proximidad: [
    ground(),
    ...person(60, 136, 'blue'),
    ...person(100, 136, 'orange', { accent: true }),
    arrow('M74 28h12M70 22l-6 6 6 6M90 22l6 6-6 6', 'red', 3)
  ],
  puntual: [
    s('circle', { cx: 74, cy: 80, r: 56 }, 'white'),
    s('circle', { cx: 74, cy: 80, r: 56, ...SW(6) }, 'navy', { stroke: true }),
    s('path', { d: rays(74, 80, 44, 50, 12), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 80V38', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M74 80l-4-28', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 122, cy: 122, r: 20 }, 'green', { accent: true }),
    s('path', { d: 'M112 122l7 7 13-14', ...SW(5) }, 'white', { stroke: true })
  ],
  recesión: [
    s('path', { d: 'M24 24v108h116', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: rects([[36, 50, 16, 82], [60, 66, 16, 66], [84, 88, 16, 44], [108, 108, 16, 24]]) }, 'gray'),
    s('path', { d: 'M36 36l28 22 20 0 34 46', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M104 106l16 2 0-16', ...SW(6) }, 'red', { stroke: true })
  ],
  reproducir: [
    s('circle', { cx: 80, cy: 72, r: 50 }, 'red', { accent: true }),
    s('path', { d: 'M66 46l40 26-40 26z' }, 'white'),
    s('path', { d: 'M24 138h112', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 138h50', ...SW(5) }, 'red', { stroke: true }),
    s('circle', { cx: 74, cy: 138, r: 7 }, 'red')
  ],
  residencial: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 36, y: 28, width: 54, height: 108 }, 'tan', { accent: true }),
    s('path', { d: rects([[44, 38, 14, 12], [68, 38, 14, 12], [44, 60, 14, 12], [68, 60, 14, 12], [44, 82, 14, 12], [68, 82, 14, 12], [44, 104, 14, 12], [68, 104, 14, 12]]) }, 'sky'),
    s('rect', { x: 96, y: 64, width: 40, height: 72 }, 'cream'),
    s('path', { d: rects([[102, 74, 10, 10], [120, 74, 10, 10], [102, 94, 10, 10], [120, 94, 10, 10], [110, 116, 12, 20]]) }, 'brown'),
    s('path', { d: dots([[24, 112]], 10) }, 'green'),
    s('path', { d: 'M24 122v14', ...SW(4) }, 'brown', { stroke: true })
  ],
  retención: [
    s('path', { d: 'M14 100h132v40H14z' }, 'dark'),
    s('path', { d: 'M14 120h12M38 120h12M62 120h12M86 120h12M110 120h12M134 120h12', ...SW(3) }, 'yellow', { stroke: true }),
    ...car(14, 82, 'red'),
    ...car(82, 82, 'blue', 'sky', { accent: true }),
    s('path', { d: 'M40 40l8 -10M78 34v-12M116 40l-8-10', ...SW(4) }, 'orange', { stroke: true })
  ],
  roque: [
    s('path', { d: 'M46 26h12v10h10V26h24v10h10V26h12v28l-8 8v46l14 10v12H40v-12l14-10V62l-8-8z' }, 'dark', { accent: true }),
    s('path', { d: 'M54 62h52', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 130h80', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[18, 140, 20, 6], [58, 140, 20, 6], [98, 140, 20, 6]]) }, 'gray')
  ],
  sismo: [
    s('path', { d: 'M14 112h132v34H14z' }, 'brown'),
    s('path', { d: 'M80 112l-8 12 10 8-6 14', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 112V70l26-22 26 22v42z', transform: 'rotate(-8 80 112)' }, 'cream', { accent: true }),
    s('path', { d: 'M48 72l32-28 32 28', ...SW(6), transform: 'rotate(-8 80 112)' }, 'red', { stroke: true }),
    s('path', { d: 'M30 60q-8 14 0 28M20 54q-12 20 0 40M130 60q8 14 0 28M140 54q12 20 0 40', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M70 82l8 10-6 10', ...SW(3), transform: 'rotate(-8 80 112)' }, 'dark', { stroke: true })
  ],
  sufragio: [
    s('path', { d: 'M24 140V74q0-6 6-6t6 6V54q0-6 6-6t6 6v86z' }, 'skin'),
    s('path', { d: 'M64 140V54q0-6 6-6t6 6V34q0-6 6-6t6 6v106z' }, 'tan', { accent: true }),
    s('path', { d: 'M104 140V70q0-6 6-6t6 6V50q0-6 6-6t6 6v90z' }, 'brown'),
    s('path', { d: rects([[20, 120, 32, 20], [60, 120, 32, 20], [100, 120, 32, 20]]) }, 'blue'),
    s('path', { d: 'M110 22l6 6 12-12', ...SW(4) }, 'green', { stroke: true })
  ],
  tiburón: [
    s('path', { d: 'M14 76q11-8 22 0t22 0 22 0 22 0 22 0 22 0V146H14z' }, 'blue'),
    s('path', { d: 'M20 108q40-34 96-14l20-16-6 26 8 22-22-14q-50 18-96-4z' }, 'gray', { accent: true }),
    s('path', { d: 'M66 92l14-34 12 32z' }, 'gray'),
    s('path', { d: 'M24 108q30 10 70 6', ...SW(4) }, 'white', { stroke: true }),
    s('circle', { cx: 40, cy: 100, r: 3 }, 'dark'),
    s('path', { d: 'M28 112l4 4 4-4 4 4', ...SW(2) }, 'dark', { stroke: true })
  ],
  vara: [
    ground(),
    ...person(60, 136, 'green'),
    s('path', { d: 'M96 136V20', ...SW(7) }, 'brown', { stroke: true, accent: true }),
    s('circle', { cx: 96, cy: 20, r: 6 }, 'yellow'),
    s('path', { d: 'M72 100l22 -6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M88 56h16M88 76h16', ...SW(2) }, 'tan', { stroke: true })
  ],
  vulgar: [
    ...person(60, 140, 'orange', { h: 40, w: 30, r: 18, accent: true }),
    s('path', { d: 'M64 84q8 8 12 0z' }, 'dark'),
    s('path', { d: dots([[54, 76]], 3) }, 'dark'),
    s('path', { d: 'M84 82q20-30 50-10 10 20-10 30-30 10-40-20z' }, 'mint'),
    s('path', { d: 'M96 72l10 6M110 66l4 10M118 88l10 0', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: dots([[40, 132], [86, 136], [96, 130]], 3) }, 'brown')
  ],
  zapatero: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M76 136v-24h-12', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 112V76q0-8 8-8h20q6 0 8 8l6 14q30 4 46 14 6 8-2 8z' }, 'brown', { accent: true }),
    s('path', { d: 'M30 104h88', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 76h22', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M110 74l20-36', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 116, y: 26, width: 28, height: 12, rx: 2, transform: 'rotate(30 130 32)' }, 'gray')
  ],
  zoológico: [
    s('path', { d: 'M66 136l6-56h20l6 56z' }, 'yellow'),
    s('path', { d: 'M80 84l18-56', ...SW(12) }, 'yellow', { accent: true }),
    s('ellipse', { cx: 104, cy: 26, rx: 14, ry: 9 }, 'yellow'),
    s('path', { d: dots([[76, 100], [86, 118], [72, 124], [88, 60], [92, 44]], 4) }, 'brown'),
    s('path', { d: 'M100 18l-2-8M108 18l2-8', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M20 40v100M44 40v100M116 40v100M140 40v100M14 40h132', ...SW(5) }, 'dark', { stroke: true })
  ],
  agradar: [
    ...face(70, 74, 46, 'yellow', 'smile', { accent: true }),
    s('path', { d: dots([[48, 86], [92, 86]], 6) }, 'pink'),
    s('path', { d: 'M124 140V96', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots([[118, 84], [130, 84], [124, 76], [124, 92]], 7) }, 'red'),
    s('circle', { cx: 124, cy: 84, r: 5 }, 'yellow')
  ],
  aliviar: [
    ground(),
    ...person(60, 136, 'blue'),
    s('path', { d: 'M46 74q-6-12 6-16 18 0 18 18' , ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M90 46q0-20 22-20t22 20-22 20-22-20z' }, 'gray', { accent: true }),
    arrow('M112 92V76M104 84l8-8 8 8', 'green', 4),
    s('path', { d: 'M30 52q-8-6-12 0M30 64q-10 0-14 6', ...SW(3) }, 'sky', { stroke: true })
  ],
  apocalipsis: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('circle', { cx: 88, cy: 104, r: 34 }, 'blue'),
    s('path', { d: 'M66 92q10-10 20 0t14 12M74 120q8-8 18 0', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M26 26l46 46', ...SW(16) }, 'orange', { stroke: true }),
    s('path', { d: burst(78, 80, 20, 10, 9) }, 'yellow'),
    s('circle', { cx: 70, cy: 70, r: 10 }, 'red', { accent: true })
  ],
  auditoría: [
    s('rect', { x: 20, y: 20, width: 84, height: 116, rx: 4 }, 'white'),
    outline({ x: 20, y: 20, width: 84, height: 116, rx: 4 }),
    s('path', { d: 'M20 44h84M50 20v116M20 68h84M20 92h84M20 116h84', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 34l4 4 8-8M62 58l4 4 8-8M62 82l4 4 8-8', ...SW(3) }, 'green', { stroke: true }),
    s('rect', { x: 96, y: 76, width: 46, height: 64, rx: 6 }, 'dark', { accent: true }),
    s('rect', { x: 102, y: 82, width: 34, height: 14, rx: 2 }, 'mint'),
    s('path', { d: rects([[102, 102, 8, 8], [115, 102, 8, 8], [128, 102, 8, 8], [102, 115, 8, 8], [115, 115, 8, 8], [128, 115, 8, 8], [102, 128, 8, 8], [115, 128, 8, 8], [128, 128, 8, 8]]) }, 'gray')
  ],
  austeridad: [
    s('path', { d: 'M50 70h60l6 70H92l-12-50-12 50H44z' }, 'blue'),
    s('rect', { x: 40, y: 62, width: 80, height: 16, rx: 3 }, 'brown', { accent: true }),
    s('rect', { x: 72, y: 60, width: 16, height: 20, rx: 2, ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[96, 70], [104, 70], [112, 70]], 2) }, 'dark'),
    arrow('M14 70h18M26 62l8 8-8 8M146 70h-18M134 62l-8 8 8 8', 'red', 4),
    s('path', { d: 'M52 30h56v20H52z' }, 'green'),
    s('path', { d: 'M56 26l48 28', ...SW(4) }, 'red', { stroke: true })
  ],
  ballet: [
    s('circle', { cx: 80, cy: 30, r: 11 }, 'skin'),
    s('path', { d: 'M72 44h16l2 30H70z' }, 'pink'),
    s('path', { d: 'M40 84q40-24 80 0-40 8-80 0z' }, 'pink', { accent: true }),
    s('path', { d: 'M74 80l-2 58M86 80q24 10 44 4', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M72 46q-24-12-28-30M88 46q24-12 28-30', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M60 140h24', ...SW(4) }, 'gray', { stroke: true })
  ],
  biológico: [
    s('path', { d: 'M54 20q52 30 0 60t0 60M106 20q-52 30 0 60t0 60', ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M62 32h36M70 46h20M70 64h20M62 80h36M70 96h20M70 114h20M62 128h36', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: leaflet(112, 140, -50, 30, 11) }, 'green'),
    s('path', { d: 'M112 140l18-22', ...SW(2) }, 'mint', { stroke: true })
  ],
  caca: [
    s('path', { d: 'M30 132q-10-24 18-26-6-20 18-22-6-18 14-24 4 10 14 14 18 6 12 22 22 4 18 22 26 2 18 26z' }, 'brown', { accent: true }),
    s('path', { d: 'M46 106q34 8 64 0M54 84q26 6 46 0', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: dots([[66, 112], [92, 112]], 5) }, 'white'),
    s('path', { d: dots([[66, 113], [92, 113]], 2.5) }, 'dark'),
    s('path', { d: 'M30 46q-8-10 0-20M128 50q8-10 0-20', ...SW(3) }, 'green', { stroke: true })
  ],
  característico: [
    s('ellipse', { cx: 80, cy: 80, rx: 52, ry: 64 }, 'pink'),
    s('path', { d: 'M80 70a10 12 0 0 1 0 24M70 80a10 12 0 0 1 20 0M60 82a20 22 0 0 1 40 0q0 20-10 34M50 84a30 34 0 0 1 60 0q0 28-14 46M40 88a40 46 0 0 1 80 0q0 22-8 38M44 60q36-40 72 0', ...SW(4) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: sparkle(130, 30, 10) + sparkle(28, 130, 7) }, 'yellow')
  ],
  catástrofe: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 24h80l-14 22H54l10 20H96l-8 20H72l6 18h-6', ...SW(10) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: 'M90 136l6-30 20-10 18 14 4 26z' }, 'cream'),
    s('path', { d: 'M92 104l24-16 22 20', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: rects([[22, 122, 14, 10], [44, 112, 10, 10]]) }, 'brown'),
    s('path', { d: 'M108 136l6-14 6 14', ...SW(3) }, 'dark', { stroke: true })
  ],
  colgar: [
    s('path', { d: 'M14 24h132', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 24v8q8 2 6 10t-6 6', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 50l-44 22h88z', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 72l20-8 22 14 22-14 20 8 12 28-16 6v36H48v-36l-16-6z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 78v62', ...SW(2) }, 'navy', { stroke: true }),
    s('path', { d: dots([[86, 96], [86, 114]], 3) }, 'white')
  ],
  confrontación: [
    ground(),
    ...lean(40, 136, 14, 'blue'),
    ...lean(120, 136, -14, 'red', { accent: true }),
    s('path', { d: 'M80 44l-8 14h14l-8 16', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M62 96l12-4M98 96l-12-4', ...SW(6) }, 'skin', { stroke: true })
  ],
  cubo: [
    s('path', { d: 'M36 56h88l-12 82H48z' }, 'blue', { accent: true }),
    s('ellipse', { cx: 80, cy: 56, rx: 44, ry: 10 }, 'sky'),
    s('path', { d: 'M36 56q44-64 88 0', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M42 80h76', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: drop(80, 50, 4) }, 'white')
  ],
  cómic: [
    s('rect', { x: 22, y: 14, width: 116, height: 132, rx: 4 }, 'yellow'),
    s('path', { d: rects([[30, 22, 48, 54], [84, 22, 46, 54], [30, 82, 100, 56]]) }, 'white'),
    s('path', { d: rects([[30, 22, 48, 54], [84, 22, 46, 54], [30, 82, 100, 56]]), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: burst(107, 49, 18, 9, 10) }, 'red', { accent: true }),
    s('path', { d: bubble(36, 28, 36, 26) }, 'sky'),
    s('circle', { cx: 60, cy: 112, r: 14 }, 'skin'),
    s('path', { d: 'M94 100h28M94 112h20', ...SW(4) }, 'gray', { stroke: true })
  ],
  estela: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'blue'),
    s('path', { d: 'M80 52L22 146M80 52l58 94', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M80 70L50 146M80 70l30 76', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M80 18q14 14 12 40H68q-2-26 12-40z' }, 'red', { accent: true }),
    s('rect', { x: 74, y: 36, width: 12, height: 12, rx: 2 }, 'white')
  ],
  filo: [
    s('path', { d: 'M26 110L120 36q14 0 14 14L44 128z' }, 'gray', { accent: true }),
    s('path', { d: 'M44 128l90-78', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M26 110l-12 12 14 12 16-6z' }, 'dark'),
    s('path', { d: sparkle(102, 72, 12) }, 'yellow'),
    s('path', { d: sparkle(126, 92, 6) }, 'sky')
  ],
  fluido: [
    s('path', { d: 'M30 30h36v20l14 20-6 6-24-12H30z' }, 'sky'),
    s('path', { d: 'M30 30h36v20l14 20-6 6-24-12H30z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M78 74q10 20-6 34t10 26', ...SW(10) }, 'blue', { stroke: true, accent: true }),
    s('ellipse', { cx: 92, cy: 136, rx: 46, ry: 8 }, 'blue'),
    s('path', { d: 'M60 136q10-6 20 0M100 136q10-6 20 0', ...SW(2) }, 'sky', { stroke: true })
  ],
  imperialismo: [
    s('circle', { cx: 80, cy: 98, r: 44 }, 'blue'),
    s('path', { d: 'M56 76q14 6 8 20t14 18M100 70q-4 14 10 18t14 20', ...SW(9) }, 'green', { stroke: true }),
    s('path', { d: 'M46 54l-6-36 22 18 18-24 18 24 22-18-6 36z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[62, 36], [80, 32], [98, 36]], 4) }, 'red'),
    s('path', { d: 'M62 112v-22M106 120v-20', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 90h10v6H62zM106 100h10v6h-10z' }, 'red')
  ],
  incondicional: [
    ground(),
    ...person(44, 136, 'blue'),
    s('path', { d: 'M98 136q-6-34 18-38h10v38z' }, 'brown', { accent: true }),
    s('circle', { cx: 120, cy: 84, r: 14 }, 'brown'),
    s('path', { d: 'M110 74l-4-10 10 6M130 74l4-10-10 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: heart(82, 48, 16) }, 'red')
  ],
  inspirar: [
    s('rect', { x: 84, y: 60, width: 50, height: 46, rx: 2 }, 'white'),
    s('rect', { x: 84, y: 60, width: 50, height: 46, rx: 2, ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M88 106l-8 34M130 106l8 34M92 98q12-20 20-6t16-14', ...SW(4) }, 'brown', { stroke: true }),
    ...person(44, 140, 'green', { h: 40, w: 28, r: 12 }),
    s('path', { d: star(70, 26, 12) }, 'yellow', { accent: true }),
    s('path', { d: 'M62 36q-8 10-14 22', ...DASH(3, '3 5') }, 'orange', { stroke: true })
  ],
  inverso: [
    s('path', { d: 'M14 80h132', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 70V44l22-18 22 18v26z' }, 'blue', { accent: true }),
    s('path', { d: 'M48 90v26l22 18 22-18V90z' }, 'sky'),
    s('rect', { x: 64, y: 54, width: 12, height: 16 }, 'white'),
    s('rect', { x: 64, y: 90, width: 12, height: 16 }, 'white'),
    arrow('M116 52q18 28 0 56M108 100l8 8 8-8', 'orange', 4)
  ],
  jerez: [
    s('path', { d: 'M40 136V70q0-14 8-20V24h16v26q8 6 8 20v66z' }, 'green', { accent: true }),
    s('rect', { x: 44, y: 84, width: 24, height: 26, rx: 2 }, 'cream'),
    s('path', { d: 'M96 52h36q0 34-18 40-18-6-18-40z' }, 'white'),
    s('path', { d: 'M98 66h32q-2 22-16 26-14-4-16-26z' }, 'orange'),
    s('path', { d: 'M96 52h36q0 34-18 40-18-6-18-40zM114 92v36M100 132h28', ...SW(3) }, 'gray', { stroke: true })
  ],
  lineal: [
    s('path', { d: 'M24 18v116h120', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 34h108M30 58h108M30 82h108M30 106h108', ...SW(1.5) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 128L140 26', ...SW(5) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: dots([[50, 108], [72, 88], [94, 68], [116, 48]], 6) }, 'orange')
  ],
  mediación: [
    ground(),
    ...person(80, 136, 'green', { accent: true }),
    s('path', { d: 'M66 100H44M94 100h22', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M18 136V94q0-10 12-10t12 10v42zM118 136V94q0-10 12-10t12 10v42z' }, 'gray'),
    s('path', { d: dots([[30, 70], [130, 70]], 10) }, 'skin'),
    s('path', { d: burst(30, 44, 12, 6, 7) + burst(130, 44, 12, 6, 7) }, 'red')
  ],
  memorial: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'green', { stroke: true }),
    s('rect', { x: 52, y: 120, width: 56, height: 16 }, 'gray'),
    s('path', { d: 'M64 120l6-86 10-14 10 14 6 86z' }, 'gray', { accent: true }),
    s('path', { d: 'M74 40v72', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: ring(80, 104, 14), ...SW(7) }, 'green', { stroke: true }),
    s('path', { d: dots([[68, 98], [92, 98], [80, 118]], 4) }, 'red')
  ],
  meramente: [
    s('ellipse', { cx: 80, cy: 96, rx: 64, ry: 30 }, 'white'),
    s('ellipse', { cx: 80, cy: 96, rx: 64, ry: 30, ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 80, cy: 94, rx: 44, ry: 18, ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 92, r: 6 }, 'green', { accent: true }),
    s('path', { d: 'M30 38v40M24 38v14q0 6 6 6t6-6V38M130 38v40M130 38q10 4 10 20h-10', ...SW(3) }, 'gray', { stroke: true })
  ],
  mosca: [
    s('path', { d: ells([[60, 60, 22, 12], [100, 60, 22, 12]]) }, 'sky'),
    s('ellipse', { cx: 80, cy: 92, rx: 16, ry: 26 }, 'dark', { accent: true }),
    s('circle', { cx: 80, cy: 60, r: 14 }, 'dark'),
    s('path', { d: dots([[72, 56], [88, 56]], 6) }, 'red'),
    s('path', { d: 'M64 84l-20-6M64 98l-22 4M66 110l-16 14M96 84l20-6M96 98l22 4M94 110l16 14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M72 96h16M72 106h16', ...SW(2) }, 'gray', { stroke: true })
  ],
  mudo: [
    ...face(80, 80, 56, 'skin', 'flat'),
    s('path', { d: 'M54 104h52', ...SW(8) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: 'M58 98v12M66 98v12M74 98v12M82 98v12M90 98v12M98 98v12', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 102, y: 96, width: 10, height: 16, rx: 2 }, 'yellow')
  ],
  munición: [
    s('rect', { x: 24, y: 96, width: 112, height: 44, rx: 4 }, 'green', { accent: true }),
    s('path', { d: 'M24 108h112', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 96V50h16v46zM72 96V50h16v46zM104 96V50h16v46z' }, 'yellow'),
    s('path', { d: 'M40 50q8-28 16 0M72 50q8-28 16 0M104 50q8-28 16 0' }, 'orange'),
    s('rect', { x: 68, y: 116, width: 24, height: 10, rx: 2 }, 'gray')
  ],
  mártir: [
    ground(),
    ...person(70, 136, 'red', { h: 48, accent: true }),
    s('ellipse', { cx: 70, cy: 62, rx: 18, ry: 5, ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M106 136V52', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(106, 60, -120, 22, 6) + leaflet(106, 60, -60, 22, 6) + leaflet(106, 80, -150, 22, 6) + leaflet(106, 80, -30, 22, 6) }, 'green'),
    s('path', { d: 'M84 110l18-4', ...SW(6) }, 'skin', { stroke: true })
  ],
  opresión: [
    s('rect', { x: 26, y: 18, width: 108, height: 54, rx: 4 }, 'dark', { accent: true }),
    arrow('M50 30v26M42 48l8 8 8-8M110 30v26M102 48l8 8 8-8', 'gray', 4),
    s('circle', { cx: 80, cy: 112, r: 12 }, 'skin'),
    s('path', { d: 'M56 136q0-14 24-14t24 14z' }, 'blue'),
    s('path', { d: 'M64 104L46 76M96 104l18-28', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  optar: [
    ...paper(22, 18, 84, 116),
    s('circle', { cx: 44, cy: 52, r: 10, ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 44, cy: 96, r: 10, ...SW(4) }, 'blue', { stroke: true }),
    s('circle', { cx: 44, cy: 96, r: 5 }, 'blue', { accent: true }),
    s('path', { d: 'M62 52h32M62 96h32', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M102 124l34-58 8 4-34 58-10 6z' }, 'yellow')
  ],
  paradero: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 136V36', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 38, cy: 34, r: 16 }, 'blue', { accent: true }),
    s('rect', { x: 30, y: 26, width: 16, height: 12, rx: 3 }, 'white'),
    s('rect', { x: 62, y: 60, width: 84, height: 60, rx: 8 }, 'yellow'),
    s('path', { d: rects([[70, 70, 16, 18], [92, 70, 16, 18], [114, 70, 16, 18]]) }, 'sky'),
    s('path', { d: dots([[82, 122], [128, 122]], 9) }, 'dark')
  ],
  pertinente: [
    s('rect', { x: 26, y: 56, width: 64, height: 64, rx: 10 }, 'yellow', { accent: true }),
    s('path', { d: 'M42 60V40a16 16 0 0 1 32 0v20', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 80v18', ...SW(7) }, 'dark', { stroke: true }),
    s('circle', { cx: 58, cy: 80, r: 7 }, 'dark'),
    s('path', { d: 'M76 88h40M100 88v12M110 88v8', ...SW(6) }, 'orange', { stroke: true }),
    s('circle', { cx: 124, cy: 88, r: 12 }, 'orange'),
    s('path', { d: 'M108 128l8 8 16-18', ...SW(5) }, 'green', { stroke: true })
  ],
  potencialmente: [
    s('path', { d: 'M14 136h132V120q-40 0-70-60-10-20-30-20H14z' }, 'green'),
    s('circle', { cx: 30, cy: 30, r: 12 }, 'red', { accent: true }),
    s('path', { d: 'M44 34q30 10 50 50t44 40', ...DASH(4, '6 6') }, 'orange', { stroke: true }),
    s('path', { d: 'M126 116l12 8-14 4', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: sparkle(56, 20, 7) }, 'yellow')
  ],
  protagonismo: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('path', { d: 'M66 14h28l34 116H32z' }, 'cream'),
    s('ellipse', { cx: 80, cy: 130, rx: 48, ry: 10 }, 'yellow'),
    ...person(80, 130, 'red', { accent: true }),
    s('path', { d: 'M94 98l16-18', ...SW(6) }, 'skin', { stroke: true })
  ],
  protestante: [
    ground(),
    ...person(56, 136, 'orange'),
    s('path', { d: 'M86 136V30', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 86, y: 30, width: 56, height: 44, rx: 3 }, 'white'),
    s('rect', { x: 86, y: 30, width: 56, height: 44, rx: 3, ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 114, cy: 52, r: 14, ...SW(4) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M68 100l18-10M104 42l20 20', ...SW(5) }, 'skin', { stroke: true })
  ],
  provisión: [
    s('rect', { x: 20, y: 18, width: 120, height: 124, rx: 4 }, 'brown'),
    s('path', { d: 'M20 58h120M20 100h120', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: rects([[30, 30, 18, 26], [52, 30, 18, 26], [74, 30, 18, 26]]) }, 'red', { accent: true }),
    s('path', { d: rects([[100, 36, 32, 20], [30, 72, 26, 26], [62, 72, 26, 26]]) }, 'yellow'),
    s('path', { d: rects([[96, 70, 16, 28], [116, 70, 16, 28], [30, 114, 40, 26]]) }, 'green'),
    s('path', { d: ells([[92, 124, 14, 12], [122, 124, 12, 12]]) }, 'orange')
  ],
  reformar: [
    s('rect', { x: 20, y: 20, width: 120, height: 116 }, 'gray'),
    s('rect', { x: 20, y: 20, width: 64, height: 116 }, 'mint', { accent: true }),
    s('rect', { x: 74, y: 40, width: 48, height: 22, rx: 4 }, 'orange'),
    s('path', { d: 'M122 51h8v18H98v40', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M20 136h120', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 30l6 10M112 128l6-10', ...SW(3) }, 'dark', { stroke: true })
  ],
  saqueo: [
    s('rect', { x: 14, y: 26, width: 60, height: 110 }, 'cream'),
    s('path', { d: 'M22 40h44v50H22z' }, 'sky'),
    s('path', { d: 'M22 40l20 22-10 8 24 20M66 52l-14 10', ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 104, cy: 52, r: 12 }, 'skin'),
    s('path', { d: 'M92 50h24', ...SW(6) }, 'black', { stroke: true }),
    s('path', { d: 'M90 112l6-46h18l6 46z' }, 'dark'),
    s('path', { d: 'M110 70q36-10 30 30-6 20-26 10z' }, 'tan', { accent: true }),
    s('path', { d: 'M94 112l-10 24M114 112l10 24', ...SW(6) }, 'dark', { stroke: true })
  ],
  secta: [
    s('path', { d: 'M14 136l8-60q14-26 28 0l8 60zM102 136l8-60q14-26 28 0l8 60z' }, 'purple'),
    s('path', { d: 'M58 136l8-90q14-26 28 0l8 90z' }, 'navy', { accent: true }),
    s('path', { d: ells([[36, 76, 7, 9], [124, 76, 7, 9], [80, 46, 7, 9]]) }, 'dark'),
    s('rect', { x: 72, y: 116, width: 16, height: 20 }, 'cream'),
    s('path', { d: drop(80, 106, 5) }, 'orange'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  semifinal: [
    s('path', { d: 'M18 30h26v24H18M18 106h26v24H18M44 42h24v38M44 118h24V80M68 80h24M116 30h26v24h-26M116 106h26v24h-26M116 42H92v38M116 118H92V80', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[18, 24, 24, 12], [18, 48, 24, 12], [18, 100, 24, 12], [18, 124, 24, 12], [118, 24, 24, 12], [118, 48, 24, 12], [118, 100, 24, 12], [118, 124, 24, 12]]) }, 'sky'),
    s('path', { d: rects([[56, 36, 24, 14], [56, 112, 24, 14]]) }, 'orange', { accent: true }),
    s('path', { d: 'M68 64h24v8q0 12-12 12t-12-12z' }, 'yellow'),
    s('path', { d: 'M80 84v8M72 94h16', ...SW(4) }, 'yellow', { stroke: true })
  ],
  sexualmente: [
    ground(),
    ...person(52, 136, 'blue'),
    ...lady(108, 136, 'pink', { accent: true }),
    s('path', { d: heart(80, 40, 14) }, 'red')
  ],
  sosa: [
    s('path', { d: 'M40 40h52v86q0 10-10 10H50q-10 0-10-10z' }, 'brown', { accent: true }),
    s('rect', { x: 44, y: 24, width: 44, height: 16, rx: 3 }, 'dark'),
    s('rect', { x: 46, y: 64, width: 40, height: 40, rx: 2 }, 'white'),
    s('path', { d: dots([[60, 78], [72, 84], [64, 92]], 4) }, 'gray'),
    s('path', { d: ells([[112, 132, 6, 3], [126, 128, 6, 3], [122, 136, 6, 3], [108, 124, 6, 3], [136, 136, 5, 3]]) }, 'white'),
    s('path', { d: ells([[112, 132, 6, 3], [126, 128, 6, 3], [122, 136, 6, 3], [108, 124, 6, 3], [136, 136, 5, 3]]), ...SW(1.5) }, 'gray', { stroke: true })
  ],
  suite: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'cream'),
    s('rect', { x: 28, y: 52, width: 104, height: 30, rx: 6 }, 'brown'),
    s('rect', { x: 22, y: 80, width: 116, height: 36, rx: 6 }, 'white'),
    s('rect', { x: 22, y: 92, width: 116, height: 26, rx: 4 }, 'purple', { accent: true }),
    s('path', { d: ells([[54, 80, 18, 8], [106, 80, 18, 8]]) }, 'sky'),
    s('path', { d: 'M26 118v14M134 118v14', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: star(80, 34, 12) }, 'yellow')
  ],
  suscripción: [
    s('rect', { x: 30, y: 52, width: 76, height: 50, rx: 24 }, 'blue', { accent: true }),
    s('path', { d: 'M68 102v38', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 50h40v-6l10 6-10 6z' }, 'cream'),
    s('rect', { x: 40, y: 66, width: 44, height: 22, rx: 3 }, 'navy'),
    s('path', { d: 'M106 66l18-14v12', ...SW(4) }, 'red', { stroke: true }),
    arrow('M120 112a22 22 0 1 0-6-28M108 76l6 8 8-6', 'green', 4)
  ],
  trato: [
    s('path', { d: 'M14 96l40-14', ...SW(20) }, 'blue', { stroke: true }),
    s('path', { d: 'M146 96l-40-14', ...SW(20) }, 'orange', { stroke: true }),
    s('path', { d: 'M52 72q14-8 34 4l18-6q10 6 6 14l-24 22q-8 6-16 0L50 92z' }, 'skin', { accent: true }),
    s('path', { d: 'M70 92l10-8M78 100l10-8M88 98l10-10', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: sparkle(80, 40, 10) }, 'yellow')
  ],
  uy: [
    s('circle', { cx: 80, cy: 80, r: 50 }, 'yellow', { accent: true }),
    s('path', { d: ells([[62, 66, 8, 10], [98, 66, 8, 10]]) }, 'white'),
    s('path', { d: dots([[62, 68], [98, 68]], 4) }, 'dark'),
    s('ellipse', { cx: 80, cy: 102, rx: 10, ry: 13 }, 'dark'),
    s('path', { d: 'M28 92q-8-14 8-20M132 92q8-14-8-20', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: drop(124, 36, 6) }, 'sky')
  ],
  venia: [
    s('rect', { x: 92, y: 74, width: 54, height: 62 }, 'brown'),
    s('circle', { cx: 120, cy: 56, r: 13 }, 'skin'),
    s('path', { d: 'M100 74q0-10 20-10t20 10z' }, 'black'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    ...lean(46, 136, 22, 'navy', { accent: true }),
    s('circle', { cx: 120, cy: 28, r: 12 }, 'green'),
    s('path', { d: 'M114 28l4 4 8-9', ...SW(3) }, 'white', { stroke: true })
  ],
  viable: [
    s('path', { d: 'M40 104h80l-10 36H50z' }, 'orange'),
    s('path', { d: 'M36 98h88v10H36z' }, 'brown'),
    s('path', { d: 'M80 98V62', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 74, -150, 34, 12) + leaflet(80, 66, -30, 34, 12) }, 'green', { accent: true }),
    s('circle', { cx: 124, cy: 40, r: 18 }, 'green'),
    s('path', { d: 'M115 40l7 7 11-13', ...SW(4) }, 'white', { stroke: true })
  ],
  violeta: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 136, -150, 40, 14) + leaflet(80, 136, -30, 40, 14) }, 'green'),
    s('path', { d: 'M56 136V80M80 136V56M104 136V84', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: dots([[48, 72], [64, 72], [56, 62], [72, 48], [88, 48], [80, 38], [96, 76], [112, 76], [104, 66]], 9) }, 'purple', { accent: true }),
    s('path', { d: dots([[56, 74], [80, 50], [104, 78]], 4) }, 'yellow')
  ],
  ídolo: [
    s('path', { d: busts([22, 50, 110, 138], 146, 22, 22) + dots([[22, 116], [50, 116], [110, 116], [138, 116]], 9) }, 'dark'),
    ...person(80, 112, 'purple', { accent: true }),
    s('path', { d: 'M94 72l12-18', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M106 54v-8', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: heart(30, 48, 9) + heart(130, 30, 8) + heart(126, 84, 7) + heart(40, 86, 7) }, 'red'),
    s('path', { d: star(80, 24, 10) }, 'yellow')
  ],
  abdomen: [
    s('path', { d: 'M40 18h80q-6 40 6 70t-6 58H40q-12-28-6-58t6-70z' }, 'skin', { accent: true }),
    s('path', { d: 'M40 18q40 14 80 0', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M80 50v30M60 64q20 6 40 0M62 82q18 6 36 0', ...SW(3) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 80, cy: 102, rx: 4, ry: 6 }, 'brown'),
    s('path', { d: 'M34 128h92v18H34z' }, 'blue')
  ],
  abrazo: [
    ground(),
    s('path', { d: dots([[64, 52], [96, 52]], 13) }, 'skin'),
    s('rect', { x: 48, y: 68, width: 30, height: 68, rx: 10 }, 'blue'),
    s('rect', { x: 82, y: 68, width: 30, height: 68, rx: 10 }, 'orange', { accent: true }),
    s('path', { d: 'M54 82q26 16 50 0M106 92q-26 16-50 0', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 28, 9) }, 'red')
  ],
  acelerar: [
    s('path', { d: 'M14 128h132', ...SW(4) }, 'gray', { stroke: true }),
    ...car(66, 92, 'red', 'sky', { accent: true }),
    s('path', { d: 'M18 88h34M26 100h30M14 112h40', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M102 40a24 24 0 0 1 40 0', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M122 52l14-16', ...SW(4) }, 'red', { stroke: true })
  ],
  alteración: [
    ...paper(24, 18, 88, 116),
    s('path', { d: 'M36 44h64M36 64h64M36 104h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 84h68', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M40 94q10-12 20 0t20 0', ...SW(3) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M104 112l28-52 10 6-28 52-12 6z' }, 'orange'),
    s('path', { d: 'M132 60l4-8 10 6-4 8z' }, 'pink')
  ],
  anotar: [
    s('rect', { x: 26, y: 20, width: 86, height: 120, rx: 4 }, 'yellow'),
    s('path', { d: 'M38 44h62M38 62h62M38 80h62M38 98h40', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M40 40q6-6 12 0t12 0 12 0M40 58q6-6 12 0t12 0', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M26 30h-6M26 50h-6M26 70h-6M26 90h-6M26 110h-6', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 106l40-48 10 8-40 48-12 4z' }, 'blue', { accent: true }),
    s('path', { d: 'M100 120h30', ...SW(10) }, 'skin', { stroke: true })
  ],
  armadura: [
    s('path', { d: 'M60 20q20-10 40 0v34H60z' }, 'gray', { accent: true }),
    s('path', { d: 'M64 36h32', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 58h56l-4 50H56z' }, 'gray'),
    s('path', { d: 'M52 58q-14 4-14 20v30M108 58q14 4 14 20v30', ...SW(10) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 108v34M94 108v34', ...SW(12) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 58v50M58 80h44', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 10l-4 10h8z' }, 'red')
  ],
  bardo: [
    s('circle', { cx: 60, cy: 42, r: 14 }, 'skin'),
    s('path', { d: 'M44 36q16-18 32 0z' }, 'green'),
    s('path', { d: 'M70 30q22-24 30-16-10 4-24 18z' }, 'red'),
    s('path', { d: 'M38 140l8-80h28l8 80z' }, 'green'),
    s('path', { d: 'M94 112q-24 0-24-20t24-18q20 0 18 20-2 18-18 18z' }, 'brown', { accent: true }),
    s('path', { d: 'M106 80l26-46', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 92, cy: 92, r: 5 }, 'dark'),
    ...note(132, 82, 'purple')
  ],
  calmar: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 96h132v38q0 12-12 12H26q-12 0-12-12z' }, 'blue'),
    s('path', { d: 'M24 110h40M80 120h50M40 132h40', ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 72, r: 20 }, 'yellow', { accent: true }),
    s('path', { d: ells([[40, 40, 16, 6], [118, 36, 14, 5]]) }, 'white')
  ],
  carabinero: [
    s('path', { d: 'M44 140q0-46 36-46t36 46z' }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 70, r: 20 }, 'skin'),
    s('path', { d: 'M56 58q24-24 48 0z' }, 'green'),
    s('path', { d: 'M54 58h52', ...SW(6) }, 'black', { stroke: true }),
    s('path', { d: 'M70 94l10 14 10-14', ...SW(4) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 44, r: 4 }, 'yellow'),
    s('path', { d: 'M62 116h10v10H62zM88 116h10v10H88z' }, 'yellow')
  ],
  carrillo: [
    s('circle', { cx: 80, cy: 80, r: 44 }, 'skin', { accent: true }),
    s('path', { d: dots([[44, 94], [116, 94]], 24) }, 'skin'),
    s('path', { d: dots([[40, 98], [120, 98]], 10) }, 'pink'),
    s('path', { d: dots([[66, 70], [94, 70]], 4) }, 'dark'),
    s('path', { d: 'M74 104q6-4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 40q24-20 48 0', ...SW(6) }, 'brown', { stroke: true })
  ],
  cigarrillo: [
    s('rect', { x: 22, y: 98, width: 94, height: 14, rx: 2 }, 'white'),
    s('rect', { x: 22, y: 98, width: 28, height: 14, rx: 2 }, 'orange', { accent: true }),
    s('rect', { x: 22, y: 98, width: 100, height: 14, rx: 2, ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 116, y: 98, width: 8, height: 14 }, 'red'),
    s('path', { d: 'M124 92q-10-14 2-26t0-26', ...SW(5) }, 'gray', { stroke: true })
  ],
  cohete: [
    s('path', { d: 'M80 16q26 24 22 76H58q-4-52 22-76z' }, 'white', { accent: true }),
    s('path', { d: 'M80 16q26 24 22 76H58q-4-52 22-76z', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 54, r: 10 }, 'sky'),
    s('path', { d: 'M58 70l-16 28h18zM102 70l16 28h-18z' }, 'red'),
    s('path', { d: 'M64 92h32l-6 14H70z' }, 'dark'),
    s('path', { d: 'M70 108q10 40 20 0z' }, 'orange')
  ],
  combatiente: [
    s('path', { d: 'M44 140q0-48 36-48t36 48z' }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 68, r: 18 }, 'skin'),
    s('path', { d: 'M54 66q0-32 26-32t26 32z' }, 'green'),
    s('path', { d: 'M50 66h60', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 110l40 0M60 124h40', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: dots([[64, 48], [92, 44]], 3) }, 'brown')
  ],
  comunal: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M18 76l20-18 20 18v30H18zM102 76l20-18 20 18v30h-40z' }, 'cream'),
    s('path', { d: 'M14 78l24-22 24 22M98 78l24-22 24 22', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M58 110h44v26H58z' }, 'gray', { accent: true }),
    s('path', { d: 'M62 110V80h36v30M56 80h48', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 74, y: 88, width: 12, height: 12 }, 'blue')
  ],
  condicional: [
    s('path', { d: 'M80 20l34 30-34 30-34-30z' }, 'yellow', { accent: true }),
    s('path', { d: 'M46 50H28v40M114 50h18v40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M20 84l8 8 8-8M124 84l8 8 8-8', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 12, y: 98, width: 34, height: 34, rx: 6 }, 'green'),
    s('rect', { x: 114, y: 98, width: 34, height: 34, rx: 6 }, 'red'),
    s('path', { d: 'M20 115l6 6 12-12M124 106l14 18M138 106l-14 18', ...SW(4) }, 'white', { stroke: true })
  ],
  cordón: [
    s('path', { d: 'M18 112q0-40 20-52h40q14 24 44 30 20 4 20 22v10H18z' }, 'blue'),
    s('path', { d: 'M14 120h132v10q0 6-6 6H20q-6 0-6-6z' }, 'white'),
    s('path', { d: 'M14 120h132v10q0 6-6 6H20q-6 0-6-6z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 66l16 8M58 78l20 8M60 90l18 8', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M68 64q-20-30-10-34t10 34q20-30 30-24t-30 24M68 64q-6 20-22 30M68 64q10 20 26 26', ...SW(4) }, 'red', { stroke: true, accent: true })
  ],
  corteza: [
    s('path', { d: 'M40 20h52v116H40z' }, 'brown', { accent: true }),
    s('path', { d: 'M50 24q-4 30 2 50t-2 58M66 22q4 30-2 54t2 56M82 26q-4 30 2 50t-2 54', ...SW(3) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 118, cy: 104, rx: 26, ry: 26 }, 'brown'),
    s('ellipse', { cx: 118, cy: 104, rx: 20, ry: 20 }, 'tan'),
    s('path', { d: ring(118, 104, 12) + ring(118, 104, 5), ...SW(2) }, 'brown', { stroke: true })
  ],
  diferenciar: [
    s('path', { d: dots([[30, 50], [70, 50], [110, 50], [30, 100], [70, 100]], 14) }, 'blue'),
    s('rect', { x: 96, y: 86, width: 28, height: 28, rx: 3 }, 'orange', { accent: true }),
    s('circle', { cx: 110, cy: 100, r: 24, ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M128 120l14 18', ...SW(6) }, 'red', { stroke: true })
  ],
  difunto: [
    s('rect', { x: 34, y: 18, width: 92, height: 104, rx: 4 }, 'brown'),
    s('rect', { x: 44, y: 28, width: 72, height: 84 }, 'sky'),
    s('circle', { cx: 80, cy: 62, r: 16 }, 'skin'),
    s('path', { d: 'M56 112q0-28 24-28t24 28z' }, 'gray'),
    s('path', { d: 'M100 18l26 26M116 18h10v10', ...SW(6) }, 'black', { stroke: true, accent: true }),
    s('rect', { x: 20, y: 120, width: 12, height: 22 }, 'cream'),
    s('path', { d: drop(26, 110, 5) }, 'orange'),
    s('path', { d: 'M132 142v-16', ...SW(3) }, 'green', { stroke: true }),
    s('circle', { cx: 132, cy: 122, r: 7 }, 'white')
  ],
  disturbio: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 136l6-46h44l6 46z', transform: 'rotate(-14 68 136)' }, 'gray'),
    s('path', { d: 'M56 86q-12-20 6-30 0 14 10 6-4-18 14-26 0 20 12 30 10 14-4 22z' }, 'orange', { accent: true }),
    s('path', { d: 'M66 84q0-12 10-16 0 10 8 12 4 6-2 8z' }, 'yellow'),
    s('path', { d: 'M90 50q14-10 24-4 16-8 22 6 10 6 0 16H96q-12-6-6-18z' }, 'gray'),
    s('path', { d: dots([[118, 128], [128, 120], [108, 124]], 5) }, 'brown'),
    s('path', { d: 'M28 64l10 6M24 80h12M36 50l6 10', ...SW(3) }, 'red', { stroke: true })
  ],
  ecológico: [
    s('path', { d: 'M40 120q-20-60 30-84t60-10q4 50-26 82-30 28-64 12z' }, 'green', { accent: true }),
    s('path', { d: 'M40 120Q80 80 116 40', ...SW(4) }, 'mint', { stroke: true }),
    s('path', { d: 'M70 92l-14-10M86 74l-6-18M92 70l18 4', ...SW(3) }, 'mint', { stroke: true }),
    arrow('M30 70a54 54 0 0 1 30-44M22 50l8 22 18-12M130 90a54 54 0 0 1-30 44M138 110l-8-22-18 12', 'blue', 4)
  ],
  egoísta: [
    ground(),
    ...person(56, 136, 'red', { accent: true }),
    s('path', { d: 'M30 92h30q14 0 14 14H30z' }, 'yellow'),
    s('path', { d: 'M30 92h44', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M44 102h30', ...SW(6) }, 'skin', { stroke: true }),
    ...person(118, 136, 'gray', { h: 30, w: 20, r: 9 }),
    s('path', { d: 'M108 100l-16-6', ...SW(5) }, 'skin', { stroke: true })
  ],
  electorado: [
    s('path', { d: busts([28, 56, 84, 112, 140], 146, 24, 30) }, 'blue'),
    s('path', { d: dots([[28, 106], [56, 106], [84, 106], [112, 106], [140, 106]], 10) }, 'skin'),
    s('path', { d: busts([42, 70, 98, 126], 120, 22, 26) }, 'green'),
    s('path', { d: dots([[42, 84], [70, 84], [98, 84], [126, 84]], 9) }, 'skin'),
    s('path', { d: rects([[30, 30, 20, 26], [70, 22, 20, 26], [110, 30, 20, 26]]) }, 'white', { accent: true }),
    s('path', { d: rects([[30, 30, 20, 26], [70, 22, 20, 26], [110, 30, 20, 26]]) + 'M40 56v14M80 48v26M120 56v14', ...SW(2) }, 'gray', { stroke: true })
  ],
  electo: [
    ground(),
    ...person(80, 136, 'navy'),
    s('path', { d: 'M66 92l28 30', ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M94 98l16-30', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: rects([[30, 30, 6, 10], [126, 40, 6, 10], [40, 70, 6, 10], [118, 92, 6, 10]]) }, 'yellow'),
    s('path', { d: rects([[50, 20, 8, 6], [104, 22, 8, 6], [28, 104, 8, 6]]) }, 'purple')
  ],
  elevación: [
    s('path', { d: 'M14 136l48-80 22 30 18-26 44 76z' }, 'gray', { accent: true }),
    s('path', { d: 'M52 72l10-16 10 14-10-4z' }, 'white'),
    s('path', { d: 'M62 56V24', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 24h18l-4 6 4 6H62z' }, 'red'),
    arrow('M30 128V68M22 76l8-8 8 8', 'orange', 4),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'green', { stroke: true })
  ],
  entierro: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M24 136q46-28 92 0z' }, 'brown', { accent: true }),
    s('path', { d: 'M56 112V50q0-18 18-18t18 18v62z' }, 'gray'),
    s('path', { d: 'M66 62h16M66 74h16', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M128 136V40', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M118 30h20v-12q-10-6-20 0z' }, 'gray'),
    s('path', { d: dots([[40, 122], [100, 124], [48, 116]], 5) }, 'red')
  ],
  estelar: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('path', { d: rays(80, 80, 44, 60, 12), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: star(80, 80, 40) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(32, 34, 6) + sparkle(130, 128, 6) + sparkle(130, 30, 4) }, 'white')
  ],
  estimular: [
    s('path', { d: 'M40 100q-20-6-16-30 2-24 24-30 8-18 32-14 24-4 34 16 22 8 18 32 0 20-22 26-10 10-28 6-18 6-42-6z' }, 'pink', { accent: true }),
    s('path', { d: 'M54 50q10 10 0 22M80 40v26M104 52q-10 12 0 24M60 90q20-10 40 0', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M76 112v30M70 124l6 6 6-6', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M132 28l-10 16h10l-8 16', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M28 28l10 16H28l8 16', ...SW(4) }, 'yellow', { stroke: true })
  ],
  evacuación: [
    s('rect', { x: 14, y: 30, width: 132, height: 100, rx: 8 }, 'green', { accent: true }),
    s('rect', { x: 98, y: 42, width: 36, height: 76 }, 'white'),
    s('circle', { cx: 60, cy: 52, r: 9 }, 'white'),
    s('path', { d: 'M58 66l-6 22 14 10-6 18M54 86l-14 18M58 68l16 12 10-4M52 70l-14 8', ...SW(7) }, 'white', { stroke: true }),
    s('path', { d: 'M106 80h18M116 72l8 8-8 8', ...SW(4) }, 'green', { stroke: true })
  ],
  fierro: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M20 120h76v16H20zM20 96h76v8H20zM40 104h36v16H40z' }, 'gray', { accent: true }),
    s('path', { d: 'M20 80h76v8H20zM40 64h36v16H40zM20 56h76v8H20z' }, 'dark'),
    s('path', { d: 'M108 136l24-100', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M130 44l6-22', ...SW(8) }, 'orange', { stroke: true }),
    s('path', { d: 'M124 20l-4-8M140 20l6-6', ...SW(3) }, 'red', { stroke: true })
  ],
  filial: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 56, y: 22, width: 48, height: 114 }, 'navy', { accent: true }),
    s('path', { d: rects([[64, 32, 10, 10], [86, 32, 10, 10], [64, 52, 10, 10], [86, 52, 10, 10], [64, 72, 10, 10], [86, 72, 10, 10], [64, 92, 10, 10], [86, 92, 10, 10]]) }, 'sky'),
    s('path', { d: rects([[16, 96, 28, 40], [116, 96, 28, 40]]) }, 'blue'),
    s('path', { d: rects([[22, 104, 6, 6], [32, 104, 6, 6], [122, 104, 6, 6], [132, 104, 6, 6]]) }, 'sky'),
    s('path', { d: 'M56 60L30 92M104 60l26 32', ...DASH(3, '4 4') }, 'orange', { stroke: true })
  ],
  gemelo: [
    ground(),
    ...person(54, 136, 'orange', { accent: true }),
    ...person(106, 136, 'orange'),
    s('path', { d: 'M42 66q12-16 24 0M94 66q12-16 24 0', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: dots([[50, 78], [58, 78], [102, 78], [110, 78]], 1.8) }, 'dark')
  ],
  generosidad: [
    ground(),
    ...person(44, 136, 'green', { accent: true }),
    ...person(122, 136, 'blue', { h: 34, w: 22, r: 10 }),
    s('path', { d: 'M58 100h18M108 108h-16', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M74 98h26l-4 14H78z' }, 'brown'),
    s('path', { d: dots([[80, 92], [88, 90], [94, 94]], 5) }, 'red'),
    s('path', { d: heart(82, 50, 12) }, 'pink')
  ],
  holandés: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M62 136l6-70h24l6 70z' }, 'brown'),
    s('path', { d: 'M60 68l20-20 20 20z' }, 'red'),
    s('path', { d: 'M80 58L46 22M80 58l34-36M80 58L46 94M80 58l34 36', ...SW(10) }, 'cream', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 58, r: 6 }, 'dark'),
    s('path', { d: 'M126 136v-22M30 136v-18', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M118 100q0 14 8 14t8-14l-4 4-4-6-4 6zM22 106q0 14 8 14t8-14l-4 4-4-6-4 6z' }, 'red')
  ],
  imaginario: [
    s('path', { d: 'M38 84a18 18 0 0 1 4-34 24 24 0 0 1 40-18 22 22 0 0 1 38 8 18 18 0 0 1 8 44z' }, 'sky'),
    s('path', { d: dots([[40, 100], [32, 114]], 5) }, 'sky'),
    s('path', { d: 'M62 76V52h8v6h6v-6h8v6h6v-6h8v24z' }, 'pink', { accent: true }),
    s('path', { d: 'M76 52V34l6-8 6 8v18z' }, 'purple'),
    s('path', { d: sparkle(112, 40, 6) + sparkle(50, 40, 5) }, 'yellow'),
    s('circle', { cx: 32, cy: 128, r: 8 }, 'skin'),
    s('path', { d: 'M22 146q0-10 10-10t10 10z' }, 'blue')
  ],
  implantación: [
    s('path', { d: 'M14 100h132v46H14z' }, 'brown'),
    s('path', { d: 'M64 100q16 14 32 0z' }, 'dark'),
    s('path', { d: 'M80 104V72', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 82, -150, 22, 8) + leaflet(80, 76, -30, 22, 8) }, 'green', { accent: true }),
    s('path', { d: 'M110 70q14-10 24-4l12 6M108 80q10 2 14-6', ...SW(10) }, 'skin', { stroke: true }),
    arrow('M80 28v26M72 46l8 8 8-8', 'orange', 4)
  ],
  inversionista: [
    ground(),
    ...person(44, 136, 'navy', { accent: true }),
    s('rect', { x: 52, y: 110, width: 24, height: 18, rx: 3 }, 'brown'),
    s('path', { d: 'M84 120l16-20 14 8 26-38', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M128 66l14 2-2 14', ...SW(6) }, 'green', { stroke: true }),
    s('circle', { cx: 104, cy: 42, r: 14 }, 'yellow'),
    s('circle', { cx: 104, cy: 42, r: 8, ...SW(3) }, 'orange', { stroke: true })
  ],
  liquidación: [
    s('path', { d: 'M24 30h112', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M44 30v14M80 30v14M116 30v14', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 44h32l4 50H24zM64 44h32l4 50H60zM100 44h32l4 50H96z' }, 'blue'),
    s('path', { d: 'M40 70l16-8 14 4-4 16-16 8-14-4z' }, 'yellow', { accent: true }),
    s('circle', { cx: 50, cy: 74, r: 3 }, 'dark'),
    arrow('M116 104v34M106 128l10 10 10-10', 'red', 6),
    s('path', { d: 'M30 112h56l-6 30H36z' }, 'red')
  ],
  manto: [
    s('path', { d: 'M62 30q18 10 36 0l30 106q-48 14-96 0z' }, 'red', { accent: true }),
    s('path', { d: 'M62 30q18 10 36 0l6 16q-24 12-48 0z' }, 'purple'),
    s('path', { d: 'M74 60l-8 70M90 60l10 70', ...SW(3) }, 'pink', { stroke: true }),
    s('circle', { cx: 80, cy: 42, r: 7 }, 'yellow'),
    s('path', { d: 'M80 30V18', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 18h20', ...SW(4) }, 'gray', { stroke: true })
  ],
  milicia: [
    s('path', { d: busts([32, 80, 128], 146, 34, 40) }, 'green', { accent: true }),
    s('path', { d: dots([[32, 92], [80, 92], [128, 92]], 13) }, 'skin'),
    s('path', { d: 'M17 90a15 15 0 0 1 30 0zM65 90a15 15 0 0 1 30 0zM113 90a15 15 0 0 1 30 0z' }, 'dark'),
    s('path', { d: 'M52 30v94M100 30v94', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M52 30l-4 10h8zM100 30l-4 10h8z' }, 'gray'),
    s('path', { d: 'M54 34h30v20H54z' }, 'mint')
  ],
  pasivo: [
    s('ellipse', { cx: 80, cy: 116, rx: 54, ry: 24 }, 'purple'),
    s('path', { d: 'M50 112q10-30 40-28 20 2 24 24z' }, 'gray', { accent: true }),
    s('circle', { cx: 56, cy: 80, r: 13 }, 'skin'),
    s('path', { d: 'M50 80h6M60 80h6', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 100l26 18', ...SW(8) }, 'navy', { stroke: true }),
    s('path', { d: 'M76 104h20', ...SW(5) }, 'skin', { stroke: true }),
    s('rect', { x: 92, y: 98, width: 8, height: 14, rx: 2 }, 'dark'),
    s('path', { d: 'M100 36q8-6 14 0M112 24q8-6 14 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  pauta: [
    ...paper(28, 16, 104, 128),
    s('path', { d: 'M38 40h84M38 60h84M38 80h84M38 100h84M38 120h84', ...SW(2) }, 'sky', { stroke: true }),
    s('path', { d: 'M38 34v94', ...SW(2) }, 'red', { stroke: true }),
    s('path', { d: 'M48 56q8-10 16 0t16 0 16 0', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M96 92l30-40 8 6-30 40-10 4z' }, 'yellow', { accent: true })
  ],
  pica: [
    s('rect', { x: 24, y: 26, width: 76, height: 108, rx: 8 }, 'white'),
    s('rect', { x: 24, y: 26, width: 76, height: 108, rx: 8, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 50q-28 26-22 42 6 12 18 4l-6 18h20l-6-18q12 8 18-4 6-16-22-42z' }, 'black', { accent: true }),
    s('path', { d: 'M124 140V40', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M124 14l10 26h-20z' }, 'gray')
  ],
  pirámide: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 120h132v14q0 12-12 12H26q-12 0-12-12z' }, 'tan'),
    s('path', { d: 'M24 122l46-68 46 68z' }, 'yellow', { accent: true }),
    s('path', { d: 'M70 54l46 68H86z' }, 'orange'),
    s('path', { d: 'M96 122l26-34 24 34z' }, 'yellow'),
    s('circle', { cx: 122, cy: 38, r: 12 }, 'orange')
  ],
  procesar: [
    s('path', { d: 'M14 112h132', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: dots([[24, 112], [52, 112], [80, 112], [108, 112], [136, 112]], 3) }, 'gray'),
    s('rect', { x: 56, y: 44, width: 48, height: 56, rx: 6 }, 'blue', { accent: true }),
    ...gear(80, 66, 8, 6, 'yellow'),
    s('circle', { cx: 30, cy: 96, r: 10 }, 'brown'),
    s('rect', { x: 120, y: 88, width: 20, height: 18, rx: 3 }, 'orange')
  ],
  prólogo: [
    s('rect', { x: 14, y: 18, width: 132, height: 10 }, 'brown'),
    s('path', { d: 'M14 136h132', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M14 28h52q-6 40 4 104H14z' }, 'red', { accent: true }),
    s('path', { d: 'M146 28H94q6 40-4 104h56z' }, 'red'),
    s('path', { d: 'M30 28v100M128 28v100', ...SW(3) }, 'pink', { stroke: true }),
    s('path', { d: 'M80 34v20', ...SW(2) }, 'gray', { stroke: true }),
    ...person(80, 132, 'blue', { h: 34, w: 22, r: 10 })
  ],
  respetable: [
    s('path', { d: 'M54 140q0-50 34-50t34 50z' }, 'navy', { accent: true }),
    s('circle', { cx: 88, cy: 66, r: 18 }, 'skin'),
    s('path', { d: 'M70 60q0-20 18-20t18 20q-4-8-18-8t-18 8z' }, 'gray'),
    s('path', { d: 'M78 76q10 6 20 0', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M82 92l6 14 6-14', ...SW(3) }, 'red', { stroke: true }),
    ...lean(26, 140, 30, 'green', { h: 30, w: 20, r: 9 })
  ],
  rodaje: [
    s('path', { d: 'M54 92l-22 48M70 92v48M86 92l22 48', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 36, y: 56, width: 60, height: 36, rx: 4 }, 'dark', { accent: true }),
    s('path', { d: dots([[50, 42], [80, 42]], 13) }, 'gray'),
    s('path', { d: 'M96 66l18-8v32l-18-8z' }, 'gray'),
    s('rect', { x: 112, y: 104, width: 34, height: 26, rx: 2 }, 'black'),
    s('path', { d: 'M112 100l32-10 2 8-32 10z' }, 'white'),
    s('path', { d: 'M118 98l6 -2M130 94l6-2', ...SW(4) }, 'black', { stroke: true })
  ],
  rubro: [
    s('path', { d: 'M20 50h40l6-10h20v86H20z' }, 'red'),
    s('path', { d: 'M40 62h40l6-10h20v86H40z' }, 'yellow'),
    s('path', { d: 'M60 74h40l6-10h20v80H60z' }, 'blue', { accent: true }),
    s('path', { d: 'M20 50v86', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M74 100h40M74 112h30', ...SW(4) }, 'white', { stroke: true })
  ],
  sacrificar: [
    s('path', { d: 'M28 30l-3 10M44 22l-3 10M60 30l-3 10M36 48l-3 10M54 50l-3 10', ...SW(3) }, 'blue', { stroke: true }),
    ground(),
    ...person(116, 136, 'gray'),
    ...person(44, 136, 'red', { accent: true }),
    s('path', { d: 'M110 30q-32 4-32 32h64q0-28-32-32z' }, 'orange'),
    s('path', { d: 'M110 62L90 100M56 100h34', ...SW(4) }, 'dark', { stroke: true })
  ],
  sequía: [
    s('circle', { cx: 80, cy: 42, r: 22 }, 'orange', { accent: true }),
    s('path', { d: rays(80, 42, 28, 36, 10), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M14 92h132v54H14z' }, 'tan'),
    s('path', { d: 'M20 108l20 8 10-10 18 14M70 120l20-6 6 16M96 104l18 10 24-6M40 116l-4 22M114 114l2 20', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M30 92V74l-8-8M30 78l8-8', ...SW(3) }, 'brown', { stroke: true })
  ],
  soja: [
    s('path', { d: 'M20 98q10-40 50-46t46 2q-6 30-50 46T20 98z' }, 'green', { accent: true }),
    s('path', { d: dots([[44, 90], [66, 80], [88, 68]], 11) }, 'yellow'),
    s('path', { d: 'M116 54l10-14', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M110 140v-48l8-12V66h12v14l8 12v48z' }, 'dark'),
    s('rect', { x: 112, y: 58, width: 24, height: 10, rx: 2 }, 'red'),
    s('rect', { x: 112, y: 104, width: 24, height: 18 }, 'cream')
  ],
  virrey: [
    s('path', { d: 'M42 140l10-62h56l10 62z' }, 'red', { accent: true }),
    s('path', { d: 'M62 78h36v62H62z' }, 'navy'),
    s('circle', { cx: 80, cy: 60, r: 16 }, 'skin'),
    s('path', { d: 'M58 48q22-26 44 0z' }, 'black'),
    s('path', { d: 'M84 32q14-18 26-14-8 10-22 20z' }, 'white'),
    s('path', { d: 'M126 140V60', ...SW(5) }, 'brown', { stroke: true }),
    s('circle', { cx: 126, cy: 56, r: 7 }, 'yellow'),
    s('path', { d: 'M74 90h12M74 104h12', ...SW(4) }, 'yellow', { stroke: true })
  ],
  agrario: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 70h132v64q0 12-12 12H26q-12 0-12-12z' }, 'brown'),
    s('path', { d: 'M24 146l40-76M60 146l12-76M100 146l-12-76M136 146L96 70', ...SW(5) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M104 66V48h20l6 18z' }, 'red'),
    s('path', { d: dots([[110, 66], [134, 68]], 7) }, 'dark'),
    s('circle', { cx: 40, cy: 38, r: 12 }, 'yellow')
  ],
  agudo: [
    s('path', { d: 'M24 128h112M24 128L130 40', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M74 128a50 50 0 0 0-12-34', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: wedge(24, 128, 46, -40, 0) }, 'pink'),
    s('path', { d: sparkle(130, 40, 14) }, 'yellow')
  ],
  alegar: [
    s('rect', { x: 20, y: 96, width: 56, height: 44 }, 'brown'),
    s('circle', { cx: 48, cy: 56, r: 14 }, 'skin'),
    s('path', { d: 'M28 96q0-24 20-24t20 24z' }, 'black', { accent: true }),
    s('path', { d: 'M64 80l18-24', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: bubble(86, 24, 60, 44) }, 'white'),
    s('path', { d: bubble(86, 24, 60, 44), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M98 40h36M98 52h24', ...SW(4) }, 'navy', { stroke: true })
  ],
  altitud: [
    s('path', { d: 'M14 136l44-62 22 28 18-22 48 56z' }, 'green'),
    s('path', { d: 'M46 90l12-16 8 10z' }, 'white'),
    s('path', { d: jet(110, 40), transform: 'rotate(90 110 40)' }, 'blue', { accent: true }),
    arrow('M26 128V30M18 38l8-8 8 8', 'orange', 4),
    s('path', { d: 'M34 30h56', ...DASH(2, '4 4') }, 'gray', { stroke: true })
  ],
  alumnado: [
    s('rect', { x: 26, y: 14, width: 108, height: 44, rx: 3 }, 'green'),
    s('path', { d: 'M38 30h40M38 42h56', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: dots([[36, 80], [80, 80], [124, 80], [58, 108], [102, 108]], 10) }, 'skin'),
    s('path', { d: busts([36, 80, 124], 104, 22, 16) + busts([58, 102], 132, 22, 16) }, 'blue', { accent: true }),
    s('path', { d: 'M18 104h124M40 132h80', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: dots([[36, 70], [80, 70], [124, 70], [58, 98], [102, 98]], 6) }, 'brown')
  ],
  ambulancia: [
    s('path', { d: 'M14 128h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 56h86v60H18z' }, 'white'),
    s('path', { d: 'M104 72h20l18 22v22h-38z' }, 'white'),
    s('path', { d: 'M18 56h86v60H18zM104 72h20l18 22v22h-38z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M54 72h14v12h12v14H68v12H54V98H42V84h12z' }, 'red', { accent: true }),
    s('path', { d: 'M110 78h12l12 16h-24z' }, 'sky'),
    s('path', { d: dots([[40, 118], [118, 118]], 10) }, 'dark'),
    s('rect', { x: 50, y: 46, width: 18, height: 10, rx: 3 }, 'blue')
  ],
  anal: [
    s('path', { d: 'M40 46h66v68H40zM40 114h44v28H40z' }, 'white'),
    s('path', { d: 'M106 46H40v96h44v-28h22', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 46a16 34 0 0 0 0 68', ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 106, cy: 80, rx: 16, ry: 34 }, 'sky', { accent: true }),
    s('ellipse', { cx: 106, cy: 80, rx: 6, ry: 12 }, 'gray'),
    s('path', { d: 'M40 128h44', ...DASH(2, '3 3') }, 'gray', { stroke: true })
  ],
  arquero: [
    s('circle', { cx: 56, cy: 44, r: 13 }, 'skin'),
    s('rect', { x: 42, y: 60, width: 28, height: 46, rx: 9 }, 'green', { accent: true }),
    s('path', { d: 'M50 106l-6 32M64 106l6 32', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: 'M96 26q30 50 0 100', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M96 26L64 76l32 50', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M64 76h76M132 70l10 6-10 6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 72l-8-4M66 80l-8 4M68 76l26 0', ...SW(4) }, 'skin', { stroke: true })
  ],
  arruinar: [
    s('path', { d: 'M14 120h132v26H14z' }, 'tan'),
    s('path', { d: 'M30 120V90h12v-8h8v8h12v30zM48 82V66h8l2 10z' }, 'yellow', { accent: true }),
    s('path', { d: 'M74 120l10-14 12 6 10-10 8 18z' }, 'yellow'),
    s('path', { d: 'M96 120q10-50 50-60v60z' }, 'blue'),
    s('path', { d: 'M98 100q20-36 48-38', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: dots([[84, 92], [72, 98]], 4) }, 'yellow')
  ],
  aspirante: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 136v-36h32v36M28 100V70', ...SW(4) }, 'brown', { stroke: true }),
    ...person(52, 108, 'blue', { h: 34, w: 24, r: 10, accent: true }),
    s('rect', { x: 60, y: 84, width: 22, height: 28, rx: 2 }, 'yellow'),
    s('path', { d: dots([[110, 70], [134, 70]], 9) }, 'gray'),
    s('path', { d: busts([110, 134], 136, 20, 50) }, 'gray'),
    s('path', { d: star(60, 32, 12) }, 'orange')
  ],
  balear: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'blue'),
    s('path', { d: 'M24 70q10-16 30-12t26 14-18 14-38-16zM92 96q14-8 28 0t-6 14-22-14zM42 116q6-6 14 0t-6 8z' }, 'tan', { accent: true }),
    s('path', { d: 'M30 72q14 10 32 8M96 100q10 4 20 0', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M114 30v34M114 32l16 28h-16z' }, 'white'),
    s('path', { d: 'M114 30v34', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M104 64h24l-4 6h-16z' }, 'red'),
    s('circle', { cx: 36, cy: 34, r: 10 }, 'yellow')
  ],
  beneficiario: [
    ground(),
    ...person(80, 136, 'green', { accent: true }),
    s('path', { d: 'M66 104l-14-18M94 104l14-18', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 80, cy: 30, r: 16 }, 'yellow'),
    s('circle', { cx: 80, cy: 30, r: 9, ...SW(3) }, 'orange', { stroke: true }),
    arrow('M80 50v10M74 56l6 6 6-6', 'orange', 3),
    s('path', { d: sparkle(40, 50, 8) + sparkle(122, 54, 8) }, 'yellow')
  ],
  bigote: [
    s('circle', { cx: 80, cy: 78, r: 56 }, 'skin'),
    s('path', { d: dots([[60, 60], [100, 60]], 5) }, 'dark'),
    s('path', { d: 'M74 70q6 14 12 0', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M80 92q-14-14-32-4-14 8-20 0 4 18 24 18 18 0 28-10 10 10 28 10 20 0 24-18-6 8-20 0-18-10-32 4z' }, 'brown', { accent: true }),
    s('path', { d: 'M68 116q12 6 24 0', ...SW(3) }, 'red', { stroke: true })
  ],
  cacao: [
    s('ellipse', { cx: 58, cy: 74, rx: 30, ry: 50, transform: 'rotate(-20 58 74)' }, 'orange', { accent: true }),
    s('path', { d: 'M48 30q-6 44 22 88M66 26q8 40 2 88', ...SW(3), transform: 'rotate(-20 58 74)' }, 'brown', { stroke: true }),
    s('path', { d: ells([[104, 98, 9, 6], [126, 104, 9, 6], [112, 116, 9, 6]]) }, 'brown'),
    s('path', { d: 'M92 128h48l-4 14h-40z' }, 'cream'),
    s('path', { d: 'M88 128h56', ...SW(4) }, 'brown', { stroke: true })
  ],
  caldo: [
    s('path', { d: 'M18 80h124q-4 56-62 56T18 80z' }, 'red', { accent: true }),
    s('ellipse', { cx: 80, cy: 80, rx: 62, ry: 12 }, 'orange'),
    s('path', { d: dots([[60, 80], [96, 78]], 5) }, 'yellow'),
    s('path', { d: 'M74 82l6 -2M108 82l10 2', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M56 62q-10-12 0-22t0-22M80 62q-10-12 0-22t0-22M104 62q-10-12 0-22t0-22', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M120 72l24-30', ...SW(6) }, 'gray', { stroke: true })
  ],
  calzado: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 132v-20q0-8 8-8h12l6 8q22 0 30 12v8z' }, 'blue', { accent: true }),
    s('path', { d: 'M18 126h56', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M80 132V56h24v40q26 4 32 20v16z' }, 'brown'),
    s('path', { d: 'M80 70h24', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M22 70q4-20 18-8 14 12 30 14v8H38l-10-6-2 18h-6z' }, 'red')
  ],
  casilla: [
    s('path', { d: rects([[26, 26, 30, 30], [26, 66, 30, 30], [26, 106, 30, 30]]), ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 78l10 10 20-24', ...SW(6) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M68 41h66M68 81h66M68 121h50', ...SW(6) }, 'sky', { stroke: true }),
    s('path', { d: 'M100 136l30-48 8 5-30 48-9 4z' }, 'yellow')
  ],
  casta: [
    s('path', { d: 'M80 44v20M40 64h80M40 64v20M120 64v20M40 104v12M24 116h32M120 104v12M104 116h32', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 32, r: 14 }, 'purple', { accent: true }),
    s('path', { d: dots([[40, 94], [120, 94]], 11) }, 'blue'),
    s('path', { d: dots([[24, 128], [56, 128], [104, 128], [136, 128]], 9) }, 'sky'),
    s('path', { d: 'M70 20l4-8 6 6 6-6 4 8z' }, 'yellow')
  ],
  chavismo: [
    s('path', { d: busts([28, 56, 84, 112, 140], 146, 24, 30) }, 'red', { accent: true }),
    s('path', { d: dots([[28, 106], [56, 106], [84, 106], [112, 106], [140, 106]], 10) }, 'skin'),
    s('path', { d: 'M40 116l8-34M126 116l-6-34', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M60 22v66', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M62 24h52v28H62z' }, 'red'),
    s('path', { d: 'M62 38h52', ...SW(3) }, 'yellow', { stroke: true })
  ],
  ciclismo: [
    s('path', { d: 'M14 128h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: ring(44, 106, 20) + ring(110, 106, 20), ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 106l22-26h34l10 26M66 80l12 26H44M78 106l20-26', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M72 74q16-26 40-22M76 74l14 10', ...SW(10) }, 'yellow', { stroke: true, accent: true }),
    s('circle', { cx: 118, cy: 50, r: 10 }, 'skin'),
    s('path', { d: 'M108 46a12 10 0 0 1 22-2z' }, 'red'),
    s('path', { d: 'M14 70h22M18 84h20M22 56h18', ...SW(3) }, 'sky', { stroke: true })
  ],
  competitivo: [
    s('rect', { x: 18, y: 110, width: 124, height: 14, rx: 3 }, 'brown'),
    s('path', { d: dots([[28, 64], [132, 64]], 13) }, 'skin'),
    s('path', { d: busts([28, 132], 110, 26, 34) }, 'blue'),
    s('path', { d: busts([132], 110, 26, 34) }, 'red', { accent: true }),
    s('path', { d: 'M38 96l34-20M122 96l-34-20', ...SW(10) }, 'skin', { stroke: true }),
    s('circle', { cx: 80, cy: 72, r: 9 }, 'skin'),
    s('path', { d: 'M70 46l4 10M90 46l-4 10M80 40v12', ...SW(3) }, 'orange', { stroke: true })
  ],
  condenar: [
    s('rect', { x: 18, y: 26, width: 78, height: 110, rx: 4 }, 'gray'),
    s('circle', { cx: 57, cy: 70, r: 14 }, 'skin'),
    s('path', { d: 'M37 136V100q0-14 20-14t20 14v36z' }, 'orange'),
    s('path', { d: 'M30 26v110M44 26v110M58 26v110M72 26v110M86 26v110', ...SW(4) }, 'dark', { stroke: true, accent: true }),
    s('rect', { x: 104, y: 48, width: 36, height: 16, rx: 4, transform: 'rotate(-30 122 56)' }, 'brown'),
    s('path', { d: 'M124 58l14 26', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M106 136h40', ...SW(6) }, 'brown', { stroke: true })
  ],
  congregación: [
    s('path', { d: 'M60 52V30l20-14 20 14v22z' }, 'cream', { accent: true }),
    s('path', { d: 'M74 52V38a6 6 0 0 1 12 0v14z' }, 'sky'),
    s('path', { d: dots([[28, 80], [56, 80], [84, 80], [112, 80], [140, 80], [42, 112], [70, 112], [98, 112], [126, 112]], 10) }, 'brown'),
    s('path', { d: busts([28, 56, 84, 112, 140], 104, 22, 16) }, 'blue'),
    s('path', { d: busts([42, 70, 98, 126], 140, 22, 22) }, 'purple')
  ],
  conmemoración: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 136V60q40-30 80 0v76z' }, 'gray'),
    s('path', { d: laurel(80, 92, 26, 14, 4) }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 92, r: 12 }, 'yellow'),
    s('path', { d: 'M24 136v-20M136 136v-20', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: dots([[24, 112], [136, 112]], 7) }, 'red'),
    s('path', { d: sparkle(30, 40, 8) + sparkle(130, 36, 8) }, 'orange')
  ],
  conteo: [
    s('rect', { x: 18, y: 26, width: 124, height: 108, rx: 6 }, 'brown'),
    s('rect', { x: 28, y: 36, width: 104, height: 88 }, 'cream'),
    s('path', { d: 'M28 58h104M28 80h104M28 102h104', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[40, 58], [52, 58], [64, 58], [110, 58], [40, 80], [52, 80], [98, 80], [110, 80], [122, 80], [40, 102], [86, 102], [98, 102], [110, 102], [122, 102]], 6) }, 'red', { accent: true }),
    s('path', { d: dots([[76, 58], [88, 58], [98, 58]], 6) }, 'blue')
  ],
  corral: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M20 78v58M56 78v58M92 78v58M128 78v58', ...SW(7) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M14 92h132M14 116h132', ...SW(6) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 70, cy: 58, rx: 22, ry: 14 }, 'white'),
    s('path', { d: ells([[70, 58, 22, 14]]) + 'M56 72v10M84 72v10', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[60, 54], [76, 62]], 5) }, 'dark'),
    s('circle', { cx: 96, cy: 50, r: 10 }, 'dark')
  ],
  cónsul: [
    s('rect', { x: 18, y: 96, width: 124, height: 12 }, 'brown'),
    s('circle', { cx: 60, cy: 50, r: 15 }, 'skin'),
    s('path', { d: 'M36 96q0-30 24-30t24 30z' }, 'navy', { accent: true }),
    s('rect', { x: 92, y: 74, width: 30, height: 22, rx: 3 }, 'red'),
    s('path', { d: 'M100 74V60h14v14', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 34, y: 108, width: 28, height: 36, rx: 3 }, 'brown'),
    s('path', { d: 'M124 22v74', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M126 24h18v14h-18z' }, 'sky')
  ],
  disfraz: [
    s('path', { d: 'M20 66q30-20 60-2 30-18 60 2-4 30-30 30-20 0-30-14-10 14-30 14-26 0-30-30z' }, 'purple', { accent: true }),
    s('path', { d: ells([[48, 74, 12, 8], [112, 74, 12, 8]]) }, 'white'),
    s('path', { d: 'M104 92l18 50', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: sparkle(80, 30, 10) + sparkle(30, 34, 6) + sparkle(132, 36, 6) }, 'yellow'),
    s('path', { d: 'M20 66q-6-10 4-16M140 66q6-10-4-16', ...SW(4) }, 'pink', { stroke: true })
  ],
  ecosistema: [
    s('circle', { cx: 80, cy: 80, r: 64 }, 'mint'),
    s('path', { d: 'M16 96h128q-8 40-64 48-56-8-64-48z' }, 'blue'),
    s('path', { d: fishes([[90, 116]]) }, 'orange'),
    s('path', { d: 'M50 96V62', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 50, cy: 52, r: 18 }, 'green', { accent: true }),
    s('circle', { cx: 110, cy: 42, r: 12 }, 'yellow'),
    s('path', { d: birds([[96, 70], [124, 66]]), ...SW(3) }, 'dark', { stroke: true })
  ],
  elite: [
    s('path', { d: dots([[32, 128], [56, 128], [80, 128], [104, 128], [128, 128], [44, 104], [68, 104], [92, 104], [116, 104], [56, 80], [80, 80], [104, 80]], 9) }, 'gray'),
    s('path', { d: dots([[68, 56], [92, 56]], 10) }, 'yellow', { accent: true }),
    s('path', { d: star(80, 26, 12) }, 'orange'),
    s('path', { d: sparkle(40, 50, 7) + sparkle(120, 50, 7) }, 'yellow')
  ],
  emigrante: [
    ground(),
    s('path', { d: 'M14 136V96l18-16 18 16v40z' }, 'cream'),
    s('path', { d: 'M10 98l22-20 22 20', ...SW(4) }, 'red', { stroke: true }),
    ...person(84, 136, 'blue', { accent: true }),
    s('rect', { x: 100, y: 106, width: 22, height: 28, rx: 3 }, 'brown'),
    arrow('M106 40h34M130 32l10 8-10 8', 'orange', 5),
    s('path', { d: jet(126, 76), transform: 'rotate(60 126 76)' }, 'gray')
  ],
  empeño: [
    s('path', { d: 'M14 136L146 76v70H14z' }, 'green'),
    s('circle', { cx: 100, cy: 70, r: 26 }, 'gray', { accent: true }),
    ...lean(52, 128, 50, 'red'),
    s('path', { d: 'M66 92l10-6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M34 50q-6-6 0-12M44 42q-6-6 0-12', ...SW(3) }, 'sky', { stroke: true })
  ],
  emprendimiento: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 30, y: 60, width: 100, height: 76 }, 'cream'),
    s('path', { d: 'M26 44h108v20H26z' }, 'blue'),
    s('path', { d: 'M26 64q9 10 18 0t18 0 18 0 18 0 18 0 18 0z' }, 'white'),
    s('rect', { x: 66, y: 92, width: 28, height: 44 }, 'brown'),
    s('path', { d: 'M20 104h120', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M80 104l-10 14M80 104l10 14', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: sparkle(80, 24, 10) }, 'yellow')
  ],
  feroz: [
    s('path', { d: 'M30 30l16 34M130 30l-16 34' , ...SW(14) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 70q10-30 52-30t52 30q0 30-26 46l-26 20-26-20q-26-16-26-46z' }, 'gray', { accent: true }),
    s('path', { d: 'M50 70l18 6M110 70l-18 6', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[60, 80], [100, 80]], 4) }, 'yellow'),
    s('path', { d: 'M60 104q20-12 40 0-20 24-40 0z' }, 'red'),
    s('path', { d: 'M64 103l4 8 4-6 4 6 4-6 4 6 4-6 4 6 4-8z' }, 'white'),
    s('circle', { cx: 80, cy: 94, r: 6 }, 'dark')
  ],
  firmemente: [
    s('path', { d: 'M14 70h132', ...SW(12) }, 'gray', { stroke: true }),
    s('rect', { x: 48, y: 52, width: 64, height: 50, rx: 16 }, 'skin', { accent: true }),
    s('path', { d: 'M64 54v20M80 54v20M96 54v20', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M48 84h40q8 0 8 8', ...SW(6) }, 'tan', { stroke: true }),
    s('rect', { x: 56, y: 100, width: 48, height: 40 }, 'navy'),
    s('path', { d: 'M38 46l-8-8M122 46l8-8M38 94l-8 8M122 94l8 8', ...SW(4) }, 'orange', { stroke: true })
  ],
  generador: [
    s('rect', { x: 18, y: 60, width: 76, height: 60, rx: 8 }, 'red', { accent: true }),
    s('path', { d: 'M28 72h56M28 84h56M28 96h56', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 120v14M88 120v14', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M94 90q24 0 26-30', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 120, cy: 42, r: 16 }, 'yellow'),
    s('rect', { x: 113, y: 56, width: 14, height: 8 }, 'gray'),
    s('path', { d: 'M52 28l-8 14h12l-8 14', ...SW(4) }, 'yellow', { stroke: true })
  ],
  gozar: [
    s('rect', { x: 14, y: 70, width: 132, height: 76, rx: 10 }, 'sky'),
    s('ellipse', { cx: 76, cy: 104, rx: 48, ry: 16 }, 'pink', { accent: true }),
    s('ellipse', { cx: 76, cy: 102, rx: 30, ry: 7 }, 'sky'),
    s('circle', { cx: 50, cy: 86, r: 12 }, 'skin'),
    s('path', { d: 'M42 84h18', ...SW(5) }, 'black', { stroke: true }),
    s('path', { d: 'M60 98h44', ...SW(10) }, 'orange', { stroke: true }),
    s('circle', { cx: 128, cy: 34, r: 14 }, 'yellow'),
    s('path', { d: 'M110 86l6-24h14l-4 24z' }, 'red')
  ],
  graduado: [
    s('path', { d: 'M44 140q0-50 36-50t36 50z' }, 'black'),
    s('circle', { cx: 80, cy: 66, r: 18 }, 'skin'),
    s('path', { d: 'M80 30l40 14-40 14-40-14z' }, 'navy', { accent: true }),
    s('path', { d: 'M116 46v18', ...SW(3) }, 'yellow', { stroke: true }),
    s('rect', { x: 96, y: 100, width: 42, height: 14, rx: 7, transform: 'rotate(-30 117 107)' }, 'cream'),
    s('path', { d: 'M114 98l6 14', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M70 70q10 8 20 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  habitar: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'green', { stroke: true }),
    s('rect', { x: 100, y: 26, width: 14, height: 30 }, 'brown'),
    s('path', { d: 'M28 136V76l52-42 52 42v60z' }, 'cream', { accent: true }),
    s('path', { d: 'M20 80l60-50 60 50', ...SW(6) }, 'red', { stroke: true }),
    s('rect', { x: 42, y: 84, width: 30, height: 26 }, 'yellow'),
    s('path', { d: dots([[57, 100]], 7) + busts([57], 110, 14, 8) }, 'navy'),
    s('rect', { x: 90, y: 96, width: 22, height: 40 }, 'brown'),
    s('path', { d: 'M108 20q8-8 0-14', ...SW(3) }, 'gray', { stroke: true })
  ],
  hemisferio: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'sky'),
    s('path', { d: 'M20 80a60 60 0 0 1 120 0z' }, 'blue', { accent: true }),
    s('path', { d: 'M48 50q12 4 8 16t12 14M98 36q-4 14 12 18', ...SW(9) }, 'green', { stroke: true }),
    s('path', { d: 'M14 80h132', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: ring(80, 80, 60), ...SW(3) }, 'navy', { stroke: true })
  ],
  hoyo: [
    s('path', { d: 'M14 100q66-24 132 0v46H14z' }, 'green'),
    s('ellipse', { cx: 92, cy: 108, rx: 20, ry: 7 }, 'dark', { accent: true }),
    s('path', { d: 'M92 108V24', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M92 24l30 10-30 10z' }, 'red'),
    s('circle', { cx: 46, cy: 116, r: 7 }, 'white'),
    s('circle', { cx: 46, cy: 116, r: 7, ...SW(1.5) }, 'gray', { stroke: true })
  ],
  inca: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 120l40-80 28 40 18-20 46 60v14q0 12-12 12H26q-12 0-12-12z' }, 'green'),
    s('path', { d: 'M30 112h100v12H30zM44 100h72v12H44zM58 88h44v12H58z' }, 'tan', { accent: true }),
    s('path', { d: 'M30 112h100M44 100h72M58 88h44', ...SW(2) }, 'brown', { stroke: true }),
    s('rect', { x: 74, y: 76, width: 12, height: 12 }, 'brown')
  ],
  inestable: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 44, y: 108, width: 56, height: 28 }, 'blue'),
    s('rect', { x: 50, y: 78, width: 48, height: 28, transform: 'rotate(8 74 92)' }, 'green'),
    s('rect', { x: 56, y: 50, width: 40, height: 26, transform: 'rotate(-10 76 63)' }, 'orange', { accent: true }),
    s('rect', { x: 70, y: 22, width: 30, height: 24, transform: 'rotate(18 85 34)' }, 'red'),
    s('path', { d: 'M114 30q8 6 0 14M122 22q12 12 0 28M36 60q-8 6 0 14', ...SW(3) }, 'gray', { stroke: true })
  ],
  insuficiente: [
    s('rect', { x: 22, y: 50, width: 104, height: 60, rx: 8 }, 'white'),
    s('rect', { x: 22, y: 50, width: 104, height: 60, rx: 8, ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 126, y: 68, width: 12, height: 24, rx: 3 }, 'dark'),
    s('rect', { x: 32, y: 60, width: 20, height: 40, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M62 60v40M82 60v40M102 60v40', ...DASH(2, '4 4') }, 'gray', { stroke: true })
  ],
  irresponsable: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    ...person(44, 136, 'purple', { accent: true }),
    s('rect', { x: 52, y: 72, width: 14, height: 22, rx: 3 }, 'dark'),
    s('path', { d: 'M52 96l6-6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M92 90h48l-6 26h-36z' }, 'gray'),
    s('path', { d: 'M92 90q-6 20 0 46M140 90q6 20 0 46', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M104 82q-6-10 0-18M122 80q-6-10 0-18', ...SW(3) }, 'gray', { stroke: true })
  ],
  latir: [
    s('path', { d: heart(80, 70, 34) }, 'red', { accent: true }),
    s('path', { d: 'M28 40q-10 14 0 28M18 32q-14 22 0 44M132 40q10 14 0 28M142 32q14 22 0 44', ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: 'M14 128h40l8-16 10 28 10-34 8 22h56', ...SW(4) }, 'red', { stroke: true })
  ],
  logística: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 20v116M70 20v116M18 60h52M18 98h52', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[22, 36, 20, 22], [44, 40, 22, 18], [22, 76, 22, 20], [46, 72, 20, 24], [24, 114, 40, 20]]) }, 'tan'),
    s('rect', { x: 84, y: 92, width: 44, height: 30, rx: 4 }, 'yellow', { accent: true }),
    s('path', { d: 'M90 92V62h20l8 30', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M132 50v76M132 108h14', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[96, 126], [120, 126]], 8) }, 'dark'),
    s('rect', { x: 136, y: 92, width: 10, height: 14 }, 'tan')
  ],
  marfil: [
    s('path', { d: 'M40 44q0-24 40-24t40 24v40q0 16-14 18H54q-14-2-14-18z' }, 'gray'),
    s('path', { d: ells([[30, 60, 16, 28], [130, 60, 16, 28]]) }, 'gray'),
    s('path', { d: dots([[64, 58], [96, 58]], 4) }, 'dark'),
    s('path', { d: 'M80 96q-6 30 4 44', ...SW(12) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 98q-6 30-28 34-2-10 12-16 8-6 8-18zM102 98q6 30 28 34 2-10-12-16-8-6-8-18z' }, 'cream', { accent: true }),
    s('path', { d: 'M58 98q-6 30-28 34-2-10 12-16 8-6 8-18zM102 98q6 30 28 34 2-10-12-16-8-6-8-18z', ...SW(1.5) }, 'tan', { stroke: true })
  ],
  narrador: [
    s('circle', { cx: 56, cy: 54, r: 16 }, 'skin'),
    s('path', { d: 'M24 140q0-60 32-60t32 60z' }, 'green', { accent: true }),
    s('path', { d: 'M52 96l28 6 28-6v36l-28 6-28-6z' }, 'white'),
    s('path', { d: 'M52 96l28 6 28-6v36l-28 6-28-6zM80 102v36', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M72 56q8 0 8 6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 40q8 8 0 16M108 32q14 16 0 32M120 24q20 24 0 48', ...SW(3) }, 'orange', { stroke: true })
  ],
  normar: [
    s('rect', { x: 20, y: 22, width: 76, height: 104, rx: 4 }, 'navy', { accent: true }),
    s('rect', { x: 28, y: 30, width: 60, height: 88, rx: 2 }, 'white'),
    s('path', { d: dots([[36, 46], [36, 66], [36, 86], [36, 106]], 4) }, 'navy'),
    s('path', { d: 'M46 46h34M46 66h34M46 86h34M46 106h24', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 102, y: 64, width: 40, height: 16, rx: 4, transform: 'rotate(-30 122 72)' }, 'brown'),
    s('path', { d: 'M124 74l14 26', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M104 132h40', ...SW(6) }, 'brown', { stroke: true })
  ],
  nómina: [
    ...paper(24, 16, 112, 128),
    s('path', { d: dots([[42, 42], [42, 72], [42, 102]], 9) }, 'blue'),
    s('path', { d: 'M58 42h40M58 72h40M58 102h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[116, 42], [116, 72], [116, 102]], 8) }, 'yellow', { accent: true }),
    s('path', { d: 'M40 126h80', ...SW(4) }, 'green', { stroke: true })
  ],
  obrador: [
    s('rect', { x: 20, y: 30, width: 120, height: 106, rx: 10 }, 'brown'),
    s('path', { d: 'M38 96V74a42 30 0 0 1 84 0v22z' }, 'dark'),
    s('path', { d: 'M44 96q10-20 20-6 8-16 18 0 10-16 18 0 10-14 18 6z' }, 'orange', { accent: true }),
    s('path', { d: 'M20 108h120', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: ells([[46, 122, 16, 8], [80, 122, 16, 8], [114, 122, 16, 8]]) }, 'tan'),
    s('path', { d: 'M40 120l4-4M74 120l4-4M108 120l4-4', ...SW(2) }, 'brown', { stroke: true })
  ],
  orientar: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'cream'),
    s('circle', { cx: 80, cy: 80, r: 60, ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: rays(80, 80, 46, 54, 8), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 28l12 52H68z' }, 'red', { accent: true }),
    s('path', { d: 'M80 132l12-52H68z' }, 'gray'),
    s('circle', { cx: 80, cy: 80, r: 6 }, 'dark')
  ],
  paradigma: [
    s('path', { d: star(42, 60, 28) }, 'yellow', { accent: true }),
    s('path', { d: star(42, 60, 34), ...DASH(2, '4 3') }, 'orange', { stroke: true }),
    arrow('M76 60h20M88 52l8 8-8 8', 'gray', 4),
    s('path', { d: star(120, 40, 14) + star(120, 80, 14) + star(120, 120, 14) + star(42, 120, 14) }, 'orange')
  ],
  perrito: [
    s('ellipse', { cx: 92, cy: 110, rx: 34, ry: 20 }, 'tan'),
    s('path', { d: 'M70 120v18M84 124v14M106 124v14M118 118v20', ...SW(7) }, 'tan', { stroke: true }),
    s('path', { d: 'M124 100q16-10 14-24', ...SW(5) }, 'tan', { stroke: true }),
    s('circle', { cx: 56, cy: 74, r: 26 }, 'tan', { accent: true }),
    s('path', { d: ells([[34, 72, 9, 18], [78, 72, 9, 18]]) }, 'brown'),
    s('path', { d: dots([[48, 70], [64, 70]], 3.5) + dots([[56, 84]], 5) }, 'dark'),
    s('path', { d: 'M54 90q2 8 6 0', ...SW(3) }, 'pink', { stroke: true })
  ],
  peste: [
    s('ellipse', { cx: 76, cy: 100, rx: 40, ry: 26 }, 'gray', { accent: true }),
    s('path', { d: 'M38 104q-20 8-22 30', ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: 'M108 86l20 10-18 14z' }, 'gray'),
    s('path', { d: dots([[100, 78]], 9) }, 'pink'),
    s('path', { d: dots([[116, 94]], 3) + dots([[130, 98]], 3) }, 'dark'),
    s('path', { d: burst(44, 36, 14, 9, 8) + burst(84, 30, 10, 6, 8) + burst(124, 48, 12, 8, 8) }, 'green')
  ],
  plantación: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 60h132v74q0 12-12 12H26q-12 0-12-12z' }, 'tan'),
    s('path', { d: dots([[30, 70], [56, 70], [82, 70], [108, 70], [134, 70]], 8) }, 'green'),
    s('path', { d: dots([[32, 96], [64, 96], [96, 96], [128, 96]], 12) }, 'green', { accent: true }),
    s('path', { d: dots([[40, 130], [80, 130], [120, 130]], 16) }, 'green'),
    s('path', { d: dots([[36, 126], [76, 132], [124, 126], [60, 92], [92, 100]], 3) }, 'red')
  ],
  porquería: [
    s('path', { d: 'M22 136q4-40 30-44 10-20 30-12 20-10 34 8 22 6 22 48z' }, 'brown', { accent: true }),
    s('path', { d: 'M40 120l14-14 10 6M92 112l14 6-6 10M70 96l-4 14', ...SW(4) }, 'tan', { stroke: true }),
    s('rect', { x: 100, y: 84, width: 18, height: 24, rx: 3, transform: 'rotate(20 109 96)' }, 'red'),
    s('path', { d: 'M46 54q4-6 8 0M74 40q4-6 8 0M104 52q4-6 8 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[50, 58], [78, 44], [108, 56]], 3) }, 'dark'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  premisa: [
    s('rect', { x: 24, y: 104, width: 112, height: 32, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 40, y: 72, width: 80, height: 30, rx: 4 }, 'tan'),
    s('rect', { x: 56, y: 42, width: 48, height: 28, rx: 4 }, 'tan'),
    s('circle', { cx: 80, cy: 24, r: 12 }, 'yellow'),
    s('path', { d: 'M24 136h112', ...SW(4) }, 'navy', { stroke: true })
  ],
  preparativo: [
    s('rect', { x: 20, y: 32, width: 70, height: 104, rx: 6 }, 'brown'),
    s('rect', { x: 28, y: 42, width: 54, height: 86, rx: 2 }, 'white'),
    s('path', { d: 'M34 58l4 4 8-8M34 82l4 4 8-8', ...SW(3) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M52 58h24M52 82h24M52 106h18M36 106h8', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[118, 46, 14, 18], [134, 66, 10, 13]]) }, 'pink'),
    s('path', { d: 'M118 64v40M134 80v24', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 100, y: 104, width: 44, height: 32, rx: 3 }, 'red'),
    s('path', { d: 'M122 104v32M100 120h44', ...SW(4) }, 'yellow', { stroke: true })
  ],
  prieto: [
    s('path', { d: 'M40 40h80l-8 96H48z' }, 'black', { accent: true }),
    s('ellipse', { cx: 80, cy: 40, rx: 40, ry: 8 }, 'dark'),
    s('path', { d: 'M40 40h80', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M76 40q-4-16 8-24', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M86 18l30-6', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M48 136q-14 6-26 2 4-10 26-8z' }, 'black')
  ],
  racha: [
    s('path', { d: 'M18 46q40-8 70 4t40-6M14 70q50-6 90 6M24 92q40-6 70 2', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: 'M96 70q24-30 50-14l-14 26z' }, 'red', { accent: true }),
    s('path', { d: 'M114 70l-10 50q0 10 8 10', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: leaflet(40, 120, -30, 20, 6) + leaflet(70, 132, 10, 18, 6) + leaflet(130, 34, 200, 16, 5) }, 'orange'),
    s('path', { d: 'M14 140h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  realismo: [
    s('rect', { x: 18, y: 22, width: 76, height: 80, rx: 2 }, 'white'),
    s('rect', { x: 18, y: 22, width: 76, height: 80, rx: 2, ...SW(5) }, 'brown', { stroke: true }),
    s('circle', { cx: 56, cy: 66, r: 20 }, 'red', { accent: true }),
    s('path', { d: 'M56 46q2-10 10-12M54 48q-4-6-10-6', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M34 102l-8 40M78 102l8 40', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 122, cy: 120, r: 18 }, 'red'),
    s('path', { d: 'M122 102q2-8 8-10', ...SW(3) }, 'green', { stroke: true })
  ],
  refuerzo: [
    ground(),
    s('path', { d: dots([[30, 74], [56, 74], [82, 74]], 11) }, 'skin'),
    s('path', { d: busts([30, 56, 82], 136, 22, 50) }, 'blue'),
    s('path', { d: dots([[112, 74], [138, 74]], 11) }, 'skin'),
    s('path', { d: busts([112, 138], 136, 22, 50) }, 'green', { accent: true }),
    arrow('M140 40h-40M110 32l-10 8 10 8', 'orange', 5)
  ]
};
