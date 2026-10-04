import { fetchAPI, getToken, removeToken } from './utils/api';
import React, { useState, useEffect, useCallback } from 'react';
import LoginScreen from './components/LoginScreen';
import Navbar from './components/Navbar';
import FlashcardReview from './components/FlashcardReview';
import SpellingReview from './components/SpellingReview';
import WordList from './components/WordList';
import StatsView from './components/StatsView';
import AiImporter from './components/AiImporter';
import WordModal from './components/WordModal';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('review'); // 'review' | 'spelling' | 'words' | 'stats'
  const [cards, setCards] = useState([]);
  const [dueCards, setDueCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Modal states
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      const [cardsRes, dueRes, catRes, statsRes] = await Promise.all([
        fetchAPI('/api/cards'),
        fetchAPI('/api/cards/due'),
        fetchAPI('/api/categories'),
        fetchAPI('/api/stats')
      ]);

      if (cardsRes.ok) setCards(await cardsRes.json());
      if (dueRes.ok) setDueCards(await dueRes.json());
      if (catRes.ok) setCategories(await catRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (!token) {
        setAuthLoading(false);
        return;
      }
      try {
        const res = await fetchAPI('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error('Auth failed:', err);
      } finally {
        setAuthLoading(false);
      }
    };
    
    const handleAuthExpired = () => {
      setUser(null);
    };
    
    window.addEventListener('auth-expired', handleAuthExpired);
    checkAuth();
    
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchData();
    }
  }, [user, fetchData]);

  if (authLoading) {
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>載入中...</div>;
  }

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  // Handle reviewing a card
  const handleReview = async (id, rating, mode) => {
    try {
      const res = await fetchAPI(`/api/cards/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, review_mode: mode })
      });

      if (res.ok) {
        // Refresh cards and stats silently
        fetchData();
      }
    } catch (err) {
      console.error('Error reviewing card:', err);
    }
  };

  // Save new or edited card
  const handleSaveWord = async (wordData) => {
    try {
      if (editingCard) {
        await fetchAPI(`/api/cards/${editingCard.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(wordData)
        });
      } else {
        await fetchAPI('/api/cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(wordData)
        });
      }
      fetchData();
      setEditingCard(null);
    } catch (err) {
      console.error('Error saving word:', err);
    }
  };

  // Delete card
  const handleDeleteWord = async (id) => {
    if (!window.confirm('確定要刪除這個單字卡嗎？')) return;
    try {
      await fetchAPI(`/api/cards/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error('Error deleting card:', err);
    }
  };

  // Open Edit Modal
  const handleEditClick = (card) => {
    setEditingCard(card);
    setIsWordModalOpen(true);
  };

  // Import backup cards
  const handleImportBackup = async (backupCards) => {
    await fetchAPI('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backupCards)
    });
    fetchData();
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dueCount={dueCards.length}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenAddModal={() => {
          setEditingCard(null);
          setIsWordModalOpen(true);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        user={user}
        onLogout={() => {
          removeToken();
          setUser(null);
        }}
      />

      <main className="main-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="spinner" style={{ width: '32px', height: '32px' }} />
            <p style={{ marginTop: '14px', color: 'var(--text-secondary)' }}>正在載入西語單字庫...</p>
          </div>
        ) : (
          <>
            {activeTab === 'review' && (
              <FlashcardReview
                allCards={cards}
                dueCards={dueCards}
                onReview={handleReview}
                categories={categories}
                onRefresh={fetchData}
              />
            )}

            {activeTab === 'spelling' && (
              <SpellingReview
                allCards={cards}
                dueCards={dueCards}
                onReview={handleReview}
                categories={categories}
                onRefresh={fetchData}
              />
            )}

            {activeTab === 'words' && (
              <WordList
                cards={cards}
                categories={categories}
                onEdit={handleEditClick}
                onDelete={handleDeleteWord}
                onOpenAddModal={() => {
                  setEditingCard(null);
                  setIsWordModalOpen(true);
                }}
                onOpenAiModal={() => setIsAiModalOpen(true)}
              />
            )}

            {activeTab === 'stats' && (
              <StatsView stats={stats} />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <AiImporter
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onImportSuccess={() => fetchData()}
        categories={categories}
      />

      <WordModal
        isOpen={isWordModalOpen}
        onClose={() => {
          setIsWordModalOpen(false);
          setEditingCard(null);
        }}
        onSave={handleSaveWord}
        initialData={editingCard}
        categories={categories}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        cards={cards}
        onImportBackup={handleImportBackup}
      />
    </div>
  );
}
