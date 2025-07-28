import { useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function DrawScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fal Çek</Text>
      <Button title="Tek Kart Falı" onPress={() => router.push('/(tabs)/SingleCard')} />
      <View style={{ height: 16 }} />
      <Button title="Üç Kart Falı" onPress={() => {}} disabled />
      <Text style={styles.info}>(Üç Kart Falı yakında!)</Text>
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
  info: {
    marginTop: 12,
    color: '#888',
  },
}); 