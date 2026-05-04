'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, Package, Truck, CheckCircle, XCircle, ChevronDown, Eye } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Order, OrderItem } from '@/lib/types';

const statusOptions = [
  { value: 'pending', label: 'Onay Bekliyor', color: 'text-yellow-600 bg-yellow-50' },
  { value: 'confirmed', label: 'Onaylandı', color: 'text-blue-600 bg-blue-50' },
  { value: 'processing', label: 'Hazırlanıyor', color: 'text-purple-600 bg-purple-50' },
  { value: 'shipped', label: 'Kargoya Verildi', color: 'text-indigo-600 bg-indigo-50' },
  { value: 'delivered', label: 'Teslim Edildi', color: 'text-green-600 bg-green-50' },
  { value: 'cancelled', label: 'İptal Edildi', color: 'text-red-600 bg-red-50' },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(price);
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const fetchOrders = async () => {
    let query = supabase
      .from('orders')
      .select('*, profile:profiles(full_name, email, phone), order_items(*)')
      .order('created_at', { ascending: false });

    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    const { data } = await query;
    setOrders((data as Order[]) || []);
    setLoading(false);
  };

  /**
   * SECURITY FIX: Use admin-only RPC to update order status.
   * The RPC verifies admin role server-side before allowing the update.
   * This prevents any client-side tampering or non-admin status changes.
   */
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    setStatusError(null);

    const { error } = await supabase.rpc('admin_update_order_status', {
      p_order_id: orderId,
      p_new_status: newStatus,
    });

    if (error) {
      setStatusError(`Durum güncellenemedi: ${error.message}`);
      console.error('[AdminOrders] Status update failed:', error);
    }

    await fetchOrders();
    setUpdatingStatus(null);
  };

  const filteredOrders = orders.filter(o => {
    if (!search) return true;
    const profile = (o as any).profile;
    return (
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      profile?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      profile?.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.shipping_phone?.includes(search)
    );
  });

  if (loading) return <div className="text-center py-20 text-brown/40">Yükleniyor...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-charcoal">Sipariş Yönetimi</h1>
        <p className="text-sm text-brown/50 mt-1">{orders.length} sipariş</p>
      </div>

      {/* Status Error */}
      {statusError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          {statusError}
          <button onClick={() => setStatusError(null)} className="ml-2 text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/30" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Sipariş no, müşteri adı, e-posta..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40">
          <option value="">Tüm Durumlar</option>
          {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Status Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setStatusFilter('')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!statusFilter ? 'bg-charcoal text-white' : 'bg-white border border-gray-200 text-brown/60 hover:border-gold/40'}`}>
          Tümü ({orders.length})
        </button>
        {statusOptions.map(s => {
          const count = orders.filter(o => o.status === s.value).length;
          return (
            <button key={s.value} onClick={() => setStatusFilter(s.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${statusFilter === s.value ? 'bg-charcoal text-white' : `${s.color} hover:opacity-80`}`}>
              {s.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {filteredOrders.map((order, index) => {
          const profile = (order as any).profile;
          const isExpanded = expandedOrder === order.id;
          const currentStatus = statusOptions.find(s => s.value === order.status);

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >
              {/* Order Header */}
              <div className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors" onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-sm font-mono text-charcoal font-medium">#{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-brown/40 mt-0.5">{new Date(order.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-charcoal">{profile?.full_name || 'Bilinmeyen'}</p>
                    <p className="text-xs text-brown/40">{profile?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${currentStatus?.color}`}>
                    {currentStatus?.label}
                  </span>
                  <span className="font-serif text-lg text-charcoal">{formatPrice(order.total_price)}</span>
                  <ChevronDown className={`w-4 h-4 text-brown/30 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="border-t border-gray-100 px-6 py-5">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Items */}
                    <div className="lg:col-span-2">
                      <h3 className="text-sm font-medium text-charcoal mb-3">Ürünler</h3>
                      <div className="space-y-2">
                        {order.order_items?.map((item: OrderItem) => (
                          <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                            <div>
                              <p className="text-sm text-charcoal">{item.product_name}</p>
                              {item.variant_name && <p className="text-xs text-brown/40">{item.variant_name}</p>}
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-charcoal">{item.quantity} × {formatPrice(item.unit_price)}</p>
                              <p className="text-xs text-brown/50">{formatPrice(item.total_price)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-brown/50">Ara Toplam</span>
                          <span>{formatPrice(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-brown/50">Kargo</span>
                          <span>{order.shipping_cost === 0 ? 'Ücretsiz' : formatPrice(order.shipping_cost)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium pt-1 border-t border-gray-50">
                          <span>Toplam</span>
                          <span className="font-serif text-lg">{formatPrice(order.total_price)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping + Status */}
                    <div>
                      <h3 className="text-sm font-medium text-charcoal mb-3">Teslimat Bilgileri</h3>
                      <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1.5 mb-4">
                        <p className="text-charcoal font-medium">{order.shipping_name}</p>
                        <p className="text-brown/60">{order.shipping_address}</p>
                        <p className="text-brown/60">{order.shipping_district}, {order.shipping_city} {order.shipping_postal_code}</p>
                        <p className="text-brown/60">{order.shipping_phone}</p>
                      </div>

                      {order.customer_note && (
                        <div className="bg-yellow-50 rounded-xl p-4 text-sm mb-4">
                          <p className="text-xs font-medium text-yellow-700 mb-1">Müşteri Notu</p>
                          <p className="text-yellow-800">{order.customer_note}</p>
                        </div>
                      )}

                      <h3 className="text-sm font-medium text-charcoal mb-2">Durum Güncelle</h3>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        disabled={updatingStatus === order.id}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 disabled:opacity-50"
                      >
                        {statusOptions.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <Package className="w-12 h-12 text-brown/20 mx-auto mb-3" />
            <p className="text-brown/40">Sipariş bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}
