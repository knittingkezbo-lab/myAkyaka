/**
 * HomeScreen — Ana Sayfa
 * Header, WeatherWidget, CategorySlider, Popüler İşletmeler
 * Firestore entegrasyonu ile veri çekme (fallback: mock veri)
 */
import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header } from '../components/Header';
import { WeatherWidget } from '../components/WeatherWidget';
import { CategorySlider } from '../components/CategorySlider';
import { BusinessCard } from '../components/BusinessCard';
import { Colors, Typography, Spacing } from '../constants/theme';
import { useBusinesses } from '../hooks/useBusinesses';
import { useFavorites } from '../hooks/useFavorites';
import { Business, RootStackParamList } from '../types';
import { fetchAkyakaWeather, WeatherData } from '../services/weatherService';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Hava durumu verileri state
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // Google Sheets'ten işletmeleri çek
  const { businesses, featuredBusinesses, loading, filterByCategory } = useBusinesses();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    async function loadWeather() {
      try {
        const data = await fetchAkyakaWeather();
        setWeather(data);
      } catch (err) {
        console.error(err);
      } finally {
        setWeatherLoading(false);
      }
    }
    loadWeather();
  }, []);

  // Kategori seçimine göre filtreleme
  const displayedBusinesses = selectedCategory
    ? filterByCategory(selectedCategory as any)
    : featuredBusinesses;

  const handleCategorySelect = useCallback((id: string) => {
    setSelectedCategory((prev) => (prev === id ? null : id));
  }, []);

  const handleBusinessPress = useCallback((business: Business) => {
    navigation.navigate('BusinessDetail', { business });
  }, [navigation]);

  const sectionTitle = selectedCategory ? 'Sonuçlar' : 'Popüler Mekanlar 🔥';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Mekanlar yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={displayedBusinesses}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <>
              <Header />
              <WeatherWidget weather={weather} loading={weatherLoading} />
              <CategorySlider
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
              />
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{sectionTitle}</Text>
              </View>
            </>
          }
          renderItem={({ item }) => (
            <BusinessCard
              business={item}
              onPress={handleBusinessPress}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={toggleFavorite}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Bu kategoride henüz işletme yok.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { paddingBottom: 100 },
  loadingContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.md,
  },
  loadingText: {
    fontSize: Typography.body, color: Colors.textTertiary,
  },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.h3, fontWeight: Typography.bold, color: Colors.textPrimary,
  },
  mockBadge: {
    display: 'none',
  },
  mockBadgeText: {
    display: 'none',
  },
  empty: { alignItems: 'center', paddingVertical: Spacing.huge },
  emptyText: { fontSize: Typography.body, color: Colors.textTertiary },
});
