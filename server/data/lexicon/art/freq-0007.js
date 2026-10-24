// Illustration specs for common words, batch 0007 (plus leftovers of 0006) (see server/scripts/lexicon/art.js)
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

module.exports = {
  oh: [
    s('circle', { cx: 80, cy: 84, r: 54 }, 'yellow'),
    s('path', { d: 'M48 50q10-10 20-4M92 46q10-6 20 4', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[62, 70], [98, 70]], 6) }, 'dark'),
    s('ellipse', { cx: 80, cy: 106, rx: 13, ry: 17 }, 'dark', { accent: true }),
    s('path', { d: 'M132 22l-6 14M146 40l-12 6M118 16l0 12', ...SW(4) }, 'orange', { stroke: true })
  ],
  pa: [
    ground(),
    ...person(62, 136, 'navy', { h: 60, w: 38, r: 16, accent: true }),
    s('path', { d: 'M53 48q9-6 18 0q-9 4-18 0z' }, 'brown'),
    s('path', { d: 'M78 104l24 10', ...SW(7) }, 'skin', { stroke: true }),
    ...person(112, 136, 'orange', { h: 30, w: 22, r: 11 })
  ],
  permiso: [
    s('rect', { x: 22, y: 34, width: 116, height: 84, rx: 8 }, 'cream'),
    outline({ x: 22, y: 34, width: 116, height: 84, rx: 8 }, 'tan'),
    s('rect', { x: 34, y: 48, width: 34, height: 42, rx: 4 }, 'sky'),
    s('circle', { cx: 51, cy: 62, r: 8 }, 'skin'),
    s('path', { d: 'M78 54h46M78 68h36M34 104h50', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 116, cy: 98, r: 18 }, 'green', { accent: true }),
    s('path', { d: 'M107 98l6 6 11-12', ...SW(5) }, 'white', { stroke: true })
  ],
  'presentación': [
    s('path', { d: 'M96 106l-14 30M118 106v30M140 106l14 30', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 70, y: 24, width: 76, height: 84, rx: 4 }, 'white'),
    outline({ x: 70, y: 24, width: 76, height: 84, rx: 4 }),
    s('path', { d: rects([[82, 74, 12, 24], [100, 58, 12, 40], [118, 40, 12, 58]]) }, 'blue', { accent: true }),
    ...person(36, 136, 'red', { h: 50, w: 30, r: 13 }),
    s('path', { d: 'M46 96 74 64', ...SW(6) }, 'skin', { stroke: true })
  ],
  reconocimiento: [
    s('rect', { x: 18, y: 28, width: 110, height: 84, rx: 4 }, 'cream'),
    outline({ x: 18, y: 28, width: 110, height: 84, rx: 4 }, 'orange'),
    s('path', { d: 'M34 50h78M34 66h60M34 82h44', ...SW(5) }, 'tan', { stroke: true }),
    s('path', { d: 'M104 112l-8 30 14-8 10 12 4-30zM124 112l2 30 10-10 12 6-6-28z' }, 'red'),
    s('path', { d: burst(118, 102, 24, 19, 14) }, 'yellow', { accent: true }),
    s('path', { d: star(118, 102, 11) }, 'orange')
  ],
  regreso: [
    ground(),
    s('path', { d: 'M18 92 50 64l32 28z' }, 'red'),
    s('rect', { x: 24, y: 90, width: 52, height: 46 }, 'cream'),
    s('rect', { x: 42, y: 108, width: 16, height: 28, rx: 2 }, 'brown'),
    s('path', { d: 'M90 116h28q22 0 22-24t-22-24H70', ...SW(7) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M80 56l-14 12 14 12', ...SW(7) }, 'orange', { stroke: true })
  ],
  representante: [
    s('path', { d: busts([34, 62, 98, 126], 96, 26, 26) }, 'gray'),
    s('path', { d: dots([[34, 58], [62, 54], [98, 54], [126, 58]], 10) }, 'tan'),
    ...person(80, 140, 'navy', { h: 56, w: 40, r: 16, accent: true }),
    s('path', { d: 'M80 86l-5 6 5 26 5-26z' }, 'red'),
    s('path', { d: 'M60 92 46 64', ...SW(7) }, 'skin', { stroke: true })
  ],
  tenia: [
    s('path', { d: 'M24 120q20-30 40-10t40-6 20-40 14-38', ...SW(14) }, 'cream', { stroke: true }),
    s('path', { d: 'M24 120q20-30 40-10t40-6 20-40 14-38', ...SW(14, { 'stroke-linecap': 'butt', 'stroke-dasharray': '2 9' }) }, 'tan', { stroke: true }),
    s('circle', { cx: 138, cy: 24, r: 9 }, 'pink', { accent: true }),
    s('path', { d: 'M20 36q20-14 40 0', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[134, 22], [142, 22]], 2) }, 'dark')
  ],
  utilizar: [
    s('rect', { x: 16, y: 112, width: 128, height: 24, rx: 3 }, 'brown'),
    s('path', { d: 'M100 112V92', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 96 92 44', ...SW(9) }, 'tan', { stroke: true }),
    s('rect', { x: 78, y: 22, width: 26, height: 46, rx: 4, transform: 'rotate(45 91 45)' }, 'dark', { accent: true }),
    s('path', { d: 'M114 86l10-8M118 100h12M108 74l4-12', ...SW(4) }, 'orange', { stroke: true }),
    s('circle', { cx: 42, cy: 94, r: 10 }, 'skin')
  ],
  'víctima': [
    ...person(80, 138, 'sky', { h: 56, w: 40, r: 20 }),
    s('path', { d: 'M61 54q19-10 38 0', ...SW(8) }, 'white', { stroke: true, lineColor: 'dark' }),
    s('path', { d: 'M71 66l6 2M89 68l6-2M72 76q8-4 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 92 96 124', ...SW(12) }, 'white', { stroke: true, lineColor: 'dark' }),
    s('path', { d: 'M64 92 96 124', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 102, y: 100, width: 22, height: 10, rx: 3, transform: 'rotate(-30 113 105)' }, 'pink', { accent: true })
  ],
  beneficio: [
    s('path', { d: 'M58 42h44l-8 14q38 18 34 56-2 24-48 24t-48-24q-4-38 34-56z' }, 'tan'),
    s('path', { d: 'M62 42h36', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 102, r: 20 }, 'yellow'),
    s('path', { d: 'M80 92v20M70 102h20', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M126 52V18M114 30l12-12 12 12', ...SW(6) }, 'green', { stroke: true, accent: true })
  ],
  'categoría': [
    s('path', { d: 'M16 92h40l-4 44H20zM60 92h40l-4 44H64zM104 92h40l-4 44h-32z' }, 'gray'),
    s('path', { d: dots([[28, 80], [44, 80], [36, 66]], 7) }, 'red', { accent: true }),
    s('path', { d: rects([[66, 74, 13, 13], [81, 74, 13, 13], [73, 60, 13, 13]]) }, 'blue'),
    s('path', { d: 'M108 87l8-14 8 14zM126 87l8-14 8 14zM117 71l8-14 8 14z' }, 'green'),
    s('path', { d: 'M24 112h24M68 112h24M112 112h24', ...SW(4) }, 'white', { stroke: true })
  ],
  claramente: [
    s('path', { d: 'M14 80q66-60 132 0q-66 60-132 0z' }, 'white'),
    s('path', { d: 'M14 80q66-60 132 0q-66 60-132 0z', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 24 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 10 }, 'black'),
    s('circle', { cx: 88, cy: 72, r: 5 }, 'white'),
    s('path', { d: 'M80 14v14M40 26l8 10M120 26l-8 10M80 132v14', ...SW(5) }, 'yellow', { stroke: true })
  ],
  concurso: [
    ground(140),
    s('path', { d: 'M80 18v28', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 18h20l-6 7 6 7H80z' }, 'red', { accent: true }),
    ...person(36, 136, 'blue', { h: 34, w: 22, r: 10 }),
    ...person(80, 136, 'red', { h: 34, w: 22, r: 10 }),
    ...person(124, 136, 'green', { h: 34, w: 22, r: 10 }),
    s('path', { d: 'M18 52h20M14 62h18M62 52h18', ...SW(3) }, 'gray', { stroke: true })
  ],
  decreto: [
    s('rect', { x: 34, y: 26, width: 92, height: 108 }, 'cream'),
    s('path', { d: 'M28 20h104a8 8 0 0 1 0 16H28a8 8 0 0 1 0-16zM28 124h104a8 8 0 0 1 0 16H28a8 8 0 0 1 0-16z' }, 'tan'),
    s('path', { d: 'M48 50h64M48 64h64M48 78h64M48 92h36', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 112l-6 20 10-6 6 10 4-20z' }, 'red'),
    s('circle', { cx: 104, cy: 108, r: 13 }, 'red', { accent: true }),
    s('circle', { cx: 104, cy: 108, r: 6 }, 'pink')
  ],
  ejecutivo: [
    ...person(66, 138, 'navy', { h: 60, w: 40, r: 16, accent: true }),
    s('path', { d: 'M58 78h16l-8 10z' }, 'white'),
    s('path', { d: 'M66 86l-4 6 4 24 4-24z' }, 'red'),
    s('path', { d: 'M86 92 104 108', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 96, y: 110, width: 44, height: 30, rx: 4 }, 'brown'),
    s('path', { d: 'M110 110v-6h16v6', ...SW(4) }, 'dark', { stroke: true })
  ],
  estrategia: [
    s('rect', { x: 18, y: 22, width: 124, height: 116, rx: 6 }, 'green'),
    s('path', { d: 'M80 22v116M18 80h124', ...SW(2) }, 'mint', { stroke: true }),
    s('path', { d: 'M34 104l14 14M48 104l-14 14M108 40l14 14M122 40l-14 14', ...SW(5) }, 'white', { stroke: true }),
    s('circle', { cx: 112, cy: 110, r: 9, ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M48 98q10-50 54-54M92 36l12 8-10 12', ...SW(5, { 'stroke-dasharray': '1 10' }) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M92 36l12 8-10 12', ...SW(5) }, 'orange', { stroke: true })
  ],
  generalmente: [
    s('rect', { x: 18, y: 28, width: 124, height: 108, rx: 8 }, 'white'),
    outline({ x: 18, y: 28, width: 124, height: 108, rx: 8 }),
    s('rect', { x: 18, y: 28, width: 124, height: 22, rx: 8 }, 'blue'),
    s('path', { d: [30, 58, 86, 114].flatMap(x => [62, 90, 116].map(y => `M${x} ${y + 6}l5 5 9-10`)).filter((_, i) => i !== 7).join(''), ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M88 102l12 12M100 102l-12 12', ...SW(4) }, 'red', { stroke: true })
  ],
  indio: [
    s('path', { d: 'M90 46q6-34 18-36-2 22-12 38z' }, 'red', { accent: true }),
    s('path', { d: 'M98 46q-2-10 4-28', ...SW(2) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 64, r: 18 }, 'skin'),
    s('path', { d: 'M62 52q18-20 36 0v4H62z' }, 'black'),
    s('path', { d: 'M62 54h36', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: busts([80], 138, 60, 52) }, 'tan'),
    s('path', { d: 'M56 106h48', ...SW(5, { 'stroke-dasharray': '6 6' }) }, 'red', { stroke: true })
  ],
  jaja: [
    s('circle', { cx: 80, cy: 82, r: 56 }, 'yellow'),
    s('path', { d: 'M50 66l12-8 12 8M86 66l12-8 12 8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M46 86h68q-4 36-34 36t-34-36z' }, 'dark', { accent: true }),
    s('path', { d: 'M60 110q20-10 40 0q-8 10-20 10t-20-10z' }, 'red'),
    s('path', { d: 'M38 74q-10 10-4 18 8-4 4-18zM122 74q10 10 4 18-8-4-4-18z' }, 'sky')
  ],
  latino: [
    s('path', { d: 'M64 96 30 136M96 96l34 40', ...SW(8) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 58, cy: 64, rx: 26, ry: 34, transform: 'rotate(30 58 64)' }, 'red', { accent: true }),
    s('ellipse', { cx: 102, cy: 64, rx: 26, ry: 34, transform: 'rotate(-30 102 64)' }, 'yellow'),
    s('path', { d: 'M40 52q14 6 30 0M90 52q16 6 30 0', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: dots([[54, 84], [106, 84]], 4) }, 'white'),
    s('path', { d: 'M20 34l10 6M140 34l-10 6M80 20v12', ...SW(4) }, 'orange', { stroke: true })
  ],
  municipio: [
    ground(),
    s('rect', { x: 64, y: 30, width: 32, height: 106 }, 'cream'),
    s('path', { d: 'M60 32 80 12l20 20z' }, 'red'),
    s('circle', { cx: 80, cy: 50, r: 10 }, 'white'),
    s('path', { d: 'M80 44v6l4 3', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 104 38 86l20 18zM102 104l20-18 20 18z' }, 'orange'),
    s('path', { d: rects([[22, 102, 32, 34], [106, 102, 32, 34]]) }, 'tan'),
    s('rect', { x: 72, y: 110, width: 16, height: 26, rx: 2 }, 'blue', { accent: true })
  ],
  patria: [
    s('path', { d: heart(80, 94, 36) }, 'red', { accent: true }),
    s('path', { d: 'M56 86 80 64l24 22z' }, 'cream'),
    s('rect', { x: 62, y: 84, width: 36, height: 28 }, 'white'),
    s('rect', { x: 74, y: 96, width: 12, height: 16 }, 'brown'),
    s('path', { d: 'M94 70V42', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M94 42h18l-5 6 5 6H94z' }, 'yellow')
  ],
  penal: [
    s('rect', { x: 36, y: 118, width: 88, height: 18, rx: 4 }, 'brown'),
    s('path', { d: 'M56 112h48', ...SW(10) }, 'brown', { stroke: true }),
    s('path', { d: 'M62 86 112 36', ...SW(8) }, 'tan', { stroke: true }),
    s('rect', { x: 20, y: 54, width: 60, height: 26, rx: 5, transform: 'rotate(45 50 67)' }, 'brown', { accent: true }),
    s('path', { d: 'M24 108l12-6M30 124h-12M134 108l-12-6', ...SW(4) }, 'orange', { stroke: true })
  ],
  pensamiento: [
    s('path', { d: 'M30 140v-24q-16-8-14-34 2-34 36-38 30-2 38 26l10 18-10 4v12q0 8-14 8v28z' }, 'skin'),
    s('path', { d: 'M28 60q10-26 44-18', ...SW(10) }, 'brown', { stroke: true }),
    s('path', { d: dots([[100, 60], [110, 48]], 4) }, 'sky'),
    s('path', { d: 'M108 40q-10-16 6-22 6-10 18-4 14-2 14 12 4 12-8 16-6 8-18 4-12 4-12-6z' }, 'sky', { accent: true }),
    ...gear(126, 24, 5, 6, 'navy')
  ],
  referir: [
    ...person(36, 136, 'green', { h: 50, w: 30, r: 13 }),
    s('path', { d: 'M52 34h56a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8H72l-14 10 2-10h-8a8 8 0 0 1-8-8V42a8 8 0 0 1 8-8z' }, 'white'),
    s('path', { d: 'M52 34h56a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8H72l-14 10 2-10h-8a8 8 0 0 1-8-8V42a8 8 0 0 1 8-8z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 52h28M94 52l-6-6M94 52l-6 6', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M86 52h12M76 104h36M104 96l10 8-10 8', ...SW(5) }, 'orange', { stroke: true, accent: true }),
    s('rect', { x: 118, y: 86, width: 28, height: 36, rx: 3 }, 'blue')
  ],
  sentimiento: [
    ...person(80, 140, 'sky', { h: 62, w: 52, r: 18 }),
    s('path', { d: heart(80, 100, 16) }, 'red', { accent: true }),
    s('path', { d: heart(126, 50, 9) + heart(34, 62, 7) }, 'pink'),
    s('path', { d: 'M72 40a3 3 0 0 0 0 1M88 40a3 3 0 0 0 0 1', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M73 48q7 6 14 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  accidente: [
    ground(),
    s('path', { d: 'M14 128v-22l12-18h34l10 18v22z' }, 'blue'),
    s('path', { d: 'M146 128v-22l-12-18h-34l-8 12 12-4z' }, 'red'),
    s('path', { d: 'M90 128v-22l12-4 44 4v22z' }, 'red'),
    s('path', { d: dots([[32, 130], [56, 130], [104, 130], [128, 130]], 8) }, 'dark'),
    s('path', { d: burst(80, 62, 28, 14, 9) }, 'yellow', { accent: true }),
    s('path', { d: burst(80, 62, 14, 7, 9) }, 'orange')
  ],
  actualidad: [
    s('rect', { x: 14, y: 36, width: 98, height: 100, rx: 4 }, 'white'),
    outline({ x: 14, y: 36, width: 98, height: 100, rx: 4 }),
    s('rect', { x: 24, y: 46, width: 78, height: 14 }, 'dark'),
    s('rect', { x: 24, y: 68, width: 34, height: 30 }, 'sky'),
    s('path', { d: 'M66 72h36M66 84h36M66 96h28M24 110h78M24 122h60', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 120, cy: 42, r: 26 }, 'orange', { accent: true }),
    s('circle', { cx: 120, cy: 42, r: 19 }, 'cream'),
    s('path', { d: 'M120 30v12l8 6', ...SW(4) }, 'dark', { stroke: true })
  ],
  alimento: [
    s('ellipse', { cx: 80, cy: 112, rx: 66, ry: 20 }, 'white'),
    s('ellipse', { cx: 80, cy: 112, rx: 66, ry: 20, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M26 106q0-30 28-30t28 30z' }, 'tan'),
    s('circle', { cx: 100, cy: 86, r: 22 }, 'red', { accent: true }),
    s('path', { d: 'M100 64q2-10 8-14', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M104 56q10-8 18-2-8 8-18 2z' }, 'green'),
    s('path', { d: 'M118 112l24-38', ...SW(9) }, 'orange', { stroke: true })
  ],
  aproximadamente: [
    s('rect', { x: 14, y: 96, width: 132, height: 34, rx: 4 }, 'yellow'),
    s('path', { d: 'M28 96v12M44 96v8M60 96v12M76 96v8M92 96v12M108 96v8M124 96v12M140 96v8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M76 82v-8h52v8', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M54 36q13-14 26 0t26 0M54 58q13-14 26 0t26 0', ...SW(8) }, 'blue', { stroke: true, accent: true })
  ],
  bandera: [
    s('path', { d: 'M34 18v124', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M37 24q24-12 50 0t52 0v62q-26 12-52 0t-50 0z' }, 'red', { accent: true }),
    s('path', { d: 'M37 44q24-12 50 0t52 0v22q-26 12-52 0t-50 0z' }, 'yellow'),
    s('circle', { cx: 34, cy: 16, r: 6 }, 'orange')
  ],
  celular: [
    s('rect', { x: 52, y: 22, width: 56, height: 104, rx: 10 }, 'navy', { accent: true }),
    s('rect', { x: 58, y: 34, width: 44, height: 78, rx: 3 }, 'mint'),
    s('path', { d: 'M38 146v-38q0-10 14-18M122 146v-30q0-12-14-18', ...SW(16) }, 'skin', { stroke: true }),
    s('path', { d: 'M116 30q10 10 0 22M126 22q18 18 0 38', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: dots([[70, 48], [90, 48], [70, 68], [90, 68]], 6) }, 'blue')
  ],
  costo: [
    s('path', { d: 'M20 80 72 28h50v50l-52 52z' }, 'orange', { accent: true }),
    s('circle', { cx: 102, cy: 48, r: 8 }, 'white'),
    s('path', { d: 'M102 48q26-30 40-30', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 112, cy: 116, r: 24 }, 'yellow'),
    s('circle', { cx: 112, cy: 116, r: 16, ...SW(3) }, 'orange', { stroke: true })
  ],
  delito: [
    ...person(66, 138, 'dark', { h: 56, w: 38, r: 16 }),
    s('rect', { x: 50, y: 52, width: 32, height: 10, rx: 4 }, 'black'),
    s('path', { d: dots([[60, 57], [72, 57]], 3) }, 'white'),
    s('path', { d: 'M86 98l14-6', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M108 82q-8 4-10 10 20-2 26 0-2-6-10-10l4-8h-14z' }, 'tan'),
    s('path', { d: 'M100 92q-14 12-8 30 4 12 22 12t22-12q6-18-8-30z' }, 'tan', { accent: true }),
    s('path', { d: 'M38 74q-10 0-14 8', ...SW(3) }, 'gray', { stroke: true })
  ],
  disco: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'black'),
    s('circle', { cx: 80, cy: 80, r: 50, ...SW(2) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 38, ...SW(2) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 22 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 4 }, 'white'),
    s('path', { d: 'M40 50q10-14 26-20', ...SW(4) }, 'gray', { stroke: true })
  ],
  entrega: [
    ground(),
    s('rect', { x: 104, y: 36, width: 40, height: 100 }, 'brown'),
    s('circle', { cx: 112, cy: 90, r: 3 }, 'yellow'),
    ...person(44, 136, 'red', { h: 54, w: 34, r: 14 }),
    s('path', { d: 'M28 52h32q-4-14-16-14t-16 14z' }, 'red'),
    s('rect', { x: 60, y: 76, width: 38, height: 32, rx: 2 }, 'tan', { accent: true }),
    s('path', { d: 'M60 90h38M79 76v32', ...SW(3) }, 'brown', { stroke: true })
  ],
  escritor: [
    s('rect', { x: 18, y: 32, width: 96, height: 110, rx: 4 }, 'cream'),
    outline({ x: 18, y: 32, width: 96, height: 110, rx: 4 }, 'tan'),
    s('path', { d: 'M32 54h68M32 70h68M32 86h52M32 102h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M82 118q4-50 60-104-6 50-48 90z' }, 'white'),
    s('path', { d: 'M82 118q4-50 60-104-6 50-48 90z', ...SW(3) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M80 124l6-12', ...SW(4) }, 'dark', { stroke: true })
  ],
  etapa: [
    s('path', { d: 'M14 136v-24h32V88h32V64h32V40h36v96z' }, 'tan'),
    s('path', { d: 'M14 112h32V88h32V64h32V40h36', ...SW(4) }, 'brown', { stroke: true }),
    ...person(62, 88, 'blue', { h: 26, w: 18, r: 9, accent: true }),
    s('path', { d: 'M128 40V14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M128 14h16l-5 6 5 6h-16z' }, 'red')
  ],
  funcionario: [
    ...person(80, 112, 'gray', { h: 48, w: 40, r: 15 }),
    s('path', { d: 'M70 64l10 22 10-22', ...SW(2) }, 'blue', { stroke: true }),
    s('rect', { x: 72, y: 84, width: 16, height: 20, rx: 2 }, 'white'),
    s('rect', { x: 72, y: 84, width: 16, height: 7 }, 'blue', { accent: true }),
    s('rect', { x: 16, y: 108, width: 128, height: 30, rx: 4 }, 'brown'),
    s('rect', { x: 34, y: 98, width: 34, height: 10 }, 'cream'),
    s('path', { d: 'M114 96v-8h12v8zM110 96h20v8h-20z' }, 'red')
  ],
  hermoso: [
    ground(),
    ...flower(42, 76, 'pink'),
    ...flower(80, 54, 'purple'),
    ...flower(118, 80, 'red'),
    s('path', { d: star(132, 32, 9, 3) + star(24, 34, 7, 2.5) }, 'yellow')
  ],
  iniciativa: [
    ground(),
    s('path', { d: busts([34, 56, 104, 126], 136, 22, 44) }, 'gray'),
    s('path', { d: dots([[34, 82], [56, 82], [104, 82], [126, 82]], 9) }, 'tan'),
    ...person(80, 136, 'orange', { h: 50, w: 28, r: 12, accent: true }),
    s('path', { d: 'M88 92q10-30 6-60', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 94, cy: 30, r: 6 }, 'skin')
  ],
  liga: [
    s('rect', { x: 18, y: 20, width: 88, height: 104, rx: 6 }, 'white'),
    outline({ x: 18, y: 20, width: 88, height: 104, rx: 6 }),
    s('path', { d: dots([[32, 38], [32, 62], [32, 86], [32, 110]], 6) }, 'blue'),
    s('path', { d: 'M46 38h48M46 62h40M46 86h32M46 110h24', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 120, cy: 116, r: 24 }, 'white'),
    s('circle', { cx: 120, cy: 116, r: 24, ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M120 106l9 7-3 10h-12l-3-10z' }, 'dark', { accent: true })
  ],
  madera: [
    s('rect', { x: 52, y: 44, width: 94, height: 72 }, 'brown'),
    s('path', { d: 'M70 60h60M80 76h58M64 92h54M90 104h40', ...SW(3) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 52, cy: 80, rx: 36, ry: 36 }, 'tan', { accent: true }),
    s('circle', { cx: 52, cy: 80, r: 24, ...SW(3) }, 'brown', { stroke: true }),
    s('circle', { cx: 52, cy: 80, r: 12, ...SW(3) }, 'brown', { stroke: true }),
    s('rect', { x: 20, y: 126, width: 120, height: 12, rx: 3 }, 'orange')
  ],
  precisamente: [
    s('circle', { cx: 74, cy: 86, r: 56 }, 'red'),
    s('circle', { cx: 74, cy: 86, r: 40 }, 'white'),
    s('circle', { cx: 74, cy: 86, r: 24 }, 'red'),
    s('circle', { cx: 74, cy: 86, r: 9 }, 'yellow', { accent: true }),
    s('path', { d: 'M74 86 140 20', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M132 16l12-4-4 12M124 22l12-4M138 30l4-12', ...SW(4) }, 'green', { stroke: true })
  ],
  regional: [
    s('path', { d: 'M24 44l26-22 34 8 30-10 24 26-6 30 12 26-22 30-34-6-30 14-28-22 4-30-14-20z' }, 'mint'),
    s('path', { d: 'M84 30l30-10 24 26-6 30-38 2-14-24z' }, 'green', { accent: true }),
    s('path', { d: 'M84 30 76 54l14 24 42-2M20 64l56-10M40 120l50-42', ...SW(3) }, 'white', { stroke: true, lineColor: 'gray' }),
    s('path', { d: 'M108 70q-14-16-14-26a14 14 0 0 1 28 0q0 10-14 26z' }, 'red'),
    s('circle', { cx: 108, cy: 44, r: 5 }, 'white')
  ],
  'resolución': [
    s('path', { d: burst(116, 40, 26, 8, 8) }, 'yellow'),
    s('path', { d: burst(30, 30, 14, 4, 6) }, 'pink'),
    s('rect', { x: 26, y: 54, width: 78, height: 88, rx: 4 }, 'white'),
    outline({ x: 26, y: 54, width: 78, height: 88, rx: 4 }),
    s('path', { d: 'M36 72l5 5 9-10M36 96l5 5 9-10M36 120l5 5 9-10', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M58 72h36M58 96h36M58 120h28', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M114 104h14l2 36h-18z' }, 'red', { accent: true }),
    s('path', { d: 'M110 104h22', ...SW(5) }, 'skin', { stroke: true })
  ],
  ruta: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'mint'),
    s('path', { d: 'M32 128q0-40 40-40t40-30 10-24', ...SW(12) }, 'white', { stroke: true, lineColor: 'gray' }),
    s('path', { d: 'M32 128q0-40 40-40t40-30 10-24', ...SW(4, { 'stroke-dasharray': '2 9' }) }, 'blue', { stroke: true, accent: true }),
    s('circle', { cx: 32, cy: 128, r: 8 }, 'green'),
    s('path', { d: 'M122 48q-16-16-16-26a16 16 0 0 1 32 0q0 10-16 26z' }, 'red'),
    s('circle', { cx: 122, cy: 22, r: 6 }, 'white')
  ],
  secreto: [
    s('circle', { cx: 74, cy: 78, r: 50 }, 'skin'),
    s('path', { d: 'M24 70q4-50 50-50t50 50q-20-30-50-28T24 70z' }, 'brown'),
    s('path', { d: 'M50 74q8-6 16 0M82 74q8-6 16 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 104h28', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M74 140v-48', ...SW(12) }, 'skin', { stroke: true, accent: true }),
    s('path', { d: 'M74 140v-48', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M118 104q14 2 18 14M124 92q20 2 24 22', ...SW(3) }, 'gray', { stroke: true })
  ],
  tendencia: [
    s('path', { d: 'M24 20v116h120', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: rects([[36, 106, 16, 30], [60, 92, 16, 44], [84, 98, 16, 38], [108, 72, 16, 64]]) }, 'sky'),
    s('path', { d: 'M34 104l28-24 22 10 48-56', ...SW(6) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M114 32l20-2-2 20', ...SW(6) }, 'green', { stroke: true })
  ],
  tradicional: [
    s('path', { d: 'M80 12v14', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 58, y: 24, width: 44, height: 10, rx: 3 }, 'dark'),
    s('ellipse', { cx: 80, cy: 76, rx: 46, ry: 44 }, 'red', { accent: true }),
    s('path', { d: 'M80 32q-24 44 0 88M80 32q24 44 0 88M38 64h84M38 88h84', ...SW(2) }, 'orange', { stroke: true }),
    s('rect', { x: 58, y: 116, width: 44, height: 10, rx: 3 }, 'dark'),
    s('path', { d: 'M74 126v20M80 126v22M86 126v20', ...SW(3) }, 'yellow', { stroke: true })
  ],
  acaso: [
    s('rect', { x: 20, y: 60, width: 64, height: 64, rx: 12, transform: 'rotate(-12 52 92)' }, 'white'),
    s('rect', { x: 20, y: 60, width: 64, height: 64, rx: 12, transform: 'rotate(-12 52 92)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[38, 82], [52, 92], [66, 102], [40, 104], [64, 80]], 6) }, 'dark'),
    s('rect', { x: 88, y: 30, width: 52, height: 52, rx: 10, transform: 'rotate(18 114 56)' }, 'red', { accent: true }),
    s('path', { d: dots([[106, 48], [122, 64]], 5) }, 'white'),
    s('path', { d: 'M100 104q14 10 30 0M110 120q8 6 16 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  aquella: [
    ground(),
    ...person(34, 136, 'blue', { h: 54, w: 32, r: 14 }),
    s('path', { d: 'M48 96 90 76', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M96 92h10', ...SW(3, { 'stroke-dasharray': '2 6' }) }, 'gray', { stroke: true }),
    s('circle', { cx: 130, cy: 102, r: 6 }, 'skin'),
    s('path', { d: 'M126 108h8l7 24h-22z' }, 'purple', { accent: true }),
    s('path', { d: 'M96 120h18', ...SW(3, { 'stroke-dasharray': '3 5' }) }, 'gray', { stroke: true })
  ],
  audiencia: [
    s('rect', { x: 34, y: 14, width: 92, height: 44, rx: 4 }, 'purple'),
    ...person(80, 58, 'yellow', { h: 18, w: 14, r: 7, accent: true }),
    s('path', { d: busts([30, 64, 98, 132], 104, 26, 18) + busts([46, 80, 114], 140, 28, 20) }, 'navy'),
    s('path', { d: dots([[30, 80], [64, 80], [98, 80], [132, 80]], 10) + dots([[46, 114], [80, 114], [114, 114]], 11) }, 'brown')
  ],
  crimen: [
    s('ellipse', { cx: 62, cy: 76, rx: 40, ry: 52 }, 'pink'),
    s('path', { d: 'M62 52a10 14 0 0 1 0 28M62 40a22 26 0 0 1 0 52a22 26 0 0 1-14-44M62 28a34 38 0 0 1 0 76a34 38 0 0 1-30-56M44 116q-20-24-12-60', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 98, cy: 82, r: 30 }, 'sky'),
    s('circle', { cx: 98, cy: 82, r: 30, ...SW(8) }, 'dark', { stroke: true, accent: true }),
    s('path', { d: 'M120 104l22 22', ...SW(12) }, 'brown', { stroke: true }),
    s('path', { d: 'M84 72q14-10 28 0M82 86q16-10 32 0', ...SW(4) }, 'red', { stroke: true })
  ],
  des: [
    s('circle', { cx: 34, cy: 80, r: 18 }, 'red', { accent: true }),
    s('circle', { cx: 34, cy: 80, r: 7 }, 'white'),
    s('path', { d: 'M58 80h80M120 62l18 18-18 18', ...SW(8) }, 'blue', { stroke: true }),
    s('path', { d: 'M34 104v32M20 136h28', ...SW(4) }, 'gray', { stroke: true })
  ],
  disponible: [
    s('path', { d: 'M40 24h60v60H40z' }, 'blue'),
    s('rect', { x: 34, y: 80, width: 72, height: 16, rx: 4 }, 'navy'),
    s('path', { d: 'M42 96v40M98 96v40', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 120, cy: 46, r: 22 }, 'green', { accent: true }),
    s('path', { d: 'M109 46l7 7 13-14', ...SW(5) }, 'white', { stroke: true })
  ],
  droga: [
    s('rect', { x: 28, y: 46, width: 54, height: 90, rx: 8 }, 'orange'),
    s('rect', { x: 24, y: 28, width: 62, height: 22, rx: 4 }, 'white'),
    outline({ x: 24, y: 28, width: 62, height: 22, rx: 4 }),
    s('rect', { x: 36, y: 72, width: 38, height: 38, rx: 3 }, 'white'),
    s('path', { d: 'M55 80v22M44 91h22', ...SW(5) }, 'red', { stroke: true }),
    s('rect', { x: 92, y: 96, width: 52, height: 22, rx: 11, transform: 'rotate(-35 118 107)' }, 'purple', { accent: true }),
    s('circle', { cx: 118, cy: 60, r: 12 }, 'sky')
  ],
  formar: [
    ground(),
    s('rect', { x: 40, y: 104, width: 40, height: 32, rx: 3 }, 'red'),
    s('rect', { x: 80, y: 104, width: 40, height: 32, rx: 3 }, 'blue'),
    s('rect', { x: 40, y: 72, width: 40, height: 32, rx: 3 }, 'green'),
    s('rect', { x: 92, y: 20, width: 40, height: 32, rx: 3, transform: 'rotate(15 112 36)' }, 'yellow', { accent: true }),
    s('path', { d: 'M100 62v24M92 78l8 8 8-8', ...SW(5) }, 'orange', { stroke: true })
  ],
  global: [
    s('circle', { cx: 80, cy: 80, r: 50 }, 'sky'),
    s('path', { d: 'M48 56q14-12 26-2 2 14-10 20-14 2-16-18zM88 84q16-8 26 4-4 20-16 26-12-10-10-30zM44 96q10 6 14 16-10-2-14-16z' }, 'green'),
    s('ellipse', { cx: 80, cy: 80, rx: 68, ry: 22, transform: 'rotate(-20 80 80)', ...SW(5) }, 'orange', { stroke: true, accent: true }),
    s('circle', { cx: 144, cy: 56, r: 5 }, 'red')
  ],
  impacto: [
    s('rect', { x: 14, y: 116, width: 132, height: 22, rx: 4 }, 'brown'),
    s('path', { d: burst(84, 112, 34, 16, 10) }, 'yellow', { accent: true }),
    s('path', { d: burst(84, 112, 18, 8, 10) }, 'orange'),
    s('path', { d: 'M24 18 60 66M42 14l30 40M18 40l28 34', ...SW(6) }, 'orange', { stroke: true }),
    s('circle', { cx: 70, cy: 86, r: 14 }, 'dark')
  ],
  laboral: [
    s('path', { d: 'M30 92q0-50 50-50t50 50z' }, 'yellow', { accent: true }),
    s('rect', { x: 18, y: 90, width: 124, height: 14, rx: 6 }, 'orange'),
    s('rect', { x: 72, y: 36, width: 16, height: 56, rx: 6 }, 'orange'),
    s('path', { d: 'M30 132h100', ...SW(10) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 124l-10 8 10 8M124 124l10 8-10 8', ...SW(6) }, 'dark', { stroke: true })
  ],
  presidencia: [
    s('rect', { x: 46, y: 40, width: 68, height: 72, rx: 14 }, 'navy', { accent: true }),
    s('rect', { x: 36, y: 92, width: 88, height: 22, rx: 8 }, 'red'),
    s('rect', { x: 30, y: 72, width: 14, height: 40, rx: 6 }, 'navy'),
    s('rect', { x: 116, y: 72, width: 14, height: 40, rx: 6 }, 'navy'),
    s('path', { d: 'M48 114v24M112 114v24', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: star(80, 66, 14) }, 'yellow'),
    s('path', { d: star(80, 22, 9) }, 'yellow')
  ],
  publicidad: [
    s('path', { d: 'M60 104v34M100 104v34', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 14, y: 24, width: 132, height: 82, rx: 4 }, 'yellow'),
    s('rect', { x: 22, y: 32, width: 116, height: 66, rx: 2 }, 'white'),
    s('path', { d: 'M38 60l40-16v40L38 68z' }, 'red', { accent: true }),
    s('rect', { x: 30, y: 58, width: 12, height: 12, rx: 2 }, 'red'),
    s('path', { d: 'M88 52q8 12 0 24M98 46q12 18 0 36', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: star(120, 64, 12) }, 'blue')
  ],
  resolver: [
    s('path', { d: 'M24 24h48v14a10 10 0 1 0 0 20v14H58a10 10 0 1 1-20 0H24z' }, 'blue'),
    s('path', { d: 'M72 24h52v48H110a10 10 0 1 0-20 0H72V58a10 10 0 1 1 0-20z' }, 'green'),
    s('path', { d: 'M24 72h14a10 10 0 1 0 20 0h14v14a10 10 0 1 1 0 20v14H24z' }, 'red'),
    s('path', { d: 'M100 96h14a10 10 0 1 1 20 0h14v14a10 10 0 1 0 0 20v14h-48V130a10 10 0 1 1 0-20z', transform: 'translate(-6 -10)' }, 'yellow', { accent: true }),
    s('path', { d: 'M140 70l-10 10M150 84h-10', ...SW(3) }, 'orange', { stroke: true })
  ],
  seguidor: [
    s('circle', { cx: 70, cy: 52, r: 24 }, 'skin'),
    s('path', { d: busts([70], 136, 76, 58) }, 'purple'),
    s('circle', { cx: 118, cy: 108, r: 24 }, 'pink', { accent: true }),
    s('path', { d: 'M118 96v24M106 108h24', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: heart(120, 32, 10) }, 'red')
  ],
  alcanzar: [
    ground(),
    s('path', { d: star(110, 30, 18) }, 'yellow', { accent: true }),
    s('circle', { cx: 70, cy: 52, r: 13 }, 'skin'),
    s('rect', { x: 56, y: 68, width: 28, height: 44, rx: 10 }, 'green'),
    s('path', { d: 'M78 74 98 42M60 76 46 92M64 110l-8 22M76 110l8 18', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M40 132h20M80 132h16', ...SW(3) }, 'gray', { stroke: true })
  ],
  aparte: [
    s('path', { d: dots([[34, 56], [60, 46], [44, 82], [70, 74], [32, 108], [60, 104]], 13) }, 'gray'),
    s('path', { d: 'M92 22v116', ...SW(4, { 'stroke-dasharray': '6 8' }) }, 'dark', { stroke: true }),
    s('circle', { cx: 122, cy: 80, r: 18 }, 'orange', { accent: true }),
    s('path', { d: 'M112 116h24M128 108l8 8-8 8', ...SW(4) }, 'orange', { stroke: true })
  ],
  'colaboración': [
    ground(),
    ...person(32, 136, 'blue', { h: 48, w: 28, r: 12 }),
    ...person(128, 136, 'red', { h: 48, w: 28, r: 12 }),
    s('rect', { x: 50, y: 66, width: 60, height: 40, rx: 3 }, 'tan', { accent: true }),
    s('path', { d: 'M42 98 52 84M118 98l-10-14', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M50 80h60', ...SW(3) }, 'brown', { stroke: true })
  ],
  compromiso: [
    s('path', { d: 'M14 70h38l14 14v26H14z' }, 'blue'),
    s('path', { d: 'M146 70h-38l-14 14v26h52z' }, 'red'),
    s('path', { d: 'M48 76h40q10 0 18 10l6 12q4 10-6 14H58q-10 0-14-8z' }, 'skin', { accent: true }),
    s('path', { d: 'M62 92h34M64 104h30', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: heart(80, 44, 14) }, 'pink'),
    s('path', { d: 'M40 30l8 8M120 30l-8 8', ...SW(4) }, 'orange', { stroke: true })
  ],
  conferencia: [
    s('rect', { x: 22, y: 18, width: 116, height: 50, rx: 4 }, 'sky'),
    s('path', { d: 'M38 54l24-20 18 12 24-18 18 10', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: busts([42, 80, 118], 112, 26, 22) }, 'gray'),
    s('path', { d: dots([[42, 82], [80, 82], [118, 82]], 10) }, 'skin'),
    s('rect', { x: 14, y: 108, width: 132, height: 28, rx: 4 }, 'brown', { accent: true }),
    s('path', { d: 'M54 108l8-12M92 108l8-12', ...SW(3) }, 'dark', { stroke: true })
  ],
  'cáncer': [
    s('path', { d: 'M38 88l-20 10M38 98l-18 18M44 104l-12 22M122 88l20 10M122 98l18 18M116 104l12 22', ...SW(5) }, 'red', { stroke: true }),
    s('ellipse', { cx: 80, cy: 92, rx: 46, ry: 30 }, 'red', { accent: true }),
    s('path', { d: 'M48 70 36 46M112 70l12-24', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M36 46q-20-6-16-24 14 0 18 10l-10 4 12 0q4 10-4 10zM124 46q20-6 16-24-14 0-18 10l10 4-12 0q-4 10 4 10z' }, 'orange'),
    s('path', { d: dots([[68, 70], [92, 70]], 6) }, 'white'),
    s('path', { d: dots([[68, 70], [92, 70]], 3) }, 'black')
  ],
  deuda: [
    s('rect', { x: 18, y: 34, width: 86, height: 50, rx: 4 }, 'green'),
    s('circle', { cx: 61, cy: 59, r: 13 }, 'mint'),
    s('path', { d: 'M54 59h14', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M104 66q16 4 18 22t2 18', ...SW(5, { 'stroke-dasharray': '7 5' }) }, 'gray', { stroke: true }),
    s('circle', { cx: 116, cy: 118, r: 24 }, 'dark', { accent: true }),
    s('path', { d: 'M108 108q6-6 12 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  'división': [
    s('path', { d: 'M74 84V30a54 54 0 0 0-50 76z' }, 'yellow'),
    s('path', { d: 'M74 84 28 112a54 54 0 0 0 92 4z' }, 'orange'),
    s('path', { d: 'M74 84V30a54 54 0 0 1 50 80z' }, 'pink'),
    s('path', { d: 'M92 90l52 28a56 56 0 0 1-48 22z' }, 'red', { accent: true }),
  ],
  enemigo: [
    ...person(36, 138, 'blue', { h: 54, w: 32, r: 14 }),
    ...person(124, 138, 'red', { h: 54, w: 32, r: 14 }),
    s('path', { d: 'M28 62l12 4M132 62l-12 4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 34 68 74h14l-10 34 26-46H82l12-28z' }, 'yellow', { accent: true }),
    s('path', { d: 'M52 102h14M108 102h-14', ...SW(7) }, 'skin', { stroke: true })
  ],
  foro: [
    s('rect', { x: 14, y: 18, width: 84, height: 34, rx: 10 }, 'blue'),
    s('rect', { x: 62, y: 62, width: 84, height: 34, rx: 10 }, 'green', { accent: true }),
    s('rect', { x: 14, y: 106, width: 84, height: 34, rx: 10 }, 'orange'),
    s('path', { d: 'M28 35h56M76 79h56M28 123h40', ...SW(5) }, 'white', { stroke: true })
  ],
  frecuencia: [
    s('rect', { x: 14, y: 26, width: 132, height: 108, rx: 10 }, 'dark'),
    s('path', { d: 'M22 80q6-40 12 0t12 0 12 0 12 0 12 0 12 0 12 0 12 0 12 0 12 0', ...SW(5) }, 'mint', { stroke: true, accent: true }),
    s('path', { d: 'M14 80h132', ...SW(1) }, 'gray', { stroke: true }),
    s('path', { d: dots([[30, 122], [48, 122]], 5) }, 'orange')
  ],
  gasto: [
    s('path', { d: 'M20 76h108a10 10 0 0 1 10 10v42a10 10 0 0 1-10 10H20z' }, 'brown', { accent: true }),
    s('path', { d: 'M20 76l84-22v22' }, 'tan'),
    s('rect', { x: 108, y: 96, width: 30, height: 20, rx: 6 }, 'tan'),
    s('rect', { x: 36, y: 22, width: 40, height: 22, rx: 3, transform: 'rotate(-20 56 33)' }, 'green'),
    s('rect', { x: 86, y: 14, width: 40, height: 22, rx: 3, transform: 'rotate(15 106 25)' }, 'green'),
    s('path', { d: 'M54 60v-10M110 52v-10', ...SW(3) }, 'gray', { stroke: true })
  ],
  herramienta: [
    s('path', { d: 'M36 124 104 56', ...SW(12) }, 'gray', { stroke: true }),
    s('path', { d: 'M100 32a22 22 0 1 0 28 28l-12-4-6-6-4-12z' }, 'gray'),
    s('path', { d: 'M30 132l-6-6 8-8 6 6z' }, 'gray'),
    s('path', { d: 'M58 52 118 112', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 26, y: 24, width: 22, height: 50, rx: 8, transform: 'rotate(-45 37 49)' }, 'red', { accent: true }),
    s('path', { d: 'M118 112l10 10', ...SW(3) }, 'dark', { stroke: true })
  ],
  humanidad: [
    ground(140),
    ...person(24, 136, 'red', { h: 36, w: 20, r: 9 }),
    ...person(52, 136, 'blue', { h: 40, w: 22, r: 10 }),
    ...person(80, 136, 'yellow', { h: 44, w: 24, r: 11, accent: true }),
    ...person(108, 136, 'green', { h: 40, w: 22, r: 10 }),
    ...person(136, 136, 'purple', { h: 36, w: 20, r: 9 }),
    s('path', { d: 'M32 110h12M60 110h12M88 110h12M116 110h12', ...SW(5) }, 'skin', { stroke: true })
  ],
  humor: [
    s('path', { d: 'M18 30h56v34q0 30-28 30T18 64z' }, 'yellow', { accent: true }),
    s('path', { d: 'M30 50q6-6 12 0M50 50q6-6 12 0M30 68q16 14 32 0z', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 60h56v34q0 30-28 30T86 94z' }, 'sky'),
    s('path', { d: 'M98 84q6 6 12 0M118 84q6 6 12 0M100 108q14-12 28 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M46 94q0 30 40 22', ...SW(3) }, 'red', { stroke: true })
  ],
  lima: [
    s('circle', { cx: 58, cy: 90, r: 42 }, 'green'),
    s('circle', { cx: 58, cy: 90, r: 34 }, 'mint', { accent: true }),
    s('path', { d: 'M58 60v60M32 76l52 28M32 104l52-28', ...SW(3) }, 'white', { stroke: true, lineColor: 'green' }),
    s('ellipse', { cx: 114, cy: 60, rx: 30, ry: 26 }, 'green'),
    s('path', { d: 'M128 34q8-14 20-12-4 12-20 12z' }, 'green'),
    s('ellipse', { cx: 104, cy: 52, rx: 8, ry: 4 }, 'mint', { flatOnly: true })
  ],
  lindo: [
    s('path', { d: 'M46 60 38 14q22 4 26 36M114 60l8-46q-22 4-26 36z' }, 'white'),
    s('path', { d: 'M48 46 44 26q10 4 12 18M112 46l4-20q-10 4-12 18', ...SW(4) }, 'pink', { stroke: true }),
    s('ellipse', { cx: 80, cy: 92, rx: 52, ry: 46 }, 'white'),
    s('ellipse', { cx: 80, cy: 92, rx: 52, ry: 46, ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 60 38 14q22 4 26 36M114 60l8-46q-22 4-26 36', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[60, 86], [100, 86]], 7) }, 'dark'),
    s('path', { d: dots([[48, 104], [112, 104]], 8) }, 'pink', { accent: true }),
    s('path', { d: 'M74 100l6 6 6-6M80 106v6', ...SW(3) }, 'dark', { stroke: true })
  ],
  llegado: [
    s('rect', { x: 14, y: 120, width: 132, height: 18, rx: 3 }, 'dark'),
    s('path', { d: 'M24 129h16M56 129h16M88 129h16M120 129h16', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M38 46l70 32 26-2q10 4 0 10l-30 2-74-28z' }, 'blue', { accent: true }),
    s('path', { d: 'M78 64l-6-30 12 4 18 32zM88 86l-14 18 10 2 20-18z' }, 'navy'),
    s('path', { d: 'M28 40l-6-14 10 2 14 18z' }, 'navy'),
    s('path', { d: 'M108 104l14 10', ...SW(4) }, 'orange', { stroke: true })
  ],
  merecer: [
    ...person(54, 138, 'blue', { h: 56, w: 34, r: 15 }),
    s('path', { d: 'M38 98 26 78', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M48 62l6 14 6-14', ...SW(4) }, 'red', { stroke: true }),
    s('circle', { cx: 54, cy: 86, r: 10 }, 'yellow', { accent: true }),
    s('path', { d: star(116, 52, 26) }, 'yellow'),
    s('path', { d: 'M108 96l-6 10M124 96l6 10M116 90v14', ...SW(4) }, 'orange', { stroke: true })
  ],
  moral: [
    s('path', { d: 'M80 34v94M50 134h60', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M28 58 132 40', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M28 58l-14 30h28zM132 40l-14 30h28z', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: heart(28, 70, 18) }, 'red', { accent: true }),
    s('circle', { cx: 132, cy: 62, r: 8 }, 'yellow'),
    s('ellipse', { cx: 80, cy: 22, rx: 20, ry: 6, ...SW(4) }, 'yellow', { stroke: true })
  ],
  norma: [
    s('path', { d: 'M18 140V40l100 100z' }, 'sky'),
    s('path', { d: 'M34 124V80l44 44z' }, 'white'),
    s('rect', { x: 52, y: 20, width: 28, height: 118, rx: 3, transform: 'rotate(40 66 79)' }, 'yellow', { accent: true }),
    s('path', { d: 'M40 120l-4 2M46 112l-6 3M52 104l-4 2M58 96l-6 3M64 88l-4 2M70 80l-6 3M76 72l-4 2M82 64l-6 3M88 56l-4 2M94 48l-6 3', ...SW(2) }, 'dark', { stroke: true, flatOnly: true }),
    s('path', { d: 'M110 30l8 8 16-18', ...SW(6) }, 'green', { stroke: true })
  ],
  palacio: [
    s('rect', { x: 14, y: 132, width: 132, height: 8 }, 'gray'),
    s('rect', { x: 40, y: 72, width: 80, height: 60 }, 'cream'),
    s('path', { d: 'M56 72q0-34 24-44 24 10 24 44z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 28V14', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: rects([[16, 60, 22, 72], [122, 60, 22, 72]]) }, 'tan'),
    s('path', { d: 'M14 62l13-20 13 20zM120 62l13-20 13 20z' }, 'red'),
    s('path', { d: 'M72 132v-22q8-10 16 0v22zM50 84h10v16H50zM100 84h10v16h-10z' }, 'brown')
  ],
  plataforma: [
    s('rect', { x: 14, y: 26, width: 132, height: 70, rx: 12 }, 'red', { accent: true }),
    s('path', { d: rects([[26, 40, 26, 22], [62, 40, 26, 22], [98, 40, 26, 22]]) }, 'sky'),
    s('rect', { x: 14, y: 76, width: 132, height: 8 }, 'white'),
    s('rect', { x: 14, y: 106, width: 132, height: 32, rx: 2 }, 'gray'),
    s('path', { d: 'M14 108h132', ...SW(5, { 'stroke-dasharray': '10 6', 'stroke-linecap': 'butt' }) }, 'yellow', { stroke: true }),
    s('path', { d: dots([[40, 98], [120, 98]], 6) }, 'dark')
  ],
  'religión': [
    s('path', { d: 'M80 14v16M40 30l10 12M120 30l-10 12M24 66h14M122 66h14', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M79 46q-6 0-10 10l-12 46-12 14 34 2z' }, 'skin', { accent: true }),
    s('path', { d: 'M81 46q6 0 10 10l12 46 12 14-34 2z' }, 'skin'),
    s('path', { d: 'M80 50v68M70 74l-8 18M90 74l8 18', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M38 112l42 6v24H34zM122 112l-42 6v24h46z' }, 'purple')
  ],
  'rápidamente': [
    s('circle', { cx: 96, cy: 34, r: 13 }, 'skin'),
    s('path', { d: 'M84 50 70 92', ...SW(18) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M82 58l24 10 10-12M80 60 62 72 52 64M70 92l22 14-4 22M70 92l-18 18-16-4', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M14 52h28M20 72h22M14 92h20', ...SW(5) }, 'sky', { stroke: true }),
    s('path', { d: 'M86 128h10M30 106h10', ...SW(6) }, 'dark', { stroke: true })
  ],
  agente: [
    ...person(80, 140, 'black', { h: 60, w: 46, r: 20 }),
    s('path', { d: 'M70 80h20l-10 14z' }, 'white'),
    s('path', { d: 'M80 88l-4 6 4 30 4-30z' }, 'black'),
    s('path', { d: 'M62 54h36v6q-4 8-12 6l-6-4-6 4q-8 2-12-6z' }, 'black', { accent: true }),
    s('path', { d: 'M100 60q6 6 0 18', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 40q20-14 40 0', ...SW(6) }, 'dark', { stroke: true })
  ],
  as: [
    s('rect', { x: 34, y: 16, width: 92, height: 128, rx: 10 }, 'white'),
    outline({ x: 34, y: 16, width: 92, height: 128, rx: 10 }, 'dark'),
    s('path', { d: 'M80 48q-30 24-30 40 0 14 14 14 8 0 12-6l-6 18h20l-6-18q4 6 12 6 14 0 14-14 0-16-30-40z' }, 'black', { accent: true }),
    s('path', { d: 'M50 28l-6 14M50 28l6 14M46 36h8M110 132l-6-14M110 132l6-14M106 124h8', ...SW(3) }, 'red', { stroke: true })
  ],
  breve: [
    s('rect', { x: 18, y: 36, width: 124, height: 16, rx: 8 }, 'gray'),
    s('rect', { x: 18, y: 66, width: 36, height: 16, rx: 8 }, 'orange', { accent: true }),
    s('circle', { cx: 104, cy: 108, r: 30 }, 'white'),
    s('circle', { cx: 104, cy: 108, r: 30, ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M104 108V84a24 24 0 0 1 14 5z' }, 'red'),
    s('path', { d: 'M98 74h12M104 74v4', ...SW(4) }, 'dark', { stroke: true })
  ],
  'capítulo': [
    s('path', { d: 'M80 46q-30-14-64-6v90q34-8 64 6zM80 46q30-14 64-6v90q-34-8-64 6z' }, 'white'),
    s('path', { d: 'M80 46q-30-14-64-6v90q34-8 64 6q30-14 64 6V40q-34-8-64 6zM80 46v90', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 64h34M96 78h34M96 92h34M96 106h24M30 64h34M30 78h34', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 28, y: 88, width: 40, height: 22, rx: 3 }, 'sky'),
    s('path', { d: 'M110 42V14h14v34l-7-6z' }, 'red', { accent: true }),
    s('path', { d: 'M54 38V22h10v18z' }, 'green')
  ],
  cliente: [
    ...person(60, 138, 'green', { h: 56, w: 34, r: 15 }),
    s('path', { d: 'M76 96 96 104', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M92 100h44l4 40H88z' }, 'pink', { accent: true }),
    s('path', { d: 'M104 102q0-16 10-16t10 16', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M112 118l-6 6 6 6 6-6z' }, 'white')
  ],
  impuesto: [
    s('path', { d: 'M14 68 80 32l66 36z' }, 'gray'),
    s('rect', { x: 20, y: 66, width: 120, height: 10 }, 'gray'),
    s('path', { d: rects([[30, 78, 12, 46], [58, 78, 12, 46], [90, 78, 12, 46], [118, 78, 12, 46]]) }, 'cream'),
    s('rect', { x: 16, y: 124, width: 128, height: 14 }, 'gray'),
    s('circle', { cx: 80, cy: 52, r: 11 }, 'yellow', { accent: true }),
    s('path', { d: 'M80 14v18', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M74 24l6 8 6-8', ...SW(4) }, 'orange', { stroke: true })
  ],
  inmediatamente: [
    s('circle', { cx: 74, cy: 88, r: 50 }, 'white'),
    s('circle', { cx: 74, cy: 88, r: 50, ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 64, y: 22, width: 20, height: 12, rx: 3 }, 'dark'),
    s('path', { d: 'M74 88V54', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M128 22l-22 34h14l-14 32 34-42h-16l14-24z' }, 'yellow', { accent: true }),
    s('circle', { cx: 74, cy: 88, r: 5 }, 'dark')
  ],
  novela: [
    s('rect', { x: 36, y: 18, width: 88, height: 116, rx: 4 }, 'purple', { accent: true }),
    s('rect', { x: 36, y: 18, width: 14, height: 116 }, 'navy'),
    s('rect', { x: 50, y: 130, width: 74, height: 10 }, 'cream'),
    s('path', { d: heart(87, 62, 18) }, 'pink'),
    s('path', { d: 'M66 104h44M72 116h32', ...SW(4) }, 'yellow', { stroke: true })
  ],
  'prisión': [
    s('rect', { x: 14, y: 70, width: 132, height: 68 }, 'gray'),
    s('path', { d: 'M14 70v-8h12v8M38 70v-8h12v8M62 70v-8h12v8M86 70v-8h12v8M110 70v-8h12v8M134 70v-8h12v8' }, 'gray'),
    s('rect', { x: 60, y: 24, width: 40, height: 46 }, 'dark'),
    s('path', { d: 'M54 26 80 10l26 16z' }, 'dark', { accent: true }),
    s('rect', { x: 68, y: 34, width: 24, height: 14 }, 'yellow'),
    s('path', { d: rects([[26, 86, 24, 26], [110, 86, 24, 26]]) }, 'navy'),
    s('path', { d: 'M34 86v26M42 86v26M118 86v26M126 86v26', ...SW(3) }, 'white', { stroke: true }),
    s('rect', { x: 64, y: 98, width: 32, height: 40, rx: 2 }, 'orange')
  ],
  defender: [
    s('path', { d: 'M80 18l50 16v38q0 42-50 68-50-26-50-68V34z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 32l36 12v28q0 32-36 52z' }, 'sky'),
    s('path', { d: star(80, 74, 18) }, 'yellow'),
    s('path', { d: 'M14 26 34 44M22 62l18 6M18 100l18-10', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M36 46l-2-10-8 4M38 68l-6-8-4 8', ...SW(4) }, 'red', { stroke: true })
  ],
  evidencia: [
    s('rect', { x: 14, y: 88, width: 132, height: 50, rx: 6 }, 'tan'),
    s('path', { d: 'M18 96l22-60 22 60zM96 80l22-60 22 60z' }, 'yellow', { accent: true }),
    s('path', { d: 'M18 96h44M96 80h44', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 58v18M118 42v18', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 128q-6-12 0-20 8-2 8 8t-8 12zM84 118q-6-12 0-20 8-2 8 8t-8 12zM112 108q-6-12 0-20 8-2 8 8t-8 12z' }, 'brown')
  ],
  firma: [
    s('rect', { x: 18, y: 18, width: 96, height: 124, rx: 4 }, 'white'),
    outline({ x: 18, y: 18, width: 96, height: 124, rx: 4 }),
    s('path', { d: 'M32 38h68M32 52h68M32 66h68M32 80h48', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 116q8-22 14-4t12-2 10-6 8 8q6 2 14-6', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M30 126h70', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 112, y: 34, width: 14, height: 80, rx: 4, transform: 'rotate(35 119 74)' }, 'navy', { accent: true }),
    s('path', { d: 'M94 110l-6 12 12-6z' }, 'dark')
  ]
};
