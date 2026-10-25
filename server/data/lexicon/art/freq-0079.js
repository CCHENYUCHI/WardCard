// Illustration specs for words still undrawn in batches 0076–0079 (see server/scripts/lexicon/art.js)
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
// Path data: a meringue kiss with base centred at cx on y = b, scaled k
const kiss = (cx, b, k) => `M${cx - 20 * k} ${b}q${-4 * k} ${-20 * k} ${14 * k} ${-30 * k}l${6 * k} ${-16 * k} ${6 * k} ${16 * k}q${18 * k} ${10 * k} ${14 * k} ${30 * k}z`;
// Path data: a jigsaw piece 40x40 with a knob on top (place with translate)
const PIECE = 'M0 0h14a6 6 0 0 1 12 0h14v40H0z';

module.exports = {
  forjar: [
    s('path', { d: 'M30 92h100q-10 14-30 16v16h16v12H44v-12h16v-16q-24-2-30-16z' }, 'dark'),
    s('rect', { x: 46, y: 82, width: 64, height: 10, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M88 60l40-34', ...SW(7) }, 'brown', { stroke: true }),
    s('rect', { x: 68, y: 50, width: 34, height: 20, rx: 3, transform: 'rotate(-40 85 60)' }, 'gray'),
    s('path', { d: 'M42 72l-10-12M56 68l-2-14M34 84l-14-4', ...SW(4) }, 'orange', { stroke: true })
  ],
  manzano: [
    ground(),
    s('rect', { x: 72, y: 84, width: 16, height: 52, rx: 4 }, 'brown'),
    s('circle', { cx: 80, cy: 64, r: 50 }, 'green', { accent: true }),
    s('path', { d: dots([[56, 52], [94, 36], [106, 76], [64, 86], [82, 60], [118, 52], [42, 72]], 7) }, 'red')
  ],
  marico: [
    ...person(50, 136, 'blue'),
    ...person(110, 136, 'orange', { accent: true }),
    s('path', { d: 'M62 98l12-10M98 98l-12-10', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: burst(80, 62, 14, 7, 8) }, 'yellow')
  ],
  mimo: [
    backdrop('sky'),
    s('path', { d: 'M58 92L36 76M102 92l22-16', ...SW(8) }, 'white', { stroke: true }),
    s('rect', { x: 56, y: 84, width: 48, height: 52, rx: 14 }, 'white'),
    s('path', { d: 'M58 98h44M58 112h44M58 126h44', ...SW(6) }, 'black', { stroke: true }),
    s('circle', { cx: 80, cy: 60, r: 22 }, 'white', { accent: true }),
    s('ellipse', { cx: 80, cy: 40, rx: 20, ry: 7 }, 'black'),
    s('path', { d: 'M72 54v6M88 54v6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M74 70q6 4 12 0', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: dots([[34, 74], [126, 74]], 10) }, 'white')
  ],
  misteriosamente: [
    backdrop('navy'),
    s('path', { d: 'M80 30q-34 0-36 50l-8 56h88l-8-56q-2-50-36-50z' }, 'purple', { accent: true }),
    s('ellipse', { cx: 80, cy: 66, rx: 18, ry: 20 }, 'black'),
    s('path', { d: dots([[73, 64], [87, 64]], 3) }, 'yellow'),
    s('path', { d: sparkle(124, 36, 10) + sparkle(36, 44, 7) }, 'yellow')
  ],
  'monzón': [
    s('path', { d: 'M38 98l-8 18M58 98l-8 18M78 98l-8 18M98 98l-8 18M48 72l-8 18M68 72l-8 18M88 72l-8 18M108 72l-8 18', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M26 56q0-20 22-18q8-18 30-12q16-14 34 0q26-2 26 22q0 12-14 12H40q-14 0-14-4z' }, 'dark', { accent: true }),
    s('path', { d: 'M124 136q-4-30 8-52', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(132, 84, 200, 28, 7) + leaflet(132, 84, 165, 26, 7) + leaflet(132, 84, 235, 24, 7) }, 'green'),
    s('path', { d: 'M20 132q24-8 48 0t40 0', ...SW(4) }, 'gray', { stroke: true })
  ],
  naturalista: [
    ...person(54, 136, 'green', { accent: true }),
    s('path', { d: 'M42 72q12-18 24 0z' }, 'tan'),
    s('path', { d: 'M38 72h32', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M66 100l40-56', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: ring(114, 34, 14) + 'M114 48l-4 20', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: ells([[124, 76, 8, 10], [140, 76, 8, 10]]) }, 'orange'),
    s('path', { d: 'M132 68v18', ...SW(3) }, 'dark', { stroke: true })
  ],
  notificar: [
    s('rect', { x: 46, y: 18, width: 68, height: 124, rx: 10 }, 'dark'),
    s('rect', { x: 52, y: 30, width: 56, height: 100, rx: 4 }, 'sky'),
    s('path', { d: 'M66 90q0-26 14-28q14 2 14 28l4 6H62z' }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 100, r: 5 }, 'yellow'),
    s('path', { d: 'M58 70q-6 12 0 24M102 70q6 12 0 24', ...SW(3) }, 'orange', { stroke: true }),
    s('circle', { cx: 110, cy: 26, r: 12 }, 'red')
  ],
  notoriamente: [
    s('path', { d: dots([[26, 30], [56, 30], [104, 30], [134, 30], [26, 130], [56, 130], [104, 130], [134, 130], [26, 80], [134, 80]], 8) }, 'gray'),
    s('path', { d: rays(80, 80, 34, 44, 8, 22) , ...SW(4) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 26 }, 'red', { accent: true }),
    s('path', { d: sparkle(90, 70, 8) }, 'white')
  ],
  organizativo: [
    s('path', { d: 'M80 44v18M40 62h80M40 62v18M80 62v18M120 62v18M40 102v16M120 102v16', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 62, y: 20, width: 36, height: 24, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: rects([[22, 80, 36, 22], [62, 80, 36, 22], [102, 80, 36, 22]]) }, 'sky'),
    s('path', { d: rects([[22, 118, 36, 20], [102, 118, 36, 20]]) }, 'mint')
  ],
  'oráculo': [
    s('path', { d: 'M28 44v92M132 44v92', ...SW(12) }, 'tan', { stroke: true }),
    s('path', { d: 'M14 44h132v-8L80 14 14 36z' }, 'tan'),
    s('path', { d: 'M66 136l10-36M94 136l-10-36M80 136V100', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M56 94h48q-4 14-24 14t-24-14z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 88q-12-12 0-22t0-22', ...SW(6) }, 'purple', { stroke: true }),
    s('path', { d: sparkle(106, 56, 8) + sparkle(56, 64, 6) }, 'orange')
  ],
  ovario: [
    s('path', { d: 'M58 52q-14-14-30-4M102 52q14-14 30-4', ...SW(6) }, 'pink', { stroke: true }),
    s('path', { d: 'M56 48h48q0 36-14 46v28H70V94q-14-10-14-46z' }, 'pink'),
    s('path', { d: ells([[34, 72, 12, 9], [126, 72, 12, 9]]) }, 'purple', { accent: true }),
    s('path', { d: 'M26 48q-10 6-4 14M134 48q10 6 4 14', ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: 'M72 60q8 8 16 0', ...SW(3) }, 'red', { stroke: true })
  ],
  ovni: [
    backdrop('navy'),
    s('path', { d: 'M62 70l-26 66h88l-26-66z' }, 'yellow', { opacity: 0.6 }),
    s('path', { d: 'M58 60q22-34 44 0z' }, 'sky'),
    s('ellipse', { cx: 80, cy: 62, rx: 52, ry: 14 }, 'gray', { accent: true }),
    s('path', { d: dots([[50, 62], [80, 66], [110, 62]], 4) }, 'yellow'),
    s('path', { d: sparkle(28, 30, 6) + sparkle(132, 32, 5) }, 'white')
  ],
  parabrisas: [
    s('path', { d: rects([[30, 108, 20, 20], [110, 108, 20, 20]]) }, 'dark'),
    s('path', { d: 'M40 68l12-34h56l12 34z' }, 'sky', { accent: true }),
    s('path', { d: 'M40 68l12-34h56l12 34', ...SW(6) }, 'red', { stroke: true }),
    s('rect', { x: 24, y: 66, width: 112, height: 46, rx: 12 }, 'red'),
    s('path', { d: 'M58 64l32-24', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[42, 88], [118, 88]], 8) }, 'yellow'),
    s('path', { d: 'M62 96h36', ...SW(4) }, 'dark', { stroke: true })
  ],
  pay: [
    s('path', { d: 'M22 88h116l-10 34H32z' }, 'tan'),
    s('ellipse', { cx: 80, cy: 88, rx: 58, ry: 20 }, 'orange', { accent: true }),
    s('path', { d: 'M44 80h72M38 92h84M48 102h64M58 72l-6 32M80 70v36M102 72l6 32', ...SW(4) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 80, cy: 88, rx: 58, ry: 20, ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M64 56q-6-10 0-20M96 56q-6-10 0-20', ...SW(3) }, 'gray', { stroke: true })
  ],
  pedal: [
    ...gear(60, 72, 26, 14, 'gray'),
    s('circle', { cx: 60, cy: 72, r: 8 }, 'dark'),
    s('path', { d: 'M60 72l40 38', ...SW(10) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 102q2-20 20-22l6 10q18 2 22 12z' }, 'blue'),
    s('rect', { x: 82, y: 104, width: 54, height: 14, rx: 4 }, 'orange', { accent: true })
  ],
  perejil: [
    s('path', { d: 'M80 136V84M80 112L54 70M80 104l28-40M80 92l-4-44', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots([[52, 62], [42, 72], [60, 54], [110, 56], [120, 66], [102, 48], [74, 40], [84, 32], [66, 34]], 9) }, 'green', { accent: true }),
    s('path', { d: dots([[50, 64], [110, 58], [74, 38]], 4) }, 'mint'),
    s('rect', { x: 72, y: 116, width: 16, height: 8, rx: 2 }, 'red')
  ],
  perenne: [
    ground(),
    s('circle', { cx: 128, cy: 32, r: 14 }, 'yellow'),
    s('path', { d: 'M80 16l-30 46h14l-24 40h80l-24-40h14z' }, 'green', { accent: true }),
    s('rect', { x: 72, y: 102, width: 16, height: 34, rx: 2 }, 'brown'),
    s('path', { d: rays(30, 40, 0, 9, 6) + rays(26, 92, 0, 7, 6) + rays(134, 96, 0, 7, 6), ...SW(3) }, 'sky', { stroke: true })
  ],
  perfeccionamiento: [
    s('path', { d: 'M18 136v-24h30V88h30V64h30V40h34v96z' }, 'blue', { accent: true }),
    ...person(125, 40, 'orange', { h: 18, w: 16, r: 8 }),
    s('path', { d: 'M24 100L94 44', ...SW(5, { 'stroke-dasharray': '6 6' }) }, 'gray', { stroke: true }),
    s('path', { d: star(40, 34, 12) }, 'yellow')
  ],
  plagado: [
    s('path', { d: leaflet(28, 132, -45, 144, 38) }, 'green', { accent: true }),
    s('path', { d: 'M28 132L124 36', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: 'M54 106l-6-6M60 100l6 6M82 78l-6-6M88 72l6 6M98 94l-6-6M104 88l6 6M68 60l-6-6M74 54l6 6M112 64l-6-6M118 58l6 6', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: ells([[57, 103, 5, 7], [85, 75, 5, 7], [101, 91, 5, 7], [71, 57, 5, 7], [115, 61, 5, 7], [44, 118, 5, 7], [92, 48, 5, 7], [124, 82, 5, 7]]) }, 'dark')
  ],
  'poderío': [
    s('rect', { x: 14, y: 100, width: 22, height: 36, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M30 136V104q16-2 24-14q16-20 34-4l4 4V56h30v60q0 20-20 20z' }, 'skin'),
    s('path', { d: ells([[107, 46, 20, 16]]) }, 'skin'),
    s('path', { d: 'M54 96q16-12 30 0M100 40h14', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M136 28l10-8M140 50h8M70 40l-8-10M84 30l-2-12', ...SW(4) }, 'orange', { stroke: true })
  ],
  'politécnico': [
    s('path', { d: 'M20 62L80 26l60 36z' }, 'navy'),
    s('rect', { x: 28, y: 62, width: 104, height: 70, rx: 2 }, 'sky'),
    s('path', { d: 'M40 70v58M120 70v58', ...SW(8) }, 'white', { stroke: true }),
    ...gear(80, 96, 14, 10, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 96, r: 6 }, 'sky'),
    ground()
  ],
  poronga: [
    s('path', { d: 'M114 70q22 4 16 30q-4 12-16 12', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M70 30h20v18q30 14 30 50q0 36-40 40q-40-4-40-40q0-36 30-50z' }, 'tan', { accent: true }),
    s('rect', { x: 68, y: 22, width: 24, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M48 100q32 12 64 0', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: drop(36, 44, 7) + drop(132, 36, 6) }, 'sky')
  ],
  'postulación': [
    ...paper(24, 18, 70, 92),
    s('circle', { cx: 44, cy: 40, r: 9 }, 'skin'),
    s('path', { d: 'M60 36h24M60 46h18M34 66h50M34 78h50M34 90h36', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M78 112h64v24H78z' }, 'blue', { accent: true }),
    s('path', { d: 'M88 120h44', ...SW(4) }, 'dark', { stroke: true }),
    arrow('M100 68q18 4 14 36'),
    s('path', { d: 'M106 98l8 12 8-12z' }, 'orange')
  ],
  'psicológicamente': [
    s('path', { d: HEAD }, 'sky'),
    s('path', { d: ells([[70, 62, 24, 20], [92, 58, 18, 18]]) }, 'pink', { accent: true }),
    s('path', { d: 'M54 60q6-8 12 0t12 0 12 0M62 72q6-6 12 0t12 0', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: heart(118, 112, 10) }, 'red')
  ],
  psicosis: [
    s('path', { d: HEAD }, 'purple', { accent: true }),
    s('path', { d: 'M50 70q10-30 30-10t30-6q-10 30-40 18t-14-22q20-10 34 8', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M24 30l8 10-6 2 8 10M140 116l6 8-4 2 6 8', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: spiral(126, 26), ...SW(3) }, 'dark', { stroke: true })
  ],
  pudor: [
    s('circle', { cx: 80, cy: 76, r: 44 }, 'skin'),
    s('path', { d: 'M58 66q6 4 12 0M90 66q6 4 12 0M72 100q8 4 16 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[56, 86, 10, 6], [104, 86, 10, 6]]) }, 'pink', { accent: true }),
    s('path', { d: ells([[38, 100, 12, 20], [122, 100, 12, 20]]) }, 'tan'),
    s('path', { d: 'M24 34l8 8M136 34l-8 8M80 18v10', ...SW(4) }, 'red', { stroke: true })
  ],
  pulsar: [
    s('rect', { x: 30, y: 108, width: 100, height: 24, rx: 6 }, 'gray'),
    s('path', { d: 'M52 104v-8h56v8q-28 12-56 0z' }, 'red', { accent: true }),
    s('ellipse', { cx: 80, cy: 96, rx: 28, ry: 8 }, 'red'),
    s('rect', { x: 70, y: 28, width: 20, height: 62, rx: 10 }, 'skin'),
    s('rect', { x: 62, y: 14, width: 36, height: 22, rx: 6 }, 'blue'),
    s('path', { d: 'M48 66l12 8M112 66l-12 8', ...SW(4) }, 'orange', { stroke: true })
  ],
  reactivar: [
    s('circle', { cx: 80, cy: 80, r: 40 }, 'green', { accent: true }),
    s('path', { d: 'M66 68a20 20 0 1 0 28 0M80 56v24', ...SW(7) }, 'white', { stroke: true }),
    s('path', { d: 'M126 56a52 52 0 1 0 6 30', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M114 52l18-8 2 18z' }, 'orange')
  ],
  rebeca: [
    s('rect', { x: 72, y: 26, width: 16, height: 110 }, 'cream'),
    s('path', { d: 'M60 26L30 40 14 90l16 6 12-28v68h36V70z' }, 'purple', { accent: true }),
    s('path', { d: 'M100 26l30 14 16 50-16 6-12-28v68H82V70z' }, 'purple'),
    s('path', { d: dots([[74, 84], [74, 102], [74, 120]], 3) }, 'yellow'),
    s('path', { d: 'M42 128h36M82 128h36', ...SW(4) }, 'dark', { stroke: true })
  ],
  redada: [
    s('path', { d: 'M66 36q0-18 14-18t14 18z' }, 'red', { accent: true }),
    s('rect', { x: 58, y: 36, width: 44, height: 6, rx: 2 }, 'dark'),
    s('path', { d: 'M48 20l-8-4M112 20l8-4M46 34h-10M114 34h10', ...SW(3) }, 'red', { stroke: true }),
    ...person(60, 136, 'gray', { h: 30, w: 20, r: 9 }),
    ...person(100, 136, 'gray', { h: 30, w: 20, r: 9 }),
    s('path', { d: 'M24 136Q24 56 80 56T136 136M40 136L60 62M80 56v80M120 136L100 62M30 100h100M26 118h108', ...SW(3) }, 'dark', { stroke: true })
  ],
  remitir: [
    s('rect', { x: 34, y: 54, width: 70, height: 60, rx: 4 }, 'brown', { accent: true }),
    s('path', { d: 'M69 54v60M34 74h70', ...SW(5) }, 'tan', { stroke: true }),
    arrow('M110 84h22', 'orange', 7),
    s('path', { d: 'M128 72l16 12-16 12z' }, 'orange'),
    s('path', { d: 'M16 70h10M14 86h14M16 102h10', ...SW(4) }, 'gray', { stroke: true })
  ],
  'resignación': [
    s('path', { d: ells([[70, 30, 16, 10], [88, 28, 14, 10]]) }, 'gray'),
    s('path', { d: 'M72 46v6M82 46v6M92 44v6', ...SW(3) }, 'blue', { stroke: true }),
    ...person(80, 136, 'gray', { accent: true }),
    s('path', { d: 'M66 98l-18-8-6-14M94 98l18-8 6-14', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M72 78q3 3 6 0M82 78q3 3 6 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  resina: [
    ground(),
    s('rect', { x: 46, y: 14, width: 52, height: 122, rx: 6 }, 'brown'),
    s('path', { d: 'M58 30v40M88 46v50M64 96v30', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M72 56q14 0 14 14v24q0 6-5 6t-5-6V72q-4 0-4-16z' }, 'orange', { accent: true }),
    s('path', { d: drop(116, 104, 7) }, 'orange'),
    s('path', { d: 'M102 120h28l-4 16h-20z' }, 'gray')
  ],
  retina: [
    s('circle', { cx: 88, cy: 80, r: 46 }, 'white'),
    s('path', { d: ring(88, 80, 46), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M109 44a42 42 0 0 1 0 72', ...SW(8) }, 'red', { stroke: true }),
    s('path', { d: 'M132 90q12 8 12 28', ...SW(8) }, 'pink', { stroke: true }),
    s('path', { d: 'M14 64L50 72L126 82M14 96L50 88L126 82', ...SW(3) }, 'orange', { stroke: true }),
    s('ellipse', { cx: 50, cy: 80, rx: 8, ry: 20 }, 'sky', { accent: true })
  ],
  'retroalimentación': [
    s('rect', { x: 16, y: 62, width: 36, height: 36, rx: 8 }, 'blue', { accent: true }),
    s('rect', { x: 108, y: 62, width: 36, height: 36, rx: 8 }, 'green'),
    arrow('M36 54q44-40 80-4'),
    s('path', { d: 'M108 44l16 14-20 4z' }, 'orange'),
    arrow('M124 106q-44 40-80 4', 'purple'),
    s('path', { d: 'M52 116l-16-14 20-4z' }, 'purple')
  ],
  revelado: [
    backdrop('dark'),
    s('circle', { cx: 130, cy: 30, r: 9 }, 'red', { accent: true }),
    s('path', { d: 'M18 40h104', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: rects([[24, 44, 30, 36], [64, 44, 30, 36], [104, 44, 30, 36]]) }, 'white'),
    s('path', { d: 'M27 76l9-14 7 7 6-6 4 13zM67 76l9-14 7 7 6-6 4 13zM107 76l9-14 7 7 6-6 4 13z' }, 'green'),
    s('path', { d: dots([[46, 52], [86, 52], [126, 52]], 3) }, 'orange'),
    s('path', { d: 'M28 112h104l-6 22H34z' }, 'gray'),
    s('path', { d: 'M36 118h88', ...SW(5) }, 'orange', { stroke: true })
  ],
  'sarcástico': [
    s('circle', { cx: 80, cy: 80, r: 52 }, 'yellow', { accent: true }),
    s('path', { d: dots([[62, 74], [100, 74]], 11) }, 'white'),
    s('path', { d: dots([[62, 67], [100, 67]], 5) }, 'dark'),
    s('path', { d: 'M48 56l24-4M88 50q12-10 24 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 104q26 6 46-14', ...SW(5) }, 'dark', { stroke: true })
  ],
  sendos: [
    s('path', { d: 'M66 98L72 54M126 98l6-44', ...SW(2) }, 'dark', { stroke: true }),
    ...person(50, 136, 'blue'),
    ...person(110, 136, 'green', { accent: true }),
    s('path', { d: ells([[72, 38, 12, 15], [132, 38, 12, 15]]) }, 'red')
  ],
  sinagoga: [
    s('path', { d: 'M40 62q40-46 80 0z' }, 'blue'),
    s('rect', { x: 28, y: 62, width: 104, height: 74, rx: 2 }, 'tan', { accent: true }),
    s('path', { d: 'M40 136v-26a8 8 0 0 1 16 0v26zM104 136v-26a8 8 0 0 1 16 0v26zM70 136v-32a10 10 0 0 1 20 0v32z' }, 'brown'),
    s('path', { d: 'M68 18v4q0 8 12 8t12-8v-4M74 18v3q0 4 6 4t6-4v-3M80 16v22M72 38h16', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M40 80h80', ...SW(4) }, 'brown', { stroke: true }),
    ground()
  ],
  sindicalismo: [
    s('path', { d: 'M28 22v62M132 22v62', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 24, y: 24, width: 112, height: 28, rx: 3 }, 'red', { accent: true }),
    ...person(40, 136, 'blue', { h: 36, w: 24, r: 10 }),
    ...person(80, 136, 'blue', { h: 36, w: 24, r: 10 }),
    ...person(120, 136, 'blue', { h: 36, w: 24, r: 10 }),
    s('path', { d: 'M29 86a11 11 0 0 1 22 0zM69 86a11 11 0 0 1 22 0zM109 86a11 11 0 0 1 22 0z' }, 'yellow'),
    s('path', { d: 'M52 108h16M92 108h16', ...SW(6) }, 'skin', { stroke: true })
  ],
  solventar: [
    s('path', { d: PIECE, transform: 'translate(30 54)' }, 'blue'),
    s('path', { d: PIECE, transform: 'translate(72 54)' }, 'red'),
    s('path', { d: PIECE, transform: 'translate(30 96)' }, 'green'),
    s('path', { d: PIECE, transform: 'translate(96 104) rotate(10)' }, 'orange', { accent: true }),
    s('path', { d: 'M80 116h10', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 30l8 8 18-20', ...SW(6) }, 'green', { stroke: true })
  ],
  'superávit': [
    s('path', { d: 'M44 58h72v70q0 8-8 8H52q-8 0-8-8z' }, 'sky'),
    s('path', { d: ells([[62, 124, 14, 6], [96, 124, 14, 6], [80, 112, 14, 6], [62, 100, 14, 6], [98, 100, 14, 6], [80, 88, 14, 6], [64, 76, 14, 6], [96, 76, 14, 6], [80, 64, 14, 6], [80, 48, 14, 6], [60, 40, 12, 5], [100, 40, 12, 5]]) }, 'yellow', { accent: true }),
    s('path', { d: ells([[62, 124, 14, 6], [96, 124, 14, 6], [80, 112, 14, 6], [62, 100, 14, 6], [98, 100, 14, 6], [80, 88, 14, 6], [64, 76, 14, 6], [96, 76, 14, 6], [80, 64, 14, 6], [80, 48, 14, 6], [60, 40, 12, 5], [100, 40, 12, 5]]), ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M136 80V30', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M126 36l10-14 10 14z' }, 'green'),
    s('circle', { cx: 28, cy: 124, r: 10 }, 'yellow')
  ],
  tenista: [
    ground(),
    ...person(60, 136, 'green', { accent: true }),
    s('rect', { x: 48, y: 72, width: 24, height: 5, rx: 2 }, 'red'),
    s('path', { d: 'M72 100l24-22', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M96 78l10-12', ...SW(5) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 116, cy: 54, rx: 13, ry: 17, transform: 'rotate(40 116 54)' }, 'cream'),
    s('ellipse', { cx: 116, cy: 54, rx: 13, ry: 17, transform: 'rotate(40 116 54)', ...SW(4) }, 'blue', { stroke: true }),
    s('circle', { cx: 136, cy: 24, r: 7 }, 'yellow')
  ],
  'teólogo': [
    s('path', { d: 'M34 136V58a46 46 0 0 1 92 0v78z' }, 'sky'),
    s('path', { d: 'M80 14v122M34 70h92', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M62 74h36l12 62H50z' }, 'brown'),
    s('circle', { cx: 80, cy: 58, r: 13 }, 'skin'),
    s('path', { d: 'M70 62q10 22 20 0z' }, 'gray'),
    s('path', { d: 'M60 96l20 6 20-6v24l-20 6-20-6z' }, 'red', { accent: true })
  ],
  timidez: [
    s('circle', { cx: 62, cy: 62, r: 14 }, 'skin'),
    s('rect', { x: 48, y: 78, width: 26, height: 58, rx: 8 }, 'pink', { accent: true }),
    s('circle', { cx: 57, cy: 59, r: 2.5 }, 'dark'),
    s('ellipse', { cx: 56, cy: 67, rx: 4, ry: 2.5 }, 'red'),
    s('rect', { x: 70, y: 20, width: 64, height: 116, rx: 4 }, 'brown'),
    s('circle', { cx: 72, cy: 92, r: 5 }, 'skin'),
    s('circle', { cx: 122, cy: 82, r: 4 }, 'yellow'),
    s('path', { d: drop(40, 44, 4) }, 'sky')
  ],
  'tipología': [
    s('path', { d: 'M18 58h104M18 102h104', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[34, 40], [62, 40], [90, 40]], 12) }, 'red'),
    s('path', { d: rects([[22, 68, 24, 24], [50, 68, 24, 24], [78, 68, 24, 24]]) }, 'blue', { accent: true }),
    s('path', { d: 'M34 110l12 22H22zM62 110l12 22H50zM90 110l12 22H78z' }, 'yellow'),
    s('path', { d: rects([[118, 32, 24, 16], [118, 72, 24, 16], [118, 114, 24, 16]]) }, 'gray')
  ],
  tuerto: [
    s('path', { d: 'M50 56l8-26 12 14 10-18 10 18 12-14 8 26z' }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 94, r: 40 }, 'skin'),
    s('path', { d: 'M44 80L120 66', ...SW(3) }, 'black', { stroke: true }),
    s('ellipse', { cx: 66, cy: 88, rx: 11, ry: 10 }, 'black'),
    s('circle', { cx: 96, cy: 88, r: 4 }, 'dark'),
    s('path', { d: 'M66 112q14 10 28 0', ...SW(4) }, 'dark', { stroke: true })
  ],
  tula: [
    s('path', { d: 'M56 70q24-40 48 0', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 18, y: 66, width: 124, height: 58, rx: 29 }, 'green', { accent: true }),
    s('path', { d: ells([[32, 95, 10, 24], [128, 95, 10, 24]]) }, 'navy'),
    s('path', { d: 'M44 74h72', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 58, y: 88, width: 44, height: 24, rx: 4 }, 'navy')
  ],
  vidente: [
    s('path', { d: 'M50 120h60l8 16H42z' }, 'brown'),
    s('circle', { cx: 80, cy: 78, r: 40 }, 'purple', { accent: true }),
    s('path', { d: 'M54 78q26-24 52 0q-26 24-52 0z' }, 'white'),
    s('circle', { cx: 80, cy: 78, r: 9 }, 'navy'),
    s('path', { d: 'M58 54q8-10 20-12', ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: ells([[36, 104, 12, 18], [124, 104, 12, 18]]) }, 'skin'),
    s('path', { d: star(28, 30, 8) + star(132, 28, 8) }, 'yellow')
  ],
  voltear: [
    s('path', { d: 'M24 104h80q0 24-20 24H44q-20 0-20-24z' }, 'dark'),
    s('path', { d: 'M104 110h34', ...SW(8) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 62, cy: 52, rx: 30, ry: 9, transform: 'rotate(-20 62 52)' }, 'tan', { accent: true }),
    s('ellipse', { cx: 62, cy: 52, rx: 30, ry: 9, transform: 'rotate(-20 62 52)', ...SW(3) }, 'brown', { stroke: true }),
    arrow('M104 86q26-40-12-62'),
    s('path', { d: 'M98 14l-14 10 14 8z' }, 'orange')
  ],
  'vómito': [
    s('path', { d: 'M54 114h52l-6 26H60z' }, 'gray'),
    s('circle', { cx: 80, cy: 62, r: 44 }, 'mint'),
    s('path', { d: 'M56 54q6 6 12 0M92 54q6 6 12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[50, 80, 10, 8], [110, 80, 10, 8]]) }, 'green', { accent: true }),
    s('ellipse', { cx: 80, cy: 90, rx: 20, ry: 11 }, 'skin'),
    s('path', { d: drop(126, 34, 6) }, 'sky')
  ],
  za: [
    ...person(42, 136, 'blue', { accent: true }),
    s('path', { d: 'M54 100l18-26', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M78 64l8-6M80 78l10-2', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M100 118l-6 16M126 118l6 16M96 106l-8-8', ...SW(5) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 112, cy: 110, rx: 20, ry: 10 }, 'brown'),
    s('circle', { cx: 134, cy: 98, r: 9 }, 'brown'),
    s('path', { d: 'M86 120h-8M88 130h-10', ...SW(3) }, 'gray', { stroke: true })
  ],
  'ámbar': [
    s('path', { d: 'M40 76q6-46 44-50q38 6 40 44q0 44-42 54q-46-6-42-48z' }, 'orange', { accent: true }),
    s('path', { d: 'M54 64q8-22 26-26', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: ells([[72, 76, 9, 5], [96, 74, 9, 5]]) }, 'cream'),
    s('path', { d: 'M76 94l-8 6M80 98l-6 8M92 94l8 6', ...SW(2) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 84, cy: 86, rx: 6, ry: 13, transform: 'rotate(20 84 86)' }, 'brown'),
    s('path', { d: sparkle(130, 30, 9) }, 'yellow')
  ],
  'ícono': [
    s('rect', { x: 20, y: 22, width: 120, height: 104, rx: 8 }, 'dark'),
    s('rect', { x: 28, y: 30, width: 104, height: 88, rx: 4 }, 'sky'),
    s('rect', { x: 38, y: 42, width: 22, height: 22, rx: 5 }, 'red'),
    s('rect', { x: 69, y: 42, width: 22, height: 22, rx: 5 }, 'blue'),
    s('rect', { x: 100, y: 42, width: 22, height: 22, rx: 5 }, 'green'),
    s('rect', { x: 38, y: 78, width: 22, height: 22, rx: 5 }, 'yellow'),
    s('rect', { x: 69, y: 78, width: 22, height: 22, rx: 5 }, 'purple', { accent: true }),
    s('rect', { x: 100, y: 78, width: 22, height: 22, rx: 5 }, 'orange'),
    s('path', { d: 'M84 92v30l7-7 6 12 5-2-6-12h10z' }, 'black')
  ],
  abusivo: [
    ...person(54, 136, 'dark', { h: 70, w: 40, r: 16 }),
    ...person(120, 136, 'sky', { h: 30, w: 20, r: 9 }),
    s('path', { d: 'M74 82l32 8', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: burst(88, 32, 12, 6, 8) }, 'red', { accent: true }),
    s('path', { d: drop(138, 78, 4) }, 'sky')
  ],
  'afección': [
    s('path', { d: 'M80 22v48M80 70l-12 8M80 70l12 8', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M68 54q-34 4-36 50q0 26 18 26q20 0 20-30z' }, 'pink'),
    s('path', { d: 'M92 54q34 4 36 50q0 26-18 26q-20 0-20-30z' }, 'pink'),
    s('path', { d: dots([[50, 100], [60, 84], [46, 116], [108, 108]], 6) }, 'red', { accent: true }),
    s('rect', { x: 110, y: 22, width: 30, height: 14, rx: 7, transform: 'rotate(-30 125 29)' }, 'blue')
  ],
  aguardar: [
    s('path', { d: 'M20 108h70M28 108v28M82 108v28', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 52, cy: 64, r: 12 }, 'skin'),
    s('rect', { x: 40, y: 78, width: 26, height: 32, rx: 8 }, 'blue', { accent: true }),
    s('path', { d: 'M60 104h16v28', ...SW(8) }, 'blue', { stroke: true }),
    s('circle', { cx: 116, cy: 50, r: 24 }, 'white'),
    s('path', { d: ring(116, 50, 24), ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M116 50V36M116 50l10 6', ...SW(4) }, 'dark', { stroke: true })
  ],
  'aledaño': [
    ground(),
    s('path', { d: 'M14 86l22-22 22 22zM102 86l22-22 22 22z' }, 'brown'),
    s('path', { d: rects([[20, 86, 32, 50], [108, 86, 32, 50]]) }, 'tan'),
    s('path', { d: 'M52 74l28-32 28 32z' }, 'red', { accent: true }),
    s('rect', { x: 58, y: 74, width: 44, height: 62 }, 'yellow'),
    s('rect', { x: 72, y: 106, width: 16, height: 30 }, 'brown'),
    s('path', { d: rects([[28, 98, 10, 10], [122, 98, 10, 10]]) }, 'sky')
  ],
  arbitrariamente: [
    s('rect', { x: 26, y: 70, width: 48, height: 48, rx: 8, transform: 'rotate(-15 50 94)' }, 'red', { accent: true }),
    s('path', { d: dots([[38, 82], [50, 94], [62, 106]], 5), transform: 'rotate(-15 50 94)' }, 'white'),
    s('rect', { x: 86, y: 40, width: 44, height: 44, rx: 8, transform: 'rotate(20 108 62)' }, 'white'),
    s('rect', { x: 86, y: 40, width: 44, height: 44, rx: 8, transform: 'rotate(20 108 62)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[97, 51], [119, 51], [97, 73], [119, 73]], 4), transform: 'rotate(20 108 62)' }, 'dark'),
    s('path', { d: 'M28 50q8-20 30-24M100 108q16 8 34 0', ...SW(4) }, 'gray', { stroke: true })
  ],
  artificialmente: [
    s('path', { d: 'M80 70v46', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 102, 200, 28, 8) + leaflet(80, 92, -20, 28, 8) }, 'green'),
    ...gear(80, 50, 18, 10, 'gray'),
    s('circle', { cx: 80, cy: 50, r: 8 }, 'yellow', { accent: true }),
    s('path', { d: 'M56 114h48l-6 24H62z' }, 'orange'),
    s('path', { d: 'M104 126h14M118 118v16', ...SW(5) }, 'dark', { stroke: true })
  ],
  autodidacta: [
    backdrop('navy'),
    s('path', { d: 'M118 24a14 14 0 1 0 14 18a11 11 0 0 1-14-18z' }, 'yellow'),
    ...person(58, 136, 'orange', { accent: true }),
    s('path', { d: 'M42 96l16 4 16-4v20l-16 4-16-4z' }, 'white'),
    s('path', { d: rects([[94, 124, 44, 10], [98, 112, 38, 10]]) }, 'red'),
    s('path', { d: rects([[92, 100, 44, 10]]) }, 'green')
  ],
  'avería': [
    ...scaled(car(0, 14, 'blue'), 1.7, 38, 60),
    s('path', { d: ells([[48, 52, 10, 8], [60, 38, 12, 9], [76, 28, 10, 8]]) }, 'gray'),
    s('path', { d: 'M16 136l12-22 12 22z' }, 'orange', { accent: true })
  ],
  bacalao: [
    s('path', { d: 'M22 80q30-34 82-20l32-22v84l-32-22q-52 14-82-20z' }, 'tan', { accent: true }),
    s('path', { d: 'M62 60l14-18 12 20z' }, 'brown'),
    s('path', { d: 'M40 86q40 8 66-4', ...SW(3) }, 'cream', { stroke: true }),
    s('path', { d: dots([[60, 72], [76, 68], [92, 74], [70, 96], [88, 92]], 3) }, 'brown'),
    s('circle', { cx: 38, cy: 74, r: 4 }, 'dark'),
    s('path', { d: 'M30 92l-4 10', ...SW(2) }, 'dark', { stroke: true })
  ],
  baraja: [
    s('rect', { x: 58, y: 38, width: 44, height: 64, rx: 6, transform: 'rotate(-22 80 124)' }, 'red'),
    s('rect', { x: 58, y: 38, width: 44, height: 64, rx: 6 }, 'blue'),
    s('rect', { x: 58, y: 38, width: 44, height: 64, rx: 6, transform: 'rotate(22 80 124)' }, 'white'),
    s('rect', { x: 58, y: 38, width: 44, height: 64, rx: 6, transform: 'rotate(22 80 124)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: heart(80, 70, 12), transform: 'rotate(22 80 124)' }, 'red', { accent: true }),
    s('path', { d: 'M64 44l32 52M96 44L64 96', ...SW(2) }, 'sky', { stroke: true })
  ],
  barbilla: [
    s('circle', { cx: 76, cy: 66, r: 40 }, 'skin'),
    s('path', { d: 'M36 62q0-42 40-42t40 42q-20-18-40-16t-40 16z' }, 'brown'),
    s('path', { d: dots([[62, 64], [90, 64]], 4) }, 'dark'),
    s('path', { d: 'M66 84q10 6 20 0', ...SW(4) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 76, cy: 100, rx: 16, ry: 6 }, 'pink', { accent: true }),
    arrow('M126 134L98 110'),
    s('path', { d: 'M92 104l16 2-6 12z' }, 'orange')
  ],
  bombardear: [
    s('path', { d: 'M16 30h10M14 46h8', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M26 40h86l20-14h8l-8 20q-4 6-12 6H36q-10 0-10-12z' }, 'gray'),
    s('path', { d: 'M64 44l20 18h10l-8-18z' }, 'dark'),
    s('path', { d: ells([[62, 76, 6, 9], [76, 98, 6, 9], [90, 120, 6, 9]]) }, 'black'),
    s('path', { d: burst(118, 124, 16, 8, 9) }, 'orange', { accent: true })
  ],
  calentura: [
    ...face(70, 82, 44, 'pink', 'flat', { accent: true }),
    s('path', { d: 'M80 100l52-28', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M90 95l38-20', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: drop(34, 42, 5) }, 'sky'),
    s('path', { d: 'M54 30q4-6 0-12M76 26q4-6 0-12M98 30q4-6 0-12', ...SW(3) }, 'orange', { stroke: true })
  ],
  caminante: [
    s('path', { d: 'M20 138q60-6 70-36t50-54', ...SW(10) }, 'tan', { stroke: true }),
    s('circle', { cx: 126, cy: 30, r: 12 }, 'yellow'),
    s('rect', { x: 32, y: 84, width: 14, height: 26, rx: 4, transform: 'rotate(8 56 132)' }, 'brown'),
    ...lean(56, 132, 8, 'green', { h: 40, w: 24, r: 10, accent: true }),
    s('path', { d: 'M78 132l6-48', ...SW(4) }, 'brown', { stroke: true })
  ],
  cantera: [
    s('path', { d: 'M14 136V40h30v24h30v24h30v24h42v24z' }, 'tan'),
    s('path', { d: 'M24 56h12M50 80h16M80 104h16M20 100h14', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: rects([[110, 96, 16, 14], [128, 96, 16, 14], [119, 82, 16, 14]]) }, 'gray', { accent: true }),
    s('path', { d: 'M66 46l26-26', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M74 16q16 0 24 18', ...SW(6) }, 'dark', { stroke: true })
  ],
  catalogar: [
    s('path', { d: rects([[40, 26, 30, 30], [52, 22, 30, 30], [90, 28, 30, 28]]) }, 'white'),
    s('path', { d: rects([[40, 26, 30, 30], [52, 22, 30, 30], [90, 28, 30, 28]]), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: rects([[44, 18, 10, 8], [66, 14, 10, 8], [100, 20, 10, 8]]) }, 'red'),
    s('rect', { x: 26, y: 52, width: 108, height: 84, rx: 6 }, 'brown', { accent: true }),
    s('path', { d: rects([[34, 60, 42, 32], [84, 60, 42, 32], [34, 98, 42, 32], [84, 98, 42, 32]]) }, 'tan'),
    s('path', { d: 'M48 80h14M98 80h14M48 118h14M98 118h14', ...SW(4) }, 'dark', { stroke: true })
  ],
  'chófer': [
    s('path', { d: busts([80], 136, 64, 60) }, 'navy', { accent: true }),
    s('circle', { cx: 80, cy: 58, r: 20 }, 'skin'),
    s('path', { d: 'M58 46q22-30 44 0z' }, 'navy'),
    s('path', { d: 'M56 46h48', ...SW(5) }, 'black', { stroke: true }),
    s('path', { d: ring(80, 112, 26) + 'M54 112h52M80 112v26', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: dots([[58, 98], [102, 98]], 7) }, 'white')
  ],
  collage: [
    s('rect', { x: 22, y: 22, width: 60, height: 50, rx: 2, transform: 'rotate(-8 52 47)' }, 'sky'),
    s('rect', { x: 74, y: 30, width: 56, height: 60, rx: 2, transform: 'rotate(10 102 60)' }, 'yellow', { accent: true }),
    s('rect', { x: 28, y: 80, width: 56, height: 52, rx: 2, transform: 'rotate(6 56 106)' }, 'pink'),
    s('rect', { x: 88, y: 94, width: 48, height: 40, rx: 2, transform: 'rotate(-12 112 114)' }, 'mint'),
    s('circle', { cx: 42, cy: 42, r: 9 }, 'orange'),
    s('path', { d: 'M42 122l14-24 14 24z' }, 'green'),
    s('path', { d: star(102, 60, 13) }, 'red'),
    s('path', { d: ring(112, 114, 9), ...SW(4) }, 'blue', { stroke: true })
  ],
  conjetura: [
    ...person(42, 136, 'blue', { accent: true }),
    s('path', { d: 'M56 102l-6-20', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: ells([[100, 46, 42, 30], [66, 84, 5, 5], [76, 74, 7, 7]]) }, 'sky'),
    s('path', { d: 'M78 56L98 32L122 54', ...SW(3, { 'stroke-dasharray': '4 5' }) }, 'dark', { stroke: true }),
    s('path', { d: dots([[78, 56], [98, 32], [122, 54]], 6) }, 'red')
  ],
  copar: [
    s('circle', { cx: 80, cy: 88, r: 48 }, 'gray'),
    s('path', { d: wedge(80, 88, 48, -60, 250) }, 'blue', { accent: true }),
    s('path', { d: 'M64 32l4-18 12 9 12-9 4 18z' }, 'yellow'),
    s('path', { d: ring(80, 88, 48), ...SW(3) }, 'white', { stroke: true })
  ],
  cucharada: [
    s('path', { d: 'M20 124L82 88', ...SW(9) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 104, cy: 72, rx: 32, ry: 19, transform: 'rotate(-30 104 72)' }, 'gray'),
    s('ellipse', { cx: 105, cy: 70, rx: 25, ry: 13, transform: 'rotate(-30 105 70)' }, 'orange', { accent: true }),
    s('path', { d: drop(118, 110, 6) }, 'orange'),
    s('path', { d: sparkle(96, 64, 5) }, 'yellow')
  ],
  'códice': [
    s('rect', { x: 36, y: 26, width: 96, height: 110, rx: 4 }, 'tan'),
    s('rect', { x: 30, y: 22, width: 92, height: 110, rx: 6 }, 'brown', { accent: true }),
    s('path', { d: 'M30 22h14v14H30zM108 22h14v14h-14zM30 118h14v14H30zM108 118h14v14h-14z' }, 'yellow'),
    s('path', { d: 'M78 52l22 25-22 25-22-25z' }, 'red'),
    s('circle', { cx: 78, cy: 77, r: 6 }, 'yellow'),
    s('rect', { x: 114, y: 70, width: 20, height: 14, rx: 3 }, 'yellow'),
    s('path', { d: 'M40 22v110', ...SW(3) }, 'dark', { stroke: true })
  ],
  decididamente: [
    s('circle', { cx: 70, cy: 88, r: 50 }, 'red'),
    s('circle', { cx: 70, cy: 88, r: 34 }, 'white'),
    s('circle', { cx: 70, cy: 88, r: 18 }, 'red', { accent: true }),
    s('path', { d: 'M70 88l58-50', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M122 30l20-8-6 20-8 4zM112 38l2-10 6 4' }, 'orange'),
    s('path', { d: 'M86 106l12 8M52 108l-10 8', ...SW(3) }, 'orange', { stroke: true })
  ],
  demagogia: [
    s('path', { d: busts([22, 46, 114, 138], 136, 20, 20) }, 'gray'),
    s('path', { d: dots([[22, 108], [46, 108], [114, 108], [138, 108]], 8) }, 'skin'),
    s('circle', { cx: 80, cy: 60, r: 12 }, 'skin'),
    s('rect', { x: 68, y: 74, width: 24, height: 30, rx: 8 }, 'navy'),
    s('path', { d: 'M54 96h52l-6 40H60z' }, 'brown'),
    s('path', { d: 'M90 60l26-14v32l-26-12z' }, 'orange', { accent: true }),
    s('path', { d: star(132, 30, 8) + sparkle(134, 70, 8) + heart(126, 50, 6) }, 'yellow')
  ],
  deportar: [
    s('path', { d: 'M96 14v122', ...SW(4, { 'stroke-dasharray': '8 6' }) }, 'gray', { stroke: true }),
    ...person(54, 136, 'blue', { accent: true }),
    s('rect', { x: 68, y: 110, width: 22, height: 26, rx: 3 }, 'brown'),
    s('path', { d: 'M74 110v-6h10v6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: jet(124, 56), transform: 'rotate(45 124 56)' }, 'gray'),
    arrow('M102 106h30'),
    s('path', { d: 'M128 98l12 8-12 8z' }, 'orange')
  ],
  derrocamiento: [
    ground(),
    s('path', { d: 'M40 40h14v56h40v12H82v28h-6v-28H54v28h-14z', transform: 'rotate(24 82 136)' }, 'red', { accent: true }),
    s('path', { d: 'M100 60l6-18 10 10 10-14 8 14 10-8-2 18z', transform: 'rotate(30 120 52)' }, 'yellow'),
    s('path', { d: 'M104 26l-6-8M124 24v-10', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[100, 132], [112, 128], [124, 132]], 4) }, 'tan')
  ],
  descendente: [
    s('path', { d: 'M20 20v116h124', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[30, 40, 20, 96], [58, 64, 20, 72], [86, 88, 20, 48], [114, 110, 20, 26]]) }, 'sky'),
    s('path', { d: 'M30 26L122 100', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M112 108l22 4-8-20z' }, 'red', { accent: true })
  ],
  desconcierto: [
    s('path', { d: 'M80 22v114', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 26h36l8 8-8 8H80z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 48H44l-8 8 8 8h36z' }, 'red'),
    s('path', { d: 'M80 70h30l8 8-8 8H80z' }, 'green'),
    ...person(42, 136, 'orange', { h: 30, w: 20, r: 9 }),
    s('path', { d: 'M52 112l6-14', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: spiral(24, 78), ...SW(3) }, 'gray', { stroke: true })
  ],
  deslizamiento: [
    s('path', { d: 'M14 136V36q30 0 50 30t40 50l42 20z' }, 'green'),
    s('path', { d: 'M40 46q26 10 42 40t60 50H72q-10-30-32-50z' }, 'brown', { accent: true }),
    s('path', { d: dots([[110, 128], [126, 132], [96, 122]], 6) }, 'gray'),
    s('path', { d: 'M96 60l18 18M110 50l18 18', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M108 82l8-2-2-8M122 72l8-2-2-8', ...SW(4) }, 'orange', { stroke: true })
  ],
  detalladamente: [
    ...paper(34, 18, 88, 124),
    s('path', { d: 'M44 40l4 4 8-8M44 64l4 4 8-8M44 88l4 4 8-8M44 112l4 4 8-8', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M64 38h46M64 46h30M64 62h46M64 70h30M64 86h46M64 94h30M64 110h46M64 118h30', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 118, y: 70, width: 12, height: 60, rx: 3, transform: 'rotate(20 124 100)' }, 'blue', { accent: true })
  ],
  'digestión': [
    s('path', { d: 'M74 14v28', ...SW(8) }, 'pink', { stroke: true }),
    s('path', { d: 'M74 40q-34-4-38 30q-2 26 26 30q30 4 44-22q8-16-4-26q-8 8-16 2q-4-10-12-14z' }, 'pink', { accent: true }),
    s('path', { d: 'M104 82q12 14 6 28', ...SW(6) }, 'pink', { stroke: true }),
    s('path', { d: 'M110 110H44q-10 0-10 10t10 10h72q10 0 10-8t-10-8H56', ...SW(7) }, 'orange', { stroke: true }),
    s('path', { d: 'M56 66q10 10 24 4', ...SW(3) }, 'red', { stroke: true })
  ],
  elasticidad: [
    s('path', { d: 'M32 80h12l6-16 12 32 12-32 12 32 12-32 12 32 6-16h12', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: rects([[16, 64, 16, 32], [128, 64, 16, 32]]) }, 'red', { accent: true }),
    s('path', { d: 'M40 120H22M120 120h18', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M26 110l-12 10 12 10zM134 110l12 10-12 10z' }, 'orange'),
    s('path', { d: 'M40 40H22M120 40h18', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M26 30l-12 10 12 10zM134 30l12 10-12 10z' }, 'orange')
  ],
  enfriamiento: [
    s('rect', { x: 46, y: 20, width: 24, height: 96, rx: 12 }, 'white'),
    outline({ x: 46, y: 20, width: 24, height: 96, rx: 12 }),
    s('rect', { x: 53, y: 84, width: 10, height: 34, rx: 4 }, 'blue'),
    s('circle', { cx: 58, cy: 120, r: 16 }, 'blue', { accent: true }),
    arrow('M108 22v52', 'blue', 8),
    s('path', { d: 'M94 70l14 18 14-18z' }, 'blue'),
    s('path', { d: rects([[90, 108, 22, 22], [116, 112, 22, 22]]) }, 'sky')
  ],
  'escalofrío': [
    ...person(80, 136, 'blue'),
    s('path', { d: 'M58 84q22-12 44 0l6 52H52z' }, 'purple', { accent: true }),
    s('path', { d: 'M48 64l-6 4 6 4-6 4M112 64l6 4-6 4 6 4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: rays(30, 36, 0, 10, 6) + rays(130, 40, 0, 10, 6) + rays(26, 104, 0, 8, 6) + rays(134, 110, 0, 8, 6), ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M74 82h12', ...SW(2) }, 'dark', { stroke: true })
  ],
  'eslabón': [
    s('ellipse', { cx: 38, cy: 92, rx: 24, ry: 13, transform: 'rotate(-20 80 80)', ...SW(8) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 122, cy: 92, rx: 24, ry: 13, transform: 'rotate(-20 80 80)', ...SW(8) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 80, cy: 92, rx: 26, ry: 15, transform: 'rotate(-20 80 80)', ...SW(10) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: sparkle(96, 40, 9) }, 'yellow')
  ],
  espanto: [
    backdrop('navy'),
    s('path', { d: 'M38 124V66q0-38 34-38t34 38v58l-8-8-9 8-8-8-9 8-8-8-9 8-8-8z' }, 'white', { accent: true }),
    s('path', { d: ells([[60, 64, 5, 8], [84, 64, 5, 8]]) }, 'black'),
    s('ellipse', { cx: 72, cy: 88, rx: 6, ry: 9 }, 'black'),
    s('circle', { cx: 126, cy: 98, r: 10 }, 'skin'),
    s('rect', { x: 116, y: 110, width: 20, height: 26, rx: 6 }, 'orange'),
    s('path', { d: 'M120 84l-3-8M126 84v-10M132 84l3-8', ...SW(3) }, 'yellow', { stroke: true })
  ],
  esparcimiento: [
    s('circle', { cx: 80, cy: 28, r: 11 }, 'yellow'),
    s('path', { d: 'M28 136V50M132 136V50', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: ells([[28, 44, 16, 12], [132, 44, 16, 12]]) }, 'green'),
    s('circle', { cx: 52, cy: 82, r: 9 }, 'skin'),
    s('path', { d: 'M58 92q30 12 56-4', ...SW(12) }, 'blue', { stroke: true }),
    s('path', { d: 'M28 74q52 56 104 0q-52 36-104 0z' }, 'orange', { accent: true })
  ],
  estribillo: [
    s('path', { d: 'M20 122h120M20 134h120', ...SW(2) }, 'gray', { stroke: true }),
    ...note(54, 100, 'blue'),
    ...note(96, 100, 'purple'),
    s('path', { d: 'M36 58q0-36 44-36t44 36', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M114 52l10 14 10-14z' }, 'orange')
  ],
  'evangelización': [
    s('path', { d: rays(90, 54, 20, 30, 8), ...SW(3) }, 'yellow', { stroke: true }),
    ...person(52, 136, 'brown', { accent: true }),
    s('path', { d: 'M64 100l20-32', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M76 48l14 4 14-4v18l-14 4-14-4z' }, 'black'),
    s('path', { d: busts([110, 134], 136, 18, 22) }, 'gray'),
    s('path', { d: dots([[110, 104], [134, 104]], 7) }, 'skin')
  ],
  falsamente: [
    ...face(66, 76, 40, 'skin', 'frown'),
    s('path', { d: 'M72 58q26-12 58 0q4 32-28 44q-32-8-30-44z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[90, 70], [114, 70]], 4) }, 'dark'),
    s('path', { d: 'M92 84q10 8 20 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 102l10 34', ...SW(5) }, 'brown', { stroke: true })
  ],
  fango: [
    s('path', { d: 'M66 26h28v76q10 6 12 16H62z' }, 'yellow'),
    s('path', { d: ells([[80, 116, 64, 22]]) }, 'brown', { accent: true }),
    s('path', { d: dots([[32, 86], [126, 82], [44, 72], [114, 68]], 5) }, 'brown'),
    s('path', { d: ells([[48, 120, 9, 3], [112, 126, 11, 3]]) }, 'dark'),
    s('path', { d: 'M66 40h28', ...SW(4) }, 'orange', { stroke: true })
  ],
  fisura: [
    s('rect', { x: 20, y: 20, width: 120, height: 116, rx: 4 }, 'gray'),
    s('path', { d: 'M20 50h120M20 80h120M20 110h120M56 20v30M110 50v30M44 80v30M116 110v26', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M84 20l-12 24 12 14-16 20 10 16-14 22 6 20h6l-2-20 14-22-8-16 16-20-10-14 10-24z' }, 'dark', { accent: true })
  ],
  florecer: [
    ground(),
    s('path', { d: leaflet(80, 112, 200, 30, 9) + leaflet(80, 102, -20, 30, 9) }, 'green'),
    ...flower(80, 58, 'pink'),
    s('path', { d: sparkle(40, 34, 9) + sparkle(122, 30, 7) + sparkle(126, 74, 6) }, 'yellow')
  ],
  fraccionamiento: [
    s('rect', { x: 16, y: 16, width: 128, height: 128, rx: 6 }, 'mint'),
    s('path', { d: 'M16 80h128M80 16v128', ...SW(10) }, 'gray', { stroke: true }),
    s('path', { d: rects([[26, 46, 16, 16], [54, 46, 16, 16], [90, 46, 16, 16], [118, 46, 16, 16], [26, 110, 16, 16], [54, 110, 16, 16], [90, 110, 16, 16], [118, 110, 16, 16]]) }, 'cream'),
    s('path', { d: [[34, 46], [62, 46], [98, 46], [126, 46], [34, 110], [62, 110], [98, 110], [126, 110]].map(([x, y]) => `M${x - 11} ${y}l11-12 11 12z`).join('') }, 'red', { accent: true }),
    s('path', { d: 'M48 20v52M112 20v52M48 88v52M112 88v52', ...SW(2, { 'stroke-dasharray': '4 4' }) }, 'green', { stroke: true })
  ],
  garante: [
    ...paper(22, 20, 66, 88),
    s('path', { d: 'M32 38h46M32 50h46M32 62h34', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M32 90q6-10 12 0t12 0', ...SW(3) }, 'blue', { stroke: true }),
    s('circle', { cx: 74, cy: 90, r: 10 }, 'red'),
    s('path', { d: 'M114 58l28 10v22q0 26-28 38q-28-12-28-38V68z' }, 'blue', { accent: true }),
    s('path', { d: 'M102 92l9 9 16-18', ...SW(5) }, 'white', { stroke: true })
  ],
  gema: [
    s('path', { d: 'M40 58l18-26h44l18 26-40 66z' }, 'purple', { accent: true }),
    s('path', { d: 'M40 58h80M58 32l10 26 12-26 12 26 10-26M68 58l12 66 12-66', ...SW(3) }, 'pink', { stroke: true }),
    s('path', { d: sparkle(128, 30, 10) + sparkle(36, 104, 7) }, 'yellow')
  ],
  'geológico': [
    s('rect', { x: 14, y: 50, width: 132, height: 86, rx: 6 }, 'gray'),
    s('path', { d: 'M14 62q33-8 66 0t66 0', ...SW(18) }, 'tan', { stroke: true }),
    s('path', { d: 'M14 86q33-8 66 0t66 0', ...SW(18) }, 'brown', { stroke: true }),
    s('path', { d: 'M14 110q33-8 66 0t66 0', ...SW(18) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M14 52q33-8 66 0t66 0', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M70 44l22-26', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 12l24 10-4 6-22-8z' }, 'dark'),
    s('path', { d: 'M44 106q4-8 10 0q-4 6-10 0', ...SW(2) }, 'cream', { stroke: true })
  ],
  girasol: [
    s('path', { d: 'M80 80v56', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 116, 200, 30, 10) + leaflet(80, 104, -20, 30, 10) }, 'green'),
    s('path', { d: Array.from({ length: 12 }, (_, i) => leaflet(80, 54, i * 30, 40, 9)).join('') }, 'yellow'),
    s('circle', { cx: 80, cy: 54, r: 18 }, 'brown', { accent: true }),
    s('path', { d: dots([[74, 48], [86, 48], [80, 56], [72, 60], [88, 60]], 2.5) }, 'dark')
  ],
  granero: [
    ground(),
    s('path', { d: 'M24 64l20-30h72l20 30v72H24z' }, 'red', { accent: true }),
    s('path', { d: 'M20 66l22-34h76l22 34', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 62, y: 92, width: 36, height: 44 }, 'brown'),
    s('path', { d: 'M62 92h36v44H62zM62 92l36 44', ...SW(3) }, 'white', { stroke: true }),
    s('rect', { x: 70, y: 50, width: 20, height: 20 }, 'yellow')
  ],
  hospitalario: [
    s('rect', { x: 18, y: 30, width: 56, height: 106, rx: 2 }, 'brown'),
    s('rect', { x: 26, y: 38, width: 40, height: 98 }, 'yellow'),
    ...person(104, 136, 'green', { accent: true }),
    s('path', { d: 'M90 100l-14-16M118 100l14-16', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(104, 34, 12) }, 'red')
  ],
  hoz: [
    s('path', { d: 'M116 136V62M130 136V72', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: ells([[116, 56, 5, 10], [130, 66, 5, 10]]) }, 'yellow'),
    s('path', { d: 'M56 112q-30-30-12-70q20-34 62-26q-36 8-48 38q-10 28 6 54z' }, 'gray', { accent: true }),
    s('path', { d: 'M58 114l-18 22', ...SW(10) }, 'brown', { stroke: true })
  ],
  inadmisible: [
    s('path', { d: 'M62 72V44a5 5 0 0 1 10 0v24V36a5 5 0 0 1 10 0v32V40a5 5 0 0 1 10 0v30V52a5 5 0 0 1 10 0v40q0 26-24 26q-18 0-26-18l-10-18q-2-8 6-8q6 2 10 8z' }, 'skin', { accent: true }),
    s('path', { d: ring(80, 78, 54), ...SW(10) }, 'red', { stroke: true }),
    s('path', { d: 'M42 40l76 76', ...SW(10) }, 'red', { stroke: true })
  ],
  incesto: [
    s('path', { d: 'M50 60v10M110 60v10M50 70h60M80 70v8M40 78h80M40 78v6M120 78v6', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: busts([50, 110], 60, 22, 20) }, 'blue'),
    s('path', { d: dots([[50, 30], [110, 30]], 9) }, 'skin'),
    s('path', { d: busts([40, 120], 130, 22, 20) }, 'green'),
    s('path', { d: dots([[40, 100], [120, 100]], 9) }, 'skin'),
    s('path', { d: heart(80, 108, 14) }, 'red', { accent: true }),
    s('path', { d: 'M64 92l32 32', ...SW(6) }, 'dark', { stroke: true })
  ],
  ineficiente: [
    s('path', { d: 'M24 18h40q8 0 8 8v8H60v-4H24z' }, 'gray'),
    s('path', { d: 'M66 38v34', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M44 72h56l-8 56H52z' }, 'orange', { accent: true }),
    s('path', { d: 'M50 96l-18 10M96 104l20 10M74 128v8', ...SW(4) }, 'blue', { stroke: true }),
    s('ellipse', { cx: 80, cy: 140, rx: 52, ry: 5 }, 'sky')
  ],
  'inmóvil': [
    ...person(80, 116, 'blue', { accent: true }),
    s('rect', { x: 52, y: 110, width: 56, height: 26, rx: 3 }, 'gray'),
    s('path', { d: 'M60 120h8M80 126h10M96 118h6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: rects([[106, 22, 10, 28], [124, 22, 10, 28]]) }, 'orange')
  ],
  langosta: [
    s('path', { d: 'M74 52q-20-30-44-38M86 52q20-30 44-38', ...SW(2) }, 'red', { stroke: true }),
    s('path', { d: 'M62 68L46 50M98 68l16-18M64 80l-14 6M64 90l-14 10M96 80l14 6M96 90l14 10', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: ells([[42, 40, 13, 17], [118, 40, 13, 17]]) }, 'red'),
    s('path', { d: 'M42 24v14M118 24v14', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: ells([[80, 74, 17, 24]]) }, 'red', { accent: true }),
    s('path', { d: 'M68 96h24l-2 10H70zM70 108h20l-2 10H72zM72 120h16l12 18H60z' }, 'red'),
    s('path', { d: dots([[74, 56], [86, 56]], 3) }, 'dark')
  ],
  'limítrofe': [
    s('path', { d: 'M20 30h56l-6 24 10 20-8 24 8 32H20z' }, 'green', { accent: true }),
    s('path', { d: 'M76 30h64v100H80l-8-32 8-24-10-20z' }, 'yellow'),
    s('path', { d: 'M76 30l-6 24 10 20-8 24 8 32', ...SW(4, { 'stroke-dasharray': '6 5' }) }, 'red', { stroke: true }),
    s('path', { d: dots([[44, 64], [110, 94]], 5) }, 'dark')
  ],
  liturgia: [
    backdrop('navy'),
    s('rect', { x: 22, y: 100, width: 116, height: 36, rx: 3 }, 'cream'),
    s('path', { d: 'M22 110h116', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: rects([[30, 56, 12, 44], [118, 56, 12, 44]]) }, 'white'),
    s('path', { d: drop(36, 46, 5) + drop(124, 46, 5) }, 'yellow'),
    s('path', { d: 'M64 52h32q0 26-16 28q-16-2-16-28zM78 80h4v14h10v6H68v-6h10z' }, 'yellow', { accent: true })
  ],
  lluvioso: [
    s('path', { d: ells([[56, 36, 22, 14], [84, 28, 24, 16], [108, 38, 20, 13]]) }, 'gray'),
    s('path', { d: drop(44, 64, 4) + drop(70, 60, 4) + drop(118, 64, 4) + drop(26, 96, 4) + drop(134, 98, 4) + drop(96, 58, 4) }, 'blue'),
    s('path', { d: 'M36 106q44-50 88 0z' }, 'red', { accent: true }),
    s('path', { d: 'M80 106v26q0 8-8 8', ...SW(4) }, 'dark', { stroke: true })
  ],
  'logístico': [
    s('path', { d: 'M24 38q30-20 56 0t56-10', ...SW(3, { 'stroke-dasharray': '5 5' }) }, 'gray', { stroke: true }),
    s('path', { d: dots([[24, 38], [136, 28]], 5) }, 'green'),
    s('rect', { x: 16, y: 58, width: 84, height: 52, rx: 4 }, 'orange', { accent: true }),
    s('path', { d: 'M100 74h24l16 18v18h-40z' }, 'blue'),
    s('path', { d: 'M106 80h16l10 12h-26z' }, 'sky'),
    s('path', { d: dots([[40, 112], [118, 112]], 11) }, 'dark')
  ],
  lux: [
    s('path', { d: 'M80 14v20', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 52h44l34 80H24z' }, 'yellow', { opacity: 0.5 }),
    s('path', { d: 'M58 52l10-18h24l10 18z' }, 'dark'),
    s('circle', { cx: 80, cy: 54, r: 7 }, 'yellow', { accent: true }),
    s('rect', { x: 62, y: 110, width: 36, height: 24, rx: 4 }, 'gray'),
    s('circle', { cx: 80, cy: 124, r: 8 }, 'white'),
    s('path', { d: 'M80 124l5-6', ...SW(2) }, 'red', { stroke: true })
  ],
  magnificar: [
    s('circle', { cx: 70, cy: 68, r: 46 }, 'sky'),
    s('circle', { cx: 70, cy: 50, r: 9 }, 'dark'),
    s('circle', { cx: 70, cy: 74, r: 22 }, 'red', { accent: true }),
    s('path', { d: 'M70 54v42', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[60, 68], [80, 68], [62, 86], [80, 86]], 4) }, 'dark'),
    s('path', { d: ring(70, 68, 46), ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M104 102l32 32', ...SW(12) }, 'dark', { stroke: true })
  ],
  manco: [
    ...person(80, 136, 'blue', { accent: true }),
    s('path', { d: 'M94 98l16 26', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M66 92l-8 10', ...SW(10) }, 'blue', { stroke: true }),
    s('circle', { cx: 70, cy: 102, r: 3 }, 'gray')
  ],
  mancomunidad: [
    s('path', { d: around(80, 80, 52, 5, -90).map(([x, y]) => `M80 80L${x} ${y}`).join(''), ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 18 }, 'blue', { accent: true }),
    s('path', { d: star(80, 80, 11) }, 'yellow'),
    s('path', { d: rects(around(80, 82, 52, 5, -90).map(([x, y]) => [x - 10, y - 4, 20, 16])) }, 'tan'),
    s('path', { d: around(80, 82, 52, 5, -90).map(([x, y]) => `M${x - 13} ${y - 4}l13-12 13 12z`).join('') }, 'red')
  ],
  manjar: [
    s('ellipse', { cx: 80, cy: 118, rx: 62, ry: 14 }, 'gray'),
    s('path', { d: 'M40 116q0-34 40-34t40 34z' }, 'brown', { accent: true }),
    s('path', { d: dots([[60, 104], [96, 100], [80, 92]], 5) }, 'green'),
    s('path', { d: 'M64 76q-6-10 0-20M92 76q-6-10 0-20', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: sparkle(126, 60, 10) + sparkle(32, 66, 8) + sparkle(110, 32, 6) }, 'yellow')
  ],
  manso: [
    backdrop('mint'),
    s('path', { d: 'M64 106v24M78 106v24M98 106v24M110 106v24', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: ells([[86, 92, 34, 22]]) + dots([[60, 80], [78, 72], [98, 72], [114, 82], [64, 106], [110, 104]], 12) }, 'white'),
    s('ellipse', { cx: 48, cy: 84, rx: 12, ry: 14 }, 'dark'),
    s('path', { d: 'M42 84q4 3 8 0', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M78 56q16-10 34 0v8H78z' }, 'skin', { accent: true }),
    s('path', { d: heart(124, 34, 9) }, 'pink')
  ],
  mascarilla: [
    s('circle', { cx: 80, cy: 74, r: 46 }, 'skin'),
    s('path', { d: 'M34 68q0-42 46-42t46 42q-20-24-46-24t-46 24z' }, 'brown'),
    s('path', { d: dots([[64, 64], [96, 64]], 4) }, 'dark'),
    s('path', { d: 'M48 82q-14 0-12-14M112 82q14 0 12-14', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 78h64v18q-32 26-64 0z' }, 'sky', { accent: true }),
    s('path', { d: 'M52 86h56M54 94h52', ...SW(2) }, 'blue', { stroke: true })
  ],
  mayorista: [
    s('rect', { x: 18, y: 126, width: 98, height: 10 }, 'brown'),
    s('path', { d: rects([[18, 94, 30, 32], [52, 94, 30, 32], [86, 94, 30, 32], [35, 60, 30, 32], [69, 60, 30, 32], [52, 26, 30, 32]]) }, 'tan', { accent: true }),
    s('path', { d: 'M33 94v32M67 94v32M101 94v32M50 60v32M84 60v32M67 26v32', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M128 40v92h16', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 132, cy: 134, r: 6 }, 'gray')
  ],
  medidor: [
    s('rect', { x: 30, y: 24, width: 100, height: 112, rx: 12 }, 'gray'),
    s('circle', { cx: 80, cy: 72, r: 36 }, 'white'),
    s('path', { d: halfRays(80, 72, 26, 34, 7), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 72l22-20', ...SW(4) }, 'red', { stroke: true }),
    s('circle', { cx: 80, cy: 72, r: 5 }, 'red', { accent: true }),
    s('rect', { x: 50, y: 114, width: 60, height: 12, rx: 3 }, 'dark')
  ],
  merengue: [
    s('ellipse', { cx: 80, cy: 126, rx: 60, ry: 10 }, 'gray'),
    s('path', { d: kiss(46, 124, 0.8) + kiss(114, 124, 0.8) + kiss(80, 126, 1.3) }, 'cream', { accent: true }),
    s('path', { d: kiss(46, 124, 0.8) + kiss(114, 124, 0.8) + kiss(80, 126, 1.3), ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M66 106q14 8 28 0M70 92q10 6 20 0', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: dots([[40, 110], [108, 108], [84, 76]], 3) }, 'pink')
  ],
  'metafísica': [
    backdrop('navy'),
    s('rect', { x: 52, y: 92, width: 40, height: 40, rx: 3 }, 'orange'),
    s('rect', { x: 72, y: 28, width: 48, height: 48, rx: 3, ...SW(3, { 'stroke-dasharray': '6 5' }) }, 'sky', { stroke: true }),
    s('rect', { x: 78, y: 34, width: 36, height: 36, rx: 3 }, 'purple', { accent: true, opacity: 0.8 }),
    s('path', { d: 'M92 92l4-16', ...SW(3, { 'stroke-dasharray': '3 4' }) }, 'sky', { stroke: true }),
    s('path', { d: sparkle(36, 40, 8) + sparkle(128, 104, 6) + sparkle(40, 74, 4) }, 'yellow')
  ],
  metamorfosis: [
    s('path', { d: 'M54 60h40', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: dots([[22, 124], [32, 120], [42, 124], [52, 120]], 7) }, 'green'),
    s('circle', { cx: 58, cy: 116, r: 7 }, 'dark'),
    s('ellipse', { cx: 74, cy: 80, rx: 9, ry: 18 }, 'brown'),
    s('path', { d: ells([[110, 44, 14, 18], [134, 44, 14, 18], [112, 70, 10, 10], [132, 70, 10, 10]]) }, 'orange', { accent: true }),
    s('path', { d: 'M122 36v40', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 106l10-10M92 70l10-10', ...SW(4) }, 'gray', { stroke: true })
  ],
  monedero: [
    s('path', { d: 'M40 70q4-26 34-26M120 70q-4-26-34-26', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[74, 42], [86, 42]], 6) }, 'yellow'),
    s('path', { d: 'M30 70h100q6 0 4 8l-8 50q-2 8-10 8H44q-8 0-10-8l-8-50q-2-8 4-8z' }, 'pink', { accent: true }),
    s('path', { d: 'M28 72h104', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[118, 124], [136, 116]], 10) }, 'orange')
  ],
  'morfología': [
    s('rect', { x: 18, y: 66, width: 30, height: 30, rx: 4 }, 'red'),
    s('rect', { x: 56, y: 58, width: 48, height: 46, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 112, y: 66, width: 30, height: 30, rx: 4 }, 'green'),
    s('path', { d: 'M48 81h8M104 81h8', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 116v8h124v-8M18 48v-8h124v8', ...SW(4) }, 'gray', { stroke: true })
  ],
  naturar: [
    ground(),
    s('rect', { x: 40, y: 44, width: 80, height: 92, rx: 2 }, 'gray'),
    s('path', { d: grid(50, 56, 3, 4, 14, 12, 22, 20) }, 'sky'),
    s('path', { d: dots([[44, 40], [58, 36], [72, 40], [88, 36], [102, 40], [116, 38]], 9) }, 'green', { accent: true }),
    s('path', { d: 'M40 50q-10 20 0 40t0 40M120 50q10 20 0 40t0 40', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(36, 70, 200, 14, 5) + leaflet(38, 104, 200, 14, 5) + leaflet(124, 80, -20, 14, 5) + leaflet(122, 116, -20, 14, 5) }, 'green')
  ],
  obsesivo: [
    s('circle', { cx: 80, cy: 80, r: 34 }, 'skin'),
    s('path', { d: spiral(62, 74) + spiral(88, 74), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M70 96h20', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: around(80, 84, 50, 8, -90).map(([x, y]) => heart(x, y - 6, 9)).join('') }, 'red', { accent: true })
  ],
  obsoleto: [
    s('rect', { x: 30, y: 30, width: 100, height: 100, rx: 6 }, 'dark', { accent: true }),
    s('rect', { x: 52, y: 30, width: 50, height: 32 }, 'gray'),
    s('rect', { x: 82, y: 34, width: 12, height: 24 }, 'dark'),
    s('rect', { x: 44, y: 78, width: 72, height: 44, rx: 3 }, 'white'),
    s('path', { d: 'M130 30H104M130 30v28M130 30L108 52M112 30q4 10 18 4M120 30q0 14 10 14M108 40q12 4 22-2', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M20 140h14M126 140h14', ...SW(3) }, 'gray', { stroke: true })
  ],
  ocupacional: [
    ground(),
    ...person(66, 136, 'orange', { accent: true }),
    s('path', { d: 'M52 76a14 14 0 0 1 28 0z' }, 'yellow'),
    s('path', { d: 'M48 76h36', ...SW(4) }, 'yellow', { stroke: true }),
    s('rect', { x: 92, y: 104, width: 40, height: 30, rx: 4 }, 'brown'),
    s('path', { d: 'M104 104v-8h16v8', ...SW(4) }, 'dark', { stroke: true }),
    ...gear(118, 44, 12, 9, 'gray')
  ],
  otrora: [
    s('circle', { cx: 80, cy: 80, r: 50 }, 'cream'),
    s('path', { d: ring(80, 80, 50), ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 80V50M80 80l-18 12', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 30a62 62 0 0 0-16 74', ...SW(6) }, 'purple', { stroke: true }),
    s('path', { d: 'M26 22l18 6-10 14z' }, 'purple', { accent: true }),
    s('path', { d: halfRays(80, 80, 40, 46, 5), ...SW(3) }, 'tan', { stroke: true })
  ],
  pacificar: [
    backdrop('sky'),
    s('path', { d: 'M30 90q20-40 70-30l20-16 14 6-14 6q4 40-40 50q-34 4-50-16z' }, 'white', { accent: true }),
    s('path', { d: 'M60 72q20-30 50-30q-10 26-40 40z' }, 'white'),
    s('path', { d: 'M60 72q20-30 50-30q-10 26-40 40z', ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 124, cy: 50, r: 2.5 }, 'dark'),
    s('path', { d: 'M134 56l-8 2', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M132 60q4 14 0 26', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: leaflet(132, 66, 20, 14, 4) + leaflet(132, 76, 160, 14, 4) + leaflet(132, 84, 30, 12, 4) }, 'green')
  ],
  palpable: [
    s('rect', { x: 28, y: 86, width: 72, height: 50, rx: 6 }, 'orange', { accent: true }),
    s('path', { d: dots([[40, 98], [56, 98], [72, 98], [88, 98], [48, 112], [64, 112], [80, 112], [40, 126], [56, 126], [72, 126], [88, 126]], 3) }, 'brown'),
    s('path', { d: 'M78 86V42a7 7 0 0 1 14 0v26h26q10 0 10 12v20q0 14-14 14H96z' }, 'skin'),
    s('path', { d: 'M62 62q-8 10 0 20M54 54q-14 18 0 36', ...SW(3) }, 'blue', { stroke: true })
  ],
  papal: [
    backdrop('sky'),
    s('path', { d: 'M50 132V64q0-30 30-48q30 18 30 48v68z' }, 'cream'),
    s('path', { d: 'M50 132V64q0-30 30-48q30 18 30 48v68z', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M80 18v114M50 104h60', ...SW(8) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M62 132v12M98 132v12', ...SW(6) }, 'red', { stroke: true })
  ],
  paranormal: [
    backdrop('navy'),
    s('rect', { x: 36, y: 112, width: 88, height: 8, rx: 2 }, 'brown'),
    s('path', { d: 'M44 120v16M116 120v16', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 46, y: 50, width: 34, height: 26, rx: 3, transform: 'rotate(-15 63 63)' }, 'red', { accent: true }),
    s('path', { d: 'M94 40h22l-3 22h-16z' }, 'white'),
    s('path', { d: 'M40 96q8-6 16 0t16 0 16 0 16 0 16 0', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: sparkle(130, 30, 7) + sparkle(28, 36, 6) }, 'mint')
  ],
  patrio: [
    ground(),
    s('path', { d: 'M100 136V20', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 22q20-8 40 0v30q-20-8-40 0z' }, 'green', { accent: true }),
    s('path', { d: 'M100 36q20-8 40 0', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M18 92l32-30 32 30z' }, 'red'),
    s('rect', { x: 26, y: 92, width: 48, height: 44 }, 'tan'),
    s('path', { d: heart(50, 108, 12) }, 'red')
  ],
  pelar: [
    s('circle', { cx: 70, cy: 64, r: 36 }, 'cream'),
    s('path', { d: 'M70 28q36 0 36 36', ...SW(10) }, 'red', { stroke: true }),
    s('path', { d: 'M106 64q2 20-14 26q-24 10-16 26t30 24', ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M70 28v-10', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 116l30-18', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M68 100l40-26 4 6-38 26z' }, 'gray')
  ],
  pensionista: [
    ground(),
    ...person(64, 136, 'purple', { accent: true }),
    s('path', { d: 'M52 74q12-12 24 0', ...SW(5) }, 'white', { stroke: true, lineColor: 'gray' }),
    s('path', { d: 'M80 100l14 6v30M88 106q0-8 8-6', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: ells([[122, 128, 14, 6], [122, 118, 14, 6], [122, 108, 14, 6]]) }, 'yellow'),
    s('path', { d: ells([[122, 128, 14, 6], [122, 118, 14, 6], [122, 108, 14, 6]]), ...SW(2) }, 'orange', { stroke: true })
  ],
  pita: [
    s('path', { d: 'M24 108a56 56 0 0 1 112 0z' }, 'tan', { accent: true }),
    s('path', { d: 'M36 100q44-26 88 0', ...SW(8) }, 'green', { stroke: true }),
    s('path', { d: dots([[56, 94], [80, 86], [104, 94]], 6) }, 'red'),
    s('path', { d: 'M24 108h112', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: dots([[58, 70], [80, 62], [100, 70]], 2.5) }, 'brown')
  ],
  placentero: [
    s('circle', { cx: 120, cy: 34, r: 14 }, 'yellow'),
    ...face(70, 78, 40, 'skin', 'smile'),
    s('path', { d: ells([[48, 90, 7, 4], [92, 90, 7, 4]]) }, 'pink', { accent: true }),
    s('path', { d: 'M54 70q4-4 8 0M78 70q4-4 8 0', ...SW(4) }, 'skin', { stroke: true }),
    ...flower(124, 112, 'pink').slice(1)
  ],
  polen: [
    ...flower(54, 92, 'purple'),
    s('path', { d: dots([[78, 78], [84, 70], [92, 76], [74, 66], [86, 60]], 3) }, 'yellow'),
    s('path', { d: ells([[114, 52, 16, 11]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M106 44v16M116 42v20M126 46v12', ...SW(4) }, 'black', { stroke: true }),
    s('path', { d: ells([[108, 38, 8, 6], [122, 36, 8, 6]]) }, 'sky')
  ],
  posicionar: [
    s('rect', { x: 20, y: 88, width: 120, height: 48, rx: 4 }, 'mint'),
    s('rect', { x: 84, y: 98, width: 34, height: 28, rx: 3, ...SW(3, { 'stroke-dasharray': '5 4' }) }, 'green', { stroke: true }),
    s('rect', { x: 84, y: 36, width: 34, height: 28, rx: 3 }, 'blue', { accent: true }),
    s('path', { d: 'M76 36q4-14 16-12M126 36q-4-14-16-12', ...SW(6) }, 'skin', { stroke: true }),
    arrow('M101 70v18'),
    s('path', { d: 'M42 52l8 8 16-18', ...SW(5) }, 'green', { stroke: true })
  ],
  posponer: [
    s('rect', { x: 20, y: 30, width: 120, height: 104, rx: 8 }, 'white'),
    outline({ x: 20, y: 30, width: 120, height: 104, rx: 8 }),
    s('path', { d: 'M20 38q0-8 8-8h104q8 0 8 8v14H20z' }, 'red'),
    s('path', { d: rects([[32, 62, 18, 14], [58, 62, 18, 14], [84, 62, 18, 14], [110, 62, 18, 14], [58, 84, 18, 14], [84, 84, 18, 14], [110, 84, 18, 14], [32, 106, 18, 14], [58, 106, 18, 14], [84, 106, 18, 14]]) }, 'gray'),
    s('rect', { x: 32, y: 84, width: 18, height: 14 }, 'blue'),
    s('rect', { x: 110, y: 106, width: 18, height: 14 }, 'orange', { accent: true }),
    s('path', { d: 'M44 82q40-30 72 18', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M108 96l10 8 2-14z' }, 'orange')
  ],
  premiar: [
    s('path', { d: 'M52 26h56v20q0 34-28 38q-28-4-28-38z' }, 'yellow', { accent: true }),
    s('path', { d: 'M52 34q-20 0-18 16t22 20M108 34q20 0 18 16t-22 20', ...SW(6) }, 'yellow', { stroke: true }),
    s('rect', { x: 74, y: 84, width: 12, height: 20 }, 'orange'),
    s('rect', { x: 56, y: 104, width: 48, height: 14, rx: 3 }, 'orange'),
    s('rect', { x: 48, y: 118, width: 64, height: 18, rx: 3 }, 'brown'),
    s('path', { d: star(80, 50, 12) }, 'white')
  ],
  prepago: [
    s('rect', { x: 70, y: 26, width: 60, height: 108, rx: 10 }, 'dark'),
    s('rect', { x: 76, y: 38, width: 48, height: 84, rx: 4 }, 'sky'),
    s('path', { d: 'M88 62h24v40H88z' }, 'green', { accent: true }),
    s('path', { d: 'M100 70v24M88 82h24', ...SW(4) }, 'white', { stroke: true }),
    s('circle', { cx: 36, cy: 82, r: 18 }, 'yellow'),
    s('path', { d: ring(36, 82, 12), ...SW(3) }, 'orange', { stroke: true }),
    arrow('M56 82h10', 'orange', 5)
  ],
  'preámbulo': [
    s('rect', { x: 14, y: 14, width: 132, height: 14 }, 'red'),
    s('path', { d: 'M14 28h44q-10 50-6 108H14z' }, 'red', { accent: true }),
    s('path', { d: 'M146 28h-44q10 50 6 108h40z' }, 'red'),
    s('path', { d: 'M20 136h120', ...SW(6) }, 'brown', { stroke: true }),
    ...person(80, 132, 'navy', { h: 34, w: 22, r: 10 }),
    s('path', { d: 'M90 112l8-14', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 28l20 40 20-40z' }, 'yellow', { opacity: 0.5 })
  ],
  'psíquico': [
    s('path', { d: ring(80, 76, 40) + ring(80, 76, 54), ...SW(3) }, 'purple', { stroke: true }),
    s('path', { d: ells([[70, 76, 22, 20], [92, 72, 20, 20]]) }, 'pink', { accent: true }),
    s('path', { d: 'M56 74q6-8 12 0t12 0 12 0M64 86q6-6 12 0t12 0', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: sparkle(30, 30, 8) + sparkle(130, 128, 8) + sparkle(132, 26, 6) }, 'yellow')
  ],
  rada: [
    s('path', { d: 'M14 40q40 0 46 40t40 30 46-20v56H14z' }, 'blue'),
    s('path', { d: 'M14 14h132v30q-30 0-44 10t-42 20q-10-30-46-34z' }, 'green'),
    s('path', { d: 'M70 110h50l-8 12H78z' }, 'red', { accent: true }),
    s('path', { d: 'M94 110V82l18 22z' }, 'white'),
    s('path', { d: 'M78 122l-6 14', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 108v20M20 116h16M20 124q8 10 16 0', ...SW(4) }, 'gray', { stroke: true })
  ],
  reafirmar: [
    s('circle', { cx: 80, cy: 80, r: 50 }, 'green', { accent: true }),
    s('path', { d: 'M46 80l14 14 26-30M70 94l6 6 32-38', ...SW(8) }, 'white', { stroke: true }),
    s('path', { d: 'M128 40a60 60 0 0 1 6 50', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M126 84l8 14 8-14z' }, 'orange')
  ],
  reanudar: [
    s('path', { d: 'M14 96q30 0 46-12M146 96q-30 0-46-12', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M60 84q20-20 40 0q-20 20-40 0z', ...SW(8) }, 'tan', { stroke: true }),
    s('circle', { cx: 80, cy: 84, r: 9 }, 'brown', { accent: true }),
    s('circle', { cx: 80, cy: 40, r: 18 }, 'green'),
    s('path', { d: 'M74 30l14 10-14 10z' }, 'white')
  ],
  recluso: [
    ...person(64, 120, 'orange', { accent: true }),
    s('path', { d: 'M50 84h28M50 96h28M50 108h28', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M70 120l20 10q12 0 16 4', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 112, cy: 126, r: 12 }, 'black'),
    ground()
  ],
  relajante: [
    s('circle', { cx: 60, cy: 72, r: 12 }, 'skin'),
    s('path', { d: 'M54 72q3 3 6 0M62 72q3 3 6 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M22 84h116v14q0 30-30 30H52q-30 0-30-30z' }, 'white'),
    s('path', { d: 'M22 84h116v14q0 30-30 30H52q-30 0-30-30z', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: dots([[40, 82], [56, 78], [76, 82], [96, 80], [114, 82], [130, 78]], 8) }, 'sky', { accent: true }),
    s('path', { d: 'M48 128l-6 10M112 128l6 10', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 118, y: 46, width: 12, height: 22, rx: 2 }, 'cream'),
    s('path', { d: drop(124, 38, 4) }, 'orange')
  ],
  resurgimiento: [
    s('circle', { cx: 80, cy: 60, r: 30 }, 'yellow'),
    s('rect', { x: 14, y: 90, width: 132, height: 46 }, 'brown'),
    s('path', { d: 'M54 90h52v-14H54z' }, 'tan'),
    s('path', { d: 'M80 76V44', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 52, 210, 26, 9) + leaflet(80, 46, -30, 26, 9) }, 'green', { accent: true }),
    s('path', { d: 'M24 106h20M110 118h24M60 124h16', ...SW(3) }, 'dark', { stroke: true })
  ],
  samba: [
    ...lady(70, 134, 'orange', { accent: true }),
    s('path', { d: 'M60 76l-20-20M80 76l20-20', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M54 52q16-24 32 0', ...SW(6) }, 'pink', { stroke: true }),
    ...note(118, 106, 'purple'),
    s('path', { d: dots([[30, 30], [128, 34], [24, 100], [136, 70]], 4) }, 'green')
  ],
  sedimento: [
    s('path', { d: 'M44 30h72v96q0 10-10 10H54q-10 0-10-10z' }, 'sky'),
    s('path', { d: 'M44 108h72v18q0 10-10 10H54q-10 0-10-10z' }, 'brown', { accent: true }),
    s('path', { d: 'M44 96h72v12H44z' }, 'tan'),
    s('path', { d: dots([[62, 60], [90, 70], [76, 84], [100, 52]], 3) }, 'brown'),
    s('path', { d: 'M44 30v96q0 10 10 10h52q10 0 10-10V30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 54v24M74 72l6 8 6-8', ...SW(2) }, 'dark', { stroke: true })
  ],
  selecto: [
    s('path', { d: 'M60 92l-14 46 18-10 10 16 8-48zM100 92l14 46-18-10-10 16-8-48z' }, 'blue'),
    s('path', { d: burst(80, 70, 46, 38, 18) }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 70, r: 30 }, 'yellow'),
    s('path', { d: star(80, 70, 18) }, 'orange')
  ],
  sellar: [
    ...paper(24, 82, 112, 56),
    s('path', { d: ring(96, 112, 14), ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: dots([[96, 112]], 6) }, 'red'),
    s('rect', { x: 46, y: 70, width: 40, height: 14, rx: 3 }, 'red', { accent: true }),
    s('rect', { x: 58, y: 44, width: 16, height: 26 }, 'brown'),
    s('circle', { cx: 66, cy: 34, r: 14 }, 'brown')
  ],
  sito: [
    ground(),
    s('path', { d: 'M40 100l40-34 40 34z' }, 'brown'),
    s('rect', { x: 50, y: 100, width: 60, height: 36 }, 'tan'),
    s('rect', { x: 72, y: 112, width: 16, height: 24 }, 'brown'),
    s('path', { d: 'M80 70q-22-22-22-36a22 22 0 0 1 44 0q0 14-22 36z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 34, r: 8 }, 'white')
  ],
  socializar: [
    ...person(36, 136, 'blue', { h: 40, w: 24, r: 11 }),
    ...person(80, 136, 'green', { h: 40, w: 24, r: 11, accent: true }),
    ...person(124, 136, 'orange', { h: 40, w: 24, r: 11 }),
    s('path', { d: bubble(20, 18, 46, 30) + bubble(94, 22, 46, 30) }, 'sky'),
    s('path', { d: heart(43, 28, 8) + heart(117, 32, 8) }, 'pink')
  ],
  solvencia: [
    s('path', { d: ells([[76, 92, 46, 34]]) }, 'pink', { accent: true }),
    s('path', { d: 'M48 120v14M100 120v14', ...SW(10) }, 'pink', { stroke: true }),
    s('path', { d: 'M30 82l-12-4v20l12-4z' }, 'pink'),
    s('rect', { x: 66, y: 58, width: 22, height: 5, rx: 2 }, 'dark'),
    s('circle', { cx: 50, cy: 82, r: 3 }, 'dark'),
    s('circle', { cx: 77, cy: 38, r: 12 }, 'yellow'),
    s('path', { d: 'M114 30l26 8v14q0 18-26 26q-26-8-26-26V38z' }, 'green'),
    s('path', { d: 'M104 54l8 8 14-14', ...SW(4) }, 'white', { stroke: true })
  ],
  sustrato: [
    s('path', { d: 'M36 50h88l-10 86H46z' }, 'orange'),
    s('path', { d: 'M39 70h82l-7 66H46z' }, 'brown', { accent: true }),
    s('path', { d: dots([[54, 122], [70, 126], [88, 122], [104, 126], [62, 112], [96, 112]], 5) }, 'gray'),
    s('path', { d: 'M80 70V36', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 44, 210, 24, 8) + leaflet(80, 40, -30, 24, 8) }, 'green'),
    s('path', { d: 'M80 70l-10 14M80 70l8 16M80 76v14', ...SW(2) }, 'tan', { stroke: true })
  ],
  taekwondo: [
    ground(),
    s('path', { d: 'M62 132l12-42', ...SW(10) }, 'white', { stroke: true, lineColor: 'gray' }),
    s('path', { d: 'M74 90l52-30', ...SW(10) }, 'white', { stroke: true, lineColor: 'gray' }),
    s('rect', { x: 58, y: 58, width: 26, height: 40, rx: 8, transform: 'rotate(-20 71 78)' }, 'white'),
    s('rect', { x: 58, y: 58, width: 26, height: 40, rx: 8, transform: 'rotate(-20 71 78)', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 86l26-10', ...SW(5) }, 'black', { stroke: true, accent: true }),
    s('circle', { cx: 58, cy: 46, r: 12 }, 'skin'),
    s('path', { d: 'M126 60l10-6M74 72l-24-8', ...SW(6) }, 'skin', { stroke: true })
  ],
  'testículo': [
    s('path', { d: 'M70 40q-24 10-26 50M90 40q24 10 26 50', ...SW(5) }, 'pink', { stroke: true }),
    s('path', { d: ells([[56, 104, 20, 26], [104, 104, 20, 26]]) }, 'pink', { accent: true }),
    s('path', { d: ells([[56, 104, 10, 14], [104, 104, 10, 14]]) }, 'red'),
    s('path', { d: 'M70 40h20', ...SW(5) }, 'pink', { stroke: true })
  ],
  'titulación': [
    s('rect', { x: 20, y: 76, width: 100, height: 34, rx: 17 }, 'cream'),
    s('rect', { x: 20, y: 76, width: 100, height: 34, rx: 17, ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M70 76v34', ...SW(8) }, 'red', { stroke: true }),
    s('path', { d: 'M66 110l-6 18M74 110l6 18', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M80 22l50 18-50 18-50-18z' }, 'black', { accent: true }),
    s('path', { d: 'M54 48v16q26 12 52 0V48z' }, 'black'),
    s('path', { d: 'M126 42v24', ...SW(3) }, 'yellow', { stroke: true })
  ],
  torpeza: [
    ground(),
    ...lean(66, 134, 40, 'blue', { accent: true }),
    s('path', { d: 'M40 136h28', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 40h20l-3 22h-14z', transform: 'rotate(30 120 50)' }, 'white'),
    s('path', { d: 'M110 40h20l-3 22h-14z', transform: 'rotate(30 120 50)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: drop(128, 76, 4) + drop(140, 84, 3) }, 'brown'),
    s('path', { d: 'M30 112l-8-4M34 100l-8-8', ...SW(3) }, 'orange', { stroke: true })
  ],
  totalitario: [
    s('path', { d: 'M28 44q52-40 104 0q-52 40-104 0z' }, 'white'),
    s('path', { d: 'M28 44q52-40 104 0q-52 40-104 0z', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 44, r: 14 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 44, r: 6 }, 'black'),
    s('path', { d: busts([28, 54, 80, 106, 132], 136, 18, 18) }, 'gray'),
    s('path', { d: dots([[28, 110], [54, 110], [80, 110], [106, 110], [132, 110]], 7) }, 'gray'),
    s('path', { d: 'M80 62l-50 40M80 62l50 40', ...SW(2, { 'stroke-dasharray': '4 4' }) }, 'red', { stroke: true })
  ],
  veda: [
    s('path', { d: 'M40 80q30-30 70-4l18-14v36l-18-14q-40 26-70-4z' }, 'blue', { accent: true }),
    s('circle', { cx: 56, cy: 74, r: 4 }, 'white'),
    s('path', { d: ring(80, 80, 58), ...SW(10) }, 'red', { stroke: true }),
    s('path', { d: 'M40 40l80 80', ...SW(10) }, 'red', { stroke: true })
  ],
  yen: [
    s('rect', { x: 16, y: 34, width: 96, height: 56, rx: 4 }, 'mint'),
    s('rect', { x: 16, y: 34, width: 96, height: 56, rx: 4, ...SW(3) }, 'green', { stroke: true }),
    s('circle', { cx: 64, cy: 62, r: 14 }, 'green'),
    s('circle', { cx: 104, cy: 104, r: 34 }, 'yellow', { accent: true }),
    s('path', { d: ring(104, 104, 26), ...SW(3) }, 'orange', { stroke: true }),
    s('circle', { cx: 104, cy: 104, r: 9 }, 'white')
  ],
  abogar: [
    s('path', { d: 'M40 96h40l-4 40H44z' }, 'brown'),
    s('circle', { cx: 60, cy: 52, r: 12 }, 'skin'),
    s('rect', { x: 48, y: 66, width: 24, height: 30, rx: 8 }, 'navy', { accent: true }),
    s('path', { d: 'M70 74l14-24', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M118 40v62M100 102h36M96 52h44M96 52l-8 22M96 52l8 22M140 52l-8 22M140 52l8 22', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 74q10 10 20 0zM130 74q10 10 20 0z' }, 'yellow')
  ],
  abolir: [
    s('path', { d: 'M24 26h50l-6 20 8 18-8 22 8 18-6 22H24z', transform: 'rotate(-8 50 80)' }, 'white'),
    s('path', { d: 'M24 26h50l-6 20 8 18-8 22 8 18-6 22H24z', transform: 'rotate(-8 50 80)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 26h50v100H86l6-22-8-18 8-22-8-18z', transform: 'rotate(8 110 80)' }, 'white'),
    s('path', { d: 'M86 26h50v100H86l6-22-8-18 8-22-8-18z', transform: 'rotate(8 110 80)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 50h26M34 64h22M100 56h26M100 70h22', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 118, cy: 104, r: 10 }, 'red', { accent: true })
  ],
  agotador: [
    ...lean(56, 136, 18, 'orange', { accent: true }),
    s('path', { d: 'M42 78l-8 26M80 92l6 26', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: drop(92, 52, 4) + drop(100, 66, 3) }, 'sky'),
    s('rect', { x: 104, y: 30, width: 36, height: 60, rx: 5 }, 'white'),
    outline({ x: 104, y: 30, width: 36, height: 60, rx: 5 }, 'dark', 4),
    s('rect', { x: 116, y: 22, width: 12, height: 8, rx: 2 }, 'dark'),
    s('rect', { x: 110, y: 76, width: 24, height: 9, rx: 2 }, 'red')
  ],
  aja: [
    s('path', { d: 'M40 136L92 44', ...SW(9) }, 'brown', { stroke: true }),
    s('path', { d: 'M82 46q18-22 50-10l-4 10q-26-8-40 8z' }, 'gray', { accent: true }),
    s('rect', { x: 20, y: 118, width: 120, height: 18, rx: 3 }, 'tan'),
    s('path', { d: 'M110 108q6-10 14-8M124 112q8-6 14-2', ...SW(3) }, 'tan', { stroke: true })
  ],
  'albedrío': [
    s('path', { d: 'M80 136V96L40 30M80 96l40-66', ...SW(16) }, 'tan', { stroke: true }),
    ...person(80, 136, 'purple', { h: 30, w: 20, r: 9, accent: true }),
    s('path', { d: 'M34 44l-6-20 20 4zM126 44l6-20-20 4z' }, 'orange'),
    s('circle', { cx: 34, cy: 60, r: 8 }, 'green'),
    s('circle', { cx: 126, cy: 60, r: 8 }, 'blue')
  ],
  alcaide: [
    s('path', { d: 'M90 26v110M106 26v110M122 26v110M138 26v110M84 26h60', ...SW(5) }, 'gray', { stroke: true }),
    ...person(48, 136, 'navy', { accent: true }),
    s('path', { d: 'M34 68h28l-2-8H36z' }, 'black'),
    s('path', { d: 'M62 104l10-6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: ring(76, 106, 7) + 'M80 112l4 14 4-2M74 112v14h4', ...SW(3) }, 'yellow', { stroke: true })
  ],
  anunciante: [
    s('path', { d: 'M52 104v32M108 104v32', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 20, y: 30, width: 120, height: 74, rx: 4 }, 'yellow', { accent: true }),
    s('rect', { x: 28, y: 38, width: 54, height: 58, rx: 3 }, 'white'),
    s('path', { d: 'M42 62h8l18-12v40l-18-12h-8z' }, 'red'),
    s('path', { d: 'M90 50h40M90 64h40M90 78h28', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: star(124, 86, 6) }, 'red')
  ],
  apropiar: [
    s('path', { d: 'M24 90h72v46H24z' }, 'brown'),
    s('path', { d: 'M24 90l-6-14h84l-6 14z' }, 'tan'),
    s('path', { d: dots([[40, 86], [58, 82], [76, 86]], 8) }, 'yellow'),
    s('path', { d: 'M146 40H112q-14 0-24 10l-12 14', ...SW(12) }, 'skin', { stroke: true }),
    s('rect', { x: 120, y: 30, width: 26, height: 22, rx: 3 }, 'black', { accent: true }),
    s('circle', { cx: 74, cy: 70, r: 8 }, 'yellow'),
    s('path', { d: 'M100 76l14 8M92 88l12 12', ...SW(3) }, 'gray', { stroke: true })
  ],
  asomar: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 8 }, 'tan'),
    s('rect', { x: 40, y: 40, width: 80, height: 70 }, 'dark'),
    s('circle', { cx: 80, cy: 72, r: 16 }, 'skin'),
    s('path', { d: 'M54 110q2-20 26-22q24 2 26 22z' }, 'green', { accent: true }),
    s('path', { d: 'M32 110h96', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: dots([[72, 70], [88, 70]], 2.5) }, 'dark'),
    s('path', { d: 'M30 40V22h36v18M94 40V22h36v18', ...SW(4) }, 'red', { stroke: true })
  ],
  'audífonos': [
    s('path', { d: 'M36 96V76q0-46 44-46t44 46v20', ...SW(10) }, 'dark', { stroke: true }),
    s('rect', { x: 24, y: 86, width: 28, height: 42, rx: 12 }, 'red', { accent: true }),
    s('rect', { x: 108, y: 86, width: 28, height: 42, rx: 12 }, 'red'),
    s('path', { d: 'M62 104q4-6 0-12M98 104q-4-6 0-12', ...SW(3) }, 'gray', { stroke: true })
  ],
  balboa: [
    s('circle', { cx: 80, cy: 80, r: 52 }, 'gray', { accent: true }),
    s('path', { d: ring(80, 80, 44), ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M52 94h56l-10 14H62z' }, 'dark'),
    s('path', { d: 'M78 92V50l-22 38zM82 92V54l18 34z' }, 'white'),
    s('path', { d: 'M48 116q16-6 32 0t32 0', ...SW(3) }, 'blue', { stroke: true })
  ],
  barbado: [
    s('circle', { cx: 80, cy: 66, r: 38 }, 'skin'),
    s('path', { d: 'M42 66q0 70 38 74q38-4 38-74q-10 24-38 24t-38-24z' }, 'brown', { accent: true }),
    s('path', { d: 'M44 50q0-30 36-30t36 30q-14-14-36-14t-36 14z' }, 'brown'),
    s('path', { d: dots([[66, 60], [94, 60]], 4) }, 'dark'),
    s('path', { d: 'M68 86q12 6 24 0', ...SW(4) }, 'pink', { stroke: true })
  ],
  becerro: [
    s('path', { d: 'M46 96v34M60 98v32M94 98v32M106 96v34', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: ells([[76, 86, 36, 18]]) }, 'brown', { accent: true }),
    s('path', { d: ells([[62, 82, 10, 7], [92, 92, 8, 6]]) }, 'white'),
    s('path', { d: 'M40 80q-12 0-12 12', ...SW(3) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 120, cy: 64, rx: 14, ry: 16 }, 'brown'),
    s('path', { d: ells([[104, 56, 8, 4], [136, 56, 8, 4]]) }, 'tan'),
    s('ellipse', { cx: 122, cy: 76, rx: 9, ry: 6 }, 'pink'),
    s('circle', { cx: 118, cy: 62, r: 2.5 }, 'dark')
  ],
  beisbol: [
    s('path', { d: 'M30 132L112 34', ...SW(10) }, 'tan', { stroke: true }),
    s('path', { d: 'M90 60L116 30', ...SW(16) }, 'brown', { stroke: true }),
    s('circle', { cx: 58, cy: 56, r: 24 }, 'white', { accent: true }),
    s('path', { d: ring(58, 56, 24), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 40q10 16 0 32M76 40q-10 16 0 32', ...SW(3) }, 'red', { stroke: true })
  ],
  bibliotecario: [
    s('rect', { x: 14, y: 20, width: 132, height: 76, rx: 3 }, 'brown'),
    s('path', { d: rects([[20, 26, 8, 30], [30, 30, 8, 26], [40, 26, 8, 30], [104, 26, 8, 30], [114, 28, 8, 28], [124, 26, 8, 30], [20, 62, 8, 30], [30, 64, 8, 28], [114, 62, 8, 30], [124, 64, 8, 28]]) }, 'red'),
    s('path', { d: rects([[50, 28, 8, 28], [94, 62, 8, 30], [134, 28, 8, 28], [40, 62, 8, 30]]) }, 'blue'),
    ...person(80, 136, 'green', { accent: true }),
    s('path', { d: 'M66 98l14 6 14-6v14l-14 6-14-6z' }, 'yellow'),
    s('path', { d: 'M70 76h20', ...SW(3) }, 'dark', { stroke: true })
  ],
  bilis: [
    s('path', { d: 'M20 60q40-30 120-10q4 30-30 50q-40 20-80 0q-14-14-10-40z' }, 'brown'),
    s('path', { d: 'M74 92q-16 10-8 28q10 16 24 4q8-12-4-30z' }, 'green', { accent: true }),
    s('path', { d: 'M86 94q10-10 20-4', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: drop(110, 118, 6) }, 'green')
  ],
  bosta: [
    ground(),
    s('path', { d: 'M36 134q-4-18 18-20q-2-16 18-16q4-14 20-8q16 4 12 18q20 2 20 26z' }, 'brown', { accent: true }),
    s('path', { d: 'M52 116q20 6 40 0M60 102q14 4 26 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 66q8-10 0-20t0-20M96 66q8-10 0-20', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: dots([[118, 54], [40, 70]], 4) }, 'dark'),
    s('path', { d: ells([[114, 50, 5, 3], [122, 50, 5, 3]]) }, 'sky')
  ],
  'burócrata': [
    s('path', { d: rects([[90, 38, 46, 12], [92, 50, 44, 12], [88, 62, 46, 12], [92, 74, 44, 12]]) }, 'white'),
    s('path', { d: rects([[90, 38, 46, 12], [92, 50, 44, 12], [88, 62, 46, 12], [92, 74, 44, 12]]), ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 52, cy: 54, r: 12 }, 'skin'),
    s('rect', { x: 38, y: 68, width: 28, height: 28, rx: 8 }, 'gray'),
    s('path', { d: 'M48 66l4 10 4-10', ...SW(3) }, 'red', { stroke: true }),
    s('rect', { x: 18, y: 86, width: 124, height: 12, rx: 2 }, 'brown', { accent: true }),
    s('path', { d: 'M28 98v38M132 98v38', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M70 84v-14h6v14M66 72h14', ...SW(4) }, 'red', { stroke: true })
  ],
  'cafeína': [
    s('path', { d: 'M28 66h76v36q0 30-38 30t-38-30z' }, 'white'),
    s('path', { d: 'M28 66h76v36q0 30-38 30t-38-30zM104 76q22 0 20 18t-22 14', ...SW(4) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 66, cy: 68, rx: 36, ry: 6 }, 'brown'),
    s('path', { d: 'M126 18l-18 30h14l-14 28 30-38h-14l12-20z' }, 'yellow', { accent: true }),
    s('path', { d: 'M54 54q-6-10 0-20M76 54q-6-10 0-20', ...SW(3) }, 'gray', { stroke: true })
  ],
  'canónico': [
    s('rect', { x: 34, y: 22, width: 80, height: 108, rx: 6 }, 'navy', { accent: true }),
    s('path', { d: 'M114 26v100', ...SW(6) }, 'cream', { stroke: true }),
    s('path', { d: 'M48 40h52M48 116h52', ...SW(3) }, 'yellow', { stroke: true }),
    s('circle', { cx: 74, cy: 78, r: 18 }, 'yellow'),
    s('path', { d: 'M66 78l6 6 12-12', ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: 'M100 130l-6 14 10-4 6 8 4-18z' }, 'red')
  ],
  'capellán': [
    s('path', { d: 'M96 72l24-22 24 22v64H96z' }, 'tan'),
    s('path', { d: 'M120 22v24M112 30h16', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M112 136v-20a8 8 0 0 1 16 0v20z' }, 'brown'),
    ...person(56, 136, 'black', { h: 54, w: 34, r: 14 }),
    s('rect', { x: 50, y: 82, width: 12, height: 6, rx: 1 }, 'white', { accent: true }),
    s('rect', { x: 64, y: 104, width: 18, height: 22, rx: 2 }, 'red')
  ],
  'carismático': [
    ...person(80, 120, 'red', { accent: true }),
    s('path', { d: sparkle(48, 40, 10) + sparkle(114, 34, 8) + sparkle(120, 70, 6) }, 'yellow'),
    s('path', { d: busts([24, 136], 140, 18, 20) }, 'gray'),
    s('path', { d: dots([[24, 112], [136, 112]], 8) }, 'skin'),
    s('path', { d: heart(24, 92, 7) + heart(136, 92, 7) }, 'pink')
  ],
  carreta: [
    ground(),
    s('path', { d: 'M100 92l44 14', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M20 64h84l-4 30H24z' }, 'brown', { accent: true }),
    s('path', { d: 'M24 74h78M44 64v30M70 64v30', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: ring(62, 108, 24), ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: rays(62, 108, 0, 22, 8), ...SW(3) }, 'dark', { stroke: true })
  ],
  'casación': [
    ...paper(22, 30, 64, 86),
    s('path', { d: 'M32 48h44M32 62h44M32 76h30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 40a36 36 0 1 1-10 54', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M82 86l8 12 8-12z' }, 'orange'),
    s('rect', { x: 104, y: 52, width: 30, height: 16, rx: 4, transform: 'rotate(-30 119 60)' }, 'brown', { accent: true }),
    s('path', { d: 'M114 72l-14 24', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 28, y: 124, width: 60, height: 10, rx: 3 }, 'brown')
  ],
  'cervecería': [
    s('ellipse', { cx: 118, cy: 92, rx: 24, ry: 34 }, 'brown'),
    s('path', { d: 'M96 76h44M96 108h44', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 50h56v76q0 8-8 8H36q-8 0-8-8z' }, 'yellow', { accent: true }),
    s('path', { d: 'M84 64q20 0 20 18t-20 18', ...SW(7) }, 'yellow', { stroke: true }),
    s('path', { d: ells([[38, 48, 12, 10], [56, 42, 14, 12], [74, 48, 12, 10]]) }, 'white'),
    s('path', { d: 'M44 70v48M66 70v48', ...SW(3) }, 'orange', { stroke: true })
  ],
  cloruro: [
    s('path', { d: 'M40 40h80v80H40zM40 80h80M80 40v80', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[40, 40], [120, 40], [80, 80], [40, 120], [120, 120]], 14) }, 'green', { accent: true }),
    s('path', { d: dots([[80, 40], [40, 80], [120, 80], [80, 120]], 9) }, 'purple')
  ],
  colosal: [
    ground(),
    s('rect', { x: 46, y: 132, width: 52, height: 6 }, 'gray'),
    s('rect', { x: 54, y: 56, width: 36, height: 76, rx: 10 }, 'tan', { accent: true }),
    s('circle', { cx: 72, cy: 38, r: 18 }, 'tan'),
    s('path', { d: 'M90 66l20-40', ...SW(10) }, 'tan', { stroke: true }),
    s('path', { d: 'M106 30l8-16', ...SW(6) }, 'orange', { stroke: true }),
    ...person(126, 136, 'blue', { h: 14, w: 8, r: 4 })
  ],
  concurrir: [
    s('path', { d: 'M22 22l38 38M138 22l-38 38M22 138l38-38M138 138l-38-38M80 16v30M80 144v-30', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M54 44l8 18-18-8zM106 44l-8 18 18-8zM54 116l8-18-18 8zM106 116l-8-18 18 8zM72 42h16l-8 12zM72 118h16l-8-12z' }, 'orange'),
    s('circle', { cx: 80, cy: 80, r: 18 }, 'blue', { accent: true })
  ],
  confinamiento: [
    s('path', { d: 'M20 70l60-46 60 46z' }, 'red'),
    s('rect', { x: 30, y: 70, width: 100, height: 66 }, 'tan'),
    s('rect', { x: 44, y: 80, width: 44, height: 40 }, 'sky'),
    s('circle', { cx: 66, cy: 98, r: 9 }, 'skin'),
    s('path', { d: 'M54 120a12 12 0 0 1 24 0z' }, 'blue'),
    s('path', { d: 'M44 100h44M66 80v40', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M104 104v-8a8 8 0 0 1 16 0v8', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 100, y: 104, width: 24, height: 20, rx: 3 }, 'yellow', { accent: true })
  ],
  contraproducente: [
    ...person(36, 136, 'green', { accent: true }),
    s('path', { d: 'M48 98q60-70 90-40t-80 36', ...SW(4, { 'stroke-dasharray': '6 6' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 90l12-14 10 6-12 14z' }, 'brown'),
    s('path', { d: 'M110 30q14-6 22 6l-6 4q-6-8-14-4z', transform: 'rotate(10 120 34)' }, 'brown'),
    s('path', { d: burst(48, 84, 12, 6, 8) }, 'orange')
  ],
  corcho: [
    s('path', { d: 'M54 50h52l-6 80H60z' }, 'tan', { accent: true }),
    s('ellipse', { cx: 80, cy: 50, rx: 26, ry: 8 }, 'brown'),
    s('path', { d: dots([[66, 70], [88, 82], [72, 100], [92, 112], [68, 120], [90, 64]], 3) }, 'brown'),
    s('path', { d: 'M100 40l28-24M120 22q10 10 0 20t0 20', ...SW(4) }, 'gray', { stroke: true })
  ],
  corroborar: [
    ...paper(18, 34, 52, 70),
    ...paper(90, 34, 52, 70),
    s('path', { d: 'M28 52h32M28 64h32M28 76h22M100 52h32M100 64h32M100 76h22', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 70h20', ...SW(4, { 'stroke-dasharray': '4 4' }) }, 'blue', { stroke: true }),
    s('circle', { cx: 80, cy: 118, r: 18 }, 'green', { accent: true }),
    s('path', { d: 'M71 118l6 6 12-12', ...SW(4) }, 'white', { stroke: true })
  ],
  deponer: [
    ground(),
    ...person(72, 120, 'gray'),
    s('path', { d: 'M58 86l-10-30M86 86l10-30', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M30 130h84', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M114 124v12M114 130h16', ...SW(6) }, 'brown', { stroke: true, accent: true })
  ],
  'desinterés': [
    s('circle', { cx: 74, cy: 72, r: 44 }, 'skin'),
    s('path', { d: 'M50 64h16M82 64h16', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 68a6 4 0 0 0 12 0M84 68a6 4 0 0 0 12 0' }, 'dark'),
    s('path', { d: 'M62 94h20', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 120q10-24 30-14l-6 18z' }, 'skin'),
    s('rect', { x: 116, y: 104, width: 28, height: 26, rx: 2 }, 'red', { accent: true }),
    s('path', { d: 'M130 104v26M116 116h28', ...SW(4) }, 'yellow', { stroke: true })
  ],
  diluvio: [
    s('path', { d: 'M30 22l-6 14M54 22l-6 14M78 22l-6 14M102 22l-6 14M126 22l-6 14M42 40l-6 14M90 40l-6 14M134 40l-6 14', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M58 64h44v20H58z' }, 'tan'),
    s('path', { d: 'M52 64l28-12 28 12z' }, 'red'),
    s('path', { d: 'M28 84h104l-14 26H42z' }, 'brown', { accent: true }),
    s('path', { d: 'M14 112q16-12 33 0t33 0 33 0 33 0v34H14z' }, 'blue')
  ],
  doblemente: [
    s('rect', { x: 26, y: 44, width: 64, height: 64, rx: 10 }, 'sky'),
    s('rect', { x: 50, y: 64, width: 64, height: 64, rx: 10 }, 'blue', { accent: true }),
    s('path', { d: star(58, 76, 18) }, 'white'),
    s('path', { d: star(82, 96, 18) }, 'yellow'),
    s('path', { d: 'M120 40h20M130 30v20M128 64h12M134 58v12', ...SW(5) }, 'orange', { stroke: true })
  ],
  dualidad: [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'white'),
    s('path', { d: 'M80 24a56 56 0 0 1 0 112a28 28 0 0 1 0-56a28 28 0 0 0 0-56z' }, 'black', { accent: true }),
    s('path', { d: ring(80, 80, 56), ...SW(3) }, 'black', { stroke: true }),
    s('circle', { cx: 80, cy: 52, r: 8 }, 'black'),
    s('circle', { cx: 80, cy: 108, r: 8 }, 'white')
  ],
  edicto: [
    s('path', { d: 'M38 34h84v86q0 14-14 14H38z' }, 'cream'),
    s('path', { d: 'M38 34h84v86q0 14-14 14H38z', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 28, y: 22, width: 104, height: 16, rx: 8 }, 'tan'),
    s('path', { d: 'M52 56h56M52 70h56M52 84h40', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M92 108l-6 26M108 108l6 26', ...SW(5) }, 'red', { stroke: true }),
    s('circle', { cx: 100, cy: 108, r: 13 }, 'red', { accent: true })
  ],
  ejem: [
    ...person(64, 136, 'blue', { accent: true }),
    s('path', { d: 'M76 104l2-26', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 76, cy: 80, r: 7 }, 'skin'),
    s('path', { d: ells([[100, 64, 10, 8], [116, 56, 12, 10], [132, 46, 10, 8]]) }, 'gray'),
    s('path', { d: 'M90 72l6-4', ...SW(3) }, 'gray', { stroke: true })
  ],
  elle: [
    s('rect', { x: 20, y: 64, width: 56, height: 56, rx: 6 }, 'red', { accent: true }),
    s('rect', { x: 84, y: 64, width: 56, height: 56, rx: 6 }, 'red'),
    s('rect', { x: 52, y: 22, width: 56, height: 42, rx: 6 }, 'blue'),
    s('path', { d: star(48, 92, 14) + star(112, 92, 14) }, 'yellow'),
    ground(128)
  ],
  epilepsia: [
    s('path', { d: ells([[68, 78, 34, 30], [96, 72, 30, 30]]) }, 'pink', { accent: true }),
    s('path', { d: 'M46 74q8-10 16 0t16 0 16 0M54 92q8-8 16 0t16 0', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M90 50l-10 20h12l-10 22', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M28 30l8 12M132 30l-8 12M22 112l12-4M138 112l-12-4', ...SW(4) }, 'orange', { stroke: true })
  ],
  escorial: [
    s('rect', { x: 104, y: 36, width: 20, height: 100 }, 'brown'),
    s('path', { d: ells([[112, 26, 10, 8], [126, 18, 10, 6]]) }, 'gray'),
    s('path', { d: 'M14 136q20-56 46-56t40 56z' }, 'dark', { accent: true }),
    s('path', { d: dots([[40, 108], [56, 96], [70, 116], [84, 126]], 4) }, 'gray'),
    s('path', { d: 'M100 120l-10 16', ...SW(4) }, 'orange', { stroke: true }),
    ground()
  ],
  especializar: [
    s('path', { d: 'M24 34h112L92 82v30H68V82z' }, 'orange', { accent: true }),
    s('path', { d: dots([[40, 22], [62, 18], [84, 22], [106, 16], [124, 22]], 6) }, 'gray'),
    s('path', { d: 'M80 116v10', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: star(80, 134, 10) }, 'blue')
  ],
  estacionar: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 8 }, 'dark'),
    s('path', { d: 'M40 24v112M120 24v112', ...SW(5) }, 'white', { stroke: true }),
    s('rect', { x: 56, y: 38, width: 48, height: 84, rx: 14 }, 'red', { accent: true }),
    s('path', { d: 'M62 58q18-8 36 0v14H62zM62 102h36v8q-18 6-36 0z' }, 'sky')
  ],
  eutanasia: [
    s('path', { d: 'M56 132h48', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 66, y: 76, width: 28, height: 56, rx: 3 }, 'cream'),
    s('rect', { x: 66, y: 76, width: 28, height: 56, rx: 3, ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M80 76v-8q-6-10 0-22t0-22', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M118 136V82', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: leaflet(118, 82, 210, 22, 7) + leaflet(118, 82, -30, 22, 7) + leaflet(118, 82, -90, 22, 7) }, 'white', { accent: true }),
    s('path', { d: leaflet(118, 82, 210, 22, 7) + leaflet(118, 82, -30, 22, 7) + leaflet(118, 82, -90, 22, 7), ...SW(2) }, 'gray', { stroke: true })
  ],
  glaciar: [
    s('path', { d: 'M14 110l40-80 26 40 18-24 48 64z' }, 'sky'),
    s('path', { d: 'M54 30l-12 24 10-4 8 8 6-8 14 20zM98 46l-8 10 10 2z' }, 'white', { accent: true }),
    s('path', { d: 'M14 110h132v36H14z' }, 'blue'),
    s('path', { d: 'M40 104l20-8 20 10-10 20H48z' }, 'white'),
    s('path', { d: 'M40 104l20-8 20 10-10 20H48z', ...SW(2) }, 'sky', { stroke: true }),
    s('path', { d: 'M96 126q8-4 16 0t16 0', ...SW(3) }, 'sky', { stroke: true })
  ],
  grava: [
    s('path', { d: 'M18 136q14-60 62-62q48 2 62 62z' }, 'gray', { accent: true }),
    s('path', { d: ells([[50, 116, 7, 5], [72, 100, 6, 4], [96, 112, 8, 5], [84, 126, 6, 4], [112, 128, 7, 4], [60, 130, 6, 4], [88, 88, 5, 4]]) }, 'tan'),
    s('path', { d: ells([[38, 130, 5, 3], [104, 96, 5, 4], [120, 116, 6, 4], [66, 112, 4, 3]]) }, 'dark'),
    s('path', { d: 'M108 22L96 78', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M86 74h20l-4 18q-6 6-12 0z' }, 'dark')
  ],
  habitacional: [
    ground(),
    s('rect', { x: 26, y: 26, width: 64, height: 110, rx: 2 }, 'tan', { accent: true }),
    s('path', { d: grid(34, 36, 3, 4, 12, 14, 18, 22) }, 'sky'),
    s('path', { d: 'M30 52h56M30 74h56M30 96h56', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M94 92l24-22 24 22z' }, 'red'),
    s('rect', { x: 100, y: 92, width: 36, height: 44 }, 'cream'),
    s('rect', { x: 112, y: 112, width: 12, height: 24 }, 'brown')
  ],
  'hipotético': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 8 }, 'navy'),
    s('path', { d: 'M14 46h132M14 78h132M14 110h132M46 14v132M78 14v132M110 14v132', ...SW(1) }, 'blue', { stroke: true }),
    s('path', { d: 'M38 74l34-30 34 30v50H38z', ...SW(4, { 'stroke-dasharray': '7 6' }) }, 'white', { stroke: true, accent: true }),
    s('rect', { x: 104, y: 40, width: 10, height: 64, rx: 2, transform: 'rotate(30 109 72)' }, 'yellow'),
    s('path', { d: 'M126 98l-8 14-2-16z' }, 'tan')
  ],
  'histérico': [
    s('circle', { cx: 80, cy: 82, r: 40 }, 'skin'),
    s('path', { d: dots([[64, 70], [96, 70]], 9) }, 'white'),
    s('path', { d: dots([[64, 70], [96, 70]], 4) }, 'dark'),
    s('ellipse', { cx: 80, cy: 102, rx: 12, ry: 14 }, 'dark'),
    s('path', { d: 'M40 74l-12-30M120 74l12-30', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M60 34l-4-14M80 30V14M100 34l4-14M20 100l-8 6M140 100l8 6', ...SW(4) }, 'red', { stroke: true, accent: true })
  ],
  'homogéneo': [
    s('path', { d: 'M56 22v40l-30 62q-4 12 10 12h88q14 0 10-12l-30-62V22z' }, 'white'),
    s('path', { d: 'M38 96h84l14 28q4 12-10 12H34q-14 0-10-12z' }, 'purple', { accent: true }),
    s('path', { d: 'M48 22h64M56 22v40l-30 62q-4 12 10 12h88q14 0 10-12l-30-62V22', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[50, 108], [66, 108], [82, 108], [98, 108], [114, 108], [42, 124], [58, 124], [74, 124], [90, 124], [106, 124], [122, 124]], 4) }, 'pink')
  ],
  horca: [
    s('path', { d: 'M20 136q10-40 40-44q30 4 36 44z' }, 'yellow'),
    s('path', { d: 'M30 120l10-14M52 110l4-14M74 112l-4-14', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M126 140L104 50', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M94 54l-10-34M104 50l-4-36M114 48l4-34M90 58q14-8 28-10', ...SW(4) }, 'gray', { stroke: true, accent: true })
  ],
  impaciencia: [
    s('path', { d: 'M100 20h32M100 76h32M104 20q0 22 12 28q-12 6-12 28M128 20q0 22-12 28q12 6 12 28', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M108 30h16l-8 14zM108 72l8-12 8 12z' }, 'yellow'),
    ...person(54, 136, 'red', { accent: true }),
    s('path', { d: 'M48 76l12-4M48 84h12', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M26 136l-8-6M30 128l-10-4', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: ells([[36, 52, 6, 4], [74, 50, 6, 4]]) }, 'gray')
  ],
  'imperfección': [
    s('path', { d: 'M36 46h88v52q0 34-44 34t-44-34z' }, 'sky', { accent: true }),
    s('path', { d: 'M124 60q18 0 18 18t-20 18', ...SW(6) }, 'sky', { stroke: true }),
    s('path', { d: 'M86 46l6 10 8-4 4-6z' }, 'white'),
    s('path', { d: 'M94 56l-6 16 8 10-8 14', ...SW(3) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 80, cy: 136, rx: 54, ry: 6 }, 'gray')
  ],
  indocumentado: [
    ...person(46, 136, 'gray', { accent: true }),
    s('rect', { x: 78, y: 48, width: 64, height: 44, rx: 6, ...SW(4, { 'stroke-dasharray': '7 6' }) }, 'gray', { stroke: true }),
    s('circle', { cx: 96, cy: 66, r: 7, ...SW(3, { 'stroke-dasharray': '4 4' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 62h22M110 74h16', ...SW(3, { 'stroke-dasharray': '4 4' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 98l18-10', ...SW(6) }, 'skin', { stroke: true })
  ],
};
