'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(price);
}

export default function ShopTheLook() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('is_active', true)
        .limit(3)
        .order('created_at', { ascending: false });
      setProducts((data as Product[]) || []);
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
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gold mb-4 block">İLHAM</span>
          <h2 className="font-serif text-display-sm text-charcoal">
            Görünümü <em className="not-italic text-gold">Yakala</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <Link href={`/urun/${product.slug}`} className="block relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                <Image
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </Link>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base text-charcoal group-hover:text-gold transition-colors">{product.name}</h3>
                  <p className="text-sm text-gold font-medium mt-1">{formatPrice(product.discount_price ?? product.base_price)}</p>
                </div>
                <button
                  onClick={() => addItem(product)}
                  className="p-2.5 bg-charcoal text-white rounded-full hover:bg-gold transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/urunler" className="inline-flex items-center gap-2 text-sm font-medium text-brown hover:text-gold transition-colors">
            Tüm Ürünleri Gör <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
