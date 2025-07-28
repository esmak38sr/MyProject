import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function Index() {
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      
      if (isLoggedIn === 'true') {
        // Kullanıcı giriş yapmış, ana sayfaya yönlendir
        router.replace('/(tabs)');
      } else {
        // Kullanıcı giriş yapmamış, login sayfasına yönlendir
        router.replace('/login');
      }
    } catch (error) {
      console.log('Login durumu kontrol edilirken hata:', error);
      // Hata durumunda login sayfasına yönlendir
      router.replace('/login');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
      <Text style={{ color: '#D4AF37', fontSize: 18 }}>Yükleniyor...</Text>
    </View>
  );
} 