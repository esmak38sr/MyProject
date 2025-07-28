import { Tabs } from 'expo-router';
import React from 'react';
import { ImageBackground } from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  // Arka plan görselini tema'ya göre seç
  const backgroundImage = colorScheme.colorScheme === 'dark'
    ? require('@/assets/images/arka-plan-karanlik.jpg')
    : require('@/assets/images/arka-plan-aydinlik.jpg');

  return (
    <ImageBackground
      source={backgroundImage}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#D4AF37',
          tabBarInactiveTintColor: '#8C7853',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'rgba(0,0,0,0.9)',
            borderTopColor: '#D4AF37',
            borderTopWidth: 1,
            height: 80,
            paddingBottom: 10,
            paddingTop: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Ana Sayfa',
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol name={focused ? 'house.fill' : 'house'} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="categories"
          options={{
            title: 'Kategoriler',
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol name={focused ? 'square.grid.2x2.fill' : 'square.grid.2x2'} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Ayarlar',
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol name={focused ? 'gearshape.fill' : 'gearshape'} size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </ImageBackground>
  );
}
