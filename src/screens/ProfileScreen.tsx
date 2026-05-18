/**
 * ProfileScreen — Profil ve ayarlar ekranı
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const MENU_ITEMS = [
  { icon: 'notifications-outline', label: 'Bildirimler', badge: '3' },
  { icon: 'bookmark-outline', label: 'Kaydedilenler' },
  { icon: 'map-outline', label: 'Ziyaret Geçmişi' },
  { icon: 'settings-outline', label: 'Ayarlar' },
  { icon: 'help-circle-outline', label: 'Yardım & Destek' },
  { icon: 'information-circle-outline', label: 'Hakkında' },
];

export function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
      </View>

      {/* Profil kartı */}
      <View style={styles.profileCard}>
        <LinearGradient
          colors={Colors.gradientPrimary}
          style={styles.avatar}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="person" size={32} color="#FFF" />
        </LinearGradient>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Misafir Kullanıcı</Text>
          <Text style={styles.profileEmail}>Giriş yapmak için dokunun</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
      </View>

      {/* İstatistik kartları */}
      <View style={styles.statsRow}>
        <StatCard icon="heart" count="0" label="Favori" color="#E74C3C" />
        <StatCard icon="eye" count="0" label="Görüntüleme" color="#2D9CDB" />
        <StatCard icon="star" count="0" label="Yorum" color="#F2C94C" />
      </View>

      {/* Menü */}
      <View style={styles.menu}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity key={item.label} style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuIconBg}>
              <Ionicons name={item.icon as any} size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <View style={styles.menuRight}>
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.version}>MyAkyaka v1.0.0</Text>
    </ScrollView>
  );
}

function StatCard({ icon, count, label, color }: { icon: string; count: string; label: string; color: string }) {
  return (
    <View style={statStyles.card}>
      <Ionicons name={icon as any} size={22} color={color} />
      <Text style={statStyles.count}>{count}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1, alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg, paddingVertical: Spacing.lg, ...Shadows.sm,
  },
  count: { fontSize: Typography.h2, fontWeight: Typography.bold, color: Colors.textPrimary, marginTop: 4 },
  label: { fontSize: Typography.tiny, color: Colors.textTertiary, marginTop: 2 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  title: { fontSize: Typography.h1, fontWeight: Typography.extraBold, color: Colors.textPrimary },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    marginHorizontal: Spacing.xl, borderRadius: BorderRadius.xl,
    padding: Spacing.lg, marginBottom: Spacing.lg, ...Shadows.md,
  },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
  },
  profileInfo: { flex: 1, marginLeft: Spacing.md },
  profileName: { fontSize: Typography.h3, fontWeight: Typography.bold, color: Colors.textPrimary },
  profileEmail: { fontSize: Typography.caption, color: Colors.textTertiary, marginTop: 2 },
  statsRow: {
    flexDirection: 'row', gap: Spacing.md,
    paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl,
  },
  menu: {
    backgroundColor: Colors.surface, marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl, overflow: 'hidden', ...Shadows.sm,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg,
    borderBottomWidth: 1, borderBottomColor: Colors.divider,
  },
  menuIconBg: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.primarySoft, justifyContent: 'center', alignItems: 'center',
  },
  menuLabel: { flex: 1, fontSize: Typography.body, color: Colors.textPrimary, marginLeft: Spacing.md },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: {
    backgroundColor: Colors.accent, paddingHorizontal: 8,
    paddingVertical: 2, borderRadius: 10,
  },
  badgeText: { fontSize: Typography.tiny, color: '#FFF', fontWeight: Typography.bold },
  version: {
    textAlign: 'center', fontSize: Typography.caption,
    color: Colors.textTertiary, marginTop: Spacing.xl, marginBottom: 100,
  },
});
