'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, Loader2, X,
  CheckCircle, XCircle, Megaphone,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Campaign {
  id: string;
  title: string;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

type FormState = {
  title: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
};

const emptyForm: FormState = { title: '', is_active: true, start_date: '', end_date: '' };

function isLive(c: Campaign) {
  if (!c.is_active) return false;
  const now = new Date();
  if (c.start_date && new Date(c.start_date) > now) return false;
  if (c.end_date   && new Date(c.end_date)   < now) return false;
  return true;
}

export default function AdminKampanyalarPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState<{ mode: 'create' | 'edit'; data?: Campaign } | null>(null);
  const [form, setForm]           = useState<FormState>(emptyForm);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [toggling, setToggling]   = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  const supabase = createClient();

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    setCampaigns((data as Campaign[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setFormError('');
    setModal({ mode: 'create' });
  };

  const openEdit = (c: Campaign) => {
    setForm({
      title: c.title,
      is_active: c.is_active,
      start_date: c.start_date ? c.start_date.slice(0, 16) : '',
      end_date:   c.end_date   ? c.end_date.slice(0, 16)   : '',
    });
    setFormError('');
    setModal({ mode: 'edit', data: c });
  };

  const closeModal = () => { setModal(null); setFormError(''); };

  const handleSave = async () => {
    if (!form.title.trim()) { setFormError('Kampanya metni zorunludur.'); return; }
    setSaving(true);
    setFormError('');

    const payload = {
      title: form.title.trim(),
      is_active: form.is_active,
      start_date: form.start_date || null,
      end_date:   form.end_date   || null,
    };

    let error;
    if (modal?.mode === 'create') {
      ({ error } = await supabase.from('campaigns').insert(payload));
    } else if (modal?.data) {
      ({ error } = await supabase.from('campaigns').update(payload).eq('id', modal.data.id));
    }

    setSaving(false);
    if (error) { setFormError('Kaydedilemedi. Tekrar deneyin.'); return; }
    closeModal();
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kampanyayı silmek istediğinize emin misiniz?')) return;
    setDeleting(id);
    await supabase.from('campaigns').delete().eq('id', id);
    setDeleting(null);
    setCampaigns(p => p.filter(c => c.id !== id));
  };

  const handleToggle = async (c: Campaign) => {
    setToggling(c.id);
    await supabase.from('campaigns').update({ is_active: !c.is_active }).eq('id', c.id);
    setCampaigns(p => p.map(x => x.id === c.id ? { ...x, is_active: !x.is_active } : x));
    setToggling(null);
  };

  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-serif text-charcoal">Kampanyalar</h1>
          <p className="text-sm text-brown/50 mt-1">Üst bant kampanyalarını yönetin</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white text-sm rounded-xl hover:bg-gold transition-colors"
        >
          <Plus className="w-4 h-4" /> Yeni Kampanya
        </button>
      </div>

      {/* Campaign list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-brown/30" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="py-20 text-center">
            <Megaphone className="w-8 h-8 text-brown/20 mx-auto mb-2" />
            <p className="text-brown/30 text-sm">Henüz kampanya yok</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-brown/50 uppercase tracking-wider border-b border-gray-50">
                  <th className="px-6 py-3 font-medium">Kampanya Metni</th>
                  <th className="px-6 py-3 font-medium">Durum</th>
                  <th className="px-6 py-3 font-medium">Başlangıç</th>
                  <th className="px-6 py-3 font-medium">Bitiş</th>
                  <th className="px-6 py-3 font-medium">Oluşturuldu</th>
                  <th className="px-6 py-3 font-medium text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {campaigns.map(c => {
                  const live = isLive(c);
                  return (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm text-charcoal font-medium max-w-xs truncate">{c.title}</p>
                        {live && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium mt-0.5">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            Şu an yayında
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggle(c)}
                          disabled={toggling === c.id}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${c.is_active ? 'bg-charcoal' : 'bg-stone'}`}
                        >
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${c.is_active ? 'translate-x-4' : 'translate-x-0.5'}`} />
                        </button>
                        <span className={`ml-2 text-xs font-medium ${c.is_active ? 'text-charcoal' : 'text-brown/40'}`}>
                          {c.is_active ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-brown/50">{fmt(c.start_date)}</td>
                      <td className="px-6 py-4 text-sm text-brown/50">{fmt(c.end_date)}</td>
                      <td className="px-6 py-4 text-sm text-brown/40">
                        {new Date(c.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => openEdit(c)}
                            className="p-2 text-brown/40 hover:text-charcoal hover:bg-gray-100 rounded-lg transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id}
                            className="p-2 text-brown/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40">
                            {deleting === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
              <div className="bg-white rounded-2xl shadow-modal w-full max-w-lg pointer-events-auto">
                {/* Modal header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                  <h2 className="font-serif text-lg text-charcoal">
                    {modal.mode === 'create' ? 'Yeni Kampanya' : 'Kampanyayı Düzenle'}
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

                  {/* Title */}
                  <div>
                    <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2">
                      Kampanya Metni *
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                      placeholder="Yazım kampanyası · %20 indirim · Sınırlı süre!"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-charcoal placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                    />
                    <p className="text-xs text-brown/35 mt-1.5">Üst bantta görünecek kısa metin.</p>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2">
                        Başlangıç
                      </label>
                      <input
                        type="datetime-local"
                        value={form.start_date}
                        onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                      />
                      <p className="text-xs text-brown/35 mt-1">Boş = hemen başlar</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2">
                        Bitiş
                      </label>
                      <input
                        type="datetime-local"
                        value={form.end_date}
                        onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                      />
                      <p className="text-xs text-brown/35 mt-1">Boş = süresiz</p>
                    </div>
                  </div>

                  {/* Active toggle */}
                  <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-charcoal">Aktif</p>
                      <p className="text-xs text-brown/40 mt-0.5">Kapalı ise hiç gösterilmez</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${form.is_active ? 'bg-charcoal' : 'bg-stone'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${form.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {/* Live preview */}
                  {form.title.trim() && (
                    <div>
                      <p className="text-xs font-semibold text-charcoal/50 uppercase tracking-wider mb-2">Önizleme</p>
                      <div className="bg-gold/90 px-6 py-2.5 rounded-xl text-center">
                        <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-charcoal">{form.title}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
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
