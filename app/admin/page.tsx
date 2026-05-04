'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Package, ShoppingCart, Users, Clock,
  TrendingUp, TrendingDown, ArrowRight, BarChart2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRevenueData } from '@/lib/hooks/useRevenueData';
import { Order } from '@/lib/types';

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:    { label: 'Bekliyor',    color: 'text-yellow-600 bg-yellow-50' },
  confirmed:  { label: 'Onaylandı',  color: 'text-blue-600 bg-blue-50' },
  processing: { label: 'Hazırlanıyor', color: 'text-purple-600 bg-purple-50' },
  shipped:    { label: 'Kargoda',    color: 'text-indigo-600 bg-indigo-50' },
  delivered:  { label: 'Teslim',     color: 'text-green-600 bg-green-50' },
  cancelled:  { label: 'İptal',      color: 'text-red-600 bg-red-50' },
};

const fmt = (n: number) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(n);

function TrendBadge({ pct }: { pct: number | null }) {
  if (pct === null) return null;
  const up = pct > 0;
  return (
    <span className={`flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
      {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {pct > 0 ? '+' : ''}{pct.toFixed(1)}%
    </span>
  );
}

export default function AdminDashboard() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [baseLoading, setBaseLoading] = useState(true);

  const revenue = useRevenueData();

  useEffect(() => {
    const supabase = createClient();
    const fetch = async () => {
      const [productsRes, customersRes, pendingRes, recentRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('orders')
          .select('*, profile:profiles(full_name, email)')
          .order('created_at', { ascending: false })
          .limit(8),
      ]);
      setTotalProducts(productsRes.count ?? 0);
      setTotalCustomers(customersRes.count ?? 0);
      setPendingOrders(pendingRes.count ?? 0);
      setRecentOrders((recentRes.data as Order[]) ?? []);
      setBaseLoading(false);
    };
    fetch();
  }, []);

  const loading = baseLoading || revenue.loading;

  const currentMonth = revenue.currentMonth;
  const previousMonth = revenue.previousMonth;

  const orderTrend =
    currentMonth && previousMonth && previousMonth.order_count > 0
      ? ((currentMonth.order_count - previousMonth.order_count) / previousMonth.order_count) * 100
      : null;

  const currentMonthLabel = currentMonth
    ? new Date(currentMonth.month).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
    : 'Bu Ay';

  const cards = [
    {
      label: `${currentMonthLabel} Geliri`,
      value: currentMonth ? fmt(Number(currentMonth.revenue)) : '₺0',
      sub: previousMonth ? `Geçen ay: ${fmt(Number(previousMonth.revenue))}` : 'Henüz veri yok',
      trend: revenue.percentageChange,
      icon: TrendingUp,
      iconBg: 'bg-gold/10 text-gold',
    },
    {
      label: 'Bu Ay Sipariş',
      value: currentMonth ? String(currentMonth.order_count) : '0',
      sub: previousMonth ? `Geçen ay: ${previousMonth.order_count}` : undefined,
      trend: orderTrend,
      icon: ShoppingCart,
      iconBg: 'bg-blue-50 text-blue-500',
    },
    {
      label: 'Bekleyen Sipariş',
      value: String(pendingOrders),
      sub: 'Onay bekliyor',
      trend: null,
      icon: Clock,
      iconBg: 'bg-yellow-50 text-yellow-500',
    },
    {
      label: 'Toplam Ürün',
      value: String(totalProducts),
      sub: 'Katalogda',
      trend: null,
      icon: Package,
      iconBg: 'bg-purple-50 text-purple-500',
    },
    {
      label: 'Toplam Müşteri',
      value: String(totalCustomers),
      sub: 'Kayıtlı',
      trend: null,
      icon: Users,
      iconBg: 'bg-pink-50 text-pink-500',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 h-32 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-serif text-charcoal">Dashboard</h1>
          <p className="text-sm text-brown/50 mt-1">Mağaza genel görünümü</p>
        </div>
        <Link
          href="/admin/analytics"
          className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white text-sm rounded-xl hover:bg-charcoal/90 transition-colors"
        >
          <BarChart2 className="w-4 h-4" />
          Analitik
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-card"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-xl ${card.iconBg}`}>
                <card.icon className="w-4 h-4" />
              </div>
              <TrendBadge pct={card.trend ?? null} />
            </div>
            <p className="text-2xl font-serif text-charcoal">{card.value}</p>
            <p className="text-xs text-brown/50 mt-1">{card.label}</p>
            {card.sub && <p className="text-xs text-brown/30 mt-0.5">{card.sub}</p>}
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg text-charcoal">Son Siparişler</h2>
            <p className="text-xs text-brown/40 mt-0.5">En son 8 sipariş</p>
          </div>
          <Link href="/admin/siparisler" className="text-xs text-gold hover:text-gold-light transition-colors flex items-center gap-1">
            Tümünü Gör <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-brown/50 uppercase tracking-wider border-b border-gray-50">
                <th className="px-6 py-3 font-medium">Sipariş</th>
                <th className="px-6 py-3 font-medium">Müşteri</th>
                <th className="px-6 py-3 font-medium">Durum</th>
                <th className="px-6 py-3 font-medium">Tarih</th>
                <th className="px-6 py-3 font-medium text-right">Tutar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((order) => {
                const cfg = statusConfig[order.status] ?? { label: order.status, color: 'text-gray-600 bg-gray-50' };
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-charcoal">#{order.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 text-sm text-charcoal">{(order as any).profile?.full_name || 'Bilinmeyen'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-brown/50">
                      {new Date(order.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-charcoal text-right">{fmt(order.total_price)}</td>
                  </tr>
                );
              })}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-brown/30 text-sm">
                    <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    Henüz sipariş yok
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
