/**
 * BusinessDetailScreen — İşletme detay ekranı
 * Parallax header, bilgiler, aksiyon butonları
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ActionButton } from '../components/ActionButton';
import { getCategoryById } from '../constants/categories';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { RootStackParamList } from '../types';

type DetailRoute = RouteProp<RootStackParamList, 'BusinessDetail'>;

export function BusinessDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<DetailRoute>();
  const { business } = route.params;
  const category = getCategoryById(business.category);

  const handleCall = () => {
    if (business.phone) Linking.openURL(`tel:${business.phone}`);
  };

  const handleDirections = () => {
    const url = Platform.select({
      ios: `maps:?q=${business.latitude},${business.longitude}`,
      android: `geo:${business.latitude},${business.longitude}?q=${business.name}`,
      default: `https://maps.google.com/?q=${business.latitude},${business.longitude}`,
    });
    if (url) Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Image */}
        <View style={styles.heroWrapper}>
          <Image source={{ uri: business.coverImage }} style={styles.heroImage} />
          <LinearGradient colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.6)']} style={styles.heroGradient} />
          {/* Geri butonu */}
          <TouchableOpacity style={[styles.backBtn, { top: insets.top + 8 }]} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>
          {/* Puan */}
          <View style={styles.heroBadge}>
            <Ionicons name="star" size={16} color="#FFD93D" />
            <Text style={styles.heroRating}>{business.rating}</Text>
            <Text style={styles.heroReviews}>({business.reviewCount})</Text>
          </View>
        </View>

        {/* İçerik */}
        <View style={styles.content}>
          {/* Kategori badge + isim */}
          {category && (
            <View style={[styles.catBadge, { backgroundColor: category.color + '15' }]}>
              <Ionicons name={category.icon as any} size={14} color={category.color} />
              <Text style={[styles.catText, { color: category.color }]}>{category.name}</Text>
            </View>
          )}
          <Text style={styles.name}>{business.name}</Text>
          <Text style={styles.description}>{business.description}</Text>

          {/* Bilgi kartları */}
          <View style={styles.infoGrid}>
            <InfoRow icon="location" text={business.address} />
            {business.phone ? <InfoRow icon="call" text={business.phone} /> : null}
            <InfoRow icon="time" text={business.workingHours} />
            <InfoRow icon="pricetag" text={`Fiyat Aralığı: ${business.priceRange}`} />
          </View>

          {/* Etiketler */}
          <View style={styles.tags}>
            {business.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>

          {/* Aksiyon butonları */}
          <View style={styles.actions}>
            <ActionButton title="Hemen Ulaş 📞" onPress={handleCall} style={{ flex: 1, marginRight: 8 }} />
            <ActionButton title="Yol Tarifi 🗺️" onPress={handleDirections} style={{ flex: 1 }} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={infoStyles.row}>
      <View style={infoStyles.iconBg}>
        <Ionicons name={icon as any} size={18} color={Colors.primary} />
      </View>
      <Text style={infoStyles.text}>{text}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  iconBg: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.primarySoft, justifyContent: 'center', alignItems: 'center',
  },
  text: { fontSize: Typography.bodySmall, color: Colors.textSecondary, flex: 1 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  heroWrapper: { height: 300, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: { ...StyleSheet.absoluteFillObject },
  backBtn: {
    position: 'absolute', left: 16, width: 40, height: 40,
    borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center', alignItems: 'center',
  },
  heroBadge: {
    position: 'absolute', bottom: 16, right: 16,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 20,
  },
  heroRating: { fontSize: Typography.body, color: '#FFF', fontWeight: Typography.bold },
  heroReviews: { fontSize: Typography.caption, color: 'rgba(255,255,255,0.7)' },
  content: {
    padding: Spacing.xl, marginTop: -24,
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
  },
  catBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start', paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 20, marginBottom: 12,
  },
  catText: { fontSize: Typography.caption, fontWeight: Typography.bold },
  name: { fontSize: Typography.h1, fontWeight: Typography.extraBold, color: Colors.textPrimary, marginBottom: 8 },
  description: { fontSize: Typography.body, color: Colors.textSecondary, lineHeight: 24, marginBottom: Spacing.xl },
  infoGrid: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, marginBottom: Spacing.lg, ...Shadows.sm,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.xl },
  tag: { backgroundColor: Colors.primarySoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tagText: { fontSize: Typography.caption, color: Colors.primary, fontWeight: Typography.semiBold },
  actions: { flexDirection: 'row', marginBottom: 40 },
});
