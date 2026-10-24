// Illustration specs for common words still undrawn in batches 0021, 0022 and 0023 (see server/scripts/lexicon/art.js)
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

module.exports = {
  pegar: [
    s('rect', { x: 18, y: 76, width: 70, height: 58, rx: 3, transform: 'rotate(-8 53 105)' }, 'sky'),
    s('rect', { x: 52, y: 84, width: 74, height: 52, rx: 3, transform: 'rotate(6 89 110)' }, 'yellow'),
    s('path', { d: drop(68, 104, 5) + drop(98, 96, 4) + drop(86, 118, 4) }, 'white'),
    s('rect', { x: 104, y: 14, width: 26, height: 42, rx: 6, transform: 'rotate(30 117 52)' }, 'blue', { accent: true }),
    s('path', { d: 'M110 56h14l-7 14z', transform: 'rotate(30 117 52)' }, 'orange')
  ],
  cuero: [
    s('path', { d: 'M40 26q20 10 40 0q20 10 40 0q-6 20 6 30q-12 22 0 44q-12 10-6 32q-20-10-40 0q-20 10-40 0q6-22-6-32q12-22 0-44q12-10 6-30z' }, 'brown', { accent: true }),
    s('path', { d: 'M50 42q30 10 60 0q-6 38 0 76q-30-10-60 0q6-38 0-76z', ...DASH(3, '5 5') }, 'tan', { stroke: true }),
    s('path', { d: ells([[60, 72, 6, 3], [98, 94, 7, 3]]) }, 'tan')
  ],
  'disminución': [
    ground(),
    s('path', { d: rects([[24, 40, 26, 96], [62, 70, 26, 66], [100, 102, 26, 34]]) }, 'blue'),
    s('path', { d: 'M28 22L124 86M106 88l18-2-3-17', ...SW(6) }, 'red', { stroke: true, accent: true })
  ],
  'diversión': [
    s('path', { d: 'M22 20h116', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M58 20l8 88M102 20l-8 88', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 62, r: 12 }, 'skin'),
    s('rect', { x: 68, y: 76, width: 24, height: 30, rx: 8 }, 'orange', { accent: true }),
    s('rect', { x: 56, y: 104, width: 48, height: 7, rx: 3 }, 'red'),
    s('path', { d: 'M86 110l20 8 6 14', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M74 64q6 6 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: sparkle(32, 72, 12) + sparkle(128, 58, 9) + sparkle(124, 118, 7) }, 'yellow')
  ],
  ejemplar: [
    ground(),
    s('rect', { x: 48, y: 108, width: 64, height: 28, rx: 3 }, 'blue'),
    ...person(80, 108, 'green', { h: 36, w: 26, r: 11 }),
    s('path', { d: 'M68 78L54 56M92 78l14-22', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: star(80, 30, 16) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(48, 34, 7) + sparkle(112, 34, 7) }, 'orange')
  ],
  escasez: [
    s('rect', { x: 22, y: 22, width: 116, height: 116, rx: 4 }, 'brown'),
    s('path', { d: rects([[30, 30, 100, 30], [30, 66, 100, 30], [30, 102, 100, 28]]) }, 'cream'),
    s('rect', { x: 100, y: 110, width: 14, height: 20, rx: 2 }, 'red', { accent: true }),
    s('path', { d: 'M30 46l16-16M30 38q8 0 8-8M30 54q16 0 16-24', ...SW(1.5) }, 'gray', { stroke: true })
  ],
  escritorio: [
    s('rect', { x: 18, y: 86, width: 124, height: 10, rx: 2 }, 'brown', { accent: true }),
    s('rect', { x: 96, y: 96, width: 40, height: 42 }, 'tan'),
    s('path', { d: 'M104 110h24M104 126h24M28 96v42', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M38 86V54l14-12', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M42 36l16-14 12 14z' }, 'yellow'),
    s('rect', { x: 72, y: 44, width: 50, height: 34, rx: 3 }, 'dark'),
    s('rect', { x: 76, y: 48, width: 42, height: 26 }, 'sky'),
    s('path', { d: 'M92 78h10v8H92z' }, 'dark')
  ],
  especialista: [
    backdrop('sky'),
    ...person(70, 146, 'white', { w: 40, h: 58 }),
    s('rect', { x: 50, y: 88, width: 40, height: 58, rx: 13, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 90v16q8 12 16 0V90', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M76 124h10M81 119v10', ...SW(3) }, 'red', { stroke: true, accent: true }),
    s('path', { d: ring(116, 64, 14), ...SW(5) }, 'navy', { stroke: true }),
    s('path', { d: 'M106 74L92 92', ...SW(6) }, 'brown', { stroke: true })
  ],
  eterno: [
    s('path', { d: 'M80 82C66 60 26 60 26 82C26 104 66 104 80 82C94 60 134 60 134 82C134 104 94 104 80 82z', ...SW(12) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: sparkle(40, 34, 10) + sparkle(122, 128, 9) + sparkle(130, 34, 6) }, 'yellow')
  ],
  extender: [
    ...person(80, 136, 'blue', { accent: true }),
    s('path', { d: 'M68 98L26 84M92 98l42-14', ...SW(7) }, 'skin', { stroke: true }),
    arrow('M62 46H20m8-8l-8 8 8 8', 'orange', 5),
    arrow('M98 46h42m-8-8l8 8-8 8', 'orange', 5),
    ground()
  ],
  extraordinario: [
    ground(124),
    s('path', { d: dots([[26, 112], [48, 112], [112, 112], [134, 112]], 10) }, 'gray'),
    s('path', { d: burst(80, 70, 50, 32, 12) }, 'yellow'),
    s('path', { d: star(80, 70, 26) }, 'orange', { accent: true })
  ],
  harto: [
    s('circle', { cx: 74, cy: 40, r: 15 }, 'skin'),
    s('ellipse', { cx: 74, cy: 96, rx: 36, ry: 40 }, 'orange', { accent: true }),
    s('path', { d: 'M65 38h6M78 38h6M66 50q8-6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 82q22 10 44 0', ...SW(3) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 128, cy: 132, rx: 18, ry: 6 }, 'gray'),
    s('path', { d: ells([[126, 126, 8, 5]]) }, 'brown'),
    s('path', { d: drop(100, 30, 4) }, 'sky')
  ],
  'implementación': [
    ...paper(24, 20, 76, 112),
    s('path', { d: 'M36 44l5 5 9-9M36 74l5 5 9-9M36 104l5 5 9-9', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M58 46h30M58 76h30M58 106h30', ...SW(3) }, 'gray', { stroke: true }),
    ...gear(116, 108, 16, 8, 'blue', { accent: true }),
    s('circle', { cx: 116, cy: 108, r: 6 }, 'white')
  ],
  impunidad: [
    ground(),
    ...person(60, 136, 'dark'),
    s('rect', { x: 48, y: 72, width: 24, height: 7, rx: 3 }, 'black'),
    s('ellipse', { cx: 92, cy: 100, rx: 16, ry: 18 }, 'tan'),
    s('path', { d: 'M86 82l6 6 6-6', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M110 128a8 8 0 1 1 8 8M138 128a8 8 0 1 0-8 8M118 136h12', ...SW(4) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: 'M24 90h14M20 104h14', ...SW(3) }, 'gray', { stroke: true })
  ],
  laguna: [
    s('ellipse', { cx: 80, cy: 98, rx: 66, ry: 40 }, 'tan'),
    s('ellipse', { cx: 80, cy: 100, rx: 50, ry: 27 }, 'blue', { accent: true }),
    s('path', { d: 'M56 98q8-4 16 0M88 110q8-4 16 0', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M26 82V52M34 84V42M42 80V56', ...SW(4) }, 'green', { stroke: true }),
    s('circle', { cx: 124, cy: 34, r: 14 }, 'yellow')
  ],
  lamentable: [
    ground(),
    s('path', { d: 'M38 136q0-26 30-26q30 0 30 26z' }, 'pink', { accent: true }),
    s('path', { d: 'M96 112l46 12-46 12z' }, 'tan'),
    s('path', { d: 'M104 116l4 16M116 118l4 14M128 121l2 8', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: dots([[50, 104], [86, 102]], 4) }, 'pink'),
    s('path', { d: drop(72, 46, 12) }, 'sky')
  ],
  marcar: [
    s('rect', { x: 20, y: 46, width: 76, height: 76, rx: 8 }, 'white'),
    outline({ x: 20, y: 46, width: 76, height: 76, rx: 8 }, 'gray', 4),
    s('path', { d: 'M36 84l16 16 36-42', ...SW(9) }, 'red', { stroke: true, accent: true }),
    s('rect', { x: 85, y: 4, width: 14, height: 44, rx: 4, transform: 'rotate(35 92 56)' }, 'dark'),
    s('path', { d: 'M85 48h14l-7 8z', transform: 'rotate(35 92 56)' }, 'red')
  ],
  novedad: [
    s('rect', { x: 40, y: 84, width: 80, height: 52, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 30, y: 66, width: 88, height: 16, rx: 3, transform: 'rotate(-18 30 82)' }, 'sky'),
    s('path', { d: 'M80 84v52', ...SW(8) }, 'yellow', { stroke: true }),
    s('path', { d: burst(84, 50, 20, 9, 8) }, 'orange'),
    s('path', { d: sparkle(116, 30, 10) + sparkle(130, 66, 7) + sparkle(56, 26, 7) }, 'yellow')
  ],
  obligatorio: [
    s('path', { d: 'M80 112v32', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 66, r: 50 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 66, r: 44, ...SW(3) }, 'white', { stroke: true }),
    arrow('M80 96V40m-18 18l18-18 18 18', 'white', 10)
  ],
  'obstáculo': [
    ground(),
    s('path', { d: 'M44 136V100M116 136V100', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 36, y: 92, width: 88, height: 12, rx: 2 }, 'red', { accent: true }),
    s('path', { d: rects([[54, 92, 10, 12], [76, 92, 10, 12], [98, 92, 10, 12]]) }, 'white'),
    ...lean(76, 72, 35, 'blue', { h: 28, w: 20, r: 9 }),
    s('path', { d: 'M76 72l-18 4M76 72l14 10', ...SW(6) }, 'navy', { stroke: true })
  ],
  otorgar: [
    ground(),
    ...person(36, 136, 'navy', { h: 40, w: 26 }),
    ...person(124, 136, 'green', { h: 40, w: 26 }),
    s('path', { d: 'M46 104l20-8M114 104l-20-8', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M64 50h32q0 28-16 30q-16-2-16-30z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 80v10M70 94h20M64 56q-10 0-8 10M96 56q10 0 8 10', ...SW(4) }, 'orange', { stroke: true })
  ],
  pelotudo: [
    s('rect', { x: 60, y: 104, width: 40, height: 34, rx: 12 }, 'green'),
    s('circle', { cx: 80, cy: 66, r: 42 }, 'skin', { accent: true }),
    s('path', { d: dots([[64, 58]], 7) + dots([[98, 62]], 3) }, 'dark'),
    s('path', { d: 'M62 86q18 8 34 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 90q2 12 10 8q2-6-2-10z' }, 'pink'),
    s('path', { d: 'M110 20q24-8 30 8q-6 12-22 6', ...DASH(2, '3 4') }, 'gray', { stroke: true }),
    s('path', { d: dots([[118, 34]], 4) + ells([[114, 28, 4, 3], [122, 28, 4, 3]]) }, 'black')
  ],
  piedad: [
    s('path', { d: halfRays(80, 70, 50, 66, 7) , ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M80 30q-18 22-18 62v26h18zM80 30q18 22 18 62v26H80z' }, 'skin'),
    s('path', { d: 'M80 34v84', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M58 116h44l4 26H54z' }, 'blue', { accent: true })
  ],
  'prohibición': [
    ground(),
    s('rect', { x: 18, y: 96, width: 16, height: 40, rx: 2 }, 'dark'),
    s('rect', { x: 26, y: 90, width: 116, height: 12, rx: 4 }, 'white'),
    s('path', { d: rects([[42, 90, 14, 12], [70, 90, 14, 12], [98, 90, 14, 12], [126, 90, 14, 12]]) }, 'red'),
    s('rect', { x: 26, y: 90, width: 116, height: 12, rx: 4, ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 46, r: 30 }, 'red', { accent: true }),
    s('rect', { x: 60, y: 40, width: 40, height: 12, rx: 2 }, 'white')
  ],
  'reconstrucción': [
    ground(),
    s('rect', { x: 32, y: 78, width: 36, height: 58 }, 'tan'),
    s('path', { d: 'M26 80l42-38v38z' }, 'red', { accent: true }),
    s('path', { d: 'M68 42l40 38v56H68', ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 100h12M48 116h12M40 92h0', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M134 136V22H98M106 22v26', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 96, y: 48, width: 20, height: 12, rx: 2 }, 'orange')
  ],
  reunir: [
    s('path', { d: busts([80], 120, 26, 30) }, 'red', { accent: true }),
    s('path', { d: busts([54, 106], 124, 26, 28) }, 'blue'),
    s('path', { d: dots([[80, 78]], 11) + dots([[54, 86], [106, 86]], 11) }, 'skin'),
    s('path', { d: 'M18 22l20 20M38 30v12H26M142 22l-20 20M122 30v12h12M14 106h16m-6-6l6 6-6 6M146 106h-16m6-6l-6 6 6 6', ...SW(5) }, 'orange', { stroke: true }),
    ground(126)
  ],
  rodear: [
    s('path', { d: ring(80, 82, 54), ...DASH(3) }, 'gray', { stroke: true }),
    s('path', { d: dots(around(80, 82, 54, 8, 22.5), 10) }, 'blue'),
    ...person(80, 108, 'red', { h: 28, w: 22, r: 10, accent: true })
  ],
  significativo: [
    ...paper(22, 18, 88, 120),
    s('path', { d: 'M34 40h62M34 58h50M34 94h56M34 112h62', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 30, y: 68, width: 70, height: 14, rx: 3 }, 'yellow'),
    s('path', { d: 'M36 75h58', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: ells([[66, 75, 46, 16]]), ...SW(4) }, 'red', { stroke: true, accent: true }),
    s('path', { d: star(126, 40, 14) }, 'orange')
  ],
  sobra: [
    s('ellipse', { cx: 80, cy: 96, rx: 64, ry: 36 }, 'gray'),
    s('ellipse', { cx: 80, cy: 94, rx: 52, ry: 27 }, 'white'),
    s('path', { d: 'M56 96l26-10', ...SW(5) }, 'cream', { stroke: true }),
    s('path', { d: dots([[52, 98], [54, 92], [84, 84], [86, 90]], 4) }, 'cream'),
    s('path', { d: 'M88 108q10-12 22-2q-4 8-22 2z' }, 'brown', { accent: true }),
    s('path', { d: dots([[100, 88], [108, 92], [70, 106]], 4) }, 'green'),
    s('path', { d: 'M56 98l26-10', ...SW(1.5) }, 'gray', { stroke: true })
  ],
  solitario: [
    backdrop('navy'),
    s('circle', { cx: 116, cy: 42, r: 14 }, 'cream'),
    s('path', { d: dots([[34, 32], [64, 46], [90, 26], [136, 74]], 2) }, 'white'),
    s('path', { d: 'M14 128h132', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 36, y: 108, width: 64, height: 6, rx: 2 }, 'brown'),
    s('path', { d: 'M42 114v14M94 114v14', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 56, cy: 80, r: 10 }, 'skin'),
    s('rect', { x: 46, y: 90, width: 20, height: 20, rx: 6 }, 'purple', { accent: true })
  ],
  'tecnológico': [
    s('path', { d: 'M60 28v16M80 28v16M100 28v16M60 116v16M80 116v16M100 116v16M28 60h16M28 80h16M28 100h16M116 60h16M116 80h16M116 100h16', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 44, y: 44, width: 72, height: 72, rx: 8 }, 'dark'),
    s('rect', { x: 60, y: 60, width: 40, height: 40, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: 'M68 80h24M80 68v24', ...SW(3) }, 'sky', { stroke: true })
  ],
  trinidad: [
    s('path', { d: ring(80, 58, 28), ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('path', { d: ring(58, 98, 28), ...SW(8) }, 'blue', { stroke: true }),
    s('path', { d: ring(102, 98, 28), ...SW(8) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 85, r: 6 }, 'purple')
  ],
  ucranio: [
    backdrop('sky'),
    s('path', { d: 'M14 104h132v30a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'yellow'),
    s('path', { d: 'M26 104l-4-12M40 104l2-14M118 104l-2-14M134 104l4-12', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M80 80v52', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 112, -150, 22, 8) + leaflet(80, 104, -30, 22, 8) }, 'green'),
    s('path', { d: burst(80, 56, 32, 18, 14) }, 'orange'),
    s('circle', { cx: 80, cy: 56, r: 14 }, 'brown', { accent: true })
  ],
  urgencia: [
    ground(132),
    s('rect', { x: 16, y: 58, width: 96, height: 60, rx: 6 }, 'white'),
    outline({ x: 16, y: 58, width: 96, height: 60, rx: 6 }, 'gray', 3),
    s('path', { d: 'M112 72h14l18 22v24h-32z' }, 'red'),
    s('path', { d: 'M64 70v34M47 87h34', ...SW(9) }, 'red', { stroke: true, accent: true }),
    s('rect', { x: 54, y: 46, width: 20, height: 12, rx: 4 }, 'blue'),
    s('path', { d: 'M48 36l-6-8M80 36l6-8M64 32V20', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[42, 120], [122, 120]], 12) }, 'dark')
  ],
  vendedor: [
    s('path', { d: 'M16 22h128l-6 24H22z' }, 'red'),
    s('path', { d: 'M46 24v20M80 24v20M114 24v20', ...SW(10, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('path', { d: 'M22 46v54M138 46v54', ...SW(4) }, 'brown', { stroke: true }),
    ...person(80, 112, 'green', { h: 36, accent: true }),
    s('rect', { x: 18, y: 100, width: 124, height: 38, rx: 3 }, 'brown'),
    s('path', { d: dots([[34, 92], [50, 92], [110, 92], [126, 92]], 8) }, 'orange')
  ],
  aguantar: [
    ground(),
    ...person(80, 136, 'blue', { accent: true }),
    s('path', { d: 'M66 98L58 56M94 98l8-42', ...SW(7) }, 'skin', { stroke: true }),
    s('ellipse', { cx: 80, cy: 40, rx: 44, ry: 25 }, 'gray'),
    s('path', { d: 'M72 78l5 2M88 78l-5 2M74 88h12', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 80l-10-4M120 80l10-4M40 92l-10 0M120 92h10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: drop(104, 76, 4) }, 'sky')
  ],
  alza: [
    s('path', { d: 'M20 136h122M20 136V20', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[32, 110, 16, 26], [60, 96, 16, 40], [88, 78, 16, 58], [116, 56, 16, 80]]) }, 'sky'),
    s('path', { d: 'M30 104l30-24 24 10 48-58', ...SW(7) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M116 30l18-4-2 18', ...SW(7) }, 'green', { stroke: true })
  ],
  borrar: [
    ...paper(18, 28, 108, 92),
    s('path', { d: 'M30 52h84', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 78h30', ...DASH(4, '3 7') }, 'gray', { stroke: true }),
    s('rect', { x: 64, y: 68, width: 50, height: 26, rx: 4, transform: 'rotate(-20 89 81)' }, 'pink', { accent: true }),
    s('rect', { x: 92, y: 68, width: 22, height: 26, rx: 2, transform: 'rotate(-20 89 81)' }, 'blue'),
    s('path', { d: dots([[62, 104], [72, 110], [54, 112]], 3) }, 'pink')
  ],
  can: [
    s('path', { d: 'M42 86q-16-10-18-30', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M52 102v32M64 106v28M92 106v28M104 102v32', ...SW(8) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 76, cy: 92, rx: 38, ry: 20 }, 'brown', { accent: true }),
    s('circle', { cx: 116, cy: 66, r: 16 }, 'brown'),
    s('ellipse', { cx: 130, cy: 74, rx: 12, ry: 8 }, 'tan'),
    s('path', { d: 'M106 58q-10 10-4 30q8-4 10-22z' }, 'dark'),
    s('path', { d: dots([[120, 62]], 2.5) + dots([[141, 71]], 3.5) }, 'dark'),
    s('path', { d: 'M104 80l8 10', ...SW(5) }, 'red', { stroke: true })
  ],
  cardenal: [
    s('path', { d: 'M14 120h120', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M54 100l-30 22 12 4z' }, 'red'),
    s('ellipse', { cx: 80, cy: 90, rx: 34, ry: 26 }, 'red', { accent: true }),
    s('circle', { cx: 104, cy: 60, r: 18 }, 'red'),
    s('path', { d: 'M94 46l0-28 18 22z' }, 'red'),
    s('path', { d: 'M104 56h16v14l-10-2z' }, 'black'),
    s('path', { d: 'M118 56l16 6-16 6z' }, 'orange'),
    s('path', { d: 'M76 114v8M90 114v8', ...SW(4) }, 'dark', { stroke: true })
  ],
  cima: [
    backdrop('sky'),
    s('path', { d: 'M26 146L72 50l26 36 18-22 28 82z' }, 'gray'),
    s('path', { d: 'M61 73l11-23 11 23-5-4-6 6-6-6z' }, 'white'),
    s('path', { d: 'M72 50V20', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M72 20l22 7-22 7z' }, 'red', { accent: true }),
    s('path', { d: ells([[124, 34, 12, 6], [36, 44, 14, 6]]) }, 'white')
  ],
  clic: [
    s('path', { d: 'M62 44v78l18-18 14 30 12-6-14-30h26z' }, 'white'),
    s('path', { d: 'M62 44v78l18-18 14 30 12-6-14-30h26z', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 32l-8-8M62 26V14M76 32l8-8M44 46H32', ...SW(5) }, 'orange', { stroke: true, accent: true })
  ],
  comerciante: [
    ...person(72, 102, 'navy', { h: 36 }),
    s('path', { d: 'M62 74h20v28H62z' }, 'white'),
    s('rect', { x: 18, y: 100, width: 124, height: 38, rx: 3 }, 'tan'),
    s('path', { d: 'M94 72h40l6 28H88z' }, 'gray'),
    s('rect', { x: 102, y: 56, width: 24, height: 14, rx: 2 }, 'dark'),
    s('path', { d: rects([[24, 92, 26, 7], [26, 84, 22, 7]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M88 118h50', ...SW(3) }, 'brown', { stroke: true })
  ],
  conservar: [
    s('rect', { x: 46, y: 44, width: 68, height: 94, rx: 14 }, 'sky'),
    s('rect', { x: 42, y: 26, width: 76, height: 20, rx: 4 }, 'red', { accent: true }),
    s('path', { d: dots([[64, 112], [90, 116], [76, 92], [98, 92], [62, 82]], 10) }, 'orange'),
    s('rect', { x: 46, y: 60, width: 68, height: 14 }, 'cream'),
    s('path', { d: 'M100 52v76', ...SW(4) }, 'white', { stroke: true })
  ],
  'contribución': [
    s('rect', { x: 32, y: 78, width: 96, height: 58, rx: 6 }, 'blue'),
    s('path', { d: 'M62 78h36', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: heart(80, 106, 14) }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 46, r: 14 }, 'yellow'),
    s('circle', { cx: 80, cy: 46, r: 8, ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M60 30v14M100 30v14', ...SW(3) }, 'gray', { stroke: true })
  ],
  demonio: [
    s('path', { d: 'M46 52L36 16l26 22zM114 52l10-36-26 22z' }, 'dark'),
    s('circle', { cx: 80, cy: 86, r: 48 }, 'red', { accent: true }),
    s('path', { d: 'M54 70l18 8M106 70l-18 8M56 104q24 20 48 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[64, 86], [96, 86]], 5) }, 'yellow'),
    s('path', { d: 'M64 109l5 9 4-6zM87 112l5 6 4-9z' }, 'white')
  ],
  descenso: [
    s('path', { d: 'M30 72a50 44 0 0 1 100 0z' }, 'orange', { accent: true }),
    s('path', { d: 'M46 72q8-10 17 0q8-10 17 0q8-10 17 0q8-10 17 0', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M32 72l44 40M128 72l-44 40', ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 106, r: 8 }, 'skin'),
    s('rect', { x: 72, y: 115, width: 16, height: 24, rx: 5 }, 'blue'),
    arrow('M20 96v40m-8-8l8 8 8-8', 'navy', 5)
  ],
  dictador: [
    s('rect', { x: 48, y: 100, width: 64, height: 38, rx: 3 }, 'brown'),
    ...person(80, 100, 'green', { h: 34, w: 32, r: 13 }),
    s('path', { d: 'M66 42q14-18 28 0zM62 42h38v5H62z' }, 'dark', { accent: true }),
    s('path', { d: 'M74 58h12', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: dots([[72, 78], [80, 78]], 3) }, 'yellow'),
    s('path', { d: 'M94 76l32-16', ...SW(7) }, 'green', { stroke: true }),
    s('path', { d: 'M128 56l10-4', ...SW(5) }, 'skin', { stroke: true })
  ],
  doctrina: [
    s('path', { d: 'M64 84h32l-6 54H70z' }, 'brown'),
    s('path', { d: 'M28 70l52 12 52-12v-8L80 74 28 62z' }, 'brown'),
    s('path', { d: 'M30 62q24-10 50 4v12q-26-14-50-4zM130 62q-24-10-50 4v12q26-14 50-4z' }, 'cream', { accent: true }),
    s('path', { d: 'M40 62q16-4 32 2M88 64q16-6 32-2', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: halfRays(80, 54, 18, 34, 5), ...SW(4) }, 'yellow', { stroke: true })
  ],
  eficacia: [
    s('path', { d: 'M24 72a20 20 0 0 1 20-20h22v40H44a20 20 0 0 1-20-20z', transform: 'rotate(-40 66 72)' }, 'red', { accent: true }),
    s('path', { d: 'M66 52h22a20 20 0 0 1 0 40H66z', transform: 'rotate(-40 66 72)' }, 'yellow'),
    s('circle', { cx: 112, cy: 112, r: 28 }, 'green'),
    s('path', { d: 'M98 112l10 10 18-20', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: sparkle(32, 120, 9) + sparkle(120, 34, 8) }, 'yellow')
  ],
  elegante: [
    ...person(80, 138, 'black', { w: 36, h: 52 }),
    s('path', { d: 'M70 34h20v24H70zM60 56h40v6H60z' }, 'black'),
    s('rect', { x: 70, y: 50, width: 20, height: 5 }, 'red'),
    s('path', { d: 'M72 86l8 20 8-20z' }, 'white'),
    s('path', { d: 'M70 86l10 4 10-4v10l-10-4-10 4z' }, 'red', { accent: true })
  ],
  escoger: [
    s('rect', { x: 18, y: 120, width: 124, height: 10, rx: 3 }, 'brown'),
    s('path', { d: dots([[38, 108], [66, 108], [122, 108]], 12) }, 'green'),
    s('path', { d: ring(94, 108, 12), ...DASH(2, '3 4') }, 'gray', { stroke: true }),
    s('path', { d: 'M100 14v42', ...SW(12) }, 'skin', { stroke: true }),
    s('circle', { cx: 98, cy: 74, r: 14 }, 'red', { accent: true }),
    s('path', { d: 'M92 62q6-4 12 0', ...SW(9) }, 'skin', { stroke: true })
  ],
  'expedición': [
    s('path', { d: 'M62 112l34-62 34 62zM104 112l22-40 20 40z' }, 'gray'),
    s('path', { d: 'M86 68l10-18 10 18-5-3-5 5-5-5z' }, 'white'),
    ground(),
    s('path', { d: 'M14 112h132', ...SW(3) }, 'mint', { stroke: true }),
    s('rect', { x: 26, y: 88, width: 16, height: 32, rx: 4 }, 'brown'),
    ...person(50, 136, 'orange', { accent: true }),
    s('path', { d: 'M62 100l14 36', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M38 66q12-12 24 0z' }, 'green')
  ],
  explotar: [
    s('path', { d: burst(80, 80, 66, 36, 12) }, 'orange'),
    s('path', { d: burst(80, 80, 42, 24, 10) }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 14 }, 'white'),
    s('path', { d: rects([[20, 30, 8, 8], [130, 120, 10, 8], [128, 26, 8, 10], [24, 124, 10, 10]]) }, 'dark')
  ],
  externo: [
    s('path', { d: ring(64, 84, 46), ...DASH(4, '8 6') }, 'navy', { stroke: true }),
    s('path', { d: dots([[50, 70], [74, 66], [60, 96], [82, 98]], 8) }, 'gray'),
    s('circle', { cx: 130, cy: 32, r: 12 }, 'red', { accent: true }),
    arrow('M92 66l26-24m-14 0h14v14', 'orange', 5)
  ],
  fantasma: [
    backdrop('navy'),
    s('circle', { cx: 122, cy: 36, r: 12 }, 'yellow'),
    s('path', { d: 'M46 132V72a34 34 0 0 1 68 0v60l-11-10-11 10-12-10-12 10-11-10z' }, 'white', { accent: true }),
    s('path', { d: ells([[68, 74, 5, 8], [92, 74, 5, 8], [80, 98, 6, 8]]) }, 'dark')
  ],
  harina: [
    s('path', { d: 'M46 40q34-12 68 0l8 96H38z' }, 'tan'),
    s('path', { d: 'M54 40q26-16 52 0', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 70v44', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: ells([[74, 78, 4, 7], [86, 78, 4, 7], [74, 92, 4, 7], [86, 92, 4, 7], [80, 66, 4, 7]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M22 138q22-26 44 0z' }, 'white'),
    s('path', { d: 'M22 138q22-26 44 0z', ...SW(2) }, 'gray', { stroke: true })
  ],
  ingresar: [
    ground(),
    s('rect', { x: 92, y: 30, width: 44, height: 106 }, 'brown'),
    s('rect', { x: 98, y: 36, width: 32, height: 100 }, 'dark'),
    s('path', { d: 'M130 36l14-8v116l-14-8z' }, 'tan'),
    ...lean(92, 136, 8, 'blue', { accent: true }),
    arrow('M24 66h44m-10-10l10 10-10 10', 'green', 6)
  ],
  literario: [
    s('path', { d: 'M18 52q30-12 62 4v80q-32-16-62-4z' }, 'cream'),
    s('path', { d: 'M142 52q-30-12-62 4v80q32-16 62-4z' }, 'cream'),
    s('path', { d: 'M18 52q30-12 62 4v80q-32-16-62-4zM142 52q-30-12-62 4v80q32-16 62-4z', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M30 70q20-6 40 2M30 86q20-6 40 2M30 102q20-6 40 2M90 72q20-8 40-2M90 88q20-8 40-2', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 112q4-56 44-90q6 50-40 92z' }, 'purple', { accent: true }),
    s('path', { d: 'M96 116l36-84', ...SW(2) }, 'white', { stroke: true })
  ],
  mami: [
    ground(),
    ...lady(62, 136, 'pink', { accent: true }),
    ...person(108, 136, 'yellow', { h: 28, w: 20, r: 10 }),
    s('path', { d: 'M74 102l26 2', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(86, 30, 12) }, 'red')
  ],
  norteamericano: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'sky'),
    s('path', { d: 'M28 44q28-18 66-14q26 2 34 14l-12 14-14-4-6 16 8 10-14 20-14 6-4 14 10 10-4 6-16-16-6-22-16-14-12-24z' }, 'green', { accent: true }),
    s('path', { d: 'M96 26q10-6 18 0l-6 10z' }, 'white'),
    s('path', { d: 'M126 34l8 20h-16z' }, 'red'),
    s('path', { d: 'M126 74l8-20h-16z' }, 'navy')
  ],
  opuesto: [
    s('path', { d: 'M80 22v116', ...DASH(3) }, 'gray', { stroke: true }),
    arrow('M72 60H22m14-14L22 60l14 14', 'blue', 8),
    s('path', { d: 'M88 100h50m-14-14l14 14-14 14', ...SW(8) }, 'red', { stroke: true, accent: true })
  ],
  pene: [
    s('path', { d: ring(66, 94, 34), ...SW(12) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M90 70l38-38M100 30h28v28', ...SW(12) }, 'blue', { stroke: true })
  ],
  pibe: [
    ground(),
    ...person(64, 136, 'blue', { h: 36, w: 24, r: 12, accent: true }),
    s('path', { d: 'M52 82q12-18 24 0zM74 79h12v3H74z' }, 'red'),
    s('path', { d: 'M70 132l22-8', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 112, cy: 122, r: 13 }, 'white'),
    s('circle', { cx: 112, cy: 122, r: 13, ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[112, 122]], 5) + dots([[104, 114], [120, 116]], 2.5) }, 'dark'),
    s('path', { d: 'M132 110h10M134 122h10', ...SW(3) }, 'gray', { stroke: true })
  ],
  productividad: [
    s('rect', { x: 14, y: 102, width: 132, height: 12, rx: 6 }, 'dark'),
    s('path', { d: dots([[26, 108], [52, 108], [80, 108], [108, 108], [134, 108]], 3) }, 'gray'),
    s('path', { d: rects([[22, 80, 22, 22], [58, 80, 22, 22], [94, 80, 22, 22]]) }, 'tan'),
    s('path', { d: 'M22 90h22M58 90h22M94 90h22', ...SW(3) }, 'brown', { stroke: true }),
    ...gear(118, 44, 14, 8, 'blue', { accent: true }),
    s('path', { d: 'M20 60h30M28 48h24', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 128h80', ...SW(4) }, 'gray', { stroke: true })
  ],
  provenir: [
    s('path', { d: 'M22 52l16-14 16 14z' }, 'red'),
    s('rect', { x: 26, y: 52, width: 24, height: 18 }, 'tan'),
    s('path', { d: 'M48 76q10 30 44 24t36 34', ...DASH(5, '2 10') }, 'brown', { stroke: true }),
    s('path', { d: 'M114 128l16 10-4-18', ...SW(5) }, 'brown', { stroke: true }),
    s('circle', { cx: 38, cy: 62, r: 34, ...SW(3) }, 'orange', { stroke: true, accent: true })
  ],
  quemar: [
    s('path', { d: 'M28 40h70l20 20v80H28z' }, 'cream'),
    s('path', { d: 'M28 40h70l20 20v80H28z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 140q-6-20 8-28q10-10 24-6v34z' }, 'dark'),
    s('path', { d: 'M100 142q-14-26 6-46q2 16 10 12q-2-20 14-40q4 34 12 52q2 14-8 22z' }, 'orange', { accent: true }),
    s('path', { d: 'M112 142q-6-14 6-26q4 10 10 8q6 10-2 18z' }, 'yellow'),
    s('path', { d: 'M40 64h40M40 82h40', ...SW(3) }, 'gray', { stroke: true })
  ],
  rasgo: [
    s('path', { d: 'M22 112c20-40 40 8 60-24s36-6 50-40', ...SW(16) }, 'purple', { accent: true, stroke: true }),
    s('path', { d: 'M126 52l14-34', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M124 48l-6 16 12 4 4-14z' }, 'gray'),
    s('path', { d: 'M118 64l-4 10 10 4z' }, 'purple')
  ],
  reparto: [
    ground(134),
    s('path', { d: 'M30 112h70l22-40h10', ...SW(8) }, 'red', { stroke: true }),
    s('path', { d: dots([[40, 120], [118, 120]], 12) }, 'dark'),
    s('rect', { x: 26, y: 70, width: 38, height: 36, rx: 3 }, 'orange', { accent: true }),
    s('circle', { cx: 86, cy: 46, r: 11 }, 'skin'),
    s('rect', { x: 74, y: 58, width: 24, height: 38, rx: 8 }, 'blue'),
    s('path', { d: 'M96 70l26 4', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M76 40q10-12 22 0z' }, 'red')
  ],
  'restricción': [
    s('path', { d: 'M14 60h132M14 100h132', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: ells([[30, 80, 12, 8], [56, 80, 12, 8], [104, 80, 12, 8], [130, 80, 12, 8]]), ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 66v-10a14 14 0 0 1 28 0v10', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 58, y: 66, width: 44, height: 40, rx: 6 }, 'yellow', { accent: true }),
    s('path', { d: dots([[80, 82]], 5) + 'M78 84h4v12h-4z' }, 'dark')
  ],
  satisfacer: [
    s('circle', { cx: 74, cy: 84, r: 50 }, 'yellow', { accent: true }),
    s('path', { d: 'M52 74q8-10 16 0M80 74q8-10 16 0M50 98q24 26 48 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[50, 92], [98, 92]], 6) }, 'pink'),
    s('circle', { cx: 122, cy: 118, r: 20 }, 'green'),
    s('path', { d: 'M112 118l7 7 13-14', ...SW(5) }, 'white', { stroke: true })
  ],
  sigla: [
    s('path', { d: rects([[20, 24, 16, 16], [56, 116, 16, 16]]) }, 'red', { accent: true }),
    s('path', { d: rects([[20, 48, 16, 16], [72, 116, 16, 16]]) }, 'blue'),
    s('path', { d: rects([[20, 72, 16, 16], [88, 116, 16, 16]]) }, 'green'),
    s('path', { d: 'M46 32h66M46 56h90M46 80h54', ...SW(8) }, 'gray', { stroke: true }),
    arrow('M80 92v14m-7-7l7 7 7-7', 'orange', 4)
  ],
  sincero: [
    ...person(80, 138, 'sky', { w: 44, h: 60 }),
    s('path', { d: heart(72, 104, 12) }, 'red', { accent: true }),
    s('path', { d: 'M100 130q-6-20-22-24', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M72 60q8 6 16 0M72 50h4M84 50h4', ...SW(2.5) }, 'dark', { stroke: true })
  ],
  tapa: [
    s('path', { d: 'M52 64h56l-6 74H58z' }, 'sky'),
    s('path', { d: 'M55 84h50l-4 52H59z' }, 'orange'),
    s('path', { d: 'M40 44q40-10 80 0v8H40z' }, 'pink'),
    s('rect', { x: 34, y: 50, width: 92, height: 14, rx: 6 }, 'tan', { accent: true }),
    s('path', { d: 'M80 52V14', ...SW(3) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 34, r: 7 }, 'green')
  ],
  tortura: [
    s('path', { d: 'M20 80q15-24 30 0t30 0 30 0 30 0', ...SW(20) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M20 80q15-24 30 0t30 0 30 0 30 0', ...SW(6) }, 'sky', { stroke: true }),
    s('path', { d: dots([[16, 80], [144, 80]], 12) }, 'skin'),
    s('path', { d: drop(50, 116, 5) + drop(80, 128, 5) + drop(110, 116, 5) }, 'sky'),
    s('path', { d: 'M34 42l8 8M80 30v12M126 42l-8 8', ...SW(4) }, 'red', { stroke: true })
  ],
  transmitir: [
    s('path', { d: 'M80 44L58 138M80 44l22 94M66 104h28M71 80h18', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 40, r: 9 }, 'red', { accent: true }),
    s('path', { d: 'M62 24q-12 16 0 32M98 24q12 16 0 32M46 14q-22 26 0 52M114 14q22 26 0 52', ...SW(5) }, 'blue', { stroke: true })
  ],
  trono: [
    s('rect', { x: 46, y: 18, width: 68, height: 86, rx: 10 }, 'yellow', { accent: true }),
    s('rect', { x: 56, y: 30, width: 48, height: 66, rx: 6 }, 'red'),
    s('path', { d: dots([[46, 20], [80, 14], [114, 20]], 6) }, 'orange'),
    s('rect', { x: 34, y: 96, width: 92, height: 18, rx: 4 }, 'red'),
    s('path', { d: 'M30 78h20v20M130 78h-20v20', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: rects([[38, 114, 12, 24], [110, 114, 12, 24]]) }, 'yellow')
  ],
  vera: [
    backdrop('sky'),
    s('path', { d: 'M14 72h132v30c-30 8-60-8-90 4c-16 6-30 2-42-2z' }, 'green'),
    s('path', { d: 'M14 104c12 4 26 8 42 2c30-12 60 4 90-4v32a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'blue', { accent: true }),
    s('path', { d: 'M40 126q8-4 16 0M96 120q8-4 16 0', ...SW(3) }, 'sky', { stroke: true }),
    s('circle', { cx: 74, cy: 54, r: 10 }, 'skin'),
    s('rect', { x: 64, y: 64, width: 20, height: 22, rx: 6 }, 'red'),
    s('path', { d: 'M82 86l12 10', ...SW(6) }, 'navy', { stroke: true }),
    s('path', { d: 'M124 100V70M132 100V60', ...SW(3) }, 'brown', { stroke: true })
  ],
  'acusación': [
    ground(),
    ...person(40, 136, 'navy'),
    s('path', { d: 'M52 98l36-10', ...SW(7) }, 'skin', { stroke: true }),
    ...person(120, 136, 'orange', { accent: true }),
    s('path', { d: 'M106 100l-8-28M134 100l8-28', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: drop(136, 54, 4) }, 'sky'),
    s('path', { d: 'M94 78l6-4M94 90h8', ...SW(3) }, 'red', { stroke: true })
  ],
  advertir: [
    s('path', { d: 'M80 18l64 112H16z' }, 'dark'),
    s('path', { d: 'M80 34l50 88H30z' }, 'yellow', { accent: true }),
    s('path', { d: 'M86 54L66 94h16l-8 26 24-38H82l10-28z' }, 'dark')
  ],
  aliento: [
    backdrop('navy'),
    s('circle', { cx: 52, cy: 72, r: 22 }, 'skin'),
    s('path', { d: busts([52], 146, 52, 50) }, 'blue'),
    s('rect', { x: 32, y: 92, width: 42, height: 12, rx: 5 }, 'red', { accent: true }),
    s('path', { d: 'M70 66h4M68 82q4 2 6 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: ells([[96, 80, 12, 9], [114, 72, 14, 11], [132, 60, 10, 8]]) }, 'white'),
    s('path', { d: dots([[110, 30], [136, 100], [30, 32]], 3) }, 'white')
  ],
  averiguar: [
    s('path', { d: ells([[34, 120, 7, 11], [56, 102, 7, 11], [40, 82, 7, 11], [62, 62, 7, 11]]) }, 'gray'),
    s('circle', { cx: 92, cy: 66, r: 28 }, 'sky'),
    s('path', { d: ring(92, 66, 28), ...SW(8) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M112 88l26 30', ...SW(12) }, 'brown', { stroke: true }),
    s('path', { d: ells([[92, 70, 6, 10]]) }, 'dark'),
    s('path', { d: 'M78 52q6-8 14-8', ...SW(3) }, 'white', { stroke: true })
  ],
  beso: [
    s('circle', { cx: 56, cy: 84, r: 26 }, 'skin'),
    s('circle', { cx: 104, cy: 84, r: 26 }, 'skin'),
    s('path', { d: 'M30 82q2-34 30-32q12 2 18 10q-24-4-48 22z' }, 'brown'),
    s('path', { d: 'M82 70q4-24 28-22q22 2 22 26q-10-14-26-12z' }, 'dark'),
    s('path', { d: 'M54 80q5 4 10 0M96 80q5 4 10 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[54, 94], [106, 94]], 5) }, 'pink'),
    s('path', { d: heart(80, 34, 16) }, 'red', { accent: true })
  ],
  certeza: [
    ...paper(18, 70, 80, 70),
    s('path', { d: ring(58, 104, 22), ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M46 104l8 8 16-16', ...SW(6) }, 'green', { stroke: true, accent: true }),
    s('rect', { x: 92, y: 54, width: 44, height: 14, rx: 3 }, 'red', { transform: 'rotate(-20 114 61)' }),
    s('path', { d: 'M110 52l-8-26', ...SW(8) }, 'brown', { stroke: true }),
    s('circle', { cx: 100, cy: 22, r: 10 }, 'brown')
  ],
  claridad: [
    s('rect', { x: 28, y: 22, width: 104, height: 96, rx: 4 }, 'brown'),
    s('rect', { x: 36, y: 30, width: 88, height: 80 }, 'sky'),
    s('circle', { cx: 80, cy: 64, r: 16 }, 'yellow', { accent: true }),
    s('path', { d: rays(80, 64, 22, 32, 8), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M28 18h14q-4 50 6 104H28zM132 18h-14q4 50-6 104h20z' }, 'red'),
    s('path', { d: 'M40 118l-18 22h116l-18-22z' }, 'cream')
  ],
  colaborar: [
    ground(),
    ...person(40, 136, 'blue'),
    ...person(120, 136, 'green', { accent: true }),
    s('path', { d: 'M50 98l2-34M110 98l-2-34', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 18, y: 54, width: 124, height: 10, rx: 3 }, 'brown')
  ],
  coma: [
    s('rect', { x: 16, y: 96, width: 104, height: 14, rx: 4 }, 'gray'),
    s('path', { d: 'M20 110v26M116 110v26', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 34, cy: 84, r: 12 }, 'skin'),
    s('path', { d: 'M46 82h72v14H46z' }, 'sky'),
    s('path', { d: 'M28 82h8', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 100, y: 18, width: 46, height: 40, rx: 4 }, 'dark'),
    s('path', { d: 'M104 40h10l4-10 6 20 4-10h14', ...SW(3) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M122 58v38', ...SW(4) }, 'gray', { stroke: true })
  ],
  creatividad: [
    s('path', { d: 'M78 26c-36 0-62 24-62 54 0 28 22 50 52 50 10 0 12-8 8-14-4-8 2-14 10-14h18c18 0 34-12 34-30 0-26-26-46-60-46z' }, 'tan'),
    s('path', { d: dots([[46, 70]], 9) }, 'red', { accent: true }),
    s('path', { d: dots([[66, 48]], 9) }, 'blue'),
    s('path', { d: dots([[96, 46]], 9) }, 'yellow'),
    s('path', { d: dots([[118, 66]], 9) }, 'green'),
    s('path', { d: dots([[48, 104]], 8) }, 'white'),
    s('path', { d: 'M92 140l40-50', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: sparkle(136, 30, 10) }, 'purple')
  ],
  cuartel: [
    ground(),
    s('rect', { x: 18, y: 76, width: 124, height: 60 }, 'green'),
    s('path', { d: 'M14 78l24-20h84l24 20z' }, 'dark'),
    s('path', { d: rects([[30, 92, 18, 14], [58, 92, 18, 14], [112, 92, 18, 14]]) }, 'cream'),
    s('rect', { x: 84, y: 102, width: 18, height: 34 }, 'brown'),
    s('path', { d: 'M80 58V18', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 20l26 8-26 8z' }, 'orange', { accent: true })
  ],
  custodia: [
    s('path', { d: 'M80 18l54 18v38c0 34-24 56-54 68c-30-12-54-34-54-68V36z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 30l42 14v30c0 26-18 44-42 54c-24-10-42-28-42-54V44z' }, 'sky'),
    ...person(80, 116, 'yellow', { h: 30, w: 24, r: 11 }),
    s('path', { d: 'M54 86q-4 20 14 30M106 86q4 20-14 30', ...SW(6) }, 'skin', { stroke: true })
  ],
  divino: [
    backdrop('sky'),
    s('path', { d: rays(80, 70, 30, 54, 12), ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: ells([[80, 50, 24, 7]]), ...SW(6) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: ells([[54, 116, 26, 16], [84, 108, 30, 20], [112, 118, 24, 14]]) }, 'white'),
    s('path', { d: sparkle(30, 36, 8) + sparkle(130, 40, 8) }, 'white')
  ],
  encargo: [
    s('rect', { x: 26, y: 70, width: 80, height: 66, rx: 4 }, 'tan'),
    s('path', { d: 'M26 92h80M66 70v66', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M106 82q16-8 22-30', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 110, y: 18, width: 36, height: 46, rx: 3, transform: 'rotate(10 128 41)' }, 'yellow', { accent: true }),
    s('path', { d: 'M118 30l3 3 5-5M118 42l3 3 5-5M130 32h10M130 44h10M118 54h22', ...SW(2), transform: 'rotate(10 128 41)' }, 'dark', { stroke: true })
  ],
  espectador: [
    s('rect', { x: 18, y: 18, width: 124, height: 72, rx: 4 }, 'red'),
    s('path', { d: 'M36 18q8 40-18 72h50q-14-36-14-72zM124 18q-8 40 18 72H92q14-36 14-72z' }, 'purple'),
    s('path', { d: 'M80 30l12 50H68z' }, 'yellow', { accent: true }),
    s('path', { d: busts([30, 80, 130], 148, 34, 32) + dots([[30, 108], [80, 106], [130, 108]], 14) }, 'dark'),
    s('path', { d: busts([55, 105], 148, 30, 20) + dots([[55, 120], [105, 120]], 12) }, 'black')
  ],
  evaluar: [
    s('rect', { x: 26, y: 22, width: 108, height: 120, rx: 6 }, 'brown'),
    s('rect', { x: 34, y: 34, width: 92, height: 100, rx: 3 }, 'white'),
    s('rect', { x: 62, y: 16, width: 36, height: 14, rx: 4 }, 'gray'),
    s('path', { d: star(50, 60, 11) + star(80, 60, 11) + star(110, 60, 11) }, 'yellow', { accent: true }),
    s('path', { d: star(50, 96, 11) + star(80, 96, 11) }, 'yellow'),
    s('path', { d: star(110, 96, 11) }, 'gray'),
    s('path', { d: 'M44 120h72', ...SW(3) }, 'gray', { stroke: true })
  ],
  expediente: [
    s('path', { d: 'M18 46h40l8 10h76v80H18z' }, 'orange'),
    ...paper(30, 30, 92, 70),
    s('path', { d: 'M42 48h60M42 62h60M42 76h40', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 74h124v62H18z' }, 'tan', { accent: true }),
    s('path', { d: 'M110 22v34a6 6 0 0 0 12 0V28', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 116, cy: 108, r: 12, ...SW(3) }, 'red', { stroke: true })
  ],
  'exportación': [
    s('path', { d: 'M14 124q10-6 20 0t20 0 20 0 20 0 20 0 20 0 20 0v22H14z' }, 'blue'),
    s('path', { d: 'M22 98h104l-14 26H34z' }, 'navy', { accent: true }),
    s('path', { d: rects([[34, 78, 22, 20], [58, 78, 22, 20]]) }, 'red'),
    s('path', { d: rects([[82, 78, 22, 20], [46, 58, 22, 20]]) }, 'green'),
    s('rect', { x: 106, y: 66, width: 14, height: 32 }, 'white'),
    arrow('M112 36h30m-8-8l8 8-8 8', 'orange', 5)
  ],
  fortalecer: [
    s('path', { d: 'M30 136V46h14v10h14V46h14v10h14V46h14v10h14V46h14v90z' }, 'gray'),
    s('path', { d: 'M30 76h100M30 98h100M30 120h100M56 76v22M90 76v22M74 98v22M108 98v22M46 120v16M98 120v16', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M80 70l28 10v24c0 18-14 28-28 34c-14-6-28-16-28-34V80z' }, 'blue', { accent: true }),
    arrow('M80 112V88m-10 10l10-10 10 10', 'white', 5),
    s('path', { d: 'M136 46v-28M136 20l12 4-12 4z', ...SW(3) }, 'red', { stroke: true })
  ],
  fundar: [
    s('rect', { x: 14, y: 104, width: 132, height: 36 }, 'brown'),
    s('rect', { x: 34, y: 90, width: 92, height: 18 }, 'gray'),
    s('path', { d: rects([[36, 70, 28, 18], [66, 70, 28, 18], [96, 70, 28, 18], [50, 50, 28, 18]]) }, 'orange', { accent: true }),
    s('path', { d: 'M104 44l20-22', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M96 42l14 14-18 4z' }, 'gray')
  ],
  gobernante: [
    s('path', { d: 'M46 138l12-62h44l12 62z' }, 'purple'),
    s('circle', { cx: 80, cy: 58, r: 16 }, 'skin'),
    s('path', { d: 'M62 42l2-22 9 10 7-14 7 14 9-10 2 22z' }, 'yellow', { accent: true }),
    s('path', { d: 'M58 76h44', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M118 130V50', ...SW(5) }, 'yellow', { stroke: true }),
    s('circle', { cx: 118, cy: 46, r: 8 }, 'red'),
    s('path', { d: 'M102 96l14-4', ...SW(6) }, 'skin', { stroke: true })
  ],
  gobernar: [
    s('path', { d: rays(80, 80, 0, 64, 8), ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: ring(80, 80, 42), ...SW(12) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: dots(around(80, 80, 64, 8), 6) }, 'tan'),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'yellow')
  ],
  hidalgo: [
    s('rect', { x: 52, y: 92, width: 56, height: 50, rx: 16 }, 'dark'),
    s('path', { d: ells([[80, 90, 30, 9]]) }, 'white'),
    s('path', { d: ells([[80, 90, 30, 9]]), ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 64, r: 18 }, 'skin'),
    s('path', { d: 'M70 72q10-6 20 0M80 72v8', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M48 46h64v6H48zM58 46q22-24 44 0z' }, 'black'),
    s('path', { d: 'M96 38q20-26 40-22q-16 6-38 28z' }, 'red', { accent: true })
  ],
  jugo: [
    s('path', { d: 'M46 42h56l-8 96H54z' }, 'sky'),
    s('path', { d: 'M49 60h50l-6 74H55z' }, 'orange', { accent: true }),
    s('path', { d: 'M86 70l18-56h12', ...SW(5) }, 'red', { stroke: true }),
    s('circle', { cx: 104, cy: 48, r: 18 }, 'orange'),
    s('circle', { cx: 104, cy: 48, r: 13 }, 'yellow'),
    s('path', { d: rays(104, 48, 2, 12, 6), ...SW(2) }, 'orange', { stroke: true })
  ],
  lamento: [
    s('path', { d: ells([[66, 30, 22, 13], [92, 26, 22, 15], [110, 34, 16, 10]]) }, 'gray'),
    s('path', { d: 'M62 50l-4 8M84 48l-4 8M104 50l-4 8', ...SW(3) }, 'sky', { stroke: true }),
    s('circle', { cx: 80, cy: 82, r: 18 }, 'skin'),
    s('path', { d: busts([80], 140, 48, 40) }, 'purple', { accent: true }),
    s('path', { d: 'M62 104l8-18M98 104l-8-18', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M71 80q3-3 6 0M83 80q3-3 6 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: drop(70, 92, 3) + drop(90, 92, 3) }, 'blue')
  ],
  limitar: [
    s('path', { d: 'M14 70h66v66H26a12 12 0 0 1-12-12z' }, 'green'),
    s('path', { d: 'M80 70h66v54a12 12 0 0 1-12 12H80z' }, 'yellow'),
    s('path', { d: 'M80 52v90', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 64v-8M80 92v0M80 116v0', ...SW(14) }, 'brown', { stroke: true }),
    s('path', { d: 'M70 76h20M70 104h20', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M80 34v-20', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 14l18 6-18 6z' }, 'red', { accent: true })
  ],
  lisa: [
    s('path', { d: 'M38 80l-24-20v40z' }, 'gray'),
    s('ellipse', { cx: 82, cy: 80, rx: 54, ry: 22 }, 'gray', { accent: true }),
    s('path', { d: 'M40 72h80M40 82h84M44 92h70', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M76 58l14-14 10 16zM76 102l10 12 8-12z' }, 'gray'),
    s('circle', { cx: 120, cy: 76, r: 5 }, 'white'),
    s('path', { d: dots([[121, 76]], 2.5) }, 'dark'),
    s('path', { d: dots([[140, 50], [146, 36]], 4) }, 'sky')
  ],
  maquinaria: [
    ground(),
    s('rect', { x: 20, y: 112, width: 80, height: 22, rx: 11 }, 'dark'),
    s('path', { d: dots([[32, 123], [60, 123], [88, 123]], 6) }, 'gray'),
    s('path', { d: 'M26 112V80h44l12 14v18z' }, 'yellow', { accent: true }),
    s('path', { d: 'M30 84h22v18H30z' }, 'sky'),
    s('path', { d: 'M78 98l30-50 24 22', ...SW(9) }, 'orange', { stroke: true }),
    s('path', { d: 'M124 64l20 6-6 28-18-8z' }, 'dark')
  ],
  masculino: [
    s('circle', { cx: 80, cy: 54, r: 28 }, 'skin'),
    s('path', { d: 'M54 54q2 30 26 32q24-2 26-32q-4 14-12 14q-8-6-14-6t-14 6q-8 0-12-14z' }, 'brown'),
    s('path', { d: 'M54 46q0-26 26-26t26 26q-8-10-26-10t-26 10z' }, 'brown'),
    s('path', { d: busts([80], 142, 84, 54) }, 'blue', { accent: true }),
    s('path', { d: dots([[70, 50], [90, 50]], 3) }, 'dark'),
    s('path', { d: 'M70 96l10 10 10-10', ...SW(3) }, 'white', { stroke: true })
  ],
  'minoría': [
    s('path', { d: dots([[28, 40], [54, 40], [80, 40], [28, 72], [54, 72], [80, 72], [28, 104], [54, 104], [80, 104], [28, 136], [54, 136], [80, 136]], 10) }, 'gray'),
    s('path', { d: dots([[120, 72], [136, 104]], 12) }, 'red', { accent: true }),
    s('path', { d: 'M104 24v120', ...DASH(3) }, 'gray', { stroke: true })
  ],
  'motivación': [
    s('path', { d: 'M18 138h32v-24h28V90h28V66h36v72z' }, 'blue'),
    ...lean(64, 114, 14, 'orange', { h: 30, w: 20, r: 9, accent: true }),
    s('path', { d: star(124, 36, 18) }, 'yellow'),
    s('path', { d: sparkle(96, 26, 7) }, 'yellow')
  ],
  'navegación': [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'navy'),
    s('circle', { cx: 80, cy: 80, r: 52 }, 'cream'),
    s('path', { d: rays(80, 80, 44, 52, 16), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 30l12 50H68z' }, 'red', { accent: true }),
    s('path', { d: 'M80 130l12-50H68z' }, 'gray'),
    s('circle', { cx: 80, cy: 80, r: 6 }, 'dark')
  ],
  nervio: [
    s('path', { d: 'M80 70L50 34M50 34l-12 2M50 34l2-14M80 70L40 76M40 76l-14-8M40 76l-12 10M80 70l28-36M108 34l14-4M108 34l-2-14', ...SW(5) }, 'pink', { stroke: true }),
    s('path', { d: 'M86 80q20 30 40 40t8 22', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M126 140l-8 4M134 142l2 4', ...SW(4) }, 'pink', { stroke: true }),
    s('circle', { cx: 80, cy: 72, r: 18 }, 'pink', { accent: true }),
    s('circle', { cx: 80, cy: 72, r: 7 }, 'purple')
  ],
  parto: [
    s('path', { d: 'M28 70h104l-8 46H36z' }, 'sky'),
    s('path', { d: 'M28 70h104l-8 46H36z', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M48 116l-6 24M112 116l6 24M38 140h84', ...SW(4) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 84, cy: 86, rx: 34, ry: 16 }, 'pink', { accent: true }),
    s('circle', { cx: 56, cy: 82, r: 13 }, 'skin'),
    s('path', { d: 'M52 82h3M60 82h3', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: heart(80, 40, 14) }, 'red')
  ],
  portavoz: [
    s('circle', { cx: 80, cy: 46, r: 14 }, 'skin'),
    s('path', { d: busts([80], 100, 46, 40) }, 'navy'),
    s('path', { d: 'M60 66l20 8 20-8', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M40 92h80l-10 46H50z' }, 'brown'),
    s('path', { d: 'M70 92l-4-18M90 92l4-18', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[66, 72], [94, 72]], 5) }, 'dark'),
    s('circle', { cx: 80, cy: 114, r: 10 }, 'yellow', { accent: true })
  ],
  probabilidad: [
    s('circle', { cx: 60, cy: 64, r: 44 }, 'sky'),
    s('path', { d: 'M60 64V20a44 44 0 0 1 38 66z' }, 'blue', { accent: true }),
    s('rect', { x: 92, y: 92, width: 46, height: 46, rx: 8, transform: 'rotate(12 115 115)' }, 'white'),
    s('rect', { x: 92, y: 92, width: 46, height: 46, rx: 8, transform: 'rotate(12 115 115)', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[104, 102], [115, 115], [126, 128]], 4) }, 'red')
  ],
  'referéndum': [
    s('rect', { x: 26, y: 84, width: 108, height: 54, rx: 4 }, 'blue'),
    s('path', { d: 'M56 84h48', ...SW(6) }, 'navy', { stroke: true }),
    ...paper(52, 18, 56, 62),
    s('path', { d: 'M62 30h14v14H62zM62 54h14v14H62z', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 36l5 5 9-12', ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M84 37h16M84 61h16', ...SW(3) }, 'gray', { stroke: true })
  ],
  valer: [
    s('path', { d: 'M40 70l18-20h44l18 20-40 50z' }, 'sky', { accent: true }),
    s('path', { d: 'M40 70h80M58 50l12 20 10-20 10 20 12-20M70 70l10 50 10-50', ...SW(2) }, 'blue', { stroke: true }),
    s('path', { d: 'M104 62q10-18 22-8', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M112 66l14-14 12 4-2 12-14 14z' }, 'yellow'),
    s('circle', { cx: 130, cy: 58, r: 3 }, 'white'),
    s('path', { d: dots([[40, 134], [64, 134], [52, 124]], 10) }, 'orange')
  ],
  vigor: [
    s('path', { d: burst(80, 76, 62, 44, 14) }, 'yellow'),
    ...person(80, 130, 'red', { accent: true }),
    s('path', { d: 'M68 92L50 54M92 92l18-38', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M74 76q6 6 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 30l-8 16h10l-6 14M132 28l-8 16h10l-6 14', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M68 130l-6 14M92 130l6 14', ...SW(7) }, 'navy', { stroke: true })
  ],
  'ampliación': [
    s('rect', { x: 18, y: 92, width: 38, height: 30, rx: 3 }, 'sky'),
    s('rect', { x: 62, y: 22, width: 80, height: 64, rx: 4 }, 'sky', { accent: true }),
    s('path', { d: 'M62 86l26-30 18 18 12-12 24 24v0H62z' }, 'green'),
    s('path', { d: 'M18 122l10-12 8 8 6-6 14 10z' }, 'green'),
    s('circle', { cx: 122, cy: 40, r: 8 }, 'yellow'),
    s('path', { d: 'M48 86l22-22M58 64h12v12', ...SW(5) }, 'orange', { stroke: true })
  ],
  'balón': [
    s('ellipse', { cx: 80, cy: 142, rx: 36, ry: 4 }, 'gray'),
    s('circle', { cx: 80, cy: 78, r: 56 }, 'white'),
    s('path', { d: wedge(80, 78, 56, -90, -30) }, 'red', { accent: true }),
    s('path', { d: wedge(80, 78, 56, 30, 90) }, 'blue'),
    s('path', { d: wedge(80, 78, 56, 150, 210) }, 'yellow'),
    s('circle', { cx: 80, cy: 78, r: 56, ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 78, r: 8 }, 'white')
  ],
  barrera: [
    ground(),
    s('path', { d: 'M38 136l14-80M122 136l-14-80', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 20, y: 52, width: 120, height: 18, rx: 3 }, 'white'),
    s('rect', { x: 20, y: 82, width: 120, height: 18, rx: 3 }, 'white'),
    s('path', { d: 'M28 52h14l-14 18zM56 52h16L58 70H42zM86 52h16L88 70H72zM116 52h16l-14 18h-16zM28 82h14l-14 18zM56 82h16L58 100H42zM86 82h16L88 100H72zM116 82h16l-14 18h-16z' }, 'orange', { accent: true }),
    s('path', { d: 'M20 52h120v18H20zM20 82h120v18H20z', ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 38, r: 9 }, 'red')
  ],
  bronce: [
    s('path', { d: 'M46 14h22l12 40-16 6zM114 14H92L80 54l16 6z' }, 'blue'),
    s('circle', { cx: 80, cy: 98, r: 42 }, 'brown', { accent: true }),
    s('circle', { cx: 80, cy: 98, r: 30 }, 'tan'),
    s('path', { d: star(80, 98, 18) }, 'brown'),
    s('path', { d: 'M58 76q8-8 18-10', ...SW(3) }, 'cream', { stroke: true })
  ],
  'cadáver': [
    ground(138),
    s('path', { d: 'M60 14h40l16 30-10 92H54L44 44z' }, 'brown', { accent: true }),
    s('path', { d: 'M64 24h32l11 22-8 80H61l-8-80z' }, 'tan'),
    s('path', { d: 'M120 136V104', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: leaflet(120, 126, -150, 18, 6) }, 'green'),
    s('path', { d: dots([[120, 92]], 10) }, 'white'),
    s('path', { d: ring(120, 92, 10), ...SW(2) }, 'gray', { stroke: true })
  ],
  caracterizar: [
    s('circle', { cx: 80, cy: 80, r: 46 }, 'skin'),
    s('path', { d: 'M34 70q0-46 46-46t46 46q-10-24-46-24T34 70z' }, 'dark'),
    s('path', { d: ring(62, 76, 12) + ring(98, 76, 12) + 'M74 76h12', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 104q12-12 24-2q12-10 24 2q-12 4-24-2q-12 6-24 2z' }, 'brown', { accent: true }),
    s('path', { d: sparkle(130, 106, 9) + sparkle(28, 112, 7) }, 'yellow'),
    s('path', { d: 'M70 118q10 6 20 0', ...SW(3) }, 'red', { stroke: true })
  ],
  colaborador: [
    s('path', { d: busts([46, 114], 140, 50, 46) }, 'blue'),
    s('path', { d: dots([[46, 62], [114, 62]], 18) }, 'skin'),
    s('path', { d: 'M62 104h12q0-10 6-10t6 10h12v28H62z' }, 'yellow', { accent: true }),
    s('path', { d: rects([[34, 108, 16, 10], [102, 108, 16, 10]]) }, 'white'),
    s('path', { d: 'M40 56h4M50 56h4M108 56h4M118 56h4M40 68q6 4 12 0M108 68q6 4 12 0', ...SW(2.5) }, 'dark', { stroke: true })
  ],
  destacado: [
    s('path', { d: rects([[22, 80, 16, 52], [44, 80, 16, 52], [100, 80, 16, 52], [122, 80, 16, 52]]) }, 'gray'),
    s('path', { d: 'M22 80l8-14 8 14zM44 80l8-14 8 14zM100 80l8-14 8 14zM122 80l8-14 8 14z' }, 'tan'),
    s('rect', { x: 70, y: 46, width: 20, height: 86 }, 'yellow', { accent: true }),
    s('path', { d: 'M70 46l10-22 10 22z' }, 'tan'),
    s('path', { d: 'M76 32l4-8 4 8z' }, 'dark'),
    s('path', { d: sparkle(56, 34, 8) + sparkle(106, 30, 8) }, 'orange'),
    ground(132)
  ],
  'determinación': [
    s('path', { d: 'M14 138L146 54v84z' }, 'green'),
    s('circle', { cx: 112, cy: 50, r: 22 }, 'gray'),
    ...lean(72, 112, 40, 'red', { accent: true }),
    s('path', { d: 'M92 76l14-6M86 88l16-4', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M62 112l-14 8M72 112l-10 14', ...SW(6) }, 'navy', { stroke: true })
  ],
  enfrentamiento: [
    s('path', { d: burst(80, 74, 26, 12, 10) }, 'yellow'),
    s('path', { d: 'M20 60h32a18 18 0 0 1 0 36H20z' }, 'red', { accent: true }),
    s('path', { d: 'M140 60h-32a18 18 0 0 0 0 36h32z' }, 'blue'),
    s('path', { d: rects([[14, 62, 8, 32], [138, 62, 8, 32]]) }, 'white'),
    s('path', { d: 'M40 62v-8M120 62v-8M36 112l-8 8M124 112l8 8', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[12, 60, 12, 36], [136, 60, 12, 36]]), ...SW(2) }, 'gray', { stroke: true })
  ],
  'engañar': [
    s('circle', { cx: 74, cy: 70, r: 38 }, 'dark'),
    s('path', { d: 'M94 40q36 0 36 34q0 34-36 34q-26 0-26-34t26-34z' }, 'white', { accent: true }),
    s('path', { d: 'M94 40q36 0 36 34q0 34-36 34q-26 0-26-34t26-34z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M82 66q5-6 10 0M106 66q5-6 10 0M84 86q14 14 30 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 108l-6 34', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M44 78l8-4M48 92q6 4 12 0', ...SW(3) }, 'yellow', { stroke: true })
  ],
  enseguida: [
    s('rect', { x: 78, y: 16, width: 16, height: 12, rx: 3 }, 'dark'),
    s('circle', { cx: 86, cy: 84, r: 54 }, 'red', { accent: true }),
    s('circle', { cx: 86, cy: 84, r: 44 }, 'white'),
    s('path', { d: 'M86 84V50M86 84l20 12', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 64h16M10 84h16M14 104h16', ...SW(5) }, 'orange', { stroke: true })
  ],
  estatua: [
    s('rect', { x: 46, y: 108, width: 68, height: 30, rx: 2 }, 'tan'),
    s('rect', { x: 40, y: 102, width: 80, height: 10, rx: 2 }, 'brown'),
    s('circle', { cx: 80, cy: 34, r: 14 }, 'gray', { accent: true }),
    s('rect', { x: 64, y: 50, width: 32, height: 52, rx: 10 }, 'gray'),
    s('path', { d: 'M94 58l22-36', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 18l14 2-2 12z' }, 'gray'),
    s('path', { d: 'M54 124h52', ...SW(3) }, 'brown', { stroke: true })
  ],
  feminista: [
    ...lady(56, 138, 'purple', { accent: true }),
    s('path', { d: 'M64 96l24-24', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M84 70l30-24v44z' }, 'orange'),
    s('rect', { x: 78, y: 62, width: 10, height: 16, rx: 3 }, 'dark'),
    s('path', { d: 'M124 48q8 20 0 40M134 40q12 28 0 56', ...SW(4) }, 'purple', { stroke: true })
  ],
  ferrocarril: [
    s('path', { d: 'M70 14L30 146M90 14l40 132', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M66 34h28M60 56h40M52 82h56M42 112h76M32 142h96', ...SW(8) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M70 14L30 146M90 14l40 132', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M136 30v70', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 128, y: 18, width: 16, height: 28, rx: 6 }, 'dark'),
    s('path', { d: dots([[136, 26]], 4) }, 'red'),
    s('path', { d: dots([[136, 38]], 4) }, 'green')
  ],
  finalizar: [
    s('path', { d: 'M36 140V18', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 40, y: 22, width: 96, height: 64 }, 'white'),
    s('path', { d: rects([[40, 22, 16, 16], [72, 22, 16, 16], [104, 22, 16, 16], [56, 38, 16, 16], [88, 38, 16, 16], [120, 38, 16, 16], [40, 54, 16, 16], [72, 54, 16, 16], [104, 54, 16, 16], [56, 70, 16, 16], [88, 70, 16, 16], [120, 70, 16, 16]]) }, 'black', { accent: true }),
    s('rect', { x: 40, y: 22, width: 96, height: 64, ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 36, cy: 16, r: 6 }, 'yellow')
  ],
  ignorar: [
    s('path', { d: bubble(14, 22, 58, 40) }, 'sky'),
    s('path', { d: 'M28 38h30M28 48h20', ...SW(3) }, 'blue', { stroke: true }),
    ...person(108, 136, 'green', { accent: true }),
    s('path', { d: 'M110 78h10M116 88q-4-3-8 0', ...SW(2.5) }, 'dark', { stroke: true }),
    s('path', { d: 'M94 100l-4-28', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: dots([[90, 68]], 6) }, 'skin'),
    ground()
  ],
  inclusive: [
    s('ellipse', { cx: 80, cy: 90, rx: 64, ry: 44 }, 'mint'),
    s('path', { d: ells([[80, 90, 64, 44]]), ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: busts([40], 116, 20, 22) + dots([[40, 88]], 9) }, 'red'),
    s('path', { d: busts([66], 116, 20, 22) + dots([[66, 88]], 9) }, 'blue'),
    s('path', { d: busts([92], 116, 20, 22) + dots([[92, 88]], 9) }, 'orange'),
    s('path', { d: busts([118], 116, 20, 22) + dots([[118, 88]], 9) }, 'purple'),
    s('path', { d: 'M100 36q20-14 30 6', ...SW(4) }, 'green', { stroke: true })
  ],
  interpretar: [
    s('path', { d: bubble(14, 18, 50, 40) }, 'sky'),
    s('path', { d: 'M96 18h42a8 8 0 0 1 8 8v24a8 8 0 0 1-8 8h-6v12l-12-12H96a8 8 0 0 1-8-8V26a8 8 0 0 1 8-8z' }, 'yellow'),
    s('path', { d: dots([[30, 38], [48, 38]], 6) }, 'blue'),
    s('path', { d: 'M104 44l8-14 8 14zM122 44l8-14 8 14z' }, 'orange'),
    ...person(80, 138, 'purple', { accent: true }),
    s('path', { d: 'M66 84a14 14 0 0 1 28 0', ...SW(4) }, 'dark', { stroke: true }),
    arrow('M52 70l14 10M108 70l-14 10', 'gray', 3)
  ],
  legislatura: [
    s('path', { d: 'M18 118a62 62 0 0 1 124 0z' }, 'cream'),
    s('path', { d: dots(seats(56, 11), 5) }, 'blue'),
    s('path', { d: dots(seats(40, 8), 5) }, 'orange'),
    s('path', { d: dots(seats(24, 5), 5) }, 'green'),
    s('rect', { x: 64, y: 106, width: 32, height: 26, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  'manipulación': [
    s('path', { d: 'M48 26h64M80 14v24', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M62 10q18-8 36 4l-4 10q-14-6-28-2z' }, 'skin'),
    s('path', { d: 'M48 26l-6 76M112 26l6 76M80 38v36', ...SW(1.5) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 66, r: 11 }, 'skin'),
    s('rect', { x: 68, y: 78, width: 24, height: 34, rx: 8 }, 'red', { accent: true }),
    s('path', { d: 'M70 84l-28 18M90 84l28 18M74 110l-6 28M86 110l6 28', ...SW(6) }, 'orange', { stroke: true })
  ],
  'mecánico': [
    ground(),
    ...person(64, 136, 'blue', { accent: true }),
    s('path', { d: 'M54 92h20v44', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M52 66q12-14 24 0z' }, 'red'),
    s('path', { d: 'M78 100l30-30', ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 62a10 10 0 1 1 14 14l-6-2-2-6z' }, 'gray'),
    ...gear(118, 118, 10, 7, 'dark'),
    s('path', { d: dots([[50, 114]], 4) }, 'dark')
  ],
  nazi: [
    backdrop('dark'),
    s('path', { d: 'M14 126h132', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 120l8-8 8 8 8-8 8 8 8-8 8 8 8-8 8 8 8-8 8 8 8-8 8 8 8-8 8 8', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 98q0-58 44-58t40 54l8 10H90l-6-8H44z' }, 'gray', { accent: true }),
    s('path', { d: 'M48 88h72', ...SW(3) }, 'black', { stroke: true })
  ],
  operar: [
    s('path', { d: 'M50 18h60l-10 18H60z' }, 'gray'),
    s('path', { d: 'M62 36h36', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M80 18V8', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 70, r: 14 }, 'skin'),
    s('path', { d: 'M66 64q14-20 28 0z' }, 'green'),
    s('rect', { x: 68, y: 70, width: 24, height: 12, rx: 4 }, 'sky'),
    s('path', { d: busts([80], 140, 52, 52) }, 'green', { accent: true }),
    s('path', { d: 'M104 112l24-14', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 116l10-6', ...SW(6) }, 'white', { stroke: true })
  ],
  'orgánico': [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'mint'),
    s('circle', { cx: 80, cy: 80, r: 60, ...DASH(4, '6 6') }, 'green', { stroke: true }),
    s('path', { d: leaflet(70, 110, -60, 64, 22) }, 'green', { accent: true }),
    s('path', { d: 'M70 110l30-52M70 110l-10 18', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: leaflet(74, 104, -150, 30, 10) }, 'green')
  ],
  paralelo: [
    s('path', { d: 'M24 120L112 32', ...SW(10) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M48 136l88-88', ...SW(10) }, 'red', { stroke: true }),
    s('path', { d: 'M100 32h16v16M124 48h16v16', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M54 80l14 14M78 56l14 14', ...DASH(3, '3 4') }, 'gray', { stroke: true })
  ],
  pariente: [
    s('path', { d: 'M80 140V70M80 100L44 70M80 96l36-26M80 70V40M60 56L80 70l20-14', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: ells([[80, 56, 60, 40]]) }, 'green'),
    s('path', { d: dots([[80, 32], [46, 64], [114, 64], [62, 86], [98, 86]], 11) }, 'skin'),
    s('path', { d: dots([[80, 32]], 5) }, 'red', { accent: true }),
    s('path', { d: 'M60 140h40', ...SW(5) }, 'brown', { stroke: true })
  ],
  patente: [
    ...paper(20, 26, 96, 112),
    s('path', { d: 'M34 104h50M34 118h40', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 68, cy: 58, r: 20 }, 'yellow', { accent: true }),
    s('path', { d: 'M60 76h16v12H60z' }, 'gray'),
    s('path', { d: rays(68, 58, 24, 32, 7, 200), ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M108 112l-8 32 12-6 8 10 4-34zM124 112l8 32-12-6' }, 'red'),
    s('circle', { cx: 116, cy: 110, r: 16 }, 'red')
  ],
  perdonar: [
    ground(),
    ...person(36, 136, 'blue'),
    ...person(124, 136, 'orange'),
    s('path', { d: 'M46 100l14-12M114 100l-14-12', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 62, 22) }, 'red', { accent: true }),
    s('path', { d: 'M70 44l22 22', ...SW(8) }, 'cream', { stroke: true }),
    s('path', { d: 'M72 52l6-6M80 60l6-6', ...SW(1.5) }, 'tan', { stroke: true })
  ],
  procedente: [
    ground(136),
    s('path', { d: 'M14 136h60', ...DASH(4, '10 6') }, 'dark', { stroke: true }),
    s('path', { d: 'M26 132q40-6 66-58', ...DASH(3, '4 6') }, 'gray', { stroke: true }),
    s('circle', { cx: 26, cy: 128, r: 7 }, 'red'),
    s('path', { d: 'M90 74l40-40c6-6 14 2 8 8l-40 40z', transform: 'rotate(0)' }, 'white'),
    s('path', { d: 'M90 74l40-40c6-6 14 2 8 8l-40 40zM104 64l-30-6-6 6 26 12M114 74l6 30 6-6-2-28', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M104 64l-30-6-6 6 26 12zM114 74l6 30 6-6-2-28z' }, 'sky', { accent: true })
  ],
  prometer: [
    ground(),
    ...person(76, 136, 'navy'),
    s('path', { d: 'M90 100l20-26V40', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 102, y: 22, width: 16, height: 24, rx: 7 }, 'skin'),
    s('path', { d: 'M62 104q8-6 14-10', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: heart(70, 102, 10) }, 'red', { accent: true }),
    s('path', { d: sparkle(130, 30, 9) + sparkle(42, 50, 7) }, 'yellow')
  ],
  'proporción': [
    s('path', { d: 'M20 136V94h28v42z' }, 'blue'),
    s('path', { d: 'M66 136V52h56v84z' }, 'blue', { accent: true }),
    s('path', { d: 'M20 136L48 94M66 136L122 52', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M14 136L140 22', ...DASH(2, '4 4') }, 'gray', { stroke: true }),
    s('path', { d: 'M20 146h28M66 146h56', ...SW(4) }, 'orange', { stroke: true })
  ],
  'públicamente': [
    s('path', { d: halfRays(110, 36, 18, 26, 6), ...SW(3) }, 'yellow', { stroke: true }),
    s('circle', { cx: 110, cy: 36, r: 12 }, 'yellow'),
    s('rect', { x: 18, y: 88, width: 70, height: 14, rx: 2 }, 'brown'),
    ...person(52, 88, 'red', { h: 34, w: 24, r: 11, accent: true }),
    s('path', { d: 'M64 62l18-8v24l-18-8z' }, 'gray'),
    s('path', { d: busts([28, 58, 88, 118], 146, 24, 24) + dots([[28, 114], [58, 114], [88, 114], [118, 114]], 9) }, 'dark'),
    s('path', { d: 'M88 56q8 8 0 16M96 50q12 14 0 28', ...SW(3) }, 'orange', { stroke: true })
  ],
  retirada: [
    ground(),
    s('path', { d: 'M126 80V40a20 20 0 0 0-40 0v4', ...SW(7) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M76 34l10 12 10-12', ...SW(7) }, 'orange', { stroke: true }),
    ...person(60, 136, 'green', { h: 36, w: 24, r: 11 }),
    ...person(96, 136, 'green', { h: 36, w: 24, r: 11 }),
    s('path', { d: 'M20 112h20M14 124h20', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[54, 80], [90, 80]], 2.5) }, 'dark')
  ],
  saga: [
    ground(138),
    s('path', { d: rects([[18, 40, 22, 98], [44, 40, 22, 98], [70, 40, 22, 98], [96, 40, 22, 98]]) }, 'navy'),
    s('path', { d: star(29, 62, 7) + star(55, 62, 7) + star(81, 62, 7) + star(107, 62, 7) }, 'yellow', { accent: true }),
    s('path', { d: 'M18 112h100M18 120h100', ...SW(2) }, 'yellow', { stroke: true }),
    s('path', { d: 'M126 138l14-112', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M122 112h18', ...SW(5) }, 'brown', { stroke: true })
  ],
  supervivencia: [
    s('path', { d: 'M14 112l20-20h36l6 20 8-20h46l16 20v34H14z' }, 'gray'),
    s('path', { d: 'M76 112l4 34', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M78 112q0-30 2-54', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: leaflet(80, 76, -150, 30, 11) + leaflet(80, 64, -30, 32, 12) }, 'green', { accent: true }),
    s('circle', { cx: 124, cy: 36, r: 16 }, 'yellow')
  ],
  teclado: [
    s('rect', { x: 14, y: 50, width: 132, height: 64, rx: 8 }, 'dark'),
    s('path', { d: rects([18, 32, 46, 60, 74, 88, 102, 116, 130].map(x => [x, 56, 11, 11]).concat([22, 36, 50, 64, 78, 92, 106, 120].map(x => [x, 72, 11, 11]))) }, 'white'),
    s('path', { d: rects([26, 40, 54, 98, 112, 126].map(x => [x, 88, 11, 11])) }, 'white'),
    s('rect', { x: 66, y: 88, width: 30, height: 11, rx: 2 }, 'blue', { accent: true }),
    s('path', { d: 'M80 50V36q0-14 20-14h30', ...SW(4) }, 'gray', { stroke: true })
  ],
  temer: [
    s('path', { d: 'M90 136V60a26 26 0 0 1 52 0v76l-9-8-8 8-9-8-8 8-9-8z' }, 'dark'),
    s('path', { d: dots([[106, 60], [126, 60]], 5) }, 'yellow'),
    ...person(48, 136, 'sky', { accent: true }),
    s('path', { d: dots([[44, 76], [54, 76]], 3) + ells([[49, 86, 4, 3]]) }, 'dark'),
    s('path', { d: 'M24 70l-6 4 6 4-6 4M72 70l6 4-6 4 6 4', ...SW(2.5) }, 'gray', { stroke: true }),
    s('path', { d: drop(36, 64, 4) }, 'blue')
  ],
  tribu: [
    s('path', { d: 'M62 132l36-14M62 118l36 14', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 124q-16-10-6-32q2 12 8 8q-2-14 8-24q4 18 8 28q4 14-10 20z' }, 'orange', { accent: true }),
    s('path', { d: 'M82 124q-8-8 0-18q4 8 8 6q2 8-8 12z' }, 'yellow'),
    s('path', { d: busts([28, 132], 136, 24, 30) + dots([[28, 96], [132, 96]], 10) }, 'green'),
    s('path', { d: busts([52, 108], 110, 20, 22) + dots([[52, 80], [108, 80]], 9) }, 'red'),
    s('path', { d: 'M40 26l20-20 20 20zM100 34l16-16 16 16z' }, 'tan')
  ],
  usualmente: [
    s('path', { d: 'M80 22a58 58 0 1 1-50 30', ...SW(7) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M18 40l12 12 14-8', ...SW(7) }, 'green', { stroke: true }),
    s('path', { d: 'M54 66h46v34a18 18 0 0 1-18 18h-10a18 18 0 0 1-18-18z' }, 'red'),
    s('path', { d: 'M100 74q16 0 14 14t-14 10', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M68 58q-6-8 0-14M84 58q-6-8 0-14', ...SW(3) }, 'gray', { stroke: true })
  ],
  variable: [
    s('circle', { cx: 50, cy: 52, r: 24 }, 'yellow', { accent: true }),
    s('path', { d: rays(50, 52, 30, 38, 8), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: ells([[104, 104, 20, 14], [122, 98, 16, 14], [118, 112, 20, 10]]) }, 'gray'),
    s('path', { d: 'M100 126l-4 10M114 126l-4 10M128 126l-4 10', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M94 36q30 0 34 34m-10-6l10 8 8-10M66 124q-30 0-34-34m10 6l-10-8-8 10', ...SW(4) }, 'orange', { stroke: true })
  ],
  acento: [
    ...person(40, 138, 'orange', { accent: true }),
    s('path', { d: 'M48 80q4 2 6 0', ...SW(2.5) }, 'dark', { stroke: true }),
    s('path', { d: bubble(66, 18, 80, 62) }, 'sky'),
    s('path', { d: 'M76 50q8-16 16 0t16 0 16 0 12-4', ...SW(4) }, 'blue', { stroke: true }),
    ...note(104, 108, 'purple'),
    ...note(132, 122, 'pink')
  ],
  ampliar: [
    s('rect', { x: 42, y: 14, width: 76, height: 132, rx: 12 }, 'dark'),
    s('rect', { x: 48, y: 26, width: 64, height: 106, rx: 4 }, 'sky'),
    s('path', { d: 'M48 132V96l22-24 18 20 10-10 14 14v36z' }, 'green'),
    s('path', { d: dots([[70, 64], [92, 88]], 9) }, 'skin', { accent: true }),
    s('path', { d: 'M62 56l-16-16M46 52V40h12M100 96l16 16M116 100v12h-12', ...SW(5) }, 'orange', { stroke: true })
  ],
  apropiado: [
    s('path', { d: 'M18 40h50v16a10 10 0 0 0 0 20v16H18zM142 40H92v16a10 10 0 0 1 0 20v16h50z' }, 'blue'),
    s('path', { d: 'M68 40h24v16a10 10 0 0 0 0 20v16H68V76a10 10 0 0 0 0-20z' }, 'yellow', { accent: true }),
    s('path', { d: 'M18 40h124v52H18z', ...SW(3) }, 'navy', { stroke: true }),
    s('circle', { cx: 80, cy: 122, r: 18 }, 'green'),
    s('path', { d: 'M71 122l6 6 12-12', ...SW(5) }, 'white', { stroke: true })
  ],
  'armonía': [
    s('path', { d: 'M14 120q15-10 30 0t30 0 30 0 30 0 12-4v26H14z' }, 'sky'),
    s('path', { d: 'M18 64h70', ...SW(5) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 52, cy: 50, rx: 16, ry: 12 }, 'blue', { accent: true }),
    s('circle', { cx: 64, cy: 40, r: 8 }, 'blue'),
    s('path', { d: 'M71 38l8 3-8 3z' }, 'orange'),
    ...note(100, 52, 'purple'),
    ...note(128, 76, 'green'),
    s('path', { d: leaflet(30, 64, 120, 18, 6) + leaflet(82, 64, 60, 18, 6) }, 'green')
  ],
  atraer: [
    s('path', { d: 'M40 20v50a40 40 0 0 0 80 0V20', ...SW(22, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M40 20v14M120 20v14', ...SW(22, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 134l10-18M80 140v-20M112 134l-10-18', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 132h10M74 140h12M106 132h10', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 108q-6 8 0 16M130 108q6 8 0 16', ...SW(3) }, 'orange', { stroke: true })
  ]
};
