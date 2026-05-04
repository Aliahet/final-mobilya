'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/data';
import { useCart } from '@/lib/cart-context';
import { useLang } from '@/lib/i18n';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const badgeClass: Record<string, string> = {
  new: 'badge-new',
  sale: 'badge-sale',
  bestseller: 'badge-gold',
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const { addItem } = useCart();
  const { t } = useLang();

  // Mocks for badges since they might not exist directly on the new Product type
  const badge = product.is_featured ? 'bestseller' : null;

  const badgeLabels: Record<string, string> = {
    new: t.badges.new,
    sale: t.badges.sale,
    bestseller: t.badges.bestseller,
  };

  const discount = product.discount_price && product.base_price > 0
    ? Math.round(((product.base_price - product.discount_price) / product.base_price) * 100)
    : 0;

  const images = product.images?.length > 0 ? product.images : ['/placeholder.jpg'];
  const displayPrice = product.discount_price ?? product.base_price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.08 }}
    >
      <div className="product-card group shadow-product">
        {/* Image container */}
        <Link href={`/urun/${product.slug}`} className="block relative overflow-hidden aspect-[3/4]">
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Image
              src={images[imgIndex] ?? images[0]}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onMouseEnter={() => images[1] && setImgIndex(1)}
              onMouseLeave={() => setImgIndex(0)}
            />
          </motion.div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {badge && (
              <span className={badgeClass[badge]}>
                {badgeLabels[badge]}
              </span>
            )}
            {discount > 0 && (
              <span className="badge bg-olive text-cream">-%{discount}</span>
            )}
          </div>

          {/* Quick add overlay */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                addItem(product, product.variants?.[0] || null, 1);
              }}
              className="w-full bg-cream text-charcoal py-2.5 text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-gold hover:text-white transition-colors duration-200"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {t.card.addToCart}
            </button>
          </motion.div>
        </Link>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1 min-w-0">
              <p className="text-2xs label-sm text-sand mb-1">{product.category?.name || 'Kategori Yok'}</p>
              <Link href={`/urun/${product.slug}`}>
                <h3 className="font-serif text-base font-medium text-charcoal hover:text-gold transition-colors duration-200 leading-snug truncate">
                  {product.name}
                </h3>
              </Link>
            </div>
            <button
              onClick={() => setWishlisted(!wishlisted)}
              className="flex-shrink-0 p-1 mt-0.5 transition-colors"
            >
              <Heart
                className={`w-4 h-4 transition-all duration-200 ${
                  wishlisted ? 'fill-gold text-gold scale-110' : 'text-pebble hover:text-gold'
                }`}
              />
            </button>
          </div>

          {/* Color/variant info */}
          <p className="text-xs text-sand mb-3">{product.variants?.length ? `${product.variants.length} Seçenek` : 'Standart'}</p>

          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-charcoal">{formatPrice(displayPrice)}</span>
            {product.discount_price && (
              <span className="text-sm text-sand line-through">{formatPrice(product.base_price)}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
