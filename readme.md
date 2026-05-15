# MyAkyaka Projesi: Master Prompt (v1.0)

**Giriş ve Rol:**
Sen üst düzey bir Full-Stack Mobile Developer ve UI/UX Tasarımcısısın. "MyAkyaka" adında, Akyaka beldesi için geliştirilen hiper-yerel bir turizm rehber uygulamasının (MVP) ilk sürümünü inşa edeceksin. Hem iOS hem de Android cihazlarda stabil çalışan, modern ve hızlı bir yapı kurmalısın.

**Teknik Altyapı:**
- **Framework:** React Native (Expo)
- **Navigasyon:** Expo Router veya React Navigation (Bottom Tabs)
- **Styling:** NativeWind (Tailwind CSS) veya StyleSheet (Modern ve esnek bir yapı)

**Görsel Kimlik (Tasarım Sistemi):**
- **Ana Renk (Primary):** Çam Yeşili (#2E5C55) - Doğayı ve Akyaka'nın ruhunu temsil eder.
- **Aksiyon Rengi (Accent):** Gün Batımı Turuncusu (#F26419) - Kullanıcıyı harekete geçiren butonlar için.
- **Arka Plan:** Kırık Beyaz / Soft Bej (#F8F9FA)
- **Tipografi:** Modern, sans-serif, okunaklı fontlar.

**Uygulama Mimarisi ve Ekranlar:**

1. **Ana Ekran (Home):**
   - **Header:** "Akyaka'da Bugün" başlığı ve kullanıcı karşılama mesajı.
   - **Hava Durumu Widget:** Akyaka'nın rüzgar ve hava durumunu gösteren estetik bir kart (Şimdilik mock verilerle).
   - **Kategori Menüsü:** Yatayda kaydırılabilen (Horizontal Scroll) ikonlu butonlar. 
     *Kategoriler:* Yeme & İçme, Aktivite & Doğa, Konaklama, Eğlence, Alışveriş, Pratik Bilgiler.

2. **Keşfet Akışı (Discovery Feed):**
   - Kategorilerin altında dikey bir akışta popüler işletmeler listelenecek.
   - **İşletme Kartı Komponenti:** - Yüksek çözünürlüklü kapak fotoğrafı.
     - İşletme ismi ve kategorisi.
     - "Psikolojik Kanca" içeren butonlar: "Detaylar" yerine "Şimdi Keşfet", "Hemen Ulaş" gibi turuncu renkli butonlar.

**Özel Talimatlar:**
- **Vibecoding Yaklaşımı:** Kodları yazarken her fonksiyonun amacını kısa yorumlarla açıkla.
- **Modüler Yapı:** Komponentleri (Button, Card, Header vb.) ayrı dosyalarda tut ki ileride geliştirmesi kolay olsun.
- **Mock Veri:** Başlangıç için Google Sheets bağlantısı kurmadan önce, yukarıdaki 6 kategoriye uygun 5 adet gerçekçi örnek işletme verisiyle (Ad, Fotoğraf, Açıklama) arayüzü doldur.

**Hedef:** Uygulamayı çalıştırdığımda görsel olarak tatmin edici, tıklanabilir ve Akyaka'nın enerjisini yansıtan bir prototip görmek istiyorum. Şimdi kodlamaya başla!