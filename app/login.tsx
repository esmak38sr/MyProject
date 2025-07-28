import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState('');

  const handleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (inviteCode.trim() === '') {
      Alert.alert('Hata', 'Lütfen davet kodunu girin.');
      return;
    }

    // Basit doğrulama - gerçek uygulamada API çağrısı yapılır
    if (inviteCode.length >= 3) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Hata', 'Geçersiz davet kodu.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🔮</Text>
          <Text style={styles.appName}>Mistik Rehber</Text>
          <Text style={styles.tagline}>Ruhsal yolculuğunuza hoş geldiniz</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Davet Kodu</Text>
          <TextInput
            style={styles.input}
            value={inviteCode}
            onChangeText={setInviteCode}
            placeholder="Davet kodunuzu girin"
            placeholderTextColor="#8C7853"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Mistik dünyaya adım atmak için davet koduna ihtiyacınız var
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 10,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: '#8C7853',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    color: '#D4AF37',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333333',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  loginButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#8C7853',
    textAlign: 'center',
    lineHeight: 20,
  },
}); 