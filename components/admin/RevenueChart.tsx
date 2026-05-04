'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MonthlyRevenue } from '@/lib/hooks/useRevenueData';

interface Props {
  data: MonthlyRevenue[];
}

function formatMonth(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('tr-TR', { month: 'short', year: '2-digit' });
}

function formatPrice(value: number) {
  if (value >= 1_000_000) return `₺${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₺${(value / 1_000).toFixed(0)}B`;
  return `₺${value}`;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-charcoal text-white rounded-xl px-4 py-3 shadow-lg text-sm">
      <p className="text-white/50 text-xs mb-1">{formatMonth(label)}</p>
      <p className="font-serif text-lg">
        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(payload[0].value)}
      </p>
      <p className="text-white/50 text-xs">{payload[0]?.payload?.order_count} sipariş</p>
    </div>
  );
}

export default function RevenueChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-brown/30 text-sm">
        Henüz satış verisi yok
      </div>
    );
  }

  const chartData = data.map(d => ({
    ...d,
    revenue: Number(d.revenue),
    month: d.month,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#C4A45A" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#C4A45A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
        <XAxis
          dataKey="month"
          tickFormatter={formatMonth}
          tick={{ fontSize: 11, fill: '#9c8a77' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatPrice}
          tick={{ fontSize: 11, fill: '#9c8a77' }}
          axisLine={false}
          tickLine={false}
          width={56}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#C4A45A', strokeWidth: 1, strokeDasharray: '4 4' }} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#C4A45A"
          strokeWidth={2}
          fill="url(#revenueGradient)"
          dot={false}
          activeDot={{ r: 4, fill: '#C4A45A', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
