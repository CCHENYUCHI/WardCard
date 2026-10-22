// Illustration specs for the body_health theme (see server/scripts/lexicon/art.js)
const { s } = require("../../../scripts/lexicon/art");

const stroke = (d, color, w, extra = {}, opts = {}) =>
  s('path', { d, fill: 'none', 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, color, { stroke: true, ...opts });
const eyes = (x, y, gap, r = 4) => [
  s('circle', { cx: x - gap, cy: y, r }, 'dark'), s('circle', { cx: x + gap, cy: y, r }, 'dark')
];
const ring = (x, y, r) => s('circle', { cx: x, cy: y, r, fill: 'none', 'stroke-width': 5, 'stroke-dasharray': '6 6' }, 'yellow', { stroke: true, accent: true });
const arrowDown = (x, y) => s('path', { d: `M${x} ${y + 22}l-12-14h8v-14h8v14h8z` }, 'red', { accent: true });

module.exports = {
  cuerpo: [
    s('circle', { cx: 80, cy: 30, r: 16 }, 'skin'),
    s('rect', { x: 56, y: 50, width: 48, height: 52, rx: 14 }, 'blue', { accent: true }),
    stroke('M60 60L34 96M100 60l26 36', 'skin', 11),
    s('rect', { x: 58, y: 98, width: 20, height: 46, rx: 8 }, 'navy'),
    s('rect', { x: 82, y: 98, width: 20, height: 46, rx: 8 }, 'navy')
  ],
  cabeza: [
    s('ellipse', { cx: 80, cy: 90, rx: 40, ry: 46 }, 'skin'),
    s('path', { d: 'M38 84q-2-52 42-52t42 52q-12-30-42-26-30-4-42 26z' }, 'brown'),
    s('circle', { cx: 40, cy: 92, r: 8 }, 'skin'), s('circle', { cx: 120, cy: 92, r: 8 }, 'skin'),
    ...eyes(80, 92, 16, 4),
    stroke('M68 116q12 8 24 0', 'dark', 3),
    arrowDown(80, 2)
  ],
  cara: [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'skin', { accent: true }),
    ...eyes(80, 70, 20, 6),
    s('path', { d: 'M80 78q-8 14 0 18q4 0 5-3', fill: 'none', 'stroke-width': 3, 'stroke-linecap': 'round' }, 'brown', { stroke: true }),
    stroke('M58 104q22 20 44 0', 'red', 5),
    s('circle', { cx: 46, cy: 94, r: 8, opacity: 0.6 }, 'pink', { flatOnly: true }),
    s('circle', { cx: 114, cy: 94, r: 8, opacity: 0.6 }, 'pink', { flatOnly: true })
  ],
  ojo: [
    s('path', { d: 'M10 80Q80 14 150 80Q80 146 10 80z' }, 'white'),
    s('circle', { cx: 80, cy: 80, r: 30 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 14 }, 'dark'),
    s('circle', { cx: 72, cy: 72, r: 6 }, 'white', { flatOnly: true }),
    stroke('M10 80Q80 14 150 80Q80 146 10 80z', 'dark', 4),
    stroke('M50 40l-8-14M80 30V12M110 40l8-14', 'dark', 4)
  ],
  oreja: [
    s('path', { d: 'M70 22C34 22 28 66 50 86c10 10 6 24 14 34 10 14 34 8 34-14 0-18 22-24 22-50 0-22-20-34-50-34z' }, 'skin', { accent: true }),
    stroke('M70 44C50 44 50 68 64 82c10 10 2 20 12 26', 'brown', 5),
    stroke('M116 38q14 12 0 26M128 28q22 24 0 46', 'sky', 4)
  ],
  nariz: [
    s('circle', { cx: 80, cy: 80, r: 58 }, 'skin'),
    ...eyes(80, 52, 24, 5),
    s('path', { d: 'M80 56c-6 20-20 36-14 48 4 8 12 8 14 4 2 4 10 4 14-4 6-12-8-28-14-48z' }, 'tan', { accent: true }),
    s('ellipse', { cx: 72, cy: 106, rx: 3, ry: 4 }, 'dark'),
    s('ellipse', { cx: 88, cy: 106, rx: 3, ry: 4 }, 'dark')
  ],
  boca: [
    s('path', { d: 'M12 80Q50 40 80 64Q110 40 148 80Q110 140 80 140Q50 140 12 80z' }, 'red', { accent: true }),
    s('path', { d: 'M28 82Q80 98 132 82Q110 108 80 108Q50 108 28 82z' }, 'white'),
    s('path', { d: 'M60 122q20-26 40 0q-20 12-40 0z' }, 'pink')
  ],
  diente: [
    s('path', { d: 'M40 36C52 22 66 30 80 32c14-2 28-10 40 4 10 14 4 38-2 52-6 16-4 42-16 42-10 0-8-24-22-24s-12 24-22 24c-12 0-10-26-16-42-6-14-12-38-2-52z' }, 'cream', { accent: true }),
    stroke('M40 36C52 22 66 30 80 32c14-2 28-10 40 4', 'gray', 4),
    stroke('M52 52q-2 14 2 26', 'white', 5, {}, { lineColor: 'gray' }),
    s('path', { d: 'M128 22l3 8 8 3-8 3-3 8-3-8-8-3 8-3z' }, 'sky')
  ],
  lengua: [
    s('path', { d: 'M20 60Q80 20 140 60Q140 120 80 120Q20 120 20 60z' }, 'red'),
    s('path', { d: 'M54 78h52v36a26 26 0 0 1-52 0z' }, 'pink', { accent: true }),
    stroke('M80 84v24', 'red', 4),
    s('path', { d: 'M28 62Q80 34 132 62Q80 72 28 62z' }, 'white')
  ],
  pelo: [
    s('circle', { cx: 80, cy: 90, r: 42 }, 'skin'),
    s('path', { d: 'M34 96C26 40 54 24 80 24s54 16 46 72c-4-24-8-34-12-40-20 8-52 8-68 0-4 6-8 16-12 40z' }, 'brown', { accent: true }),
    stroke('M60 40q-6 20 0 38M100 40q6 20 0 38', 'tan', 3),
    ...eyes(80, 96, 15, 4),
    stroke('M70 116q10 8 20 0', 'dark', 3)
  ],
  cuello: [
    s('rect', { x: 62, y: 70, width: 36, height: 40, rx: 8 }, 'skin'),
    s('circle', { cx: 80, cy: 40, r: 28 }, 'skin'),
    s('path', { d: 'M20 144v-12a40 30 0 0 1 40-30h40a40 30 0 0 1 40 30v12z' }, 'blue'),
    s('path', { d: 'M54 88q26 14 52 0v14q-26 14-52 0z' }, 'red', { accent: true }),
    ...eyes(80, 42, 10, 3.5)
  ],
  hombro: [
    s('circle', { cx: 80, cy: 34, r: 20 }, 'skin'),
    s('path', { d: 'M14 144V92a28 28 0 0 1 28-28h76a28 28 0 0 1 28 28v52z' }, 'blue'),
    ring(122, 80, 22),
    s('circle', { cx: 122, cy: 80, r: 7 }, 'yellow')
  ],
  brazo: [
    stroke('M30 134L60 96q6-10 16-6', 'skin', 20),
    s('circle', { cx: 92, cy: 62, r: 26 }, 'skin', { accent: true }),
    stroke('M88 82L66 98', 'skin', 20),
    s('rect', { x: 94, y: 22, width: 36, height: 34, rx: 14, transform: 'rotate(18 112 40)' }, 'skin'),
    stroke('M82 50q10 6 20 0', 'brown', 3)
  ],
  mano: [
    s('path', { d: 'M44 80h72v34a36 30 0 0 1-72 0z' }, 'skin', { accent: true }),
    stroke('M54 80V42M72 78V28M90 78V32M108 80V46', 'skin', 14),
    stroke('M46 104L22 80', 'skin', 14),
    stroke('M62 112q18 12 36 0', 'brown', 3)
  ],
  dedo: [
    stroke('M70 78V26', 'skin', 20, {}, { accent: true }),
    s('rect', { x: 42, y: 74, width: 70, height: 66, rx: 22 }, 'skin'),
    stroke('M112 100q18-8 22 6', 'skin', 14),
    stroke('M56 96h46M56 112h46', 'brown', 3),
    s('path', { d: 'M96 22l8-10M110 34l12-6M60 12l-4-8' }, 'yellow')
  ],
  pierna: [
    s('rect', { x: 52, y: 14, width: 56, height: 44, rx: 10 }, 'blue'),
    stroke('M80 56v62', 'skin', 34, {}, { accent: true }),
    s('path', { d: 'M56 118h50a14 14 0 0 1 14 14v10H56a6 6 0 0 1-6-6v-12a6 6 0 0 1 6-6z' }, 'red'),
    s('rect', { x: 50, y: 140, width: 70, height: 6, rx: 3 }, 'dark')
  ],
  pie: [
    s('path', { d: 'M46 20c22-10 40 6 42 28 2 22-6 32-6 52 0 26 4 44-18 44-20 0-24-20-24-44 0-30-14-62 6-80z' }, 'skin', { accent: true }),
    s('circle', { cx: 100, cy: 44, r: 9 }, 'skin'),
    s('circle', { cx: 114, cy: 60, r: 8 }, 'skin'),
    s('circle', { cx: 120, cy: 78, r: 7 }, 'skin'),
    s('circle', { cx: 120, cy: 96, r: 6 }, 'skin'),
    stroke('M60 60q-4 24 0 44', 'brown', 3)
  ],
  rodilla: [
    stroke('M118 24L76 70', 'blue', 34),
    stroke('M76 70L50 134', 'skin', 28),
    ring(78, 72, 26),
    s('rect', { x: 26, y: 134, width: 52, height: 14, rx: 7 }, 'red'),
    s('circle', { cx: 78, cy: 72, r: 8 }, 'yellow')
  ],
  espalda: [
    s('circle', { cx: 80, cy: 28, r: 18 }, 'skin'),
    s('path', { d: 'M62 20a18 14 0 0 1 36 0q-18-8-36 0z' }, 'brown'),
    s('path', { d: 'M26 144V76a26 26 0 0 1 26-26h56a26 26 0 0 1 26 26v68z' }, 'green', { accent: true }),
    stroke('M80 54v86', 'dark', 4, { opacity: 0.4 }),
    stroke('M50 80q14 12 24 4M110 80q-14 12-24 4', 'white', 4, {}, { lineColor: 'dark' })
  ],
  'estómago': [
    s('path', { d: 'M62 20h22v22c30 6 58 28 58 62 0 30-22 40-48 40-34 0-58-22-60-48-2-18 14-28 28-30z' }, 'pink', { accent: true }),
    stroke('M62 20V8M84 20V8', 'pink', 12),
    stroke('M60 70q22 6 36 28', 'red', 4),
    stroke('M60 96q14 4 24 18', 'red', 4),
    s('circle', { cx: 110, cy: 98, r: 6, opacity: 0.5 }, 'white', { flatOnly: true })
  ],
  'corazón': [
    s('path', { d: 'M80 140C30 108 14 82 14 58c0-24 18-38 36-38 14 0 24 8 30 20 6-12 16-20 30-20 18 0 36 14 36 38 0 24-16 50-66 82z' }, 'red', { accent: true }),
    s('path', { d: 'M32 56q4-18 20-20', fill: 'none', 'stroke-width': 6, 'stroke-linecap': 'round' }, 'white', { stroke: true, flatOnly: true }),
    stroke('M20 90h30l8-14 14 34 10-20h16', 'white', 5, {}, { lineColor: 'dark' })
  ],
  sangre: [
    s('path', { d: 'M80 14C60 48 40 70 40 96a40 40 0 0 0 80 0c0-26-20-48-40-82z' }, 'red', { accent: true }),
    stroke('M60 96a22 22 0 0 0 14 24', 'white', 6, {}, { lineColor: 'dark' }),
    s('path', { d: 'M130 30c-6 10-12 16-12 24a12 12 0 0 0 24 0c0-8-6-14-12-24z' }, 'red'),
    s('path', { d: 'M30 28c-5 8-9 12-9 18a9 9 0 0 0 18 0c0-6-4-10-9-18z' }, 'pink')
  ],
  piel: [
    s('rect', { x: 14, y: 28, width: 100, height: 100, rx: 20 }, 'skin', { accent: true }),
    s('circle', { cx: 40, cy: 56, r: 3 }, 'tan'), s('circle', { cx: 66, cy: 80, r: 3 }, 'tan'),
    s('circle', { cx: 44, cy: 100, r: 3 }, 'tan'), s('circle', { cx: 86, cy: 52, r: 3 }, 'tan'),
    s('circle', { cx: 96, cy: 96, r: 30, fill: 'none', 'stroke-width': 7 }, 'dark', { stroke: true }),
    stroke('M118 118l28 28', 'dark', 10)
  ],
  voz: [
    s('rect', { x: 56, y: 14, width: 48, height: 72, rx: 24 }, 'gray', { accent: true }),
    stroke('M56 40h48M56 56h48', 'dark', 3),
    stroke('M38 70q0 38 42 38t42-38', 'dark', 6),
    stroke('M80 108v28M58 140h44', 'dark', 6),
    stroke('M128 28q12 14 0 28M140 18q20 24 0 48', 'blue', 5)
  ],
  salud: [
    s('path', { d: 'M80 14l56 20v40c0 36-26 58-56 72C50 132 24 110 24 74V34z' }, 'green', { accent: true }),
    s('path', { d: 'M68 46h24v22h22v24H92v22H68V92H46V68h22z' }, 'white'),
    s('path', { d: 'M80 14l56 20v40c0 36-26 58-56 72', fill: 'none', 'stroke-width': 3 }, 'mint', { flatOnly: true, stroke: true })
  ],
  enfermo: [
    s('circle', { cx: 80, cy: 84, r: 54 }, 'mint', { accent: true }),
    stroke('M52 72q8-8 16 0M92 72q8-8 16 0', 'dark', 4),
    stroke('M64 110q16-10 30 0', 'dark', 4),
    s('rect', { x: 84, y: 98, width: 56, height: 10, rx: 5, transform: 'rotate(-28 112 103)' }, 'white'),
    s('rect', { x: 84, y: 98, width: 20, height: 10, rx: 5, transform: 'rotate(-28 112 103)' }, 'red'),
    s('path', { d: 'M124 38c-5 8-9 12-9 17a9 9 0 0 0 18 0c0-5-4-9-9-17z' }, 'sky'),
    stroke('M50 36q14-12 30-8', 'gray', 4)
  ],
  dolor: [
    s('circle', { cx: 80, cy: 86, r: 52 }, 'skin'),
    stroke('M54 74l20 6M106 74l-20 6', 'dark', 5),
    stroke('M60 108q20-14 40 0', 'dark', 5),
    s('path', { d: 'M52 18l-14 30h16l-8 24 28-34H58l12-20z' }, 'yellow', { accent: true }),
    s('path', { d: 'M118 28l-10 22h12l-6 18 20-26h-12l8-14z' }, 'orange')
  ],
  fiebre: [
    s('rect', { x: 66, y: 12, width: 28, height: 98, rx: 14 }, 'white'),
    s('circle', { cx: 80, cy: 122, r: 26 }, 'red', { accent: true }),
    s('rect', { x: 74, y: 40, width: 12, height: 84, rx: 6 }, 'red'),
    stroke('M66 12h28a14 14 0 0 1 14 14v72H52V26A14 14 0 0 1 66 12z', 'gray', 3, {}, { flatOnly: true }),
    stroke('M104 40h14M104 58h10M104 76h14', 'dark', 4),
    stroke('M30 50q-8-12 0-24M18 56q-14-20 0-42', 'orange', 4)
  ],
  gripe: [
    stroke('M80 18v20M80 122v20M18 80h20M122 80h20M36 36l14 14M110 110l14 14M124 36l-14 14M50 110l-14 14', 'green', 9, {}, { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 44 }, 'green'),
    stroke('M56 66l16 8M104 66l-16 8', 'dark', 5),
    s('circle', { cx: 64, cy: 82, r: 5 }, 'dark'), s('circle', { cx: 96, cy: 82, r: 5 }, 'dark'),
    stroke('M62 104q18-12 36 0', 'dark', 5)
  ],
  resfriado: [
    s('circle', { cx: 80, cy: 74, r: 46 }, 'skin'),
    stroke('M54 62q8-6 16 0M90 62q8-6 16 0', 'dark', 4),
    s('circle', { cx: 80, cy: 82, r: 9 }, 'red'),
    stroke('M64 100q16 8 32 0', 'dark', 4),
    s('path', { d: 'M34 112q46 22 92 0l4 24q-50 22-100 0z' }, 'blue', { accent: true }),
    s('rect', { x: 108, y: 94, width: 34, height: 28, rx: 5, transform: 'rotate(-12 125 108)' }, 'white'),
    stroke('M118 108h14', 'gray', 3)
  ],
  medicina: [
    s('rect', { x: 56, y: 16, width: 48, height: 20, rx: 5 }, 'dark'),
    s('rect', { x: 48, y: 34, width: 64, height: 16, rx: 6 }, 'gray'),
    s('rect', { x: 36, y: 46, width: 88, height: 98, rx: 16 }, 'brown', { accent: true }),
    s('rect', { x: 46, y: 70, width: 68, height: 54, rx: 6 }, 'white'),
    s('path', { d: 'M74 80h12v10h10v12H86v10H74v-10H64V90h10z' }, 'red')
  ],
  pastilla: [
    s('rect', { x: 14, y: 44, width: 84, height: 40, rx: 20, transform: 'rotate(-30 56 64)' }, 'sky'),
    s('rect', { x: 14, y: 44, width: 44, height: 40, rx: 20, transform: 'rotate(-30 56 64)' }, 'red', { accent: true }),
    s('circle', { cx: 106, cy: 112, r: 28 }, 'cream'),
    stroke('M86 112h40', 'gray', 5),
    s('circle', { cx: 132, cy: 36, r: 10 }, 'sky')
  ],
  sed: [
    s('path', { d: 'M40 36h80l-10 100H50z' }, 'sky', { accent: true }),
    s('path', { d: 'M44 66h72l-6 70H50z' }, 'blue'),
    stroke('M90 66l24-46', 'red', 6),
    stroke('M60 92v24', 'white', 5, {}, { lineColor: 'dark' }),
    s('path', { d: 'M138 30c-5 8-9 12-9 17a9 9 0 0 0 18 0c0-5-4-9-9-17zM22 30c-4 7-7 10-7 14a7 7 0 0 0 14 0c0-4-3-7-7-14z' }, 'blue')
  ],
  hambre: [
    s('circle', { cx: 80, cy: 86, r: 46 }, 'white'),
    s('circle', { cx: 80, cy: 86, r: 32, }, 'gray', { flatOnly: true }),
    s('circle', { cx: 80, cy: 86, r: 46, fill: 'none', 'stroke-width': 4 }, 'gray', { stroke: true, accent: true }),
    stroke('M20 40v22m-6-22v14a6 6 0 0 0 12 0V40M20 62v68', 'dark', 4),
    stroke('M140 40c8 10 8 24 0 30v60', 'dark', 5),
    stroke('M62 78q8-8 16 0t16 0', 'orange', 4)
  ],
  'sueño': [
    s('path', { d: 'M96 18a58 58 0 1 0 46 90A46 46 0 0 1 96 18z' }, 'yellow', { accent: true }),
    stroke('M92 38h22l-22 24h22', 'navy', 6),
    stroke('M118 74h16l-16 18h16', 'navy', 5),
    s('circle', { cx: 36, cy: 40, r: 3 }, 'sky'), s('circle', { cx: 24, cy: 100, r: 3 }, 'sky'), s('circle', { cx: 44, cy: 130, r: 3 }, 'sky')
  ],
  labio: [
    s('path', { d: 'M14 84Q44 44 80 62Q116 44 146 84Q116 132 80 132Q44 132 14 84z' }, 'red', { accent: true }),
    stroke('M14 84Q80 100 146 84', 'dark', 4),
    s('path', { d: 'M50 72q16-10 28 0q-14 4-28 0z', opacity: 0.7 }, 'white', { flatOnly: true }),
    s('path', { d: 'M126 22l3 8 8 3-8 3-3 8-3-8-8-3 8-3z' }, 'pink')
  ],
  tos: [
    s('circle', { cx: 66, cy: 80, r: 46 }, 'skin'),
    stroke('M42 64l16 6M90 70l16-6', 'dark', 4),
    s('circle', { cx: 50, cy: 76, r: 4 }, 'dark'), s('circle', { cx: 82, cy: 76, r: 4 }, 'dark'),
    s('circle', { cx: 90, cy: 106, r: 16 }, 'skin', { accent: true }),
    stroke('M112 96l22-8M114 108h28M112 120l22 8', 'orange', 5)
  ]
};
