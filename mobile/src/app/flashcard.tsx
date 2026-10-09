import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://wardcard.ycctw.xyz/api';

export default function FlashcardScreen() {
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchDueCards(selectedCategory);
  }, [selectedCategory]);

  const fetchDueCards = async (category) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('palabracard_token');
      const catQuery = category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
      
      const [cardsRes, catsRes] = await Promise.all([
        fetch(`${API_URL}/cards/due?limit=20${catQuery}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/categories`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      const cardsData = await cardsRes.json();
      const catsData = await catsRes.json();
      
      setCards(Array.isArray(cardsData) ? cardsData : []);
      setCategories(Array.isArray(catsData) ? catsData : []);
      setCurrentIndex(0);
      setIsFlipped(false);
      flipAnim.setValue(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const handleRating = async (rating) => {
    const currentCard = cards[currentIndex];
    try {
      const token = await AsyncStorage.getItem('palabracard_token');
      await fetch(`${API_URL}/cards/${currentCard.id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, review_mode: 'flashcard' })
      });
      
      if (currentIndex < cards.length - 1) {
        setIsFlipped(false);
        flipAnim.setValue(0);
        setCurrentIndex(currentIndex + 1);
      } else {
        alert('恭喜你！今天的翻牌複習已經全部完成！🎉');
        router.replace('/home');
      }
    } catch (err) {
      console.error('Error submitting review', err);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (cards.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <View style={styles.filterSection}>
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
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.title}>太棒了！🎉</Text>
          <Text style={styles.subtitle}>你已經沒有待複習的卡片了。</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.replace('/home')}>
            <Text style={styles.buttonText}>回首頁</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const card = cards[currentIndex];

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progress}>翻轉卡片：{currentIndex + 1} / {cards.length}</Text>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/home')}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterSection}>
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
      </View>

      <TouchableOpacity activeOpacity={1} style={styles.cardContainer} onPress={handleFlip}>
        <Animated.View style={[styles.card, styles.cardFront, { transform: [{ rotateY: frontInterpolate }] }]}>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeCategory}>{card.category}</Text>
            <Text style={styles.badgeDele}>{card.dele_level || 'A2'}</Text>
          </View>
          <Text style={styles.article}>{card.article}</Text>
          <Text style={styles.word}>{card.word}</Text>
          <Text style={styles.hint}>點擊翻轉字卡</Text>
        </Animated.View>

        <Animated.View style={[styles.card, styles.cardBack, { transform: [{ rotateY: backInterpolate }] }]}>
          <Text style={styles.translation}>{card.translation}</Text>
          {card.definition_es ? <Text style={styles.definition}>{card.definition_es}</Text> : null}
          {card.example_es ? (
            <View style={styles.exampleBox}>
              <Text style={styles.exampleEs}>{card.example_es}</Text>
              <Text style={styles.exampleZh}>{card.example_zh}</Text>
            </View>
          ) : null}
        </Animated.View>
      </TouchableOpacity>

      {isFlipped ? (
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionBtn, styles.btnAgain]} onPress={() => handleRating(1)}>
            <Text style={styles.actionText}>忘記</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.btnHard]} onPress={() => handleRating(2)}>
            <Text style={styles.actionText}>困難</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.btnGood]} onPress={() => handleRating(3)}>
            <Text style={styles.actionText}>記得</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.btnEasy]} onPress={() => handleRating(4)}>
            <Text style={styles.actionText}>簡單</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actionsPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  center: { justifyContent: 'center', alignItems: 'center', padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, marginBottom: 16, paddingHorizontal: 24 },
  progress: { color: '#94a3b8', fontSize: 16, fontWeight: 'bold' },
  closeBtn: { color: '#94a3b8', fontSize: 24 },
  filterSection: { paddingHorizontal: 24, backgroundColor: '#1e293b', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#334155' },
  pickerContainer: { backgroundColor: '#0f172a', borderRadius: 12, borderWidth: 1, borderColor: '#334155', overflow: 'hidden' },
  picker: { color: '#f8fafc', height: 50 },
  pickerItem: { color: '#f8fafc', fontSize: 16 },
  cardContainer: { flex: 1, perspective: 1000, margin: 24 },
  card: { position: 'absolute', width: '100%', height: '80%', backgroundColor: '#1e293b', borderRadius: 24, padding: 32, justifyContent: 'center', alignItems: 'center', backfaceVisibility: 'hidden', borderWidth: 1, borderColor: '#334155', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 8 },
  cardFront: {},
  cardBack: { backgroundColor: '#1e293b' },
  badgeContainer: { flexDirection: 'row', gap: 8, position: 'absolute', top: 24 },
  badgeCategory: { backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#c084fc', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  badgeDele: { backgroundColor: 'rgba(236, 72, 153, 0.1)', color: '#f472b6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  article: { fontSize: 24, color: '#94a3b8', marginBottom: 8 },
  word: { fontSize: 48, fontWeight: 'bold', color: '#f8fafc', textAlign: 'center' },
  hint: { position: 'absolute', bottom: 32, color: '#64748b', fontSize: 14 },
  translation: { fontSize: 32, fontWeight: 'bold', color: '#3b82f6', marginBottom: 24, textAlign: 'center' },
  definition: { fontSize: 16, color: '#cbd5e1', fontStyle: 'italic', textAlign: 'center', marginBottom: 24 },
  exampleBox: { backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: 16, borderRadius: 12, width: '100%' },
  exampleEs: { fontSize: 16, color: '#f8fafc', marginBottom: 8 },
  exampleZh: { fontSize: 14, color: '#94a3b8' },
  actions: { flexDirection: 'row', gap: 8, marginBottom: 40, flexWrap: 'nowrap', paddingHorizontal: 24 },
  actionsPlaceholder: { height: 60, marginBottom: 40, paddingHorizontal: 24 },
  actionBtn: { flex: 1, paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnAgain: { backgroundColor: 'rgba(239, 68, 68, 0.2)', borderWidth: 1, borderColor: '#ef4444' },
  btnHard: { backgroundColor: 'rgba(245, 158, 11, 0.2)', borderWidth: 1, borderColor: '#f59e0b' },
  btnGood: { backgroundColor: 'rgba(34, 197, 94, 0.2)', borderWidth: 1, borderColor: '#22c55e' },
  btnEasy: { backgroundColor: 'rgba(59, 130, 246, 0.2)', borderWidth: 1, borderColor: '#3b82f6' },
  actionText: { fontSize: 16, fontWeight: 'bold', color: '#f8fafc' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#f8fafc', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#94a3b8', marginBottom: 24 },
  button: { backgroundColor: '#3b82f6', padding: 16, borderRadius: 12, width: '60%', alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});
