// Illustration specs for common words, batch 0008 (plus leftovers of 0007) (see server/scripts/lexicon/art.js)
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

module.exports = {
  'señal': [
    s('path', { d: rects([[22, 108, 22, 28], [52, 84, 22, 52], [82, 60, 22, 76], [112, 36, 22, 100]]) }, 'green', { accent: true }),
    s('path', { d: 'M20 46a22 22 0 0 1 32 0M12 34a34 34 0 0 1 48 0', ...SW(5) }, 'blue', { stroke: true }),
    s('circle', { cx: 36, cy: 60, r: 5 }, 'blue'),
    ground(138)
  ],
  superficie: [
    s('path', { d: 'M20 98l60 26v14l-60-26z' }, 'brown'),
    s('path', { d: 'M80 124l60-26v14l-60 26z' }, 'tan'),
    s('path', { d: 'M20 98l60-30 60 30-60 26z' }, 'sky', { accent: true }),
    s('path', { d: 'M54 96l26-12M70 104l30-14', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M40 52h80M110 42l10 10-10 10M50 42l-10 10 10 10', ...SW(5) }, 'orange', { stroke: true })
  ],
  universo: [
    s('circle', { cx: 80, cy: 80, r: 66 }, 'navy'),
    s('path', { d: 'M74 80a6 6 0 1 1 12 0a12 12 0 1 1 -24 0a18 18 0 1 1 36 0a24 24 0 1 1 -48 0', ...SW(5) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: star(38, 44, 8) + star(124, 42, 6) + star(42, 118, 6) }, 'yellow'),
    s('path', { d: dots([[60, 30], [104, 26], [136, 80], [28, 80], [80, 136]], 2.5) }, 'white'),
    s('circle', { cx: 118, cy: 114, r: 10 }, 'orange'),
    s('ellipse', { cx: 118, cy: 114, rx: 18, ry: 5, transform: 'rotate(-20 118 114)', ...SW(3) }, 'yellow', { stroke: true })
  ],
  valle: [
    backdrop('sky', 14, 122),
    s('path', { d: 'M14 136V70l34-40 46 106z' }, 'brown'),
    s('path', { d: 'M66 136l46-100 34 40v60z' }, 'brown'),
    s('path', { d: 'M40 40l8-10 9 11-8 5zM104 48l8-12 10 13-9 4z' }, 'white'),
    s('path', { d: 'M36 136q44-46 88 0z' }, 'green', { accent: true }),
    s('path', { d: 'M80 136q-10-14 2-30', ...SW(6) }, 'blue', { stroke: true })
  ],
  'colección': [
    s('rect', { x: 18, y: 28, width: 124, height: 104, rx: 6 }, 'brown'),
    s('rect', { x: 26, y: 36, width: 108, height: 88, rx: 3 }, 'cream'),
    s('path', { d: [[46, 60], [114, 102]].map(([x, y]) => `M${x} ${y}l-14-10v20zM${x} ${y}l14-10v20z`).join('') }, 'red', { accent: true }),
    s('path', { d: [[80, 60], [46, 102]].map(([x, y]) => `M${x} ${y}l-14-10v20zM${x} ${y}l14-10v20z`).join('') }, 'blue'),
    s('path', { d: [[114, 60], [80, 102]].map(([x, y]) => `M${x} ${y}l-14-10v20zM${x} ${y}l14-10v20z`).join('') }, 'orange'),
    s('path', { d: 'M46 52v16M80 52v16M114 52v16M46 94v16M80 94v16M114 94v16', ...SW(3) }, 'dark', { stroke: true })
  ],
  escenario: [
    s('rect', { x: 14, y: 18, width: 132, height: 96 }, 'dark'),
    s('path', { d: 'M70 26L48 114h64L90 26z', opacity: 0.45 }, 'yellow', { flatOnly: true }),
    s('ellipse', { cx: 80, cy: 114, rx: 32, ry: 7 }, 'yellow', { accent: true }),
    s('path', { d: 'M14 18h34q-8 50 6 96H14zM146 18h-34q8 50-6 96h40z' }, 'red'),
    s('rect', { x: 14, y: 14, width: 132, height: 14, rx: 3 }, 'red'),
    s('path', { d: 'M14 112h132l-8 26H22z' }, 'brown')
  ],
  'exposición': [
    backdrop('cream'),
    s('rect', { x: 22, y: 28, width: 54, height: 44, rx: 2 }, 'brown'),
    s('rect', { x: 28, y: 34, width: 42, height: 32 }, 'sky'),
    s('path', { d: 'M28 66l14-16 10 10 8-8 10 14z' }, 'green'),
    s('rect', { x: 90, y: 24, width: 46, height: 58, rx: 2 }, 'brown'),
    s('rect', { x: 96, y: 30, width: 34, height: 46 }, 'purple', { accent: true }),
    s('path', { d: 'M14 106q33 10 66 0t66 0', ...SW(4) }, 'red', { stroke: true }),
    ...person(80, 146, 'blue', { h: 30, w: 30, r: 12 })
  ],
  igualdad: [
    s('path', { d: 'M80 34v96M30 50h100', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M56 136h48l-8-10H64z' }, 'dark'),
    s('path', { d: 'M38 50l-16 40M38 50l16 40M122 50l-16 40M122 50l16 40', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M18 90h40q-4 16-20 16t-20-16zM102 90h40q-4 16-20 16t-20-16z' }, 'tan'),
    s('circle', { cx: 38, cy: 80, r: 10 }, 'blue'),
    s('circle', { cx: 122, cy: 80, r: 10 }, 'red'),
    s('circle', { cx: 80, cy: 30, r: 8 }, 'yellow', { accent: true })
  ],
  luchar: [
    ground(),
    s('path', { d: 'M42 118l-10 18M54 118l-2 18M118 118l10 18M106 118l2 18', ...SW(7) }, 'dark', { stroke: true }),
    ...lean(48, 122, 24, 'red', { h: 52, accent: true }),
    ...lean(112, 122, -24, 'blue', { h: 52 }),
    s('path', { d: 'M62 94h36M64 84l32 14', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M80 22v12M60 28l6 9M100 28l-6 9', ...SW(4) }, 'orange', { stroke: true })
  ],
  'método': [
    s('rect', { x: 16, y: 20, width: 46, height: 30, rx: 6 }, 'blue'),
    s('rect', { x: 58, y: 64, width: 46, height: 30, rx: 6 }, 'green'),
    s('rect', { x: 100, y: 108, width: 46, height: 30, rx: 6 }, 'orange', { accent: true }),
    s('path', { d: 'M39 54v25h14M47 73l7 6-7 6M81 98v25h14M89 117l7 6-7 6', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 35l5 5 10-10M72 79l5 5 10-10M114 123l5 5 10-10', ...SW(4) }, 'white', { stroke: true })
  ],
  normalmente: [
    s('path', { d: 'M18 118a62 62 0 0 1 124 0z' }, 'navy'),
    s('path', { d: 'M28 118a52 52 0 0 1 104 0', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M35 92A52 52 0 0 1 125 92', ...SW(14, { 'stroke-linecap': 'butt' }) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M80 118V74', ...SW(6) }, 'white', { stroke: true, lineColor: 'dark' }),
    s('circle', { cx: 80, cy: 118, r: 8 }, 'yellow'),
    s('rect', { x: 14, y: 118, width: 132, height: 14, rx: 4 }, 'dark')
  ],
  oferta: [
    s('path', { d: 'M30 30h52l50 50-52 52-50-50z' }, 'red', { accent: true }),
    s('circle', { cx: 48, cy: 48, r: 7 }, 'white'),
    s('path', { d: 'M48 48q-18-10-30-30', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M84 62v40M72 90l12 12 12-12', ...SW(7) }, 'yellow', { stroke: true }),
    s('path', { d: 'M126 26l-6 12M144 42l-12 6M136 20l-8 10', ...SW(4) }, 'orange', { stroke: true })
  ],
  onda: [
    s('path', { d: 'M14 52q16.5-24 33 0t33 0t33 0t33 0', ...SW(7) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M14 84q16.5-24 33 0t33 0t33 0t33 0', ...SW(7) }, 'sky', { stroke: true }),
    s('path', { d: 'M14 116q16.5-24 33 0t33 0t33 0t33 0', ...SW(7) }, 'navy', { stroke: true })
  ],
  salvador: [
    s('path', { d: 'M62 82h36l18 54H44z' }, 'red'),
    ...person(80, 136, 'blue', { h: 58, w: 32, r: 14, accent: true }),
    s('path', { d: 'M68 84 48 50M92 84l20-34', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: star(80, 102, 10) }, 'yellow'),
    s('path', { d: 'M70 58h20', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 36l-8-8M130 36l8-8M28 60H16M132 60h12', ...SW(4) }, 'orange', { stroke: true })
  ],
  seguramente: [
    s('path', { d: 'M80 18l52 18v36q0 44-52 70-52-26-52-70V36z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 30l40 14v28q0 34-40 56z' }, 'navy'),
    s('path', { d: 'M52 80l18 18 36-38', ...SW(11) }, 'white', { stroke: true })
  ],
  sentencia: [
    s('rect', { x: 14, y: 126, width: 132, height: 12, rx: 3 }, 'tan'),
    s('ellipse', { cx: 56, cy: 118, rx: 36, ry: 10 }, 'brown'),
    s('path', { d: 'M78 52L120 110', ...SW(9) }, 'tan', { stroke: true }),
    s('rect', { x: 46, y: 36, width: 60, height: 28, rx: 6, transform: 'rotate(-36 76 50)' }, 'brown', { accent: true }),
    s('path', { d: 'M24 98l-8-8M40 90l-4-12M90 100l8-8', ...SW(4) }, 'orange', { stroke: true })
  ],
  'sesión': [
    s('path', { d: dots([[80, 34], [80, 134], [26, 84], [134, 84], [40, 50], [120, 50], [40, 118], [120, 118]], 12) }, 'blue', { accent: true }),
    s('path', { d: dots([[80, 34], [80, 134], [26, 84], [134, 84], [40, 50], [120, 50], [40, 118], [120, 118]], 7) }, 'skin'),
    s('ellipse', { cx: 80, cy: 84, rx: 40, ry: 30 }, 'brown'),
    s('path', { d: rects([[56, 72, 16, 20], [88, 76, 16, 20]]) }, 'white'),
    s('circle', { cx: 80, cy: 84, r: 5 }, 'red')
  ],
  software: [
    s('rect', { x: 18, y: 22, width: 124, height: 88, rx: 6 }, 'dark'),
    s('rect', { x: 26, y: 30, width: 108, height: 72, rx: 2 }, 'navy'),
    s('path', { d: 'M36 46h34M44 60h40M44 74h26M36 88h30', ...SW(5) }, 'green', { stroke: true }),
    ...gear(112, 70, 10, 8, 'yellow', { accent: true }),
    s('path', { d: 'M68 110h24l6 20H62z' }, 'gray'),
    s('rect', { x: 46, y: 128, width: 68, height: 8, rx: 4 }, 'gray')
  ],
  sonido: [
    s('path', { d: 'M22 62h22l32-28v92L44 98H22z' }, 'dark', { accent: true }),
    s('path', { d: 'M90 62a24 24 0 0 1 0 36', ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M102 48a40 40 0 0 1 0 64', ...SW(6) }, 'sky', { stroke: true }),
    s('path', { d: 'M114 34a56 56 0 0 1 0 92', ...SW(6) }, 'blue', { stroke: true })
  ],
  suceder: [
    ground(),
    s('rect', { x: 112, y: 88, width: 14, height: 48, rx: 2 }, 'navy'),
    s('rect', { x: 82, y: 88, width: 14, height: 48, rx: 2, transform: 'rotate(18 96 136)' }, 'dark'),
    s('rect', { x: 52, y: 88, width: 14, height: 48, rx: 2, transform: 'rotate(40 66 136)' }, 'navy'),
    s('rect', { x: 22, y: 88, width: 14, height: 48, rx: 2, transform: 'rotate(58 36 136)' }, 'red', { accent: true }),
    s('path', { d: 'M24 70q30-40 70-32', ...SW(4, { 'stroke-dasharray': '2 8' }) }, 'orange', { stroke: true }),
    s('path', { d: 'M88 30l8 8-10 6', ...SW(4) }, 'orange', { stroke: true })
  ],
  asimismo: [
    s('rect', { x: 14, y: 54, width: 50, height: 50, rx: 8 }, 'blue'),
    s('rect', { x: 96, y: 54, width: 50, height: 50, rx: 8 }, 'blue'),
    s('path', { d: star(39, 80, 16) + star(121, 80, 16) }, 'yellow', { accent: true }),
    s('path', { d: 'M80 68v24M68 80h24', ...SW(6) }, 'orange', { stroke: true })
  ],
  cerebro: [
    s('path', { d: dots([[50, 54], [70, 42], [92, 42], [112, 54], [124, 76], [112, 98], [50, 98], [36, 76]], 18) }, 'pink', { accent: true }),
    s('ellipse', { cx: 80, cy: 76, rx: 44, ry: 34 }, 'pink'),
    s('path', { d: 'M80 32v74M44 64q10-10 22 0M42 88q14 8 26-4M94 56q12-10 24 2M96 90q12 10 26-4M58 44q8 8 0 18M104 44q-8 8 0 18', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M86 112q4 14-2 28', ...SW(12) }, 'pink', { stroke: true })
  ],
  clima: [
    backdrop('sky'),
    s('path', { d: 'M52 18v8M24 50h-6M30 28l6 6M74 28l-6 6', ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 52, cy: 52, r: 20 }, 'yellow', { accent: true }),
    s('path', { d: dots([[54, 82], [76, 70], [98, 82], [76, 90]], 17) }, 'white'),
    s('path', { d: 'M56 112l-6 14M76 112l-6 14M96 112l-6 14', ...SW(4) }, 'blue', { stroke: true }),
    s('rect', { x: 118, y: 28, width: 14, height: 74, rx: 7 }, 'white'),
    s('path', { d: 'M125 100V58', ...SW(6) }, 'red', { stroke: true }),
    s('circle', { cx: 125, cy: 108, r: 12 }, 'red')
  ],
  comportamiento: [
    s('ellipse', { cx: 52, cy: 56, rx: 15, ry: 5, ...SW(4) }, 'yellow', { stroke: true }),
    ...person(52, 136, 'green', { h: 46, w: 32, r: 14 }),
    s('path', { d: 'M46 78q6 5 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('rect', { x: 90, y: 30, width: 52, height: 90, rx: 4 }, 'cream'),
    outline({ x: 90, y: 30, width: 52, height: 90, rx: 4 }, 'tan'),
    s('path', { d: star(104, 50, 8) + star(128, 50, 8) + star(104, 76, 8) + star(128, 76, 8) + star(104, 102, 8) }, 'yellow', { accent: true })
  ],
  corriente: [
    s('rect', { x: 14, y: 20, width: 132, height: 28, rx: 6 }, 'green'),
    s('rect', { x: 14, y: 48, width: 132, height: 64 }, 'blue', { accent: true }),
    s('rect', { x: 14, y: 112, width: 132, height: 28, rx: 6 }, 'green'),
    s('path', { d: 'M24 66h44M58 58l10 8-10 8M76 94h44M110 86l10 8-10 8', ...SW(5) }, 'white', { stroke: true }),
    s('ellipse', { cx: 112, cy: 64, rx: 10, ry: 5 }, 'yellow')
  ],
  'discusión': [
    s('path', { d: burst(48, 44, 28, 19, 9) }, 'yellow', { accent: true }),
    s('path', { d: burst(112, 44, 28, 19, 9) }, 'orange'),
    s('path', { d: 'M40 36l10 6-8 6 10 6M104 36l10 6-8 6 10 6', ...SW(4) }, 'dark', { stroke: true }),
    ...person(40, 138, 'blue'),
    ...person(120, 138, 'red'),
    s('path', { d: 'M36 74l8 3M124 74l-8 3', ...SW(3) }, 'dark', { stroke: true })
  ],
  dominio: [
    s('path', { d: 'M22 76q4-32 40-30 22-18 48-6 30 6 30 36 8 30-18 44-30 18-60 8-42-8-40-52z' }, 'green'),
    s('path', { d: 'M22 76q4-32 40-30 22-18 48-6 30 6 30 36 8 30-18 44-30 18-60 8-42-8-40-52z', ...SW(3, { 'stroke-dasharray': '6 6' }) }, 'dark', { stroke: true }),
    s('path', { d: 'M78 104V30', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 30h36l-8 10 8 10H80z' }, 'red', { accent: true }),
    s('path', { d: 'M62 104h32', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 84l6-10 6 10zM108 108l6-10 6 10zM112 70l6-10 6 10z' }, 'mint')
  ],
  escala: [
    s('path', { d: 'M18 44h124M18 64h124M18 84h124M18 104h124M18 124h124', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: dots([[28, 124], [46, 114], [64, 104], [82, 94], [100, 84], [118, 74], [136, 64]], 7) }, 'navy', { accent: true }),
    s('path', { d: [[28, 124], [46, 114], [64, 104], [82, 94], [100, 84], [118, 74], [136, 64]].map(([x, y]) => `M${x + 6} ${y}v-26`).join(''), ...SW(3) }, 'navy', { stroke: true }),
    s('path', { d: 'M26 146 132 30', ...SW(4, { 'stroke-dasharray': '2 9' }) }, 'orange', { stroke: true })
  ],
  gracia: [
    s('path', { d: 'M100 60q34-6 22 22t24 34', ...SW(5) }, 'purple', { stroke: true }),
    ...lady(70, 136, 'pink', { accent: true }),
    s('path', { d: 'M64 92 44 66M76 92 98 62', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: star(36, 40, 7) + star(118, 36, 6) }, 'yellow'),
    s('path', { d: 'M62 136l-6 4M78 136l8 2', ...SW(5) }, 'pink', { stroke: true })
  ],
  'intervención': [
    s('path', { d: 'M14 82h42M44 70l12 12-12 12', ...SW(8) }, 'red', { stroke: true }),
    s('path', { d: 'M146 82h-42M116 70l-12 12 12 12', ...SW(8) }, 'blue', { stroke: true }),
    s('path', { d: 'M67 72V46M76 68V38M85 68V38M94 72V46', ...SW(8) }, 'skin', { stroke: true }),
    s('rect', { x: 62, y: 64, width: 38, height: 44, rx: 12 }, 'skin', { accent: true }),
    s('path', { d: 'M62 88l-10-10', ...SW(8) }, 'skin', { stroke: true }),
    s('rect', { x: 66, y: 106, width: 30, height: 30, rx: 4 }, 'navy')
  ],
  'montón': [
    ground(140),
    s('path', { d: dots([[26, 128], [62, 128], [98, 128], [134, 128], [53, 112], [89, 112], [44, 96], [80, 96], [116, 96], [71, 80], [62, 64], [98, 64], [80, 32]], 9) }, 'orange', { accent: true }),
    s('path', { d: dots([[44, 128], [80, 128], [116, 128], [35, 112], [71, 112], [107, 112], [125, 112], [62, 96], [98, 96], [53, 80], [89, 80], [107, 80], [80, 64], [71, 48], [89, 48]], 9) }, 'red'),
    s('path', { d: 'M80 23v-8', ...SW(3) }, 'green', { stroke: true })
  ],
  pasada: [
    s('path', { d: 'M22 30l-8-6M138 30l8-6M14 84H4M146 84h10M30 132l-8 8M130 132l8 8', ...SW(5) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 82, r: 54 }, 'yellow'),
    s('path', { d: star(58, 70, 15) + star(102, 70, 15) }, 'red', { accent: true }),
    s('path', { d: 'M54 96h52q-4 30-26 30t-26-30z' }, 'dark'),
    s('path', { d: 'M66 116q14-8 28 0q-4 10-14 10t-14-10z' }, 'pink')
  ],
  'sensación': [
    s('ellipse', { cx: 80, cy: 112, rx: 62, ry: 20, ...SW(4) }, 'sky', { stroke: true }),
    s('ellipse', { cx: 80, cy: 112, rx: 40, ry: 12, ...SW(4) }, 'purple', { stroke: true }),
    s('rect', { x: 68, y: 18, width: 24, height: 92, rx: 12 }, 'skin'),
    s('path', { d: 'M72 104q8-14 16 0z' }, 'pink', { accent: true }),
    s('path', { d: 'M48 70l-12-8M112 70l12-8M46 90H32M114 90h14', ...SW(4) }, 'yellow', { stroke: true })
  ],
  show: [
    backdrop('navy'),
    s('path', { d: 'M70 14L44 118h72L90 14z', opacity: 0.4 }, 'yellow', { flatOnly: true }),
    ...person(80, 116, 'red', { h: 40, w: 28, r: 12, accent: true }),
    s('path', { d: 'M90 82l14-18', ...SW(6) }, 'skin', { stroke: true }),
    s('circle', { cx: 106, cy: 60, r: 5 }, 'dark'),
    s('path', { d: star(36, 40, 8) + star(126, 36, 7) + star(124, 92, 5) }, 'yellow'),
    s('path', { d: busts([30, 56, 82, 108, 132], 146, 22, 20) + dots([[30, 120], [56, 120], [82, 120], [108, 120], [132, 120]], 8) }, 'black')
  ],
  terrible: [
    s('path', { d: 'M30 30l10 10M130 30l-10 10M80 14v14M22 84h-8M138 84h8', ...SW(5) }, 'orange', { stroke: true }),
    s('ellipse', { cx: 80, cy: 84, rx: 34, ry: 46 }, 'sky'),
    s('path', { d: dots([[66, 70], [94, 70]], 8) }, 'white'),
    s('path', { d: dots([[66, 72], [94, 72]], 3.5) }, 'dark'),
    s('ellipse', { cx: 80, cy: 106, rx: 9, ry: 16 }, 'dark', { accent: true }),
    s('path', { d: 'M38 74q-6 24 8 44M122 74q6 24-8 44', ...SW(12) }, 'skin', { stroke: true })
  ],
  'vergüenza': [
    s('circle', { cx: 80, cy: 82, r: 52 }, 'skin'),
    s('ellipse', { cx: 52, cy: 96, rx: 12, ry: 8 }, 'pink', { accent: true }),
    s('ellipse', { cx: 108, cy: 96, rx: 12, ry: 8 }, 'pink', { accent: true }),
    s('rect', { x: 40, y: 56, width: 34, height: 28, rx: 12 }, 'tan'),
    s('rect', { x: 86, y: 56, width: 34, height: 28, rx: 12 }, 'tan'),
    s('path', { d: 'M68 112q6-6 12 0t12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M128 34q-8 12 0 16t0-16z' }, 'sky')
  ],
  agencia: [
    ground(),
    s('rect', { x: 28, y: 40, width: 104, height: 96 }, 'gray'),
    s('rect', { x: 24, y: 26, width: 112, height: 22, rx: 4 }, 'navy', { accent: true }),
    s('rect', { x: 70, y: 31, width: 20, height: 13, rx: 2 }, 'yellow'),
    s('path', { d: 'M76 31v-3h8v3', ...SW(2) }, 'yellow', { stroke: true }),
    s('path', { d: rects([[38, 58, 22, 18], [69, 58, 22, 18], [100, 58, 22, 18], [38, 88, 22, 18], [100, 88, 22, 18]]) }, 'sky'),
    s('rect', { x: 68, y: 96, width: 24, height: 40 }, 'brown')
  ],
  anunciar: [
    s('path', { d: 'M54 92l-8 26', ...SW(9) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 66h18l56-34v96L42 94H24z' }, 'red', { accent: true }),
    s('ellipse', { cx: 98, cy: 80, rx: 8, ry: 48 }, 'orange'),
    s('rect', { x: 16, y: 64, width: 12, height: 32, rx: 4 }, 'dark'),
    s('path', { d: 'M116 56l16-12M120 80h20M116 104l16 12', ...SW(5) }, 'orange', { stroke: true })
  ],
  apoyar: [
    ground(),
    ...lean(58, 136, 14, 'orange', { h: 46, w: 28 }),
    ...person(106, 136, 'blue', { h: 50, w: 30, r: 13, accent: true }),
    s('path', { d: 'M94 96q-14 4-28-2', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M74 92q14-10 24-8', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: heart(82, 30, 12) }, 'pink')
  ],
  asistencia: [
    s('path', { d: busts([36, 80, 124], 124, 32, 34) }, 'navy', { accent: true }),
    s('path', { d: dots([[36, 78], [80, 78], [124, 78]], 12) }, 'skin'),
    s('path', { d: 'M26 44l7 7 14-14M70 44l7 7 14-14M114 44l7 7 14-14', ...SW(6) }, 'green', { stroke: true }),
    s('rect', { x: 14, y: 120, width: 132, height: 18, rx: 4 }, 'tan')
  ],
  cabe: [
    s('ellipse', { cx: 80, cy: 134, rx: 64, ry: 8 }, 'yellow', { accent: true }),
    s('path', { d: 'M22 76 58 44l36 32z' }, 'red'),
    s('rect', { x: 30, y: 74, width: 56, height: 60 }, 'cream'),
    outline({ x: 30, y: 74, width: 56, height: 60 }, 'tan'),
    s('rect', { x: 50, y: 104, width: 16, height: 30 }, 'brown'),
    ...person(110, 134, 'green', { h: 44, w: 28, r: 12 })
  ],
  comandante: [
    ...person(70, 138, 'navy', { h: 58, w: 42, r: 16, accent: true }),
    s('path', { d: 'M52 56q18-24 36 0z' }, 'navy'),
    s('path', { d: 'M50 56h42', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 70, cy: 46, r: 4 }, 'yellow'),
    s('path', { d: rects([[46, 80, 14, 6], [80, 80, 14, 6]]) + dots([[60, 104], [72, 104]], 5) }, 'yellow'),
    s('path', { d: 'M90 92 128 62', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M58 98v-8M72 98v-8', ...SW(3) }, 'red', { stroke: true })
  ],
  constante: [
    s('path', { d: 'M24 22v110h118', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M126 122l12 10-12 10', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 74h104', ...SW(6) }, 'green', { stroke: true, accent: true }),
    s('path', { d: dots([[40, 74], [64, 74], [88, 74], [112, 74], [134, 74]], 6) }, 'blue')
  ],
  contener: [
    s('rect', { x: 40, y: 24, width: 80, height: 18, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M46 42h68v6q10 4 10 16v62q0 12-12 12H48q-12 0-12-12V64q0-12 10-16z' }, 'sky'),
    s('path', { d: dots([[54, 120], [74, 124], [96, 120], [112, 112], [62, 100], [86, 102], [106, 90]], 9) }, 'yellow'),
    s('path', { d: dots([[64, 122], [86, 118], [50, 104], [74, 98], [98, 104], [52, 84], [80, 82]], 8) }, 'pink'),
    s('path', { d: 'M46 42h68v6q10 4 10 16v62q0 12-12 12H48q-12 0-12-12V64q0-12 10-16z', ...SW(3) }, 'gray', { stroke: true })
  ],
  convertir: [
    s('rect', { x: 16, y: 60, width: 40, height: 40, rx: 4 }, 'blue'),
    s('circle', { cx: 122, cy: 80, r: 22 }, 'red', { accent: true }),
    s('path', { d: 'M62 74q18-26 36 0', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M88 72l10 4 2-12', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: star(80, 106, 8) + star(64, 36, 5) + star(98, 32, 5) }, 'yellow')
  ],
  fundamental: [
    s('path', { d: 'M30 62 80 24l50 38z' }, 'brown'),
    s('path', { d: rects([[36, 62, 42, 22], [82, 62, 42, 22], [36, 88, 20, 22], [60, 88, 40, 22], [104, 88, 20, 22]]) }, 'tan'),
    s('rect', { x: 16, y: 114, width: 128, height: 24, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M36 126h88', ...SW(4, { 'stroke-dasharray': '10 8' }) }, 'yellow', { stroke: true })
  ],
  igualmente: [
    s('path', { d: heart(36, 38, 16) }, 'pink', { accent: true }),
    s('path', { d: heart(124, 38, 16) }, 'pink', { accent: true }),
    ...person(36, 138, 'green'),
    ...person(124, 138, 'purple'),
    s('path', { d: 'M58 96h44M64 90l-6 6 6 6M96 90l6 6-6 6', ...SW(5) }, 'orange', { stroke: true })
  ],
  indicar: [
    s('path', { d: 'M108 60v78', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 28h46l16 16-16 16H80z' }, 'green', { accent: true }),
    s('path', { d: 'M90 44h34M116 36l8 8-8 8', ...SW(4) }, 'white', { stroke: true }),
    s('rect', { x: 14, y: 100, width: 22, height: 34, rx: 4, transform: 'rotate(-35 40 110)' }, 'blue'),
    s('rect', { x: 30, y: 92, width: 30, height: 30, rx: 10, transform: 'rotate(-35 40 110)' }, 'skin'),
    s('rect', { x: 50, y: 94, width: 34, height: 10, rx: 5, transform: 'rotate(-35 40 110)' }, 'skin')
  ],
  industrial: [
    ground(),
    s('path', { d: 'M18 136V80l28-18v18l28-18v18l28-18v74z' }, 'gray'),
    s('rect', { x: 110, y: 40, width: 16, height: 96 }, 'red', { accent: true }),
    s('path', { d: 'M110 52h16M110 64h16', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: dots([[122, 30], [134, 22], [142, 30]], 8) }, 'gray'),
    s('path', { d: rects([[28, 96, 14, 14], [56, 96, 14, 14], [84, 96, 14, 14]]) }, 'yellow'),
    s('rect', { x: 128, y: 70, width: 14, height: 66 }, 'dark')
  ],
  masa: [
    s('rect', { x: 14, y: 104, width: 132, height: 26, rx: 6 }, 'brown'),
    s('path', { d: 'M32 106q0-42 48-42t48 42z' }, 'cream', { accent: true }),
    s('path', { d: 'M32 106q0-42 48-42t48 42', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 30, y: 30, width: 100, height: 16, rx: 8, transform: 'rotate(-10 80 38)' }, 'tan'),
    s('path', { d: 'M16 46l14-2M130 30l14-2', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: dots([[24, 120], [40, 116], [120, 118], [136, 122], [80, 124]], 3) }, 'white')
  ],
  nuevamente: [
    s('path', { d: 'M118 58A44 44 0 1 0 122 96', ...SW(11) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M108 96l18-14 8 22z' }, 'green'),
    s('path', { d: star(80, 80, 18) }, 'orange')
  ],
  placer: [
    s('circle', { cx: 80, cy: 30, r: 14 }, 'yellow'),
    s('path', { d: 'M24 136V40M136 136V40', ...SW(7) }, 'brown', { stroke: true }),
    s('path', { d: 'M24 40q-14 0-12 14M24 40q12-12 22-2M136 40q14 0 12 14M136 40q-12-12-22-2', ...SW(6) }, 'green', { stroke: true }),
    s('path', { d: 'M24 70q56 56 112 0q-56 34-112 0z' }, 'red', { accent: true }),
    s('circle', { cx: 52, cy: 82, r: 11 }, 'skin'),
    s('path', { d: 'M46 82q3 3 6 0', ...SW(2) }, 'dark', { stroke: true }),
    s('path', { d: 'M62 88q30 10 50 0', ...SW(9) }, 'blue', { stroke: true })
  ],
  'representación': [
    s('path', { d: 'M18 34h56v36q0 34-28 42-28-8-28-42z' }, 'yellow', { accent: true }),
    s('path', { d: dots([[36, 58], [56, 58]], 6) + 'M32 78q14 16 28 0z' }, 'dark'),
    s('path', { d: 'M86 48h56v36q0 34-28 42-28-8-28-42z', transform: 'rotate(10 114 86)' }, 'sky'),
    s('path', { d: dots([[103, 72], [123, 76]], 6), transform: 'rotate(10 114 86)' }, 'dark'),
    s('path', { d: 'M100 104q14-14 28 0', ...SW(4), transform: 'rotate(10 114 86)' }, 'dark', { stroke: true }),
    s('path', { d: 'M46 112q20 24 50 12', ...SW(5) }, 'red', { stroke: true })
  ],
  requerir: [
    s('rect', { x: 26, y: 46, width: 96, height: 54, rx: 8, ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 124, y: 62, width: 10, height: 22, rx: 3 }, 'dark'),
    s('rect', { x: 36, y: 56, width: 18, height: 34, rx: 3 }, 'red', { accent: true }),
    s('path', { d: 'M80 140v-14', ...SW(5) }, 'gray', { stroke: true }),
    s('rect', { x: 64, y: 110, width: 32, height: 18, rx: 4 }, 'gray'),
    s('path', { d: 'M72 110v-8M88 110v-8', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M84 54l-14 20h12l-6 18 16-24H80z' }, 'yellow')
  ],
  resumen: [
    s('rect', { x: 18, y: 28, width: 56, height: 104, rx: 3 }, 'white'),
    outline({ x: 18, y: 28, width: 56, height: 104, rx: 3 }),
    s('path', { d: 'M26 42h40M26 54h40M26 66h32M26 78h40M26 90h40M26 102h28M26 114h40', ...SW(3) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 80h12M86 72l8 8-8 8', ...SW(5) }, 'orange', { stroke: true }),
    s('rect', { x: 100, y: 56, width: 44, height: 48, rx: 4 }, 'yellow', { accent: true }),
    s('path', { d: 'M108 72h28M108 86h18', ...SW(5) }, 'dark', { stroke: true })
  ],
  titular: [
    s('rect', { x: 22, y: 20, width: 116, height: 120, rx: 3 }, 'white'),
    outline({ x: 22, y: 20, width: 116, height: 120, rx: 3 }),
    s('rect', { x: 32, y: 32, width: 96, height: 18, rx: 2 }, 'dark', { accent: true }),
    s('rect', { x: 32, y: 60, width: 44, height: 36 }, 'sky'),
    s('path', { d: 'M86 64h42M86 76h42M86 88h30M32 108h96M32 120h80', ...SW(4) }, 'gray', { stroke: true })
  ],
  turismo: [
    ...person(66, 140, 'orange', { h: 50, w: 32, r: 14 }),
    s('ellipse', { cx: 66, cy: 64, rx: 26, ry: 6 }, 'tan'),
    s('path', { d: 'M54 64q0-18 12-18t12 18z' }, 'tan'),
    s('rect', { x: 54, y: 98, width: 26, height: 18, rx: 3 }, 'dark'),
    s('circle', { cx: 67, cy: 107, r: 6 }, 'sky'),
    s('rect', { x: 102, y: 92, width: 36, height: 46, rx: 5 }, 'blue', { accent: true }),
    s('path', { d: 'M112 92v-10h16v10', ...SW(4) }, 'dark', { stroke: true })
  ],
  actuar: [
    s('rect', { x: 28, y: 64, width: 104, height: 70, rx: 4 }, 'dark', { accent: true }),
    s('rect', { x: 28, y: 64, width: 104, height: 18 }, 'white'),
    s('path', { d: 'M40 64l12 18h10L50 64zM72 64l12 18h10L82 64zM104 64l12 18h10l-12-18z' }, 'dark'),
    s('path', { d: 'M28 60l100-24 4 16-100 24z' }, 'white', { lineColor: 'dark' }),
    s('path', { d: 'M28 60l100-24 4 16-100 24z', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M46 56l14 12 10-2-14-12zM78 48l14 12 10-2-14-12zM108 41l14 12 8-2-12-12z' }, 'dark'),
    s('path', { d: 'M44 100h72M44 116h50', ...SW(4) }, 'gray', { stroke: true })
  ],
  anual: [
    s('rect', { x: 20, y: 26, width: 120, height: 112, rx: 8 }, 'cream'),
    outline({ x: 20, y: 26, width: 120, height: 112, rx: 8 }, 'tan'),
    s('path', { d: 'M20 34a8 8 0 0 1 8-8h104a8 8 0 0 1 8 8v12H20z' }, 'red'),
    s('path', { d: 'M48 18v16M112 18v16', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: rects([[30, 56, 22, 20], [58, 56, 22, 20], [86, 56, 22, 20], [114, 56, 18, 20], [30, 82, 22, 20], [58, 82, 22, 20], [114, 82, 18, 20], [30, 108, 22, 20], [58, 108, 22, 20], [86, 108, 22, 20], [114, 108, 18, 20]]) }, 'gray'),
    s('rect', { x: 86, y: 82, width: 22, height: 20 }, 'orange', { accent: true })
  ],
  carajo: [
    s('path', { d: 'M96 26q4-14 18-10 8-10 20 0 12 2 10 14 0 12-14 12h-26q-14 0-8-16z' }, 'dark'),
    s('path', { d: 'M118 30l-8 10h8l-6 12', ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 66, cy: 92, r: 46 }, 'red', { accent: true }),
    s('path', { d: 'M40 76l16 8M92 76l-16 8', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[52, 90], [80, 90]], 5) }, 'dark'),
    s('rect', { x: 48, y: 106, width: 36, height: 14, rx: 4 }, 'white'),
    s('path', { d: dots([[20, 58], [14, 44], [112, 74]], 6) }, 'gray')
  ],
  continuar: [
    s('rect', { x: 16, y: 26, width: 128, height: 88, rx: 8 }, 'dark'),
    s('path', { d: 'M68 50v40l34-20z' }, 'green', { accent: true }),
    s('path', { d: 'M24 130h112', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M24 130h60', ...SW(6) }, 'red', { stroke: true }),
    s('circle', { cx: 84, cy: 130, r: 8 }, 'red')
  ],
  definitivamente: [
    s('path', { d: 'M22 30l10 8M138 30l-10 8M80 14v12', ...SW(5) }, 'orange', { stroke: true }),
    s('rect', { x: 66, y: 32, width: 20, height: 56, rx: 10 }, 'skin'),
    s('rect', { x: 54, y: 70, width: 64, height: 60, rx: 14 }, 'skin', { accent: true }),
    s('path', { d: 'M86 86h28M86 100h28M86 114h26', ...SW(3) }, 'tan', { stroke: true }),
    s('rect', { x: 30, y: 74, width: 24, height: 58, rx: 4 }, 'blue')
  ],
  dictadura: [
    s('rect', { x: 50, y: 96, width: 60, height: 24, rx: 3 }, 'red', { accent: true }),
    ...person(80, 96, 'dark', { h: 40, w: 32, r: 13 }),
    s('path', { d: 'M94 66l14-26', ...SW(8) }, 'skin', { stroke: true }),
    s('circle', { cx: 110, cy: 34, r: 8 }, 'skin'),
    s('path', { d: busts([22, 42, 62, 98, 118, 138], 146, 18, 18) }, 'gray'),
    s('path', { d: dots([[24, 122], [44, 122], [64, 122], [96, 122], [116, 122], [136, 122]], 7) }, 'gray')
  ],
  'década': [
    s('rect', { x: 66, y: 16, width: 28, height: 26, rx: 3 }, 'white'),
    outline({ x: 66, y: 16, width: 28, height: 26, rx: 3 }),
    s('rect', { x: 66, y: 16, width: 28, height: 8, rx: 3 }, 'red'),
    s('path', { d: 'M20 76q0-12 12-12h36l12-12 12 12h36q12 0 12 12', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: rects([0, 2, 4, 6, 8].map(i => [16 + i * 12.8, 88, 12.8, 22])) }, 'blue', { accent: true }),
    s('path', { d: rects([1, 3, 5, 7, 9].map(i => [16 + i * 12.8, 88, 12.8, 22])) }, 'sky'),
    s('path', { d: 'M16 124h128', ...SW(4) }, 'gray', { stroke: true })
  ],
  gay: [
    s('path', { d: 'M28 18v124', ...SW(6) }, 'gray', { stroke: true }),
    s('rect', { x: 30, y: 26, width: 104, height: 13 }, 'red', { accent: true }),
    s('rect', { x: 30, y: 39, width: 104, height: 13 }, 'orange'),
    s('rect', { x: 30, y: 52, width: 104, height: 13 }, 'yellow'),
    s('rect', { x: 30, y: 65, width: 104, height: 13 }, 'green'),
    s('rect', { x: 30, y: 78, width: 104, height: 13 }, 'blue'),
    s('rect', { x: 30, y: 91, width: 104, height: 13 }, 'purple')
  ],
  lectura: [
    s('path', { d: busts([80], 146, 64, 50) }, 'blue'),
    s('circle', { cx: 80, cy: 52, r: 22 }, 'skin'),
    s('path', { d: 'M58 50q0-26 22-26t22 26q-10-12-22-12t-22 12z' }, 'brown'),
    s('path', { d: 'M80 84q-30-10-60 0v54q30-10 60 0q30-10 60 0V84q-30-10-60 0z' }, 'red', { accent: true }),
    s('path', { d: 'M80 88q-26-8-52 0v44q26-8 52 0q26-8 52 0V88q-26-8-52 0z' }, 'cream'),
    s('path', { d: 'M80 88v44M38 100h32M38 112h32M90 100h32M90 112h32', ...SW(3) }, 'tan', { stroke: true })
  ],
  'niña': [
    s('path', { d: dots([[50, 52], [110, 52]], 12) }, 'brown'),
    s('path', { d: 'M70 110v28M90 110v28', ...SW(6) }, 'skin', { stroke: true }),
    s('path', { d: 'M70 74h20l20 40H50z' }, 'pink', { accent: true }),
    s('circle', { cx: 80, cy: 54, r: 22 }, 'skin'),
    s('path', { d: 'M58 52q0-24 22-24t22 24q-10-12-22-12t-22 12z' }, 'brown'),
    s('path', { d: dots([[72, 56], [88, 56]], 3) + 'M74 66q6 4 12 0z' }, 'dark'),
    s('path', { d: 'M96 32l14-8v16zM96 32l-14-8v16z' }, 'red')
  ],
  'porqué': [
    s('rect', { x: 14, y: 76, width: 132, height: 64, rx: 6 }, 'brown'),
    s('path', { d: 'M56 76V36M56 50q-18-4-22-18 18 0 22 18M56 44q14-12 26-8-6 14-26 8', ...SW(5) }, 'green', { stroke: true }),
    s('circle', { cx: 66, cy: 104, r: 30 }, 'sky', { accent: true }),
    s('path', { d: 'M56 76v26M56 88l-14 18M56 94l16 22M56 102l-4 20', ...SW(4) }, 'tan', { stroke: true }),
    s('circle', { cx: 66, cy: 104, r: 30, ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M88 126l20 16', ...SW(10) }, 'dark', { stroke: true })
  ],
  'príncipe': [
    s('path', { d: 'M62 82h36l14 56H48z' }, 'purple'),
    ...person(80, 138, 'blue', { h: 54, w: 34, r: 16, accent: true }),
    s('path', { d: 'M64 56l-2-18 9 8 9-12 9 12 9-8-2 18z' }, 'yellow', { accent: true }),
    s('path', { d: 'M64 86l32 30', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: dots([[74, 68], [86, 68]], 2.5) }, 'dark')
  ],
  tiro: [
    s('circle', { cx: 74, cy: 86, r: 54 }, 'red', { accent: true }),
    s('circle', { cx: 74, cy: 86, r: 40 }, 'white'),
    s('circle', { cx: 74, cy: 86, r: 26 }, 'red'),
    s('circle', { cx: 74, cy: 86, r: 12 }, 'white'),
    s('path', { d: 'M74 86 134 26', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M126 22l12-8-2 14 12-2-8 12-14-2z' }, 'yellow')
  ],
  torno: [
    s('rect', { x: 14, y: 112, width: 132, height: 16, rx: 3 }, 'dark'),
    s('rect', { x: 18, y: 60, width: 32, height: 52, rx: 4 }, 'gray'),
    s('rect', { x: 118, y: 72, width: 24, height: 40, rx: 4 }, 'gray'),
    s('rect', { x: 50, y: 74, width: 68, height: 26, rx: 6 }, 'tan', { accent: true }),
    s('path', { d: 'M64 74v26M84 74v26M104 74v26', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M64 60q20-16 40 0', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M96 52l8 8-10 4', ...SW(5) }, 'orange', { stroke: true }),
    s('path', { d: 'M18 128l-2 12M142 128l2 12', ...SW(6) }, 'dark', { stroke: true })
  ],
  'caída': [
    ground(),
    ...lean(86, 112, -60, 'red', { h: 44, w: 28, accent: true }),
    s('path', { d: 'M92 108l20-30M98 112l26-14', ...SW(7) }, 'dark', { stroke: true }),
    s('path', { d: 'M118 132q8-14 18 0q-8-6-18 0z' }, 'yellow'),
    s('path', { d: 'M112 54l12-6M118 66l14-2M106 44l6-10', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: star(40, 40, 7) + star(22, 66, 5) }, 'orange')
  ],
  cola: [
    s('path', { d: 'M106 86q22-6 26-40', ...SW(9) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M120 34l-8-8M142 44l10-6M144 58h10', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M50 108v26M64 110v24M90 110v24M104 108v26', ...SW(8) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 76, cy: 96, rx: 36, ry: 20 }, 'brown'),
    s('circle', { cx: 38, cy: 74, r: 18 }, 'brown'),
    s('path', { d: 'M26 64q-8 10-4 24 8-4 10-16z' }, 'dark'),
    s('path', { d: dots([[32, 70]], 3) + dots([[20, 80]], 4) }, 'black')
  ],
  'disposición': [
    ...person(68, 138, 'green', { h: 50, w: 32, r: 15, accent: true }),
    s('path', { d: 'M80 94l20-46', ...SW(8) }, 'skin', { stroke: true }),
    s('circle', { cx: 102, cy: 44, r: 9 }, 'skin'),
    s('path', { d: 'M60 76q8 6 16 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M118 30l10-8M122 46h12M114 18l2-6', ...SW(4) }, 'yellow', { stroke: true })
  ],
  'dueño': [
    ground(),
    s('path', { d: 'M78 74l34-30 34 30z' }, 'red'),
    s('rect', { x: 86, y: 72, width: 52, height: 64 }, 'cream'),
    s('rect', { x: 104, y: 104, width: 16, height: 32 }, 'brown'),
    ...person(42, 136, 'blue', { h: 50, w: 32, r: 14 }),
    s('path', { d: 'M56 98 66 80', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M66 66a10 10 0 1 1 0 .1M72 58l20-20M84 46l6 6M90 40l6 6', ...SW(5) }, 'yellow', { stroke: true, accent: true })
  ],
  editorial: [
    s('rect', { x: 18, y: 112, width: 100, height: 22, rx: 3 }, 'red', { accent: true }),
    s('rect', { x: 24, y: 90, width: 90, height: 22, rx: 3 }, 'blue'),
    s('rect', { x: 20, y: 68, width: 96, height: 22, rx: 3 }, 'green'),
    s('path', { d: 'M110 74v10M108 96v10M112 118v10', ...SW(4) }, 'cream', { stroke: true }),
    s('rect', { x: 120, y: 112, width: 24, height: 22, rx: 5 }, 'dark'),
    s('path', { d: 'M132 112L104 28q30 14 36 50z' }, 'white'),
    s('path', { d: 'M132 112L104 28q30 14 36 50z', ...SW(3) }, 'gray', { stroke: true })
  ],
  labor: [
    ground(),
    s('path', { d: 'M104 136q14-24 34 0z' }, 'brown'),
    ...person(60, 136, 'orange', { h: 52, w: 34, r: 14, accent: true }),
    s('path', { d: 'M44 64q0-18 16-18t16 18zM40 64h40' }, 'yellow'),
    s('path', { d: 'M76 90l26-34', ...SW(6) }, 'tan', { stroke: true }),
    s('path', { d: 'M98 52l-14 24', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M100 120l14-16 14 10-12 16z' }, 'gray'),
    s('path', { d: 'M74 94 112 110', ...SW(5) }, 'tan', { stroke: true })
  ],
  suma: [
    s('path', { d: dots([[110, 36], [132, 36]], 9) }, 'red'),
    s('path', { d: dots([[88, 68], [110, 68], [132, 68]], 9) }, 'blue'),
    s('path', { d: 'M34 68h24M46 56v24', ...SW(6) }, 'orange', { stroke: true }),
    s('path', { d: 'M24 92h118', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: dots([[44, 118], [66, 118], [88, 118], [110, 118], [132, 118]], 9) }, 'green', { accent: true })
  ],
  tasa: [
    s('circle', { cx: 68, cy: 80, r: 50 }, 'sky'),
    s('path', { d: 'M74 74V24A50 50 0 0 1 121.6 58.6z' }, 'orange', { accent: true }),
    s('path', { d: 'M68 80V30M68 80l47.6-15.4', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M108 136v-10a18 6 0 0 1 36 0v10a18 6 0 0 1-36 0zM108 116v-10a18 6 0 0 1 36 0v10a18 6 0 0 1-36 0z' }, 'yellow'),
    s('path', { d: 'M108 126a18 6 0 0 0 36 0M108 106a18 6 0 0 0 36 0', ...SW(2) }, 'orange', { stroke: true })
  ],
  universal: [
    s('circle', { cx: 80, cy: 80, r: 56, ...SW(4) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 40 }, 'blue', { accent: true }),
    s('path', { d: 'M56 56q14-8 22 4-2 12-14 10-4 10-14 4 0-12 6-18zM90 84q16-4 22 8-4 18-18 18-10-10-4-26zM86 44q12-2 18 6-8 4-18-6z' }, 'green'),
    s('path', { d: dots([[136, 80], [119.6, 119.6], [80, 136], [40.4, 119.6], [24, 80], [40.4, 40.4], [80, 24], [119.6, 40.4]], 8) }, 'skin'),
    s('path', { d: dots([[136, 80], [80, 136], [24, 80], [80, 24]], 4) }, 'red')
  ],
  vivienda: [
    ground(),
    s('rect', { x: 20, y: 30, width: 54, height: 106 }, 'tan'),
    s('path', { d: rects([[28, 40, 14, 14], [52, 40, 14, 14], [28, 64, 14, 14], [52, 64, 14, 14], [28, 88, 14, 14], [52, 88, 14, 14]]) }, 'sky'),
    s('rect', { x: 40, y: 112, width: 14, height: 24 }, 'brown'),
    s('path', { d: 'M80 88l30-28 30 28z' }, 'red', { accent: true }),
    s('rect', { x: 86, y: 86, width: 48, height: 50 }, 'cream'),
    outline({ x: 86, y: 86, width: 48, height: 50 }, 'tan'),
    s('rect', { x: 103, y: 108, width: 14, height: 28 }, 'brown')
  ],
  absolutamente: [
    s('circle', { cx: 80, cy: 80, r: 52, ...SW(16) }, 'mint', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 52, ...SW(10) }, 'green', { stroke: true, accent: true }),
    s('path', { d: star(80, 80, 30) }, 'yellow', { accent: true }),
    s('path', { d: 'M80 14v14', ...SW(4) }, 'white', { stroke: true })
  ],
  anteriormente: [
    s('circle', { cx: 84, cy: 84, r: 46 }, 'cream'),
    s('circle', { cx: 84, cy: 84, r: 46, ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M84 84V52M84 84l22 12', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M84 22A62 62 0 0 0 24 70', ...SW(7) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M12 60l12 16 14-14', ...SW(7) }, 'blue', { stroke: true })
  ],
  'descripción': [
    s('rect', { x: 62, y: 24, width: 80, height: 108, rx: 4 }, 'cream'),
    outline({ x: 62, y: 24, width: 80, height: 108, rx: 4 }, 'tan'),
    s('path', { d: 'M74 44h56M74 60h56M74 76h48M74 92h56M74 108h30', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 34, cy: 72, r: 18 }, 'red', { accent: true }),
    s('path', { d: 'M34 54q2-8 8-10', ...SW(3) }, 'brown', { stroke: true }),
    s('rect', { x: 100, y: 96, width: 12, height: 50, rx: 2, transform: 'rotate(40 106 121)' }, 'yellow'),
    s('path', { d: 'M88 140l-4 8 8-2z' }, 'dark')
  ],
  'evolución': [
    ground(132),
    ...lean(30, 128, 50, 'brown', { h: 30, w: 20, r: 10 }),
    ...lean(78, 128, 25, 'tan', { h: 38, w: 22, r: 11 }),
    ...lean(126, 128, 0, 'blue', { h: 48, w: 24, r: 12, accent: true }),
    s('path', { d: 'M24 146h108M122 140l10 6-10 6', ...SW(4) }, 'orange', { stroke: true })
  ],
  'indígena': [
    s('circle', { cx: 124, cy: 32, r: 14 }, 'yellow'),
    s('rect', { x: 14, y: 110, width: 132, height: 32, rx: 4 }, 'brown'),
    s('path', { d: 'M74 110l-14 26M74 110l-4 22M86 110l6 24M86 110l18 22M80 110v28', ...SW(3) }, 'tan', { stroke: true }),
    ...person(80, 110, 'green', { h: 48, w: 32, r: 15, accent: true }),
    s('path', { d: 'M28 110V80q-12-4-10-18 8 2 10 12 4-14 14-14 0 14-12 20', ...SW(4) }, 'green', { stroke: true })
  ],
  infantil: [
    ground(),
    s('rect', { x: 22, y: 100, width: 36, height: 36, rx: 4 }, 'red', { accent: true }),
    s('rect', { x: 58, y: 100, width: 36, height: 36, rx: 4 }, 'blue'),
    s('rect', { x: 40, y: 64, width: 36, height: 36, rx: 4 }, 'yellow'),
    s('path', { d: dots([[40, 118], [76, 118], [58, 82]], 6) }, 'white'),
    s('circle', { cx: 120, cy: 116, r: 20 }, 'pink'),
    s('path', { d: 'M102 108q18 10 36 0', ...SW(4) }, 'white', { stroke: true }),
    s('path', { d: 'M118 46v28M104 40a14 14 0 1 0 28 0a14 14 0 1 0-28 0', ...SW(5) }, 'green', { stroke: true })
  ],
  guardia: [
    ground(),
    s('path', { d: 'M92 44l24-16 24 16z' }, 'dark'),
    s('rect', { x: 96, y: 44, width: 40, height: 92 }, 'red'),
    s('rect', { x: 104, y: 58, width: 24, height: 26, rx: 2 }, 'sky'),
    ...person(56, 138, 'navy', { h: 56, w: 36, r: 15, accent: true }),
    s('path', { d: 'M40 58q16-22 32 0zM38 58h36' }, 'navy'),
    s('path', { d: star(56, 98, 7) + 'M53 50h6v-5h-6z' }, 'yellow')
  ],
  juventud: [
    s('ellipse', { cx: 80, cy: 140, rx: 26, ry: 5 }, 'gray'),
    s('path', { d: 'M72 110l-16 18M88 110l16 18', ...SW(8) }, 'dark', { stroke: true }),
    ...person(80, 112, 'orange', { h: 44, w: 30, r: 14, accent: true }),
    s('path', { d: 'M68 74 48 36M92 74l20-38', ...SW(8) }, 'skin', { stroke: true }),
    s('path', { d: 'M74 58q6 6 12 0', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: star(30, 60, 8) + star(130, 60, 8) + star(80, 22, 6) }, 'yellow')
  ],
  probable: [
    s('rect', { x: 20, y: 50, width: 56, height: 56, rx: 10, transform: 'rotate(-12 48 78)' }, 'white'),
    s('rect', { x: 20, y: 50, width: 56, height: 56, rx: 10, transform: 'rotate(-12 48 78)', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: dots([[34, 64], [48, 78], [62, 92]], 6), transform: 'rotate(-12 48 78)' }, 'dark'),
    s('rect', { x: 84, y: 66, width: 56, height: 56, rx: 10, transform: 'rotate(14 112 94)' }, 'red', { accent: true }),
    s('path', { d: dots([[98, 80], [126, 80], [98, 108], [126, 108], [112, 94]], 6), transform: 'rotate(14 112 94)' }, 'white'),
    s('path', { d: 'M40 30l6 8M72 24v10M100 34l-6 8', ...SW(4) }, 'orange', { stroke: true })
  ],
  producir: [
    s('rect', { x: 14, y: 40, width: 52, height: 82, rx: 6 }, 'gray'),
    ...gear(40, 70, 10, 8, 'yellow', { accent: true }),
    s('rect', { x: 28, y: 98, width: 24, height: 24 }, 'dark'),
    s('rect', { x: 58, y: 106, width: 88, height: 14, rx: 7 }, 'dark'),
    s('path', { d: dots([[70, 113], [88, 113], [106, 113], [124, 113], [140, 113]], 4) }, 'gray'),
    s('path', { d: rects([[76, 80, 24, 24], [114, 80, 24, 24]]) }, 'tan'),
    s('path', { d: 'M88 80v24M126 80v24', ...SW(4) }, 'brown', { stroke: true })
  ],
  sencillo: [
    s('path', { d: 'M30 60q10-40 26-10t10-20 22 20-14 10 26-24 18 16 22-8', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M30 104h100', ...SW(8) }, 'green', { stroke: true, accent: true }),
    s('path', { d: dots([[24, 60], [24, 104]], 9) }, 'blue'),
    s('path', { d: dots([[136, 60], [136, 104]], 9) }, 'red'),
    s('path', { d: 'M118 132l8 8 16-16', ...SW(5) }, 'green', { stroke: true })
  ],
  archivo: [
    s('path', { d: 'M18 46h40l8 10h76v76H18z' }, 'orange'),
    s('rect', { x: 34, y: 34, width: 76, height: 70, rx: 2 }, 'white'),
    outline({ x: 34, y: 34, width: 76, height: 70, rx: 2 }),
    s('path', { d: 'M44 48h50M44 60h56M44 72h40', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M14 72h132l-8 62H22z' }, 'yellow', { accent: true }),
    s('rect', { x: 60, y: 92, width: 40, height: 14, rx: 3 }, 'cream')
  ],
  aumentar: [
    s('path', { d: 'M22 20v114h120', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: rects([[34, 108, 16, 26], [60, 92, 16, 42], [86, 76, 16, 58], [112, 54, 16, 80]]) }, 'sky'),
    s('path', { d: 'M32 104l28-24 22 12 46-56', ...SW(7) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M108 34l22-4-2 22', ...SW(7) }, 'green', { stroke: true })
  ],
  establecer: [
    ground(),
    s('path', { d: 'M36 24v112M36 30h96M36 30l20 18', ...SW(6) }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M112 30v26', ...SW(2) }, 'dark', { stroke: true }),
    s('rect', { x: 98, y: 56, width: 28, height: 16 }, 'red'),
    s('path', { d: rects([[66, 114, 28, 18], [96, 114, 28, 18], [66, 94, 28, 18], [96, 94, 28, 18], [81, 76, 28, 16]]) }, 'red'),
    s('path', { d: 'M62 136h68', ...SW(6) }, 'gray', { stroke: true })
  ],
  moneda: [
    s('circle', { cx: 56, cy: 92, r: 38 }, 'gray'),
    s('circle', { cx: 56, cy: 92, r: 29, ...SW(4) }, 'white', { stroke: true, lineColor: 'gray' }),
    s('circle', { cx: 102, cy: 66, r: 42 }, 'yellow', { accent: true }),
    s('circle', { cx: 102, cy: 66, r: 32, ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: star(102, 66, 16) }, 'orange'),
    s('path', { d: 'M136 112l8 6M128 124l4 10M28 38l6 8', ...SW(4) }, 'orange', { stroke: true })
  ],
  motor: [
    s('path', { d: rects([[42, 30, 20, 22], [70, 30, 20, 22], [98, 30, 20, 22]]) }, 'dark'),
    s('rect', { x: 34, y: 50, width: 92, height: 68, rx: 6 }, 'gray', { accent: true }),
    s('path', { d: 'M48 64h64M48 80h64M48 96h64', ...SW(4) }, 'white', { stroke: true }),
    s('rect', { x: 20, y: 64, width: 16, height: 40, rx: 3 }, 'red'),
    ...gear(128, 120, 10, 8, 'orange'),
    s('path', { d: 'M22 30l8 8M14 48h10M54 140h40', ...SW(4) }, 'dark', { stroke: true })
  ],
  occidental: [
    backdrop('orange', 14, 92),
    s('circle', { cx: 46, cy: 106, r: 26 }, 'yellow', { accent: true }),
    s('rect', { x: 14, y: 106, width: 132, height: 40, rx: 0 }, 'navy'),
    s('path', { d: 'M24 118h40M90 124h40M40 134h50', ...SW(3) }, 'sky', { stroke: true }),
    s('path', { d: 'M136 48H72M88 32 72 48l16 16', ...SW(8) }, 'white', { stroke: true, lineColor: 'dark' })
  ],
  permanente: [
    s('path', { d: 'M80 76c-14-20-46-20-46 0s32 20 46 0 46-20 46 0-32 20-46 0z', ...SW(12) }, 'purple', { stroke: true, accent: true }),
    s('path', { d: 'M24 136q8-22 30-24h52q22 2 30 24z' }, 'gray'),
    s('path', { d: 'M50 124h20M88 120h24', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: star(80, 30, 9) }, 'yellow')
  ]
};
