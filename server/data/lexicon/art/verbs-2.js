// Illustration specs for verbs-2 (see server/scripts/lexicon/art.js)
const { s } = require("../../../scripts/lexicon/art");

const R = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
const face = (cx, cy, r, mouth) => [
  s('circle', { cx, cy, r }, 'skin'),
  s('circle', { cx: cx - r * 0.35, cy: cy - r * 0.1, r: 3 }, 'dark'),
  s('circle', { cx: cx + r * 0.35, cy: cy - r * 0.1, r: 3 }, 'dark')
];

module.exports = {
  limpiar: [
    s('rect', { x: 22, y: 96, width: 116, height: 40, rx: 8 }, 'sky'),
    s('path', { d: 'M52 96 96 30l16 8-34 58z' }, 'brown'),
    s('rect', { x: 52, y: 84, width: 52, height: 20, rx: 6, transform: 'rotate(-28 78 94)' }, 'yellow', { accent: true }),
    s('path', { d: 'M110 52l4 8 8 4-8 4-4 8-4-8-8-4 8-4zM36 60l3 6 6 3-6 3-3 6-3-6-6-3 6-3z' }, 'white', { flatOnly: true }),
    s('path', { d: 'M110 52l4 8 8 4-8 4-4 8-4-8-8-4 8-4z' }, 'blue')
  ],
  invitar: [
    s('rect', { x: 28, y: 44, width: 104, height: 76, rx: 8 }, 'cream', { accent: true }),
    s('path', { d: 'M28 52l52 38 52-38', ...R, 'stroke-width': 4 }, 'brown', { stroke: true }),
    s('path', { d: 'M80 110c-14-10-18-18-12-24 4-4 10-2 12 3 2-5 8-7 12-3 6 6 2 14-12 24z' }, 'red'),
    s('circle', { cx: 130, cy: 36, r: 7 }, 'yellow'),
    s('circle', { cx: 26, cy: 130, r: 5 }, 'pink')
  ],
  regalar: [
    s('rect', { x: 32, y: 70, width: 96, height: 62, rx: 5 }, 'red', { accent: true }),
    s('rect', { x: 26, y: 54, width: 108, height: 22, rx: 5 }, 'orange'),
    s('rect', { x: 72, y: 54, width: 16, height: 78 }, 'yellow'),
    s('path', { d: 'M80 54C60 30 44 36 52 48c6 8 20 6 28 6zM80 54c20-24 36-18 28-6-6 8-20 6-28 6z' }, 'yellow')
  ],
  enviar: [
    s('path', { d: 'M20 120h120', ...R, 'stroke-width': 4, 'stroke-dasharray': '8 8' }, 'gray', { stroke: true }),
    s('rect', { x: 36, y: 40, width: 80, height: 54, rx: 6 }, 'cream'),
    s('path', { d: 'M36 46l40 30 40-30', ...R, 'stroke-width': 4 }, 'brown', { stroke: true }),
    s('path', { d: 'M116 100h22m-8-10 10 10-10 10', ...R, 'stroke-width': 6 }, 'blue', { stroke: true }),
    s('path', { d: 'M12 60h18M8 76h22M16 92h14', ...R, 'stroke-width': 4 }, 'sky', { stroke: true }),
    s('circle', { cx: 120, cy: 40, r: 10 }, 'blue', { accent: true })
  ],
  repetir: [
    s('path', { d: 'M120 52a46 46 0 1 0 10 38', ...R, 'stroke-width': 10 }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M138 28v36H102z' }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 82, r: 12 }, 'yellow')
  ],
  amar: [
    s('path', { d: 'M80 140C20 100 14 62 38 42c16-14 34-6 42 10 8-16 26-24 42-10 24 20 18 58-42 98z' }, 'red', { accent: true }),
    s('path', { d: 'M44 64c4-8 10-10 16-8', ...R, 'stroke-width': 5 }, 'white', { stroke: true, lineColor: 'dark' }),
    s('path', { d: 'M132 24l2 6 6 2-6 2-2 6-2-6-6-2 6-2z' }, 'yellow')
  ],
  sonreír: [
    s('circle', { cx: 80, cy: 80, r: 50 }, 'yellow', { accent: true }),
    s('circle', { cx: 62, cy: 70, r: 5 }, 'dark'),
    s('circle', { cx: 98, cy: 70, r: 5 }, 'dark'),
    s('path', { d: 'M56 92q24 22 48 0', ...R, 'stroke-width': 5 }, 'dark', { stroke: true }),
    s('circle', { cx: 48, cy: 90, r: 6, opacity: 0.6 }, 'pink', { flatOnly: true })
  ],
  reír: [
    s('circle', { cx: 80, cy: 80, r: 50 }, 'yellow', { accent: true }),
    s('path', { d: 'M52 66q10-10 20 0M88 66q10-10 20 0', ...R, 'stroke-width': 5 }, 'dark', { stroke: true }),
    s('path', { d: 'M50 86q30 4 60 0q-6 34-30 34t-30-34z' }, 'dark'),
    s('path', { d: 'M62 108q18 10 36 0q-18-8-36 0z' }, 'pink', { flatOnly: true }),
    s('path', { d: 'M18 58q-8 12 0 24M142 58q8 12 0 24', ...R, 'stroke-width': 4 }, 'orange', { stroke: true })
  ],
  llorar: [
    s('circle', { cx: 80, cy: 78, r: 48 }, 'skin'),
    s('path', { d: 'M52 62l18 4M108 62l-18 4', ...R, 'stroke-width': 4 }, 'dark', { stroke: true }),
    s('path', { d: 'M54 78q8 6 16 0M90 78q8 6 16 0', ...R, 'stroke-width': 4 }, 'dark', { stroke: true }),
    s('path', { d: 'M64 112q16-12 32 0', ...R, 'stroke-width': 4 }, 'dark', { stroke: true }),
    s('path', { d: 'M56 88c-6 10-8 16-2 18 6 0 8-8 2-18zM104 88c-6 10-8 16-2 18 6 0 8-8 2-18z' }, 'blue', { accent: true }),
    s('path', { d: 'M52 112v26M108 112v26', ...R, 'stroke-width': 5 }, 'blue', { stroke: true })
  ],
  nacer: [
    s('path', { d: 'M80 140c-34 0-52-22-52-46 0-24 24-52 52-52s52 28 52 52c0 24-18 46-52 46z' }, 'cream', { accent: true }),
    s('path', { d: 'M28 100l16-14 14 14 14-14 14 14 14-14 14 14 14-14 14 14v-4c0-6-2-12-4-18H32c-2 6-4 12-4 18z' }, 'white', { flatOnly: true }),
    s('path', { d: 'M28 94l14-12 14 12 14-12 14 12 14-12 14 12 14-12 10 10', ...R, 'stroke-width': 3 }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 52, r: 18 }, 'skin'),
    s('path', { d: 'M70 50h0M90 50h0', ...R, 'stroke-width': 6 }, 'dark', { stroke: true }),
    s('path', { d: 'M116 28l2 6 6 2-6 2-2 6-2-6-6-2 6-2z' }, 'yellow')
  ],
  crecer: [
    s('path', { d: 'M20 138h120', ...R, 'stroke-width': 5 }, 'brown', { stroke: true }),
    s('path', { d: 'M40 138v-18M40 120c-10-2-14-8-14-14 8 0 14 4 14 14z' }, 'green'),
    s('path', { d: 'M80 138V86', ...R, 'stroke-width': 6 }, 'green', { stroke: true }),
    s('path', { d: 'M80 100c-20 0-24-16-24-24 18 0 24 10 24 24zM80 88c18 0 24-14 24-22-16 0-24 8-24 22z' }, 'green', { accent: true }),
    s('path', { d: 'M122 138V50', ...R, 'stroke-width': 6 }, 'green', { stroke: true }),
    s('path', { d: 'M122 110c-22 0-26-18-26-26 20 0 26 12 26 26zM122 90c20 0 26-16 26-24-18 0-26 10-26 24zM122 66c-14-2-18-14-18-22 14 2 18 10 18 22z' }, 'green'),
    s('path', { d: 'M138 40v-22m-8 8 8-8 8 8', ...R, 'stroke-width': 4 }, 'orange', { stroke: true })
  ],
  casarse: [
    s('circle', { cx: 52, cy: 52, r: 15 }, 'skin'),
    s('path', { d: 'M26 134v-36a26 26 0 0 1 52 0v36z' }, 'dark'),
    s('circle', { cx: 108, cy: 52, r: 15 }, 'skin'),
    s('path', { d: 'M80 134l6-36a22 22 0 0 1 44 0l6 36z' }, 'white', { accent: true }),
    s('path', { d: 'M90 42q18-24 36 0q-18 6-36 0z' }, 'cream'),
    s('path', { d: 'M62 116a9 9 0 1 0 0 .1M76 116a9 9 0 1 0 0 .1', ...R, 'stroke-width': 4 }, 'yellow', { stroke: true }),
    s('path', { d: 'M46 94l6 6-6 6-6-6z' }, 'red')
  ],
  saludar: [
    s('circle', { cx: 66, cy: 58, r: 24 }, 'skin'),
    s('circle', { cx: 57, cy: 56, r: 3 }, 'dark'), s('circle', { cx: 75, cy: 56, r: 3 }, 'dark'),
    s('path', { d: 'M56 68q10 8 20 0', ...R, 'stroke-width': 4 }, 'dark', { stroke: true }),
    s('path', { d: 'M30 140v-36a36 36 0 0 1 72 0v36z' }, 'blue', { accent: true }),
    s('path', { d: 'M104 96 124 54', ...R, 'stroke-width': 14 }, 'skin', { stroke: true }),
    s('circle', { cx: 126, cy: 46, r: 12 }, 'skin'),
    s('path', { d: 'M142 30q8 10 4 24M148 22q12 16 6 34', ...R, 'stroke-width': 4 }, 'orange', { stroke: true })
  ],
  pintar: [
    s('path', { d: 'M96 20l22 22-52 56-22-22z' }, 'brown'),
    s('path', { d: 'M44 76l22 22-8 8c-8 8-20 10-30 8 2-10 0-22 8-30z' }, 'red', { accent: true }),
    s('circle', { cx: 112, cy: 112, r: 12 }, 'blue'),
    s('circle', { cx: 138, cy: 96, r: 9 }, 'yellow'),
    s('circle', { cx: 130, cy: 126, r: 9 }, 'green'),
    s('path', { d: 'M20 138q20-12 40 0', ...R, 'stroke-width': 6 }, 'red', { stroke: true })
  ],
  dibujar: [
    s('rect', { x: 26, y: 88, width: 108, height: 50, rx: 6 }, 'cream'),
    s('path', { d: 'M40 120q14-30 30-4t34-14 22 14', ...R, 'stroke-width': 4 }, 'gray', { stroke: true }),
    s('path', { d: 'M104 24l24 24-52 52-28 6 4-28z' }, 'yellow', { accent: true }),
    s('path', { d: 'M52 78l28 28-28 6z' }, 'tan'),
    s('path', { d: 'M48 104l-4 14 14-4z' }, 'dark')
  ],
  ahorrar: [
    s('ellipse', { cx: 76, cy: 90, rx: 46, ry: 36 }, 'pink', { accent: true }),
    s('circle', { cx: 120, cy: 84, r: 16 }, 'pink'),
    s('circle', { cx: 126, cy: 80, r: 3 }, 'dark'),
    s('rect', { x: 52, y: 54, width: 30, height: 6, rx: 3 }, 'dark'),
    s('rect', { x: 50, y: 116, width: 12, height: 20, rx: 4 }, 'pink'),
    s('rect', { x: 92, y: 116, width: 12, height: 20, rx: 4 }, 'pink'),
    s('circle', { cx: 66, cy: 24, r: 12 }, 'yellow'),
    s('path', { d: 'M20 80q-10 4-8 14', ...R, 'stroke-width': 4 }, 'pink', { stroke: true })
  ],
  llover: [
    s('path', { d: 'M38 74a22 22 0 0 1 8-42 30 30 0 0 1 56-2 24 24 0 0 1 20 44z' }, 'gray', { accent: true }),
    s('path', { d: 'M50 90l-8 20M74 90l-8 20M98 90l-8 20M122 90l-8 20M62 120l-8 20M86 120l-8 20M110 120l-8 20', ...R, 'stroke-width': 5 }, 'blue', { stroke: true })
  ],
  nevar: [
    s('path', { d: 'M38 74a22 22 0 0 1 8-42 30 30 0 0 1 56-2 24 24 0 0 1 20 44z' }, 'gray', { accent: true }),
    s('circle', { cx: 50, cy: 100, r: 7 }, 'sky'),
    s('circle', { cx: 80, cy: 114, r: 7 }, 'sky'),
    s('circle', { cx: 110, cy: 100, r: 7 }, 'sky'),
    s('circle', { cx: 64, cy: 138, r: 7 }, 'sky'),
    s('circle', { cx: 98, cy: 142, r: 7 }, 'sky')
  ],
  parar: [
    s('path', { d: 'M62 20h36l30 30v36l-30 30H62L32 86V50z', 'stroke-linejoin': 'round' }, 'red', { accent: true }),
    s('rect', { x: 50, y: 62, width: 60, height: 14, rx: 4 }, 'white'),
    s('path', { d: 'M76 116h8v34h-8z' }, 'gray')
  ],
  girar: [
    s('path', { d: 'M46 124a46 46 0 1 1 72-8', ...R, 'stroke-width': 10 }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M104 96l22 28 16-30z' }, 'blue', { accent: true }),
    s('circle', { cx: 46, cy: 126, r: 8 }, 'yellow')
  ],
  cruzar: [
    s('rect', { x: 8, y: 60, width: 144, height: 70, rx: 4 }, 'dark'),
    s('path', { d: 'M28 60v70M58 60v70M88 60v70M118 60v70', 'stroke-width': 14, fill: 'none' }, 'white', { stroke: true, lineColor: 'gray' }),
    s('circle', { cx: 80, cy: 32, r: 13 }, 'skin'),
    s('path', { d: 'M80 46v14', ...R, 'stroke-width': 3 }, 'blue', { stroke: true }),
    s('path', { d: 'M36 20h20M104 20h20', ...R, 'stroke-width': 5 }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M20 146h120m-10-8 10 8-10 8', ...R, 'stroke-width': 5 }, 'blue', { stroke: true, accent: true })
  ],
  compartir: [
    s('circle', { cx: 80, cy: 80, r: 44 }, 'yellow', { accent: true }),
    s('path', { d: 'M80 36v88M36 80h88', ...R, 'stroke-width': 4 }, 'orange', { stroke: true }),
    s('circle', { cx: 62, cy: 62, r: 6 }, 'red'),
    s('circle', { cx: 98, cy: 62, r: 6 }, 'red'),
    s('circle', { cx: 62, cy: 98, r: 6 }, 'red'),
    s('circle', { cx: 98, cy: 98, r: 6 }, 'red'),
    s('path', { d: 'M16 80l-8 0M152 80h-8', ...R, 'stroke-width': 4 }, 'gray', { stroke: true })
  ],
  arreglar: [
    s('path', { d: 'M38 128 92 74', ...R, 'stroke-width': 16 }, 'gray', { stroke: true }),
    s('path', { d: 'M88 78C74 62 80 40 98 32l-2 16 10 10 16-2c-4 20-24 28-34 22z' }, 'blue', { accent: true }),
    s('path', { d: 'M110 108l24 24', ...R, 'stroke-width': 14 }, 'brown', { stroke: true }),
    s('path', { d: 'M104 112 124 92M96 102l20-20', ...R, 'stroke-width': 5 }, 'dark', { stroke: true }),
    s('circle', { cx: 40, cy: 40, r: 5 }, 'yellow')
  ],
  romper: [
    s('path', { d: 'M20 60h50l14 16-8 18 10 14-12 24H20z' }, 'cream', { accent: true }),
    s('path', { d: 'M140 60H96l-6 14 10 16-8 14 10 16 6 18h32z' }, 'cream'),
    s('path', { d: 'M82 50l-6-22M96 54l12-20M70 64 50 40', ...R, 'stroke-width': 4 }, 'orange', { stroke: true }),
    s('path', { d: 'M34 90h24M110 100h22', ...R, 'stroke-width': 3 }, 'tan', { stroke: true })
  ],
  construir: [
    s('rect', { x: 20, y: 110, width: 120, height: 28, rx: 3 }, 'red', { accent: true }),
    s('rect', { x: 36, y: 84, width: 88, height: 26, rx: 3 }, 'red'),
    s('path', { d: 'M20 124h120M70 110v28M110 110v28M50 84v26M90 84v26', 'stroke-width': 3, fill: 'none' }, 'cream', { stroke: true, lineColor: 'dark' }),
    s('path', { d: 'M52 30h56l-6 30H58z' }, 'yellow'),
    s('path', { d: 'M48 34h64v8H48z' }, 'orange'),
    s('rect', { x: 66, y: 60, width: 28, height: 22, rx: 3 }, 'brown')
  ],
  pasear: [
    s('circle', { cx: 56, cy: 40, r: 15 }, 'skin'),
    s('rect', { x: 40, y: 58, width: 32, height: 46, rx: 14 }, 'green', { accent: true }),
    s('path', { d: 'M50 104 42 138M64 104l12 34', ...R, 'stroke-width': 8 }, 'dark', { stroke: true }),
    s('path', { d: 'M70 70 98 84', ...R, 'stroke-width': 4 }, 'gray', { stroke: true }),
    s('ellipse', { cx: 122, cy: 116, rx: 22, ry: 14 }, 'tan'),
    s('circle', { cx: 142, cy: 100, r: 10 }, 'tan'),
    s('path', { d: 'M104 128v10M126 128v10M146 94l8-8', ...R, 'stroke-width': 5 }, 'brown', { stroke: true })
  ],
  saltar: [
    s('circle', { cx: 80, cy: 36, r: 15 }, 'skin'),
    s('rect', { x: 66, y: 54, width: 28, height: 42, rx: 12 }, 'orange', { accent: true }),
    s('path', { d: 'M68 62 40 44M92 62l28-18M72 94l-14 24M88 94l14 24', ...R, 'stroke-width': 7 }, 'dark', { stroke: true }),
    s('path', { d: 'M30 140h100', ...R, 'stroke-width': 5 }, 'gray', { stroke: true }),
    s('path', { d: 'M68 130h24', ...R, 'stroke-width': 3, 'stroke-dasharray': '4 6' }, 'gray', { stroke: true })
  ],
  volar: [
    s('path', { d: 'M12 94c30-30 54-28 68-2-14-8-34-6-68 2z' }, 'sky'),
    s('path', { d: 'M148 94c-30-30-54-28-68-2 14-8 34-6 68 2z' }, 'sky'),
    s('path', { d: 'M52 92c10-30 30-32 28-4 2-28 18-26 28 4-12-14-40-14-56 0z' }, 'blue', { accent: true }),
    s('ellipse', { cx: 80, cy: 98, rx: 16, ry: 24 }, 'dark'),
    s('circle', { cx: 80, cy: 68, r: 10 }, 'dark'),
    s('path', { d: 'M20 134q20-8 40 0M100 138q20-8 40 0', ...R, 'stroke-width': 4 }, 'gray', { stroke: true })
  ],
  montar: [
    s('ellipse', { cx: 76, cy: 94, rx: 40, ry: 26 }, 'brown', { accent: true }),
    s('path', { d: 'M104 80l18-34 22 12-12 34z' }, 'brown'),
    s('path', { d: 'M52 112v28M70 114v28M92 112v26M108 108v28', ...R, 'stroke-width': 7 }, 'brown', { stroke: true }),
    s('path', { d: 'M36 84q-20 4-22 28', ...R, 'stroke-width': 6 }, 'dark', { stroke: true }),
    s('circle', { cx: 74, cy: 50, r: 11 }, 'skin'),
    s('rect', { x: 62, y: 62, width: 24, height: 30, rx: 10 }, 'blue'),
    s('rect', { x: 56, y: 72, width: 38, height: 8, rx: 3 }, 'red')
  ],
  encender: [
    s('path', { d: 'M80 14c18 22 36 44 36 70a36 36 0 0 1-72 0c0-14 8-24 16-34 2 12 10 14 14 10-6-18-2-32 6-46z' }, 'orange', { accent: true }),
    s('path', { d: 'M80 70c10 14 18 22 18 36a18 18 0 0 1-36 0c0-10 6-16 10-22 2 6 6 8 8 6-2-8-2-14 0-20z' }, 'yellow'),
    s('rect', { x: 56, y: 124, width: 48, height: 20, rx: 4 }, 'cream')
  ],
  apagar: [
    s('path', { d: 'M62 14h36v34c14 8 24 22 24 38a42 42 0 0 1-84 0c0-16 10-30 24-38z' }, 'gray', { accent: true }),
    s('path', { d: 'M62 14h36v18H62z' }, 'cream'),
    s('path', { d: 'M54 116h52M80 100v16M64 74q16-22 32 0' , ...R, 'stroke-width': 4 }, 'dark', { stroke: true }),
    s('path', { d: 'M132 20l-4 12M144 36l-10 6M20 28l8 10', ...R, 'stroke-width': 4 }, 'yellow', { stroke: true }),
    s('rect', { x: 62, y: 136, width: 36, height: 10, rx: 3 }, 'brown')
  ],
  peinarse: [
    ...face(80, 62, 34),
    s('path', { d: 'M62 82q18 14 36 0', ...R, 'stroke-width': 4 }, 'dark', { stroke: true }),
    s('path', { d: 'M44 56q4-34 36-34t36 34q-20-14-36-12t-36 12z' }, 'brown'),
    s('rect', { x: 100, y: 22, width: 44, height: 14, rx: 3, transform: 'rotate(24 122 29)' }, 'orange', { accent: true }),
    s('path', { d: 'M110 22l4 -10M120 26l5-10M130 30l5-10', ...R, 'stroke-width': 3 }, 'orange', { stroke: true }),
    s('path', { d: 'M40 126h80', ...R, 'stroke-width': 4 }, 'gray', { stroke: true })
  ],
  llenar: [
    s('path', { d: 'M38 34h84l-12 100a8 8 0 0 1-8 8H58a8 8 0 0 1-8-8z' }, 'white'),
    s('path', { d: 'M42 62h76l-8 72H50z' }, 'blue', { accent: true }),
    s('path', { d: 'M42 62q19-10 38 0t38 0', ...R, 'stroke-width': 4 }, 'sky', { stroke: true }),
    s('path', { d: 'M38 34h84', ...R, 'stroke-width': 4 }, 'gray', { stroke: true }),
    s('path', { d: 'M138 20c-4 8-8 12-4 16 4 2 10-4 4-16z' }, 'blue')
  ],
  firmar: [
    s('rect', { x: 22, y: 20, width: 100, height: 120, rx: 6 }, 'cream'),
    s('path', { d: 'M38 44h68M38 62h68M38 80h40', ...R, 'stroke-width': 4 }, 'gray', { stroke: true }),
    s('path', { d: 'M36 118q12-26 20-8t16-6 18 8', ...R, 'stroke-width': 4 }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M148 56l-6 44-14 22-4-24z' }, 'yellow', { accent: true }),
    s('path', { d: 'M124 98l4 24 14-22z' }, 'dark')
  ]
};
