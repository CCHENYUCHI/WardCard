import { fetchAPI } from '../utils/api';
import React, { useState, useEffect } from 'react';
import { X, Key, Check, Volume2, Download, Upload, ExternalLink, ShieldCheck } from 'lucide-react';
import { playSpanishPronunciation, getTtsMode, setTtsMode, TTS_MODES } from '../utils/speech';

export default function SettingsModal({ isOpen, onClose, cards, onImportBackup }) {
  const [apiKey, setApiKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [ttsMode, setTtsModeState] = useState(TTS_MODES.AUTO);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [dailyQuota, setDailyQuota] = useState(15);
  const [targetRetention, setTargetRetention] = useState(0.9);

  useEffect(() => {
    const key = localStorage.getItem('gemini_api_key') || '';
    setApiKey(key);
    setTtsModeState(getTtsMode());

    // Fetch user study preferences
    if (isOpen) {
      fetchAPI('/api/user/settings')
        .then(res => res.json())
        .then(data => {
          if (data) {
            if (data.daily_new_quota) setDailyQuota(data.daily_new_quota);
            if (data.target_retention) setTargetRetention(data.target_retention);
          }
        })
        .catch(err => console.error('Failed to load user settings:', err));
    }
  }, [isOpen]);

  const handleSaveStudySettings = async () => {
    try {
      await fetchAPI('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          daily_new_quota: Number(dailyQuota),
          target_retention: Number(targetRetention)
        })
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to save study settings:', err);
    }
  };

  if (!isOpen) return null;

  const handleSaveKey = () => {
    localStorage.setItem('gemini_api_key', apiKey.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cards, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `palabracard-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (Array.isArray(json)) {
          await onImportBackup(json);
          alert(`成功匯入 ${json.length} 個單字！`);
          onClose();
        } else {
          alert('備份格式不正確');
        }
      } catch (err) {
        alert('解析 JSON 備份檔失敗：' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleCsvImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetchAPI('/api/cards/upload-csv', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        alert(`成功從 CSV 匯入/更新 ${data.count} 個單字！(原有複習進度不受影響)`);
        if (onImportBackup) onImportBackup([]); // Trigger a refresh without passing backup data
        onClose();
      } else {
        alert('CSV 匯入失敗：' + data.error);
      }
    } catch (err) {
      alert('CSV 匯入發生錯誤：' + err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">系統與 AI 設定</h2>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Gemini API Key Setting */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Key size={18} style={{ color: 'var(--accent-primary)' }} />
            <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>
              Google Gemini API Key
            </label>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            用於 AI 快速拍照及筆記西語萃取（免費版 Gemini 1.5 Flash 每天提供大量免費額度，無需綁卡即可申請）：
          </p>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="password"
              className="form-input"
              placeholder="貼上 AIzaSy..."
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              id="settings-api-key-input"
            />
            <button className="btn btn-primary" onClick={handleSaveKey}>
              {savedSuccess ? <Check size={18} /> : '儲存'}
            </button>
          </div>

          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#818cf8', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
            >
              <span>前往 Google AI Studio 免費領取 Key</span>
              <ExternalLink size={12} />
            </a>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              也可直接設定於伺服端 .env
            </span>
          </div>
        </div>

        {/* FSRS Learning Preferences */}
        <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '8px' }}>
            🧠 FSRS 記憶調度與每日配額
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            控制每日從待學庫存中自動推薦的新單字上限，以及目標記憶保持率：
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                每日新詞配額 (字/天)
              </label>
              <select
                className="select-custom"
                value={dailyQuota}
                onChange={e => setDailyQuota(Number(e.target.value))}
                style={{ width: '100%' }}
              >
                <option value={10}>10 字 (輕鬆起步)</option>
                <option value={15}>15 字 (標準推薦)</option>
                <option value={20}>20 字 (密集衝刺)</option>
                <option value={30}>30 字 (高強度)</option>
                <option value={50}>50 字 (極限)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                目標記憶留存率 (Retention)
              </label>
              <select
                className="select-custom"
                value={targetRetention}
                onChange={e => setTargetRetention(Number(e.target.value))}
                style={{ width: '100%' }}
              >
                <option value={0.85}>85% (較長複習間隔)</option>
                <option value={0.90}>90% (黃金科學標準)</option>
                <option value={0.95}>95% (高頻率超強固化)</option>
              </select>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <button className="btn btn-secondary btn-sm" onClick={handleSaveStudySettings}>
              {savedSuccess ? <Check size={14} /> : '套用學習設定'}
            </button>
          </div>
        </div>

        {/* Pronunciation Test & Engine Settings */}
        <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '2px' }}>西班牙語真人發音測試</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>支援行動版 Safari、iOS、Android 與電腦瀏覽器</div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              disabled={isPlayingAudio}
              onClick={() => {
                setIsPlayingAudio(true);
                const audioObj = playSpanishPronunciation('¡Hola! Bienvenidos a PalabraCard. ¿Cómo estás hoy?');
                if (audioObj && audioObj.addEventListener) {
                  audioObj.addEventListener('ended', () => setIsPlayingAudio(false));
                  audioObj.addEventListener('error', () => setIsPlayingAudio(false));
                } else {
                  setTimeout(() => setIsPlayingAudio(false), 2600);
                }
              }}
            >
              <Volume2 size={16} />
              <span>{isPlayingAudio ? '播放中...' : '試聽西語'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '10px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>發音引擎：</span>
            <select
              className="select-custom"
              style={{ padding: '4px 8px', fontSize: '0.8rem' }}
              value={ttsMode}
              onChange={(e) => {
                const newMode = e.target.value;
                setTtsModeState(newMode);
                setTtsMode(newMode);
              }}
            >
              <option value={TTS_MODES.AUTO}>智慧自動 (推薦：電腦原生極速、手機高音質串流)</option>
              <option value={TTS_MODES.ONLINE}>線上清晰發音 (相容所有裝置)</option>
              <option value={TTS_MODES.NATIVE}>瀏覽器原生語音 (Web Speech API)</option>
            </select>
          </div>
        </div>

        {/* Data Backup & Export */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '18px' }}>
          <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '10px' }}>資料備份與還原</div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-sm" onClick={handleExportJson}>
              <Download size={14} />
              <span>匯出單字庫 (JSON 備份)</span>
            </button>

            <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', margin: 0 }}>
              <Upload size={14} />
              <span>匯入備份 (JSON)</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                style={{ display: 'none' }}
              />
            </label>

            <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', margin: 0 }}>
              <Upload size={14} />
              <span>從 Google Sheet 匯入 (CSV)</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleCsvImport}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
