/**
 * ExploreScreen — Keşfet Ekranı
 * Arama, kategori filtreleme, tüm işletmelerin listesi
 * Firestore entegrasyonu
 */
import React, { useState, useMemo, useCallback } from 'react';
import { View, FlatList, StyleSheet, StatusBar, Text, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchBar } from '../components/SearchBar';
import { CategorySlider } from '../components/CategorySlider';
import { BusinessCard } from '../components/BusinessCard';
import { Colors, Typography, Spacing } from '../constants/theme';
import { useBusinesses } from '../hooks/useBusinesses';
import { useFavorites } from '../hooks/useFavorites';
import { Business, RootStackParamList } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { businesses, loading } = useBusinesses();
  const { isFavorite, toggleFavorite } = useFavorites();

  const filteredBusinesses = useMemo(() => {
    let result = businesses;
    if (selectedCategory) {
      result = result.filter((b) => b.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.tags.some((t: string) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [businesses, searchQuery, selectedCategory]);

  const handleCategorySelect = useCallback((id: string) => {
    setSelectedCategory((prev) => (prev === id ? null : id));
  }, []);

  const handleBusinessPress = useCallback((business: Business) => {
    navigation.navigate('BusinessDetail', { business });
  }, [navigation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBusinesses}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Keşfet</Text>
                <Text style={styles.subtitle}>{businesses.length} mekan seni bekliyor</Text>
              </View>
              <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
              <CategorySlider
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
              />
              <Text style={styles.resultCount}>
                {filteredBusinesses.length} sonuç bulundu
              </Text>
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
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyText}>Aramanıza uygun sonuç bulunamadı.</Text>
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
  loadingText: { fontSize: Typography.body, color: Colors.textTertiary },
  header: {
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.h1, fontWeight: Typography.extraBold, color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.bodySmall, color: Colors.textTertiary, marginTop: 2,
  },
  resultCount: {
    fontSize: Typography.caption, color: Colors.textTertiary,
    paddingHorizontal: Spacing.xl, marginBottom: Spacing.md,
  },
  empty: { alignItems: 'center', paddingVertical: Spacing.huge },
  emptyEmoji: { fontSize: 48, marginBottom: Spacing.md },
  emptyText: { fontSize: Typography.body, color: Colors.textTertiary },
});
