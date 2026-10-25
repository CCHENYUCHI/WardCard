// Illustration specs for common words, batch 0004 (plus leftovers of 0003) (see server/scripts/lexicon/art.js)
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
  industria: [
    ground(),
    s('path', { d: dots([[116, 30], [126, 22], [138, 16]], 6) }, 'gray'),
    s('rect', { x: 106, y: 40, width: 16, height: 96 }, 'red', { accent: true }),
    s('path', { d: 'M18 136V76l28 18V76l28 18V76l28 18v42z' }, 'gray'),
    s('path', { d: 'M18 136V76l28 18V76l28 18V76l28 18v42z', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: rects([[28, 106, 14, 12], [54, 106, 14, 12], [80, 106, 14, 12]]) }, 'yellow')
  ],
  instituto: [
    s('path', { d: 'M24 64h112L80 38z' }, 'red', { accent: true }),
    s('path', { d: rects([[28, 64, 104, 10], [34, 74, 10, 54], [58, 74, 10, 54], [92, 74, 10, 54], [116, 74, 10, 54]]) }, 'cream'),
    s('path', { d: rects([[28, 64, 104, 10], [34, 74, 10, 54], [58, 74, 10, 54], [92, 74, 10, 54], [116, 74, 10, 54]]), ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 72, y: 98, width: 16, height: 30 }, 'brown'),
    s('rect', { x: 20, y: 128, width: 120, height: 10, rx: 2 }, 'gray'),
    s('path', { d: 'M80 12l28 10-28 10-28-10z' }, 'dark'),
    s('path', { d: 'M104 22v14', ...SW(3) }, 'yellow', { stroke: true })
  ],
  loco: [
    s('path', { d: 'M40 58 26 42M54 46 48 24M72 40 70 16M90 40l4-24M106 46l8-20M120 58l14-14', ...SW(6) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 86, r: 46 }, 'skin'),
    s('path', { d: dots([[62, 78], [98, 78]], 14) }, 'white'),
    s('path', { d: 'M60 78a2 2 0 1 1 4 0a5 5 0 1 1-10 0a8 8 0 1 1 16 0a11 11 0 1 1-22 0M96 78a2 2 0 1 0 4 0a5 5 0 1 0-10 0a8 8 0 1 0 16 0a11 11 0 1 0-22 0', ...SW(2.5) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M56 108q6 8 12 0t12 0t12 0t12 0', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M18 96q-6 10 2 18M142 96q6 10-2 18', ...SW(3) }, 'gray', { stroke: true })
  ],
  origen: [
    s('circle', { cx: 80, cy: 74, r: 24 }, 'yellow', { accent: true }),
    s('circle', { cx: 88, cy: 70, r: 3.5 }, 'dark'),
    s('path', { d: 'M102 72l10 4-10 5z' }, 'orange'),
    s('path', { d: 'M42 96l9 10 10-10 9 10 10-10 9 10 10-10 9 10 10-10q0 44-38 44t-38-44z' }, 'cream'),
    s('path', { d: 'M42 96l9 10 10-10 9 10 10-10 9 10 10-10 9 10 10-10q0 44-38 44t-38-44z', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M58 56l10 7 10-7 10 7 10-7q-2-26-20-26t-20 26z' }, 'cream'),
    s('path', { d: 'M58 56l10 7 10-7 10 7 10-7q-2-26-20-26t-20 26z', ...SW(3) }, 'tan', { stroke: true })
  ],
  premio: [
    s('path', { d: 'M52 40H36v8q0 18 20 22M108 40h16v8q0 18-20 22', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M50 28h60v28a30 30 0 0 1-60 0z' }, 'yellow', { accent: true }),
    s('path', { d: star(80, 52, 12) }, 'white'),
    s('rect', { x: 74, y: 84, width: 12, height: 22 }, 'orange'),
    s('rect', { x: 56, y: 106, width: 48, height: 10, rx: 2 }, 'brown'),
    s('rect', { x: 46, y: 116, width: 68, height: 18, rx: 3 }, 'brown'),
    s('path', { d: 'M24 22l6 8M136 22l-6 8M22 96l-8 4M138 96l8 4', ...SW(3) }, 'red', { stroke: true })
  ],
  re: [
    s('path', { d: 'M126 98A48 48 0 1 1 116 48', ...SW(8) }, 'blue', { stroke: true }),
    s('path', { d: 'M100 36l26 2-8 24z' }, 'blue'),
    s('path', { d: 'M80 108c-24-15-30-27-30-37a14 14 0 0 1 30-6 14 14 0 0 1 30 6c0 10-6 22-30 37z' }, 'red', { accent: true }),
    s('path', { d: 'M136 112v16M128 120h16M24 22v12M18 28h12', ...SW(3) }, 'orange', { stroke: true })
  ],
  simple: [
    s('circle', { cx: 38, cy: 80, r: 22 }, 'red', { accent: true }),
    s('rect', { x: 62, y: 60, width: 38, height: 40, rx: 2 }, 'blue'),
    s('path', { d: 'M104 100l20-40 20 40z' }, 'yellow'),
    s('path', { d: 'M18 120h124', ...SW(4) }, 'gray', { stroke: true })
  ],
  unidad: [
    s('circle', { cx: 80, cy: 84, r: 60 }, 'mint'),
    s('circle', { cx: 80, cy: 84, r: 60, ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: busts([50], 120, 24, 30) }, 'blue'),
    s('path', { d: busts([110], 120, 24, 30) }, 'yellow'),
    s('path', { d: busts([80], 120, 24, 30) }, 'red', { accent: true }),
    s('path', { d: dots([[50, 78], [80, 78], [110, 78]], 11) }, 'skin'),
    s('path', { d: 'M56 104h48', ...SW(5) }, 'skin', { stroke: true })
  ],
  canal: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'green'),
    s('rect', { x: 54, y: 14, width: 52, height: 132 }, 'blue'),
    s('path', { d: 'M54 14v132M106 14v132', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M62 124q5-5 10 0t10 0M80 134q5-5 10 0t10 0M62 30q5-5 10 0t10 0', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M80 44l14 18v44H66V62z' }, 'red', { accent: true }),
    s('rect', { x: 72, y: 72, width: 16, height: 18 }, 'white')
  ],
  cultural: [
    s('path', { d: 'M20 46q-10 10 0 24M140 64q10 10 0 24', ...SW(4) }, 'red', { stroke: true }),
    s('path', { d: 'M20 40q30-10 60 0v34q0 34-30 40-30-6-30-40z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 58q30-10 60 0v34q0 34-30 40-30-6-30-40z' }, 'purple'),
    s('path', { d: 'M32 62q6-7 12 0M56 62q6-7 12 0M36 82q14 16 28 0M92 80q6 7 12 0M116 80q6 7 12 0M96 112q14-14 28 0', ...SW(4) }, 'dark', { stroke: true })
  ],
  'económico': [
    s('path', { d: 'M56 66l4-18 16 12z' }, 'pink'),
    s('path', { d: rects([[42, 116, 12, 20], [90, 116, 12, 20]]) }, 'pink'),
    s('ellipse', { cx: 76, cy: 92, rx: 46, ry: 32 }, 'pink', { accent: true }),
    s('ellipse', { cx: 122, cy: 92, rx: 9, ry: 12 }, 'pink'),
    s('ellipse', { cx: 122, cy: 92, rx: 9, ry: 12, ...SW(2) }, 'red', { stroke: true }),
    s('path', { d: dots([[102, 80], [119, 92], [125, 92]], 2.5) }, 'dark'),
    s('path', { d: 'M62 64h26', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 75, cy: 38, r: 13 }, 'yellow'),
    s('circle', { cx: 75, cy: 38, r: 13, ...SW(3) }, 'orange', { stroke: true })
  ],
  escrito: [
    s('rect', { x: 30, y: 20, width: 82, height: 118, rx: 4 }, 'white'),
    s('rect', { x: 30, y: 20, width: 82, height: 118, rx: 4, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M42 46q5-8 10 0t10 0t10 0t10 0t10 0M42 68q5-8 10 0t10 0t10 0t10 0t10 0M42 90q5-8 10 0t10 0t10 0', ...SW(3) }, 'navy', { stroke: true, accent: true }),
    s('path', { d: 'M140 52 108 100', ...SW(10) }, 'blue', { stroke: true }),
    s('path', { d: 'M103 97l-3 15 12-8z' }, 'dark')
  ],
  'jamás': [
    s('path', { d: 'M34 42h92q8 0 8 8v44q0 8-8 8H72l-20 16v-16H34q-8 0-8-8V50q0-8 8-8z' }, 'orange'),
    s('path', { d: 'M44 74l10-12 10 12 10-12 10 12 10-12 10 12 10-12', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 78, r: 58, ...SW(10) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M39 37l82 82', ...SW(10) }, 'red', { stroke: true })
  ],
  juicio: [
    s('rect', { x: 18, y: 116, width: 86, height: 18, rx: 4 }, 'dark'),
    s('path', { d: 'M82 88 120 22', ...SW(8) }, 'tan', { stroke: true }),
    s('rect', { x: 50, y: 74, width: 62, height: 28, rx: 6, transform: 'rotate(30 81 88)' }, 'brown', { accent: true }),
    s('path', { d: 'M24 104l-8-6M34 96l-4-10M118 112l10-4', ...SW(3) }, 'orange', { stroke: true })
  ],
  original: [
    s('rect', { x: 20, y: 20, width: 120, height: 100, rx: 4 }, 'yellow'),
    s('rect', { x: 30, y: 30, width: 100, height: 80 }, 'sky'),
    s('circle', { cx: 108, cy: 52, r: 10 }, 'orange'),
    s('path', { d: 'M30 110l30-40 20 22 14-14 36 32z' }, 'green'),
    s('path', { d: 'M110 124l-6 18 10-4 4 10 6-18zM130 124l6 18-10-4-4 10-6-18z' }, 'red'),
    s('circle', { cx: 120, cy: 114, r: 16 }, 'red', { accent: true }),
    s('path', { d: star(120, 114, 8) }, 'white')
  ],
  peso: [
    ground(),
    s('path', { d: 'M46 82V68a18 18 0 0 1 36 0v14', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M28 136l10-56h52l10 56z' }, 'dark', { accent: true }),
    s('path', { d: 'M44 100h40', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 122, cy: 118, r: 18 }, 'yellow'),
    s('circle', { cx: 122, cy: 118, r: 11, ...SW(3) }, 'orange', { stroke: true })
  ],
  prensa: [
    s('rect', { x: 40, y: 20, width: 100, height: 106, rx: 3 }, 'gray'),
    s('rect', { x: 20, y: 34, width: 100, height: 106, rx: 3 }, 'white'),
    s('rect', { x: 20, y: 34, width: 100, height: 106, rx: 3, ...SW(3) }, 'gray', { stroke: true }),
    s('rect', { x: 30, y: 44, width: 80, height: 12 }, 'dark', { accent: true }),
    s('rect', { x: 30, y: 64, width: 36, height: 30 }, 'sky'),
    s('path', { d: 'M74 68h36M74 78h36M74 88h36M30 104h80M30 114h80M30 124h60', ...SW(3) }, 'gray', { stroke: true })
  ],
  propiedad: [
    s('path', { d: 'M30 70l40-34 40 34z' }, 'red', { accent: true }),
    s('rect', { x: 40, y: 68, width: 60, height: 50 }, 'cream'),
    s('rect', { x: 40, y: 68, width: 60, height: 50, ...SW(2) }, 'brown', { stroke: true }),
    s('rect', { x: 62, y: 90, width: 16, height: 28 }, 'brown'),
    s('path', { d: 'M14 112h132M14 126h132M20 104v32M36 104v32M104 104v32M120 104v32M136 104v32', ...SW(4) }, 'tan', { stroke: true }),
    s('circle', { cx: 126, cy: 36, r: 11, ...SW(6) }, 'yellow', { stroke: true }),
    s('path', { d: 'M126 47v36m0-10h9m-9-10h9', ...SW(6) }, 'yellow', { stroke: true })
  ],
  'revolución': [
    s('path', { d: 'M22 102a58 24 0 0 0 116 0', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M126 86l14 12 4-18', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M52 140V20', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M52 22q20-8 40 0t40 0v40q-20 8-40 0t-40 0z' }, 'red', { accent: true }),
    s('path', { d: star(90, 42, 11) }, 'yellow')
  ],
  victoria: [
    s('path', { d: burst(80, 70, 60, 46, 12) }, 'yellow'),
    ground(),
    s('path', { d: 'M68 98 46 52M92 98l22-46', ...SW(7) }, 'skin', { stroke: true }),
    ...person(80, 136, 'red', { accent: true }),
    s('path', { d: dots([[22, 30], [138, 34], [26, 110], [136, 108]], 4) }, 'blue'),
    s('path', { d: 'M40 24l6 6M120 22l-4 8M18 70h8M134 72h8', ...SW(3) }, 'green', { stroke: true })
  ],
  voto: [
    ground(),
    s('rect', { x: 60, y: 22, width: 40, height: 52, rx: 2, transform: 'rotate(-8 80 48)' }, 'white'),
    s('rect', { x: 60, y: 22, width: 40, height: 52, rx: 2, transform: 'rotate(-8 80 48)', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M68 46l9 9 15-17', ...SW(5) }, 'green', { stroke: true }),
    s('rect', { x: 28, y: 68, width: 104, height: 12, rx: 3 }, 'navy'),
    s('path', { d: 'M56 74h48', ...SW(4) }, 'dark', { stroke: true }),
    s('rect', { x: 32, y: 80, width: 96, height: 56, rx: 4 }, 'blue', { accent: true })
  ],
  alma: [
    s('path', { d: 'M62 82Q34 50 14 62q12 8 6 18 14 2 12 14 16 2 30-12z' }, 'sky'),
    s('path', { d: 'M98 82q28-32 48-20-12 8-6 18-14 2-12 14-16 2-30-12z' }, 'sky'),
    s('path', { d: 'M80 126c-28-18-36-32-36-46a17 17 0 0 1 36-8 17 17 0 0 1 36 8c0 14-8 28-36 46z' }, 'pink', { accent: true }),
    s('ellipse', { cx: 80, cy: 40, rx: 24, ry: 7, ...SW(5) }, 'yellow', { stroke: true }),
    s('path', { d: 'M30 116l3 7 7 3-7 3-3 7-3-7-7-3 7-3zM128 112l3 7 7 3-7 3-3 7-3-7-7-3 7-3z' }, 'yellow')
  ],
  asunto: [
    s('rect', { x: 14, y: 112, width: 132, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M24 122v18M136 122v18', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: rects([[40, 100, 66, 12], [46, 88, 66, 12], [38, 76, 66, 12], [48, 64, 66, 12], [42, 52, 66, 12]]) }, 'cream'),
    s('path', { d: rects([[40, 100, 66, 12], [46, 88, 66, 12], [38, 76, 66, 12], [48, 64, 66, 12], [42, 52, 66, 12]]), ...SW(2) }, 'gray', { stroke: true }),
    s('rect', { x: 46, y: 38, width: 66, height: 14, rx: 2 }, 'orange', { accent: true }),
    s('path', { d: 'M126 52q6 10 0 14-6-4 0-14zM132 30q5 8 0 12-5-4 0-12z' }, 'sky')
  ],
  completamente: [
    s('rect', { x: 20, y: 48, width: 108, height: 64, rx: 10, ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 130, y: 66, width: 12, height: 28, rx: 3 }, 'dark'),
    s('path', { d: rects([[30, 58, 20, 44], [54, 58, 20, 44], [78, 58, 20, 44], [102, 58, 18, 44]]) }, 'green', { accent: true }),
    s('path', { d: 'M74 14 64 36h14l-8 22', ...SW(4) }, 'yellow', { stroke: true })
  ],
  conocimiento: [
    s('rect', { x: 24, y: 114, width: 100, height: 18, rx: 3 }, 'blue'),
    s('rect', { x: 34, y: 96, width: 92, height: 18, rx: 3 }, 'red'),
    s('rect', { x: 22, y: 78, width: 96, height: 18, rx: 3 }, 'green'),
    s('path', { d: 'M30 123h86M42 105h76M30 87h80', ...SW(2) }, 'white', { stroke: true }),
    s('circle', { cx: 72, cy: 42, r: 20 }, 'yellow', { accent: true }),
    s('rect', { x: 64, y: 58, width: 16, height: 14, rx: 2 }, 'gray'),
    s('path', { d: 'M72 10v6M42 22l5 5M102 22l-5 5M34 44h6M104 44h6', ...SW(4) }, 'orange', { stroke: true })
  ],
  marcha: [
    ground(),
    s('path', { d: 'M34 104 26 136M42 104l10 32M76 104l-8 32M84 104l10 32M118 104l-8 32M126 104l10 32', ...SW(6) }, 'navy', { stroke: true }),
    s('path', { d: rects([[26, 74, 24, 34], [68, 74, 24, 34], [110, 74, 24, 34]]) }, 'orange'),
    s('path', { d: dots([[38, 62], [80, 62], [122, 62]], 11) }, 'skin'),
    s('path', { d: 'M50 80 58 34M92 80l8-46', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 42, y: 16, width: 32, height: 22, rx: 2 }, 'red', { accent: true }),
    s('rect', { x: 84, y: 16, width: 32, height: 22, rx: 2 }, 'yellow')
  ],
  'tecnología': [
    s('path', { d: 'M50 30V16M70 30V16M90 30V16M110 30V16M50 130v14M70 130v14M90 130v14M110 130v14M30 50H16M30 70H16M30 90H16M30 110H16M130 50h14M130 70h14M130 90h14M130 110h14', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 30, y: 30, width: 100, height: 100, rx: 8 }, 'dark'),
    s('rect', { x: 52, y: 52, width: 56, height: 56, rx: 4 }, 'blue', { accent: true }),
    s('path', { d: 'M64 80h32M80 64v32', ...SW(3) }, 'sky', { stroke: true })
  ],
  conjunto: [
    s('ellipse', { cx: 80, cy: 80, rx: 64, ry: 52 }, 'mint'),
    s('ellipse', { cx: 80, cy: 80, rx: 64, ry: 52, ...SW(4) }, 'green', { stroke: true, accent: true }),
    s('path', { d: dots([[50, 62], [80, 52], [110, 66]], 10) }, 'blue'),
    s('path', { d: star(54, 100, 12) }, 'yellow'),
    s('rect', { x: 74, y: 86, width: 22, height: 22, rx: 2 }, 'red'),
    s('path', { d: 'M104 110l12-22 12 22z' }, 'orange')
  ],
  democracia: [
    ground(),
    s('path', { d: 'M48 104 54 60M92 104l6-44M136 104l4-44', ...SW(6) }, 'skin', { stroke: true }),
    ...person(36, 136, 'blue', { h: 40, w: 26 }),
    ...person(80, 136, 'red', { h: 40, w: 26, accent: true }),
    ...person(124, 136, 'yellow', { h: 40, w: 26 })
  ],
  don: [
    s('rect', { x: 36, y: 80, width: 88, height: 56, rx: 3 }, 'red', { accent: true }),
    s('rect', { x: 30, y: 66, width: 100, height: 18, rx: 3 }, 'pink'),
    s('rect', { x: 72, y: 66, width: 16, height: 70 }, 'yellow'),
    s('path', { d: 'M80 66c-16-20-38-14-28 0zM80 66c16-20 38-14 28 0z' }, 'yellow'),
    s('path', { d: star(128, 32, 12) }, 'yellow'),
    s('path', { d: star(34, 38, 8) }, 'orange')
  ],
  fe: [
    s('circle', { cx: 80, cy: 46, r: 34 }, 'yellow', { flatOnly: true, }),
    s('ellipse', { cx: 80, cy: 134, rx: 42, ry: 8 }, 'brown'),
    s('rect', { x: 60, y: 66, width: 40, height: 68, rx: 4 }, 'cream'),
    s('rect', { x: 60, y: 66, width: 40, height: 68, rx: 4, ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M80 66v-8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 20c12 14 14 24 14 30a14 14 0 0 1-28 0c0-6 2-16 14-30z' }, 'orange', { accent: true }),
    s('path', { d: 'M80 36c5 7 6 12 6 16a6 6 0 0 1-12 0c0-4 1-9 6-16z' }, 'cream')
  ],
  'género': [
    s('circle', { cx: 52, cy: 62, r: 24, ...SW(10) }, 'pink', { stroke: true }),
    s('path', { d: 'M52 86v44M36 112h32', ...SW(10) }, 'pink', { stroke: true }),
    s('circle', { cx: 104, cy: 94, r: 24, ...SW(10) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M121 77l20-20M122 56h20v20', ...SW(10) }, 'blue', { stroke: true })
  ],
  muerto: [
    ground(),
    s('path', { d: 'M34 136V68a32 32 0 0 1 64 0v68z' }, 'gray', { accent: true }),
    s('path', { d: 'M66 58v44M52 72h28', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M24 136l4-10 4 10M100 136l4-10 4 10', ...SW(3) }, 'green', { stroke: true }),
    ...flower(124, 98, 'pink')
  ],
  'nación': [
    s('rect', { x: 18, y: 136, width: 26, height: 8, rx: 2 }, 'gray'),
    s('path', { d: 'M31 140V18', ...SW(6) }, 'dark', { stroke: true }),
    s('circle', { cx: 31, cy: 15, r: 5 }, 'yellow'),
    s('path', { d: 'M31 22q28-12 56 0t56 0v66q-28 12-56 0t-56 0z' }, 'green', { accent: true }),
    s('path', { d: 'M31 44q28-12 56 0t56 0v22q-28 12-56 0t-56 0z' }, 'white'),
    s('path', { d: star(87, 55, 11) }, 'red')
  ],
  negocio: [
    s('path', { d: 'M12 110 60 86', ...SW(20) }, 'navy', { stroke: true }),
    s('path', { d: 'M148 110 100 86', ...SW(20) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 80, cy: 82, rx: 26, ry: 15 }, 'skin'),
    s('path', { d: 'M68 72v18M77 69v22M86 69v22M95 72v16', ...SW(3) }, 'tan', { stroke: true }),
    s('circle', { cx: 80, cy: 38, r: 15 }, 'yellow', { accent: true }),
    s('path', { d: 'M80 30v16', ...SW(4) }, 'orange', { stroke: true })
  ],
  particular: [
    s('path', { d: 'M72 22h16l26 104H46z' }, 'cream'),
    s('rect', { x: 68, y: 12, width: 24, height: 12, rx: 3 }, 'dark'),
    s('path', { d: busts([24, 48, 112, 136], 130, 20, 24) }, 'gray'),
    s('path', { d: dots([[24, 98], [48, 98], [112, 98], [136, 98]], 9) }, 'gray'),
    s('path', { d: busts([80], 130, 26, 32) }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 86, r: 11 }, 'skin')
  ],
  posibilidad: [
    s('rect', { x: 46, y: 20, width: 72, height: 116 }, 'dark'),
    s('path', { d: 'M78 20h40v116H78z' }, 'yellow', { accent: true }),
    s('path', { d: 'M78 136l-34 10h102l-28-10z' }, 'cream'),
    s('path', { d: 'M46 20l32 10v98l-32 8z' }, 'brown'),
    s('circle', { cx: 70, cy: 84, r: 3.5 }, 'yellow'),
    s('path', { d: 'M132 30l6-6M138 52h8M24 52h8M28 30l-6-6', ...SW(3) }, 'orange', { stroke: true })
  ],
  profesional: [
    s('circle', { cx: 70, cy: 44, r: 14 }, 'skin'),
    s('path', { d: 'M56 42a14 14 0 0 1 28 0q-14-8-28 0z' }, 'dark'),
    s('path', { d: 'M90 74q14 16 14 30', ...SW(8) }, 'navy', { stroke: true }),
    s('rect', { x: 50, y: 60, width: 40, height: 76, rx: 12 }, 'navy'),
    s('path', { d: 'M62 60l8 22 8-22z' }, 'white'),
    s('path', { d: 'M70 64l-4 5 4 24 4-24z' }, 'red', { accent: true }),
    s('rect', { x: 76, y: 92, width: 10, height: 13, rx: 2 }, 'sky'),
    s('path', { d: 'M108 104v-6h16v6', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 98, y: 104, width: 38, height: 30, rx: 3 }, 'brown')
  ],
  'régimen': [
    s('circle', { cx: 80, cy: 76, r: 52 }, 'white'),
    s('circle', { cx: 80, cy: 76, r: 52, ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 76, r: 38, ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M56 88q10-28 32-26-4 24-32 26z' }, 'green', { accent: true }),
    s('circle', { cx: 96, cy: 88, r: 10 }, 'red'),
    s('path', { d: 'M18 40v60M12 40v18q6 8 12 0V40M142 40v60', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M22 140q58-16 116 0', ...SW(9) }, 'yellow', { stroke: true }),
    s('path', { d: 'M40 134v6M58 130v6M76 129v6M94 129v6M112 131v6', ...SW(2) }, 'dark', { stroke: true })
  ],
  visita: [
    ground(),
    s('rect', { x: 22, y: 26, width: 62, height: 110 }, 'brown'),
    s('rect', { x: 28, y: 32, width: 50, height: 104 }, 'tan'),
    s('circle', { cx: 70, cy: 86, r: 4 }, 'yellow'),
    s('circle', { cx: 94, cy: 64, r: 5 }, 'yellow'),
    s('path', { d: 'M88 48q6-8 12 0M84 40q10-14 20 0', ...SW(3) }, 'orange', { stroke: true }),
    ...person(118, 136, 'purple', { accent: true }),
    s('path', { d: 'M132 98l10-22', ...SW(6) }, 'skin', { stroke: true })
  ],
  ambiente: [
    ground(),
    s('path', { d: rects([[26, 96, 8, 40], [126, 96, 8, 40]]) }, 'brown'),
    s('path', { d: dots([[30, 80], [130, 80]], 18) }, 'green'),
    ...person(80, 136, 'orange', { accent: true, w: 26 }),
    s('path', { d: 'M48 40q14-10 28 0t28 0M58 56q10-6 20 0', ...SW(4) }, 'sky', { stroke: true }),
    s('circle', { cx: 126, cy: 30, r: 10 }, 'yellow')
  ],
  ataque: [
    s('path', { d: 'M84 50h56M84 70h56M84 90h56M84 110h56M96 40v96M110 40v96M124 40v96', ...SW(1.5) }, 'gray', { stroke: true }),
    s('path', { d: 'M82 136V40h60v96', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M14 112h22M18 98h16M14 84h14', ...SW(4) }, 'orange', { stroke: true, accent: true }),
    s('circle', { cx: 54, cy: 94, r: 17 }, 'white'),
    s('circle', { cx: 54, cy: 94, r: 17, ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 87l7 5-3 8h-8l-3-8z' }, 'dark')
  ],
  federal: [
    ground(),
    s('path', { d: rects([[20, 96, 120, 40], [46, 80, 68, 16]]) }, 'cream'),
    s('path', { d: rects([[20, 96, 120, 40], [46, 80, 68, 16]]), ...SW(2) }, 'brown', { stroke: true }),
    s('path', { d: 'M32 104v28M48 104v28M64 104v28M96 104v28M112 104v28M128 104v28', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 72, y: 110, width: 16, height: 26 }, 'brown'),
    s('path', { d: 'M50 80a30 30 0 0 1 60 0z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 50V30', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: star(80, 26, 7) }, 'yellow')
  ],
  'protección': [
    ground(),
    s('path', { d: 'M24 24l-4 10M44 16l-4 10M118 16l-4 10M138 24l-4 10M18 52l-4 10M146 52l-4 10', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M80 30v-8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M90 70v38q0 6-6 6', ...SW(4) }, 'dark', { stroke: true }),
    ...person(70, 136, 'blue', { h: 38 }),
    s('path', { d: 'M28 72a52 44 0 0 1 104 0q-13-8-26 0-13-8-26 0-13-8-26 0-13-8-26 0z' }, 'red', { accent: true })
  ],
  publicar: [
    s('path', { d: 'M50 92v26', ...SW(8) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 70l56-30v84l-56-30z' }, 'red', { accent: true }),
    s('rect', { x: 22, y: 64, width: 20, height: 32, rx: 4 }, 'gray'),
    s('path', { d: 'M110 30l24 6-6 26-24-6zM112 96l26-4 4 26-26 4z' }, 'white'),
    s('path', { d: 'M110 30l24 6-6 26-24-6zM112 96l26-4 4 26-26 4z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M104 74h22M100 80l-4 0', ...SW(4) }, 'orange', { stroke: true })
  ],
  sala: [
    s('rect', { x: 58, y: 20, width: 44, height: 30, rx: 2 }, 'sky'),
    s('rect', { x: 58, y: 20, width: 44, height: 30, rx: 2, ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M30 122v12M130 122v12', ...SW(5) }, 'brown', { stroke: true }),
    s('rect', { x: 28, y: 64, width: 104, height: 42, rx: 10 }, 'red', { accent: true }),
    s('rect', { x: 28, y: 98, width: 104, height: 24, rx: 4 }, 'pink'),
    s('path', { d: rects([[14, 82, 22, 42], [124, 82, 22, 42]]) }, 'red'),
    s('path', { d: 'M80 70v26', ...SW(2) }, 'pink', { stroke: true })
  ],
  transporte: [
    s('path', { d: 'M14 132h132', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 16, y: 46, width: 128, height: 74, rx: 14 }, 'blue', { accent: true }),
    s('path', { d: rects([[28, 58, 22, 24], [58, 58, 22, 24], [88, 58, 22, 24], [118, 58, 16, 24]]) }, 'white'),
    s('rect', { x: 16, y: 94, width: 128, height: 7 }, 'yellow'),
    s('path', { d: dots([[38, 122], [60, 122], [100, 122], [122, 122]], 8) }, 'dark')
  ],
  usuario: [
    s('rect', { x: 18, y: 20, width: 124, height: 120, rx: 10 }, 'white'),
    s('rect', { x: 18, y: 20, width: 124, height: 120, rx: 10, ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 54, r: 22 }, 'sky'),
    s('path', { d: 'M71 48a9 9 0 1 0 18 0a9 9 0 1 0-18 0zM64 72a16 13 0 0 1 32 0z' }, 'blue', { accent: true }),
    s('path', { d: rects([[36, 88, 88, 16], [36, 110, 88, 16]]), ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: dots([[48, 118], [60, 118], [72, 118], [84, 118]], 3.5) }, 'dark')
  ],
  acto: [
    s('rect', { x: 14, y: 20, width: 132, height: 100 }, 'navy'),
    s('rect', { x: 14, y: 118, width: 132, height: 20 }, 'brown'),
    s('ellipse', { cx: 80, cy: 120, rx: 26, ry: 5 }, 'yellow'),
    ...person(80, 120, 'green', { h: 34, w: 24, r: 11 }),
    s('path', { d: 'M14 20h40q-10 50 0 100H14zM146 20h-40q10 50 0 100h40z' }, 'red', { accent: true }),
    s('path', { d: 'M14 20h132v14q-11 8-22 0-11 8-22 0-11 8-22 0-11 8-22 0-11 8-22 0-11 8-22 0z' }, 'yellow')
  ],
  'asociación': [
    s('path', { d: 'M80 88 80 42M80 88 30 78M80 88l50-10M80 88 50 132M80 88l30 44', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 88, r: 16 }, 'orange', { accent: true }),
    s('path', { d: busts([80], 52, 22, 18) + busts([30, 130], 90, 22, 18) + busts([50, 110], 144, 22, 18) }, 'blue'),
    s('path', { d: dots([[80, 26], [30, 64], [130, 64], [50, 118], [110, 118]], 9) }, 'skin')
  ],
  completo: [
    s('rect', { x: 24, y: 24, width: 56, height: 56 }, 'blue'),
    s('rect', { x: 80, y: 24, width: 56, height: 56 }, 'green'),
    s('rect', { x: 24, y: 80, width: 56, height: 56 }, 'yellow'),
    s('circle', { cx: 80, cy: 52, r: 9 }, 'blue'),
    s('circle', { cx: 52, cy: 80, r: 9 }, 'blue'),
    s('rect', { x: 80, y: 80, width: 56, height: 56 }, 'orange', { accent: true }),
    s('circle', { cx: 108, cy: 80, r: 9 }, 'orange'),
    s('path', { d: 'M80 24v112M24 80h112', ...SW(2) }, 'white', { stroke: true }),
    s('path', { d: 'M140 14l3 7 7 3-7 3-3 7-3-7-7-3 7-3z' }, 'yellow')
  ],
  cuidado: [
    s('ellipse', { cx: 80, cy: 140, rx: 62, ry: 7 }, 'sky'),
    s('path', { d: 'M58 26h44l24 110H34z' }, 'yellow', { accent: true }),
    s('path', { d: 'M58 26h44l24 110H34z', ...SW(3) }, 'orange', { stroke: true }),
    s('rect', { x: 75, y: 52, width: 10, height: 42, rx: 4 }, 'dark'),
    s('circle', { cx: 80, cy: 108, r: 6 }, 'dark')
  ],
  deseo: [
    s('path', { d: 'M20 136h120', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 30, y: 92, width: 100, height: 44, rx: 6 }, 'pink'),
    s('path', { d: 'M30 100q0-8 8-8h84q8 0 8 8q-10 10-20 0t-20 0t-20 0t-20 0t-20 0z' }, 'cream'),
    s('path', { d: rects([[52, 64, 8, 28], [76, 64, 8, 28], [100, 64, 8, 28]]) }, 'sky'),
    s('path', { d: dots([[56, 56], [80, 56], [104, 56]], 5) }, 'orange'),
    s('path', { d: star(124, 28, 13) }, 'yellow', { accent: true }),
    s('path', { d: 'M30 30l3 6 6 3-6 3-3 6-3-6-6-3 6-3z' }, 'yellow')
  ],
  directamente: [
    s('circle', { cx: 112, cy: 80, r: 32 }, 'red'),
    s('circle', { cx: 112, cy: 80, r: 21 }, 'white'),
    s('circle', { cx: 112, cy: 80, r: 10 }, 'red', { accent: true }),
    s('path', { d: 'M20 80h86', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M112 80l-16-9v18z' }, 'dark'),
    s('path', { d: 'M22 80l-8-8M22 80l-8 8M32 80l-8-8M32 80l-8 8', ...SW(3) }, 'orange', { stroke: true })
  ],
  doctor: [
    s('circle', { cx: 80, cy: 40, r: 16 }, 'skin'),
    s('path', { d: 'M64 38a16 16 0 0 1 32 0q-16-10-32 0z' }, 'dark'),
    s('rect', { x: 50, y: 58, width: 60, height: 80, rx: 14 }, 'white'),
    s('rect', { x: 50, y: 58, width: 60, height: 80, rx: 14, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M68 58l12 22 12-22z' }, 'sky'),
    s('path', { d: 'M66 62v18q0 14 14 14t14-14V62', ...SW(3) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 98, r: 5 }, 'gray'),
    s('path', { d: 'M90 116h14M97 109v14', ...SW(4) }, 'red', { stroke: true, accent: true })
  ],
  'edición': [
    s('rect', { x: 46, y: 16, width: 84, height: 112, rx: 4 }, 'sky'),
    s('rect', { x: 30, y: 26, width: 84, height: 112, rx: 4 }, 'blue'),
    s('rect', { x: 30, y: 26, width: 12, height: 112 }, 'navy'),
    s('rect', { x: 54, y: 46, width: 48, height: 10, rx: 2 }, 'white'),
    s('path', { d: 'M54 64h34', ...SW(4) }, 'sky', { stroke: true }),
    s('path', { d: burst(116, 106, 28, 21, 12) }, 'yellow', { accent: true }),
    s('path', { d: star(116, 106, 9) }, 'red')
  ],
  informe: [
    s('rect', { x: 30, y: 22, width: 100, height: 122, rx: 8 }, 'brown'),
    s('rect', { x: 40, y: 36, width: 80, height: 98, rx: 2 }, 'white'),
    s('rect', { x: 62, y: 16, width: 36, height: 14, rx: 4 }, 'gray'),
    s('path', { d: 'M52 50h56M52 60h40', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: rects([[54, 98, 12, 24], [74, 84, 12, 38], [94, 70, 12, 52]]) }, 'blue', { accent: true }),
    s('path', { d: 'M48 122h64', ...SW(2) }, 'dark', { stroke: true })
  ],
  material: [
    ground(),
    s('path', { d: rects([[16, 122, 32, 14], [50, 122, 32, 14], [33, 108, 32, 14]]) }, 'red'),
    s('path', { d: rects([[16, 122, 32, 14], [50, 122, 32, 14], [33, 108, 32, 14]]), ...SW(2) }, 'cream', { stroke: true }),
    s('path', { d: rects([[90, 112, 54, 8], [90, 120, 54, 8], [90, 128, 54, 8]]) }, 'tan'),
    s('path', { d: rects([[90, 112, 54, 8], [90, 120, 54, 8], [90, 128, 54, 8]]), ...SW(2) }, 'brown', { stroke: true }),
    s('rect', { x: 34, y: 50, width: 84, height: 36, rx: 18 }, 'purple', { accent: true }),
    s('ellipse', { cx: 112, cy: 68, rx: 10, ry: 18 }, 'pink'),
    s('circle', { cx: 112, cy: 68, r: 4 }, 'dark')
  ],
  venta: [
    s('path', { d: 'M110 46q24-24 32-8', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M22 82 74 30h54v54l-52 52z' }, 'red', { accent: true }),
    s('circle', { cx: 110, cy: 46, r: 7 }, 'white'),
    s('path', { d: 'M94 70 58 106', ...SW(5) }, 'white', { stroke: true }),
    s('path', { d: dots([[62, 74], [90, 102]], 7) }, 'white')
  ],
  confianza: [
    s('path', { d: 'M30 112 14 134M130 112l16 22', ...SW(16) }, 'blue', { stroke: true }),
    s('path', { d: 'M22 94q4 38 58 38t58-38q-6-8-16-2-10 18-42 18t-42-18q-10-6-16 2z' }, 'skin'),
    s('path', { d: 'M38 108q8 6 14 8M122 108q-8 6-14 8', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M80 98c-26-16-32-29-32-40a15 15 0 0 1 32-7 15 15 0 0 1 32 7c0 11-6 24-32 40z' }, 'red', { accent: true }),
    s('path', { d: 'M80 18v8M50 26l5 6M110 26l-5 6', ...SW(3) }, 'yellow', { stroke: true })
  ],
  'creación': [
    s('path', { d: 'M14 112 42 92M146 112l-28-20', ...SW(9) }, 'skin', { stroke: true }),
    s('rect', { x: 66, y: 118, width: 28, height: 22 }, 'dark'),
    s('ellipse', { cx: 80, cy: 118, rx: 54, ry: 10 }, 'gray'),
    s('path', { d: 'M58 116q-6-24 10-36 4-6 2-16h20q-2 10 2 16 16 12 10 36z' }, 'brown', { accent: true }),
    s('path', { d: 'M68 64h24', ...SW(3) }, 'tan', { stroke: true }),
    s('ellipse', { cx: 48, cy: 90, rx: 12, ry: 9 }, 'skin'),
    s('ellipse', { cx: 112, cy: 90, rx: 12, ry: 9 }, 'skin'),
    s('path', { d: 'M80 22l3 8 8 3-8 3-3 8-3-8-8-3 8-3z' }, 'yellow')
  ],
  destino: [
    s('path', { d: 'M14 136l30-36 22 20 28-34 52 50z' }, 'mint'),
    s('path', { d: 'M24 136C60 136 40 96 76 96S100 70 112 66', ...SW(4, { 'stroke-dasharray': '6 7' }) }, 'gray', { stroke: true }),
    s('circle', { cx: 24, cy: 136, r: 6 }, 'blue'),
    s('path', { d: 'M112 66c-12-14-18-23-18-31a18 18 0 0 1 36 0c0 8-6 17-18 31z' }, 'red', { accent: true }),
    s('circle', { cx: 112, cy: 35, r: 7 }, 'white')
  ],
  especie: [
    s('path', { d: 'M28 56 14 44v24z' }, 'blue'),
    s('ellipse', { cx: 48, cy: 56, rx: 22, ry: 13 }, 'blue'),
    s('circle', { cx: 114, cy: 54, r: 16 }, 'red', { accent: true }),
    s('path', { d: 'M129 51l10 4-10 4z' }, 'orange'),
    s('path', { d: 'M52 128h58q10 0 10-14v-6', ...SW(9) }, 'tan', { stroke: true }),
    s('circle', { cx: 78, cy: 108, r: 20 }, 'orange'),
    s('path', { d: 'M78 108m-3 0a3 3 0 1 1 6 0a7 7 0 1 1-14 0a11 11 0 1 1 22 0', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: dots([[60, 52], [118, 50], [120, 104]], 3) }, 'dark')
  ],
  legal: [
    s('rect', { x: 34, y: 18, width: 84, height: 116, rx: 3 }, 'white'),
    s('rect', { x: 34, y: 18, width: 84, height: 116, rx: 3, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M46 38h60M46 50h60M46 62h42', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M48 92l12 12 24-28', ...SW(7) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M106 126l-6 18 10-4 6 8 2-18zM126 126l6 18-10-4-6 8-2-18z' }, 'red'),
    s('circle', { cx: 116, cy: 116, r: 18 }, 'red'),
    s('circle', { cx: 116, cy: 116, r: 11, ...SW(2) }, 'pink', { stroke: true })
  ],
  obtener: [
    s('rect', { x: 64, y: 108, width: 32, height: 40, rx: 4 }, 'blue'),
    s('rect', { x: 70, y: 66, width: 20, height: 46 }, 'skin'),
    s('path', { d: star(80, 40, 28) }, 'yellow', { accent: true }),
    s('rect', { x: 62, y: 50, width: 36, height: 28, rx: 11 }, 'skin'),
    s('path', { d: 'M71 52v10M80 52v10M89 52v10', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M24 30l8 4M136 30l-8 4M26 64h10M124 64h10', ...SW(3) }, 'orange', { stroke: true })
  ],
  propuesta: [
    s('path', { d: 'M88 136l10-60M138 136l-10-60M113 76v60', ...SW(4) }, 'brown', { stroke: true }),
    s('rect', { x: 78, y: 22, width: 68, height: 58, rx: 3 }, 'white'),
    s('rect', { x: 78, y: 22, width: 68, height: 58, rx: 3, ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 112, cy: 44, r: 13 }, 'yellow', { accent: true }),
    s('rect', { x: 106, y: 57, width: 12, height: 9, rx: 2 }, 'gray'),
    ...person(38, 136, 'blue'),
    s('path', { d: 'M50 98 78 72', ...SW(6) }, 'skin', { stroke: true })
  ],
  responsabilidad: [
    ground(),
    s('path', { d: 'M68 100 58 62M92 100l10-38', ...SW(6) }, 'skin', { stroke: true }),
    ...person(80, 136, 'green', { h: 40, accent: true }),
    s('rect', { x: 34, y: 22, width: 92, height: 42, rx: 3 }, 'brown'),
    s('path', { d: 'M80 22v42M34 40h92', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M114 78q5 8 0 12-5-4 0-12z' }, 'sky')
  ],
  'solución': [
    s('path', { d: 'M52 72V44a22 22 0 0 1 44 0v4', ...SW(10) }, 'gray', { stroke: true }),
    s('rect', { x: 36, y: 70, width: 80, height: 66, rx: 8 }, 'yellow', { accent: true }),
    s('circle', { cx: 76, cy: 96, r: 7 }, 'dark'),
    s('path', { d: 'M76 100v16', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M82 102h40', ...SW(6) }, 'gray', { stroke: true }),
    s('circle', { cx: 132, cy: 102, r: 10, ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 30l8 8 16-18', ...SW(5) }, 'green', { stroke: true })
  ],
  territorio: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 10 }, 'sky'),
    s('path', { d: 'M28 64q10-32 48-32t52 22q12 32-6 58t-52 26q-34-4-42-34-4-22 0-40z' }, 'green'),
    s('path', { d: 'M48 66q22-18 52-6t10 42q-20 24-50 14t-12-50z', ...SW(3, { 'stroke-dasharray': '6 5' }) }, 'red', { stroke: true }),
    s('path', { d: 'M78 96V56', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M78 56h24l-6 7 6 7H78z' }, 'red', { accent: true })
  ],
  'vídeo': [
    s('rect', { x: 14, y: 26, width: 132, height: 92, rx: 8 }, 'dark'),
    s('rect', { x: 22, y: 34, width: 116, height: 76, rx: 4 }, 'sky'),
    s('circle', { cx: 80, cy: 72, r: 22 }, 'red', { accent: true }),
    s('path', { d: 'M73 60l18 12-18 12z' }, 'white'),
    s('path', { d: 'M20 134h120', ...SW(5) }, 'gray', { stroke: true }),
    s('path', { d: 'M20 134h50', ...SW(5) }, 'red', { stroke: true })
  ],
  'aplicación': [
    s('rect', { x: 44, y: 14, width: 72, height: 132, rx: 12 }, 'dark'),
    s('rect', { x: 50, y: 26, width: 60, height: 106, rx: 4 }, 'sky'),
    s('path', { d: rects([[56, 34, 14, 14], [74, 34, 14, 14], [92, 34, 14, 14], [56, 52, 14, 14], [92, 52, 14, 14], [56, 70, 14, 14], [74, 70, 14, 14], [92, 70, 14, 14]]) }, 'blue'),
    s('rect', { x: 74, y: 52, width: 14, height: 14 }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 139, r: 3 }, 'gray')
  ],
  aumento: [
    s('path', { d: rects([[26, 104, 20, 32], [54, 88, 20, 48], [82, 70, 20, 66], [110, 50, 20, 86]]) }, 'green'),
    s('path', { d: 'M18 136h126', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 86 58 64l22 8 46-44', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M110 26h18v18', ...SW(6) }, 'red', { stroke: true })
  ],
  distancia: [
    ground(),
    s('path', { d: 'M42 126h76', ...SW(3, { 'stroke-dasharray': '5 6' }) }, 'gray', { stroke: true }),
    ...person(26, 136, 'blue', { h: 36, w: 22, r: 10 }),
    ...person(134, 136, 'red', { h: 36, w: 22, r: 10 }),
    s('path', { d: 'M44 70h72M54 60 44 70l10 10M106 60l10 10-10 10', ...SW(5) }, 'orange', { stroke: true, accent: true })
  ],
  doble: [
    ground(),
    ...person(54, 136, 'orange', { accent: true }),
    s('circle', { cx: 106, cy: 78, r: 12, ...SW(3, { 'stroke-dasharray': '5 4' }) }, 'dark', { stroke: true }),
    s('rect', { x: 91, y: 92, width: 30, height: 44, rx: 10, ...SW(3, { 'stroke-dasharray': '5 4' }) }, 'dark', { stroke: true }),
    arrow('M66 40q14-14 28 0m-8 1 8-1-1-8', 'blue', 4)
  ],
  marca: [
    s('path', { d: 'M60 56V44a20 20 0 0 1 40 0v12', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M34 54h92l8 86H26z' }, 'purple'),
    s('circle', { cx: 80, cy: 98, r: 22 }, 'white'),
    s('path', { d: star(80, 98, 15) }, 'orange', { accent: true })
  ],
  memoria: [
    s('path', { d: 'M34 142v-22q-14-10-14-34 0-30 30-32 28-2 34 22l8 16-8 3v10q0 8-8 8H66v29z' }, 'skin'),
    s('path', { d: dots([[86, 74]], 5) + dots([[96, 62]], 7) }, 'gray'),
    s('circle', { cx: 116, cy: 40, r: 28 }, 'white'),
    s('circle', { cx: 116, cy: 40, r: 28, ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M96 54l12-16 9 10 6-6 12 12z' }, 'green', { accent: true }),
    s('circle', { cx: 124, cy: 28, r: 5 }, 'orange')
  ],
  mente: [
    s('path', { d: 'M46 144v-28q-24-12-24-46 0-44 46-48 42-2 52 34l10 22-10 4v16q0 12-14 12h-14v34z' }, 'sky'),
    s('path', { d: burst(72, 62, 22, 16, 8) }, 'orange', { accent: true }),
    s('circle', { cx: 72, cy: 62, r: 7 }, 'sky'),
    s('path', { d: burst(96, 90, 15, 10, 7) }, 'yellow'),
    s('circle', { cx: 96, cy: 90, r: 5 }, 'sky')
  ],
  motivo: [
    ground(),
    s('path', { d: rects([[66, 80, 14, 56], [92, 80, 14, 56], [118, 80, 14, 56]]) }, 'dark'),
    s('path', { d: dots([[73, 96], [73, 120], [99, 96], [99, 120], [125, 96], [125, 120]], 3) }, 'white'),
    s('rect', { x: 34, y: 80, width: 14, height: 56, transform: 'rotate(28 48 136)' }, 'red', { accent: true }),
    arrow('M18 66q8-18 26-16m-8-6 8 6-6 8', 'orange', 4)
  ],
  'opción': [
    s('path', { d: 'M80 144 36 104M80 144l44-40', ...SW(12) }, 'tan', { stroke: true }),
    s('path', { d: 'M80 140V30', ...SW(8) }, 'brown', { stroke: true }),
    s('path', { d: 'M30 40h44v22H30l-12-11z' }, 'blue'),
    s('path', { d: 'M86 70h44l12 11-12 11H86z' }, 'orange', { accent: true })
  ],
  'práctica': [
    ground(),
    s('path', { d: 'M20 120q10-20 22 0t22 0t22 0', ...SW(3, { 'stroke-dasharray': '4 5' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M22 136l10-28 10 28zM58 136l10-28 10 28zM94 136l10-28 10 28z' }, 'orange', { accent: true }),
    s('path', { d: 'M27 124h10M63 124h10M99 124h10', ...SW(3) }, 'white', { stroke: true }),
    s('circle', { cx: 126, cy: 70, r: 16 }, 'white'),
    s('circle', { cx: 126, cy: 70, r: 16, ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M126 63l7 5-3 8h-8l-3-8z' }, 'dark'),
    s('path', { d: 'M100 74l-10 4M102 62l-10-2', ...SW(3) }, 'gray', { stroke: true })
  ],
  realizar: [
    s('path', { d: 'M24 72a14 14 0 0 1 8-24 18 18 0 0 1 32-8 16 16 0 0 1 12 32z', ...SW(3, { 'stroke-dasharray': '5 5' }) }, 'gray', { stroke: true }),
    s('path', { d: star(50, 58, 10), ...SW(3, { 'stroke-dasharray': '4 3' }) }, 'yellow', { stroke: true }),
    arrow('M56 90q4 30 34 30m-8-8 8 8-8 8', 'orange', 5),
    s('path', { d: star(118, 104, 28) }, 'yellow', { accent: true }),
    s('path', { d: star(118, 104, 28), ...SW(3) }, 'orange', { stroke: true })
  ],
  referencia: [
    s('path', { d: rects([[118, 38, 20, 12]]) }, 'yellow'),
    s('path', { d: rects([[118, 62, 20, 12]]) }, 'pink'),
    s('path', { d: rects([[118, 86, 20, 12]]) }, 'blue', { accent: true }),
    s('rect', { x: 30, y: 24, width: 92, height: 114, rx: 4 }, 'green'),
    s('rect', { x: 30, y: 24, width: 12, height: 114 }, 'dark'),
    s('circle', { cx: 76, cy: 72, r: 20 }, 'sky'),
    s('circle', { cx: 76, cy: 72, r: 20, ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M90 86l18 18', ...SW(8) }, 'dark', { stroke: true })
  ],
  reforma: [
    s('rect', { x: 14, y: 22, width: 132, height: 114 }, 'gray'),
    s('rect', { x: 14, y: 22, width: 74, height: 114 }, 'mint'),
    s('path', { d: 'M110 36l8 10-6 8M132 74l-8 10 4 8M104 106l10 6', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M96 66h22v74', ...SW(5) }, 'dark', { stroke: true }),
    s('rect', { x: 80, y: 44, width: 18, height: 44, rx: 6 }, 'yellow', { accent: true })
  ],
  reino: [
    ground(),
    s('path', { d: rects([[22, 60, 26, 76], [112, 60, 26, 76], [40, 78, 80, 58], [22, 52, 8, 8], [40, 52, 8, 8], [112, 52, 8, 8], [130, 52, 8, 8], [50, 70, 10, 8], [75, 70, 10, 8], [100, 70, 10, 8]]) }, 'gray'),
    s('path', { d: 'M68 136v-26a12 12 0 0 1 24 0v26z' }, 'brown'),
    s('path', { d: 'M35 52V34M125 52V34', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M35 34l14 5-14 5zM125 34l14 5-14 5z' }, 'red'),
    s('path', { d: 'M58 54l6-28 16 14 16-14 6 28z' }, 'yellow', { accent: true })
  ],
  resultar: [
    s('path', { d: 'M36 26h20v30l20 42q4 10-6 10H22q-10 0-6-10l20-42z' }, 'sky'),
    s('path', { d: 'M24 86h44l6 12q2 6-6 6H24q-8 0-6-6z' }, 'purple'),
    s('path', { d: 'M36 26h20v30l20 42q4 10-6 10H22q-10 0-6-10l20-42z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[42, 76], [52, 66]], 4) }, 'purple'),
    arrow('M82 84h16m-8-8 8 8-8 8', 'orange', 5),
    s('circle', { cx: 124, cy: 84, r: 20 }, 'green', { accent: true }),
    s('path', { d: 'M114 84l7 7 13-14', ...SW(5) }, 'white', { stroke: true })
  ],
  riesgo: [
    s('path', { d: 'M14 72h80l-6 18 8 12-10 44H14z' }, 'brown'),
    s('path', { d: 'M14 72h80', ...SW(4) }, 'green', { stroke: true }),
    ...person(76, 72, 'blue', { h: 30, w: 20, r: 9 }),
    s('path', { d: dots([[100, 108], [106, 126]], 4) }, 'gray'),
    s('path', { d: 'M126 22l20 34h-40z' }, 'yellow', { accent: true }),
    s('path', { d: 'M126 34v10', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 126, cy: 50, r: 2.5 }, 'dark')
  ],
  sacar: [
    s('rect', { x: 50, y: 100, width: 60, height: 42 }, 'dark'),
    s('rect', { x: 50, y: 106, width: 60, height: 8 }, 'red', { accent: true }),
    s('path', { d: 'M72 60q-10-30-2-42 8 10 6 42zM88 60q10-30 2-42-8 10-6 42zM62 80a18 18 0 0 1 36 0v20H62z' }, 'white'),
    s('path', { d: 'M72 60q-10-30-2-42 8 10 6 42zM88 60q10-30 2-42-8 10-6 42zM62 80a18 18 0 0 1 36 0v20H62z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: dots([[73, 80], [87, 80]], 2.5) }, 'dark'),
    s('ellipse', { cx: 80, cy: 100, rx: 42, ry: 8 }, 'black'),
    s('path', { d: 'M94 22l42-10', ...SW(10) }, 'blue', { stroke: true }),
    s('ellipse', { cx: 82, cy: 24, rx: 14, ry: 10 }, 'skin')
  ],
  silencio: [
    s('circle', { cx: 80, cy: 72, r: 50 }, 'skin'),
    s('path', { d: 'M54 62q7 6 14 0M92 62q7 6 14 0', ...SW(4) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 80, cy: 98, rx: 14, ry: 6 }, 'pink', { accent: true }),
    s('rect', { x: 74, y: 80, width: 12, height: 46, rx: 6 }, 'skin'),
    s('rect', { x: 64, y: 116, width: 34, height: 30, rx: 10 }, 'skin'),
    s('path', { d: 'M74 80h12v36M64 128h34', ...SW(2) }, 'tan', { stroke: true })
  ],
  temporada: [
    s('path', { d: 'M80 80V22a58 58 0 0 1 58 58z' }, 'green', { accent: true }),
    s('path', { d: 'M80 80h58a58 58 0 0 1-58 58z' }, 'yellow'),
    s('path', { d: 'M80 80v58a58 58 0 0 1-58-58z' }, 'orange'),
    s('path', { d: 'M80 80H22a58 58 0 0 1 58-58z' }, 'sky'),
    s('path', { d: dots([[104, 50], [114, 56], [106, 60]], 5) }, 'pink'),
    s('circle', { cx: 106, cy: 106, r: 10 }, 'orange'),
    s('path', { d: 'M44 118q0-22 22-22 0 22-22 22z' }, 'brown'),
    s('path', { d: 'M54 40v24M44 46l20 12M44 58l20-12', ...SW(3) }, 'white', { stroke: true })
  ],
  autoridad: [
    ground(),
    ...person(76, 136, 'navy', { h: 50, w: 36, r: 13 }),
    s('path', { d: 'M94 98l16-30', ...SW(7) }, 'skin', { stroke: true }),
    s('circle', { cx: 112, cy: 62, r: 9 }, 'skin'),
    s('path', { d: 'M62 68a14 14 0 0 1 28 0z' }, 'navy'),
    s('path', { d: 'M58 69h36', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: star(66, 104, 8) }, 'yellow', { accent: true })
  ],
  comenzar: [
    s('path', { d: dots([[56, 136], [104, 136]], 10) + dots([[80, 140]], 8) }, 'gray'),
    s('path', { d: 'M66 96h28l-14 34z' }, 'orange', { accent: true }),
    s('path', { d: 'M72 96h16l-8 18z' }, 'yellow'),
    s('path', { d: 'M62 74l-14 24h16zM98 74l14 24H96z' }, 'red'),
    s('path', { d: 'M80 16c18 18 22 46 18 80H62c-4-34 0-62 18-80z' }, 'white'),
    s('path', { d: 'M80 16c18 18 22 46 18 80H62c-4-34 0-62 18-80z', ...SW(3) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 54, r: 9 }, 'sky'),
    s('circle', { cx: 80, cy: 54, r: 9, ...SW(3) }, 'blue', { stroke: true })
  ],
  comercio: [
    ground(),
    s('rect', { x: 24, y: 42, width: 112, height: 94 }, 'cream'),
    s('rect', { x: 24, y: 42, width: 112, height: 94, ...SW(2) }, 'brown', { stroke: true }),
    s('rect', { x: 32, y: 78, width: 56, height: 40 }, 'sky'),
    s('path', { d: dots([[44, 110], [58, 110], [72, 110]], 6) }, 'orange'),
    s('rect', { x: 98, y: 76, width: 30, height: 60 }, 'brown'),
    s('path', { d: 'M18 36h124l-4 22q-10 8-20 0-10 8-20 0-10 8-20 0-10 8-20 0-10 8-20 0-10 8-20 0z' }, 'red', { accent: true }),
    s('path', { d: 'M42 36v22M62 36v22M82 36v22M102 36v22M122 36v22', ...SW(5) }, 'white', { stroke: true })
  ],
  'daño': [
    ground(140),
    s('path', { d: 'M70 32A48 48 0 0 0 70 128l8-14-8-12 10-14-8-14 8-14-10-12z' }, 'blue', { accent: true }),
    s('path', { d: 'M90 32A48 48 0 0 1 90 128l8-14-8-12 10-14-8-14 8-14-10-12z' }, 'blue'),
    s('path', { d: 'M40 56a36 36 0 0 0 0 48M120 56a36 36 0 0 1 0 48', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M80 18v8M64 20l4 6M96 20l-4 6', ...SW(3) }, 'orange', { stroke: true })
  ],
  elemento: [
    s('ellipse', { cx: 80, cy: 80, rx: 60, ry: 20, ...SW(4) }, 'blue', { stroke: true }),
    s('ellipse', { cx: 80, cy: 80, rx: 60, ry: 20, transform: 'rotate(60 80 80)', ...SW(4) }, 'blue', { stroke: true }),
    s('ellipse', { cx: 80, cy: 80, rx: 60, ry: 20, transform: 'rotate(-60 80 80)', ...SW(4) }, 'blue', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 13 }, 'red', { accent: true }),
    s('path', { d: dots([[140, 80], [50, 28], [50, 132]], 6) }, 'orange')
  ],
  esfuerzo: [
    s('path', { d: 'M14 140 146 84v56z' }, 'green'),
    s('path', { d: 'M56 106 42 124M56 106l2 22', ...SW(7) }, 'navy', { stroke: true }),
    s('circle', { cx: 112, cy: 68, r: 24 }, 'gray'),
    s('path', { d: 'M56 106 74 80', ...SW(16) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M74 84l16-8', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 76, cy: 64, r: 10 }, 'skin'),
    s('path', { d: 'M62 50q5 8 0 12-5-4 0-12zM50 62q4 7 0 10-4-3 0-10z' }, 'sky')
  ],
  gratis: [
    s('circle', { cx: 58, cy: 62, r: 26 }, 'yellow'),
    s('circle', { cx: 58, cy: 62, r: 17, ...SW(3) }, 'orange', { stroke: true }),
    s('circle', { cx: 58, cy: 62, r: 36, ...SW(7) }, 'red', { stroke: true }),
    s('path', { d: 'M33 37l50 50', ...SW(7) }, 'red', { stroke: true }),
    s('rect', { x: 92, y: 100, width: 48, height: 38, rx: 3 }, 'green', { accent: true }),
    s('rect', { x: 88, y: 92, width: 56, height: 12, rx: 2 }, 'mint'),
    s('path', { d: 'M116 92v46M116 92c-8-12-20-10-14 0M116 92c8-12 20-10 14 0', ...SW(5) }, 'yellow', { stroke: true })
  ],
  salida: [
    s('rect', { x: 14, y: 36, width: 132, height: 88, rx: 8 }, 'green', { accent: true }),
    s('rect', { x: 98, y: 50, width: 34, height: 60 }, 'white'),
    s('circle', { cx: 60, cy: 54, r: 8 }, 'white'),
    s('path', { d: 'M58 66l-6 22M42 74l12-8 14 8M52 88l-14 12M52 88l12 6 2 14', ...SW(6) }, 'white', { stroke: true }),
    s('path', { d: 'M76 90h14m-6-6 6 6-6 6', ...SW(4) }, 'white', { stroke: true })
  ],
  'selección': [
    s('path', { d: 'M56 24l-38 18 12 28 16-6v76h68V64l16 6 12-28-38-18q-8 12-24 12t-24-12z' }, 'red', { accent: true }),
    s('path', { d: 'M56 24q8 14 24 14t24-14', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M46 84h68', ...SW(8) }, 'white', { stroke: true }),
    s('path', { d: star(80, 62, 10) }, 'yellow'),
    s('path', { d: star(28, 18, 6) + star(132, 18, 6) }, 'yellow')
  ],
  efecto: [
    s('ellipse', { cx: 80, cy: 112, rx: 64, ry: 24 }, 'blue'),
    s('ellipse', { cx: 80, cy: 112, rx: 42, ry: 14, ...SW(3) }, 'sky', { stroke: true }),
    s('ellipse', { cx: 80, cy: 112, rx: 22, ry: 7, ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M62 98l-8-14M98 98l8-14M80 96V80', ...SW(4) }, 'sky', { stroke: true }),
    s('circle', { cx: 80, cy: 46, r: 13 }, 'gray', { accent: true }),
    s('path', { d: 'M70 24l-2-8M90 24l2-8', ...SW(3) }, 'gray', { stroke: true })
  ],
  presencia: [
    ground(),
    s('path', { d: 'M84 100l14-40', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 99, cy: 56, r: 7 }, 'skin'),
    ...person(70, 136, 'blue', { accent: true }),
    s('circle', { cx: 126, cy: 38, r: 18 }, 'green'),
    s('path', { d: 'M117 38l6 6 12-12', ...SW(5) }, 'white', { stroke: true })
  ],
  respeto: [
    ground(),
    s('path', { d: 'M34 104v32M42 104v32', ...SW(7) }, 'navy', { stroke: true }),
    s('path', { d: 'M38 100 66 80', ...SW(24) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M68 88v20', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 84, cy: 88, r: 11 }, 'skin'),
    ...person(126, 136, 'purple'),
    s('path', { d: 'M104 44c-6-4-8-7-8-10a4 4 0 0 1 8-2 4 4 0 0 1 8 2c0 3-2 6-8 10z' }, 'pink')
  ],
  totalmente: [
    s('path', { d: 'M45 32h70l-8 102H53z' }, 'orange', { accent: true }),
    s('path', { d: 'M42 28h76l-9 108H51z', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M116 32q6 12 2 22', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: dots([[66, 70], [92, 96], [74, 116]], 4) }, 'yellow'),
    s('path', { d: 'M74 28 92 8', ...SW(5) }, 'red', { stroke: true })
  ],
  'versión': [
    arrow('M54 46q26-26 52 0m-10 0 10 0 0-10', 'orange', 5),
    s('circle', { cx: 44, cy: 96, r: 30 }, 'black'),
    s('circle', { cx: 116, cy: 96, r: 30 }, 'black'),
    s('path', { d: 'M44 74a22 22 0 0 1 22 22M116 74a22 22 0 0 1 22 22', ...SW(2) }, 'gray', { stroke: true }),
    s('circle', { cx: 44, cy: 96, r: 10 }, 'blue'),
    s('circle', { cx: 116, cy: 96, r: 10 }, 'orange', { accent: true })
  ],
  'cuestión': [
    ground(),
    s('path', { d: 'M66 100 74 72', ...SW(6) }, 'skin', { stroke: true }),
    ...person(54, 136, 'green'),
    s('path', { d: 'M96 48a17 17 0 1 1 24 16q-7 4-7 14v6', ...SW(9) }, 'purple', { stroke: true, accent: true }),
    s('circle', { cx: 113, cy: 102, r: 6 }, 'purple')
  ],
  'formación': [
    s('rect', { x: 60, y: 18, width: 84, height: 58, rx: 3 }, 'dark'),
    s('rect', { x: 60, y: 18, width: 84, height: 58, rx: 3, ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M72 34h40M72 46h56M72 58h30', ...SW(3) }, 'white', { stroke: true }),
    ...person(32, 140, 'purple', { h: 44, accent: true }),
    s('path', { d: 'M44 100l26-28', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: busts([78, 104, 130], 144, 22, 22) }, 'blue'),
    s('path', { d: dots([[78, 112], [104, 112], [130, 112]], 9) }, 'skin')
  ],
  importancia: [
    s('rect', { x: 16, y: 16, width: 128, height: 128, rx: 6 }, 'tan'),
    s('rect', { x: 16, y: 16, width: 128, height: 128, rx: 6, ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: rects([[28, 28, 30, 24], [104, 104, 28, 26], [28, 108, 26, 24]]) }, 'cream'),
    s('rect', { x: 50, y: 46, width: 62, height: 62, rx: 2 }, 'yellow'),
    s('path', { d: star(81, 80, 20) }, 'red', { accent: true }),
    s('circle', { cx: 81, cy: 48, r: 7 }, 'blue')
  ]
};
