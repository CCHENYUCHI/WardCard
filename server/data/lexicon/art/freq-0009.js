// Illustration specs for common words, batch 0009 (plus leftovers of 0008) (see server/scripts/lexicon/art.js)
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

// Path data: seat dots on a half-ring of radius r around (80, base), split left / middle / right
const hemi = (r, n, base = 118) => Array.from({ length: n }, (_, i) => {
  const a = Math.PI * (1 - i / (n - 1));
  return [+(80 + r * Math.cos(a)).toFixed(1), +(base - r * Math.sin(a)).toFixed(1)];
});
const seats = [...hemi(34, 7), ...hemi(48, 9), ...hemi(62, 11)];

module.exports = {
  'cariño': [
    ...person(62, 136, 'blue', { h: 50, w: 34 }),
    ...person(100, 136, 'pink', { h: 30, w: 24, r: 10 }),
    s('path', { d: 'M74 98q22-12 36 4', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: heart(80, 36, 12) }, 'red', { accent: true }),
    ground()
  ],
  constitucional: [
    s('rect', { x: 42, y: 26, width: 88, height: 112, rx: 4 }, 'cream'),
    s('rect', { x: 32, y: 20, width: 88, height: 112, rx: 6 }, 'navy', { accent: true }),
    s('path', { d: 'M58 60h36M76 46l-18 14M76 46l18 14', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: rects([[60, 64, 6, 30], [73, 64, 6, 30], [86, 64, 6, 30]]) }, 'yellow'),
    s('rect', { x: 54, y: 96, width: 44, height: 7, rx: 2 }, 'yellow'),
    s('path', { d: 'M48 112h56', ...SW(4) }, 'sky', { stroke: true })
  ],
  controlar: [
    s('rect', { x: 16, y: 36, width: 128, height: 92, rx: 10 }, 'dark'),
    s('path', { d: 'M38 52v60M62 52v60', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: rects([[30, 64, 16, 10], [54, 90, 16, 10]]) }, 'orange'),
    s('circle', { cx: 108, cy: 70, r: 20 }, 'gray'),
    s('path', { d: 'M108 70l12-12', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 96, cy: 110, r: 7 }, 'green', { accent: true }),
    s('circle', { cx: 120, cy: 110, r: 7 }, 'red')
  ],
  coronel: [
    ...person(80, 140, 'green', { h: 52, w: 40, r: 14 }),
    s('path', { d: 'M64 66q0-22 16-22t16 22z' }, 'green'),
    s('path', { d: 'M60 66h40', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: star(80, 56, 5) }, 'yellow'),
    s('path', { d: rects([[60, 90, 14, 6], [86, 90, 14, 6]]) }, 'yellow'),
    s('path', { d: star(70, 112, 7) + star(90, 112, 7) }, 'yellow', { accent: true })
  ],
  disfrutar: [
    s('circle', { cx: 80, cy: 66, r: 42 }, 'skin'),
    s('path', { d: 'M58 58q7-8 14 0M88 58q7-8 14 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[54, 76], [106, 76]], 6) }, 'pink'),
    s('path', { d: 'M42 98a38 38 0 0 0 76 0z' }, 'green'),
    s('path', { d: 'M48 98a32 32 0 0 0 64 0z' }, 'red', { accent: true }),
    s('path', { d: dots([[66, 108], [80, 114], [94, 108]], 2.5) }, 'black'),
    s('path', { d: star(134, 26, 9) + star(24, 34, 6) }, 'yellow')
  ],
  entero: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'tan'),
    s('circle', { cx: 80, cy: 80, r: 52 }, 'red'),
    s('circle', { cx: 80, cy: 80, r: 47 }, 'yellow', { accent: true }),
    s('path', { d: dots([[62, 52], [104, 60], [52, 92], [96, 104], [76, 80], [112, 86], [70, 116]], 7) }, 'red'),
    s('path', { d: 'M80 28v104M28 80h104M43 43l74 74M117 43l-74 74', ...SW(2) }, 'tan', { stroke: true })
  ],
  excepto: [
    s('ellipse', { cx: 60, cy: 92, rx: 50, ry: 38, ...SW(4, { 'stroke-dasharray': '8 8' }) }, 'gray', { stroke: true }),
    s('path', { d: dots([[34, 78], [60, 78], [86, 78]], 9) }, 'skin'),
    s('path', { d: busts([34, 60, 86], 116, 20, 26) }, 'green'),
    s('circle', { cx: 132, cy: 78, r: 9 }, 'skin'),
    s('path', { d: busts([132], 116, 20, 26) }, 'red', { accent: true })
  ],
  'filosofía': [
    s('rect', { x: 30, y: 118, width: 64, height: 18, rx: 3 }, 'gray'),
    s('path', { d: 'M30 118q0-30 32-30t32 30z' }, 'gray'),
    s('circle', { cx: 62, cy: 66, r: 20 }, 'gray'),
    s('path', { d: 'M48 74q14 22 28 0', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: dots([[92, 56], [102, 46]], 4) }, 'sky'),
    s('ellipse', { cx: 122, cy: 32, rx: 22, ry: 16 }, 'sky'),
    s('path', { d: 'M122 32a4 4 0 1 1 4 4a8 8 0 1 1 -8 -8a12 12 0 1 1 12 12', ...SW(3) }, 'purple', { stroke: true, accent: true })
  ],
  licencia: [
    s('rect', { x: 16, y: 34, width: 128, height: 92, rx: 10 }, 'sky'),
    s('path', { d: 'M16 54V44a10 10 0 0 1 10-10h108a10 10 0 0 1 10 10v10z' }, 'blue', { accent: true }),
    s('rect', { x: 26, y: 62, width: 38, height: 52, rx: 4 }, 'white'),
    s('circle', { cx: 45, cy: 82, r: 10 }, 'skin'),
    s('path', { d: busts([45], 114, 28, 20) }, 'dark'),
    s('path', { d: 'M76 70h54M76 84h44M76 98h50', ...SW(4) }, 'navy', { stroke: true }),
    s('circle', { cx: 124, cy: 114, r: 7 }, 'red')
  ],
  parlamento: [
    s('path', { d: dots(seats.filter(([x]) => x < 70), 5) }, 'red'),
    s('path', { d: dots(seats.filter(([x]) => x >= 70 && x <= 90), 5) }, 'yellow'),
    s('path', { d: dots(seats.filter(([x]) => x > 90), 5) }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 106, r: 7 }, 'skin'),
    s('rect', { x: 66, y: 114, width: 28, height: 22, rx: 3 }, 'brown'),
    ground(138)
  ],
  pecho: [
    s('circle', { cx: 80, cy: 32, r: 14 }, 'skin'),
    s('path', { d: 'M40 72l-8 46M120 72l8 46', ...SW(12) }, 'skin', { stroke: true }),
    s('path', { d: 'M36 66q0-14 14-14h60q14 0 14 14l-10 58H46z' }, 'skin', { accent: true }),
    s('rect', { x: 74, y: 42, width: 12, height: 12 }, 'skin'),
    s('path', { d: 'M52 72q14 20 28 6q14 14 28-6M80 82v28', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M46 120h68l-2 18H48z' }, 'blue')
  ],
  pelea: [
    s('path', { d: burst(80, 76, 26, 12) }, 'yellow', { accent: true }),
    ...lean(52, 136, 14, 'blue'),
    ...lean(108, 136, -14, 'red'),
    s('path', { d: 'M62 96l14-14M98 96l-14-14', ...SW(7) }, 'skin', { stroke: true }),
    ground()
  ],
  perfectamente: [
    s('rect', { x: 14, y: 58, width: 132, height: 44, rx: 22 }, 'navy'),
    s('path', { d: star(34, 80, 12) + star(57, 80, 12) + star(80, 80, 12) + star(103, 80, 12) + star(126, 80, 12) }, 'yellow', { accent: true }),
    s('path', { d: 'M80 26v14M58 32l6 10M102 32l-6 10M80 120v14M58 128l6-10M102 128l-6-10', ...SW(4) }, 'orange', { stroke: true })
  ],
  proteger: [
    ...person(30, 136, 'pink', { h: 30, w: 24, r: 10 }),
    s('path', { d: 'M86 34l38 12v30q0 36-38 54q-38-18-38-54V46z' }, 'blue', { accent: true }),
    s('path', { d: star(86, 78, 16) }, 'yellow'),
    s('path', { d: 'M146 54h-12M146 84h-12M140 114h-14', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M134 50l-8 4 8 4zM134 80l-8 4 8 4zM126 110l-8 4 8 4z' }, 'dark'),
    ground()
  ],
  reducir: [
    s('rect', { x: 20, y: 20, width: 120, height: 120, rx: 6, ...SW(4, { 'stroke-dasharray': '8 8' }) }, 'gray', { stroke: true }),
    s('rect', { x: 58, y: 58, width: 44, height: 44, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: 'M32 32l18 18M128 32l-18 18M32 128l18-18M128 128l-18-18', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M50 38v12H38M110 38v12h12M50 122v-12H38M110 122v-12h12', ...SW(6) }, 'orange', { stroke: true })
  ],
  secundaria: [
    s('path', { d: rects([[20, 112, 40, 24], [100, 64, 40, 72]]) }, 'gray'),
    s('rect', { x: 60, y: 88, width: 40, height: 48 }, 'green', { accent: true }),
    s('rect', { x: 32, y: 96, width: 16, height: 16, rx: 2 }, 'yellow'),
    s('rect', { x: 62, y: 60, width: 10, height: 22, rx: 3 }, 'red'),
    ...person(80, 88, 'blue', { h: 30, w: 24, r: 10 }),
    s('path', { d: 'M120 58l-20-8 20-8 20 8z' }, 'dark'),
    s('path', { d: 'M134 52v10', ...SW(3) }, 'yellow', { stroke: true })
  ],
  toque: [
    s('ellipse', { cx: 80, cy: 118, rx: 50, ry: 16, ...SW(4) }, 'sky', { stroke: true }),
    s('ellipse', { cx: 80, cy: 118, rx: 30, ry: 9, ...SW(4) }, 'blue', { stroke: true }),
    s('ellipse', { cx: 80, cy: 118, rx: 12, ry: 4 }, 'orange', { accent: true }),
    s('path', { d: 'M60 14h40v34q0 10-10 10H70q-10 0-10-10z' }, 'skin'),
    s('path', { d: 'M72 40h16v66a8 8 0 0 1-16 0z' }, 'skin'),
    s('path', { d: 'M66 26h28', ...SW(3) }, 'tan', { stroke: true })
  ],
  volumen: [
    s('path', { d: 'M18 64h18l24-22v76l-24-22H18z' }, 'dark'),
    s('path', { d: 'M72 64q10 16 0 32M84 52q18 28 0 56', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: rects([[100, 110, 8, 10], [112, 100, 8, 20], [124, 88, 8, 32], [136, 74, 8, 46]]) }, 'orange', { accent: true }),
    s('path', { d: 'M18 134h126', ...SW(4) }, 'gray', { stroke: true })
  ],
  'ámbito': [
    s('path', { d: 'M24 100l56-30 56 30-56 30z' }, 'green', { accent: true }),
    s('path', { d: 'M24 100v-14M52 115v-14M80 130v-14M108 115v-14M136 100v-14M52 85v-14M80 70v-14M108 85v-14', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M24 90l56-30 56 30-56 30z', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M80 98V68', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 68l18 6-18 6z' }, 'red')
  ],
  alianza: [
    s('circle', { cx: 96, cy: 96, r: 28, ...SW(9) }, 'gray', { stroke: true }),
    s('circle', { cx: 64, cy: 92, r: 28, ...SW(9) }, 'yellow', { stroke: true }),
    s('path', { d: 'M86 72a28 28 0 0 1 4-1', ...SW(9, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M54 54l10-14 10 14-10 10z' }, 'sky', { accent: true }),
    s('path', { d: star(120, 46, 8) + star(34, 132, 6) }, 'yellow')
  ],
  amenaza: [
    s('path', { d: 'M24 136V72q0-46 56-46t56 46v64z' }, 'purple', { accent: true }),
    s('path', { d: 'M28 84L16 54M132 84l12-30', ...SW(10) }, 'purple', { stroke: true }),
    s('path', { d: 'M12 52l4-10 4 10M140 52l4-10 4 10', ...SW(3) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 62, cy: 62, rx: 10, ry: 8 }, 'white'), s('ellipse', { cx: 98, cy: 62, rx: 10, ry: 8 }, 'white'),
    s('path', { d: dots([[64, 63], [96, 63]], 4) }, 'black'),
    s('path', { d: 'M62 82l6 10 6-10zM86 82l6 10 6-10z' }, 'white'),
    ...person(80, 138, 'yellow', { h: 26, w: 22, r: 9 })
  ],
  'campeón': [
    s('rect', { x: 56, y: 94, width: 48, height: 44, rx: 2 }, 'yellow', { accent: true }),
    s('rect', { x: 20, y: 110, width: 36, height: 28, rx: 2 }, 'gray'),
    s('rect', { x: 104, y: 118, width: 36, height: 20, rx: 2 }, 'orange'),
    ...person(80, 94, 'red', { h: 30, w: 26, r: 11 }),
    s('path', { d: 'M70 68q-6-20 2-34M90 68q6-20-2-34', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M68 16h24q0 16-12 18q-12-2-12-18zM76 34h8v4h-8z' }, 'yellow')
  ],
  colectivo: [
    s('rect', { x: 16, y: 46, width: 128, height: 14, rx: 7 }, 'brown', { accent: true }),
    s('path', { d: 'M30 98l-4-40M50 98l4-40M70 98l6-40M90 98l-6-40M110 98l-4-40M130 98l4-40', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: dots([[40, 82], [80, 82], [120, 82]], 11) }, 'skin'),
    s('rect', { x: 27, y: 96, width: 26, height: 40, rx: 9 }, 'blue'),
    s('rect', { x: 67, y: 96, width: 26, height: 40, rx: 9 }, 'green'),
    s('rect', { x: 107, y: 96, width: 26, height: 40, rx: 9 }, 'orange'),
    ground(138)
  ],
  complejo: [
    s('rect', { x: 18, y: 18, width: 124, height: 124, rx: 8 }, 'cream'),
    s('path', { d: 'M28 48V28h104v84M132 132H28V68M48 28v40h20M88 28v20h24v20M48 88h40V68M108 68v44H68M48 108v24M88 88v24', ...SW(6) }, 'navy', { stroke: true }),
    s('circle', { cx: 38, cy: 58, r: 6 }, 'red', { accent: true }),
    s('circle', { cx: 122, cy: 122, r: 6 }, 'green'),
    s('rect', { x: 18, y: 18, width: 124, height: 124, rx: 8, ...SW(3) }, 'tan', { stroke: true })
  ],
  'conexión': [
    s('rect', { x: 92, y: 40, width: 50, height: 80, rx: 10 }, 'white'),
    s('rect', { x: 92, y: 40, width: 50, height: 80, rx: 10, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M108 70h6v20h-6zM120 70h6v20h-6z' }, 'dark'),
    s('path', { d: 'M48 80H30q-10 0-10 12v44', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 46, y: 64, width: 28, height: 32, rx: 6 }, 'blue', { accent: true }),
    s('path', { d: 'M74 72h12v5H74zM74 83h12v5H74z' }, 'gray'),
    s('path', { d: 'M88 46l4-10M80 52l-6-8M96 50l8-6', ...SW(4) }, 'yellow', { stroke: true })
  ],
  consistir: [
    s('path', { d: 'M24 68l56-48 56 48z' }, 'purple', { accent: true }),
    s('path', { d: rects([[30, 104, 32, 32], [98, 70, 32, 32]]) }, 'red'),
    s('path', { d: rects([[64, 104, 32, 32]]) }, 'blue'),
    s('path', { d: rects([[98, 104, 32, 32]]) }, 'green'),
    s('path', { d: rects([[30, 70, 32, 32]]) }, 'yellow'),
    s('path', { d: rects([[64, 70, 32, 32]]) }, 'orange'),
    ground(138)
  ],
  escucha: [
    ...person(56, 136, 'green', { h: 46, w: 32, r: 16 }),
    s('ellipse', { cx: 72, cy: 72, rx: 5, ry: 8 }, 'skin'),
    s('path', { d: 'M66 98q16-6 14-24', ...SW(7) }, 'skin', { stroke: true }),
    s('ellipse', { cx: 80, cy: 68, rx: 6, ry: 10 }, 'skin'),
    s('path', { d: 'M98 58q8 12 0 24M112 50q14 20 0 40M126 42q20 28 0 56', ...SW(5) }, 'blue', { stroke: true, accent: true }),
    ground()
  ],
  'fotografía': [
    s('rect', { x: 30, y: 20, width: 100, height: 120, rx: 4, transform: 'rotate(-6 80 80)' }, 'white'),
    s('rect', { x: 30, y: 20, width: 100, height: 120, rx: 4, transform: 'rotate(-6 80 80)', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 40, y: 30, width: 80, height: 76, transform: 'rotate(-6 80 80)' }, 'sky'),
    s('path', { d: 'M40 106l26-34 18 20 12-12 24 26z', transform: 'rotate(-6 80 80)' }, 'green'),
    s('circle', { cx: 102, cy: 48, r: 9, transform: 'rotate(-6 80 80)' }, 'yellow', { accent: true })
  ],
  'límite': [
    s('path', { d: 'M16 118a64 64 0 0 1 128 0v8H16z' }, 'navy'),
    s('path', { d: 'M28 118A52 52 0 0 1 54 73', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'green', { stroke: true }),
    s('path', { d: 'M54 73A52 52 0 0 1 106 73', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'yellow', { stroke: true }),
    s('path', { d: 'M106 73A52 52 0 0 1 132 118', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M80 118l42-26', ...SW(6) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 118, r: 8 }, 'white')
  ],
  mezcla: [
    s('path', { d: 'M114 18l-26 62', ...SW(6) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 80, cy: 84, rx: 58, ry: 10 }, 'cream'),
    s('path', { d: 'M44 84q18-8 36 0t36 0M60 82q10 6 20 0', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M22 84h116q-6 52-58 52t-58-52z' }, 'blue', { accent: true }),
    s('path', { d: dots([[42, 56], [62, 42]], 5) }, 'green'),
    s('path', { d: dots([[50, 30], [130, 50]], 5) }, 'yellow')
  ],
  'poesía': [
    s('rect', { x: 22, y: 20, width: 80, height: 112, rx: 4 }, 'cream'),
    s('rect', { x: 22, y: 20, width: 80, height: 112, rx: 4, ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M34 40h50M34 52h38M34 64h44M34 86h50M34 98h34M34 110h42', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 110, y: 112, width: 30, height: 26, rx: 6 }, 'dark'),
    s('path', { d: 'M124 112Q116 64 144 18Q150 62 128 112z' }, 'purple', { accent: true }),
    s('path', { d: 'M126 112Q130 60 144 20', ...SW(2) }, 'white', { stroke: true })
  ],
  raza: [
    s('path', { d: 'M46 94q-14-6-12-24', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: rects([[52, 100, 9, 34], [66, 100, 9, 34], [90, 100, 9, 34], [104, 100, 9, 34]]) }, 'brown'),
    s('ellipse', { cx: 80, cy: 96, rx: 36, ry: 18 }, 'brown'),
    s('circle', { cx: 116, cy: 68, r: 16 }, 'brown'),
    s('ellipse', { cx: 130, cy: 74, rx: 9, ry: 7 }, 'tan'),
    s('path', { d: 'M108 56q-12 4-8 24l10-4z' }, 'dark'),
    s('path', { d: dots([[120, 64], [138, 71]], 3) }, 'black'),
    s('circle', { cx: 100, cy: 92, r: 9 }, 'blue', { accent: true }),
    s('path', { d: 'M96 98l-6 16 6-3 3 6 3-16z' }, 'blue'),
    s('circle', { cx: 100, cy: 92, r: 4 }, 'yellow')
  ],
  'reacción': [
    s('path', { d: dots([[64, 36], [80, 28], [96, 38], [80, 44]], 12) }, 'purple'),
    s('path', { d: 'M60 104h40l16 22q3 8-8 8H52q-11 0-8-8z' }, 'green', { accent: true }),
    s('path', { d: dots([[70, 118], [88, 112], [80, 92], [84, 76], [76, 62]], 4) }, 'mint'),
    s('path', { d: 'M72 54h16v28l30 42q4 12-10 12H52q-14 0-10-12l30-42z', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 18l-8-6M112 18l8-6M38 40h-10M122 40h10', ...SW(4) }, 'orange', { stroke: true })
  ],
  'áfrico': [
    s('circle', { cx: 80, cy: 80, r: 64 }, 'sky'),
    s('path', { d: 'M56 34L92 30L104 38L110 50L128 56L126 70L114 84L112 104L100 122L88 128L82 112L78 94L70 82L52 78L36 66L38 50Z', 'stroke-linejoin': 'round' }, 'green', { accent: true }),
    s('ellipse', { cx: 122, cy: 108, rx: 4, ry: 10, transform: 'rotate(20 122 108)' }, 'green'),
    s('path', { d: 'M18 100h20M22 112h14', ...SW(4) }, 'white', { stroke: true })
  ],
  'útil': [
    s('path', { d: 'M46 82L36 30q32 4 46 50z' }, 'gray'),
    s('path', { d: 'M114 82l14-40 7 3-12 39z' }, 'gray'),
    s('path', { d: 'M100 100l20 28 6-4-18-26z' }, 'gray'),
    s('rect', { x: 28, y: 76, width: 104, height: 30, rx: 15 }, 'red', { accent: true }),
    s('path', { d: dots([[44, 91], [116, 91]], 4) }, 'white')
  ],
  amplio: [
    s('rect', { x: 14, y: 46, width: 132, height: 70 }, 'sky'),
    s('rect', { x: 14, y: 116, width: 132, height: 22 }, 'tan'),
    s('path', { d: 'M24 30h112', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M34 20l-10 10 10 10M126 20l10 10-10 10', ...SW(6) }, 'orange', { stroke: true }),
    ...person(80, 128, 'blue', { h: 26, w: 20, r: 9, accent: true }),
    s('rect', { x: 26, y: 58, width: 22, height: 26, rx: 2 }, 'white')
  ],
  denuncia: [
    s('path', { d: 'M18 70h12l42-22v64l-42-22H18z' }, 'red', { accent: true }),
    s('path', { d: 'M32 90l-4 22', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M78 68q6 12 0 24', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M116 46l26 10v24q0 24-26 36q-26-12-26-36V56z' }, 'navy'),
    s('path', { d: star(116, 80, 14) }, 'yellow')
  ],
  desarrollar: [
    s('path', { d: 'M60 30h44M96 22l8 8-8 8', ...SW(5) }, 'orange', { stroke: true }),
    s('rect', { x: 26, y: 50, width: 100, height: 76 }, 'tan'),
    s('rect', { x: 16, y: 44, width: 18, height: 88, rx: 9 }, 'brown'),
    s('rect', { x: 122, y: 44, width: 18, height: 88, rx: 9 }, 'brown'),
    s('path', { d: 'M44 112q16-34 36-20t30-36', ...SW(3, { 'stroke-dasharray': '5 6' }) }, 'red', { stroke: true }),
    s('path', { d: 'M40 80l10-16 10 16zM90 116l8-12 8 12z' }, 'green'),
    s('circle', { cx: 110, cy: 60, r: 6 }, 'red', { accent: true })
  ],
  factor: [
    ...gear(60, 92, 28, 10, 'gray'),
    ...gear(112, 56, 16, 7, 'orange', { accent: true }),
    ...gear(114, 116, 12, 6, 'blue'),
    s('path', { d: dots([[60, 92], [112, 56], [114, 116]], 5) }, 'dark')
  ],
  fase: [
    s('rect', { x: 14, y: 50, width: 132, height: 64, rx: 12 }, 'navy'),
    s('path', { d: dots([[32, 80], [56, 80], [80, 80], [104, 80]], 11) }, 'dark'),
    s('path', { d: 'M56 69a11 11 0 0 1 0 22a6 11 0 0 0 0-22zM80 69a11 11 0 0 1 0 22zM104 69a11 11 0 0 1 0 22a6 11 0 0 1 0-22z' }, 'yellow'),
    s('circle', { cx: 128, cy: 80, r: 11 }, 'yellow', { accent: true }),
    s('path', { d: 'M28 132h104M124 124l8 8-8 8', ...SW(4) }, 'orange', { stroke: true })
  ],
  ideal: [
    s('circle', { cx: 42, cy: 104, r: 14 }, 'skin'),
    s('path', { d: busts([42], 142, 40, 24) }, 'blue'),
    s('path', { d: dots([[64, 86]], 4) + dots([[76, 72]], 6) }, 'sky'),
    s('path', { d: dots([[96, 46], [118, 38], [134, 54], [112, 62], [90, 60]], 15) }, 'sky'),
    s('path', { d: star(112, 50, 13) }, 'yellow', { accent: true }),
    s('path', { d: star(132, 30, 4) + star(90, 36, 4) }, 'white')
  ],
  ilegal: [
    ...person(66, 136, 'dark', { h: 46, w: 32, r: 14 }),
    s('path', { d: 'M52 72q0-20 14-20t14 20z' }, 'navy'),
    s('rect', { x: 52, y: 70, width: 28, height: 8, rx: 4 }, 'black'),
    s('path', { d: dots([[60, 74], [72, 74]], 2) }, 'white'),
    s('ellipse', { cx: 104, cy: 100, rx: 18, ry: 22 }, 'brown'),
    s('path', { d: dots([[100, 96], [110, 106]], 4) }, 'yellow'),
    s('circle', { cx: 124, cy: 36, r: 14, ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M114 26l20 20', ...SW(5) }, 'red', { stroke: true, accent: true })
  ],
  imperio: [
    s('circle', { cx: 80, cy: 96, r: 42 }, 'blue'),
    s('path', { d: 'M58 80q10-12 22-2t6 20-18 8-10-26zM94 104q14-6 20 6t-10 14-10-20z' }, 'green'),
    s('path', { d: 'M38 96h84M80 54v84', ...SW(2) }, 'sky', { stroke: true }),
    s('path', { d: 'M54 52l6-32 12 16 8-22 8 22 12-16 6 32z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[68, 44], [80, 42], [92, 44]], 3) }, 'red')
  ],
  jornada: [
    s('path', { d: 'M22 110a58 58 0 0 1 116 0', ...SW(4, { 'stroke-dasharray': '4 8' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 110a8 8 0 0 1 16 0zM130 110a8 8 0 0 1 16 0z' }, 'orange'),
    s('circle', { cx: 80, cy: 52, r: 12 }, 'yellow', { accent: true }),
    s('path', { d: 'M70 102v-10h20v10', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 52, y: 100, width: 56, height: 36, rx: 6 }, 'brown'),
    s('path', { d: 'M52 114h56', ...SW(3) }, 'dark', { stroke: true })
  ],
  nacimiento: [
    s('path', { d: 'M28 100h104q-4 36-52 36t-52-36z' }, 'tan'),
    s('path', { d: 'M40 104l12 30M64 104l6 32M96 104l-6 32M120 104l-12 30', ...SW(3) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 86, cy: 92, rx: 42, ry: 16 }, 'pink', { accent: true }),
    s('circle', { cx: 50, cy: 86, r: 18 }, 'skin'),
    s('path', { d: 'M42 84q3-3 6 0M54 84q3-3 6 0', ...SW(2.5) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 74q10-14 22-6', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: heart(108, 36, 10) }, 'red'),
    s('path', { d: star(132, 52, 7) + star(84, 28, 6) }, 'yellow')
  ],
  participante: [
    s('path', { d: dots([[28, 104], [132, 104]], 10) }, 'skin'),
    s('path', { d: busts([28, 132], 136, 26, 22) }, 'gray'),
    ...person(80, 136, 'purple', { h: 46, w: 34, r: 14, accent: true }),
    s('path', { d: 'M94 96l14-40', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 108, cy: 54, r: 6 }, 'skin'),
    s('path', { d: 'M72 92l8 14 8-14', ...SW(3) }, 'red', { stroke: true }),
    s('rect', { x: 72, y: 106, width: 16, height: 20, rx: 2 }, 'white')
  ],
  patrimonio: [
    s('path', { d: 'M22 136h116v-8H22zM28 128h104v-8H28z' }, 'gray'),
    s('path', { d: rects([[36, 64, 10, 56], [62, 64, 10, 56], [88, 64, 10, 56]]) }, 'tan'),
    s('path', { d: 'M114 120V92l10-6v34z' }, 'tan'),
    s('path', { d: 'M26 64h80l-6-22L66 26 26 50z' }, 'cream'),
    s('path', { d: 'M26 64l40-38 40 38zM110 60l-10-30', ...SW(3) }, 'brown', { stroke: true }),
    s('circle', { cx: 124, cy: 40, r: 12 }, 'green', { accent: true }),
    s('path', { d: star(124, 40, 7) }, 'yellow')
  ],
  pertenecer: [
    s('path', { d: 'M64 46V34h32v12', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 34, y: 46, width: 92, height: 82, rx: 10 }, 'green', { accent: true }),
    s('path', { d: 'M58 46v82M102 46v82', ...SW(4) }, 'mint', { stroke: true }),
    s('path', { d: 'M126 60q16 6 12 22', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 118, y: 80, width: 28, height: 36, rx: 4 }, 'yellow'),
    s('circle', { cx: 132, cy: 92, r: 5 }, 'dark'),
    s('path', { d: busts([132], 110, 14, 10) }, 'dark'),
    s('path', { d: dots([[48, 134], [112, 134]], 5) }, 'dark')
  ],
  pieza: [
    s('path', { d: 'M34 50h28a12 12 0 1 1 24 0h28v28a12 12 0 1 1 0 24v28H86a12 12 0 1 0-24 0H34v-28a12 12 0 1 0 0-24z' }, 'orange', { accent: true }),
    s('path', { d: 'M44 62v20', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: star(130, 136, 7) + star(24, 34, 6) }, 'yellow')
  ],
  presentado: [
    s('rect', { x: 52, y: 64, width: 56, height: 44, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M80 64v44M52 84h56', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M80 64c-16-20-28-4-10 0zM80 64c16-20 28-4 10 0z' }, 'yellow'),
    s('ellipse', { cx: 80, cy: 112, rx: 56, ry: 7 }, 'gray'),
    s('rect', { x: 70, y: 124, width: 20, height: 18 }, 'navy'),
    s('ellipse', { cx: 80, cy: 122, rx: 14, ry: 6 }, 'skin'),
    s('path', { d: star(128, 46, 8) + star(34, 44, 6) }, 'yellow')
  ],
  recientemente: [
    s('rect', { x: 24, y: 30, width: 112, height: 104, rx: 8 }, 'white'),
    s('rect', { x: 24, y: 30, width: 112, height: 104, rx: 8, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 54V38a8 8 0 0 1 8-8h96a8 8 0 0 1 8 8v16z' }, 'red'),
    s('path', { d: 'M50 22v16M110 22v16', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: rects([[34, 64, 16, 14], [60, 64, 16, 14], [86, 64, 16, 14], [112, 64, 16, 14], [34, 86, 16, 14], [60, 86, 16, 14], [86, 86, 16, 14], [112, 86, 16, 14], [34, 108, 16, 14], [60, 108, 16, 14]]) }, 'gray'),
    s('rect', { x: 86, y: 108, width: 16, height: 14 }, 'orange', { accent: true }),
    s('rect', { x: 112, y: 108, width: 16, height: 14, ...SW(3) }, 'blue', { stroke: true })
  ],
  reconocer: [
    s('rect', { x: 18, y: 24, width: 84, height: 104, rx: 4 }, 'brown'),
    s('rect', { x: 26, y: 32, width: 68, height: 88 }, 'sky'),
    s('circle', { cx: 60, cy: 68, r: 16 }, 'skin'),
    s('path', { d: busts([60], 120, 46, 30) }, 'green', { accent: true }),
    s('circle', { cx: 108, cy: 94, r: 24 }, 'white', { flatOnly: true, }),
    s('circle', { cx: 108, cy: 94, r: 24, ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M126 112l14 14', ...SW(9) }, 'dark', { stroke: true })
  ],
  rostro: [
    s('path', { d: 'M34 86q0-58 46-58t46 58v38H34z' }, 'brown'),
    s('circle', { cx: 80, cy: 84, r: 38 }, 'skin'),
    s('path', { d: 'M44 78q8-36 36-36t36 36q-18-16-36-18-18 2-36 18z' }, 'brown'),
    s('path', { d: dots([[66, 86], [94, 86]], 4) }, 'dark'),
    s('path', { d: dots([[56, 100], [104, 100]], 6) }, 'pink'),
    s('path', { d: 'M68 104q12 12 24 0', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M118 64q12 4 18-6', ...SW(5) }, 'green', { stroke: true }),
    s('circle', { cx: 116, cy: 54, r: 11 }, 'red', { accent: true }),
    s('path', { d: 'M116 54m-5 0a5 5 0 1 1 5 5', ...SW(2) }, 'dark', { stroke: true })
  ],
  significado: [
    s('path', { d: 'M14 130q34-8 66 6 32-14 66-6V68l-8-2v58q-30-4-58 8-28-12-58-8V66l-8 2z' }, 'blue'),
    s('path', { d: 'M22 124q32-4 58 8V76q-26-10-58-6zM138 124q-32-4-58 8V76q26-10 58-6z' }, 'cream'),
    s('path', { d: 'M32 88q20-2 38 4M32 102q20-2 38 4M90 92q18-6 38-4M90 106q18-6 38-4', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 36, r: 15 }, 'yellow', { accent: true }),
    s('rect', { x: 74, y: 50, width: 12, height: 9, rx: 2 }, 'gray'),
    s('path', { d: 'M56 32h-8M104 32h8M62 16l-5-4M98 16l5-4', ...SW(4) }, 'orange', { stroke: true })
  ],
  virgen: [
    s('path', { d: 'M70 18h20v14q0 8 8 16q10 10 10 24v56q0 8-8 8H60q-8 0-8-8V72q0-14 10-24q8-8 8-16z' }, 'yellow', { accent: true }),
    s('rect', { x: 68, y: 12, width: 24, height: 10, rx: 2 }, 'dark'),
    s('rect', { x: 56, y: 84, width: 48, height: 32, rx: 3 }, 'cream'),
    s('ellipse', { cx: 80, cy: 100, rx: 8, ry: 10 }, 'green'),
    s('path', { d: 'M114 96q16 8 24 30', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: dots([[126, 116], [138, 132]], 7) }, 'green'),
    s('ellipse', { cx: 128, cy: 102, rx: 9, ry: 4, transform: 'rotate(30 128 102)' }, 'mint')
  ],
  'actuación': [
    s('path', { d: 'M64 14h32l28 110H36z', opacity: 0.45 }, 'yellow', { flatOnly: true }),
    s('ellipse', { cx: 80, cy: 124, rx: 40, ry: 8 }, 'yellow'),
    ...person(80, 124, 'red', { accent: true }),
    s('path', { d: 'M66 90l-22-18M94 90l22-18', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: dots([[24, 136], [48, 138], [112, 138], [136, 136]], 9) }, 'dark')
  ],
  alcohol: [
    s('path', { d: 'M60 18h16v22q14 8 14 26v62q0 8-8 8H54q-8 0-8-8V66q0-18 14-26z' }, 'brown', { accent: true }),
    s('rect', { x: 58, y: 12, width: 20, height: 9, rx: 2 }, 'dark'),
    s('rect', { x: 50, y: 78, width: 36, height: 30, rx: 3 }, 'cream'),
    s('circle', { cx: 68, cy: 93, r: 7 }, 'red'),
    s('path', { d: 'M102 108h24l-2 28h-20z' }, 'orange'),
    s('path', { d: 'M100 92h28l-4 44h-20z', ...SW(3) }, 'gray', { stroke: true })
  ],
  apertura: [
    s('path', { d: 'M30 50v-20M130 50v-20', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: dots([[30, 26]], 10) }, 'pink'),
    s('path', { d: dots([[130, 26]], 10) }, 'sky'),
    s('path', { d: 'M24 136V70M136 136V70', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 74q22 6 38 20M136 74q-22 6-38 20', ...SW(7) }, 'red', { stroke: true }),
    s('path', { d: 'M80 80L66 44M80 80l14-36M80 80l-10 20M80 80l10 20', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M57 108a9 9 0 1 0 18 0a9 9 0 1 0-18 0M85 108a9 9 0 1 0 18 0a9 9 0 1 0-18 0', ...SW(5) }, 'orange', { stroke: true, accent: true })
  ],
  cierre: [
    s('path', { d: 'M24 14h40l14 66v66H24zM136 14H96l-14 66v66h54z' }, 'navy'),
    s('path', { d: rects([[74, 96, 6, 4], [80, 100, 6, 4], [74, 104, 6, 4], [80, 108, 6, 4], [74, 112, 6, 4], [80, 116, 6, 4], [74, 120, 6, 4], [80, 124, 6, 4], [74, 128, 6, 4], [80, 132, 6, 4], [74, 136, 6, 4], [80, 140, 6, 4]]) }, 'gray'),
    s('path', { d: 'M64 20l12 56M96 20l-12 56', ...SW(3, { 'stroke-dasharray': '3 4' }) }, 'gray', { stroke: true }),
    s('rect', { x: 70, y: 74, width: 20, height: 22, rx: 4 }, 'gray'),
    s('rect', { x: 75, y: 92, width: 10, height: 24, rx: 4 }, 'orange', { accent: true })
  ],
  circunstancia: [
    s('circle', { cx: 80, cy: 80, r: 54, ...SW(3, { 'stroke-dasharray': '6 6' }) }, 'gray', { stroke: true }),
    ...person(80, 112, 'blue', { h: 30, w: 24, r: 11, accent: true }),
    s('circle', { cx: 42, cy: 42, r: 10 }, 'yellow'),
    s('path', { d: dots([[112, 44], [124, 44], [118, 37]], 7) }, 'sky'),
    s('circle', { cx: 42, cy: 114, r: 10 }, 'green'),
    s('path', { d: 'M108 126v-12l10-8 10 8v12z' }, 'red')
  ],
  'definición': [
    s('rect', { x: 16, y: 24, width: 128, height: 88, rx: 8 }, 'dark'),
    s('rect', { x: 24, y: 32, width: 112, height: 72 }, 'sky'),
    s('path', { d: 'M24 104l36-40 24 26 16-14 36 28z' }, 'green', { accent: true }),
    s('circle', { cx: 112, cy: 52, r: 10 }, 'yellow'),
    s('path', { d: 'M34 50v-10h10M126 50v-10h-10M34 86v10h10M126 86v10h-10', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M70 112h20l4 18H66z' }, 'gray'),
    s('path', { d: 'M54 132h52', ...SW(6) }, 'gray', { stroke: true })
  ],
  desastre: [
    s('path', { d: 'M30 24h100M44 42h72M58 60h44M68 78h24M76 96h10', ...SW(9) }, 'gray', { stroke: true }),
    s('rect', { x: 100, y: 104, width: 36, height: 32, transform: 'rotate(14 118 136)' }, 'tan'),
    s('path', { d: 'M96 106l22-20 22 20z', transform: 'rotate(14 118 136)' }, 'red', { accent: true }),
    s('path', { d: dots([[38, 108], [54, 120], [30, 128]], 4) }, 'brown'),
    ground()
  ],
  efectivo: [
    s('rect', { x: 22, y: 46, width: 100, height: 54, rx: 4, transform: 'rotate(-10 72 73)' }, 'mint'),
    s('rect', { x: 26, y: 62, width: 104, height: 56, rx: 4 }, 'green', { accent: true }),
    s('rect', { x: 34, y: 70, width: 88, height: 40, rx: 2, ...SW(3) }, 'mint', { stroke: true }),
    s('circle', { cx: 78, cy: 90, r: 12 }, 'mint'),
    s('circle', { cx: 120, cy: 122, r: 16 }, 'yellow'),
    s('circle', { cx: 120, cy: 122, r: 10, ...SW(3) }, 'orange', { stroke: true })
  ],
  emergencia: [
    s('path', { d: 'M80 34V18M46 50l-12-10M114 50l12-10M34 82H18M126 82h16', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M54 112V82a26 26 0 0 1 52 0v30z' }, 'red', { accent: true }),
    s('path', { d: 'M64 84a16 16 0 0 1 12-14', ...SW(5) }, 'white', { stroke: true }),
    s('rect', { x: 44, y: 110, width: 72, height: 22, rx: 4 }, 'dark')
  ],
  enlace: [
    s('rect', { x: 26, y: 62, width: 60, height: 28, rx: 14, transform: 'rotate(-45 80 76)', ...SW(9) }, 'blue', { stroke: true }),
    s('rect', { x: 74, y: 62, width: 60, height: 28, rx: 14, transform: 'rotate(-45 80 76)', ...SW(9) }, 'navy', { stroke: true }),
    s('path', { d: 'M104 98v38l9-9 7 15 7-3-7-15h13z' }, 'white', { accent: true }),
    s('path', { d: 'M104 98v38l9-9 7 15 7-3-7-15h13z', ...SW(3) }, 'dark', { stroke: true })
  ],
  felicidad: [
    s('ellipse', { cx: 80, cy: 142, rx: 22, ry: 4 }, 'gray'),
    s('path', { d: 'M72 116l-8 16M88 116l8 16', ...SW(6) }, 'dark', { stroke: true }),
    ...person(80, 118, 'orange', { accent: true }),
    s('path', { d: 'M68 80l-14-26M92 80l14-26', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M74 62q6 6 12 0', ...SW(2.5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[30, 40], [128, 70], [40, 90]], 4) }, 'blue'),
    s('path', { d: star(124, 32, 9) + star(28, 64, 6) }, 'yellow')
  ],
  firme: [
    s('rect', { x: 14, y: 128, width: 132, height: 18, rx: 3 }, 'tan'),
    s('path', { d: 'M80 128q-14 6-30 14M80 128q14 6 30 14M80 128v16', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 72, y: 76, width: 16, height: 54 }, 'brown'),
    s('circle', { cx: 84, cy: 54, r: 36 }, 'green', { accent: true }),
    s('path', { d: 'M16 34h18M14 50h22M18 66h14', ...SW(5) }, 'sky', { stroke: true })
  ],
  'fácilmente': [
    ...person(56, 136, 'green'),
    s('path', { d: 'M66 98q20 0 34 4', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M102 102q-14-44 14-84q24 30 4 68z' }, 'purple', { accent: true }),
    s('path', { d: 'M102 104q6-44 14-84', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M50 80q6 6 12 0', ...SW(2.5) }, 'dark', { stroke: true }),
    s('path', { d: star(136, 50, 7) }, 'yellow')
  ],
  'guía': [
    ...person(54, 136, 'orange', { accent: true }),
    s('path', { d: 'M64 96l18-30', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M82 70V20', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 20l28 10-28 10z' }, 'red'),
    s('path', { d: dots([[104, 98], [130, 98]], 9) }, 'skin'),
    s('path', { d: busts([104, 130], 136, 22, 28) }, 'blue'),
    ground()
  ],
  inmediato: [
    s('rect', { x: 112, y: 22, width: 26, height: 64, rx: 8 }, 'dark'),
    s('path', { d: dots([[125, 38], [125, 54]], 7) }, 'gray'),
    s('circle', { cx: 125, cy: 70, r: 8 }, 'green', { accent: true }),
    ...lean(66, 136, 24, 'blue'),
    s('path', { d: 'M74 112l-18 14M86 100l16 8', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M18 76h22M14 92h20M22 108h16', ...SW(5) }, 'gray', { stroke: true }),
    ground()
  ],
  maduro: [
    s('path', { d: 'M28 34q52-10 104 6M58 30v28M112 36v22', ...SW(5) }, 'green', { stroke: true }),
    s('circle', { cx: 58, cy: 92, r: 34 }, 'red', { accent: true }),
    s('circle', { cx: 112, cy: 80, r: 22 }, 'green'),
    s('path', { d: star(58, 60, 11) + star(112, 60, 8) }, 'green'),
    s('ellipse', { cx: 44, cy: 80, rx: 6, ry: 10, transform: 'rotate(30 44 80)' }, 'white')
  ],
  mina: [
    s('path', { d: 'M14 136V84q30-50 66-52t66 52v52z' }, 'brown'),
    s('path', { d: 'M50 136V96a30 30 0 0 1 60 0v40z' }, 'black'),
    s('path', { d: 'M52 136V90h56v46', ...SW(7) }, 'tan', { stroke: true }),
    s('path', { d: dots([[70, 110], [82, 106], [94, 110]], 7) }, 'yellow'),
    s('path', { d: 'M58 112h44l-6 20H64z' }, 'gray', { accent: true }),
    s('path', { d: dots([[68, 134], [92, 134]], 5) }, 'dark'),
    s('path', { d: 'M18 140h124', ...SW(4) }, 'gray', { stroke: true })
  ],
  'máquina': [
    s('rect', { x: 36, y: 20, width: 14, height: 18 }, 'gray'),
    s('rect', { x: 20, y: 36, width: 84, height: 86, rx: 6 }, 'blue', { accent: true }),
    s('rect', { x: 30, y: 48, width: 48, height: 28, rx: 3 }, 'dark'),
    s('path', { d: dots([[42, 62]], 5) }, 'green'),
    s('path', { d: dots([[58, 62]], 5) }, 'yellow'),
    s('path', { d: 'M104 84l18-28', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 122, cy: 54, r: 7 }, 'red'),
    s('path', { d: 'M16 132h128', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 116, y: 108, width: 20, height: 20, rx: 2 }, 'brown'),
    s('path', { d: dots([[40, 98], [62, 98], [84, 98]], 6) }, 'gray')
  ],
  personalidad: [
    s('circle', { cx: 32, cy: 82, r: 18 }, 'skin'),
    s('path', { d: 'M24 78h0M40 78h0', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 90q8 6 16 0M128 92h16', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 76, r: 26 }, 'skin'),
    s('path', { d: 'M54 72q0-30 26-30t26 30q-10-12-26-14-16 2-26 14z' }, 'purple', { accent: true }),
    s('path', { d: 'M66 78q4-6 8 0M86 78q4-6 8 0M68 90q12 12 24 0', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 136, cy: 84, r: 18 }, 'skin'),
    s('path', { d: 'M120 78h32', ...SW(8) }, 'black', { stroke: true }),
    s('path', { d: busts([32, 80, 136], 140, 34, 30) }, 'gray')
  ],
  perspectiva: [
    s('rect', { x: 14, y: 14, width: 132, height: 64 }, 'sky'),
    s('rect', { x: 14, y: 78, width: 132, height: 66 }, 'green'),
    s('path', { d: 'M36 144L78 78h4l42 66z' }, 'dark', { accent: true }),
    s('path', { d: 'M80 86v4M80 98v8M80 116v14', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M14 78L80 78M80 78L146 78', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: dots([[30, 100]], 12) + dots([[52, 86]], 6) + dots([[130, 100]], 12) + dots([[108, 86]], 6) }, 'mint')
  ],
  'peña': [
    s('path', { d: 'M24 136q-8-50 26-78q30-24 66 4q26 26 16 74z' }, 'gray', { accent: true }),
    s('path', { d: 'M70 72l10 14-6 12', ...SW(3) }, 'dark', { stroke: true }),
    ...person(58, 138, 'red', { h: 24, w: 20, r: 9 }),
    ...person(100, 138, 'blue', { h: 24, w: 20, r: 9 }),
    ...note(118, 60, 'orange')
  ],
  recuperar: [
    s('path', { d: 'M40 120q-30-50 20-82', ...SW(4, { 'stroke-dasharray': '4 8' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 30q50 10 30 74', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M114 98l12 8 8-14', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M62 34q14 2 20 22q12-10 28-8', ...SW(11) }, 'brown', { stroke: true }),
    s('path', { d: 'M62 34q14 2 20 22q12-10 28-8', ...SW(3) }, 'yellow', { stroke: true, accent: true }),
    ...person(36, 138, 'green', { h: 30, w: 24, r: 10 }),
    s('path', { d: 'M48 116l14-8', ...SW(6) }, 'skin', { stroke: true })
  ],
  rock: [
    s('path', { d: 'M84 82L128 30', ...SW(9) }, 'brown', { stroke: true }),
    s('path', { d: 'M124 34l6-20 12 6-10 18z' }, 'dark'),
    s('circle', { cx: 56, cy: 108, r: 28 }, 'red', { accent: true }),
    s('circle', { cx: 78, cy: 86, r: 20 }, 'red'),
    s('path', { d: 'M48 104l10 10M58 94l10 10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 114L128 30', ...SW(1.5) }, 'white', { stroke: true }),
    s('path', { d: 'M28 30l-6 14h10l-6 14', ...SW(4) }, 'yellow', { stroke: true })
  ],
  salido: [
    s('path', { d: 'M80 96l-12-8 24-8-24-8 24-8-12-6', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 52, r: 14 }, 'skin'),
    s('path', { d: 'M68 40l12-24 12 24z' }, 'red'),
    s('circle', { cx: 80, cy: 56, r: 4 }, 'red'),
    s('path', { d: 'M40 96L22 66l8-4 18 30z' }, 'navy'),
    s('rect', { x: 40, y: 96, width: 80, height: 40, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: star(80, 116, 10) }, 'yellow')
  ],
  agricultura: [
    s('circle', { cx: 118, cy: 44, r: 16 }, 'yellow', { accent: true }),
    s('path', { d: 'M24 86V66l14-10 14 10v20z' }, 'red'),
    s('path', { d: 'M14 136V86h132v50z' }, 'brown'),
    s('path', { d: 'M30 136L60 86M64 136L74 86M96 136L86 86M130 136L100 86', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M44 118l-4-6M44 118l4-6M70 116l-4-6M70 116l4-6M91 116l-4-6M91 116l4-6M114 118l-4-6M114 118l4-6M54 100l-3-5M54 100l3-5M104 100l-3-5M104 100l3-5', ...SW(3) }, 'green', { stroke: true })
  ],
  alternativa: [
    s('path', { d: 'M80 146v-34l-44-40M80 112l44-40', ...SW(14) }, 'tan', { stroke: true }),
    s('path', { d: 'M80 98V24', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M78 32H44l-10 9 10 9h34z' }, 'blue', { accent: true }),
    s('path', { d: 'M82 56h34l10 9-10 9H82z' }, 'orange')
  ],
  aquellas: [
    s('path', { d: 'M86 120q30-18 60 0v16H86z' }, 'green'),
    ...person(36, 136, 'blue', { accent: true }),
    s('path', { d: 'M48 98l28-14', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M82 82q8-4 12-2', ...SW(2, { 'stroke-dasharray': '2 4' }) }, 'gray', { stroke: true }),
    s('path', { d: dots([[100, 92], [116, 88], [132, 92]], 5) }, 'skin'),
    s('path', { d: 'M97 98h6l5 18H92zM113 94h6l5 18h-16zM129 98h6l5 18h-16z' }, 'pink'),
    ground()
  ],
  argumento: [
    s('path', { d: rects([[16, 52, 36, 44], [62, 52, 36, 44], [108, 52, 36, 44]]) }, 'sky'),
    s('circle', { cx: 34, cy: 68, r: 6 }, 'skin'),
    s('rect', { x: 27, y: 76, width: 14, height: 16, rx: 4 }, 'dark'),
    s('path', { d: burst(80, 74, 14, 7, 8) }, 'red', { accent: true }),
    s('path', { d: heart(126, 72, 11) }, 'pink'),
    s('path', { d: 'M22 130q58-36 116 0', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: dots([[34, 122], [80, 112], [126, 122]], 5) }, 'orange')
  ],
  co: [
    ...person(48, 136, 'green'),
    ...person(112, 136, 'blue'),
    s('path', { d: 'M58 98l18-36M102 98l-18-36', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: burst(80, 50, 16, 7) }, 'yellow', { accent: true }),
    ground()
  ],
  combate: [
    s('path', { d: burst(80, 40, 22, 10) }, 'yellow', { accent: true }),
    s('ellipse', { cx: 52, cy: 76, rx: 22, ry: 26, transform: 'rotate(25 52 104)' }, 'red'),
    s('ellipse', { cx: 72, cy: 86, rx: 8, ry: 12, transform: 'rotate(25 52 104)' }, 'red'),
    s('rect', { x: 36, y: 98, width: 32, height: 22, rx: 5, transform: 'rotate(25 52 104)' }, 'cream'),
    s('ellipse', { cx: 108, cy: 76, rx: 22, ry: 26, transform: 'rotate(-25 108 104)' }, 'blue'),
    s('ellipse', { cx: 88, cy: 86, rx: 8, ry: 12, transform: 'rotate(-25 108 104)' }, 'blue'),
    s('rect', { x: 92, y: 98, width: 32, height: 22, rx: 5, transform: 'rotate(-25 108 104)' }, 'cream')
  ],
  consulta: [
    backdrop('mint'),
    ...person(48, 124, 'white'),
    s('path', { d: 'M40 82q8 18 16 0', ...SW(3) }, 'dark', { stroke: true }),
    ...person(112, 124, 'orange', { h: 38, accent: true }),
    s('rect', { x: 20, y: 106, width: 120, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M30 116v20M130 116v20', ...SW(5) }, 'brown', { stroke: true })
  ],
  corresponder: [
    s('rect', { x: 18, y: 88, width: 52, height: 36, rx: 3 }, 'cream'),
    s('path', { d: 'M18 88h52v36H18zM18 88l26 20 26-20', ...SW(3) }, 'brown', { stroke: true }),
    s('rect', { x: 90, y: 36, width: 52, height: 36, rx: 3 }, 'cream'),
    s('path', { d: 'M90 36h52v36H90zM90 36l26 20 26-20', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 80q2-30 38-34M70 38l8 8-8 8', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M120 80q-2 30-38 34M90 106l-8 8 8 8', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: heart(44, 110, 6) }, 'red', { accent: true })
  ],
  decidido: [
    s('path', { d: 'M14 136L118 52h28v84z' }, 'green'),
    s('path', { d: 'M128 52V20', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M128 20l18 7-18 7z' }, 'red'),
    ...lean(60, 99, 20, 'blue', { accent: true }),
    s('path', { d: 'M74 72l14-14', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 89, cy: 57, r: 5 }, 'skin'),
    s('path', { d: 'M22 66h16M18 80h14', ...SW(4) }, 'gray', { stroke: true })
  ],
  demostrar: [
    s('path', { d: 'M80 84l-8 44M126 84l8 44', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 62, y: 22, width: 82, height: 62, rx: 3 }, 'cream'),
    s('rect', { x: 62, y: 22, width: 82, height: 62, rx: 3, ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: rects([[76, 58, 12, 18], [94, 46, 12, 30], [112, 34, 12, 42]]) }, 'green', { accent: true }),
    ...person(32, 136, 'red'),
    s('path', { d: 'M42 96l46-30', ...SW(3) }, 'dark', { stroke: true }),
    ground()
  ],
  dignidad: [
    s('path', { d: burst(80, 70, 58, 30, 12) }, 'yellow'),
    ...person(80, 136, 'navy', { h: 56, w: 36, r: 15 }),
    s('path', { d: 'M70 80l10 10 10-10z' }, 'white'),
    s('path', { d: 'M80 88l-5 6 5 22 5-22z' }, 'red', { accent: true }),
    ground()
  ],
  extremo: [
    s('path', { d: 'M14 146V64h70l6 8v74z' }, 'brown'),
    s('path', { d: 'M92 136q14-6 28 0t26 0v10H92z' }, 'blue'),
    ...person(72, 64, 'orange', { h: 30, w: 22, r: 10, accent: true }),
    s('path', { d: 'M62 44l-10-10M82 44l10-10', ...SW(5) }, 'skin', { stroke: true }),
    s('path', { d: dots([[100, 92], [106, 112]], 4) }, 'brown')
  ],
  generar: [
    backdrop('sky', 14, 122),
    s('rect', { x: 14, y: 128, width: 132, height: 18, rx: 3 }, 'green'),
    s('path', { d: 'M74 132l4-76h4l4 76z' }, 'white'),
    ...[0, 120, 240].map(r => s('path', { d: 'M80 56l-5-38q5-6 10 0z', transform: `rotate(${r} 80 56)` }, 'white')),
    s('circle', { cx: 80, cy: 56, r: 6 }, 'dark'),
    s('path', { d: 'M124 78l-14 24h10l-8 22 22-30h-10l8-16z' }, 'yellow', { accent: true })
  ],
  gol: [
    backdrop('green'),
    s('path', { d: [34, 46, 58, 70, 82, 94, 106, 118].map(x => `M${x} 44v92`).join('') + [56, 68, 80, 92, 104, 116, 128].map(y => `M28 ${y}h104`).join(''), ...SW(2) }, 'mint', { stroke: true }),
    s('path', { d: 'M24 138V38h112v100', ...SW(7) }, 'white', { stroke: true }),
    s('circle', { cx: 96, cy: 110, r: 16 }, 'white', { accent: true }),
    s('path', { d: 'M96 104l6 4-2 7h-8l-2-7z' }, 'dark'),
    s('path', { d: 'M96 110m-16 0a16 16 0 1 0 32 0a16 16 0 1 0-32 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  inferior: [
    s('rect', { x: 48, y: 20, width: 64, height: 120, rx: 10 }, 'gray'),
    s('circle', { cx: 80, cy: 56, r: 18 }, 'white'),
    s('path', { d: 'M70 62l10-14 10 14z' }, 'gray'),
    s('circle', { cx: 80, cy: 104, r: 18 }, 'orange', { accent: true }),
    s('path', { d: 'M70 98l10 14 10-14z' }, 'white')
  ],
  'prácticamente': [
    s('rect', { x: 18, y: 66, width: 124, height: 28, rx: 14, ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 24, y: 72, width: 104, height: 16, rx: 8 }, 'green', { accent: true }),
    s('path', { d: 'M136 64V30', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M136 30l-18 7 18 7z' }, 'red'),
    s('path', { d: 'M40 110h8M60 110h8M80 110h8', ...SW(5) }, 'gray', { stroke: true })
  ],
  punta: [
    s('rect', { x: 56, y: 68, width: 80, height: 24, transform: 'rotate(-35 80 80)' }, 'yellow', { accent: true }),
    s('rect', { x: 136, y: 68, width: 12, height: 24, rx: 3, transform: 'rotate(-35 80 80)' }, 'pink'),
    s('path', { d: 'M56 68L24 80l32 12z', transform: 'rotate(-35 80 80)' }, 'tan'),
    s('path', { d: 'M34 76.2L24 80l10 3.8z', transform: 'rotate(-35 80 80)' }, 'black'),
    s('path', { d: 'M56 80h80', transform: 'rotate(-35 80 80)', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: star(24, 124, 8) }, 'orange')
  ],
  sub: [
    s('rect', { x: 14, y: 14, width: 132, height: 36, rx: 10 }, 'sky'),
    s('path', { d: 'M14 44q16-8 33 0t33 0 33 0 33 0V136q0 10-10 10H24q-10 0-10-10z' }, 'blue'),
    s('path', { d: 'M86 80V58h8', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 66, y: 78, width: 24, height: 18, rx: 4 }, 'yellow'),
    s('ellipse', { cx: 80, cy: 108, rx: 46, ry: 16 }, 'yellow', { accent: true }),
    s('path', { d: dots([[64, 108], [80, 108], [96, 108]], 4) }, 'sky'),
    s('path', { d: 'M30 100v16', ...SW(4) }, 'dark', { stroke: true })
  ],
  'traducción': [
    s('rect', { x: 14, y: 22, width: 66, height: 44, rx: 12 }, 'blue', { accent: true }),
    s('path', { d: 'M28 64l-4 16 18-16z' }, 'blue'),
    s('path', { d: dots([[32, 44], [47, 44], [62, 44]], 6) }, 'white'),
    s('rect', { x: 80, y: 94, width: 66, height: 44, rx: 12 }, 'orange'),
    s('path', { d: 'M128 136l6 10-18-10z' }, 'orange'),
    s('path', { d: 'M90 124l8-16 8 16zM112 108h12v16h-12zM130 124l6-16 6 16z' }, 'white'),
    s('path', { d: 'M92 44q34 0 34 38M68 116q-34 0-34-38M118 74l8 8 8-8M26 86l8-8 8 8', ...SW(4) }, 'gray', { stroke: true })
  ],
  'ángel': [
    s('path', { d: 'M72 84q-40-30-56 4q14 24 56 8zM88 84q40-30 56 4q-14 24-56 8z' }, 'white'),
    s('path', { d: 'M72 84q-40-30-56 4q14 24 56 8zM88 84q40-30 56 4q-14 24-56 8z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M72 78h16l18 58H54z' }, 'sky', { accent: true }),
    s('circle', { cx: 80, cy: 64, r: 13 }, 'skin'),
    s('ellipse', { cx: 80, cy: 44, rx: 14, ry: 4, ...SW(4) }, 'yellow', { stroke: true })
  ],
  adentro: [
    s('path', { d: 'M38 82l14-14h56l14 14z' }, 'dark'),
    s('path', { d: 'M38 82L22 62l20-4 10 10zM122 82l16-20-20-4-10 10z' }, 'tan'),
    s('rect', { x: 38, y: 82, width: 84, height: 54 }, 'brown', { accent: true }),
    s('path', { d: 'M80 16v52', ...SW(8) }, 'green', { stroke: true }),
    s('path', { d: 'M64 52l16 16 16-16', ...SW(8) }, 'green', { stroke: true })
  ],
  mental: [
    s('path', { d: 'M46 144v-28q-24-12-24-46 0-44 46-48 42-2 52 34l10 22-10 4v16q0 12-14 12h-14v34z' }, 'mint'),
    s('path', { d: heart(70, 64, 18) }, 'red', { accent: true }),
    s('path', { d: 'M70 58q-6-14 6-22', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: star(104, 40, 6) + star(38, 40, 5) }, 'yellow')
  ],
  musical: [
    s('path', { d: 'M14 14h30q-6 60 4 122H14zM146 14h-30q6 60-4 122h34z' }, 'red'),
    ...lady(80, 132, 'purple', { accent: true }),
    s('path', { d: 'M74 88l-18-14M86 88l18-14', ...SW(5) }, 'skin', { stroke: true }),
    ...note(54, 56, 'orange'),
    ...note(98, 46, 'blue'),
    s('path', { d: 'M48 136h64', ...SW(4) }, 'brown', { stroke: true })
  ],
  orgullo: [
    ...person(70, 136, 'green', { h: 48, w: 34, r: 14 }),
    s('path', { d: 'M84 96l16-38', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 101, cy: 54, r: 7 }, 'skin'),
    s('path', { d: 'M62 88l8 16 8-16', ...SW(4) }, 'red', { stroke: true }),
    s('circle', { cx: 70, cy: 112, r: 9 }, 'yellow', { accent: true }),
    s('path', { d: 'M64 74q6 6 12 0', ...SW(2.5) }, 'dark', { stroke: true }),
    s('path', { d: star(122, 40, 8) + star(118, 70, 5) + star(32, 50, 6) }, 'yellow')
  ],
  oriente: [
    s('path', { d: 'M116 66V54M138 76l8-6M94 76l-8-6', ...SW(5) }, 'yellow', { stroke: true }),
    s('circle', { cx: 116, cy: 100, r: 22 }, 'orange'),
    s('rect', { x: 14, y: 100, width: 132, height: 36, rx: 4 }, 'blue'),
    s('circle', { cx: 52, cy: 62, r: 30 }, 'white'),
    s('circle', { cx: 52, cy: 62, r: 30, ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 54l-24 8 24 8z' }, 'gray'),
    s('path', { d: 'M52 54l30 8-30 8z' }, 'red', { accent: true }),
    s('circle', { cx: 52, cy: 62, r: 4 }, 'dark')
  ],
  paciente: [
    s('path', { d: 'M42 96V54M46 104v32M82 104v32', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 38, y: 96, width: 50, height: 8, rx: 2 }, 'brown'),
    s('circle', { cx: 64, cy: 52, r: 12 }, 'skin'),
    s('rect', { x: 52, y: 64, width: 24, height: 36, rx: 8 }, 'blue', { accent: true }),
    s('path', { d: 'M66 94h26v38', ...SW(11) }, 'navy', { stroke: true }),
    s('path', { d: 'M108 36h28M108 96h28', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M112 36h20l-10 30 10 30h-20l10-30z' }, 'sky'),
    s('path', { d: 'M114 96h16l-8-12zM116 42h12l-6 14z' }, 'yellow')
  ],
  paga: [
    s('rect', { x: 44, y: 28, width: 72, height: 40, rx: 3 }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 44, r: 9 }, 'mint'),
    s('rect', { x: 26, y: 56, width: 108, height: 66, rx: 4 }, 'tan'),
    s('path', { d: 'M26 58l54 34 54-34', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: dots([[118, 126], [136, 118]], 10) }, 'yellow'),
    s('path', { d: 'M112 126a6 6 0 1 0 12 0a6 6 0 1 0-12 0M130 118a6 6 0 1 0 12 0a6 6 0 1 0-12 0', ...SW(2) }, 'orange', { stroke: true })
  ],
};
