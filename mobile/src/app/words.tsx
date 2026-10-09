import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://wardcard.ycctw.xyz/api';

export default function WordsScreen() {
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const token = await AsyncStorage.getItem('palabracard_token');
      const [cardsRes, catsRes] = await Promise.all([
        fetch(`${API_URL}/cards?page=1&limit=500`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/categories`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      const cardsData = await cardsRes.json();
      const catsData = await catsRes.json();
      
      setCards(Array.isArray(cardsData) ? cardsData : []);
      setCategories(Array.isArray(catsData) ? catsData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('刪除單字', '確定要刪除這個單字卡嗎？', [
      { text: '取消', style: 'cancel' },
      { 
        text: '確定刪除', 
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('palabracard_token');
            await fetch(`${API_URL}/cards/${id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            setSelectedCard(null);
            fetchCards();
          } catch (err) {
            Alert.alert('錯誤', '刪除失敗');
          }
        }
      }
    ]);
  };

  const handleSaveEdit = async () => {
    try {
      const token = await AsyncStorage.getItem('palabracard_token');
      
      if (isAddingNew) {
        await fetch(`${API_URL}/cards`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(editingCard)
        });
      } else {
        await fetch(`${API_URL}/cards/${editingCard.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(editingCard)
        });
      }
      
      setSelectedCard(null);
      setEditingCard(null);
      setIsAddingNew(false);
      fetchCards();
    } catch (err) {
      Alert.alert('錯誤', '儲存失敗');
    }
  };

  const openAddModal = () => {
    setEditingCard({
      word: '',
      translation: '',
      article: '',
      example_es: '',
      example_zh: '',
      category: categories.length > 0 ? categories[0] : '預設分類',
      dele_level: 'A2',
      part_of_speech: '名詞'
    });
    setIsAddingNew(true);
    setSelectedCard({ id: 'new' }); // Dummy object to open modal
  };

  const filteredCards = cards.filter(card => {
    if (selectedCategory !== 'all' && card.category !== selectedCategory) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchWord = card.word?.toLowerCase().includes(q);
      const matchTrans = card.translation?.toLowerCase().includes(q);
      return matchWord || matchTrans;
    }
    return true;
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.cardItem} onPress={() => setSelectedCard(item)}>
      <View style={styles.cardHeader}>
        <View style={styles.badgeRow}>
          <Text style={styles.badgeDele}>{item.dele_level || 'A2'}</Text>
          <Text style={styles.badgeCategory}>{item.category}</Text>
        </View>
        <Text style={styles.badgePos}>{item.part_of_speech}</Text>
      </View>

      <View style={styles.cardBody}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 }}>
          {!!item.article && <Text style={styles.cardArticle}>{item.article} </Text>}
          <Text style={styles.cardWord}>{item.word}</Text>
        </View>
        <Text style={styles.cardTranslation}>{item.translation}</Text>
      </View>

      {!!item.example_es && (
        <View style={styles.exampleBox}>
          <Text style={styles.exampleEs}>{item.example_es}</Text>
          {!!item.example_zh && <Text style={styles.exampleZh}>{item.example_zh}</Text>}
        </View>
      )}

      {!!item.notes && (
        <View style={styles.notesBox}>
          <Text style={styles.notesText}>💡 {item.notes}</Text>
        </View>
      )}

      <View style={styles.cardFooter}>
        <Text style={styles.repetitionText}>熟練度: {item.repetition || 0} 次</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>我的單字庫 ({filteredCards.length})</Text>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/home')}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 搜尋單字或中文..."
          placeholderTextColor="#64748b"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="📚 全部分類" value="all" />
            {categories.map(cat => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
          <Text style={styles.addBtnText}>+ 手動新增單字</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredCards}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>目前還沒有單字，趕快去網頁版新增吧！</Text>
          }
        />
      )}

      {/* Word Details/Edit Modal */}
      <Modal visible={!!selectedCard} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {editingCard ? (
              <>
                <Text style={styles.modalTitle}>{isAddingNew ? '新增單字' : '編輯單字'}</Text>
                <TextInput
                  style={styles.input}
                  value={editingCard.word}
                  onChangeText={(text) => setEditingCard({...editingCard, word: text})}
                  placeholder="西班牙文"
                  placeholderTextColor="#64748b"
                />
                <TextInput
                  style={styles.input}
                  value={editingCard.translation}
                  onChangeText={(text) => setEditingCard({...editingCard, translation: text})}
                  placeholder="中文翻譯"
                  placeholderTextColor="#64748b"
                />
                <TextInput
                  style={[styles.input, { height: 80 }]}
                  multiline
                  value={editingCard.example_es}
                  onChangeText={(text) => setEditingCard({...editingCard, example_es: text})}
                  placeholder="例句 (西)"
                  placeholderTextColor="#64748b"
                />
                <TextInput
                  style={[styles.input, { height: 80 }]}
                  multiline
                  value={editingCard.example_zh}
                  onChangeText={(text) => setEditingCard({...editingCard, example_zh: text})}
                  placeholder="例句翻譯 (中)"
                  placeholderTextColor="#64748b"
                />
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.secondaryBtn} onPress={() => { setEditingCard(null); setIsAddingNew(false); setSelectedCard(null); }}>
                    <Text style={styles.secondaryBtnText}>取消</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.primaryBtn} onPress={handleSaveEdit}>
                    <Text style={styles.primaryBtnText}>儲存</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : selectedCard && !isAddingNew ? (
              <>
                <Text style={styles.modalTitle}>單字詳情</Text>
                <View style={styles.detailBox}>
                  <Text style={styles.detailWord}>{selectedCard.article} {selectedCard.word}</Text>
                  <Text style={styles.detailTrans}>{selectedCard.translation}</Text>
                  {selectedCard.example_es && <Text style={styles.detailEx}>{selectedCard.example_es}</Text>}
                  {selectedCard.example_zh && <Text style={styles.detailExZh}>{selectedCard.example_zh}</Text>}
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.dangerBtn} onPress={() => handleDelete(selectedCard.id)}>
                    <Text style={styles.dangerBtnText}>刪除</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.primaryBtn} onPress={() => setEditingCard(selectedCard)}>
                    <Text style={styles.primaryBtnText}>編輯</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryBtn} onPress={() => { setSelectedCard(null); setEditingCard(null); }}>
                    <Text style={styles.secondaryBtnText}>關閉</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  filterSection: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#0f172a',
  },
  searchInput: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 12,
    color: '#f8fafc',
    fontSize: 16,
    marginBottom: 12,
  },
  pickerContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
    overflow: 'hidden',
  },
  picker: {
    color: '#f8fafc',
    height: 50,
  },
  pickerItem: {
    color: '#f8fafc',
    fontSize: 16,
  },
  addBtn: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderWidth: 1,
    borderColor: '#22c55e',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#4ade80',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 24,
    paddingBottom: 40,
  },
  cardItem: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badgeDele: {
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    color: '#f472b6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgeCategory: {
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    color: '#c084fc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgePos: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    color: '#60a5fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardBody: {
    marginBottom: 12,
  },
  cardArticle: {
    fontSize: 18,
    color: '#94a3b8',
    fontWeight: '600',
  },
  cardWord: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  cardTranslation: {
    fontSize: 16,
    color: '#38bdf8',
    fontWeight: 'bold',
    marginTop: 4,
  },
  exampleBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  exampleEs: {
    color: '#e2e8f0',
    fontSize: 14,
    marginBottom: 4,
  },
  exampleZh: {
    color: '#94a3b8',
    fontSize: 12,
  },
  notesBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  notesText: {
    color: '#fde68a',
    fontSize: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 12,
  },
  repetitionText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94a3b8',
    marginTop: 40,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
    color: '#f8fafc',
    fontSize: 16,
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    paddingBottom: 40, // For iOS bottom area
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#334155',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  dangerBtn: {
    flex: 1,
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: { color: 'white', fontWeight: 'bold' },
  secondaryBtnText: { color: '#cbd5e1', fontWeight: 'bold' },
  dangerBtnText: { color: 'white', fontWeight: 'bold' },
  detailBox: {
    backgroundColor: '#0f172a',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  detailWord: { fontSize: 24, fontWeight: 'bold', color: '#f8fafc', marginBottom: 8 },
  detailTrans: { fontSize: 18, color: '#3b82f6', marginBottom: 16 },
  detailEx: { fontSize: 16, color: '#cbd5e1', marginBottom: 4 },
  detailExZh: { fontSize: 14, color: '#94a3b8' }
});
