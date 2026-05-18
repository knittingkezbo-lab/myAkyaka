/**
 * Header — "Akyaka'da Bugün" başlığı
 * Günün saatine göre dinamik karşılama mesajı ve lokasyon ikonu
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../constants/theme';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'İyi Geceler 🌙';
  if (hour < 12) return 'Günaydın ☀️';
  if (hour < 18) return 'İyi Öğleden Sonralar 🌤';
  return 'İyi Akşamlar 🌅';
}

export function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.title}>Akyaka'da Bugün</Text>
      </View>
      <View style={styles.locationBadge}>
        <Ionicons name="location" size={14} color={Colors.accent} />
        <Text style={styles.locationText}>Akyaka, Muğla</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  left: { flex: 1 },
  greeting: {
    fontSize: Typography.bodySmall,
    color: Colors.textTertiary,
    fontWeight: Typography.medium,
    marginBottom: 2,
  },
  title: {
    fontSize: Typography.h1,
    fontWeight: Typography.extraBold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentSoft,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: 20,
    gap: 4,
    marginTop: Spacing.xs,
  },
  locationText: {
    fontSize: Typography.caption,
    color: Colors.accent,
    fontWeight: Typography.semiBold,
  },
});
