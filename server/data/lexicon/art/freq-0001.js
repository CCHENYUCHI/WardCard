// Illustration specs for common words, batch 0001 (see server/scripts/lexicon/art.js)
const { s } = require('../../../scripts/lexicon/art');

const SW = (w, extra = {}) => ({ fill: 'none', 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra });
const ground = (y = 136) => s('path', { d: `M14 ${y}h132`, ...SW(4) }, 'gray', { stroke: true });
// A standing person: round head and rounded body, feet at y = foot
const person = (cx, foot, color, { h = 44, w = 30, r = 12, accent = false } = {}) => [
  s('circle', { cx, cy: foot - h - r - 2, r }, 'skin'),
  s('rect', { x: cx - w / 2, y: foot - h, width: w, height: h, rx: w / 3 }, color, accent ? { accent: true } : {})
];
// A person in a dress (triangle skirt) with a bow
const lady = (cx, foot, color, { accent = false } = {}) => [
  s('circle', { cx, cy: foot - 62, r: 12 }, 'skin'),
  s('path', { d: `M${cx - 8} ${foot - 50}h16l14 50h-44z` }, color, accent ? { accent: true } : {}),
  s('path', { d: `M${cx + 6} ${foot - 74}l10-6v12z` }, 'red')
];
const arrow = (d, color = 'orange', w = 6) => s('path', { d, ...SW(w) }, color, { stroke: true });
const note = (x, y, color) => [
  s('ellipse', { cx: x, cy: y, rx: 8, ry: 6 }, color, { accent: true }),
  s('path', { d: `M${x + 7} ${y}v-28l12 6`, ...SW(4) }, color, { stroke: true })
];
const flower = (cx, cy, color) => [
  s('path', { d: `M${cx} ${cy + 10}v${136 - cy - 10}`, ...SW(4) }, 'green', { stroke: true }),
  s('circle', { cx: cx - 9, cy, r: 8 }, color), s('circle', { cx: cx + 9, cy, r: 8 }, color),
  s('circle', { cx, cy: cy - 9, r: 8 }, color), s('circle', { cx, cy: cy + 9, r: 8 }, color),
  s('circle', { cx, cy, r: 6 }, 'yellow', { accent: true })
];

