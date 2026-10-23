// Wiktionary language codes (as used in etymology templates) -> Chinese names shown in the origin chain
const LANG_ZH = {
  es: '西班牙語', osp: '古西班牙語', la: '拉丁語', 'la-vul': '通俗拉丁語', 'la-lat': '晚期拉丁語', 'la-med': '中世紀拉丁語',
  'la-new': '新拉丁語', 'la-ecc': '教會拉丁語', ar: '阿拉伯語', xaa: '安達魯斯阿拉伯語', fa: '波斯語', 'fa-cls': '古典波斯語',
  pal: '中古波斯語', grc: '古希臘語', el: '希臘語', gkm: '拜占庭希臘語', fr: '法語', fro: '古法語', frm: '中古法語',
  it: '義大利語', pt: '葡萄牙語', gl: '加利西亞語', ca: '加泰隆尼亞語', oc: '奧克語', ast: '阿斯圖里亞斯語', lad: '拉迪諾語',
  en: '英語', ang: '古英語', enm: '中古英語', de: '德語', goh: '古高地德語', gmh: '中古高地德語', nl: '荷蘭語',
  'gem-pro': '原始日耳曼語', got: '哥德語', 'ine-pro': '原始印歐語', 'itc-pro': '原始義大利語', 'ine-ana-pro': '原始安那托利亞語',
  nci: '古典納瓦特爾語', nah: '納瓦特爾語', qu: '蓋丘亞語', ay: '艾馬拉語', arw: '阿拉瓦克語', tnq: '泰諾語', gn: '瓜拉尼語',
  myn: '瑪雅語', eu: '巴斯克語', xib: '伊比利語', 'cel-gau': '高盧語', xtg: '高盧語', 'cel-pro': '原始凱爾特語', sa: '梵語',
  'inc-pro': '原始印度-雅利安語', 'iir-pro': '原始印度-伊朗語', hbo: '古希伯來語', he: '希伯來語', tr: '土耳其語',
  ota: '鄂圖曼土耳其語', ja: '日語', zh: '漢語', 'nan-hbl': '閩南語', ru: '俄語', pl: '波蘭語', ro: '羅馬尼亞語',
  sq: '阿爾巴尼亞語', hu: '匈牙利語', sw: '斯瓦希里語', wo: '沃洛夫語', kik: '吉庫尤語', bnt: '班圖語', 'bnt-pro': '原始班圖語'
};

const langName = (code) => LANG_ZH[code] || code;

module.exports = { LANG_ZH, langName };
