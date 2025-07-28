import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();

  const handleDeleteAccount = () => {
    Alert.alert('Hesabı Sil', 'Hesabınızı silmek istediğinizden emin misiniz? (Demo)');
  };

  const handleDeactivateAccount = () => {
    Alert.alert('Hesabı Kapat', 'Hesabınızı kapatmak istediğinizden emin misiniz? (Demo)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Hoşgeldin</Text>
      <Text style={styles.title}>Profil</Text>
      <Button title="Giriş Yap" onPress={() => router.push('/(tabs)/Login')} />
      <View style={{ height: 16 }} />
      <Button title="Üye Ol" onPress={() => router.push('/(tabs)/Register')} />
      <View style={{ height: 32 }} />
      <Button title="Hesabı Sil" color="#D32F2F" onPress={handleDeleteAccount} />
      <View style={{ height: 12 }} />
      <Button title="Hesabı Kapat" color="#8C7853" onPress={handleDeactivateAccount} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#D4AF37', // gold
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
}); 