'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, Clock, Truck, CheckCircle, XCircle, ChevronRight, User as UserIcon, ShoppingBag, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@/lib/supabase/client';
import { Order } from '@/lib/types';

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Onay Bekliyor', color: 'text-yellow-600 bg-yellow-50', icon: Clock },
  confirmed: { label: 'Onaylandı', color: 'text-blue-600 bg-blue-50', icon: CheckCircle },
  processing: { label: 'Hazırlanıyor', color: 'text-purple-600 bg-purple-50', icon: Package },
  shipped: { label: 'Kargoya Verildi', color: 'text-indigo-600 bg-indigo-50', icon: Truck },
  delivered: { label: 'Teslim Edildi', color: 'text-green-600 bg-green-50', icon: CheckCircle },
  cancelled: { label: 'İptal Edildi', color: 'text-red-600 bg-red-50', icon: XCircle },
  refunded: { label: 'İade Edildi', color: 'text-gray-600 bg-gray-50', icon: XCircle },
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(price);
}

export default function AccountPage() {
  const { user, profile, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
      .limit(5);
    setOrders((data as Order[]) || []);
    setLoading(false);
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream pt-24">
        <div className="text-center">
          <UserIcon className="w-16 h-16 text-brown/30 mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-charcoal mb-3">Hesabınıza giriş yapın</h2>
          <Link href="/giris" className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal text-white rounded-xl hover:bg-gold transition-colors">
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-stone/20 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center">
                  <UserIcon className="w-7 h-7 text-gold" />
                </div>
                <div>
                  <h1 className="font-serif text-xl text-charcoal">{profile.full_name || 'Kullanıcı'}</h1>
                  <p className="text-sm text-brown/50">{profile.email}</p>
                </div>
              </div>
              <button onClick={signOut} className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                <LogOut className="w-4 h-4" /> Çıkış
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Link href="/hesabim/siparislerim" className="bg-white rounded-2xl border border-stone/20 p-5 hover:border-gold/40 transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-gold" />
                  <span className="font-medium text-charcoal">Siparişlerim</span>
                </div>
                <ChevronRight className="w-4 h-4 text-brown/30 group-hover:text-gold transition-colors" />
              </div>
            </Link>
            <Link href="/urunler" className="bg-white rounded-2xl border border-stone/20 p-5 hover:border-gold/40 transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-gold" />
                  <span className="font-medium text-charcoal">Alışverişe Devam</span>
                </div>
                <ChevronRight className="w-4 h-4 text-brown/30 group-hover:text-gold transition-colors" />
              </div>
            </Link>
          </div>

          {/* Recent Orders */}
          <h2 className="font-serif text-xl text-charcoal mb-4">Son Siparişler</h2>
          {loading ? (
            <div className="text-center py-12 text-brown/40">Yükleniyor...</div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone/20 p-12 text-center">
              <ShoppingBag className="w-12 h-12 text-brown/20 mx-auto mb-3" />
              <p className="text-brown/50">Henüz siparişiniz yok.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const config = statusConfig[order.status];
                const StatusIcon = config.icon;
                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-stone/20 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs text-brown/40 font-mono">{order.id.slice(0, 8)}...</p>
                        <p className="text-xs text-brown/40 mt-0.5">
                          {new Date(order.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-brown/60">{order.order_items?.length || 0} ürün</p>
                      <p className="font-serif text-lg text-charcoal">{formatPrice(order.total_price)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
