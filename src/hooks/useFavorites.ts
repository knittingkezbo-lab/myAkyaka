/**
 * useFavorites — Favori yönetimi hook'u
 * 
 * Anonim kullanıcı ID ile AsyncStorage + Firestore senkronizasyonu.
 * Firestore bağlantısı yoksa sadece local storage kullanır.
 */
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addFavorite as addToFirestore,
  removeFavorite as removeFromFirestore,
  subscribeToFavorites,
} from '../services/firestoreService';

const FAVORITES_STORAGE_KEY = '@myakyaka_favorites';
const USER_ID_KEY = '@myakyaka_user_id';

/** Basit anonim kullanıcı ID oluştur/oku */
async function getOrCreateUserId(): Promise<string> {
  let userId = await AsyncStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = `anon_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    await AsyncStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

interface UseFavoritesResult {
  favoriteIds: string[];
  isFavorite: (businessId: string) => boolean;
  toggleFavorite: (businessId: string) => Promise<void>;
  loading: boolean;
}

export function useFavorites(): UseFavoritesResult {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Kullanıcı ID'si al ve favorileri yükle
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function init() {
      try {
        const uid = await getOrCreateUserId();
        setUserId(uid);

        // Önce local'den yükle (hızlı ilk render)
        const localFavs = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        if (localFavs) {
          setFavoriteIds(JSON.parse(localFavs));
        }

        // Firestore'dan gerçek zamanlı dinle
        try {
          unsubscribe = subscribeToFavorites(uid, (firestoreFavs) => {
            setFavoriteIds(firestoreFavs);
            // Local'i de güncelle
            AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(firestoreFavs));
          });
        } catch {
          // Firestore yoksa sadece local kullan
          console.warn('Firestore favori dinleme başarısız, local kullanılıyor.');
        }
      } catch (err) {
        console.error('Favori yükleme hatası:', err);
      } finally {
        setLoading(false);
      }
    }

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Favori durumunu kontrol et
  const isFavorite = useCallback(
    (businessId: string): boolean => favoriteIds.includes(businessId),
    [favoriteIds]
  );

  // Favori ekle/kaldır (toggle)
  const toggleFavorite = useCallback(
    async (businessId: string): Promise<void> => {
      const isCurrentlyFavorite = favoriteIds.includes(businessId);
      let newFavs: string[];

      if (isCurrentlyFavorite) {
        // Kaldır
        newFavs = favoriteIds.filter((id) => id !== businessId);
      } else {
        // Ekle
        newFavs = [...favoriteIds, businessId];
      }

      // Optimistic update — UI'ı hemen güncelle
      setFavoriteIds(newFavs);
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavs));

      // Firestore'a yaz (arka planda)
      if (userId) {
        try {
          if (isCurrentlyFavorite) {
            await removeFromFirestore(userId, businessId);
          } else {
            await addToFirestore(userId, businessId);
          }
        } catch {
          console.warn('Firestore favori güncelleme başarısız, local kaydedildi.');
        }
      }
    },
    [favoriteIds, userId]
  );

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    loading,
  };
}
