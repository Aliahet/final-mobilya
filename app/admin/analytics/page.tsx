'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Package, Users, ShoppingBag } from 'lucide-react';
import { useRevenueData } from '@/lib/hooks/useRevenueData';
import { useProductAnalytics } from '@/lib/hooks/useProductAnalytics';
import { useCustomerAnalytics } from '@/lib/hooks/useCustomerAnalytics';

const RevenueChart = dynamic(() => import('@/components/admin/RevenueChart'), { ssr: false });
const TopProductsChart = dynamic(() => import('@/components/admin/TopProductsChart'), { ssr: false });
const CustomerTable = dynamic(() => import('@/components/admin/CustomerTable'), { ssr: false });

const fmt = (n: number) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(n);

function KPICard({
  label,
  value,
  sub,
  trend,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: number | null;
  icon: React.ElementType;
  delay?: number;
}) {
  const trendUp = trend !== null && trend !== undefined && trend > 0;
  const trendDown = trend !== null && trend !== undefined && trend < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 bg-gold/10 rounded-xl">
          <Icon className="w-5 h-5 text-gold" />
        </div>
        {trend !== null && trend !== undefined && (
          <span
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              trendUp
                ? 'bg-emerald-50 text-emerald-600'
                : trendDown
                ? 'bg-red-50 text-red-500'
                : 'bg-gray-50 text-gray-400'
            }`}
          >
            {trendUp ? <TrendingUp className="w-3 h-3" /> : trendDown ? <TrendingDown className="w-3 h-3" /> : null}
            {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
          </span>
        )}
      </div>
      <p className="font-serif text-2xl text-charcoal">{value}</p>
      <p className="text-xs text-brown/50 mt-1">{label}</p>
      {sub && <p className="text-xs text-brown/30 mt-0.5">{sub}</p>}
    </motion.div>
  );
}

function Section({ title, subtitle, children, delay = 0 }: { title: string; subtitle?: string; children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-gray-50">
        <h2 className="font-serif text-lg text-charcoal">{title}</h2>
        {subtitle && <p className="text-xs text-brown/40 mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
}

function Skeleton({ h = 'h-64' }: { h?: string }) {
  return <div className={`${h} bg-gray-50 rounded-xl animate-pulse`} />;
}

export default function AnalyticsPage() {
  const revenue = useRevenueData();
  const { products, loading: prodLoading } = useProductAnalytics(10);
  const { customers, loading: custLoading } = useCustomerAnalytics(20);

  const currentMonth = revenue.currentMonth;
  const previousMonth = revenue.previousMonth;

  const currentMonthLabel = currentMonth
    ? new Date(currentMonth.month).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
    : '—';

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-charcoal">Analitik</h1>
        <p className="text-sm text-brown/50 mt-1">Gelir, ürün ve müşteri performansı</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          label={`${currentMonthLabel} Geliri`}
          value={currentMonth ? fmt(Number(currentMonth.revenue)) : '₺0'}
          sub={previousMonth ? `Geçen ay: ${fmt(Number(previousMonth.revenue))}` : undefined}
          trend={revenue.percentageChange}
          icon={TrendingUp}
          delay={0}
        />
        <KPICard
          label="Bu Ay Sipariş"
          value={currentMonth ? String(currentMonth.order_count) : '0'}
          sub={previousMonth ? `Geçen ay: ${previousMonth.order_count}` : undefined}
          trend={
            currentMonth && previousMonth && previousMonth.order_count > 0
              ? ((currentMonth.order_count - previousMonth.order_count) / previousMonth.order_count) * 100
              : null
          }
          icon={ShoppingBag}
          delay={0.05}
        />
        <KPICard
          label="Toplam Gelir (12 ay)"
          value={fmt(revenue.totalRevenue)}
          sub={`${revenue.totalOrders} onaylı sipariş`}
          trend={null}
          icon={TrendingUp}
          delay={0.1}
        />
        <KPICard
          label="Aktif Müşteri"
          value={String(customers.length)}
          sub="Sipariş veren"
          trend={null}
          icon={Users}
          delay={0.15}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Section
          title="Aylık Gelir"
          subtitle="Onaylı ve teslim edilmiş siparişler"
          delay={0.2}
        >
          {revenue.loading ? <Skeleton /> : <RevenueChart data={revenue.monthly} />}
        </Section>

        <Section
          title="En Çok Satan Ürünler"
          subtitle="Gelire göre ilk 5 ürün"
          delay={0.25}
        >
          {prodLoading ? <Skeleton /> : <TopProductsChart data={products} />}
        </Section>
      </div>

      {/* Top Products Table */}
      <div className="mb-6">
        <Section
          title="Ürün Satış Detayları"
          subtitle={`${products.length} ürün`}
          delay={0.3}
        >
          {prodLoading ? (
            <Skeleton h="h-40" />
          ) : products.length === 0 ? (
            <div className="py-12 text-center text-brown/30 text-sm">
              <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
              Henüz ürün satışı yok
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-brown/50 uppercase tracking-wider border-b border-gray-100">
                    <th className="pb-3 font-medium">Ürün</th>
                    <th className="pb-3 font-medium text-right">Adet</th>
                    <th className="pb-3 font-medium text-right">Sipariş</th>
                    <th className="pb-3 font-medium text-right">Ort. Fiyat</th>
                    <th className="pb-3 font-medium text-right">Toplam Gelir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((p, i) => (
                    <tr key={p.product_id} className="hover:bg-gray-50/50">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-brown/30 font-mono w-5">{i + 1}</span>
                          <div>
                            <p className="text-sm text-charcoal font-medium">{p.product_name}</p>
                            {p.sku && <p className="text-xs text-brown/30">SKU: {p.sku}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-charcoal text-right">{p.total_units_sold}</td>
                      <td className="py-3 text-sm text-brown/60 text-right">{p.order_count}</td>
                      <td className="py-3 text-sm text-brown/60 text-right">{fmt(Number(p.avg_unit_price))}</td>
                      <td className="py-3 text-sm font-medium text-charcoal text-right">{fmt(Number(p.total_revenue))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      </div>

      {/* Customer Table */}
      <Section
        title="En İyi Müşteriler"
        subtitle={`${customers.length} müşteri · Harcamaya göre sıralı`}
        delay={0.35}
      >
        {custLoading ? <Skeleton h="h-48" /> : <CustomerTable data={customers} />}
      </Section>
    </div>
  );
}
