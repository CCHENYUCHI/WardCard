import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Plus, Check, ExternalLink, Table2 } from 'lucide-react';
import { lookupWord, analyzeSentence, aiLookup, addToInbox, POS_LABELS, genderLabel, describeForm, STATUS_LABELS } from '../utils/dictionary';
import { displayWord, normalizeAnswer, stripAccents } from '../utils/spanish';
import SpeakButton from './SpeakButton';
import StoryCard from './StoryCard';
import DictionaryExtras from './DictionaryExtras';
import FormsModal from './FormsModal';

const sameWord = (a, b) => stripAccents(normalizeAnswer(a)) === stripAccents(normalizeAnswer(b));
const ARTICLE_BY_GENDER = { masculino: 'el', femenino: 'la' };
const GENDER_BY_ARTICLE = { el: 'masculino', la: 'femenino' };
const CARD_POS = new Set(Object.keys(POS_LABELS));
// Parts of speech the dictionary has conjugation / gender-number tables for
const HAS_FORMS = new Set(['verb', 'noun', 'adj']);
// Nouns are read with their article (la casa), like the rest of the app
const wiktSpeech = (item) => (
  item.part_of_speech === 'sustantivo' && ARTICLE_BY_GENDER[item.gender]
    ? `${ARTICLE_BY_GENDER[item.gender]} ${item.lemma}`
    : item.lemma
);

/**
 * Lookup result for one word: my cards, AI context / entry, offline Wiktionary meanings, actions.
 * Shared by the tap-a-word popover (compact, with a sentence) and the dictionary page.
 *
 * @param {string} word - The word to look up
 * @param {string} [sentence] - Full (unmasked) sentence the word was tapped in
 * @param {string} [exampleZh] - Chinese translation of that sentence, if the card has one
 * @param {object} [analysis] - Sentence analysis already fetched by the parent
 * @param {(analysis) => void} [onAnalyzed] - Lets the parent reuse one analysis for every word
 * @param {'dictionary'|'tap'} [origin] - Where the lookup came from, for the lookup history
 * @param {() => void} [onUpdate] - Called after the lookup, an AI lookup or adding a card (history may have changed)
 * @param {boolean} [compact] - Popover mode: fewer meanings, no external links
 */
