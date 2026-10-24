// Illustration specs for common words, batch 0006 (plus leftovers of 0005 and 0010) (see server/scripts/lexicon/art.js)
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
  alcalde: [
    s('path', { d: 'M18 44 80 16l62 28z' }, 'tan'),
    s('rect', { x: 24, y: 42, width: 112, height: 94 }, 'cream'),
    s('path', { d: rects([[32, 52, 10, 84], [118, 52, 10, 84]]) }, 'gray'),
    ...person(80, 136, 'navy', { h: 56, w: 40, r: 15 }),
    s('path', { d: 'M64 84 98 124', ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 92, cy: 112, r: 6 }, 'yellow')
  ],
  altura: [
    backdrop('sky'),
    s('path', { d: 'M14 134 56 92l24 20 28-28 38 42v8q0 12-12 12H26q-12 0-12-12z' }, 'green'),
    s('path', { d: 'M98 36l-10 18h8l18-18zM98 36l-8-14h7l14 14z' }, 'gray'),
    s('path', { d: 'M76 36l-4-12h7l8 10z' }, 'red'),
    s('path', { d: 'M74 36q0-6 8-6h40q10 0 14 6-4 6-14 6H82q-8 0-8-6z' }, 'white'),
    s('path', { d: 'M40 120V44M32 52l8-8 8 8M32 112l8 8 8-8', ...SW(4) }, 'red', { stroke: true, accent: true })
  ],
  candidato: [
    s('path', { d: 'M117 90v46', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 92, y: 24, width: 50, height: 66, rx: 3 }, 'white'),
    outline({ x: 92, y: 24, width: 50, height: 66, rx: 3 }),
    s('path', { d: busts([117], 82, 30, 20) }, 'blue'),
    s('circle', { cx: 117, cy: 50, r: 10 }, 'skin'),
    ...person(52, 136, 'blue', { accent: true }),
    s('path', { d: 'M66 100 82 72', ...SW(7) }, 'skin', { stroke: true })
  ],
  competencia: [
    s('rect', { x: 22, y: 98, width: 40, height: 38 }, 'gray'),
    s('rect', { x: 60, y: 78, width: 40, height: 58 }, 'yellow', { accent: true }),
    s('rect', { x: 98, y: 110, width: 40, height: 26 }, 'orange'),
    ...person(80, 78, 'red', { h: 26, w: 18, r: 9 }),
    ...person(42, 98, 'blue', { h: 26, w: 18, r: 9 }),
    ...person(118, 110, 'green', { h: 26, w: 18, r: 9 })
  ],
  facultad: [
    s('path', { d: 'M18 74 80 50l62 24z' }, 'tan'),
    s('rect', { x: 24, y: 72, width: 112, height: 56 }, 'cream'),
    s('path', { d: rects([[34, 80, 12, 46], [60, 80, 12, 46], [88, 80, 12, 46], [114, 80, 12, 46]]) }, 'gray'),
    s('rect', { x: 18, y: 126, width: 124, height: 10, rx: 2 }, 'gray'),
    s('path', { d: 'M62 29v9q18 8 36 0v-9z' }, 'dark'),
    s('path', { d: 'M80 12 114 24 80 36 46 24z' }, 'dark', { accent: true }),
    s('path', { d: 'M110 25v16', ...SW(3) }, 'yellow', { stroke: true })
  ],
  'generación': [
    ground(),
    ...person(36, 136, 'gray', { h: 40, w: 26, r: 11 }),
    s('path', { d: 'M25 82a11 11 0 0 1 22 0', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M54 106v30', ...SW(4) }, 'brown', { stroke: true }),
    ...person(82, 136, 'blue', { h: 50, w: 30, r: 12, accent: true }),
    ...person(124, 136, 'orange', { h: 26, w: 20, r: 9 })
  ],
  'gestión': [
    s('rect', { x: 28, y: 30, width: 78, height: 106, rx: 6 }, 'brown'),
    s('rect', { x: 36, y: 42, width: 62, height: 86 }, 'white'),
    s('rect', { x: 52, y: 22, width: 30, height: 14, rx: 4 }, 'gray'),
    s('path', { d: 'M44 62l5 5 9-10M44 86l5 5 9-10M44 110l5 5 9-10', ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M66 62h24M66 86h24M66 110h24', ...SW(4) }, 'gray', { stroke: true }),
    ...gear(126, 40, 11, 8, 'orange')
  ],
  menudo: [
    s('circle', { cx: 80, cy: 80, r: 56, ...SW(4, { 'stroke-dasharray': '8 8' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 28 54 54M54 40v14H40M132 28 106 54M106 40v14h14M28 132 54 106M40 106h14v14M132 132 106 106M120 106h-14v14', ...SW(5) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 7 }, 'red', { accent: true })
  ],
  presupuesto: [
    s('rect', { x: 22, y: 24, width: 70, height: 112, rx: 8 }, 'navy'),
    s('rect', { x: 30, y: 34, width: 54, height: 22, rx: 3 }, 'mint'),
    s('path', { d: rects([30, 50, 70].flatMap(x => [64, 82, 100, 118].map(y => [x, y, 14, 12]))) }, 'cream'),
    s('rect', { x: 104, y: 52, width: 40, height: 26, rx: 3 }, 'green'),
    s('circle', { cx: 124, cy: 65, r: 6 }, 'mint'),
    s('rect', { x: 100, y: 100, width: 44, height: 36, rx: 4 }, 'yellow', { accent: true }),
    s('path', { d: 'M100 112h44M100 124h44', ...SW(3) }, 'orange', { stroke: true })
  ],
  querido: [
    s('rect', { x: 20, y: 48, width: 120, height: 80, rx: 6 }, 'cream'),
    outline({ x: 20, y: 48, width: 120, height: 80, rx: 6 }, 'tan'),
    s('path', { d: 'M22 52 80 94l58-42', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: heart(80, 84, 16) }, 'red', { accent: true }),
    s('path', { d: heart(118, 30, 8) + heart(44, 32, 6) }, 'pink')
  ],
  sonar: [
    s('rect', { x: 56, y: 30, width: 48, height: 100, rx: 8 }, 'dark'),
    s('rect', { x: 62, y: 42, width: 36, height: 70, rx: 3 }, 'sky'),
    s('circle', { cx: 80, cy: 121, r: 4 }, 'gray'),
    s('path', { d: 'M70 86q0-16 10-16t10 16l3 6H67z' }, 'yellow'),
    s('circle', { cx: 80, cy: 96, r: 3 }, 'yellow'),
    s('path', { d: 'M44 60q-10 20 0 40M32 50q-16 30 0 60M116 60q10 20 0 40M128 50q16 30 0 60', ...SW(5) }, 'orange', { stroke: true, accent: true })
  ],
  suponer: [
    ...person(46, 136, 'purple', { h: 48, w: 32, r: 14 }),
    s('path', { d: 'M56 104 62 86', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: dots([[66, 64], [76, 54]], 4) }, 'sky'),
    s('ellipse', { cx: 108, cy: 38, rx: 34, ry: 24 }, 'sky'),
    s('path', { d: 'M99 31q0-11 9-11t9 9q0 7-9 10v6', ...SW(5) }, 'navy', { stroke: true, accent: true }),
    s('circle', { cx: 108, cy: 54, r: 3.5 }, 'navy')
  ],
  basta: [
    s('polygon', { points: '56,18 104,18 142,56 142,104 104,142 56,142 18,104 18,56' }, 'red', { accent: true }),
    s('path', { d: 'M62 76V46M74 72V38M86 72V40M98 78V50M60 100 46 86', ...SW(11) }, 'skin', { stroke: true }),
    s('rect', { x: 56, y: 70, width: 48, height: 52, rx: 16 }, 'skin')
  ],
  cita: [
    s('rect', { x: 16, y: 30, width: 90, height: 96, rx: 6 }, 'white'),
    outline({ x: 16, y: 30, width: 90, height: 96, rx: 6 }),
    s('rect', { x: 16, y: 30, width: 90, height: 22, rx: 6 }, 'pink'),
    s('path', { d: 'M38 22v16M84 22v16', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: heart(61, 86, 16) }, 'red', { accent: true }),
    s('rect', { x: 112, y: 104, width: 26, height: 30, rx: 4 }, 'orange'),
    s('path', { d: 'M138 110h3a7 7 0 0 1 0 14h-3', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M120 96q-4-6 0-12M130 96q-4-6 0-12', ...SW(3) }, 'gray', { stroke: true })
  ],
  consumo: [
    s('rect', { x: 50, y: 38, width: 22, height: 26, rx: 3 }, 'red'),
    s('circle', { cx: 88, cy: 48, r: 12 }, 'yellow'),
    s('rect', { x: 102, y: 30, width: 16, height: 34, rx: 3 }, 'green'),
    s('path', { d: 'M40 58h94l-12 44H46z' }, 'orange', { accent: true }),
    s('path', { d: 'M14 40h18l14 62h76l12-44H38', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: dots([[56, 124], [112, 124]], 8) }, 'dark')
  ],
  contexto: [
    s('rect', { x: 30, y: 18, width: 100, height: 124, rx: 6 }, 'white'),
    outline({ x: 30, y: 18, width: 100, height: 124, rx: 6 }),
    s('path', { d: 'M44 36h72M44 50h72M44 64h72M44 96h72M44 110h72M44 124h50', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 38, y: 72, width: 84, height: 16, rx: 4 }, 'yellow', { accent: true }),
    s('path', { d: 'M56 80h48', ...SW(5) }, 'red', { stroke: true })
  ],
  culo: [
    s('path', { d: 'M30 96h40v44H34zM90 96h40l-4 44H90z' }, 'blue'),
    s('path', { d: dots([[56, 82], [104, 82]], 30) }, 'blue', { accent: true }),
    s('rect', { x: 26, y: 30, width: 108, height: 16, rx: 4 }, 'navy'),
    s('path', { d: 'M80 46v60', ...SW(3) }, 'navy', { stroke: true })
  ],
  figura: [
    s('circle', { cx: 50, cy: 52, r: 28 }, 'red', { accent: true }),
    s('rect', { x: 90, y: 26, width: 52, height: 52, rx: 4 }, 'blue'),
    s('path', { d: 'M80 84 116 140H44z' }, 'yellow')
  ],
  municipal: [
    ground(),
    s('rect', { x: 22, y: 80, width: 116, height: 56 }, 'cream'),
    outline({ x: 22, y: 80, width: 116, height: 56 }, 'tan'),
    s('rect', { x: 62, y: 36, width: 36, height: 46 }, 'tan'),
    s('path', { d: 'M58 38 80 16l22 22z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 58, r: 11 }, 'white'),
    s('path', { d: 'M80 51v7l5 4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: rects([[32, 94, 16, 20], [112, 94, 16, 20]]) }, 'sky'),
    s('rect', { x: 70, y: 108, width: 20, height: 28, rx: 2 }, 'brown')
  ],
  objeto: [
    s('ellipse', { cx: 80, cy: 136, rx: 48, ry: 6 }, 'gray'),
    s('path', { d: 'M80 30 128 52 80 74 32 52z' }, 'yellow'),
    s('path', { d: 'M32 52 80 74v58L32 110z' }, 'orange', { accent: true }),
    s('path', { d: 'M128 52 80 74v58l48-22z' }, 'brown'),
    s('path', { d: 'M132 14l3 8 8 3-8 3-3 8-3-8-8-3 8-3z' }, 'yellow')
  ],
  'publicación': [
    s('rect', { x: 24, y: 28, width: 92, height: 108, rx: 3 }, 'white'),
    outline({ x: 24, y: 28, width: 92, height: 108, rx: 3 }),
    s('rect', { x: 34, y: 38, width: 72, height: 12 }, 'dark'),
    s('rect', { x: 34, y: 58, width: 36, height: 30 }, 'sky'),
    s('path', { d: 'M78 62h28M78 74h28M78 86h28M34 100h72M34 112h72M34 124h72', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: burst(122, 36, 22, 13, 10) }, 'yellow', { accent: true })
  ],
  tratamiento: [
    s('rect', { x: 30, y: 52, width: 56, height: 84, rx: 8 }, 'orange'),
    s('rect', { x: 34, y: 34, width: 48, height: 20, rx: 4 }, 'white'),
    outline({ x: 34, y: 34, width: 48, height: 20, rx: 4 }),
    s('rect', { x: 36, y: 76, width: 44, height: 42, rx: 3 }, 'white'),
    s('path', { d: 'M52 84h12v9h9v12h-9v9H52v-9h-9V93h9z' }, 'red', { accent: true }),
    s('path', { d: 'M100 118l22-22a10 10 0 0 1 14 14l-22 22a10 10 0 0 1-14-14z' }, 'blue'),
    s('path', { d: 'M111 107l11-11a10 10 0 0 1 14 14l-11 11z' }, 'pink'),
    s('circle', { cx: 126, cy: 66, r: 11 }, 'mint')
  ],
  villa: [
    ground(),
    s('path', { d: rects([[18, 96, 36, 40], [108, 100, 34, 36]]) }, 'cream'),
    s('path', { d: 'M14 98 36 76l22 22zM104 102l21-20 21 20z' }, 'red'),
    s('rect', { x: 62, y: 70, width: 36, height: 66 }, 'yellow', { accent: true }),
    s('path', { d: 'M58 72 80 42l22 30z' }, 'brown'),
    s('path', { d: 'M80 22v18M73 29h14', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: rects([[73, 112, 14, 24], [30, 112, 12, 24], [119, 114, 12, 22]]) }, 'brown')
  ],
  conciencia: [
    backdrop('sky'),
    s('path', { d: busts([80], 146, 56, 40) }, 'blue'),
    s('circle', { cx: 80, cy: 86, r: 20 }, 'skin'),
    s('path', { d: 'M14 50q8-14 18-4q10-10 18 4q-10 6-18 0q-8 6-18 0z' }, 'white'),
    s('circle', { cx: 32, cy: 48, r: 9 }, 'cream'),
    s('ellipse', { cx: 32, cy: 34, rx: 10, ry: 3, ...SW(3) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M120 42l-3-14 9 7zM136 42l3-14-9 7z' }, 'red'),
    s('circle', { cx: 128, cy: 48, r: 9 }, 'red')
  ],
  'cárcel': [
    backdrop('gray'),
    s('rect', { x: 34, y: 30, width: 92, height: 100, rx: 4 }, 'dark'),
    s('path', { d: busts([80], 130, 52, 36) }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 76, r: 16 }, 'skin'),
    s('path', { d: 'M52 30v100M72 30v100M92 30v100M112 30v100M34 30h92v100H34z', ...SW(6) }, 'gray', { stroke: true })
  ],
  digital: [
    s('path', { d: 'M56 22v18M72 22v18M88 22v18M104 22v18M56 120v18M72 120v18M88 120v18M104 120v18M22 56h18M22 72h18M22 88h18M22 104h18M120 56h18M120 72h18M120 88h18M120 104h18', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 38, y: 38, width: 84, height: 84, rx: 8 }, 'dark'),
    s('rect', { x: 56, y: 56, width: 48, height: 48, rx: 4 }, 'blue', { accent: true }),
    s('circle', { cx: 48, cy: 48, r: 3 }, 'gray')
  ],
  distrito: [
    s('rect', { x: 14, y: 26, width: 132, height: 112, rx: 6 }, 'gray'),
    s('path', { d: 'M20 32h60l-6 48H20z' }, 'mint'),
    s('path', { d: 'M86 32h54v42l-60 8z' }, 'yellow'),
    s('path', { d: 'M20 86h52l-4 46H20z' }, 'sky'),
    s('path', { d: 'M78 88l62-8v52H74z' }, 'pink'),
    s('path', { d: 'M80 16c-12 0-20 9-20 20 0 15 20 36 20 36s20-21 20-36c0-11-8-20-20-20z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 36, r: 7 }, 'white')
  ],
  familiar: [
    s('rect', { x: 30, y: 70, width: 100, height: 66 }, 'cream'),
    outline({ x: 30, y: 70, width: 100, height: 66 }, 'tan'),
    s('path', { d: 'M22 74 80 26l58 48z' }, 'red'),
    s('path', { d: heart(80, 54, 9) }, 'pink', { accent: true }),
    s('path', { d: busts([56, 104], 136, 22, 30) }, 'navy'),
    s('path', { d: busts([80], 136, 16, 18) }, 'orange'),
    s('path', { d: dots([[56, 96], [104, 96]], 10) + dots([[80, 110]], 7) }, 'skin')
  ],
  'fundación': [
    s('path', { d: heart(80, 74, 24) }, 'red', { accent: true }),
    s('path', { d: 'M18 98q10-8 22 4l22 18h36l22-18q12-12 22-4l-26 38H44z' }, 'skin'),
    s('path', { d: 'M40 102l18 16M120 102l-18 16', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M30 30v14M23 37h14M130 26v14M123 33h14', ...SW(3) }, 'yellow', { stroke: true })
  ],
  ganado: [
    s('path', { d: 'M14 128q66-12 132 0v12H14z' }, 'green'),
    s('path', { d: 'M50 104v28M64 104v28M98 104v28M112 104v28M40 80q-12 6-10 26', ...SW(7) }, 'brown', { stroke: true }),
    s('rect', { x: 40, y: 66, width: 84, height: 44, rx: 20 }, 'brown', { accent: true }),
    s('path', { d: 'M56 70q14 0 14 14t-16 12zM94 80q12-4 16 8t-12 14z' }, 'cream'),
    s('path', { d: 'M122 52q-6-10 0-16M142 52q6-10 0-16', ...SW(4) }, 'tan', { stroke: true }),
    s('rect', { x: 118, y: 48, width: 28, height: 36, rx: 12 }, 'brown'),
    s('ellipse', { cx: 132, cy: 82, rx: 14, ry: 9 }, 'pink'),
    s('path', { d: dots([[126, 62], [138, 62]], 3) }, 'dark')
  ],
  'histórico': [
    ground(),
    s('path', { d: rects([[30, 42, 18, 86], [72, 42, 18, 86]]) + 'M114 128V82l6-6 4 8 6-10v54z' }, 'tan'),
    s('path', { d: 'M35 46v78M43 46v78M77 46v78M85 46v78', ...SW(2) }, 'brown', { stroke: true }),
    s('rect', { x: 22, y: 30, width: 76, height: 12, rx: 2 }, 'gray', { accent: true }),
    s('path', { d: rects([[24, 126, 30, 10], [66, 126, 30, 10], [108, 126, 28, 10]]) }, 'gray'),
    s('path', { d: 'M104 136l6-8h10l4 8z' }, 'tan')
  ],
  'intención': [
    s('circle', { cx: 126, cy: 80, r: 20 }, 'red', { accent: true }),
    s('circle', { cx: 126, cy: 80, r: 12 }, 'white'),
    s('circle', { cx: 126, cy: 80, r: 5 }, 'red'),
    s('path', { d: 'M86 80h22', ...SW(3, { 'stroke-dasharray': '4 6' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 30 22 80l14 50', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M36 30q34 50 0 100', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M20 80h56', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M86 80l-12-7v14z' }, 'dark')
  ],
  junta: [
    s('path', { d: busts([46, 80, 114], 92, 28, 34) }, 'purple'),
    s('path', { d: dots([[46, 46], [80, 44], [114, 46]], 11) }, 'skin'),
    s('ellipse', { cx: 80, cy: 102, rx: 66, ry: 22 }, 'brown', { accent: true }),
    s('path', { d: rects([[52, 94, 18, 12], [92, 96, 18, 12]]) }, 'white'),
    s('path', { d: busts([46, 114], 148, 32, 22) }, 'blue'),
    s('path', { d: dots([[46, 124], [114, 124]], 12) }, 'dark')
  ],
  'máximo': [
    s('rect', { x: 52, y: 18, width: 48, height: 124, rx: 8, ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: rects([[60, 116, 32, 18], [60, 94, 32, 18], [60, 72, 32, 18]]) }, 'green'),
    s('rect', { x: 60, y: 50, width: 32, height: 18 }, 'yellow'),
    s('rect', { x: 60, y: 28, width: 32, height: 18 }, 'red', { accent: true }),
    s('path', { d: 'M122 128V30M110 42l12-12 12 12', ...SW(5) }, 'red', { stroke: true })
  ],
  'ocasión': [
    s('path', { d: burst(80, 80, 64, 48, 16) }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 38 }, 'white'),
    outline({ cx: 80, cy: 80, r: 38 }, 'navy', 5),
    s('path', { d: 'M80 80V54M80 80l18 10', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 4 }, 'red')
  ],
  parir: [
    s('circle', { cx: 62, cy: 74, r: 12 }, 'skin'),
    s('path', { d: 'M54 86h16l16 50H38z' }, 'pink'),
    s('path', { d: 'M56 78q-6-20 8-18t10 6', ...SW(5) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 92, cy: 100, rx: 22, ry: 13, transform: 'rotate(-20 92 100)' }, 'sky', { accent: true }),
    s('circle', { cx: 106, cy: 90, r: 9 }, 'skin'),
    s('path', { d: 'M66 96q14 16 34 6', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: heart(110, 46, 10) }, 'red')
  ],
  privado: [
    s('rect', { x: 36, y: 18, width: 88, height: 122, rx: 4 }, 'brown'),
    s('path', { d: rects([[48, 30, 64, 30], [48, 118, 64, 12]]) }, 'tan'),
    s('path', { d: 'M66 78V66a14 14 0 0 1 28 0v12', ...SW(7) }, 'gray', { stroke: true }),
    s('rect', { x: 58, y: 76, width: 44, height: 36, rx: 5 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 90, r: 5 }, 'dark'),
    s('path', { d: 'M80 92v10', ...SW(4) }, 'dark', { stroke: true })
  ],
  'propósito': [
    s('circle', { cx: 70, cy: 88, r: 52 }, 'red', { accent: true }),
    s('circle', { cx: 70, cy: 88, r: 38 }, 'white'),
    s('circle', { cx: 70, cy: 88, r: 24 }, 'red'),
    s('circle', { cx: 70, cy: 88, r: 10 }, 'white'),
    s('path', { d: 'M70 88 130 28', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M124 20v14h14M132 14v14h14', ...SW(4) }, 'orange', { stroke: true })
  ],
  sede: [
    ground(),
    s('path', { d: rects([[20, 96, 30, 40], [110, 90, 30, 46]]) }, 'gray'),
    s('rect', { x: 50, y: 48, width: 60, height: 88 }, 'navy'),
    s('path', { d: rects([58, 74, 90].flatMap(x => [64, 82, 100, 118].map(y => [x, y, 12, 10]))) }, 'sky'),
    s('path', { d: 'M80 12c-10 0-17 7-17 16 0 12 17 26 17 26s17-14 17-26c0-9-7-16-17-16z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 28, r: 6 }, 'white')
  ],
  soldado: [
    s('path', { d: 'M30 136V30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 32h34v22H30z' }, 'red'),
    ...person(84, 136, 'green', { h: 52, w: 36, r: 14 }),
    s('path', { d: 'M68 68a16 16 0 0 1 32 0h4v5H64v-5z' }, 'green', { accent: true }),
    s('path', { d: 'M66 112h36', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: rects([[66, 128, 15, 8], [87, 128, 15, 8]]) }, 'dark'),
    s('path', { d: 'M102 92 114 74 100 64', ...SW(6) }, 'skin', { stroke: true })
  ],
  'técnico': [
    ...gear(128, 116, 10, 8, 'orange'),
    ...person(56, 136, 'blue', { h: 50, w: 34, r: 14 }),
    s('path', { d: 'M40 70a16 16 0 0 1 32 0h6v5H34v-5z' }, 'yellow', { accent: true }),
    s('path', { d: 'M72 100 102 84', ...SW(7) }, 'blue', { stroke: true }),
    s('path', { d: 'M100 86 128 58', ...SW(8) }, 'gray', { stroke: true }),
    s('circle', { cx: 132, cy: 52, r: 12 }, 'gray'),
    s('path', { d: 'M134 50l10-10', ...SW(8) }, 'white', { stroke: true })
  ],
  ay: [
    s('circle', { cx: 76, cy: 86, r: 52 }, 'yellow'),
    s('path', { d: burst(124, 34, 20, 9, 8) }, 'red', { accent: true }),
    s('path', { d: 'M46 72l14 6-14 6M106 72l-14 6 14 6', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 58l16 4M108 58l-16 4', ...SW(4) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 76, cy: 114, rx: 14, ry: 10 }, 'dark')
  ],
  cadena: [
    s('path', { d: 'M38 80h28M92 80h28', transform: 'rotate(-30 80 80)', ...SW(12) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 30, cy: 80, rx: 20, ry: 13, transform: 'rotate(-30 80 80)', ...SW(7) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 80, cy: 80, rx: 20, ry: 13, transform: 'rotate(-30 80 80)', ...SW(7) }, 'yellow', { stroke: true, accent: true }),
    s('ellipse', { cx: 130, cy: 80, rx: 20, ry: 13, transform: 'rotate(-30 80 80)', ...SW(7) }, 'gray', { stroke: true })
  ],
  'capitán': [
    s('path', { d: 'M80 40v104M28 92h104M43 55l74 74M117 55l-74 74', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 92, r: 40, ...SW(8) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 92, r: 10 }, 'brown'),
    s('path', { d: 'M46 38q-4-20 34-22q38 2 34 22z' }, 'white'),
    s('path', { d: 'M46 38q-4-20 34-22q38 2 34 22z', ...SW(3) }, 'navy', { stroke: true }),
    s('rect', { x: 48, y: 34, width: 64, height: 12 }, 'navy'),
    s('path', { d: 'M50 48q30 12 60 0', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 40, r: 5 }, 'yellow', { accent: true })
  ],
  'continuación': [
    s('path', { d: rects([[16, 52, 30, 40], [52, 52, 30, 40]]) }, 'blue'),
    s('rect', { x: 88, y: 52, width: 30, height: 40, ...SW(3, { 'stroke-dasharray': '6 5' }) }, 'gray', { stroke: true }),
    s('path', { d: dots([[128, 72], [138, 72]], 3) }, 'gray'),
    s('path', { d: 'M20 116h112M120 104l12 12-12 12', ...SW(6) }, 'orange', { stroke: true, accent: true })
  ],
  europeo: [
    s('rect', { x: 14, y: 34, width: 132, height: 92, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: Array.from({ length: 12 }, (_, i) => star(80 + 30 * Math.cos(i * Math.PI / 6), 80 + 30 * Math.sin(i * Math.PI / 6), 6)).join('') }, 'yellow')
  ],
  fernando: [
    s('path', { d: 'M53 54h54l-4.6 80H57.6z' }, 'brown', { accent: true }),
    s('path', { d: 'M52 44q7-6 14 0t14 0t14 0t14 0v12H52z' }, 'tan'),
    s('path', { d: rects([[64, 74, 14, 14], [84, 92, 14, 14]]) }, 'sky'),
    s('path', { d: 'M50 30h60l-6 106H56z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M98 16 88 64', ...SW(5) }, 'red', { stroke: true })
  ],
  influencia: [
    s('rect', { x: 58, y: 100, width: 44, height: 36, rx: 3 }, 'tan'),
    ...person(80, 100, 'purple', { h: 34, w: 26, r: 12, accent: true }),
    s('path', { d: 'M52 48q-10 20 0 40M108 48q10 20 0 40M40 40q-16 28 0 56M120 40q16 28 0 56', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: busts([28, 132], 140, 22, 26) }, 'gray'),
    s('path', { d: dots([[28, 106], [132, 106]], 9) }, 'skin')
  ],
  judicial: [
    s('rect', { x: 26, y: 118, width: 70, height: 16, rx: 4 }, 'brown'),
    s('path', { d: 'M74 57 116 118', ...SW(8) }, 'tan', { stroke: true }),
    s('rect', { x: 46, y: 44, width: 56, height: 26, rx: 6, transform: 'rotate(-35 74 57)' }, 'brown', { accent: true }),
    s('path', { d: rects([[56, 42, 6, 30], [86, 42, 6, 30]]), transform: 'rotate(-35 74 57)' }, 'yellow'),
    s('path', { d: 'M30 104l-8-8M48 100l-2-12', ...SW(3) }, 'gray', { stroke: true })
  ],
  lenguaje: [
    s('path', { d: 'M30 24h48q14 0 14 14v22q0 14-14 14H48l-18 16 2-16q-16 0-16-14V38q0-14 14-14z' }, 'blue'),
    s('path', { d: 'M82 78h48q14 0 14 14v22q0 14-14 14h-2l2 16-18-16H82q-14 0-14-14V92q0-14 14-14z' }, 'orange', { accent: true }),
    s('path', { d: 'M30 44h48M30 56h30M82 98h48M82 110h30', ...SW(5) }, 'white', { stroke: true })
  ],
  literatura: [
    s('path', { d: 'M14 52q34-10 66 4q32-14 66-4v86q-34-8-66 6q-32-14-66-6z' }, 'red'),
    s('path', { d: 'M20 50q30-10 58 4v78q-28-12-58-4zM82 54q28-14 58-4v78q-30-8-58 4z' }, 'cream'),
    s('path', { d: 'M28 70q22-6 42 2M28 86q22-6 42 2M28 102q22-6 42 2M90 72q20-8 40-4M90 88q20-8 40-4', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M136 14q6 30-24 54l-6-6q8-38 30-48z' }, 'purple', { accent: true }),
    s('path', { d: 'M108 64 98 80', ...SW(3) }, 'dark', { stroke: true })
  ],
  online: [
    s('rect', { x: 30, y: 46, width: 100, height: 66, rx: 5 }, 'dark'),
    s('rect', { x: 36, y: 52, width: 88, height: 54, rx: 2 }, 'sky'),
    s('path', { d: 'M18 112h124l-8 12H26z' }, 'gray'),
    s('path', { d: 'M68 84a17 17 0 0 1 24 0M58 74a31 31 0 0 1 44 0', ...SW(5) }, 'blue', { stroke: true }),
    s('circle', { cx: 80, cy: 94, r: 4 }, 'blue'),
    s('circle', { cx: 128, cy: 46, r: 11 }, 'green', { accent: true }),
    outline({ cx: 128, cy: 46, r: 11 }, 'white', 3)
  ],
  saludo: [
    ...person(66, 136, 'orange', { accent: true }),
    s('path', { d: 'M80 100 102 68', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 104, cy: 62, r: 8 }, 'skin'),
    s('path', { d: 'M116 48q8 8 6 20M124 40q12 12 10 30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M61 81q5 5 10 0', ...SW(2) }, 'dark', { stroke: true })
  ],
  actitud: [
    s('circle', { cx: 72, cy: 74, r: 50 }, 'yellow'),
    s('path', { d: 'M30 64h84', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M38 62h28v10q0 10-14 10t-14-10zM78 62h28v10q0 10-14 10t-14-10z' }, 'dark', { accent: true }),
    s('path', { d: 'M54 100q16 10 32-4', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M122 108V88', ...SW(10) }, 'skin', { stroke: true }),
    s('rect', { x: 112, y: 104, width: 28, height: 30, rx: 7 }, 'skin'),
    s('path', { d: 'M114 114h14M114 124h14', ...SW(2) }, 'tan', { stroke: true })
  ],
  'búsqueda': [
    s('path', { d: 'M94 94 134 134', ...SW(14) }, 'brown', { stroke: true, accent: true }),
    s('circle', { cx: 66, cy: 66, r: 34 }, 'sky'),
    s('circle', { cx: 66, cy: 66, r: 34, ...SW(10) }, 'navy', { stroke: true }),
    s('path', { d: 'M48 56q6-12 20-12', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M18 124h20M24 138h26', ...SW(4) }, 'gray', { stroke: true })
  ],
  'espíritu': [
    backdrop('navy'),
    s('path', { d: 'M48 126V70a32 32 0 0 1 64 0v56l-10.7-8-10.7 8-10.6-8-10.7 8-10.6-8z' }, 'white', { accent: true }),
    s('path', { d: dots([[68, 72], [92, 72]], 5) }, 'dark'),
    s('ellipse', { cx: 80, cy: 92, rx: 6, ry: 8 }, 'dark'),
    s('path', { d: dots([[30, 32], [132, 40], [124, 116], [34, 100]], 3) }, 'yellow')
  ],
  existencia: [
    s('path', { d: 'M68 14h24l42 122H26z' }, 'yellow'),
    s('ellipse', { cx: 80, cy: 136, rx: 56, ry: 8 }, 'cream'),
    ...person(80, 136, 'purple', { h: 50, w: 32, r: 14, accent: true }),
    s('path', { d: 'M36 48l-8-6M124 48l8-6M30 80H18M130 80h12', ...SW(4) }, 'orange', { stroke: true })
  ],
  frontera: [
    s('rect', { x: 14, y: 96, width: 66, height: 40 }, 'green'),
    s('rect', { x: 80, y: 96, width: 66, height: 40 }, 'tan'),
    s('path', { d: 'M80 96v40', ...SW(4, { 'stroke-dasharray': '6 6' }) }, 'dark', { stroke: true }),
    s('rect', { x: 28, y: 64, width: 14, height: 52, rx: 2 }, 'gray'),
    s('path', { d: 'M36 70h104', ...SW(10) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M46 70h94', ...SW(10, { 'stroke-linecap': 'butt', 'stroke-dasharray': '10 10' }) }, 'white', { stroke: true })
  ],
  obstante: [
    ground(),
    s('path', { d: 'M48 136q-4-40 32-46q36 0 34 46z' }, 'gray'),
    s('path', { d: 'M66 104q6-6 12-4M92 116l10-4', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M22 128q6-82 58-82t58 74M128 114l10 8 4-12', ...SW(5) }, 'orange', { stroke: true, accent: true })
  ],
  pobreza: [
    s('rect', { x: 24, y: 64, width: 100, height: 66, rx: 8 }, 'brown', { accent: true }),
    s('path', { d: 'M34 80h80', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M74 106h16', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M110 40q-14-16-22-4q8 12 22 4zM110 40q14-16 22-4q-8 12-22 4z' }, 'gray'),
    s('path', { d: 'M110 32v16', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[96, 58], [124, 60], [86, 46]], 2) }, 'gray')
  ],
  sexual: [
    s('circle', { cx: 58, cy: 62, r: 22, ...SW(8) }, 'pink', { stroke: true }),
    s('path', { d: 'M58 84v36M44 104h28', ...SW(8) }, 'pink', { stroke: true }),
    s('circle', { cx: 98, cy: 92, r: 22, ...SW(8) }, 'blue', { stroke: true }),
    s('path', { d: 'M114 76 136 54M120 54h16v16', ...SW(8) }, 'blue', { stroke: true, accent: true })
  ],
  super: [
    s('path', { d: 'M20 110h30M30 122h30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M58 72 14 54l12 20-10 16 40-6z' }, 'red', { accent: true }),
    s('rect', { x: 44, y: 70, width: 64, height: 24, rx: 12 }, 'blue'),
    s('path', { d: 'M100 74 126 64', ...SW(7) }, 'blue', { stroke: true }),
    s('circle', { cx: 132, cy: 62, r: 7 }, 'skin'),
    s('circle', { cx: 116, cy: 82, r: 12 }, 'skin'),
    s('path', { d: star(78, 82, 9) }, 'yellow')
  ],
  'vacación': [
    s('circle', { cx: 120, cy: 38, r: 16 }, 'yellow'),
    s('path', { d: 'M14 100q16-6 33 0t33 0t33 0t33 0v16H14z' }, 'sky'),
    s('path', { d: 'M14 112q66-10 132 0v24H14z' }, 'tan'),
    s('path', { d: 'M56 128 64 58', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 66q36-40 82-6z' }, 'red', { accent: true })
  ],
  belleza: [
    s('path', { d: 'M80 132V84', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M80 112q-20-2-24-16 18 0 24 16z' }, 'green'),
    s('circle', { cx: 80, cy: 62, r: 26 }, 'red', { accent: true }),
    s('path', { d: 'M72 60a8 8 0 1 1 8 8M62 50q18-12 34 2M66 80q16 6 30-6', ...SW(3) }, 'pink', { stroke: true }),
    s('path', { d: 'M124 22l4 10 10 4-10 4-4 10-4-10-10-4 10-4zM34 34l3 7 7 3-7 3-3 7-3-7-7-3 7-3z' }, 'yellow')
  ],
  blog: [
    s('rect', { x: 16, y: 24, width: 118, height: 100, rx: 6 }, 'white'),
    outline({ x: 16, y: 24, width: 118, height: 100, rx: 6 }),
    s('path', { d: 'M16 30q0-6 6-6h106q6 0 6 6v10H16z' }, 'blue'),
    s('rect', { x: 26, y: 50, width: 98, height: 24, rx: 3 }, 'sky'),
    s('path', { d: 'M26 86h98M26 98h98M26 110h60', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 140l5-17 24-24 12 12-24 24z' }, 'yellow', { accent: true }),
    s('path', { d: 'M104 140l5-17 12 12z' }, 'tan')
  ],
  'declaración': [
    ...person(80, 108, 'navy', { h: 40, w: 34, r: 14 }),
    s('path', { d: 'M66 96 72 80M94 96 88 80', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: dots([[72, 78], [88, 78]], 5) }, 'dark'),
    s('path', { d: 'M46 96h68l-8 40H54z' }, 'brown', { accent: true }),
    s('circle', { cx: 80, cy: 114, r: 8 }, 'yellow')
  ],
  empleado: [
    ...person(80, 136, 'sky', { h: 58, w: 40, r: 16 }),
    s('path', { d: 'M76 80h8l4 26-8 8-8-8z' }, 'red'),
    s('rect', { x: 88, y: 92, width: 20, height: 24, rx: 3 }, 'white', { accent: true }),
    s('circle', { cx: 98, cy: 101, r: 4 }, 'skin'),
    s('path', { d: 'M92 110h12', ...SW(2) }, 'gray', { stroke: true })
  ],
  estadounidense: [
    s('rect', { x: 14, y: 34, width: 132, height: 91 }, 'white'),
    s('path', { d: rects([0, 2, 4, 6, 8, 10, 12].map(k => [14, 34 + 7 * k, 132, 7])) }, 'red'),
    s('rect', { x: 14, y: 34, width: 60, height: 49 }, 'navy', { accent: true }),
    s('path', { d: dots([22, 33, 44, 55, 66].flatMap(x => [42, 53, 64, 75].map(y => [x, y])), 2.5) }, 'white'),
    outline({ x: 14, y: 34, width: 132, height: 91 }, 'gray', 2)
  ],
  estatal: [
    s('rect', { x: 22, y: 92, width: 116, height: 40 }, 'tan'),
    s('path', { d: 'M36 100v28M52 100v28M68 100v28M92 100v28M108 100v28M124 100v28', ...SW(5) }, 'cream', { stroke: true }),
    s('path', { d: 'M46 92a34 32 0 0 1 68 0z' }, 'gray'),
    s('rect', { x: 74, y: 50, width: 12, height: 12 }, 'gray'),
    s('path', { d: 'M80 52V20', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 20h20v12H80z' }, 'blue', { accent: true }),
    s('rect', { x: 14, y: 128, width: 132, height: 8, rx: 2 }, 'gray')
  ],
  jajaja: [
    s('circle', { cx: 80, cy: 80, r: 58 }, 'yellow'),
    s('path', { d: 'M44 64l12-10 12 10M92 64l12-10 12 10', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M44 88h72q0 40-36 40t-36-40z' }, 'dark', { accent: true }),
    s('path', { d: 'M62 118q18-12 36 0q-18 10-36 0z' }, 'red'),
    s('path', { d: 'M28 74q-8 14 2 18 8-4-2-18zM132 74q8 14-2 18-8-4 2-18z' }, 'sky')
  ],
  jorge: [
    s('path', { d: 'M56 78 30 64M52 98H24M56 118l-22 14M104 78l26-14M108 98h28M104 118l22 14M74 44 64 26M86 44l10-18', ...SW(4) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 80, cy: 98, rx: 30, ry: 38 }, 'brown', { accent: true }),
    s('circle', { cx: 80, cy: 56, r: 14 }, 'dark'),
    s('path', { d: 'M80 66v68', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M64 84q4-10 10-12', ...SW(3) }, 'tan', { stroke: true })
  ],
  'mínimo': [
    s('rect', { x: 52, y: 18, width: 48, height: 124, rx: 8, ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: rects([[60, 94, 32, 18], [60, 72, 32, 18], [60, 50, 32, 18], [60, 28, 32, 18]]), ...SW(2, { 'stroke-dasharray': '4 4' }) }, 'gray', { stroke: true }),
    s('rect', { x: 60, y: 116, width: 32, height: 18 }, 'red', { accent: true }),
    s('path', { d: 'M122 32v96M110 116l12 12 12-12', ...SW(5) }, 'red', { stroke: true })
  ],
  pantalla: [
    s('rect', { x: 16, y: 26, width: 128, height: 84, rx: 6 }, 'dark'),
    s('rect', { x: 24, y: 34, width: 112, height: 68, rx: 2 }, 'sky', { accent: true }),
    s('path', { d: 'M36 46l30 30M50 40l40 40', ...SW(6) }, 'white', { stroke: true }),
    s('rect', { x: 72, y: 110, width: 16, height: 18 }, 'gray'),
    s('rect', { x: 46, y: 126, width: 68, height: 10, rx: 4 }, 'gray')
  ],
  perfil: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 12 }, 'mint'),
    s('path', { d: 'M54 146v-26q-16-10-16-36 0-44 44-48 34 0 42 32l8 22-10 4v12q0 10-12 10h-10v30z' }, 'navy', { accent: true }),
    s('circle', { cx: 104, cy: 66, r: 4 }, 'white')
  ],
  periodo: [
    s('path', { d: 'M18 100h124', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: dots([[26, 100], [134, 100]], 5) }, 'gray'),
    s('path', { d: 'M50 100h48', ...SW(10) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M50 80v-12h48v12', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: dots([[50, 100], [98, 100]], 8) }, 'red'),
    s('circle', { cx: 74, cy: 40, r: 16 }, 'cream'),
    outline({ cx: 74, cy: 40, r: 16 }, 'navy', 3),
    s('path', { d: 'M74 40V30M74 40l7 4', ...SW(3) }, 'dark', { stroke: true })
  ],
  tarea: [
    s('rect', { x: 26, y: 24, width: 88, height: 114, rx: 4 }, 'white'),
    outline({ x: 26, y: 24, width: 88, height: 114, rx: 4 }, 'blue'),
    s('path', { d: dots([[26, 40], [26, 60], [26, 80], [26, 100], [26, 120]], 4) }, 'dark'),
    s('path', { d: 'M40 46h44M40 62h56M40 78h48M40 94h30', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 126l5-16 30-30 11 11-30 30z' }, 'yellow', { accent: true }),
    s('path', { d: 'M96 126l5-16 11 11z' }, 'tan')
  ],
  aspecto: [
    s('ellipse', { cx: 108, cy: 80, rx: 32, ry: 56 }, 'brown'),
    s('ellipse', { cx: 108, cy: 80, rx: 25, ry: 49 }, 'sky'),
    ...person(108, 124, 'purple', { h: 30, w: 20, r: 9 }),
    ...person(44, 136, 'purple', { accent: true }),
    s('path', { d: 'M92 46q4-10 10-12', ...SW(3) }, 'white', { stroke: true })
  ],
  caer: [
    s('path', { d: 'M14 30q40 4 70-6', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M58 28q8-14 22-8-8 14-22 8z' }, 'green'),
    s('path', { d: 'M80 58v12M92 52v14M104 58v12', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 92, cy: 104, r: 20 }, 'red', { accent: true }),
    s('path', { d: 'M92 84v-8', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 136h80', ...SW(4) }, 'gray', { stroke: true })
  ],
  'crédito': [
    s('rect', { x: 18, y: 40, width: 124, height: 80, rx: 10 }, 'blue', { accent: true }),
    s('rect', { x: 32, y: 60, width: 24, height: 18, rx: 3 }, 'yellow'),
    s('path', { d: 'M32 96h76', ...SW(5, { 'stroke-dasharray': '14 6', 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('circle', { cx: 112, cy: 104, r: 9 }, 'red'),
    s('circle', { cx: 124, cy: 104, r: 9 }, 'orange')
  ],
  depender: [
    s('path', { d: 'M44 44h-8M116 44h8M54 18l-6-6M106 18l6-6', ...SW(4) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 44, r: 22 }, 'yellow', { accent: true }),
    s('rect', { x: 70, y: 62, width: 20, height: 14, rx: 2 }, 'gray'),
    s('path', { d: 'M80 76q0 40 38 44', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 98, y: 104, width: 42, height: 34, rx: 6 }, 'tan'),
    s('rect', { x: 108, y: 110, width: 20, height: 20, rx: 4 }, 'dark')
  ],
  'distribución': [
    s('rect', { x: 62, y: 20, width: 36, height: 30, rx: 4 }, 'orange', { accent: true }),
    s('path', { d: 'M80 56v38M72 56 38 92M88 56l34 36M72 86l8 8 8-8M36 80l-2 14 14-2M124 80l2 14-14-2', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: rects([[20, 104, 30, 28], [65, 104, 30, 28], [110, 104, 30, 28]]) }, 'brown')
  ],
  gas: [
    s('rect', { x: 48, y: 36, width: 20, height: 18, rx: 3 }, 'gray'),
    s('path', { d: 'M44 32h28', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 30, y: 52, width: 56, height: 84, rx: 22 }, 'red', { accent: true }),
    s('path', { d: 'M30 96h56', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M118 136q-22-12-14-36 6 8 10 2-2-20 14-34 0 18 12 30 8 20-8 38z' }, 'blue'),
    s('path', { d: 'M118 132q-8-8-2-20 6 8 10 0 4 12-8 20z' }, 'sky')
  ],
  grave: [
    s('path', { d: 'M80 22 142 130H18z' }, 'yellow'),
    s('path', { d: 'M80 22 142 130H18z', ...SW(8) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M80 60v36', ...SW(10) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 114, r: 6 }, 'dark')
  ],
  identidad: [
    s('rect', { x: 16, y: 34, width: 128, height: 92, rx: 8 }, 'cream'),
    outline({ x: 16, y: 34, width: 128, height: 92, rx: 8 }, 'tan'),
    s('path', { d: 'M16 42q0-8 8-8h112q8 0 8 8v8H16z' }, 'navy'),
    s('rect', { x: 28, y: 62, width: 40, height: 50, rx: 4 }, 'sky', { accent: true }),
    s('path', { d: busts([48], 112, 30, 18) }, 'blue'),
    s('circle', { cx: 48, cy: 80, r: 10 }, 'skin'),
    s('path', { d: 'M80 70h50M80 86h50M80 102h34', ...SW(5) }, 'gray', { stroke: true })
  ],
  inteligencia: [
    s('path', { d: 'M84 112q4 14 14 18', ...SW(10) }, 'pink', { stroke: true }),
    s('path', { d: 'M40 92q-18-4-14-24 0-18 18-22 4-18 24-16 10-12 24-2 20-6 26 12 18 6 12 26 4 20-16 24-6 18-24 12-12 10-26 2-18 4-24-12z' }, 'pink', { accent: true }),
    s('path', { d: 'M80 38v72M56 52q10 6 4 18M104 50q-10 8-2 18M48 84q12-4 18 6M112 84q-12-4-18 6', ...SW(4) }, 'purple', { stroke: true }),
    s('path', { d: 'M136 20l3 8 8 3-8 3-3 8-3-8-8-3 8-3zM22 22l3 6 6 3-6 3-3 6-3-6-6-3 6-3z' }, 'yellow')
  ],
  'inversión': [
    s('path', { d: rects([[44, 122, 72, 12], [50, 108, 60, 12]]) }, 'yellow'),
    s('path', { d: 'M44 128h72M50 114h60', ...SW(2) }, 'orange', { stroke: true }),
    s('path', { d: 'M80 106V58', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: 'M80 90q-26 0-30-22 26-2 30 22zM80 80q22-2 30-24-26-2-30 24z' }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 42, r: 15 }, 'yellow'),
    s('circle', { cx: 80, cy: 42, r: 9, ...SW(3) }, 'orange', { stroke: true })
  ],
  mirada: [
    s('path', { d: 'M14 84q66-62 132 0q-66 62-132 0z' }, 'white'),
    s('path', { d: 'M14 84q66-62 132 0q-66 62-132 0z', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 84, r: 24 }, 'brown', { accent: true }),
    s('circle', { cx: 80, cy: 84, r: 11 }, 'dark'),
    s('circle', { cx: 86, cy: 78, r: 4 }, 'white'),
    s('path', { d: 'M42 52l-6-10M80 38V24M118 52l6-10', ...SW(4) }, 'dark', { stroke: true })
  ],
  promedio: [
    s('path', { d: 'M18 136h124', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: rects([[26, 60, 20, 76], [54, 96, 20, 40], [82, 72, 20, 64], [110, 104, 20, 32]]) }, 'blue'),
    s('path', { d: 'M16 86h128', ...SW(4, { 'stroke-dasharray': '8 6' }) }, 'orange', { stroke: true, accent: true })
  ],
  'pérdida': [
    s('path', { d: 'M24 24v112h116', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M32 40l26 30 20-14 26 38 24 20M114 122l14-4-2-14', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 52, cy: 110, r: 10 }, 'yellow'),
    s('path', { d: 'M52 82v12M44 86l3 8M60 86l-3 8', ...SW(3) }, 'gray', { stroke: true })
  ],
  resistencia: [
    s('path', { d: 'M14 52q18 4 22 18M14 82h24M14 112q18-4 22-18', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M28 64l8 6-2 10M30 76l8 6-8 6M28 100l8-6-2-10', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M90 20l46 14v36q0 40-46 66q-46-26-46-66V34z' }, 'blue', { accent: true }),
    s('path', { d: 'M90 40v76M66 68h48', ...SW(6) }, 'yellow', { stroke: true })
  ],
  terreno: [
    s('path', { d: 'M20 72h120l6 64H14z' }, 'green', { accent: true }),
    s('path', { d: 'M30 96h100M24 118h112', ...SW(3) }, 'mint', { stroke: true }),
    s('path', { d: 'M24 48v26M48 48v26M72 48v26M96 48v26M120 48v26M140 48v26M20 56h124M20 66h124', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M100 128v-26M100 102l14 6-14 6z', ...SW(3) }, 'red', { stroke: true })
  ],
  valencia: [
    s('path', { d: 'M80 80 34 40M80 80l46-40M80 80 34 120M80 80l46 40', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 22 }, 'red', { accent: true }),
    s('path', { d: dots([[34, 40], [126, 40], [34, 120], [126, 120]], 14) }, 'sky'),
    s('path', { d: dots([[74, 74], [28, 34], [120, 34], [28, 114], [120, 114]], 4) }, 'white')
  ],
  voluntad: [
    s('path', { d: burst(80, 74, 60, 42, 14) }, 'orange', { accent: true }),
    s('rect', { x: 64, y: 92, width: 30, height: 44 }, 'skin'),
    s('rect', { x: 60, y: 118, width: 38, height: 22, rx: 3 }, 'red'),
    s('rect', { x: 56, y: 46, width: 46, height: 50, rx: 12 }, 'skin'),
    s('path', { d: 'M58 60h30M58 72h30M58 84h30', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M90 54q14 4 10 24', ...SW(8) }, 'skin', { stroke: true })
  ],
  votar: [
    s('rect', { x: 30, y: 80, width: 100, height: 56, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: star(80, 108, 13) }, 'white'),
    s('rect', { x: 64, y: 38, width: 32, height: 44 }, 'white'),
    outline({ x: 64, y: 38, width: 32, height: 44 }),
    s('path', { d: 'M70 60l6 6 12-14', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M54 80h52', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 66, y: 22, width: 28, height: 20, rx: 9 }, 'skin')
  ],
  reina: [
    s('path', { d: 'M108 136 120 76', ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 121, cy: 70, r: 7 }, 'yellow'),
    s('path', { d: 'M70 76q-4-20 10-20t10 20', ...SW(5) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 74, r: 12 }, 'skin'),
    s('path', { d: 'M72 86h16l22 50H50z' }, 'purple', { accent: true }),
    s('path', { d: 'M66 62l2-20 6 8 6-12 6 12 6-8 2 20z' }, 'yellow'),
    s('path', { d: dots([[80, 54], [70, 56], [90, 56]], 2.5) }, 'red')
  ],
  representar: [
    s('path', { d: 'M20 30h56v34q0 32-28 32t-28-32z' }, 'yellow'),
    s('path', { d: 'M84 58h56v34q0 32-28 32t-28-32z' }, 'purple', { accent: true }),
    s('path', { d: 'M32 50q5-5 10 0M54 50q5-5 10 0M34 70q14 14 28 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 80q5 5 10 0M118 80q5 5 10 0M98 108q14-12 28 0', ...SW(4) }, 'white', { stroke: true })
  ],
  salvo: [
    backdrop('sky'),
    s('circle', { cx: 80, cy: 76, r: 36, ...SW(22) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 76, r: 36, ...SW(22, { 'stroke-linecap': 'butt', 'stroke-dasharray': '28.27 28.27' }) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M14 132q11-6 22 0t22 0t22 0t22 0t22 0t22 0', ...SW(3) }, 'white', { stroke: true })
  ],
  velocidad: [
    s('circle', { cx: 80, cy: 88, r: 60 }, 'navy'),
    s('path', { d: 'M37.3 110a48 48 0 1 1 85.4 0', ...SW(6, { 'stroke-dasharray': '3 11', 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('path', { d: 'M121.6 64a48 48 0 0 1 1.1 46', ...SW(8, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true }),
    s('path', { d: 'M80 88 116 58', ...SW(5) }, 'orange', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 88, r: 7 }, 'white')
  ],
  'visión': [
    s('circle', { cx: 48, cy: 84, r: 26 }, 'sky'),
    s('circle', { cx: 112, cy: 84, r: 26 }, 'sky'),
    s('path', { d: 'M36 78q4-8 12-8M100 78q4-8 12-8', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M74 80q6-8 12 0M22 78 14 66M138 78l8-12', ...SW(5) }, 'navy', { stroke: true }),
    s('circle', { cx: 48, cy: 84, r: 26, ...SW(6) }, 'navy', { stroke: true, accent: true }),
    s('circle', { cx: 112, cy: 84, r: 26, ...SW(6) }, 'navy', { stroke: true })
  ],
  recuerdo: [
    s('circle', { cx: 80, cy: 66, r: 48 }, 'sky'),
    s('path', { d: 'M38 90q42-14 84 0v14H38z' }, 'white'),
    s('rect', { x: 68, y: 70, width: 24, height: 22 }, 'cream'),
    s('path', { d: 'M62 72 80 56l18 16z' }, 'red'),
    s('path', { d: dots([[56, 40], [100, 34], [112, 60], [48, 64], [80, 30]], 3) }, 'white'),
    s('path', { d: 'M44 106h72l8 30H36z' }, 'brown', { accent: true })
  ],
  aceptar: [
    ...person(46, 136, 'blue'),
    s('path', { d: 'M58 104h32', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 84, y: 76, width: 38, height: 32, rx: 3 }, 'orange'),
    s('path', { d: 'M103 76v32', ...SW(5) }, 'yellow', { stroke: true }),
    s('circle', { cx: 122, cy: 40, r: 18 }, 'green', { accent: true }),
    s('path', { d: 'M113 40l6 6 12-12', ...SW(5) }, 'white', { stroke: true })
  ],
  asesinato: [
    backdrop('navy'),
    s('path', { d: 'M118 24a14 14 0 1 0 12 22a12 12 0 1 1-12-22z' }, 'yellow'),
    s('path', { d: 'M40 120h80', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 46, cy: 98, r: 10, ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M58 94l34-6 30-14M92 88l18 22M64 104l26-4 14 18', ...SW(4) }, 'white', { stroke: true, accent: true }),
    s('path', { d: dots([[100, 128], [110, 132]], 3) }, 'red')
  ],
  'comité': [
    s('path', { d: busts([36, 80, 124], 104, 30, 36) }, 'gray'),
    s('path', { d: busts([80], 104, 30, 36) }, 'purple', { accent: true }),
    s('path', { d: dots([[36, 56], [80, 56], [124, 56]], 12) }, 'skin'),
    s('path', { d: 'M100 86V40', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 14, y: 96, width: 132, height: 40, rx: 3 }, 'brown'),
    s('path', { d: rects([[24, 104, 24, 10], [68, 104, 24, 10], [112, 104, 24, 10]]) }, 'cream')
  ],
  conflicto: [
    s('path', { d: burst(80, 80, 30, 14, 10) }, 'yellow', { accent: true }),
    s('path', { d: 'M14 64h38V48l26 32-26 32V96H14z' }, 'red'),
    s('path', { d: 'M146 64h-38V48L82 80l26 32V96h38z' }, 'blue'),
    s('path', { d: 'M74 34l4 10M92 30l-4 12M76 126l4-10M94 128l-6-10', ...SW(4) }, 'orange', { stroke: true })
  ],
  consecuencia: [
    ground(),
    s('rect', { x: 30, y: 80, width: 14, height: 56, rx: 2, transform: 'rotate(50 44 136)' }, 'dark'),
    s('rect', { x: 58, y: 80, width: 14, height: 56, rx: 2, transform: 'rotate(32 72 136)' }, 'dark'),
    s('rect', { x: 86, y: 80, width: 14, height: 56, rx: 2, transform: 'rotate(14 100 136)' }, 'dark'),
    s('rect', { x: 114, y: 80, width: 14, height: 56, rx: 2 }, 'red', { accent: true }),
    s('path', { d: 'M30 44q40-24 84 0M106 36l8 8-10 4', ...SW(4) }, 'orange', { stroke: true })
  ],
  'físico': [
    ...person(80, 136, 'red', { h: 48, w: 34, r: 14, accent: true }),
    s('path', { d: 'M64 96 44 72 48 40M96 96l20-24-4-32', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M30 38h100', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: rects([[20, 24, 12, 28], [128, 24, 12, 28]]) }, 'dark')
  ],
};
