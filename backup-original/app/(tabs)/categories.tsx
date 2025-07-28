import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';

const categories = [
  {
    id: 'ask',
    title: 'Aşk',
    subtitle: 'Kalp konuları',
    icon: 'heart.fill',
    color: '#FF6B6B',
    description: 'Aşk ve ilişki odaklı okuma',
  },
  {
    id: 'saglik',
    title: 'Sağlık',
    subtitle: 'Fiziksel ve ruhsal',
    icon: 'cross.fill',
    color: '#4ECDC4',
    description: 'Sağlık ve iyilik hali',
  },
  {
    id: 'kariyer',
    title: 'Kariyer',
    subtitle: 'İş ve meslek',
    icon: 'briefcase.fill',
    color: '#45B7D1',
    description: 'Kariyer ve iş hayatı',
  },
  {
    id: 'genel',
    title: 'Genel',
    subtitle: 'Genel rehberlik',
    icon: 'star.fill',
    color: '#D4AF37',
    description: 'Genel yaşam rehberliği',
  },
];

export default function CategoriesScreen() {
  const colorScheme = useColorScheme();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showTarotModal, setShowTarotModal] = useState(false);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowTarotModal(true);
  };

  const CategoryCard = ({ category }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        { 
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderColor: category.color,
        }
      ]}
      onPress={() => handleCategorySelect(category.id)}
      activeOpacity={0.8}
    >
      <View style={styles.categoryHeader}>
        <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
          <IconSymbol 
            name={category.icon} 
            size={28} 
            color={category.color} 
          />
        </View>
        <View style={styles.categoryInfo}>
          <Text style={[styles.categoryTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            {category.title}
          </Text>
          <Text style={[styles.categorySubtitle, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            {category.subtitle}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.categoryDescription, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
        {category.description}
      </Text>
      
      <View style={styles.categoryFooter}>
        <View style={styles.difficultyContainer}>
          <IconSymbol 
            name="star.fill" 
            size={12} 
            color={category.color} 
          />
          <Text style={[styles.difficultyText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            Orta
          </Text>
        </View>
        
        <View style={styles.timeContainer}>
          <IconSymbol 
            name="clock.fill" 
            size={12} 
            color={Colors[colorScheme ?? 'light'].tabIconDefault} 
          />
          <Text style={[styles.timeText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            10-15 dk
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Kategoriler
        </Text>
        <Text style={[styles.headerSubtitle, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
          Size uygun okuma türünü seçin
        </Text>
      </View>

      <View style={styles.categoriesGrid}>
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <IconSymbol 
            name="lightbulb.fill" 
            size={24} 
            color="#D4AF37" 
          />
          <Text style={[styles.infoText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Her kategori farklı bir amaca hizmet eder. Size en uygun olanı seçerek kişiselleştirilmiş bir okuma deneyimi yaşayabilirsiniz.
          </Text>
        </View>
      </View>

      {/* Tarot Seçim Modalı */}
      <Modal
        visible={showTarotModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowTarotModal(false)}
      >
        <View style={[styles.modalContent, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
          <Text style={[styles.modalTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            {selectedCategory && categories.find(c => c.id === selectedCategory)?.title} Okuması
          </Text>
          
          <View style={styles.modalInfo}>
            <Text style={[styles.modalText, { color: Colors[colorScheme ?? 'light'].text }]}>
              Bu kategori için tarot kartları seçilecek ve detaylı yorum yapılacak.
            </Text>
            
            <View style={styles.modalFeatures}>
              <View style={styles.featureItem}>
                <IconSymbol name="cards.fill" size={20} color="#D4AF37" />
                <Text style={[styles.featureText, { color: Colors[colorScheme ?? 'light'].text }]}>
                  3 Kart Seçimi
                </Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="text.book.closed.fill" size={20} color="#D4AF37" />
                <Text style={[styles.featureText, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Detaylı Yorum
                </Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="sparkles" size={20} color="#D4AF37" />
                <Text style={[styles.featureText, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Kişiselleştirilmiş
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.startButton}
              onPress={() => {
                setShowTarotModal(false);
                // Burada tarot çekme sayfasına yönlendirme yapılacak
              }}
            >
              <Text style={styles.startButtonText}>Okumaya Başla</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowTarotModal(false)}
            >
              <Text style={[styles.cancelButtonText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                İptal
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  categoriesGrid: {
    paddingHorizontal: 20,
  },
  categoryCard: {
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categorySubtitle: {
    fontSize: 14,
  },
  categoryDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  categoryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyText: {
    fontSize: 12,
    marginLeft: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  modalInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  modalFeatures: {
    alignItems: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 12,
  },
  modalButtons: {
    width: '100%',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginBottom: 15,
    minWidth: 200,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    fontSize: 16,
  },
  bottomSpacing: {
    height: 20,
  },
}); 