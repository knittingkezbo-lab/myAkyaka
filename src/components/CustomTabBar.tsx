/**
 * CustomTabBar — Özel bottom tab bar
 * Blur efektli arka plan, animasyonlu aktif gösterge
 */
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Shadows } from '../constants/theme';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Explore: { active: 'compass', inactive: 'compass-outline' },
  Favorites: { active: 'heart', inactive: 'heart-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

const TAB_LABELS: Record<string, string> = {
  Home: 'Ana Sayfa',
  Explore: 'Keşfet',
  Favorites: 'Favoriler',
  Profile: 'Profil',
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const iconNames = TAB_ICONS[route.name] || { active: 'ellipse', inactive: 'ellipse-outline' };
          const iconName = isFocused ? iconNames.active : iconNames.inactive;
          const label = TAB_LABELS[route.name] || route.name;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.7}
              onPress={onPress}
              style={styles.tab}
            >
              {isFocused && <View style={styles.activeIndicator} />}
              <Ionicons
                name={iconName as any}
                size={24}
                color={isFocused ? Colors.primary : Colors.textTertiary}
              />
              <Text style={[styles.label, isFocused && styles.labelActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    backgroundColor: Colors.surface,
    borderTopWidth: 0,
    ...Shadows.lg,
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: Spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: -Spacing.sm,
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  label: {
    fontSize: Typography.tiny,
    fontWeight: Typography.medium,
    color: Colors.textTertiary,
    marginTop: 3,
  },
  labelActive: {
    color: Colors.primary,
    fontWeight: Typography.bold,
  },
});
