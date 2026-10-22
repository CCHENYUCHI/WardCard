// Illustration specs for the numbers_time theme (see server/scripts/lexicon/art.js)
const { s } = require("../../../scripts/lexicon/art");

const r1 = (n) => Math.round(n * 10) / 10;
// n dots of radius r as ONE path, starting at (x0,y) with spacing d
const dots = (n, x0, y, r, d) => {
  let p = '';
  for (let i = 0; i < n; i++) p += `M${r1(x0 + i * d - r)} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`;
  return p;
};
const rays = (cx, cy, r1_, r2, n, a0 = 0) => {
  let p = '';
  for (let i = 0; i < n; i++) {
    const a = a0 + (i * 2 * Math.PI) / n;
    p += `M${r1(cx + r1_ * Math.cos(a))} ${r1(cy + r1_ * Math.sin(a))}L${r1(cx + r2 * Math.cos(a))} ${r1(cy + r2 * Math.sin(a))}`;
  }
  return p;
};
const strokeP = (d, color, w = 5, extra = {}) => s('path', { d, fill: 'none', 'stroke-width': w, 'stroke-linecap': 'round', ...extra }, color, { stroke: true });

// 11-19 (+21): a full row of ten blue dots, then the extra units in orange
const teen = (units, tens = 1) => {
  const rows = tens + 1, y0 = 80 - (rows - 1) * 12, out = [];
  out.push(s('rect', { x: 10, y: y0 - 16, width: 140, height: rows * 24 + 8, rx: 10 }, 'cream'));
  for (let t = 0; t < tens; t++) out.push(s('path', { d: dots(10, 17, y0 + t * 24, 6, 14) }, 'blue', t === 0 ? { accent: true } : {}));
  out.push(s('path', { d: dots(units, 17, y0 + tens * 24, 6, 14) }, 'orange', { accent: true }));
  return out;
};
// tens: k rods of ten
const rods = (k, color) => {
  const w = Math.min(18, Math.floor(120 / k) - 4), gap = Math.min(10, (120 - k * w) / Math.max(1, k - 1));
  const total = k * w + (k - 1) * gap, x0 = 80 - total / 2;
  let body = '', ticks = '';
  for (let i = 0; i < k; i++) {
    const x = r1(x0 + i * (w + gap));
    body += `M${x} 30h${w}v100h${-w}z`;
    for (let j = 1; j < 10; j++) ticks += `M${x} ${30 + j * 10}h${w}`;
  }
  return [s('path', { d: body, 'stroke-linejoin': 'round' }, color, { accent: true }),
    s('path', { d: ticks, fill: 'none', 'stroke-width': 1.5 }, 'white', { stroke: true, lineColor: 'dark' })];
};
// hundreds: k squares of 10x10 grid
const hundreds = (k, color) => {
  const size = k <= 2 ? 56 : 44, per = k <= 2 ? 2 : 3, rowsN = Math.ceil(k / per), gap = 8;
  const out = [];
  let body = '', grid = '';
  for (let i = 0; i < k; i++) {
    const inRow = i < per * (rowsN - 1) ? per : k - per * (rowsN - 1);
    const col = i % per, row = Math.floor(i / per);
    const rowW = inRow * size + (inRow - 1) * gap;
    const x = r1(80 - rowW / 2 + col * (size + gap)), y = r1(80 - (rowsN * size + (rowsN - 1) * gap) / 2 + row * (size + gap));
    body += `M${x} ${y}h${size}v${size}h${-size}z`;
    for (let j = 1; j < 5; j++) { const t = j * size / 5; grid += `M${x} ${r1(y + t)}h${size}M${r1(x + t)} ${y}v${size}`; }
  }
  out.push(s('path', { d: body, 'stroke-linejoin': 'round' }, color, { accent: true }));
  out.push(s('path', { d: grid, fill: 'none', 'stroke-width': 1.5 }, 'white', { stroke: true, lineColor: 'dark' }));
  return out;
};
const weekBoxes = (hi) => {
  const nor = [], hl = [];
  for (let i = 0; i < 7; i++) (hi.includes(i) ? hl : nor).push(`M${16 + i * 19} 66h16v28h-16z`);
  return [s('rect', { x: 10, y: 40, width: 140, height: 70, rx: 8 }, 'cream'),
    s('path', { d: nor.join(''), 'stroke-linejoin': 'round' }, 'blue', hi.length ? {} : { accent: true }),
    ...(hi.length ? [s('path', { d: hl.join(''), 'stroke-linejoin': 'round' }, 'orange', { accent: true })] : [])];
};
const clockHands = (cx, cy, h, m) => `M${cx} ${cy}l${h[0]} ${h[1]}M${cx} ${cy}l${m[0]} ${m[1]}`;

