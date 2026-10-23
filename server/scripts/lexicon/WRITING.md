# 撰寫說明：PalabraCard A1 字源圖鑑

> 產生事實底稿：`node server/scripts/lexicon/fetch-facts.js <facts> --list words.txt`（底稿不進 Git）。

你負責為一批西班牙語 A1 單字撰寫字典條目和插圖規格。讀者是**台灣的中文母語者**，正在學 A1 西語。
目標：每個字有可靠的字源故事（有事實根據）、好記的聯想、插圖，讓背單字有趣。

## 參考範例（必讀）
- 條目範例：`server/data/lexicon/a1/pilot.json`（20 字，品質與語氣標準）
- 插圖規格範例：`server/data/lexicon/art/pilot.js`
- 插圖規格說明與色票：`server/scripts/lexicon/art.js`
- 驗證規則：`server/scripts/lexicon/validate.js`

## 事實底稿
每個字的 Wiktionary 事實在 `<facts>/<word>.json`（`entries`＝西語詞條：釋義、IPA、詞源文字、例句；`ancestors`＝往上追到的拉丁文等祖先詞條，可能含同形異義詞，要挑和詞源相符的那個）。檔案不存在或沒有詞源時，就是沒有可靠字源。片語的檔名含空格。若底稿有 `base` 欄位（例如 levantarse 的 base 是 levantar、vacaciones 的 base 是 vacación），表示底稿是基本形的資料，故事要說明兩者的關係。

## 輸出
1. 條目：`server/data/lexicon/a1/<OUT>.json`，格式 `{ "theme": "<theme id>", "theme_zh": "<主題中文>", "entries": [ ... ] }`，順序照字表。
2. 插圖規格：`server/data/lexicon/art/<OUT>.js`，格式同 pilot.js（`module.exports = { word: [ s(...), ... ] }`），key 用和條目完全相同的 word。
**只能建立 / 修改這兩個檔案**，不要動其他任何檔案（其他人同時在寫別的主題）。

## 條目欄位（全部必填，用繁體中文、台灣用語）
- `word`：原形，名詞不加冠詞；片語照字表（例如 "por favor"）。
- `article`：名詞填 "el" 或 "la"（el agua 這類陰性但用 el 的填 "el"；陰陽同形的人名詞如 estudiante 填 "el"，在 usage_zh 註明 la estudiante）；非名詞填 ""。
- `pos`：sustantivo / verbo / adjetivo / adverbio / frase / conjunción / preposición / pronombre / interjección / artículo / determinante / numeral。
- `zh`：精準簡短的中文意思（≤40 字）。`en`：英文（≤60 字元）。`ipa`：用底稿第一個 IPA；沒有就自己寫西班牙本土發音（/.../）。
- `breakdown`：有清楚構詞（字首 / 字根 / 字尾）才填 `[{part, zh}]`，否則 `[]`。
- `origin_chain`：從最早可靠的祖先到西語，每層 `{lang_zh, word, zh}`。**只寫底稿裡有的層**。沒有詞源就 `[]`。不要列原始印歐語（Proto-Indo-European）這類重建形，除非它是故事重點。
- `cognates_en`：英文同源字，只放確定同源、而且台灣學生認得的英文字（底稿的 `cog en`、或從同一個拉丁字來的常見英文字）。沒有就 `[]`。
- `story_zh`：字源故事 2–4 句（≤220 字）。**只能根據底稿的事實寫**；底稿說 uncertain / possibly / tentative 就要照實說「可能、推測」。不要加底稿沒有的歷史細節。沒有詞源 → 填 ""，`confidence` 填 "hook-only"。
- `hook_zh`：記憶聯想（≤80 字），可以用英文同源字、畫面、諧音、和已學的字連結、或常見錯誤提醒。這欄可以用一般常識，但不能聲稱是字源。要有畫面感、好記、不尷尬。
- `usage_zh`：一句文法或用法提醒（≤90 字，可為 ""）：不規則變化、陰陽性陷阱、常見搭配、假朋友。
- `example_es` / `example_zh`：A1 程度、自然、生活化的短句（西語 ≤90 字元，中文 ≤60 字）。例句必須含這個字（或它的規則變化形；驗證器會檢查前幾個字母，不規則動詞請選含原形或規則形的句子）。
- `image`："svg"（有畫插圖）或 "emoji:🙂"（功能詞、太抽象或不好畫的字可以用一個 emoji）。
- `confidence`："sourced"（有底稿字源，story_zh / origin_chain 非空）或 "hook-only"。
- `sources`：`["wiktionary:es:<word>", "wiktionary:la:<拉丁頁名>"]`，列出實際用到的底稿頁（拉丁頁名不含長音符號）。hook-only 也至少列 `wiktionary:es:<word>`（若底稿存在）。