export default function WordLookupPanel({ word, sentence = '', exampleZh = '', analysis = null, onAnalyzed, origin = 'dictionary', onUpdate, compact = false }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [aiBusy, setAiBusy] = useState(false);
  const [aiCard, setAiCard] = useState(null);
  const [addState, setAddState] = useState('idle'); // idle | busy | added | exists
  const [formsFor, setFormsFor] = useState(null); // { lemma, pos } shown in the forms window
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;
  const notifyUpdate = () => onUpdateRef.current?.();

  useEffect(() => {
    let cancelled = false;
    setResult(null);
    setError('');
    setAiCard(null);
    setAddState('idle');
    lookupWord(word, sentence, { origin })
      .then(data => { if (!cancelled) { setResult(data); notifyUpdate(); } })
      .catch(err => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, [word, sentence, origin]);

  if (!result) {
    return (
      <div className="lookup-panel">
        <div className="lookup-head"><span className="lookup-word">{word}</span><SpeakButton text={word} /></div>
        {error ? <div className="lookup-error">{error}</div> : <div className="spinner lookup-spinner" />}
      </div>
    );
  }

  const context = result.context || analysis?.tokens?.find(t => sameWord(t.text, word)) || null;
  const sentenceZh = result.translation_zh || analysis?.translation_zh || exampleZh;
  const myCards = result.myCards || [];
  const entry = aiCard || result.aiEntry;
  const wiktionary = result.wiktionary || [];
  const story = result.story || null;
  const lemma = context?.lemma || myCards[0]?.word || entry?.word || wiktionary[0]?.lemma || story?.word || word;
  const zh = context?.zh || myCards[0]?.translation || entry?.translation || story?.zh || '';
  const meaningsShown = compact ? 2 : 6;

  const handleAnalyze = async () => {
    setAiBusy(true);
    setError('');
    try {
      onAnalyzed?.(await analyzeSentence(sentence));
    } catch (err) {
      setError(err.message);
    } finally {
      setAiBusy(false);
    }
  };

  const handleAiLookup = async () => {
    setAiBusy(true);
    setError('');
    try {
      setAiCard(await aiLookup(wiktionary[0]?.lemma || word));
      notifyUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setAiBusy(false);
    }
  };

  const handleAdd = async () => {
    setAddState('busy');
    setError('');
    try {
      let card = entry;
      if (!card && context) {
        // Build the card from the sentence analysis: no extra AI call
        const wikt = wiktionary.find(w => w.lemma === context.lemma);
        const gender = context.pos === 'sustantivo' || context.pos === 'adjetivo' ? (wikt?.gender || 'none') : 'none';
        card = {
          word: context.lemma,
          article: context.pos === 'sustantivo' ? ({ masculino: 'el', femenino: 'la' }[gender] || '') : '',
          gender,
          part_of_speech: context.pos,
          translation: context.zh,
          english_translation: wikt?.glosses?.[0] || '',
          example_es: sentence,
          example_zh: sentenceZh || '',
          notes: context.usage
        };
      }
      if (!card && story) {
        // The hand-written lexicon already has everything a card needs: no AI call
        const wikt = wiktionary.find(w => w.lemma === story.word);
        card = {
          word: story.word,
          article: story.article,
          gender: wikt?.gender && wikt.gender !== 'none' ? wikt.gender : (GENDER_BY_ARTICLE[story.article] || 'none'),
          part_of_speech: CARD_POS.has(story.pos) ? story.pos : 'frase',
          translation: story.zh,
          english_translation: story.en,
          example_es: story.example_es,
          example_zh: story.example_zh,
          notes: story.usage_zh
        };
      }
      if (!card) card = await aiLookup(wiktionary[0]?.lemma || word); // translation is required
      const res = await addToInbox(card);
      setAddState(res.created ? 'added' : 'exists');
      notifyUpdate();
    } catch (err) {
      setError(err.message);
      setAddState('idle');
    }
  };

  const nothingFound = !zh && wiktionary.length === 0 && myCards.length === 0 && !story;

  return (
    <div className="lookup-panel">
      <div className="lookup-head">
        <span className="lookup-word">{word}</span>
        <SpeakButton text={word} />
        {!sameWord(lemma, word) && (
          <span className="lookup-lemma">→ {lemma}<SpeakButton text={lemma} /></span>
        )}
        {context?.pos && <span className="badge-subtle">{POS_LABELS[context.pos] || context.pos}</span>}
      </div>

      {zh && <div className="lookup-zh">{zh}</div>}
      {context?.usage && <div className="lookup-usage">💡 {context.usage}</div>}

      {myCards.map(c => (
        <div key={c.id} className="lookup-mycard">
          <span>📗 我的單字：<strong>{displayWord(c)}</strong><SpeakButton text={displayWord(c)} /> — {c.translation}</span>
          <span className="lookup-status">
            {STATUS_LABELS[c.lifecycle_status] || c.lifecycle_status}
            {c.lifecycle_status === 'active' && c.mastery_stage ? ` · S${c.mastery_stage}` : ''}
          </span>
        </div>
      ))}

      {entry && myCards.length === 0 && (
        <div className="lookup-ai-entry">
          <div><strong>{entry.article ? `${entry.article} ` : ''}{entry.word}</strong>
            <SpeakButton text={entry.article ? `${entry.article} ${entry.word}` : entry.word} />
            {' '}<span className="lookup-pos">{POS_LABELS[entry.part_of_speech] || ''}</span>
            {' — '}{entry.translation}
          </div>
          {!compact && entry.definition_es && <div className="lookup-sub">{entry.definition_es}</div>}
          {!compact && entry.example_es && (
            <div className="lookup-example">
              <div>{entry.example_es}<SpeakButton text={entry.example_es} /></div>
              {entry.example_zh && <div className="lookup-sub">{entry.example_zh}</div>}
            </div>
          )}
          {!compact && entry.notes && <div className="lookup-sub lookup-notes">{entry.notes}</div>}
        </div>
      )}

      <StoryCard story={story} compact={compact} />

      {wiktionary.slice(0, meaningsShown).map(item => (
        <div key={`${item.lemma}|${item.pos}`} className="lookup-wikt">
          <div>
            <strong>{item.lemma}</strong>
            <SpeakButton text={wiktSpeech(item)} />
            <span className="lookup-pos">{POS_LABELS[item.part_of_speech] || item.pos}{genderLabel(item.gender) ? ` · ${genderLabel(item.gender)}` : ''}</span>
            {!compact && item.glosses.length > 0 && HAS_FORMS.has(item.pos) && (
              <button type="button" className="btn btn-secondary btn-sm lookup-forms-btn" onClick={() => setFormsFor({ lemma: item.lemma, pos: item.pos })}>
                <Table2 size={13} /> {item.pos === 'verb' ? '變位表' : '變化表'}
              </button>
            )}
          </div>
          {item.via && <div className="lookup-via">{item.lemma} 的 {describeForm(item.via)}</div>}
          {item.glosses.length > 0 && (
            <div className="lookup-gloss">{item.glosses.slice(0, compact ? 2 : 4).join('；')}</div>
          )}
          {!compact && item.glosses.length > 0 && <DictionaryExtras lazy lemma={item.lemma} pos={item.pos} />}
        </div>
      ))}

      {nothingFound && (
        <div className="lookup-sub">
          {result.hasOfflineDictionary ? '離線字典與單字庫都沒有這個字。' : '單字庫裡沒有這個字（伺服器未安裝離線字典）。'}
        </div>
      )}

      {error && <div className="lookup-error">{error}</div>}

      <div className="lookup-actions">
        {!zh && (sentence && !analysis ? (
          <button className="btn btn-ai btn-sm" onClick={handleAnalyze} disabled={aiBusy}>
            <Sparkles size={14} /> {aiBusy ? '解析中…' : 'AI 解析這句'}
          </button>
        ) : !entry && (
          <button className="btn btn-ai btn-sm" onClick={handleAiLookup} disabled={aiBusy}>
            <Sparkles size={14} /> {aiBusy ? '查詢中…' : '用 AI 查中文'}
          </button>
        ))}

        {myCards.length === 0 && addState !== 'added' && addState !== 'exists' && (
          <button className="btn btn-secondary btn-sm" onClick={handleAdd} disabled={addState === 'busy' || aiBusy}>
            <Plus size={14} /> {addState === 'busy' ? '加入中…' : '加入單字庫'}
          </button>
        )}
        {addState === 'added' && <span className="lookup-added"><Check size={14} /> 已加入暫存箱</span>}
        {addState === 'exists' && <span className="lookup-added"><Check size={14} /> 已在單字庫</span>}
      </div>

      {!compact && (
        <div className="lookup-links">
          <a href={result.links.wordreference} target="_blank" rel="noreferrer">WordReference <ExternalLink size={12} /></a>
          <a href={result.links.spanishdict} target="_blank" rel="noreferrer">SpanishDict <ExternalLink size={12} /></a>
          <a href={result.links.rae} target="_blank" rel="noreferrer">RAE <ExternalLink size={12} /></a>
        </div>
      )}

      {wiktionary.length > 0 && <div className="lookup-credit">英文釋義：Wiktionary · CC BY-SA</div>}
      {formsFor && <FormsModal lemma={formsFor.lemma} pos={formsFor.pos} onClose={() => setFormsFor(null)} />}
    </div>
  );
}
