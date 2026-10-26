// Illustration specs for words still undrawn in batches 0107–0109 (see server/scripts/lexicon/art.js)
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
  aislante: [
    s('path', { d: 'M62 18l-14 26h12l-10 22 26-30H64l10-18z' }, 'yellow'),
    s('rect', { x: 18, y: 74, width: 96, height: 34, rx: 17 }, 'blue', { accent: true }),
    s('path', { d: 'M40 74v34M60 74v34M80 74v34', ...SW(3) }, 'navy', { stroke: true }),
    s('rect', { x: 106, y: 80, width: 14, height: 22, rx: 3 }, 'tan'),
    s('path', { d: 'M120 84h22M120 91h26M120 98h22', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M48 128l12-10M84 128l-12-10', ...SW(4) }, 'gray', { stroke: true })
  ],
  'albanés': [
    s('path', { d: 'M26 20v122', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 28, y: 24, width: 108, height: 76 }, 'red', { accent: true }),
    s('path', { d: 'M82 52L52 36l6 12-10 2 12 8-8 6 16 2 8 4v14l-6 8h20l-6-8V70l8-4 16-2-8-6 12-8-10-2 6-12z' }, 'black'),
    s('path', { d: dots([[76, 44], [88, 44]], 5) }, 'black')
  ],
  alcoba: [
    s('path', { d: 'M24 136V76a56 56 0 0 1 112 0v60z' }, 'purple'),
    s('path', { d: 'M88 34a12 12 0 1 0 8 20a10 10 0 1 1-8-20z' }, 'yellow'),
    s('rect', { x: 36, y: 80, width: 12, height: 56, rx: 3 }, 'brown'),
    s('rect', { x: 42, y: 102, width: 88, height: 18, rx: 4 }, 'white'),
    s('ellipse', { cx: 60, cy: 98, rx: 11, ry: 6 }, 'cream'),
    s('rect', { x: 72, y: 96, width: 60, height: 24, rx: 5 }, 'blue', { accent: true }),
    s('path', { d: 'M126 120v14', ...SW(5) }, 'brown', { stroke: true })
  ],
  aleluya: [
    s('path', { d: halfRays(80, 90, 52, 70, 9), ...SW(4) }, 'yellow', { stroke: true }),
    ...person(80, 138, 'orange', { accent: true }),
    s('path', { d: 'M68 98L50 64M92 98l18-34', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M74 76q6 6 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(30, 40, 9) + sparkle(130, 40, 9) + sparkle(80, 22, 7) }, 'yellow')
  ],
  argento: [
    s('path', { d: 'M26 134l6-24h40l6 24zM82 134l6-24h40l6 24z' }, 'gray'),
    s('path', { d: 'M54 108l6-24h40l6 24z' }, 'gray', { accent: true }),
    s('path', { d: 'M38 116h28M94 116h28M66 90h28', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: sparkle(116, 64, 10) + sparkle(40, 80, 7) + sparkle(132, 92, 5) }, 'sky')
  ],
  'aromático': [
    s('path', { d: 'M24 136l-4-26h44l-4 26z' }, 'orange'),
    s('path', { d: leaflet(42, 110, -90, 30, 8) + leaflet(42, 112, -130, 26, 7) + leaflet(42, 112, -50, 26, 7) }, 'green'),
    s('path', { d: 'M40 68q10-8 20 0t20 0 18-2M46 50q10-8 20 0t20 0 14-2M42 86q10-8 20 0t20 0 14 0', ...SW(4) }, 'purple', { stroke: true, accent: true }),
    s('circle', { cx: 126, cy: 66, r: 20 }, 'skin'),
    s('path', { d: 'M108 62l-8 8h10z' }, 'skin'),
    s('path', { d: 'M118 58q4 3 8 0M120 76q4 3 8 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  arquetipo: [
    s('rect', { x: 24, y: 112, width: 56, height: 24, rx: 3 }, 'gray'),
    ...person(52, 112, 'yellow', { accent: true, h: 40 }),
    s('path', { d: 'M84 64h16', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M98 56l10 8-10 8z' }, 'orange'),
    s('path', { d: busts([112, 138], 136, 20, 40) + ring(112, 84, 9) + ring(138, 84, 9), ...DASH(3, '4 4') }, 'gray', { stroke: true })
  ],
  'austríaco': [
    s('path', { d: 'M26 20v122', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 28, y: 24, width: 108, height: 24 }, 'red', { accent: true }),
    s('rect', { x: 28, y: 48, width: 108, height: 24 }, 'white'),
    s('rect', { x: 28, y: 72, width: 108, height: 24 }, 'red'),
    outline({ x: 28, y: 24, width: 108, height: 72 })
  ],
  autoayuda: [
    ...person(80, 138, 'mint'),
    s('path', { d: 'M66 100l26 14M94 100l-26 14', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M74 76q6 5 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: heart(80, 40, 14) }, 'red', { accent: true }),
    s('path', { d: 'M40 74a44 44 0 0 1 10-30M120 74a44 44 0 0 0-10-30', ...SW(4) }, 'pink', { stroke: true })
  ],
  'azafrán': [
    s('path', { d: 'M80 136V92', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 136, -105, 50, 4) + leaflet(80, 136, -75, 50, 4) }, 'green'),
    s('path', { d: leaflet(80, 96, -90, 46, 13) + leaflet(80, 96, -135, 42, 12) + leaflet(80, 96, -45, 42, 12) }, 'purple', { accent: true }),
    s('path', { d: 'M80 84L68 40M80 84V36M80 84l12-44', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: dots([[68, 40], [80, 36], [92, 40]], 4) }, 'orange')
  ],
  'bibliográfico': [
    s('rect', { x: 20, y: 114, width: 60, height: 16, rx: 2 }, 'red'),
    s('rect', { x: 26, y: 98, width: 52, height: 16, rx: 2 }, 'blue', { accent: true }),
    s('rect', { x: 18, y: 82, width: 58, height: 16, rx: 2 }, 'green'),
    s('rect', { x: 28, y: 66, width: 46, height: 16, rx: 2 }, 'orange'),
    ...paper(88, 22, 54, 112),
    s('path', { d: dots([[98, 40], [98, 60], [98, 80], [98, 100], [98, 120]], 3) }, 'dark'),
    s('path', { d: 'M106 40h28M106 60h22M106 80h28M106 100h20M106 120h26', ...SW(4) }, 'gray', { stroke: true })
  ],
  bochorno: [
    backdrop('cream'),
    s('circle', { cx: 116, cy: 44, r: 18 }, 'orange'),
    s('path', { d: 'M24 70q8-6 16 0t16 0 16 0M28 92q8-6 16 0t16 0 16 0', ...SW(4) }, 'orange', { stroke: true }),
    s('rect', { x: 106, y: 76, width: 18, height: 56, rx: 9 }, 'white'),
    outline({ x: 106, y: 76, width: 18, height: 56, rx: 9 }),
    s('path', { d: 'M115 84v42', ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('path', { d: drop(48, 126, 6) + drop(70, 118, 5) }, 'sky')
  ],
  bochornoso: [
    s('circle', { cx: 80, cy: 80, r: 44 }, 'pink', { accent: true }),
    s('path', { d: 'M50 92q10 4 20 0M90 92q10 4 20 0', ...SW(4) }, 'red', { stroke: true }),
    s('rect', { x: 46, y: 56, width: 30, height: 26, rx: 10 }, 'skin'),
    s('rect', { x: 84, y: 56, width: 30, height: 26, rx: 10 }, 'skin'),
    s('path', { d: 'M70 108q10-6 20 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: drop(130, 50, 7) }, 'sky'),
    s('path', { d: 'M24 40l10 8M20 64h12M136 92h10M132 116l10 8', ...SW(4) }, 'orange', { stroke: true })
  ],
  boreal: [
    backdrop('navy'),
    s('path', { d: 'M18 64q30-30 62-10t62-14M18 84q30-30 62-10t62-14', ...SW(8) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M18 50q30-30 62-10t62-14', ...SW(4) }, 'mint', { stroke: true }),
    s('path', { d: star(124, 30, 7) + star(36, 30, 4) }, 'yellow'),
    s('path', { d: 'M14 146v-22q66-14 132 0v22z' }, 'white'),
    s('path', { d: 'M50 128l-12-22h6l-10-18h6l-8-14-8 14h6l-10 18h6l-12 22z' }, 'dark')
  ],
  'cagón': [
    ...person(60, 138, 'yellow', { accent: true }),
    s('path', { d: dots([[54, 76], [66, 76]], 4) }, 'dark'),
    s('ellipse', { cx: 60, cy: 86, rx: 4, ry: 3 }, 'dark'),
    s('path', { d: 'M34 70l-8-4M34 90h-10M36 110l-8 4M86 70l8-4M86 90h10', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: drop(44, 60, 4) }, 'sky'),
    s('path', { d: 'M108 136q0-16 16-16t16 16zM132 122a5 5 0 1 0 0-1' }, 'gray'),
    s('path', { d: 'M108 134q-8 2-10-6', ...SW(2) }, 'gray', { stroke: true })
  ],
  calentador: [
    s('path', { d: 'M48 56q-6-8 0-16t0-16M80 56q-6-8 0-16t0-16M112 56q-6-8 0-16t0-16', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M28 70h14v60H28zM46 70h14v60H46zM64 70h14v60H64zM82 70h14v60H82zM100 70h14v60h-14zM118 70h14v60h-14z' }, 'red', { accent: true }),
    s('path', { d: 'M24 82h112M24 118h112', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M34 130v8M126 130v8', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 140, cy: 118, r: 6 }, 'blue')
  ],
  'castración': [
    s('ellipse', { cx: 94, cy: 110, rx: 34, ry: 20 }, 'tan'),
    s('path', { d: 'M74 122v14M114 122v14M126 102q14-8 12-26', ...SW(8) }, 'tan', { stroke: true }),
    s('path', { d: 'M72 66L34 44v76l38-22z' }, 'sky', { accent: true }),
    s('circle', { cx: 58, cy: 82, r: 15 }, 'tan'),
    s('path', { d: 'M72 66L34 44v76l38-22z', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: dots([[54, 78], [44, 86]], 3) }, 'dark'),
    s('path', { d: 'M62 70l4-10 4 10', ...SW(3) }, 'brown', { stroke: true })
  ],
  chiquillo: [
    ground(),
    ...person(66, 136, 'green', { accent: true, h: 32, w: 24, r: 13 }),
    s('path', { d: 'M52 84a14 14 0 0 1 28 0zM78 84h12' }, 'red'),
    s('path', { d: 'M78 108l20 10', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 112, cy: 122, r: 14 }, 'orange'),
    s('path', { d: 'M98 122h28M112 108v28', ...SW(2) }, 'white', { stroke: true })
  ],
  chiringuito: [
    backdrop('sky'),
    s('rect', { x: 14, y: 96, width: 132, height: 16 }, 'blue'),
    s('rect', { x: 14, y: 112, width: 132, height: 34, rx: 0 }, 'tan'),
    s('path', { d: 'M46 132V68M114 132V68', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M28 70l20-34h64l20 34z' }, 'yellow', { accent: true }),
    s('path', { d: 'M28 70l6 10 6-10 6 10 6-10 6 10 6-10 6 10 6-10 6 10 6-10 6 10 6-10 6 10 6-10 6 10 6-10z' }, 'orange'),
    s('rect', { x: 40, y: 100, width: 80, height: 32, rx: 2 }, 'brown'),
    s('path', { d: 'M70 98l-4-16h12l-4 16z' }, 'orange')
  ],
  'cigüeña': [
    backdrop('sky'),
    s('ellipse', { cx: 74, cy: 64, rx: 34, ry: 13 }, 'white'),
    s('path', { d: 'M62 58L94 24l16 8-30 30z' }, 'white'),
    s('path', { d: 'M94 24l16 8-6 8-16-8z' }, 'dark'),
    s('path', { d: 'M100 64l18-10', ...SW(8) }, 'white', { stroke: true }),
    s('circle', { cx: 120, cy: 54, r: 7 }, 'white'),
    s('path', { d: 'M126 52l20 6-20 3zM42 68L18 76M44 72l-24 10', ...SW(3) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M138 60v22', ...SW(2) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 136, cy: 96, rx: 12, ry: 14 }, 'pink'),
    s('circle', { cx: 136, cy: 90, r: 5 }, 'skin')
  ],
  'circuncisión': [
    s('circle', { cx: 80, cy: 80, r: 40 }, 'pink'),
    s('path', { d: ring(80, 80, 52), ...DASH(4, '8 6') }, 'gray', { stroke: true }),
    s('path', { d: 'M118 30l20-20 6 6-20 20z' }, 'gray', { accent: true }),
    s('path', { d: 'M118 30l-8 8 4 4 10-6z' }, 'sky'),
    s('path', { d: 'M54 80h52M80 54v52', ...SW(8) }, 'white', { stroke: true }),
    s('rect', { x: 66, y: 66, width: 28, height: 28, rx: 4 }, 'cream')
  ],
  clavel: [
    s('path', { d: 'M80 136V74', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 120, -150, 34, 4) + leaflet(80, 108, -30, 34, 4) }, 'green'),
    s('path', { d: 'M70 82h20l-4-14h-12z' }, 'green'),
    s('path', { d: burst(80, 52, 34, 24, 16) }, 'red', { accent: true }),
    s('path', { d: burst(80, 50, 20, 13, 10) }, 'pink')
  ],
  coima: [
    s('rect', { x: 14, y: 54, width: 132, height: 14, rx: 3 }, 'brown'),
    s('path', { d: 'M24 68v70M136 68v70', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M14 100h46M146 112h-44', ...SW(14) }, 'skin', { stroke: true }),
    s('rect', { x: 58, y: 92, width: 42, height: 28, rx: 3 }, 'tan', { accent: true }),
    s('rect', { x: 64, y: 84, width: 30, height: 12, rx: 2 }, 'green'),
    s('path', { d: 'M58 92l21 14 21-14', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M74 36v8M86 36v8', ...SW(5) }, 'gray', { stroke: true })
  ],
  'cojín': [
    s('path', { d: 'M28 38q52-12 104 0q12 42 0 84q-52 12-104 0q-12-42 0-84z' }, 'orange', { accent: true }),
    s('path', { d: 'M40 52q40-8 80 0q8 28 0 56q-40 8-80 0q-8-28 0-56z', ...DASH(3, '5 5') }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 7 }, 'red'),
    s('path', { d: 'M28 38l-8-8M132 38l8-8M28 122l-8 8M132 122l8 8', ...SW(5) }, 'red', { stroke: true })
  ],
  compostura: [
    s('path', { d: 'M24 34q4-12 16-8q8-8 16 0q10-2 10 8z' }, 'gray'),
    s('path', { d: 'M44 34l-6 12h6l-4 10', ...SW(3) }, 'yellow', { stroke: true }),
    s('ellipse', { cx: 80, cy: 118, rx: 40, ry: 12 }, 'navy'),
    s('rect', { x: 64, y: 66, width: 32, height: 50, rx: 10 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 50, r: 14 }, 'skin'),
    s('path', { d: 'M73 50q3 3 6 0M81 50q3 3 6 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 80l-14 30h22M94 80l14 30H86', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M120 44a40 40 0 0 1 0 48M130 36a52 52 0 0 1 0 64', ...SW(3) }, 'mint', { stroke: true })
  ],
  copla: [
    s('path', { d: ells([[56, 110, 26, 24], [70, 82, 20, 18]]), transform: 'rotate(-35 62 98)' }, 'orange', { accent: true }),
    s('circle', { cx: 60, cy: 102, r: 8 }, 'dark'),
    s('path', { d: 'M76 86l50-50', ...SW(9) }, 'brown', { stroke: true }),
    s('path', { d: 'M52 112l70-70', ...SW(1) }, 'cream', { stroke: true }),
    ...note(110, 108, 'purple'),
    ...note(130, 74, 'blue')
  ],
  desesperar: [
    s('path', { d: 'M46 40q-2-14 14-14q4-12 20-8q12-8 22 4q16 0 14 18z' }, 'gray'),
    s('path', { d: 'M56 50l-4 10M76 50l-4 10M96 50l-4 10', ...SW(3) }, 'blue', { stroke: true }),
    s('rect', { x: 62, y: 96, width: 36, height: 40, rx: 12 }, 'purple', { accent: true }),
    s('circle', { cx: 80, cy: 84, r: 13 }, 'skin'),
    s('path', { d: 'M64 104l-2-22 8-8M96 104l2-22-8-8', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M74 90q6-4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 136h80', ...SW(4) }, 'gray', { stroke: true })
  ],
  desglose: [
    s('rect', { x: 24, y: 20, width: 52, height: 30 }, 'orange'),
    s('rect', { x: 76, y: 20, width: 36, height: 30 }, 'blue', { accent: true }),
    s('rect', { x: 112, y: 20, width: 24, height: 30 }, 'green'),
    s('path', { d: 'M50 56v20M94 56v20M124 56v20', ...DASH(3, '4 4') }, 'gray', { stroke: true }),
    s('rect', { x: 20, y: 84, width: 52, height: 52, rx: 4 }, 'orange'),
    s('rect', { x: 80, y: 100, width: 34, height: 36, rx: 4 }, 'blue'),
    s('rect', { x: 120, y: 112, width: 22, height: 24, rx: 4 }, 'green')
  ],
  desinteresado: [
    ...person(46, 138, 'green', { accent: true }),
    s('path', { d: 'M58 104l26-14', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: heart(96, 74, 16) }, 'red'),
    ...person(124, 138, 'orange', { h: 34, w: 24, r: 11 }),
    s('path', { d: 'M114 112l-8-14', ...SW(6) }, 'skin', { stroke: true })
  ],
  despistado: [
    ...person(66, 138, 'blue', { accent: true }),
    s('path', { d: 'M78 98l10-26-8-6', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: spiral(56, 34) + spiral(80, 30), ...SW(3) }, 'purple', { stroke: true }),
    s('path', { d: 'M60 74h4M70 74h4', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 122, cy: 120, r: 7 }, 'yellow'),
    s('path', { d: 'M126 124l12 10M134 128l-2 4', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M110 104l-6-6M122 98v-8M134 104l6-6', ...SW(3) }, 'gray', { stroke: true })
  ],
  digitalmente: [
    s('rect', { x: 40, y: 16, width: 72, height: 124, rx: 10 }, 'dark'),
    s('rect', { x: 46, y: 26, width: 60, height: 100, rx: 3 }, 'sky'),
    s('path', { d: rects([[52, 34, 12, 12], [70, 34, 12, 12], [88, 52, 12, 12], [52, 70, 12, 12], [70, 70, 12, 12], [88, 88, 12, 12], [70, 106, 12, 12]]) }, 'blue', { accent: true }),
    s('path', { d: 'M120 140l-22-30a7 7 0 0 1 12-8l8 10V88a6 6 0 0 1 12 0v30l10 4-6 18z' }, 'skin'),
    s('path', { d: ring(100, 104, 12), ...SW(3) }, 'yellow', { stroke: true })
  ],
  diminutivo: [
    ground(),
    s('path', { d: 'M18 82l34-30 34 30v54H18z' }, 'blue'),
    s('rect', { x: 42, y: 104, width: 20, height: 32 }, 'navy'),
    s('path', { d: 'M92 96h18', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M108 88l10 8-10 8z' }, 'orange'),
    s('path', { d: 'M122 120l12-11 12 11v16h-24z' }, 'red', { accent: true }),
    s('rect', { x: 130, y: 126, width: 8, height: 10 }, 'navy')
  ],
  esmero: [
    s('path', { d: 'M46 70l16-22h36l16 22-34 44z' }, 'sky', { accent: true }),
    s('path', { d: 'M46 70h68M62 48l10 22 8 44 8-44 10-22', ...SW(2) }, 'blue', { stroke: true }),
    s('path', { d: 'M88 112q20-6 36 6q8 10 0 20H84q-8-14 4-26z' }, 'yellow'),
    s('path', { d: 'M100 140l10-18h20l4 18z' }, 'skin'),
    s('path', { d: sparkle(30, 40, 10) + sparkle(128, 34, 8) + sparkle(36, 104, 6) }, 'yellow')
  ],
  fiscalizar: [
    ...paper(24, 18, 76, 112),
    s('path', { d: 'M36 36h52M36 52h40M36 68h52M36 84h44M36 100h52', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 112l26 26', ...SW(10) }, 'brown', { stroke: true }),
    s('circle', { cx: 94, cy: 94, r: 24 }, 'sky'),
    s('path', { d: ring(94, 94, 24), ...SW(6) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M84 94l8 8 14-16', ...SW(4) }, 'green', { stroke: true })
  ],
  'glúteo': [
    s('path', { d: 'M54 96v40M106 96v40', ...SW(22) }, 'skin', { stroke: true }),
    s('path', { d: 'M40 40h80l6 42q-2 26-24 26q-16 0-22-12q-6 12-22 12q-22 0-24-26z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 56v40', ...SW(3) }, 'navy', { stroke: true }),
    s('rect', { x: 38, y: 32, width: 84, height: 12, rx: 4 }, 'navy'),
    s('path', { d: 'M28 64q-10 16 0 32M132 64q10 16 0 32', ...SW(4) }, 'orange', { stroke: true })
  ],
  granate: [
    s('path', { d: 'M40 62l18-26h44l18 26-40 52z' }, 'red', { accent: true }),
    s('path', { d: 'M40 62h80M58 36l8 26 14 52 14-52 8-26M66 62l14-26 14 26', ...SW(2) }, 'pink', { stroke: true }),
    s('path', { d: drop(34, 128, 6) + drop(56, 132, 6) + drop(104, 130, 6) + drop(126, 126, 6) }, 'red'),
    s('path', { d: sparkle(126, 34, 8) }, 'yellow')
  ],
  grial: [
    s('path', { d: halfRays(80, 60, 44, 62, 9), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M48 36h64q0 40-32 46q-32-6-32-46z' }, 'yellow', { accent: true }),
    s('path', { d: 'M74 80h12v34H74z' }, 'orange'),
    s('path', { d: 'M54 132q2-18 26-18t26 18z' }, 'yellow'),
    s('path', { d: dots([[68, 52], [92, 52]], 5) }, 'red'),
    s('circle', { cx: 80, cy: 58, r: 6 }, 'blue')
  ],
  hampa: [
    backdrop('navy'),
    s('path', { d: 'M124 136V40h-14', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 40h20l-4 8h-12z' }, 'yellow'),
    s('path', { d: 'M82 136l20-84h16l20 84z' }, 'yellow', { accent: true }),
    s('path', { d: busts([46, 82], 138, 28, 52) + dots([[46, 80], [82, 80]], 12) }, 'black'),
    s('path', { d: 'M30 72h32M66 72h32M36 72q0-16 10-16t10 16M72 72q0-16 10-16t10 16' }, 'dark')
  ],
  hemoglobina: [
    s('path', { d: ells([[54, 66, 30, 22], [108, 100, 30, 22]]) }, 'red', { accent: true }),
    s('path', { d: ells([[54, 66, 14, 8], [108, 100, 14, 8]]) }, 'pink'),
    s('ellipse', { cx: 58, cy: 118, rx: 20, ry: 9 }, 'red'),
    s('path', { d: drop(118, 44, 12) }, 'red'),
    s('path', { d: 'M114 34l4 6', ...SW(3) }, 'white', { stroke: true })
  ],
  impar: [
    s('path', { d: 'M24 46h52M24 82h52M24 118h52', ...SW(26) }, 'mint', { stroke: true }),
    s('path', { d: dots([[38, 46], [62, 46], [38, 82], [62, 82], [38, 118], [62, 118]], 10) }, 'blue'),
    s('path', { d: ring(118, 82, 22), ...DASH(3, '5 5') }, 'gray', { stroke: true }),
    s('circle', { cx: 118, cy: 82, r: 12 }, 'red', { accent: true })
  ],
  incansablemente: [
    s('circle', { cx: 32, cy: 34, r: 14 }, 'yellow'),
    s('path', { d: 'M128 22a14 14 0 1 0 10 24a12 12 0 1 1-10-24z' }, 'navy'),
    ground(),
    ...lean(78, 118, 18, 'red', { accent: true, h: 40 }),
    s('path', { d: 'M78 118l-18 18M78 118l20 4 6 14M84 98l22-6M76 88l-18 12', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M26 92h20M20 106h22M30 120h16', ...SW(4) }, 'gray', { stroke: true })
  ],
  independizar: [
    ground(),
    s('path', { d: 'M16 80l26-24 26 24v56H16z' }, 'blue'),
    s('path', { d: 'M108 100l18-16 18 16v36h-36z' }, 'orange', { accent: true }),
    s('rect', { x: 120, y: 116, width: 12, height: 20 }, 'brown'),
    ...person(82, 136, 'green', { h: 36, w: 24, r: 10 }),
    s('rect', { x: 86, y: 98, width: 22, height: 18, rx: 2 }, 'tan'),
    s('path', { d: 'M74 54h22', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M94 48l8 6-8 6z' }, 'orange')
  ],
  inflexible: [
    s('rect', { x: 20, y: 70, width: 120, height: 20, rx: 3 }, 'gray', { accent: true }),
    s('path', { d: 'M26 76h108', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M18 64h20v32H18zM122 64h20v32h-20z' }, 'skin'),
    s('path', { d: 'M40 40q40-24 80 0M40 120q40 24 80 0', ...DASH(4, '6 6') }, 'orange', { stroke: true }),
    s('path', { d: 'M112 30l10 10-14 4zM112 130l10-10-14-4z' }, 'orange'),
    s('path', { d: 'M76 52l4-10 4 10M76 108l4 10 4-10', ...SW(3) }, 'red', { stroke: true })
  ],
  inhibir: [
    ground(),
    ...lean(40, 136, -16, 'blue', { accent: true, h: 42 }),
    s('path', { d: 'M48 100l20 0', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M68 100L112 88', ...SW(3) }, 'red', { stroke: true }),
    s('ellipse', { cx: 120, cy: 112, rx: 22, ry: 12, transform: 'rotate(-12 120 112)' }, 'tan'),
    s('path', { d: 'M106 120l-6 16M134 116l6 18M140 106l12-14', ...SW(6) }, 'tan', { stroke: true }),
    s('circle', { cx: 116, cy: 90, r: 11 }, 'tan'),
    s('path', { d: 'M150 98h-6M150 110h-6', ...SW(3) }, 'gray', { stroke: true })
  ],
  'inmunológico': [
    s('path', { d: 'M80 20l50 16v40q0 40-50 62Q30 116 30 76V36z' }, 'green', { accent: true }),
    s('path', { d: 'M62 74l14 14 24-28', ...SW(8) }, 'white', { stroke: true }),
    s('path', { d: rays(132, 120, 8, 16, 8), ...SW(3) }, 'purple', { stroke: true }),
    s('circle', { cx: 132, cy: 120, r: 10 }, 'purple'),
    s('path', { d: 'M118 104q-10-10 -2-22', ...DASH(3, '4 4') }, 'gray', { stroke: true })
  ],
  intransigente: [
    s('rect', { x: 52, y: 84, width: 56, height: 54, rx: 16 }, 'red', { accent: true }),
    ...face(80, 54, 22, 'skin', 'frown'),
    s('path', { d: 'M66 42l10 4M94 42l-10 4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 104h46M104 112H58', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M30 136h100', ...SW(4) }, 'gray', { stroke: true })
  ],
  maleducado: [
    s('circle', { cx: 80, cy: 78, r: 50 }, 'yellow', { accent: true }),
    s('path', { d: 'M52 60l14 6M108 60l-14 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[60, 66], [100, 66]], 5) }, 'dark'),
    s('path', { d: 'M56 94q24 12 48 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M70 98h20v18a10 10 0 0 1-20 0z' }, 'pink'),
    s('path', { d: dots([[110, 120], [122, 112], [120, 128]], 3) }, 'sky')
  ],
  'maraña': [
    s('path', { d: 'M40 80c0-40 70-40 70 0s-60 36-60 0 50-30 56 4-40 40-50 10M30 60c30-30 90-20 90 20s-50 50-80 30M60 40c40 0 60 60 10 70', ...SW(5) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M50 120c-20 0-30 14-26 22M110 110q20 10 30 30', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M20 138h12v8H20zM132 134h12v8h-12z' }, 'dark'),
    s('path', { d: 'M46 64c20-10 50 10 40 30s-30 10-20-10', ...SW(4) }, 'red', { stroke: true })
  ],
  merca: [
    s('path', { d: 'M30 60h64l-6 76H36z' }, 'orange', { accent: true }),
    s('path', { d: 'M46 60v-8a16 16 0 0 1 32 0v8', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 60l4-14 10 14M70 60l10-18 6 18' }, 'green'),
    s('path', { d: ells([[118, 128, 16, 6], [118, 118, 16, 6], [118, 108, 16, 6]]) }, 'yellow'),
    s('path', { d: 'M102 108v20M134 108v20', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M110 72a14 14 0 0 1 20 10', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M128 78l4 8 6-6z' }, 'gray')
  ],
  morboso: [
    ground(),
    s('rect', { x: 84, y: 102, width: 56, height: 22, rx: 6, transform: 'rotate(180 112 113)' }, 'blue'),
    s('path', { d: 'M96 124l8 12h16l8-12z' }, 'sky'),
    s('path', { d: dots([[98, 102], [126, 102]], 8) }, 'dark'),
    s('path', { d: 'M112 90q-8-10 0-20t0-22M126 88q-6-8 0-16', ...SW(5) }, 'gray', { stroke: true }),
    ...lean(46, 136, 22, 'purple', { accent: true, h: 40 }),
    s('circle', { cx: 70, cy: 80, r: 4 }, 'dark')
  ],
  morcilla: [
    s('ellipse', { cx: 80, cy: 118, rx: 64, ry: 18 }, 'white'),
    s('path', { d: ring(80, 118, 64).replace(/a64 64/g, 'a64 18'), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 64q50-50 100 0', ...SW(22) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: 'M26 70l-8 6M134 70l8 6', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: ells([[62, 112, 16, 10], [98, 112, 16, 10]]) }, 'dark'),
    s('path', { d: dots([[58, 110], [66, 114], [94, 110], [102, 114], [62, 106], [98, 106]], 2) }, 'cream')
  ],
  murmullo: [
    s('circle', { cx: 52, cy: 72, r: 22 }, 'skin'),
    s('path', { d: busts([52], 140, 44, 44) }, 'orange'),
    s('circle', { cx: 108, cy: 72, r: 22 }, 'skin'),
    s('path', { d: busts([108], 140, 44, 44) }, 'blue'),
    s('path', { d: 'M72 76l12-10v20z' }, 'skin', { accent: true }),
    s('path', { d: 'M76 48q4-6 0-12M86 50q6-10 0-20M96 48q8-14 0-24', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M42 70h4M54 70h4M114 66v6', ...SW(3) }, 'dark', { stroke: true })
  ],
  musculatura: [
    s('rect', { x: 18, y: 92, width: 92, height: 34, rx: 16 }, 'skin'),
    s('rect', { x: 84, y: 40, width: 30, height: 80, rx: 14, transform: 'rotate(12 99 80)' }, 'skin'),
    s('circle', { cx: 104, cy: 36, r: 18 }, 'skin'),
    s('ellipse', { cx: 62, cy: 92, rx: 28, ry: 18 }, 'red', { accent: true }),
    s('path', { d: 'M46 90q16-10 32 0', ...SW(3) }, 'pink', { stroke: true }),
    s('path', { d: 'M132 20l10-8M136 40h12M30 70l-10-8', ...SW(4) }, 'orange', { stroke: true })
  ],
  musgo: [
    s('path', { d: 'M18 136q0-44 44-50q30-4 40 16q34-4 40 34z' }, 'gray'),
    s('path', { d: 'M18 116q2-28 30-32q22-4 34 8q12-10 28-4q22 6 30 22q-12-8-24-4q-10-6-20 0q-14-8-26 0q-16-6-28 4q-14-4-24 6z' }, 'green', { accent: true }),
    s('path', { d: dots([[36, 96], [56, 88], [80, 94], [104, 92], [122, 104], [46, 108], [92, 104]], 4) }, 'mint'),
    s('path', { d: 'M60 80v-10M90 84v-8M120 92v-8', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M14 138h132', ...SW(4) }, 'brown', { stroke: true })
  ],
  negociable: [
    s('path', { d: 'M14 104h40M146 104h-40', ...SW(18) }, 'blue', { stroke: true }),
    s('path', { d: 'M50 92q14-8 30 0l26 4q8 6 0 14l-26 8q-18 4-30-6z' }, 'skin', { accent: true }),
    s('path', { d: 'M70 98h24M70 106h24', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M54 60V26M106 26v34', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M44 34l10-14 10 14zM96 52l10 14 10-14z' }, 'orange'),
    s('path', { d: 'M146 104h-8', ...SW(18) }, 'navy', { stroke: true })
  ],
  nigeriano: [
    s('path', { d: 'M26 20v122', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 28, y: 24, width: 36, height: 72 }, 'green', { accent: true }),
    s('rect', { x: 64, y: 24, width: 36, height: 72 }, 'white'),
    s('rect', { x: 100, y: 24, width: 36, height: 72 }, 'green'),
    outline({ x: 28, y: 24, width: 108, height: 72 })
  ],
  obstaculizar: [
    ground(),
    s('path', { d: 'M40 136V80M120 136V80', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 26, y: 62, width: 108, height: 22, rx: 3 }, 'white'),
    s('path', { d: 'M38 84l20-22h14L52 84zM78 84l20-22h14L92 84zM118 84l16-18v14l-2 4z' }, 'red', { accent: true }),
    outline({ x: 26, y: 62, width: 108, height: 22, rx: 3 }),
    s('circle', { cx: 30, cy: 52, r: 7 }, 'orange'),
    s('circle', { cx: 130, cy: 52, r: 7 }, 'orange')
  ],
  ogro: [
    s('path', { d: 'M30 60l-14-10 4 22zM130 60l14-10-4 22z' }, 'green'),
    s('path', { d: 'M38 40q42-30 84 0q16 40 0 76q-42 30-84 0q-16-36 0-76z' }, 'green', { accent: true }),
    s('path', { d: 'M48 56l20 6M112 56l-20 6', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[60, 72], [100, 72]], 5) }, 'dark'),
    s('path', { d: 'M54 104q26-14 52 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 102l4-12 6 10zM92 100l6-10 4 12z' }, 'white'),
    s('ellipse', { cx: 80, cy: 86, rx: 8, ry: 6 }, 'mint')
  ],
  peregrinaje: [
    s('path', { d: 'M100 136l10-40 10 40z' }, 'tan'),
    s('path', { d: 'M104 66V50l6-8 6 8v16zM98 68h24v16H98z' }, 'cream'),
    s('path', { d: 'M110 30v10M106 34h8', ...SW(2) }, 'brown', { stroke: true }),
    ...person(58, 138, 'brown', { accent: true }),
    s('rect', { x: 32, y: 96, width: 14, height: 30, rx: 4 }, 'green'),
    s('path', { d: 'M38 104l6 8-6 8-6-8z' }, 'yellow'),
    s('path', { d: 'M80 140V68', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M72 106l8-6', ...SW(6) }, 'skin', { stroke: true })
  ],
  pollera: [
    s('rect', { x: 52, y: 24, width: 56, height: 14, rx: 3 }, 'navy'),
    s('path', { d: 'M54 38h52l30 98H24z' }, 'red', { accent: true }),
    s('path', { d: 'M42 96h76M32 118h96', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M66 40l-12 96M80 40v96M94 40l12 96', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M24 136q8 6 16 0t16 0 16 0 16 0 16 0 16 0 16 0', ...SW(4) }, 'white', { stroke: true })
  ],
  portabilidad: [
    s('rect', { x: 18, y: 40, width: 40, height: 76, rx: 8 }, 'dark'),
    s('rect', { x: 23, y: 48, width: 30, height: 58, rx: 2 }, 'sky'),
    s('rect', { x: 102, y: 40, width: 40, height: 76, rx: 8 }, 'dark'),
    s('rect', { x: 107, y: 48, width: 30, height: 58, rx: 2 }, 'mint'),
    s('path', { d: 'M48 32q32-24 64 0M112 126q-32 22-64 0', ...SW(5) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M104 22l12 12-16 4zM56 136l-12-12 16-4z' }, 'orange'),
    s('circle', { cx: 38, cy: 78, r: 6 }, 'blue'),
    s('circle', { cx: 122, cy: 78, r: 6 }, 'green')
  ],
  prerrogativa: [
    s('path', { d: 'M60 140l14-80h12l14 80z' }, 'red'),
    s('path', { d: 'M28 140V96M132 140V96', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M28 102q16 16 32 6M132 102q-16 16-32 6', ...SW(5) }, 'red', { stroke: true }),
    ...person(80, 100, 'purple', { accent: true, h: 38 }),
    s('path', { d: 'M66 36l6-12 8 8 8-8 6 12z' }, 'yellow')
  ],
  protestantismo: [
    s('path', { d: 'M30 140V60l50-36 50 36v80z' }, 'cream'),
    s('path', { d: 'M80 8v20M72 16h16', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 140V92a24 24 0 0 1 48 0v48z' }, 'brown'),
    s('rect', { x: 66, y: 90, width: 28, height: 36 }, 'white', { accent: true }),
    s('path', { d: 'M72 100h16M72 108h16M72 116h12', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 104l24-10M126 88l10 18', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 92, r: 3 }, 'dark')
  ],
  publicitar: [
    s('path', { d: 'M28 72h18l50-28v76L46 92H28z' }, 'orange', { accent: true }),
    s('path', { d: 'M38 92l8 30h12l-6-30z' }, 'gray'),
    s('path', { d: 'M108 62q10 20 0 40M120 52q16 30 0 60M132 42q22 40 0 80', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: star(40, 34, 12) }, 'yellow')
  ],
  'reaparición': [
    s('path', { d: 'M14 14h40v132H14q20-66 0-132zM146 14h-40v132h40q-20-66 0-132z' }, 'red'),
    s('path', { d: 'M80 14l-34 122h68z' }, 'yellow'),
    ...person(80, 138, 'blue', { accent: true }),
    s('path', { d: 'M62 34a20 20 0 1 1 6 16', ...SW(4) }, 'purple', { stroke: true }),
    s('path', { d: 'M58 52l12 2-2-12z' }, 'purple'),
    s('path', { d: sparkle(116, 40, 8) }, 'white')
  ],
  reestructurar: [
    s('rect', { x: 60, y: 18, width: 40, height: 24, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: 'M80 42v16M34 58h92M34 58v16M80 58v16M126 58v16', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: rects([[18, 74, 32, 20], [64, 74, 32, 20]]) }, 'orange'),
    s('rect', { x: 110, y: 74, width: 32, height: 20 }, 'green'),
    s('path', { d: 'M126 98q0 30-30 30H74', ...SW(4) }, 'purple', { stroke: true }),
    s('path', { d: 'M76 120l-10 8 10 8z' }, 'purple'),
    s('rect', { x: 24, y: 116, width: 32, height: 20, rx: 0 }, 'green')
  ],
  refinamiento: [
    s('path', { d: 'M30 44h100L92 92v14H68V92z' }, 'gray', { accent: true }),
    s('path', { d: 'M40 44q8-12 18-4q8-12 18 0q10-12 20 0q10-12 24 4z' }, 'dark'),
    s('path', { d: 'M38 56h84', ...DASH(3, '4 4') }, 'white', { stroke: true }),
    s('path', { d: drop(80, 124, 8) }, 'yellow'),
    s('path', { d: sparkle(110, 118, 8) + sparkle(50, 124, 6) }, 'yellow')
  ],
  'repostería': [
    s('path', { d: 'M18 136V84l56-24v76z' }, 'pink'),
    s('path', { d: 'M18 96l56-22M18 112l56-22', ...SW(5) }, 'cream', { stroke: true }),
    s('path', { d: 'M18 84l56-24q4 10-4 14L22 92q-6 0-4-8z' }, 'white'),
    s('circle', { cx: 52, cy: 62, r: 7 }, 'red', { accent: true }),
    s('path', { d: 'M96 136l-6-34h48l-6 34z' }, 'orange'),
    s('path', { d: 'M90 102q0-26 24-26t24 26z' }, 'pink'),
    s('circle', { cx: 114, cy: 72, r: 6 }, 'red'),
    s('path', { d: 'M104 106l2 26M114 106v26M124 106l-2 26', ...SW(2) }, 'brown', { stroke: true })
  ],
  'reseñar': [
    ...paper(24, 22, 82, 112),
    s('path', { d: star(42, 44, 9) + star(64, 44, 9) + star(86, 44, 9) }, 'yellow', { accent: true }),
    s('path', { d: 'M36 72h58M36 88h58M36 104h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M138 56l-40 56-6 14 12-8 40-56z' }, 'blue'),
    s('path', { d: 'M98 112l-6 14 12-8z' }, 'dark')
  ],
  risco: [
    backdrop('sky'),
    s('path', { d: 'M14 146V40l16-6 10 14 14-4 8 18 6 30-8 20 10 34z' }, 'gray', { accent: true }),
    s('path', { d: 'M24 60l10 6M30 90l14 4M28 118l12-4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 128h82v18H64z' }, 'blue'),
    s('path', { d: 'M64 128q10-6 20 0t20 0 20 0 22 0', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: birds([[110, 50], [128, 64]]), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 40l16-6 10 14 14-4 8 18 6 30-8 20 10 34', ...SW(3) }, 'brown', { stroke: true })
  ],
  rodaja: [
    s('circle', { cx: 68, cy: 82, r: 50 }, 'yellow', { accent: true }),
    s('circle', { cx: 68, cy: 82, r: 42 }, 'cream'),
    s('path', { d: wedge(68, 82, 38, -80, -30) + wedge(68, 82, 38, -20, 30) + wedge(68, 82, 38, 40, 90) + wedge(68, 82, 38, 100, 150) + wedge(68, 82, 38, 160, 210) + wedge(68, 82, 38, 220, 270) }, 'yellow'),
    s('circle', { cx: 124, cy: 122, r: 20 }, 'green'),
    s('circle', { cx: 124, cy: 122, r: 15 }, 'mint')
  ],
  separatismo: [
    s('path', { d: 'M20 40h76v30h-6a10 10 0 0 0 0 20h6v30H20z' }, 'blue'),
    s('path', { d: 'M112 40h32v80h-32V90h-6a10 10 0 0 1 0-20h6z' }, 'orange', { accent: true }),
    s('path', { d: 'M20 40h76v30h-6a10 10 0 0 0 0 20h6v30H20z', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M118 30l14-12M118 130l14 12', ...SW(4) }, 'gray', { stroke: true })
  ],
  setecientos: [
    s('path', { d: rects([[16, 30, 28, 28], [48, 30, 28, 28], [80, 30, 28, 28], [112, 30, 28, 28], [32, 74, 28, 28], [64, 74, 28, 28], [96, 74, 28, 28]]) }, 'orange', { accent: true }),
    s('path', { d: 'M16 44h124M32 88h92M30 30v28M62 30v28M94 30v28M126 30v28M46 74v28M78 74v28M110 74v28', ...SW(1) }, 'white', { stroke: true }),
    s('path', { d: dots([[24, 124], [40, 124], [56, 124], [72, 124], [88, 124], [104, 124], [120, 124]], 6) }, 'blue')
  ],
  sinsentido: [
    s('path', { d: 'M24 108h36v36H24zM100 108h36v36h-36z', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M42 126l26-38h44l-20 38H42zM68 88l-6-14M112 88l4-18', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M54 74h18M108 70l10-4', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[42, 126], [118, 126]], 5) }, 'gray'),
    s('path', { d: spiral(70, 28) + spiral(104, 34), ...SW(3) }, 'purple', { stroke: true })
  ],
  'subcampeón': [
    s('rect', { x: 58, y: 70, width: 44, height: 66 }, 'yellow'),
    s('rect', { x: 14, y: 90, width: 44, height: 46 }, 'gray', { accent: true }),
    s('rect', { x: 102, y: 104, width: 44, height: 32 }, 'orange'),
    s('path', { d: 'M28 30l8 22M44 30l-8 22', ...SW(4) }, 'blue', { stroke: true }),
    s('circle', { cx: 36, cy: 64, r: 14 }, 'gray'),
    s('circle', { cx: 36, cy: 64, r: 8 }, 'white')
  ],
  suspense: [
    backdrop('navy'),
    s('path', { d: 'M40 146V40h56v106z' }, 'dark'),
    s('path', { d: 'M96 40l30-12v124l-30-6z' }, 'brown'),
    s('path', { d: dots([[60, 82], [76, 82]], 5) }, 'yellow', { accent: true }),
    s('path', { d: 'M96 146l50-10v10z' }, 'yellow'),
    s('circle', { cx: 116, cy: 90, r: 4 }, 'yellow')
  ],
  taquicardia: [
    s('path', { d: heart(80, 84, 34) }, 'red', { accent: true }),
    s('path', { d: 'M14 82h30l8-20 10 44 10-58 10 50 8-30 6 14h50', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M20 40l12 8M140 40l-12 8M18 120l12-6M142 120l-12-6', ...SW(4) }, 'orange', { stroke: true })
  ],
  'tecnológicamente': [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'green'),
    s('path', { d: 'M54 40V20M80 40V20M106 40V20M54 120v20M80 120v20M106 120v20M40 54H20M40 80H20M40 106H20M120 54h20M120 80h20M120 106h20', ...SW(4) }, 'yellow', { stroke: true }),
    s('rect', { x: 40, y: 40, width: 80, height: 80, rx: 6 }, 'dark', { accent: true }),
    s('rect', { x: 58, y: 58, width: 44, height: 44, rx: 4 }, 'gray'),
    s('path', { d: dots([[54, 20], [106, 140], [20, 80], [140, 54]], 4) }, 'yellow')
  ],
  'tártaro': [
    s('path', { d: 'M14 54h40l12 92H14zM146 54h-40l-12 92h52z' }, 'gray'),
    s('path', { d: 'M54 54h52l-12 92H66z' }, 'black'),
    s('path', { d: 'M66 146q-4-20 6-30q2 10 8 12q-2-18 10-28q0 18 6 24q4-6 4-14q8 16 0 36z' }, 'orange', { accent: true }),
    s('path', { d: 'M76 146q0-12 6-18q4 10 8 18z' }, 'yellow'),
    s('path', { d: 'M14 54l8-8 10 6 10-8 12 10M106 54l12-8 8 6 10-10 10 8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 30l-6-8M130 28l6-8', ...SW(3) }, 'gray', { stroke: true })
  ],
  uniformemente: [
    s('path', { d: 'M26 136V64q0-28 28-28h52q28 0 28 28v72z' }, 'tan'),
    s('path', { d: 'M34 128V68q0-22 22-22h48q22 0 22 22v60z' }, 'red', { accent: true }),
    s('path', { d: 'M46 76h68M46 96h68M46 116h68', ...DASH(3, '6 6') }, 'pink', { stroke: true }),
    s('path', { d: 'M60 34l60-12', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M120 22l18-4', ...SW(10) }, 'brown', { stroke: true })
  ],
  varonil: [
    s('path', { d: busts([80], 142, 96, 50) }, 'red'),
    s('path', { d: 'M32 112l96 30M32 126l48 14M68 92v50M92 92v50', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 58, r: 26 }, 'skin'),
    s('path', { d: 'M54 60q2 34 26 36q24-2 26-36q-8 10-26 10t-26-10z' }, 'brown', { accent: true }),
    s('path', { d: 'M54 50q0-24 26-24t26 24q-10-10-26-10t-26 10z' }, 'brown'),
    s('path', { d: dots([[70, 54], [90, 54]], 3) }, 'dark')
  ],
  'veintiséis': [
    s('path', { d: dots([24, 44, 64, 84, 104].flatMap(x => [[x, 34], [x, 54]]), 8) }, 'blue'),
    s('path', { d: dots([24, 44, 64, 84, 104].flatMap(x => [[x, 82], [x, 102]]), 8) }, 'green'),
    s('path', { d: dots([[36, 130], [56, 130], [76, 130], [96, 130], [116, 130], [136, 130]], 8) }, 'orange', { accent: true }),
    s('path', { d: 'M126 24v88', ...SW(3) }, 'gray', { stroke: true })
  ],
  venerar: [
    s('rect', { x: 92, y: 104, width: 44, height: 32 }, 'gray'),
    s('path', { d: halfRays(114, 54, 22, 34, 7), ...SW(3) }, 'yellow', { stroke: true }),
    ...person(114, 104, 'cream', { h: 36, r: 11 }),
    s('path', { d: ring(114, 42, 16), ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M24 136h28l-6-26H34z' }, 'purple', { accent: true }),
    s('circle', { cx: 52, cy: 98, r: 11 }, 'skin'),
    s('path', { d: 'M46 114l20-10 10-14', ...SW(6) }, 'skin', { stroke: true })
  ],
  verja: [
    s('rect', { x: 14, y: 40, width: 18, height: 100 }, 'gray'),
    s('rect', { x: 128, y: 40, width: 18, height: 100 }, 'gray'),
    s('path', { d: 'M44 136V40M60 136V40M76 136V40M92 136V40M108 136V40M124 136V40', ...SW(4) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: 'M32 60h96M32 120h96', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 40l4-12 4 12zM56 40l4-12 4 12zM72 40l4-12 4 12zM88 40l4-12 4 12zM104 40l4-12 4 12zM120 40l4-12 4 12z' }, 'dark'),
    s('path', { d: 'M12 40h22v-6H12zM126 40h22v-6h-22z' }, 'dark')
  ],
  'vértebra': [
    s('path', { d: 'M80 14v132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[54, 18, 52, 20], [54, 48, 52, 20], [54, 108, 52, 20]]) }, 'cream'),
    s('path', { d: rects([[58, 40, 44, 6], [58, 70, 44, 6], [58, 100, 44, 6], [58, 130, 44, 6]]) }, 'pink'),
    s('path', { d: 'M54 78h52v20H54zM40 82h14v10H40zM106 82h14v10h-14z' }, 'orange', { accent: true }),
    s('path', { d: 'M54 18h52v20H54zM54 48h52v20H54zM54 108h52v20H54z', ...SW(2) }, 'tan', { stroke: true })
  ],
  zafar: [
    ...person(80, 138, 'green', { accent: true }),
    s('path', { d: 'M66 98L46 62M94 98l20-36', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M66 106h28M66 116h28', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M22 104q10-8 20 0M118 104q10-8 20 0M26 128l14-6M120 122l14 6', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M30 50l-8-6M130 50l8-6M80 50V40', ...SW(4) }, 'orange', { stroke: true })
  ],
  acetato: [
    s('path', { d: 'M64 20h24v36l30 64q4 16-12 16H46q-16 0-12-16l30-64z' }, 'white'),
    s('path', { d: 'M40 104h72l6 16q4 16-12 16H46q-16 0-12-16z' }, 'sky', { accent: true }),
    s('path', { d: 'M64 20h24v36l30 64q4 16-12 16H46q-16 0-12-16l30-64zM58 20h36', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[112, 40, 14, 14], [128, 56, 12, 12], [114, 64, 10, 10]]) }, 'white'),
    s('path', { d: rects([[112, 40, 14, 14], [128, 56, 12, 12], [114, 64, 10, 10]]), ...SW(2) }, 'blue', { stroke: true }),
    s('path', { d: dots([[60, 116], [80, 124], [94, 112]], 4) }, 'white')
  ],
  afgano: [
    s('path', { d: 'M52 112v26M66 112v26M100 112v26M114 112v26', ...SW(7) }, 'tan', { stroke: true }),
    s('path', { d: 'M40 84q40-12 84 0q8 16 2 30q-44 8-86 0q-6-14 0-30z' }, 'tan', { accent: true }),
    s('path', { d: 'M42 112q-2 14 4 22M124 112q4 14-2 22M60 116l-2 16M108 116l2 16', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M124 86q14-6 10-22', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: 'M48 86L36 54q-2-14 12-16h4q10 4 4 16l2 30z' }, 'tan'),
    s('path', { d: 'M38 44q-10 0-12 26q0 20 8 30q6-20 6-56z' }, 'orange'),
    s('path', { d: 'M40 40l-14 6 4 6z' }, 'dark'),
    s('circle', { cx: 46, cy: 44, r: 2 }, 'dark')
  ],
  alero: [
    s('rect', { x: 34, y: 76, width: 92, height: 60 }, 'cream'),
    s('path', { d: 'M14 82L80 34l66 48z' }, 'red', { accent: true }),
    s('path', { d: 'M14 82h132', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 70, y: 104, width: 20, height: 32 }, 'brown'),
    s('path', { d: drop(16, 98, 4) + drop(16, 116, 4) + drop(144, 98, 4) + drop(144, 116, 4) }, 'blue'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  'amoníaco': [
    s('rect', { x: 22, y: 64, width: 44, height: 72, rx: 8 }, 'yellow'),
    s('rect', { x: 34, y: 48, width: 20, height: 16 }, 'blue'),
    s('path', { d: 'M38 40q-6-10 2-18t0-16M52 40q6-10-2-18', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M108 82L84 116M108 82l28 28M108 82V48', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 108, cy: 82, r: 18 }, 'blue', { accent: true }),
    s('path', { d: dots([[84, 116], [136, 110], [108, 46]], 11) }, 'white'),
    s('path', { d: ring(84, 116, 11) + ring(136, 110, 11) + ring(108, 46, 11), ...SW(2) }, 'gray', { stroke: true })
  ],
  androide: [
    s('path', { d: 'M80 26V12', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 12, r: 4 }, 'red'),
    s('rect', { x: 52, y: 26, width: 56, height: 40, rx: 10 }, 'gray', { accent: true }),
    s('rect', { x: 60, y: 36, width: 40, height: 16, rx: 6 }, 'navy'),
    s('path', { d: dots([[70, 44], [90, 44]], 4) }, 'sky'),
    s('rect', { x: 50, y: 72, width: 60, height: 46, rx: 8 }, 'gray'),
    s('path', { d: 'M46 78l-12 32M114 78l12 32M66 118v20M94 118v20', ...SW(8) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 94, r: 8 }, 'sky')
  ],
  angosto: [
    s('rect', { x: 14, y: 14, width: 54, height: 132 }, 'brown'),
    s('rect', { x: 92, y: 14, width: 54, height: 132 }, 'brown'),
    s('path', { d: 'M24 40h34M24 70h34M24 100h34M102 52h34M102 82h34M102 112h34', ...SW(3) }, 'tan', { stroke: true }),
    s('circle', { cx: 80, cy: 76, r: 9 }, 'skin'),
    s('rect', { x: 72, y: 88, width: 16, height: 48, rx: 6 }, 'orange', { accent: true }),
    s('path', { d: 'M66 50l8 8M94 50l-8 8', ...SW(3) }, 'gray', { stroke: true })
  ],
  'arquidiócesis': [
    s('path', { d: ring(80, 84, 64), ...DASH(3, '6 6') }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M54 116V58l10-16 10 16v58zM86 116V58l10-16 10 16v58z' }, 'cream'),
    s('path', { d: 'M74 116V76h12v40z' }, 'yellow'),
    s('path', { d: 'M64 42V28M96 42V28M58 34h12M90 34h12', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M20 116V96l10-10 10 10v20zM120 116V96l10-10 10 10v20zM28 140v-14l8-8 8 8v14zM116 140v-14l8-8 8 8v14z' }, 'tan'),
    s('path', { d: 'M18 116h124', ...SW(3) }, 'gray', { stroke: true })
  ],
  arrabal: [
    s('path', { d: 'M14 136V44h12v-8h10v8h10v-8h10v8h10v92z' }, 'gray'),
    s('path', { d: 'M30 136v-24a10 10 0 0 1 20 0v24z' }, 'dark'),
    s('path', { d: 'M80 136v-22l14-10 14 10v22zM112 136v-18l12-10 12 10v18zM92 136v-8h8v8z' }, 'tan', { accent: true }),
    s('path', { d: 'M76 114l18-14 18 14M108 118l16-12 16 12', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'brown', { stroke: true })
  ],
  atenuar: [
    s('path', { d: 'M14 80q8-60 16 0t16 0', ...SW(5) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M46 80q8-40 16 0t16 0', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M78 80q8-24 16 0t16 0', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: 'M110 80q8-10 16 0t16 0', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: 'M26 124l110 0M126 116l10 8-10 8', ...SW(4) }, 'gray', { stroke: true })
  ],
  auspicio: [
    s('path', { d: 'M20 76q60-60 120 0z' }, 'purple', { accent: true }),
    s('path', { d: 'M20 76q10-8 20 0t20 0 20 0 20 0 20 0 20 0', ...SW(3) }, 'purple', { stroke: true }),
    s('path', { d: 'M80 76v60', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 26v-8', ...SW(4) }, 'dark', { stroke: true }),
    ...person(54, 136, 'orange', { h: 34, w: 22, r: 10 }),
    ...person(108, 136, 'green', { h: 34, w: 22, r: 10 })
  ],
  'autogestión': [
    ...gear(80, 46, 18, 10, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 46, r: 6 }, 'white'),
    s('path', { d: busts([44, 80, 116], 138, 26, 30) }, 'blue'),
    s('path', { d: dots([[44, 96], [80, 96], [116, 96]], 11) }, 'skin'),
    s('path', { d: 'M28 80q-6-46 32-58M132 80q6-46-32-58', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M54 14l10 8-12 6zM106 14l-10 8 12 6z' }, 'green')
  ],
  azulado: [
    s('rect', { x: 18, y: 30, width: 36, height: 100, rx: 6 }, 'white'),
    outline({ x: 18, y: 30, width: 36, height: 100, rx: 6 }),
    s('rect', { x: 62, y: 22, width: 36, height: 116, rx: 6 }, 'sky', { accent: true }),
    s('rect', { x: 106, y: 30, width: 36, height: 100, rx: 6 }, 'blue'),
    s('path', { d: 'M62 22h36v116H62z', ...SW(4) }, 'navy', { stroke: true })
  ],
  banqueta: [
    s('rect', { x: 14, y: 116, width: 132, height: 30 }, 'dark'),
    s('path', { d: 'M24 132h20M64 132h20M104 132h20', ...SW(4) }, 'yellow', { stroke: true }),
    s('rect', { x: 14, y: 100, width: 132, height: 16 }, 'gray', { accent: true }),
    s('path', { d: 'M40 100v16M70 100v16M100 100v16M130 100v16', ...SW(2) }, 'white', { stroke: true }),
    ...person(80, 102, 'red', { h: 40 }),
    s('path', { d: 'M74 102l-8-2M86 102l8-2', ...SW(4) }, 'dark', { stroke: true })
  ],
  bucear: [
    backdrop('blue'),
    s('rect', { x: 44, y: 70, width: 56, height: 24, rx: 12 }, 'yellow', { accent: true }),
    s('circle', { cx: 110, cy: 78, r: 12 }, 'skin'),
    s('rect', { x: 108, y: 70, width: 18, height: 12, rx: 4 }, 'sky'),
    s('path', { d: 'M114 66V48', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M44 78l-14-8M44 88l-14 6', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 62l-8 6 6 6zM24 92l-8 4 6 6z' }, 'dark'),
    s('path', { d: dots([[118, 36], [126, 24], [120, 14]], 4) + fishes([[60, 122], [100, 128]]) }, 'sky')
  ],
  bum: [
    s('path', { d: burst(80, 80, 66, 36, 12) }, 'orange', { accent: true }),
    s('path', { d: burst(80, 80, 40, 22, 10) }, 'yellow'),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'white'),
    s('path', { d: 'M20 30l10 10M140 130l-10-10M140 28l-10 10', ...SW(4) }, 'red', { stroke: true })
  ],
  caduco: [
    s('path', { d: 'M30 50l16-16h40l16 16v86H30z' }, 'white'),
    s('path', { d: 'M30 50l16-16h40l16 16v86H30z', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 30, y: 74, width: 72, height: 36 }, 'sky'),
    s('path', { d: 'M40 24q-6-8 0-14M56 24q-6-8 0-14M72 24q-6-8 0-14', ...SW(3) }, 'green', { stroke: true }),
    s('rect', { x: 102, y: 84, width: 44, height: 44, rx: 4 }, 'white'),
    s('rect', { x: 102, y: 84, width: 44, height: 12, rx: 2 }, 'red'),
    outline({ x: 102, y: 84, width: 44, height: 44, rx: 4 }),
    s('path', { d: 'M112 104l24 18M136 104l-24 18', ...SW(5) }, 'red', { stroke: true, accent: true })
  ],
  'camaradería': [
    ...person(56, 138, 'blue', { accent: true }),
    ...person(104, 138, 'orange'),
    s('path', { d: 'M56 98q24-8 48 0', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M50 76q6 5 12 0M98 76q6 5 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: heart(80, 36, 12) }, 'red')
  ],
  chale: [
    ...face(80, 84, 46, 'yellow', 'frown'),
    s('path', { d: 'M40 36q30-6 44 14l-6 14q-14-14-38-12z' }, 'skin', { accent: true }),
    s('path', { d: drop(126, 60, 7) }, 'sky'),
    s('path', { d: 'M60 60l10 4M100 60l-10 4', ...SW(4) }, 'dark', { stroke: true })
  ],
  chamorro: [
    s('ellipse', { cx: 80, cy: 118, rx: 64, ry: 18 }, 'white'),
    s('path', { d: ring(80, 118, 64).replace(/a64 64/g, 'a64 18'), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 106q-6-40 30-54q30-10 40 14q6 30-16 44q-30 10-54-4z' }, 'brown', { accent: true }),
    s('path', { d: 'M104 62l22-26', ...SW(10) }, 'cream', { stroke: true }),
    s('path', { d: dots([[124, 30], [134, 38]], 7) }, 'cream'),
    s('path', { d: 'M56 74q14 10 30 0M54 94q16 8 34 0', ...SW(3) }, 'orange', { stroke: true })
  ],
  chollo: [
    s('path', { d: 'M28 52h52l40 40-36 36-56-56z' }, 'yellow', { accent: true }),
    s('circle', { cx: 44, cy: 66, r: 6 }, 'white'),
    s('path', { d: 'M44 66q-20-30-10-50', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M126 30v56', ...SW(7) }, 'green', { stroke: true }),
    s('path', { d: 'M112 80l14 22 14-22z' }, 'green'),
    s('path', { d: sparkle(88, 30, 9) + sparkle(42, 120, 8) }, 'orange'),
    s('path', { d: dots([[72, 88]], 9) }, 'red')
  ],
  clandestinamente: [
    backdrop('navy'),
    s('path', { d: 'M122 22a14 14 0 1 0 10 24a12 12 0 1 1-10-24z' }, 'yellow'),
    s('path', { d: 'M62 136l6-74h28l8 74z' }, 'tan', { accent: true }),
    s('circle', { cx: 82, cy: 50, r: 12 }, 'skin'),
    s('path', { d: 'M64 40h36M70 40q2-16 12-16t12 16z' }, 'dark'),
    s('path', { d: 'M64 40h36', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M74 72l10-14', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M36 136h14M110 136h14', ...SW(4) }, 'gray', { stroke: true })
  ],
  coartada: [
    s('rect', { x: 18, y: 30, width: 74, height: 84, rx: 3 }, 'white'),
    outline({ x: 18, y: 30, width: 74, height: 84, rx: 3 }),
    s('rect', { x: 26, y: 38, width: 58, height: 52 }, 'sky'),
    ...person(55, 90, 'orange', { h: 22, w: 18, r: 9 }),
    s('circle', { cx: 116, cy: 64, r: 24 }, 'cream'),
    s('path', { d: ring(116, 64, 24) + 'M116 50v14l10 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M74 128l12 12 26-28', ...SW(8) }, 'green', { stroke: true, accent: true })
  ],
  coautor: [
    ...openBook(80, 66, 'white', 'blue'),
    s('path', { d: 'M16 30l40 48 4 10-10-6-40-48z' }, 'orange', { accent: true }),
    s('path', { d: 'M144 30l-40 48-4 10 10-6 40-48z' }, 'green'),
    s('path', { d: 'M36 92h28M36 104h22M96 92h28M102 104h22', ...SW(3) }, 'gray', { stroke: true })
  ],
  codificar: [
    s('rect', { x: 14, y: 34, width: 50, height: 36, rx: 3 }, 'white'),
    outline({ x: 14, y: 34, width: 50, height: 36, rx: 3 }),
    s('path', { d: 'M14 34l25 20 25-20', ...SW(3) }, 'gray', { stroke: true }),
    ...gear(104, 52, 14, 8, 'gray'),
    s('path', { d: 'M74 52h12', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: dots([[24, 108], [72, 108], [96, 108], [24, 132], [48, 132], [120, 132]], 6) }, 'blue', { accent: true }),
    s('path', { d: 'M38 108h20M110 108h26M64 132h40', ...SW(10) }, 'blue', { stroke: true })
  ],
  colmenar: [
    ground(),
    s('path', { d: rects([[20, 92, 34, 44], [64, 80, 34, 56], [108, 92, 34, 44]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M18 86h38v8H18zM62 74h38v8H62zM106 86h38v8h-38z' }, 'brown'),
    s('path', { d: 'M20 112h34M64 102h34M64 120h34M108 112h34', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: dots([[37, 128], [81, 128], [125, 128]], 3) }, 'dark'),
    s('path', { d: dots([[40, 50], [70, 40], [104, 54], [124, 36]], 4) }, 'dark'),
    s('path', { d: 'M36 46l-4-6M44 46l4-6M66 36l-4-6M74 36l4-6M100 50l-4-6M108 50l4-6M120 32l-4-6M128 32l4-6', ...SW(2) }, 'sky', { stroke: true })
  ],
  comarcal: [
    s('path', { d: 'M24 40l40-20 52 10 26 34-10 46-40 30-50-10-22-40z' }, 'mint'),
    s('path', { d: 'M64 20l6 50-46 10M70 70l52 0M70 70l10 70', ...DASH(3, '5 5') }, 'gray', { stroke: true }),
    s('path', { d: 'M70 70l52 0 10 30-30 30-22 10z' }, 'orange', { accent: true }),
    s('path', { d: 'M100 80a10 10 0 0 1 10 10c0 8-10 18-10 18s-10-10-10-18a10 10 0 0 1 10-10z' }, 'red'),
    s('circle', { cx: 100, cy: 90, r: 3 }, 'white')
  ],
  confeso: [
    ...person(56, 138, 'orange', { accent: true }),
    s('path', { d: 'M46 72h4M60 72h4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 84q8-4 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 100l12 12 10-10', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: bubble(84, 22, 62, 44) }, 'white'),
    s('path', { d: bubble(84, 22, 62, 44), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 42l10 10 18-18', ...SW(6) }, 'green', { stroke: true })
  ],
  confesor: [
    s('rect', { x: 18, y: 26, width: 124, height: 110, rx: 4 }, 'brown'),
    s('path', { d: 'M18 26l62-14 62 14z' }, 'brown'),
    s('rect', { x: 28, y: 40, width: 48, height: 96 }, 'dark'),
    s('circle', { cx: 52, cy: 70, r: 12 }, 'skin'),
    s('path', { d: busts([52], 136, 34, 54) }, 'black'),
    s('rect', { x: 48, y: 82, width: 8, height: 6 }, 'white', { accent: true }),
    s('path', { d: 'M90 56h40v40H90zM90 66h40M90 76h40M90 86h40M100 56v40M110 56v40M120 56v40', ...SW(2) }, 'tan', { stroke: true })
  ],
  consolador: [
    s('path', { d: busts([60, 104], 140, 44, 50) }, 'blue'),
    s('path', { d: busts([104], 140, 44, 50) }, 'purple'),
    s('circle', { cx: 60, cy: 70, r: 20 }, 'skin'),
    s('circle', { cx: 104, cy: 70, r: 20 }, 'skin'),
    s('path', { d: 'M40 108q40-24 80-6', ...SW(9) }, 'skin', { stroke: true, accent: true }),
    s('path', { d: 'M94 74q4 3 8 0M106 74q4 3 8 0M98 84q6-4 12 0M52 72q4-3 8 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: drop(114, 88, 3) }, 'sky'),
    s('path', { d: heart(80, 30, 9) }, 'pink')
  ],
  contratante: [
    ...paper(52, 20, 56, 76),
    s('path', { d: 'M60 34h40M60 46h40M60 58h30', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 80q4-8 8 0t8 0M86 80q4-8 8 0t8 0', ...SW(2) }, 'blue', { stroke: true }),
    s('path', { d: busts([30, 130], 140, 30, 34) }, 'navy'),
    s('path', { d: dots([[30, 92], [130, 92]], 12) }, 'skin'),
    s('path', { d: 'M48 118q32 12 64 0', ...SW(8) }, 'skin', { stroke: true }),
    s('circle', { cx: 80, cy: 122, r: 8 }, 'orange', { accent: true })
  ],
  convertible: [
    ground(),
    s('path', { d: 'M18 116q0-18 20-18h20l18-4h50q16 0 16 22z' }, 'red', { accent: true }),
    s('path', { d: 'M74 94l8-18', ...SW(4) }, 'sky', { stroke: true }),
    s('circle', { cx: 62, cy: 80, r: 10 }, 'skin'),
    s('path', { d: 'M54 76q8-12 18-4l16 4', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[44, 118], [116, 118]], 13) }, 'dark'),
    s('path', { d: dots([[44, 118], [116, 118]], 5) }, 'gray')
  ],
  corno: [
    s('path', { d: ring(70, 82, 34), ...SW(9) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: ring(70, 82, 20), ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M96 104l26 16q14-14 22-2l-6 24q-14-8-24-8L96 112z' }, 'yellow'),
    s('path', { d: 'M40 70L20 54', ...SW(4) }, 'orange', { stroke: true }),
    s('circle', { cx: 18, cy: 52, r: 4 }, 'gray'),
    s('path', { d: dots([[72, 48], [82, 50], [92, 54]], 4) }, 'gray')
  ],
  corzo: [
    s('path', { d: 'M52 104v34M64 106v32M100 106v32M112 104v34', ...SW(6) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 82, cy: 96, rx: 38, ry: 18 }, 'brown', { accent: true }),
    s('ellipse', { cx: 46, cy: 92, rx: 8, ry: 12 }, 'cream'),
    s('path', { d: 'M108 90l10-34 14 4-8 34z' }, 'brown'),
    s('ellipse', { cx: 128, cy: 54, rx: 14, ry: 9, transform: 'rotate(25 128 54)' }, 'brown'),
    s('path', { d: 'M120 44l-4-24M120 34l-8-6M128 44l4-22M130 32l8-6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[130, 50]], 2) + dots([[140, 60]], 3) }, 'dark')
  ],
  criminalizar: [
    s('path', { d: ring(44, 106, 20) + ring(92, 106, 20) + 'M64 106h8', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 52l30-30 16 16-30 30z' }, 'brown', { accent: true }),
    s('path', { d: 'M110 56l30 30', ...SW(8) }, 'brown', { stroke: true }),
    s('rect', { x: 100, y: 124, width: 44, height: 14, rx: 3 }, 'brown'),
    s('path', { d: 'M76 74l-8-6M80 84h-10', ...SW(3) }, 'orange', { stroke: true })
  ],
  'cualificación': [
    s('rect', { x: 16, y: 40, width: 104, height: 76, rx: 4 }, 'cream'),
    s('path', { d: 'M16 40h104v76H16z', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M30 60h76M30 74h60M30 88h40', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 102l-8 30 12-8 8 12 4-30zM118 102l10 28 2-14 14 2-10-24z' }, 'blue'),
    s('circle', { cx: 116, cy: 100, r: 14 }, 'red', { accent: true }),
    s('path', { d: 'M80 14l40 14-40 14-40-14z' }, 'dark')
  ],
  cuneta: [
    backdrop('sky', 14, 60),
    s('path', { d: 'M14 74h82l14 30h10l12-30h14v72H14z' }, 'green'),
    s('path', { d: 'M14 74h82v20H14z' }, 'dark'),
    s('path', { d: 'M24 84h16M58 84h16', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M100 84l10 20h10l10-20z' }, 'blue', { accent: true }),
    s('path', { d: 'M96 74l14 30h10l12-30', ...SW(4) }, 'brown', { stroke: true })
  ],
  descanso: [
    s('circle', { cx: 124, cy: 30, r: 12 }, 'yellow'),
    s('path', { d: 'M24 138V40M136 138V60', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M24 64q56 60 112 10', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M30 72q50 50 100 6l-2 10q-48 42-96-6z' }, 'orange', { accent: true }),
    s('circle', { cx: 46, cy: 82, r: 10 }, 'skin'),
    s('path', { d: 'M42 82q4 3 8 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 90q30 22 60 0l-2 12q-28 18-56 0z' }, 'blue'),
    s('path', { d: 'M14 138h132', ...SW(4) }, 'green', { stroke: true })
  ],
  desplomar: [
    ground(),
    s('rect', { x: 30, y: 40, width: 50, height: 96, transform: 'rotate(14 80 136)' }, 'gray', { accent: true }),
    s('path', { d: grid(38, 50, 2, 4, 12, 12, 22, 20), transform: 'rotate(14 80 136)' }, 'sky'),
    s('path', { d: rects([[96, 112, 18, 14], [118, 120, 14, 16], [106, 96, 12, 10]]) }, 'gray'),
    s('path', { d: ells([[120, 132, 26, 8], [96, 128, 16, 6]]) }, 'tan'),
    s('path', { d: 'M110 52v14M126 60v12M118 82v8', ...SW(4) }, 'orange', { stroke: true })
  ],
  'destilación': [
    s('circle', { cx: 42, cy: 86, r: 22 }, 'sky'),
    s('path', { d: 'M36 66V44h12v22', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M42 44l72 32', ...SW(10) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: 'M114 76v24', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 126q-4-10 6-18q0 8 6 10q2-6 0-12q10 10 2 20z' }, 'orange'),
    s('path', { d: 'M100 112h28l-4 26h-20z' }, 'white'),
    s('path', { d: 'M100 112h28l-4 26h-20z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: drop(114, 106, 3) + 'M104 126h20l-1 10h-18z' }, 'blue')
  ],
  diadema: [
    s('path', { d: 'M24 112q56-40 112 0', ...SW(10) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M34 102l6-30 14 20 12-38 14 30 14-30 12 38 14-20 6 30q-56-32-112 0z' }, 'yellow'),
    s('path', { d: dots([[80, 64]], 7) }, 'red'),
    s('path', { d: dots([[54, 84], [106, 84]], 5) }, 'blue'),
    s('path', { d: dots([[40, 72], [66, 54], [94, 54], [120, 72]], 3) }, 'white'),
    s('path', { d: sparkle(80, 30, 9) }, 'yellow')
  ],
  dignatario: [
    s('rect', { x: 46, y: 80, width: 68, height: 60, rx: 18 }, 'navy'),
    s('path', { d: 'M70 80l10 22 10-22z' }, 'white'),
    s('path', { d: 'M54 84l58 50', ...SW(10) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 56, r: 20 }, 'skin'),
    s('path', { d: 'M60 52q0-24 20-24t20 24q-8-10-20-10t-20 10z' }, 'gray'),
    s('path', { d: star(66, 118, 8) }, 'yellow'),
    s('path', { d: dots([[72, 56], [88, 56]], 2.5) }, 'dark')
  ],
  'dócil': [
    s('path', { d: 'M60 116v20M76 118v18M100 118v18M116 116v20', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: ells([[88, 100, 36, 22], [64, 92, 16, 14], [88, 84, 18, 14], [112, 92, 16, 14]]) }, 'white'),
    s('path', { d: ells([[88, 100, 36, 22]]), ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 46, cy: 96, rx: 12, ry: 15 }, 'dark'),
    s('path', { d: 'M42 92q3 2 6 0', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M56 58q10-16 30-10l12 6q4 6-4 8l-20-2q-10 6-18-2z' }, 'skin', { accent: true }),
    s('path', { d: heart(118, 36, 10) }, 'pink')
  ],
  embarcadero: [
    backdrop('sky', 14, 60),
    s('rect', { x: 14, y: 74, width: 132, height: 72 }, 'blue'),
    s('path', { d: 'M14 86h86', ...SW(10) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M30 90v40M60 90v40M90 90v40', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M104 98h42l-8 18h-28z' }, 'red'),
    s('path', { d: 'M124 98V56l-18 36z' }, 'white'),
    s('path', { d: 'M96 92l10 8', ...SW(2) }, 'dark', { stroke: true })
  ],
  empobrecimiento: [
    s('path', { d: ells([[34, 128, 18, 6], [34, 118, 18, 6], [34, 108, 18, 6], [34, 98, 18, 6], [34, 88, 18, 6], [34, 78, 18, 6]]) }, 'yellow'),
    s('path', { d: ells([[80, 128, 18, 6], [80, 118, 18, 6], [80, 108, 18, 6]]) }, 'yellow'),
    s('path', { d: ells([[126, 128, 18, 6]]) }, 'yellow'),
    s('path', { d: 'M16 78v50M52 78v50M62 108v20M98 108v20', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M28 40l50 22 40 30', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M108 98l18 6-6-18z' }, 'red')
  ],
  enderezar: [
    ground(),
    s('path', { d: 'M96 136V26', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M76 136q-6-40 4-80', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 56, -110, 24, 8) + leaflet(80, 60, -40, 22, 7) + leaflet(76, 92, 200, 20, 6) }, 'green', { accent: true }),
    s('path', { d: 'M74 70h24M72 106h26', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M40 60q-14 40 8 76', ...DASH(3, '4 5') }, 'gray', { stroke: true })
  ],
  'enigmático': [
    s('rect', { x: 26, y: 14, width: 108, height: 132, rx: 4 }, 'yellow'),
    s('rect', { x: 36, y: 24, width: 88, height: 112 }, 'dark'),
    s('path', { d: 'M48 136q4-34 32-34t32 34z' }, 'brown'),
    s('path', { d: 'M56 70q0-36 24-36t24 36v34H56z' }, 'brown'),
    s('ellipse', { cx: 80, cy: 72, rx: 17, ry: 22 }, 'skin', { accent: true }),
    s('path', { d: 'M72 82q8 4 16 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: dots([[73, 66], [87, 66]], 2) }, 'dark')
  ],
  escandinavo: [
    backdrop('sky', 14, 96),
    s('path', { d: 'M14 110L44 50l20 30 26-46 56 76z' }, 'gray'),
    s('rect', { x: 14, y: 110, width: 132, height: 36 }, 'blue'),
    s('path', { d: 'M24 100q4 12 10 12h92q6 0 10-12l-4 0-12 26H40l-12-26z' }, 'brown'),
    s('path', { d: 'M80 112V66', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 62, y: 68, width: 36, height: 34 }, 'red', { accent: true }),
    s('path', { d: 'M62 80h36M62 92h36', ...SW(5) }, 'white', { stroke: true })
  ],
  esfinge: [
    backdrop('sky'),
    s('path', { d: 'M96 120l26-58 24 58z' }, 'tan'),
    s('rect', { x: 14, y: 120, width: 132, height: 26 }, 'yellow'),
    s('path', { d: 'M24 122V98q0-14 16-14h36v38zM76 112h44v10H76z' }, 'orange', { accent: true }),
    s('path', { d: 'M48 92V66q0-22 16-22t16 22v26z' }, 'blue'),
    s('path', { d: 'M52 60h24M52 70h24M52 80h24', ...SW(3) }, 'yellow', { stroke: true }),
    s('ellipse', { cx: 64, cy: 66, rx: 9, ry: 12 }, 'orange'),
    s('path', { d: 'M18 110q-6-14 4-20', ...SW(4) }, 'orange', { stroke: true })
  ],
  espiga: [
    s('path', { d: 'M80 140V70', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(80, 136, -130, 34, 4) }, 'yellow'),
    s('path', { d: [40, 52, 64, 76, 88].map(y => leaflet(80, y + 6, -125, 18, 6) + leaflet(80, y + 6, -55, 18, 6)).join('') + leaflet(80, 40, -90, 16, 6) }, 'yellow', { accent: true }),
    s('path', { d: 'M68 46l-14-20M92 46l14-20M66 60l-20-14M94 60l20-14M66 74l-22-8M94 74l22-8', ...SW(2) }, 'orange', { stroke: true })
  ],
  espora: [
    s('path', { d: 'M24 70q56-60 112 0z' }, 'red', { accent: true }),
    s('path', { d: dots([[50, 52], [80, 40], [108, 54]], 6) }, 'white'),
    s('path', { d: 'M24 70h112', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M70 70v66h20V70z' }, 'cream'),
    s('path', { d: dots([[38, 86], [56, 96], [104, 92], [124, 84], [44, 112], [116, 112], [30, 128], [130, 132]], 3) }, 'brown'),
    s('path', { d: 'M14 138h132', ...SW(4) }, 'green', { stroke: true })
  ],
  estepa: [
    backdrop('sky', 14, 74),
    s('path', { d: 'M14 88h132v58H14z' }, 'yellow'),
    s('path', { d: 'M30 104l4-12 4 12M60 120l4-14 4 14M100 108l4-12 4 12M124 132l4-14 4 14M40 136l4-12 4 12', ...SW(3) }, 'tan', { stroke: true }),
    s('circle', { cx: 92, cy: 120, r: 12 }, 'brown', { accent: true }),
    s('path', { d: 'M84 112l16 16M100 112l-16 16', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M110 30h24M100 44h18', ...SW(4) }, 'white', { stroke: true })
  ],
  excavar: [
    s('path', { d: 'M14 104h132v42H14z' }, 'brown'),
    s('path', { d: 'M60 104q20 30 50 0z' }, 'dark'),
    s('path', { d: 'M18 104q14-26 30 0z' }, 'tan'),
    ...lean(102, 104, -18, 'orange', { accent: true, h: 36, r: 10 }),
    s('path', { d: 'M110 26l-28 72', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M74 94l14 6-4 12-14-4z' }, 'gray'),
    s('path', { d: 'M100 82l-12-10', ...SW(6) }, 'skin', { stroke: true })
  ],
  exdirector: [
    s('path', { d: 'M28 70h40v40H28zM34 110l-4 26M62 110l4 26', ...DASH(4, '5 5') }, 'gray', { stroke: true }),
    s('rect', { x: 26, y: 40, width: 44, height: 34, rx: 6 }, 'dark'),
    s('rect', { x: 24, y: 96, width: 48, height: 12, rx: 3 }, 'dark'),
    ...person(116, 138, 'blue', { accent: true }),
    s('rect', { x: 96, y: 98, width: 40, height: 24, rx: 2 }, 'tan'),
    s('path', { d: 'M84 70h-10M86 84h-12', ...SW(3) }, 'gray', { stroke: true })
  ],
  expansivo: [
    s('path', { d: ring(80, 80, 56), ...DASH(3, '6 6') }, 'sky', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 26 }, 'orange', { accent: true }),
    s('path', { d: 'M80 48V18M80 112v30M48 80H18M112 80h30', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M72 24l8-12 8 12zM72 136l8 12 8-12zM24 72l-12 8 12 8zM136 72l12 8-12 8z' }, 'red')
  ],
  farsante: [
    ...person(84, 138, 'purple'),
    s('path', { d: 'M62 60q14-6 28 0v18q-14 14-28 0z' }, 'white', { accent: true }),
    s('path', { d: 'M62 60q14-6 28 0v18q-14 14-28 0z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M68 66h4M80 66h4M68 74q8 6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 72l-10 30', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 116l14 6 6-14', ...SW(6) }, 'skin', { stroke: true })
  ],
  fiero: [
    s('path', { d: burst(80, 78, 64, 46, 16) }, 'orange'),
    s('circle', { cx: 80, cy: 80, r: 40 }, 'yellow', { accent: true }),
    s('path', { d: 'M58 62l14 8M102 62l-14 8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 90q20-10 40 0v18q-20 10-40 0z' }, 'red'),
    s('path', { d: 'M62 90l4 12 6-12zM98 90l-4 12-6-12z' }, 'white'),
    s('path', { d: 'M74 80l6 6 6-6z' }, 'dark')
  ],
  finito: [
    s('path', { d: 'M24 52v56M136 52v56', ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M24 80h112', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[46, 80], [68, 80], [90, 80], [112, 80]], 8) }, 'blue'),
    s('path', { d: 'M20 128h120', ...DASH(3, '4 6') }, 'gray', { stroke: true })
  ],
  flete: [
    ground(),
    s('rect', { x: 14, y: 54, width: 88, height: 62, rx: 3 }, 'orange', { accent: true }),
    s('path', { d: 'M102 72h22l18 22v22h-40z' }, 'red'),
    s('path', { d: 'M110 78h14l10 14h-24z' }, 'sky'),
    s('path', { d: 'M40 54v62M66 54v62', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: dots([[38, 120], [120, 120]], 13) }, 'dark'),
    s('path', { d: dots([[38, 120], [120, 120]], 5) }, 'gray')
  ],
  fortuito: [
    ground(),
    ...lean(64, 136, 20, 'blue', { accent: true }),
    s('circle', { cx: 112, cy: 128, r: 9 }, 'yellow'),
    s('path', { d: 'M108 114l-4-8M120 114l4-8M128 124h8', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[94, 82]], 4) }, 'dark'),
    s('path', { d: sparkle(130, 40, 10) + sparkle(30, 30, 7) }, 'orange')
  ],
  'galáctico': [
    s('circle', { cx: 80, cy: 80, r: 66 }, 'navy'),
    s('path', { d: 'M80 80q30-30 10-50M80 80q-30 30-10 50M80 80q30 30 50 10M80 80q-30-30-50-10', ...SW(10) }, 'purple', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'white'),
    s('path', { d: star(124, 40, 6) + star(36, 120, 5) + star(130, 120, 4) + star(34, 40, 4) }, 'yellow')
  ],
  'germánico': [
    s('path', { d: 'M120 140V20', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M120 10l8 18h-16z' }, 'gray'),
    s('circle', { cx: 70, cy: 86, r: 50 }, 'brown', { accent: true }),
    s('path', { d: ring(70, 86, 50) + 'M20 86h100M70 36v100', ...SW(4) }, 'tan', { stroke: true }),
    s('circle', { cx: 70, cy: 86, r: 14 }, 'gray'),
    s('circle', { cx: 70, cy: 86, r: 6 }, 'white')
  ],
  gimnasta: [
    ...person(70, 136, 'pink', { accent: true }),
    s('path', { d: 'M58 98l-14-34M82 98l22-30', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M104 68l10-20', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M114 48q30-10 18 20t-30 20q-20 20 0 40', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M58 136h24', ...SW(4) }, 'gray', { stroke: true })
  ],
  godo: [
    s('path', { d: 'M44 18l-8 34M80 14v34M116 18l8 34', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 52h100v34H30z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[46, 69], [80, 69], [114, 69]], 7) }, 'blue'),
    s('path', { d: dots([[63, 69], [97, 69]], 5) }, 'red'),
    s('path', { d: 'M40 86v26M56 86v34M72 86v26M88 86v34M104 86v26M120 86v34', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[40, 114], [56, 122], [72, 114], [88, 122], [104, 114], [120, 122]], 4) }, 'red'),
    s('path', { d: 'M80 86v40', ...SW(2) }, 'gray', { stroke: true })
  ],
  hilarante: [
    s('circle', { cx: 80, cy: 80, r: 52 }, 'yellow', { accent: true }),
    s('path', { d: 'M52 62q8-10 16 0M92 62q8-10 16 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M50 84h60q0 34-30 34T50 84z' }, 'dark'),
    s('path', { d: 'M62 106q18-10 36 0q-18 14-36 0z' }, 'red'),
    s('path', { d: drop(40, 76, 7) + drop(120, 76, 7) }, 'sky'),
    s('path', { d: 'M18 40l12 8M142 40l-12 8', ...SW(4) }, 'orange', { stroke: true })
  ],
  homenajear: [
    s('path', { d: 'M80 140V112M60 140l20-28 20 28', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: laurel(80, 66, 40) }, 'green', { accent: true }),
    s('path', { d: 'M64 104l-10 26 12-4 6 10 8-30zM96 104l10 26-12-4-6 10-8-30z' }, 'red'),
    s('circle', { cx: 80, cy: 66, r: 24 }, 'cream'),
    s('path', { d: star(80, 66, 14) }, 'yellow')
  ],
  hule: [
    s('rect', { x: 52, y: 14, width: 44, height: 126 }, 'brown'),
    s('path', { d: 'M52 40l44 16M52 60l44 16M52 80l44 16', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M96 96v12', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: drop(96, 116, 4) }, 'cream'),
    s('path', { d: 'M86 124h22l-3 16H89z' }, 'gray', { accent: true }),
    s('path', { d: 'M88 128h18', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: leaflet(96, 22, -20, 40, 10) + leaflet(52, 22, 200, 36, 9) }, 'green'),
    s('path', { d: 'M14 140h132', ...SW(4) }, 'green', { stroke: true })
  ],
  ilustrativo: [
    s('path', { d: 'M40 136l14-30M120 136l-14-30', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 26, y: 30, width: 108, height: 78, rx: 4 }, 'white'),
    outline({ x: 26, y: 30, width: 108, height: 78, rx: 4 }, 'brown', 5),
    s('path', { d: 'M36 98l26-30 18 18 14-12 30 24z' }, 'green', { accent: true }),
    s('circle', { cx: 108, cy: 50, r: 9 }, 'yellow'),
    s('path', { d: 'M18 56l26 14', ...SW(4) }, 'red', { stroke: true })
  ],
  incoherencia: [
    s('path', { d: bubble(16, 20, 128, 92) }, 'cream'),
    s('path', { d: bubble(16, 20, 128, 92), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: spiral(40, 46) + 'M76 36l8 14 8-14 8 14M112 50l14-16', ...SW(4) }, 'purple', { stroke: true }),
    s('path', { d: 'M36 84l10-16 10 16z' }, 'red', { accent: true }),
    s('rect', { x: 72, y: 70, width: 16, height: 16 }, 'blue'),
    s('path', { d: 'M100 78q6-10 12 0t12 0', ...SW(4) }, 'green', { stroke: true })
  ],
  'indagación': [
    s('path', { d: ells([[28, 128, 7, 11], [48, 112, 7, 11], [44, 86, 7, 11], [64, 70, 7, 11]]) }, 'brown'),
    s('path', { d: 'M120 112l22 22', ...SW(10) }, 'brown', { stroke: true }),
    s('circle', { cx: 100, cy: 90, r: 26 }, 'sky'),
    s('path', { d: ring(100, 90, 26), ...SW(6) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: ells([[96, 92, 6, 9]]) }, 'brown'),
    s('path', { d: dots([[86, 36], [108, 30]], 1) + 'M80 40q8-20 30-18', ...DASH(3, '4 5') }, 'gray', { stroke: true })
  ],
  indagatorio: [
    backdrop('dark'),
    s('path', { d: 'M80 14v20', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 50q0-16 18-16t18 16z' }, 'gray'),
    s('path', { d: 'M62 50h36l30 70H32z' }, 'yellow', { accent: true }),
    s('rect', { x: 26, y: 112, width: 108, height: 10 }, 'brown'),
    s('circle', { cx: 80, cy: 84, r: 11 }, 'skin'),
    s('path', { d: busts([80], 112, 26, 18) }, 'orange'),
    s('path', { d: drop(96, 80, 3) }, 'sky')
  ],
  indemnizar: [
    s('path', { d: 'M18 136l6-46h40l6 46z' }, 'blue'),
    s('path', { d: 'M44 90l-6 14 8 10-6 22', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M26 90q18-18 36 0', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M82 70h28', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M106 62l10 8-10 8z' }, 'orange'),
    s('path', { d: 'M112 136q-14 0-14-20 0-26 16-34h12q16 8 16 34 0 20-14 20z' }, 'green', { accent: true }),
    s('path', { d: 'M112 82l-6-14h28l-6 14z' }, 'green'),
    s('circle', { cx: 120, cy: 112, r: 9 }, 'yellow')
  ],
  indomable: [
    ground(),
    ...rot(horse('brown', 'dark', { accent: true }), -22, 60, 136),
    s('path', { d: 'M20 60l10 6M18 84h12M136 100l10-6', ...SW(4) }, 'gray', { stroke: true })
  ],
  'inequívoco': [
    s('circle', { cx: 74, cy: 86, r: 56 }, 'white'),
    s('path', { d: ring(74, 86, 56) + ring(74, 86, 38), ...SW(10) }, 'red', { stroke: true }),
    s('circle', { cx: 74, cy: 86, r: 16 }, 'red', { accent: true }),
    s('path', { d: 'M74 86l60-60', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M134 26l-14 0 0-14zM146 38l-14 0 0-14z' }, 'green')
  ],
  inestimable: [
    s('path', { d: halfRays(80, 70, 40, 60, 7), ...SW(4) }, 'yellow', { stroke: true }),
    s('rect', { x: 28, y: 76, width: 104, height: 60, rx: 4 }, 'brown'),
    s('path', { d: 'M28 76q0-30 52-30t52 30z' }, 'brown', { accent: true }),
    s('path', { d: 'M28 92h104M28 76h104', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M48 60l8-10 8 10-8 10zM96 58l10-10 10 10-10 10z' }, 'sky'),
    s('path', { d: dots([[78, 52]], 8) }, 'red'),
    s('rect', { x: 72, y: 86, width: 16, height: 18, rx: 2 }, 'yellow')
  ],
  infelicidad: [
    ...face(70, 84, 46, 'sky', 'frown', { accent: true }),
    s('path', { d: drop(52, 96, 5) }, 'blue'),
    s('path', { d: 'M136 136v-50q0-10-10-14', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: ells([[122, 78, 8, 6]]) }, 'brown'),
    s('path', { d: 'M126 74q-10 10-6 20M122 74q-12 4-14 14', ...SW(4) }, 'gray', { stroke: true })
  ],
  injerto: [
    ground(),
    s('path', { d: 'M80 136V70', ...SW(16) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 74l6-40', ...SW(8) }, 'green', { stroke: true, accent: true }),
    s('path', { d: leaflet(84, 44, -150, 26, 8) + leaflet(86, 40, -30, 26, 8) }, 'green'),
    s('rect', { x: 68, y: 66, width: 24, height: 16, rx: 3 }, 'orange'),
    s('path', { d: 'M68 74h24', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M80 100l-22-18', ...SW(6) }, 'brown', { stroke: true })
  ],
  inmundo: [
    s('path', { d: 'M40 136l-6-72h92l-6 72z' }, 'gray', { accent: true }),
    s('rect', { x: 28, y: 54, width: 104, height: 12, rx: 3 }, 'dark'),
    s('path', { d: 'M42 54l10-22 20 6 12-14 16 16 18 2z' }, 'brown'),
    s('path', { d: 'M60 82v40M80 82v40M100 82v40', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M20 40q8-10 0-20M140 40q8-10 0-20', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots([[52, 20], [120, 26], [138, 70]], 4) }, 'dark'),
    s('path', { d: ells([[30, 140, 14, 4], [130, 140, 12, 4]]) }, 'brown')
  ],
  instruir: [
    s('rect', { x: 14, y: 22, width: 92, height: 66, rx: 4 }, 'green'),
    s('path', { d: 'M28 70l20-24 16 16 22-26', ...SW(4) }, 'white', { stroke: true }),
    ...person(126, 138, 'purple', { accent: true }),
    s('path', { d: 'M114 100L96 66', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M96 66l-14-16', ...SW(3) }, 'brown', { stroke: true }),
    s('circle', { cx: 42, cy: 118, r: 10 }, 'skin'),
    s('path', { d: busts([42], 142, 26, 14) }, 'orange')
  ],
  irreverente: [
    s('rect', { x: 34, y: 18, width: 92, height: 112, rx: 4 }, 'yellow'),
    s('rect', { x: 42, y: 26, width: 76, height: 96 }, 'cream'),
    s('path', { d: busts([80], 122, 48, 34) }, 'navy'),
    s('circle', { cx: 80, cy: 64, r: 18 }, 'skin'),
    s('path', { d: 'M66 74q7-8 14-2q7-6 14 2', ...SW(4) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: 'M130 120l-26 22', ...SW(8) }, 'red', { stroke: true }),
    s('path', { d: 'M102 144l2-6', ...SW(4) }, 'dark', { stroke: true })
  ],
  jugabilidad: [
    s('path', { d: 'M40 58h80q24 0 26 40q2 30-18 30-12 0-20-18H52q-8 18-20 18-20 0-18-30 2-40 26-40z' }, 'purple', { accent: true }),
    s('path', { d: 'M48 76v24M36 88h24', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: dots([[110, 78], [124, 90], [110, 100], [96, 90]], 6) }, 'yellow'),
    s('path', { d: sparkle(40, 30, 9) + sparkle(120, 30, 9) + sparkle(80, 22, 6) }, 'orange')
  ],
  madrugar: [
    backdrop('pink', 14, 96),
    s('circle', { cx: 80, cy: 110, r: 30 }, 'orange'),
    s('path', { d: halfRays(80, 110, 38, 50, 7), ...SW(4) }, 'yellow', { stroke: true }),
    s('rect', { x: 14, y: 110, width: 132, height: 36 }, 'green'),
    s('circle', { cx: 112, cy: 124, r: 14 }, 'red', { accent: true }),
    s('circle', { cx: 112, cy: 124, r: 9 }, 'white'),
    s('path', { d: 'M112 118v6h4M100 110l-4-4M124 110l4-4', ...SW(2) }, 'dark', { stroke: true })
  ],
  mayoral: [
    ground(),
    ...person(48, 138, 'brown', { accent: true }),
    s('path', { d: 'M28 62h40M36 62q0-14 12-14t12 14z' }, 'tan'),
    s('path', { d: 'M28 62h40', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M74 136V58', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: ells([[114, 112, 22, 14], [100, 104, 9, 8], [114, 100, 10, 8], [128, 104, 9, 8]]) }, 'white'),
    s('path', { d: ells([[114, 112, 22, 14]]) + 'M102 126v10M126 126v10', ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 88, cy: 108, rx: 7, ry: 9 }, 'dark')
  ],
  'medallón': [
    s('path', { d: 'M40 16q40 56 80 0', ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 96, r: 46 }, 'yellow', { accent: true }),
    s('path', { d: ring(80, 96, 36), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: star(80, 96, 22) }, 'orange'),
    s('rect', { x: 74, y: 42, width: 12, height: 10, rx: 3 }, 'orange')
  ],
  'minúsculo': [
    s('path', { d: 'M28 28l58 74M40 20l52 78', ...SW(8) }, 'gray', { stroke: true, accent: true }),
    s('circle', { cx: 92, cy: 104, r: 3 }, 'red'),
    s('path', { d: ring(96, 106, 22), ...DASH(3, '4 4') }, 'orange', { stroke: true }),
    s('path', { d: 'M114 120l20 18', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M18 140h124', ...SW(4) }, 'gray', { stroke: true })
  ]
};
