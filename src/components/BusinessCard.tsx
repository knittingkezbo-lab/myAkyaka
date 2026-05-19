/**
 * BusinessCard — İşletme kartı komponenti
 * Kapak fotoğrafı, gradient overlay, isim, kategori badge, puan, favori butonu
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Business } from '../types';
import { useCategoriesContext } from '../contexts/CategoriesContext';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface Props {
  business: Business;
  onPress: (business: Business) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (businessId: string) => void;
}

export function BusinessCard({ business, onPress, isFavorite = false, onToggleFavorite }: Props) {
  const { getCategoryById } = useCategoriesContext();
  const category = getCategoryById(business.category);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress(business)}
      style={styles.container}
    >
      {/* Kapak fotoğrafı */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: business.coverImage }} style={styles.image} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />

        {/* Kategori badge */}
        {category && (
          <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
            <Ionicons name={category.icon as any} size={12} color="#FFF" />
            <Text style={styles.categoryText}>{category.name}</Text>
          </View>
        )}

        {/* Puan */}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color="#FFD93D" />
          <Text style={styles.ratingText}>{business.rating}</Text>
        </View>

        {/* Favori butonu */}
        {onToggleFavorite && (
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={(e) => {
              e.stopPropagation?.();
              onToggleFavorite(business.id);
            }}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite ? '#E74C3C' : '#FFF'}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Alt bilgi */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{business.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{business.description}</Text>

        <View style={styles.footer}>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color={Colors.textTertiary} />
            <Text style={styles.address} numberOfLines={1}>{business.address}</Text>
          </View>
          <View style={styles.actionBtn}>
            <Text style={styles.actionText}>Şimdi Keşfet</Text>
            <Ionicons name="arrow-forward" size={14} color={Colors.accent} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  imageWrapper: {
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.border,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  categoryBadge: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  categoryText: {
    fontSize: Typography.tiny,
    color: '#FFF',
    fontWeight: Typography.bold,
  },
  ratingBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    gap: 3,
  },
  ratingText: {
    fontSize: Typography.caption,
    color: '#FFF',
    fontWeight: Typography.bold,
  },
  favoriteBtn: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    padding: Spacing.lg,
  },
  name: {
    fontSize: Typography.h3,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flex: 1,
  },
  address: {
    fontSize: Typography.caption,
    color: Colors.textTertiary,
    flex: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: Typography.caption,
    color: Colors.accent,
    fontWeight: Typography.bold,
  },
});
