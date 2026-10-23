// Illustration specs for theme life (see server/scripts/lexicon/art.js)
const { s } = require("../../../scripts/lexicon/art");

const R = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
const clover = (rot) => 'M80 80C62 52 32 52 38 76 42 92 68 88 80 80z';

module.exports = {
  'fútbol': [
    s('ellipse', { cx: 80, cy: 138, rx: 56, ry: 10 }, 'green'),
    s('circle', { cx: 80, cy: 80, r: 48 }, 'white'),
    s('circle', { cx: 80, cy: 80, r: 48, ...R, 'stroke-width': 4 }, 'gray', { stroke: true }),
    s('path', { d: 'M80 56l18 13-7 21H69l-7-21z' }, 'dark', { accent: true }),
    s('path', { d: 'M80 56V34M98 69l20-6M91 90l12 18M69 90 57 108M62 69l-20-6', ...R, 'stroke-width': 4 }, 'dark', { stroke: true }),
    s('path', { d: 'M118 63l12 18-6 14M42 63 30 81l6 14', ...R, 'stroke-width': 4 }, 'dark', { stroke: true })
  ],
  baloncesto: [
    s('circle', { cx: 80, cy: 80, r: 54 }, 'orange', { accent: true }),
    s('path', { d: 'M80 26v108M26 80h108', ...R, 'stroke-width': 4 }, 'dark', { stroke: true }),
    s('path', { d: 'M42 42a54 54 0 0 1 0 76M118 42a54 54 0 0 0 0 76', ...R, 'stroke-width': 4 }, 'dark', { stroke: true })
  ],
  tenis: [
    s('ellipse', { cx: 62, cy: 60, rx: 38, ry: 46, transform: 'rotate(-35 62 60)', fill: 'none', 'stroke-width': 9 }, 'red', { stroke: true, accent: true }),
    s('path', { d: 'M36 40 88 80M30 62l60-10M52 20l20 82', ...R, 'stroke-width': 2.5, transform: 'rotate(0)' }, 'gray', { stroke: true }),
    s('path', { d: 'M90 96 128 136', ...R, 'stroke-width': 10 }, 'brown', { stroke: true }),
    s('circle', { cx: 122, cy: 40, r: 16 }, 'yellow'),
    s('path', { d: 'M110 32q10 8 4 20M134 30q-10 8-4 22', ...R, 'stroke-width': 3 }, 'white', { stroke: true, lineColor: 'dark' })
  ],
  juego: [
    s('rect', { x: 20, y: 56, width: 62, height: 62, rx: 12, transform: 'rotate(-12 51 87)' }, 'red', { accent: true }),
    s('path', { d: 'M38 74h.01M64 74h.01M51 88h.01M38 102h.01M64 102h.01', ...R, 'stroke-width': 10, transform: 'rotate(-12 51 87)' }, 'white', { stroke: true, lineColor: 'dark' }),
    s('rect', { x: 84, y: 44, width: 56, height: 56, rx: 12, transform: 'rotate(14 112 72)' }, 'blue'),
    s('path', { d: 'M100 60h.01M124 84h.01M112 72h.01', ...R, 'stroke-width': 10, transform: 'rotate(14 112 72)' }, 'white', { stroke: true, lineColor: 'dark' })
  ],
  'música': [
    s('path', { d: 'M62 118V40l60-14v78', ...R, 'stroke-width': 7 }, 'dark', { stroke: true }),
    s('path', { d: 'M62 52l60-14v16L62 68z' }, 'dark'),
    s('ellipse', { cx: 46, cy: 120, rx: 20, ry: 14, transform: 'rotate(-18 46 120)' }, 'blue', { accent: true }),
    s('ellipse', { cx: 106, cy: 106, rx: 20, ry: 14, transform: 'rotate(-18 106 106)' }, 'blue', { accent: true }),
    s('path', { d: 'M132 120l3 7 7 3-7 3-3 7-3-7-7-3 7-3z' }, 'yellow')
  ],
  'película': [
    s('rect', { x: 20, y: 64, width: 120, height: 76, rx: 6 }, 'dark'),
    s('path', { d: 'M20 82h120', ...R, 'stroke-width': 3 }, 'gray', { stroke: true }),
    s('path', { d: 'M68 96l30 18-30 18z' }, 'yellow', { accent: true }),
    s('rect', { x: 20, y: 36, width: 120, height: 22, rx: 4, transform: 'rotate(-12 20 58)' }, 'dark'),
    s('path', { d: 'M40 36l10 0-12 22H28zM64 36h10L62 58H52zM88 36h10L86 58H76zM112 36h10l-12 22H100z', transform: 'rotate(-12 20 58)' }, 'white', { lineColor: 'dark' })
  ],
  foto: [
    s('rect', { x: 52, y: 32, width: 30, height: 16, rx: 4 }, 'dark'),
    s('rect', { x: 16, y: 44, width: 128, height: 88, rx: 14 }, 'dark', { accent: false }),
    s('rect', { x: 26, y: 54, width: 28, height: 12, rx: 3 }, 'yellow'),
    s('circle', { cx: 82, cy: 90, r: 32 }, 'gray'),
    s('circle', { cx: 82, cy: 90, r: 22 }, 'blue', { accent: true }),
    s('circle', { cx: 74, cy: 82, r: 6 }, 'white', { flatOnly: true }),
    s('circle', { cx: 126, cy: 62, r: 5 }, 'red')
  ],
  revista: [
    s('rect', { x: 36, y: 16, width: 90, height: 128, rx: 6 }, 'red', { accent: true }),
    s('rect', { x: 44, y: 24, width: 74, height: 22, rx: 3 }, 'white', { lineColor: 'dark' }),
    s('rect', { x: 44, y: 54, width: 74, height: 50, rx: 3 }, 'sky'),
    s('circle', { cx: 80, cy: 72, r: 12 }, 'yellow'),
    s('path', { d: 'M48 120h66M48 132h40', ...R, 'stroke-width': 4 }, 'cream', { stroke: true, lineColor: 'dark' })
  ],
  'periódico': [
    s('rect', { x: 20, y: 24, width: 120, height: 112, rx: 6 }, 'cream'),
    s('rect', { x: 30, y: 34, width: 100, height: 18, rx: 2 }, 'dark'),
    s('rect', { x: 30, y: 60, width: 44, height: 40, rx: 2 }, 'sky', { accent: true }),
    s('path', { d: 'M84 64h46M84 76h46M84 88h30M30 112h100M30 124h70', ...R, 'stroke-width': 4 }, 'gray', { stroke: true }),
    s('path', { d: 'M80 24v112', ...R, 'stroke-width': 1.5 }, 'gray', { stroke: true, flatOnly: true })
  ],
  arte: [
    s('path', { d: 'M76 26C34 26 12 60 24 94c10 28 44 38 62 26 10-8 0-22 10-28 16-8 46 6 54-24C158 38 122 26 76 26z' }, 'tan', { accent: true }),
    s('circle', { cx: 52, cy: 60, r: 9 }, 'red'),
    s('circle', { cx: 80, cy: 48, r: 9 }, 'yellow'),
    s('circle', { cx: 108, cy: 56, r: 9 }, 'blue'),
    s('circle', { cx: 44, cy: 88, r: 9 }, 'green'),
    s('circle', { cx: 80, cy: 98, r: 7, transform: 'translate(0 0)' }, 'cream', { flatOnly: true }),
    s('path', { d: 'M110 140 144 100', ...R, 'stroke-width': 7 }, 'brown', { stroke: true })
  ],
  baile: [
    s('circle', { cx: 80, cy: 34, r: 17 }, 'skin'),
    s('path', { d: 'M62 28q18-14 36 0q-6 6-18 2q-12 4-18-2z' }, 'dark'),
    s('path', { d: 'M80 52 64 96 26 146h108L96 96z', 'stroke-linejoin': 'round' }, 'red', { accent: true }),
    s('path', { d: 'M40 132q20 12 40 0t40 0', ...R, 'stroke-width': 5 }, 'white', { stroke: true, lineColor: 'dark' }),
    s('path', { d: 'M92 64 116 38', ...R, 'stroke-width': 8 }, 'skin', { stroke: true }),
    s('path', { d: 'M66 66 46 84', ...R, 'stroke-width': 8 }, 'skin', { stroke: true }),
    s('path', { d: 'M126 76l2 6 6 2-6 2-2 6-2-6-6-2 6-2z' }, 'yellow')
  ],
  regalo: [
    s('rect', { x: 28, y: 70, width: 104, height: 70, rx: 5 }, 'red', { accent: true }),
    s('rect', { x: 20, y: 52, width: 120, height: 26, rx: 5 }, 'orange'),
    s('rect', { x: 70, y: 52, width: 20, height: 88 }, 'yellow'),
    s('path', { d: 'M80 52C60 24 36 36 46 48c8 8 24 6 34 4z' }, 'yellow'),
    s('path', { d: 'M80 52c20-28 44-16 34-4-8 8-24 6-34 4z' }, 'yellow'),
    s('circle', { cx: 80, cy: 52, r: 6 }, 'orange')
  ],
  carta: [
    s('rect', { x: 38, y: 18, width: 84, height: 76, rx: 4 }, 'white', { lineColor: 'dark' }),
    s('path', { d: 'M50 36h60M50 50h60M50 64h38', ...R, 'stroke-width': 4 }, 'gray', { stroke: true }),
    s('rect', { x: 18, y: 76, width: 124, height: 68, rx: 8 }, 'blue', { accent: true }),
    s('path', { d: 'M18 82 80 124 142 82', ...R, 'stroke-width': 4 }, 'sky', { stroke: true }),
    s('path', { d: 'M80 108c-8-10-18-4-12 4l12 10 12-10c6-8-4-14-12-4z', transform: 'translate(0 -4)' }, 'red')
  ],
  'conversación': [
    s('path', { d: 'M14 26h74a10 10 0 0 1 10 10v36a10 10 0 0 1-10 10H48L30 100V82H24a10 10 0 0 1-10-10V36a10 10 0 0 1 10-10z' }, 'green', { accent: true }),
    s('path', { d: 'M70 76h66a10 10 0 0 1 10 10v36a10 10 0 0 1-10 10h-6v16l-18-16H70a10 10 0 0 1-10-10V86a10 10 0 0 1 10-10z' }, 'orange'),
    s('path', { d: 'M30 46h50M30 60h30', ...R, 'stroke-width': 5 }, 'white', { stroke: true, lineColor: 'dark' }),
    s('path', { d: 'M82 96h.01M104 96h.01M126 96h.01', ...R, 'stroke-width': 10 }, 'white', { stroke: true, lineColor: 'dark' })
  ],
  problema: [
    s('path', { d: 'M10 128h140', ...R, 'stroke-width': 6 }, 'gray', { stroke: true }),
    s('path', { d: 'M28 128c-8-40 12-80 52-84 40 0 62 36 50 84z', 'stroke-linejoin': 'round' }, 'gray', { accent: true }),
    s('path', { d: 'M62 60l14 20-10 16M104 74l-14 18', ...R, 'stroke-width': 4 }, 'dark', { stroke: true }),
    s('path', { d: 'M80 22l14 22H66z' }, 'red'),
    s('path', { d: 'M80 30v8M80 41v.01', ...R, 'stroke-width': 3 }, 'white', { stroke: true, lineColor: 'dark' })
  ],
  idea: [
    s('path', { d: 'M58 108c0-14-22-22-22-46a44 44 0 0 1 88 0c0 24-22 32-22 46z' }, 'yellow', { accent: true }),
    s('rect', { x: 58, y: 108, width: 44, height: 10, rx: 3 }, 'gray'),
    s('rect', { x: 62, y: 120, width: 36, height: 10, rx: 3 }, 'gray'),
    s('path', { d: 'M72 134h16', ...R, 'stroke-width': 6 }, 'dark', { stroke: true }),
    s('path', { d: 'M80 54v30M70 62l10 10 10-10', ...R, 'stroke-width': 4 }, 'orange', { stroke: true }),
    s('path', { d: 'M80 8v10M28 24l8 8M132 24l-8 8M12 68h10M138 68h10', ...R, 'stroke-width': 5 }, 'orange', { stroke: true })
  ],
  mentira: [
    s('path', { d: 'M50 54 80 20l30 34z', 'stroke-linejoin': 'round' }, 'green', { accent: true }),
    s('circle', { cx: 66, cy: 86, r: 36 }, 'skin'),
    s('path', { d: 'M88 84 148 78 90 102z', 'stroke-linejoin': 'round' }, 'tan'),
    s('circle', { cx: 56, cy: 78, r: 6 }, 'white'),
    s('circle', { cx: 74, cy: 78, r: 6 }, 'white'),
    s('circle', { cx: 58, cy: 79, r: 3 }, 'dark'),
    s('circle', { cx: 76, cy: 79, r: 3 }, 'dark'),
    s('path', { d: 'M52 106q12 8 26 0', ...R, 'stroke-width': 4 }, 'dark', { stroke: true })
  ],
  amor: [
    s('path', { d: 'M80 140C20 96 18 50 48 40c18-6 30 6 32 16 2-10 14-22 32-16 30 10 28 56-32 100z', 'stroke-linejoin': 'round' }, 'red', { accent: true }),
    s('path', { d: 'M46 54q-8 4-8 16', ...R, 'stroke-width': 6 }, 'white', { stroke: true, lineColor: 'dark', flatOnly: true }),
    s('path', { d: 'M132 20c-10-8-18 2-12 8l12 12 12-12c6-6-2-16-12-8z', transform: 'translate(0 -2)' }, 'pink'),
    s('path', { d: 'M26 108c-6-6-12 2-8 6l8 8 8-8c4-4-2-12-8-6z' }, 'pink')
  ],
  amistad: [
    s('circle', { cx: 46, cy: 56, r: 16 }, 'skin'),
    s('path', { d: 'M20 138v-30a26 24 0 0 1 52 0v30z' }, 'blue', { accent: true }),
    s('circle', { cx: 114, cy: 56, r: 16 }, 'skin'),
    s('path', { d: 'M88 138v-30a26 24 0 0 1 52 0v30z' }, 'green'),
    s('path', { d: 'M64 104 96 104', ...R, 'stroke-width': 10 }, 'skin', { stroke: true }),
    s('path', { d: 'M80 34c-6-10-18-4-12 4l12 10 12-10c6-8-6-14-12-4z', transform: 'translate(0 -8)' }, 'red', { accent: true })
  ],
  paz: [
    s('circle', { cx: 80, cy: 80, r: 50, ...R, 'stroke-width': 9 }, 'blue', { stroke: true, accent: true }),
    s('path', { d: 'M80 30v100M80 80 44 116M80 80l36 36', ...R, 'stroke-width': 9 }, 'blue', { stroke: true }),
    s('path', { d: 'M18 138c20-10 36-4 44 4-16 6-34 4-44-4zM142 138c-20-10-36-4-44 4 16 6 34 4 44-4z' }, 'green')
  ],
  suerte: [
    s('path', { d: clover(), transform: 'rotate(0 80 80)' }, 'green', { accent: true }),
    s('path', { d: clover(), transform: 'rotate(90 80 80)' }, 'green'),
    s('path', { d: clover(), transform: 'rotate(180 80 80)' }, 'green'),
    s('path', { d: clover(), transform: 'rotate(270 80 80)' }, 'green'),
    s('path', { d: 'M80 80C84 110 96 124 112 140', ...R, 'stroke-width': 7 }, 'green', { stroke: true }),
    s('path', { d: 'M80 62v36M62 80h36', ...R, 'stroke-width': 2.5 }, 'mint', { stroke: true, flatOnly: true }),
    s('circle', { cx: 80, cy: 80, r: 5 }, 'yellow')
  ],
  parte: [
    s('path', { d: 'M80 84 128 112A56 56 0 1 1 80 28z', 'stroke-linejoin': 'round' }, 'blue', { accent: true }),
    s('path', { d: 'M88 76 88 20A56 56 0 0 1 136 104z', 'stroke-linejoin': 'round', transform: 'translate(6 -4)' }, 'orange'),
    s('path', { d: 'M52 60q-14 20-4 44', ...R, 'stroke-width': 5 }, 'sky', { stroke: true, flatOnly: true })
  ],
  lugar: [
    s('ellipse', { cx: 80, cy: 138, rx: 38, ry: 9 }, 'gray'),
    s('path', { d: 'M80 140C50 100 36 84 36 62a44 44 0 0 1 88 0c0 22-14 38-44 78z' }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 62, r: 17 }, 'white', { lineColor: 'dark' })
  ],
  forma: [
    s('circle', { cx: 46, cy: 52, r: 30 }, 'red', { accent: true }),
    s('rect', { x: 84, y: 22, width: 56, height: 56, rx: 6 }, 'blue'),
    s('path', { d: 'M80 88l44 56H36z', 'stroke-linejoin': 'round' }, 'yellow'),
  ],
  vez: [
    s('rect', { x: 46, y: 46, width: 68, height: 68, rx: 14 }, 'yellow', { accent: true }),
    s('path', { d: 'M64 64h.01M96 64h.01M80 80h.01M64 96h.01M96 96h.01', ...R, 'stroke-width': 10 }, 'dark', { stroke: true }),
    s('path', { d: 'M24 100A60 60 0 0 0 126 130M136 60A60 60 0 0 0 34 30', ...R, 'stroke-width': 7 }, 'blue', { stroke: true }),
    s('path', { d: 'M126 114l2 20-20-4M34 46l-2-20 20 4', ...R, 'stroke-width': 7 }, 'blue', { stroke: true })
  ],
  historia: [
    s('rect', { x: 36, y: 30, width: 88, height: 100, rx: 3 }, 'cream'),
    s('rect', { x: 26, y: 18, width: 108, height: 20, rx: 10 }, 'tan', { accent: true }),
    s('rect', { x: 26, y: 122, width: 108, height: 20, rx: 10 }, 'tan'),
    s('path', { d: 'M50 56h60M50 72h60M50 88h40', ...R, 'stroke-width': 4 }, 'brown', { stroke: true }),
    s('path', { d: 'M112 96 136 56', ...R, 'stroke-width': 4 }, 'dark', { stroke: true, flatOnly: true }),
    s('circle', { cx: 104, cy: 106, r: 8 }, 'red')
  ],
  ayuda: [
    s('circle', { cx: 80, cy: 80, r: 46, ...R, 'stroke-width': 26 }, 'red', { stroke: true, accent: true }),
    s('circle', { cx: 80, cy: 80, r: 46, ...R, 'stroke-width': 26, 'stroke-dasharray': '36 36.8', 'stroke-dashoffset': -18 }, 'white', { stroke: true, lineColor: 'dark' }),
    s('path', { d: 'M148 126q-14 10-28 4', ...R, 'stroke-width': 4 }, 'gray', { stroke: true })
  ],
  videojuego: [
    s('path', { d: 'M40 44h80c22 0 30 20 34 52 2 16-8 26-20 20-8-4-14-16-24-16H50c-10 0-16 12-24 16-12 6-22-4-20-20 4-32 12-52 34-52z' }, 'dark', { accent: true }),
    s('path', { d: 'M50 64v32M34 80h32', ...R, 'stroke-width': 9 }, 'white', { stroke: true, lineColor: 'gray' }),
    s('circle', { cx: 112, cy: 66, r: 8 }, 'red'),
    s('circle', { cx: 130, cy: 82, r: 8 }, 'yellow'),
    s('circle', { cx: 94, cy: 82, r: 8 }, 'blue'),
    s('circle', { cx: 112, cy: 98, r: 8 }, 'green')
  ],
  concierto: [
    s('ellipse', { cx: 54, cy: 112, rx: 34, ry: 30, transform: 'rotate(-40 54 112)' }, 'orange', { accent: true }),
    s('circle', { cx: 52, cy: 110, r: 9 }, 'dark'),
    s('path', { d: 'M76 88 134 30', ...R, 'stroke-width': 12 }, 'brown', { stroke: true }),
    s('path', { d: 'M128 22l14 14-8 8-14-14z' }, 'dark'),
    s('path', { d: 'M40 94 70 124', ...R, 'stroke-width': 3 }, 'gray', { stroke: true }),
    s('path', { d: 'M120 112l8 8M140 90l10 10', ...R, 'stroke-width': 5 }, 'yellow', { stroke: true }),
    s('circle', { cx: 134, cy: 124, r: 7 }, 'yellow')
  ],
  'excursión': [
    s('circle', { cx: 120, cy: 34, r: 14 }, 'yellow'),
    s('path', { d: 'M8 132 62 40l40 66 22-30 36 56z', 'stroke-linejoin': 'round' }, 'gray', { accent: true }),
    s('path', { d: 'M62 40 46 68l16-8 12 10z' }, 'white', { lineColor: 'dark' }),
    s('path', { d: 'M8 132h144v12H8z' }, 'green'),
    s('path', { d: 'M20 136C60 118 100 144 140 120', ...R, 'stroke-width': 4, 'stroke-dasharray': '8 6' }, 'brown', { stroke: true }),
    s('path', { d: 'M120 70l8 10 8-10z' }, 'red', { flatOnly: true })
  ],
  turista: [
    s('path', { d: 'M44 146v-34a36 32 0 0 1 72 0v34z' }, 'orange', { accent: true }),
    s('circle', { cx: 80, cy: 62, r: 20 }, 'skin'),
    s('path', { d: 'M73 66h.01M87 66h.01', ...R, 'stroke-width': 5 }, 'dark', { stroke: true }),
    s('path', { d: 'M62 52a18 18 0 0 1 36 0z' }, 'yellow'),
    s('rect', { x: 36, y: 50, width: 88, height: 6, rx: 3 }, 'yellow'),
    s('rect', { x: 64, y: 100, width: 32, height: 22, rx: 5 }, 'dark'),
    s('circle', { cx: 80, cy: 111, r: 7 }, 'sky')
  ],
  pasaporte: [
    s('rect', { x: 34, y: 14, width: 92, height: 132, rx: 8 }, 'navy', { accent: true }),
    s('circle', { cx: 80, cy: 66, r: 28, ...R, 'stroke-width': 4 }, 'yellow', { stroke: true }),
    s('path', { d: 'M52 66h56M80 38c-14 16-14 40 0 56 14-16 14-40 0-56', ...R, 'stroke-width': 3 }, 'yellow', { stroke: true }),
    s('rect', { x: 56, y: 108, width: 48, height: 8, rx: 3 }, 'yellow'),
    s('rect', { x: 62, y: 124, width: 36, height: 6, rx: 3 }, 'yellow')
  ],
  miedo: [
    s('circle', { cx: 80, cy: 82, r: 54 }, 'yellow', { accent: true }),
    s('circle', { cx: 60, cy: 72, r: 12 }, 'white'),
    s('circle', { cx: 100, cy: 72, r: 12 }, 'white'),
    s('circle', { cx: 60, cy: 74, r: 4 }, 'dark'),
    s('circle', { cx: 100, cy: 74, r: 4 }, 'dark'),
    s('path', { d: 'M44 50l16 6M116 50l-16 6', ...R, 'stroke-width': 4 }, 'dark', { stroke: true }),
    s('path', { d: 'M62 108q9-10 18 0t18 0', ...R, 'stroke-width': 5 }, 'dark', { stroke: true }),
    s('path', { d: 'M136 36c-7 10-10 16-4 22 6 4 14-2 10-10z' }, 'blue')
  ],
  prisa: [
    s('path', { d: 'M44 38a18 18 0 0 0-14 22M116 38a18 18 0 0 1 14 22', ...R, 'stroke-width': 8 }, 'yellow', { stroke: true }),
    s('circle', { cx: 80, cy: 86, r: 46 }, 'red', { accent: true }),
    s('circle', { cx: 80, cy: 86, r: 36 }, 'white', { lineColor: 'dark' }),
    s('path', { d: 'M80 86V60M80 86l18 10', ...R, 'stroke-width': 6 }, 'dark', { stroke: true }),
    s('path', { d: 'M56 136 46 148M104 136l10 12', ...R, 'stroke-width': 7 }, 'dark', { stroke: true }),
    s('path', { d: 'M4 70h18M0 90h20M6 110h16', ...R, 'stroke-width': 5 }, 'sky', { stroke: true })
  ]
};
