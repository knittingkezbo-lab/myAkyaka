// src/services/weatherService.ts

// NOT: Lütfen kendi OpenWeatherMap API anahtarınızı buraya girin.
// https://openweathermap.org/api adresinden ücretsiz alabilirsiniz.
const API_KEY = '489c3866dffd501afe6dd03b5215c3ec' as string;
const AKYAKA_LAT = 37.0553;
const AKYAKA_LON = 28.3244;

export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  windSpeedKnots: number;
  windSpeedKmh: number;
  windDirectionText: string;
  humidity: number;
  description: string;
}

// Rüzgar açısını (0-360) Türkçeye çeviren fonksiyon
function getWindDirectionText(degree: number): string {
  if (degree >= 337.5 || degree < 22.5) return 'Yıldız (K)';
  if (degree >= 22.5 && degree < 67.5) return 'Poyraz (KD)';
  if (degree >= 67.5 && degree < 112.5) return 'Gündoğusu (D)';
  if (degree >= 112.5 && degree < 157.5) return 'Keşişleme (GD)';
  if (degree >= 157.5 && degree < 202.5) return 'Kıble (G)';
  if (degree >= 202.5 && degree < 247.5) return 'Lodos (GB)';
  if (degree >= 247.5 && degree < 292.5) return 'Günbatısı (B)';
  if (degree >= 292.5 && degree < 337.5) return 'Karayel (KB)';
  return 'Bilinmiyor';
}

// OpenWeatherMap ikon kodunu Ionicons isimlerine çeviren fonksiyon
function mapWeatherIcon(owmIcon: string): string {
  const iconMap: Record<string, string> = {
    '01d': 'sunny',
    '01n': 'moon',
    '02d': 'partly-sunny',
    '02n': 'cloudy-night',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'rainy',
    '09n': 'rainy',
    '10d': 'rainy',
    '10n': 'rainy',
    '11d': 'thunderstorm',
    '11n': 'thunderstorm',
    '13d': 'snow',
    '13n': 'snow',
    '50d': 'menu', // fog/mist
    '50n': 'menu',
  };
  return iconMap[owmIcon] || 'partly-sunny';
}

export async function fetchAkyakaWeather(): Promise<WeatherData | null> {
  const isPlaceholder = API_KEY.startsWith('YOUR_');
  if (isPlaceholder) {
    console.warn("Lütfen geçerli bir OpenWeatherMap API_KEY giriniz. Mock veri dönülüyor.");
    // Geliştirme aşamasında API key olmadan çalışabilmesi için Mock veri dön
    return {
      temperature: 26,
      condition: 'Açık',
      icon: 'sunny',
      windSpeedKnots: 15,
      windSpeedKmh: 28,
      windDirectionText: 'Lodos (GB)',
      humidity: 55,
      description: 'Rüzgar sörfü için ideal koşullar! 🏄‍♂️'
    };
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${AKYAKA_LAT}&lon=${AKYAKA_LON}&units=metric&lang=tr&appid=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Weather verisi alınamadı');
    }

    const data = await response.json();
    
    // Rüzgar dönüşümleri
    const windSpeedMs = data.wind.speed;
    const windSpeedKmh = Math.round(windSpeedMs * 3.6);
    const windSpeedKnots = Math.round(windSpeedMs * 1.94384);
    const windDirectionText = getWindDirectionText(data.wind.deg);

    // Dinamik mesaj (Sörf = ~12 knot üzeri ideal)
    let description = "Deniz sakin, yüzmek veya kürek sörfü (SUP) için harika! 🌊";
    if (windSpeedKnots > 12) {
      description = "Rüzgar sörfü veya kiteboard için ideal koşullar! 🏄‍♂️";
    }

    return {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1),
      icon: mapWeatherIcon(data.weather[0].icon),
      windSpeedKnots,
      windSpeedKmh,
      windDirectionText,
      humidity: data.main.humidity,
      description
    };
  } catch (error) {
    console.error("Hava durumu API hatası:", error);
    return null;
  }
}
