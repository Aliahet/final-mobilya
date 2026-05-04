'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';

interface Props {
  product: Product;
  viewMode?: 'grid' | 'list';
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(price);
}

export default function ProductCard({ product, viewMode = 'grid' }: Props) {
  const { addItem } = useCart();
  const hasDiscount = product.discount_price !== null && product.discount_price < product.base_price;
  const displayPrice = hasDiscount ? product.discount_price! : product.base_price;
  const discountPercent = hasDiscount
    ? Math.round(((product.base_price - product.discount_price!) / product.base_price) * 100)
    : 0;

  if (viewMode === 'list') {
    return (
      <div className="group bg-white rounded-2xl border border-stone/20 overflow-hidden hover:shadow-product-hover transition-all duration-500 flex">
        <Link href={`/urun/${product.slug}`} className="relative w-48 h-48 flex-shrink-0">
          <Image
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </Link>
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <p className="text-xs text-gold font-medium tracking-wider uppercase mb-1">
              {product.category?.name || 'Mobilya'}
            </p>
            <Link href={`/urun/${product.slug}`}>
              <h3 className="font-serif text-lg text-charcoal group-hover:text-gold transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-brown/60 mt-1 line-clamp-2">{product.short_description}</p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-lg text-charcoal">{formatPrice(displayPrice)}</span>
              {hasDiscount && (
                <span className="text-sm text-brown/40 line-through">{formatPrice(product.base_price)}</span>
              )}
            </div>
            <button
              onClick={(e) => { e.preventDefault(); addItem(product); }}
              className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white rounded-lg text-sm hover:bg-gold transition-colors"
            >
              <ShoppingBag className="w-4 h-4" /> Sepete Ekle
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-2xl border border-stone/20 overflow-hidden hover:shadow-product-hover transition-all duration-500">
      {/* Image */}
      <Link href={`/urun/${product.slug}`} className="block relative aspect-product overflow-hidden">
        <Image
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-medium rounded-lg">
              %{discountPercent}
            </span>
          )}
          {product.is_featured && (
            <span className="px-2.5 py-1 bg-gold text-white text-xs font-medium rounded-lg">
              Öne Çıkan
            </span>
          )}
        </div>
        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-charcoal" />
          </button>
        </div>
        {/* Add to Cart */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <button
            onClick={(e) => { e.preventDefault(); addItem(product); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-charcoal/90 backdrop-blur-sm text-white text-sm font-medium rounded-xl hover:bg-charcoal transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Sepete Ekle
          </button>
        </motion.div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-gold font-medium tracking-wider uppercase mb-1">
          {product.category?.name || 'Mobilya'}
        </p>
        <Link href={`/urun/${product.slug}`}>
          <h3 className="font-serif text-base text-charcoal group-hover:text-gold transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-serif text-lg text-charcoal">{formatPrice(displayPrice)}</span>
          {hasDiscount && (
            <span className="text-sm text-brown/40 line-through">{formatPrice(product.base_price)}</span>
          )}
        </div>
        {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
          <p className="text-xs text-red-500 mt-1.5">Son {product.stock_quantity} adet!</p>
        )}
      </div>
    </div>
  );
}