## 插圖規格
- viewBox 160×160，主體放在約 12–148 的範圍、置中；3–10 個 shape；每個 SVG 渲染後 ≤4KB。
- 只用 art.js 的色票 key；至少一個 shape 加 `{ accent: true }`（線條版會保留它的顏色）。stroke 類 shape 要有 `fill: 'none'` 和 `stroke-width`，並加 `{ stroke: true }`。
- 風格：扁平、簡單、一眼認得（像 pilot 的 manzana、casa、perro）。具體名詞畫實物；動作畫人物或動作符號；抽象字畫故事或聯想裡的畫面（像 preocupar 的烏雲、ojalá 的流星）。不要用文字（不能用 <text>）。
- 人物：圓頭（skin）+ 圓角身體（彩色），像 pilot 的 hermano。
- 不好畫、或畫了也無助記憶的字 → 用 emoji，不寫規格。

## 驗證（寫完後必做，問題全部修好）
```
cd <repo>
node server/scripts/lexicon/render-art.js flat --only <OUT>
node server/scripts/lexicon/validate.js --only <OUT>
node <contact-sheet script> <OUT>     # 產生插圖總覽 PNG，用 Read 看一次，修掉看不出是什麼、跑出邊界、顏色錯亂的圖
```
不要 git commit。完成後回報：條目數、sourced / hook-only / emoji 數量、驗證結果、你沒把握的字（最多 10 個，附原因）。

---

# 常用字（`freq/`）：Gemini 撰寫 + Claude 畫圖

A1 以外的字依使用頻率往下做，每 100 個原形一批（`freq/0001.json`、`0002.json`…）。文字交給 Gemini，**回答直接寫進檔案、不給 Claude 看**，由程式檢查把關；Claude 只畫圖。

```bash
W=<工作資料夾，不進 Git>
# 1. 頻率字表（wordfreq 只是工具，不是專案依賴）
pip install wordfreq
python3 -I -c "from wordfreq import top_n_list; import re; print('\n'.join(w for w in top_n_list('es', 40000) if re.fullmatch(r'[a-záéíóúüñ]+', w)))" > $W/freq.txt
# 2. Wiktionary 事實（kaikki.org；可中斷，已抓的會跳過）
NODE_USE_ENV_PROXY=1 node server/scripts/lexicon/fetch-facts.js $W/facts --list $W/freq.txt
# 3. 批次字表：變化形併入原形、跳過 A1 已有的字和專有名詞；停在第一個還沒抓到事實的字，所以批次編號固定
node server/scripts/lexicon/build-queue.js $W/freq.txt $W/facts $W/queue.json
# 4. Gemini 撰寫（只印每批的數量；不合格的字在 $W/failed.json，重跑會再試）
NODE_USE_ENV_PROXY=1 node server/scripts/lexicon/gemini-write.js $W/queue.json --batches 0001-0005
# 5. 畫圖：只讀這份清單，寫 server/data/lexicon/art/freq-<批次>.js
node server/scripts/lexicon/draw-list.js 0001
node server/scripts/lexicon/render-art.js flat --only freq-0001
node server/scripts/lexicon/mark-drawn.js 0001
node server/scripts/lexicon/validate.js --only freq/0001
```

- `NODE_USE_ENV_PROXY=1` 只在要經過 HTTPS proxy 時需要（雲端環境）。
- 機器檢查（`geminiEntries.js`）：schema 與長度、繁體中文、字源鏈每個祖先字都要在事實裡、`sources` 只能是抓過的頁面；事實沒有詞源 → hook-only。
- 插圖規則同上面的「插圖規格」，但**每個字都畫**：抽象字、功能詞畫記憶聯想裡的畫面或用法情境。
