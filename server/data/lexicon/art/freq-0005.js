// Illustration specs for common words, batch 0005 (plus leftovers of 0004 and 0019) (see server/scripts/lexicon/art.js)
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

module.exports = {
  'función': [
    s('path', { d: 'M38 82 26 24q30 8 28 54z' }, 'gray'),
    s('path', { d: 'M120 80 138 40M96 102l14 32', ...SW(7) }, 'gray', { stroke: true }),
    s('rect', { x: 26, y: 70, width: 108, height: 36, rx: 18 }, 'red', { accent: true }),
    s('path', { d: 'M76 78h8v6h6v8h-6v6h-8v-6h-6v-8h6z' }, 'white'),
    s('path', { d: dots([[44, 88], [116, 88]], 3) }, 'dark')
  ],
  independencia: [
    s('rect', { x: 16, y: 128, width: 72, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M22 128V78a30 30 0 0 1 60 0v50M37 128V53M52 128V48M67 128V53M52 48v-8', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M82 92l24 12v26l-24-8', ...SW(4) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 114, cy: 54, rx: 18, ry: 12 }, 'yellow', { accent: true }),
    s('circle', { cx: 130, cy: 42, r: 9 }, 'yellow'),
    s('path', { d: 'M138 40l9 3-9 4z' }, 'orange'),
    s('circle', { cx: 132, cy: 40, r: 2 }, 'dark'),
    s('path', { d: 'M106 52q4-24 22-22q-4 16-22 22z' }, 'orange')
  ],
  plazo: [
    s('rect', { x: 16, y: 30, width: 92, height: 100, rx: 6 }, 'white'),
    s('rect', { x: 16, y: 30, width: 92, height: 100, rx: 6, ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 16, y: 30, width: 92, height: 22, rx: 6 }, 'red'),
    s('path', { d: 'M38 22v14M86 22v14', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: rects([26, 46, 66, 86].flatMap(x => [62, 80, 98, 116].map(y => [x, y, 12, 10]))) }, 'gray'),
    s('circle', { cx: 72, cy: 103, r: 12, ...SW(4) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M114 66h32M114 136h32', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M118 68h24l-12 33 12 33h-24l12-33z' }, 'sky'),
    s('path', { d: 'M122 133h16l-8-12z' }, 'yellow')
  ],
  'término': [
    ground(),
    s('path', { d: 'M36 136V22', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 38, y: 24, width: 96, height: 60 }, 'white'),
    s('rect', { x: 38, y: 24, width: 96, height: 60, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: rects([[38, 24, 24, 20], [86, 24, 24, 20], [62, 44, 24, 20], [110, 44, 24, 20], [38, 64, 24, 20], [86, 64, 24, 20]]) }, 'dark', { accent: true }),
    s('circle', { cx: 36, cy: 18, r: 5 }, 'yellow')
  ],
  'corrupción': [
    s('rect', { x: 14, y: 46, width: 132, height: 14, rx: 3 }, 'brown'),
    s('path', { d: rects([[22, 60, 10, 78], [128, 60, 10, 78]]) }, 'brown'),
    s('path', { d: 'M14 104h38M146 104h-38', ...SW(14) }, 'navy', { stroke: true }),
    s('rect', { x: 60, y: 91, width: 40, height: 26, rx: 3 }, 'green', { accent: true }),
    s('circle', { cx: 80, cy: 104, r: 7 }, 'mint'),
    s('path', { d: dots([[58, 104], [102, 104]], 9) }, 'skin'),
  ],
  cruz: [
    s('circle', { cx: 80, cy: 74, r: 58 }, 'sky'),
    s('path', { d: 'M14 140q66-40 132 0z' }, 'green'),
    s('path', { d: rects([[72, 22, 16, 104], [46, 46, 68, 16]]) }, 'brown', { accent: true })
  ],
  esperanza: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 14 }, 'navy'),
    s('path', { d: star(108, 46, 18) }, 'yellow', { accent: true }),
    s('path', { d: dots([[40, 36], [64, 26], [132, 84], [30, 66]], 2.5) }, 'white'),
    s('path', { d: 'M14 116q66-34 132 0v18q0 12-12 12H26q-12 0-12-12z' }, 'green'),
    ...person(56, 102, 'orange', { h: 28, w: 18, r: 9 }),
    s('path', { d: 'M62 80l14-16', ...SW(5) }, 'skin', { stroke: true })
  ],
  fiscal: [
    ...person(54, 136, 'navy', { h: 50, w: 34, r: 14 }),
    s('path', { d: 'M51 88h6l2 22-5 6-5-6z' }, 'red', { accent: true }),
    s('path', { d: 'M68 98 104 80', ...SW(8) }, 'navy', { stroke: true }),
    s('path', { d: 'M104 80l14-6', ...SW(6) }, 'skin', { stroke: true }),
    s('rect', { x: 110, y: 92, width: 34, height: 44, rx: 2 }, 'white'),
    s('rect', { x: 110, y: 92, width: 34, height: 44, rx: 2, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M118 104h18M118 114h18', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 138, cy: 128, r: 10 }, 'yellow')
  ],
  incluir: [
    s('circle', { cx: 68, cy: 88, r: 52 }, 'mint'),
    s('circle', { cx: 68, cy: 88, r: 52, ...SW(4) }, 'green', { stroke: true }),
    s('circle', { cx: 52, cy: 76, r: 12 }, 'red'),
    s('rect', { x: 62, y: 96, width: 22, height: 22, rx: 3 }, 'blue'),
    s('path', { d: 'M36 112l10-18 10 18z' }, 'purple'),
    s('circle', { cx: 132, cy: 34, r: 12 }, 'yellow', { accent: true }),
    s('path', { d: 'M120 48 96 72M96 58v14h14', ...SW(6) }, 'orange', { stroke: true })
  ],
  'líder': [
    s('path', { d: busts([96, 116, 136], 136, 18, 24) }, 'gray'),
    s('path', { d: dots([[96, 102], [116, 102], [136, 102]], 8) }, 'skin'),
    s('path', { d: 'M70 136V26', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M70 28h38l-8 11 8 11H70z' }, 'yellow'),
    ...person(46, 136, 'red', { accent: true }),
    s('path', { d: 'M58 100h12', ...SW(6) }, 'skin', { stroke: true })
  ],
  rato: [
    s('path', { d: 'M28 82h56v28a22 22 0 0 1-22 22h-12a22 22 0 0 1-22-22z' }, 'blue'),
    s('path', { d: 'M84 92h6a10 10 0 0 1 0 20h-6', ...SW(5) }, 'blue', { stroke: true }),
    s('rect', { x: 20, y: 132, width: 76, height: 8, rx: 4 }, 'gray'),
    s('path', { d: 'M44 72q-6-8 0-16t0-16M64 72q-6-8 0-16t0-16', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 118, cy: 52, r: 26 }, 'white'),
    s('circle', { cx: 118, cy: 52, r: 26, ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M118 52V30A22 22 0 0 1 133.6 36.4z' }, 'orange', { accent: true }),
    s('path', { d: 'M118 52V34M118 52l12 6', ...SW(3) }, 'dark', { stroke: true })
  ],
  tribunal: [
    s('path', { d: busts([80], 84, 44, 32) }, 'dark'),
    s('circle', { cx: 80, cy: 44, r: 14 }, 'skin'),
    s('path', { d: 'M74 58h12l-6 10z' }, 'white'),
    s('rect', { x: 18, y: 78, width: 124, height: 58, rx: 4 }, 'brown', { accent: true }),
    s('rect', { x: 12, y: 72, width: 136, height: 10, rx: 3 }, 'tan'),
    s('circle', { cx: 80, cy: 108, r: 18 }, 'yellow'),
    s('path', { d: 'M80 96v20M68 100h24M68 100l-5 10h10zM92 100l-5 10h10zM74 118h12', ...SW(2.5) }, 'dark', { stroke: true }),
    s('rect', { x: 112, y: 60, width: 24, height: 10, rx: 3 }, 'dark')
  ],
  amo: [
    ...person(42, 136, 'blue', { accent: true }),
    s('ellipse', { cx: 106, cy: 110, rx: 24, ry: 12 }, 'brown'),
    s('path', { d: 'M92 118v18M120 118v18M82 106q-10-4-8-16', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 128, cy: 92, r: 12 }, 'brown'),
    s('circle', { cx: 138, cy: 96, r: 7 }, 'tan'),
    s('path', { d: 'M122 82q-8 2-8 14 8-2 10-8z' }, 'dark'),
    s('circle', { cx: 130, cy: 88, r: 2 }, 'dark'),
    s('path', { d: heart(84, 52, 10) }, 'pink')
  ],
  ciento: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'cream'),
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10, ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: Array.from({ length: 10 }, (_, i) => `M26 ${26 + 12 * i}h108`).join(''), ...SW(9, { 'stroke-dasharray': '0 12' }) }, 'blue', { stroke: true, accent: true })
  ],
  comercial: [
    ground(),
    s('rect', { x: 26, y: 60, width: 108, height: 76 }, 'cream'),
    s('rect', { x: 26, y: 60, width: 108, height: 76, ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M20 42h120v20q-7.5 8-15 0t-15 0t-15 0t-15 0t-15 0t-15 0t-15 0t-15 0z' }, 'red', { accent: true }),
    s('path', { d: rects([[35, 42, 15, 20], [65, 42, 15, 20], [95, 42, 15, 20], [125, 42, 15, 20]]) }, 'white'),
    s('rect', { x: 36, y: 80, width: 46, height: 34, rx: 2 }, 'sky'),
    s('rect', { x: 94, y: 90, width: 28, height: 46, rx: 2 }, 'brown'),
    s('path', { d: 'M98 14h28l12 12-12 12H98z' }, 'yellow'),
    s('circle', { cx: 105, cy: 26, r: 3 }, 'white')
  ],
  copa: [
    ...glass(54, 10, true),
    ...glass(106, -10),
    s('path', { d: 'M80 12v12M64 18l5 8M96 18l-5 8', ...SW(4) }, 'yellow', { stroke: true })
  ],
  cuyo: [
    ...person(32, 136, 'green', { h: 40, w: 26, r: 11 }),
    s('path', { d: 'M88 102l8-18h32l8 18z' }, 'red'),
    s('path', { d: 'M100 100l4-12h20l4 12z' }, 'sky'),
    s('rect', { x: 74, y: 100, width: 72, height: 24, rx: 8 }, 'red', { accent: true }),
    s('path', { d: dots([[94, 124], [126, 124]], 9) }, 'dark'),
    s('path', { d: 'M40 62q34-40 70 12', ...SW(4, { 'stroke-dasharray': '7 7' }) }, 'orange', { stroke: true }),
    s('path', { d: 'M100 70l10 6 2-12', ...SW(4) }, 'orange', { stroke: true })
  ],
  exterior: [
    s('circle', { cx: 80, cy: 80, r: 64 }, 'mint'),
    s('rect', { x: 56, y: 56, width: 48, height: 48, rx: 6 }, 'blue'),
    s('rect', { x: 68, y: 68, width: 24, height: 24, rx: 3 }, 'sky'),
    s('path', { d: 'M80 48V20M70 30l10-10 10 10M80 112v28M70 130l10 10 10-10M48 80H20M30 70 20 80l10 10M112 80h28M130 70l10 10-10 10', ...SW(6) }, 'orange', { stroke: true, accent: true })
  ],
  habitante: [
    ground(),
    s('path', { d: rects([[18, 82, 40, 54], [100, 76, 40, 60]]) }, 'cream'),
    s('path', { d: rects([[18, 82, 40, 54], [100, 76, 40, 60]]), ...SW(2) }, 'tan', { stroke: true }),
    s('path', { d: 'M12 84l26-24 26 24zM94 78l26-26 26 26z' }, 'red'),
    s('path', { d: rects([[32, 110, 12, 26], [114, 108, 12, 28]]) }, 'brown'),
    ...person(80, 136, 'orange', { accent: true, h: 36, w: 24, r: 10 }),
    s('path', { d: 'M90 104l10-14', ...SW(5) }, 'skin', { stroke: true })
  ],
  honor: [
    s('path', { d: 'M48 14h22l18 56H66z' }, 'red'),
    s('path', { d: 'M112 14H90L72 70h22z' }, 'blue'),
    s('circle', { cx: 80, cy: 102, r: 34 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 102, r: 25, ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: star(80, 102, 15) }, 'orange')
  ],
  'institución': [
    s('path', { d: 'M80 30V12', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 12h20v11H80z' }, 'red', { accent: true }),
    s('path', { d: 'M52 50a28 22 0 0 1 56 0z' }, 'gray'),
    s('rect', { x: 26, y: 48, width: 108, height: 78 }, 'cream'),
    s('rect', { x: 26, y: 48, width: 108, height: 78, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: rects([[36, 58, 12, 14], [56, 58, 12, 14], [92, 58, 12, 14], [112, 58, 12, 14], [36, 82, 12, 14], [56, 82, 12, 14], [92, 82, 12, 14], [112, 82, 12, 14], [36, 104, 12, 14], [112, 104, 12, 14]]) }, 'sky'),
    s('rect', { x: 70, y: 96, width: 20, height: 30 }, 'brown'),
    s('path', { d: rects([[18, 126, 124, 6], [12, 132, 136, 6]]) }, 'gray')
  ],
  mejorar: [
    s('circle', { cx: 36, cy: 98, r: 20 }, 'gray'),
    s('circle', { cx: 112, cy: 72, r: 32 }, 'yellow', { accent: true }),
    s('path', { d: dots([[29, 94], [43, 94], [101, 64], [123, 64]], 3.5) }, 'dark'),
    s('path', { d: 'M28 108q8-6 16 0M96 80q16 16 32 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M58 94 78 74M66 72h12v12', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M138 28l4 8M146 46h-8M118 26l-2 8', ...SW(3) }, 'orange', { stroke: true })
  ],
  contrato: [
    s('rect', { x: 30, y: 14, width: 92, height: 124, rx: 4 }, 'cream'),
    s('rect', { x: 30, y: 14, width: 92, height: 124, rx: 4, ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M44 34h64M44 48h64M44 62h64M44 76h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M42 108q6-12 10 0t10-4M42 124q6-12 10 0t10-4', ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M108 124l-8 22 10-6 6 8 4-20z' }, 'red'),
    s('circle', { cx: 116, cy: 116, r: 16 }, 'red', { accent: true }),
    s('path', { d: star(116, 116, 8) }, 'yellow')
  ],
  debate: [
    s('path', { d: rects([[16, 100, 44, 36], [100, 100, 44, 36]]) }, 'brown'),
    s('path', { d: busts([38], 100, 30, 24) }, 'blue', { accent: true }),
    s('path', { d: busts([122], 100, 30, 24) }, 'green'),
    s('path', { d: dots([[38, 64], [122, 64]], 12) }, 'skin'),
    s('path', { d: 'M24 14h36q6 0 6 6v14q0 6-6 6H46l-8 8v-8H24q-6 0-6-6V20q0-6 6-6z' }, 'orange'),
    s('path', { d: 'M136 14h-36q-6 0-6 6v14q0 6 6 6h14l8 8v-8h14q6 0 6-6V20q0-6-6-6z' }, 'purple'),
    s('path', { d: 'M84 50l-8 14h10l-6 16', ...SW(4) }, 'yellow', { stroke: true })
  ],
  'diseño': [
    s('rect', { x: 14, y: 22, width: 132, height: 110, rx: 8 }, 'cream'),
    s('rect', { x: 14, y: 22, width: 132, height: 110, rx: 8, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 108 50 40M130 96 110 40', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 108C50 40 110 40 130 96', ...SW(5) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: rects([[24, 102, 12, 12], [124, 90, 12, 12]]) }, 'blue'),
    s('path', { d: dots([[50, 40], [110, 40]], 5) }, 'orange'),
    s('path', { d: 'M80 58l-10-22h20z' }, 'dark'),
    s('rect', { x: 72, y: 22, width: 16, height: 14, rx: 2 }, 'navy')
  ],
  electoral: [
    ground(),
    s('path', { d: 'M34 34v102M126 34v102', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 34, y: 34, width: 92, height: 86 }, 'blue', { accent: true }),
    s('path', { d: 'M52 36v82M70 36v82M88 36v82M106 36v82', ...SW(3) }, 'navy', { stroke: true }),
    s('rect', { x: 28, y: 22, width: 104, height: 14, rx: 3 }, 'navy'),
    s('path', { d: rects([[62, 124, 14, 12], [84, 124, 14, 12]]) }, 'dark'),
    s('circle', { cx: 130, cy: 28, r: 15 }, 'green'),
    s('path', { d: 'M123 28l5 5 9-10', ...SW(4) }, 'white', { stroke: true })
  ],
  hogar: [
    s('rect', { x: 22, y: 42, width: 116, height: 94 }, 'red'),
    s('path', { d: 'M22 66h24M114 66h24M22 90h24M114 90h24M22 114h24M114 114h24M34 42v24M126 66v24M34 90v24M126 114v22', ...SW(3) }, 'cream', { stroke: true }),
    s('rect', { x: 14, y: 32, width: 132, height: 12, rx: 3 }, 'brown'),
    s('path', { d: 'M46 136V92a34 34 0 0 1 68 0v44z' }, 'dark'),
    s('path', { d: 'M80 132c-20 0-24-16-16-30 2 8 6 10 8 6-2-12 6-22 14-26-2 12 14 18 12 34 4-2 6-6 6-10 6 12 2 26-24 26z' }, 'orange', { accent: true }),
    s('path', { d: 'M80 132c-8 0-12-8-6-16 2 4 4 4 6 0 4 6 10 8 8 12-1 3-4 4-8 4z' }, 'yellow'),
    s('path', { d: 'M58 134h44', ...SW(6) }, 'brown', { stroke: true })
  ],
  mando: [
    s('path', { d: 'M80 56q0-20 20-28t30-12', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 56h80c18 0 26 22 26 48 0 18-12 26-22 18l-16-16H52l-16 16c-10 8-22 0-22-18 0-26 8-48 26-48z' }, 'navy', { accent: true }),
    s('path', { d: 'M42 72h8v8h8v8h-8v8h-8v-8h-8v-8h8z' }, 'white'),
    s('circle', { cx: 112, cy: 72, r: 6 }, 'red'),
    s('circle', { cx: 124, cy: 84, r: 6 }, 'blue'),
    s('circle', { cx: 100, cy: 84, r: 6 }, 'yellow'),
    s('circle', { cx: 112, cy: 96, r: 6 }, 'green')
  ],
  similar: [
    s('path', { d: star(44, 66, 30) }, 'yellow', { accent: true }),
    s('path', { d: star(116, 66, 28, 14), transform: 'rotate(12 116 66)' }, 'orange'),
    s('path', { d: 'M66 116q7-7 14 0t14 0M66 130q7-7 14 0t14 0', ...SW(5) }, 'dark', { stroke: true })
  ],
  cumplir: [
    s('rect', { x: 30, y: 22, width: 100, height: 120, rx: 8 }, 'brown'),
    s('rect', { x: 40, y: 34, width: 80, height: 100, rx: 3 }, 'white'),
    s('rect', { x: 62, y: 16, width: 36, height: 14, rx: 4 }, 'gray'),
    s('path', { d: 'M48 56l6 6 10-12M48 84l6 6 10-12M48 112l6 6 10-12', ...SW(5) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M74 58h36M74 86h36M74 114h36', ...SW(4) }, 'gray', { stroke: true })
  ],
  discurso: [
    ...person(80, 96, 'navy', { h: 36, w: 34, r: 14 }),
    s('path', { d: 'M98 86 106 70', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 108, cy: 66, r: 5 }, 'dark'),
    s('path', { d: 'M50 92h60l-8 46H58z' }, 'brown', { accent: true }),
    s('rect', { x: 46, y: 86, width: 68, height: 10, rx: 3 }, 'tan'),
    s('path', { d: 'M122 52q8 10 0 20M132 44q14 18 0 36M38 52q-8 10 0 20M28 44q-14 18 0 36', ...SW(4) }, 'orange', { stroke: true })
  ],
  entrevista: [
    s('path', { d: busts([38], 100, 32, 32) }, 'blue', { accent: true }),
    s('path', { d: busts([122], 100, 32, 32) }, 'green'),
    s('path', { d: dots([[38, 56], [122, 56]], 13) }, 'skin'),
    s('path', { d: 'M56 56h48', ...SW(3, { 'stroke-dasharray': '6 6' }) }, 'orange', { stroke: true }),
    s('rect', { x: 18, y: 100, width: 124, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M80 110v26', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M66 100V86', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 66, cy: 82, r: 5 }, 'dark'),
    s('rect', { x: 90, y: 90, width: 22, height: 10, rx: 1 }, 'white')
  ],
  'expresión': [
    s('circle', { cx: 66, cy: 88, r: 48 }, 'skin'),
    s('path', { d: 'M42 66q8-8 16 0M74 66q8-8 16 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[50, 78], [82, 78]], 5) }, 'dark'),
    s('path', { d: 'M46 100q20 30 40 0z' }, 'red', { accent: true }),
    s('path', { d: 'M110 18h28q8 0 8 8v16q0 8-8 8h-14l-10 10v-10h-4q-8 0-8-8V26q0-8 8-8z' }, 'yellow'),
    s('path', { d: heart(124, 28, 9) }, 'red')
  ],
  'extraño': [
    s('path', { d: 'M66 34 56 16M94 34l10-18', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: dots([[56, 16], [104, 16]], 5) }, 'yellow'),
    s('path', { d: 'M80 32c34 0 50 22 50 46 0 32-30 62-50 62s-50-30-50-62c0-24 16-46 50-46z' }, 'green', { accent: true }),
    s('ellipse', { cx: 62, cy: 84, rx: 15, ry: 9, transform: 'rotate(30 62 84)' }, 'black'),
    s('ellipse', { cx: 98, cy: 84, rx: 15, ry: 9, transform: 'rotate(-30 98 84)' }, 'black'),
    s('path', { d: dots([[58, 80], [94, 80]], 3) }, 'white'),
    s('path', { d: 'M72 118q8 4 16 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  funcionar: [
    ...gear(56, 70, 30, 10, 'blue', { accent: true }),
    s('circle', { cx: 56, cy: 70, r: 9 }, 'white'),
    ...gear(108, 110, 22, 8, 'orange'),
    s('circle', { cx: 108, cy: 110, r: 7 }, 'white'),
    s('path', { d: 'M20 40a44 44 0 0 1 26-20M144 92a40 40 0 0 1 0 36', ...SW(4) }, 'gray', { stroke: true })
  ],
  'increíble': [
    s('path', { d: burst(80, 80, 66, 52, 16) }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 84, r: 40 }, 'skin'),
    s('path', { d: dots([[66, 74], [94, 74]], 10) }, 'white'),
    s('path', { d: dots([[66, 74], [94, 74]], 4) }, 'dark'),
    s('ellipse', { cx: 80, cy: 106, rx: 9, ry: 11 }, 'dark'),
    s('path', { d: 'M56 56q10-6 18 0M86 56q10-6 18 0', ...SW(4) }, 'dark', { stroke: true })
  ],
  inicio: [
    s('rect', { x: 16, y: 24, width: 128, height: 112, rx: 8 }, 'white'),
    s('rect', { x: 16, y: 24, width: 128, height: 112, rx: 8, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M16 32q0-8 8-8h112q8 0 8 8v10H16z' }, 'gray'),
    s('path', { d: dots([[28, 33], [40, 33], [52, 33]], 4) }, 'red'),
    s('path', { d: 'M80 54l-34 30h68z' }, 'blue', { accent: true }),
    s('rect', { x: 56, y: 84, width: 48, height: 36 }, 'blue'),
    s('rect', { x: 74, y: 98, width: 12, height: 22 }, 'white')
  ],
  juez: [
    ...person(62, 136, 'dark', { accent: true, h: 52, w: 36, r: 14 }),
    s('path', { d: 'M56 86h12l-6 12z' }, 'white'),
    s('path', { d: 'M48 66q0-20 14-20t14 20q-4-8-14-8t-14 8z' }, 'gray'),
    s('path', { d: 'M78 96 102 72', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M102 74 116 48', ...SW(5) }, 'tan', { stroke: true }),
    s('rect', { x: 102, y: 36, width: 34, height: 14, rx: 3, transform: 'rotate(30 119 43)' }, 'brown', { accent: true }),
    s('path', { d: 'M136 22l6-6M140 36h8', ...SW(3) }, 'orange', { stroke: true })
  ],
  maestro: [
    ...person(58, 136, 'dark', { h: 50, w: 34, r: 14 }),
    s('path', { d: 'M52 88h12l-6 16z' }, 'white'),
    s('path', { d: 'M42 68q-2-22 16-22t16 22q-4-10-16-10t-16 10z' }, 'gray'),
    s('path', { d: 'M72 96 92 72', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M92 72 114 40', ...SW(3) }, 'brown', { stroke: true }),
    ...note(118, 104, 'purple')
  ],
  marco: [
    s('path', { d: 'M80 16 40 44M80 16l40 28', ...SW(2) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 16, r: 4 }, 'dark'),
    s('rect', { x: 30, y: 40, width: 100, height: 96, rx: 4 }, 'yellow', { accent: true }),
    s('rect', { x: 30, y: 40, width: 100, height: 96, rx: 4, ...SW(3) }, 'orange', { stroke: true }),
    s('rect', { x: 46, y: 56, width: 68, height: 64 }, 'mint'),
    s('rect', { x: 46, y: 56, width: 68, height: 64, ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: dots([[38, 48], [122, 48], [38, 128], [122, 128]], 4) }, 'orange')
  ],
  materia: [
    s('ellipse', { cx: 80, cy: 80, rx: 58, ry: 20, ...SW(4) }, 'blue', { stroke: true }),
    s('ellipse', { cx: 80, cy: 80, rx: 58, ry: 20, transform: 'rotate(60 80 80)', ...SW(4) }, 'blue', { stroke: true }),
    s('ellipse', { cx: 80, cy: 80, rx: 58, ry: 20, transform: 'rotate(120 80 80)', ...SW(4) }, 'blue', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 13 }, 'red', { accent: true }),
    s('path', { d: dots([[22, 80], [109, 130], [109, 30]], 6) }, 'orange')
  ],
  'oposición': [
    s('path', { d: 'M14 68h38V50l26 30-26 30V92H14z' }, 'blue'),
    s('path', { d: 'M146 68h-38V50l-26 30 26 30V92h38z' }, 'red', { accent: true }),
    s('path', { d: 'M80 38v14M66 42l6 10M94 42l-6 10M80 122v-14M66 118l6-10M94 118l-6-10', ...SW(4) }, 'orange', { stroke: true })
  ],
  registro: [
    s('path', { d: 'M16 46q32-8 64 6v86q-32-14-64-6zM144 46q-32-8-64 6v86q32-14 64-6z' }, 'cream'),
    s('path', { d: 'M16 46q32-8 64 6v86q-32-14-64-6zM144 46q-32-8-64 6v86q32-14 64-6z', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M26 66q24-4 44 4M26 82q24-4 44 4M26 98q24-4 44 4M26 114q24-4 44 4M108 72q14-4 28-4M108 90q14-4 28-4M108 108q14-4 28-4', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M90 72l4 4 8-8M90 90l4 4 8-8', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M140 18 116 96', ...SW(7) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M112 94l-2 12 8-8z' }, 'dark')
  ],
  asamblea: [
    s('rect', { x: 36, y: 62, width: 88, height: 10, rx: 3 }, 'brown'),
    ...person(80, 62, 'red', { accent: true, h: 22, w: 18, r: 9 }),
    s('path', { d: busts([34, 58, 82, 106, 130], 112, 20, 16) }, 'green'),
    s('path', { d: busts([24, 46, 68, 90, 112, 134], 140, 20, 16) }, 'blue'),
    s('path', { d: dots([[34, 90], [58, 90], [82, 90], [106, 90], [130, 90], [24, 118], [46, 118], [68, 118], [90, 118], [112, 118], [134, 118]], 8) }, 'brown')
  ],
  detalle: [
    s('path', { d: 'M96 96l38 38', ...SW(12) }, 'brown', { stroke: true }),
    s('circle', { cx: 66, cy: 66, r: 42 }, 'sky'),
    s('circle', { cx: 66, cy: 70, r: 18 }, 'red', { accent: true }),
    s('path', { d: 'M56 56a10 10 0 0 1 20 0z' }, 'dark'),
    s('path', { d: 'M66 54v34', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: dots([[58, 66], [74, 66], [58, 80], [74, 80]], 3.5) }, 'dark'),
    s('circle', { cx: 66, cy: 66, r: 42, ...SW(8) }, 'dark', { stroke: true })
  ],
  empleo: [
    s('path', { d: 'M40 14 72 68M120 14 88 68', ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('rect', { x: 72, y: 62, width: 16, height: 14, rx: 2 }, 'gray'),
    s('rect', { x: 44, y: 74, width: 72, height: 70, rx: 8 }, 'white'),
    s('rect', { x: 44, y: 74, width: 72, height: 70, rx: 8, ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 54, y: 86, width: 28, height: 32, rx: 3 }, 'sky'),
    s('path', { d: busts([68], 118, 20, 12) }, 'navy'),
    s('circle', { cx: 68, cy: 98, r: 7 }, 'skin'),
    s('path', { d: 'M90 94h18M90 106h18M54 130h52', ...SW(4) }, 'gray', { stroke: true })
  ],
  enfermedad: [
    s('path', { d: 'M80 20v18M80 140v-18M20 80h18M140 80h-18M38 38l12 12M122 38l-12 12M38 122l12-12M122 122l-12-12', ...SW(5) }, 'green', { stroke: true }),
    s('path', { d: dots([[80, 20], [80, 140], [20, 80], [140, 80], [38, 38], [122, 38], [38, 122], [122, 122]], 6) }, 'green'),
    s('circle', { cx: 80, cy: 80, r: 44 }, 'green', { accent: true }),
    s('path', { d: dots([[60, 104], [104, 100], [98, 58]], 6) }, 'mint'),
    s('path', { d: 'M60 72l12 6M100 72l-12 6M66 98q14-10 28 0', ...SW(4) }, 'dark', { stroke: true })
  ],
  escena: [
    s('rect', { x: 24, y: 64, width: 112, height: 16, rx: 2, transform: 'rotate(-16 24 64)' }, 'dark'),
    s('path', { d: 'M38 64h14l-10 16H28zM66 64h14l-10 16H56zM94 64h14l-10 16H84zM122 64h14l-10 16h-14z', transform: 'rotate(-16 24 64)' }, 'white'),
    s('rect', { x: 24, y: 70, width: 112, height: 16, rx: 2 }, 'dark'),
    s('path', { d: 'M38 70h14l-10 16H28zM66 70h14l-10 16H56zM94 70h14l-10 16H84zM122 70h14l-10 16h-14z' }, 'white'),
    s('rect', { x: 24, y: 88, width: 112, height: 50, rx: 4 }, 'dark', { accent: true }),
    s('path', { d: 'M36 104h88M36 120h88M80 104v28', ...SW(3) }, 'gray', { stroke: true })
  ],
  estructura: [
    ground(),
    s('path', { d: 'M30 72 80 40l50 32M30 104l50-32 50 32M30 136l50-32 50 32', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 136V40M80 136V40M130 136V40M30 40h100M30 72h100M30 104h100', ...SW(6) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: dots([30, 80, 130].flatMap(x => [40, 72, 104].map(y => [x, y])), 5) }, 'dark')
  ],
  golpe: [
    s('path', { d: burst(116, 88, 34, 18, 10) }, 'yellow'),
    s('rect', { x: 14, y: 72, width: 46, height: 32, rx: 6 }, 'red'),
    s('rect', { x: 56, y: 64, width: 44, height: 48, rx: 12 }, 'skin', { accent: true }),
    s('path', { d: 'M84 76h16M84 88h16M84 100h14', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M62 92q14-4 20 8', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M14 56h22M14 120h24', ...SW(4) }, 'gray', { stroke: true })
  ],
  matrimonio: [
    s('circle', { cx: 62, cy: 98, r: 30, ...SW(9) }, 'yellow', { stroke: true, accent: true }),
    s('circle', { cx: 98, cy: 98, r: 30, ...SW(9) }, 'orange', { stroke: true }),
    s('path', { d: 'M54 60l8-10 8 10-8 8z' }, 'sky'),
    s('path', { d: heart(80, 42, 14) }, 'red')
  ],
  'misión': [
    s('path', { d: dots([[28, 40], [134, 30], [130, 110], [36, 116]], 3) }, 'yellow'),
    s('path', { d: 'M66 94h28l-14 36z' }, 'orange'),
    s('path', { d: 'M72 94h16l-8 20z' }, 'yellow'),
    s('path', { d: 'M58 70l-16 28h18zM102 70l16 28h-18z' }, 'red'),
    s('path', { d: 'M80 16c18 14 24 40 22 78H58c-2-38 4-64 22-78z' }, 'white'),
    s('path', { d: 'M80 16c10 8 16 18 19 28H61c3-10 9-20 19-28z' }, 'red', { accent: true }),
    s('path', { d: 'M80 16c18 14 24 40 22 78H58c-2-38 4-64 22-78z', ...SW(3) }, 'navy', { stroke: true }),
    s('circle', { cx: 80, cy: 62, r: 9 }, 'blue')
  ],
  participar: [
    s('path', { d: busts([38, 122], 138, 32, 40) }, 'blue'),
    s('path', { d: busts([80], 138, 34, 44) }, 'orange', { accent: true }),
    s('path', { d: dots([[38, 84], [122, 84]], 13) }, 'skin'),
    s('circle', { cx: 80, cy: 78, r: 14 }, 'skin'),
    s('path', { d: 'M94 104 106 56', ...SW(8) }, 'orange', { stroke: true }),
    s('circle', { cx: 108, cy: 50, r: 7 }, 'skin')
  ],
  peligro: [
    s('path', { d: 'M80 20 142 126H18z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 20 142 126H18z', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 74, y: 54, width: 12, height: 42, rx: 5 }, 'dark'),
    s('circle', { cx: 80, cy: 110, r: 7 }, 'dark')
  ],
  'presión': [
    s('rect', { x: 70, y: 132, width: 20, height: 12 }, 'gray'),
    s('circle', { cx: 80, cy: 84, r: 56 }, 'gray'),
    s('circle', { cx: 80, cy: 84, r: 46 }, 'white'),
    s('path', { d: 'M53.1 110.9A38 38 0 0 1 99 51.1', ...SW(8, { 'stroke-linecap': 'butt' }) }, 'green', { stroke: true }),
    s('path', { d: 'M99 51.1A38 38 0 0 1 106.9 110.9', ...SW(8, { 'stroke-linecap': 'butt' }) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M80 84 112 72', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 84, r: 7 }, 'dark')
  ],
  'sección': [
    s('path', { d: 'M70 84H118A48 48 0 1 1 94 42.4z' }, 'blue'),
    s('path', { d: 'M80 78 104 36.4A48 48 0 0 1 128 78z' }, 'orange', { accent: true }),
    s('path', { d: 'M70 84H118M70 84 94 42.4', ...SW(3) }, 'white', { stroke: true })
  ],
  batalla: [
    s('path', { d: 'M40 54 98 16M120 54 62 16', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: burst(80, 36, 20, 9, 8) }, 'yellow'),
    s('path', { d: 'M16 54h48v34q0 30-24 42-24-12-24-42z' }, 'blue'),
    s('path', { d: 'M96 54h48v34q0 30-24 42-24-12-24-42z' }, 'red', { accent: true }),
    s('path', { d: star(40, 86, 13) }, 'white'),
    s('path', { d: 'M120 70v32M106 84h28', ...SW(6) }, 'yellow', { stroke: true })
  ],
  'carácter': [
    s('path', { d: 'M54 140v-22c-18-10-28-28-28-48 0-30 24-52 54-52s52 22 52 50c0 6-2 10 2 16l10 16c2 4 0 6-4 6h-8v14c0 8-6 12-14 12h-10v8z' }, 'sky', { accent: true }),
    s('path', { d: heart(62, 52, 12) }, 'red'),
    s('path', { d: star(100, 54, 14) }, 'yellow'),
    s('path', { d: 'M78 78l-12 22h10l-6 22 20-30H80l8-14z' }, 'orange')
  ],
  distinto: [
    s('path', { d: 'M22 20h28v64l22 18c10 8 4 26-10 24l-32-6c-10-2-12-10-10-20z' }, 'red', { accent: true }),
    s('path', { d: 'M22 32h28M22 46h28M22 60h28', ...SW(5, { 'stroke-linecap': 'butt' }) }, 'white', { stroke: true }),
    s('path', { d: 'M86 20h28v64l22 18c10 8 4 26-10 24l-32-6c-10-2-12-10-10-20z' }, 'blue'),
    s('path', { d: dots([[96, 36], [106, 54], [96, 72], [110, 104], [94, 108]], 4) }, 'yellow'),
    s('rect', { x: 86, y: 20, width: 28, height: 8 }, 'navy')
  ],
  eh: [
    s('path', { d: busts([54], 142, 54, 54) }, 'green', { accent: true }),
    s('circle', { cx: 54, cy: 64, r: 22 }, 'skin'),
    s('path', { d: dots([[58, 58], [68, 58]], 2.5) }, 'dark'),
    s('ellipse', { cx: 68, cy: 74, rx: 4, ry: 5 }, 'dark'),
    s('path', { d: 'M76 82q8 0 10-12', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M98 52q10 16 0 32M112 42q16 26 0 52M126 32q22 36 0 72', ...SW(5) }, 'orange', { stroke: true })
  ],
  evento: [
    ground(),
    s('rect', { x: 30, y: 70, width: 100, height: 66 }, 'cream'),
    s('path', { d: rects([[30, 70, 20, 66], [70, 70, 20, 66], [110, 70, 20, 66]]) }, 'red'),
    s('path', { d: 'M66 136v-40l14-10 14 10v40z' }, 'dark'),
    s('path', { d: 'M24 72l56-38 56 38z' }, 'red', { accent: true }),
    s('path', { d: 'M80 36V16', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 16l14 5-14 5z' }, 'yellow'),
    s('path', { d: dots([[22, 30], [138, 40], [34, 52], [124, 22]], 3.5) }, 'purple'),
    s('path', { d: dots([[46, 24], [112, 50], [144, 60], [16, 50]], 3) }, 'blue')
  ],
  independiente: [
    s('path', { d: busts([28, 50, 72], 136, 20, 26) }, 'gray'),
    s('path', { d: dots([[28, 101], [50, 101], [72, 101]], 9) }, 'skin'),
    s('path', { d: 'M92 30v106', ...SW(3, { 'stroke-dasharray': '6 6' }) }, 'gray', { stroke: true }),
    ...person(124, 136, 'orange', { accent: true }),
    s('path', { d: star(124, 40, 12) }, 'yellow')
  ],
  ingreso: [
    s('rect', { x: 46, y: 50, width: 68, height: 12, rx: 3 }, 'gray'),
    s('rect', { x: 40, y: 60, width: 80, height: 78, rx: 14 }, 'sky'),
    s('path', { d: 'M40 104h80v20q0 14-14 14H54q-14 0-14-14z' }, 'yellow'),
    s('path', { d: 'M40 104h80M48 118h64', ...SW(3) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 26, r: 13 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 26, r: 13, ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M110 14v26M102 32l8 8 8-8', ...SW(5) }, 'green', { stroke: true })
  ],
  ofrecer: [
    s('rect', { x: 14, y: 96, width: 36, height: 24, rx: 4 }, 'blue', { accent: true }),
    s('ellipse', { cx: 78, cy: 108, rx: 30, ry: 10 }, 'skin'),
    s('path', { d: 'M62 100q4-10 12-8', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M84 100V50', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M84 80q14-12 22-4q-10 10-22 4z' }, 'green'),
    s('path', { d: dots([[84, 31], [75, 40], [93, 40], [84, 49]], 9) }, 'pink'),
    s('circle', { cx: 84, cy: 40, r: 6 }, 'yellow'),
    s('path', { d: 'M120 64l10-6M124 84h12M120 104l10 6', ...SW(3) }, 'orange', { stroke: true })
  ],
  'operación': [
    s('path', { d: 'M80 14v18', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 54h64l24 46H24z' }, 'cream'),
    s('path', { d: 'M44 52a36 22 0 0 1 72 0z' }, 'gray'),
    s('path', { d: dots([[62, 46], [80, 44], [98, 46]], 5) }, 'yellow'),
    s('rect', { x: 20, y: 104, width: 120, height: 10, rx: 3 }, 'gray'),
    s('path', { d: 'M30 114v22M130 114v22', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 40, cy: 94, r: 10 }, 'skin'),
    s('path', { d: 'M54 88h78q6 0 6 6v10H54z' }, 'green', { accent: true })
  ],
  papa: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'sky'),
    s('path', { d: 'M58 134l6-52h32l6 52z' }, 'white'),
    s('path', { d: 'M74 86v48M86 86v48', ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 66, r: 13 }, 'skin'),
    s('path', { d: 'M68 56l2-30 10-8 10 8 2 30z' }, 'white'),
    s('path', { d: 'M80 30v16M74 37h12', ...SW(3) }, 'yellow', { stroke: true }),
    s('path', { d: 'M116 134V38M108 48h16', ...SW(5) }, 'yellow', { stroke: true, accent: true })
  ],
  servir: [
    s('rect', { x: 56, y: 126, width: 32, height: 10, rx: 3 }, 'red'),
    s('path', { d: 'M30 96h84a42 34 0 0 1-84 0z' }, 'red', { accent: true }),
    s('ellipse', { cx: 72, cy: 96, rx: 42, ry: 8 }, 'orange'),
    s('path', { d: 'M140 24 106 64', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M86 64h28a14 14 0 0 1-28 0z' }, 'gray'),
    s('path', { d: 'M92 82v8', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M48 82q-6-10 0-18M66 82q-6-10 0-18', ...SW(3) }, 'gray', { stroke: true })
  ],
  'teoría': [
    s('rect', { x: 14, y: 18, width: 132, height: 90, rx: 6 }, 'green'),
    s('rect', { x: 14, y: 18, width: 132, height: 90, rx: 6, ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M28 90l22-44 22 44zM84 90q14-50 46-50M124 34l6 6-6 6M84 40a8 8 0 1 0 0.1 0', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: busts([118], 148, 32, 22) }, 'purple', { accent: true }),
    s('circle', { cx: 118, cy: 114, r: 12 }, 'skin'),
    s('path', { d: 'M104 112q-4-14 14-16q18 2 14 16', ...SW(5) }, 'gray', { stroke: true })
  ],
  'característica': [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'mint'),
    s('path', { d: 'M46 112q-8-30 0-50a36 36 0 0 1 68 0q6 20 0 50', ...SW(5) }, 'navy', { stroke: true }),
    s('path', { d: 'M58 122q-10-20-6-44a28 28 0 0 1 56 0q2 24-6 44M68 126q-8-22-6-46a18 18 0 0 1 36 0q2 22-6 46M78 128q-6-24-6-46a8 8 0 0 1 16 0q2 22-4 44', ...SW(5) }, 'purple', { stroke: true, accent: true })
  ],
  concepto: [
    s('path', { d: dots([[52, 74], [78, 54], [106, 62], [110, 88], [80, 96], [50, 94]], 22) }, 'sky'),
    s('path', { d: dots([[36, 130]], 8) + dots([[22, 144]], 4) }, 'sky'),
    s('circle', { cx: 60, cy: 78, r: 11 }, 'red', { accent: true }),
    s('rect', { x: 80, y: 60, width: 20, height: 20, rx: 2 }, 'blue'),
    s('path', { d: 'M94 106l12-20 12 20z' }, 'yellow')
  ],
  diputado: [
    s('path', { d: 'M18 124a62 62 0 0 1 124 0M38 124a42 42 0 0 1 84 0', ...SW(8) }, 'green', { stroke: true }),
    ...person(80, 140, 'navy', { h: 48, w: 36, r: 14 }),
    s('path', { d: 'M77 94h6l2 20-5 6-5-6z' }, 'red'),
    s('path', { d: burst(70, 104, 8, 5, 8) }, 'yellow', { accent: true })
  ],
  directo: [
    s('path', { d: 'M26 112c10-60 40 20 50-30s40 40 58-34', ...SW(4, { 'stroke-dasharray': '6 7' }) }, 'gray', { stroke: true }),
    s('circle', { cx: 26, cy: 112, r: 11 }, 'blue'),
    s('circle', { cx: 134, cy: 46, r: 12 }, 'red'),
    s('path', { d: 'M34 106 116 56', ...SW(7) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M100 52l18 2-8 16', ...SW(7) }, 'orange', { stroke: true })
  ],
  documento: [
    s('path', { d: 'M34 16h64l28 28v100H34z' }, 'white'),
    s('path', { d: 'M34 16h64l28 28v100H34z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M98 16v28h28z' }, 'gray'),
    s('rect', { x: 46, y: 30, width: 40, height: 12, rx: 2 }, 'blue', { accent: true }),
    s('path', { d: 'M46 60h66M46 76h66M46 92h66M46 108h44', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M118 112v20a6 6 0 0 1-12 0v-24a4 4 0 0 1 8 0v18', ...SW(3) }, 'purple', { stroke: true })
  ],
  enorme: [
    ground(),
    s('path', { d: 'M66 50q-2-18 10-24', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M74 40q14-14 24-4q-12 10-24 4z' }, 'green'),
    s('ellipse', { cx: 66, cy: 92, rx: 50, ry: 44 }, 'orange', { accent: true }),
    s('path', { d: 'M66 48q-26 44 0 88M66 48q26 44 0 88M40 54q-30 38 0 78M92 54q30 38 0 78', ...SW(3) }, 'brown', { stroke: true }),
    ...person(134, 136, 'blue', { h: 14, w: 10, r: 5 })
  ],
  exactamente: [
    s('rect', { x: 20, y: 52, width: 62, height: 72, rx: 4 }, 'blue'),
    s('rect', { x: 80, y: 52, width: 62, height: 72, rx: 4 }, 'yellow'),
    s('circle', { cx: 88, cy: 88, r: 12 }, 'blue'),
    s('path', { d: 'M81 54v22M81 100v22', ...SW(2) }, 'white', { stroke: true }),
    s('circle', { cx: 126, cy: 32, r: 18 }, 'green', { accent: true }),
    s('path', { d: 'M117 32l6 6 11-12', ...SW(5) }, 'white', { stroke: true })
  ],
  festival: [
    s('path', { d: 'M14 34q66 30 132 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M21 40h18l-9 16zM71 49h18l-9 16zM121 40h18l-9 16z' }, 'red'),
    s('path', { d: 'M46 46h18l-9 16zM96 46h18l-9 16z' }, 'blue'),
    s('path', { d: 'M50 84v-8M50 120v8M32 102h-8M68 102h8M37 89l-6-6M63 89l6-6M37 115l-6 6M63 115l6 6', ...SW(4) }, 'yellow', { stroke: true, accent: true }),
    s('circle', { cx: 50, cy: 102, r: 5 }, 'yellow'),
    s('path', { d: 'M112 92v-6M112 124v6M96 108h-6M128 108h6M101 97l-5-5M123 97l5-5M101 119l-5 5M123 119l5 5', ...SW(4) }, 'purple', { stroke: true }),
    s('circle', { cx: 112, cy: 108, r: 4 }, 'purple')
  ],
  gobernador: [
    s('path', { d: 'M80 22v116M22 80h116M39 39l82 82M121 39l-82 82', ...SW(6) }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 40, ...SW(10) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: dots([[80, 20], [80, 140], [20, 80], [140, 80], [38, 38], [122, 122], [122, 38], [38, 122]], 7) }, 'tan'),
    s('circle', { cx: 80, cy: 80, r: 13 }, 'tan'),
    s('circle', { cx: 80, cy: 80, r: 5 }, 'brown')
  ],
  lograr: [
    s('path', { d: 'M14 136l52-84 18 26 14-18 48 76z' }, 'gray'),
    s('path', { d: 'M66 52 54 72l8-4 6 6 6-8z' }, 'white'),
    s('path', { d: 'M66 54V18', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M66 18h30l-7 8 7 8H66z' }, 'red', { accent: true }),
    s('path', { d: 'M110 24l6-6M114 40h8M28 40l-6-6', ...SW(3) }, 'orange', { stroke: true })
  ],
  matar: [
    ground(),
    s('path', { d: 'M12 136v-12h36v12zM18 124l6-46h12l6 46z' }, 'tan'),
    s('circle', { cx: 30, cy: 68, r: 10 }, 'tan'),
    s('path', { d: 'M20 62l2-16 8 8 8-8 2 16z' }, 'yellow', { accent: true }),
    s('path', { d: 'M-18 0v-12h36v12zM-12-12l6-46h12l6 46z', transform: 'translate(60 122) rotate(90) scale(0.8)' }, 'dark'),
    s('circle', { cx: 0, cy: -68, r: 10, transform: 'translate(60 122) rotate(90) scale(0.8)' }, 'dark'),
    s('path', { d: 'M0-78v-16M-7-88h14', transform: 'translate(60 122) rotate(90) scale(0.8)', ...SW(5) }, 'dark', { stroke: true })
  ],
  ocurrir: [
    s('path', { d: burst(108, 60, 38, 20, 10) }, 'orange', { accent: true }),
    s('path', { d: burst(108, 60, 18, 10, 10) }, 'yellow'),
    ...person(44, 136, 'blue'),
    s('ellipse', { cx: 44, cy: 84, rx: 3, ry: 4 }, 'dark'),
    s('path', { d: 'M26 56l-6-6M44 52v-8M62 56l6-6', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M78 90l-8 6M90 102l-6 8', ...SW(3) }, 'orange', { stroke: true })
  ],
  'período': [
    s('path', { d: 'M14 90h132', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 80v20M136 80v20M80 82v16', ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 52, y: 82, width: 56, height: 16, rx: 3 }, 'orange', { accent: true }),
    s('path', { d: dots([[52, 90], [108, 90]], 6) }, 'dark'),
    s('path', { d: 'M52 66v-8h56v8', ...SW(4) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 36, r: 14 }, 'sky'),
    s('path', { d: 'M80 36v-8M80 36h6', ...SW(3) }, 'dark', { stroke: true })
  ],
  principalmente: [
    s('path', { d: dots([[30, 40], [130, 40], [24, 104], [136, 104], [56, 134], [104, 134]], 10) }, 'gray'),
    s('circle', { cx: 80, cy: 80, r: 36 }, 'red', { accent: true }),
    s('path', { d: star(80, 80, 18) }, 'yellow')
  ],
  responsable: [
    s('path', { d: 'M24 22l-4 10M44 16l-4 10M120 14l-4 10M140 22l-4 10M22 54l-4 10M144 52l-4 10', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M80 30V102', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 64a52 36 0 0 1 104 0q-13-8-26 0-13-8-26 0-13-8-26 0-13-8-26 0z' }, 'red', { accent: true }),
    ...person(62, 136, 'navy', { h: 44, w: 28, r: 12 }),
    ...person(104, 136, 'yellow', { h: 26, w: 20, r: 9 })
  ],
  'tamaño': [
    s('path', { d: rects([[18, 112, 22, 24], [48, 92, 36, 44], [92, 64, 52, 72]]) }, 'tan'),
    s('path', { d: rects([[18, 112, 22, 24], [48, 92, 36, 44], [92, 64, 52, 72]]), ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M29 112v8M66 92v12M118 64v16', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M94 48h48M102 40l-8 8 8 8M134 40l8 8-8 8', ...SW(4) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M14 136h132', ...SW(3) }, 'gray', { stroke: true })
  ],
  afuera: [
    s('path', { d: 'M88 136h58', ...SW(6) }, 'green', { stroke: true }),
    s('circle', { cx: 126, cy: 36, r: 16 }, 'yellow'),
    s('rect', { x: 14, y: 22, width: 70, height: 116, rx: 3 }, 'tan'),
    s('rect', { x: 26, y: 40, width: 46, height: 96 }, 'dark'),
    s('path', { d: 'M26 40l-8 6v94l8-4z' }, 'brown'),
    ...person(110, 136, 'red', { accent: true }),
    s('path', { d: 'M62 112h24M78 104l8 8-8 8', ...SW(4) }, 'orange', { stroke: true })
  ],
  clave: [
    s('path', { d: 'M50 70V50a24 24 0 0 1 48 0v20', ...SW(10) }, 'gray', { stroke: true }),
    s('rect', { x: 36, y: 68, width: 76, height: 64, rx: 8 }, 'yellow', { accent: true }),
    s('path', { d: 'M74 88a7 7 0 1 0 0.1 0zM71 96h6l2 16h-10z' }, 'dark'),
    s('path', { d: 'M80 104h44M94 104v8M102 104v6', ...SW(6) }, 'orange', { stroke: true }),
    s('circle', { cx: 134, cy: 104, r: 9, ...SW(5) }, 'orange', { stroke: true })
  ],
  considerar: [
    s('path', { d: busts([50], 146, 46, 32) }, 'green', { accent: true }),
    s('circle', { cx: 50, cy: 92, r: 20 }, 'skin'),
    s('path', { d: dots([[50, 86], [62, 86]], 2.5) }, 'dark'),
    s('path', { d: 'M40 130q8-14 20-18', ...SW(8) }, 'green', { stroke: true }),
    s('circle', { cx: 60, cy: 112, r: 7 }, 'skin'),
    s('path', { d: dots([[74, 72]], 4) + dots([[84, 60]], 6) }, 'gray'),
    s('path', { d: dots([[98, 40], [118, 34], [130, 50], [110, 56], [92, 54]], 14) }, 'sky'),
    s('path', { d: 'M112 30v22M100 36h24M100 36l-4 8h8zM124 36l-4 8h8z', ...SW(2.5) }, 'dark', { stroke: true })
  ],
  'crítico': [
    s('path', { d: 'M80 18v14M36 34l10 10M124 34l-10 10M20 78h14M126 78h14', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M50 112V78a30 30 0 0 1 60 0v34z' }, 'red', { accent: true }),
    s('path', { d: 'M62 80q2-14 12-18', ...SW(4) }, 'white', { stroke: true }),
    s('rect', { x: 40, y: 112, width: 80, height: 18, rx: 4 }, 'dark')
  ],
  demanda: [
    s('rect', { x: 62, y: 16, width: 36, height: 30, rx: 4 }, 'red', { accent: true }),
    s('path', { d: star(80, 31, 9) }, 'yellow'),
    s('path', { d: 'M48 116 64 56M90 116l2-58M112 116 98 56', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: busts([36, 80, 124], 144, 30, 30) }, 'blue'),
    s('path', { d: dots([[36, 100], [80, 100], [124, 100]], 12) }, 'skin')
  ],
  diverso: [
    s('circle', { cx: 40, cy: 48, r: 20 }, 'red', { accent: true }),
    s('rect', { x: 62, y: 28, width: 38, height: 38, rx: 4 }, 'blue'),
    s('path', { d: star(122, 48, 24) }, 'yellow'),
    s('path', { d: 'M18 132l22-38 22 38z' }, 'green'),
    s('path', { d: heart(80, 114, 18) }, 'pink'),
    s('path', { d: 'M122 90l22 22-22 22-22-22z' }, 'purple')
  ],
  ecuador: [
    s('circle', { cx: 80, cy: 80, r: 58 }, 'blue'),
    s('path', { d: 'M50 40q14-10 26 0t6 20-14 14-18-4-10-22zM96 92q20-4 26 10t-8 24-18-4-6-18zM36 96q10 4 12 16t-8 10-8-14z' }, 'green'),
    s('path', { d: 'M22 80q58 18 116 0', ...SW(6) }, 'red', { stroke: true, accent: true })
  ],
  jugador: [
    s('path', { d: 'M50 64 34 84M76 64l16 16', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M56 102v32M70 102l22 18', ...SW(8) }, 'skin', { stroke: true }),
    s('circle', { cx: 62, cy: 40, r: 13 }, 'skin'),
    s('rect', { x: 49, y: 56, width: 28, height: 40, rx: 8 }, 'red', { accent: true }),
    s('rect', { x: 49, y: 90, width: 28, height: 14, rx: 4 }, 'navy'),
    s('circle', { cx: 108, cy: 126, r: 12 }, 'white'),
    s('circle', { cx: 108, cy: 126, r: 12, ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 108, cy: 126, r: 4 }, 'dark'),
    s('path', { d: 'M124 110l12-6M126 126h14', ...SW(3) }, 'gray', { stroke: true })
  ],
  aparecer: [
    s('rect', { x: 44, y: 80, width: 52, height: 54, rx: 4 }, 'dark'),
    s('rect', { x: 44, y: 116, width: 52, height: 8 }, 'red'),
    s('path', { d: 'M60 62l-6-36 10 0 6 32zM80 62l6-36-10 0-6 32z' + dots([[70, 66]], 14) }, 'white'),
    s('path', { d: 'M60 62l-6-36 10 0 6 32zM80 62l6-36-10 0-6 32z' + dots([[70, 66]], 14), ...SW(2.5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[64, 64], [76, 64]], 2) }, 'dark'),
    s('ellipse', { cx: 70, cy: 80, rx: 38, ry: 8 }, 'dark'),
    s('path', { d: star(118, 40, 11) }, 'yellow', { accent: true }),
    s('path', { d: star(28, 52, 7) }, 'yellow'),
    s('path', { d: 'M110 108 136 82', ...SW(5) }, 'dark', { stroke: true })
  ],
  contacto: [
    s('path', { d: 'M36 40h-8M36 64h-8M36 88h-8M36 112h-8', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 36, y: 18, width: 84, height: 124, rx: 6 }, 'blue', { accent: true }),
    s('path', { d: rects([[120, 30, 8, 16], [120, 54, 8, 16], [120, 78, 8, 16]]) }, 'orange'),
    s('circle', { cx: 78, cy: 60, r: 13 }, 'white'),
    s('path', { d: busts([78], 104, 40, 26) }, 'white'),
    s('path', { d: 'M56 120h44', ...SW(4) }, 'sky', { stroke: true })
  ],
  crecimiento: [
    ground(),
    s('rect', { x: 24, y: 16, width: 22, height: 120, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M24 30h10M24 46h6M24 62h10M24 78h6M24 94h10M24 110h6M24 126h10', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 100h44M54 82h44', ...SW(3, { 'stroke-dasharray': '5 5' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M54 64h44', ...SW(4) }, 'orange', { stroke: true }),
    ...person(76, 136, 'green', { h: 46, w: 28, r: 12 }),
    s('path', { d: 'M118 108V62M110 72l8-10 8 10', ...SW(4) }, 'orange', { stroke: true })
  ],
  excelente: [
    s('rect', { x: 14, y: 54, width: 132, height: 52, rx: 14 }, 'navy'),
    s('path', { d: [34, 57, 80, 103, 126].map(x => star(x, 80, 11)).join('') }, 'yellow', { accent: true }),
    s('path', { d: 'M132 32l6 10M28 32l-6 10M80 24v12', ...SW(4) }, 'orange', { stroke: true })
  ],
  podar: [
    s('path', { d: 'M14 50q40 10 70 30t60 20', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M36 54q4-18 20-16q-4 14-20 16zM118 94q12-16 26-8q-12 12-26 8z' }, 'green'),
    s('path', { d: 'M88 96 70 62l8-2 14 30zM88 96l18-32-8-2-14 28z' }, 'gray'),
    s('path', { d: 'M88 96 70 136M88 96l20 38', ...SW(10) }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 88, cy: 96, r: 4 }, 'dark'),
    s('path', { d: 'M122 122q10-6 18 2q-10 6-18-2z' }, 'green')
  ],
  personaje: [
    s('path', { d: 'M66 72 36 136h88L94 72z' }, 'red'),
    ...person(80, 136, 'blue', { h: 50, w: 32, r: 14 }),
    s('rect', { x: 66, y: 64, width: 28, height: 9, rx: 4 }, 'dark'),
    s('path', { d: star(80, 106, 11) }, 'yellow', { accent: true }),
    s('path', { d: 'M66 136v-12M94 136v-12', ...SW(6) }, 'navy', { stroke: true })
  ],
  pro: [
    s('circle', { cx: 62, cy: 76, r: 44 }, 'green', { accent: true }),
    s('path', { d: 'M62 52v48M38 76h48', ...SW(12) }, 'white', { stroke: true }),
    s('circle', { cx: 124, cy: 120, r: 20 }, 'red'),
    s('path', { d: 'M114 120h20', ...SW(6) }, 'white', { stroke: true })
  ],
  'quizá': [
    ...person(80, 138, 'purple', { h: 46, w: 32, r: 14 }),
    s('path', { d: 'M64 100 46 90l-6-14M96 100l18-10 6-14', ...SW(7) }, 'purple', { stroke: true }),
    s('path', { d: dots([[40, 74], [120, 74]], 6) }, 'skin'),
    s('path', { d: 'M70 72l8-3M90 72l-8-3M74 86h12', ...SW(3) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 80, cy: 28, rx: 14, ry: 6 }, 'yellow', { accent: true }),
    s('path', { d: 'M60 22q-6 8 0 14M100 22q6 8 0 14', ...SW(3) }, 'orange', { stroke: true })
  ],
  'recién': [
    s('rect', { x: 18, y: 120, width: 124, height: 12, rx: 4 }, 'gray'),
    s('path', { d: 'M24 120q0-48 56-48t56 48z' }, 'orange', { accent: true }),
    s('path', { d: 'M52 90l10 16M78 84l6 18M104 90l-2 16', ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M56 62q-8-10 0-20t0-20M80 58q-8-10 0-20t0-20M104 62q-8-10 0-20t0-20', ...SW(4) }, 'gray', { stroke: true })
  ]
};
