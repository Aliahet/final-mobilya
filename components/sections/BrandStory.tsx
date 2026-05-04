'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function BrandStory() {
  return (
    <section className="py-20 lg:py-28 bg-charcoal text-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=85"
              alt="Final Mobilya Atölye"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gold mb-6 block">HİKAYEMİZ</span>
            <h2 className="font-serif text-display-sm text-cream mb-6">
              Zamanın Ötesinde<br />
              <em className="not-italic text-gold">Tasarımlar</em>
            </h2>
            <p className="text-stone/70 leading-relaxed mb-4">
              Final Mobilya olarak, yaşam alanlarınızı sadece mobilyalarla değil, hikayelerle donatıyoruz. Her parçamız, usta ellerde şekillenen doğal malzemeler ve çağdaş tasarım anlayışının buluşma noktasıdır.
            </p>
            <p className="text-stone/70 leading-relaxed mb-8">
              Sürdürülebilirlik ve kalite ilkelerimizle, nesilden nesile aktarılacak mobilyalar üretiyoruz. Amacımız, evinize sadece bir mobilya değil, bir yaşam deneyimi sunmak.
            </p>
            <Link
              href="/urunler"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors text-sm font-medium group"
            >
              Koleksiyonlarımızı Keşfedin
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
