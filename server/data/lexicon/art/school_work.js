// Illustration specs for theme school_work (see server/scripts/lexicon/art.js)
const { s } = require("../../../scripts/lexicon/art");

const R = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
// A person: round head + rounded body (head centre y=58, body top y=80)
const person = (cx, body, accent = true) => [
  s('path', { d: `M${cx - 36} 146v-34a36 32 0 0 1 72 0v34z` }, body, accent ? { accent: true } : {}),
  s('circle', { cx, cy: 58, r: 20 }, 'skin'),
  s('path', { d: `M${cx - 7} 60h.01M${cx + 7} 60h.01`, ...R, 'stroke-width': 5 }, 'dark', { stroke: true })
];
const hardHat = (cx, col, accent) => [
  s('path', { d: `M${cx - 24} 54a24 24 0 0 1 48 0z` }, col, accent ? { accent: true } : {}),
  s('rect', { x: cx - 30, y: 52, width: 60, height: 7, rx: 3 }, col)
];

module.exports = {
  escuela: [
    s('rect', { x: 28, y: 70, width: 104, height: 70, rx: 3 }, 'cream'),
    s('path', { d: 'M20 74 80 36l60 38z', 'stroke-linejoin': 'round' }, 'red', { accent: true }),
    s('rect', { x: 68, y: 100, width: 24, height: 40, rx: 3 }, 'brown'),
    s('rect', { x: 38, y: 88, width: 18, height: 18, rx: 2 }, 'sky'),
    s('rect', { x: 104, y: 88, width: 18, height: 18, rx: 2 }, 'sky'),
    s('path', { d: 'M80 36V14', ...R, 'stroke-width': 3 }, 'dark', { stroke: true }),
    s('path', { d: 'M80 14h22l-6 7 6 7H80z' }, 'blue')
  ],
  clase: [
    s('rect', { x: 18, y: 22, width: 124, height: 66, rx: 5 }, 'brown'),
    s('rect', { x: 25, y: 29, width: 110, height: 52, rx: 3 }, 'green', { accent: true }),
    s('path', { d: 'M38 46h50M38 60h34M104 44l16 16m0-16-16 16', ...R, 'stroke-width': 4 }, 'white', { stroke: true, lineColor: 'dark' }),
    s('rect', { x: 24, y: 104, width: 40, height: 10, rx: 3 }, 'blue'),
    s('path', { d: 'M32 114v24M56 114v24', ...R, 'stroke-width': 4 }, 'dark', { stroke: true }),
    s('rect', { x: 96, y: 104, width: 40, height: 10, rx: 3 }, 'yellow'),
    s('path', { d: 'M104 114v24M128 114v24', ...R, 'stroke-width': 4 }, 'dark', { stroke: true })
  ],
  profesor: [
    ...person(60, 'blue'),
    s('circle', { cx: 53, cy: 60, r: 8, ...R, 'stroke-width': 3 }, 'dark', { stroke: true }),
    s('circle', { cx: 67, cy: 60, r: 8, ...R, 'stroke-width': 3 }, 'dark', { stroke: true }),
    s('path', { d: 'M112 140 128 52', ...R, 'stroke-width': 5 }, 'brown', { stroke: true }),
    s('path', { d: 'M102 42h30v14h-30z' }, 'green')
  ],
  examen: [
    s('rect', { x: 34, y: 16, width: 92, height: 128, rx: 6 }, 'cream'),
    s('path', { d: 'M48 44h40M48 60h64M48 76h56M48 92h40', ...R, 'stroke-width': 4 }, 'gray', { stroke: true }),
    s('path', { d: 'M84 112l14 14 28-34', ...R, 'stroke-width': 10 }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 112, cy: 34, r: 10 }, 'red', { accent: true })
  ],
  pregunta: [
    s('path', { d: 'M30 24h100a12 12 0 0 1 12 12v68a12 12 0 0 1-12 12H76l-24 22v-22H30a12 12 0 0 1-12-12V36a12 12 0 0 1 12-12z' }, 'blue', { accent: true }),
    s('path', { d: 'M62 62c0-22 38-22 38 0 0 14-20 14-20 32', ...R, 'stroke-width': 10 }, 'white', { stroke: true, lineColor: 'dark' }),
    s('circle', { cx: 80, cy: 110, r: 6 }, 'white')
  ],
  respuesta: [
    s('path', { d: 'M30 24h100a12 12 0 0 1 12 12v68a12 12 0 0 1-12 12h-22v22l-24-22H30a12 12 0 0 1-12-12V36a12 12 0 0 1 12-12z' }, 'yellow'),
    s('path', { d: 'M52 72l20 20 38-44', ...R, 'stroke-width': 12 }, 'green', { stroke: true, accent: true })
  ],
  ejercicio: [
    s('path', { d: 'M40 80h80', ...R, 'stroke-width': 10 }, 'dark', { stroke: true }),
    s('rect', { x: 22, y: 50, width: 18, height: 60, rx: 5 }, 'red', { accent: true }),
    s('rect', { x: 120, y: 50, width: 18, height: 60, rx: 5 }, 'red', { accent: true }),
    s('rect', { x: 8, y: 62, width: 14, height: 36, rx: 4 }, 'gray'),
    s('rect', { x: 138, y: 62, width: 14, height: 36, rx: 4 }, 'gray'),
    s('path', { d: 'M60 36q4-10 8 0M92 30q4-10 8 0', ...R, 'stroke-width': 4 }, 'blue', { stroke: true })
  ],
  cuaderno: [
    s('rect', { x: 36, y: 16, width: 90, height: 128, rx: 8 }, 'blue', { accent: true }),
    s('rect', { x: 48, y: 34, width: 66, height: 40, rx: 4 }, 'cream'),
    s('path', { d: 'M54 50h54M54 62h38', ...R, 'stroke-width': 3 }, 'gray', { stroke: true }),
    s('path', { d: 'M30 30h14M30 50h14M30 70h14M30 90h14M30 110h14M30 130h14', ...R, 'stroke-width': 6 }, 'dark', { stroke: true })
  ],
  'lápiz': [
    s('rect', { x: 66, y: 22, width: 28, height: 16, rx: 5, transform: 'rotate(40 80 80)' }, 'pink'),
    s('rect', { x: 66, y: 36, width: 28, height: 8, transform: 'rotate(40 80 80)' }, 'gray'),
    s('rect', { x: 66, y: 44, width: 28, height: 62, transform: 'rotate(40 80 80)' }, 'yellow', { accent: true }),
    s('path', { d: 'M66 106h28l-14 30z', transform: 'rotate(40 80 80)' }, 'tan'),
    s('path', { d: 'M74 124h12l-6 12z', transform: 'rotate(40 80 80)' }, 'dark')
  ],
  'bolígrafo': [
    s('rect', { x: 68, y: 16, width: 24, height: 76, rx: 8, transform: 'rotate(-40 80 80)' }, 'blue', { accent: true }),
    s('rect', { x: 94, y: 22, width: 5, height: 36, rx: 2, transform: 'rotate(-40 80 80)' }, 'gray'),
    s('path', { d: 'M68 92h24l-6 30h-12z', transform: 'rotate(-40 80 80)' }, 'gray'),
    s('circle', { cx: 80, cy: 126, r: 4, transform: 'rotate(-40 80 80)' }, 'dark'),
    s('rect', { x: 72, y: 8, width: 16, height: 10, rx: 3, transform: 'rotate(-40 80 80)' }, 'dark')
  ],
  goma: [
    s('rect', { x: 30, y: 62, width: 100, height: 52, rx: 10, transform: 'rotate(-18 80 88)' }, 'pink', { accent: true }),
    s('rect', { x: 66, y: 62, width: 64, height: 52, rx: 10, transform: 'rotate(-18 80 88)' }, 'blue'),
    s('rect', { x: 66, y: 62, width: 14, height: 52, transform: 'rotate(-18 80 88)' }, 'blue'),
    s('circle', { cx: 40, cy: 132, r: 5 }, 'pink'),
    s('circle', { cx: 56, cy: 140, r: 4 }, 'pink'),
    s('circle', { cx: 28, cy: 142, r: 3 }, 'pink')
  ],
  mochila: [
    s('path', { d: 'M62 40a18 18 0 0 1 36 0', ...R, 'stroke-width': 7 }, 'dark', { stroke: true }),
    s('rect', { x: 32, y: 36, width: 96, height: 108, rx: 30 }, 'red', { accent: true }),
    s('rect', { x: 46, y: 90, width: 68, height: 44, rx: 14 }, 'orange'),
    s('path', { d: 'M46 112h68', ...R, 'stroke-width': 3 }, 'dark', { stroke: true }),
    s('path', { d: 'M52 60h56', ...R, 'stroke-width': 4, 'stroke-dasharray': '2 7' }, 'cream', { stroke: true }),
    s('rect', { x: 74, y: 106, width: 12, height: 12, rx: 3 }, 'yellow')
  ],
  pizarra: [
    s('rect', { x: 14, y: 26, width: 132, height: 92, rx: 6 }, 'brown'),
    s('rect', { x: 22, y: 34, width: 116, height: 76, rx: 3 }, 'green', { accent: true }),
    s('path', { d: 'M34 54h44M34 72h30M96 52l22 24m0-24-22 24', ...R, 'stroke-width': 4 }, 'white', { stroke: true, lineColor: 'dark' }),
    s('rect', { x: 10, y: 118, width: 140, height: 10, rx: 3 }, 'brown'),
    s('rect', { x: 100, y: 112, width: 22, height: 6, rx: 2 }, 'white', { lineColor: 'dark' }),
    s('path', { d: 'M52 132v14M108 132v14', ...R, 'stroke-width': 5 }, 'dark', { stroke: true })
  ],
  diccionario: [
    s('rect', { x: 36, y: 16, width: 90, height: 128, rx: 6 }, 'navy', { accent: true }),
    s('rect', { x: 44, y: 16, width: 82, height: 128, rx: 6 }, 'red'),
    s('path', { d: 'M126 28v108', ...R, 'stroke-width': 6 }, 'cream', { stroke: true }),
    s('circle', { cx: 80, cy: 62, r: 17, ...R, 'stroke-width': 6 }, 'yellow', { stroke: true }),
    s('path', { d: 'M92 74l16 16', ...R, 'stroke-width': 8 }, 'yellow', { stroke: true }),
    s('path', { d: 'M60 112h46', ...R, 'stroke-width': 4 }, 'cream', { stroke: true })
  ],
  frase: [
    s('rect', { x: 18, y: 36, width: 124, height: 88, rx: 10 }, 'cream'),
    s('path', { d: 'M34 62h92M34 80h70M34 98h46', ...R, 'stroke-width': 6 }, 'blue', { stroke: true, accent: true }),
    s('circle', { cx: 100, cy: 98, r: 5 }, 'red', { accent: true })
  ],
  letra: [
    s('rect', { x: 22, y: 22, width: 116, height: 116, rx: 14 }, 'cream'),
    s('path', { d: 'M44 124 80 36l36 88M56 98h48', ...R, 'stroke-width': 14 }, 'red', { stroke: true, accent: true })
  ],
  error: [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'red', { accent: true }),
    s('path', { d: 'M56 56l48 48m0-48-48 48', ...R, 'stroke-width': 14 }, 'white', { stroke: true, lineColor: 'dark' })
  ],
  curso: [
    s('path', { d: 'M30 140C30 108 112 112 112 88S34 80 62 52', ...R, 'stroke-width': 12 }, 'gray', { stroke: true }),
    s('path', { d: 'M30 140C30 108 112 112 112 88S34 80 62 52', ...R, 'stroke-width': 3, 'stroke-dasharray': '6 8' }, 'white', { stroke: true, lineColor: 'dark' }),
    s('circle', { cx: 30, cy: 140, r: 8 }, 'blue', { accent: true }),
    s('path', { d: 'M62 52V14', ...R, 'stroke-width': 4 }, 'dark', { stroke: true }),
    s('path', { d: 'M62 14h40l-10 12 10 12H62z' }, 'red', { accent: true })
  ],
  empresa: [
    s('rect', { x: 46, y: 18, width: 68, height: 122, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 18, y: 76, width: 32, height: 64, rx: 3 }, 'sky'),
    s('rect', { x: 110, y: 90, width: 32, height: 50, rx: 3 }, 'sky'),
    s('path', { d: 'M58 36h14M88 36h14M58 56h14M88 56h14M58 76h14M88 76h14M58 96h14M88 96h14', ...R, 'stroke-width': 8 }, 'cream', { stroke: true }),
    s('rect', { x: 70, y: 112, width: 20, height: 28, rx: 2 }, 'brown')
  ],
  jefe: [
    ...person(80, 'navy'),
    s('path', { d: 'M66 80l14 14 14-14z' }, 'white'),
    s('path', { d: 'M76 92h8l4 36-8 8-8-8z' }, 'red', { accent: true }),
    s('path', { d: 'M68 34l6-14 6 10 6-10 6 14z' }, 'yellow')
  ],
  'médico': [
    ...person(80, 'sky'),
    s('path', { d: 'M62 86v22a18 18 0 0 0 36 0V86', ...R, 'stroke-width': 4 }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 132, r: 7 }, 'gray', { accent: true }),
    s('path', { d: 'M110 104h14m-7-7v14', ...R, 'stroke-width': 5 }, 'red', { stroke: true })
  ],
  enfermero: [
    ...person(80, 'green'),
    s('path', { d: 'M58 44a22 14 0 0 1 44 0v4H58z' }, 'cream'),
    s('path', { d: 'M80 30v14M73 37h14', ...R, 'stroke-width': 4 }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M62 96h36', ...R, 'stroke-width': 4 }, 'mint', { stroke: true })
  ],
  ingeniero: [
    ...person(60, 'blue', false),
    ...hardHat(60, 'yellow', true),
    s('rect', { x: 100, y: 78, width: 48, height: 60, rx: 4 }, 'sky'),
    s('path', { d: 'M108 94h32M108 108l12 12 20-20M110 126h18', ...R, 'stroke-width': 3 }, 'white', { stroke: true, lineColor: 'dark' })
  ],
  camarero: [
    ...person(62, 'dark', false),
    s('path', { d: 'M50 80l12 28 12-28z' }, 'cream'),
    s('path', { d: 'M52 82l10 6-10 6zm20 0-10 6 10 6z' }, 'red', { accent: true }),
    s('rect', { x: 94, y: 66, width: 58, height: 6, rx: 3 }, 'gray'),
    s('path', { d: 'M110 66a14 14 0 0 1 28 0z' }, 'cream'),
    s('path', { d: 'M102 108q16-10 24 0', ...R, 'stroke-width': 7 }, 'skin', { stroke: true })
  ],
  cocinero: [
    ...person(80, 'cream'),
    s('path', { d: 'M54 44a14 14 0 0 1 4-26 16 16 0 0 1 22-4 16 16 0 0 1 22 4 14 14 0 0 1 4 26z' }, 'white', { lineColor: 'dark' }),
    s('rect', { x: 58, y: 42, width: 44, height: 8, rx: 3 }, 'gray'),
    s('path', { d: 'M72 82l8 12 8-12z' }, 'red', { accent: true }),
    s('path', { d: 'M80 108v.01M80 124v.01', ...R, 'stroke-width': 6 }, 'dark', { stroke: true })
  ],
  dependiente: [
    ...person(62, 'blue', false),
    s('path', { d: 'M44 100h36v46H44z' }, 'yellow', { accent: true }),
    s('rect', { x: 100, y: 92, width: 44, height: 50, rx: 4 }, 'brown'),
    s('path', { d: 'M110 92a12 12 0 0 1 24 0', ...R, 'stroke-width': 4 }, 'dark', { stroke: true }),
    s('circle', { cx: 122, cy: 116, r: 8 }, 'orange')
  ],
  taxista: [
    s('rect', { x: 66, y: 28, width: 28, height: 14, rx: 4 }, 'white', { lineColor: 'dark' }),
    s('path', { d: 'M14 108V92l22-6 20-26h48l22 26 20 6v16z', 'stroke-linejoin': 'round' }, 'yellow', { accent: true }),
    s('path', { d: 'M46 90l14-22h40l16 22z' }, 'sky'),
    s('path', { d: 'M80 68v22', ...R, 'stroke-width': 3 }, 'yellow', { stroke: true }),
    s('circle', { cx: 46, cy: 112, r: 15 }, 'dark'),
    s('circle', { cx: 114, cy: 112, r: 15 }, 'dark'),
    s('path', { d: 'M20 100h120', ...R, 'stroke-width': 4, 'stroke-dasharray': '10 6' }, 'dark', { stroke: true })
  ],
  conductor: [
    ...person(80, 'blue', false),
    s('circle', { cx: 80, cy: 114, r: 28, ...R, 'stroke-width': 9 }, 'dark', { stroke: true, accent: true }),
    s('path', { d: 'M52 114h56M80 114v28', ...R, 'stroke-width': 7 }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 114, r: 7 }, 'yellow', { accent: true })
  ],
  artista: [
    ...person(62, 'orange', false),
    s('path', { d: 'M38 46a26 14 0 0 1 52 0z' }, 'red', { accent: true }),
    s('circle', { cx: 62, cy: 30, r: 4 }, 'red'),
    s('path', { d: 'M104 90c-14 0-20 16-10 28s34 12 44 0c8-12-8-18-14-12-6 8-12-16-20-16z' }, 'tan'),
    s('circle', { cx: 108, cy: 98, r: 5 }, 'blue'),
    s('circle', { cx: 122, cy: 106, r: 5 }, 'green'),
    s('circle', { cx: 104, cy: 114, r: 5 }, 'red')
  ],
  cantante: [
    ...person(62, 'purple', true),
    s('ellipse', { cx: 62, cy: 70, rx: 5, ry: 4 }, 'dark'),
    s('path', { d: 'M104 112l-8 28', ...R, 'stroke-width': 6 }, 'dark', { stroke: true }),
    s('circle', { cx: 108, cy: 98, r: 12 }, 'gray'),
    s('path', { d: 'M126 40v22', ...R, 'stroke-width': 4 }, 'yellow', { stroke: true }),
    s('circle', { cx: 120, cy: 64, r: 7 }, 'yellow'),
    s('path', { d: 'M126 40q12 2 14 12', ...R, 'stroke-width': 4 }, 'yellow', { stroke: true })
  ],
  periodista: [
    ...person(62, 'green'),
    s('rect', { x: 100, y: 84, width: 42, height: 54, rx: 4 }, 'cream'),
    s('path', { d: 'M108 98h26M108 110h26M108 122h16', ...R, 'stroke-width': 3 }, 'gray', { stroke: true }),
    s('path', { d: 'M130 52 110 92', ...R, 'stroke-width': 5 }, 'dark', { stroke: true }),
    s('circle', { cx: 134, cy: 46, r: 10 }, 'red', { accent: true })
  ],
  'reunión': [
    s('ellipse', { cx: 80, cy: 112, rx: 64, ry: 22 }, 'brown', { accent: true }),
    s('circle', { cx: 40, cy: 60, r: 15 }, 'skin'),
    s('path', { d: 'M20 96a20 18 0 0 1 40 0z' }, 'blue'),
    s('circle', { cx: 80, cy: 46, r: 15 }, 'skin'),
    s('path', { d: 'M60 84a20 18 0 0 1 40 0z' }, 'green'),
    s('circle', { cx: 120, cy: 60, r: 15 }, 'skin'),
    s('path', { d: 'M100 96a20 18 0 0 1 40 0z' }, 'red'),
    s('ellipse', { cx: 80, cy: 112, rx: 14, ry: 5 }, 'cream', { flatOnly: true })
  ],
  correo: [
    s('rect', { x: 18, y: 36, width: 124, height: 88, rx: 8 }, 'cream'),
    s('path', { d: 'M18 44l62 44 62-44', ...R, 'stroke-width': 5 }, 'gray', { stroke: true }),
    s('path', { d: 'M18 120l46-40M142 120L96 80', ...R, 'stroke-width': 3 }, 'gray', { stroke: true }),
    s('rect', { x: 110, y: 46, width: 22, height: 26, rx: 3 }, 'red', { accent: true })
  ],
  mensaje: [
    s('rect', { x: 46, y: 10, width: 68, height: 140, rx: 12 }, 'dark'),
    s('rect', { x: 52, y: 24, width: 56, height: 108, rx: 4 }, 'sky'),
    s('path', { d: 'M58 38h30a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H70l-8 7v-7h-4a6 6 0 0 1-6-6V44a6 6 0 0 1 6-6z' }, 'green', { accent: true }),
    s('path', { d: 'M74 78h28a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6h-4v7l-8-7H74a6 6 0 0 1-6-6V84a6 6 0 0 1 6-6z' }, 'white', { lineColor: 'dark' }),
    s('circle', { cx: 80, cy: 142, r: 3 }, 'gray')
  ],
  dentista: [
    ...person(80, 'mint', false),
    s('path', { d: 'M62 62h36v10a18 18 0 0 1-36 0z' }, 'white', { lineColor: 'dark' }),
    s('circle', { cx: 80, cy: 38, r: 8 }, 'yellow', { accent: true }),
    s('path', { d: 'M54 36h52', ...R, 'stroke-width': 5 }, 'gray', { stroke: true }),
    s('path', { d: 'M118 96c0-12 24-12 24 0 0 8-4 12-4 26h-6c0-6-2-8-4-8s-4 2-4 8h-6c0-14-0-18 0-26z' }, 'white', { lineColor: 'dark', accent: true })
  ],
  bombero: [
    ...person(80, 'yellow', false),
    ...hardHat(80, 'red', true),
    s('path', { d: 'M74 40h12v10H74z' }, 'yellow'),
    s('path', { d: 'M44 112h72M44 126h72', ...R, 'stroke-width': 6 }, 'gray', { stroke: true }),
    s('path', { d: 'M126 96c8 8 10 18 2 26-8-4-16-10-2-26z' }, 'orange', { accent: true })
  ],
  piloto: [
    ...person(70, 'navy', false),
    s('path', { d: 'M46 54a24 22 0 0 1 48 0z' }, 'navy', { accent: true }),
    s('rect', { x: 42, y: 52, width: 56, height: 6, rx: 3 }, 'dark'),
    s('path', { d: 'M64 38l6-6 6 6-6 4z' }, 'yellow'),
    s('path', { d: 'M52 100h36M52 114h36', ...R, 'stroke-width': 4 }, 'yellow', { stroke: true }),
    s('path', { d: 'M112 40l36-8-4 12-24 8 8 18-8 2-14-16-14 6-4-6 14-8z', 'stroke-linejoin': 'round' }, 'sky')
  ],
  carpeta: [
    s('rect', { x: 36, y: 30, width: 84, height: 100, rx: 4, transform: 'rotate(-8 80 80)' }, 'cream'),
    s('path', { d: 'M20 54h42l10 14h68v66a8 8 0 0 1-8 8H28a8 8 0 0 1-8-8z', 'stroke-linejoin': 'round' }, 'yellow', { accent: true }),
    s('path', { d: 'M20 78h120', ...R, 'stroke-width': 3 }, 'orange', { stroke: true }),
    s('rect', { x: 66, y: 98, width: 28, height: 8, rx: 3 }, 'orange')
  ],
  regla: [
    s('rect', { x: 14, y: 62, width: 132, height: 36, rx: 5, transform: 'rotate(-25 80 80)' }, 'yellow', { accent: true }),
    s('path', { d: 'M30 62v14M46 62v8M62 62v14M78 62v8M94 62v14M110 62v8M126 62v14', ...R, 'stroke-width': 3, transform: 'rotate(-25 80 80)' }, 'dark', { stroke: true })
  ],
  tijeras: [
    s('path', { d: 'M84 74 126 14M76 74 34 14', ...R, 'stroke-width': 10 }, 'gray', { stroke: true }),
    s('circle', { cx: 52, cy: 116, r: 20, ...R, 'stroke-width': 10 }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 108, cy: 116, r: 20, ...R, 'stroke-width': 10 }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M62 98 90 62M98 98 70 62', ...R, 'stroke-width': 8 }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 78, r: 4 }, 'dark')
  ],
  horario: [
    s('rect', { x: 14, y: 22, width: 132, height: 116, rx: 8 }, 'cream'),
    s('rect', { x: 14, y: 22, width: 132, height: 22, rx: 8 }, 'blue', { accent: true }),
    s('path', { d: 'M14 70h132M14 100h132M58 44v94M102 44v94', fill: 'none', 'stroke-width': 3 }, 'gray', { stroke: true }),
    s('rect', { x: 20, y: 76, width: 32, height: 18, rx: 3 }, 'green'),
    s('rect', { x: 64, y: 48, width: 32, height: 18, rx: 3 }, 'yellow'),
    s('rect', { x: 108, y: 106, width: 32, height: 26, rx: 3 }, 'pink')
  ],
  'matemáticas': [
    s('rect', { x: 14, y: 14, width: 62, height: 62, rx: 12 }, 'blue', { accent: true }),
    s('rect', { x: 84, y: 14, width: 62, height: 62, rx: 12 }, 'red'),
    s('rect', { x: 14, y: 84, width: 62, height: 62, rx: 12 }, 'green'),
    s('rect', { x: 84, y: 84, width: 62, height: 62, rx: 12 }, 'orange'),
    s('path', { d: 'M30 45h30M45 30v30M98 45h34M33 103l24 24m0-24-24 24M98 115h34M115 101h.01M115 129h.01', ...R, 'stroke-width': 7 }, 'white', { stroke: true, lineColor: 'dark' })
  ],
  ciencia: [
    s('path', { d: 'M64 16h32M70 16v42L36 120a12 12 0 0 0 10 20h68a12 12 0 0 0 10-20L90 58V16', 'stroke-linejoin': 'round', ...R, 'stroke-width': 7 }, 'dark', { stroke: true }),
    s('path', { d: 'M50 96h60l16 26a8 8 0 0 1-7 14H41a8 8 0 0 1-7-14z' }, 'green', { accent: true }),
    s('circle', { cx: 72, cy: 112, r: 6 }, 'mint'),
    s('circle', { cx: 94, cy: 120, r: 4 }, 'mint'),
    s('circle', { cx: 86, cy: 74, r: 5 }, 'green'),
    s('circle', { cx: 78, cy: 42, r: 4 }, 'green')
  ]
};
