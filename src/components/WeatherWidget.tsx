/**
 * WeatherWidget — Akyaka hava durumu kartı
 * Glassmorphism efektli, rüzgar hızı ve yön göstergesi (Canlı API verileriyle)
 */
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Spacing, Typography, Shadows } from '../constants/theme';
import { WeatherData } from '../services/weatherService';

interface Props {
  weather: WeatherData | null;
  loading: boolean;
}

export function WeatherWidget({ weather, loading }: Props) {
  if (loading) {
    return (
      <View style={styles.wrapper}>
        <LinearGradient
          colors={['#2E5C55', '#3D7A70', '#4A9A8D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.container, styles.loadingContainer]}
        >
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Akyaka Rüzgar & Hava Durumu Yükleniyor...</Text>
        </LinearGradient>
      </View>
    );
  }

  // Weather null ise ve loading değilse hata durumudur, fallback gösterelim
  const w = weather || {
    temperature: 26,
    condition: 'Açık',
    icon: 'sunny' as const,
    windSpeedKnots: 15,
    windDirectionText: 'Lodos (GB)',
    humidity: 55,
    description: 'Hava durumu şu an yüklenemedi ama Akyaka her zamanki gibi harika! 🌊',
  };

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
            <Ionicons name={w.icon as any} size={36} color="#FFD93D" />
          </View>
        </View>

        {/* Açıklama */}
        <Text style={styles.description}>{w.description}</Text>

        {/* Alt kısım — rüzgar ve nem */}
        <View style={styles.bottomRow}>
          <View style={styles.stat}>
            <Ionicons name="speedometer-outline" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.statText}>
              {w.windSpeedKnots} Knot ({Math.round(w.windSpeedKnots * 1.852)} km/s)
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Ionicons name="compass-outline" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.statText}>{w.windDirectionText}</Text>
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
    minHeight: 180,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: Typography.bodySmall,
    fontWeight: Typography.medium,
    opacity: 0.9,
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
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  statText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: Typography.semiBold,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
});
