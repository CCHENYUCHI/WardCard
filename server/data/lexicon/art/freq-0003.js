// Illustration specs for common words, batch 0003 (plus leftovers of 0002) (see server/scripts/lexicon/art.js)
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

module.exports = {
  justo: [
    s('rect', { x: 52, y: 126, width: 56, height: 12, rx: 4 }, 'brown'),
    s('path', { d: 'M80 40v88', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M30 50h100', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M34 50 22 84M34 50l12 34M126 50l-12 34M126 50l12 34', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 84h32a16 16 0 0 1-32 0zM110 84h32a16 16 0 0 1-32 0z' }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 38, r: 7 }, 'yellow')
  ],
  medida: [
    s('rect', { x: 40, y: 62, width: 80, height: 50, rx: 4 }, 'tan'),
    s('path', { d: 'M40 44v14M120 44v14', ...SW(2, { 'stroke-dasharray': '4 4' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M42 40h76M50 32l-8 8 8 8M110 32l8 8-8 8', ...SW(4) }, 'red', { stroke: true }),
    s('rect', { x: 20, y: 118, width: 120, height: 22, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M30 118v10M42 118v6M54 118v10M66 118v6M78 118v10M90 118v6M102 118v10M114 118v6M126 118v10', ...SW(2) }, 'dark', { stroke: true })
  ],
  'éxito': [
    s('circle', { cx: 124, cy: 38, r: 12 }, 'yellow'),
    s('path', { d: 'M14 136 70 50l22 30 14-16 40 72z' }, 'gray'),
    s('path', { d: 'M70 50 57 70l7-3 6 6 7-7z' }, 'white'),
    s('path', { d: 'M70 52V20', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M70 20h28l-6 8 6 8H70z' }, 'red', { accent: true })
  ],
  actividad: [
    ground(),
    s('path', { d: 'M62 58 44 34M84 58l18-24', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M66 86l-12 28M80 86l14 26', ...SW(7) }, 'navy', { stroke: true }),
    s('circle', { cx: 73, cy: 36, r: 12 }, 'skin'),
    s('rect', { x: 60, y: 50, width: 26, height: 40, rx: 9 }, 'orange', { accent: true }),
    s('circle', { cx: 122, cy: 104, r: 14 }, 'red'),
    s('path', { d: 'M26 108h14M22 94h12M30 80h10', ...SW(3) }, 'gray', { stroke: true })
  ],
  adelante: [
    ground(),
    ...person(44, 136, 'green'),
    s('path', { d: 'M72 68h42V50l30 32-30 32V96H72z' }, 'orange', { accent: true })
  ],
  autor: [
    s('rect', { x: 14, y: 104, width: 132, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M24 114v24M136 114v24', ...SW(5) }, 'brown', { stroke: true }),
    ...person(48, 104, 'purple'),
    s('path', { d: 'M76 104l8-10h50l-8 10z' }, 'white'),
    s('path', { d: 'M76 104l8-10h50l-8 10z', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 76 100 94', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M100 98Q110 58 140 36 132 72 100 98z' }, 'blue', { accent: true })
  ],
  baja: [
    s('rect', { x: 14, y: 70, width: 12, height: 64, rx: 4 }, 'brown'),
    s('rect', { x: 18, y: 96, width: 126, height: 16, rx: 4 }, 'brown'),
    s('path', { d: 'M136 112v22', ...SW(6) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 44, cy: 88, rx: 16, ry: 8 }, 'white'),
    s('circle', { cx: 46, cy: 78, r: 12 }, 'skin'),
    s('path', { d: 'M60 78h76a6 6 0 0 1 6 6v12H60z' }, 'blue', { accent: true }),
    s('path', { d: 'M52 84 72 66', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 73, cy: 65, r: 4 }, 'red'),
    s('path', { d: 'M48 44h18l-10 10h18', ...SW(4) }, 'sky', { stroke: true })
  ],
  diferencia: [
    s('rect', { x: 14, y: 40, width: 60, height: 80, rx: 6 }, 'sky'),
    s('rect', { x: 86, y: 40, width: 60, height: 80, rx: 6 }, 'sky'),
    s('path', { d: 'M14 120v-24q30-20 60 0v24zM86 120v-24q30-20 60 0v24z' }, 'green'),
    s('circle', { cx: 44, cy: 66, r: 12 }, 'yellow'),
    s('circle', { cx: 116, cy: 66, r: 12 }, 'red', { accent: true }),
    s('circle', { cx: 116, cy: 66, r: 21, ...SW(3, { 'stroke-dasharray': '6 5' }) }, 'orange', { stroke: true })
  ],
  estilo: [
    s('ellipse', { cx: 80, cy: 66, rx: 62, ry: 12 }, 'dark'),
    s('path', { d: 'M48 64c0-22 6-36 32-36s32 14 32 36z' }, 'dark'),
    s('path', { d: 'M48 56h64v8H48z' }, 'red', { accent: true }),
    s('path', { d: 'M30 98h100', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M34 96h38q0 26-20 26t-18-26zM88 96h38q2 26-18 26t-20-26z' }, 'purple'),
    s('path', { d: 'M44 104l10 8M98 104l10 8', ...SW(3) }, 'white', { stroke: true })
  ],
  ex: [
    s('path', { d: 'M76 48c-18-20-43-16-50 2-8 20 10 44 50 68l-6-22 10-16-12-14z' }, 'pink'),
    s('path', { d: 'M84 48c18-20 43-16 50 2 8 20-10 44-50 68l-6-22 10-16-12-14z' }, 'red', { accent: true }),
    s('path', { d: 'M80 34V22M66 38l-6-10M94 38l6-10', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 138h24M96 138h24', ...SW(4) }, 'gray', { stroke: true })
  ],
  militar: [
    ground(),
    ...person(76, 136, 'green', { w: 36, h: 48, accent: true }),
    s('path', { d: 'M60 72a16 16 0 0 1 32 0h4v6H56v-6z' }, 'dark'),
    s('rect', { x: 58, y: 112, width: 36, height: 6 }, 'brown'),
    s('path', { d: 'M94 96l14-22-14-8', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: star(68, 100, 6) }, 'yellow')
  ],
  muestra: [
    s('path', { d: 'M40 84V56M80 84V56M120 84V56', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M33 44h14v14H33zM73 44h14v14H73zM113 44h14v14h-14z' }, 'yellow', { accent: true }),
    s('path', { d: 'M24 108l4-24h24l4 24zM64 108l4-24h24l4 24zM104 108l4-24h24l4 24z' }, 'white'),
    s('path', { d: 'M24 108l4-24h24l4 24zM64 108l4-24h24l4 24zM104 108l4-24h24l4 24z', ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 14, y: 108, width: 132, height: 12, rx: 4 }, 'gray')
  ],
  oro: [
    s('path', { d: 'M20 136l6-20h28l6 20zM60 136l6-20h28l6 20zM100 136l6-20h28l6 20zM40 116l6-20h28l6 20zM80 116l6-20h28l6 20z' }, 'yellow'),
    s('path', { d: 'M60 96l6-20h28l6 20z' }, 'yellow', { accent: true }),
    s('path', { d: 'M20 136l6-20h28l6 20zM60 136l6-20h28l6 20zM100 136l6-20h28l6 20zM40 116l6-20h28l6 20zM80 116l6-20h28l6 20zM60 96l6-20h28l6 20z', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M118 30l4 10 10 4-10 4-4 10-4-10-10-4 10-4zM40 50l3 7 7 3-7 3-3 7-3-7-7-3 7-3z' }, 'orange')
  ],
  par: [
    s('path', { d: 'M18 110V68h22q6 16 24 22 10 4 10 20z' }, 'red', { accent: true }),
    s('path', { d: 'M86 110V68h22q6 16 24 22 10 4 10 20z' }, 'red'),
    s('path', { d: 'M16 110h60v10H16zM84 110h60v10H84z' }, 'dark'),
    s('path', { d: 'M42 80l8 4M46 88l8 4M110 80l8 4M114 88l8 4', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M18 68h22M86 68h22', ...SW(4) }, 'pink', { stroke: true })
  ],
  plata: [
    s('path', { d: rects([[26, 120, 56, 14], [30, 106, 56, 14], [24, 92, 56, 14], [28, 78, 56, 14]]) }, 'gray'),
    s('path', { d: rects([[26, 120, 56, 14], [30, 106, 56, 14], [24, 92, 56, 14], [28, 78, 56, 14]]), ...SW(2) }, 'dark', { stroke: true }),
    s('circle', { cx: 112, cy: 92, r: 30 }, 'gray', { accent: true }),
    s('circle', { cx: 112, cy: 92, r: 30, ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 112, cy: 92, r: 20, ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M126 36l3 8 8 3-8 3-3 8-3-8-8-3 8-3z' }, 'sky')
  ],
  contigo: [
    ground(),
    ...person(58, 136, 'blue'),
    ...person(100, 136, 'pink', { accent: true }),
    s('path', { d: 'M72 104h14', ...SW(6) }, 'skin', { stroke: true }),
    arrow('M44 34h72m-10-10 10 10-10 10', 'green', 6)
  ],
  defensa: [
    s('path', { d: 'M80 18l54 18v38c0 36-22 58-54 70-32-12-54-34-54-70V36z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 32l40 14v30c0 28-16 46-40 56z' }, 'navy'),
    s('path', { d: 'M80 18l54 18v38c0 36-22 58-54 70-32-12-54-34-54-70V36z', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: star(80, 80, 22) }, 'yellow')
  ],
  'dólar': [
    s('rect', { x: 16, y: 44, width: 128, height: 72, rx: 6 }, 'green'),
    s('rect', { x: 26, y: 54, width: 108, height: 52, rx: 4, ...SW(3) }, 'mint', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 22 }, 'mint'),
    s('path', { d: 'M90 70q-3-7-10-7-10 0-10 8t10 9 10 9q0 8-10 8-7 0-10-6M80 58v44', ...SW(5) }, 'green', { stroke: true, accent: true }),
    s('path', { d: dots([[38, 64], [122, 96]], 5) }, 'mint')
  ],
  fondo: [
    s('path', { d: 'M46 24h68v8l-6 6v88q0 10-10 10H62q-10 0-10-10V38l-6-6z' }, 'sky'),
    s('path', { d: 'M46 24h68v8l-6 6v88q0 10-10 10H62q-10 0-10-10V38l-6-6z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M60 120h40v12H60zM63 108h34v12H63z' }, 'yellow', { accent: true }),
    s('path', { d: 'M60 120h40v12H60zM63 108h34v12H63z', ...SW(2) }, 'orange', { stroke: true }),
    arrow('M80 50v40M70 80l10 10 10-10', 'navy', 5)
  ],
  humano: [
    s('circle', { cx: 80, cy: 80, r: 62, ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M72 92 56 136M88 92l16 44', ...SW(7) }, 'navy', { stroke: true }),
    s('path', { d: 'M70 62 24 58M90 62l46-4', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 80, cy: 38, r: 13 }, 'skin'),
    s('rect', { x: 67, y: 54, width: 26, height: 42, rx: 9 }, 'orange', { accent: true })
  ],
  menor: [
    ground(),
    ...person(54, 136, 'gray', { h: 58, w: 34, r: 14 }),
    ...person(110, 136, 'yellow', { h: 28, w: 22, r: 10, accent: true }),
    s('path', { d: 'M70 98 100 118', ...SW(5) }, 'skin', { stroke: true })
  ],
  ministerio: [
    ground(),
    s('rect', { x: 28, y: 42, width: 104, height: 94 }, 'cream'),
    s('rect', { x: 28, y: 42, width: 104, height: 94, ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: rects([38, 60, 82, 104].flatMap(x => [52, 72, 92].map(y => [x, y, 18, 12]))) }, 'blue'),
    s('rect', { x: 68, y: 112, width: 24, height: 24 }, 'brown'),
    s('path', { d: 'M80 42V16', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 16h26v14H80z' }, 'green', { accent: true }),
    s('path', { d: 'M88 18h10v10H88z' }, 'yellow')
  ],
  puerto: [
    s('rect', { x: 14, y: 106, width: 132, height: 34, rx: 4 }, 'blue'),
    s('path', { d: 'M22 122q8-6 16 0t16 0M86 130q8-6 16 0t16 0', ...SW(3) }, 'sky', { stroke: true }),
    s('rect', { x: 14, y: 94, width: 48, height: 12 }, 'brown'),
    s('path', { d: 'M22 106v20M52 106v20', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M68 92h76l-12 22H80z' }, 'red', { accent: true }),
    s('rect', { x: 86, y: 70, width: 34, height: 22 }, 'white'),
    s('rect', { x: 86, y: 70, width: 34, height: 22, ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 104, y: 52, width: 10, height: 18 }, 'dark')
  ],
  acceso: [
    s('rect', { x: 88, y: 26, width: 48, height: 104, rx: 8 }, 'dark'),
    s('circle', { cx: 112, cy: 48, r: 8 }, 'green', { accent: true }),
    s('rect', { x: 98, y: 70, width: 28, height: 40, rx: 4 }, 'gray'),
    s('rect', { x: 24, y: 70, width: 62, height: 40, rx: 5 }, 'blue'),
    s('rect', { x: 32, y: 80, width: 14, height: 10, rx: 2 }, 'yellow'),
    s('path', { d: 'M32 98h40', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M66 54q8-8 16 0M60 46q14-14 28 0', ...SW(3) }, 'orange', { stroke: true })
  ],
  arma: [
    s('path', { d: 'M80 14l9 14v76H71V28z' }, 'gray', { accent: true }),
    s('path', { d: 'M80 14l9 14v76H71V28z', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 30v70', ...SW(2) }, 'white', { stroke: true }),
    s('rect', { x: 52, y: 102, width: 56, height: 10, rx: 5 }, 'yellow'),
    s('rect', { x: 74, y: 112, width: 12, height: 24, rx: 3 }, 'brown'),
    s('circle', { cx: 80, cy: 140, r: 7 }, 'yellow')
  ],
  'comunicación': [
    ground(),
    ...person(28, 136, 'blue', { w: 24 }),
    ...person(132, 136, 'green', { w: 24 }),
    s('path', { d: 'M54 76q26 16 52 0', ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 68h14v16H40zM106 68h14v16h-14z' }, 'red', { accent: true }),
    s('path', { d: 'M66 54q6 6 0 12M74 48q10 12 0 24', ...SW(3) }, 'orange', { stroke: true })
  ],
  congreso: [
    ground(),
    s('path', { d: dots([[34, 6], [50, 8], [66, 10]].flatMap(([r, n]) => Array.from({ length: n }, (_, i) => [80 + r * Math.cos(Math.PI + i * Math.PI / (n - 1)), 124 + r * Math.sin(Math.PI + i * Math.PI / (n - 1))].map(v => +v.toFixed(1)))).filter(([x]) => x < 80), 6) }, 'blue'),
    s('path', { d: dots([[34, 6], [50, 8], [66, 10]].flatMap(([r, n]) => Array.from({ length: n }, (_, i) => [80 + r * Math.cos(Math.PI + i * Math.PI / (n - 1)), 124 + r * Math.sin(Math.PI + i * Math.PI / (n - 1))].map(v => +v.toFixed(1)))).filter(([x]) => x >= 80), 6) }, 'red'),
    s('circle', { cx: 80, cy: 102, r: 8 }, 'skin'),
    s('rect', { x: 68, y: 112, width: 24, height: 24, rx: 3 }, 'brown', { accent: true })
  ],
  evitar: [
    ground(116),
    s('path', { d: 'M56 116q-2-30 24-36 28 4 26 36z' }, 'gray'),
    s('path', { d: 'M16 106h20c12 0 14-62 44-62s32 62 44 62h12', ...SW(6) }, 'orange', { stroke: true, accent: true }),
    arrow('M128 96l10 10-10 10', 'orange', 6),
  ],
  finalmente: [
    s('path', { d: 'M44 28v104M116 28v104', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M50 28h60c0 30-26 40-26 52s26 22 26 52H50c0-30 26-40 26-52S50 58 50 28z' }, 'sky'),
    s('path', { d: 'M54 132q2-24 26-30 24 6 26 30z' }, 'yellow', { accent: true }),
    s('path', { d: 'M50 28h60c0 30-26 40-26 52s26 22 26 52H50c0-30 26-40 26-52S50 58 50 28z', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 90, r: 3 }, 'orange'),
    s('rect', { x: 36, y: 18, width: 88, height: 12, rx: 4 }, 'brown'),
    s('rect', { x: 36, y: 130, width: 88, height: 12, rx: 4 }, 'brown')
  ],
  fuente: [
    s('path', { d: 'M80 62V30M80 32q-32 0-42 72M80 32q32 0 42 72', ...SW(4) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: dots([[38, 112], [122, 112], [60, 80], [100, 80]], 3) }, 'blue'),
    s('path', { d: 'M54 62h52l-8 12H62z' }, 'gray'),
    s('rect', { x: 74, y: 72, width: 12, height: 40 }, 'gray'),
    s('path', { d: 'M22 110h116l-10 26H32z' }, 'gray'),
    s('rect', { x: 18, y: 104, width: 124, height: 10, rx: 4 }, 'sky')
  ],
  ministro: [
    ground(),
    ...person(66, 136, 'navy', { w: 36, h: 50, accent: true }),
    s('path', { d: 'M58 86h16l-8 14z' }, 'white'),
    s('path', { d: 'M66 88l-4 6 4 22 4-22z' }, 'red'),
    s('path', { d: 'M84 98l18 14', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 96, y: 110, width: 38, height: 26, rx: 3 }, 'brown'),
    s('path', { d: 'M106 110v-6h18v6', ...SW(3) }, 'brown', { stroke: true })
  ],
  producto: [
    s('rect', { x: 14, y: 114, width: 132, height: 12, rx: 6 }, 'dark'),
    s('path', { d: dots([[26, 120], [54, 120], [80, 120], [106, 120], [134, 120]], 3) }, 'gray'),
    s('rect', { x: 42, y: 56, width: 76, height: 58, rx: 3 }, 'orange', { accent: true }),
    s('path', { d: 'M42 70h76', ...SW(3) }, 'brown', { stroke: true }),
    s('rect', { x: 54, y: 80, width: 36, height: 24, rx: 2 }, 'white'),
    s('path', { d: 'M59 84v16M64 84v16M70 84v16M74 84v16M80 84v16M85 84v16', ...SW(2) }, 'dark', { stroke: true })
  ],
  puta: [
    s('circle', { cx: 60, cy: 96, r: 40 }, 'red', { accent: true }),
    s('path', { d: 'M38 80l14 6M82 80l-14 6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[46, 94], [74, 94]], 5) }, 'dark'),
    s('path', { d: 'M46 118q14-10 28 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M90 16h44a12 12 0 0 1 12 12v18a12 12 0 0 1-12 12h-28l-14 12 2-12a12 12 0 0 1-12-12V28a12 12 0 0 1 8-12z' }, 'dark'),
    s('path', { d: star(104, 36, 9) }, 'yellow'),
    s('path', { d: 'M120 28v16M128 28v16M116 32h16M116 40h16', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M138 26l-4 9h6l-4 9', ...SW(2) }, 'orange', { stroke: true })
  ],
  siquiera: [
    s('path', { d: 'M54 84h52v34q0 20-20 20H72q-18 0-18-16z' }, 'skin', { accent: true }),
    s('path', { d: 'M66 84V36a8 8 0 0 1 16 0v48' }, 'skin'),
    s('path', { d: 'M82 96h24M82 108h24M54 98q-12-2-14 10', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: star(112, 36, 12) + star(44, 48, 7) }, 'yellow')
  ],
  'época': [
    s('path', { d: 'M18 100l24-36 24 36z' }, 'yellow'),
    s('path', { d: 'M66 100V70h6v6h6v-6h6v6h6v-6h6v30z' }, 'gray'),
    s('rect', { x: 112, y: 52, width: 22, height: 48 }, 'sky'),
    s('path', { d: 'M14 112h126m-10-8 10 8-10 8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 124v8h36v-8', ...SW(5) }, 'red', { stroke: true, accent: true }),
    s('path', { d: dots([[42, 112], [81, 112], [123, 112]], 5) }, 'dark')
  ],
  conocido: [
    ground(),
    ...person(44, 136, 'orange', { accent: true }),
    ...person(116, 136, 'purple'),
    s('path', { d: 'M58 98l12-30M102 98 90 68', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M74 52q6-6 0-12M86 52q-6-6 0-12', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 34c-6-4-8-8-5-11 2-2 4-1 5 1 1-2 3-3 5-1 3 3 1 7-5 11z' }, 'red')
  ],
  conseguir: [
    s('path', { d: star(96, 58, 40) }, 'yellow', { accent: true }),
    s('path', { d: 'M28 144 66 96', ...SW(14) }, 'skin', { stroke: true }),
    s('circle', { cx: 70, cy: 90, r: 14 }, 'skin'),
    s('path', { d: 'M64 82q8-18 24-10M70 92q14-12 24-2', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M138 28l6-6M144 66h8M126 102l6 6M60 30l-6-6', ...SW(3) }, 'orange', { stroke: true })
  ],
  'construcción': [
    s('rect', { x: 20, y: 98, width: 120, height: 40 }, 'gray'),
    s('path', { d: rects([0, 1, 2].flatMap(r => Array.from({ length: 5 }, (_, i) => [20 + (r % 2 ? 12 : 0) + i * 24 + 1, 125 - r * 13, 22, 12]).filter(([x], i) => x + 22 <= 141 && !(r === 2 && i > 2)))) }, 'red'),
    s('path', { d: 'M26 82a24 24 0 0 1 48 0h6v8H20v-8z' }, 'yellow', { accent: true }),
    s('path', { d: 'M50 58v24', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M100 74l28-18 6 10-28 16z' }, 'gray'),
    s('path', { d: 'M130 60l12-8', ...SW(6) }, 'brown', { stroke: true })
  ],
  corte: [
    s('path', { d: 'M44 104 136 60M62 124 108 30', ...SW(8) }, 'gray', { stroke: true }),
    s('circle', { cx: 34, cy: 108, r: 12, ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 56, cy: 134, r: 12, ...SW(6) }, 'red', { stroke: true }),
    s('circle', { cx: 81, cy: 86, r: 4 }, 'dark'),
    s('path', { d: 'M118 98q6 10 2 22M132 92q4 12-2 22', ...SW(3) }, 'brown', { stroke: true })
  ],
  cualquiera: [
    s('rect', { x: 30, y: 40, width: 100, height: 98, rx: 18 }, 'sky'),
    s('path', { d: dots([[50, 120], [86, 122], [68, 96], [104, 98], [50, 74]], 10) }, 'red'),
    s('path', { d: dots([[68, 120], [104, 122], [86, 96], [50, 98], [86, 72]], 10) }, 'yellow'),
    s('path', { d: dots([[122, 120], [120, 98], [68, 74], [108, 74]], 10) }, 'green'),
    s('rect', { x: 30, y: 40, width: 100, height: 98, rx: 18, ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 40, y: 24, width: 80, height: 16, rx: 4 }, 'pink', { accent: true })
  ],
  departamento: [
    ground(),
    s('rect', { x: 40, y: 18, width: 80, height: 118 }, 'tan'),
    s('path', { d: rects([50, 90].flatMap(x => [28, 54, 80].map(y => [x, y, 20, 16]))) }, 'sky'),
    s('rect', { x: 90, y: 54, width: 20, height: 16 }, 'yellow', { accent: true }),
    s('path', { d: 'M46 48h28M86 48h28M46 74h28M86 74h28M46 100h28M86 100h28', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 68, y: 112, width: 24, height: 24 }, 'brown')
  ],
  presente: [
    s('rect', { x: 34, y: 72, width: 92, height: 64, rx: 4 }, 'red', { accent: true }),
    s('rect', { x: 28, y: 58, width: 104, height: 18, rx: 4 }, 'red'),
    s('rect', { x: 72, y: 58, width: 16, height: 78 }, 'yellow'),
    s('path', { d: 'M80 58C66 32 42 40 56 58zM80 58c14-26 38-18 24 0z' }, 'yellow'),
    s('path', { d: 'M28 76h104', ...SW(2) }, 'dark', { stroke: true })
  ],
  sector: [
    s('path', { d: 'M74 86V38a48 48 0 1 0 48 48z' }, 'blue'),
    s('path', { d: 'M74 86 40 120', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M82 78V30a48 48 0 0 1 48 48z' }, 'orange', { accent: true }),
    s('path', { d: 'M82 78V30a48 48 0 0 1 48 48z', ...SW(3) }, 'red', { stroke: true })
  ],
  superior: [
    s('path', { d: 'M18 136v-24h38V84h38V56h38v80z' }, 'blue'),
    s('rect', { x: 94, y: 56, width: 38, height: 8 }, 'navy'),
    s('path', { d: star(113, 34, 18) }, 'yellow', { accent: true }),
    arrow('M30 96l34-34m-14 0h14v14', 'orange', 5)
  ],
  supuesto: [
    ground(),
    ...person(44, 136, 'green'),
    s('path', { d: dots([[70, 82]], 5) + dots([[62, 94]], 3) }, 'gray'),
    s('ellipse', { cx: 108, cy: 50, rx: 38, ry: 30 }, 'white'),
    s('ellipse', { cx: 108, cy: 50, rx: 38, ry: 30, ...SW(3, { 'stroke-dasharray': '6 5' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M98 42q0-12 10-12t10 10q0 8-10 12v6', ...SW(5) }, 'purple', { stroke: true, accent: true }),
    s('circle', { cx: 108, cy: 68, r: 3 }, 'purple')
  ],
  capacidad: [
    s('path', { d: rects([[18, 48, 24, 20], [44, 48, 24, 20], [70, 48, 24, 20], [31, 26, 24, 22], [57, 26, 24, 22]]) }, 'tan'),
    s('path', { d: rects([[18, 48, 24, 20], [44, 48, 24, 20], [70, 48, 24, 20], [31, 26, 24, 22], [57, 26, 24, 22]]), ...SW(2) }, 'brown', { stroke: true }),
    s('rect', { x: 14, y: 68, width: 86, height: 48, rx: 3 }, 'blue'),
    s('path', { d: 'M100 80h22l18 18v18h-40z' }, 'red', { accent: true }),
    s('path', { d: 'M106 86h14l12 12h-26z' }, 'sky'),
    s('path', { d: dots([[40, 118], [118, 118]], 13) }, 'dark'),
    s('path', { d: dots([[40, 118], [118, 118]], 5) }, 'gray')
  ],
  'energía': [
    s('rect', { x: 26, y: 46, width: 100, height: 68, rx: 8, ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 126, y: 66, width: 10, height: 28, rx: 3 }, 'dark'),
    s('rect', { x: 36, y: 56, width: 80, height: 48, rx: 3 }, 'green'),
    s('path', { d: 'M86 40 60 84h18l-6 36 28-46H82z' }, 'yellow', { accent: true }),
    s('path', { d: 'M86 40 60 84h18l-6 36 28-46H82z', ...SW(2) }, 'orange', { stroke: true })
  ],
  mantener: [
    s('path', { d: burst(64, 92, 44, 36, 8) }, 'gray'),
    s('circle', { cx: 64, cy: 92, r: 14 }, 'white'),
    s('circle', { cx: 64, cy: 92, r: 14, ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M104 56 138 22', ...SW(12) }, 'orange', { stroke: true }),
    s('path', { d: 'M86 50a20 20 0 1 0 26 26l-10-4-4-10-10-4z' }, 'orange', { accent: true })
  ],
  modelo: [
    s('path', { d: 'M24 14h20l26 94H50zM116 14h20l-20 94H90z', opacity: 0.45 }, 'yellow', { flatOnly: true }),
    s('path', { d: 'M56 146l12-42h24l12 42z' }, 'gray'),
    ...lady(80, 108, 'purple', { accent: true }),
    s('path', { d: dots([[34, 14], [126, 14]], 6) }, 'dark')
  ],
  natural: [
    s('path', { d: 'M30 128C24 72 56 34 130 28c4 64-32 100-100 100z' }, 'green', { accent: true }),
    s('path', { d: 'M34 124Q72 84 118 40M62 96l-4-22M80 78l-2-24M62 96l22 2M84 76l24 4', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: 'M126 92c-10 14-14 22-14 28a14 14 0 0 0 28 0c0-6-4-14-14-28z' }, 'blue')
  ],
  necesidad: [
    s('circle', { cx: 80, cy: 86, r: 42 }, 'white'),
    s('circle', { cx: 80, cy: 86, r: 42, ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 86, r: 26, ...SW(3, { 'stroke-dasharray': '6 5' }) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M24 44v84M18 44v16q0 8 6 8t6-8V44', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M136 128V44q-10 8-10 30v14h10', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[70, 92], [90, 80]], 2) }, 'tan')
  ],
  'administración': [
    s('rect', { x: 40, y: 24, width: 80, height: 114, rx: 4 }, 'gray', { accent: true }),
    s('path', { d: 'M56 32l4-12h18l4 12z' }, 'yellow'),
    s('path', { d: rects([[48, 32, 64, 30], [48, 68, 64, 30], [48, 104, 64, 28]]) }, 'white'),
    s('path', { d: rects([[48, 32, 64, 30], [48, 68, 64, 30], [48, 104, 64, 28]]), ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M70 50h20M70 86h20M70 120h20', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: rects([[72, 38, 16, 6], [72, 74, 16, 6], [72, 108, 16, 6]]) }, 'yellow')
  ],
  'comisión': [
    s('path', { d: dots([[40, 62], [80, 56], [120, 62]], 12) }, 'skin'),
    s('path', { d: busts([40, 120], 104, 30, 30) }, 'navy'),
    s('path', { d: busts([80], 104, 30, 36) }, 'red', { accent: true }),
    s('rect', { x: 14, y: 100, width: 132, height: 12, rx: 3 }, 'brown'),
    s('rect', { x: 22, y: 112, width: 116, height: 24 }, 'tan'),
    s('path', { d: rects([[30, 118, 20, 8], [70, 118, 20, 8], [110, 118, 20, 8]]) }, 'white')
  ],
  conmigo: [
    ground(),
    ...person(48, 136, 'red', { accent: true }),
    s('path', { d: 'M62 104l16-8-4-12', ...SW(6) }, 'skin', { stroke: true }),
    ...person(122, 136, 'gray', { h: 38, w: 26, r: 11 }),
    arrow('M120 64Q104 30 76 54m2-14-2 14 14 0', 'purple', 6)
  ],
  crisis: [
    s('path', { d: 'M22 30v104h118', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 60l22 10 16-8 20 32 14-8 22 36', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M126 110l-2 16-14-6z' }, 'red'),
    s('path', { d: 'M90 46a12 12 0 0 1 4-24 18 18 0 0 1 34 2 11 11 0 0 1 4 22z' }, 'gray'),
    s('path', { d: 'M114 48l-8 12h8l-6 12', ...SW(4) }, 'yellow', { stroke: true })
  ],
  culpa: [
    ground(),
    ...person(80, 136, 'blue', { accent: true }),
    s('path', { d: 'M74 84q6-4 12 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 64c-4 6-5 9-5 11a5 5 0 0 0 10 0c0-2-1-5-5-11z' }, 'sky'),
    s('path', { d: 'M28 74h28M132 74h-28M80 26v26', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: dots([[20, 74], [140, 74], [80, 20]], 9) }, 'skin')
  ],
  'cámara': [
    s('path', { d: 'M52 50l8-14h32l8 14z' }, 'dark'),
    s('rect', { x: 18, y: 48, width: 124, height: 84, rx: 10 }, 'dark'),
    s('rect', { x: 28, y: 42, width: 16, height: 8, rx: 2 }, 'red'),
    s('circle', { cx: 80, cy: 90, r: 30 }, 'gray'),
    s('circle', { cx: 80, cy: 90, r: 19 }, 'sky', { accent: true }),
    s('circle', { cx: 73, cy: 83, r: 5 }, 'white'),
    s('rect', { x: 114, y: 58, width: 18, height: 10, rx: 2 }, 'yellow')
  ],
  diario: [
    s('rect', { x: 26, y: 26, width: 108, height: 108, rx: 3 }, 'white'),
    s('rect', { x: 26, y: 26, width: 108, height: 108, rx: 3, ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 36, y: 36, width: 88, height: 14, rx: 2 }, 'dark', { accent: true }),
    s('rect', { x: 36, y: 58, width: 40, height: 34, rx: 2 }, 'sky'),
    s('path', { d: 'M84 60h40M84 70h40M84 80h40M84 90h28M36 102h88M36 112h88M36 122h60', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 26v108', ...SW(2) }, 'gray', { stroke: true })
  ],
  'posición': [
    s('rect', { x: 14, y: 60, width: 132, height: 78, rx: 6 }, 'mint'),
    s('path', { d: 'M14 100h132M56 60v78M108 60v78', ...SW(6) }, 'white', { stroke: true }),
    s('ellipse', { cx: 80, cy: 116, rx: 14, ry: 5 }, 'gray'),
    s('path', { d: 'M80 116c-18-24-26-36-26-50a26 26 0 0 1 52 0c0 14-8 26-26 50z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 66, r: 10 }, 'white')
  ],
  suficiente: [
    s('path', { d: 'M30 30h60l-8 106H38z' }, 'white'),
    s('path', { d: 'M33 64h54l-5 72H38z' }, 'sky'),
    s('path', { d: 'M30 30h60l-8 106H38z', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 64h72', ...SW(3, { 'stroke-dasharray': '6 4' }) }, 'red', { stroke: true }),
    s('path', { d: 'M102 92l12 14 24-32', ...SW(9) }, 'green', { stroke: true, accent: true })
  ],
  'título': [
    s('path', { d: 'M48 56v24q32 16 64 0V56', }, 'navy'),
    s('path', { d: 'M80 26l62 24-62 24-62-24z' }, 'dark', { accent: true }),
    s('path', { d: 'M126 52v32', ...SW(3) }, 'yellow', { stroke: true }),
    s('circle', { cx: 126, cy: 88, r: 5 }, 'yellow'),
    s('rect', { x: 34, y: 106, width: 92, height: 22, rx: 11 }, 'cream'),
    s('rect', { x: 34, y: 106, width: 92, height: 22, rx: 11, ...SW(3) }, 'brown', { stroke: true }),
    s('rect', { x: 74, y: 102, width: 12, height: 30, rx: 2 }, 'red')
  ],
  actualmente: [
    s('rect', { x: 64, y: 14, width: 32, height: 132, rx: 8 }, 'brown'),
    s('circle', { cx: 80, cy: 80, r: 36 }, 'white'),
    s('circle', { cx: 80, cy: 80, r: 36, ...SW(7) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 58v-6M80 102v6M58 80h-6M102 80h6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 80V60M80 80l14 8', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 5 }, 'red', { accent: true })
  ],
  'participación': [
    s('path', { d: 'M110 112 118 52', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 118, cy: 46, r: 8 }, 'skin'),
    s('path', { d: dots([[28, 92], [62, 92], [98, 92], [132, 92]], 12) }, 'skin'),
    s('path', { d: busts([28, 62, 132], 136, 28, 32) }, 'gray'),
    s('path', { d: busts([98], 136, 28, 32) }, 'orange', { accent: true })
  ],
  toma: [
    s('rect', { x: 22, y: 30, width: 76, height: 100, rx: 12 }, 'white'),
    s('rect', { x: 22, y: 30, width: 76, height: 100, rx: 12, ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 60, cy: 80, r: 24 }, 'cream'),
    s('path', { d: 'M52 70v14M68 70v14', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 72H96M108 88H96', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 106, y: 62, width: 28, height: 36, rx: 6 }, 'dark', { accent: true }),
    s('path', { d: 'M134 80h12', ...SW(5) }, 'dark', { stroke: true })
  ],
  violencia: [
    s('path', { d: burst(100, 70, 46, 26, 9) }, 'orange'),
    s('path', { d: burst(100, 70, 26, 14, 9) }, 'yellow'),
    s('rect', { x: 14, y: 90, width: 24, height: 34, rx: 4 }, 'red'),
    s('rect', { x: 34, y: 82, width: 52, height: 48, rx: 14 }, 'skin', { accent: true }),
    s('path', { d: 'M86 94H62M86 106H62M86 118H62', ...SW(3) }, 'brown', { stroke: true })
  ],
  auto: [
    ground(132),
    s('path', { d: 'M18 116V92l14-4 18-28h54l22 28 16 4v24z' }, 'red', { accent: true }),
    s('path', { d: 'M56 66h20v22H44zM82 66h18l16 22H82z' }, 'sky'),
    s('rect', { x: 134, y: 96, width: 8, height: 6, rx: 2 }, 'yellow'),
    s('path', { d: dots([[48, 116], [116, 116]], 14) }, 'dark'),
    s('path', { d: dots([[48, 116], [116, 116]], 6) }, 'gray')
  ],
  ciudadano: [
    s('path', { d: 'M14 136V70h18V52h20v84zM112 136V60h16v-14h18v90z' }, 'gray'),
    ground(),
    ...person(66, 136, 'blue'),
    s('path', { d: 'M80 104h12', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 88, y: 88, width: 46, height: 32, rx: 4 }, 'yellow', { accent: true }),
    s('rect', { x: 93, y: 94, width: 13, height: 18, rx: 2 }, 'white'),
    s('path', { d: 'M112 98h16M112 108h12', ...SW(3) }, 'dark', { stroke: true })
  ],
  probablemente: [
    s('circle', { cx: 58, cy: 62, r: 28 }, 'yellow'),
    s('path', { d: 'M58 22v-6M24 62h-6M34 38l-5-5M82 38l5-5', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M46 116a18 18 0 0 1 4-36 26 26 0 0 1 50-4 20 20 0 0 1 20 40z' }, 'white'),
    s('path', { d: 'M46 116a18 18 0 0 1 4-36 26 26 0 0 1 50-4 20 20 0 0 1 20 40z', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M70 126l-4 10M90 126l-4 10', ...SW(4) }, 'blue', { stroke: true }),
    s('path', { d: 'M136 30 112 70', ...SW(4) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: dots([[114, 34], [134, 66]], 6) }, 'purple')
  ],
  solamente: [
    s('ellipse', { cx: 80, cy: 124, rx: 66, ry: 12 }, 'blue'),
    s('path', { d: 'M40 124q40-30 80 0z' }, 'tan'),
    s('path', { d: 'M82 118q-4-40 8-62', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M90 56q-20-12-36 2M90 56q20-14 36 0M90 56q-16 6-20 22M90 56q16 4 20 22', ...SW(6) }, 'green', { stroke: true, accent: true }),
    s('circle', { cx: 36, cy: 40, r: 12 }, 'yellow')
  ],
  'área': [
    s('path', { d: [20, 40, 60, 80, 100, 120, 140].map(v => `M${v} 20v100M20 ${v > 120 ? 120 : v}h120`).join(''), ...SW(1) }, 'gray', { stroke: true }),
    s('rect', { x: 40, y: 40, width: 80, height: 60 }, 'green', { accent: true }),
    s('rect', { x: 40, y: 40, width: 80, height: 60, ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M42 134h76M48 128l-6 6 6 6M112 128l6 6-6 6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M134 42v56M128 48l6-6 6 6M128 92l6 6 6-6', ...SW(3) }, 'dark', { stroke: true })
  ],
  banda: [
    s('path', { d: 'M38 56 56 76M78 54 64 74', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 22, y: 82, width: 68, height: 50, rx: 6 }, 'red', { accent: true }),
    s('path', { d: 'M24 92l16 30 16-30 16 30 16-30', ...SW(3) }, 'white', { stroke: true }),
    s('ellipse', { cx: 56, cy: 82, rx: 34, ry: 10 }, 'cream'),
    s('ellipse', { cx: 56, cy: 82, rx: 34, ry: 10, ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 90, y: 60, width: 34, height: 10, rx: 3 }, 'yellow'),
    s('path', { d: 'M120 64l24-16v40l-24-16z' }, 'yellow'),
    s('path', { d: 'M100 60v-10M110 60v-10', ...SW(4) }, 'yellow', { stroke: true }),
    ...note(118, 120, 'purple')
  ],
  contenido: [
    s('path', { d: 'M34 78h92l-8-10H42z' }, 'brown'),
    s('rect', { x: 82, y: 32, width: 20, height: 44, rx: 2, transform: 'rotate(12 92 54)' }, 'blue'),
    s('circle', { cx: 64, cy: 64, r: 16 }, 'red', { accent: true }),
    s('path', { d: star(112, 66, 12) }, 'yellow'),
    s('rect', { x: 34, y: 78, width: 92, height: 58 }, 'tan'),
    s('path', { d: 'M34 78l-18 20h40l16-20zM126 78l18 20h-40l-16-20z' }, 'brown')
  ],
  'decisión': [
    ground(),
    s('path', { d: 'M80 136V26', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M76 38H34L22 50l12 12h42z' }, 'blue'),
    s('path', { d: 'M84 72h42l12 12-12 12H84z' }, 'orange', { accent: true }),
    s('path', { d: 'M36 50h30M94 84h30', ...SW(3) }, 'white', { stroke: true })
  ],
  encuentro: [
    ground(),
    ...person(42, 136, 'blue'),
    ...person(118, 136, 'green'),
    s('path', { d: 'M56 102h18M104 102H86', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 80, cy: 102, r: 8 }, 'skin', { accent: true }),
    s('path', { d: 'M80 64V50M66 68l-8-8M94 68l8-8', ...SW(4) }, 'orange', { stroke: true })
  ],
  entrada: [
    s('path', { d: 'M18 50h124v20a10 10 0 0 0 0 20v20H18V90a10 10 0 0 0 0-20z', transform: 'rotate(-10 80 80)' }, 'orange', { accent: true }),
    s('path', { d: 'M108 54v52', transform: 'rotate(-10 80 80)', ...SW(3, { 'stroke-dasharray': '5 5' }) }, 'white', { stroke: true }),
    s('path', { d: 'M34 68h54M34 80h40M34 92h48', transform: 'rotate(-10 80 80)', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: star(124, 80, 9), transform: 'rotate(-10 80 80)' }, 'yellow')
  ],
  permitir: [
    ground(),
    s('rect', { x: 28, y: 72, width: 18, height: 64, rx: 3 }, 'dark'),
    s('path', { d: 'M40 80 116 20', ...SW(10) }, 'red', { stroke: true }),
    s('path', { d: 'M40 80 116 20', ...SW(10, { 'stroke-linecap': 'butt', 'stroke-dasharray': '10 10' }) }, 'white', { stroke: true }),
    s('circle', { cx: 37, cy: 58, r: 9 }, 'green', { accent: true }),
    arrow('M70 116h66m-12-10 12 10-12 10', 'green', 6)
  ],
  'unión': [
    s('path', { d: 'M22 50h52v20a10 10 0 1 1 0 20v20H22z' }, 'blue'),
    s('path', { d: 'M74 50h64v60H74V90a10 10 0 1 0 0-20z' }, 'orange', { accent: true }),
    s('path', { d: 'M22 50h52v20a10 10 0 1 1 0 20v20H22zM74 50h64v60H74', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M80 36V24M64 40l-6-10M96 40l6-10', ...SW(3) }, 'yellow', { stroke: true })
  ],
  'vía': [
    s('path', { d: 'M14 140 70 30h20l56 110z' }, 'mint'),
    s('path', { d: [[132, 30], [112, 24], [94, 19], [79, 15], [66, 12], [55, 10]].map(([y, h]) => { const t = (140 - y) / 110, l = 34 + t * 40, r = 126 - t * 40; return `M${(l - h / 3).toFixed(1)} ${y}h${(r - l + 2 * h / 3).toFixed(1)}`; }).join(''), ...SW(5, { 'stroke-linecap': 'butt' }) }, 'brown', { stroke: true }),
    s('path', { d: 'M34 140 74 30M126 140 86 30', ...SW(5) }, 'gray', { stroke: true, accent: true }),
    s('circle', { cx: 128, cy: 40, r: 7 }, 'green'),
    s('path', { d: 'M128 48v40', ...SW(3) }, 'dark', { stroke: true })
  ],
  'atrás': [
    ground(),
    ...person(110, 136, 'navy', { accent: true }),
    arrow('M96 62V50a20 20 0 0 0-20-20H32m12-12L32 30l12 12', 'purple', 6),
    s('path', { d: 'M30 128h10M54 128h10', ...SW(5) }, 'gray', { stroke: true })
  ],
  capaz: [
    ground(),
    ...person(80, 136, 'sky'),
    s('path', { d: 'M66 100 50 86M94 100l16-14', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M44 74Q80-8 116 74', ...SW(2, { 'stroke-dasharray': '4 5' }) }, 'gray', { stroke: true }),
    s('circle', { cx: 44, cy: 64, r: 9 }, 'red'),
    s('circle', { cx: 80, cy: 26, r: 9 }, 'yellow', { accent: true }),
    s('circle', { cx: 116, cy: 64, r: 9 }, 'green')
  ],
  club: [
    s('path', { d: 'M28 24v116', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M30 26 140 54 30 82z' }, 'blue', { accent: true }),
    s('path', { d: 'M30 34v40', ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: star(62, 54, 11) }, 'yellow'),
    s('circle', { cx: 108, cy: 114, r: 22 }, 'white'),
    s('circle', { cx: 108, cy: 114, r: 22, ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M108 105l8 6-3 9h-10l-3-9z' }, 'dark')
  ],
  comentario: [
    s('rect', { x: 18, y: 18, width: 124, height: 124, rx: 10 }, 'white'),
    s('rect', { x: 18, y: 18, width: 124, height: 124, rx: 10, ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 28, y: 28, width: 104, height: 44, rx: 4 }, 'sky'),
    s('path', { d: dots([[38, 94], [38, 124]], 8) }, 'orange', { accent: true }),
    s('rect', { x: 52, y: 86, width: 76, height: 16, rx: 8 }, 'mint'),
    s('rect', { x: 52, y: 116, width: 58, height: 16, rx: 8 }, 'mint'),
    s('path', { d: 'M120 64c-6-4-8-8-5-11 2-2 4-1 5 1 1-2 3-3 5-1 3 3 1 7-5 11z' }, 'red')
  ],
  gusto: [
    s('circle', { cx: 80, cy: 80, r: 54 }, 'yellow', { accent: true }),
    s('path', { d: 'M50 70q9-10 18 0M92 70q9-10 18 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 92q28 30 56 0z' }, 'dark'),
    s('ellipse', { cx: 96, cy: 106, rx: 11, ry: 9 }, 'pink'),
    s('path', { d: dots([[44, 90], [116, 90]], 7) }, 'orange')
  ],
  hecho: [
    s('rect', { x: 34, y: 24, width: 92, height: 118, rx: 6 }, 'brown'),
    s('rect', { x: 42, y: 36, width: 76, height: 98 }, 'white'),
    s('rect', { x: 60, y: 16, width: 40, height: 16, rx: 4 }, 'gray'),
    s('path', { d: 'M50 58l6 6 10-12M50 86l6 6 10-12M50 114l6 6 10-12', ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M76 58h34M76 86h34M76 114h34', ...SW(4) }, 'gray', { stroke: true })
  ],
  sexo: [
    s('circle', { cx: 56, cy: 66, r: 24, ...SW(8) }, 'pink', { stroke: true, accent: true }),
    s('path', { d: 'M56 90v40M40 112h32', ...SW(8) }, 'pink', { stroke: true }),
    s('circle', { cx: 100, cy: 92, r: 24, ...SW(8) }, 'blue', { stroke: true }),
    s('path', { d: 'M117 75l22-22m-18 0h18v18', ...SW(8) }, 'blue', { stroke: true })
  ],
  texto: [
    s('rect', { x: 34, y: 18, width: 92, height: 124, rx: 4 }, 'cream'),
    s('rect', { x: 34, y: 18, width: 92, height: 124, rx: 4, ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M44 64h72', ...SW(12, { 'stroke-linecap': 'butt' }) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M46 36h68M46 50h68M46 64h68M46 78h50M46 96h68M46 110h68M46 124h40', ...SW(4) }, 'gray', { stroke: true })
  ],
  'análisis': [
    s('path', { d: 'M24 120h18V90H24zM50 120h18V70H50zM76 120h18V96H76zM102 120h18V52h-18z' }, 'blue'),
    s('path', { d: 'M16 124h112', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 92, cy: 70, r: 30, opacity: 0.5 }, 'sky', { flatOnly: true }),
    s('circle', { cx: 92, cy: 70, r: 30, ...SW(8) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M114 92 140 118', ...SW(10) }, 'dark', { stroke: true })
  ],
  apenas: [
    ground(),
    s('path', { d: 'M78 40h68', ...SW(6) }, 'brown', { stroke: true }),
    s('rect', { x: 104, y: 14, width: 26, height: 23, rx: 4 }, 'orange', { accent: true }),
    ...person(66, 132, 'purple'),
    s('path', { d: 'M76 94 102 44', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M60 132v4M72 132v4', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 70l-8-4M38 84h-8', ...SW(3) }, 'gray', { stroke: true })
  ],
  'constitución': [
    s('rect', { x: 34, y: 20, width: 96, height: 122, rx: 6 }, 'navy', { accent: true }),
    s('path', { d: 'M130 26v110', ...SW(4) }, 'cream', { stroke: true }),
    s('rect', { x: 34, y: 20, width: 14, height: 122, rx: 4 }, 'dark'),
    s('path', { d: 'M64 52l25-16 25 16zM68 54h42v6H68zM72 62h7v36h-7zM86 62h7v36h-7zM100 62h7v36h-7zM64 100h50v8H64z' }, 'yellow'),
    s('path', { d: star(89, 124, 6) }, 'yellow')
  ],
  contrario: [
    s('path', { d: 'M18 42h88V26l36 24-36 24V58H18z' }, 'blue'),
    s('path', { d: 'M142 118H54v16l-36-24 36-24v16h88z' }, 'red', { accent: true }),
    s('path', { d: 'M14 80h132', ...SW(3, { 'stroke-dasharray': '6 6' }) }, 'gray', { stroke: true })
  ],
  'código': [
    s('rect', { x: 16, y: 26, width: 128, height: 96, rx: 8 }, 'dark'),
    s('path', { d: 'M64 124l-6 14h44l-6-14z' }, 'gray'),
    s('path', { d: 'M56 54 36 74l20 20M104 54l20 20-20 20', ...SW(7) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M88 50 72 98', ...SW(6) }, 'sky', { stroke: true })
  ],
  especialmente: [
    s('path', { d: dots([[36, 36], [80, 30], [124, 36], [30, 82], [130, 82], [36, 128], [80, 134], [124, 128]], 11) }, 'gray'),
    s('path', { d: 'M80 44v-6M80 122v6M44 82h-6M116 82h6', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: star(80, 84, 32) }, 'yellow', { accent: true })
  ],
  interior: [
    s('rect', { x: 26, y: 64, width: 108, height: 72 }, 'cream'),
    s('rect', { x: 26, y: 64, width: 108, height: 72, ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M16 70 80 22l64 48', ...SW(8) }, 'red', { stroke: true }),
    s('rect', { x: 44, y: 92, width: 52, height: 18, rx: 6 }, 'purple'),
    s('rect', { x: 36, y: 104, width: 68, height: 22, rx: 6 }, 'purple', { accent: true }),
    s('path', { d: 'M118 132V96M108 132h20', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M106 96l4-18h16l4 18z' }, 'yellow')
  ],
  lucha: [
    s('path', { d: 'M80 18c-34 0-50 30-50 60 0 36 22 64 50 64s50-28 50-64c0-30-16-60-50-60z' }, 'red', { accent: true }),
    s('path', { d: 'M80 26 66 52h28z' }, 'yellow'),
    s('path', { d: 'M42 72q16-16 34 4-18 14-34-4zM118 72q-16-16-34 4 18 14 34-4z' }, 'yellow'),
    s('path', { d: 'M50 73q12-8 22 3-12 7-22-3zM110 73q-12-8-22 3 12 7 22-3z' }, 'white'),
    s('path', { d: dots([[62, 74], [98, 74]], 4) }, 'dark'),
    s('ellipse', { cx: 80, cy: 116, rx: 14, ry: 8 }, 'skin'),
    s('path', { d: 'M72 116h16', ...SW(3) }, 'dark', { stroke: true })
  ],
  mediante: [
    s('circle', { cx: 28, cy: 80, r: 14 }, 'blue'),
    s('circle', { cx: 132, cy: 80, r: 14 }, 'green'),
    s('path', { d: 'M80 54l26 26-26 26-26-26z' }, 'orange', { accent: true }),
    s('path', { d: 'M44 80h4M112 80h4', ...SW(4) }, 'dark', { stroke: true }),
    arrow('M44 80h6m-6-6 6 6-6 6M108 80h6m-6-6 6 6-6 6', 'dark', 4),
    s('path', { d: 'M28 60q52-50 104 0', ...SW(3, { 'stroke-dasharray': '4 6' }) }, 'gray', { stroke: true })
  ],
  prueba: [
    s('rect', { x: 28, y: 18, width: 104, height: 124, rx: 8 }, 'cream'),
    s('rect', { x: 28, y: 18, width: 104, height: 124, rx: 8, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 108V82c0-22 14-38 34-38s34 16 34 38v18M58 116V82c0-16 10-26 22-26s22 10 22 26v28M70 120V82c0-8 4-14 10-14s10 6 10 14v34M80 80v44', ...SW(4) }, 'purple', { stroke: true, accent: true })
  ],
  vaya: [
    ground(),
    ...person(80, 136, 'orange', { accent: true }),
    s('path', { d: dots([[75, 74], [85, 74]], 2) + dots([[80, 84]], 3.5) }, 'dark'),
    s('path', { d: 'M66 100q-10-12-2-20M94 100q10-12 2-20', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M80 56V40M62 60l-8-10M98 60l8-10', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: star(36, 44, 10) + star(124, 44, 10) }, 'yellow')
  ],
  anterior: [
    s('rect', { x: 18, y: 46, width: 36, height: 48, rx: 4 }, 'orange', { accent: true }),
    s('rect', { x: 62, y: 46, width: 36, height: 48, rx: 4 }, 'gray'),
    s('rect', { x: 106, y: 46, width: 36, height: 48, rx: 4 }, 'gray'),
    s('path', { d: 'M28 60h16M28 70h12M72 60h16M116 60h16', ...SW(3) }, 'white', { stroke: true }),
    arrow('M124 118H38m12-10-12 10 12 10', 'dark', 5)
  ]
};
