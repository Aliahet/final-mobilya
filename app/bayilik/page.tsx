'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package, Truck, Award, Users, Phone,
  Mail, Building2, MapPin, MessageSquare,
  CheckCircle, Loader2, ArrowRight,
} from 'lucide-react';

const benefits = [
  {
    icon: Package,
    title: 'Premium Ürün Tedariki',
    desc: 'El işçiliği ve yüksek kaliteli malzemelerle üretilen koleksiyonlarımıza bayi olarak öncelikli erişim sağlayın.',
  },
  {
    icon: Award,
    title: 'Marka & Pazarlama Desteği',
    desc: 'Katalog, görsel materyal ve dijital pazarlama araçlarıyla desteklenerek bölgenizdeki gücünüzü artırın.',
  },
  {
    icon: Truck,
    title: 'Lojistik Altyapısı',
    desc: 'Tüm Türkiye\'ye güvenli ve hızlı teslimat altyapımızla stoklarınızı zamanında teslim alın.',
  },
  {
    icon: Users,
    title: 'Satış & Eğitim Danışmanlığı',
    desc: 'Dedicated bayi koordinatörü ve düzenli eğitim programlarıyla satışlarınızı büyütün.',
  },
];

const stats = [
  { value: '200+', label: 'Aktif Bayi' },
  { value: '30+', label: 'Yıl Tecrübe' },
  { value: '81', label: 'İlde Teslimat' },
  { value: '%95', label: 'Bayi Memnuniyeti' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function BayilikPage() {
  const [form, setForm] = useState({
    full_name: '',
    company_name: '',
    city: '',
    phone: '',
    email: '',
    message: '',
  });
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');

  const update = (field: keyof typeof form, value: string) =>
    setForm(p => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/bayilik', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="bg-cream min-h-screen">

      {/* ── Hero ── */}
      <section className="relative bg-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #C4A45A 0, #C4A45A 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-6"
          >
            Bayilik Programı
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.6 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream leading-tight mb-6"
          >
            FINAL MOBİLYA ile<br />
            <span className="text-gold">Kazanç Ortaklığı</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.5 }}
            className="text-stone/60 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-12"
          >
            30 yıllık deneyim ve 200'ü aşkın aktif bayiyle büyüyen bir ağın parçası olun.
            Bölgenizdeki premium mobilya segmentini birlikte büyütelim.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto"
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-serif text-3xl text-gold mb-1">{s.value}</p>
                <p className="text-[11px] text-stone/50 tracking-wide uppercase">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-gold mb-3">Neden Final Mobilya?</p>
          <h2 className="font-serif text-3xl text-charcoal">Bayi Avantajları</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="bg-white rounded-2xl border border-stone/20 p-6 shadow-card hover:shadow-menu transition-shadow duration-300"
            >
              <div className="w-11 h-11 bg-gold/10 rounded-xl flex items-center justify-center mb-4">
                <b.icon className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-serif text-base text-charcoal mb-2">{b.title}</h3>
              <p className="text-sm text-brown/60 leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Application Form ── */}
      <section className="bg-white border-y border-stone/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-gold mb-3">Hemen Başlayın</p>
            <h2 className="font-serif text-3xl text-charcoal mb-3">Bayilik Başvurusu</h2>
            <p className="text-sm text-brown/50">Formu doldurun, bayi koordinatörümüz 2 iş günü içinde sizi arasın.</p>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-5" />
              <h3 className="font-serif text-2xl text-charcoal mb-3">Başvurunuz Alındı!</h3>
              <p className="text-brown/60 text-sm max-w-sm mx-auto">
                Bayi koordinatörümüz en kısa sürede sizinle iletişime geçecektir.
                Sabırsızlıkla bekliyoruz.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                  {error}
                </motion.div>
              )}

              <div className="grid sm:grid-cols-2 gap-5">
                {/* Ad Soyad */}
                <div>
                  <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wider mb-2">Ad Soyad *</label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/30" />
                    <input type="text" required value={form.full_name} onChange={e => update('full_name', e.target.value)}
                      placeholder="Adınız Soyadınız"
                      className="w-full pl-10 pr-4 py-3 bg-cream/60 border border-stone/30 rounded-xl text-sm text-charcoal placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all" />
                  </div>
                </div>

                {/* Firma */}
                <div>
                  <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wider mb-2">Firma Adı *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/30" />
                    <input type="text" required value={form.company_name} onChange={e => update('company_name', e.target.value)}
                      placeholder="Firma / Mağaza Adı"
                      className="w-full pl-10 pr-4 py-3 bg-cream/60 border border-stone/30 rounded-xl text-sm text-charcoal placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all" />
                  </div>
                </div>

                {/* Şehir */}
                <div>
                  <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wider mb-2">Şehir *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/30" />
                    <input type="text" required value={form.city} onChange={e => update('city', e.target.value)}
                      placeholder="İstanbul"
                      className="w-full pl-10 pr-4 py-3 bg-cream/60 border border-stone/30 rounded-xl text-sm text-charcoal placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all" />
                  </div>
                </div>

                {/* Telefon */}
                <div>
                  <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wider mb-2">Telefon *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/30" />
                    <input type="tel" required value={form.phone} onChange={e => update('phone', e.target.value)}
                      placeholder="0 5XX XXX XX XX"
                      className="w-full pl-10 pr-4 py-3 bg-cream/60 border border-stone/30 rounded-xl text-sm text-charcoal placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all" />
                  </div>
                </div>
              </div>

              {/* E-posta */}
              <div>
                <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wider mb-2">E-posta *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/30" />
                  <input type="email" required value={form.email} onChange={e => update('email', e.target.value)}
                    placeholder="firma@mail.com"
                    className="w-full pl-10 pr-4 py-3 bg-cream/60 border border-stone/30 rounded-xl text-sm text-charcoal placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all" />
                </div>
              </div>

              {/* Mesaj */}
              <div>
                <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wider mb-2">Mesajınız</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-brown/30" />
                  <textarea value={form.message} onChange={e => update('message', e.target.value)}
                    rows={4} placeholder="Mağazanız hakkında kısa bilgi verebilir misiniz?"
                    className="w-full pl-10 pr-4 py-3 bg-cream/60 border border-stone/30 rounded-xl text-sm text-charcoal placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all resize-none" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-charcoal text-cream font-medium rounded-xl hover:bg-gold disabled:opacity-50 transition-all duration-300 text-sm">
                {loading
                  ? <Loader2 className="w-5 h-5 animate-spin" />
                  : <><span>Başvuruyu Gönder</span><ArrowRight className="w-4 h-4" /></>
                }
              </button>

              <p className="text-center text-xs text-brown/40">
                Başvurunuz 2 iş günü içinde değerlendirilecektir.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