module.exports = {
  once: teen(1), doce: teen(2), trece: teen(3), catorce: teen(4), quince: teen(5),
  dieciséis: teen(6), diecisiete: teen(7), dieciocho: teen(8), diecinueve: teen(9),
  veintiuno: teen(1, 2),
  veinte: rods(2, 'blue'), treinta: rods(3, 'green'), cuarenta: rods(4, 'orange'), cincuenta: rods(5, 'purple'),
  sesenta: rods(6, 'red'), setenta: rods(7, 'blue'), ochenta: rods(8, 'green'), noventa: rods(9, 'orange'),
  cien: [
    s('rect', { x: 14, y: 14, width: 132, height: 132, rx: 8 }, 'cream'),
    ...Array.from({ length: 10 }, (_, i) => s('path', { d: dots(10, 26, 30 + i * 11, 4, 12) }, i % 2 ? 'orange' : 'blue', i === 0 ? { accent: true } : {}))
  ],
  doscientos: hundreds(2, 'blue'),
  quinientos: hundreds(5, 'green'),
  mil: [
    s('path', { d: 'M52 56C40 38 54 28 80 30c26-2 40 8 28 26 22 20 34 44 22 62-10 14-34 18-50 18s-40-4-50-18C18 100 30 76 52 56z' }, 'brown', { accent: true }),
    s('path', { d: 'M56 54h48', fill: 'none', 'stroke-width': 6, 'stroke-linecap': 'round' }, 'tan', { stroke: true }),
    s('circle', { cx: 80, cy: 96, r: 22 }, 'yellow'),
    s('circle', { cx: 80, cy: 96, r: 14, opacity: 0.5 }, 'orange', { flatOnly: true }),
    s('path', { d: 'M74 96h12M80 90v12', fill: 'none', 'stroke-width': 4, 'stroke-linecap': 'round' }, 'brown', { stroke: true })
  ],
  mitad: [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'cream'),
    s('path', { d: 'M80 24a56 56 0 0 1 0 112z' }, 'orange', { accent: true }),
    strokeP('M80 24v112', 'dark', 4),
    s('circle', { cx: 80, cy: 80, r: 56, fill: 'none', 'stroke-width': 4 }, 'dark', { stroke: true })
  ],
  cuarto: [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'cream'),
    s('path', { d: 'M80 80V24a56 56 0 0 1 56 56z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 56, fill: 'none', 'stroke-width': 4 }, 'dark', { stroke: true }),
    strokeP('M80 80V24M80 80h56', 'dark', 4)
  ],
  día: [
    s('rect', { x: 10, y: 112, width: 140, height: 30, rx: 6 }, 'green'),
    strokeP(rays(80, 90, 40, 56, 9, Math.PI), 'orange', 6),
    s('path', { d: 'M40 112a40 40 0 0 1 80 0z' }, 'yellow', { accent: true })
  ],
  semana: weekBoxes([]),
  'fin de semana': weekBoxes([5, 6]),
  año: [
    s('path', { d: 'M80 80V24a56 56 0 0 1 56 56z' }, 'green', { accent: true }),
    s('path', { d: 'M80 80h56a56 56 0 0 1-56 56z' }, 'yellow'),
    s('path', { d: 'M80 80v56a56 56 0 0 1-56-56z' }, 'orange'),
    s('path', { d: 'M80 80H24a56 56 0 0 1 56-56z' }, 'sky'),
    s('circle', { cx: 80, cy: 80, r: 56, fill: 'none', 'stroke-width': 4 }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 9 }, 'white')
  ],
  tiempo: [
    s('path', { d: 'M38 20h84v10H38zM38 130h84v10H38z' }, 'brown'),
    s('path', { d: 'M46 30h68c0 30-24 40-24 50s24 20 24 50H46c0-30 24-40 24-50S46 60 46 30z' }, 'sky', { accent: true }),
    s('path', { d: 'M58 36h44c-4 16-16 24-22 30-6-6-18-14-22-30z' }, 'orange'),
    s('path', { d: 'M80 82v20M70 130c4-14 16-18 20 0z' }, 'orange'),
    strokeP('M80 80v22', 'orange', 3)
  ],
  tarde: [
    s('rect', { x: 10, y: 20, width: 140, height: 92, rx: 12 }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 98, r: 30 }, 'yellow'),
    s('rect', { x: 10, y: 98, width: 140, height: 44, rx: 12 }, 'brown'),
    s('path', { d: 'M28 60h26M104 44h30M116 70h22', fill: 'none', 'stroke-width': 5, 'stroke-linecap': 'round' }, 'cream', { stroke: true })
  ],
  noche: [
    s('circle', { cx: 80, cy: 80, r: 62 }, 'navy', { accent: true }),
    s('path', { d: 'M96 38a42 42 0 1 0 26 66A34 34 0 0 1 96 38z' }, 'yellow'),
    s('path', { d: 'M52 40l3 8 8 3-8 3-3 8-3-8-8-3 8-3zM118 52l2 5 5 2-5 2-2 5-2-5-5-2 5-2z' }, 'white'),
    s('circle', { cx: 100, cy: 118, r: 3 }, 'white'), s('circle', { cx: 40, cy: 96, r: 3 }, 'white')
  ],
  mediodía: [
    s('rect', { x: 10, y: 112, width: 140, height: 30, rx: 6 }, 'green'),
    strokeP(rays(80, 40, 30, 42, 12), 'orange', 5),
    s('circle', { cx: 80, cy: 40, r: 24 }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 92, r: 8 }, 'skin'),
    s('rect', { x: 71, y: 100, width: 18, height: 22, rx: 6 }, 'blue'),
    s('ellipse', { cx: 80, cy: 126, rx: 14, ry: 4, opacity: 0.4 }, 'dark', { flatOnly: true })
  ],
  medianoche: [
    s('rect', { x: 10, y: 14, width: 140, height: 132, rx: 16 }, 'navy'),
    s('path', { d: 'M62 28a30 30 0 1 0 22 52A24 24 0 0 1 62 28z' }, 'yellow'),
    s('circle', { cx: 100, cy: 100, r: 36 }, 'cream', { accent: true }),
    strokeP('M100 100V76M100 100V80', 'dark', 5),
    s('path', { d: 'M110 36l2 5 5 2-5 2-2 5-2-5-5-2 5-2zM132 62l2 4 4 2-4 2-2 4-2-4-4-2 4-2z' }, 'white')
  ],
  madrugada: [
    s('rect', { x: 10, y: 14, width: 140, height: 98, rx: 14 }, 'navy', { accent: true }),
    s('path', { d: 'M40 112a40 40 0 0 1 80 0z' }, 'orange'),
    strokeP(rays(80, 112, 46, 58, 7, Math.PI), 'yellow', 5),
    s('rect', { x: 10, y: 112, width: 140, height: 30, rx: 10 }, 'dark'),
    s('path', { d: 'M30 36l2 5 5 2-5 2-2 5-2-5-5-2 5-2zM124 34l2 5 5 2-5 2-2 5-2-5-5-2 5-2z' }, 'white')
  ],
  calendario: [
    s('rect', { x: 20, y: 24, width: 120, height: 116, rx: 10 }, 'white'),
    s('path', { d: 'M20 34a10 10 0 0 1 10-10h100a10 10 0 0 1 10 10v22H20z' }, 'red', { accent: true }),
    s('rect', { x: 20, y: 24, width: 120, height: 116, rx: 10, fill: 'none', 'stroke-width': 4 }, 'gray', { stroke: true }),
    strokeP('M48 14v20M112 14v20', 'dark', 6),
    s('path', { d: dots(4, 42, 76, 5, 25) + dots(4, 42, 98, 5, 25) + dots(3, 42, 120, 5, 25) }, 'blue'),
    s('circle', { cx: 117, cy: 120, r: 7 }, 'orange')
  ],
  reloj: [
    s('circle', { cx: 80, cy: 80, r: 58 }, 'cream'),
    s('circle', { cx: 80, cy: 80, r: 58, fill: 'none', 'stroke-width': 8 }, 'blue', { stroke: true, accent: true }),
    strokeP(rays(80, 80, 44, 50, 12), 'dark', 3),
    strokeP(clockHands(80, 80, [0, -28], [24, 14]), 'dark', 6),
    s('circle', { cx: 80, cy: 80, r: 5 }, 'red')
  ],
  cumpleaños: [
    s('rect', { x: 28, y: 92, width: 104, height: 40, rx: 8 }, 'pink', { accent: true }),
    s('rect', { x: 36, y: 66, width: 88, height: 30, rx: 8 }, 'cream'),
    s('path', { d: 'M36 92c8 12 14 12 22 0s14 12 22 0 14 12 22 0 14 12 22 0v-10H36z' }, 'white'),
    s('rect', { x: 52, y: 44, width: 8, height: 24, rx: 2 }, 'blue'), s('rect', { x: 76, y: 44, width: 8, height: 24, rx: 2 }, 'green'), s('rect', { x: 100, y: 44, width: 8, height: 24, rx: 2 }, 'purple'),
    s('path', { d: 'M56 24c-6 8-4 14 0 16 4-2 6-8 0-16zM80 24c-6 8-4 14 0 16 4-2 6-8 0-16zM104 24c-6 8-4 14 0 16 4-2 6-8 0-16z' }, 'orange')
  ],
  primavera: [
    s('circle', { cx: 80, cy: 52, r: 20 }, 'pink', { accent: true }),
    s('circle', { cx: 80, cy: 108, r: 20 }, 'pink'),
    s('circle', { cx: 52, cy: 80, r: 20 }, 'pink'),
    s('circle', { cx: 108, cy: 80, r: 20 }, 'pink'),
    s('circle', { cx: 80, cy: 80, r: 14 }, 'yellow'),
    s('path', { d: 'M80 128v22', fill: 'none', 'stroke-width': 5, 'stroke-linecap': 'round' }, 'green', { stroke: true })
  ],
  verano: [
    strokeP(rays(80, 80, 48, 66, 12), 'orange', 7),
    s('circle', { cx: 80, cy: 80, r: 38 }, 'yellow', { accent: true }),
    s('path', { d: 'M50 70h26v14a10 10 0 0 1-10 8h-6a10 10 0 0 1-10-8zM84 70h26v14a10 10 0 0 1-10 8h-6a10 10 0 0 1-10-8z' }, 'dark'),
    strokeP('M76 74h8', 'dark', 3),
    strokeP('M62 104q18 14 36 0', 'red', 4)
  ],
  otoño: [
    s('path', { d: 'M80 18c14 12 22 20 20 34 12-6 22-8 30-6-2 14-10 22-20 28 8 4 14 10 16 20-14 2-24 0-32-8v34h-8V86c-8 8-18 10-32 8 2-10 8-16 16-20-10-6-18-14-20-28 8-2 18 0 30 6-2-14 6-22 20-34z', 'stroke-linejoin': 'round' }, 'orange', { accent: true }),
    s('path', { d: 'M76 70v70', fill: 'none', 'stroke-width': 5, 'stroke-linecap': 'round' }, 'brown', { stroke: true }),
    strokeP('M76 96l-20-16M76 96l20-16M76 74l-14-18M76 74l14-18', 'brown', 3)
  ],
  invierno: [
    strokeP('M80 20v120M28 50l104 60M28 110l104-60', 'sky', 7),
    strokeP('M80 38l-12-10M80 38l12-10M80 122l-12 10M80 122l12 10M44 59l16 2M44 59l-3 16M116 101l-16-2M116 101l3-16M44 101l-3-16M44 101l16-2M116 59l3 16M116 59l-16 2', 'blue', 5),
    s('circle', { cx: 80, cy: 80, r: 10 }, 'white', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 10, fill: 'none', 'stroke-width': 4 }, 'blue', { stroke: true })
  ],
  Navidad: [
    s('rect', { x: 72, y: 118, width: 16, height: 18, rx: 2 }, 'brown'),
    s('path', { d: 'M80 34L48 76h18L40 108h80L94 76h18z', 'stroke-linejoin': 'round' }, 'green', { accent: true }),
    s('path', { d: 'M80 14l4 10 10 1-8 7 3 10-9-6-9 6 3-10-8-7 10-1z' }, 'yellow'),
    s('circle', { cx: 70, cy: 92, r: 5 }, 'red'), s('circle', { cx: 92, cy: 70, r: 5 }, 'red'), s('circle', { cx: 94, cy: 100, r: 5 }, 'blue')
  ]
};
