// Illustration specs for common words, batch 0010 (plus leftovers of 0009) (see server/scripts/lexicon/art.js)
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


// Path data: a closed circle drawn as two arcs (for strokes)
const ring = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
const DASH = (w, d = '6 6') => SW(w, { 'stroke-dasharray': d });
// Ruler ticks: every 4px, long tick every 20px
const ticks = Array.from({ length: 31 }, (_, i) => `M${20 + i * 4} 84v${i % 5 ? 7 : 14}`).join('');
// Laurel leaves along two arcs
const leaves = [...Array.from({ length: 6 }, (_, i) => 110 + i * 24), ...Array.from({ length: 6 }, (_, i) => 70 - i * 24)]
  .map(deg => [+(80 + 46 * Math.cos(deg * Math.PI / 180)).toFixed(1), +(80 + 46 * Math.sin(deg * Math.PI / 180)).toFixed(1)]);
// Checkered strip: black squares
const checks = rects(Array.from({ length: 24 }, (_, i) => [48 + (i % 8) * 8, 18 + Math.floor(i / 8) * 8, 8, 8])
  .filter((_, i) => (i % 8 + Math.floor(i / 8)) % 2 === 0));
// Footprints (ellipses)
const prints = pts => pts.map(([x, y]) => `M${x - 5} ${y}a5 8 0 1 0 10 0a5 8 0 1 0 -10 0z`).join('');
const flowerPath = (cx, cy) => dots([[cx - 6, cy], [cx + 6, cy], [cx, cy - 6], [cx, cy + 6]], 5);
// Federation: six states around a center
const fed = Array.from({ length: 6 }, (_, i) => [+(80 + 50 * Math.cos(i * Math.PI / 3)).toFixed(1), +(80 + 50 * Math.sin(i * Math.PI / 3)).toFixed(1)]);

