/**
 * WeatherWidget — Akyaka hava durumu kartı
 * Glassmorphism efektli, rüzgar hızı ve yön göstergesi (mock veri)
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Spacing, Typography, Shadows } from '../constants/theme';

const MOCK_WEATHER = {
  temperature: 26,
  condition: 'Güneşli',
  icon: 'sunny' as const,
  windSpeed: 18,
  windDirection: 'GB',
  humidity: 55,
  description: 'Rüzgar sörfü için ideal koşullar!',
};

export function WeatherWidget() {
  const w = MOCK_WEATHER;

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#2E5C55', '#3D7A70', '#4A9A8D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Üst kısım — sıcaklık ve ikon */}
        <View style={styles.topRow}>
          <View>
            <Text style={styles.temp}>{w.temperature}°</Text>
            <Text style={styles.condition}>{w.condition}</Text>
          </View>
          <View style={styles.iconCircle}>
            <Ionicons name={w.icon} size={36} color="#FFD93D" />
          </View>
        </View>

        {/* Açıklama */}
        <Text style={styles.description}>{w.description}</Text>

        {/* Alt kısım — rüzgar ve nem */}
        <View style={styles.bottomRow}>
          <View style={styles.stat}>
            <Ionicons name="speedometer-outline" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.statText}>{w.windSpeed} km/s {w.windDirection}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Ionicons name="water-outline" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.statText}>%{w.humidity} Nem</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadows.lg,
  },
  container: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  temp: {
    fontSize: 52,
    fontWeight: Typography.extraBold,
    color: '#FFFFFF',
    lineHeight: 56,
  },
  condition: {
    fontSize: Typography.body,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: Typography.medium,
    marginTop: 2,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: Typography.bodySmall,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: Typography.medium,
    marginTop: Spacing.md,
    fontStyle: 'italic',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  statText: {
    fontSize: Typography.caption,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: Typography.semiBold,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
});
