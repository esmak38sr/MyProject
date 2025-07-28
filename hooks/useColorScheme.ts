import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

export type ColorScheme = 'light' | 'dark' | 'system';

export function useColorScheme() {
  const systemColorScheme = useSystemColorScheme();
  const [userColorScheme, setUserColorScheme] = useState<'light' | 'dark' | 'system' | null>('dark');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadColorScheme();
  }, []);

  const loadColorScheme = async () => {
    try {
      const savedScheme = await AsyncStorage.getItem('userColorScheme');
      if (savedScheme) {
        setUserColorScheme(savedScheme as ColorScheme);
      }
    } catch (error) {
      console.log('Tema yüklenirken hata:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const setColorScheme = async (scheme: ColorScheme) => {
    try {
      await AsyncStorage.setItem('userColorScheme', scheme);
      setUserColorScheme(scheme);
    } catch (error) {
      console.log('Tema kaydedilirken hata:', error);
    }
  };

  const getCurrentColorScheme = (): 'light' | 'dark' => {
    if (userColorScheme === 'system') {
      return systemColorScheme || 'light';
    }
    return userColorScheme;
  };

  return {
    colorScheme: getCurrentColorScheme(),
    userColorScheme,
    setColorScheme,
    isLoaded,
  };
}
