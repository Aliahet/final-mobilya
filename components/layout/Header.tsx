'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingBag, Menu, X, User, LogOut,
  ShieldCheck, ChevronDown, ArrowRight,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';

const categories = [
  { label: 'Oturma Grubu',  href: '/urunler?kategori=oturma-grubu',  desc: 'Koltuk, kanepe & köşe takımı' },
  { label: 'Yatak Odası',   href: '/urunler?kategori=yatak-odasi',   desc: 'Yatak, gardırop & komodin' },
  { label: 'Yemek Odası',   href: '/urunler?kategori=yemek-odasi',   desc: 'Masa & sandalye takımları' },
  { label: 'Çalışma Odası', href: '/urunler?kategori=calisma-odasi', desc: 'Masa, sandalye & kitaplık' },
  { label: 'Bahçe & Balkon',href: '/urunler?kategori=bahce-balkon',  desc: 'Dış mekan mobilyaları' },
  { label: 'Dekorasyon',    href: '/urunler?kategori=dekorasyon',    desc: 'Aksesuar & tamamlayıcılar' },
];

const topLinks = [
  { label: 'Şubelerimiz', href: '/subelerimiz' },
  { label: 'Bayilik',     href: '/bayilik' },
];

export default function Header() {
  const [scrolled, setScrolled]               = useState(false);
  const [menuOpen, setMenuOpen]               = useState(false);
  const [searchOpen, setSearchOpen]           = useState(false);
  const [searchQuery, setSearchQuery]         = useState('');
  const [dropdownOpen, setDropdownOpen]       = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { itemCount, setIsOpen } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openDropdown  = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setDropdownOpen(true); };
  const scheduleClose = () => { closeTimer.current = setTimeout(() => setDropdownOpen(false), 160); };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/urunler?arama=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-charcoal text-center py-2.5 px-4">
        <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-stone/70">
          5.000 ₺ üzeri siparişlerde ücretsiz kargo &nbsp;·&nbsp; Tüm Türkiye&apos;ye teslimat
        </p>
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-cream/96 backdrop-blur-md shadow-card' : 'bg-cream'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">

            {/* ── Logo ── */}
            <Link href="/" className="flex-shrink-0 group">
              <div className="flex flex-col leading-none">
                <span className="font-serif text-[22px] font-medium tracking-[0.05em] text-charcoal group-hover:text-gold transition-colors duration-300">FINAL</span>
                <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-gold mt-0.5">MOBİLYA</span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden lg:flex items-center gap-1">

              {/* Ürünler with mega-menu */}
              <div className="relative" onMouseEnter={openDropdown} onMouseLeave={scheduleClose}>
                <button className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium tracking-wide rounded-lg transition-colors duration-200 ${dropdownOpen ? 'text-gold' : 'text-charcoal/80 hover:text-charcoal'}`}>
                  Ürünler
                  <ChevronDown className={`w-3 h-3 transition-transform duration-250 ${dropdownOpen ? 'rotate-180 text-gold' : 'text-brown/40'}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      onMouseEnter={openDropdown}
                      onMouseLeave={scheduleClose}
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[460px]"
                    >
                      <div className="bg-white rounded-2xl shadow-menu border border-stone/20 overflow-hidden">
                        <div className="p-5">
                          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-brown/35 mb-3 pl-1">Kategoriler</p>
                          <div className="grid grid-cols-2 gap-0.5">
                            {categories.map((cat) => (
                              <Link
                                key={cat.href}
                                href={cat.href}
                                onClick={() => setDropdownOpen(false)}
                                className="group flex flex-col gap-0.5 px-3 py-2.5 rounded-xl hover:bg-cream transition-colors duration-150"
                              >
                                <span className="text-sm font-medium text-charcoal group-hover:text-gold transition-colors duration-150 leading-snug">{cat.label}</span>
                                <span className="text-[11px] text-brown/40 leading-snug">{cat.desc}</span>
                              </Link>
                            ))}
                          </div>
                          <div className="mt-4 pt-4 border-t border-stone/20">
                            <Link
                              href="/urunler"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-1.5 text-[13px] font-medium text-gold hover:text-charcoal transition-colors duration-150 pl-1"
                            >
                              Tüm Ürünleri Görüntüle
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Static nav links */}
              {topLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-[13px] font-medium tracking-wide rounded-lg transition-colors duration-200 ${
                    isActive(link.href) ? 'text-gold' : 'text-charcoal/80 hover:text-charcoal'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ── Right actions ── */}
            <div className="flex items-center gap-0.5">
              <button onClick={() => setSearchOpen(true)} className="p-2.5 text-charcoal/70 hover:text-charcoal transition-colors rounded-lg" aria-label="Ara">
                <Search className="w-5 h-5" />
              </button>

              {user ? (
                <div className="hidden sm:flex items-center gap-0.5">
                  {isAdmin && (
                    <Link href="/admin" className="p-2.5 text-gold hover:text-gold-light transition-colors rounded-lg" title="Admin Panel">
                      <ShieldCheck className="w-5 h-5" />
                    </Link>
                  )}
                  <Link href="/hesabim" className="p-2.5 text-charcoal/70 hover:text-charcoal transition-colors rounded-lg" title="Hesabım">
                    <User className="w-5 h-5" />
                  </Link>
                </div>
              ) : (
                <Link href="/giris" className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-charcoal/70 hover:text-charcoal transition-colors rounded-lg">
                  <User className="w-4 h-4" />
                  Giriş
                </Link>
              )}

              <button onClick={() => setIsOpen(true)} className="relative p-2.5 text-charcoal/70 hover:text-charcoal transition-colors rounded-lg" aria-label="Sepet">
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </button>

              <button onClick={() => setMenuOpen(true)} className="lg:hidden p-2.5 text-charcoal/70 hover:text-charcoal transition-colors rounded-lg ml-1" aria-label="Menü">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom hairline */}
        <div className="h-px bg-stone/25" />
      </header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: [0.25, 0.1, 0.25, 1], duration: 0.32 }}
              className="fixed right-0 top-0 bottom-0 w-[300px] bg-cream z-50 overflow-y-auto shadow-modal lg:hidden flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-stone/20">
                <div className="flex flex-col leading-none">
                  <span className="font-serif text-xl text-charcoal">FINAL</span>
                  <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-gold mt-0.5">MOBİLYA</span>
                </div>
                <button onClick={() => setMenuOpen(false)} className="p-1.5 text-brown/60 hover:text-charcoal rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav links */}
              <div className="flex-1 px-3 py-4 space-y-0.5">
                {/* Ürünler expandable */}
                <button
                  onClick={() => setMobileProductsOpen(p => !p)}
                  className="w-full flex items-center justify-between px-3 py-3 text-charcoal font-medium text-sm rounded-xl hover:bg-stone/20 transition-colors"
                >
                  Ürünler
                  <ChevronDown className={`w-4 h-4 text-brown/40 transition-transform duration-200 ${mobileProductsOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {mobileProductsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-3 pb-1 space-y-0.5">
                        {categories.map((cat) => (
                          <Link key={cat.href} href={cat.href} onClick={() => setMenuOpen(false)}
                            className="block px-3 py-2.5 text-sm text-brown/70 rounded-xl hover:bg-stone/20 hover:text-charcoal transition-colors">
                            {cat.label}
                          </Link>
                        ))}
                        <Link href="/urunler" onClick={() => setMenuOpen(false)}
                          className="block px-3 py-2.5 text-sm font-medium text-gold rounded-xl hover:bg-stone/20 transition-colors">
                          Tüm Ürünler →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {topLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                    className={`block px-3 py-3 font-medium text-sm rounded-xl hover:bg-stone/20 transition-colors ${isActive(link.href) ? 'text-gold' : 'text-charcoal'}`}>
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Auth section */}
              <div className="px-3 pb-6 pt-3 border-t border-stone/20 space-y-0.5">
                {user ? (
                  <>
                    <Link href="/hesabim" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 text-charcoal text-sm rounded-xl hover:bg-stone/20 transition-colors">
                      <User className="w-4 h-4 text-brown/40" /> Hesabım
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 text-gold text-sm rounded-xl hover:bg-stone/20 transition-colors">
                        <ShieldCheck className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <button onClick={() => { signOut(); setMenuOpen(false); }}
                      className="flex items-center gap-3 px-3 py-3 text-red-500 text-sm rounded-xl hover:bg-red-50 transition-colors w-full text-left">
                      <LogOut className="w-4 h-4" /> Çıkış Yap
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/giris" onClick={() => setMenuOpen(false)}
                      className="block px-3 py-3 text-charcoal font-medium text-sm rounded-xl hover:bg-stone/20 transition-colors">
                      Giriş Yap
                    </Link>
                    <Link href="/kayit" onClick={() => setMenuOpen(false)}
                      className="block px-3 py-3 text-gold font-medium text-sm rounded-xl hover:bg-stone/20 transition-colors">
                      Kayıt Ol
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Search Overlay ── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/85 backdrop-blur-md flex items-start justify-center pt-24 px-5"
            onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl"
            >
              <form onSubmit={handleSearch} className="flex items-center gap-4 border-b-2 border-cream/20 pb-4">
                <Search className="w-6 h-6 text-cream/40 flex-shrink-0" />
                <input
                  autoFocus type="text" value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ürün ara..."
                  className="flex-1 bg-transparent text-cream text-xl placeholder-cream/30 outline-none"
                />
                <button type="button" onClick={() => setSearchOpen(false)}>
                  <X className="w-6 h-6 text-cream/40 hover:text-cream transition-colors" />
                </button>
              </form>
              <div className="mt-5 flex flex-wrap gap-2">
                {['Kanepe', 'Yatak Odası', 'Yemek Masası', 'Çalışma Masası'].map((term) => (
                  <button key={term}
                    onClick={() => { router.push(`/urunler?arama=${encodeURIComponent(term)}`); setSearchOpen(false); }}
                    className="px-4 py-1.5 border border-cream/15 text-cream/50 text-sm rounded-full hover:border-cream/40 hover:text-cream transition-colors">
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
