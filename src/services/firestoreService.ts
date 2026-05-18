/**
 * Firestore Servis Katmanı
 * Firebase JS SDK (modular API) kullanılıyor — Expo Go ile uyumlu.
 *
 * Koleksiyon yapısı:
 *   businesses/{businessId}  — İşletme dokümanları
 *   users/{userId}/favorites/{businessId} — Kullanıcı favorileri
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  setDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
  DocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Business, CategoryId } from '../types';

// === Koleksiyon referansları ===
const BUSINESSES = 'businesses';
const USERS = 'users';
const FAVORITES = 'favorites';

// === İşletme verisi dönüştürücü ===
function docToBusiness(docSnap: DocumentSnapshot): Business {
  const d = docSnap.data() ?? {};
  return {
    id: docSnap.id,
    name: d.name ?? '',
    description: d.description ?? '',
    category: d.category ?? 'yeme-icme',
    coverImage: d.coverImage ?? '',
    images: d.images ?? [],
    rating: d.rating ?? 0,
    reviewCount: d.reviewCount ?? 0,
    address: d.address ?? '',
    phone: d.phone ?? '',
    latitude: d.latitude ?? 0,
    longitude: d.longitude ?? 0,
    workingHours: d.workingHours ?? '',
    priceRange: d.priceRange ?? '₺',
    tags: d.tags ?? [],
    isFeatured: d.isFeatured ?? false,
  };
}

// === İşletme Sorguları ===

/** Tüm işletmeleri çeker */
export async function getBusinesses(): Promise<Business[]> {
  const snapshot = await getDocs(collection(db, BUSINESSES));
  return snapshot.docs.map(docToBusiness);
}

/** Tek işletme detayını çeker */
export async function getBusinessById(id: string): Promise<Business | null> {
  const docSnap = await getDoc(doc(db, BUSINESSES, id));
  if (!docSnap.exists()) return null;
  return docToBusiness(docSnap);
}

/** Kategoriye göre işletmeleri filtreler */
export async function getBusinessesByCategory(
  category: CategoryId
): Promise<Business[]> {
  const q = query(
    collection(db, BUSINESSES),
    where('category', '==', category)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToBusiness);
}

/** Öne çıkan işletmeleri çeker */
export async function getFeaturedBusinesses(): Promise<Business[]> {
  const q = query(
    collection(db, BUSINESSES),
    where('isFeatured', '==', true)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToBusiness);
}

/** İşletmeleri gerçek zamanlı dinler (real-time listener) */
export function subscribeToBusinesses(
  callback: (businesses: Business[]) => void,
  onError?: (error: Error) => void
): () => void {
  return onSnapshot(
    collection(db, BUSINESSES),
    (snapshot) => {
      const businesses = snapshot.docs.map(docToBusiness);
      callback(businesses);
    },
    (error) => {
      console.error('Firestore dinleme hatası:', error);
      onError?.(error);
    }
  );
}

// === Favori İşlemleri ===

/** Kullanıcının favori ID'lerini çeker */
export async function getFavoriteIds(userId: string): Promise<string[]> {
  const snapshot = await getDocs(
    collection(db, USERS, userId, FAVORITES)
  );
  return snapshot.docs.map((d) => d.id);
}

/** Favori ekler */
export async function addFavorite(
  userId: string,
  businessId: string
): Promise<void> {
  await setDoc(doc(db, USERS, userId, FAVORITES, businessId), {
    addedAt: serverTimestamp(),
  });
}

/** Favori kaldırır */
export async function removeFavorite(
  userId: string,
  businessId: string
): Promise<void> {
  await deleteDoc(doc(db, USERS, userId, FAVORITES, businessId));
}

/** Favorileri gerçek zamanlı dinler */
export function subscribeToFavorites(
  userId: string,
  callback: (favoriteIds: string[]) => void
): () => void {
  return onSnapshot(
    collection(db, USERS, userId, FAVORITES),
    (snapshot) => {
      callback(snapshot.docs.map((d) => d.id));
    }
  );
}

// === Yardımcı: Mock veriyi Firestore'a yükleme ===

/** Mock işletme verilerini Firestore'a toplu yazar (tek seferlik seed) */
export async function seedBusinesses(businesses: Business[]): Promise<void> {
  const batch = writeBatch(db);
  businesses.forEach((b) => {
    const { id, ...data } = b;
    const ref = doc(db, BUSINESSES, id);
    batch.set(ref, data);
  });
  await batch.commit();
  console.log(`✅ ${businesses.length} işletme Firestore'a yazıldı.`);
}
