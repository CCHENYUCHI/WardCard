// Illustration specs for theme "city" (see server/scripts/lexicon/art.js)
const { s } = require("../../../scripts/lexicon/art");

const R = (x, y, w, h, c, o = {}, rx = 2) => s('rect', { x, y, width: w, height: h, rx }, c, o);
const C = (cx, cy, r, c, o = {}) => s('circle', { cx, cy, r }, c, o);
const P = (d, c, o = {}) => s('path', { d }, c, o);
const L = (d, c, w = 4, o = {}) => s('path', { d, fill: 'none', 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, c, { stroke: true, ...o });
const wins = (x, y, cols, rows, dx, dy, w = 10, h = 12, c = 'sky') => {
  const out = [];
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) out.push(R(x + i * dx, y + j * dy, w, h, c));
  return out;
};
const car = (c, roofExtra = []) => [
  R(18, 86, 124, 34, c, { accent: true }, 10),
  P('M44 88l14-28h44l20 28z', c),
  P('M54 86l10-22h16v22z', 'sky'),
  P('M86 86V64h14l14 22z', 'sky'),
  C(46, 122, 14, 'dark'), C(114, 122, 14, 'dark'), C(46, 122, 6, 'gray'), C(114, 122, 6, 'gray'),
  ...roofExtra
];
const compass = (deg) => [
  C(80, 80, 56, 'cream'),
  s('circle', { cx: 80, cy: 80, r: 56, fill: 'none', 'stroke-width': 5 }, 'dark', { stroke: true }),
  s('path', { d: 'M80 28l14 52H66z', transform: `rotate(${deg} 80 80)` }, 'red', { accent: true }),
  s('path', { d: 'M80 132l14-52H66z', transform: `rotate(${deg} 80 80)` }, 'gray'),
  C(80, 80, 6, 'dark')
];
const arrow = (rot) => [
  s('path', { d: 'M24 66h62V40l50 40-50 40V94H24z', transform: `rotate(${rot} 80 80)`, 'stroke-linejoin': 'round' }, 'blue', { accent: true })
];
const tower = (x, y, w, h, c, o = {}) => [
  R(x, y, w, h, c, o, 1),
  ...[0, 1, 2].map(i => R(x + i * (w / 3) + 1, y - 8, w / 3 - 2, 8, c, {}, 1))
];

