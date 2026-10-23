// Illustration specs for the adjectives theme (see server/scripts/lexicon/art.js)
const { s } = require("../../../scripts/lexicon/art");

const BLOB = 'M80 20c22 0 26 14 42 20s24 24 12 42-2 36-24 46-34 4-50-2S24 118 26 94 34 58 48 40 62 20 80 20z';
const blob = (c, extra = []) => [s('path', { d: BLOB }, c, { accent: true }), s('ellipse', { cx: 62, cy: 60, rx: 10, ry: 6, opacity: 0.4, transform: 'rotate(-30 62 60)' }, 'white', { flatOnly: true }), ...extra];
const ln = (d, c, w = 5, o = {}) => s('path', { d, fill: 'none', 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, c, { stroke: true, ...o });
// face on a coloured disc: eyes and mouth supplied
const disc = (c = 'yellow') => s('circle', { cx: 80, cy: 80, r: 50 }, c, { accent: true });
const dot = (x, y, r = 5) => s('circle', { cx: x, cy: y, r }, 'dark');
const person = (hair, body, accent) => [
  s('circle', { cx: 80, cy: 50, r: 22 }, 'skin'), s('path', { d: 'M56 46q24-30 48 0z' }, hair),
  s('path', { d: 'M46 140v-34a34 30 0 0 1 68 0v34z' }, body, accent ? { accent: true } : {})
];
const arrow = (d, c = 'dark') => ln(d, c, 4);
const glass = (full) => [
  s('path', { d: 'M40 30h80l-10 100a10 10 0 0 1-10 10H60a10 10 0 0 1-10-10z' }, 'sky', { accent: !full }),
  ...(full ? [s('path', { d: 'M45 48h70l-7 82a10 10 0 0 1-10 10H62a10 10 0 0 1-10-10z' }, 'blue', { accent: true })] : [ln('M58 50l4 70', 'white', 4, { lineColor: 'dark' })]),
  ln('M40 30h80', 'dark', 4)
];
const door = (open) => open ? [
  s('rect', { x: 36, y: 22, width: 88, height: 118, rx: 4 }, 'dark'),
  s('rect', { x: 44, y: 30, width: 72, height: 110 }, 'yellow', { accent: true }),
  s('path', { d: 'M44 30l-26 10v100l26 0z' }, 'brown'), s('circle', { cx: 28, cy: 90, r: 4 }, 'yellow')
] : [
  s('rect', { x: 36, y: 22, width: 88, height: 118, rx: 4 }, 'dark'),
  s('rect', { x: 44, y: 30, width: 72, height: 110 }, 'brown', { accent: true }),
  s('circle', { cx: 104, cy: 86, r: 5 }, 'yellow'), s('path', { d: 'M62 50h36M62 70h36', fill: 'none', 'stroke-width': 3 }, 'tan', { stroke: true })
];
const shirt = (c) => s('path', { d: 'M54 24l-34 24 14 20 16-8v68h60V60l16 8 14-20-34-24q-8 14-26 14T54 24z', 'stroke-linejoin': 'round' }, c, { accent: true });

module.exports = {
  color: [
    s('path', { d: 'M62 30c-24 0-44 18-44 44 0 30 24 54 54 54 18 0 20-10 12-20-8-10 0-20 14-20h22c14 0 22-8 22-22 0-22-34-36-80-36z' }, 'cream', { accent: true }),
    s('circle', { cx: 50, cy: 62, r: 10 }, 'red'), s('circle', { cx: 78, cy: 46, r: 10 }, 'yellow'), s('circle', { cx: 108, cy: 56, r: 10 }, 'blue'), s('circle', { cx: 48, cy: 92, r: 10 }, 'green')
  ],
  rojo: blob('red'), verde: blob('green'), amarillo: blob('yellow'), negro: blob('black'),
  blanco: [s('path', { d: BLOB, transform: 'translate(-4 -4) scale(1.05)' }, 'gray'), s('path', { d: BLOB }, 'white', { accent: true })],
  gris: blob('gray'), 'marrón': blob('brown'), rosa: blob('pink'), morado: blob('purple'),
  oscuro: [s('circle', { cx: 80, cy: 80, r: 56 }, 'navy', { accent: true }), s('path', { d: 'M96 36a44 44 0 1 0 28 62A52 52 0 0 1 96 36z' }, 'yellow'), s('circle', { cx: 40, cy: 50, r: 3 }, 'white'), s('circle', { cx: 58, cy: 112, r: 2.5 }, 'white')],
  'pequeño': [
    s('rect', { x: 14, y: 30, width: 78, height: 104, rx: 10 }, 'gray'),
    s('rect', { x: 108, y: 100, width: 34, height: 34, rx: 6 }, 'blue', { accent: true }),
    ln('M8 142h144', 'gray', 4), arrow('M125 78v14m-8-8 8 8 8-8')
  ],
  alto: [
    s('circle', { cx: 60, cy: 30, r: 14 }, 'skin'), s('rect', { x: 42, y: 46, width: 36, height: 90, rx: 14 }, 'blue', { accent: true }),
    s('rect', { x: 100, y: 112, width: 36, height: 26, rx: 8 }, 'gray'), ln('M118 26v60m-10-12 10 12 10-12', 'dark', 4)
  ],
  bajo: [
    s('circle', { cx: 112, cy: 28, r: 14 }, 'skin'), s('rect', { x: 94, y: 44, width: 36, height: 92, rx: 14 }, 'gray'),
    s('circle', { cx: 52, cy: 98, r: 14 }, 'skin'), s('rect', { x: 36, y: 112, width: 32, height: 26, rx: 10 }, 'green', { accent: true }),
    ln('M52 30v34m-10-10 10 10 10-10', 'dark', 4)
  ],
  largo: [
    s('rect', { x: 14, y: 66, width: 108, height: 28, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M122 66l28 14-28 14z' }, 'tan'), s('path', { d: 'M142 76l8 4-8 4z' }, 'dark'), s('rect', { x: 14, y: 66, width: 14, height: 28, rx: 3 }, 'pink'),
    ln('M14 112h136m-10-10 10 10-10 10m-116-20-10 10 10 10', 'dark', 4)
  ],
  corto: [
    s('rect', { x: 46, y: 66, width: 46, height: 28, rx: 3 }, 'yellow', { accent: true }),
    s('path', { d: 'M92 66l22 14-22 14z' }, 'tan'), s('path', { d: 'M108 76l6 4-6 4z' }, 'dark'), s('rect', { x: 46, y: 66, width: 12, height: 28, rx: 3 }, 'pink'),
    ln('M46 112h68m-10-10 10 10-10 10M56 102l-10 10 10 10', 'dark', 4)
  ],
  gordo: [
    s('circle', { cx: 80, cy: 38, r: 22 }, 'skin'), s('ellipse', { cx: 80, cy: 98, rx: 52, ry: 42 }, 'orange', { accent: true }),
    s('circle', { cx: 72, cy: 36, r: 3 }, 'dark'), s('circle', { cx: 88, cy: 36, r: 3 }, 'dark'), ln('M72 46q8 6 16 0', 'dark', 3),
    s('ellipse', { cx: 80, cy: 108, rx: 12, ry: 8, opacity: 0.4 }, 'white', { flatOnly: true })
  ],
  delgado: [
    s('circle', { cx: 80, cy: 28, r: 16 }, 'skin'), s('rect', { x: 68, y: 46, width: 24, height: 80, rx: 10 }, 'orange', { accent: true }),
    s('rect', { x: 70, y: 120, width: 8, height: 22, rx: 3 }, 'dark'), s('rect', { x: 82, y: 120, width: 8, height: 22, rx: 3 }, 'dark'),
    ln('M40 80h14m-6-6 6 6-6 6M120 80h-14m6-6-6 6 6 6', 'dark', 4)
  ],
  guapo: [
    s('circle', { cx: 80, cy: 86, r: 44 }, 'skin'), s('path', { d: 'M38 80q4-46 42-46t42 46q-14-24-42-24T38 80z' }, 'brown'),
    dot(64, 88, 4), dot(96, 88, 4), ln('M66 108q14 12 28 0', 'dark', 4),
    s('path', { d: 'M124 26l4 10 10 4-10 4-4 10-4-10-10-4 10-4zM30 30l3 7 7 3-7 3-3 7-3-7-7-3 7-3z' }, 'yellow', { accent: true })
  ],
  feo: [
    s('circle', { cx: 80, cy: 82, r: 46 }, 'green', { accent: true }), ln('M52 66l22 8M108 66l-22 8', 'dark', 5),
    dot(64, 82, 5), s('circle', { cx: 98, cy: 84, r: 9 }, 'white'), dot(98, 84, 4),
    ln('M58 112q10-10 22 0t22-2', 'dark', 4), s('path', { d: 'M72 108l4 12 4-12z' }, 'white')
  ],
  bonito: [
    s('circle', { cx: 80, cy: 80, r: 14 }, 'yellow'),
    ...[0, 72, 144, 216, 288].map(a => s('ellipse', { cx: 80, cy: 46, rx: 14, ry: 20, transform: `rotate(${a} 80 80)` }, 'pink', { accent: a === 0 })),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'yellow'), ln('M80 112v36', 'green', 6)
  ],
  viejo: [
    s('circle', { cx: 80, cy: 66, r: 36 }, 'skin'), s('path', { d: 'M44 60q4-34 36-34t36 34q-10-14-36-14T44 60z' }, 'gray'),
    s('path', { d: 'M46 94q34 52 68 0q-34 18-68 0z' }, 'white'), dot(66, 66, 3.5), dot(94, 66, 3.5), ln('M58 58l6-4M96 54l6 4M60 78q4 3 8 0', 'gray', 3, { lineColor: 'dark' }),
    ln('M126 70v66', 'brown', 6)
  ],
  nuevo: [
    s('path', { d: 'M54 24l-34 24 14 20 16-8v68h60V60l16 8 14-20-34-24q-8 14-26 14T54 24z', 'stroke-linejoin': 'round' }, 'blue', { accent: true }),
    s('path', { d: 'M126 14l4 10 10 4-10 4-4 10-4-10-10-4 10-4zM28 112l3 7 7 3-7 3-3 7-3-7-7-3 7-3z' }, 'yellow'),
    s('rect', { x: 100, y: 96, width: 24, height: 16, rx: 3 }, 'white'), ln('M104 104h16', 'red', 3)
  ],
  bueno: [
    s('path', { d: 'M24 70h28v70H24z' }, 'blue'), s('path', { d: 'M56 74l22-46c14 0 20 12 16 28l-2 10h36c10 0 16 8 14 18l-8 44c-2 8-8 12-16 12H56z', 'stroke-linejoin': 'round' }, 'green', { accent: true })
  ],
  malo: [
    s('path', { d: 'M24 90h28V20H24z' }, 'blue'), s('path', { d: 'M56 86l22 46c14 0 20-12 16-28l-2-10h36c10 0 16-8 14-18l-8-44c-2-8-8-12-16-12H56z', 'stroke-linejoin': 'round' }, 'red', { accent: true })
  ],
  mejor: [
    s('rect', { x: 20, y: 96, width: 28, height: 42, rx: 4 }, 'mint'), s('rect', { x: 66, y: 66, width: 28, height: 72, rx: 4 }, 'green'), s('rect', { x: 112, y: 34, width: 28, height: 104, rx: 4 }, 'green', { accent: true }),
    s('path', { d: 'M126 6l5 11 12 2-9 8 2 12-10-6-10 6 2-12-9-8 12-2z' }, 'yellow')
  ],
  peor: [
    s('rect', { x: 20, y: 34, width: 28, height: 104, rx: 4 }, 'mint'), s('rect', { x: 66, y: 66, width: 28, height: 72, rx: 4 }, 'red'), s('rect', { x: 112, y: 106, width: 28, height: 32, rx: 4 }, 'red', { accent: true })
  ],
  'fácil': [
    s('path', { d: 'M8 134l60-50 60 0 24 50z' }, 'mint'), s('path', { d: 'M8 134L104 74l48 60z' }, 'green', { accent: true }),
    s('circle', { cx: 60, cy: 88, r: 9 }, 'skin'), s('rect', { x: 52, y: 96, width: 16, height: 22, rx: 6 }, 'blue'), ln('M110 74v-40', 'brown', 4), s('path', { d: 'M110 34h22l-6 8 6 8h-22z' }, 'yellow')
  ],
  'difícil': [
    s('path', { d: 'M4 140L80 24l76 116z' }, 'gray', { accent: true }), s('path', { d: 'M62 52l18-28 18 28-10-6-8 8-8-8z' }, 'white'),
    s('path', { d: 'M34 120l12-20 8 8 14-24', fill: 'none', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, 'red', { stroke: true }),
    s('circle', { cx: 34, cy: 120, r: 7 }, 'skin'), s('rect', { x: 28, y: 126, width: 12, height: 14, rx: 4 }, 'blue')
  ],
  caro: [
    s('path', { d: 'M20 80l50-50h60v60l-50 50z', 'stroke-linejoin': 'round' }, 'yellow', { accent: true }), s('circle', { cx: 112, cy: 48, r: 6 }, 'white'),
    s('ellipse', { cx: 50, cy: 130, rx: 24, ry: 8 }, 'orange'), s('ellipse', { cx: 50, cy: 120, rx: 24, ry: 8 }, 'yellow'), s('ellipse', { cx: 50, cy: 110, rx: 24, ry: 8 }, 'orange'), s('ellipse', { cx: 50, cy: 100, rx: 24, ry: 8 }, 'yellow'),
    s('ellipse', { cx: 108, cy: 128, rx: 24, ry: 8 }, 'orange'), s('ellipse', { cx: 108, cy: 118, rx: 24, ry: 8 }, 'yellow'),
    ln('M72 66l30 0', 'dark', 4)
  ].slice(0, 9),
  barato: [
    s('path', { d: 'M20 80l50-50h60v60l-50 50z', 'stroke-linejoin': 'round' }, 'mint', { accent: true }), s('circle', { cx: 112, cy: 48, r: 6 }, 'white'),
    s('ellipse', { cx: 106, cy: 132, rx: 24, ry: 8 }, 'orange'), s('ellipse', { cx: 106, cy: 122, rx: 24, ry: 8 }, 'yellow'),
    ln('M60 76h22', 'dark', 4)
  ],
  rico: [
    s('path', { d: 'M52 60c-16 8-28 30-28 54 0 20 20 28 56 28s56-8 56-28c0-24-12-46-28-54z' }, 'brown', { accent: true }),
    s('path', { d: 'M56 40l12 14 12-18 12 18 12-14-4 22H60z', 'stroke-linejoin': 'round' }, 'yellow'),
    s('circle', { cx: 80, cy: 108, r: 20 }, 'yellow'), ln('M80 94v28m-8-22h12q6 0 6 6t-6 6h-12', 'brown', 4)
  ],
  pobre: [
    s('path', { d: 'M52 60c-16 8-28 30-28 54 0 20 20 28 56 28s56-8 56-28c0-24-12-46-28-54z' }, 'gray', { accent: true }),
    s('path', { d: 'M56 40l24 16 24-16-4 22H60z' }, 'gray'), s('path', { d: 'M52 104l14 8-10 12zM100 90l10 10-14 6z' }, 'tan'),
    s('circle', { cx: 80, cy: 104, r: 18 }, 'white'), ln('M70 104h20', 'gray', 4, { lineColor: 'dark' }), s('circle', { cx: 80, cy: 154, r: 2 }, 'dark')
  ].slice(0, 6),
  limpio: [
    s('circle', { cx: 80, cy: 86, r: 52 }, 'white'), s('circle', { cx: 80, cy: 86, r: 52 }, 'sky', { flatOnly: true, opacity: 0.4 }), s('circle', { cx: 80, cy: 86, r: 36 }, 'white', { accent: false }),
    s('path', { d: 'M122 26l4 10 10 4-10 4-4 10-4-10-10-4 10-4zM30 40l3 8 8 3-8 3-3 8-3-8-8-3 8-3zM40 124l2 6 6 2-6 2-2 6-2-6-6-2 6-2z' }, 'yellow', { accent: true })
  ],
  sucio: [
    s('circle', { cx: 80, cy: 86, r: 52 }, 'white'), s('circle', { cx: 80, cy: 86, r: 36 }, 'gray', { flatOnly: true }),
    s('path', { d: 'M58 70c10-10 22-4 24 8 14-6 24 6 16 18 12 6 4 22-10 20-8 10-28 8-30-6-14-4-12-26 0-40z' }, 'brown', { accent: true }),
    s('circle', { cx: 120, cy: 40, r: 4 }, 'green'), s('circle', { cx: 36, cy: 120, r: 5 }, 'brown')
  ],
  abierto: door(true), cerrado: door(false), lleno: glass(true), 'vacío': glass(false),
  caliente: [
    s('path', { d: 'M30 74h80v36a30 30 0 0 1-30 30H60a30 30 0 0 1-30-30z' }, 'red', { accent: true }), s('path', { d: 'M110 84h12a14 14 0 0 1 0 28h-14', fill: 'none', 'stroke-width': 7 }, 'red', { stroke: true }),
    ln('M52 62q-10-12 0-22t0-22M80 62q-10-12 0-22t0-22', 'gray', 5)
  ],
  fresco: [
    s('path', { d: 'M80 14c40 20 52 64 24 100-12 12-28 14-48 0C38 86 42 40 80 14z' }, 'green', { accent: true }),
    ln('M80 36v100', 'mint', 4), ln('M80 70l-18-14M80 90l20-16M80 110l-16-12', 'mint', 3),
    s('path', { d: 'M130 96c8 12 10 20 0 26-10-6-8-14 0-26z' }, 'sky'), s('path', { d: 'M28 112c6 10 8 16 0 20-8-4-6-10 0-20z' }, 'sky')
  ],
  dulce: [
    s('path', { d: 'M30 62l22 12v32L30 118q-14-28 0-56zM130 62l-22 12v32l22 12q14-28 0-56z' }, 'pink'),
    s('rect', { x: 48, y: 52, width: 64, height: 56, rx: 26 }, 'red', { accent: true }), ln('M66 60q-6 22 4 44M86 56q-6 24 4 48', 'white', 5, { lineColor: 'dark' })
  ],
  salado: [
    s('path', { d: 'M54 54h52l8 80a10 10 0 0 1-10 10H56a10 10 0 0 1-10-10z' }, 'sky', { accent: true }), s('rect', { x: 50, y: 40, width: 60, height: 18, rx: 8 }, 'gray'),
    s('circle', { cx: 68, cy: 48, r: 2 }, 'dark'), s('circle', { cx: 80, cy: 48, r: 2 }, 'dark'), s('circle', { cx: 92, cy: 48, r: 2 }, 'dark'),
    s('rect', { x: 60, y: 80, width: 40, height: 30, rx: 4 }, 'white'), s('path', { d: 'M62 26l-4 8M80 20v10M98 26l4 8', fill: 'none', 'stroke-width': 4, 'stroke-linecap': 'round' }, 'dark', { stroke: true })
  ],
  'rápido': [
    ln('M8 52h50M20 80h44M8 108h50', 'sky', 6), s('path', { d: 'M52 80c0-24 20-40 44-34l22-16 4 24c14 6 20 20 10 34-8 12-30 22-54 22-16 0-26-14-26-30z' }, 'orange', { accent: true }),
    dot(112, 58, 3.5), s('path', { d: 'M90 112l12 22h-30z' }, 'brown')
  ],
  lento: [
    s('ellipse', { cx: 80, cy: 122, rx: 62, ry: 14 }, 'tan'), s('circle', { cx: 78, cy: 88, r: 38 }, 'orange', { accent: true }), s('path', { d: 'M78 88m-24 0a24 24 0 1 1 24 24a12 12 0 1 1 0-24', fill: 'none', 'stroke-width': 4, 'stroke-linecap': 'round' }, 'brown', { stroke: true }),
    s('path', { d: 'M110 130c14 0 30-4 38-14v-24l-12 6v12c-8 4-16 6-26 6z' }, 'tan'), ln('M136 92l-6-20M144 94l8-18', 'brown', 3), s('circle', { cx: 130, cy: 70, r: 3 }, 'dark')
  ],
  fuerte: [
    s('rect', { x: 44, y: 70, width: 72, height: 14, rx: 4 }, 'gray'), s('rect', { x: 20, y: 46, width: 22, height: 62, rx: 6 }, 'dark', { accent: true }), s('rect', { x: 118, y: 46, width: 22, height: 62, rx: 6 }, 'dark', { accent: true }),
    s('rect', { x: 8, y: 58, width: 12, height: 38, rx: 4 }, 'dark'), s('rect', { x: 140, y: 58, width: 12, height: 38, rx: 4 }, 'dark'), ln('M60 36l-6-14M80 32V16M100 36l6-14', 'red', 5)
  ],
  'débil': [
    ln('M80 142c0-30 6-50 20-62', 'green', 6), s('path', { d: 'M100 80c-14-2-28 6-30 22 12 4 28-2 30-22z' }, 'green'),
    s('circle', { cx: 112, cy: 94, r: 14 }, 'pink', { accent: true }), s('path', { d: 'M110 108q-6 12-16 14' }, 'gray', { opacity: 0 }), s('path', { d: 'M28 144h104', fill: 'none', 'stroke-width': 4, 'stroke-linecap': 'round' }, 'gray', { stroke: true }),
    s('path', { d: 'M126 114q4 8 0 14q-6-6 0-14z' }, 'sky')
  ],
  contento: [disc(), ln('M52 72q8-8 16 0M92 72q8-8 16 0', 'dark', 5), ln('M54 96q26 20 52 0', 'dark', 5), s('circle', { cx: 46, cy: 92, r: 7, opacity: 0.6 }, 'pink', { flatOnly: true }), s('circle', { cx: 114, cy: 92, r: 7, opacity: 0.6 }, 'pink', { flatOnly: true })],
  triste: [disc('sky'), ln('M50 66l14 6M110 66l-14 6', 'dark', 4), dot(62, 82), dot(98, 82), ln('M60 112q20-18 40 0', 'dark', 5), s('path', { d: 'M62 92q-8 14 0 18q8-4 0-18z' }, 'blue', { accent: false })],
  enfadado: [disc('red'), ln('M46 64l26 12M114 64l-26 12', 'dark', 6), dot(64, 88), dot(96, 88), ln('M58 118q22-18 44 0', 'dark', 5), ln('M132 30l8-14M142 40l12-8', 'orange', 4, { flatOnly: true })],
  cansado: [disc(), ln('M50 78q12 8 24 0M86 78q12 8 24 0', 'dark', 5), s('ellipse', { cx: 80, cy: 110, rx: 12, ry: 14 }, 'dark'), ln('M44 68l18 4M116 68l-18 4', 'gray', 3, { lineColor: 'dark' }),
    ln('M122 30h16l-16 16h16', 'blue', 4)],
  aburrido: [disc(), ln('M50 78h24M86 78h24', 'dark', 5), s('path', { d: 'M50 70h24v8H50zM86 70h24v8H86z' }, 'yellow', { opacity: 1 }), ln('M62 112h36', 'dark', 5), ln('M118 36h20M118 46h12', 'gray', 4)],
  nervioso: [disc(), s('circle', { cx: 64, cy: 80, r: 11 }, 'white'), s('circle', { cx: 96, cy: 80, r: 11 }, 'white'), dot(66, 82, 4), dot(94, 82, 4), ln('M52 108l8 6 10-8 10 8 10-8 10 8 8-6', 'dark', 4), s('path', { d: 'M122 52c6 6 6 14 0 18-6-6-6-12 0-18z' }, 'sky'), ln('M22 70l8-4m-8 14 10 0', 'dark', 3)],
  tranquilo: [disc('mint'), ln('M52 76q8 6 16 0M92 76q8 6 16 0', 'dark', 5), ln('M66 104q14 8 28 0', 'dark', 5), s('circle', { cx: 46, cy: 92, r: 7, opacity: 0.6 }, 'pink', { flatOnly: true }), s('circle', { cx: 114, cy: 92, r: 7, opacity: 0.6 }, 'pink', { flatOnly: true })],
  inteligente: [
    s('path', { d: 'M80 14c-24 0-40 16-40 38 0 14 8 22 14 30 4 6 4 10 4 14h44c0-4 0-8 4-14 6-8 14-16 14-30 0-22-16-38-40-38z' }, 'yellow', { accent: true }),
    s('rect', { x: 62, y: 100, width: 36, height: 10, rx: 4 }, 'gray'), s('rect', { x: 66, y: 114, width: 28, height: 10, rx: 4 }, 'gray'), ln('M70 80l10-24 10 24', 'orange', 4), ln('M80 4v-0M20 30l-8-6M140 30l8-6', 'yellow', 5)
  ],
  divertido: [
    s('path', { d: 'M40 140l22-86 32 12z' }, 'purple', { accent: true }), s('circle', { cx: 100, cy: 40, r: 6 }, 'red'), s('path', { d: 'M62 54l-4 18 22 8 8-12z' }, 'yellow'),
    s('circle', { cx: 112, cy: 40, r: 5 }, 'red'), ln('M100 76q10-24 36-24M96 104q24-6 40 14', 'blue', 4), s('rect', { x: 120, y: 80, width: 8, height: 8, rx: 1, transform: 'rotate(30 124 84)' }, 'orange'), s('circle', { cx: 28, cy: 50, r: 6 }, 'green')
  ],
  diferente: [
    s('rect', { x: 14, y: 28, width: 40, height: 40, rx: 4 }, 'gray'), s('rect', { x: 60, y: 28, width: 40, height: 40, rx: 4 }, 'gray'), s('rect', { x: 106, y: 28, width: 40, height: 40, rx: 4 }, 'gray'),
    s('rect', { x: 14, y: 90, width: 40, height: 40, rx: 4 }, 'gray'), s('circle', { cx: 80, cy: 110, r: 22 }, 'red', { accent: true }), s('rect', { x: 106, y: 90, width: 40, height: 40, rx: 4 }, 'gray')
  ],
  igual: [
    s('rect', { x: 14, y: 36, width: 56, height: 56, rx: 8 }, 'blue', { accent: true }), s('rect', { x: 90, y: 36, width: 56, height: 56, rx: 8 }, 'blue'),
    ln('M58 118h44M58 134h44', 'dark', 7)
  ],
  libre: [
    s('path', { d: 'M20 40q-8 40 24 74 40-6 52-40-10-6-20-4 6-14-8-30-16 6-24 20-10-14-24-20z' }, 'sky', { opacity: 0 }),
    s('path', { d: 'M40 70c4-26 40-30 60-8 16 18 10 40-8 50-24 10-52-2-52-42z' }, 'blue', { accent: true }), s('path', { d: 'M92 64c10-24 36-30 52-18-8 18-26 28-52 18z' }, 'sky'),
    s('path', { d: 'M40 74L12 66l22 22z' }, 'navy'), dot(78, 74, 4), s('path', { d: 'M96 118l6 20-14-14z' }, 'navy'), s('circle', { cx: 130, cy: 24, r: 3 }, 'yellow')
  ],
  seguro: [
    s('path', { d: 'M80 14l54 18v40c0 36-24 58-54 74-30-16-54-38-54-74V32z', 'stroke-linejoin': 'round' }, 'blue', { accent: true }), ln('M52 78l20 20 38-40', 'white', 10, { lineColor: 'dark' })
  ],
  correcto: [s('circle', { cx: 80, cy: 80, r: 56 }, 'green', { accent: true }), ln('M50 82l22 22 40-46', 'white', 12, { lineColor: 'dark' })],
  'único': [
    ...[0, 1, 2].flatMap(r => [0, 1, 2, 3].map(c => (r === 1 && c === 2) ? s('circle', { cx: 28 + c * 34, cy: 40 + r * 40, r: 14 }, 'red', { accent: true }) : s('circle', { cx: 28 + c * 34, cy: 40 + r * 40, r: 11 }, 'gray')))
  ],
  moderno: [
    s('rect', { x: 52, y: 22, width: 56, height: 118, rx: 3 }, 'sky', { accent: true }), s('rect', { x: 20, y: 70, width: 30, height: 70 }, 'gray'), s('rect', { x: 110, y: 52, width: 30, height: 88 }, 'gray'),
    ln('M66 44h28M66 64h28M66 84h28M66 104h28', 'white', 5, { lineColor: 'dark' }), ln('M80 22V8', 'dark', 3), ln('M8 142h144', 'dark', 4)
  ],
  antiguo: [
    s('path', { d: 'M18 52L80 18l62 34z' }, 'tan', { accent: true }), s('rect', { x: 24, y: 56, width: 112, height: 10, rx: 2 }, 'cream'),
    ...[34, 64, 94, 114].slice(0, 4).map((x, i) => s('rect', { x: 28 + i * 30, y: 70, width: 14, height: 54 }, 'cream')),
    s('rect', { x: 18, y: 124, width: 124, height: 14, rx: 2 }, 'tan'), ln('M35 74v46M65 74v46M95 74v46M125 74v46', 'gray', 2)
  ],
  alegre: [disc('orange'), s('path', { d: 'M48 88q32 44 64 0z' }, 'dark'), s('path', { d: 'M62 106q18 10 36 0q-18 6-36 0z' }, 'pink', { flatOnly: true }), ln('M52 68q8-12 16 0M92 68q8-12 16 0', 'dark', 5),
    s('path', { d: 'M20 120q8-6 8-20l12 4zM132 26q10-4 10-14l8 3z' }, 'yellow')],
  serio: [disc('gray'), ln('M50 68h24M86 68h24', 'dark', 6), dot(62, 84, 5), dot(98, 84, 5), ln('M60 108h40', 'dark', 6)],
  'tímido': [disc('pink'), dot(64, 84, 4), dot(96, 84, 4), ln('M68 108q12-6 24 0', 'dark', 4), s('circle', { cx: 44, cy: 96, r: 9, opacity: 0.8 }, 'red', { flatOnly: true }), s('circle', { cx: 116, cy: 96, r: 9, opacity: 0.8 }, 'red', { flatOnly: true })],
  rubio: [s('circle', { cx: 80, cy: 80, r: 36 }, 'skin'), s('path', { d: 'M38 90q-4-62 42-62t42 62q-8-30-20-38-20 8-44 0-12 8-20 38z' }, 'yellow', { accent: true }), dot(66, 84, 4), dot(94, 84, 4), ln('M68 104q12 8 24 0', 'dark', 4)],
  moreno: [s('circle', { cx: 80, cy: 80, r: 36 }, 'tan'), s('path', { d: 'M38 90q-4-62 42-62t42 62q-8-30-20-38-20 8-44 0-12 8-20 38z' }, 'black', { accent: true }), dot(66, 84, 4), dot(94, 84, 4), ln('M68 104q12 8 24 0', 'dark', 4)],
  redondo: [s('circle', { cx: 80, cy: 80, r: 56 }, 'orange', { accent: true }), s('ellipse', { cx: 58, cy: 56, rx: 14, ry: 8, opacity: 0.4, transform: 'rotate(-35 58 56)' }, 'white', { flatOnly: true })],
  cuadrado: [s('rect', { x: 26, y: 26, width: 108, height: 108, rx: 6 }, 'blue', { accent: true }), s('rect', { x: 36, y: 36, width: 24, height: 12, rx: 3, opacity: 0.4 }, 'white', { flatOnly: true })],
  ancho: [s('rect', { x: 4, y: 40, width: 152, height: 80 }, 'gray'), ln('M4 80h152', 'white', 4, { lineColor: 'dark', 'stroke-dasharray': '14 10' }), ln('M16 138h128m-12-10 12 10-12 10m-104-20-12 10 12 10', 'blue', 5, { accent: true }), ln('M4 40h152M4 120h152', 'dark', 3, { flatOnly: true })],
  estrecho: [s('rect', { x: 62, y: 20, width: 36, height: 100 }, 'gray'), ln('M80 28v84', 'white', 3, { lineColor: 'dark', 'stroke-dasharray': '12 8' }), s('rect', { x: 8, y: 20, width: 54, height: 100, rx: 4 }, 'green'), s('rect', { x: 98, y: 20, width: 54, height: 100, rx: 4 }, 'green'),
    ln('M16 138h40m-10-8 10 8-10 8M144 138h-40m10-8-10 8 10 8', 'blue', 5, { accent: true })],
  pesado: [s('path', { d: 'M52 42h56l22 92H30z', 'stroke-linejoin': 'round' }, 'dark', { accent: true }), s('path', { d: 'M66 42a14 14 0 0 1 28 0', fill: 'none', 'stroke-width': 8 }, 'dark', { stroke: true }), s('rect', { x: 62, y: 76, width: 36, height: 18, rx: 4 }, 'white'), ln('M18 146h124', 'brown', 6)],
  ligero: [s('path', { d: 'M50 142c-4-44 10-90 70-118-6 56-22 90-70 118z' }, 'sky', { accent: true }), ln('M52 140C70 100 92 66 116 30', 'white', 4, { lineColor: 'dark' }), ln('M64 96l22-6M76 74l20-4M88 54l16-4', 'white', 3, { lineColor: 'dark' }), s('path', { d: 'M28 56q6-10 12 0M116 124q6-10 12 0', fill: 'none', 'stroke-width': 3 }, 'gray', { stroke: true })],
  duro: [s('path', { d: 'M24 120L36 66 76 34l48 14 20 44-14 36z', 'stroke-linejoin': 'round' }, 'gray', { accent: true }), s('path', { d: 'M76 34l-8 40 36 22M36 66l32 8M104 96l-4 30', fill: 'none', 'stroke-width': 3, 'stroke-linejoin': 'round' }, 'dark', { stroke: true }), ln('M10 140h140', 'brown', 5)],
  blando: [s('path', { d: 'M20 50q60-24 120 0 8 40 0 60-60 24-120 0-8-20 0-60z', 'stroke-linejoin': 'round' }, 'pink', { accent: true }), ln('M34 64q46-14 92 0', 'white', 4, { lineColor: 'dark' }), s('circle', { cx: 24, cy: 52, r: 5 }, 'white'), s('circle', { cx: 136, cy: 52, r: 5 }, 'white'), s('circle', { cx: 24, cy: 108, r: 5 }, 'white'), s('circle', { cx: 136, cy: 108, r: 5 }, 'white')],
  mojado: [shirt('blue'), s('path', { d: 'M60 84c6 10 8 16 0 22-8-6-6-12 0-22zM96 96c6 10 8 16 0 22-8-6-6-12 0-22z' }, 'sky'), s('path', { d: 'M24 128c4 8 6 12 0 16-6-4-4-8 0-16zM132 118c4 8 6 12 0 16-6-4-4-8 0-16zM84 134c4 8 6 12 0 16-6-4-4-8 0-16z' }, 'blue')],
  seco: [shirt('blue'), s('circle', { cx: 132, cy: 26, r: 12 }, 'yellow'), ln('M132 6v-0M110 26h-6M154 26h-0M118 10l-4-4M146 10l4-4M118 42l-4 4', 'yellow', 4)],
  'cómodo': [s('rect', { x: 24, y: 64, width: 112, height: 56, rx: 18 }, 'purple', { accent: true }), s('rect', { x: 34, y: 30, width: 92, height: 52, rx: 18 }, 'purple'), s('rect', { x: 14, y: 70, width: 26, height: 56, rx: 12 }, 'purple'), s('rect', { x: 120, y: 70, width: 26, height: 56, rx: 12 }, 'purple'), s('rect', { x: 44, y: 78, width: 72, height: 30, rx: 12 }, 'pink'), s('rect', { x: 30, y: 124, width: 10, height: 14 }, 'brown'), s('rect', { x: 120, y: 124, width: 10, height: 14 }, 'brown')],
  precioso: [s('path', { d: 'M46 36h68l26 32-60 70L20 68z', 'stroke-linejoin': 'round' }, 'sky', { accent: true }), ln('M20 68h120M46 36l14 32 20-32 20 32 14-32M60 68l20 70 20-70', 'white', 3, { lineColor: 'dark' }), s('path', { d: 'M138 14l4 10 10 4-10 4-4 10-4-10-10-4 10-4z' }, 'yellow')],
  maravilloso: [s('path', { d: 'M10 130a70 70 0 0 1 140 0h-20a50 50 0 0 0-100 0z' }, 'red'), s('path', { d: 'M30 130a50 50 0 0 1 100 0h-18a32 32 0 0 0-64 0z' }, 'yellow', { accent: true }), s('path', { d: 'M48 130a32 32 0 0 1 64 0H96a16 16 0 0 0-32 0z' }, 'blue'), s('ellipse', { cx: 22, cy: 140, rx: 22, ry: 10 }, 'white'), s('ellipse', { cx: 138, cy: 140, rx: 22, ry: 10 }, 'white')],
  picante: [s('path', { d: 'M104 36c28 6 40 40 22 72-12 22-40 36-82 34 40-10 66-30 68-66 0-14-4-28-8-40z', 'stroke-linejoin': 'round' }, 'red', { accent: true }), s('path', { d: 'M104 36c-4-12 2-20 12-22M104 36q8-6 18 0', fill: 'none', 'stroke-width': 6, 'stroke-linecap': 'round' }, 'green', { stroke: true }), ln('M30 36q10-10 0-22M52 40q10-10 0-22', 'orange', 4)],
  amargo: [s('path', { d: 'M28 70h80v34a32 32 0 0 1-32 32H60a32 32 0 0 1-32-32z' }, 'brown', { accent: true }), s('path', { d: 'M108 80h12a14 14 0 0 1 0 28h-14', fill: 'none', 'stroke-width': 7 }, 'brown', { stroke: true }), s('ellipse', { cx: 68, cy: 70, rx: 40, ry: 8 }, 'black'), s('ellipse', { cx: 136, cy: 130, rx: 8, ry: 12, transform: 'rotate(30 136 130)' }, 'black'), ln('M136 120l-4 20', 'brown', 2, { flatOnly: true }), s('rect', { x: 136, y: 36, width: 14, height: 14, rx: 2, transform: 'rotate(15 143 43)' }, 'cream')]
};
