// Illustration specs for words still undrawn in batches 0105–0106 (see server/scripts/lexicon/art.js)
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
  penicilina: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'sky'),
    s('path', { d: ring(80, 80, 62), ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 30 }, 'white'),
    s('path', { d: ells([[80, 80, 16, 14], [70, 72, 8, 7], [90, 88, 8, 7]]) }, 'green', { accent: true }),
    s('path', { d: dots([[36, 56], [44, 112], [124, 60], [116, 116], [80, 30], [80, 130], [30, 84], [130, 88]], 5) }, 'red')
  ],
  pomada: [
    s('path', { d: 'M30 52h66l24 14v18l-24 14H30z' }, 'blue', { accent: true }),
    s('path', { d: 'M26 48v54', ...SW(8) }, 'navy', { stroke: true }),
    s('rect', { x: 44, y: 64, width: 40, height: 22, rx: 4 }, 'white'),
    s('path', { d: 'M56 75h16M64 67v16', ...SW(5) }, 'red', { stroke: true }),
    s('rect', { x: 118, y: 66, width: 14, height: 18, rx: 2 }, 'gray'),
    s('path', { d: 'M96 128q4-22 24-18q-2-12 12-10q14 6 4 18q10 12-8 12z' }, 'white'),
    s('path', { d: 'M96 128q4-22 24-18q-2-12 12-10q14 6 4 18q10 12-8 12z', ...SW(3) }, 'gray', { stroke: true })
  ],
  pote: [
    s('path', { d: 'M44 40q-6 26 8 30h56q14-4 8-30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 66h84q8 66-42 70q-50-4-42-70z' }, 'brown', { accent: true }),
    s('rect', { x: 32, y: 60, width: 96, height: 12, rx: 6 }, 'tan'),
    s('path', { d: 'M38 66q42 10 84 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 52q-6-10 0-18M80 50q-6-10 0-20M98 52q-6-10 0-18', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M50 98h60', ...SW(4) }, 'orange', { stroke: true })
  ],
  preciosidad: [
    ...face(80, 86, 48, 'skin', 'smile', { accent: true }),
    s('path', { d: 'M62 42q18-10 26 4', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: dots([[52, 100], [108, 100]], 7) }, 'pink'),
    s('path', { d: sparkle(26, 32, 12) + sparkle(134, 36, 10) + sparkle(136, 124, 8) }, 'yellow'),
    s('path', { d: heart(28, 118, 12) }, 'red')
  ],
  protectorado: [
    backdrop('sky'),
    s('path', { d: 'M24 120q56-18 112 0v26H24z' }, 'blue'),
    s('path', { d: 'M40 116q40-30 80 0z' }, 'green'),
    s('path', { d: 'M66 104h14v-10l-7-6-7 6zM86 104h14v-10l-7-6-7 6z' }, 'red'),
    s('path', { d: 'M28 116q0-84 52-84t52 84', ...DASH(6, '10 6') }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M80 18l14 6v10q0 12-14 18q-14-6-14-18v-10z' }, 'yellow')
  ],
  provocador: [
    ground(),
    ...person(46, 136, 'orange', { accent: true }),
    s('path', { d: 'M60 100l38-10', ...SW(7) }, 'skin', { stroke: true }),
    ...person(118, 136, 'gray'),
    s('path', { d: 'M110 64l6 4M126 64l-6 4M110 82q8-6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: burst(132, 32, 14, 7, 8) }, 'red'),
    s('path', { d: 'M38 66q8 6 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  psicoanalista: [
    s('path', { d: 'M14 98h86v26H14zM14 98q0-26 20-26v26z' }, 'brown'),
    s('path', { d: 'M18 112v24M96 112v24', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 32, cy: 84, r: 11 }, 'skin'),
    s('rect', { x: 44, y: 80, width: 50, height: 18, rx: 8 }, 'blue'),
    ...person(126, 136, 'purple', { accent: true }),
    s('rect', { x: 100, y: 92, width: 16, height: 20, rx: 2 }, 'white'),
    s('path', { d: 'M104 98h8M104 104h8', ...SW(2) }, 'gray', { stroke: true })
  ],
  'púlpito': [
    s('path', { d: 'M60 136l6-40h28l6 40z' }, 'brown'),
    s('circle', { cx: 80, cy: 40, r: 13 }, 'skin'),
    s('rect', { x: 64, y: 52, width: 32, height: 30, rx: 10 }, 'dark'),
    s('path', { d: 'M40 66h80l-10 34H50z' }, 'brown', { accent: true }),
    s('path', { d: 'M36 62h88', ...SW(6) }, 'tan', { stroke: true }),
    s('path', { d: 'M100 136l-10-14M114 136l-8-24', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M74 62l6-6 6 6', ...SW(3) }, 'white', { stroke: true })
  ],
  quienquiera: [
    s('path', { d: busts([34, 62, 90, 118], 128, 24, 30) }, 'blue'),
    s('path', { d: dots([[34, 88], [62, 88], [90, 88], [118, 88]], 11) }, 'skin'),
    s('path', { d: busts([62], 128, 24, 30) }, 'orange', { accent: true }),
    s('path', { d: 'M22 136h116', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 34v20', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M80 64l-8-12h16z' }, 'red'),
    s('path', { d: 'M40 40q40-30 80 0', ...DASH(4) }, 'gray', { stroke: true })
  ],
  quilla: [
    s('path', { d: 'M14 96h132', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: 'M24 58h112l-14 44H38z' }, 'brown'),
    s('path', { d: 'M24 58h112', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: 'M40 102h80l-34 30h-12z' }, 'red', { accent: true }),
    s('path', { d: 'M80 58V22', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 114q16-8 32 0M114 114q16-8 32 0', ...SW(4) }, 'sky', { stroke: true })
  ],
  'reforestación': [
    s('path', { d: 'M14 136q66-40 132 0z' }, 'brown'),
    s('path', { d: 'M38 120h14v-10H38zM110 120h14v-10h-14z' }, 'tan'),
    s('path', { d: 'M80 122V96', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: ells([[80, 86, 14, 14]]) }, 'green', { accent: true }),
    s('path', { d: 'M66 126v-12M94 126v-12', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: ells([[60, 108, 7, 6], [100, 108, 7, 6]]) }, 'green'),
    s('path', { d: 'M124 30v52M114 82h20l-4 12h-12z', ...SW(4) }, 'gray', { stroke: true })
  ],
  refrescar: [
    s('path', { d: 'M50 40h60l-8 96H58z' }, 'sky'),
    s('path', { d: 'M50 40h60l-8 96H58z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: rects([[60, 60, 16, 16], [82, 70, 16, 16], [66, 86, 16, 16]]) }, 'white', { accent: true }),
    s('path', { d: 'M92 64l18-44h12', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M18 50q10 4 20 0M14 70q12 4 24 0M18 90q10 4 20 0M122 60q10 4 20 0M122 84q10 4 20 0', ...SW(3) }, 'blue', { stroke: true })
  ],
  'renglón': [
    ...paper(28, 18, 104, 124),
    s('path', { d: 'M28 42h104M28 62h104M28 102h104M28 122h104', ...SW(2) }, 'sky', { stroke: true }),
    s('path', { d: 'M48 18v124', ...SW(2) }, 'red', { stroke: true }),
    s('rect', { x: 50, y: 70, width: 82, height: 12 }, 'yellow', { accent: true }),
    s('path', { d: 'M56 76q6-6 12 0t12 0 12 0 12 0', ...SW(3) }, 'navy', { stroke: true })
  ],
  senil: [
    ground(),
    ...lean(66, 136, 14, 'purple', { accent: true }),
    s('path', { d: 'M68 76q12-18 24 0', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M78 98l24 4', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M104 98v38', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M82 86h8', ...SW(3) }, 'dark', { stroke: true })
  ],
  subsahariano: [
    s('path', { d: 'M48 22h46l16 12 22 4 4 18-12 24-6 20-22 34h-12l-6-30-8-16-16-8-16-22v-22z' }, 'green', { accent: true }),
    s('path', { d: 'M48 22h46l16 12 22 4 4 18-4 8H34l-4-12v-14z' }, 'yellow'),
    s('path', { d: 'M30 62h106', ...DASH(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M78 50q8-8 16 0M54 44q6-6 12 0', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: ells([[132, 110, 5, 12]]) }, 'green')
  ],
  subyacer: [
    s('rect', { x: 14, y: 14, width: 132, height: 52 }, 'sky'),
    s('rect', { x: 14, y: 62, width: 132, height: 84 }, 'navy'),
    s('path', { d: 'M62 62l14-36 10 8 10 28z' }, 'white'),
    s('path', { d: 'M62 62l14-36 10 8 10 28', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 62h34l26 40-14 34H48l-18-30z' }, 'blue', { accent: true }),
    s('path', { d: 'M14 62h132', ...SW(3) }, 'sky', { stroke: true })
  ],
  superpoder: [
    s('path', { d: 'M86 60L26 96l18 22 34-22z' }, 'red'),
    s('rect', { x: 62, y: 56, width: 28, height: 60, rx: 10, transform: 'rotate(45 76 86)' }, 'blue', { accent: true }),
    s('circle', { cx: 108, cy: 54, r: 12 }, 'skin'),
    s('path', { d: 'M100 70l24-26', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: star(72, 90, 8) }, 'yellow'),
    s('path', { d: 'M18 130l24-18M40 140l24-18M24 108l16-12', ...SW(4) }, 'gray', { stroke: true })
  ],
  tramposo: [
    s('rect', { x: 14, y: 96, width: 68, height: 34, rx: 6 }, 'navy'),
    s('rect', { x: 64, y: 92, width: 14, height: 42, rx: 3 }, 'white'),
    s('circle', { cx: 96, cy: 112, r: 18 }, 'skin'),
    s('path', { d: 'M70 104q5-6 6 2q1-8 6-2l-6 8z' }, 'red', { accent: true }),
    s('path', { d: 'M92 50l20-6 8 46-20 6zM104 46h20v46h-20zM116 46l20 6-8 46-20-6z' }, 'white'),
    s('path', { d: 'M92 50l20-6 8 46-20 6zM104 46h20v46h-20zM116 46l20 6-8 46-20-6z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 40q12-10 24 0q-12 10-24 0z' }, 'white'),
    s('path', { d: 'M40 40q12-10 24 0q-12 10-24 0z', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 56, cy: 40, r: 4 }, 'dark')
  ],
  tridimensional: [
    s('path', { d: 'M80 30l44 24-44 24-44-24z' }, 'sky'),
    s('path', { d: 'M36 54l44 24v52l-44-24z' }, 'blue', { accent: true }),
    s('path', { d: 'M124 54l-44 24v52l44-24z' }, 'navy'),
    s('path', { d: 'M80 78V146M36 106l-20 12M124 106l20 12', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 30V14', ...DASH(3, '4 4') }, 'gray', { stroke: true })
  ],
  vaselina: [
    s('rect', { x: 34, y: 62, width: 92, height: 72, rx: 14 }, 'cream'),
    s('rect', { x: 34, y: 62, width: 92, height: 72, rx: 14, ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 30, y: 36, width: 100, height: 28, rx: 8 }, 'blue', { accent: true }),
    s('path', { d: 'M38 46h84', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M48 80v36', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M74 100q6-14 12 0q-6 8-12 0z' }, 'yellow')
  ],
  'árido': [
    s('circle', { cx: 118, cy: 40, r: 18 }, 'yellow'),
    s('path', { d: rays(118, 40, 24, 32, 8) , ...SW(4) }, 'orange', { stroke: true }),
    s('rect', { x: 14, y: 80, width: 132, height: 60, rx: 6 }, 'tan', { accent: true }),
    s('path', { d: 'M30 96l16 10-6 14 12 10M70 86l-6 18 16 8-4 18M104 92l12 14 18-4M110 106l-6 24', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M44 80V54M44 64l-10-10M44 58l8-10', ...SW(4) }, 'brown', { stroke: true })
  ],
  'óvulo': [
    s('circle', { cx: 80, cy: 80, r: 64 }, 'yellow'),
    s('circle', { cx: 80, cy: 80, r: 54 }, 'cream'),
    s('circle', { cx: 80, cy: 80, r: 46 }, 'pink', { accent: true }),
    s('circle', { cx: 92, cy: 70, r: 16 }, 'purple'),
    s('path', { d: dots([[58, 98], [66, 60], [100, 104]], 3) }, 'white')
  ],
  abusador: [
    ground(),
    s('circle', { cx: 60, cy: 32, r: 16 }, 'skin'),
    s('rect', { x: 38, y: 50, width: 44, height: 86, rx: 14 }, 'dark', { accent: true }),
    s('path', { d: 'M78 64l26-6', ...SW(9) }, 'skin', { stroke: true }),
    s('circle', { cx: 116, cy: 108, r: 10 }, 'skin'),
    s('rect', { x: 104, y: 118, width: 26, height: 18, rx: 8 }, 'sky'),
    s('path', { d: 'M54 30l6 4M66 30l-6 4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: drop(132, 92, 4) }, 'blue')
  ],
  albor: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('path', { d: 'M14 70q66-20 132 0v40H14z' }, 'sky'),
    s('path', { d: 'M14 92q66-18 132 0v18H14z' }, 'cream', { accent: true }),
    s('path', { d: 'M60 110a20 20 0 0 1 40 0z' }, 'yellow'),
    s('path', { d: 'M14 110h132v24a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'dark'),
    s('path', { d: dots([[36, 32], [110, 28], [130, 50]], 2.5) }, 'white')
  ],
  aloe: [
    s('path', { d: 'M48 106h64l-8 32H56z' }, 'orange'),
    s('path', { d: leaflet(80, 108, -90, 90, 8) + leaflet(76, 108, -120, 74, 8) + leaflet(84, 108, -60, 74, 8) + leaflet(72, 108, -150, 56, 7) + leaflet(88, 108, -30, 56, 7) }, 'green', { accent: true }),
    s('path', { d: 'M72 46l-4-2M88 46l4-2M60 72l-4-1M100 72l4-1M80 60l-4-1', ...SW(3) }, 'mint', { stroke: true }),
    s('rect', { x: 44, y: 100, width: 72, height: 10, rx: 4 }, 'brown')
  ],
  amalgama: [
    s('path', { d: drop(34, 40, 12) }, 'red'),
    s('path', { d: drop(80, 30, 12) }, 'blue'),
    s('path', { d: drop(126, 40, 12) }, 'yellow'),
    s('path', { d: 'M40 62l14 26M80 50v34M120 62l-14 26', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 112, r: 28 }, 'purple', { accent: true }),
    s('path', { d: 'M62 110q8-12 18 0t18 2M66 122q8-8 16 0t14 0', ...SW(4) }, 'orange', { stroke: true })
  ],
  'analgésico': [
    s('path', { d: 'M24 70l20-24h10l-10 16h12l-26 38 8-24H24z', transform: 'translate(10 0)' }, 'yellow'),
    s('path', { d: ring(54, 60, 34) + 'M30 36l48 48', ...SW(6) }, 'red', { stroke: true }),
    s('rect', { x: 78, y: 94, width: 64, height: 28, rx: 14, transform: 'rotate(-30 110 108)' }, 'white'),
    s('path', { d: 'M110 108l-14 8a14 14 0 0 1-14-24l14-8z' }, 'blue', { accent: true }),
    s('rect', { x: 78, y: 94, width: 64, height: 28, rx: 14, transform: 'rotate(-30 110 108)', ...SW(3) }, 'gray', { stroke: true })
  ],
  anticristo: [
    backdrop('purple'),
    s('path', { d: 'M80 30q-34 4-34 48v62h68V78q0-44-34-48z' }, 'black', { accent: true }),
    s('path', { d: 'M62 40l-8-20 18 12M98 40l8-20-18 12' }, 'black'),
    s('path', { d: 'M66 66h8M86 66h8', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M24 26l10 14-8 4 10 14', ...SW(3) }, 'yellow', { stroke: true })
  ],
  atisbo: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'brown'),
    s('rect', { x: 72, y: 14, width: 16, height: 132 }, 'dark'),
    s('path', { d: 'M74 76q6-10 12 0q-6 10-12 0z' }, 'white'),
    s('circle', { cx: 80, cy: 76, r: 3.5 }, 'blue', { accent: true }),
    s('path', { d: 'M88 72l56-24M88 80l56 24', ...SW(2) }, 'yellow', { stroke: true }),
    s('path', { d: 'M30 30v100M120 30v100', ...SW(3) }, 'tan', { stroke: true })
  ],
  bacteriano: [
    s('circle', { cx: 70, cy: 70, r: 50 }, 'mint'),
    s('path', { d: ring(70, 70, 50), ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M106 106l32 32', ...SW(12) }, 'brown', { stroke: true }),
    s('rect', { x: 46, y: 46, width: 40, height: 16, rx: 8, transform: 'rotate(-20 66 54)' }, 'green', { accent: true }),
    s('rect', { x: 52, y: 78, width: 36, height: 14, rx: 7, transform: 'rotate(25 70 85)' }, 'green'),
    s('path', { d: 'M46 60q-8 4-12-4M90 92q8 4 8 12M86 46q8-6 14 0', ...SW(2) }, 'green', { stroke: true })
  ],
  barrote: [
    s('rect', { x: 14, y: 14, width: 132, height: 132 }, 'gray'),
    s('rect', { x: 30, y: 30, width: 100, height: 100, rx: 4 }, 'dark'),
    s('path', { d: 'M48 28v104M80 28v104M112 28v104', ...SW(10) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M28 56h104', ...SW(6) }, 'navy', { stroke: true }),
    s('path', { d: ells([[64, 92, 8, 6], [96, 92, 8, 6]]) }, 'skin')
  ],
  binacional: [
    s('path', { d: 'M18 40q30-20 62-8v104H28q-14-40-10-96z' }, 'green'),
    s('path', { d: 'M80 32q34-10 60 10 6 50-8 94H80z' }, 'tan', { accent: true }),
    s('path', { d: 'M80 30v108', ...DASH(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 86h52', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M60 76l-10 10 10 10M100 76l10 10-10 10', ...SW(5) }, 'orange', { stroke: true })
  ],
  bipartidismo: [
    s('path', { d: 'M80 104l-14 32h28z' }, 'gray'),
    s('path', { d: 'M20 112l120-24', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: busts([40], 106, 26, 30) }, 'red', { accent: true }),
    s('circle', { cx: 40, cy: 66, r: 12 }, 'skin'),
    s('path', { d: busts([120], 90, 26, 30) }, 'blue'),
    s('circle', { cx: 120, cy: 50, r: 12 }, 'skin')
  ],
  bloc: [
    s('rect', { x: 34, y: 28, width: 92, height: 114, rx: 4 }, 'gray'),
    s('rect', { x: 30, y: 24, width: 92, height: 114, rx: 4 }, 'cream'),
    s('rect', { x: 30, y: 24, width: 92, height: 18 }, 'red', { accent: true }),
    s('path', { d: 'M42 62h68M42 78h68M42 94h68M42 110h52', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M48 18v12M64 18v12M80 18v12M96 18v12M112 18v12', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M138 56l-28 70 4 10 8-6 28-70z' }, 'yellow')
  ],
  boludear: [
    s('path', { d: 'M18 96h124v34H18zM18 96q0-20 20-20v20zM142 96q0-20-20-20v20z' }, 'purple'),
    s('circle', { cx: 44, cy: 76, r: 12 }, 'skin'),
    s('rect', { x: 54, y: 78, width: 54, height: 20, rx: 8 }, 'orange', { accent: true }),
    s('path', { d: 'M108 88l22 2', ...SW(7) }, 'blue', { stroke: true }),
    s('rect', { x: 56, y: 52, width: 14, height: 22, rx: 2 }, 'dark'),
    s('path', { d: 'M18 130v8M142 130v8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M36 54q4-6 8 0q4-6 8 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  boutique: [
    s('rect', { x: 22, y: 50, width: 116, height: 88 }, 'cream'),
    s('path', { d: 'M18 30h124v20H18z' }, 'pink', { accent: true }),
    s('path', { d: 'M32 30v20M60 30v20M88 30v20M116 30v20', ...SW(8, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true, lineColor: 'gray' }),
    s('rect', { x: 32, y: 62, width: 62, height: 60 }, 'sky'),
    s('path', { d: 'M56 74h14l10 40H46z' }, 'purple'),
    s('rect', { x: 104, y: 70, width: 26, height: 68 }, 'brown')
  ],
  cachetada: [
    ...face(56, 86, 40, 'skin', 'frown'),
    s('path', { d: dots([[40, 98]], 10) }, 'red', { accent: true }),
    s('path', { d: 'M104 66h20q12 0 14 12l2 22q0 12-14 12h-22z' }, 'skin'),
    s('path', { d: 'M104 72h-10M104 84h-12M104 96h-10', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: burst(98, 84, 22, 12, 8), ...SW(3) }, 'orange', { stroke: true })
  ],
  'canalización': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'green'),
    s('path', { d: 'M14 30q20 10 14 30t20 20h98v40H48q-20 0-24-20t-10-26z' }, 'sky'),
    s('path', { d: 'M54 80h92v40H54z' }, 'blue', { accent: true }),
    s('path', { d: 'M54 78h92M54 122h92', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 100h50M110 92l10 8-10 8', ...SW(5) }, 'white', { stroke: true })
  ],
  cancionero: [
    s('rect', { x: 34, y: 20, width: 96, height: 120, rx: 6 }, 'cream'),
    s('rect', { x: 30, y: 16, width: 92, height: 120, rx: 6 }, 'red', { accent: true }),
    s('rect', { x: 30, y: 16, width: 14, height: 120, rx: 4 }, 'brown'),
    ...note(76, 98, 'yellow'),
    s('ellipse', { cx: 100, cy: 88, rx: 7, ry: 5 }, 'yellow'),
    s('path', { d: 'M106 88v-26l-10 4', ...SW(4) }, 'yellow', { stroke: true })
  ],
  caspa: [
    s('path', { d: 'M18 146v-30q0-26 30-30h64q30 4 30 30v30z' }, 'navy', { accent: true }),
    s('circle', { cx: 80, cy: 58, r: 30 }, 'skin'),
    s('path', { d: 'M48 56q0-34 32-34t32 34q-10-14-32-14t-32 14z' }, 'brown'),
    s('path', { d: dots([[46, 104], [62, 112], [98, 108], [116, 100], [80, 122], [34, 126], [126, 124], [54, 136], [106, 134]], 3) }, 'white'),
    s('path', { d: 'M112 30l8-6M118 40l10-2', ...SW(3) }, 'dark', { stroke: true })
  ],
  catar: [
    s('path', { d: 'M14 146v-34q0-18 22-20h20q20 2 20 20v34z' }, 'purple'),
    s('circle', { cx: 46, cy: 66, r: 20 }, 'skin'),
    s('path', { d: 'M36 66h8M52 66h6', ...SW(3) }, 'dark', { stroke: true }),
    ...glass(110, -14, true),
    s('path', { d: 'M64 46q8-8 18-4M66 34q10-8 22-2', ...SW(3) }, 'gray', { stroke: true })
  ],
  cazuela: [
    s('path', { d: 'M22 84h116q-4 46-58 46t-58-46z' }, 'orange', { accent: true }),
    s('ellipse', { cx: 80, cy: 84, rx: 58, ry: 12 }, 'red'),
    s('path', { d: dots([[60, 82], [92, 86], [110, 80]], 6) }, 'green'),
    s('path', { d: dots([[76, 80], [48, 86]], 5) }, 'yellow'),
    s('path', { d: 'M22 88h-10M138 88h10', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M60 64q-6-10 0-20M80 62q-6-10 0-24M100 64q-6-10 0-20', ...SW(4) }, 'gray', { stroke: true })
  ],
  chamuyo: [
    ground(),
    ...person(44, 136, 'blue'),
    ...lady(118, 136, 'pink'),
    s('path', { d: bubble(40, 14, 70, 44) }, 'cream', { accent: true }),
    s('path', { d: heart(62, 34, 10) + heart(88, 34, 10) }, 'red'),
    s('path', { d: sparkle(122, 30, 8) }, 'yellow')
  ],
  chaparro: [
    ground(),
    ...person(48, 136, 'gray', { h: 64, w: 26 }),
    ...person(108, 136, 'green', { h: 36, w: 46, r: 14, accent: true }),
    s('path', { d: 'M108 76q-8 0-10 6h20q-2-6-10-6z' }, 'brown'),
    s('path', { d: 'M136 136V72M130 72h12', ...SW(3) }, 'orange', { stroke: true })
  ],
  colorear: [
    ...paper(20, 20, 112, 112),
    s('path', { d: star(76, 78, 44, 20) }, 'white'),
    s('path', { d: 'M76 34l13 26 31 4-40 30z' }, 'yellow', { accent: true }),
    s('path', { d: star(76, 78, 44, 20), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M150 66l-40 40-6 18 18-6 40-40z' }, 'red'),
    s('path', { d: 'M104 124l6-18 12 12z' }, 'tan')
  ],
  comunicativo: [
    ground(),
    ...person(52, 136, 'orange', { accent: true }),
    s('path', { d: 'M44 78q8 8 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: bubble(76, 18, 64, 38) }, 'sky'),
    s('path', { d: bubble(92, 64, 52, 32) }, 'mint'),
    s('path', { d: dots([[96, 36], [108, 36], [120, 36]], 4) + dots([[108, 80], [118, 80], [128, 80]], 3.5) }, 'navy')
  ],
  connivencia: [
    ground(),
    ...person(46, 136, 'navy'),
    s('rect', { x: 30, y: 62, width: 32, height: 9, rx: 4 }, 'skin', { accent: true }),
    ...person(114, 136, 'gray'),
    s('path', { d: 'M100 108q-12 4-8 20h28q4-16-8-20z' }, 'yellow'),
    s('path', { d: 'M104 106l4-8 4 8', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M108 64l4 2M120 64l-4 2', ...SW(3) }, 'dark', { stroke: true })
  ],
  consorte: [
    ground(),
    ...person(52, 136, 'red'),
    ...lady(108, 136, 'purple'),
    s('path', { d: 'M40 50l4-14 8 8 8-8 4 14z' }, 'yellow', { accent: true }),
    s('path', { d: 'M98 60l3-11 7 6 7-6 3 11z' }, 'yellow'),
    s('path', { d: heart(80, 110, 8) }, 'pink')
  ],
  contiguo: [
    ground(),
    s('rect', { x: 26, y: 72, width: 54, height: 64 }, 'orange', { accent: true }),
    s('rect', { x: 80, y: 72, width: 54, height: 64 }, 'blue'),
    s('path', { d: 'M20 76l33-34 33 34zM74 76l33-34 33 34z' }, 'red'),
    s('path', { d: rects([[36, 88, 14, 14], [98, 88, 14, 14], [56, 108, 14, 28], [112, 108, 14, 28]]) }, 'cream'),
    s('path', { d: 'M80 72v64', ...SW(4) }, 'dark', { stroke: true })
  ],
  conurbano: [
    ground(),
    s('path', { d: rects([[58, 40, 20, 96], [80, 28, 22, 108], [104, 56, 18, 80]]) }, 'navy', { accent: true }),
    s('path', { d: grid(62, 48, 2, 6, 5, 6, 8, 14) }, 'yellow'),
    s('path', { d: 'M18 136v-16l10-8 10 8v16zM40 136v-12l8-6 8 6v12zM124 136v-14l9-7 9 7v14z' }, 'orange'),
    s('path', { d: 'M22 146q58-10 116 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  coronar: [
    ...person(80, 140, 'purple', { h: 40 }),
    s('path', { d: 'M56 54l6-26 10 12 8-16 8 16 10-12 6 26z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[80, 44]], 4) }, 'red'),
    s('path', { d: 'M34 30l16 20M126 30l-16 20', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M20 60l8 4M140 60l-8 4', ...SW(3) }, 'orange', { stroke: true })
  ],
  'cosmovisión': [
    backdrop('navy'),
    s('path', { d: 'M18 80q62-62 124 0q-62 62-124 0z' }, 'white'),
    s('circle', { cx: 80, cy: 80, r: 28 }, 'blue', { accent: true }),
    s('path', { d: 'M66 66q10 0 10 10t10 8q-6 12-16 6M88 62q8 2 10 10' }, 'green'),
    s('path', { d: sparkle(30, 32, 7) + sparkle(130, 128, 7) + sparkle(126, 30, 5) + sparkle(36, 126, 5) }, 'yellow')
  ],
  cotidianidad: [
    s('rect', { x: 18, y: 22, width: 70, height: 72, rx: 6 }, 'white'),
    s('rect', { x: 18, y: 22, width: 70, height: 72, rx: 6, ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 18, y: 22, width: 70, height: 16, rx: 6 }, 'red'),
    s('path', { d: 'M28 52l4 4 6-8M48 52l4 4 6-8M68 52l4 4 6-8M28 74l4 4 6-8M48 74l4 4 6-8', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M86 98h44v30q0 12-12 12H98q-12 0-12-12z' }, 'orange', { accent: true }),
    s('path', { d: 'M130 106q14 0 14 10t-14 10', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M100 92q-4-8 0-14M116 92q-4-8 0-14', ...SW(3) }, 'gray', { stroke: true })
  ],
  'criminología': [
    s('circle', { cx: 74, cy: 82, r: 40 }, 'cream'),
    s('path', { d: 'M50 70q16-26 40 0M44 82q24-42 56 0M46 96q12-16 24-10t24 14M54 110q16-10 32 4M62 84q10-12 20 0', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: ring(74, 82, 40), ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M104 112l30 30', ...SW(12) }, 'navy', { stroke: true, accent: true })
  ],

  cutre: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 8 }, 'tan'),
    s('path', { d: 'M118 14l-6 20 10 10-8 14', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M54 14v20', ...SW(2) }, 'dark', { stroke: true }),
    s('circle', { cx: 54, cy: 40, r: 7 }, 'yellow'),
    s('path', { d: 'M20 140V90q0-12 12-12h96q12 0 12 12v50z' }, 'green', { accent: true }),
    s('path', { d: 'M20 110h120', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 36, y: 86, width: 22, height: 18 }, 'orange'),
    s('path', { d: 'M96 98v-8l8-4-8-4 8-4-8-4', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[104, 120], [112, 124]], 4) }, 'cream')
  ],

  delimitar: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'mint'),
    s('rect', { x: 34, y: 44, width: 92, height: 76 }, 'green'),
    s('rect', { x: 34, y: 44, width: 92, height: 76, ...DASH(4, '8 6') }, 'dark', { stroke: true }),
    s('path', { d: 'M34 44V20M126 44V20M34 120V96M126 120V96', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M34 20h16l-4 6 4 6H34zM126 20h16l-4 6 4 6h-16z' }, 'red', { accent: true })
  ],
  'descrédito': [
    s('path', { d: 'M58 14l-10 30h12l10-30zM102 14l10 30h-12l-10-30z' }, 'blue'),
    s('circle', { cx: 80, cy: 82, r: 40 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 82, r: 28 }, 'orange'),
    s('path', { d: 'M74 42l10 22-12 16 14 18-8 24', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M132 104v32M122 126l10 12 10-12', ...SW(5) }, 'red', { stroke: true })
  ],
  desechable: [
    s('path', { d: 'M92 72h48l-6 68h-36z' }, 'gray'),
    s('rect', { x: 88, y: 64, width: 56, height: 10, rx: 3 }, 'dark'),
    s('path', { d: 'M30 34h40l-6 52H36z' }, 'white'),
    s('path', { d: 'M30 34h40l-6 52H36z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M32 50h36', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M54 100q20 6 32-18M78 78l8 4 0-10', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M108 86v44M124 86v44', ...SW(3) }, 'white', { stroke: true })
  ],
  desprestigiar: [
    s('rect', { x: 24, y: 18, width: 84, height: 104, rx: 4 }, 'yellow', { accent: true }),
    s('rect', { x: 34, y: 28, width: 64, height: 84 }, 'sky'),
    s('circle', { cx: 66, cy: 60, r: 16 }, 'skin'),
    s('path', { d: 'M44 112v-14q0-16 22-16t22 16v14z' }, 'navy'),
    s('path', { d: 'M56 56q4 8 18 6q-2 14 14 14-4 12-24 8 8-6-8-14z' }, 'brown'),
    s('path', { d: dots([[126, 102], [138, 88], [118, 124]], 7) + dots([[86, 40], [96, 92]], 4) }, 'brown')
  ],
  dictaminar: [
    ...paper(20, 40, 70, 90),
    s('path', { d: 'M32 60h46M32 74h46M32 88h30', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 110l10 10 22-22', ...SW(6) }, 'green', { stroke: true }),
    s('rect', { x: 92, y: 114, width: 52, height: 14, rx: 3 }, 'brown'),
    s('rect', { x: 92, y: 30, width: 44, height: 24, rx: 4, transform: 'rotate(-30 114 42)' }, 'brown', { accent: true }),
    s('path', { d: 'M118 54l14 56', ...SW(7) }, 'tan', { stroke: true })
  ],
  donoso: [
    ground(),
    ...person(80, 136, 'navy', { accent: true }),
    s('rect', { x: 64, y: 44, width: 32, height: 6, rx: 2 }, 'black'),
    s('rect', { x: 70, y: 18, width: 20, height: 28, rx: 2 }, 'black'),
    s('path', { d: 'M72 92l8 4 8-4v12l-8-4-8 4z' }, 'red'),
    s('path', { d: 'M72 74q8 8 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(124, 56, 10) + sparkle(36, 70, 7) }, 'yellow'),
    s('path', { d: 'M98 110l20 6', ...SW(5) }, 'brown', { stroke: true })
  ],
  dopaje: [
    s('rect', { x: 30, y: 66, width: 70, height: 22, rx: 4, transform: 'rotate(-40 65 77)' }, 'sky'),
    s('rect', { x: 30, y: 66, width: 70, height: 22, rx: 4, transform: 'rotate(-40 65 77)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 106l-18 18M86 46l14-14M94 26l12 12', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: ring(80, 80, 60) + 'M38 38l84 84', ...SW(9) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 126, cy: 128, r: 14 }, 'yellow'),
    s('path', { d: 'M120 114l-6-16M132 114l6-16', ...SW(4) }, 'blue', { stroke: true })
  ],
  dopamina: [
    s('path', { d: 'M40 96q-22-4-20-26 0-20 18-24 6-20 28-18 14-14 34-2 22-2 26 18 18 8 12 30-4 22-26 22-6 16-24 12-10 10-26 4-18 4-22-16z' }, 'pink', { accent: true }),
    s('path', { d: 'M80 32v76M52 52q10 10 0 22M108 52q-10 10 0 22M60 92q10-6 20 0M100 92q-10-6-20 0', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M60 126q20 10 40 0', ...SW(6) }, 'pink', { stroke: true }),
    s('path', { d: sparkle(26, 28, 10) + sparkle(138, 30, 9) + sparkle(138, 124, 8) + sparkle(22, 120, 7) }, 'yellow')
  ],
  dossier: [
    s('path', { d: 'M24 38h40l8 10h66v88H24z' }, 'brown'),
    s('rect', { x: 34, y: 28, width: 90, height: 96, rx: 2 }, 'white'),
    s('rect', { x: 34, y: 28, width: 90, height: 96, rx: 2, ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 44, y: 40, width: 28, height: 32 }, 'sky'),
    s('path', { d: 'M82 46h32M82 58h32M44 86h70M44 100h56', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M20 92h120v44H20z' }, 'tan', { accent: true }),
    s('path', { d: 'M110 20v30a6 6 0 0 0 12 0V28', ...SW(3) }, 'dark', { stroke: true })
  ],
  dueto: [
    ground(),
    ...person(46, 136, 'blue', { accent: true }),
    ...lady(114, 136, 'red'),
    s('path', { d: 'M58 94l8-20M102 94l-8-20', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[66, 72], [94, 72]], 5) }, 'gray'),
    ...note(72, 34, 'purple'),
    ...note(96, 24, 'orange')
  ],
  'efemérides': [
    s('rect', { x: 24, y: 30, width: 84, height: 100, rx: 6 }, 'white'),
    s('rect', { x: 24, y: 30, width: 84, height: 100, rx: 6, ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 24, y: 30, width: 84, height: 22, rx: 6 }, 'red'),
    s('path', { d: star(66, 92, 26) }, 'yellow', { accent: true }),
    s('path', { d: 'M44 22v16M88 22v16', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M114 70h24v66h-24z' }, 'cream'),
    s('path', { d: 'M114 70h24v66h-24zM118 84h16M118 98h16M118 112h16', ...SW(3) }, 'brown', { stroke: true })
  ],
  elocuencia: [
    s('rect', { x: 18, y: 96, width: 40, height: 40, rx: 3 }, 'brown'),
    ...person(38, 96, 'navy', { h: 30, accent: true }),
    s('path', { d: 'M62 50q10-6 14 4t14 4 14 4 14 4 14 4M62 66q10-6 14 4t14 4 14 4 14 4', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: busts([86, 112, 138], 140, 20, 24) }, 'gray'),
    s('path', { d: dots([[86, 106], [112, 106], [138, 106]], 9) }, 'skin')
  ],
  empoderar: [
    s('rect', { x: 14, y: 94, width: 26, height: 36, rx: 6 }, 'purple'),
    s('path', { d: 'M36 112h44l14-46', ...SW(24) }, 'skin', { stroke: true, accent: true }),
    s('ellipse', { cx: 62, cy: 102, rx: 22, ry: 16 }, 'skin'),
    s('circle', { cx: 96, cy: 56, r: 16 }, 'skin'),
    s('path', { d: 'M54 96q8-6 16 0', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: star(128, 30, 14) }, 'yellow'),
    s('path', { d: 'M120 60l12 4M114 76l14 10', ...SW(4) }, 'orange', { stroke: true })
  ],

  enjuiciar: [
    s('rect', { x: 18, y: 66, width: 124, height: 26 }, 'brown'),
    ...person(80, 70, 'black', { h: 28, r: 11 }),
    s('path', { d: 'M110 52l12-12M106 48l8 8', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 56, y: 112, width: 48, height: 26, rx: 2 }, 'tan'),
    ...person(80, 116, 'orange', { h: 22, w: 26, r: 10, accent: true }),
    s('path', { d: 'M18 92h124', ...SW(3) }, 'dark', { stroke: true })
  ],
  'epifanía': [
    s('path', { d: 'M52 140v-18q-22-10-22-38 0-30 32-34 30 0 34 26l10 18-8 4v10q0 10-10 10h-10v22z' }, 'skin'),
    s('circle', { cx: 96, cy: 36, r: 20 }, 'yellow', { accent: true }),
    s('rect', { x: 88, y: 54, width: 16, height: 12, rx: 3 }, 'gray'),
    s('path', { d: halfRays(96, 36, 26, 36, 7), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M90 36l6 8 6-8', ...SW(3) }, 'orange', { stroke: true })
  ],
  epopeya: [
    s('rect', { x: 30, y: 26, width: 100, height: 108 }, 'cream'),
    s('path', { d: 'M24 20h112M24 140h112', ...SW(12) }, 'brown', { stroke: true }),
    s('path', { d: 'M56 98V72q0-26 24-26t24 26v26H92V80H68v18z' }, 'yellow', { accent: true }),
    s('path', { d: 'M56 54q24-34 48 0', ...SW(8) }, 'red', { stroke: true }),
    s('path', { d: 'M80 80v24', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M44 118h72', ...SW(3) }, 'gray', { stroke: true })
  ],
  escalonar: [
    s('path', { d: 'M18 136V112h30V88h30V64h30V40h34v96z' }, 'blue', { accent: true }),
    s('path', { d: 'M18 112h30M48 88h30M78 64h30M108 40h34', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: 'M28 96q16-26 34-26t28-24 30-22', ...DASH(4, '6 6') }, 'orange', { stroke: true }),
    s('path', { d: 'M110 18l12 6-10 8', ...SW(4) }, 'orange', { stroke: true })
  ],
  escaramuza: [
    s('path', { d: 'M32 128l84-84M128 128L44 44', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: 'M26 118l16 16M134 118l-16 16', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M22 138l10-10M138 138l-10-10', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: burst(80, 80, 22, 10, 8) }, 'yellow', { accent: true }),
    s('path', { d: 'M40 30l8 8M120 30l-8 8M80 18v12', ...SW(4) }, 'orange', { stroke: true })
  ],
  espermatozoide: [
    backdrop('sky'),
    s('path', { d: 'M28 50q12-8 24 0t20 0M22 86q12-8 24 0t20 0M34 120q12-8 24 0t20 0', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: ells([[84, 50, 12, 9], [78, 86, 12, 9], [90, 120, 12, 9]]) }, 'white', { accent: true }),
    s('path', { d: 'M110 70l14 10-14 10M118 40l12 8M122 112l12-6', ...SW(3) }, 'blue', { stroke: true })
  ],
  esterlina: [
    s('rect', { x: 18, y: 30, width: 100, height: 56, rx: 6, transform: 'rotate(-10 68 58)' }, 'purple'),
    s('circle', { cx: 50, cy: 58, r: 14, transform: 'rotate(-10 68 58)' }, 'pink'),
    s('circle', { cx: 100, cy: 104, r: 36 }, 'yellow', { accent: true }),
    s('circle', { cx: 100, cy: 104, r: 28 }, 'orange'),
    s('path', { d: 'M84 116l-2-20 9 8 9-12 9 12 9-8-2 20z' }, 'yellow')
  ],
  'estructuración': [
    s('path', { d: 'M80 48v20M36 68h88M36 68v20M80 68v20M124 68v20', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 56, y: 18, width: 48, height: 30, rx: 5 }, 'navy', { accent: true }),
    s('path', { d: rects([[18, 88, 36, 26], [62, 88, 36, 26], [106, 88, 36, 26]]) }, 'blue'),
    s('path', { d: 'M36 114v12M124 114v12', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[22, 126, 28, 18], [110, 126, 28, 18]]) }, 'sky')
  ],
  extinto: [
    s('path', { d: 'M24 120q4-30 34-34l26-2q6-26 22-36 18-6 26 4l-4 8h-14l-6 22q4 18-6 30l2 24h-10l-4-18H62l-2 18H50l-2-18q-14 2-24 2z' }, 'gray', { accent: true }),
    s('circle', { cx: 120, cy: 52, r: 3 }, 'dark'),
    s('path', { d: 'M14 140h132', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 36, cy: 38, r: 12 }, 'orange'),
    s('path', { d: 'M46 46l20 18M40 52l14 14M52 38l14 12', ...SW(4) }, 'red', { stroke: true })
  ],
  favoritismo: [
    ground(),
    ...person(40, 136, 'gray', { h: 36, r: 11 }),
    ...person(80, 136, 'orange', { h: 36, r: 11, accent: true }),
    ...person(120, 136, 'gray', { h: 36, r: 11 }),
    s('path', { d: heart(80, 40, 16) }, 'red'),
    s('path', { d: 'M108 64l6 4M132 64l-6 4M28 64l6 4M52 64l-6 4', ...SW(3) }, 'dark', { stroke: true })
  ],
  feudalismo: [
    s('path', { d: 'M14 136q40-60 80-40t52 40z' }, 'green'),
    s('path', { d: 'M74 70h48v-36h-10v8h-8v-8h-12v8h-8v-8H74z' }, 'gray', { accent: true }),
    s('path', { d: 'M92 70v-12a6 6 0 0 1 12 0v12z' }, 'dark'),
    s('path', { d: 'M98 34V18l12 4-12 4', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M24 136v-12l10-8 10 8v12zM48 136v-10l8-7 8 7v10z' }, 'brown'),
    s('path', { d: 'M20 126l14-12 14 12M46 128l10-10 10 10', ...SW(4) }, 'yellow', { stroke: true })
  ],
  gladiador: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'tan', { stroke: true }),
    ...person(76, 136, 'red'),
    s('path', { d: 'M62 66q0-22 14-22t14 22z' }, 'gray', { accent: true }),
    s('path', { d: 'M62 42q14-16 28 0', ...SW(6) }, 'red', { stroke: true }),
    s('circle', { cx: 52, cy: 104, r: 22 }, 'yellow'),
    s('path', { d: 'M98 96l26-34', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M92 92l12 8', ...SW(5) }, 'brown', { stroke: true })
  ],
  gravar: [
    s('path', { d: 'M54 20h52l14 46H40z' }, 'dark', { accent: true }),
    s('path', { d: 'M70 20q0-10 10-10t10 10', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 70q-8 40 10 64h60q18-24 10-64z' }, 'brown'),
    s('path', { d: ells([[80, 104, 16, 16]]) }, 'yellow'),
    s('path', { d: 'M28 92l-10-6M28 112h-12M132 92l10-6M132 112h12', ...SW(4) }, 'orange', { stroke: true })
  ],
  haba: [
    s('path', { d: 'M18 98q10-46 62-58t64 6q-6 12-24 12-24 2-50 22t-52 18z' }, 'green', { accent: true }),
    s('path', { d: 'M26 98q14-6 40-26t50-24 26-2', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: ells([[54, 116, 14, 11], [86, 120, 14, 11], [118, 112, 14, 11]]) }, 'mint'),
    s('path', { d: 'M48 110q6-4 12 0M80 114q6-4 12 0M112 106q6-4 12 0', ...SW(3) }, 'green', { stroke: true })
  ],
  hangar: [
    ground(),
    s('path', { d: 'M18 136V96q0-60 62-60t62 60v40z' }, 'gray'),
    s('path', { d: 'M34 136V100q0-44 46-44t46 44v36z' }, 'dark'),
    s('path', { d: 'M46 106h68l6-6h4l-2 10-8 4H52zM74 100l-10-14h8l16 14zM74 114l-8 10h8l12-10z' }, 'white', { accent: true }),
  ],
  hueste: [
    s('path', { d: 'M30 30v96M62 22v104M94 30v96M126 22v104', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M26 30l4-10 4 10zM58 22l4-10 4 10zM90 30l4-10 4 10zM122 22l4-10 4 10z' }, 'gray'),
    s('path', { d: busts([22, 54, 86, 118, 140], 140, 26, 34) }, 'red', { accent: true }),
    s('path', { d: dots([[22, 102], [54, 102], [86, 102], [118, 102], [140, 102]], 10) }, 'skin'),
    s('path', { d: [22, 54, 86, 118, 140].map(x => `M${x - 11} ${100}a11 11 0 0 1 22 0z`).join('') }, 'gray')
  ],
  impenetrable: [
    s('rect', { x: 92, y: 18, width: 42, height: 124 }, 'gray', { accent: true }),
    s('path', { d: 'M92 42h42M92 66h42M92 90h42M92 114h42M113 18v24M102 42v24M124 42v24M113 66v24M102 90v24M124 90v24M113 114v28', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M20 60l66 20M86 80l-30 34', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M86 80l-10-10v16z' }, 'dark'),
    s('path', { d: burst(88, 80, 12, 5, 6) }, 'yellow')
  ],
  impropio: [
    ground(),
    ...person(80, 136, 'orange', { accent: true }),
    s('ellipse', { cx: 80, cy: 82, rx: 5, ry: 4 }, 'dark'),
    s('path', { d: 'M56 52l-14-10M104 52l14-10M50 72H32M110 72h18', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: busts([28, 132], 136, 22, 26) }, 'gray'),
    s('path', { d: dots([[28, 102], [132, 102]], 10) }, 'skin'),
    s('path', { d: 'M22 104h12M126 104h12', ...SW(3) }, 'dark', { stroke: true })
  ],
  impureza: [
    s('path', { d: 'M44 30h72l-10 106H54z' }, 'sky'),
    s('path', { d: 'M44 30h72l-10 106H54z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[64, 60], [92, 72], [74, 94], [98, 112], [66, 120], [84, 54]], 4) }, 'brown', { accent: true }),
    s('path', { d: dots([[78, 76], [90, 98], [70, 108]], 2.5) }, 'dark'),
    s('path', { d: 'M48 46q32 8 64 0', ...SW(3) }, 'blue', { stroke: true })
  ],
  inconsistencia: [
    ground(140),
    s('rect', { x: 50, y: 116, width: 60, height: 24, rx: 2 }, 'blue'),
    s('rect', { x: 46, y: 90, width: 54, height: 24, rx: 2, transform: 'rotate(-8 73 102)' }, 'orange'),
    s('rect', { x: 60, y: 62, width: 50, height: 24, rx: 2, transform: 'rotate(10 85 74)' }, 'green', { accent: true }),
    s('rect', { x: 50, y: 34, width: 46, height: 24, rx: 2, transform: 'rotate(-14 73 46)' }, 'red'),
    s('path', { d: 'M28 40q-8 10 0 20M132 50q8 10 0 20', ...SW(4) }, 'gray', { stroke: true })
  ],
  inquisidor: [
    s('rect', { x: 14, y: 70, width: 70, height: 66 }, 'brown'),
    s('path', { d: 'M28 70V42q0-24 21-24t21 24v28z' }, 'black', { accent: true }),
    s('circle', { cx: 49, cy: 44, r: 10 }, 'skin'),
    s('path', { d: 'M70 54l38 18', ...SW(7) }, 'black', { stroke: true }),
    ...person(122, 140, 'gray', { h: 30, w: 24, r: 10 }),
    s('path', { d: drop(136, 92, 4) }, 'blue')
  ],
  intercontinental: [
    s('circle', { cx: 80, cy: 90, r: 52 }, 'blue'),
    s('path', { d: 'M42 66q12-10 22 0t4 24-18 6-8-30zM96 70q14-4 22 6t0 30-16 8-12-20z' }, 'green'),
    s('path', { d: 'M40 74q40-70 80 0', ...DASH(4) }, 'orange', { stroke: true }),
    s('path', { d: jet(80, 34), transform: 'rotate(90 80 34)' }, 'red', { accent: true })
  ],
  interpersonal: [
    ground(),
    ...person(36, 136, 'blue'),
    ...person(124, 136, 'orange'),
    s('path', { d: 'M56 70h48', ...SW(5) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M64 60l-10 10 10 10M96 60l10 10-10 10', ...SW(5) }, 'purple', { stroke: true }),
    s('path', { d: heart(80, 100, 12) }, 'pink')
  ],
  'intrínsecamente': [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'tan'),
    s('circle', { cx: 80, cy: 80, r: 46 }, 'orange'),
    s('circle', { cx: 80, cy: 80, r: 30 }, 'red'),
    s('circle', { cx: 80, cy: 80, r: 14 }, 'yellow', { accent: true }),
    s('path', { d: sparkle(80, 80, 9) }, 'white')
  ],
  lerdo: [
    ground(),
    s('path', { d: 'M30 116q0-46 46-46t46 46z' }, 'green', { accent: true }),
    s('path', { d: 'M48 116q4-24 28-28M76 88q24 4 28 28M60 90l16 26 16-26', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: ells([[132, 104, 14, 11]]) + 'M40 116h8v18h-8zM100 116h8v18h-8z' }, 'tan'),
    s('path', { d: 'M132 102h8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 70q-4-10 4-14M14 84q-4-8 4-12', ...SW(3) }, 'gray', { stroke: true })
  ],
  letargo: [
    s('path', { d: 'M14 140V90q0-60 66-60t66 60v50z' }, 'gray'),
    s('path', { d: 'M34 140v-40q0-40 46-40t46 40v40z' }, 'dark'),
    s('path', { d: 'M42 136q0-34 34-34h26q20 0 20 20v14z' }, 'brown', { accent: true }),
    s('path', { d: dots([[60, 102], [84, 100]], 6) }, 'brown'),
    s('path', { d: 'M52 118q4 4 8 0M72 118q4 4 8 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[110, 54], [120, 42], [132, 28]], 4) }, 'white'),
    s('path', { d: 'M14 140q66-14 132 0', ...SW(5) }, 'white', { stroke: true, lineColor: 'gray' })
  ],
  libido: [
    s('path', { d: 'M80 22q-26 26-22 54-14-10-14-26-20 22-12 52 8 30 48 34 40-4 48-34 8-30-12-52 0 16-14 26 4-28-22-54z' }, 'orange'),
    s('path', { d: heart(80, 104, 30) }, 'red', { accent: true }),
    s('path', { d: 'M62 70q6-8 14-4', ...SW(4) }, 'pink', { stroke: true })
  ],
  'llorón': [
    ...face(80, 80, 50, 'skin', 'frown', { accent: true }),
    s('path', { d: 'M56 74q-6 30-14 50M104 74q6 30 14 50', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: drop(36, 132, 6) + drop(124, 132, 6) }, 'sky'),
    s('path', { d: 'M54 60l12-4M106 60l-12-4', ...SW(3) }, 'dark', { stroke: true })
  ],
  luminaria: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'navy'),
    s('path', { d: 'M60 136V40q0-12 12-12h28', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M88 28h28l6 12H82z' }, 'gray'),
    s('path', { d: 'M86 40h32l18 96H68z' }, 'yellow', { flatOnly: true, opacity: 0.4 }),
    s('ellipse', { cx: 102, cy: 44, rx: 12, ry: 6 }, 'yellow', { accent: true }),
    s('path', { d: 'M46 136h28', ...SW(6) }, 'gray', { stroke: true })
  ],
  'lúcido': [
    s('path', { d: HEAD }, 'skin'),
    s('circle', { cx: 74, cy: 72, r: 28 }, 'sky'),
    s('circle', { cx: 74, cy: 72, r: 12 }, 'yellow', { accent: true }),
    s('path', { d: rays(74, 72, 16, 22, 8), ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M104 66h6', ...SW(4) }, 'dark', { stroke: true })
  ],
  'matemáticamente': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 6 }, 'white'),
    s('path', { d: 'M14 36h132M14 58h132M14 80h132M14 102h132M14 124h132M36 14v132M58 14v132M80 14v132M102 14v132M124 14v132', ...SW(1) }, 'sky', { stroke: true }),
    s('path', { d: ring(80, 80, 44), ...SW(4) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M80 80l-26-62M80 80l26-62', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 18, r: 6 }, 'red'),
    s('path', { d: 'M24 136l40-40v40z' }, 'yellow')
  ],
  meollo: [
    s('path', { d: 'M24 40q-10-16 6-22 12-2 14 12h72q2-14 14-12 16 6 6 22 10 16-6 22-12 2-14-12H44q-2 14-14 12-16-6-6-22z' }, 'cream'),
    s('path', { d: 'M24 40q-10-16 6-22 12-2 14 12h72q2-14 14-12 16 6 6 22 10 16-6 22-12 2-14-12H44q-2 14-14 12-16-6-6-22z', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 108, r: 34 }, 'cream'),
    s('path', { d: ring(80, 108, 34), ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 108, r: 20 }, 'red', { accent: true }),
    s('path', { d: dots([[74, 102], [86, 112]], 4) }, 'yellow')
  ],
  'metrobús': [
    s('path', { d: 'M14 124h132', ...SW(6) }, 'yellow', { stroke: true }),
    s('rect', { x: 16, y: 58, width: 64, height: 54, rx: 8 }, 'red', { accent: true }),
    s('rect', { x: 84, y: 58, width: 62, height: 54, rx: 8 }, 'red'),
    s('rect', { x: 78, y: 62, width: 8, height: 46 }, 'dark'),
    s('path', { d: grid(24, 66, 3, 1, 14, 16, 18, 0) + grid(92, 66, 3, 1, 14, 16, 18, 0) }, 'sky'),
    s('path', { d: dots([[34, 114], [62, 114], [104, 114], [130, 114]], 8) }, 'dark')
  ],
  mezcal: [
    s('path', { d: 'M48 136V72q0-10 8-16V30h16v26q8 6 8 16v64z' }, 'green', { accent: true }),
    s('rect', { x: 54, y: 82, width: 20, height: 26, rx: 2 }, 'cream'),
    s('path', { d: 'M100 108l8 30h16l8-30z' }, 'yellow'),
    s('path', { d: 'M100 108l8 30h16l8-30z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: wedge(130, 104, 12, 180, 360) }, 'orange'),
    s('path', { d: leaflet(116, 70, -110, 36, 6) + leaflet(116, 70, -70, 36, 6) + leaflet(116, 70, -150, 28, 5) + leaflet(116, 70, -30, 28, 5) }, 'mint')
  ],
  'naturalización': [
    s('rect', { x: 20, y: 30, width: 66, height: 92, rx: 6 }, 'navy', { accent: true }),
    s('circle', { cx: 53, cy: 68, r: 18 }, 'yellow'),
    s('path', { d: 'M35 68h36M53 50v36M42 56q11 12 0 24M64 56q-11 12 0 24', ...SW(2) }, 'navy', { stroke: true }),
    s('path', { d: 'M36 102h34', ...SW(3) }, 'yellow', { stroke: true }),
    ...person(118, 136, 'green'),
    s('path', { d: 'M110 82q8 6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 86l18 10', ...SW(6) }, 'skin', { stroke: true })
  ],
  'náutica': [
    s('path', { d: rays(80, 80, 20, 62, 8, 22.5), ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: ring(80, 80, 44), ...SW(12) }, 'brown', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 80, r: 16 }, 'tan'),
    s('circle', { cx: 80, cy: 80, r: 6 }, 'dark'),
    s('path', { d: dots(around(80, 80, 62, 8, 22.5), 6) }, 'tan')
  ],
  'náutico': [
    s('path', { d: 'M14 120q16-8 32 0t34 0 34 0 32 0v26H14z' }, 'blue'),
    s('path', { d: 'M76 22v80', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 24q36 36 30 72H80z' }, 'white'),
    s('path', { d: 'M80 24q36 36 30 72H80z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M72 36q-28 30-30 60h30z' }, 'red', { accent: true }),
    s('path', { d: 'M30 104h100l-12 16H42z' }, 'navy')
  ],
  oruga: [
    s('path', { d: 'M14 120q60-60 132-40q-30 60-132 40z' }, 'green'),
    s('path', { d: 'M20 118q60-30 120-36', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: ells([[42, 86, 12, 12], [62, 80, 13, 13], [84, 78, 13, 13], [106, 80, 12, 12]]) }, 'yellow', { accent: true }),
    s('circle', { cx: 124, cy: 72, r: 14 }, 'orange'),
    s('path', { d: dots([[128, 68]], 2.5) }, 'dark'),
    s('path', { d: 'M120 58l-4-12M130 58l4-12', ...SW(3) }, 'dark', { stroke: true })
  ],
  paisa: [
    s('path', { d: 'M62 60l18-16 18 16v20H62z' }, 'orange'),
    s('rect', { x: 74, y: 66, width: 12, height: 14 }, 'brown'),
    ground(),
    ...person(44, 136, 'blue', { accent: true }),
    ...person(116, 136, 'green'),
    s('path', { d: 'M58 100q22-12 44 0', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M36 78q8 6 16 0M108 78q8 6 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  palomino: [
    ...horse('yellow', 'cream', { accent: true }),
    s('path', { d: 'M34 80q-14 10-10 36', ...SW(3) }, 'tan', { stroke: true }),
    s('circle', { cx: 136, cy: 44, r: 2.5 }, 'dark')
  ],
  'papelería': [
    s('rect', { x: 14, y: 96, width: 132, height: 44, rx: 4 }, 'brown'),
    s('path', { d: 'M24 96V58h28v38z' }, 'blue', { accent: true }),
    s('path', { d: 'M30 58l-4-36M38 58V18M46 58l6-34', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: rects([[64, 84, 46, 12], [66, 72, 42, 12], [62, 60, 46, 12]]) }, 'green'),
    s('path', { d: rects([[66, 84, 46, 12], [68, 72, 42, 12], [64, 60, 46, 12]]), ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M118 96V40h14v56z' }, 'yellow')
  ],
  pepita: [
    s('ellipse', { cx: 80, cy: 98, rx: 64, ry: 30 }, 'gray'),
    s('ellipse', { cx: 80, cy: 92, rx: 54, ry: 20 }, 'sky'),
    s('path', { d: 'M62 88l10-14 18-2 12 10-4 14-20 4z' }, 'yellow', { accent: true }),
    s('path', { d: 'M72 80l8-2', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: dots([[44, 94], [116, 90], [104, 102]], 3) }, 'orange'),
    s('path', { d: sparkle(118, 50, 10) + sparkle(46, 54, 7) }, 'yellow')
  ],
  'personería': [
    s('rect', { x: 18, y: 34, width: 124, height: 92, rx: 10 }, 'cream'),
    s('rect', { x: 18, y: 34, width: 124, height: 92, rx: 10, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M32 110V58l24-12 24 12v52z' }, 'blue', { accent: true }),
    s('path', { d: grid(40, 64, 3, 3, 8, 8, 12, 14) }, 'sky'),
    s('path', { d: 'M94 62h36M94 78h36M94 94h24', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 120, cy: 106, r: 10 }, 'red')
  ],
  petardo: [
    s('rect', { x: 52, y: 62, width: 40, height: 76, rx: 6 }, 'red', { accent: true }),
    s('path', { d: 'M52 80h40M52 120h40', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M72 62q0-16 14-22', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: burst(94, 34, 18, 8, 8) }, 'yellow'),
    s('path', { d: burst(94, 34, 9, 4, 6) }, 'orange'),
    s('path', { d: 'M124 70l10 4M118 86l12 10M122 18l10-6', ...SW(3) }, 'orange', { stroke: true })
  ],
  pigmento: [
    s('path', { d: 'M18 120q0-36 24-36t24 36z' }, 'red', { accent: true }),
    s('path', { d: 'M56 120q0-50 24-50t24 50z' }, 'blue'),
    s('path', { d: 'M94 120q0-36 24-36t24 36z' }, 'yellow'),
    s('path', { d: 'M14 120h132v10q0 10-10 10H24q-10 0-10-10z' }, 'tan'),
    s('path', { d: 'M110 22l-30 40', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 62l-6 10 10-4z' }, 'purple')
  ],
  placenta: [
    s('circle', { cx: 80, cy: 84, r: 60 }, 'pink'),
    s('circle', { cx: 80, cy: 84, r: 52 }, 'cream'),
    s('path', { d: 'M40 50q40-30 80 0q-40 12-80 0z' }, 'red', { accent: true }),
    s('path', { d: 'M80 46q-14 22 4 36', ...SW(4) }, 'purple', { stroke: true }),
    s('circle', { cx: 92, cy: 92, r: 15 }, 'skin'),
    s('path', { d: 'M70 92q-14 30 12 40 26 2 32-16-4-14-16-14z' }, 'skin')
  ],
  plaqueta: [
    s('rect', { x: 14, y: 30, width: 132, height: 100, rx: 10 }, 'pink'),
    s('path', { d: ells([[42, 62, 18, 12], [116, 58, 18, 12], [40, 106, 18, 12], [118, 104, 18, 12]]) }, 'red'),
    s('path', { d: ells([[42, 62, 7, 4], [116, 58, 7, 4], [40, 106, 7, 4], [118, 104, 7, 4]]) }, 'pink'),
    s('path', { d: 'M74 70l6 6-4 8 8 6-4 8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 66l10-4 6 6-8 6zM84 84l10-2 2 10-10 2zM68 92l10 2-4 10-8-4z' }, 'yellow', { accent: true })
  ],
  'pornográfico': [
    s('rect', { x: 18, y: 26, width: 124, height: 86, rx: 8 }, 'dark'),
    s('rect', { x: 26, y: 34, width: 108, height: 70 }, 'pink'),
    s('path', { d: checker(56, 46, 4, 4, 12) }, 'purple'),
    s('path', { d: 'M64 136l8-24h16l8 24z' }, 'gray'),
    s('circle', { cx: 124, cy: 112, r: 20 }, 'white'),
    s('path', { d: ring(124, 112, 18) + 'M111 99l26 26', ...SW(6) }, 'red', { stroke: true, accent: true })
  ],
  'predilección': [
    s('path', { d: 'M28 80l12 56 12-56zM68 80l12 56 12-56zM108 80l12 56 12-56z' }, 'tan'),
    s('path', { d: ells([[40, 74, 14, 14], [120, 74, 14, 14]]) }, 'mint'),
    s('circle', { cx: 80, cy: 72, r: 16 }, 'pink', { accent: true }),
    s('path', { d: heart(80, 40, 14) }, 'red'),
    s('path', { d: sparkle(108, 30, 8) + sparkle(52, 34, 6) }, 'yellow')
  ],
  prelado: [
    ground(),
    s('path', { d: 'M62 136l6-62h24l6 62z' }, 'purple', { accent: true }),
    s('circle', { cx: 80, cy: 62, r: 12 }, 'skin'),
    s('path', { d: 'M68 52q0-26 12-34 12 8 12 34z' }, 'white'),
    s('path', { d: 'M68 52q0-26 12-34 12 8 12 34zM80 22v28', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M112 136V40q0-14 12-14t10 12q-2 8-10 6', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M92 96l20-4', ...SW(6) }, 'skin', { stroke: true })
  ],
  prole: [
    ground(),
    ...person(80, 136, 'green', { h: 52, w: 34, r: 14, accent: true }),
    s('path', { d: busts([28, 50, 110, 132], 136, 18, 22) }, 'orange'),
    s('path', { d: dots([[28, 106], [50, 106], [110, 106], [132, 106]], 8) }, 'skin'),
    s('path', { d: busts([50, 110], 136, 18, 22) }, 'blue')
  ],
  puntilla: [
    s('rect', { x: 14, y: 22, width: 132, height: 56 }, 'purple'),
    s('path', { d: 'M14 78h132v14' + Array.from({ length: 6 }, (_, i) => `q-11 22-22 0`).join('') + 'z' }, 'white', { accent: true }),
    s('path', { d: 'M14 78h132v14' + Array.from({ length: 6 }, () => 'q-11 22-22 0').join('') + 'z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: dots([25, 47, 69, 91, 113, 135].map(x => [x, 92]), 4) + dots([36, 58, 80, 102, 124].map(x => [x, 84]), 2.5) }, 'gray'),
    s('path', { d: 'M14 70h132', ...DASH(2, '4 4') }, 'cream', { stroke: true })
  ]
};
