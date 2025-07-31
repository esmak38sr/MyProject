import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  ImageBackground,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme] || Colors['light'];
  
  const generateInviteCode = () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const year = now.getFullYear();
    
    // Basit algoritma: ay + gün + yılın son 2 hanesi
    const code = `${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}${year.toString().slice(-2)}`;
    return code;
  };
  
  const [inviteCode, setInviteCode] = useState(generateInviteCode());
  const [showAlgorithm, setShowAlgorithm] = useState(false);

  const handleLogin = async () => {
    if (!inviteCode.trim()) {
      Alert.alert('Hata', 'Lütfen davet kodunu girin');
      return;
    }

    const validCode = generateInviteCode();
    
    if (inviteCode === validCode) {
      try {
        // Login durumunu kaydet
        await AsyncStorage.setItem('isLoggedIn', 'true');
        
        const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/uygulama-sesi.mp3'));
        await sound.playAsync();
        
        setTimeout(() => {
          sound.unloadAsync();
          router.replace('/(tabs)');
        }, 2000);
      } catch (error) {
        console.log('Ses çalma hatası:', error);
        // Ses çalma hatası olsa bile login durumunu kaydet ve yönlendir
        await AsyncStorage.setItem('isLoggedIn', 'true');
        router.replace('/(tabs)');
      }
    } else {
      Alert.alert('Hata', 'Geçersiz davet kodu');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      <ImageBackground
        source={colors.backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.primary }]}>
              Tarot & Astroloji
            </Text>
            <Text style={[styles.subtitle, { color: colors.secondary }]}>
              Günlük rehberliğiniz için
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Davet kodunu girin"
                placeholderTextColor={colors.secondary}
                value={inviteCode}
                onChangeText={setInviteCode}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: colors.primary }]}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>Giriş Yap</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.algorithmButton}
              onPress={() => setShowAlgorithm(true)}
            >
              <Text style={[styles.algorithmButtonText, { color: colors.secondary }]}>
                Davet kodu nasıl alınır?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Algoritma Modal */}
      <Modal
        visible={showAlgorithm}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAlgorithm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.primary }]}>
              Davet Kodu Algoritması
            </Text>
            <Text style={[styles.modalText, { color: colors.text }]}>
              Bugünün davet kodu: {generateInviteCode()}
            </Text>
            <Text style={[styles.modalSubtext, { color: colors.secondary }]}>
              Format: AAGGYY (Ay + Gün + Yılın son 2 hanesi)
            </Text>
            <Text style={[styles.modalSubtext, { color: colors.secondary }]}>
              Örnek: Bugün 15 Aralık 2024 ise kod: 121524
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowAlgorithm(false)}
            >
              <Text style={styles.modalButtonText}>Anladım</Text>
            </TouchableOpacity>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    alignItems: 'center',
    gap: 20,
  },
  inputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    width: '100%',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  input: {
    fontSize: 16,
    textAlign: 'center',
  },
  loginButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  algorithmButton: {
    paddingVertical: 8,
  },
  algorithmButtonText: {
    fontSize: 14,
    textDecorationLine: 'underline',
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
    borderWidth: 1,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  modalSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: 15,
  },
  modalButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 