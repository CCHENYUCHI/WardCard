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
};
