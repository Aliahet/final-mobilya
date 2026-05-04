'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Lang = 'tr' | 'en';

// ─── Full translation dictionary ─────────────────────────────────────────────
export const dict = {
  tr: {
    lang: 'tr' as Lang,
    langLabel: 'Türkçe',

    // Announcement bar
    announcement: 'Ücretsiz Kargo — 2.000 ₺ üzeri siparişlerde · Ücretsiz montaj hizmeti',

    // Navigation
    nav: {
      collections: 'Koleksiyonlar',
      newArrivals: 'Yeni Gelenler',
      sale: 'Kampanyalar',
      about: 'Hakkımızda',
      allCategories: 'Tüm Kategoriler →',
      menu: 'Menü',
      phone: '📞 0850 123 45 67',
      hours: 'Pazartesi – Cumartesi, 09:00–18:00',
    },

    // Search
    search: {
      placeholder: 'Kanepe, yatak, masa ara...',
      trending: ['Oturma Odası', 'Kanepe', 'Yemek Masası', 'Berjer', 'Yatak'],
    },

    // Hero slides
    hero: {
      slides: [
        {
          label: 'Yeni Koleksiyon — 2024',
          headline: 'Yaşadığınız\nalanlar sizi\nanlatır.',
          sub: 'Her detay kasıtlı, her malzeme özenle seçilmiş. Evinize değer katmak için tasarlandı.',
          cta: 'Koleksiyonu Keşfet',
        },
        {
          label: 'Yatak Odası Koleksiyonu',
          headline: 'Dinginlik\nbir seçimdir.',
          sub: 'Sabah güneşiyle birlikte uyanmak için tasarlanan yatak odası mobilyaları.',
          cta: 'Yatak Odası',
        },
        {
          label: 'Yemek Odası',
          headline: 'Anlar\nmasada\nşekillenir.',
          sub: 'Ailenizi bir araya getiren yemek odası takımları. Masif ahşap, zamansız tasarım.',
          cta: 'Yemek Odası',
        },
      ],
      allProducts: 'Tüm ürünler',
      scrollLabel: 'Kaydır',
    },

    // Category grid (homepage)
    categories: {
      label: 'Kategoriler',
      heading: 'Her oda için',
      headingAccent: 'mükemmel seçim.',
      viewAll: 'Tüm Kategoriler',
      products: 'ürün',
      explore: 'Keşfet',
    },

    // Featured products (homepage)
    featured: {
      label: 'Öne Çıkanlar',
      heading: 'En çok tercih',
      headingAccent: 'edilenler.',
      viewAll: 'Tümünü Gör',
    },

    // Shop the look
    shopTheLook: {
      label: 'Shop The Look',
      heading: 'İlham alın,',
      headingAccent: 'hemen edinin.',
      desc: 'Alanına tıklayarak ürün detaylarını keşfet. Küratörlük edilmiş kombinasyonlar, ev için.',
      view: 'İncele',
    },

    // Trust bar
    trust: {
      freeShipping: 'Ücretsiz Kargo',
      freeShippingDesc: '2.000 ₺ üzeri siparişlerde',
      warranty: '10 Yıl Garanti',
      warrantyDesc: 'Yapısal çerçeve garantisi',
      sustainable: 'Sürdürülebilir',
      sustainableDesc: 'FSC sertifikalı malzeme',
      returns: '30 Gün İade',
      returnsDesc: 'Koşulsuz iade garantisi',
      support: '7/24 Destek',
      supportDesc: '0850 123 45 67',
      handcraft: 'El İşçiliği',
      handcraftDesc: 'Uzman zanaatkâr üretimi',
    },

    // Brand story section
    brandStory: {
      label: 'Bizim Hikayemiz',
      heading: 'Her parça bir\nzanaatkâr imzası\ntaşır.',
      p1: "2009'dan bu yana Final Mobilya olarak Türkiye'nin en iyi hikayeli atölyelerinde üretiyoruz. Her mobilya, ağaçların doğal özünü, zanaatkârın deneyimini ve tasarımcının vizyonunu bünyesinde barındırır.",
      p2: 'FSC sertifikalı ormanlardan gelen malzemeler, geleneksel tekniklerle işleniyor. Fabrikalarımız değil, atölyelerimiz var.',
      stat1: 'Yıllık deneyim',
      stat2: 'Mutlu müşteri',
      stat3: 'Yerli üretim',
      cta: 'Hikayemizi Okuyun',
      imgAlt1: 'Final Mobilya atölyesi',
      imgAlt2: 'El işçiliği',
    },

    // Testimonials
    testimonials: {
      label: 'Müşteri Yorumları',
      heading: 'Gerçek deneyimler,',
      headingAccent: 'gerçek mekânlar.',
    },

    // Product card
    card: {
      addToCart: 'Sepete Ekle',
    },

    // Badges
    badges: {
      new: 'Yeni',
      sale: 'İndirim',
      bestseller: 'Çok Satan',
    },

    // Product detail: purchase panel
    panel: {
      reviews: 'değerlendirme',
      colorLabel: 'Renk',
      quantityLabel: 'Adet',
      inStock: 'Stokta mevcut — hemen kargoda',
      addToCart: 'Sepete Ekle',
      addedToCart: 'Sepete Eklendi',
      save: 'Kaydet',
      saved: 'Kaydedildi',
      share: 'Paylaş',
      deliveryLabel: (days: string) => `Teslimat · ${days}`,
      deliverySub: '2.000 ₺ üzeri ücretsiz kargo',
      warranty: '10 Yıl Yapısal Garanti',
      warrantySub: 'Çerçeve ve taşıyıcı sistemler dahil',
      returns: '30 Gün Koşulsuz İade',
      returnsSub: 'Memnun kalmazsanız iade edin',
      materialLabel: 'Malzeme',
      dimensionsLabel: 'Ölçüler',
      originLabel: 'Menşei',
      originValue: 'Türkiye',
      discount: 'indirim',
    },

    // Product story (below fold)
    story: {
      label: 'Tasarım & Zanaatkarlık',
      heading: 'Her parça,',
      headingAccent: 'bir hikaye taşır.',
      p2suffix: 'Final Mobilya atölyesinden evinize ulaşana kadar özenle paketlenir ve beyaz eldiven hizmetiyle teslim edilir.',
      chips: (features: string[]) => features.slice(0, 3).map((f) => f.split('(')[0].trim()),
      materialLabel: 'Malzeme',
      stats: ['Yıllık Deneyim', 'Mutlu Müşteri', 'Yerli Üretim', 'Garanti'],
      specsLabel: 'Detaylar',
      specsHeading: 'Teknik bilgiler',
      accordion: {
        features: 'Özellikler & Malzemeler',
        dimensions: 'Ölçüler & Teknik Detaylar',
        care: 'Bakım & Temizlik',
      },
      dimensions: {
        size: 'Boyutlar',
        material: 'Malzeme',
        warranty: 'Garanti',
        origin: 'Üretim Yeri',
        delivery: 'Teslimat',
        cert: 'Sertifika',
        warrantyValue: '10 Yıl',
        originValue: 'Türkiye',
        certValue: 'FSC / ISO 9001',
      },
      care: [
        'Günlük temizlik için kuru veya hafifçe nemlendirilmiş yumuşak bir bez kullanın. Çözücü içeren ürünler ve aşındırıcı malzemelerden kaçının.',
        'Ahşap yüzeyler için yılda bir kez doğal balmumu uygulaması önerilir. Deri yüzeyler için özel deri besleyici kullanılabilir.',
        'Uzun süreli direkt güneş ışığına maruz bırakmayın — renk solması oluşabilir.',
      ],
      lifestyleLabel: 'Yaşam Alanında',
      lifestyleHeading: 'Evinizin\nen güzel köşesi.',
      lifestyleDesc: 'Final Mobilya\'nın her parçası, yaşadığınız alanın dilini konuşmak için tasarlandı. Sadece bir eşya değil, bir atmosfer.',
    },

    // Reviews
    reviews: {
      label: 'Müşteri Yorumları',
      reviews: (n: number) => `${n} değerlendirme`,
      recommend: 'müşteri tavsiye eder',
      trustNote: 'Tüm yorumlar onaylı satın alma gerçekleştirmiş müşterilerimize aittir.',
      verified: '✓ Doğrulanmış Satın Alma',
      helpful: 'Bu yorum yardımcı oldu mu?',
      helpfulYes: 'Evet',
      loadMore: (n: number) => `Tüm yorumları gör (${n})`,
      mockReviews: [
        {
          id: 1, initials: 'AK', name: 'Ayşe K.', location: 'İstanbul', rating: 5, date: '15 Mart 2024',
          title: 'Beklentilerimin çok üzerinde çıktı',
          body: 'Ürünü aldığımda gerçekten beklentilerimin çok üzerinde çıktı. Malzeme kalitesi fotoğraflarda göründüğünden çok daha iyi. Montaj ekibi son derece özenli ve profesyoneldi — her şeyi mükemmel şekilde kurdu.',
          helpful: 42, verified: true,
        },
        {
          id: 2, initials: 'MT', name: 'Murat T.', location: 'Ankara', rating: 5, date: '8 Şubat 2024',
          title: 'Premium kalite, tam istediğim gibi',
          body: 'Araştırdığım diğer markalardan çok daha üst kalite. Teslimat hızlı ve sorunsuzdu. Ürün tam tarif edildiği gibi çıktı, hiçbir sürprizle karşılaşmadım.',
          helpful: 28, verified: true,
        },
        {
          id: 3, initials: 'SB', name: 'Selin B.', location: 'İzmir', rating: 4, date: '22 Ocak 2024',
          title: 'Harika tasarım, malzeme kalitesi üst düzey',
          body: 'Tasarım ve malzeme kalitesi gerçekten çok iyi. Rengi de fotoğraflarda göründüğüyle birebir aynı — bu çok önemli bir ayrıntı.',
          helpful: 19, verified: true,
        },
        {
          id: 4, initials: 'KŞ', name: 'Kerem Ş.', location: 'İstanbul', rating: 5, date: '5 Ocak 2024',
          title: 'Zamanla daha da güzel oluyor',
          body: '3 ay önce aldım ve her gün daha çok beğeniyorum. Premium kalite gerçekten hissettiriyor. Arkadaşlarım geldiklerinde mutlaka nereden aldığımı soruyorlar.',
          helpful: 31, verified: true,
        },
      ],
    },

    // Mobile sticky bar
    stickyBar: {
      add: 'Ekle',
    },

    // Related products
    related: {
      label: 'Seti Tamamlayın',
      heading: 'Birlikte',
      headingAccent: 'güzel görünür.',
      viewCategory: 'Kategoriye Git →',
    },

    // Category listing page
    categoryPage: {
      allLabel: 'Koleksiyonlar',
      allHeading: 'Eviniz için',
      allHeadingAccent: 'her şey.',
      allDesc: 'Oturma odasından yatak odasına, yemek odasından çalışma köşesine — tüm yaşam alanlarınız için kurartörlük edilmiş koleksiyonlar.',
      products: 'ürün',
      explore: 'Keşfet',
      heading: (name: string) => name,
      label: (count: number) => `${count} ürün`,
      filter: 'Filtrele',
      clearFilters: 'Filtreleri Temizle',
      noResults: 'Sonuç bulunamadı',
      noResultsDesc: 'Filtrelerinizi genişleterek tekrar deneyin.',
      priceRange: 'Fiyat Aralığı',
      priceAll: 'Tümü',
      materialLabel: 'Malzeme',
      colorLabel: 'Renk',
      applyFilters: (count: number) => `Filtrele (${count} ürün)`,
      sortOptions: [
        { value: 'default', label: 'Önerilen' },
        { value: 'price-asc', label: 'Fiyat: Düşükten Yükseğe' },
        { value: 'price-desc', label: 'Fiyat: Yüksekten Düşüğe' },
        { value: 'rating', label: 'En Yüksek Puan' },
        { value: 'new', label: 'Yeni Gelenler' },
      ],
    },

    // Cart
    cart: {
      title: 'Sepetim',
      items: (n: number) => `${n} ürün`,
      empty: 'Sepetiniz boş',
      emptyDesc: 'Koleksiyonlarımızı keşfedin ve beğendiklerinizi ekleyin.',
      startShopping: 'Alışverişe Başla',
      freeShippingProgress: (remaining: string) => `Ücretsiz kargo için ${remaining} daha harcayın.`,
      freeShippingEarned: 'Ücretsiz kargo kazandınız!',
      subtotal: 'Ara Toplam',
      discount: 'İndirim',
      shipping: 'Kargo',
      freeShipping: 'Ücretsiz',
      total: 'Toplam',
      couponPlaceholder: 'İndirim kodu',
      couponApply: 'Uygula',
      couponApplied: (code: string) => `✓ ${code} uygulandı`,
      checkout: 'Ödemeye Geç',
      securePayment: '256-bit SSL güvenli ödeme',
      guarantee: '10 Yıl Garanti · 30 Gün İade',
      couponHint: 'İpucu: WELCOME10 kuponunu deneyin',
      continueShopping: 'Alışverişe Devam Et',
      shippingNote: 'Kargo ve vergiler ödeme adımında hesaplanır.',
      remove: 'Kaldır',
    },

    // Checkout
    checkout: {
      backToCart: '← Sepete Dön',
      shippingStep: 'Teslimat',
      paymentStep: 'Ödeme',
      shippingTitle: 'Teslimat Bilgileri',
      paymentTitle: 'Ödeme Bilgileri',
      name: 'Ad Soyad',
      namePlaceholder: 'Adınız Soyadınız',
      email: 'E-posta',
      emailPlaceholder: 'ornek@email.com',
      phone: 'Telefon',
      phonePlaceholder: '0555 000 00 00',
      address: 'Adres',
      addressPlaceholder: 'Mahalle, sokak, kapı no, daire',
      city: 'Şehir',
      cityPlaceholder: 'İstanbul',
      zip: 'Posta Kodu',
      zipPlaceholder: '34000',
      cardName: 'Kart Üzerindeki İsim',
      cardNamePlaceholder: 'AD SOYAD',
      cardNum: 'Kart Numarası',
      cardNumPlaceholder: '0000 0000 0000 0000',
      expiry: 'Son Kullanma',
      expiryPlaceholder: 'AA/YY',
      cvv: 'CVV',
      cvvPlaceholder: '•••',
      secureNote: 'Kart bilgileriniz 256-bit SSL ile korunmaktadır.',
      nextStep: 'Ödeme Adımına Geç →',
      backToShipping: '← Teslimat Bilgilerine Dön',
      orderSummary: 'Sipariş Özeti',
      products: 'Ürünler',
      payButton: (total: string) => `${total} Öde & Siparişi Tamamla`,
      successTitle: 'Siparişiniz alındı!',
      successDesc: 'Siparişiniz başarıyla oluşturuldu. Onay e-postası az sonra e-posta adresinize gönderilecek.',
      orderNo: 'Sipariş No',
      estimatedDelivery: 'Tahmini Teslimat',
      estimatedDays: '3–5 İş Günü',
      continueShopping: 'Alışverişe Devam Et',
    },

    // Footer
    footer: {
      tagline: 'Final Mobilya imzasıyla yaşam alanlarınıza anlam katıyoruz. El işçiliği, sürdürülebilir malzemeler ve zamansız tasarım.',
      newsletter: 'İlham almaya devam edin.',
      newsletterDesc: 'Yeni koleksiyonlar, tasarım hikayeleri ve özel teklifler için bültenimize katılın.',
      emailPlaceholder: 'E-posta adresiniz',
      subscribe: 'Abone Ol',
      copyright: '© 2024 Final Mobilya. Tüm hakları saklıdır.',
      trust: ['Ücretsiz Kargo', '10 Yıl Garanti', 'Sürdürülebilir', 'Güvenli Ödeme'],
    },

    // Breadcrumb
    breadcrumb: {
      home: 'Ana Sayfa',
      categories: 'Kategoriler',
    },

    // 404
    notFound: {
      heading: 'Sayfa bulunamadı',
      desc: 'Aradığınız sayfa taşınmış veya silinmiş olabilir. Ana sayfadan devam edebilirsiniz.',
      cta: 'Ana Sayfaya Dön',
    },
  },

  en: {
    lang: 'en' as Lang,
    langLabel: 'English',

    announcement: 'Free Shipping — on orders over ₺2,000 · Free assembly included',

    nav: {
      collections: 'Collections',
      newArrivals: 'New Arrivals',
      sale: 'Sale',
      about: 'About Us',
      allCategories: 'All Collections →',
      menu: 'Menu',
      phone: '📞 0850 123 45 67',
      hours: 'Monday – Saturday, 09:00–18:00',
    },

    search: {
      placeholder: 'Search sofa, bed, dining table...',
      trending: ['Living Room', 'Sofa', 'Dining Table', 'Armchair', 'Bed'],
    },

    hero: {
      slides: [
        {
          label: 'New Collection — 2024',
          headline: 'Your spaces\ntell your\nstory.',
          sub: 'Every detail intentional, every material carefully chosen. Designed to elevate your home.',
          cta: 'Explore Collection',
        },
        {
          label: 'Bedroom Collection',
          headline: 'Serenity\nis a choice.',
          sub: 'Bedroom furniture designed to greet you with the morning light.',
          cta: 'Bedroom',
        },
        {
          label: 'Dining Room',
          headline: 'Moments\nare made\nat the table.',
          sub: 'Dining sets that bring family together. Solid wood, timeless design.',
          cta: 'Dining Room',
        },
      ],
      allProducts: 'All products',
      scrollLabel: 'Scroll',
    },

    categories: {
      label: 'Categories',
      heading: 'The perfect choice',
      headingAccent: 'for every room.',
      viewAll: 'All Categories',
      products: 'products',
      explore: 'Explore',
    },

    featured: {
      label: 'Featured',
      heading: 'Our most',
      headingAccent: 'loved pieces.',
      viewAll: 'View All',
    },

    shopTheLook: {
      label: 'Shop The Look',
      heading: 'Get inspired.',
      headingAccent: 'Shop it now.',
      desc: 'Click any hotspot to explore the product. Curated combinations for every home.',
      view: 'View',
    },

    trust: {
      freeShipping: 'Free Shipping',
      freeShippingDesc: 'On orders over ₺2,000',
      warranty: '10-Year Warranty',
      warrantyDesc: 'Structural frame guarantee',
      sustainable: 'Sustainable',
      sustainableDesc: 'FSC-certified materials',
      returns: '30-Day Returns',
      returnsDesc: 'Hassle-free return guarantee',
      support: '24/7 Support',
      supportDesc: '0850 123 45 67',
      handcraft: 'Handcrafted',
      handcraftDesc: 'Expert artisan production',
    },

    brandStory: {
      label: 'Our Story',
      heading: 'Every piece carries\nan artisan\nsignature.',
      p1: 'Since 2009, Final Mobilya has been producing in Turkey\'s finest workshops. Every piece of furniture embodies the natural essence of wood, the artisan\'s experience, and the designer\'s vision.',
      p2: 'Materials from FSC-certified forests, processed with traditional techniques. We have workshops, not factories.',
      stat1: 'Years of experience',
      stat2: 'Happy customers',
      stat3: 'Made in Turkey',
      cta: 'Read Our Story',
      imgAlt1: 'Final Mobilya workshop',
      imgAlt2: 'Handcraftsmanship',
    },

    testimonials: {
      label: 'Customer Reviews',
      heading: 'Real experiences,',
      headingAccent: 'real spaces.',
    },

    card: {
      addToCart: 'Add to Cart',
    },

    badges: {
      new: 'New',
      sale: 'Sale',
      bestseller: 'Best Seller',
    },

    panel: {
      reviews: 'reviews',
      colorLabel: 'Color',
      quantityLabel: 'Quantity',
      inStock: 'In stock — ships immediately',
      addToCart: 'Add to Cart',
      addedToCart: 'Added to Cart',
      save: 'Save',
      saved: 'Saved',
      share: 'Share',
      deliveryLabel: (days: string) => `Delivery · ${days}`,
      deliverySub: 'Free shipping over ₺2,000',
      warranty: '10-Year Structural Warranty',
      warrantySub: 'Frame and support systems included',
      returns: '30-Day Hassle-Free Returns',
      returnsSub: "Return it if you're not satisfied",
      materialLabel: 'Material',
      dimensionsLabel: 'Dimensions',
      originLabel: 'Origin',
      originValue: 'Turkey',
      discount: 'off',
    },

    story: {
      label: 'Design & Craftsmanship',
      heading: 'Every piece',
      headingAccent: 'carries a story.',
      p2suffix: 'is carefully packaged at our Final Mobilya workshop and delivered to your home with white-glove service.',
      chips: (features: string[]) => features.slice(0, 3).map((f) => f.split('(')[0].trim()),
      materialLabel: 'Material',
      stats: ['Years of Experience', 'Happy Customers', 'Made in Turkey', 'Warranty'],
      specsLabel: 'Details',
      specsHeading: 'Technical specifications',
      accordion: {
        features: 'Features & Materials',
        dimensions: 'Dimensions & Technical Details',
        care: 'Care & Cleaning',
      },
      dimensions: {
        size: 'Dimensions',
        material: 'Material',
        warranty: 'Warranty',
        origin: 'Origin',
        delivery: 'Delivery',
        cert: 'Certification',
        warrantyValue: '10 Years',
        originValue: 'Turkey',
        certValue: 'FSC / ISO 9001',
      },
      care: [
        'For daily cleaning, use a soft dry or slightly damp cloth. Avoid solvent-based products and abrasive materials.',
        'A natural beeswax treatment is recommended annually for wood surfaces. A leather conditioner can be used for leather surfaces.',
        'Avoid prolonged exposure to direct sunlight — this may cause colour fading.',
      ],
      lifestyleLabel: 'In Your Space',
      lifestyleHeading: 'The finest corner\nof your home.',
      lifestyleDesc: 'Every piece from Final Mobilya was designed to speak the language of your living space. Not just an object — an atmosphere.',
    },

    reviews: {
      label: 'Customer Reviews',
      reviews: (n: number) => `${n} reviews`,
      recommend: 'customers recommend',
      trustNote: 'All reviews belong to customers who made a verified purchase.',
      verified: '✓ Verified Purchase',
      helpful: 'Was this helpful?',
      helpfulYes: 'Yes',
      loadMore: (n: number) => `View all reviews (${n})`,
      mockReviews: [
        {
          id: 1, initials: 'AK', name: 'Ayşe K.', location: 'Istanbul', rating: 5, date: 'March 15, 2024',
          title: 'Far exceeded my expectations',
          body: 'When I received it, it far exceeded my expectations. The material quality is much better than it looks in photos. The assembly team was extremely careful and professional — they set everything up perfectly.',
          helpful: 42, verified: true,
        },
        {
          id: 2, initials: 'MT', name: 'Murat T.', location: 'Ankara', rating: 5, date: 'February 8, 2024',
          title: 'Premium quality, exactly what I wanted',
          body: 'Much higher quality than other brands I researched. Delivery was fast and smooth. The product arrived exactly as described — no surprises at all.',
          helpful: 28, verified: true,
        },
        {
          id: 3, initials: 'SB', name: 'Selin B.', location: 'Izmir', rating: 4, date: 'January 22, 2024',
          title: 'Great design, top-notch material quality',
          body: 'The design and material quality are really excellent. The colour matches the photos exactly — a very important detail. Delivery was slightly delayed but the quality was worth every day.',
          helpful: 19, verified: true,
        },
        {
          id: 4, initials: 'KŞ', name: 'Kerem Ş.', location: 'Istanbul', rating: 5, date: 'January 5, 2024',
          title: 'Gets more beautiful over time',
          body: 'I bought it 3 months ago and love it more every day. The wood texture develops a beautiful patina over time. Friends always ask where I got it when they visit.',
          helpful: 31, verified: true,
        },
      ],
    },

    stickyBar: {
      add: 'Add',
    },

    related: {
      label: 'Complete the Set',
      heading: 'Beautiful',
      headingAccent: 'together.',
      viewCategory: 'View Category →',
    },

    categoryPage: {
      allLabel: 'Collections',
      allHeading: 'Everything',
      allHeadingAccent: 'for your home.',
      allDesc: 'From the living room to the bedroom, from the dining room to the study — curated collections for every space.',
      products: 'products',
      explore: 'Explore',
      heading: (name: string) => name,
      label: (count: number) => `${count} products`,
      filter: 'Filter',
      clearFilters: 'Clear Filters',
      noResults: 'No results found',
      noResultsDesc: 'Try broadening your filters.',
      priceRange: 'Price Range',
      priceAll: 'All',
      materialLabel: 'Material',
      colorLabel: 'Colour',
      applyFilters: (count: number) => `Apply (${count} products)`,
      sortOptions: [
        { value: 'default', label: 'Recommended' },
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'new', label: 'New Arrivals' },
      ],
    },

    cart: {
      title: 'My Cart',
      items: (n: number) => `${n} item${n === 1 ? '' : 's'}`,
      empty: 'Your cart is empty',
      emptyDesc: 'Explore our collections and add the pieces you love.',
      startShopping: 'Start Shopping',
      freeShippingProgress: (remaining: string) => `Add ${remaining} more for free shipping.`,
      freeShippingEarned: "You've earned free shipping!",
      subtotal: 'Subtotal',
      discount: 'Discount',
      shipping: 'Shipping',
      freeShipping: 'Free',
      total: 'Total',
      couponPlaceholder: 'Discount code',
      couponApply: 'Apply',
      couponApplied: (code: string) => `✓ ${code} applied`,
      checkout: 'Proceed to Checkout',
      securePayment: '256-bit SSL secure checkout',
      guarantee: '10-Year Warranty · 30-Day Returns',
      couponHint: 'Hint: try WELCOME10 for 10% off',
      continueShopping: 'Continue Shopping',
      shippingNote: 'Shipping and taxes calculated at checkout.',
      remove: 'Remove',
    },

    checkout: {
      backToCart: '← Back to Cart',
      shippingStep: 'Shipping',
      paymentStep: 'Payment',
      shippingTitle: 'Shipping Information',
      paymentTitle: 'Payment Information',
      name: 'Full Name',
      namePlaceholder: 'Your Full Name',
      email: 'Email Address',
      emailPlaceholder: 'hello@example.com',
      phone: 'Phone Number',
      phonePlaceholder: '+90 555 000 00 00',
      address: 'Address',
      addressPlaceholder: 'Street, building no., apartment',
      city: 'City',
      cityPlaceholder: 'Istanbul',
      zip: 'ZIP / Postcode',
      zipPlaceholder: '34000',
      cardName: 'Name on Card',
      cardNamePlaceholder: 'FULL NAME',
      cardNum: 'Card Number',
      cardNumPlaceholder: '0000 0000 0000 0000',
      expiry: 'Expiry Date',
      expiryPlaceholder: 'MM/YY',
      cvv: 'CVV',
      cvvPlaceholder: '•••',
      secureNote: 'Your card details are protected by 256-bit SSL encryption.',
      nextStep: 'Proceed to Payment →',
      backToShipping: '← Back to Shipping',
      orderSummary: 'Order Summary',
      products: 'Products',
      payButton: (total: string) => `Pay ${total} & Place Order`,
      successTitle: 'Order placed!',
      successDesc: 'Your order has been successfully created. A confirmation email will be sent to you shortly.',
      orderNo: 'Order No',
      estimatedDelivery: 'Estimated Delivery',
      estimatedDays: '3–5 Business Days',
      continueShopping: 'Continue Shopping',
    },

    footer: {
      tagline: 'Final Mobilya — furniture that adds meaning to your living spaces. Handcrafted, sustainable materials, timeless design.',
      newsletter: 'Keep getting inspired.',
      newsletterDesc: 'Join our newsletter for new collections, design stories and exclusive offers.',
      emailPlaceholder: 'Your email address',
      subscribe: 'Subscribe',
      copyright: '© 2024 Nokta Home & Living. All rights reserved.',
      trust: ['Free Shipping', '10-Year Warranty', 'Sustainable', 'Secure Payment'],
    },

    breadcrumb: {
      home: 'Home',
      categories: 'Categories',
    },

    notFound: {
      heading: 'Page not found',
      desc: 'The page you are looking for may have moved or been deleted. Return to the home page to continue.',
      cta: 'Go to Home',
    },
  },
} as const;

export type Translations = typeof dict['tr'] | typeof dict['en'];

// ─── Context ─────────────────────────────────────────────────────────────────
interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LangContext = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('tr');

  useEffect(() => {
    const saved = (typeof window !== 'undefined' ? localStorage.getItem('nokta_lang') : null) as Lang | null;
    if (saved === 'tr' || saved === 'en') setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('nokta_lang', l);
    document.documentElement.setAttribute('lang', l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: dict[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
