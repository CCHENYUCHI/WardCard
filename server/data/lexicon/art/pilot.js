// Illustration specs (see server/scripts/lexicon/art.js)
const { s } = require("../../../scripts/lexicon/art");

module.exports = {
  manzana: [
    s('path', { d: 'M80 54C62 38 30 44 30 80c0 34 26 56 50 48 24 8 50-14 50-48 0-36-32-42-50-26z' }, 'red', { accent: true }),
    s('path', { d: 'M79 56c0-10 2-20 6-28', fill: 'none', 'stroke-width': 5, 'stroke-linecap': 'round' }, 'brown', { stroke: true }),
    s('path', { d: 'M86 38c8-14 26-16 34-12-6 14-22 18-34 12z' }, 'green'),
    s('ellipse', { cx: 54, cy: 76, rx: 7, ry: 13, opacity: 0.45 }, 'white', { flatOnly: true })
  ],
  perro: [
    s('ellipse', { cx: 44, cy: 70, rx: 15, ry: 30, transform: 'rotate(18 44 70)' }, 'brown'),
    s('ellipse', { cx: 116, cy: 70, rx: 15, ry: 30, transform: 'rotate(-18 116 70)' }, 'brown'),
    s('circle', { cx: 80, cy: 82, r: 40 }, 'tan', { accent: true }),
    s('ellipse', { cx: 80, cy: 104, rx: 22, ry: 16 }, 'cream'),
    s('circle', { cx: 66, cy: 76, r: 5 }, 'dark'),
    s('circle', { cx: 94, cy: 76, r: 5 }, 'dark'),
    s('ellipse', { cx: 80, cy: 96, rx: 8, ry: 6 }, 'dark'),
    s('path', { d: 'M74 110q6 14 12 0z' }, 'pink')
  ],
  casa: [
    s('rect', { x: 104, y: 36, width: 12, height: 26 }, 'brown'),
    s('rect', { x: 40, y: 72, width: 80, height: 58, rx: 3 }, 'cream'),
    s('path', { d: 'M28 76 80 34l52 42z', 'stroke-linejoin': 'round' }, 'red', { accent: true }),
    s('rect', { x: 70, y: 98, width: 20, height: 32, rx: 2 }, 'brown'),
    s('rect', { x: 50, y: 86, width: 14, height: 14, rx: 2 }, 'sky'),
    s('rect', { x: 96, y: 86, width: 14, height: 14, rx: 2 }, 'sky')
  ],
  comer: [
    s('circle', { cx: 80, cy: 86, r: 42 }, 'white'),
    s('circle', { cx: 80, cy: 86, r: 30 }, 'gray', { flatOnly: true }),
    s('circle', { cx: 72, cy: 82, r: 9 }, 'green', { accent: true }),
    s('circle', { cx: 90, cy: 90, r: 9 }, 'orange', { accent: true }),
    s('circle', { cx: 78, cy: 100, r: 6 }, 'red', { accent: true }),
    s('path', { d: 'M22 50v24m-6-24v18a6 6 0 0 0 12 0V50M22 74v52', fill: 'none', 'stroke-width': 4, 'stroke-linecap': 'round' }, 'dark', { stroke: true }),
    s('path', { d: 'M138 50c8 10 8 30 0 34v42', fill: 'none', 'stroke-width': 5, 'stroke-linecap': 'round' }, 'dark', { stroke: true })
  ],
  ir: [
    s('path', { d: 'M20 120h120', fill: 'none', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-dasharray': '10 8' }, 'gray', { stroke: true }),
    s('path', { d: 'M30 70h64V50l40 30-40 30V90H30z', 'stroke-linejoin': 'round' }, 'blue', { accent: true }),
    s('ellipse', { cx: 40, cy: 136, rx: 6, ry: 9, transform: 'rotate(-70 40 136)' }, 'brown'),
    s('ellipse', { cx: 66, cy: 128, rx: 6, ry: 9, transform: 'rotate(-110 66 128)' }, 'brown'),
    s('ellipse', { cx: 92, cy: 136, rx: 6, ry: 9, transform: 'rotate(-70 92 136)' }, 'brown')
  ],
  hablar: [
    s('path', { d: 'M18 34h76a10 10 0 0 1 10 10v30a10 10 0 0 1-10 10H50l-18 16V84H18A10 10 0 0 1 8 74V44a10 10 0 0 1 10-10z' }, 'blue', { accent: true }),
    s('path', { d: 'M70 82h70a10 10 0 0 1 10 10v26a10 10 0 0 1-10 10h-8v14l-16-14H70a10 10 0 0 1-10-10V92a10 10 0 0 1 10-10z' }, 'yellow'),
    s('circle', { cx: 38, cy: 59, r: 5 }, 'white'), s('circle', { cx: 56, cy: 59, r: 5 }, 'white'), s('circle', { cx: 74, cy: 59, r: 5 }, 'white'),
    s('path', { d: 'M78 104h56M78 116h36', fill: 'none', 'stroke-width': 5, 'stroke-linecap': 'round' }, 'dark', { stroke: true })
  ],
  feliz: [
    s('circle', { cx: 80, cy: 80, r: 50 }, 'yellow', { accent: true }),
    s('path', { d: 'M56 70q8-10 16 0M88 70q8-10 16 0', fill: 'none', 'stroke-width': 5, 'stroke-linecap': 'round' }, 'dark', { stroke: true }),
    s('path', { d: 'M52 90q28 34 56 0z' }, 'dark'),
    s('path', { d: 'M64 104q16 10 32 0q-16 8-32 0z' }, 'pink', { flatOnly: true }),
    s('circle', { cx: 50, cy: 92, r: 7, opacity: 0.6 }, 'pink', { flatOnly: true }), s('circle', { cx: 110, cy: 92, r: 7, opacity: 0.6 }, 'pink', { flatOnly: true })
  ],
  agua: [
    s('path', { d: 'M80 22C64 50 44 72 44 98a36 36 0 0 0 72 0c0-26-20-48-36-76z' }, 'blue', { accent: true }),
    s('path', { d: 'M62 96a18 18 0 0 0 14 22', fill: 'none', 'stroke-width': 6, 'stroke-linecap': 'round' }, 'white', { stroke: true })
  ],
  libro: [
    s('path', { d: 'M80 46C64 36 38 34 18 38v80c20-4 46-2 62 8z', 'stroke-linejoin': 'round' }, 'cream'),
    s('path', { d: 'M80 46c16-10 42-12 62-8v80c-20-4-46-2-62 8z', 'stroke-linejoin': 'round' }, 'cream'),
    s('path', { d: 'M18 118c20-4 46-2 62 8 16-10 42-12 62-8v8c-20-4-46-2-62 8-16-10-42-12-62-8z' }, 'green', { accent: true }),
    s('path', { d: 'M32 58h34M32 72h34M32 86h28M94 58h34M94 72h34M94 86h28', fill: 'none', 'stroke-width': 3, 'stroke-linecap': 'round' }, 'gray', { stroke: true }),
    s('path', { d: 'M80 46v80', fill: 'none', 'stroke-width': 2 }, 'gray', { stroke: true })
  ],
  ventana: [
    s('rect', { x: 34, y: 30, width: 92, height: 100, rx: 4 }, 'sky', { accent: true }),
    s('path', { d: 'M80 30v100M34 80h92', fill: 'none', 'stroke-width': 6 }, 'white', { stroke: true, lineColor: 'dark' }),
    s('path', { d: 'M34 30c18 20 18 60 6 100h-6z' }, 'red'),
    s('path', { d: 'M126 30c-18 20-18 60-6 100h6z' }, 'red'),
    s('path', { d: 'M8 60q14-8 26 0M2 78q16-8 32 0M10 96q12-8 24 0', fill: 'none', 'stroke-width': 4, 'stroke-linecap': 'round' }, 'blue', { stroke: true }),
    s('rect', { x: 28, y: 128, width: 104, height: 8, rx: 3 }, 'brown')
  ],
  'mañana': [
    s('circle', { cx: 80, cy: 104, r: 34 }, 'orange', { accent: true }),
    s('path', { d: 'M80 52v-14M44 68 34 58M116 68l10-10M30 100H16M144 100h-14', fill: 'none', 'stroke-width': 5, 'stroke-linecap': 'round' }, 'yellow', { stroke: true }),
    s('path', { d: 'M0 112q40-18 80 0t80 0v48H0z' }, 'green'),
    s('path', { d: 'M0 132q50-14 100 0t60-4v32H0z', opacity: 0.8 }, 'mint', { flatOnly: true })
  ],
  hermano: [
    s('circle', { cx: 56, cy: 50, r: 18 }, 'skin'),
    s('path', { d: 'M28 132v-40a28 28 0 0 1 56 0v40z' }, 'blue', { accent: true }),
    s('circle', { cx: 112, cy: 72, r: 14 }, 'skin'),
    s('path', { d: 'M90 132v-28a22 22 0 0 1 44 0v28z' }, 'green'),
    s('path', { d: 'M38 46q18-18 36 0z' }, 'brown'),
    s('path', { d: 'M98 68q14-14 28 0z' }, 'brown'),
    s('path', { d: 'M84 108q4-6 8 0', fill: 'none', 'stroke-width': 4, 'stroke-linecap': 'round' }, 'skin', { stroke: true })
  ],
  trabajo: [
    s('path', { d: 'M62 48v-8a6 6 0 0 1 6-6h24a6 6 0 0 1 6 6v8', fill: 'none', 'stroke-width': 7 }, 'dark', { stroke: true }),
    s('rect', { x: 24, y: 48, width: 112, height: 78, rx: 10 }, 'brown', { accent: true }),
    s('path', { d: 'M24 80h112', fill: 'none', 'stroke-width': 4 }, 'dark', { stroke: true }),
    s('rect', { x: 72, y: 74, width: 16, height: 14, rx: 2 }, 'yellow')
  ],
  grande: [
    s('rect', { x: 52, y: 26, width: 92, height: 108, rx: 10 }, 'blue', { accent: true }),
    s('rect', { x: 14, y: 106, width: 26, height: 28, rx: 5 }, 'yellow'),
    s('path', { d: 'M8 140h144', fill: 'none', 'stroke-width': 4, 'stroke-linecap': 'round' }, 'gray', { stroke: true }),
    s('path', { d: 'M98 46v68m-10-58 10-10 10 10m-20 48 10 10 10-10', fill: 'none', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, 'white', { stroke: true, lineColor: 'dark' })
  ],
  'azúcar': [
    s('path', { d: 'M30 92l30-14 30 14v34l-30 14-30-14z' }, 'cream'),
    s('path', { d: 'M30 92l30 14 30-14M60 106v34', fill: 'none', 'stroke-width': 3 }, 'gray', { stroke: true }),
    s('path', { d: 'M76 58l30-14 30 14v34l-30 14-30-14z' }, 'cream'),
    s('path', { d: 'M76 58l30 14 30-14M106 72v34', fill: 'none', 'stroke-width': 3 }, 'gray', { stroke: true }),
    s('circle', { cx: 112, cy: 128, r: 4 }, 'yellow', { accent: true }), s('circle', { cx: 128, cy: 120, r: 3 }, 'yellow', { accent: true }),
    s('circle', { cx: 120, cy: 138, r: 3 }, 'yellow', { accent: true }), s('circle', { cx: 40, cy: 60, r: 3 }, 'yellow', { accent: true })
  ],
  azul: [
    s('path', { d: 'M50 40h60l26 30-56 64-56-64z', 'stroke-linejoin': 'round' }, 'navy', { accent: true }),
    s('path', { d: 'M24 70h112M50 40l14 30 16-30 16 30 14-30M64 70l16 64 16-64', fill: 'none', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, 'sky', { stroke: true }),
    s('circle', { cx: 66, cy: 92, r: 2.5 }, 'yellow'), s('circle', { cx: 92, cy: 84, r: 2 }, 'yellow'), s('circle', { cx: 84, cy: 108, r: 2.5 }, 'yellow')
  ],
  'ojalá': [
    s('path', { d: 'M96 30l9 20 22 3-16 15 4 22-19-11-19 11 4-22-16-15 22-3z', 'stroke-linejoin': 'round' }, 'yellow', { accent: true }),
    s('path', { d: 'M74 68 22 120M84 80 46 132M62 60 20 96', fill: 'none', 'stroke-width': 4, 'stroke-linecap': 'round' }, 'sky', { stroke: true }),
    s('path', { d: 'M132 104l3 7 7 3-7 3-3 7-3-7-7-3 7-3zM40 34l2 5 5 2-5 2-2 5-2-5-5-2 5-2z' }, 'orange')
  ],
  preocupar: [
    s('circle', { cx: 80, cy: 96, r: 42 }, 'skin'),
    s('path', { d: 'M58 86l14 4M102 86l-14 4', fill: 'none', 'stroke-width': 4, 'stroke-linecap': 'round' }, 'dark', { stroke: true }),
    s('circle', { cx: 66, cy: 98, r: 4 }, 'dark'), s('circle', { cx: 94, cy: 98, r: 4 }, 'dark'),
    s('path', { d: 'M68 120q12-8 24 0', fill: 'none', 'stroke-width': 4, 'stroke-linecap': 'round' }, 'dark', { stroke: true }),
    s('path', { d: 'M46 52a14 14 0 0 1 22-14 16 16 0 0 1 30 2 12 12 0 0 1 8 22H50a10 10 0 0 1-4-10z' }, 'gray', { accent: true }),
    s('path', { d: 'M62 66l-4 8M80 66l-4 8M98 66l-4 8', fill: 'none', 'stroke-width': 3, 'stroke-linecap': 'round' }, 'blue', { stroke: true })
  ],
  de: [
    s('rect', { x: 14, y: 56, width: 48, height: 48, rx: 8 }, 'blue', { accent: true }),
    s('circle', { cx: 122, cy: 80, r: 26 }, 'yellow'),
    s('path', { d: 'M64 80h28m-8-10 10 10-10 10', fill: 'none', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, 'dark', { stroke: true })
  ],
  muy: [
    s('rect', { x: 26, y: 100, width: 26, height: 34, rx: 4 }, 'mint'),
    s('rect', { x: 67, y: 70, width: 26, height: 64, rx: 4 }, 'green'),
    s('rect', { x: 108, y: 30, width: 26, height: 104, rx: 4 }, 'green', { accent: true }),
    s('path', { d: 'M18 140h124', fill: 'none', 'stroke-width': 4, 'stroke-linecap': 'round' }, 'gray', { stroke: true })
  ]
};
