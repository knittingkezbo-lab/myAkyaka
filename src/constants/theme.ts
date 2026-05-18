/**
 * MyAkyaka — Tasarım Token'ları
 * Renk paleti, tipografi, spacing ve shadow tanımları
 */

export const Colors = {
  // Ana renkler
  primary: '#2E5C55',       // Çam Yeşili — Akyaka'nın ruhunu temsil eder
  primaryLight: '#3D7A70',
  primaryDark: '#1E3E3A',
  primarySoft: '#E8F5F2',

  // Aksiyon rengi
  accent: '#F26419',        // Gün Batımı Turuncusu — kullanıcıyı harekete geçirir
  accentLight: '#FF8A50',
  accentDark: '#C04E10',
  accentSoft: '#FFF0E6',

  // Arka plan
  background: '#F8F9FA',    // Kırık Beyaz
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Metin renkleri
  textPrimary: '#1A1A2E',
  textSecondary: '#4A4A68',
  textTertiary: '#8E8EA0',
  textOnPrimary: '#FFFFFF',
  textOnAccent: '#FFFFFF',

  // Yardımcı renkler
  success: '#27AE60',
  warning: '#F2C94C',
  error: '#EB5757',
  info: '#2D9CDB',

  // Nötr tonlar
  border: '#E8E8ED',
  divider: '#F0F0F5',
  overlay: 'rgba(0, 0, 0, 0.5)',
  cardShadow: 'rgba(0, 0, 0, 0.08)',

  // Gradient'ler
  gradientPrimary: ['#2E5C55', '#3D7A70'] as [string, string],
  gradientAccent: ['#F26419', '#FF8A50'] as [string, string],
  gradientDark: ['rgba(0,0,0,0.7)', 'rgba(0,0,0,0)'] as [string, string],
  gradientSunset: ['#F26419', '#F2C94C'] as [string, string],
};

export const Typography = {
  // Font büyüklükleri
  hero: 32,
  h1: 28,
  h2: 22,
  h3: 18,
  body: 16,
  bodySmall: 14,
  caption: 12,
  tiny: 10,

  // Font ağırlıkları
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
};
