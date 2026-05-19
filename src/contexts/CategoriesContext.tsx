import React, { createContext, useContext, useEffect, useState } from 'react';
import { Category } from '../types';
import { subscribeToCategories } from '../services/firestoreService';

interface CategoriesContextData {
  categories: Category[];
  loading: boolean;
  getCategoryById: (id: string) => Category | undefined;
}

const CategoriesContext = createContext<CategoriesContextData>({
  categories: [],
  loading: true,
  getCategoryById: () => undefined,
});

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToCategories(
      (data) => {
        setCategories(data);
        setLoading(false);
      },
      (error) => {
        console.error('Kategoriler çekilemedi:', error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const getCategoryById = (id: string) => categories.find(c => c.id === id);

  return (
    <CategoriesContext.Provider value={{ categories, loading, getCategoryById }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export const useCategoriesContext = () => useContext(CategoriesContext);
