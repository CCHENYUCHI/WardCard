import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';

// In a real app we'd use Context or SecureStore for the token,
// but for this prototype we'll keep it simple and just fetch directly.
import { API_URL } from '@/constants/api';

export default function HomeScreen() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await AsyncStorage.getItem('palabracard_token');
        if (!token) {
          router.replace('/');
          return;
        }

        const response = await fetch(`${API_URL}/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          router.replace('/');
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, admin! 👋</Text>
          <Text style={styles.subtitle}>準備好今天的西語練習了嗎？</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/settings')} style={styles.settingsBtn}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 50 }} />
        ) : (
          <>
            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats?.due}</Text>
                <Text style={styles.statLabel}>待複習</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats?.learned}</Text>
                <Text style={styles.statLabel}>已學習</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats?.mastered}</Text>
                <Text style={styles.statLabel}>已精通</Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={[styles.primaryButton, { flex: 1, marginRight: 8 }]}
                onPress={() => router.push('/review')}
              >
                <Text style={styles.primaryButtonText}>⌨️ 拼字測驗 ({stats?.due})</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.primaryButton, { flex: 1, marginLeft: 8, backgroundColor: '#f59e0b' }]}
                onPress={() => router.push('/flashcard')}
              >
                <Text style={styles.primaryButtonText}>🃏 翻轉字卡 ({stats?.due})</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.push('/words')}
            >
              <Text style={styles.secondaryButtonText}>📚 瀏覽單字庫</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.aiButton}
              onPress={() => router.push('/ai')}
            >
              <Text style={styles.aiButtonText}>✨ AI 智慧匯入文章/單字</Text>
            </TouchableOpacity>

            <View style={{ marginTop: 32 }}>
              <Text style={styles.sectionTitle}>近期學習類別</Text>
              <View style={styles.categoryList}>
                <View style={styles.categoryTag}><Text style={styles.categoryText}>日常生活</Text></View>
                <View style={styles.categoryTag}><Text style={styles.categoryText}>考試必背 (DELE)</Text></View>
                <View style={styles.categoryTag}><Text style={styles.categoryText}>旅遊會話</Text></View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  settingsBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  settingsIcon: {
    fontSize: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#334155',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  secondaryButtonText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  aiButtonText: {
    color: '#a78bfa',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 16,
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  categoryText: {
    color: '#60a5fa',
    fontWeight: '600',
  }
});
