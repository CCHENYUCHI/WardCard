import React from 'react';
import { Volume2, AlertTriangle, Repeat } from 'lucide-react';
import TappableSentence from './TappableSentence';
import { playSpanishPronunciation } from '../utils/speech';

const POINT_LABELS = {
  grammar: '文法',
  idiom: '慣用語',
  usage: '用法',
  culture: '文化',
  mistake: '易錯'
};

function SpanishLine({ text, zh, className = '' }) {
  return (
    <div className={`tr-es-line ${className}`}>
      <span className="tr-es-text">
        <TappableSentence sentence={text} exampleZh={zh} />
      </span>
      <button
        type="button"
        className="btn-icon tr-speak"
        onClick={() => playSpanishPronunciation(text)}
        title="朗讀"
        aria-label="朗讀"
      >
        <Volume2 size={16} />
      </button>
    </div>
  );
}

/** One translation record: the sentence (tap any word to look it up), translations and key points. */
export default function TranslationResult({ record }) {
  const { input_text, source_lang, spanish, correction, translation_zh, translation_en, points = [], alternatives = [] } = record;

  return (
    <div className="tr-result">
      {source_lang === 'zh' && <div className="tr-source">{input_text}</div>}

      <SpanishLine text={spanish} zh={translation_zh} className="tr-main" />

      <div className="tr-translations">
        {translation_zh && <div className="tr-zh">{translation_zh}</div>}
        {translation_en && <div className="tr-en">{translation_en}</div>}
      </div>

      {correction && (
        <div className="tr-correction">
          <AlertTriangle size={16} />
          <span>{correction}</span>
        </div>
      )}

      <div className="tr-points">
        {points.map((p, i) => (
          <section key={i} className={`tr-point tr-point--${p.type}`}>
            <div className="tr-point-head">
              <span className="tr-point-tag">{POINT_LABELS[p.type] || '用法'}</span>
              <span className="tr-point-title">{p.title}</span>
            </div>
            <p className="tr-point-body">{p.explanation}</p>
            {p.examples?.length > 0 && (
              <ul className="tr-examples">
                {p.examples.map((ex, j) => (
                  <li key={j}>
                    <SpanishLine text={ex.es} zh={ex.zh} />
                    {ex.zh && <div className="tr-example-zh">{ex.zh}</div>}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {alternatives.length > 0 && (
        <div className="tr-alternatives">
          <div className="tr-section-title"><Repeat size={14} /> 其他說法</div>
          <ul className="tr-examples">
            {alternatives.map((alt, i) => (
              <li key={i}>
                <SpanishLine text={alt.es} zh={alt.zh} />
                <div className="tr-example-zh">
                  {alt.zh}
                  {alt.note && <span className="tr-alt-note"> · {alt.note}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
