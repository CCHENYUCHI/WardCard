// Illustration specs for the people theme (see server/scripts/lexicon/art.js)
const { s } = require("../../../scripts/lexicon/art");

const stroke = (d, color, w, extra = {}, opts = {}) =>
  s('path', { d, fill: 'none', 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, color, { stroke: true, ...opts });
// head + hair + body for a person standing with feet at y=by
const person = (x, headY, r, bodyColor, hairColor, bodyH, opts = {}) => {
  const w = r * 1.5;
  const by = headY + r + 3;
  return [
    s('path', { d: `M${x - w} ${by + bodyH}v${-bodyH + w}a${w} ${w} 0 0 1 ${2 * w} 0v${bodyH - w}z` }, bodyColor, opts),
    s('circle', { cx: x, cy: headY, r }, 'skin'),
    s('path', { d: `M${x - r - 1} ${headY}q${r + 1}-${r * 1.6} ${2 * r + 2} 0z` }, hairColor)
  ];
};
const faceDots = (x, y, r) => [
  s('circle', { cx: x - r * 0.38, cy: y + 1, r: r * 0.1 }, 'dark'),
  s('circle', { cx: x + r * 0.38, cy: y + 1, r: r * 0.1 }, 'dark')
];
const heart = (x, y, k, color) =>
  s('path', { d: `M${x} ${y + 12 * k}C${x - 22 * k} ${y - 2 * k} ${x - 12 * k} ${y - 20 * k} ${x} ${y - 8 * k}C${x + 12 * k} ${y - 20 * k} ${x + 22 * k} ${y - 2 * k} ${x} ${y + 12 * k}z` }, color);

module.exports = {
  persona: [
    ...person(62, 54, 22, 'blue', 'brown', 62, { accent: true }),
    s('ellipse', { cx: 120, cy: 78, rx: 22, ry: 28 }, 'cream'),
    s('path', { d: 'M108 74q5-6 10 0M122 74q5-6 10 0', fill: 'none', 'stroke-width': 3, 'stroke-linecap': 'round' }, 'dark', { stroke: true }),
    s('path', { d: 'M110 88q10 12 20 0', fill: 'none', 'stroke-width': 3, 'stroke-linecap': 'round' }, 'dark', { stroke: true })
  ],
  gente: [
    ...person(40, 62, 14, 'green', 'brown', 54),
    ...person(120, 62, 14, 'orange', 'dark', 54),
    ...person(80, 50, 17, 'blue', 'black', 76, { accent: true })
  ].slice(0, 9),
  hombre: [
    ...person(80, 48, 24, 'blue', 'dark', 76, { accent: true }),
    s('path', { d: 'M80 76l-7 8 7 30 7-30z' }, 'red'),
    ...faceDots(80, 50, 24),
    s('path', { d: 'M72 60q8 6 16 0', fill: 'none', 'stroke-width': 3, 'stroke-linecap': 'round' }, 'dark', { stroke: true })
  ],
  mujer: [
    s('path', { d: 'M52 56a28 28 0 0 1 56 0v40q-4 8-12 6V60H64v42q-8 2-12-6z' }, 'brown'),
    s('circle', { cx: 80, cy: 58, r: 22 }, 'skin'),
    s('path', { d: 'M58 54q22-26 44 0q-22-8-44 0z' }, 'brown'),
    s('path', { d: 'M46 140v-34a34 34 0 0 1 68 0v34z' }, 'pink', { accent: true }),
    ...faceDots(80, 62, 22),
    s('path', { d: 'M73 70q7 5 14 0', fill: 'none', 'stroke-width': 3, 'stroke-linecap': 'round' }, 'red', { stroke: true })
  ],
  'niño': [
    ...person(70, 70, 20, 'red', 'brown', 52, { accent: true }),
    s('circle', { cx: 126, cy: 124, r: 16 }, 'yellow'),
    s('path', { d: 'M112 124h28M126 110v28', fill: 'none', 'stroke-width': 3 }, 'orange', { stroke: true }),
    ...faceDots(70, 72, 20)
  ],
  chico: [
    s('rect', { x: 92, y: 84, width: 36, height: 48, rx: 10 }, 'orange'),
    ...person(70, 56, 20, 'blue', 'dark', 78, { accent: true }),
    s('path', { d: 'M48 54a22 22 0 0 1 44 0z' }, 'red'),
    s('rect', { x: 84, y: 50, width: 26, height: 6, rx: 3 }, 'red'),
    ...faceDots(70, 62, 20)
  ],
  'bebé': [
    s('ellipse', { cx: 80, cy: 124, rx: 34, ry: 22 }, 'sky', { accent: true }),
    s('circle', { cx: 80, cy: 72, r: 42 }, 'skin'),
    s('path', { d: 'M74 32q6-10 12 0q-6 4-12 0z' }, 'brown'),
    s('circle', { cx: 64, cy: 72, r: 5 }, 'dark'), s('circle', { cx: 96, cy: 72, r: 5 }, 'dark'),
    s('circle', { cx: 80, cy: 92, r: 9 }, 'pink'),
    s('circle', { cx: 52, cy: 86, r: 6, opacity: 0.6 }, 'pink', { flatOnly: true }),
    s('circle', { cx: 108, cy: 86, r: 6, opacity: 0.6 }, 'pink', { flatOnly: true })
  ],
  joven: [
    ...person(70, 56, 20, 'purple', 'dark', 60, { accent: true }),
    stroke('M46 56a24 24 0 0 1 48 0', 'dark', 5),
    s('circle', { cx: 46, cy: 58, r: 7 }, 'yellow'), s('circle', { cx: 94, cy: 58, r: 7 }, 'yellow'),
    s('rect', { x: 26, y: 134, width: 108, height: 8, rx: 4 }, 'brown'),
    s('circle', { cx: 44, cy: 148, r: 6 }, 'dark'), s('circle', { cx: 116, cy: 148, r: 6 }, 'dark')
  ],
  'señor': [
    ...person(80, 56, 24, 'dark', 'gray', 70, { accent: true }),
    s('path', { d: 'M56 54q24-12 48 0z' }, 'dark'),
    s('rect', { x: 62, y: 42, width: 36, height: 12, rx: 4 }, 'dark'),
    s('path', { d: 'M68 70q12 8 24 0q-4 8-12 6q-8 2-12-6z' }, 'gray'),
    ...faceDots(80, 58, 24),
    s('path', { d: 'M72 90l8 8 8-8z' }, 'red')
  ],
  'señora': [
    s('circle', { cx: 80, cy: 28, r: 12 }, 'gray'),
    ...person(80, 58, 24, 'purple', 'gray', 68, { accent: true }),
    s('path', { d: 'M62 94q18 16 36 0', fill: 'none', 'stroke-width': 4, 'stroke-dasharray': '1 6', 'stroke-linecap': 'round' }, 'white', { stroke: true, lineColor: 'dark' }),
    s('circle', { cx: 70, cy: 61, r: 6, fill: 'none', 'stroke-width': 2 }, 'dark', { stroke: true }),
    s('circle', { cx: 90, cy: 61, r: 6, fill: 'none', 'stroke-width': 2 }, 'dark', { stroke: true })
  ],
  amigo: [
    ...person(46, 56, 18, 'blue', 'brown', 70),
    ...person(114, 56, 18, 'green', 'dark', 70),
    stroke('M54 100q26 14 52 0', 'skin', 9),
    heart(80, 34, 0.8, 'red')
  ],
  novio: [
    ...person(80, 56, 22, 'dark', 'brown', 80, { accent: true }),
    s('path', { d: 'M80 82l-12-10v30zM80 82l12-10v30z' }, 'white'),
    s('path', { d: 'M72 82h16l-4 8h-8z' }, 'red'),
    ...faceDots(80, 58, 22),
    s('path', { d: 'M72 66q8 6 16 0', fill: 'none', 'stroke-width': 3, 'stroke-linecap': 'round' }, 'dark', { stroke: true }),
    s('circle', { cx: 120, cy: 100, r: 10, fill: 'none', 'stroke-width': 4 }, 'yellow', { stroke: true })
  ],
  familia: [
    ...person(46, 48, 14, 'blue', 'dark', 78),
    ...person(112, 48, 14, 'pink', 'brown', 78),
    s('rect', { x: 62, y: 98, width: 28, height: 44, rx: 12 }, 'green', { accent: true }),
    s('circle', { cx: 76, cy: 84, r: 11 }, 'skin'),
    s('rect', { x: 124, y: 106, width: 24, height: 36, rx: 10 }, 'orange'),
    s('circle', { cx: 136, cy: 94, r: 9 }, 'skin')
  ],
  padre: [
    ...person(60, 56, 22, 'blue', 'dark', 80, { accent: true }),
    s('circle', { cx: 116, cy: 90, r: 12 }, 'skin'),
    s('rect', { x: 102, y: 102, width: 28, height: 36, rx: 12 }, 'yellow'),
    stroke('M84 100q12 6 20 0', 'skin', 8),
    ...faceDots(60, 58, 22)
  ],
  madre: [
    s('path', { d: 'M40 138v-36a34 34 0 0 1 68 0v36z' }, 'pink', { accent: true }),
    s('circle', { cx: 74, cy: 58, r: 22 }, 'skin'),
    s('path', { d: 'M51 58q23-30 46 0q-6-12-23-10q-17-2-23 10z' }, 'brown'),
    s('ellipse', { cx: 118, cy: 100, rx: 20, ry: 24 }, 'cream'),
    s('circle', { cx: 118, cy: 88, r: 13 }, 'skin'),
    stroke('M84 98q16 12 22 4', 'skin', 8),
    ...faceDots(74, 62, 22)
  ],
  hijo: [
    ...person(54, 50, 18, 'blue', 'dark', 84),
    ...person(112, 90, 14, 'green', 'brown', 50, { accent: true }),
    stroke('M68 106q18 8 32 0', 'skin', 7),
    heart(112, 54, 0.6, 'red')
  ],
  abuelo: [
    stroke('M118 82v56', 'brown', 6),
    stroke('M118 82q0-8 -8-8', 'brown', 6),
    ...person(76, 54, 24, 'green', 'white', 76, { accent: true }),
    s('path', { d: 'M54 50q6-24 22-24q16 0 22 24q-10-14-22-14q-12 0-22 14z' }, 'gray'),
    s('circle', { cx: 66, cy: 58, r: 7, fill: 'none', 'stroke-width': 2.5 }, 'dark', { stroke: true }),
    s('circle', { cx: 86, cy: 58, r: 7, fill: 'none', 'stroke-width': 2.5 }, 'dark', { stroke: true })
  ],
  nieto: [
    ...person(54, 46, 20, 'gray', 'gray', 90),
    ...person(116, 94, 14, 'orange', 'brown', 46, { accent: true }),
    stroke('M70 104q18 6 32 0', 'skin', 7),
    ...faceDots(54, 48, 20)
  ],
  esposo: [
    ...person(70, 54, 22, 'dark', 'brown', 84, { accent: true }),
    s('path', { d: 'M70 80l-12-10v30zM70 80l12-10v30z' }, 'white'),
    ...faceDots(70, 56, 22),
    s('circle', { cx: 120, cy: 100, r: 16, fill: 'none', 'stroke-width': 7 }, 'yellow', { stroke: true }),
    s('path', { d: 'M120 78l5 8h-10z' }, 'sky')
  ],
  vecino: [
    s('rect', { x: 6, y: 74, width: 52, height: 62, rx: 3 }, 'cream'),
    s('path', { d: 'M0 78 32 44l32 34z' }, 'red', { accent: true }),
    s('rect', { x: 102, y: 74, width: 52, height: 62, rx: 3 }, 'cream'),
    s('path', { d: 'M96 78l32-34 32 34z' }, 'blue'),
    ...person(80, 76, 14, 'green', 'brown', 52),
    stroke('M96 100l14-12', 'skin', 7)
  ],
  nombre: [
    s('rect', { x: 20, y: 36, width: 120, height: 88, rx: 10 }, 'white', { accent: true }),
    s('path', { d: 'M20 46a10 10 0 0 1 10-10h100a10 10 0 0 1 10 10v22H20z' }, 'red'),
    s('circle', { cx: 80, cy: 52, r: 5 }, 'white'),
    stroke('M38 92h84M38 108h52', 'dark', 6)
  ],
  edad: [
    s('rect', { x: 34, y: 100, width: 92, height: 36, rx: 6 }, 'pink', { accent: true }),
    s('rect', { x: 44, y: 70, width: 72, height: 32, rx: 6 }, 'cream'),
    stroke('M34 104q12 10 23 0t23 0 23 0 23 0', 'white', 5),
    s('rect', { x: 62, y: 46, width: 6, height: 24, rx: 2 }, 'blue'),
    s('rect', { x: 77, y: 46, width: 6, height: 24, rx: 2 }, 'green'),
    s('rect', { x: 92, y: 46, width: 6, height: 24, rx: 2 }, 'orange'),
    s('path', { d: 'M65 28q-6 10 0 14q6-4 0-14zM80 28q-6 10 0 14q6-4 0-14zM95 28q-6 10 0 14q6-4 0-14z' }, 'yellow')
  ],
  pareja: [
    ...person(48, 62, 17, 'blue', 'dark', 66),
    ...person(112, 62, 17, 'pink', 'brown', 66),
    heart(80, 40, 1, 'red'),
    stroke('M60 108q20 10 40 0', 'skin', 8)
  ],
  invitado: [
    s('rect', { x: 8, y: 20, width: 56, height: 118, rx: 4 }, 'brown'),
    s('circle', { cx: 54, cy: 82, r: 4 }, 'yellow'),
    ...person(104, 56, 18, 'purple', 'dark', 70, { accent: true }),
    s('rect', { x: 86, y: 106, width: 36, height: 28, rx: 3 }, 'red'),
    s('path', { d: 'M104 106v28M86 120h36', fill: 'none', 'stroke-width': 4 }, 'yellow', { stroke: true })
  ],
  grupo: [
    s('circle', { cx: 80, cy: 80, r: 62, fill: 'none', 'stroke-width': 4, 'stroke-dasharray': '8 8' }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 50, r: 16 }, 'blue', { accent: true }),
    s('circle', { cx: 50, cy: 92, r: 16 }, 'green'),
    s('circle', { cx: 110, cy: 92, r: 16 }, 'orange'),
    s('circle', { cx: 80, cy: 114, r: 12 }, 'pink'),
    s('circle', { cx: 80, cy: 80, r: 9 }, 'yellow')
  ],
  extranjero: [
    ...person(54, 54, 20, 'blue', 'dark', 76, { accent: true }),
    s('rect', { x: 92, y: 96, width: 40, height: 34, rx: 5 }, 'brown'),
    stroke('M104 96v-8h16v8', 'dark', 4),
    s('rect', { x: 92, y: 108, width: 40, height: 5 }, 'yellow'),
    stroke('M96 30q20-16 50 4', 'gray', 3, { 'stroke-dasharray': '6 6' }),
    s('path', { d: 'M146 34l-14-8 2 6-8 4 8 2z' }, 'sky')
  ],
  mundo: [
    s('circle', { cx: 80, cy: 80, r: 58 }, 'blue', { accent: true }),
    s('path', { d: 'M46 52q16-10 28 0q4 16-8 22q-16 4-20-8z' }, 'green'),
    s('path', { d: 'M92 80q16-6 26 6q-2 20-16 30q-12-8-10-36z' }, 'green'),
    s('path', { d: 'M36 100q10 8 16 18q-10-2-16-18z' }, 'green'),
    stroke('M80 22v116M22 80h116', 'white', 2, { opacity: 0.6 }, { lineColor: 'dark' })
  ],
  nacionalidad: [
    s('rect', { x: 30, y: 20, width: 100, height: 124, rx: 10 }, 'navy', { accent: true }),
    s('circle', { cx: 80, cy: 64, r: 26, fill: 'none', 'stroke-width': 4 }, 'yellow', { stroke: true }),
    stroke('M54 64h52M80 38q-14 26 0 52M80 38q14 26 0 52', 'yellow', 3),
    stroke('M50 110h60M58 124h44', 'sky', 5)
  ]
};
