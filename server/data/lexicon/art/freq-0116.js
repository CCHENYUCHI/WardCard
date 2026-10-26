// Illustration specs for words still undrawn in batches 0115–0116 (see server/scripts/lexicon/art.js)
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
// Rotate a list of shapes by deg around (cx, cy)
const rot = (shapes, deg, cx, cy) => shapes.map(sh => ({ ...sh, attrs: { ...sh.attrs, transform: `rotate(${deg} ${cx} ${cy})${sh.attrs.transform ? ' ' + sh.attrs.transform : ''}` } }));
// Points for a swarm of bees
const BEES = [[60, 40], [88, 30], [116, 46], [70, 66], [100, 70], [130, 80], [58, 96], [88, 104], [118, 114], [76, 132], [44, 124]];
module.exports = {
  decenio: [
    s('rect', { x: 26, y: 30, width: 108, height: 104, rx: 10 }, 'white'),
    s('rect', { x: 26, y: 30, width: 108, height: 24, rx: 8 }, 'red', { accent: true }),
    s('path', { d: 'M48 22v16M112 22v16', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[44, 74], [62, 74], [80, 74], [98, 74], [116, 74], [44, 100], [62, 100], [80, 100], [98, 100]], 7) }, 'blue'),
    s('circle', { cx: 116, cy: 100, r: 9 }, 'orange'),
    s('path', { d: 'M44 120h72', ...SW(4) }, 'gray', { stroke: true }),
    outline({ x: 26, y: 30, width: 108, height: 104, rx: 10 })
  ],
  desavenencia: [
    ...person(40, 136, 'blue'),
    ...person(120, 136, 'green'),
    s('path', { d: 'M86 22l-16 40h14l-12 40 26-50H84l14-30z' }, 'red', { accent: true }),
    s('path', { d: 'M28 60q-6 4-4 10M132 60q6 4 4 10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M34 62l8 3M126 62l-8 3', ...SW(3) }, 'dark', { stroke: true })
  ],
  diezmo: [
    s('path', { d: dots([[28, 40], [52, 40], [76, 40], [28, 64], [52, 64], [76, 64], [28, 88], [52, 88], [76, 88]], 10) }, 'yellow'),
    s('path', { d: dots([[28, 40], [52, 40], [76, 40], [28, 64], [52, 64], [76, 64], [28, 88], [52, 88], [76, 88]], 10), ...SW(2) }, 'orange', { stroke: true }),
    s('circle', { cx: 116, cy: 40, r: 12 }, 'orange', { accent: true }),
    arrow('M116 60v34', 'red'),
    s('path', { d: 'M94 104h44v32H94z' }, 'brown'),
    s('path', { d: 'M108 112h16', ...SW(5) }, 'dark', { stroke: true })
  ],
  dizque: [
    ...person(36, 136, 'blue'),
    s('path', { d: bubble(56, 22, 52, 38) }, 'cream'),
    s('path', { d: dots([[70, 40], [82, 40], [94, 40]], 4) }, 'gray'),
    s('path', { d: bubble(92, 66, 52, 38) }, 'sky', { accent: true }),
    s('path', { d: dots([[106, 84], [118, 84], [130, 84]], 4) }, 'navy'),
    ...person(118, 136, 'orange', { h: 18, w: 26, r: 9 })
  ],
  ecoturismo: [
    ...tree(118),
    ...person(54, 136, 'orange'),
    s('rect', { x: 26, y: 96, width: 18, height: 30, rx: 6 }, 'brown'),
    s('path', { d: 'M74 136l6-80', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(36, 50, -45, 30, 9) }, 'green', { accent: true }),
    ground()
  ],
  emigrado: [
    s('path', { d: 'M18 136V96l22-18 22 18v40z' }, 'tan'),
    s('rect', { x: 32, y: 110, width: 16, height: 26 }, 'brown'),
    ...person(98, 136, 'blue'),
    s('rect', { x: 116, y: 108, width: 26, height: 22, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M124 108v-6h10v6', ...SW(3) }, 'dark', { stroke: true }),
    arrow('M66 40h64m-12-10 12 10-12 10'),
    ground()
  ],
  emplazar: [
    s('path', { d: 'M16 118l40-30h88l-40 30z' }, 'mint'),
    s('path', { d: 'M46 96h88M36 104h88M56 88l-30 30M86 88l-30 30M116 88l-30 30', ...SW(2) }, 'green', { stroke: true }),
    s('path', { d: 'M80 32a18 18 0 0 1 18 18q0 16-18 42q-18-26-18-42a18 18 0 0 1 18-18z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 50, r: 7 }, 'white'),
    s('ellipse', { cx: 80, cy: 98, rx: 12, ry: 4 }, 'dark')
  ],
  enredar: [
    s('circle', { cx: 80, cy: 80, r: 46 }, 'pink'),
    s('path', { d: 'M44 60q40 40 76-6M40 90q50-40 84 10M60 40q10 60 44 80M100 38q-40 40-36 84M50 110q40-10 66-74', ...SW(4) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M120 104q20 10 14 30q-8 8-20 2', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M38 66q-20-10-14-30', ...SW(4) }, 'red', { stroke: true })
  ],
  'equipación': [
    s('path', { d: 'M56 24l-28 16 10 22 10-6v42h64V56l10 6 10-22-28-16q-12 10-24 0z' }, 'red', { accent: true }),
    s('path', { d: 'M56 24q12 14 24 0', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M48 104h64l4 22H86l-6-10-6 10H44z' }, 'navy'),
    s('rect', { x: 50, y: 124, width: 18, height: 14, rx: 3 }, 'white'),
    s('rect', { x: 92, y: 124, width: 18, height: 14, rx: 3 }, 'white'),
    s('path', { d: 'M50 124h18v14H50zM92 124h18v14H92z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 60h64M48 72h64', ...SW(4) }, 'white', { stroke: true })
  ],
  'equitación': [
    ...horse('brown', 'dark'),
    s('circle', { cx: 76, cy: 30, r: 10 }, 'skin'),
    s('rect', { x: 66, y: 40, width: 20, height: 28, rx: 6 }, 'red', { accent: true }),
    s('path', { d: 'M66 28a10 10 0 0 1 20 0z' }, 'black'),
    s('path', { d: 'M80 54l30-8', ...SW(3) }, 'dark', { stroke: true })
  ],
  erizo: [
    s('path', { d: 'M26 112q-2-58 54-60q52 2 56 46l-8 14z' }, 'brown'),
    s('path', { d: 'M30 96l-8-14 14 2-4-18 14 8 0-18 12 12 6-16 8 14 10-14 4 16 12-10-2 16 14-4-6 14 16 2-10 12', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M108 82q20 6 30 24q-8 10-30 12z' }, 'tan', { accent: true }),
    s('circle', { cx: 138, cy: 106, r: 4 }, 'black'),
    s('circle', { cx: 120, cy: 96, r: 3 }, 'black'),
    s('path', { d: 'M44 112v14M96 112v14', ...SW(6) }, 'tan', { stroke: true }),
    ground(128)
  ],
  'escolarización': [
    s('path', { d: 'M70 136V64l36-26 36 26v72z' }, 'red'),
    s('path', { d: 'M106 38V18', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M106 18h16v10h-16z' }, 'yellow', { accent: true }),
    s('rect', { x: 96, y: 108, width: 20, height: 28 }, 'brown'),
    s('path', { d: grid(80, 72, 2, 1, 14, 14, 38, 0) }, 'sky'),
    ...person(38, 136, 'blue', { h: 34, w: 24, r: 10 }),
    s('rect', { x: 18, y: 104, width: 12, height: 22, rx: 4 }, 'orange'),
    ground()
  ],
  esperanzador: [
    backdrop('sky'),
    s('circle', { cx: 80, cy: 100, r: 34 }, 'yellow', { accent: true }),
    s('path', { d: halfRays(80, 100, 42, 56, 7), ...SW(5) }, 'orange', { stroke: true }),
    s('rect', { x: 14, y: 100, width: 132, height: 46, rx: 0 }, 'green'),
    s('path', { d: 'M80 124v-18', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: leaflet(80, 108, -150, 18, 6) + leaflet(80, 108, -30, 18, 6) }, 'mint')
  ],
  estabilizador: [
    s('rect', { x: 72, y: 96, width: 16, height: 44, rx: 6 }, 'dark'),
    s('path', { d: 'M80 96V80h30V58', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 82, r: 7 }, 'gray'),
    s('rect', { x: 40, y: 34, width: 80, height: 40, rx: 6 }, 'black'),
    s('rect', { x: 46, y: 39, width: 68, height: 30, rx: 3 }, 'sky', { accent: true }),
    s('path', { d: 'M28 54h-10M142 54h-10M28 44l-8-4M28 64l-8 4M132 44l8-4M132 64l8 4', ...SW(3) }, 'orange', { stroke: true })
  ],
  'etiología': [
    s('path', { d: burst(66, 66, 26, 18, 12) }, 'green'),
    s('circle', { cx: 66, cy: 66, r: 16 }, 'mint'),
    s('path', { d: dots([[60, 62], [72, 70], [64, 74]], 3) }, 'green'),
    s('path', { d: ring(66, 66, 40), ...SW(8) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M96 96l34 34', ...SW(14) }, 'brown', { stroke: true })
  ],
  falangista: [
    ...person(70, 136, 'navy', { accent: true }),
    s('path', { d: 'M110 140V22', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M110 12l7 14h-14z' }, 'gray'),
    s('path', { d: 'M84 104h26', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M58 74q12-14 24 0', ...SW(5) }, 'dark', { stroke: true }),
    ground()
  ],
  fariseo: [
    s('circle', { cx: 92, cy: 70, r: 40 }, 'skin'),
    s('path', { d: 'M100 98q12-8 24 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M38 44q30-12 52 0q4 40-26 56q-30-16-26-56z' }, 'white'),
    s('path', { d: 'M38 44q30-12 52 0q4 40-26 56q-30-16-26-56z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 76q16 14 32 0', ...SW(4) }, 'red', { stroke: true, accent: true }),
    s('path', { d: dots([[54, 60], [74, 60], [112, 62]], 4) }, 'dark'),
    s('path', { d: 'M64 100v30', ...SW(5) }, 'brown', { stroke: true })
  ],
  'furgón': [
    s('path', { d: 'M18 50h86v66H18z' }, 'white'),
    s('path', { d: 'M18 50h86v66H18z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 66h20l18 24v26h-38z' }, 'blue', { accent: true }),
    s('path', { d: 'M110 72h12l12 18h-24z' }, 'sky'),
    s('path', { d: 'M18 98h86', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: dots([[42, 118], [118, 118]], 12) }, 'dark'),
    s('path', { d: dots([[42, 118], [118, 118]], 5) }, 'gray')
  ],
  gomera: [
    s('path', { d: 'M80 140V96L52 52M80 96l28-44', ...SW(12) }, 'brown', { stroke: true }),
    s('path', { d: 'M52 52L76 30M108 52L84 30', ...SW(3) }, 'red', { stroke: true }),
    s('rect', { x: 70, y: 22, width: 20, height: 12, rx: 4 }, 'tan'),
    s('circle', { cx: 80, cy: 22, r: 7 }, 'gray', { accent: true }),
    s('path', { d: 'M80 10V2', ...SW(3) }, 'gray', { stroke: true })
  ],
  'gratificación': [
    s('rect', { x: 46, y: 40, width: 70, height: 36, rx: 4, transform: 'rotate(-10 80 60)' }, 'green'),
    s('circle', { cx: 80, cy: 58, r: 10 }, 'mint'),
    s('rect', { x: 30, y: 64, width: 100, height: 64, rx: 6 }, 'tan', { accent: true }),
    s('path', { d: 'M30 70l50 34 50-34', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: sparkle(128, 34, 12) + sparkle(30, 40, 8) }, 'yellow')
  ],
  gravamen: [
    s('path', { d: 'M48 70h64l12 36H36z' }, 'dark', { accent: true }),
    s('path', { d: 'M66 70v-8a14 14 0 0 1 28 0v8', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: ells([[80, 132, 36, 7], [80, 122, 36, 7], [80, 112, 36, 7]]) }, 'yellow'),
    s('path', { d: 'M44 112v20M116 112v20', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M30 94l-10-6M130 94l10-6', ...SW(3) }, 'gray', { stroke: true })
  ],
  'heterogéneo': [
    s('circle', { cx: 50, cy: 50, r: 22 }, 'red'),
    s('path', { d: 'M110 26l26 44H84z' }, 'green'),
    s('rect', { x: 30, y: 94, width: 40, height: 40, rx: 4 }, 'blue'),
    s('path', { d: star(110, 112, 26) }, 'yellow', { accent: true }),
    s('path', { d: 'M78 84l8-8 8 8-8 8z' }, 'purple')
  ],
  hornear: [
    s('rect', { x: 20, y: 30, width: 120, height: 104, rx: 8 }, 'gray'),
    s('rect', { x: 32, y: 56, width: 96, height: 66, rx: 6 }, 'dark'),
    s('path', { d: 'M48 106q2-24 32-24t32 24z' }, 'tan', { accent: true }),
    s('path', { d: 'M64 90l6 8M80 86l0 10M96 90l-6 8', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: dots([[40, 43], [56, 43]], 5) }, 'dark'),
    s('path', { d: 'M40 116h80', ...SW(3) }, 'orange', { stroke: true })
  ],
  huasteco: [
    backdrop('sky'),
    s('path', { d: 'M14 70q30-30 52-10v86H14zM146 60q-30-24-50 4v82h50z' }, 'green'),
    s('path', { d: 'M66 62h30v62H66z' }, 'mint', { accent: true }),
    s('path', { d: 'M72 66v54M82 64v58M90 66v54', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M14 120q66-8 132 0v26H14z' }, 'blue'),
    s('path', { d: ells([[80, 122, 22, 5]]) }, 'white')
  ],
  ibuprofeno: [
    s('rect', { x: 22, y: 28, width: 76, height: 104, rx: 10 }, 'gray'),
    s('path', { d: ells([[44, 50, 11, 8], [76, 50, 11, 8], [44, 80, 11, 8], [76, 80, 11, 8], [44, 110, 11, 8]]) }, 'orange'),
    s('ellipse', { cx: 76, cy: 110, rx: 11, ry: 8 }, 'white'),
    s('rect', { x: 92, y: 88, width: 50, height: 22, rx: 11, transform: 'rotate(-35 117 99)' }, 'orange', { accent: true }),
    s('path', { d: 'M117 87v24', transform: 'rotate(-35 117 99)', ...SW(3) }, 'brown', { stroke: true })
  ],
  imputar: [
    ...person(118, 136, 'gray'),
    s('path', { d: 'M106 72l6 8M130 72l-6 8', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 20, y: 66, width: 34, height: 26, rx: 8 }, 'skin'),
    s('path', { d: 'M50 72h40', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M14 70h10v18H14z' }, 'blue'),
    s('path', { d: 'M96 66l6 6M98 80l8-2', ...SW(3) }, 'red', { stroke: true, accent: true })
  ],
  inequidad: [
    s('path', { d: 'M80 34v96M56 136h48', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 72L130 40', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M30 72l-14 26h28zM130 40l-14 26h28z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 98a16 8 0 0 0 32 0zM114 66a16 8 0 0 0 32 0z' }, 'gray'),
    s('path', { d: ells([[22, 90, 7, 7], [38, 90, 7, 7], [30, 80, 7, 7]]) }, 'yellow', { accent: true }),
    s('circle', { cx: 130, cy: 60, r: 5 }, 'yellow'),
    s('circle', { cx: 80, cy: 34, r: 6 }, 'dark')
  ],
  inexperiencia: [
    ...person(80, 136, 'green', { accent: true }),
    s('path', { d: 'M80 66V50', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 52, -150, 22, 8) + leaflet(80, 52, -30, 22, 8) }, 'green'),
    s('path', { d: drop(102, 74, 5) }, 'sky'),
    s('path', { d: spiral(70, 78) + spiral(86, 78) , ...SW(2) }, 'dark', { stroke: true }),
    ground()
  ],
  ingrato: [
    ...person(110, 136, 'purple'),
    s('path', { d: 'M100 78q10 6 20 0', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 34, y: 76, width: 36, height: 32, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M52 76v32M34 90h36', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M52 76q-12-14-14 0M52 76q12-14 14 0', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M20 116h40', ...SW(10) }, 'skin', { stroke: true }),
    arrow('M126 52l14-10m-12 0h12v10', 'gray', 4)
  ],
  inmadurez: [
    s('path', { d: 'M80 26v14', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 86, r: 46 }, 'green', { accent: true }),
    s('path', { d: leaflet(80, 40, -160, 28, 9) + leaflet(80, 40, -20, 28, 9) }, 'dark'),
    s('path', { d: 'M56 66q6-10 16-12', ...SW(5) }, 'mint', { stroke: true }),
    s('circle', { cx: 120, cy: 128, r: 12 }, 'red'),
    s('circle', { cx: 40, cy: 130, r: 8 }, 'green')
  ],
  instituir: [
    s('path', { d: 'M24 54l56-30 56 30z' }, 'gray'),
    s('rect', { x: 24, y: 56, width: 112, height: 10 }, 'gray'),
    s('path', { d: 'M38 72v46M62 72v46M98 72v46M122 72v46', ...SW(10) }, 'white', { stroke: true }),
    s('path', { d: 'M38 72v46M62 72v46M98 72v46M122 72v46', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 18, y: 120, width: 124, height: 14 }, 'gray'),
    s('rect', { x: 70, y: 84, width: 20, height: 34, rx: 2 }, 'blue', { accent: true }),
    s('path', { d: sparkle(80, 40, 8) }, 'yellow')
  ],
  insufrible: [
    s('path', { d: burst(80, 40, 30, 18, 12) }, 'red', { accent: true }),
    ...face(80, 96, 28, 'skin', 'frown'),
    s('path', { d: 'M46 92q-10-10-4-22M114 92q10-10 4-22', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M58 140v-12q22-10 44 0v12z' }, 'blue')
  ],
  intimar: [
    ...person(60, 136, 'blue'),
    ...person(100, 136, 'pink'),
    s('path', { d: 'M74 104h12', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 36, 16) }, 'red', { accent: true })
  ],
  inusualmente: [
    s('path', { d: rects([[20, 30, 26, 26], [52, 30, 26, 26], [84, 30, 26, 26], [116, 30, 26, 26], [20, 66, 26, 26], [84, 66, 26, 26], [116, 66, 26, 26], [20, 102, 26, 26], [52, 102, 26, 26], [84, 102, 26, 26], [116, 102, 26, 26]]) }, 'blue'),
    s('path', { d: star(65, 79, 20) }, 'orange', { accent: true })
  ],
  invaluable: [
    s('path', { d: 'M44 50h72l20 24-56 60-56-60z' }, 'sky', { accent: true }),
    s('path', { d: 'M24 74h112M44 50l16 24 20-24 20 24 16-24M60 74l20 60 20-60', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: sparkle(130, 32, 12) + sparkle(30, 34, 9) + sparkle(130, 118, 8) }, 'yellow'),
    s('path', { d: 'M56 56l-6 10', ...SW(4) }, 'white', { stroke: true })
  ],
  legionario: [
    s('path', { d: 'M48 50q32-30 64 0', ...SW(14) }, 'red', { stroke: true }),
    s('path', { d: 'M44 64q0-28 36-28t36 28v34h-14V72H58v26H44z' }, 'gray'),
    s('path', { d: 'M58 72h44v12H58z' }, 'skin'),
    s('rect', { x: 96, y: 84, width: 46, height: 56, rx: 6 }, 'red', { accent: true }),
    s('path', { d: 'M100 112h38M119 88v48', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M28 140V60', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M28 44l6 16h-12z' }, 'gray')
  ],
  linfoma: [
    s('path', { d: HEAD }, 'skin'),
    s('path', { d: dots([[66, 104], [80, 110], [94, 106]], 6) }, 'purple', { accent: true }),
    s('path', { d: 'M54 106q26 14 52-4', ...SW(2) }, 'pink', { stroke: true }),
    s('circle', { cx: 100, cy: 64, r: 5 }, 'dark'),
    s('path', { d: 'M36 54q20-34 64-30', ...SW(8) }, 'brown', { stroke: true })
  ],
  lirio: [
    s('path', { d: 'M80 140V86', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 130, -140, 40, 8) }, 'green'),
    s('path', { d: 'M80 90q-30-10-44-54q24 10 36 34zM80 90q30-10 44-54q-24 10-36 34z' }, 'pink'),
    s('path', { d: 'M80 90q-12-30 0-66q12 36 0 66z' }, 'white'),
    s('path', { d: 'M80 90q-12-30 0-66q12 36 0 66z', ...SW(2) }, 'pink', { stroke: true, accent: true }),
    s('path', { d: 'M80 80l-8-30M80 80l8-30', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: dots([[72, 48], [88, 48]], 3) }, 'brown')
  ],
  losar: [
    s('path', { d: 'M10 140l30-60h80l30 60z' }, 'tan'),
    s('path', { d: 'M20 120h120M30 100h100M67 80l-7 60M93 80l7 60', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 120l18 0 8 20h-22z' }, 'cream'),
    s('rect', { x: 60, y: 28, width: 40, height: 30, rx: 2, transform: 'rotate(-12 80 43)' }, 'orange', { accent: true }),
    arrow('M80 64v12', 'gray', 4)
  ],
  lumbrera: [
    ...person(80, 140, 'navy'),
    s('path', { d: 'M80 14a20 20 0 0 1 12 36v6H68v-6a20 20 0 0 1 12-36z' }, 'yellow', { accent: true }),
    s('rect', { x: 70, y: 58, width: 20, height: 6, rx: 2 }, 'gray'),
    s('path', { d: rays(80, 32, 28, 38, 8, 0), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: sparkle(130, 110, 10) + sparkle(32, 110, 8) }, 'yellow')
  ],
  lumen: [
    backdrop('navy'),
    s('path', { d: 'M80 24a24 24 0 0 1 14 44v8H66v-8a24 24 0 0 1 14-44z' }, 'yellow', { accent: true }),
    s('rect', { x: 68, y: 78, width: 24, height: 10, rx: 3 }, 'gray'),
    s('path', { d: 'M66 92l-30 52h88l-30-52z' }, 'cream'),
    s('path', { d: rays(80, 48, 32, 44, 10, 0), ...SW(4) }, 'yellow', { stroke: true })
  ],
  'mejillón': [
    s('ellipse', { cx: 58, cy: 82, rx: 22, ry: 50, transform: 'rotate(-28 80 128)' }, 'navy'),
    s('ellipse', { cx: 102, cy: 82, rx: 22, ry: 50, transform: 'rotate(28 80 128)' }, 'navy'),
    s('ellipse', { cx: 60, cy: 86, rx: 14, ry: 38, transform: 'rotate(-28 80 128)' }, 'orange', { accent: true }),
    s('ellipse', { cx: 100, cy: 86, rx: 14, ry: 38, transform: 'rotate(28 80 128)' }, 'cream'),
    s('ellipse', { cx: 100, cy: 92, rx: 8, ry: 26, transform: 'rotate(28 80 128)' }, 'orange'),
    s('path', { d: 'M24 138h112', ...SW(4) }, 'gray', { stroke: true })
  ],
  memorando: [
    ...paper(38, 24, 84, 112),
    s('path', { d: 'M52 50h56M52 66h56M52 82h56M52 98h36', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 62, y: 16, width: 36, height: 16, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M96 112l14 14', ...SW(4) }, 'blue', { stroke: true })
  ],
  menstrual: [
    s('path', { d: ring(80, 80, 50), ...DASH(8, '2 13') }, 'pink', { stroke: true }),
    arrow('M126 60a50 50 0 0 0-24-26m0 0 2 12m-2-12 12-2', 'gray', 4),
    s('path', { d: drop(80, 84, 20) }, 'red', { accent: true }),
    s('path', { d: 'M74 84q0 8 6 10', ...SW(3) }, 'white', { stroke: true })
  ],
  mercadillo: [
    s('rect', { x: 20, y: 66, width: 54, height: 46 }, 'tan'),
    s('rect', { x: 86, y: 66, width: 54, height: 46 }, 'tan'),
    s('path', { d: 'M16 46h62l-4 20H20zM82 46h62l-4 20H86z' }, 'red', { accent: true }),
    s('path', { d: 'M36 46v20M52 46v20M102 46v20M118 46v20', ...SW(8) }, 'white', { stroke: true }),
    s('path', { d: dots([[32, 80], [46, 80], [60, 80]], 6) }, 'orange'),
    s('path', { d: dots([[98, 80], [112, 80], [126, 80]], 6) }, 'green'),
    s('path', { d: 'M22 66v70M72 66v70M88 66v70M138 66v70', ...SW(4) }, 'brown', { stroke: true }),
    ground()
  ],
  'mitigación': [
    s('path', { d: 'M18 120V40l30 26v54z' }, 'red'),
    s('path', { d: 'M56 120V68l30 18v34z' }, 'orange'),
    s('path', { d: 'M94 120V94l30 10v16z' }, 'yellow', { accent: true }),
    arrow('M30 26q64-6 98 56m0 0-14-2m14 2 2-14', 'blue', 5),
    s('path', { d: 'M14 124h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  moldear: [
    s('ellipse', { cx: 80, cy: 126, rx: 54, ry: 10 }, 'gray'),
    s('path', { d: 'M56 122q-8-20 8-34q4-10-2-24h36q-6 14-2 24q16 14 8 34z' }, 'brown', { accent: true }),
    s('path', { d: 'M22 86q16-6 34 4l-2 14q-16-2-32-6z' }, 'skin'),
    s('path', { d: 'M138 86q-16-6-34 4l2 14q16-2 32-6z' }, 'skin'),
    s('path', { d: 'M60 64h40', ...SW(4) }, 'tan', { stroke: true })
  ],
  mordaz: [
    s('path', { d: bubble(20, 22, 120, 92) }, 'white'),
    s('path', { d: bubble(20, 22, 120, 92), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 46h84v52H38z' }, 'red', { accent: true }),
    s('path', { d: 'M38 46h84l-10 16-10-16-10 16-10-16-10 16-10-16-10 16-10-16-4 10zM38 98h84l-10-16-10 16-10-16-10 16-10-16-10 16-10-16-10 16z' }, 'white')
  ],
  morsa: [
    backdrop('sky'),
    s('path', { d: 'M18 130q8-60 60-70q40-6 56 24q8 22-4 46z' }, 'brown', { accent: true }),
    s('path', { d: 'M98 100v36M114 100v36', ...SW(7) }, 'white', { stroke: true }),
    s('path', { d: ells([[98, 96, 10, 8], [114, 96, 10, 8]]) }, 'tan'),
    s('path', { d: dots([[96, 76], [118, 76]], 4) }, 'black'),
    s('path', { d: 'M14 130h132v16H14z' }, 'white')
  ],
  musicalmente: [
    s('path', { d: 'M18 50h124M18 64h124M18 78h124M18 92h124M18 106h124', ...SW(2) }, 'gray', { stroke: true }),
    ...note(44, 92, 'blue'),
    ...note(78, 78, 'purple'),
    ...note(112, 64, 'red')
  ],
  mutis: [
    s('rect', { x: 14, y: 20, width: 132, height: 110 }, 'dark'),
    s('path', { d: 'M14 20h40q-10 50 0 110H14zM146 20h-40q10 50 0 110h40z' }, 'red', { accent: true }),
    s('path', { d: 'M14 20h132v14H14z' }, 'red'),
    ...person(100, 130, 'yellow', { h: 36, w: 24, r: 10 }),
    arrow('M78 70h40m-8-8 8 8-8 8', 'white', 4),
    s('rect', { x: 14, y: 130, width: 132, height: 12 }, 'brown')
  ],
  'notación': [
    ...paper(28, 20, 104, 120),
    s('path', { d: 'M44 44h12M64 44l6-8 6 8M86 38a6 6 0 1 0 0.1 0M104 44h18', ...SW(4) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M44 72l8 8 8-8M70 76h20M100 70v12M94 76h12', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: 'M44 106a6 6 0 1 0 0.1 0M62 100l12 12M74 100l-12 12M86 106h14M110 100l6 12 6-12', ...SW(4) }, 'red', { stroke: true })
  ],
  orbital: [
    backdrop('navy'),
    s('ellipse', { cx: 80, cy: 80, rx: 60, ry: 24, transform: 'rotate(-20 80 80)', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 26 }, 'blue'),
    s('path', { d: 'M64 70q10-6 14 4t14-4', ...SW(5) }, 'green', { stroke: true }),
    s('rect', { x: 128, y: 52, width: 12, height: 10, rx: 2 }, 'gray', { accent: true }),
    s('path', { d: 'M118 57h30', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: sparkle(30, 34, 6) + sparkle(130, 126, 6) }, 'yellow')
  ],
  organigrama: [
    s('path', { d: 'M80 48v18M36 66h88M36 66v14M80 66v14M124 66v14M36 104v12', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 58, y: 20, width: 44, height: 28, rx: 6 }, 'navy', { accent: true }),
    s('path', { d: rects([[18, 80, 36, 24], [62, 80, 36, 24], [106, 80, 36, 24]]) }, 'blue'),
    s('path', { d: rects([[20, 116, 32, 22]]) }, 'sky'),
    s('path', { d: dots([[80, 34], [36, 92], [80, 92], [124, 92], [36, 127]], 5) }, 'white')
  ],
  'ornamentación': [
    s('rect', { x: 26, y: 26, width: 108, height: 108, rx: 8 }, 'yellow', { accent: true }),
    s('rect', { x: 42, y: 42, width: 76, height: 76 }, 'cream'),
    s('path', { d: dots([[26, 26], [134, 26], [26, 134], [134, 134], [80, 26], [80, 134], [26, 80], [134, 80]], 9) }, 'orange'),
    s('path', { d: spiral(56, 66) + spiral(98, 66) + 'M60 96q20 18 40 0', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: heart(80, 80, 10) }, 'red')
  ],
  ovino: [
    s('path', { d: 'M50 110v24M66 112v24M94 112v24M110 110v24', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: ells([[80, 88, 42, 26], [48, 76, 16, 16], [70, 66, 16, 14], [94, 66, 16, 14], [112, 78, 16, 16], [60, 108, 14, 10], [100, 108, 14, 10]]) }, 'white'),
    s('path', { d: ells([[80, 88, 42, 26]]), ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 126, cy: 68, rx: 14, ry: 18 }, 'dark', { accent: true }),
    s('path', { d: dots([[130, 64]], 3) }, 'white'),
    ground()
  ],
  paliativo: [
    s('rect', { x: 18, y: 92, width: 124, height: 14, rx: 4 }, 'gray'),
    s('path', { d: 'M22 106v30M138 106v30', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 22, y: 76, width: 26, height: 16, rx: 6 }, 'white'),
    s('circle', { cx: 42, cy: 72, r: 12 }, 'skin'),
    s('path', { d: 'M52 76h86v16H52z' }, 'sky'),
    s('path', { d: 'M110 40h28l-4 28h-24z' }, 'skin'),
    s('path', { d: heart(78, 34, 16) }, 'pink', { accent: true })
  ],
  panelista: [
    s('path', { d: busts([40, 80, 120], 96, 26, 30) }, 'blue'),
    s('path', { d: dots([[40, 52], [80, 52], [120, 52]], 11) }, 'skin'),
    s('rect', { x: 14, y: 96, width: 132, height: 36, rx: 4 }, 'navy', { accent: true }),
    s('path', { d: 'M40 96l-6-16M80 96l-6-16M120 96l-6-16', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[33, 78], [73, 78], [113, 78]], 4) }, 'dark'),
    s('path', { d: 'M30 112h20M70 112h20M110 112h20', ...SW(4) }, 'white', { stroke: true })
  ],
  papelito: [
    s('path', { d: 'M14 104q20-10 42-6l4 14q-20 4-46 4z' }, 'skin'),
    s('path', { d: 'M146 66q-20-10-42-6l-4 14q20 4 46 4z' }, 'skin'),
    s('path', { d: 'M56 74l42-10 6 30-42 10z' }, 'white'),
    s('path', { d: 'M56 74l42-10 6 30-42 10zM58 84l40-10', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: heart(80, 86, 6) }, 'red', { accent: true }),
    arrow('M48 48q30-20 60-4', 'orange', 4)
  ],
  patilla: [
    s('circle', { cx: 80, cy: 82, r: 42 }, 'skin'),
    s('path', { d: 'M38 84q-4-50 42-50t42 50q-8-26-24-30H62q-16 4-24 30z' }, 'brown'),
    s('path', { d: 'M40 74v32q4 4 8 0V68zM120 74v32q-4 4-8 0V68z' }, 'brown', { accent: true }),
    s('path', { d: dots([[66, 82], [94, 82]], 4) }, 'dark'),
    s('path', { d: 'M68 102q12 8 24 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: ells([[36, 90, 5, 9], [124, 90, 5, 9]]) }, 'skin')
  ],
  pectoral: [
    s('path', { d: 'M30 30q50-12 100 0l8 110H22z' }, 'skin'),
    s('path', { d: 'M38 46q42-8 84 0q4 34-20 40q-20 4-22-8q-2 12-22 8q-24-6-20-40z' }, 'tan', { accent: true }),
    s('path', { d: 'M80 46v80M62 100h36M64 116h32', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M30 30q-10 30-8 110M130 30q10 30 8 110', ...SW(3) }, 'tan', { stroke: true })
  ],
  'perdigón': [
    s('rect', { x: 26, y: 40, width: 30, height: 70, rx: 4, transform: 'rotate(-30 41 75)' }, 'red', { accent: true }),
    s('rect', { x: 20, y: 96, width: 34, height: 18, rx: 3, transform: 'rotate(-30 41 75)' }, 'yellow'),
    s('path', { d: dots([[80, 50], [96, 44], [92, 62], [110, 58], [106, 76], [124, 70], [120, 90], [100, 94], [136, 102], [114, 112], [130, 126], [96, 120]], 6) }, 'gray'),
    s('path', { d: 'M18 138h124', ...SW(4) }, 'gray', { stroke: true })
  ],
  perrera: [
    s('path', { d: 'M24 136V72l52-36 52 36v64z' }, 'red'),
    s('path', { d: 'M14 78l62-46 62 46', ...SW(10) }, 'brown', { stroke: true }),
    s('path', { d: 'M54 136v-30a22 22 0 0 1 44 0v30z' }, 'dark'),
    s('path', { d: 'M62 136v-22q14-14 28 0v22z' }, 'tan', { accent: true }),
    s('path', { d: ells([[64, 106, 5, 10], [88, 106, 5, 10]]) }, 'brown'),
    s('path', { d: dots([[72, 114], [82, 114], [76, 124]], 2.5) }, 'black'),
    ground()
  ],
  pesebre: [
    s('path', { d: star(80, 30, 16) }, 'yellow', { accent: true }),
    s('path', { d: 'M40 136l14-40M120 136l-14-40M40 96l80 40M120 96l-80 40', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M30 80h100l-12 28H42z' }, 'brown'),
    s('path', { d: 'M34 82q8-14 16-2q8-12 16 0q8-12 16 0q8-12 16 0q8-12 16 0q8-12 12 2z' }, 'yellow'),
    s('path', { d: 'M80 48v14M68 52l6 8M92 52l-6 8', ...SW(3) }, 'orange', { stroke: true })
  ],
  'pichón': [
    s('path', { d: 'M30 96q10-34 52-36q34-2 48 24q-10 30-56 30q-30 0-44-18z' }, 'gray', { accent: true }),
    s('circle', { cx: 112, cy: 58, r: 18 }, 'gray'),
    s('path', { d: 'M128 56l14 4-14 6z' }, 'orange'),
    s('circle', { cx: 116, cy: 54, r: 3.5 }, 'black'),
    s('path', { d: 'M54 86q20-6 40 10', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M98 72q8 6 0 14', ...SW(5) }, 'purple', { stroke: true }),
    s('path', { d: 'M68 112v18M84 112v18M62 130h12M78 130h12', ...SW(3) }, 'orange', { stroke: true })
  ],
  pirotecnia: [
    backdrop('navy'),
    s('path', { d: rays(56, 56, 8, 34, 12), ...SW(4) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: rays(110, 84, 6, 26, 10, 18), ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: rays(56, 112, 4, 18, 8), ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: 'M110 140v-38', ...DASH(3, '4 6') }, 'orange', { stroke: true })
  ],
  pisotear: [
    s('path', { d: 'M42 24h40v66q30 0 44 14v14H42z' }, 'brown', { accent: true }),
    s('rect', { x: 40, y: 116, width: 88, height: 10, rx: 3 }, 'dark'),
    s('path', { d: 'M28 130l-14-6M28 120l-14-14M140 130l12-6M140 118l12-12', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M30 136l20-6 20 6 20-6 20 6 20-6 10 6', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M56 40h16', ...SW(4) }, 'tan', { stroke: true })
  ],
  'pistón': [
    s('path', { d: 'M44 20v104M116 20v104', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 50, y: 30, width: 60, height: 40, rx: 4 }, 'gray', { accent: true }),
    s('path', { d: 'M50 40h60M50 48h60', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 56l-14 64', ...SW(12) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 56, r: 7 }, 'orange'),
    s('circle', { cx: 66, cy: 122, r: 14 }, 'orange'),
    s('circle', { cx: 66, cy: 122, r: 5 }, 'dark')
  ],
  plebeyo: [
    s('path', { d: 'M100 76V44h8v8h8v-8h8v8h8v-8h8v32z' }, 'gray'),
    s('rect', { x: 100, y: 76, width: 40, height: 44 }, 'gray'),
    s('path', { d: 'M114 120v-14a6 6 0 0 1 12 0v14z' }, 'dark'),
    s('circle', { cx: 56, cy: 66, r: 12 }, 'skin'),
    s('path', { d: 'M40 80h32l6 56H34z' }, 'brown', { accent: true }),
    s('path', { d: 'M40 102h32', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M86 140V58', ...SW(4) }, 'brown', { stroke: true }),
    ground()
  ],
  postergar: [
    s('rect', { x: 18, y: 50, width: 50, height: 56, rx: 6 }, 'white'),
    outline({ x: 18, y: 50, width: 50, height: 56, rx: 6 }),
    s('rect', { x: 92, y: 50, width: 50, height: 56, rx: 6 }, 'white'),
    outline({ x: 92, y: 50, width: 50, height: 56, rx: 6 }),
    s('path', { d: 'M18 50h50v12H18zM92 50h50v12H92z' }, 'red'),
    s('rect', { x: 104, y: 74, width: 26, height: 22, rx: 3 }, 'yellow', { accent: true }),
    s('rect', { x: 30, y: 74, width: 26, height: 22, rx: 3, ...DASH(2, '4 3') }, 'gray', { stroke: true }),
    arrow('M44 40q36-30 72 0m0 0-12-2m12 2-2-12')
  ],
  potrero: [
    backdrop('green', 70, 76),
    s('path', { d: 'M14 96h132M14 112h132M26 88v36M60 88v36M100 88v36M134 88v36', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M48 74V58M58 74V58M80 74V58M90 74V58', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: ells([[68, 52, 26, 10]]) + 'M84 48l8-20 10 4-6 20z' }, 'tan', { accent: true }),
    s('ellipse', { cx: 102, cy: 30, rx: 9, ry: 5, transform: 'rotate(30 102 30)' }, 'tan'),
    s('circle', { cx: 130, cy: 30, r: 10 }, 'yellow')
  ],
  pozuelo: [
    s('path', { d: 'M28 82h104q0 46-52 46T28 82z' }, 'blue', { accent: true }),
    s('ellipse', { cx: 80, cy: 82, rx: 52, ry: 10 }, 'orange'),
    s('path', { d: 'M62 126h36v10H62z' }, 'navy'),
    s('path', { d: 'M62 64q-8-10 0-20t0-20M80 64q-8-10 0-20t0-20M98 64q-8-10 0-20t0-20', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 100q40 14 80 0', ...SW(3) }, 'sky', { stroke: true })
  ],
  prolijo: [
    s('path', { d: 'M40 14h80v128H40z' }, 'cream'),
    s('path', { d: 'M50 26h60M50 38h60M50 50h60M50 62h60M50 74h60M50 86h60M50 98h60M50 110h60M50 122h60', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 32, y: 10, width: 96, height: 10, rx: 5 }, 'brown', { accent: true }),
    s('rect', { x: 32, y: 138, width: 96, height: 10, rx: 5 }, 'brown')
  ],
  propulsor: [
    s('path', { d: 'M80 80q-50-30-40-50q20-4 40 50zM80 80q10 56-12 64q-14-14 12-64zM80 80q40-40 60-26q-4 22-60 26z' }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'gray'),
    s('path', { d: 'M92 80h40', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 110q-6 10 2 20M22 96q-10 16 0 36', ...SW(3) }, 'sky', { stroke: true })
  ],
  'prostíbulo': [
    backdrop('navy'),
    s('path', { d: 'M30 136V64l50-30 50 30v72z' }, 'purple'),
    s('rect', { x: 66, y: 96, width: 28, height: 40, rx: 2 }, 'dark'),
    s('path', { d: grid(40, 74, 2, 1, 16, 16, 64, 0) }, 'pink'),
    s('path', { d: 'M100 84h12v10', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 104, y: 94, width: 16, height: 20, rx: 6 }, 'red', { accent: true })
  ],
  pucho: [
    s('ellipse', { cx: 80, cy: 116, rx: 54, ry: 16 }, 'gray'),
    s('ellipse', { cx: 80, cy: 112, rx: 40, ry: 9 }, 'dark'),
    s('rect', { x: 64, y: 100, width: 34, height: 9, rx: 2, transform: 'rotate(-12 81 104)' }, 'white'),
    s('rect', { x: 64, y: 100, width: 14, height: 9, rx: 2, transform: 'rotate(-12 81 104)' }, 'orange', { accent: true }),
    s('path', { d: 'M100 96q-8-14 4-24t0-24t4-20', ...SW(4) }, 'gray', { stroke: true })
  ],
  realzar: [
    s('path', { d: 'M40 14l22 86h36l22-86z' }, 'cream'),
    s('rect', { x: 52, y: 100, width: 56, height: 36, rx: 2 }, 'gray'),
    s('path', { d: star(80, 72, 26) }, 'yellow', { accent: true }),
    arrow('M30 120V84m-10 10 10-10 10 10', 'orange', 5),
    arrow('M130 120V84m-10 10 10-10 10 10', 'orange', 5),
    ground(138)
  ],
  reincidencia: [
    s('rect', { x: 44, y: 40, width: 72, height: 80, rx: 4 }, 'cream'),
    ...person(80, 120, 'orange', { h: 36, w: 26, r: 10, accent: true }),
    s('path', { d: 'M56 40v80M72 40v80M88 40v80M104 40v80', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 44, y: 40, width: 72, height: 80, rx: 4, ...SW(6) }, 'dark', { stroke: true }),
    arrow('M28 100a56 56 0 1 1 22 30m0 0-14 2m14-2-2-14', 'red', 6)
  ],
  releer: [
    ...openBook(80, 78),
    s('path', { d: 'M40 92h28M40 102h28M92 92h28M92 102h28', ...SW(3) }, 'gray', { stroke: true }),
    arrow('M54 44a28 28 0 1 1 8 20m0 0-12 0m12 0 0-12', 'blue', 5),
    s('circle', { cx: 80, cy: 46, r: 5 }, 'orange', { accent: true })
  ],
  relevamiento: [
    s('rect', { x: 34, y: 24, width: 92, height: 116, rx: 6 }, 'brown'),
    s('rect', { x: 42, y: 36, width: 76, height: 98, rx: 2 }, 'white'),
    s('rect', { x: 62, y: 18, width: 36, height: 14, rx: 4 }, 'gray'),
    s('path', { d: 'M50 56l5 5 9-10M50 82l5 5 9-10M50 108l5 5 9-10', ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M74 56h36M74 82h36M74 108h36', ...SW(4) }, 'gray', { stroke: true })
  ],
  'rescisión': [
    s('path', { d: 'M24 30h52l-8 20 10 18-8 20 10 18-8 20H24z' }, 'white'),
    s('path', { d: 'M24 30h52l-8 20 10 18-8 20 10 18-8 20H24z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M88 38h48v104H96l8-20-10-18 8-20-10-18z' }, 'white'),
    s('path', { d: 'M88 38h48v104H96l8-20-10-18 8-20-10-18z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 50h24M34 66h24M34 82h20M104 60h22M106 76h20M108 116q8-8 16 0', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 112q8-10 16 0', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M80 14l4 12M70 18l6 10M92 20l-4 10', ...SW(4) }, 'red', { stroke: true, accent: true })
  ],
  'retrógrado': [
    ...person(108, 136, 'brown', { accent: true }),
    s('path', { d: 'M98 70h-4', ...SW(4) }, 'dark', { stroke: true }),
    arrow('M80 50H24m12-12-12 12 12 12', 'red', 6),
    s('path', { d: ells([[62, 126, 7, 4], [40, 132, 7, 4]]) }, 'gray'),
    s('path', { d: 'M96 104h-16', ...SW(8) }, 'skin', { stroke: true }),
    ground()
  ],
  rodillo: [
    s('path', { d: 'M20 120q60-16 120 0v12H20z' }, 'cream'),
    s('rect', { x: 36, y: 74, width: 88, height: 32, rx: 14 }, 'tan', { accent: true }),
    s('path', { d: 'M18 90h18M124 90h18', ...SW(10) }, 'brown', { stroke: true }),
    s('path', { d: 'M48 84h64', ...SW(3) }, 'cream', { stroke: true }),
    s('path', { d: dots([[40, 50], [60, 40], [100, 44]], 3) }, 'gray')
  ],
  semillero: [
    s('path', { d: 'M18 96h124l-8 40H26z' }, 'brown'),
    s('path', { d: 'M46 96v40M80 96v40M114 96v40', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 96V76M64 96V70M98 96V76M130 96V70', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(30, 78, -150, 16, 6) + leaflet(30, 78, -30, 16, 6) + leaflet(64, 72, -150, 18, 6) + leaflet(64, 72, -30, 18, 6) + leaflet(98, 78, -150, 16, 6) + leaflet(98, 78, -30, 16, 6) + leaflet(130, 72, -150, 18, 6) + leaflet(130, 72, -30, 18, 6) }, 'green', { accent: true }),
    s('path', { d: 'M18 96h124', ...SW(4) }, 'tan', { stroke: true })
  ],
  sepia: [
    backdrop('sky'),
    s('path', { d: 'M40 80q0-30 50-30h20q14 0 14 30t-14 30H90q-50 0-50-30z' }, 'brown', { accent: true }),
    s('path', { d: 'M48 64q50-16 72 0M48 96q50 16 72 0', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M42 72q-12-6-24-4M40 80H18M42 88q-12 6-24 4', ...SW(5) }, 'brown', { stroke: true }),
    s('circle', { cx: 56, cy: 74, r: 5 }, 'dark'),
    s('path', { d: ells([[128, 120, 10, 8], [112, 128, 8, 6]]) }, 'dark')
  ],
  silbido: [
    s('circle', { cx: 60, cy: 84, r: 40 }, 'skin'),
    s('path', { d: dots([[48, 72], [72, 72]], 4) }, 'dark'),
    s('circle', { cx: 70, cy: 104, r: 7 }, 'red', { accent: true }),
    s('circle', { cx: 70, cy: 104, r: 3 }, 'dark'),
    s('path', { d: 'M98 92q8 12 0 24M110 84q14 20 0 40M122 76q20 28 0 56', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M24 70q2-36 36-36t36 36q-20-24-72 0z' }, 'brown')
  ],
  subnormal: [
    s('path', { d: 'M30 136V68M62 136V60M98 136V100M130 136V64', ...SW(20, { 'stroke-linecap': 'butt' }) }, 'blue', { stroke: true }),
    s('path', { d: 'M98 136V100', ...SW(20, { 'stroke-linecap': 'butt' }) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M14 76h132', ...DASH(4, '8 6') }, 'red', { stroke: true }),
    arrow('M98 52v34m-8-8 8 8 8-8', 'dark', 4),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  sucumbir: [
    ...lean(44, 134, 62, 'gray', { accent: true }),
    s('path', { d: 'M126 140V60', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M126 60h-30q-6 12 0 24h30z' }, 'white'),
    s('path', { d: 'M126 60h-30q-6 12 0 24h30z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 112l18-6', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M60 66l8 8M76 60l2 12', ...SW(3) }, 'dark', { stroke: true }),
    ground(136)
  ],
  susurrar: [
    ...lean(58, 136, 18, 'purple', { accent: true }),
    ...person(112, 136, 'green'),
    s('path', { d: 'M86 80l6 10', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 100, cy: 78, r: 4 }, 'tan'),
    s('path', { d: 'M92 64q4 4 0 8M98 58q8 8 0 18', ...SW(3) }, 'purple', { stroke: true }),
    s('path', { d: 'M126 70q8 4 0 12', ...SW(3) }, 'dark', { stroke: true }),
    ground()
  ],
  tacho: [
    s('path', { d: 'M38 52h84l-8 84H46z' }, 'gray', { accent: true }),
    s('rect', { x: 30, y: 38, width: 100, height: 14, rx: 4 }, 'dark'),
    s('path', { d: 'M68 38v-8h24v8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 66l2 56M80 66v56M98 66l-2 56', ...SW(4) }, 'white', { stroke: true })
  ],
  taurina: [
    s('rect', { x: 50, y: 40, width: 60, height: 96, rx: 8 }, 'blue', { accent: true }),
    s('path', { d: 'M54 40q0-10 10-10h32q10 0 10 10z' }, 'gray'),
    s('path', { d: 'M86 54l-14 30h12l-8 28 22-36H86l8-22z' }, 'yellow'),
    s('path', { d: 'M56 38q-28-2-32-24q14 12 34 14zM104 38q28-2 32-24q-14 12-34 14z' }, 'cream'),
    s('path', { d: 'M56 38q-28-2-32-24q14 12 34 14zM104 38q28-2 32-24q-14 12-34 14z', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M50 128h60', ...SW(3) }, 'navy', { stroke: true })
  ],
  'telaraña': [
    s('path', { d: rays(80, 76, 0, 62, 8, 22.5), ...SW(2.5) }, 'gray', { stroke: true }),
    s('path', { d: [16, 30, 44, 58].map(r => poly(around(80, 76, r, 8, 22.5))).join(''), ...SW(2.5) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 14v62', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 80l-10-6M100 86h-12M100 92l-10 6M120 80l10-6M120 86h12M120 92l10 6', ...SW(3) }, 'black', { stroke: true }),
    s('ellipse', { cx: 110, cy: 88, rx: 9, ry: 12 }, 'black', { accent: true }),
    s('circle', { cx: 110, cy: 74, r: 6 }, 'black')
  ],
  tomillo: [
    s('path', { d: 'M80 140V34M80 110L50 50M80 100l32-56', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: ells([[74, 44, 4, 6], [86, 50, 4, 6], [74, 62, 4, 6], [86, 70, 4, 6], [74, 80, 4, 6], [86, 90, 4, 6], [50, 56, 4, 6], [62, 66, 4, 6], [56, 80, 4, 6], [64, 94, 4, 6], [104, 52, 4, 6], [114, 60, 4, 6], [96, 66, 4, 6], [104, 80, 4, 6]]) }, 'green', { accent: true }),
    s('path', { d: dots([[80, 32], [50, 48], [112, 42]], 4) }, 'purple'),
    s('path', { d: 'M62 126h36', ...SW(8) }, 'tan', { stroke: true })
  ],
  triunvirato: [
    s('path', { d: laurel(80, 34, 16, 10, 3) }, 'green', { accent: true }),
    ...person(40, 120, 'red', { h: 40 }),
    ...person(80, 120, 'purple', { h: 40 }),
    ...person(120, 120, 'blue', { h: 40 }),
    s('rect', { x: 18, y: 120, width: 124, height: 18, rx: 3 }, 'tan')
  ],
  troncal: [
    s('path', { d: 'M20 80h120', ...SW(12) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M44 80V40M44 80v40M80 80V30M80 80v50M116 80V44M116 80v36', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[44, 36], [44, 124], [80, 26], [80, 134], [116, 40], [116, 120]], 9) }, 'blue'),
    s('path', { d: dots([[20, 80], [140, 80]], 10) }, 'navy')
  ],
  'trágicamente': [
    s('path', { d: 'M34 30q46-16 92 0q6 56-46 92q-52-36-46-92z' }, 'purple', { accent: true }),
    s('path', { d: 'M48 62q12-8 22 4M90 66q10-12 22-4', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 98q22-20 44 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: drop(60, 86, 5) + drop(104, 92, 4) }, 'sky'),
    s('path', { d: 'M80 122v20', ...SW(4) }, 'gray', { stroke: true })
  ],
  unipersonal: [
    backdrop('dark'),
    s('path', { d: 'M66 14h28l34 116H32z' }, 'cream'),
    ...person(80, 124, 'red', { accent: true }),
    s('path', { d: 'M94 90l18-18', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 14, y: 124, width: 132, height: 22 }, 'brown')
  ],
  vertiginoso: [
    backdrop('sky'),
    s('path', { d: 'M14 120q20-90 40-90t30 100q20 10 62-60', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M30 146V96M54 146V40M84 146v-18M120 146V86', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 62, y: 76, width: 22, height: 14, rx: 4, transform: 'rotate(72 73 83)' }, 'yellow', { accent: true }),
    s('path', { d: 'M44 46l-8 14M36 40l-12 10', ...SW(3) }, 'navy', { stroke: true })
  ],
  vislumbrar: [
    backdrop('gray'),
    s('path', { d: 'M18 96q40-40 80 0q-40 40-80 0z' }, 'white'),
    s('circle', { cx: 58, cy: 96, r: 13 }, 'brown'),
    s('circle', { cx: 58, cy: 96, r: 6 }, 'black'),
    s('path', { d: 'M18 96q40-46 80 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(122, 44, 14) }, 'yellow', { accent: true }),
    s('path', { d: 'M100 70q20-6 40 0M96 120q24 6 44 0', ...SW(5) }, 'white', { stroke: true })
  ],
  'vorágine': [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'blue'),
    s('path', { d: 'M80 80a6 6 0 0 1 12 0a14 14 0 0 1-28 0a22 22 0 0 1 44 0a30 30 0 0 1-60 0a38 38 0 0 1 76 0a46 46 0 0 1-92 0', ...SW(6) }, 'sky', { stroke: true, accent: true }),
    s('circle', { cx: 82, cy: 80, r: 4 }, 'navy')
  ],
  'xenófobo': [
    s('path', { d: ring(62, 80, 46), ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: dots([[46, 66], [76, 64], [50, 96], [80, 96], [62, 80]], 9) }, 'blue'),
    s('circle', { cx: 132, cy: 80, r: 11 }, 'orange'),
    s('path', { d: 'M108 54v52', ...SW(8) }, 'red', { stroke: true, accent: true })
  ],
  yunque: [
    s('path', { d: 'M20 52h100q20 0 26 10q-26 2-46 10q-10 6-10 18h-20q0-12-10-18q-20-10-40-6z' }, 'dark', { accent: true }),
    s('path', { d: 'M62 90h36l10 30H52z' }, 'dark'),
    s('rect', { x: 44, y: 120, width: 72, height: 14, rx: 2 }, 'gray'),
    s('path', { d: 'M86 24l30-12', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 62, y: 18, width: 26, height: 30, rx: 3, transform: 'rotate(-22 75 33)' }, 'gray'),
    s('path', { d: 'M40 40l-8-12M52 36l-2-14M30 48l-14-6', ...SW(3) }, 'orange', { stroke: true })
  ],
};
