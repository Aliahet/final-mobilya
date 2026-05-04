'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Search, RefreshCw, Building2, Phone, Mail, MapPin, MessageSquare } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Application {
  id: string;
  full_name: string;
  company_name: string;
  city: string;
  phone: string;
  email: string;
  message: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const statusConfig = {
  pending:  { label: 'Bekliyor',  color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  approved: { label: 'Onaylandı', color: 'text-green-600 bg-green-50 border-green-200' },
  rejected: { label: 'Reddedildi', color: 'text-red-600 bg-red-50 border-red-200' },
};

export default function AdminBayilikPage() {
  const [apps, setApps]         = useState<Application[]>([]);
  const [loading, setLoading]   = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [cityFilter, setCityFilter]     = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    let q = supabase.from('dealer_applications').select('*').order('created_at', { ascending: false });
    if (statusFilter) q = q.eq('status', statusFilter);
    if (cityFilter)   q = q.ilike('city', `%${cityFilter}%`);
    const { data } = await q;
    setApps((data as Application[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [statusFilter, cityFilter]);

  const updateStatus = async (id: string, status: Application['status']) => {
    setUpdating(id);
    const supabase = createClient();
    await supabase.from('dealer_applications').update({ status }).eq('id', id);
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    setUpdating(null);
  };

  const cities = [...new Set(apps.map(a => a.city))].sort();

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-serif text-charcoal">Bayilik Başvuruları</h1>
          <p className="text-sm text-brown/50 mt-1">Gelen bayi başvurularını yönetin</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white text-sm rounded-xl hover:bg-charcoal/90 transition-colors">
          <RefreshCw className="w-4 h-4" /> Yenile
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/40" />
          <input
            type="text" placeholder="Şehir ara..." value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl text-charcoal placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-gold/30 w-40"
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30">
          <option value="">Tüm Durumlar</option>
          <option value="pending">Bekliyor</option>
          <option value="approved">Onaylandı</option>
          <option value="rejected">Reddedildi</option>
        </select>

        {/* Counts */}
        {['pending', 'approved', 'rejected'].map(s => {
          const count = apps.filter(a => a.status === s).length;
          const cfg = statusConfig[s as keyof typeof statusConfig];
          return (
            <span key={s} className={`px-3 py-2 text-xs font-medium rounded-xl border ${cfg.color}`}>
              {cfg.label}: {count}
            </span>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-brown/30" />
          </div>
        ) : apps.length === 0 ? (
          <div className="py-20 text-center text-brown/30 text-sm">
            <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
            Başvuru bulunamadı
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-brown/50 uppercase tracking-wider border-b border-gray-50">
                  <th className="px-6 py-3 font-medium">Başvuran</th>
                  <th className="px-6 py-3 font-medium">Firma</th>
                  <th className="px-6 py-3 font-medium">Şehir</th>
                  <th className="px-6 py-3 font-medium">İletişim</th>
                  <th className="px-6 py-3 font-medium">Mesaj</th>
                  <th className="px-6 py-3 font-medium">Tarih</th>
                  <th className="px-6 py-3 font-medium">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {apps.map(app => {
                  const cfg = statusConfig[app.status];
                  return (
                    <motion.tr key={app.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-charcoal">{app.full_name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-brown/70">
                          <Building2 className="w-3.5 h-3.5 text-brown/30" />
                          {app.company_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-brown/70">
                          <MapPin className="w-3.5 h-3.5 text-brown/30" />
                          {app.city}
                        </div>
                      </td>
                      <td className="px-6 py-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-brown/60">
                          <Phone className="w-3 h-3" /> {app.phone}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-brown/60">
                          <Mail className="w-3 h-3" /> {app.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-[180px]">
                        {app.message ? (
                          <p className="text-xs text-brown/50 truncate" title={app.message}>
                            {app.message}
                          </p>
                        ) : (
                          <span className="text-xs text-brown/25 italic">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-brown/50">
                        {new Date(app.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.color}`}>
                            {cfg.label}
                          </span>
                          {app.status !== 'approved' && (
                            <button
                              disabled={updating === app.id}
                              onClick={() => updateStatus(app.id, 'approved')}
                              className="text-[10px] text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
                            >
                              {updating === app.id ? '...' : 'Onayla'}
                            </button>
                          )}
                          {app.status !== 'rejected' && (
                            <button
                              disabled={updating === app.id}
                              onClick={() => updateStatus(app.id, 'rejected')}
                              className="text-[10px] text-red-500 hover:text-red-600 font-medium disabled:opacity-50"
                            >
                              {updating === app.id ? '...' : 'Reddet'}
                            </button>
                          )}
                          {app.status !== 'pending' && (
                            <button
                              disabled={updating === app.id}
                              onClick={() => updateStatus(app.id, 'pending')}
                              className="text-[10px] text-yellow-600 hover:text-yellow-700 font-medium disabled:opacity-50"
                            >
                              {updating === app.id ? '...' : 'Beklet'}
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
