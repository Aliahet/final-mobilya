'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, Loader2, X, MapPin, Store,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface StoreRow {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  map_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

type FormState = {
  name: string;
  city: string;
  address: string;
  phone: string;
  map_url: string;
  is_active: boolean;
  sort_order: string;
};

const emptyForm: FormState = {
  name: '', city: '', address: '', phone: '',
  map_url: '', is_active: true, sort_order: '0',
};

export default function AdminSubelerPage() {
  const [stores, setStores]     = useState<StoreRow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState<{ mode: 'create' | 'edit'; data?: StoreRow } | null>(null);
  const [form, setForm]         = useState<FormState>(emptyForm);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  const supabase = createClient();

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('stores')
      .select('*')
      .order('sort_order')
      .order('created_at', { ascending: false });
    setStores((data as StoreRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setFormError('');
    setModal({ mode: 'create' });
  };

  const openEdit = (s: StoreRow) => {
    setForm({
      name: s.name,
      city: s.city,
      address: s.address,
      phone: s.phone,
      map_url: s.map_url ?? '',
      is_active: s.is_active,
      sort_order: String(s.sort_order),
    });
    setFormError('');
    setModal({ mode: 'edit', data: s });
  };

  const closeModal = () => { setModal(null); setFormError(''); };

  const handleSave = async () => {
    if (!form.name.trim())    { setFormError('Şube adı zorunludur.'); return; }
    if (!form.city.trim())    { setFormError('Şehir zorunludur.'); return; }
    if (!form.address.trim()) { setFormError('Adres zorunludur.'); return; }
    if (!form.phone.trim())   { setFormError('Telefon zorunludur.'); return; }

    setSaving(true);
    setFormError('');

    const payload = {
      name: form.name.trim(),
      city: form.city.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
      map_url: form.map_url.trim() || null,
      is_active: form.is_active,
      sort_order: parseInt(form.sort_order) || 0,
    };

    let error;
    if (modal?.mode === 'create') {
      ({ error } = await supabase.from('stores').insert(payload));
    } else if (modal?.data) {
      ({ error } = await supabase.from('stores').update(payload).eq('id', modal.data.id));
    }

    setSaving(false);
    if (error) { setFormError('Kaydedilemedi. Tekrar deneyin.'); return; }
    closeModal();
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu şubeyi silmek istediğinize emin misiniz?')) return;
    setDeleting(id);
    await supabase.from('stores').delete().eq('id', id);
    setDeleting(null);
    setStores(p => p.filter(s => s.id !== id));
  };

  const handleToggle = async (s: StoreRow) => {
    setToggling(s.id);
    await supabase.from('stores').update({ is_active: !s.is_active }).eq('id', s.id);
    setStores(p => p.map(x => x.id === s.id ? { ...x, is_active: !x.is_active } : x));
    setToggling(null);
  };

  const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2">
        {label}{required && ' *'}
      </label>
      {children}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-serif text-charcoal">Şubeler</h1>
          <p className="text-sm text-brown/50 mt-1">Mağaza ve şube bilgilerini yönetin</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white text-sm rounded-xl hover:bg-gold transition-colors"
        >
          <Plus className="w-4 h-4" /> Yeni Şube
        </button>
      </div>

      {/* Store list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-brown/30" />
          </div>
        ) : stores.length === 0 ? (
          <div className="py-20 text-center">
            <Store className="w-8 h-8 text-brown/20 mx-auto mb-2" />
            <p className="text-brown/30 text-sm">Henüz şube yok</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-brown/50 uppercase tracking-wider border-b border-gray-50">
                  <th className="px-6 py-3 font-medium">Şube</th>
                  <th className="px-6 py-3 font-medium">Şehir</th>
                  <th className="px-6 py-3 font-medium">Telefon</th>
                  <th className="px-6 py-3 font-medium">Sıra</th>
                  <th className="px-6 py-3 font-medium">Durum</th>
                  <th className="px-6 py-3 font-medium text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stores.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm text-charcoal font-medium">{s.name}</p>
                      <p className="text-xs text-brown/40 mt-0.5 max-w-xs truncate">{s.address}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs text-brown/60">
                        <MapPin className="w-3 h-3 text-gold" />
                        {s.city}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-brown/50">{s.phone}</td>
                    <td className="px-6 py-4 text-sm text-brown/40">{s.sort_order}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggle(s)}
                        disabled={toggling === s.id}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${s.is_active ? 'bg-charcoal' : 'bg-stone'}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${s.is_active ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </button>
                      <span className={`ml-2 text-xs font-medium ${s.is_active ? 'text-charcoal' : 'text-brown/40'}`}>
                        {s.is_active ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(s)}
                          className="p-2 text-brown/40 hover:text-charcoal hover:bg-gray-100 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(s.id)} disabled={deleting === s.id}
                          className="p-2 text-brown/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40">
                          {deleting === s.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white rounded-2xl shadow-modal w-full max-w-lg pointer-events-auto max-h-[90vh] overflow-y-auto">
                {/* Modal header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
                  <h2 className="font-serif text-lg text-charcoal">
                    {modal.mode === 'create' ? 'Yeni Şube' : 'Şubeyi Düzenle'}
                  </h2>
                  <button onClick={closeModal} className="p-1.5 text-brown/40 hover:text-charcoal rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal body */}
                <div className="px-6 py-6 space-y-5">
                  {formError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{formError}</p>
                  )}

                  <Field label="Şube Adı" required>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Final Mobilya — İstanbul Bağcılar"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-charcoal placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Şehir" required>
                      <input
                        type="text"
                        value={form.city}
                        onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                        placeholder="İstanbul"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-charcoal placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                      />
                    </Field>
                    <Field label="Sıralama">
                      <input
                        type="number"
                        value={form.sort_order}
                        onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))}
                        placeholder="0"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-charcoal placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                      />
                    </Field>
                  </div>

                  <Field label="Adres" required>
                    <textarea
                      value={form.address}
                      onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                      placeholder="Güneşli Mah. Kuyumcukent No:1, Bağcılar / İstanbul"
                      rows={2}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-charcoal placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all resize-none"
                    />
                  </Field>

                  <Field label="Telefon" required>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      placeholder="0212 000 00 00"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-charcoal placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                    />
                  </Field>

                  <Field label="Google Maps Embed URL">
                    <input
                      type="text"
                      value={form.map_url}
                      onChange={e => setForm(p => ({ ...p, map_url: e.target.value }))}
                      placeholder="https://www.google.com/maps/embed?..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-charcoal placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                    />
                    <p className="text-xs text-brown/35 mt-1.5">Google Maps &rsquo;Paylaş → Haritayı göm → HTML kopyala&rsquo; ile alınır. src=&ldquo;...&rdquo; içindeki URL&rsquo;yi yapıştırın.</p>
                  </Field>

                  {/* Active toggle */}
                  <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-charcoal">Aktif</p>
                      <p className="text-xs text-brown/40 mt-0.5">Kapalı ise sitede görünmez</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${form.is_active ? 'bg-charcoal' : 'bg-stone'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${form.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>

                {/* Modal footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end sticky bottom-0 bg-white rounded-b-2xl">
                  <button onClick={closeModal}
                    className="px-5 py-2.5 text-sm text-brown/60 hover:text-charcoal border border-gray-200 rounded-xl transition-colors">
                    İptal
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm bg-charcoal text-white rounded-xl hover:bg-gold disabled:opacity-50 transition-colors">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {modal.mode === 'create' ? 'Oluştur' : 'Kaydet'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
