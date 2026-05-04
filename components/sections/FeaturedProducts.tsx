'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Product } from '@/lib/types';
import ProductCard from '@/components/product/ProductCard';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('is_active', true)
        .eq('is_featured', true)
        .limit(4);
      setProducts((data as Product[]) || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-20 lg:py-28 bg-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gold mb-4 block">
              KOLEKSİYON
            </span>
            <h2 className="font-serif text-display-sm text-charcoal">
              Öne Çıkan<br />
              <em className="not-italic text-gold">Ürünlerimiz</em>
            </h2>
          </div>
          <Link
            href="/urunler"
            className="flex items-center gap-2 text-sm font-medium text-brown hover:text-gold transition-colors"
          >
            Tümünü Gör <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl animate-pulse">
                <div className="aspect-product bg-stone/20 rounded-t-2xl" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-stone/20 rounded w-1/3" />
                  <div className="h-4 bg-stone/20 rounded w-2/3" />
                  <div className="h-5 bg-stone/20 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
