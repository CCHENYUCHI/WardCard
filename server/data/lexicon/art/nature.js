// Illustration specs (see server/scripts/lexicon/art.js)
const { s } = require("../../../scripts/lexicon/art");

const r1 = (n) => Math.round(n * 10) / 10;
// Five-point star path
const star = (cx, cy, R, r) => 'M' + Array.from({ length: 10 }, (_, i) => {
  const a = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r : R;
  return `${r1(cx + d * Math.cos(a))} ${r1(cy + d * Math.sin(a))}`;
}).join('L') + 'z';
// Scalloped ring (wool, mane, cloud puffs)
const bumps = (cx, cy, R, n, r) => {
  const p = (i) => `${r1(cx + R * Math.cos(2 * Math.PI * i / n))} ${r1(cy + R * Math.sin(2 * Math.PI * i / n))}`;
  return `M${p(0)}` + Array.from({ length: n }, (_, i) => `A${r} ${r} 0 0 1 ${p(i + 1)}`).join('') + 'z';
};
const eyes = (x1, x2, y, r = 5) => [s('circle', { cx: x1, cy: y, r }, 'dark'), s('circle', { cx: x2, cy: y, r }, 'dark')];
const line = (d, color, w = 4, extra = {}) => s('path', { d, fill: 'none', 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, color, { stroke: true, ...extra });
const thermo = (fill, level) => [
  s('rect', { x: 66, y: 18, width: 28, height: 100, rx: 14 }, 'gray'),
  s('circle', { cx: 80, cy: 120, r: 22 }, fill, { accent: true }),
  s('rect', { x: 73, y: level, width: 14, height: 112 - level, rx: 5 }, fill, { accent: true })
];
const cloud = 'M40 118a22 22 0 0 1 0-44 32 32 0 0 1 60-12 26 26 0 0 1 22 56z';

module.exports = {
  naturaleza: [
    s('circle', { cx: 120, cy: 42, r: 18 }, 'yellow', { accent: true }),
    s('path', { d: 'M18 134 64 56l24 36 18-22 40 64z', 'stroke-linejoin': 'round' }, 'gray'),
    s('path', { d: 'M64 56 52 76l7 4 5-6 6 6 6-4z' }, 'white'),
    s('path', { d: 'M8 134q72-22 144 0v10H8z' }, 'green'),
    s('rect', { x: 32, y: 104, width: 8, height: 28 }, 'brown'),
    s('circle', { cx: 36, cy: 96, r: 18 }, 'green', { accent: true })
  ],
  sol: [
    line('M80 16v18M80 126v18M16 80h18M126 80h18M35 35l13 13M112 112l13 13M35 125l13-13M125 35l-13 13', 'orange', 6),
    s('circle', { cx: 80, cy: 80, r: 34 }, 'yellow', { accent: true }),
    ...eyes(68, 92, 74, 4),
    line('M66 90q14 12 28 0', 'dark', 4)
  ],
  luna: [
    s('path', { d: 'M96 26A56 56 0 1 0 134 112 44 44 0 0 1 96 26z', 'stroke-linejoin': 'round' }, 'yellow', { accent: true }),
    s('path', { d: star(124, 40, 12, 5) }, 'yellow'),
    s('path', { d: star(132, 76, 7, 3) }, 'yellow'),
    s('circle', { cx: 56, cy: 94, r: 6, opacity: 0.5 }, 'orange', { flatOnly: true }),
    s('circle', { cx: 74, cy: 120, r: 4, opacity: 0.5 }, 'orange', { flatOnly: true })
  ],
  estrella: [
    s('path', { d: star(80, 86, 64, 28), 'stroke-linejoin': 'round' }, 'yellow', { accent: true }),
    ...eyes(70, 90, 84, 4),
    line('M72 98q8 7 16 0', 'dark', 3),
    line('M24 26l6 6M136 24l-6 6M140 132l-6-6', 'orange', 4)
  ],
  cielo: [
    s('rect', { x: 14, y: 22, width: 132, height: 116, rx: 14 }, 'sky', { accent: true }),
    s('circle', { cx: 112, cy: 54, r: 16 }, 'yellow'),
    s('path', { d: 'M34 112a12 12 0 0 1 4-24 18 18 0 0 1 34-4 14 14 0 0 1 14 28z' }, 'white'),
    line('M38 54q6-6 12 0q6-6 12 0M70 40q4-4 8 0q4-4 8 0', 'dark', 3)
  ],
  nube: [
    s('path', { d: cloud, 'stroke-linejoin': 'round', transform: 'translate(-2 4)' }, 'sky', { accent: true }),
    s('path', { d: 'M46 86a12 12 0 0 1 14-10', fill: 'none', 'stroke-width': 5, 'stroke-linecap': 'round' }, 'white', { stroke: true, flatOnly: true }),
    ...eyes(66, 94, 98, 4),
    line('M74 108q6 5 12 0', 'dark', 3)
  ],
  lluvia: [
    s('path', { d: cloud, 'stroke-linejoin': 'round', transform: 'translate(0 -30)' }, 'gray', { accent: true }),
    line('M46 106l-6 14M72 106l-6 14M98 106l-6 14M58 128l-6 14M86 128l-6 14M112 120l-6 14', 'blue', 5)
  ],
  nieve: [
    line('M80 20v120M28 50l104 60M28 110l104-60', 'blue', 6),
    line('M68 28l12 12 12-12M68 132l12-12 12 12M30 66l16-4-4-16M130 94l-16 4 4 16M30 94l16 4-4 16M130 66l-16-4 4-16', 'blue', 5),
    s('circle', { cx: 80, cy: 80, r: 10 }, 'sky', { accent: true })
  ],
  viento: [
    line('M18 64h80a16 16 0 1 0-16-16', 'blue', 6),
    line('M18 88h104a16 16 0 1 1-16 16', 'sky', 6, { lineColor: 'blue' }),
    line('M30 112h44', 'blue', 6),
    s('path', { d: 'M118 40c14-6 26 0 28 12-14 6-26 0-28-12z' }, 'green', { accent: true })
  ],
  calor: [
    ...thermo('red', 34),
    line('M108 30q6 8 0 16t0 16M122 40q6 8 0 16t0 16', 'orange', 4),
    s('circle', { cx: 38, cy: 46, r: 18 }, 'yellow'),
    line('M38 18v6M38 68v6M10 46h6M60 46h6', 'orange', 4)
  ],
  'frío': [
    ...thermo('blue', 94),
    line('M118 28v40M101 38l34 20M101 58l34-20', 'sky', 5, { lineColor: 'blue' }),
    line('M24 92q8 4 16 0M24 104q8 4 16 0', 'sky', 4, { lineColor: 'blue' })
  ],
  temperatura: [
    ...thermo('orange', 62),
    line('M100 32h10M100 50h10M100 68h10M100 86h10M100 104h10', 'dark', 3),
    line('M50 32h10M50 50h10M50 68h10M50 86h10M50 104h10', 'dark', 3)
  ],
  grado: [
    s('path', { d: 'M14 140v-26h28V88h28V62h28V36h28v104z', 'stroke-linejoin': 'round' }, 'tan'),
    s('circle', { cx: 132, cy: 22, r: 0.1 }, 'tan', { flatOnly: true }),
    s('path', { d: 'M136 34a12 12 0 1 0 0.1 0z', fill: 'none', 'stroke-width': 6 }, 'red', { stroke: true }),
    s('circle', { cx: 42, cy: 70, r: 10 }, 'skin'),
    s('path', { d: 'M32 112v-22a10 10 0 0 1 20 0v22z' }, 'blue', { accent: true })
  ],
  tormenta: [
    s('path', { d: cloud, 'stroke-linejoin': 'round', transform: 'translate(0 -36)' }, 'dark'),
    s('path', { d: 'M82 82h22l-14 22h16l-34 40 10-30H66z', 'stroke-linejoin': 'round' }, 'yellow', { accent: true }),
    line('M40 96l-8 16M52 112l-6 12M124 96l-8 16', 'blue', 5)
  ],
  mar: [
    s('path', { d: 'M46 78a34 34 0 0 1 68 0z' }, 'yellow'),
    s('path', { d: 'M8 78h144v66H8z' }, 'blue', { accent: true }),
    line('M18 98q10-8 20 0t20 0t20 0t20 0t20 0t20 0', 'white', 5, { lineColor: 'dark' }),
    line('M26 122q10-8 20 0t20 0t20 0t20 0t20 0', 'sky', 5),
    s('path', { d: 'M106 50h18l-8-14z', opacity: 0.0 }, 'white', { flatOnly: true })
  ],
  'río': [
    s('rect', { x: 14, y: 18, width: 132, height: 124, rx: 16 }, 'mint', { accent: true }),
    line('M86 18c-30 20 30 40 0 62s-30 40-6 62', 'blue', 22),
    line('M86 40q-6 6 0 12M74 104q-4 6 0 12', 'white', 3, { lineColor: 'dark' }),
    s('circle', { cx: 40, cy: 56, r: 12 }, 'green'), s('circle', { cx: 124, cy: 108, r: 12 }, 'green')
  ],
  lago: [
    s('path', { d: 'M20 96 58 40l26 36 18-20 38 40z', 'stroke-linejoin': 'round' }, 'gray'),
    s('ellipse', { cx: 80, cy: 112, rx: 66, ry: 28 }, 'blue', { accent: true }),
    line('M52 108h24M92 120h26', 'sky', 4),
    line('M22 132v-22M28 132v-28M34 132v-18', 'green', 4)
  ],
  'montaña': [
    s('path', { d: 'M8 136 52 72l22 30 32-58 46 92z', 'stroke-linejoin': 'round' }, 'green', { accent: true }),
    s('path', { d: 'M106 44 92 70l8 4 6-8 6 8 8-4z', 'stroke-linejoin': 'round' }, 'white'),
    s('path', { d: 'M52 72 42 86l6 3 4-5 5 5 6-3z', 'stroke-linejoin': 'round' }, 'white'),
    s('circle', { cx: 32, cy: 38, r: 12 }, 'yellow')
  ],
  bosque: [
    s('rect', { x: 36, y: 112, width: 8, height: 22 }, 'brown'),
    s('rect', { x: 116, y: 112, width: 8, height: 22 }, 'brown'),
    s('rect', { x: 76, y: 116, width: 8, height: 22 }, 'brown'),
    s('path', { d: 'M40 30 14 114h52z', 'stroke-linejoin': 'round' }, 'green'),
    s('path', { d: 'M120 30 94 114h52z', 'stroke-linejoin': 'round' }, 'green'),
    s('path', { d: 'M80 22 50 118h60z', 'stroke-linejoin': 'round' }, 'green', { accent: true }),
    line('M12 138h136', 'brown', 4)
  ],
  'árbol': [
    s('path', { d: 'M70 140V96l-14-14 6-4 12 10V78h12v14l14-12 6 4-20 18v42z', 'stroke-linejoin': 'round' }, 'brown'),
    s('path', { d: bumps(80, 64, 40, 9, 16), 'stroke-linejoin': 'round' }, 'green', { accent: true }),
    s('circle', { cx: 66, cy: 56, r: 5 }, 'red'), s('circle', { cx: 96, cy: 70, r: 5 }, 'red'),
    line('M40 140h80', 'brown', 4)
  ],
  flor: [
    line('M80 84v56', 'green', 6),
    s('path', { d: 'M80 124c-6-16-24-22-34-16 6 14 22 20 34 16z' }, 'green'),
    s('path', { d: bumps(80, 60, 26, 6, 15), 'stroke-linejoin': 'round' }, 'pink', { accent: true }),
    s('circle', { cx: 80, cy: 60, r: 14 }, 'yellow')
  ],
  planta: [
    s('path', { d: 'M80 104c-2-24 4-50 0-74', fill: 'none', 'stroke-width': 5 }, 'green', { stroke: true }),
    s('path', { d: 'M80 70C64 52 38 54 30 64c14 14 36 14 50 6z' }, 'green', { accent: true }),
    s('path', { d: 'M80 54c14-20 38-20 48-12-12 16-34 18-48 12z' }, 'green', { accent: true }),
    s('path', { d: 'M80 92c12-12 30-12 38-6-10 12-28 12-38 6z' }, 'mint'),
    s('path', { d: 'M46 100h68l-8 40H54z', 'stroke-linejoin': 'round' }, 'orange'),
    s('rect', { x: 42, y: 96, width: 76, height: 12, rx: 4 }, 'brown')
  ],
  hoja: [
    s('path', { d: 'M30 130C24 70 70 26 136 24c2 66-40 110-106 106z', 'stroke-linejoin': 'round' }, 'green', { accent: true }),
    line('M30 130 120 40M60 100l-4-24M60 100l24 2M84 76l-2-22M84 76l22 2', 'mint', 4, { lineColor: 'dark' })
  ],
  campo: [
    s('circle', { cx: 120, cy: 40, r: 16 }, 'yellow'),
    s('path', { d: 'M8 84q48-24 96-6t48-6v72H8z' }, 'green', { accent: true }),
    s('path', { d: 'M8 112q72-14 144 0v32H8z' }, 'yellow'),
    line('M24 120l-8 20M52 118l-6 22M80 116v24M108 118l6 22M136 120l8 20', 'orange', 3),
    line('M20 90v-18M40 84v-18M60 80v-18M14 76h52', 'brown', 4)
  ],
  isla: [
    s('ellipse', { cx: 80, cy: 124, rx: 70, ry: 18 }, 'blue', { accent: true }),
    s('path', { d: 'M36 124q44-36 88 0z' }, 'tan'),
    s('path', { d: 'M82 112c0-26 4-48 14-66', fill: 'none', 'stroke-width': 7, 'stroke-linecap': 'round' }, 'brown', { stroke: true }),
    s('path', { d: 'M96 46c-14-12-34-12-44 0 14 2 30 4 44 0zM96 46c6-16 24-24 40-18-10 10-26 18-40 18zM96 46c16-4 34 4 38 18-14 0-28-8-38-18zM96 46c-10 6-18 20-16 34 10-8 16-20 16-34z' }, 'green')
  ],
  tierra: [
    s('circle', { cx: 80, cy: 80, r: 58 }, 'blue', { accent: true }),
    s('path', { d: 'M46 42c14-6 30 2 28 16-2 10-16 8-18 20s-14 18-24 8c-6-12-2-34 14-44zM96 64c12-6 30 2 32 18 2 14-10 30-22 30-8 0-6-14-14-20s-6-24 4-28zM62 118c8-4 20 0 22 8-8 6-18 6-22-8z' }, 'green')
  ],
  piedra: [
    s('path', { d: 'M20 132c-4-26 10-50 36-56 24-6 44 6 50 28 4 16-2 28-14 28z', 'stroke-linejoin': 'round' }, 'gray', { accent: true }),
    s('path', { d: 'M96 132c-2-18 10-32 26-32 16 0 24 14 22 32z', 'stroke-linejoin': 'round' }, 'gray'),
    s('path', { d: 'M40 96q10-10 22-8', fill: 'none', 'stroke-width': 4, 'stroke-linecap': 'round' }, 'white', { stroke: true, flatOnly: true }),
    line('M12 134h136', 'brown', 4)
  ],
  fuego: [
    s('path', { d: 'M80 18c8 24 40 38 40 72a40 40 0 0 1-80 0c0-18 10-28 16-38 4 10 6 16 14 20-4-20 2-38 10-54z', 'stroke-linejoin': 'round' }, 'red', { accent: true }),
    s('path', { d: 'M80 70c4 12 22 20 22 38a22 22 0 0 1-44 0c0-12 10-18 14-26 2 6 4 8 8 10z' }, 'yellow'),
    s('rect', { x: 34, y: 124, width: 92, height: 12, rx: 6, transform: 'rotate(8 80 130)' }, 'brown'),
    s('rect', { x: 34, y: 124, width: 92, height: 12, rx: 6, transform: 'rotate(-8 80 130)' }, 'brown')
  ],
  animal: [
    s('ellipse', { cx: 80, cy: 104, rx: 30, ry: 26 }, 'brown', { accent: true }),
    s('ellipse', { cx: 40, cy: 72, rx: 12, ry: 15, transform: 'rotate(-20 40 72)' }, 'brown', { accent: true }),
    s('ellipse', { cx: 64, cy: 48, rx: 12, ry: 16, transform: 'rotate(-8 64 48)' }, 'brown', { accent: true }),
    s('ellipse', { cx: 96, cy: 48, rx: 12, ry: 16, transform: 'rotate(8 96 48)' }, 'brown', { accent: true }),
    s('ellipse', { cx: 120, cy: 72, rx: 12, ry: 15, transform: 'rotate(20 120 72)' }, 'brown', { accent: true })
  ],
  gato: [
    s('path', { d: 'M36 78 40 24l34 30zM124 78l-4-54-34 30z', 'stroke-linejoin': 'round' }, 'orange'),
    s('circle', { cx: 80, cy: 88, r: 46 }, 'orange', { accent: true }),
    s('path', { d: 'M46 36l2 22 14-8zM114 36l-2 22-14-8z' }, 'pink', { flatOnly: true }),
    ...eyes(62, 98, 82, 6),
    s('path', { d: 'M74 98h12l-6 7z' }, 'pink'),
    line('M80 105q-6 8-12 4M80 105q6 8 12 4M20 92l30 4M22 108l28-6M140 92l-30 4M138 108l-28-6', 'dark', 3)
  ],
  'pájaro': [
    line('M14 128h132', 'brown', 6),
    line('M74 112v16M88 112v16', 'orange', 4),
    s('path', { d: 'M40 80c0-28 24-46 50-40 20 4 30 22 28 42-2 22-22 34-44 32-20-2-34-14-34-34z' }, 'blue', { accent: true }),
    s('path', { d: 'M54 84c10-14 34-14 44 4-16 10-34 8-44-4z' }, 'navy'),
    s('path', { d: 'M114 62l22 8-22 8z', 'stroke-linejoin': 'round' }, 'orange'),
    s('circle', { cx: 100, cy: 60, r: 5 }, 'dark'),
    s('path', { d: 'M40 84 14 74l10 22z', 'stroke-linejoin': 'round' }, 'navy')
  ],
  pez: [
    s('path', { d: 'M118 80 148 52v56z', 'stroke-linejoin': 'round' }, 'orange'),
    s('ellipse', { cx: 72, cy: 80, rx: 54, ry: 34 }, 'orange', { accent: true }),
    s('path', { d: 'M62 48q14-22 34-4z' }, 'yellow'),
    line('M96 62q-10 18 0 36', 'yellow', 4, { lineColor: 'dark' }),
    s('circle', { cx: 44, cy: 72, r: 7 }, 'white'), s('circle', { cx: 44, cy: 72, r: 4 }, 'dark'),
    line('M24 90q6 4 12 0', 'dark', 3)
  ],
  caballo: [
    s('path', { d: 'M54 50 50 20l20 22zM106 50l4-30-20 22z', 'stroke-linejoin': 'round' }, 'brown'),
    s('path', { d: 'M80 34c26 0 34 22 32 48-2 24-6 36-8 48H56c-2-12-6-24-8-48-2-26 6-48 32-48z' }, 'brown', { accent: true }),
    s('path', { d: 'M66 36c4-14 24-14 28 0-6 10-22 10-28 0z' }, 'dark'),
    s('ellipse', { cx: 80, cy: 120, rx: 28, ry: 20 }, 'tan'),
    ...eyes(62, 98, 70, 5),
    s('circle', { cx: 70, cy: 122, r: 4 }, 'dark'), s('circle', { cx: 90, cy: 122, r: 4 }, 'dark')
  ],
  vaca: [
    s('path', { d: 'M46 44c-10-4-16-14-14-24 8 6 14 10 24 12zM114 44c10-4 16-14 14-24-8 6-14 10-24 12z', 'stroke-linejoin': 'round' }, 'cream'),
    s('ellipse', { cx: 30, cy: 64, rx: 18, ry: 10, transform: 'rotate(20 30 64)' }, 'white'),
    s('ellipse', { cx: 130, cy: 64, rx: 18, ry: 10, transform: 'rotate(-20 130 64)' }, 'white'),
    s('path', { d: 'M80 32c30 0 40 22 38 52-2 28-14 40-38 40s-36-12-38-40c-2-30 8-52 38-52z' }, 'cream', { accent: true }),
    s('path', { d: 'M48 50c10-6 22 0 18 12-4 10-16 8-20 0zM104 84c8-4 14 4 10 12-6 2-12-4-10-12z' }, 'dark'),
    s('ellipse', { cx: 80, cy: 112, rx: 30, ry: 20 }, 'pink'),
    ...eyes(64, 96, 76, 5),
    s('circle', { cx: 70, cy: 112, r: 4 }, 'dark'), s('circle', { cx: 90, cy: 112, r: 4 }, 'dark')
  ],
  cerdo: [
    s('path', { d: 'M36 60 34 26l30 18zM124 60l2-34-30 18z', 'stroke-linejoin': 'round' }, 'pink'),
    s('circle', { cx: 80, cy: 86, r: 48 }, 'pink', { accent: true }),
    s('ellipse', { cx: 80, cy: 98, rx: 22, ry: 16 }, 'white', { flatOnly: true, }),
    s('ellipse', { cx: 80, cy: 98, rx: 22, ry: 16, opacity: 0.6 }, 'pink'),
    s('ellipse', { cx: 72, cy: 98, rx: 4, ry: 6 }, 'dark'), s('ellipse', { cx: 88, cy: 98, rx: 4, ry: 6 }, 'dark'),
    ...eyes(62, 98, 70, 5)
  ],
  oveja: [
    s('path', { d: bumps(80, 84, 46, 12, 14), 'stroke-linejoin': 'round' }, 'gray', { accent: true }),
    s('ellipse', { cx: 44, cy: 72, rx: 14, ry: 7, transform: 'rotate(30 44 72)' }, 'dark'),
    s('ellipse', { cx: 116, cy: 72, rx: 14, ry: 7, transform: 'rotate(-30 116 72)' }, 'dark'),
    s('ellipse', { cx: 80, cy: 92, rx: 24, ry: 30 }, 'dark'),
    s('circle', { cx: 70, cy: 86, r: 5 }, 'white'), s('circle', { cx: 90, cy: 86, r: 5 }, 'white'),
    s('path', { d: bumps(80, 54, 16, 7, 7) }, 'cream')
  ],
  gallina: [
    line('M72 124v16M90 124v16M66 140h12M84 140h12', 'orange', 4),
    s('path', { d: 'M100 48c-24 0-30 26-46 36-14-8-30-6-36-2 2 30 24 44 54 44 32 0 50-20 50-46 0-18-8-32-22-32z' }, 'cream', { accent: true }),
    s('path', { d: 'M90 46c-2-10 6-16 10-10 2-8 12-8 12 0 6-4 12 4 6 10z' }, 'red'),
    s('path', { d: 'M120 60l16 6-16 6z', 'stroke-linejoin': 'round' }, 'yellow'),
    s('path', { d: 'M118 74q4 12-4 12-4-6 4-12z' }, 'red'),
    s('circle', { cx: 108, cy: 62, r: 4 }, 'dark'),
    line('M58 96q16 12 34 0', 'gray', 4)
  ],
  'ratón': [
    s('circle', { cx: 42, cy: 52, r: 28 }, 'gray'), s('circle', { cx: 118, cy: 52, r: 28 }, 'gray'),
    s('circle', { cx: 42, cy: 52, r: 16 }, 'pink'), s('circle', { cx: 118, cy: 52, r: 16 }, 'pink'),
    s('path', { d: 'M80 52c28 0 42 22 34 46-8 24-24 34-34 36-10-2-26-12-34-36-8-24 6-46 34-46z' }, 'gray', { accent: true }),
    ...eyes(66, 94, 88, 5),
    s('circle', { cx: 80, cy: 120, r: 7 }, 'pink'),
    line('M70 116l-36-6M70 122l-34 6M90 116l36-6M90 122l34 6', 'dark', 2.5)
  ],
  conejo: [
    s('ellipse', { cx: 62, cy: 44, rx: 13, ry: 34, transform: 'rotate(-10 62 44)' }, 'gray'),
    s('ellipse', { cx: 98, cy: 44, rx: 13, ry: 34, transform: 'rotate(10 98 44)' }, 'gray'),
    s('ellipse', { cx: 62, cy: 44, rx: 6, ry: 24, transform: 'rotate(-10 62 44)' }, 'pink'),
    s('ellipse', { cx: 98, cy: 44, rx: 6, ry: 24, transform: 'rotate(10 98 44)' }, 'pink'),
    s('circle', { cx: 80, cy: 104, r: 38 }, 'gray', { accent: true }),
    ...eyes(66, 94, 98, 5),
    s('path', { d: 'M74 110h12l-6 6z' }, 'pink'),
    s('rect', { x: 74, y: 118, width: 12, height: 10, rx: 2 }, 'cream')
  ],
  'león': [
    s('path', { d: bumps(80, 82, 52, 12, 16), 'stroke-linejoin': 'round' }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 84, r: 40 }, 'yellow'),
    ...eyes(66, 94, 76, 5),
    s('ellipse', { cx: 80, cy: 102, rx: 16, ry: 12 }, 'cream'),
    s('path', { d: 'M72 94h16l-8 8z' }, 'brown'),
    line('M80 102v6M72 112q8 6 16 0', 'dark', 3)
  ],
  tigre: [
    s('circle', { cx: 42, cy: 46, r: 16 }, 'orange'), s('circle', { cx: 118, cy: 46, r: 16 }, 'orange'),
    s('circle', { cx: 80, cy: 86, r: 50 }, 'orange', { accent: true }),
    s('path', { d: 'M80 38l-6 16h12zM34 78l18 6-18 6zM126 78l-18 6 18 6zM40 108l16 0-12 10zM120 108h-16l12 10z' }, 'dark'),
    s('ellipse', { cx: 80, cy: 106, rx: 24, ry: 18 }, 'white'),
    ...eyes(62, 98, 78, 5),
    s('path', { d: 'M72 98h16l-8 8z' }, 'pink'),
    line('M80 106v6M72 116q8 6 16 0', 'dark', 3)
  ],
  elefante: [
    s('ellipse', { cx: 36, cy: 76, rx: 30, ry: 38 }, 'gray'),
    s('ellipse', { cx: 124, cy: 76, rx: 30, ry: 38 }, 'gray'),
    s('ellipse', { cx: 36, cy: 76, rx: 18, ry: 26, opacity: 0.6 }, 'pink', { flatOnly: true }),
    s('ellipse', { cx: 124, cy: 76, rx: 18, ry: 26, opacity: 0.6 }, 'pink', { flatOnly: true }),
    s('path', { d: 'M80 34c26 0 38 20 36 44-2 18-14 26-22 30v20c0 10 8 12 14 8l4 8c-12 10-32 4-32-14v-14c-10-4-34-12-36-38-2-24 10-44 36-44z' }, 'gray', { accent: true }),
    ...eyes(64, 96, 72, 5)
  ],
  mono: [
    s('circle', { cx: 32, cy: 82, r: 18 }, 'brown'), s('circle', { cx: 128, cy: 82, r: 18 }, 'brown'),
    s('circle', { cx: 32, cy: 82, r: 9 }, 'tan'), s('circle', { cx: 128, cy: 82, r: 9 }, 'tan'),
    s('circle', { cx: 80, cy: 80, r: 48 }, 'brown', { accent: true }),
    s('path', { d: 'M80 62c8-14 34-12 34 8 0 12-6 18-2 30-4 18-18 26-32 26s-28-8-32-26c4-12-2-18-2-30 0-20 26-22 34-8z' }, 'tan'),
    ...eyes(66, 94, 74, 5),
    s('circle', { cx: 74, cy: 94, r: 2.5 }, 'dark'), s('circle', { cx: 86, cy: 94, r: 2.5 }, 'dark'),
    line('M66 106q14 12 28 0', 'dark', 3)
  ],
  oso: [
    s('circle', { cx: 42, cy: 46, r: 18 }, 'brown'), s('circle', { cx: 118, cy: 46, r: 18 }, 'brown'),
    s('circle', { cx: 42, cy: 46, r: 9 }, 'tan'), s('circle', { cx: 118, cy: 46, r: 9 }, 'tan'),
    s('circle', { cx: 80, cy: 86, r: 50 }, 'brown', { accent: true }),
    s('ellipse', { cx: 80, cy: 106, rx: 24, ry: 18 }, 'tan'),
    ...eyes(62, 98, 78, 5),
    s('ellipse', { cx: 80, cy: 98, rx: 9, ry: 6 }, 'dark'),
    line('M80 104v6M72 114q8 6 16 0', 'dark', 3)
  ],
  serpiente: [
    line('M24 128c20 10 44 6 46-12s-28-18-30-38 26-26 46-20', 'green', 16),
    line('M24 128c20 10 44 6 46-12s-28-18-30-38 26-26 46-20', 'yellow', 3, { flatOnly: true, }),
    s('ellipse', { cx: 102, cy: 56, rx: 22, ry: 16, transform: 'rotate(-10 102 56)' }, 'green', { accent: true }),
    s('circle', { cx: 106, cy: 50, r: 4 }, 'dark'),
    line('M122 60l14 4m-6-6 6 6-6 4', 'red', 3)
  ],
  insecto: [
    line('M58 66 30 50M56 86H24M60 104l-26 18M102 66l28-16M104 86h32M100 104l26 18M72 32l-8-14M88 32l8-14', 'dark', 4),
    s('circle', { cx: 80, cy: 40, r: 12 }, 'dark'),
    s('ellipse', { cx: 80, cy: 64, rx: 18, ry: 14 }, 'green'),
    s('ellipse', { cx: 80, cy: 106, rx: 30, ry: 36 }, 'green', { accent: true }),
    line('M80 72v68', 'dark', 3),
    s('circle', { cx: 66, cy: 100, r: 5 }, 'dark'), s('circle', { cx: 94, cy: 114, r: 5 }, 'dark')
  ],
  mariposa: [
    s('path', { d: 'M78 76C56 34 18 28 16 56c-2 22 24 30 62 24z' }, 'purple', { accent: true }),
    s('path', { d: 'M82 76c22-42 60-48 62-20 2 22-24 30-62 24z' }, 'purple', { accent: true }),
    s('path', { d: 'M78 84c-30 2-48 18-40 36 8 14 28 6 40-30zM82 84c30 2 48 18 40 36-8 14-28 6-40-30z' }, 'pink'),
    s('circle', { cx: 44, cy: 58, r: 8 }, 'yellow'), s('circle', { cx: 116, cy: 58, r: 8 }, 'yellow'),
    s('rect', { x: 74, y: 52, width: 12, height: 72, rx: 6 }, 'dark'),
    line('M76 54q-8-20-20-26M84 54q8-20 20-26', 'dark', 3)
  ],
  lobo: [
    s('path', { d: 'M36 74 34 20l38 26zM124 74l2-54-38 26z', 'stroke-linejoin': 'round' }, 'gray'),
    s('path', { d: 'M80 34c34 0 52 24 50 52l-30 46H60L30 86c-2-28 16-52 50-52z', 'stroke-linejoin': 'round' }, 'gray', { accent: true }),
    s('path', { d: 'M80 74c14 0 20 10 22 22l-6 36H64l-6-36c2-12 8-22 22-22z' }, 'white'),
    ...eyes(62, 98, 74, 5),
    s('ellipse', { cx: 80, cy: 122, rx: 10, ry: 7 }, 'dark')
  ],
  pato: [
    line('M10 132q14-8 28 0t28 0t28 0t28 0t28 0', 'blue', 5),
    s('path', { d: 'M24 98c0-12 10-18 22-14 10 4 22 6 34 0 6-24 22-36 38-30 14 6 14 26 4 36 14 10 8 34-24 36H54c-20 0-30-12-30-28z', 'stroke-linejoin': 'round' }, 'yellow', { accent: true }),
    s('path', { d: 'M128 64l20 4-18 8z', 'stroke-linejoin': 'round' }, 'orange'),
    s('circle', { cx: 116, cy: 62, r: 4 }, 'dark'),
    s('path', { d: 'M50 100c12-10 34-10 44 2-14 10-32 10-44-2z' }, 'orange', { flatOnly: true })
  ],
  desierto: [
    s('circle', { cx: 120, cy: 40, r: 18 }, 'yellow'),
    s('path', { d: 'M8 116q40-30 80-8t64-4v40H8z' }, 'tan'),
    s('path', { d: 'M8 132q60-18 144 0v12H8z' }, 'orange'),
    s('path', { d: 'M52 128V62a8 8 0 0 1 16 0v66zM52 96H40a6 6 0 0 1-6-6V76a5 5 0 0 1 10 0v10h8M68 86h10V72a5 5 0 0 1 10 0v14a6 6 0 0 1-6 6H68', 'stroke-linejoin': 'round' }, 'green', { accent: true })
  ],
  selva: [
    s('path', { d: 'M20 140C10 100 26 60 60 44 60 84 48 116 20 140z' }, 'green', { accent: true }),
    s('path', { d: 'M140 140c10-40-6-80-40-96 0 40 12 72 40 96z' }, 'green', { accent: true }),
    s('path', { d: 'M80 140C56 112 52 72 80 30c28 42 24 82 0 110z' }, 'mint'),
    line('M80 40v100M20 140 60 44M140 140 100 44', 'green', 3, { lineColor: 'dark' }),
    s('circle', { cx: 112, cy: 120, r: 9 }, 'red'), s('circle', { cx: 46, cy: 116, r: 7 }, 'orange'),
    line('M30 16q10 30 0 50M130 16q-10 30 0 44', 'brown', 4)
  ],
  costa: [
    s('path', { d: 'M8 60h144v84H8z' }, 'blue'),
    line('M16 80q8-6 16 0t16 0M30 104q8-6 16 0t16 0', 'white', 4, { lineColor: 'dark' }),
    s('path', { d: 'M152 60c-40 10-50 40-62 84h62z' }, 'tan'),
    s('path', { d: 'M110 128l6-62h16l6 62z', 'stroke-linejoin': 'round' }, 'white', { lineColor: 'dark' }),
    s('path', { d: 'M114 90h24l1 14h-26zM115 66l-1 12h24l-1-12z' }, 'red', { accent: true }),
    s('path', { d: 'M114 52h24l-12-14z', 'stroke-linejoin': 'round' }, 'red', { accent: true }),
    s('rect', { x: 116, y: 52, width: 20, height: 14 }, 'yellow')
  ],
  ola: [
    s('path', { d: 'M8 132c18 0 30-14 34-44 6-40 40-62 76-54 26 6 36 30 26 46-8 12-28 10-30-4-2-10 8-14 14-8-6-20-46-14-50 24-4 30 10 40 32 40h50v12H8z', 'stroke-linejoin': 'round' }, 'blue', { accent: true }),
    line('M60 70c8-16 26-24 44-20', 'white', 5, { lineColor: 'dark', flatOnly: true }),
    line('M8 148h144', 'sky', 5)
  ],
  arena: [
    s('path', { d: 'M8 132q72-20 144 0v12H8z' }, 'tan'),
    s('path', { d: 'M38 136V98h12v-8h10v8h12V82h16v16h12v-8h10v8h12v38z', 'stroke-linejoin': 'round' }, 'tan', { accent: true }),
    s('rect', { x: 72, y: 112, width: 16, height: 24, rx: 8 }, 'brown'),
    line('M80 82V46', 'dark', 3),
    s('path', { d: 'M82 46l22 7-22 7z' }, 'red'),
    s('circle', { cx: 52, cy: 120, r: 2 }, 'brown'), s('circle', { cx: 110, cy: 118, r: 2 }, 'brown')
  ],
  hielo: [
    s('path', { d: 'M28 70l40-12 34 14v46l-40 14-34-16z', 'stroke-linejoin': 'round' }, 'sky', { accent: true }),
    line('M28 70l34 14 40-12M62 84v48', 'blue', 3),
    s('path', { d: 'M82 46l32-14 28 12v38l-32 14-28-12z', 'stroke-linejoin': 'round' }, 'sky', { accent: true }),
    line('M82 46l28 12 32-14M110 58v38', 'blue', 3),
    line('M38 82v14M92 58v10', 'white', 4, { flatOnly: true })
  ],
  niebla: [
    s('path', { d: 'M48 110V64l26-20 26 20v46z', 'stroke-linejoin': 'round', opacity: 0.5 }, 'gray'),
    s('circle', { cx: 120, cy: 70, r: 18, opacity: 0.5 }, 'green', { accent: true }),
    line('M20 60h60M96 60h44', 'gray', 10),
    line('M30 86h100', 'gray', 10),
    line('M14 112h56M86 112h60', 'gray', 10),
    line('M36 136h88', 'gray', 10)
  ],
  'arcoíris': [
    line('M18 120a62 62 0 0 1 124 0', 'red', 9),
    line('M28 120a52 52 0 0 1 104 0', 'orange', 9),
    line('M38 120a42 42 0 0 1 84 0', 'yellow', 9),
    line('M48 120a32 32 0 0 1 64 0', 'green', 9),
    line('M58 120a22 22 0 0 1 44 0', 'blue', 9),
    s('path', { d: 'M8 130a12 12 0 0 1 8-20 14 14 0 0 1 26 2 10 10 0 0 1 4 18z' }, 'white', { accent: true, lineColor: 'dark' }),
    s('path', { d: 'M114 130a12 12 0 0 1 8-20 14 14 0 0 1 26 2 10 10 0 0 1 4 18z' }, 'white', { accent: true, lineColor: 'dark' })
  ],
  ballena: [
    line('M58 44q-4-14-12-20M58 44q4-14 12-20M58 44V26', 'sky', 5, { lineColor: 'blue' }),
    s('path', { d: 'M14 92c0-28 26-42 56-42 34 0 52 20 64 34l12-16c6 10 6 26-2 36 6 6 6 12 2 18-12-4-16-12-16-12-14 20-38 26-62 26-30 0-54-14-54-44z', 'stroke-linejoin': 'round' }, 'blue', { accent: true }),
    s('path', { d: 'M18 104c12 18 34 26 62 24 12-1 22-4 30-9-22 0-54-4-92-15z' }, 'sky'),
    s('circle', { cx: 40, cy: 84, r: 5 }, 'dark'),
    line('M26 100q10 4 18 0', 'dark', 3)
  ],
  tortuga: [
    s('ellipse', { cx: 44, cy: 118, rx: 10, ry: 14 }, 'mint'), s('ellipse', { cx: 104, cy: 118, rx: 10, ry: 14 }, 'mint'),
    s('ellipse', { cx: 134, cy: 96, rx: 18, ry: 14 }, 'mint'),
    s('path', { d: 'M18 110c0-36 24-58 56-58s56 22 56 58z', 'stroke-linejoin': 'round' }, 'green', { accent: true }),
    s('path', { d: 'M74 62l-14 18 14 18 14-18zM48 92l-12 16h24zM100 92l-12 16h24z', 'stroke-linejoin': 'round' }, 'mint'),
    s('rect', { x: 14, y: 106, width: 120, height: 8, rx: 4 }, 'brown'),
    s('circle', { cx: 140, cy: 92, r: 3.5 }, 'dark')
  ],
  rana: [
    s('circle', { cx: 52, cy: 56, r: 20 }, 'green'), s('circle', { cx: 108, cy: 56, r: 20 }, 'green'),
    s('ellipse', { cx: 80, cy: 96, rx: 58, ry: 40 }, 'green', { accent: true }),
    s('circle', { cx: 52, cy: 54, r: 12 }, 'white'), s('circle', { cx: 108, cy: 54, r: 12 }, 'white'),
    ...eyes(54, 106, 56, 6),
    line('M44 104q36 26 72 0', 'dark', 4),
    s('circle', { cx: 42, cy: 94, r: 7, opacity: 0.6 }, 'pink', { flatOnly: true }), s('circle', { cx: 118, cy: 94, r: 7, opacity: 0.6 }, 'pink', { flatOnly: true })
  ],
  abeja: [
    s('ellipse', { cx: 62, cy: 48, rx: 18, ry: 26, transform: 'rotate(-30 62 48)', opacity: 0.85 }, 'sky'),
    s('ellipse', { cx: 92, cy: 44, rx: 18, ry: 26, transform: 'rotate(20 92 44)', opacity: 0.85 }, 'sky'),
    s('path', { d: 'M138 92l14 0-14 8z' }, 'dark'),
    s('ellipse', { cx: 84, cy: 94, rx: 54, ry: 36 }, 'yellow', { accent: true }),
    line('M76 60c-8 22-8 48 0 68M104 62c-8 20-8 44 0 64', 'dark', 10),
    s('circle', { cx: 46, cy: 88, r: 5 }, 'dark'),
    line('M38 104q8 6 16 0', 'dark', 3)
  ],
  hormiga: [
    line('M64 92l-12 34M80 94l4 36M98 90l18 36M44 70Q36 40 22 34M50 66q0-28 10-38', 'dark', 4),
    s('circle', { cx: 48, cy: 78, r: 16 }, 'red'),
    s('ellipse', { cx: 80, cy: 86, rx: 14, ry: 11 }, 'red'),
    s('ellipse', { cx: 118, cy: 84, rx: 28, ry: 22 }, 'red', { accent: true }),
    s('circle', { cx: 42, cy: 74, r: 4 }, 'dark'),
    line('M8 132h144', 'brown', 4)
  ],
  'delfín': [
    s('path', { d: 'M20 96c18-44 70-60 108-34 8 6 14 14 18 22-10 2-20-2-26-8-22-8-44 0-62 16-12 10-26 12-38 4z', 'stroke-linejoin': 'round' }, 'blue', { accent: true }),
    s('path', { d: 'M74 52l8-20 16 24z', 'stroke-linejoin': 'round' }, 'blue'),
    s('path', { d: 'M20 96 6 84l4 20 8 8z', 'stroke-linejoin': 'round' }, 'blue'),
    s('path', { d: 'M58 88c18-12 40-14 62-8-10-2-34 4-48 16z' }, 'sky'),
    s('circle', { cx: 116, cy: 70, r: 4 }, 'dark'),
    line('M14 132q12-8 24 0t24 0t24 0t24 0t24 0t24 0', 'sky', 5, { lineColor: 'blue' })
  ],
  toro: [
    s('path', { d: 'M46 52C26 50 14 36 16 18c10 14 22 20 36 20zM114 52c20-2 32-16 30-34-10 14-22 20-36 20z', 'stroke-linejoin': 'round' }, 'cream'),
    s('ellipse', { cx: 34, cy: 66, rx: 16, ry: 9, transform: 'rotate(20 34 66)' }, 'brown'),
    s('ellipse', { cx: 126, cy: 66, rx: 16, ry: 9, transform: 'rotate(-20 126 66)' }, 'brown'),
    s('path', { d: 'M80 36c28 0 40 22 38 50-2 24-12 40-38 40s-36-16-38-40c-2-28 10-50 38-50z' }, 'brown', { accent: true }),
    s('ellipse', { cx: 80, cy: 112, rx: 28, ry: 18 }, 'tan'),
    ...eyes(64, 96, 74, 5),
    s('circle', { cx: 70, cy: 110, r: 4 }, 'dark'), s('circle', { cx: 90, cy: 110, r: 4 }, 'dark'),
    s('path', { d: 'M70 122a10 10 0 0 0 20 0', fill: 'none', 'stroke-width': 4 }, 'yellow', { stroke: true, lineColor: 'orange' })
  ],
  burro: [
    s('ellipse', { cx: 54, cy: 34, rx: 10, ry: 30, transform: 'rotate(-18 54 34)' }, 'gray'),
    s('ellipse', { cx: 106, cy: 34, rx: 10, ry: 30, transform: 'rotate(18 106 34)' }, 'gray'),
    s('path', { d: 'M80 44c24 0 34 18 32 42-2 20-6 30-8 44H56c-2-14-6-24-8-44-2-24 8-42 32-42z' }, 'gray', { accent: true }),
    s('ellipse', { cx: 80, cy: 122, rx: 28, ry: 18 }, 'white', { lineColor: 'dark' }),
    s('path', { d: 'M70 44c2-10 18-10 20 0-6 6-14 6-20 0z' }, 'dark'),
    ...eyes(64, 96, 78, 5),
    s('circle', { cx: 70, cy: 122, r: 3.5 }, 'dark'), s('circle', { cx: 90, cy: 122, r: 3.5 }, 'dark')
  ],
  jirafa: [
    s('path', { d: 'M56 144V70c0-16 4-30 12-40h16c-4 14-6 28-6 40v74z', 'stroke-linejoin': 'round' }, 'yellow', { accent: true }),
    s('path', { d: 'M60 30c4-12 20-16 34-10 10 4 16 10 18 18 2 8-6 12-14 10-12-2-24 0-36-4-4-4-4-8-2-14z' }, 'yellow', { accent: true }),
    line('M70 22l-2-12M82 20l2-12', 'brown', 4),
    s('circle', { cx: 68, cy: 10, r: 4 }, 'brown'), s('circle', { cx: 84, cy: 8, r: 4 }, 'brown'),
    s('path', { d: 'M62 60h8v10h-8zM66 90h10v10H66zM60 118h8v10h-8zM70 132h8v8h-8zM68 40h8v8h-8z' }, 'brown'),
    s('circle', { cx: 82, cy: 30, r: 3.5 }, 'dark')
  ],
  planeta: [
    s('circle', { cx: 80, cy: 80, r: 38 }, 'orange', { accent: true }),
    s('path', { d: 'M48 68q32-8 64 0M44 86q36 8 72 0', fill: 'none', 'stroke-width': 5, opacity: 0.6 }, 'yellow', { stroke: true, flatOnly: true }),
    s('path', { d: 'M42 92c-24 10-32 22-24 28 12 10 64-2 100-24 30-18 40-34 30-40-8-6-24-2-42 6', fill: 'none', 'stroke-width': 6, 'stroke-linecap': 'round' }, 'purple', { stroke: true }),
    s('path', { d: star(28, 34, 8, 3) }, 'yellow'), s('path', { d: star(134, 126, 6, 2.5) }, 'yellow')
  ]
};
