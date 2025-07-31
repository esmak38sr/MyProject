import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { UserProfile as NeonUserProfile, loadUserProfileDemo, saveUserProfileDemo } from '../../lib/neon';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  birthDate: Date;
  phone: string;
  bio: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    birthDate: new Date(),
    phone: '',
    bio: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    console.log('useEffect - Neon database mode');
    
    // Demo kullanıcı oluştur
    const demoUser = { uid: 'demo-user-123', email: 'demo@example.com' } as User;
    setUser(demoUser);
    loadUserProfileFromNeon('demo-user-123');
  }, []);

  const loadUserProfileFromNeon = async (userId: string) => {
    try {
      console.log('Neon veritabanından profil yükleniyor...');
      const neonProfile = await loadUserProfileDemo(userId);
      
      if (neonProfile) {
        // Neon veritabanından gelen veriyi UI formatına çevir
        const uiProfile: UserProfile = {
          firstName: neonProfile.first_name || '',
          lastName: neonProfile.last_name || '',
          email: neonProfile.email || '',
          gender: neonProfile.gender || '',
          birthDate: neonProfile.birth_date ? new Date(neonProfile.birth_date) : new Date(),
          phone: neonProfile.phone || '',
          bio: neonProfile.bio || ''
        };
        
        setProfile(uiProfile);
        setOriginalProfile(uiProfile);
        console.log('Profil başarıyla yüklendi:', uiProfile);
      } else {
        // Yeni kullanıcı için varsayılan profil
        const defaultProfile: UserProfile = {
          firstName: '',
          lastName: '',
          email: user?.email || '',
          gender: '',
          birthDate: new Date(),
          phone: '',
          bio: ''
        };
        setProfile(defaultProfile);
        setOriginalProfile(defaultProfile);
        console.log('Yeni kullanıcı için varsayılan profil oluşturuldu');
      }
    } catch (error) {
      console.error('Profil yükleme hatası:', error);
      Alert.alert('Hata', 'Profil bilgileri yüklenirken bir hata oluştu.');
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      console.log('Neon veritabanına profil kaydediliyor...');
      
      // UI formatındaki veriyi Neon formatına çevir
      const neonProfile: NeonUserProfile = {
        user_id: user.uid,
        first_name: profile.firstName,
        last_name: profile.lastName,
        email: profile.email,
        gender: profile.gender,
        birth_date: profile.birthDate.toISOString().split('T')[0], // YYYY-MM-DD formatı
        phone: profile.phone,
        bio: profile.bio
      };
      
      await saveUserProfileDemo(neonProfile);
      
      setOriginalProfile({ ...profile });
      setIsEditing(false);
      Alert.alert('Başarılı', 'Profil bilgileriniz başarıyla kaydedildi!');
      console.log('Profil başarıyla kaydedildi');
      
    } catch (error) {
      console.error('Profil kaydetme hatası:', error);
      Alert.alert('Hata', 'Profil bilgileri kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (originalProfile) {
      setProfile(originalProfile);
    }
    setIsEditing(false);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setProfile(prev => ({ ...prev, birthDate: selectedDate }));
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert('Hesabı Sil', 'Hesabınızı silmek istediğinizden emin misiniz? (Demo)');
  };

  const handleDeactivateAccount = () => {
    Alert.alert('Hesabı Kapat', 'Hesabınızı kapatmak istediğinizden emin misiniz? (Demo)');
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Hoşgeldin</Text>
        <Text style={styles.title}>Profil</Text>
        <Button title="Giriş Yap" onPress={() => router.push('/(tabs)/Login')} />
        <View style={{ height: 16 }} />
        <Button title="Üye Ol" onPress={() => router.push('/(tabs)/Register')} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Hoşgeldin</Text>
        <Text style={styles.title}>Profil</Text>
        
        {!isEditing ? (
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => setIsEditing(true)}
          >
            <Ionicons name="pencil" size={20} color="#D4AF37" />
            <Text style={styles.editButtonText}>Düzenle</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.editActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.saveButton]} 
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={styles.actionButtonText}>
                {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]} 
              onPress={handleCancel}
            >
              <Text style={styles.actionButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ad</Text>
          <TextInput
            style={[styles.darkInputField, !isEditing && styles.disabledDarkInput]}
            value={profile.firstName}
            onChangeText={(text) => setProfile(prev => ({ ...prev, firstName: text }))}
            placeholder="Adınızı girin"
            placeholderTextColor="#ccc"
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Soyad</Text>
          <TextInput
            style={[styles.blackTextInput, !isEditing && styles.disabledInput]}
            value={profile.lastName}
            onChangeText={(text) => setProfile(prev => ({ ...prev, lastName: text }))}
            placeholder="Soyadınızı girin"
            placeholderTextColor="#999"
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-posta</Text>
          <TextInput
            style={[styles.blackTextInput, !isEditing && styles.disabledInput]}
            value={profile.email}
            onChangeText={(text) => setProfile(prev => ({ ...prev, email: text }))}
            placeholder="E-posta adresinizi girin"
            placeholderTextColor="#999"
            keyboardType="email-address"
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cinsiyet</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={profile.gender}
            onChangeText={(text) => setProfile(prev => ({ ...prev, gender: text }))}
            placeholder="Cinsiyetinizi girin"
            placeholderTextColor="#999"
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Doğum Tarihi</Text>
          <TouchableOpacity
            style={[styles.input, styles.dateInput, !isEditing && styles.disabledInput]}
            onPress={() => isEditing && setShowDatePicker(true)}
            disabled={!isEditing}
          >
            <Text style={styles.dateText}>
              {profile.birthDate.toLocaleDateString('tr-TR')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Telefon</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={profile.phone}
            onChangeText={(text) => setProfile(prev => ({ ...prev, phone: text }))}
            placeholder="Telefon numaranızı girin"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Hakkımda</Text>
          <TextInput
            style={[styles.input, styles.textArea, !isEditing && styles.disabledInput]}
            value={profile.bio}
            onChangeText={(text) => setProfile(prev => ({ ...prev, bio: text }))}
            placeholder="Kendiniz hakkında kısa bir yazı"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            editable={isEditing}
          />
        </View>
      </View>

      <View style={styles.dangerZone}>
        <Text style={styles.dangerZoneTitle}>Tehlikeli Bölge</Text>
        <Button title="Hesabı Sil" color="#D32F2F" onPress={handleDeleteAccount} />
        <View style={{ height: 12 }} />
        <Button title="Hesabı Kapat" color="#8C7853" onPress={handleDeactivateAccount} />
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={profile.birthDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
    marginBottom: 16,
    textAlign: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginTop: 8,
  },
  editButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#D4AF37',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  saveButton: {
    backgroundColor: '#D4AF37',
  },
  cancelButton: {
    backgroundColor: '#8C7853',
  },
  actionButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  blackText: {
    color: '#fff',
    fontWeight: '500',
  },
  darkInput: {
    backgroundColor: '#000',
    borderColor: '#555',
  },
  darkInputField: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#000',
    color: '#000',
  },
  disabledInput: {
    backgroundColor: '#f9f9f9',
    color: '#666',
    borderColor: '#ccc',
  },
  disabledDarkInput: {
    backgroundColor: '#000',
    color: '#000',
    borderColor: '#444',
  },
  blackTextInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
    fontWeight: '600',
  },
  dateInput: {
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dangerZone: {
    padding: 20,
    marginTop: 20,
  },
  dangerZoneTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 16,
    textAlign: 'center',
  },
}); 