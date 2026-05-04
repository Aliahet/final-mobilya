'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Phone, User, FileText, Loader2, CheckCircle, ShoppingBag, ArrowLeft, Truck } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { CheckoutFormData } from '@/lib/types';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(price);
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [form, setForm] = useState<CheckoutFormData>({
    shipping_name: profile?.full_name || '',
    shipping_address: '',
    shipping_city: '',
    shipping_district: '',
    shipping_postal_code: '',
    shipping_phone: profile?.phone || '',
    customer_note: '',
  });

  const shippingCost = subtotal >= 5000 ? 0 : 499;
  const totalPrice = subtotal + shippingCost;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream pt-24 pb-20 px-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-brown/30 mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-charcoal mb-3">Sipariş vermek için giriş yapın</h2>
          <Link href="/giris?redirect=/siparis" className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal text-white rounded-xl hover:bg-gold transition-colors">
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream pt-24 pb-20 px-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-brown/30 mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-charcoal mb-3">Sepetiniz boş</h2>
          <Link href="/urunler" className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal text-white rounded-xl hover:bg-gold transition-colors">
            Alışverişe Başla
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            product_id: item.product.id,
            variant_id: item.variant?.id ?? null,
            quantity: item.quantity,
          })),
          shipping_name: form.shipping_name,
          shipping_address: form.shipping_address,
          shipping_city: form.shipping_city,
          shipping_district: form.shipping_district,
          shipping_postal_code: form.shipping_postal_code,
          shipping_phone: form.shipping_phone,
          customer_note: form.customer_note || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Sipariş oluşturulamadı.');
      }

      setOrderId(data.order_id);
      setSuccess(true);
      clearCart();
    } catch (err: any) {
      setError(err.message || 'Sipariş oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream pt-24 pb-20 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="bg-white rounded-2xl shadow-card p-10 border border-stone/30">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-5" />
            <h2 className="font-serif text-2xl text-charcoal mb-3">Siparişiniz Alındı!</h2>
            <p className="text-brown/70 text-sm mb-2">Sipariş numaranız:</p>
            <p className="text-charcoal font-mono text-sm bg-cream rounded-lg px-4 py-2 mb-6 break-all">{orderId}</p>
            <p className="text-brown/60 text-sm mb-8">
              Siparişiniz onaylandıktan sonra sizinle iletişime geçeceğiz.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/hesabim/siparislerim" className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-charcoal text-white rounded-xl hover:bg-gold transition-colors text-sm">
                Siparişlerim
              </Link>
              <Link href="/urunler" className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-stone/40 text-charcoal rounded-xl hover:border-gold transition-colors text-sm">
                Alışverişe Devam
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const updateField = (field: keyof CheckoutFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/urunler" className="p-2 hover:bg-white rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-brown/50" />
          </Link>
          <h1 className="font-serif text-display-sm text-charcoal">Sipariş Ver</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                  {error}
                </motion.div>
              )}

              <div className="bg-white rounded-2xl border border-stone/20 p-6 mb-6">
                <h2 className="font-serif text-xl text-charcoal mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gold" /> Teslimat Bilgileri
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Ad Soyad</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/30" />
                      <input type="text" required value={form.shipping_name} onChange={(e) => updateField('shipping_name', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-cream/50 border border-stone/30 rounded-xl text-charcoal placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-gold/40 text-sm" placeholder="Adınız Soyadınız" />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Adres</label>
                    <textarea required value={form.shipping_address} onChange={(e) => updateField('shipping_address', e.target.value)}
                      rows={3} className="w-full px-4 py-3 bg-cream/50 border border-stone/30 rounded-xl text-charcoal placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-gold/40 text-sm resize-none" placeholder="Mahalle, sokak, bina no, daire no..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">İl</label>
                    <input type="text" required value={form.shipping_city} onChange={(e) => updateField('shipping_city', e.target.value)}
                      className="w-full px-4 py-3 bg-cream/50 border border-stone/30 rounded-xl text-charcoal placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-gold/40 text-sm" placeholder="İstanbul" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">İlçe</label>
                    <input type="text" value={form.shipping_district} onChange={(e) => updateField('shipping_district', e.target.value)}
                      className="w-full px-4 py-3 bg-cream/50 border border-stone/30 rounded-xl text-charcoal placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-gold/40 text-sm" placeholder="Kadıköy" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Posta Kodu</label>
                    <input type="text" value={form.shipping_postal_code} onChange={(e) => updateField('shipping_postal_code', e.target.value)}
                      className="w-full px-4 py-3 bg-cream/50 border border-stone/30 rounded-xl text-charcoal placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-gold/40 text-sm" placeholder="34000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Telefon</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/30" />
                      <input type="tel" required value={form.shipping_phone} onChange={(e) => updateField('shipping_phone', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-cream/50 border border-stone/30 rounded-xl text-charcoal placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-gold/40 text-sm" placeholder="0 5XX XXX XX XX" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="bg-white rounded-2xl border border-stone/20 p-6 mb-6">
                <h2 className="font-serif text-xl text-charcoal mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gold" /> Sipariş Notu
                </h2>
                <textarea value={form.customer_note} onChange={(e) => updateField('customer_note', e.target.value)}
                  rows={3} className="w-full px-4 py-3 bg-cream/50 border border-stone/30 rounded-xl text-charcoal placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-gold/40 text-sm resize-none"
                  placeholder="Varsa sipariş ile ilgili notunuz..." />
              </div>

              {/* Payment Notice */}
              <div className="bg-gold/5 border border-gold/20 rounded-2xl p-6 mb-6">
                <h3 className="text-sm font-medium text-charcoal mb-2">💳 Ödeme Bilgilendirme</h3>
                <p className="text-sm text-brown/70">
                  Siparişiniz oluşturulduktan sonra, ödeme detayları tarafınıza iletilecektir. Siparişiniz onaylanana kadar herhangi bir ödeme yapmanız gerekmez.
                </p>
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-charcoal text-white font-medium rounded-xl hover:bg-gold disabled:opacity-50 transition-all duration-300 text-base">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Siparişi Tamamla <CheckCircle className="w-5 h-5" /></>}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-stone/20 p-6 sticky top-28">
              <h2 className="font-serif text-xl text-charcoal mb-6">Sipariş Özeti</h2>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100'} alt={item.product.name} fill className="object-cover" sizes="64px" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-charcoal text-white text-xs rounded-full flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-charcoal font-medium truncate">{item.product.name}</p>
                      {item.variant && <p className="text-xs text-brown/50">{item.variant.name}</p>}
                      <p className="text-sm text-gold font-medium mt-1">
                        {formatPrice(((item.product.discount_price ?? item.product.base_price) + (item.variant?.price_modifier ?? 0)) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone/20 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-brown/60">Ara Toplam</span>
                  <span className="text-charcoal">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brown/60 flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Kargo</span>
                  <span className={shippingCost === 0 ? 'text-green-600' : 'text-charcoal'}>
                    {shippingCost === 0 ? 'Ücretsiz' : formatPrice(shippingCost)}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-xs text-brown/40">5.000 ₺ üzeri siparişlerde ücretsiz kargo</p>
                )}
                <div className="flex justify-between pt-3 border-t border-stone/20">
                  <span className="font-medium text-charcoal">Toplam</span>
                  <span className="font-serif text-xl text-charcoal">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
