// Illustration specs for words still undrawn in batches 0056–0057 (see server/scripts/lexicon/art.js)
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
  solano: [
    s('path', { d: rays(118, 46, 24, 32, 8), ...SW(4) }, 'orange', { stroke: true }),
    s('circle', { cx: 118, cy: 46, r: 18 }, 'yellow', { accent: true }),
    s('path', { d: 'M100 82H34M112 98H46q-12 0-12-10M96 114H28', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: 'M44 136q-4-26 6-40', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(50, 98, 200, 22, 7) + leaflet(48, 110, 190, 20, 6) }, 'green'),
    ground()
  ],
  subdirector: [
    ground(),
    ...person(56, 136, 'navy', { h: 50, w: 34, r: 13 }),
    ...person(110, 136, 'blue', { h: 38, w: 26, r: 11, accent: true }),
    s('path', { d: star(56, 104, 9) }, 'yellow'),
    s('path', { d: star(110, 108, 7) }, 'gray'),
    s('path', { d: 'M52 88l4 6 4-6M106 98l4 5 4-5', ...SW(3) }, 'white', { stroke: true })
  ],
  sublime: [
    backdrop('sky'),
    s('path', { d: poly([[14, 146], [80, 34], [146, 146]]) }, 'purple', { accent: true }),
    s('path', { d: 'M80 34l-20 34 10-6 10 8 10-8 10 6z' }, 'white'),
    s('path', { d: sparkle(122, 42, 11) + sparkle(36, 54, 8) + sparkle(128, 86, 6) }, 'yellow'),
    s('path', { d: 'M14 128q40-10 66 0t66 0v18H14z' }, 'navy')
  ],
  subsistencia: [
    s('ellipse', { cx: 80, cy: 128, rx: 64, ry: 10 }, 'gray'),
    s('path', { d: 'M20 124q0-44 44-44t44 44z' }, 'tan', { accent: true }),
    s('path', { d: 'M44 96l8 12M62 90l8 14M80 94l8 12', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 110, y: 64, width: 28, height: 60, rx: 4 }, 'sky'),
    s('rect', { x: 110, y: 84, width: 28, height: 40, rx: 4 }, 'blue'),
    s('path', { d: 'M110 64v56a4 4 0 0 0 4 4h20a4 4 0 0 0 4-4V64', ...SW(3) }, 'gray', { stroke: true })
  ],
  tajo: [
    s('rect', { x: 14, y: 100, width: 132, height: 46, rx: 6 }, 'brown'),
    s('path', { d: poly([[60, 100], [80, 136], [100, 100]]) }, 'dark'),
    s('path', { d: 'M114 22L86 96', ...SW(8) }, 'tan', { stroke: true }),
    s('path', { d: 'M88 18q32-6 52 14l-6 6q-18-10-44-8z', transform: 'rotate(10 114 26)' }, 'gray', { accent: true }),
    s('path', { d: dots([[52, 92], [44, 82], [108, 90], [118, 80]], 4) }, 'tan'),
    s('path', { d: 'M34 70l8 8M128 66l-8 8', ...SW(3) }, 'orange', { stroke: true })
  ],
  transcurrir: [
    s('path', { d: 'M50 30h60q0 30-26 50q26 20 26 50H50q0-30 26-50q-26-20-26-50z' }, 'sky'),
    s('path', { d: 'M58 42h44q-6 18-22 28q-16-10-22-28z' }, 'yellow', { accent: true }),
    s('path', { d: 'M54 130q4-20 26-26q22 6 26 26z' }, 'yellow'),
    s('path', { d: 'M80 72v34', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: rects([[40, 22, 80, 10], [40, 128, 80, 10]]) }, 'brown'),
    arrow('M132 40q14 40 0 80', 'gray', 4),
    s('path', { d: 'M126 116l6 10 8-8z' }, 'gray')
  ],
  trasplante: [
    s('path', { d: 'M20 104h44l-6 32H26z' }, 'orange'),
    s('ellipse', { cx: 42, cy: 106, rx: 18, ry: 4 }, 'dark'),
    s('path', { d: 'M96 104h44l-6 32h-32z' }, 'orange', { accent: true }),
    s('path', { d: 'M118 104V70', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: leaflet(118, 84, -150, 24, 8) + leaflet(118, 76, -30, 24, 8) + leaflet(118, 70, -90, 18, 6) }, 'green'),
    arrow('M40 92q10-62 58-52', 'red', 5),
    s('path', { d: 'M94 30l14 12-16 8z' }, 'red')
  ],
  uranio: [
    s('circle', { cx: 80, cy: 80, r: 64 }, 'yellow', { accent: true }),
    s('path', { d: wedge(80, 80, 54, -120, -60) + wedge(80, 80, 54, 0, 60) + wedge(80, 80, 54, 120, 180) }, 'black'),
    s('circle', { cx: 80, cy: 80, r: 16 }, 'yellow'),
    s('circle', { cx: 80, cy: 80, r: 10 }, 'black'),
    s('circle', { cx: 80, cy: 80, r: 64, ...SW(4) }, 'orange', { stroke: true })
  ],
  vasto: [
    backdrop('sky'),
    s('path', { d: 'M14 92h132v42a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green'),
    s('circle', { cx: 120, cy: 46, r: 14 }, 'yellow'),
    ...person(80, 112, 'red', { h: 12, w: 8, r: 4, accent: true }),
    arrow('M64 122H30M96 122h34', 'white', 4),
    s('path', { d: 'M32 115l-10 7 10 7zM128 115l10 7-10 7z' }, 'white')
  ],
  viabilidad: [
    ...paper(34, 22, 80, 112),
    s('path', { d: 'M48 42h52M48 56h40M48 70h48', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 108, cy: 106, r: 30 }, 'green', { accent: true }),
    s('path', { d: 'M94 106l10 10 18-20', ...SW(7) }, 'white', { stroke: true })
  ],
  vocero: [
    ...person(70, 100, 'navy', { h: 34 }),
    s('path', { d: 'M38 96h64l-8 44H46z' }, 'brown'),
    s('path', { d: 'M70 104h4', ...SW(10) }, 'yellow', { stroke: true }),
    s('path', { d: 'M88 96l10-22', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 100, cy: 70, r: 7 }, 'dark'),
    s('path', { d: 'M114 58q10 12 0 26M126 48q18 22 0 46', ...SW(5) }, 'orange', { stroke: true }),
    s('rect', { x: 52, y: 110, width: 36, height: 14, rx: 3 }, 'red', { accent: true })
  ],
  'ébola': [
    s('circle', { cx: 80, cy: 80, r: 64 }, 'mint'),
    s('path', { d: 'M36 118q22-8 30-40t36-40q28-4 30 20q0 20-20 20q-14 0-14-12', ...SW(14) }, 'red', { stroke: true }),
    s('path', { d: 'M36 118q22-8 30-40t36-40q28-4 30 20q0 20-20 20q-14 0-14-12', ...DASH(4, '1 9') }, 'dark', { stroke: true }),
    s('path', { d: dots([[40, 50], [118, 110], [100, 126]], 6) }, 'pink', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 64, ...SW(5) }, 'gray', { stroke: true })
  ],
  'épico': [
    s('path', { d: poly([[14, 146], [80, 96], [146, 146]]) }, 'gray'),
    s('path', { d: burst(80, 50, 40, 26, 12) }, 'yellow'),
    s('path', { d: 'M70 76l-30 30 26-6z' }, 'red'),
    ...person(80, 112, 'blue', { h: 34, w: 24, r: 10, accent: true }),
    s('path', { d: 'M92 82l18-56', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M84 74l16 6', ...SW(5) }, 'brown', { stroke: true })
  ],
  'abstención': [
    s('rect', { x: 30, y: 84, width: 100, height: 54, rx: 6 }, 'blue', { accent: true }),
    s('rect', { x: 58, y: 84, width: 44, height: 6 }, 'dark'),
    ...paper(64, 36, 32, 42),
    s('path', { d: ring(80, 58, 30) + 'M59 37l42 42', ...SW(7) }, 'red', { stroke: true })
  ],
  aburrimiento: [
    ...face(66, 76, 42, 'yellow', 'flat', { accent: true }),
    s('path', { d: 'M44 68h16M72 68h16', ...SW(4) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 70, cy: 124, rx: 26, ry: 10 }, 'skin'),
    s('circle', { cx: 126, cy: 36, r: 18 }, 'white'),
    s('path', { d: ring(126, 36, 18) + 'M126 24v12l8 6', ...SW(4) }, 'dark', { stroke: true })
  ],
  adquisitivo: [
    s('path', { d: 'M44 60v-8a16 16 0 0 1 32 0v8', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M28 60h64l6 76H22z' }, 'orange', { accent: true }),
    s('path', { d: ells([[118, 126, 20, 7], [118, 114, 20, 7], [118, 102, 20, 7], [118, 90, 20, 7]]) }, 'yellow'),
    s('path', { d: 'M98 90v36M138 90v36', ...SW(2) }, 'orange', { stroke: true }),
    arrow('M118 70V30', 'green', 6),
    s('path', { d: 'M108 36l10-14 10 14z' }, 'green')
  ],
  alboroto: [
    s('path', { d: burst(80, 50, 36, 22, 12) }, 'yellow'),
    s('path', { d: 'M18 30l8 8-8 8 8 8M142 30l-8 8 8 8-8 8', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: busts([36, 80, 124], 142, 32, 36) }, 'blue', { accent: true }),
    s('path', { d: dots([[36, 96], [80, 92], [124, 96]], 14) }, 'skin'),
    s('path', { d: dots([[36, 102], [80, 98], [124, 102]], 5) }, 'dark'),
    s('path', { d: 'M18 86l10-6M142 86l-10-6M60 62l6 10M100 62l-6 10', ...SW(4) }, 'red', { stroke: true })
  ],
  alfabeto: [
    s('rect', { x: 14, y: 20, width: 132, height: 98, rx: 6 }, 'brown'),
    s('rect', { x: 22, y: 28, width: 116, height: 82, rx: 3 }, 'dark'),
    s('path', { d: dots([[40, 50], [112, 88]], 9) }, 'white'),
    s('path', { d: poly([[64, 58], [74, 40], [84, 58]]) + poly([[30, 96], [40, 78], [50, 96]]) }, 'yellow', { accent: true }),
    s('path', { d: rects([[100, 42, 18, 16], [62, 80, 18, 16]]) }, 'pink'),
    s('path', { d: 'M40 118l-8 24M120 118l8 24', ...SW(5) }, 'brown', { stroke: true })
  ],
  'bailarín': [
    ground(),
    s('circle', { cx: 84, cy: 36, r: 12 }, 'skin'),
    s('path', { d: 'M76 54l-28-22M94 56l26-24', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M78 90l-6 46M92 90l32 18', ...SW(8) }, 'dark', { stroke: true }),
    s('rect', { x: 70, y: 50, width: 28, height: 44, rx: 9, transform: 'rotate(8 84 72)' }, 'purple', { accent: true }),
    ...note(32, 96, 'orange')
  ],
  boicot: [
    s('path', { d: 'M50 64h72l-10 36H60z' }, 'sky', { accent: true }),
    s('path', { d: 'M26 50h16l16 54h56', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[66, 118], [108, 118]], 8) }, 'dark'),
    s('path', { d: ring(80, 82, 62) + 'M36 38l88 88', ...SW(9) }, 'red', { stroke: true })
  ],
  bonaerense: [
    backdrop('sky'),
    s('path', { d: 'M14 108h132v26a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green', { accent: true }),
    s('circle', { cx: 40, cy: 44, r: 14 }, 'yellow'),
    s('path', { d: 'M100 108l10-50 10 50M104 88h12', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rays(110, 56, 3, 22, 8, 22), ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 128l4-10M40 132l4-12M64 126l4-10M130 130l4-10', ...SW(3) }, 'mint', { stroke: true })
  ],
  carisma: [
    ground(140),
    s('path', { d: sparkle(54, 46, 10) + sparkle(106, 46, 10) + sparkle(80, 26, 7) }, 'yellow'),
    ...person(80, 140, 'red', { accent: true }),
    s('path', { d: busts([28, 132], 140, 26, 34) }, 'blue'),
    s('path', { d: dots([[28, 98], [132, 98]], 10) }, 'skin'),
    s('path', { d: heart(28, 70, 9) + heart(132, 70, 9) }, 'pink')
  ],
  cavidad: [
    s('path', { d: 'M14 140q8-100 66-100t66 100z' }, 'gray', { accent: true }),
    s('path', { d: 'M50 140v-28a30 30 0 0 1 60 0v28z' }, 'dark'),
    s('path', { d: 'M40 70l10 6M110 64l10-4M76 56l8 4', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: dots([[30, 134], [126, 132]], 6) }, 'brown'),
    s('path', { d: 'M10 140h140', ...SW(4) }, 'brown', { stroke: true })
  ],
  cloro: [
    s('path', { d: 'M46 52h68v78q0 8-8 8H54q-8 0-8-8z' }, 'white'),
    s('path', { d: 'M46 52h68v78q0 8-8 8H54q-8 0-8-8z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 52q24 0 24 24', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 60, y: 30, width: 26, height: 22, rx: 4 }, 'blue'),
    s('rect', { x: 56, y: 76, width: 48, height: 46, rx: 4 }, 'mint'),
    s('path', { d: drop(80, 100, 10) }, 'sky', { accent: true }),
    s('path', { d: sparkle(130, 108, 8) + sparkle(28, 40, 7) }, 'sky')
  ],
  cocido: [
    s('path', { d: 'M60 58q-6-8 0-16t0-16M80 54q-6-8 0-16t0-16M100 58q-6-8 0-16t0-16', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M30 76h100v44q0 18-18 18H48q-18 0-18-18z' }, 'dark'),
    s('path', { d: 'M30 86h-12M130 86h12', ...SW(7) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 80, cy: 76, rx: 52, ry: 11 }, 'orange', { accent: true }),
    s('path', { d: dots([[54, 74], [66, 79], [100, 74], [110, 79], [88, 80]], 5) }, 'tan'),
    s('path', { d: 'M62 72q12-8 24 0', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: leaflet(96, 72, -20, 14, 5) }, 'green')
  ],
  comentarista: [
    s('rect', { x: 14, y: 18, width: 132, height: 48, rx: 6 }, 'green'),
    s('path', { d: 'M80 18v48' + ring(80, 42, 12), ...SW(3) }, 'white', { stroke: true }),
    ...person(64, 120, 'blue', { h: 30, w: 30, r: 13, accent: true }),
    s('path', { d: 'M50 76a14 14 0 0 1 28 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M78 80l12 6', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 18, y: 112, width: 124, height: 28, rx: 4 }, 'brown'),
    s('path', { d: 'M104 80q8 6 0 14M116 74q14 12 0 26', ...SW(4) }, 'orange', { stroke: true })
  ],
  computador: [
    s('rect', { x: 24, y: 24, width: 112, height: 76, rx: 6 }, 'dark'),
    s('rect', { x: 32, y: 32, width: 96, height: 58, rx: 2 }, 'sky', { accent: true }),
    s('path', { d: 'M70 100h20l6 14H64z' }, 'gray'),
    s('rect', { x: 28, y: 118, width: 104, height: 20, rx: 4 }, 'gray'),
    s('path', { d: grid(34, 122, 8, 2, 8, 4, 12, 7) }, 'dark'),
    s('path', { d: 'M42 46h40M42 58h28', ...SW(5) }, 'white', { stroke: true })
  ],
  'confección': [
    s('path', { d: 'M50 34l-30 20 12 22 14-8v66h68V68l14 8 12-22-30-20q-10 12-30 12t-30-12z' }, 'pink', { accent: true }),
    s('path', { d: 'M46 90h68M80 46v86', ...DASH(3, '5 5') }, 'dark', { stroke: true }),
    s('path', { d: 'M104 54l30-34', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M132 22q-30 10-40 40', ...SW(2) }, 'red', { stroke: true }),
    s('path', { d: ells([[40, 136, 12, 6], [66, 136, 12, 6]]) }, 'dark'),
    s('path', { d: 'M48 132l40-24M58 132l38-22', ...SW(3) }, 'dark', { stroke: true })
  ],
  contratista: [
    ground(),
    ...person(52, 136, 'orange', { accent: true }),
    s('path', { d: 'M36 78a16 16 0 0 1 32 0z' }, 'yellow'),
    s('path', { d: 'M32 76h40', ...SW(5) }, 'yellow', { stroke: true }),
    ...paper(90, 54, 46, 62),
    s('path', { d: 'M98 68h30M98 80h30M98 92h18', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M98 106q6-8 10 0t10 0t10-4', ...SW(3) }, 'blue', { stroke: true })
  ],
  convoy: [
    s('path', { d: 'M10 128h140', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: rects([[12, 80, 32, 34], [58, 80, 32, 34], [104, 80, 32, 34]]) }, 'green', { accent: true }),
    s('path', { d: rects([[44, 92, 10, 22], [90, 92, 10, 22], [136, 92, 10, 22]]) }, 'dark'),
    s('path', { d: dots([[22, 118], [44, 118], [68, 118], [90, 118], [114, 118], [136, 118]], 7) }, 'dark'),
    s('path', { d: rects([[46, 95, 6, 8], [92, 95, 6, 8], [138, 95, 6, 8]]) }, 'sky'),
    s('path', { d: 'M14 64h18M60 64h18M106 64h18', ...SW(4) }, 'gray', { stroke: true })
  ],
  cupo: [
    s('path', { d: grid(22, 28, 3, 2, 32, 46, 42, 58) }, 'sky'),
    s('path', { d: dots([[38, 48], [80, 48], [122, 48], [38, 106], [80, 106]], 9) }, 'skin'),
    s('path', { d: busts([38, 80, 122], 74, 24, 16) + busts([38, 80], 132, 24, 16) }, 'navy'),
    s('rect', { x: 106, y: 86, width: 32, height: 46 }, 'green', { accent: true }),
    s('path', { d: 'M112 110l7 8 13-16', ...SW(5) }, 'white', { stroke: true })
  ],
  danzar: [
    ground(),
    s('path', { d: 'M36 128q44 18 88 0', ...SW(4) }, 'purple', { stroke: true }),
    s('path', { d: 'M74 88l-22-30M86 88l22-30', ...SW(5) }, 'skin', { stroke: true }),
    ...lady(80, 136, 'pink', { accent: true }),
    ...note(126, 56, 'purple'),
    ...note(28, 70, 'blue')
  ],
  derrocar: [
    ground(),
    s('rect', { x: 26, y: 96, width: 46, height: 40 }, 'gray'),
    s('rect', { x: 84, y: 104, width: 50, height: 32, rx: 2, transform: 'rotate(18 108 120)' }, 'gray'),
    s('path', { d: 'M86 52l6-22 12 12 10-16 10 16 12-12 6 22z', transform: 'rotate(40 110 40)' }, 'yellow', { accent: true }),
    arrow('M40 80q10-50 52-56', 'red', 5),
    s('path', { d: 'M88 16l14 8-14 8z' }, 'red'),
    s('path', { d: 'M120 70l8 8M134 64l6 4', ...SW(3) }, 'dark', { stroke: true })
  ],
  desenlace: [
    backdrop('dark'),
    s('path', { d: 'M14 128h132v6a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'brown'),
    s('path', { d: 'M14 26h64q-8 52 0 102H14zM146 26H82q8 52 0 102h64z' }, 'red', { accent: true }),
    s('path', { d: 'M34 34v94M56 34v94M104 34v94M126 34v94', ...SW(3) }, 'pink', { stroke: true }),
    s('path', { d: 'M14 14h132v16q-11 10-22 0t-22 0-22 0-22 0-22 0-22 0z' }, 'yellow')
  ],
  'desnutrición': [
    ground(),
    ...person(54, 136, 'orange', { w: 16, h: 48, r: 11 }),
    s('path', { d: 'M49 82q5-4 10 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M88 104h52q0 26-26 26t-26-26z' }, 'white'),
    s('path', { d: 'M88 104h52q0 26-26 26t-26-26z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M132 98l10-24', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: drop(66, 74, 4) }, 'sky', { accent: true })
  ],
  dificultar: [
    ground(),
    ...person(34, 136, 'blue', { accent: true }),
    s('path', { d: 'M82 106v30M128 106v30', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 70, y: 88, width: 70, height: 18, rx: 3 }, 'white'),
    s('path', { d: 'M80 88l-8 18h10l8-18zM100 88l-8 18h10l8-18zM120 88l-8 18h10l8-18z' }, 'red'),
    s('rect', { x: 70, y: 88, width: 70, height: 18, rx: 3, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 56l8-10M56 64l10-6', ...SW(3) }, 'orange', { stroke: true })
  ],
  diferir: [
    s('rect', { x: 18, y: 56, width: 54, height: 64, rx: 4 }, 'white'),
    s('rect', { x: 88, y: 56, width: 54, height: 64, rx: 4 }, 'white'),
    s('path', { d: 'M18 56h54v14H18zM88 56h54v14H88z' }, 'red'),
    s('rect', { x: 88, y: 56, width: 54, height: 14 }, 'blue', { accent: true }),
    s('path', { d: rects([[18, 56, 54, 64], [88, 56, 54, 64]]), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[30, 84], [44, 84], [58, 84], [30, 102], [44, 102], [100, 84], [114, 84], [128, 84], [100, 102], [114, 102]], 3.5) }, 'gray'),
    s('path', { d: dots([[58, 102], [128, 102]], 6) }, 'orange'),
    arrow('M44 44q36-34 72 0', 'orange', 5),
    s('path', { d: 'M108 36l12 12-16 2z' }, 'orange')
  ],
  disculpar: [
    ground(),
    ...lean(46, 136, 22, 'blue', { accent: true }),
    ...person(122, 136, 'green'),
    s('path', { d: bubble(70, 22, 50, 40) }, 'white'),
    s('path', { d: bubble(70, 22, 50, 40), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: heart(95, 34, 12) }, 'pink'),
    s('rect', { x: 86, y: 36, width: 18, height: 7, rx: 2, transform: 'rotate(-30 95 40)' }, 'tan')
  ],
  doblaje: [
    s('rect', { x: 14, y: 16, width: 132, height: 70, rx: 6 }, 'dark'),
    s('path', { d: busts([80], 86, 44, 26) }, 'blue'),
    s('circle', { cx: 80, cy: 46, r: 14 }, 'skin'),
    s('ellipse', { cx: 80, cy: 52, rx: 4, ry: 3 }, 'dark'),
    s('path', { d: 'M80 128v14M64 142h32', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 70, y: 96, width: 20, height: 34, rx: 10 }, 'gray', { accent: true }),
    s('path', { d: 'M102 100q8 12 0 24M58 100q-8 12 0 24M114 94q14 18 0 36M46 94q-14 18 0 36', ...SW(4) }, 'orange', { stroke: true })
  ],
  empeorar: [
    s('path', { d: 'M24 22v114h118', ...SW(4) }, 'dark', { stroke: true }),
    arrow('M34 54l26 18 22-10 34 50', 'red', 7),
    s('path', { d: 'M104 116l18 10-2-22z' }, 'red', { accent: true }),
    s('path', { d: ells([[110, 34, 18, 12], [126, 30, 14, 12], [96, 38, 12, 9]]) }, 'gray'),
    s('path', { d: 'M100 54l-4 8M114 54l-4 8M128 52l-4 8', ...SW(3) }, 'blue', { stroke: true })
  ],
  enterrar: [
    backdrop('sky', 14, 70),
    s('path', { d: 'M14 78h132v56a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'brown'),
    s('path', { d: 'M86 80q24-28 48 0z' }, 'brown'),
    s('rect', { x: 40, y: 104, width: 46, height: 28, rx: 4 }, 'tan', { accent: true }),
    s('path', { d: 'M40 114h46M63 114v8', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M110 66V24M102 24h16', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: 'M100 62h20v14l-10 10-10-10z' }, 'gray')
  ],
  escopeta: [
    s('path', { d: 'M18 74h96M18 84h96', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 66h18l22 28-8 10-30-18z' }, 'brown', { accent: true }),
    s('path', { d: 'M74 88h30l-4 10H78z' }, 'brown'),
    s('path', { d: 'M96 92q2 12 12 8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: ells([[22, 58, 8, 6], [30, 48, 7, 5]]) }, 'gray')
  ],
  espiritualidad: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'cream'),
    s('path', { d: halfRays(80, 54, 22, 34, 7), ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 54, r: 13 }, 'skin'),
    s('ellipse', { cx: 80, cy: 114, rx: 40, ry: 12 }, 'navy'),
    s('path', { d: 'M62 112V86q0-16 18-16t18 16v26z' }, 'purple', { accent: true }),
    s('path', { d: dots([[58, 106], [102, 106]], 6) }, 'skin')
  ],
  'extradición': [
    s('path', { d: 'M96 16v128', ...DASH(4, '8 6') }, 'gray', { stroke: true }),
    ground(),
    ...person(44, 136, 'orange', { accent: true }),
    s('path', { d: ring(38, 104, 6) + ring(52, 104, 6), ...SW(3) }, 'dark', { stroke: true }),
    arrow('M66 62h56', 'red', 6),
    s('path', { d: 'M118 52l16 10-16 10z' }, 'red'),
    s('path', { d: jet(124, 106), transform: 'rotate(60 124 106)' }, 'blue')
  ],
  extraterrestre: [
    s('path', { d: 'M64 34L52 14M96 34l12-20', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots([[52, 14], [108, 14]], 6) }, 'yellow'),
    s('path', { d: 'M80 28c30 0 46 22 44 48-2 30-26 60-44 60s-42-30-44-60c-2-26 14-48 44-48z' }, 'green', { accent: true }),
    s('ellipse', { cx: 62, cy: 78, rx: 14, ry: 8, transform: 'rotate(30 62 78)' }, 'black'),
    s('ellipse', { cx: 98, cy: 78, rx: 14, ry: 8, transform: 'rotate(-30 98 78)' }, 'black'),
    s('path', { d: 'M72 114q8 5 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  extremista: [
    s('rect', { x: 14, y: 106, width: 44, height: 14 }, 'blue'),
    s('rect', { x: 58, y: 106, width: 44, height: 14 }, 'gray'),
    s('rect', { x: 102, y: 106, width: 44, height: 14 }, 'red', { accent: true }),
    ...person(130, 106, 'red', { h: 32, w: 22, r: 10 }),
    s('path', { d: 'M114 52l-22-10v24z' }, 'orange'),
    s('path', { d: 'M86 44l-10-6M84 56h-12M86 66l-10 6', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M18 134h124', ...SW(3) }, 'gray', { stroke: true })
  ],
  fausto: [
    s('path', { d: 'M80 80q8 40 30 58', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: dots([[64, 62], [96, 62], [64, 94], [96, 94]], 18) }, 'green', { accent: true }),
    s('path', { d: 'M80 52v56M52 78h56', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: sparkle(130, 34, 12) + sparkle(30, 30, 9) + sparkle(30, 126, 7) }, 'yellow')
  ],
  fichaje: [
    ...paper(28, 26, 70, 96),
    s('path', { d: 'M40 44h46M40 58h46M40 72h30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 102q8-14 14 0t14 0t12-6', ...SW(3) }, 'blue', { stroke: true }),
    s('rect', { x: 86, y: 52, width: 10, height: 52, rx: 4, transform: 'rotate(35 91 78)' }, 'blue', { accent: true }),
    s('circle', { cx: 122, cy: 120, r: 20 }, 'white'),
    s('path', { d: poly([[122, 110], [131, 116], [128, 126], [116, 126], [113, 116]]) + ring(122, 120, 20) }, 'dark')
  ],
  flojo: [
    ground(),
    s('path', { d: 'M24 56v80M136 56v80', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M24 62q56 70 112 0q-56 46-112 0z' }, 'orange', { accent: true }),
    s('circle', { cx: 52, cy: 82, r: 10 }, 'skin'),
    s('path', { d: 'M62 92q22 12 44 2', ...SW(14) }, 'blue', { stroke: true }),
    s('path', { d: 'M48 80h6', ...SW(2) }, 'dark', { stroke: true })
  ],
  florentino: [
    ground(),
    s('rect', { x: 30, y: 100, width: 100, height: 36 }, 'tan'),
    s('rect', { x: 44, y: 84, width: 72, height: 18 }, 'cream'),
    s('path', { d: 'M46 86q0-54 34-58q34 4 34 58z' }, 'red', { accent: true }),
    s('path', { d: 'M80 30v56M64 40q-6 20-6 46M96 40q6 20 6 46', ...SW(3) }, 'white', { stroke: true }),
    s('rect', { x: 73, y: 14, width: 14, height: 16, rx: 2 }, 'cream'),
    s('path', { d: rects([[73, 14, 14, 16], [44, 84, 72, 18]]) + grid(40, 110, 5, 1, 8, 16, 18, 0), ...SW(2) }, 'gray', { stroke: true })
  ],
  'gestación': [
    ground(),
    s('circle', { cx: 68, cy: 42, r: 13 }, 'skin'),
    s('path', { d: 'M56 58h24q4 12 2 20q28 8 28 30q0 20-24 22l2 6H52z' }, 'pink', { accent: true }),
    s('path', { d: 'M64 66q-6 30 26 40', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(118, 50, 11) }, 'red')
  ],
  'guardería': [
    ground(140),
    s('rect', { x: 30, y: 62, width: 100, height: 78 }, 'yellow'),
    s('path', { d: poly([[20, 66], [80, 24], [140, 66]]) }, 'red', { accent: true }),
    s('path', { d: 'M68 140v-28a12 12 0 0 1 24 0v28z' }, 'blue'),
    s('path', { d: dots([[54, 86], [106, 86]], 9) }, 'sky'),
    s('path', { d: busts([32, 128], 140, 18, 22) }, 'green'),
    s('path', { d: dots([[32, 112], [128, 112]], 8) }, 'skin')
  ],
  guitarrista: [
    ground(),
    ...person(66, 136, 'blue'),
    s('path', { d: ells([[62, 116, 18, 14], [80, 104, 13, 11]]), transform: 'rotate(-30 70 110)' }, 'orange', { accent: true }),
    s('circle', { cx: 70, cy: 110, r: 5 }, 'dark'),
    s('path', { d: 'M82 100l38-34', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M118 68l10-9', ...SW(8) }, 'dark', { stroke: true }),
    ...note(128, 104, 'purple')
  ],
  iguala: [
    s('path', { d: 'M14 66h132', ...DASH(4, '8 6') }, 'dark', { stroke: true }),
    s('path', { d: rects([[20, 74, 32, 62], [64, 74, 32, 62], [108, 74, 32, 62]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M20 88h32M20 102h32M20 116h32M64 88h32M64 102h32M64 116h32M108 88h32M108 102h32M108 116h32', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M30 36h20M30 46h20M110 36h20M110 46h20', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: ring(80, 40, 14), ...SW(4) }, 'gray', { stroke: true })
  ],
  implantar: [
    arrow('M80 18v24', 'orange', 6),
    s('path', { d: 'M70 36l10 12 10-12z' }, 'orange'),
    s('rect', { x: 64, y: 56, width: 32, height: 40, rx: 4 }, 'green', { accent: true }),
    s('path', { d: 'M56 64h8M56 74h8M56 84h8M96 64h8M96 74h8M96 84h8', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 90q66-12 132 0v46H14z' }, 'skin'),
    s('rect', { x: 64, y: 90, width: 32, height: 24, rx: 4, ...DASH(3, '4 4') }, 'green', { stroke: true }),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'tan', { stroke: true })
  ],
  inconstitucional: [
    s('rect', { x: 108, y: 30, width: 16, height: 104, rx: 2 }, 'cream'),
    s('rect', { x: 34, y: 24, width: 80, height: 112, rx: 4 }, 'navy', { accent: true }),
    s('path', { d: 'M74 46v34M56 50h36', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M48 64q8 10 16 0zM84 64q8 10 16 0z' }, 'yellow'),
    s('path', { d: 'M24 128l32-30 10 10 38-38 10 10 22-22', ...SW(7) }, 'red', { stroke: true })
  ],
  innegable: [
    ...paper(22, 26, 80, 104),
    s('path', { d: 'M40 92q16-30 32 0M34 92q22-42 44 0M46 92q10-18 20 0M56 92q0-8 0 0', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 92, cy: 94, r: 22 }, 'sky'),
    s('path', { d: ring(92, 94, 22) + 'M108 110l22 22', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 124, cy: 40, r: 18 }, 'green', { accent: true }),
    s('path', { d: 'M115 40l7 7 12-13', ...SW(5) }, 'white', { stroke: true })
  ],
  internamente: [
    ground(),
    ...person(80, 136, 'sky', { w: 48, h: 62, r: 13 }),
    s('path', { d: heart(80, 100, 15) }, 'red', { accent: true }),
    arrow('M20 100h22M140 100h-22', 'orange', 5),
    s('path', { d: 'M38 92l10 8-10 8zM122 92l-10 8 10 8z' }, 'orange')
  ],
  linterna: [
    s('path', { d: poly([[62, 70], [146, 30], [146, 130], [62, 90]]) }, 'yellow'),
    s('rect', { x: 14, y: 68, width: 40, height: 24, rx: 4 }, 'dark'),
    s('path', { d: 'M50 62h14v36H50z' }, 'gray', { accent: true }),
    s('rect', { x: 26, y: 62, width: 10, height: 6, rx: 2 }, 'red'),
    s('path', { d: 'M18 74h30', ...SW(2) }, 'gray', { stroke: true })
  ],
  'magnético': [
    s('path', { d: 'M54 24q26-10 52 0M46 18q34-10 68 0', ...DASH(3, '5 5') }, 'gray', { stroke: true }),
    s('path', { d: 'M38 36h24v44a18 18 0 0 0 36 0V36h24v44a42 42 0 0 1-84 0z' }, 'red', { accent: true }),
    s('path', { d: rects([[38, 26, 24, 14], [98, 26, 24, 14]]) }, 'gray'),
    s('path', { d: 'M136 70l-8-4M140 84h-10M136 98l-8 4M24 70l8-4M20 84h10M24 98l8 4', ...SW(3) }, 'orange', { stroke: true })
  ],
  'marroquí': [
    s('ellipse', { cx: 80, cy: 128, rx: 60, ry: 10 }, 'gray'),
    s('path', { d: 'M22 112h116q-6 22-58 22t-58-22z' }, 'orange', { accent: true }),
    s('path', { d: 'M34 114q34-8 42-78h8q8 70 42 78z' }, 'red'),
    s('path', { d: 'M48 104q32 10 64 0M60 84q20 6 40 0', ...SW(3) }, 'cream', { stroke: true }),
    s('circle', { cx: 80, cy: 34, r: 7 }, 'yellow')
  ],
  navaja: [
    s('path', { d: 'M92 100l36-60q8 12 2 26l-28 40z' }, 'gray'),
    s('path', { d: 'M96 98l32-56', ...SW(2) }, 'white', { stroke: true }),
    s('rect', { x: 20, y: 96, width: 90, height: 24, rx: 12 }, 'red', { accent: true }),
    s('path', { d: dots([[34, 108], [98, 108]], 4) }, 'white'),
    s('path', { d: 'M52 108h28', ...SW(3) }, 'pink', { stroke: true })
  ],
  oficialista: [
    ground(),
    s('path', { d: poly([[72, 50], [110, 24], [148, 50]]) }, 'navy'),
    s('path', { d: rects([[78, 52, 8, 74], [96, 52, 8, 74], [116, 52, 8, 74], [134, 52, 8, 74], [74, 126, 70, 10]]) }, 'gray'),
    ...person(36, 136, 'blue', { accent: true }),
    s('path', { d: 'M48 98l12-26', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 60, cy: 70, r: 7 }, 'skin'),
    s('path', { d: 'M60 64v-10', ...SW(5) }, 'skin', { stroke: true })
  ],
  patronal: [
    s('path', { d: 'M14 28q66 26 132 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: poly([[24, 32], [34, 33], [28, 46]]) + poly([[64, 40], [76, 40], [70, 54]]) + poly([[104, 38], [116, 37], [110, 51]]) }, 'red'),
    s('path', { d: poly([[44, 36], [56, 38], [50, 51]]) + poly([[84, 40], [96, 39], [90, 53]]) + poly([[124, 34], [136, 32], [130, 46]]) }, 'yellow'),
    s('rect', { x: 58, y: 76, width: 44, height: 60 }, 'tan'),
    s('path', { d: poly([[54, 78], [80, 52], [106, 78]]) }, 'red', { accent: true }),
    s('path', { d: 'M72 100a8 8 0 0 1 16 0v14H72z' }, 'yellow'),
    s('path', { d: sparkle(32, 92, 12) + sparkle(130, 96, 10) }, 'purple'),
    ground()
  ],
  porcelana: [
    s('path', { d: 'M64 24h32v12q20 14 20 50t-18 50H62q-18-14-18-50t20-50z' }, 'white'),
    s('path', { d: 'M64 24h32v12q20 14 20 50t-18 50H62q-18-14-18-50t20-50z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M64 36h32M50 112h60', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M54 78q13-12 26 0t26 0', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: dots([[80, 94], [70, 94], [90, 94], [80, 86], [80, 102]], 4.5) }, 'blue', { accent: true })
  ],
  potasio: [
    s('rect', { x: 22, y: 20, width: 76, height: 76, rx: 6 }, 'mint'),
    s('rect', { x: 22, y: 20, width: 76, height: 76, rx: 6, ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: ells([[60, 58, 28, 10]]) + ells([[60, 58, 10, 28]]), ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 60, cy: 58, r: 6 }, 'purple'),
    s('path', { d: 'M44 118q50 22 94-42q6 4 2 14q-32 52-96 38z' }, 'yellow', { accent: true }),
    s('path', { d: 'M136 76l4-6', ...SW(5) }, 'brown', { stroke: true })
  ],
  'profecía': [
    s('path', { d: 'M50 132h60l-8-16H58z' }, 'brown'),
    s('circle', { cx: 80, cy: 72, r: 44 }, 'purple', { accent: true }),
    s('path', { d: 'M54 56q8-16 26-18', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: sparkle(92, 78, 12) + sparkle(68, 94, 7) + sparkle(104, 54, 6) }, 'yellow'),
    s('path', { d: sparkle(28, 28, 8) + sparkle(134, 30, 8) }, 'sky')
  ],
  quemadura: [
    s('path', { d: 'M14 96q60-14 104-6l28 2v30l-28 2q-44 6-104-6z' }, 'skin'),
    s('ellipse', { cx: 72, cy: 104, rx: 26, ry: 13 }, 'pink'),
    s('ellipse', { cx: 72, cy: 104, rx: 16, ry: 8 }, 'red', { accent: true }),
    s('path', { d: 'M110 70q-16-14-4-34q4 12 12 14q-2-12 6-22q10 18 4 34q-6 10-18 8z' }, 'orange'),
    s('path', { d: 'M114 66q-6-10 2-18q4 8 8 8q2 8-2 10z' }, 'yellow'),
    s('path', { d: 'M56 80q-4-8 0-14t0-14M74 78q-4-8 0-14t0-14', ...SW(3) }, 'red', { stroke: true })
  ],
  'rebeldía': [
    ground(),
    ...person(62, 136, 'purple', { accent: true }),
    s('path', { d: 'M48 74l4-14 6 8 4-12 6 10 6-10 2 14z' }, 'dark'),
    s('path', { d: 'M48 100l28 12M76 100l-28 12', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M56 84l12-2', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: ring(116, 54, 11) + ring(122, 108, 11) + 'M116 66v6M122 96v-6', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: burst(119, 82, 14, 6, 7) }, 'yellow')
  ],
  recibo: [
    s('path', { d: 'M44 18h64v116l-8-6-8 6-8-6-8 6-8-6-8 6-8-6-8 6z' }, 'white'),
    s('path', { d: 'M44 18h64v116l-8-6-8 6-8-6-8 6-8-6-8 6-8-6-8 6z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M54 36h44M54 50h30M54 64h40M54 78h24', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M54 104h44', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 120, cy: 118, r: 18 }, 'yellow', { accent: true }),
    s('circle', { cx: 120, cy: 118, r: 11, ...SW(3) }, 'orange', { stroke: true })
  ],
  reliquia: [
    s('path', { d: rays(80, 76, 46, 62, 12, 15), ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 82, r: 42 }, 'cream'),
    s('rect', { x: 46, y: 116, width: 68, height: 18, rx: 2 }, 'gray'),
    s('path', { d: 'M54 116V82h52v34z' }, 'yellow', { accent: true }),
    s('path', { d: poly([[48, 84], [80, 54], [112, 84]]) }, 'orange'),
    s('path', { d: drop(80, 100, 7) }, 'red'),
    s('path', { d: 'M80 54V42M74 46h12', ...SW(3) }, 'orange', { stroke: true })
  ],
  represalia: [
    s('path', { d: burst(80, 76, 34, 18, 10) }, 'yellow'),
    s('path', { d: ells([[48, 76, 24, 20]]) + 'M40 58a10 10 0 0 1 16 0z' }, 'red', { accent: true }),
    s('rect', { x: 14, y: 64, width: 14, height: 26, rx: 3 }, 'white'),
    s('path', { d: ells([[112, 76, 24, 20]]) }, 'blue'),
    s('rect', { x: 132, y: 64, width: 14, height: 26, rx: 3 }, 'white'),
    s('path', { d: rects([[14, 64, 14, 26], [132, 64, 14, 26]]), ...SW(3) }, 'gray', { stroke: true }),
    arrow('M40 120q40 22 80 0M120 34q-40-22-80 0', 'orange', 4),
    s('path', { d: 'M112 114l12 4-6 10zM48 40l-12-4 6-10z' }, 'orange')
  ],
  respetuoso: [
    ground(),
    ...lean(50, 136, 30, 'green', { accent: true }),
    ...person(116, 136, 'gray'),
    s('path', { d: 'M108 70q8-12 16 0', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M136 96v40M136 96q-6 0-6-6', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: sparkle(84, 40, 8) }, 'yellow')
  ],
  rima: [
    ...paper(28, 22, 104, 116),
    s('path', { d: 'M42 44h58M42 66h50M42 92h62M42 114h46', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: dots([[112, 44], [104, 66]], 7) }, 'red', { accent: true }),
    s('path', { d: dots([[116, 92], [100, 114]], 7) }, 'blue'),
    s('path', { d: 'M126 32q-4-18 12-24', ...SW(3) }, 'purple', { stroke: true })
  ],
  seguidamente: [
    ground(),
    s('rect', { x: 18, y: 76, width: 18, height: 60, rx: 3, transform: 'rotate(60 36 136)' }, 'dark'),
    s('rect', { x: 46, y: 76, width: 18, height: 60, rx: 3, transform: 'rotate(42 64 136)' }, 'dark'),
    s('rect', { x: 74, y: 76, width: 18, height: 60, rx: 3, transform: 'rotate(22 92 136)' }, 'dark'),
    s('rect', { x: 104, y: 76, width: 18, height: 60, rx: 3 }, 'red', { accent: true }),
    s('path', { d: dots([[113, 92], [113, 118]], 4) }, 'white'),
    arrow('M30 44q50-24 96 0', 'orange', 5),
    s('path', { d: 'M120 34l12 14-18 2z' }, 'orange')
  ],
  seriar: [
    arrow('M28 48h96', 'orange', 6),
    s('path', { d: 'M120 38l14 10-14 10z' }, 'orange'),
    s('path', { d: rects([[22, 72, 28, 28], [66, 72, 28, 28], [110, 72, 28, 28]]) }, 'tan', { accent: true }),
    s('path', { d: 'M36 72v10M80 72v10M124 72v10', ...SW(3) }, 'brown', { stroke: true }),
    s('rect', { x: 14, y: 100, width: 132, height: 14, rx: 7 }, 'dark'),
    s('path', { d: dots([[28, 107], [56, 107], [84, 107], [112, 107], [132, 107]], 3) }, 'gray'),
    s('path', { d: 'M30 114v24M130 114v24', ...SW(5) }, 'gray', { stroke: true })
  ],
  'sumisión': [
    ground(),
    s('path', { d: 'M100 136V28', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M102 30h38l-8 14 8 14h-38z' }, 'white'),
    s('path', { d: 'M102 30h38l-8 14 8 14h-38z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 136v-34q0-12 16-12t16 12v34z' }, 'blue', { accent: true }),
    s('circle', { cx: 50, cy: 80, r: 12 }, 'skin'),
    s('path', { d: 'M64 104l34-24', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M30 136h50', ...SW(10) }, 'navy', { stroke: true })
  ],
  supervisar: [
    s('rect', { x: 14, y: 72, width: 46, height: 64 }, 'gray'),
    ...person(37, 72, 'navy', { h: 30, w: 22, r: 10, accent: true }),
    s('rect', { x: 46, y: 46, width: 14, height: 18, rx: 2 }, 'tan'),
    s('path', { d: 'M44 34l46 62', ...DASH(3) }, 'orange', { stroke: true }),
    s('path', { d: busts([96, 128], 136, 22, 26) }, 'blue'),
    s('path', { d: dots([[96, 104], [128, 104]], 9) }, 'skin'),
    s('path', { d: 'M86 102a10 10 0 0 1 20 0zM118 102a10 10 0 0 1 20 0z' }, 'yellow'),
    ground()
  ],
  suscribir: [
    s('path', { d: 'M80 20q-26 0-26 30v22l-10 10h72l-10-10V50q0-30-26-30z' }, 'yellow'),
    s('circle', { cx: 80, cy: 88, r: 7 }, 'orange'),
    s('path', { d: 'M42 34q-8 14 0 28M118 34q8 14 0 28', ...SW(4) }, 'orange', { stroke: true }),
    s('rect', { x: 22, y: 106, width: 116, height: 34, rx: 17 }, 'red', { accent: true }),
    s('path', { d: 'M66 123l9 9 18-18', ...SW(6) }, 'white', { stroke: true })
  ],
  'sátira': [
    s('path', { d: 'M46 84L20 42l34 18 26-38 26 38 34-18-26 42z' }, 'purple', { accent: true }),
    s('path', { d: dots([[20, 42], [80, 22], [140, 42]], 7) }, 'yellow'),
    s('circle', { cx: 80, cy: 102, r: 32 }, 'skin'),
    s('path', { d: dots([[68, 96], [92, 96]], 3.5) }, 'dark'),
    s('path', { d: 'M64 110q16 18 32 0z' }, 'dark'),
    s('path', { d: 'M60 86l14 4M100 84l-12 2', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[60, 110], [100, 110]], 5) }, 'pink')
  ],
  'tardío': [
    ground(),
    s('path', { d: 'M18 136h104q14 0 18-26l-6-2q-4 16-14 16H28q-10 0-10 12z' }, 'tan'),
    s('path', { d: 'M132 112l-4-18M138 112l6-16', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: dots([[128, 92], [144, 94]], 4) }, 'dark'),
    s('circle', { cx: 70, cy: 92, r: 32 }, 'orange', { accent: true }),
    s('circle', { cx: 70, cy: 92, r: 24 }, 'white'),
    s('path', { d: 'M70 92V74M70 92l12 8', ...SW(4) }, 'dark', { stroke: true })
  ],
  tenso: [
    ground(),
    ...lean(30, 136, -22, 'blue'),
    ...lean(130, 136, 22, 'red', { accent: true }),
    s('path', { d: 'M28 96h104', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: 'M66 84l6 6-6 6M94 84l-6 6 6 6', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M80 104v24', ...DASH(3, '4 4') }, 'gray', { stroke: true })
  ],
  trasfondo: [
    backdrop('sky'),
    s('path', { d: 'M14 90l30-40 26 26 30-44 46 58z' }, 'gray'),
    s('path', { d: 'M14 104q40-26 80-6t52-4v40a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green'),
    s('circle', { cx: 118, cy: 34, r: 10 }, 'yellow'),
    ...person(60, 146, 'navy', { h: 36, w: 30, r: 13, accent: true }),
    s('path', { d: 'M86 120l30-14', ...DASH(3, '4 4') }, 'white', { stroke: true })
  ],
  'tópico': [
    s('path', { d: bubble(20, 18, 54, 40) + bubble(86, 18, 54, 40) + bubble(52, 78, 54, 40) }, 'white'),
    s('path', { d: bubble(20, 18, 54, 40) + bubble(86, 18, 54, 40) + bubble(52, 78, 54, 40), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: star(47, 37, 10) + star(113, 37, 10) + star(79, 97, 10) }, 'yellow', { accent: true }),
    arrow('M16 120q-6-40 4-54M144 70q6 30-12 52', 'orange', 4)
  ],
  vainilla: [
    s('path', { d: poly([[52, 80], [108, 80], [80, 144]]) }, 'tan'),
    s('path', { d: 'M60 92l34 22M66 108l20 12M100 92l-34 22', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M46 80q-6-40 34-46t34 46z' }, 'cream', { accent: true }),
    s('path', { d: 'M46 80q-6-40 34-46t34 46z', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M110 30q20 40 14 104M120 26q24 40 18 104', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[64, 58], [86, 50], [94, 66]], 2.5) }, 'dark')
  ],
  yerno: [
    ground(),
    ...person(58, 136, 'black', { accent: true }),
    s('path', { d: 'M52 96l6 4-6 4zM64 96l-6 4 6 4z' }, 'red'),
    s('path', { d: 'M58 96v20', ...SW(3) }, 'white', { stroke: true }),
    ...person(112, 136, 'purple', { h: 40, w: 28, r: 12 }),
    s('path', { d: 'M100 72a12 12 0 0 1 24 0', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: heart(86, 46, 10) }, 'pink')
  ],
  'átomo': [
    s('path', { d: ells([[80, 80, 62, 22]]), ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: ells([[80, 80, 62, 22]]), transform: 'rotate(60 80 80)', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: ells([[80, 80, 62, 22]]), transform: 'rotate(-60 80 80)', ...SW(5) }, 'blue', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'red', { accent: true }),
    s('path', { d: dots([[142, 80], [49, 26.3], [49, 133.7]], 6) }, 'orange')
  ],
  adjetivo: [
    s('rect', { x: 16, y: 58, width: 44, height: 44, rx: 6 }, 'gray'),
    arrow('M68 80h20', 'orange', 6),
    s('path', { d: 'M84 70l12 10-12 10z' }, 'orange'),
    s('rect', { x: 102, y: 58, width: 44, height: 44, rx: 6 }, 'red', { accent: true }),
    s('path', { d: dots([[114, 70], [134, 90], [116, 92]], 5) + sparkle(134, 68, 7) }, 'yellow'),
    s('path', { d: sparkle(124, 40, 9) + sparkle(144, 116, 7) + sparkle(104, 120, 6) }, 'yellow')
  ],
  agresividad: [
    s('path', { d: 'M30 40q-8-10 0-20M130 40q8-10 0-20', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 84, r: 50 }, 'red', { accent: true }),
    s('path', { d: 'M48 64l22 10M112 64l-22 10', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[62, 82], [98, 82]], 6) }, 'dark'),
    s('rect', { x: 54, y: 100, width: 52, height: 18, rx: 4 }, 'white'),
    s('path', { d: 'M54 109h52M66 100v18M80 100v18M94 100v18', ...SW(2) }, 'dark', { stroke: true })
  ],
  amablemente: [
    ground(),
    ...person(42, 136, 'green', { accent: true }),
    ...person(122, 136, 'blue', { h: 38 }),
    s('path', { d: 'M52 96l26-8', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M82 88v-18', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: dots([[82, 62], [76, 68], [88, 68], [82, 72]], 5) }, 'pink'),
    s('path', { d: heart(82, 34, 10) }, 'red'),
    s('path', { d: 'M37 82q5 4 10 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  'anotación': [
    ...openBook(80, 40),
    s('path', { d: 'M34 54h36M34 66h36M34 78h28M90 62h36M90 74h28', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 96, y: 22, width: 34, height: 30, rx: 2, transform: 'rotate(8 113 37)' }, 'yellow', { accent: true }),
    s('path', { d: 'M34 90h30', ...SW(6, { opacity: 0.6 }) }, 'orange', { stroke: true }),
    s('path', { d: 'M110 132l28-38', ...SW(7) }, 'orange', { stroke: true }),
    s('path', { d: 'M110 132l-2 8 7-4', ...SW(3) }, 'dark', { stroke: true })
  ],
  aproximar: [
    ground(),
    s('circle', { cx: 50, cy: 100, r: 22 }, 'blue', { accent: true }),
    s('circle', { cx: 112, cy: 100, r: 22 }, 'orange'),
    s('path', { d: 'M18 92h6M14 102h10M18 112h6M142 92h-6M146 102h-10M142 112h-6', ...SW(4) }, 'gray', { stroke: true }),
    arrow('M60 56h16M100 56h-16', 'red', 5),
    s('path', { d: 'M72 48l10 8-10 8zM88 48l-10 8 10 8z' }, 'red')
  ],
  arrestar: [
    s('path', { d: 'M52 34h56v16H52z' }, 'dark'),
    s('path', { d: 'M56 34a12 12 0 0 1 24 0z' }, 'red'),
    s('path', { d: 'M80 34a12 12 0 0 1 24 0z' }, 'blue', { accent: true }),
    s('path', { d: ring(52, 98, 24) + ring(108, 98, 24), ...SW(9) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 86q6-8 12 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 18l6 8M120 18l-6 8', ...SW(3) }, 'orange', { stroke: true })
  ],
  asignar: [
    s('rect', { x: 62, y: 18, width: 36, height: 30, rx: 4 }, 'yellow', { accent: true }),
    s('path', { d: 'M70 28h20M70 38h14', ...SW(3) }, 'brown', { stroke: true }),
    arrow('M70 56L38 86M80 56v30M90 56l32 30', 'orange', 5),
    s('path', { d: busts([30, 80, 130], 140, 26, 30) }, 'blue'),
    s('path', { d: dots([[30, 104], [80, 104], [130, 104]], 10) }, 'skin'),
    s('path', { d: rects([[22, 120, 16, 12], [72, 120, 16, 12], [122, 120, 16, 12]]) }, 'yellow')
  ],
  'astronomía': [
    backdrop('navy'),
    s('circle', { cx: 112, cy: 40, r: 14 }, 'cream'),
    s('path', { d: sparkle(40, 34, 8) + sparkle(76, 26, 6) + sparkle(134, 80, 6) + sparkle(28, 70, 5) }, 'yellow'),
    s('rect', { x: 46, y: 70, width: 64, height: 18, rx: 6, transform: 'rotate(-32 78 79)' }, 'white', { accent: true }),
    s('rect', { x: 94, y: 52, width: 14, height: 24, rx: 3, transform: 'rotate(-32 101 64)' }, 'gray'),
    s('path', { d: 'M74 92l-20 46M74 92l20 46M74 92v46', ...SW(4) }, 'gray', { stroke: true })
  ],
  batido: [
    s('path', { d: 'M90 50l20-36', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M46 58h68l-10 80H56z' }, 'pink', { accent: true }),
    s('path', { d: ells([[60, 56, 14, 10], [80, 50, 16, 12], [100, 56, 14, 10]]) }, 'cream'),
    s('path', { d: ells([[60, 56, 14, 10], [80, 50, 16, 12], [100, 56, 14, 10]]), ...SW(2) }, 'tan', { stroke: true }),
    s('circle', { cx: 80, cy: 36, r: 7 }, 'red'),
    s('path', { d: 'M52 82h56', ...SW(3) }, 'white', { stroke: true })
  ],
  bulto: [
    s('ellipse', { cx: 80, cy: 136, rx: 54, ry: 6 }, 'gray'),
    s('path', { d: 'M40 136q-20-40 6-74q14-14 34-10q20-4 34 10q26 34 6 74z' }, 'tan', { accent: true }),
    s('path', { d: 'M62 52q18 10 36 0', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M70 50l-8-22M90 50l8-22', ...SW(6) }, 'tan', { stroke: true }),
    s('path', { d: 'M54 90q8 16 0 32M104 86q-6 18 4 32', ...SW(3) }, 'brown', { stroke: true })
  ],
  cala: [
    backdrop('sky'),
    s('path', { d: 'M14 120h132v14a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'blue', { accent: true }),
    s('path', { d: 'M14 40l24 8 10 44-8 38H14zM146 50l-22 10-8 40 10 30h20z' }, 'brown'),
    s('path', { d: 'M48 130q32-8 64 0l-4 6H52z' }, 'tan'),
    s('path', { d: 'M72 112h22l-4 6H76z' }, 'red'),
    s('path', { d: 'M83 112V88l12 20z' }, 'white'),
    s('path', { d: leaflet(130, 54, -100, 20, 6) + leaflet(26, 42, -80, 20, 6) }, 'green')
  ],
  casualmente: [
    s('rect', { x: 22, y: 62, width: 50, height: 50, rx: 8, transform: 'rotate(-14 47 87)' }, 'white'),
    s('rect', { x: 22, y: 62, width: 50, height: 50, rx: 8, transform: 'rotate(-14 47 87)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[38, 74], [56, 100], [47, 87]], 5) }, 'dark'),
    s('rect', { x: 86, y: 76, width: 50, height: 50, rx: 8, transform: 'rotate(18 111 101)' }, 'red', { accent: true }),
    s('path', { d: dots([[98, 86], [124, 116], [100, 112], [122, 90]], 5) }, 'white'),
    s('path', { d: 'M60 42l-6-12M80 38V24M100 42l6-12', ...SW(4) }, 'orange', { stroke: true })
  ],
  celta: [
    s('circle', { cx: 80, cy: 82, r: 62 }, 'mint'),
    s('path', { d: 'M80 82q0-30 22-30t16 22q-6 14-18 8M80 82q-26 15-37 -4t17-24q15 1 14 14M80 82q26 15 15 34t-30 2q-7-14 6-20', ...SW(8) }, 'green', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 82, r: 7 }, 'dark'),
    s('circle', { cx: 80, cy: 82, r: 62, ...SW(4) }, 'green', { stroke: true })
  ],
  cerco: [
    s('ellipse', { cx: 80, cy: 112, rx: 64, ry: 24 }, 'green'),
    s('path', { d: 'M80 108V60', ...SW(8) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 50, r: 24 }, 'green', { accent: true }),
    s('path', { d: ells([[80, 104, 62, 22]]), ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M18 104v-16M34 118v-16M54 124v-16M80 126v-16M106 124v-16M126 118v-16M142 104v-16M34 90v-14M54 85v-14M106 85v-14M126 90v-14', ...SW(6) }, 'tan', { stroke: true })
  ],
  chisme: [
    s('path', { d: busts([50, 110], 140, 40, 46) }, 'purple', { accent: true }),
    s('circle', { cx: 50, cy: 76, r: 18 }, 'skin'),
    s('circle', { cx: 110, cy: 76, r: 18 }, 'skin'),
    s('path', { d: 'M66 80h12v-12', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: dots([[86, 40], [100, 34], [114, 38]], 4) }, 'gray'),
    s('path', { d: 'M78 52q6-8 0-16M88 58q12-16 0-30', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M114 78a8 8 0 1 1 6 8', ...SW(3) }, 'tan', { stroke: true })
  ],
  'circunscripción': [
    s('path', { d: 'M24 40l40-16 50 10 22 34-10 50-40 22-46-12-20-40z' }, 'mint'),
    s('path', { d: 'M64 24l-6 52 56-6M58 76l-12 52M58 76l40 54', ...DASH(3, '5 5') }, 'gray', { stroke: true }),
    s('path', { d: 'M58 76l56-6-8 50-8 10z' }, 'orange', { accent: true }),
    s('path', { d: 'M24 40l40-16 50 10 22 34-10 50-40 22-46-12-20-40z', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M90 104q-14-16-14-26a14 14 0 0 1 28 0q0 10-14 26z' }, 'red'),
    s('circle', { cx: 90, cy: 78, r: 5 }, 'white')
  ],
  concurrencia: [
    s('rect', { x: 26, y: 18, width: 108, height: 40, rx: 4 }, 'yellow', { accent: true }),
    s('path', { d: dots([[24, 82], [52, 80], [80, 82], [108, 80], [136, 82]], 10) + dots([[38, 108], [66, 106], [94, 108], [122, 106]], 11) }, 'brown'),
    s('path', { d: busts([24, 52, 80, 108, 136], 100, 22, 14) }, 'blue'),
    s('path', { d: busts([38, 66, 94, 122], 132, 26, 16) + busts([24, 52, 80, 108, 136], 146, 24, 12) }, 'red'),
    s('path', { d: dots([[24, 132], [52, 134], [80, 132], [108, 134], [136, 132]], 10) }, 'dark')
  ],
  contingente: [
    ground(),
    s('path', { d: 'M24 40v54', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M26 40h28l-8 10 8 10H26z' }, 'orange', { accent: true }),
    s('path', { d: busts([46, 80, 114], 104, 24, 26) + busts([46, 80, 114], 136, 24, 26) }, 'green'),
    s('path', { d: dots([[46, 70], [80, 70], [114, 70], [46, 102], [80, 102], [114, 102]], 9) }, 'skin'),
    s('path', { d: 'M36 66a10 10 0 0 1 20 0zM70 66a10 10 0 0 1 20 0zM104 66a10 10 0 0 1 20 0zM36 98a10 10 0 0 1 20 0zM70 98a10 10 0 0 1 20 0zM104 98a10 10 0 0 1 20 0z' }, 'dark')
  ],
  'demolición': [
    ground(),
    s('path', { d: 'M100 14L52 52', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 46, cy: 58, r: 16 }, 'dark', { accent: true }),
    s('path', { d: 'M74 136V60h56v76z' }, 'red'),
    s('path', { d: 'M74 60l14 16-6 14 10 10-18 6z' }, 'white'),
    s('path', { d: grid(96, 72, 2, 3, 10, 12, 18, 20) }, 'sky'),
    s('path', { d: rects([[54, 96, 10, 8], [46, 118, 12, 10], [62, 126, 10, 10]]) }, 'brown')
  ],
  desalojo: [
    ground(),
    s('rect', { x: 20, y: 46, width: 64, height: 90 }, 'tan'),
    s('path', { d: 'M38 136V78h28v58z' }, 'dark'),
    ...person(108, 136, 'blue', { accent: true }),
    s('rect', { x: 120, y: 108, width: 22, height: 20, rx: 3 }, 'brown'),
    arrow('M76 36h50', 'red', 5),
    s('path', { d: 'M122 28l12 8-12 8z' }, 'red')
  ],
  desembarco: [
    backdrop('sky'),
    s('path', { d: 'M14 96h70v38a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'blue'),
    s('path', { d: 'M84 96q20 0 62-10v48a12 12 0 0 1-12 12H72q12-30 12-50z' }, 'tan'),
    s('path', { d: 'M18 86h56l-8 16H26z' }, 'brown', { accent: true }),
    s('path', { d: 'M46 86V44l20 36z' }, 'white'),
    ...person(110, 104, 'green', { h: 30, w: 22, r: 10 }),
    arrow('M74 70q10-14 22-4', 'orange', 4)
  ],
  detrimento: [
    s('ellipse', { cx: 80, cy: 138, rx: 50, ry: 6 }, 'gray'),
    s('path', { d: ells([[78, 86, 50, 38]]) }, 'pink', { accent: true }),
    s('path', { d: 'M46 118v18M66 122v14M92 122v14M110 118v18', ...SW(10) }, 'pink', { stroke: true }),
    s('path', { d: 'M54 54l6-14 12 10z' }, 'pink'),
    s('ellipse', { cx: 132, cy: 86, rx: 10, ry: 12 }, 'red'),
    s('path', { d: 'M86 48l-10 18 12 8-14 18 8 10', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[30, 132], [128, 130]], 7) }, 'yellow')
  ],
  disidente: [
    ground(),
    s('path', { d: busts([24, 50, 76], 136, 22, 40) + busts([37, 63], 112, 20, 34) }, 'blue'),
    s('path', { d: dots([[24, 88], [50, 88], [76, 88], [37, 70], [63, 70]], 10) }, 'skin'),
    ...person(126, 136, 'orange', { accent: true }),
    s('path', { d: 'M96 60v80', ...DASH(3, '5 5') }, 'gray', { stroke: true })
  ],
  eliminatoria: [
    s('path', { d: 'M16 28h24v24H16M16 76h24V52M40 52h24v48M16 100h24v24H16M40 124V100h24M64 76h22', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M16 76h24V52h24v24h22', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M104 54h36v12q0 22-18 24q-18-2-18-24z' }, 'yellow', { accent: true }),
    s('path', { d: 'M104 60h-6q0 14 8 16M140 60h6q0 14-8 16', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M116 90h12v16h-12zM108 106h28v8h-28z' }, 'orange'),
    s('path', { d: 'M16 124h24M16 28h24', ...SW(6) }, 'red', { stroke: true })
  ],
  emotivo: [
    ...face(70, 82, 46, 'yellow', 'smile', { accent: true }),
    s('path', { d: drop(48, 96, 6) + drop(94, 100, 5) }, 'sky'),
    s('path', { d: heart(128, 30, 14) }, 'red'),
    s('path', { d: dots([[42, 96], [98, 96]], 6) }, 'pink')
  ],
  ensenada: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'blue'),
    s('path', { d: 'M14 26a12 12 0 0 1 12-12h108a12 12 0 0 1 12 12v44q-16-30-46-34t-52 14q-24 26-6 58q14 22 42 22l-4 16H26a12 12 0 0 1-12-12z' }, 'tan', { accent: true }),
    s('path', { d: 'M14 26a12 12 0 0 1 12-12h108a12 12 0 0 1 12 12v24q-16-24-46-26t-52 8q-24 14-34 40z' }, 'green'),
    s('path', { d: 'M84 84h22l-4 8H88z' }, 'red'),
    s('path', { d: 'M95 84V64l10 16z' }, 'white'),
    s('path', { d: 'M118 112q8-4 16 0M100 130q8-4 16 0', ...SW(3) }, 'sky', { stroke: true })
  ],
  'filosófico': [
    s('rect', { x: 34, y: 116, width: 64, height: 24, rx: 4 }, 'gray'),
    s('path', { d: 'M48 116V84q0-14 18-14t18 14v32z' }, 'purple', { accent: true }),
    s('circle', { cx: 70, cy: 54, r: 13 }, 'skin'),
    s('path', { d: 'M82 92l-6-20', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M84 116h20v-8', ...SW(8) }, 'navy', { stroke: true }),
    s('path', { d: ells([[124, 36, 20, 16]]) + dots([[100, 58], [92, 66]], 4) }, 'white'),
    s('path', { d: ells([[124, 36, 20, 16]]) + ring(100, 58, 4), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: sparkle(124, 36, 8) }, 'yellow')
  ],
  'fiscalización': [
    s('rect', { x: 26, y: 24, width: 74, height: 108, rx: 6 }, 'tan'),
    s('rect', { x: 34, y: 34, width: 58, height: 90, rx: 2 }, 'white'),
    s('path', { d: 'M42 52l5 5 8-9M42 74l5 5 8-9M42 96l5 5 8-9', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M62 54h22M62 76h22M62 98h22', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 108, cy: 98, r: 22 }, 'sky', { accent: true }),
    s('path', { d: ring(108, 98, 22) + 'M124 114l18 18', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[102, 94], [114, 104]], 6) }, 'yellow')
  ],
  formidable: [
    s('path', { d: burst(80, 82, 64, 50, 16) }, 'yellow'),
    s('rect', { x: 52, y: 72, width: 50, height: 50, rx: 10 }, 'skin', { accent: true }),
    s('path', { d: 'M60 76l6-34q2-8 10-6t6 10l-4 30z' }, 'skin'),
    s('path', { d: 'M102 84h-16M102 98h-16M102 112h-16', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 38, y: 76, width: 16, height: 48, rx: 4 }, 'blue')
  ],
  funar: [
    s('rect', { x: 46, y: 16, width: 68, height: 124, rx: 10 }, 'dark'),
    s('rect', { x: 52, y: 26, width: 56, height: 100, rx: 3 }, 'white'),
    ...person(80, 96, 'gray', { h: 30, w: 26, r: 12 }),
    s('path', { d: 'M14 52l26 10M14 84h28M14 118l26-10M146 52l-26 10M146 84h-28M146 118l-26-10', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: dots([[62, 112], [80, 114], [98, 112]], 5) }, 'red', { accent: true })
  ],
  'fósforo': [
    s('rect', { x: 20, y: 102, width: 72, height: 34, rx: 3 }, 'red'),
    s('rect', { x: 20, y: 102, width: 72, height: 10 }, 'brown'),
    s('path', { d: 'M70 132l50-60', ...SW(5) }, 'tan', { stroke: true }),
    s('circle', { cx: 120, cy: 70, r: 7 }, 'red'),
    s('path', { d: 'M124 64q-20-16-6-42q6 14 14 18q4 14-8 24z' }, 'orange', { accent: true }),
    s('path', { d: 'M124 58q-8-8-2-18q4 6 6 8q0 6-4 10z' }, 'yellow')
  ],
  ilimitado: [
    s('path', { d: 'M80 80c-14-20-30-30-44-30a30 30 0 0 0 0 60c14 0 30-10 44-30s30-30 44-30a30 30 0 0 1 0 60c-14 0-30-10-44-30z', ...SW(14) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: sparkle(80, 30, 10) + sparkle(80, 132, 8) }, 'yellow'),
    s('path', { d: dots([[36, 80], [124, 80]], 6) }, 'sky')
  ],
  limbo: [
    s('circle', { cx: 80, cy: 80, r: 64 }, 'mint'),
    s('path', { d: 'M14 70h22v76H14zM124 70h22v76h-22z' }, 'gray'),
    s('path', { d: ells([[80, 120, 30, 6], [60, 40, 18, 6], [110, 34, 14, 5]]) }, 'white'),
    ...person(80, 112, 'blue', { h: 34, w: 24, r: 11, accent: true }),
    arrow('M44 96h-6M116 96h6', 'orange', 4),
    s('path', { d: 'M42 90l-8 6 8 6zM118 90l8 6-8 6z' }, 'orange')
  ],
  liquidez: [
    s('path', { d: 'M24 34h56v20H44v14H24z' }, 'gray'),
    s('rect', { x: 46, y: 22, width: 16, height: 12, rx: 2 }, 'red'),
    s('path', { d: drop(34, 86, 6) + drop(30, 118, 5) }, 'blue'),
    s('path', { d: 'M28 76v4', ...SW(2) }, 'sky', { stroke: true }),
    s('path', { d: ells([[100, 128, 34, 9], [100, 116, 34, 9], [100, 104, 34, 9]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M66 104v24M134 104v24', ...SW(2) }, 'orange', { stroke: true }),
    s('ellipse', { cx: 100, cy: 104, rx: 28, ry: 6 }, 'sky')
  ],
  mayoritario: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'gray'),
    s('path', { d: wedge(80, 80, 60, -90, 160) }, 'blue', { accent: true }),
    s('path', { d: ring(80, 80, 60), ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M80 80V20M80 80L23.6 100.5', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: dots([[100, 70], [110, 92], [90, 100]], 6) }, 'white')
  ],
  mirador: [
    backdrop('sky'),
    s('path', { d: 'M14 120q30-30 60-10t72-14v34a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'green'),
    s('path', { d: 'M14 70h52v76H26a12 12 0 0 1-12-12z' }, 'brown'),
    s('path', { d: 'M14 58h52M14 70h52M24 58v12M40 58v12M56 58v12', ...SW(3) }, 'dark', { stroke: true }),
    ...person(40, 70, 'red', { h: 26, w: 20, r: 9, accent: true }),
    s('path', { d: 'M46 32h10', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 112, cy: 40, r: 12 }, 'yellow')
  ],
  mudanza: [
    ground(),
    s('path', { d: rects([[18, 96, 40, 40], [58, 96, 40, 40], [36, 58, 40, 38]]) }, 'tan', { accent: true }),
    s('path', { d: 'M38 96v14M78 96v14M56 58v12M18 96h80M36 96h40', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 104, y: 84, width: 40, height: 40, rx: 4 }, 'blue'),
    s('path', { d: dots([[114, 128], [134, 128]], 7) }, 'dark'),
    arrow('M86 50h40', 'orange', 5),
    s('path', { d: 'M122 42l12 8-12 8z' }, 'orange')
  ],
  mula: [
    ground(),
    ...horse('gray', 'dark'),
    s('path', { d: 'M122 40l-2-24 8 20M132 40l6-22 2 22' }, 'gray'),
    s('path', { d: 'M54 60h44v34H54z' }, 'orange', { accent: true }),
    s('path', { d: 'M62 60v34M90 60v34', ...SW(3) }, 'brown', { stroke: true })
  ],
  mundialmente: [
    s('circle', { cx: 80, cy: 80, r: 44 }, 'blue', { accent: true }),
    s('path', { d: 'M60 52q14-6 20 6t-6 18q-14 4-18-8t4-16zM92 88q14-4 18 8t-8 18q-12 2-14-10t4-16zM96 48q10 0 12 8l-10 4z' }, 'green'),
    s('path', { d: ring(80, 80, 44), ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: star(80, 20, 9) + star(140, 80, 9) + star(80, 140, 9) + star(20, 80, 9) + star(122, 38, 7) + star(38, 122, 7) + star(122, 122, 7) + star(38, 38, 7) }, 'yellow')
  ],
  'nicaragüense': [
    backdrop('sky'),
    s('path', { d: 'M24 110l40-62h20l40 62z' }, 'brown', { accent: true }),
    s('path', { d: 'M64 48l6 10 6-6 8 6v-10z' }, 'dark'),
    s('path', { d: ells([[74, 30, 10, 7], [88, 22, 12, 8]]) }, 'gray'),
    s('path', { d: 'M14 106h132v28a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'blue'),
    s('path', { d: 'M30 122q8-4 16 0M90 126q8-4 16 0M110 114q8-4 16 0', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M126 106q2-30 10-40', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(136, 66, 200, 18, 5) + leaflet(136, 66, -30, 18, 5) + leaflet(136, 66, -100, 16, 5) }, 'green')
  ],
  ocular: [
    s('rect', { x: 40, y: 128, width: 80, height: 12, rx: 4 }, 'dark'),
    s('path', { d: 'M100 128q20-30 0-70', ...SW(10) }, 'gray', { stroke: true }),
    s('rect', { x: 50, y: 98, width: 50, height: 8, rx: 2 }, 'dark'),
    s('rect', { x: 60, y: 44, width: 22, height: 50, rx: 4, transform: 'rotate(-20 71 69)' }, 'white'),
    s('rect', { x: 60, y: 44, width: 22, height: 50, rx: 4, transform: 'rotate(-20 71 69)', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 52, y: 20, width: 22, height: 26, rx: 4, transform: 'rotate(-20 63 33)' }, 'blue', { accent: true }),
    s('path', { d: ells([[30, 30, 12, 7]]) }, 'white'),
    s('path', { d: ells([[30, 30, 12, 7]]), ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 32, cy: 30, r: 4 }, 'dark')
  ],
  ofrenda: [
    s('rect', { x: 20, y: 96, width: 120, height: 16, rx: 3 }, 'brown'),
    s('path', { d: 'M28 112v28M132 112v28', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M56 96q0-18 24-18t24 18z' }, 'white'),
    s('path', { d: dots([[66, 74], [80, 70], [94, 74]], 9) }, 'orange', { accent: true }),
    s('path', { d: rects([[30, 66, 10, 30], [120, 66, 10, 30]]) }, 'cream'),
    s('path', { d: drop(35, 58, 4) + drop(125, 58, 4) }, 'orange'),
    s('path', { d: dots([[46, 88], [114, 88]], 7) }, 'pink'),
    s('path', { d: 'M56 96q0-18 24-18t24 18z', ...SW(2) }, 'gray', { stroke: true })
  ],
  patrimonial: [
    ground(),
    s('path', { d: 'M18 56h124v80h-16v-42a14 14 0 0 0-28 0v42h-16v-42a14 14 0 0 0-28 0v42H38v-42a14 14 0 0 0-28 0' }, 'tan', { accent: true }),
    s('rect', { x: 14, y: 48, width: 132, height: 10 }, 'brown'),
    s('path', { d: 'M18 72h116', ...DASH(2, '4 8') }, 'brown', { stroke: true }),
    s('path', { d: star(80, 28, 13) }, 'yellow')
  ],
  patrocinador: [
    ground(),
    ...person(40, 136, 'navy'),
    s('path', { d: 'M62 82q-8-12 0-16h12q8 4 0 16q14 10 10 30-4 14-17 14t-17-14q-4-20 12-30z' }, 'yellow', { accent: true }),
    s('path', { d: 'M62 82h12', ...SW(3) }, 'brown', { stroke: true }),
    ...person(118, 136, 'red'),
    s('path', { d: star(118, 112, 8) }, 'white'),
    arrow('M86 64q14-14 24-4', 'green', 4)
  ],
  'piratería': [
    s('circle', { cx: 80, cy: 92, r: 38 }, 'skin'),
    s('path', { d: 'M28 70q2-40 52-44t52 44q-24-10-52-10t-52 10z' }, 'black', { accent: true }),
    s('path', { d: dots([[62, 46]], 7) }, 'white'),
    s('path', { d: 'M48 76l64 22', ...SW(3) }, 'black', { stroke: true }),
    s('ellipse', { cx: 94, cy: 90, rx: 11, ry: 9 }, 'black'),
    s('circle', { cx: 64, cy: 90, r: 4 }, 'dark'),
    s('path', { d: 'M66 112q14 8 28 0', ...SW(4) }, 'dark', { stroke: true })
  ],
  platino: [
    s('path', { d: poly([[30, 118], [130, 118], [114, 70], [46, 70]]) }, 'gray', { accent: true }),
    s('path', { d: poly([[46, 70], [114, 70], [106, 58], [54, 58]]) }, 'white'),
    s('path', { d: poly([[30, 118], [130, 118], [114, 70], [46, 70]]) + poly([[46, 70], [114, 70], [106, 58], [54, 58]]), ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 84l-8 24', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: sparkle(124, 40, 12) + sparkle(36, 44, 8) + sparkle(84, 34, 6) }, 'sky')
  ],
  pronunciamiento: [
    ground(),
    ...person(58, 136, 'green', { accent: true }),
    s('path', { d: 'M42 74h32l-2-10H44z' }, 'dark'),
    s('path', { d: 'M70 92l18-6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M84 84l26-12v28l-26-10z' }, 'gray'),
    s('path', { d: 'M118 72l14-8M120 86h16M118 100l14 8', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: star(58, 108, 7) }, 'yellow')
  ],
  prudencia: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[78, 112, 12, 24], [100, 112, 12, 24], [122, 112, 12, 24]]) }, 'gray'),
    ...person(40, 136, 'blue', { accent: true }),
    s('path', { d: 'M28 66q-6-2-8 2M52 66q6-2 8 2', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 110, y: 22, width: 24, height: 56, rx: 6 }, 'dark'),
    s('circle', { cx: 122, cy: 36, r: 8 }, 'red'),
    s('circle', { cx: 122, cy: 64, r: 8 }, 'gray'),
    s('path', { d: 'M122 78v34', ...SW(4) }, 'dark', { stroke: true })
  ],
  'puertorriqueño': [
    backdrop('sky'),
    s('path', { d: 'M14 104h132v30a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'blue'),
    s('path', { d: ells([[80, 106, 52, 12]]) }, 'tan', { accent: true }),
    s('path', { d: 'M74 100q2-36 14-54', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: leaflet(88, 46, 200, 28, 7) + leaflet(88, 46, -20, 28, 7) + leaflet(88, 46, -110, 22, 6) + leaflet(88, 46, 150, 22, 6) }, 'green'),
    s('circle', { cx: 36, cy: 40, r: 12 }, 'yellow'),
    s('path', { d: 'M30 126q8-4 16 0M106 128q8-4 16 0', ...SW(3) }, 'white', { stroke: true })
  ],
  rebaja: [
    s('path', { d: 'M22 70l40-40h52v52l-40 40z' }, 'yellow', { accent: true }),
    s('circle', { cx: 98, cy: 46, r: 7 }, 'white'),
    s('path', { d: 'M22 70l40-40h52v52l-40 40z', ...SW(3) }, 'orange', { stroke: true }),
    arrow('M124 92v38', 'red', 7),
    s('path', { d: 'M112 124l12 16 12-16z' }, 'red'),
    s('path', { d: 'M54 64l24 24', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: dots([[54, 76], [76, 64]], 5) }, 'red')
  ],
  regente: [
    ground(),
    s('path', { d: 'M76 136V50h44v86z' }, 'red'),
    s('rect', { x: 72, y: 96, width: 52, height: 12 }, 'brown'),
    ...person(98, 96, 'blue', { h: 22, w: 20, r: 10 }),
    s('path', { d: 'M90 60l2-10 6 5 6-5 2 10z' }, 'yellow'),
    ...person(42, 136, 'purple', { accent: true }),
    s('path', { d: 'M58 116V56', ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 58, cy: 52, r: 6 }, 'yellow')
  ],
  repetidamente: [
    s('path', { d: 'M40 70a40 40 0 0 1 72-14M120 90a40 40 0 0 1-72 14', ...SW(9) }, 'blue', { stroke: true }),
    s('path', { d: 'M100 44l18 18 6-24zM60 116l-18-18-6 24z' }, 'blue', { accent: true }),
    s('path', { d: dots([[64, 80], [80, 80], [96, 80]], 6) }, 'orange')
  ],
  resaca: [
    ground(),
    ...person(62, 136, 'sky', { accent: true }),
    s('path', { d: spiral(50, 72) + spiral(66, 72), ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M42 92l8-18M82 92l-8-18', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M40 44l6 6M62 36v8M84 44l-6 6', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M108 136l6-30h12l6 30z', transform: 'rotate(70 120 130)' }, 'green'),
    s('path', { d: ells([[116, 52, 12, 8]]) }, 'blue')
  ],
  revocar: [
    s('path', { d: 'M28 30h38l-6 18 8 16-6 18 8 16-6 18 4 14H28z' }, 'white'),
    s('path', { d: 'M78 36h48v94H84l6-14-8-16 6-18-8-16 6-18z' }, 'white'),
    s('path', { d: 'M28 30h38l-6 18 8 16-6 18 8 16-6 18 4 14H28zM78 36h48v94H84l6-14-8-16 6-18-8-16 6-18z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 48h20M36 60h16M92 54h24M94 66h22', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 104, cy: 108, r: 14 }, 'red', { accent: true }),
    arrow('M134 30q14 20-4 34', 'orange', 4)
  ],
  sobresaliente: [
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[22, 96, 22, 40], [50, 86, 22, 50], [112, 92, 22, 44]]) }, 'sky'),
    s('rect', { x: 80, y: 50, width: 24, height: 86 }, 'yellow', { accent: true }),
    s('path', { d: star(92, 32, 16) }, 'orange'),
    s('path', { d: sparkle(126, 52, 8) + sparkle(56, 52, 6) }, 'yellow')
  ],
  solista: [
    s('path', { d: poly([[66, 14], [94, 14], [128, 136], [32, 136]]) }, 'cream'),
    ground(),
    ...person(80, 136, 'purple', { accent: true }),
    s('path', { d: 'M92 100l8-24', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 100, cy: 74, r: 6 }, 'dark'),
    ...note(128, 70, 'orange'),
    ...note(28, 80, 'blue')
  ],
  torrente: [
    s('path', { d: 'M14 40l30-26h20l-6 40-20 92H14zM146 30l-30-16h-14l10 50 14 82h20z' }, 'brown'),
    s('path', { d: 'M64 14h38l10 50 14 82H38l20-92z' }, 'blue', { accent: true }),
    s('path', { d: 'M70 30q8 6 14 0t14 0M60 70q10 8 20 0t20 0M50 110q14 10 28 0t28 0', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M86 48q6 8 0 16M66 88q-8 10 0 18M104 90q8 10 0 18', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: dots([[34, 136], [124, 138]], 8) }, 'gray')
  ],
  trazar: [
    s('rect', { x: 14, y: 24, width: 132, height: 112, rx: 6 }, 'navy'),
    s('path', { d: 'M14 52h132M14 80h132M14 108h132M42 24v112M70 24v112M98 24v112M126 24v112', ...SW(1) }, 'sky', { stroke: true }),
    s('path', { d: 'M30 116q20-60 50-40t42-46', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: dots([[30, 116]], 6) }, 'yellow'),
    s('rect', { x: 114, y: 14, width: 12, height: 40, rx: 3, transform: 'rotate(35 120 34)' }, 'yellow', { accent: true }),
    s('path', { d: 'M122 30l-6 12 10-6z', transform: 'rotate(0)' }, 'dark')
  ],
  tsunami: [
    s('path', { d: 'M14 136V96q10-74 82-80q40-2 50 32q-24-14-42 2q-14 14 2 36q-20-6-30 8l-10 14z' }, 'blue', { accent: true }),
    s('path', { d: 'M96 16q40-2 50 32q-24-14-42 2', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M100 120v16h40v-16l-20-14z' }, 'tan'),
    s('rect', { x: 114, y: 124, width: 12, height: 12 }, 'brown'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: 'M30 96q8-6 16 0M44 70q8-6 16 0', ...SW(3) }, 'sky', { stroke: true })
  ],
  urgir: [
    s('path', { d: 'M42 46a14 14 0 0 1 20-14M118 46a14 14 0 0 0-20-14', ...SW(9) }, 'red', { stroke: true }),
    s('circle', { cx: 80, cy: 86, r: 46 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 86, r: 36 }, 'white'),
    s('path', { d: 'M80 86V62M80 86l16 10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M26 66l-8-4M24 86H14M26 106l-8 4M134 66l8-4M136 86h10M134 106l8 4', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M54 128l-10 12M106 128l10 12', ...SW(6) }, 'dark', { stroke: true })
  ],
  vehicular: [
    s('rect', { x: 14, y: 100, width: 132, height: 40, rx: 4 }, 'dark'),
    s('path', { d: 'M18 120h124', ...DASH(4, '12 10') }, 'white', { stroke: true }),
    ...car(20, 84, 'red', 'sky', { accent: true }),
    ...car(90, 66, 'blue'),
  ],
  ventanilla: [
    s('rect', { x: 14, y: 20, width: 132, height: 98, rx: 6 }, 'tan'),
    s('rect', { x: 46, y: 36, width: 68, height: 52, rx: 6 }, 'sky'),
    s('path', { d: busts([80], 88, 34, 22) }, 'blue'),
    s('circle', { cx: 80, cy: 58, r: 11 }, 'skin'),
    s('rect', { x: 38, y: 88, width: 84, height: 10, rx: 2 }, 'brown', { accent: true }),
    s('path', { d: 'M46 36h68v52H46z', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: busts([80], 146, 40, 30) }, 'green'),
  ],
  afluencia: [
    s('path', { d: 'M58 28h44v100H58z' }, 'brown'),
    s('path', { d: 'M66 36h28v92H66z' }, 'yellow', { accent: true }),
    arrow('M18 60l36 30M18 128l36-18M142 60l-36 30M142 128l-36-18', 'orange', 4),
    s('path', { d: busts([22, 40, 120, 138], 136, 14, 16) }, 'blue'),
    s('path', { d: dots([[22, 116], [40, 116], [120, 116], [138, 116]], 6) }, 'skin'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  agro: [
    backdrop('sky'),
    s('path', { d: 'M14 82h132v52a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'brown'),
    s('path', { d: 'M20 96h120M14 114h132M14 134h132', ...SW(5) }, 'green', { stroke: true }),
    s('circle', { cx: 120, cy: 38, r: 12 }, 'yellow'),
    s('path', { d: 'M50 82V36', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: leaflet(50, 40, -60, 16, 5) + leaflet(50, 40, -120, 16, 5) + leaflet(50, 54, -50, 16, 5) + leaflet(50, 54, -130, 16, 5) + leaflet(50, 40, -90, 14, 4) }, 'yellow', { accent: true })
  ],
  alameda: [
    backdrop('sky'),
    s('path', { d: 'M66 146l12-82h4l12 82z' }, 'tan'),
    s('path', { d: ells([[28, 70, 12, 40], [128, 70, 12, 40], [50, 66, 8, 26], [110, 66, 8, 26]]) }, 'green', { accent: true }),
    s('path', { d: 'M28 110v32M128 110v32M50 92v20M110 92v20', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: ells([[64, 64, 5, 14], [96, 64, 5, 14]]) }, 'green'),
  ],
  arrastrar: [
    ground(),
    ...lean(110, 136, 26, 'blue', { accent: true }),
    s('path', { d: 'M62 108l50-14', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 20, y: 96, width: 46, height: 40, rx: 3 }, 'brown'),
    s('path', { d: 'M20 116h46M43 96v40', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M14 142h40', ...DASH(3, '6 4') }, 'brown', { stroke: true })
  ],
  arrepentimiento: [
    ground(),
    s('path', { d: ells([[50, 30, 18, 12], [72, 26, 16, 12], [90, 32, 12, 9]]) }, 'gray'),
    ...person(70, 136, 'navy', { accent: true }),
    s('path', { d: 'M56 96l4-24', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M66 84q4-3 8 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M104 136l8-18 6 10 6-14 8 22z' }, 'sky')
  ],
  aseo: [
    s('rect', { x: 50, y: 18, width: 60, height: 48, rx: 24 }, 'sky'),
    s('path', { d: 'M28 80h104q0 30-52 30t-52-30z' }, 'white'),
    s('path', { d: 'M28 80h104q0 30-52 30t-52-30zM72 110v26h16v-26', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 80v-10h10', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 112, y: 64, width: 22, height: 14, rx: 6 }, 'pink', { accent: true }),
    s('path', { d: dots([[128, 54], [118, 46], [134, 40]], 4) }, 'sky')
  ],
  ateo: [
    backdrop('navy'),
    s('path', { d: sparkle(30, 30, 6) + sparkle(130, 26, 7) + sparkle(110, 60, 5) + sparkle(40, 80, 5) }, 'yellow'),
    ...person(62, 146, 'orange', { accent: true }),
    s('path', { d: 'M46 108l-12-14M78 108l12-14', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: ells([[108, 40, 22, 16]]) + ring(90, 66, 4), ...DASH(3, '4 4') }, 'white', { stroke: true })
  ],
  atroz: [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'purple', { accent: true }),
    s('path', { d: 'M38 30l12 22M122 30l-12 22', ...SW(8) }, 'purple', { stroke: true }),
    s('path', { d: 'M50 64l22 10M110 64l-22 10', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[62, 82], [98, 82]], 6) }, 'yellow'),
    s('path', { d: 'M44 100h72q-6 26-36 26t-36-26z' }, 'dark'),
    s('path', { d: 'M48 100l6 12 6-12 6 12 6-12 6 12 6-12 6 12 6-12 6 12 6-12z' }, 'white')
  ],
  autismo: [
    s('path', { d: 'M30 50h28a12 12 0 1 1 24 0h28v30a12 12 0 1 1 0 24v30H82a12 12 0 1 0-24 0H30v-30a12 12 0 1 0 0-24z' }, 'blue', { accent: true }),
    s('path', { d: 'M30 50h28a12 12 0 1 1 24 0h28v30a12 12 0 1 1 0 24v30H82a12 12 0 1 0-24 0H30v-30a12 12 0 1 0 0-24z', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: heart(70, 88, 14) }, 'yellow')
  ],
  'bajón': [
    ground(),
    s('path', { d: ells([[70, 30, 20, 13], [94, 26, 18, 13], [112, 34, 14, 10]]) }, 'gray'),
    s('path', { d: 'M76 50l-4 8M96 48l-4 8M112 50l-4 8', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M54 136v-26q0-14 18-14t18 14v26z' }, 'blue', { accent: true }),
    s('circle', { cx: 72, cy: 82, r: 13 }, 'skin'),
    s('path', { d: 'M66 90q6-4 12 0', ...SW(2) }, 'dark', { stroke: true }),
    arrow('M126 70v52', 'red', 6),
    s('path', { d: 'M116 116l10 14 10-14z' }, 'red')
  ],
  budista: [
    s('ellipse', { cx: 80, cy: 128, rx: 50, ry: 10 }, 'pink'),
    s('path', { d: leaflet(80, 128, -150, 36, 10) + leaflet(80, 128, -30, 36, 10) }, 'pink'),
    s('ellipse', { cx: 80, cy: 114, rx: 38, ry: 12 }, 'orange'),
    s('path', { d: 'M60 114V84q0-16 20-16t20 16v30z' }, 'orange', { accent: true }),
    s('path', { d: 'M80 70L66 112', ...SW(6) }, 'red', { stroke: true }),
    s('circle', { cx: 80, cy: 52, r: 14 }, 'skin'),
    s('path', { d: 'M80 96V82', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M66 92q14 14 28 0', ...DASH(3, '1 5') }, 'brown', { stroke: true })
  ],
  burlar: [
    ground(),
    ...person(80, 136, 'red'),
    ...lean(128, 136, 18, 'blue', { accent: true }),
    arrow('M30 120q-4-80 50-76t60 30', 'orange', 4),
    s('path', { d: 'M134 64l8 12 6-12z' }, 'orange'),
    s('path', { d: 'M74 80q6 4 12 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  calvario: [
    s('path', { d: 'M14 146L146 54v92z' }, 'brown'),
    s('circle', { cx: 112, cy: 52, r: 24 }, 'gray', { accent: true }),
    ...lean(80, 118, 40, 'blue', { h: 36, w: 24, r: 11 }),
    s('path', { d: drop(76, 64, 4) + drop(64, 74, 3) }, 'sky'),
    s('path', { d: 'M100 30l-6-6M118 26l2-8', ...SW(3) }, 'dark', { stroke: true })
  ],
  caracter: [
    s('rect', { x: 26, y: 26, width: 108, height: 108, rx: 18 }, 'gray'),
    s('rect', { x: 36, y: 32, width: 88, height: 88, rx: 12 }, 'white'),
    s('rect', { x: 36, y: 32, width: 88, height: 88, rx: 12, ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[60, 56], [80, 56], [100, 56], [60, 76], [80, 76], [100, 76], [60, 96], [80, 96]], 4) }, 'dark'),
    s('rect', { x: 94, y: 88, width: 6, height: 18 }, 'blue', { accent: true })
  ],
  cautiverio: [
    s('path', { d: 'M80 14v12', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M34 130V70a46 46 0 0 1 92 0v60', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 130V44M68 130V30M92 130V30M108 130V44', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M54 104q8-24 30-20q10-12 18-2l-8 4q4 18-20 22z' }, 'yellow', { accent: true }),
    s('rect', { x: 26, y: 128, width: 108, height: 12, rx: 3 }, 'brown'),
    s('path', { d: 'M40 96h80', ...SW(4) }, 'brown', { stroke: true })
  ],
  indizar: [
    s('path', { d: rects([[112, 34, 22, 16], [112, 62, 22, 16], [112, 90, 22, 16]]) }, 'red'),
    s('rect', { x: 112, y: 62, width: 26, height: 16, rx: 3 }, 'yellow'),
    s('rect', { x: 112, y: 90, width: 22, height: 16, rx: 3 }, 'green'),
    s('rect', { x: 30, y: 22, width: 88, height: 116, rx: 6 }, 'blue', { accent: true }),
    s('rect', { x: 42, y: 36, width: 62, height: 88, rx: 3 }, 'white'),
    s('path', { d: 'M52 52h40M52 68h30M52 84h40M52 100h24', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[98, 68], [86, 100]], 4) }, 'orange')
  ],
};
