// Illustration specs for verbs-1 (see server/scripts/lexicon/art.js)
const { s } = require("../../../scripts/lexicon/art");
const st = (d, color, w = 5, extra = {}) => s('path', { d, fill: 'none', 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, color, { stroke: true });
const head = (cx, cy, r = 14) => s('circle', { cx, cy, r }, 'skin');

module.exports = {
  ver: [
    s('ellipse', { cx: 80, cy: 82, rx: 58, ry: 36 }, 'cream'),
    s('circle', { cx: 80, cy: 82, r: 26 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 82, r: 12 }, 'dark'),
    s('circle', { cx: 72, cy: 74, r: 5 }, 'white', { flatOnly: true }),
    st('M22 82Q80 30 138 82Q80 134 22 82z', 'dark', 5),
    st('M50 34l-8-14M80 28V12M110 34l8-14', 'gray', 5)
  ],
  mirar: [
    s('rect', { x: 18, y: 56, width: 50, height: 70, rx: 18 }, 'dark'),
    s('rect', { x: 92, y: 56, width: 50, height: 70, rx: 18 }, 'dark'),
    s('rect', { x: 58, y: 74, width: 44, height: 18, rx: 6 }, 'blue', { accent: true }),
    s('circle', { cx: 43, cy: 108, r: 20 }, 'sky'),
    s('circle', { cx: 117, cy: 108, r: 20 }, 'sky'),
    s('rect', { x: 26, y: 36, width: 34, height: 26, rx: 6 }, 'blue'),
    s('rect', { x: 100, y: 36, width: 34, height: 26, rx: 6 }, 'blue')
  ],
  oír: [
    s('path', { d: 'M62 28C32 28 28 62 40 84c8 14 6 26 14 38 10 14 34 10 38-10 2-12 14-14 22-30C122 54 100 28 62 28z' }, 'skin', { accent: true }),
    st('M64 54C46 52 46 76 60 80c8 4 8 16 0 22', 'brown', 5),
    st('M122 52q12 16 0 32M134 40q22 28 0 56', 'blue', 5)
  ],
  escuchar: [
    st('M30 96V86a50 50 0 0 1 100 0v10', 'dark', 8),
    s('rect', { x: 18, y: 88, width: 28, height: 44, rx: 12 }, 'blue', { accent: true }),
    s('rect', { x: 114, y: 88, width: 28, height: 44, rx: 12 }, 'blue', { accent: true }),
    s('circle', { cx: 72, cy: 118, r: 8 }, 'red'),
    st('M80 118V84l20-6v28', 'red', 5),
    s('circle', { cx: 94, cy: 106, r: 8 }, 'red')
  ],
  leer: [
    s('path', { d: 'M80 44C60 32 36 32 18 38v82c18-6 42-6 62 6z' }, 'blue', { accent: true }),
    s('path', { d: 'M80 44c20-12 44-12 62-6v82c-18-6-42-6-62 6z' }, 'cream'),
    st('M32 58c14-2 28 0 38 6M32 76c14-2 28 0 38 6M32 94c14-2 28 0 38 6', 'white', 4),
    st('M90 64c10-6 24-8 38-6M90 82c10-6 24-8 38-6M90 100c10-6 24-8 38-6', 'gray', 4)
  ],
  escribir: [
    s('rect', { x: 94, y: 14, width: 24, height: 80, rx: 4, transform: 'rotate(40 106 54)' }, 'yellow', { accent: true }),
    s('path', { d: 'M52 106l-6 26 26-6 8-18-16-8z' }, 'tan'),
    s('path', { d: 'M46 132l6-26 8 4-4 18z' }, 'dark'),
    s('rect', { x: 88, y: 20, width: 24, height: 14, rx: 3, transform: 'rotate(40 100 27)' }, 'pink'),
    st('M60 140c20 0 24-8 44-8s26 8 44 8', 'blue', 5)
  ],
  enseñar: [
    s('rect', { x: 14, y: 28, width: 132, height: 86, rx: 6 }, 'brown'),
    s('rect', { x: 22, y: 36, width: 116, height: 70, rx: 3 }, 'green', { accent: true }),
    st('M36 56h40M36 72h26M36 88h46', 'white', 5),
    st('M96 60l10 18 10-18', 'yellow', 5),
    st('M24 130h60', 'gray', 8),
    st('M150 52L108 128', 'brown', 5)
  ],
  beber: [
    s('path', { d: 'M40 40h80l-10 92a8 8 0 0 1-8 8H58a8 8 0 0 1-8-8z' }, 'sky'),
    s('path', { d: 'M46 72h68l-6 60a8 8 0 0 1-8 8H60a8 8 0 0 1-8-8z' }, 'blue', { accent: true }),
    st('M96 70L112 14h22', 'red', 6),
    s('circle', { cx: 74, cy: 96, r: 5, opacity: 0.6 }, 'white', { flatOnly: true }),
    s('circle', { cx: 90, cy: 112, r: 4, opacity: 0.6 }, 'white', { flatOnly: true })
  ],
  tomar: [
    st('M44 30q-10 14 0 26M70 24q-10 16 0 32M96 30q-10 14 0 26', 'gray', 5),
    s('path', { d: 'M28 66h86v32a38 38 0 0 1-38 38h-10a38 38 0 0 1-38-38z' }, 'brown', { accent: true }),
    st('M114 76h8a16 16 0 0 1 0 32h-12', 'brown', 8),
    s('ellipse', { cx: 71, cy: 66, rx: 43, ry: 8 }, 'tan'),
    s('rect', { x: 20, y: 138, width: 100, height: 8, rx: 4 }, 'gray')
  ],
  cocinar: [
    s('rect', { x: 22, y: 76, width: 116, height: 44, rx: 10 }, 'gray', { accent: true }),
    s('rect', { x: 12, y: 86, width: 14, height: 10, rx: 4 }, 'dark'),
    s('rect', { x: 134, y: 86, width: 14, height: 10, rx: 4 }, 'dark'),
    s('path', { d: 'M28 76a52 22 0 0 1 104 0z' }, 'dark'),
    s('circle', { cx: 80, cy: 50, r: 6 }, 'dark'),
    s('path', { d: 'M50 122c-8 8-2 18 6 18s10-10 2-18zM80 122c-10 8-4 22 6 22s10-14 0-22zM110 122c-8 8-2 18 6 18s10-10 2-18z' }, 'orange'),
    st('M60 30q-8 10 0 18M100 30q-8 10 0 18', 'gray', 4)
  ],
  comprar: [
    st('M56 56V44a24 24 0 0 1 48 0v12', 'dark', 6),
    s('path', { d: 'M30 56h100l8 76a8 8 0 0 1-8 8H30a8 8 0 0 1-8-8z' }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 96, r: 16 }, 'yellow'),
    st('M80 88v16', 'orange', 4)
  ],
  pagar: [
    s('rect', { x: 14, y: 40, width: 100, height: 60, rx: 6 }, 'green', { accent: true }),
    s('circle', { cx: 64, cy: 70, r: 16 }, 'mint'),
    s('rect', { x: 24, y: 50, width: 10, height: 6, rx: 2 }, 'mint'),
    s('rect', { x: 94, y: 84, width: 10, height: 6, rx: 2 }, 'mint'),
    s('circle', { cx: 112, cy: 110, r: 30 }, 'yellow'),
    s('circle', { cx: 112, cy: 110, r: 20 }, 'orange'),
    st('M112 98v24', 'yellow', 5)
  ],
  costar: [
    s('path', { d: 'M20 80L80 20h56v56L76 136a8 8 0 0 1-11 0L20 91a8 8 0 0 1 0-11z' }, 'red', { accent: true }),
    s('circle', { cx: 112, cy: 44, r: 9 }, 'white'),
    st('M112 44L134 22', 'dark', 4),
    st('M74 84v28M62 90q12-10 24 0M62 106q12 10 24 0', 'white', 5)
  ],
  abrir: [
    s('rect', { x: 36, y: 16, width: 88, height: 128, rx: 4 }, 'brown'),
    s('rect', { x: 46, y: 26, width: 68, height: 118 }, 'yellow'),
    s('path', { d: 'M46 26L18 40v110l28-6z' }, 'tan', { accent: true }),
    s('circle', { cx: 28, cy: 92, r: 4 }, 'brown'),
    st('M60 146h60', 'orange', 6)
  ],
  cerrar: [
    s('rect', { x: 36, y: 16, width: 88, height: 128, rx: 4 }, 'brown'),
    s('rect', { x: 46, y: 26, width: 68, height: 118 }, 'tan', { accent: true }),
    s('rect', { x: 30, y: 78, width: 100, height: 16, rx: 4 }, 'gray'),
    s('circle', { cx: 100, cy: 108, r: 6 }, 'brown'),
    s('circle', { cx: 56, cy: 86, r: 3 }, 'dark'),
    s('circle', { cx: 104, cy: 86, r: 3 }, 'dark')
  ],
  entrar: [
    s('rect', { x: 78, y: 24, width: 70, height: 112, rx: 4 }, 'brown'),
    s('rect', { x: 88, y: 34, width: 50, height: 102 }, 'yellow'),
    s('path', { d: 'M10 66h46V46l36 34-36 34V94H10z', 'stroke-linejoin': 'round' }, 'green', { accent: true })
  ],
  salir: [
    s('rect', { x: 12, y: 24, width: 70, height: 112, rx: 4 }, 'brown'),
    s('rect', { x: 22, y: 34, width: 50, height: 102 }, 'yellow'),
    s('path', { d: 'M62 66h46V46l40 34-40 34V94H62z', 'stroke-linejoin': 'round' }, 'blue', { accent: true })
  ],
  llegar: [
    s('ellipse', { cx: 80, cy: 138, rx: 56, ry: 10 }, 'mint'),
    s('path', { d: 'M80 134C52 100 40 84 40 62a40 40 0 0 1 80 0c0 22-12 38-40 72z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 62, r: 15 }, 'white'),
    st('M30 144h100', 'green', 5)
  ],
  volver: [
    st('M44 134V68a36 36 0 0 1 72 0v22', 'blue', 14, {}),
    s('path', { d: 'M92 88h48l-24 34z', 'stroke-linejoin': 'round' }, 'blue', { accent: true }),
    s('circle', { cx: 44, cy: 140, r: 8 }, 'dark')
  ],
  subir: [
    s('path', { d: 'M14 140V112h32V84h32V56h32V28h36v112z', 'stroke-linejoin': 'round' }, 'gray'),
    s('path', { d: 'M24 128V112h22M56 100V84h22M88 72V56h22', fill: 'none', 'stroke-width': 4 }, 'white', { stroke: true }),
    s('path', { d: 'M40 70l24-38 24 38H76v22H52V70z', 'stroke-linejoin': 'round', transform: 'translate(-8 6)' }, 'green', { accent: true })
  ],
  bajar: [
    s('path', { d: 'M14 28h36v28h32v28h32v28h32v28H14z', 'stroke-linejoin': 'round' }, 'gray'),
    s('path', { d: 'M24 40h26M60 68h22M92 96h22', fill: 'none', 'stroke-width': 4 }, 'white', { stroke: true }),
    s('path', { d: 'M96 30h24v22h16l-28 38-28-38h16z', 'stroke-linejoin': 'round', transform: 'translate(-16 -6)' }, 'red', { accent: true })
  ],
  caminar: [
    head(84, 30, 16),
    s('rect', { x: 66, y: 50, width: 34, height: 48, rx: 14 }, 'orange', { accent: true }),
    st('M74 96L56 138M92 96l20 24 6 18', 'blue', 12),
    st('M72 62L52 90M96 62l16 22', 'skin', 9),
    st('M16 146h128', 'gray', 4)
  ],
  nadar: [
    head(96, 60, 15),
    st('M96 76L70 74M70 74l-20-24', 'skin', 10),
    st('M96 76l20 8', 'skin', 10),
    s('path', { d: 'M8 84q18-14 36 0t36 0 36 0 36 0v60H8z' }, 'blue', { accent: true }),
    st('M8 110q18-12 36 0t36 0 36 0 36 0', 'sky', 5)
  ],
  cantar: [
    s('circle', { cx: 58, cy: 90, r: 40 }, 'skin'),
    s('ellipse', { cx: 58, cy: 108, rx: 12, ry: 14 }, 'dark'),
    s('circle', { cx: 44, cy: 78, r: 5 }, 'dark'),
    s('circle', { cx: 72, cy: 78, r: 5 }, 'dark'),
    s('ellipse', { cx: 58, cy: 112, rx: 7, ry: 6 }, 'red', { flatOnly: true }),
    st('M112 90V40l26-8v50', 'purple', 6),
    s('circle', { cx: 106, cy: 92, r: 10 }, 'purple', { accent: true }),
    s('circle', { cx: 132, cy: 84, r: 10 }, 'purple', { accent: true })
  ],
  jugar: [
    s('circle', { cx: 80, cy: 80, r: 56 }, 'cream'),
    s('path', { d: 'M80 52l22 16-8 26H66l-8-26z' }, 'dark'),
    s('path', { d: 'M80 52V28M102 68l24-8M94 94l14 22M66 94L52 116M58 68L34 60', fill: 'none', 'stroke-width': 4 }, 'dark', { stroke: true }),
    st('M30 56a56 56 0 0 1 100 0', 'red', 8)
  ],
  tocar: [
    s('rect', { x: 78, y: 12, width: 16, height: 72, rx: 4, transform: 'rotate(30 86 48)' }, 'brown'),
    s('path', { d: 'M68 84c-22-12-44 8-34 28-12 6-14 26 4 34 20 10 40 0 44-18 24-2 30-30 10-38-8-4-16-8-24-6z' }, 'orange', { accent: true }),
    s('circle', { cx: 64, cy: 112, r: 11 }, 'dark'),
    st('M40 138l40-40', 'tan', 4)
  ],
  viajar: [
    st('M58 54V38a8 8 0 0 1 8-8h28a8 8 0 0 1 8 8v16', 'dark', 7),
    s('rect', { x: 22, y: 52, width: 116, height: 82, rx: 12 }, 'orange', { accent: true }),
    s('rect', { x: 46, y: 52, width: 10, height: 82 }, 'brown'),
    s('rect', { x: 104, y: 52, width: 10, height: 82 }, 'brown'),
    s('rect', { x: 68, y: 86, width: 24, height: 12, rx: 3 }, 'yellow'),
    s('circle', { cx: 42, cy: 144, r: 6 }, 'dark'),
    s('circle', { cx: 118, cy: 144, r: 6 }, 'dark')
  ],
  conducir: [
    s('circle', { cx: 80, cy: 80, r: 58 }, 'dark'),
    s('circle', { cx: 80, cy: 80, r: 44 }, 'white', { flatOnly: true }),
    st('M26 84h36M98 84h36M80 100v38', 'dark', 12),
    s('circle', { cx: 80, cy: 84, r: 20 }, 'blue', { accent: true }),
    s('circle', { cx: 80, cy: 84, r: 8 }, 'sky')
  ],
  llevar: [
    head(52, 40, 16),
    s('rect', { x: 34, y: 60, width: 36, height: 56, rx: 14 }, 'green', { accent: true }),
    st('M44 116v26M60 116v26', 'blue', 10),
    st('M62 74l30 14', 'skin', 9),
    s('rect', { x: 88, y: 66, width: 50, height: 44, rx: 4 }, 'brown'),
    st('M88 82h50', 'tan', 6)
  ],
  traer: [
    head(40, 56, 16),
    s('rect', { x: 22, y: 76, width: 36, height: 56, rx: 14 }, 'purple', { accent: true }),
    st('M34 132v14M46 132v14', 'blue', 10),
    st('M52 92l24-6', 'skin', 9),
    s('rect', { x: 74, y: 68, width: 40, height: 38, rx: 4 }, 'brown'),
    st('M128 40q-16 18-6 46', 'orange', 5, { 'stroke-dasharray': '2 9' }),
    s('path', { d: 'M148 30l-6 24-22-14z', 'stroke-linejoin': 'round', transform: 'translate(-6 54)' }, 'orange')
  ],
  buscar: [
    s('circle', { cx: 66, cy: 66, r: 42 }, 'sky'),
    st('M66 24a42 42 0 0 1 42 42', 'white', 5),
    st('M66 66m-42 0a42 42 0 1 0 84 0a42 42 0 1 0-84 0', 'blue', 9, {}),
    st('M98 98l40 40', 'brown', 16),
    s('circle', { cx: 66, cy: 66, r: 8 }, 'red', { accent: true })
  ],
  esperar: [
    s('circle', { cx: 80, cy: 80, r: 60 }, 'cream'),
    s('circle', { cx: 80, cy: 80, r: 60, fill: 'none' }, 'blue', { accent: true, stroke: true, 'stroke-width': 8 }),
    st('M80 80V40M80 80l28 16', 'dark', 7),
    s('circle', { cx: 80, cy: 80, r: 6 }, 'dark'),
    st('M80 26v6M134 80h-6M80 134v-6M26 80h6', 'gray', 5)
  ],
  encantar: [
    s('path', { d: 'M80 134C20 94 24 40 58 36c14-2 22 6 22 16 0-10 8-18 22-16 34 4 38 58-22 98z' }, 'red', { accent: true }),
    s('path', { d: 'M126 20l5 12 12 5-12 5-5 12-5-12-12-5 12-5z' }, 'yellow'),
    s('path', { d: 'M30 24l4 9 9 4-9 4-4 9-4-9-9-4 9-4z' }, 'yellow'),
    s('ellipse', { cx: 54, cy: 62, rx: 7, ry: 12, transform: 'rotate(30 54 62)', opacity: 0.45 }, 'white', { flatOnly: true })
  ],
  preguntar: [
    s('path', { d: 'M30 24h100a12 12 0 0 1 12 12v66a12 12 0 0 1-12 12H80l-26 26v-26H30a12 12 0 0 1-12-12V36a12 12 0 0 1 12-12z' }, 'yellow', { accent: true }),
    st('M64 56a16 16 0 1 1 22 15c-6 3-6 8-6 14', 'dark', 9),
    s('circle', { cx: 80, cy: 101, r: 6 }, 'dark')
  ],
  llamar: [
    s('rect', { x: 46, y: 12, width: 68, height: 136, rx: 14 }, 'dark'),
    s('rect', { x: 54, y: 30, width: 52, height: 96, rx: 4 }, 'sky'),
    s('circle', { cx: 80, cy: 78, r: 14 }, 'green', { accent: true }),
    st('M126 44q14 12 0 28M138 32q24 24 0 52', 'green', 5),
    st('M34 44q-14 12 0 28M22 32q-24 24 0 52', 'green', 5)
  ],
  ducharse: [
    st('M24 148V30a22 22 0 0 1 22-22h48', 'gray', 8),
    s('path', { d: 'M70 24h66a0 0 0 0 1 0 0c0 18-14 30-33 30S70 42 70 24z' }, 'gray', { accent: true }),
    s('path', { d: 'M84 74q-6 10 0 14q6-4 0-14zM104 82q-6 10 0 14q6-4 0-14zM124 74q-6 10 0 14q6-4 0-14zM94 108q-6 10 0 14q6-4 0-14zM116 112q-6 10 0 14q6-4 0-14z' }, 'blue', { accent: true }),
    st('M40 136h100', 'sky', 5)
  ],
  vestirse: [
    s('path', { d: 'M56 22c6 12 42 12 48 0l40 22-14 36-18-8v62H48V72l-18 8L16 44z' }, 'blue', { accent: true }),
    s('path', { d: 'M56 22c6 14 42 14 48 0-6 22-42 22-48 0z' }, 'sky'),
    st('M64 112h32', 'white', 4)
  ],
  dormir: [
    s('path', { d: 'M78 18a58 58 0 1 0 64 80A46 46 0 0 1 78 18z' }, 'yellow', { accent: true }),
    st('M100 30h22l-22 24h22', 'purple', 6),
    st('M122 12h14l-14 16h14', 'purple', 4),
    s('circle', { cx: 34, cy: 40, r: 4 }, 'sky'),
    s('circle', { cx: 24, cy: 120, r: 3 }, 'sky')
  ],
  sentarse: [
    s('rect', { x: 34, y: 18, width: 16, height: 80, rx: 4 }, 'brown', { accent: true }),
    s('rect', { x: 34, y: 18, width: 72, height: 14, rx: 4 }, 'brown', { accent: true }),
    s('rect', { x: 34, y: 86, width: 92, height: 16, rx: 6 }, 'brown', { accent: true }),
    st('M42 102v40M118 102v40', 'brown', 10),
    s('rect', { x: 62, y: 66, width: 40, height: 20, rx: 8 }, 'red')
  ],
  ayudar: [
    s('circle', { cx: 80, cy: 80, r: 50 }, 'white', { flatOnly: true }),
    s('circle', { cx: 80, cy: 80, r: 50, fill: 'none', 'stroke-width': 26 }, 'red', { accent: true, stroke: true }),
    s('circle', { cx: 80, cy: 80, r: 50, fill: 'none', 'stroke-width': 26, 'stroke-dasharray': '20 58.5' }, 'white', { stroke: true })
  ]
};
