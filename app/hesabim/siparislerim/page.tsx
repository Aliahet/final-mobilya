'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Package, Clock, Truck, CheckCircle, XCircle, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@/lib/supabase/client';
import { Order, OrderItem } from '@/lib/types';

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

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    setOrders((data as Order[]) || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/hesabim" className="p-2 hover:bg-white rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-brown/50" />
          </Link>
          <h1 className="font-serif text-display-sm text-charcoal">Siparişlerim</h1>
        </div>

        {loading ? (
          <div className="text-center py-20 text-brown/40">Yükleniyor...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone/20 p-16 text-center">
            <Package className="w-16 h-16 text-brown/20 mx-auto mb-4" />
            <h2 className="font-serif text-xl text-charcoal mb-2">Henüz siparişiniz yok</h2>
            <p className="text-brown/50 mb-6 text-sm">İlk siparişinizi verin!</p>
            <Link href="/urunler" className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal text-white rounded-xl hover:bg-gold transition-colors text-sm">
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const config = statusConfig[order.status];
              const StatusIcon = config.icon;
              const isExpanded = expandedOrder === order.id;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl border border-stone/20 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="w-full p-5 flex items-center justify-between hover:bg-cream/30 transition-colors"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div>
                        <p className="text-xs text-brown/40 font-mono"># {order.id.slice(0, 8)}</p>
                        <p className="text-sm text-charcoal font-medium mt-0.5">
                          {new Date(order.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {config.label}
                      </span>
                      <span className="font-serif text-lg text-charcoal">{formatPrice(order.total_price)}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-brown/40" /> : <ChevronDown className="w-4 h-4 text-brown/40" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-t border-stone/10 px-5 pb-5"
                    >
                      {/* Items */}
                      <div className="mt-4 space-y-3">
                        {order.order_items?.map((item: OrderItem) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-cream">
                              {item.image_url && (
                                <Image src={item.image_url} alt={item.product_name} fill className="object-cover" sizes="56px" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-charcoal">{item.product_name}</p>
                              {item.variant_name && <p className="text-xs text-brown/50">{item.variant_name}</p>}
                            </div>
                            <p className="text-xs text-brown/50">{item.quantity} adet</p>
                            <p className="text-sm font-medium text-charcoal">{formatPrice(item.total_price)}</p>
                          </div>
                        ))}
                      </div>

                      {/* Shipping Info */}
                      <div className="mt-4 pt-4 border-t border-stone/10 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-brown/40 text-xs mb-1">Teslimat Adresi</p>
                          <p className="text-charcoal text-xs">{order.shipping_name}</p>
                          <p className="text-brown/60 text-xs">{order.shipping_address}</p>
                          <p className="text-brown/60 text-xs">{order.shipping_district}, {order.shipping_city}</p>
                        </div>
                        <div>
                          <p className="text-brown/40 text-xs mb-1">Telefon</p>
                          <p className="text-charcoal text-xs">{order.shipping_phone}</p>
                          {order.tracking_number && (
                            <>
                              <p className="text-brown/40 text-xs mb-1 mt-2">Kargo Takip</p>
                              <p className="text-gold text-xs font-medium">{order.tracking_number}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
