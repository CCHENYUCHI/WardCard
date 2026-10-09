import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://wardcard.ycctw.xyz/api';

export default function AiScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleExtract = async () => {
    if (!text.trim()) {
      Alert.alert('錯誤', '請貼上你要擷取的西班牙文文章或單字清單！');
      return;
    }
    
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('palabracard_token');
      const response = await fetch(`${API_URL}/ai/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text, targetLevel: 'B1' })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '解析失敗');
      
      setResults(data.cards);
    } catch (err) {
      Alert.alert('錯誤', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!results || results.length === 0) return;
    
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('palabracard_token');
      const response = await fetch(`${API_URL}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(results)
      });
      
      if (!response.ok) throw new Error('儲存失敗');
      
      Alert.alert('成功', `成功匯入 ${results.length} 個單字到你的字卡庫！`, [
        { text: '確定', onPress: () => router.replace('/home') }
      ]);
    } catch (err) {
      Alert.alert('錯誤', err.message);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>✨ AI 智慧匯入</Text>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/home')}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {!results ? (
          <>
            <Text style={styles.label}>貼上西班牙文文章、歌詞或單字清單：</Text>
            <TextInput
              style={styles.inputArea}
              multiline
              numberOfLines={8}
              value={text}
              onChangeText={setText}
              placeholder="例如：Hoy es un día hermoso..."
              placeholderTextColor="#64748b"
              textAlignVertical="top"
            />
            
            <TouchableOpacity style={styles.primaryBtn} onPress={handleExtract} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.primaryBtnText}>🔮 請 AI 幫我抓單字</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.successTitle}>✅ AI 成功擷取了 {results.length} 個單字</Text>
            
            {results.map((card, idx) => (
              <View key={idx} style={styles.previewCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.word}>{card.article} {card.word}</Text>
                  <Text style={styles.pos}>{card.part_of_speech}</Text>
                </View>
                <Text style={styles.translation}>{card.translation}</Text>
                {card.example_es ? <Text style={styles.example}>{card.example_es}</Text> : null}
              </View>
            ))}

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => setResults(null)}>
                <Text style={styles.secondaryBtnText}>重新擷取</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryBtnFlex} onPress={handleSave} disabled={loading}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.primaryBtnText}>一鍵全部收錄</Text>}
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
  label: {
    fontSize: 16,
    color: '#cbd5e1',
    marginBottom: 12,
  },
  inputArea: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 16,
    padding: 16,
    color: '#f8fafc',
    fontSize: 16,
    minHeight: 200,
    marginBottom: 24,
  },
  primaryBtn: {
    backgroundColor: '#8b5cf6', // Purple for AI
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryBtnFlex: {
    flex: 2,
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 12,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#334155',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryBtnText: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 20,
  },
  previewCard: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  word: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  pos: {
    fontSize: 12,
    color: '#94a3b8',
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  translation: {
    fontSize: 16,
    color: '#60a5fa',
    marginBottom: 8,
  },
  example: {
    fontSize: 14,
    color: '#cbd5e1',
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 40,
  }
});