module.exports = {
  reciente: [
    s('rect', { x: 24, y: 30, width: 112, height: 106, rx: 10 }, 'cream'),
    outline({ x: 24, y: 30, width: 112, height: 106, rx: 10 }),
    s('path', { d: 'M24 54V40a10 10 0 0 1 10-10h92a10 10 0 0 1 10 10v14z' }, 'red'),
    s('path', { d: 'M52 20v18M108 20v18', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: rects([[36, 64, 16, 14], [60, 64, 16, 14], [84, 64, 16, 14], [108, 64, 16, 14], [36, 88, 16, 14], [60, 88, 16, 14], [84, 88, 16, 14], [108, 88, 16, 14], [36, 112, 16, 14], [60, 112, 16, 14], [84, 112, 16, 14]]) }, 'gray'),
    s('rect', { x: 106, y: 110, width: 20, height: 18, rx: 3 }, 'orange', { accent: true }),
    s('path', { d: star(132, 104, 9) }, 'yellow')
  ],
  regresar: [
    s('path', { d: 'M88 98l29-26 29 26z' }, 'red'),
    s('rect', { x: 96, y: 96, width: 42, height: 40 }, 'tan'),
    s('rect', { x: 110, y: 112, width: 14, height: 24 }, 'brown'),
    ...person(40, 136, 'blue', { accent: true }),
    s('path', { d: 'M40 62Q66 18 100 50M86 48l14 2-2 14', ...SW(6) }, 'orange', { stroke: true }),
    ground()
  ],
  relacionado: [
    s('path', { d: 'M44 50H116M44 50L80 116M116 50L80 116', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 44, cy: 50, r: 20 }, 'blue', { accent: true }),
    s('circle', { cx: 116, cy: 50, r: 20 }, 'green'),
    s('circle', { cx: 80, cy: 116, r: 20 }, 'orange'),
    s('path', { d: dots([[44, 50], [116, 50], [80, 116]], 7) }, 'white')
  ],
  reserva: [
    s('path', { d: 'M18 70v66M18 110h18v26M142 70v66M142 110h-18v26', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 30, y: 84, width: 100, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M42 94v42M118 94v42', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M62 84l6-30h24l6 30z' }, 'red', { accent: true }),
    s('path', { d: star(80, 68, 7) }, 'yellow'),
    s('ellipse', { cx: 112, cy: 80, rx: 13, ry: 4 }, 'gray'),
    s('ellipse', { cx: 44, cy: 80, rx: 13, ry: 4 }, 'gray')
  ],
  ritmo: [
    s('path', { d: 'M54 132l18-102h16l18 102z' }, 'brown'),
    s('path', { d: 'M66 120l10-74h8l10 74z' }, 'cream'),
    s('path', { d: 'M80 120L106 52', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 92, y: 66, width: 16, height: 11, rx: 2, transform: 'rotate(21 100 71)' }, 'orange', { accent: true }),
    s('rect', { x: 48, y: 126, width: 64, height: 10, rx: 3 }, 'dark'),
    s('path', { d: 'M118 44q10 8 8 22M42 44q-10 8-8 22', ...SW(4) }, 'gray', { stroke: true })
  ],
  robo: [
    ...person(62, 136, 'dark', { h: 48, w: 34 }),
    s('path', { d: 'M50 74a12 12 0 0 1 24 0z' }, 'black'),
    s('rect', { x: 49, y: 72, width: 26, height: 7, rx: 3 }, 'black'),
    s('path', { d: 'M78 100l20-18', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 112, cy: 98, r: 24 }, 'brown', { accent: true }),
    s('path', { d: 'M102 74l10 8 10-8', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: dots([[136, 128], [124, 132]], 5) }, 'yellow'),
    ground()
  ],
  tono: [
    s('path', { d: 'M60 30v48q0 18 14 18t14-18V30M74 96v34', ...SW(8) }, 'gray', { stroke: true }),
    s('circle', { cx: 74, cy: 132, r: 7 }, 'dark'),
    s('path', { d: 'M104 46q10 16 0 32M116 38q16 24 0 48M128 30q22 32 0 64', ...SW(5) }, 'blue', { stroke: true }),
    ...note(28, 112, 'purple')
  ],
  variedad: [
    s('circle', { cx: 46, cy: 48, r: 24 }, 'red'),
    s('rect', { x: 92, y: 26, width: 44, height: 44, rx: 4 }, 'blue'),
    s('path', { d: 'M46 86l28 48H18z' }, 'green'),
    s('path', { d: star(112, 110, 28) }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 82, r: 9 }, 'purple')
  ],
  'únicamente': [
    backdrop('dark'),
    s('path', { d: 'M68 14h24l30 120H38z' }, 'cream'),
    s('ellipse', { cx: 80, cy: 134, rx: 42, ry: 8 }, 'yellow'),
    ...person(80, 134, 'red', { accent: true })
  ],
  academia: [
    s('rect', { x: 26, y: 112, width: 108, height: 22, rx: 3 }, 'blue'),
    s('rect', { x: 36, y: 90, width: 90, height: 22, rx: 3 }, 'red'),
    s('rect', { x: 30, y: 68, width: 96, height: 22, rx: 3 }, 'green'),
    s('path', { d: 'M40 120h86M46 98h74M38 76h82', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M56 50v12q24 12 48 0V50z' }, 'dark'),
    s('path', { d: 'M80 24l52 18-52 18-52-18z' }, 'black', { accent: true }),
    s('path', { d: 'M128 42v22', ...SW(3) }, 'yellow', { stroke: true }),
    s('circle', { cx: 128, cy: 66, r: 4 }, 'yellow')
  ],
  activo: [
    s('path', { d: 'M18 74h24M14 94h28M22 114h20', ...SW(5) }, 'gray', { stroke: true }),
    ...lean(82, 136, 18, 'orange', { accent: true }),
    s('path', { d: 'M84 100l-20 4M96 96l16-18', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: star(128, 34, 12) }, 'yellow'),
    ground()
  ],
  ausencia: [
    s('rect', { x: 56, y: 62, width: 48, height: 36, rx: 6 }, 'brown', { accent: true }),
    s('rect', { x: 48, y: 96, width: 64, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M54 106v30M106 106v30', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: `${ring(80, 42, 13)}M64 96V72a16 16 0 0 1 32 0v24`, ...DASH(3) }, 'dark', { stroke: true }),
    ground()
  ],
  cabello: [
    s('path', { d: 'M38 66a42 42 0 0 1 84 0v64q-10 8-20 0V74H58v56q-10 8-20 0z' }, 'brown', { accent: true }),
    s('path', { d: busts([80], 146, 64, 32) }, 'pink'),
    s('circle', { cx: 80, cy: 72, r: 28 }, 'skin'),
    s('path', { d: 'M50 68q6-36 30-36t30 36q-20-16-30-14q-14-2-30 14z' }, 'brown'),
    s('path', { d: dots([[70, 78], [90, 78]], 3) }, 'dark'),
    s('path', { d: 'M74 90q6 4 12 0', ...SW(3) }, 'red', { stroke: true })
  ],
  cercano: [
    s('path', { d: 'M18 88l32-30 32 30z' }, 'red'),
    s('rect', { x: 26, y: 86, width: 48, height: 50 }, 'tan'),
    s('rect', { x: 42, y: 110, width: 14, height: 26 }, 'brown'),
    ...person(114, 136, 'blue', { accent: true }),
    s('path', { d: 'M80 118h14M84 113l-5 5 5 5M90 113l5 5-5 5', ...SW(3) }, 'orange', { stroke: true }),
    ground()
  ],
  dispuesto: [
    ...person(70, 136, 'green', { h: 50, w: 34, accent: true }),
    s('path', { d: 'M82 92l18-42', ...SW(8) }, 'skin', { stroke: true }),
    s('circle', { cx: 102, cy: 44, r: 8 }, 'skin'),
    s('path', { d: burst(126, 30, 16, 7, 8) }, 'yellow'),
    s('path', { d: 'M66 78q4 4 8 0', ...SW(3) }, 'dark', { stroke: true }),
    ground()
  ],
  'diálogo': [
    s('path', { d: 'M22 22h52a8 8 0 0 1 8 8v12a8 8 0 0 1-8 8H48l-10 10v-10H22a8 8 0 0 1-8-8V30a8 8 0 0 1 8-8z' }, 'sky', { accent: true }),
    s('path', { d: 'M86 40h52a8 8 0 0 1 8 8v12a8 8 0 0 1-8 8h-16v10l-10-10H86a8 8 0 0 1-8-8V48a8 8 0 0 1 8-8z' }, 'yellow'),
    s('path', { d: dots([[34, 36], [48, 36], [62, 36], [98, 54], [112, 54], [126, 54]], 3) }, 'dark'),
    ...person(40, 136, 'blue', { h: 36 }),
    ...person(120, 136, 'red', { h: 36 }),
    ground()
  ],
  estadio: [
    s('path', { d: 'M28 30v24M132 30v24', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: rects([[20, 22, 16, 10], [124, 22, 16, 10]]) }, 'yellow'),
    s('ellipse', { cx: 80, cy: 92, rx: 66, ry: 46 }, 'gray'),
    s('ellipse', { cx: 80, cy: 92, rx: 56, ry: 37 }, 'red', { accent: true }),
    s('ellipse', { cx: 80, cy: 92, rx: 42, ry: 25 }, 'green'),
    s('path', { d: `M80 67v50${ring(80, 92, 8)}`, ...SW(3) }, 'white', { stroke: true })
  ],
  inicial: [
    s('path', { d: 'M44 136v-22h26v-22h26v-22h26v-22h18v88z' }, 'gray'),
    s('rect', { x: 44, y: 114, width: 26, height: 22 }, 'green', { accent: true }),
    s('path', { d: 'M57 114V88', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M57 88l14 6-14 6z' }, 'red'),
    ...person(26, 136, 'blue', { h: 36, w: 22, r: 10 })
  ],
  joder: [
    s('path', { d: burst(80, 30, 22, 12, 9) }, 'red'),
    ...person(80, 136, 'blue', { h: 44, w: 36, r: 16, accent: true }),
    s('path', { d: 'M64 98q-20-18-12-34M96 98q20-18 12-34', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M70 70l6 3M90 70l-6 3M72 84q8-6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M70 26l6 6-6 4 8 4M90 26l-6 6 6 4-8 4', ...SW(3) }, 'yellow', { stroke: true }),
    ground()
  ],
  locura: [
    s('path', { d: burst(80, 82, 66, 44, 14) }, 'purple', { accent: true }),
    s('circle', { cx: 80, cy: 88, r: 42 }, 'skin'),
    s('path', { d: 'M62 80a3 3 0 1 1 3 3a7 7 0 1 1-7-7a11 11 0 1 1 11 11M98 80a3 3 0 1 1 3 3a7 7 0 1 1-7-7a11 11 0 1 1 11 11', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M60 110q6-6 10 0t10 0t10 0t10 0', ...SW(4) }, 'red', { stroke: true })
  ],
  molesto: [
    s('circle', { cx: 68, cy: 92, r: 44 }, 'skin', { accent: true }),
    s('path', { d: 'M44 72l16 7M92 72l-16 7M52 116q16-10 32 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[56, 88], [80, 88]], 4) }, 'dark'),
    s('path', { d: 'M124 50q-6 24-34-2', ...DASH(2, '4 5') }, 'gray', { stroke: true }),
    s('path', { d: 'M118 30a6 8 0 1 0 12 0a6 8 0 1 0-12 0zM132 30a6 8 0 1 0 12 0a6 8 0 1 0-12 0z' }, 'sky'),
    s('ellipse', { cx: 130, cy: 42, rx: 9, ry: 7 }, 'black')
  ],
  obvio: [
    s('rect', { x: 48, y: 108, width: 64, height: 28, rx: 3 }, 'gray'),
    s('circle', { cx: 80, cy: 80, r: 26 }, 'red', { accent: true }),
    s('path', { d: 'M136 22L106 52M104 34l2 18 18 2', ...SW(8) }, 'orange', { stroke: true }),
    s('path', { d: 'M28 40l10 10M22 70h14', ...SW(4) }, 'yellow', { stroke: true }),
    ground()
  ],
  plano: [
    s('rect', { x: 14, y: 120, width: 132, height: 18, rx: 4 }, 'green'),
    s('rect', { x: 18, y: 94, width: 124, height: 26, rx: 6 }, 'yellow', { accent: true }),
    s('rect', { x: 60, y: 99, width: 40, height: 16, rx: 8 }, 'mint'),
    s('circle', { cx: 80, cy: 107, r: 5 }, 'white'),
    s('path', { d: 'M71 99v16M89 99v16', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 60h104', ...DASH(3, '10 8') }, 'gray', { stroke: true })
  ],
  puro: [
    s('path', { d: 'M80 20q36 50 36 76a36 36 0 0 1-72 0q0-26 36-76z' }, 'sky', { accent: true }),
    s('path', { d: 'M62 96q0 16 14 22', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: star(126, 38, 11, 4) + star(34, 58, 9, 3.5) + star(128, 120, 8, 3) }, 'yellow')
  ],
  risa: [
    s('circle', { cx: 80, cy: 82, r: 52 }, 'yellow', { accent: true }),
    s('path', { d: 'M50 70l11-9 11 9M88 70l11-9 11 9', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M48 88h64a32 32 0 0 1-64 0z' }, 'dark'),
    s('ellipse', { cx: 80, cy: 110, rx: 14, ry: 7 }, 'pink'),
    s('path', { d: 'M24 78q-8 12 0 18q8-6 0-18zM136 78q8 12 0 18q-8-6 0-18z' }, 'sky')
  ],
  rural: [
    s('circle', { cx: 126, cy: 36, r: 14 }, 'yellow'),
    s('path', { d: 'M14 110q66-34 132 0v28H14z' }, 'green'),
    s('path', { d: 'M22 126h116M30 134h100', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M28 92v-14', ...SW(5) }, 'brown', { stroke: true }),
    s('circle', { cx: 28, cy: 70, r: 13 }, 'green'),
    s('path', { d: 'M62 114V74l18-16 18 16v40z' }, 'red', { accent: true }),
    s('path', { d: 'M72 114V92h16v22M72 92l16 22M88 92l-16 22', ...SW(2) }, 'white', { stroke: true })
  ],
  ruso: [
    s('ellipse', { cx: 66, cy: 104, rx: 32, ry: 34 }, 'red', { accent: true }),
    s('circle', { cx: 66, cy: 62, r: 22 }, 'red'),
    s('circle', { cx: 66, cy: 64, r: 14 }, 'skin'),
    s('path', { d: dots([[61, 62], [71, 62]], 2) }, 'dark'),
    s('path', { d: flowerPath(66, 108) }, 'yellow'),
    s('ellipse', { cx: 122, cy: 118, rx: 18, ry: 20 }, 'blue'),
    s('circle', { cx: 122, cy: 92, r: 13 }, 'blue'),
    s('circle', { cx: 122, cy: 93, r: 8 }, 'skin'),
    ground(138)
  ],
  socialista: [
    s('path', { d: 'M80 70v60', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M80 98q-22-4-26-20q20 0 26 20z' }, 'green'),
    s('circle', { cx: 80, cy: 52, r: 24 }, 'red', { accent: true }),
    s('path', { d: 'M86 52a6 6 0 1 1-6-6M68 40q-10 14 4 26M92 40q8 12-2 24', ...SW(3) }, 'pink', { stroke: true }),
    s('rect', { x: 62, y: 104, width: 36, height: 32, rx: 10 }, 'skin'),
    s('path', { d: 'M64 114h32M64 124h32', ...SW(2) }, 'tan', { stroke: true })
  ],
  triunfo: [
    s('path', { d: star(30, 32, 10) + star(130, 32, 10) }, 'yellow'),
    s('path', { d: dots([[54, 24], [108, 20], [22, 70], [138, 66]], 4) }, 'red'),
    ...person(80, 136, 'blue', { h: 50, w: 34, accent: true }),
    s('path', { d: 'M66 92L46 52M94 92l20-40', ...SW(8) }, 'skin', { stroke: true }),
    ground()
  ],
  tropa: [
    s('path', { d: dots([[32, 84], [64, 84], [96, 84], [128, 84]], 10) }, 'skin'),
    s('path', { d: rects([[20, 96, 24, 40], [52, 96, 24, 40], [84, 96, 24, 40], [116, 96, 24, 40]]) }, 'green', { accent: true }),
    s('path', { d: [32, 64, 96, 128].map(x => `M${x - 13} 82a13 13 0 0 1 26 0z`).join('') }, 'dark'),
    s('path', { d: 'M20 116h24M52 116h24M84 116h24M116 116h24', ...SW(4) }, 'brown', { stroke: true }),
    ground()
  ],
  'ánimo': [
    s('path', { d: burst(80, 64, 54, 36, 12) }, 'yellow', { accent: true }),
    s('rect', { x: 62, y: 112, width: 36, height: 30, rx: 4 }, 'orange'),
    s('rect', { x: 68, y: 78, width: 24, height: 38 }, 'skin'),
    s('rect', { x: 56, y: 38, width: 48, height: 46, rx: 14 }, 'skin'),
    s('path', { d: 'M58 52h42M58 66h42M60 78q16 4 30-6', ...SW(3) }, 'tan', { stroke: true })
  ],
  absoluto: [
    s('circle', { cx: 74, cy: 86, r: 56 }, 'red'),
    s('circle', { cx: 74, cy: 86, r: 42 }, 'white'),
    s('circle', { cx: 74, cy: 86, r: 28 }, 'red', { accent: true }),
    s('circle', { cx: 74, cy: 86, r: 14 }, 'white'),
    s('path', { d: 'M74 86L134 26', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M122 26l12 0 0-12M128 32l12 0 0-12', ...SW(4) }, 'orange', { stroke: true })
  ],
  acceder: [
    s('rect', { x: 50, y: 22, width: 64, height: 114 }, 'dark'),
    s('rect', { x: 55, y: 27, width: 54, height: 109 }, 'yellow'),
    s('path', { d: 'M50 22L26 32v96l24 8z' }, 'brown', { accent: true }),
    s('circle', { cx: 32, cy: 82, r: 3 }, 'yellow'),
    s('path', { d: 'M146 100H86M98 88L86 100l12 12', ...SW(6) }, 'blue', { stroke: true }),
    ground()
  ],
  anti: [
    s('path', { d: 'M104 136V72', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 70, y: 22, width: 68, height: 52, rx: 4 }, 'cream'),
    outline({ x: 70, y: 22, width: 68, height: 52, rx: 4 }),
    s('path', { d: `${ring(104, 48, 17)}M92 36l24 24`, ...SW(5) }, 'red', { stroke: true }),
    ...person(44, 136, 'blue', { accent: true }),
    s('path', { d: 'M56 98L98 86', ...SW(7) }, 'skin', { stroke: true }),
    ground()
  ],
  asegurar: [
    s('path', { d: 'M56 76V52a24 24 0 0 1 48 0v24', ...SW(10) }, 'gray', { stroke: true }),
    s('rect', { x: 40, y: 70, width: 80, height: 66, rx: 10 }, 'yellow', { accent: true }),
    s('path', { d: 'M80 88a8 8 0 0 1 4 15v13h-8v-13a8 8 0 0 1 4-15z' }, 'dark'),
    s('circle', { cx: 124, cy: 124, r: 18 }, 'green'),
    s('path', { d: 'M115 124l6 6 12-12', ...SW(4) }, 'white', { stroke: true })
  ],
  caballero: [
    ...person(78, 140, 'black', { h: 56, w: 40, r: 16 }),
    s('rect', { x: 64, y: 22, width: 28, height: 28 }, 'black'),
    s('rect', { x: 56, y: 46, width: 44, height: 6, rx: 3 }, 'black'),
    s('rect', { x: 64, y: 40, width: 28, height: 5 }, 'red', { accent: true }),
    s('path', { d: 'M70 84l8 22 8-22z' }, 'white'),
    s('path', { d: 'M68 86l10 5-10 5zM88 86l-10 5 10 5z' }, 'red'),
    s('path', { d: 'M120 138V98q0-8 8-8', ...SW(4) }, 'brown', { stroke: true })
  ],
  'electrónico': [
    backdrop('green'),
    s('path', { d: 'M22 40h22M138 120h-22M22 120h22M138 40h-22M40 22v18M120 138v-18', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M60 32v16M74 32v16M88 32v16M102 32v16M60 112v16M74 112v16M88 112v16M102 112v16M32 60h16M32 74h16M32 88h16M32 102h16M112 60h16M112 74h16M112 88h16M112 102h16', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 48, y: 48, width: 64, height: 64, rx: 6 }, 'dark', { accent: true }),
    s('circle', { cx: 60, cy: 60, r: 4 }, 'gray')
  ],
  eliminar: [
    s('path', { d: 'M44 62h72l-8 74H52z' }, 'gray'),
    s('rect', { x: 38, y: 50, width: 84, height: 10, rx: 3 }, 'dark'),
    s('path', { d: 'M68 50v-6h24v6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 74v50M80 74v50M96 74v50', ...SW(4) }, 'white', { stroke: true }),
    s('circle', { cx: 34, cy: 28, r: 14 }, 'red', { accent: true }),
    s('path', { d: 'M28 22l12 12M40 22l-12 12', ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 116, cy: 28, r: 12 }, 'cream'),
    s('path', { d: `${ring(116, 28, 12)}M108 24l8 6 6-8M110 34l10-2`, ...SW(2) }, 'gray', { stroke: true })
  ],
  'explicación': [
    s('rect', { x: 56, y: 22, width: 90, height: 66, rx: 4 }, 'green'),
    s('path', { d: `${ring(76, 54, 10)}M92 54h22M108 48l6 6-6 6M120 46h16v16h-16z`, ...SW(3) }, 'white', { stroke: true }),
    ...person(32, 136, 'purple', { accent: true }),
    s('path', { d: 'M42 104l14-12', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M56 92L72 64', ...SW(3) }, 'brown', { stroke: true }),
    ground()
  ],
  ganador: [
    s('path', { d: rects([[20, 104, 40, 32], [100, 114, 40, 22]]) }, 'gray'),
    s('rect', { x: 60, y: 88, width: 40, height: 48 }, 'yellow', { accent: true }),
    ...person(80, 88, 'blue', { h: 30, w: 24, r: 10 }),
    s('path', { d: 'M70 66L66 36M90 66l4-30', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M64 14h32q0 18-16 22q-16-4-16-22z' }, 'orange'),
    ground()
  ],
  implicar: [
    ...gear(56, 70, 26, 10, 'gray'),
    ...gear(110, 98, 20, 8, 'orange', { accent: true }),
    s('path', { d: dots([[56, 70], [110, 98]], 7) }, 'dark')
  ],
  marina: [
    s('path', { d: 'M78 62V36', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M78 36l16 6-16 6z' }, 'red'),
    s('path', { d: rects([[54, 78, 44, 22], [68, 62, 20, 16]]) }, 'gray'),
    s('path', { d: 'M98 88h28', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M16 98h128l-14 26H30z' }, 'navy', { accent: true }),
    s('path', { d: 'M14 132q10-8 20 0t20 0t20 0t20 0t20 0t20 0', ...SW(5) }, 'blue', { stroke: true })
  ],
  'múltiple': [
    s('rect', { x: 30, y: 16, width: 100, height: 128, rx: 6 }, 'sky', { accent: true }),
    s('path', { d: 'M42 30h16v16H42zM42 60h16v16H42zM42 90h16v16H42zM42 120h16v16H42z', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M44 38l5 5 11-13M44 68l5 5 11-13M44 128l5 5 11-13', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M70 38h46M70 68h46M70 98h46M70 128h46', ...SW(4) }, 'white', { stroke: true })
  ],
  nacido: [
    s('ellipse', { cx: 80, cy: 104, rx: 32, ry: 34 }, 'sky', { accent: true }),
    s('path', { d: 'M54 72a26 26 0 0 1 52 0v8H54z' }, 'sky'),
    s('circle', { cx: 80, cy: 72, r: 18 }, 'skin'),
    s('path', { d: 'M56 94q24 14 48 0M72 72q3 3 6 0M84 72q3 3 6 0', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: heart(128, 36, 12) }, 'red'),
    s('path', { d: star(32, 38, 11) }, 'yellow')
  ],
  obviamente: [
    s('path', { d: burst(112, 44, 34, 24, 12) }, 'orange'),
    s('circle', { cx: 112, cy: 44, r: 21 }, 'yellow', { accent: true }),
    ...person(48, 136, 'green'),
    s('path', { d: 'M58 98L86 66', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M38 74q10 6 20 0', ...SW(3) }, 'dark', { stroke: true }),
    ground()
  ],
  poeta: [
    s('rect', { x: 24, y: 38, width: 80, height: 100, rx: 4 }, 'cream'),
    outline({ x: 24, y: 38, width: 80, height: 100, rx: 4 }),
    s('path', { d: 'M36 62q10-6 20 0t20 0M36 82q10-6 20 0t20 0t12 0M36 102q10-6 20 0t20 0', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M142 16q-32 10-52 72l6 4q38-36 46-76z' }, 'purple', { accent: true }),
    s('path', { d: 'M92 90l-6 14', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 112, y: 112, width: 28, height: 24, rx: 4 }, 'dark')
  ],
  primaria: [
    s('rect', { x: 70, y: 26, width: 20, height: 26 }, 'red'),
    s('path', { d: 'M74 48q0-12 6-12t6 12z' }, 'yellow', { accent: true }),
    s('path', { d: 'M20 78l60-32 60 32z' }, 'brown'),
    s('rect', { x: 28, y: 76, width: 104, height: 60 }, 'red'),
    s('path', { d: rects([[40, 88, 18, 16], [102, 88, 18, 16]]) }, 'sky'),
    s('rect', { x: 70, y: 100, width: 20, height: 36 }, 'brown'),
    ground()
  ],
  procedimiento: [
    s('path', { d: rects([[54, 16, 52, 26], [54, 66, 52, 26]]) }, 'blue'),
    s('rect', { x: 54, y: 116, width: 52, height: 26, rx: 4 }, 'green', { accent: true }),
    s('path', { d: 'M80 44v18M80 94v18M74 56l6 6 6-6M74 106l6 6 6-6', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[36, 29], [36, 79], [36, 129]], 7) }, 'orange'),
    s('path', { d: 'M66 29h28M66 79h28M66 129h28', ...SW(3) }, 'white', { stroke: true })
  ],
  senado: [
    s('path', { d: 'M80 34V18', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 18l14 5-14 5z' }, 'red'),
    s('path', { d: 'M48 64a32 32 0 0 1 64 0z' }, 'navy', { accent: true }),
    s('rect', { x: 26, y: 62, width: 108, height: 12, rx: 2 }, 'gray'),
    s('path', { d: 'M38 78v42M59 78v42M80 78v42M101 78v42M122 78v42', ...SW(8) }, 'gray', { stroke: true }),
    s('rect', { x: 20, y: 122, width: 120, height: 14, rx: 2 }, 'gray')
  ],
  torre: [
    s('path', { d: 'M48 136V34h12v12h14V34h12v12h14V34h12v102z' }, 'gray', { accent: true }),
    s('path', { d: 'M48 74h64M48 104h64M64 46v28M96 74v30M80 104v10', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M74 70a6 6 0 0 1 12 0v12h-12z' }, 'dark'),
    s('path', { d: 'M68 136v-16a12 12 0 0 1 24 0v16z' }, 'brown'),
    s('path', { d: 'M80 34V14', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 14l18 6-18 6z' }, 'red'),
    ground()
  ],
  afirmar: [
    s('rect', { x: 104, y: 74, width: 30, height: 58, rx: 4 }, 'blue'),
    s('rect', { x: 50, y: 74, width: 58, height: 58, rx: 14 }, 'skin', { accent: true }),
    s('rect', { x: 58, y: 28, width: 20, height: 56, rx: 10 }, 'skin'),
    s('path', { d: 'M74 92h32M74 106h32M74 120h30', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M30 40q-10 14 0 28M18 32q-16 22 0 44M100 26q10 8 10 20M112 18q16 12 16 30', ...SW(4) }, 'orange', { stroke: true })
  ],
  bomba: [
    s('circle', { cx: 70, cy: 94, r: 44 }, 'black', { accent: true }),
    s('rect', { x: 86, y: 42, width: 24, height: 18, rx: 3, transform: 'rotate(40 98 51)' }, 'dark'),
    s('path', { d: 'M106 46q8-20 24-16', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: burst(132, 28, 14, 6, 8) }, 'orange'),
    s('path', { d: 'M46 80a28 28 0 0 1 14-16', ...SW(5) }, 'gray', { stroke: true })
  ],
  'clásico': [
    s('rect', { x: 34, y: 26, width: 92, height: 10, rx: 2 }, 'gray'),
    s('path', { d: dots([[42, 44], [118, 44]], 9) }, 'gray'),
    s('rect', { x: 44, y: 36, width: 72, height: 14, rx: 4 }, 'gray'),
    s('rect', { x: 54, y: 50, width: 52, height: 74 }, 'tan', { accent: true }),
    s('path', { d: 'M66 54v66M80 54v66M94 54v66', ...SW(3) }, 'white', { stroke: true }),
    s('rect', { x: 42, y: 124, width: 76, height: 12, rx: 2 }, 'gray')
  ],
  entendido: [
    ...person(66, 136, 'navy', { h: 50, w: 34, accent: true }),
    s('path', { d: 'M52 70a14 14 0 0 1 28 0h6v4H52z' }, 'navy'),
    s('path', { d: 'M82 98l14-20-14-8', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 122, cy: 42, r: 18 }, 'green'),
    s('path', { d: 'M113 42l6 6 12-12', ...SW(4) }, 'white', { stroke: true }),
    ground()
  ],
  'federación': [
    s('path', { d: fed.map(([x, y]) => `M80 80L${x} ${y}`).join('') + ring(80, 80, 50), ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots(fed.filter((_, i) => i % 2 === 0), 13) }, 'red'),
    s('path', { d: dots(fed.filter((_, i) => i % 2 === 1), 13) }, 'blue'),
    s('circle', { cx: 80, cy: 80, r: 22 }, 'navy', { accent: true }),
    s('path', { d: star(80, 80, 13) }, 'yellow')
  ],
  gloria: [
    s('path', { d: burst(80, 80, 66, 50, 16) }, 'cream'),
    s('path', { d: 'M70 126a46 46 0 0 1-30-74M90 126a46 46 0 0 0 30-74', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots(leaves, 7) }, 'green'),
    s('path', { d: star(80, 82, 24) }, 'yellow', { accent: true }),
    s('path', { d: 'M70 126l10-8 10 8', ...SW(4) }, 'red', { stroke: true })
  ],
  granada: [
    s('path', { d: 'M66 46q14-14 26-6q-12 12-26 6z' }, 'green'),
    s('path', { d: 'M46 54l3-12 7 8 7-8 3 12z' }, 'red'),
    s('circle', { cx: 56, cy: 84, r: 34 }, 'red'),
    s('circle', { cx: 112, cy: 106, r: 30 }, 'red'),
    s('circle', { cx: 112, cy: 106, r: 24 }, 'cream'),
    s('path', { d: dots([[102, 96], [114, 92], [124, 100], [100, 110], [112, 106], [124, 114], [108, 120], [118, 124]], 4) }, 'red', { accent: true })
  ],
  'impresión': [
    s('rect', { x: 50, y: 22, width: 60, height: 30 }, 'cream'),
    outline({ x: 50, y: 22, width: 60, height: 30 }),
    s('rect', { x: 22, y: 46, width: 116, height: 52, rx: 8 }, 'gray', { accent: true }),
    s('rect', { x: 40, y: 86, width: 80, height: 6 }, 'dark'),
    s('rect', { x: 46, y: 90, width: 68, height: 46 }, 'white'),
    outline({ x: 46, y: 90, width: 68, height: 46 }, 'dark', 2),
    s('path', { d: 'M54 130l16-14 12 10 10-8 16 12z' }, 'green'),
    s('circle', { cx: 64, cy: 106, r: 6 }, 'yellow'),
    s('circle', { cx: 120, cy: 62, r: 5 }, 'green')
  ],
  'instalación': [
    s('path', { d: 'M14 18h132', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 18v16', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M88 48l8-14h16l8 14z' }, 'yellow', { accent: true }),
    s('path', { d: 'M36 136L56 64M80 136L84 64M42 114h40M49 88h34', ...SW(4) }, 'brown', { stroke: true }),
    ...person(66, 88, 'blue', { h: 30, w: 22, r: 9 }),
    s('path', { d: 'M74 64L92 48', ...SW(6) }, 'skin', { stroke: true }),
    ground()
  ],
  numeroso: [
    s('path', { d: dots([22, 38, 54, 70, 86, 102, 118, 134].map(x => [x, 52]), 7) }, 'skin'),
    s('path', { d: busts([22, 38, 54, 70, 86, 102, 118, 134], 76, 16, 15) }, 'purple'),
    s('path', { d: dots([26, 44, 62, 80, 98, 116, 134].map(x => [x, 80]), 8) }, 'skin'),
    s('path', { d: busts([26, 44, 62, 80, 98, 116, 134], 108, 18, 18) }, 'blue'),
    s('path', { d: dots([25, 47, 69, 91, 113, 135].map(x => [x, 110]), 10) }, 'skin'),
    s('path', { d: busts([25, 47, 69, 91, 113, 135], 142, 22, 22) }, 'red', { accent: true })
  ],
  oriental: [
    s('path', { d: 'M98 50v-14M72 58l-10-10M124 58l10-10M58 82H44M138 82h14', ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: 'M64 100a34 34 0 0 1 68 0z' }, 'orange', { accent: true }),
    s('rect', { x: 14, y: 100, width: 132, height: 38, rx: 4 }, 'blue'),
    s('path', { d: 'M30 116q8-4 16 0M100 126q8-4 16 0', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M20 28h36M46 18l10 10-10 10', ...SW(5) }, 'dark', { stroke: true })
  ],
  salvar: [
    s('rect', { x: 14, y: 100, width: 132, height: 40, rx: 6 }, 'blue'),
    s('circle', { cx: 80, cy: 72, r: 12 }, 'skin'),
    s('path', { d: 'M98 100l14-34', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 80, cy: 104, r: 30 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 104, r: 22, ...SW(14, { 'stroke-dasharray': '17.3 17.3', 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 104, r: 15 }, 'navy'),
    s('path', { d: 'M18 120q8-6 16 0M122 128q8-6 16 0', ...SW(3) }, 'sky', { stroke: true })
  ],
  talento: [
    s('path', { d: 'M46 72q34-70 68 0', ...DASH(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 44, cy: 58, r: 9 }, 'red'),
    s('circle', { cx: 80, cy: 26, r: 9 }, 'yellow'),
    s('circle', { cx: 116, cy: 58, r: 9 }, 'blue'),
    ...person(80, 136, 'purple', { accent: true }),
    s('path', { d: 'M66 100l-16-18M94 100l16-18', ...SW(7) }, 'skin', { stroke: true }),
    ground()
  ],
  aniversario: [
    s('path', { d: heart(80, 36, 14) }, 'red', { accent: true }),
    s('circle', { cx: 62, cy: 100, r: 26, ...SW(8) }, 'yellow', { stroke: true }),
    s('circle', { cx: 98, cy: 100, r: 26, ...SW(8) }, 'orange', { stroke: true }),
    s('path', { d: 'M56 68l6-8 6 8-6 8z' }, 'sky'),
    s('path', { d: star(28, 46, 8, 3) + star(132, 52, 8, 3) }, 'yellow')
  ],
  anoche: [
    backdrop('navy'),
    s('circle', { cx: 66, cy: 62, r: 30 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 52, r: 26 }, 'navy'),
    s('path', { d: star(116, 40, 8) + star(128, 74, 6) + star(32, 112, 6) }, 'white'),
    s('path', { d: 'M130 112q-34 20-70 2M70 104l-10 10 12 6', ...SW(5) }, 'orange', { stroke: true })
  ],
  aviso: [
    s('rect', { x: 36, y: 24, width: 88, height: 112, rx: 4 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 32, r: 6 }, 'red'),
    s('path', { d: 'M80 48l32 56H48z' }, 'orange'),
    s('path', { d: 'M80 64v20', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 94, r: 4 }, 'dark'),
    s('path', { d: 'M52 118h56', ...SW(3) }, 'dark', { stroke: true })
  ],
  'comparación': [
    s('path', { d: 'M80 30v100M30 44h100', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 52, y: 128, width: 56, height: 8, rx: 3 }, 'dark'),
    s('path', { d: 'M30 44l-14 40M30 44l14 40M130 44l-14 40M130 44l14 40', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 84a16 12 0 0 0 32 0zM114 84a16 12 0 0 0 32 0z' }, 'gray'),
    s('circle', { cx: 30, cy: 74, r: 10 }, 'red', { accent: true }),
    s('circle', { cx: 130, cy: 74, r: 10 }, 'orange'),
    s('circle', { cx: 80, cy: 30, r: 5 }, 'dark')
  ],
  comunista: [
    s('path', { d: 'M36 20v116', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M38 24q30-10 54 0t54 0v56q-30 10-54 0t-54 0z' }, 'red', { accent: true }),
    s('path', { d: star(62, 46, 11) }, 'yellow'),
    ground()
  ],
  dificultad: [
    s('path', { d: 'M14 140L146 60v80z' }, 'tan'),
    s('circle', { cx: 114, cy: 55, r: 24 }, 'gray', { accent: true }),
    ...lean(58, 111, 30, 'blue'),
    s('path', { d: 'M76 86l14-10', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: dots([[40, 50], [32, 62]], 4) }, 'sky')
  ],
  echar: [
    ...person(36, 136, 'green', { accent: true }),
    s('path', { d: 'M48 98l14-26', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M64 66q36-50 66 18', ...DASH(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 130, cy: 90, r: 9 }, 'orange'),
    s('path', { d: 'M112 106h36l-4 30h-28z' }, 'brown'),
    ground()
  ],
  'ejecución': [
    s('rect', { x: 26, y: 100, width: 108, height: 36, rx: 8 }, 'dark'),
    s('path', { d: 'M50 102a30 22 0 0 1 60 0z' }, 'green', { accent: true }),
    s('rect', { x: 64, y: 14, width: 32, height: 26, rx: 4 }, 'blue'),
    s('rect', { x: 70, y: 36, width: 20, height: 48, rx: 10 }, 'skin'),
    s('path', { d: 'M46 66l-12-8M114 66l12-8M42 84H28M118 84h14', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: dots([[46, 118], [114, 118]], 5) }, 'red')
  ],
  entorno: [
    s('circle', { cx: 80, cy: 84, r: 54, ...DASH(3) }, 'gray', { stroke: true }),
    ...person(80, 112, 'blue', { h: 30, w: 24, r: 10, accent: true }),
    s('circle', { cx: 80, cy: 30, r: 11 }, 'yellow'),
    s('path', { d: 'M26 96v12', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 26, cy: 86, r: 12 }, 'green'),
    s('path', { d: 'M122 92l12-12 12 12v14h-24z' }, 'red'),
    s('ellipse', { cx: 80, cy: 138, rx: 18, ry: 7 }, 'sky')
  ],
  experto: [
    ...person(62, 136, 'navy', { h: 50, w: 36, r: 14 }),
    s('path', { d: `${ring(56, 72, 6)}${ring(70, 72, 6)}`, ...SW(2.5) }, 'dark', { stroke: true }),
    s('path', { d: star(62, 106, 9) }, 'yellow', { accent: true }),
    s('path', { d: 'M78 100l22-18', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 116, cy: 64, r: 18 }, 'sky'),
    s('path', { d: `${ring(116, 64, 18)}M104 78l-6 8`, ...SW(5) }, 'dark', { stroke: true }),
    ground()
  ],
  'extensión': [
    s('path', { d: 'M124 107q22 0 22-32t-34-40H70', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 46, y: 26, width: 24, height: 20, rx: 3 }, 'dark'),
    s('path', { d: 'M46 31H34M46 41H34', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 16, y: 92, width: 112, height: 30, rx: 8 }, 'gray'),
    s('path', { d: dots([[36, 107], [60, 107], [84, 107]], 9) }, 'white'),
    s('path', { d: 'M33 103v8M39 103v8M57 103v8M63 103v8M81 103v8M87 103v8', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 102, y: 100, width: 14, height: 14, rx: 2 }, 'red', { accent: true })
  ],
  homenaje: [
    s('rect', { x: 52, y: 92, width: 56, height: 44, rx: 2 }, 'dark'),
    s('path', { d: busts([80], 92, 44, 30) }, 'gray'),
    s('circle', { cx: 80, cy: 50, r: 16 }, 'gray'),
    s('circle', { cx: 80, cy: 114, r: 13, ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M36 136v-14M30 136l4-12M42 136l-4-12M124 136v-14M118 136l4-12M130 136l-4-12', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: dots([[36, 118], [28, 124], [44, 124], [124, 118], [116, 124], [132, 124]], 5) }, 'red', { accent: true }),
    ground()
  ],
  interno: [
    s('rect', { x: 18, y: 18, width: 124, height: 124, rx: 10 }, 'sky'),
    s('rect', { x: 50, y: 50, width: 60, height: 60, rx: 8 }, 'white'),
    s('circle', { cx: 80, cy: 80, r: 18 }, 'orange', { accent: true }),
    s('path', { d: 'M26 80h18M38 74l6 6-6 6M134 80h-18M122 74l-6 6 6 6M80 26v18M74 38l6 6 6-6M80 134v-18M74 122l6-6 6 6', ...SW(4) }, 'navy', { stroke: true })
  ],
  meta: [
    s('path', { d: 'M28 40v96M132 40v96', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 48, y: 18, width: 64, height: 24 }, 'white'),
    s('path', { d: checks }, 'black'),
    outline({ x: 48, y: 18, width: 64, height: 24 }, 'dark', 2),
    s('path', { d: 'M28 80l34 12M132 80l-34 12', ...SW(4) }, 'red', { stroke: true }),
    ...lean(80, 136, 10, 'blue', { accent: true }),
    s('path', { d: 'M70 96l-12-24M92 96l14-22', ...SW(7) }, 'skin', { stroke: true }),
    ground()
  ],
  'petróleo': [
    s('path', { d: 'M50 124l20-58 20 58', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 20, y: 54, width: 100, height: 12, rx: 4, transform: 'rotate(-15 70 60)' }, 'orange', { accent: true }),
    s('path', { d: 'M28 76v48', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 18, y: 122, width: 96, height: 14, rx: 2 }, 'dark'),
    s('path', { d: 'M128 64q16 24 16 36a16 16 0 0 1-32 0q0-12 16-36z' }, 'black'),
    ground()
  ],
  posteriormente: [
    s('path', { d: 'M20 112h114M126 104l10 8-10 8', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 44, cy: 112, r: 9 }, 'gray'),
    s('circle', { cx: 108, cy: 112, r: 12 }, 'orange', { accent: true }),
    s('circle', { cx: 44, cy: 64, r: 18 }, 'gray'),
    s('circle', { cx: 108, cy: 60, r: 24 }, 'sky'),
    s('path', { d: 'M44 64v-10M44 64h8M108 60v-14M108 60l12 8M126 34q14 10 10 28', ...SW(3) }, 'dark', { stroke: true })
  ],
  potencial: [
    s('circle', { cx: 80, cy: 52, r: 38, ...DASH(3) }, 'green', { stroke: true }),
    s('path', { d: 'M80 90v28', ...DASH(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M38 136q42-24 84 0z' }, 'brown'),
    s('path', { d: 'M80 128v-16', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M80 114q-12-2-14-12q12 0 14 12zM80 112q12-2 14-12q-12 0-14 12z' }, 'green', { accent: true })
  ],
  profundo: [
    s('rect', { x: 14, y: 20, width: 132, height: 40 }, 'sky'),
    s('rect', { x: 14, y: 60, width: 132, height: 40 }, 'blue'),
    s('path', { d: 'M14 100h132v32a8 8 0 0 1-8 8H22a8 8 0 0 1-8-8z' }, 'navy', { accent: true }),
    s('path', { d: 'M120 28v96M110 112l10 12 10-12', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: `${ring(52, 92, 5)}M52 97v34M40 122q12 14 24 0M44 104h16`, ...SW(4) }, 'gray', { stroke: true })
  ],
  regular: [
    s('circle', { cx: 64, cy: 78, r: 46 }, 'yellow', { accent: true }),
    s('path', { d: dots([[48, 66], [80, 66]], 5) }, 'dark'),
    s('path', { d: 'M44 98h40', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 106, y: 90, width: 34, height: 26, rx: 8, transform: 'rotate(-20 123 103)' }, 'skin'),
    s('path', { d: 'M108 72q14-10 28 0M110 134q14 10 28 0', ...SW(3) }, 'gray', { stroke: true })
  ],
  renta: [
    s('path', { d: 'M16 76l44-40 44 40z' }, 'red'),
    s('rect', { x: 24, y: 74, width: 72, height: 62 }, 'tan'),
    s('rect', { x: 52, y: 104, width: 16, height: 32 }, 'brown'),
    s('path', { d: rects([[104, 94, 36, 42]]) }, 'yellow', { accent: true }),
    s('path', { d: 'M104 102h36M104 112h36M104 122h36', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: dots([[122, 78]], 10) }, 'yellow'),
    ground()
  ],
  'señalar': [
    s('rect', { x: 14, y: 72, width: 16, height: 44, rx: 4 }, 'blue'),
    s('rect', { x: 26, y: 74, width: 46, height: 40, rx: 12 }, 'skin', { accent: true }),
    s('rect', { x: 56, y: 74, width: 50, height: 14, rx: 7 }, 'skin'),
    s('path', { d: 'M44 96h26M44 106h22', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: star(130, 80, 16) }, 'yellow'),
    s('path', { d: 'M112 62l6-6M112 100l6 6', ...SW(3) }, 'orange', { stroke: true })
  ],
  taller: [
    s('path', { d: 'M100 54l26-26', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 130, cy: 24, r: 10 }, 'gray'),
    s('circle', { cx: 135, cy: 19, r: 5 }, 'white'),
    s('path', { d: 'M20 104v-14q0-6 6-6h18l14-18h40l16 18h14q6 0 6 6v14z' }, 'red', { accent: true }),
    s('path', { d: 'M62 82l8-10h14v10zM90 72h8l10 10H90z' }, 'sky'),
    s('path', { d: dots([[48, 106], [112, 106]], 12) }, 'dark'),
    s('rect', { x: 16, y: 118, width: 128, height: 6 }, 'gray'),
    s('path', { d: 'M80 124v12', ...SW(8) }, 'gray', { stroke: true })
  ],
  ventaja: [
    s('path', { d: 'M14 82h16M18 100h14', ...SW(4) }, 'gray', { stroke: true }),
    ...lean(46, 136, 15, 'gray'),
    ...lean(112, 136, 15, 'red', { accent: true }),
    s('path', { d: 'M66 60h28M72 54l-6 6 6 6M88 54l6 6-6 6', ...SW(4) }, 'orange', { stroke: true }),
    ground()
  ],
  adulto: [
    s('path', { d: 'M22 44v92M16 44h12M16 136h12', ...SW(3) }, 'gray', { stroke: true }),
    ...person(64, 136, 'blue', { h: 60, w: 36, r: 14, accent: true }),
    ...person(116, 136, 'yellow', { h: 28, w: 22, r: 10 }),
    s('path', { d: 'M82 110q14 6 24-2', ...SW(6) }, 'skin', { stroke: true }),
    ground()
  ],
  afectar: [
    s('rect', { x: 24, y: 72, width: 14, height: 64, rx: 2, transform: 'rotate(28 38 136)' }, 'orange', { accent: true }),
    s('rect', { x: 54, y: 72, width: 14, height: 64, rx: 2, transform: 'rotate(15 68 136)' }, 'dark'),
    s('rect', { x: 84, y: 72, width: 14, height: 64, rx: 2, transform: 'rotate(5 98 136)' }, 'dark'),
    s('rect', { x: 114, y: 72, width: 14, height: 64, rx: 2 }, 'dark'),
    s('path', { d: 'M18 50q10-14 26-12', ...SW(4) }, 'gray', { stroke: true }),
    ground()
  ],
  'pasión': [
    s('path', { d: 'M80 14q10 20 24 26q-4-14 6-22q26 30 16 70H34q-10-36 14-58q4 14 14 18q-6-18 18-34z' }, 'orange'),
    s('path', { d: heart(80, 92, 32) }, 'red', { accent: true }),
    s('path', { d: 'M62 76a10 10 0 0 1 10-8', ...SW(4) }, 'pink', { stroke: true })
  ],
  pintura: [
    s('path', { d: 'M54 140L76 30M106 140L84 30M80 110v30', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 34, y: 38, width: 92, height: 66, rx: 2 }, 'sky', { accent: true }),
    s('path', { d: 'M34 104V86q20-18 40-4t52-8v30z' }, 'green'),
    s('circle', { cx: 104, cy: 58, r: 10 }, 'yellow'),
    s('rect', { x: 34, y: 38, width: 92, height: 66, rx: 2, ...SW(4) }, 'tan', { stroke: true }),
    s('rect', { x: 30, y: 104, width: 100, height: 6, rx: 2 }, 'brown')
  ],
  pista: [
    s('path', { d: prints([[24, 130], [42, 118], [42, 98], [60, 88], [62, 68]]) }, 'brown', { accent: true }),
    s('circle', { cx: 112, cy: 50, r: 22 }, 'sky'),
    s('path', { d: `${ring(112, 50, 22)}`, ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 66L80 84', ...SW(9) }, 'dark', { stroke: true }),
    s('path', { d: 'M102 44a12 12 0 0 1 8-6', ...SW(3) }, 'white', { stroke: true })
  ],
  positivo: [
    s('circle', { cx: 80, cy: 80, r: 54 }, 'green', { accent: true }),
    s('path', { d: 'M80 52v56M52 80h56', ...SW(14) }, 'white', { stroke: true }),
    s('path', { d: star(134, 28, 9, 3.5) + star(26, 132, 7, 3) }, 'yellow')
  ],
  'promoción': [
    s('path', { d: burst(84, 84, 62, 50, 18) }, 'yellow'),
    s('path', { d: 'M24 84L72 36h44v44l-48 48z' }, 'red', { accent: true }),
    s('circle', { cx: 102, cy: 50, r: 6 }, 'white'),
    s('path', { d: 'M102 50q16-10 26-32', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M70 66v32M58 86l12 12 12-12', ...SW(6) }, 'white', { stroke: true })
  ],
  'ciudadanía': [
    s('path', { d: rects([[18, 60, 20, 76], [122, 50, 22, 86]]) }, 'gray'),
    s('rect', { x: 44, y: 24, width: 72, height: 104, rx: 6 }, 'navy', { accent: true }),
    s('circle', { cx: 80, cy: 64, r: 18, ...SW(4) }, 'yellow', { stroke: true }),
    s('path', { d: star(80, 64, 10) }, 'yellow'),
    s('path', { d: 'M60 100h40M64 112h32', ...SW(4) }, 'yellow', { stroke: true }),
    ground()
  ],
  dedicado: [
    s('rect', { x: 18, y: 104, width: 124, height: 8, rx: 2 }, 'brown'),
    s('path', { d: 'M28 112v24M132 112v24', ...SW(6) }, 'brown', { stroke: true }),
    ...person(58, 104, 'green', { h: 32, w: 30, r: 13 }),
    s('path', { d: 'M70 96l22 6', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M86 104l26-6v6z' }, 'cream'),
    s('path', { d: 'M126 104V62l-14-10', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M100 46l20 12-6 10-20-12z' }, 'orange', { accent: true }),
    s('path', { d: 'M98 70l-6 14', ...DASH(3, '4 4') }, 'yellow', { stroke: true })
  ],
  descubrir: [
    s('path', { d: 'M80 70V30M56 76L36 50M104 76l20-26', ...SW(5) }, 'yellow', { stroke: true }),
    s('rect', { x: 34, y: 92, width: 92, height: 44, rx: 4 }, 'brown'),
    s('path', { d: 'M30 84l90-34 4 12-90 34z' }, 'red', { accent: true }),
    s('path', { d: star(80, 82, 18) }, 'yellow'),
    s('path', { d: 'M34 106h92', ...SW(3) }, 'tan', { stroke: true })
  ],
  desear: [
    s('path', { d: dots([[96, 72], [106, 60]], 4) }, 'gray'),
    s('ellipse', { cx: 120, cy: 38, rx: 26, ry: 22 }, 'mint'),
    s('rect', { x: 106, y: 30, width: 28, height: 22, rx: 2 }, 'red', { accent: true }),
    s('path', { d: 'M120 30v22M106 40h28M112 24l8 6 8-6', ...SW(3) }, 'yellow', { stroke: true }),
    ...person(64, 136, 'blue', { h: 48 }),
    s('path', { d: 'M56 78q4 3 8 0M66 78q4 3 8 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 112l10-14 10 14', ...SW(7) }, 'skin', { stroke: true }),
    ground()
  ]
};
