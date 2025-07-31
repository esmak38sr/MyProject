// Neon.tech API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001/api',
  ENDPOINTS: {
    REGISTER: '/register',
    LOGIN: '/login',
    PROFILE: '/profile',
    TEST: '/test'
  }
};

// Tip tanımları
interface UserData {
  email: string;
  password: string;
  name: string;
  surname: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface ProfileData {
  gender?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  zodiac?: string;
  job?: string;
  relationshipStatus?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  created_at: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

// API fonksiyonları
export const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API hatası');
    }

    return data;
  } catch (error) {
    console.error('API çağrısı hatası:', error);
    throw error;
  }
};

// Auth fonksiyonları
export const authAPI = {
  // Üye ol
  register: async (userData: UserData): Promise<AuthResponse> => {
    return apiCall(API_CONFIG.ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Giriş yap
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiCall(API_CONFIG.ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  // Profil güncelle
  updateProfile: async (userId: string, profileData: ProfileData): Promise<any> => {
    return apiCall(`${API_CONFIG.ENDPOINTS.PROFILE}/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  // Profil getir
  getProfile: async (userId: string): Promise<any> => {
    return apiCall(`${API_CONFIG.ENDPOINTS.PROFILE}/${userId}`);
  }
}; 