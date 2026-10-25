// Illustration specs for words still undrawn in batches 0060–0062 (see server/scripts/lexicon/art.js)
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
  derivar: [
    s('path', { d: 'M14 136h132v8H14z' }, 'green'),
    s('path', { d: 'M80 138V92', ...SW(18) }, 'blue', { stroke: true }),
    s('path', { d: 'M80 94Q46 78 32 30M80 94V26M80 94Q114 78 128 30', ...SW(10) }, 'sky', { stroke: true, accent: true }),
    s('path', { d: dots([[32, 26], [80, 22], [128, 26]], 9) }, 'blue')
  ],
  dique: [
    s('rect', { x: 14, y: 52, width: 62, height: 84 }, 'blue', { accent: true }),
    s('path', { d: 'M24 70q8-4 16 0t16 0M24 92q8-4 16 0t16 0', ...SW(3) }, 'sky', { stroke: true }),
    s('rect', { x: 92, y: 114, width: 54, height: 22 }, 'sky'),
    s('path', { d: 'M70 40h20l12 96H62z' }, 'gray'),
    s('path', { d: 'M68 56h24M66 80h30M64 104h34', ...SW(2) }, 'dark', { stroke: true }),
    ground(138)
  ],
  'engaño': [
    ground(),
    s('path', { d: 'M54 132l-6-48', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M30 84l90-24 12 44-90 24z' }, 'tan', { accent: true }),
    s('path', { d: 'M30 84l90-24 12 44-90 24z', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M70 134l30-16v16z' }, 'yellow'),
    s('path', { d: dots([[86, 128], [94, 125]], 2) }, 'orange'),
    s('path', { d: 'M52 96q-20 10-34 38', ...SW(2) }, 'dark', { stroke: true })
  ],
  escultor: [
    ground(),
    ...person(44, 136, 'blue', { accent: true }),
    s('path', { d: 'M96 136V62q0-22 20-22t20 22v74z' }, 'gray'),
    s('path', { d: 'M104 136q0-20 12-22q-10-6-8-20q2-14 8-14q6 0 8 14q2 14-8 20q12 2 12 22', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 74l26 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 60l10 22', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 50, y: 50, width: 18, height: 12, rx: 2, transform: 'rotate(-24 59 56)' }, 'dark')
  ],
  estancamiento: [
    s('ellipse', { cx: 80, cy: 112, rx: 64, ry: 26 }, 'green'),
    s('ellipse', { cx: 80, cy: 112, rx: 50, ry: 18 }, 'mint'),
    s('path', { d: ells([[60, 110, 12, 5], [100, 116, 8, 4]]) }, 'green'),
    s('path', { d: rects([[56, 24, 16, 48], [88, 24, 16, 48]]) }, 'orange', { accent: true }),
    s('path', { d: dots([[118, 98], [124, 92]], 3) }, 'dark')
  ],
  exterminio: [
    s('rect', { x: 26, y: 60, width: 34, height: 74, rx: 8 }, 'red', { accent: true }),
    s('rect', { x: 34, y: 44, width: 18, height: 18, rx: 3 }, 'gray'),
    s('path', { d: 'M52 48h10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[72, 44], [80, 52], [76, 36], [88, 42], [86, 58], [96, 50]], 3) }, 'gray'),
    s('ellipse', { cx: 118, cy: 92, rx: 14, ry: 18 }, 'dark'),
    s('circle', { cx: 118, cy: 68, r: 8 }, 'dark'),
    s('path', { d: 'M104 82l-12-6M104 94H90M104 106l-12 6M132 82l12-6M132 94h12M132 106l12 6M114 62l-6-10M122 62l6-10', ...SW(3) }, 'dark', { stroke: true })
  ],
  faceta: [
    s('path', { d: 'M46 34h68l26 32-60 72-60-72z' }, 'sky'),
    s('path', { d: 'M46 34l16 32h36l16-32M20 66h120M62 66l18 72 18-72M80 34l-18 32M80 34l18 32', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M62 66h36l-18 72z' }, 'blue', { accent: true }),
    s('path', { d: sparkle(126, 30, 10) }, 'yellow')
  ],
  'falsificación': [
    s('rect', { x: 18, y: 38, width: 124, height: 84, rx: 8 }, 'white'),
    outline({ x: 18, y: 38, width: 124, height: 84, rx: 8 }),
    s('rect', { x: 28, y: 50, width: 46, height: 60, rx: 4 }, 'sky'),
    s('circle', { cx: 51, cy: 74, r: 14 }, 'skin'),
    s('path', { d: 'M34 72q8-6 17-1q9-5 17 1q-4 8-17 3q-13 5-17-3z' }, 'black', { accent: true }),
    s('path', { d: 'M84 60h46M84 76h46M84 92h30', ...SW(4) }, 'gray', { stroke: true })
  ],
  faz: [
    s('path', { d: 'M30 80q0-56 50-56t50 56q0-34-50-34T30 80z' }, 'brown'),
    ...face(80, 84, 46, 'skin', 'smile', { accent: true }),
    s('path', { d: 'M34 72q0-44 46-44t46 44q-14-26-46-26T34 72z' }, 'brown')
  ],
  ferroviario: [
    s('path', { d: 'M48 142l26-112M112 142L86 30', ...SW(5) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: 'M36 136h88M44 112h72M52 92h56M60 74h40M66 58h28M70 44h20', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 64, y: 16, width: 32, height: 22, rx: 6 }, 'red'),
    s('path', { d: dots([[72, 32], [88, 32]], 3) }, 'yellow')
  ],
  gago: [
    s('circle', { cx: 46, cy: 98, r: 26 }, 'skin'),
    s('path', { d: 'M24 136q0-14 22-14t22 14z' }, 'blue'),
    s('path', { d: 'M56 106q6 4 12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 52, cy: 92, r: 3 }, 'dark'),
    s('path', { d: bubble(66, 22, 80, 54) }, 'cream'),
    s('path', { d: bubble(66, 22, 80, 54), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M78 48h12M96 48h6M108 48h6M120 48h14', ...SW(6) }, 'orange', { stroke: true, accent: true })
  ],
  ganadero: [
    ground(),
    ...person(40, 136, 'green', { accent: true }),
    s('path', { d: 'M18 72h44M28 72q2-14 12-14t12 14', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M86 108v28M96 108v28M126 108v28M136 108v28', ...SW(6) }, 'tan', { stroke: true }),
    s('rect', { x: 80, y: 82, width: 62, height: 32, rx: 14 }, 'tan'),
    s('ellipse', { cx: 76, cy: 84, rx: 12, ry: 10 }, 'tan'),
    s('path', { d: ells([[104, 92, 8, 6], [126, 102, 6, 5]]) + 'M66 74l-4-8M84 74l4-8' }, 'brown')
  ],
  'geología': [
    s('path', { d: 'M14 140V96q30-14 66-6t66-4v54z' }, 'brown'),
    s('path', { d: 'M14 112q30-12 66-4t66-6v14q-30 4-66-2t-66 10z' }, 'tan'),
    s('path', { d: 'M14 96q30-14 66-6t66-4v16q-30 6-66-2t-66 10z' }, 'orange', { accent: true }),
    s('path', { d: dots([[40, 130], [96, 128], [122, 134]], 4) }, 'gray'),
    s('path', { d: 'M70 76L100 30', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M88 28l22 10', ...SW(10) }, 'gray', { stroke: true })
  ],
  grato: [
    s('rect', { x: 34, y: 72, width: 92, height: 64, rx: 4 }, 'red', { accent: true }),
    s('rect', { x: 28, y: 58, width: 104, height: 20, rx: 4 }, 'pink'),
    s('path', { d: 'M80 58v78', ...SW(10) }, 'yellow', { stroke: true }),
    s('path', { d: 'M80 58q-26-26-30-6t30 6q26-26 30-6t-30 6', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: heart(36, 30, 10) + heart(124, 26, 8) }, 'pink')
  ],
  gringo: [
    ground(),
    ...person(60, 136, 'orange', { accent: true }),
    s('rect', { x: 84, y: 98, width: 40, height: 38, rx: 5 }, 'brown'),
    s('path', { d: 'M96 98v-8h16v8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M74 96l14 4', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: jet(118, 40), transform: 'rotate(60 118 40)' }, 'sky'),
    s('path', { d: 'M48 66h24', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 62, y: 64, width: 12, height: 10, rx: 2 }, 'dark')
  ],
  homofobia: [
    s('path', { d: 'M30 50q0-20 22-20q6-14 24-12q18-10 32 2q22-2 24 16q14 14-4 22H38q-14-2-8-8z' }, 'dark'),
    s('path', { d: 'M86 66l-12 18h12l-8 18', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: heart(80, 112, 30) }, 'red', { accent: true }),
    s('path', { d: 'M38 98h84M42 108h76M50 118h60', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M80 82l-6 14 10 8-6 14', ...SW(4) }, 'white', { stroke: true })
  ],
  indulto: [
    s('rect', { x: 18, y: 30, width: 70, height: 106, rx: 4 }, 'gray'),
    s('path', { d: 'M30 30v106M44 30v106M58 30v106M72 30v106', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M88 30l34 14v108l-34-16z' }, 'dark'),
    s('path', { d: 'M110 68q10-14 26-6q-6 10-18 10l-6 8q-12-2-16-12z' }, 'white', { accent: true }),
    s('path', { d: 'M110 68q10-14 26-6q-6 10-18 10l-6 8q-12-2-16-12z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 66q-6-20 10-28q2 18-4 28z' }, 'white'),
    s('path', { d: 'M108 66q-6-20 10-28q2 18-4 28z', ...SW(2) }, 'gray', { stroke: true })
  ],
  infernal: [
    s('path', { d: 'M20 140q-8-40 20-62q-4 22 10 26q-10-40 30-74q-4 36 20 50q4-20 22-24q-8 20 4 34q14-8 14-24q16 30-4 74z' }, 'red', { accent: true }),
    s('path', { d: 'M42 140q-6-26 14-40q0 14 8 18q-2-28 18-46q0 26 16 36q8-10 14-12q-4 22 6 44z' }, 'orange'),
    s('path', { d: 'M62 140q-4-16 10-26q2 10 8 12q2-16 12-22q0 22 10 36z' }, 'yellow')
  ],
  ingenioso: [
    s('circle', { cx: 58, cy: 102, r: 26 }, 'skin'),
    s('path', { d: 'M28 140q0-14 30-14t30 14z' }, 'purple'),
    s('path', { d: dots([[50, 98], [66, 98]], 3) + 'M50 110q8 6 16 0' }, 'dark'),
    s('path', { d: 'M96 70q-18-6-18-28a24 24 0 0 1 48 0q0 22-18 28z' }, 'yellow', { accent: true }),
    s('rect', { x: 96, y: 70, width: 12, height: 12, rx: 2 }, 'gray'),
    s('path', { d: halfRays(102, 42, 30, 40, 5) }, 'orange'),
    s('path', { d: halfRays(102, 42, 30, 40, 5), ...SW(4) }, 'orange', { stroke: true })
  ],
  inquietante: [
    s('circle', { cx: 80, cy: 84, r: 48 }, 'tan', { accent: true }),
    s('path', { d: 'M52 62l18 6M108 62l-18 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[64, 80], [96, 80]], 6) }, 'dark'),
    s('path', { d: 'M58 110q6-6 11 0t11 0t11 0t11 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: drop(124, 56, 6) }, 'sky'),
    s('path', { d: 'M22 60q-6 8 0 16t0 16M138 96q6 8 0 16t0 16', ...SW(3) }, 'gray', { stroke: true })
  ],
  legalizar: [
    ...paper(30, 22, 80, 108),
    s('path', { d: 'M42 42h56M42 56h56M42 70h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M90 108l-8 30 12-6 6 10 6-30M110 108l8 30-12-6-6 10-6-30' }, 'red'),
    s('circle', { cx: 100, cy: 100, r: 20 }, 'red', { accent: true }),
    s('path', { d: 'M90 100l7 7 13-14', ...SW(4) }, 'white', { stroke: true })
  ],
  lesionar: [
    s('circle', { cx: 80, cy: 42, r: 18 }, 'skin'),
    s('path', { d: 'M62 38h36', ...SW(8) }, 'white', { stroke: true }),
    s('rect', { x: 56, y: 64, width: 48, height: 72, rx: 16 }, 'blue'),
    s('path', { d: 'M58 74l46 30-14 14-34-16z' }, 'white', { accent: true }),
    s('path', { d: 'M58 74l46 30-14 14-34-16z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M78 102h18', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M118 34l10 6M120 52h10M118 70l10-6', ...SW(4) }, 'red', { stroke: true })
  ],
  'lácteo': [
    s('path', { d: 'M28 56h40v76a6 6 0 0 1-6 6H34a6 6 0 0 1-6-6zM28 56l20-24 20 24z' }, 'white'),
    s('path', { d: 'M28 56h40v76a6 6 0 0 1-6 6H34a6 6 0 0 1-6-6zM28 56l20-24 20 24z', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 28, y: 76, width: 40, height: 26 }, 'blue', { accent: true }),
    s('path', { d: 'M78 138l64-12v-34l-64 20z' }, 'yellow'),
    s('path', { d: 'M78 112l64-20-26-14z' }, 'orange'),
    s('path', { d: dots([[96, 120], [122, 112]], 4) }, 'orange')
  ],
  'mamífero': [
    ground(),
    s('path', { d: 'M30 100v36M48 104v32M100 104v32M116 100v36', ...SW(8) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 74, cy: 90, rx: 50, ry: 22 }, 'tan', { accent: true }),
    s('circle', { cx: 128, cy: 66, r: 16 }, 'tan'),
    s('path', { d: 'M120 52l4-12 8 10z' }, 'brown'),
    s('ellipse', { cx: 70, cy: 120, rx: 18, ry: 10 }, 'pink'),
    s('circle', { cx: 56, cy: 118, r: 8 }, 'pink'),
    s('circle', { cx: 132, cy: 64, r: 2.5 }, 'dark')
  ],
  'matón': [
    ground(),
    ...person(58, 136, 'red', { h: 62, w: 44, r: 17, accent: true }),
    s('circle', { cx: 92, cy: 48, r: 11 }, 'skin'),
    s('path', { d: 'M78 80l12-24', ...SW(9) }, 'red', { stroke: true }),
    s('path', { d: 'M46 52l10 4M70 52l-10 4', ...SW(3) }, 'dark', { stroke: true }),
    ...person(124, 136, 'sky', { h: 30, w: 20, r: 9 }),
    s('path', { d: drop(130, 100, 3) }, 'blue')
  ],
  medioambiente: [
    s('circle', { cx: 80, cy: 88, r: 50 }, 'blue', { accent: true }),
    s('path', { d: 'M46 60q12-10 26-4t10 18q-10 10-6 22q-12 6-20-6t-14-12q-6-10 4-18zM96 92q14-8 24 4t2 26q-14 8-22-4t-4-26z' }, 'green'),
    s('path', { d: leaflet(80, 40, -60, 34, 12) }, 'green'),
    s('path', { d: 'M80 40v-10', ...SW(3) }, 'brown', { stroke: true })
  ],
  naturalidad: [
    ...face(96, 74, 38, 'skin', 'smile', { accent: true }),
    s('path', { d: 'M58 62q4-34 38-34t38 34q-10-20-38-20T58 62z' }, 'brown'),
    s('path', { d: 'M18 110q0-20 20-24h20q4 22-14 40q-20 0-26-16z' }, 'white'),
    s('path', { d: 'M18 110q0-20 20-24h20q4 22-14 40q-20 0-26-16z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[32, 102], [46, 100]], 3) }, 'dark'),
    s('path', { d: 'M34 138q6-14 18-16', ...SW(6) }, 'skin', { stroke: true })
  ],
  novato: [
    s('path', { d: ring(46, 112, 22) + ring(112, 112, 22), ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M46 112l24-36h34l8 36M70 76l12 36h30M60 64h20M104 76l-4-12h12', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: ring(30, 128, 8) + ring(128, 128, 8), ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M30 128l16-16M128 128l-16-16', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: leaflet(88, 50, -100, 24, 8) }, 'green')
  ],
  'obstrucción': [
    s('rect', { x: 14, y: 60, width: 132, height: 44, rx: 6 }, 'gray'),
    s('rect', { x: 18, y: 66, width: 54, height: 32, rx: 4 }, 'blue'),
    s('path', { d: 'M72 66q10-4 16 2q8-2 10 8q6 6 0 14q2 10-10 8q-8 6-16 0z' }, 'brown', { accent: true }),
    s('rect', { x: 102, y: 66, width: 40, height: 32, rx: 4 }, 'cream'),
    arrow('M22 40h40M52 32l10 8-10 8', 'blue', 5),
  ],
  'paréntesis': [
    s('path', { d: 'M40 26q-24 54 0 108M120 26q24 54 0 108', ...SW(9) }, 'navy', { stroke: true }),
    s('path', { d: 'M56 76h44v24q0 20-22 20t-22-20z' }, 'red', { accent: true }),
    s('path', { d: 'M100 84q14 0 12 10t-14 8', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M66 66q-6-8 0-14t0-14M80 66q-6-8 0-14t0-14M94 66q-6-8 0-14t0-14', ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 80, cy: 124, rx: 30, ry: 5 }, 'tan')
  ],
  paulatinamente: [
    s('path', { d: 'M14 140v-20h30v-24h30v-24h30v-24h42v92z' }, 'tan'),
    s('path', { d: 'M14 120h30v-24h30v-24h30v-24h42', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M44 96h34q4-20-14-22q-14 0-14 12q0 6 6 6' }, 'orange', { accent: true }),
    s('path', { d: 'M76 96q4-8 0-14M76 84l4-10M70 82l-2-10', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: dots([[80, 74], [68, 72]], 2.5) }, 'dark'),
    arrow('M96 36l20-12M110 22l6 2-2 6', 'green', 4)
  ],
  penitencia: [
    ground(),
    s('circle', { cx: 70, cy: 62, r: 14 }, 'skin'),
    s('path', { d: 'M54 76q14-4 26 4l4 34H52z' }, 'purple', { accent: true }),
    s('path', { d: 'M52 106h46q8 0 8 10v20h-14v-14H52z' }, 'purple'),
    s('path', { d: 'M80 82l14 10', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 122, y: 100, width: 10, height: 36 }, 'cream'),
    s('path', { d: drop(127, 88, 5) }, 'orange')
  ],
  'peregrinación': [
    s('path', { d: 'M14 140q40-30 70-40t62-14v54z' }, 'mint'),
    s('path', { d: 'M100 140q-10-20 6-34t30-22', ...SW(8) }, 'tan', { stroke: true }),
    s('path', { d: 'M118 54h14v28h-14zM116 54l9-12 9 12z' }, 'gray'),
    ...person(52, 132, 'brown', { h: 40, w: 26, r: 11, accent: true }),
    s('rect', { x: 32, y: 96, width: 14, height: 24, rx: 4 }, 'orange'),
    s('path', { d: 'M74 132V60', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M66 74h16', ...SW(4) }, 'skin', { stroke: true })
  ],
  pique: [
    s('rect', { x: 18, y: 112, width: 124, height: 24, rx: 4 }, 'brown'),
    s('path', { d: 'M14 92l32 18', ...SW(16) }, 'blue', { stroke: true }),
    s('path', { d: 'M146 92l-32 18', ...SW(16) }, 'red', { stroke: true }),
    s('path', { d: 'M46 110l28-46', ...SW(14) }, 'skin', { stroke: true }),
    s('path', { d: 'M114 110L86 64', ...SW(14) }, 'tan', { stroke: true }),
    s('circle', { cx: 80, cy: 58, r: 14 }, 'skin', { accent: true }),
    s('path', { d: 'M60 34l-6-12M80 30V16M100 34l6-12', ...SW(4) }, 'orange', { stroke: true })
  ],
  populista: [
    s('path', { d: busts([24, 50, 76], 140, 20, 24) }, 'gray'),
    s('path', { d: dots([[24, 108], [50, 108], [76, 108]], 8) }, 'skin'),
    s('rect', { x: 98, y: 92, width: 40, height: 48, rx: 3 }, 'brown'),
    ...person(118, 90, 'blue', { h: 30, w: 24, r: 10 }),
    s('path', { d: 'M104 54l-24-12v32z' }, 'red', { accent: true }),
    s('path', { d: 'M74 46l-8-6M72 58h-10M74 70l-8 6', ...SW(3) }, 'orange', { stroke: true })
  ],
  precario: [
    s('path', { d: 'M14 140v-30h70l-6 30z' }, 'brown'),
    s('rect', { x: 50, y: 88, width: 40, height: 22 }, 'red', { transform: 'rotate(6 70 110)' }),
    s('rect', { x: 58, y: 66, width: 36, height: 22 }, 'yellow', { transform: 'rotate(12 76 88)' }),
    s('rect', { x: 68, y: 44, width: 34, height: 22 }, 'blue', { accent: true, transform: 'rotate(18 85 66)' }),
    s('path', { d: 'M110 40q8 6 4 14M120 50q8 6 4 14', ...SW(3) }, 'gray', { stroke: true })
  ],
  precariedad: [
    s('path', { d: 'M14 70h10v70H14zM136 70h10v70h-10z' }, 'brown'),
    s('path', { d: 'M24 74q56 12 112 0', ...SW(3) }, 'dark', { stroke: true }),
    ...lean(80, 80, -8, 'orange', { h: 30, w: 20, r: 9, accent: true }),
    s('path', { d: 'M40 44l84-16', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M22 140q20-10 40 0t40 0t44 0', ...SW(4) }, 'sky', { stroke: true })
  ],
  proa: [
    s('path', { d: 'M14 120q12-6 24 0t24 0t24 0t24 0t24 0v20H14z' }, 'sky'),
    s('path', { d: 'M18 86h100q20 0 30-10l-22 46H34z' }, 'brown'),
    s('path', { d: 'M108 86h10q20 0 30-10l-22 46h-18z' }, 'red', { accent: true }),
    s('rect', { x: 40, y: 62, width: 44, height: 24, rx: 3 }, 'white'),
    outline({ x: 40, y: 62, width: 44, height: 24, rx: 3 }),
    s('path', { d: dots([[140, 104], [150, 94], [146, 116]], 4) }, 'blue'),
    arrow('M112 40h28M130 32l10 8-10 8', 'orange', 5)
  ],
  'próspero': [
    s('path', { d: 'M36 70q-16 18-16 40q0 26 34 26t34-26q0-22-16-40z' }, 'tan'),
    s('path', { d: 'M40 70h28l6-12H34z' }, 'brown'),
    s('circle', { cx: 54, cy: 108, r: 12 }, 'yellow'),
    s('path', { d: ells([[112, 132, 18, 6], [112, 124, 18, 6], [112, 116, 18, 6]]) }, 'orange'),
    arrow('M76 60l26-24 14 10 22-26M124 18h14v14', 'green', 7),
    s('circle', { cx: 54, cy: 108, r: 6 }, 'orange', { accent: true })
  ],
  ratificar: [
    ...paper(22, 50, 88, 92),
    s('path', { d: 'M34 66h64M34 80h64M34 94h40', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 82, cy: 118, r: 16 }, 'green', { accent: true }),
    s('path', { d: ring(82, 118, 11), ...SW(2) }, 'white', { stroke: true }),
    s('rect', { x: 106, y: 70, width: 30, height: 12, rx: 3 }, 'dark', { transform: 'rotate(-20 121 76)' }),
    s('path', { d: 'M118 72l10-28', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 130, cy: 38, r: 10 }, 'brown')
  ],
  reggae: [
    s('rect', { x: 14, y: 20, width: 132, height: 40, rx: 4 }, 'red'),
    s('rect', { x: 14, y: 60, width: 132, height: 40 }, 'yellow'),
    s('rect', { x: 14, y: 100, width: 132, height: 40, rx: 4 }, 'green'),
    ...note(56, 108, 'dark'),
    ...note(100, 84, 'dark')
  ],
  remo: [
    s('path', { d: 'M14 116q12-6 24 0t24 0t24 0t24 0t24 0v24H14z' }, 'sky'),
    s('path', { d: 'M28 100h96l-10 18H38z' }, 'brown'),
    ...person(76, 100, 'yellow', { h: 30, w: 24, r: 10 }),
    s('path', { d: 'M54 50l64 84', ...SW(6) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 120, cy: 132, rx: 8, ry: 16, transform: 'rotate(-37 120 132)' }, 'orange', { accent: true }),
    s('path', { d: 'M88 76l-14-4', ...SW(6) }, 'skin', { stroke: true })
  ],
  'remodelación': [
    ground(),
    s('rect', { x: 30, y: 74, width: 70, height: 62 }, 'cream'),
    s('path', { d: 'M24 78l41-40 41 40z' }, 'red'),
    s('path', { d: 'M30 74v62M100 74v62M30 98h70M30 118h70M110 136V60M110 80h30M110 104h30M140 136V60', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 42, y: 98, width: 18, height: 38 }, 'brown'),
    s('rect', { x: 116, y: 30, width: 26, height: 14, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: 'M129 44v16', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 70, y: 84, width: 20, height: 18 }, 'sky')
  ],
  respaldar: [
    ground(),
    ...person(66, 136, 'navy', { h: 56, w: 34, r: 14 }),
    ...person(98, 136, 'orange', { h: 46, w: 30, r: 12, accent: true }),
    s('path', { d: 'M74 86l16-8', ...SW(8) }, 'navy', { stroke: true }),
    s('circle', { cx: 90, cy: 78, r: 5 }, 'skin'),
    s('path', { d: heart(66, 34, 8) }, 'red')
  ],
  restringir: [
    s('path', { d: 'M14 24l84 40v10H14zM14 136l84-40V86H14z' }, 'gray'),
    s('path', { d: 'M98 64h48v32H98z' }, 'cream'),
    arrow('M22 50l46 22M22 110l46-22M22 80h50', 'blue', 6),
    arrow('M104 80h36M130 70l10 10-10 10', 'red', 6),
    s('rect', { x: 92, y: 62, width: 8, height: 36 }, 'dark', { accent: true })
  ],
  riguroso: [
    s('rect', { x: 32, y: 26, width: 82, height: 112, rx: 6 }, 'brown'),
    s('rect', { x: 40, y: 36, width: 66, height: 96, rx: 3 }, 'white'),
    s('rect', { x: 58, y: 20, width: 30, height: 12, rx: 3 }, 'gray'),
    s('path', { d: 'M48 54l5 5 9-9M48 80l5 5 9-9M48 106l5 5 9-9', ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M70 56h28M70 82h28M70 108h28', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 120, y: 30, width: 16, height: 108, rx: 2 }, 'yellow'),
    s('path', { d: 'M120 42h8M120 54h5M120 66h8M120 78h5M120 90h8M120 102h5M120 114h8M120 126h5', ...SW(2) }, 'dark', { stroke: true })
  ],
  sepulcro: [
    ground(),
    s('path', { d: 'M26 136V96h108v40z' }, 'gray', { accent: true }),
    s('path', { d: 'M20 96l12-20h96l12 20z' }, 'dark'),
    s('path', { d: 'M40 108h80v18H40z', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 20q-12 30-8 56h16q4-26-8-56z' }, 'green'),
    s('path', { d: 'M80 28v40M70 44h20', ...SW(4) }, 'gray', { stroke: true })
  ],
  sexenio: [
    s('rect', { x: 18, y: 34, width: 74, height: 88, rx: 6 }, 'white'),
    outline({ x: 18, y: 34, width: 74, height: 88, rx: 6 }),
    s('rect', { x: 18, y: 34, width: 74, height: 22, rx: 6 }, 'red'),
    s('path', { d: 'M32 28v14M78 28v14', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: rects([[28, 66, 14, 12], [48, 66, 14, 12], [68, 66, 14, 12], [28, 86, 14, 12], [48, 86, 14, 12], [68, 86, 14, 12], [28, 104, 14, 12]]) }, 'gray'),
    s('rect', { x: 92, y: 80, width: 54, height: 54, rx: 10 }, 'blue', { accent: true }),
    s('path', { d: dots([[106, 94], [106, 107], [106, 120], [132, 94], [132, 107], [132, 120]], 5) }, 'white')
  ],
  tecla: [
    s('path', { d: 'M18 96l30-20h64l30 20v24l-30 20H48l-30-20z' }, 'gray'),
    s('path', { d: 'M38 98l16-12h52l16 12-16 12H54z' }, 'white', { accent: true }),
    s('path', { d: 'M38 98l16-12h52l16 12-16 12H54z', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 94V34q0-10 9-10t9 10v60z' }, 'skin'),
    s('path', { d: 'M70 50l-8-6M70 66h-10M118 50l8-6M118 66h10', ...SW(3) }, 'orange', { stroke: true })
  ],
  telescopio: [
    s('path', { d: 'M78 84l-28 54M82 84v54M86 84l28 54', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 30, y: 64, width: 100, height: 22, rx: 6, transform: 'rotate(-28 80 75)' }, 'navy', { accent: true }),
    s('rect', { x: 102, y: 44, width: 18, height: 30, rx: 3, transform: 'rotate(-28 111 59)' }, 'blue'),
    s('path', { d: star(130, 26, 12) }, 'yellow'),
    s('path', { d: sparkle(24, 32, 8) }, 'yellow')
  ],
  terapeuta: [
    s('path', { d: 'M14 112h62v24H14zM14 96h20v40H14z' }, 'purple'),
    s('circle', { cx: 32, cy: 84, r: 12 }, 'skin'),
    s('rect', { x: 34, y: 92, width: 40, height: 20, rx: 8 }, 'blue'),
    ...person(118, 136, 'mint', { h: 48, w: 30, r: 13, accent: true }),
    s('rect', { x: 92, y: 90, width: 20, height: 26, rx: 2 }, 'brown'),
    s('rect', { x: 95, y: 94, width: 14, height: 18 }, 'white'),
    s('path', { d: heart(78, 50, 14) }, 'pink')
  ],
  vengar: [
    s('circle', { cx: 60, cy: 86, r: 40 }, 'red', { accent: true }),
    s('path', { d: 'M36 70l18 8M84 70l-18 8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[48, 88], [72, 88]], 5) }, 'dark'),
    s('path', { d: 'M46 110q14-10 28 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M112 128L138 22', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M98 118l28 8M112 128l-4 14', ...SW(7) }, 'brown', { stroke: true })
  ],
  vigilia: [
    backdrop('navy'),
    s('path', { d: 'M126 26a16 16 0 1 0 8 26a12 12 0 1 1-8-26z' }, 'yellow'),
    s('path', { d: sparkle(30, 34, 6) + sparkle(96, 26, 5) }, 'white'),
    ...person(60, 136, 'purple', { h: 40, w: 30, r: 13 }),
    s('path', { d: dots([[55, 78], [65, 78]], 3) }, 'dark'),
    s('rect', { x: 100, y: 104, width: 12, height: 32 }, 'cream'),
    s('path', { d: drop(106, 92, 6) }, 'orange', { accent: true })
  ],
  yuca: [
    s('path', { d: leaflet(80, 54, -120, 40, 8) + leaflet(80, 54, -90, 44, 8) + leaflet(80, 54, -60, 40, 8) }, 'green'),
    s('path', { d: 'M74 58q-30 20-46 64q10 4 18-6q20-30 32-54z' }, 'brown'),
    s('path', { d: 'M86 58q30 20 46 64q-10 4-18-6q-20-30-32-54z' }, 'brown'),
    s('path', { d: 'M80 58q-8 40 0 82q8-42 0-82z' }, 'brown'),
    s('ellipse', { cx: 37, cy: 119, rx: 9, ry: 6, transform: 'rotate(-30 37 119)' }, 'cream', { accent: true }),
    s('ellipse', { cx: 123, cy: 119, rx: 9, ry: 6, transform: 'rotate(30 123 119)' }, 'cream')
  ],
  zinc: [
    s('path', { d: 'M20 112l20-26h80l20 26-20 18H40z' }, 'gray', { accent: true }),
    s('path', { d: 'M40 86h80l20 26H20z' }, 'white'),
    s('path', { d: 'M20 112l20-26h80l20 26-20 18H40zM20 112h120', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(56, 98, 8) }, 'sky'),
    s('rect', { x: 92, y: 26, width: 30, height: 50, rx: 4 }, 'dark'),
    s('rect', { x: 92, y: 26, width: 30, height: 14, rx: 4 }, 'orange'),
    s('rect', { x: 101, y: 20, width: 12, height: 6 }, 'gray')
  ],
  'éxtasis': [
    s('path', { d: burst(80, 76, 66, 50, 14) }, 'yellow'),
    s('circle', { cx: 80, cy: 50, r: 14 }, 'skin'),
    s('rect', { x: 66, y: 66, width: 28, height: 40, rx: 10 }, 'pink', { accent: true }),
    s('path', { d: 'M68 72L46 40M92 72l22-32M72 104l-10 26M88 104l10 26', ...SW(8) }, 'pink', { stroke: true }),
    s('path', { d: 'M73 52q7 8 14 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: star(30, 112, 9) + star(130, 112, 9) }, 'orange')
  ],
  acomodar: [
    ground(),
    s('path', { d: 'M30 136V76q0-14 14-14h72q14 0 14 14v60h-14v-16H44v16z' }, 'red', { accent: true }),
    s('rect', { x: 44, y: 96, width: 72, height: 24, rx: 6 }, 'pink'),
    s('circle', { cx: 70, cy: 62, r: 12 }, 'skin'),
    s('rect', { x: 56, y: 76, width: 28, height: 26, rx: 8 }, 'blue'),
    s('path', { d: 'M82 100h28', ...SW(10) }, 'blue', { stroke: true }),
    s('rect', { x: 96, y: 66, width: 24, height: 24, rx: 6 }, 'yellow')
  ],
  aislar: [
    s('rect', { x: 14, y: 70, width: 132, height: 70, rx: 6 }, 'sky'),
    s('ellipse', { cx: 80, cy: 112, rx: 40, ry: 14 }, 'tan', { accent: true }),
    s('path', { d: 'M100 104q-2-40 6-62', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(106, 42, 200, 26, 7) + leaflet(106, 42, 250, 22, 6) + leaflet(106, 42, -20, 26, 7) + leaflet(106, 42, 30, 22, 6) }, 'green'),
    ...person(64, 108, 'orange', { h: 26, w: 18, r: 8 }),
    s('path', { d: 'M24 90q6-3 12 0M120 132q6-3 12 0', ...SW(3) }, 'white', { stroke: true })
  ],
  aleta: [
    s('path', { d: 'M36 80q30-34 76-10q-30 40-76 10z' }, 'orange'),
    s('path', { d: 'M110 72l30-22v52z' }, 'orange'),
    s('path', { d: 'M62 60q8-24 30-28q-4 18-12 30z' }, 'red', { accent: true }),
    s('path', { d: 'M72 88q4 18 20 22q-2-14-8-24z' }, 'red'),
    s('circle', { cx: 50, cy: 74, r: 4 }, 'dark'),
    s('path', { d: 'M28 112q12-6 24 0t24 0t24 0t24 0', ...SW(4) }, 'sky', { stroke: true })
  ],
  alterno: [
    s('path', { d: dots([[30, 60], [80, 60], [130, 60]], 16) }, 'red', { accent: true }),
    s('path', { d: rects([[39, 89, 32, 32], [89, 89, 32, 32]]) }, 'blue'),
    s('path', { d: dots([[55, 105], [105, 105]], 6) }, 'white'),
    arrow('M46 60h14M96 60h14M30 82v8', 'gray', 3)
  ],
  alucinante: [
    s('path', { d: burst(80, 80, 66, 52, 16) }, 'orange'),
    s('circle', { cx: 80, cy: 80, r: 46 }, 'yellow', { accent: true }),
    s('path', { d: star(62, 70, 12) + star(98, 70, 12) }, 'red'),
    s('ellipse', { cx: 80, cy: 104, rx: 11, ry: 14 }, 'dark'),
    s('path', { d: 'M48 46q8-8 18-6M94 40q10-2 18 6', ...SW(4) }, 'dark', { stroke: true })
  ],
  apoderar: [
    s('path', { d: 'M42 72l10 34h56l10-34-20 14-18-26-18 26z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[42, 70], [80, 58], [118, 70]], 5) }, 'red'),
    s('rect', { x: 52, y: 106, width: 56, height: 8 }, 'orange'),
    s('path', { d: 'M82 122h44v18H82z' }, 'blue'),
    s('path', { d: 'M78 122q-6-14 8-20h24q8 0 6 10l6 10z' }, 'skin'),
    s('path', { d: 'M88 104v14M98 102v16M108 104v14', ...SW(3) }, 'tan', { stroke: true })
  ],
  'apología': [
    ground(),
    ...person(46, 136, 'blue', { accent: true }),
    s('path', { d: 'M86 70h36v28q0 24-18 34q-18-10-18-34z' }, 'navy'),
    s('path', { d: star(104, 92, 12) }, 'yellow'),
    s('path', { d: 'M62 84l24 0', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: bubble(66, 18, 70, 42) }, 'cream'),
    s('path', { d: bubble(66, 18, 70, 42), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: heart(101, 40, 10) }, 'red')
  ],
  arrendamiento: [
    s('path', { d: 'M24 70l38-34 38 34v54H24z' }, 'cream'),
    s('path', { d: 'M18 72l44-40 44 40', ...SW(7) }, 'red', { stroke: true }),
    s('rect', { x: 52, y: 94, width: 20, height: 30 }, 'brown'),
    ...paper(92, 74, 50, 64),
    s('path', { d: 'M100 88h34M100 100h34M100 112h22', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 50, cy: 132, r: 10 }, 'yellow', { accent: true }),
    s('path', { d: 'M60 132h26M78 132v8M84 132v6', ...SW(5) }, 'yellow', { stroke: true })
  ],
  ateneo: [
    ground(),
    s('path', { d: 'M20 56l60-32 60 32z' }, 'cream'),
    s('path', { d: 'M20 56l60-32 60 32z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 62v62M58 62v62M102 62v62M126 62v62', ...SW(10) }, 'gray', { stroke: true }),
    s('rect', { x: 20, y: 124, width: 120, height: 12 }, 'gray'),
    s('path', { d: 'M68 120v-34q0-14 12-14t12 14v34z' }, 'brown', { accent: true }),
    s('path', { d: dots([[75, 88], [85, 88]], 4) }, 'yellow'),
    s('path', { d: 'M70 76l-2-8 6 4M90 76l2-8-6 4' }, 'brown')
  ],
  atraso: [
    s('circle', { cx: 102, cy: 62, r: 40 }, 'white'),
    s('path', { d: ring(102, 62, 40), ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M102 30v32l20 10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M102 22a40 40 0 0 1 38 28', ...SW(8) }, 'red', { stroke: true, accent: true }),
    ...lean(38, 136, 18, 'orange', { h: 36, w: 22, r: 10 }),
    s('path', { d: 'M14 102h12M14 114h10', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: drop(64, 86, 4) }, 'sky')
  ],
  autopsia: [
    s('path', { d: 'M60 18h40l12 18H48z' }, 'gray'),
    s('path', { d: 'M52 38l-14 30M108 38l14 30', ...SW(2) }, 'yellow', { stroke: true }),
    s('rect', { x: 18, y: 96, width: 124, height: 12, rx: 3 }, 'gray'),
    s('path', { d: 'M30 140l10-32M130 140l-10-32', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 96q4-18 22-18q4-10 14-10q8 0 10 8h56q10 0 12 20z' }, 'sky', { accent: true }),
    s('circle', { cx: 112, cy: 64, r: 14 }, 'white'),
    s('path', { d: ring(112, 64, 14) + 'M102 74l-10 10', ...SW(5) }, 'dark', { stroke: true })
  ],
  avaricia: [
    s('path', { d: ells([[80, 132, 56, 8], [80, 122, 48, 8], [80, 112, 40, 8], [80, 102, 32, 8]]) }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 56, r: 16 }, 'skin'),
    s('rect', { x: 64, y: 72, width: 32, height: 24, rx: 10 }, 'purple'),
    s('path', { d: 'M66 80q-30 6-26 30M94 80q30 6 26 30', ...SW(8) }, 'purple', { stroke: true }),
    s('path', { d: 'M72 52l6 2M88 52l-6 2M74 64q6-4 12 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  azotea: [
    s('rect', { x: 26, y: 74, width: 108, height: 66 }, 'cream'),
    s('path', { d: grid(38, 88, 4, 2, 14, 14, 24, 24) }, 'sky'),
    s('rect', { x: 22, y: 68, width: 116, height: 8 }, 'tan', { accent: true }),
    s('path', { d: 'M24 68V48h112v20M44 48v20M64 48v20M84 48v20M104 48v20M124 48v20', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 30h100', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 30h16v18H46zM90 30h20v14H90z' }, 'pink'),
    s('path', { d: 'M116 66h12l-2-12h-8z' }, 'brown'),
    s('circle', { cx: 122, cy: 50, r: 7 }, 'green')
  ],
  barbaridad: [
    s('circle', { cx: 80, cy: 82, r: 46 }, 'skin', { accent: true }),
    s('path', { d: dots([[64, 70], [96, 70]], 7) }, 'white'),
    s('path', { d: dots([[64, 70], [96, 70]], 3) }, 'dark'),
    s('ellipse', { cx: 80, cy: 104, rx: 10, ry: 14 }, 'dark'),
    s('path', { d: 'M30 92q2 30 20 40M130 92q-2 30-20 40', ...SW(14) }, 'tan', { stroke: true }),
    s('path', { d: 'M40 26l8 12M80 18v14M120 26l-8 12', ...SW(5) }, 'red', { stroke: true })
  ],
  beneficencia: [
    s('rect', { x: 34, y: 76, width: 92, height: 62, rx: 6 }, 'blue', { accent: true }),
    s('rect', { x: 62, y: 76, width: 36, height: 6, rx: 3 }, 'dark'),
    s('path', { d: heart(80, 120, 16) }, 'pink'),
    s('circle', { cx: 80, cy: 52, r: 12 }, 'yellow'),
    s('path', { d: 'M96 30q14-8 28 2h12v18h-28q-12 0-16-8z' }, 'skin'),
    s('circle', { cx: 80, cy: 52, r: 6 }, 'orange')
  ],
  capitolio: [
    ground(),
    s('rect', { x: 18, y: 92, width: 124, height: 44 }, 'cream'),
    s('path', { d: 'M28 96v40M44 96v40M60 96v40M100 96v40M116 96v40M132 96v40', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 50, y: 74, width: 60, height: 18 }, 'white'),
    outline({ x: 50, y: 74, width: 60, height: 18 }),
    s('path', { d: 'M54 74a26 26 0 0 1 52 0z' }, 'gray', { accent: true }),
    s('path', { d: 'M80 48V30', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 72, y: 110, width: 16, height: 26, rx: 6 }, 'brown')
  ],
  'cariñoso': [
    s('circle', { cx: 60, cy: 64, r: 18 }, 'skin'),
    s('circle', { cx: 100, cy: 66, r: 18 }, 'tan'),
    s('path', { d: 'M34 138q0-50 26-50t26 50z' }, 'pink', { accent: true }),
    s('path', { d: 'M76 138q0-48 24-48t24 48z' }, 'sky'),
    s('path', { d: 'M48 104q32 10 64-6M112 104q-32 10-64-6', ...SW(9) }, 'pink', { stroke: true }),
    s('path', { d: heart(80, 30, 12) }, 'red')
  ],
  cautela: [
    ground(),
    s('path', { d: 'M108 136l12-56h8l12 56z' }, 'orange', { accent: true }),
    s('path', { d: 'M114 110h20M111 124h26', ...SW(5) }, 'white', { stroke: true }),
    s('rect', { x: 100, y: 132, width: 48, height: 6 }, 'orange'),
    ...lean(56, 128, -8, 'green', { h: 40, w: 26, r: 11 }),
    s('path', { d: 'M40 92l-18 10M68 90l18-6', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M52 128v8M60 128l6 4', ...SW(5) }, 'dark', { stroke: true })
  ],
  ceguera: [
    ground(),
    ...person(62, 136, 'sky', { h: 52, w: 32, r: 14 }),
    s('path', { d: 'M50 64h24', ...SW(9) }, 'black', { stroke: true, accent: true }),
    s('path', { d: 'M78 96l38 40', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M78 96l38 40', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M108 128l8 8', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M78 94l-4-6', ...SW(8) }, 'skin', { stroke: true })
  ],
  charco: [
    s('ellipse', { cx: 80, cy: 124, rx: 62, ry: 16 }, 'blue', { accent: true }),
    s('path', { d: 'M62 40h22v48l22 8v14H56V48z' }, 'yellow'),
    s('path', { d: 'M56 110h50', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: drop(36, 98, 5) + drop(124, 94, 5) + drop(28, 78, 4) + drop(134, 74, 4) }, 'sky'),
    s('path', { d: 'M40 126q8-4 16 0M104 128q8-4 16 0', ...SW(3) }, 'sky', { stroke: true })
  ],
  chavo: [
    ground(),
    s('rect', { x: 62, y: 84, width: 36, height: 52, rx: 12 }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 64, r: 18 }, 'skin'),
    s('path', { d: 'M62 60q0-20 18-20t18 20zM92 54h22v6H92z' }, 'red'),
    s('path', { d: 'M74 72q6 4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 122, cy: 124, r: 12 }, 'orange'),
    s('path', { d: dots([[74, 64], [86, 64]], 2) }, 'dark')
  ],
  confidencialidad: [
    s('path', { d: 'M18 46h42l8 10h74v78H18z' }, 'orange'),
    s('rect', { x: 18, y: 62, width: 124, height: 72, rx: 3 }, 'yellow'),
    s('path', { d: 'M66 90v-12a14 14 0 0 1 28 0v12', ...SW(7) }, 'gray', { stroke: true }),
    s('rect', { x: 58, y: 88, width: 44, height: 34, rx: 5 }, 'dark', { accent: true }),
    s('circle', { cx: 80, cy: 102, r: 5 }, 'yellow'),
    s('path', { d: 'M80 104v10', ...SW(4) }, 'yellow', { stroke: true })
  ],
  configurar: [
    s('rect', { x: 26, y: 20, width: 64, height: 120, rx: 10 }, 'dark'),
    s('rect', { x: 32, y: 32, width: 52, height: 96, rx: 3 }, 'white'),
    s('path', { d: 'M40 52h36M40 80h36M40 108h36', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[64, 52], [48, 80], [68, 108]], 7) }, 'blue', { accent: true }),
    ...gear(116, 104, 16, 8, 'orange'),
    s('circle', { cx: 116, cy: 104, r: 6 }, 'white')
  ],
  contrastar: [
    s('rect', { x: 20, y: 20, width: 120, height: 120, rx: 6 }, 'white'),
    s('path', { d: 'M20 140V26a6 6 0 0 1 6-6h114z' }, 'black', { accent: true }),
    outline({ x: 20, y: 20, width: 120, height: 120, rx: 6 }, 'dark', 3),
    s('circle', { cx: 52, cy: 52, r: 18 }, 'white'),
    s('circle', { cx: 108, cy: 108, r: 18 }, 'black')
  ],
  cumplido: [
    ...person(40, 136, 'blue', { h: 44, w: 28, r: 12 }),
    ...face(118, 92, 22, 'skin', 'smile'),
    s('rect', { x: 102, y: 116, width: 32, height: 20, rx: 8 }, 'purple'),
    s('path', { d: ells([[104, 98, 5, 3], [132, 98, 5, 3]]) }, 'pink'),
    s('path', { d: bubble(30, 16, 84, 46) }, 'cream'),
    s('path', { d: bubble(30, 16, 84, 46), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: star(58, 38, 12) + star(86, 38, 12) }, 'yellow', { accent: true })
  ],
  desatar: [
    s('path', { d: 'M14 96q30 0 48-14q14-10 18 0q4 10-12 12M146 96q-30 0-48-14q-14-10-18 0', ...SW(9) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M80 82q-6 14 10 16', ...SW(9) }, 'tan', { stroke: true }),
    arrow('M30 66L14 56M130 66l16-10', 'orange', 5),
    s('path', { d: 'M40 120q-6 0-6-8v-10h24v10q0 8-6 8zM108 120q-6 0-6-8v-10h24v10q0 8-6 8z' }, 'skin')
  ],
  'desviación': [
    s('path', { d: 'M14 140h132V18H14z' }, 'mint'),
    s('path', { d: 'M54 140V18h52v122z' }, 'gray'),
    s('path', { d: 'M80 140v-20M80 104v-14M80 44V22', ...SW(3) }, 'white', { stroke: true }),
    s('rect', { x: 48, y: 64, width: 64, height: 14, rx: 2 }, 'red', { accent: true }),
    s('path', { d: 'M58 64l-8 14M74 64l-8 14M90 64l-8 14M106 64l-8 14', ...SW(4) }, 'white', { stroke: true }),
    arrow('M80 124q0-20-24-28t-24-24q0-18 24-26t24-20M68 34l12-10 8 14', 'orange', 7)
  ],
  'diferenciación': [
    s('rect', { x: 18, y: 18, width: 124, height: 124, rx: 12 }, 'cream'),
    s('path', { d: dots([[40, 40], [80, 40], [120, 40], [40, 80], [120, 80], [40, 120], [80, 120], [120, 120]], 14) }, 'blue'),
    s('path', { d: star(80, 82, 22) }, 'orange', { accent: true })
  ],
  disolver: [
    s('path', { d: 'M38 40h84l-10 98H48z' }, 'sky'),
    s('path', { d: 'M42 64h76l-6 74H48z' }, 'blue', { accent: true }),
    s('path', { d: 'M38 40h84l-10 98H48z', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 66, y: 88, width: 18, height: 18, rx: 2, transform: 'rotate(15 75 97)' }, 'white'),
    s('path', { d: dots([[60, 120], [94, 112], [76, 126], [100, 128], [62, 100]], 3) }, 'white'),
    s('path', { d: 'M108 22l-14 96', ...SW(5) }, 'gray', { stroke: true }),
    arrow('M54 78q10-8 20 0', 'white', 3)
  ],
  ebrio: [
    ground(),
    ...lean(66, 136, 14, 'orange', { accent: true }),
    s('path', { d: spiral(78, 70), ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 136v-36l6-10v-10h8v10l6 10v36z' }, 'green'),
    s('path', { d: ring(40, 40, 6) + ring(54, 26, 8) + ring(30, 20, 4), ...SW(3) }, 'sky', { stroke: true })
  ],
  ejido: [
    s('path', { d: 'M14 70h132v70H14z' }, 'green'),
    s('path', { d: 'M14 70h60l-20 70H14zM100 70h46v32h-58z' }, 'yellow'),
    s('path', { d: 'M74 70l-20 70M100 70l-12 70M14 104h132', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: 'M24 54l14-14 14 14v16H24zM60 54l14-14 14 14v16H60zM96 54l14-14 14 14v16H96z' }, 'cream'),
    s('path', { d: 'M20 56l18-18 18 18M56 56l18-18 18 18M92 56l18-18 18 18', ...SW(4) }, 'red', { stroke: true, accent: true }),
    s('path', { d: ells([[116, 124, 12, 7]]) }, 'white'),
    s('circle', { cx: 104, cy: 118, r: 5 }, 'white')
  ],
  emirato: [
    s('circle', { cx: 40, cy: 40, r: 16 }, 'yellow'),
    s('path', { d: 'M14 140v-26q30-16 60-4t72-10v40z' }, 'tan'),
    s('path', { d: 'M104 120V40l6-24 6 24v80z' }, 'sky', { accent: true }),
    s('path', { d: 'M92 120V64h12v56zM116 120V72h12v48z' }, 'gray'),
    s('path', { d: 'M44 116q-2-30 6-44', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(50, 72, 200, 22, 6) + leaflet(50, 72, 250, 18, 5) + leaflet(50, 72, -20, 22, 6) + leaflet(50, 72, 30, 18, 5) }, 'green')
  ],
  emocionar: [
    s('circle', { cx: 80, cy: 78, r: 48 }, 'yellow', { accent: true }),
    s('path', { d: 'M54 70q8-8 16 0M90 70q8-8 16 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 96q18 18 36 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: drop(56, 90, 6) + drop(104, 90, 6) }, 'sky'),
    s('path', { d: heart(130, 30, 12) + heart(28, 36, 9) }, 'red')
  ],
  enfado: [
    s('circle', { cx: 80, cy: 84, r: 48 }, 'red', { accent: true }),
    s('path', { d: 'M52 64l22 10M108 64l-22 10', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[64, 84], [96, 84]], 6) }, 'dark'),
    s('path', { d: 'M60 114q20-14 40 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 34q-6-8 0-14M40 26q-6-8 0-14M120 26q6-8 0-14M130 34q6-8 0-14', ...SW(4) }, 'gray', { stroke: true })
  ],
  entretanto: [
    s('rect', { x: 14, y: 52, width: 62, height: 88, rx: 6 }, 'sky'),
    s('rect', { x: 84, y: 52, width: 62, height: 88, rx: 6 }, 'mint'),
    ...person(45, 136, 'orange', { h: 36, w: 24, r: 10 }),
    ...person(115, 136, 'purple', { h: 36, w: 24, r: 10 }),
    s('circle', { cx: 80, cy: 32, r: 20 }, 'white', { accent: true }),
    s('path', { d: ring(80, 32, 20) + 'M80 20v12l8 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M34 104h22M124 96v20', ...SW(5) }, 'brown', { stroke: true })
  ],
  'farmacéutico': [
    s('rect', { x: 26, y: 50, width: 52, height: 86, rx: 8 }, 'orange'),
    s('rect', { x: 22, y: 32, width: 60, height: 20, rx: 4 }, 'white'),
    outline({ x: 22, y: 32, width: 60, height: 20, rx: 4 }),
    s('path', { d: 'M52 76v36M34 94h36', ...SW(10) }, 'white', { stroke: true }),
    s('path', { d: 'M100 60l30 30', ...SW(20) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M115 75l15 15', ...SW(20) }, 'white', { stroke: true }),
    s('path', { d: 'M100 60l30 30', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: dots([[104, 120], [126, 126]], 8) }, 'green')
  ],
  frustrante: [
    s('path', { d: 'M14 140L130 40h16v100z' }, 'green'),
    s('circle', { cx: 52, cy: 92, r: 18 }, 'gray', { accent: true }),
    arrow('M74 108L40 132', 'red', 5),
    ...lean(106, 74, -36, 'orange', { h: 30, w: 20, r: 9 }),
    s('path', { d: 'M100 28q6-10 12 0t12 0t12 0', ...SW(4) }, 'dark', { stroke: true })
  ],
  gel: [
    s('rect', { x: 48, y: 56, width: 64, height: 84, rx: 14 }, 'mint', { accent: true }),
    s('rect', { x: 66, y: 40, width: 28, height: 18 }, 'white'),
    outline({ x: 66, y: 40, width: 28, height: 18 }),
    s('path', { d: 'M80 40V24h28', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: drop(80, 98, 12) }, 'blue'),
    s('path', { d: ring(124, 70, 8) + ring(132, 52, 5) + ring(30, 80, 7) + ring(36, 100, 4), ...SW(3) }, 'sky', { stroke: true })
  ],
  'halcón': [
    s('path', { d: 'M20 120h120', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M84 24q24 0 26 20l12 6-14 4q-4 24-8 42l-8 24H60q-12-30 4-62q2-34 20-34z' }, 'brown', { accent: true }),
    s('path', { d: 'M74 60q-4 30 14 56H66q-14-28 8-56z' }, 'tan'),
    s('circle', { cx: 96, cy: 40, r: 5 }, 'yellow'),
    s('circle', { cx: 96, cy: 40, r: 2.5 }, 'dark'),
    s('path', { d: 'M110 44l12 6-10 6z' }, 'dark'),
    s('path', { d: 'M74 116l-4 8M90 116l2 8', ...SW(4) }, 'yellow', { stroke: true })
  ],
  hortaliza: [
    s('path', { d: 'M18 100h124l-10 40H28z' }, 'brown'),
    s('circle', { cx: 50, cy: 84, r: 24 }, 'green'),
    s('path', { d: 'M38 76q12 10 24 0M40 92q10 6 20 0', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: 'M86 68l18 70l12-70z' }, 'orange', { accent: true }),
    s('path', { d: 'M100 68l-8-18M100 68V46M100 68l8-18', ...SW(4) }, 'green', { stroke: true }),
    s('circle', { cx: 124, cy: 90, r: 16 }, 'red'),
    s('path', { d: 'M118 74l6 4 6-4', ...SW(3) }, 'green', { stroke: true })
  ],
  indigno: [
    ground(),
    s('path', { d: 'M96 52h36v10q0 22-18 26q-18-4-18-26z' }, 'yellow', { accent: true }),
    s('path', { d: 'M96 58q-12 0-12 10t12 10M132 58q12 0 12 10t-12 10', ...SW(4) }, 'yellow', { stroke: true }),
    s('rect', { x: 108, y: 88, width: 12, height: 16 }, 'orange'),
    s('rect', { x: 98, y: 104, width: 32, height: 10, rx: 2 }, 'brown'),
    ...lean(52, 136, -8, 'gray'),
    s('path', { d: 'M62 96l26 6', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 70q6 4 12 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  'industrialización': [
    s('path', { d: 'M14 140V90l28-18v18l28-18v18l28-18v68z' }, 'gray'),
    s('rect', { x: 104, y: 40, width: 18, height: 100 }, 'red', { accent: true }),
    s('path', { d: 'M110 30q8-12 20-8q10-10 18 0', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: rects([[24, 104, 12, 12], [52, 104, 12, 12], [80, 104, 12, 12]]) }, 'yellow'),
    ...gear(56, 46, 10, 8, 'dark'),
    s('rect', { x: 122, y: 100, width: 24, height: 40 }, 'navy')
  ],
  'intoxicación': [
    s('circle', { cx: 66, cy: 70, r: 40 }, 'mint', { accent: true }),
    s('path', { d: 'M46 64l12-4M86 64l-12-4M48 74h10M74 74h10', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M50 94q8-8 16 0t16 0', ...SW(4) }, 'green', { stroke: true }),
    s('ellipse', { cx: 112, cy: 128, rx: 34, ry: 9 }, 'white'),
    s('ellipse', { cx: 112, cy: 128, rx: 34, ry: 9, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M90 124q4-12 22-12t22 12z' }, 'brown'),
    s('path', { d: 'M100 106q-6-8 0-14M116 104q-6-8 0-14', ...SW(3) }, 'green', { stroke: true })
  ],
  izquierdista: [
    s('rect', { x: 18, y: 104, width: 62, height: 18, rx: 9 }, 'red', { accent: true }),
    s('rect', { x: 80, y: 104, width: 62, height: 18, rx: 9 }, 'sky'),
    s('path', { d: 'M48 98l-8-16h16z' }, 'dark'),
    arrow('M106 52H40M56 38L40 52l16 14', 'red', 8),
    s('circle', { cx: 48, cy: 113, r: 6 }, 'white')
  ],
  jungla: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'mint'),
    s('path', { d: 'M76 146V54', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(76, 54, 200, 46, 12) + leaflet(76, 54, 240, 40, 11) + leaflet(76, 54, -30, 46, 12) + leaflet(76, 54, 10, 40, 11) + leaflet(20, 146, -60, 50, 14) + leaflet(140, 146, -120, 50, 14) }, 'green', { accent: true }),
    s('path', { d: 'M118 14v40q0 14-10 14M30 14v30', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M118 92q8-12 18-4q-2 12-10 14l4 14h-12z' }, 'red'),
    s('circle', { cx: 128, cy: 92, r: 2 }, 'dark')
  ],
  librar: [
    s('path', { d: 'M14 90q12-6 24 0t24 0t24 0t24 0t24 0t12 0v50H14z' }, 'blue'),
    s('circle', { cx: 80, cy: 84, r: 30 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 84, r: 16 }, 'blue'),
    s('path', { d: 'M58 62l10 10M102 62l-10 10M58 106l10-10M102 106l-10-10', ...SW(10) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 76, r: 12 }, 'skin'),
    s('path', { d: 'M110 70l26-40', ...SW(3) }, 'tan', { stroke: true })
  ],
  lona: [
    ground(),
    s('path', { d: 'M80 34l-54 102h108z' }, 'tan', { accent: true }),
    s('path', { d: 'M80 34l-14 102h28z' }, 'brown'),
    s('path', { d: 'M80 34L14 120M80 34l66 86', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 34v-14', ...SW(4) }, 'dark', { stroke: true }),
  ],
  madurar: [
    s('path', { d: 'M14 46q66-20 132 0', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M34 42v14M80 36v18M126 42v14', ...SW(3) }, 'green', { stroke: true }),
    s('circle', { cx: 34, cy: 70, r: 14 }, 'green'),
    s('circle', { cx: 80, cy: 74, r: 18 }, 'orange'),
    s('circle', { cx: 126, cy: 78, r: 22 }, 'red', { accent: true }),
    arrow('M40 120h80M108 110l12 10-12 10', 'gray', 5)
  ],
  mear: [
    ground(),
    s('rect', { x: 110, y: 82, width: 22, height: 54, rx: 6 }, 'red', { accent: true }),
    s('path', { d: 'M104 98h34M110 82a11 11 0 0 1 22 0', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M30 112v24M44 112v24M66 112v24', ...SW(7) }, 'tan', { stroke: true }),
    s('rect', { x: 22, y: 92, width: 54, height: 24, rx: 12 }, 'tan'),
    s('path', { d: 'M74 106l18-20', ...SW(7) }, 'tan', { stroke: true }),
    s('circle', { cx: 22, cy: 84, r: 13 }, 'tan'),
    s('path', { d: 'M86 92q12 10 20 30', ...SW(3) }, 'yellow', { stroke: true })
  ],
  'metrópoli': [
    s('path', { d: rects([[14, 70, 24, 70], [40, 36, 26, 104], [68, 18, 22, 122], [92, 50, 26, 90], [120, 76, 26, 64]]) }, 'navy', { accent: true }),
    s('path', { d: grid(20, 80, 2, 5, 5, 6, 10, 12) + grid(46, 46, 2, 7, 6, 6, 12, 13) + grid(74, 30, 2, 8, 5, 6, 9, 13) + grid(98, 60, 2, 6, 6, 6, 12, 13) + grid(126, 86, 2, 4, 6, 6, 12, 12) }, 'yellow'),
    s('path', { d: 'M79 18V8', ...SW(3) }, 'dark', { stroke: true })
  ],
  montano: [
    s('path', { d: 'M14 136l46-82 30 44 22-30 34 68z' }, 'gray'),
    s('path', { d: 'M48 76l12-22 12 18-8-2-6 8z' }, 'white', { accent: true }),
    s('path', { d: 'M28 140l14-34 14 34zM110 140l14-34 14 34zM86 140l12-26 12 26z' }, 'green'),
    s('path', { d: 'M42 140v6M124 140v6', ...SW(3) }, 'brown', { stroke: true })
  ],
  naciente: [
    s('path', { d: halfRays(80, 108, 50, 66, 9), ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M38 108a42 42 0 0 1 84 0z' }, 'yellow', { accent: true }),
    s('rect', { x: 14, y: 108, width: 132, height: 32 }, 'blue'),
    s('path', { d: 'M30 122h30M80 130h40', ...SW(3) }, 'sky', { stroke: true }),
    arrow('M80 58V26M70 36l10-10 10 10', 'red', 5)
  ],
  nicho: [
    s('rect', { x: 14, y: 14, width: 132, height: 132 }, 'tan'),
    s('path', { d: 'M14 40h132M14 70h132M14 100h132M14 130h132M40 14v26M100 40v30M60 70v30M120 100v30', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M50 132V64a30 30 0 0 1 60 0v68z' }, 'dark'),
    s('path', { d: 'M68 132q-8-20 4-30h16q12 10 4 30z' }, 'blue', { accent: true }),
    s('path', { d: 'M74 102v-10h12v10', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: leaflet(80, 92, -110, 22, 6) + leaflet(80, 92, -70, 22, 6) }, 'green')
  ],
  'peón': [
    s('path', { d: checker(16, 108, 8, 2, 16) }, 'gray'),
    s('path', { d: 'M48 108h64v-12H48zM56 96l10-34h28l10 34z' }, 'dark', { accent: true }),
    s('circle', { cx: 80, cy: 46, r: 20 }, 'dark'),
    s('rect', { x: 58, y: 60, width: 44, height: 8, rx: 4 }, 'dark'),
    s('circle', { cx: 74, cy: 40, r: 5 }, 'gray')
  ],
  pleito: [
    s('path', { d: bubble(14, 18, 56, 40) }, 'red', { accent: true }),
    s('path', { d: bubble(90, 18, 56, 40) }, 'orange'),
    s('path', { d: 'M28 38l8-6 8 6 8-6 8 6M104 38l8-6 8 6 8-6 8 6', ...SW(4) }, 'white', { stroke: true }),
    s('rect', { x: 46, y: 120, width: 68, height: 14, rx: 3 }, 'brown'),
    s('rect', { x: 56, y: 72, width: 48, height: 24, rx: 6, transform: 'rotate(-30 80 84)' }, 'brown'),
    s('path', { d: 'M88 92l26 30', ...SW(8) }, 'tan', { stroke: true })
  ],
  popa: [
    s('path', { d: 'M14 120q12-6 24 0t24 0t24 0t24 0t24 0v20H14z' }, 'sky'),
    s('path', { d: 'M18 86h100q20 0 30-10l-22 46H34z' }, 'brown'),
    s('path', { d: 'M18 86h24v36h-8z' }, 'red', { accent: true }),
    s('path', { d: 'M28 118l-6 18h12z' }, 'dark'),
    s('rect', { x: 46, y: 62, width: 44, height: 24, rx: 3 }, 'white'),
    outline({ x: 46, y: 62, width: 44, height: 24, rx: 3 }),
    s('path', { d: 'M30 86V40', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 40l18 6-18 6z' }, 'orange'),
    s('path', { d: 'M14 30q8-4 16 0M14 60q6-3 10 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  predominar: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'gray'),
    s('path', { d: wedge(80, 80, 60, -90, 190) }, 'blue', { accent: true }),
    s('path', { d: wedge(80, 80, 60, 190, 240) }, 'yellow'),
    s('path', { d: ring(80, 80, 60), ...SW(3) }, 'white', { stroke: true })
  ],
  'proclamación': [
    ...person(46, 136, 'red', { h: 48, w: 30, r: 13 }),
    s('rect', { x: 66, y: 66, width: 64, height: 60, rx: 2 }, 'cream'),
    s('path', { d: ells([[66, 66, 6, 4], [66, 126, 6, 4], [130, 66, 6, 4], [130, 126, 6, 4]]) }, 'tan'),
    s('path', { d: 'M76 82h44M76 94h44M76 106h30', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M56 56l50-36l4 12z' }, 'yellow', { accent: true }),
    s('path', { d: 'M68 46l18 4l-2 12-18-4z' }, 'blue')
  ],
  rabo: [
    s('path', { d: 'M40 108v28M56 110v26M98 110v26M112 108v28', ...SW(8) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 76, cy: 96, rx: 46, ry: 20 }, 'brown'),
    s('circle', { cx: 32, cy: 72, r: 18 }, 'brown'),
    s('path', { d: 'M22 60l-4-16 14 6z' }, 'dark'),
    s('path', { d: 'M118 88q20-10 24-44', ...SW(9) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M126 30q10 4 14-6M146 44q8 4 6 14', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 24, cy: 70, r: 2.5 }, 'dark')
  ],
  'refinería': [
    ground(),
    s('rect', { x: 22, y: 50, width: 18, height: 86 }, 'gray'),
    s('rect', { x: 46, y: 70, width: 16, height: 66 }, 'gray'),
    s('path', { d: 'M70 136v-30a24 18 0 0 1 48 0v30z' }, 'white'),
    s('path', { d: 'M70 136v-30a24 18 0 0 1 48 0v30z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M126 136V40h8v96zM40 90h6M62 110h8M118 120h8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M130 38q-10-12 0-22q2 10 6 8q4 10-6 14z' }, 'orange', { accent: true }),
    s('path', { d: 'M22 64h18M22 80h18M46 84h16', ...SW(3) }, 'red', { stroke: true })
  ],
  'reglamentación': [
    s('rect', { x: 34, y: 20, width: 92, height: 120, rx: 6 }, 'navy', { accent: true }),
    s('rect', { x: 42, y: 28, width: 76, height: 104, rx: 3 }, 'white'),
    s('path', { d: dots([[54, 48], [54, 70], [54, 92], [54, 114]], 5) }, 'blue'),
    s('path', { d: 'M66 48h40M66 70h40M66 92h40M66 114h28', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 20v24l6-6 6 6V20z' }, 'red')
  ],
  residual: [
    s('rect', { x: 14, y: 30, width: 54, height: 22, rx: 4 }, 'gray'),
    s('rect', { x: 60, y: 26, width: 10, height: 30, rx: 2 }, 'dark'),
    s('path', { d: 'M62 52q10 10 14 76', ...SW(12) }, 'brown', { stroke: true, accent: true }),
    s('ellipse', { cx: 92, cy: 128, rx: 54, ry: 14 }, 'brown'),
    s('path', { d: ring(110, 122, 4) + ring(122, 130, 3) + ring(74, 128, 3), ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M114 100q-6-8 0-14M128 104q-6-8 0-14', ...SW(3) }, 'green', { stroke: true })
  ],
  retrospectiva: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 8 }, 'cream'),
    s('rect', { x: 22, y: 30, width: 36, height: 30 }, 'sky'),
    s('rect', { x: 66, y: 24, width: 30, height: 40 }, 'pink'),
    s('rect', { x: 104, y: 30, width: 34, height: 30 }, 'mint'),
    s('path', { d: 'M22 30h36v30H22zM66 24h30v40H66zM104 30h34v30h-34z', ...SW(4) }, 'brown', { stroke: true }),
    arrow('M130 108H34M52 90l-18 18 18 18', 'orange', 8),
    s('path', { d: 'M28 54l10-14 10 14zM81 38a7 7 0 1 1 0 .1M112 54l8-12 8 12z' }, 'dark', { accent: true })
  ],
  'rígido': [
    s('path', { d: 'M22 136l14-40 14 40zM110 136l14-40 14 40z' }, 'gray'),
    s('rect', { x: 14, y: 84, width: 132, height: 14, rx: 2 }, 'dark', { accent: true }),
    s('rect', { x: 56, y: 40, width: 48, height: 44, rx: 4 }, 'brown'),
    s('path', { d: 'M70 40q10-16 20 0', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 91h124', ...SW(2) }, 'gray', { stroke: true })
  ],
  sanar: [
    s('rect', { x: 22, y: 64, width: 116, height: 36, rx: 18, transform: 'rotate(-30 80 82)' }, 'tan', { accent: true }),
    s('rect', { x: 62, y: 70, width: 36, height: 24, rx: 4, transform: 'rotate(-30 80 82)' }, 'cream'),
    s('path', { d: dots([[38, 98], [48, 92], [112, 70], [122, 64]], 2.5) }, 'brown'),
    s('path', { d: heart(80, 90, 10) }, 'pink'),
    s('path', { d: sparkle(124, 118, 12) + sparkle(36, 40, 10) }, 'yellow')
  ],
  'teóricamente': [
    s('circle', { cx: 48, cy: 104, r: 22 }, 'skin'),
    s('path', { d: 'M20 140q0-16 28-16t28 16z' }, 'navy'),
    s('path', { d: dots([[64, 76], [74, 66]], 4) }, 'gray'),
    s('ellipse', { cx: 108, cy: 46, rx: 40, ry: 32 }, 'white'),
    s('ellipse', { cx: 108, cy: 46, rx: 40, ry: 32, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 62l14-28 14 28zM120 36a10 10 0 1 1 0 .1', ...SW(3) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M100 48h18', ...SW(3) }, 'orange', { stroke: true })
  ],
  ticket: [
    s('path', { d: 'M18 50h124v20a10 10 0 0 0 0 20v20H18V90a10 10 0 0 0 0-20z', transform: 'rotate(-10 80 80)' }, 'orange', { accent: true }),
    s('path', { d: 'M106 52v56', ...DASH(3, '4 5'), transform: 'rotate(-10 80 80)' }, 'white', { stroke: true }),
    s('path', { d: star(64, 80, 16) }, 'yellow'),
    s('path', { d: 'M38 62h14M38 98h14', ...SW(3), transform: 'rotate(-10 80 80)' }, 'white', { stroke: true })
  ],
  tiniebla: [
    backdrop('black'),
    s('path', { d: 'M14 146V98q20-10 30 0q14-16 30-4q16-12 30 0q16-10 42 2v50z' }, 'dark'),
    s('circle', { cx: 80, cy: 80, r: 28 }, 'navy'),
    s('rect', { x: 72, y: 84, width: 16, height: 14, rx: 2 }, 'cream'),
    s('path', { d: drop(80, 74, 7) }, 'orange', { accent: true })
  ],
  zurdo: [
    ...paper(66, 70, 76, 70),
    s('path', { d: 'M78 100q10-10 20 0t20 0', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M20 92q0-16 16-16h18q14 0 18 12l8 16q2 8-6 8H36q-16 0-16-20z' }, 'skin', { accent: true }),
    s('path', { d: 'M74 98l40-60', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M74 98l6-8', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 106l14 6', ...SW(18) }, 'red', { stroke: true }),
    s('path', { d: 'M126 60q8-10 18-2', ...SW(14) }, 'gray', { stroke: true })
  ],
  'ómnibus': [
    s('rect', { x: 14, y: 46, width: 132, height: 70, rx: 10 }, 'yellow', { accent: true }),
    s('path', { d: rects([[24, 56, 22, 22], [52, 56, 22, 22], [80, 56, 22, 22]]) }, 'sky'),
    s('rect', { x: 110, y: 56, width: 24, height: 50, rx: 3 }, 'sky'),
    s('path', { d: 'M14 90h96', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: dots([[42, 116], [118, 116]], 13) }, 'dark'),
    s('path', { d: dots([[42, 116], [118, 116]], 5) }, 'gray')
  ],
  'óxido': [
    s('rect', { x: 66, y: 20, width: 28, height: 12, rx: 2 }, 'gray'),
    s('path', { d: 'M72 32h16v90l-8 18-8-18z' }, 'gray'),
    s('path', { d: ells([[76, 52, 6, 8], [84, 82, 6, 10], [76, 108, 5, 7], [72, 26, 6, 4]]) }, 'orange', { accent: true }),
    s('path', { d: ells([[84, 62, 3, 4], [76, 92, 3, 5]]) }, 'brown'),
    s('path', { d: dots([[104, 120], [112, 132], [52, 128], [46, 114]], 3) }, 'brown')
  ],
  alcoholismo: [
    s('path', { d: 'M44 136V70q0-10 8-16V30h16v24q8 6 8 16v66z' }, 'green', { accent: true }),
    s('rect', { x: 52, y: 84, width: 24, height: 22 }, 'cream'),
    s('path', { d: ring(92, 104, 8) + ring(108, 104, 8) + ring(124, 104, 8), ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 128, y: 92, width: 16, height: 24, rx: 4 }, 'dark'),
    s('path', { d: 'M138 100h8', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M76 104h8', ...SW(5) }, 'gray', { stroke: true })
  ],
  ambulante: [
    ground(),
    s('path', { d: 'M68 34h72l-36-16z' }, 'red', { accent: true }),
    s('path', { d: 'M104 34v48', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 74, y: 82, width: 66, height: 34, rx: 4 }, 'blue'),
    s('path', { d: dots([[84, 82], [98, 82], [112, 82], [126, 82]], 6) }, 'orange'),
    s('path', { d: dots([[86, 124], [128, 124]], 10) }, 'dark'),
    ...person(40, 136, 'green', { h: 46, w: 28, r: 12 }),
    s('path', { d: 'M52 96h22', ...SW(6) }, 'skin', { stroke: true })
  ],
  asimilar: [
    s('rect', { x: 34, y: 82, width: 92, height: 50, rx: 10 }, 'yellow', { accent: true }),
    s('path', { d: dots([[50, 100], [70, 116], [94, 98], [110, 118], [80, 96]], 4) }, 'orange'),
    s('path', { d: drop(50, 40, 8) + drop(80, 30, 8) + drop(110, 40, 8) }, 'blue'),
    arrow('M50 56v14M80 48v22M110 56v14', 'sky', 4)
  ],
  atar: [
    s('path', { d: 'M14 112q30-8 46-6M100 106q20-2 46 10', ...SW(6) }, 'tan', { stroke: true }),
    s('rect', { x: 60, y: 30, width: 40, height: 110, rx: 4 }, 'brown'),
    s('path', { d: 'M60 96h40M60 108h40M60 120h40', ...SW(7) }, 'tan', { stroke: true, accent: true }),
    s('path', { d: 'M100 108q16-12 20 0t-20 0', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: 'M66 40h28', ...SW(3) }, 'dark', { stroke: true })
  ],
  automotor: [
    ground(),
    ...car(24, 92, 'red', 'sky', { accent: true }),
    ...gear(118, 46, 14, 8, 'gray'),
    s('circle', { cx: 118, cy: 46, r: 6 }, 'white'),
    s('path', { d: 'M100 78l-8 10', ...SW(4) }, 'gray', { stroke: true })
  ],
  balazo: [
    s('rect', { x: 100, y: 22, width: 46, height: 116, rx: 4 }, 'tan'),
    s('path', { d: burst(122, 80, 22, 10, 9) }, 'dark', { accent: true }),
    s('path', { d: 'M122 80l-12-26M122 80l18-16M122 80l14 28M122 80l-14 22', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 72h30q14 0 20 8q-6 8-20 8H40z' }, 'yellow'),
    s('rect', { x: 32, y: 72, width: 10, height: 16 }, 'orange'),
    s('path', { d: 'M14 64h14M14 80h12M14 96h14', ...SW(3) }, 'gray', { stroke: true })
  ],
  balde: [
    s('path', { d: 'M36 54h88l-12 82H48z' }, 'blue', { accent: true }),
    s('ellipse', { cx: 80, cy: 54, rx: 44, ry: 10 }, 'sky'),
    s('path', { d: 'M38 56q42-72 84 0', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 76h80', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: drop(130, 112, 5) + drop(30, 120, 4) }, 'sky')
  ],
  'búlgaro': [
    s('path', { d: 'M26 140V18', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 28, y: 22, width: 110, height: 28 }, 'white'),
    s('rect', { x: 28, y: 50, width: 110, height: 28 }, 'green', { accent: true }),
    s('rect', { x: 28, y: 78, width: 110, height: 28 }, 'red'),
    s('rect', { x: 28, y: 22, width: 110, height: 84, ...SW(2) }, 'gray', { stroke: true })
  ],
  'calzón': [
    s('path', { d: 'M14 36q66 14 132 0', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 50h92v20q-20 6-30 46H64q-10-40-30-46z' }, 'blue', { accent: true }),
    s('path', { d: 'M34 50h92', ...SW(6) }, 'navy', { stroke: true }),
    s('path', { d: 'M60 30v26M100 30v26', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: dots([[60, 80], [80, 74], [100, 80], [80, 96]], 4) }, 'white')
  ],
  cambiante: [
    s('path', { d: 'M108 112q30 0 30-24t-20-24', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M30 90q0-30 40-32q40 0 50 30q-10 24-50 24q-40-2-40-22z' }, 'green'),
    s('path', { d: 'M80 58q40 0 40 30q-10 24-40 24z' }, 'orange', { accent: true }),
    s('path', { d: 'M30 90q-6-18 12-24q10 4 8 22z' }, 'green'),
    s('circle', { cx: 42, cy: 80, r: 6 }, 'yellow'),
    s('circle', { cx: 42, cy: 80, r: 3 }, 'dark'),
    s('path', { d: 'M54 110v18M98 110v18', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M76 70q6 6 0 12q6 6 0 12', ...SW(3) }, 'purple', { stroke: true })
  ],
  'caracterización': [
    s('rect', { x: 26, y: 18, width: 108, height: 124, rx: 10 }, 'dark'),
    s('rect', { x: 36, y: 28, width: 88, height: 104, rx: 4 }, 'sky'),
    s('path', { d: dots([[32, 40], [32, 80], [32, 120], [128, 40], [128, 80], [128, 120]], 4) }, 'yellow'),
    s('circle', { cx: 80, cy: 82, r: 30 }, 'skin'),
    s('path', { d: 'M50 74q0-36 30-36t30 36q-12-20-30-20T50 74z' }, 'purple'),
    s('path', { d: 'M62 94q10-8 18 0q8-8 18 0q-8 6-18 2q-10 4-18-2z' }, 'black', { accent: true }),
    s('path', { d: dots([[70, 80], [90, 80]], 3) }, 'dark')
  ],
  carnal: [
    ground(),
    ...person(52, 136, 'blue', { h: 46, w: 28, r: 13 }),
    ...person(108, 136, 'green', { h: 46, w: 28, r: 13 }),
    s('path', { d: 'M64 102h32', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: drop(80, 50, 10) }, 'red', { accent: true })
  ],
  cocodrilo: [
    s('path', { d: 'M14 96q20-14 50-14h40q30 0 42 10l-2 6q-20-4-40 4H60q-30 10-46 2z' }, 'green', { accent: true }),
    s('path', { d: 'M104 84q20-2 42 8M104 98q20 10 40 2', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 92l4 4 4-4 4 4 4-4 4 4 4-4 4 4', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M40 102v14M60 102v16M84 102v16', ...SW(7) }, 'green', { stroke: true }),
    s('circle', { cx: 100, cy: 80, r: 5 }, 'yellow'),
    s('path', { d: 'M40 82l6-8 6 8 6-8 6 8 6-8 6 8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 124q66-6 132 0', ...SW(4) }, 'sky', { stroke: true })
  ],
  concordar: [
    s('path', { d: 'M14 70h30v40H14z' }, 'blue'),
    s('path', { d: 'M146 70h-30v40h30z' }, 'navy'),
    s('path', { d: 'M44 74h30l16 10h20q8 4 0 10H88l-4 16H58q-8 0-14-6z' }, 'skin', { accent: true }),
    s('path', { d: 'M116 74H92l-12 8 6 6 16-4M66 110h18l14-6', ...SW(8) }, 'tan', { stroke: true }),
    s('path', { d: 'M62 44l-6-10M80 40V28M98 44l6-10', ...SW(4) }, 'orange', { stroke: true })
  ],
  'consecución': [
    s('path', { d: 'M14 140l60-90 72 90z' }, 'gray'),
    s('path', { d: 'M62 68l12-18 12 18-6 4-6-4-6 4z' }, 'white'),
    s('path', { d: 'M74 50V16', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M76 16h30l-8 9 8 9H76z' }, 'red', { accent: true }),
    ...person(48, 104, 'orange', { h: 26, w: 18, r: 8 }),
    s('path', { d: 'M56 86l10-12', ...SW(5) }, 'orange', { stroke: true })
  ],
  controlador: [
    s('path', { d: 'M40 58h80q20 0 24 30l4 22q2 16-12 18q-10 0-20-16H44q-10 16-20 16q-14-2-12-18l4-22q4-30 24-30z' }, 'dark', { accent: true }),
    s('path', { d: 'M48 74v24M36 86h24', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: dots([[110, 76], [124, 88], [110, 100], [96, 88]], 6) }, 'red'),
    s('path', { d: dots([[124, 88]], 6) }, 'green'),
    s('path', { d: dots([[110, 76]], 6) }, 'yellow'),
    s('path', { d: 'M80 58V34q0-12 20-14', ...SW(4) }, 'gray', { stroke: true })
  ],
  coser: [
    s('path', { d: 'M14 82l132-20v60l-132 20z' }, 'pink'),
    s('path', { d: 'M24 108l14-2M48 104l14-2M72 100l14-2', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M96 96l40-60', ...SW(5) }, 'gray', { stroke: true, accent: true }),
    s('ellipse', { cx: 134, cy: 40, rx: 3, ry: 6, transform: 'rotate(34 134 40)' }, 'white'),
    s('path', { d: 'M86 98q-4-14 10-20q20-20 40-42', ...SW(3) }, 'red', { stroke: true })
  ],
  'cártel': [
    s('path', { d: busts([40, 80, 120], 136, 36, 50) }, 'dark', { accent: true }),
    s('path', { d: dots([[40, 70], [80, 64], [120, 70]], 14) }, 'skin'),
    s('path', { d: 'M24 62h32M64 56h32M104 62h32', ...SW(5) }, 'black', { stroke: true }),
    s('path', { d: 'M28 58q12-14 24 0M68 52q12-14 24 0M108 58q12-14 24 0' }, 'black'),
    s('path', { d: 'M34 72h12M74 66h12M114 72h12', ...SW(5) }, 'black', { stroke: true }),
    s('path', { d: 'M76 112h8l-4 18z' }, 'red'),
    s('rect', { x: 56, y: 118, width: 48, height: 22, rx: 3 }, 'brown')
  ],
  dimitir: [
    ground(),
    s('rect', { x: 100, y: 30, width: 40, height: 106 }, 'brown'),
    s('rect', { x: 106, y: 36, width: 28, height: 100 }, 'cream'),
    ...person(66, 136, 'navy', { h: 48, w: 28, r: 13 }),
    s('rect', { x: 40, y: 84, width: 52, height: 30, rx: 2 }, 'tan', { accent: true }),
    s('path', { d: 'M48 84V70h10v14M66 84l6-14 8 4-2 10', ...SW(3) }, 'green', { stroke: true })
  ],
  doncella: [
    s('path', { d: 'M100 136V44h8v-8h8v8h8v-8h8v8h8v92z' }, 'gray'),
    s('path', { d: 'M114 90a8 8 0 0 1 16 0v16h-16z' }, 'dark'),
    ...lady(60, 136, 'pink', { accent: true }),
    s('path', { d: 'M48 72q-6 14-2 30M72 72q6 14 2 30', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M48 66q0-14 12-14t12 14', ...SW(5) }, 'yellow', { stroke: true }),
    ground()
  ],
  'drásticamente': [
    s('path', { d: 'M20 20v118h122', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 40h40', ...SW(7) }, 'blue', { stroke: true, accent: true }),
    arrow('M68 40l30 82M84 108l14 18 6-22', 'red', 9),
    s('path', { d: 'M104 40l14-6M108 56h16', ...SW(4) }, 'orange', { stroke: true })
  ],
  duende: [
    ground(),
    s('path', { d: 'M56 70l24-56 24 56z' }, 'red'),
    s('circle', { cx: 80, cy: 82, r: 18 }, 'skin'),
    s('path', { d: 'M62 82l-12-10v14zM98 82l12-10v14z' }, 'skin'),
    s('path', { d: 'M60 136q0-36 20-36t20 36z' }, 'green', { accent: true }),
    s('path', { d: dots([[73, 80], [87, 80]], 2.5) }, 'dark'),
    s('path', { d: 'M72 90q8 6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(124, 46, 10) }, 'yellow')
  ],
  encierro: [
    ground(),
    s('path', { d: 'M38 110v26M50 112v24M86 112v24M98 110v26', ...SW(7) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 68, cy: 98, rx: 38, ry: 18 }, 'dark', { accent: true }),
    s('circle', { cx: 112, cy: 84, r: 14 }, 'dark'),
    s('path', { d: 'M106 72q-6-14 4-18M118 72q6-14-4-18', ...SW(4) }, 'cream', { stroke: true }),
    s('path', { d: 'M14 70h132M14 94h132M24 60v76M136 60v76', ...SW(6) }, 'brown', { stroke: true })
  ],
  encomienda: [
    s('path', { d: 'M24 62l56-22 56 22v60l-56 22-56-22z' }, 'tan'),
    s('path', { d: 'M24 62l56 22 56-22M80 84v60', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M52 51l56 22v18', ...SW(10) }, 'yellow', { stroke: true }),
    s('rect', { x: 34, y: 96, width: 30, height: 20, rx: 2, transform: 'rotate(22 49 106)' }, 'white', { accent: true }),
    s('path', { d: 'M38 104h20M38 110h14', ...SW(2), transform: 'rotate(22 49 106)' }, 'gray', { stroke: true })
  ],
  envergadura: [
    s('path', { d: 'M80 82q-30-30-66-28q20 18 30 34q20 4 36-6zM80 82q30-30 66-28q-20 18-30 34q-20 4-36-6z' }, 'brown', { accent: true }),
    s('ellipse', { cx: 80, cy: 88, rx: 12, ry: 22 }, 'tan'),
    s('circle', { cx: 80, cy: 64, r: 10 }, 'white'),
    s('path', { d: 'M76 70l4 8 4-8z' }, 'yellow'),
    arrow('M18 32h124M28 24l-10 8 10 8M132 24l10 8-10 8', 'blue', 4)
  ],
  espiar: [
    s('path', { d: 'M14 140v-40q8-18 30-14q10-20 36-14q24-8 34 14q22-2 32 14v40z' }, 'green'),
    s('rect', { x: 52, y: 54, width: 22, height: 30, rx: 8 }, 'dark', { accent: true }),
    s('rect', { x: 84, y: 54, width: 22, height: 30, rx: 8 }, 'dark'),
    s('rect', { x: 72, y: 62, width: 14, height: 10 }, 'dark'),
    s('path', { d: dots([[63, 58], [95, 58]], 7) }, 'sky'),
    s('path', { d: 'M48 54q2-28 32-28t32 28z' }, 'brown')
  ],
  estimulante: [
    s('path', { d: 'M30 70h72v34q0 30-36 30t-36-30z' }, 'white'),
    s('path', { d: 'M30 70h72v34q0 30-36 30t-36-30z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M102 82q22 0 20 16t-24 12', ...SW(6) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 66, cy: 72, rx: 34, ry: 6 }, 'brown'),
    s('path', { d: 'M78 14l-24 34h16l-10 26 28-38H72z' }, 'yellow', { accent: true })
  ],
  estrellar: [
    s('path', { d: rects([[112, 20, 34, 120]]) }, 'red'),
    s('path', { d: 'M112 36h34M112 56h34M112 76h34M112 96h34M112 116h34M128 20v16M120 36v20M136 56v20M120 76v20M136 96v20', ...SW(2) }, 'cream', { stroke: true }),
    s('path', { d: 'M110 96q-16-8-20-20h-26l-12 22v20h58z' }, 'blue', { accent: true }),
    s('path', { d: dots([[64, 120], [100, 120]], 10) }, 'dark'),
    s('path', { d: 'M14 112h36', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: star(84, 40, 10) + star(110, 34, 7) + star(60, 46, 7) }, 'yellow')
  ],
  existencial: [
    backdrop('navy'),
    s('circle', { cx: 110, cy: 46, r: 18 }, 'orange'),
    s('path', { d: 'M88 46h44', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: sparkle(36, 34, 7) + sparkle(64, 54, 5) + sparkle(130, 96, 6) }, 'white'),
    s('path', { d: 'M14 146v-16h132v16z' }, 'green'),
    s('circle', { cx: 60, cy: 92, r: 13 }, 'skin'),
    s('path', { d: 'M44 132q0-26 16-26t16 26z' }, 'purple', { accent: true }),
    s('path', { d: 'M62 104l6 10', ...SW(5) }, 'skin', { stroke: true })
  ],
  exquisito: [
    s('ellipse', { cx: 80, cy: 128, rx: 60, ry: 10 }, 'gray'),
    s('path', { d: 'M30 122V86l90-30v66z' }, 'cream'),
    s('path', { d: 'M30 86l90-30v18L30 104z' }, 'pink', { accent: true }),
    s('path', { d: 'M30 86l90-30', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M30 86l90-30v66H30z', ...SW(2) }, 'tan', { stroke: true }),
    s('circle', { cx: 92, cy: 54, r: 10 }, 'red'),
    s('path', { d: 'M92 44q2-12 10-14', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: sparkle(40, 50, 10) + sparkle(130, 30, 8) }, 'yellow')
  ],
  'genéticamente': [
    s('path', { d: 'M56 18q48 24 0 62t0 62', ...SW(7) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M104 18q-48 24 0 62t0 62', ...SW(7) }, 'red', { stroke: true }),
    s('path', { d: 'M62 28h36M72 40h16M72 58h16M62 70h36M64 90h32M72 102h16M72 120h16M62 132h36', ...SW(4) }, 'gray', { stroke: true })
  ],
  goleada: [
    s('rect', { x: 18, y: 36, width: 124, height: 100 }, 'white'),
    s('path', { d: 'M18 56h124M18 76h124M18 96h124M18 116h124M38 36v100M58 36v100M78 36v100M98 36v100M118 36v100', ...SW(1.5) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 136V36h124v100', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: dots([[46, 118], [74, 120], [102, 118], [128, 120], [60, 98], [114, 100]], 12) }, 'white', { accent: true }),
    s('path', { d: ring(46, 118, 12) + ring(74, 120, 12) + ring(102, 118, 12) + ring(128, 120, 12) + ring(60, 98, 12) + ring(114, 100, 12), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 140h132', ...SW(5) }, 'green', { stroke: true })
  ],
  guatemalteco: [
    s('rect', { x: 14, y: 34, width: 132, height: 92, rx: 4 }, 'white'),
    s('path', { d: 'M14 38a4 4 0 0 1 4-4h40v92H18a4 4 0 0 1-4-4zM102 34h40a4 4 0 0 1 4 4v84a4 4 0 0 1-4 4h-40z' }, 'sky', { accent: true }),
    s('rect', { x: 14, y: 34, width: 132, height: 92, rx: 4, ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M72 70q8-16 20-6q4 10-4 20q-6 4-14 0zM78 82q-8 20-18 36q10-2 22-30' }, 'green'),
    s('path', { d: 'M86 66l8 2-6 4z' }, 'yellow'),
    s('path', { d: 'M78 78q4 4 10 2', ...SW(4) }, 'red', { stroke: true })
  ],
  guion: [
    ...paper(22, 42, 76, 96),
    s('path', { d: 'M34 58h24M42 72h44M42 84h44M34 100h24M42 114h40', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 86, y: 74, width: 58, height: 40, rx: 3 }, 'dark', { accent: true }),
    s('path', { d: 'M86 66l56-14 4 12-56 14z' }, 'dark'),
    s('path', { d: 'M98 62l6 10M114 58l6 10M130 54l6 10', ...SW(4) }, 'white', { stroke: true })
  ],
  heterosexual: [
    ground(),
    ...person(50, 136, 'blue'),
    ...lady(110, 136, 'pink'),
    s('path', { d: 'M66 104h28', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 40, 14) }, 'red', { accent: true })
  ],
  'hidráulica': [
    s('path', { d: 'M14 36h70', ...SW(14) }, 'blue', { stroke: true }),
    s('path', { d: 'M84 36q12 0 12 18', ...SW(10) }, 'sky', { stroke: true }),
    s('circle', { cx: 90, cy: 96, r: 38 }, 'brown', { accent: true }),
    s('circle', { cx: 90, cy: 96, r: 26 }, 'cream'),
    s('path', { d: rays(90, 96, 0, 38, 8) + ring(90, 96, 38), ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M14 136h132', ...SW(10) }, 'blue', { stroke: true }),
    s('circle', { cx: 90, cy: 96, r: 7 }, 'dark')
  ],
  imperialista: [
    s('circle', { cx: 80, cy: 98, r: 42 }, 'sky'),
    s('path', { d: 'M54 76q14-10 26 0t8 22q-12 8-24 0t-10-22zM96 104q14-4 18 10t-12 16q-10-10-6-26z' }, 'green'),
    s('path', { d: 'M52 50l8 18h40l8-18-14 10-14-18-14 18z' }, 'yellow', { accent: true }),
    s('path', { d: 'M62 104V78M110 90V64', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 78h14l-4 6 4 6H62zM110 64h14l-4 6 4 6h-14z' }, 'purple')
  ],
  incompatible: [
    s('rect', { x: 92, y: 30, width: 54, height: 100, rx: 8 }, 'white'),
    outline({ x: 92, y: 30, width: 54, height: 100, rx: 8 }),
    s('path', { d: rects([[106, 60, 8, 22], [124, 60, 8, 22]]) }, 'dark'),
    s('path', { d: 'M14 80h30', ...SW(8) }, 'dark', { stroke: true }),
    s('rect', { x: 40, y: 62, width: 34, height: 36, rx: 8 }, 'orange', { accent: true }),
    s('path', { d: dots([[86, 70], [86, 90]], 4) }, 'gray'),
    s('path', { d: 'M74 70h12M74 90h12', ...SW(4) }, 'gray', { stroke: true }),
  ],
  jade: [
    s('path', { d: 'M80 14v32', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: ring(80, 92, 34), ...SW(28) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M56 74q8-10 20-12', ...SW(5) }, 'mint', { stroke: true }),
    s('path', { d: 'M74 46h12l-2 8h-8z' }, 'red'),
    s('path', { d: 'M76 128l-4 14M84 128l4 14', ...SW(4) }, 'red', { stroke: true })
  ],
  jurista: [
    ground(),
    ...person(48, 136, 'navy', { h: 50, w: 30, r: 13 }),
    s('path', { d: 'M36 66h10M50 66h10M46 66h4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: rects([[84, 120, 58, 16], [88, 104, 52, 16], [82, 88, 58, 16]]) }, 'red', { accent: true }),
    s('path', { d: 'M90 112h44M86 96h48M92 128h44', ...SW(2) }, 'yellow', { stroke: true }),
    s('path', { d: 'M112 40v44M96 48h32M96 48l-8 18h16zM128 48l-8 18h16z', ...SW(3) }, 'yellow', { stroke: true })
  ],
  lancha: [
    s('path', { d: 'M14 112q16-6 30 0t30 0t30 0t42 0v28H14z' }, 'blue'),
    s('path', { d: 'M30 88h96l20-8-18 28H40z' }, 'white', { accent: true }),
    s('path', { d: 'M30 88h96l20-8-18 28H40z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 98h88', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M70 88l14-18h22l-4 18z' }, 'sky'),
    s('path', { d: 'M14 100l16-4M14 112l20-6', ...SW(4) }, 'sky', { stroke: true })
  ],
  loa: [
    ground(),
    ...person(54, 136, 'orange', { h: 46, w: 30, r: 14 }),
    s('ellipse', { cx: 58, cy: 80, rx: 5, ry: 6 }, 'dark'),
    s('path', { d: 'M40 96L22 70M68 96l18-26', ...SW(7) }, 'orange', { stroke: true }),
    ...note(100, 66, 'purple'),
    s('path', { d: laurel(116, 108, 20, 10, 3) }, 'green', { accent: true }),
    s('path', { d: star(116, 108, 10) }, 'yellow')
  ],
  'lírica': [
    s('path', { d: 'M54 128q-24-40-14-80q4-16 16-18q-6 30 8 60M106 128q24-40 14-80q-4-16-16-18q6 30-8 60', ...SW(8) }, 'yellow', { stroke: true, accent: true }),
    s('rect', { x: 46, y: 120, width: 68, height: 14, rx: 4 }, 'brown'),
    s('path', { d: 'M48 56h64', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M64 58v62M76 58v62M88 58v62M100 58v62', ...SW(2) }, 'gray', { stroke: true }),
    ...note(130, 30, 'blue')
  ],
  muchedumbre: [
    s('path', { d: dots([[22, 70], [46, 64], [70, 70], [94, 64], [118, 70], [140, 64]], 9) }, 'skin'),
    s('path', { d: busts([22, 46, 70, 94, 118, 140], 106, 20, 28) }, 'gray'),
    s('path', { d: dots([[32, 100], [58, 94], [84, 100], [110, 94], [134, 100]], 11) }, 'tan'),
    s('path', { d: busts([32, 84, 134], 142, 26, 30) }, 'blue', { accent: true }),
    s('path', { d: busts([58, 110], 142, 26, 34) }, 'red')
  ],
  nazismo: [
    backdrop('gray'),
    s('path', { d: 'M14 146v-12h132v12z' }, 'dark'),
    s('path', { d: 'M22 134V84h18v36h14v14zM62 134V84h18v36h14v14zM102 134V84h18v36h14v14z' }, 'black', { accent: true }),
    s('path', { d: 'M24 92h14M64 92h14M104 92h14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M26 40q16-20 40-10q20-16 40 0q24-6 30 14q-40 10-110-4z' }, 'dark')
  ],
  nulidad: [
    s('path', { d: 'M24 24h48l-8 20 10 20-10 22 8 20-6 30H24z' }, 'white'),
    s('path', { d: 'M24 24h48l-8 20 10 20-10 22 8 20-6 30H24z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M92 30h44v112H96l6-30-8-20 10-22-10-20z' }, 'white'),
    s('path', { d: 'M92 30h44v112H96l6-30-8-20 10-22-10-20z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 44h26M34 58h26M34 72h22M108 50h20M108 64h20M108 78h20', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 60, cy: 116, r: 10 }, 'red', { accent: true }),
    s('circle', { cx: 110, cy: 120, r: 8 }, 'red')
  ],
  oca: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'mint'),
    s('path', { d: 'M90 132v-14M104 132v-14', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M44 88q10-28 46-20q16 4 26-8l-6-30q0-12 12-12t12 12l-6 36q-6 50-50 50q-30 0-34-28z' }, 'white', { accent: true }),
    s('path', { d: 'M44 88q10-28 46-20q16 4 26-8l-6-30q0-12 12-12t12 12l-6 36q-6 50-50 50q-30 0-34-28z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M134 26l14 6-14 4z' }, 'orange'),
    s('circle', { cx: 126, cy: 26, r: 3 }, 'dark'),
    s('path', { d: 'M62 92q16 12 36 2', ...SW(3) }, 'gray', { stroke: true })
  ],
  paladar: [
    s('path', { d: 'M20 76q60-60 120 0q-60 80-120 0z' }, 'red'),
    s('path', { d: 'M34 76q46-40 92 0q-46 50-92 0z' }, 'dark'),
    s('path', { d: 'M40 70q40-30 80 0q-40-12-80 0z' }, 'pink', { accent: true }),
    s('path', { d: 'M46 72h68v6H46z' }, 'white'),
    s('path', { d: 'M56 96q24-16 48 0q-24 14-48 0z' }, 'pink'),
    s('path', { d: sparkle(130, 30, 10) }, 'yellow')
  ],
  paranoia: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'navy'),
    s('path', { d: ells([[34, 36, 12, 7], [126, 40, 12, 7], [30, 96, 12, 7], [130, 100, 12, 7], [80, 28, 12, 7]]) }, 'white'),
    s('path', { d: dots([[38, 36], [122, 40], [34, 96], [126, 100], [80, 30]], 4) }, 'dark'),
    s('circle', { cx: 80, cy: 88, r: 20 }, 'skin'),
    s('path', { d: 'M54 146q0-36 26-36t26 36z' }, 'orange', { accent: true }),
    s('path', { d: dots([[72, 86], [88, 86]], 4) }, 'dark'),
    s('path', { d: 'M72 100q8-6 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  paridad: [
    s('path', { d: 'M80 30v100M54 136h52M24 46h112', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 46l-14 40h28zM130 46l-14 40h28z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M12 86a18 8 0 0 0 36 0zM112 86a18 8 0 0 0 36 0z' }, 'gray'),
    s('rect', { x: 18, y: 64, width: 24, height: 22, rx: 3 }, 'blue', { accent: true }),
    s('rect', { x: 118, y: 64, width: 24, height: 22, rx: 3 }, 'blue'),
    s('circle', { cx: 80, cy: 28, r: 7 }, 'yellow')
  ],
  patear: [
    ground(),
    s('circle', { cx: 58, cy: 36, r: 13 }, 'skin'),
    s('rect', { x: 44, y: 52, width: 28, height: 44, rx: 10 }, 'red', { accent: true }),
    s('path', { d: 'M54 96l-8 40M64 94l26 20', ...SW(9) }, 'blue', { stroke: true }),
    s('path', { d: 'M46 60L28 80M70 60l20 6', ...SW(7) }, 'red', { stroke: true }),
    s('circle', { cx: 116, cy: 104, r: 14 }, 'white'),
    s('path', { d: ring(116, 104, 14) + 'M108 96l8 4 8-4M116 100v10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M136 92l8-4M138 104h8M136 116l8 4', ...SW(3) }, 'orange', { stroke: true })
  ],
  paterno: [
    ground(),
    ...person(80, 136, 'navy', { h: 58, w: 36, r: 15 }),
    s('circle', { cx: 80, cy: 34, r: 11 }, 'skin'),
    s('rect', { x: 68, y: 44, width: 24, height: 18, rx: 8 }, 'yellow', { accent: true }),
    s('path', { d: 'M70 50l-14 14M90 50l14 14', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M62 94q-8-18 4-26M98 94q8-18-4-26', ...SW(7) }, 'navy', { stroke: true }),
    s('path', { d: 'M72 70q8 4 16 0', ...SW(4) }, 'brown', { stroke: true })
  ],
  'pedagógico': [
    s('rect', { x: 18, y: 18, width: 124, height: 70, rx: 4 }, 'green'),
    s('path', { d: 'M18 18h124v70H18z', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M34 70l18-28 18 28zM92 56a12 12 0 1 1 0 .1', ...SW(3) }, 'white', { stroke: true }),
    ...person(128, 140, 'purple', { h: 30, w: 22, r: 10, accent: true }),
    s('path', { d: 'M118 112L96 74', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: dots([[38, 112], [74, 112]], 10) }, 'skin'),
    s('path', { d: busts([38, 74], 142, 24, 22) }, 'blue')
  ],
  plagio: [
    s('rect', { x: 14, y: 30, width: 56, height: 74, rx: 3 }, 'white'),
    outline({ x: 14, y: 30, width: 56, height: 74, rx: 3 }),
    s('rect', { x: 90, y: 56, width: 56, height: 74, rx: 3 }, 'white'),
    outline({ x: 90, y: 56, width: 56, height: 74, rx: 3 }),
    s('path', { d: star(42, 62, 16) + star(118, 88, 16) }, 'orange', { accent: true }),
    arrow('M50 116q20 22 46 10M84 116l12 10-14 6', 'red', 5),
    s('path', { d: 'M100 112h36M100 120h24', ...SW(3) }, 'gray', { stroke: true })
  ],
  'quirúrgico': [
    s('rect', { x: 24, y: 40, width: 80, height: 46, rx: 12 }, 'sky', { accent: true }),
    s('path', { d: 'M24 52q-14 4-10 20M104 52q14 4 10 20M34 56h60M34 70h60', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: 'M24 52q-14 4-10 20M104 52q14 4 10 20', ...SW(3) }, 'white', { stroke: true }),
    s('rect', { x: 40, y: 112, width: 64, height: 10, rx: 5, transform: 'rotate(-30 72 117)' }, 'gray'),
    s('path', { d: 'M100 98l40-22q-10 20-34 30z' }, 'gray'),
    s('path', { d: 'M100 98l40-22', ...SW(2) }, 'white', { stroke: true })
  ],
  'radiodifusión': [
    s('path', { d: 'M80 52L56 140M80 52l24 88M66 104h28M60 124h40', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 48, r: 8 }, 'red'),
    s('path', { d: 'M62 30a26 26 0 0 0 0 36M98 30a26 26 0 0 1 0 36M46 18a44 44 0 0 0 0 60M114 18a44 44 0 0 1 0 60', ...SW(5) }, 'blue', { stroke: true }),
    ground(140)
  ],
  reconquista: [
    ground(),
    s('path', { d: 'M40 136V72h10v-10h10v10h10v-10h10v10h10v-10h10v10h10v64z' }, 'gray'),
    s('path', { d: 'M72 136v-24a8 8 0 0 1 16 0v24z' }, 'dark'),
    s('path', { d: 'M80 62V22', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 22h30l-8 9 8 9H82z' }, 'blue', { accent: true }),
    arrow('M22 50q0-30 40-30M48 12l14 8-12 10', 'orange', 5)
  ],
  rectificar: [
    s('path', { d: 'M20 60l20-14 16 20 18-18 16 16 22-20', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M20 112h104', ...SW(6) }, 'green', { stroke: true, accent: true }),
    s('rect', { x: 122, y: 40, width: 14, height: 70, rx: 2, transform: 'rotate(20 129 110)' }, 'yellow'),
    s('path', { d: 'M124 112l-4-12 10 4z' }, 'dark'),
    s('rect', { x: 122, y: 36, width: 14, height: 10, rx: 2, transform: 'rotate(20 129 110)' }, 'pink'),
    arrow('M60 74v22M52 88l8 8 8-8', 'gray', 4)
  ],
  'relámpago': [
    s('path', { d: 'M30 62q0-22 24-22q8-20 32-16q20-10 34 8q22 2 22 22q0 18-20 18H46q-16 0-16-10z' }, 'dark'),
    s('path', { d: 'M84 70l-26 40h22l-14 36 40-50H82l14-26z' }, 'yellow', { accent: true }),
    s('path', { d: 'M30 102l-8 14M122 98l8 14', ...SW(4) }, 'sky', { stroke: true })
  ],
  retrasar: [
    s('rect', { x: 18, y: 34, width: 68, height: 76, rx: 6 }, 'white'),
    outline({ x: 18, y: 34, width: 68, height: 76, rx: 6 }),
    s('rect', { x: 18, y: 34, width: 68, height: 20, rx: 6 }, 'red'),
    s('path', { d: rects([[28, 64, 12, 10], [46, 64, 12, 10], [64, 64, 12, 10], [28, 82, 12, 10], [64, 82, 12, 10]]) }, 'gray'),
    s('rect', { x: 46, y: 82, width: 12, height: 10 }, 'orange', { accent: true }),
    arrow('M54 98q30 40 70 14M110 104l14 8-4 14', 'orange', 5),
    s('rect', { x: 112, y: 52, width: 34, height: 40, rx: 4 }, 'cream'),
    s('rect', { x: 122, y: 64, width: 14, height: 14 }, 'orange')
  ],
  rotundo: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'red', { accent: true }),
    s('path', { d: 'M62 122V70a7 7 0 0 1 14 0V54a7 7 0 0 1 14 0v10a7 7 0 0 1 14 0v30q0 28-28 28z' }, 'white'),
    s('path', { d: 'M62 82a8 8 0 0 0-14 4l14 22z' }, 'white'),
    s('path', { d: ring(80, 80, 62), ...SW(4) }, 'dark', { stroke: true })
  ],
  sable: [
    s('path', { d: 'M48 116Q104 92 134 20Q118 92 54 126z' }, 'gray', { accent: true }),
    s('path', { d: 'M52 120Q106 94 134 20', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M36 106l24 28', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M48 120l-22 18', ...SW(9) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 108q-20 0-20 20', ...SW(4) }, 'yellow', { stroke: true })
  ],
  secuestrador: [
    s('circle', { cx: 74, cy: 64, r: 36 }, 'black', { accent: true }),
    s('path', { d: 'M38 146q0-46 36-46t36 46z' }, 'dark'),
    s('rect', { x: 52, y: 52, width: 44, height: 16, rx: 8 }, 'skin'),
    s('path', { d: dots([[64, 60], [84, 60]], 4) }, 'dark'),
    s('path', { d: ring(128, 116, 14) + ring(128, 116, 7), ...SW(5) }, 'tan', { stroke: true })
  ],
  simbolismo: [
    s('rect', { x: 24, y: 24, width: 112, height: 112, rx: 4 }, 'sky'),
    s('path', { d: 'M24 24h112v112H24z', ...SW(10) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M54 76q12-24 34-14q10-16 26-14q-6 18-24 22q-8 18-28 14l-14 6z' }, 'white'),
    s('path', { d: 'M108 52l8 0-4 6z' }, 'orange'),
    s('path', { d: leaflet(66, 106, -30, 34, 7) }, 'green'),
    s('circle', { cx: 104, cy: 110, r: 9 }, 'yellow')
  ],
  sofisticado: [
    s('rect', { x: 44, y: 44, width: 72, height: 72, rx: 8 }, 'dark', { accent: true }),
    s('rect', { x: 58, y: 58, width: 44, height: 44, rx: 4 }, 'navy'),
    s('path', { d: 'M56 44V26M72 44V26M88 44V26M104 44V26M56 116v18M72 116v18M88 116v18M104 116v18M44 56H26M44 72H26M44 88H26M44 104H26M116 56h18M116 72h18M116 88h18M116 104h18', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M66 70h14v20h14', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: dots([[66, 70], [94, 90]], 4) }, 'sky')
  ],
  suavidad: [
    s('path', { d: 'M24 120q0-24 24-24q6-22 30-18q20-14 38 4q24 0 24 24q0 18-20 18H40q-16 0-16-4z' }, 'pink', { accent: true }),
    s('path', { d: 'M52 30q30-6 54 26q-24 6-54-26z' }, 'white'),
    s('path', { d: 'M52 30q30-6 54 26q-24 6-54-26zM52 30l70 36', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 112q8-4 16 0t16 0', ...SW(3) }, 'white', { stroke: true })
  ],
  suburbio: [
    s('path', { d: rects([[70, 30, 14, 50], [88, 22, 16, 58], [108, 36, 14, 44], [56, 46, 12, 34]]) }, 'gray'),
    s('rect', { x: 14, y: 108, width: 132, height: 32 }, 'green'),
    s('path', { d: 'M20 108V88l16-14 16 14v20zM62 108V88l16-14 16 14v20zM104 108V88l16-14 16 14v20z' }, 'cream'),
    s('path', { d: 'M16 90l20-18 20 18M58 90l20-18 20 18M100 90l20-18 20 18', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: rects([[32, 96, 8, 12], [74, 96, 8, 12], [116, 96, 8, 12]]) }, 'brown'),
    s('path', { d: 'M14 80h132', ...SW(2) }, 'gray', { stroke: true })
  ],
  sustancialmente: [
    s('path', { d: 'M18 136h124', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 30, y: 112, width: 36, height: 24, rx: 3 }, 'sky'),
    s('rect', { x: 94, y: 40, width: 36, height: 96, rx: 3 }, 'blue', { accent: true }),
    arrow('M48 100q10-60 40-66M76 26l12 8-10 10', 'orange', 6)
  ],
  'tabú': [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'yellow', { accent: true }),
    s('path', { d: dots([[60, 64], [100, 64]], 7) }, 'dark'),
    s('rect', { x: 48, y: 94, width: 64, height: 14, rx: 7 }, 'gray'),
    s('path', { d: 'M54 101h52', ...DASH(4, '3 4') }, 'dark', { stroke: true }),
    s('rect', { x: 102, y: 92, width: 12, height: 18, rx: 3 }, 'dark')
  ],
  'tacón': [
    s('path', { d: 'M26 70q20-4 34 20q14 18 40 22h26q10 0 14 10v6H86q-30-4-48-28q-6 18-12 40h-8l8-44q-8-14 0-26z' }, 'red', { accent: true }),
    s('path', { d: 'M26 70q20-4 34 20q14 18 40 22', ...SW(2) }, 'pink', { stroke: true }),
    s('path', { d: 'M20 132h12', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M88 128h52', ...SW(4) }, 'dark', { stroke: true })
  ],
  tallo: [
    s('path', { d: 'M24 140q4-10 56-10t56 10z' }, 'brown'),
    s('path', { d: 'M80 132q-8-50 4-110', ...SW(9) }, 'green', { stroke: true, accent: true }),
    s('path', { d: leaflet(78, 100, 200, 40, 12) + leaflet(80, 72, -20, 40, 12) + leaflet(82, 46, 210, 32, 10) }, 'mint'),
    s('circle', { cx: 84, cy: 22, r: 10 }, 'pink')
  ],
  tesorero: [
    s('path', { d: 'M74 136V96h70v40z' }, 'brown'),
    s('path', { d: 'M74 96a35 22 0 0 1 70 0z' }, 'orange'),
    s('path', { d: 'M74 96h70M109 74v62', ...SW(4) }, 'yellow', { stroke: true }),
    s('rect', { x: 102, y: 102, width: 14, height: 14, rx: 2 }, 'yellow', { accent: true }),
    ...person(38, 136, 'green', { h: 50, w: 30, r: 13 }),
    s('path', { d: 'M52 100h12', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: ring(66, 92, 6) + 'M66 98v14h6M66 106h4', ...SW(3) }, 'yellow', { stroke: true })
  ],
  'títere': [
    s('path', { d: 'M40 22h80M80 14v20', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M44 22l2 66M80 30v16M116 22l-2 66M60 22l2 98M100 22l-2 98', ...SW(1.5) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 56, r: 12 }, 'skin'),
    s('rect', { x: 66, y: 68, width: 28, height: 36, rx: 6 }, 'red', { accent: true }),
    s('path', { d: 'M68 74l-22 14M92 74l22 14M72 104l-10 18M88 104l10 18', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: dots([[76, 54], [84, 54]], 2) }, 'dark')
  ],
  verdugo: [
    s('path', { d: 'M42 146V96q0-12 10-16h48q10 4 10 16v50z' }, 'black'),
    s('path', { d: 'M52 82q-4-56 28-58q32 2 28 58z' }, 'black', { accent: true }),
    s('path', { d: ells([[70, 54, 6, 4], [90, 54, 6, 4]]) }, 'white'),
    s('path', { d: 'M128 146V40', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M128 40q-24 0-26 20q2 18 26 16z' }, 'gray')
  ],
  coto: [
    s('rect', { x: 14, y: 96, width: 132, height: 44 }, 'mint'),
    s('path', { d: 'M110 96V60', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 110, cy: 50, r: 22 }, 'green'),
    s('path', { d: 'M48 116v20M56 116v20M78 116v20M86 116v20', ...SW(5) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 66, cy: 108, rx: 26, ry: 12 }, 'tan', { accent: true }),
    s('path', { d: 'M86 104l8-22h10l-4 14z' }, 'tan'),
    s('path', { d: 'M96 82l-6-14M100 82l8-14M88 72l4 4M106 72l-4 4', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M14 120h132M14 136h132M22 106v34M50 106v34M138 106v34', ...SW(4) }, 'brown', { stroke: true })
  ],
  insensible: [
    s('path', { d: heart(80, 92, 44) }, 'gray', { accent: true }),
    s('path', { d: 'M54 74l14 10-6 14M100 72l-10 14 12 8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 54l10 6M120 52l12 6M46 30l6 10', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: 'M38 66l6 10 6-8 6 12 6-10', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: sparkle(130, 120, 9) + sparkle(28, 112, 7) }, 'sky')
  ],
  'instantáneamente': [
    s('circle', { cx: 90, cy: 88, r: 46 }, 'white'),
    s('path', { d: ring(90, 88, 46), ...SW(7) }, 'dark', { stroke: true }),
    s('rect', { x: 82, y: 26, width: 16, height: 12, rx: 3 }, 'dark'),
    s('path', { d: wedge(90, 88, 40, -90, -60) }, 'red', { accent: true }),
    s('path', { d: 'M90 88V52', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 70h22M18 88h18M14 106h22', ...SW(5) }, 'orange', { stroke: true })
  ],
  ye: [
    s('path', { d: 'M80 140V88L46 30M80 88l34-58', ...SW(14) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M46 30q34 40 68 0', ...SW(4) }, 'red', { stroke: true }),
    s('rect', { x: 68, y: 112, width: 24, height: 28, rx: 4 }, 'dark'),
    s('circle', { cx: 80, cy: 50, r: 7 }, 'gray')
  ],
  'ágil': [
    ground(),
    s('rect', { x: 66, y: 112, width: 28, height: 24 }, 'orange'),
    s('circle', { cx: 92, cy: 30, r: 11 }, 'skin'),
    s('rect', { x: 70, y: 40, width: 22, height: 32, rx: 8, transform: 'rotate(-60 81 56)' }, 'green', { accent: true }),
    s('path', { d: 'M70 60l-24 14M94 50l22-14M72 66l-28-10M92 62l26 10', ...SW(7) }, 'green', { stroke: true }),
    s('path', { d: 'M24 46q10-18 30-16M30 64q8-10 18-8', ...SW(3) }, 'gray', { stroke: true })
  ],
  'ajá': [
    s('circle', { cx: 64, cy: 96, r: 40 }, 'skin', { accent: true }),
    s('path', { d: dots([[50, 88], [78, 88]], 5) }, 'dark'),
    s('ellipse', { cx: 64, cy: 112, rx: 10, ry: 8 }, 'dark'),
    s('path', { d: 'M26 82q0-46 38-46t38 46q-8-28-38-28T26 82z' }, 'brown'),
    s('path', { d: 'M116 52q-14-6-14-22a18 18 0 0 1 36 0q0 16-14 22z' }, 'yellow'),
    s('rect', { x: 114, y: 52, width: 12, height: 8, rx: 2 }, 'gray'),
    s('path', { d: 'M104 12l-4-6M120 6V0M136 12l4-6', ...SW(3) }, 'orange', { stroke: true })
  ],
  apache: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'sky'),
    s('circle', { cx: 116, cy: 42, r: 14 }, 'yellow'),
    s('path', { d: 'M14 146v-60h20l6-14h30l6 14h8v60zM96 146v-40l8-10h26l4 10h12v40z' }, 'orange', { accent: true }),
    s('path', { d: 'M14 146v-24h132v24z' }, 'tan'),
    s('path', { d: 'M86 140v-30M78 120v-8M94 116v-8', ...SW(6) }, 'green', { stroke: true })
  ],
  'aragonés': [
    s('path', { d: 'M26 140V18', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 28, y: 22, width: 110, height: 84 }, 'yellow', { accent: true }),
    s('path', { d: rects([[28, 31, 110, 9], [28, 49, 110, 9], [28, 67, 110, 9], [28, 85, 110, 9]]) }, 'red'),
    s('rect', { x: 28, y: 22, width: 110, height: 84, ...SW(2) }, 'gray', { stroke: true })
  ],
  'ascensión': [
    s('path', { d: 'M80 16q-36 0-36 38q0 26 26 44h20q26-18 26-44q0-38-36-38z' }, 'red', { accent: true }),
    s('path', { d: 'M80 16q-12 0-12 38q0 26 6 44h12q6-18 6-44q0-38-12-38z' }, 'yellow'),
    s('path', { d: 'M70 98l2 16M90 98l-2 16', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 68, y: 114, width: 24, height: 18, rx: 3 }, 'brown'),
    arrow('M126 120V70M116 80l10-10 10 10', 'green', 5),
    s('path', { d: 'M14 140q20-10 40 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  aterrador: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'dark'),
    s('path', { d: 'M28 146V60q0-34 34-34t34 34v86l-11-10-11 10-12-10-11 10-12-10z' }, 'purple', { accent: true }),
    s('path', { d: ells([[50, 62, 7, 10], [74, 62, 7, 10]]) }, 'yellow'),
    s('path', { d: 'M48 90l6 6 8-6 8 6 6-6', ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 120, cy: 96, r: 12 }, 'skin'),
    s('path', { d: 'M108 146q0-36 12-36t12 36z' }, 'sky'),
    s('path', { d: 'M110 74l-6-8M120 70v-10M130 74l6-8', ...SW(3) }, 'yellow', { stroke: true })
  ],
  brutalmente: [
    s('path', { d: 'M14 128h132v12H14z' }, 'brown'),
    s('path', { d: 'M30 124l20-8 10 8zM64 126l14-16 16 16zM100 124l12-10 18 10z' }, 'white'),
    s('path', { d: 'M30 124l20-8 10 8zM64 126l14-16 16 16zM100 124l12-10 18 10z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 24L72 92', ...SW(9) }, 'brown', { stroke: true }),
    s('rect', { x: 50, y: 78, width: 50, height: 26, rx: 4, transform: 'rotate(28 75 91)' }, 'dark', { accent: true }),
    s('path', { d: 'M36 100l-14-8M120 106l16-6M44 84l-10-14', ...SW(4) }, 'red', { stroke: true })
  ],
  calado: [
    s('rect', { x: 14, y: 80, width: 132, height: 60 }, 'sky'),
    s('path', { d: 'M24 66h112l-14 44H38z' }, 'red', { accent: true }),
    s('path', { d: 'M24 66h112l-6 14H30z' }, 'white'),
    s('rect', { x: 52, y: 44, width: 46, height: 22, rx: 3 }, 'white'),
    s('path', { d: 'M52 44h46v22H52zM24 66h112', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 80h132', ...SW(3) }, 'blue', { stroke: true }),
    arrow('M138 84v24M132 100l6 8 6-8M132 92l6-8 6 8', 'navy', 3)
  ],
  caluroso: [
    s('circle', { cx: 56, cy: 56, r: 26 }, 'yellow'),
    s('path', { d: rays(56, 56, 32, 42, 10), ...SW(5) }, 'orange', { stroke: true }),
    s('rect', { x: 106, y: 30, width: 18, height: 84, rx: 9 }, 'white'),
    s('path', { d: 'M106 39a9 9 0 0 1 18 0v75h-18z', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 110, y: 44, width: 10, height: 76 }, 'red', { accent: true }),
    s('circle', { cx: 115, cy: 124, r: 14 }, 'red'),
    s('path', { d: drop(44, 122, 6) + drop(70, 112, 5) }, 'sky')
  ],
  caricia: [
    ground(),
    s('path', { d: 'M30 136q0-46 40-46h20q30 0 30 46z' }, 'orange', { accent: true }),
    s('circle', { cx: 112, cy: 92, r: 18 }, 'orange'),
    s('path', { d: 'M98 80l2-16 10 10zM126 80l-2-16-10 10z' }, 'orange'),
    s('path', { d: 'M104 94q4 4 8 0M116 94q4 4 8 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 132q-16-6-14-26', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M48 70q20-12 46-6q8 4 2 10H54q-10 0-6-4z' }, 'skin'),
    s('path', { d: heart(80, 36, 10) }, 'pink')
  ],
  carnicero: [
    s('rect', { x: 14, y: 114, width: 132, height: 26 }, 'brown'),
    ...person(54, 114, 'white', { h: 50, w: 34, r: 14 }),
    s('rect', { x: 37, y: 64, width: 34, height: 50, rx: 11, ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 72v34M62 72v34', ...SW(2) }, 'red', { stroke: true }),
    s('path', { d: 'M96 112q-8-24 14-30q24-4 28 18q2 14-14 12z' }, 'red', { accent: true }),
    s('path', { d: 'M108 98q10-6 20 2', ...SW(3) }, 'cream', { stroke: true }),
    s('rect', { x: 78, y: 54, width: 22, height: 18, rx: 2 }, 'gray'),
    s('path', { d: 'M78 70l-8 10', ...SW(5) }, 'dark', { stroke: true })
  ],
  censurar: [
    ...paper(30, 18, 100, 124),
    s('path', { d: 'M44 38h72M44 64h30M44 90h72M44 116h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[42, 46, 76, 12], [80, 60, 38, 10], [42, 98, 60, 12]]) }, 'black', { accent: true })
  ],
  cerradura: [
    s('rect', { x: 40, y: 22, width: 80, height: 116, rx: 10 }, 'yellow', { accent: true }),
    s('rect', { x: 40, y: 22, width: 80, height: 116, rx: 10, ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M80 58a14 14 0 0 1 8 26l6 30H66l6-30a14 14 0 0 1 8-26z' }, 'dark'),
    s('path', { d: dots([[54, 34], [106, 34], [54, 126], [106, 126]], 4) }, 'orange')
  ],
  chulo: [
    s('circle', { cx: 74, cy: 82, r: 50 }, 'yellow', { accent: true }),
    s('path', { d: 'M28 70h92v6q-4 20-22 18t-24-16q-6 14-24 16t-22-18z' }, 'black'),
    s('path', { d: 'M54 106q20 14 40-4', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(130, 32, 12) + sparkle(138, 112, 8) }, 'orange'),
    s('path', { d: 'M44 74l10-2', ...SW(3) }, 'white', { stroke: true })
  ],
  'científicamente': [
    s('path', { d: 'M28 100h58l8 24q2 12-10 12H30q-12 0-10-12z' }, 'green', { accent: true }),
    s('path', { d: 'M38 22h28M44 22v40l-24 62q-2 12 10 12h44q12 0 10-12L60 62V22', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: ring(46, 84, 4) + ring(58, 74, 3), ...SW(2) }, 'green', { stroke: true }),
    s('path', { d: 'M112 36l20 46M100 136h44M122 136v-24M104 112h30', ...SW(7) }, 'dark', { stroke: true }),
    s('rect', { x: 100, y: 22, width: 16, height: 32, rx: 4, transform: 'rotate(-24 108 38)' }, 'blue')
  ],
  complementar: [
    s('path', { d: 'M22 40h50v18a10 10 0 1 0 0 20v40H22z' }, 'blue', { accent: true }),
    s('path', { d: 'M88 40h50v78H88V78a10 10 0 1 1 0-20z' }, 'orange'),
    arrow('M42 134h76', 'gray', 4),
    s('path', { d: 'M56 128l-14 6 14 6M104 128l14 6-14 6', ...SW(4) }, 'gray', { stroke: true })
  ],
  cucaracha: [
    s('path', { d: 'M62 60l-24-14M60 80H32M62 100l-24 14M98 60l24-14M100 80h28M98 100l24 14', ...SW(4) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 80, cy: 88, rx: 24, ry: 40 }, 'brown', { accent: true }),
    s('path', { d: 'M80 52v74', ...SW(2) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 80, cy: 44, rx: 14, ry: 10 }, 'dark'),
    s('path', { d: 'M74 36q-10-20-30-22M86 36q10-20 30-22', ...SW(3) }, 'dark', { stroke: true })
  ],
  delicadeza: [
    s('path', { d: 'M20 132q10-30 40-36h30q8 4 0 10H66q20 4 40-8q8 2 4 10q-20 20-60 24z' }, 'skin'),
    s('path', { d: 'M80 74q-20-30-36-16q-4 20 36 22q-20 8-16 20q14 6 16-20z' }, 'purple', { accent: true }),
    s('path', { d: 'M80 74q20-30 36-16q4 20-36 22q20 8 16 20q-14 6-16-20z' }, 'pink'),
    s('path', { d: 'M80 64v22M80 64l-6-10M80 64l6-10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(126, 34, 8) }, 'yellow')
  ],
  detector: [
    s('path', { d: 'M14 128h132v12H14z' }, 'tan'),
    s('path', { d: 'M40 30l44 82', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 30, y: 24, width: 22, height: 14, rx: 4, transform: 'rotate(28 41 31)' }, 'dark'),
    s('ellipse', { cx: 96, cy: 116, rx: 28, ry: 8 }, 'blue', { accent: true }),
    s('circle', { cx: 100, cy: 136, r: 4 }, 'yellow'),
    s('path', { d: 'M120 92q8-6 4-16M130 98q14-10 6-28', ...SW(3) }, 'orange', { stroke: true })
  ]
};
