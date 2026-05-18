/**
 * Firebase Konfigürasyonu
 * Firebase JS SDK kullanılıyor — Expo Go ile uyumlu.
 *
 * google-services.json dosyasından alınan bilgilerle
 * web uyumlu Firebase yapılandırması.
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase web konfigürasyonu
const firebaseConfig = {
  apiKey: 'AIzaSyD8GGvXyyyWP7BvKutyOg3US0rmjqRa6M4',
  authDomain: 'myakyaka.firebaseapp.com',
  projectId: 'myakyaka',
  storageBucket: 'myakyaka.firebasestorage.app',
  messagingSenderId: '1031722414025',
  appId: '1:1031722414025:android:b90d89a188c7ca9ea40218',
};

// Firebase uygulamasını başlat (tekrar başlatmayı önle)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firestore instance'ını dışa aktar
export const db = getFirestore(app);

export default db;
