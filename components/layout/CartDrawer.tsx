'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(price);
}

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: [0.25, 0.1, 0.25, 1], duration: 0.35 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-cream z-50 flex flex-col shadow-modal"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-charcoal" />
                <span className="font-serif text-xl text-charcoal">Sepet</span>
                <span className="text-sm text-brown/50">({itemCount})</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 text-brown hover:text-charcoal transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-stone mb-4" />
                  <p className="font-serif text-lg text-charcoal mb-2">Sepetiniz boş</p>
                  <p className="text-sm text-brown/50 mb-6">Beğendiğiniz ürünleri sepete ekleyin.</p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2.5 bg-charcoal text-white text-sm rounded-xl hover:bg-gold transition-colors"
                  >
                    Alışverişe Başla
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => {
                    const basePrice = item.product.discount_price ?? item.product.base_price;
                    const modifier = item.variant?.price_modifier ?? 0;
                    const unitPrice = basePrice + modifier;

                    return (
                      <motion.div
                        key={`${item.product.id}-${item.variant?.id || 'default'}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-4 pb-4 border-b border-stone/30 last:border-0"
                      >
                        {/* Image */}
                        <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-white flex-shrink-0">
                          <Image
                            src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200'}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-sm font-medium text-charcoal line-clamp-1">{item.product.name}</h3>
                              {item.variant && (
                                <p className="text-xs text-brown/50 mt-0.5">{item.variant.name}</p>
                              )}
                            </div>
                            <button
                              onClick={() => removeItem(item.product.id, item.variant?.id)}
                              className="p-1 text-brown/30 hover:text-red-500 transition-colors flex-shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <p className="text-sm font-serif text-charcoal mt-1">{formatPrice(unitPrice)}</p>

                          {/* Quantity */}
                          <div className="flex items-center gap-0 mt-2 bg-white border border-stone/40 rounded-lg inline-flex overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.variant?.id ?? null, item.quantity - 1)}
                              className="px-2.5 py-1.5 hover:bg-cream transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 py-1.5 text-sm text-charcoal font-medium min-w-[36px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.variant?.id ?? null, item.quantity + 1)}
                              className="px-2.5 py-1.5 hover:bg-cream transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-stone px-6 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-brown/60">Ara Toplam</span>
                  <span className="font-serif text-xl text-charcoal">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs text-brown/40">Kargo ücreti sipariş sırasında hesaplanır.</p>
                <div className="space-y-2">
                  <Link
                    href="/siparis"
                    onClick={() => setIsOpen(false)}
                    className="block w-full py-3.5 bg-charcoal text-white text-center font-medium rounded-xl hover:bg-gold transition-colors"
                  >
                    Sipariş Ver
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="block w-full py-3 text-center text-sm text-brown/60 hover:text-charcoal transition-colors"
                  >
                    Alışverişe Devam Et
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
