import { burcUyumlari } from '@/components/BurcUyumlari';
import { burcYorumlari } from '@/components/BurcYorumlari';
import { TAROT_CARDS } from '@/components/TarotCardsData';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    ImageBackground,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

const burcListesi = [
  'Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak',
  'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'
];

export default function HomeScreen() {
  const colorSchemeRaw = useColorScheme();
  const colorScheme = colorSchemeRaw.colorScheme === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme] || Colors['light'];
  
  // Modal state'leri
  const [tarotModal, setTarotModal] = useState(false);
  const [burcModal, setBurcModal] = useState(false);
  const [uyumModal, setUyumModal] = useState(false);
  const [risingModal, setRisingModal] = useState(false);
  const [resultModal, setResultModal] = useState(false);
  
  // Form state'leri
  const [selectedBurc, setSelectedBurc] = useState<string | null>(null);
  const [selectedBurc1, setSelectedBurc1] = useState<string | null>(null);
  const [selectedBurc2, setSelectedBurc2] = useState<string | null>(null);
  const [birthHour, setBirthHour] = useState('');
  const [birthMinute, setBirthMinute] = useState('');
  const [risingResult, setRisingResult] = useState('');
  
  // Sonuç state'leri
  const [currentCard, setCurrentCard] = useState<any>(null);
  const [burcYorumu, setBurcYorumu] = useState('');
  const [uyumSonucu, setUyumSonucu] = useState('');
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Ses efekti yükleme
  useEffect(() => {
    loadSound();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/uygulama-sesi.mp3')
      );
      setSound(sound);
    } catch (error) {
      console.log('Ses yüklenemedi:', error);
    }
  };

  const playSound = async () => {
    try {
      if (sound) {
        await sound.replayAsync();
      }
    } catch (error) {
      console.log('Ses çalınamadı:', error);
    }
  };

  // Günün kartı için
  const drawTarotCard = () => {
    const randomIndex = Math.floor(Math.random() * TAROT_CARDS.length);
    const card = TAROT_CARDS[randomIndex];
    setCurrentCard(card);
    setTarotModal(false);
    setResultModal(true);
    playSound();
  };

  // Burç Yorumu için
  const handleBurcSubmit = () => {
    if (selectedBurc) {
      const yorum = burcYorumlari[selectedBurc]?.genel || 'Bu burç için henüz yorum bulunmuyor.';
      setBurcYorumu(yorum);
      setBurcModal(false);
      setResultModal(true);
      playSound();
    }
  };

  // Burç Uyumu için
  const handleUyumSubmit = () => {
    if (selectedBurc1 && selectedBurc2) {
      const uyum = burcUyumlari[selectedBurc1]?.[selectedBurc2] || 
                   burcUyumlari[selectedBurc2]?.[selectedBurc1] || 
                   'Bu burçlar arasında henüz uyum analizi bulunmuyor.';
      setUyumSonucu(uyum);
      setUyumModal(false);
      setResultModal(true);
      playSound();
    }
  };

  // Yükselen Burç Hesaplama
  const calculateRisingSign = (hour: string, minute: string): string => {
    const hourNum = parseInt(hour);
    const minuteNum = parseInt(minute);
    
    if (isNaN(hourNum) || isNaN(minuteNum)) {
      return 'Geçersiz saat formatı';
    }
    
    if (hourNum < 0 || hourNum > 23 || minuteNum < 0 || minuteNum > 59) {
      return 'Geçersiz saat aralığı';
    }
    
    // Basit yükselen burç hesaplama (gerçek hesaplama daha karmaşıktır)
    if (hourNum >= 6 && hourNum < 8) return 'Koç';
    if (hourNum >= 8 && hourNum < 10) return 'Boğa';
    if (hourNum >= 10 && hourNum < 12) return 'İkizler';
    if (hourNum >= 12 && hourNum < 14) return 'Yengeç';
    if (hourNum >= 14 && hourNum < 16) return 'Aslan';
    if (hourNum >= 16 && hourNum < 18) return 'Başak';
    if (hourNum >= 18 && hourNum < 20) return 'Terazi';
    if (hourNum >= 20 && hourNum < 22) return 'Akrep';
    if (hourNum >= 22 || hourNum < 0) return 'Yay';
    if (hourNum >= 0 && hourNum < 2) return 'Oğlak';
    if (hourNum >= 2 && hourNum < 4) return 'Kova';
    if (hourNum >= 4 && hourNum < 6) return 'Balık';
    
    return 'Hesaplanamadı';
  };

  const handleRisingSubmit = () => {
    if (birthHour && birthMinute) {
      const result = calculateRisingSign(birthHour, birthMinute);
      setRisingResult(result);
      setRisingModal(false);
      setResultModal(true);
      playSound();
    } else {
      Alert.alert('Hata', 'Lütfen doğum saatinizi girin.');
    }
  };

  const closeResultModal = () => {
    setResultModal(false);
    setCurrentCard(null);
    setBurcYorumu('');
    setUyumSonucu('');
    setRisingResult('');
    setSelectedBurc(null);
    setSelectedBurc1(null);
    setSelectedBurc2(null);
    setBirthHour('');
    setBirthMinute('');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      <ImageBackground
        source={colors.backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Text style={[styles.logoIcon, { color: colors.primary }]}>🌙</Text>
              </View>
              <Text style={[styles.headerTitle, { color: colors.primary }]}>
                Tarot & Astroloji
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.secondary }]}>
                Mistik deneyimleriniz için özel rehberlik
              </Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.cardsContainer}>
              <TouchableOpacity
                style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setTarotModal(true)}
                activeOpacity={0.8}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardEmoji}>🃏</Text>
                  <Text style={[styles.cardText, { color: colors.primary }]}>
                    Tarot Kartı
                  </Text>
                  <Text style={[styles.cardSubtext, { color: colors.secondary }]}>
                    Günün kartını çek
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setBurcModal(true)}
                activeOpacity={0.8}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardEmoji}>⭐</Text>
                  <Text style={[styles.cardText, { color: colors.primary }]}>
                    Burç Yorumu
                  </Text>
                  <Text style={[styles.cardSubtext, { color: colors.secondary }]}>
                    Günlük burç yorumu
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setUyumModal(true)}
                activeOpacity={0.8}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardEmoji}>💕</Text>
                  <Text style={[styles.cardText, { color: colors.primary }]}>
                    Burç Uyumu
                  </Text>
                  <Text style={[styles.cardSubtext, { color: colors.secondary }]}>
                    Uyumluluk analizi
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setRisingModal(true)}
                activeOpacity={0.8}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardEmoji}>🌅</Text>
                  <Text style={[styles.cardText, { color: colors.primary }]}>
                    Yükselen Burç
                  </Text>
                  <Text style={[styles.cardSubtext, { color: colors.secondary }]}>
                    Doğum saati hesapla
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>

      {/* Tarot Modal */}
      <Modal
        visible={tarotModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setTarotModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.primary }]}>
              Tarot Kartı Çek
            </Text>
            <Text style={[styles.modalText, { color: colors.text }]}>
              Günün kartını çekmek için hazır mısınız?
            </Text>
            <Text style={[styles.modalSubtext, { color: colors.secondary }]}>
              Kartınız size bugün için özel bir mesaj taşıyacak...
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={drawTarotCard}
              >
                <Text style={styles.modalButtonText}>Kart Çek</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.secondary }]}
                onPress={() => setTarotModal(false)}
              >
                <Text style={styles.modalButtonText}>İptal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Burç Yorumu Modal */}
      <Modal
        visible={burcModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setBurcModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.primary }]}>
              Burç Yorumu
            </Text>
            <Text style={[styles.modalText, { color: colors.text }]}>
              Burcunuzu seçin:
            </Text>
            <View style={styles.burcGrid}>
              {burcListesi.map((burc) => (
                <TouchableOpacity
                  key={burc}
                  style={[
                    styles.burcButton,
                    {
                      backgroundColor: selectedBurc === burc ? colors.primary : 'transparent',
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setSelectedBurc(burc)}
                >
                  <Text
                    style={[
                      styles.burcButtonText,
                      { color: selectedBurc === burc ? '#fff' : colors.text },
                    ]}
                  >
                    {burc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleBurcSubmit}
                disabled={!selectedBurc}
              >
                <Text style={styles.modalButtonText}>Yorum Al</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.secondary }]}
                onPress={() => setBurcModal(false)}
              >
                <Text style={styles.modalButtonText}>İptal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Burç Uyumu Modal */}
      <Modal
        visible={uyumModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setUyumModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.primary }]}>
              Burç Uyumu
            </Text>
            <Text style={[styles.modalText, { color: colors.text }]}>
              İki burcu seçin:
            </Text>
            <View style={styles.burcGrid}>
              {burcListesi.map((burc) => (
                <TouchableOpacity
                  key={burc}
                  style={[
                    styles.burcButton,
                    {
                      backgroundColor: (selectedBurc1 === burc || selectedBurc2 === burc) ? colors.primary : 'transparent',
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => {
                    if (!selectedBurc1) {
                      setSelectedBurc1(burc);
                    } else if (!selectedBurc2 && selectedBurc1 !== burc) {
                      setSelectedBurc2(burc);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.burcButtonText,
                      { color: (selectedBurc1 === burc || selectedBurc2 === burc) ? '#fff' : colors.text },
                    ]}
                  >
                    {burc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {selectedBurc1 && selectedBurc2 && (
              <Text style={[styles.modalText, { color: colors.primary, fontWeight: 'bold', marginTop: 10 }]}>
                {selectedBurc1} + {selectedBurc2}
              </Text>
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleUyumSubmit}
                disabled={!selectedBurc1 || !selectedBurc2}
              >
                <Text style={styles.modalButtonText}>Uyumu Hesapla</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.secondary }]}
                onPress={() => setUyumModal(false)}
              >
                <Text style={styles.modalButtonText}>İptal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Yükselen Burç Modal */}
      <Modal
        visible={risingModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setRisingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.primary }]}>
              Yükselen Burç Hesaplama
            </Text>
            <Text style={[styles.modalText, { color: colors.text }]}>
              Doğum saatinizi girin:
            </Text>
            <View style={styles.timeInputContainer}>
              <TextInput
                style={[styles.timeInput, { borderColor: colors.border, color: colors.text }]}
                placeholder="Saat"
                placeholderTextColor={colors.secondary}
                value={birthHour}
                onChangeText={setBirthHour}
                keyboardType="numeric"
                maxLength={2}
              />
              <Text style={[styles.timeSeparator, { color: colors.text }]}>:</Text>
              <TextInput
                style={[styles.timeInput, { borderColor: colors.border, color: colors.text }]}
                placeholder="Dakika"
                placeholderTextColor={colors.secondary}
                value={birthMinute}
                onChangeText={setBirthMinute}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleRisingSubmit}
                disabled={!birthHour || !birthMinute}
              >
                <Text style={styles.modalButtonText}>Hesapla</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.secondary }]}
                onPress={() => setRisingModal(false)}
              >
                <Text style={styles.modalButtonText}>İptal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sonuç Modal */}
      <Modal
        visible={resultModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeResultModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {currentCard && (
                <>
                  <Text style={[styles.modalTitle, { color: colors.primary }]}>
                    {currentCard.name}
                  </Text>
                  <Text style={[styles.modalText, { color: colors.text, fontStyle: 'italic' }]}>
                    {currentCard.meanings.general}
                  </Text>
                  <Text style={[styles.modalSubtext, { color: colors.secondary, marginTop: 10 }]}>
                    Aşk: {currentCard.meanings.love}
                  </Text>
                  <Text style={[styles.modalSubtext, { color: colors.secondary }]}>
                    Kariyer: {currentCard.meanings.career}
                  </Text>
                  <Text style={[styles.modalSubtext, { color: colors.secondary }]}>
                    Sağlık: {currentCard.meanings.health}
                  </Text>
                </>
              )}
              
              {burcYorumu && (
                <>
                  <Text style={[styles.modalTitle, { color: colors.primary }]}>
                    {selectedBurc} Burç Yorumu
                  </Text>
                  <Text style={[styles.modalText, { color: colors.text }]}>
                    {burcYorumu}
                  </Text>
                </>
              )}
              
              {uyumSonucu && (
                <>
                  <Text style={[styles.modalTitle, { color: colors.primary }]}>
                    {selectedBurc1} + {selectedBurc2} Uyumu
                  </Text>
                  <Text style={[styles.modalText, { color: colors.text }]}>
                    {uyumSonucu}
                  </Text>
                </>
              )}
              
              {risingResult && (
                <>
                  <Text style={[styles.modalTitle, { color: colors.primary }]}>
                    Yükselen Burcunuz
                  </Text>
                  <Text style={[styles.modalText, { color: colors.primary, fontWeight: 'bold', fontSize: 18 }]}>
                    {risingResult}
                  </Text>
                  <Text style={[styles.modalSubtext, { color: colors.secondary, marginTop: 10 }]}>
                    Doğum saatiniz: {birthHour}:{birthMinute}
                  </Text>
                </>
              )}
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={closeResultModal}
              >
                <Text style={styles.modalButtonText}>Tamam</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  logoIcon: {
    fontSize: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  divider: {
    width: 50,
    height: 2,
    backgroundColor: '#D4AF37',
    marginTop: 15,
    borderRadius: 1,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'space-around',
    gap: 12,
    paddingVertical: 20,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    flex: 1,
    marginVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    minHeight: 120,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  cardEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    borderRadius: 15,
    padding: 20,
    width: width * 0.9,
    maxHeight: height * 0.8,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  modalSubtext: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  burcGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 15,
    gap: 6,
  },
  burcButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    minWidth: 50,
  },
  burcButtonText: {
    fontSize: 13,
    fontWeight: '500',
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  timeInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    textAlign: 'center',
    width: 70,
  },
  timeSeparator: {
    fontSize: 18,
    marginHorizontal: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  modalButton: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

