// Illustration specs for words still undrawn in batches 0077–0078 (see server/scripts/lexicon/art.js)
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
  cautivo: [
    backdrop('cream'),
    ...person(80, 136, 'orange', { accent: true }),
    s('path', { d: 'M66 104l-8 10M94 104l8 10', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M24 24v112M48 24v112M72 24v112M96 24v112M120 24v112', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M16 24h128M16 136h128', ...SW(8) }, 'dark', { stroke: true })
  ],
  chingar: [
    s('path', { d: 'M40 108h80l-8 30H48z' }, 'blue'),
    s('path', { d: 'M48 108l10-46h44l10 46z' }, 'sky', { accent: true }),
    s('path', { d: 'M70 64l6 18-10 8 12 16M92 64l-4 20 10 10', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M26 40l14 6M30 22l12 14M120 36l14-8M118 22l6 12', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: burst(80, 36, 20, 10, 8) }, 'red')
  ],
  cianuro: [
    s('rect', { x: 66, y: 20, width: 28, height: 22, rx: 4 }, 'dark'),
    s('path', { d: 'M68 42h24v10q26 10 26 40v38q0 8-8 8H50q-8 0-8-8V92q0-30 26-40z' }, 'purple', { accent: true }),
    s('circle', { cx: 80, cy: 90, r: 16 }, 'white'),
    s('rect', { x: 72, y: 100, width: 16, height: 10, rx: 3 }, 'white'),
    s('path', { d: dots([[74, 90], [86, 90]], 4) }, 'dark'),
    s('path', { d: 'M62 116l36 10M98 116l-36 10', ...SW(5) }, 'white', { stroke: true })
  ],
  clandestinidad: [
    s('rect', { x: 14, y: 14, width: 132, height: 40, rx: 8 }, 'sky'),
    s('path', { d: 'M14 54h132v80q0 12-12 12H26q-12 0-12-12z' }, 'brown'),
    s('path', { d: 'M24 72h112v60H24z' }, 'dark'),
    s('path', { d: 'M62 108l78-24v48z' }, 'yellow', { accent: true }),
    ...person(48, 132, 'black', { h: 34, w: 22, r: 9 }),
    s('path', { d: 'M54 104l10 4', ...SW(5) }, 'gray', { stroke: true })
  ],
  clavar: [
    s('rect', { x: 18, y: 112, width: 124, height: 24, rx: 3 }, 'tan'),
    s('path', { d: 'M76 112V76M66 74h20', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 56h50', ...SW(10) }, 'brown', { stroke: true }),
    s('rect', { x: 64, y: 36, width: 24, height: 36, rx: 4 }, 'dark', { accent: true }),
    s('path', { d: 'M56 70l-10-6M58 84l-12 2', ...SW(4) }, 'orange', { stroke: true })
  ],
  cofre: [
    s('path', { d: 'M28 70q0-34 52-34t52 34z' }, 'brown'),
    s('rect', { x: 28, y: 70, width: 104, height: 62, rx: 4 }, 'brown', { accent: true }),
    s('path', { d: 'M28 70h104M48 40v92M112 40v92', ...SW(6) }, 'yellow', { stroke: true }),
    s('rect', { x: 72, y: 62, width: 16, height: 20, rx: 3 }, 'yellow'),
    s('path', { d: dots([[60, 30], [80, 26], [100, 30]], 8) }, 'yellow'),
    s('path', { d: sparkle(130, 30, 10) }, 'orange')
  ],
  'colación': [
    s('ellipse', { cx: 80, cy: 118, rx: 64, ry: 16 }, 'white'),
    s('ellipse', { cx: 80, cy: 118, rx: 64, ry: 16, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 70h48v30q0 14-14 14H42q-14 0-14-14z' }, 'red', { accent: true }),
    s('path', { d: 'M76 78q14 0 12 14t-14 10', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M42 62q-6-10 0-18M58 62q-6-10 0-18', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[110, 110], [128, 106]], 12) }, 'tan'),
    s('path', { d: dots([[106, 108], [114, 112], [126, 102], [132, 108]], 2) }, 'brown')
  ],
  comprensivo: [
    ...person(54, 136, 'blue'),
    ...person(106, 136, 'green', { accent: true }),
    s('path', { d: 'M100 98L66 86', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 34, 14) }, 'red')
  ],
  comunicador: [
    ...person(62, 136, 'purple', { accent: true }),
    s('path', { d: 'M74 104l18-26', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M90 82l14-20', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 106, cy: 58, r: 9 }, 'dark'),
    s('path', { d: 'M120 46q10 10 0 24M128 38q18 18 0 40M136 30q24 26 0 56', ...SW(4) }, 'orange', { stroke: true })
  ],
  consonancia: [
    ...note(52, 110, 'blue'),
    ...note(100, 110, 'purple'),
    s('path', { d: 'M24 54q14-14 28 0t28 0 28 0 28 0', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: heart(80, 30, 9) }, 'pink')
  ],
  controversial: [
    s('path', { d: bubble(16, 26, 58, 44) }, 'blue', { accent: true }),
    s('path', { d: bubble(86, 70, 58, 44) }, 'red'),
    s('path', { d: 'M88 22l-14 28h14l-14 28', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M30 46h30M30 56h20M100 90h30M100 100h20', ...SW(4) }, 'white', { stroke: true })
  ],
  corrector: [
    ...paper(28, 22, 82, 112),
    s('path', { d: 'M40 44h58M40 62h58M40 98h58M40 116h40', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 38, y: 74, width: 62, height: 12, rx: 2 }, 'white'),
    s('path', { d: 'M38 80h62', ...SW(3) }, 'red', { stroke: true }),
    s('rect', { x: 104, y: 46, width: 18, height: 70, rx: 4, transform: 'rotate(25 113 81)' }, 'red', { accent: true }),
    s('path', { d: 'M86 108l8 8 16-18', ...SW(5) }, 'green', { stroke: true })
  ],
  cosechar: [
    s('path', { d: 'M54 24v70M80 18v76M106 24v70', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: ells([[54, 34, 6, 12], [80, 28, 6, 12], [106, 34, 6, 12], [54, 52, 6, 10], [80, 48, 6, 10], [106, 52, 6, 10]]) }, 'yellow'),
    s('path', { d: 'M28 90h104l-12 46H40z' }, 'brown', { accent: true }),
    s('path', { d: 'M34 106h92M38 122h84', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: dots([[60, 88], [98, 88]], 9) }, 'red')
  ],
  costear: [
    s('rect', { x: 22, y: 60, width: 84, height: 62, rx: 8 }, 'brown', { accent: true }),
    s('path', { d: 'M74 78h34v26H74z' }, 'tan'),
    s('circle', { cx: 86, cy: 91, r: 4 }, 'dark'),
    s('path', { d: dots([[120, 104]], 16) }, 'yellow'),
    s('path', { d: dots([[126, 64], [104, 36]], 12) }, 'yellow'),
    s('path', { d: ring(120, 104, 9), ...SW(3) }, 'orange', { stroke: true })
  ],
  cuestionamiento: [
    ...paper(22, 26, 76, 100),
    s('path', { d: 'M34 48h52M34 66h52M34 84h40', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 92, cy: 84, r: 26 }, 'sky', { accent: true }),
    s('path', { d: ring(92, 84, 26), ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M112 104l26 28', ...SW(10) }, 'dark', { stroke: true }),
    s('path', { d: 'M84 76l16 16M100 76l-16 16', ...SW(4) }, 'red', { stroke: true })
  ],
  culero: [
    s('path', { d: 'M40 44q0-20 20-20q6-10 20-6q16-8 26 6q20 0 18 20z' }, 'gray'),
    s('path', { d: 'M86 46l-10 18h10l-8 16', ...SW(4) }, 'yellow', { stroke: true }),
    ...face(80, 108, 30, 'pink', 'frown', { accent: true }),
    s('path', { d: 'M62 92l12 6M98 92l-12 6', ...SW(4) }, 'dark', { stroke: true })
  ],
  deleite: [
    s('path', { d: 'M26 96l96-30 12 6v56H26z' }, 'cream'),
    s('path', { d: 'M26 96l96-30 12 6v56H26z', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M26 112h108', ...SW(8) }, 'pink', { stroke: true }),
    s('path', { d: 'M26 96l96-30 12 6-96 30z' }, 'pink'),
    s('circle', { cx: 112, cy: 62, r: 9 }, 'red', { accent: true }),
    s('path', { d: heart(34, 34, 12) + heart(126, 34, 12) }, 'red'),
    s('path', { d: sparkle(130, 84, 9) + sparkle(28, 82, 8) }, 'yellow')
  ],
  dengue: [
    s('path', { d: ells([[56, 58, 30, 12], [104, 58, 30, 12]]) }, 'sky'),
    s('path', { d: 'M62 92l-22 30M76 96l-6 36M88 96l8 36M98 92l22 30', ...SW(3) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 80, cy: 82, rx: 12, ry: 22 }, 'dark', { accent: true }),
    s('circle', { cx: 80, cy: 52, r: 9 }, 'dark'),
    s('path', { d: 'M80 44V24', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: drop(80, 24, 6) }, 'red')
  ],
  derramar: [
    s('path', { d: 'M20 124q20-14 60-8t66 2v12H20z' }, 'sky', { accent: true }),
    s('path', { d: 'M40 60l58-22 18 46-58 22z' }, 'white'),
    s('path', { d: 'M40 60l58-22 18 46-58 22z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M44 72q-10 20-6 44M54 90q-2 14 6 26', ...SW(8) }, 'sky', { stroke: true }),
    s('path', { d: drop(28, 100, 5) + drop(124, 112, 4) }, 'blue')
  ],
  'deserción': [
    s('path', { d: 'M18 60l24-20 24 20v76H18z' }, 'green'),
    s('rect', { x: 28, y: 72, width: 28, height: 64 }, 'dark'),
    ...lean(102, 136, 18, 'tan', { accent: true }),
    arrow('M112 48h28M130 40l10 8-10 8', 'orange', 5),
    s('path', { d: 'M70 70h10M66 84h14', ...SW(4) }, 'gray', { stroke: true })
  ],
  desestabilizar: [
    ground(),
    s('rect', { x: 50, y: 108, width: 60, height: 28, rx: 3 }, 'blue'),
    s('rect', { x: 52, y: 78, width: 52, height: 28, rx: 3, transform: 'rotate(10 78 106)' }, 'yellow'),
    s('rect', { x: 62, y: 46, width: 44, height: 28, rx: 3, transform: 'rotate(24 84 74)' }, 'red', { accent: true }),
    arrow('M114 30q20 4 24 26M132 48l6 10 8-8', 'orange', 4),
    s('path', { d: 'M30 60l10 4M28 78l12 0', ...SW(4) }, 'gray', { stroke: true })
  ],
  desfavorable: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'pink'),
    s('path', { d: 'M52 58h26l40 0q10 0 10 10t-10 10h4q8 0 8 9t-8 9h-4q6 0 6 8t-8 8H86l4 20q2 14-10 16l-14-34H52z' }, 'skin', { accent: true }),
    s('rect', { x: 34, y: 52, width: 22, height: 50, rx: 4 }, 'red'),
    s('path', { d: 'M100 78h22M100 96h20', ...SW(3) }, 'tan', { stroke: true })
  ],
  desmontar: [
    s('rect', { x: 20, y: 30, width: 70, height: 14, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: 'M28 64v60M58 70v56', ...SW(9) }, 'brown', { stroke: true }),
    s('path', { d: 'M90 80l20 46', ...SW(9) }, 'brown', { stroke: true }),
    s('path', { d: dots([[104, 40], [120, 52], [100, 60]], 4) }, 'gray'),
    s('path', { d: 'M118 80l20 40', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 64l10 18', ...SW(10) }, 'red', { stroke: true })
  ],
  doblete: [
    s('path', { d: 'M20 132V40h120v92', ...SW(8) }, 'white', { stroke: true }),
    s('rect', { x: 20, y: 40, width: 120, height: 92 }, 'mint'),
    s('path', { d: 'M20 40h120M20 132V40M140 40v92', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 40v92M56 40v92M76 40v92M96 40v92M116 40v92M20 64h120M20 88h120M20 112h120', ...SW(1.5) }, 'gray', { stroke: true }),
    s('path', { d: dots([[56, 96], [104, 72]], 16) }, 'white'),
    s('path', { d: ring(56, 96, 16) + ring(104, 72, 16), ...SW(3) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: dots([[56, 96], [104, 72]], 5) }, 'dark')
  ],
  dorso: [
    s('path', { d: 'M24 30h64v100H24z' }, 'white'),
    s('path', { d: 'M24 30h64v100H24z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 48h44M34 64h44M34 80h44M34 96h30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 30h44v100H96z' }, 'sky', { accent: true }),
    arrow('M60 22q30-14 54 4M106 16l8 10-12 4', 'orange', 4)
  ],
  duna: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('circle', { cx: 112, cy: 44, r: 16 }, 'yellow'),
    s('path', { d: 'M14 104q40-40 80-6t52-10v46q0 12-12 12H26q-12 0-12-12z' }, 'tan', { accent: true }),
    s('path', { d: 'M14 124q50-26 132 0v10q0 12-12 12H26q-12 0-12-12z' }, 'orange'),
    s('path', { d: 'M40 102q14-8 28 0', ...SW(3) }, 'cream', { stroke: true })
  ],
  encubrimiento: [
    s('path', { d: 'M18 130q8-30 40-30h70v30z' }, 'red', { accent: true }),
    s('path', { d: 'M18 130q8-30 40-30', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M36 130h100', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M112 22L62 108', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M52 96l20 10-12 22-22-10z' }, 'yellow'),
    s('path', { d: dots([[30, 124], [40, 128], [26, 132]], 3) }, 'gray')
  ],
  enjuiciamiento: [
    s('rect', { x: 34, y: 116, width: 92, height: 18, rx: 4 }, 'brown'),
    s('path', { d: 'M80 76l40-40', ...SW(9) }, 'brown', { stroke: true }),
    s('rect', { x: 36, y: 50, width: 64, height: 26, rx: 6, transform: 'rotate(45 68 63)' }, 'brown', { accent: true }),
    s('path', { d: 'M34 94l10 16M24 108l14 6', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M48 63l38 0', ...SW(3), transform: 'rotate(45 68 63)' }, 'tan', { stroke: true })
  ],
  enzima: [
    s('path', { d: 'M22 80a44 44 0 0 1 88 0v40H82v-24H50v24H22z' }, 'purple', { accent: true }),
    s('rect', { x: 54, y: 100, width: 24, height: 28, rx: 3 }, 'yellow'),
    s('path', { d: 'M66 128v12', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: dots([[126, 116], [138, 102]], 8) }, 'green'),
    s('path', { d: sparkle(120, 50, 14) }, 'yellow')
  ],
  equivalencia: [
    s('path', { d: 'M80 30v100M56 134h48', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 54h104', ...SW(6) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: 'M28 54l-12 34M28 54l12 34M132 54l-12 34M132 54l12 34', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 88h28q0 14-14 14t-14-14zM118 88h28q0 14-14 14t-14-14z' }, 'yellow'),
    s('circle', { cx: 28, cy: 78, r: 10 }, 'red'),
    s('rect', { x: 122, y: 70, width: 20, height: 18, rx: 2 }, 'blue')
  ],
  'escorpión': [
    s('path', { d: 'M80 120q-6-30 0-60q8-30 30-28q18 2 14 22', ...SW(10) }, 'brown', { stroke: true }),
    s('path', { d: 'M120 54l12 4-10 8z' }, 'dark'),
    s('ellipse', { cx: 80, cy: 112, rx: 20, ry: 24 }, 'brown', { accent: true }),
    s('path', { d: 'M62 100l-20-4M62 112l-22 4M62 124l-18 10M98 100l20-4M98 112l22 4M98 124l18 10', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M66 94l-20-30M94 94l20-30', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 70q-14-16 4-22l2 10zM120 70q14-16-4-22l-2 10z' }, 'brown')
  ],
  estratega: [
    s('rect', { x: 18, y: 22, width: 124, height: 96, rx: 6 }, 'mint'),
    s('rect', { x: 18, y: 22, width: 124, height: 96, rx: 6, ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M34 98q20-40 50-30t40-30', ...DASH(4) }, 'navy', { stroke: true }),
    s('path', { d: 'M118 32l10 4-4 10z' }, 'navy'),
    s('path', { d: 'M38 90l12 12M50 90l-12 12', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M66 140h28l-4-10q6-6 4-16q-4-14-14-16l-4 6-6-2q0 10 4 14z' }, 'dark', { accent: true })
  ],
  'eucaristía': [
    s('path', { d: rays(80, 48, 30, 42, 12), ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 48, r: 24 }, 'cream'),
    s('circle', { cx: 80, cy: 48, r: 24, ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M50 86h60q0 26-30 28q-30-2-30-28z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 114v16M62 136h36', ...SW(7) }, 'yellow', { stroke: true })
  ],
  exclamar: [
    s('circle', { cx: 62, cy: 82, r: 40 }, 'skin'),
    s('path', { d: dots([[48, 68], [76, 68]], 5) }, 'dark'),
    s('ellipse', { cx: 62, cy: 98, rx: 12, ry: 14 }, 'red', { accent: true }),
    s('path', { d: 'M48 54l8-4M76 50l8 4', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M110 66l26-14M114 84h30M110 102l26 14', ...SW(6) }, 'orange', { stroke: true })
  ],
  exponencial: [
    s('path', { d: 'M26 22v112h116', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M34 124q60-2 90-90', ...SW(7) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M114 34l14-12 4 18z' }, 'green'),
    s('path', { d: dots([[54, 122], [78, 116], [98, 100], [112, 72]], 5) }, 'blue')
  ],
  'exótico': [
    s('path', { d: 'M48 136q4-50-4-90', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(44, 46, 200, 34, 9) + leaflet(44, 46, 160, 30, 8) + leaflet(44, 46, -20, 34, 9) + leaflet(44, 46, 20, 30, 8) + leaflet(44, 46, -90, 26, 7) }, 'green'),
    s('path', { d: [0, 72, 144, 216, 288].map(a => leaflet(110, 96, a - 90, 30, 13)).join('') }, 'pink', { accent: true }),
    s('circle', { cx: 110, cy: 96, r: 7 }, 'red'),
    s('path', { d: 'M110 96l14-14', ...SW(3) }, 'yellow', { stroke: true })
  ],
  fielmente: [
    ground(),
    ...person(48, 136, 'blue'),
    s('path', { d: 'M88 136v-24q0-16 14-18l6-14 8 8q14 0 12 14l-8 6v28z' }, 'brown', { accent: true }),
    s('path', { d: 'M112 86l-4-12 10 4z' }, 'brown'),
    s('circle', { cx: 116, cy: 96, r: 2.5 }, 'dark'),
    s('path', { d: heart(80, 40, 12) }, 'red')
  ],
  fragancia: [
    s('rect', { x: 70, y: 34, width: 20, height: 16, rx: 3 }, 'yellow'),
    s('path', { d: 'M50 60q0-10 10-10h40q10 0 10 10v62q0 12-12 12H62q-12 0-12-12z' }, 'pink', { accent: true }),
    s('path', { d: 'M60 68h40v40H60z' }, 'white'),
    s('path', { d: 'M30 42q-8-8 0-16t0-16M120 46q-8-8 0-16M138 52q-8-8 0-16', ...SW(3) }, 'purple', { stroke: true }),
    s('path', { d: dots([[24, 66], [134, 74]], 4) }, 'purple')
  ],
  franqueza: [
    s('circle', { cx: 40, cy: 92, r: 26 }, 'skin'),
    s('path', { d: dots([[34, 86], [50, 86]], 3) }, 'dark'),
    s('path', { d: 'M44 102h12', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: bubble(74, 28, 74, 52) }, 'sky', { accent: true }),
    arrow('M90 54h40M120 44l10 10-10 10', 'navy', 6),
    s('rect', { x: 18, y: 120, width: 44, height: 22, rx: 8 }, 'green')
  ],
  fugitivo: [
    ground(),
    ...lean(76, 132, 20, 'orange', { accent: true }),
    s('path', { d: 'M62 100h28M62 112h28', ...SW(4), transform: 'rotate(20 76 132)' }, 'dark', { stroke: true }),
    s('path', { d: 'M68 132l-14 4M82 130l14 4', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 46l60 20v30L14 80z' }, 'yellow'),
    s('path', { d: 'M110 70h28M114 84h22M110 98h28', ...SW(4) }, 'gray', { stroke: true })
  ],
  galo: [
    s('path', { d: 'M80 26q4-12 10 0q4-10 10 2l-6 8z' }, 'red'),
    s('path', { d: 'M90 34q16 2 14 22l-6 10q14 12 6 40q-6 22-34 22q-34 0-36-30q0-12 8-20q14 10 24 4l10-28q2-20 14-20z' }, 'blue', { accent: true }),
    s('path', { d: 'M102 46l14 4-14 6z' }, 'yellow'),
    s('path', { d: 'M38 88q-22-20-6-44M46 82q-12-26 6-40M52 80q0-24 18-28', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M72 128v10M86 128v10', ...SW(5) }, 'orange', { stroke: true }),
    s('circle', { cx: 94, cy: 44, r: 3 }, 'dark')
  ],
  genocida: [
    s('path', { d: busts([30, 52, 74], 136, 20, 24) }, 'gray'),
    s('path', { d: dots([[30, 98], [52, 98], [74, 98]], 8) }, 'gray'),
    ...person(118, 136, 'black', { h: 56, w: 32, r: 14, accent: true }),
    s('path', { d: 'M90 70l-14 0', ...SW(6) }, 'black', { stroke: true }),
    s('path', { d: 'M24 50q0-14 14-14q6-12 20-8q12-8 22 4q14 0 14 18z' }, 'dark')
  ],
  granizo: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M30 64q0-18 18-18q6-18 28-16q14-14 32 0q22 0 22 20q12 4 10 14z' }, 'gray', { accent: true }),
    s('path', { d: dots([[46, 86], [80, 80], [112, 88], [62, 108], [98, 112], [40, 126], [124, 122], [80, 132]], 6) }, 'white'),
    s('path', { d: [[46, 86], [80, 80], [112, 88], [62, 108], [98, 112], [40, 126], [124, 122], [80, 132]].map(([x, y]) => ring(x, y, 6)).join(''), ...SW(2) }, 'navy', { stroke: true })
  ],
  heraldo: [
    ...person(46, 136, 'purple', { accent: true }),
    s('path', { d: 'M54 70l70-20', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M120 40l20-10v38l-20-10z' }, 'yellow'),
    s('path', { d: 'M74 66l40-12 6 28-38 10z' }, 'red'),
    s('path', { d: 'M86 70l20-6 4 14-20 6z' }, 'yellow')
  ],
  heredar: [
    ...person(42, 136, 'brown'),
    s('path', { d: 'M30 52q12-12 24 0', ...SW(5) }, 'white', { stroke: true }),
    ...person(118, 136, 'green', { h: 36, w: 26, r: 11 }),
    s('path', { d: 'M54 100h18M106 104H92', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: ring(76, 98, 8), ...SW(5) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M84 98h12M90 98v6M94 98v5', ...SW(4) }, 'yellow', { stroke: true })
  ],
  iceberg: [
    s('rect', { x: 14, y: 14, width: 132, height: 44, rx: 8 }, 'sky'),
    s('path', { d: 'M14 58h132v76q0 12-12 12H26q-12 0-12-12z' }, 'navy'),
    s('path', { d: 'M62 58l12-30 10 8 14 22z' }, 'white', { accent: true }),
    s('path', { d: 'M54 58h52l18 30-14 40H46l-20-36z' }, 'sky'),
    s('path', { d: 'M14 58h132', ...SW(3) }, 'blue', { stroke: true })
  ],
  'ilegítimo': [
    ...paper(30, 20, 84, 116),
    s('path', { d: 'M42 40h60M42 56h60M42 72h40', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 92, cy: 104, r: 26 }, 'white'),
    s('path', { d: ring(92, 104, 24) + 'M75 87l34 34', ...SW(7) }, 'red', { stroke: true, accent: true })
  ],
  'implícito': [
    s('rect', { x: 22, y: 46, width: 116, height: 76, rx: 6 }, 'cream'),
    s('rect', { x: 22, y: 46, width: 116, height: 76, rx: 6, ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: heart(80, 84, 22) }, 'pink', { accent: true }),
    s('path', { d: 'M22 46l58 44 58-44', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M26 50l54 40 54-40v4l-54 40-54-40z' }, 'cream')
  ],
  inspirador: [
    ...person(80, 136, 'blue'),
    s('circle', { cx: 80, cy: 40, r: 18 }, 'yellow', { accent: true }),
    s('rect', { x: 72, y: 56, width: 16, height: 10, rx: 2 }, 'gray'),
    s('path', { d: halfRays(80, 40, 24, 36, 7), ...SW(4) }, 'orange', { stroke: true })
  ],
  'instantáneo': [
    s('rect', { x: 72, y: 18, width: 16, height: 12, rx: 2 }, 'dark'),
    s('circle', { cx: 80, cy: 86, r: 52 }, 'white'),
    s('path', { d: ring(80, 86, 52), ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M86 48L64 92h18l-10 34 26-46H80z' }, 'yellow'),
    s('path', { d: 'M118 42l8-8', ...SW(6) }, 'dark', { stroke: true })
  ],
  interlocutor: [
    ...person(42, 136, 'blue'),
    ...person(118, 136, 'orange', { accent: true }),
    s('path', { d: bubble(26, 18, 46, 34) }, 'sky'),
    s('path', { d: 'M134 18h-38a8 8 0 0 0-8 8v18a8 8 0 0 0 8 8h22l12 10v-10h4a8 8 0 0 0 8-8V26a8 8 0 0 0-8-8z' }, 'cream'),
    s('path', { d: 'M36 32h26M98 34h26', ...SW(4) }, 'white', { stroke: true })
  ],
  'jardinería': [
    s('path', { d: 'M14 124h132v10q0 12-12 12H26q-12 0-12-12z' }, 'brown'),
    ...flower(116, 82, 'pink'),
    s('path', { d: 'M24 64h56l-6 40H30z' }, 'green', { accent: true }),
    s('path', { d: 'M78 74l26-20', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M30 70q-14 4-8 24', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M106 52l4 14M112 50l8 12', ...SW(3) }, 'blue', { stroke: true })
  ],
  jarra: [
    s('path', { d: 'M50 34h56l-4 8v86q0 10-10 10H60q-10 0-10-10z' }, 'white'),
    s('path', { d: 'M56 66h46v62q0 8-8 8H64q-8 0-8-8z' }, 'orange', { accent: true }),
    s('path', { d: 'M50 34h56l-4 8v86q0 10-10 10H60q-10 0-10-10z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M102 56q30 0 26 32q-4 22-26 22', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M44 34l-8-6', ...SW(5) }, 'gray', { stroke: true })
  ],
  leopardo: [
    s('path', { d: 'M38 46l6-22 20 14zM122 46l-6-22-20 14z' }, 'orange'),
    s('ellipse', { cx: 80, cy: 82, rx: 50, ry: 46 }, 'yellow', { accent: true }),
    s('path', { d: dots([[50, 66], [58, 106], [104, 104], [112, 70], [80, 46], [66, 52], [96, 52], [44, 88], [118, 90]], 4) }, 'brown'),
    s('path', { d: dots([[64, 78], [96, 78]], 5) }, 'dark'),
    s('ellipse', { cx: 80, cy: 104, rx: 18, ry: 12 }, 'cream'),
    s('path', { d: 'M74 96h12l-6 6z', ...SW(3) }, 'dark', { stroke: true })
  ],
  liviano: [
    s('path', { d: 'M40 132Q50 70 118 26', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 116q-6-50 70-90q4 30-16 56q-22 26-54 34z' }, 'sky', { accent: true }),
    s('path', { d: 'M48 116q8-60 70-90', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M20 60q10-6 20 0M110 112q10-6 20 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  luminosidad: [
    s('circle', { cx: 80, cy: 62, r: 22 }, 'yellow', { accent: true }),
    s('path', { d: rays(80, 62, 30, 44, 8), ...SW(6) }, 'orange', { stroke: true }),
    s('rect', { x: 22, y: 118, width: 116, height: 10, rx: 5 }, 'gray'),
    s('rect', { x: 22, y: 118, width: 86, height: 10, rx: 5 }, 'blue'),
    s('circle', { cx: 108, cy: 123, r: 11 }, 'white'),
    s('path', { d: ring(108, 123, 11), ...SW(3) }, 'blue', { stroke: true })
  ],
  'látigo': [
    s('path', { d: 'M28 132l26-34', ...SW(12) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M54 98q20-40 70-44q22 0 12 22q-8 14-26 8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 84l-14 10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M90 106l-6 10M100 108l6 12M80 104l-14 6', ...SW(4) }, 'orange', { stroke: true })
  ],
  'lírico': [
    s('path', { d: 'M52 132q-26-30-14-72q6-24 18-30M108 132q26-30 14-72q-6-24-18-30', ...SW(9) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M40 132h80', ...SW(10) }, 'brown', { stroke: true }),
    s('path', { d: 'M44 50h72', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: 'M62 50v82M74 50v82M86 50v82M98 50v82', ...SW(2) }, 'gray', { stroke: true }),
    ...note(130, 40, 'purple')
  ],
  malentendido: [
    ...person(40, 136, 'blue'),
    ...person(120, 136, 'green'),
    s('path', { d: bubble(16, 16, 46, 38) }, 'sky'),
    s('circle', { cx: 39, cy: 33, r: 10 }, 'blue'),
    s('path', { d: 'M136 16h-36a8 8 0 0 0-8 8v22a8 8 0 0 0 8 8h22l12 10v-10h2a8 8 0 0 0 8-8V24a8 8 0 0 0-8-8z' }, 'mint'),
    s('rect', { x: 108, y: 26, width: 18, height: 18 }, 'green'),
    s('path', { d: 'M80 70l-6 12h12l-6 12', ...SW(5) }, 'red', { stroke: true, accent: true })
  ],
  'maricón': [
    s('path', { d: bubble(24, 30, 112, 80) }, 'cream'),
    s('path', { d: bubble(24, 30, 112, 80), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M44 64l10-10 10 16 10-16 10 16 10-16 10 16 10-10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: ring(80, 66, 34) + 'M56 42l48 48', ...SW(7) }, 'red', { stroke: true, accent: true })
  ],
  medianamente: [
    s('path', { d: 'M20 112a60 60 0 0 1 40-56l8 20a38 38 0 0 0-26 36z' }, 'red'),
    s('path', { d: 'M60 56a60 60 0 0 1 40 0l-8 20a38 38 0 0 0-24 0z' }, 'yellow', { accent: true }),
    s('path', { d: 'M100 56a60 60 0 0 1 40 56h-22a38 38 0 0 0-26-36z' }, 'green'),
    s('path', { d: 'M80 112V60', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 112, r: 9 }, 'dark')
  ],
  mediar: [
    ...person(30, 136, 'red', { h: 38, w: 24, r: 11 }),
    ...person(130, 136, 'blue', { h: 38, w: 24, r: 11 }),
    ...person(80, 136, 'green', { accent: true }),
    s('path', { d: 'M66 100l-20-6M94 100l20-6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M18 32l10 10M142 32l-10 10', ...SW(4) }, 'orange', { stroke: true })
  ],
  mercader: [
    s('path', { d: 'M18 46h124l-8-22H26z' }, 'red', { accent: true }),
    s('path', { d: 'M38 24l-4 22M60 24l-2 22M80 24v22M100 24l2 22M122 24l4 22', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M26 46v90M134 46v90', ...SW(5) }, 'brown', { stroke: true }),
    ...person(80, 112, 'purple', { h: 36, w: 26, r: 11 }),
    s('rect', { x: 26, y: 104, width: 108, height: 32 }, 'brown'),
    s('path', { d: dots([[42, 100], [56, 100], [106, 100], [120, 100]], 8) }, 'orange')
  ],
  meridiano: [
    s('circle', { cx: 80, cy: 80, r: 58 }, 'sky'),
    s('path', { d: 'M40 50q20-8 30 10t-10 30q-16 6-24-12zM96 90q20-4 26 14t-14 20q-18-4-12-34z' }, 'green'),
    s('path', { d: 'M22 80h116M30 52h100M30 108h100', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M80 22q-30 58 0 116', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: ring(80, 80, 58), ...SW(3) }, 'blue', { stroke: true })
  ],
  momia: [
    s('path', { d: 'M80 18q26 0 26 30v20q20 6 18 40l-6 30H42l-6-30q-2-34 18-40V48q0-30 26-30z' }, 'cream', { accent: true }),
    s('path', { d: 'M54 34l52 14M54 60l52-10M40 88l80 10M38 108l84-8M42 126l76 6', ...SW(4) }, 'tan', { stroke: true }),
    s('rect', { x: 62, y: 38, width: 36, height: 12, rx: 4 }, 'dark'),
    s('path', { d: dots([[72, 44], [88, 44]], 3) }, 'white'),
    s('path', { d: 'M40 138q20-6 30 0', ...SW(4) }, 'tan', { stroke: true })
  ],
  moribundo: [
    s('path', { d: 'M52 106h56l-8 32H60z' }, 'brown'),
    s('path', { d: 'M80 106V60q0-24 22-26', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: ells([[108, 48, 12, 7], [96, 58, 12, 7]]), transform: 'rotate(40 104 52)' }, 'tan', { accent: true }),
    s('circle', { cx: 106, cy: 42, r: 6 }, 'brown'),
    s('path', { d: leaflet(80, 84, 150, 22, 6) }, 'tan'),
    s('path', { d: ells([[122, 96, 8, 4], [44, 132, 8, 4]]) }, 'tan')
  ],
  mosquero: [
    s('path', { d: 'M80 14v18', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 64, y: 30, width: 32, height: 110, rx: 2 }, 'yellow', { accent: true }),
    s('path', { d: dots([[76, 56], [86, 86], [74, 114]], 5) }, 'dark'),
    s('path', { d: ells([[70, 50, 6, 3], [82, 50, 6, 3], [80, 80, 6, 3], [92, 80, 6, 3], [68, 108, 6, 3], [80, 108, 6, 3]]) }, 'sky'),
    s('path', { d: dots([[124, 60]], 5) }, 'dark'),
    s('path', { d: ells([[118, 54, 6, 3], [130, 54, 6, 3]]) + 'M114 70q-6 6-12 2' }, 'sky')
  ],
  narciso: [
    s('path', { d: 'M80 82v56', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 136, -120, 46, 7) + leaflet(80, 136, -60, 40, 6) }, 'green'),
    s('path', { d: [0, 60, 120, 180, 240, 300].map(a => leaflet(80, 56, a, 34, 12)).join('') }, 'yellow'),
    s('circle', { cx: 80, cy: 56, r: 16 }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 56, r: 8 }, 'yellow')
  ],
  nava: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 96l30-56 36 56zM80 96l36-62 30 56v6z' }, 'gray'),
    s('path', { d: 'M38 52l6-12 8 14zM110 46l6-12 8 14z' }, 'white'),
    s('path', { d: 'M14 92q66-14 132 0v42q0 12-12 12H26q-12 0-12-12z' }, 'green', { accent: true }),
    s('path', { d: ells([[60, 118, 18, 5], [108, 110, 14, 4]]) }, 'blue'),
    s('path', { d: 'M34 108v-6M40 108v-8M128 126v-6M134 126v-8', ...SW(3) }, 'mint', { stroke: true })
  ],
  nodo: [
    s('path', { d: 'M80 80L36 40M80 80l48-36M80 80l-46 46M80 80l50 42M36 40l92 4', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[36, 40], [128, 44], [34, 126], [130, 122]], 12) }, 'blue'),
    s('circle', { cx: 80, cy: 80, r: 18 }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 7 }, 'white')
  ],
  'numérico': [
    s('rect', { x: 36, y: 16, width: 88, height: 128, rx: 10 }, 'dark'),
    s('rect', { x: 46, y: 26, width: 68, height: 26, rx: 4 }, 'mint', { accent: true }),
    s('path', { d: grid(46, 62, 3, 4, 18, 14, 25, 19) }, 'gray'),
    s('rect', { x: 96, y: 119, width: 18, height: 14 }, 'orange')
  ],
  optimizar: [
    ...gear(66, 92, 30, 10, 'gray'),
    s('circle', { cx: 66, cy: 92, r: 12 }, 'white'),
    arrow('M96 100l32-60M110 42l18-2 4 18', 'green', 8),
    s('path', { d: sparkle(124, 104, 12) + sparkle(32, 36, 9) }, 'yellow', { accent: true })
  ],
  orfanato: [
    s('path', { d: 'M18 74l62-48 62 48z' }, 'red'),
    s('rect', { x: 28, y: 74, width: 104, height: 62 }, 'cream'),
    s('rect', { x: 28, y: 74, width: 104, height: 62, ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: heart(80, 52, 10) }, 'pink', { accent: true }),
    s('path', { d: busts([52, 80, 108], 136, 18, 22) }, 'blue'),
    s('path', { d: dots([[52, 104], [80, 104], [108, 104]], 8) }, 'skin')
  ],
  'orgía': [
    ...glass(58, -16, true),
    ...glass(102, 16, false),
    s('path', { d: sparkle(80, 26, 10) }, 'yellow'),
    s('path', { d: 'M22 30l6 8M134 30l-4 10M28 132l10-4M128 130l-8-6', ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: dots([[38, 60], [124, 64], [24, 98], [138, 96]], 4) }, 'purple')
  ],
  paliar: [
    s('rect', { x: 18, y: 54, width: 124, height: 52, rx: 26 }, 'skin'),
    s('path', { d: burst(80, 80, 30, 18, 10) }, 'pink'),
    s('rect', { x: 46, y: 64, width: 68, height: 32, rx: 10, transform: 'rotate(-20 80 80)' }, 'tan', { accent: true }),
    s('rect', { x: 66, y: 70, width: 28, height: 20, rx: 3, transform: 'rotate(-20 80 80)' }, 'cream'),
    s('path', { d: 'M40 30q8-8 16 0M104 128q8-8 16 0M114 26q8-8 16 0', ...SW(3) }, 'sky', { stroke: true })
  ],
  parlante: [
    s('rect', { x: 26, y: 22, width: 70, height: 116, rx: 8 }, 'dark', { accent: true }),
    s('circle', { cx: 61, cy: 98, r: 24 }, 'gray'),
    s('circle', { cx: 61, cy: 98, r: 10 }, 'dark'),
    s('circle', { cx: 61, cy: 48, r: 12 }, 'gray'),
    s('path', { d: 'M108 70q10 14 0 28M118 60q18 24 0 48M128 50q26 34 0 68', ...SW(4) }, 'orange', { stroke: true })
  ],
  'perdición': [
    s('ellipse', { cx: 80, cy: 104, rx: 64, ry: 36 }, 'navy'),
    s('path', { d: 'M80 104m-50 0a50 26 0 0 1 96 -4a36 18 0 0 1-70 6a20 10 0 0 1 38-2', ...SW(5) }, 'blue', { stroke: true }),
    s('circle', { cx: 80, cy: 104, r: 8 }, 'black'),
    s('circle', { cx: 90, cy: 34, r: 10 }, 'skin'),
    s('rect', { x: 78, y: 46, width: 22, height: 30, rx: 7, transform: 'rotate(20 89 61)' }, 'red', { accent: true }),
    s('path', { d: 'M74 50l-14-14M104 52l14-12', ...SW(5) }, 'skin', { stroke: true })
  ],
  pesticida: [
    s('rect', { x: 28, y: 62, width: 44, height: 76, rx: 8 }, 'green', { accent: true }),
    s('rect', { x: 38, y: 44, width: 22, height: 18 }, 'dark'),
    s('path', { d: 'M60 36h-26l6 8h20z' }, 'dark'),
    s('path', { d: 'M66 40l22-10M68 40l24 4M66 40l22 16', ...DASH(3, '3 5') }, 'gray', { stroke: true }),
    s('ellipse', { cx: 118, cy: 52, rx: 12, ry: 16 }, 'brown'),
    s('path', { d: 'M104 40l-8-6M132 40l8-6M106 58l-10 4M130 58l10 4M98 28l40 48M138 28l-40 48', ...SW(4) }, 'red', { stroke: true })
  ],
  pintoresco: [
    s('path', { d: 'M48 138l20-40M112 138l-20-40M80 98v40', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 24, y: 24, width: 112, height: 80, rx: 2 }, 'brown'),
    s('rect', { x: 30, y: 30, width: 100, height: 68 }, 'sky', { accent: true }),
    s('path', { d: 'M30 82l26-30 22 24 18-16 34 28v10H30z' }, 'green'),
    s('circle', { cx: 108, cy: 44, r: 8 }, 'yellow')
  ],
  planetario: [
    s('path', { d: 'M14 120a66 66 0 0 1 132 0v14q0 12-12 12H26q-12 0-12-12z' }, 'navy'),
    s('path', { d: star(50, 66, 8) + star(108, 56, 10) + star(80, 40, 6) + star(126, 92, 6) + star(34, 98, 6) }, 'yellow'),
    s('circle', { cx: 86, cy: 84, r: 12 }, 'orange'),
    s('path', { d: 'M70 88q16-10 32-8', ...SW(3) }, 'cream', { stroke: true }),
    s('path', { d: 'M66 146l6-22h16l6 22z' }, 'gray'),
    s('circle', { cx: 80, cy: 120, r: 9 }, 'dark', { accent: true })
  ],
  recabar: [
    s('path', { d: 'M24 90h112l-8 46H32z' }, 'blue', { accent: true }),
    s('path', { d: 'M24 90h40l6-8h66v8' }, 'blue'),
    s('rect', { x: 34, y: 30, width: 28, height: 36, rx: 2, transform: 'rotate(-15 48 48)' }, 'white'),
    s('rect', { x: 34, y: 30, width: 28, height: 36, rx: 2, transform: 'rotate(-15 48 48)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[110, 40], [124, 60]], 10) }, 'yellow'),
    arrow('M62 62l12 20M108 58l-12 22', 'orange', 4)
  ],
  reciclar: [
    s('path', { d: 'M42 58h76l-8 80H50z' }, 'green', { accent: true }),
    s('rect', { x: 36, y: 46, width: 88, height: 12, rx: 4 }, 'dark'),
    s('path', { d: 'M62 112a20 20 0 0 1 4-30M94 82a20 20 0 0 1 2 30M74 120h14', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M58 76l10 4-4 10zM100 116l-10-2 4-10zM84 126l6-6-6-6' }, 'white'),
    s('path', { d: 'M66 38q14-22 28 0', ...SW(5) }, 'dark', { stroke: true })
  ],
  regencia: [
    ...person(54, 136, 'purple', { accent: true }),
    ...person(110, 136, 'blue', { h: 30, w: 22, r: 10 }),
    s('path', { d: 'M96 78l4-12 7 8 3-10 3 10 7-8 4 12z' }, 'yellow'),
    s('path', { d: 'M66 96l24-14', ...SW(6) }, 'skin', { stroke: true })
  ],
  replicar: [
    ...person(34, 136, 'blue'),
    ...person(126, 136, 'red', { accent: true }),
    arrow('M54 52h52M94 42l12 10-12 10', 'blue', 6),
    arrow('M106 80H54M66 70L54 80l12 10', 'red', 6)
  ],
  reverencia: [
    ground(),
    s('rect', { x: 54, y: 92, width: 22, height: 44, rx: 6 }, 'navy'),
    s('rect', { x: 54, y: 76, width: 60, height: 26, rx: 10 }, 'blue', { accent: true }),
    s('circle', { cx: 124, cy: 98, r: 12 }, 'skin'),
    s('path', { d: 'M96 98v26', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M30 60q10-10 20 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  rin: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'dark'),
    s('circle', { cx: 80, cy: 80, r: 42 }, 'gray', { accent: true }),
    s('path', { d: rays(80, 80, 10, 40, 5, -90), ...SW(10) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'dark'),
    s('path', { d: ring(80, 80, 42), ...SW(3) }, 'white', { stroke: true })
  ],
  rojizo: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'cream'),
    s('circle', { cx: 80, cy: 100, r: 34 }, 'pink', { accent: true }),
    s('path', { d: 'M14 100h132v34q0 12-12 12H26q-12 0-12-12z' }, 'orange'),
    s('path', { d: 'M14 112h132', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M14 64h132M14 82h132', ...SW(8) }, 'pink', { stroke: true }),
    s('path', { d: birds([[48, 38], [70, 30]]), ...SW(3) }, 'dark', { stroke: true })
  ],
  'ráfaga': [
    s('path', { d: 'M108 136q4-40-6-70', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M102 70q-4-36 30-40q8 30-20 46z' }, 'green'),
    s('path', { d: 'M18 50h56q14 0 14-12t-12-12M18 76h80M18 102h58q14 0 14 12t-12 12', ...SW(6) }, 'sky', { stroke: true, accent: true }),
    s('path', { d: ells([[128, 70, 6, 3], [138, 100, 6, 3]]) }, 'green')
  ],
  sacro: [
    s('path', { d: rays(80, 70, 50, 64, 12), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M38 138V76a42 42 0 0 1 84 0v62z' }, 'tan'),
    s('path', { d: 'M56 138V82a24 24 0 0 1 48 0v56z' }, 'purple', { accent: true }),
    s('rect', { x: 74, y: 100, width: 12, height: 26, rx: 2 }, 'cream'),
    s('path', { d: drop(80, 92, 5) }, 'orange'),
    s('path', { d: 'M30 138h100', ...SW(5) }, 'brown', { stroke: true })
  ],
  seta: [
    s('path', { d: 'M14 132q66-12 132 0v6H14z' }, 'green'),
    s('path', { d: 'M70 132q-6-30 0-52h22q6 22 0 52z' }, 'cream'),
    s('path', { d: 'M28 84q0-50 54-50t52 50z' }, 'brown', { accent: true }),
    s('path', { d: dots([[60, 56], [88, 48], [110, 66]], 6) }, 'tan'),
    s('path', { d: 'M110 134q-2-14 2-24h12q4 10 0 24zM100 112q2-22 18-22t18 22z' }, 'tan')
  ],
  'sincronización': [
    s('circle', { cx: 46, cy: 84, r: 32 }, 'white'),
    s('circle', { cx: 114, cy: 84, r: 32 }, 'white'),
    s('path', { d: ring(46, 84, 32) + ring(114, 84, 32), ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M46 84V64M46 84l14 8M114 84V64M114 84l14 8', ...SW(5) }, 'dark', { stroke: true }),
    arrow('M40 40q40-30 80 0M110 30l10 10-14 4', 'orange', 4),
    arrow('M120 128q-40 30-80 0M50 138l-10-10 14-4', 'orange', 4)
  ],
  soberbio: [
    s('path', { d: busts([28, 132], 136, 20, 26) }, 'gray'),
    s('path', { d: dots([[28, 102], [132, 102]], 8) }, 'gray'),
    s('rect', { x: 50, y: 98, width: 60, height: 38, rx: 3 }, 'tan'),
    s('rect', { x: 66, y: 50, width: 28, height: 48, rx: 9 }, 'purple', { accent: true }),
    s('circle', { cx: 82, cy: 36, r: 12 }, 'skin'),
    s('path', { d: 'M90 30l8-4', ...SW(4) }, 'skin', { stroke: true }),
    s('path', { d: 'M66 66h28', ...SW(6) }, 'skin', { stroke: true })
  ],
  sobresalir: [
    ground(),
    s('path', { d: rects([[20, 96, 18, 40], [44, 96, 18, 40], [98, 96, 18, 40], [122, 96, 18, 40]]) }, 'gray'),
    s('rect', { x: 70, y: 48, width: 20, height: 88, rx: 2 }, 'orange', { accent: true }),
    s('path', { d: star(80, 30, 14) }, 'yellow')
  ],
  soya: [
    s('path', { d: 'M24 100q10-50 70-60q16 0 12 14q-20 50-74 54q-10 0-8-8z' }, 'green', { accent: true }),
    s('path', { d: dots([[46, 92], [62, 78], [80, 64]], 10) }, 'mint'),
    s('rect', { x: 110, y: 66, width: 26, height: 72, rx: 6 }, 'dark'),
    s('rect', { x: 116, y: 50, width: 14, height: 18, rx: 2 }, 'red'),
    s('rect', { x: 112, y: 92, width: 22, height: 22 }, 'cream')
  ],
  subsistir: [
    s('path', { d: 'M14 102h132v32q0 12-12 12H26q-12 0-12-12z' }, 'gray'),
    s('path', { d: 'M80 102l-6 14 8 10-6 20', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 104V56', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 76, -150, 30, 10) + leaflet(80, 62, -30, 32, 11) }, 'green', { accent: true }),
    s('circle', { cx: 124, cy: 36, r: 14 }, 'yellow')
  ],
  sudar: [
    s('circle', { cx: 128, cy: 32, r: 14 }, 'yellow'),
    s('path', { d: rays(128, 32, 18, 26, 8), ...SW(3) }, 'orange', { stroke: true }),
    ...face(70, 86, 46, 'skin', 'flat'),
    s('path', { d: drop(28, 64, 6) + drop(114, 76, 6) + drop(36, 104, 5) + drop(108, 108, 5) }, 'sky', { accent: true }),
    s('path', { d: 'M46 60q24-20 48 0', ...SW(5) }, 'skin', { stroke: true })
  ],
  tableta: [
    s('rect', { x: 30, y: 18, width: 100, height: 124, rx: 12 }, 'dark'),
    s('rect', { x: 38, y: 28, width: 84, height: 100, rx: 4 }, 'sky', { accent: true }),
    s('path', { d: rects([[46, 38, 18, 18], [71, 38, 18, 18], [96, 38, 18, 18], [46, 64, 18, 18]]) }, 'white'),
    s('circle', { cx: 80, cy: 135, r: 3 }, 'gray')
  ],
  'tapón': [
    s('path', { d: 'M66 58h28v14q22 10 22 40v26H44v-26q0-30 22-40z' }, 'green'),
    s('path', { d: 'M60 30h40l-4 34H64z' }, 'tan', { accent: true }),
    s('path', { d: dots([[72, 40], [88, 50], [76, 56]], 2.5) }, 'brown'),
    s('rect', { x: 52, y: 94, width: 56, height: 26, rx: 3 }, 'cream'),
    s('path', { d: 'M106 30l12-8M108 42l14 0', ...SW(4) }, 'orange', { stroke: true })
  ],
  tibio: [
    s('path', { d: 'M28 74h76v42q0 20-20 20H48q-20 0-20-20z' }, 'white'),
    s('path', { d: 'M28 74h76v42q0 20-20 20H48q-20 0-20-20z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 86q16 0 14 14t-14 12', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M54 60q-6-10 0-18M74 60q-6-10 0-18', ...SW(3) }, 'sky', { stroke: true }),
    s('rect', { x: 124, y: 22, width: 14, height: 70, rx: 7 }, 'white'),
    s('rect', { x: 124, y: 22, width: 14, height: 70, rx: 7, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M131 86V58', ...SW(6) }, 'orange', { stroke: true, accent: true })
  ],
  transitorio: [
    s('path', { d: 'M40 22h80M40 138h80', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M48 26h64q0 34-28 54q28 20 28 54H48q0-34 28-54q-28-20-28-54z' }, 'sky'),
    s('path', { d: 'M60 48h40q-6 16-20 26q-14-10-20-26zM56 132q4-24 24-28q20 4 24 28z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 76v28', ...SW(3) }, 'yellow', { stroke: true })
  ],
  'tónica': [
    s('path', { d: 'M42 34h76l-8 102H50z' }, 'sky'),
    s('path', { d: 'M42 34h76l-8 102H50z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[64, 110], [88, 96], [74, 80], [96, 120], [70, 60]], 4) }, 'white'),
    s('circle', { cx: 108, cy: 36, r: 20 }, 'yellow', { accent: true }),
    s('circle', { cx: 108, cy: 36, r: 14 }, 'cream'),
    s('path', { d: 'M86 18l-12 70', ...SW(4) }, 'red', { stroke: true })
  ],
  unicornio: [
    s('path', { d: 'M92 44l20-32 2 38z' }, 'yellow', { accent: true }),
    s('path', { d: 'M54 140q-4-50 18-80q20-24 46-6q18 16 14 32q-2 10-14 10q-12-2-22-8q-8 26 4 52z' }, 'white'),
    s('path', { d: 'M54 140q-4-50 18-80q20-24 46-6q18 16 14 32q-2 10-14 10q-12-2-22-8q-8 26 4 52z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 58q-26 10-30 56q14-24 26-30q-14 30-10 52', ...SW(8) }, 'pink', { stroke: true }),
    s('circle', { cx: 104, cy: 66, r: 4 }, 'dark'),
    s('path', { d: 'M80 54l-4-14 12 6z' }, 'purple')
  ],
  vaciar: [
    s('path', { d: 'M30 46l58-14 14 52-46 14z' }, 'blue', { accent: true }),
    s('path', { d: 'M28 44l62-16', ...SW(5) }, 'navy', { stroke: true }),
    s('path', { d: 'M96 72q14 4 16 60', ...SW(10) }, 'sky', { stroke: true }),
    s('ellipse', { cx: 114, cy: 134, rx: 26, ry: 6 }, 'sky'),
    s('path', { d: 'M62 28q-20-14-40 4', ...SW(4) }, 'gray', { stroke: true })
  ],
  vagabundo: [
    ground(),
    ...person(64, 136, 'brown', { accent: true }),
    s('path', { d: 'M76 94l34-60', ...SW(5) }, 'tan', { stroke: true }),
    s('circle', { cx: 112, cy: 42, r: 16 }, 'red'),
    s('path', { d: dots([[106, 38], [118, 46]], 3) }, 'white'),
    s('path', { d: 'M50 56l28 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M106 136l14-4 12 4', ...SW(4) }, 'gray', { stroke: true })
  ],
  vascular: [
    s('path', { d: 'M40 20q10 40 0 60t10 60M40 60q30 10 30 40M40 100q-14 10-18 30', ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M110 20q-10 40 0 60t-10 60M110 60q-30 10-30 40M110 100q14 10 18 30', ...SW(8) }, 'blue', { stroke: true }),
    s('path', { d: dots([[46, 40], [36, 120], [60, 90]], 4) }, 'pink')
  ],
  vicepresidencia: [
    s('path', { d: 'M24 136V98q0-10 10-10h36q10 0 10 10v38zM86 136v-46q0-12 12-12h34q12 0 12 12v46z' }, 'brown'),
    ...person(110, 112, 'navy', { h: 34, w: 28, r: 12 }),
    ...person(52, 120, 'blue', { h: 30, w: 26, r: 11, accent: true }),
    s('path', { d: star(110, 30, 12) }, 'yellow'),
    s('path', { d: star(52, 50, 9) }, 'yellow')
  ],
  yarda: [
    s('rect', { x: 14, y: 26, width: 132, height: 108, rx: 8 }, 'green'),
    s('path', { d: 'M36 26v108M58 26v108M80 26v108M102 26v108M124 26v108', ...SW(3) }, 'white', { stroke: true }),
    s('ellipse', { cx: 80, cy: 80, rx: 24, ry: 14, transform: 'rotate(-30 80 80)' }, 'brown', { accent: true }),
    s('path', { d: 'M72 76l16 8M74 86l6-12M82 90l6-12', ...SW(2), transform: 'rotate(-30 80 80)' }, 'white', { stroke: true })
  ],
  abastecer: [
    ground(132),
    s('rect', { x: 18, y: 54, width: 82, height: 62, rx: 4 }, 'orange', { accent: true }),
    s('path', { d: 'M100 74h24l16 22v20h-40z' }, 'blue'),
    s('path', { d: 'M108 80h14l10 14h-24z' }, 'sky'),
    s('path', { d: dots([[40, 118], [118, 118]], 11) }, 'dark'),
    s('path', { d: rects([[30, 26, 22, 22], [56, 30, 20, 18]]) }, 'tan'),
    s('path', { d: 'M30 37h22M66 30v18', ...SW(2) }, 'brown', { stroke: true })
  ],
  abonado: [
    s('rect', { x: 18, y: 40, width: 124, height: 80, rx: 10 }, 'blue', { accent: true }),
    s('circle', { cx: 50, cy: 70, r: 12 }, 'skin'),
    s('path', { d: busts([50], 104, 28, 20) }, 'white'),
    s('path', { d: 'M80 66h44M80 82h30', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: star(118, 100, 10) }, 'yellow'),
    arrow('M112 26q20 0 26 18M130 36l8 10 8-10', 'orange', 4)
  ],
  acampar: [
    s('rect', { x: 14, y: 14, width: 132, height: 122, rx: 12 }, 'navy'),
    ground(),
    s('path', { d: 'M20 136l42-82 42 82z' }, 'orange', { accent: true }),
    s('path', { d: 'M62 136l-12-40h24z' }, 'dark'),
    s('path', { d: 'M110 136l24-6M110 130l24 6', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M122 128q-12-10 0-28q12 18 0 28z' }, 'yellow'),
    s('path', { d: star(120, 40, 6) + star(96, 26, 4) }, 'yellow')
  ],
  alternancia: [
    s('rect', { x: 26, y: 30, width: 40, height: 100, rx: 10 }, 'dark'),
    s('rect', { x: 94, y: 30, width: 40, height: 100, rx: 10 }, 'dark'),
    s('path', { d: dots([[46, 54], [114, 106]], 12) }, 'red', { accent: true }),
    s('path', { d: dots([[46, 106], [114, 54]], 12) }, 'gray'),
    s('path', { d: dots([[114, 106]], 12) }, 'green'),
    arrow('M70 62q10-10 20 0M70 98q10 10 20 0', 'orange', 4)
  ],
  ambiguo: [
    s('path', { d: 'M80 138V80', ...SW(16) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 84Q40 70 24 30M80 84q40-14 56-54', ...SW(16) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 138V80Q40 70 24 30M80 80q40-10 56-50', ...DASH(3) }, 'white', { stroke: true }),
    s('path', { d: 'M14 36l6-20 12 14zM146 36l-6-20-12 14z' }, 'orange', { accent: true }),
    ...person(80, 140, 'purple', { h: 30, w: 24, r: 10 })
  ],
  'aminoácido': [
    s('path', { d: 'M24 112L52 70l30 40 26-44 28 30', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 24, cy: 112, r: 14 }, 'red'),
    s('circle', { cx: 52, cy: 70, r: 14 }, 'blue'),
    s('circle', { cx: 82, cy: 110, r: 14 }, 'green', { accent: true }),
    s('circle', { cx: 108, cy: 66, r: 14 }, 'yellow'),
    s('circle', { cx: 136, cy: 96, r: 12 }, 'purple'),
    s('path', { d: dots([[52, 40], [108, 36]], 7) }, 'pink')
  ],
  anglo: [
    ground(140),
    s('rect', { x: 24, y: 34, width: 112, height: 92, rx: 8 }, 'red', { accent: true }),
    s('path', { d: rects([[32, 44, 22, 18], [60, 44, 22, 18], [88, 44, 22, 18], [116, 44, 14, 18], [60, 84, 22, 18], [88, 84, 22, 18], [116, 84, 14, 18]]) }, 'sky'),
    s('rect', { x: 32, y: 84, width: 20, height: 34, rx: 2 }, 'dark'),
    s('path', { d: 'M24 72h112', ...SW(3) }, 'cream', { stroke: true }),
    s('path', { d: dots([[46, 128], [114, 128]], 11) }, 'dark')
  ],
  apropiadamente: [
    s('rect', { x: 36, y: 60, width: 60, height: 76, rx: 16 }, 'navy', { accent: true }),
    s('path', { d: 'M56 60l10 14 10-14z' }, 'white'),
    s('path', { d: 'M66 72l-6 8 6 30 6-30z' }, 'red'),
    s('circle', { cx: 66, cy: 40, r: 16 }, 'skin'),
    s('circle', { cx: 120, cy: 54, r: 22 }, 'green'),
    s('path', { d: 'M110 54l8 8 14-16', ...SW(5) }, 'white', { stroke: true })
  ],
  'arcángel': [
    s('path', { d: 'M72 60q-40-30-56 4q10 4 4 14q10 0 6 12q18 0 46-6zM88 60q40-30 56 4q-10 4-4 14q-10 0-6 12q-18 0-46-6z' }, 'sky'),
    s('path', { d: 'M66 56h28l14 82H52z' }, 'white'),
    s('path', { d: 'M66 56h28l14 82H52z', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 40, r: 13 }, 'skin'),
    s('ellipse', { cx: 80, cy: 22, rx: 16, ry: 5, ...SW(4) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M108 100l26-60', ...SW(5) }, 'orange', { stroke: true })
  ],
  ardilla: [
    s('path', { d: 'M74 128q-50 6-54-40q-2-36 26-50q24-8 28 18q-26 0-18 30q8 24 26 30z' }, 'brown'),
    s('ellipse', { cx: 94, cy: 104, rx: 22, ry: 28 }, 'orange', { accent: true }),
    s('circle', { cx: 104, cy: 66, r: 18 }, 'orange'),
    s('path', { d: 'M100 52l4-14 8 12z' }, 'orange'),
    s('circle', { cx: 112, cy: 64, r: 3 }, 'dark'),
    s('path', { d: 'M104 96h14v14q0 8-7 8t-7-8z' }, 'tan'),
    s('path', { d: 'M102 96q9-8 18 0z' }, 'brown')
  ],
  asalariado: [
    ...person(54, 136, 'gray'),
    s('path', { d: 'M48 92l6 10 6-10', ...SW(4) }, 'navy', { stroke: true }),
    s('rect', { x: 72, y: 108, width: 36, height: 28, rx: 4 }, 'brown'),
    s('path', { d: 'M82 108v-6h16v6', ...SW(3) }, 'brown', { stroke: true }),
    s('rect', { x: 102, y: 34, width: 44, height: 30, rx: 3 }, 'green', { accent: true }),
    s('circle', { cx: 124, cy: 49, r: 8 }, 'mint')
  ],
  asequible: [
    s('path', { d: 'M28 60l40-36h60v60l-36 40z' }, 'yellow', { accent: true }),
    s('circle', { cx: 112, cy: 40, r: 7 }, 'white'),
    s('circle', { cx: 80, cy: 72, r: 16 }, 'orange'),
    s('circle', { cx: 80, cy: 72, r: 9 }, 'yellow'),
    arrow('M40 104v32M30 126l10 10 10-10', 'green', 6),
    s('path', { d: heart(124, 120, 12) }, 'red')
  ],
  'aversión': [
    s('ellipse', { cx: 120, cy: 120, rx: 22, ry: 14 }, 'green'),
    s('path', { d: 'M112 98q-6-8 0-14M126 98q-6-8 0-14', ...SW(3) }, 'green', { stroke: true }),
    s('circle', { cx: 48, cy: 56, r: 18 }, 'skin'),
    s('path', { d: 'M38 60l8 4M42 52l6 2', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 32, y: 78, width: 32, height: 58, rx: 10 }, 'purple', { accent: true }),
    s('path', { d: 'M62 90l22-16', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 80, y: 56, width: 16, height: 24, rx: 6 }, 'skin')
  ],
  barrer: [
    s('path', { d: 'M40 20l50 80', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 92l20-12 26 42-34 20z' }, 'yellow', { accent: true }),
    s('path', { d: 'M96 112l6 26M108 104l14 28', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: dots([[40, 128], [50, 134], [30, 136], [60, 124]], 3) }, 'gray'),
    s('path', { d: 'M24 112q10-6 20 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  'biotecnología': [
    s('path', { d: 'M48 20q64 30 0 60t0 60', ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M96 20q-64 30 0 60t0 60', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M56 34h32M60 66h24M60 94h24M56 126h32', ...SW(4) }, 'gray', { stroke: true }),
    ...gear(120, 116, 12, 8, 'orange'),
    s('circle', { cx: 120, cy: 116, r: 5 }, 'white')
  ],
  blindado: [
    ground(132),
    s('path', { d: 'M20 112V74l16-24h70l10 24h22v38z' }, 'green', { accent: true }),
    s('rect', { x: 48, y: 58, width: 40, height: 12, rx: 2 }, 'dark'),
    s('path', { d: dots([[28, 84], [28, 102], [134, 84], [134, 102], [60, 84], [92, 84]], 3) }, 'dark'),
    s('path', { d: 'M20 96h120', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[44, 116], [80, 116], [116, 116]], 13) }, 'dark')
  ],
  bofetada: [
    s('circle', { cx: 56, cy: 84, r: 42 }, 'skin'),
    s('path', { d: dots([[42, 76], [64, 76]], 4) }, 'dark'),
    s('path', { d: 'M44 104q10-6 20 0', ...SW(4) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 84, cy: 92, rx: 12, ry: 9 }, 'red', { accent: true }),
    s('path', { d: 'M102 64h30q8 0 8 8v32q0 10-10 10h-20q-8 0-8-8z' }, 'tan'),
    s('path', { d: 'M120 40l8-14M134 48l12-8M138 64h10', ...SW(4) }, 'orange', { stroke: true })
  ],
  brusco: [
    arrow('M18 112h54l8-70 10 78 6-30h40', 'red', 7),
    s('path', { d: 'M126 80l12 10-12 10', ...SW(7) }, 'red', { stroke: true, accent: true }),
    s('path', { d: burst(84, 32, 18, 9, 8) }, 'yellow')
  ],
  bufete: [
    s('rect', { x: 34, y: 18, width: 92, height: 120, rx: 4 }, 'brown', { accent: true }),
    s('rect', { x: 44, y: 28, width: 72, height: 108, rx: 2 }, 'tan'),
    s('rect', { x: 52, y: 42, width: 56, height: 40, rx: 4 }, 'yellow'),
    s('path', { d: 'M80 48v28M64 56h32M64 56l-6 12h12zM96 56l-6 12h12zM72 76h16', ...SW(3) }, 'brown', { stroke: true }),
    s('circle', { cx: 104, cy: 104, r: 5 }, 'yellow')
  ],
  'caimán': [
    s('path', { d: 'M16 96q30-8 60-6l60 2q8 2 8 8t-8 6l-56 2q-10 10-40 6q-20-2-24-18z' }, 'green', { accent: true }),
    s('path', { d: 'M40 108l-6 14M60 110l-4 14M86 110l-2 12', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M36 90l6-8 6 8 6-8 6 8 6-8 6 8' }, 'green'),
    s('circle', { cx: 96, cy: 86, r: 6 }, 'green'),
    s('circle', { cx: 97, cy: 85, r: 2.5 }, 'dark'),
    s('path', { d: 'M100 102l6 4 6-4 6 4 6-4 6 4', ...SW(2) }, 'white', { stroke: true })
  ],
  'canelón': [
    s('rect', { x: 18, y: 70, width: 124, height: 58, rx: 10 }, 'white'),
    s('rect', { x: 18, y: 70, width: 124, height: 58, rx: 10, ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[28, 76, 104, 12], [28, 92, 104, 12], [28, 108, 104, 12]]) }, 'cream'),
    s('path', { d: 'M28 82q10-10 20 0t20 0 20 0 20 0 20 0M28 114q10-10 20 0t20 0 20 0 20 0 20 0', ...SW(7) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M56 56q-6-10 0-18M80 56q-6-10 0-18M104 56q-6-10 0-18', ...SW(3) }, 'gray', { stroke: true })
  ],
  canoa: [
    s('path', { d: 'M14 112q66-12 132 0v22q0 12-12 12H26q-12 0-12-12z' }, 'sky'),
    s('path', { d: 'M18 92h124q-10 26-62 26T18 92z' }, 'red', { accent: true }),
    ...person(76, 98, 'blue', { h: 26, w: 22, r: 10 }),
    s('path', { d: 'M104 40l-34 86', ...SW(5) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 70, cy: 128, rx: 6, ry: 10, transform: 'rotate(22 70 128)' }, 'brown')
  ],
  cantautor: [
    ...person(56, 136, 'green'),
    s('path', { d: 'M52 100l50-24', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: ells([[54, 108, 18, 16], [70, 100, 12, 11]]) }, 'orange', { accent: true }),
    s('circle', { cx: 60, cy: 104, r: 5 }, 'dark'),
    s('path', { d: 'M62 50l6 2', ...SW(4) }, 'red', { stroke: true }),
    ...note(108, 40, 'purple')
  ],
  caramba: [
    s('circle', { cx: 80, cy: 86, r: 46 }, 'skin'),
    s('path', { d: dots([[64, 76], [96, 76]], 6) }, 'dark'),
    s('ellipse', { cx: 80, cy: 106, rx: 10, ry: 13 }, 'dark'),
    s('path', { d: 'M28 96q-6 20 14 30M132 96q6 20-14 30', ...SW(12) }, 'skin', { stroke: true }),
    s('path', { d: 'M60 60l10-6M100 60l-10-6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 30l10 10M80 18v14M120 30l-10 10', ...SW(5) }, 'orange', { stroke: true, accent: true })
  ],
  'centurión': [
    s('path', { d: 'M48 30q32-22 64 0v6H48z' }, 'red', { accent: true }),
    s('path', { d: 'M40 78q0-40 40-40t40 40v26h-14V82H54v22H40z' }, 'yellow'),
    s('circle', { cx: 80, cy: 90, r: 22 }, 'skin'),
    s('path', { d: 'M54 76h52', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: dots([[72, 90], [88, 90]], 3) }, 'dark'),
    s('rect', { x: 52, y: 116, width: 56, height: 26, rx: 10 }, 'red')
  ],
  cinema: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'dark'),
    s('rect', { x: 34, y: 30, width: 92, height: 56, rx: 3 }, 'sky', { accent: true }),
    s('path', { d: 'M14 20h30v82q-10-10-30-4zM146 20h-30v82q10-10 30-4z' }, 'red'),
    s('path', { d: busts([34, 60, 86, 112, 138], 146, 22, 30) }, 'black'),
    s('path', { d: dots([[34, 120], [60, 120], [86, 120], [112, 120]], 10) }, 'black'),
    s('path', { d: 'M54 72l18-22 14 14 10-8 20 16z' }, 'blue')
  ],
  circunferencia: [
    s('circle', { cx: 80, cy: 80, r: 54 }, 'mint'),
    s('path', { d: ring(80, 80, 54), ...SW(7) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M80 80h54', ...DASH(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 5 }, 'dark'),
    s('path', { d: 'M28 28q22-18 46-16M62 8l12 4-8 10', ...SW(4) }, 'orange', { stroke: true })
  ],
  cisterna: [
    s('path', { d: 'M44 100l-10 40M116 100l10 40M40 120h80', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 34, y: 36, width: 92, height: 66, rx: 10 }, 'blue', { accent: true }),
    s('path', { d: 'M34 30q46-18 92 0v10H34z' }, 'navy'),
    s('path', { d: 'M34 70h92', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: drop(80, 82, 8) }, 'white')
  ],
  cloaca: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'brown'),
    s('path', { d: 'M28 146V80a52 52 0 0 1 104 0v66z' }, 'dark'),
    s('path', { d: 'M28 146V80a52 52 0 0 1 104 0v66', ...DASH(6, '10 6') }, 'tan', { stroke: true }),
    s('path', { d: 'M32 120q24-8 48 0t48 0v26H32z' }, 'green', { accent: true }),
    s('path', { d: 'M50 112q10-6 20 0M92 112q10-6 20 0', ...SW(3) }, 'mint', { stroke: true })
  ],
  'constelación': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('path', { d: 'M30 112L56 84l28 10 20-30 26-30M84 94l22 30', ...SW(2) }, 'sky', { stroke: true }),
    s('path', { d: star(30, 112, 8) + star(56, 84, 7) + star(84, 94, 9) + star(104, 64, 8) + star(130, 34, 9) + star(106, 124, 7) }, 'yellow', { accent: true }),
    s('path', { d: dots([[40, 40], [70, 30], [128, 96], [60, 132]], 2) }, 'white')
  ],
  'contemplación': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'cream'),
    s('circle', { cx: 80, cy: 64, r: 30 }, 'orange'),
    s('path', { d: 'M14 82h132v52q0 12-12 12H26q-12 0-12-12z' }, 'sky'),
    s('path', { d: 'M48 136q0-14 32-14t32 14z' }, 'purple'),
    s('rect', { x: 66, y: 92, width: 28, height: 36, rx: 10 }, 'purple', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'skin')
  ],
  copiloto: [
    s('path', { d: 'M14 100q0-70 66-70t66 70v34q0 12-12 12H26q-12 0-12-12z' }, 'gray'),
    s('path', { d: 'M28 92q4-46 52-50q48 4 52 50z' }, 'sky'),
    s('path', { d: 'M80 42v50', ...SW(5) }, 'gray', { stroke: true }),
    ...person(54, 104, 'navy', { h: 22, w: 26, r: 11 }),
    ...person(106, 104, 'blue', { h: 22, w: 26, r: 11, accent: true }),
    s('path', { d: 'M42 58h24M94 58h24', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 26, y: 108, width: 108, height: 26, rx: 4 }, 'dark')
  ],
  cortijo: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 120h132v14q0 12-12 12H26q-12 0-12-12z' }, 'tan'),
    s('path', { d: 'M24 72l36-22 36 22zM88 84l22-14 22 14z' }, 'red'),
    s('path', { d: 'M28 72h64v50H28zM92 84h36v38H92z' }, 'white', { accent: true }),
    s('path', { d: 'M52 96h16v26H52zM104 96h12v12h-12z' }, 'brown'),
    s('circle', { cx: 120, cy: 34, r: 12 }, 'yellow'),
    s('path', { d: 'M28 72h64v50H28zM92 84h36v38H92z', ...SW(2) }, 'gray', { stroke: true })
  ],
  'cósmico': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'black'),
    s('circle', { cx: 80, cy: 80, r: 30 }, 'purple', { accent: true }),
    s('ellipse', { cx: 80, cy: 80, rx: 56, ry: 14, transform: 'rotate(-20 80 80)', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: sparkle(32, 34, 8) + sparkle(126, 126, 9) + sparkle(130, 36, 5) }, 'white'),
    s('path', { d: dots([[40, 120], [110, 26], [24, 80]], 2) }, 'yellow')
  ],
  'dañino': [
    s('path', { d: 'M80 18l64 112H16z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 18l64 112H16z', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 104q-24-18-14-40q4 10 10 8q-6-14 6-26q-2 18 12 26q12 16-2 32z' }, 'red'),
    s('path', { d: 'M80 104q-8-8-4-18q6 6 10 2q4 10-6 16z' }, 'orange')
  ],
  defectuoso: [
    s('circle', { cx: 80, cy: 62, r: 36 }, 'cream'),
    s('path', { d: 'M62 96h36v18H62z' }, 'gray'),
    s('path', { d: 'M70 118h20v10H70z' }, 'dark'),
    s('path', { d: 'M78 28l-8 22 14 8-12 24 10 12', ...SW(4) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: burst(126, 40, 14, 6, 6) + burst(32, 92, 10, 5, 6) }, 'orange'),
    s('path', { d: ring(80, 62, 36), ...SW(3) }, 'gray', { stroke: true })
  ],
  derogar: [
    s('path', { d: 'M26 24h50l-8 18 10 16-10 18 10 16-8 18 8 20H26z' }, 'white'),
    s('path', { d: 'M88 30h48v114H96l6-20-10-16 8-18-8-16 8-18z' }, 'white'),
    s('path', { d: 'M26 24h50l-8 18 10 16-10 18 10 16-8 18 8 20H26zM88 30h48v114H96l6-20-10-16 8-18-8-16 8-18z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 46h28M36 64h30M100 52h28M104 70h24', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 52, cy: 118, r: 12 }, 'red', { accent: true }),
    s('circle', { cx: 118, cy: 122, r: 12 }, 'red')
  ],
  desacreditar: [
    s('path', { d: 'M56 22h20l12 30-14 6zM104 22H84l-12 30 14 6z' }, 'blue'),
    s('circle', { cx: 80, cy: 82, r: 32 }, 'yellow', { accent: true }),
    s('path', { d: star(80, 82, 18) }, 'orange'),
    s('path', { d: 'M74 52l8 18-8 12 10 14-6 18', ...SW(4) }, 'dark', { stroke: true }),
    arrow('M128 70v58M118 118l10 10 10-10', 'red', 6)
  ],
  desleal: [
    ...person(46, 136, 'blue'),
    ...person(112, 136, 'red', { accent: true }),
    s('path', { d: 'M60 100h40', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M126 110l12-6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M136 106l8-30 4 2-4 30z' }, 'gray'),
    s('path', { d: 'M132 106h12', ...SW(4) }, 'dark', { stroke: true })
  ],
  despreciar: [
    s('path', { d: 'M88 92h50l-6 46H94z' }, 'gray'),
    s('rect', { x: 84, y: 84, width: 58, height: 10, rx: 3 }, 'dark'),
    s('circle', { cx: 112, cy: 50, r: 14 }, 'yellow', { accent: true }),
    s('path', { d: 'M108 42l6 8-4 8', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M18 68h30l10 4v10H18z' }, 'skin'),
    s('path', { d: 'M62 60l26-10M64 76l20 2', ...SW(4) }, 'orange', { stroke: true })
  ],
  desuso: [
    s('path', { d: 'M28 92q0-22 52-22t52 22l-8 40H36z' }, 'gray', { accent: true }),
    s('path', { d: 'M30 74q-6-32 50-32t50 32l-18 8q0-16-32-16t-32 16z' }, 'dark'),
    s('circle', { cx: 80, cy: 104, r: 16 }, 'white'),
    s('path', { d: 'M14 14l34 34M14 34l26 4M34 14l4 26M14 24q10 0 20-10M14 44q22-4 30-30', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: dots([[60, 126], [104, 128], [116, 90]], 3) }, 'tan')
  ],
  diestro: [
    s('path', { d: 'M48 140V90l-12-30q-2-8 6-10t10 6l8 20V36q0-8 7-8t7 8v34-44q0-8 7-8t7 8v44-36q0-8 7-8t7 8v40-26q0-8 7-8t7 8v56q0 16-12 26v18z' }, 'skin', { accent: true }),
    arrow('M114 112h32M136 102l10 10-10 10', 'green', 6),
    s('path', { d: sparkle(124, 38, 12) }, 'yellow')
  ],
  elfo: [
    s('path', { d: 'M52 56L84 8l24 48z' }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 28 }, 'skin'),
    s('path', { d: 'M54 76l-26-14 22 26zM106 76l26-14-22 26z' }, 'skin'),
    s('path', { d: 'M48 56h64', ...SW(8) }, 'red', { stroke: true }),
    s('path', { d: dots([[70, 80], [90, 80]], 3.5) }, 'dark'),
    s('path', { d: 'M70 94q10 8 20 0', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 58, y: 108, width: 44, height: 36, rx: 12 }, 'green')
  ],
  enorgullecer: [
    s('path', { d: 'M60 72l20 20 20-20', ...SW(8) }, 'blue', { stroke: true }),
    ...person(80, 138, 'green', { h: 50, w: 36, r: 14 }),
    s('circle', { cx: 80, cy: 110, r: 12 }, 'yellow', { accent: true }),
    s('path', { d: sparkle(30, 50, 10) + sparkle(130, 50, 10) }, 'yellow'),
    s('path', { d: 'M62 96l-18-24M98 96l18-24', ...SW(7) }, 'skin', { stroke: true })
  ],
  enunciado: [
    ...paper(28, 16, 92, 124),
    s('rect', { x: 38, y: 28, width: 72, height: 30, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M44 38h58M44 48h40M40 76h20M40 96h20M40 116h20', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M136 70l-30 60-6 8 2-10 30-60z' }, 'orange')
  ],
  euskera: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 146V110l36-40 30 30 30-44 36 46v44z' }, 'green'),
    s('path', { d: bubble(50, 22, 76, 44) }, 'white'),
    s('path', { d: bubble(50, 22, 76, 44), ...SW(3) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M64 40h48M64 52h30', ...SW(4) }, 'red', { stroke: true })
  ],
  excitante: [
    s('path', { d: 'M14 128q30 0 44-40q14-50 40-50t28 26q0 24-26 24t-24-30q6-34 44-34q20 0 26 20', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 128v12M58 92v48M126 64v76', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 40, y: 92, width: 26, height: 16, rx: 4, transform: 'rotate(-60 53 100)' }, 'red', { accent: true }),
    s('path', { d: 'M20 30l10 10M40 20l4 12M138 102l-10 6', ...SW(4) }, 'orange', { stroke: true })
  ],
  extensamente: [
    s('rect', { x: 14, y: 50, width: 132, height: 60 }, 'cream'),
    s('path', { d: 'M14 50h132v60H14z', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M28 66h104M28 80h104M28 94h80', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 132, y: 42, width: 16, height: 76, rx: 8 }, 'brown', { accent: true }),
    s('rect', { x: 12, y: 42, width: 16, height: 76, rx: 8 }, 'brown'),
    arrow('M40 128h80M110 120l10 8-10 8M50 120l-10 8 10 8', 'orange', 4)
  ],
  fobia: [
    s('path', { d: 'M110 14v44', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 56l-12-8M96 64h-14M96 72l-12 8M124 56l12-8M124 64h14M124 72l12 8', ...SW(3) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 110, cy: 66, rx: 12, ry: 14 }, 'dark', { accent: true }),
    ...face(52, 104, 32, 'sky', 'frown'),
    s('path', { d: 'M18 86l-4 8M18 112l-6 4M88 100l6 4', ...SW(3) }, 'gray', { stroke: true })
  ],
  forzoso: [
    ground(),
    ...lean(100, 136, 18, 'blue', { h: 40, w: 26, r: 11 }),
    s('path', { d: 'M24 90h40l10-6h14q6 0 6 6t-6 6h-6l2 12h-46z' }, 'skin', { accent: true }),
    s('path', { d: 'M14 90h12v24H14z' }, 'red'),
    s('path', { d: 'M116 60l14-6M118 76l16 0', ...SW(4) }, 'orange', { stroke: true })
  ],
  gemido: [
    s('circle', { cx: 62, cy: 80, r: 42 }, 'skin'),
    s('path', { d: 'M44 72l10 4M80 72l-10 4', ...SW(4) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 62, cy: 100, rx: 8, ry: 6 }, 'dark'),
    s('path', { d: drop(44, 88, 4) }, 'sky'),
    s('path', { d: 'M112 70q6 6 0 12t0 12M126 62q8 10 0 20t0 20M140 56q10 14 0 28t0 28', ...SW(4) }, 'purple', { stroke: true, accent: true })
  ],
  'geográficamente': [
    s('path', { d: 'M18 40l40-14 44 14 40-14v94l-40 14-44-14-40 14z' }, 'mint'),
    s('path', { d: 'M58 26v94M102 40v94', ...SW(2) }, 'green', { stroke: true }),
    s('path', { d: 'M30 70q20-20 40 0t40-10 26 10', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M80 104q-20-22-20-38a20 20 0 0 1 40 0q0 16-20 38z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 66, r: 7 }, 'white')
  ],
  gratificante: [
    s('path', { d: 'M24 120q20-4 36 6h36q8 0 8 8t-8 8H58l-34-6z' }, 'skin'),
    s('path', { d: 'M104 120l30-22q8-4 10 4l-26 30' }, 'skin'),
    s('path', { d: heart(76, 80, 32) }, 'red', { accent: true }),
    s('path', { d: sparkle(32, 40, 10) + sparkle(126, 36, 10) + sparkle(80, 22, 6) }, 'yellow')
  ],
  hospedaje: [
    s('rect', { x: 16, y: 54, width: 16, height: 82, rx: 4 }, 'brown'),
    s('rect', { x: 24, y: 96, width: 120, height: 26, rx: 4 }, 'brown'),
    s('rect', { x: 32, y: 80, width: 112, height: 22, rx: 6 }, 'blue', { accent: true }),
    s('rect', { x: 36, y: 70, width: 30, height: 16, rx: 8 }, 'white'),
    s('path', { d: 'M136 122v14M24 122v14', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: ring(104, 34, 8) + 'M112 34h22M126 34v8', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M90 36l-8 22h16z' }, 'red')
  ],
  idiotez: [
    s('circle', { cx: 80, cy: 82, r: 50 }, 'yellow', { accent: true }),
    s('path', { d: spiral(56, 72) + spiral(92, 72), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 104q22 16 44 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 108q-2 14 8 14t8-14z' }, 'pink'),
    s('path', { d: 'M34 30l8 8M126 30l-8 8M80 16v12', ...SW(4) }, 'orange', { stroke: true })
  ],
  imperdonable: [
    ...person(40, 136, 'blue'),
    s('path', { d: 'M28 104h24', ...SW(8) }, 'skin', { stroke: true }),
    ...person(120, 136, 'gray'),
    s('path', { d: 'M108 104h24', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M66 40l28 28M94 40L66 68', ...SW(9) }, 'red', { stroke: true, accent: true })
  ],
  inmensamente: [
    ground(),
    s('path', { d: 'M14 136l60-110 72 110z' }, 'gray'),
    s('path', { d: 'M60 52l14-26 16 24-10-4-6 8-6-6z' }, 'white', { accent: true }),
    ...person(130, 136, 'red', { h: 12, w: 8, r: 4 }),
    arrow('M138 110V30M130 40l8-10 8 10', 'orange', 3)
  ],
  innovar: [
    s('path', { d: 'M80 16q22 18 22 56v32H58V72q0-38 22-56z' }, 'white'),
    s('path', { d: 'M80 16q22 18 22 56v32H58V72q0-38 22-56z', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 60, r: 10 }, 'sky'),
    s('path', { d: 'M58 80l-16 26h16zM102 80l16 26h-16z' }, 'red', { accent: true }),
    s('path', { d: 'M64 106q16 50 32 0z' }, 'orange'),
    s('path', { d: 'M72 106q8 26 16 0z' }, 'yellow')
  ],
  insinuar: [
    ...person(54, 136, 'purple'),
    ...person(108, 136, 'green', { accent: true }),
    s('path', { d: 'M66 72l12-6v-12', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M76 58q10 2 16 10', ...DASH(3, '3 4') }, 'gray', { stroke: true }),
    s('path', { d: dots([[60, 30], [70, 24], [80, 20]], 3) }, 'gray'),
    s('ellipse', { cx: 92, cy: 70, rx: 4, ry: 6 }, 'skin')
  ],
  'interrogación': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'dark'),
    s('path', { d: 'M80 14v18', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 46q0-14 20-14t20 14z' }, 'gray'),
    s('path', { d: 'M60 46h40l30 70H30z' }, 'yellow', { accent: true, opacity: 0.6 }),
    ...person(80, 124, 'orange', { h: 34, w: 28, r: 12 }),
    s('rect', { x: 30, y: 124, width: 100, height: 12, rx: 3 }, 'brown')
  ],
  intolerante: [
    s('path', { d: 'M56 30h48l-6 104H62z' }, 'white'),
    s('path', { d: 'M56 30h48l-6 104H62z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 60h40l-4 72H64z' }, 'cream'),
    s('circle', { cx: 80, cy: 80, r: 58, ...SW(9) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M39 39l82 82', ...SW(9) }, 'red', { stroke: true })
  ],
  'irrupción': [
    s('rect', { x: 20, y: 20, width: 60, height: 116 }, 'dark'),
    s('path', { d: 'M20 20l-6 120 30-10V30z' }, 'brown'),
    ...lean(66, 136, 16, 'red', { accent: true }),
    s('path', { d: burst(110, 70, 30, 14, 9) }, 'yellow'),
    s('path', { d: 'M100 120l20-8M110 100l26-2M108 136l26 0', ...SW(4) }, 'orange', { stroke: true })
  ],
  labial: [
    s('rect', { x: 54, y: 88, width: 52, height: 52, rx: 4 }, 'dark'),
    s('rect', { x: 60, y: 66, width: 40, height: 24, rx: 2 }, 'yellow'),
    s('path', { d: 'M66 66V36q0-12 14-18q14 6 14 18v30z' }, 'red', { accent: true }),
    s('path', { d: 'M66 36l28-14', ...SW(3) }, 'pink', { stroke: true })
  ],
  'lavandería': [
    s('rect', { x: 14, y: 30, width: 62, height: 106, rx: 8 }, 'white'),
    s('rect', { x: 84, y: 30, width: 62, height: 106, rx: 8 }, 'white'),
    s('path', { d: 'M14 52h62M84 52h62', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 14, y: 30, width: 62, height: 106, rx: 8, ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 84, y: 30, width: 62, height: 106, rx: 8, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[45, 94], [115, 94]], 20) }, 'sky', { accent: true }),
    s('path', { d: 'M30 100q15-10 30 0M100 100q15-10 30 0', ...SW(4) }, 'blue', { stroke: true })
  ],
  losa: [
    s('path', { d: 'M50 22h60l36 116H14z' }, 'gray', { accent: true }),
    s('path', { d: 'M40 54h80M28 92h104M80 22v32M62 54l-6 38M98 54l6 38M48 92l-8 46M112 92l8 46M80 92v46', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M14 138h132', ...SW(4) }, 'dark', { stroke: true })
  ],
  'lápida': [
    ground(),
    s('path', { d: 'M44 136V62q0-36 36-36t36 36v74z' }, 'gray', { accent: true }),
    s('path', { d: 'M80 48v40M66 60h28', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M60 104h40', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: dots([[36, 128], [124, 128]], 7) }, 'pink'),
    s('path', { d: 'M36 136v-8M124 136v-8', ...SW(3) }, 'green', { stroke: true })
  ],
  'maletín': [
    s('path', { d: 'M62 50v-12h36v12', ...SW(7) }, 'dark', { stroke: true }),
    s('rect', { x: 22, y: 50, width: 116, height: 84, rx: 8 }, 'brown', { accent: true }),
    s('path', { d: 'M22 82h116', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: rects([[46, 74, 12, 16], [102, 74, 12, 16]]) }, 'yellow')
  ],
  'malversación': [
    s('path', { d: 'M18 56l38-26 38 26z' }, 'gray'),
    s('path', { d: 'M24 60h64v58H24z' }, 'cream'),
    s('path', { d: 'M34 66v46M50 66v46M62 66v46M78 66v46', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M16 122h80', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 96q0-20 20-20t20 20v30q0 12-20 12t-20-12z' }, 'dark', { accent: true }),
    arrow('M88 48q26-10 32 26', 'red', 4),
    s('path', { d: dots([[100, 40], [116, 58]], 7) }, 'yellow')
  ],
};
