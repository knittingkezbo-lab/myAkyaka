/**
 * useBusinesses — İşletme verilerini yöneten custom hook
 * 
 * Google Sheets'ten veri çeker.
 * Kategori filtreleme ve arama desteği.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Business, CategoryId } from '../types';
import { fetchBusinessesFromSheet } from '../services/sheetService';

interface UseBusinessesResult {
  businesses: Business[];
  featuredBusinesses: Business[];
  loading: boolean;
  error: string | null;
  filterByCategory: (category: CategoryId | null) => Business[];
  searchBusinesses: (query: string) => Business[];
  refreshData: () => Promise<void>;
}

export function useBusinesses(): UseBusinessesResult {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBusinessesFromSheet();
      setBusinesses(data);
    } catch (err: any) {
      console.error('Google Sheets veri çekme hatası:', err);
      setError(err.message || 'Veri çekilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Öne çıkan işletmeler
  const featuredBusinesses = useMemo(
    () => businesses.filter((b) => b.isFeatured),
    [businesses]
  );

  // Kategoriye göre filtreleme
  const filterByCategory = useCallback(
    (category: CategoryId | null): Business[] => {
      if (!category) return businesses;
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
          b.tags.some((t) => t.toLowerCase().includes(q))
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
    refreshData: loadData,
  };
}
