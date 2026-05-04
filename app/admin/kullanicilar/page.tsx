'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, ShieldCheck, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/lib/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    setUsers((data as Profile[]) || []);
    setLoading(false);
  };

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center py-20 text-brown/40">Yükleniyor...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-charcoal">Kullanıcı Yönetimi</h1>
        <p className="text-sm text-brown/50 mt-1">{users.length} kullanıcı</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/30" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Kullanıcı ara..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-brown/50 uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3">Kullanıcı</th>
                <th className="px-6 py-3">E-posta</th>
                <th className="px-6 py-3">Telefon</th>
                <th className="px-6 py-3">Rol</th>
                <th className="px-6 py-3">Kayıt Tarihi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-gray-50/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                        {user.role === 'admin' ? (
                          <ShieldCheck className="w-5 h-5 text-gold" />
                        ) : (
                          <User className="w-5 h-5 text-brown/40" />
                        )}
                      </div>
                      <p className="text-sm text-charcoal font-medium">{user.full_name || 'İsimsiz'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-brown/60">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-brown/60">{user.phone || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-gold/10 text-gold' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'Müşteri'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-brown/40">
                    {new Date(user.created_at).toLocaleDateString('tr-TR')}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
