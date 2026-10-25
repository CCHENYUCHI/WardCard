// Illustration specs for words still undrawn in batches 0083–0084 (see server/scripts/lexicon/art.js)
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
  comendador: [
    ...person(70, 140, 'gray', { accent: true }),
    s('path', { d: 'M56 52q14-16 28 0v6H56z' }, 'gray'),
    s('path', { d: 'M70 36q10-14 22-10', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M92 78h30q0 34-15 44q-15-10-15-44z' }, 'navy'),
    s('path', { d: 'M107 86v28M96 98h22', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M40 132V40M34 52h12', ...SW(5) }, 'yellow', { stroke: true })
  ],
  comercializar: [
    s('rect', { x: 22, y: 60, width: 50, height: 50, rx: 4 }, 'tan'),
    s('path', { d: 'M22 76h50M47 60v16', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M54 30h26l10 10-10 10H54z' }, 'yellow', { accent: true }),
    s('circle', { cx: 60, cy: 40, r: 3 }, 'dark'),
    arrow('M80 86h24m-8-8 8 8-8 8', 'orange', 5),
    s('path', { d: 'M108 74h8l8 36h18l6-24h-28', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: dots([[126, 120], [140, 120]], 5) }, 'dark')
  ],
  comparecencia: [
    ...person(80, 112, 'navy'),
    s('path', { d: 'M50 100h60l-8 40H58z' }, 'brown', { accent: true }),
    s('path', { d: 'M62 100l-10-24M80 100v-22M98 100l10-24', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: ells([[50, 72, 6, 8], [80, 74, 6, 8], [110, 72, 6, 8]]) }, 'gray'),
    s('path', { d: sparkle(30, 40, 10) + sparkle(130, 34, 8) }, 'yellow')
  ],
  concienciar: [
    s('path', { d: 'M30 92l50-26v68L30 108z' }, 'red', { accent: true }),
    s('rect', { x: 18, y: 90, width: 14, height: 20, rx: 3 }, 'gray'),
    s('path', { d: 'M40 108l6 26', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 112, cy: 54, r: 24 }, 'yellow'),
    s('rect', { x: 102, y: 76, width: 20, height: 14, rx: 3 }, 'gray'),
    s('path', { d: halfRays(112, 54, 30, 40, 5), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M90 100q10 6 10 18M96 92q16 10 16 30', ...SW(4) }, 'orange', { stroke: true })
  ],
  conscientemente: [
    s('path', { d: HEAD }, 'skin'),
    s('path', { d: 'M76 26q-40 0-44 40q0 12 4 20q40-6 54-40z' }, 'brown'),
    s('ellipse', { cx: 104, cy: 66, rx: 9, ry: 7 }, 'white'),
    s('circle', { cx: 106, cy: 66, r: 4 }, 'dark'),
    s('circle', { cx: 60, cy: 30, r: 14 }, 'yellow', { accent: true }),
    s('path', { d: 'M52 30l6 6 10-12', ...SW(4) }, 'dark', { stroke: true })
  ],
  constitucionalidad: [
    s('rect', { x: 26, y: 30, width: 76, height: 100, rx: 6 }, 'navy'),
    s('rect', { x: 34, y: 38, width: 60, height: 84, rx: 3 }, 'cream'),
    s('path', { d: 'M44 56h40M44 70h40M44 84h28', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 108, cy: 106, r: 26 }, 'green', { accent: true }),
    s('path', { d: 'M96 106l9 9 16-18', ...SW(6) }, 'white', { stroke: true })
  ],
  coronavirus: [
    s('path', { d: rays(80, 80, 30, 50, 12), ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: dots(around(80, 80, 52, 12), 7) }, 'red'),
    s('circle', { cx: 80, cy: 80, r: 34 }, 'gray', { accent: true }),
    s('path', { d: dots([[68, 70], [92, 76], [76, 94]], 6) }, 'orange')
  ],
  corso: [
    s('rect', { x: 14, y: 30, width: 132, height: 110, rx: 12 }, 'sky'),
    s('path', { d: 'M72 40q12-6 16 8q6 18 10 40q0 30-16 42q-14-6-20-26q-6-20 4-36q-2-20 6-28z' }, 'green', { accent: true }),
    s('path', { d: 'M66 100l10-22 10 22z' }, 'brown'),
    s('path', { d: 'M100 44q16-20 32 0q-16-6-32 0z' }, 'dark'),
    s('path', { d: 'M24 120q8-5 16 0t16 0', ...SW(3) }, 'white', { stroke: true })
  ],
  'demografía': [
    s('path', { d: rects([[56, 40, 48, 14], [44, 60, 72, 14], [34, 80, 92, 14], [24, 100, 112, 14]]) }, 'blue', { accent: true }),
    s('path', { d: 'M80 34v86', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: busts([30, 130], 140, 16, 18) }, 'orange'),
    s('path', { d: dots([[30, 116], [130, 116]], 7) }, 'skin'),
    s('path', { d: dots([[80, 24]], 8) }, 'skin')
  ],
  'depuración': [
    s('path', { d: 'M34 30h92l-32 46v20H66V76z' }, 'gray'),
    s('path', { d: 'M42 36h76l-10 14H52z' }, 'brown'),
    s('path', { d: dots([[60, 42], [78, 44], [98, 42]], 3) }, 'dark'),
    s('path', { d: drop(80, 120, 12) }, 'sky', { accent: true }),
    s('path', { d: sparkle(106, 118, 8) }, 'yellow')
  ],
  desmayo: [
    ground(),
    s('rect', { x: 50, y: 112, width: 70, height: 24, rx: 10 }, 'purple', { accent: true }),
    s('circle', { cx: 38, cy: 122, r: 13 }, 'skin'),
    s('path', { d: 'M32 118l6 4M38 118l-6 4', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: star(34, 82, 8) + star(56, 70, 6) + star(18, 92, 5) }, 'yellow'),
    s('path', { d: 'M24 100q14-24 40-20', ...DASH(3, '4 5') }, 'gray', { stroke: true })
  ],
  desnudez: [
    s('path', { d: 'M80 30v-8M80 30l-46 30h92z', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 22a6 6 0 1 1 6 6', ...SW(4) }, 'gray', { stroke: true }),
    ground(),
    s('path', { d: 'M38 136q-4-20 20-24h44q20 2 22 24z' }, 'blue', { accent: true }),
    s('path', { d: 'M60 120q20 -10 40 0', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: ells([[118, 130, 12, 6]]) }, 'brown')
  ],
  diminuto: [
    s('circle', { cx: 70, cy: 70, r: 40 }, 'sky'),
    s('circle', { cx: 70, cy: 70, r: 40, ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 100l34 34', ...SW(12) }, 'brown', { stroke: true }),
    s('path', { d: ells([[64, 74, 5, 3], [72, 74, 4, 3]]) }, 'red', { accent: true }),
    s('path', { d: 'M62 70l-4-4M76 72l4-3', ...SW(1.5) }, 'dark', { stroke: true })
  ],
  'diáspora': [
    s('path', { d: 'M50 136v-60', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: rays(50, 60, 4, 20, 16), ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 50, cy: 60, r: 6 }, 'brown'),
    s('path', { d: 'M90 50v-12M110 74v-12M120 34v-12M130 96v-12M100 104v-12', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: dots([[90, 50], [110, 74], [120, 34], [130, 96], [100, 104]], 3) }, 'brown', { accent: true }),
    s('path', { d: 'M74 54q20-20 50-24M74 70q30 0 54 24', ...DASH(2, '3 5') }, 'sky', { stroke: true })
  ],
  empaque: [
    s('path', { d: 'M30 60l50-20 50 20v60l-50 20-50-20z' }, 'tan'),
    s('path', { d: 'M30 60l50 20 50-20M80 80v60', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M55 50l50 20v18', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'orange', { stroke: true, accent: true })
  ],
  'enérgicamente': [
    ...person(80, 140, 'red', { accent: true }),
    s('path', { d: 'M66 102l-18-30M94 102l18-30', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: dots([[46, 68], [114, 68]], 7) }, 'skin'),
    s('path', { d: 'M30 30l-8 18h10l-6 18 18-24H34l6-12z' }, 'yellow'),
    s('path', { d: 'M126 30l-8 18h10l-6 18 18-24h-10l6-12z' }, 'yellow')
  ],
  escasamente: [
    s('path', { d: 'M46 30h68l-8 106H54z' }, 'sky'),
    s('path', { d: 'M54 120h52l-1 16H55z' }, 'blue', { accent: true }),
    s('path', { d: 'M46 30h68l-8 106H54z', ...SW(4) }, 'gray', { stroke: true })
  ],
  'escisión': [
    s('path', { d: 'M28 60h40l-6 70H34zM92 60h40l-6 70H98z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 20v120', ...DASH(3, '6 6') }, 'gray', { stroke: true }),
    s('circle', { cx: 70, cy: 30, r: 9, ...SW(4) }, 'red', { stroke: true }),
    s('circle', { cx: 90, cy: 30, r: 9, ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M74 38l14 22M86 38l-14 22', ...SW(4) }, 'gray', { stroke: true })
  ],
  'esterilización': [
    s('circle', { cx: 80, cy: 80, r: 52 }, 'mint'),
    s('path', { d: ells([[80, 80, 24, 24]]) + rays(80, 80, 22, 34, 8) }, 'green'),
    s('path', { d: rays(80, 80, 22, 34, 8), ...SW(4) }, 'green', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 52, ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M44 44l72 72', ...SW(8) }, 'red', { stroke: true })
  ],
  'estratégicamente': [
    s('path', { d: checker(20, 92, 8, 3, 15, 1) }, 'dark'),
    s('path', { d: 'M20 92h120v45H20z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 88h28l-4-10q12-12 4-34q-6-12-24-10l-8 8 2 8 10-2q-10 14-8 30z' }, 'navy', { accent: true }),
    arrow('M86 70q24-30 46-10m-12-2 12 2-2 12', 'orange', 4)
  ],
  evolutivo: [
    ground(),
    s('path', { d: 'M30 136v-12M30 124q-8-8-12 0M30 124q8-8 12 0', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M70 136v-30M70 112q-14-14-20 0M70 106q14-14 20 0', ...SW(4) }, 'green', { stroke: true }),
    ...scaled(tree(80, 'green', 'brown', { accent: true }), 0.55, 61, 61),
    arrow('M24 50q50-30 90-20', 'orange', 4)
  ],
  'exaltación': [
    s('path', { d: busts([46, 80, 114], 140, 26, 34) }, 'blue'),
    s('path', { d: dots([[46, 100], [80, 100], [114, 100]], 11) }, 'skin'),
    s('path', { d: 'M36 92l4-18M124 92l-4-18', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 66, y: 46, width: 28, height: 40, rx: 9 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 32, r: 11 }, 'skin'),
    s('path', { d: 'M66 54l-14-18M94 54l14-18', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: sparkle(30, 30, 8) + sparkle(130, 30, 8) }, 'yellow')
  ],
  fusilar: [
    s('path', { d: 'M20 96l60-8 50-4v10l-50 6-20 4-6 18-16 4-6-16-12 0z' }, 'brown', { accent: true }),
    s('path', { d: 'M76 88l64-6', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 100q2 8 8 8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: ells([[144, 70, 6, 6], [136, 60, 8, 8]]) }, 'gray')
  ],
  homicida: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('path', { d: 'M80 34q-22 0-22 26v8h44v-8q0-26-22-26zM56 74h48l14 72H42z' }, 'dark', { accent: true }),
    s('path', { d: 'M70 58h20', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M110 96l24-30 4 4-24 30z' }, 'gray'),
    s('path', { d: 'M108 92l10 10', ...SW(6) }, 'brown', { stroke: true })
  ],
  horda: [
    s('path', { d: busts([40, 64, 88, 112], 112, 22, 30) }, 'red'),
    s('path', { d: dots([[40, 76], [64, 76], [88, 76], [112, 76]], 9) }, 'skin'),
    s('path', { d: busts([28, 52, 76, 100, 124], 140, 22, 30) }, 'brown', { accent: true }),
    s('path', { d: dots([[28, 104], [52, 104], [76, 104], [100, 104], [124, 104]], 9) }, 'skin'),
    arrow('M28 40h100m-10-8 10 8-10 8', 'orange', 5)
  ],
  impositivo: [
    ...paper(22, 26, 62, 82),
    s('path', { d: 'M32 44h42M32 58h42M32 72h28', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 38l24-14 24 14zM90 42h40v6H90zM92 52h36v36H92z' }, 'tan'),
    s('path', { d: 'M100 54v32M110 54v32M120 54v32', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: ells([[54, 130, 20, 6], [54, 122, 20, 6], [54, 114, 20, 6]]) }, 'yellow', { accent: true }),
    arrow('M80 120q30 0 30-24m-8 6 8-8 8 8', 'orange', 4)
  ],
  incitar: [
    ...lean(52, 140, 15, 'orange', { accent: true }),
    s('path', { d: 'M70 96l24-6', ...SW(7) }, 'skin', { stroke: true }),
    ...lean(110, 140, 20, 'blue'),
    arrow('M30 40h40m-10-8 10 8-10 8', 'red', 5),
    s('path', { d: burst(124, 60, 14, 6, 8) }, 'yellow')
  ],
  indeterminado: [
    s('rect', { x: 30, y: 60, width: 46, height: 46, rx: 8, transform: 'rotate(-20 53 83)' }, 'white'),
    s('rect', { x: 30, y: 60, width: 46, height: 46, rx: 8, transform: 'rotate(-20 53 83)', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[46, 78], [60, 88], [52, 70]], 5) }, 'dark'),
    s('rect', { x: 86, y: 34, width: 42, height: 42, rx: 8, transform: 'rotate(25 107 55)' }, 'red', { accent: true }),
    s('path', { d: dots([[100, 50], [114, 60]], 5) }, 'white'),
    s('path', { d: 'M40 124q20 8 40 0M90 100q16 4 30-6', ...DASH(3, '4 5') }, 'gray', { stroke: true })
  ],
  individualismo: [
    s('path', { d: busts([24, 48, 72], 140, 20, 34) }, 'gray'),
    s('path', { d: dots([[24, 98], [48, 98], [72, 98]], 9) }, 'gray'),
    s('path', { d: ells([[118, 140, 24, 5]]) }, 'yellow'),
    ...person(118, 138, 'red', { accent: true }),
    s('path', { d: sparkle(142, 46, 8) }, 'yellow')
  ],
  'infusión': [
    s('path', { d: 'M34 72h76v20q0 36-38 36q-38 0-38-36z' }, 'white'),
    s('path', { d: 'M34 72h76v20q0 36-38 36q-38 0-38-36zM110 84q18 0 14 16q-4 12-18 12', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 80h64v12q0 28-32 28q-32 0-32-28z' }, 'orange', { accent: true }),
    s('path', { d: 'M74 76V40', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: leaflet(74, 40, -60, 30, 9) }, 'green'),
    s('path', { d: 'M50 60q-6-8 0-16M60 62q-6-10 0-20', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 136h100', ...SW(4) }, 'gray', { stroke: true })
  ],
  injuria: [
    s('path', { d: bubble(14, 18, 74, 48) }, 'red', { accent: true }),
    s('path', { d: 'M26 40l10-10 8 14 10-14 8 14 10-12', ...SW(4) }, 'yellow', { stroke: true }),
    ...face(108, 104, 30, 'skin', 'frown'),
    s('path', { d: drop(124, 112, 4) }, 'sky'),
    arrow('M62 82l18 10', 'dark', 4)
  ],
  intocable: [
    s('path', { d: 'M54 140h52l-6-48H60z' }, 'tan'),
    s('path', { d: 'M80 50l18 20-18 22-18-22z' }, 'purple'),
    s('path', { d: 'M48 92q0-60 32-60t32 60z', ...SW(4) }, 'sky', { stroke: true }),
    s('circle', { cx: 116, cy: 44, r: 22 }, 'white'),
    s('circle', { cx: 116, cy: 44, r: 22, ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M100 60l32-32', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M108 52v-14M114 52v-18M120 52v-14', ...SW(4) }, 'skin', { stroke: true })
  ],
  intruso: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('rect', { x: 50, y: 30, width: 70, height: 110, rx: 4 }, 'yellow'),
    ...person(80, 140, 'dark', { accent: true }),
    s('path', { d: 'M68 70h24', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M120 30l18 10v100l-18-0z' }, 'brown'),
    s('circle', { cx: 34, cy: 34, r: 8 }, 'cream')
  ],
  irritar: [
    s('path', { d: 'M18 80q62-62 124 0q-62 62-124 0z' }, 'white'),
    s('path', { d: 'M30 72l14 6M34 92l14-6M126 70l-14 8M128 92l-16-6', ...SW(3) }, 'red', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 24 }, 'brown'),
    s('circle', { cx: 80, cy: 80, r: 11 }, 'dark'),
    s('path', { d: 'M18 80q62-62 124 0q-62 62-124 0z', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: drop(110, 124, 6) }, 'sky')
  ],
  liderato: [
    ground(),
    s('path', { d: 'M110 136V60', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 62h28l-8 10 8 10h-28z' }, 'red'),
    ...lean(80, 136, 15, 'yellow', { accent: true, h: 38 }),
    ...lean(34, 136, 15, 'gray', { h: 28, w: 22, r: 9 }),
    s('path', { d: star(60, 40, 12) }, 'yellow')
  ],
  'locación': [
    ground(),
    s('path', { d: 'M78 136l26-52 26 52z' }, 'green'),
    s('circle', { cx: 120, cy: 46, r: 12 }, 'yellow'),
    s('path', { d: 'M38 136l12-40 12 40M50 96v40', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 22, y: 70, width: 44, height: 28, rx: 4 }, 'dark', { accent: true }),
    s('path', { d: 'M66 78l14-8v28l-14-8z' }, 'gray'),
    s('path', { d: dots([[32, 60], [54, 60]], 10) }, 'gray')
  ],
  'lóbulo': [
    s('path', { d: 'M60 30q50-10 52 40q0 24-18 34q-8 6-8 20q0 18-20 18q-16 0-18-18z' }, 'skin'),
    s('path', { d: 'M60 30q50-10 52 40q0 24-18 34q-8 6-8 20q0 18-20 18q-16 0-18-18', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M70 50q24-4 26 20q0 12-10 18', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 68, cy: 126, r: 16 }, 'pink', { accent: true }),
    s('circle', { cx: 68, cy: 136, r: 6 }, 'yellow')
  ],
  matinal: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M40 100a40 40 0 0 1 80 0z' }, 'yellow', { accent: true }),
    s('path', { d: halfRays(80, 100, 48, 62, 7), ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M14 100h132v34a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green'),
    s('path', { d: birds([[36, 40], [124, 34]]), ...SW(3) }, 'dark', { stroke: true })
  ],
  'membresía': [
    s('rect', { x: 18, y: 38, width: 124, height: 84, rx: 10 }, 'blue', { accent: true }),
    s('circle', { cx: 52, cy: 72, r: 12 }, 'skin'),
    s('path', { d: busts([52], 108, 30, 22) }, 'white'),
    s('path', { d: 'M80 68h44M80 84h32', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: star(118, 104, 10) }, 'yellow')
  ],
  mojar: [
    s('path', { d: 'M24 90h112q0 44-56 44T24 90z' }, 'white'),
    s('path', { d: 'M24 90h112q0 44-56 44T24 90z', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: ells([[80, 92, 52, 8]]) }, 'orange'),
    s('path', { d: 'M74 96L104 28l20 8-26 62z' }, 'tan', { accent: true }),
    s('path', { d: 'M104 28l20 8', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: drop(70, 70, 4) + drop(58, 58, 3) }, 'orange')
  ],
  morgue: [
    s('rect', { x: 18, y: 22, width: 124, height: 116, rx: 6 }, 'gray', { accent: true }),
    s('path', { d: rects([[26, 30, 50, 30], [84, 30, 50, 30], [26, 68, 50, 30], [84, 68, 50, 30], [26, 106, 50, 26], [84, 106, 50, 26]]) }, 'white'),
    s('path', { d: 'M42 46h18M100 46h18M42 84h18M100 84h18M42 120h18M100 120h18', ...SW(4) }, 'dark', { stroke: true })
  ],
  muestreo: [
    s('path', { d: dots([[30, 40], [50, 30], [70, 44], [96, 32], [120, 40], [36, 70], [64, 76], [124, 74], [30, 104], [56, 120], [100, 120], [128, 108]], 6) }, 'gray'),
    s('path', { d: dots([[90, 70], [100, 86], [84, 92]], 6) }, 'red', { accent: true }),
    s('circle', { cx: 92, cy: 82, r: 24, ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M74 100l-22 26', ...SW(10) }, 'brown', { stroke: true })
  ],
  nirvana: [
    s('circle', { cx: 80, cy: 64, r: 40 }, 'yellow', { accent: true }),
    s('path', { d: rays(80, 64, 44, 56, 12), ...SW(3) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 56, r: 13 }, 'skin'),
    s('path', { d: 'M74 56h4M82 56h4', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 72h32l6 40H58z' }, 'orange'),
    s('path', { d: 'M40 124q40-24 80 0q-40 12-80 0z' }, 'orange'),
    s('path', { d: 'M60 102q20 10 40 0', ...SW(6) }, 'skin', { stroke: true })
  ],
  nutrir: [
    s('circle', { cx: 56, cy: 76, r: 34 }, 'skin'),
    s('path', { d: 'M30 60q20-30 52 0q-10-20-26-20t-26 20z' }, 'brown'),
    s('path', { d: dots([[46, 74], [66, 74]], 3) }, 'dark'),
    s('path', { d: 'M90 90l36-27', ...SW(18) }, 'sky', { stroke: true, accent: true }),
    s('path', { d: 'M100 82l22-16', ...SW(8) }, 'white', { stroke: true }),
    s('path', { d: 'M76 98l10-6', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M48 94q8 6 16 0', ...SW(3) }, 'red', { stroke: true })
  ],
  'náhuatl': [
    s('path', { d: bubble(14, 22, 132, 96) }, 'cream'),
    s('path', { d: bubble(14, 22, 132, 96), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M50 40q22 0 22 32t-22 32q-22 0-22-32t22-32z' }, 'brown', { accent: true }),
    s('path', { d: 'M50 44v56M38 56q12 8 24 0M38 88q12-8 24 0', ...SW(2) }, 'dark', { stroke: true }),
    s('circle', { cx: 104, cy: 78, r: 24 }, 'red'),
    s('path', { d: 'M94 56l10 6 10-6-4 10', ...SW(4) }, 'green', { stroke: true })
  ],
  operacional: [
    ...gear(70, 80, 30, 10, 'gray', { accent: true }),
    s('circle', { cx: 70, cy: 80, r: 10 }, 'white'),
    s('circle', { cx: 126, cy: 40, r: 14 }, 'green'),
    s('path', { d: 'M120 40l4 4 8-8', ...SW(3) }, 'white', { stroke: true }),
    arrow('M114 120q20-14 14-40', 'orange', 4)
  ],
  'ovación': [
    s('path', { d: busts([30, 62, 98, 130], 140, 24, 40) }, 'purple', { accent: true }),
    s('path', { d: dots([[30, 98], [62, 98], [98, 98], [130, 98]], 10) }, 'skin'),
    s('path', { d: 'M22 112l-6-34M38 112l6-34M54 112l-6-34M70 112l6-34M90 112l-6-34M106 112l6-34M122 112l-6-34M138 112l6-34', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M30 52v-12M62 52v-12M98 52v-12M130 52v-12', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: star(80, 28, 10) }, 'yellow')
  ],
  'oxidación': [
    s('path', { d: 'M28 40h40v10H54v86l-6 10-6-10V50H28z' }, 'gray'),
    s('path', { d: dots([[48, 70], [50, 96], [46, 118]], 6) + ells([[44, 44, 10, 4]]) }, 'orange', { accent: true }),
    s('path', { d: 'M92 120h48v16H92z' }, 'brown'),
    s('path', { d: dots([[102, 112], [118, 108], [132, 114], [110, 98]], 6) }, 'orange'),
    s('path', { d: dots([[96, 56], [116, 70]], 4) }, 'brown')
  ],
  palito: [
    s('rect', { x: 70, y: 18, width: 20, height: 124, rx: 10 }, 'tan', { accent: true }),
    s('path', { d: 'M80 30v100', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M24 110l30-60M136 110l-30-60', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 78l-10-6M120 78l10-6', ...SW(4) }, 'brown', { stroke: true })
  ],
  pancarta: [
    ...person(80, 140, 'green'),
    s('path', { d: 'M66 100l-6-50M94 100l6-50', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 22, y: 16, width: 116, height: 40, rx: 4 }, 'yellow', { accent: true }),
    s('path', { d: 'M36 30h88M36 42h60', ...SW(5) }, 'red', { stroke: true })
  ],
  peculiaridad: [
    s('path', { d: dots([[34, 40], [80, 40], [126, 40], [34, 80], [126, 80], [34, 120], [80, 120], [126, 120]], 14) }, 'gray'),
    s('path', { d: star(80, 82, 24) }, 'purple', { accent: true }),
    s('path', { d: sparkle(108, 62, 6) }, 'yellow')
  ],
  'penúltimo': [
    ground(),
    s('path', { d: busts([24, 50, 76, 128], 136, 20, 40) }, 'gray'),
    s('path', { d: dots([[24, 94], [50, 94], [76, 94], [128, 94]], 9) }, 'gray'),
    ...person(102, 136, 'orange', { accent: true, h: 40, w: 22, r: 10 }),
    arrow('M102 24v28m-8-8 8 8 8-8', 'red', 5)
  ],
  polideportivo: [
    ground(),
    s('path', { d: 'M20 136V80q60-50 120 0v56z' }, 'blue', { accent: true }),
    s('path', { d: rects([[30, 96, 100, 12]]) }, 'sky'),
    s('rect', { x: 66, y: 112, width: 28, height: 24 }, 'navy'),
    s('circle', { cx: 40, cy: 30, r: 14 }, 'orange'),
    s('path', { d: 'M26 30h28M40 16v28', ...SW(2) }, 'dark', { stroke: true }),
    s('circle', { cx: 120, cy: 30, r: 14 }, 'white'),
    s('circle', { cx: 120, cy: 30, r: 14, ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M116 24l8 0 3 7-7 5-7-5z' }, 'dark')
  ],
  profesionalidad: [
    ...person(70, 136, 'navy', { accent: true, h: 54, w: 36 }),
    s('path', { d: 'M64 82h12l-6 6z M70 88l-4 20 4 6 4-6z' }, 'red'),
    s('path', { d: 'M62 82l8 10 8-10', ...SW(3) }, 'white', { stroke: true }),
    s('rect', { x: 98, y: 108, width: 36, height: 28, rx: 4 }, 'brown'),
    s('path', { d: 'M108 108v-6h16v6', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: star(120, 40, 14) }, 'yellow')
  ],
  'píldora': [
    s('path', { d: 'M40 108l40-40', ...SW(42) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 108l20-20', ...SW(36) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M62 86l18-18', ...SW(36) }, 'white', { stroke: true }),
    s('circle', { cx: 116, cy: 116, r: 20 }, 'sky'),
    s('path', { d: 'M100 116h32', ...SW(3) }, 'blue', { stroke: true })
  ],
  rayado: [
    s('path', { d: 'M56 26l-34 20 12 26 12-6v68h68V66l12 6 12-26-34-20q-12 12-24 0z' }, 'white'),
    s('path', { d: 'M28 50h104M36 70h88M46 90h68M46 110h68M46 128h68', ...SW(8, { 'stroke-linecap': 'butt' }) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M56 26l-34 20 12 26 12-6v68h68V66l12 6 12-26-34-20q-12 12-24 0z', ...SW(4) }, 'navy', { stroke: true })
  ],
  relatividad: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('path', { d: 'M20 60q60 60 120 0M20 90q60 50 120 0M20 120q60 30 120 0M50 30q20 70 0 110M110 30q-20 70 0 110', ...SW(2) }, 'sky', { stroke: true }),
    s('circle', { cx: 80, cy: 86, r: 18 }, 'orange', { accent: true }),
    s('circle', { cx: 120, cy: 36, r: 12 }, 'white'),
    s('path', { d: 'M120 36v-7M120 36l5 3', ...SW(2) }, 'dark', { stroke: true })
  ],
  repartidor: [
    s('path', { d: dots([[40, 120], [120, 120]], 16) }, 'dark'),
    s('path', { d: dots([[40, 120], [120, 120]], 7) }, 'gray'),
    s('path', { d: 'M40 120l30-30h30l20 30M70 90l-10 30', ...SW(5) }, 'red', { stroke: true }),
    s('rect', { x: 56, y: 56, width: 26, height: 34, rx: 8, transform: 'rotate(15 69 90)' }, 'green'),
    s('circle', { cx: 80, cy: 44, r: 10 }, 'skin'),
    s('rect', { x: 26, y: 50, width: 32, height: 30, rx: 4 }, 'orange', { accent: true }),
    s('path', { d: 'M26 64h32', ...SW(2) }, 'brown', { stroke: true })
  ],
  revelador: [
    s('circle', { cx: 80, cy: 98, r: 30 }, 'yellow', { accent: true }),
    s('path', { d: rays(80, 98, 36, 48, 10), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M40 70q40-60 80-40q-10 10-18 26q-20-14-62 14z' }, 'purple'),
    s('path', { d: 'M102 56l18-28', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M30 140h100', ...SW(4) }, 'gray', { stroke: true })
  ],
  sensorial: [
    s('path', { d: 'M18 50q30-30 60 0q-30 30-60 0z' }, 'white'),
    s('path', { d: 'M18 50q30-30 60 0q-30 30-60 0z', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 48, cy: 50, r: 10 }, 'blue', { accent: true }),
    s('path', { d: 'M104 28q30-4 30 26q0 18-14 22q-6 4-6 14q-2 10-12 8', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M44 140v-34M54 140v-40M64 140v-38M74 140v-30M34 120l6 10', ...SW(9) }, 'skin', { stroke: true }),
    s('path', { d: 'M98 124q14-28 28 0q-14 10-28 0z' }, 'pink'),
    s('path', { d: 'M92 108q20-12 40 0', ...SW(5) }, 'red', { stroke: true })
  ],
  'simplificación': [
    s('path', { d: 'M20 50q10-30 20 0t20 0q10 20-10 10t10-20q10 20 20 10', ...SW(5) }, 'gray', { stroke: true }),
    arrow('M80 76v20m-8-8 8 8 8-8', 'orange', 5),
    s('path', { d: 'M20 118h120', ...SW(7) }, 'green', { stroke: true, accent: true }),
    s('path', { d: dots([[20, 118], [140, 118]], 7) }, 'green')
  ],
  susurro: [
    s('circle', { cx: 46, cy: 70, r: 22 }, 'skin'),
    s('path', { d: busts([46], 140, 40, 46) }, 'pink', { accent: true }),
    s('path', { d: 'M66 76l4 -18', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 118, cy: 70, r: 22 }, 'skin'),
    s('path', { d: busts([118], 140, 40, 46) }, 'blue'),
    s('path', { d: 'M96 66q-6 4 0 10', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: dots([[78, 64], [84, 58], [90, 66]], 2.5) }, 'gray')
  ],
  tanga: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M14 108h132v26a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'tan'),
    s('path', { d: 'M30 50q50 16 100 0', ...SW(4) }, 'pink', { stroke: true }),
    s('path', { d: 'M54 56h52l-24 40h-4z' }, 'pink', { accent: true }),
    s('circle', { cx: 120, cy: 34, r: 10 }, 'yellow')
  ],
  tenue: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'navy'),
    s('circle', { cx: 80, cy: 64, r: 26 }, 'purple'),
    s('path', { d: drop(80, 66, 6) }, 'yellow', { accent: true }),
    s('rect', { x: 70, y: 76, width: 20, height: 50, rx: 3 }, 'cream'),
    s('path', { d: 'M80 76v-6', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M50 126h60', ...SW(5) }, 'gray', { stroke: true })
  ],
  'titán': [
    ground(),
    s('path', { d: 'M18 136v-16l10-8 10 8v16zM122 136v-18l10-8 10 8v18z' }, 'tan'),
    s('path', { d: 'M66 136v-40M94 136v-40', ...SW(14) }, 'navy', { stroke: true }),
    s('rect', { x: 54, y: 46, width: 52, height: 56, rx: 16 }, 'purple', { accent: true }),
    s('circle', { cx: 80, cy: 30, r: 15 }, 'skin'),
    s('path', { d: 'M56 56l-14 30M104 56l14 30', ...SW(10) }, 'skin', { stroke: true })
  ],
  trazo: [
    s('path', { d: 'M22 120q30-80 60-40t56-50', ...SW(12) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M126 36l14-18', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M118 44l8-8 6 6-8 8q-6 4-10 2q0-4 4-8z' }, 'dark')
  ],
  trompa: [
    s('ellipse', { cx: 66, cy: 62, rx: 40, ry: 36 }, 'gray', { accent: true }),
    s('path', { d: 'M86 80q4 40 24 50q14 4 18-10', ...SW(16) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 50q-18 10-6 40q14 6 20-10z' }, 'pink'),
    s('circle', { cx: 80, cy: 54, r: 5 }, 'dark'),
    s('path', { d: 'M96 92q8 4 14 0', ...SW(5) }, 'cream', { stroke: true })
  ],
  viruela: [
    s('circle', { cx: 80, cy: 80, r: 52 }, 'skin'),
    s('path', { d: 'M28 70q4-50 52-50t52 50q-20-28-52-28T28 70z' }, 'brown'),
    s('path', { d: dots([[62, 80], [98, 80]], 5) }, 'dark'),
    s('path', { d: 'M66 110q14-8 28 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[48, 96], [58, 108], [110, 96], [104, 112], [80, 64], [92, 120], [44, 82], [118, 80]], 4) }, 'red', { accent: true })
  ],
  visionario: [
    ground(),
    ...person(44, 136, 'blue', { accent: true }),
    s('path', { d: 'M56 84l46-24', ...SW(12) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 62l12-6', ...SW(16) }, 'dark', { stroke: true }),
    s('path', { d: star(128, 30, 12) }, 'yellow'),
    s('path', { d: sparkle(110, 26, 5) }, 'yellow')
  ],
  vocablo: [
    s('rect', { x: 26, y: 50, width: 80, height: 54, rx: 6, transform: 'rotate(-10 66 77)' }, 'yellow'),
    s('rect', { x: 50, y: 66, width: 84, height: 56, rx: 6 }, 'white'),
    s('rect', { x: 50, y: 66, width: 84, height: 56, rx: 6, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M64 90h56', ...SW(8) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M70 106h44', ...SW(3) }, 'gray', { stroke: true })
  ],
  'volátil': [
    s('path', { d: 'M68 60V34h24v26l30 64q2 12-10 12H48q-12 0-10-12z' }, 'white'),
    s('path', { d: 'M58 96h44l18 30q0 6-6 6H46q-6 0-6-6z' }, 'mint', { accent: true }),
    s('path', { d: 'M68 60V34h24v26l30 64q2 12-10 12H48q-12 0-10-12zM62 34h36', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M72 24q-8-6 0-12M88 24q8-6 0-12', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: dots([[110, 40], [122, 24], [40, 36]], 4) }, 'mint')
  ],
  acertar: [
    s('circle', { cx: 74, cy: 86, r: 52 }, 'red'),
    s('circle', { cx: 74, cy: 86, r: 36 }, 'white'),
    s('circle', { cx: 74, cy: 86, r: 20 }, 'red', { accent: true }),
    s('path', { d: 'M74 86l60-60', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M126 24l10-10 2 12 12 2-10 10z' }, 'yellow')
  ],
  acervo: [
    s('path', { d: rects([[24, 116, 70, 20]]) }, 'red'),
    s('path', { d: rects([[30, 96, 62, 20]]) }, 'blue', { accent: true }),
    s('path', { d: rects([[26, 76, 64, 20]]) }, 'green'),
    s('path', { d: rects([[34, 56, 52, 20]]) }, 'purple'),
    s('path', { d: 'M116 60q-14 6-14 30q0 30 10 46h20q10-16 10-46q0-24-14-30v-10h-12z' }, 'orange'),
    s('path', { d: 'M104 92h36', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M24 136h120', ...SW(4) }, 'gray', { stroke: true })
  ],
  acosador: [
    ground(),
    ...person(110, 136, 'pink'),
    s('path', { d: 'M106 72l-6-2M116 72l4-4', ...SW(2) }, 'dark', { stroke: true }),
    ...person(46, 136, 'dark', { accent: true }),
    s('path', { d: 'M40 70h12', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M66 50l8-12 4 10M84 46l10-8', ...SW(3) }, 'red', { stroke: true })
  ],
  afeitar: [
    s('circle', { cx: 70, cy: 80, r: 48 }, 'skin'),
    s('path', { d: 'M28 92q2 34 42 36q40-2 42-36q-10 10-20 6q-10 8-22 2q-12 6-22-2q-10 4-20-6z' }, 'white'),
    s('path', { d: 'M28 92q2 34 42 36q40-2 42-36', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[54, 70], [86, 70]], 5) }, 'dark'),
    s('rect', { x: 104, y: 70, width: 34, height: 12, rx: 3, transform: 'rotate(-30 121 76)' }, 'blue', { accent: true }),
    s('path', { d: 'M128 84l12 40', ...SW(8) }, 'blue', { stroke: true })
  ],
  agitar: [
    s('path', { d: 'M62 40h36l6 92H56z', transform: 'rotate(-15 80 86)' }, 'gray', { accent: true }),
    s('path', { d: 'M66 22h28v18H66z', transform: 'rotate(-15 80 86)' }, 'dark'),
    s('path', { d: 'M60 80h40', transform: 'rotate(-15 80 86)', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M30 50q-10 20 0 40M20 40q-14 30 0 60M122 70q10 20 0 40M132 60q14 30 0 60', ...SW(4) }, 'orange', { stroke: true })
  ],
  'aleación': [
    s('path', { d: 'M18 40h36l6 20H24z' }, 'gray'),
    s('path', { d: 'M106 40h36l-6 20h-36z' }, 'orange'),
    arrow('M44 70l20 22M116 70l-20 22', 'dark', 4),
    s('path', { d: 'M46 104h68l10 30H36z' }, 'yellow', { accent: true }),
    s('path', { d: 'M56 112h20', ...SW(4) }, 'cream', { stroke: true }),
    s('path', { d: sparkle(124, 104, 8) }, 'yellow')
  ],
  almacenaje: [
    s('path', { d: 'M22 136V24M138 136V24M22 56h116M22 96h116M22 134h116', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: rects([[30, 30, 28, 26], [62, 36, 24, 20], [94, 28, 36, 28], [32, 70, 40, 26], [80, 74, 26, 22], [110, 68, 22, 28], [30, 108, 26, 26], [104, 110, 28, 24]]) }, 'tan', { accent: true }),
    s('path', { d: 'M30 82h40M94 40h36M32 120h24', ...SW(2) }, 'brown', { stroke: true }),
    s('rect', { x: 62, y: 104, width: 36, height: 30, rx: 2 }, 'orange')
  ],
  'andén': [
    s('rect', { x: 14, y: 30, width: 72, height: 80, rx: 14 }, 'red', { accent: true }),
    s('path', { d: rects([[24, 42, 20, 22], [54, 42, 20, 22]]) }, 'sky'),
    s('path', { d: dots([[32, 112], [68, 112]], 7) }, 'dark'),
    s('path', { d: 'M14 120h132v20H14z' }, 'gray'),
    s('path', { d: 'M14 120h132', ...SW(5, { 'stroke-dasharray': '10 6' }) }, 'yellow', { stroke: true }),
    ...person(116, 120, 'blue', { h: 40, w: 24, r: 11 })
  ],
  anticipar: [
    s('path', { d: 'M90 36q0-18 20-18q14 0 18 10q16 0 16 14q0 12-14 12H96q-6 0-6-8z' }, 'gray'),
    s('path', { d: 'M104 62l-6 12M120 62l-6 12', ...SW(3) }, 'sky', { stroke: true }),
    ...person(60, 140, 'green', { h: 40 }),
    s('path', { d: 'M20 64q40-40 80 0z' }, 'red', { accent: true }),
    s('path', { d: 'M60 64v34', ...SW(4) }, 'dark', { stroke: true }),
    arrow('M120 96h-28m8-8-8 8 8 8', 'orange', 4)
  ],
  'antropólogo': [
    ...person(54, 136, 'tan', { accent: true }),
    s('path', { d: 'M34 64h40M42 64q2-12 12-12t12 12', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M68 100l20-12', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 96, cy: 82, r: 10, ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 136q-12-6-10-24q2-14 14-18h12q12 4 14 18q2 18-10 24z' }, 'orange'),
    s('path', { d: 'M104 116h32', ...DASH(3, '4 4') }, 'brown', { stroke: true })
  ],
  atadura: [
    s('path', { d: 'M14 80h48M98 80h48', ...SW(10) }, 'tan', { stroke: true }),
    s('path', { d: 'M62 80q0-24 18-24t18 24q0 24-18 24t-18-24z', ...SW(10) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M70 66l20 28M90 66l-20 28', ...SW(8) }, 'tan', { stroke: true }),
    s('path', { d: 'M62 104l-10 24M98 104l10 24', ...SW(8) }, 'tan', { stroke: true })
  ],
  bastar: [
    s('path', { d: 'M60 140V74q0-8 8-8t8 8V40q0-8 8-8t8 8v34-40q0-8 8-8t8 8v44-34q0-8 8-8t8 8v62q0 22-22 22H80q-20 0-20-12z' }, 'skin'),
    s('circle', { cx: 46, cy: 50, r: 30 }, 'red', { accent: true }),
    s('path', { d: 'M30 50h32', ...SW(8) }, 'white', { stroke: true })
  ],
  cableado: [
    s('rect', { x: 52, y: 24, width: 56, height: 46, rx: 6 }, 'gray', { accent: true }),
    s('path', { d: dots([[66, 60], [80, 60], [94, 60]], 4) }, 'dark'),
    s('path', { d: 'M66 64q0 40-40 60', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M80 64q0 50 10 72', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M94 64q4 40 42 54', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M60 34h40', ...SW(3) }, 'white', { stroke: true })
  ],
  calzoncillo: [
    s('path', { d: 'M28 40h104v20l8 62H90l-10-40-10 40H20l8-62z' }, 'sky', { accent: true }),
    s('path', { d: 'M28 40h104v14H28z' }, 'navy'),
    s('path', { d: dots([[46, 80], [110, 76], [56, 104], [112, 106]], 5) }, 'blue')
  ],
  carroza: [
    s('path', { d: 'M38 104q-8-60 42-62q50 2 42 62z' }, 'orange', { accent: true }),
    s('path', { d: 'M80 42v-14M74 30h12', ...SW(4) }, 'yellow', { stroke: true }),
    s('rect', { x: 64, y: 62, width: 32, height: 26, rx: 12 }, 'sky'),
    s('path', { d: 'M60 44q-6 30 0 60M100 44q6 30 0 60', ...SW(3) }, 'brown', { stroke: true }),
    s('circle', { cx: 52, cy: 116, r: 18, ...SW(5) }, 'yellow', { stroke: true }),
    s('circle', { cx: 110, cy: 116, r: 18, ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: rays(52, 116, 0, 18, 6) + rays(110, 116, 0, 18, 6), ...SW(2) }, 'yellow', { stroke: true })
  ],
  'caótico': [
    s('path', { d: 'M26 40q30-20 40 10t40-10q20 20-10 40t20 30q-30 30-60 0t-20-30q-30-20-10-40', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 30, y: 100, width: 24, height: 24, rx: 3, transform: 'rotate(25 42 112)' }, 'red', { accent: true }),
    s('path', { d: star(120, 120, 14) }, 'yellow'),
    s('circle', { cx: 122, cy: 34, r: 12 }, 'blue'),
    s('path', { d: 'M70 120l20-30 14 24z' }, 'green'),
    s('path', { d: 'M18 74l10-6M140 70l-6 10', ...SW(4) }, 'orange', { stroke: true })
  ],
  'cesárea': [
    s('circle', { cx: 80, cy: 38, r: 16 }, 'skin'),
    s('path', { d: 'M64 32q16-14 32 0z' }, 'green'),
    s('path', { d: 'M68 42h24v8H68z' }, 'mint'),
    s('rect', { x: 52, y: 58, width: 56, height: 82, rx: 18 }, 'green', { accent: true }),
    s('path', { d: ells([[80, 94, 30, 16]]) }, 'cream'),
    s('circle', { cx: 60, cy: 92, r: 11 }, 'skin'),
    s('path', { d: 'M50 102q30 20 60-6', ...SW(7) }, 'skin', { stroke: true })
  ],
  'coacción': [
    ground(),
    ...person(52, 136, 'navy', { h: 60, w: 36, r: 14 }),
    s('path', { d: 'M66 72l40 14', ...SW(9) }, 'skin', { stroke: true }),
    s('circle', { cx: 112, cy: 98, r: 11 }, 'skin'),
    s('rect', { x: 98, y: 110, width: 28, height: 26, rx: 9 }, 'purple', { accent: true }),
    arrow('M138 60v26m-7-7 7 7 7-7', 'red', 5)
  ],
  concerniente: [
    s('circle', { cx: 40, cy: 80, r: 24 }, 'blue', { accent: true }),
    s('rect', { x: 100, y: 56, width: 44, height: 48, rx: 8 }, 'orange'),
    s('path', { d: 'M64 80h36', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 66, y: 72, width: 18, height: 16, rx: 8, ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 78, y: 72, width: 18, height: 16, rx: 8, ...SW(5) }, 'dark', { stroke: true })
  ],
  'concienciación': [
    s('path', { d: 'M80 116L56 64q-6-30 24-32q30 2 24 32L64 140', ...SW(14) }, 'pink', { stroke: true, accent: true }),
    s('path', { d: 'M104 64L96 140', ...SW(14) }, 'pink', { stroke: true }),
    s('path', { d: 'M80 116L56 64', ...SW(14) }, 'pink', { stroke: true }),
    s('path', { d: sparkle(30, 40, 10) + sparkle(130, 40, 10) }, 'yellow'),
    s('path', { d: busts([28, 132], 140, 20, 24) }, 'blue'),
    s('path', { d: dots([[28, 106], [132, 106]], 8) }, 'skin')
  ],
  confrontar: [
    ground(),
    ...lean(46, 136, 12, 'red', { accent: true }),
    ...lean(114, 136, -12, 'blue'),
    s('path', { d: burst(80, 62, 14, 6, 8) }, 'yellow'),
    s('path', { d: 'M52 70l8 2M108 70l-8 2', ...SW(3) }, 'dark', { stroke: true })
  ],
  'congelación': [
    s('rect', { x: 26, y: 40, width: 80, height: 80, rx: 12 }, 'sky', { accent: true }),
    s('path', { d: 'M38 56l14-6M38 68l8-4', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M118 26v52M96 40l44 24M96 64l44-24', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M110 30l8 6 8-6M110 74l8-6 8 6', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M24 134h112', ...SW(4) }, 'gray', { stroke: true })
  ],
  contagioso: [
    ...person(40, 140, 'green', { accent: true }),
    s('path', { d: 'M46 78q6 4 4 8', ...SW(3) }, 'dark', { stroke: true }),
    ...person(122, 140, 'blue'),
    s('path', { d: dots([[66, 70], [78, 80], [90, 66], [84, 94], [100, 82]], 5) }, 'mint'),
    s('path', { d: rays(66, 70, 5, 9, 6) + rays(90, 66, 5, 9, 6), ...SW(2) }, 'green', { stroke: true })
  ],
  cuadrante: [
    s('path', { d: wedge(80, 80, 56, -90, 0) }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 56, ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M16 80h128M80 16v128', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M138 74l6 6-6 6M74 22l6-6 6 6', ...SW(4) }, 'dark', { stroke: true })
  ],
  datar: [
    s('rect', { x: 24, y: 30, width: 92, height: 100, rx: 8 }, 'white'),
    s('rect', { x: 24, y: 30, width: 92, height: 100, rx: 8, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 38a8 8 0 0 1 8-8h76a8 8 0 0 1 8 8v20H24z' }, 'red', { accent: true }),
    s('path', { d: 'M46 22v16M94 22v16', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: rects([[36, 70, 14, 12], [58, 70, 14, 12], [80, 70, 14, 12], [36, 94, 14, 12], [58, 94, 14, 12]]) }, 'gray'),
    s('path', { d: 'M110 104h28l-14 18zM110 140h28l-14-18z' }, 'tan'),
    s('rect', { x: 80, y: 94, width: 14, height: 12 }, 'orange')
  ],
  delictivo: [
    ...person(70, 140, 'dark', { accent: true }),
    s('path', { d: 'M56 70h28', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M98 112q-12-30 14-34q4-6 12 0q26 4 14 34z' }, 'tan'),
    s('path', { d: 'M108 82h16', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 118, cy: 98, r: 7 }, 'green'),
    s('path', { d: 'M86 100l14 4', ...SW(7) }, 'skin', { stroke: true })
  ],
  demorar: [
    s('circle', { cx: 100, cy: 52, r: 36 }, 'white'),
    s('circle', { cx: 100, cy: 52, r: 36, ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 52V30M100 52l14 10', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: ells([[60, 114, 22, 20]]) }, 'brown'),
    s('path', { d: 'M18 136h76q8 0 8-8l-4-4q-4 6-12 6H24z' }, 'tan'),
    s('path', { d: 'M90 126l4-20M98 124l6-16', ...SW(3) }, 'tan', { stroke: true })
  ],
  derechista: [
    s('rect', { x: 18, y: 96, width: 124, height: 20, rx: 10 }, 'gray'),
    s('rect', { x: 84, y: 96, width: 58, height: 20, rx: 10 }, 'blue', { accent: true }),
    ...person(118, 92, 'blue', { h: 34, w: 24, r: 10 }),
    arrow('M30 40h60m-10-10 10 10-10 10', 'orange', 6)
  ],
  descalzo: [
    s('path', { d: 'M30 130q-10-40 4-76q10-14 22 0q10 30-2 76z' }, 'skin', { accent: true }),
    s('path', { d: 'M76 130q-10-40 4-76q10-14 22 0q10 30-2 76z' }, 'skin'),
    s('path', { d: dots([[34, 48], [44, 44], [52, 48], [80, 48], [90, 44], [98, 48]], 4) }, 'skin'),
    s('path', { d: 'M112 136h30v-10q-6-6-12-4l-8-10h-10z' }, 'brown'),
    s('path', { d: 'M110 100l34 30', ...SW(4) }, 'red', { stroke: true })
  ],
  descomunal: [
    ground(),
    s('path', { d: ells([[78, 92, 56, 44]]) }, 'orange', { accent: true }),
    s('path', { d: 'M60 52q-10 40 0 82M96 52q10 40 0 82M78 48v88', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M78 50q0-14 10-18', ...SW(6) }, 'green', { stroke: true }),
    ...person(140, 136, 'blue', { h: 16, w: 10, r: 5 })
  ],
  desmantelamiento: [
    s('path', { d: 'M24 136h60M34 136V80h40v56M34 108h40M34 80l40 28M34 108l40 28', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 130l40-10M100 112l30 14', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: dots([[110, 96], [128, 100]], 4) }, 'dark'),
    s('path', { d: 'M86 28l26 26', ...SW(8) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M80 18a12 12 0 1 0 16 16l-8-2-4-6z' }, 'blue'),
    s('path', { d: 'M54 60l-4-12M64 64l6-10', ...SW(3) }, 'orange', { stroke: true })
  ],
  desordenado: [
    s('path', { d: 'M18 136h124', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 30, y: 100, width: 40, height: 12, rx: 2, transform: 'rotate(-12 50 106)' }, 'red', { accent: true }),
    s('rect', { x: 36, y: 116, width: 44, height: 14, rx: 2, transform: 'rotate(8 58 123)' }, 'blue'),
    s('path', { d: 'M96 120l12-24h10l4 14h12v12l-14 0z' }, 'purple'),
    s('path', { d: 'M40 50l24 6-6 24-24-6z' }, 'cream'),
    s('path', { d: 'M90 44l22-10 10 22-22 10z' }, 'yellow'),
    s('path', { d: 'M124 80q8-6 14 2', ...SW(4) }, 'green', { stroke: true })
  ],
  discretamente: [
    ...face(80, 72, 46, 'skin', 'flat'),
    s('path', { d: 'M80 84v30', ...SW(10) }, 'tan', { stroke: true }),
    s('rect', { x: 66, y: 110, width: 28, height: 26, rx: 10 }, 'tan', { accent: true }),
    s('path', { d: 'M24 58q-8 8 0 16M136 58q8 8 0 16', ...DASH(3, '3 4') }, 'gray', { stroke: true })
  ],
  domiciliario: [
    s('path', { d: 'M20 80l50-44 50 44z' }, 'red'),
    s('rect', { x: 30, y: 80, width: 80, height: 56 }, 'cream'),
    s('rect', { x: 58, y: 96, width: 24, height: 40 }, 'brown'),
    s('rect', { x: 108, y: 108, width: 34, height: 28, rx: 3 }, 'tan', { accent: true }),
    s('path', { d: 'M108 120h34M125 108v12', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  dondequiera: [
    s('circle', { cx: 80, cy: 84, r: 54 }, 'sky'),
    s('path', { d: 'M50 50q20 10 14 30t-24 20q-14-10-10-30zM96 60q24 0 30 20q-6 30-30 34q-8-20 0-54z' }, 'green'),
    s('path', { d: 'M40 40a10 10 0 1 1 20 0q0 8-10 20q-10-12-10-20zM96 36a10 10 0 1 1 20 0q0 8-10 20q-10-12-10-20zM70 96a10 10 0 1 1 20 0q0 8-10 20q-10-12-10-20z' }, 'red', { accent: true }),
    s('path', { d: dots([[50, 40], [106, 36], [80, 96]], 4) }, 'white')
  ],
  duelo: [
    s('path', { d: 'M80 70l-30 70 16-6 6 14 24-62zM80 70l30 70-16-6-6 14-24-62z' }, 'dark', { accent: true }),
    s('path', { d: 'M80 74q-30-30-14-50q14-6 14 14q0-20 14-14q16 20-14 50z' }, 'dark'),
    s('path', { d: 'M126 40v40', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: ells([[126, 34, 10, 12]]) }, 'white'),
    s('path', { d: ells([[126, 34, 10, 12]]), ...SW(2) }, 'gray', { stroke: true })
  ],
  'efímero': [
    s('circle', { cx: 60, cy: 76, r: 36 }, 'sky'),
    s('circle', { cx: 60, cy: 76, r: 36, ...SW(3) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M42 58q8-10 18-10', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: rays(118, 104, 12, 22, 8), ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: dots([[118, 80], [140, 104], [100, 120], [136, 124]], 3) }, 'sky')
  ],
  'empírico': [
    s('path', { d: 'M38 30h24M44 30v34l-20 54q-2 12 10 12h32q12 0 10-12L56 64V30' }, 'white'),
    s('path', { d: 'M36 92h48l10 26q2 12-10 12H36q-12 0-10-12z' }, 'green', { accent: true }),
    s('path', { d: 'M38 30h24M44 30v34l-20 54q-2 12 10 12h32q12 0 10-12L56 64V30', ...SW(4) }, 'gray', { stroke: true }),
    ...paper(96, 40, 46, 60),
    s('path', { d: 'M104 54l4 4 8-8M104 72l4 4 8-8M104 90l4 4 8-8', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M122 54h12M122 72h12M122 90h12', ...SW(3) }, 'gray', { stroke: true })
  ],
  enemistad: [
    ...face(40, 80, 26, 'orange', 'frown', { accent: true }),
    ...face(120, 80, 26, 'purple', 'frown'),
    s('path', { d: 'M28 66l10 6M52 66l-10 6M108 66l10 6M132 66l-10 6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M84 50l-10 26h12l-8 28 18-34H84l8-20z' }, 'yellow')
  ],
  engordar: [
    s('rect', { x: 30, y: 84, width: 100, height: 52, rx: 12 }, 'gray', { accent: true }),
    s('path', { d: 'M54 104a26 26 0 0 1 52 0z' }, 'white'),
    s('path', { d: 'M80 104l14-16', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: ells([[80, 54, 30, 26]]) }, 'pink'),
    s('circle', { cx: 80, cy: 22, r: 10 }, 'skin'),
    arrow('M138 70V30m-8 8 8-8 8 8', 'red', 5)
  ],
  envejecer: [
    ground(),
    ...person(40, 136, 'green', { h: 40, w: 26 }),
    arrow('M64 92h24m-8-8 8 8-8 8', 'orange', 4),
    ...lean(116, 136, 12, 'purple', { accent: true, h: 40, w: 26 }),
    s('path', { d: 'M114 42q8-4 16 2', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M140 136V92q0-6-6-6', ...SW(4) }, 'brown', { stroke: true })
  ],
  errante: [
    s('path', { d: 'M18 136q40-20 60-4t66-10', ...SW(6) }, 'tan', { stroke: true }),
    ...lean(60, 128, 8, 'brown', { accent: true }),
    s('path', { d: 'M66 76l30-34', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 100, cy: 38, r: 12 }, 'red'),
    s('path', { d: 'M120 60l10-20 10 20z' }, 'green')
  ],
  esperma: [
    s('circle', { cx: 116, cy: 80, r: 30 }, 'pink', { accent: true }),
    s('path', { d: ells([[60, 50, 8, 6], [56, 82, 8, 6], [66, 112, 8, 6]]) }, 'sky'),
    s('path', { d: 'M52 50q-10-8-20 0t-16 0M48 82q-10-8-20 0t-14 0M58 112q-10-8-20 0t-16 0', ...SW(3) }, 'sky', { stroke: true })
  ],
  estrechar: [
    s('path', { d: 'M14 90h40', ...SW(18) }, 'blue', { stroke: true }),
    s('path', { d: 'M106 72h40', ...SW(18) }, 'orange', { stroke: true }),
    s('path', { d: 'M52 82l26-12q14-4 30 8l-10 22q-20 10-34 4l-12-6z' }, 'skin', { accent: true }),
    s('path', { d: 'M78 80l14 10M72 88l12 8', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: sparkle(80, 40, 10) }, 'yellow')
  ],
  estuche: [
    s('rect', { x: 18, y: 66, width: 124, height: 56, rx: 20 }, 'purple', { accent: true }),
    s('path', { d: 'M24 82h112', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M40 66l20-40 6 4-14 36z' }, 'yellow'),
    s('path', { d: 'M72 66l14-44 8 2-10 42z' }, 'red'),
    s('path', { d: 'M100 66l20-36 6 4-14 32z' }, 'blue'),
    s('circle', { cx: 132, cy: 82, r: 5 }, 'gray')
  ],
  excluyente: [
    s('circle', { cx: 46, cy: 80, r: 30 }, 'blue', { accent: true }),
    s('circle', { cx: 114, cy: 80, r: 30 }, 'orange'),
    s('path', { d: 'M80 30v100', ...SW(6) }, 'red', { stroke: true }),
  ],
  expiatorio: [
    s('path', { d: 'M40 70h70q16 0 16 16v20q0 10-12 10H44q-14 0-14-14V82q0-12 10-12z' }, 'cream'),
    s('path', { d: 'M46 116v22M60 116v22M98 116v22M112 116v22', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 72l10-26q10-6 18 4l2 22q-6 8-14 4z' }, 'cream', { accent: true }),
    s('path', { d: 'M116 48q-6-22-20-24M128 46q2-22 14-24', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M136 76q2 12-4 16', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 128, cy: 56, r: 3 }, 'dark'),
    s('path', { d: 'M40 70h70q16 0 16 16v20q0 10-12 10H44q-14 0-14-14V82q0-12 10-12z', ...SW(3) }, 'gray', { stroke: true })
  ],
  federalismo: [
    s('path', { d: wedge(80, 80, 56, -90, -18) }, 'blue'),
    s('path', { d: wedge(80, 80, 56, -18, 54) }, 'green'),
    s('path', { d: wedge(80, 80, 56, 54, 126) }, 'orange'),
    s('path', { d: wedge(80, 80, 56, 126, 198) }, 'purple'),
    s('path', { d: wedge(80, 80, 56, 198, 270) }, 'red'),
    s('circle', { cx: 80, cy: 80, r: 56, ...SW(6) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 20 }, 'yellow', { accent: true })
  ],
  feudo: [
    s('path', { d: 'M14 136q40-50 66-50t66 50z' }, 'green'),
    s('path', { d: 'M54 90V50h10v8h8v-8h16v8h8v-8h10v40z' }, 'gray', { accent: true }),
    s('path', { d: 'M74 90V72q6-8 12 0v18z' }, 'dark'),
    s('path', { d: 'M80 50V30', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 30h16l-4 6 4 6H80z' }, 'red'),
    s('path', { d: 'M24 128l30-14M136 128l-30-14', ...SW(3) }, 'yellow', { stroke: true })
  ],
  fotocopia: [
    s('rect', { x: 22, y: 50, width: 116, height: 70, rx: 8 }, 'gray', { accent: true }),
    s('rect', { x: 22, y: 40, width: 116, height: 14, rx: 4 }, 'dark'),
    s('path', { d: 'M40 120h80v18H40z' }, 'navy'),
    ...paper(108, 70, 40, 30),
    s('path', { d: 'M114 80h26M114 90h18', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 62h50', ...SW(4) }, 'green', { stroke: true })
  ],
  'frigorífico': [
    s('rect', { x: 44, y: 14, width: 72, height: 132, rx: 10 }, 'white'),
    s('rect', { x: 44, y: 14, width: 72, height: 132, rx: 10, ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M44 60h72', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M56 30v16M56 76v30', ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: sparkle(96, 36, 8) }, 'sky')
  ],
  gramatical: [
    s('rect', { x: 14, y: 70, width: 40, height: 28, rx: 6 }, 'blue', { accent: true }),
    s('rect', { x: 60, y: 70, width: 30, height: 28, rx: 14 }, 'red'),
    s('path', { d: 'M96 70h40l10 14-10 14H96z' }, 'green'),
    s('path', { d: 'M24 84h20M70 84h10M104 84h24', ...SW(4) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 128, r: 14 }, 'yellow'),
    s('path', { d: 'M73 128l5 5 9-10', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M34 60q46-30 92 0', ...DASH(3, '4 5') }, 'gray', { stroke: true })
  ],
  gratuidad: [
    s('rect', { x: 26, y: 70, width: 80, height: 66, rx: 6 }, 'red', { accent: true }),
    s('rect', { x: 20, y: 56, width: 92, height: 18, rx: 4 }, 'red'),
    s('path', { d: 'M66 56v80', ...SW(10) }, 'yellow', { stroke: true }),
    s('path', { d: 'M66 54q-24-24-24-6t24 6q24-24 24-6t-24 6', ...SW(5) }, 'yellow', { stroke: true }),
    s('circle', { cx: 124, cy: 42, r: 18 }, 'yellow'),
    s('path', { d: 'M108 26l32 32', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 124, cy: 42, r: 18, ...SW(4) }, 'orange', { stroke: true })
  ],
  'herejía': [
    ...openBook(80, 20, 'cream', 'navy'),
    arrow('M24 104h30m-8-8 8 8-8 8', 'gray', 5),
    arrow('M24 130h30m-8-8 8 8-8 8', 'gray', 5),
    arrow('M66 117h30m-8-8 8 8-8 8', 'gray', 5),
    arrow('M140 117h-30m8-8-8 8 8 8', 'red', 6),
    s('circle', { cx: 125, cy: 117, r: 18 }, 'yellow', { accent: true })
  ],
  humillar: [
    ground(),
    ...person(52, 136, 'navy', { h: 56, w: 32, r: 13 }),
    s('path', { d: 'M66 90l30 6', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 110, cy: 106, r: 10 }, 'skin'),
    s('path', { d: 'M100 136v-14q0-8 10-8h10q8 0 8 8v14z' }, 'gray', { accent: true }),
    s('path', { d: drop(122, 92, 4) }, 'sky'),
    s('path', { d: 'M46 54q6 6 12 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  improvisar: [
    s('path', { d: ells([[56, 102, 30, 28], [72, 70, 20, 18]]) }, 'orange', { accent: true }),
    s('circle', { cx: 60, cy: 92, r: 9 }, 'dark'),
    s('path', { d: 'M74 70l50-50', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M60 100l52-52', ...SW(1.5) }, 'cream', { stroke: true }),
    ...note(112, 82, 'purple'),
    s('path', { d: sparkle(130, 120, 8) }, 'yellow'),
    ...note(22, 40, 'blue')
  ],
  'impugnación': [
    s('path', { d: 'M40 140v-50q0-6 6-6t6 6v-40q0-6 6-6t6 6v34-44q0-6 6-6t6 6v44-36q0-6 6-6t6 6v62q0 26-22 30z' }, 'skin', { accent: true }),
    s('path', { d: 'M40 106q-14-10-20 0l20 24', ...SW(10) }, 'skin', { stroke: true }),
    s('rect', { x: 100, y: 96, width: 36, height: 18, rx: 4, transform: 'rotate(-30 118 105)' }, 'brown'),
    s('path', { d: 'M124 114l18 22', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 76l-6-10M114 74l4-12M88 86l-10-4', ...SW(3) }, 'red', { stroke: true })
  ],
  impulsor: [
    s('path', { d: 'M80 14q24 20 24 60v34H56V74q0-40 24-60z' }, 'white'),
    s('path', { d: 'M80 14q24 20 24 60v34H56V74q0-40 24-60z', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 60, r: 10 }, 'sky'),
    s('path', { d: 'M56 84l-18 26h18zM104 84l18 26h-18z' }, 'red'),
    s('path', { d: 'M62 110h36l-18 38z' }, 'orange', { accent: true }),
    s('path', { d: 'M72 112h16l-8 20z' }, 'yellow')
  ],
  inepto: [
    s('path', { d: 'M18 136h124', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 136v-26l-14-10', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 120L84 60', ...SW(8) }, 'brown', { stroke: true }),
    s('rect', { x: 70, y: 40, width: 40, height: 18, rx: 3, transform: 'rotate(35 90 49)' }, 'dark'),
    s('path', { d: 'M30 112q10-14 26-6l-6 20q-16 4-20-14z' }, 'skin', { accent: true }),
    s('path', { d: star(36, 84, 7) + star(58, 80, 5) }, 'yellow')
  ],
  insultante: [
    ...face(60, 70, 40, 'orange', 'flat', { accent: true }),
    s('path', { d: 'M54 86h14v10q0 6-7 6t-7-6z' }, 'red'),
    s('path', { d: 'M40 58l14 4M80 58l-14 4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M120 92v-6q0-8 8-8h8v40h-14l-6-12z' }, 'skin'),
    s('path', { d: 'M124 116v22', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M104 82h20', ...SW(6) }, 'skin', { stroke: true })
  ],
  'jazmín': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'mint'),
    s('path', { d: leaflet(40, 120, -30, 40, 10) + leaflet(120, 120, 210, 40, 10) + leaflet(80, 130, -90, 30, 8) }, 'green'),
    s('path', { d: star(56, 64, 22, 10) + star(106, 76, 20, 9) }, 'white', { accent: true }),
    s('path', { d: star(76, 108, 14, 6) }, 'white'),
    s('path', { d: dots([[56, 66], [106, 78], [76, 109]], 4) }, 'yellow')
  ],
  jengibre: [
    s('path', { d: 'M18 98q0-16 18-14q4-16 20-10q10-14 26-4q16-8 24 6q22 0 20 18q-4 16-20 12q-6 14-24 8q-10 10-26 0q-20 4-22-10q-16 4-16-6z' }, 'tan', { accent: true }),
    s('path', { d: 'M46 90l-2 10M76 84v12M100 92l-4 10', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M108 50h32v10q0 18-16 18t-16-18z' }, 'white'),
    s('path', { d: 'M108 50h32v10q0 18-16 18t-16-18z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M118 42q-4-6 0-12M130 42q-4-6 0-12', ...SW(2) }, 'gray', { stroke: true })
  ],
  locomotora: [
    ground(),
    s('rect', { x: 26, y: 70, width: 80, height: 46, rx: 6 }, 'red', { accent: true }),
    s('rect', { x: 92, y: 44, width: 44, height: 72, rx: 4 }, 'navy'),
    s('rect', { x: 102, y: 54, width: 24, height: 20, rx: 3 }, 'sky'),
    s('rect', { x: 36, y: 46, width: 16, height: 24 }, 'dark'),
    s('path', { d: ells([[40, 34, 10, 7], [26, 24, 8, 6]]) }, 'gray'),
    s('path', { d: dots([[46, 122], [80, 122], [116, 122]], 12) }, 'dark')
  ],
  manicomio: [
    ground(),
    s('rect', { x: 24, y: 50, width: 112, height: 86 }, 'cream'),
    s('path', { d: 'M18 50l62-30 62 30z' }, 'gray'),
    s('path', { d: grid(34, 64, 4, 2, 14, 14, 26, 26) }, 'sky'),
    s('rect', { x: 68, y: 108, width: 24, height: 28 }, 'brown'),
    s('circle', { cx: 80, cy: 38, r: 10 }, 'white'),
    s('path', { d: spiral(77, 38), ...SW(2.5) }, 'purple', { stroke: true, accent: true })
  ],
  mercadotecnia: [
    s('path', { d: rects([[30, 100, 18, 36], [56, 84, 18, 52], [82, 64, 18, 72]]) }, 'blue', { accent: true }),
    arrow('M30 76l30-20 18 10 30-30m-14 0 14 0 0 14', 'green', 5),
    s('path', { d: 'M108 112l26-14v38l-26-14z' }, 'red'),
    s('rect', { x: 100, y: 110, width: 10, height: 14, rx: 2 }, 'gray'),
    s('path', { d: 'M18 136h124', ...SW(4) }, 'gray', { stroke: true })
  ],
  mesero: [
    ...person(64, 140, 'dark', { h: 56, w: 32, r: 13 }),
    s('path', { d: 'M58 88l6 4 6-4v8l-6-4-6 4z' }, 'red'),
    s('path', { d: 'M80 94l30-14', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M90 72h48', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M98 70a16 16 0 0 1 32 0z' }, 'gray', { accent: true }),
    s('path', { d: 'M48 104v20', ...SW(6) }, 'white', { stroke: true })
  ],
  'montañoso': [
    s('path', { d: 'M14 136l38-70 30 50 26-80 38 100z' }, 'green', { accent: true }),
    s('path', { d: 'M108 36l-10 30 10-6 8 8z' }, 'white'),
    s('path', { d: 'M52 66l-10 18 10-6 8 6z' }, 'white'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 36, cy: 34, r: 12 }, 'yellow')
  ],
  operario: [
    ...person(58, 140, 'orange', { accent: true, h: 54, w: 32 }),
    s('path', { d: 'M42 64a16 16 0 0 1 32 0z' }, 'yellow'),
    s('path', { d: 'M38 64h40', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M74 100l30-10', ...SW(7) }, 'skin', { stroke: true }),
    ...gear(118, 98, 12, 8, 'gray'),
    s('path', { d: 'M48 100v30', ...SW(4) }, 'navy', { stroke: true })
  ],
  oportunamente: [
    s('circle', { cx: 74, cy: 88, r: 46 }, 'white'),
    s('circle', { cx: 74, cy: 88, r: 46, ...SW(6) }, 'navy', { stroke: true }),
    s('path', { d: 'M66 30h16M74 30v12', ...SW(6) }, 'navy', { stroke: true }),
    s('path', { d: 'M74 88V58', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 120, cy: 120, r: 20 }, 'green', { accent: true }),
    s('path', { d: 'M110 120l7 7 13-14', ...SW(5) }, 'white', { stroke: true })
  ]
};
