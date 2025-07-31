import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [language, setLanguage] = useState('Türkçe');
  const [theme, setTheme] = useState(colorScheme);
  const [rating, setRating] = useState(0);
  const [ratingSuccess, setRatingSuccess] = useState('');

  const handleLanguageChange = () => {
    Alert.alert(
      'Dil Seçimi',
      'Hangi dili kullanmak istiyorsunuz?',
      [
        { text: 'Türkçe', onPress: () => setLanguage('Türkçe') },
        { text: 'English', onPress: () => setLanguage('English') },
        { text: 'İptal', style: 'cancel' },
      ]
    );
  };

  const handleThemeChange = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleAbout = () => {
    Alert.alert(
      'Hakkında',
      'Tarot Kartları Uygulaması v1.0\n\nMistik deneyimler için tasarlanmıştır.',
      [{ text: 'Tamam' }]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış Yap', style: 'destructive', onPress: async () => {
          try {
            // Login durumunu temizle
            await AsyncStorage.removeItem('isLoggedIn');
            // Login sayfasına yönlendir
            router.replace('/login');
          } catch (error) {
            console.log('Logout hatası:', error);
            Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu');
          }
        }},
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hesabı Sil',
      'Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Hesabı Sil', style: 'destructive', onPress: () => {
          Alert.alert('Başarılı', 'Hesap silindi!');
        }},
      ]
    );
  };

  const SettingItem = ({ 
    title, 
    subtitle, 
    icon, 
    onPress, 
    showSwitch = false, 
    switchValue = false, 
    onSwitchChange = () => {} 
  }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={showSwitch}
    >
      <View style={styles.settingLeft}>
        <IconSymbol 
          name={icon} 
          size={24} 
          color={Colors[colorScheme ?? 'light'].text} 
        />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#767577', true: '#D4AF37' }}
          thumbColor={switchValue ? '#8C7853' : '#f4f3f4'}
        />
      ) : (
        <IconSymbol 
          name="chevron.right" 
          size={20} 
          color={Colors[colorScheme ?? 'light'].tabIconDefault} 
        />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Ayarlar
        </Text>
        <Text style={[styles.headerSubtitle, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
          Uygulama tercihlerinizi yönetin
        </Text>
      </View>

      {/* Profil Kutusu */}
      <View style={styles.section}>
        <View style={[styles.profileCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileInitials}>ES</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: Colors[colorScheme ?? 'light'].text }]}>
                Esma
              </Text>
              <Text style={[styles.profileEmail, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                esma@example.com
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Profili Düzenle</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Genel
        </Text>
        
        <SettingItem
          title="Tema"
          subtitle={theme === 'dark' ? 'Karanlık Mod' : 'Aydınlık Mod'}
          icon="paintbrush.fill"
          showSwitch={true}
          switchValue={theme === 'dark'}
          onSwitchChange={handleThemeChange}
        />
        
        <SettingItem
          title="Dil"
          subtitle={language}
          icon="globe"
          onPress={handleLanguageChange}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Bildirimler & Ses
        </Text>
        
        <SettingItem
          title="Bildirimler"
          subtitle="Push bildirimleri al"
          icon="bell.fill"
          showSwitch={true}
          switchValue={notificationsEnabled}
          onSwitchChange={setNotificationsEnabled}
        />
        
        <SettingItem
          title="Ses Efektleri"
          subtitle="Kart çekme sesleri"
          icon="speaker.wave.2.fill"
          showSwitch={true}
          switchValue={soundEnabled}
          onSwitchChange={setSoundEnabled}
        />
        
        <SettingItem
          title="Haptic Feedback"
          subtitle="Dokunsal geri bildirim"
          icon="hand.tap.fill"
          showSwitch={true}
          switchValue={hapticEnabled}
          onSwitchChange={setHapticEnabled}
        />
      </View>

      {/* Değerlendirme Bölümü */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Uygulama
        </Text>
        
        <View style={[styles.ratingCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
          <Text style={[styles.ratingTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Uygulamayı Değerlendir
          </Text>
          <View style={styles.starsContainer}>
            {[1,2,3,4,5].map((star) => (
              <TouchableOpacity 
                key={star} 
                onPress={() => {
                  setRating(star);
                  setRatingSuccess('Teşekkürler!');
                  setTimeout(() => setRatingSuccess(''), 2000);
                }}
              >
                <Ionicons
                  name={rating >= star ? 'star' : 'star-outline'}
                  size={32}
                  color={rating >= star ? '#D4AF37' : '#8C7853'}
                  style={{ marginHorizontal: 2 }}
                />
              </TouchableOpacity>
            ))}
          </View>
          {ratingSuccess ? (
            <Text style={styles.ratingSuccess}>{ratingSuccess}</Text>
          ) : null}
        </View>
        
        <SettingItem
          title="Hakkında"
          subtitle="Uygulama bilgileri"
          icon="info.circle.fill"
          onPress={handleAbout}
        />
        
        <SettingItem
          title="Gizlilik Politikası"
          subtitle="Veri kullanımı"
          icon="lock.shield.fill"
          onPress={() => Alert.alert('Gizlilik', 'Gizlilik politikası yakında eklenecek!')}
        />
        
        <SettingItem
          title="Kullanım Şartları"
          subtitle="Yasal bilgiler"
          icon="doc.text.fill"
          onPress={() => Alert.alert('Şartlar', 'Kullanım şartları yakında eklenecek!')}
        />
      </View>

      {/* Sosyal Medya */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Sosyal Medya
        </Text>
        <View style={styles.socialMediaContainer}>
          <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com')}>
            <FontAwesome name="instagram" size={24} color="#C13584" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com')}>
            <FontAwesome name="twitter" size={24} color="#1DA1F2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com')}>
            <FontAwesome name="facebook" size={24} color="#1877F2" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Çıkış ve Hesap Silme */}
      <View style={styles.section}>
        <View style={styles.dangerButtonsContainer}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={16} color="#fff" />
            <Text style={styles.logoutText}>Çıkış Yap</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
          >
            <Ionicons name="trash-outline" size={16} color="#fff" />
            <Text style={styles.deleteText}>Hesabımı Sil</Text>
          </TouchableOpacity>
        </View>
      </View>

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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  profileCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileInitials: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  editProfileButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  editProfileText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  ratingCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  ratingSuccess: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: 'bold',
  },
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 30,
  },
  dangerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 12,
  },
  logoutButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 20,
  },
}); 