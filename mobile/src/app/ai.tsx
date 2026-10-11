import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { API_URL, TOKEN_KEY, GEMINI_KEY_STORAGE } from '@/constants/api';

type ExtractedCard = {
  word: string;
  article: string;
  part_of_speech: string;
  translation: string;
  example_es?: string;
  exists?: boolean;
  [key: string]: unknown;
};

const authHeaders = async () => {
  const headers: Record<string, string> = {};
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const geminiKey = await AsyncStorage.getItem(GEMINI_KEY_STORAGE);
  if (geminiKey) headers['x-gemini-key'] = geminiKey;
  return headers;
};

export default function AiScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ExtractedCard[] | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const pickPhoto = async (source: 'camera' | 'library') => {
    const permission = source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('需要權限', source === 'camera' ? '請允許使用相機來拍攝講義或白板。' : '請允許存取相簿來選擇照片。');
      return;
    }
    const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.6 };
    const result = source === 'camera'
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled && result.assets.length > 0) {
      setPhoto(result.assets[0]);
    }
  };

  const handleExtract = async () => {
    if (!text.trim() && !photo) {
      Alert.alert('錯誤', '請貼上西班牙文內容，或拍一張講義照片！');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('text', text);
      if (photo) {
        const name = photo.fileName || 'photo.jpg';
        const type = photo.mimeType || 'image/jpeg';
        if (Platform.OS === 'web') {
          const blob = await (await fetch(photo.uri)).blob();
          formData.append('image', blob, name);
        } else {
          formData.append('image', { uri: photo.uri, type, name } as unknown as Blob);
        }
      }

      const response = await fetch(`${API_URL}/ai/extract`, {
        method: 'POST',
        headers: await authHeaders(),
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '解析失敗');

      const cards: ExtractedCard[] = data.cards || [];
      setResults(cards);
      // Words already in the library start unchecked so they aren't overwritten by accident
      setSelected(new Set(cards.flatMap((c, i) => (c.exists ? [] : [i]))));
    } catch (err) {
      Alert.alert('錯誤', err instanceof Error ? err.message : '解析失敗');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (index: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleSave = async () => {
    const cardsToSave = (results || []).filter((_, i) => selected.has(i));
    if (cardsToSave.length === 0) {
      Alert.alert('提示', '請至少勾選一個要收錄的單字！');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/cards`, {
        method: 'POST',
        headers: { ...(await authHeaders()), 'Content-Type': 'application/json' },
        body: JSON.stringify(cardsToSave)
      });

      if (!response.ok) throw new Error('儲存失敗');

      Alert.alert('成功', `成功匯入 ${cardsToSave.length} 個單字到你的字卡庫！`, [
        { text: '確定', onPress: () => router.replace('/home') }
      ]);
    } catch (err) {
      Alert.alert('錯誤', err instanceof Error ? err.message : '儲存失敗');
      setLoading(false);
    }
  };

  const resetInput = () => {
    setResults(null);
    setSelected(new Set());
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
            <Text style={styles.label}>貼上西班牙文文章、歌詞或單字清單，或拍一張講義照片：</Text>
            <TextInput
              style={styles.inputArea}
              multiline
              numberOfLines={8}
              value={text}
              onChangeText={setText}
              placeholder="例如：Hoy es un día hermoso...（只拍照時可留空）"
              placeholderTextColor="#64748b"
              textAlignVertical="top"
            />
            
            <View style={styles.photoRow}>
              <TouchableOpacity style={styles.photoBtn} onPress={() => pickPhoto('camera')} disabled={loading}>
                <Text style={styles.photoBtnText}>📷 拍照</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoBtn} onPress={() => pickPhoto('library')} disabled={loading}>
                <Text style={styles.photoBtnText}>🖼️ 從相簿選</Text>
              </TouchableOpacity>
            </View>

            {photo && (
              <View style={styles.photoPreview}>
                <Image source={{ uri: photo.uri }} style={styles.photoImage} resizeMode="cover" />
                <TouchableOpacity onPress={() => setPhoto(null)}>
                  <Text style={styles.photoRemove}>移除照片</Text>
                </TouchableOpacity>
              </View>
            )}

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
            <Text style={styles.successTitle}>✅ AI 擷取了 {results.length} 個單字，已勾選 {selected.size} 個</Text>

            {results.map((card, idx) => {
              const isSelected = selected.has(idx);
              return (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.8}
                  onPress={() => toggleSelect(idx)}
                  style={[styles.previewCard, isSelected ? styles.previewCardSelected : styles.previewCardOff]}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.checkbox}>{isSelected ? '☑' : '☐'}</Text>
                      <Text style={styles.word}>{card.article ? `${card.article} ` : ''}{card.word}</Text>
                    </View>
                    <Text style={styles.pos}>{card.part_of_speech}</Text>
                  </View>
                  {card.exists ? <Text style={styles.existsBadge}>已在單字庫（勾選會覆蓋原本內容）</Text> : null}
                  <Text style={styles.translation}>{card.translation}</Text>
                  {card.example_es ? <Text style={styles.example}>{card.example_es}</Text> : null}
                </TouchableOpacity>
              );
            })}

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={resetInput}>
                <Text style={styles.secondaryBtnText}>重新擷取</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryBtnFlex} onPress={handleSave} disabled={loading || selected.size === 0}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.primaryBtnText}>收錄 {selected.size} 個單字</Text>}
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
  },
  photoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  photoBtn: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  photoBtnText: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: 'bold',
  },
  photoPreview: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photoImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
  },
  photoRemove: {
    color: '#f87171',
    fontSize: 14,
  },
  previewCardSelected: {
    borderColor: '#8b5cf6',
  },
  previewCardOff: {
    opacity: 0.55,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  checkbox: {
    fontSize: 20,
    color: '#a78bfa',
    marginRight: 8,
  },
  existsBadge: {
    fontSize: 12,
    color: '#fbbf24',
    marginBottom: 4,
  }
});
