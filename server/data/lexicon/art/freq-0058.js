// Illustration specs for words still undrawn in batches 0056–0058 (see server/scripts/lexicon/art.js)
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
  igualar: [
    s('path', { d: 'M80 40v86M54 130h52', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 48h104', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 50l-16 32M40 50l16 32M120 50l-16 32M120 50l16 32', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M20 82h40q-2 14-20 14q-18 0-20-14zM100 82h40q-2 14-20 14q-18 0-20-14z' }, 'yellow', { accent: true }),
    s('path', { d: rects([[30, 64, 20, 18], [110, 64, 20, 18]]) }, 'blue'),
    s('circle', { cx: 80, cy: 44, r: 7 }, 'red')
  ],
  chivo: [
    ground(),
    s('path', { d: 'M54 100v36M66 102v34M94 102v34M106 100v36', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M42 86l-8-8', ...SW(5) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 78, cy: 90, rx: 36, ry: 18 }, 'tan', { accent: true }),
    s('path', { d: 'M100 82l10-26h14l14 18-6 8-14-4-8 12z' }, 'tan'),
    s('path', { d: 'M112 56q-6-24-28-24M120 56q2-22-14-30', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M126 80l-2 18-8-16z' }, 'dark'),
    s('circle', { cx: 124, cy: 64, r: 3 }, 'dark')
  ],
  choto: [
    backdrop('mint'),
    s('path', { d: 'M48 104v30M58 106v28M84 106v28M94 104v30', ...SW(5) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 70, cy: 96, rx: 30, ry: 15 }, 'white'),
    s('circle', { cx: 100, cy: 72, r: 14 }, 'white'),
    s('path', { d: 'M90 62l-14-6 10 12zM110 62l14-6-10 12z' }, 'pink'),
    s('path', { d: 'M114 80l16 10', ...SW(4) }, 'orange', { stroke: true }),
    s('rect', { x: 126, y: 82, width: 14, height: 34, rx: 5, transform: 'rotate(-30 133 99)' }, 'sky', { accent: true }),
    s('circle', { cx: 104, cy: 70, r: 2.5 }, 'dark')
  ],
  claustro: [
    s('rect', { x: 18, y: 42, width: 124, height: 80 }, 'tan'),
    s('path', { d: 'M12 44l14-16h108l14 16z' }, 'red', { accent: true }),
    s('path', { d: [24, 54, 84, 114].map(x => `M${x} 118v-46a11 11 0 0 1 22 0v46z`).join('') }, 'dark'),
    s('rect', { x: 14, y: 120, width: 132, height: 22, rx: 4 }, 'green'),
    s('path', { d: dots([[46, 130], [80, 134], [114, 130]], 4) }, 'pink')
  ],
  'combustión': [
    s('path', { d: 'M40 132l80-20M40 112l80 20', ...SW(10) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 20q34 30 30 66q-2 26-30 30q-28-4-30-30q0-22 14-34q2 14 10 18q-4-30 6-50z' }, 'orange', { accent: true }),
    s('path', { d: 'M80 62q18 18 14 36q-4 14-14 14q-12 0-14-14q0-12 8-20q2 8 6 10q-2-14 0-26z' }, 'yellow'),
    s('path', { d: 'M40 40q-6-8 0-16M120 36q6-8 0-16', ...SW(3) }, 'gray', { stroke: true })
  ],
  complacer: [
    ground(),
    ...person(48, 136, 'blue'),
    s('circle', { cx: 112, cy: 78, r: 12 }, 'skin'),
    s('rect', { x: 97, y: 92, width: 30, height: 44, rx: 10 }, 'green'),
    s('path', { d: 'M106 82q6 5 12 0', ...SW(2.5) }, 'dark', { stroke: true }),
    s('rect', { x: 66, y: 92, width: 26, height: 22, rx: 2 }, 'red', { accent: true }),
    s('path', { d: 'M79 92v22M72 86l7 6 7-6', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: heart(112, 44, 10) }, 'pink')
  ],
  'compás': [
    s('path', { d: ring(80, 116, 26), ...DASH(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M90 32L80 116M90 32l16 80', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 104l4 14', ...SW(5) }, 'yellow', { stroke: true }),
    s('circle', { cx: 90, cy: 30, r: 8 }, 'red', { accent: true }),
    s('rect', { x: 86, y: 14, width: 8, height: 12, rx: 2 }, 'dark')
  ],
  conquistador: [
    s('path', { d: 'M14 136q66-40 132 0z' }, 'green'),
    s('path', { d: 'M106 120V36', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M108 38h32l-8 12 8 12h-32z' }, 'red', { accent: true }),
    s('rect', { x: 52, y: 80, width: 30, height: 44, rx: 10 }, 'navy'),
    s('circle', { cx: 67, cy: 66, r: 12 }, 'skin'),
    s('path', { d: 'M48 60q19-6 38 0l-6-6q-4-14-13-14t-13 14z' }, 'gray'),
    s('path', { d: 'M48 96l-22 30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M42 98l-10-6', ...SW(4) }, 'yellow', { stroke: true })
  ],
  constructor: [
    ground(),
    s('path', { d: rects([[86, 112, 28, 12], [116, 112, 28, 12], [100, 124, 28, 12], [86, 124, 12, 12], [130, 124, 14, 12], [100, 100, 28, 12]]) }, 'red'),
    ...person(52, 136, 'orange'),
    s('path', { d: 'M38 74q0-16 14-16t14 16z' }, 'yellow', { accent: true }),
    s('path', { d: 'M34 74h36', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M68 100l18-12', ...SW(5) }, 'gray', { stroke: true })
  ],
  contagio: [
    ground(),
    ...person(36, 136, 'blue'),
    ...person(124, 136, 'purple'),
    s('path', { d: burst(72, 70, 12, 7, 8) + burst(96, 84, 9, 5, 8) }, 'green', { accent: true }),
    s('path', { d: dots([[72, 70], [96, 84]], 4) }, 'mint'),
    s('path', { d: 'M54 64q8-6 12 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  contaminante: [
    s('rect', { x: 26, y: 70, width: 72, height: 50 }, 'gray'),
    s('rect', { x: 76, y: 34, width: 14, height: 40 }, 'dark'),
    s('path', { d: ells([[88, 26, 12, 9], [106, 20, 14, 10], [126, 26, 12, 9]]) }, 'dark'),
    s('path', { d: rects([[36, 84, 12, 12], [56, 84, 12, 12]]) }, 'yellow'),
    s('path', { d: 'M98 104h20v16', ...SW(6) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 116, cy: 132, rx: 30, ry: 8 }, 'purple', { accent: true }),
    s('path', { d: 'M118 124q0 4 0 4', ...SW(4) }, 'purple', { stroke: true }),
    s('path', { d: 'M14 120h84', ...SW(4) }, 'gray', { stroke: true })
  ],
  cordura: [
    s('path', { d: 'M54 136v-22q-20-10-20-40q0-36 40-40q38 0 40 34l10 18-10 4v12q0 10-14 10h-8v24z' }, 'skin'),
    s('path', { d: 'M48 70q-2-22 22-24q24 0 26 22q0 14-14 18H60q-12-2-12-16z' }, 'pink', { accent: true }),
    s('path', { d: 'M70 48v34M58 60q6 4 12 0M72 66q8 4 14 0', ...SW(3) }, 'red', { stroke: true }),
    s('circle', { cx: 118, cy: 40, r: 14 }, 'green'),
    s('path', { d: 'M111 40l5 5 9-10', ...SW(4) }, 'white', { stroke: true })
  ],
  descuido: [
    s('rect', { x: 14, y: 100, width: 132, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M30 110v30M130 110v30', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 56, y: 80, width: 30, height: 22, rx: 4, transform: 'rotate(80 70 98)' }, 'red', { accent: true }),
    s('path', { d: 'M72 98q30 0 40 2q10 4 0 6l14 22', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: dots([[126, 132], [118, 138]], 4) }, 'sky'),
    s('circle', { cx: 116, cy: 44, r: 12 }, 'skin'),
    s('rect', { x: 101, y: 58, width: 30, height: 40, rx: 10 }, 'blue'),
    s('rect', { x: 124, y: 30, width: 12, height: 20, rx: 2 }, 'dark')
  ],
  emplazamiento: [
    s('rect', { x: 18, y: 30, width: 124, height: 106, rx: 8 }, 'mint'),
    s('path', { d: 'M18 74h124M18 108h124M58 30v106M104 30v106', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M40 30v44l-22 34', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M80 98q-24-26-24-44a24 24 0 0 1 48 0q0 18-24 44z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 54, r: 9 }, 'white'),
    s('ellipse', { cx: 80, cy: 102, rx: 12, ry: 4 }, 'dark')
  ],
  endeudamiento: [
    ground(),
    ...lean(56, 136, 18, 'gray'),
    s('path', { d: 'M48 132q30 6 56-6', ...SW(4, { 'stroke-dasharray': '4 6' }) }, 'dark', { stroke: true }),
    s('circle', { cx: 116, cy: 112, r: 24 }, 'dark'),
    s('circle', { cx: 116, cy: 112, r: 12 }, 'yellow', { accent: true }),
    s('path', { d: 'M116 106v12', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: drop(100, 62, 5) }, 'sky')
  ],
  enfocar: [
    s('path', { d: 'M28 50V28h22M110 28h22v22M132 110v22h-22M50 132H28v-22', ...SW(6) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M80 92v30', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots([[69, 80], [91, 80], [80, 69], [80, 91]], 9) }, 'pink'),
    s('circle', { cx: 80, cy: 80, r: 7 }, 'yellow'),
    s('path', { d: 'M80 54v-8M80 114v4M54 80h-8M106 80h8', ...SW(3) }, 'gray', { stroke: true })
  ],
  ermita: [
    backdrop('sky'),
    s('path', { d: 'M14 146v-30q66-30 132 0v30z' }, 'green'),
    s('rect', { x: 64, y: 72, width: 40, height: 40 }, 'white'),
    s('rect', { x: 56, y: 46, width: 16, height: 66 }, 'cream'),
    s('path', { d: 'M60 76l24-20 24 20zM52 48l12-12 12 12z' }, 'red', { accent: true }),
    s('path', { d: 'M78 112V96a6 6 0 0 1 12 0v16zM61 58h6v8h-6z' }, 'brown'),
    s('path', { d: 'M56 112h48', ...SW(2) }, 'gray', { stroke: true })
  ],
  erudito: [
    ground(),
    ...person(52, 136, 'navy'),
    s('path', { d: 'M40 74h24', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: ring(46, 76, 5) + ring(58, 76, 5), ...SW(2.5) }, 'dark', { stroke: true }),
    s('path', { d: rects([[86, 122, 50, 14], [90, 94, 44, 14]]) }, 'red', { accent: true }),
    s('path', { d: rects([[84, 108, 52, 14], [92, 80, 42, 14]]) }, 'blue'),
    s('path', { d: rects([[88, 66, 46, 14]]) }, 'green'),
    s('path', { d: 'M34 70q18-18 36 0', ...SW(4) }, 'gray', { stroke: true })
  ],
  espantoso: [
    backdrop('navy'),
    s('path', { d: 'M40 136V72a40 40 0 0 1 80 0v64l-13-12-14 12-13-12-14 12-13-12z' }, 'white', { accent: true }),
    s('path', { d: ells([[66, 74, 7, 10], [94, 74, 7, 10], [80, 102, 9, 12]]) }, 'dark'),
    s('circle', { cx: 124, cy: 32, r: 10 }, 'yellow'),
    s('path', { d: 'M30 52l-8-4M134 70l8-4', ...SW(3) }, 'sky', { stroke: true })
  ],
  estanque: [
    s('ellipse', { cx: 80, cy: 98, rx: 68, ry: 38 }, 'green'),
    s('ellipse', { cx: 80, cy: 98, rx: 58, ry: 30 }, 'blue', { accent: true }),
    s('path', { d: 'M58 92a14 8 0 1 0 8-6l-8 6zM104 108a12 7 0 1 0 6-6l-6 6z' }, 'mint'),
    s('path', { d: 'M88 86l6-10 6 10 6-10 0 14q-8 6-18 0z' }, 'pink'),
    s('path', { d: 'M40 70V44M46 72V50M118 70V40', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M36 112q10-4 20 0M100 90q8-4 16 0', ...SW(2) }, 'sky', { stroke: true })
  ],
  explorador: [
    s('path', { d: 'M14 136q40-20 70 0q30-24 62 0z' }, 'green'),
    s('rect', { x: 46, y: 92, width: 34, height: 44, rx: 10 }, 'tan'),
    s('circle', { cx: 63, cy: 76, r: 13 }, 'skin'),
    s('path', { d: 'M42 68q21-6 42 0q-4-20-21-20t-21 20z' }, 'brown', { accent: true }),
    s('path', { d: 'M70 74h22', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[92, 70], [92, 80]], 6) }, 'dark'),
    s('path', { d: 'M78 98l12-18', ...SW(6) }, 'tan', { stroke: true }),
    s('path', { d: 'M120 40l4 10 10 0-8 6 3 10-9-6-9 6 3-10-8-6h10z' }, 'yellow')
  ],
  'explícito': [
    s('rect', { x: 36, y: 30, width: 88, height: 100 }, 'cream'),
    s('path', { d: 'M30 22h100a6 6 0 0 1 0 12H30a6 6 0 0 1 0-12zM30 126h100a6 6 0 0 1 0 12H30a6 6 0 0 1 0-12z' }, 'brown'),
    s('path', { d: 'M50 54h60M50 72h60M50 90h44M50 108h52', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(130, 54, 14) }, 'yellow', { accent: true }),
    s('path', { d: 'M36 34v92M124 34v92', ...SW(2) }, 'tan', { stroke: true })
  ],
  'expropiación': [
    ground(),
    s('path', { d: 'M18 100l22-20 22 20v36H18z' }, 'tan'),
    s('path', { d: 'M14 102l26-26 26 26', ...SW(5) }, 'red', { stroke: true }),
    s('rect', { x: 34, y: 116, width: 12, height: 20 }, 'brown'),
    s('path', { d: 'M70 84q14-14 28 0l-6-2M98 84l-2-8', ...SW(5) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M100 70l22-16 22 16z' }, 'gray'),
    s('path', { d: 'M108 74v58M122 74v58M136 74v58', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 100, y: 130, width: 44, height: 6 }, 'dark')
  ],
  flotante: [
    s('rect', { x: 14, y: 96, width: 132, height: 48, rx: 10 }, 'blue'),
    s('circle', { cx: 80, cy: 86, r: 30 }, 'red', { accent: true }),
    s('path', { d: wedge(80, 86, 30, -20, 20) + wedge(80, 86, 30, 70, 110) + wedge(80, 86, 30, 160, 200) + wedge(80, 86, 30, 250, 290) }, 'white'),
    s('circle', { cx: 80, cy: 86, r: 14 }, 'blue'),
    s('path', { d: 'M20 104q10-6 20 0t20 0M100 104q10-6 20 0t20 0M40 126q10-6 20 0t20 0', ...SW(3) }, 'sky', { stroke: true })
  ],
  funcionalidad: [
    s('path', { d: 'M50 76l-24-30 8-4 24 28zM74 72l6-40h6l-4 40z' }, 'gray'),
    s('path', { d: 'M110 74l30-26-4-6-30 26zM110 112l26 16 2-6-26-16z' }, 'gray'),
    s('rect', { x: 36, y: 74, width: 88, height: 40, rx: 20 }, 'red', { accent: true }),
    s('path', { d: 'M74 94h12M80 88v12', ...SW(6, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('path', { d: dots([[48, 94], [112, 94]], 4) }, 'gray')
  ],
  grosero: [
    s('path', { d: 'M96 20l40 10-10 12 14 10-36 2 6-12z' }, 'red', { accent: true }),
    s('path', { d: spiral(110, 36), ...SW(2) }, 'dark', { stroke: true }),
    s('circle', { cx: 66, cy: 92, r: 44 }, 'yellow'),
    s('path', { d: 'M44 78l12 4M88 78l-12 4', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[52, 86], [80, 86]], 4) }, 'dark'),
    s('path', { d: 'M46 106h40', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 106h18v12a9 9 0 0 1-18 0z' }, 'pink')
  ],
  hechizo: [
    s('path', { d: 'M36 132l64-64', ...SW(9) }, 'dark', { stroke: true }),
    s('path', { d: 'M92 76l12-12', ...SW(9) }, 'white', { stroke: true }),
    s('path', { d: star(112, 50, 16) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(56, 52, 12) + sparkle(132, 92, 10) + sparkle(84, 26, 8) }, 'purple'),
    s('path', { d: 'M112 70q12 26-6 40q-14 8-20-4', ...SW(3, { 'stroke-dasharray': '2 6' }) }, 'pink', { stroke: true })
  ],
  heladera: [
    backdrop('sky'),
    s('rect', { x: 46, y: 20, width: 68, height: 124, rx: 8 }, 'white'),
    outline({ x: 46, y: 20, width: 68, height: 124, rx: 8 }),
    s('path', { d: 'M46 62h68', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M102 34v18M102 74v30', ...SW(5) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M60 30l6 8M66 30l-6 8M63 28v12', ...SW(2) }, 'sky', { stroke: true })
  ],
  inexplicable: [
    s('circle', { cx: 80, cy: 96, r: 40 }, 'yellow'),
    s('path', { d: dots([[64, 90], [96, 90]], 5) }, 'dark'),
    s('path', { d: 'M54 76l16-4M90 70l16 6M68 116q12-8 24 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: spiral(56, 30) + spiral(94, 24), ...SW(3) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: sparkle(132, 44, 10) + sparkle(28, 54, 8) }, 'orange')
  ],
  inseguro: [
    s('path', { d: 'M54 80V54a26 26 0 0 1 52 0v-6', ...SW(10) }, 'gray', { stroke: true }),
    s('rect', { x: 36, y: 78, width: 88, height: 62, rx: 10 }, 'orange', { accent: true }),
    s('path', { d: 'M80 96a8 8 0 0 1 4 15v10h-8v-10a8 8 0 0 1 4-15z' }, 'dark'),
    s('path', { d: 'M114 28l14-8M118 44l16 0', ...SW(4) }, 'red', { stroke: true })
  ],
  interferir: [
    ground(),
    ...person(28, 136, 'blue', { w: 24, h: 40, r: 10 }),
    ...person(132, 136, 'green', { w: 24, h: 40, r: 10 }),
    ...person(80, 136, 'red', { accent: true, w: 26, h: 44, r: 11 }),
    s('path', { d: 'M68 98l-12-30M92 98l12-30', ...SW(6) }, 'red', { stroke: true }),
    s('circle', { cx: 80, cy: 44, r: 9 }, 'yellow')
  ],
  laburo: [
    ground(),
    ...person(48, 136, 'blue'),
    s('path', { d: 'M60 104l20-6', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: rects([[78, 106, 36, 30], [116, 106, 26, 30]]) }, 'tan'),
    s('rect', { x: 84, y: 76, width: 40, height: 30 }, 'brown', { accent: true }),
    s('path', { d: 'M78 121h36M84 91h40M116 121h26', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: drop(66, 60, 4) }, 'sky')
  ],
  'manía': [
    s('circle', { cx: 80, cy: 90, r: 46 }, 'yellow'),
    s('path', { d: spiral(56, 82) + spiral(92, 82), ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 116q18 12 36 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: heart(40, 26, 10) + heart(120, 26, 10) + heart(80, 16, 7) }, 'red', { accent: true })
  ],
  'mayúscula': [
    s('rect', { x: 26, y: 34, width: 108, height: 100, rx: 16 }, 'gray'),
    s('rect', { x: 32, y: 34, width: 96, height: 88, rx: 12 }, 'white'),
    outline({ x: 32, y: 34, width: 96, height: 88, rx: 12 }),
    s('path', { d: 'M80 48l30 32H94v26H66V80H50z' }, 'blue', { accent: true })
  ],
  'motín': [
    s('rect', { x: 14, y: 124, width: 132, height: 20, rx: 6 }, 'blue'),
    s('path', { d: 'M18 104h124l-14 24H32z' }, 'brown'),
    s('path', { d: 'M80 104V22', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 26h30l-8 8 8 8H82z' }, 'black'),
    s('path', { d: busts([38, 60, 104, 126], 104, 18, 22) }, 'red', { accent: true }),
    s('path', { d: dots([[38, 74], [60, 74], [104, 74], [126, 74]], 7) }, 'skin'),
    s('path', { d: 'M46 88l6-24M118 88l-6-24', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: dots([[52, 62], [112, 62]], 4) }, 'skin')
  ],
  oficialismo: [
    ground(),
    s('path', { d: 'M24 62l56-30 56 30z' }, 'gray'),
    s('path', { d: 'M38 68v58M59 68v58M80 68v58M101 68v58M122 68v58', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'tan', { stroke: true }),
    s('rect', { x: 20, y: 126, width: 120, height: 10 }, 'gray'),
    s('path', { d: star(80, 50, 9) }, 'yellow', { accent: true }),
    s('rect', { x: 20, y: 62, width: 120, height: 6 }, 'dark')
  ],
  opcional: [
    s('path', { d: rects([[30, 26, 30, 30]]) }, 'green', { accent: true }),
    s('path', { d: 'M36 41l7 7 12-14', ...SW(4) }, 'white', { stroke: true }),
    s('rect', { x: 30, y: 66, width: 30, height: 30, rx: 2, ...DASH(3, '5 4') }, 'gray', { stroke: true }),
    s('rect', { x: 30, y: 106, width: 30, height: 30, rx: 2, ...DASH(3, '5 4') }, 'gray', { stroke: true }),
    s('path', { d: 'M74 41h56M74 81h46M74 121h52', ...SW(8) }, 'sky', { stroke: true })
  ],
  paleta: [
    s('path', { d: 'M80 28c40 0 62 26 62 52s-18 40-36 32c-12-6-22 2-18 14 4 12-6 18-18 18-34 0-52-30-52-58s26-58 62-58zM70 104a8 8 0 1 0 0.1 0z' }, 'tan', { accent: true }),
    s('path', { d: dots([[52, 70], [74, 50], [104, 52]], 9) }, 'red'),
    s('path', { d: dots([[122, 76], [46, 100]], 9) }, 'blue'),
    s('path', { d: dots([[40, 76]], 6) + dots([[96, 76]], 7) }, 'yellow'),
    s('path', { d: 'M138 136l-30-30', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 98l10 10-6 4-8-8z' }, 'dark')
  ],
  palomita: [
    backdrop('sky'),
    s('path', { d: 'M42 64h76l-10 76H52z' }, 'red', { accent: true }),
    s('path', { d: 'M62 64l4 76h10l-2-76zM88 64l-2 76h10l4-76z' }, 'white'),
    s('path', { d: dots([[48, 58], [62, 50], [78, 54], [94, 48], [110, 58], [70, 38], [88, 34], [104, 42], [56, 42]], 10) }, 'cream'),
    s('path', { d: dots([[62, 50], [94, 48], [70, 38], [104, 42]], 4) }, 'yellow')
  ],
  patriarcal: [
    ground(),
    s('circle', { cx: 80, cy: 38, r: 16 }, 'skin'),
    s('rect', { x: 58, y: 58, width: 44, height: 78, rx: 14 }, 'navy', { accent: true }),
    s('path', { d: 'M80 60l-5 8 5 26 5-26z' }, 'red'),
    s('path', { d: 'M64 30q16-14 32 0', ...SW(5) }, 'gray', { stroke: true }),
    ...person(30, 136, 'pink', { h: 30, w: 22, r: 9 }),
    ...person(130, 136, 'green', { h: 26, w: 20, r: 8 })
  ],
  'patriótico': [
    s('path', { d: 'M40 140V22', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 40, cy: 20, r: 6 }, 'yellow'),
    s('path', { d: 'M44 28q24-10 50 0t50 0v60q-24 10-50 0t-50 0z' }, 'blue'),
    s('path', { d: heart(94, 52, 20) }, 'red', { accent: true }),
    s('path', { d: 'M44 46q24-10 50 0M94 46q24 10 50 0', ...SW(2) }, 'sky', { stroke: true })
  ],
  peluche: [
    s('path', { d: dots([[54, 44], [106, 44]], 14) }, 'brown'),
    s('path', { d: ells([[56, 130, 16, 10], [104, 130, 16, 10], [36, 100, 10, 18], [124, 100, 10, 18]]) }, 'brown'),
    s('ellipse', { cx: 80, cy: 106, rx: 34, ry: 30 }, 'brown'),
    s('circle', { cx: 80, cy: 62, r: 30 }, 'brown', { accent: true }),
    s('path', { d: ells([[80, 74, 13, 10], [80, 108, 18, 18]]) + dots([[54, 44], [106, 44]], 7) }, 'tan'),
    s('path', { d: dots([[68, 56], [92, 56], [80, 70]], 4) }, 'dark'),
    s('path', { d: 'M70 96l10 6 10-6', ...SW(3) }, 'red', { stroke: true })
  ],
  penetrar: [
    s('rect', { x: 62, y: 24, width: 22, height: 116, rx: 3 }, 'tan'),
    s('path', { d: 'M73 70l-8-14M73 86l10 14M64 78l18 2', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M18 78h120', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M148 78l-16-10v20z' }, 'gray', { accent: true }),
    s('path', { d: 'M18 78l-6-10h12zM18 78l-6 10h12z' }, 'red'),
    s('path', { d: 'M104 66l10-6M104 90l10 6', ...SW(3) }, 'orange', { stroke: true })
  ],
  pensador: [
    s('path', { d: 'M28 140v-28h104v28z' }, 'dark'),
    s('path', { d: 'M60 112l-4-40q2-12 14-12l22 10 2 42z' }, 'gray', { accent: true }),
    s('path', { d: 'M92 112l20 0v28', ...SW(12) }, 'gray', { stroke: true }),
    s('circle', { cx: 92, cy: 48, r: 14 }, 'gray'),
    s('path', { d: 'M74 76l26 14l-2-26', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: dots([[116, 30], [126, 20]], 4) + dots([[136, 10]], 2), }, 'sky')
  ],
  persistir: [
    s('rect', { x: 14, y: 104, width: 132, height: 36, rx: 4 }, 'gray'),
    s('path', { d: 'M74 104l8 10-6 10 8 16', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 108q-4-30 2-60', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 80, 200, 30, 10) + leaflet(80, 66, -30, 30, 10) }, 'green', { accent: true }),
    s('path', { d: dots([[83, 44]], 8) }, 'yellow'),
    s('path', { d: 'M110 40l14-6M112 54h16', ...SW(3) }, 'orange', { stroke: true })
  ],
  'polarización': [
    s('path', { d: busts([26, 46, 36], 136, 20, 30) }, 'red', { accent: true }),
    s('path', { d: dots([[26, 92], [46, 92], [36, 70]], 9) }, 'skin'),
    s('path', { d: busts([114, 134, 124], 136, 20, 30) }, 'blue'),
    s('path', { d: dots([[114, 92], [134, 92], [124, 70]], 9) }, 'skin'),
    s('path', { d: 'M80 20l-8 24 12 22-10 24 8 24-6 24', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 40l-12 0 6-6M94 40h12l-6-6', ...SW(4) }, 'orange', { stroke: true })
  ],
  porvenir: [
    s('rect', { x: 14, y: 20, width: 132, height: 70, rx: 6 }, 'cream'),
    s('path', { d: 'M48 90a32 32 0 0 1 64 0z' }, 'yellow', { accent: true }),
    s('path', { d: halfRays(80, 90, 40, 54, 7), ...SW(4) }, 'orange', { stroke: true }),
    s('rect', { x: 14, y: 90, width: 132, height: 50, rx: 4 }, 'green'),
    s('path', { d: 'M74 90h12l40 50H34z' }, 'gray'),
    s('path', { d: 'M80 96v8M80 112v10M80 130v8', ...SW(3) }, 'white', { stroke: true })
  ],
  principado: [
    s('path', { d: 'M14 140q66-36 132 0z' }, 'green'),
    s('path', { d: 'M38 126V70h16v-8h8v8h12v-8h12v8h12v-8h8v8h16v56z' }, 'tan'),
    s('path', { d: 'M62 126V96a18 18 0 0 1 36 0v30z' }, 'brown'),
    s('path', { d: 'M56 52l-4-22 14 12 14-18 14 18 14-12-4 22z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[66, 40], [80, 32], [94, 40]], 3) }, 'red'),
    s('path', { d: rects([[42, 80, 8, 12], [110, 80, 8, 12]]) }, 'dark')
  ],
  pum: [
    s('path', { d: burst(92, 78, 54, 30, 12) }, 'yellow', { accent: true }),
    s('path', { d: burst(92, 78, 30, 18, 10) }, 'orange'),
    s('rect', { x: 14, y: 64, width: 30, height: 30, rx: 4 }, 'gray'),
    s('path', { d: 'M40 58h28a18 18 0 0 1 0 40H40z' }, 'red'),
    s('path', { d: 'M56 78h16', ...SW(3) }, 'dark', { stroke: true })
  ],
  recortar: [
    s('rect', { x: 20, y: 40, width: 100, height: 96, rx: 3 }, 'yellow'),
    s('path', { d: 'M20 88h100', ...DASH(3, '8 6') }, 'dark', { stroke: true }),
    s('path', { d: 'M88 88l34-18M88 88l34 18', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: ring(128, 66, 8) + ring(128, 110, 8), ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M20 88q-6 6 0 12', ...SW(2) }, 'gray', { stroke: true })
  ],
  'sándwich': [
    s('path', { d: 'M24 108L80 40l56 68z' }, 'tan'),
    s('path', { d: 'M24 108h112l-4 8H28z' }, 'yellow'),
    s('path', { d: 'M24 116q8 8 16 0t16 0 16 0 16 0 16 0 16 0 16 0v6H24z' }, 'green', { accent: true }),
    s('path', { d: 'M28 122h104v6H28z' }, 'red'),
    s('path', { d: 'M24 128h112l-4 10H28z' }, 'tan'),
    s('path', { d: 'M30 106L80 46l50 60', ...SW(3) }, 'brown', { stroke: true })
  ],
  sensato: [
    s('path', { d: 'M20 132h120', ...SW(8) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 80, cy: 86, rx: 38, ry: 44 }, 'brown', { accent: true }),
    s('ellipse', { cx: 80, cy: 100, rx: 24, ry: 28 }, 'cream'),
    s('path', { d: 'M44 48l6-18 14 12zM116 48l-6-18-14 12z' }, 'brown'),
    s('path', { d: dots([[64, 66], [96, 66]], 13) }, 'white'),
    s('path', { d: dots([[64, 66], [96, 66]], 6) }, 'dark'),
    s('path', { d: 'M74 80l6 10 6-10z' }, 'orange'),
    s('path', { d: 'M66 128v6M94 128v6', ...SW(4) }, 'orange', { stroke: true })
  ],
  'sermón': [
    s('circle', { cx: 80, cy: 38, r: 14 }, 'skin'),
    s('rect', { x: 62, y: 54, width: 36, height: 44, rx: 12 }, 'black'),
    s('rect', { x: 74, y: 54, width: 12, height: 6 }, 'white'),
    s('path', { d: 'M44 82h72l-10 54H54z' }, 'brown', { accent: true }),
    s('rect', { x: 40, y: 76, width: 80, height: 10, rx: 3 }, 'tan'),
    s('path', { d: 'M108 30q8 8 0 16M118 24q14 14 0 28M52 30q-8 8 0 16M42 24q-14 14 0 28', ...SW(3) }, 'orange', { stroke: true })
  ],
  'simultáneo': [
    s('circle', { cx: 46, cy: 76, r: 30 }, 'white'),
    outline({ cx: 46, cy: 76, r: 30 }, 'blue', 6),
    s('circle', { cx: 114, cy: 76, r: 30 }, 'white'),
    outline({ cx: 114, cy: 76, r: 30 }, 'orange', 6),
    s('path', { d: 'M46 76V58M46 76h12M114 76V58M114 76h12', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M34 124h92M34 136h92', ...SW(5) }, 'green', { stroke: true, accent: true })
  ],
  subjetivo: [
    s('path', { d: 'M28 140v-14a26 26 0 0 1 52 0v14z' }, 'blue'),
    s('circle', { cx: 54, cy: 88, r: 22 }, 'skin'),
    s('path', { d: ells([[46, 86, 9, 7], [64, 86, 9, 7]]) }, 'pink', { accent: true }),
    s('path', { d: 'M32 84h6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: ells([[112, 46, 30, 22], [88, 62, 12, 10]]) + ells([[74, 72, 5, 4]]) }, 'pink'),
    s('path', { d: heart(112, 44, 12) }, 'red')
  ],
  'suposición': [
    s('path', { d: 'M24 140v-16a24 24 0 0 1 48 0v16z' }, 'green'),
    s('circle', { cx: 48, cy: 86, r: 18 }, 'skin'),
    s('path', { d: ring(110, 50, 32), ...DASH(4, '6 6') }, 'purple', { stroke: true }),
    s('path', { d: dots([[72, 70], [64, 62]], 4) }, 'purple'),
    s('rect', { x: 94, y: 34, width: 32, height: 32, rx: 6 }, 'white', { accent: true }),
    s('path', { d: dots([[102, 42], [110, 50], [118, 58]], 4) }, 'red'),
    outline({ x: 94, y: 34, width: 32, height: 32, rx: 6 })
  ],
  'tubería': [
    s('path', { d: 'M14 46h58a14 14 0 0 1 14 14v40a14 14 0 0 0 14 14h46', ...SW(16, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('path', { d: rects([[30, 36, 8, 20], [70, 74, 20, 8], [116, 104, 8, 20]]) }, 'dark'),
    s('circle', { cx: 80, cy: 40, r: 12, ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M80 28v24M68 40h24', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M80 52v8', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: drop(138, 136, 5) }, 'blue')
  ],
  turbo: [
    s('path', { d: 'M24 46h40v26', ...SW(18, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('circle', { cx: 86, cy: 92, r: 44 }, 'gray'),
    s('circle', { cx: 86, cy: 92, r: 30 }, 'dark'),
    s('path', { d: [0, 60, 120, 180, 240, 300].map(a => { const r = a * Math.PI / 180, c = Math.cos(r), n = Math.sin(r); return `M86 92q${(26 * c - 10 * n).toFixed(1)} ${(26 * n + 10 * c).toFixed(1)} ${(26 * c).toFixed(1)} ${(26 * n).toFixed(1)}`; }).join(''), ...SW(5) }, 'sky', { stroke: true, accent: true }),
    s('circle', { cx: 86, cy: 92, r: 7 }, 'orange'),
    s('path', { d: 'M14 120h16M18 134h22M138 30h10M132 44h14', ...SW(4) }, 'orange', { stroke: true })
  ],
  uf: [
    s('circle', { cx: 66, cy: 86, r: 46 }, 'yellow', { accent: true }),
    s('path', { d: 'M40 80q8 6 16 0M76 80q8 6 16 0', ...SW(4) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 82, cy: 108, rx: 7, ry: 6 }, 'dark'),
    s('path', { d: 'M96 106q20-6 30 4q10 10 22 2M100 118q16 4 26 0', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: drop(106, 50, 6) }, 'blue')
  ],
  'zócalo': [
    backdrop('sky', 14, 100),
    s('rect', { x: 14, y: 106, width: 132, height: 34, rx: 4 }, 'tan'),
    s('path', { d: 'M56 106V90h48v16zM64 90V80h32v10z' }, 'gray', { accent: true }),
    s('circle', { cx: 80, cy: 50, r: 10 }, 'gray'),
    s('rect', { x: 70, y: 60, width: 20, height: 20, rx: 6 }, 'gray'),
    s('path', { d: 'M28 106V70M132 106V70', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: dots([[28, 64], [132, 64]], 14) }, 'green'),
    s('path', { d: 'M20 124h120', ...SW(2, { 'stroke-dasharray': '10 6' }) }, 'brown', { stroke: true })
  ],
  abdominal: [
    s('rect', { x: 14, y: 126, width: 132, height: 10, rx: 5 }, 'blue'),
    s('path', { d: 'M60 120l36-24 18 30', ...SW(12) }, 'navy', { stroke: true }),
    s('rect', { x: 34, y: 82, width: 26, height: 44, rx: 10, transform: 'rotate(-40 47 126)' }, 'red', { accent: true }),
    s('circle', { cx: 74, cy: 74, r: 12 }, 'skin'),
    s('path', { d: 'M68 90q10-10 14-22', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: drop(92, 58, 4) }, 'sky')
  ],
  amargura: [
    s('circle', { cx: 60, cy: 70, r: 40 }, 'yellow'),
    s('path', { d: 'M38 64q6-4 12 0M70 64q6-4 12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 92q16-14 32 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M90 96h44l-6 40h-32z' }, 'white'),
    outline({ x: 90, y: 96, width: 44, height: 4 }),
    s('path', { d: 'M93 102h38l-4 30h-30z' }, 'dark', { accent: true }),
    s('path', { d: 'M104 90q-6-8 0-14M118 90q-6-8 0-14', ...SW(3) }, 'green', { stroke: true })
  ],
  'artesanía': [
    s('path', { d: 'M60 30h40v10q26 14 26 46t-26 48H60q-26-16-26-48t26-46z' }, 'orange', { accent: true }),
    s('path', { d: 'M38 74h84M36 98h88', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M44 86l8-8 8 8 8-8 8 8 8-8 8 8 8-8 8 8 8-8', ...SW(3) }, 'cream', { stroke: true }),
    s('rect', { x: 56, y: 26, width: 48, height: 8, rx: 4 }, 'brown'),
    s('path', { d: 'M134 140l-20-30', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M114 110l-6-12 10 6z' }, 'red')
  ],
  'ataúd': [
    s('path', { d: 'M62 18h36l14 30-10 94H58L48 48z' }, 'brown', { accent: true }),
    s('path', { d: 'M66 26h28l10 24-8 84H64l-8-84z' }, 'tan'),
    s('path', { d: 'M80 52v40M68 64h24', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: dots([[72, 108], [88, 108], [80, 100]], 7) }, 'pink'),
    s('path', { d: dots([[80, 108]], 4) }, 'yellow')
  ],
  aval: [
    ...paper(34, 18, 82, 112),
    s('path', { d: 'M46 40h58M46 54h58M46 68h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 102q8-10 14 0t14 0 12-4', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: burst(110, 112, 22, 18, 14) }, 'red', { accent: true }),
    s('circle', { cx: 110, cy: 112, r: 12 }, 'yellow'),
    s('path', { d: 'M100 132l-4 14 14-8 14 8-4-14', }, 'red')
  ],
  bata: [
    backdrop('mint'),
    s('path', { d: 'M80 20q-8 0-8 8M80 20q8 0 8 8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M46 30h68l18 40-14 6v62H42V76l-14-6z' }, 'white', { accent: true }),
    s('path', { d: 'M46 30h68l18 40-14 6v62H42V76l-14-6zM66 30l14 40 14-40M80 70v68', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: rects([[50, 98, 18, 3], [92, 98, 18, 3]]) }, 'gray'),
    s('path', { d: 'M98 82v10', ...SW(4) }, 'blue', { stroke: true })
  ],
  beneficioso: [
    s('circle', { cx: 120, cy: 38, r: 16 }, 'yellow'),
    s('path', { d: rays(120, 38, 20, 28, 8), ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M54 108h52l-6 32H60z' }, 'orange'),
    s('path', { d: 'M80 108V50', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 90, 200, 34, 12) + leaflet(80, 76, -20, 34, 12) + leaflet(80, 56, 230, 26, 10) }, 'green', { accent: true }),
    s('path', { d: drop(36, 50, 5) + drop(28, 72, 4) }, 'blue'),
    s('path', { d: 'M110 70l6-6 6 6M116 64v16', ...SW(3) }, 'green', { stroke: true })
  ],
  catarata: [
    s('rect', { x: 14, y: 22, width: 132, height: 26, rx: 4 }, 'brown'),
    s('path', { d: 'M14 48h40v84H14zM106 48h40v84h-40z' }, 'brown'),
    s('rect', { x: 54, y: 30, width: 52, height: 104 }, 'blue', { accent: true }),
    s('path', { d: 'M64 44v70M80 50v76M96 40v70', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: ells([[56, 134, 16, 8], [80, 132, 18, 10], [104, 134, 16, 8]]) }, 'white'),
    s('path', { d: ells([[30, 22, 14, 8], [124, 22, 16, 8]]) }, 'green')
  ],
  'colisión': [
    ground(140),
    ...car(14, 102, 'blue'),
    ...car(94, 102, 'red').map(sh => ({ ...sh, attrs: { ...sh.attrs, transform: 'translate(240 0) scale(-1 1)' } })),
    s('path', { d: burst(80, 98, 26, 12, 9) }, 'yellow', { accent: true }),
    s('path', { d: 'M80 52v-12M58 60l-8-8M102 60l8-8', ...SW(4) }, 'orange', { stroke: true })
  ],
  comodoro: [
    s('path', { d: 'M38 140v-26a42 30 0 0 1 84 0v26z' }, 'navy'),
    s('path', { d: 'M70 84h20l-10 26z' }, 'white'),
    s('circle', { cx: 80, cy: 66, r: 22 }, 'skin'),
    s('path', { d: 'M50 48q30-26 60 0v6H50z' }, 'white'),
    outline({ x: 50, y: 48, width: 60, height: 6 }, 'gray', 2),
    s('rect', { x: 52, y: 52, width: 56, height: 6, rx: 2 }, 'black'),
    s('path', { d: 'M80 32l4 8h8l-6 5 2 8-8-5-8 5 2-8-6-5h8z' }, 'yellow', { accent: true }),
    s('path', { d: 'M48 120h20M48 128h20M92 120h20M92 128h20', ...SW(3) }, 'yellow', { stroke: true })
  ],
  'condón': [
    s('path', { d: 'M28 28h104v104H28z' }, 'blue', { accent: true }),
    s('path', { d: 'M28 28h104v104H28z', ...SW(4, { 'stroke-dasharray': '4 4' }) }, 'navy', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 30 }, 'sky'),
    s('circle', { cx: 80, cy: 80, r: 22 }, 'blue'),
    s('path', { d: 'M74 70q6-4 12 0', ...SW(3) }, 'white', { stroke: true })
  ],
  culminar: [
    backdrop('sky'),
    s('path', { d: 'M14 146L80 40l66 106z' }, 'gray'),
    s('path', { d: 'M62 69L80 40l18 29-9 6-9-8-9 8z' }, 'white'),
    s('path', { d: 'M80 42V16', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 16h22l-6 6 6 6H82z' }, 'red', { accent: true }),
    s('path', { d: sparkle(42, 40, 10) + sparkle(124, 56, 8) }, 'yellow')
  ],
  demandante: [
    ground(),
    s('rect', { x: 94, y: 100, width: 52, height: 36 }, 'brown'),
    s('path', { d: 'M114 62l24 24', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 96, y: 50, width: 34, height: 18, rx: 4, transform: 'rotate(45 113 59)' }, 'dark', { accent: true }),
    ...person(44, 136, 'purple'),
    s('path', { d: 'M58 100l18-26', ...SW(6) }, 'purple', { stroke: true }),
    ...paper(68, 46, 20, 26)
  ],
  demencia: [
    s('path', { d: 'M40 140v-22q-20-10-20-40q0-36 40-40q38 0 40 34l10 18-10 4v12q0 10-14 10h-8v24z' }, 'skin'),
    s('path', { d: 'M38 70q-2-22 22-24q22 0 22 20q0 14-14 18H50q-12-2-12-14z' }, 'pink'),
    s('path', { d: 'M104 40h14v-6a5 5 0 0 1 10 0v6h12v26h-26z' }, 'purple', { accent: true }),
    s('path', { d: 'M118 86h12v-5a5 5 0 0 1 10 0v5h6v20h-28z' }, 'purple'),
    s('path', { d: 'M84 58h12M90 74h10', ...DASH(3, '3 5') }, 'gray', { stroke: true })
  ],
  depositar: [
    s('rect', { x: 30, y: 62, width: 100, height: 78, rx: 8 }, 'gray'),
    s('rect', { x: 40, y: 72, width: 80, height: 58, rx: 4 }, 'dark'),
    s('circle', { cx: 100, cy: 102, r: 10, ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 58, y: 56, width: 44, height: 8, rx: 3 }, 'black'),
    s('circle', { cx: 80, cy: 34, r: 16 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 34, r: 9 }, 'orange'),
    s('path', { d: 'M54 24v20l-6-6M54 44l6-6M106 24v20l-6-6M106 44l6-6', ...SW(3) }, 'orange', { stroke: true })
  ],
  desempleado: [
    ground(),
    s('path', { d: ells([[54, 34, 18, 12], [72, 28, 18, 13], [90, 34, 16, 11]]) }, 'gray'),
    s('path', { d: 'M56 52l-4 10M74 50l-4 10M92 50l-4 10', ...SW(2) }, 'sky', { stroke: true }),
    ...person(52, 136, 'blue'),
    s('rect', { x: 70, y: 96, width: 42, height: 30, rx: 2 }, 'tan', { accent: true }),
    s('path', { d: 'M100 96V82M94 84l6 6 8-10', ...SW(3) }, 'green', { stroke: true }),
    s('rect', { x: 76, y: 84, width: 14, height: 12 }, 'orange')
  ],
  diligencia: [
    ground(),
    ...lean(52, 136, 14, 'green'),
    s('path', { d: 'M36 112h-14M34 124h-16', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 72, y: 90, width: 30, height: 36, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M72 100h30', ...SW(2) }, 'orange', { stroke: true }),
    s('rect', { x: 108, y: 40, width: 38, height: 96, rx: 3 }, 'tan'),
    s('rect', { x: 114, y: 60, width: 26, height: 22 }, 'sky'),
    s('circle', { cx: 127, cy: 108, r: 9 }, 'red')
  ],
  discrepancia: [
    s('path', { d: bubble(14, 22, 62, 52) }, 'blue'),
    s('path', { d: 'M146 84h-54a8 8 0 0 0-8 8v34a8 8 0 0 0 8 8h32l12 12v-12h10a8 8 0 0 0 8-8V92a8 8 0 0 0-8-8z' }, 'orange'),
    s('circle', { cx: 45, cy: 46, r: 13 }, 'white'),
    s('path', { d: 'M115 94l14 26h-28z' }, 'white'),
    s('path', { d: 'M86 28l-8 12 10 6-8 12', ...SW(5) }, 'red', { stroke: true, accent: true })
  ],
  dual: [
    s('path', { d: 'M80 24a56 56 0 0 0 0 112z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 24a56 56 0 0 1 0 112z' }, 'orange'),
    s('circle', { cx: 56, cy: 80, r: 14 }, 'orange'),
    s('circle', { cx: 104, cy: 80, r: 14 }, 'blue'),
    s('path', { d: ring(80, 80, 56), ...SW(4) }, 'dark', { stroke: true })
  ],
  enigma: [
    s('rect', { x: 24, y: 24, width: 112, height: 112, rx: 8 }, 'cream'),
    s('path', { d: 'M24 24h112v112H24zM44 24v40M24 84h40v32M64 44h52M84 44v72M104 64v72M64 116h20M116 84h20M44 64h20', ...SW(6, { 'stroke-linecap': 'square' }) }, 'navy', { stroke: true }),
    s('path', { d: 'M36 136v-10M124 24v10', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'cream', { stroke: true }),
    s('circle', { cx: 94, cy: 94, r: 6 }, 'red', { accent: true })
  ],
  'entraña': [
    s('path', { d: 'M18 78h124M18 96h124M18 114h124', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 14, y: 64, width: 132, height: 66, rx: 6, ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 92q10-24 50-20t50 10q4 16-20 22t-56 4q-28-2-24-16z' }, 'red', { accent: true }),
    s('path', { d: 'M48 86l10 14M68 82l10 16M90 82l10 16M110 84l8 12', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M54 50q-6-10 0-20M80 46q-6-10 0-20M106 50q-6-10 0-20', ...SW(3) }, 'gray', { stroke: true })
  ],
  'escalón': [
    s('path', { d: 'M14 136V112h30V88h30V64h30V40h42v96z' }, 'tan'),
    s('path', { d: 'M74 64h30v24H74z' }, 'orange', { accent: true }),
    s('path', { d: 'M14 112h30M44 88h30M74 64h30M104 40h42', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: ells([[89, 56, 10, 5]]) }, 'dark'),
    s('path', { d: 'M60 52l12-10M60 52l8 2M60 52l2-8', ...SW(3) }, 'green', { stroke: true })
  ],
  evacuar: [
    ground(),
    s('rect', { x: 92, y: 30, width: 54, height: 106 }, 'gray'),
    s('rect', { x: 104, y: 82, width: 30, height: 54 }, 'green', { accent: true }),
    s('path', { d: 'M108 46h22M108 46l8-6M108 46l8 6', ...SW(4) }, 'white', { stroke: true }),
    ...lean(74, 136, -16, 'orange', { h: 36, w: 22, r: 10 }),
    ...lean(36, 136, -16, 'blue', { h: 36, w: 22, r: 10 }),
    s('path', { d: 'M26 64H14M24 72H14', ...SW(3) }, 'gray', { stroke: true })
  ],
  filtrar: [
    s('path', { d: 'M34 30h92L94 82H66z' }, 'tan', { accent: true }),
    s('path', { d: 'M40 36h80', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: ells([[80, 34, 40, 4]]) }, 'brown'),
    s('path', { d: drop(80, 96, 4) + drop(80, 110, 3) }, 'brown'),
    s('path', { d: 'M54 116h52l-4 26H58z' }, 'white'),
    s('path', { d: 'M54 116h52l-4 26H58zM106 122a8 8 0 0 1 0 14', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 57, y: 118, width: 46, height: 6 }, 'brown')
  ],
  'finalización': [
    s('path', { d: 'M36 140V20', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 40, y: 24, width: 96, height: 64 }, 'white'),
    s('path', { d: checker(40, 24, 6, 4, 16) }, 'black', { accent: true }),
    s('path', { d: 'M40 24h96v64H40z', ...SW(2) }, 'dark', { stroke: true }),
    s('circle', { cx: 36, cy: 18, r: 5 }, 'yellow'),
    s('path', { d: 'M60 124h80', ...SW(6, { 'stroke-dasharray': '8 8', 'stroke-linecap': 'butt' }) }, 'red', { stroke: true })
  ],
  flotar: [
    backdrop('sky', 14, 60),
    s('rect', { x: 14, y: 82, width: 132, height: 62, rx: 6 }, 'blue'),
    s('rect', { x: 36, y: 70, width: 84, height: 24, rx: 12 }, 'red', { accent: true }),
    s('circle', { cx: 126, cy: 80, r: 12 }, 'skin'),
    s('path', { d: 'M54 72l-12-14M100 72l10-14', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M20 98q10-6 20 0t20 0 20 0 20 0 20 0 20 0', ...SW(3) }, 'sky', { stroke: true }),
    s('circle', { cx: 40, cy: 34, r: 10 }, 'yellow')
  ],
  gentil: [
    ground(),
    ...person(44, 136, 'orange'),
    s('circle', { cx: 116, cy: 78, r: 12 }, 'skin'),
    s('rect', { x: 101, y: 92, width: 30, height: 44, rx: 10 }, 'sky'),
    s('path', { d: 'M58 104l20-10', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M80 96V66', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: dots([[80, 56], [72, 62], [88, 62], [76, 70], [84, 70]], 5) }, 'pink', { accent: true }),
    s('path', { d: heart(80, 30, 8) }, 'red')
  ],
  gigantesco: [
    ground(),
    s('path', { d: 'M62 136V100M98 136V100', ...SW(16) }, 'navy', { stroke: true }),
    s('rect', { x: 50, y: 40, width: 60, height: 66, rx: 18 }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 26, r: 16 }, 'skin'),
    s('path', { d: 'M18 136v-14l10-8 10 8v14zM120 136v-16l12-10 12 10v16z' }, 'red'),
    s('path', { d: 'M36 136v-6M138 136v-6', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 46, cy: 128, r: 4 }, 'skin')
  ],
  guionista: [
    s('path', { d: 'M20 68h92v66H20z' }, 'dark'),
    s('path', { d: 'M18 46l90-22 4 18-90 22z' }, 'dark', { accent: true }),
    s('path', { d: 'M34 42l10 16M56 37l10 16M78 32l10 16', ...SW(6, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('path', { d: 'M30 84h72M30 100h56M30 116h64', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M142 46l-30 76', ...SW(8) }, 'blue', { stroke: true }),
    s('path', { d: 'M112 122l-4 12 10-8z' }, 'dark')
  ],
  'hindú': [
    s('path', { d: dots([[38, 128], [56, 136], [80, 138], [104, 136], [122, 128]], 4) }, 'pink'),
    s('path', { d: 'M28 92h104q-8 32-52 32t-52-32z' }, 'orange', { accent: true }),
    s('path', { d: 'M28 92h104', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M48 104l8 8 8-8 8 8 8-8 8 8 8-8 8 8 8-8', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M80 34q20 24 12 44q-4 10-12 10t-12-10q-8-20 12-44z' }, 'yellow'),
    s('path', { d: 'M80 58q8 12 4 20q-2 4-4 4t-4-4q-4-8 4-20z' }, 'red')
  ],
  'híbrido': [
    ground(),
    ...car(20, 92, 'green', 'sky', { accent: true }),
    s('path', { d: 'M80 102h20q14 0 14 14v8q0 12 14 12h14', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 76, y: 96, width: 8, height: 12, rx: 2 }, 'gray'),
    s('path', { d: leaflet(112, 52, -45, 34, 12) }, 'green'),
    s('path', { d: 'M54 30l-10 18h10l-6 16 16-22H54l6-12z' }, 'yellow')
  ],
  iluminar: [
    backdrop('navy'),
    s('path', { d: 'M62 60l84-32v108L62 104z' }, 'yellow', { accent: true }),
    s('rect', { x: 18, y: 66, width: 40, height: 32, rx: 6 }, 'gray'),
    s('path', { d: 'M56 58v48l10 6V52z' }, 'dark'),
    s('rect', { x: 32, y: 60, width: 10, height: 6 }, 'red'),
    s('circle', { cx: 112, cy: 82, r: 12 }, 'orange')
  ],
  indefinido: [
    s('path', { d: 'M80 80c-16-20-46-26-50 0s34 20 50 0 46-26 50 0-34 20-50 0z', ...SW(10) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M18 128h124', ...DASH(5, '10 10') }, 'gray', { stroke: true }),
    s('path', { d: 'M18 32h124', ...DASH(5, '10 10') }, 'gray', { stroke: true }),
  ],
  insomnio: [
    backdrop('navy'),
    s('rect', { x: 18, y: 104, width: 124, height: 20, rx: 4 }, 'brown'),
    s('path', { d: 'M20 124v16M140 124v16M140 104V84', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 50, y: 88, width: 88, height: 18, rx: 6 }, 'sky', { accent: true }),
    s('circle', { cx: 36, cy: 92, r: 13 }, 'skin'),
    s('path', { d: ells([[31, 90, 3, 4], [41, 90, 3, 4]]) }, 'white'),
    s('path', { d: 'M118 22a18 18 0 1 0 14 30a14 14 0 0 1-14-30z' }, 'yellow'),
    s('path', { d: sparkle(60, 40, 6) + sparkle(84, 56, 5) }, 'white')
  ],
  insular: [
    s('rect', { x: 14, y: 96, width: 132, height: 48, rx: 8 }, 'blue'),
    s('path', { d: 'M36 112q44-34 88 0z' }, 'tan'),
    s('path', { d: 'M82 102q4-30-6-56', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(76, 46, 200, 34, 9) + leaflet(76, 46, -20, 36, 9) + leaflet(76, 46, 240, 28, 8) + leaflet(76, 46, 30, 30, 8) }, 'green', { accent: true }),
    s('path', { d: 'M24 124q8-6 16 0M110 128q8-6 16 0', ...SW(3) }, 'sky', { stroke: true }),
    s('circle', { cx: 126, cy: 36, r: 12 }, 'yellow')
  ],
  'inédito': [
    s('rect', { x: 36, y: 34, width: 80, height: 100, rx: 4 }, 'purple'),
    s('rect', { x: 46, y: 34, width: 70, height: 92, rx: 2 }, 'cream'),
    s('path', { d: 'M56 54h48M56 68h48M56 82h34', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 106v-8a10 10 0 0 1 20 0v8', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 68, y: 104, width: 32, height: 24, rx: 4 }, 'yellow', { accent: true }),
    s('path', { d: sparkle(130, 34, 12) + sparkle(28, 120, 8) }, 'orange')
  ],
  localmente: [
    s('circle', { cx: 80, cy: 84, r: 60 }, 'mint'),
    s('path', { d: ring(80, 84, 60), ...DASH(4, '8 6') }, 'green', { stroke: true }),
    s('path', { d: 'M62 104V82l18-16 18 16v22z' }, 'orange', { accent: true }),
    s('path', { d: 'M56 84l24-22 24 22', ...SW(5) }, 'red', { stroke: true }),
    s('rect', { x: 75, y: 90, width: 10, height: 14 }, 'brown'),
    s('path', { d: 'M38 104V88M122 104V88', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: dots([[38, 82], [122, 82]], 9) + 'M40 120h80v6H40z' }, 'green')
  ],
  magisterio: [
    s('rect', { x: 50, y: 24, width: 96, height: 66, rx: 4 }, 'green'),
    s('rect', { x: 50, y: 24, width: 96, height: 66, rx: 4, ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: ring(76, 56, 12) + 'M100 68l14-24 14 24z', ...SW(3) }, 'white', { stroke: true }),
    ...person(30, 136, 'purple', { accent: true }),
    s('path', { d: 'M42 98l28-26', ...SW(4) }, 'brown', { stroke: true }),
    ground()
  ],
  magistral: [
    s('path', { d: laurel(80, 74, 50) }, 'green'),
    s('circle', { cx: 80, cy: 74, r: 34 }, 'yellow', { accent: true }),
    s('path', { d: star(80, 74, 22) }, 'orange'),
    s('path', { d: 'M62 106l-10 34 14-8 8 12 6-30M98 106l10 34-14-8-8 12-6-30' }, 'red')
  ],
  mitin: [
    s('rect', { x: 48, y: 64, width: 64, height: 24 }, 'red'),
    s('rect', { x: 60, y: 30, width: 40, height: 36, rx: 12 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 20, r: 10 }, 'skin'),
    s('path', { d: 'M94 50l14-10M110 30q10 10 0 20M120 24q16 16 0 32', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: busts([24, 52, 80, 108, 136], 140, 22, 30) }, 'gray'),
    s('path', { d: dots([[24, 104], [52, 104], [80, 104], [108, 104], [136, 104]], 10) }, 'skin'),
    s('path', { d: 'M38 104l-4-16M122 104l4-16', ...SW(5) }, 'skin', { stroke: true })
  ],
  molecular: [
    s('path', { d: 'M80 80L42 46M80 80l40-30M80 80l-30 50M80 80l44 40', ...SW(7) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 22 }, 'red', { accent: true }),
    s('path', { d: dots([[42, 46], [120, 50]], 14) }, 'blue'),
    s('path', { d: dots([[50, 130], [124, 120]], 12) }, 'white'),
    s('path', { d: ring(50, 130, 12) + ring(124, 120, 12), ...SW(3) }, 'gray', { stroke: true })
  ],
  mostaza: [
    s('path', { d: 'M72 14h16l-2 20h-12z' }, 'red'),
    s('path', { d: 'M66 34h28v10H66z' }, 'red'),
    s('path', { d: 'M58 44h44q8 0 8 10v76q0 10-10 10H60q-10 0-10-10V54q0-10 8-10z' }, 'yellow', { accent: true }),
    s('path', { d: 'M62 74h36v40H62z' }, 'white'),
    s('path', { d: 'M70 96q6-14 10 0t10 0', ...SW(4) }, 'green', { stroke: true })
  ],
  oleada: [
    s('path', { d: 'M14 140V96q20-70 80-70q40 0 50 30q-30-16-50 6q-14 20 8 34h44v44z' }, 'blue', { accent: true }),
    s('path', { d: 'M30 92q18-50 70-56', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: 'M94 62q-14 20 8 34', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: dots([[138, 70], [130, 82], [144, 88]], 4) }, 'sky'),
    s('path', { d: 'M20 124q14-8 28 0t28 0 28 0 28 0', ...SW(4) }, 'sky', { stroke: true })
  ],
  ombligo: [
    s('path', { d: 'M34 18h92q6 60 0 124H34q-6-64 0-124z' }, 'skin'),
    s('path', { d: 'M34 116h92v26H34z' }, 'blue'),
    s('ellipse', { cx: 80, cy: 82, rx: 6, ry: 8 }, 'tan', { accent: true }),
    s('path', { d: 'M77 80q3 6 6 0', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M60 40q20 10 40 0M80 50v18', ...SW(2) }, 'tan', { stroke: true })
  ],
  otero: [
    backdrop('sky'),
    s('path', { d: 'M14 146v-24h132v24z' }, 'mint'),
    s('path', { d: 'M30 124q50-90 100 0z' }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 66, r: 6 }, 'skin'),
    s('rect', { x: 75, y: 72, width: 10, height: 14, rx: 3 }, 'red'),
    s('path', { d: birds([[120, 36], [138, 48]]), ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 34, cy: 38, r: 10 }, 'yellow')
  ],
  peatonal: [
    s('rect', { x: 14, y: 92, width: 132, height: 52 }, 'dark'),
    s('path', { d: 'M24 98v40M44 98v40M64 98v40M84 98v40M104 98v40M124 98v40', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 26, r: 10 }, 'skin'),
    s('path', { d: 'M80 40v26l-12 22M80 66l12 22M80 46l-12 12M80 46l14 10', ...SW(8) }, 'green', { stroke: true, accent: true })
  ],
  pesimista: [
    s('path', { d: ells([[54, 30, 22, 14], [80, 24, 22, 16], [104, 30, 20, 13]]) }, 'gray'),
    s('path', { d: 'M50 52l-4 10M80 50l-4 10M106 52l-4 10', ...SW(3) }, 'sky', { stroke: true }),
    s('circle', { cx: 56, cy: 104, r: 30 }, 'yellow'),
    s('path', { d: dots([[46, 98], [66, 98]], 4) }, 'dark'),
    s('path', { d: 'M44 120q12-10 24 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M104 106h28l-2 22h-24z' }, 'sky', { accent: true }),
    s('path', { d: 'M100 76h36l-4 52h-28z', ...SW(3) }, 'gray', { stroke: true })
  ],
  pianista: [
    s('path', { d: 'M70 50h76v60H70z' }, 'black', { accent: true }),
    s('rect', { x: 66, y: 98, width: 80, height: 12 }, 'white'),
    s('path', { d: 'M76 98v8M86 98v8M100 98v8M110 98v8M124 98v8M134 98v8', ...SW(4, { 'stroke-linecap': 'butt' }) }, 'black', { stroke: true }),
    s('path', { d: 'M76 110v30M140 110v30', ...SW(6) }, 'black', { stroke: true }),
    s('circle', { cx: 34, cy: 58, r: 12 }, 'skin'),
    s('rect', { x: 20, y: 72, width: 28, height: 40, rx: 10 }, 'red'),
    s('path', { d: 'M40 86l28 14M30 112h20v26M14 112h60', ...SW(6) }, 'red', { stroke: true }),
    ...note(108, 34, 'purple')
  ],
  poblacional: [
    s('path', { d: busts([30, 62, 98, 130], 64, 24, 26) }, 'blue'),
    s('path', { d: busts([46, 80, 114], 102, 24, 26) }, 'orange', { accent: true }),
    s('path', { d: busts([30, 62, 98, 130], 140, 24, 26) }, 'green'),
    s('path', { d: dots([[30, 30], [62, 30], [98, 30], [130, 30], [46, 68], [80, 68], [114, 68], [30, 106], [62, 106], [98, 106], [130, 106]], 9) }, 'skin')
  ],
  'prescripción': [
    ...paper(26, 18, 78, 110),
    s('path', { d: 'M65 32v20M55 42h20', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M40 70h50M40 84h50M40 98h34', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 92, y: 98, width: 52, height: 22, rx: 11, transform: 'rotate(-35 118 109)' }, 'blue', { accent: true }),
    s('rect', { x: 92, y: 98, width: 26, height: 22, rx: 11, transform: 'rotate(-35 118 109)' }, 'white'),
  ],
  profesionalismo: [
    ground(),
    s('circle', { cx: 70, cy: 38, r: 16 }, 'skin'),
    s('path', { d: 'M44 136V80q0-22 26-22t26 22v56z' }, 'navy', { accent: true }),
    s('path', { d: 'M62 58l8 14 8-14z' }, 'white'),
    s('path', { d: 'M70 70l-5 8 5 28 5-28z' }, 'red'),
    s('rect', { x: 96, y: 104, width: 40, height: 30, rx: 4 }, 'brown'),
    s('path', { d: 'M108 104v-6h16v6', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: star(124, 40, 14) }, 'yellow')
  ],
  protagonizar: [
    s('rect', { x: 14, y: 14, width: 132, height: 126, rx: 6 }, 'navy'),
    s('path', { d: 'M60 14h40l26 112H34z' }, 'cream'),
    s('path', { d: 'M14 14h30q-6 60 8 126H14zM146 14h-30q6 60-8 126h38z' }, 'red', { accent: true }),
    s('ellipse', { cx: 80, cy: 128, rx: 46, ry: 8 }, 'yellow'),
    ...person(80, 128, 'purple', { h: 36, w: 26, r: 11 }),
    s('path', { d: star(80, 40, 12) }, 'yellow')
  ],
  'provocación': [
    ground(),
    s('path', { d: ells([[104, 112, 36, 24]]) + dots([[76, 92], [92, 84]], 9) }, 'brown', { accent: true }),
    s('circle', { cx: 78, cy: 110, r: 18 }, 'brown'),
    s('path', { d: 'M66 106h8M82 106h8', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 66, cy: 116, r: 4 }, 'dark'),
    ...person(26, 136, 'orange', { w: 24, h: 40, r: 10 }),
    s('path', { d: 'M36 100l24 8', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M118 72l6-10M130 78l10-6', ...SW(3) }, 'red', { stroke: true })
  ],
  radiante: [
    s('path', { d: rays(80, 80, 44, 64, 12), ...SW(7) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 38 }, 'yellow', { accent: true }),
    s('path', { d: 'M62 74q6-8 12 0M86 74q6-8 12 0M64 94q16 14 32 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[58, 88], [102, 88]], 5) }, 'pink'),
    s('path', { d: sparkle(138, 24, 8) + sparkle(22, 136, 8) }, 'yellow')
  ],
  recaer: [
    s('rect', { x: 66, y: 18, width: 22, height: 96, rx: 11 }, 'white'),
    s('rect', { x: 66, y: 18, width: 22, height: 96, rx: 11, ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 72, y: 50, width: 10, height: 70 }, 'red'),
    s('circle', { cx: 77, cy: 122, r: 18 }, 'red', { accent: true }),
    s('path', { d: 'M110 50a30 30 0 1 1-6 46', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M112 36l-2 18-16-6z' }, 'orange'),
    s('path', { d: 'M34 70l10 6M30 90h12', ...SW(3) }, 'orange', { stroke: true })
  ],
  repleto: [
    s('path', { d: 'M40 38h80v6q10 4 10 14v72q0 10-10 10H40q-10 0-10-10V58q0-10 10-14z' }, 'sky'),
    s('path', { d: dots([[50, 128], [70, 128], [90, 128], [110, 128], [60, 110], [80, 110], [100, 110], [50, 92], [70, 92], [90, 92], [110, 92], [60, 74], [80, 74], [100, 74]], 9) }, 'red', { accent: true }),
    s('path', { d: dots([[70, 128], [100, 110], [50, 92], [90, 92], [80, 74], [60, 56], [96, 54]], 9) }, 'yellow'),
    s('path', { d: dots([[110, 128], [60, 110], [110, 92], [100, 74], [78, 50]], 9) }, 'green'),
    s('rect', { x: 34, y: 20, width: 92, height: 14, rx: 4, transform: 'rotate(-12 80 27)' }, 'orange')
  ],
  reventar: [
    s('path', { d: burst(76, 70, 52, 28, 12) }, 'yellow'),
    s('path', { d: 'M54 48l20 10-6 20 22 6-10 18' }, 'red', { accent: true }),
    s('path', { d: 'M100 46l-10 14 16 6zM50 92l14-6 4 16z' }, 'red'),
    s('path', { d: 'M78 120q-4 10 4 24', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M22 30l10 8M130 30l-10 8M22 120l12-6M132 116l-12-4', ...SW(4) }, 'orange', { stroke: true })
  ],
  semejanza: [
    s('path', { d: 'M24 120q0-60 26-60t26 60q-26 14-52 0z' }, 'green', { accent: true }),
    s('path', { d: 'M84 120q0-60 26-60t26 60q-26 14-52 0z' }, 'green'),
    s('path', { d: 'M50 60v-16M110 60v-16', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(50, 48, -30, 18, 6) + leaflet(110, 48, -30, 18, 6) }, 'green'),
    s('path', { d: 'M62 140h36M70 132l-8 8 8 8M90 132l8 8-8 8', ...SW(4) }, 'orange', { stroke: true })
  ],
  'señorita': [
    ground(),
    ...lady(80, 136, 'pink', { accent: true }),
    s('path', { d: 'M68 70q12-30 24 0', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M56 98l-14 10M104 98l14 10', ...SW(5) }, 'skin', { stroke: true }),
    s('circle', { cx: 120, cy: 112, r: 6 }, 'purple')
  ],
  sor: [
    s('path', { d: 'M36 140V64q0-38 44-38t44 38v76z' }, 'black', { accent: true }),
    s('path', { d: 'M54 66q0-24 26-24t26 24' }, 'white'),
    s('circle', { cx: 80, cy: 70, r: 22 }, 'skin'),
    s('path', { d: 'M58 94h44l6 46H52z' }, 'white'),
    s('path', { d: dots([[72, 68], [88, 68]], 3) }, 'dark'),
    s('path', { d: 'M74 80q6 4 12 0M80 106v22M72 114h16', ...SW(3) }, 'brown', { stroke: true })
  ],
  susceptible: [
    s('circle', { cx: 74, cy: 82, r: 46 }, 'sky', { accent: true }),
    s('path', { d: 'M48 64q10-18 30-20', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M100 112a36 36 0 0 0 10-24', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M148 140l-26-26', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M126 98l-4 6M138 108l6-2M134 96l2-6', ...SW(3) }, 'orange', { stroke: true })
  ],
  topo: [
    s('path', { d: 'M14 140q66-40 132 0z' }, 'brown'),
    s('path', { d: 'M44 124V84q0-36 36-36t36 36v40z' }, 'gray', { accent: true }),
    s('rect', { x: 52, y: 70, width: 56, height: 14, rx: 7 }, 'black'),
    s('circle', { cx: 80, cy: 96, r: 8 }, 'pink'),
    s('path', { d: 'M56 112l-12 8M104 112l12 8', ...SW(5) }, 'pink', { stroke: true }),
    s('path', { d: dots([[30, 126], [130, 124], [120, 132]], 4) }, 'tan')
  ],
  tutorial: [
    s('rect', { x: 18, y: 26, width: 124, height: 84, rx: 8 }, 'dark'),
    s('rect', { x: 26, y: 34, width: 108, height: 62, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M70 50l26 15-26 15z' }, 'white'),
    s('rect', { x: 26, y: 100, width: 40, height: 4, rx: 2 }, 'red'),
    s('path', { d: 'M66 102h68', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 110l-6 22h32l-6-22z' }, 'gray'),
    s('rect', { x: 50, y: 130, width: 60, height: 8, rx: 4 }, 'dark')
  ],
  vaquero: [
    ground(),
    s('path', { d: 'M100 92a24 16 0 1 0 30 20', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M92 100l12-6', ...SW(4) }, 'tan', { stroke: true }),
    ...person(66, 136, 'blue'),
    s('path', { d: 'M38 68q28 6 56 0q-4 6-28 8t-28-8z' }, 'brown'),
    s('path', { d: 'M52 68q0-22 14-22t14 22z' }, 'brown', { accent: true }),
    s('path', { d: 'M54 96l12 14 12-14', ...SW(4) }, 'red', { stroke: true })
  ],
  vertiente: [
    backdrop('sky'),
    s('path', { d: 'M14 146V130L70 30l76 88v28z' }, 'green'),
    s('path', { d: 'M70 30l-12 22 10-4 6 8 8-12z' }, 'white'),
    s('path', { d: 'M76 56q-10 20 8 30q20 12 4 30q-10 12 20 30', ...SW(7) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M122 82l4 14-12-4M40 92l-4 14 12-4', ...SW(4) }, 'orange', { stroke: true })
  ],
  vicario: [
    s('rect', { x: 92, y: 40, width: 46, height: 96 }, 'cream'),
    s('path', { d: 'M88 44l27-26 27 26z' }, 'red'),
    s('path', { d: 'M115 54v22M107 62h16', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M104 136v-24a11 11 0 0 1 22 0v24z' }, 'brown'),
    ...person(52, 136, 'purple', { accent: true }),
    s('rect', { x: 46, y: 92, width: 12, height: 6 }, 'white'),
    s('rect', { x: 60, y: 102, width: 18, height: 22, rx: 2 }, 'dark'),
    ground()
  ],
  vid: [
    s('path', { d: 'M18 40q40-14 70 4t56-4', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M86 44q4 10-2 18', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(50, 36, 130, 30, 14) + leaflet(120, 42, 60, 28, 13) }, 'green'),
    s('path', { d: dots([[72, 72], [88, 72], [104, 72], [80, 88], [96, 88], [88, 104], [72, 96], [104, 96], [88, 120], [80, 112], [96, 112]], 9) }, 'purple', { accent: true }),
    s('path', { d: 'M30 60q-10 10 0 20', ...SW(3) }, 'green', { stroke: true })
  ],
  vinilo: [
    s('circle', { cx: 72, cy: 86, r: 58 }, 'black', { accent: true }),
    s('path', { d: ring(72, 86, 46) + ring(72, 86, 36) + ring(72, 86, 26), ...SW(2) }, 'dark', { stroke: true }),
    s('circle', { cx: 72, cy: 86, r: 16 }, 'red'),
    s('circle', { cx: 72, cy: 86, r: 3 }, 'white'),
    s('path', { d: 'M140 20v60l-30 30', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 140, cy: 20, r: 7 }, 'gray')
  ],
  virtualmente: [
    s('path', { d: 'M34 70q0-20 46-20t46 20', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 22, y: 60, width: 116, height: 50, rx: 14 }, 'dark', { accent: true }),
    s('rect', { x: 30, y: 68, width: 100, height: 34, rx: 10 }, 'blue'),
    s('path', { d: 'M40 76l16 8M104 84l16-8', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: sparkle(30, 34, 10) + sparkle(130, 132, 10) + sparkle(130, 34, 7) + sparkle(30, 132, 7) }, 'purple')
  ],
  visualizar: [
    s('path', { d: 'M18 50q30-30 60 0q-30 30-60 0z' }, 'white'),
    s('path', { d: 'M18 50q30-30 60 0q-30 30-60 0z', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 48, cy: 50, r: 11 }, 'blue', { accent: true }),
    s('path', { d: 'M62 66l20 22M50 70l8 22', ...DASH(3, '4 5') }, 'orange', { stroke: true }),
    s('rect', { x: 56, y: 82, width: 88, height: 62, rx: 4 }, 'sky'),
    s('path', { d: 'M56 144l30-40 18 22 14-14 26 32z' }, 'green'),
    s('circle', { cx: 124, cy: 98, r: 7 }, 'yellow'),
    s('rect', { x: 56, y: 82, width: 88, height: 62, rx: 4, ...SW(5) }, 'brown', { stroke: true })
  ],
  xenofobia: [
    ground(),
    s('path', { d: rects([[66, 46, 28, 14], [66, 74, 28, 14], [66, 102, 28, 14]]) }, 'red'),
    s('path', { d: rects([[66, 60, 28, 14], [66, 88, 28, 14], [66, 116, 28, 20]]) }, 'brown'),
    ...person(34, 136, 'green', { accent: true, w: 26, h: 40, r: 11 }),
    s('rect', { x: 46, y: 116, width: 14, height: 20, rx: 2 }, 'orange'),
    ...person(124, 136, 'blue', { w: 26, h: 40, r: 11 }),
    s('path', { d: 'M110 108l-10-8', ...SW(5) }, 'blue', { stroke: true })
  ],
  yacer: [
    backdrop('sky', 14, 100),
    s('rect', { x: 14, y: 110, width: 132, height: 34, rx: 4 }, 'green'),
    s('rect', { x: 46, y: 96, width: 66, height: 22, rx: 10 }, 'orange', { accent: true }),
    s('circle', { cx: 124, cy: 104, r: 12 }, 'skin'),
    s('path', { d: 'M118 100q3 3 6 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M46 104H28', ...SW(8) }, 'navy', { stroke: true }),
    s('path', { d: ells([[48, 36, 14, 8], [66, 32, 16, 10]]) }, 'white'),
    s('circle', { cx: 120, cy: 40, r: 12 }, 'yellow')
  ],
  zar: [
    s('path', { d: 'M40 108V72q0-36 40-46q40 10 40 46v36z' }, 'red', { accent: true }),
    s('path', { d: 'M80 26v82M58 40q-10 30-6 68M102 40q10 30 6 68', ...SW(4) }, 'yellow', { stroke: true }),
    s('rect', { x: 34, y: 104, width: 92, height: 22, rx: 10 }, 'cream'),
    s('path', { d: 'M80 8v18M72 16h16', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[52, 115], [80, 115], [108, 115]], 4) }, 'dark'),
    s('path', { d: dots([[80, 60], [62, 80], [98, 80]], 5) }, 'blue')
  ],
  'acreditación': [
    backdrop('sky'),
    s('path', { d: 'M54 14l26 50 26-50', ...SW(6) }, 'red', { stroke: true }),
    s('rect', { x: 44, y: 60, width: 72, height: 82, rx: 6 }, 'white', { accent: true }),
    s('rect', { x: 44, y: 60, width: 72, height: 82, rx: 6, ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 56, y: 74, width: 22, height: 26, rx: 2 }, 'blue'),
    s('path', { d: 'M86 80h20M86 92h16M56 114h48M56 126h36', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 72, y: 56, width: 16, height: 8, rx: 2 }, 'dark')
  ],
  alumbrado: [
    backdrop('navy'),
    s('path', { d: 'M40 136V48h18M110 136V48h18', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 54h20l-4-8H52zM118 54h20l-4-8h-12z' }, 'dark'),
    s('path', { d: 'M50 54l-14 70h58L70 54zM120 54l-14 70h40V96l-16-42z' }, 'yellow', { accent: true }),
    s('rect', { x: 14, y: 132, width: 132, height: 10 }, 'gray'),
    s('path', { d: sparkle(24, 30, 5) + sparkle(90, 24, 5) }, 'white')
  ],
  angular: [
    s('path', { d: 'M24 128h112M24 128L108 36', ...SW(8) }, 'navy', { stroke: true }),
    s('path', { d: 'M24 128h56a56 56 0 0 0-16-38z' }, 'orange', { accent: true }),
    s('path', { d: dots([[24, 128]], 8) }, 'red'),
    s('path', { d: 'M108 36l20 22', ...SW(4) }, 'gray', { stroke: true })
  ],
  apartar: [
    ground(),
    s('rect', { x: 24, y: 96, width: 40, height: 40, rx: 4 }, 'blue'),
    s('rect', { x: 98, y: 96, width: 40, height: 40, rx: 4 }, 'orange', { accent: true }),
    s('rect', { x: 62, y: 96, width: 36, height: 40, rx: 4, ...DASH(3, '5 5') }, 'gray', { stroke: true }),
    s('path', { d: 'M60 60q30-24 60 0M120 60l-12-2M120 60l-2-12', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M140 106h6M140 118h6', ...SW(3) }, 'gray', { stroke: true })
  ],
  azufre: [
    s('path', { d: 'M22 130l18-40 30-14 28 10 26-6 18 30-6 20z' }, 'orange'),
    s('path', { d: 'M40 120l14-34 20 8-6 30zM78 120l8-36 22 4 4 32z' }, 'yellow', { accent: true }),
    s('path', { d: 'M108 124l12-30 16 22-8 10z' }, 'yellow'),
    s('path', { d: 'M54 66q-8-10 0-20t0-20M80 60q-8-10 0-20t0-20M106 66q-8-10 0-20t0-20', ...SW(4) }, 'green', { stroke: true })
  ],
  birra: [
    s('path', { d: 'M104 66h12a16 16 0 0 1 16 16v20a16 16 0 0 1-16 16h-12', ...SW(8) }, 'gray', { stroke: true }),
    s('rect', { x: 36, y: 48, width: 70, height: 92, rx: 8 }, 'yellow', { accent: true }),
    s('path', { d: 'M54 66v58M72 66v58M90 66v58', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: ells([[48, 46, 16, 12], [72, 40, 18, 14], [96, 46, 16, 12]]) }, 'white'),
    s('path', { d: 'M32 46a16 12 0 0 1 32-6a18 14 0 0 1 34 0a16 12 0 0 1 14 12', ...SW(2) }, 'gray', { stroke: true })
  ],
  'captación': [
    s('path', { d: 'M30 36v36a28 28 0 0 0 56 0V36', ...SW(20, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M30 30v14M86 30v14', ...SW(20, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 52q8 8 0 16M110 44q14 16 0 32', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: busts([126, 108, 140], 140, 18, 24) }, 'blue'),
    s('path', { d: dots([[126, 106], [108, 106], [140, 106]], 7) }, 'skin'),
    s('path', { d: dots([[120, 72]], 9) }, 'yellow')
  ],
  carpintero: [
    s('path', { d: 'M30 140l12-40M130 140l-12-40M44 140l8-40M116 140l-8-40', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 14, y: 88, width: 132, height: 14, rx: 2 }, 'tan'),
    s('path', { d: 'M54 86l44-50 24 14-50 40z' }, 'gray', { accent: true }),
    s('path', { d: 'M56 86l4 4 4-4 4 4 4-4 4 4', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 98, y: 24, width: 34, height: 20, rx: 6, transform: 'rotate(30 115 34)' }, 'red'),
    s('path', { d: dots([[60, 110], [68, 116], [52, 118], [74, 106]], 3) }, 'tan')
  ],
  cesta: [
    s('path', { d: 'M40 76q0-56 40-56t40 56', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: dots([[60, 70], [100, 70]], 14) }, 'red'),
    s('path', { d: dots([[80, 64]], 14) }, 'yellow'),
    s('path', { d: 'M22 76h116l-14 60H36z' }, 'tan', { accent: true }),
    s('path', { d: 'M28 96h104M32 116h96M50 76l6 60M80 76v60M110 76l-6 60', ...SW(4) }, 'brown', { stroke: true })
  ],
  cilindro: [
    s('path', { d: 'M40 36v88a40 14 0 0 0 80 0V36z' }, 'blue', { accent: true }),
    s('path', { d: 'M40 36v88a40 14 0 0 0 80 0V36', ...SW(3) }, 'navy', { stroke: true }),
    s('ellipse', { cx: 80, cy: 36, rx: 40, ry: 14 }, 'sky'),
    s('path', { d: 'M52 50v70', ...SW(5) }, 'sky', { stroke: true }),
    s('ellipse', { cx: 80, cy: 36, rx: 40, ry: 14, ...SW(3) }, 'navy', { stroke: true })
  ],
  'cobardía': [
    ground(),
    ...person(50, 136, 'yellow', { accent: true }),
    s('rect', { x: 64, y: 70, width: 50, height: 66, rx: 4 }, 'brown'),
    s('path', { d: 'M30 78l-8-4M30 90l-10 0M70 66l4-8', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: drop(36, 60, 4) }, 'sky'),
    s('circle', { cx: 132, cy: 128, r: 8 }, 'dark'),
    s('path', { d: 'M124 122l-6-6M124 134l-6 4M140 122l6-6M140 134l6 4', ...SW(2) }, 'dark', { stroke: true })
  ],
  'cofradía': [
    ground(),
    s('path', { d: 'M18 136V96q0-14 16-14t16 14v40zM64 136V96q0-14 16-14t16 14v40zM110 136V96q0-14 16-14t16 14v40z' }, 'purple', { accent: true }),
    s('path', { d: dots([[34, 68], [80, 68], [126, 68]], 12) }, 'skin'),
    s('path', { d: 'M20 68q14-24 28 0M66 68q14-24 28 0M112 68q14-24 28 0', ...SW(5) }, 'purple', { stroke: true }),
    s('path', { d: 'M48 110V78M94 110V78M140 110V78', ...SW(5) }, 'cream', { stroke: true }),
    s('path', { d: drop(48, 70, 3) + drop(94, 70, 3) + drop(140, 70, 3) }, 'orange')
  ],

};
