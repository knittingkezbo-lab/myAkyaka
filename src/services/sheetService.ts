import Papa from 'papaparse';
import { Business, CategoryId } from '../types';

// TODO: Replace with actual published Google Sheets CSV URL
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSh3Ry1wWDhNO4MiS6-LJpS7rkwrFb4JtE6Ze2cn-j1onaV4pvgTkR1Evy0VGUiHCj4A3WV3Nk1FAM7/pub?output=csv';

const categoryMap: Record<string, CategoryId> = {
  'Yeme & İçme': 'yeme-icme',
  'Aktivite & Doğa': 'aktivite-doga',
  'Konaklama': 'konaklama',
  'Eğlence & Gece Hayatı': 'eglence',
  'Alışveriş': 'alisveris',
  'Pratik Bilgiler': 'pratik-bilgiler'
};

export async function fetchBusinessesFromSheet(): Promise<Business[]> {
  try {
    const response = await fetch(SHEET_CSV_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet data: ${response.status}`);
    }
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const businesses: Business[] = [];

          results.data.forEach((row: any, index: number) => {
            // Kritik İş Mantığı: Onaylı_Mi "Hayır" ise Premium_Mu değeri "Hayır" kabul edilir.
            const isOnayli = String(row.Onayli_Mi || '').trim().toLowerCase() === 'evet';
            const isPremiumRaw = String(row.Premium_Mu || '').trim().toLowerCase() === 'evet';

            // Onaylı değilse kesinlikle premium (featured) olamaz.
            const isFeatured = isOnayli && isPremiumRaw;

            // Diğer alanları eşle. Sütun isimleri Google Sheets'teki başlıklarla aynı olmalıdır.
            // Örnek sütunlar: Id, Name, Description, Category, CoverImage, Images, Rating, vb.
            const business: Business = {
              id: row.Id || `sheet-${index}`,
              name: row.Name || 'İsimsiz İşletme',
              description: row.Description || '',
              category: (row.Category || 'yeme-icme') as CategoryId,
              coverImage: row.CoverImage || 'https://via.placeholder.com/400x300',
              images: row.Images ? row.Images.split(',').map((s: string) => s.trim()) : [],
              rating: parseFloat(row.Rating) || 0,
              reviewCount: parseInt(row.ReviewCount, 10) || 0,
              address: row.Address || '',
              phone: row.Phone || '',
              latitude: parseFloat(row.Latitude) || 0,
              longitude: parseFloat(row.Longitude) || 0,
              workingHours: row.WorkingHours || '',
              priceRange: (row.PriceRange || '₺') as '₺' | '₺₺' | '₺₺₺',
              tags: row.Tags ? row.Tags.split(',').map((s: string) => s.trim()) : [],
              isFeatured: isFeatured,
            };

            // Sadece onaylı olanları da filtreleyebiliriz veya hepsini alıp UI'da filtreleyebiliriz.
            // Genelde onaylı olmayanların uygulamada hiç görünmemesi istenir.
            // Prompt "Eğer Onaylı_Mi Hayır ise... Premium_Mu 'Evet' yazsa bile sistem onu Hayır (Standart işletme) kabul etmeli." diyor.
            // Bu, onaylı olmayanların da listeleneceği, ancak premium ayrıcalıklardan yararlanamayacağı anlamına geliyor.
            businesses.push(business);
          });

          resolve(businesses);
        },
        error: (error: Error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
}
