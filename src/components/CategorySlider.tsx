/**
 * CategorySlider — Yatay kaydırılabilir kategori listesi
 */
import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { CategoryButton } from './CategoryButton';
import { useCategoriesContext } from '../contexts/CategoriesContext';
import { Colors, Typography, Spacing } from '../constants/theme';

interface Props {
  selectedCategory: string | null;
  onSelectCategory: (id: string) => void;
}

export function CategorySlider({ selectedCategory, onSelectCategory }: Props) {
  const { categories } = useCategoriesContext();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Kategoriler</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CategoryButton
            category={item}
            isSelected={selectedCategory === item.id}
            onPress={onSelectCategory}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  list: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xs,
  },
});
