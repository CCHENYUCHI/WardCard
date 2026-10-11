import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_URL, GEMINI_KEY_STORAGE } from '@/constants/api';

export default function SettingsScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [geminiKey, setGeminiKey] = useState('');

  useEffect(() => {
    fetchProfile();
    AsyncStorage.getItem(GEMINI_KEY_STORAGE).then(key => setGeminiKey(key || ''));
  }, []);

  const handleSaveGeminiKey = async () => {
    const key = geminiKey.trim();
    if (key) {
      await AsyncStorage.setItem(GEMINI_KEY_STORAGE, key);
    } else {
      await AsyncStorage.removeItem(GEMINI_KEY_STORAGE);
    }
    Alert.alert('已儲存', key ? 'AI 功能將使用你的 Gemini API Key。' : '已清除，AI 功能將使用伺服器的 Key。');
  };

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('palabracard_token');
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('登出', '確定要登出嗎？', [
      { text: '取消', style: 'cancel' },
      { 
        text: '確定', 
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('palabracard_token');
          router.replace('/');
        }
      }
    ]);
  };

  const handleCsvImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'application/vnd.ms-excel'],
        copyToCacheDirectory: true
      });
      
      if (result.canceled) return;
      
      const file = result.assets[0];
      setLoading(true);
      
      const formData = new FormData();
      if (Platform.OS === 'web') {
        // web format
        const response = await fetch(file.uri);
        const blob = await response.blob();
        formData.append('file', blob, file.name || 'import.csv');
      } else {
        // native format
        formData.append('file', {
          uri: file.uri,
          type: file.mimeType || 'text/csv',
          name: file.name || 'import.csv',
        });
      }

      const token = await AsyncStorage.getItem('palabracard_token');
      const res = await fetch(`${API_URL}/cards/upload-csv`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      const data = await res.json();
      if (res.ok) {
        Alert.alert('成功', `已成功從 CSV 匯入 ${data.count} 個單字！`);
      } else {
        Alert.alert('匯入失敗', data.error || '發生錯誤');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('錯誤', 'CSV 匯入時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>設定與個人檔案</Text>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/home')}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#3b82f6" />
        ) : (
          <>
            <View style={styles.profileBox}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user?.username?.charAt(0).toUpperCase()}</Text>
              </View>
              <Text style={styles.username}>@{user?.username}</Text>
              <Text style={styles.role}>{user?.role === 'admin' ? '管理員' : '一般使用者'}</Text>
            </View>

            <View style={styles.keyBox}>
              <Text style={styles.keyLabel}>🔑 Gemini API Key（選填）</Text>
              <Text style={styles.keyHint}>用於 AI 萃取單字；未填寫時使用伺服器的 Key。</Text>
              <View style={styles.keyRow}>
                <TextInput
                  style={styles.keyInput}
                  value={geminiKey}
                  onChangeText={setGeminiKey}
                  placeholder="貼上 AIzaSy..."
                  placeholderTextColor="#64748b"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity style={styles.keySaveBtn} onPress={handleSaveGeminiKey}>
                  <Text style={styles.keySaveText}>儲存</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleCsvImport}>
              <Text style={styles.primaryBtnText}>📁 匯入 CSV 單字庫</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dangerBtn} onPress={handleLogout}>
              <Text style={styles.dangerBtnText}>登出帳號</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
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
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  closeBtn: {
    color: '#94a3b8',
    fontSize: 24,
  },
  content: {
    padding: 24,
  },
  profileBox: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#334155',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#94a3b8',
  },
  dangerBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#ef4444',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  dangerBtnText: {
    color: '#ef4444',
    fontSize: 18,
    fontWeight: 'bold',
  },
  primaryBtn: {
    backgroundColor: '#3b82f6',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  keyBox: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  keyLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 4,
  },
  keyHint: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 12,
  },
  keyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  keyInput: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f8fafc',
    fontSize: 15,
  },
  keySaveBtn: {
    backgroundColor: '#8b5cf6',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  keySaveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  }
});
