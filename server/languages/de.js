/**
 * German (de) — learning-language settings for the server.
 * UI-facing data lives in shared/languages/de.json; this module adds the AI prompt pieces.
 *
 * Card columns keep their historical Spanish names: definition_es / example_es hold the German
 * definition / example, dele_level holds the Goethe / CEFR level, and gender uses the shared
 * codes masculino / femenino / neutro.
 */
const base = require('../../shared/languages/de.json');

const FORM_KEYS = ['plural', 'genitive', 'praeteritum', 'partizip2', 'auxiliary', 'komparativ', 'superlativ'];

module.exports = {
  ...base,
  // Only nouns have a fixed gender; German adjectives are listed uninflected
  genderedPos: ['sustantivo'],
  ai: {
    expert: '精通德語教學與檢定（Goethe-Zertifikat / telc / TestDaF）的專業語言學專家',
    teacher: '德語老師',
    languageName: '德語',
    short: '德語',
    formKeys: FORM_KEYS,
    // The genitive is listed with its article (des Hauses)
    formsKeepArticle: ['genitive'],
    formsPos: ['sustantivo', 'verbo', 'adjetivo'],
    formsNoteMarker: '詞形變化',
    formatForms(forms) {
      if (!forms) return '';
      const parts = [];
      if (forms.plural) parts.push(`複數：die ${forms.plural}`);
      if (forms.genitive) parts.push(`屬格：${forms.genitive}`);
      if (forms.praeteritum || forms.partizip2) {
        const aux = { sein: 'ist ', haben: 'hat ' }[String(forms.auxiliary).toLowerCase()] || '';
        parts.push(`三態：${[forms.praeteritum, forms.partizip2 && `${aux}${forms.partizip2}`].filter(Boolean).join(' – ')}`);
      }
      if (forms.komparativ || forms.superlativ) {
        parts.push(`比較級：${[forms.komparativ, forms.superlativ && `am ${forms.superlativ}`].filter(Boolean).join(' – ')}`);
      }
      return parts.length ? `詞形變化 → ${parts.join('；')}` : '';
    },
    wordRules: `- word：單字原形（名詞不要加冠詞，但**名詞字首必須大寫**，例如 Haus、Freundin；ä ö ü ß 必須正確，不可寫成 ae / oe / ue / ss）
  - 動詞一律用不定式（gehen、arbeiten、sich freuen、anrufen），即使原文是變化形（例如 ging、rief … an）也要還原成原形，並在 notes 註明原文出現的形式。可分離動詞寫成完整不定式（anrufen），反身動詞前面加 sich。
  - 形容詞用不變化的原形（schön，不是 schöne / schönen）。
- article：陽性名詞填 "der"、陰性名詞填 "die"、中性名詞填 "das"，只有複數形的名詞（die Eltern）填 "die"；非名詞填 ""
- gender：**名詞必須填寫，不可留 none**
  - 名詞：der → "masculino"、die → "femenino"、das → "neutro"；只有複數形的名詞填 "none"
  - 其他詞性（包含形容詞）填 "none"
- forms：名詞、動詞、形容詞必填，不適用的欄位填 ""；其他詞性填 null
  - 名詞：plural 填複數（不加冠詞，沒有複數填 ""），genitive 填單數屬格並加冠詞 → Haus：{"plural":"Häuser","genitive":"des Hauses"}；Frau：{"plural":"Frauen","genitive":"der Frau"}
  - 動詞：praeteritum 填第三人稱單數過去式，partizip2 填第二分詞，auxiliary 填完成式助動詞 "haben" 或 "sein" → gehen：{"praeteritum":"ging","partizip2":"gegangen","auxiliary":"sein"}；anrufen：{"praeteritum":"rief an","partizip2":"angerufen","auxiliary":"haben"}
  - 形容詞：komparativ / superlativ（superlativ 只寫字幹，不加 am）→ gut：{"komparativ":"besser","superlativ":"besten"}；沒有比較級的形容詞填 ""`,
    definitionRule: '- definition_es：簡短的德文定義（欄位名稱沿用 _es，內容請寫德文）\n- example_es：實用、生活化或考試常考的德語例句（欄位名稱沿用 _es，內容請寫德文）',
    notesRule: '- notes：文法重點，例如不規則動詞、可分離字首、反身用法、動詞或形容詞固定搭配的介系詞與格位（warten auf + Akk.、helfen + Dat.）、名詞性別的規則（-ung / -heit / -keit 為陰性，-chen / -lein 為中性）',
    categoryRule: '- category：依內容分類，例如「日常生活」、「考試必背 (Goethe)」、「課堂筆記」',
    levelRule: '- dele_level：對應的 Goethe-Zertifikat / CEFR 級數 A1–C2（欄位名稱沿用 dele_level）',
    spellingRule: '所有德語變音與 ß（ä, ö, ü, Ä, Ö, Ü, ß）必須完全正確，名詞字首大寫。',
    photoPrompt: '請分析這張課堂教材/講義照片中的德語重點生詞並結構化輸出。',
    lemmaRule: '原形（動詞用不定式，可分離動詞要把字首接回去，例如 rief … an → anrufen；名詞用單數並大寫；形容詞用不變化的原形）',
    usageExample: '動詞寫出時態與人稱（例如「gehen 的過去式 Präteritum，第一人稱單數」）；名詞、代名詞與冠詞寫出格位（Nominativ / Akkusativ / Dativ / Genitiv）；可分離動詞的字首另成一筆，usage 註明屬於哪個動詞；也可以寫固定搭配或容易混淆的地方。',
    articlePos: '冠詞填 frase，usage 註明格位',
    grammarExamples: '文法，例如格位、動詞第二位、從句動詞放句尾、可分離動詞、完成式助動詞 haben / sein、形容詞詞尾變化',
    titleExample: '「weil + 動詞放句尾」',
    spellingErrors: '拼字、變音、大小寫、格位或文法錯誤',
    tenseNames: '現在式 (Präsens)、現在完成式 (Perfekt)、過去式 (Präteritum)、過去完成式 (Plusquamperfekt)、未來式 (Futur I)、虛擬式二式 (Konjunktiv II)、虛擬式一式 (Konjunktiv I)、命令式 (Imperativ)、被動式 (Passiv)',
    calibration: `- A1: 最基礎生存單字（例如: hallo, danke, Apfel, Buch, Schule, lernen, gut, sein, haben, essen, trinken, Tag, Wasser, Haus, klein）
- A2: 基礎日常生活交流（例如: Gewohnheit, entwickeln, reisen, Geschenk, Winter, Problem, verabreden）
- B1: 進階獨立表達、情感與常用抽象詞（例如: sich gewöhnen, wunderbar, Meinung, Gesellschaft, Erfolg）
- B2: 深度討論、專業與高級修辭
- C1/C2: 高階學術、文學與罕見專有名詞`,
    calibrationAuthority: '精通德語檢定（Goethe-Institut Goethe-Zertifikat / CEFR）權威專家'
  }
};
