/**
 * Spanish (es) — learning-language settings for the server.
 * UI-facing data (flag, TTS, articles, levels…) lives in shared/languages/es.json so the
 * web client reads the same file; this module adds the AI prompt pieces.
 */
const base = require('../../shared/languages/es.json');

const FORM_KEYS = ['masc_sg', 'fem_sg', 'masc_pl', 'fem_pl'];

module.exports = {
  ...base,
  // Parts of speech that carry a grammatical gender in the dictionary form
  genderedPos: ['sustantivo', 'adjetivo'],
  ai: {
    expert: '精通西班牙語教學與檢定（DELE / SIELE）的專業語言學專家',
    teacher: '西班牙語老師',
    languageName: '西班牙語',
    short: '西語',
    // Inflection table attached to cards (normalizeAiCard -> forms)
    formKeys: FORM_KEYS,
    formsPos: ['sustantivo', 'adjetivo'],
    formsNoteMarker: '陰陽性變化',
    formatForms(forms) {
      if (!forms) return '';
      const masc = [forms.masc_sg, forms.masc_pl].filter(Boolean).join(' / ');
      const fem = [forms.fem_sg, forms.fem_pl].filter(Boolean).join(' / ');
      const parts = [masc && `陽性：${masc}`, fem && `陰性：${fem}`].filter(Boolean);
      return parts.length ? `陰陽性變化 → ${parts.join('；')}` : '';
    },
    wordRules: `- word：單字原形（名詞不要加冠詞；保留正確重音）
  - 動詞一律用原形不定式（hablar、comer、vivir、acostumbrarse），即使原文是變化形（例如 fui、hablamos）也要還原成原形，並在 notes 註明原文出現的形式。
  - 形容詞用陽性單數（alto，不是 alta / altos）。
- article：陽性名詞填 "el"、陰性名詞填 "la"（注意 el agua 這類陰性名詞仍填 "el"），非名詞填 ""
- gender：**名詞與形容詞都必須填寫，不可留 none**
  - 名詞：依該名詞的文法性別填 "masculino" 或 "femenino"
  - 形容詞：word 是陽性形式就填 "masculino"；陰陽同形（feliz、grande、importante）才填 "none"
  - 其他詞性填 "none"
- forms：名詞與形容詞必填，列出陰陽性與單複數變化，不要加冠詞；不存在的形式填 ""
  - 形容詞 alto → {"masc_sg":"alto","fem_sg":"alta","masc_pl":"altos","fem_pl":"altas"}
  - 有陰陽兩種形式的名詞 profesor → {"masc_sg":"profesor","fem_sg":"profesora","masc_pl":"profesores","fem_pl":"profesoras"}
  - 只有單一性別的名詞 problema → {"masc_sg":"problema","fem_sg":"","masc_pl":"problemas","fem_pl":""}
  - 動詞、副詞等其他詞性填 null`,
    definitionRule: '- definition_es：簡短的西班牙文定義\n- example_es：實用、生活化或考試常考的西語例句',
    notesRule: '- notes：文法重點、不規則變化、常用介系詞搭配（例如 -ma 結尾的陽性名詞）',
    categoryRule: '- category：依內容分類，例如「日常生活」、「考試必背 (DELE)」、「課堂筆記」',
    levelRule: '- dele_level：對應的 DELE 級數 A1–C2',
    spellingRule: '所有西語重音（á, é, í, ó, ú, ñ, ü）必須完全正確。',
    photoPrompt: '請分析這張課堂教材/講義照片中的西語重點生詞並結構化輸出。',
    lemmaRule: '原形（動詞用不定式、名詞用單數、形容詞用陽性單數）',
    usageExample: '動詞寫出時態與人稱（例如「ir 的簡單過去式，第一人稱單數」）；也可以寫固定搭配、片語或容易混淆的地方。屬於片語的字（例如 a pesar de）每個字各一筆，usage 註明是哪個片語。',
    articlePos: '冠詞填 frase',
    grammarExamples: '文法，例如時態、gustar 句型、受詞代名詞、虛擬式',
    titleExample: '「me gusta + 單數名詞」',
    spellingErrors: '拼字、重音或文法錯誤',
    tenseNames: '陳述式現在式、簡單過去式、過去未完成式、未來式、條件式、虛擬式現在式、虛擬式過去式、命令式、現在完成式',
    calibration: `- A1: 最基礎生存單字（例如: hola, gracias, manzana, libro, escuela, estudiante, aprender, feliz, ser, estar, comer, beber, día, agua, casa, número, pequeño）
- A2: 基礎日常生活交流（例如: costumbre, desarrollar, viajar, tiempo, regalo, invierno, problema）
- B1: 進階獨立表達、情感與常用抽象詞（例如: acostumbrarse, maravilloso, opinión, sociedad, éxito）
- B2: 深度討論、專業與高級修辭
- C1/C2: 高階學術、文學與罕見專有名詞`,
    calibrationAuthority: '精通西班牙語檢定（Instituto Cervantes DELE / CEFR）權威專家'
  }
};
