/**
 * MyAkyaka — App Entry Component
 * Splash screen yönetimi ve tema ayarları
 */
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { useColorScheme, StatusBar } from 'react-native';
import { Navigation } from './navigation';

SplashScreen.preventAutoHideAsync();

export function App() {
  const colorScheme = useColorScheme();
  // MyAkyaka her zaman light tema kullanır (tasarım sistemi light-mode odaklı)
  const theme = DefaultTheme;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      <Navigation
        theme={theme}
        onReady={() => {
          SplashScreen.hideAsync();
        }}
      />
    </>
  );
}
