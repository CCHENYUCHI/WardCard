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
  mas: [
    s('path', { d: 'M20 80h52', ...SW(10) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M72 80q14 0 22-18', ...SW(10) }, 'green', { stroke: true }),
    s('path', { d: 'M86 58l14-4-2 14', ...SW(6) }, 'green', { stroke: true }),
    s('circle', { cx: 122, cy: 88, r: 24 }, 'red'),
    s('rect', { x: 106, y: 83, width: 32, height: 10, rx: 2 }, 'white')
  ],
  crear: [
    s('rect', { x: 30, y: 98, width: 100, height: 38, rx: 6 }, 'tan'),
    s('path', { d: 'M52 98V66h56v32', ...SW(5) }, 'blue', { stroke: true }),
    s('path', { d: 'M80 20l6 14 14 2-10 10 2 14-12-6-12 6 2-14-10-10 14-2z' }, 'yellow', { accent: true }),
    s('path', { d: 'M38 54l-10-6M122 54l10-6M80 8v4', ...SW(4) }, 'orange', { stroke: true })
  ],
  'sólo': [
    s('rect', { x: 14, y: 110, width: 132, height: 26, rx: 4 }, 'mint'),
    ...person(80, 116, 'red', { accent: true }),
    s('circle', { cx: 120, cy: 34, r: 12 }, 'cream'),
    s('path', { d: 'M24 40l6 6M30 40l-6 6', ...SW(2) }, 'gray', { stroke: true })
  ],
  gobierno: [
    ground(),
    s('rect', { x: 26, y: 70, width: 108, height: 66 }, 'cream'),
    s('path', { d: 'M48 70a32 32 0 0 1 64 0z' }, 'gray'),
    s('rect', { x: 36, y: 82, width: 10, height: 48 }, 'white'), s('rect', { x: 62, y: 82, width: 10, height: 48 }, 'white'),
    s('rect', { x: 88, y: 82, width: 10, height: 48 }, 'white'), s('rect', { x: 114, y: 82, width: 10, height: 48 }, 'white'),
    s('path', { d: 'M80 38V16', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M80 16h22l-6 6 6 6H80z' }, 'red', { accent: true })
  ],
  estos: [
    s('rect', { x: 14, y: 110, width: 132, height: 10, rx: 3 }, 'brown'),
    s('rect', { x: 36, y: 72, width: 22, height: 38, rx: 3 }, 'blue', { accent: true }),
    s('rect', { x: 62, y: 66, width: 22, height: 44, rx: 3 }, 'green'),
    s('rect', { x: 88, y: 76, width: 22, height: 34, rx: 3 }, 'red'),
    s('path', { d: 'M30 60h86', ...SW(4) }, 'orange', { stroke: true }),
    s('path', { d: 'M126 140l-6-24 18 8z' }, 'skin')
  ],
  estas: [
    s('rect', { x: 14, y: 116, width: 132, height: 10, rx: 3 }, 'brown'),
    s('path', { d: 'M40 116l-6-30h24l-6 30z' }, 'pink', { accent: true }),
    s('path', { d: 'M74 116l-6-36h24l-6 36z' }, 'purple'),
    s('path', { d: 'M108 116l-6-28h24l-6 28z' }, 'yellow'),
    s('circle', { cx: 46, cy: 76, r: 8 }, 'red'), s('circle', { cx: 80, cy: 70, r: 8 }, 'pink'), s('circle', { cx: 114, cy: 78, r: 8 }, 'orange')
  ],
  quien: [
    s('circle', { cx: 80, cy: 58, r: 26 }, 'gray'),
    s('rect', { x: 50, y: 88, width: 60, height: 48, rx: 20 }, 'gray'),
    s('path', { d: 'M70 50a10 10 0 1 1 14 9c-4 2-4 5-4 9', ...SW(6) }, 'white', { stroke: true }),
    s('circle', { cx: 80, cy: 76, r: 3.5 }, 'white'),
    s('circle', { cx: 128, cy: 40, r: 14 }, 'yellow', { accent: true })
  ],
  caso: [
    s('rect', { x: 34, y: 22, width: 92, height: 116, rx: 6 }, 'tan'),
    s('rect', { x: 46, y: 36, width: 68, height: 92, rx: 3 }, 'white'),
    s('path', { d: 'M56 56h48M56 72h48M56 88h30', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 104, cy: 106, r: 16, ...SW(6) }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M116 118l14 14', ...SW(8) }, 'blue', { stroke: true })
  ],
  nacional: [
    s('path', { d: 'M40 136V24', ...SW(5) }, 'dark', { stroke: true }),
    s('path', { d: 'M42 28h92v60H42z' }, 'red', { accent: true }),
    s('rect', { x: 42, y: 48, width: 92, height: 20 }, 'yellow'),
    s('circle', { cx: 70, cy: 58, r: 7 }, 'red'),
    s('path', { d: 'M20 136h44', ...SW(6) }, 'gray', { stroke: true })
  ],
  general: [
    ...person(40, 132, 'blue', { h: 30, w: 20, r: 9 }),
    ...person(64, 132, 'red', { h: 30, w: 20, r: 9 }),
    ...person(88, 132, 'green', { h: 30, w: 20, r: 9 }),
    ...person(112, 132, 'yellow', { h: 30, w: 20, r: 9 }),
    s('path', { d: 'M24 64q56-46 112 0', ...SW(6) }, 'purple', { stroke: true, accent: true })
  ],
  tal: [
    s('rect', { x: 18, y: 50, width: 52, height: 60, rx: 8 }, 'blue', { accent: true }),
    s('rect', { x: 90, y: 50, width: 52, height: 60, rx: 8 }, 'blue'),
    s('circle', { cx: 44, cy: 80, r: 12 }, 'yellow'), s('circle', { cx: 116, cy: 80, r: 12 }, 'yellow'),
    s('path', { d: 'M74 74h12M74 86h12', ...SW(4) }, 'dark', { stroke: true })
  ],
  do: [
    s('path', { d: 'M16 50h128M16 66h128M16 82h128M16 98h128M16 114h128', ...SW(2) }, 'gray', { stroke: true }),
    s('path', { d: 'M40 130h36', ...SW(3) }, 'dark', { stroke: true }),
    s('ellipse', { cx: 58, cy: 130, rx: 12, ry: 9 }, 'blue', { accent: true }),
    s('path', { d: 'M69 130V70', ...SW(4) }, 'blue', { stroke: true }),
    s('ellipse', { cx: 108, cy: 106, rx: 12, ry: 9 }, 'purple'),
    s('path', { d: 'M119 106V50', ...SW(4) }, 'purple', { stroke: true })
  ],
  cual: [
    s('rect', { x: 14, y: 52, width: 38, height: 56, rx: 8 }, 'red'),
    s('rect', { x: 61, y: 52, width: 38, height: 56, rx: 8 }, 'blue', { accent: true }),
    s('rect', { x: 108, y: 52, width: 38, height: 56, rx: 8 }, 'green'),
    s('path', { d: 'M72 32a8 8 0 1 1 11 7c-3 2-3 4-3 6', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 50, r: 2.5 }, 'dark'),
    s('path', { d: 'M80 120v16', ...SW(5) }, 'orange', { stroke: true })
  ],
  acuerdo: [
    s('path', { d: 'M14 84l30-20 22 10 14-6 14 6 22-10 30 20-30 22-22-8-14 10-14-10-22 8z' }, 'skin', { accent: true }),
    s('path', { d: 'M14 84l30-20M146 84l-30-20', ...SW(10) }, 'blue', { stroke: true }),
    s('path', { d: 'M62 82l10 10M74 78l10 10M86 76l8 8', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M70 40l8 8 16-16', ...SW(6) }, 'green', { stroke: true })
  ],
  cualquier: [
    s('circle', { cx: 32, cy: 50, r: 14 }, 'red'), s('rect', { x: 64, y: 36, width: 28, height: 28, rx: 4 }, 'blue'),
    s('path', { d: 'M126 34l16 28h-32z' }, 'green'), s('circle', { cx: 46, cy: 104, r: 14 }, 'yellow'),
    s('rect', { x: 96, y: 92, width: 28, height: 28, rx: 14 }, 'purple'),
    s('path', { d: 'M80 74l6 12-12 0z' }, 'orange'),
    s('path', { d: 'M30 140q50-24 100 0', ...SW(4) }, 'dark', { stroke: true }),
    s('circle', { cx: 80, cy: 128, r: 8 }, 'skin', { accent: true })
  ],
  dios: [
    s('circle', { cx: 80, cy: 66, r: 40 }, 'yellow', { flatOnly: true, }),
    s('circle', { cx: 80, cy: 66, r: 26 }, 'cream'),
    s('path', { d: 'M80 14v12M80 106v12M28 66h12M120 66h12M44 30l8 8M108 102l8 8M116 30l-8 8M52 94l-8 8', ...SW(5) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M24 128q24-16 44 0t44 0 32-2', ...SW(10) }, 'sky', { stroke: true })
  ],
  unos: [
    s('circle', { cx: 46, cy: 88, r: 12 }, 'red'), s('circle', { cx: 74, cy: 72, r: 12 }, 'red', { accent: true }),
    s('circle', { cx: 100, cy: 92, r: 12 }, 'red'), s('circle', { cx: 62, cy: 108, r: 12 }, 'red'),
    s('circle', { cx: 92, cy: 116, r: 12 }, 'red'),
    s('path', { d: 'M24 128q56 22 112 0', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M74 60q2-10 8-14', ...SW(3) }, 'green', { stroke: true })
  ],
  ley: [
    s('path', { d: 'M80 26v104M44 130h72', ...SW(6) }, 'brown', { stroke: true }),
    s('path', { d: 'M30 46h100', ...SW(5) }, 'brown', { stroke: true }),
    s('path', { d: 'M30 46l-16 38h32zM130 46l-16 38h32z', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M12 84a18 10 0 0 0 36 0zM112 84a18 10 0 0 0 36 0z' }, 'yellow', { accent: true }),
    s('circle', { cx: 80, cy: 26, r: 8 }, 'yellow')
  ],
  medio: [
    s('circle', { cx: 80, cy: 82, r: 54 }, 'cream'),
    s('path', { d: 'M80 28a54 54 0 0 1 0 108z' }, 'orange', { accent: true }),
    s('path', { d: 'M80 22v120', ...SW(4, { 'stroke-dasharray': '8 6' }) }, 'dark', { stroke: true })
  ],
  sino: [
    s('path', { d: 'M18 70h50', ...SW(10) }, 'gray', { stroke: true }),
    s('path', { d: 'M38 56l20 28M58 56 38 84', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M18 110h108', ...SW(10) }, 'green', { stroke: true, accent: true }),
    s('path', { d: 'M118 96l18 14-18 14', ...SW(8) }, 'green', { stroke: true })
  ],
  sistema: [
    s('path', { d: 'M80 40 36 112M80 40l44 72M36 112h88M80 40v40M36 112l44-32 44 32', ...SW(4) }, 'gray', { stroke: true }),
    s('circle', { cx: 80, cy: 40, r: 14 }, 'blue', { accent: true }),
    s('circle', { cx: 36, cy: 112, r: 14 }, 'green'), s('circle', { cx: 124, cy: 112, r: 14 }, 'red'),
    s('circle', { cx: 80, cy: 80, r: 12 }, 'yellow')
  ],
  fin: [
    s('path', { d: 'M30 136V30M130 136V30', ...SW(6) }, 'dark', { stroke: true }),
    s('rect', { x: 30, y: 30, width: 100, height: 30 }, 'white'),
    s('path', { d: 'M30 30h20v10H30zM70 30h20v10H70zM110 30h20v10h-20zM50 40h20v10H50zM90 40h20v10H90zM30 50h20v10H30zM70 50h20v10H70zM110 50h20v10h-20z' }, 'black', { accent: true }),
    s('path', { d: 'M24 112h112', ...SW(6) }, 'red', { stroke: true }),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true })
  ],
  presidente: [
    ground(),
    s('rect', { x: 46, y: 106, width: 68, height: 30, rx: 3 }, 'brown'),
    s('circle', { cx: 80, cy: 58, r: 14 }, 'skin'),
    s('path', { d: 'M58 106V84q0-12 22-12t22 12v22z' }, 'navy', { accent: true }),
    s('path', { d: 'M80 74v20', ...SW(5) }, 'red', { stroke: true }),
    s('path', { d: 'M114 106V40', ...SW(3) }, 'dark', { stroke: true }),
    s('path', { d: 'M114 40h26v18h-26z' }, 'blue')
  ],
  lado: [
    s('rect', { x: 44, y: 44, width: 72, height: 72, rx: 4 }, 'sky'),
    s('path', { d: 'M116 44v72', ...SW(10) }, 'orange', { stroke: true, accent: true }),
    s('path', { d: 'M132 70l8 10-8 10', ...SW(4) }, 'orange', { stroke: true })
  ],
  'aún': [
    s('circle', { cx: 80, cy: 80, r: 50 }, 'white'),
    s('circle', { cx: 80, cy: 80, r: 50, ...SW(6) }, 'gray', { stroke: true }),
    s('path', { d: 'M80 80V44M80 80h26', ...SW(6) }, 'dark', { stroke: true }),
    s('path', { d: 'M30 136q50-12 100 0', ...SW(4) }, 'gray', { stroke: true }),
    s('path', { d: 'M118 30h24l-12 18z' }, 'yellow', { accent: true }),
    s('path', { d: 'M118 66h24l-12-18z' }, 'yellow')
  ],
  esos: [
    ground(),
    ...person(30, 136, 'blue'),
    s('path', { d: 'M44 100h20', ...SW(7) }, 'skin', { stroke: true }),
    s('path', { d: 'M70 92l8 8-8 8', ...SW(4) }, 'gray', { stroke: true }),
    s('rect', { x: 92, y: 106, width: 16, height: 30, rx: 3 }, 'orange', { accent: true }),
    s('rect', { x: 112, y: 98, width: 16, height: 38, rx: 3 }, 'orange'),
    s('rect', { x: 132, y: 110, width: 14, height: 26, rx: 3 }, 'orange')
  ],
  final: [
    s('path', { d: 'M48 34h64v20a32 32 0 0 1-64 0z' }, 'yellow', { accent: true }),
    s('path', { d: 'M48 42H32a16 16 0 0 0 18 22M112 42h16a16 16 0 0 1-18 22', ...SW(5) }, 'yellow', { stroke: true }),
    s('rect', { x: 74, y: 84, width: 12, height: 22 }, 'yellow'),
    s('rect', { x: 54, y: 106, width: 52, height: 14, rx: 3 }, 'brown'),
    s('rect', { x: 46, y: 120, width: 68, height: 14, rx: 3 }, 'brown')
  ],
  'política': [
    ground(),
    s('rect', { x: 42, y: 74, width: 76, height: 62, rx: 4 }, 'blue', { accent: true }),
    s('rect', { x: 60, y: 70, width: 40, height: 8, rx: 3 }, 'dark'),
    s('rect', { x: 66, y: 34, width: 28, height: 38, rx: 2 }, 'white'),
    s('path', { d: 'M72 50l6 6 10-12', ...SW(4) }, 'green', { stroke: true }),
    s('path', { d: 'M66 34h28v38H66z', ...SW(2) }, 'gray', { stroke: true })
  ],
  punto: [
    s('circle', { cx: 80, cy: 80, r: 30 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 80, r: 50, ...SW(3, { 'stroke-dasharray': '6 8' }) }, 'gray', { stroke: true }),
    s('circle', { cx: 70, cy: 70, r: 8, opacity: 0.5 }, 'white', { flatOnly: true })
  ],
  guerra: [
    s('path', { d: 'M30 130 118 42M130 130 42 42', ...SW(8) }, 'gray', { stroke: true }),
    s('path', { d: 'M110 34l16-4-4 16zM50 34l-16-4 4 16z' }, 'gray'),
    s('path', { d: 'M26 118l16 16M118 134l16-16', ...SW(10) }, 'brown', { stroke: true, accent: true }),
    s('path', { d: 'M72 26l8 14 8-14', ...SW(4) }, 'red', { stroke: true })
  ],
  ante: [
    s('rect', { x: 92, y: 30, width: 50, height: 106, rx: 4 }, 'gray'),
    s('rect', { x: 104, y: 44, width: 26, height: 26 }, 'sky'),
    s('path', { d: 'M14 136h132', ...SW(4) }, 'gray', { stroke: true }),
    ...person(60, 136, 'red', { accent: true }),
    s('circle', { cx: 66, cy: 76, r: 2.5 }, 'dark')
  ],
  embargo: [
    s('rect', { x: 26, y: 54, width: 108, height: 72, rx: 6 }, 'tan'),
    s('path', { d: 'M26 80h108', ...SW(3) }, 'brown', { stroke: true }),
    s('path', { d: 'M22 136 138 44', ...SW(10) }, 'red', { stroke: true, accent: true }),
    s('rect', { x: 64, y: 30, width: 32, height: 26, rx: 4 }, 'gray'),
    s('path', { d: 'M70 30v-8a10 10 0 0 1 20 0v8', ...SW(5) }, 'gray', { stroke: true })
  ],
  'información': [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 46, r: 9 }, 'white'),
    s('rect', { x: 71, y: 64, width: 18, height: 52, rx: 5 }, 'white')
  ]
};
