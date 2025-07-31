import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';

interface TarotCard {
  name: string;
  category: string;
  meanings: {
    general: string;
    love: string;
    career: string;
    health: string;
  };
}

export default function SingleCardScreen() {
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8081/tarot-cards');
      const data = await res.json();
      setCards(data);
      setLoading(false);
      if (data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        setSelectedCard(data[randomIndex]);
      } else {
        setSelectedCard(null);
      }
    } catch {
      setLoading(false);
      setSelectedCard(null);
    }
  };

  const drawCard = useCallback(() => {
    if (cards.length === 0) {
      setSelectedCard(null);
      return;
    }
    const randomIndex = Math.floor(Math.random() * cards.length);
    setSelectedCard(cards[randomIndex]);
  }, [cards]);

  useFocusEffect(
    useCallback(() => {
      fetchCards();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Günün Kartı</Text>
      <Button title="Kartı Yenile" onPress={drawCard} />
      {loading ? (
        <ActivityIndicator size="large" color="#8C7853" style={{ marginTop: 32 }} />
      ) : selectedCard ? (
        <View style={styles.cardBox}>
          <Text style={styles.cardName}>{selectedCard.name}</Text>
          <Text style={styles.cardCategory}>{selectedCard.category}</Text>
          <Text style={styles.sectionTitle}>Genel Anlamı</Text>
          <Text style={styles.cardMeaning}>{selectedCard.meanings.general}</Text>
          <Text style={styles.sectionTitle}>Aşk</Text>
          <Text style={styles.cardMeaning}>{selectedCard.meanings.love}</Text>
          <Text style={styles.sectionTitle}>Kariyer</Text>
          <Text style={styles.cardMeaning}>{selectedCard.meanings.career}</Text>
          <Text style={styles.sectionTitle}>Sağlık</Text>
          <Text style={styles.cardMeaning}>{selectedCard.meanings.health}</Text>
        </View>
      ) : (
        <Text style={styles.warning}>Kart verisi bulunamadı. Lütfen kart listesini kontrol edin.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  cardBox: {
    marginTop: 32,
    padding: 24,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minWidth: 300,
  },
  cardName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardCategory: {
    fontSize: 16,
    color: '#888',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 2,
    color: '#8C7853', // bronze
  },
  cardMeaning: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  warning: {
    marginTop: 32,
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
}); 