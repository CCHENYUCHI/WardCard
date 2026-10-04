import React, { useState } from 'react';
import { fetchAPI, setToken } from '../utils/api';

const LoginScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await fetchAPI(endpoint, {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '登入失敗');
      
      setToken(data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="card-face" style={{ maxWidth: '400px', width: '100%', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>🇪🇸</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>PalabraCard</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            {isLogin ? '登入繼續你的西語學習之旅' : '註冊帳號開始學習西語'}
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>帳號</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="輸入帳號..."
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', fontSize: '1rem' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>密碼</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="輸入密碼..."
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', fontSize: '1rem' }}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '12px' }} disabled={loading}>
            {loading ? '請稍候...' : (isLogin ? '登入' : '註冊')}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {isLogin ? '還沒有帳號？ ' : '已經有帳號了？ '}
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isLogin ? '立即註冊' : '登入現有帳號'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
