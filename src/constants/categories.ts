/**
 * MyAkyaka — Kategori Tanımları
 * 6 ana kategori: ikon, renk ve gradient bilgileri
 */

import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'yeme-icme',
    name: 'Yeme & İçme',
    icon: 'restaurant',
    color: '#E74C3C',
    gradient: ['#E74C3C', '#FF6B6B'],
  },
  {
    id: 'aktivite-doga',
    name: 'Aktivite & Doğa',
    icon: 'leaf',
    color: '#27AE60',
    gradient: ['#27AE60', '#6FCF97'],
  },
  {
    id: 'konaklama',
    name: 'Konaklama',
    icon: 'bed',
    color: '#2D9CDB',
    gradient: ['#2D9CDB', '#74C0FC'],
  },
  {
    id: 'eglence',
    name: 'Eğlence',
    icon: 'musical-notes',
    color: '#9B59B6',
    gradient: ['#9B59B6', '#C39BD3'],
  },
  {
    id: 'alisveris',
    name: 'Alışveriş',
    icon: 'bag-handle',
    color: '#F39C12',
    gradient: ['#F39C12', '#F7DC6F'],
  },
  {
    id: 'pratik-bilgiler',
    name: 'Pratik Bilgiler',
    icon: 'information-circle',
    color: '#1ABC9C',
    gradient: ['#1ABC9C', '#76D7C4'],
  },
];

/** Kategori ID'sine göre kategori nesnesini döndürür */
export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

/** Kategori ID'sine göre kategori adını döndürür */
export function getCategoryName(id: string): string {
  return getCategoryById(id)?.name ?? 'Bilinmeyen';
}
