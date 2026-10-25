// Illustration specs for words still undrawn in batches 0085–0087 (see server/scripts/lexicon/art.js)
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

// Path data: a human head in profile facing right (neck at the bottom)
const HEAD = 'M58 136v-22q-26-10-26-44q0-40 44-44q42 0 46 36l12 22-10 4v12q0 12-14 12h-12v24z';
// A leafy tree centred on cx, trunk on ground y 136
const tree = (cx, color = 'green', trunk = 'brown', opts = {}) => [
  s('rect', { x: cx - 7, y: 92, width: 14, height: 44, rx: 3 }, trunk),
  s('path', { d: ells([[cx, 66, 40, 34], [cx - 26, 84, 20, 16], [cx + 26, 84, 20, 16]]) }, color, opts)
];

module.exports = {
  'transeúnte': [
    s('rect', { x: 14, y: 112, width: 132, height: 30, rx: 4 }, 'dark'),
    s('path', { d: rects([[22, 120, 14, 14], [46, 120, 14, 14], [70, 120, 14, 14], [94, 120, 14, 14], [118, 120, 14, 14]]) }, 'white'),
    ...lean(80, 112, 8, 'blue', { h: 40, w: 26, r: 11, accent: true }),
    s('path', { d: 'M74 112l-12 0M90 112l12 0', ...SW(6) }, 'navy', { stroke: true }),
    s('path', { d: 'M30 60h22M24 74h22M32 88h18', ...SW(4) }, 'gray', { stroke: true })
  ],
  transmisor: [
    s('path', { d: 'M80 52L56 140M80 52l24 88M64 110h32M70 86h20', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 48, r: 9 }, 'red', { accent: true }),
    s('path', { d: 'M58 30a30 30 0 0 0 0 36M102 30a30 30 0 0 1 0 36M42 18a50 50 0 0 0 0 60M118 18a50 50 0 0 1 0 60', ...SW(5) }, 'orange', { stroke: true })
  ],
  travesti: [
    ...lady(58, 136, 'purple', { accent: true }),
    s('path', { d: 'M44 72q-6-30 14-30q20 0 14 30', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M118 34v8M100 54l18-12 18 12z', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 102, y: 56, width: 32, height: 46, rx: 4 }, 'navy'),
    s('path', { d: 'M118 58l-5 10 5 26 5-26z' }, 'red')
  ],
  travesura: [
    s('rect', { x: 34, y: 50, width: 52, height: 86, rx: 3 }, 'brown'),
    s('circle', { cx: 78, cy: 96, r: 3 }, 'yellow'),
    s('path', { d: 'M40 26l38 4-4 20H44z', transform: 'rotate(-12 60 38)' }, 'gray', { accent: true }),
    s('path', { d: drop(92, 52, 5) + drop(100, 70, 4) + drop(90, 82, 4) }, 'blue'),
    ...person(122, 136, 'orange', { h: 34, w: 24, r: 11 }),
    s('path', { d: 'M114 88q8 6 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  trenza: [
    s('circle', { cx: 80, cy: 52, r: 34 }, 'brown'),
    s('path', { d: ells([[74, 92, 9, 7], [86, 104, 9, 7], [74, 116, 9, 7], [86, 128, 8, 6]]) }, 'brown', { accent: true }),
    s('path', { d: 'M66 88q14 8 28 4M66 112q14 8 28 4', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 20v32M60 30q20 10 40 0', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 72, y: 136, width: 16, height: 8, rx: 3 }, 'red')
  ],
  variabilidad: [
    s('path', { d: 'M20 136h120M20 136V20', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[30, 96, 16, 40], [54, 60, 16, 76], [78, 110, 16, 26], [102, 44, 16, 92]]) }, 'blue', { accent: true }),
    s('path', { d: 'M38 84L62 48L86 94L110 34L132 58', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: dots([[38, 84], [62, 48], [86, 94], [110, 34], [132, 58]], 5) }, 'red')
  ],
  'veneración': [
    s('path', { d: rays(110, 50, 26, 38, 10) , ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: star(110, 50, 20) }, 'yellow', { accent: true }),
    s('rect', { x: 96, y: 76, width: 28, height: 60, rx: 3 }, 'gray'),
    ...lean(40, 136, 30, 'blue', { h: 36, w: 24, r: 11 }),
    ground()
  ],
  verbalmente: [
    s('path', { d: HEAD, transform: 'translate(-14 0)' }, 'skin'),
    s('path', { d: 'M100 98q8 4 16 0', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: bubble(104, 22, 44, 34) }, 'white'),
    s('path', { d: bubble(104, 22, 44, 34), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M124 92q8 8 0 16M132 86q14 14 0 28', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: dots([[116, 38], [126, 38], [136, 38]], 3) }, 'blue', { accent: true })
  ],
  victoriano: [
    s('path', { d: 'M74 70h12l38 66H36z' }, 'purple', { accent: true }),
    s('path', { d: 'M48 110h64M42 122h76', ...SW(3) }, 'pink', { stroke: true }),
    s('circle', { cx: 80, cy: 56, r: 12 }, 'skin'),
    s('path', { d: 'M66 50q14-22 28 0z' }, 'brown'),
    s('path', { d: 'M108 72q22-24 44 0z' }, 'pink'),
    s('path', { d: 'M130 52v40M88 82l40 4', ...SW(3) }, 'dark', { stroke: true })
  ],
  vuelco: [
    ground(),
    s('path', { d: 'M54 102l8 14h22l8-14z' }, 'sky'),
    s('rect', { x: 42, y: 82, width: 60, height: 20, rx: 6 }, 'red', { accent: true }),
    s('path', { d: dots([[56, 80], [88, 80]], 8) }, 'dark'),
    s('path', { d: 'M112 70a34 34 0 0 0-56-26', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M50 34l6 12 12-6' , ...SW(5) }, 'orange', { stroke: true })
  ],
  acogedor: [
    backdrop('cream'),
    s('rect', { x: 22, y: 50, width: 56, height: 86, rx: 3 }, 'brown'),
    s('rect', { x: 34, y: 92, width: 32, height: 34, rx: 2 }, 'dark'),
    s('path', { d: 'M40 126q-2-18 10-28q-2 12 6 14q4-10 0-16q14 10 8 30z' }, 'orange', { accent: true }),
    s('path', { d: 'M90 136v-30q0-12 12-12h18q12 0 12 12v30zM86 104h8v32h-8zM128 104h8v32h-8z' }, 'red'),
    s('path', { d: 'M100 52h20v18q0 8-10 8t-10-8z' }, 'white'),
    s('path', { d: 'M100 52h20v18q0 8-10 8t-10-8z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 46q-4-8 2-12M114 46q-4-8 2-12', ...SW(3) }, 'gray', { stroke: true })
  ],
  aconsejable: [
    s('rect', { x: 46, y: 74, width: 52, height: 56, rx: 12 }, 'skin'),
    s('rect', { x: 50, y: 30, width: 20, height: 56, rx: 10 }, 'skin', { accent: true }),
    s('path', { d: 'M70 88h24M70 102h26M70 116h24', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 30, y: 78, width: 18, height: 52, rx: 4 }, 'blue'),
    s('path', { d: star(120, 40, 14) }, 'yellow'),
    s('path', { d: sparkle(126, 92, 10) }, 'yellow')
  ],
  amiguito: [
    ...person(54, 136, 'orange', { h: 36, w: 26, r: 13, accent: true }),
    ...person(106, 136, 'green', { h: 36, w: 26, r: 13 }),
    s('path', { d: 'M66 112q14 8 28 0', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 40, 14) }, 'pink'),
    ground()
  ],
  ampolla: [
    s('path', { d: 'M30 60q0-20 20-20h14v50l60 6q20 4 20 22v8H44q-14 0-14-16z' }, 'skin'),
    s('path', { d: 'M52 136q-24 0-22-24', ...SW(3) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 38, cy: 104, rx: 14, ry: 12 }, 'pink', { accent: true }),
    s('ellipse', { cx: 34, cy: 100, rx: 4, ry: 3 }, 'white'),
    s('path', { d: dots([[128, 124], [118, 120], [108, 118]], 5) }, 'pink')
  ],
  'antídoto': [
    s('rect', { x: 28, y: 64, width: 40, height: 64, rx: 8 }, 'purple'),
    s('rect', { x: 38, y: 48, width: 20, height: 16 }, 'dark'),
    s('path', { d: 'M38 86l20 20M58 86l-20 20', ...SW(5) }, 'white', { stroke: true }),
    s('rect', { x: 88, y: 56, width: 44, height: 72, rx: 8 }, 'green', { accent: true }),
    s('rect', { x: 100, y: 38, width: 20, height: 18 }, 'white'),
    s('path', { d: 'M110 76v32M94 92h32', ...SW(7) }, 'white', { stroke: true }),
    outline({ x: 100, y: 38, width: 20, height: 18 })
  ],
  aperitivo: [
    s('path', { d: 'M28 40h44l-22 36z' }, 'orange', { accent: true }),
    s('path', { d: 'M50 76v40M36 118h28M28 40h44', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 30l18 30', ...SW(3) }, 'brown', { stroke: true }),
    s('circle', { cx: 56, cy: 46, r: 6 }, 'green'),
    s('ellipse', { cx: 112, cy: 120, rx: 34, ry: 12 }, 'white'),
    s('ellipse', { cx: 112, cy: 120, rx: 34, ry: 12, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[100, 110], [114, 106], [126, 112], [108, 116]], 7) }, 'green')
  ],
  apretado: [
    s('path', { d: 'M28 60q0-14 14-14h76q14 0 14 14v56q0 14-14 14H42q-14 0-14-14z' }, 'blue'),
    s('path', { d: 'M40 50q10-20 24-6q8-18 22-2q10-14 24 4', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M58 40v100M102 40v100', ...SW(8) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: 'M14 84l10 4M14 104l10-2M146 84l-10 4M146 104l-10-2', ...SW(4) }, 'orange', { stroke: true })
  ],
  'automovilístico': [
    s('path', { d: 'M24 108l10-20h44l20 14h30q8 0 8 10v8H24z' }, 'red', { accent: true }),
    s('path', { d: 'M46 92h22l8 10H42z' }, 'sky'),
    s('path', { d: dots([[46, 122], [114, 122]], 12) }, 'dark'),
    s('path', { d: 'M100 24v52', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 100, y: 24, width: 40, height: 26 }, 'white'),
    s('path', { d: checker(100, 24, 4, 2, 10, 1) + checker(100, 44, 4, 1, 6, 0) }, 'black')
  ],
  axila: [
    s('rect', { x: 46, y: 70, width: 40, height: 66, rx: 12 }, 'green'),
    s('circle', { cx: 66, cy: 52, r: 14 }, 'skin'),
    s('path', { d: 'M82 80l26-46', ...SW(12) }, 'skin', { stroke: true }),
    s('rect', { x: 116, y: 74, width: 18, height: 40, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 119, y: 64, width: 12, height: 10 }, 'gray'),
    s('path', { d: dots([[110, 70], [102, 74], [106, 80], [96, 78]], 2.5) }, 'sky')
  ],
  baldosa: [
    s('path', { d: 'M40 40h80l26 100H14z' }, 'cream'),
    s('path', { d: 'M40 40h80l26 100H14zM60 40l-14 100M80 40v100M100 40l14 100M34 65h92M27 92h106M20 118h120', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M60 40h20v25H56z M80 92h28l4 26H80z' }, 'orange', { accent: true })
  ],
  barraca: [
    ground(),
    s('rect', { x: 34, y: 66, width: 92, height: 70 }, 'brown'),
    s('path', { d: 'M24 70l56-34 56 34z' }, 'gray', { accent: true }),
    s('path', { d: 'M34 84h92M34 102h92M34 120h92', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 66, y: 96, width: 26, height: 40 }, 'dark'),
    s('rect', { x: 102, y: 80, width: 16, height: 14 }, 'yellow')
  ],
  baza: [
    s('rect', { x: 30, y: 40, width: 50, height: 74, rx: 6, transform: 'rotate(-18 55 114)' }, 'white'),
    s('rect', { x: 55, y: 34, width: 50, height: 74, rx: 6 }, 'white'),
    s('rect', { x: 80, y: 40, width: 50, height: 74, rx: 6, transform: 'rotate(18 105 114)' }, 'white'),
    s('path', { d: 'M30 40h50v74H30z', transform: 'rotate(-18 55 114)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M55 34h50v74H55zM80 40h50v74H80z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: heart(80, 64, 14) }, 'red', { accent: true }),
    s('path', { d: 'M114 70l8 12-8 12-8-12z' }, 'red')
  ],
  binario: [
    backdrop('navy'),
    s('path', { d: rects([[28, 32, 20, 20], [76, 32, 20, 20], [100, 32, 20, 20], [52, 60, 20, 20], [124, 60, 20, 20], [28, 88, 20, 20], [76, 88, 20, 20], [52, 116, 20, 20], [100, 116, 20, 20]].map(([x, y, w, h]) => [x - 4, y - 4, w, h])) }, 'mint', { accent: true }),
    s('path', { d: rects([[48, 28, 20, 20], [24, 56, 20, 20], [72, 56, 20, 20], [96, 56, 20, 20], [48, 84, 20, 20], [96, 84, 20, 20], [120, 84, 20, 20], [24, 112, 20, 20], [72, 112, 20, 20], [120, 28, 20, 20], [120, 112, 20, 20]]), ...SW(2) }, 'sky', { stroke: true })
  ],
  bisabuelo: [
    s('rect', { x: 34, y: 76, width: 34, height: 60, rx: 11 }, 'brown'),
    s('circle', { cx: 51, cy: 60, r: 14 }, 'skin'),
    s('path', { d: 'M37 58q0-18 14-18t14 18q-4-8-14-8t-14 8zM42 68q9 14 18 0z' }, 'white', { accent: true }),
    s('path', { d: 'M76 90l-4 46M72 90q6-10 12 0', ...SW(5) }, 'dark', { stroke: true }),
    ...person(118, 136, 'sky', { h: 22, w: 18, r: 9 }),
    ground()
  ],
  bizcocho: [
    s('path', { d: 'M24 90q0-36 56-36t56 36v36q0 10-10 10H34q-10 0-10-10z' }, 'yellow', { accent: true }),
    s('path', { d: 'M24 90q0-36 56-36t56 36', ...SW(10) }, 'brown', { stroke: true }),
    s('path', { d: dots([[46, 104], [72, 96], [100, 108], [118, 94], [60, 122], [90, 124], [120, 120]], 3) }, 'orange'),
    s('ellipse', { cx: 80, cy: 138, rx: 66, ry: 6 }, 'gray')
  ],
  borrachera: [
    ...lean(70, 136, -14, 'blue', { h: 44, w: 30, r: 14 }),
    s('circle', { cx: 52, cy: 66, r: 6 }, 'pink'),
    s('path', { d: spiral(48, 58), ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M88 104l24-26', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M108 82l14-16v-14h8v16l-10 20z', transform: 'rotate(10 116 76)' }, 'green', { accent: true }),
    s('path', { d: sparkle(30, 34, 8) + sparkle(84, 28, 8) + sparkle(60, 20, 6) }, 'yellow'),
    ground()
  ],
  'burocrático': [
    s('path', { d: rects([[26, 112, 60, 10], [30, 100, 60, 10], [24, 88, 60, 10], [28, 76, 60, 10], [26, 64, 60, 10], [30, 52, 60, 10]]) }, 'white'),
    s('path', { d: rects([[26, 112, 60, 10], [30, 100, 60, 10], [24, 88, 60, 10], [28, 76, 60, 10], [26, 64, 60, 10], [30, 52, 60, 10]]), ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 18, y: 122, width: 124, height: 14, rx: 3 }, 'brown'),
    s('rect', { x: 106, y: 40, width: 12, height: 30, rx: 4 }, 'brown'),
    s('rect', { x: 96, y: 70, width: 32, height: 14, rx: 3 }, 'red', { accent: true }),
    s('path', { d: ells([[112, 104, 16, 8]]) }, 'pink')
  ],
  'carrocería': [
    s('path', { d: 'M18 100q0-14 14-16l20-24h50l22 22h12q12 0 12 14v16h-16a16 16 0 0 0-32 0H66a16 16 0 0 0-32 0H18z' }, 'blue', { accent: true }),
    s('path', { d: 'M58 66h18v18H46zM82 66h18l16 18H82z' }, 'sky'),
    s('path', { d: 'M38 114a12 12 0 0 1 24 0M98 114a12 12 0 0 1 24 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(130, 50, 10) + sparkle(36, 74, 7) }, 'yellow'),
    ground(132)
  ],
  caviar: [
    s('ellipse', { cx: 70, cy: 96, rx: 52, ry: 30 }, 'gray'),
    s('ellipse', { cx: 70, cy: 90, rx: 46, ry: 24 }, 'navy'),
    s('path', { d: dots([[46, 84], [58, 90], [72, 82], [84, 92], [96, 86], [52, 98], [66, 100], [80, 104], [92, 98], [60, 78], [86, 76], [40, 92], [100, 94], [72, 92]], 4.5) }, 'black', { accent: true }),
    s('path', { d: 'M100 70l40-40', ...SW(6) }, 'cream', { stroke: true }),
    s('ellipse', { cx: 100, cy: 72, rx: 10, ry: 6, transform: 'rotate(-45 100 72)' }, 'cream')
  ],
  cochera: [
    s('path', { d: 'M16 64L80 24l64 40v72H16z' }, 'tan'),
    s('rect', { x: 30, y: 70, width: 100, height: 66 }, 'dark'),
    s('path', { d: 'M30 74h100M30 84h100', ...SW(4) }, 'gray', { stroke: true }),
    ...car(50, 106, 'red', 'sky', { accent: true }),
    s('path', { d: 'M12 64L80 20l68 44', ...SW(6) }, 'brown', { stroke: true })
  ],
  comprobante: [
    s('path', { d: 'M40 18h80v124l-10-8-10 8-10-8-10 8-10-8-10 8-10-8-10 8z' }, 'white'),
    s('path', { d: 'M40 18h80v124l-10-8-10 8-10-8-10 8-10-8-10 8-10-8-10 8z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 38h56M52 52h40M52 66h56M52 80h32', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 98, cy: 108, r: 16 }, 'green', { accent: true }),
    s('path', { d: 'M90 108l6 6 10-12', ...SW(4) }, 'white', { stroke: true })
  ],
  condominio: [
    s('rect', { x: 18, y: 54, width: 40, height: 82 }, 'tan'),
    s('rect', { x: 60, y: 26, width: 44, height: 110 }, 'orange', { accent: true }),
    s('rect', { x: 106, y: 66, width: 36, height: 70 }, 'tan'),
    s('path', { d: grid(24, 62, 2, 4, 10, 10, 18, 18) + grid(68, 36, 3, 5, 8, 10, 12, 18) + grid(112, 74, 2, 3, 9, 10, 16, 18) }, 'sky'),
    s('rect', { x: 74, y: 120, width: 16, height: 16 }, 'brown'),
    ground()
  ],
  congelador: [
    s('rect', { x: 36, y: 18, width: 88, height: 124, rx: 10 }, 'white'),
    s('rect', { x: 36, y: 18, width: 88, height: 124, rx: 10, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 60h88M48 34v16M48 74v24', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 82v44M61 93l38 22M61 115l38-22M74 84l6 6 6-6M74 124l6-6 6 6', ...SW(5) }, 'sky', { stroke: true, accent: true })
  ],
  conspirador: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('path', { d: 'M28 136v-40q0-14 14-14h20q14 0 14 14v40zM84 136v-40q0-14 14-14h20q14 0 14 14v40z' }, 'dark'),
    s('path', { d: dots([[52, 64], [108, 64]], 13) }, 'skin'),
    s('path', { d: 'M32 56h40M38 56q2-20 14-20t14 20zM88 56h40M94 56q2-20 14-20t14 20z' }, 'black', { accent: true }),
    s('path', { d: 'M66 70q6 4 4 10', ...SW(3) }, 'skin', { stroke: true }),
    s('path', { d: 'M80 30a8 8 0 1 1 6 14', ...SW(3) }, 'yellow', { stroke: true })
  ],
  consular: [
    s('path', { d: 'M24 68L80 40l56 28z' }, 'gray'),
    s('rect', { x: 28, y: 68, width: 104, height: 60 }, 'cream'),
    s('path', { d: 'M42 74v50M62 74v50M98 74v50M118 74v50', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 72, y: 96, width: 16, height: 32 }, 'brown'),
    s('rect', { x: 20, y: 128, width: 120, height: 8 }, 'gray'),
    s('path', { d: 'M80 40V14', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 80, y: 14, width: 26, height: 16 }, 'blue', { accent: true })
  ],
  coyote: [
    s('circle', { cx: 118, cy: 40, r: 22 }, 'cream'),
    s('path', { d: 'M14 136q30-30 70-24q40 4 62 24z' }, 'brown'),
    s('path', { d: 'M40 116l4-24q4-12 20-12h24l10-22 6 4 4-10 4 14q8 6 2 12l-14 8v30h-6v-18H58l-6 20h-6z' }, 'tan', { accent: true }),
    s('path', { d: 'M44 94q-16 4-22 18', ...SW(8) }, 'tan', { stroke: true }),
    s('path', { d: dots([[104, 64]], 2) }, 'dark')
  ],
  'cúspide': [
    s('path', { d: 'M14 140L80 34l66 106z' }, 'gray'),
    s('path', { d: 'M80 34l-18 28 10-4 8 8 8-8 10 4z' }, 'white'),
    s('path', { d: 'M80 36V12', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 12l20 6-20 6z' }, 'red', { accent: true }),
    s('path', { d: 'M80 34l-18 28 10-4 8 8 8-8 10 4z', ...SW(2) }, 'gray', { stroke: true })
  ],
  deceso: [
    s('rect', { x: 60, y: 64, width: 24, height: 66, rx: 3 }, 'cream'),
    s('rect', { x: 60, y: 64, width: 24, height: 66, rx: 3, ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: drop(72, 46, 8) }, 'orange', { accent: true }),
    s('path', { d: 'M72 58v6', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 46, y: 128, width: 52, height: 8, rx: 3 }, 'gray'),
    s('path', { d: 'M114 136v-40', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M114 96q-14-8-10-24q10 6 10 14q0-8 10-14q4 16-10 24z' }, 'white'),
    s('path', { d: 'M114 96q-14-8-10-24q10 6 10 14q0-8 10-14q4 16-10 24z', ...SW(2) }, 'gray', { stroke: true })
  ],
  dedicatoria: [
    ...openBook(80, 52, 'white', 'red'),
    s('path', { d: 'M38 70h28M38 80h20M38 90h26', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: heart(110, 70, 12) }, 'pink'),
    s('path', { d: 'M120 112l26-40 6 4-26 40-8 4z' }, 'blue', { accent: true })
  ],
  dehesa: [
    s('rect', { x: 14, y: 98, width: 132, height: 44, rx: 6 }, 'yellow'),
    s('rect', { x: 46, y: 70, width: 8, height: 32 }, 'brown'),
    s('path', { d: ells([[50, 58, 34, 18]]) }, 'green', { accent: true }),
    s('ellipse', { cx: 110, cy: 112, rx: 22, ry: 13 }, 'dark'),
    s('path', { d: 'M96 122v10M122 122v10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M128 104l10 4-10 6z' }, 'dark'),
  ],
  desconcertante: [
    s('circle', { cx: 80, cy: 82, r: 44 }, 'yellow', { accent: true }),
    s('path', { d: spiral(58, 72) + spiral(92, 72), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 108q6-6 12 0t12 0t12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 30q10-10 20 0t-10 14M108 22q10-8 18 2t-8 14', ...SW(4) }, 'purple', { stroke: true }),
    s('path', { d: dots([[50, 52], [118, 46]], 3) }, 'purple')
  ],
  'desconexión': [
    s('path', { d: 'M14 80h30M116 80h30', ...SW(8) }, 'dark', { stroke: true }),
    s('rect', { x: 40, y: 62, width: 26, height: 36, rx: 6 }, 'gray'),
    s('path', { d: 'M66 70h14M66 90h14', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 100, y: 58, width: 22, height: 44, rx: 6 }, 'white'),
    s('rect', { x: 100, y: 58, width: 22, height: 44, rx: 6, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M90 46l-6 14h8l-6 14M90 114l-6-14h8l-6-14', ...SW(4) }, 'orange', { stroke: true, accent: true })
  ],
  desembocar: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'green'),
    s('path', { d: 'M14 104q60-10 132-6v48H14z' }, 'blue', { accent: true }),
    s('path', { d: 'M62 14q-10 24 6 44t-10 50h34q26-30 0-56t-12-38z' }, 'sky'),
    s('path', { d: 'M30 124q8-6 16 0t16 0M96 128q8-6 16 0t16 0', ...SW(3) }, 'white', { stroke: true })
  ],
  despiadado: [
    s('circle', { cx: 68, cy: 74, r: 42 }, 'gray'),
    s('path', { d: 'M44 58l18 8M92 58l-18 8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[54, 74], [82, 74]], 4) + 'M52 100q16-10 32 0z' }, 'dark'),
    s('path', { d: heart(122, 104, 20) }, 'sky', { accent: true }),
    s('path', { d: 'M122 90l-6 12 8 6-6 14', ...SW(3) }, 'white', { stroke: true })
  ],
  diagnosticar: [
    s('rect', { x: 84, y: 30, width: 54, height: 72, rx: 4 }, 'white'),
    s('rect', { x: 84, y: 30, width: 54, height: 72, rx: 4, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M92 54h10l4-10 6 20 4-10h14M94 76h36M94 88h26', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M30 24v34q0 22 20 22t20-22V24M50 80v30q0 22 22 22t22-16', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 96, cy: 114, r: 12 }, 'blue', { accent: true }),
    s('path', { d: dots([[30, 24], [70, 24]], 5) }, 'gray')
  ],
  dichoso: [
    ...person(80, 136, 'green', { h: 46, w: 32, r: 16 }),
    s('path', { d: 'M72 66q8 8 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 96l-20-34M96 96l20-34', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: dots([[30, 30], [40, 22], [48, 32], [38, 40]], 7) }, 'green', { accent: true }),
    s('path', { d: sparkle(122, 32, 12) + sparkle(104, 18, 6) }, 'yellow')
  ],
  dignamente: [
    s('rect', { x: 46, y: 116, width: 68, height: 20, rx: 3 }, 'gray'),
    ...person(80, 116, 'navy', { h: 50, w: 30, r: 13 }),
    s('path', { d: 'M74 52l6-8 6 8', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M74 72l6 12 6-12', ...SW(3) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 90, r: 7 }, 'yellow', { accent: true }),
    s('path', { d: laurel(80, 70, 52) }, 'green')
  ],
  distanciamiento: [
    ...person(30, 136, 'blue', { h: 40, w: 26, r: 12 }),
    ...person(130, 136, 'red', { h: 40, w: 26, r: 12 }),
    s('path', { d: 'M52 90h56M60 80l-10 10 10 10M100 80l10 10-10 10', ...SW(5) }, 'orange', { stroke: true, accent: true }),
    ground()
  ],
  'drástico': [
    s('path', { d: 'M20 36h44l18 70h20', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M64 36l18 82', ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M70 110l12 18 10-20', ...SW(8) }, 'red', { stroke: true }),
    s('path', { d: 'M120 20l-20 34h14l-16 34 34-44h-16l14-24z' }, 'yellow'),
    s('path', { d: 'M20 136h120', ...SW(3) }, 'gray', { stroke: true })
  ],
  eficientemente: [
    ...gear(56, 92, 26, 10, 'gray'),
    s('circle', { cx: 56, cy: 92, r: 9 }, 'white'),
    s('circle', { cx: 108, cy: 52, r: 30 }, 'white'),
    s('circle', { cx: 108, cy: 52, r: 30, ...SW(5) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M108 52V32M108 52l12 8M100 16h16', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 126h34M30 138h30', ...SW(4) }, 'orange', { stroke: true })
  ],
  enumerar: [
    s('rect', { x: 34, y: 18, width: 92, height: 124, rx: 6 }, 'white'),
    s('rect', { x: 34, y: 18, width: 92, height: 124, rx: 6, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[52, 42]], 7) }, 'red', { accent: true }),
    s('path', { d: dots([[52, 70]], 7) }, 'blue'),
    s('path', { d: dots([[52, 98]], 7) }, 'green'),
    s('path', { d: dots([[52, 126]], 7) }, 'orange'),
    s('path', { d: 'M68 42h44M68 70h36M68 98h44M68 126h30', ...SW(5) }, 'gray', { stroke: true })
  ],
  erotismo: [
    s('path', { d: heart(80, 86, 40) }, 'pink'),
    s('path', { d: 'M44 84q18-18 36-6q18-12 36 6q-18 6-36 6t-36-6z' }, 'red', { accent: true }),
    s('path', { d: 'M44 84q36 40 72 0q-18 6-36 6t-36-6z' }, 'red'),
    s('path', { d: 'M44 85q36 6 72 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  'escénico': [
    s('rect', { x: 14, y: 112, width: 132, height: 28 }, 'brown'),
    s('path', { d: 'M14 18h132v14H14z' }, 'red'),
    s('path', { d: 'M14 18h34q-8 50 6 94H14zM146 18h-34q8 50-6 94h40z' }, 'red', { accent: true }),
    s('path', { d: 'M62 112l18-74 18 74z' }, 'cream'),
    ...person(80, 112, 'purple', { h: 30, w: 22, r: 10 })
  ],
  estrofa: [
    ...paper(30, 16, 84, 128),
    s('path', { d: 'M42 34h56M42 46h48M42 58h56M42 70h40', ...SW(4) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M42 94h56M42 106h48M42 118h56M42 130h40', ...SW(4) }, 'purple', { stroke: true }),
    s('path', { d: 'M108 112q30-60 40-96q-30 16-40 96z' }, 'gray')
  ],
  evangelista: [
    s('path', { d: rays(80, 40, 14, 26, 8), ...SW(4) }, 'yellow', { stroke: true }),
    ...person(80, 136, 'purple', { h: 48, w: 32, r: 13 }),
    s('path', { d: 'M52 86l28 6 28-6v26l-28 6-28-6z' }, 'white'),
    s('path', { d: 'M52 86l28 6 28-6v26l-28 6-28-6zM80 92v26', ...SW(3) }, 'brown', { stroke: true, accent: true })
  ],
  'feligrés': [
    s('rect', { x: 50, y: 56, width: 60, height: 80 }, 'cream'),
    s('path', { d: 'M44 60l36-28 36 28z' }, 'brown'),
    s('path', { d: 'M80 32V10M72 18h16', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M70 136v-24a10 10 0 0 1 20 0v24z' }, 'brown'),
    s('path', { d: busts([24, 136], 136, 20, 30) }, 'blue', { accent: true }),
    s('path', { d: dots([[24, 98], [136, 98]], 9) }, 'skin'),
    s('circle', { cx: 80, cy: 80, r: 8 }, 'sky')
  ],
  fez: [
    s('path', { d: 'M50 120l10-80h40l10 80z' }, 'red', { accent: true }),
    s('ellipse', { cx: 80, cy: 120, rx: 30, ry: 8 }, 'red'),
    s('ellipse', { cx: 80, cy: 40, rx: 20, ry: 6 }, 'dark'),
    s('path', { d: 'M82 40q20 4 26 36', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M104 74l4 22 8-20z' }, 'dark')
  ],
  fiasco: [
    s('path', { d: 'M20 136q10-22 30-14q8-24 30-6q14-18 30 4q24-6 30 16z' }, 'pink', { accent: true }),
    s('path', { d: 'M54 110l-14 10M84 104l2-14M110 116l12-6', ...SW(4) }, 'cream', { stroke: true }),
    s('path', { d: dots([[38, 100], [96, 94], [124, 104]], 4) }, 'red'),
    ...face(80, 50, 26, 'yellow', 'frown'),
    s('path', { d: drop(100, 46, 4) }, 'sky')
  ],
  flojera: [
    s('path', { d: 'M18 136v-36q0-10 10-10h104q10 0 10 10v36zM18 90h124v20H18z' }, 'purple', { accent: true }),
    s('rect', { x: 40, y: 76, width: 76, height: 18, rx: 9 }, 'orange'),
    s('circle', { cx: 128, cy: 76, r: 12 }, 'skin'),
    s('path', { d: 'M122 76h6M132 76h4', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: dots([[110, 54], [100, 38]], 4) + dots([[88, 22]], 7) }, 'sky')
  ],
  gallinero: [
    s('path', { d: 'M18 60l52-30 52 30z' }, 'red'),
    s('rect', { x: 24, y: 60, width: 92, height: 76 }, 'brown'),
    s('path', { d: 'M58 136v-34a12 12 0 0 1 24 0v34z' }, 'dark'),
    s('path', { d: 'M96 124q-4-26 18-28l4-10 8 6-4 8q14 2 14 24z' }, 'white', { accent: true }),
    s('path', { d: 'M118 86l6-6 4 6M136 96l8 3-8 3', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M96 124q-4-26 18-28l4-10 8 6-4 8q14 2 14 24z', ...SW(2) }, 'gray', { stroke: true }),
    ground()
  ],
  gentileza: [
    ...person(46, 136, 'blue', { h: 46, w: 30, r: 13 }),
    ...person(118, 136, 'pink', { h: 40, w: 28, r: 12 }),
    s('path', { d: 'M60 104l28-8', ...SW(7) }, 'skin', { stroke: true }),
    ...flower(92, 66, 'red').slice(1)
  ],
  genuinamente: [
    s('path', { d: heart(80, 78, 34) }, 'red', { accent: true }),
    s('path', { d: 'M24 100q20 44 56 40q36 4 56-40l-14-6q-14 26-42 26t-42-26z' }, 'skin'),
    s('path', { d: sparkle(54, 42, 9) + sparkle(116, 28, 7) }, 'white')
  ],
  graffiti: [
    s('path', { d: rects([[14, 24, 132, 112]]) }, 'tan'),
    s('path', { d: 'M14 52h132M14 80h132M14 108h132M50 24v28M100 52v28M40 80v28M120 80v28M76 108v28', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M28 96q10-50 34-30t28-30q20-14 30 20', ...SW(10) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M34 124q20-24 40-4t40-14', ...SW(8) }, 'green', { stroke: true }),
    s('rect', { x: 118, y: 90, width: 18, height: 38, rx: 4 }, 'red')
  ],
  herradura: [
    s('path', { d: 'M48 136V72a32 32 0 0 1 64 0v64', ...SW(22, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: dots([[48, 120], [48, 96], [52, 72], [112, 120], [112, 96], [108, 72], [80, 41]], 3.5) }, 'dark'),
    s('path', { d: sparkle(130, 30, 10) + sparkle(24, 40, 7) }, 'yellow')
  ],
  idoneidad: [
    s('path', { d: 'M20 40h40q-6-14 10-14t10 14h40v40q-14-6-14 10t14 10v40H20z' }, 'blue'),
    s('path', { d: 'M100 70h40v24q-12-6-12 8t12 8v24h-40v-24q12 6 12-8t-12-8z' }, 'orange', { accent: true }),
    s('circle', { cx: 52, cy: 84, r: 16 }, 'green'),
    s('path', { d: 'M44 84l6 6 10-12', ...SW(4) }, 'white', { stroke: true })
  ],
  imperante: [
    s('path', { d: rects([[22, 100, 22, 36], [52, 88, 22, 48], [120, 106, 22, 30]]) }, 'gray'),
    s('rect', { x: 82, y: 58, width: 30, height: 78 }, 'purple', { accent: true }),
    s('path', { d: 'M78 50l2-26 9 12 8-16 8 16 9-12 2 26z' }, 'yellow'),
    ground()
  ],
  importador: [
    s('path', { d: 'M14 120h132v26H14z' }, 'blue'),
    s('path', { d: 'M24 98h86l-10 22H34z' }, 'red', { accent: true }),
    s('path', { d: rects([[34, 80, 20, 18], [56, 80, 20, 18], [78, 80, 20, 18], [45, 62, 20, 18]]) }, 'orange'),
    s('path', { d: rects([[34, 80, 20, 18], [56, 80, 20, 18], [78, 80, 20, 18], [45, 62, 20, 18]]), ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 40h36M124 28l14 12-14 12', ...SW(6) }, 'green', { stroke: true })
  ],
  inaccesible: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M40 146l14-80h52l14 80z' }, 'gray'),
    s('path', { d: 'M60 66V40h8v8h8v-8h8v8h8v-8h8v26z' }, 'brown', { accent: true }),
    s('path', { d: 'M76 66v-12h8v12z' }, 'dark'),
    s('path', { d: ells([[30, 98, 18, 8], [128, 116, 18, 8]]) }, 'white')
  ],
  'inalámbrico': [
    s('rect', { x: 34, y: 104, width: 92, height: 26, rx: 8 }, 'dark'),
    s('path', { d: dots([[50, 117], [64, 117]], 4) }, 'green'),
    s('path', { d: 'M110 104V84', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 66a26 26 0 0 1 36 0M48 50a46 46 0 0 1 64 0M34 34a66 66 0 0 1 92 0', ...SW(7) }, 'blue', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 82, r: 6 }, 'blue')
  ],
  incendiar: [
    s('path', { d: 'M28 136V80l40-30 40 30v56z' }, 'tan'),
    s('rect', { x: 56, y: 104, width: 24, height: 32 }, 'brown'),
    s('path', { d: 'M54 92q-10-30 10-50q0 18 12 20q-2-22 18-38q-4 28 14 40q4-12 0-22q30 22 12 50z' }, 'orange', { accent: true }),
    s('path', { d: 'M70 92q-2-14 8-22q2 10 10 10q4-8 2-14q14 12 6 26z' }, 'yellow'),
    s('path', { d: 'M118 136l20-30', ...SW(5) }, 'tan', { stroke: true }),
    s('circle', { cx: 138, cy: 104, r: 5 }, 'red'),
    ground()
  ],
  incidir: [
    s('ellipse', { cx: 80, cy: 116, rx: 64, ry: 22 }, 'blue'),
    s('path', { d: 'M48 116a32 10 0 1 0 64 0a32 10 0 1 0-64 0M64 116a16 5 0 1 0 32 0a16 5 0 1 0-32 0', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: drop(80, 60, 12) }, 'sky', { accent: true }),
    s('path', { d: 'M80 20v14M66 28l4 8M94 28l-4 8', ...SW(3) }, 'gray', { stroke: true })
  ],
  indudable: [
    s('path', { d: burst(80, 70, 52, 42, 16) }, 'yellow'),
    s('circle', { cx: 80, cy: 70, r: 36 }, 'green', { accent: true }),
    s('path', { d: 'M62 70l12 12 24-24', ...SW(8) }, 'white', { stroke: true }),
    s('path', { d: 'M62 112l-12 30 14-6 8 12 8-30M98 112l12 30-14-6-8 12-8-30' }, 'red')
  ],
  ineficaz: [
    s('rect', { x: 24, y: 60, width: 76, height: 32, rx: 16, transform: 'rotate(-30 62 76)' }, 'white'),
    s('path', { d: 'M24 76a16 16 0 0 1 16-16h22v32H40a16 16 0 0 1-16-16z', transform: 'rotate(-30 62 76)' }, 'blue'),
    s('rect', { x: 24, y: 60, width: 76, height: 32, rx: 16, transform: 'rotate(-30 62 76)', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 112, cy: 108, r: 28 }, 'red', { accent: true }),
    s('path', { d: 'M100 96l24 24M124 96l-24 24', ...SW(7) }, 'white', { stroke: true })
  ],
  inexistencia: [
    s('path', { d: 'M80 26a18 18 0 1 1 0 36a18 18 0 1 1 0-36M50 136v-40q0-24 30-24t30 24v40', ...DASH(5, '8 8') }, 'gray', { stroke: true }),
    s('path', { d: ring(80, 92, 62), ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M36 136l88-88', ...SW(6) }, 'red', { stroke: true })
  ],
  influenza: [
    ...person(62, 136, 'blue', { h: 50, w: 34, r: 18 }),
    s('path', { d: 'M48 60q4-6 8 0M66 60q4-6 8 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 74l26 20', ...SW(4) }, 'red', { stroke: true }),
    s('circle', { cx: 62, cy: 66, r: 5 }, 'pink'),
    s('path', { d: rays(122, 46, 12, 20, 8), ...SW(4) }, 'green', { stroke: true }),
    s('circle', { cx: 122, cy: 46, r: 13 }, 'green', { accent: true }),
    s('path', { d: dots([[118, 42], [127, 50]], 3) }, 'mint')
  ],
  'jabalí': [
    s('path', { d: 'M30 92q0-34 44-34q30 0 44 14l18 14q6 6 0 12l-16 4q-10 22-46 22q-44 0-44-32z' }, 'brown', { accent: true }),
    s('path', { d: 'M44 118v18M60 120v16M92 120v16M106 116v20', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M44 60l6-12 6 12 6-12 6 12 6-12 6 12', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M124 98q8-2 6-14', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: dots([[112, 80]], 3) + 'M30 86q-12 0-12-10' }, 'dark'),
    s('ellipse', { cx: 138, cy: 92, rx: 4, ry: 6 }, 'pink')
  ],
  lacra: [
    s('rect', { x: 14, y: 40, width: 132, height: 80, rx: 30 }, 'skin'),
    s('path', { d: 'M38 84q42-20 84-4', ...SW(6) }, 'pink', { stroke: true, accent: true }),
    s('path', { d: 'M50 70l4 16M66 66l2 16M82 64v16M98 66l-2 16M112 70l-4 16', ...SW(3) }, 'dark', { stroke: true })
  ],
  'legitimación': [
    ...paper(22, 26, 116, 86),
    s('path', { d: 'M38 46h84M38 60h70M38 74h80', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 112l-8 30 12-8 8 12 4-34z' }, 'blue'),
    s('path', { d: burst(106, 102, 22, 18, 12) }, 'red', { accent: true }),
    s('path', { d: 'M98 102l6 6 10-12', ...SW(4) }, 'white', { stroke: true })
  ],
  lucrativo: [
    s('path', { d: 'M56 54q-24 30-24 54q0 28 38 28t38-28q0-24-24-54z' }, 'tan'),
    s('path', { d: 'M56 54l-8-16h44l-8 16', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 70, cy: 104, r: 14 }, 'yellow', { accent: true }),
    s('path', { d: 'M108 112l18-24 10 10 10-40', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M136 56l10 2 2 10', ...SW(5) }, 'green', { stroke: true })
  ],
  'manutención': [
    ...person(46, 136, 'navy', { h: 56, w: 32, r: 14 }),
    ...person(118, 136, 'orange', { h: 30, w: 22, r: 11 }),
    s('path', { d: 'M60 96h32', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M86 88h20q0 14-10 14t-10-14z' }, 'red', { accent: true }),
    s('path', { d: dots([[92, 82], [100, 82]], 4) }, 'yellow'),
    ground()
  ],
  materialismo: [
    s('path', { d: 'M24 136v-32h36v32zM100 136v-40h40v40z' }, 'red'),
    s('path', { d: 'M28 104q14-18 28 0M106 96q14-18 28 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 52l12-16h24l12 16-24 30z' }, 'sky', { accent: true }),
    s('path', { d: 'M56 52h48M68 36l12 46 12-46', ...SW(2) }, 'blue', { stroke: true }),
    s('path', { d: dots([[72, 116], [86, 124], [76, 132], [62, 128]], 8) }, 'yellow')
  ],
  mausoleo: [
    s('rect', { x: 20, y: 126, width: 120, height: 12 }, 'gray'),
    s('rect', { x: 30, y: 116, width: 100, height: 10 }, 'gray'),
    s('rect', { x: 38, y: 64, width: 84, height: 52 }, 'cream'),
    s('path', { d: 'M48 70v40M64 70v40M96 70v40M112 70v40', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M32 64L80 40l48 24z' }, 'gray', { accent: true }),
    s('path', { d: 'M64 40a16 16 0 0 1 32 0z' }, 'gray'),
    s('rect', { x: 72, y: 86, width: 16, height: 30 }, 'dark')
  ],
  melena: [
    s('path', { d: burst(80, 80, 62, 46, 16) }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 82, r: 36 }, 'yellow'),
    s('path', { d: dots([[66, 72], [94, 72]], 4) }, 'dark'),
    s('path', { d: 'M72 90h16l-8 8z' }, 'brown'),
    s('path', { d: 'M80 98v6M70 108q10 6 20 0', ...SW(3) }, 'brown', { stroke: true })
  ],
  miga: [
    s('path', { d: 'M34 70q-14-30 20-34q26-10 52 0q34 4 20 34v52q0 6-6 6H40q-6 0-6-6z' }, 'brown'),
    s('path', { d: 'M44 74q-10-24 14-26q22-8 44 0q24 2 14 26v42H44z' }, 'cream', { accent: true }),
    s('path', { d: dots([[58, 72], [80, 66], [98, 84], [66, 98], [92, 106]], 2.5) }, 'tan'),
    s('path', { d: dots([[22, 138], [40, 142], [112, 140], [130, 136], [140, 144]], 3) }, 'tan'),
    s('path', { d: 'M14 146h132', ...SW(2) }, 'gray', { stroke: true })
  ],
  minar: [
    s('path', { d: 'M14 146V70q0-50 66-50t66 50v76z' }, 'brown'),
    s('path', { d: 'M38 146V84q0-34 42-34t42 34v62z' }, 'dark'),
    s('path', { d: dots([[60, 116], [96, 104], [84, 128]], 6) }, 'yellow', { accent: true }),
    s('path', { d: 'M54 72l40 40', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: 'M48 92q14-26 40-28', ...SW(6) }, 'gray', { stroke: true })
  ],
  'momentáneamente': [
    s('path', { d: 'M48 22h64M48 138h64', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M54 22q0 38 26 58q-26 20-26 58h52q0-38-26-58q26-20 26-58z' }, 'sky'),
    s('path', { d: 'M62 134q18-26 36 0z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 72v40', ...DASH(3, '3 5') }, 'orange', { stroke: true }),
    s('path', { d: sparkle(128, 48, 12) }, 'orange')
  ],
  'níquel': [
    backdrop('navy'),
    s('path', { d: 'M24 128l12-28h46l12 28zM66 128l12-28h46l12 28z' }, 'gray'),
    s('path', { d: 'M44 100l12-28h46l12 28z' }, 'gray', { accent: true }),
    s('path', { d: 'M56 72h46l-6 10H62zM36 100h46l-6 10H42zM78 100h46l-6 10H84z' }, 'white'),
    s('path', { d: sparkle(126, 44, 10) + sparkle(34, 66, 7) }, 'sky')
  ],
  organizacional: [
    s('path', { d: 'M80 44v24M36 68h88M36 68v20M80 68v20M124 68v20', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 60, y: 20, width: 40, height: 26, rx: 5 }, 'navy', { accent: true }),
    s('path', { d: rects([[18, 88, 36, 22], [62, 88, 36, 22], [106, 88, 36, 22]]) }, 'blue'),
    s('path', { d: 'M36 110v14M124 110v14', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[22, 124, 28, 16], [110, 124, 28, 16]]) }, 'sky')
  ],
  'osadía': [
    s('path', { d: 'M14 146V96h46v50zM104 146V96h42v50z' }, 'brown'),
    s('path', { d: 'M76 76l20-12', ...SW(10) }, 'skin', { stroke: true }),
    ...lean(80, 84, 40, 'red', { h: 30, w: 22, r: 10, accent: true }),
    s('path', { d: 'M74 84l-12 10M82 86l10 6', ...SW(6) }, 'navy', { stroke: true }),
    s('path', { d: 'M26 52q24-30 54-22', ...DASH(3, '4 6') }, 'gray', { stroke: true })
  ],
  penalti: [
    s('rect', { x: 14, y: 96, width: 132, height: 50 }, 'green'),
    s('path', { d: 'M30 96V36h100v60', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M36 44h88M36 58h88M36 72h88M36 86h88M50 40v56M70 40v56M90 40v56M110 40v56', ...SW(1.5) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 96V36h100v60', ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 124, r: 12 }, 'white', { accent: true }),
    s('path', { d: 'M74 118l6 4 6-4v8l-6 4-6-4z' }, 'dark')
  ],
  presentir: [
    ...person(46, 136, 'blue', { h: 48, w: 32, r: 14 }),
    s('path', { d: 'M46 42q-20-10-14-28M46 42q20-10 14-28', ...SW(3) }, 'purple', { stroke: true }),
    s('path', { d: sparkle(46, 28, 10) }, 'purple', { accent: true }),
    s('path', { d: ells([[112, 50, 26, 16], [96, 60, 16, 12], [130, 60, 14, 10]]) }, 'gray'),
    s('path', { d: 'M114 70l-8 18h10l-8 18', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M70 60q12-4 16 4', ...DASH(3, '3 5') }, 'gray', { stroke: true })
  ],
  puntualidad: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'white'),
    s('circle', { cx: 80, cy: 80, r: 60, ...SW(8) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: rays(80, 80, 48, 54, 12), ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 80V36M80 80h28', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 120, cy: 120, r: 18 }, 'green'),
    s('path', { d: 'M112 120l6 6 10-12', ...SW(4) }, 'white', { stroke: true })
  ],
  purgatorio: [
    s('path', { d: ells([[50, 34, 26, 14], [84, 28, 24, 16], [116, 36, 26, 14]]) }, 'white'),
    s('path', { d: ells([[50, 34, 26, 14], [84, 28, 24, 16], [116, 36, 26, 14]]), ...SW(2) }, 'sky', { stroke: true }),
    s('path', { d: 'M14 146q6-24 18-30q-2 14 8 16q0-20 18-30q-4 22 10 26q6-16 0-28q26 18 22 46q10-8 8-20q22 12 18 24q8-6 6-18q16 12 24 20z' }, 'orange', { accent: true }),
    ...person(80, 116, 'gray', { h: 30, w: 22, r: 10 }),
    s('path', { d: 'M80 70V58M74 64l6-6 6 6', ...SW(3) }, 'yellow', { stroke: true })
  ],
  'páncreas': [
    s('path', { d: 'M40 30q-14 50 0 104h80q14-54 0-104z' }, 'cream'),
    s('path', { d: 'M40 30q-14 50 0 104h80q14-54 0-104z', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M60 52q30-8 40 14q4 20-24 20q-20 0-16-34z' }, 'pink'),
    s('path', { d: 'M40 98q8-14 22-8q20 6 40-2q20-6 22 6q-6 12-24 12q-24 0-34 4q-22 6-26-12z' }, 'orange', { accent: true }),
    s('path', { d: 'M48 98q30 6 66-6', ...SW(2) }, 'brown', { stroke: true })
  ],
  'párpado': [
    s('path', { d: 'M18 84q62-60 124 0q-62 46-124 0z' }, 'white'),
    s('circle', { cx: 80, cy: 82, r: 22 }, 'brown'),
    s('circle', { cx: 80, cy: 82, r: 10 }, 'black'),
    s('path', { d: 'M18 84q62-60 124 0q-62-30-124 0z' }, 'skin', { accent: true }),
    s('path', { d: 'M18 84q62-30 124 0M40 72l-8-12M62 64l-4-14M86 62l2-14M108 66l6-12M128 76l10-8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 84q62 46 124 0', ...SW(3) }, 'tan', { stroke: true })
  ],
  'pórtico': [
    s('path', { d: 'M20 50L80 22l60 28z' }, 'tan', { accent: true }),
    s('rect', { x: 20, y: 50, width: 120, height: 10 }, 'cream'),
    s('path', { d: 'M34 60v66M60 60v66M100 60v66M126 60v66', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'cream', { stroke: true }),
    s('path', { d: 'M34 60v66M60 60v66M100 60v66M126 60v66M20 50h120v10H20z', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 68, y: 86, width: 24, height: 40 }, 'brown'),
    s('rect', { x: 14, y: 126, width: 132, height: 12 }, 'gray')
  ],
  quicio: [
    s('rect', { x: 30, y: 18, width: 66, height: 124 }, 'brown'),
    s('path', { d: 'M96 18l40 12v100l-40 12z' }, 'tan'),
    s('rect', { x: 88, y: 36, width: 16, height: 22, rx: 3 }, 'gray', { accent: true }),
    s('rect', { x: 88, y: 102, width: 16, height: 22, rx: 3 }, 'gray', { accent: true }),
    s('path', { d: 'M96 32v30M96 98v30', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 126, cy: 82, r: 4 }, 'yellow')
  ],
  'ramificación': [
    s('path', { d: 'M80 144V96M80 96L46 62M80 96l34-34M46 62L28 36M46 62l14-28M114 62l-12-28M114 62l20-24', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: dots([[28, 30], [60, 28], [102, 28], [134, 32]], 10) }, 'green', { accent: true }),
    s('path', { d: dots([[46, 62], [114, 62], [80, 96]], 6) }, 'orange')
  ],
  recalcar: [
    ...paper(22, 26, 96, 112),
    s('rect', { x: 32, y: 60, width: 74, height: 14 }, 'yellow'),
    s('path', { d: 'M36 46h64M36 67h64M36 88h50M36 106h60M34 78h70M34 82h70', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 79h72', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M108 72l30-50 12 8-30 50-14 4z' }, 'orange', { accent: true })
  ],
  remediar: [
    s('path', { d: 'M40 40h80v80H40z' }, 'blue'),
    s('path', { d: 'M60 40l12 26-14 16 16 20-6 18', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 36, y: 66, width: 80, height: 26, rx: 13, transform: 'rotate(-35 76 79)' }, 'tan', { accent: true }),
    s('rect', { x: 62, y: 70, width: 28, height: 18, transform: 'rotate(-35 76 79)' }, 'cream'),
    s('path', { d: sparkle(130, 34, 10) }, 'yellow')
  ],
  resorte: [
    s('rect', { x: 48, y: 20, width: 64, height: 10, rx: 4 }, 'dark'),
    s('path', { d: 'M80 30q30 4 0 12q-30 8 0 12q30 4 0 12q-30 8 0 12q30 4 0 12q-30 8 0 12q30 4 0 12', ...SW(6) }, 'gray', { stroke: true, accent: true }),
    s('rect', { x: 56, y: 126, width: 48, height: 14, rx: 4 }, 'red'),
    s('path', { d: 'M28 60v40M132 60v40M22 66l6-6 6 6M126 66l6-6 6 6M22 94l6 6 6-6M126 94l6 6 6-6', ...SW(3) }, 'orange', { stroke: true })
  ],
  revestimiento: [
    s('rect', { x: 14, y: 18, width: 132, height: 124 }, 'gray'),
    s('rect', { x: 14, y: 18, width: 64, height: 124 }, 'mint'),
    s('rect', { x: 66, y: 60, width: 28, height: 40, rx: 8 }, 'green', { accent: true }),
    s('path', { d: 'M94 80h22v50', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: drop(80, 112, 4) }, 'green')
  ],
  'rubí': [
    s('path', { d: 'M48 38h64l26 30-58 70-58-70z' }, 'red', { accent: true }),
    s('path', { d: 'M22 68h116M48 38l12 30 20-30 20 30 12-30M60 68l20 70 20-70', ...SW(2) }, 'pink', { stroke: true }),
    s('path', { d: sparkle(124, 32, 10) }, 'yellow')
  ],
  sacudida: [
    s('path', { d: 'M48 122V72l32-26 32 26v50z' }, 'tan', { transform: 'rotate(-8 80 122)' }),
    s('rect', { x: 70, y: 96, width: 18, height: 26, transform: 'rotate(-8 80 122)' }, 'brown'),
    s('path', { d: 'M14 136l14-8 14 8 14-8 14 8 14-8 14 8 14-8 14 8 14-8 12 8', ...SW(5) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M30 70v30M20 80v14M130 70v30M140 80v14', ...SW(4) }, 'orange', { stroke: true })
  ],
  simulador: [
    s('rect', { x: 22, y: 22, width: 116, height: 70, rx: 8 }, 'dark'),
    s('rect', { x: 30, y: 30, width: 100, height: 54, rx: 4 }, 'sky'),
    s('path', { d: 'M30 66h100v18H30z' }, 'green'),
    s('path', { d: 'M80 44l4 10 14 6v4l-14-2v8l4 3v2l-8-2-8 2v-2l4-3v-8l-14 2v-4l14-6z' }, 'white', { accent: true }),
    s('rect', { x: 50, y: 112, width: 60, height: 24, rx: 8 }, 'blue'),
    s('path', { d: 'M80 92v20M60 104h40', ...SW(5) }, 'gray', { stroke: true })
  ],
  sociable: [
    ...person(36, 136, 'red', { h: 40, w: 26, r: 12 }),
    ...person(80, 136, 'blue', { h: 46, w: 28, r: 13, accent: true }),
    ...person(124, 136, 'green', { h: 40, w: 26, r: 12 }),
    s('path', { d: bubble(46, 14, 30, 22) + bubble(96, 14, 30, 22) }, 'yellow')
  ],
  sorete: [
    s('path', { d: 'M38 128q-10-20 18-22q-8-18 14-22q-4-20 14-28q4 14 12 20q12 4 8 16q20 2 14 20q18 6 6 16z' }, 'brown', { accent: true }),
    s('path', { d: 'M56 106h44M70 84h26', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M40 40q4-10 10 0M110 34q4-10 10 0M126 60q4-10 10 0', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[45, 44], [115, 38], [131, 64]], 4) }, 'dark')
  ],
  sudafricano: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M48 24q30-8 50 4q12 10 26 6q10 4 4 18q-10 14-12 30q-4 22-18 34q-8 14-22 12q-6-14-8-30q-2-12-12-18q-18 0-26-10q-4-18 2-30z' }, 'tan'),
    s('path', { d: 'M74 114q8 4 14-4q10-8 12-18l-28 2q-4 10 2 20z' }, 'green', { accent: true }),
  ],
  sujetador: [
    s('path', { d: 'M80 18v8M44 50l36-24 36 24', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 62v14M120 62v14', ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: 'M28 108q0-32 26-34q22 2 26 30q4-28 26-30q26 2 26 34z' }, 'pink', { accent: true }),
    s('path', { d: 'M22 108h116', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M40 76q-12-10-6-22M120 76q12-10 6-22', ...SW(3) }, 'pink', { stroke: true })
  ],
  sujetar: [
    s('path', { d: 'M20 80h120', ...SW(10) }, 'brown', { stroke: true }),
    s('rect', { x: 36, y: 62, width: 34, height: 40, rx: 12 }, 'skin', { accent: true }),
    s('rect', { x: 90, y: 62, width: 34, height: 40, rx: 12 }, 'skin'),
    s('path', { d: 'M38 74h30M38 86h30M92 74h30M92 86h30', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M52 102v34M106 102v34', ...SW(12) }, 'blue', { stroke: true })
  ],
  'superstición': [
    s('path', { d: 'M36 140L60 18M98 140L122 18M42 112h62M48 82h62M54 52h62', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M62 140q-4-28 14-34l4-12 6 6 6-6 2 14q8 10 4 32z' }, 'black', { accent: true }),
    s('path', { d: 'M98 136q24 0 22-22', ...SW(5) }, 'black', { stroke: true }),
    s('path', { d: dots([[80, 106], [90, 106]], 2.5) }, 'yellow')
  ],
  suscitar: [
    s('path', { d: 'M20 132q30 0 50-24', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 20, cy: 132, r: 6 }, 'orange'),
    s('path', { d: burst(98, 74, 46, 24, 12) }, 'yellow', { accent: true }),
    s('path', { d: burst(98, 74, 24, 12, 8) }, 'red'),
    s('path', { d: sparkle(28, 120, 8) }, 'yellow')
  ],
  taladro: [
    s('path', { d: 'M30 46h80q8 0 8 8v20q0 8-8 8H30q-8 0-8-8V54q0-8 8-8z' }, 'orange', { accent: true }),
    s('path', { d: 'M50 82h28l-8 50H44z' }, 'dark'),
    s('rect', { x: 118, y: 56, width: 12, height: 16 }, 'gray'),
    s('path', { d: 'M130 64h18', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M134 58l4 12M142 58l4 12', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 36, y: 128, width: 46, height: 10, rx: 3 }, 'gray')
  ],
  tambo: [
    s('path', { d: 'M34 104v30M50 106v28M90 106v28M104 104v30', ...SW(7) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 70, cy: 86, rx: 44, ry: 24 }, 'white'),
    s('ellipse', { cx: 70, cy: 86, rx: 44, ry: 24, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[54, 80, 12, 9], [88, 92, 10, 8]]) + 'M108 52l-8-8 12 2zM138 52l8-8-12 2z' }, 'dark'),
    s('path', { d: 'M108 64q0-16 15-16t15 16v12q0 10-15 10t-15-10z' }, 'dark'),
    s('ellipse', { cx: 123, cy: 82, rx: 13, ry: 8 }, 'pink'),
    s('path', { d: 'M58 118h26l-4 20H62z' }, 'blue', { accent: true })
  ],
  tauromaquia: [
    s('rect', { x: 14, y: 116, width: 132, height: 26, rx: 4 }, 'tan'),
    s('path', { d: 'M20 96q0-26 30-26h22q20 0 22 14l6 14q-4 10-16 8l-8 10H34q-14-2-14-20z' }, 'black'),
    s('path', { d: 'M28 116v10M70 114v12M82 90q10-18 20-14M80 82q-2-14 6-18', ...SW(5) }, 'black', { stroke: true }),
    s('path', { d: 'M96 72q4-12-4-18M96 72q14-4 14-14', ...SW(4) }, 'cream', { stroke: true }),
    ...person(126, 116, 'yellow', { h: 40, w: 22, r: 10 }),
    s('path', { d: 'M114 68q-20 20-8 52q14 0 20-6q-8-20-12-46z' }, 'red', { accent: true })
  ],
  'termómetro': [
    s('rect', { x: 66, y: 16, width: 28, height: 104, rx: 14 }, 'white'),
    s('rect', { x: 66, y: 16, width: 28, height: 104, rx: 14, ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 74, y: 56, width: 12, height: 70 }, 'red'),
    s('circle', { cx: 80, cy: 124, r: 20 }, 'red', { accent: true }),
    s('path', { d: 'M100 36h12M100 52h8M100 68h12M100 84h8M100 100h12', ...SW(3) }, 'gray', { stroke: true })
  ],
  transbordador: [
    s('path', { d: 'M14 112h132v34H14z' }, 'blue'),
    s('path', { d: 'M18 92h124l-14 26H32z' }, 'white', { accent: true }),
    s('path', { d: 'M18 92h124l-14 26H32z', ...SW(3) }, 'navy', { stroke: true }),
    s('rect', { x: 48, y: 58, width: 64, height: 34, rx: 4 }, 'red'),
    s('path', { d: grid(56, 66, 4, 1, 10, 10, 14, 0) }, 'sky'),
    s('path', { d: 'M24 128q10-6 20 0t20 0t20 0t20 0t20 0', ...SW(3) }, 'sky', { stroke: true })
  ],
  transformador: [
    s('path', { d: 'M56 14v132M30 30h52', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M30 30q30 10 60 6M82 30q30 4 60 0', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 64, y: 54, width: 40, height: 56, rx: 8 }, 'gray', { accent: true }),
    s('path', { d: 'M64 66h40M64 98h40', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M92 72l-10 12h10l-10 12', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M124 70l-10 18h12l-10 18', ...SW(4) }, 'orange', { stroke: true })
  ],
  varita: [
    s('path', { d: 'M30 132l70-70', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 132l14-14', ...SW(8) }, 'white', { stroke: true }),
    s('path', { d: star(108, 52, 22) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(56, 40, 9) + sparkle(134, 96, 10) + sparkle(84, 22, 6) + sparkle(136, 22, 6) }, 'purple')
  ],
  vasallo: [
    s('rect', { x: 92, y: 66, width: 46, height: 70, rx: 6 }, 'red'),
    ...person(112, 120, 'purple', { h: 40, w: 28, r: 12 }),
    s('path', { d: 'M100 56l2-14 6 6 4-10 4 10 6-6 2 14z' }, 'yellow', { accent: true }),
    s('circle', { cx: 50, cy: 80, r: 11 }, 'skin'),
    s('path', { d: 'M38 96q4-8 20-4l10 20H48v24H36z' }, 'blue'),
    ground()
  ],
  vocacional: [
    s('rect', { x: 26, y: 62, width: 108, height: 72, rx: 8 }, 'brown'),
    s('path', { d: 'M62 62V48q0-6 6-6h24q6 0 6 6v14', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M26 88h108', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: heart(80, 100, 18) }, 'red', { accent: true }),
    s('path', { d: sparkle(130, 34, 10) + sparkle(26, 40, 7) }, 'yellow')
  ],
  zumbido: [
    s('path', { d: HEAD, transform: 'translate(-26 0)' }, 'skin'),
    s('path', { d: 'M54 76q-12-12 0-22q12 6 4 18', ...SW(4) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 124, cy: 52, rx: 16, ry: 12 }, 'yellow', { accent: true }),
    s('path', { d: 'M118 42v20M128 42v20', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[116, 36, 8, 6], [130, 34, 8, 6]]) }, 'sky'),
    s('path', { d: 'M100 46q-6 6 0 12M90 40q-10 12 0 24', ...SW(3) }, 'orange', { stroke: true })
  ],
  acariciar: [
    s('path', { d: 'M24 136q-4-44 34-44h40q28 0 28 28v16z' }, 'orange', { accent: true }),
    s('circle', { cx: 116, cy: 86, r: 22 }, 'orange'),
    s('path', { d: 'M100 72l-2-18 14 10zM132 72l2-18-14 10z' }, 'orange'),
    s('path', { d: 'M108 88q4-4 8 0M120 88q4-4 8 0M24 128q-14-8-8-24', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 72q0-16 18-16h34q10 0 10 8t-10 8H66v14H40q-10 0-10-14z' }, 'skin'),
    s('path', { d: 'M60 40q14-8 28 0M60 30q14-8 28 0', ...SW(3) }, 'pink', { stroke: true })
  ],
  afianzar: [
    s('rect', { x: 66, y: 22, width: 28, height: 104 }, 'brown', { accent: true }),
    s('path', { d: 'M80 34L22 132M80 34l58 98', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 46, y: 118, width: 68, height: 22, rx: 4 }, 'gray'),
    s('path', { d: dots([[22, 132], [138, 132]], 6) }, 'dark'),
    s('path', { d: dots([[80, 50], [80, 80], [80, 110]], 3.5) }, 'dark')
  ],
  amenazante: [
    s('path', { d: ells([[56, 48, 34, 22], [96, 40, 32, 26], [118, 58, 24, 18], [40, 64, 20, 14]]) }, 'dark', { accent: true }),
    s('path', { d: 'M86 72l-12 22h14l-14 26', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M108 136v-22l14-12 14 12v22z' }, 'tan'),
    s('path', { d: 'M30 82v8M46 86v8M60 82v8M126 80v8', ...SW(3) }, 'blue', { stroke: true }),
    ground()
  ],
  angostura: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 14h50q-6 40 4 70t-2 62H14zM146 14H96q6 40-4 70t2 62h52z' }, 'brown', { accent: true }),
    s('path', { d: 'M70 146q-4-30 4-60t-4-72h12q8 40 0 72t-2 60z' }, 'blue'),
    s('path', { d: 'M28 40l14 10M120 60l14 8M24 100l16 6M120 110l16-4', ...SW(3) }, 'tan', { stroke: true })
  ],
  arbitral: [
    ...person(70, 136, 'black', { h: 52, w: 34, r: 14 }),
    s('path', { d: 'M54 96v4M70 96v4M86 96v4', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M86 92l22-36', ...SW(8) }, 'skin', { stroke: true }),
    s('rect', { x: 100, y: 22, width: 22, height: 32, rx: 3, transform: 'rotate(12 111 38)' }, 'yellow', { accent: true }),
    s('path', { d: 'M72 74h10', ...SW(4) }, 'gray', { stroke: true }),
    ground()
  ],
  arraigo: [
    s('rect', { x: 14, y: 82, width: 132, height: 64, rx: 6 }, 'brown'),
    s('rect', { x: 72, y: 48, width: 16, height: 38 }, 'tan'),
    s('path', { d: ells([[80, 40, 40, 26]]) }, 'green'),
    s('path', { d: 'M80 84v52M80 92l-30 20-12 26M80 92l30 20 14 22M80 104l-18 34M80 104l20 30M50 112l-24 4M110 112l26 0', ...SW(5) }, 'tan', { stroke: true, accent: true })
  ],
  'autovía': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'green'),
    s('path', { d: 'M70 40h20l56 106H14z' }, 'dark'),
    s('path', { d: 'M80 40v106', ...SW(4) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M74 52l-6 14M66 82l-8 18M54 116l-10 22M86 52l6 14M94 82l8 18M106 116l10 22', ...SW(3) }, 'white', { stroke: true }),
    s('rect', { x: 14, y: 14, width: 132, height: 26, rx: 12 }, 'sky')
  ],
  'añadido': [
    s('path', { d: rects([[32, 100, 50, 36], [32, 64, 50, 36]]) }, 'blue'),
    s('path', { d: rects([[32, 100, 50, 36], [32, 64, 50, 36]]), ...SW(3) }, 'navy', { stroke: true }),
    s('rect', { x: 32, y: 22, width: 50, height: 36, rx: 2 }, 'orange', { accent: true }),
    s('path', { d: 'M118 68v40M98 88h40', ...SW(10) }, 'green', { stroke: true }),
    s('path', { d: 'M88 40h16', ...DASH(3, '3 5') }, 'gray', { stroke: true })
  ],
  blindaje: [
    s('path', { d: 'M18 116V68q0-12 12-12h70l22 22h12q10 0 10 10v28z' }, 'gray', { accent: true }),
    s('path', { d: 'M104 62l16 18h-16z' }, 'navy'),
    s('path', { d: dots([[44, 118], [116, 118]], 14) }, 'dark'),
    s('path', { d: dots([[30, 66], [50, 66], [70, 66], [90, 66], [30, 106], [50, 106], [70, 106], [90, 106]], 3) }, 'dark'),
    s('path', { d: 'M18 86h126', ...SW(3) }, 'dark', { stroke: true })
  ],
  boceto: [
    s('rect', { x: 20, y: 24, width: 100, height: 116, rx: 4 }, 'cream'),
    s('path', { d: 'M24 18v14M40 18v14M56 18v14M72 18v14M88 18v14M104 18v14', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 110q10-40 30-46q20 6 30 46zM56 64a14 14 0 1 1 28 0a14 14 0 1 1-28 0M36 112h68', ...DASH(3, '10 4') }, 'dark', { stroke: true }),
    s('path', { d: 'M116 132l24-70 8 3-24 70-8 6z' }, 'yellow', { accent: true })
  ],
  buffet: [
    s('rect', { x: 14, y: 84, width: 132, height: 14, rx: 3 }, 'brown'),
    s('path', { d: 'M22 98v38M138 98v38', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M20 84a18 18 0 0 1 36 0zM62 84a18 18 0 0 1 36 0zM104 84a18 18 0 0 1 36 0z' }, 'gray', { accent: true }),
    s('path', { d: 'M38 66v-4M80 66v-4M122 66v-4', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 48q4-6 0-12M42 48q4-6 0-12M76 48q4-6 0-12M118 48q4-6 0-12M132 48q4-6 0-12', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[40, 124, 14, 5], [80, 124, 14, 5], [120, 124, 14, 5]]) }, 'white'),
    s('path', { d: 'M26 124a14 5 0 1 0 28 0a14 5 0 1 0-28 0M66 124a14 5 0 1 0 28 0a14 5 0 1 0-28 0M106 124a14 5 0 1 0 28 0a14 5 0 1 0-28 0', ...SW(2) }, 'gray', { stroke: true })
  ],
  cabaret: [
    backdrop('purple'),
    s('circle', { cx: 80, cy: 40, r: 16 }, 'yellow'),
    ...lady(80, 120, 'red', { accent: true }),
    s('path', { d: 'M40 126v-50M34 76h12', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 120h132v26H14z' }, 'dark'),
    s('path', { d: dots([[26, 30], [134, 30], [26, 100], [134, 100]], 4) }, 'cream')
  ],
  calidez: [
    s('path', { d: 'M46 70h56v42q0 20-28 20t-28-20z' }, 'orange', { accent: true }),
    s('path', { d: 'M102 80h8q12 0 12 14t-12 14h-10', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M28 116q-6-30 22-30M120 116q6-30-22-30', ...SW(14) }, 'skin', { stroke: true }),
    s('path', { d: 'M62 58q-6-10 0-18t0-18M86 58q-6-10 0-18t0-18', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: heart(74, 100, 10) }, 'cream')
  ],
  'champaña': [
    s('path', { d: 'M54 140V84q0-14 12-22V40h20v22q12 8 12 22v56z' }, 'green', { accent: true }),
    s('rect', { x: 66, y: 38, width: 20, height: 14 }, 'yellow'),
    s('rect', { x: 58, y: 92, width: 36, height: 26 }, 'cream'),
    s('path', { d: 'M90 14l14-6 4 10-14 6z' }, 'tan'),
    s('path', { d: dots([[100, 30], [112, 40], [96, 46], [118, 24], [124, 50]], 3.5) }, 'yellow'),
    s('path', { d: 'M108 18l14-8M110 30l18 0', ...SW(3) }, 'orange', { stroke: true })
  ],
  chequear: [
    s('rect', { x: 30, y: 22, width: 76, height: 112, rx: 6 }, 'brown'),
    s('rect', { x: 38, y: 34, width: 60, height: 92, rx: 2 }, 'white'),
    s('rect', { x: 52, y: 16, width: 32, height: 14, rx: 4 }, 'gray'),
    s('path', { d: 'M44 50l5 5 9-10M44 76l5 5 9-10M44 102l5 5 9-10', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M64 52h26M64 78h26M64 104h26', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ring(112, 102, 18), ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M125 115l16 16', ...SW(8) }, 'blue', { stroke: true })
  ],
  'clímax': [
    s('path', { d: 'M20 136h24v-22h24V92h24V70h24v66z' }, 'blue'),
    s('path', { d: burst(104, 42, 30, 16, 10) }, 'yellow', { accent: true }),
    s('path', { d: burst(104, 42, 14, 8, 8) }, 'red'),
    ...person(32, 114, 'orange', { h: 22, w: 16, r: 8 })
  ],
  compilar: [
    s('path', { d: rects([[18, 20, 26, 32], [54, 14, 26, 32], [90, 20, 26, 32]]) }, 'white'),
    s('path', { d: rects([[18, 20, 26, 32], [54, 14, 26, 32], [90, 20, 26, 32]]), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M31 58l22 28M67 52v28M103 58l-22 28', ...SW(4) }, 'orange', { stroke: true }),
    s('rect', { x: 46, y: 92, width: 68, height: 48, rx: 4 }, 'navy', { accent: true }),
    s('path', { d: 'M56 92v48M68 108h36M68 120h28', ...SW(3) }, 'sky', { stroke: true })
  ],
  conjuro: [
    s('path', { d: 'M30 92h100q-4 46-50 46T30 92z' }, 'black'),
    s('path', { d: 'M24 92h112', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 88q-6-20 10-20q0-14 14-12q12-8 18 6q16 0 12 26z' }, 'green', { accent: true }),
    s('path', { d: sparkle(62, 36, 10) + sparkle(98, 24, 12) + sparkle(120, 50, 7) }, 'purple'),
    s('path', { d: dots([[70, 76], [88, 70]], 4) }, 'mint')
  ],
  conmover: [
    s('circle', { cx: 74, cy: 82, r: 50 }, 'yellow'),
    s('path', { d: 'M48 74q8-8 16 0M84 74q8-8 16 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 104q14 10 28 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: drop(52, 92, 5) + drop(98, 92, 5) }, 'sky'),
    s('path', { d: heart(124, 34, 14) }, 'red', { accent: true })
  ],
  constitucionalmente: [
    s('rect', { x: 26, y: 72, width: 72, height: 64, rx: 4 }, 'navy'),
    s('path', { d: 'M34 72v64M48 90h40M48 104h32', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M110 26v104M84 40h52M98 136h24', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M84 40l-12 26h24zM136 40l-12 26h24z' }, 'yellow', { accent: true }),
    s('path', { d: 'M72 66a12 6 0 0 0 24 0zM124 66a12 6 0 0 0 24 0z' }, 'orange')
  ],
  convencimiento: [
    s('path', { d: HEAD, transform: 'translate(-24 22) scale(0.85)' }, 'skin'),
    s('circle', { cx: 112, cy: 46, r: 30 }, 'green', { accent: true }),
    s('path', { d: 'M98 46l10 10 18-20', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: dots([[88, 82], [80, 92]], 4) }, 'green')
  ],
  costanera: [
    s('rect', { x: 14, y: 14, width: 132, height: 66 }, 'sky'),
    s('rect', { x: 14, y: 80, width: 132, height: 30 }, 'blue'),
    s('rect', { x: 14, y: 110, width: 132, height: 36 }, 'tan'),
    s('path', { d: 'M14 110h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 136V64M110 136V64M40 64h8M110 64h8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[48, 66], [118, 66]], 6) }, 'yellow', { accent: true }),
    s('path', { d: 'M24 94q6-4 12 0t12 0M90 96q6-4 12 0t12 0', ...SW(2) }, 'white', { stroke: true })
  ],
  'coñazo': [
    s('circle', { cx: 66, cy: 86, r: 46 }, 'yellow', { accent: true }),
    s('path', { d: 'M40 78h16M76 78h16', ...SW(4) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 66, cy: 108, rx: 12, ry: 14 }, 'dark'),
    s('circle', { cx: 124, cy: 40, r: 22 }, 'white'),
    s('path', { d: ring(124, 40, 22) + 'M124 40V26M124 40h10', ...SW(4) }, 'gray', { stroke: true })
  ],
  cuco: [
    s('path', { d: 'M24 62L80 18l56 44z' }, 'brown'),
    s('rect', { x: 36, y: 60, width: 88, height: 74, rx: 4 }, 'tan'),
    s('circle', { cx: 80, cy: 102, r: 20 }, 'cream'),
    s('path', { d: 'M80 102V88M80 102h10M80 134v12M66 134v6M94 134v8', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 68, y: 36, width: 24, height: 20 }, 'dark'),
    s('path', { d: 'M76 48q0-12 14-10l16 4-12 4q-2 10-18 8z' }, 'blue', { accent: true }),
    s('path', { d: 'M106 42l8 2-8 4z' }, 'orange')
  ],
  debacle: [
    s('path', { d: rects([[30, 118, 30, 18], [64, 118, 30, 18]]) }, 'orange'),
    s('rect', { x: 92, y: 90, width: 30, height: 18, transform: 'rotate(30 107 99)' }, 'blue', { accent: true }),
    s('rect', { x: 74, y: 70, width: 30, height: 18, transform: 'rotate(-20 89 79)' }, 'red'),
    s('rect', { x: 104, y: 40, width: 30, height: 18, transform: 'rotate(50 119 49)' }, 'green'),
    s('path', { d: 'M100 120l8 8M116 116l12 4M20 110l6 6', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[48, 138, 36, 4]]) }, 'gray'),
    s('path', { d: 'M60 40q10-10 20 0', ...DASH(3, '3 5') }, 'gray', { stroke: true })
  ],
  decadente: [
    s('rect', { x: 50, y: 30, width: 44, height: 12 }, 'cream'),
    s('path', { d: 'M56 42h32v86H56z' }, 'cream', { accent: true }),
    s('path', { d: 'M56 42h32v86H56zM50 30h44v12H50z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M88 60l-10 14 6 10-12 14M60 44l8 12', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 70q-16 20 4 40', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: rects([[40, 128, 64, 10], [108, 128, 14, 8], [116, 120, 10, 8]]) }, 'gray'),
    s('path', { d: 'M100 36l12 8', ...SW(4) }, 'tan', { stroke: true })
  ],
  derrumbar: [
    s('path', { d: 'M40 136V60h34l6 20 10-20h24v76z' }, 'tan'),
    s('path', { d: grid(50, 70, 3, 3, 10, 12, 20, 22) }, 'dark'),
    s('path', { d: 'M66 60l10 24-6 14 10 14-4 24', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: rects([[86, 30, 14, 10], [102, 44, 10, 8], [70, 36, 10, 8]]) }, 'brown', { accent: true }),
    s('path', { d: ells([[30, 132, 18, 10], [130, 130, 20, 12], [80, 140, 50, 6]]) }, 'gray')
  ],
  desencadenar: [
    s('path', { d: 'M14 80h16a10 10 0 0 1 0 20H14M40 74h20a10 10 0 0 1 0 20H40a10 10 0 0 1 0-20z', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 70q4 6 2 12M86 72l2-10', ...SW(7) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: 'M100 74h20a10 10 0 0 1 0 20h-20a10 10 0 0 1 0-20zM146 80h-16a10 10 0 0 0 0 20h16', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 40v14M60 48l8 10M100 48l-8 10M80 120v-14M62 112l8-8M98 112l-8-8', ...SW(4) }, 'orange', { stroke: true })
  ],
  deslumbrante: [
    s('path', { d: burst(108, 52, 40, 24, 14) }, 'yellow', { accent: true }),
    s('circle', { cx: 108, cy: 52, r: 18 }, 'white'),
    ...person(46, 136, 'blue', { h: 46, w: 30, r: 14 }),
    s('path', { d: 'M56 98l2-34', ...SW(8) }, 'skin', { stroke: true }),
    s('rect', { x: 32, y: 58, width: 30, height: 8, rx: 4 }, 'skin')
  ],
  desnivel: [
    s('path', { d: 'M14 70h60v76H14z' }, 'green', { accent: true }),
    s('path', { d: 'M74 116h72v30H74z' }, 'green'),
    s('path', { d: 'M14 70h60v46h72', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M110 70v40M102 78l8-8 8 8M102 102l8 8 8-8M80 70h38', ...SW(4) }, 'orange', { stroke: true }),
    ...person(40, 70, 'red', { h: 26, w: 18, r: 9 })
  ],
  deteriorar: [
    s('circle', { cx: 32, cy: 92, r: 18 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 92, r: 18 }, 'orange'),
    s('path', { d: 'M110 98q0-24 18-24t18 24q-2 14-18 14t-18-14z' }, 'brown'),
    s('path', { d: 'M32 74v-8M80 74v-8M128 74v-8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[74, 98], [86, 86], [120, 92], [134, 100], [126, 84]], 3) }, 'dark'),
    s('path', { d: 'M24 130h112M128 124l8 6-8 6', ...SW(4) }, 'gray', { stroke: true })
  ],
  disciplinario: [
    ...person(44, 136, 'navy', { h: 56, w: 32, r: 14 }),
    s('path', { d: 'M60 96l46-26', ...SW(5) }, 'brown', { stroke: true }),
    ...person(122, 136, 'orange', { h: 34, w: 24, r: 11 }),
    s('path', { d: 'M116 92q6-4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 70, y: 22, width: 22, height: 30, rx: 3, transform: 'rotate(-10 81 37)' }, 'red', { accent: true }),
    ground()
  ],
  'disfunción': [
    ...gear(66, 84, 34, 12, 'gray', { accent: true }),
    s('circle', { cx: 66, cy: 84, r: 12 }, 'white'),
    s('path', { d: 'M54 50l14 18-8 10 16 14-6 12', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: ells([[118, 46, 14, 10], [130, 30, 12, 9], [112, 22, 10, 8]]) }, 'dark')
  ],
  domo: [
    s('rect', { x: 30, y: 84, width: 100, height: 52 }, 'cream'),
    s('path', { d: 'M24 86a56 56 0 0 1 112 0z' }, 'gray', { accent: true }),
    s('path', { d: 'M74 32h12v54H74z' }, 'dark'),
    s('path', { d: 'M80 56l30-26', ...SW(8) }, 'navy', { stroke: true }),
    s('rect', { x: 68, y: 108, width: 24, height: 28 }, 'brown'),
    ground()
  ],
  donativo: [
    s('rect', { x: 34, y: 76, width: 92, height: 60, rx: 6 }, 'red'),
    s('rect', { x: 60, y: 76, width: 40, height: 8, rx: 3 }, 'dark'),
    s('path', { d: heart(80, 108, 16) }, 'white'),
    s('circle', { cx: 80, cy: 50, r: 14 }, 'yellow', { accent: true }),
    s('path', { d: 'M100 30q16-8 28 4l12 10h-36l-10 10', ...SW(12) }, 'skin', { stroke: true })
  ],
  elevador: [
    s('rect', { x: 22, y: 22, width: 92, height: 120, rx: 4 }, 'gray'),
    s('rect', { x: 30, y: 36, width: 76, height: 106 }, 'sky'),
    s('path', { d: 'M68 36v106', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 120, y: 70, width: 24, height: 44, rx: 4 }, 'dark'),
    s('path', { d: 'M132 76l-7 12h14zM132 108l-7-12h14z' }, 'yellow', { accent: true }),
    s('path', { d: 'M60 28l8-6 8 6', ...SW(3) }, 'orange', { stroke: true })
  ],
  'elástico': [
    s('path', { d: 'M38 60q42 30 84 0M38 100q42-30 84 0', ...SW(7) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M38 56v48', ...SW(14) }, 'skin', { stroke: true }),
    s('path', { d: 'M122 56v48', ...SW(14) }, 'skin', { stroke: true }),
    s('path', { d: 'M18 80h-4M146 80h-4M14 80l8-6M14 80l8 6M146 80l-8-6M146 80l-8 6', ...SW(3) }, 'gray', { stroke: true })
  ],
  entrever: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'dark'),
    s('path', { d: rects([[14, 14, 54, 132], [92, 14, 54, 132]]) }, 'brown'),
    s('path', { d: 'M68 76q12-14 24 0q-12 14-24 0z' }, 'white'),
    s('circle', { cx: 80, cy: 76, r: 6 }, 'blue', { accent: true }),
    s('path', { d: 'M28 30v100M48 30v100M112 30v100M132 30v100', ...SW(2) }, 'tan', { stroke: true })
  ],
  espeluznante: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('path', { d: 'M88 136V64a26 26 0 0 1 52 0v72l-9-8-8 8-9-8-8 8-9-8z' }, 'white', { accent: true }),
    s('path', { d: dots([[104, 66], [124, 66]], 5) + ells([[114, 88, 6, 8]]) }, 'dark'),
    s('circle', { cx: 46, cy: 98, r: 16 }, 'skin'),
    s('path', { d: 'M34 86l-6-16M42 82l-2-18M50 82l2-18M58 86l6-16', ...SW(3) }, 'yellow', { stroke: true }),
    s('rect', { x: 32, y: 114, width: 28, height: 32, rx: 8 }, 'green')
  ],
  'farándula': [
    s('rect', { x: 50, y: 110, width: 60, height: 36 }, 'red'),
    ...lady(80, 120, 'purple', { accent: true }),
    s('path', { d: burst(30, 40, 14, 6, 6) + burst(130, 50, 14, 6, 6) }, 'yellow'),
    s('rect', { x: 18, y: 54, width: 26, height: 18, rx: 3 }, 'dark'),
    s('rect', { x: 118, y: 64, width: 26, height: 18, rx: 3 }, 'dark'),
    s('path', { d: star(80, 26, 10) }, 'yellow')
  ],
  financieramente: [
    s('path', { d: ells([[44, 128, 24, 8], [44, 116, 24, 8], [44, 104, 24, 8], [44, 92, 24, 8]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M20 92a24 8 0 0 0 48 0M20 104a24 8 0 0 0 48 0M20 116a24 8 0 0 0 48 0', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: rects([[86, 100, 14, 36], [106, 80, 14, 56], [126, 56, 14, 80]]) }, 'blue'),
    s('path', { d: 'M86 72l20-14 14 6 18-30M128 32h10v10', ...SW(4) }, 'green', { stroke: true })
  ],
  'floración': [
    s('path', { d: 'M76 136V88l-20-20M84 136V96l22-24', ...SW(9) }, 'brown', { stroke: true }),
    s('path', { d: ells([[80, 58, 56, 36]]) }, 'pink', { accent: true }),
    s('path', { d: dots([[46, 50], [66, 36], [96, 40], [114, 60], [76, 64], [56, 74], [102, 80]], 5) }, 'white'),
    s('path', { d: dots([[28, 120], [124, 118], [136, 104]], 4) }, 'pink'),
    ground()
  ],
  'fluctuación': [
    s('path', { d: 'M18 80h124', ...DASH(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 80q12-50 24 0t24 0t24 0t24 0t24 0', ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M30 24v20M22 34l8-10 8 10M126 136v-20M118 126l8 10 8-10', ...SW(4) }, 'orange', { stroke: true }),
  ],
  foca: [
    s('path', { d: 'M14 128q40-14 132 0v18H14z' }, 'white'),
    s('path', { d: 'M14 128q40-14 132 0', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M30 120q20-6 40-24q10-40 34-40q20 0 20 18q0 14-16 18q-6 20-6 30q20 6 18 18H30z' }, 'gray', { accent: true }),
    s('path', { d: 'M26 124l-12-12v20z' }, 'gray'),
    s('path', { d: dots([[112, 66]], 3) + dots([[126, 76]], 4) }, 'dark'),
    s('circle', { cx: 120, cy: 28, r: 14 }, 'red')
  ],
  fundacional: [
    s('path', { d: rects([[18, 112, 40, 24], [62, 112, 40, 24], [106, 112, 40, 24], [40, 88, 40, 24], [84, 88, 40, 24]]) }, 'gray'),
    s('path', { d: rects([[18, 112, 40, 24], [62, 112, 40, 24], [106, 112, 40, 24], [40, 88, 40, 24], [84, 88, 40, 24]]), ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 62, y: 112, width: 40, height: 24 }, 'orange', { accent: true }),
    s('path', { d: 'M100 66l26-26 14 14-26 26z' }, 'gray'),
    s('path', { d: 'M126 40l12-12', ...SW(6) }, 'brown', { stroke: true })
  ],
  'galón': [
    s('path', { d: 'M38 46q0-10 10-10h40l28 20v74q0 8-8 8H46q-8 0-8-8z' }, 'white'),
    s('path', { d: 'M38 46q0-10 10-10h40l28 20v74q0 8-8 8H46q-8 0-8-8z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 86h74v44q0 6-6 6H46q-6 0-6-6z' }, 'blue', { accent: true }),
    s('path', { d: 'M88 36v-16h-16v16M56 36q0-16 14 0', ...SW(5) }, 'red', { stroke: true }),
    s('rect', { x: 66, y: 12, width: 28, height: 10, rx: 3 }, 'red')
  ],
  'glóbulo': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'pink'),
    s('path', { d: ells([[54, 56, 28, 22], [108, 92, 26, 20], [52, 116, 22, 16]]) }, 'red', { accent: true }),
    s('path', { d: ells([[54, 56, 12, 8], [108, 92, 11, 7], [52, 116, 9, 6]]) }, 'pink'),
    s('circle', { cx: 116, cy: 40, r: 14 }, 'white')
  ],
  granadero: [
    s('path', { d: 'M62 52q-4-40 18-40t18 40z' }, 'black', { accent: true }),
    s('circle', { cx: 80, cy: 58, r: 12 }, 'skin'),
    s('rect', { x: 64, y: 72, width: 32, height: 46, rx: 8 }, 'red'),
    s('path', { d: 'M70 118v18M90 118v18', ...SW(8) }, 'navy', { stroke: true }),
    s('path', { d: 'M64 96h32M80 72v46', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M106 136V44', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M106 44l-4-12h8z' }, 'gray')
  ],
  guarida: [
    s('path', { d: 'M14 136q0-104 66-104t66 104z' }, 'gray'),
    s('path', { d: 'M40 136q0-64 40-64t40 64z' }, 'black'),
    s('path', { d: ells([[68, 104, 6, 4], [92, 104, 6, 4]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M28 70q8-6 16 0M110 60q8-6 14 2', ...SW(3) }, 'dark', { stroke: true }),
    ground(138)
  ],
  herpes: [
    s('path', { d: 'M24 82q28-26 56-12q28-14 56 12q-28 34-56 34t-56-34z' }, 'pink'),
    s('path', { d: 'M24 82q56 10 112 0', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: dots([[110, 100], [120, 94], [116, 106]], 5) }, 'cream', { accent: true }),
    s('path', { d: 'M105 100a5 5 0 1 0 10 0a5 5 0 1 0-10 0M115 94a5 5 0 1 0 10 0a5 5 0 1 0-10 0', ...SW(2) }, 'red', { stroke: true })
  ],
  'hidráulico': [
    s('rect', { x: 30, y: 96, width: 100, height: 40, rx: 6 }, 'blue', { accent: true }),
    s('rect', { x: 66, y: 58, width: 28, height: 40 }, 'gray'),
    ...car(50, 34, 'red'),
    s('path', { d: 'M40 116q10-6 20 0t20 0t20 0t20 0', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M110 80V60M104 66l6-6 6 6', ...SW(4) }, 'orange', { stroke: true })
  ],
  hinchado: [
    s('path', { d: 'M14 70h70q8 0 8 8v14q0 8-8 8H14z' }, 'skin'),
    s('path', { d: 'M84 64q34-10 46 8q8 14-6 24q-20 12-40 8z' }, 'skin', { accent: true }),
    s('path', { d: 'M84 64q34-10 46 8q8 14-6 24q-20 12-40 8z', ...SW(3) }, 'pink', { stroke: true }),
    s('circle', { cx: 112, cy: 80, r: 6 }, 'red'),
    s('path', { d: 'M100 46l4-10M116 44l0-12M130 50l8-8', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M40 40l6-8M56 40l-6-8M48 36v18', ...SW(3) }, 'dark', { stroke: true })
  ],
  hormiguero: [
    s('path', { d: 'M18 136q24-70 62-80q38 10 62 80z' }, 'brown', { accent: true }),
    s('path', { d: 'M72 60a8 6 0 0 1 16 0z' }, 'dark'),
    s('path', { d: ells([[40, 110, 4, 3], [46, 110, 5, 3.5], [54, 110, 4, 3], [92, 90, 4, 3], [98, 90, 5, 3.5], [106, 90, 4, 3], [118, 126, 4, 3], [124, 126, 5, 3.5], [132, 126, 4, 3]]) }, 'black'),
    s('path', { d: 'M60 122q10-14 22-8M70 92q8-8 14 0', ...SW(3) }, 'tan', { stroke: true }),
    ground()
  ],
  hormonal: [
    s('path', { d: 'M48 50l18-10 18 10v20l-18 10-18-10zM84 70l18-10 18 10v20l-18 10-18-10z' }, 'purple', { accent: true }),
    s('path', { d: 'M66 80v24M120 90l14 10M48 50l-14-8', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[66, 108], [136, 102], [30, 40]], 6) }, 'pink'),
    s('path', { d: drop(50, 122, 10) }, 'sky'),
    s('path', { d: 'M108 112v24M100 128l8 8 8-8M128 136v-24M120 120l8-8 8 8', ...SW(4) }, 'orange', { stroke: true })
  ]
};
