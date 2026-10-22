// Illustration specs for theme "home" (see server/scripts/lexicon/art.js)
const { s } = require("../../../scripts/lexicon/art");

const ln = (d, color, w = 4, extra = {}) =>
  s('path', { d, fill: 'none', 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, color, { stroke: true, ...extra });

module.exports = {
  piso: [
    s('rect', { x: 36, y: 20, width: 88, height: 120, rx: 4 }, 'cream'),
    s('rect', { x: 36, y: 20, width: 88, height: 14 }, 'red', { accent: true }),
    s('rect', { x: 48, y: 44, width: 18, height: 18, rx: 2 }, 'sky'), s('rect', { x: 94, y: 44, width: 18, height: 18, rx: 2 }, 'sky'),
    s('rect', { x: 48, y: 76, width: 18, height: 18, rx: 2 }, 'sky'), s('rect', { x: 94, y: 76, width: 18, height: 18, rx: 2 }, 'sky'),
    s('rect', { x: 70, y: 108, width: 20, height: 32, rx: 2 }, 'brown'),
    s('rect', { x: 70, y: 76, width: 20, height: 18, rx: 2 }, 'yellow')
  ],
  apartamento: [
    s('rect', { x: 20, y: 56, width: 56, height: 84, rx: 3 }, 'sky'),
    s('rect', { x: 84, y: 28, width: 56, height: 112, rx: 3 }, 'tan', { accent: true }),
    s('path', { d: 'M32 72h8v8h-8zM52 72h8v8h-8zM32 96h8v8h-8zM52 96h8v8h-8zM96 44h8v8h-8zM120 44h8v8h-8zM96 70h8v8h-8zM120 70h8v8h-8zM96 96h8v8h-8zM120 96h8v8h-8z' }, 'white'),
    s('rect', { x: 36, y: 118, width: 22, height: 22 }, 'brown'),
    s('rect', { x: 104, y: 118, width: 22, height: 22 }, 'brown'),
    ln('M10 142h140', 'gray')
  ],
  habitación: [
    s('rect', { x: 18, y: 24, width: 124, height: 104, rx: 4 }, 'cream'),
    s('rect', { x: 18, y: 112, width: 124, height: 16 }, 'tan'),
    s('rect', { x: 94, y: 36, width: 32, height: 34, rx: 3 }, 'sky'),
    s('rect', { x: 28, y: 84, width: 62, height: 26, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 28, y: 76, width: 18, height: 14, rx: 6 }, 'white'),
    s('rect', { x: 28, y: 110, width: 6, height: 14 }, 'brown'), s('rect', { x: 84, y: 110, width: 6, height: 14 }, 'brown')
  ],
  dormitorio: [
    s('path', { d: 'M18 90h124v34H18z' }, 'brown'),
    s('rect', { x: 18, y: 56, width: 12, height: 84, rx: 3 }, 'brown'),
    s('rect', { x: 26, y: 70, width: 108, height: 28, rx: 6 }, 'blue', { accent: true }),
    s('rect', { x: 34, y: 58, width: 30, height: 16, rx: 8 }, 'white'),
    ln('M96 24h18l-18 20h18', 'purple', 5),
    ln('M124 40h12l-12 14h12', 'purple', 4)
  ],
  salón: [
    s('rect', { x: 20, y: 76, width: 120, height: 44, rx: 12 }, 'orange', { accent: true }),
    s('rect', { x: 28, y: 50, width: 104, height: 40, rx: 12 }, 'orange'),
    s('rect', { x: 40, y: 82, width: 80, height: 22, rx: 8 }, 'yellow'),
    s('rect', { x: 14, y: 80, width: 20, height: 40, rx: 8 }, 'orange'),
    s('rect', { x: 126, y: 80, width: 20, height: 40, rx: 8 }, 'orange'),
    s('rect', { x: 30, y: 120, width: 8, height: 14 }, 'brown'), s('rect', { x: 122, y: 120, width: 8, height: 14 }, 'brown')
  ],
  cocina: [
    s('path', { d: 'M24 70h112v10a10 10 0 0 1-10 10H34a10 10 0 0 1-10-10z' }, 'gray', { accent: true }),
    s('rect', { x: 28, y: 90, width: 104, height: 10 }, 'dark'),
    s('rect', { x: 14, y: 70, width: 14, height: 8, rx: 3 }, 'dark'), s('rect', { x: 132, y: 70, width: 14, height: 8, rx: 3 }, 'dark'),
    s('rect', { x: 38, y: 62, width: 84, height: 10, rx: 4 }, 'gray'),
    ln('M70 50q-8-10 0-18M90 50q-8-10 0-18', 'sky', 4),
    s('rect', { x: 36, y: 100, width: 88, height: 40, rx: 4 }, 'red'),
    s('circle', { cx: 80, cy: 120, r: 10 }, 'cream')
  ],
  baño: [
    s('rect', { x: 52, y: 24, width: 56, height: 40, rx: 8 }, 'white'),
    s('rect', { x: 52, y: 24, width: 56, height: 40, rx: 8, fill: 'none', 'stroke-width': 3 }, 'gray', { stroke: true }),
    s('path', { d: 'M40 70h80a10 10 0 0 1-4 32c-6 8-14 12-36 12s-30-4-36-12a10 10 0 0 1-4-32z' }, 'sky', { accent: true }),
    s('rect', { x: 70, y: 112, width: 20, height: 22 }, 'sky'),
    s('rect', { x: 54, y: 134, width: 52, height: 8, rx: 3 }, 'sky'),
    s('rect', { x: 114, y: 36, width: 20, height: 6, rx: 3 }, 'gray')
  ],
  comedor: [
    s('rect', { x: 24, y: 76, width: 112, height: 14, rx: 5 }, 'brown', { accent: true }),
    s('rect', { x: 34, y: 90, width: 10, height: 48 }, 'brown'), s('rect', { x: 116, y: 90, width: 10, height: 48 }, 'brown'),
    s('ellipse', { cx: 80, cy: 72, rx: 24, ry: 6 }, 'white'),
    s('path', { d: 'M62 68q18-26 36 0z' }, 'yellow'),
    s('rect', { x: 8, y: 80, width: 6, height: 58 }, 'tan'), s('rect', { x: 8, y: 60, width: 18, height: 6, rx: 3 }, 'tan'),
    s('rect', { x: 146, y: 80, width: 6, height: 58 }, 'tan')
  ],
  jardín: [
    s('rect', { x: 0, y: 118, width: 160, height: 30 }, 'green'),
    s('rect', { x: 8, y: 80, width: 144, height: 8, rx: 3 }, 'white'),
    s('path', { d: 'M20 66l8-10 8 10v64h-16zM60 66l8-10 8 10v64h-16zM100 66l8-10 8 10v64h-16zM132 66l6-10 6 10v64h-12z' }, 'white'),
    ln('M50 128v-22M82 128v-30M114 128v-20', 'green', 4),
    s('circle', { cx: 50, cy: 100, r: 9 }, 'red', { accent: true }),
    s('circle', { cx: 82, cy: 92, r: 9 }, 'yellow'),
    s('circle', { cx: 114, cy: 102, r: 9 }, 'pink')
  ],
  terraza: [
    s('rect', { x: 8, y: 112, width: 144, height: 10, rx: 3 }, 'tan'),
    s('rect', { x: 14, y: 122, width: 8, height: 22 }, 'brown'), s('rect', { x: 138, y: 122, width: 8, height: 22 }, 'brown'),
    ln('M80 40v76', 'brown', 5),
    s('path', { d: 'M24 56q56-44 112 0z' }, 'red', { accent: true }),
    s('path', { d: 'M80 56q-26-12-56 0zM80 56q26-12 56 0z', opacity: 0.4 }, 'white', { flatOnly: true }),
    s('circle', { cx: 52, cy: 104, r: 8 }, 'cream'), s('rect', { x: 46, y: 104, width: 12, height: 8 }, 'cream'),
    s('rect', { x: 104, y: 94, width: 20, height: 18, rx: 3 }, 'sky')
  ],
  garaje: [
    s('rect', { x: 20, y: 70, width: 120, height: 66, rx: 3 }, 'gray'),
    s('path', { d: 'M12 74 80 30l68 44z', 'stroke-linejoin': 'round' }, 'red', { accent: true }),
    s('rect', { x: 36, y: 86, width: 88, height: 50 }, 'dark'),
    s('rect', { x: 36, y: 86, width: 88, height: 16 }, 'white'),
    s('path', { d: 'M46 130v-14q4-10 14-10h40q10 0 14 10v14z' }, 'blue'),
    s('circle', { cx: 58, cy: 132, r: 6 }, 'black'), s('circle', { cx: 102, cy: 132, r: 6 }, 'black')
  ],
  escalera: [
    s('path', { d: 'M20 138V112h30V88h30V64h30V40h30v98z' }, 'tan', { accent: true }),
    s('path', { d: 'M20 112h30M50 88h30M80 64h30M110 40h30', fill: 'none', 'stroke-width': 4 }, 'brown', { stroke: true }),
    ln('M20 138h120', 'dark', 4),
    s('rect', { x: 24, y: 70, width: 5, height: 40, rx: 2 }, 'dark', { flatOnly: true })
  ],
  ascensor: [
    s('rect', { x: 36, y: 16, width: 88, height: 128, rx: 6 }, 'gray', { accent: true }),
    s('rect', { x: 46, y: 28, width: 32, height: 108 }, 'white'),
    s('rect', { x: 82, y: 28, width: 32, height: 108 }, 'white'),
    ln('M80 28v108', 'dark', 3),
    s('path', { d: 'M70 22h20l-10-6z' }, 'yellow'),
    s('path', { d: 'M126 60l8-10 8 10zM126 80l8 10 8-10z' }, 'blue')
  ],
  puerta: [
    s('rect', { x: 42, y: 20, width: 76, height: 120, rx: 4 }, 'tan'),
    s('rect', { x: 52, y: 30, width: 56, height: 100, rx: 3 }, 'brown', { accent: true }),
    s('rect', { x: 60, y: 40, width: 40, height: 34, rx: 2 }, 'tan'),
    s('rect', { x: 60, y: 84, width: 40, height: 36, rx: 2 }, 'tan'),
    s('circle', { cx: 98, cy: 84, r: 5 }, 'yellow'),
    ln('M24 142h112', 'gray', 4)
  ],
  pared: [
    s('rect', { x: 14, y: 26, width: 132, height: 108, rx: 4 }, 'red', { accent: true }),
    ln('M14 62h132M14 98h132', 'cream', 3),
    ln('M50 26v36M96 26v36M30 62v36M74 62v36M120 62v36M50 98v36M96 98v36', 'cream', 3)
  ],
  suelo: [
    s('path', { d: 'M10 70h140l12 70H-2z', transform: 'translate(0 0)' }, 'tan', { accent: true }),
    ln('M80 70v70M50 70l-24 70M110 70l24 70M16 104h128', 'brown', 3),
    s('rect', { x: 66, y: 44, width: 28, height: 22, rx: 3 }, 'red')
  ],
  techo: [
    s('rect', { x: 10, y: 20, width: 140, height: 18, rx: 3 }, 'gray', { accent: true }),
    ln('M80 38v30', 'dark', 4),
    s('path', { d: 'M56 98q0-30 24-30t24 30z' }, 'yellow'),
    s('rect', { x: 52, y: 98, width: 56, height: 6, rx: 3 }, 'orange'),
    ln('M40 118l-10 12M80 114v18M120 118l10 12', 'yellow', 4)
  ],
  llave: [
    s('circle', { cx: 52, cy: 62, r: 28 }, 'yellow', { accent: true }),
    s('circle', { cx: 52, cy: 62, r: 11 }, 'white'),
    s('rect', { x: 72, y: 56, width: 70, height: 12, rx: 4 }, 'yellow'),
    s('rect', { x: 112, y: 66, width: 10, height: 18, rx: 2 }, 'yellow'),
    s('rect', { x: 128, y: 66, width: 10, height: 26, rx: 2 }, 'yellow'),
    ln('M70 50q10-10 24-6', 'white', 3, { flatOnly: true })
  ],
  mueble: [
    s('rect', { x: 26, y: 40, width: 108, height: 90, rx: 5 }, 'brown', { accent: true }),
    s('rect', { x: 34, y: 48, width: 92, height: 34, rx: 3 }, 'tan'),
    s('rect', { x: 34, y: 88, width: 92, height: 34, rx: 3 }, 'tan'),
    s('rect', { x: 68, y: 62, width: 24, height: 6, rx: 3 }, 'dark'),
    s('rect', { x: 68, y: 102, width: 24, height: 6, rx: 3 }, 'dark'),
    s('rect', { x: 32, y: 130, width: 10, height: 12 }, 'brown'), s('rect', { x: 118, y: 130, width: 10, height: 12 }, 'brown')
  ],
  mesa: [
    s('rect', { x: 20, y: 62, width: 120, height: 16, rx: 5 }, 'brown', { accent: true }),
    s('rect', { x: 30, y: 78, width: 10, height: 62 }, 'brown'), s('rect', { x: 120, y: 78, width: 10, height: 62 }, 'brown'),
    s('circle', { cx: 56, cy: 54, r: 10 }, 'red'),
    s('rect', { x: 88, y: 36, width: 22, height: 26, rx: 4 }, 'sky')
  ],
  silla: [
    s('rect', { x: 44, y: 18, width: 12, height: 120, rx: 3 }, 'brown'),
    s('rect', { x: 44, y: 22, width: 62, height: 46, rx: 6 }, 'tan', { accent: true }),
    s('rect', { x: 44, y: 84, width: 74, height: 14, rx: 5 }, 'brown'),
    s('rect', { x: 106, y: 98, width: 10, height: 40 }, 'brown'),
    ln('M62 38h34M62 52h34', 'brown', 4)
  ],
  sofá: [
    s('rect', { x: 28, y: 44, width: 104, height: 50, rx: 14 }, 'purple', { accent: true }),
    s('rect', { x: 12, y: 70, width: 136, height: 44, rx: 12 }, 'purple'),
    s('rect', { x: 32, y: 78, width: 96, height: 24, rx: 8 }, 'pink'),
    s('rect', { x: 28, y: 114, width: 10, height: 16 }, 'brown'), s('rect', { x: 122, y: 114, width: 10, height: 16 }, 'brown'),
    ln('M80 80v22', 'purple', 3)
  ],
  cama: [
    s('rect', { x: 14, y: 48, width: 12, height: 88, rx: 3 }, 'brown'),
    s('rect', { x: 134, y: 78, width: 12, height: 58, rx: 3 }, 'brown'),
    s('rect', { x: 20, y: 96, width: 126, height: 16, rx: 4 }, 'brown'),
    s('rect', { x: 26, y: 78, width: 110, height: 26, rx: 8 }, 'blue', { accent: true }),
    s('rect', { x: 30, y: 62, width: 36, height: 20, rx: 10 }, 'white'),
    ln('M82 84v18M104 84v18', 'sky', 3)
  ],
  armario: [
    s('rect', { x: 28, y: 14, width: 104, height: 120, rx: 5 }, 'brown', { accent: true }),
    s('rect', { x: 36, y: 22, width: 40, height: 104, rx: 3 }, 'tan'),
    s('rect', { x: 84, y: 22, width: 40, height: 104, rx: 3 }, 'tan'),
    s('circle', { cx: 68, cy: 76, r: 4 }, 'dark'), s('circle', { cx: 92, cy: 76, r: 4 }, 'dark'),
    s('rect', { x: 36, y: 134, width: 12, height: 10 }, 'brown'), s('rect', { x: 112, y: 134, width: 12, height: 10 }, 'brown')
  ],
  estantería: [
    s('rect', { x: 24, y: 14, width: 112, height: 128, rx: 4 }, 'brown', { accent: true }),
    s('rect', { x: 32, y: 22, width: 96, height: 112 }, 'cream'),
    ln('M32 58h96M32 96h96', 'brown', 5),
    s('rect', { x: 40, y: 32, width: 12, height: 26, rx: 2 }, 'red'), s('rect', { x: 56, y: 28, width: 12, height: 30, rx: 2 }, 'blue'), s('rect', { x: 72, y: 34, width: 12, height: 24, rx: 2 }, 'green'),
    s('rect', { x: 92, y: 74, width: 14, height: 22, rx: 2 }, 'yellow'), s('rect', { x: 40, y: 70, width: 12, height: 26, rx: 2 }, 'purple'),
    s('circle', { cx: 94, cy: 118, r: 12 }, 'orange')
  ],
  lámpara: [
    s('path', { d: 'M48 34h64l16 52H32z' }, 'yellow', { accent: true }),
    ln('M80 86v34', 'dark', 5),
    s('ellipse', { cx: 80, cy: 128, rx: 26, ry: 8 }, 'dark'),
    ln('M36 24l-8-10M80 18V6M124 24l8-10', 'yellow', 4)
  ],
  luz: [
    s('path', { d: 'M80 22a38 38 0 0 0-20 70v12h40V92a38 38 0 0 0-20-70z' }, 'yellow', { accent: true }),
    s('rect', { x: 62, y: 108, width: 36, height: 8, rx: 3 }, 'gray'),
    s('rect', { x: 68, y: 120, width: 24, height: 8, rx: 4 }, 'gray'),
    ln('M72 92V70l8 8 8-8v22', 'orange', 3),
    ln('M16 60h14M130 60h14M26 26l10 10M134 26l-10 10', 'yellow', 4)
  ],
  espejo: [
    s('ellipse', { cx: 80, cy: 72, rx: 44, ry: 56 }, 'brown', { accent: true }),
    s('ellipse', { cx: 80, cy: 72, rx: 36, ry: 48 }, 'sky'),
    ln('M58 50q6-14 22-18', 'white', 5),
    ln('M52 76l12-12', 'white', 4),
    s('rect', { x: 70, y: 126, width: 20, height: 16, rx: 3 }, 'brown')
  ],
  cuadro: [
    s('rect', { x: 20, y: 28, width: 120, height: 104, rx: 4 }, 'brown', { accent: true }),
    s('rect', { x: 32, y: 40, width: 96, height: 80 }, 'sky'),
    s('path', { d: 'M32 120V96l30-26 24 22 16-12 26 20v20z' }, 'green'),
    s('circle', { cx: 104, cy: 62, r: 10 }, 'yellow')
  ],
  alfombra: [
    s('path', { d: 'M30 60h110l-26 56H4z', 'stroke-linejoin': 'round' }, 'red', { accent: true }),
    s('path', { d: 'M42 68h88l-20 40H22z' }, 'cream'),
    s('path', { d: 'M50 74h70l-14 28H36z' }, 'orange'),
    s('circle', { cx: 80, cy: 88, r: 6 }, 'yellow'),
    ln('M10 122v10M24 122v10M38 122v10M52 122v10M66 122v10M80 122v10M94 122v10M108 122v10', 'red', 3, { flatOnly: false })
  ],
  cortina: [
    s('rect', { x: 14, y: 22, width: 132, height: 6, rx: 3 }, 'brown'),
    s('rect', { x: 36, y: 28, width: 88, height: 92 }, 'sky', { flatOnly: false }),
    s('path', { d: 'M20 28h38c-12 30-10 70 0 100H20z' }, 'purple', { accent: true }),
    s('path', { d: 'M140 28h-38c12 30 10 70 0 100h38z' }, 'purple'),
    ln('M32 40v80M46 40c-4 24-4 50 0 80M128 40v80M114 40c4 24 4 50 0 80', 'pink', 2.5),
    s('circle', { cx: 80, cy: 62, r: 14 }, 'yellow')
  ],
  televisión: [
    s('rect', { x: 14, y: 30, width: 132, height: 88, rx: 8 }, 'dark', { accent: true }),
    s('rect', { x: 24, y: 40, width: 112, height: 68, rx: 4 }, 'sky'),
    s('circle', { cx: 60, cy: 68, r: 10 }, 'yellow'),
    s('path', { d: 'M24 108V90l30-18 24 16 20-12 38 20v12z' }, 'green'),
    s('rect', { x: 62, y: 118, width: 36, height: 10 }, 'gray'),
    s('rect', { x: 46, y: 128, width: 68, height: 8, rx: 4 }, 'dark')
  ],
  ordenador: [
    s('rect', { x: 20, y: 24, width: 120, height: 82, rx: 7 }, 'gray', { accent: true }),
    s('rect', { x: 28, y: 32, width: 104, height: 66, rx: 3 }, 'navy'),
    ln('M40 50h40M40 64h60M40 78h30', 'sky', 4),
    s('rect', { x: 70, y: 106, width: 20, height: 12 }, 'gray'),
    s('rect', { x: 24, y: 118, width: 112, height: 22, rx: 6 }, 'dark'),
    ln('M36 128h88', 'gray', 3)
  ],
  teléfono: [
    s('path', { d: 'M20 62c0-20 120-20 120 0 0 8-6 12-18 10l-4-10c-20-8-56-8-76 0l-4 10c-12 2-18-2-18-10z' }, 'blue', { accent: true }),
    s('path', { d: 'M36 78h88l12 52H24z', 'stroke-linejoin': 'round' }, 'dark'),
    s('circle', { cx: 80, cy: 106, r: 20 }, 'gray'),
    s('circle', { cx: 80, cy: 106, r: 8 }, 'dark')
  ],
  móvil: [
    s('rect', { x: 46, y: 12, width: 68, height: 136, rx: 12 }, 'dark', { accent: true }),
    s('rect', { x: 53, y: 28, width: 54, height: 100, rx: 3 }, 'sky'),
    s('circle', { cx: 80, cy: 138, r: 5 }, 'gray'),
    s('rect', { x: 72, y: 18, width: 16, height: 4, rx: 2 }, 'gray'),
    s('circle', { cx: 66, cy: 52, r: 8 }, 'green'), s('circle', { cx: 94, cy: 52, r: 8 }, 'orange'),
    s('circle', { cx: 66, cy: 80, r: 8 }, 'red'), s('circle', { cx: 94, cy: 80, r: 8 }, 'yellow')
  ],
  radio: [
    s('rect', { x: 18, y: 50, width: 124, height: 78, rx: 10 }, 'orange', { accent: true }),
    s('circle', { cx: 54, cy: 90, r: 26 }, 'cream'),
    s('circle', { cx: 54, cy: 90, r: 14 }, 'brown'),
    ln('M96 74h34M96 90h34M96 106h34', 'dark', 4),
    ln('M118 50 138 18', 'dark', 4),
    s('circle', { cx: 138, cy: 18, r: 4 }, 'dark')
  ],
  nevera: [
    s('rect', { x: 40, y: 12, width: 80, height: 136, rx: 8 }, 'sky', { accent: true }),
    ln('M40 56h80', 'dark', 4),
    s('rect', { x: 106, y: 24, width: 6, height: 22, rx: 3 }, 'dark'),
    s('rect', { x: 106, y: 68, width: 6, height: 36, rx: 3 }, 'dark'),
    ln('M62 24v14M56 31h12M58 27l8 8M66 27l-8 8', 'white', 3),
    s('rect', { x: 48, y: 140, width: 10, height: 8, rx: 2 }, 'dark'), s('rect', { x: 102, y: 140, width: 10, height: 8, rx: 2 }, 'dark')
  ],
  horno: [
    s('rect', { x: 16, y: 26, width: 128, height: 110, rx: 8 }, 'gray', { accent: true }),
    s('rect', { x: 16, y: 26, width: 128, height: 26, rx: 8 }, 'dark'),
    s('circle', { cx: 40, cy: 39, r: 6 }, 'red'), s('circle', { cx: 62, cy: 39, r: 6 }, 'orange'), s('circle', { cx: 84, cy: 39, r: 6 }, 'yellow'),
    s('rect', { x: 30, y: 64, width: 100, height: 60, rx: 6 }, 'dark'),
    s('rect', { x: 38, y: 72, width: 84, height: 44, rx: 4 }, 'orange'),
    s('path', { d: 'M60 112q6-24 20-8 10-20 24 8z' }, 'yellow')
  ],
  lavadora: [
    s('rect', { x: 28, y: 14, width: 104, height: 132, rx: 8 }, 'white'),
    s('rect', { x: 28, y: 14, width: 104, height: 132, rx: 8, fill: 'none', 'stroke-width': 3 }, 'gray', { stroke: true }),
    s('rect', { x: 28, y: 14, width: 104, height: 24, rx: 8 }, 'gray'),
    s('circle', { cx: 46, cy: 26, r: 5 }, 'blue'), s('circle', { cx: 64, cy: 26, r: 5 }, 'red'),
    s('circle', { cx: 80, cy: 90, r: 38 }, 'gray'),
    s('circle', { cx: 80, cy: 90, r: 30 }, 'sky', { accent: true }),
    ln('M58 92q11-10 22 0t22 0', 'white', 4)
  ],
  microondas: [
    s('rect', { x: 14, y: 40, width: 132, height: 84, rx: 8 }, 'gray', { accent: true }),
    s('rect', { x: 24, y: 50, width: 80, height: 64, rx: 4 }, 'dark'),
    s('rect', { x: 30, y: 56, width: 68, height: 52, rx: 3 }, 'yellow'),
    ln('M40 82q6-8 12 0t12 0t12 0', 'orange', 4),
    s('circle', { cx: 126, cy: 64, r: 8 }, 'dark'), s('circle', { cx: 126, cy: 92, r: 8 }, 'dark'),
    s('rect', { x: 28, y: 124, width: 10, height: 8 }, 'dark'), s('rect', { x: 122, y: 124, width: 10, height: 8 }, 'dark')
  ],
  ducha: [
    ln('M30 140V40q0-20 24-20h30', 'gray', 6),
    s('path', { d: 'M76 22h46q8 0 6 10H70q-2-10 6-10z' }, 'gray', { accent: true }),
    ln('M82 42v14M96 42v22M110 42v14M124 42v22M89 70v14M103 76v14M117 70v14', 'blue', 4),
    s('ellipse', { cx: 104, cy: 136, rx: 36, ry: 8 }, 'sky')
  ],
  bañera: [
    s('path', { d: 'M14 70h132v14a40 40 0 0 1-40 40H54a40 40 0 0 1-40-40z' }, 'white', { accent: true }),
    s('path', { d: 'M14 70h132v14a40 40 0 0 1-40 40H54a40 40 0 0 1-40-40z', fill: 'none', 'stroke-width': 3 }, 'gray', { stroke: true }),
    s('rect', { x: 24, y: 58, width: 112, height: 16, rx: 8 }, 'sky'),
    s('circle', { cx: 56, cy: 52, r: 10 }, 'white'), s('circle', { cx: 78, cy: 44, r: 14 }, 'white'), s('circle', { cx: 100, cy: 52, r: 9 }, 'white'),
    s('rect', { x: 30, y: 124, width: 10, height: 14, rx: 3 }, 'gray'), s('rect', { x: 120, y: 124, width: 10, height: 14, rx: 3 }, 'gray')
  ],
  toalla: [
    s('rect', { x: 36, y: 20, width: 88, height: 120, rx: 6 }, 'blue', { accent: true }),
    s('rect', { x: 36, y: 44, width: 88, height: 14 }, 'white'),
    s('rect', { x: 36, y: 72, width: 88, height: 6 }, 'sky'),
    ln('M46 140v10M62 140v10M78 140v10M94 140v10M110 140v10', 'blue', 3),
    ln('M46 20v-4M62 20v-4M78 20v-4M94 20v-4M110 20v-4', 'blue', 3)
  ],
  jabón: [
    s('rect', { x: 26, y: 78, width: 108, height: 56, rx: 16 }, 'pink', { accent: true }),
    s('rect', { x: 36, y: 86, width: 88, height: 12, rx: 6 }, 'white', { flatOnly: true }),
    s('circle', { cx: 46, cy: 54, r: 14 }, 'sky'), s('circle', { cx: 86, cy: 38, r: 18 }, 'sky'), s('circle', { cx: 122, cy: 56, r: 10 }, 'sky'),
    s('circle', { cx: 100, cy: 66, r: 6 }, 'sky'),
    ln('M40 50q4-6 10-6M80 32q4-6 10-6', 'white', 3)
  ],
  cepillo: [
    s('rect', { x: 20, y: 104, width: 100, height: 14, rx: 7, transform: 'rotate(-20 70 110)' }, 'blue', { accent: true }),
    s('path', { d: 'M104 64l30-10 6 14-30 10z' }, 'white'),
    ln('M114 62l-4-10M122 60l-4-10M130 56l-4-10M136 62l-2-8', 'sky', 4),
    s('path', { d: 'M104 64l30-10 6 14-30 10z', fill: 'none', 'stroke-width': 3 }, 'gray', { stroke: true }),
    s('circle', { cx: 30, cy: 130, r: 6 }, 'blue')
  ],
  basura: [
    s('path', { d: 'M38 56h84l-8 84H46z' }, 'gray', { accent: true }),
    s('rect', { x: 30, y: 42, width: 100, height: 14, rx: 5 }, 'dark'),
    s('rect', { x: 66, y: 32, width: 28, height: 10, rx: 4 }, 'dark'),
    ln('M64 70l4 56M80 70v56M96 70l-4 56', 'dark', 4),
    s('path', { d: 'M118 24l10 6-6 10-10-6z' }, 'yellow'),
    s('circle', { cx: 40, cy: 28, r: 7 }, 'brown')
  ],
  almohada: [
    s('path', { d: 'M20 46q60-14 120 0 8 34 0 68-60 14-120 0-8-34 0-68z' }, 'cream', { accent: true }),
    s('path', { d: 'M20 46q60-14 120 0 8 34 0 68-60 14-120 0-8-34 0-68z', fill: 'none', 'stroke-width': 3 }, 'tan', { stroke: true }),
    ln('M42 66q38-8 76 0', 'tan', 3),
    s('circle', { cx: 22, cy: 48, r: 4 }, 'tan'), s('circle', { cx: 138, cy: 48, r: 4 }, 'tan'),
    s('circle', { cx: 22, cy: 112, r: 4 }, 'tan'), s('circle', { cx: 138, cy: 112, r: 4 }, 'tan')
  ],
  manta: [
    s('rect', { x: 20, y: 34, width: 120, height: 92, rx: 8 }, 'orange', { accent: true }),
    s('path', { d: 'M20 62h120M20 98h120', fill: 'none', 'stroke-width': 10 }, 'red', { stroke: true }),
    ln('M52 34v92M108 34v92', 'yellow', 4),
    ln('M30 126v14M46 126v14M62 126v14M78 126v14M94 126v14M110 126v14M126 126v14', 'orange', 3)
  ],
  caja: [
    s('path', { d: 'M24 60l56-20 56 20v66l-56 20-56-20z', 'stroke-linejoin': 'round' }, 'tan', { accent: true }),
    s('path', { d: 'M24 60l56 22 56-22v-0z' }, 'brown'),
    ln('M24 60l56 22 56-22M80 82v64', 'brown', 4),
    s('rect', { x: 62, y: 62, width: 36, height: 14, rx: 2, transform: 'rotate(0)' }, 'cream', { flatOnly: true })
  ],
  bolsa: [
    ln('M58 54q0-30 22-30t22 30', 'dark', 5),
    s('path', { d: 'M40 50h80l10 90H30z', 'stroke-linejoin': 'round' }, 'green', { accent: true }),
    s('rect', { x: 40, y: 50, width: 80, height: 12 }, 'mint'),
    s('circle', { cx: 80, cy: 98, r: 14 }, 'yellow')
  ],
  papel: [
    s('path', { d: 'M38 16h64l24 24v104H38z', 'stroke-linejoin': 'round' }, 'white'),
    s('path', { d: 'M38 16h64l24 24v104H38z', fill: 'none', 'stroke-width': 3, 'stroke-linejoin': 'round' }, 'gray', { stroke: true }),
    s('path', { d: 'M102 16v24h24z' }, 'sky', { accent: true }),
    ln('M52 62h60M52 80h60M52 98h60M52 116h36', 'gray', 4)
  ],
  dirección: [
    s('path', { d: 'M80 12a40 40 0 0 0-40 40c0 30 40 70 40 70s40-40 40-70a40 40 0 0 0-40-40z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 52, r: 16 }, 'white'),
    s('ellipse', { cx: 80, cy: 140, rx: 30, ry: 8 }, 'gray')
  ],
  balcón: [
    s('rect', { x: 14, y: 14, width: 132, height: 68, rx: 4 }, 'cream'),
    s('rect', { x: 52, y: 20, width: 56, height: 62, rx: 3 }, 'sky'),
    ln('M80 20v62', 'brown', 3),
    s('rect', { x: 10, y: 82, width: 140, height: 10, rx: 3 }, 'gray', { accent: true }),
    ln('M24 92v40M44 92v40M64 92v40M84 92v40M104 92v40M124 92v40', 'dark', 4),
    s('rect', { x: 10, y: 130, width: 140, height: 10, rx: 3 }, 'gray')
  ],
  piscina: [
    s('rect', { x: 14, y: 70, width: 132, height: 64, rx: 8 }, 'sky'),
    s('rect', { x: 14, y: 70, width: 132, height: 64, rx: 8, fill: 'none', 'stroke-width': 6 }, 'gray', { stroke: true }),
    ln('M26 94q10-8 20 0t20 0t20 0t20 0', 'blue', 4),
    ln('M26 114q10-8 20 0t20 0t20 0t20 0', 'blue', 4),
    ln('M112 70V36q0-14 14-14', 'gray', 5),
    ln('M126 70V36', 'gray', 5),
    s('circle', { cx: 80, cy: 72, r: 9 }, 'skin'),
    s('path', { d: 'M96 52h16v-10z' }, 'red', { accent: true, flatOnly: true })
  ],
  pasillo: [
    s('path', { d: 'M10 10h140l-34 50H44z' }, 'cream'),
    s('path', { d: 'M44 60h72v50H44z' }, 'tan'),
    s('path', { d: 'M10 150h140l-34-40H44z' }, 'brown', { accent: true }),
    s('path', { d: 'M10 10l34 50v50l-34 40zM150 10l-34 50v50l34 40z' }, 'gray'),
    s('rect', { x: 66, y: 72, width: 28, height: 38, rx: 2 }, 'blue')
  ],
  cajón: [
    s('rect', { x: 18, y: 28, width: 124, height: 104, rx: 6 }, 'brown', { accent: true }),
    s('rect', { x: 26, y: 36, width: 108, height: 40, rx: 3 }, 'tan'),
    s('rect', { x: 26, y: 82, width: 108, height: 42, rx: 3 }, 'tan'),
    s('rect', { x: 64, y: 52, width: 32, height: 8, rx: 4 }, 'dark'),
    s('path', { d: 'M40 108l16-12 16 12z' }, 'cream')
  ]
};