module.exports = {
  ciudad: [
    R(14, 70, 34, 66, 'blue', { accent: true }),
    R(52, 40, 40, 96, 'sky'),
    R(96, 60, 30, 76, 'mint'),
    R(122, 86, 26, 50, 'gray'),
    ...wins(20, 78, 2, 4, 14, 14, 8, 8, 'white'),
    ...wins(60, 50, 2, 6, 18, 14, 10, 8, 'white'),
    ...wins(102, 68, 2, 4, 12, 16, 8, 8, 'white'),
    R(10, 134, 140, 6, 'dark')
  ],
  pueblo: [
    P('M20 120V88l30-26 30 26v32z', 'cream'),
    P('M12 90 50 56l38 34z', 'red', { accent: true }),
    R(42, 96, 16, 24, 'brown'),
    R(100, 70, 12, 50, 'brown'),
    C(106, 60, 24, 'green'),
    C(124, 74, 16, 'green'),
    R(8, 120, 144, 10, 'mint')
  ],
  calle: [
    P('M60 36h40l50 100H10z', 'gray', { accent: true }),
    L('M80 40v10M80 66v16M80 100v22', 'white', 5),
    R(10, 30, 36, 70, 'tan'), R(114, 22, 36, 78, 'cream'),
    R(18, 40, 10, 12, 'sky'), R(18, 62, 10, 12, 'sky'), R(124, 34, 10, 12, 'sky'), R(124, 56, 10, 12, 'sky')
  ],
  plaza: [
    s('ellipse', { cx: 80, cy: 118, rx: 66, ry: 22 }, 'tan'),
    s('ellipse', { cx: 80, cy: 112, rx: 38, ry: 12 }, 'sky', { accent: true }),
    R(74, 60, 12, 50, 'gray'),
    s('ellipse', { cx: 80, cy: 60, rx: 22, ry: 7 }, 'gray'),
    P('M80 22c-12 14-16 22-16 28a16 16 0 0 0 32 0c0-6-4-14-16-28z', 'blue'),
    C(34, 100, 8, 'green'), C(130, 100, 8, 'green')
  ],
  barrio: [
    R(8, 70, 44, 66, 'pink', {}), P('M4 74 30 48l26 26z', 'brown'),
    R(58, 56, 44, 80, 'yellow', { accent: true }), P('M54 60 80 32l26 28z', 'red'),
    R(108, 76, 44, 60, 'mint'), P('M104 80l26-26 26 26z', 'navy'),
    R(20, 104, 12, 32, 'brown'), R(74, 104, 12, 32, 'brown'), R(120, 108, 12, 28, 'brown'),
    R(18, 82, 14, 12, 'sky'), R(70, 70, 14, 12, 'sky'), R(120, 88, 14, 12, 'sky')
  ],
  centro: [
    C(80, 80, 58, 'sky'),
    C(80, 80, 40, 'white'),
    C(80, 80, 24, 'blue'),
    C(80, 80, 9, 'red', { accent: true }),
    L('M80 12v16M80 132v16M12 80h16M132 80h16', 'dark', 4)
  ],
  parque: [
    R(12, 118, 136, 14, 'green', {}, 4),
    R(34, 80, 12, 42, 'brown'),
    C(40, 62, 30, 'green', { accent: true }),
    C(60, 72, 18, 'green'),
    R(90, 98, 52, 8, 'brown'),
    L('M94 106v16M138 106v16M94 90v8M138 90v8', 'dark', 4),
    L('M92 90h48', 'brown', 6),
    C(120, 40, 12, 'yellow')
  ],
  edificio: [
    R(40, 18, 80, 118, 'sky', { accent: true }, 3),
    ...wins(50, 28, 4, 6, 18, 17, 10, 11, 'white'),
    R(70, 118, 20, 18, 'dark'),
    R(30, 134, 100, 6, 'dark')
  ],
  tienda: [
    R(24, 66, 112, 66, 'cream', {}, 3),
    P('M16 40h128l8 28H8z', 'red', { accent: true }),
    P('M36 40l-4 28h16l4-28zM68 40v28h24V40zM108 40l4 28h16l-4-28z', 'white'),
    R(36, 84, 52, 36, 'sky'),
    R(100, 84, 24, 48, 'brown')
  ],
  mercado: [
    P('M20 40h120l8 26H12z', 'orange', { accent: true }),
    P('M36 40l-6 26h18l4-26zM76 40v26h24V40zM116 40l4 26h16l-6-26z', 'white'),
    L('M26 66v66M134 66v66', 'brown', 6),
    R(30, 100, 100, 32, 'tan', {}, 4),
    C(52, 96, 12, 'red'), C(78, 94, 12, 'green'), C(104, 96, 12, 'orange'), C(65, 86, 10, 'yellow'), C(92, 85, 10, 'red')
  ],
  supermercado: [
    L('M12 36h22l16 66h66l14-48H42', 'dark', 7),
    P('M44 58h88l-12 40H54z', 'green', { accent: true }),
    C(62, 124, 10, 'dark'), C(110, 124, 10, 'dark'),
    C(70, 46, 8, 'red'), C(96, 44, 9, 'yellow')
  ],
  banco: [
    P('M16 56 80 22l64 34z', 'tan', { accent: true }),
    R(22, 60, 116, 8, 'cream'),
    R(30, 70, 14, 50, 'cream'), R(62, 70, 14, 50, 'cream'), R(94, 70, 14, 50, 'cream'), R(122, 70, 12, 50, 'cream'),
    R(14, 120, 132, 14, 'gray'),
    C(80, 42, 8, 'yellow')
  ],
  farmacia: [
    R(18, 18, 124, 124, 'white', {}, 14),
    s('rect', { x: 18, y: 18, width: 124, height: 124, rx: 14, fill: 'none', 'stroke-width': 5 }, 'gray', { stroke: true }),
    P('M64 34h32v30h30v32H96v30H64V96H34V64h30z', 'green', { accent: true })
  ],
  hospital: [
    R(24, 40, 112, 96, 'cream', {}, 4),
    R(14, 128, 132, 8, 'gray'),
    P('M70 50h20v18h18v20H90v18H70V88H52V68h18z', 'red', { accent: true }),
    R(66, 108, 28, 28, 'sky'),
    R(34, 52, 14, 14, 'sky'), R(112, 52, 14, 14, 'sky'), R(34, 90, 14, 14, 'sky'), R(112, 90, 14, 14, 'sky')
  ],
  iglesia: [
    R(46, 66, 68, 70, 'cream'),
    P('M40 66 80 34l40 32z', 'brown', { accent: true }),
    L('M80 34V10M70 18h20', 'dark', 5),
    P('M64 136v-28a16 16 0 0 1 32 0v28z', 'brown'),
    C(80, 82, 8, 'sky'),
    R(14, 100, 30, 36, 'tan'), R(116, 100, 30, 36, 'tan')
  ],
  museo: [
    P('M14 54 80 18l66 36z', 'tan', { accent: true }),
    R(20, 58, 120, 8, 'cream'),
    R(28, 68, 14, 52, 'cream'), R(54, 68, 14, 52, 'cream'), R(92, 68, 14, 52, 'cream'), R(118, 68, 14, 52, 'cream'),
    R(12, 120, 136, 8, 'gray'), R(6, 128, 148, 8, 'gray'),
    P('M74 120v-14c-6-6-4-14 6-14s12 8 6 14v14z', 'orange')
  ],
  biblioteca: [
    R(20, 20, 120, 116, 'brown', {}, 4),
    R(28, 28, 104, 46, 'cream'), R(28, 82, 104, 46, 'cream'),
    R(34, 36, 12, 38, 'red', { accent: true }), R(48, 40, 10, 34, 'blue'), R(60, 34, 14, 40, 'green'), R(76, 42, 10, 32, 'yellow'), R(88, 36, 12, 38, 'purple'), R(102, 40, 14, 34, 'orange'),
    R(34, 94, 14, 34, 'blue'), R(50, 90, 10, 38, 'red'), R(62, 98, 12, 30, 'green'), R(76, 92, 14, 36, 'orange'), R(92, 98, 12, 30, 'purple')
  ],
  cine: [
    R(16, 22, 128, 78, 'dark', {}, 6),
    R(24, 30, 112, 62, 'sky'),
    P('M70 46l28 15-28 15z', 'red', { accent: true }),
    R(26, 108, 28, 26, 'red', {}, 6), R(66, 108, 28, 26, 'red', {}, 6), R(106, 108, 28, 26, 'red', {}, 6)
  ],
  teatro: [
    R(16, 126, 128, 12, 'brown'),
    R(24, 20, 112, 106, 'dark', {}, 4),
    P('M24 20h50c-6 30-14 70-22 106H24z', 'red', { accent: true }),
    P('M136 20H86c6 30 14 70 22 106h28z', 'red'),
    P('M52 20h56v14H52z', 'yellow'),
    C(80, 90, 14, 'yellow'),
    L('M74 86h0M86 86h0', 'dark', 5), L('M72 96q8 8 16 0', 'dark', 3)
  ],
  restaurante: [
    s('ellipse', { cx: 80, cy: 112, rx: 62, ry: 10 }, 'gray'),
    P('M26 108a54 54 0 0 1 108 0z', 'gray', { accent: true }),
    s('path', { d: 'M40 100a40 40 0 0 1 20-34', fill: 'none', 'stroke-width': 5, 'stroke-linecap': 'round' }, 'white', { stroke: true }),
    C(80, 48, 7, 'dark'),
    R(16, 118, 128, 6, 'brown')
  ],
  bar: [
    P('M44 38h62l-6 84a8 8 0 0 1-8 8H58a8 8 0 0 1-8-8z', 'yellow', { accent: true }),
    P('M40 40c0-16 20-22 28-10 8-10 30-10 38 2 4 8-2 10-4 10z', 'white'),
    s('path', { d: 'M106 56h14a10 10 0 0 1 10 10v30a10 10 0 0 1-10 10h-16', fill: 'none', 'stroke-width': 8 }, 'gray', { stroke: true }),
    L('M62 62v50M80 62v50M92 62v50', 'orange', 3, { flatOnly: true })
  ],
  cafetería: [
    s('path', { d: 'M52 38c-8 8 8 12 0 22M72 34c-8 8 8 12 0 24M92 38c-8 8 8 12 0 22', fill: 'none', 'stroke-width': 4, 'stroke-linecap': 'round' }, 'gray', { stroke: true }),
    P('M32 70h84v26a30 30 0 0 1-30 30H62a30 30 0 0 1-30-30z', 'sky', { accent: true }),
    s('path', { d: 'M116 78h10a12 12 0 0 1 0 24h-14', fill: 'none', 'stroke-width': 7 }, 'sky', { stroke: true }),
    s('ellipse', { cx: 74, cy: 70, rx: 42, ry: 6 }, 'brown'),
    s('ellipse', { cx: 74, cy: 134, rx: 58, ry: 8 }, 'tan')
  ],
  hotel: [
    R(34, 40, 92, 96, 'tan', { accent: true }, 3),
    ...wins(46, 54, 4, 3, 20, 20, 12, 12, 'yellow'),
    R(68, 108, 24, 28, 'brown'),
    P('M80 8l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z', 'yellow'),
    R(24, 134, 112, 6, 'dark')
  ],
  estación: [
    R(22, 54, 116, 62, 'cream', {}, 3),
    P('M14 56 80 24l66 32z', 'red', { accent: true }),
    C(80, 76, 16, 'white'),
    L('M80 66v10l8 6', 'dark', 4),
    R(34, 92, 20, 24, 'sky'), R(106, 92, 20, 24, 'sky'), R(70, 96, 20, 20, 'brown'),
    R(8, 116, 144, 6, 'gray'),
    L('M8 132h144', 'dark', 4)
  ],
  aeropuerto: [
    R(68, 56, 22, 70, 'gray'),
    P('M56 56h46l-8-22H64z', 'sky', { accent: true }),
    R(60, 26, 38, 10, 'dark'),
    R(8, 126, 144, 14, 'dark', {}, 3),
    L('M20 133h16M60 133h16M100 133h16', 'white', 3),
    P('M110 30l26-4-12 10 22 8-28 2z', 'blue')
  ],
  playa: [
    C(124, 34, 16, 'yellow'),
    R(0, 76, 160, 30, 'sky', {}, 0),
    P('M0 100q20-10 40 0t40 0 40 0 40 0v14H0z', 'blue'),
    P('M0 112q40-14 80 0t80 0v48H0z', 'tan', { accent: true }),
    L('M52 130 64 70', 'brown', 5),
    P('M34 76a30 20 0 0 1 60-8z', 'red')
  ],
  oficina: [
    R(34, 24, 92, 62, 'dark', {}, 6),
    R(42, 32, 76, 46, 'sky'),
    R(72, 86, 16, 16, 'gray'),
    R(58, 100, 44, 6, 'gray'),
    R(14, 112, 132, 10, 'brown', { accent: true }),
    R(22, 122, 8, 18, 'brown'), R(130, 122, 8, 18, 'brown'),
    L('M52 46h40M52 58h28', 'blue', 4)
  ],
  universidad: [
    P('M80 30 18 62l62 30 62-30z', 'dark', { accent: true }),
    P('M44 78v28c0 10 72 10 72 0V78l-36 18z', 'navy'),
    L('M136 66v38', 'yellow', 4),
    C(136, 108, 6, 'yellow')
  ],
  policía: [
    P('M32 140v-34a48 30 0 0 1 96 0v34z', 'navy', { accent: true }),
    C(80, 66, 26, 'skin'),
    P('M48 52q32-30 64 0z', 'navy'),
    R(44, 48, 72, 10, 'dark', {}, 4),
    C(80, 40, 6, 'yellow'),
    P('M96 100l12 0-6 14z', 'yellow'),
    L('M72 78q8 6 16 0', 'dark', 3)
  ],
  semáforo: [
    R(52, 14, 56, 100, 'dark', { accent: true }, 12),
    C(80, 38, 12, 'red'), C(80, 64, 12, 'yellow'), C(80, 90, 12, 'green'),
    R(75, 114, 10, 26, 'dark'),
    R(60, 138, 40, 8, 'gray')
  ],
  esquina: [
    R(10, 10, 56, 56, 'cream', {}, 4),
    R(94, 10, 56, 56, 'cream', {}, 4),
    R(10, 94, 56, 56, 'cream', {}, 4),
    R(66, 10, 28, 140, 'gray'),
    R(10, 66, 140, 28, 'gray'),
    R(94, 94, 56, 56, 'red', { accent: true }, 4),
    L('M80 14v44M80 102v44M14 80h44M102 80h44', 'white', 3, { flatOnly: true })
  ],
  puente: [
    R(0, 100, 160, 60, 'blue', {}, 0),
    P('M8 66h144v24H8z', 'tan', { accent: true }),
    P('M8 90h30a42 42 0 0 1 84 0h30v40H8z', 'tan'),
    P('M38 130a42 42 0 0 1 84 0z', 'blue'),
    L('M8 62h144', 'brown', 4)
  ],
  coche: car('red'),
  autobús: [
    R(10, 34, 140, 84, 'yellow', { accent: true }, 12),
    R(20, 44, 28, 32, 'sky'), R(54, 44, 28, 32, 'sky'), R(88, 44, 28, 32, 'sky'), R(122, 44, 20, 40, 'sky'),
    R(10, 90, 140, 6, 'orange'),
    C(40, 120, 14, 'dark'), C(120, 120, 14, 'dark'), C(40, 120, 6, 'gray'), C(120, 120, 6, 'gray')
  ],
  metro: [
    P('M20 150V70a60 54 0 0 1 120 0v80z', 'dark'),
    R(44, 62, 72, 70, 'blue', { accent: true }, 10),
    R(52, 70, 56, 28, 'sky'),
    C(60, 116, 6, 'yellow'), C(100, 116, 6, 'yellow'),
    L('M30 150l10-24M130 150l-10-24', 'gray', 5)
  ],
  tren: [
    R(8, 54, 70, 54, 'blue', { accent: true }, 8),
    R(18, 62, 22, 22, 'sky'),
    R(82, 70, 70, 38, 'red', {}, 6),
    R(90, 78, 16, 14, 'sky'), R(114, 78, 16, 14, 'sky'),
    R(14, 36, 14, 18, 'dark'),
    C(26, 116, 10, 'dark'), C(58, 116, 10, 'dark'), C(98, 116, 10, 'dark'), C(134, 116, 10, 'dark'),
    L('M4 128h152', 'gray', 4)
  ],
  avión: [
    P('M10 84q0-12 14-12h86q30 0 40 12-10 12-40 12H24q-14 0-14-12z', 'white'),
    P('M70 74 46 34h20l40 40z', 'blue', { accent: true }),
    P('M70 94 46 134h20l40-40z', 'blue'),
    P('M18 74 8 52h14l18 22z', 'blue'),
    R(100, 76, 12, 8, 'sky'), R(120, 76, 12, 8, 'sky'),
    L('M20 84h120', 'gray', 3)
  ],
  barco: [
    P('M16 88h128l-20 34H38z', 'red', { accent: true }),
    R(56, 54, 46, 34, 'white'),
    R(64, 62, 10, 10, 'sky'), R(84, 62, 10, 10, 'sky'),
    R(70, 36, 18, 18, 'orange'),
    L('M80 36V22', 'dark', 4),
    P('M0 128q20-12 40 0t40 0 40 0 40 0v32H0z', 'blue')
  ],
  bicicleta: [
    s('circle', { cx: 38, cy: 104, r: 28, fill: 'none', 'stroke-width': 6 }, 'dark', { stroke: true }),
    s('circle', { cx: 122, cy: 104, r: 28, fill: 'none', 'stroke-width': 6 }, 'dark', { stroke: true }),
    L('M38 104 64 60h42l16 44M64 60l22 44h-48M86 104 106 60', 'blue', 6, { accent: true }),
    L('M58 52h18M104 48l6-14h14', 'dark', 6),
    C(86, 104, 6, 'gray')
  ],
  moto: [
    s('circle', { cx: 34, cy: 112, r: 22, fill: 'none', 'stroke-width': 7 }, 'dark', { stroke: true }),
    s('circle', { cx: 126, cy: 112, r: 22, fill: 'none', 'stroke-width': 7 }, 'dark', { stroke: true }),
    P('M44 72h42l22 24-48 6z', 'red', { accent: true }),
    R(36, 66, 40, 10, 'dark', {}, 5),
    P('M86 98h26l14 14H80z', 'gray'),
    L('M108 96l-6-44h22M100 52h-14', 'dark', 6),
    C(138, 66, 6, 'yellow')
  ],
  taxi: car('yellow', [R(66, 44, 28, 14, 'dark', {}, 3), R(70, 48, 20, 6, 'white')]),
  billete: [
    P('M12 44h136v26a10 10 0 0 0 0 20v26H12V90a10 10 0 0 0 0-20z', 'orange', { accent: true }),
    L('M108 50v8M108 68v8M108 86v8M108 104v8', 'white', 4),
    L('M26 62h58M26 80h40M26 98h50', 'white', 5),
    C(126, 56, 6, 'yellow')
  ],
  viaje: [
    P('M0 130h160v30H0z', 'mint'),
    L('M20 128c30-20 70 6 80-30 6-22-20-28-6-46', 'brown', 6, { 'stroke-dasharray': '2 12' }),
    P('M120 24a22 22 0 0 1 22 22c0 18-22 44-22 44S98 64 98 46a22 22 0 0 1 22-22z', 'red', { accent: true }),
    C(120, 46, 8, 'white'),
    C(24, 128, 8, 'blue')
  ],
  maleta: [
    s('path', { d: 'M58 50v-12a8 8 0 0 1 8-8h28a8 8 0 0 1 8 8v12', fill: 'none', 'stroke-width': 7 }, 'dark', { stroke: true }),
    R(18, 50, 124, 80, 'orange', { accent: true }, 12),
    R(40, 50, 10, 80, 'brown'), R(110, 50, 10, 80, 'brown'),
    R(70, 84, 20, 14, 'yellow', {}, 3),
    C(40, 138, 5, 'dark'), C(120, 138, 5, 'dark')
  ],
  mapa: [
    P('M16 40l44-12 40 12 44-12v92l-44 12-40-12-44 12z', 'cream'),
    P('M60 28v92l-44 12V40z', 'mint'),
    P('M100 40v92l44-12V28z', 'sky'),
    L('M28 100c20-10 20-30 40-30s30 20 50 4', 'red', 4, { 'stroke-dasharray': '2 8' }),
    L('M118 80l16 16M134 80l-16 16', 'red', 5, { accent: true }),
    L('M60 28v92M100 40v92', 'gray', 2)
  ],
  camino: [
    P('M0 70q60-20 160 0v90H0z', 'green'),
    P('M70 76q20-6 40 0 20 20-6 40-20 14 40 24H10q50-10 50-30t30-34z', 'tan', { accent: true }),
    P('M0 70q30-24 60-6v10z', 'mint'),
    C(130, 40, 14, 'yellow'),
    R(124, 90, 5, 22, 'brown'), R(110, 90, 24, 12, 'brown', {}, 2)
  ],
  carretera: [
    R(0, 0, 160, 76, 'sky', {}, 0),
    P('M0 76l30-28 28 28zM50 76l40-34 40 34z', 'green'),
    P('M70 76h20l60 84H10z', 'gray', { accent: true }),
    L('M80 82v6M80 100v12M80 124v22', 'white', 5),
    C(130, 24, 12, 'yellow')
  ],
  derecha: arrow(0),
  izquierda: arrow(180),
  recto: arrow(-90),
  norte: compass(0),
  sur: compass(180),
  oeste: compass(-90),
  kilómetro: [
    R(0, 120, 160, 40, 'gray', {}, 0),
    P('M42 120V44a38 38 0 0 1 76 0v76z', 'cream'),
    P('M42 52a38 38 0 0 1 76 0z', 'red', { accent: true }),
    L('M62 76h36M62 90h36M62 104h36', 'dark', 4),
    L('M10 146h140', 'white', 4)
  ],
  precio: [
    P('M24 80 78 26h56v56l-54 54z', 'yellow', { accent: true }),
    C(108, 52, 9, 'white'),
    L('M108 52C130 20 140 14 148 10', 'dark', 3),
    L('M54 96l32-32', 'orange', 6),
    C(104, 108, 0.1, 'dark', { flatOnly: true })
  ],
  dinero: [
    R(18, 44, 112, 62, 'green', { accent: true }, 6),
    C(74, 75, 18, 'mint'),
    C(32, 58, 5, 'mint'), C(116, 92, 5, 'mint'),
    s('ellipse', { cx: 118, cy: 124, rx: 30, ry: 10 }, 'orange'),
    R(88, 110, 60, 14, 'yellow', {}, 0),
    s('ellipse', { cx: 118, cy: 110, rx: 30, ry: 10 }, 'yellow')
  ],
  euro: [
    C(80, 80, 62, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 50, fill: 'none', 'stroke-width': 4 }, 'orange', { stroke: true }),
    L('M104 56a32 32 0 1 0 0 48', 'dark', 9),
    L('M46 72h42M46 90h42', 'dark', 7)
  ],
  tarjeta: [
    R(12, 36, 136, 88, 'blue', { accent: true }, 12),
    R(12, 54, 136, 18, 'dark', {}, 0),
    R(24, 88, 28, 22, 'yellow', {}, 4),
    L('M84 98h48M84 112h30', 'white', 5)
  ],
  compra: [
    P('M34 54h92l8 82H26z', 'green', { accent: true }),
    s('path', { d: 'M56 62v-14a24 24 0 0 1 48 0v14', fill: 'none', 'stroke-width': 6 }, 'dark', { stroke: true }),
    P('M84 22c4-12 18-14 26-8-4 12-18 14-26 8z', 'green'),
    C(80, 96, 14, 'white'),
    P('M72 96h16l-8 12z', 'green')
  ],
  parada: [
    R(74, 30, 10, 108, 'dark'),
    R(22, 18, 70, 40, 'yellow', { accent: true }, 8),
    R(32, 28, 16, 12, 'dark'), R(52, 28, 16, 12, 'dark'),
    R(40, 44, 40, 6, 'dark'),
    R(94, 90, 56, 8, 'brown'),
    L('M98 98v22M146 98v22', 'dark', 4)
  ],
  cajero: [
    R(30, 14, 100, 126, 'gray', { accent: true }, 10),
    R(42, 26, 76, 46, 'sky'),
    R(42, 82, 40, 14, 'dark'), R(94, 82, 24, 14, 'dark'),
    R(48, 108, 64, 8, 'dark', {}, 3),
    R(58, 104, 44, 6, 'green', {}, 1),
    L('M50 38h40M50 52h26', 'blue', 4)
  ],
  correos: [
    R(14, 36, 132, 88, 'yellow', { accent: true }, 6),
    P('M14 42l66 48 66-48', 'orange', { flatOnly: true }),
    L('M14 40l66 52 66-52', 'dark', 4),
    L('M14 122l48-42M146 122 98 80', 'dark', 3),
    R(112, 48, 22, 26, 'red', {}, 3)
  ],
  gasolinera: [
    R(28, 22, 70, 108, 'red', { accent: true }, 8),
    R(38, 34, 50, 30, 'sky'),
    R(16, 128, 94, 12, 'dark'),
    s('path', { d: 'M98 50h14a14 14 0 0 1 14 14v46a8 8 0 0 0 16 0V76l-10-12', fill: 'none', 'stroke-width': 6 }, 'dark', { stroke: true }),
    C(48, 84, 7, 'yellow'), C(66, 84, 7, 'white')
  ],
  aparcamiento: [
    R(8, 20, 144, 120, 'gray', {}, 6),
    L('M52 26v108M108 26v108', 'white', 5),
    R(62, 42, 36, 76, 'red', { accent: true }, 12),
    R(68, 52, 24, 14, 'sky', {}, 3), R(68, 94, 24, 12, 'sky', {}, 3),
    R(66, 40, 8, 6, 'yellow'), R(86, 40, 8, 6, 'yellow')
  ],
  zoo: [
    C(80, 80, 62, 'orange', { accent: true }),
    C(80, 84, 40, 'tan'),
    C(34, 30, 12, 'orange'), C(126, 30, 12, 'orange'),
    C(64, 76, 6, 'dark'), C(96, 76, 6, 'dark'),
    P('M72 90h16l-8 10z', 'dark'),
    L('M80 100q-12 14-22 6M80 100q12 14 22 6', 'dark', 3),
    L('M52 92h-18M52 100l-16 6M108 92h18M108 100l16 6', 'dark', 2)
  ],
  castillo: [
    R(52, 54, 56, 80, 'tan', { accent: true }, 2),
    ...tower(14, 70, 38, 64, 'tan'),
    ...tower(108, 70, 38, 64, 'tan'),
    ...tower(52, 46, 56, 8, 'tan'),
    P('M68 134v-22a12 12 0 0 1 24 0v22z', 'brown'),
    L('M80 46V16', 'dark', 3),
    P('M80 16h22l-8 8 8 8H80z', 'red'),
    R(28, 84, 8, 14, 'dark')
  ],
  catedral: [
    R(40, 62, 80, 74, 'cream'),
    R(20, 40, 28, 96, 'tan', { accent: true }), R(112, 40, 28, 96, 'tan'),
    P('M18 42 34 6l16 36z', 'brown'), P('M110 42 126 6l16 36z', 'brown'),
    C(80, 82, 16, 'sky'), C(80, 82, 6, 'red'),
    P('M66 136v-24a14 14 0 0 1 28 0v24z', 'brown'),
    R(26, 64, 10, 16, 'sky'), R(124, 64, 10, 16, 'sky'),
    P('M40 62 80 36l40 26z', 'gray')
  ],
  ayuntamiento: [
    R(26, 70, 108, 60, 'cream', {}, 2),
    P('M18 72 80 52l62 20z', 'tan', { accent: true }),
    R(62, 22, 36, 32, 'tan'),
    C(80, 38, 10, 'white'),
    L('M80 32v6l5 3', 'dark', 3),
    P('M62 22 80 8l18 14z', 'red'),
    ...[0, 1, 2, 3].map(i => R(34 + i * 26, 78, 10, 40, 'white')),
    R(12, 130, 136, 10, 'gray')
  ],
  tráfico: [
    R(6, 70, 44, 24, 'red', { accent: true }, 8), R(14, 58, 26, 14, 'red', {}, 5),
    R(58, 70, 44, 24, 'blue', {}, 8), R(66, 58, 26, 14, 'blue', {}, 5),
    R(110, 70, 44, 24, 'yellow', {}, 8), R(118, 58, 26, 14, 'yellow', {}, 5),
    C(20, 96, 7, 'dark'), C(40, 96, 7, 'dark'), C(72, 96, 7, 'dark'), C(92, 96, 7, 'dark'), C(124, 96, 7, 'dark'), C(144, 96, 7, 'dark'),
    L('M4 112h152', 'gray', 6),
    C(28, 36, 10, 'gray'), C(46, 28, 8, 'gray')
  ],
  ruido: [
    P('M20 60h26l34-28v96L46 100H20z', 'blue', { accent: true }),
    L('M96 56q14 24 0 48M112 42q26 38 0 76M128 30q38 50 0 100', 'dark', 6),
    L('M28 24l10 14M12 40l12 6', 'red', 4)
  ],
  peluquería: [
    s('circle', { cx: 52, cy: 116, r: 16, fill: 'none', 'stroke-width': 8 }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 108, cy: 116, r: 16, fill: 'none', 'stroke-width': 8 }, 'red', { stroke: true }),
    P('M60 104 112 18l10 6-44 90z', 'gray'),
    P('M100 104 48 18l-10 6 44 90z', 'dark'),
    C(80, 82, 5, 'yellow')
  ],
  panadería: [
    P('M20 120 108 32c10-10 24 0 16 12L38 130c-10 8-26 0-18-10z', 'tan', { accent: true }),
    L('M46 98l14 14M64 80l14 14M82 62l14 14', 'brown', 4),
    s('ellipse', { cx: 112, cy: 112, rx: 34, ry: 24 }, 'orange'),
    L('M92 100l10 18M110 98l10 20M128 100l8 14', 'brown', 4),
    L('M30 26c8-8 4-14 12-20M50 34c8-8 4-14 12-20', 'gray', 3)
  ]
};
