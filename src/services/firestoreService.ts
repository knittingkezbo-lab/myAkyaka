/**
 * Firestore Servis Katmanı
 * Firebase JS SDK (modular API) kullanılıyor — Expo Go ile uyumlu.
 *
 * Koleksiyon yapısı:
 *   businesses/{businessId}  — İşletme dokümanları
 *   categories/{categoryId}  — Kategori dokümanları
 *   users/{userId}/favorites/{businessId} — Kullanıcı favorileri
 *   bookings/{bookingId}     — Rezervasyon talepleri
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
  addDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Business, Category } from '../types';

// === Koleksiyon referansları ===
const BUSINESSES = 'businesses';
const CATEGORIES = 'categories';
const USERS = 'users';
const FAVORITES = 'favorites';
const BOOKINGS = 'bookings';

// === İşletme verisi dönüştürücü ===
function docToBusiness(docSnap: DocumentSnapshot): Business {
  const d = docSnap.data() ?? {};
  return {
    id: docSnap.id,
    name: d.name ?? '',
    description: d.description ?? '',
    category: d.category ?? 'yeme-icme',
    coverImage: d.coverImageUrl ?? d.coverImage ?? '', // Admin panel coverImageUrl kullanıyor
    images: d.images ?? [],
    rating: d.rating ?? 0,
    reviewCount: d.reviewCount ?? 0,
    address: d.location?.address ?? d.address ?? '',
    phone: d.contact?.phone ?? d.phone ?? '',
    latitude: d.latitude ?? 0,
    longitude: d.longitude ?? 0,
    workingHours: d.workingHours ?? '',
    priceRange: d.priceRange ?? '₺',
    tags: d.tags ?? [],
    isPremium: d.isPremium ?? false,
    isFeatured: d.isFeatured ?? false,
    isApproved: d.isApproved ?? false,
    createdAt: d.createdAt?.toMillis() ?? 0,
  };
}

// === Kategori verisi dönüştürücü ===
function docToCategory(docSnap: DocumentSnapshot): Category {
  const d = docSnap.data() ?? {};
  return {
    id: docSnap.id,
    name: d.name ?? 'Kategori',
    icon: d.icon ?? 'leaf',
    color: d.color ?? '#27AE60',
    gradient: d.gradient ?? ['#27AE60', '#6FCF97'],
  };
}

// === Kategori Sorguları ===
/** Kategorileri gerçek zamanlı dinler */
export function subscribeToCategories(
  callback: (categories: Category[]) => void,
  onError?: (error: Error) => void
): () => void {
  return onSnapshot(
    collection(db, CATEGORIES),
    (snapshot) => {
      const categories = snapshot.docs.map(docToCategory);
      callback(categories);
    },
    (error) => {
      console.error('Firestore kategori dinleme hatası:', error);
      onError?.(error);
    }
  );
}

// === İşletme Sorguları ===

/** Tek işletme detayını çeker */
export async function getBusinessById(id: string): Promise<Business | null> {
  const docSnap = await getDoc(doc(db, BUSINESSES, id));
  if (!docSnap.exists()) return null;
  return docToBusiness(docSnap);
}

/** İşletmeleri gerçek zamanlı dinler (Sadece Onaylılar) */
export function subscribeToBusinesses(
  callback: (businesses: Business[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(collection(db, BUSINESSES), where('isApproved', '==', true));
  
  return onSnapshot(
    q,
    (snapshot) => {
      let businesses = snapshot.docs.map(docToBusiness);
      
      // Client-side sorting: isPremium == true first, then createdAt desc
      businesses.sort((a, b) => {
        if (a.isPremium && !b.isPremium) return -1;
        if (!a.isPremium && b.isPremium) return 1;
        // if both are premium or both are not, sort by createdAt desc
        return b.createdAt - a.createdAt;
      });
      
      callback(businesses);
    },
    (error) => {
      console.error('Firestore işletme dinleme hatası:', error);
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

// === Rezervasyon (Booking) İşlemleri ===

export async function createBooking(data: {
  businessId: string;
  businessName: string;
  customerName: string;
  customerPhone: string;
  date: string;
  partySize: number;
}) {
  await addDoc(collection(db, BOOKINGS), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}
