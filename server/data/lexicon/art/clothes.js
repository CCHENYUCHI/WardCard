// Illustration specs for theme "clothes" (see server/scripts/lexicon/art.js)
const { s } = require("../../../scripts/lexicon/art");

const ln = (d, color, w = 4, extra = {}) =>
  s('path', { d, fill: 'none', 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, color, { stroke: true, ...extra });

module.exports = {
  ropa: [
    ln('M16 34h128', 'brown', 5),
    ln('M80 34v-10q0-6 8-6', 'brown', 4),
    s('path', { d: 'M30 38l12 4 12-4 4 12-8 6v26H34V56l-8-6z' }, 'blue', { accent: true }),
    s('path', { d: 'M92 38h24l6 10v38H86V48z' }, 'red'),
    s('path', { d: 'M66 38h24v20H66z' }, 'yellow'),
    s('path', { d: 'M40 108h28v34H40zM92 108h28v34H92z' }, 'green')
  ],
  camisa: [
    s('path', { d: 'M54 24 80 40l26-16 38 20-14 26-14-6v70H44V64l-14 6L16 44z', 'stroke-linejoin': 'round' }, 'sky', { accent: true }),
    s('path', { d: 'M54 24 80 56 106 24 80 40z' }, 'white'),
    ln('M80 56v80', 'white', 3),
    s('circle', { cx: 80, cy: 76, r: 3 }, 'dark'), s('circle', { cx: 80, cy: 96, r: 3 }, 'dark'), s('circle', { cx: 80, cy: 116, r: 3 }, 'dark')
  ],
  camiseta: [
    s('path', { d: 'M56 24q24 20 48 0l40 22-14 26-16-8v66H46V64l-16 8L16 46z', 'stroke-linejoin': 'round' }, 'red', { accent: true }),
    s('path', { d: 'M56 24q24 20 48 0', fill: 'none', 'stroke-width': 5 }, 'white', { stroke: true, lineColor: 'dark' }),
    s('circle', { cx: 80, cy: 88, r: 14 }, 'yellow')
  ],
  pantalón: [
    s('path', { d: 'M40 20h80l8 124H90L80 70l-10 74H32z', 'stroke-linejoin': 'round' }, 'navy', { accent: true }),
    s('rect', { x: 40, y: 20, width: 80, height: 12 }, 'blue'),
    ln('M80 32v38', 'blue', 3),
    s('rect', { x: 46, y: 44, width: 16, height: 18, rx: 2 }, 'blue')
  ],
  falda: [
    s('path', { d: 'M54 24h52l36 112H18z', 'stroke-linejoin': 'round' }, 'pink', { accent: true }),
    s('rect', { x: 54, y: 24, width: 52, height: 12, rx: 3 }, 'red'),
    ln('M70 38l-14 98M90 38l14 98M80 38v98', 'red', 3)
  ],
  vestido: [
    s('path', { d: 'M60 16l8 22h24l8-22', fill: 'none', 'stroke-width': 5 }, 'purple', { stroke: true }),
    s('path', { d: 'M62 36h36l6 36 10 0 14 70H30l14-70h10z', 'stroke-linejoin': 'round' }, 'purple', { accent: true }),
    s('rect', { x: 52, y: 70, width: 56, height: 8, rx: 3 }, 'yellow'),
    ln('M50 100q30 12 60 0', 'pink', 3)
  ],
  chaqueta: [
    s('path', { d: 'M50 24h60l34 26-6 66-18-4v30H40v-30l-18 4-6-66z', 'stroke-linejoin': 'round' }, 'brown', { accent: true }),
    s('path', { d: 'M62 24l18 36 18-36z' }, 'tan'),
    ln('M80 60v76', 'dark', 3),
    s('rect', { x: 44, y: 100, width: 22, height: 6, rx: 3 }, 'dark'), s('rect', { x: 94, y: 100, width: 22, height: 6, rx: 3 }, 'dark'),
    s('circle', { cx: 80, cy: 80, r: 3 }, 'yellow'), s('circle', { cx: 80, cy: 100, r: 3 }, 'yellow')
  ],
  abrigo: [
    s('path', { d: 'M48 18h64l34 28-6 94H20l-6-94z', 'stroke-linejoin': 'round' }, 'red', { accent: true }),
    s('path', { d: 'M62 18l18 34 18-34z' }, 'cream'),
    ln('M80 52v88', 'dark', 3),
    s('circle', { cx: 70, cy: 80, r: 4 }, 'dark'), s('circle', { cx: 70, cy: 104, r: 4 }, 'dark'), s('circle', { cx: 70, cy: 128, r: 4 }, 'dark'),
    s('rect', { x: 94, y: 98, width: 22, height: 6, rx: 3 }, 'dark')
  ],
  jersey: [
    s('path', { d: 'M52 24q28 16 56 0l36 24-6 56-16-4v36H38v-36l-16 4-6-56z', 'stroke-linejoin': 'round' }, 'orange', { accent: true }),
    s('path', { d: 'M52 24q28 16 56 0', fill: 'none', 'stroke-width': 8 }, 'yellow', { stroke: true }),
    ln('M38 132h84M22 100l12 2M138 100l-12 2', 'yellow', 6),
    ln('M60 70h40M60 86h40', 'yellow', 4)
  ],
  zapato: [
    s('path', { d: 'M22 42h38v36q14 8 40 12 36 6 40 24v16H22z', 'stroke-linejoin': 'round' }, 'brown', { accent: true }),
    s('rect', { x: 22, y: 122, width: 118, height: 12, rx: 3 }, 'dark'),
    s('path', { d: 'M60 78q14 8 40 12' , fill: 'none', 'stroke-width': 3 }, 'tan', { stroke: true }),
    ln('M62 56h-14M62 66h-14', 'cream', 3)
  ],
  zapatilla: [
    s('path', { d: 'M24 70q10-26 36-26 6 18 20 26 40 6 62 24v20H24z', 'stroke-linejoin': 'round' }, 'white'),
    s('path', { d: 'M24 70q10-26 36-26 6 18 20 26 40 6 62 24v20H24z', fill: 'none', 'stroke-width': 3, 'stroke-linejoin': 'round' }, 'gray', { stroke: true }),
    s('path', { d: 'M24 110h122v14a6 6 0 0 1-6 6H30a6 6 0 0 1-6-6z' }, 'blue', { accent: true }),
    ln('M82 70l14-10M92 78l14-10M102 84l12-10', 'red', 4),
    s('path', { d: 'M40 84q16-12 34 2q-14 14-34-2z' }, 'red')
  ],
  bota: [
    s('path', { d: 'M52 16h40v68q12 8 36 12 18 6 20 20v12H34V16z', 'stroke-linejoin': 'round' }, 'brown', { accent: true }),
    s('rect', { x: 52, y: 16, width: 40, height: 14 }, 'tan'),
    s('rect', { x: 28, y: 126, width: 120, height: 12, rx: 3 }, 'dark'),
    ln('M58 44h28M58 58h28', 'dark', 3)
  ],
  calcetín: [
    s('path', { d: 'M54 18h44v62q22 4 36 22 8 14-4 26-14 8-40 4-30-4-36-26z', 'stroke-linejoin': 'round' }, 'green', { accent: true }),
    s('rect', { x: 54, y: 18, width: 44, height: 16 }, 'white'),
    s('path', { d: 'M62 110q10 8 24 4v14q-18 4-28-6z' }, 'yellow'),
    ln('M54 52h44M54 66h44', 'white', 4)
  ],
  sombrero: [
    s('ellipse', { cx: 80, cy: 108, rx: 66, ry: 18 }, 'tan'),
    s('path', { d: 'M46 108q0-62 34-62t34 62z' }, 'brown', { accent: true }),
    s('path', { d: 'M48 94q32 12 64 0v10q-32 14-64 0z' }, 'red'),
    ln('M16 108q64 34 128 0', 'brown', 3)
  ],
  gorra: [
    s('path', { d: 'M34 98q0-52 46-52t46 52z' }, 'red', { accent: true }),
    s('path', { d: 'M120 98q34-4 34 12-20 6-54 2z', 'stroke-linejoin': 'round' }, 'dark'),
    s('rect', { x: 28, y: 96, width: 98, height: 12, rx: 4 }, 'dark'),
    s('circle', { cx: 80, cy: 46, r: 6 }, 'dark'),
    ln('M80 52v40', 'white', 3),
    ln('M56 56q-6 18-4 38M104 56q6 18 4 38', 'white', 3)
  ],
  bufanda: [
    s('path', { d: 'M32 44q48-24 96 0v30q-48-20-96 0z' }, 'red', { accent: true }),
    s('path', { d: 'M92 66h30v70H92z' }, 'red'),
    ln('M92 86h30M92 104h30', 'white', 5),
    ln('M96 136v8M104 136v8M112 136v8M120 136v8', 'red', 3),
    s('path', { d: 'M32 44q24-8 48-8v30q-24-4-48 8z' }, 'orange', { flatOnly: true }),
    ln('M44 52v26M62 46v28M78 44v24', 'white', 4)
  ],
  guante: [
    s('path', { d: 'M52 80V40a8 8 0 0 1 16 0v22V28a8 8 0 0 1 16 0v34V32a8 8 0 0 1 16 0v34V44a8 8 0 0 1 16 0v52q0 20-14 28v14H66v-14Q52 112 40 90l-8-16a8 8 0 0 1 14-8z', 'stroke-linejoin': 'round' }, 'blue', { accent: true }),
    s('rect', { x: 62, y: 138, width: 52, height: 14, rx: 4 }, 'white'),
    ln('M70 100q16 8 28 0', 'sky', 3)
  ],
  cinturón: [
    s('rect', { x: 12, y: 62, width: 136, height: 28, rx: 6 }, 'brown', { accent: true }),
    s('rect', { x: 62, y: 54, width: 40, height: 44, rx: 6 }, 'gray'),
    s('rect', { x: 72, y: 64, width: 20, height: 24, rx: 3 }, 'brown'),
    s('rect', { x: 78, y: 70, width: 14, height: 4 }, 'gray'),
    s('circle', { cx: 28, cy: 76, r: 3 }, 'tan'), s('circle', { cx: 42, cy: 76, r: 3 }, 'tan'), s('circle', { cx: 120, cy: 76, r: 3 }, 'tan'), s('circle', { cx: 134, cy: 76, r: 3 }, 'tan')
  ],
  bolso: [
    ln('M50 56q0-34 30-34t30 34', 'brown', 6),
    s('path', { d: 'M30 56h100l10 76a8 8 0 0 1-8 10H28a8 8 0 0 1-8-10z', 'stroke-linejoin': 'round' }, 'pink', { accent: true }),
    s('rect', { x: 30, y: 56, width: 100, height: 22, rx: 4 }, 'red'),
    s('rect', { x: 70, y: 70, width: 20, height: 16, rx: 3 }, 'yellow')
  ],
  gafas: [
    s('circle', { cx: 46, cy: 84, r: 28 }, 'sky'),
    s('circle', { cx: 114, cy: 84, r: 28 }, 'sky'),
    s('circle', { cx: 46, cy: 84, r: 28, fill: 'none', 'stroke-width': 7 }, 'dark', { stroke: true, accent: true }),
    s('circle', { cx: 114, cy: 84, r: 28, fill: 'none', 'stroke-width': 7 }, 'dark', { stroke: true }),
    ln('M74 80q6-6 12 0', 'dark', 6),
    ln('M18 78 6 66M142 78l12-12', 'dark', 6),
    ln('M34 74q6-8 16-8', 'white', 3)
  ],
  anillo: [
    s('circle', { cx: 80, cy: 98, r: 40, fill: 'none', 'stroke-width': 14 }, 'yellow', { stroke: true, accent: true }),
    s('path', { d: 'M62 50l18-26 18 26-18 20z', 'stroke-linejoin': 'round' }, 'sky'),
    ln('M62 50h36M80 70V24', 'white', 2),
    ln('M46 118q14 24 38 22', 'orange', 4)
  ],
  pijama: [
    s('path', { d: 'M44 18h72l30 24-8 40-16-6v14H38V76l-16 6-8-40z', 'stroke-linejoin': 'round' }, 'sky', { accent: true }),
    s('path', { d: 'M62 18l18 20 18-20z' }, 'white'),
    s('path', { d: 'M38 90h84l4 52h-36l-10-34-10 34H34z', 'stroke-linejoin': 'round' }, 'blue'),
    s('path', { d: 'M110 30l5 8 8 1-6 5 2 8-9-4-8 4 2-8-6-5 8-1z' }, 'yellow'),
    s('circle', { cx: 80, cy: 52, r: 3 }, 'blue'), s('circle', { cx: 80, cy: 66, r: 3 }, 'blue')
  ],
  bañador: [
    s('path', { d: 'M30 54h100l-6 40q-4 18-20 18-12 0-14-18h-20q-2 18-14 18-16 0-20-18z', 'stroke-linejoin': 'round' }, 'blue', { accent: true }),
    s('rect', { x: 30, y: 46, width: 100, height: 12, rx: 4 }, 'white'),
    ln('M46 70h12M102 70h12', 'white', 4),
    ln('M10 130q10-10 20 0t20 0t20 0t20 0t20 0t20 0t20 0', 'sky', 4)
  ],
  traje: [
    s('path', { d: 'M48 20h64l32 28-6 92H22l-6-92z', 'stroke-linejoin': 'round' }, 'dark', { accent: true }),
    s('path', { d: 'M64 20l16 56 16-56z' }, 'white'),
    s('path', { d: 'M76 34h8l4 10-8 40-8-40z' }, 'red'),
    ln('M64 20l16 36 16-36', 'gray', 2),
    s('circle', { cx: 50, cy: 100, r: 3 }, 'gray'), s('circle', { cx: 50, cy: 118, r: 3 }, 'gray')
  ],
  corbata: [
    s('path', { d: 'M58 16h44l-6 24h-32z', 'stroke-linejoin': 'round' }, 'red', { accent: true }),
    s('path', { d: 'M62 40h36l16 90-34 16-34-16z', 'stroke-linejoin': 'round' }, 'red'),
    ln('M70 70l30 14M66 92l36 16', 'white', 5)
  ],
  talla: [
    s('path', { d: 'M52 24q28 20 56 0l36 22-12 24-14-6v58H42V64l-14 6L16 46z', 'stroke-linejoin': 'round' }, 'mint', { accent: true }),
    s('rect', { x: 62, y: 80, width: 36, height: 30, rx: 4 }, 'white'),
    ln('M70 88h20M70 98h14', 'gray', 3),
    s('rect', { x: 10, y: 130, width: 140, height: 14, rx: 3 }, 'yellow'),
    ln('M24 130v8M44 130v8M64 130v8M84 130v8M104 130v8M124 130v8', 'dark', 2)
  ],
  moda: [
    s('circle', { cx: 80, cy: 30, r: 14 }, 'skin'),
    s('path', { d: 'M62 50h36l8 40-12 8v40H66V98l-12-8z', 'stroke-linejoin': 'round' }, 'purple', { accent: true }),
    s('path', { d: 'M62 50h36l-6 14H68z' }, 'pink'),
    s('path', { d: 'M126 34l4 10 10 4-10 4-4 10-4-10-10-4 10-4zM30 90l3 7 7 3-7 3-3 7-3-7-7-3 7-3z' }, 'yellow')
  ],
  bolsillo: [
    s('rect', { x: 24, y: 20, width: 112, height: 120, rx: 6 }, 'blue'),
    s('path', { d: 'M44 60h72v50q0 20-36 28-36-8-36-28z', 'stroke-linejoin': 'round' }, 'navy', { accent: true }),
    ln('M44 60h72', 'sky', 4),
    s('circle', { cx: 112, cy: 64, r: 10 }, 'yellow')
  ],
  paraguas: [
    s('path', { d: 'M14 84q0-60 66-62 66 2 66 62q-14-14-33-4-14-14-33 0-19-14-33 0-19-10-33 4z', 'stroke-linejoin': 'round' }, 'red', { accent: true }),
    ln('M80 22v-8M80 84v52q0 12-14 12', 'dark', 5),
    ln('M47 82q8-30 33-60M113 82q-8-30-33-60', 'white', 2.5, { flatOnly: false }),
    ln('M30 118l-4 10M130 118l-4 10M50 130l-4 10', 'blue', 4)
  ],
  cartera: [
    s('rect', { x: 18, y: 36, width: 124, height: 88, rx: 10 }, 'brown', { accent: true }),
    s('path', { d: 'M18 62h124v-14a12 12 0 0 0-12-12H30a12 12 0 0 0-12 12z' }, 'tan'),
    s('rect', { x: 100, y: 74, width: 42, height: 28, rx: 6 }, 'tan'),
    s('circle', { cx: 116, cy: 88, r: 5 }, 'dark'),
    s('rect', { x: 30, y: 88, width: 42, height: 20, rx: 3 }, 'green')
  ],
  vaqueros: [
    s('path', { d: 'M40 20h80l8 124H90L80 70l-10 74H32z', 'stroke-linejoin': 'round' }, 'blue', { accent: true }),
    s('rect', { x: 40, y: 20, width: 80, height: 14 }, 'navy'),
    s('path', { d: 'M46 42q16 6 24 0M114 42q-16 6-24 0', fill: 'none', 'stroke-width': 3 }, 'yellow', { stroke: true }),
    ln('M80 34v34', 'navy', 3),
    ln('M42 140h26M92 140h26', 'sky', 3)
  ],
  blusa: [
    s('path', { d: 'M52 22q28 22 56 0l36 22-8 30-14-6v58H38V68l-14 6-8-30z', 'stroke-linejoin': 'round' }, 'pink', { accent: true }),
    s('path', { d: 'M52 22q28 22 56 0', fill: 'none', 'stroke-width': 5 }, 'white', { stroke: true, lineColor: 'dark' }),
    ln('M80 44v18', 'white', 4),
    s('circle', { cx: 80, cy: 70, r: 6 }, 'white'),
    ln('M46 130q34 12 68 0', 'red', 3)
  ]
};