module.exports = {
  la: [
    ground(),
    ...lady(80, 136, 'pink', { accent: true }),
    s('path', { d: 'M62 104q-14-6-16-18M98 104q14-6 16-18', ...SW(5) }, 'skin', { stroke: true })
  ],
  los: [
    ground(),
    ...person(40, 136, 'blue'),
    ...person(80, 136, 'green', { accent: true }),
    ...person(120, 136, 'blue'),
    s('circle', { cx: 80, cy: 34, r: 14 }, 'white'),
    s('circle', { cx: 80, cy: 34, r: 14, ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 27l7 5-3 8h-8l-3-8z' }, 'dark')
  ],
  del: [
    s('rect', { x: 18, y: 56, width: 52, height: 48, rx: 10 }, 'blue'),
    s('rect', { x: 90, y: 56, width: 52, height: 48, rx: 10 }, 'green'),
    s('circle', { cx: 70, cy: 80, r: 10 }, 'blue'),
    s('circle', { cx: 90, cy: 80, r: 10 }, 'white'),
    arrow('M40 128h80m-12-10 12 10-12 10', 'orange', 5),
    s('rect', { x: 50, y: 22, width: 60, height: 22, rx: 11 }, 'yellow', { accent: true })
  ],
  las: [
    ground(),
    ...flower(40, 70, 'pink'),
    ...flower(80, 54, 'purple'),
    ...flower(120, 70, 'red')
  ],
  una: [
    s('path', { d: 'M80 52c-14-14-50-8-50 30 0 30 22 54 38 54 6 0 8-3 12-3s6 3 12 3c16 0 38-24 38-54 0-38-36-44-50-30z' }, 'red', { accent: true }),
    s('path', { d: 'M80 52c0-12 4-22 12-28', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M86 34c10-12 26-12 32-6-8 10-22 12-32 6z' }, 'green'),
    s('ellipse', { cx: 54, cy: 74, rx: 6, ry: 10, opacity: 0.5 }, 'white', { flatOnly: true })
  ],
  al: [
    ground(),
    ...person(32, 136, 'blue', { accent: true }),
    arrow('M54 104h40m-12-12 12 12-12 12'),
    s('rect', { x: 102, y: 92, width: 40, height: 44 }, 'cream'),
    s('path', { d: 'M96 94l26-24 26 24z' }, 'red'),
    s('rect', { x: 116, y: 114, width: 12, height: 22 }, 'brown')
  ],
  sus: [
    ground(),
    ...person(46, 136, 'blue'),
    ...person(84, 136, 'pink'),
    s('rect', { x: 104, y: 104, width: 22, height: 32, rx: 4 }, 'orange', { accent: true }),
    s('rect', { x: 128, y: 112, width: 18, height: 24, rx: 4 }, 'green'),
    s('rect', { x: 14, y: 110, width: 18, height: 26, rx: 4 }, 'purple'),
    s('path', { d: 'M110 104a5 5 0 0 1 10 0', ...SW(3) }, 'dark', { stroke: true })
  ],
  esta: [
    ground(),
    ...lady(106, 136, 'purple', { accent: true }),
    s('circle', { cx: 36, cy: 88, r: 14 }, 'skin'),
    s('path', { d: 'M50 84h26', ...SW(8) }, 'skin', { stroke: true }),
    s('rect', { x: 22, y: 102, width: 28, height: 34, rx: 6 }, 'blue')
  ],
  'ése': [
    ground(),
    ...person(34, 136, 'blue'),
    s('path', { d: 'M48 100h30', ...SW(7) }, 'skin', { stroke: true }),
    s('rect', { x: 108, y: 96, width: 34, height: 40, rx: 4 }, 'orange', { accent: true }),
    s('path', { d: 'M108 96l17-12 17 12', ...SW(4) }, 'brown', { stroke: true }),
    s('path', { d: 'M84 92l8 8-8 8', ...SW(4) }, 'gray', { stroke: true })
  ],
  hace: [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'white'),
    s('circle', { cx: 80, cy: 80, r: 56, ...SW(6) }, 'blue', { stroke: true }),
    s('path', { d: 'M80 80V44M80 80l-24 14', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M40 30a62 62 0 0 0-18 30m-6-12 6 12 12-4', ...SW(6) }, 'orange', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 80, r: 5 }, 'red')
  ],
  donde: [
    s('rect', { x: 14, y: 30, width: 132, height: 100, rx: 10 }, 'mint'),
    s('path', { d: 'M14 96q40-20 70 0t62-6', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M40 40v80M100 40v80', ...SW(3) }, 'white', { stroke: true }),
    s('path', { d: 'M96 112c-12-18-22-28-22-42a22 22 0 0 1 44 0c0 14-10 24-22 42z' }, 'red', { accent: true }),
    s('circle', { cx: 96, cy: 70, r: 8 }, 'white')
  ],
  tan: [
    s('rect', { x: 18, y: 104, width: 22, height: 32, rx: 4 }, 'sky'),
    s('rect', { x: 50, y: 78, width: 22, height: 58, rx: 4 }, 'blue'),
    s('rect', { x: 82, y: 50, width: 22, height: 86, rx: 4 }, 'navy'),
    s('rect', { x: 114, y: 18, width: 26, height: 118, rx: 4 }, 'red', { accent: true }),
    s('path', { d: 'M14 138h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  e: [
    s('circle', { cx: 50, cy: 80, r: 30 }, 'blue', { accent: true }),
    s('circle', { cx: 110, cy: 80, r: 30 }, 'yellow'),
    s('path', { d: 'M80 66v28M66 80h28', ...SW(8) }, 'dark', { stroke: true })
  ],
  esa: [
    ground(),
    ...person(34, 136, 'blue'),
    s('path', { d: 'M48 100h30', ...SW(7) }, 'skin', { stroke: true }),
    ...lady(122, 136, 'pink', { accent: true }),
    s('path', { d: 'M84 92l8 8-8 8', ...SW(4) }, 'gray', { stroke: true })
  ],
  estado: [
    s('path', { d: 'M28 40l40-12 36 10 30-6-6 40 8 34-38 14-34-6-30 10 4-40z' }, 'mint'),
    s('path', { d: 'M28 40l40-12 36 10 30-6-6 40 8 34-38 14-34-6-30 10 4-40z', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M76 112V56', ...SW(4) }, 'dark', { stroke: true }),
    s('path', { d: 'M76 56h34l-8 10 8 10H76z' }, 'red', { accent: true })
  ],
  les: [
    ground(),
    ...person(30, 136, 'green', { accent: true }),
    s('rect', { x: 52, y: 84, width: 22, height: 18, rx: 3 }, 'red'),
    s('path', { d: 'M52 90h22M63 84v18', ...SW(2) }, 'yellow', { stroke: true }),
    arrow('M80 94h16m-8-8 8 8-8 8', 'orange', 4),
    ...person(112, 136, 'blue'),
    ...person(140, 136, 'pink', { w: 22, r: 10 })
  ],
  mas: [
    s('path', { d: 'M20 80h52', ...SW(10) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M72 80q14 0 22-18', ...SW(10) }, 'green', { stroke: true }),
    s('path', { d: 'M86 58l14-4-2 14', ...SW(6) }, 'green', { stroke: true }),
    s('circle', { cx: 122, cy: 88, r: 24 }, 'red'),
    s('rect', { x: 106, y: 83, width: 32, height: 10, rx: 2 }, 'white')
  ],
  gran: [
    ground(),
    s('path', { d: 'M40 136V64l40-34 40 34v72z' }, 'cream'),
    s('path', { d: 'M30 66l50-44 50 44', ...SW(6) }, 'red', { stroke: true, accent: true }),
    s('rect', { x: 50, y: 74, width: 10, height: 50 }, 'gray'), s('rect', { x: 75, y: 74, width: 10, height: 50 }, 'gray'), s('rect', { x: 100, y: 74, width: 10, height: 50 }, 'gray'),
    ...person(140, 136, 'blue', { h: 20, w: 12, r: 6 })
  ]
};
