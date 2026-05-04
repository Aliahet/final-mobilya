'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ProductAnalytics } from '@/lib/hooks/useProductAnalytics';

interface Props {
  data: ProductAnalytics[];
}

const COLORS = ['#C4A45A', '#D4B870', '#B8965A', '#A08040', '#E0C880'];

function truncate(str: string, max = 18) {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as ProductAnalytics;
  return (
    <div className="bg-charcoal text-white rounded-xl px-4 py-3 shadow-lg text-sm max-w-xs">
      <p className="font-medium mb-1">{d.product_name}</p>
      <p className="text-white/60 text-xs">
        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(Number(d.total_revenue))}
      </p>
      <p className="text-white/40 text-xs">{d.total_units_sold} adet · {d.order_count} sipariş</p>
    </div>
  );
}

export default function TopProductsChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-brown/30 text-sm">
        Henüz ürün satışı yok
      </div>
    );
  }

  const top5 = data.slice(0, 5).map(d => ({
    ...d,
    total_revenue: Number(d.total_revenue),
    shortName: truncate(d.product_name),
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={top5}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: '#9c8a77' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}B`}
        />
        <YAxis
          type="category"
          dataKey="shortName"
          tick={{ fontSize: 11, fill: '#6B5B45' }}
          axisLine={false}
          tickLine={false}
          width={120}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f0e8' }} />
        <Bar dataKey="total_revenue" radius={[0, 6, 6, 0]} maxBarSize={28}>
          {top5.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
