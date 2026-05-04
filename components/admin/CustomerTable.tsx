'use client';

import { useState } from 'react';
import { CustomerAnalytics } from '@/lib/hooks/useCustomerAnalytics';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface Props {
  data: CustomerAnalytics[];
}

type SortKey = 'total_spent' | 'total_orders' | 'avg_order_value' | 'last_order_at';

const fmt = (n: number) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(n);

export default function CustomerTable({ data }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('total_spent');
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = [...data].sort((a, b) => {
    const av = sortKey === 'last_order_at' ? new Date(a[sortKey]).getTime() : Number(a[sortKey]);
    const bv = sortKey === 'last_order_at' ? new Date(b[sortKey]).getTime() : Number(b[sortKey]);
    return sortAsc ? av - bv : bv - av;
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(p => !p);
    else { setSortKey(key); setSortAsc(false); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => (
    <span className="ml-1 inline-flex flex-col">
      {sortKey === col
        ? sortAsc
          ? <ChevronUp className="w-3 h-3 text-gold" />
          : <ChevronDown className="w-3 h-3 text-gold" />
        : <ChevronDown className="w-3 h-3 text-brown/20" />}
    </span>
  );

  if (data.length === 0) {
    return (
      <div className="py-16 text-center text-brown/30 text-sm">
        Henüz müşteri satın alma verisi yok
      </div>
    );
  }

  const maxSpent = Math.max(...data.map(c => Number(c.total_spent)));

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-brown/50 uppercase tracking-wider border-b border-gray-100">
            <th className="px-4 py-3 font-medium">Müşteri</th>
            <th className="px-4 py-3 font-medium cursor-pointer select-none" onClick={() => toggleSort('total_spent')}>
              Toplam Harcama <SortIcon col="total_spent" />
            </th>
            <th className="px-4 py-3 font-medium cursor-pointer select-none" onClick={() => toggleSort('total_orders')}>
              Sipariş <SortIcon col="total_orders" />
            </th>
            <th className="px-4 py-3 font-medium cursor-pointer select-none" onClick={() => toggleSort('avg_order_value')}>
              Ort. Sipariş <SortIcon col="avg_order_value" />
            </th>
            <th className="px-4 py-3 font-medium cursor-pointer select-none" onClick={() => toggleSort('last_order_at')}>
              Son Sipariş <SortIcon col="last_order_at" />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {sorted.map((c, i) => {
            const barWidth = maxSpent > 0 ? (Number(c.total_spent) / maxSpent) * 100 : 0;
            return (
              <tr key={c.user_id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-gold">
                        {(c.full_name || c.email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-charcoal">{c.full_name || 'İsimsiz'}</p>
                      <p className="text-xs text-brown/40">{c.email}</p>
                    </div>
                    {i === 0 && (
                      <span className="ml-1 px-2 py-0.5 text-2xs bg-gold/10 text-gold rounded-full font-medium">
                        #1
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-charcoal">{fmt(Number(c.total_spent))}</p>
                    <div className="mt-1 h-1 w-24 bg-stone rounded-full overflow-hidden">
                      <div className="h-full bg-gold rounded-full" style={{ width: `${barWidth}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-charcoal">{c.total_orders}</td>
                <td className="px-4 py-3 text-sm text-brown/60">{fmt(Number(c.avg_order_value))}</td>
                <td className="px-4 py-3 text-sm text-brown/40">
                  {new Date(c.last_order_at).toLocaleDateString('tr-TR')}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
