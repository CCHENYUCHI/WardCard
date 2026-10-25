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
};
