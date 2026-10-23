import React, { useEffect, useState } from 'react';
import { Copy, Check, AlertTriangle } from 'lucide-react';
import { fetchAPI } from '../utils/api';

// Injected by vite.config.js at build time
const CLIENT = typeof __APP_BUILD__ !== 'undefined' ? __APP_BUILD__ : { version: '?', commit: 'unknown', branch: 'unknown', builtAt: '' };

const formatTime = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString('zh-TW', { hour12: false });
};

function describeDictionary(dict) {
  if (!dict) return '';
  if (!dict.exists) return '沒有字典檔';
  if (dict.entries === 0) return `只有字源圖鑑（${dict.lexiconEntries} 字），沒有 Wiktionary 詞條`;
  const extras = [dict.extras.forms && '變位', dict.extras.etymology && '字源', dict.extras.examples && '例句', dict.extras.ipa && '發音'].filter(Boolean);
  return `v${dict.schemaVersion} · ${dict.entries.toLocaleString()} 筆${extras.length ? ` · 含${extras.join('、')}` : ''}${dict.lexiconEntries ? ` · 字源圖鑑 ${dict.lexiconEntries} 字` : ''}`;
}

/** Settings → 版本資訊: which build of the page, the server and the dictionary are in use. */
export default function VersionInfo() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchAPI('/api/version')
      .then(async res => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.error || '讀取版本資訊失敗');
        if (!cancelled) setData(body);
      })
      .catch(err => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, []);

  const server = data?.server;
  const dict = data?.dictionary;
  const mismatch = server && CLIENT.commit !== 'unknown' && server.commit !== 'unknown' && CLIENT.commit !== server.commit;
  const oldDictionary = dict && dict.exists && dict.entries > 0 && dict.schemaVersion < 2;

  const rows = [
    ['畫面（前端）', `${CLIENT.branch} @ ${CLIENT.commit}`, `build 於 ${formatTime(CLIENT.builtAt)}`],
    ['伺服器', server ? `${server.branch} @ ${server.commit}` : '…', server ? `啟動於 ${formatTime(server.startedAt)} · Node ${server.node}` : ''],
    ['字典', dict ? describeDictionary(dict) : '…', dict?.builtAt ? `建置於 ${formatTime(dict.builtAt)}` : ''],
    ['我的單字', data ? `已連結字典 ${data.cards.linked} / ${data.cards.total}` : '…', '']
  ];

  const plainText = [
    `PalabraCard ${CLIENT.version}`,
    ...rows.map(([label, value, note]) => `${label}: ${value}${note ? ` (${note})` : ''}`),
    server ? `伺服器資料夾: ${server.cwd}` : '',
    dict ? `字典檔: ${dict.path}` : ''
  ].filter(Boolean).join('\n');

  const handleCopy = async (e) => {
    try {
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (_) {
      // Clipboard blocked: select the text so it can be copied by hand
      const box = e.currentTarget.closest('.version-info')?.querySelector('.version-rows');
      if (box) window.getSelection()?.selectAllChildren(box);
    }
  };

  return (
    <div className="version-info">
      <div className="version-head">
        <span className="version-title">版本資訊</span>
        <button type="button" className="btn btn-secondary btn-sm" onClick={handleCopy}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? '已複製' : '複製版本資訊'}</span>
        </button>
      </div>

      {mismatch && (
        <div className="version-warning">
          <AlertTriangle size={14} />
          <span>畫面和伺服器不是同一個版本（{CLIENT.commit} ≠ {server.commit}）。請在伺服器所在的資料夾執行 <code>cd client &amp;&amp; npm run build</code>，再重新啟動並重新整理頁面。</span>
        </div>
      )}
      {dict && !dict.exists && (
        <div className="version-warning">
          <AlertTriangle size={14} />
          <span>沒有離線字典：查不到變化形、變位與字源。建置方式見 README（<code>npm run build:dict</code>）。</span>
        </div>
      )}
      {oldDictionary && (
        <div className="version-warning">
          <AlertTriangle size={14} />
          <span>字典是舊版（v{dict.schemaVersion}），沒有變位、字源與例句。重新執行 <code>npm run build:dict</code> 即可升級。</span>
        </div>
      )}
      {error && <div className="lookup-error">{error}</div>}

      <dl className="version-rows">
        {rows.map(([label, value, note]) => (
          <div key={label} className="version-row">
            <dt>{label}</dt>
            <dd>
              <span className="version-value">{value}</span>
              {note && <span className="version-note">{note}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
