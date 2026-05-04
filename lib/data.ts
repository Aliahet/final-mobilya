export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  images: string[];
  badge?: 'new' | 'sale' | 'bestseller';
  material: string;
  dimensions: string;
  colors: { name: string; hex: string }[];
  description: string;
  features: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  deliveryDays: string;
  shortDescription: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  count: number;
  description: string;
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Oturma Odası',
    slug: 'oturma-odasi',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    count: 48,
    description: 'Konfor ve estetiği buluşturan oturma odası mobilyaları',
  },
  {
    id: '2',
    name: 'Yatak Odası',
    slug: 'yatak-odasi',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
    count: 36,
    description: 'Dinginliği yansıtan yatak odası koleksiyonları',
  },
  {
    id: '3',
    name: 'Yemek Odası',
    slug: 'yemek-odasi',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80',
    count: 29,
    description: 'Anı paylaşmak için tasarlanmış yemek odası takımları',
  },
  {
    id: '4',
    name: 'Çalışma Odası',
    slug: 'calisma-odasi',
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
    count: 22,
    description: 'Verimliliği artıran premium çalışma mobilyaları',
  },
  {
    id: '5',
    name: 'Bahçe & Balkon',
    slug: 'bahce-balkon',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    count: 18,
    description: 'Açık alan yaşamı için dayanıklı ve şık mobilyalar',
  },
  {
    id: '6',
    name: 'Dekorasyon',
    slug: 'dekorasyon',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    count: 64,
    description: 'Mekanınıza karakter katan aksesuar ve dekorasyon',
  },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Mira Kanepe',
    slug: 'mira-kanepe',
    category: 'Oturma Odası',
    categorySlug: 'oturma-odasi',
    price: 28900,
    originalPrice: 34900,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=900&q=85',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=85',
      'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=900&q=85',
    ],
    badge: 'sale',
    material: 'Tam Anilin Deri / Meşe Ayak',
    dimensions: 'G 245 × D 95 × Y 82 cm',
    colors: [
      { name: 'Kum Bej', hex: '#C4A882' },
      { name: 'Antrasit', hex: '#3A3A3A' },
      { name: 'Terracotta', hex: '#B55A45' },
    ],
    description: 'Mira Kanepe, İskandinav tasarım geleneğini çağdaş estetikle harmanlayan imza koleksiyonumuzun merceğidir. Yüksek yoğunluklu soğuk köpük dolgulu oturma yüzeyi, uzun süreli konforu garanti ederken tam anilin deri kaplama, zamanla daha da güzelleşen doğal bir doku kazanır.',
    features: [
      'İtalyan tam anilin doğal deri',
      'Yüksek yoğunluklu soğuk köpük dolgu (38 kg/m³)',
      'Masif meşe ahşap ayaklar',
      'Çift yönlü yıkanabilir kılıf',
      '10 yıl yapısal garanti',
    ],
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    deliveryDays: '3–5 iş günü',
    shortDescription: 'İtalyan deri, İskandinav zarafeti — zamanla güzelleşen.',
  },
  {
    id: '2',
    name: 'Ova Berjer',
    slug: 'ova-berjer',
    category: 'Oturma Odası',
    categorySlug: 'oturma-odasi',
    price: 12400,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=85',
      'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=900&q=85',
    ],
    badge: 'new',
    material: 'Kadife / Ceviz Ahşap',
    dimensions: 'G 82 × D 88 × Y 100 cm',
    colors: [
      { name: 'Zümrüt', hex: '#2D6A4F' },
      { name: 'Gece Mavisi', hex: '#1A3557' },
      { name: 'Toz Pembe', hex: '#D4A5A5' },
      { name: 'Zeytinye', hex: '#6B6B50' },
    ],
    description: 'Ova Berjer, dinlenmek için tasarlanmış bir köşe. Yüksek kavisli sırtlığı ile tüm vücudu saran bu berjer, ince ceviz ahşap çerçevesi ve premium kadife kumaşıyla evinize karakter katar.',
    features: [
      'Premium antipilling kadife kumaş',
      'Elle yapılmış masif ceviz çerçeve',
      'Derin konfor oturma yüzeyi',
      'Sökülebilir kılıf',
      '5 yıl garanti',
    ],
    rating: 4.9,
    reviewCount: 87,
    inStock: true,
    deliveryDays: '2–4 iş günü',
    shortDescription: 'Kadife kıvrımlar, ceviz sıcaklığı — tam anlamıyla köşe koltuk.',
  },
  {
    id: '3',
    name: 'Lune Yatak',
    slug: 'lune-yatak',
    category: 'Yatak Odası',
    categorySlug: 'yatak-odasi',
    price: 19800,
    images: [
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=85',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=85',
    ],
    badge: 'bestseller',
    material: 'Dokuma Keten / Beyaz Meşe',
    dimensions: '160×200 cm / 180×200 cm',
    colors: [
      { name: 'Linen Bej', hex: '#D4C5A9' },
      { name: 'Gri Kum', hex: '#B8B0A2' },
    ],
    description: 'Lune, sabah güneşi ile birlikte uyanmak için tasarlandı. Alçak profilinin ardında gizlenen masif meşe çerçeve ve kumaş başlığı, uyku alanınızı sükûnetin simgesine dönüştürür.',
    features: [
      'Masif beyaz meşe ahşap iskelet',
      'Elle örülmüş doğal keten başlık',
      'Platform yatak tabanı (lata gerektirmez)',
      'Yatak tabanı dahil',
      '10 yıl garanti',
    ],
    rating: 4.7,
    reviewCount: 203,
    inStock: true,
    deliveryDays: '5–7 iş günü',
    shortDescription: 'Sade çizgiler, derin uyku — sabahları hissettiğiniz farklılık.',
  },
  {
    id: '4',
    name: 'Noa Yemek Masası',
    slug: 'noa-yemek-masasi',
    category: 'Yemek Odası',
    categorySlug: 'yemek-odasi',
    price: 16500,
    images: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=85',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85',
    ],
    material: 'Masif Meşe Ahşap',
    dimensions: 'G 180 × D 90 × Y 75 cm (4–6 kişilik)',
    colors: [
      { name: 'Doğal Meşe', hex: '#C4A06A' },
      { name: 'Füme Meşe', hex: '#6B5A45' },
    ],
    description: 'Noa, ailenin bir araya geldiği anların merkezi olmak için tasarlandı. Tek parça masif meşe tabla, her tahta halkasının hikaye anlattığı eşsiz bir yüzey sunar.',
    features: [
      'Tek parça masif meşe tabla (48mm kalınlık)',
      'Doğal yağ ve balmumu finish',
      'Uzatılabilir versiyon mevcuttur (+50cm)',
      '5 yıl garanti',
    ],
    rating: 4.9,
    reviewCount: 56,
    inStock: true,
    deliveryDays: '4–6 iş günü',
    shortDescription: 'Masif meşe, tek parça — her yemek bir anı.',
  },
  {
    id: '5',
    name: 'Arc Çalışma Masası',
    slug: 'arc-calisma-masasi',
    category: 'Çalışma Odası',
    categorySlug: 'calisma-odasi',
    price: 8900,
    originalPrice: 10900,
    images: [
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&q=85',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&q=85',
    ],
    badge: 'sale',
    material: 'Bambu / Mat Siyah Metal',
    dimensions: 'G 140 × D 65 × Y 75 cm',
    colors: [
      { name: 'Doğal Bambu', hex: '#C9B88A' },
      { name: 'Koyu Ceviz', hex: '#5C4033' },
    ],
    description: 'Arc, minimal çalışma alanı anlayışını yeniden tanımlıyor. Kablo yönetim kanalı ve gizli çekmecesiyle masanızı daima temiz tutarken, sürdürülebilir bambu tableau çevresel değerlerinizi yansıtır.',
    features: [
      'FSC sertifikalı bambu tabla',
      'Entegre kablo yönetim kanalı',
      'Gizli kalem çekmecesi',
      'Mat siyah toz boyalı metal ayak',
      '5 yıl garanti',
    ],
    rating: 4.6,
    reviewCount: 91,
    inStock: true,
    deliveryDays: '2–3 iş günü',
    shortDescription: 'Minimal, işlevsel, sürdürülebilir — odaklanmak için tasarlandı.',
  },
  {
    id: '6',
    name: 'Sade Kitaplık',
    slug: 'sade-kitaplik',
    category: 'Çalışma Odası',
    categorySlug: 'calisma-odasi',
    price: 6200,
    images: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&q=85',
    ],
    badge: 'new',
    material: 'Masif Meşe / Pirinç Detay',
    dimensions: 'G 90 × D 30 × Y 200 cm',
    colors: [
      { name: 'Doğal Meşe', hex: '#C4A06A' },
      { name: 'Siyah Boyalı', hex: '#1C1C1A' },
    ],
    description: 'Sade Kitaplık, ismiyle müsemma bir tasarım — sadeliği içinde barındırır. Her rafı elle zımparalanmış masif meşe, pirinç raflar arasında sahte altın değil gerçek duygu.',
    features: [
      'Masif meşe raflar',
      'Pirinç raf destekleri',
      'Duvara sabitlenebilir',
      '3 yıl garanti',
    ],
    rating: 4.7,
    reviewCount: 44,
    inStock: true,
    deliveryDays: '3–5 iş günü',
    shortDescription: 'Kitaplarınız için en iyi çerçeve.',
  },
  {
    id: '7',
    name: 'Calm Konsol',
    slug: 'calm-konsol',
    category: 'Oturma Odası',
    categorySlug: 'oturma-odasi',
    price: 7400,
    images: [
      'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=900&q=85',
    ],
    material: 'Mermer / Altın Metal',
    dimensions: 'G 120 × D 35 × Y 80 cm',
    colors: [
      { name: 'Beyaz Mermer', hex: '#F0EDE8' },
      { name: 'Siyah Mermer', hex: '#2A2A2A' },
    ],
    description: 'Doğadan kesilen tek parça mermer tabla ve ince altın tonlu metal çerçeve — girişinizi ya da yaşam alanınızı vurgular.',
    features: [
      'Doğal mermer tabla (her biri eşsiz)',
      'İnce altın tonlu metal çerçeve',
      'Üst yüzey koruma uygulaması',
      '3 yıl garanti',
    ],
    rating: 4.8,
    reviewCount: 38,
    inStock: true,
    deliveryDays: '5–7 iş günü',
    shortDescription: 'Mermer ve altın — zamansız bir giriş.',
  },
  {
    id: '8',
    name: 'Drift Sehpa',
    slug: 'drift-sehpa',
    category: 'Oturma Odası',
    categorySlug: 'oturma-odasi',
    price: 3800,
    images: [
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=85',
    ],
    badge: 'new',
    material: 'Rattan / Masif Tik',
    dimensions: 'Ø 60 cm, Y 42 cm',
    colors: [
      { name: 'Doğal Rattan', hex: '#C4A882' },
    ],
    description: 'El örgüsü rattan yüzey, masif tik ahşap çerçeve — doğanın diliyle tasarım.',
    features: [
      'El örgüsü rattan tabla',
      'Masif tik ahşap ayaklar',
      'Hafif ve dayanıklı',
      '3 yıl garanti',
    ],
    rating: 4.5,
    reviewCount: 72,
    inStock: true,
    deliveryDays: '2–3 iş günü',
    shortDescription: 'Doğadan gelen sadelik — her masaya uyum sağlar.',
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id || p.slug === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return products.slice(0, 4);
}

export function getRelatedProducts(product: Product): Product[] {
  return products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
