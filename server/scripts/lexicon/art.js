/**
 * Lexicon illustrations are written as small shape specs and rendered to SVG, so the whole set
 * can switch between the two house styles: "flat" (filled shapes) and "line" (ink outline + accent).
 *
 * A spec is an array of shapes: s(tag, attrs, color, opts)
 *   tag    'path' | 'circle' | 'ellipse' | 'rect' | 'line' | 'polygon'
 *   attrs  SVG attributes in a 160×160 viewBox (no fill/stroke; those come from color)
 *   color  a key of COLORS
 *   opts   { stroke: true }   draw as a stroke (attrs should carry fill:'none' and stroke-width)
 *          { accent: true }   keep this fill in the line style (one or two shapes per picture)
 *          { flatOnly: true } decoration skipped in the line style (highlights, shadows)
 *          { lineColor }      stroke color override for the line style
 */
const COLORS = {
  red: '#EA4335', blue: '#4285F4', yellow: '#FBBC05', green: '#34A853', brown: '#A86B3C', tan: '#E8B887',
  skin: '#F6C9A0', gray: '#BDC1C6', dark: '#3C4043', white: '#FFFFFF', sky: '#AECBFA', mint: '#CEEAD6',
  pink: '#F28B82', navy: '#1A3D8F', cream: '#FFF4D6', orange: '#F29900', purple: '#A142F4', black: '#202124'
};
const INK = '#3C4043';
const STYLES = ['flat', 'line'];

const s = (tag, attrs, color, opts = {}) => ({ tag, attrs, color, ...opts });

const fmt = (o) => Object.entries(o).map(([k, v]) => `${k}="${v}"`).join(' ');

function renderShape(sh, style) {
  const col = COLORS[sh.color];
  if (!col) throw new Error(`unknown color "${sh.color}"`);
  if (style === 'flat') {
    return `<${sh.tag} ${fmt(sh.stroke ? { ...sh.attrs, stroke: col } : { ...sh.attrs, fill: col })}/>`;
  }
  if (sh.flatOnly) return '';
  if (sh.stroke) {
    const lc = sh.lineColor ? COLORS[sh.lineColor] : (sh.color === 'white' ? INK : col);
    return `<${sh.tag} ${fmt({ ...sh.attrs, stroke: lc })}/>`;
  }
  const fill = sh.accent ? col : (['dark', 'black'].includes(sh.color) ? INK : '#fff');
  const { opacity, ...rest } = sh.attrs;
  return `<${sh.tag} ${fmt({ ...rest, fill, stroke: INK, 'stroke-width': 3, 'stroke-linejoin': 'round' })}/>`;
}

function render(shapes, style = 'flat') {
  if (!STYLES.includes(style)) throw new Error(`unknown style "${style}"`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">${shapes.map(sh => renderShape(sh, style)).join('')}</svg>`;
}

module.exports = { COLORS, STYLES, s, render };
