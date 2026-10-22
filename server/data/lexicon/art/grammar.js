// Illustration specs for the grammar (功能詞) theme (see server/scripts/lexicon/art.js)
const { s } = require("../../../scripts/lexicon/art");

const ground = (y = 134) => s('path', { d: `M14 ${y}h132`, fill: 'none', 'stroke-width': 4, 'stroke-linecap': 'round' }, 'gray', { stroke: true });
const shine = (cx, cy) => s('circle', { cx, cy, r: 5, opacity: 0.6 }, 'white', { flatOnly: true });

module.exports = {
  cerca: [
    ground(),
    s('rect', { x: 26, y: 76, width: 64, height: 58, rx: 3 }, 'cream'),
    s('path', { d: 'M16 80 58 42l42 38z', 'stroke-linejoin': 'round' }, 'red'),
    s('rect', { x: 50, y: 104, width: 16, height: 30, rx: 2 }, 'brown'),
    s('circle', { cx: 118, cy: 84, r: 13 }, 'skin'),
    s('rect', { x: 103, y: 99, width: 30, height: 35, rx: 12 }, 'blue', { accent: true })
  ],
  lejos: [
    s('rect', { x: 14, y: 84, width: 132, height: 54, rx: 8 }, 'mint'),
    s('path', { d: 'M48 138h64L84 84h-8z', 'stroke-linejoin': 'round' }, 'gray'),
    s('path', { d: 'M80 132v-12M80 110v-8M80 95v-4', fill: 'none', 'stroke-width': 3, 'stroke-linecap': 'round' }, 'white', { stroke: true }),
    s('rect', { x: 74, y: 70, width: 12, height: 12 }, 'cream'),
    s('path', { d: 'M71 72l9-9 9 9z' }, 'red', { accent: true }),
    s('circle', { cx: 34, cy: 98, r: 9 }, 'skin'),
    s('rect', { x: 24, y: 108, width: 20, height: 26, rx: 8 }, 'blue'),
    s('circle', { cx: 122, cy: 40, r: 14 }, 'yellow')
  ],
  arriba: [
    ground(136),
    s('path', { d: 'M20 136v-20h20V96h20V76h20V56h20v80z', 'stroke-linejoin': 'round' }, 'tan'),
    s('circle', { cx: 90, cy: 42, r: 14 }, 'red', { accent: true }),
    shine(85, 37),
    s('path', { d: 'M128 128V52', fill: 'none', 'stroke-width': 6, 'stroke-linecap': 'round' }, 'green', { stroke: true }),
    s('path', { d: 'M116 58l12-22 12 22z', 'stroke-linejoin': 'round' }, 'green', { accent: true })
  ],
  abajo: [
    ground(136),
    s('path', { d: 'M60 136v-20h20V96h20V76h20V56h20v80z', 'stroke-linejoin': 'round' }, 'tan'),
    s('circle', { cx: 34, cy: 122, r: 14 }, 'red', { accent: true }),
    shine(29, 117),
    s('path', { d: 'M34 28v62', fill: 'none', 'stroke-width': 6, 'stroke-linecap': 'round' }, 'orange', { stroke: true }),
    s('path', { d: 'M22 84l12 22 12-22z', 'stroke-linejoin': 'round' }, 'orange', { accent: true })
  ],
  dentro: [
    s('path', { d: 'M32 52 14 32h30l12 20zM128 52l18-20h-30l-12 20z', 'stroke-linejoin': 'round' }, 'tan'),
    s('rect', { x: 32, y: 52, width: 96, height: 82, rx: 3 }, 'brown'),
    s('circle', { cx: 80, cy: 92, r: 24 }, 'red', { accent: true }),
    shine(72, 84),
    s('rect', { x: 32, y: 98, width: 96, height: 36, rx: 3 }, 'tan'),
    s('path', { d: 'M48 116h64', fill: 'none', 'stroke-width': 4, 'stroke-linecap': 'round' }, 'brown', { stroke: true })
  ],
  fuera: [
    ground(),
    s('rect', { x: 16, y: 72, width: 76, height: 62, rx: 3 }, 'brown'),
    s('rect', { x: 16, y: 100, width: 76, height: 34, rx: 3 }, 'tan'),
    s('path', { d: 'M56 66C70 26 108 26 122 80', fill: 'none', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-dasharray': '8 7' }, 'dark', { stroke: true }),
    s('path', { d: 'M112 78l12 14 6-18z', 'stroke-linejoin': 'round' }, 'dark'),
    s('circle', { cx: 126, cy: 114, r: 20 }, 'red', { accent: true }),
    shine(119, 107)
  ],
  delante: [
    ground(),
    s('rect', { x: 62, y: 34, width: 74, height: 74, rx: 4 }, 'tan'),
    s('path', { d: 'M62 60h74', fill: 'none', 'stroke-width': 4 }, 'brown', { stroke: true }),
    s('circle', { cx: 60, cy: 104, r: 30 }, 'red', { accent: true }),
    shine(50, 94)
  ],
  'detrás': [
    ground(),
    s('circle', { cx: 108, cy: 62, r: 26 }, 'red', { accent: true }),
    shine(100, 52),
    s('rect', { x: 26, y: 64, width: 90, height: 70, rx: 4 }, 'tan'),
    s('path', { d: 'M26 88h90', fill: 'none', 'stroke-width': 4 }, 'brown', { stroke: true })
  ],
  encima: [
    ground(),
    s('rect', { x: 40, y: 78, width: 80, height: 56, rx: 4 }, 'tan'),
    s('path', { d: 'M40 98h80', fill: 'none', 'stroke-width': 4 }, 'brown', { stroke: true }),
    s('circle', { cx: 80, cy: 56, r: 22 }, 'red', { accent: true }),
    shine(72, 48)
  ],
  debajo: [
    ground(),
    s('rect', { x: 20, y: 52, width: 120, height: 12, rx: 3 }, 'brown'),
    s('rect', { x: 30, y: 64, width: 9, height: 70 }, 'brown'),
    s('rect', { x: 121, y: 64, width: 9, height: 70 }, 'brown'),
    s('circle', { cx: 80, cy: 112, r: 22 }, 'red', { accent: true }),
    shine(72, 104)
  ],
  entre: [
    ground(),
    s('rect', { x: 14, y: 66, width: 42, height: 68, rx: 4 }, 'tan'),
    s('rect', { x: 104, y: 66, width: 42, height: 68, rx: 4 }, 'tan'),
    s('circle', { cx: 80, cy: 114, r: 20 }, 'red', { accent: true }),
    shine(73, 107),
    s('path', { d: 'M66 54l14 14 14-14', fill: 'none', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, 'dark', { stroke: true })
  ],
  hacia: [
    s('circle', { cx: 116, cy: 80, r: 32 }, 'red', { accent: true }),
    s('circle', { cx: 116, cy: 80, r: 21 }, 'white'),
    s('circle', { cx: 116, cy: 80, r: 10 }, 'red', { accent: true }),
    s('path', { d: 'M16 80h76', fill: 'none', 'stroke-width': 6, 'stroke-linecap': 'round' }, 'dark', { stroke: true }),
    s('path', { d: 'M86 68l18 12-18 12z', 'stroke-linejoin': 'round' }, 'dark'),
    s('path', { d: 'M16 80l-4-10h10l6 10-6 10H12z', 'stroke-linejoin': 'round' }, 'yellow')
  ],
  hola: [
    s('rect', { x: 50, y: 84, width: 52, height: 54, rx: 18 }, 'orange', { accent: true }),
    s('circle', { cx: 76, cy: 58, r: 22 }, 'skin'),
    s('circle', { cx: 68, cy: 54, r: 3 }, 'dark'), s('circle', { cx: 84, cy: 54, r: 3 }, 'dark'),
    s('path', { d: 'M67 64q9 9 18 0', fill: 'none', 'stroke-width': 3, 'stroke-linecap': 'round' }, 'dark', { stroke: true }),
    s('path', { d: 'M98 96l22-36', fill: 'none', 'stroke-width': 10, 'stroke-linecap': 'round' }, 'skin', { stroke: true, lineColor: 'dark' }),
    s('circle', { cx: 122, cy: 54, r: 9 }, 'skin'),
    s('path', { d: 'M136 34q8 10 2 22M144 26q14 16 4 36', fill: 'none', 'stroke-width': 4, 'stroke-linecap': 'round' }, 'blue', { stroke: true })
  ],
  'adiós': [
    ground(),
    s('rect', { x: 26, y: 78, width: 44, height: 56, rx: 16 }, 'green', { accent: true }),
    s('circle', { cx: 48, cy: 58, r: 18 }, 'skin'),
    s('path', { d: 'M32 90 18 58', fill: 'none', 'stroke-width': 9, 'stroke-linecap': 'round' }, 'skin', { stroke: true, lineColor: 'dark' }),
    s('circle', { cx: 16, cy: 52, r: 8 }, 'skin'),
    s('rect', { x: 66, y: 106, width: 30, height: 26, rx: 4 }, 'brown'),
    s('path', { d: 'M74 106v-6h14v6', fill: 'none', 'stroke-width': 4 }, 'dark', { stroke: true }),
    s('path', { d: 'M104 120h24', fill: 'none', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-dasharray': '6 6' }, 'gray', { stroke: true }),
    s('path', { d: 'M128 110l16 10-16 10z', 'stroke-linejoin': 'round' }, 'gray')
  ]
};
