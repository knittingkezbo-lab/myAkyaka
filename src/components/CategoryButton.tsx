/**
 * CategoryButton — Kategori seçim butonu
 * İkon + isim, seçili durumda accent renk vurgusu
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../types';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface Props {
  category: Category;
  isSelected: boolean;
  onPress: (id: string) => void;
}

export function CategoryButton({ category, isSelected, onPress }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(category.id)}
      style={[styles.container, isSelected && styles.selected]}
    >
      <View style={[styles.iconCircle, { backgroundColor: isSelected ? category.color : category.color + '15' }]}>
        <Ionicons
          name={category.icon as any}
          size={22}
          color={isSelected ? '#FFF' : category.color}
        />
      </View>
      <Text style={[styles.label, isSelected && styles.labelSelected]} numberOfLines={1}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    marginRight: Spacing.sm,
    width: 88,
    ...Shadows.sm,
  },
  selected: {
    backgroundColor: Colors.primarySoft,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: Typography.tiny + 1,
    fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  labelSelected: {
    color: Colors.primary,
    fontWeight: Typography.bold,
  },
});
