// Neon PostgreSQL API bağlantısı
const API_BASE_URL = 'http://localhost:3000/api'; // Backend API URL'si

// Profil verisi tipi
export interface UserProfile {
  id?: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  gender?: string;
  birth_date?: string;
  phone?: string;
  bio?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Profil yükleme fonksiyonu
export async function loadUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/${userId}`);
    
    if (response.ok) {
      const data = await response.json();
      return data.profile;
    }
    return null;
  } catch (error) {
    console.error('Profil yükleme hatası:', error);
    throw error;
  }
}

// Profil kaydetme fonksiyonu
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    
    if (!response.ok) {
      throw new Error('Profil kaydetme başarısız');
    }
  } catch (error) {
    console.error('Profil kaydetme hatası:', error);
    throw error;
  }
}

// Profil güncelleme fonksiyonu
export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error('Profil güncelleme başarısız');
    }
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    throw error;
  }
}

// Demo modu için geçici çözüm
export async function loadUserProfileDemo(userId: string): Promise<UserProfile | null> {
  // Demo verisi döndür
  return {
    user_id: userId,
    first_name: 'Demo',
    last_name: 'Kullanıcı',
    email: 'demo@example.com',
    gender: 'Kadın',
    birth_date: '1990-01-01',
    phone: '5551234567',
    bio: 'Demo profil'
  };
}

export async function saveUserProfileDemo(profile: UserProfile): Promise<void> {
  // Demo modunda sadece console'a yazdır
  console.log('Demo profil kaydedildi:', profile);
  // Gerçek API hazır olana kadar bekle
  await new Promise(resolve => setTimeout(resolve, 1000));
}

export async function updateUserProfileDemo(userId: string, updates: Partial<UserProfile>): Promise<void> {
  // Demo modunda sadece console'a yazdır
  console.log('Demo profil güncellendi:', { userId, updates });
  // Gerçek API hazır olana kadar bekle
  await new Promise(resolve => setTimeout(resolve, 1000));
} 