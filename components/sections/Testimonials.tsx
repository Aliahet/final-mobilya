'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Ayşe Yılmaz',
    location: 'İstanbul',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    rating: 5,
    text: 'Milano köşe koltuk takımını aldık ve gerçekten beklentilerimizin çok ötesinde. Kumaş kalitesi ve oturma konforu muhteşem. Kesinlikle tavsiye ederim!',
    product: 'Milano Köşe Koltuk',
  },
  {
    name: 'Mehmet Kara',
    location: 'Ankara',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    rating: 5,
    text: 'Royal yatak odası takımını sipariş ettik. Teslimat zamanında geldi, montaj ekibi çok profesyoneldi. Ürün kalitesi fotoğraflardakinden bile daha iyi.',
    product: 'Royal Yatak Odası',
  },
  {
    name: 'Elif Demir',
    location: 'İzmir',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    rating: 5,
    text: 'Yemek masamızı buradan aldık ve çok memnunuz. Doğal meşe ahşap gerçekten çok kaliteli. Misafirlerimiz de çok beğeniyor.',
    product: 'Elegance Yemek Masası',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-20 lg:py-28 bg-beige">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gold mb-4 block">MÜŞTERİ YORUMLARI</span>
          <h2 className="font-serif text-display-sm text-charcoal">
            Müşterilerimiz <em className="not-italic text-gold">Ne Diyor?</em>
          </h2>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl p-8 md:p-12 border border-stone/20 text-center"
            >
              <Quote className="w-10 h-10 text-gold/20 mx-auto mb-6" />
              
              {/* Stars */}
              <div className="flex items-center justify-center gap-1 mb-6">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>

              <p className="text-lg text-charcoal leading-relaxed mb-8 max-w-2xl mx-auto">
                &quot;{testimonials[current].text}&quot;
              </p>

              <div className="flex items-center justify-center gap-4">
                <Image
                  src={testimonials[current].avatar}
                  alt={testimonials[current].name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="text-sm font-medium text-charcoal">{testimonials[current].name}</p>
                  <p className="text-xs text-brown/50">{testimonials[current].location} — {testimonials[current].product}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} className="p-2.5 bg-white border border-stone/30 rounded-full hover:border-gold transition-colors">
              <ChevronLeft className="w-4 h-4 text-charcoal" />
            </button>
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-gold w-6' : 'bg-stone/40'}`}
                />
              ))}
            </div>
            <button onClick={next} className="p-2.5 bg-white border border-stone/30 rounded-full hover:border-gold transition-colors">
              <ChevronRight className="w-4 h-4 text-charcoal" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
