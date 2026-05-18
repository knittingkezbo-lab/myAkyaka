/**
 * FavoritesScreen — Favori işletmeler
 * useFavorites hook ile AsyncStorage + Firestore senkronizasyonu
 */
import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BusinessCard } from '../components/BusinessCard';
import { useBusinesses } from '../hooks/useBusinesses';
import { useFavorites } from '../hooks/useFavorites';
import { Colors, Typography, Spacing } from '../constants/theme';
import { Business, RootStackParamList } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const { businesses } = useBusinesses();
  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();

  // Favori işletmeleri filtrele
  const favoriteBusinesses = useMemo(
    () => businesses.filter((b) => favoriteIds.includes(b.id)),
    [businesses, favoriteIds]
  );

  const handleBusinessPress = useCallback((business: Business) => {
    navigation.navigate('BusinessDetail', { business });
  }, [navigation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorilerim</Text>
        <Text style={styles.subtitle}>
          {favoriteIds.length > 0
            ? `${favoriteIds.length} beğendiğin mekan`
            : 'Beğendiğin mekanları burada bul'}
        </Text>
      </View>

      {favoriteBusinesses.length > 0 ? (
        <FlatList
          data={favoriteBusinesses}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <BusinessCard
              business={item}
              onPress={handleBusinessPress}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={toggleFavorite}
            />
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="heart-outline" size={64} color={Colors.border} />
          </View>
          <Text style={styles.emptyTitle}>Henüz favori mekanın yok</Text>
          <Text style={styles.emptyDesc}>
            İşletme kartlarındaki kalp ikonuna dokunarak{'\n'}favorilerine ekleyebilirsin.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.h1,
    fontWeight: Typography.extraBold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.bodySmall,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  list: { paddingBottom: 100 },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.divider,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptyDesc: {
    fontSize: Typography.bodySmall,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
