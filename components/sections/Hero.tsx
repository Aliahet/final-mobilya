'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=85',
    href: '/urunler',
    align: 'left' as const,
    label: 'YENİ KOLEKSİYON',
    headline: 'Yaşam Alanlarınıza\nYeni Bir Anlam',
    sub: 'El işçiliği ve sürdürülebilir malzemelerle üretilen premium mobilyalar.',
    cta: 'Koleksiyonu Keşfet',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1600&q=85',
    href: '/urunler?kategori=yatak-odasi',
    align: 'right' as const,
    label: 'YATAK ODASI',
    headline: 'Huzurlu Uykulara\nDavetiye',
    sub: 'Konfor ve estetiği bir araya getiren yatak odası koleksiyonumuz.',
    cta: 'Yatak Odası',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1600&q=85',
    href: '/urunler?kategori=yemek-odasi',
    align: 'left' as const,
    label: 'YEMEK ODASI',
    headline: 'Sofranıza\nDokunuş',
    sub: 'Aile buluşmalarınızı özel kılan şık yemek odası takımları.',
    cta: 'Yemek Odası',
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [current]);

  const slide = slides[current];
  const isRight = slide.align === 'right';

  return (
    <section ref={containerRef} className="relative h-[92vh] min-h-[600px] max-h-[900px] overflow-hidden">
      {slides.map((s, i) => (
        <motion.div
          key={s.id}
          style={i === current ? { y } : {}}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image src={s.image} alt={s.headline} fill priority={i === 0} className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/60 via-charcoal/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
        </motion.div>
      ))}

      <div className={`relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-20 md:pb-28 ${isRight ? 'justify-end' : ''}`}>
        <div className={`max-w-xl ${isRight ? 'text-right' : ''}`}>
          <motion.div
            key={`label-${current}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`flex items-center gap-3 mb-5 ${isRight ? 'justify-end' : ''}`}
          >
            <div className="w-8 h-px bg-gold" />
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gold">{slide.label}</span>
          </motion.div>

          <motion.h1
            key={`headline-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-serif text-display text-cream mb-6 whitespace-pre-line"
          >
            {slide.headline}
          </motion.h1>

          <motion.p
            key={`sub-${current}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-stone/80 text-base md:text-lg leading-relaxed mb-8 max-w-sm"
          >
            {slide.sub}
          </motion.p>

          <motion.div
            key={`cta-${current}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`flex items-center gap-4 ${isRight ? 'justify-end' : ''}`}
          >
            <Link href={slide.href} className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-charcoal text-sm font-medium hover:bg-gold-light transition-colors group">
              {slide.cta}
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link href="/urunler" className="text-sm text-stone/70 hover:text-cream transition-colors underline-offset-4 hover:underline">
              Tüm Ürünler
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-0.5 rounded-full transition-all duration-500 ${
              i === current ? 'bg-gold w-8' : 'bg-cream/40 w-3 hover:bg-cream/60'
            }`}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute right-8 bottom-8 z-20 hidden md:flex flex-col items-center gap-2"
      >
        <span className="writing-vertical text-cream/40 text-xs tracking-widest uppercase">Keşfet</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-cream/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
