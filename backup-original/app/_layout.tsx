import { useColorScheme } from '@/hooks/useColorScheme';
import { Audio } from 'expo-av';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    async function playStartupSound() {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('@/assets/sounds/uygulama-sesi.mp3')
        );
        await sound.playAsync();
      } catch (error) {
        console.log('Ses çalınamadı:', error);
      }
    }

    playStartupSound();
  }, []);

  // Web için mobil görünüm CSS'i
  useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        body {
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        #root {
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
        }
        
        /* Mobil görünüm için container */
        .mobile-container {
          width: 375px;
          height: 812px;
          max-width: 100vw;
          max-height: 100vh;
          background: #000;
          border-radius: 25px;
          overflow: hidden;
          box-shadow: 
            0 0 30px rgba(212, 175, 55, 0.4),
            0 0 60px rgba(212, 175, 55, 0.2),
            inset 0 0 20px rgba(212, 175, 55, 0.1);
          position: relative;
          border: 2px solid rgba(212, 175, 55, 0.3);
        }
        
        /* Telefon çerçevesi efekti */
        .mobile-container::before {
          content: '';
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 4px;
          background: rgba(212, 175, 55, 0.6);
          border-radius: 2px;
          z-index: 1000;
        }
        
        /* Responsive tasarım */
        @media (max-width: 400px) {
          .mobile-container {
            width: 100vw;
            height: 100vh;
            border-radius: 0;
            border: none;
          }
          
          .mobile-container::before {
            display: none;
          }
        }
        
        /* Scroll bar gizleme */
        ::-webkit-scrollbar {
          display: none;
        }
        
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Touch efektleri */
        * {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        /* Mobil animasyonlar */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .mobile-container > * {
          animation: fadeIn 0.5s ease-out;
        }
      `;
      document.head.appendChild(style);
      
      // Root element'e mobil container class'ı ekle
      const root = document.getElementById('root');
      if (root) {
        root.className = 'mobile-container';
      }
    }
  }, []);

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
