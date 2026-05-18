/**
 * ActionButton — Turuncu gradient'li aksiyon butonu
 * "Şimdi Keşfet", "Hemen Ulaş" gibi psikolojik kanca metinleri
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

interface Props {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  small?: boolean;
}

export function ActionButton({ title, onPress, style, small }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={style}>
      <LinearGradient
        colors={Colors.gradientAccent}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, small && styles.gradientSmall]}
      >
        <Text style={[styles.text, small && styles.textSmall]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gradient: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md + 2,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientSmall: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  text: {
    fontSize: Typography.body,
    fontWeight: Typography.bold,
    color: Colors.textOnAccent,
    letterSpacing: 0.3,
  },
  textSmall: {
    fontSize: Typography.caption,
  },
});
