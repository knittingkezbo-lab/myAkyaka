import { useState, useEffect, useCallback, useMemo } from 'react';
import { Business, CategoryId } from '../types';
import { subscribeToBusinesses } from '../services/firestoreService';

interface UseBusinessesResult {
  businesses: Business[];
  featuredBusinesses: Business[];
  loading: boolean;
  error: string | null;
  filterByCategory: (category: CategoryId | null) => Business[];
  searchBusinesses: (query: string) => Business[];
}

export function useBusinesses(): UseBusinessesResult {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToBusinesses(
      (data) => {
        setBusinesses(data);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore işletme çekme hatası:', err);
        setError(err.message || 'İşletmeler yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Öne çıkan işletmeler
  const featuredBusinesses = useMemo(
    () => businesses.filter((b) => b.isFeatured),
    [businesses]
  );

  // Kategoriye göre filtreleme
  const filterByCategory = useCallback(
    (category: CategoryId | null): Business[] => {
      if (!category) return businesses;
      // category id ile eşleştirme yapıyoruz. Firestore'da nasıl kaydedildiyse o şekilde.
      return businesses.filter((b) => b.category === category);
    },
    [businesses]
  );

  // Arama
  const searchBusinesses = useCallback(
    (query: string): Business[] => {
      if (!query.trim()) return businesses;
      const q = query.toLowerCase();
      return businesses.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          (b.tags && b.tags.some((t) => t.toLowerCase().includes(q)))
      );
    },
    [businesses]
  );

  return {
    businesses,
    featuredBusinesses,
    loading,
    error,
    filterByCategory,
    searchBusinesses,
  };
}
