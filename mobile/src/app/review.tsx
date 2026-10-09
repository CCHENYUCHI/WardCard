import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://wardcard.ycctw.xyz/api';
const SPANISH_SPECIAL_KEYS = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', '¿', '¡'];

const stripArticle = (str) => {
  const articles = ['el ', 'la ', 'los ', 'las ', 'un ', 'una ', 'unos ', 'unas '];
  for (let article of articles) {
    if (str.startsWith(article)) {
      return str.substring(article.length).trim();
    }
  }
  return str;
};

const getAcceptableAnswers = (word) => {
  const lowercaseWord = word.toLowerCase().trim();
  const answers = [lowercaseWord, stripArticle(lowercaseWord)];

  const slashParts = lowercaseWord.split('/');
  if (slashParts.length > 1) {
    if (slashParts[1].trim() === 'a') {
      const base = stripArticle(slashParts[0].trim());
      answers.push(base);
      if (base.endsWith('o')) answers.push(base.slice(0, -1) + 'a');
      else answers.push(base + 'a');
    } else {
      for (let part of slashParts) {
        answers.push(part.trim());
        answers.push(stripArticle(part.trim()));
      }
    }
  }

  const parenMatch = lowercaseWord.match(/^(.*?)\(a\)$/);
  if (parenMatch) {
    const base = stripArticle(parenMatch[1].trim());
    answers.push(base);
    if (base.endsWith('o')) answers.push(base.slice(0, -1) + 'a');
    else answers.push(base + 'a');
  }
  return answers;
};

export default function ReviewScreen() {
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState('typing'); // 'typing', 'correct', 'incorrect'
  const [showAnswer, setShowAnswer] = useState(false);
  
  const inputRef = useRef(null);

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
      setUserInput('');
      setStatus('typing');
      setShowAnswer(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpecialKey = (char) => {
    setUserInput(prev => prev + char);
    if (inputRef.current) inputRef.current.focus();
  };

  const checkAnswer = () => {
    if (!userInput.trim()) return;
    
    const currentCard = cards[currentIndex];
    const acceptable = getAcceptableAnswers(currentCard.word);
    const isCorrect = acceptable.includes(userInput.toLowerCase().trim());
    
    setStatus(isCorrect ? 'correct' : 'incorrect');
    if (!isCorrect) setShowAnswer(true);
  };

  const nextCard = async (ratingOverride = null) => {
    const currentCard = cards[currentIndex];
    const rating = ratingOverride !== null ? ratingOverride : (status === 'correct' ? 4 : 1);
    
    try {
      const token = await AsyncStorage.getItem('palabracard_token');
      await fetch(`${API_URL}/cards/${currentCard.id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, review_mode: 'spelling' })
      });
      
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setUserInput('');
        setStatus('typing');
        setShowAnswer(false);
        setTimeout(() => { if (inputRef.current) inputRef.current.focus(); }, 100);
      } else {
        alert('恭喜你！今天的拼字複習已經完成！🎉');
        router.replace('/home');
      }
    } catch (err) {
      console.error(err);
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

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.progress}>拼字測驗：{currentIndex + 1} / {cards.length}</Text>
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

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.cardContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
            <Text style={styles.badgeCategory}>{card.category}</Text>
            <Text style={styles.badgeDele}>{card.dele_level || 'A2'}</Text>
          </View>
          <Text style={styles.translation}>{card.translation}</Text>
          {card.definition_es ? <Text style={styles.definition}>{card.definition_es}</Text> : null}
          
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={[
                styles.input,
                status === 'correct' && styles.inputCorrect,
                status === 'incorrect' && styles.inputIncorrect
              ]}
              value={userInput}
              onChangeText={text => {
                setUserInput(text);
                setStatus('typing');
                setShowAnswer(false);
              }}
              onSubmitEditing={status === 'typing' ? checkAnswer : () => nextCard()}
              placeholder="輸入西班牙文拼字..."
              placeholderTextColor="#64748b"
              autoCapitalize="none"
              autoCorrect={false}
              editable={status === 'typing'}
            />
          </View>

          {showAnswer && (
            <View style={styles.answerBox}>
              <Text style={styles.answerLabel}>正確答案：</Text>
              <Text style={styles.answerText}>{card.article} {card.word}</Text>
              {card.example_es ? (
                <View style={styles.exampleBox}>
                  <Text style={styles.exampleEs}>{card.example_es}</Text>
                  <Text style={styles.exampleZh}>{card.example_zh}</Text>
                </View>
              ) : null}
            </View>
          )}

          <View style={styles.keyboardRow}>
            {SPANISH_SPECIAL_KEYS.map(key => (
              <TouchableOpacity key={key} style={styles.keyBtn} onPress={() => handleSpecialKey(key)} disabled={status !== 'typing'}>
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {status === 'typing' ? (
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.actionBtn, styles.btnSkip]} onPress={() => setShowAnswer(true)}>
              <Text style={styles.actionText}>看答案</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.btnSubmit]} onPress={checkAnswer}>
              <Text style={styles.actionText}>送出對答</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.actionBtn, status === 'correct' ? styles.btnCorrectNext : styles.btnIncorrectNext]} 
            onPress={() => nextCard()}
          >
            <Text style={styles.actionText}>下一題 ➔</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#1e293b',
  },
  filterSection: {
    paddingHorizontal: 24,
    backgroundColor: '#1e293b',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  pickerContainer: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
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
  progress: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeBtn: {
    color: '#94a3b8',
    fontSize: 24,
  },
  badgeCategory: {
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    color: '#c084fc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  badgeDele: {
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    color: '#f472b6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  content: {
    flexGrow: 1,
    padding: 24,
  },
  cardContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
    minHeight: 400,
  },
  translation: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 8,
    textAlign: 'center',
  },
  definition: {
    fontSize: 16,
    color: '#cbd5e1',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#0f172a',
    borderWidth: 2,
    borderColor: '#334155',
    borderRadius: 16,
    padding: 20,
    fontSize: 24,
    color: '#f8fafc',
    textAlign: 'center',
  },
  inputCorrect: {
    borderColor: '#22c55e',
    color: '#22c55e',
  },
  inputIncorrect: {
    borderColor: '#ef4444',
    color: '#ef4444',
    textDecorationLine: 'line-through',
  },
  answerBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  answerLabel: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: 4,
  },
  answerText: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  exampleBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    padding: 12,
    borderRadius: 8,
  },
  exampleEs: {
    color: '#f8fafc',
    fontSize: 14,
    marginBottom: 4,
  },
  exampleZh: {
    color: '#94a3b8',
    fontSize: 12,
  },
  keyboardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 'auto',
  },
  keyBtn: {
    backgroundColor: '#334155',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  keyText: {
    color: '#f8fafc',
    fontSize: 18,
  },
  footer: {
    padding: 24,
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnSkip: {
    backgroundColor: '#334155',
  },
  btnSubmit: {
    backgroundColor: '#3b82f6',
  },
  btnCorrectNext: {
    backgroundColor: '#22c55e',
  },
  btnIncorrectNext: {
    backgroundColor: '#ef4444',
  },
  actionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    width: '60%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
