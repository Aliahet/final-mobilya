'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Truck, Shield, RotateCcw, Minus, Plus, ChevronRight, Star } from 'lucide-react';
import { Product, ProductVariant } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import ProductCard from '@/components/product/ProductCard';

interface Props {
  product: Product;
  relatedProducts: Product[];
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(price);
}

export default function ProductDetailClient({ product, relatedProducts }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] || null
  );
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const hasDiscount = product.discount_price !== null && product.discount_price < product.base_price;
  const baseDisplayPrice = hasDiscount ? product.discount_price! : product.base_price;
  const variantModifier = selectedVariant?.price_modifier || 0;
  const totalPrice = baseDisplayPrice + variantModifier;

  const images = product.images?.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'];

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
  };

  const specs = product.specifications || {};

  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-brown/50 mb-8">
          <Link href="/" className="hover:text-gold transition-colors">Ana Sayfa</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/urunler" className="hover:text-gold transition-colors">Ürünler</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          {product.category && (
            <>
              <Link href={`/urunler?kategori=${product.category.slug}`} className="hover:text-gold transition-colors">
                {product.category.name}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
            </>
          )}
          <span className="text-charcoal">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white mb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  <Image
                    src={images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>
              {hasDiscount && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-xl">
                  %{Math.round(((product.base_price - product.discount_price!) / product.base_price) * 100)} İndirim
                </span>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-gold' : 'border-transparent hover:border-stone'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <p className="text-xs text-gold font-medium tracking-widest uppercase mb-2">
              {product.category?.name}
            </p>
            <h1 className="font-serif text-3xl lg:text-4xl text-charcoal mb-4">{product.name}</h1>
            
            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-serif text-3xl text-charcoal">{formatPrice(totalPrice)}</span>
              {hasDiscount && (
                <span className="text-lg text-brown/40 line-through">{formatPrice(product.base_price + variantModifier)}</span>
              )}
            </div>

            <p className="text-brown/70 leading-relaxed mb-8">{product.description}</p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-charcoal mb-3">
                  Seçenek: <span className="text-gold">{selectedVariant?.name}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.filter(v => v.is_active).map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2.5 rounded-xl text-sm transition-all border ${
                        selectedVariant?.id === variant.id
                          ? 'bg-charcoal text-white border-charcoal'
                          : 'bg-white text-charcoal border-stone/40 hover:border-gold/60'
                      }`}
                    >
                      {variant.name}
                      {variant.price_modifier > 0 && (
                        <span className="ml-1 text-xs opacity-70">+{formatPrice(variant.price_modifier)}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-charcoal mb-3">Adet</h3>
              <div className="inline-flex items-center bg-white border border-stone/40 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-cream transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 py-3 text-charcoal font-medium min-w-[60px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 hover:bg-cream transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {product.stock_quantity <= 10 && (
                <p className="text-xs text-red-500 mt-2">Stokta sadece {product.stock_quantity} adet kaldı!</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-charcoal text-white font-medium rounded-xl hover:bg-gold disabled:opacity-50 transition-all duration-300 text-base"
              >
                <ShoppingBag className="w-5 h-5" />
                {product.stock_quantity === 0 ? 'Tükendi' : 'Sepete Ekle'}
              </button>
              <button className="p-4 bg-white border border-stone/40 rounded-xl hover:border-red-300 hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-stone/20">
                <Truck className="w-5 h-5 text-gold flex-shrink-0" />
                <span className="text-xs text-charcoal">Ücretsiz Kargo</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-stone/20">
                <Shield className="w-5 h-5 text-gold flex-shrink-0" />
                <span className="text-xs text-charcoal">Garanti</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-stone/20">
                <RotateCcw className="w-5 h-5 text-gold flex-shrink-0" />
                <span className="text-xs text-charcoal">Kolay İade</span>
              </div>
            </div>

            {/* Specifications */}
            {Object.keys(specs).length > 0 && (
              <div className="mt-10">
                <h3 className="font-serif text-xl text-charcoal mb-4">Teknik Özellikler</h3>
                <div className="bg-white rounded-2xl border border-stone/20 divide-y divide-stone/10">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between px-5 py-3.5">
                      <span className="text-sm text-brown/60">{key}</span>
                      <span className="text-sm text-charcoal font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="font-serif text-2xl text-charcoal mb-8">Benzer Ürünler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
