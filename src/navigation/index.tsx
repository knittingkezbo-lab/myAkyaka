/**
 * Navigation — MyAkyaka ana navigasyon yapısı
 * Bottom Tabs (Ana Sayfa, Keşfet, Favoriler, Profil) + Stack (BusinessDetail)
 */
import React from 'react';
import { NavigationContainer, NavigationContainerProps } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { BusinessDetailScreen } from '../screens/BusinessDetailScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { CustomTabBar } from '../components/CustomTabBar';
import { RootStackParamList, MainTabParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

interface Props {
  theme?: NavigationContainerProps['theme'];
  onReady?: () => void;
}

export function Navigation({ theme, onReady }: Props) {
  return (
    <NavigationContainer theme={theme} onReady={onReady}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="BusinessDetail"
          component={BusinessDetailScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
