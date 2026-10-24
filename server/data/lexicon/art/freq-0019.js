// Illustration specs for common words, batches 0018, 0019 and 0020 (see server/scripts/lexicon/art.js)
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

module.exports = {
  nombrar: [
    ground(),
    s('path', { d: 'M58 22h70a10 10 0 0 1 10 10v26a10 10 0 0 1-10 10H84l-14 12v-12H58a10 10 0 0 1-10-10V32a10 10 0 0 1 10-10z' }, 'sky'),
    s('path', { d: 'M76 34h40v20H76l-10-10z' }, 'yellow', { accent: true }),
    s('circle', { cx: 75, cy: 44, r: 3 }, 'white'),
    ...person(44, 136, 'blue'),
    ...person(116, 136, 'green'),
    s('rect', { x: 106, y: 100, width: 20, height: 14, rx: 2 }, 'white'),
    s('path', { d: 'M106 102h20', ...SW(4) }, 'red', { stroke: true })
  ],
  rabia: [
    s('path', { d: burst(80, 84, 64, 48, 14) }, 'orange'),
    s('circle', { cx: 80, cy: 84, r: 42 }, 'red', { accent: true }),
    s('path', { d: 'M54 64l20 10M106 64l-20 10', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[66, 82], [94, 82]], 5) }, 'white'),
    s('rect', { x: 60, y: 98, width: 40, height: 14, rx: 3 }, 'white'),
    s('path', { d: 'M60 105h40M70 98v14M80 98v14M90 98v14', ...SW(2) }, 'dark', { stroke: true })
  ],
  semilla: [
    s('circle', { cx: 128, cy: 32, r: 12 }, 'yellow'),
    s('path', { d: 'M14 104q66-16 132 0v34H14z' }, 'brown'),
    s('path', { d: ells([[36, 122, 7, 4], [60, 130, 7, 4], [104, 126, 7, 4], [128, 118, 7, 4]]) }, 'tan'),
    s('path', { d: 'M80 100V60', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M80 72q-26-4-30-26q24 0 30 26zM80 64q22-6 28-28q-24 2-28 28z' }, 'green'),
    s('ellipse', { cx: 80, cy: 104, rx: 14, ry: 8 }, 'tan', { accent: true })
  ],
  soporte: [
    backdrop('cream'),
    s('path', { d: ells([[72, 40, 8, 12], [88, 40, 8, 12], [80, 32, 8, 14]]) }, 'green'),
    s('path', { d: 'M66 72l-4-22h36l-4 22z' }, 'orange'),
    s('rect', { x: 26, y: 72, width: 108, height: 10, rx: 2 }, 'brown'),
    s('path', { d: 'M38 82h26L38 112zM96 82h26v30z' }, 'dark', { accent: true }),
    s('path', { d: dots([[44, 90], [116, 90]], 2.5) }, 'gray')
  ],
  sostener: [
    ground(),
    s('path', { d: 'M28 30h-8M28 44h-10M132 30h8M132 44h10', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 40, y: 22, width: 80, height: 38, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: 'M40 41h80', ...SW(3) }, 'tan', { stroke: true }),
    ...person(80, 136, 'blue'),
    s('path', { d: 'M68 98L56 60M92 98l12-38', ...SW(8) }, 'skin', { stroke: true })
  ],
  tour: [
    ground(),
    s('path', { d: 'M54 104V34', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 34h30l-6 10 6 10H56z' }, 'yellow'),
    ...person(40, 136, 'red', { accent: true }),
    s('path', { d: busts([86, 110, 134], 136, 22, 40) }, 'blue'),
    s('path', { d: dots([[86, 84], [110, 84], [134, 84]], 10) }, 'skin'),
    s('rect', { x: 102, y: 104, width: 16, height: 12, rx: 2 }, 'dark')
  ],
  aliado: [
    s('path', { d: 'M32 30h44v26q0 26-22 38q-22-12-22-38z' }, 'blue'),
    s('path', { d: 'M84 30h44v26q0 26-22 38q-22-12-22-38z' }, 'red'),
    s('path', { d: star(54, 58, 11) + star(106, 58, 11) }, 'white'),
    s('path', { d: ring(68, 120, 13) + ring(92, 120, 13), ...SW(6) }, 'yellow', { stroke: true, accent: true })
  ],
  apuesta: [
    backdrop('green'),
    s('path', { d: 'M28 82v36a20 7 0 0 0 40 0V82z' }, 'red', { accent: true }),
    s('ellipse', { cx: 48, cy: 82, rx: 20, ry: 7 }, 'pink'),
    s('path', { d: 'M28 94h40M28 106h40', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M82 100v18a20 7 0 0 0 40 0V100z' }, 'blue'),
    s('ellipse', { cx: 102, cy: 100, rx: 20, ry: 7 }, 'sky'),
    s('rect', { x: 94, y: 26, width: 34, height: 34, rx: 6, transform: 'rotate(15 111 43)' }, 'white'),
    s('path', { d: dots([[104, 36], [111, 43], [118, 50]], 3.5) }, 'dark')
  ],
  avanzar: [
    ground(),
    s('path', { d: 'M14 84h14M18 100h12M14 116h14', ...SW(4) }, 'gray', { stroke: true }),
    ...lean(56, 136, 15, 'blue', { accent: true }),
    s('path', { d: ells([[100, 128, 8, 4], [126, 120, 8, 4]]) }, 'tan'),
    arrow('M84 66h52m-16-16l16 16-16 16', 'orange', 8)
  ],
  'añadir': [
    s('path', { d: 'M74 34q12-14 26-6q-12 14-26 6z' }, 'green'),
    s('path', { d: dots([[64, 56], [94, 64]], 8) }, 'orange'),
    s('path', { d: 'M118 26v28M104 40h28', ...SW(8) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M26 100h-10M134 100h10', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 92h100v28a14 14 0 0 1-14 14H44a14 14 0 0 1-14-14z' }, 'dark'),
    s('rect', { x: 24, y: 86, width: 112, height: 10, rx: 4 }, 'gray')
  ],
  captura: [
    s('path', { d: 'M28 140L70 92', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: 'M74 38l40 52M66 56l50 28M70 82l40-40M86 96l30-48', ...SW(1.5) }, 'gray', { stroke: true }),
    s('path', { d: ells([[86, 58, 10, 12], [102, 58, 10, 12], [88, 74, 7, 8], [100, 74, 7, 8]]) }, 'purple', { accent: true }),
    s('path', { d: 'M94 52v28', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 94, cy: 64, r: 34, ...SW(5) }, 'gray', { stroke: true })
  ],
  carnaval: [
    s('path', { d: 'M44 66q-20-30-4-50q8 26 12 48zM116 66q20-30 4-50q-8 26-12 48z' }, 'pink'),
    s('path', { d: 'M80 62q-14-28 0-48q14 20 0 48z' }, 'yellow'),
    s('path', { d: 'M30 70q50-14 100 0q-4 30-26 30q-14 0-24-12q-10 12-24 12q-22 0-26-30z' }, 'purple', { accent: true }),
    s('path', { d: ells([[56, 78, 10, 6], [104, 78, 10, 6]]) }, 'cream'),
    s('path', { d: dots([[24, 120], [60, 128], [100, 122], [136, 116], [40, 108]], 4) }, 'red'),
    s('path', { d: rects([[78, 108, 6, 6], [120, 132, 6, 6], [24, 136, 6, 6]]) }, 'blue'),
    s('path', { d: 'M48 140q10-14 20 0t20 0', ...SW(3) }, 'green', { stroke: true })
  ],
  'comprensión': [
    s('path', { d: busts([100], 146, 64, 42) }, 'green'),
    s('circle', { cx: 100, cy: 64, r: 36 }, 'skin'),
    s('circle', { cx: 100, cy: 60, r: 16 }, 'yellow', { accent: true }),
    s('path', { d: 'M92 60l6 6 12-12', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M14 74q11-6 22 0q11-6 22 0v28q-11-6-22 0q-11-6-22 0z' }, 'red'),
    s('path', { d: 'M36 74v28', ...SW(2) }, 'white', { stroke: true }),
    arrow('M36 64q2-26 24-30m-8-8l8 8-8 8', 'orange', 4)
  ],
  'convención': [
    s('rect', { x: 14, y: 16, width: 132, height: 64, rx: 6 }, 'navy'),
    s('rect', { x: 30, y: 22, width: 100, height: 14, rx: 3 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 50, r: 7 }, 'skin'),
    s('path', { d: 'M68 80l4-22h16l4 22z' }, 'brown'),
    s('path', { d: busts([26, 50, 74, 98, 122], 112, 20, 16) }, 'blue'),
    s('path', { d: dots([[26, 92], [50, 92], [74, 92], [98, 92], [122, 92]], 8) }, 'skin'),
    s('path', { d: busts([38, 62, 86, 110, 134], 140, 20, 16) }, 'red'),
    s('path', { d: dots([[38, 120], [62, 120], [86, 120], [110, 120], [134, 120]], 8) }, 'skin')
  ],
  convocatoria: [
    s('rect', { x: 40, y: 64, width: 10, height: 20, rx: 3 }, 'dark'),
    s('path', { d: 'M28 44h16l40-22v64L44 64H28z' }, 'red', { accent: true }),
    s('path', { d: 'M96 36q10 18 0 36M108 26q16 28 0 56', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: busts([40, 70, 100, 130], 146, 22, 26) }, 'blue'),
    s('path', { d: dots([[40, 110], [70, 110], [100, 110], [130, 110]], 10) }, 'skin')
  ],
  creador: [
    ground(),
    s('path', { d: 'M92 136l20-96M136 136l-20-96', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 84, y: 40, width: 60, height: 52, rx: 2 }, 'white'),
    outline({ x: 84, y: 40, width: 60, height: 52, rx: 2 }),
    s('path', { d: star(114, 66, 18) }, 'yellow', { accent: true }),
    ...person(44, 136, 'purple'),
    s('path', { d: 'M56 102l22-24', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M76 80l8-9', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: sparkle(64, 38, 10) }, 'orange')
  ],
  dedicar: [
    s('path', { d: heart(80, 66, 26) }, 'red', { accent: true }),
    s('path', { d: 'M24 98q0 40 56 40q56 0 56-40q-14 10-28 10H52q-14 0-28-10z' }, 'skin'),
    s('path', { d: 'M44 114q6 6 14 6M116 114q-6 6-14 6', ...SW(3) }, 'tan', { stroke: true }),
    s('circle', { cx: 132, cy: 28, r: 12 }, 'white'),
    outline({ cx: 132, cy: 28, r: 12 }),
    s('path', { d: 'M132 21v7l5 4', ...SW(3) }, 'dark', { stroke: true })
  ],
  descubrimiento: [
    s('path', { d: 'M18 34l40-10 44 10 40-10v100l-40 10-44-10-40 10z' }, 'sky'),
    s('path', { d: 'M58 24v100M102 34v100', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M28 70q10-16 24-8q8 14-4 22q-14 4-20-14z' }, 'green'),
    s('path', { d: 'M40 102q30 10 46-12', ...DASH(3, '5 5') }, 'red', { stroke: true }),
    s('circle', { cx: 100, cy: 72, r: 24 }, 'mint'),
    s('path', { d: 'M88 76q4-14 16-12q10 8 2 16q-10 6-18-4z' }, 'green', { accent: true }),
    s('circle', { cx: 100, cy: 72, r: 24, ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M118 90l22 22', ...SW(9) }, 'dark', { stroke: true })
  ],
  'diseñado': [
    s('rect', { x: 14, y: 22, width: 132, height: 116, rx: 6 }, 'navy'),
    s('path', { d: 'M14 54h132M14 86h132M14 118h132M46 22v116M78 22v116M110 22v116', ...SW(1) }, 'blue', { stroke: true }),
    s('path', { d: 'M40 112V70l34-26 34 26v42z', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M66 112V92h16v20', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M96 130l42-48v48z' }, 'yellow', { accent: true }),
    s('path', { d: 'M116 122l12-14v14z' }, 'navy'),
    s('path', { d: 'M24 132l26-26', ...SW(6) }, 'orange', { stroke: true })
  ],
  eco: [
    backdrop('sky'),
    s('path', { d: 'M14 136l40-70 26 34 22-50 44 86z' }, 'gray'),
    s('path', { d: 'M126 64q-6 6 0 12M116 56q-10 12 0 28', ...SW(3) }, 'white', { stroke: true }),
    ...person(30, 136, 'red', { h: 24, w: 16, r: 7, accent: true }),
    s('path', { d: 'M44 98q6 6 0 12M52 92q10 12 0 24M60 86q14 18 0 36', ...SW(4) }, 'orange', { stroke: true })
  ],
  'eliminación': [
    s('rect', { x: 14, y: 110, width: 90, height: 10, rx: 3 }, 'tan'),
    s('path', { d: busts([34, 70], 110, 24, 30) }, 'blue'),
    s('path', { d: dots([[34, 72], [70, 72]], 11) }, 'skin'),
    arrow('M96 76q22 0 24 18', 'orange', 5),
    s('path', { d: busts([124], 146, 24, 30) }, 'gray'),
    s('circle', { cx: 124, cy: 108, r: 11 }, 'gray'),
    s('path', { d: 'M108 100l32 32M140 100l-32 32', ...SW(7) }, 'red', { stroke: true, accent: true })
  ],
  estima: [
    s('path', { d: sparkle(126, 44, 10) + sparkle(34, 40, 8) }, 'yellow'),
    s('path', { d: 'M24 106q56-20 112 0q4 18-4 30q-52 10-104 0q-8-12-4-30z' }, 'red'),
    s('path', { d: dots([[24, 106], [136, 106], [24, 134], [136, 134]], 5) }, 'yellow'),
    s('path', { d: 'M60 62h40l12 14-32 30-32-30z' }, 'sky', { accent: true }),
    s('path', { d: 'M48 76h64M60 62l8 14 12 30 12-30 8-14', ...SW(2) }, 'white', { stroke: true })
  ],
  excelencia: [
    s('path', { d: 'M48 14h20l18 52H66z' }, 'red'),
    s('path', { d: 'M112 14H92L74 66h20z' }, 'blue'),
    s('path', { d: 'M32 122q-12-30 4-56M128 122q12-30-4-56', ...SW(4) }, 'green', { stroke: true }),
    s('circle', { cx: 80, cy: 98, r: 34 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 98, r: 26, ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: star(80, 98, 17) }, 'orange')
  ],
  'fabricación': [
    s('path', { d: 'M30 124v14M130 124v14', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 16, y: 108, width: 128, height: 16, rx: 8 }, 'dark'),
    s('path', { d: dots([[28, 116], [56, 116], [84, 116], [112, 116], [132, 116]], 5) }, 'gray'),
    s('path', { d: rects([[22, 84, 24, 24], [58, 84, 24, 24]]) }, 'brown'),
    s('rect', { x: 100, y: 84, width: 24, height: 24 }, 'tan'),
    s('path', { d: 'M146 22H120v30l-8 14', ...SW(8) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M104 68l4 10M120 68l-4 10', ...SW(4) }, 'gray', { stroke: true })
  ],
  'financiación': [
    s('rect', { x: 20, y: 96, width: 40, height: 36 }, 'yellow', { accent: true }),
    s('path', { d: 'M20 108h40M20 120h40', ...SW(2) }, 'orange', { stroke: true }),
    s('ellipse', { cx: 40, cy: 96, rx: 20, ry: 6 }, 'orange'),
    arrow('M60 82q20-24 36-28m-12-6l12 6-6 12', 'green', 5),
    s('path', { d: 'M108 114q8 24 16 0z' }, 'orange'),
    s('path', { d: 'M104 92l-10 22h10zM128 92l10 22h-10z' }, 'red'),
    s('path', { d: 'M104 114V62q0-28 12-42q12 14 12 42v52z' }, 'gray'),
    s('circle', { cx: 116, cy: 62, r: 7 }, 'sky')
  ],
  gerente: [
    s('rect', { x: 84, y: 22, width: 58, height: 46, rx: 3 }, 'white'),
    outline({ x: 84, y: 22, width: 58, height: 46, rx: 3 }),
    s('path', { d: rects([[94, 48, 8, 14], [108, 40, 8, 22], [122, 30, 8, 32]]) }, 'green'),
    s('path', { d: busts([56], 136, 60, 56) }, 'navy'),
    s('path', { d: 'M46 80h20l-10 18z' }, 'white'),
    s('path', { d: 'M52 82h8l2 30-6 8-6-8z' }, 'red', { accent: true }),
    s('circle', { cx: 56, cy: 56, r: 18 }, 'skin'),
    s('path', { d: 'M38 54a18 18 0 0 1 36 0q-18-12-36 0z' }, 'dark'),
    s('rect', { x: 14, y: 124, width: 132, height: 14, rx: 3 }, 'brown')
  ],
  impedir: [
    ground(),
    ...person(44, 136, 'blue'),
    s('path', { d: 'M74 64v72', ...DASH(4) }, 'red', { stroke: true }),
    s('rect', { x: 100, y: 104, width: 30, height: 32, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M100 66V38M110 64V30M120 64V32M130 66V42M98 92l-12-14', ...SW(9) }, 'skin', { stroke: true }),
    s('rect', { x: 94, y: 60, width: 42, height: 46, rx: 12 }, 'skin')
  ],
  intensidad: [
    ground(),
    s('path', { d: rects([[20, 112, 18, 24], [46, 94, 18, 42]]) }, 'yellow'),
    s('path', { d: rects([[72, 74, 18, 62]]) }, 'orange'),
    s('path', { d: rects([[98, 54, 18, 82]]) }, 'red'),
    s('rect', { x: 124, y: 30, width: 18, height: 106 }, 'red', { accent: true }),
    s('path', { d: 'M134 14l-6 10h8l-6 10', ...SW(3) }, 'orange', { stroke: true })
  ],
  juzgar: [
    s('circle', { cx: 52, cy: 54, r: 16 }, 'skin'),
    s('path', { d: 'M36 50a16 16 0 0 1 32 0q-16-8-32 0z' }, 'gray'),
    s('path', { d: busts([52], 98, 50, 30) }, 'black'),
    s('path', { d: 'M46 70h12l-6 8z' }, 'white'),
    s('rect', { x: 14, y: 96, width: 132, height: 42, rx: 4 }, 'brown'),
    s('rect', { x: 84, y: 88, width: 32, height: 8, rx: 2 }, 'dark'),
    s('path', { d: 'M92 82l32-32', ...SW(6) }, 'tan', { stroke: true }),
    s('rect', { x: 104, y: 38, width: 34, height: 16, rx: 3, transform: 'rotate(45 121 46)' }, 'dark', { accent: true }),
    s('path', { d: 'M78 78l-8-6M84 70l-4-10', ...SW(3) }, 'orange', { stroke: true })
  ],
  legislativo: [
    s('path', { d: dots(seats(58, 9), 6) }, 'red'),
    s('path', { d: dots(seats(42, 7), 6) }, 'blue'),
    s('path', { d: dots(seats(26, 5), 6) }, 'green'),
    s('circle', { cx: 80, cy: 104, r: 7 }, 'skin'),
    s('rect', { x: 68, y: 112, width: 24, height: 24, rx: 2 }, 'brown', { accent: true }),
    s('path', { d: 'M14 138h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  maldito: [
    ground(),
    s('circle', { cx: 132, cy: 30, r: 12 }, 'yellow'),
    ...person(80, 136, 'blue'),
    s('path', { d: dots([[75, 76], [85, 76]], 2) }, 'dark'),
    s('path', { d: 'M74 86q6-4 12 0', ...SW(2.5) }, 'dark', { stroke: true }),
    s('path', { d: ells([[66, 34, 16, 12], [82, 26, 18, 14], [98, 36, 14, 10]]) }, 'dark', { accent: true }),
    s('path', { d: 'M68 52l-3 8M82 50l-3 8M96 52l-3 8', ...SW(3) }, 'blue', { stroke: true })
  ],
  mancha: [
    s('path', { d: 'M56 24l-36 22 12 26 14-8v72h68V64l14 8 12-26-36-22q-12 12-24 12t-24-12z' }, 'white'),
    s('path', { d: 'M56 24l-36 22 12 26 14-8v72h68V64l14 8 12-26-36-22q-12 12-24 12t-24-12z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M88 80q10-8 18 2q10 0 6 12q6 10-6 14q-4 10-16 4q-12 4-12-8q-10-8 0-16q0-10 10-8z' }, 'brown', { accent: true }),
    s('path', { d: dots([[66, 104], [118, 74], [72, 116]], 4) }, 'brown')
  ],
  obligar: [
    ground(),
    ...person(84, 136, 'blue'),
    s('path', { d: 'M66 100h36M66 114h36M66 128h36', ...SW(5) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M66 114q-24 0-48-16', ...SW(4) }, 'brown', { stroke: true }),
    arrow('M146 100h-28m10-10l-10 10 10 10', 'red', 6),
    s('path', { d: drop(104, 62, 4) }, 'sky')
  ],
  pecado: [
    s('path', { d: 'M80 52q-20-14-38 0q-16 16-8 46q10 34 46 24q36 10 46-24q8-30-8-46q-18-14-38 0z' }, 'red', { accent: true }),
    s('path', { d: dots([[126, 76], [124, 94]], 10) }, 'white'),
    s('path', { d: 'M80 52q0-16 8-24', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M86 36q16-14 28-4q-14 12-28 4z' }, 'green'),
    s('path', { d: 'M18 134q20-16 40 0t40 0t28-8', ...SW(8) }, 'green', { stroke: true }),
    s('ellipse', { cx: 130, cy: 124, rx: 9, ry: 6 }, 'green'),
    s('path', { d: 'M139 124l7-4M139 124l7 4', ...SW(2) }, 'red', { stroke: true })
  ],
  'pensión': [
    ground(),
    ...person(56, 136, 'purple'),
    s('path', { d: 'M44 76a12 12 0 0 1 24 0q-12-8-24 0z' }, 'gray'),
    s('path', { d: 'M82 136V96q0-8-8-8', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 100, y: 106, width: 36, height: 30 }, 'yellow', { accent: true }),
    s('path', { d: 'M100 116h36M100 126h36', ...SW(2) }, 'orange', { stroke: true }),
    s('ellipse', { cx: 118, cy: 106, rx: 18, ry: 5 }, 'orange'),
    s('circle', { cx: 118, cy: 78, r: 10 }, 'yellow')
  ],
  'planificación': [
    s('path', { d: 'M50 118l-10 22M110 118l10 22', ...SW(5) }, 'gray', { stroke: true }),
    ...paper(16, 22, 128, 96),
    s('path', { d: 'M54 47h27v15M94 71h27v15', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: rects([[28, 38, 26, 18], [68, 62, 26, 18]]) }, 'sky'),
    s('rect', { x: 108, y: 86, width: 26, height: 18 }, 'green', { accent: true })
  ],
  'polémica': [
    s('path', { d: 'M24 24h44a8 8 0 0 1 8 8v30a8 8 0 0 1-8 8H44l-14 14V70h-6a8 8 0 0 1-8-8V32a8 8 0 0 1 8-8z' }, 'red'),
    s('path', { d: 'M92 72h44a8 8 0 0 1 8 8v30a8 8 0 0 1-8 8h-6v14l-14-14H92a8 8 0 0 1-8-8V80a8 8 0 0 1 8-8z' }, 'blue'),
    s('path', { d: 'M28 44l8 8 8-8 8 8 8-8M96 92l8 8 8-8 8 8 8-8', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M86 30l-14 26h12l-10 28 24-34H86l10-20z' }, 'yellow', { accent: true })
  ],
  prevenir: [
    s('path', { d: 'M80 24l44 14v34q0 40-44 58q-44-18-44-58V38z' }, 'blue', { accent: true }),
    s('path', { d: 'M62 74l12 12 24-26', ...SW(8) }, 'white', { stroke: true }),
    s('path', { d: burst(24, 40, 10, 6, 8) + burst(138, 96, 10, 6, 8) + burst(26, 118, 9, 5, 8) }, 'red'),
    s('path', { d: 'M34 50l6 6M128 92l-6 0M34 112l6-4', ...SW(3) }, 'gray', { stroke: true })
  ],
  'psicología': [
    s('path', { d: 'M60 140v-24q-26-10-26-46q0-46 50-48q48 0 50 44q0 10 8 22q2 6-6 6v14q0 10-12 10h-12v22z' }, 'skin'),
    s('path', { d: ells([[70, 60, 16, 14], [90, 54, 18, 16], [98, 74, 14, 12], [74, 78, 14, 10]]) }, 'pink', { accent: true }),
    s('path', { d: 'M64 60q6-6 12 0M86 52q6 6 12 0M80 76q6-6 12 0', ...SW(2.5) }, 'red', { stroke: true })
  ],
  reflejar: [
    s('rect', { x: 14, y: 84, width: 132, height: 56, rx: 4 }, 'sky'),
    s('circle', { cx: 122, cy: 32, r: 10 }, 'yellow'),
    s('path', { d: 'M20 84l38-56 22 30 18-20 44 46z' }, 'green', { accent: true }),
    s('path', { d: 'M20 84l38 44 22-24 18 16 44-36z' }, 'mint'),
    s('path', { d: 'M28 100h20M92 118h24M60 132h20', ...SW(2) }, 'white', { stroke: true })
  ],
  'récord': [
    s('path', { d: 'M14 60h132', ...DASH(4, '8 6') }, 'gray', { stroke: true }),
    s('path', { d: burst(110, 60, 18, 8, 8) }, 'yellow'),
    s('path', { d: 'M110 134V30m-16 16l16-16 16 16', ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('rect', { x: 50, y: 62, width: 12, height: 8, rx: 2 }, 'dark'),
    s('circle', { cx: 56, cy: 100, r: 30 }, 'white'),
    outline({ cx: 56, cy: 100, r: 30 }, 'dark', 4),
    s('path', { d: 'M56 100V82M56 100l12 8', ...SW(4) }, 'dark', { stroke: true })
  ],
  socialismo: [
    s('path', { d: dots(around(80, 82, 54, 6, -90).filter((_, i) => i % 2 === 0), 12) }, 'blue'),
    s('path', { d: dots(around(80, 82, 54, 6, -90).filter((_, i) => i % 2 === 1), 12) }, 'red'),
    s('path', { d: dots(around(80, 82, 54, 6, -90), 7) }, 'skin'),
    s('circle', { cx: 80, cy: 82, r: 34 }, 'yellow', { accent: true }),
    s('path', { d: 'M80 48v68M50.6 65l58.8 34M50.6 99l58.8-34', ...SW(3) }, 'orange', { stroke: true })
  ],
  vistazo: [
    s('path', { d: 'M24 40h28M16 54h22M24 122h28', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M20 84q60-56 120 0q-60 56-120 0z' }, 'white'),
    s('path', { d: 'M20 84q60-56 120 0q-60 56-120 0z', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 110, cy: 84, r: 18 }, 'blue', { accent: true }),
    s('circle', { cx: 116, cy: 84, r: 8 }, 'black'),
    s('circle', { cx: 120, cy: 78, r: 3 }, 'white')
  ],
  visual: [
    s('rect', { x: 22, y: 16, width: 116, height: 52, rx: 4 }, 'sky'),
    s('path', { d: 'M22 68l30-34 20 22 16-14 26 26z' }, 'green'),
    s('path', { d: sparkle(124, 32, 9) }, 'yellow'),
    s('path', { d: 'M14 82h132v10l-10 32H94l-8-22h-12l-8 22H24l-10-32z' }, 'dark'),
    s('path', { d: 'M26 92h46l-8 24H34z' }, 'red', { accent: true }),
    s('path', { d: 'M88 92h46l-6 24H96z' }, 'blue')
  ],
  admitir: [
    ground(),
    s('rect', { x: 62, y: 28, width: 56, height: 108 }, 'cream'),
    s('path', { d: 'M118 28l20 8v108l-20-8z' }, 'brown'),
    s('path', { d: 'M62 136V28h56v108', ...SW(5) }, 'dark', { stroke: true }),
    ...person(90, 136, 'blue', { h: 36, w: 24, r: 10 }),
    s('circle', { cx: 34, cy: 44, r: 18 }, 'green', { accent: true }),
    s('path', { d: 'M26 44l6 6 12-12', ...SW(5) }, 'white', { stroke: true })
  ],
  agregar: [
    backdrop('mint'),
    s('path', { d: 'M30 108v16M46 108v16M70 108v16M86 108v16M114 108v16M130 108v16', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: ells([[38, 98, 20, 14], [78, 98, 20, 14], [122, 98, 18, 13]]) }, 'white'),
    s('path', { d: ells([[20, 92, 7, 9], [60, 92, 7, 9], [106, 92, 6, 8]]) }, 'dark'),
    s('path', { d: 'M120 32v28M106 46h28', ...SW(8) }, 'orange', { stroke: true, accent: true })
  ],
  ansiedad: [
    s('path', { d: 'M40 34c10-16 20 16 30 0s20 16 30 0s20 16 30 0', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 78, cy: 92, r: 44 }, 'skin'),
    s('path', { d: 'M56 76l14-6M100 76l-14-6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[64, 88], [92, 88]], 4) }, 'dark'),
    s('path', { d: 'M62 114q4-4 8 0t8 0 8 0 8 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: drop(126, 82, 7) }, 'sky', { accent: true })
  ],
  'camión': [
    s('path', { d: 'M14 132h132', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 16, y: 44, width: 84, height: 66, rx: 4 }, 'orange'),
    s('path', { d: 'M104 62h22l18 22v26h-40z' }, 'red', { accent: true }),
    s('path', { d: 'M110 68h14l12 16h-26z' }, 'sky'),
    s('path', { d: dots([[40, 114], [76, 114], [124, 114]], 13) }, 'dark'),
    s('path', { d: dots([[40, 114], [76, 114], [124, 114]], 5) }, 'gray')
  ],
  certificado: [
    s('rect', { x: 16, y: 26, width: 128, height: 92, rx: 4 }, 'cream'),
    s('rect', { x: 24, y: 34, width: 112, height: 76, rx: 2, ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M40 54h80M48 70h64M40 86h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M106 104l-10 34 10-4 6 10 8-32zM122 104l10 34-10-4-6 10-8-32z' }, 'red'),
    s('circle', { cx: 114, cy: 96, r: 16 }, 'yellow', { accent: true }),
    s('circle', { cx: 114, cy: 96, r: 9 }, 'orange')
  ],
  comentar: [
    ground(),
    ...person(44, 136, 'green'),
    s('path', { d: 'M70 24h60a12 12 0 0 1 12 12v30a12 12 0 0 1-12 12H96l-18 14V78h-8a12 12 0 0 1-12-12V36a12 12 0 0 1 12-12z' }, 'blue', { accent: true }),
    s('path', { d: dots([[82, 51], [100, 51], [118, 51]], 6) }, 'white')
  ],
  considerado: [
    ground(),
    s('rect', { x: 18, y: 26, width: 50, height: 110 }, 'cream'),
    s('path', { d: 'M18 136V26h50v110', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M68 26l26 10v94l-26 6z' }, 'brown'),
    ...person(44, 136, 'blue', { h: 40 }),
    s('rect', { x: 28, y: 92, width: 32, height: 22, rx: 2 }, 'tan'),
    ...person(120, 136, 'green'),
    s('path', { d: 'M106 104l-14-4', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(120, 38, 12) }, 'red', { accent: true })
  ],
  consumidor: [
    ground(),
    ...person(36, 136, 'orange'),
    s('path', { d: 'M46 102l18-24h6', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: rects([[80, 58, 16, 20], [102, 62, 14, 16]]) }, 'red'),
    s('path', { d: 'M66 74h72l-8 38H78z' }, 'gray', { accent: true }),
    s('path', { d: 'M78 112l-4 10h58', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[84, 128], [124, 128]], 6) }, 'dark')
  ],
  creencia: [
    s('path', { d: 'M70 54L46 136h68L90 54z' }, 'cream'),
    s('path', { d: star(80, 36, 18) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(44, 40, 9) + sparkle(118, 44, 7) }, 'orange'),
    ...person(80, 136, 'sky'),
    s('path', { d: heart(80, 106, 10) }, 'red')
  ],
  criticar: [
    s('rect', { x: 18, y: 24, width: 68, height: 56, rx: 2 }, 'brown'),
    s('rect', { x: 26, y: 32, width: 52, height: 40 }, 'sky'),
    s('path', { d: 'M30 66l14-18 10 12 8-8 12 14z' }, 'green'),
    s('rect', { x: 102, y: 54, width: 30, height: 26, rx: 3 }, 'red', { accent: true }),
    s('rect', { x: 98, y: 78, width: 38, height: 32, rx: 9 }, 'skin'),
    s('path', { d: 'M106 108v24', ...SW(11) }, 'skin', { stroke: true }),
    s('path', { d: 'M112 86h20M112 94h20M112 102h18', ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M36 118q8-12 16 0M62 118q8-12 16 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  cubano: [
    s('rect', { x: 14, y: 30, width: 132, height: 100, rx: 4 }, 'blue'),
    s('path', { d: rects([[14, 50, 132, 20], [14, 90, 132, 20]]) }, 'white'),
    s('path', { d: 'M14 34a4 4 0 0 1 4-4l70 50-70 50a4 4 0 0 1-4-4z' }, 'red', { accent: true }),
    s('path', { d: star(36, 80, 13) }, 'white'),
    s('rect', { x: 14, y: 30, width: 132, height: 100, rx: 4, ...SW(2) }, 'gray', { stroke: true })
  ],
  cubierto: [
    s('rect', { x: 14, y: 30, width: 30, height: 104, rx: 3 }, 'red', { accent: true }),
    s('circle', { cx: 86, cy: 82, r: 42 }, 'white'),
    outline({ cx: 86, cy: 82, r: 42 }),
    s('circle', { cx: 86, cy: 82, r: 28, ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M22 36v18M29 36v18M36 36v18M22 54q7 10 14 0M29 60v68', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M136 30q12 20 6 48h-6z' }, 'gray'),
    s('path', { d: 'M139 78v52', ...SW(7) }, 'dark', { stroke: true })
  ],
  delincuente: [
    backdrop('navy'),
    s('path', { d: busts([80], 140, 64, 56) }, 'white'),
    s('path', { d: 'M54 98h52M50 112h60M48 126h64', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 60, r: 20 }, 'skin'),
    s('path', { d: dots([[73, 58], [87, 58]], 2.5) }, 'dark'),
    s('path', { d: 'M74 70q6-4 12 0', ...SW(2.5) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 14v126M54 14v126M106 14v126M132 14v126M14 24h132', ...SW(6) }, 'gray', { stroke: true, accent: true })
  ],
  dependencia: [
    s('rect', { x: 94, y: 18, width: 44, height: 80, rx: 8 }, 'dark'),
    s('rect', { x: 99, y: 26, width: 34, height: 60, rx: 3 }, 'sky'),
    s('path', { d: 'M110 40h12M106 52h20M108 64h16', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: ells([[102, 106, 8, 5], [88, 112, 8, 5], [74, 118, 8, 5]]), ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 146l40-40', ...SW(18) }, 'skin', { stroke: true }),
    s('path', { d: 'M48 104l16 16', ...SW(10) }, 'gray', { stroke: true, accent: true })
  ],
  'depósito': [
    s('rect', { x: 30, y: 76, width: 100, height: 62, rx: 6 }, 'navy'),
    s('rect', { x: 56, y: 84, width: 48, height: 6, rx: 3 }, 'black'),
    s('circle', { cx: 80, cy: 114, r: 12 }, 'gray'),
    s('path', { d: 'M80 106v8', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 46, r: 16 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 46, r: 9, ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M52 32v24m-6-6l6 6 6-6M108 32v24m-6-6l6 6 6-6', ...SW(3) }, 'green', { stroke: true })
  ],
  'desafío': [
    ground(),
    s('path', { d: 'M100 54l-6-20 14 12zM128 52l8-18 2 20z' }, 'cream'),
    s('path', { d: 'M78 136q-4-70 36-90q32 10 32 90z' }, 'green'),
    s('path', { d: dots([[104, 72], [124, 72]], 5) }, 'yellow'),
    s('path', { d: 'M100 92l4 8 4-8 4 8 4-8 4 8 4-8z' }, 'white'),
    ...person(36, 136, 'blue', { h: 34, w: 22, r: 10, accent: true }),
    s('path', { d: 'M48 104l20-30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M44 98l10 8', ...SW(4) }, 'brown', { stroke: true })
  ],
  destinado: [
    ground(),
    s('path', { d: star(80, 36, 14) + star(54, 26, 6) + star(108, 28, 7) }, 'yellow'),
    ...person(36, 136, 'blue'),
    ...person(124, 136, 'pink'),
    s('path', { d: 'M50 112q20 30 30-10t30 10', ...SW(3) }, 'red', { stroke: true, accent: true })
  ],
  embarazado: [
    ground(),
    s('path', { d: 'M66 136v-10M82 136v-10', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M62 58h24q30 18 26 46q-2 12-14 16l4 8H60l2-8q-10-30 0-62z' }, 'pink', { accent: true }),
    s('circle', { cx: 74, cy: 42, r: 14 }, 'skin'),
    s('path', { d: 'M60 42a14 14 0 0 1 28 0q-14-10-28 0z' }, 'brown'),
    s('path', { d: 'M74 70q14 18 24 26', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(104, 96, 7) }, 'red')
  ],
  gravedad: [
    ground(),
    s('rect', { x: 28, y: 60, width: 14, height: 76 }, 'brown'),
    s('path', { d: ells([[36, 42, 24, 22], [62, 48, 22, 18]]) }, 'green'),
    ...person(100, 136, 'blue'),
    s('circle', { cx: 100, cy: 36, r: 9 }, 'red', { accent: true }),
    s('path', { d: 'M100 50v10', ...DASH(3, '3 4') }, 'red', { stroke: true }),
    s('path', { d: 'M84 60l-6-6M116 60l6-6', ...SW(3) }, 'orange', { stroke: true })
  ],
  herencia: [
    ground(),
    ...person(32, 136, 'purple'),
    s('path', { d: 'M20 76a12 12 0 0 1 24 0q-12-8-24 0z' }, 'gray'),
    ...person(128, 136, 'orange', { h: 30, w: 22, r: 10 }),
    s('rect', { x: 62, y: 104, width: 36, height: 32, rx: 3 }, 'brown'),
    s('path', { d: 'M62 104q18-18 36 0z' }, 'brown'),
    s('rect', { x: 76, y: 108, width: 8, height: 12, rx: 2 }, 'yellow', { accent: true }),
    arrow('M50 66q30-24 60 0m-12-2l12 2-2-12', 'orange', 4)
  ],
  'innovación': [
    s('path', { d: sparkle(26, 44, 10) + sparkle(134, 44, 10) }, 'orange'),
    s('path', { d: 'M80 18a40 40 0 0 1 22 73v13H58V91A40 40 0 0 1 80 18z' }, 'yellow', { accent: true }),
    s('path', { d: rects([[60, 108, 40, 8], [64, 120, 32, 8]]) }, 'gray'),
    s('path', { d: 'M70 132h20l-4 6h-12z' }, 'dark'),
    ...gear(80, 60, 11, 8, 'orange')
  ],
  'invasión': [
    ground(),
    s('path', { d: 'M64 56L36 132h88L96 56z' }, 'cream'),
    s('path', { d: rects([[30, 108, 30, 28], [100, 108, 30, 28]]) }, 'tan'),
    s('path', { d: 'M26 110l19-18 19 18zM96 110l19-18 19 18z' }, 'red'),
    s('ellipse', { cx: 80, cy: 38, rx: 18, ry: 14 }, 'sky'),
    s('ellipse', { cx: 80, cy: 48, rx: 50, ry: 12 }, 'gray', { accent: true }),
    s('path', { d: dots([[50, 50], [70, 52], [90, 52], [110, 50]], 4) }, 'yellow'),
    s('path', { d: ells([[132, 22, 12, 4], [28, 26, 10, 3]]) }, 'gray')
  ],
  magnitud: [
    s('rect', { x: 14, y: 30, width: 132, height: 100, rx: 6 }, 'cream'),
    s('path', { d: 'M14 55h132M14 80h132M14 105h132', ...SW(1.5) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 80h16l4-6 4 10 4-8 4 6l6-40 8 76 8-64 6 50 6-30 4 16 4-8h22', ...SW(3) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M134 40v80m-6-72l6-8 6 8m-12 64l6 8 6-8', ...SW(3) }, 'blue', { stroke: true })
  ],
  medicamento: [
    s('rect', { x: 24, y: 50, width: 56, height: 84, rx: 8 }, 'orange'),
    s('rect', { x: 20, y: 32, width: 64, height: 20, rx: 4 }, 'gray'),
    s('rect', { x: 30, y: 72, width: 44, height: 36, rx: 3 }, 'white'),
    s('path', { d: 'M52 80v20M42 90h20', ...SW(6) }, 'red', { stroke: true }),
    s('rect', { x: 92, y: 90, width: 48, height: 20, rx: 10, transform: 'rotate(-30 116 100)' }, 'blue', { accent: true }),
    s('path', { d: 'M111 91l10 18', ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 114, cy: 132, r: 9 }, 'pink')
  ],
  monumento: [
    s('path', { d: 'M24 124v-20M136 124v-20', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: dots([[24, 96], [136, 96]], 12) }, 'green'),
    s('path', { d: 'M68 112l4-80 8-12 8 12 4 80z' }, 'tan', { accent: true }),
    s('path', { d: 'M80 20l8 12 4 80H80z' }, 'brown'),
    s('path', { d: rects([[34, 124, 92, 14], [46, 112, 68, 12]]) }, 'gray'),
    s('path', { d: 'M14 138h132', ...SW(3) }, 'gray', { stroke: true })
  ],
  'observación': [
    backdrop('navy'),
    s('path', { d: star(118, 36, 8) + star(136, 62, 5) + star(92, 26, 4) + star(40, 32, 5) }, 'yellow'),
    s('path', { d: 'M72 78l-24 58M72 78l24 58M72 78v58', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 94l66-38', ...SW(16) }, 'sky', { stroke: true, accent: true }),
    s('path', { d: 'M34 98l-8 4', ...SW(8) }, 'dark', { stroke: true }),
    s('circle', { cx: 72, cy: 76, r: 5 }, 'dark')
  ],
  'olímpico': [
    s('path', { d: 'M80 14q24 22 14 46q-6 10-14 10q-8 0-14-10q-10-24 14-46z' }, 'orange', { accent: true }),
    s('path', { d: 'M80 34q12 14 6 28q-6 6-12 0q-6-14 6-28z' }, 'cream'),
    s('path', { d: 'M66 86h28l-8 54h-12z' }, 'gray'),
    s('path', { d: 'M54 68h52l-8 20H62z' }, 'yellow'),
    s('path', { d: 'M70 100h20M72 114h16', ...SW(3) }, 'dark', { stroke: true })
  ],
  'plástico': [
    s('path', { d: 'M44 46v-12h20v12q14 6 14 20v66a6 6 0 0 1-6 6H36a6 6 0 0 1-6-6V66q0-14 14-20z' }, 'sky', { accent: true }),
    s('rect', { x: 42, y: 22, width: 24, height: 12, rx: 3 }, 'blue'),
    s('rect', { x: 30, y: 80, width: 48, height: 24 }, 'blue'),
    s('path', { d: 'M38 70v54', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M102 62q0-22 8-22t8 22M120 62q0-22 8-22t8 22', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M92 60h52l4 76H88z' }, 'mint'),
    s('path', { d: 'M92 60h52l4 76H88z', ...SW(2) }, 'green', { stroke: true })
  ],
  'portugués': [
    s('rect', { x: 14, y: 30, width: 132, height: 100, rx: 4 }, 'red'),
    s('path', { d: 'M18 30h48v100H18a4 4 0 0 1-4-4V34a4 4 0 0 1 4-4z' }, 'green'),
    s('circle', { cx: 66, cy: 80, r: 22 }, 'yellow', { accent: true }),
    s('path', { d: 'M56 68h20v16q0 12-10 14q-10-2-10-14z' }, 'white'),
    s('path', { d: 'M61 73h10v10q0 6-5 8q-5-2-5-8z' }, 'red'),
    s('path', { d: dots([[66, 81]], 2.5) }, 'blue')
  ],
  protocolo: [
    s('path', { d: 'M68 60h24l34 80H34z' }, 'red', { accent: true }),
    s('path', { d: 'M24 138v-34M44 112v-28M116 112v-28M136 138v-34', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M24 106q6 0 20-20M136 106q-6 0-20-20', ...SW(4) }, 'purple', { stroke: true }),
    s('path', { d: dots([[24, 104], [44, 84], [116, 84], [136, 104]], 5) }, 'yellow'),
    ...person(80, 60, 'navy', { h: 24, w: 18, r: 8 }),
    s('path', { d: 'M76 40l4 3 4-3v6l-4-3-4 3z' }, 'red')
  ],
  provocar: [
    s('path', { d: 'M14 24h80', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M70 24v12', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: ells([[70, 50, 22, 14], [70, 70, 26, 14], [70, 90, 20, 12]]) }, 'yellow', { accent: true }),
    s('ellipse', { cx: 70, cy: 76, rx: 6, ry: 5 }, 'dark'),
    s('path', { d: 'M146 130L88 86', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: ells([[112, 52, 6, 4], [128, 72, 6, 4], [36, 106, 6, 4], [100, 36, 6, 4]]) }, 'orange'),
    s('path', { d: dots([[112, 47], [128, 67], [36, 101], [100, 31]], 3) }, 'sky'),
    s('path', { d: 'M24 72l-6-4M24 84h-8M118 86l6 2', ...SW(3) }, 'dark', { stroke: true })
  ],
  reporte: [
    s('rect', { x: 30, y: 20, width: 100, height: 122, rx: 6 }, 'brown'),
    s('rect', { x: 38, y: 32, width: 84, height: 104, rx: 2 }, 'white'),
    s('rect', { x: 62, y: 14, width: 36, height: 14, rx: 4 }, 'gray'),
    s('path', { d: 'M48 44h56', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: rects([[48, 74, 12, 22], [66, 62, 12, 34], [84, 52, 12, 44]]) }, 'blue', { accent: true }),
    s('path', { d: 'M48 96h62', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 110h62M48 122h46', ...SW(4) }, 'gray', { stroke: true })
  ],
  residente: [
    ground(),
    s('rect', { x: 26, y: 22, width: 76, height: 114, rx: 3 }, 'tan'),
    s('path', { d: rects([[36, 32, 14, 16], [57, 32, 14, 16], [78, 32, 14, 16], [36, 56, 14, 16], [78, 56, 14, 16], [36, 80, 14, 16], [57, 80, 14, 16], [78, 80, 14, 16]]) }, 'sky'),
    s('rect', { x: 57, y: 56, width: 14, height: 16 }, 'yellow', { accent: true }),
    s('rect', { x: 54, y: 106, width: 20, height: 30, rx: 2 }, 'brown'),
    ...person(124, 136, 'green', { h: 36, w: 24, r: 10 }),
    s('path', { d: 'M134 106l8-16', ...SW(5) }, 'skin', { stroke: true })
  ],
  rival: [
    ground(),
    s('path', { d: 'M48 106l12-6M112 106l-12-6', ...SW(6) }, 'skin', { stroke: true }),
    ...person(36, 136, 'red'),
    ...person(124, 136, 'blue'),
    s('path', { d: dots([[62, 98], [98, 98]], 7) }, 'skin'),
    s('path', { d: 'M38 74l8 3M122 74l-8 3', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: burst(80, 66, 20, 9, 8) }, 'yellow', { accent: true })
  ],
  sello: [
    s('rect', { x: 30, y: 24, width: 100, height: 112, rx: 2 }, 'white'),
    s('rect', { x: 30, y: 24, width: 100, height: 112, ...DASH(8, '0.1 10') }, 'gray', { stroke: true }),
    s('rect', { x: 42, y: 36, width: 76, height: 88, rx: 2 }, 'sky'),
    s('circle', { cx: 98, cy: 58, r: 10 }, 'yellow'),
    s('path', { d: 'M42 124l26-40 18 24 12-14 20 30z' }, 'green', { accent: true }),
    s('path', { d: 'M14 70q10-6 20 0t20 0M14 84q10-6 20 0t20 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  semejante: [
    s('path', { d: 'M40 50q-6 20-16 36q-8 30 16 36q24-6 16-36q-10-16-16-36z' }, 'green', { accent: true }),
    s('path', { d: 'M120 50q-6 20-16 36q-8 30 16 36q24-6 16-36q-10-16-16-36z' }, 'green'),
    s('path', { d: 'M40 50q2-10 8-14M120 50q2-10 8-14', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M66 80q7-6 14 0t14 0M66 94q7-6 14 0t14 0', ...SW(5) }, 'orange', { stroke: true })
  ],
  solicitar: [
    ...paper(20, 22, 80, 112),
    s('path', { d: rects([[30, 36, 10, 10], [30, 60, 10, 10], [30, 84, 10, 10]]) }, 'sky'),
    s('path', { d: 'M48 41h40M48 65h40M48 89h30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M72 124l28-28', ...SW(6) }, 'blue', { stroke: true }),
    s('rect', { x: 114, y: 72, width: 22, height: 40, rx: 3 }, 'orange', { accent: true }),
    s('path', { d: 'M116 48V30M124 46V24M132 48V30', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 112, y: 42, width: 26, height: 32, rx: 8 }, 'skin')
  ],
  solucionar: [
    s('path', { d: rects([[24, 44, 48, 48]]) + dots([[72, 68]], 9) }, 'blue'),
    s('path', { d: rects([[72, 44, 48, 48]]) + dots([[96, 92]], 9) }, 'green'),
    s('path', { d: rects([[24, 92, 48, 44]]) + dots([[48, 92]], 9) }, 'yellow'),
    s('rect', { x: 72, y: 92, width: 48, height: 44, ...DASH(3, '5 5') }, 'gray', { stroke: true }),
    s('path', { d: rects([[100, 12, 36, 28]]) }, 'orange', { accent: true }),
    arrow('M138 50q4 26-18 38m2-12l-2 12 12 2', 'dark', 4)
  ],
  suicidio: [
    ground(),
    s('path', { d: 'M48 136V82q0-22-18-24', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots([[28, 66], [36, 72], [22, 74]], 6) }, 'gray'),
    s('path', { d: ells([[64, 132, 6, 3]]) }, 'gray'),
    s('rect', { x: 94, y: 76, width: 30, height: 60, rx: 3 }, 'cream'),
    s('rect', { x: 94, y: 76, width: 30, height: 60, rx: 3, ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M109 76v-8', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: drop(109, 56, 7) }, 'orange', { accent: true })
  ],
  'síntoma': [
    s('circle', { cx: 80, cy: 82, r: 46 }, 'skin'),
    s('path', { d: 'M48 46q32-18 64 0l-4 10H52z' }, 'blue'),
    s('path', { d: dots([[56, 94], [104, 94]], 8) }, 'pink'),
    s('path', { d: 'M58 74q6 4 12 0M90 74q6 4 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M88 106l40 18', ...SW(7) }, 'gray', { stroke: true }),
    s('circle', { cx: 88, cy: 106, r: 5 }, 'red', { accent: true }),
    s('path', { d: drop(126, 62, 6) }, 'sky')
  ],
  trayectoria: [
    ground(),
    s('path', { d: 'M24 130Q80-10 136 130', ...DASH(4, '2 9') }, 'gray', { stroke: true }),
    s('ellipse', { cx: 136, cy: 134, rx: 12, ry: 4 }, 'red'),
    s('circle', { cx: 24, cy: 130, r: 6 }, 'blue'),
    s('path', { d: 'M84 64l-8-4M88 76l-10-2', ...SW(3) }, 'orange', { stroke: true }),
    s('circle', { cx: 108, cy: 78, r: 10 }, 'orange', { accent: true })
  ],
  tumba: [
    s('path', { d: 'M48 128V60a32 32 0 0 1 64 0v68z' }, 'gray', { accent: true }),
    s('path', { d: 'M64 72h32M64 86h32M70 100h20', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 124q66-10 132 0v14H14z' }, 'green'),
    s('path', { d: dots([[38, 120], [124, 120], [132, 112]], 6) }, 'pink'),
    s('path', { d: dots([[38, 120], [124, 120], [132, 112]], 2.5) }, 'yellow')
  ],
  'utilización': [
    ...gear(60, 96, 22, 10, 'gray'),
    s('circle', { cx: 60, cy: 96, r: 8 }, 'dark'),
    s('path', { d: 'M74 82l52-52', ...SW(12) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M124 22a14 14 0 1 0 10 10l-8 2-4-4z' }, 'blue'),
    arrow('M20 60q-2-26 24-34m-12-4l12 4-4 12', 'orange', 4)
  ],
  vencer: [
    s('path', { d: rects([[16, 112, 40, 26], [104, 120, 40, 18]]) }, 'blue'),
    s('rect', { x: 56, y: 96, width: 48, height: 42 }, 'yellow', { accent: true }),
    s('path', { d: busts([36], 112, 20, 24) + busts([124], 120, 20, 24) }, 'gray'),
    s('path', { d: dots([[36, 82], [124, 90]], 9) }, 'skin'),
    s('path', { d: 'M70 70l-12-20M90 70l12-20', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 68, y: 64, width: 24, height: 32, rx: 8 }, 'red'),
    s('circle', { cx: 80, cy: 52, r: 11 }, 'skin'),
    s('path', { d: star(80, 26, 10) }, 'yellow')
  ],
  agradecer: [
    ground(),
    ...person(132, 136, 'blue', { w: 24 }),
    ...lean(52, 136, 40, 'green', { accent: true }),
    s('path', { d: heart(104, 42, 12) }, 'red'),
    s('path', { d: heart(80, 30, 6) }, 'pink')
  ],
  ampliamente: [
    s('path', { d: 'M80 108V32M72 110L32 52M88 110l40-58M68 116L24 98M92 116l44-18', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: dots([[80, 28], [30, 48], [130, 48], [20, 96], [140, 96]], 6) }, 'sky'),
    s('path', { d: 'M18 132q62-20 124 0', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 118, r: 12 }, 'orange', { accent: true })
  ],
  aporte: [
    s('path', { d: rects([[18, 112, 40, 22], [60, 112, 40, 22], [102, 112, 40, 22], [18, 88, 40, 22], [60, 88, 40, 22]]) }, 'red'),
    s('rect', { x: 102, y: 88, width: 40, height: 22, ...DASH(3, '5 4') }, 'gray', { stroke: true }),
    s('rect', { x: 102, y: 28, width: 40, height: 22, rx: 2 }, 'orange', { accent: true }),
    arrow('M122 56v22m-8-8l8 8 8-8', 'green', 4),
    s('path', { d: 'M96 30q-14 0-14 16', ...SW(8) }, 'skin', { stroke: true })
  ],
  'aéreo': [
    backdrop('sky'),
    s('path', { d: ells([[40, 36, 16, 8], [54, 32, 14, 10], [112, 120, 18, 8], [126, 116, 14, 10]]) }, 'white'),
    s('path', { d: 'M70 82L56 52h12l26 30zM70 86L50 118h14l30-32z' }, 'blue', { accent: true }),
    s('path', { d: 'M24 84q0-8 12-8h80q20 0 28 8q-8 8-28 8H36q-12 0-12-8z' }, 'white'),
    s('path', { d: 'M30 78l-8-20h10l14 20z' }, 'red'),
    s('path', { d: dots([[60, 84], [72, 84], [84, 84], [96, 84], [108, 84]], 2.5) }, 'navy')
  ],
  bloqueo: [
    s('path', { d: 'M60 24h40l44 114H16z' }, 'gray'),
    s('path', { d: 'M80 30v104', ...DASH(4, '10 10') }, 'white', { stroke: true }),
    s('path', { d: ells([[60, 102, 28, 22], [100, 106, 26, 20], [80, 84, 22, 18]]) }, 'brown', { accent: true }),
    s('path', { d: 'M24 138l9-28 9 28zM118 138l9-28 9 28z' }, 'orange'),
    s('path', { d: 'M28 126h10M122 126h10', ...SW(3) }, 'white', { stroke: true })
  ],
  'capacitación': [
    ...paper(18, 18, 96, 60),
    s('path', { d: 'M30 66l20-14 16 8 30-28', ...SW(4) }, 'green', { stroke: true }),
    ...person(132, 136, 'orange', { h: 40, w: 24, r: 10, accent: true }),
    s('path', { d: 'M122 100l-12-30', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: busts([30, 60, 90], 146, 24, 24) }, 'navy'),
    s('path', { d: dots([[30, 112], [60, 112], [90, 112]], 10) }, 'skin')
  ],
  'carbón': [
    s('path', { d: dots([[50, 52], [90, 44], [118, 56]], 3) }, 'orange'),
    s('path', { d: 'M40 118l-10 22M120 118l10 22M80 124v16', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 84h124q-4 40-62 40q-58 0-62-40z' }, 'dark'),
    s('path', { d: 'M28 86l8-16 16 2 6 14zM56 86l8-20 16-2 8 22zM88 86l4-16 18-4 8 20zM116 86l6-14 14 4 2 10z' }, 'black'),
    s('path', { d: 'M40 82l6-6 6 6zM70 80l8-8 4 8zM102 80l8-8 4 8z' }, 'orange', { accent: true })
  ],
  cobrar: [
    s('path', { d: 'M106 74v10', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 84, y: 46, width: 46, height: 30, rx: 3 }, 'dark'),
    s('rect', { x: 90, y: 52, width: 34, height: 12, rx: 2 }, 'mint'),
    s('path', { d: 'M24 82h112l6 50H18z' }, 'gray'),
    s('path', { d: rects([[34, 90, 12, 8], [52, 90, 12, 8], [70, 90, 12, 8], [34, 104, 12, 8], [52, 104, 12, 8], [70, 104, 12, 8]]) }, 'white'),
    s('rect', { x: 24, y: 118, width: 112, height: 12, rx: 2 }, 'dark'),
    s('rect', { x: 26, y: 34, width: 48, height: 26, rx: 3, transform: 'rotate(-10 50 47)' }, 'green', { accent: true }),
    s('circle', { cx: 50, cy: 47, r: 7 }, 'mint')
  ],
  comedia: [
    s('path', { d: 'M126 36q14 10 6 30M34 36q-14 10-6 30', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M34 30q46-14 92 0q4 60-46 92q-50-32-46-92z' }, 'yellow', { accent: true }),
    s('path', { d: 'M48 58q10-12 20 0q-10 6-20 0zM92 58q10-12 20 0q-10 6-20 0z' }, 'dark'),
    s('path', { d: 'M54 78q26 30 52 0q-26 10-52 0z' }, 'dark'),
    s('path', { d: sparkle(24, 112, 8) + sparkle(136, 112, 8) }, 'orange')
  ],
  competir: [
    ground(),
    s('path', { d: 'M136 136V40', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M134 40h-22v18h22z' }, 'white'),
    s('path', { d: rects([[112, 40, 6, 6], [124, 40, 6, 6], [118, 46, 6, 6], [130, 46, 4, 6], [112, 52, 6, 6], [124, 52, 6, 6]]) }, 'dark'),
    s('path', { d: 'M14 84h14M16 100h12M14 116h14', ...SW(4) }, 'gray', { stroke: true }),
    ...lean(52, 136, 18, 'blue'),
    ...lean(94, 136, 18, 'red', { accent: true })
  ],
  completar: [
    s('rect', { x: 18, y: 100, width: 124, height: 24, rx: 12 }, 'green', { accent: true }),
    s('path', { d: 'M48 104v16M78 104v16M108 104v16', ...SW(2) }, 'mint', { stroke: true }),
    s('circle', { cx: 80, cy: 56, r: 28 }, 'green'),
    s('path', { d: 'M66 56l10 10 18-18', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: sparkle(30, 40, 9) + sparkle(130, 40, 9) }, 'yellow')
  ],
  contribuir: [
    s('path', { d: 'M16 22l30 10M144 18l-30 10', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: dots([[56, 44], [104, 38]], 8) }, 'yellow', { accent: true }),
    s('path', { d: 'M44 70h72v60a8 8 0 0 1-8 8H52a8 8 0 0 1-8-8z' }, 'sky'),
    s('path', { d: dots([[62, 126], [80, 128], [98, 126], [70, 112], [90, 114]], 9) }, 'yellow'),
    s('rect', { x: 40, y: 62, width: 80, height: 10, rx: 4 }, 'gray'),
    s('path', { d: heart(80, 88, 8) }, 'red')
  ],
  cuota: [
    s('rect', { x: 20, y: 22, width: 80, height: 50, rx: 6 }, 'navy'),
    s('rect', { x: 20, y: 32, width: 80, height: 8 }, 'dark'),
    s('rect', { x: 30, y: 50, width: 14, height: 10, rx: 2 }, 'yellow'),
    s('path', { d: 'M104 50q32 6 24 50', ...DASH(3, '4 6') }, 'gray', { stroke: true }),
    s('path', { d: dots([[40, 118], [80, 118], [120, 118]], 14) }, 'yellow', { accent: true }),
    s('path', { d: ring(40, 118, 8) + ring(80, 118, 8) + ring(120, 118, 8), ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M60 100v36M100 100v36', ...DASH(2, '4 4') }, 'gray', { stroke: true })
  ],
  defensor: [
    s('path', { d: 'M36 44v92M56 44v92M76 44v92M96 44v92M116 44v92M16 64h128M16 84h128M16 104h128M16 124h128', ...SW(1) }, 'gray', { stroke: true }),
    s('path', { d: 'M16 136V44h128v92', ...SW(5) }, 'dark', { stroke: true }),
    ...person(80, 136, 'green', { accent: true }),
    s('path', { d: 'M68 98L46 70M92 98l22-28', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: dots([[46, 70], [114, 70]], 7) }, 'orange'),
    s('circle', { cx: 126, cy: 30, r: 10 }, 'white'),
    outline({ cx: 126, cy: 30, r: 10 }, 'dark', 3)
  ],
  'desempeño': [
    s('path', { d: 'M26 110a54 54 0 0 1 27-46.8', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true }),
    s('path', { d: 'M53 63.2a54 54 0 0 1 54 0', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'yellow', { stroke: true }),
    s('path', { d: 'M107 63.2a54 54 0 0 1 27 46.8', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M80 110l36-30', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 110, r: 9 }, 'dark'),
    s('rect', { x: 20, y: 126, width: 120, height: 10, rx: 5 }, 'gray')
  ],
  'dimensión': [
    s('path', { d: 'M34 62l26-26h60l-26 26z' }, 'sky'),
    s('path', { d: 'M94 62l26-26v60l-26 26z' }, 'navy'),
    s('rect', { x: 34, y: 62, width: 60, height: 60 }, 'blue', { accent: true }),
    s('path', { d: 'M34 134h60M34 128v12M94 128v12M22 62v60M16 62h12M16 122h12M128 104l18-18M124 100l8 8M142 82l8 8', ...SW(3) }, 'orange', { stroke: true })
  ],
  eficaz: [
    s('circle', { cx: 72, cy: 86, r: 52 }, 'red'),
    s('circle', { cx: 72, cy: 86, r: 36 }, 'white'),
    s('circle', { cx: 72, cy: 86, r: 20 }, 'red'),
    s('circle', { cx: 72, cy: 86, r: 8 }, 'yellow', { accent: true }),
    s('path', { d: 'M72 86l56-48', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M120 40l6-18 6 12 12 6-18 6z' }, 'green')
  ],
  'estadístico': [
    s('circle', { cx: 50, cy: 56, r: 32 }, 'blue'),
    s('path', { d: 'M50 56V24a32 32 0 0 1 32 32z' }, 'orange', { accent: true }),
    s('path', { d: rects([[96, 90, 12, 42], [114, 70, 12, 62], [132, 50, 12, 82]]) }, 'green'),
    s('path', { d: 'M22 120l20-16 16 8 24-20', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M16 134h130', ...SW(3) }, 'dark', { stroke: true })
  ],
  'fiscalía': [
    s('path', { d: 'M20 40h40l8 10h72v84H20z' }, 'brown'),
    s('rect', { x: 30, y: 44, width: 70, height: 80, rx: 2 }, 'white'),
    s('path', { d: 'M40 58h50M40 70h50', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M20 80h120v54H20z' }, 'tan'),
    s('circle', { cx: 100, cy: 88, r: 22 }, 'sky', { accent: true }),
    s('circle', { cx: 100, cy: 88, r: 22, ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M116 104l22 22', ...SW(9) }, 'dark', { stroke: true })
  ],
  florido: [
    s('path', { d: 'M34 122V80M62 122V62M90 122V74M118 122V58', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M14 118q66-12 132 0v20H14z' }, 'green'),
    s('path', { d: dots([...around(34, 74, 8, 5), ...around(90, 68, 8, 5)], 7) }, 'pink'),
    s('path', { d: dots([...around(62, 54, 8, 5), ...around(118, 50, 8, 5)], 7) }, 'red', { accent: true }),
    s('path', { d: dots([[34, 74], [90, 68], [62, 54], [118, 50]], 5) }, 'yellow'),
    s('path', { d: dots([[22, 112], [48, 110], [76, 112], [104, 110], [134, 112]], 4) }, 'purple')
  ],
  griego: [
    backdrop('sky'),
    s('path', { d: 'M22 58L80 26l58 32z' }, 'cream'),
    s('rect', { x: 24, y: 56, width: 112, height: 10 }, 'tan', { accent: true }),
    s('path', { d: rects([[34, 66, 12, 46], [58, 66, 12, 46], [90, 66, 12, 46], [114, 66, 12, 46]]) }, 'white'),
    s('path', { d: rects([[26, 112, 108, 8], [20, 120, 120, 8]]) }, 'gray'),
    s('path', { d: 'M14 136h132', ...SW(6) }, 'blue', { stroke: true })
  ],
  herrero: [
    s('path', { d: 'M60 70l-10-10M70 64l-4-14M112 70l10-8M108 58l6-12', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M36 88h84q-2 12-24 14v16h14v12H56v-12h14v-16q-30-2-34-14z' }, 'dark'),
    s('rect', { x: 60, y: 80, width: 42, height: 8, rx: 3 }, 'orange', { accent: true }),
    s('path', { d: 'M126 24L96 62', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 80, y: 52, width: 28, height: 16, rx: 2, transform: 'rotate(-38 94 60)' }, 'gray')
  ],
  hueso: [
    backdrop('mint'),
    s('path', { d: rects([[44, 70, 72, 20]]) + dots([[42, 66], [42, 94], [118, 66], [118, 94]], 14), transform: 'rotate(-30 80 80)' }, 'cream', { accent: true }),
    s('path', { d: ells([[30, 128, 5, 4], [44, 122, 5, 4], [124, 30, 5, 4], [136, 40, 5, 4]]) }, 'green')
  ],
  'ladrón': [
    s('path', { d: 'M58 108l-10 28M70 108l12 28', ...SW(7) }, 'dark', { stroke: true }),
    s('rect', { x: 50, y: 64, width: 28, height: 48, rx: 9 }, 'navy'),
    s('path', { d: 'M92 56q30 6 30 40q0 20-24 20t-22-20q0-28 16-40z' }, 'tan', { accent: true }),
    s('path', { d: 'M74 70l18-12', ...SW(5) }, 'skin', { stroke: true }),
    s('circle', { cx: 64, cy: 46, r: 16 }, 'skin'),
    s('path', { d: 'M48 42a16 16 0 0 1 32 0z' }, 'dark'),
    s('rect', { x: 46, y: 40, width: 36, height: 10, rx: 5 }, 'black'),
    s('path', { d: dots([[58, 45], [70, 45]], 2.5) }, 'white')
  ],
  logro: [
    s('path', { d: 'M14 138l50-80 16 20 22-38 44 98z' }, 'gray'),
    s('path', { d: 'M90 58l12-18 12 18-6 4-6-6-6 6z' }, 'white'),
    s('path', { d: 'M102 40V14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M104 14h22l-6 6 6 6h-22z' }, 'red', { accent: true }),
    s('path', { d: sparkle(40, 34, 9) + sparkle(134, 50, 7) }, 'yellow')
  ],
  manifiesto: [
    s('rect', { x: 46, y: 118, width: 68, height: 20, rx: 2 }, 'brown'),
    ...person(80, 118, 'blue', { h: 36, w: 26, r: 11 }),
    s('path', { d: 'M70 86L48 58M90 86l22-28', ...SW(5) }, 'skin', { stroke: true }),
    s('rect', { x: 40, y: 16, width: 80, height: 40, rx: 2 }, 'cream'),
    s('path', { d: rects([[34, 12, 8, 48], [118, 12, 8, 48]]) }, 'tan'),
    s('path', { d: 'M50 26h60M50 36h60M50 46h40', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 106, cy: 46, r: 5 }, 'red', { accent: true })
  ],
  merced: [
    s('path', { d: 'M100 14h40L106 124H64z' }, 'cream'),
    s('path', { d: 'M146 14l-28 34', ...SW(16) }, 'blue', { stroke: true }),
    s('path', { d: 'M122 44L96 72', ...SW(10) }, 'skin', { stroke: true }),
    s('circle', { cx: 94, cy: 74, r: 9 }, 'skin'),
    s('path', { d: 'M44 98h24l4 22h20v16H44z' }, 'gray'),
    s('circle', { cx: 56, cy: 84, r: 12 }, 'skin'),
    s('path', { d: 'M64 102l18-18', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: heart(118, 98, 9) }, 'pink', { accent: true })
  ],
  miseria: [
    s('rect', { x: 30, y: 70, width: 100, height: 62, rx: 8 }, 'brown'),
    s('rect', { x: 38, y: 64, width: 84, height: 12, rx: 4 }, 'dark'),
    s('path', { d: 'M38 122h84', ...DASH(2, '4 4') }, 'tan', { stroke: true }),
    s('path', { d: ells([[72, 36, 12, 8], [90, 36, 12, 8]]) }, 'gray'),
    s('path', { d: 'M81 28v18', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[60, 54], [100, 50], [96, 60]], 2) }, 'gray'),
    s('circle', { cx: 124, cy: 140, r: 6 }, 'yellow', { accent: true })
  ],
  paginar: [
    s('path', { d: 'M14 48q33-10 66 4q33-14 66-4v86q-33-10-66 4q-33-14-66-4z' }, 'blue'),
    s('path', { d: 'M20 44q30-8 58 6v80q-28-12-58-6zM140 44q-30-8-58 6v80q28-12 58-6z' }, 'white'),
    s('path', { d: 'M30 64q20-4 40 4M30 80q20-4 40 4M30 96q20-4 40 4M90 68q20-8 40-4M90 84q20-8 40-4M90 100q20-8 40-4', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[32, 116], [116, 116], [128, 116]], 4) }, 'red', { accent: true })
  ],
  peruano: [
    s('rect', { x: 14, y: 30, width: 132, height: 100, rx: 4 }, 'red'),
    s('rect', { x: 58, y: 30, width: 44, height: 100 }, 'white'),
    s('path', { d: 'M86 92V62h8l2 8h-4v22z' }, 'brown'),
    s('ellipse', { cx: 78, cy: 94, rx: 14, ry: 9 }, 'brown', { accent: true }),
    s('path', { d: 'M70 100v14M76 100v14M84 100v14M90 100v14', ...SW(3) }, 'brown', { stroke: true }),
    s('rect', { x: 14, y: 30, width: 132, height: 100, rx: 4, ...SW(2) }, 'gray', { stroke: true })
  ],
  previsto: [
    s('rect', { x: 22, y: 36, width: 116, height: 102, rx: 6 }, 'white'),
    outline({ x: 22, y: 36, width: 116, height: 102, rx: 6 }),
    s('path', { d: 'M22 42a6 6 0 0 1 6-6h104a6 6 0 0 1 6 6v18H22z' }, 'red'),
    s('path', { d: 'M48 26v18M112 26v18', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[40, 76], [62, 76], [84, 76], [106, 76], [40, 98], [62, 98], [106, 98], [40, 120], [62, 120], [84, 120]], 5) }, 'gray'),
    s('circle', { cx: 84, cy: 98, r: 11, ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M78 98l4 4 8-8', ...SW(3) }, 'green', { stroke: true })
  ],
  razonable: [
    s('path', { d: 'M80 30v96M56 136h48', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 44h100', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M34 44l-12 40M34 44l12 40M126 44l-12 40M126 44l12 40', ...SW(1.5) }, 'gray', { stroke: true }),
    s('path', { d: 'M20 84h28a14 10 0 0 1-28 0zM112 84h28a14 10 0 0 1-28 0z' }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 28, r: 7 }, 'orange')
  ],
  referente: [
    backdrop('navy'),
    s('path', { d: 'M92 38l50-14v30zM68 38L18 24v30z' }, 'yellow'),
    s('path', { d: 'M14 124q16-6 33 0t33 0 33 0 33 0v14H14z' }, 'blue'),
    s('path', { d: 'M44 126q8-14 36-14t36 14z' }, 'gray'),
    s('path', { d: 'M64 114l6-66h20l6 66z' }, 'white'),
    s('path', { d: 'M66 94h28l1 14H65zM68 64h24l1 14H67z' }, 'red'),
    s('rect', { x: 68, y: 32, width: 24, height: 16 }, 'yellow', { accent: true }),
    s('path', { d: 'M64 32l16-14 16 14z' }, 'red')
  ],
  respirar: [
    s('path', { d: 'M80 20v36M80 56l-14 14M80 56l14 14', ...SW(7) }, 'pink', { stroke: true }),
    s('path', { d: 'M70 58q-36 4-42 50q-2 26 18 26q22 0 24-20zM90 58q36 4 42 50q2 26-18 26q-22 0-24-20z' }, 'pink', { accent: true }),
    s('path', { d: 'M62 76l-12 20M56 90l-14 6M98 76l12 20M104 90l14 6', ...SW(2) }, 'red', { stroke: true }),
    arrow('M34 18q20 0 34 14m-10 0h10v-10', 'sky', 4),
    arrow('M126 18q-20 0-34 14m10 0h-10v-10', 'sky', 4)
  ],
  'revés': [
    s('rect', { x: 22, y: 50, width: 52, height: 76, rx: 6 }, 'blue'),
    s('path', { d: 'M48 62l18 26-18 26-18-26z' }, 'sky'),
    s('rect', { x: 88, y: 50, width: 52, height: 76, rx: 6 }, 'white'),
    outline({ x: 88, y: 50, width: 52, height: 76, rx: 6 }),
    s('path', { d: heart(114, 86, 12) }, 'red', { accent: true }),
    arrow('M48 40q32-28 64 0m-12 2l12-2-2-12', 'orange', 5)
  ],
  sacrificio: [
    ground(),
    s('path', { d: 'M18 22l-4 10M36 30l-4 10M20 50l-4 10M44 48l-4 10M60 30l-4 10', ...SW(3) }, 'blue', { stroke: true }),
    ...person(40, 136, 'gray'),
    s('path', { d: drop(32, 58, 3) + drop(50, 62, 3) }, 'sky'),
    s('path', { d: 'M52 104l58-30', ...SW(4) }, 'dark', { stroke: true }),
    ...person(112, 136, 'orange', { h: 32, w: 22, r: 10 }),
    s('path', { d: 'M78 76a32 26 0 0 1 64 0z' }, 'red', { accent: true })
  ],
  separado: [
    ground(),
    s('path', { d: 'M80 30v106', ...DASH(4, '8 8') }, 'gray', { stroke: true }),
    ...lean(40, 136, -12, 'blue', { accent: true }),
    ...lean(120, 136, 12, 'pink'),
    arrow('M66 40H30m10-10L30 40l10 10', 'orange', 5),
    arrow('M94 40h36m-10-10l10 10-10 10', 'orange', 5)
  ],
  surgir: [
    s('circle', { cx: 34, cy: 40, r: 12 }, 'yellow'),
    s('path', { d: 'M14 138V96q20-60 70-62q44 0 50 34q-26-18-40 4q-8 16 6 22q20 6 46 0v44z' }, 'blue', { accent: true }),
    s('path', { d: 'M84 34q44 0 50 34q-26-18-40 4', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: 'M14 138v-20q40-20 70 0t62-6v26z' }, 'sky'),
    s('path', { d: dots([[140, 56], [132, 46], [142, 72]], 3) }, 'sky')
  ],
  terapia: [
    s('path', { d: 'M20 128v8M128 128v8', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M14 106h120v22H14zM14 88h20v18H14z' }, 'brown'),
    s('circle', { cx: 38, cy: 84, r: 11 }, 'skin'),
    s('rect', { x: 50, y: 84, width: 56, height: 22, rx: 10 }, 'blue'),
    s('circle', { cx: 128, cy: 44, r: 11 }, 'skin'),
    s('rect', { x: 114, y: 58, width: 28, height: 36, rx: 9 }, 'green', { accent: true }),
    s('rect', { x: 102, y: 62, width: 16, height: 20, rx: 2 }, 'yellow')
  ],
  tranquilidad: [
    s('path', { d: 'M30 62a50 50 0 0 1 100 0', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M20 136h40M100 136h40M40 144h80', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M40 116q40-16 80 0q-4 12-40 12t-40-12z' }, 'purple'),
    s('path', { d: 'M64 66h32l8 46H56z' }, 'mint', { accent: true }),
    s('path', { d: 'M66 72l-12 34M94 72l12 34', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 80, cy: 50, r: 13 }, 'skin'),
    s('path', { d: 'M72 50q3 3 6 0M82 50q3 3 6 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  transferencia: [
    s('path', { d: rects([[14, 44, 42, 74], [104, 44, 42, 74]]) }, 'dark'),
    s('path', { d: rects([[19, 52, 32, 56], [109, 52, 32, 56]]) }, 'sky'),
    arrow('M40 36q40-28 80 0m-12-4l12 4-4 12', 'green', 5),
    s('circle', { cx: 80, cy: 82, r: 14 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 82, r: 8, ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M58 82h4M98 82h4', ...SW(3) }, 'gray', { stroke: true })
  ],
  vidrio: [
    s('rect', { x: 28, y: 20, width: 104, height: 120, rx: 4 }, 'brown'),
    s('path', { d: rects([[36, 28, 40, 50], [84, 28, 40, 50], [36, 86, 40, 46], [84, 86, 40, 46]]) }, 'sky', { accent: true }),
    s('path', { d: 'M44 64l20-24M52 70l14-16M92 120l20-24M100 126l14-16', ...SW(4) }, 'white', { stroke: true })
  ],
  virtud: [
    s('path', { d: rays(80, 86, 48, 58, 12, 15), ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: heart(80, 84, 30) }, 'red', { accent: true }),
    s('ellipse', { cx: 80, cy: 32, rx: 22, ry: 6, ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: sparkle(64, 70, 6) }, 'white')
  ],
  acta: [
    ...paper(32, 16, 84, 124),
    s('rect', { x: 44, y: 28, width: 60, height: 8, rx: 2 }, 'navy'),
    s('path', { d: 'M44 50h60M44 62h60M44 74h60M44 86h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 112q6-14 10 0t10 0 10-6 14 2', ...SW(3) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M44 120h56', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M140 60l-32 48', ...SW(7) }, 'dark', { stroke: true })
  ],
  'agrícola': [
    s('path', { d: 'M14 120h132v18H14z' }, 'brown'),
    s('path', { d: 'M24 128h112', ...DASH(3, '8 6') }, 'tan', { stroke: true }),
    s('path', { d: 'M56 76V58', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 76h40V50h30l6 26h14v28H40z' }, 'green', { accent: true }),
    s('rect', { x: 86, y: 56, width: 20, height: 18, rx: 2 }, 'sky'),
    s('path', { d: dots([[96, 104]], 22) + dots([[50, 110]], 14) }, 'dark'),
    s('path', { d: dots([[96, 104], [50, 110]], 7) }, 'yellow')
  ],
  aprobar: [
    ...paper(28, 16, 92, 124),
    s('path', { d: 'M40 34h52M40 50h68M40 66h60M40 82h68', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 96l20 22 48-56', ...SW(10) }, 'green', { stroke: true, accent: true }),
    s('path', { d: star(124, 120, 16) }, 'yellow')
  ],
  'atmósfera': [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'sky'),
    s('circle', { cx: 80, cy: 80, r: 46 }, 'blue', { accent: true }),
    s('path', { d: 'M52 56q14-10 24 2q-2 16-18 14q-10-4-6-16zM90 84q18-8 26 6q-4 18-20 14q-12-8-6-20z' }, 'green'),
    s('path', { d: ells([[70, 98, 14, 4], [100, 58, 12, 4], [50, 80, 10, 3]]) }, 'white'),
    s('path', { d: ring(80, 80, 54), ...DASH(2, '4 6') }, 'white', { stroke: true })
  ],
  'brasileño': [
    s('rect', { x: 14, y: 30, width: 132, height: 100, rx: 4 }, 'green'),
    s('path', { d: 'M80 38l58 42-58 42-58-42z' }, 'yellow'),
    s('circle', { cx: 80, cy: 80, r: 24 }, 'navy', { accent: true }),
    s('path', { d: 'M57 74q24-8 46 6', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: dots([[70, 88], [80, 94], [92, 86], [86, 98]], 1.8) }, 'white')
  ],
  bus: [
    s('path', { d: 'M14 132h132', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 16, y: 40, width: 128, height: 76, rx: 10 }, 'yellow', { accent: true }),
    s('path', { d: rects([[26, 50, 22, 24], [54, 50, 22, 24], [82, 50, 22, 24], [110, 50, 24, 24], [112, 80, 20, 32]]) }, 'sky'),
    s('rect', { x: 16, y: 86, width: 90, height: 6 }, 'red'),
    s('path', { d: dots([[42, 116], [118, 116]], 12) }, 'dark'),
    s('path', { d: dots([[42, 116], [118, 116]], 5) }, 'gray')
  ],
  ciego: [
    backdrop('mint'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    ...person(66, 136, 'navy'),
    s('path', { d: ells([[61, 76, 5, 4], [72, 76, 5, 4]]) }, 'black'),
    s('path', { d: 'M78 104l10 0', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M88 104l22 30', ...SW(4) }, 'white', { stroke: true, accent: true }),
    s('path', { d: 'M108 131l3 4', ...SW(5) }, 'red', { stroke: true })
  ],
  confirmar: [
    s('rect', { x: 40, y: 16, width: 80, height: 128, rx: 10 }, 'dark'),
    s('rect', { x: 46, y: 28, width: 68, height: 104, rx: 3 }, 'sky'),
    s('rect', { x: 52, y: 48, width: 56, height: 54, rx: 6 }, 'white'),
    s('circle', { cx: 80, cy: 66, r: 12 }, 'green'),
    s('path', { d: 'M74 66l4 4 8-8', ...SW(3) }, 'white', { stroke: true }),
    s('rect', { x: 60, y: 86, width: 40, height: 10, rx: 5 }, 'green', { accent: true }),
    s('path', { d: 'M118 146l-22-46', ...SW(12) }, 'skin', { stroke: true })
  ],
  'confusión': [
    s('path', { d: 'M46 34c10-20 30 10 20 16s-20-20 0-24 30 20 40 6 10-10 20 4', ...SW(4) }, 'purple', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 98, r: 40 }, 'skin'),
    s('path', { d: 'M66 92a5 5 0 1 0-5 5a9 9 0 1 0 9-9M102 92a5 5 0 1 0-5 5a9 9 0 1 0 9-9', ...SW(2.5) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 120q4-4 8 0t8 0 8 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  costado: [
    s('circle', { cx: 70, cy: 34, r: 16 }, 'skin'),
    s('path', { d: 'M48 60l-10 50M92 60l10 50', ...SW(9) }, 'skin', { stroke: true }),
    s('rect', { x: 46, y: 52, width: 48, height: 86, rx: 14 }, 'blue'),
    s('ellipse', { cx: 92, cy: 92, rx: 8, ry: 24 }, 'orange', { accent: true }),
    s('path', { d: 'M62 76q10 2 16 8M62 90q10 2 16 8M62 104q10 2 16 8', ...SW(3) }, 'white', { stroke: true }),
    arrow('M146 92h-30m10-10l-10 10 10 10', 'red', 6)
  ],
  danza: [
    s('path', { d: 'M26 104q-10-10 0-24M134 104q10-10 0-24', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M74 128l-6 10M88 128l10 8', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M74 54L52 30M86 54l26 6', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M72 48h16l4 30 30 34q-42 16-84 0l30-34z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 34, r: 12 }, 'skin'),
    ...note(124, 40, 'purple')
  ],
  dispositivo: [
    s('rect', { x: 16, y: 36, width: 80, height: 100, rx: 8 }, 'dark'),
    s('rect', { x: 24, y: 44, width: 64, height: 84, rx: 3 }, 'sky'),
    s('rect', { x: 100, y: 66, width: 40, height: 72, rx: 6 }, 'dark'),
    s('rect', { x: 105, y: 74, width: 30, height: 54, rx: 2 }, 'mint', { accent: true }),
    s('path', { d: 'M123 14v46', ...SW(10) }, 'gray', { stroke: true }),
    s('rect', { x: 110, y: 22, width: 26, height: 28, rx: 6 }, 'dark'),
    s('rect', { x: 114, y: 26, width: 18, height: 20, rx: 3 }, 'blue')
  ],
  'estándar': [
    s('path', { d: 'M14 64h132', ...DASH(2, '5 5') }, 'gray', { stroke: true }),
    s('path', { d: rects([[26, 64, 30, 30], [64, 64, 30, 30], [102, 64, 30, 30]]) }, 'blue'),
    s('rect', { x: 16, y: 108, width: 128, height: 22, rx: 2 }, 'yellow', { accent: true }),
    s('path', { d: Array.from({ length: 10 }, (_, i) => `M${26 + i * 12} 108v${i % 2 ? 8 : 12}`).join(''), ...SW(2) }, 'dark', { stroke: true })
  ],
  'fantasía': [
    backdrop('navy'),
    s('path', { d: 'M24 104a56 56 0 0 1 112 0', ...SW(8) }, 'red', { stroke: true }),
    s('path', { d: 'M34 104a46 46 0 0 1 92 0', ...SW(8) }, 'yellow', { stroke: true }),
    s('path', { d: 'M44 104a36 36 0 0 1 72 0', ...SW(8) }, 'sky', { stroke: true }),
    s('path', { d: 'M60 112V82h8v-8h8v8h8v-8h8v8h8v30z' }, 'purple', { accent: true }),
    s('path', { d: ells([[50, 118, 22, 12], [80, 114, 26, 16], [112, 118, 22, 12]]) }, 'white'),
    s('path', { d: star(30, 34, 5) + star(130, 30, 6) + star(80, 26, 4) }, 'yellow')
  ],
  frecuente: [
    s('circle', { cx: 80, cy: 80, r: 34 }, 'cream'),
    outline({ cx: 80, cy: 80, r: 34 }, 'gray', 3),
    s('path', { d: 'M80 80V60M80 80l14 8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 32a48 48 0 0 1 46 34M80 128a48 48 0 0 1-46-34', ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M116 62l18 2-6 14zM44 98l-18-2 6-14z' }, 'blue')
  ],
  imponer: [
    s('path', { d: 'M30 40v40m-8-10l8 10 8-10M130 40v40m-8-10l8 10 8-10', ...SW(5) }, 'red', { stroke: true }),
    s('rect', { x: 66, y: 12, width: 28, height: 24 }, 'orange', { accent: true }),
    s('rect', { x: 56, y: 32, width: 48, height: 24, rx: 10 }, 'skin'),
    s('rect', { x: 52, y: 56, width: 56, height: 26, rx: 3 }, 'gray'),
    ...person(80, 136, 'blue', { h: 30, w: 22, r: 10 }),
    s('path', { d: drop(100, 96, 3) }, 'sky')
  ],
  'inmigración': [
    ground(),
    s('path', { d: 'M76 136V40', ...DASH(4, '8 8') }, 'gray', { stroke: true }),
    ...person(46, 136, 'orange'),
    s('rect', { x: 58, y: 112, width: 22, height: 24, rx: 3 }, 'brown', { accent: true }),
    arrow('M56 40h36m-10-10l10 10-10 10', 'green', 5),
    s('rect', { x: 104, y: 96, width: 38, height: 40 }, 'tan'),
    s('path', { d: 'M98 98l25-24 25 24z' }, 'red'),
    s('rect', { x: 116, y: 112, width: 12, height: 24 }, 'brown')
  ],
  lana: [
    s('path', { d: 'M40 30l70 90M120 30L50 120', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: dots([[40, 30], [120, 30]], 5) }, 'yellow'),
    s('circle', { cx: 80, cy: 90, r: 40 }, 'pink', { accent: true }),
    s('path', { d: 'M48 70q32 10 64-6M44 92q36 14 72-6M52 114q30 10 56-4M66 54q-12 30 4 74', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M114 112q18 6 16 20t14 6', ...SW(3) }, 'pink', { stroke: true })
  ],
  marcado: [
    ...paper(22, 22, 96, 116),
    s('rect', { x: 32, y: 64, width: 72, height: 14, rx: 2 }, 'yellow', { accent: true }),
    s('path', { d: 'M36 46h64M36 71h60M36 96h64M36 116h48', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M112 72l26-34', ...SW(14) }, 'orange', { stroke: true }),
    s('path', { d: 'M104 78l4-10 8 6z' }, 'dark')
  ],
  misa: [
    s('rect', { x: 36, y: 72, width: 88, height: 66 }, 'tan'),
    s('path', { d: 'M30 74l50-32 50 32z' }, 'red'),
    s('rect', { x: 66, y: 32, width: 28, height: 42 }, 'tan'),
    s('path', { d: 'M62 34l18-12 18 12z' }, 'red'),
    s('path', { d: 'M80 8v14M74 13h12', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M73 64q0-14 7-14t7 14l2 4H71z' }, 'yellow', { accent: true }),
    s('path', { d: 'M68 138v-24a12 12 0 0 1 24 0v24z' }, 'brown'),
    s('circle', { cx: 80, cy: 92, r: 7 }, 'sky')
  ],
  'núcleo': [
    s('ellipse', { cx: 80, cy: 80, rx: 62, ry: 22, ...SW(3) }, 'blue', { stroke: true }),
    s('ellipse', { cx: 80, cy: 80, rx: 62, ry: 22, transform: 'rotate(60 80 80)', ...SW(3) }, 'blue', { stroke: true }),
    s('ellipse', { cx: 80, cy: 80, rx: 62, ry: 22, transform: 'rotate(-60 80 80)', ...SW(3) }, 'blue', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 14 }, 'red', { accent: true }),
    s('path', { d: dots([[142, 80], [49, 26.3], [49, 133.7]], 6) }, 'orange')
  ],
  'persecución': [
    s('path', { d: 'M14 128h132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 92h10M14 104h14', ...SW(3) }, 'gray', { stroke: true }),
    ...car(84, 92, 'red', 'sky', { accent: true }),
    ...car(18, 92, 'navy'),
    s('rect', { x: 36, y: 72, width: 12, height: 6, rx: 2 }, 'red'),
    s('rect', { x: 48, y: 72, width: 12, height: 6, rx: 2 }, 'blue')
  ],
  popularidad: [
    s('path', { d: heart(34, 40, 8) + heart(126, 36, 10) + heart(112, 66, 6) + heart(48, 70, 6) }, 'pink'),
    ...person(80, 108, 'red', { accent: true }),
    s('path', { d: star(80, 22, 8) }, 'yellow'),
    s('path', { d: busts([30, 58, 102, 130], 146, 24, 26) }, 'blue'),
    s('path', { d: dots([[30, 110], [58, 110], [102, 110], [130, 110]], 10) }, 'skin')
  ],
  pozo: [
    s('path', { d: 'M44 46v52M116 46v52', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M32 46L80 20l48 26z' }, 'red'),
    s('path', { d: 'M44 60h72', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 60v18', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M72 78h16l-2 14h-12z' }, 'blue', { accent: true }),
    s('rect', { x: 34, y: 96, width: 92, height: 40, rx: 4 }, 'gray'),
    s('path', { d: 'M34 110h92M34 124h92M56 96v14M84 96v14M110 96v14M46 110v14M70 110v14M96 110v14M120 110v14M56 124v12M84 124v12M110 124v12', ...SW(2) }, 'white', { stroke: true }),
    s('ellipse', { cx: 80, cy: 96, rx: 46, ry: 6 }, 'dark')
  ],
  preparado: [
    s('path', { d: 'M68 32q0-14 12-14t12 14', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 52q0-22 40-22t40 22v78a8 8 0 0 1-8 8H48a8 8 0 0 1-8-8z' }, 'orange'),
    s('path', { d: 'M40 64h80', ...SW(3) }, 'brown', { stroke: true }),
    s('rect', { x: 54, y: 92, width: 52, height: 32, rx: 6 }, 'red'),
    s('circle', { cx: 124, cy: 40, r: 18 }, 'green', { accent: true }),
    s('path', { d: 'M116 40l6 6 10-12', ...SW(4) }, 'white', { stroke: true })
  ],
  registrar: [
    s('path', { d: 'M66 106h28l6 22H60z' }, 'gray'),
    s('path', { d: 'M48 130h64', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 18, y: 22, width: 124, height: 84, rx: 6 }, 'dark'),
    s('rect', { x: 26, y: 30, width: 108, height: 68, rx: 2 }, 'white'),
    s('circle', { cx: 50, cy: 54, r: 10 }, 'blue'),
    s('path', { d: busts([50], 84, 26, 16) }, 'blue'),
    s('path', { d: rects([[72, 42, 52, 10], [72, 60, 52, 10]]) }, 'gray'),
    s('rect', { x: 72, y: 78, width: 30, height: 10, rx: 5 }, 'green', { accent: true })
  ],
  remedio: [
    s('path', { d: 'M58 46q-6-8 0-16t0-14M84 46q-6-8 0-16', ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 72, cy: 134, rx: 46, ry: 6 }, 'gray'),
    s('path', { d: 'M106 80h8a12 12 0 0 1 0 24h-10', ...SW(6) }, 'sky', { stroke: true }),
    s('path', { d: 'M38 70h68v30a30 30 0 0 1-30 30h-8a30 30 0 0 1-30-30z' }, 'sky'),
    s('ellipse', { cx: 72, cy: 72, rx: 32, ry: 5 }, 'brown'),
    s('path', { d: 'M56 70q8-22 30-20q-6 20-30 20z' }, 'green', { accent: true }),
    s('circle', { cx: 96, cy: 64, r: 10 }, 'yellow')
  ],
  'reputación': [
    s('path', { d: [30, 55, 80, 105, 130].map(x => star(x, 26, 11)).join('') }, 'yellow', { accent: true }),
    s('path', { d: 'M30 132q-10-30 10-54M130 132q10-30-10-54', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: busts([80], 138, 56, 40) }, 'navy'),
    s('circle', { cx: 80, cy: 78, r: 18 }, 'skin')
  ],
  rumor: [
    ground(),
    ...person(50, 136, 'purple'),
    ...person(112, 136, 'green'),
    s('ellipse', { cx: 100, cy: 78, rx: 4, ry: 6 }, 'tan'),
    s('path', { d: 'M62 74q8 2 8 10', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: 'M72 70q5-4 10 0t10 0M74 82q5-4 10 0t10 0', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 18h44a8 8 0 0 1 8 8v12a8 8 0 0 1-8 8H90l-10 8v-8H60a8 8 0 0 1-8-8V26a8 8 0 0 1 8-8z' }, 'pink', { accent: true }),
    s('path', { d: dots([[70, 32], [82, 32], [94, 32]], 3) }, 'white')
  ],
  sinceramente: [
    ground(),
    ...person(48, 136, 'blue'),
    s('path', { d: heart(48, 108, 9) }, 'red', { accent: true }),
    s('path', { d: 'M84 28h46a10 10 0 0 1 10 10v24a10 10 0 0 1-10 10h-24l-16 14V72h-6a10 10 0 0 1-10-10V38a10 10 0 0 1 10-10z' }, 'sky'),
    s('path', { d: heart(107, 50, 11) }, 'pink')
  ],
  apuntar: [
    s('path', { d: 'M30 100v36M130 100v36', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 14, y: 100, width: 132, height: 10, rx: 2 }, 'brown'),
    s('path', { d: 'M74 100V78q0-8 4-12v-10h4v10q4 4 4 12v22z' }, 'green'),
    s('circle', { cx: 80, cy: 78, r: 40, ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 30v26M80 100v26M32 78h26M102 78h26', ...SW(4) }, 'red', { stroke: true, accent: true })
  ],
  asistente: [
    ground(),
    ...person(70, 136, 'purple'),
    s('path', { d: 'M57 78a13 13 0 0 1 26 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[57, 80], [83, 80]], 4) }, 'dark'),
    s('path', { d: 'M83 84q0 8-8 8', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 88, y: 94, width: 28, height: 36, rx: 2 }, 'brown', { accent: true }),
    s('rect', { x: 92, y: 100, width: 20, height: 26 }, 'white'),
    s('path', { d: 'M95 108h14M95 116h10', ...SW(2) }, 'gray', { stroke: true })
  ],
  casco: [
    s('ellipse', { cx: 80, cy: 128, rx: 54, ry: 6 }, 'gray'),
    s('path', { d: 'M30 100a50 50 0 0 1 100 0z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 52v44M56 62l6 34M104 62l-6 34', ...SW(6) }, 'orange', { stroke: true }),
    s('rect', { x: 16, y: 96, width: 128, height: 14, rx: 7 }, 'orange')
  ],
  'contaminación': [
    s('path', { d: ells([[108, 42, 14, 10], [124, 30, 16, 12], [136, 46, 10, 8], [96, 26, 10, 8]]) }, 'dark', { accent: true }),
    s('path', { d: rects([[100, 58, 14, 78], [122, 72, 14, 64]]) }, 'dark'),
    s('path', { d: 'M20 136V96l24-14v14l24-14v14l24-14v54z' }, 'gray'),
    s('path', { d: rects([[30, 108, 10, 10], [52, 108, 10, 10], [74, 108, 10, 10]]) }, 'yellow'),
    s('path', { d: 'M14 140h132', ...SW(4) }, 'brown', { stroke: true })
  ],
  descargar: [
    ground(),
    s('rect', { x: 14, y: 44, width: 60, height: 62 }, 'orange'),
    s('rect', { x: 20, y: 50, width: 48, height: 50 }, 'dark'),
    s('rect', { x: 28, y: 76, width: 22, height: 24 }, 'tan'),
    s('circle', { cx: 44, cy: 114, r: 10 }, 'dark'),
    s('path', { d: 'M68 102l46 34', ...SW(5) }, 'gray', { stroke: true }),
    ...person(122, 136, 'blue'),
    s('rect', { x: 100, y: 84, width: 30, height: 24, rx: 2 }, 'brown', { accent: true })
  ],
  'diagnóstico': [
    s('rect', { x: 20, y: 24, width: 76, height: 110, rx: 6 }, 'brown'),
    s('rect', { x: 28, y: 36, width: 60, height: 90 }, 'white'),
    s('path', { d: 'M32 70h14l6-14 8 28 6-14h18', ...SW(3) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M36 100h44M36 112h32', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M112 22v26a14 14 0 0 0 28 0V22M126 62v40q0 14-12 14', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 108, cy: 118, r: 10 }, 'gray')
  ],
  digno: [
    ground(),
    s('path', { d: 'M34 124q-16-40 12-82M126 124q16-40-12-82', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots([[30, 100], [32, 80], [38, 60], [130, 100], [128, 80], [122, 60]], 5) }, 'green'),
    ...person(80, 136, 'navy'),
    s('circle', { cx: 80, cy: 104, r: 7 }, 'yellow', { accent: true }),
    s('path', { d: star(80, 40, 11) }, 'yellow')
  ],
  'doña': [
    ground(),
    s('path', { d: 'M112 136V96', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M70 80h20l18 56H52z' }, 'purple', { accent: true }),
    s('path', { d: 'M62 82h36l-18 26z' }, 'pink'),
    s('circle', { cx: 80, cy: 44, r: 7 }, 'gray'),
    s('circle', { cx: 80, cy: 64, r: 14 }, 'skin'),
    s('path', { d: 'M66 62a14 14 0 0 1 28 0q-14-8-28 0z' }, 'gray'),
    s('path', { d: ring(75, 66, 3.5) + ring(86, 66, 3.5), ...SW(1.5) }, 'dark', { stroke: true })
  ],
  'grabación': [
    s('path', { d: 'M50 64q0 34 30 34t30-34M80 98v30M60 132h40', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 62, y: 22, width: 36, height: 62, rx: 18 }, 'gray'),
    s('path', { d: 'M66 42h28M66 54h28M66 66h28', ...SW(2) }, 'dark', { stroke: true }),
    s('circle', { cx: 128, cy: 30, r: 10 }, 'red', { accent: true }),
    s('path', { d: 'M18 70l6-10 6 20 6-14 6 8', ...SW(3) }, 'blue', { stroke: true })
  ],
  grasa: [
    s('path', { d: 'M118 100h28', ...SW(8) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 70, cy: 100, rx: 52, ry: 18 }, 'dark'),
    s('ellipse', { cx: 70, cy: 98, rx: 42, ry: 11 }, 'yellow', { accent: true }),
    s('path', { d: drop(40, 64, 5) + drop(70, 50, 6) + drop(104, 62, 5) }, 'orange'),
    s('path', { d: dots([[56, 96], [84, 100]], 4) }, 'cream')
  ],
  gritar: [
    ground(),
    ...person(42, 136, 'orange'),
    s('circle', { cx: 46, cy: 82, r: 3.5 }, 'dark'),
    s('path', { d: burst(110, 58, 36, 22, 12) }, 'red', { accent: true }),
    s('path', { d: burst(110, 58, 22, 13, 12) }, 'yellow'),
    s('path', { d: 'M58 76l12-4M58 84h14M58 92l12 4', ...SW(3) }, 'dark', { stroke: true })
  ],
  huir: [
    ground(),
    s('path', { d: 'M14 136q0-30 14-44q0 16 8 18q-2-30 18-46q-4 30 10 36q6-10 4-20q16 20 12 56z' }, 'orange'),
    s('path', { d: 'M30 136q0-16 10-24q2 12 10 12q2-10 8-16q8 14 6 28z' }, 'yellow'),
    s('path', { d: dots([[86, 132], [78, 126]], 5) }, 'gray'),
    ...lean(104, 136, 24, 'blue', { accent: true }),
    s('path', { d: drop(96, 62, 4) }, 'sky')
  ],
  intento: [
    s('path', { d: 'M118 68v68', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 114, y: 24, width: 10, height: 46 }, 'gray'),
    s('path', { d: 'M90 58l4 14h12l4-14', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M114 58H88', ...SW(4) }, 'orange', { stroke: true }),
    ground(),
    ...person(40, 136, 'green'),
    s('path', { d: 'M50 98l10-26', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M62 60q8-30 26-16', ...DASH(3, '4 5') }, 'gray', { stroke: true }),
    s('circle', { cx: 92, cy: 40, r: 10 }, 'orange', { accent: true })
  ],
  'jurídico': [
    s('path', { d: rects([[26, 122, 92, 14]]) }, 'brown'),
    s('path', { d: rects([[30, 108, 84, 14]]) }, 'red'),
    s('path', { d: rects([[36, 94, 76, 14]]) }, 'navy'),
    s('path', { d: 'M40 94v42M104 94v42', ...SW(2) }, 'yellow', { stroke: true }),
    s('path', { d: 'M72 92V36M42 46h60', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 46l-8 22M44 46l10 22M100 46l-10 22M100 46l8 22', ...SW(1.5) }, 'gray', { stroke: true }),
    s('path', { d: 'M34 68h22a11 7 0 0 1-22 0zM88 68h22a11 7 0 0 1-22 0z' }, 'yellow', { accent: true })
  ],
  macho: [
    s('path', { d: 'M74 120v16M88 120v16', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M98 100q10-50 44-50q-14 14-10 30q-8-4-14 2q-4 18-20 18z' }, 'navy'),
    s('ellipse', { cx: 82, cy: 98, rx: 30, ry: 24 }, 'orange', { accent: true }),
    s('path', { d: 'M74 92q20-4 28 14q-20 6-28-14z' }, 'red'),
    s('circle', { cx: 56, cy: 62, r: 16 }, 'orange'),
    s('path', { d: 'M46 50q2-12 8-6q4-10 10-2q8-4 6 8z' }, 'red'),
    s('path', { d: drop(48, 84, 4) }, 'red'),
    s('path', { d: 'M42 58l-12 4 12 4z' }, 'yellow'),
    s('circle', { cx: 54, cy: 58, r: 2.5 }, 'dark')
  ],
  'maíz': [
    s('ellipse', { cx: 80, cy: 72, rx: 22, ry: 52 }, 'yellow', { accent: true }),
    s('path', { d: 'M62 50h36M60 66h40M60 82h40M62 98h36M80 24v100M70 28v90M90 28v90', ...SW(1.5) }, 'orange', { stroke: true }),
    s('path', { d: 'M80 140q-40-20-34-70q14 30 30 40zM80 140q40-20 34-70q-14 30-30 40z' }, 'green')
  ],
  operativo: [
    s('rect', { x: 20, y: 30, width: 120, height: 96, rx: 8 }, 'gray'),
    s('rect', { x: 32, y: 42, width: 56, height: 36, rx: 3 }, 'dark'),
    s('path', { d: 'M36 62q6-14 12 0t12 0 12 0 12 0', ...SW(3) }, 'mint', { stroke: true }),
    s('circle', { cx: 112, cy: 58, r: 12 }, 'green', { accent: true }),
    s('path', { d: dots([[44, 104], [72, 104]], 8) }, 'dark'),
    s('path', { d: 'M100 104h24', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M20 136h120', ...SW(4) }, 'dark', { stroke: true })
  ],
  oral: [
    s('path', { d: 'M56 36q24-14 48 0M46 22q34-20 68 0', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M24 84q26-26 44-14q12-8 24 0q18-12 44 14q-26 34-56 34t-56-34z' }, 'red', { accent: true }),
    s('path', { d: 'M38 84q42 24 84 0q-42 10-84 0z' }, 'dark'),
    s('path', { d: 'M52 86h56', ...SW(3) }, 'white', { stroke: true })
  ],
  'paraíso': [
    backdrop('sky'),
    s('circle', { cx: 122, cy: 36, r: 14 }, 'yellow'),
    s('path', { d: 'M14 108h132v26a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'blue'),
    s('path', { d: 'M34 112q36-24 76 0z' }, 'cream'),
    s('path', { d: 'M70 108q-4-30 6-58', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M76 50q-26-10-40 8q20-6 40-8zM76 50q24-14 42 2q-22-4-42-2zM76 50q-6-22-26-26q16 10 26 26zM76 50q14-20 34-18q-20 4-34 18z' }, 'green', { accent: true }),
    s('path', { d: 'M28 38q4-4 8 0q4-4 8 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  'península': [
    backdrop('sky'),
    s('path', { d: 'M14 26a12 12 0 0 1 12-12h108a12 12 0 0 1 12 12v22q-26 0-34 18q-6 30-16 50q-8 14-18 0q-6-20-10-44q-6-20-54-24z' }, 'green', { accent: true }),
    s('path', { d: 'M30 96q6-4 12 0t12 0M104 112q6-4 12 0t12 0M30 128q6-4 12 0t12 0', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M110 86h20l-4 6h-12z' }, 'brown'),
    s('path', { d: 'M120 86V72l8 10z' }, 'white')
  ],
  proporcionar: [
    s('path', { d: 'M14 92h40', ...SW(14) }, 'skin', { stroke: true }),
    s('path', { d: 'M14 92h14', ...SW(20) }, 'blue', { stroke: true }),
    s('path', { d: 'M146 104H96', ...SW(14) }, 'skin', { stroke: true }),
    s('path', { d: 'M146 104h-12', ...SW(20) }, 'green', { stroke: true }),
    s('rect', { x: 50, y: 60, width: 46, height: 38, rx: 3 }, 'brown', { accent: true }),
    s('path', { d: 'M73 60v38', ...SW(4) }, 'tan', { stroke: true }),
    arrow('M56 40h40m-10-10l10 10-10 10', 'orange', 5)
  ],
  'recomendación': [
    s('path', { d: star(124, 40, 11) + star(132, 66, 7) + star(104, 22, 6) }, 'yellow'),
    s('path', { d: 'M58 72V40', ...SW(14) }, 'skin', { stroke: true }),
    s('rect', { x: 46, y: 70, width: 44, height: 50, rx: 10 }, 'skin'),
    s('rect', { x: 88, y: 72, width: 18, height: 46, rx: 3 }, 'blue', { accent: true }),
    s('path', { d: 'M58 84h26M58 96h26M58 108h24', ...SW(2) }, 'tan', { stroke: true })
  ],
  relevante: [
    backdrop('navy'),
    s('path', { d: 'M68 24h24l36 106H32z' }, 'cream'),
    s('rect', { x: 64, y: 16, width: 32, height: 10, rx: 3 }, 'dark'),
    s('path', { d: dots([[24, 122], [44, 126], [116, 126], [136, 122]], 8) }, 'gray'),
    s('circle', { cx: 80, cy: 116, r: 14 }, 'red', { accent: true })
  ],
  rutina: [
    s('path', { d: rays(30, 60, 18, 24, 8), ...SW(3) }, 'orange', { stroke: true }),
    s('circle', { cx: 30, cy: 60, r: 13 }, 'yellow'),
    s('path', { d: 'M94 56h4a5 5 0 0 1 0 10h-4', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M66 48h28v18a10 10 0 0 1-10 10h-8a10 10 0 0 1-10-10z' }, 'brown'),
    s('path', { d: 'M132 44a17 17 0 1 0 8 28a13 13 0 1 1-8-28z' }, 'navy', { accent: true }),
    s('path', { d: 'M50 62h8M106 62h8', ...SW(3) }, 'dark', { stroke: true }),
    arrow('M128 96q0 30-48 30t-48-30m-8 8l8-8 8 8', 'green', 5)
  ],
  soportar: [
    ground(),
    ...lean(84, 136, 10, 'red'),
    s('path', { d: 'M78 98l-14-18M96 100l12-18', ...SW(7) }, 'skin', { stroke: true }),
    s('ellipse', { cx: 86, cy: 50, rx: 46, ry: 32 }, 'gray', { accent: true }),
    s('path', { d: 'M66 34l8 8-4 8M104 56l8-6', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: drop(122, 92, 4) + drop(44, 96, 4) }, 'sky')
  ],
  teta: [
    s('path', { d: busts([70], 142, 70, 72) }, 'pink'),
    s('path', { d: 'M54 44a16 16 0 0 1 32 0v20q-8-14-16-14t-16 14z' }, 'brown'),
    s('circle', { cx: 70, cy: 46, r: 14 }, 'skin'),
    s('ellipse', { cx: 84, cy: 104, rx: 30, ry: 14, transform: 'rotate(-15 84 104)' }, 'cream'),
    s('circle', { cx: 100, cy: 92, r: 10 }, 'skin'),
    s('path', { d: 'M44 108q30 22 66 0', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: heart(124, 40, 10) }, 'red', { accent: true })
  ],
  timar: [
    s('path', { d: 'M14 126q16-6 33 0t33 0 33 0 33 0v12H14z' }, 'blue'),
    s('path', { d: 'M86 14v62', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 56, y: 82, width: 52, height: 32, rx: 4, transform: 'rotate(-10 82 98)' }, 'navy', { accent: true }),
    s('rect', { x: 64, y: 92, width: 12, height: 9, rx: 2, transform: 'rotate(-10 82 98)' }, 'yellow'),
    s('path', { d: 'M86 76v14a10 10 0 0 1-20 0v-4', ...SW(4) }, 'gray', { stroke: true })
  ],
  ultimar: [
    s('ellipse', { cx: 80, cy: 134, rx: 54, ry: 6 }, 'gray'),
    s('rect', { x: 34, y: 96, width: 92, height: 38, rx: 4 }, 'pink'),
    s('rect', { x: 50, y: 66, width: 60, height: 32, rx: 4 }, 'cream'),
    s('path', { d: 'M34 102q8 8 16 0t16 0 16 0 16 0 16 0 12 0', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M80 52v10', ...DASH(3, '3 4') }, 'gray', { stroke: true }),
    s('path', { d: 'M80 31q4-10 10-12', ...SW(2) }, 'green', { stroke: true }),
    s('circle', { cx: 80, cy: 40, r: 9 }, 'red', { accent: true })
  ],
  aclarar: [
    s('path', { d: 'M22 50h36l-3 72H25z' }, 'brown'),
    s('path', { d: dots([[32, 70], [46, 84], [36, 104], [48, 110]], 3) }, 'tan'),
    s('path', { d: 'M20 38l4 86h32l4-86M100 38l4 86h32l4-86', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M102 50h36l-3 72h-30z' }, 'sky', { accent: true }),
    arrow('M66 86h22m-8-8l8 8-8 8', 'orange', 5),
    s('path', { d: sparkle(132, 28, 8) }, 'yellow')
  ],
  'adopción': [
    s('path', { d: 'M28 48L80 14l52 34', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: ells([[52, 70, 10, 20], [108, 70, 10, 20]]) }, 'brown'),
    s('circle', { cx: 80, cy: 74, r: 30 }, 'tan'),
    s('ellipse', { cx: 80, cy: 86, rx: 14, ry: 10 }, 'cream'),
    s('ellipse', { cx: 80, cy: 82, rx: 5, ry: 4 }, 'dark'),
    s('path', { d: dots([[68, 68], [92, 68]], 3.5) }, 'dark'),
    s('path', { d: 'M60 102q20 10 40 0', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: heart(80, 116, 10) }, 'yellow', { accent: true })
  ],
  adoptar: [
    ground(),
    s('path', { d: 'M18 64L80 22l62 42', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M56 112l14 6M104 112l-14 6', ...SW(5) }, 'skin', { stroke: true }),
    ...person(42, 136, 'blue'),
    ...person(118, 136, 'green'),
    ...person(80, 136, 'orange', { h: 28, w: 20, r: 9 }),
    s('path', { d: heart(80, 50, 10) }, 'red', { accent: true })
  ],
  alarma: [
    s('path', { d: 'M50 126l-8 12M110 126l8 12M80 42v-12', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[46, 40], [114, 40]], 14) }, 'red'),
    s('circle', { cx: 80, cy: 86, r: 44 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 86, r: 34 }, 'white'),
    s('path', { d: 'M80 86V64M80 86l14 8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M22 66l-8-4M20 88h-8M138 66l8-4M140 88h8', ...SW(3) }, 'orange', { stroke: true })
  ],
  alegrar: [
    s('ellipse', { cx: 80, cy: 140, rx: 24, ry: 4 }, 'gray'),
    s('path', { d: 'M72 116l-8 12M88 116l8 12', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M68 80L52 56M92 80l16-24', ...SW(6) }, 'skin', { stroke: true }),
    ...person(80, 118, 'orange', { accent: true }),
    s('path', { d: 'M74 62q6 5 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: dots([[30, 40], [128, 30], [40, 100], [130, 96]], 4) }, 'pink'),
    s('path', { d: rects([[24, 66, 6, 6], [120, 60, 6, 6], [76, 20, 6, 6]]) }, 'blue')
  ],
  amanecer: [
    s('path', { d: halfRays(80, 100, 44, 58, 9), ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M44 100a36 36 0 0 1 72 0z' }, 'yellow', { accent: true }),
    s('path', { d: 'M14 100h132v38H14z' }, 'green'),
    s('path', { d: 'M30 116h30M90 122h40', ...SW(3) }, 'mint', { stroke: true })
  ],
  apartado: [
    s('circle', { cx: 34, cy: 34, r: 12 }, 'yellow'),
    s('path', { d: 'M14 110q50-40 132-10v38H14z' }, 'green'),
    s('path', { d: 'M40 138q30-20 10-30t60-22', ...SW(4) }, 'tan', { stroke: true }),
    s('rect', { x: 110, y: 72, width: 20, height: 16 }, 'brown'),
    s('path', { d: 'M106 74l14-12 14 12z' }, 'red', { accent: true }),
    s('path', { d: ells([[100, 34, 14, 6], [112, 30, 12, 7]]) }, 'gray')
  ],
  asalto: [
    s('path', { d: 'M18 92h14M16 108h12M20 124h12', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 82q0-24 15-24t15 24', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M48 82h54l8 50H40z' }, 'pink', { accent: true }),
    s('path', { d: 'M146 22L94 56', ...SW(14) }, 'black', { stroke: true }),
    s('circle', { cx: 88, cy: 60, r: 9 }, 'dark'),
    s('path', { d: burst(118, 92, 12, 5, 8) }, 'yellow')
  ],
  'botón': [
    s('circle', { cx: 80, cy: 80, r: 52 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 42, ...SW(4) }, 'navy', { stroke: true }),
    s('path', { d: dots([[68, 68], [92, 68], [68, 92], [92, 92]], 6) }, 'white'),
    s('path', { d: 'M68 68v24M92 68v24', ...SW(3) }, 'red', { stroke: true })
  ],
  colega: [
    ground(),
    s('path', { d: 'M56 100l22-38M104 100L82 62', ...SW(7) }, 'skin', { stroke: true }),
    ...person(46, 136, 'blue'),
    ...person(114, 136, 'green'),
    s('path', { d: rects([[38, 104, 14, 9], [106, 104, 14, 9]]) }, 'white'),
    s('path', { d: burst(80, 50, 14, 6, 8) }, 'yellow', { accent: true })
  ],
  colonial: [
    backdrop('sky'),
    s('rect', { x: 24, y: 56, width: 112, height: 82 }, 'cream'),
    s('path', { d: 'M16 58l14-16h100l14 16z' }, 'red', { accent: true }),
    s('path', { d: rects([[40, 66, 14, 20], [73, 66, 14, 20], [106, 66, 14, 20]]) }, 'navy'),
    s('path', { d: 'M34 90h92', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M36 138v-24a10 10 0 0 1 20 0v24zM70 138v-24a10 10 0 0 1 20 0v24zM104 138v-24a10 10 0 0 1 20 0v24z' }, 'brown')
  ],
  consentimiento: [
    ground(),
    ...person(52, 136, 'purple'),
    s('path', { d: 'M34 66q-4 12 0 24M70 66q4 12 0 24', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M88 22h40a10 10 0 0 1 10 10v24a10 10 0 0 1-10 10h-22l-14 12V66h-4a10 10 0 0 1-10-10V32a10 10 0 0 1 10-10z' }, 'green', { accent: true }),
    s('path', { d: 'M96 44l8 8 16-16', ...SW(5) }, 'white', { stroke: true })
  ],
  conveniente: [
    s('path', { d: 'M36 62V46a20 20 0 0 1 40 0v16', ...SW(8) }, 'gray', { stroke: true }),
    s('rect', { x: 24, y: 60, width: 64, height: 62, rx: 8 }, 'yellow'),
    s('path', { d: 'M56 92h56', ...SW(7) }, 'orange', { stroke: true }),
    s('circle', { cx: 122, cy: 92, r: 13 }, 'orange', { accent: true }),
    s('circle', { cx: 126, cy: 92, r: 4 }, 'white'),
    s('circle', { cx: 120, cy: 40, r: 14 }, 'green'),
    s('path', { d: 'M113 40l5 5 9-10', ...SW(4) }, 'white', { stroke: true })
  ],
  'corporación': [
    s('path', { d: 'M14 138h132', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 24, y: 56, width: 34, height: 82 }, 'navy'),
    s('rect', { x: 102, y: 44, width: 34, height: 94 }, 'sky'),
    s('rect', { x: 60, y: 20, width: 40, height: 118 }, 'blue', { accent: true }),
    s('path', { d: rects([[66, 30, 10, 8], [84, 30, 10, 8], [66, 46, 10, 8], [84, 46, 10, 8], [66, 62, 10, 8], [84, 62, 10, 8], [66, 78, 10, 8], [84, 78, 10, 8], [66, 94, 10, 8], [84, 94, 10, 8], [30, 66, 8, 6], [44, 66, 8, 6], [30, 80, 8, 6], [44, 80, 8, 6], [108, 54, 8, 6], [122, 54, 8, 6], [108, 68, 8, 6], [122, 68, 8, 6]]) }, 'white'),
    s('rect', { x: 72, y: 116, width: 16, height: 22 }, 'dark')
  ],
  descuento: [
    s('path', { d: 'M70 20h56v56L76 126 20 70z' }, 'red', { accent: true }),
    s('circle', { cx: 108, cy: 38, r: 7 }, 'white'),
    s('path', { d: 'M108 38q20-12 32 2', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 62l50 38', ...DASH(3, '5 5') }, 'white', { stroke: true }),
    s('path', { d: 'M32 122l40-26M32 98l40 26', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: ring(24, 126, 7) + ring(24, 94, 7), ...SW(4) }, 'dark', { stroke: true })
  ],
  desempleo: [
    ground(),
    s('rect', { x: 100, y: 34, width: 42, height: 102 }, 'brown'),
    s('circle', { cx: 108, cy: 88, r: 3 }, 'yellow'),
    arrow('M92 40H44m10-10L44 40l10 10', 'red', 4),
    ...person(56, 136, 'gray'),
    s('path', { d: 'M50 84q6-4 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 96V82', ...SW(3) }, 'green', { stroke: true }),
    s('rect', { x: 38, y: 96, width: 36, height: 24, rx: 2 }, 'tan', { accent: true })
  ],
  embarazo: [
    s('path', { d: 'M80 114v16M56 134h48', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 20, y: 24, width: 120, height: 90, rx: 8 }, 'dark'),
    s('rect', { x: 28, y: 32, width: 104, height: 74, rx: 4 }, 'black'),
    s('path', { d: 'M80 38L40 102h80z' }, 'gray'),
    s('ellipse', { cx: 84, cy: 86, rx: 16, ry: 11, transform: 'rotate(-20 84 86)' }, 'white'),
    s('circle', { cx: 70, cy: 70, r: 11 }, 'white'),
    s('path', { d: heart(118, 44, 7) }, 'red', { accent: true })
  ],
  emocional: [
    s('path', { d: heart(80, 80, 36) }, 'pink'),
    s('path', { d: 'M60 66q6 6 12 0M88 66q6 6 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M68 92q12 8 24 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: drop(58, 84, 5) + drop(102, 84, 5) }, 'blue', { accent: true }),
    s('path', { d: sparkle(130, 30, 8) }, 'yellow')
  ],
  encanto: [
    s('path', { d: 'M30 136L94 72', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 136l10-10', ...SW(7) }, 'white', { stroke: true }),
    s('path', { d: star(104, 60, 20) }, 'yellow', { accent: true }),
    s('path', { d: sparkle(56, 40, 10) + sparkle(134, 104, 9) + sparkle(130, 28, 6) }, 'purple'),
    s('path', { d: heart(64, 84, 7) + heart(120, 128, 6) }, 'pink')
  ],
  escudo: [
    s('path', { d: 'M36 44h88v40q0 38-44 56q-44-18-44-56z' }, 'red'),
    s('path', { d: 'M80 44h44v40H80zM36 84h44v56q-44-18-44-56z' }, 'yellow'),
    s('path', { d: 'M36 44h88v40q0 38-44 56q-44-18-44-56z', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 38l-4-22 14 10 16-14 16 14 14-10-4 22z' }, 'yellow', { accent: true })
  ],
  estancia: [
    s('path', { d: 'M14 104h132v34H14z' }, 'green'),
    s('path', { d: 'M112 104l8-58 8 58', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M120 46l-14-14M120 46l14-14M120 46l14 14M120 46l-14 14', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 24, y: 72, width: 46, height: 34 }, 'cream'),
    s('path', { d: 'M18 74l29-24 29 24z' }, 'red', { accent: true }),
    s('rect', { x: 40, y: 88, width: 14, height: 18 }, 'brown'),
    s('path', { d: 'M14 118h132M14 128h132M24 112v22M48 112v22M72 112v22M96 112v22M120 112v22M142 112v22', ...SW(3) }, 'brown', { stroke: true })
  ],
  flota: [
    backdrop('sky'),
    s('path', { d: [[40, 104], [84, 88], [124, 104]].map(([x, y]) => `M${x} ${y - 4}V${y - 40}l20 36zM${x - 3} ${y - 36}L${x - 18} ${y - 4}h15z`).join('') }, 'white'),
    s('path', { d: [[40, 104], [84, 88], [124, 104]].map(([x, y]) => `M${x - 20} ${y}h40l-6 10h-28z`).join('') }, 'brown'),
    s('path', { d: [[40, 104], [84, 88], [124, 104]].map(([x, y]) => `M${x} ${y - 40}h8l-2 3 2 3h-8z`).join('') }, 'red', { accent: true }),
    s('path', { d: 'M14 112q16-6 33 0t33 0 33 0 33 0v22a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z' }, 'blue')
  ],
  fomentar: [
    s('path', { d: 'M24 40q16-20 32 0', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M60 52l26-16', ...SW(6) }, 'blue', { stroke: true }),
    s('rect', { x: 18, y: 40, width: 44, height: 34, rx: 6 }, 'blue', { accent: true }),
    s('path', { d: dots([[92, 48], [98, 60], [90, 66]], 3) }, 'sky'),
    s('path', { d: 'M94 130V96', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M94 106q-18-2-20-16q16 0 20 16zM94 100q16-4 20-18q-16 2-20 18z' }, 'green'),
    s('path', { d: 'M60 136q34-16 68 0z' }, 'brown'),
    s('path', { d: 'M132 110V70m-8 8l8-8 8 8', ...SW(4) }, 'orange', { stroke: true })
  ],
  frecuentemente: [
    ...paper(22, 36, 116, 102),
    s('path', { d: 'M22 42a6 6 0 0 1 6-6h104a6 6 0 0 1 6 6v18H22z' }, 'blue'),
    s('path', { d: 'M48 26v18M112 26v18', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: [[40, 76], [84, 76], [118, 76], [62, 98], [106, 98], [40, 120], [84, 120]].map(([x, y]) => `M${x - 7} ${y}l4 4 9-9`).join(''), ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: dots([[62, 76], [40, 98], [84, 98], [62, 120], [106, 120]], 4) }, 'gray')
  ],
  fuga: [
    s('path', { d: 'M14 60h80q20 0 20 20v60', ...SW(16) }, 'gray', { stroke: true }),
    s('rect', { x: 52, y: 48, width: 12, height: 24 }, 'dark'),
    s('path', { d: 'M110 62l22-20M114 70l28-8M106 58l6-26', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: drop(134, 38, 4) + drop(144, 62, 3) + drop(110, 26, 3) + drop(58, 90, 5) }, 'blue', { accent: true }),
    s('ellipse', { cx: 58, cy: 132, rx: 30, ry: 6 }, 'sky')
  ],
  garganta: [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'skin'),
    s('ellipse', { cx: 80, cy: 88, rx: 32, ry: 40 }, 'dark'),
    s('path', { d: 'M52 112q28-24 56 0q-8 14-28 14t-28-14z' }, 'pink'),
    s('path', { d: drop(80, 66, 6) }, 'red', { accent: true }),
    s('path', { d: dots([[60, 44], [100, 44]], 6) }, 'dark'),
    s('path', { d: 'M110 140l26-50', ...SW(8) }, 'tan', { stroke: true })
  ],
  himno: [
    ground(),
    s('path', { d: 'M114 136V22', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M116 22h28v22h-28z' }, 'blue', { accent: true }),
    ...person(54, 136, 'green'),
    s('path', { d: heart(54, 106, 8) }, 'red'),
    ...note(80, 52, 'purple'),
    s('path', { d: 'M62 82q4 3 0 6', ...SW(2) }, 'dark', { stroke: true })
  ],
  'informático': [
    s('rect', { x: 20, y: 22, width: 120, height: 84, rx: 6 }, 'dark'),
    s('rect', { x: 28, y: 30, width: 104, height: 68, rx: 2 }, 'navy'),
    s('path', { d: 'M40 44h20v16h20M40 84h30v-14h22M120 44h-16v26M120 84h-14', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: dots([[40, 44], [40, 84], [120, 44], [120, 84], [80, 60]], 4) }, 'yellow', { accent: true }),
    s('path', { d: 'M70 106l-6 20h32l-6-20z' }, 'gray'),
    s('path', { d: 'M46 130h68', ...SW(4) }, 'gray', { stroke: true })
  ],
  margarita: [
    backdrop('green'),
    s('path', { d: 'M80 96v50', ...SW(5) }, 'mint', { stroke: true }),
    s('path', { d: dots(around(80, 70, 28, 12), 11) }, 'white'),
    s('circle', { cx: 80, cy: 70, r: 16 }, 'yellow', { accent: true }),
    s('path', { d: dots(around(126, 116, 9, 8), 4) + dots(around(34, 112, 9, 8), 4) }, 'white'),
    s('path', { d: dots([[126, 116], [34, 112]], 4) }, 'yellow')
  ],
  mensual: [
    s('rect', { x: 32, y: 30, width: 96, height: 92, rx: 6 }, 'gray'),
    ...paper(24, 38, 96, 92),
    s('path', { d: 'M24 44a3 3 0 0 1 3-6h90a3 3 0 0 1 3 6v14H24z' }, 'red'),
    s('circle', { cx: 52, cy: 86, r: 12 }, 'green', { accent: true }),
    s('path', { d: dots([[78, 76], [100, 76], [78, 96], [100, 96], [52, 112], [78, 112]], 4) }, 'gray'),
    arrow('M110 140q30 0 30-30m-8 8l8-8 6 9', 'orange', 4)
  ],
  oficio: [
    s('path', { d: 'M40 56h80l-6 82H46z' }, 'tan'),
    s('path', { d: 'M56 56V40h48v16', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 56, y: 76, width: 48, height: 26, rx: 3 }, 'brown'),
    s('path', { d: 'M36 120L110 40', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 96, y: 26, width: 30, height: 14, rx: 2, transform: 'rotate(-47 111 33)' }, 'dark'),
    s('path', { d: 'M124 120L54 44', ...SW(6) }, 'gray', { stroke: true, accent: true }),
    s('path', { d: 'M56 46l-14-4 4 14z' }, 'gray')
  ],
  'préstamo': [
    s('path', { d: 'M44 46q-14-8 0-18h20q14 10 0 18q30 12 28 50q-2 32-38 32t-38-32q-2-38 28-50z' }, 'tan', { accent: true }),
    s('path', { d: 'M44 48h20', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 54, cy: 92, r: 12 }, 'yellow'),
    arrow('M96 60q30-10 40 20m-10-4l10 4 4-10', 'green', 5),
    arrow('M136 112q-20 22-40 6m6 10l-6-10 10-4', 'red', 5)
  ],
  'rincón': [
    s('path', { d: 'M14 14h66v84L14 138z' }, 'cream'),
    s('path', { d: 'M80 14h66v124L80 98z' }, 'mint'),
    s('path', { d: 'M14 138l66-40 66 40z' }, 'tan'),
    s('path', { d: 'M80 14v84', ...SW(3) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 80, cy: 108, rx: 24, ry: 12 }, 'orange', { accent: true }),
    s('circle', { cx: 62, cy: 104, r: 9 }, 'orange'),
    s('path', { d: 'M56 98l2-8 4 6M64 96l4-6 1 8', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M102 112q10 4 2 10', ...SW(4) }, 'orange', { stroke: true })
  ],
  sagrado: [
    s('path', { d: halfRays(80, 90, 40, 58, 9), ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 78, r: 26 }, 'cream'),
    s('path', { d: drop(80, 80, 9) }, 'orange', { accent: true }),
    s('rect', { x: 74, y: 88, width: 12, height: 14 }, 'white'),
    s('path', { d: rects([[40, 102, 80, 14], [32, 116, 96, 22]]) }, 'gray'),
    s('path', { d: 'M40 126h80', ...SW(2) }, 'white', { stroke: true })
  ],
  salvaje: [
    s('path', { d: burst(80, 80, 62, 44, 16) }, 'orange'),
    s('circle', { cx: 80, cy: 84, r: 36 }, 'yellow', { accent: true }),
    s('path', { d: dots([[66, 74], [94, 74]], 4) }, 'dark'),
    s('path', { d: 'M72 90h16l-8 8z' }, 'brown'),
    s('path', { d: 'M80 98v6M70 108q10 6 20 0', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: dots([[54, 52], [106, 52]], 9) }, 'orange')
  ],
  'sanción': [
    s('path', { d: 'M70 140V112', ...SW(18) }, 'blue', { stroke: true }),
    s('rect', { x: 48, y: 18, width: 50, height: 70, rx: 4, transform: 'rotate(8 73 53)' }, 'red', { accent: true }),
    s('rect', { x: 54, y: 72, width: 34, height: 40, rx: 10 }, 'skin'),
    s('path', { d: 'M56 76V58', ...SW(10) }, 'skin', { stroke: true }),
    s('path', { d: 'M104 60l20-4v14l-20 4z' }, 'gray'),
    s('path', { d: 'M126 52l8-6M128 64h10M126 76l8 6', ...SW(3) }, 'dark', { stroke: true })
  ],
  'satisfacción': [
    s('circle', { cx: 76, cy: 84, r: 50 }, 'yellow'),
    s('path', { d: 'M52 76q8-8 16 0M86 76q8-8 16 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 98q22 22 44 0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[48, 92], [104, 92]], 7) }, 'pink'),
    s('circle', { cx: 126, cy: 36, r: 16 }, 'green', { accent: true }),
    s('path', { d: 'M119 36l5 5 10-10', ...SW(4) }, 'white', { stroke: true })
  ],
  sonoro: [
    s('rect', { x: 26, y: 20, width: 64, height: 120, rx: 8 }, 'dark'),
    s('circle', { cx: 58, cy: 100, r: 24 }, 'gray'),
    s('circle', { cx: 58, cy: 100, r: 10 }, 'black'),
    s('circle', { cx: 58, cy: 46, r: 12 }, 'gray'),
    s('path', { d: 'M100 76q10 14 0 28M112 64q18 26 0 52M124 52q26 38 0 76', ...SW(5) }, 'orange', { stroke: true, accent: true })
  ],
  sorprendente: [
    s('path', { d: burst(80, 56, 44, 24, 12) }, 'yellow'),
    s('path', { d: sparkle(30, 40, 9) + sparkle(130, 34, 9) }, 'orange'),
    s('rect', { x: 40, y: 82, width: 80, height: 56, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M80 82v56', ...SW(10) }, 'yellow', { stroke: true }),
    s('rect', { x: 30, y: 70, width: 36, height: 14, rx: 2, transform: 'rotate(-30 48 77)' }, 'red'),
    s('path', { d: dots([[60, 30], [100, 24], [116, 60]], 4) }, 'blue')
  ],
  'soviético': [
    s('path', { d: star(28, 30, 5) + star(130, 128, 6) + star(134, 30, 4) }, 'yellow'),
    s('path', { d: 'M70 70L20 120M78 80L34 136M90 70l40 50M86 80l26 54', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 62, r: 30 }, 'gray', { accent: true }),
    s('path', { d: 'M56 52q24-18 48 0', ...SW(3) }, 'white', { stroke: true })
  ],
  sugerir: [
    ground(),
    ...person(40, 136, 'blue'),
    ...person(124, 136, 'green'),
    s('path', { d: 'M54 20h52a10 10 0 0 1 10 10v28a10 10 0 0 1-10 10H70l-14 12V68h-2a10 10 0 0 1-10-10V30a10 10 0 0 1 10-10z' }, 'sky'),
    s('path', { d: 'M80 28a14 14 0 0 1 8 26v4h-16v-4a14 14 0 0 1 8-26z' }, 'yellow', { accent: true }),
    s('rect', { x: 73, y: 59, width: 14, height: 5, rx: 2 }, 'gray')
  ],
  tela: [
    s('path', { d: 'M60 52h70v80H60z' }, 'pink'),
    s('path', { d: dots([[76, 70], [100, 70], [120, 70], [88, 90], [112, 90], [76, 110], [100, 110], [120, 110]], 4) }, 'white'),
    s('rect', { x: 26, y: 30, width: 40, height: 104, rx: 20 }, 'pink', { accent: true }),
    s('ellipse', { cx: 46, cy: 34, rx: 20, ry: 6 }, 'red'),
    s('path', { d: dots([[40, 60], [52, 80], [40, 100], [52, 120]], 4) }, 'white'),
    s('path', { d: 'M100 140l30-24M100 116l30 24', ...SW(4) }, 'gray', { stroke: true })
  ],
  utilidad: [
    s('path', { d: 'M60 92l-30-50', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M68 88l-6-62', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 92q10-30 34-40l-6 18z' }, 'gray'),
    s('path', { d: 'M100 86l14-44', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 30, y: 86, width: 100, height: 30, rx: 15 }, 'red', { accent: true }),
    s('path', { d: 'M74 101h12M80 95v12', ...SW(4) }, 'white', { stroke: true })
  ]
};
