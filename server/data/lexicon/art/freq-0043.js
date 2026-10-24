// Illustration specs for words still undrawn in batches 0040–0043 (see server/scripts/lexicon/art.js)
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
  restar: [
    s('rect', { x: 40, y: 26, width: 80, height: 16, rx: 6 }, 'red', { accent: true }),
    s('path', { d: dots([[30, 76], [58, 76], [86, 76]], 12) }, 'green'),
    s('circle', { cx: 122, cy: 76, r: 12, ...DASH(3, '4 4') }, 'gray', { stroke: true }),
    arrow('M122 94v14M114 102l8 8 8-8', 'orange', 4),
    s('circle', { cx: 122, cy: 126, r: 12 }, 'green')
  ],
  picar: [
    s('rect', { x: 14, y: 100, width: 132, height: 36, rx: 18 }, 'skin'),
    s('circle', { cx: 74, cy: 104, r: 9 }, 'pink'),
    s('path', { d: 'M48 92l-6-8M58 88l-2-10', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: ells([[88, 46, 8, 15], [108, 46, 8, 15]]) }, 'sky'),
    s('path', { d: 'M84 76l-8 18M92 68l-8 20M104 68l6 20M110 62l14 18', ...SW(3) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 100, cy: 62, rx: 18, ry: 7, transform: 'rotate(-35 100 62)' }, 'dark', { accent: true }),
    s('circle', { cx: 86, cy: 74, r: 6 }, 'dark')
  ],
  reja: [
    s('rect', { x: 22, y: 20, width: 116, height: 120, rx: 6 }, 'dark'),
    s('rect', { x: 34, y: 32, width: 92, height: 96, rx: 4 }, 'navy', { accent: true }),
    s('path', { d: busts([80], 128, 56, 34) }, 'orange'),
    s('circle', { cx: 80, cy: 76, r: 20 }, 'skin'),
    s('path', { d: dots([[72, 74], [88, 74]], 3) }, 'dark'),
    s('path', { d: 'M50 32v96M65 32v96M80 32v96M95 32v96M110 32v96M34 52h92M34 108h92', ...SW(5) }, 'gray', { stroke: true })
  ],
  rentabilidad: [
    s('path', { d: 'M24 24v112h116', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: rects([[36, 104, 20, 32], [64, 84, 20, 52], [92, 62, 20, 74]]) }, 'green', { accent: true }),
    arrow('M34 90L68 66l22 6 32-36M106 36h16v16', 'orange', 5),
    s('circle', { cx: 130, cy: 110, r: 14 }, 'yellow'),
    s('circle', { cx: 130, cy: 110, r: 8, ...SW(3) }, 'orange', { stroke: true })
  ],
  rentable: [
    ground(),
    s('rect', { x: 26, y: 76, width: 62, height: 60 }, 'tan'),
    s('path', { d: 'M18 80l39-40 39 40z' }, 'red'),
    s('rect', { x: 48, y: 104, width: 18, height: 32 }, 'brown'),
    s('path', { d: ells([[120, 126, 20, 7], [120, 114, 20, 7], [120, 102, 20, 7], [120, 90, 20, 7]]) }, 'yellow', { accent: true }),
    s('path', { d: ells([[120, 126, 20, 7], [120, 114, 20, 7], [120, 102, 20, 7], [120, 90, 20, 7]]), ...SW(2) }, 'orange', { stroke: true }),
    arrow('M120 70V40M110 50l10-10 10 10', 'green', 5)
  ],
  repartir: [
    s('path', { d: [0, 1, 2, 3, 4, 5].map(i => { const a = i * 60 - 90, m = (a + 30) * Math.PI / 180; return wedge(+(80 + 5 * Math.cos(m)).toFixed(1), +(52 + 5 * Math.sin(m)).toFixed(1), 36, a, a + 60); }).join('') }, 'orange'),
    s('path', { d: [0, 1, 2, 3, 4, 5].map(i => { const a = i * 60 - 90, m = (a + 30) * Math.PI / 180; return wedge(+(80 + 5 * Math.cos(m)).toFixed(1), +(52 + 5 * Math.sin(m)).toFixed(1), 29, a, a + 60); }).join('') }, 'yellow', { accent: true }),
    s('path', { d: dots(around(80, 52, 18, 6, -60), 4) }, 'red'),
    arrow('M48 88l-10 10M112 88l10 10', 'gray', 4),
    s('path', { d: busts([30, 80, 130], 146, 26, 24) }, 'blue'),
    s('path', { d: dots([[30, 110], [80, 110], [130, 110]], 9) }, 'skin')
  ],
  resentimiento: [
    ...face(80, 100, 40, 'skin', 'frown'),
    s('path', { d: 'M52 82l20 6M108 82l-20 6', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: ells([[64, 34, 18, 13], [86, 28, 20, 15], [106, 36, 16, 12]]) }, 'dark', { accent: true }),
    s('path', { d: 'M88 46l-6 8h8l-6 8', ...SW(4) }, 'yellow', { stroke: true })
  ],
  retroceso: [
    ground(),
    s('path', { d: poly([[18, 48], [46, 22], [46, 38], [96, 38], [96, 58], [46, 58], [46, 74]]) }, 'red', { accent: true }),
    s('path', { d: ells([[40, 130, 7, 4], [64, 124, 7, 4], [84, 130, 7, 4]]) }, 'brown'),
    ...person(112, 136, 'blue'),
    s('path', { d: 'M132 96h12M132 108h12M132 120h10', ...SW(3) }, 'gray', { stroke: true })
  ],
  'rotación': [
    s('circle', { cx: 80, cy: 80, r: 24 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 8 }, 'white'),
    arrow('M80 30a50 50 0 0 1 50 50M120 70l10 10 10-10'),
    arrow('M80 130a50 50 0 0 1-50-50M20 90l10-10 10 10')
  ],
  solidario: [
    ground(),
    ...person(36, 136, 'red'),
    ...person(80, 136, 'blue', { accent: true }),
    ...person(124, 136, 'green'),
    s('path', { d: 'M51 104h14M95 104h14', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 44, 13) }, 'pink')
  ],
  sucesivamente: [
    ground(),
    ...[[22, 62], [46, 46], [70, 30], [94, 14], [118, 0]].map(([x, a], i) => s('rect', { x, y: 92, width: 12, height: 44, rx: 2, transform: `rotate(${a} ${x + 12} 136)` }, i === 4 ? 'red' : 'dark', i === 4 ? { accent: true } : {})),
    arrow('M30 40h96M116 30l10 10-10 10', 'orange', 5)
  ],
  televisor: [
    s('path', { d: 'M64 40L48 18M96 40l16-22', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 118l-8 18M120 118l8 18', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 18, y: 40, width: 124, height: 82, rx: 10 }, 'dark'),
    s('rect', { x: 28, y: 50, width: 84, height: 62, rx: 6 }, 'sky', { accent: true }),
    s('path', { d: 'M34 112l22-28 18 18 14-12 22 22z' }, 'green'),
    s('circle', { cx: 92, cy: 68, r: 7 }, 'yellow'),
    s('path', { d: dots([[127, 62], [127, 82]], 6) }, 'gray')
  ],
  'trío': [
    ...person(34, 136, 'red', { h: 40, w: 26, r: 11 }),
    ...person(80, 136, 'blue', { h: 50, w: 28, r: 12, accent: true }),
    ...person(126, 136, 'yellow', { h: 40, w: 26, r: 11 }),
    ...note(52, 44, 'purple'),
    ...note(98, 38, 'purple')
  ],
  'vinculación': [
    s('ellipse', { cx: 56, cy: 80, rx: 34, ry: 18, ...SW(12), transform: 'rotate(-20 80 80)' }, 'gray', { stroke: true }),
    s('ellipse', { cx: 104, cy: 80, rx: 34, ry: 18, ...SW(12), transform: 'rotate(-20 80 80)' }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M73 64.4A34 18 0 0 1 90 80', ...SW(12), transform: 'rotate(-20 80 80)' }, 'gray', { stroke: true })
  ],
  'adhesión': [
    s('path', { d: 'M44 58l8-28h4l8 28z' }, 'orange'),
    s('rect', { x: 30, y: 58, width: 48, height: 78, rx: 10 }, 'white'),
    outline({ x: 30, y: 58, width: 48, height: 78, rx: 10 }),
    s('rect', { x: 30, y: 82, width: 48, height: 28 }, 'orange', { accent: true }),
    s('rect', { x: 92, y: 88, width: 48, height: 24, rx: 3 }, 'blue'),
    s('rect', { x: 92, y: 112, width: 48, height: 24, rx: 3 }, 'yellow'),
    s('path', { d: 'M92 112q6 6 12 0t12 0 12 0 12 0', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: drop(110, 70, 6) }, 'sky')
  ],
  adicto: [
    s('rect', { x: 40, y: 100, width: 60, height: 46, rx: 18 }, 'purple'),
    s('circle', { cx: 70, cy: 68, r: 28 }, 'skin'),
    s('path', { d: spiral(56, 66) + spiral(78, 66), ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 100, y: 60, width: 34, height: 58, rx: 6 }, 'dark'),
    s('rect', { x: 105, y: 67, width: 24, height: 40, rx: 2 }, 'sky', { accent: true }),
    s('ellipse', { cx: 104, cy: 114, rx: 11, ry: 8 }, 'skin'),
    s('path', { d: 'M140 56l6-6M142 76h6M140 96l6 6', ...SW(3) }, 'orange', { stroke: true })
  ],
  apetito: [
    s('circle', { cx: 70, cy: 82, r: 50 }, 'yellow', { accent: true }),
    s('path', { d: 'M46 66q6-8 12 0M82 66q6-8 12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M42 92q28 30 56 0z' }, 'dark'),
    s('ellipse', { cx: 80, cy: 104, rx: 11, ry: 7 }, 'pink'),
    s('path', { d: drop(44, 110, 5) }, 'sky'),
    s('path', { d: 'M134 34v100M126 34v16q8 10 16 0V34', ...SW(4) }, 'gray', { stroke: true })
  ],
  artesano: [
    s('path', { d: 'M48 136l8-20h48l8 20z' }, 'gray'),
    s('ellipse', { cx: 80, cy: 114, rx: 46, ry: 8 }, 'dark'),
    s('path', { d: 'M62 110q-16-26 4-44q-4-8 0-16h28q4 8 0 16q20 18 4 44z' }, 'brown', { accent: true }),
    s('path', { d: 'M24 136L48 84M136 136L112 84', ...SW(12) }, 'skin', { stroke: true }),
    s('path', { d: ells([[54, 80, 9, 13], [106, 80, 9, 13]]) }, 'skin'),
    s('path', { d: 'M40 26q-8 8 0 16M120 26q8 8 0 16M68 30q12-8 24 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  'asesoría': [
    s('path', { d: busts([40], 116, 34, 34) }, 'navy'),
    s('path', { d: busts([120], 116, 34, 34) }, 'green'),
    s('path', { d: dots([[40, 70], [120, 70]], 13) }, 'skin'),
    s('rect', { x: 14, y: 116, width: 132, height: 12, rx: 3 }, 'brown'),
    s('path', { d: bubble(56, 16, 48, 40) }, 'white'),
    s('path', { d: bubble(56, 16, 48, 40), ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 32, r: 9 }, 'yellow', { accent: true }),
    s('path', { d: 'M76 45h8', ...SW(4) }, 'gray', { stroke: true })
  ],
  asombroso: [
    s('circle', { cx: 80, cy: 86, r: 46 }, 'yellow', { accent: true }),
    s('path', { d: ells([[62, 76, 8, 11], [98, 76, 8, 11]]) }, 'dark'),
    s('path', { d: 'M50 56q10-8 22-2M88 54q12-6 22 2', ...SW(4) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 80, cy: 110, rx: 10, ry: 13 }, 'dark'),
    s('path', { d: sparkle(26, 32, 12) + sparkle(134, 34, 10) + sparkle(138, 126, 9) }, 'orange')
  ],
  atletismo: [
    s('rect', { x: 14, y: 112, width: 132, height: 30, rx: 4 }, 'orange'),
    s('path', { d: 'M14 122h132M14 132h132', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M76 82l18 12-4 18M74 82l-16 14-14-4', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 70, y: 48, width: 22, height: 36, rx: 8, transform: 'rotate(20 81 66)' }, 'blue', { accent: true }),
    s('circle', { cx: 89, cy: 36, r: 11 }, 'skin'),
    s('path', { d: 'M88 56l14 12 12-8M84 56l-14 10-4 12', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M24 50h20M18 64h20M24 78h16', ...SW(3) }, 'gray', { stroke: true })
  ],
  auricular: [
    s('path', { d: 'M34 96V80a46 46 0 0 1 92 0v16', ...SW(10) }, 'dark', { stroke: true }),
    s('rect', { x: 20, y: 84, width: 30, height: 48, rx: 12 }, 'red', { accent: true }),
    s('rect', { x: 110, y: 84, width: 30, height: 48, rx: 12 }, 'red'),
    s('path', { d: rects([[46, 94, 8, 28], [106, 94, 8, 28]]) }, 'dark'),
    ...note(76, 110, 'blue')
  ],
  bandeja: [
    s('ellipse', { cx: 80, cy: 118, rx: 22, ry: 10 }, 'skin'),
    s('rect', { x: 16, y: 100, width: 128, height: 10, rx: 5 }, 'gray'),
    s('path', { d: 'M34 70h30v20a10 10 0 0 1-10 10h-10a10 10 0 0 1-10-10z' }, 'red', { accent: true }),
    s('path', { d: 'M90 70h30v20a10 10 0 0 1-10 10h-10a10 10 0 0 1-10-10z' }, 'blue'),
    s('path', { d: 'M64 76q10 0 10 8t-10 8M120 76q10 0 10 8t-10 8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 60q-4-8 2-14M54 60q-4-8 2-14M100 60q-4-8 2-14M110 60q-4-8 2-14', ...SW(3) }, 'gray', { stroke: true })
  ],
  'cabaña': [
    ground(),
    s('rect', { x: 82, y: 44, width: 12, height: 22 }, 'dark'),
    s('rect', { x: 24, y: 76, width: 80, height: 60 }, 'brown', { accent: true }),
    s('path', { d: 'M24 92h80M24 106h80M24 120h80', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M16 80l48-42 48 42z' }, 'red'),
    s('rect', { x: 55, y: 104, width: 20, height: 32 }, 'tan'),
    s('path', { d: 'M130 104v32', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M130 40l16 66h-32z' }, 'green')
  ],
  'caloría': [
    s('path', { d: 'M80 14Q112 40 104 66Q116 60 114 46Q136 76 114 96H46Q26 72 50 50Q52 62 60 66Q56 38 80 14Z' }, 'orange', { accent: true }),
    s('path', { d: 'M80 52Q100 72 92 92H68Q60 72 80 52Z' }, 'yellow'),
    s('circle', { cx: 80, cy: 112, r: 28 }, 'brown'),
    s('circle', { cx: 80, cy: 110, r: 22 }, 'pink'),
    s('circle', { cx: 80, cy: 110, r: 8 }, 'white'),
    s('path', { d: 'M64 104l5-3M92 100l4 4M70 122l5-2M94 116l-2 5', ...SW(3) }, 'yellow', { stroke: true })
  ],
  capricho: [
    ground(),
    ...person(50, 136, 'orange', { h: 32, w: 26, r: 16 }),
    s('path', { d: 'M40 82l6 2M60 82l-6 2', ...SW(3) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 50, cy: 95, rx: 6, ry: 4 }, 'dark'),
    s('path', { d: drop(34, 94, 4) + drop(66, 94, 4) }, 'sky'),
    s('path', { d: 'M62 112l30-14', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: ells([[114, 72, 15, 14], [101, 60, 6, 6], [127, 60, 6, 6], [114, 110, 18, 22]]) }, 'brown', { accent: true }),
    s('path', { d: dots([[109, 70], [119, 70]], 2) }, 'dark')
  ],
  carencia: [
    s('rect', { x: 14, y: 112, width: 132, height: 30, rx: 4 }, 'tan'),
    s('path', { d: 'M30 118l10 10-6 8M70 116l-6 12 10 8M112 118l8 8-4 10', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M54 30h52l-8 76H62z' }, 'white'),
    s('path', { d: 'M54 30h52l-8 76H62z', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: drop(80, 96, 5) }, 'sky', { accent: true }),
    s('circle', { cx: 128, cy: 32, r: 14 }, 'orange')
  ],
  cazar: [
    ground(),
    ...lean(46, 136, 14, 'green'),
    s('path', { d: 'M58 98L94 56', ...SW(4) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 104, cy: 46, rx: 16, ry: 12 }, 'white'),
    s('path', { d: 'M94 40l20 12M98 34l14 22M90 48l18-12M100 56l12-18', ...SW(1.5) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 104, cy: 46, rx: 16, ry: 12, ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[118, 122, 16, 11], [132, 108, 9, 8]]) + 'M134 102l-2-18 6 2 2 16zM128 102l-6-16 6 0 4 16z' }, 'gray', { accent: true })
  ],
  ceja: [
    backdrop('skin'),
    s('path', { d: 'M28 96q52-44 104 0q-52 40-104 0z' }, 'white'),
    s('circle', { cx: 80, cy: 94, r: 19 }, 'brown', { accent: true }),
    s('circle', { cx: 80, cy: 94, r: 9 }, 'black'),
    s('circle', { cx: 86, cy: 88, r: 4 }, 'white'),
    s('path', { d: 'M28 96q52-44 104 0q-52 40-104 0z', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M26 58q54-34 108-4', ...SW(12) }, 'dark', { stroke: true })
  ],
  centenar: [
    backdrop('cream'),
    outline({ x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'tan'),
    s('path', { d: Array.from({ length: 9 }, (_, i) => `M26 ${26 + i * 12}h108`).join(''), ...SW(8, { 'stroke-dasharray': '0 12' }) }, 'orange', { stroke: true }),
    s('path', { d: 'M26 134h108', ...SW(8, { 'stroke-dasharray': '0 12' }) }, 'red', { stroke: true, accent: true })
  ],
  chau: [
    s('rect', { x: 20, y: 108, width: 28, height: 28, rx: 4 }, 'brown'),
    s('path', { d: 'M28 108v-6h12v6', ...SW(3) }, 'dark', { stroke: true }),
    ...person(74, 136, 'blue', { accent: true }),
    s('path', { d: dots([[69, 76], [79, 76]], 2) }, 'dark'),
    s('path', { d: 'M68 83q6 5 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 98L110 62', ...SW(8) }, 'skin', { stroke: true }),
    s('circle', { cx: 112, cy: 56, r: 9 }, 'skin'),
    s('path', { d: 'M124 40q10 8 8 22M132 32q14 12 10 32', ...SW(3) }, 'gray', { stroke: true })
  ],
  chavista: [
    ground(),
    s('path', { d: 'M104 24v112', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M106 26q16-6 34 2v34q-18-8-34-2z' }, 'red'),
    ...person(62, 136, 'red', { accent: true }),
    s('ellipse', { cx: 60, cy: 68, rx: 16, ry: 7, transform: 'rotate(-12 60 68)' }, 'red'),
    s('path', { d: 'M76 98L102 62', ...SW(7) }, 'skin', { stroke: true })
  ],
  consorcio: [
    ground(),
    s('rect', { x: 20, y: 72, width: 32, height: 64 }, 'blue'),
    s('rect', { x: 64, y: 50, width: 32, height: 86 }, 'navy'),
    s('rect', { x: 108, y: 64, width: 32, height: 72 }, 'green'),
    s('path', { d: grid(26, 80, 2, 4, 8, 8, 12, 13) + grid(70, 58, 2, 5, 8, 8, 12, 14) + grid(114, 72, 2, 4, 8, 8, 12, 14) }, 'sky'),
    s('path', { d: 'M36 70V28h88v34M80 28v20', ...SW(6) }, 'orange', { stroke: true, accent: true })
  ],
  creyente: [
    s('path', { d: halfRays(80, 74, 44, 62, 7), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: busts([80], 146, 64, 52) }, 'purple', { accent: true }),
    s('circle', { cx: 80, cy: 76, r: 22 }, 'skin'),
    s('path', { d: 'M66 74q4 4 8 0M86 74q4 4 8 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 98l-10 36h20z' }, 'skin'),
    s('path', { d: 'M80 100v32', ...SW(2) }, 'tan', { stroke: true })
  ],
  departamental: [
    ground(),
    s('rect', { x: 22, y: 36, width: 116, height: 100 }, 'cream'),
    outline({ x: 22, y: 36, width: 116, height: 100 }),
    s('path', { d: 'M22 60h116M22 84h116', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: grid(32, 42, 4, 2, 14, 12, 28, 24) }, 'sky'),
    s('path', { d: 'M18 96h124l-6 12H24z' }, 'red', { accent: true }),
    s('path', { d: 'M44 96v12M70 96v12M96 96v12M122 96v12', ...SW(6) }, 'white', { stroke: true }),
    s('rect', { x: 64, y: 112, width: 32, height: 24 }, 'navy'),
    s('path', { d: 'M80 36V18', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M81 18h18l-4 6 4 6H81z' }, 'blue')
  ],
  dinosaurio: [
    ground(),
    s('path', { d: 'M48 108v28M62 112v24M90 112v24M104 108v28', ...SW(10) }, 'green', { stroke: true }),
    s('path', { d: 'M44 92Q22 96 16 122Q30 108 48 112z' }, 'green'),
    s('path', { d: 'M100 92Q110 60 118 36', ...SW(14) }, 'green', { stroke: true }),
    s('ellipse', { cx: 76, cy: 98, rx: 40, ry: 22 }, 'green', { accent: true }),
    s('ellipse', { cx: 126, cy: 32, rx: 14, ry: 9 }, 'green'),
    s('path', { d: dots([[62, 88], [78, 82], [94, 88], [70, 102]], 5) }, 'mint'),
    s('circle', { cx: 130, cy: 29, r: 2.5 }, 'dark')
  ],
  emergente: [
    s('path', { d: 'M102 102a22 22 0 0 1 44 0z' }, 'orange'),
    s('rect', { x: 14, y: 102, width: 132, height: 40, rx: 4 }, 'brown'),
    s('path', { d: 'M58 102l8 10-6 8M100 102l-8 10 6 8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 102V56', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 72, -150, 36, 12) + leaflet(80, 62, -30, 36, 12) }, 'green', { accent: true }),
    s('path', { d: sparkle(36, 40, 10) + sparkle(118, 36, 8) }, 'yellow')
  ],
  'especialización': [
    s('path', { d: dots([30, 52, 74, 96, 118].flatMap(x => [30, 52, 74, 96, 118].map(y => [x, y]))
      .filter(([x, y]) => Math.hypot(x - 70, y - 70) > 34 && !(x >= 96 && y >= 96)), 6) }, 'gray'),
    s('circle', { cx: 70, cy: 70, r: 28 }, 'sky'),
    s('circle', { cx: 70, cy: 70, r: 10 }, 'orange', { accent: true }),
    s('circle', { cx: 70, cy: 70, r: 28, ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M92 92l40 40', ...SW(12) }, 'dark', { stroke: true })
  ],
  espinoso: [
    s('path', { d: 'M66 84H50a8 8 0 0 1-8-8V56M94 72h16a8 8 0 0 0 8-8V46', ...SW(14) }, 'green', { stroke: true }),
    s('rect', { x: 66, y: 28, width: 28, height: 90, rx: 14 }, 'green', { accent: true }),
    s('path', { d: 'M62 44h-8M98 44h8M62 64h-8M98 92h8M62 100h-8M80 26v-8M86 28l4-6M74 28l-4-6M42 46v-8M36 56h-8M118 36v-8M124 46h8M98 60h8', ...SW(2.5) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 116h52l-6 22H60z' }, 'orange'),
    s('rect', { x: 50, y: 112, width: 60, height: 8, rx: 2 }, 'brown')
  ],
  estrechamente: [
    ...person(66, 136, 'red'),
    ...person(94, 136, 'blue', { accent: true }),
    s('path', { d: 'M54 104q26 14 52 0', ...SW(7) }, 'skin', { stroke: true }),
    arrow('M16 96h20M28 88l8 8-8 8', 'orange', 5),
    arrow('M144 96h-20M132 88l-8 8 8 8', 'orange', 5)
  ],
  exactitud: [
    s('circle', { cx: 72, cy: 88, r: 52 }, 'red'),
    s('circle', { cx: 72, cy: 88, r: 38 }, 'white'),
    s('circle', { cx: 72, cy: 88, r: 24 }, 'red'),
    s('circle', { cx: 72, cy: 88, r: 10 }, 'yellow', { accent: true }),
    s('path', { d: 'M72 88L130 30', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M130 30l4-14M130 30l14-4M122 38l4-14M122 38l14-4', ...SW(4) }, 'orange', { stroke: true })
  ],
  facto: [
    s('rect', { x: 34, y: 26, width: 92, height: 114, rx: 8 }, 'brown'),
    s('rect', { x: 44, y: 36, width: 72, height: 96, rx: 3 }, 'white'),
    s('rect', { x: 62, y: 20, width: 36, height: 14, rx: 4 }, 'gray'),
    s('path', { d: 'M54 54h52M54 70h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 100l14 14 30-30', ...SW(9) }, 'green', { stroke: true, accent: true })
  ],
  faro: [
    backdrop('navy'),
    s('path', { d: 'M92 40L146 22v38zM68 40L14 22v38z' }, 'cream'),
    s('rect', { x: 14, y: 126, width: 132, height: 20, rx: 6 }, 'blue'),
    s('path', { d: 'M62 136l8-80h20l8 80z' }, 'white'),
    s('path', { d: 'M68.4 72h23.2l1.4 14H67zM65.2 104h29.6l1.6 16H63.6z' }, 'red', { accent: true }),
    s('rect', { x: 68, y: 36, width: 24, height: 20 }, 'yellow'),
    s('path', { d: 'M64 36h32l-16-14z' }, 'red')
  ],
  feriado: [
    s('rect', { x: 24, y: 34, width: 112, height: 104, rx: 8 }, 'white'),
    outline({ x: 24, y: 34, width: 112, height: 104, rx: 8 }),
    s('path', { d: 'M24 42a8 8 0 0 1 8-8h96a8 8 0 0 1 8 8v16H24z' }, 'red'),
    s('path', { d: 'M50 26v16M110 26v16', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: grid(36, 68, 4, 3, 16, 14, 24, 22) }, 'gray'),
    s('rect', { x: 82, y: 88, width: 20, height: 18, rx: 3 }, 'red', { accent: true }),
    s('path', { d: sparkle(92, 97, 7) }, 'yellow')
  ],
  flexibilidad: [
    s('rect', { x: 14, y: 128, width: 132, height: 8, rx: 4 }, 'purple'),
    s('path', { d: 'M24 121h112', ...SW(12) }, 'navy', { stroke: true }),
    s('rect', { x: 68, y: 76, width: 24, height: 46, rx: 10 }, 'pink', { accent: true }),
    s('circle', { cx: 80, cy: 62, r: 12 }, 'skin'),
    s('path', { d: 'M72 84L50 46M88 84l22-38', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: dots([[18, 121], [142, 121]], 6) }, 'skin')
  ],
  fractura: [
    backdrop('navy'),
    s('path', { d: 'M14 54q66-8 132 0M14 114q66 8 132 0', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: burst(80, 84, 20, 9, 8) }, 'red', { accent: true }),
    s('path', { d: dots([[30, 74], [30, 94]], 10) + 'M30 76h44l6 6-6 4 4 6H30z' }, 'white'),
    s('path', { d: 'M86 76l-4 6 6 4-4 6h46V76z' + dots([[130, 74], [130, 94]], 10) }, 'white')
  ],
  'implicación': [
    backdrop('sky'),
    s('path', { d: ells([[80, 108, 20, 7], [80, 108, 40, 14], [80, 108, 60, 22]]), ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: drop(64, 96, 4) + drop(96, 96, 4) }, 'white'),
    s('circle', { cx: 80, cy: 62, r: 12 }, 'dark', { accent: true }),
    s('path', { d: 'M80 28v14M70 32l4 10M90 32l-4 10', ...SW(3) }, 'white', { stroke: true })
  ],
  impreso: [
    s('rect', { x: 44, y: 18, width: 72, height: 40, rx: 3 }, 'white'),
    outline({ x: 44, y: 18, width: 72, height: 40, rx: 3 }),
    s('rect', { x: 20, y: 50, width: 120, height: 52, rx: 10 }, 'gray'),
    s('rect', { x: 36, y: 88, width: 88, height: 8, rx: 3 }, 'dark'),
    s('rect', { x: 118, y: 60, width: 12, height: 6, rx: 3 }, 'green', { accent: true }),
    ...paper(44, 94, 72, 46),
    s('path', { d: 'M54 106h52M54 116h52M54 126h32', ...SW(3) }, 'blue', { stroke: true })
  ],
  indiferente: [
    s('path', { d: busts([80], 146, 56, 44) }, 'gray', { accent: true }),
    s('circle', { cx: 80, cy: 78, r: 24 }, 'skin'),
    s('path', { d: 'M66 76h9M85 76h9M72 90h16', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 112L34 122 24 98M104 112l22 10 10-24', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: ells([[24, 94, 9, 5], [136, 94, 9, 5]]) }, 'skin')
  ],
  'inmediación': [
    backdrop('mint'),
    s('path', { d: 'M14 60h132M58 14v132M14 118L146 98', ...SW(8) }, 'white', { stroke: true }),
    s('path', { d: rects([[26, 30, 18, 18], [104, 24, 22, 20], [100, 120, 20, 16], [26, 76, 18, 18]]) }, 'tan'),
    s('circle', { cx: 80, cy: 84, r: 44, ...DASH(4, '8 6') }, 'green', { stroke: true }),
    s('path', { d: 'M80 84q-20-24-20-38a20 20 0 0 1 40 0q0 14-20 38z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 46, r: 8 }, 'white')
  ],
  inolvidable: [
    s('path', { d: busts([40], 146, 40, 24) }, 'blue'),
    s('circle', { cx: 40, cy: 110, r: 16 }, 'skin'),
    s('path', { d: ells([[58, 92, 5, 5], [68, 82, 7, 7]]) }, 'white'),
    s('path', { d: ells([[58, 92, 5, 5], [68, 82, 7, 7]]), ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 62, y: 20, width: 82, height: 58, rx: 29 }, 'white'),
    outline({ x: 62, y: 20, width: 82, height: 58, rx: 29 }),
    s('path', { d: heart(104, 55, 12) }, 'pink', { accent: true }),
    s('path', { d: sparkle(76, 38, 6) + sparkle(132, 60, 5) }, 'yellow')
  ],
  inquietud: [
    s('circle', { cx: 76, cy: 86, r: 46 }, 'yellow', { accent: true }),
    s('path', { d: dots([[60, 80], [92, 80]], 5) }, 'dark'),
    s('path', { d: 'M50 64l16-6M102 64l-16-6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 106q6-6 12 0t12 0 12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: drop(124, 62, 6) }, 'sky'),
    s('path', { d: 'M22 70q-6 8 0 16t0 16M136 100q6 8 0 16t0 16', ...SW(3) }, 'gray', { stroke: true })
  ],
  inscribir: [
    ...paper(30, 20, 84, 116),
    s('path', { d: rects([[42, 36, 12, 12], [42, 62, 12, 12]]), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 42h40M62 68h40M62 94h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M44 118q8-12 12 0t12 0 10-6', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M84 124l4-14 40-46 10 8-40 46z' }, 'orange', { accent: true }),
    s('path', { d: 'M84 124l4-14 6 5z' }, 'dark')
  ],
  intercambiar: [
    s('rect', { x: 16, y: 26, width: 44, height: 40, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M38 26v40M16 46h44', ...SW(5) }, 'yellow', { stroke: true }),
    s('rect', { x: 100, y: 94, width: 44, height: 40, rx: 4 }, 'blue'),
    s('path', { d: 'M122 94v40M100 114h44', ...SW(5) }, 'white', { stroke: true }),
    arrow('M72 42h42q12 0 12 12v24M118 70l8 8 8-8', 'green', 6),
    arrow('M88 118H46q-12 0-12-12V82M26 90l8-8 8 8', 'orange', 6)
  ],
  internacionalmente: [
    s('circle', { cx: 80, cy: 82, r: 44 }, 'blue', { accent: true }),
    s('path', { d: 'M58 52q14-6 20 4t-4 18q-14 4-18 16q-10-4-8-18t10-20zM96 94q14-4 18 8t-8 22q-10-2-12-14t2-16z' }, 'green'),
    s('ellipse', { cx: 80, cy: 82, rx: 62, ry: 22, transform: 'rotate(-20 80 82)', ...DASH(3, '6 6') }, 'gray', { stroke: true }),
    s('path', { d: jet(124, 42), transform: 'rotate(-60 124 42)' }, 'red')
  ],
  loma: [
    backdrop('sky'),
    s('circle', { cx: 116, cy: 42, r: 14 }, 'yellow'),
    s('path', { d: ells([[46, 42, 16, 8], [58, 36, 12, 8]]) }, 'white'),
    s('path', { d: 'M14 128Q80 50 146 128V134a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green', { accent: true }),
    s('path', { d: 'M40 112l4-8 4 8M100 104l4-8 4 8M70 126l4-8 4 8', ...SW(3) }, 'mint', { stroke: true })
  ],
  medicar: [
    s('rect', { x: 30, y: 56, width: 48, height: 80, rx: 8 }, 'orange', { accent: true }),
    s('rect', { x: 26, y: 36, width: 56, height: 22, rx: 4 }, 'white'),
    outline({ x: 26, y: 36, width: 56, height: 22, rx: 4 }),
    s('rect', { x: 38, y: 78, width: 32, height: 34, rx: 3 }, 'white'),
    s('path', { d: 'M44 88h20M44 96h20M44 104h12', ...SW(3) }, 'blue', { stroke: true }),
    s('rect', { x: 94, y: 70, width: 44, height: 18, rx: 9, transform: 'rotate(-30 116 79)' }, 'blue'),
    s('rect', { x: 116, y: 70, width: 22, height: 18, rx: 9, transform: 'rotate(-30 116 79)' }, 'yellow'),
    s('rect', { x: 92, y: 112, width: 44, height: 18, rx: 9 }, 'red'),
    s('rect', { x: 114, y: 112, width: 22, height: 18, rx: 9 }, 'yellow')
  ],
  'monseñor': [
    s('path', { d: 'M122 146V40a12 12 0 1 0-12-12', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M44 146l10-58h52l10 58z' }, 'purple', { accent: true }),
    s('circle', { cx: 80, cy: 72, r: 18 }, 'skin'),
    s('path', { d: 'M62 58l2-30 16-12 16 12 2 30z' }, 'cream'),
    s('path', { d: 'M62 58l2-30 16-12 16 12 2 30zM80 16v42', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M104 104l14-6', ...SW(7) }, 'skin', { stroke: true })
  ],
  neto: [
    s('rect', { x: 30, y: 28, width: 100, height: 56, rx: 4, ...DASH(3, '6 5') }, 'gray', { stroke: true }),
    s('path', { d: dots([[54, 70], [80, 70], [106, 70], [67, 46], [93, 46]], 13) }, 'red', { accent: true }),
    s('path', { d: 'M67 33l4-6M93 33l4-6', ...SW(3) }, 'green', { stroke: true }),
    s('rect', { x: 22, y: 84, width: 116, height: 10, rx: 4 }, 'dark'),
    s('rect', { x: 30, y: 94, width: 100, height: 42, rx: 8 }, 'gray'),
    s('rect', { x: 58, y: 104, width: 44, height: 18, rx: 3 }, 'dark'),
    s('path', { d: 'M66 113h28', ...SW(4) }, 'green', { stroke: true })
  ],
  olimpiada: [
    s('path', { d: laurel(80, 92, 50) }, 'green'),
    s('path', { d: 'M80 16Q108 40 100 62Q110 58 110 46Q126 70 108 84H52Q34 70 50 46Q50 58 60 62Q52 40 80 16Z' }, 'orange', { accent: true }),
    s('path', { d: 'M80 48Q96 64 90 82H70Q64 64 80 48Z' }, 'yellow'),
    s('path', { d: 'M52 82h56l-10 18H62z' }, 'yellow'),
    s('path', { d: 'M64 100h32l-8 40h-16z' }, 'gray')
  ],
  organizador: [
    s('path', { d: 'M30 72V38M42 72V30M52 72V44', ...SW(6) }, 'orange', { stroke: true }),
    s('rect', { x: 72, y: 28, width: 14, height: 46, rx: 2 }, 'yellow'),
    s('path', { d: dots([[114, 62], [130, 62]], 9) }, 'pink'),
    s('rect', { x: 18, y: 70, width: 124, height: 66, rx: 6 }, 'blue', { accent: true }),
    s('path', { d: 'M62 70v66M102 70v66M18 104h44', ...SW(4) }, 'navy', { stroke: true })
  ],
  pampa: [
    backdrop('sky'),
    s('path', { d: 'M14 104h132v30a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green'),
    s('circle', { cx: 118, cy: 46, r: 14 }, 'yellow'),
    ...scaled(horse('brown', 'dark', { accent: true }), 0.55, 24, 46),
    s('path', { d: 'M24 130l4-8 4 8M104 124l4-8 4 8M126 134l4-8 4 8', ...SW(3) }, 'mint', { stroke: true })
  ],
  'pedagogía': [
    ground(),
    ...person(50, 136, 'green', { h: 52, w: 32, r: 14 }),
    ...person(108, 136, 'orange', { h: 30, w: 24, r: 11 }),
    s('path', { d: 'M66 92l16-6 16 6v22l-16-6-16 6z' }, 'red', { accent: true }),
    s('path', { d: 'M82 86v22', ...SW(2) }, 'white', { stroke: true }),
    s('circle', { cx: 112, cy: 58, r: 9 }, 'yellow'),
    s('path', { d: 'M108 70h8M100 46l-4-4M124 46l4-4M112 42v-6', ...SW(3) }, 'gray', { stroke: true })
  ],
  pertenencia: [
    s('path', { d: 'M26 136V74L80 30l54 44v62z' }, 'cream'),
    s('path', { d: 'M26 136V74L80 30l54 44v62z', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: busts([52, 108], 136, 22, 24) }, 'blue'),
    s('path', { d: busts([80], 136, 22, 24) }, 'red', { accent: true }),
    s('path', { d: dots([[52, 100], [80, 100], [108, 100]], 9) }, 'skin'),
    s('path', { d: heart(80, 64, 10) }, 'pink')
  ],
  plancha: [
    s('path', { d: 'M28 86q-6-8 0-16t0-16M42 72q-6-8 0-16', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 62q0-24 24-24h40v24', ...SW(10) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 112q6-50 74-50h40v50z' }, 'sky', { accent: true }),
    s('rect', { x: 16, y: 112, width: 118, height: 12, rx: 3 }, 'gray'),
    s('circle', { cx: 104, cy: 88, r: 7 }, 'red'),
    s('path', { d: 'M24 136h112', ...SW(4) }, 'blue', { stroke: true })
  ],
  planteamiento: [
    s('rect', { x: 14, y: 16, width: 132, height: 122, rx: 8 }, 'white'),
    outline({ x: 14, y: 16, width: 132, height: 122, rx: 8 }),
    s('rect', { x: 56, y: 28, width: 48, height: 26, rx: 4 }, 'yellow', { accent: true }),
    s('path', { d: 'M80 54v18H44v24M80 72h36v24M38 90l6 6 6-6M110 90l6 6 6-6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: rects([[24, 98, 40, 26], [96, 98, 40, 26]]) }, 'sky'),
    s('path', { d: dots([[80, 41]], 6) }, 'orange')
  ],
  posada: [
    ground(),
    s('rect', { x: 22, y: 66, width: 84, height: 70 }, 'tan'),
    s('path', { d: 'M14 70l50-42 50 42z' }, 'brown'),
    s('rect', { x: 52, y: 104, width: 22, height: 32 }, 'dark'),
    s('path', { d: rects([[30, 80, 16, 16], [82, 80, 16, 16]]) }, 'yellow'),
    s('path', { d: 'M106 76h26M124 76v8', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 110, y: 84, width: 30, height: 24, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M116 102V90M116 98h18v4M122 94h10', ...SW(3) }, 'white', { stroke: true })
  ],
  recaudar: [
    s('path', { d: 'M40 60h80v68a8 8 0 0 1-8 8H48a8 8 0 0 1-8-8z' }, 'sky'),
    s('path', { d: ells([[60, 124, 14, 6], [88, 126, 14, 6], [74, 116, 14, 6], [102, 118, 14, 6]]) }, 'yellow'),
    s('path', { d: heart(80, 90, 9) }, 'red'),
    s('rect', { x: 34, y: 50, width: 92, height: 12, rx: 4 }, 'dark'),
    s('rect', { x: 64, y: 54, width: 32, height: 4, rx: 2 }, 'gray'),
    s('circle', { cx: 80, cy: 30, r: 11 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 30, r: 11, ...SW(3) }, 'orange', { stroke: true })
  ],
  'reconciliación': [
    s('path', { d: heart(80, 96, 40) }, 'red', { accent: true }),
    s('path', { d: 'M80 44l-8 20 12 16-10 18 8 20', ...SW(4) }, 'white', { stroke: true }),
    s('rect', { x: 46, y: 66, width: 68, height: 22, rx: 8, transform: 'rotate(-25 80 77)' }, 'tan'),
    s('rect', { x: 70, y: 68, width: 20, height: 18, rx: 3, transform: 'rotate(-25 80 77)' }, 'cream')
  ],
  recreo: [
    ground(),
    s('path', { d: 'M28 72q0-36 24-36t24 36l6 8H22z' }, 'yellow', { accent: true }),
    s('circle', { cx: 52, cy: 86, r: 6 }, 'orange'),
    s('path', { d: 'M86 38q8 14 0 28M94 30q14 22 0 44', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 52, cy: 124, r: 12 }, 'blue'),
    ...person(120, 120, 'red', { h: 30, w: 24, r: 11 }),
    s('path', { d: 'M112 94l-8-16M128 94l8-16M114 120l-4 10M126 120l4 10', ...SW(5) }, 'skin', { stroke: true })
  ],
  reportar: [
    ...person(60, 136, 'navy', { h: 50, w: 34, r: 14 }),
    s('rect', { x: 48, y: 96, width: 12, height: 14, rx: 2 }, 'yellow', { accent: true }),
    s('path', { d: 'M74 102l22-10', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M94 94l14-12', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 112, cy: 78, r: 9 }, 'red'),
    s('path', { d: 'M124 62q8 8 4 20M132 54q12 14 4 32', ...SW(3) }, 'orange', { stroke: true })
  ],
  'réplica': [
    s('path', { d: rects([[16, 36, 52, 64], [92, 36, 52, 64]]) }, 'brown'),
    s('path', { d: rects([[22, 42, 40, 52], [98, 42, 40, 52]]) }, 'sky'),
    s('path', { d: 'M22 94l14-22 10 12 6-6 10 16zM98 94l14-22 10 12 6-6 10 16z' }, 'green', { accent: true }),
    s('path', { d: dots([[52, 54], [128, 54]], 5) }, 'yellow'),
    s('rect', { x: 88, y: 32, width: 60, height: 72, rx: 4, ...DASH(2, '5 4') }, 'gray', { stroke: true }),
    arrow('M44 122h72M106 112l10 10-10 10', 'orange', 5)
  ],
  santidad: [
    s('path', { d: rays(80, 62, 30, 44, 12, 15), ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: busts([80], 146, 60, 64) }, 'sky', { accent: true }),
    s('circle', { cx: 80, cy: 62, r: 20 }, 'skin'),
    s('path', { d: 'M70 62q4 4 8 0M82 62q4 4 8 0', ...SW(3) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 80, cy: 34, rx: 22, ry: 6, ...SW(5) }, 'yellow', { stroke: true })
  ],
  senda: [
    backdrop('mint'),
    s('path', { d: 'M52 146Q74 120 60 98T78 40h6Q72 70 88 98T96 146z' }, 'tan', { accent: true }),
    s('path', { d: 'M30 70v8M124 80v8M36 126v8M124 134v6', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: poly([[30, 26], [46, 70], [14, 70]]) + poly([[124, 36], [142, 80], [106, 80]]) + poly([[36, 82], [54, 126], [18, 126]]) + poly([[124, 90], [144, 134], [104, 134]]) }, 'green')
  ],
  suplente: [
    s('path', { d: 'M26 112v24M106 112v24', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 18, y: 104, width: 96, height: 8, rx: 3 }, 'brown'),
    s('path', { d: 'M60 102h22v32', ...SW(10) }, 'navy', { stroke: true }),
    s('rect', { x: 50, y: 66, width: 28, height: 40, rx: 9 }, 'yellow', { accent: true }),
    s('circle', { cx: 64, cy: 52, r: 12 }, 'skin'),
    arrow('M132 76V40M122 50l10-10 10 10', 'green', 5),
    arrow('M132 96v36M122 122l10 10 10-10', 'red', 5)
  ],
  temblor: [
    s('rect', { x: 14, y: 122, width: 132, height: 20, rx: 3 }, 'brown'),
    s('path', { d: 'M76 122l6 8-6 6 4 6', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 46, y: 72, width: 56, height: 50, transform: 'rotate(-6 74 122)' }, 'tan'),
    s('path', { d: 'M40 76l34-32 34 32z', transform: 'rotate(-6 74 122)' }, 'red', { accent: true }),
    s('rect', { x: 66, y: 96, width: 16, height: 26, transform: 'rotate(-6 74 122)' }, 'brown'),
    s('path', { d: 'M24 64q-6 8 0 16t0 16M134 64q6 8 0 16t0 16', ...SW(3) }, 'gray', { stroke: true })
  ],
  vereda: [
    s('rect', { x: 14, y: 120, width: 132, height: 22 }, 'dark'),
    s('path', { d: 'M22 132h20M62 132h20M102 132h20', ...SW(3) }, 'white', { stroke: true }),
    s('rect', { x: 14, y: 104, width: 132, height: 16 }, 'gray'),
    s('path', { d: 'M40 104v16M66 104v16M92 104v16M118 104v16', ...SW(2) }, 'white', { stroke: true }),
    ...person(64, 104, 'green', { accent: true }),
    s('path', { d: 'M126 104V30h-12', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 112, cy: 36, r: 6 }, 'yellow')
  ],
  'índole': [
    s('path', { d: dots([[26, 88], [42, 88], [34, 74]], 8) }, 'red'),
    s('path', { d: 'M64 96l9-16 9 16zM80 96l9-16 9 16zM72 82l9-16 9 16z' }, 'blue'),
    s('path', { d: rects([[112, 80, 14, 14], [126, 80, 14, 14], [119, 66, 14, 14]]) }, 'green', { accent: true }),
    s('path', { d: 'M14 96h40l-4 40H18zM60 96h40l-4 40H64zM106 96h40l-4 40h-32z' }, 'gray')
  ],
  'íntimo': [
    ground(),
    ...lean(60, 136, 8, 'purple'),
    ...lean(100, 136, -8, 'pink', { accent: true }),
    s('path', { d: heart(80, 42, 10) }, 'red')
  ],
  albergar: [
    ground(),
    s('path', { d: 'M30 70v66M130 70v66', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: busts([56, 80, 104], 136, 22, 26) }, 'blue'),
    s('path', { d: dots([[56, 98], [80, 98], [104, 98]], 9) }, 'skin'),
    s('path', { d: 'M14 72l66-46 66 46z' }, 'red', { accent: true }),
    s('path', { d: 'M18 84l-3 8M18 104l-3 8M142 84l-3 8M142 104l-3 8M24 94l-3 8M136 94l-3 8', ...SW(3) }, 'sky', { stroke: true })
  ],
  amateur: [
    ...person(52, 136, 'green'),
    s('path', { d: 'M94 96l34-34', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M126 64l8-8', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: ells([[76, 112, 18, 15], [90, 98, 12, 11]]) }, 'orange', { accent: true }),
    s('circle', { cx: 82, cy: 106, r: 5 }, 'dark'),
    s('path', { d: heart(124, 104, 8) }, 'pink')
  ],
  'antología': [
    s('path', { d: 'M64 84V54M80 86V44M96 84V54', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots([[64, 48], [96, 48]], 9) }, 'pink'),
    s('circle', { cx: 80, cy: 36, r: 10 }, 'yellow', { accent: true }),
    ...openBook(80, 78, 'cream', 'red')
  ],
  ascender: [
    s('path', { d: 'M14 136v-16h32v-20h32v-20h32v-20h36v76z' }, 'gray'),
    ...person(94, 80, 'orange', { h: 30, w: 24, r: 11, accent: true }),
    arrow('M128 52V22M118 32l10-10 10 10', 'green', 5)
  ],
  asentamiento: [
    ground(),
    s('path', { d: 'M82 52q-6-8 0-16t0-16', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: rects([[24, 98, 28, 38], [66, 88, 32, 48], [110, 98, 28, 38]]) }, 'brown'),
    s('path', { d: 'M18 100l20-24 20 24zM60 90l22-30 22 30zM104 100l20-24 20 24z' }, 'tan', { accent: true }),
    s('path', { d: rects([[32, 116, 12, 20], [76, 112, 12, 24], [118, 116, 12, 20]]) }, 'dark')
  ],
  atardecer: [
    backdrop('orange'),
    s('path', { d: 'M44 96a36 36 0 0 1 72 0z' }, 'yellow', { accent: true }),
    s('path', { d: 'M14 96h132v38a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'navy'),
    s('path', { d: 'M60 108h40M68 120h24M74 132h12', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: birds([[36, 40], [56, 30], [118, 36]]), ...SW(3) }, 'dark', { stroke: true })
  ],
  atrever: [
    s('path', { d: 'M18 104h124M22 104v36M138 104v36', ...SW(3) }, 'dark', { stroke: true }),
    ...person(80, 104, 'red', { h: 36, w: 24, r: 11, accent: true }),
    s('path', { d: 'M24 82q56-10 112 0', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: ells([[48, 132, 16, 6], [112, 128, 18, 6]]) }, 'sky')
  ],
  avatar: [
    s('rect', { x: 20, y: 20, width: 120, height: 120, rx: 24 }, 'purple'),
    s('circle', { cx: 80, cy: 80, r: 50 }, 'sky'),
    s('circle', { cx: 80, cy: 66, r: 20 }, 'white'),
    s('path', { d: 'M50 120q0-28 30-28t30 28z' }, 'white'),
    s('circle', { cx: 122, cy: 122, r: 12 }, 'green', { accent: true })
  ],
  barbaro: [
    s('path', { d: star(124, 40, 16) + star(30, 52, 11) }, 'yellow', { accent: true }),
    s('path', { d: 'M60 72V36a10 10 0 0 1 20 0v34z' }, 'skin'),
    s('rect', { x: 46, y: 70, width: 52, height: 58, rx: 12 }, 'skin'),
    s('path', { d: 'M54 88h36M54 102h36M54 116h32', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 44, y: 124, width: 56, height: 16, rx: 3 }, 'blue')
  ],
  'barón': [
    s('path', { d: busts([80], 146, 70, 50) }, 'navy'),
    s('path', { d: 'M72 96l8 14 8-14z' }, 'white'),
    s('circle', { cx: 80, cy: 74, r: 24 }, 'skin'),
    s('path', { d: 'M50 52h60v6H50zM64 52V18h32v34z' }, 'black'),
    s('rect', { x: 64, y: 42, width: 32, height: 6 }, 'red', { accent: true }),
    s('path', { d: dots([[70, 72], [90, 72]], 2.5) }, 'dark'),
    s('path', { d: 'M66 86q7-6 14 0q7-6 14 0q-7 4-14 0q-7 4-14 0z' }, 'brown'),
    s('path', { d: ring(90, 72, 7) + 'M96 76q8 16 2 30', ...SW(3) }, 'yellow', { stroke: true })
  ],
  brillar: [
    backdrop('navy'),
    s('path', { d: rays(80, 82, 46, 60, 5, -54), ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: star(80, 84, 40) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(30, 32, 10) + sparkle(130, 124, 9) + sparkle(128, 32, 7) + sparkle(32, 126, 6) }, 'white')
  ],
  canasta: [
    s('path', { d: 'M38 78q0-50 42-50t42 50', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 80q-2-26 22-42l10 6q-14 18-14 36z' }, 'tan'),
    s('path', { d: dots([[80, 70], [104, 72]], 13) }, 'red', { accent: true }),
    s('path', { d: 'M24 76h112l-12 60H36z' }, 'brown'),
    s('path', { d: 'M30 92h100M34 108h92M37 122h86', ...SW(3) }, 'tan', { stroke: true })
  ],
  chaval: [
    s('path', { d: 'M72 120v8M88 120v8', ...SW(6) }, 'navy', { stroke: true }),
    ...person(80, 120, 'green', { h: 40, w: 28, r: 13 }),
    s('path', { d: 'M67 63a13 13 0 0 1 26 0zM55 60h14v4H55z' }, 'red', { accent: true }),
    s('rect', { x: 38, y: 126, width: 84, height: 7, rx: 3 }, 'orange'),
    s('path', { d: dots([[54, 138], [106, 138]], 5) }, 'dark')
  ],
  competidor: [
    ground(),
    ...person(40, 136, 'red'),
    ...person(120, 136, 'blue', { accent: true }),
    s('path', { d: rects([[32, 102, 16, 14], [112, 102, 16, 14]]) }, 'white'),
    s('path', { d: 'M32 72l10 4M128 72l-10 4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[62, 100], [98, 100]], 7) }, 'skin'),
    s('path', { d: 'M84 52l-10 20h12l-10 22', ...SW(5) }, 'orange', { stroke: true })
  ],
  confuso: [
    s('circle', { cx: 80, cy: 102, r: 38 }, 'skin'),
    s('path', { d: dots([[66, 96], [94, 96]], 4) }, 'dark'),
    s('path', { d: 'M58 84l14 2M88 80l14-6M68 120l26-6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M42 42c10-24 34-24 30 2s-26 16-14-6 30-20 40 2-20 22-30 6 22-22 38-8 10 22 0 24', ...SW(4) }, 'purple', { stroke: true, accent: true })
  ],
  'discípulo': [
    ground(),
    ...person(46, 136, 'brown', { h: 52, w: 34, r: 14 }),
    s('path', { d: 'M36 72q10 28 20 0z' }, 'white'),
    s('path', { d: 'M62 96l18-10', ...SW(6) }, 'skin', { stroke: true }),
    ...lean(116, 136, -30, 'blue', { h: 36, w: 26, r: 11, accent: true })
  ],
  'dominación': [
    ground(),
    s('path', { d: 'M54 136l6-14h40l6 14zM62 122l6-50h24l6 50zM60 72h40v-8H60zM66 64a14 14 0 0 1 28 0z' }, 'dark', { accent: true }),
    s('path', { d: 'M64 52l4-20 8 12 4-16 4 16 8-12 4 20z' }, 'yellow'),
    s('path', { d: ells([[28, 129, 12, 7], [132, 129, 12, 7]]) + dots([[44, 126], [116, 126]], 6) }, 'gray')
  ],
  drenaje: [
    s('rect', { x: 14, y: 90, width: 132, height: 52, rx: 4 }, 'gray'),
    s('rect', { x: 46, y: 98, width: 68, height: 34, rx: 4 }, 'dark'),
    s('path', { d: 'M58 98v34M70 98v34M82 98v34M94 98v34M106 98v34', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 52q14 6 22 36M136 52q-14 6-22 36M80 24v58M38 80l8 8 4-10M122 80l-8 8-4-10M72 74l8 8 8-8', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: drop(24, 38, 5) + drop(136, 38, 5) + drop(104, 30, 4) + drop(56, 30, 4) }, 'sky', { accent: true })
  ],
  efe: [
    backdrop('skin'),
    s('path', { d: 'M24 84q48 46 92 0q-46 8-92 0z' }, 'red'),
    s('rect', { x: 48, y: 70, width: 44, height: 16, rx: 3 }, 'white'),
    s('path', { d: 'M48 70h44v16H48zM62 70v16M78 70v16', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M22 74q24-20 48-10q24-10 48 10q-48 0-96 0z' }, 'red', { accent: true }),
    s('path', { d: 'M124 70h16M126 82h14M124 94h16', ...SW(4) }, 'white', { stroke: true })
  ],
  elegancia: [
    s('path', { d: 'M68 66L56 98M92 66l12 32', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M68 64h24l18 76H50z' }, 'purple', { accent: true }),
    s('circle', { cx: 80, cy: 26, r: 9 }, 'dark'),
    s('circle', { cx: 80, cy: 44, r: 13 }, 'skin'),
    s('path', { d: 'M70 62q10 8 20 0', ...SW(3) }, 'white', { stroke: true, lineColor: 'gray' }),
    s('path', { d: sparkle(122, 38, 8) + sparkle(36, 52, 6) + sparkle(124, 110, 5) }, 'yellow')
  ],
  escalada: [
    s('path', { d: 'M50 14h96v132H70l-12-30 8-40z' }, 'tan'),
    s('path', { d: 'M96 14v34', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: dots([[72, 42], [122, 54], [84, 112], [118, 104], [132, 126], [62, 132]], 5) }, 'orange'),
    s('path', { d: 'M88 70L74 46M104 70l16-14M90 96l-6 14M102 96l14 6', ...SW(5) }, 'skin', { stroke: true }),
    s('rect', { x: 86, y: 64, width: 20, height: 34, rx: 7 }, 'blue', { accent: true }),
    s('circle', { cx: 96, cy: 54, r: 10 }, 'skin')
  ],
  escolta: [
    ground(),
    ...person(80, 136, 'red', { h: 40, w: 28, r: 12, accent: true }),
    ...person(36, 136, 'black', { h: 54, w: 34, r: 13 }),
    ...person(124, 136, 'black', { h: 54, w: 34, r: 13 }),
    s('path', { d: rects([[28, 64, 7, 5], [37, 64, 7, 5], [116, 64, 7, 5], [125, 64, 7, 5]]) }, 'black')
  ],
  escuadra: [
    s('path', { d: 'M26 136V30l106 106z' }, 'sky', { accent: true }),
    s('path', { d: 'M44 118V74l44 44z' }, 'white'),
    s('path', { d: 'M26 136V30l106 106zM44 118V74l44 44z', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M26 46h8M26 62h8M26 78h12M26 94h8M26 110h8M42 136v-8M58 136v-8M74 136v-12M90 136v-8M106 136v-8', ...SW(2) }, 'dark', { stroke: true })
  ],
  espina: [
    s('ellipse', { cx: 80, cy: 84, rx: 66, ry: 50 }, 'cream'),
    s('ellipse', { cx: 80, cy: 84, rx: 66, ry: 50, ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M38 84h76M50 84q4-18 10-24M66 84q4-20 10-26M82 84q4-20 10-26M98 84q2-16 8-22M50 84q4 18 10 24M66 84q4 20 10 26M82 84q4 20 10 26M98 84q2 16 8 22', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 84l-14-14v28z' }, 'gray'),
    s('path', { d: 'M112 84q6-20 28-18q-8 18 0 36q-22 2-28-18z' }, 'gray', { accent: true }),
    s('circle', { cx: 126, cy: 80, r: 3 }, 'dark')
  ],
  estatura: [
    s('rect', { x: 86, y: 16, width: 38, height: 122, rx: 4 }, 'yellow', { accent: true }),
    s('path', { d: 'M86 30h10M86 44h16M86 58h10M86 72h16M86 86h10M86 100h16M86 114h10M86 128h16', ...SW(2) }, 'dark', { stroke: true }),
    ground(138),
    ...person(64, 138, 'green', { h: 50, w: 30, r: 14 }),
    s('path', { d: 'M48 56h72', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M30 58v78M24 66l6-8 6 8M24 128l6 8 6-8', ...SW(4) }, 'orange', { stroke: true })
  ],
  'estímulo': [
    s('path', { d: 'M20 132L120 34', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M120 34q14 10 12 40', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M126 74l-4-10M132 74v-12M138 74l4-10', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M122 74h20l-10 52z' }, 'orange', { accent: true }),
    s('path', { d: sparkle(102, 96, 7) + sparkle(144, 92, 4) }, 'yellow')
  ],
  eventual: [
    ...paper(24, 20, 76, 104),
    s('path', { d: 'M36 40h52M36 54h52M36 68h40M36 104q8-10 14 0t14-4', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M102 76h32l-14 32 14 32h-32l14-32z' }, 'sky'),
    s('path', { d: 'M108 86h20l-10 20zM104 138q14-14 28 0z' }, 'yellow', { accent: true }),
    s('path', { d: 'M98 74h40M98 142h40', ...SW(6) }, 'brown', { stroke: true })
  ],
  festividad: [
    s('path', { d: 'M14 30q66 30 132 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: qpts([14, 30], [80, 60], [146, 30], 5).filter((_, i) => i % 2 === 0).map(([x, y]) => `M${x - 9} ${y}h18l-9 18z`).join('') }, 'red', { accent: true }),
    s('path', { d: qpts([14, 30], [80, 60], [146, 30], 5).filter((_, i) => i % 2 === 1).map(([x, y]) => `M${x - 9} ${y}h18l-9 18z`).join('') }, 'blue'),
    s('path', { d: rays(70, 100, 8, 30, 12), ...SW(4) }, 'purple', { stroke: true }),
    s('path', { d: rays(120, 112, 6, 20, 10), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: dots([[70, 100], [120, 112]], 5) }, 'yellow'),
    s('path', { d: rects([[26, 80, 5, 5], [36, 128, 5, 5], [104, 72, 5, 5], [134, 80, 5, 5], [92, 136, 5, 5]]) }, 'green')
  ],
  fraternidad: [
    ground(),
    ...person(60, 136, 'blue'),
    ...person(100, 136, 'blue', { accent: true }),
    s('path', { d: 'M70 96Q86 84 110 96', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: dots([[55, 76], [65, 76], [95, 76], [105, 76]], 2) }, 'dark'),
    s('path', { d: 'M54 83q6 5 12 0M94 83q6 5 12 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  grandioso: [
    s('path', { d: 'M80 30V16', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M50 60a30 30 0 0 1 60 0z' }, 'yellow', { accent: true }),
    s('rect', { x: 20, y: 60, width: 120, height: 12 }, 'tan'),
    s('path', { d: 'M30 72v56M50 72v56M70 72v56M90 72v56M110 72v56M130 72v56', ...SW(8) }, 'gray', { stroke: true }),
    s('rect', { x: 14, y: 128, width: 132, height: 10 }, 'tan'),
    ...person(80, 128, 'red', { h: 10, w: 6, r: 3 })
  ],
  'heroína': [
    s('path', { d: 'M66 66L30 136h100L94 66z' }, 'red'),
    s('path', { d: 'M74 118v18M86 118v18', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M70 62h20l6 56H64z' }, 'blue', { accent: true }),
    s('path', { d: 'M66 48a14 14 0 0 1 28 0q4 14-2 20V48H68v20q-6-6-2-20z' }, 'brown'),
    s('circle', { cx: 80, cy: 48, r: 12 }, 'skin'),
    s('path', { d: 'M70 46h20', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M90 66l14-30', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 106, cy: 32, r: 6 }, 'skin'),
    s('path', { d: star(80, 84, 8) }, 'yellow')
  ],
  'húngaro': [
    s('path', { d: 'M26 20v122', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 28, y: 24, width: 108, height: 24 }, 'red', { accent: true }),
    s('rect', { x: 28, y: 48, width: 108, height: 24 }, 'white'),
    s('rect', { x: 28, y: 72, width: 108, height: 24 }, 'green'),
    outline({ x: 28, y: 24, width: 108, height: 72 })
  ],
  incorrecto: [
    s('rect', { x: 20, y: 96, width: 120, height: 40, rx: 6 }, 'brown'),
    s('ellipse', { cx: 80, cy: 110, rx: 24, ry: 8 }, 'dark'),
    s('rect', { x: 62, y: 40, width: 36, height: 36, rx: 2, transform: 'rotate(12 80 58)' }, 'blue', { accent: true }),
    s('path', { d: 'M112 22l24 24M136 22l-24 24', ...SW(7) }, 'red', { stroke: true })
  ],
  inmortal: [
    s('path', { d: 'M40 140q-10-20 6-34q0 12 8 14q-4-24 16-36q-4 20 10 30q4-14 14-18q-6 18 8 26q4-8 12-10q-4 12 4 28z' }, 'orange'),
    s('path', { d: 'M80 98l-14 22M80 98v26M80 98l14 22', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M80 70Q50 30 18 34q22 14 30 34q14 10 32 8zM80 70q30-40 62-36q-22 14-30 34q-14 10-32 8z' }, 'red', { accent: true }),
    s('ellipse', { cx: 80, cy: 80, rx: 9, ry: 20 }, 'yellow'),
    s('circle', { cx: 80, cy: 54, r: 8 }, 'yellow'),
    s('path', { d: 'M76 56l4 8 4-8z' }, 'orange')
  ],
  interactuar: [
    ground(),
    ...person(32, 136, 'green'),
    ...person(128, 136, 'purple', { accent: true }),
    arrow('M54 70q26-24 52 0M94 70h12V58', 'orange', 5),
    arrow('M106 96q-26 24-52 0M66 96H54v12', 'blue', 5)
  ],
  jaula: [
    s('path', { d: 'M36 134V74a44 44 0 0 1 88 0v60M58 134V36M80 134V30M102 134V36M80 30v-8', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 18, r: 5, ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 30, y: 132, width: 100, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M48 108h64', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: ells([[78, 96, 14, 10]]) + 'M66 96l-12 6 4-10z' }, 'yellow', { accent: true }),
    s('circle', { cx: 90, cy: 84, r: 8 }, 'yellow'),
    s('path', { d: 'M97 82l7 3-7 3z' }, 'orange'),
    s('circle', { cx: 92, cy: 82, r: 1.8 }, 'dark')
  ],
  lozano: [
    s('path', { d: leaflet(80, 110, -90, 64, 16) + leaflet(80, 110, -130, 56, 16) + leaflet(80, 110, -50, 56, 16) + leaflet(80, 110, -160, 44, 12) + leaflet(80, 110, -20, 44, 12) }, 'green', { accent: true }),
    s('path', { d: 'M80 106V56', ...SW(2) }, 'mint', { stroke: true }),
    s('path', { d: 'M54 110h52l-6 30H60z' }, 'orange'),
    s('path', { d: sparkle(40, 36, 9) + sparkle(120, 30, 8) + sparkle(128, 76, 6) }, 'yellow')
  ],
  luto: [
    s('path', { d: 'M124 112v30', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(124, 112, -90, 32, 8) + leaflet(124, 112, -140, 26, 7) + leaflet(124, 112, -40, 26, 7) }, 'white', { accent: true }),
    s('path', { d: leaflet(124, 112, -90, 32, 8) + leaflet(124, 112, -140, 26, 7) + leaflet(124, 112, -40, 26, 7), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 132L80 60q8-22-8-34q-16 12-8 34l32 72', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'black', { stroke: true })
  ],
  masaje: [
    s('path', { d: 'M24 114v24M136 114v24', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 14, y: 104, width: 132, height: 10, rx: 4 }, 'brown'),
    s('circle', { cx: 30, cy: 92, r: 12 }, 'skin'),
    s('rect', { x: 44, y: 82, width: 96, height: 22, rx: 10 }, 'skin'),
    s('rect', { x: 104, y: 82, width: 36, height: 22, rx: 8 }, 'blue', { accent: true }),
    s('path', { d: 'M66 76l-6-46M96 76l6-46', ...SW(9) }, 'tan', { stroke: true }),
    s('path', { d: ells([[68, 80, 11, 6], [94, 80, 11, 6]]) }, 'tan'),
    s('path', { d: 'M50 64q-6-6 0-12M112 64q6-6 0-12', ...SW(3) }, 'gray', { stroke: true })
  ],
  mentalmente: [
    s('path', { d: 'M48 140v-24q-22-10-22-46q0-46 50-50q48 0 56 46l12 22-12 4v14q0 12-14 12h-14v22z' }, 'skin'),
    s('path', { d: ells([[76, 62, 30, 24]]) }, 'pink', { accent: true }),
    s('path', { d: 'M60 52q8 6 0 14M80 42q-6 10 4 16M90 66q-8 6-2 14M66 74q6 6 14 2', ...SW(3) }, 'red', { stroke: true }),
    s('circle', { cx: 120, cy: 66, r: 3 }, 'dark')
  ],
  mezclar: [
    s('path', { d: 'M96 74L132 18', ...SW(7) }, 'tan', { stroke: true }),
    s('path', { d: 'M20 76h120q-6 60-60 60q-54 0-60-60z' }, 'sky', { accent: true }),
    s('ellipse', { cx: 80, cy: 76, rx: 60, ry: 12 }, 'cream'),
    s('path', { d: 'M50 76a30 8 0 1 0 60 0a22 6 0 1 0-44 0a14 4 0 1 0 28 0', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M96 74l-6 6', ...SW(9) }, 'tan', { stroke: true })
  ],
  militancia: [
    ground(),
    s('path', { d: 'M30 102V36', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 14, y: 22, width: 36, height: 30, rx: 3 }, 'yellow'),
    ...person(56, 136, 'orange'),
    s('path', { d: 'M42 102H30', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M68 74l34-16v40l-34-14z' }, 'red', { accent: true }),
    s('path', { d: 'M110 64q8 14 0 28M120 56q12 22 0 44', ...SW(3) }, 'gray', { stroke: true })
  ],
  navegador: [
    s('rect', { x: 16, y: 24, width: 128, height: 112, rx: 8 }, 'white'),
    outline({ x: 16, y: 24, width: 128, height: 112, rx: 8 }),
    s('path', { d: 'M16 32a8 8 0 0 1 8-8h112a8 8 0 0 1 8 8v14H16z' }, 'gray'),
    s('path', { d: dots([[28, 35], [40, 35], [52, 35]], 4) }, 'red'),
    s('rect', { x: 64, y: 30, width: 72, height: 10, rx: 5 }, 'white'),
    s('circle', { cx: 80, cy: 92, r: 30 }, 'blue', { accent: true }),
    s('path', { d: 'M50 92h60M80 62v60M80 62q-20 30 0 60M80 62q20 30 0 60', ...SW(3) }, 'white', { stroke: true })
  ],
  oculto: [
    ground(),
    s('path', { d: ells([[44, 104, 30, 30], [80, 88, 36, 34], [116, 104, 30, 30]]) }, 'green', { accent: true }),
    s('path', { d: ells([[68, 84, 9, 11], [92, 84, 9, 11]]) }, 'white'),
    s('path', { d: dots([[70, 86], [94, 86]], 4) }, 'dark')
  ],
  pala: [
    s('path', { d: 'M88 22h24', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 22v72', ...SW(7) }, 'tan', { stroke: true }),
    s('path', { d: 'M84 92h32v20q0 14-16 20q-16-6-16-20z' }, 'gray', { accent: true }),
    s('path', { d: 'M26 136q54-44 120 0z' }, 'brown'),
    s('path', { d: dots([[40, 128], [62, 122], [128, 128]], 3) }, 'dark')
  ],
  paliza: [
    s('path', { d: 'M110 70L144 30', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 112L18 128M118 112l18 14', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: ells([[56, 80, 30, 26], [92, 70, 30, 28], [108, 100, 28, 24], [64, 108, 30, 22], [82, 92, 40, 30]]) }, 'gray'),
    s('path', { d: spiral(60, 86) + spiral(96, 100), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: star(36, 38, 11) + star(126, 134, 8) }, 'yellow', { accent: true })
  ],
  persa: [
    s('path', { d: Array.from({ length: 12 }, (_, i) => `M${36 + i * 8} 16v10M${36 + i * 8} 134v10`).join(''), ...SW(2) }, 'tan', { stroke: true }),
    s('rect', { x: 30, y: 26, width: 100, height: 108, rx: 2 }, 'red', { accent: true }),
    s('rect', { x: 40, y: 36, width: 80, height: 88, rx: 2, ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: 'M80 50l26 30-26 30-26-30z' }, 'yellow'),
    s('path', { d: 'M80 66l12 14-12 14-12-14z' }, 'navy'),
    s('path', { d: dots([[50, 46], [110, 46], [50, 114], [110, 114]], 5) }, 'yellow')
  ],
  polar: [
    backdrop('sky'),
    s('path', { d: 'M14 116h132v18a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'navy'),
    s('path', { d: 'M24 118l10-14h92l10 14z' }, 'white'),
    s('path', { d: ells([[74, 84, 38, 20], [116, 76, 16, 13]]) + rects([[46, 92, 12, 14], [62, 94, 12, 12], [86, 94, 12, 12], [100, 92, 12, 14]]) + dots([[110, 64], [122, 64]], 4) }, 'cream', { accent: true }),
    s('path', { d: dots([[130, 76]], 3) + dots([[118, 72]], 2) }, 'dark')
  ],
  prefectura: [
    backdrop('sky'),
    s('path', { d: poly([[40, 30], [80, 20], [110, 40], [120, 70], [110, 100], [130, 120], [100, 136], [60, 130], [36, 100], [42, 70]]) }, 'mint'),
    s('path', { d: poly([[80, 20], [110, 40], [120, 70], [76, 72]]) }, 'orange', { accent: true }),
    s('path', { d: 'M80 20L76 72L120 70M76 72L42 70M76 72L100 136', ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 96, cy: 52, r: 5 }, 'red')
  ],
  'privatización': [
    s('path', { d: 'M14 74l28-16 28 16z' }, 'gray'),
    s('path', { d: 'M22 76v40M34 76v40M46 76v40M58 76v40', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 16, y: 116, width: 52, height: 6 }, 'gray'),
    arrow('M74 98h16M84 92l6 6-6 6', 'orange', 4),
    s('rect', { x: 98, y: 84, width: 44, height: 38 }, 'tan'),
    s('path', { d: 'M94 86l26-22 26 22z' }, 'red'),
    s('path', { d: 'M114 100v-6a6 6 0 0 1 12 0v6', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 110, y: 100, width: 20, height: 16, rx: 2 }, 'yellow', { accent: true })
  ],
  psiquiatra: [
    ground(),
    s('path', { d: 'M14 112h84v20H14zM14 112V84q0-8 8-8h8v36z' }, 'purple'),
    s('circle', { cx: 40, cy: 100, r: 10 }, 'skin'),
    s('rect', { x: 50, y: 98, width: 48, height: 14, rx: 7 }, 'blue'),
    ...person(124, 136, 'white', { h: 48, w: 30, r: 13 }),
    outline({ x: 109, y: 88, width: 30, height: 48, rx: 10 }),
    s('rect', { x: 100, y: 96, width: 16, height: 22, rx: 2 }, 'brown', { accent: true })
  ],
  rencor: [
    s('path', { d: 'M58 36q-5-5 0-10t0-10M100 36q-5-5 0-10t0-10M79 32q-5-5 0-10', ...SW(3) }, 'purple', { stroke: true }),
    s('path', { d: heart(80, 100, 32) }, 'green', { accent: true }),
    s('path', { d: dots([[58, 76], [104, 100], [72, 118]], 5) }, 'brown'),
    s('path', { d: 'M64 80l10 4M96 80l-10 4M70 104q10-8 20 0', ...SW(4) }, 'dark', { stroke: true })
  ],
  representativo: [
    s('path', { d: 'M60 14h40l20 132H40z', opacity: 0.35 }, 'yellow'),
    s('path', { d: busts([30, 54, 106, 130], 112, 22, 22) }, 'gray'),
    s('path', { d: dots([[30, 80], [54, 80], [106, 80], [130, 80]], 9) }, 'skin'),
    s('path', { d: busts([80], 146, 44, 40) }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 90, r: 16 }, 'skin'),
    s('path', { d: star(80, 128, 8) }, 'yellow')
  ],
  retomar: [
    s('path', { d: 'M126 80a46 46 0 1 1-14-33', ...SW(8) }, 'green', { stroke: true }),
    s('path', { d: 'M100 32l24 6-6 24z' }, 'green'),
    s('path', { d: 'M68 58l34 22-34 22z' }, 'orange', { accent: true })
  ],
  sembrar: [
    s('path', { d: 'M14 112q66-12 132 0v30H14z' }, 'brown'),
    s('path', { d: 'M24 124q56-8 112 0M24 136q56-8 112 0', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M40 112v-10M40 106l-6-4M40 106l6-4M62 108v-10M62 102l-6-4M62 102l6-4', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M146 30L108 52', ...SW(14) }, 'skin', { stroke: true }),
    s('ellipse', { cx: 100, cy: 58, rx: 12, ry: 9 }, 'skin'),
    s('path', { d: dots([[92, 74], [100, 84], [86, 90], [96, 100], [106, 94]], 3) }, 'yellow', { accent: true })
  ],
  sucursal: [
    s('path', { d: 'M80 78v22M80 88H34v12M80 88h46v12', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 58, y: 22, width: 44, height: 56 }, 'navy', { accent: true }),
    s('path', { d: grid(64, 28, 3, 4, 8, 8, 12, 12) }, 'sky'),
    s('path', { d: rects([[16, 100, 36, 36], [62, 100, 36, 36], [108, 100, 36, 36]]) }, 'blue'),
    s('path', { d: rects([[28, 118, 12, 18], [74, 118, 12, 18], [120, 118, 12, 18]]) }, 'cream')
  ],
  suscriptor: [
    s('path', { d: 'M76 136V100', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M36 60a20 20 0 0 1 20-20h52a20 20 0 0 1 20 20v40H36z' }, 'blue', { accent: true }),
    s('path', { d: 'M36 60a20 20 0 0 1 40 0v40H36z' }, 'navy'),
    s('path', { d: 'M118 76V36', ...SW(4) }, 'red', { stroke: true }),
    s('rect', { x: 118, y: 36, width: 16, height: 12 }, 'red'),
    s('rect', { x: 20, y: 66, width: 30, height: 24, transform: 'rotate(-10 35 78)' }, 'yellow'),
    s('path', { d: 'M26 72h18M26 80h12', ...SW(3), transform: 'rotate(-10 35 78)' }, 'orange', { stroke: true })
  ],
  torpe: [
    ground(),
    s('path', { d: 'M48 136a10 8 0 0 1 20 0z' }, 'gray'),
    ...lean(70, 136, 40, 'orange', { accent: true }),
    s('path', { d: 'M96 100l18-18M92 104l26 2', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M124 44h16l-2 16h-12z', transform: 'rotate(30 132 52)' }, 'red'),
    s('path', { d: drop(124, 78, 3) + drop(136, 80, 3) }, 'sky'),
    s('path', { d: sparkle(116, 116, 6) }, 'yellow')
  ],
  valla: [
    ground(),
    s('path', { d: [22, 48, 74, 100, 126].map(x => `M${x} 136V60l8-10 8 10v76z`).join('') }, 'tan', { accent: true }),
    s('path', { d: 'M14 82h132M14 112h132', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 136l4-8 4 8M92 136l4-8 4 8M118 136l4-8 4 8', ...SW(3) }, 'green', { stroke: true })
  ],
  ambicioso: [
    s('path', { d: 'M14 136l52-78 26 32 18-22 36 68z' }, 'gray'),
    s('path', { d: 'M54 76l12-18 12 18-6-2-6 4-6-4z' }, 'white'),
    ...person(66, 58, 'red', { h: 22, w: 16, r: 8 }),
    s('path', { d: 'M72 40l24-14', ...SW(4) }, 'skin', { stroke: true }),
    s('path', { d: star(118, 30, 14) }, 'yellow', { accent: true })
  ],
  'anatomía': [
    s('circle', { cx: 80, cy: 30, r: 16 }, 'skin'),
    s('path', { d: 'M44 146v-70q0-22 22-28h28q22 6 22 28v70z' }, 'skin'),
    s('path', { d: 'M80 62v80', ...DASH(3, '4 4') }, 'tan', { stroke: true }),
    s('path', { d: ells([[66, 86, 12, 22], [94, 86, 12, 22]]) }, 'pink'),
    s('path', { d: heart(84, 92, 8) }, 'red', { accent: true })
  ],
  'anécdota': [
    ...person(40, 136, 'orange'),
    ...person(124, 136, 'green'),
    s('path', { d: bubble(44, 16, 80, 52) }, 'white'),
    s('path', { d: bubble(44, 16, 80, 52), ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 84, cy: 40, r: 15 }, 'yellow', { accent: true }),
    s('path', { d: 'M76 42q8 10 16 0zM76 34q3-3 6 0M86 34q3-3 6 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M118 83q6 5 12 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  arbitraje: [
    ground(),
    ...person(64, 136, 'black', { h: 50, w: 32, r: 13 }),
    s('path', { d: 'M78 96L104 60', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 98, y: 26, width: 22, height: 30, rx: 3, transform: 'rotate(10 109 41)' }, 'yellow', { accent: true }),
    s('path', { d: 'M64 84q8 12 14 6', ...SW(2) }, 'white', { stroke: true }),
    s('rect', { x: 74, y: 86, width: 10, height: 6, rx: 2 }, 'gray')
  ],
  bailarina: [
    s('path', { d: 'M76 104l-2 36M84 104l12 16-12 12', ...SW(4) }, 'skin', { stroke: true }),
    s('path', { d: 'M74 64Q56 40 76 24M86 64q18-24-2-40', ...SW(4) }, 'skin', { stroke: true }),
    s('path', { d: 'M72 62h16l-2 36H74z' }, 'pink'),
    s('ellipse', { cx: 80, cy: 100, rx: 36, ry: 9 }, 'pink', { accent: true }),
    s('circle', { cx: 80, cy: 48, r: 11 }, 'skin'),
    s('circle', { cx: 80, cy: 34, r: 6 }, 'brown')
  ],
  biodiversidad: [
    backdrop('mint'),
    s('path', { d: 'M44 66v20', ...SW(5) }, 'brown', { stroke: true }),
    s('circle', { cx: 44, cy: 48, r: 20 }, 'green'),
    s('path', { d: fishes([[112, 116]]) }, 'blue'),
    s('path', { d: ells([[106, 42, 10, 13], [126, 42, 10, 13]]) }, 'orange', { accent: true }),
    s('path', { d: 'M116 32v22', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[38, 108], [50, 108], [44, 98], [44, 118]], 7) }, 'pink'),
    s('circle', { cx: 44, cy: 108, r: 5 }, 'yellow'),
    s('path', { d: birds([[80, 80], [96, 70]]), ...SW(3) }, 'dark', { stroke: true })
  ],
  calcio: [
    s('path', { d: 'M38 136V70l8-14V40h20v16l8 14v66z' }, 'white'),
    s('path', { d: 'M38 136V70l8-14V40h20v16l8 14v66z', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 44, y: 32, width: 24, height: 10, rx: 2 }, 'blue', { accent: true }),
    s('rect', { x: 38, y: 86, width: 36, height: 28 }, 'sky'),
    s('path', { d: dots([[106, 52], [124, 52], [106, 124], [124, 124]], 9) + 'M108 52h14v72h-14z' }, 'cream'),
    s('path', { d: dots([[106, 52], [124, 52], [106, 124], [124, 124]], 9) + 'M108 52h14v72h-14z', ...SW(2) }, 'tan', { stroke: true })
  ],
  cargador: [
    s('path', { d: 'M30 30V16M46 30V16', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 70q0 56 40 56t36-6', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 20, y: 30, width: 36, height: 40, rx: 6 }, 'white'),
    outline({ x: 20, y: 30, width: 36, height: 40, rx: 6 }),
    s('rect', { x: 92, y: 40, width: 44, height: 80, rx: 8 }, 'dark'),
    s('rect', { x: 98, y: 48, width: 32, height: 60, rx: 2 }, 'sky'),
    s('path', { d: 'M118 58l-10 22h8l-4 18 12-24h-8z' }, 'yellow', { accent: true })
  ],
  cuervo: [
    s('path', { d: 'M14 116q60-6 132 4', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: 'M76 110v8M88 110v8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 96l-26 14 6-18z' }, 'black'),
    s('path', { d: 'M42 96q10-34 50-34q20 0 26 16l18 6-18 6q-6 14-30 18q-20 4-46-12z' }, 'black', { accent: true }),
    s('path', { d: 'M58 88q20-6 40 4', ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 104, cy: 74, r: 3 }, 'white')
  ],
  desperdicio: [
    s('path', { d: 'M48 72q12-22 30-10q20-18 34 10z' }, 'brown'),
    s('path', { d: 'M78 70q-6-26 10-32q-2 18 6 32z' }, 'yellow', { accent: true }),
    s('path', { d: 'M56 62q-6-10 4-16q8 6 2 16z' }, 'red'),
    s('path', { d: 'M38 70h84l-8 66H46z' }, 'gray'),
    s('path', { d: 'M60 82v44M80 82v44M100 82v44', ...SW(3) }, 'white', { stroke: true }),
    s('rect', { x: 30, y: 62, width: 100, height: 10, rx: 4, transform: 'rotate(-14 30 72)' }, 'dark'),
    s('path', { d: 'M118 40q-6-6 0-12M130 44q-6-6 0-12', ...SW(3) }, 'green', { stroke: true })
  ],
  docencia: [
    s('rect', { x: 18, y: 20, width: 124, height: 60, rx: 4 }, 'green'),
    s('path', { d: 'M30 36h50M30 50h70M30 64h40', ...SW(3) }, 'white', { stroke: true }),
    ...person(118, 104, 'navy', { h: 38, w: 26, r: 11 }),
    s('path', { d: 'M106 76L86 54', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: busts([34, 64, 94], 146, 24, 24) }, 'orange', { accent: true }),
    s('path', { d: dots([[34, 114], [64, 114], [94, 114]], 10) }, 'skin')
  ],
  elenco: [
    s('rect', { x: 14, y: 126, width: 132, height: 14 }, 'brown'),
    s('path', { d: rects([[42, 98, 16, 28], [62, 98, 16, 28], [82, 98, 16, 28], [102, 98, 16, 28]]) }, 'blue'),
    s('path', { d: dots([[50, 88], [70, 88], [90, 88], [110, 88]], 8) }, 'skin'),
    s('path', { d: 'M14 14h28q-4 60 6 120H14zM146 14h-28q4 60-6 120h34z' }, 'red'),
    s('path', { d: 'M14 14h132v16q-16 8-33 0t-33 0-33 0-33 0z' }, 'red', { accent: true }),
    s('path', { d: sparkle(80, 52, 8) }, 'yellow')
  ],
  empuje: [
    ground(),
    s('rect', { x: 86, y: 66, width: 56, height: 70, rx: 4 }, 'brown', { accent: true }),
    s('path', { d: 'M86 84h56M114 66v18', ...SW(4) }, 'tan', { stroke: true }),
    ...lean(40, 136, 35, 'blue'),
    s('path', { d: 'M64 104l22-4', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M18 86h12M14 100h12', ...SW(3) }, 'gray', { stroke: true }),
    arrow('M96 50h30M118 42l8 8-8 8', 'orange', 5)
  ],
  'erupción': [
    s('path', { d: ells([[80, 40, 22, 14], [60, 30, 14, 10], [100, 28, 14, 10]]) }, 'gray'),
    s('path', { d: 'M14 136l46-72h40l46 72z' }, 'brown'),
    s('path', { d: 'M60 64h40l-6 10-8-4-6 14-6-12-6 6z' }, 'red'),
    s('path', { d: 'M72 70q-6 30-20 42h8q14-14 18-42z' }, 'orange'),
    s('path', { d: drop(48, 54, 5) + drop(114, 50, 5) + drop(34, 76, 4) }, 'orange', { accent: true })
  ],
  'especificación': [
    backdrop('navy'),
    s('rect', { x: 48, y: 36, width: 64, height: 76, rx: 8, ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: ring(80, 80, 16), ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 50, r: 4 }, 'orange', { accent: true }),
    s('path', { d: 'M48 128h64M48 122v12M112 122v12M126 36v76M120 36h12M120 112h12', ...SW(2) }, 'sky', { stroke: true })
  ],
  espionaje: [
    s('path', { d: busts([80], 146, 76, 56) }, 'tan'),
    s('path', { d: 'M62 92l18 20 18-20', ...SW(5) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 78, r: 22 }, 'skin'),
    s('path', { d: 'M46 62h68v6H46zM58 62q0-24 22-24t22 24z' }, 'dark'),
    s('path', { d: dots([[68, 80], [92, 80]], 11) + 'M74 76h12v8H74z' }, 'black', { accent: true }),
    s('path', { d: dots([[68, 80], [92, 80]], 5) }, 'sky')
  ],
  egipcio: [
    backdrop('cream'),
    s('circle', { cx: 116, cy: 40, r: 14 }, 'orange'),
    s('path', { d: 'M20 120l40-62 40 62z' }, 'yellow', { accent: true }),
    s('path', { d: 'M60 58l40 62H80z' }, 'orange'),
    s('path', { d: 'M84 120l28-40 28 40z' }, 'tan'),
    s('rect', { x: 14, y: 120, width: 132, height: 26, rx: 0 }, 'tan'),
    s('path', { d: CAMEL, transform: 'translate(70 76) scale(0.5)' }, 'brown')
  ],
  estallar: [
    s('path', { d: burst(80, 80, 64, 34, 12) }, 'red', { accent: true }),
    s('path', { d: burst(80, 80, 42, 22, 10) }, 'orange'),
    s('path', { d: burst(80, 80, 22, 12, 8) }, 'yellow'),
    s('path', { d: rects([[20, 30, 8, 8], [130, 120, 8, 8], [128, 28, 6, 6], [24, 124, 6, 6]]) }, 'dark')
  ],
  eternamente: [
    s('path', { d: 'M80 80c-18-26-56-26-56 0s38 26 56 0 56-26 56 0-38 26-56 0z', ...SW(12) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: sparkle(80, 36, 10) + sparkle(30, 124, 7) + sparkle(130, 126, 8) }, 'yellow'),
    s('path', { d: 'M80 80c-18-26-56-26-56 0', ...SW(4) }, 'pink', { stroke: true })
  ],
  'fósil': [
    s('path', { d: 'M22 40q30-26 70-16t48 40q6 40-24 64t-70 8q-30-20-28-56t4-40z' }, 'tan'),
    s('path', { d: 'M80 80a4 4 0 0 1 8 0a10 10 0 0 1-20 0a16 16 0 0 1 32 0a22 22 0 0 1-44 0a28 28 0 0 1 56 0', ...SW(5) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M98 66l10-8M102 82l12 0M96 98l10 8M80 108v12M62 98l-8 8', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: dots([[36, 112], [124, 52], [40, 58]], 4) }, 'gray')
  ],
  gerencia: [
    s('rect', { x: 46, y: 30, width: 68, height: 80, rx: 14 }, 'dark'),
    s('path', { d: busts([80], 118, 56, 40) }, 'navy'),
    s('path', { d: 'M74 80l6 6 6-6-4 30h-4z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 60, r: 18 }, 'skin'),
    s('rect', { x: 14, y: 112, width: 132, height: 30, rx: 4 }, 'brown'),
    s('rect', { x: 58, y: 98, width: 44, height: 14, rx: 2 }, 'yellow')
  ],
  hito: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 136l34-80h12l34 80z' }, 'gray'),
    s('path', { d: 'M74 56h12l4 10H70z' }, 'white'),
    s('path', { d: 'M54 136V58a26 26 0 0 1 52 0v78z' }, 'white'),
    s('path', { d: 'M54 136V58a26 26 0 0 1 52 0v78z', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 58a26 26 0 0 1 52 0v8H54z' }, 'red', { accent: true }),
    s('path', { d: 'M66 92h28M66 106h20', ...SW(4) }, 'gray', { stroke: true })
  ],
  'hábil': [
    ...person(80, 136, 'purple', { accent: true }),
    s('path', { d: 'M66 100L46 76M94 100l20-24', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M44 62Q80 0 116 62', ...DASH(2, '4 5') }, 'gray', { stroke: true }),
    s('circle', { cx: 46, cy: 62, r: 9 }, 'red'),
    s('circle', { cx: 80, cy: 26, r: 9 }, 'yellow'),
    s('circle', { cx: 114, cy: 62, r: 9 }, 'blue')
  ],
  'invención': [
    ...gear(112, 112, 16, 8, 'gray'),
    s('circle', { cx: 70, cy: 62, r: 34 }, 'yellow', { accent: true }),
    s('path', { d: 'M56 94h28v14H56zM60 112h20v6H60z' }, 'gray'),
    s('path', { d: 'M62 80l8-18 8 18', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: rays(70, 62, 42, 52, 6, -150), ...SW(4) }, 'orange', { stroke: true })
  ],
  involucrar: [
    s('circle', { cx: 92, cy: 84, r: 44 }, 'mint'),
    s('path', { d: busts([78, 108], 116, 22, 24) + busts([92], 126, 22, 24) }, 'blue'),
    s('path', { d: dots([[78, 82], [108, 82], [92, 92]], 9) }, 'skin'),
    s('path', { d: 'M92 84c-40-30-62 10-46 26s30-10 4-20', ...SW(4) }, 'brown', { stroke: true }),
    ...person(28, 136, 'orange', { h: 34, w: 22, r: 10, accent: true }),
    arrow('M44 112l14-6M50 98l8 8-10 4', 'orange', 4)
  ],
  lapso: [
    s('rect', { x: 72, y: 16, width: 16, height: 10, rx: 2 }, 'dark'),
    s('circle', { cx: 80, cy: 84, r: 52 }, 'white'),
    s('path', { d: wedge(80, 84, 46, -90, 30) }, 'sky', { accent: true }),
    s('circle', { cx: 80, cy: 84, r: 52, ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 84V42M80 84l36 22', ...SW(5) }, 'red', { stroke: true }),
    s('circle', { cx: 80, cy: 84, r: 5 }, 'dark')
  ],
  lomo: [
    s('ellipse', { cx: 80, cy: 116, rx: 66, ry: 18 }, 'tan'),
    s('path', { d: 'M28 98q0-40 52-40t44 40z' }, 'brown', { accent: true }),
    s('path', { d: 'M36 98q4-26 44-28', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M104 112l14-36h14l-12 38z' }, 'pink'),
    s('path', { d: 'M104 112l14-36h14l-12 38z', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M16 52l36 30', ...SW(4) }, 'gray', { stroke: true })
  ],
  mediocre: [
    s('path', { d: 'M24 110a56 56 0 0 1 112 0', ...SW(16, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 110a56 56 0 0 1 32-50', ...SW(16, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true }),
    s('path', { d: 'M136 110a56 56 0 0 0-32-50', ...SW(16, { 'stroke-linecap': 'butt' }) }, 'green', { stroke: true }),
    s('path', { d: 'M80 110V60', ...SW(5) }, 'dark', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 110, r: 8 }, 'dark')
  ],
  monja: [
    s('path', { d: 'M40 146l14-80q26-16 52 0l14 80z' }, 'black', { accent: true }),
    s('path', { d: 'M56 52a24 24 0 0 1 48 0v34H56z' }, 'black'),
    s('circle', { cx: 80, cy: 58, r: 17 }, 'skin'),
    s('path', { d: 'M62 50a18 18 0 0 1 36 0', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M64 84q16 14 32 0l-4 8q-12 8-24 0z' }, 'white'),
    s('path', { d: dots([[74, 58], [86, 58]], 2) }, 'dark')
  ],
  mural: [
    s('rect', { x: 14, y: 24, width: 132, height: 96 }, 'tan'),
    s('path', { d: 'M26 34h108v74H26z' }, 'sky'),
    s('path', { d: 'M26 108l30-38 22 22 16-14 40 30z' }, 'green', { accent: true }),
    s('circle', { cx: 112, cy: 52, r: 10 }, 'yellow'),
    s('path', { d: 'M14 120h132', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 30, y: 122, width: 20, height: 18, rx: 2 }, 'red'),
    s('path', { d: 'M110 140l20-26', ...SW(5) }, 'brown', { stroke: true })
  ],
  neurona: [
    s('path', { d: 'M74 70L40 34M74 70L26 76M80 64l4-46M86 70l30-30M80 80l10 20 40 30', ...SW(5) }, 'purple', { stroke: true }),
    s('path', { d: 'M40 34l-8-8M40 34l-12 2M26 76l-8-8M26 76l-6 10M84 18l-8-4M84 18l8-4M116 40l4-12M116 40l12 0M130 130l8-2M130 130l0 10', ...SW(3) }, 'purple', { stroke: true }),
    s('circle', { cx: 80, cy: 72, r: 16 }, 'pink', { accent: true }),
    s('circle', { cx: 80, cy: 72, r: 6 }, 'purple'),
    s('path', { d: 'M96 106l6 4M106 114l6 4M116 122l6 4', ...SW(7) }, 'yellow', { stroke: true })
  ],
  nevada: [
    backdrop('navy'),
    s('path', { d: 'M14 112q66-16 132 0v22a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'white', { accent: true }),
    s('path', { d: 'M48 104l24-44 24 44z' }, 'green'),
    s('path', { d: 'M60 82l12-22 12 22-12-4z' }, 'white'),
    s('path', { d: dots([[28, 30], [52, 46], [100, 28], [126, 50], [118, 84], [30, 72], [136, 26], [78, 36]], 4) }, 'white'),
    s('path', { d: sparkle(112, 64, 8) + sparkle(34, 50, 6) }, 'sky')
  ],
  noticiero: [
    s('rect', { x: 14, y: 22, width: 132, height: 96, rx: 8 }, 'dark'),
    s('rect', { x: 22, y: 30, width: 116, height: 80, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: busts([68], 98, 34, 30) }, 'navy'),
    s('circle', { cx: 68, cy: 58, r: 12 }, 'skin'),
    s('rect', { x: 22, y: 92, width: 116, height: 18 }, 'red'),
    s('path', { d: 'M30 101h50', ...SW(4) }, 'white', { stroke: true }),
    s('rect', { x: 98, y: 40, width: 30, height: 22, rx: 2 }, 'sky'),
    s('path', { d: 'M60 118l-10 20h60l-10-20', ...SW(5) }, 'dark', { stroke: true })
  ],
  novelista: [
    s('path', { d: rects([[22, 112, 70, 10], [26, 102, 62, 10], [20, 122, 76, 12]]) }, 'brown'),
    s('path', { d: 'M22 112h70M26 102h62', ...SW(2) }, 'cream', { stroke: true }),
    ...person(118, 136, 'purple', { h: 46, w: 30, r: 13 }),
    s('path', { d: 'M104 104L86 70', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M86 72q-20-30-6-56q12 22 6 56z' }, 'white', { accent: true }),
    s('path', { d: 'M86 72q-20-30-6-56q12 22 6 56z', ...SW(2) }, 'gray', { stroke: true })
  ],
  nuca: [
    s('rect', { x: 62, y: 96, width: 36, height: 40 }, 'skin'),
    s('path', { d: busts([80], 146, 100, 30) }, 'blue'),
    s('circle', { cx: 80, cy: 66, r: 38 }, 'brown'),
    s('path', { d: ells([[42, 70, 6, 10], [118, 70, 6, 10]]) }, 'skin'),
    s('ellipse', { cx: 80, cy: 110, rx: 14, ry: 8 }, 'red', { accent: true }),
    s('path', { d: 'M104 124l14-10M108 132l18-6', ...SW(3) }, 'orange', { stroke: true })
  ],
  ordenanza: [
    s('rect', { x: 34, y: 28, width: 92, height: 104 }, 'cream'),
    s('path', { d: 'M28 22h104v12H28zM28 126h104v12H28z' }, 'tan'),
    s('path', { d: 'M28 22h104v12H28zM28 126h104v12H28z', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M46 50h68M46 64h68M46 78h52', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: burst(98, 104, 16, 12, 10) }, 'red', { accent: true }),
    s('path', { d: 'M92 116l-6 18M104 116l6 18', ...SW(5) }, 'red', { stroke: true })
  ],
  panda: [
    s('path', { d: busts([34, 126], 140, 26, 32) }, 'orange'),
    s('path', { d: busts([62, 98], 140, 28, 40) }, 'blue', { accent: true }),
    s('path', { d: dots([[34, 92], [126, 92]], 11) + dots([[62, 82], [98, 82]], 12) }, 'skin'),
    s('path', { d: 'M44 112h8M108 112h8M74 106h12', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M28 96q6 5 12 0M120 96q6 5 12 0M56 86q6 5 12 0M92 86q6 5 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: heart(80, 40, 10) }, 'red')
  ],
  panza: [
    s('path', { d: 'M66 136v-8M94 136v-8', ...SW(8) }, 'navy', { stroke: true }),
    s('ellipse', { cx: 80, cy: 98, rx: 42, ry: 34 }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 46, r: 18 }, 'skin'),
    s('path', { d: 'M72 50q8 6 16 0', ...SW(2) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 100, cy: 100, rx: 12, ry: 8 }, 'skin'),
    s('path', { d: 'M80 104a3 3 0 0 1 0 1', ...SW(4) }, 'brown', { stroke: true })
  ],
  parra: [
    s('path', { d: 'M24 136V40M136 136V40', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M18 40h124M30 54h100', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(40, 42, 70, 26, 10) + leaflet(70, 42, 110, 26, 10) + leaflet(100, 42, 60, 26, 10) + leaflet(124, 42, 120, 26, 10) }, 'green'),
    s('path', { d: dots([[56, 66], [64, 66], [60, 74], [52, 74], [68, 74], [56, 82], [64, 82], [60, 90]], 5) }, 'purple', { accent: true }),
    s('path', { d: dots([[104, 70], [112, 70], [108, 78], [100, 78], [116, 78], [104, 86], [112, 86], [108, 94]], 5) }, 'purple')
  ],
  plasma: [
    s('path', { d: 'M56 120h48l8 18H48z' }, 'dark'),
    s('circle', { cx: 80, cy: 72, r: 52 }, 'navy'),
    s('path', { d: 'M80 72l-20-30-8-12M80 72l32-14 14 6M80 72l-26 22-10 18M80 72l20 30 10 4M80 72l4-40', ...SW(3) }, 'pink', { stroke: true }),
    s('circle', { cx: 80, cy: 72, r: 10 }, 'purple', { accent: true }),
    s('circle', { cx: 80, cy: 72, r: 52, ...SW(3) }, 'sky', { stroke: true })
  ],
  'pornografía': [
    s('rect', { x: 34, y: 22, width: 74, height: 100, rx: 4 }, 'pink'),
    s('rect', { x: 46, y: 56, width: 50, height: 16 }, 'black'),
    s('circle', { cx: 108, cy: 106, r: 30 }, 'white'),
    s('path', { d: ring(108, 106, 26) + 'M90 88l36 36', ...SW(8) }, 'red', { stroke: true, accent: true })
  ],
  posicionamiento: [
    s('circle', { cx: 80, cy: 88, r: 48 }, 'sky'),
    s('path', { d: ring(80, 88, 48) + ring(80, 88, 24) + 'M80 28v28M80 120v28M20 88h28M112 88h28', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: 'M80 88q-18-22-18-34a18 18 0 0 1 36 0q0 12-18 34z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 54, r: 7 }, 'white')
  ],
  'preservación': [
    s('path', { d: 'M80 104V70', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 80, -140, 30, 10) + leaflet(80, 74, -40, 30, 10) }, 'green', { accent: true }),
    s('rect', { x: 64, y: 100, width: 32, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M22 120q0-40 30-56l10 8q-16 18-10 44zM138 120q0-40-30-56l-10 8q16 18 10 44z' }, 'skin'),
    s('path', { d: 'M22 120h116v8H22z' }, 'skin'),
    s('path', { d: ring(80, 76, 54), ...DASH(3, '6 6') }, 'sky', { stroke: true })
  ],
  progresivo: [
    s('path', { d: 'M18 136h126', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[22, 116, 18, 20], [46, 104, 18, 32]]) }, 'mint'),
    s('path', { d: rects([[70, 88, 18, 48], [94, 70, 18, 66]]) }, 'green'),
    s('rect', { x: 118, y: 48, width: 18, height: 88 }, 'blue', { accent: true }),
    arrow('M26 96L108 26M92 26h16v16', 'orange', 5)
  ],
  promocional: [
    s('path', { d: burst(110, 46, 30, 22, 12) }, 'red', { accent: true }),
    s('path', { d: star(110, 46, 12) }, 'yellow'),
    s('path', { d: 'M20 96l40-40h46v46l-40 40z' }, 'orange'),
    s('circle', { cx: 94, cy: 70, r: 6 }, 'white'),
    s('path', { d: 'M94 70q-20-30-46-18', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 100l20-20M58 110l20-20', ...SW(4) }, 'white', { stroke: true })
  ],
  prudente: [
    s('rect', { x: 14, y: 116, width: 132, height: 26 }, 'dark'),
    s('path', { d: 'M86 120h12M104 120h12M122 120h12M86 132h12M104 132h12M122 132h12', ...SW(6) }, 'white', { stroke: true }),
    s('rect', { x: 120, y: 24, width: 20, height: 44, rx: 6 }, 'dark'),
    s('path', { d: 'M130 68v48', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 130, cy: 36, r: 7 }, 'red', { accent: true }),
    s('circle', { cx: 130, cy: 56, r: 7 }, 'gray'),
    ...person(54, 116, 'green'),
    s('path', { d: 'M66 64h14', ...SW(5) }, 'skin', { stroke: true })
  ],
  pureza: [
    s('path', { d: drop(80, 92, 40) }, 'sky', { accent: true }),
    s('path', { d: 'M60 86q0-16 12-24', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: sparkle(122, 40, 12) + sparkle(34, 56, 8) + sparkle(124, 118, 7) }, 'yellow')
  ],
  reportero: [
    ...person(80, 136, 'brown', { h: 50, w: 34, r: 14 }),
    s('rect', { x: 54, y: 82, width: 52, height: 34, rx: 5 }, 'dark'),
    s('circle', { cx: 80, cy: 99, r: 11 }, 'sky', { accent: true }),
    s('rect', { x: 92, y: 76, width: 10, height: 6 }, 'gray'),
    s('path', { d: 'M64 56q16-14 32 0z' }, 'navy'),
    s('path', { d: rays(80, 99, 30, 40, 6, -150), ...SW(3) }, 'yellow', { stroke: true })
  ],
  retener: [
    s('path', { d: 'M90 70Q84 100 82 116', ...SW(2) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 92, cy: 44, rx: 24, ry: 28 }, 'red', { accent: true }),
    s('path', { d: 'M88 72l4-6 4 6z' }, 'red'),
    s('path', { d: 'M62 140l14-26', ...SW(14) }, 'skin', { stroke: true }),
    s('rect', { x: 70, y: 110, width: 22, height: 16, rx: 7 }, 'skin'),
    s('path', { d: 'M40 40l14 4M36 56h14', ...SW(3) }, 'gray', { stroke: true })
  ],
  suavemente: [
    s('path', { d: 'M40 132Q60 70 124 28', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 132Q36 70 98 36q30-12 26-8q-6 30-36 64q-26 28-48 40z' }, 'sky', { accent: true }),
    s('path', { d: 'M72 92l-14-6M86 74l-14-8M100 56l-12-8M70 98l14 2M84 82l14 2', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M24 70q10-6 20 0M110 120q10-6 20 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  'subterráneo': [
    s('rect', { x: 14, y: 14, width: 132, height: 36, rx: 0 }, 'sky'),
    s('rect', { x: 14, y: 50, width: 132, height: 96 }, 'brown'),
    s('path', { d: 'M14 50h132', ...SW(4) }, 'green', { stroke: true }),
    s('rect', { x: 14, y: 80, width: 132, height: 52 }, 'dark'),
    s('rect', { x: 26, y: 88, width: 100, height: 34, rx: 10 }, 'yellow', { accent: true }),
    s('path', { d: grid(36, 96, 4, 1, 14, 12, 22, 0) }, 'sky'),
    s('path', { d: 'M28 56v24', ...SW(6) }, 'gray', { stroke: true })
  ],
  tacto: [
    s('path', { d: ring(80, 120, 14) + ring(80, 120, 26), ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M72 118V44a8 8 0 0 1 16 0v30h22a10 10 0 0 1 10 10v20q0 34-30 34H72z' }, 'skin', { accent: true }),
    s('path', { d: 'M88 74v20M102 76v18', ...SW(3) }, 'tan', { stroke: true })
  ],
  tapar: [
    s('path', { d: 'M30 88h100v40a10 10 0 0 1-10 10H40a10 10 0 0 1-10-10z' }, 'red', { accent: true }),
    s('path', { d: 'M18 98h12M130 98h12', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 62q52-24 104 0z' }, 'gray'),
    s('rect', { x: 72, y: 44, width: 16, height: 8, rx: 3 }, 'dark'),
    arrow('M80 66v14M72 72l8 8 8-8', 'orange', 4),
    s('path', { d: 'M54 34q-4-8 0-14M106 34q-4-8 0-14', ...SW(3) }, 'gray', { stroke: true })
  ],
  'travesía': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 40q20-10 26 10t-26 30zM146 100q-22 6-22 22t22 24z' }, 'green'),
    s('path', { d: 'M40 58Q80 70 96 110', ...DASH(3, '6 6') }, 'navy', { stroke: true }),
    s('path', { d: 'M62 96h40l-6 10H68z' }, 'red', { accent: true }),
    s('path', { d: 'M82 94V70l14 20z' }, 'white')
  ],
  vestimenta: [
    s('path', { d: 'M40 24l-24 14 8 16 12-6v44h44V48l12 6 8-16-24-14q-14 10-36 0z' }, 'blue', { accent: true }),
    s('path', { d: 'M100 70h40l4 70h-18l-6-48-6 48H96z' }, 'navy'),
    s('path', { d: 'M24 120h28v12H18zM56 120h28l6 12H56z' }, 'brown'),
    s('path', { d: 'M110 30h22v14h-22zM104 44h34', ...SW(4) }, 'red', { stroke: true })
  ],
  'óseo': [
    backdrop('sky'),
    s('path', { d: 'M80 18v124', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 66h-16M102 66h16M58 86h-16M102 86h16', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: ells([[80, 26, 16, 8], [80, 46, 20, 8], [80, 66, 22, 8], [80, 86, 22, 8], [80, 106, 20, 8], [80, 126, 16, 8]]) }, 'white', { accent: true }),
    s('path', { d: ells([[80, 26, 16, 8], [80, 46, 20, 8], [80, 66, 22, 8], [80, 86, 22, 8], [80, 106, 20, 8], [80, 126, 16, 8]]), ...SW(2) }, 'navy', { stroke: true })
  ],
  adivinar: [
    s('path', { d: 'M48 136l8-18h48l8 18z' }, 'brown'),
    s('circle', { cx: 80, cy: 76, r: 42 }, 'purple', { accent: true }),
    s('path', { d: sparkle(70, 70, 12) + sparkle(94, 92, 7) }, 'white'),
    s('path', { d: 'M58 50q10-12 26-12', ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: 'M26 110q10-14 24-6M134 110q-10-14-24-6', ...SW(8) }, 'skin', { stroke: true })
  ],
  amplitud: [
    s('path', { d: 'M14 80h132', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 80q15-60 30 0t30 0 30 0 30 0', ...SW(5) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M33 30v100', ...DASH(2, '4 4') }, 'gray', { stroke: true }),
    arrow('M44 36v88M38 44l6-8 6 8M38 116l6 8 6-8', 'orange', 4)
  ],
  andino: [
    backdrop('sky'),
    s('path', { d: 'M14 128l40-76 26 42 22-50 44 84v6a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'brown', { accent: true }),
    s('path', { d: 'M44 72l10-20 10 16-10-4zM92 64l10-20 12 22-12-6z' }, 'white'),
    s('path', { d: 'M40 40q12-10 24 0q12-10 24 0', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 14, y: 124, width: 132, height: 22, rx: 0 }, 'green')
  ],
  aprovechamiento: [
    s('path', { d: 'M14 46l40-24 40 24z' }, 'red'),
    s('path', { d: 'M18 50h82v6H18z' }, 'gray'),
    s('path', { d: 'M96 52h16v44', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M88 100h48l-4 40H92z' }, 'blue', { accent: true }),
    s('path', { d: 'M92 112h42', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: drop(112, 98, 3) + drop(30, 76, 3) + drop(54, 90, 3) + drop(76, 72, 3) }, 'sky'),
    s('path', { d: 'M40 138v-16M40 128l-8-6M40 128l8-6', ...SW(4) }, 'green', { stroke: true })
  ],
  apto: [
    s('path', { d: 'M60 106l-12 36 16-8 10 14 8-36zM100 106l12 36-16-8-10 14-8-36z' }, 'red'),
    s('path', { d: burst(80, 70, 48, 40, 16) }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 70, r: 34 }, 'white'),
    s('path', { d: 'M64 70l12 12 22-22', ...SW(8) }, 'green', { stroke: true })
  ],
  'archipiélago': [
    backdrop('blue'),
    s('path', { d: ells([[40, 50, 20, 12], [86, 70, 24, 14], [124, 94, 16, 10], [56, 108, 18, 10], [110, 40, 10, 7]]) }, 'tan'),
    s('path', { d: ells([[40, 48, 12, 7], [86, 67, 15, 8], [124, 92, 8, 5], [56, 106, 10, 5]]) }, 'green', { accent: true }),
    s('path', { d: 'M20 132q6-4 12 0M120 130q6-4 12 0M24 78q6-4 12 0', ...SW(3) }, 'sky', { stroke: true })
  ],
  artesanal: [
    s('path', { d: 'M100 70h12a14 14 0 0 1 0 28h-12', ...SW(8) }, 'yellow', { stroke: true }),
    s('rect', { x: 40, y: 54, width: 64, height: 84, rx: 8 }, 'orange', { accent: true }),
    s('path', { d: ells([[54, 52, 16, 12], [76, 46, 16, 14], [94, 52, 14, 12]]) }, 'white'),
    s('path', { d: 'M56 70v56M72 70v56M88 70v56', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M26 138V40', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(26, 64, -130, 18, 6) + leaflet(26, 64, -50, 18, 6) + leaflet(26, 48, -130, 18, 6) + leaflet(26, 48, -50, 18, 6) + leaflet(26, 40, -90, 18, 6) }, 'yellow')
  ],
  'burguesía': [
    s('rect', { x: 18, y: 58, width: 92, height: 78 }, 'cream'),
    outline({ x: 18, y: 58, width: 92, height: 78 }),
    s('path', { d: 'M12 60l52-34 52 34z' }, 'navy'),
    s('path', { d: 'M32 66v70M50 66v70M78 66v70M96 66v70', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M114 92q-10 6-10 24t22 22q22-4 22-22t-10-24l6-10h-24z' }, 'yellow', { accent: true }),
    s('path', { d: 'M118 92h20', ...SW(4) }, 'brown', { stroke: true })
  ],
  'cantón': [
    s('path', { d: poly([[20, 60], [50, 30], [80, 44], [80, 90], [40, 100]]) }, 'red', { accent: true }),
    s('path', { d: poly([[80, 44], [110, 26], [140, 56], [118, 86], [80, 90]]) }, 'blue'),
    s('path', { d: poly([[40, 100], [80, 90], [92, 134], [44, 136]]) }, 'green'),
    s('path', { d: poly([[80, 90], [118, 86], [138, 118], [92, 134]]) }, 'yellow'),
    s('path', { d: 'M20 60l30-30 30 14 30-18 30 30-22 30 20 32-46 16-48 2-4-36zM80 44v46l12 44M40 100l40-10 38-4', ...SW(3) }, 'white', { stroke: true, lineColor: 'dark' })
  ],
  capo: [
    s('path', { d: busts([80], 146, 80, 50) }, 'dark'),
    s('path', { d: 'M70 96l10 30 10-30z' }, 'white'),
    s('path', { d: 'M78 100h4l2 20-4 6-4-6z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 74, r: 22 }, 'skin'),
    s('path', { d: 'M40 58h80v6H40zM56 58q0-24 24-24t24 24z' }, 'gray'),
    s('rect', { x: 56, y: 52, width: 48, height: 6 }, 'black'),
    s('path', { d: rects([[64, 70, 13, 8], [83, 70, 13, 8]]) + 'M77 73h6' }, 'black')
  ],
  concilio: [
    s('ellipse', { cx: 80, cy: 112, rx: 40, ry: 14 }, 'brown'),
    s('path', { d: busts(seats(56, 5).map(p => p[0]), 98, 22, 24) }, 'red'),
    s('path', { d: dots(seats(56, 5).map(([x]) => [x, 66]), 9) }, 'skin'),
    s('path', { d: seats(56, 5).map(([x]) => `M${x - 8} 58l2-16 6-6 6 6 2 16z`).join('') }, 'cream', { accent: true }),
    s('path', { d: busts([80], 146, 30, 30) }, 'purple')
  ],
  confidencial: [
    s('path', { d: 'M18 46h40l8 10h76v80H18z' }, 'tan'),
    s('path', { d: 'M18 64h124v72H18z' }, 'orange'),
    s('rect', { x: 34, y: 80, width: 70, height: 18, rx: 3, transform: 'rotate(-12 69 89)' }, 'red', { accent: true }),
    s('path', { d: 'M106 108v-8a10 10 0 0 1 20 0v8', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 100, y: 108, width: 32, height: 24, rx: 3 }, 'yellow')
  ],
  'cronología': [
    s('path', { d: 'M14 90h132', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[30, 90], [62, 90], [98, 90], [130, 90]], 8) }, 'orange', { accent: true }),
    s('path', { d: 'M30 82V60M62 98v22M98 82V60M130 98v22', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 40l12-14 12 14v14H18z' }, 'brown'),
    s('path', { d: 'M48 120h28v16H48z' }, 'red'),
    s('circle', { cx: 98, cy: 46, r: 12 }, 'yellow'),
    s('path', { d: 'M118 128l12-12 12 12z' }, 'green')
  ],
  demandar: [
    ...paper(20, 22, 70, 94),
    s('path', { d: 'M32 42h46M32 56h46M32 70h30', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 84, y: 128, width: 56, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M96 70l40 40', ...SW(7) }, 'brown', { stroke: true }),
    s('rect', { x: 74, y: 52, width: 44, height: 22, rx: 5, transform: 'rotate(45 96 63)' }, 'brown', { accent: true })
  ],
  deshacer: [
    arrow('M44 50h56a30 30 0 0 1 0 60H64M56 36L40 50l16 14', 'blue', 9),
    s('circle', { cx: 46, cy: 110, r: 20 }, 'pink', { accent: true }),
    s('path', { d: 'M32 100q14 10 28 0M30 114q16 10 32 0M64 112q20 4 30 22q12 8 30 4', ...SW(3) }, 'red', { stroke: true })
  ],
  'detección': [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'navy'),
    s('path', { d: ring(80, 80, 40) + ring(80, 80, 20) + 'M80 20v120M20 80h120', ...SW(2) }, 'green', { stroke: true }),
    s('path', { d: wedge(80, 80, 60, -90, -40) }, 'green', { accent: true }),
    s('circle', { cx: 104, cy: 52, r: 6 }, 'red'),
    s('circle', { cx: 80, cy: 80, r: 60, ...SW(4) }, 'gray', { stroke: true })
  ],
  diploma: [
    s('rect', { x: 26, y: 70, width: 110, height: 28, rx: 14, transform: 'rotate(-20 81 84)' }, 'cream'),
    s('rect', { x: 26, y: 70, width: 110, height: 28, rx: 14, transform: 'rotate(-20 81 84)', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M76 74l-6 46 10-6 10 8-4-46z' }, 'red', { accent: true }),
    s('path', { d: 'M38 42l40-16 40 16-40 16z' }, 'black'),
    s('path', { d: 'M56 46v12q24 10 48 0V46z' }, 'black'),
    s('path', { d: 'M118 42v20', ...SW(3) }, 'yellow', { stroke: true })
  ],
  discoteca: [
    backdrop('navy'),
    s('path', { d: 'M80 14v24', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 68L22 146M80 68l58 78', ...SW(10) }, 'purple', { stroke: true }),
    s('circle', { cx: 80, cy: 64, r: 26 }, 'gray', { accent: true }),
    s('path', { d: checker(56, 40, 6, 6, 8) }, 'white'),
    s('path', { d: sparkle(30, 34, 8) + sparkle(130, 40, 8) + sparkle(120, 104, 6) }, 'yellow')
  ],
  'ecología': [
    s('path', { d: 'M40 104A44 44 0 0 1 112 46M120 60a44 44 0 0 1-72 58', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M104 36l10 10-14 4zM56 124l-10-10 14-4z' }, 'green'),
    s('path', { d: leaflet(62, 106, -45, 60, 18) }, 'green', { accent: true }),
    s('path', { d: 'M62 106l38-38', ...SW(2) }, 'mint', { stroke: true })
  ],
  'embarcación': [
    s('path', { d: 'M14 120q16-8 33 0t33 0 33 0 33 0v26H14z' }, 'blue'),
    s('path', { d: 'M30 104h100l-16 22H46z' }, 'red', { accent: true }),
    s('path', { d: 'M80 104V22', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M84 26l40 70H84z' }, 'white'),
    s('path', { d: 'M84 26l40 70H84z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M76 34L44 90h32z' }, 'yellow')
  ],
  escombro: [
    s('path', { d: 'M14 136q20-50 50-48l20-20 20 26q24-4 42 42z' }, 'gray'),
    s('path', { d: rects([[34, 108, 20, 10], [64, 96, 22, 10], [96, 112, 20, 10]]) }, 'red', { accent: true }),
    s('path', { d: 'M74 70l12-40M86 30l10 8', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: poly([[110, 72], [130, 76], [124, 92]]) + poly([[30, 92], [44, 84], [46, 98]]) }, 'tan'),
    s('path', { d: ells([[40, 40, 14, 8], [120, 44, 16, 8]]) }, 'gray')
  ],
  espiral: [
    s('circle', { cx: 80, cy: 80, r: 64 }, 'mint'),
    s('path', { d: 'M80 80a6 6 0 0 1 12 0a12 12 0 0 1-24 0a18 18 0 0 1 36 0a24 24 0 0 1-48 0a30 30 0 0 1 60 0a36 36 0 0 1-72 0a42 42 0 0 1 84 0', ...SW(8) }, 'purple', { stroke: true, accent: true }),
    s('circle', { cx: 86, cy: 80, r: 4 }, 'pink')
  ],
  formular: [
    ...paper(78, 22, 64, 84),
    s('path', { d: 'M88 40h44M88 54h30M88 68h44M88 82h22', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 30h24M44 30v34l-24 56q-2 16 14 16h32q16 0 14-16L56 64V30', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 96h48l10 22q0 12-12 12H32q-12 0-10-12z' }, 'green', { accent: true }),
    s('path', { d: dots([[42, 108], [58, 116], [52, 100]], 4) }, 'mint')
  ],
  'fotográfico': [
    s('rect', { x: 18, y: 50, width: 124, height: 84, rx: 10 }, 'dark'),
    s('path', { d: 'M52 50l8-14h40l8 14z' }, 'dark'),
    s('circle', { cx: 80, cy: 92, r: 30 }, 'gray'),
    s('circle', { cx: 80, cy: 92, r: 20 }, 'blue', { accent: true }),
    s('circle', { cx: 72, cy: 84, r: 6 }, 'sky'),
    s('rect', { x: 112, y: 60, width: 18, height: 10, rx: 2 }, 'yellow'),
    s('rect', { x: 28, y: 42, width: 16, height: 8, rx: 2 }, 'red')
  ],
  'guardián': [
    s('path', { d: 'M14 136V30h10v10h10V30h10v10h10v96z' }, 'gray'),
    s('path', { d: 'M24 136v-40a10 10 0 0 1 20 0v40z' }, 'dark'),
    ...person(96, 136, 'navy'),
    s('path', { d: 'M124 136V30M118 40l6-14 6 14z', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M70 92h28v20q0 16-14 22q-14-6-14-22z' }, 'red', { accent: true }),
    s('path', { d: 'M84 98v28', ...SW(3) }, 'yellow', { stroke: true })
  ],
  guerrillero: [
    s('path', { d: leaflet(16, 140, -60, 60, 14) + leaflet(144, 140, -120, 60, 14) + leaflet(30, 60, 20, 40, 10) }, 'green'),
    s('path', { d: busts([80], 146, 64, 50) }, 'green', { accent: true }),
    s('path', { d: dots([[64, 120], [94, 108], [86, 134]], 6) }, 'brown'),
    s('circle', { cx: 80, cy: 76, r: 20 }, 'skin'),
    s('path', { d: 'M58 70q0-24 22-24t22 24zM98 66h14v4H98z' }, 'brown'),
    s('path', { d: 'M110 100l18 40', ...SW(10) }, 'brown', { stroke: true })
  ],
  hada: [
    s('path', { d: ells([[56, 70, 22, 14], [104, 70, 22, 14]]) }, 'sky'),
    s('path', { d: 'M72 74h16l14 50H58z' }, 'pink', { accent: true }),
    s('circle', { cx: 80, cy: 60, r: 12 }, 'skin'),
    s('path', { d: 'M68 54a12 12 0 0 1 24 0', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M90 82l26-36', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: star(118, 40, 11) }, 'yellow'),
    s('path', { d: sparkle(130, 70, 6) + sparkle(104, 24, 5) + sparkle(36, 110, 6) }, 'yellow')
  ],
  hebreo: [
    s('path', { d: 'M38 24v112M122 24v112', ...SW(8) }, 'brown', { stroke: true }),
    s('rect', { x: 26, y: 34, width: 24, height: 92, rx: 12 }, 'cream'),
    s('rect', { x: 110, y: 34, width: 24, height: 92, rx: 12 }, 'cream'),
    s('rect', { x: 40, y: 40, width: 80, height: 80 }, 'cream', { accent: true }),
    s('path', { d: 'M40 40h80M40 120h80', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M110 56H66M110 70H56M110 84H74M110 98H60', ...SW(4) }, 'gray', { stroke: true })
  ],
  'hormigón': [
    s('rect', { x: 100, y: 64, width: 44, height: 56, rx: 6 }, 'red'),
    s('rect', { x: 108, y: 72, width: 28, height: 18, rx: 3 }, 'sky'),
    s('rect', { x: 14, y: 106, width: 130, height: 14 }, 'dark'),
    s('ellipse', { cx: 56, cy: 82, rx: 42, ry: 26, transform: 'rotate(-14 56 82)' }, 'orange', { accent: true }),
    s('path', { d: 'M30 74l50 22M38 64l48 20', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[36, 126], [76, 126], [122, 126]], 11) }, 'black')
  ],
  imitar: [
    ...person(40, 136, 'orange'),
    s('path', { d: bubble(54, 24, 34, 28) }, 'yellow'),
    s('path', { d: bubble(104, 24, 34, 28) }, 'yellow'),
    s('path', { d: 'M126 132v-56', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: ells([[118, 104, 12, 20]]) + 'M114 122l-6 18 12-14z' }, 'green', { accent: true }),
    s('circle', { cx: 120, cy: 80, r: 10 }, 'red'),
    s('path', { d: 'M110 78l-8 4 8 4z' }, 'yellow')
  ],
  imposibilidad: [
    s('rect', { x: 70, y: 16, width: 62, height: 120 }, 'red'),
    s('path', { d: 'M70 36h62M70 56h62M70 76h62M70 96h62M70 116h62M100 16v20M86 36v20M114 36v20M100 56v20M86 76v20M114 76v20M100 96v20M86 116v20M114 116v20', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M44 136l14-60M60 136l14-60M48 120h14M52 104h14M56 88h14', ...SW(4) }, 'brown', { stroke: true }),
    ...person(30, 136, 'blue', { h: 38, w: 24, r: 11, accent: true })
  ],
  liderar: [
    ground(),
    ...person(118, 136, 'red', { accent: true }),
    s('path', { d: 'M132 102V40', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M134 40l12 8-12 8z' }, 'yellow'),
    s('path', { d: busts([30, 58, 86], 136, 20, 30) }, 'blue'),
    s('path', { d: dots([[30, 98], [58, 98], [86, 98]], 9) }, 'skin'),
    arrow('M20 64h70M80 56l10 8-10 8', 'orange', 4)
  ],
  'meditación': [
    s('circle', { cx: 80, cy: 78, r: 56 }, 'mint'),
    s('ellipse', { cx: 80, cy: 118, rx: 40, ry: 12 }, 'purple'),
    s('path', { d: 'M62 116V84q18-14 36 0v32z' }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 62, r: 14 }, 'skin'),
    s('path', { d: 'M64 88l-16 26M96 88l16 26', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M72 62q3 3 6 0M82 62q3 3 6 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  mejoramiento: [
    s('path', { d: rects([[24, 108, 22, 28], [56, 92, 22, 44], [88, 74, 22, 62]]) }, 'sky'),
    s('path', { d: 'M24 136h112', ...SW(4) }, 'gray', { stroke: true }),
    arrow('M34 92L112 30M96 28h16v16', 'green', 6),
    s('path', { d: 'M120 136l-4-46a10 10 0 1 1 12 0z' }, 'gray'),
    s('path', { d: sparkle(130, 66, 8) }, 'yellow', { accent: true })
  ],
  'metáfora': [
    s('path', { d: bubble(16, 20, 70, 56) }, 'sky'),
    s('path', { d: heart(51, 50, 11) }, 'red', { accent: true }),
    arrow('M66 92q20 20 40 0M98 86l8 6-4 10', 'orange', 4),
    s('circle', { cx: 118, cy: 114, r: 18 }, 'yellow'),
    s('path', { d: rays(118, 114, 22, 30, 8), ...SW(3) }, 'orange', { stroke: true })
  ],
  'metálico': [
    s('path', { d: 'M24 120l16-30h60l16 30z' }, 'gray'),
    s('path', { d: 'M40 90l12-20h48l12 20z' }, 'gray', { accent: true }),
    s('path', { d: 'M40 90h60M52 70h48', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: poly(around(114, 42, 18, 6, 0)) }, 'dark'),
    s('circle', { cx: 114, cy: 42, r: 8 }, 'white'),
    s('path', { d: sparkle(40, 50, 10) + sparkle(92, 104, 6) }, 'yellow')
  ],
  monta: [
    ...horse('brown', 'dark'),
    s('path', { d: 'M76 74v24', ...SW(6) }, 'navy', { stroke: true }),
    s('rect', { x: 66, y: 40, width: 20, height: 32, rx: 7 }, 'red', { accent: true }),
    s('circle', { cx: 76, cy: 30, r: 10 }, 'skin')
  ],
  'muñeca': [
    s('path', { d: 'M62 50q-10 30 4 44M98 50q10 30-4 44', ...SW(8) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 52, r: 20 }, 'skin'),
    s('path', { d: 'M60 48q20-30 40 0q-20-8-40 0z' }, 'orange'),
    s('path', { d: 'M68 74h24l18 50H50z' }, 'pink', { accent: true }),
    s('path', { d: 'M70 124v14M90 124v14', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: dots([[73, 52], [87, 52]], 3) + dots([[70, 60], [90, 60]], 3) }, 'red'),
    s('path', { d: 'M54 96l-10 14M106 96l10 14', ...SW(6) }, 'skin', { stroke: true })
  ],
  negligencia: [
    s('rect', { x: 18, y: 104, width: 50, height: 32, rx: 6 }, 'brown'),
    ...person(44, 104, 'blue', { h: 34, w: 28, r: 12 }),
    s('path', { d: 'M36 58q4 3 8 0M48 58q4 3 8 0', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 92, y: 110, width: 50, height: 26, rx: 2 }, 'dark'),
    s('path', { d: 'M100 110v-24h34v24z' }, 'gray'),
    s('path', { d: 'M96 88q4-12 14-4t20-4l4 10-8 10-6-6-8 10-6-8-6 4z' }, 'white'),
    s('path', { d: 'M108 76q-4-10 2-18M124 72q-4-10 2-18', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 118l4-6 4 6 4-6 4 6', ...SW(3) }, 'orange', { stroke: true, accent: true })
  ],
  'ordenación': [
    s('rect', { x: 14, y: 128, width: 132, height: 8 }, 'brown'),
    s('rect', { x: 14, y: 74, width: 132, height: 6 }, 'brown'),
    s('path', { d: rects([[20, 104, 12, 24], [34, 98, 12, 30], [48, 92, 12, 36], [62, 86, 12, 42]]) }, 'blue'),
    s('path', { d: rects([[78, 98, 12, 30], [92, 92, 12, 36], [106, 86, 12, 42], [120, 80, 12, 48]]) }, 'red', { accent: true }),
    s('path', { d: rects([[22, 42, 14, 32], [40, 42, 14, 32], [58, 42, 14, 32]]) }, 'green'),
    s('path', { d: rects([[80, 34, 14, 40], [98, 34, 14, 40], [116, 34, 14, 40]]) }, 'yellow')
  ],
  presumir: [
    ground(),
    ...person(64, 136, 'purple'),
    s('path', { d: 'M56 70l16-4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M78 98l24-34', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M92 30h28v12a14 14 0 0 1-28 0zM100 56h12v8h-12z' }, 'yellow', { accent: true }),
    s('path', { d: sparkle(132, 30, 8) + sparkle(84, 20, 6) + sparkle(132, 64, 5) }, 'orange')
  ],
  primordial: [
    s('path', { d: 'M14 136V80a66 66 0 0 1 132 0v56h-26V82a40 40 0 0 0-80 0v54z' }, 'tan'),
    s('path', { d: 'M14 80a66 66 0 0 1 132 0M40 82a40 40 0 0 1 80 0M26 50l20 12M134 50l-20 12', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M68 14h24l-4 28H72z' }, 'red', { accent: true }),
    s('path', { d: sparkle(80, 28, 6) }, 'yellow')
  ],
  pronunciar: [
    s('path', { d: 'M28 140v-22q-14-8-14-36q0-46 46-50q30 0 40 28l10 20-10 4v14q0 10-10 10h-14v32z' }, 'skin'),
    s('path', { d: 'M100 92q-10 6-18 0q8 10 18 4z' }, 'red', { accent: true }),
    s('circle', { cx: 84, cy: 62, r: 3 }, 'dark'),
    s('path', { d: 'M116 82q8 10 0 20M126 74q14 18 0 36M136 66q20 26 0 52', ...SW(4) }, 'blue', { stroke: true })
  ],
  prosa: [
    s('rect', { x: 26, y: 18, width: 86, height: 120, rx: 4 }, 'cream'),
    outline({ x: 26, y: 18, width: 86, height: 120, rx: 4 }, 'tan'),
    s('path', { d: 'M46 36h54M38 48h62M38 60h62M38 72h40M46 90h54M38 102h62M38 114h50', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 126q-6-40 30-80q8 40-30 80z' }, 'purple', { accent: true }),
    s('path', { d: 'M100 126l-6 14', ...SW(3) }, 'dark', { stroke: true })
  ],
  'próximamente': [
    s('rect', { x: 18, y: 70, width: 90, height: 64, rx: 4 }, 'dark'),
    s('path', { d: 'M18 52l86-16 4 20-86 16z' }, 'dark'),
    s('path', { d: 'M34 49l10 16M58 45l10 16M82 40l10 16', ...SW(7) }, 'white', { stroke: true }),
    s('circle', { cx: 112, cy: 110, r: 30 }, 'yellow', { accent: true }),
    s('path', { d: 'M112 92v18l12 8', ...SW(5) }, 'dark', { stroke: true })
  ],
  retroceder: [
    s('rect', { x: 14, y: 118, width: 132, height: 20 }, 'gray'),
    ...car(66, 88, 'blue', 'sky', { accent: true }),
    arrow('M54 70H18M28 60L18 70l10 10', 'orange', 6),
    s('path', { d: 'M132 98h12M132 108h12', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M126 100h4v6h-4z' }, 'red')
  ],
  sic: [
    ...paper(24, 18, 96, 120),
    s('path', { d: 'M38 38h68M38 54h68M38 70h22M90 70h16M38 86h68M38 102h50', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 62, y: 62, width: 26, height: 16, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M62 82q4-4 8 0t8 0 8 0', ...SW(2) }, 'red', { stroke: true }),
    s('path', { d: 'M58 58v24h-4M92 58v24h4M58 58h-4M92 58h4', ...SW(3) }, 'dark', { stroke: true })
  ],
  siniestro: [
    backdrop('navy'),
    s('path', { d: 'M40 146q0-70 40-96q40 26 40 96z' }, 'black', { accent: true }),
    s('path', { d: 'M54 146q4-56 26-70q22 14 26 70z' }, 'dark'),
    s('path', { d: 'M66 86l10 4M94 86l-10 4', ...SW(4) }, 'red', { stroke: true }),
    s('circle', { cx: 120, cy: 36, r: 14 }, 'cream'),
    s('circle', { cx: 126, cy: 32, r: 12 }, 'navy')
  ],
  sueco: [
    s('path', { d: 'M26 20v122', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 28, y: 24, width: 108, height: 72 }, 'blue', { accent: true }),
    s('path', { d: 'M62 24v72M28 60h108', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'yellow', { stroke: true })
  ],
  'superación': [
    ground(),
    s('path', { d: 'M86 136V96M126 136V96M82 96h48', ...SW(6) }, 'red', { stroke: true }),
    s('rect', { x: 52, y: 52, width: 26, height: 38, rx: 9, transform: 'rotate(40 65 71)' }, 'green', { accent: true }),
    s('circle', { cx: 84, cy: 50, r: 11 }, 'skin'),
    s('path', { d: 'M56 84l-16 6-4 12M60 86l26 6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M74 60l18-12M70 58l-16-14', ...SW(5) }, 'skin', { stroke: true }),
    arrow('M18 120q40-90 112-60', 'orange', 3)
  ],
  surgimiento: [
    backdrop('sky'),
    s('circle', { cx: 80, cy: 98, r: 30 }, 'yellow', { accent: true }),
    s('path', { d: halfRays(80, 98, 38, 52, 7), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M14 108l30-26 26 22 20-14 26 20 30-18v42a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green'),
    arrow('M80 66V40M72 48l8-8 8 8', 'red', 4)
  ],
  tina: [
    s('path', { d: 'M44 128l-6 12M116 128l6 12', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 76h124v24q0 30-30 30H48q-30 0-30-30z' }, 'white'),
    s('path', { d: 'M18 76h124v24q0 30-30 30H48q-30 0-30-30z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[40, 72, 14, 10], [62, 66, 14, 12], [118, 70, 14, 10]]) }, 'sky'),
    s('path', { d: 'M30 76V36a10 10 0 0 1 20 0', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: ells([[92, 64, 14, 9], [102, 52, 8, 8]]) + 'M108 52l8 2-8 3z' }, 'yellow', { accent: true })
  ],
  tristemente: [
    s('circle', { cx: 80, cy: 84, r: 50 }, 'sky', { accent: true }),
    s('path', { d: 'M54 72q8 6 16 0M90 72q8 6 16 0', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: 'M60 114q20-16 40 0', ...SW(5) }, 'navy', { stroke: true }),
    s('path', { d: drop(60, 94, 6) }, 'blue'),
    s('path', { d: 'M50 56l16-6M110 56l-16-6', ...SW(3) }, 'navy', { stroke: true })
  ],
  videoclip: [
    s('rect', { x: 16, y: 34, width: 128, height: 84, rx: 10 }, 'purple'),
    s('rect', { x: 24, y: 42, width: 112, height: 68, rx: 4 }, 'dark'),
    s('path', { d: 'M68 58l28 18-28 18z' }, 'white', { accent: true }),
    ...note(112, 66, 'pink'),
    s('path', { d: 'M24 130h112', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 60, cy: 130, r: 6 }, 'red')
  ],
  aconsejar: [
    ground(),
    ...person(48, 136, 'brown', { h: 52, w: 32, r: 14 }),
    ...person(112, 136, 'sky', { h: 36, w: 26, r: 11, accent: true }),
    s('path', { d: 'M64 96q20-10 36-2', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: bubble(54, 18, 46, 34) }, 'white'),
    s('path', { d: bubble(54, 18, 46, 34), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 34l8 8 14-14', ...SW(4) }, 'green', { stroke: true })
  ],
  amenazar: [
    s('path', { d: busts([70], 146, 64, 44) }, 'dark'),
    ...face(70, 82, 28, 'skin', 'frown'),
    s('path', { d: 'M50 68l14 6M90 68l-14 6', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 104, y: 30, width: 28, height: 26, rx: 8 }, 'skin', { accent: true }),
    s('path', { d: 'M112 56l-10 50', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M136 28l8-8M140 44h8M120 20l2-8', ...SW(3) }, 'red', { stroke: true })
  ],
  amigable: [
    ground(),
    ...person(44, 136, 'yellow'),
    ...person(116, 136, 'pink', { accent: true }),
    s('path', { d: 'M56 98L76 66M104 98L84 66', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(80, 50, 10) }, 'orange'),
    s('path', { d: 'M38 83q6 5 12 0M110 83q6 5 12 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  ansia: [
    ...person(46, 136, 'orange'),
    s('path', { d: drop(62, 68, 4) }, 'sky'),
    s('path', { d: 'M40 70l4 2M52 70l-4 2M40 84h12', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 112, cy: 62, r: 30 }, 'white'),
    s('circle', { cx: 112, cy: 62, r: 30, ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M112 62V42M112 62l14 8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 128q4-6 8 0M100 128q4-6 8 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  ardiente: [
    s('path', { d: 'M80 16q22 20 18 40q10-6 10-18q20 26 6 50H46q-14-24 6-50q0 12 10 18q-6-24 18-40z' }, 'orange'),
    s('path', { d: heart(80, 104, 30) }, 'red', { accent: true }),
    s('path', { d: 'M66 78q-10 6-10 16', ...SW(4) }, 'pink', { stroke: true })
  ],
  arrepentir: [
    ground(),
    ...person(60, 136, 'blue'),
    s('path', { d: 'M74 100L68 70', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M52 82q8-6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 136l6-18 10 6 6-10 8 22z' }, 'orange', { accent: true }),
    s('path', { d: poly([[96, 124], [104, 112], [108, 126]]) + poly([[130, 116], [140, 120], [134, 130]]) }, 'orange'),
    s('path', { d: drop(44, 76, 4) }, 'sky')
  ],
  atentamente: [
    s('path', { d: busts([66], 146, 64, 48) }, 'green'),
    s('circle', { cx: 66, cy: 74, r: 26 }, 'skin'),
    s('path', { d: dots([[58, 72], [76, 72]], 4) }, 'dark'),
    s('ellipse', { cx: 92, cy: 76, rx: 7, ry: 11 }, 'skin'),
    s('path', { d: 'M96 70q12 0 10 18', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M116 66q8 10 0 20M126 58q14 18 0 36M136 50q20 26 0 52', ...SW(4) }, 'orange', { stroke: true, accent: true })
  ],
  atrapar: [
    s('path', { d: 'M24 46h22M18 60h22M24 74h18', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 60, r: 22 }, 'orange', { accent: true }),
    s('path', { d: 'M62 50q18 4 36 0M62 70q18-4 36 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M36 140V112q0-24 20-30l10 8-10 14M124 140V112q0-24-20-30l-10 8 10 14', ...SW(12) }, 'skin', { stroke: true })
  ],
  atributo: [
    s('path', { d: 'M40 70l40-20 40 20-40 20z' }, 'sky'),
    s('path', { d: 'M40 70v44l40 20V90z' }, 'blue', { accent: true }),
    s('path', { d: 'M120 70v44l-40 20V90z' }, 'navy'),
    s('path', { d: 'M120 80l14-30M40 92L22 60', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M126 26h22v20h-22l-6-10z' }, 'yellow'),
    s('path', { d: 'M12 42h22l6 10-6 10H12z' }, 'pink')
  ],
  'botín': [
    s('path', { d: 'M24 70q0-34 56-34t56 34z' }, 'brown'),
    s('path', { d: dots([[46, 72], [66, 66], [92, 66], [114, 72], [80, 60]], 12) }, 'yellow', { accent: true }),
    s('rect', { x: 24, y: 72, width: 112, height: 62, rx: 4 }, 'brown'),
    s('path', { d: 'M24 86h112M44 72v62M116 72v62', ...SW(5) }, 'orange', { stroke: true }),
    s('rect', { x: 72, y: 80, width: 16, height: 18, rx: 3 }, 'yellow'),
    s('path', { d: sparkle(30, 32, 8) + sparkle(130, 34, 7) }, 'yellow')
  ],
  calzada: [
    backdrop('mint'),
    s('path', { d: 'M70 20h20l50 126H20z' }, 'dark', { accent: true }),
    s('path', { d: 'M80 26v14M80 54v20M80 90v26M80 130v14', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M70 20L20 146M90 20l50 126', ...SW(3) }, 'white', { stroke: true })
  ],
  cineasta: [
    s('path', { d: 'M90 136l20-46 20 46M110 90v46', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 84, y: 64, width: 52, height: 30, rx: 4 }, 'dark'),
    s('path', { d: ring(96, 50, 12) + ring(124, 50, 12), ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M84 72l-14-8v24l14-8z' }, 'gray'),
    ...person(40, 136, 'red', { accent: true }),
    s('path', { d: 'M28 64h24', ...SW(5) }, 'black', { stroke: true })
  ],
  'cinematográfico': [
    s('path', { d: 'M20 112l120-36v34L20 146z' }, 'dark'),
    s('path', { d: 'M28 116l8-2M48 110l8-2M68 104l8-2M88 98l8-2M108 92l8-2M128 86l8-2M28 140l8-2M48 134l8-2M68 128l8-2M88 122l8-2M108 116l8-2', ...SW(4) }, 'white', { stroke: true }),
    s('circle', { cx: 70, cy: 62, r: 44 }, 'gray', { accent: true }),
    s('path', { d: dots([[70, 40], [92, 62], [70, 84], [48, 62]], 10) }, 'dark'),
    s('circle', { cx: 70, cy: 62, r: 6 }, 'white')
  ],
  'colchón': [
    s('path', { d: 'M24 120v14M136 120v14', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 16, y: 74, width: 128, height: 46, rx: 14 }, 'sky', { accent: true }),
    s('path', { d: 'M16 98h128', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: dots([[40, 86], [64, 86], [88, 86], [112, 86], [52, 108], [76, 108], [100, 108], [124, 108]], 3) }, 'blue'),
    s('path', { d: 'M40 64q0-12 20-12h16q8 0 8 12z' }, 'white'),
    s('path', { d: 'M40 64q0-12 20-12h16q8 0 8 12z', ...SW(2) }, 'gray', { stroke: true })
  ],
  colon: [
    s('path', { d: 'M44 146v-70q0-24 22-30h28q22 6 22 30v70z' }, 'skin'),
    s('path', { d: 'M54 128V76q0-10 10-10h32q10 0 10 10v42q0 8-8 8H78', ...SW(12) }, 'pink', { stroke: true, accent: true }),
    s('path', { d: 'M54 92h6M54 110h6M76 66v6M100 66v6M106 92h-6', ...SW(3) }, 'red', { stroke: true }),
    s('circle', { cx: 80, cy: 26, r: 14 }, 'skin')
  ],
  concentrar: [
    s('circle', { cx: 80, cy: 80, r: 14 }, 'red', { accent: true }),
    arrow('M22 22l32 32M54 38v16H38M138 22l-32 32M106 38v16h16M22 138l32-32M38 106h16v16M138 138l-32-32M106 122v-16h16', 'blue', 5),
    s('path', { d: ring(80, 80, 24), ...SW(3) }, 'orange', { stroke: true })
  ],
  consecutivo: [
    s('path', { d: rects([[16, 60, 22, 22], [42, 60, 22, 22], [68, 60, 22, 22], [94, 60, 22, 22], [120, 60, 22, 22]]) }, 'green', { accent: true }),
    s('path', { d: [16, 42, 68, 94, 120].map(x => `M${x + 5} ${71}l5 5 8-9`).join(''), ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: rects([[16, 92, 22, 22], [42, 92, 22, 22], [68, 92, 22, 22]]) }, 'mint'),
    arrow('M18 40h120M128 32l10 8-10 8', 'orange', 4)
  ],
  consigna: [
    s('rect', { x: 18, y: 18, width: 84, height: 120, rx: 4 }, 'gray'),
    s('path', { d: grid(24, 24, 2, 3, 34, 34, 38, 38) }, 'sky'),
    s('path', { d: dots([[52, 41], [90, 41], [52, 79], [90, 79], [52, 117], [90, 117]], 3) }, 'dark'),
    s('rect', { x: 102, y: 92, width: 40, height: 46, rx: 6 }, 'red', { accent: true }),
    s('path', { d: 'M112 92v-10h20v10M112 104v28M132 104v28', ...SW(4) }, 'dark', { stroke: true })
  ],
  crianza: [
    s('path', { d: busts([76], 146, 72, 56) }, 'purple'),
    s('circle', { cx: 76, cy: 66, r: 22 }, 'skin'),
    s('path', { d: 'M54 60q0-26 22-26t22 26q-10-12-22-12t-22 12z' }, 'brown'),
    s('ellipse', { cx: 96, cy: 112, rx: 30, ry: 16 }, 'cream', { accent: true }),
    s('circle', { cx: 112, cy: 104, r: 12 }, 'skin'),
    s('path', { d: 'M52 112q20 22 66 6', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: heart(120, 40, 9) }, 'pink')
  ],
  deficiencia: [
    s('rect', { x: 18, y: 50, width: 114, height: 60, rx: 8 }, 'white'),
    s('rect', { x: 18, y: 50, width: 114, height: 60, rx: 8, ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 132, y: 68, width: 12, height: 24, rx: 3 }, 'dark'),
    s('rect', { x: 28, y: 60, width: 18, height: 40, rx: 2 }, 'red', { accent: true })
  ],
  'degradación': [
    s('path', { d: 'M18 136h126', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[22, 48, 20, 88], [48, 70, 20, 66], [74, 90, 20, 46], [100, 106, 20, 30]]) }, 'orange'),
    s('rect', { x: 126, y: 120, width: 14, height: 16 }, 'red', { accent: true }),
    arrow('M30 30l96 78M108 108h18V90', 'red', 5),
    s('path', { d: 'M80 98l4 10-4 6M106 110l4 8', ...SW(2) }, 'dark', { stroke: true })
  ],
  desconocimiento: [
    ground(),
    s('path', { d: busts([56], 136, 40, 40) }, 'blue'),
    s('circle', { cx: 56, cy: 80, r: 16 }, 'skin'),
    s('path', { d: 'M74 76q14-2 12-20', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 80, y: 18, width: 62, height: 44, rx: 20 }, 'gray', { accent: true }),
    s('path', { d: dots([[78, 70], [72, 78]], 4) }, 'gray'),
    s('path', { d: 'M96 40q8-8 14 0t14 0', ...SW(4) }, 'white', { stroke: true })
  ],
  desventaja: [
    ground(),
    ...person(48, 136, 'blue', { accent: true }),
    s('path', { d: 'M58 132q30 4 46 -2', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 112, cy: 124, r: 12 }, 'black'),
    ...person(120, 136, 'green', { h: 34, w: 24, r: 10 }),
    arrow('M96 44h40M126 36l10 8-10 8', 'green', 4)
  ],
  dictamen: [
    s('path', { d: busts([72], 146, 76, 60) }, 'black'),
    s('path', { d: 'M62 88l10 14 10-14z' }, 'white'),
    s('circle', { cx: 72, cy: 66, r: 22 }, 'skin'),
    s('path', { d: 'M50 60q0-28 22-28t22 28l-6-6-4 6-6-6-6 6-6-6-4 6z' }, 'white'),
    ...paper(98, 88, 40, 50),
    s('circle', { cx: 118, cy: 124, r: 8 }, 'red', { accent: true })
  ],
  diplomacia: [
    s('path', { d: 'M24 136V30M136 136V30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M26 32h34v24H26z' }, 'blue'),
    s('path', { d: 'M134 32h-34v24h34z' }, 'red'),
    s('path', { d: 'M30 112h34l14-10M130 112H96l-14-10', ...SW(14) }, 'navy', { stroke: true }),
    s('ellipse', { cx: 80, cy: 102, rx: 18, ry: 10 }, 'skin', { accent: true }),
    s('path', { d: 'M70 98h20M70 106h20', ...SW(2) }, 'tan', { stroke: true })
  ],
  'edificación': [
    s('path', { d: 'M30 136V24M30 30h108M30 46l18-16', ...SW(5) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M120 30v32', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 110, y: 62, width: 20, height: 10 }, 'gray'),
    s('path', { d: rects([[60, 76, 72, 60]]) }, 'tan'),
    s('path', { d: 'M60 76h72M60 96h72M60 116h72M60 76v60M84 76v60M108 76v60M132 76v60', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: grid(66, 82, 3, 2, 12, 8, 24, 20) }, 'sky')
  ],
  esplendor: [
    s('path', { d: rays(80, 84, 46, 64, 12, 15), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M40 108L34 56l24 22 22-34 22 34 24-22-6 52z' }, 'yellow', { accent: true }),
    s('rect', { x: 40, y: 104, width: 80, height: 14, rx: 3 }, 'orange'),
    s('path', { d: dots([[58, 111], [80, 111], [102, 111]], 4) }, 'red'),
    s('path', { d: dots([[34, 56], [80, 44], [126, 56]], 5) }, 'yellow')
  ],
  esqueleto: [
    backdrop('navy'),
    s('circle', { cx: 80, cy: 36, r: 16 }, 'white'),
    s('path', { d: dots([[74, 36], [86, 36]], 4) }, 'navy'),
    s('path', { d: 'M80 52v52M64 62q16 6 32 0M62 74q18 6 36 0M64 86q16 6 32 0M80 64L54 96M80 64l26 32M70 104l-10 36M90 104l10 36', ...SW(5) }, 'white', { stroke: true, accent: true }),
    s('path', { d: 'M66 104h28', ...SW(7) }, 'white', { stroke: true })
  ],
  estero: [
    backdrop('mint'),
    s('path', { d: 'M14 104q40-10 70 6t62-4v28a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'blue', { accent: true }),
    s('path', { d: 'M30 14q20 40 4 70t34 26q20 6 30 0', ...SW(14) }, 'sky', { stroke: true }),
    s('path', { d: 'M110 96V64M118 96V58M126 96V68M44 100V72M52 100V64', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: ells([[118, 56, 3, 8], [52, 62, 3, 8]]) }, 'brown')
  ],
  expensas: [
    ...paper(20, 18, 70, 116),
    s('path', { d: 'M30 36h50M30 52h50M30 68h50M30 84h50M30 108h50', ...DASH(3, '4 6') }, 'gray', { stroke: true }),
    s('path', { d: 'M30 98h50', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: ells([[118, 128, 20, 7], [118, 116, 20, 7], [118, 104, 20, 7]]) }, 'yellow', { accent: true }),
    s('path', { d: ells([[118, 128, 20, 7], [118, 116, 20, 7], [118, 104, 20, 7]]), ...SW(2) }, 'orange', { stroke: true })
  ],
  firmeza: [
    s('path', { d: 'M14 120q16-8 33 0t33 0 33 0 33 0v26H14z' }, 'blue'),
    s('path', { d: 'M40 124l12-60 30-14 28 18 12 56z' }, 'gray', { accent: true }),
    s('path', { d: 'M22 104q-8-20 10-30M134 104q8-20-10-30', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: 'M18 40h30M24 52h24M112 36h30', ...SW(3) }, 'gray', { stroke: true })
  ],
  franquismo: [
    s('rect', { x: 22, y: 30, width: 76, height: 100, rx: 4 }, 'brown'),
    s('rect', { x: 30, y: 30, width: 68, height: 100 }, 'gray'),
    s('path', { d: 'M42 56h44M42 70h44M42 84h30', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M104 66h36M104 134h36', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M108 68h28l-12 32 12 32h-28l12-32z' }, 'sky'),
    s('path', { d: 'M112 78h20l-10 22zM108 132q14-14 28 0z' }, 'yellow', { accent: true })
  ],
  holocausto: [
    s('rect', { x: 52, y: 70, width: 56, height: 66, rx: 4 }, 'white'),
    outline({ x: 52, y: 70, width: 56, height: 66, rx: 4 }),
    s('path', { d: 'M80 70V58', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: drop(80, 44, 9) }, 'orange', { accent: true }),
    s('path', { d: drop(80, 48, 4) }, 'yellow'),
    s('path', { d: 'M30 140h100', ...SW(4) }, 'gray', { stroke: true })
  ],
  'huésped': [
    s('rect', { x: 92, y: 30, width: 48, height: 106, rx: 4 }, 'brown'),
    s('circle', { cx: 100, cy: 86, r: 4 }, 'yellow'),
    ...person(52, 136, 'blue'),
    s('rect', { x: 66, y: 104, width: 26, height: 32, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M72 104v-8h14v8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M114 44h18v12h-18z' }, 'yellow')
  ],
  'hábitat': [
    s('path', { d: 'M14 70h132', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: ells([[30, 40, 24, 18], [128, 40, 24, 18]]) }, 'green'),
    s('path', { d: 'M54 70q26 30 52 0z' }, 'brown'),
    s('path', { d: dots([[70, 72], [88, 72]], 7) }, 'sky'),
    s('path', { d: ells([[80, 44, 16, 11]]) + 'M94 38l10 4-10 4z' }, 'blue', { accent: true }),
    s('circle', { cx: 86, cy: 40, r: 2 }, 'dark'),
    s('path', { d: 'M14 136q30-20 60 0t72-6', ...SW(6) }, 'green', { stroke: true })
  ],
  ilegalmente: [
    s('path', { d: 'M14 112h132M30 84v52M62 84v52M94 84v52M126 84v52M14 96h132', ...SW(4) }, 'gray', { stroke: true }),
    ...lean(78, 112, 20, 'dark'),
    s('circle', { cx: 120, cy: 42, r: 22 }, 'white'),
    s('path', { d: ring(120, 42, 20) + 'M106 28l28 28', ...SW(6) }, 'red', { stroke: true, accent: true })
  ],
  imparcial: [
    s('path', { d: 'M80 30v100M50 136h60M28 52h104', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 52l-14 32M28 52l14 32M132 52l-14 32M132 52l14 32', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M12 84h32a16 10 0 0 1-32 0zM116 84h32a16 10 0 0 1-32 0z' }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 26, r: 7 }, 'yellow')
  ],
  inaceptable: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 52 }, 'white'),
    s('path', { d: 'M62 124V74a8 8 0 0 1 16 0V44a8 8 0 0 1 16 0v26a8 8 0 0 1 16 0v26q0 28-24 28z' }, 'skin'),
    s('path', { d: 'M38 38l84 84', ...SW(10) }, 'red', { stroke: true })
  ],
  inaugurar: [
    s('rect', { x: 50, y: 30, width: 60, height: 106, rx: 4 }, 'brown'),
    s('path', { d: 'M14 84h56M90 84h56', ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M70 84l-8 14M90 84l8 14', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: ring(76, 106, 7) + ring(92, 108, 7) + 'M80 100l24-30M88 102L74 70', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: sparkle(30, 40, 9) + sparkle(130, 44, 9) }, 'yellow')
  ],
  infanta: [
    s('path', { d: 'M64 74h32l20 66H44z' }, 'pink', { accent: true }),
    s('path', { d: 'M62 54q-6 26 4 34M98 54q6 26-4 34', ...SW(8) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 56, r: 16 }, 'skin'),
    s('path', { d: 'M66 38l4-12 6 8 4-12 4 12 6-8 4 12z' }, 'yellow'),
    s('path', { d: dots([[80, 30]], 3) }, 'red'),
    s('path', { d: 'M64 76L52 104M96 76l12 28', ...SW(5) }, 'skin', { stroke: true })
  ],
  internado: [
    s('path', { d: 'M28 140V26M132 140V26', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 28, y: 60, width: 104, height: 10 }, 'brown'),
    s('rect', { x: 28, y: 120, width: 104, height: 10 }, 'brown'),
    s('rect', { x: 34, y: 46, width: 94, height: 14, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 34, y: 106, width: 94, height: 14, rx: 4 }, 'red'),
    s('path', { d: dots([[46, 40], [46, 100]], 9) }, 'skin'),
    s('path', { d: 'M138 40v80M138 52h-6M138 72h-6M138 92h-6', ...SW(3) }, 'gray', { stroke: true })
  ],
  interrumpir: [
    ...person(30, 136, 'blue'),
    ...person(130, 136, 'orange', { accent: true }),
    s('path', { d: bubble(20, 22, 64, 40) }, 'sky'),
    s('path', { d: bubble(80, 40, 64, 40), transform: 'scale(-1 1) translate(-224 0)' }, 'yellow'),
    s('path', { d: 'M82 26l-8 14h10l-8 16', ...SW(4) }, 'red', { stroke: true })
  ],
  mercenario: [
    s('path', { d: busts([66], 146, 70, 52) }, 'green'),
    s('circle', { cx: 66, cy: 74, r: 20 }, 'skin'),
    s('path', { d: 'M42 72q0-30 24-30t24 30z' }, 'dark'),
    s('path', { d: 'M110 136q-14 0-14-20t16-26l-4-10h20l-4 10q16 6 16 26t-14 20z' }, 'yellow', { accent: true }),
    s('path', { d: ring(120, 112, 7), ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M60 76h12', ...SW(3) }, 'dark', { stroke: true })
  ],
  modernidad: [
    s('path', { d: 'M20 136V60l26-14v90zM56 136V28l30 14v94zM96 136V70l20-20 20 20v66z' }, 'sky', { accent: true }),
    s('path', { d: 'M20 76l26-10M20 96l26-10M20 116l26-10M56 50l30 10M56 72l30 10M56 94l30 10M56 116l30 10M96 86h40M96 104h40M96 122h40', ...SW(2) }, 'blue', { stroke: true }),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M120 24h20M130 24v8', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 122, y: 30, width: 16, height: 6, rx: 3 }, 'dark')
  ],
  modesto: [
    ground(),
    ...person(62, 136, 'tan'),
    s('path', { d: 'M54 76q3-3 6 0M64 76q3-3 6 0M56 84q6 4 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: ells([[52, 82, 4, 2], [72, 82, 4, 2]]) }, 'pink'),
    s('path', { d: 'M110 136V96', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: dots([[104, 92], [116, 92], [110, 84], [110, 98]], 5) }, 'pink', { accent: true }),
    s('path', { d: 'M76 104q12 4 20-4', ...SW(6) }, 'skin', { stroke: true })
  ],
  moralidad: [
    s('circle', { cx: 80, cy: 80, r: 58 }, 'brown'),
    s('circle', { cx: 80, cy: 80, r: 48 }, 'cream'),
    s('path', { d: 'M80 32v8M80 120v8M32 80h8M120 80h8', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 80L70 56l10-20 10 20z' }, 'red', { accent: true }),
    s('path', { d: 'M80 80l-10 24 10 20 10-20z' }, 'gray'),
    s('path', { d: heart(80, 54, 6) }, 'white')
  ],
  multinacional: [
    s('circle', { cx: 80, cy: 86, r: 50 }, 'sky'),
    s('path', { d: 'M54 60q14-6 20 4t-4 18q-14 4-18 16q-10-4-8-18t10-20zM96 98q14-4 18 8t-8 22q-10-2-12-14t2-16z' }, 'green'),
    s('rect', { x: 66, y: 20, width: 28, height: 48 }, 'navy', { accent: true }),
    s('path', { d: grid(71, 26, 2, 4, 6, 6, 12, 10) }, 'yellow'),
    s('path', { d: 'M80 68L40 110M80 68l40 40M80 68v58', ...DASH(3, '4 4') }, 'orange', { stroke: true }),
    s('path', { d: dots([[40, 110], [120, 108], [80, 126]], 6) }, 'red')
  ],
  'máster': [
    s('path', { d: rects([[30, 110, 100, 14], [36, 96, 88, 14], [40, 124, 84, 14]]) }, 'blue'),
    s('path', { d: 'M30 117h100M36 103h88', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M56 74v14q24 10 48 0V74z' }, 'black'),
    s('path', { d: 'M24 64l56-22 56 22-56 22z' }, 'black'),
    s('path', { d: 'M126 66v26', ...SW(3) }, 'yellow', { stroke: true }),
    s('circle', { cx: 126, cy: 96, r: 6 }, 'yellow', { accent: true }),
    s('path', { d: star(34, 34, 9) }, 'orange')
  ],
  neutralidad: [
    s('path', { d: 'M14 26a12 12 0 0 1 12-12h54v132H26a12 12 0 0 1-12-12z' }, 'red'),
    s('path', { d: 'M80 14h54a12 12 0 0 1 12 12v108a12 12 0 0 1-12 12H80z' }, 'blue'),
    s('circle', { cx: 80, cy: 80, r: 34 }, 'white'),
    s('circle', { cx: 80, cy: 80, r: 26 }, 'gray', { accent: true }),
    s('path', { d: 'M66 80h28', ...SW(6) }, 'white', { stroke: true })
  ],
  noveno: [
    s('path', { d: dots([[22, 80], [36, 80], [50, 80], [64, 80], [78, 80], [92, 80], [106, 80], [120, 80]], 6) }, 'gray'),
    s('circle', { cx: 138, cy: 80, r: 9 }, 'orange', { accent: true }),
    arrow('M138 56V40M130 48l8 8 8-8', 'red', 4),
    s('path', { d: 'M14 100h132', ...SW(3) }, 'gray', { stroke: true })
  ],
  peinado: [
    s('path', { d: busts([70], 146, 60, 30) }, 'pink'),
    s('circle', { cx: 70, cy: 86, r: 26 }, 'skin'),
    s('path', { d: 'M42 86q-4-46 30-50q34 2 26 34q-10-20-32-16q-14 8-24 32z' }, 'brown', { accent: true }),
    s('path', { d: 'M64 46q-8 8 0 16', ...SW(3) }, 'orange', { stroke: true }),
    s('rect', { x: 106, y: 30, width: 14, height: 70, rx: 3, transform: 'rotate(20 113 65)' }, 'purple'),
    s('path', { d: 'M120 40l12 4M118 50l12 4M114 60l12 4M110 70l12 4M106 80l12 4', ...SW(3) }, 'purple', { stroke: true })
  ],
  predecir: [
    s('rect', { x: 16, y: 30, width: 128, height: 88, rx: 6 }, 'navy'),
    s('circle', { cx: 52, cy: 66, r: 16 }, 'yellow', { accent: true }),
    s('path', { d: ells([[104, 74, 20, 12], [96, 64, 14, 10]]) }, 'white'),
    s('path', { d: 'M92 90l-4 10M104 90l-4 10M116 90l-4 10', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M80 118v20M56 138h48', ...SW(5) }, 'dark', { stroke: true }),
    arrow('M30 104h28M50 96l8 8-8 8', 'orange', 4)
  ],
  predio: [
    backdrop('mint'),
    s('path', { d: 'M14 60h132M14 104h132M58 14v132M104 14v132', ...SW(3) }, 'green', { stroke: true }),
    s('rect', { x: 62, y: 64, width: 38, height: 36 }, 'tan', { accent: true }),
    s('rect', { x: 62, y: 64, width: 38, height: 36, ...DASH(3, '5 4') }, 'brown', { stroke: true }),
    s('path', { d: 'M100 64V34', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M101 34h18l-5 6 5 6h-18z' }, 'red')
  ],
  preferible: [
    s('rect', { x: 16, y: 50, width: 56, height: 64, rx: 8 }, 'gray'),
    s('rect', { x: 88, y: 40, width: 56, height: 74, rx: 8 }, 'green', { accent: true }),
    s('path', { d: star(116, 76, 16) }, 'yellow'),
    s('path', { d: 'M32 82h24', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M104 132l12-10 12 10', ...SW(5) }, 'orange', { stroke: true })
  ],
  providencia: [
    backdrop('sky'),
    s('path', { d: 'M62 50L30 146h20zM80 50v96M98 50l32 96h-20z' }, 'yellow', { accent: true }),
    s('path', { d: ells([[56, 44, 24, 16], [84, 36, 26, 20], [110, 46, 22, 14]]) }, 'white'),
    s('path', { d: 'M14 128q40-14 66 0t66-4v10a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green')
  ],
  'pío': [
    s('rect', { x: 110, y: 84, width: 18, height: 52, rx: 2 }, 'cream'),
    outline({ x: 110, y: 84, width: 18, height: 52, rx: 2 }, 'tan'),
    s('path', { d: drop(119, 72, 6) }, 'orange', { accent: true }),
    s('path', { d: 'M60 140V100l-14-50a8 8 0 0 1 14-4l12 30 12-30a8 8 0 0 1 14 4L84 100v40z' }, 'skin'),
    s('path', { d: 'M72 76v62', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: rays(119, 70, 14, 22, 6, -150), ...SW(2) }, 'yellow', { stroke: true })
  ],
  'pólvora': [
    s('path', { d: 'M40 60q-6 38 0 76h60q6-38 0-76z' }, 'brown', { accent: true }),
    s('path', { d: 'M36 76h68M36 120h68', ...SW(5) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 70, cy: 60, rx: 30, ry: 8 }, 'dark'),
    s('path', { d: 'M86 58q30-20 40-40', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: burst(126, 18, 10, 4, 8) }, 'orange'),
    s('path', { d: dots([[60, 140], [76, 142], [92, 140]], 2) }, 'dark')
  ],
  quebrada: [
    backdrop('sky'),
    s('path', { d: 'M14 40l30 10 14 40 6 56H14zM146 30l-36 16-14 46-6 54h56z' }, 'brown', { accent: true }),
    s('path', { d: 'M64 146l-4-30 10-26q10 26 20 26l-4 30z' }, 'blue'),
    s('path', { d: 'M30 56l10 16M126 50l-8 18', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M14 40l30 10M146 30l-36 16', ...SW(6) }, 'green', { stroke: true })
  ],
  reposo: [
    s('path', { d: 'M24 136V50M136 136V50', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: ells([[24, 44, 16, 14], [136, 44, 16, 14]]) }, 'green'),
    s('path', { d: 'M26 70q54 50 108 0', ...SW(10) }, 'orange', { stroke: true, accent: true }),
    s('circle', { cx: 46, cy: 76, r: 10 }, 'skin'),
    s('path', { d: 'M56 88q30 14 56 -4', ...SW(12) }, 'blue', { stroke: true })
  ],
  resultante: [
    s('path', { d: 'M24 130L60 50h80l-36 80', ...DASH(2, '4 4') }, 'gray', { stroke: true }),
    arrow('M24 130L60 50M46 58l14-8 2 16', 'blue', 5),
    arrow('M24 130h80M94 122l10 8-10 8', 'green', 5),
    arrow('M24 130L136 54M120 52l16 2-6 16', 'red', 6),
    s('circle', { cx: 24, cy: 130, r: 6 }, 'dark', { accent: true })
  ],
  sensor: [
    s('rect', { x: 50, y: 50, width: 60, height: 60, rx: 14 }, 'white'),
    s('rect', { x: 50, y: 50, width: 60, height: 60, rx: 14, ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 14 }, 'dark'),
    s('circle', { cx: 80, cy: 80, r: 6 }, 'red', { accent: true }),
    s('path', { d: 'M38 56a48 48 0 0 0 0 48M26 46a64 64 0 0 0 0 68M122 56a48 48 0 0 1 0 48M134 46a64 64 0 0 1 0 68', ...SW(4) }, 'blue', { stroke: true })
  ],
  sensual: [
    s('path', { d: 'M18 74q24-20 42-10q18-10 42 10q-42 6-84 0z' }, 'red', { accent: true }),
    s('path', { d: 'M18 80q42 44 84 0q-42 8-84 0z' }, 'red'),
    s('rect', { x: 112, y: 76, width: 32, height: 56, rx: 8 }, 'pink'),
    s('rect', { x: 120, y: 62, width: 16, height: 14, rx: 2 }, 'yellow'),
    s('path', { d: 'M104 60q-4-8 4-14M96 50q-4-8 4-14', ...SW(3) }, 'purple', { stroke: true })
  ],
  suroeste: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'cream'),
    s('circle', { cx: 80, cy: 80, r: 60, ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 28l6 46-6 6-6-6zM80 132l-6-46 6-6 6 6zM28 80l46-6 6 6-6 6zM132 80l-46 6-6-6 6-6z' }, 'gray'),
    s('path', { d: 'M80 80L40 120l14-34z' }, 'red', { accent: true }),
    s('path', { d: 'M80 80L40 120l34-14z' }, 'orange'),
    s('circle', { cx: 80, cy: 80, r: 5 }, 'dark')
  ],
  tenencia: [
    s('path', { d: 'M24 60l30-26 30 26v40H24z' }, 'tan'),
    s('path', { d: 'M24 60l30-26 30 26', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M86 92l40 26M118 112l8-8M108 106l6-8', ...SW(7) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: ring(80, 88, 12), ...SW(7) }, 'yellow', { stroke: true }),
    s('path', { d: 'M40 146l10-30q6-10 18-8l20 4', ...SW(14) }, 'skin', { stroke: true })
  ],
  violador: [
    s('path', { d: 'M24 136V96M136 136V96', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M20 96h52l-6 14H20zM88 104l50-8v14l-50 8z' }, 'red', { accent: true }),
    s('path', { d: 'M34 96l-6 14M52 96l-6 14M104 102l-4 14M122 99l-4 14', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M80 24l38 64H42z' }, 'yellow')
  ],
  yacimiento: [
    s('rect', { x: 14, y: 50, width: 132, height: 96 }, 'brown'),
    s('rect', { x: 14, y: 14, width: 132, height: 36 }, 'sky'),
    s('path', { d: 'M14 50h132', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: ells([[100, 116, 34, 16]]) }, 'black'),
    s('path', { d: poly([[38, 88], [48, 76], [58, 88], [48, 100]]) + poly([[60, 120], [68, 112], [76, 120], [68, 128]]) }, 'purple', { accent: true }),
    s('path', { d: 'M100 24v92M88 50l12-26 12 26', ...SW(4) }, 'dark', { stroke: true })
  ],
  acierto: [
    s('path', { d: 'M100 136V60', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 92, y: 30, width: 54, height: 38, rx: 3 }, 'white'),
    outline({ x: 92, y: 30, width: 54, height: 38, rx: 3 }),
    s('path', { d: 'M96 64h40l-6 30h-28z', ...SW(3) }, 'red', { stroke: true }),
    s('circle', { cx: 116, cy: 46, r: 13 }, 'orange', { accent: true }),
    s('path', { d: 'M30 120q20-80 74-74', ...DASH(3, '5 5') }, 'gray', { stroke: true }),
    s('path', { d: sparkle(56, 36, 9) + sparkle(84, 104, 6) }, 'yellow')
  ],
  ancestro: [
    s('rect', { x: 34, y: 18, width: 92, height: 112, rx: 6 }, 'brown'),
    s('rect', { x: 44, y: 28, width: 72, height: 92, rx: 30 }, 'cream', { accent: true }),
    s('path', { d: busts([80], 120, 48, 30) }, 'gray'),
    s('circle', { cx: 80, cy: 70, r: 16 }, 'skin'),
    s('path', { d: 'M68 76q12 26 24 0z' }, 'white'),
    s('path', { d: 'M66 62q14-12 28 0', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 130v10M100 130v10', ...SW(4) }, 'brown', { stroke: true })
  ],
  asedio: [
    s('path', { d: 'M54 116V58h10v8h10v-8h12v8h10v-8h10v58z' }, 'gray', { accent: true }),
    s('path', { d: 'M74 116v-22a6 6 0 0 1 12 0v22z' }, 'dark'),
    s('path', { d: 'M86 58V34l16 6-16 6', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: around(80, 88, 60, 10, 0).map(([x, y]) => `M${x - 10} ${y + 8}l10-16 10 16z`).join('') }, 'orange'),
    s('path', { d: ring(80, 88, 48), ...DASH(2, '4 6') }, 'gray', { stroke: true })
  ],
  asesoramiento: [
    s('rect', { x: 66, y: 22, width: 76, height: 56, rx: 4 }, 'white'),
    outline({ x: 66, y: 22, width: 76, height: 56, rx: 4 }),
    s('path', { d: rects([[78, 52, 12, 18], [96, 42, 12, 28], [114, 32, 12, 38]]) }, 'green', { accent: true }),
    ...person(40, 136, 'navy'),
    s('path', { d: 'M54 98l22-30', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: busts([110], 146, 30, 30) }, 'orange'),
    s('circle', { cx: 110, cy: 104, r: 11 }, 'skin')
  ],
  asociar: [
    s('path', { d: 'M20 50h40v14a10 10 0 1 1 0 20v14H20z' }, 'blue', { accent: true }),
    s('path', { d: 'M76 50h44v48H76V84a10 10 0 1 0 0-20z' }, 'orange'),
    arrow('M30 120h30M50 112l10 8-10 8M130 120h-30M110 112l-10 8 10 8', 'green', 4),
    s('path', { d: sparkle(80, 30, 8) }, 'yellow')
  ],
  bobo: [
    s('circle', { cx: 80, cy: 82, r: 50 }, 'yellow', { accent: true }),
    s('path', { d: ring(62, 70, 9) + ring(98, 70, 9), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[66, 72], [94, 72]], 4) }, 'dark'),
    s('path', { d: 'M54 100q26 16 52 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M74 104h14v10a7 7 0 0 1-14 0z' }, 'pink'),
    s('path', { d: 'M80 32V18M66 18h28', ...SW(4) }, 'red', { stroke: true })
  ],
};
