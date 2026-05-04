'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Category } from '@/lib/types';

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('categories').select('*').order('sort_order');
      setCategories((data as Category[]) || []);
    };
    fetch();
  }, []);

  return (
    <section className="py-20 lg:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gold mb-4 block">KATEGORİLER</span>
          <h2 className="font-serif text-display-sm text-charcoal">
            Odanıza Özel <em className="not-italic text-gold">Koleksiyonlar</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={`/urunler?kategori=${cat.slug}`}
                className="group relative block aspect-[4/3] rounded-2xl overflow-hidden"
              >
                <Image
                  src={cat.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-serif text-lg text-cream group-hover:text-gold transition-colors">{cat.name}</h3>
                  <p className="text-xs text-cream/60 mt-1 flex items-center gap-1 group-hover:text-cream/80 transition-colors">
                    Keşfet <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
