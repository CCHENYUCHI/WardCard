// Illustration specs (see server/scripts/lexicon/art.js)
const { s } = require("../../../scripts/lexicon/art");

const SW = (w, extra = {}) => ({ fill: 'none', 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra });
// A round plate seen from above, centred at (cx, cy)
const plate = (cx = 80, cy = 96, r = 46) => [
  s('circle', { cx, cy, r }, 'white'),
  s('circle', { cx, cy, r: r - 10 }, 'gray', { flatOnly: true }),
  s('circle', { cx, cy, r: r - 12 }, 'white', { flatOnly: true })
];
// A plate seen from the side (oval)
const dish = (cy = 118, rx = 64, ry = 18) => [s('ellipse', { cx: 80, cy, rx, ry }, 'white'), s('ellipse', { cx: 80, cy: cy - 2, rx: rx - 14, ry: ry - 6 }, 'gray', { flatOnly: true })];
const steam = (x = 80, y = 40) => s('path', { d: `M${x - 16} ${y + 8}q-6-8 0-16t0-16M${x} ${y + 4}q-6-8 0-16t0-16M${x + 16} ${y + 8}q-6-8 0-16t0-16`, ...SW(4) }, 'gray', { stroke: true });

module.exports = {
  comida: [
    ...plate(80, 92),
    s('path', { d: 'M58 104c-10-16 2-38 22-38 18 0 26 18 16 30l14 14-6 6-14-14c-12 8-26 10-32 2z' }, 'brown', { accent: true }),
    s('circle', { cx: 114, cy: 118, r: 6 }, 'white'), s('circle', { cx: 120, cy: 112, r: 6 }, 'white'),
    s('circle', { cx: 100, cy: 70, r: 8 }, 'green'), s('circle', { cx: 110, cy: 80, r: 7 }, 'green'),
    s('circle', { cx: 60, cy: 70, r: 7 }, 'red')
  ],
  desayuno: [
    s('path', { d: 'M54 60a26 26 0 0 1 52 0z' }, 'orange'),
    s('path', { d: 'M80 26v-10M52 38l-7-7M108 38l7-7M24 60h112', ...SW(4) }, 'yellow', { stroke: true }),
    ...dish(112),
    s('path', { d: 'M52 108c-6-14 10-22 22-18 10-8 30-4 32 8 10 4 6 16-6 16H60c-6 0-8-2-8-6z' }, 'cream'),
    s('circle', { cx: 80, cy: 104, r: 10 }, 'yellow', { accent: true })
  ],
  almuerzo: [
    s('circle', { cx: 80, cy: 34, r: 16 }, 'yellow', { accent: true }),
    s('path', { d: 'M80 8v4M80 56v4M54 34h4M102 34h4M62 16l3 3M98 16l-3 3M62 52l3-3M98 52l-3-3', ...SW(4) }, 'orange', { stroke: true }),
    ...dish(120),
    s('path', { d: 'M46 116c0-14 14-22 26-22s20 8 20 22z' }, 'cream'),
    s('path', { d: 'M86 116c2-12 10-18 20-16 8 2 12 8 12 16z' }, 'brown'),
    s('circle', { cx: 116, cy: 108, r: 6 }, 'green')
  ],
  cena: [
    s('path', { d: 'M62 18a24 24 0 1 0 30 34 30 30 0 0 1-30-34z' }, 'yellow', { accent: true }),
    s('path', { d: 'M120 22l3 7 7 3-7 3-3 7-3-7-7-3 7-3zM132 58l2 4 4 2-4 2-2 4-2-4-4-2 4-2z' }, 'yellow'),
    ...dish(122),
    s('path', { d: 'M50 118c-4-12 8-22 30-22s36 8 30 22z' }, 'brown'),
    s('path', { d: 'M62 110q18-8 36 0', ...SW(3) }, 'tan', { stroke: true, flatOnly: true }),
    s('circle', { cx: 112, cy: 114, r: 7 }, 'green')
  ],
  pan: [
    s('path', { d: 'M22 110c0-34 26-56 58-56s58 22 58 56c0 12-8 18-18 18H40c-10 0-18-6-18-18z' }, 'tan', { accent: true }),
    s('path', { d: 'M56 74l-10 22M84 68l-10 26M112 74l-10 22', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M28 116h104', ...SW(3, { opacity: 0.4 }) }, 'brown', { stroke: true, flatOnly: true })
  ],
  arroz: [
    s('path', { d: 'M38 46l70 32M50 38l66 40', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 84c0-26 18-38 40-38s40 12 40 38z' }, 'cream'),
    s('path', { d: 'M24 84h112c0 32-24 52-56 52S24 116 24 84z' }, 'red', { accent: true }),
    s('path', { d: 'M40 104h80', ...SW(4) }, 'white', { stroke: true, flatOnly: true }),
    s('rect', { x: 64, y: 134, width: 32, height: 8, rx: 3 }, 'red')
  ],
  pasta: [
    ...plate(80, 88),
    s('path', { d: 'M54 92c0-18 12-28 26-28s26 10 26 28-12 26-26 26-26-8-26-26z' }, 'yellow', { accent: true }),
    s('path', { d: 'M62 86c8-14 28-14 36 0M60 98c10 12 30 12 40 0M70 80c10 18 16 18 22 26', ...SW(3) }, 'orange', { stroke: true }),
    s('circle', { cx: 80, cy: 88, r: 12 }, 'red'),
    s('path', { d: 'M132 34v68M126 34v20a6 6 0 0 0 12 0V34', ...SW(4) }, 'gray', { stroke: true })
  ],
  carne: [
    s('path', { d: 'M30 82c0-28 30-44 62-40 30 4 44 26 38 50-6 26-36 38-64 32-22-4-36-20-36-42z' }, 'white'),
    s('path', { d: 'M40 84c0-22 24-34 50-30 24 4 34 20 30 38-4 20-28 28-50 24-18-4-30-14-30-32z' }, 'red', { accent: true }),
    s('path', { d: 'M56 78q16-8 26 4M78 104q14 4 24-8', ...SW(3) }, 'pink', { stroke: true }),
    s('circle', { cx: 98, cy: 78, r: 9 }, 'cream')
  ],
  pollo: [
    ...dish(124, 70, 18),
    s('path', { d: 'M34 104c0-30 22-48 50-48s46 18 46 44c0 12-8 20-20 20H52c-12 0-18-6-18-16z' }, 'orange', { accent: true }),
    s('path', { d: 'M110 74c10-6 22-4 24 6 2 8-6 14-16 12z' }, 'brown'),
    s('circle', { cx: 138, cy: 76, r: 6 }, 'white'),
    s('path', { d: 'M54 76c-10-8-22-6-24 4-2 8 6 14 16 12z' }, 'brown'),
    s('circle', { cx: 26, cy: 78, r: 6 }, 'white'),
    s('path', { d: 'M62 86q22-12 40 0', ...SW(3, { opacity: 0.5 }) }, 'white', { stroke: true, flatOnly: true })
  ],
  pescado: [
    ...dish(116, 70, 22),
    s('path', { d: 'M28 102c18-26 58-30 82-6-24 24-64 20-82 6z' }, 'sky', { accent: true }),
    s('path', { d: 'M108 98l26-18v36z' }, 'blue'),
    s('circle', { cx: 46, cy: 96, r: 4 }, 'dark'),
    s('path', { d: 'M66 86q6 10 0 20M80 84q6 12 0 24', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M90 76c4-12 14-16 22-12', ...SW(5) }, 'yellow', { stroke: true, flatOnly: true })
  ],
  'jamón': [
    s('path', { d: 'M40 120c-20-20-12-60 20-78 26-14 54-6 62 12 6 14-2 30-18 42L70 124c-10 8-22 6-30-4z' }, 'brown', { accent: true }),
    s('ellipse', { cx: 82, cy: 66, rx: 30, ry: 22, transform: 'rotate(-30 82 66)' }, 'pink'),
    s('ellipse', { cx: 78, cy: 70, rx: 12, ry: 8, transform: 'rotate(-30 78 70)' }, 'cream'),
    s('path', { d: 'M74 122l40 22', ...SW(10) }, 'tan', { stroke: true }),
    s('rect', { x: 110, y: 136, width: 22, height: 14, rx: 4, transform: 'rotate(30 121 143)' }, 'dark')
  ],
  huevo: [
    s('ellipse', { cx: 80, cy: 138, rx: 40, ry: 8, opacity: 0.4 }, 'gray', { flatOnly: true }),
    s('path', { d: 'M80 22c-28 0-48 46-48 74 0 28 22 42 48 42s48-14 48-42c0-28-20-74-48-74z' }, 'cream', { accent: true }),
    s('ellipse', { cx: 62, cy: 72, rx: 8, ry: 16, transform: 'rotate(20 62 72)', opacity: 0.8 }, 'white', { flatOnly: true })
  ],
  queso: [
    s('path', { d: 'M18 86 112 40l30 34v50H18z', 'stroke-linejoin': 'round' }, 'yellow', { accent: true }),
    s('path', { d: 'M18 86l124-12', ...SW(3) }, 'orange', { stroke: true }),
    s('circle', { cx: 48, cy: 106, r: 9 }, 'orange'), s('circle', { cx: 92, cy: 112, r: 6 }, 'orange'),
    s('circle', { cx: 120, cy: 98, r: 8 }, 'orange'), s('circle', { cx: 74, cy: 96, r: 4 }, 'orange'),
    s('ellipse', { cx: 128, cy: 58, rx: 4, ry: 2 }, 'orange')
  ],
  leche: [
    s('path', { d: 'M40 58 54 30h44l14 28v84H40z', 'stroke-linejoin': 'round' }, 'white'),
    s('path', { d: 'M40 58 54 30h44l14 28z', 'stroke-linejoin': 'round' }, 'blue', { accent: true }),
    s('rect', { x: 40, y: 82, width: 72, height: 30 }, 'sky'),
    s('path', { d: 'M62 20h28v10H62z' }, 'blue'),
    s('path', { d: 'M114 92h32l-4 50h-24z' }, 'white'),
    s('path', { d: 'M115 104h30l-3 38h-24z' }, 'cream', { flatOnly: true })
  ],
  mantequilla: [
    ...dish(118, 66, 18),
    s('path', { d: 'M34 94l22-22h66l-14 22z' }, 'cream'),
    s('path', { d: 'M34 94h74v22H34z' }, 'yellow', { accent: true }),
    s('path', { d: 'M108 94l14-22v22l-14 22z' }, 'orange'),
    s('path', { d: 'M90 60l46-26', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M136 34l12-8', ...SW(8) }, 'brown', { stroke: true })
  ],
  aceite: [
    s('path', { d: 'M70 16h20v16l10 18v86a8 8 0 0 1-8 8H68a8 8 0 0 1-8-8V50l10-18z' }, 'yellow', { accent: true }),
    s('rect', { x: 68, y: 10, width: 24, height: 10, rx: 3 }, 'green'),
    s('rect', { x: 60, y: 76, width: 40, height: 40 }, 'cream'),
    s('ellipse', { cx: 80, cy: 96, rx: 8, ry: 11 }, 'green'),
    s('path', { d: 'M80 85c6-6 12-6 14-4', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M120 112c-8 12-12 18-12 24a12 12 0 0 0 24 0c0-6-4-12-12-24z' }, 'yellow')
  ],
  sal: [
    s('path', { d: 'M54 56c0-18 12-28 26-28s26 10 26 28z' }, 'gray'),
    s('circle', { cx: 72, cy: 42, r: 3 }, 'dark'), s('circle', { cx: 88, cy: 42, r: 3 }, 'dark'), s('circle', { cx: 80, cy: 34, r: 3 }, 'dark'),
    s('path', { d: 'M54 56h52l8 84H46z' }, 'cream'),
    s('path', { d: 'M50 100h60l4 40H46z' }, 'sky', { accent: true }),
    s('path', { d: 'M126 70l4 4M136 84l4 4M124 96l4 4M30 76l4 4', ...SW(4) }, 'gray', { stroke: true })
  ],
  pimienta: [
    s('rect', { x: 66, y: 16, width: 28, height: 14, rx: 5 }, 'dark'),
    s('path', { d: 'M60 30h40c-4 24-4 42 8 58-8 22-8 38-4 52H56c4-14 4-30-4-52 12-16 12-34 8-58z' }, 'brown', { accent: true }),
    s('path', { d: 'M62 88h36', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 124, cy: 128, r: 6 }, 'black'), s('circle', { cx: 136, cy: 116, r: 5 }, 'black'),
    s('circle', { cx: 138, cy: 134, r: 5 }, 'black'), s('circle', { cx: 28, cy: 130, r: 5 }, 'black')
  ],
  sopa: [
    steam(80, 40),
    s('path', { d: 'M20 80h120c0 36-26 58-60 58S20 116 20 80z' }, 'blue', { accent: true }),
    s('ellipse', { cx: 80, cy: 80, rx: 60, ry: 12 }, 'white'),
    s('ellipse', { cx: 80, cy: 80, rx: 52, ry: 8 }, 'orange'),
    s('circle', { cx: 64, cy: 79, r: 4 }, 'green'), s('circle', { cx: 92, cy: 81, r: 4 }, 'red'),
    s('path', { d: 'M108 78l30-40', ...SW(6) }, 'gray', { stroke: true })
  ],
  ensalada: [
    s('circle', { cx: 56, cy: 70, r: 22 }, 'green'), s('circle', { cx: 84, cy: 60, r: 24 }, 'mint'),
    s('circle', { cx: 110, cy: 72, r: 20 }, 'green'),
    s('circle', { cx: 70, cy: 64, r: 10 }, 'red'), s('circle', { cx: 100, cy: 60, r: 9 }, 'red'),
    s('path', { d: 'M18 80h124c0 34-28 56-62 56S18 114 18 80z' }, 'sky', { accent: true }),
    s('path', { d: 'M32 96h96', ...SW(4) }, 'white', { stroke: true, flatOnly: true })
  ],
  bocadillo: [
    s('path', { d: 'M14 94c0-14 14-22 30-22h72c16 0 30 8 30 22z' }, 'tan', { accent: true }),
    s('path', { d: 'M18 96h124l-6 10H24z' }, 'green'),
    s('path', { d: 'M20 104h120v8H20z' }, 'pink'),
    s('path', { d: 'M22 112h116v6H22z' }, 'yellow'),
    s('path', { d: 'M18 118h124c0 10-10 16-26 16H44c-16 0-26-6-26-16z' }, 'tan'),
    s('path', { d: 'M44 80l10-6M76 78l10-6M108 80l10-6', ...SW(4) }, 'brown', { stroke: true })
  ],
  tortilla: [
    ...plate(80, 88, 56),
    s('path', { d: 'M80 88 80 46a42 42 0 1 1-36.4 63z' }, 'yellow', { accent: true }),
    s('path', { d: 'M80 88 49 51a42 42 0 0 1 31-5z' }, 'yellow', { transform: 'translate(-8 -8)' }),
    s('circle', { cx: 100, cy: 80, r: 4 }, 'orange'), s('circle', { cx: 90, cy: 108, r: 4 }, 'orange'),
    s('circle', { cx: 112, cy: 104, r: 3 }, 'orange'), s('circle', { cx: 66, cy: 104, r: 3 }, 'orange')
  ],
  paella: [
    s('path', { d: 'M10 84h20M130 84h20', ...SW(10) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 80, cy: 88, rx: 56, ry: 44 }, 'dark'),
    s('ellipse', { cx: 80, cy: 86, rx: 48, ry: 36 }, 'yellow', { accent: true }),
    s('path', { d: 'M54 74c8-8 18-6 18 2M88 100c8-8 18-6 18 2', ...SW(6) }, 'pink', { stroke: true }),
    s('path', { d: 'M92 66h20M50 98l14 6', ...SW(5) }, 'red', { stroke: true }),
    s('circle', { cx: 74, cy: 96, r: 5 }, 'green'),
    s('path', { d: 'M100 74a12 12 0 0 1 16 16z' }, 'yellow')
  ],
  fruta: [
    s('path', { d: 'M28 50c18 4 50 2 66-18 4 6 2 16-6 26-20 20-50 10-60-8z' }, 'yellow'),
    s('path', { d: 'M54 76c-12-8-30-4-30 16 0 22 16 36 30 32 14 4 30-10 30-32 0-20-18-24-30-16z' }, 'red', { accent: true }),
    s('path', { d: 'M54 76c0-6 2-12 6-16', ...SW(4) }, 'brown', { stroke: true }),
    s('circle', { cx: 104, cy: 84, r: 10 }, 'purple'), s('circle', { cx: 124, cy: 84, r: 10 }, 'purple'),
    s('circle', { cx: 114, cy: 102, r: 10 }, 'purple'), s('circle', { cx: 134, cy: 102, r: 10 }, 'purple'),
    s('circle', { cx: 124, cy: 120, r: 10 }, 'purple'),
    s('path', { d: 'M114 74l6-12', ...SW(4) }, 'green', { stroke: true })
  ],
  naranja: [
    s('circle', { cx: 80, cy: 88, r: 50 }, 'orange', { accent: true }),
    s('path', { d: 'M80 40c0-8 2-14 6-18', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M86 34c10-14 30-14 36-8-8 12-24 14-36 8z' }, 'green'),
    s('ellipse', { cx: 60, cy: 72, rx: 8, ry: 13, opacity: 0.4 }, 'white', { flatOnly: true }),
    s('circle', { cx: 96, cy: 104, r: 2 }, 'yellow', { flatOnly: true }), s('circle', { cx: 106, cy: 90, r: 2 }, 'yellow', { flatOnly: true })
  ],
  'plátano': [
    s('path', { d: 'M30 52c4 52 44 82 104 64 6-2 6-10 0-12-46 8-76-14-84-56-2-10-20-10-20 4z' }, 'yellow', { accent: true }),
    s('path', { d: 'M40 70c12 30 40 44 80 40', ...SW(3) }, 'orange', { stroke: true }),
    s('path', { d: 'M30 52l-4-16 14-2 6 12z' }, 'brown'),
    s('circle', { cx: 138, cy: 110, r: 4 }, 'dark')
  ],
  fresa: [
    s('path', { d: 'M80 140c-30-16-50-46-46-72 4-20 26-24 46-18 20-6 42-2 46 18 4 26-16 56-46 72z' }, 'red', { accent: true }),
    s('path', { d: 'M80 52 64 34l16 6 4-18 6 18 18-4-16 14 14 10-22-4-10 12z' }, 'green'),
    s('path', { d: 'M58 74v2M80 72v2M102 74v2M68 94v2M92 94v2M80 114v2M60 110v2M100 110v2', ...SW(4) }, 'cream', { stroke: true })
  ],
  uva: [
    s('path', { d: 'M80 34c0-10 4-18 10-22', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M86 30c14-18 40-14 46-6-10 16-34 16-46 6z' }, 'green'),
    s('circle', { cx: 62, cy: 50, r: 14 }, 'purple', { accent: true }), s('circle', { cx: 90, cy: 50, r: 14 }, 'purple', { accent: true }),
    s('circle', { cx: 50, cy: 76, r: 14 }, 'purple'), s('circle', { cx: 78, cy: 76, r: 14 }, 'purple'), s('circle', { cx: 106, cy: 74, r: 14 }, 'purple'),
    s('circle', { cx: 64, cy: 102, r: 14 }, 'purple'), s('circle', { cx: 92, cy: 100, r: 14 }, 'purple'),
    s('circle', { cx: 78, cy: 126, r: 14 }, 'purple')
  ],
  'limón': [
    s('path', { d: 'M18 84c10-4 14-30 50-38 36-8 62 8 70 30 6 2 6 10 0 12-10 26-42 40-76 30-26-8-36-26-44-28-4-2-4-4 0-6z' }, 'yellow', { accent: true }),
    s('ellipse', { cx: 62, cy: 70, rx: 14, ry: 6, transform: 'rotate(-12 62 70)', opacity: 0.6 }, 'white', { flatOnly: true }),
    s('path', { d: 'M94 48c8-14 22-18 32-14-6 12-20 18-32 14z' }, 'green')
  ],
  pera: [
    s('path', { d: 'M80 38c-14 0-20 12-20 26 0 14-24 26-24 48 0 22 20 34 44 34s44-12 44-34c0-22-24-34-24-48 0-14-6-26-20-26z' }, 'green', { accent: true }),
    s('path', { d: 'M80 40c0-10 2-18 6-24', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M86 26c8-10 22-10 28-6-6 10-18 12-28 6z' }, 'green'),
    s('ellipse', { cx: 58, cy: 108, rx: 7, ry: 14, opacity: 0.4 }, 'white', { flatOnly: true })
  ],
  'melón': [
    s('ellipse', { cx: 72, cy: 76, rx: 54, ry: 46 }, 'mint'),
    s('path', { d: 'M36 50q36 20 72 0M26 76q46 22 92 0M36 102q36-20 72 0M72 30v92', ...SW(3) }, 'green', { stroke: true }),
    s('path', { d: 'M86 106h64a32 32 0 0 1-64 0z' }, 'orange', { accent: true }),
    s('path', { d: 'M86 106h64', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M104 114h28', ...SW(3, { 'stroke-dasharray': '2 6' }) }, 'cream', { stroke: true })
  ],
  'sandía': [
    s('path', { d: 'M14 64h132a66 66 0 0 1-132 0z' }, 'green'),
    s('path', { d: 'M24 64h112a56 56 0 0 1-112 0z' }, 'mint'),
    s('path', { d: 'M30 64h100a50 50 0 0 1-100 0z' }, 'red', { accent: true }),
    s('ellipse', { cx: 56, cy: 80, rx: 3, ry: 5 }, 'black'), s('ellipse', { cx: 80, cy: 88, rx: 3, ry: 5 }, 'black'),
    s('ellipse', { cx: 104, cy: 80, rx: 3, ry: 5 }, 'black'), s('ellipse', { cx: 68, cy: 100, rx: 3, ry: 5 }, 'black'),
    s('ellipse', { cx: 94, cy: 100, rx: 3, ry: 5 }, 'black')
  ],
  'piña': [
    s('path', { d: 'M80 52 60 18l14 10 6-16 6 16 14-10z' }, 'green'),
    s('path', { d: 'M80 52 46 34l10 18M80 52l34-18-10 18', ...SW(6) }, 'green', { stroke: true }),
    s('ellipse', { cx: 80, cy: 98, rx: 36, ry: 48 }, 'yellow', { accent: true }),
    s('path', { d: 'M52 66l56 56M46 90l40 40M66 56l46 46M108 66l-56 56M114 90l-40 40M94 56l-46 46', ...SW(3) }, 'orange', { stroke: true })
  ],
  tomate: [
    s('path', { d: 'M80 46c-30 0-52 18-52 46 0 28 24 44 52 44s52-16 52-44c0-28-22-46-52-46z' }, 'red', { accent: true }),
    s('path', { d: 'M80 52 62 40l12 0-6-12 12 8 8-12 2 14 14-4-10 10 16 4z' }, 'green'),
    s('path', { d: 'M80 40v-12', ...SW(4) }, 'green', { stroke: true }),
    s('ellipse', { cx: 54, cy: 80, rx: 8, ry: 14, transform: 'rotate(30 54 80)', opacity: 0.4 }, 'white', { flatOnly: true })
  ],
  patata: [
    s('path', { d: 'M24 92c-4-28 22-50 52-48 18 0 26-10 44-6 20 6 26 30 18 52-8 24-34 36-62 32-28-4-50-12-52-30z' }, 'tan', { accent: true }),
    s('circle', { cx: 56, cy: 80, r: 3 }, 'brown'), s('circle', { cx: 98, cy: 64, r: 3 }, 'brown'),
    s('circle', { cx: 112, cy: 100, r: 3 }, 'brown'), s('circle', { cx: 74, cy: 110, r: 3 }, 'brown'),
    s('path', { d: 'M42 98q6 4 10 0M90 86q6 4 10 0', ...SW(3) }, 'brown', { stroke: true })
  ],
  cebolla: [
    s('path', { d: 'M80 18c2 14 6 22 14 30 22 12 38 30 38 54 0 26-22 40-52 40s-52-14-52-40c0-24 16-42 38-54 8-8 12-16 14-30z' }, 'purple', { accent: true }),
    s('path', { d: 'M80 48c-20 20-26 50-14 92M80 48c20 20 26 50 14 92M80 48v92', ...SW(3) }, 'pink', { stroke: true }),
    s('path', { d: 'M66 142h28', ...SW(4) }, 'tan', { stroke: true })
  ],
  ajo: [
    s('path', { d: 'M80 20c-2 14-8 22-18 30-22 10-34 28-34 50 0 26 22 40 52 40s52-14 52-40c0-22-12-40-34-50-10-8-16-16-18-30z' }, 'cream', { accent: true }),
    s('path', { d: 'M80 50c-16 20-18 56-6 90M80 50c16 20 18 56 6 90M70 54c-26 20-34 54-18 84M90 54c26 20 34 54 18 84', ...SW(3) }, 'tan', { stroke: true }),
    s('path', { d: 'M70 140l-4 8M80 140v8M90 140l4 8', ...SW(3) }, 'tan', { stroke: true })
  ],
  zanahoria: [
    s('path', { d: 'M96 52c-20-4-56 30-78 88 56-26 86-58 82-80z' }, 'orange', { accent: true }),
    s('path', { d: 'M70 76l10 6M54 98l10 6M40 118l8 4', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M96 54c4-22 8-34 12-40M100 58c14-12 28-18 40-18M98 56c12-20 24-28 34-32', ...SW(6) }, 'green', { stroke: true })
  ],
  lechuga: [
    s('circle', { cx: 80, cy: 90, r: 52 }, 'green', { accent: true }),
    s('path', { d: 'M38 82c10-20 30-30 42-30 20 0 38 14 42 34-10-8-22-10-30-6-6-12-26-14-34 0-8-4-14-2-20 2z' }, 'mint'),
    s('circle', { cx: 80, cy: 98, r: 24 }, 'mint'),
    s('path', { d: 'M80 76v44M66 92l14 10M94 92l-14 10', ...SW(3) }, 'green', { stroke: true })
  ],
  verdura: [
    s('rect', { x: 34, y: 82, width: 18, height: 50, rx: 6 }, 'mint'),
    s('path', { d: 'M18 70a14 14 0 0 1 16-24 16 16 0 0 1 28 0 14 14 0 0 1 16 24 14 14 0 0 1-12 18H30a14 14 0 0 1-12-18z' }, 'green', { accent: true }),
    s('path', { d: 'M126 52c-14-4-36 22-46 82 34-24 52-56 46-82z' }, 'orange'),
    s('path', { d: 'M126 54c2-14 6-24 10-30M126 54c10-8 18-12 26-12', ...SW(5) }, 'green', { stroke: true }),
    s('circle', { cx: 112, cy: 120, r: 16 }, 'red')
  ],
  bebida: [
    s('path', { d: 'M88 46l20-34h14', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M46 46h68l-8 96H54z' }, 'sky'),
    s('path', { d: 'M50 70h60l-6 72H56z' }, 'orange', { accent: true }),
    s('rect', { x: 62, y: 80, width: 14, height: 14, rx: 2 }, 'white'),
    s('rect', { x: 82, y: 92, width: 14, height: 14, rx: 2 }, 'white'),
    s('circle', { cx: 112, cy: 50, r: 14 }, 'yellow'),
    s('path', { d: 'M112 36v28M98 50h28', ...SW(2) }, 'orange', { stroke: true })
  ],
  'café': [
    steam(76, 30),
    s('ellipse', { cx: 76, cy: 128, rx: 60, ry: 14 }, 'sky'),
    s('path', { d: 'M118 72h8a16 16 0 0 1 0 32h-10', ...SW(8) }, 'blue', { stroke: true }),
    s('path', { d: 'M34 66h84v32c0 18-16 30-42 30S34 116 34 98z' }, 'blue'),
    s('ellipse', { cx: 76, cy: 66, rx: 42, ry: 9 }, 'brown', { accent: true })
  ],
  'té': [
    s('path', { d: 'M40 74 18 54', ...SW(8) }, 'green', { stroke: true }),
    s('path', { d: 'M118 80h6a16 16 0 0 1 0 32h-10', ...SW(7) }, 'green', { stroke: true }),
    s('path', { d: 'M36 112c0-32 20-50 44-50s44 18 44 50c0 14-8 22-20 22H56c-12 0-20-8-20-22z' }, 'green', { accent: true }),
    s('path', { d: 'M56 62c0-10 10-16 24-16s24 6 24 16z' }, 'mint'),
    s('circle', { cx: 80, cy: 40, r: 6 }, 'mint'),
    s('path', { d: 'M44 98h72', ...SW(4) }, 'mint', { stroke: true })
  ],
  zumo: [
    s('path', { d: 'M86 40l10-30', ...SW(5) }, 'pink', { stroke: true }),
    s('path', { d: 'M40 40h72l-8 104H48z' }, 'sky'),
    s('path', { d: 'M43 60h66l-6 84H49z' }, 'orange', { accent: true }),
    s('circle', { cx: 116, cy: 44, r: 20 }, 'orange'),
    s('circle', { cx: 116, cy: 44, r: 15 }, 'yellow'),
    s('path', { d: 'M116 29v30M101 44h30M106 34l20 20M126 34l-20 20', ...SW(2) }, 'orange', { stroke: true })
  ],
  cerveza: [
    s('path', { d: 'M108 64h10a16 16 0 0 1 16 16v20a16 16 0 0 1-16 16h-10', ...SW(9) }, 'white', { stroke: true, lineColor: 'dark' }),
    s('rect', { x: 36, y: 50, width: 74, height: 92, rx: 8 }, 'yellow', { accent: true }),
    s('path', { d: 'M30 56a12 12 0 0 1 12-22 18 18 0 0 1 30-6 18 18 0 0 1 30 4 12 12 0 0 1 12 22c-4 6-8 8-14 6-8 6-16 6-22 0-8 6-18 6-24 0-10 6-20 4-24-4z' }, 'cream'),
    s('path', { d: 'M56 76v52M76 76v52M96 76v52', ...SW(4, { opacity: 0.5 }) }, 'orange', { stroke: true, flatOnly: true })
  ],
  vino: [
    s('path', { d: 'M46 22h68c4 40-6 62-34 66-28-4-38-26-34-66z' }, 'sky'),
    s('path', { d: 'M48 46h64c-2 26-12 38-32 42-20-4-30-16-32-42z' }, 'red', { accent: true }),
    s('path', { d: 'M80 88v44', ...SW(6) }, 'gray', { stroke: true }),
    s('ellipse', { cx: 80, cy: 138, rx: 28, ry: 7 }, 'gray')
  ],
  refresco: [
    s('rect', { x: 46, y: 30, width: 68, height: 112, rx: 12 }, 'red', { accent: true }),
    s('rect', { x: 52, y: 22, width: 56, height: 12, rx: 4 }, 'gray'),
    s('rect', { x: 52, y: 136, width: 56, height: 10, rx: 4 }, 'gray'),
    s('path', { d: 'M46 92q17-20 34 0t34 0', ...SW(8) }, 'white', { stroke: true, lineColor: 'dark' }),
    s('circle', { cx: 130, cy: 50, r: 6 }, 'sky'), s('circle', { cx: 138, cy: 70, r: 4 }, 'sky'), s('circle', { cx: 26, cy: 60, r: 5 }, 'sky')
  ],
  chocolate: [
    s('rect', { x: 30, y: 26, width: 100, height: 112, rx: 6 }, 'brown', { accent: true }),
    s('path', { d: 'M30 60h100M30 94h100M63 26v68M97 26v68', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M24 98h112v48H24z' }, 'red'),
    s('path', { d: 'M24 98l10 8 10-8 10 8 10-8 10 8 10-8 10 8 10-8 10 8 10-8 10 8 2-2' , ...SW(3) }, 'yellow', { stroke: true })
  ],
  galleta: [
    s('circle', { cx: 80, cy: 82, r: 54 }, 'tan', { accent: true }),
    s('circle', { cx: 60, cy: 62, r: 7 }, 'brown'), s('circle', { cx: 98, cy: 58, r: 6 }, 'brown'),
    s('circle', { cx: 104, cy: 96, r: 8 }, 'brown'), s('circle', { cx: 66, cy: 104, r: 6 }, 'brown'),
    s('circle', { cx: 82, cy: 82, r: 5 }, 'brown'),
    s('path', { d: 'M130 66a14 14 0 0 1-8 26 14 14 0 0 1-8 22', ...SW(1) }, 'tan', { flatOnly: true, stroke: true })
  ],
  pastel: [
    s('path', { d: 'M80 14c-6 8-6 14 0 18 6-4 6-10 0-18z' }, 'orange'),
    s('rect', { x: 76, y: 32, width: 8, height: 22, rx: 2 }, 'sky'),
    s('rect', { x: 28, y: 54, width: 104, height: 84, rx: 8 }, 'cream'),
    s('path', { d: 'M28 62c0-4 4-8 8-8h88c4 0 8 4 8 8v14c-8 8-14 8-20 0-6 8-14 8-20 0-6 8-14 8-20 0-6 8-14 8-20 0-6 8-14 8-24 0z' }, 'pink', { accent: true }),
    s('rect', { x: 28, y: 100, width: 104, height: 10 }, 'pink'),
    s('rect', { x: 18, y: 136, width: 124, height: 8, rx: 4 }, 'gray')
  ],
  helado: [
    s('path', { d: 'M48 72h64l-32 78z', 'stroke-linejoin': 'round' }, 'tan'),
    s('path', { d: 'M56 84l40 30M72 76l30 22M90 76l-34 26M106 82l-38 30', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M42 74a38 38 0 0 1 76 0c-6 6-12 6-18 0-6 6-14 6-20 0-6 6-14 6-20 0-6 6-12 6-18 0z' }, 'pink', { accent: true }),
    s('circle', { cx: 80, cy: 26, r: 8 }, 'red'),
    s('ellipse', { cx: 62, cy: 52, rx: 6, ry: 10, opacity: 0.5 }, 'white', { flatOnly: true })
  ],
  postre: [
    ...dish(126, 66, 16),
    s('path', { d: 'M44 122l12-58h48l12 58z' }, 'yellow', { accent: true }),
    s('path', { d: 'M56 64h48l3 14c-8 4-12-2-16 4-6-6-10 2-16-2-4 6-12 0-16 2z' }, 'brown'),
    s('path', { d: 'M80 64c0-8 4-14 10-16', ...SW(3) }, 'green', { stroke: true }),
    s('circle', { cx: 80, cy: 58, r: 7 }, 'red')
  ],
  caramelo: [
    s('path', { d: 'M46 80 14 54v52z', 'stroke-linejoin': 'round' }, 'yellow'),
    s('path', { d: 'M114 80l32-26v52z', 'stroke-linejoin': 'round' }, 'yellow'),
    s('circle', { cx: 80, cy: 80, r: 36 }, 'red', { accent: true }),
    s('path', { d: 'M56 56c10 30 20 40 50 50M74 46c4 30 20 40 40 44', ...SW(6) }, 'white', { stroke: true, lineColor: 'red' })
  ],
  miel: [
    s('rect', { x: 32, y: 48, width: 84, height: 18, rx: 4 }, 'red'),
    s('path', { d: 'M36 66h76v60a14 14 0 0 1-14 14H50a14 14 0 0 1-14-14z' }, 'orange', { accent: true }),
    s('path', { d: 'M36 66h76v8c-6 8-10 14-12 4-4-8-10 18-16 8-4-6-8 0-12 6-4 4-8-10-12-4-6 6-10 4-12-2-4-8-8-4-12 0z' }, 'yellow'),
    s('path', { d: 'M100 52l32-34', ...SW(5) }, 'brown', { stroke: true }),
    s('ellipse', { cx: 98, cy: 56, rx: 10, ry: 14, transform: 'rotate(42 98 56)' }, 'brown'),
    s('rect', { x: 48, y: 90, width: 52, height: 28, rx: 4 }, 'cream')
  ],
  yogur: [
    s('path', { d: 'M38 48h84l-10 92H48z' }, 'cream'),
    s('ellipse', { cx: 80, cy: 48, rx: 44, ry: 10 }, 'pink', { accent: true }),
    s('path', { d: 'M43 82h74l-4 34H47z' }, 'sky'),
    s('path', { d: 'M62 96c-6-8 4-14 8-6 4-8 14-2 8 6l-8 8z' }, 'red'),
    s('path', { d: 'M96 44l34-30', ...SW(6) }, 'gray', { stroke: true })
  ],
  plato: [
    s('path', { d: 'M18 40v24m-6-24v18a6 6 0 0 0 12 0V40M18 64v76', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M142 40c8 10 8 30 0 34v66', ...SW(5) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 90, r: 50 }, 'white'),
    s('circle', { cx: 80, cy: 90, r: 34 }, 'sky', { accent: true }),
    s('circle', { cx: 80, cy: 90, r: 30 }, 'white')
  ],
  vaso: [
    s('path', { d: 'M40 28h80l-10 114H50z' }, 'sky'),
    s('path', { d: 'M44 64h72l-7 78H51z' }, 'blue', { accent: true }),
    s('path', { d: 'M52 40l6 60', ...SW(5, { opacity: 0.7 }) }, 'white', { stroke: true, flatOnly: true }),
    s('path', { d: 'M44 64q18 8 36 0t36 0', ...SW(3) }, 'white', { stroke: true, flatOnly: true })
  ],
  taza: [
    s('path', { d: 'M116 64h8a20 20 0 0 1 0 40h-10', ...SW(10) }, 'red', { stroke: true }),
    s('path', { d: 'M34 46h86v68a20 20 0 0 1-20 20H54a20 20 0 0 1-20-20z' }, 'red', { accent: true }),
    s('ellipse', { cx: 77, cy: 46, rx: 43, ry: 8 }, 'brown'),
    s('path', { d: 'M77 106c-14-10-20-18-12-26 4-4 10-2 12 4 2-6 8-8 12-4 8 8 2 16-12 26z' }, 'white')
  ],
  botella: [
    s('path', { d: 'M70 14h20v34c18 8 24 22 24 40v46a10 10 0 0 1-10 10H56a10 10 0 0 1-10-10V88c0-18 6-32 24-40z' }, 'green', { accent: true }),
    s('rect', { x: 68, y: 10, width: 24, height: 10, rx: 3 }, 'dark'),
    s('rect', { x: 46, y: 92, width: 68, height: 30 }, 'cream'),
    s('path', { d: 'M58 62v26', ...SW(6, { opacity: 0.6 }) }, 'white', { stroke: true, flatOnly: true })
  ],
  cuchara: [
    s('ellipse', { cx: 98, cy: 54, rx: 24, ry: 34, transform: 'rotate(40 98 54)' }, 'gray', { accent: true }),
    s('ellipse', { cx: 94, cy: 50, rx: 10, ry: 18, transform: 'rotate(40 94 50)', opacity: 0.6 }, 'white', { flatOnly: true }),
    s('path', { d: 'M78 80 30 136', ...SW(10) }, 'gray', { stroke: true })
  ],
  tenedor: [
    s('path', { d: 'M86 22v34M100 22v34M114 22v34M128 22v34', ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M82 50h50c0 18-10 28-25 28S82 68 82 50z' }, 'gray', { accent: true }),
    s('path', { d: 'M100 76 40 140', ...SW(10) }, 'gray', { stroke: true })
  ],
  cuchillo: [
    s('path', { d: 'M130 18c10 6-30 64-48 78l-12-12c14-20 50-72 60-66z' }, 'gray', { accent: true }),
    s('path', { d: 'M76 90 30 140', ...SW(14) }, 'brown', { stroke: true }),
    s('circle', { cx: 56, cy: 112, r: 3 }, 'tan'), s('circle', { cx: 42, cy: 128, r: 3 }, 'tan')
  ],
  servilleta: [
    s('path', { d: 'M20 124 80 32l60 92z', 'stroke-linejoin': 'round' }, 'sky', { accent: true }),
    s('path', { d: 'M80 32v92', ...SW(3) }, 'blue', { stroke: true }),
    s('path', { d: 'M28 112h104M40 94h80', ...SW(3, { 'stroke-dasharray': '6 6' }) }, 'white', { stroke: true, lineColor: 'blue' }),
    s('path', { d: 'M110 40v28m-6-28v20a6 6 0 0 0 12 0V40M110 68v76', ...SW(4) }, 'gray', { stroke: true })
  ],
  'menú': [
    s('rect', { x: 34, y: 20, width: 92, height: 124, rx: 6 }, 'red', { accent: true }),
    s('rect', { x: 42, y: 28, width: 76, height: 108, rx: 3 }, 'cream'),
    s('path', { d: 'M60 52v12m-5-12v8a5 5 0 0 0 10 0v-8M60 64v8M100 52c5 4 5 12 0 14v6', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M54 88h52M54 102h40M54 116h48', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M74 60a6 6 0 0 1 12 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  cuenta: [
    s('path', { d: 'M38 16h84v124l-10-8-10 8-11-8-11 8-11-8-11 8-11-8-10 8z', 'stroke-linejoin': 'round' }, 'cream'),
    s('path', { d: 'M52 38h56M52 56h40M52 72h48M52 88h36', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M52 110h56', ...SW(5) }, 'dark', { stroke: true }),
    s('circle', { cx: 120, cy: 120, r: 22 }, 'yellow', { accent: true }),
    s('circle', { cx: 120, cy: 120, r: 15 }, 'orange', { flatOnly: true })
  ],
  propina: [
    s('ellipse', { cx: 80, cy: 118, rx: 64, ry: 20 }, 'white'),
    s('ellipse', { cx: 80, cy: 116, rx: 40, ry: 10 }, 'gray', { flatOnly: true }),
    s('ellipse', { cx: 80, cy: 108, rx: 26, ry: 9 }, 'orange'),
    s('ellipse', { cx: 80, cy: 100, rx: 26, ry: 9 }, 'yellow', { accent: true }),
    s('circle', { cx: 100, cy: 58, r: 22 }, 'yellow', { accent: true }),
    s('circle', { cx: 100, cy: 58, r: 14 }, 'orange'),
    s('path', { d: 'M40 40l6 6M30 60h8M44 72l-6 4', ...SW(3) }, 'orange', { stroke: true })
  ],
  receta: [
    s('rect', { x: 22, y: 30, width: 96, height: 112, rx: 6, transform: 'rotate(-6 70 86)' }, 'cream'),
    s('path', { d: 'M38 56h60M40 74h40M42 92h50M44 110h40', ...SW(4, { transform: 'rotate(-6 70 86)' }) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 56l-2 0', ...SW(4) }, 'red', { stroke: true }),
    s('ellipse', { cx: 128, cy: 46, rx: 12, ry: 18, transform: 'rotate(30 128 46)' }, 'brown', { accent: true }),
    s('path', { d: 'M120 60 96 140', ...SW(8) }, 'brown', { stroke: true })
  ],
  hamburguesa: [
    s('path', { d: 'M24 72c0-26 26-42 56-42s56 16 56 42z' }, 'tan', { accent: true }),
    s('path', { d: 'M20 76c10 8 20-4 30 4s20-4 30 4 20-4 30 4 20-4 30 4v-12H20z' }, 'green'),
    s('path', { d: 'M22 84h116l-8 12H30z' }, 'yellow'),
    s('rect', { x: 20, y: 94, width: 120, height: 18, rx: 9 }, 'brown'),
    s('path', { d: 'M24 114h112c0 14-10 20-24 20H48c-14 0-24-6-24-20z' }, 'tan'),
    s('path', { d: 'M56 50h4M80 44h4M104 50h4M68 60h4M94 60h4', ...SW(3) }, 'cream', { stroke: true })
  ],
  pizza: [
    s('path', { d: 'M24 30q56-18 112 0L80 146z', 'stroke-linejoin': 'round' }, 'yellow', { accent: true }),
    s('path', { d: 'M24 30q56-18 112 0l-6 14q-50-16-100 0z' }, 'tan'),
    s('circle', { cx: 64, cy: 60, r: 10 }, 'red'), s('circle', { cx: 96, cy: 62, r: 10 }, 'red'),
    s('circle', { cx: 80, cy: 94, r: 9 }, 'red'),
    s('circle', { cx: 80, cy: 66, r: 4 }, 'green'), s('circle', { cx: 70, cy: 84, r: 3 }, 'green'), s('circle', { cx: 90, cy: 116, r: 3 }, 'green')
  ],
  salchicha: [
    s('path', { d: 'M24 68c20 40 92 44 112 8', ...SW(28) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M38 76c18 24 64 30 86 6', ...SW(5, { opacity: 0.6 }) }, 'tan', { stroke: true, flatOnly: true }),
    s('path', { d: 'M14 60l-6-8M146 70l6-8', ...SW(4) }, 'tan', { stroke: true }),
    s('path', { d: 'M20 110h120', ...SW(4) }, 'gray', { stroke: true })
  ],
  gamba: [
    s('path', { d: 'M120 64c0-26-26-42-52-36-28 6-42 34-34 60 8 24 36 34 58 22', ...SW(26) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M58 34l8 22M38 58l20 10M36 88l22-4M58 112l10-18', ...SW(3) }, 'pink', { stroke: true }),
    s('path', { d: 'M92 110l24 4-6 18z' }, 'orange'),
    s('circle', { cx: 112, cy: 50, r: 4 }, 'dark'),
    s('path', { d: 'M118 44c10-12 22-18 34-18M120 50c12-4 22-4 32 0', ...SW(2) }, 'red', { stroke: true })
  ],
  marisco: [
    s('path', { d: 'M20 116c0-40 18-70 44-70s44 30 44 70z' }, 'pink', { accent: true }),
    s('path', { d: 'M64 46 34 116M64 46l-14 70M64 46v70M64 46l14 70M64 46l30 70', ...SW(3) }, 'red', { stroke: true }),
    s('path', { d: 'M48 116h32l-8 14H56z' }, 'pink'),
    s('ellipse', { cx: 118, cy: 92, rx: 18, ry: 40, transform: 'rotate(20 118 92)' }, 'navy'),
    s('path', { d: 'M108 60q16 30 4 66', ...SW(3) }, 'sky', { stroke: true })
  ],
  'atún': [
    s('path', { d: 'M14 80c26-34 80-40 112 0-32 40-86 34-112 0z' }, 'navy', { accent: true }),
    s('path', { d: 'M22 84c30 18 74 18 100-2-26 24-72 26-100 2z' }, 'gray'),
    s('path', { d: 'M122 80l26-26-8 26 8 26z' }, 'navy'),
    s('path', { d: 'M60 52l14-14 4 16z' }, 'navy'),
    s('path', { d: 'M96 62l4 4M104 68l4 4M96 98l4-4M104 92l4-4', ...SW(4) }, 'yellow', { stroke: true }),
    s('circle', { cx: 36, cy: 76, r: 5 }, 'white'), s('circle', { cx: 36, cy: 76, r: 2.5 }, 'black')
  ],
  'melocotón': [
    s('path', { d: 'M80 50c-28-14-58 4-58 40 0 30 26 50 58 50s58-20 58-50c0-36-30-54-58-40z' }, 'orange', { accent: true }),
    s('path', { d: 'M80 50c-12 20-12 58 6 88', ...SW(4) }, 'red', { stroke: true }),
    s('ellipse', { cx: 108, cy: 86, rx: 18, ry: 26, opacity: 0.45 }, 'pink', { flatOnly: true }),
    s('path', { d: 'M80 52c-2-10 0-18 4-24', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M84 36c10-14 30-14 38-8-8 12-26 14-38 8z' }, 'green')
  ],
  cereza: [
    s('path', { d: 'M54 96c8-30 22-56 52-76M106 96c-2-30 2-56 0-76', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M106 22c10-10 28-10 34-4-8 10-24 12-34 4z' }, 'green'),
    s('circle', { cx: 52, cy: 112, r: 26 }, 'red', { accent: true }),
    s('circle', { cx: 108, cy: 112, r: 26 }, 'red', { accent: true }),
    s('ellipse', { cx: 42, cy: 104, rx: 5, ry: 8, opacity: 0.5 }, 'white', { flatOnly: true }),
    s('ellipse', { cx: 98, cy: 104, rx: 5, ry: 8, opacity: 0.5 }, 'white', { flatOnly: true })
  ],
  kilo: [
    s('circle', { cx: 80, cy: 40, r: 18, fill: 'none', 'stroke-width': 10 }, 'dark', { stroke: true }),
    s('path', { d: 'M48 56h64l22 84H26z', 'stroke-linejoin': 'round' }, 'dark', { accent: true }),
    s('rect', { x: 58, y: 84, width: 44, height: 28, rx: 4 }, 'yellow'),
  ],
  litro: [
    s('path', { d: 'M114 58h8a14 14 0 0 1 14 14v28a14 14 0 0 1-14 14h-8', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 30h76v104a10 10 0 0 1-10 10H48a10 10 0 0 1-10-10V30l-10-8', 'stroke-linejoin': 'round' }, 'sky'),
    s('path', { d: 'M39 66h74v68a10 10 0 0 1-10 10H49a10 10 0 0 1-10-10z' }, 'blue', { accent: true }),
    s('path', { d: 'M88 46h24M96 66h16M88 86h24M96 106h16M88 126h24', ...SW(3) }, 'white', { stroke: true, lineColor: 'blue' })
  ],
  aceituna: [
    s('path', { d: 'M16 50c40 0 80 10 128 40', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M40 52c10-16 28-20 40-14-10 14-28 18-40 14zM100 66c10 12 26 14 38 6-12-10-28-12-38-6z' }, 'mint'),
    s('ellipse', { cx: 56, cy: 92, rx: 18, ry: 24, transform: 'rotate(-12 56 92)' }, 'green', { accent: true }),
    s('ellipse', { cx: 100, cy: 108, rx: 18, ry: 24, transform: 'rotate(10 100 108)' }, 'green', { accent: true }),
    s('circle', { cx: 100, cy: 92, r: 6 }, 'red'),
    s('ellipse', { cx: 50, cy: 84, rx: 4, ry: 7, opacity: 0.5 }, 'white', { flatOnly: true })
  ],
  mermelada: [
    s('rect', { x: 40, y: 30, width: 80, height: 22, rx: 5 }, 'red'),
    s('path', { d: 'M40 30h80v22H40z', ...SW(3, { 'stroke-dasharray': '8 8' }) }, 'white', { stroke: true, flatOnly: true }),
    s('path', { d: 'M44 52h72v76a14 14 0 0 1-14 14H58a14 14 0 0 1-14-14z' }, 'red', { accent: true }),
    s('rect', { x: 54, y: 82, width: 52, height: 34, rx: 4 }, 'cream'),
    s('path', { d: 'M80 110c-10-4-14-12-12-18 2-6 10-6 12-2 2-4 10-4 12 2 2 6-2 14-12 18z' }, 'red'),
    s('path', { d: 'M74 90l6 2 6-2', ...SW(3) }, 'green', { stroke: true })
  ]
};
