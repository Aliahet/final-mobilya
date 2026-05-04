'use client';

import Link from 'next/link';
import { Instagram, Youtube, Facebook } from 'lucide-react';

const footerLinks: Record<string, { label: string; href: string }[]> = {
  'Alışveriş': [
    { label: 'Oturma Grubu', href: '/urunler?kategori=oturma-grubu' },
    { label: 'Yatak Odası', href: '/urunler?kategori=yatak-odasi' },
    { label: 'Yemek Odası', href: '/urunler?kategori=yemek-odasi' },
    { label: 'Çalışma Odası', href: '/urunler?kategori=calisma-odasi' },
    { label: 'Tüm Ürünler', href: '/urunler' },
  ],
  'Yardım': [
    { label: 'Hesabım', href: '/hesabim' },
    { label: 'Siparişlerim', href: '/hesabim/siparislerim' },
    { label: 'Kargo & Teslimat', href: '#' },
    { label: 'İade & Değişim', href: '#' },
    { label: 'İletişim', href: '#' },
  ],
  'Final Mobilya': [
    { label: 'Hakkımızda', href: '#' },
    { label: 'Şubelerimiz', href: '/subelerimiz' },
    { label: 'Bayilik', href: '/bayilik' },
    { label: 'Gizlilik Politikası', href: '#' },
  ],
};

const trustItems = ['🚚 Ücretsiz Kargo', '🛡️ 5 Yıl Garanti', '🌿 Doğal Malzeme', '🔒 Güvenli Ödeme'];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-stone">
      {/* Newsletter */}
      <div className="border-b border-stone/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-serif text-display-sm text-cream mb-3">Yeniliklerden Haberdar Olun</h2>
            <p className="text-stone/70 text-sm max-w-md">Yeni koleksiyonlar, özel fırsatlar ve ilham verici içerikler için e-posta listemize katılın.</p>
          </div>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 bg-stone/10 border border-stone/20 px-5 py-3.5 rounded-xl text-sm text-cream placeholder-stone/50 outline-none focus:border-gold transition-colors"
            />
            <button type="submit" className="px-6 py-3.5 bg-gold text-charcoal text-sm font-medium rounded-xl hover:bg-gold-light transition-colors whitespace-nowrap">
              Abone Ol
            </button>
          </form>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <span className="font-serif text-2xl font-medium tracking-[0.04em] text-cream">FINAL</span>
              <br />
              <span className="text-[9px] font-semibold tracking-[0.25em] uppercase text-gold">MOBİLYA</span>
            </div>
            <p className="text-sm text-stone/60 leading-relaxed max-w-xs mb-8">
              Yaşam alanlarınıza anlam katan premium mobilya koleksiyonları. El işçiliği, sürdürülebilir malzemeler ve zamansız tasarım.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Instagram, href: 'https://instagram.com' },
                { Icon: Youtube, href: 'https://youtube.com' },
                { Icon: Facebook, href: 'https://facebook.com' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-stone/20 rounded-lg flex items-center justify-center text-stone/60 hover:border-gold hover:text-gold transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-medium text-cream mb-5">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-sm text-stone/60 hover:text-stone transition-colors duration-150">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-stone/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap gap-6 justify-center md:justify-between items-center">
            <div className="flex flex-wrap gap-8 justify-center">
              {trustItems.map((text) => (
                <span key={text} className="text-xs text-stone/50 font-medium">{text}</span>
              ))}
            </div>
            <p className="text-xs text-stone/30">© 2024 Final Mobilya. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
