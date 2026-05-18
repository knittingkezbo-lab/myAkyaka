/**
 * SearchBar — İşletme arama çubuğu
 */
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'İşletme veya aktivite ara...' }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={Colors.textTertiary} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textTertiary}
      />
      {value.length > 0 && (
        <Ionicons name="close-circle" size={20} color={Colors.textTertiary} onPress={() => onChangeText('')} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  input: {
    flex: 1,
    fontSize: Typography.body,
    color: Colors.textPrimary,
    padding: 0,
  },
});
