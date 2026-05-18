/**
 * MyAkyaka — Tip Tanımları
 * Uygulamada kullanılan tüm TypeScript arayüzleri
 */

/** İşletme kategorileri */
export type CategoryId =
  | 'yeme-icme'
  | 'aktivite-doga'
  | 'konaklama'
  | 'eglence'
  | 'alisveris'
  | 'pratik-bilgiler';

/** Kategori tanımı */
export interface Category {
  id: CategoryId;
  name: string;
  icon: string; // Ionicons icon adı
  color: string;
  gradient: [string, string];
}

/** İşletme verisi */
export interface Business {
  id: string;
  name: string;
  description: string;
  category: CategoryId;
  coverImage: string;
  images: string[];
  rating: number;
  reviewCount: number;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  workingHours: string;
  priceRange: '₺' | '₺₺' | '₺₺₺';
  tags: string[];
  isFeatured: boolean;
}

/** Hava durumu verisi (mock) */
export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  windSpeed: number;
  windDirection: string;
  humidity: number;
  description: string;
}

/** Navigasyon parametreleri */
export type RootStackParamList = {
  MainTabs: undefined;
  BusinessDetail: { business: Business };
};

export type MainTabParamList = {
  Home: undefined;
  Explore: undefined;
  Favorites: undefined;
  Profile: undefined;
};
